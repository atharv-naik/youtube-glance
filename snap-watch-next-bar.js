// initSnap();

// snaps the watch-next-bar beside the player
function snapWatchNextBar(animate = true, force = false) {
  // skip if snapped
  if (snapped && !force) {
    return;
  }

  // append a div to html5-video-container to snap chapters to the right

  if (html5VideoContainer === null || videoPlayer === null) {
    setInterval(snapWatchNextBar(), 500);
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

  var watchNextSnap = document.querySelector(".ytp-snap-watch-next-bar");
  if (watchNextSnap === null) {
    var watchNextSnap = document.querySelector(
      "#related > ytd-watch-next-secondary-results-renderer > #items"
    );
  }
  watchNextSnap.classList.add("ytp-snap-watch-next-bar");

  // style
  // save the original styles
  backupStylesDict["watchNextSnap"] = {};
  for (var key in snapDiv.style) {
    backupStylesDict["watchNextSnap"][key] = watchNextSnap.style[key];
  }
  watchNextSnap.style.height = "calc(100% - 120px)";
  watchNextSnap.style.width = "90%";
  watchNextSnap.style.zIndex = "70";
  watchNextSnap.style.overflowY = "scroll";
  watchNextSnap.style.overflowX = "hidden";
  watchNextSnap.style.scrollbarWidth = "none";
  watchNextSnap.style["-msOverflowStyle"] = "none";
  watchNextSnap.style.display = "block";

  // set background color based on theme
  if (theme === "light") {
    // watchNextSnap.style.backgroundColor = "#ccc";
    watchNextSnap.style.color = "black";
  } else {
    // watchNextSnap.style.backgroundColor = "#181818";
    watchNextSnap.style.color = "white";
  }

  snapDiv.style.backgroundColor = "transparent";


  // append to snap div
  snapDiv.appendChild(watchNextSnap);

  // add event listener to prevent click events from bubbling up; this prevents the video from pausing when clicking on the snap
  watchNextSnap.addEventListener("click", preventBubbleUp);
  watchNextSnap.addEventListener("keydown", preventBubbleUp);
  watchNextSnap.addEventListener("dblclick", preventBubbleUp);

  videoPlayer.addEventListener("ended", unsnapWatchNextBar);

  snapped = true;
}

// undo snapping of watch-next-bar
function unsnapWatchNextBar(animate = true, transition = false) {
  // skip if not snapped
  if (!snapped) {
    return;
  }

  if (!animate || transition) {
    doUnsnapWatchNextBar();
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

      // unsnap watch-next-bar ///////////////

      doUnsnapWatchNextBar((transition = transition));
    });
  }
}

function doUnsnapWatchNextBar(transition = false) {
  // find the snap div
  const watchNextSnap = document.querySelector(".ytp-snap-watch-next-bar");
  const parent = document.querySelector("#related > ytd-watch-next-secondary-results-renderer");
  const sibling = document.querySelector("#related > ytd-watch-next-secondary-results-renderer > #continuations");

  // insert watch-next-bar back to its original position
  parent.insertBefore(watchNextSnap, sibling);

  // remove event listeners for prevent-bubble-up
  watchNextSnap.removeEventListener("click", preventBubbleUp);
  watchNextSnap.removeEventListener("keydown", preventBubbleUp);

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
  for (var key in backupStylesDict["watchNextSnap"]) {
    watchNextSnap.style[key] = backupStylesDict["watchNextSnap"][key];
  }


  // remove class
  // watchNextSnap.classList.remove("ytp-snap-watch-next-bar");


  videoPlayer.removeEventListener("ended", unsnapWatchNextBar);


  if (!transition) snapped = false; // only set snapped to false if not transitioning
}





document.addEventListener("keydown", function (event) {
    // shift + c to snap watch-next-bar beside player
    if (event.shiftKey && event.key.toLowerCase() === "c") {
      snapWatchNextBar();
    }
    // shift + e to unsnap watch-next-bar
    if (event.shiftKey && event.key.toLowerCase() === "e") {
      unsnapWatchNextBar();
    }

    if (event.key.toLowerCase() === "f" || event.key.toLowerCase() === "t") {
      unsnapWatchNextBar((animate = false));
    }
});
