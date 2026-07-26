/* ==========================================================================
   GLITTERY STAR CURSOR & SILVER SPARKLE TRAIL
   ==========================================================================
   Swaps the normal cursor for a glittery silver star (a little hollow
   hair-clip star) and leaves a short trail of silvery sparkles behind it.
   Over links and buttons the star turns warm gold, so clickable things
   still announce themselves.

   ✏️  TUNE THE FEEL HERE:
   ========================================================================== */
var SPARKLE_SCOPE   = "body";  // where the effect is active ("body" = site-wide)
var STAR_SIZE       = 26;      // px — size of the star cursor
var SPARKLE_DENSITY = 22;      // sparkles per second while the cursor moves
var SPARKLE_LIFE    = 650;     // ms — how long each sparkle lives

/* --------------------------------------------------------------------------
   You shouldn't need to edit below this line.
   -------------------------------------------------------------------------- */
(function () {
  // Touch screens have no cursor — skip everything.
  if (!window.matchMedia("(pointer: fine)").matches) return;

  var scope = document.querySelector(SPARKLE_SCOPE);
  if (!scope) return;

  /* ---- 1. The glittery star cursor ---- */

  // The hollow star shape: outer star + inner cutout with rounded points.
  var BAND =
    "M46.9,9.3Q50.0,3.0 53.1,9.3L61.8,27.0Q63.8,31.0 68.3,31.6L87.8,34.5Q94.7,35.5 89.7,40.4" +
    "L75.6,54.1Q72.3,57.3 73.1,61.7L76.4,81.1Q77.6,88.0 71.4,84.8L54.0,75.6Q50.0,73.5 46.0,75.6" +
    "L28.6,84.8Q22.4,88.0 23.6,81.1L26.9,61.7Q27.7,57.3 24.4,54.1L10.3,40.4Q5.3,35.5 12.2,34.5" +
    "L31.7,31.6Q36.2,31.0 38.2,27.0Z " +
    "M48.2,29.1Q50.0,25.6 51.8,29.1L56.1,37.9Q57.2,40.1 59.7,40.5L69.3,41.9Q73.2,42.4 70.4,45.2" +
    "L63.4,52.0Q61.6,53.8 62.0,56.2L63.7,65.8Q64.4,69.8 60.8,67.9L52.2,63.4Q50.0,62.2 47.8,63.4" +
    "L39.2,67.9Q35.6,69.8 36.3,65.8L38.0,56.2Q38.4,53.8 36.6,52.0L29.6,45.2Q26.8,42.4 30.7,41.9" +
    "L40.3,40.5Q42.8,40.1 43.9,37.9Z";

  // Builds the star as an SVG data-URI for `cursor:`.
  // stops = gradient colours (bright metallic), edge = thin dark outline.
  function starCursor(size, stops, edge) {
    var grad = stops.map(function (c, i) {
      return '<stop offset="' + (i * 100 / (stops.length - 1)) + '%" stop-color="' + c + '"/>';
    }).join("");
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 100 100">' +
      '<defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1">' + grad + '</linearGradient>' +
      '<filter id="g" x="-10%" y="-10%" width="120%" height="120%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" seed="11"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 18 -9"/>' +
      '<feComposite in2="SourceAlpha" operator="in"/></filter>' +
      '<path id="b" fill-rule="evenodd" d="' + BAND + '"/></defs>' +
      '<use href="#b" fill="url(#m)" stroke="' + edge + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<use href="#b" fill="#FFFFFF" filter="url(#g)"/></svg>';
    var mid = Math.round(size / 2);
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") ' + mid + " " + mid;
  }

  // Bright polished silver for everywhere…
  var SILVER = ["#FFFFFF", "#EDF0F4", "#FCFDFE", "#C6CDD5", "#F5F7F9", "#DCE1E6"];
  // …and a warm gold version over links/buttons (hover affordance).
  var GOLD = ["#FFFFFF", "#FFEDCB", "#FFFCF3", "#EFC488", "#FFF3DC", "#F3D6A4"];

  var style = document.createElement("style");
  style.textContent =
    SPARKLE_SCOPE + " { cursor: " + starCursor(STAR_SIZE, SILVER, "#5D6673") + ", auto; }\n" +
    SPARKLE_SCOPE + " a, " + SPARKLE_SCOPE + " button, " +
    SPARKLE_SCOPE + " .zoomable { cursor: " +
    starCursor(Math.round(STAR_SIZE * 1.2), GOLD, "#7A5E30") + ", pointer; }";
  document.head.appendChild(style);

  /* ---- 2. The silver glitter trail ---- */

  // Accessibility: no trail for people who've asked their device for less motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Bright silvery whites, so the trail reads as glitter coming off the star.
  var COLOURS = ["#FFFFFF", "#F4F6F9", "#E2E7ED"];
  var MAX_SPARKLES = 28;   // hard cap on live particles — keeps it light

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

    var size = 5 + Math.random() * 7;        // px
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = (x - size / 2) + "px";
    el.style.top = (y - size / 2) + "px";
    el.style.background = COLOURS[(Math.random() * COLOURS.length) | 0];
    // subtle dark glow keeps the bright sparkles visible on light backgrounds
    el.style.filter = "drop-shadow(0 0 2px rgba(27, 58, 75, 0.4))";
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
    // Only sparkle while the cursor is inside the scoped area.
    if (!(e.target instanceof Element) || !e.target.closest(SPARKLE_SCOPE)) return;
    var now = performance.now();
    if (now - lastSpawn < 1000 / SPARKLE_DENSITY) return;  // density throttle
    lastSpawn = now;
    spawn(e.clientX, e.clientY);
  }, { passive: true });
})();
