# Megan's Portfolio 🌿

A personal portfolio website for a UX / experience designer & researcher.
Built with plain HTML, CSS, and a tiny bit of JavaScript — **no installs, no
build tools, no coding knowledge required** to edit it.

---

## 1. How to view the site on your computer

The simplest way: **double-click `index.html`** and it opens in your browser.
That's it — the whole site works this way, including the password gate and
all the project pages.

> 💡 The default password is **`mieko`** — see "Changing the password" below.

If you ever want a "proper" local preview (identical to how a host serves it),
and you have a Mac, you can also run this in Terminal from the project folder:
`python3 -m http.server` then open `http://localhost:8000` — but double-clicking
`index.html` is genuinely fine.

---

## 2. What's in each file

| File / folder | What it is |
|---|---|
| `index.html` | The landing page — hero, About Me, My Works, Other Fun Things, Contact |
| `project-1.html` / `project-2.html` / `project-3.html` | One case-study page per project |
| `css/style.css` | ALL the colours, fonts, and spacing, in one place |
| `js/main.js` | The password gate (the password is set at the top of this file) |
| `fonts/` | The two typefaces (Fraunces & Karla), self-hosted so the site works offline |
| `images/` | Every image on the site. Placeholders are clearly labelled |
| `README.md` | This guide |

---

## 3. How to edit the text

