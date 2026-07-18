# Studio HEED — Style Reference
> midnight gallery wall — black exhibition space with hairline white frames and tiny precise labels

**Theme:** dark

Studio HEED operates as a midnight editorial gallery: an almost entirely monochrome canvas where the page itself is the dark room, white hairline borders become picture frames, and the work hangs like a curated exhibition. Every surface decision — the near-black canvas, a single deep navy panel, a warm cement gray alternate — reduces visual noise to let the project tiles breathe. Typography is deliberately microscopic (12–14px, weight 600) so labels whisper authority rather than shout, turning small caps into the studio's signature rhythm. Radii are locked to 5px everywhere, which keeps the aesthetic architectural and unfussy — no soft pillowy cards, no decorative gradients, no shadows. The grid gap of 14px is the heartbeat of the layout, giving every project the same precise breathing room regardless of column count.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, dominant card surface — the near-black that absorbs the eye and lets project imagery carry all visual weight |
| White | `#ffffff` | `--color-white` | Hairline borders, text, link borders, and the 124 link borders form the white wireframe structure of every tile and section |
| Midnight Navy | `#00174f` | `--color-midnight-navy` | Accent card surface and decorative panels — the only chromatic hue in the system, used sparingly as a deep tonal interruption against the void |
| Cement | `#c2c1bf` | `--color-cement` | Alternate card surface — a warm desaturated gray that breaks the black/navy rhythm when a tile needs to feel physical or grounded |

## Tokens — Typography

### Suisse Intl — Exclusive display and body font — the studio's signature is deploying a weight 600 grotesque at a whisper-small 12–14px for absolutely everything, from navigation to project labels to body copy. This uniform micro-size is anti-convention; most agencies use a dramatic type scale, but HEED treats 12–14px weight 600 as a single visual register, like a single monospace that carries every function. · `--font-suisse-intl`
- **Substitute:** Inter, Neue Haas Grotesk, NB International
- **Weights:** 600
- **Sizes:** 12px, 14px
- **Line height:** 1.40
- **Letter spacing:** normal
- **Role:** Exclusive display and body font — the studio's signature is deploying a weight 600 grotesque at a whisper-small 12–14px for absolutely everything, from navigation to project labels to body copy. This uniform micro-size is anti-convention; most agencies use a dramatic type scale, but HEED treats 12–14px weight 600 as a single visual register, like a single monospace that carries every function.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 20 | 20px | `--spacing-20` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 5px |
| cards | 5px |
| images | 5px |
| buttons | 5px |

### Layout

- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 14px

## Components

### Project Gallery Tile
**Role:** Primary content unit — the exhibition piece hanging on the gallery wall

A rectangular card with 5px border radius, no shadow, sitting on the #000000 canvas. The tile alternates between four surface treatments: full-bleed photo (rounded to 5px), solid Midnight Navy #00174f, solid Cement #c2c1bf, or inverted White #ffffff for product/white-bg photography. No internal padding between image and tile edge — the image IS the tile. Below the tile, a 20px caption block holds the project name in Suisse Intl 14px weight 600 white, with the category (e.g. 'Brand & Packaging') at 12px weight 600 white directly beneath. The 14px gap between image bottom and caption creates the studio's tight editorial rhythm.

### Project Caption Label
**Role:** The two-line label identifying each gallery tile

Two stacked lines: project name at 14px weight 600 white #ffffff, category/discipline at 12px weight 600 white #ffffff. No separator, no bullet, no period — just two lines of identical weight at different sizes. The 20px padding block creates visual breathing room above the next tile or section edge.

### Studio Header Block
**Role:** Top-of-page identity, navigation, and contact information

A horizontal block on the void canvas. Left: 'Studio HEED' in Suisse Intl 14px weight 600 white, followed by 'Work, Info' nav links at the same size and weight. Right: stacked contact lines (email, phone, Instagram, Twitter) at 12px weight 600 white, with a language toggle ('En, De') below. The header occupies roughly the top 40% of the viewport with the descriptive paragraph (Suisse Intl 14px weight 600) sitting in a narrow left-aligned column beneath the studio name.

### Nav Link
**Role:** Primary site navigation items

