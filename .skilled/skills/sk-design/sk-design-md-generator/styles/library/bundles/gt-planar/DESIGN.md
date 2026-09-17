# Gt-planar — Style Reference
> cockpit HUD at warp speed

**Theme:** dark

GT Planar is a cockpit-HUD aesthetic deployed as a typeface showcase: pitch-black canvas, violet primary action, and an electric yellow-green border palette that reads like instrument-panel backlighting. Typography is the protagonist — the custom GT Planar face is the interface, not decoration on top of it. The visual system avoids depth entirely: no drop shadows, no gradients, no elevation. Instead, structure comes from 1px white hairline borders and chromatic outlines that act as glowing wireframes against the dark void. Density is high, padding is tight (1-5px range), and color appears as small, intentional function-driven punctuation rather than background wash. The result feels like looking through a pilot's heads-up display at lightspeed — every element is engineered, every line carries data, and the page itself is a working instrument rather than a marketing surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hyperspace Violet | `#6100ff` | `--color-hyperspace-violet` | Primary CTA fill, filled action backgrounds, and dominant accent border — a saturated electric violet that reads as powered-on against pure black |
| Reactor Yellow | `#fcff76` | `--color-reactor-yellow` | Green outline accent for tags, dividers, and focused UI edges. |
| Plasma Green | `#00ff85` | `--color-plasma-green` | Secondary accent for headings, link text, and body emphasis — a neon mint that signals live/active states and reads as data flowing through the HUD |
| Crimson Alert | `#ff003d` | `--color-crimson-alert` | Red outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Deep Indigo | `#29006c` | `--color-deep-indigo` | Mid-tier surface fill for button backgrounds and elevated dark panels — sits between pure black and Hyperspace Violet |
| Plum Void | `#1a0014` | `--color-plum-void` | Pink state accent for badges, validation surfaces, and short status labels. Do not promote it to the primary CTA color |
| Ember Violet | `#7000ff` | `--color-ember-violet` | Decorative surface wash and large-area violet background — lighter and more luminous than Hyperspace Violet, used where broad violet fields appear |
| Amber Signal | `#ff8a00` | `--color-amber-signal` | Tertiary accent for table data, secondary highlights, and rare warm punctuation — used sparingly so it reads as a specific instrument indicator |
| Photon White | `#ffffff` | `--color-photon-white` | Primary text, hairline borders, and 1px box-shadow wireframes — functions as the structural linework of the entire interface, not just foreground text |
| Null Black | `#000000` | `--color-null-black` | Page canvas and button borders — the flat dark void from which all colored elements emerge |
| Graphite | `#949494` | `--color-graphite` | Muted text, nav borders, and secondary structural lines — the de-energized neutral for inactive labels and supporting metadata |
| Carbon | `#606060` | `--color-carbon` | Lowest-priority dividers and button outlines — the dimmest neutral, used where structure is needed but emphasis is not |

## Tokens — Typography

