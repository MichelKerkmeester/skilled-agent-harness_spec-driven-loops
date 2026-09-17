# Base — Style Reference
> Blueprint globe, blue pulse.

**Theme:** light

Base reads as a wireframe atlas on white paper: hairline vertical bars form continents across the canvas, and one electric blue marks every point of action — the logo block, filled buttons, and map data points. Typography carries the visual weight: a massive geometric display face (Doto at 115px, -0.025em tracking) headlines, while a wide-tracked monospaced label font (0.073em) pins section categories in uppercase. Surfaces stay flat and nearly borderless; structure comes from generous whitespace, a 4px-based spacing grid, and the occasional 8px-radius card. The system is overwhelmingly monochrome; blue is rationed as sharp punctuation, never used as decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Blue | `#0000ff` | `--color-electric-blue` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Wireframe Green | `#098551` | `--color-wireframe-green` | Data point accent on the world map visualization — marks growth/gas nodes against the neutral wireframe |
| Carbon | `#000000` | `--color-carbon` | Primary text, headlines, structural lines, iconography |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark or chromatic fills |
| Ash | `#f2f2f2` | `--color-ash` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Graphite | `#323232` | `--color-graphite` | Sidebar borders, strong secondary structural lines |
| Slate | `#717886` | `--color-slate` | Body text, subhead descriptions, secondary labels — the working gray for prose |
| Fog | `#999999` | `--color-fog` | Tertiary text, disabled states, low-priority metadata |
| Mist | `#b1b7c3` | `--color-mist` | Hairline borders, sidebar dividers, subtle icon outlines, nav separators |

## Tokens — Typography

### Doto — Display headline face — used at 115px with -0.025em tracking for the hero and section openers. Its geometric, rounded character is distinct from typical sans-serifs; the extremely tight line-height (0.70) lets massive type lock to a single line. Substitute: Space Grotesk or Outfit. · `--font-doto`
- **Weights:** 400, 700
- **Sizes:** 16px, 115px
- **Line height:** 0.70, 1.50
- **Letter spacing:** -0.025em at 115px, normal at 16px
- **Role:** Display headline face — used at 115px with -0.025em tracking for the hero and section openers. Its geometric, rounded character is distinct from typical sans-serifs; the extremely tight line-height (0.70) lets massive type lock to a single line. Substitute: Space Grotesk or Outfit.

### Coinbase Sans — Primary workhorse for headings, subheadings, and UI text. Weight 400 at 32-110px with aggressive negative tracking (-0.03em to -0.05em) creates tight, architectural headlines. Weight 500 for emphasis. Substitute: Inter at matching weights and tracking. · `--font-coinbase-sans`
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 15px, 16px, 32px, 80px, 110px
- **Line height:** 0.70, 1.00, 1.13, 1.14, 1.30, 1.33, 1.50
- **Letter spacing:** -0.05em at 110px, -0.03em at 80px, -0.01em at 16px, +0.01em at 12px
- **Role:** Primary workhorse for headings, subheadings, and UI text. Weight 400 at 32-110px with aggressive negative tracking (-0.03em to -0.05em) creates tight, architectural headlines. Weight 500 for emphasis. Substitute: Inter at matching weights and tracking.

### Coinbase Display — Body and navigation text. The default reading face at 14-16px with normal tracking. Calm, neutral, and built for long-form scanning. Substitute: Inter or system-ui. · `--font-coinbase-display`
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.14, 1.43, 1.50
- **Letter spacing:** normal
- **Role:** Body and navigation text. The default reading face at 14-16px with normal tracking. Calm, neutral, and built for long-form scanning. Substitute: Inter or system-ui.