Inline text link in Suisse Intl 14px weight 600 white #ffffff, separated by 14px gaps. No underlines, no background fills — pure typographic navigation. Sits horizontally next to the studio name in the header.

### Language Toggle
**Role:** Bilingual site switcher

Two items ('En, De') at 12px weight 600 white #ffffff, separated by a comma and space. No active state styling — the comma itself acts as separator. Sits at the bottom of the right-side contact stack.

### Contact Info Line
**Role:** Email, phone, and social handles displayed in the header

Single-line entries (hello@studioheed.com, +43 650 257 9101, Instagram, Twitter) in Suisse Intl 12px weight 600 white #ffffff, stacked vertically with 14px row gap. No labels, no icons — the content is self-evident.

### Description Paragraph
**Role:** Studio self-description below the header identity

Left-aligned body copy in Suisse Intl 14px weight 600 white #ffffff, limited to a narrow column (~30% of viewport width). The text describes the studio's practice in third person, treated with the same weight and size as navigation — no hierarchy distinction between meta-info and body copy.

### Gallery Row
**Role:** Horizontal strip of project tiles

A single-row horizontal carousel/scroll of project tiles. Tiles are equal-height rectangles, separated by 14px column gaps, filling the viewport width. The 5px radius applies to each tile. Tiles may clip at viewport edges, suggesting horizontal scroll. No navigation controls visible — the row is an endless exhibition wall.

## Do's and Don'ts

### Do
- Use #000000 as the default page canvas for every section — the void IS the brand
- Apply 5px border-radius to every card, image, and interactive surface — never deviate
- Keep all type at 12px or 14px weight 600 Suisse Intl — the micro-type register is the signature
- Maintain 14px gaps between gallery tiles and between stacked metadata lines
- Use #ffffff for all text and hairline borders — the white wireframe IS the UI structure
- Present projects as equal-height tiles in a horizontal row, separated by 14px gaps
- Let the four surface colors (void, white, midnight navy, cement) carry all visual variety — no gradients, no shadows, no decorative elements

### Don't
- Never add drop shadows, elevation, or glow effects to any surface
- Never use a type size larger than 14px — the micro-type register is non-negotiable
- Never introduce additional colors beyond the four surface tones — the palette is closed
- Never use soft radii (8px+) or pill shapes (9999px) — 5px is the only radius in the system
- Never use font weights below 600 — the uniform semibold weight carries the entire voice
- Never add underlines, backgrounds, or color differentiation to active nav states
- Never use gradients, photographic backgrounds, or illustrated section dividers between content blocks

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Full-bleed page background — the dark room that holds the exhibition |
| 1 | Midnight Panel | `#00174f` | Accent project tiles and decorative breaks |
| 2 | Cement Tile | `#c2c1bf` | Warm alternate surface for project cards that need physical presence |
| 3 | White Inset | `#ffffff` | Inverted project tiles (white photography backgrounds) and image surfaces |

## Elevation

Elevation is deliberately absent. The design language treats the void canvas as a flat gallery wall — tiles are distinguished by their fill color, never by shadow or depth. This creates a print-editorial feel rather than a software UI feel. No drop shadows, no glow effects, no modal overlays with backdrop blur.

## Imagery

Photography and project artwork are the only imagery. Project tiles contain full-bleed product photography, brand identity mockups, or campaign visuals that fill the entire tile edge-to-edge. The 5px radius softens the images just enough to feel contemporary without feeling soft. There is no decorative photography, no lifestyle imagery, no abstract graphics — the work itself is the visual content. Iconography is absent from the interface. The contrast between white-background product photography (tiles) and dark campaign imagery (other tiles) creates visual rhythm within the single-row gallery. Labels are always white, sitting in the void below the tile, never overlaid on imagery.

## Layout

Full-bleed dark canvas with no maximum content width — the void extends to all viewport edges. The header block occupies the top ~40% of the viewport with a narrow left-aligned text column and a right-aligned contact stack. The project gallery is a single horizontal row of equal-height rectangular tiles with 14px gaps, filling the full viewport width and suggesting horizontal scroll. Below each tile, a caption block provides project identification. There are no multi-row grids, no sidebars, no traditional page sections — just the header block and the gallery wall. Navigation is inline text in the header, not a separate bar.

