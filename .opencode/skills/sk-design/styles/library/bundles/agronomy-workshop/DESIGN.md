# Agronomy Workshop — Style Reference
> newsprint zine taped to a workshop wall

**Theme:** light

Agronomy Workshop reads as a print-meets-product catalog: a warm, slightly yellowed white canvas, oversized editorial photography, and copy typeset in a quirky serif that feels stamped rather than set. The layout is asymmetric and dense — product metadata (name, price, description, color swatches) is crammed into a narrow column beside full-bleed lookbook imagery, more like flipping through a zine than browsing a store. A single saturated blue and a mustard-yellow promotional wash are the only chromatic notes; everything else is black, white, and warm gray, which makes the color swatches and blue 'Shop' buttons feel switched on. The compressed display headings, typewriter serif body, and tracked uppercase mono labels give the system a deliberate analog/maker voice — utilitarian, unfussy, slightly rough around the edges.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Workshop Blue | `#0076ff` | `--color-workshop-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Hail Yellow | `#f4eb59` | `--color-hail-yellow` | Promotional banners, first-order discount strip — a single warm yellow used sparingly to draw the eye without competing with photography |
| Pale Sky | `#c3d7ee` | `--color-pale-sky` | Soft blue surface for secondary panels or callout backgrounds — a desaturated companion to Workshop Blue |
| Canvas | `#ffffff` | `--color-canvas` | Page background, base surface |
| Bone | `#eeede8` | `--color-bone` | Warm off-white for product detail panels, card surfaces, and secondary backgrounds — slight yellow tint gives the whole site its paper-like cast |
| Ink | `#000000` | `--color-ink` | Primary text, hairline borders, icon strokes — used aggressively for borders (1000+ instances) to create the dense grid of dividers |
| Press Black | `#1e1e1e` | `--color-press-black` | Body and heading text, form borders — slightly softer than pure black, the main reading text color |
| Smudge | `#888888` | `--color-smudge` | Muted body text, secondary descriptions |
| Ash | `#666666` | `--color-ash` | Helper text, tertiary metadata, muted labels |

## Tokens — Typography

### Gerstner Programm FSL Regular — Gerstner Programm FSL Regular — detected in extracted data but not described by AI · `--font-gerstner-programm-fsl-regular`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.14
- **Letter spacing:** -0.02
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Gerstner Programm FSL Regular — detected in extracted data but not described by AI

### OT Neue Montreal Medium Semi Squeezed — Display headings — the semi-squeezed (condensed) proportions and 0.81 line-height let large headings stack tightly, giving editorial zine-like rhythm. Weight 500 (not 700) keeps headlines assertive but not heavy. Sub: Oswald, Bebas Neue, or Barlow Condensed Medium. · `--font-ot-neue-montreal-medium-semi-squeezed`
- **Substitute:** Oswald, Barlow Condensed
- **Weights:** 500
- **Sizes:** 32px, 54px
- **Line height:** 0.81, 1.00
- **Letter spacing:** -0.02em
- **Role:** Display headings — the semi-squeezed (condensed) proportions and 0.81 line-height let large headings stack tightly, giving editorial zine-like rhythm. Weight 500 (not 700) keeps headlines assertive but not heavy. Sub: Oswald, Bebas Neue, or Barlow Condensed Medium.

### Gerstner Programm FSL — Body copy, product descriptions — a typewriter-era serif with quirky ligatures and alternate glyphs (blwf, cv03-11) that gives the text a stamped/maker quality. Tight tracking (-0.02em) and 1.14 line-height produce dense, print-like paragraphs. Sub: IBM Plex Serif, Source Serif Pro, or JetBrains Mono. · `--font-gerstner-programm-fsl`
- **Substitute:** IBM Plex Serif
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.14
- **Letter spacing:** -0.02em
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Body copy, product descriptions — a typewriter-era serif with quirky ligatures and alternate glyphs (blwf, cv03-11) that gives the text a stamped/maker quality. Tight tracking (-0.02em) and 1.14 line-height produce dense, print-like paragraphs. Sub: IBM Plex Serif, Source Serif Pro, or JetBrains Mono.

