// Adapters for different AI sites to locate message elements and content
console.log('AITOXX Content Script v1.0.3 loaded');

const Adapters = {
    'chatgpt.com': {
        name: 'ChatGPT',
        // Selector for the container of all messages
        containerSelector: 'main',
        // Selector for individual message blocks (assistant only)
        messageSelector: '[data-message-author-role="assistant"]',
        // Selector to get the text content within a message
        contentSelector: '.markdown',
        // Where to append the button
        buttonContainerSelector: '.text-base'
    },
    'chat.openai.com': { // Legacy/Alternative domain
        name: 'ChatGPT',
        containerSelector: 'main',
        messageSelector: '[data-message-author-role="assistant"]',
        contentSelector: '.markdown',
        buttonContainerSelector: '.text-base'
    },
    'gemini.google.com': {
        name: 'Gemini',
        containerSelector: 'body', // Gemini structure is complex, body observer is safer
        messageSelector: 'model-response', // Custom element often used
        contentSelector: '.model-response-text, .message-content', // Fallback selectors
        buttonContainerSelector: '.response-container-footer, .message-footer'
    },
    'qianwen.com': {
        name: 'Qianwen',
        containerSelector: '#root, body',
        messageSelector: '.ant-card-body, .message-item', // Generic guess, needs refinement
        contentSelector: '.markdown-body',
        buttonContainerSelector: '.message-actions'
    },
    'qianwen.aliyun.com': {
        name: 'Qianwen',
        containerSelector: '#root, body',
        messageSelector: '.ant-card-body, .message-item',
        contentSelector: '.markdown-body',
        buttonContainerSelector: '.message-actions'
    },
    'www.doubao.com': {
        name: 'Doubao',
        containerSelector: 'body',
        messageSelector: '.message-content', // Generic guess
        contentSelector: '.markdown-body',
        buttonContainerSelector: '.message-footer'
    }
};

// Helper to determine current adapter
function getAdapter() {
    const hostname = window.location.hostname;
    for (const domain in Adapters) {
        if (hostname.includes(domain)) {
            return Adapters[domain];
        }
    }
    return null;
}

// Main content script

let currentAdapter = null;
let flomoConfig = { apiUrl: null, tags: '' };

// Initialize
(async () => {
    currentAdapter = getAdapter();
    if (!currentAdapter) {
        console.log('AI to Flomo: No adapter found for this site.');
        return;
    }

    console.log(`AI to Flomo: Active for ${currentAdapter.name}`);

    // Load config
    const items = await chrome.storage.sync.get(['flomoApiUrl', 'flomoTags']);
    flomoConfig.apiUrl = items.flomoApiUrl;
    flomoConfig.tags = items.flomoTags || '';

    // Start observing
    observeMessages();
})();

function observeMessages() {
    const observer = new MutationObserver((mutations) => {
        // Debounce or check efficiently
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                processNodes(mutation.addedNodes);
            }
        }
    });

    const container = document.querySelector(currentAdapter.containerSelector) || document.body;
    observer.observe(container, { childList: true, subtree: true });

    // Initial scan
    const existingMessages = document.querySelectorAll(currentAdapter.messageSelector);
    existingMessages.forEach(injectButton);
}

function processNodes(nodes) {
    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if node itself is a message
            if (node.matches && node.matches(currentAdapter.messageSelector)) {
                injectButton(node);
            }
            // Check children
            const messages = node.querySelectorAll ? node.querySelectorAll(currentAdapter.messageSelector) : [];
            messages.forEach(injectButton);
        }
    });
}

function injectButton(messageNode) {
    if (messageNode.dataset.flomoInjected) return;

    // Find where to put the button
    // Try specific container first, else append to message node
    let targetContainer = messageNode;
    if (currentAdapter.buttonContainerSelector) {
        const found = messageNode.querySelector(currentAdapter.buttonContainerSelector);
        if (found) targetContainer = found;
    }

    const btn = document.createElement('button');
    btn.className = 'flomo-save-btn';
    btn.textContent = '保存到 Flomo';
    btn.title = '保存这条内容到 Flomo';

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSave(messageNode, btn);
    });

    targetContainer.appendChild(btn);
    messageNode.dataset.flomoInjected = 'true';
}

async function handleSave(messageNode, btn) {
    if (!flomoConfig.apiUrl) {
        alert('请在插件弹窗中配置 Flomo API 地址。');
        return;
    }

    // Extract content
    let content = '';
    const contentNode = messageNode.querySelector(currentAdapter.contentSelector);
    if (contentNode) {
        content = contentNode.innerText; // innerText preserves some formatting
    } else {
        // Fallback
        content = messageNode.innerText;
    }

    // Append tags
    if (flomoConfig.tags) {
        content += `\n\n${flomoConfig.tags}`;
    }

    // UI State: Saving
    btn.textContent = '保存中...';
    btn.classList.add('saving');

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'SAVE_TO_FLOMO',
            data: {
                apiUrl: flomoConfig.apiUrl,
                content: content
            }
        });

        if (response && response.success) {
            btn.textContent = '已保存!';
            btn.classList.remove('saving');
            btn.classList.add('success');
            setTimeout(() => {
                btn.textContent = '保存到 Flomo';
                btn.classList.remove('success');
            }, 3000);
        } else {
            throw new Error(response.error || 'Unknown error');
        }
    } catch (err) {
        console.error('Save failed', err);
        btn.textContent = '错误';
        btn.classList.remove('saving');
        btn.classList.add('error');
        alert(`保存失败: ${err.message}`);
    }
}
