# Favorit Studio — Style Reference
> Gallery wall in black and white — a single oversized serif floating on infinite white, anchored by a quiet photograph.

**Theme:** light

Favorit Studio is an editorial gallery in browser form: pure white canvas, near-absolute monochrome ink, and photography that does the emotional work. Two custom typefaces carry the entire visual language — a sharp serif (Favorit Times) reserved for monumental display, and a quiet grotesk (TWKLausanne) for everything utilitarian. Spacing breathes like a printed magazine spread; no shadows, no borders, no color, no gradients. Every element either sets type or shows an image, nothing else is allowed to exist.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | All text, thin dividers, image overlays, wordmark fill, and the sole stroke color for outlined controls. Maximum contrast against paper |
| Paper | `#ffffff` | `--color-paper` | Page canvas, all surface backgrounds, inverted text on dark photographic plates, scroll indicator wells |

## Tokens — Typography

### Favorit Times — Display and editorial headlines only. The wordmark 'Favorit' and section titles live here. Set at sizes between 44px and 179px, always weight 400, always with negative tracking that tightens proportionally with size. A single weight at display size is the signature: no bold, no italic — authority comes from scale and the serif's contrast, not from weight. · `--font-favorit-times`
- **Substitute:** Playfair Display, GT Sectra, or Canela
- **Weights:** 400
- **Sizes:** 44px, 55px, 179px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.025em at all display sizes
- **Role:** Display and editorial headlines only. The wordmark 'Favorit' and section titles live here. Set at sizes between 44px and 179px, always weight 400, always with negative tracking that tightens proportionally with size. A single weight at display size is the signature: no bold, no italic — authority comes from scale and the serif's contrast, not from weight.

### TWKLausanne — Utility and body voice — navigation labels, scroll indicators, list items, body copy, and the rare button. Also handles oversized sans display work in the 135–189px range where the serif would feel wrong. Tracking loosens as size shrinks: -0.025em at display, -0.017em at mid, -0.010em at body. A single weight across the entire scale keeps the sans disciplined and the serif dramatic by contrast. · `--font-twklausanne`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 14px, 23px, 135px, 159px, 189px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.025em at 135–189px, -0.017em at 23px, -0.010em at 14px
- **Role:** Utility and body voice — navigation labels, scroll indicators, list items, body copy, and the rare button. Also handles oversized sans display work in the 135–189px range where the serif would feel wrong. Tracking loosens as size shrinks: -0.025em at display, -0.017em at mid, -0.010em at body. A single weight across the entire scale keeps the sans disciplined and the serif dramatic by contrast.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | -0.14px | `--text-caption` |
| body | 23px | 1.2 | -0.39px | `--text-body` |
| heading-sm | 44px | 1.2 | -1.1px | `--text-heading-sm` |
| heading | 55px | 1.2 | -1.375px | `--text-heading` |
| display | 179px | 1 | -4.475px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 9 | 9px | `--spacing-9` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 21 | 21px | `--spacing-21` |
| 46 | 46px | `--spacing-46` |
| 47 | 47px | `--spacing-47` |
| 54 | 54px | `--spacing-54` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 46px
- **Card padding:** 16px
- **Element gap:** 21px

## Components

### Wordmark Display
**Role:** Primary brand identifier

The word 'Favorit' or 'Studio' rendered at 179px in Favorit Times, weight 400, letter-spacing -0.025em, line-height 1.0. Ink black on Paper white. Anchors the top-left of every page. No logo mark, no icon — the word IS the mark.

### Minimal Nav Link
**Role:** Navigation text anchor

TWKLausanne 14px, weight 400, letter-spacing -0.14px, Ink color. Vertically oriented (rotated 90°) for the right-edge 'Scroll' indicator and the 'M' section marker. No underlines, no buttons — just letters. 21px padding around the clickable area.

### Full-Bleed Photograph
**Role:** Primary content surface

Edge-to-edge image occupying the full viewport width. No border, no radius, no shadow. Aspect ratio varies per image (the studio portraits sit roughly 4:3 landscape). Subject always centered, always against a warm neutral seamless backdrop. This IS the layout — the photograph replaces cards, sections, and grids.

### Editorial Image Stack
**Role:** Scrollable content sequence

A vertical rhythm of full-bleed photographs separated by approximately 46px of white space. No captions, no labels, no overlays. The sequencing of images creates the narrative; typography appears only at section breaks.

### Sans Display Heading
**Role:** Secondary large-type moment

TWKLausanne at 135–189px, weight 400, letter-spacing -0.025em, line-height 1.0. Used where the editorial serif would compete with a photographic subject. Same scale as the serif display but in the utilitarian voice — a quieter kind of loud.

### Scroll Indicator
**Role:** Affordance for vertical exploration

The word 'Scroll' set vertically (rotated -90°) in TWKLausanne 14px, weight 400, Ink. Pinned to the right edge with 21px offset from the viewport edge. No arrow, no animation described — the word itself is the cue.

### Ghost Border Control
**Role:** Rarefied interactive element

Outlined button using a 1px Ink border, transparent fill, Ink text in TWKLausanne 14px. 16px padding on all sides, 0px radius. No fill state, no hover color shift — the border simply exists or doesn't. Used only for essential actions; the site avoids interactive elements almost entirely.

### List Item
**Role:** Sequential content (case studies, links)

TWKLausanne 14px, weight 400, Ink. 21px horizontal padding, 46px vertical padding, 54px right margin between items. No bullets, no dividers — spacing alone separates entries.

## Do's and Don'ts

