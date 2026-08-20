# INFRINGE — Style Reference
> Punk editorial broadsheet with highlighter pen

**Theme:** light

Infringe operates as a brutalist editorial zine: pure white canvas interrupted by solid black and highlighter-yellow bands, with a single typeface (Archivo Black) that fills entire viewports at 252px or shrinks to 12px captions — nothing in between. The system commits to extremes rather than modulation: every surface is either #ffffff, #000000, or #ffff01, every corner is square, every shadow is absent, every gradient is forbidden. Layouts read as full-bleed magazine spreads — split-screen photography meets type-as-image, with a persistent rotated vertical sidebar anchoring the left edge like a photocopied zine masthead. Color does no decorative work; yellow is a highlighter pen dragged across the page to call out names and sections, never an aesthetic wash.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Photocopy Black | `#000000` | `--color-photocopy-black` | Display type, sidebar text, structural borders, image outlines, header bands — the ink |
| Newsprint White | `#ffffff` | `--color-newsprint-white` | Primary canvas, card surfaces, text on black bands |
| Muted Ash | `#666666` | `--color-muted-ash` | Input placeholder text, form field borders, secondary metadata |
| Highlighter Yellow | `#ffff01` | `--color-highlighter-yellow` | Accent bands, feature name callouts, section dividers — the highlighter drag that breaks the monochrome |
| Link Cobalt | `#2b4dff` | `--color-link-cobalt` | Rotated category labels and inline links between editorial blocks — the only chromatic voice besides yellow |

## Tokens — Typography

### Archivo Black — Sole typeface across the entire system — display masthead fills 252px viewport, captions drop to 12px, no other family exists. Negative tracking tightens at scale, positive tracking opens at body size · `--font-archivo-black`
- **Substitute:** Anton (closest free match for the condensed-black display), or Archivo via Google Fonts at weight 900 as fallback for 400/700 weights
- **Weights:** 100, 400, 700
- **Sizes:** 12, 16, 32, 48, 108, 252
- **Line height:** 0.80, 1.00, 1.20
- **Letter spacing:** -0.093em at 252px (-23.4px), -0.040em at 108px (-4.32px), -0.031em at 48px (-1.49px), 0.023em at 16px (0.37px), 0.023em at 12px (0.28px)
- **Role:** Sole typeface across the entire system — display masthead fills 252px viewport, captions drop to 12px, no other family exists. Negative tracking tightens at scale, positive tracking opens at body size

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.28px | `--text-caption` |
| body-sm | 16px | 1.2 | 0.37px | `--text-body-sm` |
| heading-sm | 32px | 1 | -0.99px | `--text-heading-sm` |
| heading | 48px | 1 | -1.49px | `--text-heading` |
| heading-lg | 108px | 0.8 | -4.32px | `--text-heading-lg` |
| display | 252px | 0.8 | -23.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 0px |
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Vertical Sidebar Nav
**Role:** Persistent left-edge site navigation across all pages

Fixed 16px-wide column on the left viewport edge. Text 'MENU INFRINGE' rotated 90° counterclockwise in Archivo Black 16px, #000000, letter-spacing 0.37px. Repeats continuously from top to bottom of viewport. No background fill — text floats on the page canvas. Padding 8px from viewport edge.

### Display Masthead Band
**Role:** Full-width header announcing brand or issue title

Full-bleed #000000 background band. Brand or section title set in Archivo Black 252px, #ffffff, line-height 0.80, letter-spacing -23.4px. 50px top and bottom padding. Text fills or overflows the viewport width. No border, no shadow, no curve.

### Yellow Feature Band
**Role:** Highlighted name or title block over solid yellow

Full-width #ffff01 background. Name or title in Archivo Black 48px, #000000, letter-spacing -1.49px, line-height 1.00. 24px horizontal padding, sits inside a 50/50 grid with a photo on the right. Yellow is the 'highlighter drag' — it points, never decorates.

### Split-Screen Editorial Section
**Role:** Two-photo composition with a rotated label between

Two equal-width 50/50 columns, each containing a full-bleed photograph. No gap between columns, no padding inside. Between them, a vertical rotated label (e.g. 'Flower Study') in Link Cobalt #2b4dff at 32px Archivo Black, rotated 90°, sits in the seam. Photography occupies 100% of column height.

### Rotated Category Label
**Role:** Inline rotated text used as a section label between editorial blocks

