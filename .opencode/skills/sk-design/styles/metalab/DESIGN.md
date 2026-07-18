# Metalab — Style Reference
> black editorial spread — a serif headline breathing in void, annotated by a whisper-quiet grotesque

**Theme:** dark

Metalab operates in a black-canvas editorial mode: a design agency that lets typography and negative space do the entire performance. Two custom typefaces share the stage — an ultra-light display serif (PP Eiko) at commanding sizes, and a quiet grotesque (Basis Grotesque Pro) for all functional copy — creating a dialogue between a whispering serif headline and a precise sans-serif annotation layer. The interface is achromatic by conviction: no accent color exists, no decorative gradient, no brand chromatic mark. Information is structured purely through scale contrast, micro-typography, and metadata labels (dates, times, coordinates) that float beside content like editorial marginalia. Components are sparse and oversized — a single dark elevated card, a pill toggle, and very little else. The system reads less like a product UI and more like the masthead of a design publication.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, primary surface, heading text on light zones — the dominant black that absorbs all surrounding elements |
| Bone | `#ffffff` | `--color-bone` | Inverse text on dark surfaces, hairline borders on dark zones, contrast punctuation against the black canvas |
| Charcoal | `#252525` | `--color-charcoal` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |

## Tokens — Typography

### Basis Grotesque Pro — All functional copy: body text, metadata annotations, labels, nav, buttons, lists. The 350 weight (light) handles editorial captioning at 12px — the small annotations like 'EST 2006', 'BC, CA', '12:32 EDT' — while 400 handles body and interactive text at 16px. Slight -0.01em tracking tightens the grotesque into a precise, measured voice. This font does the quiet work; the serif does the talking. · `--font-basis-grotesque-pro`
- **Substitute:** Inter, or Söhne, or any neo-grotesque sans-serif
- **Weights:** 350, 400
- **Sizes:** 12px, 16px
- **Line height:** 1.00–2.00
- **Letter spacing:** -0.0100em
- **Role:** All functional copy: body text, metadata annotations, labels, nav, buttons, lists. The 350 weight (light) handles editorial captioning at 12px — the small annotations like 'EST 2006', 'BC, CA', '12:32 EDT' — while 400 handles body and interactive text at 16px. Slight -0.01em tracking tightens the grotesque into a precise, measured voice. This font does the quiet work; the serif does the talking.

### PP Eiko — Display headings only — the 88px ultra-light serif is the signature element. Weight 240 (near-hairline) is a dramatic anti-convention choice: most agencies use 400-500 serifs for authority; Metalab's whisper-weight communicates confidence through restraint, not volume. Tight 0.80 line-height and -0.02em tracking let letters nearly touch, creating a sculptural block of text. · `--font-pp-eiko`
- **Substitute:** Cormorant Garamond, or any ultra-light modern serif (weight 200-300)
- **Weights:** 240
- **Sizes:** 88px
- **Line height:** 0.80
- **Letter spacing:** -0.02em
- **Role:** Display headings only — the 88px ultra-light serif is the signature element. Weight 240 (near-hairline) is a dramatic anti-convention choice: most agencies use 400-500 serifs for authority; Metalab's whisper-weight communicates confidence through restraint, not volume. Tight 0.80 line-height and -0.02em tracking let letters nearly touch, creating a sculptural block of text.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.12px | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| display | 88px | 0.8 | -1.76px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 50px |
| pills | 1000px |
| buttons | 50px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Dark Elevated Panel
**Role:** Hero or feature surface — the single depth element in the system

A tall rounded rectangle filled with #252525 on the #000000 canvas. Border-radius 50px gives it a soft, tablet-like silhouette. No border, no shadow — depth comes purely from the value difference between #000000 and #252525. Dimensions feel cinematic: roughly 380px wide, 500px+ tall, centered or asymmetric in the layout.

### Pill Toggle
**Role:** Interactive state indicator or count badge

