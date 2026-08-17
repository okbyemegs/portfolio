/* ==========================================================================
   MEGAN'S PORTFOLIO — JAVASCRIPT
   ==========================================================================
   The only job of this file is the password gate.

   ✏️  CHANGE THE PASSWORD HERE:
   ========================================================================== */
var SITE_PASSWORD = "mieko";   // ← change "mieko" to whatever you like

/* The password is deliberately FORGIVING. Capital letters and stray spaces
   are ignored, so "Mieko", "mieko" and " Mieko " all get in. Phone keyboards
   like to capitalise the first letter for you, and a name feels like it
   wants a capital, so being strict here just locked people out for no
   reason. (There's no security cost — see the honest note below.) */

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

  // Strip surrounding spaces and ignore capitals, so a stray space or a
  // capital first letter doesn't lock someone out.
  function tidy(value) {
    return String(value).trim().toLowerCase();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page reloading

    if (tidy(input.value) === tidy(SITE_PASSWORD)) {
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
