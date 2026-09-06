# A-dam — Style Reference
> morning surf over a curated product shelf — a light, airy canvas where honest basics and ocean-toned photography do the talking.

**Theme:** light

A-dam speaks through a quiet, honest visual language: a morning sky of off-white and warm gray frames products like specimens on a clean shelf. The dark navy (#000e1f) anchors every text surface with calm authority, while a single saturated blue (#0000c5) appears only in the announcement bar — a deliberate exclamation against an otherwise hushed palette. GT Walsheim Pro at weight 900 and 70px with a 1.00 line-height gives display headlines presence without shouting, the tight leading turning huge type into graphic blocks. Pill-shaped buttons (30px radius) and flat product cards create a friendly, approachable surface where imagery — full-bleed beach photography, material flat-lays, and clean product shots — carries the emotional weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midcurrent Navy | `#000e1f` | `--color-midcurrent-navy` | Primary text, filled buttons, rating widget, icon strokes — the workhorse dark surface that grounds every interface layer |
| Deep Cobalt | `#0000c5` | `--color-deep-cobalt` | Announcement bar surface and occasional accent punctuation — saturated blue used sparingly to break an otherwise monochrome frame |
| Twilight Slate | `#1a2635` | `--color-twilight-slate` | Secondary borders and emphasis dividers — a near-gray that steps up from Midcurrent Navy for subtle layering without contrast jumps |
| Graphite | `#000000` | `--color-graphite` | Icon fills, nav text, and footer ink — pure black reserved for the smallest functional elements where maximum punch is needed |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, product tile backgrounds, nav bar canvas, and inverted text on dark fills |
| Morning Mist | `#f4f4f4` | `--color-morning-mist` | Page canvas and elevated card background — the warm off-white that gives the entire site its soft, lived-in brightness |
| Cloud Veil | `#e6e7e9` | `--color-cloud-veil` | Dominant hairline border for cards, icons, links, and image frames — the quietest structural line in the system |
| Soft Stone | `#dcdddf` | `--color-soft-stone` | List dividers, secondary borders, and badge outlines — one step darker than Cloud Veil for hierarchy between hairline and emphasis |
| Slate Gray | `#666e79` | `--color-slate-gray` | Muted helper text, secondary copy, and link text in resting state — cool gray that recedes behind primary navy content |
| Sunbeam | `#fff48d` | `--color-sunbeam` | Star-rating fills and small highlight washes — the only warm color in the system, kept tiny and functional |

## Tokens — Typography

### GT Walsheim Pro — Primary brand typeface across all UI roles. The 900 weight is the signature — it powers the 70px display headlines with architectural density. Geometric humanist forms give the brand a friendly, modern voice; the wide weight range (400 for body, 900 for display) lets a single family carry every level of emphasis. · `--font-gt-walsheim-pro`
- **Substitute:** Outfit or Inter — both share GT Walsheim's geometric warmth and broad weight range
- **Weights:** 400, 500, 700, 900
- **Sizes:** 11, 12, 13, 15, 16, 20, 26, 30, 38, 44, 70
- **Line height:** 1.00–1.40
- **Letter spacing:** normal across the entire scale; GT Walsheim's built-in metrics are designed to work without custom tracking adjustments
- **Role:** Primary brand typeface across all UI roles. The 900 weight is the signature — it powers the 70px display headlines with architectural density. Geometric humanist forms give the brand a friendly, modern voice; the wide weight range (400 for body, 900 for display) lets a single family carry every level of emphasis.

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400, 700
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.4
- **Role:** Arial — detected in extracted data but not described by AI

### GT-Walsheim-Pro — GT-Walsheim-Pro — detected in extracted data but not described by AI · `--font-gt-walsheim-pro`
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.2
- **Role:** GT-Walsheim-Pro — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading-sm | 26px | 1.2 | — | `--text-heading-sm` |
| heading | 30px | 1.1 | — | `--text-heading` |
| heading-lg | 44px | 1.1 | — | `--text-heading-lg` |
| display | 70px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 77 | 77px | `--spacing-77` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 30px |
| cards | 0px |
| links | 30px |
| inputs | 30px |
| buttons | 30px |
| productTiles | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 16px
- **Element gap:** 10px

## Components

### Announcement Bar
**Role:** Full-width strip pinned above the navigation for promotional or shipping messages

Deep Cobalt (#0000c5) background, Paper White (#ffffff) text at 12-13px / 1.40, GT Walsheim 400. Center-aligned message flanked by left/right arrow controls. Height approximately 32-40px. No border, sits flush against the nav below.

### Top Navigation
**Role:** Primary site navigation with centered logo

Paper White (#ffffff) background, no shadow. Left-aligned text links (Shop, Campaigns, Over ons, Loyalty) in Graphite (#000000) at 13-15px. Centered brand wordmark with small icon. Right-aligned utility cluster: currency selector (EUR €), language dropdown (Nederlands), account icon, search icon, cart icon — all in Graphite. Height approximately 60-72px.

### Hero Banner
**Role:** Full-bleed lifestyle image with text overlay

Edge-to-edge photography with a 16:7 to 21:9 aspect ratio. Overlay text block anchored bottom-left on the image: small uppercase label (11-13px, weight 500) above a large headline (38-44px, weight 700, #ffffff). No gradient overlay — the text sits directly on the photograph. Minimum viewport height covers the full first screen.

### Product Card
**Role:** Individual product tile in collection grids

Flat white (#ffffff) surface on the Morning Mist (#f4f4f4) canvas. No border, no shadow, no border-radius. Product photo fills the upper portion with generous whitespace around it. Below: brand mark 'A-dam' in 11px Graphite, product name in 13-15px Midcurrent Navy, price in 13px Slate Gray, and a 5-star Sunbeam rating with numeric count in parentheses (e.g., '[4.2]'). Vertical padding 16px.

### Category Card
**Role:** Larger featured product card for premium or collection groupings

Paper White (#ffffff) surface on Morning Mist canvas, no radius. Larger product photo occupies the full card. Product name displayed in bold Midcurrent Navy at 16-20px centered below the image. No price or rating — category cards focus on identity rather than transaction.

### Pill Button
**Role:** Primary call-to-action button

30px border-radius (full pill). Midcurrent Navy (#000e1f) fill with Paper White text at 14-16px / 1.20, weight 500. Horizontal padding approximately 16-24px, vertical padding 10-12px. No border, no shadow. Sits flat on any surface.

### Ghost Link Button
**Role:** Secondary or tertiary action with minimal visual weight

30px border-radius. Transparent fill, Twilight Slate (#1a2635) or Midcurrent Navy text at 14-16px, weight 500. Optional 1px border in Cloud Veil (#e6e7e9). Behaves like a pill in shape but reads as text — used for filters, navigation, and low-emphasis actions.

### Star Rating Display
**Role:** Product review rating with numeric score

Row of 5 small Sunbeam (#fff48d) filled stars at approximately 12-14px width each. Score in parentheses (e.g., '(4.2)') in Slate Gray at 11-13px, sitting to the right of the star row. No background, no border.

### Trust Widget
**Role:** Floating third-party review indicator

Midcurrent Navy (#000e1f) circular badge, approximately 56-64px diameter, anchored to the bottom-left of the viewport. Contains a Paper White star icon, '4.40' score in white at 13px weight 700, and 'Good' label at 11px. Sits over content without a shadow.

### Text Headline Section
**Role:** Centered editorial section break with supporting copy

Morning Mist (#f4f4f4) background extending full-bleed. Headline in Midcurrent Navy at 30-44px / 1.10, weight 700, centered. Body copy in Slate Gray at 16px / 1.40, centered, max-width approximately 640-720px. Vertical padding 48-80px top and bottom.

### Sustainability Split Section
**Role:** Asymmetric content block pairing mission text with material photography

Morning Mist (#f4f4f4) background. Left column: headline in Midcurrent Navy at 26-30px, body in Slate Gray at 16px. Right column: full-bleed flat-lay photograph of raw materials (wood, cotton, powder, textile offcuts) on a white surface. No card, no border between columns — the image bleeds to the right edge.

### Search Input
**Role:** Search field in the header or overlay search panel

Paper White (#ffffff) fill with 1px Cloud Veil (#e6e7e9) border, 30px border-radius (pill). Placeholder text in Slate Gray at 14-16px. Horizontal padding 16-20px, height approximately 40-44px. No focus ring color specified — rely on the neutral border darkening to Soft Stone.

## Do's and Don'ts

### Do
- Use GT Walsheim Pro weight 900 at 70px / 1.00 for display headlines — the tight leading makes huge type read as a graphic block
- Set border-radius to 30px on all buttons, inputs, tags, and pill links — the pill shape is the system's tactile signature
- Keep product cards flat: no border, no shadow, no border-radius, just white surface on Morning Mist canvas
- Use Midcurrent Navy (#000e1f) for all primary text and filled buttons — never let body copy drop to Slate Gray when full emphasis is needed
- Reserve Deep Cobalt (#0000c5) for the announcement bar surface and micro-accent moments only — it is an exclamation, not a fill
- Use hairline Cloud Veil (#e6e7e9) borders for card edges, image frames, and list dividers — this is the most-used color in the system
- Use Sunbeam (#fff48d) exclusively for star-rating fills — never as a button background, section fill, or text color

### Don't
- Don't add drop shadows to product cards, category cards, or buttons — the system is intentionally shadowless
- Don't apply custom letter-spacing to GT Walsheim — its built-in tracking is part of the design; override only if a specific optical correction is needed
- Don't use Deep Cobalt for body text or large fills — it belongs in the 32-40px announcement strip
- Don't introduce rectangular button radii — the 30px pill is the only shape buttons take
- Don't place dark navy on dark navy without sufficient contrast separation — the system relies on light-on-dark and dark-on-light pairing
- Don't use system Arial or sans-serif as substitutes for GT Walsheim in display or heading roles — fall back to Outfit or Inter, which preserve geometric warmth
- Don't fill the page with color — the palette is 95% neutrals; let the one cobalt bar and the tiny sunbeam stars carry all chromatic punctuation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f4f4f4` | The site-wide background; everything sits on this warm off-white plane |
| 1 | Product Card | `#ffffff` | White tile that lifts individual products and category cards off the canvas |
| 2 | Elevated Brand | `#000e1f` | Dark navy surface for the announcement bar and rating widget — the only dark UI surface in the system |
| 3 | Brand Accent | `#0000c5` | Cobalt surface for the announcement strip — a single accent layer that draws the eye upward |

## Elevation

The system is intentionally shadowless. Product cards, category cards, and buttons all sit flat on their surfaces — depth is communicated through surface color contrast (white on Morning Mist) rather than drop shadows. The only non-flat treatments are the 30px pill radii on interactive elements, which provide form through shape rather than elevation.

## Imagery

The site runs on three distinct photography modes. Hero and section banners are full-bleed lifestyle imagery — bright, high-key, outdoor scenes (a man mid-leap over turquoise ocean under a cloudless blue sky) that carry the brand's energy and freedom narrative. Product shots are isolated, neutral-background, product-only — the garment IS the subject, no models, no props, generous whitespace. Sustainability sections use flat-lay material photography — raw ingredients (wood rounds, cotton tufts, white powder, dark textile scraps) arranged linearly on a white surface, shot from above. All photography shares a bright, natural-lit quality. Icons are minimal and stroke-based in Graphite or Midcurrent Navy, roughly 1.5-2px stroke weight, never filled with color.

## Layout

The page opens with a full-bleed hero (edge-to-edge photograph, no max-width constraint), then drops into a max-width 1200px centered content frame for the rest of the page. Product collections display in a 5-column grid for the main line and a 4-column grid for premium or category groupings, with cards sitting directly on the Morning Mist canvas with no gaps between rows. Text sections are centered stacks with a max-width of approximately 640-720px for readability. The sustainability section breaks the grid with a two-column asymmetric split (text-left, image-right) where the image bleeds to the right edge. Section rhythm is steady: flat Morning Mist bands separated by hairline Cloud Veil dividers, with generous 48-80px vertical padding between sections. The top nav is a simple horizontal bar — left links, centered logo, right utilities — with no mega-menu or sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000e1f (Midcurrent Navy)
- background: #f4f4f4 (Morning Mist canvas) / #ffffff (Paper White cards)
- border: #e6e7e9 (Cloud Veil hairline)
- accent: #0000c5 (Deep Cobalt, announcement bar only)
- star highlight: #fff48d (Sunbeam, ratings only)
- primary action: #0000c5 (filled action)

**Example Component Prompts**

1. *Hero banner:* Full-bleed lifestyle photograph (16:9 or wider). Bottom-left overlay: small uppercase label 'SUSTAINABLE BASICS' at 11px GT Walsheim weight 500, white (#ffffff). Below it, headline 'Made for the long run' at 44px weight 700, #ffffff, line-height 1.10. No gradient scrim — text sits directly on the photo.

2. *Product card:* White (#ffffff) surface on #f4f4f4 canvas. No border, no shadow, no border-radius. Product photo centered with 16px padding on all sides. Below image: 'A-dam' in 11px #000000, product name in 15px #000e1f, price in 13px #666e79. Star row: 5 Sunbeam (#fff48d) stars at 12px width with '(4.2)' in 11px #666e79.

3. Create a Primary Action Button: #0000c5 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. *Text headline section:* Full-width #f4f4f4 background, vertical padding 64px. Centered headline at 30px weight 700, #000e1f, line-height 1.10. Body copy at 16px #666e79, max-width 640px, centered, line-height 1.40.

5. *Announcement bar:* Full-width #0000c5 strip, height 36px. Centered white text at 12px weight 400. Left/right arrow chevrons in white at the edges.

## Similar Brands

- **Organic Basics** — Same sustainability-meets-basics language: flat product cards on light neutral canvas, single dark brand color, minimal chrome, and lifestyle photography that lets the product breathe
- **Everlane** — Shared product-grid density and monochrome restraint, with a single accent color used as brand punctuation rather than functional fill
- **Paka** — Similar light-canvas product showcase with full-bleed lifestyle hero and flat unbordered product tiles — the ocean-meets-wardrobe mood is closely matched
- **Colorful Standard** — Same product-grid rhythm and clean off-white canvas, with category cards that prioritize product identity over price and rating

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midcurrent-navy: #000e1f;
  --color-deep-cobalt: #0000c5;
  --color-twilight-slate: #1a2635;
  --color-graphite: #000000;
  --color-paper-white: #ffffff;
  --color-morning-mist: #f4f4f4;
  --color-cloud-veil: #e6e7e9;
  --color-soft-stone: #dcdddf;
  --color-slate-gray: #666e79;
  --color-sunbeam: #fff48d;

  /* Typography — Font Families */
  --font-gt-walsheim-pro: 'GT Walsheim Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --text-display: 70px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-77: 77px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-tags: 30px;
  --radius-cards: 0px;
  --radius-links: 30px;
  --radius-inputs: 30px;
  --radius-buttons: 30px;
  --radius-producttiles: 0px;

  /* Surfaces */
  --surface-page-canvas: #f4f4f4;
  --surface-product-card: #ffffff;
  --surface-elevated-brand: #000e1f;
  --surface-brand-accent: #0000c5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midcurrent-navy: #000e1f;
  --color-deep-cobalt: #0000c5;
  --color-twilight-slate: #1a2635;
  --color-graphite: #000000;
  --color-paper-white: #ffffff;
  --color-morning-mist: #f4f4f4;
  --color-cloud-veil: #e6e7e9;
  --color-soft-stone: #dcdddf;
  --color-slate-gray: #666e79;
  --color-sunbeam: #fff48d;

  /* Typography */
  --font-gt-walsheim-pro: 'GT Walsheim Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --text-display: 70px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-77: 77px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 30px;
}
```