### ABC Marfa Mono — Tiny uppercase labels, price tags, status badges — tracked wide (+0.1em) at micro size to read as editorial captions or rubber-stamp marks. Sub: Space Mono, IBM Plex Mono. · `--font-abc-marfa-mono`
- **Substitute:** Space Mono
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.20
- **Letter spacing:** 0.1em
- **Role:** Tiny uppercase labels, price tags, status badges — tracked wide (+0.1em) at micro size to read as editorial captions or rubber-stamp marks. Sub: Space Mono, IBM Plex Mono.

### system sans-serif — Fallback UI text, nav labels, utility micro-copy. Sub: -apple-system, Inter, or any system UI font. · `--font-system-sans-serif`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Fallback UI text, nav labels, utility micro-copy. Sub: -apple-system, Inter, or any system UI font.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 1px | `--text-caption` |
| body | 14px | 1.14 | -0.28px | `--text-body` |
| heading-sm | 32px | 0.81 | -0.64px | `--text-heading-sm` |
| display | 54px | 1 | -1.08px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 5px |
| cards | 0px |
| banners | 0px |
| buttons | 5px |

### Layout

- **Section gap:** 40px
- **Card padding:** 16-20px
- **Element gap:** 4-12px

## Components

### Shop CTA Button
**Role:** Primary blue action button for product purchase

