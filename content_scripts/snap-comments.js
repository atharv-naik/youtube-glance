const backupStylesDict = {};
let snapped = false;
const snapDiv = createSnapDiv();
let html5VideoContainer;
let videoPlayer;


function createSnapDiv() {
  const div = document.createElement("div");
  div.id = "snap-div";
  div.style.height = "100%";
  div.style.minWidth = "30vw";
  div.style.zIndex = "70";
  div.style.overflowX = "hidden";
  div.style.overflowY = "scroll";
  div.style.scrollbarWidth = "none";
  div.style.msOverflowStyle = "none";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  return div;
}

function initSnap() {
  waitForElements([".html5-video-container", ".video-stream.html5-main-video"], () => {
    html5VideoContainer.appendChild(snapDiv);
  });
}

function waitForElements(selectors, callback) {
  const elements = selectors.map(selector => document.querySelector(selector));
  if (elements.every(el => el !== null)) {
    [html5VideoContainer, videoPlayer] = elements;
    callback();
  } else {
    setTimeout(() => waitForElements(selectors, callback), 500);
  }
}

function saveOriginalStyles(element, backupKey) {
  backupStylesDict[backupKey] = {};
  for (let key in element.style) {
    backupStylesDict[backupKey][key] = element.style[key];
  }
}

function applySnapStyles() {
  saveOriginalStyles(html5VideoContainer, "html5VideoContainer");
  html5VideoContainer.style.display = "flex";
  html5VideoContainer.style.alignItems = "center";
  html5VideoContainer.style.height = "100%";

  saveOriginalStyles(videoPlayer, "videoPlayer");
  videoPlayer.style.height = "auto";
  videoPlayer.style.maxWidth = "80vw";
  videoPlayer.style.position = "initial";
}

function snapCommentsBesidePlayer(animate = true, force = false) {
  if (snapped && !force) {
    return;
  }

  waitForElements([".html5-video-container", ".video-stream.html5-main-video"], () => {
    applySnapStyles();

    if (animate) {
      videoPlayer.animate(
        [
          { minWidth: "100vw" },
          { minWidth: "68vw" },
        ],
        {
          duration: 250,
          fill: "forwards",
          easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        }
      );
    }

    const commentsSnap = document.querySelector("#comments");
    commentsSnap.className = "ytp-snap-comments";

    saveOriginalStyles(commentsSnap, "commentsSnap");
    commentsSnap.style.height = "calc(100% - 120px)";
    commentsSnap.style.zIndex = "70";
    commentsSnap.style.overflowX = "hidden";
    commentsSnap.style.overflowY = "auto";
    commentsSnap.style.scrollbarWidth = "none";
    commentsSnap.style.msOverflowStyle = "none";
    commentsSnap.style.paddingInline = "2rem";

    applyThemeStyles(commentsSnap);

    snapDiv.appendChild(commentsSnap);
    commentsSnap.addEventListener("click", preventBubbleUp);
    commentsSnap.addEventListener("keydown", preventBubbleUp);
    videoPlayer.addEventListener("ended", unsnapComments);

    snapped = true;
  });
}

function applyThemeStyles(commentsSnap) {
  const isLightTheme = theme === "light";
  const backgroundColor = isLightTheme ? "#FFFFFF" : "#181818";
  const color = isLightTheme ? "black" : "white";

  snapDiv.style.backgroundColor = backgroundColor;
  commentsSnap.style.backgroundColor = backgroundColor;
  commentsSnap.style.color = color;
}

function preventBubbleUp(event) {
  if (event.target.tagName === "A") {
    event.preventDefault();
    const time = event.target.innerText.split(":").map(Number);
    videoPlayer.currentTime = time[0] * 60 + time[1];
  }

  event.stopPropagation();
}

function unsnapComments(animate = true, transition = false) {
  if (!snapped) {
    return;
  }

  if (!animate || transition) {
    doUnsnap(transition);
  } else {
    const animation = videoPlayer.animate(
      [
        { minWidth: "68vw" },
        { minWidth: "100vw" },
      ],
      {
        duration: 250,
        fill: "forwards",
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      }
    );

    animation.finished.then(() => {
      animation.cancel();
      doUnsnap(transition);
    });
  }
}

function doUnsnap(transition = false) {
  const commentsSnap = document.querySelector(".ytp-snap-comments");
  const below = document.querySelector("#below");

  below.appendChild(commentsSnap);

  commentsSnap.removeEventListener("click", preventBubbleUp);
  commentsSnap.removeEventListener("keydown", preventBubbleUp);

  restoreOriginalStyles(html5VideoContainer, "html5VideoContainer");
  restoreOriginalStyles(videoPlayer, "videoPlayer");
  restoreOriginalStyles(commentsSnap, "commentsSnap");

  commentsSnap.classList.remove("ytp-snap-comments");
  videoPlayer.removeEventListener("ended", unsnapComments);

  if (!transition) {
    snapped = false;
  }
}

function restoreOriginalStyles(element, backupKey) {
  for (let key in backupStylesDict[backupKey]) {
    element.style[key] = backupStylesDict[backupKey][key];
  }
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (event.shiftKey && key === "s") {
    snapCommentsBesidePlayer();
  } else if (event.shiftKey && key === "d") {
    unsnapComments();
  } else if (key === "f" || key === "t") {
    unsnapComments(false);
  }
});

initSnap();
