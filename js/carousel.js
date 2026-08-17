/* ==========================================================================
   IMAGE CAROUSEL — one reusable component, used wherever you need it
   ==========================================================================
   ✏️  HOW TO ADD A CAROOUSEL TO A PAGE:
   Write a normal image block, add `data-carousel`, and list as many <img>
   lines as you like. That's it — the arrows, dots and counter are built
   automatically, and each slide is still click-to-zoom.

     <figure class="cs-image" data-carousel data-label="What this set shows">
       <img src="images/one.png" alt="describe slide 1">
       <img src="images/two.png" alt="describe slide 2" loading="lazy">
       <figcaption>One caption for the whole set</figcaption>
     </figure>

   To add or remove a slide, add or delete an <img> line. To reorder them,
   move the lines. Nothing else needs changing.

   Sliding uses the browser's own scroll-snapping, so swiping on a phone or
   trackpad feels native, and it keeps working even if this script fails
   (you'd just get the images stacked normally).
   ========================================================================== */
(function () {
  var carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  Array.prototype.forEach.call(carousels, function (fig, ci) {
    // Only the figure's own <img> children become slides (not the caption).
    var slides = Array.prototype.filter.call(fig.children, function (el) {
      return el.tagName === "IMG";
    });
    if (slides.length < 2) return;   // one image needs no carousel

    /* ---- Build the scrolling viewport around the existing images ---- */
    var viewport = document.createElement("div");
    viewport.className = "carousel-viewport";
    viewport.tabIndex = 0;                       // so arrow keys have a target
    viewport.setAttribute("role", "group");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", fig.getAttribute("data-label") || "Image carousel");
    fig.insertBefore(viewport, slides[0]);
    slides.forEach(function (img) { viewport.appendChild(img); });

    /* ---- Build the controls ---- */
    var controls = document.createElement("div");
    controls.className = "carousel-controls";

    function makeBtn(cls, label, glyph) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = cls;
      b.setAttribute("aria-label", label);
      b.textContent = glyph;
      return b;
    }

    var prev = makeBtn("carousel-btn", "Previous slide", "←");
    var next = makeBtn("carousel-btn", "Next slide", "→");

    var dots = document.createElement("div");
    dots.className = "carousel-dots";
    var dotList = slides.map(function (img, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "carousel-dot";
      d.setAttribute("aria-label", "Go to slide " + (i + 1) + " of " + slides.length);
      d.addEventListener("click", function () { goTo(i); });
      dots.appendChild(d);
      return d;
    });

    var count = document.createElement("span");
    count.className = "carousel-count";
    count.setAttribute("aria-live", "polite");

    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    controls.appendChild(count);

    // controls sit after the viewport, before any caption
    var cap = fig.querySelector("figcaption");
    if (cap) fig.insertBefore(controls, cap); else fig.appendChild(controls);

    /* ---- State ---- */
    var index = 0;

    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      viewport.scrollTo({ left: viewport.clientWidth * index, behavior: "smooth" });
      sync();
    }

    // Works out which slide is showing after any scroll (swipe, arrow, or dot)
    function currentIndex() {
      return Math.round(viewport.scrollLeft / viewport.clientWidth);
    }

    function sync() {
      dotList.forEach(function (d, i) {
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
      // only the visible slide is a tab stop, so tabbing doesn't wade
      // through every hidden image
      slides.forEach(function (img, i) { img.tabIndex = i === index ? 0 : -1; });
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      count.textContent = (index + 1) + " / " + slides.length;
    }

    prev.addEventListener("click", function () { goTo(index - 1); });
    next.addEventListener("click", function () { goTo(index + 1); });

    // Keep state in step with native swiping / trackpad scrolling
    var t = null;
    viewport.addEventListener("scroll", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var i = currentIndex();
        if (i !== index) { index = i; sync(); }
      }, 90);
    }, { passive: true });

    // Left / right arrow keys when the carousel has focus
    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
    });

    window.addEventListener("resize", function () {
      // keep the same slide framed if the window changes size
      viewport.scrollLeft = viewport.clientWidth * index;
    });

    sync();
  });
})();
