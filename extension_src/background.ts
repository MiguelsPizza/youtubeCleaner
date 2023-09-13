import { pipeline, env, Pipeline } from "@xenova/transformers"
// import * as tf from "@tensorflow/tfjs"
import  CustomCache  from "./cache";


env.useBrowserCache = false;
//@ts-ignore
env.useCustomCache = true;
//@ts-ignore
env.customCache = new CustomCache('transformers-cache');

//Due to the lack of WebGPU support in service workers, we must use the WASM backend.
//See https://github.com/gpuweb/gpuweb/issues/4197 for more information.
env.backends.onnx.wasm.numThreads = 1;
env.localModelPath = './models';
// Due to a bug in onnxruntime-web, we must disable multithreading for now.
// See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
env.backends.onnx.wasm.numThreads = 1;

interface PipelineSingleton {
  task: string;
  model: string;
  instance: Pipeline | Promise<Pipeline> | null;
}


class PipelineSingleton implements PipelineSingleton {
  static task = 'zero-shot-classification';
  static model = 'MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli';
  static instance: Pipeline | Promise<Pipeline> | null = null;

  static async getInstance(progress_callback: Function | undefined) {
    if (this.instance === null) {


      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}


(async function () {
  const classifier: Pipeline = await PipelineSingleton.getInstance((progress: any) => { console.log({ progress }) })
  const sequence_to_classify = "Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app."
  const candidate_labels = ["mobile", "website", "billing", "account access"]
  console.time("start")
  const output = await classifier(sequence_to_classify, candidate_labels)
  console.timeEnd("start")
  console.log({ output })
})()


chrome.runtime.onMessage.addListener(async (request: { [key: string]: any }) => {
  console.log({ request })
  if (request.newInput) {
    await chrome.storage.local.set({ labels: request.newInput });
  }
  if (request.action === "calculateCosineSimilarities") {

    const result = await chrome.storage.local.get(["labels"]);
    if (!result.labels) return

    const classifier: Pipeline = await PipelineSingleton.getInstance((progress: any) => { console.log({ progress }) })
    console.log({ classifier })

    const similaritiesPromises= request.videoTitles.map((title: string) => classifier(title, result.labels))
    console.log({ similaritiesPromises })

    console.time("start")
    const similarities = await Promise.all(similaritiesPromises)
    console.timeEnd("start")

    console.log({ similarities })


    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tab2 = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log({ tab, tab2 })
    if (!tab) return
    chrome.tabs.sendMessage(tab.id as number, { similarities: similarities });
  }
});




