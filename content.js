// content.js

// Inject the script into the YouTube page
function injectScript(src) {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(src);
  s.onload = () => s.remove();
  (document.head || document.documentElement).append(s);
}

// Inject the settings script
injectScript("settings.js");
