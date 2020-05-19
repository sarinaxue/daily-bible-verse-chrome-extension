const API_URL = 'https://api.esv.org/v3/passage/text/';

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({
        'url': 'index.html'
    });
});

chrome.extension.onMessage.addListener((request) => {
    if (request.action === 'loadVerse') {
        let date = new Date().getDate();
        getDailyVerse(date)
            .then(function (verse) {
                messageDailyVerse(verse);
            })
            .catch(function (error) {
                alert('error');
                // TODO: fix a placeholder verse
                messageDailyVerse(error.statusText);
            });
    }
});

// send response of API call to content.js
function messageDailyVerse(verse) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { verse: verse });
    });
}

// helper to stringify and uri encode the parameters
function formatParams(params) {
    return '?' + Object
        .keys(params)
        .map(function (key) {
            return key + '=' + encodeURIComponent(params[key])
        })
        .join('&');
}

/**
 *  Call Bible API for a random verse from list of possible references
 *  Note: Uses stored verse from cache if date is the same
 **/
function getDailyVerse(currDate) {
    let storedData = fetchDBVData();
    if (storedData && currDate === storedData.date) return storedData;
    let params = {
        'q': 'John 3:16', // hardcoded for now
        'include-passage-references': false,
        'include-verse-numbers': false,
        'include-first-verse-numbers': false,
        'include-footnotes': false,
        'include-footnote-body': false,
        'include-headings': false,
        'include-short-copyright': false
    };
    let xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let response = JSON.parse(xhr.responseText);
                    let DBVData = {
                        verse: response.passages,
                        reference: response.canonical,
                        date: currDate
                    };
                    storeDBVData(DBVData);
                    resolve(response);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            }
        };
        xhr.open('GET', API_URL + formatParams(params), true);
        xhr.setRequestHeader('Authorization', 'Token ' + API_KEY);
        xhr.send();

    });
}

function storeDBVData(data) {
    chrome.storage.sync.set({ data: data });
}

function fetchDBVData(data) {
    chrome.storage.sync.get(['data'], (result) => {
        return result;
    });
}
