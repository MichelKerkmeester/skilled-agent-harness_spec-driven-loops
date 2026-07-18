# Andrei Rybin — Style Reference
> monochrome atelier notebook — a designer's sketchbook where phone screens are pinned like contact sheets on a white wall

**Theme:** light

A monochrome atelier notebook: a near-pure black-on-white canvas where the only visual event is typography against a generous grid of project tiles. Every surface is paper-white; every element either ink-black or a single shade of graphite for secondary information — there is no accent color, no gradient, no fill that isn't neutral. Components are stripped to their function: a pill-shaped label names the work, a circular arrow button invites the next view, thin 1px borders quietly separate sections. The product is the showcase, so the system recedes — the phone mockups carry all the visual weight while the framework stays silent.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, image holders — the dominant canvas; everything sits on this |
| Ink | `#000000` | `--color-ink` | Primary text, link text, icon strokes, thin section dividers — the only mark-making color |
| Graphite | `#858585` | `--color-graphite` | Secondary text, muted metadata, and softer border lines that recede behind primary ink |
| Stone | `#8e8e90` | `--color-stone` | Cool-toned border and divider strokes for borders that need a hairline without competing with Ink |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Inter — Body copy, project captions, and the larger intro paragraphs. Used at a single weight — regularity IS the signature; no bold headlines shout, no light weight whispers. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', sans-serif
- **Weights:** 400
- **Sizes:** 12px, 24px
- **Line height:** 1.20, 1.23, 1.30
- **Letter spacing:** -0.0170em
- **Role:** Body copy, project captions, and the larger intro paragraphs. Used at a single weight — regularity IS the signature; no bold headlines shout, no light weight whispers.

### system-ui (sans-serif) — Small UI labels, tag text, icon-adjacent microcopy. Appears wherever a single token of body-size type recurs — utility, not statement. · `--font-system-ui-sans-serif`
- **Substitute:** inherit Inter or use system sans
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Small UI labels, tag text, icon-adjacent microcopy. Appears wherever a single token of body-size type recurs — utility, not statement.

### .SFNSText — .SFNSText — detected in extracted data but not described by AI · `--font-sfnstext`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Letter spacing:** -0.017
- **Role:** .SFNSText — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| subheading | 24px | 1.23 | -0.4px | `--text-subheading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 40px |
| cards | 8px |
| icons | 16px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 120px
- **Card padding:** 16px
- **Element gap:** 10px

## Components

### Project Tile Card
**Role:** Container for a single showcase image (phone mockup) with label and navigation arrow

White paper surface, 8px radius, no border, 16px internal padding. A pill label sits top-left at 40px corner radius with 1px Ink border, 10px vertical / 8px horizontal padding, Inter 12px. A 32px circular arrow button with 1px Ink border sits top-right. Caption text (Inter 12px Graphite) sits centered beneath the card with 8px gap.

### Pill Label
**Role:** Project category tag overlaid on each card

Fully rounded capsule (40px radius) on white paper. 1px Ink border, 6px padding top/bottom, 8px padding left/right. Text: Inter 12px, color Ink, letter-spacing -0.0170em.

### Arrow Navigation Button
**Role:** Compact circular control to open a project

32px circle, white fill, 1px Ink border, centered right-pointing arrow icon at 16px radius geometry. No shadow, no fill state — the border is the only affordance.

### Header Bar
**Role:** Top-of-page identity, nav, and social link strip

Full-bleed white band with 16px padding. Four text columns separated by generous white space: name+role (left), showreel link (center-left), social links (center-right), index+about (right). All Inter 12px, Ink, letter-spacing -0.0170em. No dividers between columns — whitespace carries the rhythm.

### Intro Block
**Role:** Two-column intro: contact email on the left, welcome paragraph on the right

40px row gap between the email and the welcome copy. Email is Inter 12px Ink; the welcome paragraph is Inter 24px Graphite at line-height 1.23 — this is the largest type in the system, used exactly once.

### Project Grid
**Role:** Responsive grid of project tiles filling the rest of the page

5 columns at full width, 16px gutters. Each tile occupies a fixed aspect slot (roughly 3:5 portrait). The grid recedes visually — its job is to hold images, not to assert itself.

### Caption Label
**Role:** One-line description under each tile describing the project type

Inter 12px, Graphite (#858585), centered, 8px below the card. Format is 'X → Y' or a short noun phrase.

## Do's and Don'ts

### Do
- Keep the entire interface achromatic — Ink on Paper, with Graphite and Stone for soft hierarchy.
- Use 8px radius for project tiles, 16px for icon containers, 40px (or 9999px) for pill labels and circular buttons.
- Set body and caption type at Inter 12px with -0.0170em letter-spacing; reserve 24px Inter for the single intro paragraph.
- Separate header columns with whitespace alone — no vertical rules or dividers between nav items.
- Use 10px element gap inside cards and 120px section gap between page bands.
- Let image weight carry the page; the system should be invisible behind the work.

### Don't
- Do not introduce any chromatic color — no accent, no brand hue, no semantic state color.
- Do not use multiple font weights — Inter 400 is the only voice; no bold, no light, no italic.
- Do not apply shadows, gradients, or fills to tiles or buttons; borders are the only separator.
- Do not center body text — captions and metadata are left- or context-aligned, not centered except where a tile naturally centers its caption beneath.
- Do not use a border radius below 8px on cards or above 16px on icons — the radii carry the system's softness and must stay consistent.
- Do not add navigation patterns (hamburgers, sidebars, mega-menus); the header is a single text strip.
- Do not break the grid with asymmetric or overlapping tile placements — the grid is the page's structural truth.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Full-page canvas and the back of every card and image tile |
| 2 | Ink Mask | `#000000` | The near-black surfaces that appear inside phone-screen mockups — not a page surface, but defines the photo-to-canvas contrast |

