# Photographer — Style Reference
> Giant black wordmark raining through a white-walled photo gallery — the text IS the architecture.

**Theme:** light

Julia is a visual-first photography portfolio: a white canvas hosting a loose masonry of large editorial frames, interrupted by a massive black wordmark that functions as both identity and graphic device. The interface is deliberately skeletal — no menus, no cards, no buttons — letting high-saturation editorial photography carry the color while the chrome stays black-on-white. Every photographic tile is wrapped in a thin chromatic hairline border drawn from the image's own dominant hue, turning the grid itself into a color study. Type does one thing and does it loudly: an ultra-bold, tightly-tracked wordmark anchors the page and proves the design system is confident enough to let white space do the rest.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, negative space between tiles, surface for the wordmark to read against |
| Wordmark Black | `#000000` | `--color-wordmark-black` | The Julia wordmark, all body and nav text, hairline grid borders, and structural lines — the only structural color in the system |
| Vermillion Frame | `#e21715` | `--color-vermillion-frame` | Chromatic hairline borders on photographic tiles whose dominant hue reads red — the most frequent accent border in the grid |
| Cobalt Frame | `#086392` | `--color-cobalt-frame` | Chromatic hairline borders on tiles with blue-dominant photography — paired with Vermillion as the secondary axis of the colored-frame system |
| Marigold Frame | `#f2572c` | `--color-marigold-frame` | Orange accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Fern Frame | `#5bc52c` | `--color-fern-frame` | Chromatic border for green-dominant photography tiles — completes the four-corner color rotation across the masonry |
| Brass Frame | `#b3813c` | `--color-brass-frame` | Chromatic border for yellow/golden-toned photography tiles, expanding the color frame vocabulary to five hues |
| Signal Red | `#f11216` | `--color-signal-red` | Outlined action border and link accent in navigation and interactive edges — the highest-saturation red in the system |
| Cyan Blue | `#2e99c9` | `--color-cyan-blue` | Outlined action border and link accent in navigation, paired with Signal Red for interactive link edges |

## Tokens — Typography

### Helvetica — Primary display + UI typeface. Weight 700 is non-negotiable — used at 700 across nav, links, and the colossal Julia wordmark. The tight -0.02em tracking pulls the massive letterforms into a single sculptural mass rather than a line of text. The wordmark sits in the hundreds of pixels while nav/labels sit at 10-18px, creating extreme typographic contrast between identity and chrome. · `--font-helvetica`
- **Substitute:** Inter (700), Arial Black, Neue Haas Grotesk Display Pro Bold
- **Weights:** 700
- **Sizes:** 10px, 18px (raw); 200-400px for the Julia wordmark (derived from visual evidence)
- **Line height:** 1.00
- **Letter spacing:** -0.0200em
- **Role:** Primary display + UI typeface. Weight 700 is non-negotiable — used at 700 across nav, links, and the colossal Julia wordmark. The tight -0.02em tracking pulls the massive letterforms into a single sculptural mass rather than a line of text. The wordmark sits in the hundreds of pixels while nav/labels sit at 10-18px, creating extreme typographic contrast between identity and chrome.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| nav | 10px | 1 | -0.2px | `--text-nav` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 18px | 1.5 | -0.36px | `--text-body` |
| display | 320px | 0.85 | -6.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 15 | 15px | `--spacing-15` |
| 43 | 43px | `--spacing-43` |

### Border Radius

| Element | Value |
|---------|-------|
| tiles | 0px |
| borders | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 120px
- **Card padding:** 0px
- **Element gap:** 15px

## Components

### Masonry Tile
**Role:** Primary content unit — a single editorial photograph in the grid

Full-bleed photographic image, no internal padding, no border-radius (0px). Wrapped in a 1px chromatic hairline border whose color is sampled from the image's dominant hue (Vermillion, Cobalt, Marigold, Fern, or Brass). Tiles vary in aspect ratio — portrait, landscape, and square intermixed — creating an organic masonry rhythm. Tiles touch each other with 15px gutters.

### Julia Wordmark Overlay
**Role:** Brand identity element that doubles as a graphic device across the page

Massive Helvetica Bold at approximately 320px, line-height 0.85, letter-spacing -6.4px. Solid #000000 on white. Sits in the left margin of the page, spanning the full vertical height of the grid. The 'J' in Julia extends below the baseline. Functions as both a navigation anchor and a visual frame for the masonry.

### Navigation Links
**Role:** Minimal site navigation

Helvetica 700 at 10px, letter-spacing -0.2px. #000000 text on white. Underlined with a 1px chromatic border (typically Signal Red or Cobalt Blue). All-caps or lowercase, left-aligned. No background fill, no padding, no button shape — links are bare typographic elements.

