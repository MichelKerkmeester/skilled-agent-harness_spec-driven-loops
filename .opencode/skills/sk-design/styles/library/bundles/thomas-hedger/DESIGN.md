# Thomas Hedger — Style Reference
> Silent frame, loud prints

**Theme:** light

Thomas Hedger is a designer's portfolio presented as a museum catalog: a nearly colorless white frame that stages loud, saturated work. The UI speaks in only two voices — flat white canvas and Diatype typography — and the portfolio tiles are the entire color story. The grid is a full-bleed 3-column mosaic with negligible internal padding, so project images abut each other like prints in a flat-file drawer. There are no shadows, no rounded corners, no brand color, no gradients, no semantic states. Navigation is dead-center honest: the designer's name, a single contact word, and three utility icons. Every aesthetic decision recedes so the work can shout.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surface, text on dark tiles |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, card and image borders, grid hairlines, nav accents |
| Carbon Plum | `#29242b` | `--color-carbon-plum` | Heading text — a warm near-black that softens against pure Ink Black for editorial moments |
| Ash | `#e5e5e5` | `--color-ash` | Subtle divider and muted border tone for low-emphasis separations |

## Tokens — Typography

### Diatype — Body and small UI text at 19px; copyright/caption at 9px. Diatype is a contemporary neo-grotesque with humanist proportions — paired with the bold Variable cut, it creates a tight, modern-editorial feel without a serif in sight. The 9px caption is intentionally tiny, like a museum wall label. · `--font-diatype`
- **Substitute:** Inter, Söhne, Helvetica Now
- **Weights:** 400
- **Sizes:** 9px, 19px
- **Line height:** 1.10–1.30
- **Role:** Body and small UI text at 19px; copyright/caption at 9px. Diatype is a contemporary neo-grotesque with humanist proportions — paired with the bold Variable cut, it creates a tight, modern-editorial feel without a serif in sight. The 9px caption is intentionally tiny, like a museum wall label.

### Diatype Variable — Primary navigation and section headings at 26px. The 500 weight is the default nav voice; 700 is reserved for emphasis and the designer's name. The 26px cap-height next to 19px body text creates a deliberate 7px gap that reads as confident hierarchy without loud type. · `--font-diatype-variable`
- **Substitute:** Inter, Söhne, GT America
- **Weights:** 500, 700
- **Sizes:** 26px
- **Line height:** 1.10
- **Role:** Primary navigation and section headings at 26px. The 500 weight is the default nav voice; 700 is reserved for emphasis and the designer's name. The 26px cap-height next to 19px body text creates a deliberate 7px gap that reads as confident hierarchy without loud type.

### Times — Occasional fallback or inherited editorial copy; not a primary voice. Appears at 13px as a quiet secondary tier. · `--font-times`
- **Substitute:** Times New Roman, Source Serif
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Occasional fallback or inherited editorial copy; not a primary voice. Appears at 13px as a quiet secondary tier.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 19px | 1.3 | — | `--text-body` |
| heading | 26px | 1.1 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 19 | 19px | `--spacing-19` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 0px |

### Layout

- **Card padding:** 3px
- **Element gap:** 19px

## Components

### Top Navigation Bar
**Role:** Sticky primary header spanning full viewport width

White background, 3-column flex layout: left-aligned 'THOMAS HEDGER' at 26px Diatype Variable 700, center-aligned 'CONTACT' at 26px Diatype Variable 500, right-aligned cluster of three icons (Behance, Instagram, cart) at 26px. All nav text is uppercase. No border, no shadow, no background fill — sits directly on canvas white.

### Portfolio Grid Tile
**Role:** Single project image cell in the 3-column mosaic

Full-bleed image contained in a rectangle with 3px internal padding and a 1px #000000 border. No border-radius. Images are flush against each other — no inter-tile gap visible at viewport scale. Each tile owns its own aspect ratio; the grid is masonry-like, not uniform.

### 3-Column Mosaic Grid
**Role:** Page-level layout for the portfolio body

Three equal-width columns extending edge-to-edge, no max-width container. Tiles stack vertically within each column. The grid is the page — there is no surrounding wrapper, no margin, no padding outside the tiles.

### Social Icon Link
**Role:** Utility icon in the top-right of the nav

Behance glyph, Instagram glyph, and shopping cart glyph rendered as inline SVG or icon font at 26px in #000000. No background, no border, no hover state styling visible — the link is the icon itself.

### Footer
**Role:** Minimal page-end credit line

Centered single line: '©Thomas Hedger 2026' on the left and 'Thanks for looking ❤' on the right, both at 9px Diatype 400 in #000000. Sits directly on canvas white with no separator above it — the grid simply ends.

### Nav Text Link
**Role:** Uppercase navigation label

26px Diatype Variable 500, #000000, uppercase, no underline, no hover decoration. The link and the text are indistinguishable — type is the interface.

## Do's and Don'ts

