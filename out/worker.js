import {
  AutoTokenizer,
  AutoModelForCausalLM,
  TextStreamer,
  InterruptableStoppingCriteria,
} from "@huggingface/transformers";

console.log('Imported dependencies');

async function check() {
  console.log('Running WebGPU check');
  try {
    const adapter = await navigator.gpu.requestAdapter();
    console.log('Got adapter:', adapter);
    if (!adapter) {
      throw new Error("WebGPU is not supported (no adapter found)");
    }
  } catch (e) {
    console.error('WebGPU check failed:', e);
    self.postMessage({
      status: "error", 
      data: e.toString(),
    });
  }
}

class TextGenerationPipeline {
  static model_id = "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX";

  static async getInstance(progress_callback = null) {
    console.log('Getting pipeline instance');
    try {
      this.tokenizer ??= await AutoTokenizer.from_pretrained(this.model_id, {
        progress_callback,
      });
      console.log('Tokenizer loaded successfully');
      
      this.model ??= await AutoModelForCausalLM.from_pretrained(this.model_id, {
        dtype: "q4f16",
        device: "webgpu", 
        progress_callback,
      });
      console.log('Model loaded successfully');
      
      return [this.tokenizer, this.model];
    } catch (error) {
      console.error('Failed to load model:', error);
      self.postMessage({
        status: "error",
        data: `Model loading failed: ${error.message}`
      });
      throw error;
    }
  }
}

const stopping_criteria = new InterruptableStoppingCriteria();
let past_key_values_cache = null;

async function generate(messages) {
  console.log('Starting generation with messages:', messages);
  const [tokenizer, model] = await TextGenerationPipeline.getInstance();
  console.log('Got tokenizer and model instances');

  const inputs = tokenizer.apply_chat_template(messages, {
    add_generation_prompt: true,
    return_dict: true,
  });
  console.log('Applied chat template:', inputs);

  const [START_THINKING_TOKEN_ID, END_THINKING_TOKEN_ID] = tokenizer.encode("<think></think>", {
    add_special_tokens: false,
  });
  console.log('Thinking tokens:', START_THINKING_TOKEN_ID, END_THINKING_TOKEN_ID);

  let state = "thinking";
  let startTime;
  let numTokens = 0;
  let tps;

  const token_callback_function = (tokens) => {
    console.log('Token callback:', tokens);
    startTime ??= performance.now();
    if (numTokens++ > 0) {
      tps = (numTokens / (performance.now() - startTime)) * 1000;
      console.log('Current TPS:', tps);
    }
    if (tokens[0] === END_THINKING_TOKEN_ID) {
      console.log('Switching to answering state');
      state = "answering";
    }
  };

  const callback_function = (output) => {
    console.log('Output callback:', output);
    self.postMessage({
      status: "update",
      output,
      tps,
      numTokens,
      state,
    });
  };

  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function,
    token_callback_function,
  });
  console.log('Created streamer');

  self.postMessage({ status: "start" });

  const { past_key_values, sequences } = await model.generate({
    ...inputs,
    do_sample: false,
    max_new_tokens: 2048,
    streamer,
    stopping_criteria,
    return_dict_in_generate: true,
  });
  console.log('Generation complete:', sequences);

  past_key_values_cache = past_key_values;

  const decoded = tokenizer.batch_decode(sequences, { skip_special_tokens: true });
  console.log('Decoded output:', decoded);
  self.postMessage({ status: "complete", output: decoded });
}

function handleProgress(event) {
  console.log('Progress event:', event);
  if (!event.total) return;

  if (event.loaded === 0) {
    console.log('Starting file load:', event.url);
    self.postMessage({
      status: "initiate",
      file: event.url || "model data",
      progress: 0,
      total: event.total,
    });
  } else if (event.loaded < event.total) {
    const percent = Math.round((event.loaded / event.total) * 100);
    console.log(`Loading progress: ${percent}%`);
    self.postMessage({
      status: "progress", 
      file: event.url || "model data",
      progress: percent,
      total: 100,
    });
  } else {
    console.log('File load complete:', event.url);
    self.postMessage({
      status: "done",
      file: event.url || "model data",
    });
  }
}

async function load() {
  console.log('Starting model load');
  self.postMessage({ status: "loading", data: "Loading model..." });

  try {
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(handleProgress);
    console.log('Model loaded successfully');
    
    self.postMessage({ status: "loading", data: "Compiling shaders and warming up model..." });
    const inputs = tokenizer("a");
    console.log('Warmup inputs:', inputs);
    await model.generate({ ...inputs, max_new_tokens: 1 });
    console.log('Warmup complete');
    self.postMessage({ status: "ready" });
  } catch (error) {
    console.error('Model load failed:', error);
    self.postMessage({
      status: "error",
      data: `Model load failed: ${error.message}`
    });
  }
}

self.addEventListener("message", async (e) => {
  const { type, data } = e.data;
  console.log('Received message:', type, data);

  switch (type) {
    case "check":
      check();
      break;
    case "load":
      load();
      break;
    case "generate":
      stopping_criteria.reset();
      generate(data);
      break;
    case "interrupt":
      console.log('Interrupting generation');
      stopping_criteria.interrupt();
      break;
    case "reset":
      console.log('Resetting state');
      past_key_values_cache = null;
      stopping_criteria.reset();
      break;
  }
});