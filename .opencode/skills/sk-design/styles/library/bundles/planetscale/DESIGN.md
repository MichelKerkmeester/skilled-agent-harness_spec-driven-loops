# PlanetScale — Style Reference
> Terminal man-page in daylight

**Theme:** light

PlanetScale's design system is a developer-first, terminal-flavored monospace UI: the entire interface speaks in fixed-width type, giving every screen the texture of a well-formatted README. The palette is overwhelmingly achromatic — deep charcoal text on near-white canvas, with a vivid orange as the sole action accent and a restrained blue for links. Surfaces are flat and borderless; hierarchy is built through type weight, spacing, and the occasional hairline rule rather than shadow or elevation. Components feel lightweight and utilitarian: pill-shaped buttons, plain text links, raw grid tables, and no decorative chrome. The result reads like a developer tool's reference page, not a marketing brochure — confidence comes from typographic discipline and generous whitespace, not from color or illustration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal | `#414141` | `--color-charcoal` | Primary body text, icon strokes, footer copy, nav labels |
| Ink Black | `#000000` | `--color-ink-black` | Headings, strong emphasis, logo mark, maximum-contrast text |
| Graphite | `#737373` | `--color-graphite` | Muted body text, captions, secondary metadata, image alt text |
| Fog | `#c1c1c1` | `--color-fog` | Hairline borders, table dividers, nav separators, disabled strokes |
| Off-White | `#fafafa` | `--color-off-white` | Page canvas, card surfaces, input backgrounds |
| Obsidian | `#111111` | `--color-obsidian` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Ember | `#f35815` | `--color-ember` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Signal Blue | `#0b6ec5` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Amber | `#f2b600` | `--color-amber` | Announcement banner highlight, feature tag accent, promotional inline marker |

## Tokens — Typography

### ui-monospace — Universal type family — used for ALL text including headings, body, nav, buttons, and tabs. The monospace-only choice is the system's signature: it forces uniform character widths across the entire interface, giving the page the rhythm of a code editor or man page rather than a traditional marketing site. Weight 500–600 for headings, 400 for body, 700 sparingly for emphasis. Negative letter-spacing (-0.006em) tightens glyphs just enough to avoid the loose feel of raw terminal output. · `--font-ui-monospace`
- **Substitute:** SF Mono, Menlo, Consolas, "Liberation Mono", monospace
- **Weights:** 400, 500, 600, 700
- **Sizes:** 16px
- **Line height:** 1.00, 1.25, 1.50
- **Letter spacing:** -0.006em
- **Role:** Universal type family — used for ALL text including headings, body, nav, buttons, and tabs. The monospace-only choice is the system's signature: it forces uniform character widths across the entire interface, giving the page the rhythm of a code editor or man page rather than a traditional marketing site. Weight 500–600 for headings, 400 for body, 700 sparingly for emphasis. Negative letter-spacing (-0.006em) tightens glyphs just enough to avoid the loose feel of raw terminal output.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 21 | -0.084px | `--text-body-sm` |
| body | 16px | 24 | -0.096px | `--text-body` |
| subheading | 18px | 27 | -0.108px | `--text-subheading` |
| heading-sm | 24px | 32 | -0.144px | `--text-heading-sm` |
| heading | 32px | 40 | -0.192px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |

### Layout

- **Page max-width:** 960px
- **Section gap:** 56px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Ember CTA Button
**Role:** Primary action trigger — highest-priority conversion element

Filled pill button: #f35815 background, #fafafa text, 9999px border-radius, ui-monospace weight 600, ~14px size. Padding 8px 16px. No border. The only chromatic fill in the entire system — its orange warmth is deliberately the loudest thing on screen.

### Ghost Nav Button
**Role:** Secondary action in navigation bar

Text-only button: #414141 text, transparent background, no border. ui-monospace weight 500, 14px. Sits beside the Ember CTA as the quieter "Get started" path.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width dark band (#111111 or #000000 background), #fafafa text at 14px ui-monospace. A specific phrase is highlighted with #f2b600 background and #111111 text, creating an inline amber pill. Padding 8px vertical, centered content.

