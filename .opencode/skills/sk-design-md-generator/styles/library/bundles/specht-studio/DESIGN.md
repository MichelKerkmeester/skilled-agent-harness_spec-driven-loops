# Specht Studio — Style Reference
> Gallery wall of restrained curiosity. The studio's own chrome is a white plane and black type; the visual fireworks live entirely inside the project tiles.

**Theme:** light

Specht Studio is a curatorial frame, not a design showcase — the website removes every trace of itself so the portfolio work can hang on a neutral gallery wall. The chrome is aggressively monochrome: a single typeface, a single weight, black and gray ink on a near-white plane. There is no brand color, no CTA, no marketing surface — navigation is bare text and the grid of project tiles does all the work. The system achieves its identity through what it withholds: no shadows, no rounded corners, no gradient washes, no chromatic accent. Any page built in this system should read as a museum catalog, not a product page — the structure is the design, and the work is the content.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Gallery White | `#ffffff` | `--color-gallery-white` | Page canvas, project tile background where artwork doesn't fill the frame |
| Fog Gray | `#b0b0b0` | `--color-fog-gray` | Secondary surface, subtle dividers, muted metadata text |
| Graphite | `#666666` | `--color-graphite` | Link borders, secondary text, caption metadata, inactive nav |
| Gallery Black | `#000000` | `--color-gallery-black` | Primary text, active nav, all structural borders, the single ink that holds the system together |

## Tokens — Typography

### Helvetica Neue — Sole typeface across every context — nav, body, headings, links, footer. The deliberate choice of a single weight at 400 across all roles removes typographic hierarchy and forces the grid and the imagery to do the ranking. No display cuts, no bold emphasis, no italics — restraint as a point of view. · `--font-helvetica-neue`
- **Substitute:** Inter or Neue Haas Grotesk Text
- **Weights:** 400
- **Sizes:** 15px, 16px, 25px
- **Line height:** 1.00–1.50
- **Letter spacing:** normal
- **Role:** Sole typeface across every context — nav, body, headings, links, footer. The deliberate choice of a single weight at 400 across all roles removes typographic hierarchy and forces the grid and the imagery to do the ranking. No display cuts, no bold emphasis, no italics — restraint as a point of view.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1.4 | — | `--text-caption` |
| body-sm | 16px | 1.4 | — | `--text-body-sm` |
| body | 25px | 1.3 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 0px |
| nav | 0px |
| tiles | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 67-122px
- **Card padding:** 0px
- **Element gap:** 2-10px

## Components

### Navigation Bar
**Role:** Site-wide top navigation

Bare text-only horizontal list. Links at 15-16px Helvetica Neue 400 in Gallery Black, no underlines, no backgrounds, no active-state fills. Separated from the content by a hairline 1-2px black border bottom. Spacing between nav items is 30px margin-right. The word 'Work' carries a 2px black underline to mark the current section.

### Project Tile
**Role:** Portfolio thumbnail in the grid

Edge-to-edge image or artwork with zero padding and zero border-radius. Tiles butt directly against neighbors with a 2-10px gap (the system lets the artwork define its own edges). No title, no metadata, no overlay — the tile is the pure artifact. Grid cells vary in proportion (1:1, portrait, landscape) creating a masonry rhythm.

### Grid Container
**Role:** Holds the portfolio tiles in masonry arrangement

Multi-column grid (3-4 columns at desktop) at ~1400px max-width, left-aligned rather than centered. Tiles are tightly packed with minimal gutters. The grid is the dominant visual device — it is more present than any individual project.

### Text Link
**Role:** Inline and standalone links in body copy

