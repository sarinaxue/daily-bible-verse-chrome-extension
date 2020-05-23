chrome.extension.sendMessage({
    action: 'loadContent'
});

// set daily verse
chrome.runtime.onMessage.addListener(
    (request) => {
        if (request && request.data) {
            let message = request.data;
            if (request.type === 'verse') {
                let verse = document.getElementById('verse');
                let ref = document.getElementById('reference');
                let link = document.getElementById('chapter-link');
                verse.textContent = message['passages'];
                ref.textContent = message['canonical'];
                link.href = 'https://esv.org/' + message['canonical'];
                // loading a verse might make a request, so return true to keep message port open while waiting for callback
                return true;
            } else if (request.type === 'image') {
                console.log(message);
                let image_url = message.urls.regular;
                document.body.style.backgroundImage = "url('" + image_url + "')";
            }
        }
    }
);