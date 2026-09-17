# Ableton — Style Reference
> Editorial workshop on stark white. White paper, black Futura, one blue pen mark for interactivity, photography clipped flush to the edges like magazine spreads.

**Theme:** light

Ableton's visual system reads like a working studio's editorial wall: stark white canvas, Futura PT geometry, and one confident blue that marks every interactive text. The site is text-first and almost ruthlessly flat — no shadows, no rounded corners, no decorative chrome — letting photography of musicians, hardware, and software do the emotional work. Color appears as small functional punctuation: a vivid blue for links, plus coral and teal tag fills that categorize content without softening it. Navigation is a thin top bar of monospace-feeling product names. The overall feel is that of a well-set technical manual that happens to be beautiful — information density carried by typography and image, not by container design.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, nav labels, logo, icon strokes, and every text-level heading — sets the full information hierarchy |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surface, and hero overlay text — the default background for almost every screen |
| Fog | `#eeeeee` | `--color-fog` | Subtle form inputs, tag surfaces, and quiet secondary panel backgrounds — barely-there neutral |
| Signal Blue | `#0000ff` | `--color-signal-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Coral | `#ff8389` | `--color-coral` | Category tag fills (Downloads, News) — flat rectangular badges that classify content without padding the layout |
| Teal | `#00d2be` | `--color-teal` | Category tag fills (Tutorials, Videos) — flat rectangular badges paired with coral to split content taxonomy visually |

## Tokens — Typography

### futura-pt — The single typeface powering everything from body copy to 90px display headlines. Futura PT's geometric precision mirrors Ableton's grid-based music software — the type and the product share a visual logic. Weight 700 carries headlines, 400 carries body. No serif, no monospace secondary face — the system stays mono-typographic. · `--font-futura-pt`
- **Substitute:** Futura PT Bold, Futura PT Book → free substitutes: Jost* (geometric grotesque) or Avenir Next; for closer match try ITC Avant Garde Gothic
- **Weights:** 400, 700
- **Sizes:** 14px, 16px, 20px, 24px, 30px, 40px, 90px
- **Line height:** 1.00–1.50
- **Letter spacing:** normal
- **OpenType features:** `"kern"`
- **Role:** The single typeface powering everything from body copy to 90px display headlines. Futura PT's geometric precision mirrors Ableton's grid-based music software — the type and the product share a visual logic. Weight 700 carries headlines, 400 carries body. No serif, no monospace secondary face — the system stays mono-typographic.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 21 | — | `--text-caption` |
| body | 16px | 24 | — | `--text-body` |
| subheading | 20px | 30 | — | `--text-subheading` |
| heading-sm | 24px | 33.6 | — | `--text-heading-sm` |
| heading | 30px | 36 | — | `--text-heading` |
| heading-lg | 40px | 48 | — | `--text-heading-lg` |
| display | 90px | 90 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |
| 203 | 203px | `--spacing-203` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 0px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Thin white bar, height ~48px. Left: Ableton wordmark icon (vertical-line glyph). Center-left: product names (Live, Push, Move, Note, Link, Shop, Packs, Help, More +) in 14px Futura PT weight 400 black, separated by 20–24px horizontal gap. Right: 'Try Live 12 for free' link in #0000ff, then 'Log in or register' in #0000ff, each at 14px. No background fill change on hover, no borders.

### Full-Bleed Hero with Photo Scrim
**Role:** Above-the-fold announcement

Full-viewport-width photograph (laptop on patterned rug) with a dark semi-transparent overlay. Headline in 90px Futura PT weight 400 white, line-height 1.00, positioned at left ~8% from edge. Subhead/CTA link 'Learn more >' in 14px white beneath. No box around the text — the scrim and white type are the entire component. Edge-to-edge photography with no rounded corners.

### Section Header with Filter Bar
**Role:** Content section introduction

Left-aligned 'The latest from Ableton' in 30px weight 400 black. Right-aligned filter links (All posts, Artists, News, Downloads, Tutorials, Videos, Loop) in 14px #0000ff, horizontally separated by ~16px gaps. The two elements sit on a single baseline-aligned row, no divider between them.

### Content Card (Grid Item)
**Role:** Blog post or video entry in 3-column grid