### Coinbase Mono — Category labels and metadata — always uppercase with 0.073em tracking. Pins section labels like 'BASE APP', 'BASE CHAIN' above content blocks. The monospaced geometry with wide tracking creates a technical, indexical feel. Substitute: JetBrains Mono or IBM Plex Mono. · `--font-coinbase-mono`
- **Weights:** 350, 400
- **Sizes:** 12px, 14px
- **Line height:** 0.90, 1.43
- **Letter spacing:** 0.073em
- **Role:** Category labels and metadata — always uppercase with 0.073em tracking. Pins section labels like 'BASE APP', 'BASE CHAIN' above content blocks. The monospaced geometry with wide tracking creates a technical, indexical feel. Substitute: JetBrains Mono or IBM Plex Mono.

### Base Sans — Subhead and lead body text at 18px with -0.014em tracking. Slightly tighter than body for emphasis without weight change. Substitute: Inter at 18px with -0.25px tracking. · `--font-base-sans`
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.30
- **Letter spacing:** -0.014em at 18px
- **Role:** Subhead and lead body text at 18px with -0.014em tracking. Slightly tighter than body for emphasis without weight change. Substitute: Inter at 18px with -0.25px tracking.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | 0.876px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.3 | -0.252px | `--text-body-lg` |
| subheading | 32px | 1.3 | -0.32px | `--text-subheading` |
| heading | 80px | 1 | -2.4px | `--text-heading` |
| heading-lg | 110px | 0.7 | -5.5px | `--text-heading-lg` |
| display | 115px | 0.7 | -2.875px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 8px |
| panels | 8px |
| buttons | 8px |

### Layout

- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Sidebar Navigation
**Role:** Fixed left rail with logo, stacked nav items, and bottom CTA panel

