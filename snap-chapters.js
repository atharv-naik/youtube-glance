// initSnap();

// snaps the comments beside the player
function snapChapters(animate = true, force = false) {
  // skip if snapped
  if (snapped && !force) {
    return;
  }

  // append a div to html5-video-container to snap chapters to the right

  if (html5VideoContainer === null || videoPlayer === null) {
    setInterval(snapChapters(), 500);
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

  var chaptersSnap = document.querySelector(".ytp-snap-chapters");
  if (chaptersSnap === null) {
    var chaptersSnap = document.querySelector(
      "#panels > ytd-engagement-panel-section-list-renderer:nth-child(2)"
    );
  }
  chaptersSnap.className = "ytp-snap-chapters";

  // style
  // save the original styles
  backupStylesDict["chaptersSnap"] = {};
  for (var key in snapDiv.style) {
    backupStylesDict["chaptersSnap"][key] = chaptersSnap.style[key];
  }
  chaptersSnap.style.height = "calc(100% - 120px)";
  chaptersSnap.style.width = "100%";
  chaptersSnap.style.zIndex = "70";
  chaptersSnap.style.overflowY = "scroll";
  chaptersSnap.style.scrollbarWidth = "none";
  chaptersSnap.style["-msOverflowStyle"] = "none";
  chaptersSnap.style.display = "block";

  // set background color based on theme
  if (theme === "light") {
    chaptersSnap.style.backgroundColor = "#ccc";
    chaptersSnap.style.color = "black";
  } else {
    chaptersSnap.style.backgroundColor = "#181818";
    chaptersSnap.style.color = "white";
  }

  snapDiv.style.backgroundColor = "transparent";

  document.querySelector(".ytp-snap-chapters #content").style.height = "100%";
  document.querySelector(
    ".ytp-snap-chapters #content #contents"
  ).style.scrollbarWidth = "none";

  // append to snap div
  snapDiv.appendChild(chaptersSnap);

  // add event listener to prevent click events from bubbling up; this prevents the video from pausing when clicking on the snap
  chaptersSnap.addEventListener("click", preventBubbleUp);
  chaptersSnap.addEventListener("keydown", preventBubbleUp);
  chaptersSnap.addEventListener("dblclick", preventBubbleUp);

  const closeChapterBtn = document.querySelector(
    "#visibility-button > ytd-button-renderer > yt-button-shape > button"
  );
  closeChapterBtn.addEventListener("click", function () {
    // e.preventDefault();
    unsnapChapters();
  });

  snapped = true;
}

// undo snapping of comments
function unsnapChapters(animate = true, transition = false) {
  // skip if not snapped
  if (!snapped) {
    return;
  }

  if (!animate || transition) {
    doUnsnapChapters();
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

      doUnsnapChapters((transition = transition));
    });
  }
}

function doUnsnapChapters(transition = false) {
  // find the snap div
  const chaptersSnap = document.querySelector(".ytp-snap-chapters");
  const panels = document.querySelector("#panels");

  // insert comments to panels at index 2
  panels.insertBefore(chaptersSnap, panels.childNodes[1]);

  // remove event listeners for prevent-bubble-up
  chaptersSnap.removeEventListener("click", preventBubbleUp);
  chaptersSnap.removeEventListener("keydown", preventBubbleUp);

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
  for (var key in backupStylesDict["chaptersSnap"]) {
    chaptersSnap.style[key] = backupStylesDict["chaptersSnap"][key];
  }

  chaptersSnap.style.height = "500px";

  // remove class
  // chaptersSnap.classList.remove("ytp-snap-chapters");

  // remove event listener for close button
  const closeChapterBtn = document.querySelector(
    "#visibility-button > ytd-button-renderer > yt-button-shape > button"
  );
  closeChapterBtn.removeEventListener("click", function () {
    // e.preventDefault();
    unsnapChapters();
  });

  if (!transition) snapped = false; // only set snapped to false if not transitioning
}



  setTimeout(() => {
    var chapterBtn = document.querySelector(
      "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-chapter-container.sponsorblock-chapter-visible > button"
    );
    if (chapterBtn !== null) {
      chapterBtn.addEventListener("click", function () {
        snapChapters();
      });
    }
  }, 500);



// document.addEventListener("keydown", function (event) {
//   try {
//     // shift + c to snap comments beside player
//     if (event.shiftKey && event.key.toLowerCase() === "c") {
//       snapChapters();
//     }
//     // shift + e to unsnap comments
//     if (event.shiftKey && event.key.toLowerCase() === "e") {
//       unsnapChapters();
//     }

//     if (event.key.toLowerCase() === "f" || event.key.toLowerCase() === "t") {
//       unsnapChapters((animate = false));
//     }
//   } catch {}
// });
