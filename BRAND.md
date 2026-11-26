# Chloé's Cakeaway — brand guide

## Brand identity

**Who:** Chloé's Cakeaway, an independent, home-based cake maker in Potters Bar, Hertfordshire. She makes bespoke cakes and cupcakes to order and is fully licensed, registered and insured, with a food hygiene rating of 5.

**Positioning:** a boutique cake atelier with a personal heart. The work ranges from refined buttercream rosettes and vintage piping to playful, hand-modelled sculpted cakes. The brand needs to hold both: polished and premium, but warm and never stuffy.

**Voice:** warm, confident and a little playful, like Chloé's own captions. Write in plain British English. Use real details (“a sofa complete with the family dog”) rather than generic superlatives. Never invent claims, prices or reviews.

**Tagline set:**
- Primary: *Not just cake. A centrepiece.*
- Supporting: *Made to order · Made with love · Potters Bar*
- Welcome line: *Something beautiful is baking…*

## Logo

The business had no formal logo. Its existing identity is the name itself, which appears as a script watermark on early photos and piped onto cake boards. The website formalises that into:

**Wordmark (primary)**
- “Chloé's” set in **Pinyon Script**
- “CAKEAWAY” beneath it in **Manrope SemiBold**, uppercase, letter-spacing 0.5em
- Cocoa (`#2E1B16`) on light backgrounds; blush (`#EFD5CC`) script with champagne (`#E5D2B3`) caps on dark backgrounds

**Monogram (favicon / social avatar)**
- A script “C” (Pinyon glyph, converted to a vector path) in blush, centred on a cocoa disc, with a fine caramel inner ring. Files: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `assets/img/icon-192.png`, `assets/img/icon-512.png`.

**Usage**
- Always write the name with the accent and apostrophe: **Chloé's Cakeaway**.
- Keep clear space around the wordmark at least the height of the “C”.
- Don't recolour the script outside the palette, stretch it, add shadows or effects, or set it in a different script face.
- The script face is for the name and the occasional single-word flourish (for example the @handle). Never use it for sentences.

## Colour palette

| Role | Name | HEX |
| --- | --- | --- |
| Page background | Ivory | `#FBF6EF` |
| Soft panels | Cream | `#F4EADD` |
| Accent panels, marquee | Blush | `#EFD5CC` |
| Numerals, outlines | Blush deep | `#C98C7E` |
| Italic accents in headings | Rose | `#A85F55` |
| Warm panels | Champagne | `#E5D2B3` |
| Eyebrows, links, hover fills | Caramel | `#94602F` |
| Dark sections, buttons, text on light | Cocoa | `#2E1B16` |
| Secondary dark (Flavours) | Cocoa 2 | `#4A2E25` |
| Body text | Ink | `#2A1A15` |
| Secondary text | Muted | `#6E5249` |

Guidance:
- Ivory and cream do most of the work. Blush is an accent, not a background for everything, so the brand stays “feminine without being pink”.
- Use cocoa sections sparingly (statement, one collection chapter, flavours, footer) to add depth and contrast.
- No bright pinks, no gradients beyond very soft radial glows, and no metallic-gold effects. Gold appears only in the photography, because it's real gold leaf and lustre.
- All text pairs meet WCAG AA. Caramel was darkened to `#94602F` so small eyebrow text passes on ivory.

## Typography

| Use | Typeface | Notes |
| --- | --- | --- |
| Display & headings | **Fraunces** (variable, weight 300–800) | Weight 330–400, tight tracking (−0.02 to −0.035em), line-height 0.94–1.1 |
| Accent words | **Fraunces Italic** | One or two words per heading, in rose: “A *centrepiece.*” |
| Body, UI, labels | **Manrope** (variable) | 1rem–1.0625rem body, line-height 1.7. Eyebrows and buttons: 600 weight, uppercase, 0.14–0.24em tracking |
| Name / flourish | **Pinyon Script** | Wordmark and the @handle only |

Scale (fluid with `clamp()`): hero 3.1–7.4rem · XL 2.6–6.4rem · L 2.2–4.6rem · M 1.7–2.6rem.

All fonts are open-source (SIL OFL), self-hosted as subsetted WOFF2 files in `assets/fonts/`.

## Design principles

1. **The cakes are the hero.** Large, deliberately placed photography; the interface stays quiet around it.
2. **Patisserie shapes.** Arches (like a cake dome or shop window), circles (like cake boards), and soft-cornered tiles. Avoid generic rounded cards in rows.
3. **Editorial rhythm.** Generous whitespace, asymmetric compositions, overlapping images, oversized numerals, and an alternation of light and cocoa sections.
4. **Personal, not corporate.** Use Chloé's real story and words. Real occasions, real names of cakes.
5. **Honest commerce.** Clear calls to enquire, and clear expectations: nothing is booked until Chloé replies.

## Image treatment

- **Only real photos from @chloescakeaway.** Never use stock or AI images.
- Crop to remove platform watermarks (TikTok badges on reel covers) and distracting surroundings. Favour 4:5 portrait crops with the cake centred.
- Light-touch adjustment only: +3% saturation and a gentle sharpen. Don't change the colours of the cake itself.
- Hero and feature images sit inside **arches**. Secondary images go in **orbs** (with a 6px ivory border) or tilted **tiles**.
- Pair a refined cake with a playful one in compositions. That mix is the brand.
- Gallery captions are short and specific (“A man and his dog, fully edible”). Alt text describes the cake for screen readers.
- Images are delivered as AVIF with a WebP fallback at 400/720/1080/1440px, lazy-loaded, with a dominant-colour placeholder.

## Animation and interaction

Character: **slow-in, soft-out, unhurried**. Think of a ribbon being tied, not a bounce.

- Easing: `cubic-bezier(.22, 1, .36, 1)` for movement and `cubic-bezier(.65, 0, .35, 1)` for wipes and clips. Durations run 0.5–1.3s.
- **Image reveals:** a clip-path wipe from the bottom while the photo settles from 118% to 100% scale.
- **Text reveals:** short rise and fade, staggered by 80ms.
- **Statement:** words light up as the reader scrolls past.
- **Hero:** slow zoom-settle on the main image, a parallax drift on the orb and tile, and a continuously rotating badge.
- **Collection:** chapters stack as sticky cards. The previous card shrinks to 94% and dims as the next arrives.
- **Hover:** images zoom gently (5–6%) and captions slide up. Buttons fill with caramel from below.
- **Menu:** a circular reveal from the menu button. Links rise in sequence.
- **Lightbox:** a soft zoom-in, with arrow keys and swipe to navigate.
- **Welcome overlay:** the cake orb settles, the name rises, then the curtain lifts upwards.
- Everything respects `prefers-reduced-motion`. Motion never hides content from search engines or Lighthouse (hero content is painted immediately).