### Chromatic Hairline Frame
**Role:** Decorative border system for photographic tiles

1px solid border in one of five accent colors: Vermillion (#e21715), Cobalt (#086392), Marigold (#f2572c), Fern (#5bc52c), or Brass (#b3813c). Applied to the outer edge of photographic tiles. The border is part of the tile's visual identity, not a UI affordance — it echoes the dominant color of the enclosed photograph.

### Image Caption / Label
**Role:** Optional metadata under tiles (project name, client, date)

Helvetica 700 at 10px, #000000, letter-spacing -0.2px. No background, no border. Sits directly below a tile with minimal vertical spacing. May carry a thin colored underline matching the tile's border color.

### Full-Width Image Break
**Role:** Editorial emphasis tiles that span the grid width

A single photograph that breaks the masonry grid and occupies the full content width. No border, no padding, no caption chrome — lets the image command the viewport. Used sparingly, roughly once per scroll-fold.

### Outlined Link / Action
**Role:** The only interactive element type in the system

No filled buttons exist. All actions are bare text links with a 1px chromatic border (Signal Red #f11216, Cobalt Blue #2e99c9, or Vermillion #e21715). Helvetica 700, 18px, #000000 text. No background fill, no border-radius, no padding beyond the border's footprint.

## Do's and Don'ts

### Do
- Use Helvetica 700 at extreme size contrast: 10-18px for chrome, 200-400px for the Julia wordmark — the ratio IS the hierarchy
- Apply letter-spacing -0.02em to all type; tighter tracking pulls bold letterforms into sculptural mass
- Wrap photographic tiles in 1px chromatic hairline borders sampled from each image's dominant hue — the grid becomes a color study
- Keep line-height at 1.00 for the wordmark; letters must overlap or nearly touch vertically for maximum impact
- Use #000000 as the only structural color — white canvas, black text, black hairlines; all color comes from photography
- Let tiles touch with 15px gutters; never add internal padding or margins inside a tile
- Maintain 0px border-radius everywhere — sharp edges only, consistent with editorial print aesthetic

### Don't
- Never introduce drop shadows, gradients, or blur — the system is flat by conviction
- Never add background fill to buttons or links; this system has no filled interactive elements
- Never use a border-radius above 0px on tiles, frames, or any container
- Never use color for body text — all text is #000000; color is reserved for borders and photographic content
- Never add a navigation bar, header, or footer chrome that competes with the wordmark for visual real estate
- Never use a light or thin weight of Helvetica; weight 700 is the only weight in the system
- Never add card padding, drop shadows, or surface elevation to group images — the grid IS the grouping

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-bleed page background — the gallery wall |
| 1 | Tile Surface | `#000000` | Photographic tile content — the image fills the frame edge-to-edge |

## Elevation

No shadows. Photography tiles sit flush against the white canvas; separation is achieved through generous whitespace and thin chromatic hairlines, not drop shadows. The system treats elevation as an unnecessary decoration that would compete with the imagery.

## Imagery

The site is a photography portfolio, so imagery is the product. All visuals are high-saturation editorial photography: fashion editorials, portraiture, and campaign work with bold color grading. Images are full-bleed within their tiles with no rounded corners, no drop shadows, and no overlay treatments. The photography itself ranges from tightly-cropped portrait fragments (a hand with rings, a torso, a face detail) to full environmental fashion shots. Color treatment is vivid and saturated — deep reds, electric blues, acid greens, warm oranges — not desaturated or moody. There is no lifestyle staging or candid reportage; every frame is controlled and art-directed. The images carry their own color identity, and the system's chromatic border system draws from each photograph's dominant hue, making the grid function as a self-organizing color palette.

## Layout

The page is a single full-bleed masonry grid with no maximum content width — tiles extend edge-to-edge. The massive Julia wordmark sits in the left portion of the viewport as a fixed or scroll-anchored overlay, and the masonry flows to the right of (and potentially behind) it. Tiles vary in aspect ratio — tall portraits, wide landscapes, and squares — creating an organic, non-uniform rhythm. There are no section breaks, no card grouping, no alternating bands. Navigation is minimal: a few bare typographic links, likely top-right or in a fixed position. The page is a single continuous scroll with no distinct hero, features, or footer sections — it IS a gallery wall. Spacing between tiles is 15px; the wordmark's vertical extent defines the page's implicit section boundaries. The content is image-heavy to the extreme — text occupies perhaps 5% of the viewport at any time.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- border: #000000 (structural) | #e21715, #086392, #f2572c, #5bc52c, #b3813c (chromatic tile frames)
- accent: Signal Red #f11216 (interactive links)
- primary action: #e21715 (outlined action border)

## Example Component Prompts

1. **Julia Wordmark Overlay**: Render 'Julia' at 320px, Helvetica 700, line-height 0.85, letter-spacing -6.4px, #000000 on a #ffffff canvas. Position left-aligned, spanning the full vertical viewport height. The 'J' descender must extend below the baseline by ~30px. No other elements should overlap the letterforms.

2. **Masonry Tile with Chromatic Frame**: A full-bleed editorial photograph (aspect ratio 3:4 portrait). 1px solid border in #e21715 (Vermillion) on all four sides. 0px border-radius. No padding, no shadow, no caption inside. 15px gap to neighboring tiles. The border color should match the image's dominant hue.

3. **Navigation Link**: Bare text link, Helvetica 700, 10px, #000000, letter-spacing -0.2px. Underlined with a 1px #f11216 (Signal Red) border. No background, no padding, no border-radius, no button shape. Sits in the top-right corner of the page.

4. **Full-Width Image Break**: A landscape editorial photograph at 16:9 aspect ratio spanning the full viewport width. 0px border-radius, no border, no overlay, no caption. Used once per scroll-fold to break the masonry rhythm.

5. **Tile with Fern Border**: A photograph with green-dominant subject matter. Wrapped in 1px solid #5bc52c (Fern) border. Below the tile, a 10px Helvetica 700 caption in #000000, with a 1px #5bc52c underline matching the frame color.

## Typography Philosophy

The Julia wordmark is not a logo placed on the page — it is a typographic installation. At 320px+ in Helvetica 700 with -0.02em tracking, the name functions as architecture, dividing the page into spatial zones and proving the design system's confidence. The extreme size jump from 18px (body) to 320px (wordmark) — a ratio of nearly 18:1 — is deliberately anti-hierarchy. Most systems use a 3-4x ratio between display and body. Julia uses nearly 20x because the wordmark is not 'content' to be read; it is a surface to be inhabited. UI type stays at 10-18px and never grows, because the wordmark already owns the upper register.

## Color Philosophy

The chromatic border system is the most distinctive structural choice. Rather than assigning colors to categories (like a typical design system with blue=link, red=error), Julia draws each tile's border color from the photograph it contains. The grid becomes self-organizing: a scan across the page reveals a color rhythm dictated by the photography, not by a fixed palette. This means the 'color system' is emergent — it cannot be pre-specified, only bounded. The five canonical border hues (Vermillion, Cobalt, Marigold, Fern, Brass) represent the color families the portfolio tends to work in, and new tiles will naturally fall into one of these ranges.

## Similar Brands

- **Garage Magazine** — Same editorial-print sensibility: massive typographic identity, full-bleed photography tiles, white canvas, no UI chrome
- **System Magazine** — Same masonry-of-editorial-shots layout with bold sans-serif wordmark overlay and chromatic photography
- **Mert & Marcus portfolio** — Same fashion-photography-first approach: image grid dominates, text is minimal and massive, color lives inside the frames
- **Document Journal** — Same Helvetica-Bold-at-extreme-sizes wordmark treatment with white-walled photo gallery structure
- **AnOther Magazine** — Same bold typographic identity layered over high-saturation editorial photography on a clean white canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-wordmark-black: #000000;
  --color-vermillion-frame: #e21715;
  --color-cobalt-frame: #086392;
  --color-marigold-frame: #f2572c;
  --color-fern-frame: #5bc52c;
  --color-brass-frame: #b3813c;
  --color-signal-red: #f11216;
  --color-cyan-blue: #2e99c9;

  /* Typography — Font Families */
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-nav: 10px;
  --leading-nav: 1;
  --tracking-nav: -0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-display: 320px;
  --leading-display: 0.85;
  --tracking-display: -6.4px;

  /* Typography — Weights */
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-8: 8px;
  --spacing-15: 15px;
  --spacing-43: 43px;

  /* Layout */
  --section-gap: 120px;
  --card-padding: 0px;
  --element-gap: 15px;

  /* Named Radii */
  --radius-tiles: 0px;
  --radius-borders: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-tile-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-wordmark-black: #000000;
  --color-vermillion-frame: #e21715;
  --color-cobalt-frame: #086392;
  --color-marigold-frame: #f2572c;
  --color-fern-frame: #5bc52c;
  --color-brass-frame: #b3813c;
  --color-signal-red: #f11216;
  --color-cyan-blue: #2e99c9;

  /* Typography */
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-nav: 10px;
  --leading-nav: 1;
  --tracking-nav: -0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-display: 320px;
  --leading-display: 0.85;
  --tracking-display: -6.4px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-15: 15px;
  --spacing-43: 43px;
}
```
