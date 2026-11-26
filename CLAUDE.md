# Chloé's Cakeaway — website

A single-page, static website for **Chloé's Cakeaway** (@chloescakeaway), a bespoke cake and cupcake business run from home in Potters Bar, Hertfordshire. The business had no website before this one; Instagram is its portfolio and main contact channel, and it stays that way here.

Intended URL: `https://leowestcott.github.io/Chloes-Cakeaway/` (GitHub Pages, repo `leowestcott/Chloes-Cakeaway`). If the repo name differs, see *Changing the site URL* below.

## What has been built

| File | Purpose |
| --- | --- |
| `index.html` | The homepage. **Generated — do not edit by hand.** |
| `index-welcome.html` | Identical homepage with the optional welcome overlay. **Generated.** |
| `scripts/template.html` | The single source for both pages. Edit content here. |
| `assets/css/site.css` | All styles (hand-written, no framework). Inlined into the pages at build time. |
| `assets/js/site.js` | All interactions (vanilla JS). Minified to `site.min.js` at build time. |
| `assets/js/welcome.js` | Welcome-overlay logic (only loaded by `index-welcome.html`). |
| `assets/fonts/` | Self-hosted, subsetted WOFF2 fonts (Fraunces, Fraunces Italic, Manrope, Pinyon Script). |
| `assets/img/` | Responsive AVIF + WebP images (generated), icons, `og-image.jpg`. |
| `source/` | The original Instagram photos the images are made from. |
| `scripts/images.json` | Image catalogue: id, source file, crop, alt text, caption, gallery category, Instagram post URL. |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest` | Icons (script “C” monogram). |
| `robots.txt`, `sitemap.xml`, `.nojekyll` | Hosting / SEO housekeeping. |
| `BRAND.md` | The visual identity: palette, type, logo, image and motion rules. |

### Page structure (in order)

1. **Header** – script wordmark, section nav, *Enquire* button, scroll-progress line. Hides on scroll down, returns on scroll up. Below 1024px it becomes a circular-reveal full-screen menu.
2. **Hero** (`#top`) – “Not just cake. A centrepiece.”, arched hero photo with a floating orb and tilted tile, rotating “Made to order” badge, two CTAs, trust line (hygiene rating 5, licensed/registered/insured).
3. **Marquee** – occasions taken from real captions.
4. **The Story** (`#story`) – the art of cake making: Chloé's real story from her captions (first novelty cake for her dad's 65th, business from 2016, made her own wedding cake, the custard-cream cake ten years on), a pull quote in her own words and three facts.
5. **Statement** – dark band; the sentence lights up word by word as you scroll; four pillars.
6. **The Collection** (`#collection`) – six “chapters” (Celebration, Sculpted & Novelty, Little Ones, Cupcakes & Treats, Tiers & Milestones, Free-From). On large screens they stack on top of each other as you scroll (sticky cards that recede). Each CTA jumps to the form with the occasion preselected.
7. **Through the year** – seasonal strip (Valentine's, Mother's Day, Christmas).
8. **Flavours** (`#flavours`) – only flavours that appear in her captions.
9. **Gallery** (`#gallery`) – 57 real photos in a masonry layout, filters, *Show more*, native `<dialog>` lightbox (keyboard + swipe), link back to each Instagram post, *Follow along on Instagram* CTA.
10. **How ordering works** (`#ordering`) – four steps, plus a clear note that nothing is booked until Chloé replies.
11. **Enquiry** (`#enquire`) – form (see below) and a direct Instagram message link.
12. **Footer** – wordmark, description, FSA hygiene-rating link, nav, Instagram, copyright.

### How the enquiry form works

No verified email address or booking system exists, so the form **does not send data anywhere**. On submit it validates the fields, composes a friendly, formatted message and shows it with a **Copy & open Instagram** button: the message is copied to the clipboard and `https://ig.me/m/chloescakeaway` opens the Instagram DM so the customer only has to paste and send. There is also *Copy text only* and *Edit details*.

To switch to email later, replace the submit handler in `assets/js/site.js` (search for `enquiry form`) with a `mailto:` link or a form service such as Formspree, then rebuild.

### Content rules followed