### GT Planar — The custom GT Planar face carries the entire brand — geometric, monospaced-influenced letterforms with multiple stylistic sets. Used at every level from 11px captions to 274px display. Weight 300 for light technical labels, 400 for body, 700 for emphasis and display. OpenType features include stylistic sets ss01–ss04 and tabular numerals (tnum) for data contexts. · `--font-gt-planar`
- **Substitute:** Space Grotesk (closest free geometric match) with Space Mono for display sizes, JetBrains Mono as fallback
- **Weights:** 300, 400, 700
- **Sizes:** 11, 14, 16, 17, 20, 24, 25, 32, 37, 58, 86, 115, 146, 187, 230, 274px
- **Line height:** 0.80–1.63 (extremely tight for display, 1.43–1.63 for body)
- **Letter spacing:** Inverse relationship with size: tight tracking (-0.05em to -0.005em) on body and small text, wide tracking (+0.025em to +0.07em) on mid-headings, and extreme +0.70em (70%) on the largest display sizes — the wide tracking at scale is a signature choice that makes display text feel like a schematic label rather than prose
- **OpenType features:** `"kern", "ss01"; "kern", "ss02"; "kern", "ss03"; "kern", "ss04"; "kern", "lnum", "tnum"; "kern", "ss01", "ss02"; "kern", "ss01", "ss02", "ss03"; "kern", "ss03", "ss04"`
- **Role:** The custom GT Planar face carries the entire brand — geometric, monospaced-influenced letterforms with multiple stylistic sets. Used at every level from 11px captions to 274px display. Weight 300 for light technical labels, 400 for body, 700 for emphasis and display. OpenType features include stylistic sets ss01–ss04 and tabular numerals (tnum) for data contexts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.43 | 0.25px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.63 | -0.16px | `--text-body` |
| subheading | 20px | 1.2 | 0.5px | `--text-subheading` |
| heading-sm | 25px | 1.15 | 1.15px | `--text-heading-sm` |
| heading | 37px | 1.1 | 2.59px | `--text-heading` |
| heading-lg | 58px | 1 | 2.9px | `--text-heading-lg` |
| display | 115px | 0.9 | 5.75px | `--text-display` |
| display-xl | 187px | 0.85 | 130.9px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 29 | 29px | `--spacing-29` |
| 50 | 50px | `--spacing-50` |
| 58 | 58px | `--spacing-58` |
| 100 | 100px | `--spacing-100` |
| 150 | 150px | `--spacing-150` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(255, 255, 255) 1px 0px 0px 0px, rgb(255, 255, 255) 0p...` | `--shadow-subtle` |

### Layout

- **Section gap:** 25px
- **Card padding:** 15-25px
- **Element gap:** 5px

## Components

### Filled Violet Action
**Role:** Primary CTA button

Pill-shaped (9999px), 25px vertical × 50px horizontal padding, filled with Hyperspace Violet (#6100ff), text in Photon White (#ffffff) at 14px weight 400, uppercased. The only filled button variant — all other actions are outlined. Sits at 5px internal gap for compact rhythm.

### Reactor-Yellow Outlined Action
**Role:** Secondary/featured action button

Pill (9999px), 1px solid Reactor Yellow (#fcff76) border, transparent black fill, 25px/50px padding, white text at 14px. The border IS the design — no fill needed, the yellow wireframe signals 'instrument ready'.

### Graphite Ghost Button
**Role:** Tertiary/utility button

Pill (9999px), 1px solid Graphite (#949494) border, transparent fill, 10px/25px padding, white or gray text. Used for nav actions like HUD, TYPETESTER, BUY where hierarchy is flat.

### HUD Warning Banner
**Role:** Top-of-page alert strip

Full-bleed horizontal band, 1px solid Crimson Alert (#ff003d) border, black fill, centered text in Photon White at 11-14px weight 400, all-caps with wide letter-spacing. Text reads as a system alert (e.g. 'BUCKLE IN TO ENSURE PILOT SAFETY'). The 1px red border is the entire visual treatment — no background fill, no icon.

### Display Heading with Border Underline
**Role:** Hero/feature headline

GT Planar at 86-187px, weight 400 or 700, with a 1px Reactor Yellow (#fcff76) bottom border on the heading element itself. The border visually frames the text like an instrument readout, not a typographic flourish.

### Plum Void Input
**Role:** Text input field

Zero radius (0px), Plum Void (#1a0014) background, 1px Photon White border, tight 5-10px padding, white placeholder text at 14-16px. The plum fill distinguishes active input wells from the flat black canvas without using a border alone.

### Pill Tag
**Role:** Category/status badge

9999px radius, 1px chromatic border (typically Plasma Green #00ff85 or Reactor Yellow), transparent fill, 2-5px vertical padding, 10-15px horizontal padding, uppercase 11-14px white text. Functions as a status LED on a control panel.

### Data Table Cell
**Role:** Type specimen / tabular data row

Zero radius, 1px Photon White (#ffffff) cell borders creating a wireframe grid. Alternating row borders in Reactor Yellow (#fcff76) for emphasis rows. Tabular numerals (tnum) enabled. No cell padding beyond 1-2px — density is maximum.

### Flat Dark Card
**Role:** Content panel / feature block

Zero radius, Null Black (#000000) or Plum Void (#1a0014) fill, 1px Photon White border, 15-25px padding. No shadow, no gradient. The card IS the border — the 1px line does all the structural work.

### Hyperspace Link
**Role:** Inline text link

Plasma Green (#00ff85) text, no underline by default, 1px Plasma Green bottom border on hover. Weight 400 or 700 depending on context. Links read as data signals rather than navigational chrome.

### Crimson Nav Indicator
**Role:** Active/danger nav state

1px solid Crimson Alert (#ff003d) border on a nav element — 12px high × full-width hairline strip above or beside nav items. The crimson border is the only color that conveys urgency; never use it for decoration.

### Wireframe Section Divider
**Role:** Inter-section separator

A 1px Photon White (#ffffff) full-width horizontal line at section boundaries. Created via box-shadow 0 1px 0 0 #ffffff rather than a border, allowing it to overlay without affecting layout flow.

## Do's and Don'ts

### Do
- Use 9999px border-radius for all buttons, tags, and interactive pills — pill shape is the universal interactive form in this system
- Build structure with 1px solid Photon White (#ffffff) borders, never with padding gaps or background color changes alone
- Use letter-spacing +0.70em on any text above 115px — the extreme tracking is a signature choice that makes display text read as a schematic label
- Enable OpenType features kern, ss01–ss04, and tnum on all text — the stylistic sets are integral to GT Planar's identity
- Keep padding between 1-5px for tight elements (table cells, buttons, inline tags) and 15-25px for card/section padding
- Use Reactor Yellow (#fcff76) for the most frequent border accent — it is the wireframe color, the default 'system-on' signal
- Apply Hyperspace Violet (#6100ff) only as a filled action background or dominant surface — never as a text color or subtle tint

### Don't
- Never use drop shadows, blur effects, or semi-transparent overlays — the system is wireframe-flat, all structure comes from 1px lines
- Never apply border-radius between 1px and 9998px — either zero (for structural elements: cards, tables, inputs, dividers) or fully pill (for interactive elements: buttons, tags)
- Never use Gradients, duotone effects, or background washes behind text — the canvas is always flat Null Black or a single solid chromatic surface
- Never use #6100ff as a text color or non-action accent — it is reserved exclusively for filled button backgrounds and dominant violet surfaces
- Never set body text below 14px or above 16px — GT Planar's body range is intentionally narrow
- Never center-align paragraphs or multi-line text blocks — left-align is the default and reinforces the instrument-readout metaphor
- Never use warm hues (Crimson, Amber) decoratively — Crimson is warning-only, Amber is data-only, both are functional punctuation, not atmosphere

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Null Black Canvas | `#000000` | Base page background — the flat void from which all interface elements emerge |
| 1 | Plum Void Recess | `#1a0014` | Input fields and recessed wells — distinguished from canvas by a subtle cool undertone |
| 2 | Deep Indigo Plate | `#29006c` | Elevated surface for buttons and dark panels that need to sit above the canvas |
| 3 | Ember Violet Field | `#7000ff` | Broad decorative surface wash for violet-dominant sections |
| 4 | Hyperspace Violet | `#6100ff` | Highest surface layer — the dominant chromatic plane when present |

