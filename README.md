# r1-web

A web interface for running Deepseek R1 directly in your browser. This project runs the `DeepSeek-R1-Distill-Qwen-1.5B-ONNX` model entirely client-side using WebGPU acceleration - no server or API calls needed.

Built using [SRCL](https://github.com/internet-development/www-sacred), a React component library for terminal-aesthetic web applications.

## Features

- Run Deepseek R1 model inference directly in browser using WebGPU
- Uses the optimized `DeepSeek-R1-Distill-Qwen-1.5B-ONNX` model
- Web Worker based processing for smooth UI performance
- Built with Next.js 15 and React 19
- ONNX Runtime Web for efficient model execution
- Fully client-side - no data leaves your browser

## Requirements

- Node.js >= 18.18.0
- npm or yarn
- Browser with WebGPU support (Chrome Canary or Chrome 119+ recommended)

## Installation

```bash
# Clone the repository
git clone https://github.com/sdan/r1-web.git
cd r1-web

# Install dependencies
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:10000`

## Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Scripts

- `npm run dev` - Start development server on port 10000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linting

## Tech Stack

- Next.js 15.1.3
- React 19.0.0
- ONNX Runtime Web with WebGPU backend
- HuggingFace Transformers.js
- Web Workers API
- SRCL Component Library
- TypeScript
- SASS

## How It Works

The application loads and runs the Deepseek R1 model entirely in your browser:

1. Model is downloaded and loaded into WebGPU memory
2. Processing happens in a Web Worker to keep the UI responsive
3. Uses ONNX Runtime Web with WebGPU acceleration for fast inference
4. Text generation streams tokens in real-time to the UI

## Credits

Built with [SRCL](https://github.com/internet-development/www-sacred) - an open-source React component library for terminal aesthetics.

## License

MIT License - See [LICENSE.md](LICENSE.md) for details

