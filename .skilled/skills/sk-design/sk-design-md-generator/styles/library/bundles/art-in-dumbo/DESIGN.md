# Art In DUMBO — Style Reference
> gallery broadside on raw paper

**Theme:** light

Art In DUMBO reads like a broadside poster pinned to a white-cube gallery wall: one weight of Helvetica at every size, black ink on raw paper, and a single sage-green accent that punctuates action and status like a curator's sticker. The system is unapologetically editorial — full-bleed documentary photography carries the atmosphere while the type system stays calm, dense, and confident at every breakpoint. Surfaces are almost entirely white or warm off-white; structure comes from hairline black rules, never from shadows or colored panels. Components are few and stocky: pill buttons with 50px radii sit next to sharp 2px-radius inputs, creating deliberate radius contrast. Color is rationed — sage green for the only real CTA, warm orange for urgency tags, and otherwise a pure black-to-warm-gray ramp.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon | `#000000` | `--color-carbon` | Primary text, logo cells, hairline dividers between list rows, icon strokes — the only ink in the system |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, pill-button fills, inverse text on dark cells |
| Plaster | `#f1f2f2` | `--color-plaster` | Input fields, secondary surfaces, subtle button hovers |
| Linen | `#e5e3df` | `--color-linen` | Warm off-white section backgrounds, large quiet surfaces that break the white without going gray |
| Ash | `#bdbdbd` | `--color-ash` | Medium-contrast borders, control outlines, and structural separators |
| Graphite | `#828282` | `--color-graphite` | Button borders and label text for secondary controls |
| Smoke | `#b3b3b3` | `--color-smoke` | Shadow base tone for the single ambient drop-shadow pattern |
| Sage | `#71cc98` | `--color-sage` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Ember | `#ff7f41` | `--color-ember` | Orange outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Helvetica Neue — Sole typeface across the entire system — display, body, nav, labels. Weight 500 is the only weight used; this medium-only commitment is the signature: not bold, not regular, never thin. Sizes run from 10px captions to 68px display with tight 1.05–1.15 line-heights at the top of the scale and 1.40–1.80 at body sizes. · `--font-helvetica-neue`
- **Substitute:** Inter, Neue Haas Grotesk, Helvetica, Arial
- **Weights:** 500
- **Sizes:** 10px, 11px, 16px, 19px, 22px, 27px, 28px, 30px, 34px, 37px, 44px, 63px, 68px
- **Line height:** 1.00–1.80
- **Role:** Sole typeface across the entire system — display, body, nav, labels. Weight 500 is the only weight used; this medium-only commitment is the signature: not bold, not regular, never thin. Sizes run from 10px captions to 68px display with tight 1.05–1.15 line-heights at the top of the scale and 1.40–1.80 at body sizes.

### Roboto — Secondary system fallback for micro-labels and small UI chrome where a different metric helps · `--font-roboto`
- **Substitute:** Roboto, system-ui
- **Weights:** 400, 500
- **Sizes:** 10px, 11px
- **Line height:** 1.20–1.40
- **Role:** Secondary system fallback for micro-labels and small UI chrome where a different metric helps

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 22px | 1.27 | — | `--text-subheading` |
| heading-sm | 27px | 1.2 | — | `--text-heading-sm` |
| heading | 34px | 1.15 | — | `--text-heading` |
| heading-lg | 44px | 1.1 | — | `--text-heading-lg` |
| display | 63px | 1.05 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0-4px |
| inputs | 2px |
| logo-cells | 0px |
| buttons-pill | 50px |
| buttons-secondary | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.3) 0px 1px 4px -1px` | `--shadow-sm` |
| md | `rgba(0, 0, 0, 0.25) 0px 0px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 16-24px
- **Element gap:** 12-20px

## Components

### Logo Wordmark Block
**Role:** Brand mark in the top-left of every screen

Stacked three-cell grid: 'ART', 'IN', 'DUMBO' on three lines. Each letter sits in its own black-bordered cell on a white ground. Borders are 1px black, no fill, no radius. Cells are flush — no gap between them — so the mark reads as a single printed stamp.

### Sticky Header Bar
**Role:** Persistent navigation across all pages

White background, no border. Left: logo wordmark. Right: three text links (Events, Exhibitions, First Thursdays) in 16–19px Helvetica 500, #000000, flush right. No icons, no background pills — nav is just type.

### Full-Bleed Hero Photograph
**Role:** Above-the-fold visual anchor on the landing page

