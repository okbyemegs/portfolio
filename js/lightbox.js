/* ==========================================================================
   IMAGE LIGHTBOX — click any image to see it full size
   ==========================================================================
   You don't need to add anything to your HTML. Every image inside a
   <figure class="cs-image"> and every image in a photo grid becomes
   clickable automatically, on desktop and on mobile.

   BROWSING A SET: wrap a group of images in an element carrying
   `data-lightbox-group` (the food gallery does this) and the overlay gains
   previous / next buttons plus a counter, so you can page through the whole
   set without closing it. Left and right arrow keys work too.

   The overlay also offers "Open full size", which opens the original image
   file in a new tab — useful for wide screenshots where detail matters.
   ========================================================================== */
(function () {
  var images = document.querySelectorAll(".cs-image img, [data-lightbox-group] img");
  if (!images.length) return;

  /* ---- Build the overlay once ---- */
  var box = document.createElement("div");
  box.id = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Enlarged image");
  box.innerHTML =
    '<div class="lightbox-bar">' +
      '<span class="lightbox-count" aria-live="polite"></span>' +
      '<a href="#" target="_blank" rel="noopener" data-full>Open full size ↗</a>' +
      '<button type="button" data-close aria-label="Close enlarged image">Close ✕</button>' +
    "</div>" +
    '<button type="button" class="lightbox-nav is-prev" data-prev aria-label="Previous image">←</button>' +
    '<img alt="">' +
    '<button type="button" class="lightbox-nav is-next" data-next aria-label="Next image">→</button>' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(box);

  var bigImg   = box.querySelector("img");
  var fullLink = box.querySelector("[data-full]");
  var closeBtn = box.querySelector("[data-close]");
  var prevBtn  = box.querySelector("[data-prev]");
  var nextBtn  = box.querySelector("[data-next]");
  var caption  = box.querySelector(".lightbox-caption");
  var counter  = box.querySelector(".lightbox-count");

  var group = [];   // the set currently being browsed
  var gi = 0;       // which one of them is showing

  // Images inside the same [data-lightbox-group] browse together.
  // Anything else opens on its own.
  function groupFor(img) {
    var wrap = img.closest("[data-lightbox-group]");
    if (!wrap) return [img];
    return Array.prototype.slice.call(wrap.querySelectorAll("img"));
  }

  function show() {
    var img = group[gi];
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt || "";
    fullLink.href = img.src;

    // reuse the figure's caption, if it has one
    var fig = img.closest("figure");
    var cap = fig ? fig.querySelector("figcaption") : null;
    caption.textContent = cap ? cap.textContent.trim() : "";

    var many = group.length > 1;
    prevBtn.hidden = nextBtn.hidden = !many;
    counter.textContent = many ? (gi + 1) + " / " + group.length : "";
  }

  function open(img) {
    group = groupFor(img);
    gi = group.indexOf(img);
    if (gi < 0) gi = 0;
    show();
    box.classList.add("is-open");
    document.body.style.overflow = "hidden";   // stop the page scrolling behind
    closeBtn.focus();
  }

  // step through the set, wrapping around at either end
  function step(delta) {
    if (group.length < 2) return;
    gi = (gi + delta + group.length) % group.length;
    show();
  }

  function close() {
    box.classList.remove("is-open");
    document.body.style.overflow = "";
    bigImg.removeAttribute("src");
    if (group[gi]) group[gi].focus();   // land back on the image you were viewing
  }

  /* ---- Make every image openable ---- */
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

  /* ---- Controls ---- */
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });

  // clicking the dark backdrop closes; clicking the image or a button doesn't
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft")  { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  });
})();