### Do
- Set display headlines in Favorit Times at 179px with -0.025em tracking — the size and the negative tracking are inseparable from the brand.
- Use TWKLausanne weight 400 exclusively across every size from 14px to 189px; never introduce a bold or medium weight.
- Let photographs bleed to the viewport edge with 0px radius and no border — the image IS the layout.
- Separate content blocks with exactly 46px of white space; let the page breathe like a printed spread.
- Reserve all color for photography; the UI itself must remain pure #000000 on #ffffff.
- Use the serif (Favorit Times) for moments of editorial drama and the sans (TWKLausanne) for everything utilitarian — never mix them in the same line.
- When a control is necessary, use the 1px Ink ghost border at 16px padding with 0px radius — no fills, no shadows.

### Don't
- Never add color, gradients, or shadows to UI elements — the monochrome ink-on-paper discipline is the brand.
- Never round corners on images, cards, or buttons — 0px radius is the only radius.
- Never use a bold or semibold weight; the entire system speaks in weight 400, differentiating through size and family alone.
- Never set body or navigation text in the serif face — TWKLausanne is the only utilitarian voice.
- Never add visible borders, dividers, or cards around photographic content — the white space between images is the only separator.
- Never use iconography, illustrations, or decorative graphics — the site uses type and photography exclusively.
- Never place text directly on photographs without a solid color treatment; text always lives on the white canvas.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | The entire page canvas. There is no surface above it — no cards, no panels, no elevated layers. All text and all photographs sit directly on Paper. |

## Elevation

The design is intentionally flat — zero shadows, zero borders, zero elevation effects. Depth is created through scale contrast (type and image), generous white space, and the editorial sequencing of full-bleed photographs. Any shadow would break the print-on-paper illusion the entire system depends on.

## Imagery

Full-bleed studio photography is the only visual content beyond typography. Subjects (people, objects) are always centered against a warm neutral seamless backdrop in desaturated earth tones — taupe, putty, warm gray. The treatment is editorial fashion photography: controlled studio lighting, sharp focus, deliberate negative space around the subject. Images are large, edge-to-edge, and uncropped — no rounded corners, no masks, no overlays. The colorfulness score of 0% applies strictly to the UI; the photography carries all the warmth and tonal variation the interface refuses to show.

## Layout

Full-bleed single-column scroll with no max-width constraint. The page is essentially a vertical exhibition: the wordmark anchors the top-left, navigation lives in the top-right as minimal vertical text, and the body is a sequence of oversized photographs stacked vertically with ~46px of white breathing room between them. No grid system is visible — each photograph claims the full viewport width at varying aspect ratios. Section titles in the serif face appear as full-width text blocks that interrupt the image sequence. The overall rhythm is gallery-walk: walk forward, see one piece, pause, see the next.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px hairline only)
- primary action: no distinct CTA color

**Example Component Prompts:**

1. **Display Wordmark:** Render the word 'Studio' in Favorit Times, 179px, weight 400, color #000000, letter-spacing -4.475px, line-height 1.0, on a #ffffff canvas. Left-aligned, 21px from the viewport edge.

2. **Full-Bleed Portrait Section:** A single photograph filling 100% viewport width, approximately 4:3 aspect ratio, 0px border-radius, no border, no shadow. Subject centered, neutral warm-gray seamless backdrop. 46px of white space above and below.

3. **Scroll Indicator:** The word 'Scroll' in TWKLausanne 14px, weight 400, color #000000, letter-spacing -0.14px, rotated -90 degrees, positioned 21px from the right viewport edge, vertically centered.

4. **Ghost Border Control:** A rectangular button with 1px solid #000000 border, transparent fill, no shadow, 0px radius. Interior text in TWKLausanne 14px, weight 400, #000000. Padding 16px on all sides.

5. **Editorial Image Stack:** Three full-bleed photographs stacked vertically with 46px white-space gaps between them. No captions, no labels. The rhythm of the stack IS the content.

## Similar Brands

- **Pentagram** — Same editorial-magazine approach: oversized serif type on white, photography as primary content, no decorative chrome
- **Manual (manual.to)** — Radical monochrome with two-typeface system (serif display + sans utility), generous white space, studio photography
- **DIA Studio** — Gallery-like single-column scroll with monumental serif headlines interrupting full-bleed image sequences
- **Locomotive (locomotive.ca)** — Agency portfolio aesthetic: pure white canvas, quiet navigation, oversized custom type, image-dominant layout

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-favorit-times: 'Favorit Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twklausanne: 'TWKLausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.14px;
  --text-body: 23px;
  --leading-body: 1.2;
  --tracking-body: -0.39px;
  --text-heading-sm: 44px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.1px;
  --text-heading: 55px;
  --leading-heading: 1.2;
  --tracking-heading: -1.375px;
  --text-display: 179px;
  --leading-display: 1;
  --tracking-display: -4.475px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-21: 21px;
  --spacing-46: 46px;
  --spacing-47: 47px;
  --spacing-54: 54px;

  /* Layout */
  --section-gap: 46px;
  --card-padding: 16px;
  --element-gap: 21px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography */
  --font-favorit-times: 'Favorit Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twklausanne: 'TWKLausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.14px;
  --text-body: 23px;
  --leading-body: 1.2;
  --tracking-body: -0.39px;
  --text-heading-sm: 44px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.1px;
  --text-heading: 55px;
  --leading-heading: 1.2;
  --tracking-heading: -1.375px;
  --text-display: 179px;
  --leading-display: 1;
  --tracking-display: -4.475px;

  /* Spacing */
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-21: 21px;
  --spacing-46: 46px;
  --spacing-47: 47px;
  --spacing-54: 54px;
}
```
