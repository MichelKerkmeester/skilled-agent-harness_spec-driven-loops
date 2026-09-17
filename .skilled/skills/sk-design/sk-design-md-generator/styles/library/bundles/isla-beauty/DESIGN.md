# Isla Beauty — Style Reference
> Cream apothecary with surgical red accents — think warm parchment walls, amber bottles, and a single red seal on every label.

**Theme:** light

Isla is a warm editorial apothecary: a cream-paper canvas, a single vivid red that does the work of an alarm clock, and a typographic mix of geometric sans (Soehne/Nimbus) paired with Garamond italic for emotional moments. The palette stays close to skin and paper — off-white, warm sand, blush, deep ink — with red appearing only as a small functional burst: CTAs, section eyebrows, add-to-cart fills, inline accents. Components are flat and quiet: 3px corners, hairline borders, no shadows, no gradients. Layout breathes; product photography carries the visual weight while type remains a composed voice — uppercase tracked labels over serif italics over sans body.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Crimson Seal | `#e4263d` | `--color-crimson-seal` | Primary action — filled add-to-cart buttons, CTA borders, section eyebrows, price accents, link underlines, and all brand punctuation against the cream canvas. The red carries the entire chromatic load; it must read as deliberate and small, never as decoration |
| Vermillion Mark | `#e4002b` | `--color-vermillion-mark` | Secondary red accent — link borders, icon strokes, and outline-only controls. Slightly deeper than Crimson Seal; use when a quieter red moment is needed alongside the primary |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, primary borders, navigation rules, body hairlines. The structural anchor of the entire interface |
| Soft Coal | `#1a1a1a` | `--color-soft-coal` | Badge borders, heading text, list markers, card text on cream — a near-black used where pure black would feel clinical against the warm canvas |
| Slate Drift | `#2e2e2e` | `--color-slate-drift` | Navigation borders, secondary structural lines — sits between Ink Black and the warm cream as a third depth |
| Graphite | `#3a3a3a` | `--color-graphite` | Body text and borders for muted but still-readable paragraphs |
| Pewter | `#6f6f6f` | `--color-pewter` | Badge borders, helper text, muted body copy — the first true mid-gray in the scale |
| Stone | `#8a8580` | `--color-stone` | Warm-leaning gray for tags, secondary body text, and quiet fills where neutrality needs to harmonize with the cream |
| Sand Border | `#e4dfd9` | `--color-sand-border` | Warm button borders, subtle section dividers — the border color that ties the warm palette together instead of fighting it with cool gray |
| Cream Paper | `#f8f6f3` | `--color-cream-paper` | Page canvas, badge fills, soft card surfaces — the dominant background. Slightly warm to harmonize with product photography of amber liquids |
| Pure Linen | `#ffffff` | `--color-pure-linen` | Card surfaces, button text on red, elevated product panels — the brightest surface that sits one step above the cream canvas |
| Blush Wash | `#f5e7df` | `--color-blush-wash` | Soft accent badge fills, warm callout backgrounds — a desaturated peach that gives badge states a skin-like warmth |

## Tokens — Typography

### Soehne Buch — Primary body face at comfortable reading sizes (13–16px). Cleaner, more humanist than Nimbus; used for longer paragraphs and form input text. · `--font-soehne-buch`
- **Substitute:** Inter or Söhne (licensed)
- **Weights:** 400
- **Sizes:** 12, 13, 15, 16
- **Line height:** 1.00, 1.20, 1.40
- **Role:** Primary body face at comfortable reading sizes (13–16px). Cleaner, more humanist than Nimbus; used for longer paragraphs and form input text.