### Inline Link
**Role:** Hyperlink within body copy and navigation

#0b6ec5 text, no underline by default, ui-monospace inherits body size and weight. On hover, underline may appear. This is the only blue element in the system — it carries all navigational and reference linking.

### Top Navigation Bar
**Role:** Primary site navigation

#fafafa background, no shadow or border. Logo (left), menu items (center, 14px ui-monospace #414141, separated by ~24px gaps with small dropdown carets), auth/CTA cluster (right: "Log in" ghost text, "Get started" ghost, "Get in touch" Ember CTA). Height ~56px.

### Customer Logo Grid
**Role:** Social proof — displaying companies using the product

Multi-row grid (5 columns, 4+ rows). Each cell has a thin #c1c1c1 or #e5e5e5 border, #fafafa fill, ~80px height, padding 16px. Logos are displayed at native brand colors (not monochrome) to preserve recognizability — this grid is the most colorful area of the entire site.

### Testimonial Quote
**Role:** Single-customer endorsement with attribution

#414141 quote text at 16px ui-monospace, indented with em-dash attribution line in #737373 at 14px. No card chrome, no background — sits directly on canvas. The quote may be wrapped in quotation marks or left bare.

### Tabbed Content Panel
**Role:** Switchable product sections (Vitess / Postgres / Nekil)

Horizontal tab bar: active tab has #111111 background with #fafafa text; inactive tabs have transparent background with #414141 text. No border-radius on tabs. Below the tabs, a content area with #fafafa background, body text, and optional code/diagram block. Tabs separated by hairline #c1c1c1 borders.

### Code or Data Block
**Role:** Terminal output, SQL, or architecture diagram placeholder

