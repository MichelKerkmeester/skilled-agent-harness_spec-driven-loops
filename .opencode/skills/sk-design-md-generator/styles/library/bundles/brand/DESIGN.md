# Brand — Style Reference
> Chromatic graph paper atlas — a living brand specimen where every color block, headline, and border snaps to an invisible modular grid printed on white.

**Theme:** light

Dropbox Brand Guidelines uses a Swiss-editorial visual system: a white graph-paper canvas with thin gray grid lines that organizes the entire page into discrete cells, each capable of holding either type or a flat color block. Headlines are tight-tracked, heavy sans-serif set in Dropbox Blue (#0061fe) that bleeds into the grid as confident editorial type, while a curated palette of eight vivid swatches — tangerine, sky cyan, sun yellow, lime, coral, lavender, magenta, slate — populates large rectangular panels that act as both color documentation and page furniture. The system feels like a living style guide: the grid IS the layout, color blocks ARE the content, and every element snaps to the modular lattice. The only radius is 8px, the shadows are absent, and the typographic discipline is total.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Dropbox Blue | `#0061fe` | `--color-dropbox-blue` | Primary text, link borders, icon strokes, heading type, outlined action borders — the single most defining chromatic element, used wherever the brand needs to speak |
| Dropbox Light | `#5f9dff` | `--color-dropbox-light` | Soft surface washes, decorative icon accents, and secondary blue fields — a desaturated companion to Dropbox Blue for large background panels |
| Sun Yellow | `#fad24b` | `--color-sun-yellow` | Brand palette swatch, large color block panels, decorative fills |
| Tangerine | `#ff8c19` | `--color-tangerine` | Brand palette swatch, full-bleed color block panels, accent fills |
| Sky Cyan | `#3dd3ee` | `--color-sky-cyan` | Brand palette swatch, full-bleed color block panels, illustration accent |
| Lime | `#b4dc19` | `--color-lime` | Brand palette swatch, large color block panels, accent fills |
| Coral | `#ffafa5` | `--color-coral` | Brand palette swatch, warm color block panels, accent surfaces |
| Lavender | `#c8aff0` | `--color-lavender` | Brand palette swatch, soft color block panels, illustration accent |
| Magenta | `#892055` | `--color-magenta` | Brand palette swatch, deep accent panels, editorial accent |
| Slate Navy | `#283750` | `--color-slate-navy` | Brand palette swatch, dark accent panels, editorial contrast |
| Ink | `#1e1919` | `--color-ink` | Primary body text, hairline borders, structural dividers, nav type — the near-black workhorse of the grid system |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, reverse text on color blocks, background beneath the visible grid |
| Graphite | `#736c64` | `--color-graphite` | Muted secondary text, subtle helper labels, low-emphasis borders |

## Tokens — Typography

### Dbsharpgroteskvariable Vf — Display and heading type — tight-tracked, geometric grotesque at heavy weights. The 0.80 line-height at 34px is a compression device for editorial taglines where lines almost touch, creating a block-of-text effect. Free substitute: Inter at 700, or Space Grotesk Bold. · `--font-dbsharpgroteskvariable-vf`
- **Substitute:** Space Grotesk Bold or Inter 700
- **Weights:** 500, 700
- **Sizes:** 30px, 34px, 36px
- **Line height:** 0.80, 1.20
- **Letter spacing:** -0.02em (-0.6px at 30px, -0.68px at 34px, -0.72px at 36px)
- **Role:** Display and heading type — tight-tracked, geometric grotesque at heavy weights. The 0.80 line-height at 34px is a compression device for editorial taglines where lines almost touch, creating a block-of-text effect. Free substitute: Inter at 700, or Space Grotesk Bold.

### Atlasgrotesk Web — Body copy, navigation labels, link text, button labels, and all utility type. Neutral grotesque at compact sizes — 14px at line-height 1.67 gives breathing room for readable paragraphs while 12px at 1.43 keeps metadata tight. Free substitute: Inter or Atlas Grotesk via Adobe Fonts. · `--font-atlasgrotesk-web`
- **Substitute:** Inter or Atlas Grotesk
- **Weights:** 400, 500
- **Sizes:** 12px, 14px
- **Line height:** 1.43, 1.57, 1.67
- **Letter spacing:** normal
- **Role:** Body copy, navigation labels, link text, button labels, and all utility type. Neutral grotesque at compact sizes — 14px at line-height 1.67 gives breathing room for readable paragraphs while 12px at 1.43 keeps metadata tight. Free substitute: Inter or Atlas Grotesk via Adobe Fonts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 17 | — | `--text-caption` |
| body | 14px | 23 | — | `--text-body` |
| heading-sm | 30px | 36 | -0.6px | `--text-heading-sm` |
| heading | 34px | 27 | -0.68px | `--text-heading` |
| heading-lg | 36px | 43 | -0.72px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| buttons | 8px |
| all-elements | 8px |
| color-blocks | 8px |

### Layout

- **Section gap:** 64px
- **Card padding:** 22-24px
- **Element gap:** 16px

## Components

### Grid Canvas
**Role:** Structural background

White (#ffffff) page with visible thin gray grid lines forming a modular lattice. Grid cells define all content placement. The grid is the layout — there is no separate container system.

### Color Block Panel
**Role:** Large chromatic content surface

Full-bleed flat color rectangle snapped to grid cells. Background fills with a single brand palette color (Tangerine #ff8c19, Sky Cyan #3dd3ee, Dropbox Blue #0061fe, Sun Yellow #fad24b, etc.). 8px border-radius. Contains white reverse-type text or sits empty as visual punctuation. No border, no shadow.

### Editorial Headline Block
**Role:** Primary heading display

Bold type in Dbsharpgroteskvariable Vf at 30-36px, weight 700, color Dropbox Blue (#0061fe), letter-spacing -0.02em. Left-aligned within a white grid cell. No decorative elements — the grid lines frame the type.

### Inverted Text Panel
**Role:** White text on color

White (#ffffff) body text in Atlasgrotesk Web 14px, line-height 1.67, placed inside a Color Block Panel. Creates a color/text duality where the panel is both a color swatch and a readable surface.

### Hairline Divider
**Role:** Structural separator

1px line in Ink (#1e1919). Used to define grid cell boundaries, section separations, and content edges. The dominant border treatment — appears with freq=300 in border contexts.

### Text Link
**Role:** Inline navigation

Atlasgrotesk Web 14px weight 500, color Dropbox Blue (#0061fe). Often with a 1px bottom border in the same color. The 8px border-radius applies to link containers if wrapped in a button-like element.

### Outlined Action
**Role:** Primary call-to-action border

Ghost/outlined button: transparent background, 1px border in Dropbox Blue (#0061fe), text in Dropbox Blue. 8px border-radius, 12-16px padding. This is the only CTA pattern — the system never uses filled buttons.

### Nav Label
**Role:** Navigation text

Atlasgrotesk Web 12px, weight 500, color Ink (#1e1919). Sits within 8px vertical and 14px horizontal padding containers. Compact, utility-scale type.

### Brand Mark
**Role:** Logo/identity anchor

The Dropbox glyph in Dropbox Blue (#0061fe) — the four-triangle box mark. Appears at the bottom-left of the grid as a constant identity anchor.

### Chevron Scroll Indicator
**Role:** Scroll affordance

Down-chevron icon in Atlasgrotesk Web or as an SVG stroke, positioned at the bottom-right of the grid. Single visual cue that more content exists below.

### Color Swatch Cell
**Role:** Brand palette documentation

Small rectangular fill in one of the ten brand palette colors (Sun Yellow, Lime, Tangerine, Sky Cyan, Coral, Lavender, Magenta, Slate Navy, Dropbox Blue, Dropbox Light). Functions both as documentation of the palette and as inline color samples within grid cells.

## Do's and Don'ts

### Do
- Use #0061fe for all primary headlines, link text, and outlined action borders — it is the voice of the brand
- Apply -0.02em letter-spacing to all display type at 30px and above; the tight tracking is what makes the headings feel custom and editorial
- Snap every element to the visible grid — color blocks, text, and whitespace all respect the modular lattice
- Use 8px border-radius universally for all cards, buttons, and color panels — the only radius in the system
- Use 1px hairline borders in Ink (#1e1919) for all structural dividers and grid cell edges
- Deploy large flat color blocks (full grid cells filled with Sun Yellow, Tangerine, Sky Cyan, etc.) as section furniture — color is both content and layout
- Set body text at 14px with line-height 1.67 for comfortable paragraph density

### Don't
- Never add drop shadows or box-shadow effects — the grid and flat color provide all visual structure
- Never use border-radius values other than 8px — the system is geometric, not pill-shaped or fully rounded
- Never use filled solid-color CTA buttons — all actions are outlined with a #0061fe border
- Never center body or heading text — all type is left-aligned within its grid cell
- Never use more than 4 brand palette colors on a single section — over-saturation breaks the editorial discipline
- Never add gradients — the palette is entirely flat, saturated, and singular
- Never use colors outside the defined 13-color palette (2 blues, 8 brand swatches, 3 neutrals) for UI elements

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#ffffff` | Base page background with visible grid lines printed on top |
| 1 | Color Block Panels | `#0061fe` | Full-saturation color panels sitting on the grid as content blocks |
| 2 | Elevated Grid Cells | `#ffffff` | White cells within the grid for reverse-type headlines |

## Elevation

Zero shadows. The system relies entirely on the visible grid, flat color blocks, and 1px hairline borders in Ink (#1e1919) to create depth and separation. Elevation is achieved by the physical layering of grid cells and color panels, never by drop shadows or blur.

## Imagery

Minimal to no photography or illustration. The visual language is entirely UI-as-imagery: large flat color blocks function as graphic elements, the visible grid itself becomes a pattern, and the typographic treatment carries the visual weight. When brand illustrations exist (like the Dropbox glyph), they are flat, geometric, and brand-blue. No product screenshots, no lifestyle photography, no 3D renders — the system communicates through type, color, and structural grid alone.

## Layout

Full-bleed grid-based layout with no max-width container. The entire page is a visible modular grid of thin gray lines on white, dividing the viewport into rectangular cells. Content is composed by placing text, color blocks, and UI elements into individual grid cells rather than into traditional section containers. The hero is an editorial headline set in the upper-left grid cell in Dropbox Blue. The second section demonstrates the system with three large color block panels (Tangerine on left, Dropbox Blue center with white reverse text, Sky Cyan on right) each spanning multiple grid units. Navigation sits at the bottom edge. The pattern repeats vertically — each section is a new grid composition rather than a stacked container.

## Agent Prompt Guide

**Quick Color Reference:**
- Text: #1e1919 (Ink) for body, #0061fe (Dropbox Blue) for headings and links
- Background: #ffffff (Paper) for canvas, #5f9dff (Dropbox Light) for soft blue surfaces
- Border: #1e1919 (Ink) for hairlines, #0061fe (Dropbox Blue) for outlined actions
- Accent palette: #fad24b Sun Yellow, #ff8c19 Tangerine, #3dd3ee Sky Cyan, #b4dc19 Lime, #ffafa5 Coral, #c8aff0 Lavender, #892055 Magenta, #283750 Slate Navy
- primary action: #0061fe (outlined action border)

**3-5 Example Component Prompts:**

1. **Editorial Headline Block:** Create a left-aligned heading inside a white grid cell. Type at 36px in Dbsharpgroteskvariable Vf weight 700, color #0061fe, letter-spacing -0.72px, line-height 1.20. No background, no border, no decoration — the grid lines frame the type.

2. **Outlined Action Button:** Build a ghost button with transparent background, 1px solid border in #0061fe, text in #0061fe at 14px Atlasgrotesk Web weight 500. 8px border-radius. 12px vertical padding, 16px horizontal padding.

3. **Color Block Panel with Inverted Text:** Create a full grid cell filled with #ff8c19 (Tangerine). 8px border-radius. Inside, set white (#ffffff) body text at 14px Atlasgrotesk Web weight 400, line-height 1.67, left-aligned with 22-24px padding from cell edges.

4. **Brand Swatch Cell:** A rectangular element filled with one of the eight accent colors (e.g., #fad24b Sun Yellow). 8px border-radius. No text, no border, no shadow. Functions as a flat color sample within the grid composition.

5. **Grid Canvas Section:** A full-width section with #ffffff background. Overlay a visible grid of 1px lines in #1e1919 at low opacity (use rgba(30,25,25,0.08)). All content elements — text, color blocks, buttons — snap to this grid. No container boxes; the grid itself defines placement.

## Similar Brands

- **Figma Brand Resources** — Same grid-based brand specimen page where color blocks and type are presented as editorial content on a white lattice
- **IBM Design Language** — Same editorial discipline — heavy tight-tracked grotesque headings in brand color, flat color swatch panels, zero shadow reliance, geometric 8px-radius system
- **Notion Brand Guidelines** — Similar white-canvas approach with single brand color for type, modular block-based content, and minimal radius values
- **Vercel Design** — Same flat color block content sections, tight-tracked geometric headings, and grid-driven layout without container cards
- **Spotify Design (former brand site)** — Same pattern of large flat color rectangles as content furniture combined with bold editorial type and visible structural grids

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-dropbox-blue: #0061fe;
  --color-dropbox-light: #5f9dff;
  --color-sun-yellow: #fad24b;
  --color-tangerine: #ff8c19;
  --color-sky-cyan: #3dd3ee;
  --color-lime: #b4dc19;
  --color-coral: #ffafa5;
  --color-lavender: #c8aff0;
  --color-magenta: #892055;
  --color-slate-navy: #283750;
  --color-ink: #1e1919;
  --color-paper: #ffffff;
  --color-graphite: #736c64;

  /* Typography — Font Families */
  --font-dbsharpgroteskvariable-vf: 'Dbsharpgroteskvariable Vf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlasgrotesk-web: 'Atlasgrotesk Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 17;
  --text-body: 14px;
  --leading-body: 23;
  --text-heading-sm: 30px;
  --leading-heading-sm: 36;
  --tracking-heading-sm: -0.6px;
  --text-heading: 34px;
  --leading-heading: 27;
  --tracking-heading: -0.68px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 43;
  --tracking-heading-lg: -0.72px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 22-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-buttons: 8px;
  --radius-all-elements: 8px;
  --radius-color-blocks: 8px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-color-block-panels: #0061fe;
  --surface-elevated-grid-cells: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-dropbox-blue: #0061fe;
  --color-dropbox-light: #5f9dff;
  --color-sun-yellow: #fad24b;
  --color-tangerine: #ff8c19;
  --color-sky-cyan: #3dd3ee;
  --color-lime: #b4dc19;
  --color-coral: #ffafa5;
  --color-lavender: #c8aff0;
  --color-magenta: #892055;
  --color-slate-navy: #283750;
  --color-ink: #1e1919;
  --color-paper: #ffffff;
  --color-graphite: #736c64;

  /* Typography */
  --font-dbsharpgroteskvariable-vf: 'Dbsharpgroteskvariable Vf', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlasgrotesk-web: 'Atlasgrotesk Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 17;
  --text-body: 14px;
  --leading-body: 23;
  --text-heading-sm: 30px;
  --leading-heading-sm: 36;
  --tracking-heading-sm: -0.6px;
  --text-heading: 34px;
  --leading-heading: 27;
  --tracking-heading: -0.68px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 43;
  --tracking-heading-lg: -0.72px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;

  /* Border Radius */
  --radius-lg: 8px;
}
```