Documentary-style photograph of artists at work, edge-to-edge with no container or radius. The logo overlays top-left in a solid white-backed block. No text overlay other than the wordmark.

### Display Heading
**Role:** Section openers and welcome statements

63–68px Helvetica 500, #000000, line-height ~1.05, tracking normal. Sentence case, no max-width clamp — runs nearly full bleed for editorial weight. Sage-green horizontal rule (3–4px) sometimes underlines the heading or its first word.

### Body Paragraph
**Role:** Welcome copy, event descriptions, editorial text

22–27px Helvetica 500, #000000, line-height 1.20–1.27, no max-width cap. Generous, readable, never condensed.

### Email Input Field
**Role:** Newsletter capture on the welcome block

2px border-radius, #f1f2f2 fill, no visible border. Placeholder text in 16px Helvetica 500, #000000 at ~40% opacity. Inline adjacent to a ghost Subscribe button.

### Ghost Text Button (Subscribe)
**Role:** Secondary action paired with form fields

No background, no border, no radius. Label in 16px Helvetica 500, #000000, followed by a small right-pointing arrow glyph. Sits flush right of its input.

### Sage Pill Button (Map & Directory)
**Role:** Primary floating CTA, sticky bottom-right

50px border-radius (full pill), #71cc98 fill, #000000 text, 16–19px Helvetica 500, horizontal padding ~20px. A small filled sage dot (8px) sits inside the left padding as a status indicator. Subtle shadow: rgba(0,0,0,0.25) 0 0 10px. This is the only chromatic fill button in the system.

### Exhibition List Row
**Role:** Primary content unit on the Exhibitions page

Horizontal row: square thumbnail (~80px, 4px radius), then a four-column meta block (Date range / Title / Gallery name / Open hours). Rows separated by 1px solid #000000 hairlines — no zebra striping, no card backgrounds. Meta text in 16–22px Helvetica 500; gallery hours in #bdbdbd.

### Urgency Tag (Closing Soon)
**Role:** Status indicator for time-sensitive items

Inline text label, no background, no border. 16px Helvetica 500 in #ff7f41. Sits directly under the date range in an exhibition row.

### Status Meta (Open hours)
**Role:** Secondary metadata in list rows

16–19px Helvetica 500, #bdbdbd. Always one line, never wrapped. Communicates operational state without competing with primary text.

### Sticky Floating Action
**Role:** Persistent wayfinding CTA

Same component language as the Sage Pill Button, but position:fixed bottom-right. Reappears on scroll with the same shadow and radius. Functions as a quiet, always-on directory shortcut.

## Do's and Don'ts

### Do
- Use #000000 for all structural lines, icons, and primary text — it is the only ink the system has
- Reserve #71cc98 Sage exclusively for the Map & Directory pill, heading underline marks, and accent dots
- Set border-radius to 50px on pill buttons and 2px on inputs — never blur the two
- Set type to Helvetica Neue 500 at the scale sizes; do not introduce additional weights
- Separate exhibition list rows with 1px solid #000000 hairlines, never with card backgrounds or zebra striping
- Let hero photography run full-bleed with no overlay text other than the wordmark
- Use #ff7f41 Ember only for urgency status text such as 'Closing Soon' — never as a fill

### Don't
- Do not add colored panels, gradient fills, or decorative cards behind text
- Do not introduce new typefaces or weight values beyond Helvetica 500 and the Roboto micro-label fallback
- Do not use shadows to separate sections — use 1px black hairlines or a shift to #e5e3df Linen
- Do not round the hero photograph or exhibition thumbnails beyond 4px
- Do not stack more than two type sizes in a single row of the exhibitions list
- Do not place sage green text on the sage pill background — it must remain #000000
- Do not center body paragraphs or exhibition row content; left-align everything

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Default page canvas, card surfaces, header background |
| 1 | Linen | `#e5e3df` | Warm off-white section bands that break white without going gray |
| 2 | Plaster | `#f1f2f2` | Input wells and hover surfaces for interactive elements |

## Elevation

- **Sage Pill Button:** `rgba(0, 0, 0, 0.25) 0px 0px 10px 0px`
- **Secondary buttons & small chrome:** `rgba(0, 0, 0, 0.3) 0px 1px 4px -1px`

## Imagery

