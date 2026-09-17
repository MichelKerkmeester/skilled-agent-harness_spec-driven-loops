# Minimal Collective — Style Reference
> midnight gallery wall

**Theme:** dark

Minimal Collective operates as a pitch-black editorial canvas where every element earns its presence through restraint rather than decoration. A single geometric sans-serif at weight 400 — never heavier — carries all hierarchy; even 77px display headlines whisper instead of shout, with letter-spacing compressed to -0.056em that pulls letters into sculptural, almost overlapping forms. The interface is colorlessly austere: true black #000000 as the void, hairline white borders as the only structural language, and bordered category pills (EDITORIAL, PREMIERE, CULTURE) that function as ghost labels rather than UI affordances. Content arrives as an overlapping photographic mosaic — event documentation, art installations, studio interiors — layered against the black field without shadows, gradients, or card elevation to separate them from the canvas. The aesthetic is closer to a contemporary art publication at midnight than a typical product UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, primary surface, image card backgrounds, footer/header fields |
| Ash | `#5a5a5a` | `--color-ash` | Secondary structural elements, input borders, mid-tone dividers, muted UI chrome |
| Ghost White | `#ffffff` | `--color-ghost-white` | Primary text, heading fills, hairline borders, badge outlines, link strokes |

## Tokens — Typography

### PolySans — Sole typeface. Weight stays at 400 across every size from caption to display — hierarchy is created purely by scale and negative tracking, never by weight contrast. Display sizes (50–77px) use line-height 0.90–1.00 and letter-spacing compressed to -0.044em/-0.056em, pulling characters into tight sculptural forms. Body sits at 14–16px with 1.43 line-height for legibility. The single-weight discipline is the signature: no bold, no italic, no fallback hierarchy — scale is everything. · `--font-polysans`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px, 23px, 27px, 32px, 50px, 77px
- **Line height:** 0.90–1.43
- **Letter spacing:** -0.056em at 77px down to -0.020em at 18px; near-zero below
- **Role:** Sole typeface. Weight stays at 400 across every size from caption to display — hierarchy is created purely by scale and negative tracking, never by weight contrast. Display sizes (50–77px) use line-height 0.90–1.00 and letter-spacing compressed to -0.044em/-0.056em, pulling characters into tight sculptural forms. Body sits at 14–16px with 1.43 line-height for legibility. The single-weight discipline is the signature: no bold, no italic, no fallback hierarchy — scale is everything.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.43 | — | `--text-body` |
| subheading | 18px | 1.2 | -0.36px | `--text-subheading` |
| heading-sm | 23px | 1.2 | -0.67px | `--text-heading-sm` |
| heading | 27px | 1.2 | -0.86px | `--text-heading` |
| heading-lg | 32px | 1 | -1.18px | `--text-heading-lg` |
| display | 50px | 1 | -2.2px | `--text-display` |
| display-xl | 77px | 0.9 | -4.31px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 9 | 9px | `--spacing-9` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 45 | 45px | `--spacing-45` |
| 54 | 54px | `--spacing-54` |
| 144 | 144px | `--spacing-144` |
| 173 | 173px | `--spacing-173` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 4.5px |
| images | 0px |
| buttons | 4.5px |

### Layout

- **Section gap:** 144-173px
- **Card padding:** 18px
- **Element gap:** 14px

## Components

### Top Navigation Bar
**Role:** Persistent site header

Full-width black bar, 14px vertical padding. Logo 

### Hero Headline (Overlapping Image)
**Role:** First-screen editorial statement

