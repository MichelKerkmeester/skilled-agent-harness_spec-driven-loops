# Blok — Style Reference
> Swiss showroom on teal-tinted paper

**Theme:** mixed

Blok is a premium analog-watch brand that treats the product page like a gallery wall: generous white space, sharp-cornered cards, and typography that leans on wide tracking to feel considered rather than loud. A single vivid teal — #1dd8e1 — does all the accent work, threading through button strokes, text links, and product dial highlights, while the rest of the palette stays architectural in dark navy-blacks and warm off-whites. Headlines are set in a heavy, wide-tracked Jost that feels almost industrial-luxe, contrasted against the rounded Poppins used for body and UI. Layout is centered, max-width-contained, and product-first: a dark hero with organic teal shapes gives way to white product grids, a single light-gray press band, and flat-light product detail pages. Components are flat, hairline-bordered, and almost shadeless — confidence comes from type scale and spacing, not elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Ink | `#0a0d0f` | `--color-carbon-ink` | Primary text, product page borders, body type — the near-black that carries the entire brand voice in type |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, product card surface, button text on dark — the base everything sits on |
| Slate Veil | `#2e3438` | `--color-slate-veil` | Secondary text and icon strokes — slightly cooler than Carbon Ink, used where pure black would feel too heavy |
| Onyx | `#000000` | `--color-onyx` | Body borders, heading text — the hardest black in the system, used sparingly for maximum edge definition |
| Bone | `#f7f7f7` | `--color-bone` | Alternate section background, subtle card wash, press-logo band — the warm off-white that breaks up white-on-white without introducing a color |
| Footer Ash | `#efefef` | `--color-footer-ash` | Footer surface only — one step deeper than Bone to separate the footer from the body |
| Silver Mist | `#d5d6d7` | `--color-silver-mist` | Input borders, subtle dividers — hairline neutral that only shows on form elements |
| Graphite Tag | `#656565` | `--color-graphite-tag` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. |
| Signal Teal | `#1dd8e1` | `--color-signal-teal` | Primary action buttons, link text, product dial accents, active tab indicators — the only chromatic color in the entire system, carrying every interactive moment on its own |

## Tokens — Typography

### Poppins — Body copy, product titles, button text, UI chrome — the rounded geometry contrasts with Jost's squared display weight, keeping the system from feeling monotone · `--font-poppins`
- **Substitute:** Inter, DM Sans, Manrope
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 17px, 21px, 24px, 25px
- **Line height:** 1.38-1.50
- **Role:** Body copy, product titles, button text, UI chrome — the rounded geometry contrasts with Jost's squared display weight, keeping the system from feeling monotone

### Jost — Display and section headlines — the wide 0.09em tracking turns bold weight into something architectural rather than shouty; treat as the only voice for H1/H2/page titles · `--font-jost`
- **Substitute:** Inter Tight, Montserrat, Archivo Black
- **Weights:** 700
- **Sizes:** 23px, 34px, 42px, 51px
- **Line height:** 1.25-1.38
- **Letter spacing:** 0.09em
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** Display and section headlines — the wide 0.09em tracking turns bold weight into something architectural rather than shouty; treat as the only voice for H1/H2/page titles

### Cabin — Eyebrow labels, nav tabs, small section captions, badge text — the 0.064em-0.09em tracking at small sizes creates a 'label-grade' voice that sits above Poppins without dominating it · `--font-cabin`
- **Substitute:** Inter, Work Sans, Sora
- **Weights:** 500, 600
- **Sizes:** 12px, 14px, 17px, 20px, 21px, 68px
- **Line height:** 1.00-1.63
- **Letter spacing:** 0.064-0.09em
- **Role:** Eyebrow labels, nav tabs, small section captions, badge text — the 0.064em-0.09em tracking at small sizes creates a 'label-grade' voice that sits above Poppins without dominating it

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 17px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.77px | `--text-caption` |
| body-sm | 14px | 1.42 | — | `--text-body-sm` |
| body-lg | 17px | 1.5 | — | `--text-body-lg` |
| subheading | 21px | 1.38 | — | `--text-subheading` |
| heading-sm | 24px | 1.38 | — | `--text-heading-sm` |
| heading | 34px | 1.37 | 3.06px | `--text-heading` |
| heading-lg | 42px | 1.25 | 3.78px | `--text-heading-lg` |
| display | 68px | 1.2 | 6.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 50 | 50px | `--spacing-50` |
| 72 | 72px | `--spacing-72` |
| 113 | 113px | `--spacing-113` |
| 166 | 166px | `--spacing-166` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 3px |
| cards | 3px |
| inputs | 3px |
| buttons | 3px |
| buttons-pill | 100px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Teal Filled Button
**Role:** Primary call-to-action for product discovery