Rectangular card, 0px border-radius, 0px border, 0px shadow. Structure top-to-bottom: full-width contained image (aspect ~16:10, no rounding), then a category tag (see Category Tag), then the title in 20px weight 400 black. Cards in a 3-column grid with ~20px horizontal and ~40px vertical gap. No card background fill — cards sit directly on the white canvas.

### Category Tag
**Role:** Content classification badge

Filled rectangle, 0px border-radius, ~2px vertical and ~8px horizontal padding. Two color variants: coral #ff8389 (Downloads, News) and teal #00d2be (Tutorials, Videos). Label text in ~12–14px Futura PT weight 400, color #000000. Tags are flat, non-interactive, non-removable.

### Inline Text Link
**Role:** Default clickable text

14–16px Futura PT weight 400 #0000ff, no underline by default. Hover state adds underline. Often followed by a right-pointing chevron character '>' to signal destination. Used for all primary navigation and in-content references.

### Overlay Text Link (on dark scrim)
**Role:** Link variant on photographic backgrounds

White #ffffff text at 14px weight 400, paired with '>' chevron. Sits directly on darkened image without a background fill. Used for hero CTAs and overlay actions.

### Filter Link (Section)
**Role:** Content category filter

14px Futura PT weight 400 in #0000ff when active, #000000 when inactive. No pill, no background fill, no underline. Arranged inline with even gaps. Selection communicated purely through color.

### Image Thumbnail (Tutorial Card)
**Role:** Visual entry into video content

Full-bleed rectangular image within a 3-column grid card, 0px border-radius, no border. Aspect ratio approximately 16:9. Acts as the entire card surface — no padding, no frame.

### Logo Glyph
**Role:** Brand mark in navigation

Ableton 'Live' mark: a series of vertical black bars of varying heights, evoking a DAW track header or audio meters. Rendered at ~24px height in the nav. No wordmark beside it — the glyph alone is the brand.

### Horizontal Section Divider
**Role:** Implicit separation between content zones

Not a drawn rule — separation comes from ~80px vertical whitespace between sections and the change in heading typography. The page flows without visible borders.

## Do's and Don'ts

### Do
- Use Futura PT for all text — never introduce a secondary typeface
- Set every border-radius to 0px — the system is sharp, angular, and grid-faithful
- Use #0000ff exclusively for link text, active nav, and interactive text — no other blue
- Reach for coral #ff8389 and teal #00d2be only as category tag fills, never as backgrounds or text colors
- Let the page be flat: no shadows, no borders, no fills on cards — let whitespace and type do the work
- Use 90px weight 400 white for hero overlay text, not weight 700 — the light weight on bold imagery is the signature
- Set body line-height to 1.50 and display line-height to 1.00 — the contrast between breathing body and tight display is intentional

### Don't
- Do not add box-shadows or elevation to any component — the system is deliberately flat
- Do not round corners on cards, tags, buttons, or inputs — keep 0px everywhere
- Do not use coral or teal for buttons, CTAs, or interactive text — they are taxonomy-only
- Do not call #0000ff a 'CTA color' — it is a link color used for interactive text, not filled buttons
- Do not introduce gradient backgrounds — the system is solid color and photography only
- Do not add icons, illustrations, or decorative graphics — photography and type carry the visual load
- Do not set body text below 14px or use a weight other than 400 for body copy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Primary page canvas and card surface |
| 2 | Fog | `#eeeeee` | Recessed form input fields and occasional quiet panel fills |

## Imagery

Photography dominates the visual system — no illustrations, no 3D renders, no abstract graphics. The hero uses a full-bleed environmental shot (laptop on patterned rug, musician at workstation) with a dark scrim and white overlaid type. Grid content cards use contained 16:10 or 16:9 photographs — musicians in studios, hardware close-ups, software UI captures, domestic creative spaces. Photography is warm, natural-lit, candid rather than staged; people are shown making, not performing. The product itself (the software, controllers like Push) appears in context rather than as isolated hero shots. Photography edges are sharp, un-masked, flush to container boundaries — no rounded corners, no soft drop shadows behind images. Icons are absent except for the brand glyph and minimal interface controls.

## Layout

