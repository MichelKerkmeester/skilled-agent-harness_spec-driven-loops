# iconwerk — Style Reference
> gallery wall of crafted icons — a near-invisible white room where rounded tiles of work hang in rhythmic rows

**Theme:** light

Iconwerk is a gallery wall for a custom icon studio — a near-monochrome light canvas where rounded-square tiles showcase work at a deliberate, generous rhythm. The interface recedes: black-and-white chrome, Arial system text for body copy, Graphik for display headings, and a single 28px card radius that becomes the system's signature shape. Real color lives only inside the portfolio tiles themselves — red product shots, orange illustrated figures, blue tech icons, green aerial photography — so the UI never competes with the work. The overall feel is a curated museum: quiet surroundings, loud objects, zero decorative noise.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary headings, body text, and icon fills on light surfaces. Do not promote it to the primary CTA color |
| Paper | `#ffffff` | `--color-paper` | Page background, text on dark tiles, inverse surfaces — the canvas everything sits on |
| Fog | `#d9d9d9` | `--color-fog` | Light card tile backgrounds, secondary surface for showcased work, subtle UI dividers |
| Ash | `#8e8e93` | `--color-ash` | Pill-shaped navigation markers, muted icon strokes, secondary UI chrome |
| Slate | `#1a1a1a` | `--color-slate` | Dark card tile background variant (near-black) — deeper than Ink, used when a tile needs a subtly softer dark than pure black |

## Tokens — Typography

### Graphik (custom) — Display and heading family. 24px/600 for section openers like 'iconwerk,' 21–22px/400 for larger body passages, 16px/400 for standard body. The 1.18–1.21 line-height range is tight — heading text feels compact and confident rather than airy. · `--font-graphik-custom`
- **Substitute:** Inter, Neue Haas Grotesk, Manrope
- **Weights:** 400, 600
- **Sizes:** 16px, 21px, 22px, 24px
- **Line height:** 1.18–1.21
- **OpenType features:** `"liga" on`
- **Role:** Display and heading family. 24px/600 for section openers like 'iconwerk,' 21–22px/400 for larger body passages, 16px/400 for standard body. The 1.18–1.21 line-height range is tight — heading text feels compact and confident rather than airy.

### Arial — System fallback / dense utility text at 14px. Used at small sizes throughout — link labels, helper copy. Its system-font nature keeps it invisible; it never carries brand weight, only function. · `--font-arial`
- **Substitute:** Helvetica, system-ui
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.21
- **OpenType features:** `"liga" on`
- **Role:** System fallback / dense utility text at 14px. Used at small sizes throughout — link labels, helper copy. Its system-font nature keeps it invisible; it never carries brand weight, only function.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.21 | — | `--text-body-sm` |
| body | 16px | 1.21 | — | `--text-body` |
| subheading | 21px | 1.19 | — | `--text-subheading` |
| heading-lg | 24px | 1.18 | — | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 36 | 36px | `--spacing-36` |
| 37 | 37px | `--spacing-37` |
| 44 | 44px | `--spacing-44` |
| 45 | 45px | `--spacing-45` |
| 61 | 61px | `--spacing-61` |
| 62 | 62px | `--spacing-62` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 28px |
| buttons | 28px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 45px
- **Card padding:** 0px
- **Element gap:** 5px

## Components

### Portfolio Tile — Dark Variant
**Role:** Inverted card for showcasing light-colored icons on a dark stage

28px border-radius, fill: #1a1a1a, no border, no shadow. Contains a single light-toned icon (white or mid-gray) centered with generous internal padding. The dark surface makes icon line weights read crisply — the tile IS the spotlight.

### Portfolio Tile — Light Variant
**Role:** Neutral card for showcasing dark icons on a light stage

28px border-radius, fill: #d9d9d9, no border, no shadow. Centers a single dark (#000000) icon. Mirrors the dark variant in behavior — the tile provides contrast isolation so the icon's form is the focus.

### Portfolio Tile — Photo Variant
**Role:** Full-bleed photograph with overlaid icon artwork

28px border-radius, fill: photograph, no border. The photo fills the entire tile edge-to-edge with the rounded mask clipping it. An icon (white, brand-colored, or outlined) sits centered or offset on top. Tiles can be any visual style — sunset landscapes, aerial forests, product close-ups — which is what gives the grid its energy.

### Portfolio Tile — Brand Color Variant
**Role:** Solid color card with brand-toned icon

28px border-radius, fill: single saturated color (red, orange, etc.), no border. Used sparingly. The color tile is a punctuation moment in the grid — it interrupts the monochrome rhythm with a loud, intentional beat.