* Every photo is Chloé's own, from @chloescakeaway. No stock or AI images.
* No invented prices, flavours, delivery promises, testimonials or founder details. Story and flavour copy are paraphrased from her own captions. Wedding cakes are mentioned as rare because her captions say so.
* Facts verified: bio (“Bespoke cakes and cupcakes, made to order · Fully licensed, registered and insured · Based in Potters Bar”) and the Food Standards Agency rating of **5 (Very Good)**, Hertsmere, inspected 25 April 2025 ([FSA page](https://ratings.food.gov.uk/business/1040443)). If the rating changes, update the hero trust line, the story facts, the pillars and the footer badge.
* TikTok watermarks on some reel covers have been cropped out (crop boxes in `scripts/images.json`).

## Technologies

Static HTML, hand-written modern CSS (custom properties, `clamp()`, `color-mix()`, `svh`/`dvh`, `content-visibility`, sticky stacking, `:focus-visible`), vanilla JS (IntersectionObserver, native `<dialog>`, Clipboard API). No runtime dependencies or frameworks.

Build-time tools only (not shipped): Python 3 + Pillow (crops), Node + `sharp` (AVIF/WebP encoding), `esbuild` (CSS/JS minification).

## Run and test locally

```bash
cd ~/development/Chloes-Cakeaway
python3 -m http.server 8000
# open http://localhost:8000/ and http://localhost:8000/index-welcome.html
```

(Opening the files with `file://` mostly works, but use a local server so fonts and the clipboard behave as they will online.)

What was tested before hand-over:

* Lighthouse (mobile and desktop, served with gzip like GitHub Pages): **100 / 100 / 100 / 100** for Performance, Accessibility, Best Practices and SEO on both `index.html` and `index-welcome.html`. LCP ≈ 0.8s (mobile, simulated), CLS 0.
* 31 automated browser checks: mobile menu (open, Esc, focus, links), every nav link lands on its section, gallery filters, *Show more*, lightbox (open, next, keyboard, close, image loads), form validation, message composition, clipboard copy, the Instagram link, the occasion preselect, no horizontal overflow at 390px or 1440px, no console errors, welcome overlay (shows, dismisses by key, auto-dismisses, once per session).
* Every referenced file exists; every image decodes; no duplicate IDs or broken anchors.

The remaining Lighthouse “insight” about cache lifetime is GitHub Pages' fixed 10-minute cache and can't be changed on Pages.

## Editing and rebuilding

One-off setup for the build tools (from the repo root):

```bash
npm install            # installs sharp + esbuild (dev only)
pip3 install pillow
```

* **Text / layout:** edit `scripts/template.html` (and the chapter copy in `CHAPTERS` / gallery order in `GALLERY_ORDER` inside `scripts/build-html.py`), then run `python3 scripts/build-html.py`.
* **Styles or JS:** edit `assets/css/site.css` or `assets/js/*.js`, then run `python3 scripts/build-html.py` (it inlines/minifies them).
* **Add a photo:** put the original in `source/`, add an entry to `scripts/images.json` (optional `crop: [left, top, right, bottom]` as fractions), add its id to `GALLERY_ORDER`, then:

  ```bash
  python3 scripts/build-images.py   # crops → scripts/.crops/
  node scripts/build-images.mjs     # AVIF + WebP sizes → assets/img/, writes scripts/image-sizes.json
  python3 scripts/build-html.py     # regenerates both pages
  ```

### Changing the site URL

The canonical URL, Open Graph tags and JSON-LD use `SITE_URL` (default `https://leowestcott.github.io/Chloes-Cakeaway/`):

```bash
SITE_URL="https://example.co.uk/" python3 scripts/build-html.py
```

Also update `robots.txt` and `sitemap.xml`. All asset paths are relative, so the site works from any folder.

## Deploying to GitHub Pages

1. Create the repo `leowestcott/Chloes-Cakeaway` on the GitHub account and add it as `origin`.
2. Push `main`: `git push origin main`.
3. In the repo: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**.
4. The site appears at `https://leowestcott.github.io/Chloes-Cakeaway/` within a minute or two.

`.nojekyll` is included so Pages serves every file as-is. Commits are authored by the repo owner only (no co-author or AI attribution lines).

## Implementation notes

* CSS is inlined into each page (no render-blocking stylesheet). Four fonts are subsetted to Latin and preloaded; metric-matched fallbacks keep layout shift at zero.
* The hero image is preloaded as AVIF with `fetchpriority="high"`. Everything else is lazy-loaded with explicit `width`/`height` and a dominant-colour placeholder background.
* Off-screen sections use `content-visibility: auto`. In-page links re-check their landing position because of this (see `site.js`).
* Motion respects `prefers-reduced-motion`: reveals, parallax, marquee, word lighting and stacking are switched off.
* The welcome overlay shows once per browser session (`sessionStorage`), skips on click, Enter, Space or Esc, and auto-dismisses after about 4 seconds.
* `index-welcome.html` uses the same canonical URL as `index.html`, so search engines treat them as one page.
