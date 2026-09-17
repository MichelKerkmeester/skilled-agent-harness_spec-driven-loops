# Brisbane Web Developer — Style Reference
> gallery wall in winter light. An achromatic, spacious portfolio on a warm bone-white canvas, with each project tile framed by soft brown-toned shadows and labeled in a whisper-thin display face.

**Theme:** light

Carl Beaverson's portfolio operates on radical restraint: a warm off-white canvas, exclusively neutral tones, and a single accent typeface (Suisse Works) reserved for the smallest typographic moments. The entire system is achromatic — no brand color, no chromatic accent, no semantic hues. Hierarchy is built through scale jumps, tracking, and generous negative space rather than color or weight. Components float on warm-tinted brown shadows that subtly warm an otherwise cold minimalist grid. The reading order is content-first: three-up project tiles, tiny attribution text, and large section gutters that let each piece breathe independently.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Canvas | `#f4f3f1` | `--color-bone-canvas` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Ink | `#333333` | `--color-ink` | Primary headings, button text, input text, high-contrast labels |
| Graphite | `#4d4d4d` | `--color-graphite` | Body text, paragraph copy, longer-form descriptions |
| Slate | `#666666` | `--color-slate` | Muted secondary text, tertiary metadata |
| Ash | `#aaaaaa` | `--color-ash` | Subtle borders, dividers, light secondary text, project attribution labels |
| Mist | `#dddddd` | `--color-mist` | Card surface lift from canvas, subtle background variation |

## Tokens — Typography

### system-ui, -apple-system, sans-serif — Body copy, navigation, buttons, inputs, hero description, project labels — the workhorse face. 14px for inline meta, 15px for inputs/buttons, 20px for hero paragraph and project titles. · `--font-system-ui-apple-system-sans-serif`
- **Substitute:** Inter, Helvetica Neue, Arial
- **Weights:** 400
- **Sizes:** 14px, 15px, 20px
- **Line height:** 1.2–1.5
- **Role:** Body copy, navigation, buttons, inputs, hero description, project labels — the workhorse face. 14px for inline meta, 15px for inputs/buttons, 20px for hero paragraph and project titles.