15-16px Helvetica Neue 400 in Graphite (#666666), underlined with a 1px Graphite border. No hover color shift detected — links are static. The 1px underline is the only interactive affordance in the entire system.

### Section Header
**Role:** Optional heading text for sections like 'Artwork', 'Young Innovators'

25px Helvetica Neue 400 in Gallery Black, line-height 1.2, 13-24px margin-bottom. Overlaid directly on or near project tiles — no banner background, no colored chip, no box. Text sits on the white plane with no visual treatment distinguishing it from body type beyond size.

### Brand Lockup
**Role:** Studio identity in the top-left corner

'Specht Studio' at 15-16px Helvetica Neue 400 in Gallery Black, with the italicized subtitle 'structure, intuition, experiment' directly beneath at the same size in Graphite. No logo mark, no symbol — the wordmark alone. The subtitle in gray creates the only typographic color contrast in the lockup.

### Footer
**Role:** Site footer with secondary links and metadata

Bare text at 15px Helvetica Neue 400, 11-24px padding. Same black-on-white treatment as the rest of the system. No social icons, no newsletter form, no decorative elements.

## Do's and Don'ts

### Do
- Use only Helvetica Neue at weight 400 — no bold, no light, no italic beyond the brand subtitle. Typographic uniformity is the system.
- Set body text at 15-16px and headings at 25px max. Anything larger than 25px breaks the gallery-wall scale where the imagery dominates.
- Build with the white canvas as the default surface. Gallery Black (#000000) is the only structural ink; Graphite (#666666) handles secondary text and link borders.
- Let project tiles butt directly against each other with 2-10px gaps. The tight masonry grid is the primary organizational device — wide gutters would dissolve the visual density.
- Treat every page as a catalog. Text should annotate and index the work; it should never compete with the imagery for attention.
- Keep all borders hairline (1-2px) in Gallery Black. Borders replace shadows, fills, and rounding as the structural language.
- When a page needs section labels, use 25px black type directly on the white plane — never a colored chip, pill, or badge.

### Don't
- Do not introduce a brand color. Any chromatic accent would shift the system from 'gallery wall' to 'product page' and destroy the curatorial neutrality.
- Do not add rounded corners to tiles, buttons, or containers. The system is orthogonal — sharp 0px radii everywhere.
- Do not use shadows, blurs, or elevation. Depth must come from image content and grid density, not from CSS box-shadow.
- Do not use multiple typefaces or weights. A second weight or family immediately introduces hierarchy that the system deliberately suppresses.
- Do not add a CTA button. There is no primary action in this system — if a page needs a link, use a Graphite-underlined text link.
- Do not center the content on the page. The grid is left-aligned, slightly off-center, which creates the editorial-publication feel.
- Do not use gradients, fills, or tinted backgrounds. Every surface is pure white or pure black, never a shade between.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Gallery White | `#ffffff` | Primary page canvas — the white wall |
| 2 | Fog Gray | `#b0b0b0` | Recessed surface for metadata and quieter elements |

## Elevation

No shadows. The design flattens every element onto a single white plane; depth is implied by the project tile grid and the dense packing of imagery, not by elevation. Any attempt to add a drop shadow would introduce product-UI vocabulary that breaks the gallery-wall metaphor.

## Imagery

The imagery is the design system. Project tiles range across photography, editorial print, poster art, 3D renders, motion stills, and hand-drawn illustration — maximum visual diversity contained within a strict monochrome frame. Each tile is its own self-contained visual world; the grid treats them all with equal weight, no tile is visually privileged by size, position, or treatment. Tiles have no captions, no overlays, no rounded edges — they are raw crops. The overall feel is a curated mood board or museum wall: chaotic in content, rigorous in framing.

## Layout

The site is a single dense masonry grid of project tiles, full-width with a ~1400px content envelope, left-aligned rather than centered. Navigation is a minimal text bar at the very top — logo top-left, nav links inline — separated from the grid by a single hairline border. The hero IS the grid; there is no separate hero section, no introductory text, no banner image. Scrolling reveals more tiles in continuous flow with no section breaks or alternating bands. The grid packs 3-4 columns at desktop and reduces on smaller viewports. Project metadata and section titles appear sparingly, overlaid on the grid rather than in dedicated zones.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000
- accent: #666666
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. Build a portfolio grid: white #ffffff background, 3-column masonry layout at 1400px max-width, tiles are edge-to-edge images with 0px border-radius and 8px gap between cells. No shadows, no borders on tiles.
2. Build a top nav bar: white background, 1px solid #000000 bottom border, 24px padding. Left: 'Specht Studio' in 16px Helvetica Neue weight 400 #000000 with 'structure, intuition, experiment' in #666666 directly below. Right: nav links 'Work', 'Art / Research', 'Archive', 'About', 'Shop' at 15px weight 400 #000000, 30px margin-right between items, active item gets a 2px solid #000000 underline.
3. Build a text link: 15px Helvetica Neue weight 400, color #666666, 1px solid #666666 underline. No hover state change.
4. Build a section header: 'Artwork' in 25px Helvetica Neue weight 400 #000000, line-height 1.2, 24px margin-bottom. Sits directly on the white canvas with no background or border.
5. Build a project tile: a single image filling the entire tile area, 0px padding, 0px border-radius, no overlay text, no border, no shadow. The tile is raw content.

## Similar Brands

- **Pentagram** — Portfolio-as-website approach with no decorative chrome — diverse project tiles presented in a dense grid with minimal type treatment, letting the work carry the visual weight
- **Bruce Mau Design** — Studio site that functions as a curatorial catalog — black text on white, tight grid packing, zero brand-color noise, the work speaks for itself
- **Wieden+ Kennedy** — Editorial-portfolio feel with strict typographic restraint and a grid of visually diverse campaign artifacts presented in a neutral frame
- **M/M (Paris)** — Design studio site that treats itself as an art object — monochrome chrome, typographic precision, and project tiles that are individually expressive within a rigid container

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-gallery-white: #ffffff;
  --color-fog-gray: #b0b0b0;
  --color-graphite: #666666;
  --color-gallery-black: #000000;

  /* Typography — Font Families */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --text-body: 25px;
  --leading-body: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-35: 35px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 67-122px;
  --card-padding: 0px;
  --element-gap: 2-10px;

  /* Named Radii */
  --radius-all: 0px;
  --radius-nav: 0px;
  --radius-tiles: 0px;

  /* Surfaces */
  --surface-gallery-white: #ffffff;
  --surface-fog-gray: #b0b0b0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-gallery-white: #ffffff;
  --color-fog-gray: #b0b0b0;
  --color-graphite: #666666;
  --color-gallery-black: #000000;

  /* Typography */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --text-body: 25px;
  --leading-body: 1.3;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-35: 35px;
}
```
