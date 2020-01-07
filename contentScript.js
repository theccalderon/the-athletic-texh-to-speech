chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  console.log("something happening from the extension");
  if (request.action == "getBody")
  {
    var text = document.body.innerText || {};
    sendResponse({text: text});
  }
});