### Suisse Works Trial — Reserved exclusively for the '60 Selected Projects' section label. A serif display face set at 13px with tightened tracking — an anti-type-scale choice that makes a heading read as an editorial caption. This font carries the only typographic personality in the system. · `--font-suisse-works-trial`
- **Substitute:** GT Sectra, Tiempos Text, Source Serif Pro
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.5
- **Letter spacing:** -0.038em
- **Role:** Reserved exclusively for the '60 Selected Projects' section label. A serif display face set at 13px with tightened tracking — an anti-type-scale choice that makes a heading read as an editorial caption. This font carries the only typographic personality in the system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.49px | `--text-caption` |
| body | 15px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.2 | — | `--text-subheading` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 55 | 55px | `--spacing-55` |
| 65 | 65px | `--spacing-65` |
| 80 | 80px | `--spacing-80` |
| 98 | 98px | `--spacing-98` |
| 122 | 122px | `--spacing-122` |
| 127 | 127px | `--spacing-127` |
| 136 | 136px | `--spacing-136` |
| 141 | 141px | `--spacing-141` |
| 161 | 161px | `--spacing-161` |
| 190 | 190px | `--spacing-190` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 5px |
| tiles | 5px |
| inputs | 5px |
| buttons | 5px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(90, 50, 40, 0.15) 0px 5px 15px 0px, rgba(80, 40, 30,...` | `--shadow-md` |

### Layout

- **Section gap:** 122px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Project Tile Card
**Role:** Primary content unit — displays one portfolio project

Container with no visible border, 5px radius. Background matches canvas. Contains centered project artwork (no padding around image — image fills tile). Warm brown shadow stack below artwork. Project title in 14px system sans, #333333, left-aligned below tile. 'Design by [studio]' in 14px system sans, #aaaaaa, right-aligned on same line.

### Project Grid
**Role:** Three-column responsive grid of project tiles

3 columns, 20px row gap, ~65px column gap. Tiles are roughly equal width. Grid breathes with 122px top margin from the section header.

### Section Header Label
**Role:** Editorial section marker

13px Suisse Works Trial, #aaaaaa, letter-spacing -0.038em. Left-aligned. Acts as a typographic signature moment — the only place the serif face appears.

### Hero Description Block
**Role:** Centered introductory paragraph at top of page

20px system sans, #4d4d4d, centered, max-width constrained to roughly 600px. Line-height 1.2. No eyebrow, no headline — the paragraph is the hero.

### Minimal Top Navigation
**Role:** Persistent header

Logo (circular 'C' monogram) left, nav links right. No background fill — sits directly on canvas. Links in 14px system sans, #aaaaaa, normal tracking.

### Nav Link
**Role:** Text-only navigation item

14px system sans, #aaaaaa. No underline, no hover background. No visible active state — presence is implied by position.

### Ghost Button
**Role:** Inline action trigger (implied by button color evidence)

5px radius, #f4f3f1 background or transparent, 1px border in #333333 or #4d4d4d. 14–15px system sans text in #333333. No fill, no shadow — pure outline.

### Image Container
**Role:** Artwork presentation within a project tile

No padding, image fills the tile edge-to-edge. The warm brown shadow lifts it off the canvas. 5px radius corners on the tile and on the image.

## Do's and Don'ts

### Do
- Use #f4f3f1 as the only background color for page, cards, and inputs — never introduce a pure white or pure gray
- Use 5px border-radius uniformly for buttons, inputs, cards, and tiles — do not mix in larger radii
- Use the warm brown shadow stack (rgba(90,50,40,0.15) + rgba(80,40,30,0.1)) only beneath artwork and imagery — never on text blocks or nav
- Use 20px for element gaps and 122px for section gaps to maintain the spacious gallery rhythm
- Use Suisse Works (or a serif substitute) at 13px with -0.038em tracking for editorial section labels — never larger than 13px
- Use #aaaaaa for all borders, dividers, and attribution text — let hierarchy come from spacing, not weight
- Keep the palette to the six neutral tokens — no brand color, no semantic hue, no accent

### Don't
- Do not introduce any chromatic color — no blues, greens, reds, or purples anywhere in the system
- Do not use cool gray shadows — the shadow tone must stay warm (brown undertone) or be omitted entirely
- Do not set Suisse Works above 13px — it is a caption face, not a heading face
- Do not use card padding around project artwork — the image must fill the tile to the edges
- Do not use borders to separate cards from the canvas — rely on shadow and the #f4f3f1 surface tone instead
- Do not use bold weights — the system is 400 across the board, hierarchy comes from size and color only
- Do not use uppercase, letter-spacing on body text, or decorative type treatments — restraint is the identity

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f4f3f1` | Base page background — warm bone-white |
| 1 | Card Surface | `#dddddd` | Slightly lifted surface for project tile containers |
| 2 | Elevated Tile | `#f4f3f1` | Project artwork sits on canvas-tinted surface, separated by warm brown shadow |

## Elevation

- **Project tile artwork:** `0 5px 15px rgba(90, 50, 40, 0.15), 0 4px 8px rgba(80, 40, 30, 0.1)`

## Imagery

Photography and product screenshots are the visual content. Project tiles display high-quality web/photography artwork (sunsets, editorial portraits, aerial drone shots, brand identity spreads) presented as flat rectangular images with 5px corners. No illustrations, no abstract graphics, no icons in the UI. The logo monogram is the only graphic mark. Artwork is presented as-is — no duotones, no overlays, no color grading treatment. Images occupy roughly 40% of total visual space, balanced by generous negative space and large gutters.

## Layout

Full-bleed layout with no max-width container — content stretches to viewport edges. Top bar is minimal: circular monogram left, two text links right. Hero is a centered single-paragraph block, vertically positioned in the upper third. Below the hero is a large section gap (122px), then a tiny section label left-aligned, followed by a 3-column project grid with 20px row gap and ~65px column gap. Project tiles are roughly 33% viewport width each, with artwork filling the tile and metadata in a single line below (title left, designer credit right). The grid is the dominant page pattern — repetitive, rhythmic, gallery-like. Navigation does not persist as a heavy bar; it sits featherlight at the top with no background fill.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #333333 (primary), #4d4d4d (body), #aaaaaa (muted/borders)
- background: #f4f3f1 (canvas), #dddddd (card lift)
- border: #aaaaaa
- shadow: rgba(90, 50, 40, 0.15) + rgba(80, 40, 30, 0.1) — warm brown only
- primary action: no distinct CTA color

EXAMPLE COMPONENT PROMPTS
1. Project Tile: full-bleed image, 5px radius corners, warm brown shadow stack (0 5px 15px rgba(90,50,40,0.15), 0 4px 8px rgba(80,40,30,0.1)). Below image: 14px system sans, project title left in #333333, 'Design by [name]' right in #aaaaaa, on one line. 20px gap to next row.

2. Section Header: 13px Suisse Works Trial (or Source Serif Pro substitute), #aaaaaa, letter-spacing -0.038em, left-aligned. Sits 122px above its content block.

3. Hero Description: 20px system sans, #4d4d4d, centered, line-height 1.2, max-width ~600px. No headline above, no button below — just the paragraph.

4. Ghost Button: 5px radius, 1px border #333333, transparent fill, 14px system sans text #333333, 10px vertical / 15px horizontal padding. No shadow, no fill state.

5. Minimal Nav Bar: logo monogram (16px circle outline) left, two 14px system sans text links right in #aaaaaa. No background, no border, no shadow. Sits on #f4f3f1 canvas.

## Achromatic Discipline

This system deliberately excludes all chromatic color. The 0% colorfulness is not a limitation — it is the identity. Every interface decision is resolved through neutrals, spacing, and one serif accent. Any addition of brand color, accent hue, or semantic color (green for success, red for error) would break the system's coherence. The warm brown shadow is the only place the palette permits chromatic warmth, and even that is sub-15% opacity, readable as warmth rather than color.

## Similar Brands

- **Studio Snny** — Same achromatic-only portfolio approach with large white space, tiny gray labels, and project grid as the primary layout
- **Rauno Freiberg** — Extreme minimal monochrome portfolio on warm off-white canvas with hairline navigation and generous gutters
- **Tobias van Schneider** — Austere light-mode personal site with bone-white background, no brand color, and grid-based project presentation
- **Manual Studio** — Editorial agency portfolio using generous spacing, tiny serif labels, and project tiles with subtle warm shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-canvas: #f4f3f1;
  --color-ink: #333333;
  --color-graphite: #4d4d4d;
  --color-slate: #666666;
  --color-ash: #aaaaaa;
  --color-mist: #dddddd;

  /* Typography — Font Families */
  --font-system-ui-apple-system-sans-serif: 'system-ui, -apple-system, sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-works-trial: 'Suisse Works Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.49px;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-55: 55px;
  --spacing-65: 65px;
  --spacing-80: 80px;
  --spacing-98: 98px;
  --spacing-122: 122px;
  --spacing-127: 127px;
  --spacing-136: 136px;
  --spacing-141: 141px;
  --spacing-161: 161px;
  --spacing-190: 190px;

  /* Layout */
  --section-gap: 122px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 5px;

  /* Named Radii */
  --radius-cards: 5px;
  --radius-tiles: 5px;
  --radius-inputs: 5px;
  --radius-buttons: 5px;

  /* Shadows */
  --shadow-md: rgba(90, 50, 40, 0.15) 0px 5px 15px 0px, rgba(80, 40, 30, 0.1) 0px 4px 8px 0px;

  /* Surfaces */
  --surface-canvas: #f4f3f1;
  --surface-card-surface: #dddddd;
  --surface-elevated-tile: #f4f3f1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-canvas: #f4f3f1;
  --color-ink: #333333;
  --color-graphite: #4d4d4d;
  --color-slate: #666666;
  --color-ash: #aaaaaa;
  --color-mist: #dddddd;

  /* Typography */
  --font-system-ui-apple-system-sans-serif: 'system-ui, -apple-system, sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-works-trial: 'Suisse Works Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.49px;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-55: 55px;
  --spacing-65: 65px;
  --spacing-80: 80px;
  --spacing-98: 98px;
  --spacing-122: 122px;
  --spacing-127: 127px;
  --spacing-136: 136px;
  --spacing-141: 141px;
  --spacing-161: 161px;
  --spacing-190: 190px;

  /* Border Radius */
  --radius-md: 5px;

  /* Shadows */
  --shadow-md: rgba(90, 50, 40, 0.15) 0px 5px 15px 0px, rgba(80, 40, 30, 0.1) 0px 4px 8px 0px;
}
```
