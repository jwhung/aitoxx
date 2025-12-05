// Adapters for different AI sites to locate message elements and content

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
