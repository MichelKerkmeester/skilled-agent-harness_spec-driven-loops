# Counterprint — Style Reference
> white gallery wall, books as art

**Theme:** light

Counterprint is a quiet white canvas designed to let bold printed matter do the talking — a publisher's storefront that behaves like a gallery wall rather than a shop. The interface is deliberately monochrome: a pure white stage, hairline gray dividers, and near-black type, with the entire color vocabulary supplied by the photographed books themselves. Every screen follows a strict rhythm: section title on the left, minimal 'View all' pill on the right, then a uniform six-column product grid where the only variation is the cover art. The product images are square, unbordered, and presented without chrome — no card containers, no shadows, no hover decoration — so the editorial photography carries 100% of the visual weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Canvas | `#ffffff` | `--color-pure-canvas` | Page and surface background — the entire interface lives on this single white plane |
| Ink Black | `#1c1c1c` | `--color-ink-black` | Primary text, product titles, icon strokes, outlined button borders — the only chromatic dark in the system |
| Graphite | `#232323` | `--color-graphite` | Secondary text, meta labels, footer copy — a near-identical companion to Ink Black for subtle hierarchy steps |
| Slate Mute | `#5f6368` | `--color-slate-mute` | Muted helper text, tertiary metadata, disabled states |
| Hairline Gray | `#e5e7eb` | `--color-hairline-gray` | Hairline dividers, card separators, input borders, table rules — the sole structural line color, used at 1px |
| Pure Black | `#000000` | `--color-pure-black` | Maximum-contrast text and icon fills where the deepest dark is needed |

## Tokens — Typography

### Helvetica — Sole typeface for every UI text element — navigation, section headings, product titles, prices, buttons, and body copy. Weight 700 for section headers and product names creates the only typographic distinction in the system; weight 400 handles everything else. The 15px body / 20px header pairing is unusually small, reinforcing a catalog-card density rather than a marketing-page density. · `--font-helvetica`
- **Substitute:** Inter, Neue Haas Grotesk, Arial
- **Weights:** 400, 700
- **Sizes:** 15px, 20px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.025em (applied at body size, ~-0.375px)
- **Role:** Sole typeface for every UI text element — navigation, section headings, product titles, prices, buttons, and body copy. Weight 700 for section headers and product names creates the only typographic distinction in the system; weight 400 handles everything else. The 15px body / 20px header pairing is unusually small, reinforcing a catalog-card density rather than a marketing-page density.

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.3px | `--text-caption` |
| heading | 20px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 11 | 11px | `--spacing-11` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 23 | 23px | `--spacing-23` |
| 28 | 28px | `--spacing-28` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| inputs | 15px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48px
- **Card padding:** 0px
- **Element gap:** 8px

## Components

### Ghost Pill Button
**Role:** Secondary action — 'View all', 'Load more', navigation actions

Pill-shaped (border-radius 9999px), 1px solid #1c1c1c border, white fill, #1c1c1c text. Helvetica 13–15px weight 400. Padding 8px 16px. No hover fill change visible — the button stays outlined. This is the only interactive component in the system.

### Product Card
**Role:** Catalog item — one book per card in the product grid

Zero-padding card with no border, no background, and no shadow. Square product image at the top (1:1 aspect, flush edges, no border-radius). Below the image: product title in Helvetica 15px weight 700, #1c1c1c, then price in Helvetica 15px weight 400, #1c1c1c on a new line. Gap between image and text: ~8px. Gap between cards: 24–32px horizontal, 32–40px vertical. No hover state, no quick-add button.

### Section Header Row
**Role:** Introduces each catalog group ('All Books', 'Counterprint Books')

Flex row spanning full content width. Left-aligned section title in Helvetica 20px weight 700, #1c1c1c. Right-aligned Ghost Pill Button ('View all'). Vertical margin below: 24–28px before the product grid begins.

### Hero Image Split
**Role:** Full-width editorial banner on the homepage

Two equal-width panels side by side, no gap between them, no rounded corners, no borders. Each panel is a tall editorial photograph (roughly 2:3 or 3:4 portrait). Optional small caption in Helvetica 12–13px below each image. This is the only area where imagery occupies full-bleed.

### Top Navigation Bar
**Role:** Site-wide header

White background, no border. Left: brand logo (dot pattern mark). Right: three icon-only controls — hamburger menu, search, cart bag — rendered in #1c1c1c at ~20px. Icons are 1.5px stroke, outlined style. No visible nav text links in the collapsed state.

### Search Input
**Role:** Site search trigger overlay (expected in expanded nav)

Full-width text input, 1px solid #e5e7eb border, border-radius 15px. White fill. Helvetica 15px placeholder in #5f6368. No focus ring color change detected beyond default browser behavior.

### Product Price Label
**Role:** Price display under each product card

Helvetica 15px weight 400, #1c1c1c. Format: '£XX.XX GBP'. No sale/strike-through variant, no currency switcher, no tax note.

### Image Caption
**Role:** Small label under hero images

Helvetica 12–13px weight 400, #1c1c1c. Sits tight against the bottom edge of the hero image with ~4px gap. No italic, no decorative treatment.

## Do's and Don'ts

