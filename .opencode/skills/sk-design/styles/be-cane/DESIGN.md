# Bécane — Style Reference
> Gallery wall on bone-white plaster

**Theme:** light

Bécane operates as a gallery wall rather than a storefront: a vast off-white canvas where models stand at human scale, type sits at whisper-small sizes, and the only chromatic punctuation is a single cycling red signal. Every element is reduced to its barest line — borders under 1px, zero radius, uppercase tracked labels — so that the photography itself becomes the architecture. The system rejects decorative UI entirely; navigation, counts, and category markers read like gallery placards rather than e-commerce chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#f6f6f6` | `--color-bone-white` | Page canvas, large background blocks |
| Divider Grey | `#e6e6e6` | `--color-divider-grey` | Hairline borders between nav rows, section dividers |
| Off-Black | `#0a0a0a` | `--color-off-black` | Headlines, body text, nav labels, button strokes |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, nav bar backgrounds, elevated panels |
| Muted Grey | `#b2b2b2` | `--color-muted-grey` | Tertiary helper text, inactive labels |
| Signal Red | `#ff0000` | `--color-signal-red` | Accent panel fills — rotating display block, category highlight surface |

## Tokens — Typography

### Eurostile Becane — Custom Eurostile variant is the sole typeface across all scales. Used uppercase at 8px with 0.04em tracking for nav, buttons, labels, and micro-copy — the high tracking and small size force labels to read as gallery placards rather than UI. Bold 30px anchors the hero 'COLLECTION' wordmark. Substitutes: Eurostile, 'Helvetica Neue', Arial — the geometric warmth of Eurostile is the closest system match; fallback to Helvetica Neue retains the uppercase utility feel. · `--font-eurostile-becane`
- **Substitute:** Eurostile, Helvetica Neue, Arial
- **Weights:** 400, 700
- **Sizes:** 8px, 12px, 30px
- **Line height:** 1.00–1.20
- **Letter spacing:** 0.0400em
- **OpenType features:** `uppercase; letter-spacing 0.04em baseline`
- **Role:** Custom Eurostile variant is the sole typeface across all scales. Used uppercase at 8px with 0.04em tracking for nav, buttons, labels, and micro-copy — the high tracking and small size force labels to read as gallery placards rather than UI. Bold 30px anchors the hero 'COLLECTION' wordmark. Substitutes: Eurostile, 'Helvetica Neue', Arial — the geometric warmth of Eurostile is the closest system match; fallback to Helvetica Neue retains the uppercase utility feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| display | 30px | 1 | 1.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 0px |
| cards | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 100px
- **Card padding:** 10px
- **Element gap:** 8-10px

## Components

### Ghost Nav Button
**Role:** Top-left brand cluster (ALL / STORIES / BÉCANE)

Transparent background, 0px radius, no padding, Off-Black 8px uppercase Eurostile tracking 0.04em. Separators are thin Off-Black text strokes, not vertical bars.

### Ghost Cart Button
**Role:** Top-right cart trigger

Same ghost treatment as nav: transparent fill, Off-Black border 0.5px implied, 0px radius. 8px uppercase label 'CART 00' — the cart count sits inline with no visual container.

### Hero Wordmark
**Role:** Section title — 'COLLECTION'

Eurostile Becane 700 at 30px, uppercase, line-height 1.0, tracking 0.04em, Off-Black. Sits flush-left with no decorative underline or accent bar — type alone carries hierarchy.

### Meta Label Row
**Role:** Section counter — 'COLLECTION 01 / 01'

8px Eurostile uppercase, Off-Black, tracking 0.04em. Functions as a gallery placard: precedes and contextualizes the headline without competing with it.

### Product Count Strip
**Role:** Footer summary — '14 PRODUCTS · DISCOVER'

Full-width row anchored bottom of viewport. Left: 8px Off-Black uppercase count. Right: 8px Muted Grey #b2b2b2 'Discover' as a quiet affordance. No button chrome — just tracked type on Bone White.

