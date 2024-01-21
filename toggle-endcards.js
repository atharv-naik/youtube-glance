// toggle-endcards.js

// toggles YouTube endcards
function toggleEndcards(shouldHide) {
  document.querySelectorAll(".ytp-ce-element").forEach((element) => {
    element.style.display = shouldHide ? "none" : "unset";
  });
}

// adds toggle option to YouTube player settings
function addToggleOption() {
  // check if the settings menu is available
  const settingsMenu = document.querySelector(".ytp-panel-menu");

  if (settingsMenu === null) {
    // if not, try again in 1 second
    return setTimeout(addToggleOption, 1000);
  }

  // create a new menu item for the toggle option
  const toggleOption = document.createElement("div");
  toggleOption.className = "ytp-menuitem";
  toggleOption.role = "menuitemcheckbox";
  toggleOption.ariaChecked = false;
  toggleEndcards.tabIndex = 0;
  toggleOption.innerHTML = `
    <div class="ytp-menuitem-icon">
        <svg height="24" width="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v2h-2zm0 4h2v4h-2z" fill="white"></path></svg>
    </div>
    <div class="ytp-menuitem-label">
        Hide endcards
    </div>
    <div class="ytp-menuitem-content">
        <div class="ytp-menuitem-toggle-checkbox">
        </div>
    </div>
    `;

  // listen for click events on the toggle option
  toggleOption.addEventListener("click", function () {
    const isChecked = true ? toggleOption.ariaChecked === "false" : true;
    toggleEndcards(isChecked);
    toggleOption.ariaChecked = isChecked;
  });

  // appends the toggle option to the settings menu
  settingsMenu.appendChild(toggleOption);
}

// wait for the page to load
window.addEventListener("load", function () {
  // add the toggle option to the YouTube player settings
  setTimeout(addToggleOption, 1000);
});
