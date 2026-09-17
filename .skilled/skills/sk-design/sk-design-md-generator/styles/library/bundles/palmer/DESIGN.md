# Palmer — Style Reference
> Ceramic gallery in soft daylight — the interface is the wall, the objects are the art.

**Theme:** light

Palmer treats dinnerware like a museum exhibit on a warm cream canvas (#f5f6ee). The interface dissolves — no shadows, no chrome, no saturated accents — so hand-glazed ceramics become the only color in the room. Typography runs tight: TWK Lausanne at near-mono weights (300–500) with aggressive negative tracking that pulls letters together, including an enormous 120px display tier that functions more as editorial statement than UI label. Interactive elements are reduced to hairline borders and pill-shaped toggles, sitting at the edges of the viewport to leave the center completely uninterrupted. Everything below the fold assumes the same gallery logic: small text, thin rules, generous space between objects.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Gallery Cream | `#f5f6ee` | `--color-gallery-cream` | Page canvas and base surface — a warm off-white that flatters glazed ceramics more than pure white would |
| Ink | `#222222` | `--color-ink` | Primary text, hairline borders, card outlines, icon strokes — the entire structural skeleton runs through this one near-black |
| Bone | `#ffffff` | `--color-bone` | Product image backgrounds, occasional inverse surface when a card needs to sit forward of the cream canvas |
| Fog | `#a1a19c` | `--color-fog` | Muted secondary borders and low-priority text — used when Ink would be too heavy for a structural divider |
| Lampblack | `#000000` | `--color-lampblack` | Reserved for the rare filled element (active nav background, weight anchors) — used sparingly so Ink remains the default voice |

## Tokens — Typography

### TWK Lausanne — Sole typeface — handles everything from micro-labels to 120px editorial display. Weight 300 carries display and large headings (whisper-thin Swiss grotesque that lets the ceramics dominate), weight 400–500 for body and UI, weight 600–700 reserved for active states and filter labels. The tight letter-spacing (-0.04em at display, -0.02em at body) is signature: characters nestle together, giving even 11px labels a compressed, considered feel rather than airy defaults. · `--font-twk-lausanne`
- **Substitute:** Inter Tight or Neue Haas Grotesk Display Pro at matching weights
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 11px, 12px, 14px, 16px, 18px, 120px
- **Line height:** 0.90 (display), 1.40 (body)
- **Letter spacing:** -0.04em at 120px display, -0.03em at 18px, -0.02em at 11–16px
- **Role:** Sole typeface — handles everything from micro-labels to 120px editorial display. Weight 300 carries display and large headings (whisper-thin Swiss grotesque that lets the ceramics dominate), weight 400–500 for body and UI, weight 600–700 reserved for active states and filter labels. The tight letter-spacing (-0.04em at display, -0.02em at body) is signature: characters nestle together, giving even 11px labels a compressed, considered feel rather than airy defaults.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | -0.02px | `--text-caption` |
| body | 14px | 1.4 | -0.02px | `--text-body` |
| body-lg | 18px | 1.4 | -0.03px | `--text-body-lg` |
| display | 120px | 0.9 | -0.04px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 66 | 66px | `--spacing-66` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| card | 9px |
| input | 3px |
| button | 3px |
| nav-pill | 100px |

### Layout

- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Experience View Toggle
**Role:** Primary mode switcher floating top-center

Pill-shaped container (100px radius) with a 1px Ink border, 7px vertical padding, 15–16px horizontal padding. Contains a small icon (dot grid) and 'experience view' label at 12px weight 400, color Ink. Sits on the cream canvas with no background fill — it's an outlined ghost pill.

### Scattered Product Tile
**Role:** Individual ceramic piece in the main editorial canvas

Square or near-square product photograph, no border, no radius (products are cut sharp or with minimal rounding). Cast with a soft natural shadow only from the photography itself, not from CSS. Positioned at irregular intervals across the full viewport — layout is curated, not gridded.

### Bottom Control Bar
**Role:** Fixed footer with menu and filter toggles

Sits at viewport bottom center. Contains two adjacent pill buttons: 'menu' (with hamburger icon) and 'filter' (with list icon), each at 3px radius, Ink text on cream, 1px Ink border, ~12–14px type. A 'Drag to rotate' hint with zoom in/out circular buttons sits at bottom-right.

### Navigation Link
**Role:** Text link in top-left brand mark and ancillary nav

'palmer' wordmark at top-left, 16px weight 400–500, color Ink, no decoration. No traditional nav bar — secondary navigation appears contextually.

### Zoom Control
**Role:** Circular zoom in/out buttons

Two small circles, ~24px diameter, 100px radius (fully rounded), 1px Ink border on cream fill. '+' and '−' glyphs centered at 12px Ink.

### Filter Chip
**Role:** Category or attribute filter in menu mode

Outlined pill, 100px radius, 1px Ink border, 12px weight 500 label, cream background. Active state fills with Ink and inverts text to cream/white. No drop shadow, no scale on hover.

### Card Surface
**Role:** Product card used in grid/list views (non-scattered mode)

9px corner radius, 1px Ink border, 16px internal padding, cream fill (#f5f6ee). No shadow — depth comes from the border alone. Image fills top edge to edge inside the radius.

### Input Field
**Role:** Text input for search or filter

3px radius, 1px Ink border, cream fill, 14px placeholder text in Fog (#a1a19c). Focus state darkens border to Lampblack (#000000) with no ring.

## Do's and Don'ts

### Do
- Use #f5f6ee for every page background — never pure white, it flatters the ceramics and signals the editorial tone
- Set all borders to 1px solid #222222 — hairlines are the only structural separator in the system
- Reach 120px for editorial display headlines in weight 300 with -0.04em tracking — the extreme scale is part of the brand voice
- Use 100px border-radius only for pills (toggles, filter chips, zoom buttons) and 9px for cards, 3px for everything else
- Set type at weight 300–400 for display and large headings; reserve 600–700 for active/selected states only
- Keep interactive elements at the viewport edges (top-center toggle, bottom-center control bar) so the center stays open for product imagery
- Use letter-spacing -0.02em on all body sizes (11–16px) and tighten further as type scales up

### Don't
- Don't introduce any chromatic accent color — the ceramics supply all the color, the UI stays grayscale
- Don't add drop shadows to cards, buttons, or nav — borders alone define depth
- Don't use corner radius above 100px or below 3px — the three tiers (3px, 9px, 100px) are the complete system
- Don't set type at weight 600+ in display sizes — it would overwhelm the whisper-thin signature of the 120px tier
- Don't use pure black (#000000) for text — Ink (#222222) is the text color; black is reserved for filled active states
- Don't add background color to the main canvas behind product photography — flat cream is non-negotiable
- Don't use letter-spacing 0 or positive values — all text tracks negative

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Gallery Canvas | `#f5f6ee` | The base page surface — warm off-white, used everywhere as the default background |
| 1 | Card Surface | `#f5f6ee` | Cards use the same cream fill — depth comes from the 1px Ink border, not a lighter or darker shade |
| 2 | Inverse Surface | `#222222` | Rare filled-dark surface for active states and inverted sections (e.g., dark product detail panels) |

## Elevation

No shadows. Depth is communicated entirely through 1px borders and the inherent shadows in product photography. The cream canvas is flat and shadowless — any drop shadow would break the gallery-wall illusion.

## Imagery

Pure product photography — top-down or 3/4-angle shots of individual ceramic pieces (plates, bowls) on transparent or cream backgrounds. No lifestyle context, no hands, no tablescapes. Each piece is cropped with slight shadow to imply contact with a surface. Imagery is the only source of color on the site: glazed blues, olive greens, speckled whites, amber browns. Density is high but breathable — pieces are scattered with deliberate negative space between them, curatorial rather than catalog.

## Layout

Full-bleed viewport with no max-width constraint. The hero IS the product scatter: ceramic pieces distributed across the entire viewport at curated positions, not a grid. Navigation chrome is pushed to the corners (wordmark top-left, toggle top-center, control bar bottom-center), leaving the center field entirely to imagery. This is a one-screen-first experience — the scatter is the hero, and all secondary UI (menu, filter, zoom) is conditionally revealed. Section rhythm is minimal: one viewport, one scattered composition, minimal text. No traditional alternating bands.

## Agent Prompt Guide

**Quick Color Reference**
- text: #222222
- background: #f5f6ee
- border: #222222 (1px)
- muted: #a1a19c
- active fill: #000000
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Create a scattered product hero:** Full-bleed #f5f6ee canvas. Place 8–10 circular ceramic plate images at irregular positions across the viewport (no grid, no alignment). Each image ~120–200px wide, no border, no background, slight drop shadow baked into the photo only. No headline, no subtext — the products are the entire viewport.

2. **Create the experience view toggle:** Top-center of viewport, pill shape (100px radius), 1px solid #222222 border, no fill. Inside: small dot-grid icon (3×3 dots, #222222) + 'experience view' label at 12px TWK Lausanne weight 400, #222222, letter-spacing -0.02em. Horizontal padding 15px, vertical 7px.

3. **Create the bottom control bar:** Fixed to viewport bottom-center. Two adjacent ghost buttons with 3px radius, 1px #222222 border, cream fill. Left: hamburger icon (3 horizontal lines, #222222) + 'menu' label at 12px weight 500. Right: list icon (3 dots with lines) + 'filter' label at 12px weight 500. Gap between them: 4px.

4. **Create a product card (grid mode):** 9px corner radius, 1px solid #222222 border, #f5f6ee fill, 16px padding. Product image fills width, edge-to-edge inside the radius. Below image: product name at 14px weight 400, #222222, letter-spacing -0.02em. Price at 12px weight 400, #a1a19c. No shadow.

5. **Create a zoom control:** Bottom-right of viewport. Two stacked circular buttons, 24px diameter, 100px radius, 1px #222222 border, #f5f6ee fill. Top circle: '+' glyph at 12px #222222. Bottom circle: '−' glyph at 12px #222222. 4px vertical gap between them.

## Similar Brands

- **HAY (Danish furniture/design retailer)** — Same Scandinavian editorial-product approach — objects float on a warm neutral canvas with minimal typographic chrome, the catalog reads like a magazine spread
- **Menu Space (Audo Copenhagen)** — Full-bleed product photography on warm off-white, hairline borders instead of shadows, sparse Swiss-grotesque type, no traditional e-commerce navigation
- **Atelier Vime** — Artisanal ceramics presented as gallery objects — similar warm canvas, scattered composition, typographic restraint, ceramics supplying all the color
- **The New Craftsmen** — British craft retailer with editorial gallery layout, warm neutral canvas, minimal UI chrome, letting handmade objects carry the visual weight

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-gallery-cream: #f5f6ee;
  --color-ink: #222222;
  --color-bone: #ffffff;
  --color-fog: #a1a19c;
  --color-lampblack: #000000;

  /* Typography — Font Families */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.02px;
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: -0.02px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.03px;
  --text-display: 120px;
  --leading-display: 0.9;
  --tracking-display: -0.04px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-66: 66px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 9px;
  --radius-3xl: 24px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-card: 9px;
  --radius-input: 3px;
  --radius-button: 3px;
  --radius-nav-pill: 100px;

  /* Surfaces */
  --surface-gallery-canvas: #f5f6ee;
  --surface-card-surface: #f5f6ee;
  --surface-inverse-surface: #222222;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-gallery-cream: #f5f6ee;
  --color-ink: #222222;
  --color-bone: #ffffff;
  --color-fog: #a1a19c;
  --color-lampblack: #000000;

  /* Typography */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.02px;
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: -0.02px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.03px;
  --text-display: 120px;
  --leading-display: 0.9;
  --tracking-display: -0.04px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-66: 66px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 9px;
  --radius-3xl: 24px;
  --radius-full: 100px;
}
```
