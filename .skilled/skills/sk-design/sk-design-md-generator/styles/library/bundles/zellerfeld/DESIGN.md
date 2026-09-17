# Zellerfeld — Style Reference
> Sculptor's atelier on white marble — monolithic plinth surfaces, single cobalt spark, lowercase whispers from floor to ceiling.

**Theme:** light

Zellerfeld reads as a digital sculptor's gallery on white marble — a 3D-printing footwear marketplace where monochrome surfaces, generous whitespace, and oversized lowercase typography let each product behave like a museum object. The interface commits to extreme restraint: 99% achromatic canvas with a single electric cobalt (#000aff) reserved for urgency — badges, the active 'Shop' nav, the current-slide state. Cards float on a warm pearl gray rather than pure white, giving the grid a tactile, plaster-cast quality. Type stays in a single custom grotesque (Roobert) at tight -0.04em tracking, with Space Mono dropped in only for prices, ranks, and technical metadata. The result is a product page that feels closer to a design press site than a retail checkout — objects are photographed, not sold.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#000aff` | `--color-electric-cobalt` | New In badges, active nav pill, current-slide indicator, claim moments — the only chromatic signal in the system, used sparingly so it reads as activation not decoration |
| Pale Iris | `#e5e7ff` | `--color-pale-iris` | New Color badge fill, soft highlight wash, tinted surface for variant callouts — a desaturated ghost of the cobalt that whispers color without breaking the monochrome regime |
| Ink Black | `#111111` | `--color-ink-black` | Primary text, default borders, icon strokes, hairline dividers — the dominant structural color across headings, lists, and links |
| Pure White | `#ffffff` | `--color-pure-white` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Plaster | `#ecedee` | `--color-plaster` | Secondary surface for product cards, nav bar background, soft elevation tier above the canvas |
| Slate | `#a1a4aa` | `--color-slate` | Card border tone, neutral button fill, muted button border — the gray that defines card edges without darkening them |
| Fog | `#d7d7d7` | `--color-fog` | Light card border, divider lines, inactive surface tint |
| Graphite | `#444955` | `--color-graphite` | List and navigation borders, structural dividers between rows and cells |
| Ash | `#737780` | `--color-ash` | Secondary text, muted body copy, de-emphasized metadata, link rest state |
| Charcoal | `#3b3b3b` | `--color-charcoal` | Body text alternate, subtle dark surface for inset blocks |

## Tokens — Typography

### Roobert — Primary brand typeface — used for everything from 13px body to 128px hero. The -0.04em tracking is consistent across all sizes, pulling the lowercase wordmark into a tight, sculpted mass. Weights escalate by context: 400 for body and UI, 500 for emphasized labels, 600 for product names, 700 for large display. · `--font-roobert`
- **Substitute:** Inter, General Sans, Satoshi
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13, 14, 15, 16, 20, 32, 40, 64, 128
- **Line height:** 1.00, 1.15, 1.20, 1.35, 1.40, 1.50
- **Letter spacing:** -0.04em at all sizes
- **Role:** Primary brand typeface — used for everything from 13px body to 128px hero. The -0.04em tracking is consistent across all sizes, pulling the lowercase wordmark into a tight, sculpted mass. Weights escalate by context: 400 for body and UI, 500 for emphasized labels, 600 for product names, 700 for large display.

