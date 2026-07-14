/* ==========================================================================
   TICKLE EFFECT — playful cursor-proximity jiggle (hero section)
   ==========================================================================
   Elements gently wobble when the cursor comes near, as if being tickled,
   and settle back softly when it leaves.

   HOW IT'S USED IN THE HTML:
     class="tickle"        → the whole element jiggles as one block
                             (good for the photo and the intro paragraph)
     class="tickle-words"  → each word inside jiggles on its own
                             (good for the big heading)

   ✏️  TUNE THE FEEL HERE — just two knobs:
   ========================================================================== */
var TICKLE_REACH    = 140;  // px — how far from an element the cursor starts
                            //      to tickle it (bigger = reacts sooner)
var TICKLE_STRENGTH = 1.0;  // overall intensity — 0.5 = whisper, 2 = giddy

/* --------------------------------------------------------------------------
   You shouldn't need to edit below this line.
   -------------------------------------------------------------------------- */
(function () {
  // Accessibility: no motion for people who've asked their device for less.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Touch screens have no hovering cursor — skip the effect there.
  if (!window.matchMedia("(pointer: fine)").matches) return;

  // Split every .tickle-words element into per-word spans.
  document.querySelectorAll(".tickle-words").forEach(function (root) {
    Array.prototype.slice.call(root.childNodes).forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part)); // keep the spaces
          } else {
            var span = document.createElement("span");
            span.className = "tickle-unit";
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        root.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // e.g. the green <span class="accent">Megan</span> wobbles as one word
        node.classList.add("tickle-unit");
      }
    });
  });

  var elements = document.querySelectorAll(".tickle, .tickle-unit");
  if (!elements.length) return;

  // One state object per jiggling element.
  var items = Array.prototype.map.call(elements, function (el) {
    return {
      el: el,
      cx: 0, cy: 0, radius: 0,             // cached position (centre + size)
      influence: 0,                        // 0 = at rest … 1 = fully tickled
      phase: Math.random() * Math.PI * 2,  // so words don't wobble in unison
      speed: 6 + Math.random() * 3,        // wobbles per second, roughly
      wobbleDeg: 0, wobblePx: 0            // amplitude, set in measure()
    };
  });

  // Cache each element's centre so the animation loop never touches layout.
  function measure() {
    items.forEach(function (it) {
      var r = it.el.getBoundingClientRect();
      it.cx = r.left + r.width / 2;
      it.cy = r.top + r.height / 2;
      it.radius = Math.max(r.width, r.height) / 2;
      // Big things (like the photo) rotate less, or it feels seasick.
      var damp = Math.min(1, 60 / Math.max(it.radius, 1)) * 0.6 + 0.4;
      it.wobbleDeg = 2.6 * damp;
      it.wobblePx  = 2.8;
    });
  }

  var mouseX = -9999, mouseY = -9999, rafId = null;

  function frame(now) {
    rafId = null;
    var anythingMoving = false;

    items.forEach(function (it) {
      // How close is the cursor? (measured from the element's edge, roughly)
      var dx = mouseX - it.cx, dy = mouseY - it.cy;
      var gap = Math.sqrt(dx * dx + dy * dy) - it.radius;
      var target = Math.max(0, 1 - Math.max(0, gap) / TICKLE_REACH);

      // Ease the influence toward its target — this is what makes the
      // wobble fade in softly and settle back smoothly (springy, not stiff).
      it.influence += (target - it.influence) * 0.10;

      if (it.influence > 0.004) {
        anythingMoving = true;
        var amp = it.influence * TICKLE_STRENGTH;
        var t = (now / 1000) * it.speed + it.phase;
        var rot = Math.sin(t)             * it.wobbleDeg * amp;
        var ox  = Math.sin(t * 0.9 + 1.3) * it.wobblePx  * amp;
        var oy  = Math.cos(t * 1.15)      * it.wobblePx  * amp;
        it.el.style.transform =
          "translate(" + ox.toFixed(2) + "px," + oy.toFixed(2) + "px) " +
          "rotate(" + rot.toFixed(2) + "deg)";
      } else if (it.el.style.transform) {
        it.el.style.transform = ""; // fully settled — clean up
      }
    });

    // The loop only keeps running while something is actually moving.
    if (anythingMoving) rafId = requestAnimationFrame(frame);
  }

  function wake() { if (!rafId) rafId = requestAnimationFrame(frame); }

  window.addEventListener("pointermove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    wake();
  }, { passive: true });

  window.addEventListener("scroll", measure, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure); // re-measure once fonts/images load
  // The password gate hides the page at first, so everything measures as
  // zero until it unlocks — re-measure the moment that happens.
  window.addEventListener("portfolio:unlocked", measure);
  measure();
})();