Full-viewport black canvas with a single photographic image (e.g. vehicle) positioned behind large display text. Headline at 77px PolySans 400, Ghost White, line-height 0.9, letter-spacing -4.31px. Text overlaps the image rather than stacking above or beside it. Faint concentric arc linework (Ash #5a5a5a, 1px stroke) radiates across the background as the only decoration.

### Scroll Indicator
**Role:** Vertical scroll prompt

Centered 

### Category Badge (Ghost Pill)
**Role:** Editorial taxonomy label

Bordered-only pill: 1px Ghost White border, 4.5px radius, transparent background, 5px vertical / 6px horizontal padding. Label text 14px PolySans 400 Ghost White uppercase (e.g. 

### Image Mosaic Card
**Role:** Featured visual fragment in editorial collage

Full-bleed photograph with 0px radius, no border, no shadow. Overlaps neighboring cards by 10–30px to create a layered editorial spread. Optional title overlay in top-left at 23–32px PolySans 400 Ghost White, and a category badge (e.g. 

### Article Card (Editorial Spread)
**Role:** Long-form content entry

Two-part layout: large photograph (0px radius, full-width of its column) stacked with metadata row (category badges + date at 14px) and title at 27–32px PolySans 400, letter-spacing -0.86 to -1.18px. Excerpt in 16px PolySans 400. No card container, no border, no background — content sits directly on the Obsidian canvas.

### Page Corner Footer Nav
**Role:** Minimal page-level navigation

Two text links anchored to bottom-left (

### Hairline Divider
**Role:** Section separation

1px Ghost White line, full container width, 0px radius. Used sparingly to separate editorial sections; the primary section separator is whitespace (144–173px gaps).

## Do's and Don'ts

### Do
- Use Obsidian #000000 as the sole page background; never introduce a surface tint, gradient, or panel color that differs from the canvas.
- Set every text element to PolySans 400 — never bold, never medium. Create hierarchy only through size, letter-spacing, and line-height.
- Apply negative letter-spacing proportional to size: -4.31px at 77px, -2.2px at 50px, -1.18px at 32px, scaling down to 0 at body sizes.
- Use 4.5px border-radius exclusively for category badges and small interactive pills; keep all image cards and content blocks at 0px radius.
- Layer photographs directly on the Obsidian canvas with 0px radius and no drop shadow — let overlap (10–30px) create spatial relationships, not elevation.
- Build category labels as ghost pills: 1px Ghost White border, transparent fill, 5px/6px padding, 14px uppercase text.
- Maintain section gaps of 144–173px between major editorial blocks; let whitespace do the work that dividers would in a busier system.

### Don't
- Do not introduce any chromatic color — no accent blue, red, or green. The palette is strictly black, ash, and white.
- Do not use bold or semibold weights; PolySans 400 is the only weight permitted across the entire type scale.
- Do not add box-shadows, glows, or any elevation effects — surfaces differentiate through overlap and position, never through shadow.
- Do not round image cards or photographs — 0px radius keeps the editorial-magazine tension. 4.5px is reserved for badges only.
- Do not center body text or use justified text blocks — left-align all editorial copy to preserve the gallery-wall reading rhythm.
- Do not fill buttons or badges with white — they remain ghost/outlined. Filled controls would break the 
- everything is content" principle."
- Do not add icon decoration to category badges, navigation, or scroll indicators — words alone, at the right size, carry the interface.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Field | `#000000` | Full-bleed page canvas extending edge to edge |
| 2 | Ash Inset | `#5a5a5a` | Subtle surface variation for secondary controls and muted elements |

## Elevation

Elevation is entirely absent by design. Spatial relationships emerge from photographic overlap, positional offset, and generous whitespace (144–173px section gaps) — never from shadow, glow, or surface tint. The Obsidian canvas is treated as a single infinite plane; cards, images, and text all sit on it directly. This preserves the gallery-wall metaphor: works are pinned to a black plane, not stacked in a z-axis.

## Imagery

Photography is the dominant visual content — event documentation, art installations, architectural interiors, music studio environments, and street/venue photography. All imagery is full-color, presented unfiltered and uncropped at 0px radius against the black canvas. The treatment is editorial-magazine: overlapping card mosaics rather than uniform grids, with images sometimes extending edge-to-edge and other times sharing space with overlaid display text. No illustrations, no abstract graphics, no 3D renders, no icon systems beyond the single hamburger glyph. The photographs carry all visual weight; the typographic and structural system is deliberately quiet so imagery can speak at full volume.

## Layout

Full-bleed dark canvas with no max-width container; content breaks to the viewport edges. The hero occupies the full first viewport with a centered display headline overlapping a single photographic subject and faint concentric arc linework as background texture. Below the hero, a mosaic of overlapping image cards (10–30px overlap) creates an editorial collage — cards are not constrained to a grid but arranged in an asymmetric, layered composition. The lower section transitions to a structured 2-column editorial spread: large photograph paired with category badges, date, display-weight title (27–32px), and excerpt body. Navigation is radically minimal — a top bar with only logo + hamburger, plus 

## Agent Prompt Guide

primary action: no distinct CTA color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-ash: #5a5a5a;
  --color-ghost-white: #ffffff;

  /* Typography — Font Families */
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.67px;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --tracking-heading: -0.86px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.18px;
  --text-display: 50px;
  --leading-display: 1;
  --tracking-display: -2.2px;
  --text-display-xl: 77px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -4.31px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-45: 45px;
  --spacing-54: 54px;
  --spacing-144: 144px;
  --spacing-173: 173px;
  --spacing-216: 216px;

  /* Layout */
  --section-gap: 144-173px;
  --card-padding: 18px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-md: 4.5px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 4.5px;
  --radius-images: 0px;
  --radius-buttons: 4.5px;

  /* Surfaces */
  --surface-obsidian-field: #000000;
  --surface-ash-inset: #5a5a5a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-ash: #5a5a5a;
  --color-ghost-white: #ffffff;

  /* Typography */
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.67px;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --tracking-heading: -0.86px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.18px;
  --text-display: 50px;
  --leading-display: 1;
  --tracking-display: -2.2px;
  --text-display-xl: 77px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -4.31px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-45: 45px;
  --spacing-54: 54px;
  --spacing-144: 144px;
  --spacing-173: 173px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-md: 4.5px;
}
```
