chrome.extension.sendMessage({
    action: 'loadContent'
});

// set daily verse
chrome.runtime.onMessage.addListener(
    (request) => {
        if (request && request.data) {
            let message = request.data;
            if (request.type === 'verse') {
                let verse = document.getElementById('dailyVerse');
                let ref = document.getElementById('reference');
                verse.textContent = message['passages'];
                ref.textContent = message['canonical'];
                // loading a verse might make a request, so return true to keep message port open while waiting for callback
                return true;
            } else if (request.type === 'image') {
                console.log(message);
                let image_url = message.urls.regular;
                document.body.style.background = "#f3f3f3 url('"+image_url+"') no-repeat center";
            }
        }
    }
);
