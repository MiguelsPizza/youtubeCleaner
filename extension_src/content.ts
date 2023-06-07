

let videoTitles: HTMLElement[] | null = null;

async function hideSimilarVideos(): Promise<void> {
  videoTitles = Array.from(document.querySelectorAll<HTMLElement>("#video-title"));
  const titleTexts: string[] = videoTitles.map((titleElement) => titleElement.textContent as string);
  chrome.runtime.sendMessage({ action: "calculateCosineSimilarities", videoTitles: titleTexts });
}

hideSimilarVideos();

chrome.runtime.onMessage.addListener(
  (request: { similarities: number[][] }) => {
    const similarities: number[][] = request.similarities;

    videoTitles?.forEach((titleElement, i) => {
      if (similarities[i][0] < 0.1) return
      console.log("Hiding video", titleElement);
      (titleElement.parentNode as HTMLElement).style.display = "none";
    });
  }
);