## Elevation

The design uses no shadow, no blur, no z-axis elevation. Depth is implied only by the contrast of Ink on Paper, with 1px borders doing all the work that shadows would do in a richer system. Flatness is the philosophy.

## Imagery

Photography-style product mockups of iPhone screens are the only visual content — tightly cropped, high-contrast, most showing dark UI inside white phone frames. Each card is a portrait-ratio still. No lifestyle photography, no illustrations, no abstract graphics. The phone IS the hero; the system frames it like a contact sheet.

## Layout

Full-bleed page on a white canvas, max-width ~1440px. Header is a single row of four text blocks separated by whitespace (name, showreel, social, index). Below sits a two-column intro: contact email left, welcome paragraph right, separated by 40px gap and generous horizontal space. The main body is a 5-column responsive grid of project tiles at 16px gutters, each tile containing a pill label, a circular arrow button, an image, and a centered caption beneath. Section gap of 120px separates the intro from the grid; the grid itself flows without internal section breaks.

## Agent Prompt Guide

Quick Color Reference
- text: #000000 (Ink)
- background: #ffffff (Paper)
- border: #858585 (Graphite) or #8e8e90 (Stone) for soft rules, #000000 (Ink) for structural borders
- muted text: #858585 (Graphite)
- primary action: no distinct CTA color

Example Component Prompts
1. Header strip: white background, full-bleed within 1440px max-width, 16px padding. Four text items in a single row (left/center-left/center-right/right), all Inter 12px weight 400, color #000000, letter-spacing -0.0170em. No dividers between items — whitespace only.
2. Project tile: white background, 8px border-radius, 16px padding. A pill label at top-left: 40px border-radius, 1px solid #000000 border, 6px padding top/bottom and 8px left/right, text Inter 12px #000000. A 32px circular button at top-right: white fill, 1px solid #000000 border, centered right-arrow icon.
3. Intro block: two columns. Left column: Inter 12px #000000 email link. Right column: Inter 24px #858585, line-height 1.23, letter-spacing -0.4px. 40px row gap between rows.
4. Tile caption: Inter 12px #858585, centered, 8px below the tile card.
5. Project grid: 5 equal columns, 16px column gap, each tile showing an image that fills its slot. No borders, no shadows between tiles.

## Similar Brands

- **Cargo Collective portfolios** — Same monochrome grid-of-tiles approach with generous whitespace and minimal chrome — content is the design.
- **Readymag project pages** — Editorial-grade minimal layouts where typography does all the work and the system disappears behind showcased work.
- **Tobias van Schneider portfolio** — Single-weight type, achromatic palette, and large project tiles arranged in a quiet grid — restraint as a visual language.
- **Linear app marketing pages** — Crisp type, flat surfaces, no decorative gradients, and a strong reliance on whitespace and thin borders to organize content.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-graphite: #858585;
  --color-stone: #8e8e90;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui (sans-serif)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sfnstext: '.SFNSText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.23;
  --tracking-subheading: -0.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 120px;
  --card-padding: 16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-tags: 40px;
  --radius-cards: 8px;
  --radius-icons: 16px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink-mask: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-graphite: #858585;
  --color-stone: #8e8e90;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui (sans-serif)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sfnstext: '.SFNSText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.23;
  --tracking-subheading: -0.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
}
```
