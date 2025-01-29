import DefaultLayout from "@components/page/DefaultLayout";
import DebugGrid from "@components/DebugGrid";
import DefaultActionBar from "@components/page/DefaultActionBar";
import Grid from "@components/Grid";
import Accordion from "@components/Accordion";
import Card from "@components/Card";
import ModalStack from "@components/ModalStack";
import MessagesInterface from "@components/examples/MessagesInterface";

export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "DeepSeek-R1 WebGPU Chat",
    description: "Locally running DeepSeek-R1 in your browser with WebGPU",
  };
}

export default async function Page() {
  return (
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/template-app-icon.png">
      <br />
      <DebugGrid />
      <DefaultActionBar />
      <Grid>
        <Accordion defaultValue={true} title="DEEPSEEK R-1 RUNNING LOCALLY IN YOUR BROWSER">
          <br />
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