### Nimbus Sans — Workhorse sans for UI: button labels, body copy, price text, nav links, and all utility surfaces. Carries lnum/tnum features for tabular alignment of prices. · `--font-nimbus-sans`
- **Substitute:** Inter or Helvetica Neue
- **Weights:** 400, 500, 700
- **Sizes:** 10, 11, 13, 14, 15, 16, 17, 30, 36, 54, 68
- **Line height:** 1.00–1.55
- **Letter spacing:** Wide tracking (0.12–0.18em) for 10–11px uppercase eyebrows; tight negative tracking (-0.01 to -0.03em) at 30px+ for display sizes
- **OpenType features:** `"lnum" on, "tnum" on`
- **Role:** Workhorse sans for UI: button labels, body copy, price text, nav links, and all utility surfaces. Carries lnum/tnum features for tabular alignment of prices.

### Soehne Kraftig — Display and small-bold sans for headlines (60px), navigation, and tracked uppercase labels (11–12px with 0.07–0.10em tracking). The Kraftig cut adds authority without geometric coldness. · `--font-soehne-kraftig`
- **Substitute:** Inter Tight or Söhne Breit (licensed)
- **Weights:** 400, 500
- **Sizes:** 11, 12, 14, 60
- **Line height:** 0.98, 1.00, 1.20, 1.40
- **Letter spacing:** 0.07em at 11px nav, 0.10em at 12px section labels, -0.025em at 60px display
- **OpenType features:** `"lnum" on, "tnum" on`
- **Role:** Display and small-bold sans for headlines (60px), navigation, and tracked uppercase labels (11–12px with 0.07–0.10em tracking). The Kraftig cut adds authority without geometric coldness.

### AGaramondPro — Editorial serif for major section headlines (54px) and subheadings (17–26px). The Garamond weight gives the brand its apothecary/editorial voice; pairs with italic for emotional accents. · `--font-agaramondpro`
- **Substitute:** EB Garamond or Cormorant Garamond
- **Weights:** 600
- **Sizes:** 14, 17, 20, 26, 54
- **Line height:** 1.05, 1.25, 1.30, 1.35
- **Letter spacing:** -0.0200em
- **Role:** Editorial serif for major section headlines (54px) and subheadings (17–26px). The Garamond weight gives the brand its apothecary/editorial voice; pairs with italic for emotional accents.

### Garamond Italic — Signature italic for emotional phrases, pull quotes, and editorial interjections mid-paragraph. Used sparingly — it is a whisper, not a shout. · `--font-garamond-italic`
- **Substitute:** EB Garamond Italic
- **Weights:** 400
- **Sizes:** 13, 16
- **Line height:** 1.20, 1.55
- **Letter spacing:** 0.005em
- **OpenType features:** `"lnum" on, "tnum" on`
- **Role:** Signature italic for emotional phrases, pull quotes, and editorial interjections mid-paragraph. Used sparingly — it is a whisper, not a shout.

### EB Garamond — EB Garamond — detected in extracted data but not described by AI · `--font-eb-garamond`
- **Weights:** 500, 600
- **Sizes:** 14px, 19px
- **Line height:** 1.2, 1.4
- **Letter spacing:** -0.01
- **Role:** EB Garamond — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| overline | 10px | 1 | 1.8px | `--text-overline` |
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.4 | — | `--text-body` |
| body-lg | 17px | 1.55 | — | `--text-body-lg` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 26px | 1.25 | — | `--text-heading-sm` |
| heading | 36px | 1.1 | — | `--text-heading` |
| heading-lg | 54px | 1.05 | — | `--text-heading-lg` |
| display | 68px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 29 | 29px | `--spacing-29` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 3px |
| badges | 999px |
| images | 3px |
| inputs | 3px |
| buttons | 3px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 50-64px
- **Card padding:** 15-16px
- **Element gap:** 10px

## Components

### Primary Action Button (Add to Cart)
**Role:** Filled CTA for purchase and primary conversion

Solid #e4263d fill, white text, 3px radius, 10px 16px padding, Nimbus Sans 500 at 11px with 0.10em letter-spacing in uppercase. Full-width within product cards. Hover deepens to #e4002b.

### Outlined CTA (Shop the Elixir)
**Role:** Secondary hero action with red border