The page model is full-bleed for hero and footer zones, contained to ~1200px for content sections. The hero is a full-viewport-width photographic band with left-aligned white type overlay. Content sections sit on white with generous ~80px vertical breathing room between them. The 3-column card grid is the dominant content pattern, used for blog posts, tutorial videos, and featured content. Card titles are left-aligned, category tags sit flush left above the title. The top navigation is a single thin horizontal bar — no mega-menu, no sidebar, no sticky behavior visible beyond standard. Section transitions rely on whitespace rather than dividers, background changes, or visual breaks. The overall rhythm is: bold photographic hero → quiet white editorial sections → 3-column grid repeat. The design favors a left-to-right, top-to-bottom reading flow with no overlapping or asymmetric compositions.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border: none (0px everywhere)
- link/interactive text: #0000ff
- tag fill A: #ff8389 (coral)
- tag fill B: #00d2be (teal)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a full-bleed hero: a photograph (musician at studio desk) fills the entire viewport width, with a dark semi-transparent scrim overlay. Headline at 90px futura-pt weight 400 white, line-height 1.00, positioned at left ~8% from edge, sits on the scrim. A white inline link 'Learn more >' at 14px weight 400 sits directly below the headline, 0px border-radius, no background, no underline.

2. Create a content section: white #ffffff background, max-width 1200px centered, 80px vertical padding above and below. Section heading at 30px futura-pt weight 400 #000000, left-aligned. To the right on the same baseline, filter links at 14px #0000ff separated by 16px gaps.

3. Create a 3-column card grid: three cards per row, 20px horizontal gap, 40px vertical gap. Each card has 0px border-radius, 0px border, no shadow, no background fill. Top of card: full-width 16:10 photograph (contained, sharp edges). Below: a flat tag rectangle (0px radius, #ff8389 or #00d2be fill, 2px 8px padding, #000000 text at 12px). Below tag: title at 20px weight 400 #000000.

4. Create a top navigation bar: white background, 48px height, full width. Left: Ableton glyph icon (vertical black bars) at 24px height. Beside it: product names (Live, Push, Move, Note, Link, Shop, Packs, Help, More +) in 14px futura-pt weight 400 #000000, 20px gap between items. Right-aligned: 'Try Live 12 for free' in 14px #0000ff, then 16px gap, then 'Log in or register' in 14px #0000ff. No borders, no fills, no hover backgrounds.

5. Create a category tag: 0px border-radius rectangle, 2px vertical padding, 8px horizontal padding, fill #ff8389 (or #00d2be for the second category), text at 12px futura-pt weight 400 #000000. No border, no shadow, no hover state.

## Similar Brands

- **Native Instruments** — Same monochrome editorial approach with photography-first content cards, flat layout, and a single accent color for interactive text
- **Teenage Engineering** — Same sharp-cornered zero-radius aesthetic, Futura-adjacent geometric type, and reliance on product-in-context photography over decorative chrome
- **Moog Music** — Same stark-white-canvas editorial feel with bold geometric type, category-color taxonomy tags, and full-bleed photography of musicians at work
- **Bandcamp** — Same text-driven, no-decoration layout philosophy with 3-column content grids and category-based color coding for tags

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #eeeeee;
  --color-signal-blue: #0000ff;
  --color-coral: #ff8389;
  --color-teal: #00d2be;

  /* Typography — Font Families */
  --font-futura-pt: 'futura-pt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 21;
  --text-body: 16px;
  --leading-body: 24;
  --text-subheading: 20px;
  --leading-subheading: 30;
  --text-heading-sm: 24px;
  --leading-heading-sm: 33.6;
  --text-heading: 30px;
  --leading-heading: 36;
  --text-heading-lg: 40px;
  --leading-heading-lg: 48;
  --text-display: 90px;
  --leading-display: 90;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-203: 203px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 0px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #eeeeee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #eeeeee;
  --color-signal-blue: #0000ff;
  --color-coral: #ff8389;
  --color-teal: #00d2be;

  /* Typography */
  --font-futura-pt: 'futura-pt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 21;
  --text-body: 16px;
  --leading-body: 24;
  --text-subheading: 20px;
  --leading-subheading: 30;
  --text-heading-sm: 24px;
  --leading-heading-sm: 33.6;
  --text-heading: 30px;
  --leading-heading: 36;
  --text-heading-lg: 40px;
  --leading-heading-lg: 48;
  --text-display: 90px;
  --leading-display: 90;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-203: 203px;
}
```
