import DefaultLayout from "@components/page/DefaultLayout";
import DebugGrid from "@components/DebugGrid";
import DefaultActionBar from "@components/page/DefaultActionBar";
import Grid from "@components/Grid";
import Accordion from "@components/Accordion";
import Card from "@components/Card";
import ModalStack from "@components/ModalStack";
import MessagesInterface from "@components/examples/MessagesInterface";
import GPUMonitor from '@components/examples/GPUMonitor';



export async function generateMetadata() {
  return {
    title: "DeepSeek-R1 WebGPU Chat",
    description: "Locally running DeepSeek-R1 in your browser with WebGPU",
  };
}

export default async function Page() {
  return (
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/My_movie_1.mp4">
      <br />
      <DebugGrid />
      <DefaultActionBar />
      <Grid>
        <Accordion defaultValue={true} title="DEEPSEEK R-1 RUNNING LOCALLY IN YOUR BROWSER">
          <br />
          <Card title="GPU UTILIZATION">
            <GPUMonitor />
          </Card>
          <br />
          <Card title="MESSAGES">
            <MessagesInterface />
          </Card>
          <br />
        </Accordion>
      </Grid>
      <ModalStack />
    </DefaultLayout>
  );
} 