Light gray panel (#f2b600 or #e5e5e5 background variant), monospace text centered, represents system architecture or query output. No syntax highlighting complexity — simple monospaced label like "VTGate" on a neutral band.

### Headline Block
**Role:** Section-level heading with supporting paragraph

Heading at 24–32px ui-monospace weight 600, #000000. A vertical accent bar (2px #f35815) sits to the left of the headline — a signature decorative mark. Body copy follows at 16px weight 400, #414141, max-width constrained to reading measure.

### Accent Bar
**Role:** Visual prefix marking a notable headline or callout

2px wide, ~24px tall vertical bar in #f35815 (orange), positioned flush-left to a headline. Functions as the system's only decorative element — replaces the need for icons, badges, or colored headings.

## Do's and Don'ts

### Do
- Set border-radius to 9999px on all buttons and tags; 0px on cards, inputs, tabs, and panels
- Use #f35815 exclusively as a filled button background — never as text color, border, or decorative fill
- Write all UI text in ui-monospace at weight 400 for body and 500–600 for headings; never use a proportional font
- Anchor section headlines with a 2px #f35815 left bar before the text starts
- Default link color to #0b6ec5; do not style links as buttons or add backgrounds to inline links
- Keep page content within a 960px max-width centered column; let the canvas breathe with 56px section gaps
- Use the announcement banner pattern (#111111 band with #f2b600 inline highlight) for top-of-page promotions

### Don't
- Do not introduce proportional fonts (Inter, Helvetica, etc.) — the monospace-only identity is load-bearing
- Do not use #0b6ec5 as a filled button or CTA background — it is link color only
- Do not add drop shadows, glows, or elevation effects — surfaces must remain flat
- Do not use #f2b600 as a background for cards, buttons, or large surfaces — it is an inline accent marker only
- Do not round card corners, input fields, or tab panels — keep them sharp (0px radius)
- Do not stack more than one chromatic color in a single component — the system is monochromatic plus one accent
- Do not use color to indicate state (hover, active, disabled) — rely on weight changes, underlines, and background inversions

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` | Page background, default surface for all content |
| 1 | Card Cell | `#fafafa` | Logo grid cells and content panels — same as canvas, defined by hairline borders |
| 2 | Accent Banner | `#f2b600` | Announcement highlight pill — inline emphasis, not a full surface |
| 3 | Inverse Band | `#111111` | Dark announcement strip, active tab background, high-contrast panels |

## Elevation

The system is deliberately flat: no drop shadows, no glows, no z-axis layering. Depth is communicated through hairline borders, background color inversions, and typographic weight changes. Components sit directly on the canvas — borders separate regions, shadows do not.

## Imagery

The site is nearly imageless by design. The primary visual content is text itself, rendered in monospace to carry visual weight. The only repeated imagery is the customer logo grid, which displays partner brand logos in their native colors — a deliberate exception to the monochrome palette, since recognizability matters more than consistency in social proof. There is no photography, no illustration, no product screenshots, and no abstract graphics. Where a diagram would appear (e.g., the VTGate architecture block), a simple labeled rectangle in a neutral fill stands in for a real illustration.

## Agent Prompt Guide

**Quick Color Reference**
- text: #414141
- background: #fafafa
- border: #c1c1c1
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- link: #0b6ec5 (Signal Blue)
- primary action: no distinct CTA color

**3–5 Example Component Prompts**
1. **Headline with accent bar**: Left-aligned 24px ui-monospace weight 600, #000000, preceded by a 2px-wide 24px-tall #f35815 vertical bar with 8px right gap. Body copy below at 16px weight 400, #414141, line-height 1.5.


3. **Inline link**: #0b6ec5 text, ui-monospace inheriting body size/weight, no underline at rest. Sits flush within body copy at #414141.

4. **Customer logo grid cell**: 960px container divided into 5 equal columns, each cell with 1px #c1c1c1 border, #fafafa fill, 16px padding, ~80px min-height. Logos rendered at native brand color.

5. **Tabbed section header**: 3 equal-width tabs in a row. Active tab: #111111 background, #fafafa text. Inactive: transparent background, #414141 text. Tabs separated by 1px #c1c1c1 bottom border. No border-radius.

## Similar Brands

- **Fly.io** — Same developer-targeted monospace-only interface with a near-monochrome palette and a single warm accent color for CTAs
- **Tailscale** — Text-dense, documentation-flavored layout with minimal imagery, sharp corners, and hairline-bordered grid cells
- **Cloudflare Workers** — Terminal-inspired type system with orange brand accent, flat surfaces, and code-block-centric content sections
- **Supabase** — Monospace-forward developer brand with a single emerald accent and generous whitespace between text sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal: #414141;
  --color-ink-black: #000000;
  --color-graphite: #737373;
  --color-fog: #c1c1c1;
  --color-off-white: #fafafa;
  --color-obsidian: #111111;
  --color-ember: #f35815;
  --color-signal-blue: #0b6ec5;
  --color-amber: #f2b600;

  /* Typography — Font Families */
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 21;
  --tracking-body-sm: -0.084px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.096px;
  --text-subheading: 18px;
  --leading-subheading: 27;
  --tracking-subheading: -0.108px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 32;
  --tracking-heading-sm: -0.144px;
  --text-heading: 32px;
  --leading-heading: 40;
  --tracking-heading: -0.192px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 960px;
  --section-gap: 56px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tabs: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #fafafa;
  --surface-card-cell: #fafafa;
  --surface-accent-banner: #f2b600;
  --surface-inverse-band: #111111;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal: #414141;
  --color-ink-black: #000000;
  --color-graphite: #737373;
  --color-fog: #c1c1c1;
  --color-off-white: #fafafa;
  --color-obsidian: #111111;
  --color-ember: #f35815;
  --color-signal-blue: #0b6ec5;
  --color-amber: #f2b600;

  /* Typography */
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 21;
  --tracking-body-sm: -0.084px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.096px;
  --text-subheading: 18px;
  --leading-subheading: 27;
  --tracking-subheading: -0.108px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 32;
  --tracking-heading-sm: -0.144px;
  --text-heading: 32px;
  --leading-heading: 40;
  --tracking-heading: -0.192px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
