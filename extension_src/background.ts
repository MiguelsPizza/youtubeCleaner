import { setBackend, div, mul, norm, tensor2d, sum } from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';
import { load, UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';
console.log("background.js loaded");
// Load the model.
setBackend("webgpu");
let model: UniversalSentenceEncoder;
load().then((m) => {
  model = m;
});


chrome.runtime.onMessageExternal.addListener(async function (
  request: { [key: string]: any },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  console.log("background.js received message", request);
  if (request.newInput) {
    console.log('test')
    // Compute a new embedding for the input.
    const newEmbedding = await model.embed([request.newInput]);
    const entertainmentEmbedding = newEmbedding.arraySync();

    // Save the new embedding in Chrome's local storage.
    await chrome.storage.local.set({ entertainmentEmbedding: entertainmentEmbedding });

    sendResponse({ status: "success", entertainmentEmbedding: entertainmentEmbedding });
  }

  if (request.action === "calculateCosineSimilarities") {
    const result = await chrome.storage.local.get("entertainmentEmbedding");
    if (!result.entertainmentEmbedding) return
    const entertainmentEmbedding: number[][] = result.entertainmentEmbedding;
    const embeddings = await model.embed(request.videoTitles);
    const embeddingsArray = embeddings.arraySync();
    const similarities = await cosineSimilarities(embeddingsArray, entertainmentEmbedding);
    console.log({ similarities });

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log({ tab });
    await chrome.tabs.sendMessage(tab.id as number, { similarities: similarities });

    // sendResponse({ status: "success", similarities: similarities });
  }
  return true;
});

async function cosineSimilarities(A: number[][], B: number[][]): Promise<number[][]> {
  let _A = tensor2d(A);
  let _B = tensor2d(B);

  const A_norm = norm(_A, "euclidean", -1).expandDims(-1);
  const B_norm = norm(_B, "euclidean", -1).expandDims(-1);

  const dot_product = sum(mul(_A, _B), -1).expandDims(-1);
  const cosine_similarities = div(dot_product, mul(A_norm, B_norm));

  // Convert the result back to a JavaScript array
  return await cosine_similarities.array() as number[][];
}

// Load the saved embedding from Chrome's local storage when the extension starts.
// chrome.storage.local.get("entertainmentEmbedding").then((result: { [key: string]: any }) => {
//   if (result.entertainmentEmbedding) {
//     entertainmentEmbedding = result.entertainmentEmbedding;
//   }
// });