Transparent fill, 1px #e4263d border, #e4263d text, 3px radius, 10px 16px padding, Nimbus Sans 500 at 11px uppercase. Paired with a price label in the same row, separated by middle dot.

### Ghost Text Link
**Role:** Inline editorial links and story links

No background, #000000 or #e4263d text, underlined on hover, Nimbus Sans 400 at 15px. Often paired with a small arrow character (→) to indicate direction.

### Product Card
**Role:** E-commerce product tile with image, name, benefit, price, CTA

Square product image on #f8f6f3 background, 3px radius, full-bleed within card padding of 15px. Product name in Nimbus Sans 700 at 15px; benefit description in Nimbus Sans italic at 13px (#000); price in 15px with strike-through original + red sale price. Followed by full-width Add to Cart button.

### Section Eyebrow Label
**Role:** Red uppercase tracked label introducing sections

Nimbus Sans 500 at 11px, uppercase, letter-spacing 0.18em, #e4263d. Sits above headlines with 6–10px margin. The single most repeated brand element.

### Editorial Italic Pull-Quote
**Role:** Garamond italic phrase embedded in or near headlines

Garamond Italic 400 at 16–20px, #000, letter-spacing 0.005em. Used for emotional sub-copy like 'Or everything you need.' in #e4263d. Breaks the sans voice intentionally.

### Top Announcement Bar
**Role:** Free-shipping message strip across the top

Full-width, #f8f6f3 or white background, centered Nimbus Sans 400 at 11px #000 text reading 'Free Shipping Above $75'. Repeats horizontally on a ticker pattern.

### Header Navigation
**Role:** Primary site navigation with centered logo

White background, '·isla' logo centered in red (the leading dot is a brand mark), nav links flanking in Nimbus Sans 400 at 13px #000. Login + Cart on right with 999px pill border around cart count.

### Benefit Pill
**Role:** Rounded tag listing product function

999px radius, 1px #6f6f6f border, transparent fill, Nimbus Sans uppercase 11px text. Used in clusters to enumerate coverage categories (CLEANSE, HYDRATE, BRIGHTEN, REPAIR, EXFOLIATE, PROTECT).

### Comparison Card
**Role:** Two-column comparison block (typical vs. Isla system)

Full-width card, #f8f6f3 fill, 3px radius, 15px padding. Left column: light illustration of 14 bottles on shelf. Right column: 6 Isla bottles with benefit pills below. Numbers (14 vs 6) in 54–68px Nimbus Sans bold.

### Image Detail Block
**Role:** Full-bleed or contained macro photography

No overlay, no text — just edge-to-edge product or skin photography (amber pour, eye close-up, glassware). Images carry 3px radius when contained, sharp edges when full-bleed.

### Price with Sale
**Role:** Inline pricing with original and sale value

Original price in #8a8580 strikethrough Nimbus Sans 400, sale price in #e4263d Nimbus Sans 700. Single line, left-aligned, 12–15px.

### Soft Badge
**Role:** Tag or status badge with warm fill

999px radius, #f5e7df or #f8f6f3 fill, 1px border in #1a1a1a or #6f6f6f, Nimbus Sans 400 at 10–11px uppercase. Used for category tags and editorial annotations.

## Do's and Don'ts

### Do
- Use #e4263d exclusively as the brand red — never substitute another red, and never tint or lighten it for non-critical contexts.
- Pair Garamond italic #e4263d phrases with sans body copy when you want editorial emphasis.
- Set all uppercase micro-labels (10–12px) at letter-spacing 0.12–0.18em in Nimbus Sans 500.
- Use 3px radius for every rectangular component — cards, buttons, inputs, images. Reserve 999px exclusively for pills/tags.
- Set the page canvas to #f8f6f3 (cream), not #ffffff. White appears only on cards, buttons, and product images.
- Anchor every section with a red eyebrow label (Nimbus 11px uppercase, 0.18em) before the headline.
- Use hairline 1px borders in #000000 or #e4dfd9 — never 2px+ and never with shadows.

