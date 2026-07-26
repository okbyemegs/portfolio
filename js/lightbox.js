/* ==========================================================================
   IMAGE LIGHTBOX — click any case-study image to see it full size
   ==========================================================================
   You don't need to add anything to your HTML. Every image inside a
   <figure class="cs-image"> on a project page becomes clickable
   automatically, on desktop and on mobile.

   The overlay also offers "Open full size" which opens the original image
   file in a new tab — useful for wide screenshots where the detail matters.
   ========================================================================== */
(function () {
  var images = document.querySelectorAll(".cs-image img");
  if (!images.length) return;

  /* ---- Build the overlay once ---- */
  var box = document.createElement("div");
  box.id = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Enlarged image");
  box.innerHTML =
    '<div class="lightbox-bar">' +
      '<a href="#" target="_blank" rel="noopener" data-full>Open full size ↗</a>' +
      '<button type="button" data-close aria-label="Close enlarged image">Close ✕</button>' +
    "</div>" +
    '<img alt="">' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(box);

  var bigImg   = box.querySelector("img");
  var fullLink = box.querySelector("[data-full]");
  var closeBtn = box.querySelector("[data-close]");
  var caption  = box.querySelector(".lightbox-caption");
  var lastFocused = null;

  function open(img) {
    lastFocused = img;
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt || "";
    fullLink.href = img.src;

    // reuse the figure's caption, if it has one
    var fig = img.closest("figure");
    var cap = fig ? fig.querySelector("figcaption") : null;
    caption.textContent = cap ? cap.textContent.trim() : "";

    box.classList.add("is-open");
    document.body.style.overflow = "hidden";   // stop the page scrolling behind
    closeBtn.focus();
  }

  function close() {
    box.classList.remove("is-open");
    document.body.style.overflow = "";
    bigImg.removeAttribute("src");
    if (lastFocused) lastFocused.focus();
  }

  /* ---- Make every case-study image openable ---- */
  Array.prototype.forEach.call(images, function (img) {
    img.classList.add("zoomable");
    img.setAttribute("role", "button");
    img.setAttribute("tabindex", "0");
    img.setAttribute("aria-label", (img.alt || "Image") + " — click to enlarge");

    img.addEventListener("click", function () { open(img); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(img);
      }
    });
  });

  /* ---- Ways to close ---- */
  closeBtn.addEventListener("click", close);

  // clicking the dark backdrop closes; clicking the image itself doesn't
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box.classList.contains("is-open")) close();
  });
})();