Workshop Blue (#0076ff) background, white text, 5px radius, 20px horizontal padding, 6-10px vertical padding. Text is the Gerstner Programm serif at 14px or system sans at 12px, uppercase, tracked. Spans full column width in the product detail sidebar.

### Price Tag
**Role:** Inline price label with bordered chip

Small rectangular chip with 1px black border, 5px radius, containing a dollar amount (e.g. '$134', '$64'). Text is the compressed display font or mono at 10-12px. Sits inline-right of the product title in the metadata column.

### Color Swatch Dot
**Role:** Product variant selector

Small 14-16px filled circle, no border, no radius, representing an available product color. Arranged in a horizontal row with 4-6px gaps. Colors mirror the actual product palette (brown, navy, black, bone).

### Product Detail Panel
**Role:** Left-column metadata block beside product imagery

Narrow column (roughly 25% of viewport), white or Bone (#eeede8) background, containing thumbnail strip, product title, price tag, description paragraph (Gerstner at 14px), swatches, and a full-width Shop button. Vertically centered or top-aligned next to the hero image.

### Product Thumbnail
**Role:** Small product image in the detail sidebar

Square or slightly portrait crop, no radius, thin 1px black border, separated by 4-8px vertical gaps. Clicking swaps the main hero image.

### Promo Banner Strip
**Role:** Dismissible bottom-of-screen promotional message

Hail Yellow (#f4eb59) full-bleed strip, no radius, black text at 12-14px centered, with a dismiss × on the right. Fixed to bottom of viewport on mobile, inline at page bottom on desktop.

### Top Navigation Bar
**Role:** Minimal site header

White background, single-line layout: 'Index' and 'Shop' text links on the left, a small square logo mark centered, and 'Bag' link on the right. Text is system sans at 12px, black, no dividers. Hairline 1px black border on the bottom edge.

### Lookbook Image Block
**Role:** Full-bleed editorial product photography

Large square or landscape image, no radius, no border, no overlay. Occupies roughly 40-50% of the viewport width in the product detail row, and full column width in the secondary lookbook grid below.

### Lookbook Product Card
**Role:** Product grid item in the secondary listings

Compact card: small square product thumbnail on the left (or top), product title and price tag on the right (or below), short description, color swatches, and a full-width blue Shop button. White or Bone background, no card border, no shadow. 20px internal padding.

### Logo Mark
**Role:** Brand mark in the center of the nav bar

Small square black graphic (appears to be a hand-drawn 'AW' or workshop stamp), roughly 24-32px square, solid black fill. Functions as the visual anchor of the otherwise text-only nav.

### Dismissible Banner Close
**Role:** Close button for the promo strip

Simple × glyph, black, 14px, right-aligned in the yellow strip. 8px padding for tap target.

## Do's and Don'ts

### Do
- Use Workshop Blue (#0076ff) exclusively for action buttons and active link states — never for decorative purposes
- Set body copy in Gerstner Programm at 14px / 1.14 line-height / -0.02em letter-spacing to preserve the stamped editorial feel
- Use the compressed display font (OT Neue Montreal) at 32-54px for product page titles and section headers, with line-height near 0.81 for tight stacking
- Mark all micro-labels (prices, tags, nav) in the tracked mono at 10px / +0.1em letter-spacing, uppercase
- Maintain the warm off-white canvas: page background #ffffff, panels and cards #eeede8
- Use 1px solid black borders extensively for the dense grid of dividers, swatch frames, and thumbnail outlines
- Keep all buttons at 5px radius — the slight rounding keeps the UI modern without losing the utilitarian zine feel

### Don't
- Don't introduce additional accent colors beyond Workshop Blue, Hail Yellow, and Pale Sky — the system is intentionally restrained
- Don't use a standard sans-serif for body text — the Gerstner serif with custom features is the signature voice
- Don't add drop shadows to cards or buttons — the design relies on flat surfaces and hairline borders for structure
- Don't set headings in a wide or normal-proportion font — the semi-squeezed/condensed display face is essential to the identity
- Don't use generous line-height on body copy — 1.14 is deliberately tight to create a print-like paragraph block
- Don't round images with large radii — all photography stays sharp-edged (0px)
- Don't use Hail Yellow for anything other than promotional strips — it's a single-purpose accent

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base background for the entire site |
| 1 | Bone Panel | `#eeede8` | Product detail sidebars, secondary card surfaces, warm off-white accent surface |
| 2 | Pale Sky | `#c3d7ee` | Soft blue highlight or callout panel |
| 3 | Hail Yellow | `#f4eb59` | Promotional banner strip, urgency messaging |

## Elevation

No shadows. The design uses flat surfaces and an aggressive grid of 1px black hairline borders to create structure and separation between elements. Elevation is communicated through color surface shifts (white → bone → yellow) rather than depth.

## Imagery

Editorial lookbook photography dominates — large, full-bleed, unstyled product shots on plain backgrounds (studio white or warm neutral). Products are modeled in natural light with shallow depth of field, often showing fabric texture and garment construction details (collar labels, stitching). Photography is square or landscape, sharp-edged (no radius), and never overlaid with text or filters. The lookbook grid pairs wide lifestyle/model shots with tight product crops, creating a magazine-spread rhythm. No illustrations, no abstract graphics, no iconography beyond the small stamp-style logo mark.

## Layout

Full-bleed page with no max-width container. The product detail layout is a horizontal split: a narrow left column (~20-25% width) holds the metadata stack (thumbnails, title, price, description, swatches, Shop button), while the right ~75% is occupied by a large hero image. Below the fold, a masonry-like grid of lookbook images and product cards alternates between full-width editorial shots and 2-column product listings. The overall rhythm is dense and zine-like, with tight 40px section gaps and very little breathing room — elements sit close together, separated by hairline rules rather than whitespace.

## Agent Prompt Guide

Quick Color Reference:
- text: #1e1e1e (body) / #000000 (headings, borders)
- background: #ffffff (page) / #eeede8 (panels)
- border: #000000 at 1px (hairline)
- accent: #0076ff (Workshop Blue — buttons/links)
- promo: #f4eb59 (Hail Yellow — banners only)
- primary action: no distinct CTA color

Example Component Prompts:

1. Product Detail Row: White background. Left column 25% width contains a vertical stack of 2-3 square product thumbnails (1px black border, 4px gap). Below thumbnails: product title in OT Neue Montreal Medium at 32px, #000000, line-height 0.81. Inline price tag: bordered chip, 1px black border, 5px radius, text in mono at 10px uppercase. Description paragraph in Gerstner Programm at 14px, #1e1e1e, line-height 1.14, letter-spacing -0.02em. Row of color swatch dots (12-14px circles). Full-width Shop button: #0076ff background, white text, 5px radius, 20px vertical padding. Right column 75% width: large square product hero image, no radius, no border.

2. Lookbook Product Card: Bone (#eeede8) background, no border, 20px padding. Small square product thumbnail (80-100px) on the left. Right side: product title in Gerstner Programm at 14px, #1e1e1e. Price chip below title (1px black border, 5px radius, mono at 10px). Short description in Gerstner at 14px, 2-3 lines max. Row of color swatches. Full-width Shop button in #0076ff.

3. Promo Banner: Full-width strip, #f4eb59 background, no radius. Centered text '10% Off First Order' in system sans at 12-14px, #000000. Right-aligned × dismiss button in black, 14px.

4. Top Navigation: White background, 1px solid black bottom border. Left: 'Index' and 'Shop' text links in system sans at 12px, #000000, 20px gap. Center: 24px square black logo mark. Right: 'Bag' text link in same style.

5. Secondary Lookbook Section: Full-width area, 40px top padding. Row of 2 large landscape editorial images (50% width each, 4-8px gap), each paired below with a compact product metadata block (title, price, swatches) in Gerstner and mono.

## Typography Voice

The type system is the brand. Three voices, each with a distinct role: (1) Gerstner Programm — a quirky early-20th-century typewriter serif with custom character variants (blwf, cv03, cv04, cv09, cv11) — handles all reading text and gives the site its analog/maker personality. (2) OT Neue Montreal Medium Semi Squeezed — a condensed grotesque at medium weight with very tight tracking and near-zero line-height — handles all display headings and creates the editorial zine rhythm. (3) ABC Marfa Mono at 10px tracked wide (+0.1em) — handles all micro-labels, price tags, and status indicators, reading as rubber-stamp marks. Never substitute a standard system sans for the serif body — the identity collapses without it.

## Similar Brands

- **Aesop** — Same editorial product detail layout with dense metadata in a narrow column beside large photography, and a restrained near-monochrome palette
- **Mast Brothers** — Same maker/workshop brand voice with large editorial product photography, a warm off-white canvas, and one saturated accent color for action
- **Wax London** — Same minimal e-commerce layout with full-bleed lookbook images, clean metadata blocks, and a single blue CTA color
- **Online Ceramics** — Same zine-like product page with asymmetric metadata+image split, tight grid, and analog/handmade visual voice
- **Lady White Co.** — Same utilitarian garment-shop layout with large unstyled product photography on plain backgrounds and a monochrome-with-one-accent color system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-workshop-blue: #0076ff;
  --color-hail-yellow: #f4eb59;
  --color-pale-sky: #c3d7ee;
  --color-canvas: #ffffff;
  --color-bone: #eeede8;
  --color-ink: #000000;
  --color-press-black: #1e1e1e;
  --color-smudge: #888888;
  --color-ash: #666666;

  /* Typography — Font Families */
  --font-gerstner-programm-fsl-regular: 'Gerstner Programm FSL Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ot-neue-montreal-medium-semi-squeezed: 'OT Neue Montreal Medium Semi Squeezed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gerstner-programm-fsl: 'Gerstner Programm FSL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-marfa-mono: 'ABC Marfa Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 1px;
  --text-body: 14px;
  --leading-body: 1.14;
  --tracking-body: -0.28px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 0.81;
  --tracking-heading-sm: -0.64px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -1.08px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 16-20px;
  --element-gap: 4-12px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 5px;
  --radius-cards: 0px;
  --radius-banners: 0px;
  --radius-buttons: 5px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-bone-panel: #eeede8;
  --surface-pale-sky: #c3d7ee;
  --surface-hail-yellow: #f4eb59;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-workshop-blue: #0076ff;
  --color-hail-yellow: #f4eb59;
  --color-pale-sky: #c3d7ee;
  --color-canvas: #ffffff;
  --color-bone: #eeede8;
  --color-ink: #000000;
  --color-press-black: #1e1e1e;
  --color-smudge: #888888;
  --color-ash: #666666;

  /* Typography */
  --font-gerstner-programm-fsl-regular: 'Gerstner Programm FSL Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ot-neue-montreal-medium-semi-squeezed: 'OT Neue Montreal Medium Semi Squeezed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gerstner-programm-fsl: 'Gerstner Programm FSL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-marfa-mono: 'ABC Marfa Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 1px;
  --text-body: 14px;
  --leading-body: 1.14;
  --tracking-body: -0.28px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 0.81;
  --tracking-heading-sm: -0.64px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -1.08px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-2xl: 20px;
}
```
