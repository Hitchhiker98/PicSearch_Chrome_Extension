


window.addEventListener("load", async (event) => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let result;
  try {
    [{result}] = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: () => getSelection().toString(),
    });
    console.log("Hello there", result)
    document.getElementById("search-txt").value = result;
  } catch (e) {
    return; // ignoring an unsupported page like chrome://extensions
  }
});



function searchPic() {
 
  const input = document.getElementById("search-txt").value;

  //check if the input is empty
  if (input === "") return "value of the input in empty";

  //encode input value into a valid url
  const url = encodeURIComponent(input);
  const list = document.querySelectorAll("input[type=checkbox]");

  for (var i = 0; i < list.length; i++) {
    if (list[i].checked) {
      switch (list[i].id) {
        case "Duckduckgo":
          chrome.tabs.query({ active: true, currentWindow: true }, function (
            tabs
          ) {
            chrome.tabs.create({
              url:
                "https://duckduckgo.com/?q=" +
                url +
                "&t=h_&iax=images&ia=images&iaf=size%3ALarge",
              index: tabs[0].index + 1,
            });
          });
          break;

        case "Flickr":
          chrome.tabs.query({ active: true, currentWindow: true }, function (
            tabs
          ) {
            chrome.tabs.create({
              url:
                "https://www.flickr.com/search/?text=" +
                url +
                "&dimension_search_mode=min&height=1024&width=1024&license=4%2C5%2C6%2C9%2C10",
              index: tabs[0].index + 1,
            });
          });
          break;

        case "Bing":
          chrome.tabs.query({ active: true, currentWindow: true }, function (
            tabs
          ) {
            chrome.tabs.create({
              url:
                "https://www.bing.com/images/search?q=" +
                url +
                "&qft=+filterui:imagesize-wallpaper&form=IRFLTR&first=1&scenario=ImageBasicHover",
              index: tabs[0].index + 1,
            });
          });
          break;

        case "Yahoo":
          chrome.tabs.query({ active: true, currentWindow: true }, function (
            tabs
          ) {
            chrome.tabs.create({
              url:
                "https://images.search.yahoo.com/search/images;_ylt=AwrExl8FSbVfo5cAj4.JzbkF?p=" +
                url +
                "&ei=UTF-8&fr=sfp&imgsz=large&fr2=p%3As%2Cv%3Ai#id=6&iurl=https%3A%2F%2Fbear.org%2Fwp-content%2Fuploads%2F2008%2F01%2FGriz-Brookfield.jpg&action=close",
              index: tabs[0].index + 1,
            });
          });
          break;

        default:
          console.error("Put proper ids on checkboxes");
      }
    }
  }
}



document.getElementById("hi").onclick = searchPic;