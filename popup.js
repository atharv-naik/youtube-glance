// This script runs when the user interacts with the extension popup

// Get the checkbox element
const toggleSwitch = document.getElementById('toggleSwitch');

// Function to check the state of YouTube endcards and update the checkbox
function updateCheckboxState() {
  // Query the active tab for the current state of endcards
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { checkEndcardState: true }, function(response) {
      // Update the checkbox based on the response
      toggleSwitch.checked = response.endcardsVisible;
    });
  });
}

// Listen for changes in the checkbox state
toggleSwitch.addEventListener('change', function() {
  // Send a message to the content script to toggle endcards based on the checkbox state
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const isChecked = toggleSwitch.checked;
    chrome.tabs.sendMessage(tabs[0].id, { toggleEndcards: isChecked });
  });
});

// Initialize the checkbox state when the popup is opened
updateCheckboxState();
