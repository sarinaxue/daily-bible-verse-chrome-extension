chrome.extension.sendMessage({
    action: 'loadVerse'
});

// set daily verse
chrome.runtime.onMessage.addListener(
    (request) => {
        if (request && request.verse) {
            let message = request.verse;
            let verse = document.getElementById('dailyVerse');
            let ref = document.getElementById('reference');
            verse.textContent = message['passages'];
            ref.textContent = message['canonical'];
            // loading a verse might make a request, so return true to keep message port open while waiting for callback
            return true;
        }
    }
);