## Elevation

- **Wireframe Divider:** `rgb(255, 255, 255) 0px 1px 0px 0px`
- **Section Frame:** `rgb(255, 255, 255) 1px 1px 0px 0px`
- **Inset Frame:** `rgb(255, 255, 255) 1px 0px 0px 0px inset, rgb(255, 255, 255) 0px 1px 0px 0px inset`

## Imagery

Imagery is almost entirely absent from the interface itself. The hero is a full-bleed procedural starfield/hyperspace animation — white light streaks radiating from a central vanishing point on pure black, evoking faster-than-light travel. There is no photography, no product photography, no lifestyle imagery. The only 'imagery' in the system is typographic specimens rendered at massive scale (115-274px) which function as both content and visual. If illustrations appear, they should be flat, line-only, technical diagrams in Photon White on Null Black — schematic, not decorative.

## Layout

Full-bleed layout with no max-width container — the interface is designed to extend to viewport edges, reinforcing the cockpit/instrument-panel metaphor. The header is a 1px-bordered row containing brand mark (left), centered warning banner, and nav cluster (right), all aligned to a single horizontal band. Hero is a full-viewport hyperspace visual with overlaid type. Content sections stack vertically with 1px white dividers between them — no padding-based separation, no card-based grouping. Text blocks left-align and run nearly edge-to-edge. The typetester section uses a dense table grid with 1px wireframe cells. Navigation is minimal: three to five pill-outlined ghost buttons in the top-right. No sidebar, no mega-menu, no footer beyond a thin wireframe line.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #000000
- Text (primary): #ffffff
- Border (default wireframe): #ffffff
- Accent (most-used border): #fcff76
- Link/active: #00ff85
- primary action: #6100ff (filled action)
- Warning: #ff003d
- Input surface: #1a0014
- Muted text/border: #949494

**3-5 Example Component Prompts**

1. Create a primary CTA: 9999px radius, filled #6100ff, white text at 14px weight 400 GT Planar, 25px vertical × 50px horizontal padding, all-caps with +0.01em letter-spacing.

2. Create a secondary outlined button: 9999px radius, 1px solid #fcff76 border, transparent fill, #ffffff text at 14px weight 400, 25px × 50px padding. The border alone carries the visual weight.

3. Create a warning banner: full-width strip, 1px solid #ff003d top and bottom borders, #000000 fill, centered text in #ffffff at 11px weight 400 GT Planar, 10px vertical padding, letter-spacing +0.025em, all-caps.