Solid #1dd8e1 background, Carbon Ink (#0a0d0f) text, Poppins 500 at 14-16px, 3px corner radius, 12px vertical and 24px horizontal padding. No shadow. Used sparingly — the teal is precious, reserve for high-intent moments.

### Outlined Teal Button
**Role:** Primary action on product detail pages (Add to Cart)

Transparent background, 1px Signal Teal (#1dd8e1) border, Signal Teal text, Poppins 500, 3px radius, 12px vertical / 24px horizontal padding. Often paired with a fully filled Shop Pay button below it, so this outlined variant carries the brand color while letting the third-party button dominate the visual weight.

### Ghost Text Button
**Role:** Secondary navigation actions like 'Find Your Blok' in the hero

White or Carbon Ink text, 1px border in the same color, Poppins 500 at 12-14px, wide letter-spacing (0.064em), 3px radius. Reads as a quiet outlined rectangle.

### Product Card
**Role:** Individual watch tile in the collection grid

White (#ffffff) surface, 3px corner radius, no border, no shadow. Product image sits centered with 24px internal padding. Below the image: product name in Poppins 500 (e.g. 'Blok 33 — Aqua'), price in Poppins 400, optional 'Sold Out' badge in the top-right corner.

### Sold Out Badge
**Role:** Status indicator for unavailable products

Light neutral background, Graphite Tag (#656565) text in Cabin 500, 3px radius, 5-6px vertical / 10px horizontal padding. Small and quiet — never screams.

### Collection Tab Bar
**Role:** Switch between product lines (BK33, BK38, Bundles, Straps)

Horizontal row of text tabs in Cabin 500-600, 12-14px, letter-spacing 0.09em, uppercase. Active tab is underlined or colored in Signal Teal; inactive tabs are Carbon Ink. No background fill, no border — separation comes from spacing alone.

### Hero Section
**Role:** Above-the-fold brand statement with featured watch

Full-bleed dark background (Carbon Ink #0a0d0f with large organic teal shapes as decorative blobs in Signal Teal at low opacity). Headline in Jost 700, 42-68px, white text, letter-spacing 0.09em. Subhead in Poppins 400 white. Ghost text CTA button bottom-right.

### Press Logo Strip
**Role:** Social proof band of media outlets

Bone (#f7f7f7) background band, single row of monochrome black wordmarks (Esquire, WSJ, NYT, Cool Hunting, Gear Patrol, Financial Times, Hodinkee). Logos sit at uniform height, separated by 40-60px horizontal gaps. No labels, no borders — just logos on a gray strip.

### Quantity Selector
**Role:** Number stepper on product detail

Outlined rectangle in Carbon Ink (#0a0d0f), 1px border, 3px radius. Contains a '−' button, current quantity number in Poppins, and a '+' button. No fill, no background color.

### Star Rating Display
**Role:** Product review indicator

Small inline component showing filled stars in Signal Teal (#1dd8e1) and a numeric rating (e.g. '5.0') in Poppins 400, Carbon Ink. Stars are 12-14px, flat geometry, no outline.

### Product Detail Gallery
**Role:** Large product image with light background

Light neutral (#f7f7f7 or #ffffff) background, 3px radius around the image container, 24-40px internal padding. Product image sits centered with generous breathing room — the product is the hero of its own page.

### Section Headline Block
**Role:** Centered intro text for content sections

Centered stack: eyebrow caption in Cabin 500 with 0.09em tracking, then headline in Jost 700, then subhead in Poppins 400 Carbon Ink. No decorative rules or dividers — whitespace is the separator.

### Shop Pay Button
**Role:** Third-party express checkout

Filled #5a31f4 (Shopify purple) background, white text, Poppins 500, 3px radius, 12px vertical / 24px horizontal padding. Sits directly below the outlined Add to Cart button, occupying full width.

### Navigation Header
**Role:** Top-level site navigation

White background, Carbon Ink text, hamburger menu icon left, 'blok' wordmark center, bag icon right. Minimal — no underline, no background highlight, no nested menus visible at rest.

## Do's and Don'ts

### Do
- Use Signal Teal (#1dd8e1) exclusively for interactive moments — buttons, links, active tabs, star ratings — and let it carry 100% of the chromatic load.
- Set all display headlines in Jost 700 with 0.09em tracking; never use Poppins or Cabin for anything above 24px.
- Separate surfaces with hairline #0a0d0f borders or a #ffffff → #f7f7f7 tone shift; do not introduce box-shadows for elevation.
- Use uppercase Cabin 500-600 with 0.064-0.09em tracking for any label, eyebrow, or category text under 21px.
- Keep product cards borderless with 3px radius and 24px internal padding; let the product image do the visual work.
- Default page background to #ffffff; switch to #f7f7f7 for alternating sections like the press strip and product image containers.
- Center-align section headlines and product page titles; left-align only body copy and form content.

### Don't
- Don't add box-shadows to cards, buttons, or modals — the system is intentionally flat, separated by borders and tone.
- Don't introduce additional accent colors — every interactive element that isn't a neutral border or text should be Signal Teal.
- Don't use a second typeface for body copy; Poppins owns 400-500 across all UI and product descriptions.
- Don't round corners beyond 3px for cards/inputs or 100px for pill buttons — the system is mostly sharp with a few deliberate pills.
- Don't set body copy or UI text in uppercase; reserve letter-spacing for Cabin labels and Jost headlines only.
- Don't place teal text on teal backgrounds, or teal buttons on the Bone (#f7f7f7) footer — contrast is built on white canvas + dark ink.
- Don't crowd sections; sectionGap should never drop below 64px even on dense product pages.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, default surface |
| 1 | Band | `#f7f7f7` | Press logos strip, alternating section |
| 2 | Footer | `#efefef` | Footer base |

## Elevation

The system deliberately avoids shadows — surfaces are separated by hairline borders in Carbon Ink (#0a0d0f) and tone shifts between #ffffff and #f7f7f7. Elevation is expressed through content layering, not depth, giving the product catalog a flat editorial-magazine feel.

## Imagery

Product photography is the dominant visual — tight, centered shots of watches on pure white or light gray backgrounds, no lifestyle context, no models, no environment. The hero image is composited with large organic teal shape-blobs behind the watch, creating a liquid editorial feel without literal gradients. Press logos appear as flat monochrome wordmarks. No illustrations, no 3D renders, no stock photography beyond the product itself — the catalog reads as gallery-style product shots where the watch IS the visual.

## Layout

Max-width 1200px centered container drives all content; the hero is the only full-bleed element, expanding edge-to-edge with a dark Carbon Ink background. Below the hero, the layout is a vertical stack of white sections separated by generous 80px gaps. Product grids use a 4-column layout on desktop, collapsing to 2 on tablet and 1 on mobile. Product detail pages use a 2-column split: large product image left (50-55% width), purchase controls and description right. Navigation is a minimal top bar with hamburger left, wordmark center, bag icon right — no mega-menu, no sidebar. Press logos sit in a single full-width band. The footer is a single low-contrast #efefef block at the very bottom.

## Agent Prompt Guide

Quick Color Reference:
- text: #0a0d0f (Carbon Ink)
- background: #ffffff (Pure White)
- border: #0a0d0f (Carbon Ink, 1px hairline)
- accent: #1dd8e1 (Signal Teal)
- primary action: #1dd8e1 (filled action)
- surface alt: #f7f7f7 (Bone)

3-5 Example Component Prompts:
1. Build a product card: white #ffffff background, 3px corner radius, no border, no shadow. 24px internal padding. Watch image centered filling the top 70% of the card. Below: 'Blok 33 — Aqua' in Poppins 500 16px #0a0d0f, then '$189.00' in Poppins 400 14px #2e3438.
2. Build a collection tab bar: horizontal row centered, items 'BK33 | BK38 | BUNDLES | STRAPS' in Cabin 600 12px uppercase, letter-spacing 0.09em, color #0a0d0f. Active tab underlined with a 2px line in #1dd8e1, all other tabs have no underline. No background fill, no borders.
3. Build a hero section: full-bleed #0a0d0f background with a large organic teal blob shape in #1dd8e1 at 30% opacity behind the right side. Headline 'TAKE BACK TIME' in Jost 700 68px #ffffff, letter-spacing 0.09em, centered. Subhead 'An analog watch for the modern world.' in Poppins 400 17px #ffffff below. Ghost CTA 'FIND YOUR BLOK' bottom-right, 1px white border, white text, Poppins 500 12px, 3px radius, 12px/24px padding.
4. Build an Add to Cart button row: full-width outlined button, 1px #1dd8e1 border, transparent background, text 'ADD TO CART  $495.00' in Poppins 500 14px #1dd8e1, 3px radius, 12px vertical / 24px horizontal padding. Directly below it, a full-width filled #5a31f4 button with white text 'Buy with shop' in Poppins 500 14px, same radius and padding.
5. Build a press logo strip: full-width band, #f7f7f7 background, 60px vertical padding. Single horizontal row of monochrome black wordmarks (Esquire, WSJ, The New York Times, Cool Hunting, Gear Patrol, Financial Times, Hodinkee) evenly distributed with 50px gaps, all at uniform 28px height, no captions.

## Type System Philosophy

Three-font system with clear role separation: Jost 700 is the showpiece — reserved for headlines 23px+, its 0.09em tracking transforms bold weight from loud to architectural. Cabin 500-600 is the label voice — uppercase + 0.064-0.09em tracking at small sizes creates a 'curated' feel for tabs, eyebrows, and badges. Poppins 400-500 does all body and UI work — its rounded geometry deliberately contrasts with Jost's squared display, keeping the system from feeling monotone. Never blur the lines: a Jost headline in a 17px label role is a category error.

## Similar Brands

- **MVMT Watches** — Same flat editorial product grid, hairline-separated cards, and a single bold accent carrying all interactive moments
- **Daniel Wellington** — Same wide-tracked uppercase category labels, centered minimal navigation, and product-first hero with generous white space
- **Bell & Ross** — Same architectural confidence in type — bold uppercase headlines against clean white product pages, industrial-luxe tone
- **Studio Proper** — Same three-typeface system mixing a heavy display sans with a lighter geometric body, and flat 3px-radius product cards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-ink: #0a0d0f;
  --color-pure-white: #ffffff;
  --color-slate-veil: #2e3438;
  --color-onyx: #000000;
  --color-bone: #f7f7f7;
  --color-footer-ash: #efefef;
  --color-silver-mist: #d5d6d7;
  --color-graphite-tag: #656565;
  --color-signal-teal: #1dd8e1;

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jost: 'Jost', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cabin: 'Cabin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.77px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.42;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --text-heading: 34px;
  --leading-heading: 1.37;
  --tracking-heading: 3.06px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: 3.78px;
  --text-display: 68px;
  --leading-display: 1.2;
  --tracking-display: 6.12px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-50: 50px;
  --spacing-72: 72px;
  --spacing-113: 113px;
  --spacing-166: 166px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tabs: 3px;
  --radius-cards: 3px;
  --radius-inputs: 3px;
  --radius-buttons: 3px;
  --radius-buttons-pill: 100px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-band: #f7f7f7;
  --surface-footer: #efefef;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-ink: #0a0d0f;
  --color-pure-white: #ffffff;
  --color-slate-veil: #2e3438;
  --color-onyx: #000000;
  --color-bone: #f7f7f7;
  --color-footer-ash: #efefef;
  --color-silver-mist: #d5d6d7;
  --color-graphite-tag: #656565;
  --color-signal-teal: #1dd8e1;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jost: 'Jost', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cabin: 'Cabin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.77px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.42;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --text-heading: 34px;
  --leading-heading: 1.37;
  --tracking-heading: 3.06px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: 3.78px;
  --text-display: 68px;
  --leading-display: 1.2;
  --tracking-display: 6.12px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-50: 50px;
  --spacing-72: 72px;
  --spacing-113: 113px;
  --spacing-166: 166px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-full: 100px;
}
```