### Hairline Divider
**Role:** Vertical rhythm between nav clusters

0.5px solid #e6e6e6, full row width. Carries the only structural separation in the layout; the design refuses panels or cards in favor of single-stroke lines.

### Red Accent Panel
**Role:** Rotating chromatic display block (signal surface)

Solid #ff0000 fill, no radius, no border. Functions as the sole chromatic punctuation — appears as a small block rather than as a button background or CTA fill.

### Product Silhouette Tile
**Role:** Editorial product row — 12 figures across viewport

No container, no card, no shadow. Photographs sit directly on Bone White #f6f6f6 canvas at uniform scale, evenly spaced. The row is the product grid; there is no per-product chrome.

### Footer Link Cluster
**Role:** Bottom-right policy + contact links

Stacked 8px uppercase Off-Black labels, tracking 0.04em, zero radius, zero padding. Email link rendered the same way as policy links — no visual hierarchy between them.

## Do's and Don'ts

### Do
- Use Eurostile Becane at 8px with 0.04em tracking as the universal label size for nav, buttons, counts, and footer links
- Keep all borders at 0.5px solid #e6e6e6 — never use box-shadow, never use 1px+ strokes
- Set border-radius to 0px on every interactive element; the only rounding token is the site's own --inner-border-radius for inner cutouts, not visible UI
- Reserve #ff0000 for a single accent surface per viewport; let the rest of the page stay achromatic
- Let product photography carry layout rhythm — space tiles evenly across the full viewport rather than constraining to a fixed grid column
- Set line-height to 1.0 for the 30px wordmark and 1.1–1.2 for 8px labels — tight tracking amplifies the gallery-placard feel
- Anchor a meta-strip (count + secondary affordance) to the bottom of the viewport on category pages

### Don't
- Never add background fills, gradients, or hover-color shifts to buttons — buttons remain ghost
- Never introduce a chromatic CTA button; #ff0000 is a surface accent, not an action
- Never round corners on cards, images, or buttons — sharp 0px edges define the aesthetic
- Never use body copy below 12px or above 30px; the scale is intentionally narrow
- Never add elevation (box-shadow, drop-shadow) — the system is flat and depends on hairline borders for structure
- Never use color to indicate state on links; rely on position, weight, or the Muted Grey #b2b2b2 for de-emphasis
- Never constrain the product row to a centered max-width container — let images breathe edge-to-edge

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f6f6f6` | Full-page background, base stage for all content |
| 2 | Surface White | `#ffffff` | Nav bar, elevated panels, occasional surface breaks |
| 3 | Accent Block | `#ff0000` | Sole chromatic punctuation — rotating display surface |

## Elevation

No shadows. The system is rigorously flat; structural separation comes from 0.5px hairline borders in #e6e6e6 and from generous negative space. Elevation is communicated by background contrast (Bone White → Pure White → Signal Red) rather than by depth.

## Imagery

Product photography dominates the page as full-bleed human-scale editorial crops: twelve model silhouettes arranged in a single horizontal row across the viewport, each figure standing at uniform height on the Bone White canvas. Treatment is clean, evenly lit, fashion-editorial — figures are isolated against the page background with no lifestyle context or props. Photographs carry rounded 0px edges (no clip-path, no radius). No illustration, no icon system beyond minimal UI glyphs, no decorative graphics — the product imagery IS the visual design.

## Layout

Full-bleed page architecture with no max-width container: the header, hero meta, product row, and footer strip all span edge-to-edge. Header is a slim sticky bar (~86px) with brand cluster flush-left and cart flush-right. Hero zone is left-aligned: small uppercase meta line above an oversized 30px wordmark, both flush to the left margin with no centered alignment. Product grid is a single 12-column horizontal row where each cell is a full-bleed photograph at equal width — no gutters beyond the natural image spacing, no card chrome. Footer meta-strip is a two-line block pinned to the bottom-left of the viewport showing product count and a quiet 'Discover' affordance. Navigation is minimal: top bar only, no sidebar, no mega-menu. Section transitions are seamless — no alternating dark/light bands, no dividers between the hero and product row beyond the hairline border at the header's lower edge.

