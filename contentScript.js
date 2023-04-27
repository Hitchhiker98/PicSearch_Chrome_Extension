var sesl = window.getSelection();
console.log(sesl,"Hello there sire")


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      var sel = document.getSelection().toString();
      console.log(sel)
      if (request.greeting == "hello") {
        sendResponse({farewell: sel});
      } else if ( request.greeting == 'hello1'){
        sendResponse({farewell: sel})
      }
      // return true;
    });