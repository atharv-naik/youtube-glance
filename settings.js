// settings.js

// Function to toggle YouTube endcards
function toggleEndcards(shouldHide) {
  document.querySelectorAll(".ytp-ce-element").forEach((element) => {
    element.style.display = shouldHide ? "none" : "unset";
  });
}

// Function to add the toggle option to YouTube player settings
function addToggleOption() {
  // Check if the settings menu is available
  const settingsMenu = document.querySelector(".ytp-panel-menu");
  if (settingsMenu === null || settingsMenu === undefined) {
    // If not, try again in 1 second
    return setTimeout(addToggleOption, 1000);
  }

  // Create the new option element
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

  // Add a click event listener to toggle endcards when clicked
  toggleOption.addEventListener("click", function () {
    const isChecked = true ? toggleOption.ariaChecked === "false" : true;
    toggleEndcards(isChecked);
    toggleOption.ariaChecked = isChecked;
  });

  // Append the new option to the settings menu
  settingsMenu.appendChild(toggleOption);
}

// Wait for the YouTube page to fully load
window.addEventListener("load", function () {
  //   // Inject the script into the YouTube page
  setTimeout(addToggleOption, 1000);
});
