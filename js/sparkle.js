/* ==========================================================================
   STAR CURSOR & GLITTER TRAIL
   ==========================================================================
   Swaps the normal cursor for a little star and leaves a short, gentle
   trail of palette-coloured sparkles behind it.

   ✏️  TUNE THE FEEL HERE:
   ========================================================================== */
var SPARKLE_SCOPE   = ".hero"; // where the effect is active.
                               // ".hero" = hero section only (trial run);
                               // change to "body" to go site-wide.
var STAR_SIZE       = 22;      // px — size of the star cursor
var SPARKLE_DENSITY = 18;      // sparkles per second while the cursor moves
var SPARKLE_LIFE    = 650;     // ms — how long each sparkle lives

/* --------------------------------------------------------------------------
   You shouldn't need to edit below this line.
   -------------------------------------------------------------------------- */
(function () {
  // Touch screens have no cursor — skip everything.
  if (!window.matchMedia("(pointer: fine)").matches) return;

  var scope = document.querySelector(SPARKLE_SCOPE);
  if (!scope) return;

  /* ---- 1. The star cursor (pure CSS, works even with reduced motion) ---- */

  // Draws a five-point star and returns it as a data-URI for `cursor:`.
  function starCursor(size, fill, stroke) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var r = i % 2 === 0 ? 45 : 18;                 // outer / inner radius
      var a = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push((50 + r * Math.cos(a)).toFixed(1) + "," + (50 + r * Math.sin(a)).toFixed(1));
    }
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 100 100">' +
      '<polygon points="' + pts.join(" ") + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="6" stroke-linejoin="round"/></svg>';
    var mid = Math.round(size / 2);
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") ' + mid + " " + mid;
  }

  // Navy star normally; a soft-orange star over links & buttons, so
  // clickable things still announce themselves.
  var style = document.createElement("style");
  style.textContent =
    SPARKLE_SCOPE + " { cursor: " + starCursor(STAR_SIZE, "#1B3A4B", "#FFF1C1") + ", auto; }\n" +
    SPARKLE_SCOPE + " a, " + SPARKLE_SCOPE + " button { cursor: " +
    starCursor(Math.round(STAR_SIZE * 1.2), "#FFCC80", "#1B3A4B") + ", pointer; }";
  document.head.appendChild(style);

  /* ---- 2. The glitter trail ---- */

  // Accessibility: no trail for people who've asked their device for less motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var COLOURS = ["#FFF1C1", "#FFCC80", "#ADD8E5"]; // cream, soft orange, light blue
  var MAX_SPARKLES = 24;   // hard cap on live particles — keeps it light

  var layer = document.createElement("div");
  layer.id = "sparkle-layer";
  document.body.appendChild(layer);

  // A small reusable pool of sparkle elements — nothing accumulates in the DOM.
  var pool = [];
  var liveCount = 0;

  function spawn(x, y) {
    if (liveCount >= MAX_SPARKLES) return;   // too many alive — skip this one

    var el = pool.pop();
    if (!el) {
      el = document.createElement("span");
      el.className = "sparkle";
      el.addEventListener("animationend", function () {
        el.style.animation = "none";         // reset so it can replay next time
        liveCount--;
        pool.push(el);
      });
      layer.appendChild(el);
    }

    var size = 6 + Math.random() * 7;        // px
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = (x - size / 2) + "px";
    el.style.top = (y - size / 2) + "px";
    el.style.background = COLOURS[(Math.random() * COLOURS.length) | 0];
    // subtle glow so light sparkles stay visible on light backgrounds
    el.style.filter = "drop-shadow(0 0 2px rgba(27, 58, 75, 0.35))";
    el.style.setProperty("--dx", ((Math.random() - 0.5) * 28).toFixed(0) + "px");
    el.style.setProperty("--dy", (-4 - Math.random() * 18).toFixed(0) + "px"); // drift up
    el.style.setProperty("--life", SPARKLE_LIFE + "ms");

    // restart the pop animation
    void el.offsetWidth;
    el.style.animation = "";
    liveCount++;
  }

  var lastSpawn = 0;
  window.addEventListener("pointermove", function (e) {
    // Only sparkle while the cursor is inside the scoped section.
    if (!(e.target instanceof Element) || !e.target.closest(SPARKLE_SCOPE)) return;
    var now = performance.now();
    if (now - lastSpawn < 1000 / SPARKLE_DENSITY) return;  // density throttle
    lastSpawn = now;
    spawn(e.clientX, e.clientY);
  }, { passive: true });
})();
