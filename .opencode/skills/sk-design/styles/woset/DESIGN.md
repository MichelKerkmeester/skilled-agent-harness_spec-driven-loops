# Woset — Style Reference
> paper gallery in morning light — a quiet, warm-gray room where one golden accent is the only color allowed on the walls.

**Theme:** light

Woset reads as a curated art-supply shop rendered as a gallery wall: soft warm-gray canvas (#e5e7eb), monochrome black-on-gray chrome, and a single golden-yellow accent (#ecca53) that activates filter pills and key actions. Typography anchors on Macan, a geometric sans used at a whisper-tight -0.04em tracking — the 95px display headline is the loudest element on the page, then everything collapses to a quiet 15px body. The product grid trades glossy photography for hand-drawn illustrations in a generous 3-column layout with no card borders, no drop shadows, and 30px pill-radius controls. The system is intentionally restrained: one warm color, one typeface, zero elevation — every screen should feel like a well-lit page in a stationery boutique.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Soft Pebble | `#e5e7eb` | `--color-soft-pebble` | Page canvas, card surfaces, and the dominant background tone — a warm-leaning gray that reads as handmade paper rather than digital white |
| Carbon Ink | `#000000` | `--color-carbon-ink` | Primary text, nav labels, icons, and the default state of unselected interactive controls. Carries all typographic and chrome weight in the system |
| Ash | `#bbbab7` | `--color-ash` | Hairline borders and dividers on buttons and structural elements — just visible enough to define edges without ever competing with text |
| Stone | `#8d8c8a` | `--color-stone` | Muted helper text — product prices, secondary metadata, and any label that should recede behind the primary content |
| Sunlit Marigold | `#ecca53` | `--color-sunlit-marigold` | The sole chromatic accent — active filter pills, selected nav states, and the only place a UI element may be filled with color. The warmth against Soft Pebble creates an almost-handmade yellow, not a digital primary |

## Tokens — Typography

### ts-unused — ts-unused — detected in extracted data but not described by AI · `--font-ts-unused`
- **Weights:** 500
- **Sizes:** 15px
- **Line height:** 1
- **Letter spacing:** -0.02
- **Role:** ts-unused — detected in extracted data but not described by AI

### Macan — Single-family type system used for display, heading, body, nav, and UI. The signature choice is weight 500 at 95px with -0.04em tracking for the hero headline — a tight, modern geometric sans that feels like a custom craft brand, not a tech platform. Substitute with Inter (free) or Söhne (commercial) for the closest matching grotesque feel. · `--font-macan`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 15px, 24px, 25px, 95px
- **Line height:** 1.00, 1.20, 1.35
- **Letter spacing:** -3.8px at 95px, -1.0px at 25px, +1.6px at 24px, -0.3px at 15px
- **Role:** Single-family type system used for display, heading, body, nav, and UI. The signature choice is weight 500 at 95px with -0.04em tracking for the hero headline — a tight, modern geometric sans that feels like a custom craft brand, not a tech platform. Substitute with Inter (free) or Söhne (commercial) for the closest matching grotesque feel.

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.5
- **Letter spacing:** -0.02
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### A1 Gothic M — A1 Gothic M — detected in extracted data but not described by AI · `--font-a1-gothic-m`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1
- **Letter spacing:** -0.019
- **Role:** A1 Gothic M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 15px | 20.25 | -0.3px | `--text-body` |
| product-title | 24px | 32.4 | 1.6px | `--text-product-title` |
| display | 95px | 95 | -3.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| inputs | 30px |
| buttons | 30px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60px
- **Card padding:** 22px
- **Element gap:** 22px

## Components

### Top Navigation Bar
**Role:** Persistent header with three-zone layout: left nav links, centered wordmark, right utility links.

Full-bleed Soft Pebble (#e5e7eb) background, no border, no shadow. Three groups: left cluster ('Shop', 'World', 'Information' in 15px Macan weight 400 Carbon Ink), centered 'Woset' wordmark in 15px Macan weight 500, right cluster (language flag + 'En', 'Account', 'Cart (0)') in same 15px Macan. All items 22px apart, vertically centered. No hover states visible — typography does the work.

### Display Headline
**Role:** Hero-level statement that anchors the page top.

Centered, 95px Macan Medium (weight 500), Carbon Ink (#000000), line-height 1.0, letter-spacing -0.04em (-3.8px). Occupies the upper third of the viewport on its own. The tight tracking is the signature: at 95px the headline reads as a single confident breath, not a shout.

### Filter Pill — Default
**Role:** Unselected category filter button.

30px border-radius (full pill), 1px Ash (#bbbab7) border, Soft Pebble (#e5e7eb) fill, Carbon Ink text at 15px Macan weight 400. Padding 11px top / 9px bottom / 14px left/right. No shadow, no fill change on hover implied.

### Filter Pill — Active
**Role:** Selected category filter — the only filled accent on the page.

30px border-radius, no visible border (or border matches fill), Sunlit Marigold (#ecca53) fill, Carbon Ink text at 15px Macan weight 400. Same 11/9/14px padding as default. The yellow fill against the Soft Pebble canvas is the system's only color punctuation in the hero zone.

### Product Card
**Role:** Single product tile in the 3-column grid.

No border, no shadow, no background — the product image sits directly on the Soft Pebble canvas with 0px corner radius. Below the image: 22px gap, then product title in 15px Macan weight 400 Carbon Ink, followed by 4px gap, then price in 15px Macan weight 400 Stone (#8d8c8a). The image is a hand-drawn illustration (not a photo) at roughly 3:2 aspect ratio.

### Product Image
**Role:** Hero visual for each product card.

Hand-drawn or hand-lettered illustration, full-bleed within the card, 0px corner radius, no caption overlay. The illustration style is the brand — raw line work, imperfect strokes, childlike charm, occasional hand-set title lettering integrated into the artwork. Color is used inside the illustration (crayon textures, marker scribbles) but never as a UI surface.

### Language/Region Selector
**Role:** Utility control in the top nav right cluster.

15px Macan weight 400 Carbon Ink, inline flag emoji + 'En' label, no border, no background, no dropdown chrome visible at rest. Sits inline with Account and Cart links at the same baseline.

### Account/Cart Link
**Role:** Utility nav items in the top nav right cluster.

15px Macan weight 400 Carbon Ink, plain text, no underline, no icon. Cart includes a parenthetical count: 'Cart (0)'. Sits inline with the language selector, separated by the same 22px gap used throughout the nav.

## Do's and Don'ts

### Do
- Use Sunlit Marigold (#ecca53) as the only chromatic surface — one accent per viewport, never as a full-bleed background.
- Apply 30px border-radius to all interactive controls (buttons, inputs, filter pills) — the pill is the system's only shape language.
- Set hero text at 95px Macan Medium with -0.04em tracking (-3.8px) — this tight setting is what makes the headline feel custom.
- Keep all product cards borderless with 0px radius — let the hand-drawn illustration define the edge.
- Maintain 60px vertical gaps between major sections and 22px between sibling elements.
- Use Stone (#8d8c8a) at 15px for all prices and secondary metadata; Carbon Ink (#000) is reserved for primary text and labels.
- Center the hero zone (headline + filters); left-align product card metadata below each image.

### Don't
- Don't introduce additional accent colors — the system is monochrome chrome plus one warm yellow. The violet/green/red tones in product art are illustration-only.
- Don't apply drop shadows to product cards, buttons, or any UI surface — the design is flat by intent.
- Don't use font weights above 500 — Macan caps at Medium, and heavier weights would break the quiet, geometric feel.
- Don't add card backgrounds or borders to product tiles — the Soft Pebble canvas is the only surface.
- Don't use letter-spacing looser than -0.02em for body text or -0.04em for display — the system is deliberately tight-tracked.
- Don't add a secondary CTA color, gradient, or filled black button — the only filled accent is Sunlit Marigold.
- Don't left-align the hero headline or add a hero image — the centered text-only hero is a signature.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#e5e7eb` | The single background for the entire site — full-bleed Soft Pebble with no variation between hero, grid, or footer. |
| 2 | Active Filter Surface | `#ecca53` | Sunlit Marigold fill used exclusively for the selected filter pill — the only elevated color surface in the system. |

## Elevation

The system is deliberately flat. No drop shadows, no glow effects, no elevation tokens. Separation is achieved through the warm-gray canvas color and 1px Ash borders on interactive controls. Product cards rely on the hand-drawn illustration itself to define their edge, not on shadow or border.

## Imagery

Imagery is the brand identity: every product is presented as a hand-drawn or hand-lettered illustration, not a photograph. The illustration style is intentionally imperfect — visible pencil texture, slightly wobbly line work, childlike charm, and integrated hand-set title typography within the artwork. Color appears inside the illustrations (crayon multi-color, marker scribbles, watercolor washes) but is never used as a UI surface. Product images are full-bleed within their card with sharp 0px corners. There is no lifestyle photography, no staged scenes, no human models — the artwork IS the product, and the page is a gallery wall for it.

## Layout

Centered max-width 1200px container on a full-bleed Soft Pebble canvas. Hero is a single centered 95px headline with no supporting visual, followed by a centered row of filter pills — no sidebars, no asymmetric hero. Product grid is a clean 3-column layout with generous gutters, no card chrome (no border, no shadow, no background fill). Vertical rhythm uses 60px section gaps and 22px element gaps. Navigation is a single top bar with three zones (left nav, centered wordmark, right utilities) — no sticky behavior, no mega-menu. The page reads as a single editorial column with a product gallery below the headline.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Carbon Ink)
- background: #e5e7eb (Soft Pebble)
- border: #bbbab7 (Ash)
- muted text: #8d8c8a (Stone)
- accent: #ecca53 (Sunlit Marigold)
- primary action: #ecca53 (filled action)

Example Component Prompts:
1. Hero headline — Centered 95px Macan Medium (#000), line-height 1.0, letter-spacing -3.8px. Sits on #e5e7eb canvas, 60px above the filter row.
2. Active filter pill — 30px radius, #ecca53 fill, #000 text at 15px Macan weight 400, padding 11px top / 9px bottom / 14px sides, no border.
3. Default filter pill — 30px radius, #e5e7eb fill, 1px #bbbab7 border, #000 text at 15px Macan weight 400, same 11/9/14px padding.
4. Product card — 0px radius, no border, no shadow, no background. Image fills the tile at 3:2 aspect. 22px below: product title in 15px Macan weight 400 #000, then price in 15px Macan weight 400 #8d8c8a.
5. Top nav bar — Full-bleed #e5e7eb, no border. Left: 'Shop · World · Information' in 15px Macan weight 400 #000, 22px apart. Center: 'Woset' wordmark in 15px Macan weight 500. Right: language selector, 'Account', 'Cart (0)' — all 15px Macan weight 400 #000, 22px apart.

## Similar Brands

- **Areaware** — Same gallery-wall approach to commerce — products as curated objects on a neutral canvas, illustrated or designerly rather than photographic, with minimal chrome and no shadow.
- **Schoolhouse** — Same soft warm-gray canvas with monochrome type and a single restrained palette; both treat the product grid as a quiet editorial spread rather than a busy marketplace.
- **The Citizenry** — Same centered max-width layout, generous 60px section gaps, and typographic-first hero with no hero image — craft brand with editorial restraint.
- **Toast** — Same single warm accent against a neutral background, tight geometric sans at large display sizes, and a product-first grid that lets the imagery carry the page.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-soft-pebble: #e5e7eb;
  --color-carbon-ink: #000000;
  --color-ash: #bbbab7;
  --color-stone: #8d8c8a;
  --color-sunlit-marigold: #ecca53;

  /* Typography — Font Families */
  --font-ts-unused: 'ts-unused', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-macan: 'Macan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-a1-gothic-m: 'A1 Gothic M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 20.25;
  --tracking-body: -0.3px;
  --text-product-title: 24px;
  --leading-product-title: 32.4;
  --tracking-product-title: 1.6px;
  --text-display: 95px;
  --leading-display: 95;
  --tracking-display: -3.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60px;
  --card-padding: 22px;
  --element-gap: 22px;

  /* Border Radius */
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 30px;
  --radius-buttons: 30px;

  /* Surfaces */
  --surface-page-canvas: #e5e7eb;
  --surface-active-filter-surface: #ecca53;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-soft-pebble: #e5e7eb;
  --color-carbon-ink: #000000;
  --color-ash: #bbbab7;
  --color-stone: #8d8c8a;
  --color-sunlit-marigold: #ecca53;

  /* Typography */
  --font-ts-unused: 'ts-unused', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-macan: 'Macan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-a1-gothic-m: 'A1 Gothic M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 20.25;
  --tracking-body: -0.3px;
  --text-product-title: 24px;
  --leading-product-title: 32.4;
  --tracking-product-title: 1.6px;
  --text-display: 95px;
  --leading-display: 95;
  --tracking-display: -3.8px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-3xl: 30px;
}
```
