/* ==========================================================================
   MEGAN'S PORTFOLIO — JAVASCRIPT
   ==========================================================================
   The only job of this file is the password gate.

   ✏️  CHANGE THE PASSWORD HERE:
   ========================================================================== */
var SITE_PASSWORD = "mieko";   // ← change "mieko" to whatever you like

/* --------------------------------------------------------------------------
   ⚠️ HONEST SECURITY NOTE (also explained in the README):
   This gate runs in the visitor's browser, so anyone comfortable with
   browser dev tools can read this file and find the password, or bypass
   the gate entirely. It politely keeps casual visitors out — nothing more.
   For real protection, use your host's password feature (see README.md,
   section "Real password protection").
   -------------------------------------------------------------------------- */

(function () {
  var form = document.getElementById("gate-form");
  if (!form) return; // no gate on this page

  var input = document.getElementById("gate-input");
  var error = document.getElementById("gate-error");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page reloading

    if (input.value === SITE_PASSWORD) {
      // Remember the visitor for this browser tab, then reveal the site.
      sessionStorage.setItem("megan-portfolio-unlocked", "yes");
      document.documentElement.classList.remove("gate-locked");
      // Let other scripts (like the tickle effect) know the page is now
      // visible, so they can re-measure where everything is.
      window.dispatchEvent(new Event("portfolio:unlocked"));
    } else {
      error.textContent = "Hmm, that's not it — try again?";
      input.value = "";
      input.focus();
    }
  });
})();