## Agent Prompt Guide

Quick Color Reference
- text: #0a0a0a
- background: #f6f6f6
- surface (elevated panel/nav): #ffffff
- border: #e6e6e6
- muted text: #b2b2b2
- accent surface: #ff0000
- primary action: no distinct CTA color

Example Component Prompts
1. Build a sticky top header: background #ffffff, 86px tall, 0px radius, 0.5px solid #e6e6e6 bottom border. Left cluster — brand 'BÉCANE' at 8px Eurostile Becane weight 700 uppercase, tracking 0.04em, color #0a0a0a. Right cluster — 'CART 00' at 8px weight 400 same styling. No button backgrounds, no padding beyond 10px vertical.
2. Build a hero wordmark block: left-aligned on #f6f6f6 canvas. Meta line 'COLLECTION 01 / 01' at 8px uppercase #0a0a0a tracking 0.04em. Below it, 'COLLECTION' at 30px Eurostile Becane weight 700 uppercase, line-height 1.0, tracking 0.04em, color #0a0a0a. No underlines, no accent bars.
3. Build a product row: full viewport width, #f6f6f6 background, 12 evenly-spaced product photographs at equal column width, 0px radius, no borders, no card containers. Row gap 0; rely on natural image whitespace.
4. Build a footer meta-strip: pinned bottom, background #f6f6f6. Left — '14 PRODUCTS' at 8px uppercase #0a0a0a tracking 0.04em. Right — 'DISCOVER' at 8px uppercase #b2b2b2 tracking 0.04em. No button chrome, no separator glyph.
5. Build a nav link group: horizontal row on #ffffff, separated by 0.5px solid #e6e6e6 hairlines. Links at 8px uppercase #0a0a0a tracking 0.04em, 10px horizontal padding, 0px radius, transparent backgrounds. Hover: color shift to #666 only — no background change.

## Similar Brands

- **Lemaire** — Same off-white canvas with zero-radius UI and Eurostile-style geometric uppercase tracked labels — both treat the page as an editorial gallery rather than a store
- **The Row** — Near-identical monochrome palette (#f6f6f6/#0a0a0a), hairline borders as the only structural element, and full-bleed product photography with no card chrome
- **Aesop** — Equal restraint in type scale (small uppercase tracked labels), achromatic surfaces, and refusal of decorative color or rounded UI — color appears only as functional punctuation
- **Toteme** — Minimal Scandinavian editorial layout with bone-white canvas, ghost navigation, and product photography as the dominant visual element rather than UI ornamentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #f6f6f6;
  --color-divider-grey: #e6e6e6;
  --color-off-black: #0a0a0a;
  --color-pure-white: #ffffff;
  --color-muted-grey: #b2b2b2;
  --color-signal-red: #ff0000;

  /* Typography — Font Families */
  --font-eurostile-becane: 'Eurostile Becane', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-display: 30px;
  --leading-display: 1;
  --tracking-display: 1.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 100px;
  --card-padding: 10px;
  --element-gap: 8-10px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-nav: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #f6f6f6;
  --surface-surface-white: #ffffff;
  --surface-accent-block: #ff0000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #f6f6f6;
  --color-divider-grey: #e6e6e6;
  --color-off-black: #0a0a0a;
  --color-pure-white: #ffffff;
  --color-muted-grey: #b2b2b2;
  --color-signal-red: #ff0000;

  /* Typography */
  --font-eurostile-becane: 'Eurostile Becane', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-display: 30px;
  --leading-display: 1;
  --tracking-display: 1.2px;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 3px;
}
```