### Do
- Keep every UI surface pure white (#ffffff) — never introduce a card background, gray panel, or tinted surface
- Set all borders to 1px solid #e5e7eb — this is the only line color and the sole structural separator
- Use Helvetica weight 700 at 20px for section headers and 15px for product titles; weight 400 for everything else
- Render every button as a 9999px-radius ghost pill with a 1px #1c1c1c border and #1c1c1c text on white
- Maintain a 6-column product grid with 1:1 square product images and zero border-radius on the images
- Let product photography supply all color and visual energy — do not add decorative illustrations, gradients, or background art to the UI
- Use 4px and 8px as the only spacing values for internal gaps; reserve 24–48px for section separation

### Don't
- Do not introduce a brand accent color, CTA fill color, or any chromatic UI element — the palette is intentionally monochrome
- Do not add shadows, blur effects, or elevation to cards, buttons, or images
- Do not use border-radius on product images or product cards — sharp 0px edges only
- Do not combine Helvetica with a second typeface for body or heading copy — Helvetica is the sole UI font
- Do not add hover color changes, scale transforms, or animation to product cards — they stay static
- Do not use a wider type size than 20px for any section header — the system is calibrated for compact catalog density, not marketing-page heroics
- Do not wrap product images in containers with padding or background — the image must sit directly on the white canvas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | The single global background — no nested surface layers, no card containers, no elevated panels |

## Elevation

No shadows or elevation effects are used. Depth and separation are achieved exclusively through whitespace and hairline 1px #e5e7eb dividers. The product images sit directly on the white canvas with zero offset, reinforcing the gallery-wall metaphor.

## Imagery

Imagery is the design system. Every product is a printed design book photographed on a solid-color or textured surface, shot straight-on with no lifestyle context. Covers are bold, typographically driven, and saturated — reds, yellows, blues, greens, black — functioning as the sole color source in an otherwise achromatic UI. Hero images are editorial still-lifes (a hand holding a book, stacked books on a red surface) shot at large format and presented full-bleed with no border or rounded corners. There are no illustrations, icons (beyond tiny UI nav icons), abstract graphics, or 3D renders — the photography does all visual work. Image treatment: sharp, unedited edges, no duotone or color grading, no overlay text on the imagery itself.

## Layout

Full-bleed layout with a max content width of ~1440px centered on the white canvas. The homepage opens with a two-column full-bleed hero image split (equal width, no gap, no border), followed by stacked catalog sections. Each catalog section follows an identical pattern: a single-row section header (title left, 'View all' ghost pill right) sitting on a 24–28px bottom margin, then a six-column product grid with consistent gutters. The product grid repeats down the page in uniform bands — 'All Books', then 'Counterprint Books' — each visually identical in structure, with only the book covers changing. There are no alternating background bands, no dark sections, no feature rows with text-plus-image splits, and no testimonials or social-proof blocks. Navigation is a minimal top bar: brand mark left, three icon controls right (hamburger, search, cart). The overall rhythm is gallery-like — consistent vertical cadence, generous breathing room between sections, and no competing layout patterns competing for attention with the product photography.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffffff
- text: #1c1c1c
- muted text: #5f6368
- border: #e5e7eb
- accent: none — system is fully monochrome
- primary action: no distinct CTA color

**3 Example Component Prompts**

1. **Catalog Section Header**: Full-width row on #ffffff. Left side: section title in Helvetica 20px weight 700, color #1c1c1c. Right side: Ghost Pill Button — 1px solid #1c1c1c border, border-radius 9999px, padding 8px 16px, text 'View all' in Helvetica 13px weight 400, color #1c1c1c, white background. Gap below: 24px.

2. **Product Card**: No card container, no border, no shadow, no background. Top: 1:1 square product image with 0px border-radius, flush on white. Gap 8px. Below: product title in Helvetica 15px weight 700, #1c1c1c, single line truncated. On next line: price in Helvetica 15px weight 400, #1c1c1c, format '£XX.XX GBP'.

3. **Hero Image Split**: Two equal-width panels side by side, no gap, no border, 0px border-radius. Each panel contains a full-bleed portrait photograph (approximately 2:3 ratio). Below each image, a caption in Helvetica 12px weight 400, #1c1c1c, with 4px gap from the image bottom.

## Similar Brands

- **AnOther Magazine Shop** — Same editorial-gallery approach — white canvas, product photography as the only color, minimal ghost-pill navigation
- **Bookshop.org** — Six-column product grid on white, Helvetica-adjacent type, zero decorative chrome around book covers
- **Mubi Store** — Culturally-curated catalog with a quiet monochrome UI that lets curated product art carry the visual identity
- **Areaware** — Design-object retailer using a flat white layout where the product photography alone provides all color and texture
- **Dashwood Books** — Independent design/photography book publisher with the same editorial wall-of-covers presentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-ink-black: #1c1c1c;
  --color-graphite: #232323;
  --color-slate-mute: #5f6368;
  --color-hairline-gray: #e5e7eb;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.3px;
  --text-heading: 20px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-23: 23px;
  --spacing-28: 28px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48px;
  --card-padding: 0px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 15px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-ink-black: #1c1c1c;
  --color-graphite: #232323;
  --color-slate-mute: #5f6368;
  --color-hairline-gray: #e5e7eb;
  --color-pure-black: #000000;

  /* Typography */
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.3px;
  --text-heading: 20px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-23: 23px;
  --spacing-28: 28px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-full: 9999px;
}
```
