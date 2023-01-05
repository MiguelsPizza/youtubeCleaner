const classifications = ['this website is entertainment', 'this website is informative']


browser.webRequest.onBeforeRequest.addListener(async res => {
  const store = await browser.storage.local.get('key')
  const OPENAI_API_KEY = store?.key ?? null
  if (!OPENAI_API_KEY) return
  console.log(res.url, 'res.url')
  const url = new URL(res.url)
  const params = new URLSearchParams(url.search)

  // const urlEmbedding = await getEmbdding(url.href, OPENAI_API_KEY)
  // const classEmbeddings1 = await getEmbdding(classifications[0], OPENAI_API_KEY)
  // const classEmbeddings2 = await getEmbdding(classifications[1], OPENAI_API_KEY)

  const [urlEmbedding, classEmbeddings1, classEmbeddings2] = await Promise.all([
    getEmbdding(url.href, OPENAI_API_KEY),
    getEmbdding(classifications[0], OPENAI_API_KEY),
    getEmbdding(classifications[1], OPENAI_API_KEY)
  ])



  const [entertaimnetVal, informativeVal] = [classEmbeddings1, classEmbeddings2].map(classEmbedding => {
    const urlVal = urlEmbedding.data[0].embedding
    const classVal = classEmbedding.data[0].embedding
    return cosineSimilarity(urlVal, classVal)
  })

  const numVal = entertaimnetVal - informativeVal

  console.log(numVal, 'numVal')
  if (parseFloat(numVal) > 0) {
    return {
      cancel: true
    }
  }
},
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
)


const getEmbdding = async (string, OPENAI_API_KEY) => {
  const embedding = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(
      {
        "input": string,
        "model": "text-embedding-ada-002"
      }
    ),
  })
  return await embedding.json()
}


const cosineSimilarity = (vec1, vec2) => {
  let dotProduct = 0, norm1 = 0, norm2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}