~200px fixed left sidebar on white canvas. Blue logo block (40×40px, #0000ff, no radius) at top, followed by 6 nav items stacked vertically with 10px row gap. Bottom-anchored 'Start Here' panel separated by a #b1b7c3 hairline divider.

### Sidebar Nav Item
**Role:** Text label with chevron indicator

Label in Coinbase Display 16px #000000, chevron-right icon in #000000 to the right. No background, no border. 4px vertical padding. Hover state: text color shifts to #0000ff.

### Logo Block
**Role:** Brand mark at top of sidebar

Solid #0000ff square, ~40×40px, no border-radius. The only place blue appears at scale before a user-initiated action.

### Primary Filled Button
**Role:** Primary action — used for 'Get Base App →' and similar CTAs

#0000ff background, white text in Coinbase Sans 16px weight 500, 8px border-radius, 12px 16px padding. No border, no shadow. Arrow or chevron icon follows the label.

### Ghost Button
**Role:** Secondary action in the Start Here panel

White or #f2f2f2 background, #000000 text in Coinbase Display 16px weight 400, 1px #b1b7c3 border, 8px border-radius, 12px 16px padding. Full-width within the sidebar panel.

### Product Card
**Role:** Showcases a Base product (App, Build, Chain, Pay)

White surface, no visible border, 8px border-radius (subtle), 24px padding. Contains a uppercase monospace category label (Coinbase Mono 12px, 0.073em tracking, #717886) at top-left, followed by an abstract vertical-line illustration. Illustrations vary in color per product (green, pink, blue, dark blue).

### Section Header
**Role:** Opening text for each content section

Two-column layout: left column has section title in Coinbase Sans 32px weight 400 #000000 with a secondary subhead in Coinbase Sans 18px #717886; right column has body description in Coinbase Display 16px #717886. ~48px row gap between title and subhead.

### Stat Metric Row
**Role:** Data point with icon, label, and value

Small geometric icon (16px) + label text in Coinbase Display 14px #717886 on the same line. Large value below in Coinbase Sans 32px weight 400 #000000 (e.g. '$12B', '2.6B+', '200 MS'). 16px gap between icon and label, 8px between label and value.

### Category Mono Label
**Role:** Pins section identity above content blocks and product cards

Uppercase text in Coinbase Mono 12px weight 400, letter-spacing 0.073em (0.876px), color #717886. Always sits flush-left, ~16px above the content it labels.

### World Map Visualization
**Role:** Signature decorative + data element

Full-width or large container filled with hundreds of thin vertical bars (1-2px wide, variable height 4-40px) in #f2f2f2 to #b1b7c3, arranged to form a world map silhouette. Occasional colored dots (#0000ff, #098551) mark data points. No background fill — bars sit directly on the white canvas.

### Phone Mockup
**Role:** Product screenshot within the Base App section

Rounded device frame (~16px border-radius on the device body), centered in its section, showing the app interface with status bar and content. Sits on the white canvas with generous padding around it.

### Start Here Panel
**Role:** Bottom-anchored CTA group in the sidebar

Sidebar-width panel at the bottom of the left rail. Contains a 6px #0000ff dot indicator, 'START HERE' label in Coinbase Mono 12px 0.073em tracking #717886, and two stacked ghost buttons (Get Base App, Build on Base). Separated from nav items by a 1px #b1b7c3 top border.

## Do's and Don'ts

### Do
- Set display headlines at 80px, 110px, or 115px with tight negative tracking (-0.025em to -0.05em) — the extreme scale and tight tracking are the system's signature.
- Use Coinbase Mono 12px with 0.073em letter-spacing in uppercase for all category labels, section tags, and metadata.
- Reserve #0000ff for exactly three contexts: the logo block, the primary filled button, and map data points. Never use it for body text, icons, or decoration.
- Maintain a 4px-based spacing grid: 4, 8, 12, 16, 24, 32, 48px for gaps and padding.
- Use 8px border-radius for all cards, buttons, and panels — consistency across the surface system.
- Pair every section with a Coinbase Mono category label sitting 16px above the content block.
- Keep the background #ffffff across all sections; use #f2f2f2 only for elevated panels and ghost button fills.

### Don't
- Don't use #0000ff for anything other than the logo, primary action button, or map data points — overuse breaks the rationed-accent system.
- Don't use box-shadow or drop-shadow for elevation — structure comes from spacing and border, not shadow.
- Don't set body text below 14px or above 18px — the type scale jumps from 18px to 32px.
- Don't add gradients, photographic backgrounds, or 3D renders — the system is flat and schematic.
- Don't use border-radius values other than 8px (cards/buttons/panels) or 2px (small tags) — mixed radii fragment the surface system.
- Don't break the sidebar + fluid-content layout — the fixed left rail is structural, not optional.
- Don't use color to convey information hierarchy — use type weight, scale, and the Slate/Carbon contrast instead.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base background for all content |
| 1 | Panel Fill | `#f2f2f2` | Secondary panel backgrounds, ghost button fills, subtle surface elevation |
| 2 | Brand Surface | `#0000ff` | Logo block, primary action fill — only chromatic surface |

## Elevation

No shadows are used. Elevation is communicated through three surface levels only: white canvas (#ffffff) → panel fill (#f2f2f2) → brand surface (#0000ff). Structure comes from spacing, borders, and type scale, never from box-shadow.

## Imagery

Abstract line-art illustrations dominate. Product cards contain vertical-bar geometric patterns in distinct color treatments (green, pink, blue, dark blue). The signature visual is a world map rendered as hundreds of thin vertical bars forming continent silhouettes on the white canvas, with occasional #0000ff and #098551 dots marking data points. Phone mockups appear as rounded device frames showing app interfaces. No photography, no gradients, no 3D renders. Icons are minimal geometric glyphs (circle, link, layers, clock) at 16px in #000000.

## Layout

Fixed left sidebar (~200px wide) with logo block, stacked nav items with right-chevrons, and a bottom-anchored 'Start Here' CTA panel. Main content fills the remaining viewport width with generous vertical rhythm. Sections stack vertically full-width, each opening with a two-column header (title left, description right at 2/3 width), followed by full-width visualizations or 4-column card rows. Section gap is 48px. Content is left-aligned with no centered max-width container. The layout reads as a vertical scroll through discrete sections separated by whitespace rather than visible dividers.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- body text (muted): #717886
- border / divider: #b1b7c3
- accent: #0000ff
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero headline**: 'A global economy, built by all of us' in Doto 115px weight 400, #000000, letter-spacing -2.875px, line-height 0.70. White (#ffffff) background.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Product card**: White card surface, 8px radius, 24px padding. Top-left label 'BASE APP' in Coinbase Mono 12px uppercase, letter-spacing 0.876px, #717886. Below: abstract vertical-line illustration in #098551 (green bars, 2px wide, varied heights 8-60px).

4. **Section header**: Two-column layout. Left column: 'Base Chain' in Coinbase Sans 32px weight 400 #000000, with subhead 'An open network for the global economy' in Coinbase Sans 18px #717886 below (8px gap). Right column at 2/3 width: body description in Coinbase Display 16px #717886.

5. **Stat metric row**: Small 16px geometric icon in #000000 + label 'Assets on Platform' in Coinbase Display 14px #717886 on one line (8px gap). Below at 8px gap: value '$12B' in Coinbase Sans 32px weight 400 #000000.

## Similar Brands

- **Stripe** — Same monochrome white-canvas approach with a single brand accent, massive tight-tracked display headlines, and flat borderless surfaces
- **Vercel** — Minimal sidebar-plus-content layout, oversized geometric type with negative tracking, and near-zero decorative color
- **Optimism** — Fellow L2 blockchain brand using a white-atlas visual language with abstract data visualizations and a single chromatic accent
- **Coinbase** — Shared typeface family (Coinbase Sans, Coinbase Mono, Coinbase Display) and the same flat, system-token-driven design language
- **Linear** — Compact information density, 8px-radius surfaces, and typographic hierarchy that relies on scale and tracking rather than color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-blue: #0000ff;
  --color-wireframe-green: #098551;
  --color-carbon: #000000;
  --color-pure-white: #ffffff;
  --color-ash: #f2f2f2;
  --color-graphite: #323232;
  --color-slate: #717886;
  --color-fog: #999999;
  --color-mist: #b1b7c3;

  /* Typography — Font Families */
  --font-doto: 'Doto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbase-sans: 'Coinbase Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbase-display: 'Coinbase Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbase-mono: 'Coinbase Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-base-sans: 'Base Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.876px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.252px;
  --text-subheading: 32px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.32px;
  --text-heading: 80px;
  --leading-heading: 1;
  --tracking-heading: -2.4px;
  --text-heading-lg: 110px;
  --leading-heading-lg: 0.7;
  --tracking-heading-lg: -5.5px;
  --text-display: 115px;
  --leading-display: 0.7;
  --tracking-display: -2.875px;

  /* Typography — Weights */
  --font-weight-w350: 350;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Layout */
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 8px;
  --radius-panels: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-panel-fill: #f2f2f2;
  --surface-brand-surface: #0000ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-blue: #0000ff;
  --color-wireframe-green: #098551;
  --color-carbon: #000000;
  --color-pure-white: #ffffff;
  --color-ash: #f2f2f2;
  --color-graphite: #323232;
  --color-slate: #717886;
  --color-fog: #999999;
  --color-mist: #b1b7c3;

  /* Typography */
  --font-doto: 'Doto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbase-sans: 'Coinbase Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbase-display: 'Coinbase Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-coinbase-mono: 'Coinbase Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-base-sans: 'Base Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.876px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.252px;
  --text-subheading: 32px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.32px;
  --text-heading: 80px;
  --leading-heading: 1;
  --tracking-heading: -2.4px;
  --text-heading-lg: 110px;
  --leading-heading-lg: 0.7;
  --tracking-heading-lg: -5.5px;
  --text-display: 115px;
  --leading-display: 0.7;
  --tracking-display: -2.875px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
}
```