Open any `.html` file in a text editor (TextEdit on Mac works, but the free
[Visual Studio Code](https://code.visualstudio.com/) is much nicer — it
colour-codes everything).

Every spot you're meant to edit is marked with a comment like:

```html
<!-- ✏️ EDIT: your intro paragraph -->
```

and placeholder text is wrapped in `[PLACEHOLDER — replace me!]` so you can
search for the word **PLACEHOLDER** to find everything that still needs your
words. Edit only the text *between* the tags — for example, change:

```html
<p>[PLACEHOLDER] Old text here.</p>
```

to:

```html
<p>Your lovely new text here.</p>
```

…and don't delete the `<p>` and `</p>` parts. Save the file, refresh your
browser, done.

### Editing a case study (project page)

The body of each project page is a stack of **blocks**. There are only two
kinds, and you can copy/paste, delete, or reorder them freely without
breaking anything:

```html
<!-- A TEXT block -->
<div class="cs-text">
  <h2>Section heading</h2>
  <p>A paragraph…</p>
  <p>Another paragraph…</p>
</div>

<!-- An IMAGE block -->
<figure class="cs-image">
  <img src="images/your-image.jpg" alt="describe the image">
  <figcaption>Optional caption</figcaption>
</figure>
```

Want a smaller, centred image (nice for mobile screenshots)? Use
`<figure class="cs-image cs-image--narrow">` instead.

---

## 4. How to replace the images

1. Drop your image file into the `images/` folder (JPG or PNG is fine).
2. In the HTML file, find the matching `<img …>` tag — each one has a
   comment above it saying what it's for.
3. Change the `src` to your file's name, e.g.
   `src="images/portrait-placeholder.svg"` → `src="images/portrait.jpg"`.
4. Update the `alt="…"` text to describe your image (this is what screen
   readers announce, and what shows if the image fails to load).

Placeholders and roughly the shape of image that fits best:

| File to replace | Where it appears | Best shape |
|---|---|---|
| `portrait.jpg` | Hero portrait | Portrait (4:5), e.g. 800×1000px |
| `frank-card.png` | Work card 1 (FRANK) | Landscape (4:3), e.g. 1200×900px |
| `chatbot-card.png` | Work card 2 (Chatbot) | Landscape (4:3) |
| `bundling-card.png` | Work card 3 (Soft Bundling) | Landscape (4:3) |
| `fun-gachapon.png`, `fun-*-placeholder.svg` | Other Fun Things cards | Landscape (16:10) |
| `frank-*.png` | Inside the FRANK case study | Wide, or tall for mobile shots |
| `chatbot-*.png` | Inside the Chatbot case study | Wide, `chatbot-topics.png` is tall |
| `bundling-*.png` | Inside the Soft Bundling case study | Wide (16:9) |

> ⚠️ **Filenames must match exactly** — including lowercase and the `.png`
> ending. On a Mac, Finder hides file extensions by default, so renaming can
> accidentally create `name.png.png`. Turn on **Finder → Settings → Advanced →
> Show all filename extensions** to see the real name.

Don't worry about exact sizes — images are automatically cropped/scaled to
fit. Just avoid enormous files (aim under ~1&nbsp;MB each; [tinypng.com](https://tinypng.com)
compresses them for free).

---

## 5. Changing colours & fonts

Open `css/style.css`. The **first block** (called `:root`) contains every
colour with a plain-English comment. Change a value, save, refresh.

The fonts are **Fraunces** (headings) and **Karla** (body), both free fonts
from Google Fonts. They're *self-hosted* — the font files live in the `fonts/`
folder — so the site loads fast and doesn't depend on Google's servers.

To swap fonts: pick new ones at [fonts.google.com](https://fonts.google.com),
then the easiest route is to replace the `<link rel="stylesheet"
href="fonts/fonts.css">` line in each HTML file's `<head>` with the
`<link>` embed code Google Fonts gives you, and update the
`--font-heading` / `--font-body` lines in `css/style.css`.

---

## 6. The password gate — read this bit! 🔐

### Changing the password

Open `js/main.js`. The first line of real code is:

```js
var SITE_PASSWORD = "mieko";
```

Change `mieko` to anything you like (keep the quotes). Visitors stay unlocked
for their current browser tab only.

### ⚠️ Why this is NOT real security

This gate runs entirely in the visitor's browser. Anyone who opens their
browser's dev tools can read the password in `js/main.js` or skip the gate
completely. It will keep out casual visitors — a curious colleague, someone
who stumbles on the link — **but not anyone determined.** Never put anything
truly confidential behind it.

### Real password protection (do this when you deploy)

Real protection has to happen on the **server**, before the page is ever sent
to the browser. The good news: hosts offer this as a tick-box feature.

- **Netlify** — *Site configuration → Access & security → Site protections*
  lets you set a site-wide password. This is a **paid-plan feature**, but it's
  the simplest "real" option: one password, zero configuration.
- **Vercel** — *Project Settings → Deployment Protection → Password
  Protection*. Also a **paid add-on**.
- **Cloudflare Pages + Cloudflare Access** — **free** for a personal site.
  Host on Cloudflare Pages, then use "Zero Trust → Access" to require an
  email code or password before anyone sees the site. Slightly more setup,
  but genuinely secure and £0.
- **StatiCrypt** ([github.com/robinmoisson/staticrypt](https://github.com/robinmoisson/staticrypt)) —
  a free tool that *encrypts* your HTML with a password, so the content
  really can't be read without it. A good free option if you stay on
  Netlify's free tier.

(Pricing changes — double-check each host's current plans.)

The gate only appears on the landing page (`index.html`) — the front door of
the site. Once you have real protection turned on, you can remove it entirely
if you like: delete the `<div id="gate">…</div>` block and the small
`<script>` in the `<head>` of `index.html`.

---

## 7. Deploying (putting it on the internet)

**Easiest, recommended: Netlify Drop.**

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and sign up (free).
2. Drag your whole `portfolio` folder onto the page.
3. Done — you get a live URL in seconds. You can rename it (e.g.
   `megan-portfolio.netlify.app`) in *Site settings → Change site name*.
4. To update the site later, just drag the folder in again
   (*Deploys → drag & drop*).

**Also great: Vercel** ([vercel.com](https://vercel.com)) — connect this
GitHub repository and it auto-deploys every time the code updates.

**Custom domain?** Both hosts let you connect one (e.g. `megansim.com`) in a
few clicks — you just buy the domain (~£10/year from Namecheap or Google
Domains) and follow their "add custom domain" wizard.

---

## 8. Quick "help, I broke it" tips

- The site looks unstyled? Check `index.html` and `css/style.css` are still
  in the right folders — the HTML files expect `css/`, `js/`, and `images/`
  to sit next to them.
- An image isn't showing? The filename in `src="images/…"` must match the
  real file name **exactly**, including capital letters and `.jpg` vs `.jpeg`.
- Made a mess? This project lives in Git/GitHub, so every previous version
  is saved — you can always restore an older copy of a file from GitHub's
  "History" view.
