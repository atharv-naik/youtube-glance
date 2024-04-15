// popup-comments.js

// styles for the popup comments
popupStylesDict = {
  position: "absolute",
  bottom: "61px",
  right: "12px",
  width: "36em",
  height: "26em",
  maxWidth: "50%",
  maxHeight: "50%",
  padding: "1.5rem 2rem",
  zIndex: "70",
  borderRadius: "12px",
  willChange: "height, width",
  overflowX: "hidden",
  overflowY: "auto",
  scrollbarWidth: "none",
  "-msOverflowStyle": "none",
  backgroundColor: "#181818d9",
};

// initial styles of original comments
initialStylesDict = {};

// adds the comments popup button to the right controls YT player
function initializeCommentsPopupButton() {
  // create the comments popup button
  const commentsPopupButton = document.createElement("button");

  commentsPopupButton.className = "ytp-button comments-popup-button";
  commentsPopupButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="#FFFFFF" style="padding:1.4rem 1rem; height:3.3vh;"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"/></svg>
    `;

  // add other attributes
  commentsPopupButton.ariaLabel = "Comments";
  commentsPopupButton.ariaControls = "comments"; // targets the comments div with same id
  commentsPopupButton.ariaExpanded = "false";
  commentsPopupButton.ariaHasPopup = "true";
  commentsPopupButton.title = "Comments (Alt + c)";

  // find the right controls container and prepend the button
  const rightControls = document.querySelector(".ytp-right-controls");
  if (rightControls === null) {
    setTimeout(initializeCommentsPopupButton, 500);
  }
  rightControls.insertBefore(commentsPopupButton, rightControls.firstChild);

  // listen for click events to popup comments
  commentsPopupButton.addEventListener("click", toggleCommentsPopup);
}

// shows popup comments
function showCommentsPopup(commentsPopupDiv, popupStylesDict) {
  // saves original styles before applying popup styles
  for (var key in popupStylesDict) {
    initialStylesDict[key] = commentsPopupDiv.style[key];
    commentsPopupDiv.style[key] = popupStylesDict[key];
  }

  // show popup comments
  commentsPopupDiv.style.display = "block";

  // adds custom styles classes
  commentsPopupDiv.classList.add("ytp-popup-comments");

  // find the movie player
  moviePlayer = document.querySelector("#movie_player");

  // Append the wrapper to the player
  moviePlayer.appendChild(commentsPopupDiv);

  // prevent player shortcuts while typing
  commentsPopupDiv.addEventListener("keydown", (event) => {
    event.stopPropagation();
  });
}

// function to dismiss popup comments and return to normal comments
function dismissCommentsPopup(commentsPopupDiv, popupStylesDict) {
  // hide popup comments
  commentsPopupDiv.style.display = "none";

  // return to normal comments
  below = document.querySelector("#below");

  // append comments to below
  below.appendChild(commentsPopupDiv);

  // remove styles classes
  commentsPopupDiv.classList.remove("ytp-popup-comments");

  // apply initial styles
  for (var key in popupStylesDict) {
    commentsPopupDiv.style[key] = initialStylesDict[key];
  }

  // show comments
  commentsPopupDiv.style.display = "block";
}

// toggles popup comments
function toggleCommentsPopup() {
  // find the comments popup div
  const commentsPopupDiv = document.querySelector(".ytp-popup-comments");

  // create the comments popup div if it doesn't exist
  if (commentsPopupDiv === null) {
    const ytpComments = document.querySelector("#comments");

    // fill the initial styles dict with the current styles
    for (var key in popupStylesDict) {
      initialStylesDict[key] = ytpComments.style[key];
    }
    showCommentsPopup(ytpComments, popupStylesDict);
  } else if (commentsPopupDiv.style.display === "none") {
    showCommentsPopup(commentsPopupDiv, popupStylesDict);
  } else {
    dismissCommentsPopup(commentsPopupDiv, popupStylesDict);
  }
}

// wait for page load
window.addEventListener("load", () => {
  // add comments popup button
  initializeCommentsPopupButton();
});

document.addEventListener("keydown", function (event) {
  // alt + c to toggle comments popup
  if (event.altKey && event.key.toLowerCase() === "c") {
    toggleCommentsPopup();
  }
  // option + c to toggle comments popup on mac
  if (event.metaKey && event.key.toLowerCase() === "c") {
    toggleCommentsPopup();
  }
});
