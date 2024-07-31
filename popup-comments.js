const popupStylesDict = {
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
  color: "white",
};

const initialStylesDict = {};
let commentsPopupDivScrollPosition = 0;

function waitForElement(selector, callback, interval = 1000) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => waitForElement(selector, callback, interval), interval);
  }
}

function initializeCommentsPopupButton() {
  const commentsPopupButton = document.createElement("button");

  commentsPopupButton.className = "ytp-button comments-popup-button";
  commentsPopupButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="#FFFFFF" style="padding:1.4rem 1rem; height:3.3vh;">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"/>
    </svg>
  `;

  commentsPopupButton.ariaLabel = "Comments";
  commentsPopupButton.ariaControls = "comments";
  commentsPopupButton.ariaExpanded = "false";
  commentsPopupButton.ariaHasPopup = "true";
  commentsPopupButton.title = "Comments (Alt + c)";

  waitForElement(".ytp-right-controls", (rightControls) => {
    rightControls.insertBefore(commentsPopupButton, rightControls.firstChild);
    commentsPopupButton.addEventListener("click", toggleCommentsPopup);
  });
}

function showCommentsPopup(commentsPopupDiv, popupStylesDict) {
  for (const key in popupStylesDict) {
    initialStylesDict[key] = commentsPopupDiv.style[key];
    commentsPopupDiv.style[key] = popupStylesDict[key];
  }

  commentsPopupDiv.style.display = "block";
  commentsPopupDiv.classList.add("ytp-popup-comments");

  const moviePlayer = document.querySelector("#movie_player");
  moviePlayer.appendChild(commentsPopupDiv);

  commentsPopupDiv.addEventListener("keydown", (event) => {
    event.stopPropagation();
  });

  commentsPopupDiv.scrollTop = commentsPopupDivScrollPosition; // Restore the scroll position
}

function dismissCommentsPopup(commentsPopupDiv, popupStylesDict) {
  commentsPopupDivScrollPosition = commentsPopupDiv.scrollTop; // Save the scroll position
  commentsPopupDiv.style.display = "none";

  const below = document.querySelector("#below");
  below.appendChild(commentsPopupDiv);

  commentsPopupDiv.classList.remove("ytp-popup-comments");

  for (const key in popupStylesDict) {
    commentsPopupDiv.style[key] = initialStylesDict[key];
  }

  commentsPopupDiv.style.display = "block";
}

function toggleCommentsPopup() {
  const commentsPopupDiv = document.querySelector(".ytp-popup-comments");

  if (!commentsPopupDiv) {
    const ytpComments = document.querySelector("#comments");
    for (const key in popupStylesDict) {
      initialStylesDict[key] = ytpComments.style[key];
    }
    showCommentsPopup(ytpComments, popupStylesDict);
  } else if (commentsPopupDiv.style.display === "none") {
    showCommentsPopup(commentsPopupDiv, popupStylesDict);
  } else {
    dismissCommentsPopup(commentsPopupDiv, popupStylesDict);
  }
}

let theme = "dark";

window.addEventListener("load", () => {
  fetch(`${window.location.origin}/manifest.webmanifest`)
    .then((response) => response.json())
    .then((data) => {
      theme = data.background_color === "#FFFFFF" ? "light" : "dark";
      popupStylesDict.backgroundColor = theme === "light" ? "#FFFFFF" : "#181818d9";
      popupStylesDict.color = theme === "light" ? "black" : "white";
      initializeCommentsPopupButton();
    });
});

document.addEventListener("keydown", (event) => {
  if ((event.altKey || event.metaKey) && event.key.toLowerCase() === "c") {
    toggleCommentsPopup();
  }
});
