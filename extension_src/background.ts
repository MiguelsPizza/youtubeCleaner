import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model: use.UniversalSentenceEncoder;

const init = async () => {
  await tf.ready();
  await tf.setBackend("webgpu");
  model = await use.load();
  console.log('backend', await tf.backend())
}
init();

chrome.runtime.onMessage.addListener(async (request: { [key: string]: any }) => {
  if (request.newInput) {
    console.log('test')
    const newEmbedding = await model.embed([request.newInput]);
    const entertainmentEmbedding = await newEmbedding.array();
    await chrome.storage.local.set({ entertainmentEmbedding: entertainmentEmbedding });
  }

  if (request.action === "calculateCosineSimilarities") {

    const result = await chrome.storage.local.get(["entertainmentEmbedding"]);

    if (!result.entertainmentEmbedding) return

    const embeddings = await model.embed(request.videoTitles);
    const embeddingsArray = await embeddings.array();
    const similarities = await cosineSimilarities(embeddingsArray, result.entertainmentEmbedding as number[][]);

    console.log({ similarities });

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id as number, { similarities: similarities });
  }
});

async function cosineSimilarities(A: number[][], B: number[][]): Promise<number[][]> {
  const _A = tf.tensor2d(A);
  const _B = tf.tensor2d(B);

  const A_norm = tf.norm(_A, "euclidean", -1).expandDims(-1);
  const B_norm = tf.norm(_B, "euclidean", -1).expandDims(-1);

  const dot_product = tf.sum(tf.mul(_A, _B), -1).expandDims(-1);
  const cosine_similarities = tf.div(dot_product, tf.mul(A_norm, B_norm));

  return await cosine_similarities.array() as number[][];
}

