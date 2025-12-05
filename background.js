// Background script to handle API requests (avoiding CORS in content scripts)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SAVE_TO_FLOMO') {
        saveToFlomo(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Will respond asynchronously
    }
});

async function saveToFlomo(data) {
    const { apiUrl, content } = data;

    if (!apiUrl) {
        throw new Error('Flomo API URL is not configured.');
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
}