### Contact Button (Filled Black)
**Role:** Primary action — the only filled button in the system

Fill: #000000, text: #ffffff, font: Graphik 14–16px/400, padding: ~12px 24px, border-radius: 28px, no border, no shadow. Sits top-right of the page. The pill shape mirrors the card radius — same 28px curve, reinforcing the system's single radius language.

### Navigation Pill Marker
**Role:** Minimal navigation indicator / section marker

Short rounded bar, ~40–60px wide × 8–12px tall, fill: #8e8e93, border-radius: 9999px. Appears as a lone element in the top-left corner with no accompanying text — it functions as a decorative mark, not a clickable nav item. Its extreme rounding (pill) contrasts with the 28px card radius, creating a two-radius system: cards = 28px, pills = fully round.

### Logo Mark
**Role:** Brand identity mark + tagline lockup

Hand-drawn-feeling circular mark (a circle with a diagonal stroke through it) in #000000, ~48px. Sits above the brand wordmark 'iconwerk,' in Graphik 24px/600, followed by 'custom icon design for your next project.' in Graphik 21px/400. The sketchy, imperfect mark contrasts the geometric cards — it signals the studio's human, hand-crafted side.

### Section Heading Block
**Role:** In-grid text introduction between tile clusters

Graphik 24px/600 for the lead phrase ('Simple, clear, useful.'), Graphik 21px/400 for the supporting paragraph. No color hierarchy beyond default Ink on Paper. Sits inline within the grid flow — text IS a tile weight in the layout.

### Icon Overlay (on Photo Tiles)
**Role:** Line-art or filled icon sitting atop photographic tile content

Centered or slightly offset, ~30–40% of tile width. Stroke: 2–3px, color: white (#ffffff), brand accent, or dark (#000000) depending on photo brightness. The overlay icon is the tile's subject — the photo is its environment.

### Grid Container
**Role:** 4-column tile grid that holds the entire portfolio

4 equal columns on desktop, ~24–36px gutters, 45px vertical row spacing. Tiles are 1:1 aspect ratio. The grid is the page — there is no hero section, no feature blocks, no marketing zones. The grid IS the layout.

## Do's and Don'ts

### Do
- Use 28px border-radius for every card, button, and contained surface — this single radius is the system's most recognizable trait
- Keep the UI chrome monochrome (Ink, Paper, Fog, Ash) — let portfolio tiles carry all color and imagery
- Use Graphik 24px/600 for section openers and 16–21px/400 for body — the 1.18–1.21 line-height keeps text compact, not airy
- Show work in a 4-column 1:1 tile grid with 45px vertical gaps and 24–36px gutters
- Use #000000 fill + #ffffff text for the only filled action button; never introduce a second filled-button color
- Use 9999px (pill) radius exclusively for the small navigation marker — reserving it creates a deliberate two-radius system
- Let photos fill tiles edge-to-edge inside the 28px mask; never inset a photo within a tile's border

### Don't
- Do not add color to the interface chrome — the gallery wall must stay neutral so the work can be loud
- Do not use shadows or elevation on tiles — the grid stays flat, depth comes from content contrast, not visual effects
- Do not introduce a second filled-button style (outlined, ghost) — the black filled button is the only action
- Do not set body text below 14px or above 22px — the type scale is intentionally tight (14/16/21/22/24)
- Do not mix the card radius (28px) with smaller radii (4px, 8px, 12px) on UI elements — one radius, one system
- Do not add hero sections, banner images, or marketing blocks — the tile grid IS the homepage
- Do not use gradient backgrounds, decorative shapes, or non-functional ornament — the portfolio is the only visual content

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Base background — the gallery wall |
| 2 | Light Tile | `#d9d9d9` | Light card variant — neutral stage for dark icons |
| 3 | Dark Tile | `#1a1a1a` | Dark card variant — inverted stage for light icons |

## Elevation

The system has zero shadow elevation. All depth is created by content contrast within the flat tile grid — a dark tile next to a light tile, a photograph next to a solid color, an icon sitting on a background. This deliberate flatness is what makes the portfolio feel like a physical gallery wall rather than a software interface.

## Imagery

The page is image-dominant — photography is the primary content, not decoration. Photo tiles include tight product crops (TV remotes, streaming devices), lifestyle portraits (smiling subjects in dark clothing), environmental photography (sunset mountain landscapes, aerial forest views, wood-grain surfaces), and device close-ups (smart speakers, smartwatches). Photos are full-bleed inside rounded-square masks, never inset with borders. A white or brand-colored line-art icon sits overlaid on each photo, functioning as the tile's subject while the photo provides atmosphere. The photography style is high-quality, contemporary, and varied — warm sunsets next to clinical product shots next to dark editorial portraits. No duotone treatment, no color grading beyond natural — the photos look like a real studio's reference library.

## Layout

The entire page is a single 4-column tile grid that scrolls vertically — there is no hero, no marketing zones, no distinct header band. The grid starts near the very top of the page with only a minimal chrome row (small navigation pill on the left, logo + contact button on the right) above it. Tiles are 1:1 squares with 28px radius, ~24–36px horizontal gutters, and ~45px vertical row spacing. Content alternates naturally: a dark icon tile next to a light icon tile next to a photo tile next to a brand-color tile — the variation in tile content creates visual rhythm without needing layout structure. Text blocks (section introductions like 'Simple, clear, useful.') appear inline within the grid flow, occupying the same visual weight as image tiles. Navigation is minimal to invisible: a single contact button in the top-right and a decorative pill mark in the top-left. The page max-width is approximately 1280px, centered on a white background with generous side margins.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Ink)
- background: #ffffff (Paper)
- card/light surface: #d9d9d9 (Fog)
- dark surface: #1a1a1a (Slate)
- muted chrome: #8e8e93 (Ash)
- primary action: no distinct CTA color

