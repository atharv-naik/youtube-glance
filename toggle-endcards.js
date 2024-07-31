function toggleEndcards(shouldHide) {
  document.querySelectorAll(".ytp-ce-element").forEach((element) => {
    element.style.display = shouldHide ? "none" : "unset";
  });
}

function waitForElement(selector, callback, interval = 1000) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => waitForElement(selector, callback, interval), interval);
  }
}

async function initEndcardToggle() {
  waitForElement(".ytp-panel-menu", async (settingsMenu) => {
    const toggleOption = document.createElement("div");
    toggleOption.className = "ytp-menuitem";
    toggleOption.role = "menuitemcheckbox";
    
    const data = await chrome.storage.sync.get(["hideEndcards"]);
    toggleOption.ariaChecked = data.hideEndcards ? "true" : "false";
    
    toggleOption.tabIndex = 0;
    toggleOption.innerHTML = `
      <div class="ytp-menuitem-icon">
          <svg height="24" width="24" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v2h-2zm0 4h2v4h-2z" fill="white"></path>
          </svg>
      </div>
      <div class="ytp-menuitem-label">
          Hide endcards
      </div>
      <div class="ytp-menuitem-content">
          <div class="ytp-menuitem-toggle-checkbox">
          </div>
      </div>
    `;

    toggleOption.addEventListener("click", () => {
      const isChecked = toggleOption.ariaChecked === "false";
      toggleEndcards(isChecked);
      toggleOption.ariaChecked = isChecked ? "true" : "false";
      
      chrome.storage.sync.set({ hideEndcards: isChecked });
    });

    settingsMenu.appendChild(toggleOption);

    toggleEndcards(toggleOption.ariaChecked === "true");
  });
}

initEndcardToggle();
 