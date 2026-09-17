# Anything — Style Reference
> afternoon daydream over a wildflower field. Soft, floating, a little surreal — white UI plates drifting above a photograph that feels half-remembered.

**Theme:** light

Anything speaks in a daylight reverie: white canvas overlaid on dreamy photography, pill-shaped translucent navigation floating above the imagery, and one soft green accent that surfaces only as decorative punctuation. The wordmark is set in Instrument Serif italic — handwritten, not corporate — paired with Inter for UI and Instrument Sans for headlines, replacing the typical bold sans wordmark with something more personal. Components round generously at 20px on cards and images, 9999px on buttons, with shadows kept whisper-soft. Color is rationed: most surfaces are white or the faintest off-white; #448f52 appears sparingly on text and shimmer gradients, never as a filled CTA.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary headings, body text, and icon fills on light surfaces. Do not promote it to the primary CTA color |
| Charcoal | `#18191b` | `--color-charcoal` | Secondary text, heading color, deep UI surfaces — slightly warmer than pure black |
| Slate Mid | `#6a6a6c` | `--color-slate-mid` | Body text, helper copy, muted descriptions |
| Steel | `#7d7f80` | `--color-steel` | De-emphasized headings, inactive labels |
| Ash | `linear-gradient(90deg, rgb(172, 173, 174) 0%, rgb(172, 173, 174) 30%, rgb(109, 192, 120) 35%, rgb(153, 183, 250) 40%, rgb(172, 173, 174) 45%, rgb(172, 173, 174) 100%)` | `--color-ash` | Icon strokes, subtle heading tint, gradient base color for the shimmer effect; Decorative text/divider gradient — silver base with brief green and periwinkle flash at 35-40% |
| Fog | `#bbbbbb` | `--color-fog` | Hairline borders across cards, inputs, images, and dividers |
| Mist | `#c4c4c4` | `--color-mist` | Card borders, softer structural lines |
| Pebble | `#dbdbdb` | `--color-pebble` | Disabled button background, body borders — the lightest non-surface gray |
| Cloud | `#f2f2f2` | `--color-cloud` | Elevated surface tier, button borders, subtle fills |
| Snow | `#f9f9f9` | `--color-snow` | Card surface background — one step off white for gentle separation |
| Paper | `#ffffff` | `--color-paper` | Page canvas, input fields, icon fills, reversed text on dark elements |
| Fern | `#448f52` | `--color-fern` | Accent text, decorative punctuation in body copy, gradient flash color — the only chromatic voice, rationed carefully |
| Mint Wash | `#dbeddf` | `--color-mint-wash` | Pale green surface tint, decorative wash blocks |

## Tokens — Typography

### Inter — Primary UI typeface — body, nav links, buttons, inputs, captions, and subheadings across the interface · `--font-inter`
- **Substitute:** DM Sans or IBM Plex Sans
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 29px
- **Line height:** 1.33, 1.40, 1.43, 1.50, 1.56
- **Letter spacing:** 0.02em
- **Role:** Primary UI typeface — body, nav links, buttons, inputs, captions, and subheadings across the interface

### Instrument Serif — Wordmark and editorial accents — the italic 'Anything' logo is the system's signature gesture, replacing the standard bold-sans brand mark with something handwritten and human · `--font-instrument-serif`
- **Substitute:** Cormorant Garamond Italic or Playfair Display Italic
- **Weights:** 400, 500
- **Sizes:** 16px, 24px
- **Line height:** 1.00, 1.40, 1.50
- **Letter spacing:** normal
- **Role:** Wordmark and editorial accents — the italic 'Anything' logo is the system's signature gesture, replacing the standard bold-sans brand mark with something handwritten and human

### Instrument Sans — Display and heading typeface — 42px weight 600 carries the hero headline, sharing DNA with Instrument Serif so the serif/sans pairing feels intentional rather than mixed · `--font-instrument-sans`
- **Substitute:** Inter Tight or General Sans
- **Weights:** 400, 600
- **Sizes:** 16px, 24px, 42px
- **Line height:** 1.20, 1.40, 1.50
- **Letter spacing:** normal
- **Role:** Display and heading typeface — 42px weight 600 carries the hero headline, sharing DNA with Instrument Serif so the serif/sans pairing feels intentional rather than mixed

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 14px | 1.56 | — | `--text-body` |
| heading-sm | 18px | 1.5 | — | `--text-heading-sm` |
| heading | 24px | 1.4 | — | `--text-heading` |
| heading-lg | 29px | 1.33 | — | `--text-heading-lg` |
| display | 42px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| small | 8px |
| images | 20px |
| inputs | 20px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20-24px
- **Element gap:** 12-16px

## Components

### Floating Glass Nav Bar
**Role:** Primary site navigation

Translucent pill bar floating at the top of the page over full-bleed imagery. White frosted-glass background, 20px radius, 12px vertical padding, horizontally centered with max-width ~960px. Contains the Instrument Serif italic wordmark left, Inter nav links center, and dark Pill CTA right.

