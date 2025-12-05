# aitoxx
This is a browser extends about capture ai chat content to your note app.

** Still chating with AI and then forget everything? For easy reviewing, you can now use AITOXX to save the ai memos to your note app. ** 

Now we support follow ai:
- Gemini
- ChatGPT
- Qwen(qianwen.com)
- Doubao(doubao.com)
- ……

And we support follow note apps:
- Flomo
- ……

--- 

AITOXX Extension Walkthrough
Overview
AITOXX is a Chrome extension that allows you to capture chat content from various AI platforms (Gemini, ChatGPT, Qianwen, Doubao) and save it directly to your Flomo notes.

Features
One-click Save: Adds a "保存到 Flomo" (Save to Flomo) button to AI chat messages.
Multi-platform Support: Works on Gemini, ChatGPT, Qianwen, and Doubao.
Custom Tags: Automatically appends configured tags (e.g., #AI) to saved notes.
Secure Configuration: Stores your Flomo API URL securely in your browser's local storage.
Installation & Setup
Load Extension:

Open Chrome and go to chrome://extensions/.
Enable "Developer mode" (top right).
Click "Load unpacked" and select the d:\Code\aitoxx directory.
Configuration:

Click the AITOXX extension icon in your toolbar.
Enter your Flomo API URL.
(Optional) Enter default tags (e.g., #AI).
Click "保存设置" (Save Settings).
Usage
Open a supported AI chat site (e.g., Gemini).
When the AI generates a response, you will see a "保存到 Flomo" button appear (usually at the bottom of the message).
Click the button. It will change to "保存中..." and then "已保存!" upon success.
Check your Flomo app to see the saved note!
Files Created
manifest.json: Extension configuration.
popup/: User interface for settings.
content/: Scripts that run on AI sites to inject the button.
background.js: Handles the API requests to Flomo.

---


** Vibe coding by Anigravity. **