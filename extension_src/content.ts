

let videoTitles: HTMLElement[] | null = null;

(async function hideSimilarVideos(): Promise<void> {

  videoTitles = Array.from(document.querySelectorAll<HTMLElement>("#video-title"));

  const titleTexts: string[] = videoTitles.map((titleElement) => titleElement.textContent as string);

  chrome.runtime.sendMessage({ action: "calculateCosineSimilarities", videoTitles: titleTexts });

})();

interface Similarity {
  labels: string[]
  scores: number[]
  sequence: string
}


chrome.runtime.onMessage.addListener(
  (request: { similarities: Similarity[] }) => {

    const similarities: Similarity[] = request.similarities;

    if (!similarities) return;

    videoTitles?.forEach((titleElement, i) => {

      if ((similarities[i]?.scores?.[0] ?? 0) < 0.5) return

      console.log("Hiding video", titleElement);

      (titleElement.parentNode as HTMLElement).style.display = "none";

    });
  }
);