### Dark Pill CTA
**Role:** Primary action button

Filled black/charcoal button (#000000 or #18191b), 9999px radius, 10-12px vertical padding, 16-20px horizontal padding. White text at Inter 14px weight 500. The only chromatic-action element in the system — no colored CTA exists.

### Hero Search Input
**Role:** Conversational prompt entry — the hero CTA

Wide white input field, 20px radius, 16-20px padding, Inter 16px placeholder text in #6a6a6c. Right-aligned circular submit button with an up-arrow icon. Spans ~640-720px, sits centered below the hero headline as the only call to action on the page.

### Soft Card
**Role:** Content container for features, examples, or grouped information

20px radius, #f9f9f9 background, 1px #c4c4c4 border, 20-24px padding. Carries the soft shadow rgba(0,0,0,0.1) 0px 10px 15px -3px, rgba(0,0,0,0.1) 0px 4px 6px -4px when elevated. Never uses bold borders or hard edges.

### Rounded Image
**Role:** Photographic or illustrative content

20px standard radius, occasionally 31px for feature imagery. Images sit on #f9f9f9 surfaces or directly on the canvas. No decorative frames or shadows around standalone images — the radius alone does the work.

### Serif Italic Wordmark
**Role:** Brand identifier

Instrument Serif italic at 24px (nav) and scaled up for the hero. This is the system's most distinctive choice — the italic serif logo against Inter UI reads as personal and editorial, not corporate. Never replaced with a sans-serif variant.

### Ghost Nav Link
**Role:** Secondary navigation item

Inter 14px weight 400, no background, no border. White or #6a6a6c text depending on surface. Hover state shifts to #18191b or adds a subtle underline.

### Shimmer Gradient Divider
**Role:** Decorative separator and animated highlight

A 1-2px line using the shimmer gradient: silver at 0-30%, brief fern green at 35%, periwinkle at 40%, silver again at 45-100%. Reads as a flash of color traveling through gray — used for dividers, progress indicators, and decorative text fills.

### Pebble Disabled Button
**Role:** Inactive or unavailable action

#dbdbdb background, 9999px radius, 10px vertical padding. Inter 14px weight 500 in #acadae. Maintains the pill geometry of the active CTA but loses all color and contrast.

### Mint Wash Block
**Role:** Decorative background section

Full-bleed or contained block of #dbeddf pale green. Used sparingly as a tonal break between white sections — the only place where color fills a surface rather than a line of text.

## Do's and Don'ts

### Do
- Use 20px radius for all cards, images, and inputs — 20px is the system's structural signature, not a default
- Use 9999px radius exclusively for buttons — pills all the way, never rounded rectangles on actions
- Set the wordmark in Instrument Serif italic — never substitute a bold sans-serif logo
- Keep the CTA dark (#000000/#18191b) on white — no colored filled buttons; the system has no chromatic CTA
- Apply 0.02em letter-spacing on all Inter text at 14px and below for the system's quiet tracking
- Use the shimmer gradient only for decorative dividers and text fills — never as a background or large surface
- Reach for #448f52 only in body text or gradient flash points — one chromatic word per paragraph at most

### Don't
- Don't add colored CTA buttons — the system has no green or blue filled action; dark pill is the only CTA
- Don't use hard 0px or 4px corners on cards or images — the system reads as floating and soft; sharp edges break the mood
- Don't stack heavy borders or thick dividers — 1px #c4c4c4 or #bbbbbb is the maximum structural weight
- Don't introduce new accent hues — the palette is monochrome plus one green; adding blue, purple, or warm tones dilutes the system
- Don't use display weights above 600 — the system whispers through its typography, never shouts
- Don't replace Instrument Serif with a generic italic — the wordmark is the brand's most recognizable element
- Don't apply strong shadows — the only shadow pattern is a soft 10/15/-3 + 4/6/-4 at 0.1 opacity; deeper shadows look foreign

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Base layer — the default background for all pages |
| 2 | Soft Card | `#f9f9f9` | Card and container surfaces — the first step off white for gentle separation |
| 3 | Elevated Surface | `#f2f2f2` | Deeper fill for buttons, hover states, and input borders |
| 4 | Mint Wash | `#dbeddf` | Pale green decorative surface — a rare chromatic break in the monochrome sequence |
| 5 | Pebble | `#dbdbdb` | Disabled button background — the lightest non-paper gray |

## Elevation

- **Soft Card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`

## Imagery

Full-bleed atmospheric photography anchors the brand: dreamy skies, clouds, wildflower fields, and surreal still-life vignettes like a retro CRT sitting in flowers. Photography is high-key, soft-focus, and slightly overexposed — the objects float in light rather than sit on surfaces. No product screenshots, no lifestyle people, no UI mockups. All visuals feel half-remembered, like a summer afternoon you can't quite place. Icons are absent or extremely minimal; the imagery carries mood that text alone cannot.

## Layout

Single full-bleed hero with a floating pill nav bar centered at the top, centered serif italic logo at viewport center, subhead and hero search input stacked beneath. The page is one continuous atmospheric experience — no section bands, no card grids, no sidebar. Content flows vertically with generous 64px+ section gaps. The nav bar overlaps the hero photograph with a frosted-glass effect rather than sitting on a solid surface. Navigation is minimal: logo + 4 links + one dark CTA pill.

## Agent Prompt Guide

## Quick Color Reference
- text: #18191b (primary), #6a6a6c (body), #acadae (muted)
- background: #ffffff (canvas), #f9f9f9 (card surface)
- border: #c4c4c4 (card), #bbbbbb (hairline), #f2f2f2 (input)
- accent: #448f52 (text only)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Section**: Full-bleed atmospheric photograph background (sky + flowers). Centered 'Anything' in Instrument Serif italic at 42px, #18191b. Subtext in Inter 16px weight 400, #6a6a6c. Hero search input below: white, 20px radius, 16px padding, 640px wide, Inter 16px placeholder, right-aligned circular submit button with up-arrow.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Feature Card**: 20px radius, #f9f9f9 background, 1px #c4c4c4 border, 24px padding. Soft shadow rgba(0,0,0,0.1) 0px 10px 15px -3px. Heading in Instrument Sans 24px weight 600, #18191b. Body in Inter 14px weight 400, #6a6a6c. Optional 20px-radius image at top.

4. **Shimmer Divider**: 1px tall horizontal line, 200px wide, using the shimmer gradient — silver base with fern green flash at 35% and periwinkle at 40%. Centered, used as decorative section separator.

5. **Ghost Nav Link**: Inter 14px weight 400, #6a6a6c text, no background, no border. Hover shifts to #18191b. Used inside the floating glass nav bar.

## Design Philosophy

Anything treats the interface as something you float through, not something you operate. The 20px radius is the system's gravitational constant — every surface, image, and input bends at the same angle, which makes the whole product feel like a single material. The dark pill CTA against a white canvas creates the only point of true contrast; everything else is whisper-soft. Color is rationed like punctuation in a quiet sentence — one green word, one shimmer flash, then back to monochrome. The Instrument Serif italic wordmark is the most important decision in the system: it tells the user this is a personal, generative tool, not enterprise software.

## Similar Brands

- **Cursor** — Same light monochrome interface with minimal color rationing, generous 20px+ border radii, and a single dark pill CTA approach
- **Linear** — Similar restrained grayscale palette, pill-shaped nav, and a single dark action button — though Linear is denser and more information-architectural
- **Framer** — Shares the dreamy atmospheric hero photography and floating glass UI elements — both use full-bleed imagery with frosted overlays
- **Vercel** — Same whisper-soft shadows, monochrome-first palette, and minimal color punctuation — though Vercel leans more geometric and less rounded
- **Replit** — Shares the rounded-everything approach and pill-shaped controls, though Replit uses a wider chromatic range while Anything stays near-monochrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-charcoal: #18191b;
  --color-slate-mid: #6a6a6c;
  --color-steel: #7d7f80;
  --color-ash: #acadae;
  --gradient-ash: linear-gradient(90deg, rgb(172, 173, 174) 0%, rgb(172, 173, 174) 30%, rgb(109, 192, 120) 35%, rgb(153, 183, 250) 40%, rgb(172, 173, 174) 45%, rgb(172, 173, 174) 100%);
  --color-fog: #bbbbbb;
  --color-mist: #c4c4c4;
  --color-pebble: #dbdbdb;
  --color-cloud: #f2f2f2;
  --color-snow: #f9f9f9;
  --color-paper: #ffffff;
  --color-fern: #448f52;
  --color-mint-wash: #dbeddf;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.56;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.5;
  --text-heading: 24px;
  --leading-heading: 1.4;
  --text-heading-lg: 29px;
  --leading-heading-lg: 1.33;
  --text-display: 42px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20-24px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 31px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-small: 8px;
  --radius-images: 20px;
  --radius-inputs: 20px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-soft-card: #f9f9f9;
  --surface-elevated-surface: #f2f2f2;
  --surface-mint-wash: #dbeddf;
  --surface-pebble: #dbdbdb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-charcoal: #18191b;
  --color-slate-mid: #6a6a6c;
  --color-steel: #7d7f80;
  --color-ash: #acadae;
  --color-fog: #bbbbbb;
  --color-mist: #c4c4c4;
  --color-pebble: #dbdbdb;
  --color-cloud: #f2f2f2;
  --color-snow: #f9f9f9;
  --color-paper: #ffffff;
  --color-fern: #448f52;
  --color-mint-wash: #dbeddf;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.56;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.5;
  --text-heading: 24px;
  --leading-heading: 1.4;
  --text-heading-lg: 29px;
  --leading-heading-lg: 1.33;
  --text-display: 42px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 31px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
