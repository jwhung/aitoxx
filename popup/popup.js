document.addEventListener('DOMContentLoaded', () => {
    const apiUrlInput = document.getElementById('apiUrl');
    const tagsInput = document.getElementById('tags');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    chrome.storage.sync.get(['flomoApiUrl', 'flomoTags'], (items) => {
        if (items.flomoApiUrl) {
            apiUrlInput.value = items.flomoApiUrl;
        }
        if (items.flomoTags) {
            tagsInput.value = items.flomoTags;
        }
    });

    // Save settings
    saveBtn.addEventListener('click', () => {
        const apiUrl = apiUrlInput.value.trim();
        const tags = tagsInput.value.trim();

        if (!apiUrl) {
            showStatus('请输入有效的 API 地址', 'error');
            return;
        }

        chrome.storage.sync.set({
            flomoApiUrl: apiUrl,
            flomoTags: tags
        }, () => {
            showStatus('设置已保存!', 'success');
            setTimeout(() => {
                // Optional: close popup
                // window.close(); 
            }, 1500);
        });
    });

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type} visible`;

        setTimeout(() => {
            statusDiv.classList.remove('visible');
        }, 3000);
    }
});
