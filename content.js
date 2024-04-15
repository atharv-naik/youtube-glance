// content.js

// injects script into the YouTube page
function injectScript(src) {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(src);
  s.onload = () => s.remove();
  (document.head || document.documentElement).append(s);
}

// inject scripts
injectScript("toggle-endcards.js");
injectScript("popup-comments.js");
injectScript("snap-comments.js");
