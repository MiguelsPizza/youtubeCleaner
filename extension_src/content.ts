interface localStorage {
  entertainmentEmbedding?: ([number, ...number[]] & { length: 512 }) | null;
}

let videoTitles: HTMLElement[] | null = null;

async function hideSimilarVideos(): Promise<void> {
  console.log("hideSimilarVideos called");

  const result: localStorage = await chrome.storage.local.get("entertainmentEmbedding");
  if (!result.entertainmentEmbedding) return console.log('no prompt to reference')
  const entertainmentEmbedding = result.entertainmentEmbedding;
  console.log("Loaded entertainmentEmbedding from Chrome's local storage");
  console.log({ entertainmentEmbedding });
  videoTitles = Array.from(document.querySelectorAll<HTMLElement>("#video-title"));
  const titleTexts: string[] = videoTitles.map((titleElement) => titleElement.textContent as string);
  console.log({ titleTexts });
  chrome.runtime.sendMessage({ action: "calculateCosineSimilarities", videoTitles: titleTexts });
}

hideSimilarVideos();

chrome.runtime.onMessage.addListener(
  (request: { similarities: number[][] },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void) => {
    console.log("content.js received message", request);
    const similarities: number[][] = request.similarities;

    // For each video, if the similarity is above a certain threshold, hide the video.
    videoTitles?.forEach((titleElement, i) => {
      if (similarities[i][0] > 0.1) {
        console.log("Hiding video", titleElement);
        (titleElement.parentNode as HTMLElement).style.display = "none";
      }
    });
  }
);