Single word or short phrase rotated 90° counterclockwise. Archivo Black 32px, #2b4dff, letter-spacing -0.99px. Sits in the negative space between two photos or a photo and a type block. No background, no border — the text itself is the divider.

### Editorial Photo Block
**Role:** Large contained or full-bleed photograph

Photograph with no padding, no border-radius (0px), no shadow. May carry a 1px #000000 border when used inside a yellow feature band to separate it from adjacent type. Image fills its container edge-to-edge.

### Newsletter Input Field
**Role:** Email capture in footer or interstitial

Single-line input with 1px solid #666666 border, #ffffff background, #000000 text, Archivo Black 16px, letter-spacing 0.37px. Padding 6px 14px. Placeholder text in #666666. Border-radius 0px. No focus ring color change — focus removes the border entirely and replaces with a 2px #000000 outline.

### Underlined Text Link
**Role:** Inline navigational or editorial link

Archivo Black 16px, #000000, text-decoration underline (1px solid). 8px margin top and bottom to separate from surrounding type. Hover state swaps to #2b4dff with no transition. No button chrome — links are always bare text.

### Portrait/Drawing Container
**Role:** Contained portrait artwork on white

Square or near-square image (drawing, photograph, or scan) centered on #ffffff canvas, max-width constrained within the split-screen column. No border, no frame, no caption. Image sits flush to column edges with no padding.

### Bottom Strip Footer
**Role:** Closing element at page bottom

Repeating display type set in Archivo Black 108px, #000000, line-height 0.80, letter-spacing -4.32px. May run a category or word like 'NGE INFRINGE' repeatedly across the viewport. No link styling, no metadata, no subscribe form — just type.

### Yellow Accent Strip
**Role:** Thin horizontal band used as a section break or emphasis

Full-width band, 8–16px tall, #ffff01 background. Contains no text. Sits between a white editorial section and a black display band, or under a masthead. Functions as a printed highlighter rule.

## Do's and Don'ts

### Do
- Use Archivo Black at 252px with -23.4px letter-spacing for any display masthead that introduces a page or issue
- Reserve #ffff01 for full-width bands and feature name callouts — never use it as a fill on small UI elements or buttons
- Keep border-radius at 0px on every surface including cards, buttons, inputs, and images
- Set the persistent left sidebar to 16px Archivo Black rotated 90° and let it repeat the nav label continuously down the viewport edge
- Use 50/50 split-screen grids for hero compositions with no gutter between the two photo columns
- Apply 1px solid #000000 borders on images that sit inside a yellow band to create a hard edge against the photo
- Pick type sizes from the 6-step scale only (12, 16, 32, 48, 108, 252) — do not interpolate intermediate sizes

### Don't
- Do not introduce a second typeface family — Archivo Black carries the entire system at every size
- Do not add box-shadows, drop-shadows, or inset shadows on any component
- Do not use gradients of any kind, even subtle ones between #000000 and #ffffff
- Do not round any corner — buttons, cards, tags, inputs, and image masks must all stay 0px
- Do not use the red/terracotta backdrop visible in editorial photography as a brand surface — it lives inside the photograph only
- Do not use display sizes below 48px for primary section headings — the scale jumps from 32px to 48px and the jump is intentional
- Do not apply hover transitions longer than 0ms or color fades — state changes are instant swaps between #000000, #ffffff, #ffff01, and #2b4dff

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default background for all editorial sections and content blocks |
| 1 | Highlighter Band | `#ffff01` | Full-width feature sections and category callouts that interrupt the monochrome |
| 2 | Ink Header | `#000000` | Display-type header band and persistent sidebar background zones |

## Elevation