### Space Mono — Technical metadata — prices (€189,00), Top 10 rank numerals, ticker marks, shop name credits. Drops in where the page needs to feel like a spec sheet rather than marketing copy. · `--font-space-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 600
- **Sizes:** 12, 14
- **Line height:** 1.00, 1.35, 1.50
- **Role:** Technical metadata — prices (€189,00), Top 10 rank numerals, ticker marks, shop name credits. Drops in where the page needs to feel like a spec sheet rather than marketing copy.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.4 | -0.52px | `--text-caption` |
| body-lg | 16px | 1.4 | -0.64px | `--text-body-lg` |
| subheading | 20px | 1.35 | -0.8px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -1.28px | `--text-heading-sm` |
| heading | 40px | 1.15 | -1.6px | `--text-heading` |
| heading-lg | 64px | 1 | -2.56px | `--text-heading-lg` |
| display | 128px | 1 | -5.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| pills | 30px |
| badges | 30px |
| images | 10px |
| inputs | 10px |
| buttons | 10px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-bleed deep navy (~#000340) background, centered white Roobert 13px body text reading promotional copy. Sits above the main navigation as a thin 32-40px bar. No close button visible — passive, always-on.

### Main Navigation
**Role:** Primary site navigation

White surface, horizontal flex layout. Left: grid icon button (icon stroke 1.5px, #111). Center-left: 'Shop' pill button — white background, #111 border, 10px radius, 8px 14px padding, 14px Roobert 500. Center: wordmark 'zellerfeld' in Roobert with the logomark. Right: search icon button, 'Account' text link in Ash (#737780), wishlist heart icon. 48-56px height. Border-bottom: 1px #ecedee.

### Hero with Background Imagery
**Role:** Above-the-fold product feature

Full-bleed photographic background covering the full viewport height. Image bleeds edge-to-edge with no border-radius. Overlaid bottom-left: 'New In' cobalt badge (see badge spec), then a 64-128px display headline in Roobert 700 white, lowercase ('studio runner'), letter-spacing -5px. Beneath: 15-16px subhead in white at ~80% opacity. Right-side floating product card (see Floating Product Card).

### Floating Product Info Card
**Role:** In-hero product buy card

White surface, 14.4-20px radius, 16-20px padding. Contains: small product thumbnail (60x60, 10px radius), product name in Roobert 600 16px Ink, 'By studio' in Space Mono 12px Ash, price in Space Mono 600 14px Ink. CTA: 'Shop studio runner' — black (#111) filled button, white text, 10px radius, 8px 20px padding.

### Ranked Product Card (Top 10)
**Role:** Numbered editorial product list item

Plaster (#ecedee) surface, 10px radius, no border. Each card spans 1/4 of viewport width. Giant translucent rank numeral (1, 2, 3, 4) in Roobert 700 at 200-280px, white at ~60% opacity, positioned top-right as a watermark. Product image centered, natural proportions. Below image: 20px gap, then small 40x40 brand logo thumbnail (white bg, 4px radius), product name in Roobert 600 16px Ink, 'By {brand}' in Space Mono 12px Ash, price in Space Mono 400 12px Ink.

### Standard Product Card (New Releases)
**Role:** Grid product display card

Plaster (#ecedee) surface, 10px radius, no border. Width 1/4 of grid. Top-left: status badge (New In / Sold Out / New Color). Centered product image fills the card with ~60% height. Below: 16px gap, brand logo thumbnail 40x40 (white surface, 4px radius), product name Roobert 600 16px Ink, 'By {brand}' in Space Mono 12px Ash, price in Space Mono 400 12px Ink.

### New In Badge
**Role:** Status indicator for fresh products

Electric Cobalt (#000aff) background, white text 'New In' in Roobert 600 12px. Pill shape, 30px border-radius, 4px 8px padding. Sits absolute top-left of product card with 12px offset.

### Sold Out Badge
**Role:** Inventory status indicator

Slate (#a1a4aa) background, white text 'Sold Out' in Roobert 600 12px. Pill shape, 30px border-radius, 4px 8px padding. Identical dimensions to New In badge so badge layout doesn't shift.

### New Color Badge
**Role:** Variant announcement

Pale Iris (#e5e7ff) background, Ink (#111) text 'New Color' in Roobert 600 12px. Pill shape, 30px border-radius, 4px 8px padding. Reads as a softer sibling of the New In badge.

### See All Button
**Role:** Section-end navigation

Full-width of content column (not edge-to-edge), white surface, Ink (#111) text 'See All' in Roobert 500 16px, 10px radius, 12px 24px padding, 1px #ecedee border. Centered below product grid.

### Featured In Media Bar
**Role:** Press credentials strip

Ink (#111) background, full-bleed width, 80-100px height. Centered label 'Featured in' in Space Mono 12px Ash above the bar. Inside: horizontally distributed press logos (COMPLEX, POPULAR MECHANICS, VOGUE, WIRED) in white at 60% opacity, even spacing, max ~60px height each.

### Section Header with Carousel Arrows
**Role:** List section title

Full-width of content area. Left: section title in Roobert 600 20px Ink (e.g. 'Featured New Releases'). Right: prev/next arrow buttons, 40x40 square, 1px #ecedee border, 10px radius, chevron icon in Ash 1.5px stroke. Arrows are part of a horizontal carousel control.

### Brand Logo Thumbnail
**Role:** Partner brand mark in product card

40x40 square, white (#ffffff) surface, 4-6px radius, 1px #ecedee border. Contains the partner brand's mark centered at ~50% fill. Used in both ranked and standard product cards to credit the designer.

## Do's and Don'ts

### Do
- Use Roobert at -0.04em tracking for all UI text; never let letter-spacing drift to 0 or positive values
- Reserve #000aff exclusively for New In badges, the active Shop pill, and current-state indicators — no more than 3% of any screen should carry this color
- Apply 10px border-radius to all cards, buttons, inputs, and images; 30px only for pill-shaped badges
- Use Space Mono for prices, rank numerals, and 'By {brand}' credit lines — never for headlines or body
- Set product card surfaces to #ecedee (Plaster), not #ffffff, to create a gentle tier above the white canvas
- Anchor product card metadata (brand mark, name, price) to a 16-20px padding from the card edge with a consistent 40x40 brand thumbnail
- Keep the hero image full-bleed and let overlays sit on the bottom third — the shoe should be the visual subject, the UI floats on top

### Don't
- Don't introduce new chromatic colors beyond the single cobalt (#000aff) and its pale variant (#e5e7ff)
- Don't use drop shadows on product cards — the system relies on surface color stepping and 10px radius for separation
- Don't set type larger than 128px (display) or smaller than 12px (Space Mono micro labels)
- Don't use rounded radii other than 10px and 30px — no fully square corners, no fully circular elements
- Don't center body text or metadata; left-align all product information including the 'By {brand}' credit
- Don't apply color to icons — keep all line icons monochrome Ink (#111) at 1.5px stroke
- Don't separate badge variants by shape — all status badges share the 30px pill; differentiate by fill color only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, outer frame, top-level layout |
| 1 | Plaster | `#ecedee` | Product cards, nav strip, soft elevated content blocks |
| 2 | Fog | `#d7d7d7` | Inset panels, muted inactive states |
| 3 | Ink | `#111111` | Featured In media bar, inverted text blocks, deep footer |

## Elevation

- **Floating Product Info Card:** `0 8px 24px rgba(0, 0, 0, 0.15)`
- **See All Button:** `0 1px 2px rgba(0, 0, 0, 0.04)`

## Imagery

Product photography is the dominant visual — each shoe is shot on a pure white or plaster surface at a three-quarter angle, filling the card with no lifestyle context, no model, no environment. The hero pushes full-bleed lifestyle photography: cropped shots of legs and shoes on sand or concrete floors, always at human scale, never studio-perfect. The 'object IS the hero' principle — shoes occupy 40-60% of the visible frame even in the editorial hero. No decorative graphics, no abstract patterns, no illustrations. Icons are line-based 1.5px stroke in Ink Black, never filled, never colored.

## Layout

The page is full-bleed with a 1440px content rail. The hero is a full-viewport photographic banner with floating overlay UI. The product sections use a 4-column grid that collapses to 2 on tablet and 1 on mobile. Section rhythm: large product feature → ranked editorial grid → fresh releases grid → press credentials bar. Each product section centers its content within the rail and uses 80px vertical breathing room between sections. The navigation is a sticky single-row top bar with a thin announcement strip above it. Product cards align to a strict grid — image area always centers the shoe silhouette with 40px top/bottom padding inside the card, metadata cluster anchors to the bottom-left corner with a 40x40 brand mark leading.

## Agent Prompt Guide

**Quick Color Reference**
- Primary text: #111111 (Ink Black)
- Page background: #ffffff (Pure White)
- Card surface: #ecedee (Plaster)
- Border: #ecedee (subtle) / #a1a4aa (defined) / #444955 (structural)
- Brand accent (badges, active state, claim moments): #000aff (Electric Cobalt)
- primary action: #000aff (filled action)

**Example Component Prompts**

1. Build a 'New Releases' product card: Plaster (#ecedee) background, 10px radius, no border, 20px padding. Top-left has a 'New In' badge — Electric Cobalt (#000aff) fill, white text in Roobert 600 12px, 30px pill radius, 4px 8px padding, positioned 12px from the card edge. Center the product image at 60% of card height. Below the image at 16px gap, place a 40x40 white brand logo thumbnail (4px radius, 1px #ecedee border). Underneath: product name in Roobert 600 16px Ink (#111111), 'By {brand}' in Space Mono 12px Ash (#737780), price in Space Mono 400 12px Ink (#111111).

2. Build a full-bleed product hero: Background fills 100vw at 80vh minimum — a photographic image of shoes on a natural surface. Bottom-left overlay stack: 'New In' badge (Electric Cobalt #000aff, 30px pill, 12px from edge), then a display headline 'studio runner' in Roobert 700 at 128px white with -5px letter-spacing, lowercase, 20px line-height. Below: 15px subhead in white at 80% opacity, Roobert 400. Right side floats a 280px-wide white product info card with 14.4px radius, 20px padding, containing a 60x60 thumbnail, product name, 'By studio' credit, and a black 'Shop studio runner' button (10px radius, 8px 20px padding, #111 background, white text).

3. Build the 'Featured In' press bar: Full-bleed Ink (#111111) background, 100px height, centered. Above the bar (separated by 24px): 'Featured in' label in Space Mono 12px Ash (#737780). Inside the bar, distribute 5 press wordmarks (COMPLEX, POPULAR MECHANICS, VOGUE, WIRED) horizontally with even spacing, all white at 60% opacity, 32-48px cap height, Roobert 700.

4. Create a Primary Action Button: #000aff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. Build the 'See All' call-to-action button below a product grid: Full content-column width (not full-bleed), white (#ffffff) surface, Ink (#111111) text 'See All' in Roobert 500 16px, 10px radius, 12px 24px padding, 1px #ecedee border, centered. Subtle 0 1px 2px shadow for tap affordance. Place 32px below the grid it summarizes.

## Similar Brands

- **Allbirds** — Same restrained monochrome product-grid approach with warm neutral card surfaces and minimal accent color use
- **Rothy's** — Similar flat product cards on subtle gray backgrounds with brand-credit thumbnails and tight typographic hierarchy
- **Mansur Gavriel** — Same editorial product page rhythm — large display type, single accent color, objects photographed on plinth-like surfaces
- **Aesop** — Same 'gallery rather than store' atmosphere with generous whitespace, lowercase wordmarks, and almost-zero color saturation
- **Hermès footwear section** — Same oversized serif-adjacent grotesque display type at -0.04em tracking and the object's-silhouette-as-hero photography treatment

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #000aff;
  --color-pale-iris: #e5e7ff;
  --color-ink-black: #111111;
  --color-pure-white: #ffffff;
  --color-plaster: #ecedee;
  --color-slate: #a1a4aa;
  --color-fog: #d7d7d7;
  --color-graphite: #444955;
  --color-ash: #737780;
  --color-charcoal: #3b3b3b;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: -0.52px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.64px;
  --text-subheading: 20px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.8px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.28px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -1.6px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.56px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -5.12px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 10px;
  --radius-xl: 14.4px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-pills: 30px;
  --radius-badges: 30px;
  --radius-images: 10px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-plaster: #ecedee;
  --surface-fog: #d7d7d7;
  --surface-ink: #111111;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #000aff;
  --color-pale-iris: #e5e7ff;
  --color-ink-black: #111111;
  --color-pure-white: #ffffff;
  --color-plaster: #ecedee;
  --color-slate: #a1a4aa;
  --color-fog: #d7d7d7;
  --color-graphite: #444955;
  --color-ash: #737780;
  --color-charcoal: #3b3b3b;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: -0.52px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.64px;
  --text-subheading: 20px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.8px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.28px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -1.6px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.56px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -5.12px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 10px;
  --radius-xl: 14.4px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
}
```