Small pill with border-radius 50px or 1000px, padding 3px top/bottom and 16px left/right. Bone (#ffffff) text on transparent or charcoal background. 12px Basis Grotesque Pro at weight 350. Examples: '0 → 1' counter, 'EST 2006' tag.

### Metadata Annotation
**Role:** Editorial marginalia — dates, locations, timestamps

12px Basis Grotesque Pro weight 350 in #ffffff, positioned with generous offset from the content it annotates. Always uppercase or title-case. Examples: 'EST 2006', 'BC, CA', '12:32 EDT'. Acts as a typographic signature of the brand — the system of small floating labels is what makes the page feel curated.

### Display Headline
**Role:** Primary heading — sets the editorial tone

88px PP Eiko weight 240, line-height 0.80, letter-spacing -0.02em. White (#ffffff) on the black canvas. Typically one or two words per line at this scale, creating a staccato rhythm. No maximum width constraint — the text breathes across the full viewport column.

### Ghost Button
**Role:** Subtle interactive element on dark surfaces

Transparent or #252525 fill with #ffffff text. Border-radius 50px. Padding 16px horizontal, small vertical inset. 16px Basis Grotesque Pro weight 400. No border, no shadow. The button blends into the dark canvas until hovered.

### Nav Link
**Role:** Top-level navigation — minimal, text-only

16px Basis Grotesque Pro weight 400, #ffffff, no underline. Items separated by generous horizontal spacing. The nav itself is a quiet row, not a bar — it doesn't compete with the editorial typography.

### Body Copy
**Role:** Descriptive and supporting text

16px Basis Grotesque Pro weight 400, line-height 1.76-2.00 (generous, editorial). #ffffff on the black canvas. The high line-height values are deliberate — they create airy columns of text that match the spaciousness of the layout.

### List Item
**Role:** Structured content listing

16px Basis Grotesque Pro in #ffffff, separated by 8px row gaps. Minimal bullet treatment or no bullets at all — the spacing alone creates list rhythm.

## Do's and Don'ts

### Do
- Use PP Eiko at 88px weight 240 exclusively for the largest display moments — never at body sizes where the hairline weight becomes illegible
- Set all display headlines to line-height 0.80 and letter-spacing -0.02em to achieve the sculptural, near-touching letterforms
- Use Basis Grotesque Pro weight 350 at 12px for all metadata annotations (dates, locations, timestamps) — this is the system's editorial signature
- Build depth through a single #252525 surface layer over the #000000 canvas — do not introduce additional grays or shadows
- Apply border-radius 50px to all buttons and elevated panels for the soft, tablet-like silhouette that defines the system
- Anchor all dark pages on the #000000 canvas with #ffffff typography — never invert to a white page background within a dark-theme design
- Use line-height 1.76-2.00 for body copy to match the editorial spaciousness of the display type

### Don't
- Do not introduce any chromatic color — no blues, reds, greens, or brand accents. The system is achromatic by conviction
- Do not use PP Eiko at sizes below 40px — the weight 240 becomes too thin to render reliably at small sizes
- Do not add drop shadows to any element — depth in this system comes from surface value contrast (#000000 → #252525), not elevation effects
- Do not use weight 600+ for any text — the entire system operates in the 240-400 range; heavier weights break the whisper-quiet tone
- Do not add gradients, glows, or any color effects — the flat achromatic palette is the brand identity
- Do not use system serif defaults (Times, Georgia) as substitutes for PP Eiko without matching the ultra-light weight — a regular-weight serif will read as conservative, not editorial
- Do not fill buttons with #ffffff on the dark canvas — it would create the only bright shape on the page and dominate the hierarchy. Use #252525 or transparent

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Base page canvas — the entire site lives on black |
| 1 | Charcoal | `#252525` | Elevated panel, the single step of depth above the canvas |
| 2 | Bone | `#ffffff` | Inverse surface for high-contrast zones and typographic inversion |

## Elevation

Depth is achieved through a single value step: #252525 panels sit on the #000000 canvas with no shadow, no border, no blur. The system deliberately avoids box-shadows entirely — a 1.4:1 contrast between #000000 and #252525 is sufficient to distinguish elevation, and adding shadows would introduce warmth and softness that contradicts the flat, editorial aesthetic. There is exactly one tier of depth above the canvas, and it is always the same color.

## Imagery

Imagery is minimal and treated with the same restraint as the type system. A single dark, softly gradient panel appears in the hero — its surface is nearly featureless, suggesting a product or device rendering rather than a photograph. No lifestyle photography, no illustration, no decorative graphics. The visual weight of the page comes entirely from typography and negative space. If images appear on inner pages, they would be high-contrast, tightly cropped, and sit on the same #000000 canvas without frames or borders.

## Layout

The page is full-bleed with no container constraint — text and elements flow edge-to-edge across a wide viewport (1440px+ target). The hero pattern is a three-column asymmetric split: display headline flush-left, a dark elevated panel centered, and a secondary headline word ('Make') flush-right with metadata annotations floating in the margins. Section rhythm uses generous vertical gaps (96px+) with no visible dividers — separation is spatial, not structural. Navigation is a minimal text row at the top, not a bar with background fill. The overall density is low: large amounts of black space, few elements per screen, and each element given room to breathe. The grid is loose — columns are implied by alignment, not by visible lines.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- border: #ffffff
- accent: no accent color (achromatic system)
- primary action: no distinct CTA color
- surface elevation: #252525

**Example Component Prompts**

1. Create a hero section: #000000 background, full-bleed. Left-aligned 88px PP Eiko weight 240 headline in #ffffff, line-height 0.80, letter-spacing -0.02em reading 'We Make Interfaces'. Center column: a #252525 rounded panel, border-radius 50px, roughly 380px wide by 500px tall. Right margin: floating 12px Basis Grotesque Pro weight 350 annotations in #ffffff ('EST 2006', '12:32 EDT').

2. Create a navigation bar: minimal text row on #000000 background. 16px Basis Grotesque Pro weight 400 in #ffffff, items left-aligned with 24px gaps, no background fill, no border.

3. Create a ghost button: transparent background on #000000 canvas, #ffffff text at 16px Basis Grotesque Pro weight 400, border-radius 50px, padding 16px horizontal / 8px vertical. No border, no shadow.

4. Create a metadata label: 12px Basis Grotesque Pro weight 350 in #ffffff, positioned as a small floating annotation in the margin of a content layout. No background, no border — just typographic presence.

5. Create a dark elevated card: #252525 fill on #000000 canvas, border-radius 50px, padding 24px. No shadow, no border. Body text inside in #ffffff at 16px Basis Grotesque Pro weight 400, line-height 1.76.

## Similar Brands

- **Ueno** — Same editorial-agency approach: black canvas, oversized type, minimal UI chrome, metadata-style annotations
- **Locomotive** — Dark-mode agency portfolio with serif/sans-serif type pairing and generous negative space
- **Resn** — Experimental agency aesthetic with achromatic palette and typography-as-hero philosophy
- **Ramotion** — Dark-canvas design studio site with restrained color and type-driven layout
- **Manual** — Editorial agency presentation style: black background, large light-weight serif, micro-typography for metadata

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-charcoal: #252525;

  /* Typography — Font Families */
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-eiko: 'PP Eiko', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.12px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-display: 88px;
  --leading-display: 0.8;
  --tracking-display: -1.76px;

  /* Typography — Weights */
  --font-weight-w240: 240;
  --font-weight-w350: 350;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-full: 50px;
  --radius-full-2: 1000px;

  /* Named Radii */
  --radius-cards: 50px;
  --radius-pills: 1000px;
  --radius-buttons: 50px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-charcoal: #252525;
  --surface-bone: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-charcoal: #252525;

  /* Typography */
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-eiko: 'PP Eiko', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.12px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-display: 88px;
  --leading-display: 0.8;
  --tracking-display: -1.76px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;

  /* Border Radius */
  --radius-full: 50px;
  --radius-full-2: 1000px;
}
```
