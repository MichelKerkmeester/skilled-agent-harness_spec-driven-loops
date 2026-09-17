# Nofilter.space — Style Reference
> Brutalist fashion zine on white paper. A disciplined, zero-color editorial grid where every hairline, checkbox, and line break is intentional.

**Theme:** light

Nofilter.space is a brutalist editorial zine printed on white: a fashion-and-architecture publication that treats the page itself as a magazine spread. The entire interface is achromatic — white canvas, a single near-black (#333333) for text and hairlines, and pure black (#000000) for emphasis — so all visual energy flows into the photography and the typographic grid. Typography carries a single custom face (pragmatica, weight 400 only) in five measured sizes, producing a flat, unornamented voice that lets the runway imagery, text, and white space do the storytelling. Components are ruthlessly simple: thin black borders, zero radius, no shadows, no gradients, no accent color. The grid is the design.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#333333` | `--color-ink` | Primary text, all hairlines and card borders, nav links — the workhorse near-black that defines every interface edge |
| Carbon | `#000000` | `--color-carbon` | Badge borders, emphasis strokes, and the darkest accents where pure black is needed against white |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, and inverted text on dark badges — the only true surface tone |

## Tokens — Typography

### pragmatica — The single, exclusive typeface used everywhere at weight 400 only. A neo-grotesque with geometric warmth that reads like editorial print. Headlines (30–35px) use tight leading (~1.14) and the wide gaps in cap-height create a poster-like presence. Body and bylines sit at 15px with generous 1.47 leading. Captions and metadata drop to 12px. The refusal to go bold is the signature: the design speaks in one volume, and the weight of the words comes from the images, not the strokes. · `--font-pragmatica`
- **Substitute:** Suisse Int'l, Graphik, Untitled Sans, Inter
- **Weights:** 400
- **Sizes:** 12px, 15px, 24px, 30px, 35px
- **Line height:** 1.14, 1.17, 1.25, 1.47, 2.50
- **Letter spacing:** normal
- **Role:** The single, exclusive typeface used everywhere at weight 400 only. A neo-grotesque with geometric warmth that reads like editorial print. Headlines (30–35px) use tight leading (~1.14) and the wide gaps in cap-height create a poster-like presence. Body and bylines sit at 15px with generous 1.47 leading. Captions and metadata drop to 12px. The refusal to go bold is the signature: the design speaks in one volume, and the weight of the words comes from the images, not the strokes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 15 | — | `--text-caption` |
| body | 15px | 22 | — | `--text-body` |
| subheading | 24px | 28 | — | `--text-subheading` |
| heading-sm | 30px | 34 | — | `--text-heading-sm` |
| heading | 35px | 40 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 0px |
| cards | 0px |
| badges | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 40-60px
- **Card padding:** 35px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-width white bar. Left: 'FEED' and 'ABOUT' text links. Right: three checkbox-style items ('WORDS', 'PROJECTS', 'REPORTAGE') aligned right, each preceded by a square checkbox outline. All text in pragmatica 400, 12px, #333333, letter-spacing normal. No background, no border, no shadow.

### Wordmark Header
**Role:** Site identity / page title

Giant pragmatica 400 text reading 'NOFILTER. SPACE' (or rotated per section) in #333333, 35px, line-height 1.14. Set left-aligned and spanning the full page width. Functions as both logo and H1 — one line, all caps, period as a deliberate mid-word punctuation. No decorative elements.

### Editorial Card (Image Card)
**Role:** Standard content tile in the feed grid

Image-first tile with no border, no shadow, 0px radius. Below the image: headline in pragmatica 24px #333333, then byline in 12px #333333, then date in 12px #333333. 35px padding-right/left from grid gutters. Images are full-bleed within their column, sharp corners, no cropping mask.

### Bordered Article Card
**Role:** Highlighted/featured story tile

Middle-column featured story variant: a 1px solid #333333 border wrapping the entire card, 35px internal padding. Headline in pragmatica 30px #333333, byline + date below at 12px. No image — text-only panel that punctuates the photo grid with a framed typographic moment.

### Byline + Date Stamp
**Role:** Article metadata

Two lines, pragmatica 400, 12px, #333333. Format: 'by [Author Name]' on one line, '[Month Day, Year]' on the next. Left-aligned under the headline. No dividers, no icons, no color.

### Nav Checkbox Link
**Role:** Filter / category toggle in nav

Inline pair: a 1px #333333 square outline (~10–12px) followed by the category label in pragmatica 12px #333333. Spacing 20px between groups. Reads like a form checkbox rather than a chip — part of the editorial-as-document conceit.

### Headline Link
**Role:** Clickable article title

pragmatica 400, 24–30px, #333333. No underline by default. On the snapshot the middle-column card shows the headline inside a bordered frame. Arrow suffix ('>') used for 'Fashion Spaces is moving to FRAMEweb >' as a subtle directional cue, #333333.

### Image Block
**Role:** Photography container in the grid

Full-width-within-column image, 0px radius, no border, no shadow, no caption overlay. Images are architectural, fashion editorial, or atmospheric B&W — they supply all the visual color the monochrome system refuses to add. Aspect ratio is preserved, never cropped to a mask.

### Section Label / Footer Year
**Role:** Closing/auxiliary text

Small pragmatica 12px #333333 line used for dates, author credits, and any auxiliary metadata. Frequently set with 10–20px vertical padding from surrounding elements. Carries the 'zine colophon' feeling of a publication imprint.

## Do's and Don'ts

### Do
- Set all type in pragmatica (or substitute neo-grotesque) at weight 400 — never bold, never italic.
- Keep the entire palette to #333333 on #ffffff; introduce #000000 only for badge borders and the darkest strokes.
- Use 0px border-radius on every element — cards, buttons, badges, images, inputs — sharpness is the brand.
- Maintain tight line-heights of ~1.14 for 30–35px display sizes and ~1.47 for 15px body to preserve the editorial voice.
- Let the 1px #333333 hairline do the structural work: frame featured cards, underline sections, and separate the top nav from content.
- Pad card content with 35px left/right and give the page 40–60px between rows; breathing room is the composition.
- Use the checkbox + label pattern for any categorical nav or filter; it reinforces the print-archive metaphor.

### Don't
- Never add a CTA accent color, gradient, or filled button — the design is intentionally colorless.
- Never use shadows, glows, or blurred borders for elevation; rely on 1px lines and whitespace instead.
- Never use rounded corners, pill shapes, or softened chips on any component.
- Never mix multiple type families or introduce a serif; pragmatica 400 is the only voice.
- Never auto-play, animate, or apply motion to interface elements — the publication is static and quiet.
- Never crop editorial photography to a circle, rounded rectangle, or decorative mask; always show the full image edge.
- Never place a colored badge, icon, or status pill; all functional cues must come from typography and lines.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Single flat page surface — no card elevation, no overlays, no modal surface tone |
| 1 | Framed Card | `#ffffff` | Featured story panel wrapped in a 1px #333333 hairline; same paper white, distinguished only by the line |

## Elevation

The design deliberately uses zero shadows. Elevation is communicated exclusively through 1px #333333 borders, whitespace, and the typographic hierarchy itself. There is no z-axis vocabulary — the page is a printed surface, not a software interface.

## Imagery

Photography is the entire color system. The site carries fashion editorial, architectural interiors, runway, and backstage imagery that arrives already desaturated or B&W, so the monochrome UI never has to compete. Images are always full-column width, sharp-cornered, never masked, never overlaid with text or tinted. Aspect ratios are preserved from the photographer's original. The few graphic inserts (like the black square with green/mint text in the second screenshot) are treated as printed inserts — flat color blocks functioning as layout elements, not UI chrome. No illustrations, no icons, no decorative graphics apart from the photography itself.

## Layout

Full-bleed page inside a wide max-width (~1280px), organized as a 3-column editorial grid. The top is a single horizontal nav bar (text links left, checkbox filters right) followed by a giant wordmark on its own line. Below, content tiles alternate between image-led editorial cards and a text-only bordered featured panel, with the third column carrying a dark-toned photo tile. Section rhythm is set by 40–60px vertical gaps rather than alternating background bands — the whole page is one white surface. Card sizes vary by column width; images run edge-to-edge inside their grid cell. Navigation is a minimal top bar, not sticky, not translucent. Density is comfortable: one or two story cards per row, never a dense dashboard grid.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffffff
- text: #333333
- border / hairline: #333333
- emphasis stroke: #000000
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Top nav bar** — white background, no border, no shadow. Left: 'FEED' and 'ABOUT' in pragmatica 12px #333333, 20px gap. Right: three checkbox-and-label pairs ('WORDS', 'PROJECTS', 'REPORTAGE'), each a 1px #333333 square (~12px) followed by the label in pragmatica 12px #333333, 20px gap between groups.

2. **Wordmark header** — full-width row, pragmatica 35px weight 400, #333333, line-height 1.14, no margin-top, 40px margin-bottom. Reads 'NOFILTER. SPACE' on a single left-aligned line.

3. **Editorial image card** — 0px radius, no border, no shadow. Full-column image at native aspect ratio. Below: headline in pragmatica 24px #333333, then 'by [Author]' in 12px #333333, then date in 12px #333333. 35px left/right padding from the grid gutter.

4. **Bordered featured card** — white background, 1px solid #333333 border, 0px radius, 35px padding all sides. Headline in pragmatica 30px #333333 line-height 1.14, 30px margin-bottom. Byline + date in 12px #333333 stacked below.

5. **Section row** — 40–60px margin-top between content groups. 30px row-gap and column-gap inside the 3-column grid. All cards align to a shared baseline with no decorative dividers.

## Design Philosophy Notes

This system is built on three structural commitments: (1) zero color, (2) one weight, (3) one font. Every element that would normally require a color or a shadow is solved with a 1px line or a spacing token instead. The checkbox nav, the bordered featured card, and the period in the wordmark are the only 'chrome' the design allows itself, and each one reinforces the print-publication metaphor. An AI agent building new pages should treat restraint as the primary design constraint — if a component feels like it needs a color to be understood, it is probably the wrong component. Solve for hierarchy with size, leading, and whitespace; solve for state with border weight; solve for emphasis with #000000 instead of #333333.

## Similar Brands

- **It's Nice That** — Editorial grid with a single sans-serif at one weight, image-led cards, zero color palette, and a wordmark-as-masthead header.
- **The Gentlewoman** — Print-publication web design: achromatic, tight typographic grid, photography fills the color role, sharp corners and hairline rules.
- **Apartamento Magazine** — Magazine-on-screen treatment with monochrome type, generous whitespace, and content arranged in variable editorial columns.
- **032c** — High-fashion editorial site that uses a flat white canvas, large utilitarian type, and lets the photography carry all visual energy.
- **Pin-Up Magazine** — Architectural-fashion editorial web layout with brutalist type, no decorative UI, and a single-weight sans carrying every voice.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #333333;
  --color-carbon: #000000;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-pragmatica: 'pragmatica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 15;
  --text-body: 15px;
  --leading-body: 22;
  --text-subheading: 24px;
  --leading-subheading: 28;
  --text-heading-sm: 30px;
  --leading-heading-sm: 34;
  --text-heading: 35px;
  --leading-heading: 40;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 40-60px;
  --card-padding: 35px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-nav: 0px;
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-framed-card: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #333333;
  --color-carbon: #000000;
  --color-paper: #ffffff;

  /* Typography */
  --font-pragmatica: 'pragmatica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 15;
  --text-body: 15px;
  --leading-body: 22;
  --text-subheading: 24px;
  --leading-subheading: 28;
  --text-heading-sm: 30px;
  --leading-heading-sm: 34;
  --text-heading: 35px;
  --leading-heading: 40;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-60: 60px;
}
```
