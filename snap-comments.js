var backupStylesDict = {};
var snapped = false;
var html5VideoContainer = document.querySelector(".html5-video-container");
var videoPlayer = document.querySelector(".video-stream.html5-main-video");
const snapDiv = document.createElement("div");


function initSnap() {
  snapDiv.id = "snap-div";
  html5VideoContainer.appendChild(snapDiv);

  snapDiv.style.height = "100%";
  snapDiv.style.minWidth = "30vw";
  snapDiv.style.zIndex = "70";
  snapDiv.style.overflowX = "hidden";
  snapDiv.style.overflowY = "scroll";
  snapDiv.style.scrollbarWidth = "none";
  snapDiv.style["-msOverflowStyle"] = "none";
  snapDiv.style.display = "flex";
  snapDiv.style.flexDirection = "column";
  snapDiv.style.alignItems = "center";
  snapDiv.style.justifyContent = "center";
}

initSnap();

// snaps the comments beside the player
function snapCommentsBesidePlayer(animate = true, force = false) {
  // skip if snapped
  if (snapped && !force) {
    return;
  }

  html5VideoContainer = document.querySelector(".html5-video-container");
  videoPlayer = document.querySelector(".video-stream.html5-main-video");

  // append a div to html5-video-container to snap comments to the right

  if (html5VideoContainer === null || videoPlayer === null) {
    setInterval(snapCommentsBesidePlayer(), 500);
    return;
  }

  // style
  // save the original styles; backupStylesDict["html5VideoContainer"] = html5VideoContainer.style;
  backupStylesDict["html5VideoContainer"] = {};
  for (var key in html5VideoContainer.style) {
    backupStylesDict["html5VideoContainer"][key] =
      html5VideoContainer.style[key];
  }
  html5VideoContainer.style.display = "flex";
  html5VideoContainer.style.alignItems = "center";
  html5VideoContainer.style.height = "100%";

  // style
  // save the original styles; backupStylesDict["videoPlayer"] = videoPlayer.style;
  backupStylesDict["videoPlayer"] = {};
  for (var key in videoPlayer.style) {
    backupStylesDict["videoPlayer"][key] = videoPlayer.style[key];
  }
  videoPlayer.style.height = "auto";
  videoPlayer.style.maxWidth = "80vw";
  // videoPlayer.style.minWidth = "68vw";
  videoPlayer.style.position = "initial";

  if (animate) {
    // snap animation
    // animate video player min width from current to 68vw
    videoPlayer.animate(
      [
        {
          minWidth: "100vw",
        },
        {
          minWidth: "68vw",
        },
      ],
      {
        duration: 250,
        fill: "forwards",
        // easing: fast start and slow end
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      }
    );
  }


  const commentsSnap = document.querySelector("#comments");
  commentsSnap.className = "ytp-snap-comments";

  // style
  // save the original styles
  backupStylesDict["commentsSnap"] = {};
  for (var key in snapDiv.style) {
    backupStylesDict["commentsSnap"][key] = commentsSnap.style[key];
  }
  commentsSnap.style.height = "calc(100% - 120px)";
  commentsSnap.style.zIndex = "70";
  commentsSnap.style.overflowX = "hidden";
  commentsSnap.style.overflowY = "auto";
  commentsSnap.style.scrollbarWidth = "none";
  commentsSnap.style["-msOverflowStyle"] = "none";
  commentsSnap.style.paddingInline = "2rem";

  // set background color based on theme
  if (theme === "light") {
    snapDiv.style.backgroundColor = "#FFFFFF";
    commentsSnap.style.backgroundColor = "#FFFFFF";
    commentsSnap.style.color = "black";
  } else {
    snapDiv.style.backgroundColor = "#181818";
    commentsSnap.style.backgroundColor = "#181818";
    commentsSnap.style.color = "white";
  }

  // append to snap div
  snapDiv.appendChild(commentsSnap);

  // add event listener to prevent click events from bubbling up; this prevents the video from pausing when clicking on the comments
  commentsSnap.addEventListener("click", preventBubbleUp);
  commentsSnap.addEventListener("keydown", preventBubbleUp);

  // unsnap when video ends
  videoPlayer.addEventListener("ended", unsnapComments);

  snapped = true;
}

function preventBubbleUp(event) {
  // before stopping propagation, check if the click is on a timestamp link
  if (event.target.tagName === "A") {
    // skip to the timestamp preventing the video from pausing
    let text = event.target.innerText; // of the form "0:00"
    let time = text.split(":");
    let seconds = parseInt(time[0]) * 60 + parseInt(time[1]);
    videoPlayer.currentTime = seconds;

    // prevent the link from opening
    event.preventDefault();
  }

  // stop propagation
  event.stopPropagation();
}

// undo snapping of comments
function unsnapComments(animate = true, transition = false) {
  // skip if not snapped
  if (!snapped) {
    return;
  }

  if (!animate || transition) {
    doUnsnap();
    return;
  } else {
    // animate video player min width from 68vw to 100vw
    var animation = videoPlayer.animate(
      [
        {
          minWidth: "68vw",
        },
        {
          minWidth: "100vw",
        },
      ],
      {
        duration: 250,
        fill: "forwards",
        // easing: fast start and slow end
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      }
    );

    animation.finished.then(() => {
      // remove animation
      animation.cancel();

      // unsnap comments ///////////////

      doUnsnap((transition = transition));
    });
  }
}

function doUnsnap(transition = false) {
  // find the snap div
  const commentsSnap = document.querySelector(".ytp-snap-comments");
  const below = document.querySelector("#below");

  // append comments to below
  below.appendChild(commentsSnap);

  // remove event listeners for prevent-bubble-up
  commentsSnap.removeEventListener("click", preventBubbleUp);
  commentsSnap.removeEventListener("keydown", preventBubbleUp);

  // restore original styles

  // style
  for (var key in backupStylesDict["html5VideoContainer"]) {
    html5VideoContainer.style[key] =
      backupStylesDict["html5VideoContainer"][key];
  }

  // style
  for (var key in backupStylesDict["videoPlayer"]) {
    videoPlayer.style[key] = backupStylesDict["videoPlayer"][key];
  }

  // style
  for (var key in backupStylesDict["commentsSnap"]) {
    commentsSnap.style[key] = backupStylesDict["commentsSnap"][key];
  }

  // remove class
  commentsSnap.classList.remove("ytp-snap-comments");

  videoPlayer.removeEventListener("ended", unsnapComments);

  if (!transition) snapped = false; // only set snapped to false if not transitioning
}



document.addEventListener("keydown", function (event) {
  // shift + s to snap comments beside player
  if (event.shiftKey && event.key.toLowerCase() === "s") {
    snapCommentsBesidePlayer();
  }
  // shift + d to unsnap comments
  if (event.shiftKey && event.key.toLowerCase() === "d") {
    unsnapComments();
  }

  if (event.key.toLowerCase() === "f" || event.key.toLowerCase() === "t") {
    unsnapComments((animate = false));
  }
});
