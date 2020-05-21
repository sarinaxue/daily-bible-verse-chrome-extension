const esv_url = 'https://api.esv.org/v3/passage/text/';
const unsplash_url = 'https://api.unsplash.com/search/photos/';

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({
        'url': 'index.html'
    });
});

chrome.extension.onMessage.addListener((request) => {
    if (request.action === 'loadContent') {
        //let date = new Date().getDate();
        let reference = 'John 3:16'; // hardcoded for now
        getVerse(reference);
        getImage();
    }
});


function messageData(type, data) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (type === 'verse') {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'verse', data: data });
        } else if (type == 'image') {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'image', data: data });
        } 
    });
}


/**
 *  Helper to stringify and uri encode the parameters
 **/
function formatParams(params) {
    return '?' + Object
        .keys(params)
        .map(function (key) {
            return key + '=' + encodeURIComponent(params[key])
        })
        .join('&');
}

/**
 *  Calls esv API to retrieve specified verse
 **/
function getVerse(reference) {
    let params = {
        'q': reference,
        'include-passage-references': false,
        'include-verse-numbers': false,
        'include-first-verse-numbers': false,
        'include-footnotes': false,
        'include-footnote-body': false,
        'include-headings': false,
        'include-short-copyright': false
    };
    let headers = { 'Authorization': 'Token ' + esv_key };
    fetch(esv_url + formatParams(params), { headers: headers })
        .then((response) => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            // Examine the text in the response
            response.json().then((data) => {
                messageData('verse', data);
            });
        })
        .catch((err) => {
            alert('error');
        });
}

/**
 *  Call unsplash API to retrieve random landscape image
 **/
function getImage() {
    let params = {
        'client_id': unsplash_access_key,
        'per_page' : 1,
        'orientation': 'landscape',
        'query': 'mountain,sky,ocean,nature,sunset'
    };
    fetch(unsplash_url + formatParams(params))
    .then((response) => {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }
        // Examine the text in the response
        response.json().then((data) => {
            let image = data.results[0];
            messageData('image', image);
            return;
        });
    })
    .catch((err) => {
        alert('error');
    });
}

/*
function storeDBVData(data) {
    chrome.storage.sync.set({ data: data });
}

function fetchDBVData(data) {
    chrome.storage.sync.get(['data'], (result) => {
        return result;
    });
}
*/