4. Create a display heading: GT Planar at 115px weight 400, #ffffff, letter-spacing +0.05em, with a 1px solid #fcff76 bottom border on the heading element. Line-height 0.90 — the tight leading makes the type feel like a schematic label.

5. Create a text input: 0px radius, #1a0014 background, 1px solid #ffffff border, 10px padding, placeholder text in #ffffff at 14px weight 400 GT Planar. No focus ring — the border simply brightens or thickens.

## Border-as-Architecture System

The most distinctive structural choice in this design system is that 1px white borders replace conventional spacing, shadows, and background differentiation. Where most interfaces use card padding and background color to separate content, GT Planar uses 1px solid #ffffff box-shadows to draw wireframe lines across the dark canvas. The result reads as a technical schematic: every element is bounded by visible linework, every division is explicit. The shadow stack pattern (1px 0 0 0, 0 1px 0 0, 1px 1px 0 0, and inset variants) allows borders to be drawn without affecting layout dimensions — the page grid stays rigid, the wireframe floats over it. This is the system's load-bearing structural decision: remove the 1px borders and the entire interface loses its identity, not just its decoration.

## Similar Brands

- **Warp Terminal** — Same full-bleed dark canvas with starfield/warp imagery and CRT-instrument typographic display
- **Cyberpunk 2077 UI (promotional site)** — Identical wireframe border system on pure black, pill-shaped outlined CTAs, and chromatic neon accents used as functional signals
- **Linear** — Same dark-mode default with high-density compact spacing and minimal-use-of-color-as-functional-punctuation approach
- **NASA Mission Control dashboards** — Same 1px white wireframe dividers, flat dark backgrounds, and color-as-status-only palette discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hyperspace-violet: #6100ff;
  --color-reactor-yellow: #fcff76;
  --color-plasma-green: #00ff85;
  --color-crimson-alert: #ff003d;
  --color-deep-indigo: #29006c;
  --color-plum-void: #1a0014;
  --color-ember-violet: #7000ff;
  --color-amber-signal: #ff8a00;
  --color-photon-white: #ffffff;
  --color-null-black: #000000;
  --color-graphite: #949494;
  --color-carbon: #606060;

  /* Typography — Font Families */
  --font-gt-planar: 'GT Planar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.25px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.63;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: 1.15px;
  --text-heading: 37px;
  --leading-heading: 1.1;
  --tracking-heading: 2.59px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 2.9px;
  --text-display: 115px;
  --leading-display: 0.9;
  --tracking-display: 5.75px;
  --text-display-xl: 187px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: 130.9px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-50: 50px;
  --spacing-58: 58px;
  --spacing-100: 100px;
  --spacing-150: 150px;

  /* Layout */
  --section-gap: 25px;
  --card-padding: 15-25px;
  --element-gap: 5px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(255, 255, 255) 1px 0px 0px 0px, rgb(255, 255, 255) 0px 1px 0px 0px, rgb(255, 255, 255) 1px 1px 0px 0px, rgb(255, 255, 255) 1px 0px 0px 0px inset, rgb(255, 255, 255) 0px 1px 0px 0px inset;

  /* Surfaces */
  --surface-null-black-canvas: #000000;
  --surface-plum-void-recess: #1a0014;
  --surface-deep-indigo-plate: #29006c;
  --surface-ember-violet-field: #7000ff;
  --surface-hyperspace-violet: #6100ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hyperspace-violet: #6100ff;
  --color-reactor-yellow: #fcff76;
  --color-plasma-green: #00ff85;
  --color-crimson-alert: #ff003d;
  --color-deep-indigo: #29006c;
  --color-plum-void: #1a0014;
  --color-ember-violet: #7000ff;
  --color-amber-signal: #ff8a00;
  --color-photon-white: #ffffff;
  --color-null-black: #000000;
  --color-graphite: #949494;
  --color-carbon: #606060;

  /* Typography */
  --font-gt-planar: 'GT Planar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.25px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.63;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: 1.15px;
  --text-heading: 37px;
  --leading-heading: 1.1;
  --tracking-heading: 2.59px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 2.9px;
  --text-display: 115px;
  --leading-display: 0.9;
  --tracking-display: 5.75px;
  --text-display-xl: 187px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: 130.9px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-50: 50px;
  --spacing-58: 58px;
  --spacing-100: 100px;
  --spacing-150: 150px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(255, 255, 255) 1px 0px 0px 0px, rgb(255, 255, 255) 0px 1px 0px 0px, rgb(255, 255, 255) 1px 1px 0px 0px, rgb(255, 255, 255) 1px 0px 0px 0px inset, rgb(255, 255, 255) 0px 1px 0px 0px inset;
}
```