Full-bleed documentary photography is the primary visual content: candid shots of artists in their studios, natural light, no lifestyle staging, no color treatment. Images run edge-to-edge with no rounded corners and no overlay text. Thumbnail crops in the exhibitions list are square, tight, and unadorned. There are no illustrations, no icons beyond a small status dot, and no 3D or abstract graphics — the photography carries all atmosphere.

## Layout

Editorial broadsheet rhythm. Landing page opens with a full-bleed hero photograph, then a tight vertical stack of display heading → body paragraph → email capture, all left-aligned and nearly full-width. The Exhibitions page swaps photography for a text-and-thumbnail table: each row is a four-column horizontal band separated by 1px black hairlines, reading like a printed program. No card grids, no asymmetric compositions, no overlap. Navigation is a single sticky text-only bar. The sage Map & Directory pill is the only fixed-position element, anchored bottom-right.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- surface-warm: #e5e3df
- surface-input: #f1f2f2
- border: #000000
- accent: #71cc98 (Sage)
- primary action: #71cc98 (filled action)

3 Example Component Prompts:
1. Sage Pill Button: 50px border-radius, #71cc98 fill, 19px Helvetica 500 #000000 label, 20px horizontal padding, 10px vertical padding, a 8px filled sage dot inside the left padding, shadow rgba(0,0,0,0.25) 0 0 10px.
2. Exhibition List Row: four columns — 80px square thumbnail (4px radius), date range in 16px Helvetica 500 #000000, title in 22px Helvetica 500 #000000, gallery name in 19px Helvetica 500 #000000 with 'Open: HH:MM–HH:MM' in 16px #bdbdbd below. Rows separated by 1px solid #000000 hairline, no row background.
3. Display Heading Block: 63px Helvetica 500 #000000, line-height 1.05, with a 3px #71cc98 horizontal rule directly under the heading spanning the full text width. Followed by a 22px Helvetica 500 #000000 body paragraph at line-height 1.27, no max-width clamp.

## Radius Philosophy

The system uses only two radii and the contrast between them is intentional: 2px for inputs and inline controls (sharp, utilitarian, almost machine-stamped) and 50px for the only interactive pills (soft, inviting, thumb-shaped). Cards and list rows use 0–4px — they read as printed paper, not interface. Never blend the two radii on the same component.

## Type Discipline

Weight 500 across all sizes is a brand rule, not a default. Do not introduce 400 or 700 weights — the medium-only commitment is what makes the type feel like a single tool used at different pressures. The same Helvetica 500 at 10px in a status tag and at 63px in a display heading should feel like the same voice speaking at different volumes.

## Similar Brands

- **Printed Matter** — Same broadside-poster rhythm: one weight of sans-serif, full-bleed art photography, black hairline rules, and a single accent color rationed across the page
- **Pioneer Works** — Same editorial-verticality and near-flat surface treatment, with documentary photography carrying atmosphere instead of decorative UI
- **Swiss Institute** — Same Helvetica-medium-only type discipline, white-canvas gallery feel, and pill-shaped CTAs
- **White Columns** — Same nearly all-achromatic palette, text-as-architecture layout, and program-list table format for exhibitions
- **Are.na** — Same utilitarian restraint, hairline-separated content rows, and refusal to use color decoratively

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon: #000000;
  --color-paper: #ffffff;
  --color-plaster: #f1f2f2;
  --color-linen: #e5e3df;
  --color-ash: #bdbdbd;
  --color-graphite: #828282;
  --color-smoke: #b3b3b3;
  --color-sage: #71cc98;
  --color-ember: #ff7f41;

  /* Typography — Font Families */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.27;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.2;
  --text-heading: 34px;
  --leading-heading: 1.15;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --text-display: 63px;
  --leading-display: 1.05;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 16-24px;
  --element-gap: 12-20px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 0-4px;
  --radius-inputs: 2px;
  --radius-logo-cells: 0px;
  --radius-buttons-pill: 50px;
  --radius-buttons-secondary: 2px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-linen: #e5e3df;
  --surface-plaster: #f1f2f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon: #000000;
  --color-paper: #ffffff;
  --color-plaster: #f1f2f2;
  --color-linen: #e5e3df;
  --color-ash: #bdbdbd;
  --color-graphite: #828282;
  --color-smoke: #b3b3b3;
  --color-sage: #71cc98;
  --color-ember: #ff7f41;

  /* Typography */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.27;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.2;
  --text-heading: 34px;
  --leading-heading: 1.15;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --text-display: 63px;
  --leading-display: 1.05;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
}
```
