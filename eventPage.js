chrome.omnibox.onInputEntered.addListener(
    async function(text) {
      // Encode user input for special characters , / ? : @ & = + $ #
      var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text) + "&tbm=isch&tbs=isz:l&hl=en&sa=X&ved=0CAEQpwVqFwoTCLjL6MSk5OwCFQAAAAAdAAAAABAC&biw=750&bih=7235#search";
      const [tabs] = await chrome.tabs.query({active: true, currentWindow: true});
      let result;
            //   console.log(tab, tab[0].index);
            chrome.tabs.create({ url: newURL, index: tabs.index + 1 }, async function(tab){

                function example(){
                    let favicon = document.createElement('link');
                    var icon = chrome.runtime.getURL("Pics/GoogleBlue.png");
                    favicon.setAttribute('rel', 'shortcut icon');
                    favicon.setAttribute('href', icon);
                    let head = document.querySelector('head');
                    head.appendChild(favicon);
                    
                }
                try {
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        function: example
                      });
                
                  } catch (e) {
                    return; // ignoring an unsupported page like chrome://extensions
                  }
               
                console.log(tabs.favIconUrl)
            });
     
     
    });


    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {        
    //         chrome.downloads.download({
    //             url:`${request.message}`,
    //             conflictAction: `uniquify`
    //         }, function (id){
    //             console.log(id);
    //         })
    //     });





const generic = {
    "id": "generic",
    "title": "TinEye Search",
    "contexts": ["image"]
};

const combinedItem = {
    "id": "combinedKit",
    "title": "Combined Search",
    "contexts": ["selection"]
};

const wikiItem = {
    "id": "wikiKit",
    "title": "Wikipedia Page Search",
    "contexts": ["selection"]
};

const googleItem = {
    "id": "googleKit",
    "title": "Google Image Search",
    "contexts": ["selection"]
};

//create contextMenus once immediately after instillation to avoid duplicate contextmenu errors
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(generic);
    chrome.contextMenus.create(combinedItem);
    chrome.contextMenus.create(googleItem);
    chrome.contextMenus.create(wikiItem);
});



//[] is replaced by %5B%5D at URL encoding time.
function fixedEncodeURI (str) {
    return encodeURI(str).replace(/%5B/g,'[').replace(/%5D/g,']');
}

 function test(argument, selectionText) {
    let url = {
        google: ["https://www.google.com/search?q=", "&tbm=isch&tbs=isz:l&hl=en&sa=X&ved=0CAEQpwVqFwoTCLjL6MSk5OwCFQAAAAAdAAAAABAC&biw=750&bih=7235"],
        wikipedia: ["https://en.wikipedia.org/w/index.php?search="]
    }
    if(argument === googleItem["id"]) {
        return url["google"][0] + encodeURI(selectionText) + url["google"][1];
        
    } else if (argument === wikiItem["id"]){
        return url["wikipedia"][0] + encodeURI(selectionText);
    }
}




chrome.contextMenus.onClicked.addListener(async function(clickData, tab){ 
    const selection = clickData.selectionText;
    
    if(clickData.menuItemId === googleItem["id"] && selection){
        const googleUrl =  await test(googleItem["id"], selection);
        chrome.tabs.create({url: googleUrl, index: tab.index + 1}); 
    } else if(clickData.menuItemId === wikiItem["id"] && selection) {
        const  wikiUrl =  await test(wikiItem["id"], selection);
        chrome.tabs.create({url: wikiUrl, index: tab.index + 1}); 
    } else if(clickData.menuItemId === combinedItem["id"] && selection) {
        const  googleUrl =  await test(googleItem["id"], selection);
        const  wikiUrl =  await test(wikiItem["id"], selection);
        chrome.tabs.create({url: googleUrl, index: tab.index + 1}); 
        chrome.tabs.create({url: wikiUrl, index: tab.index + 1});
    } else if(clickData.menuItemId === "generic") {
        const imageLink = clickData.srcUrl
        console.log(imageLink, clickData)
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const TINEYE = "https://tineye.com/";
            chrome.tabs.create({url: TINEYE, index: tabs[0].index + 1}, function(tab){
                function test(arg){
                    window.addEventListener('load', (event) => {
                        setTimeout(function(){
                         let element = document.getElementsByClassName("image-url");
                         element[0].value = `${arg}`;
                         let button = document.getElementById("url_submit")
                         button.click();
                        }, 700)
                   })
                }

                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: test,
                    args: [imageLink],
                  });
            });
        })
    }
})


chrome.runtime.onInstalled.addListener((reason) => {
    chrome.commands.getAll((item) => {
        console.log(item, "hey there ")
    }
      )
});


chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
});



chrome.commands.onCommand.addListener(function(command, tab) {
    console.log(tab)
    if (command == "googleSearch") {
             chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, async function(response){
                let selectedText = response.farewell;
                let googleUrl = await test("googleKit", selectedText);
                chrome.tabs.create({url: googleUrl, index: tab.index + 1});
             });
    } else if (command == "wikiSearch") {
            chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, async function(response){
                let selectedText = response.farewell;
                let wikiUrl = await test("wikiKit", selectedText);
               chrome.tabs.create({url: wikiUrl, index: tab.index + 1});
            });
    } else if (command == "combinedSearch") {
            chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, async function(response){
            let selectedText = response.farewell;
            let wikiUrl = await test("wikiKit", selectedText);
            let googleUrl = await test("googleKit", selectedText);
               chrome.tabs.create({url: googleUrl, index: tab.index + 1});
               chrome.tabs.create({url: wikiUrl, index: tab.index + 1});
            });
    }


    // console.log('onCommand event received for message: ', selection);

  
});

// selection = Window.getSelection()
// console.log(selection, "HEY THERE BUSTER")
