async function cosineSimilarities(A: number[][], B: number[][]): Promise<number[][]> {
  const _A = tf.tensor2d(A);
  const _B = tf.tensor2d(B);

  const A_norm = tf.norm(_A, "euclidean", -1).expandDims(-1);
  const B_norm = tf.norm(_B, "euclidean", -1).expandDims(-1);

  const dot_product = tf.sum(tf.mul(_A, _B), -1).expandDims(-1);
  const cosine_similarities = tf.div(dot_product, tf.mul(A_norm, B_norm));

  return await cosine_similarities.array() as number[][];
}

async function main() {
    const newEmbedding = await modelPromise.embed([request.newInput]);
    const entertainmentEmbedding = await newEmbedding.array();

    const embeddings = await model.embed(request.videoTitles);
    const embeddingsArray = await embeddings.array();
    const similarities = await cosineSimilarities(embeddingsArray, result.entertainmentEmbedding as number[][]);

    console.log({ similarities });

}

main();