### Do
- Use the full 3-column edge-to-edge mosaic for all portfolio work — pageMaxWidth is null, the grid bleeds to the viewport.
- Set every corner radius to 0px — no rounded surfaces anywhere in the UI.
- Use Diatype Variable at 26px 500/700 for all navigation and section headings; reserve 700 for the designer's name and active emphasis.
- Use Diatype 400 at 19px for body and 9px for copyright/footer — the 9px caption is a signature scale choice.
- Keep internal tile padding at 3px and inter-tile gaps at 0–3px for a print-flat-file feel.
- Let project images supply all color — never introduce accent or brand color into chrome elements.
- Pair Carbon Plum (#29242b) with Ink Black (#000000) only when you need editorial warmth in headings; otherwise stay in pure Ink Black.

### Don't
- Do not add shadows, gradients, or border-radius to any component — the design is intentionally flat.
- Do not introduce accent, brand, or semantic colors (no success green, no error red) — the palette is a closed two-tone system.
- Do not use a serif or display font for navigation — Diatype Variable is the only allowed heading voice.
- Do not add hover backgrounds, underlines, or animation to nav links — text alone is the interactive surface.
- Do not wrap the grid in a centered max-width container — the mosaic must reach the viewport edges.
- Do not use type sizes outside the 9/13/19/26 scale — interpolation breaks the editorial rhythm.
- Do not add card surfaces, elevated panels, or modal containers — if it needs a container, the project image should fill it directly.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-bleed page background beneath the entire grid |
| 1 | Tile Surface | `#ffffff` | Flat project-image tiles with no container styling |

## Elevation

Zero elevation. The design refuses shadows, borders-as-decoration, and surface layering. Depth comes from the images themselves, not from UI chrome. This is an editorial print-portfolio philosophy: paper is flat, only ink and image create visual weight.

## Imagery

Imagery is the entire content of the site. The portfolio tiles contain saturated editorial illustrations, product photography, and 3D renders — vibrant pinks, deep blues, neon yellows, and rich greens — each filling its tile edge-to-edge with no padding or background visible. No lifestyle photography, no team shots, no abstract decorative graphics outside the work itself. The contrast between the colorless chrome and the chromatic tiles is the visual signature: the UI is the white mat, the work is the painting.

## Layout

Full-bleed 3-column masonry grid extending to the viewport edges, with no max-width container, no page margin, and no inter-tile gap. A single sticky top navigation bar — left name, center contact, right icons — sits above the grid. There is no sidebar, no secondary nav, no hero section: the grid begins immediately below the nav. The footer is a single centered credit line at the bottom. The page has one vertical rhythm: nav → grid → footer, with no alternating bands or section dividers. The density is compact and museum-like; the layout trusts the work to carry all visual interest.

## Agent Prompt Guide

Quick Color Reference:
- background: #ffffff
- text: #000000
- heading: #29242b
- border: #000000
- muted border: #e5e5e5
- primary action: no distinct CTA color

Example Component Prompts:
1. Build a sticky top navigation: white background, 26px Diatype Variable 500 in #000000. Left: 'THOMAS HEDGER' at weight 700. Center: 'CONTACT' at weight 500. Right: three 26px black SVG icons (Behance, Instagram, cart) flush to the right edge. Zero padding inside the bar, 3px vertical breathing room.
2. Build a 3-column full-bleed mosaic grid: three equal-width columns, no max-width, no inter-column gap. Each cell is a project image at 1px solid #000000 border with 3px internal padding and 0px border-radius. Images can be any aspect ratio — masonry, not uniform grid.
3. Build a footer line: centered single row at 9px Diatype 400 in #000000. Left half: '©Thomas Hedger 2026'. Right half: 'Thanks for looking ❤'. No divider above, no background fill, sits directly on canvas white.
4. Build a project tile: full-bleed image, 1px #000000 border, 3px padding, 0px radius. The image is the content — no title, no caption, no overlay.
5. Build an editorial section heading: 'SELECTED WORK' in Diatype Variable 700 at 26px, #29242b, uppercase, left-aligned, 19px top margin above the heading, 0px below it — the grid starts immediately.

## Similar Brands

- **Pentagram** — Same edge-to-edge image grid, monochrome chrome, type-as-navigation, zero decorative chrome — the partner studios are the only color
- **Studio Dumbar** — Identical full-bleed portfolio mosaic with white canvas, uppercase nav, and no rounded surfaces — work-first composition
- **Aries Moross** — Color-saturated editorial illustration portfolio framed by an almost colorless white grid — the contrast is the brand
- **Kasper-Florio** — Single-row sticky nav, 3-column image mosaic, flat white background, and Diatype/Inter-class neo-grotesque type at the same scale

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-ink-black: #000000;
  --color-carbon-plum: #29242b;
  --color-ash: #e5e5e5;

  /* Typography — Font Families */
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diatype-variable: 'Diatype Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 19px;
  --leading-body: 1.3;
  --text-heading: 26px;
  --leading-heading: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-19: 19px;

  /* Layout */
  --card-padding: 3px;
  --element-gap: 19px;

  /* Named Radii */
  --radius-all: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-tile-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-ink-black: #000000;
  --color-carbon-plum: #29242b;
  --color-ash: #e5e5e5;

  /* Typography */
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diatype-variable: 'Diatype Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 19px;
  --leading-body: 1.3;
  --text-heading: 26px;
  --leading-heading: 1.1;

  /* Spacing */
  --spacing-19: 19px;
}
```
