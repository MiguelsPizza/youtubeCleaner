document.getElementById("form")?.addEventListener("submit", function (event) {
  event.preventDefault()
  console.log("submitted")
  const newInput = (document.getElementById("input") as HTMLInputElement).value
  chrome.runtime.sendMessage({ newInput: newInput })
})
