// This script will be injected into YouTube pages

// Function to toggle YouTube endcards
function toggleEndcards(shouldHide) {
    document.querySelectorAll('.ytp-ce-element').forEach(element => {
      element.style.display = shouldHide ? 'none' : 'unset';
      console.log(element.style.display);
    });
  }
  
  // Function to check the state of YouTube endcards
  function checkEndcardState() {
    const endcardsVisible = Array.from(document.querySelectorAll('.ytp-ce-element')).some(element => {
      // Check if the display property is not set or is 'none'
      return element.style.display === 'none' || element.style.display === undefined;
    });
  
    return { endcardsVisible };
  }
  
  // Listen for messages from the extension popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.toggleEndcards !== undefined) {
      toggleEndcards(request.toggleEndcards);
    } else if (request.checkEndcardState) {
      const response = checkEndcardState();
      sendResponse(response);
    }
  });
  