### Don't
- Don't introduce drop shadows, glow effects, or elevation layers — the design is intentionally flat.
- Don't use cool grays (blue-tinted). All neutrals should sit in the warm spectrum (#6f6f6f, #8a8580, #e4dfd9).
- Don't round corners beyond 3px on rectangular components; the system is sharp with intentional restraint.
- Don't mix more than one serif in the same paragraph. Garamond Italic is punctuation, not body type.
- Don't use red as a fill area larger than a button — red is a seal, not a field.
- Don't set body copy below 13px or above 17px. The 13–17px range is the system's comfort zone.
- Don't use #000000 for anything other than primary text and primary borders. For surfaces and secondary text, move to #1a1a1a or #3a3a3a.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f8f6f3` | Page canvas — the warm base everything sits on |
| 1 | Pure Linen | `#ffffff` | Card surface, product image background, button text on red |
| 2 | Blush Wash | `#f5e7df` | Warm accent fill for badges and soft callouts |
| 3 | Crimson Seal | `#e4263d` | Filled action surface — Add to Cart, critical alerts |
| 4 | Stone Gray | `#7e7d7c` | Muted input/disabled surface for low-emphasis UI |

## Elevation

Isla deliberately avoids shadow-based elevation. Depth is communicated through a 4-step surface scale (#f8f6f3 canvas → #ffffff cards → #f5e7df accents → #e4263d actions) and 1px hairline borders in #000000 or #e4dfd9. Components feel printed on paper, not floating in z-space.

## Imagery

Photography dominates the visual language. Style: macro product shots of amber liquid pouring from glass bottles and droppers, with natural light, soft white surfaces, and visible refraction. Skin imagery is close-cropped, unretouched-appearing, focused on eyes or lips. No lifestyle context, no models in full. Images are either full-bleed (no rounding) or contained in 3px-radius squares. The photography is the atmosphere; the typography is the architecture.

## Layout

Layout is max-width 1200px centered with generous vertical breathing. Hero is a split composition: bold left-aligned headline with eyebrow + italic sub-copy, paired with a large macro product image filling the right two-thirds. Product grids use 4 equal columns with consistent 15px internal padding. Section rhythm is consistent — eyebrow label, headline, body, optional CTA, then 50–64px gap before the next section. No alternating dark/light bands; the entire site lives on the cream canvas. Navigation is a thin top bar with centered logo, flanking nav, and a cart pill on the right.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #000000
- text (muted): #6f6f6f
- background (canvas): #f8f6f3
- border (hairline): #000000 or #e4dfd9
- accent (editorial italic / eyebrow): #e4263d
- primary action: #e4263d (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #e4263d background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. *Product card*: #ffffff card on cream canvas, 15px padding. Square product image (3px radius) at top. Product name in Nimbus Sans 700 at 15px #000. Italic benefit line in Nimbus Sans italic 400 at 13px. Price: $58.00 in #8a8580 strikethrough, $50 in #e4263d bold. Full-width Add to Cart button below: #e4263d fill, white text, 3px radius, 10px 16px padding, Nimbus Sans 500 11px uppercase with 0.10em tracking.
3. *Section eyebrow + heading pair*: Red eyebrow 'THE TYPICAL SHELF' in Nimbus 500 11px uppercase 0.18em tracking #e4263d, 10px below it a Nimbus Sans 700 36px heading in #000. Underneath, body copy in Soehne Buch 400 15px #3a3a3a at 1.4 line-height.
4. *Benefit pill cluster*: 999px radius, 1px #6f6f6f border, transparent fill, Nimbus Sans 500 11px uppercase text #000. Pills in a horizontal row with 8px gap. Used to list product functions (CLEANSE, HYDRATE, BRIGHTEN, REPAIR, EXFOLIATE, PROTECT).
5. *Comparison card*: Two columns on #f8f6f3 background, 3px radius, 15px padding. Left: section eyebrow + '14 bottles. Most half-full.' in Nimbus 36px, with light illustration below. Right: same eyebrow variant + 'Six bottles. Everything covered.' in Nimbus 36px, 6 Isla bottles illustration, benefit pills row at the bottom.

## Signature Type Pairings

Isla's voice emerges from three intentional pairings: (1) Soehne Kraftig 400 display + Nimbus Sans 500 eyebrow — the geometric authority with the tracked micro-label. (2) Garamond Italic 400 + Nimbus Sans 400 body — the serif whisper inside the sans conversation. (3) Soehne Buch 400 paragraph + Nimbus Sans 700 product name — the reader face meeting the merchant face. The Garamond italic in #e4263d is the single highest-impact brand moment; use it 1–2 times per page max.

## Similar Brands

- **Aesop** — Same apothecary warmth: cream and sand neutrals, single restrained accent, Garamond-adjacent serifs for headlines, flat components with hairline borders and minimal radii
- **Glossier** — Same soft pink-cream palette, editorial product photography on pure white, and a single saturated brand color used as small punctuation across otherwise quiet layouts
- **Flamingo Estate** — Same Garamond-italic + sans-serif editorial mix, warm off-white canvas, and apothecary product photography with natural light
- **Boy Smells** — Same red-as-seal accent strategy against a cream background, uppercase tracked micro-labels, and flat product cards with hairline detail
- **Cuyana** — Same editorial restraint: cream canvas, serif headlines, tracked uppercase eyebrows, product grids with generous breathing room, and a single chromatic accent used sparingly

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-crimson-seal: #e4263d;
  --color-vermillion-mark: #e4002b;
  --color-ink-black: #000000;
  --color-soft-coal: #1a1a1a;
  --color-slate-drift: #2e2e2e;
  --color-graphite: #3a3a3a;
  --color-pewter: #6f6f6f;
  --color-stone: #8a8580;
  --color-sand-border: #e4dfd9;
  --color-cream-paper: #f8f6f3;
  --color-pure-linen: #ffffff;
  --color-blush-wash: #f5e7df;

  /* Typography — Font Families */
  --font-soehne-buch: 'Soehne Buch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nimbus-sans: 'Nimbus Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-soehne-kraftig: 'Soehne Kraftig', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-agaramondpro: 'AGaramondPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-garamond-italic: 'Garamond Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-overline: 10px;
  --leading-overline: 1;
  --tracking-overline: 1.8px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-body-lg: 17px;
  --leading-body-lg: 1.55;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.05;
  --text-display: 68px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-56: 56px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 50-64px;
  --card-padding: 15-16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 3px;
  --radius-badges: 999px;
  --radius-images: 3px;
  --radius-inputs: 3px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-cream-paper: #f8f6f3;
  --surface-pure-linen: #ffffff;
  --surface-blush-wash: #f5e7df;
  --surface-crimson-seal: #e4263d;
  --surface-stone-gray: #7e7d7c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-crimson-seal: #e4263d;
  --color-vermillion-mark: #e4002b;
  --color-ink-black: #000000;
  --color-soft-coal: #1a1a1a;
  --color-slate-drift: #2e2e2e;
  --color-graphite: #3a3a3a;
  --color-pewter: #6f6f6f;
  --color-stone: #8a8580;
  --color-sand-border: #e4dfd9;
  --color-cream-paper: #f8f6f3;
  --color-pure-linen: #ffffff;
  --color-blush-wash: #f5e7df;

  /* Typography */
  --font-soehne-buch: 'Soehne Buch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nimbus-sans: 'Nimbus Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-soehne-kraftig: 'Soehne Kraftig', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-agaramondpro: 'AGaramondPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-garamond-italic: 'Garamond Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-overline: 10px;
  --leading-overline: 1;
  --tracking-overline: 1.8px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-body-lg: 17px;
  --leading-body-lg: 1.55;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.05;
  --text-display: 68px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-56: 56px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-full: 999px;
}
```