The system has no elevation. Depth is constructed from the contrast between solid color blocks (#ffffff canvas, #000000 bands, #ffff01 highlighter strips) and 1px hairlines. There are no shadows because the design is photocopied, not skeuomorphic — separation comes from ink, not from light.

## Imagery

Photography is editorial and full-bleed: tight crops of plant matter, studio portraits with theatrical backdrops (terracotta, neutral white), and product still-lifes of wig displays and sculptural objects. High contrast, no lifestyle context, no people in environments — subjects are isolated on solid backdrops and treated as found objects. The terracotta red behind the portrait in the hero is a studio backdrop inside the photograph, not a design-system surface. Drawings and scans (portrait sketches) sit in their own white columns with no frame. No rounded corners, no drop shadows, no image overlays, no duotone treatments — images are raw, sometimes grainy, and sit edge-to-edge against type.

## Layout

Full-bleed page model — no max-width container, every section runs edge to edge. The page rhythm is: full-width black masthead band (252px type), split-screen editorial hero (two photos 50/50 with rotated label in the seam), yellow feature band (type left, photo right at 50/50), portrait/drawing column (square image centered on white), repeating display-type footer strip. The persistent left vertical sidebar (16px rotated text) anchors every section. Sections stack vertically with 64px gaps; within sections, no padding or margin — content touches column edges. No card grids, no pricing tables, no multi-column feature blocks — the editorial grammar is always 2-column split or single full-bleed type band.

## Agent Prompt Guide

Quick Color Reference:
- Background: #ffffff
- Text: #000000
- Border: #000000
- Accent: #ffff01
- Muted text: #666666
- Link / category label: #2b4dff
- primary action: no distinct CTA color

Example Component Prompts:
1. Build a full-width black masthead band: #000000 background, brand name in Archivo Black 252px #ffffff, line-height 0.80, letter-spacing -23.4px, 50px top and bottom padding, 0px radius. The text should visually fill or overflow the viewport width.

2. Build a yellow feature name block: full-width #ffff01 background, name in Archivo Black 48px #000000, letter-spacing -1.49px, 24px padding on the left half of a 50/50 grid. The right half holds a full-bleed photo with a 1px #000000 border and 0px radius.

3. Build a split-screen editorial hero: two 50/50 columns, each containing a full-bleed photograph with 0px radius and no padding. Between the columns, place a single rotated 90° label in Archivo Black 32px, color #2b4dff, letter-spacing -0.99px.

4. Build a vertical sidebar nav: position fixed along the left viewport edge, 8px from the edge, text 'MENU INFRINGE' in Archivo Black 16px #000000, letter-spacing 0.37px, rotated 90° counterclockwise, repeating continuously. No background fill, no border.

5. Build a newsletter input: 1px solid #666666 border, #ffffff background, Archivo Black 16px #000000 text, padding 6px 14px, 0px radius, placeholder text in #666666. On focus, swap border to 2px solid #000000 with no transition.

## Typography Doctrine

The type system is a two-axis instrument: size and tracking. There is no italic, no underline-as-decoration (only as link affordance), no small caps, no condensed variant. Archivo Black is the only voice. Display sizes (108px and 252px) use heavy negative tracking to pull letters into a single ink-block; body and caption sizes (12px and 16px) use positive 0.023em tracking to let the black weight breathe. Line-height collapses at scale (0.80 for 108–252px) and opens slightly at caption size (1.20 for 12px). Never mix display tracking with body tracking or the optical density collapses.

## Similar Brands

- **Buffalo Zine** — Same editorial split-screen photography, same zine-broadsheet page model, same willingness to use type as image at extreme scale
- **System Magazine** — Identical full-bleed editorial sections, bold display masthead bands, and a black-white-plus-single-accent discipline
- **KALEIDOSCOPE** — Same art-publication density — large square portraits, rotated inline labels, and a tri-color palette (black/white/highlight) over fine-art photography
- **PIN-UP** — Same magazine-of-architecture sensibility — square editorial crops, hard yellow or solid color bands, and zero rounded corners

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-photocopy-black: #000000;
  --color-newsprint-white: #ffffff;
  --color-muted-ash: #666666;
  --color-highlighter-yellow: #ffff01;
  --color-link-cobalt: #2b4dff;

  /* Typography — Font Families */
  --font-archivo-black: 'Archivo Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.37px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.99px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.49px;
  --text-heading-lg: 108px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -4.32px;
  --text-display: 252px;
  --leading-display: 0.8;
  --tracking-display: -23.4px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-all: 0px;
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-highlighter-band: #ffff01;
  --surface-ink-header: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-photocopy-black: #000000;
  --color-newsprint-white: #ffffff;
  --color-muted-ash: #666666;
  --color-highlighter-yellow: #ffff01;
  --color-link-cobalt: #2b4dff;

  /* Typography */
  --font-archivo-black: 'Archivo Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.37px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.99px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.49px;
  --text-heading-lg: 108px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -4.32px;
  --text-display: 252px;
  --leading-display: 0.8;
  --tracking-display: -23.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-80: 80px;
  --spacing-120: 120px;
}
```