3-5 Example Component Prompts:

1. Portfolio Tile (Dark): 280px × 280px square, 28px border-radius, fill #1a1a1a, no border, no shadow. Center a single white (#ffffff) line-art icon at ~35% of tile width. No text inside the tile.

2. Portfolio Tile (Photo with Overlay): 280px × 280px square, 28px border-radius, fill = photograph (edge-to-edge, clipped by radius mask), no border. Overlay a 2px-stroke white (#ffffff) line-art icon centered at ~35% of tile width.

3. Contact Button: Inline element, fill #000000, text #ffffff, font Graphik 14px/400, padding 12px 24px, border-radius 28px, no border, no shadow. Text: 'contact' in lowercase.

4. Section Heading Block: Graphik 24px/600 'Simple, clear, useful.' in #000000, line-height 1.18. Below it, Graphik 21px/400 paragraph in #000000, line-height 1.19. No colored accents.

5. Brand Lockup: Hand-drawn circular mark (~48px, #000000) above the wordmark 'iconwerk,' in Graphik 24px/600, followed by a one-line descriptor in Graphik 21px/400. The mark's imperfect strokes should feel sketch-like, not geometric.

## Two-Radius System

The system uses exactly two border-radius values, and this binary is intentional: 28px for all cards and buttons (the 'soft tile' radius), and 9999px for the small navigation pill marker (the 'fully round' radius). Introducing any third radius (4px, 8px, 12px, 16px) breaks the system's visual signature. A designer should never reach for a radius between these two extremes — 28px is the floor, fully round is the ceiling.

## Similar Brands

- **Studio Brasch** — Same flat grid-of-squares portfolio pattern with monochrome chrome letting work dominate
- **Manual (manualcreative.com)** — Minimal gallery-style layout with generous spacing and no UI noise
- **Ramotion** — Studio portfolio using rounded-square tile grids and near-invisible interface chrome
- **Huge (hugeinc.com)** — Agency portfolio with image-driven tile grid and minimal typographic chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #d9d9d9;
  --color-ash: #8e8e93;
  --color-slate: #1a1a1a;

  /* Typography — Font Families */
  --font-graphik-custom: 'Graphik (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.21;
  --text-body: 16px;
  --leading-body: 1.21;
  --text-subheading: 21px;
  --leading-subheading: 1.19;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.18;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-37: 37px;
  --spacing-44: 44px;
  --spacing-45: 45px;
  --spacing-61: 61px;
  --spacing-62: 62px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 45px;
  --card-padding: 0px;
  --element-gap: 5px;

  /* Border Radius */
  --radius-3xl: 28px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 28px;
  --radius-buttons: 28px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-light-tile: #d9d9d9;
  --surface-dark-tile: #1a1a1a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #d9d9d9;
  --color-ash: #8e8e93;
  --color-slate: #1a1a1a;

  /* Typography */
  --font-graphik-custom: 'Graphik (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.21;
  --text-body: 16px;
  --leading-body: 1.21;
  --text-subheading: 21px;
  --leading-subheading: 1.19;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.18;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-37: 37px;
  --spacing-44: 44px;
  --spacing-45: 45px;
  --spacing-61: 61px;
  --spacing-62: 62px;

  /* Border Radius */
  --radius-3xl: 28px;
}
```