## Agent Prompt Guide

## Quick Color Reference
- Page canvas: #000000
- Primary text & borders: #ffffff
- Accent surface (navy): #00174f
- Alternate surface (cement): #c2c1bf
- Project tile captions: #ffffff
- primary action: no distinct CTA color

## Example Component Prompts

1. **Gallery Project Tile**: A rectangular project card on a #000000 page canvas with 5px border-radius and no shadow. The card surface is solid #00174f Midnight Navy (or alternate to #c2c1bf Cement or #ffffff White depending on the project). The image fills the tile edge-to-edge with the 5px radius masking it. Below the tile, a 20px padding block holds a two-line caption: project name in Suisse Intl 14px weight 600 #ffffff, and discipline label in Suisse Intl 12px weight 600 #ffffff. The tile sits in a horizontal row with 14px column gaps.

2. **Studio Header**: A top-of-page block on #000000 canvas. Left side: 'Studio HEED' in Suisse Intl 14px weight 600 #ffffff, followed by inline nav links 'Work, Info' at the same spec, separated by 14px gaps. Right side: a vertically stacked contact block (email, phone, Instagram, Twitter) in Suisse Intl 12px weight 600 #ffffff, with 14px row gaps between lines. A language toggle 'En, De' at 12px weight 600 #ffffff sits at the bottom of the right stack. No borders, no backgrounds, no decoration.

3. **Description Paragraph**: A narrow left-aligned text column (~30% viewport width) on the #000000 canvas, positioned below the studio name. Body copy in Suisse Intl 14px weight 600 #ffffff at 1.4 line-height. No maximum line length indicators, no text hierarchy — the paragraph is treated with the same visual weight as nav items.

4. **Gallery Row**: A single horizontal strip of project tiles filling the viewport width. Each tile is an equal-height rectangle with 5px radius, separated by 14px column gaps. Tiles alternate between photographic fills (rounded 5px), solid #00174f, solid #c2c1bf, and inverted #ffffff. Tiles may extend beyond the viewport edge to suggest infinite horizontal scroll. No scroll indicators or controls.

5. **Caption Stack**: A two-line label positioned 20px below a gallery tile. Line 1: project name, Suisse Intl 14px weight 600 #ffffff. Line 2: discipline (e.g. 'Brand & Packaging'), Suisse Intl 12px weight 600 #ffffff. No separator, no punctuation, no color differentiation between the two lines.

## Design Philosophy

Studio HEED's design system is built on restraint as identity. The void canvas, the hairline white borders, the locked 5px radius, and the whisper-small 14px semibold type are not limitations — they are the brand. Every project tile is a frame in a gallery; every caption is a museum wall label. The system treats the portfolio page as an exhibition space, not a product interface. The four surface tones (void, white, midnight navy, cement) create all the visual variety needed, and the micro-type register eliminates the need for typographic hierarchy through size. A designer building with this system should resist the urge to add — to add colors, to add sizes, to add shadows, to add decoration. The subtraction IS the work.

## Similar Brands

- **Pentagram** — Same editorial portfolio gallery approach with project tiles as the primary content unit and a typographic-only header
- **Bureau Cool** — Same flat dark canvas with no shadows, minimal type scale, and project-first tile-based layouts
- **Mast Studio** — Same micro-type register (12-14px) carrying the entire interface voice and 5px radii on all surfaces
- **DIA Studio** — Same monochrome void canvas with hairline white structural elements and four-tone surface palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-white: #ffffff;
  --color-midnight-navy: #00174f;
  --color-cement: #c2c1bf;

  /* Typography — Font Families */
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;

  /* Typography — Weights */
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-20: 20px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-md: 5px;

  /* Named Radii */
  --radius-all: 5px;
  --radius-cards: 5px;
  --radius-images: 5px;
  --radius-buttons: 5px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-midnight-panel: #00174f;
  --surface-cement-tile: #c2c1bf;
  --surface-white-inset: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-white: #ffffff;
  --color-midnight-navy: #00174f;
  --color-cement: #c2c1bf;

  /* Typography */
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-20: 20px;

  /* Border Radius */
  --radius-md: 5px;
}
```
