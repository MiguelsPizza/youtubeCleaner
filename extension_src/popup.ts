document.getElementById("form")?.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const newInput = (document.getElementById("input") as HTMLInputElement).value;
  chrome.storage.local.set({ newInput: newInput });
  updateTitle(newInput);

  chrome.runtime.sendMessage({ newInput: newInput });
});


document.addEventListener("DOMContentLoaded", async () => {
  const result = await chrome.storage.local.get(["newInput"]);
  updateTitle(result.newInput);
})

const updateTitle = (input: string): void => {
  if (!input) return
  const titleElement = document.getElementById("title") as HTMLLabelElement;
  if (titleElement) titleElement.innerHTML = `Current Filter: ${input}`;
}


