# Shop — Style Reference
> Floating shopping constellation on white marble

**Theme:** light

Shop runs on a white-canvas discovery model where products float as large, heavily-rounded image cards instead of grid-locked thumbnails. The entire interface is pillow-soft: 20–28px radii everywhere, pill-shaped controls, a compact 16px GT Standard body with tight negative tracking that pulls text into crisp shapes. A single vivid violet (#5433eb) is the system's only saturated accent — it appears in the wordmark, the circular search submit, and as a tinted shadow on that same button. The rest of the palette is warm-neutral: white surfaces, a faint cool-gray canvas, hairline borders, and near-black text. Density stays compact with 12px gaps, but the hero and category bands breathe through generous 64–80px vertical rhythm, making commerce feel browsable rather than catalog-like.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Mist | `#f2f4f5` | `--color-canvas-mist` | Page background and secondary surface wash behind elevated cards |
| Pure White | `#ffffff` | `--color-pure-white` | Primary surface for cards, input fields, floating brand spotlights, and pill buttons |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, headings, icons, nav symbols, and dark mode product cards |
| Faint Border | `#ebebeb` | `--color-faint-border` | Hairline dividers on cards, input outlines, and pill button borders |
| Muted Gray | `#787574` | `--color-muted-gray` | Secondary text, navigation labels, icon strokes in idle state |
| Cool Stone | `#cccccc` | `--color-cool-stone` | Placeholder fills, disabled states, and inactive icon backgrounds |
| Warm Fog | `#acb0aa` | `--color-warm-fog` | Subtle surface tints for secondary product cards and section backgrounds |
| Shop Violet | `#5433eb` | `--color-shop-violet` | Search submit button, wordmark dot, brand logo — the single accent that makes action and identity pop against the white canvas |
| Violet Wash | `#c0b5f3` | `--color-violet-wash` | Translucent halo behind the violet submit button, extending its glow without changing hue |
| Slate Ink | `#332f2d` | `--color-slate-ink` | Dark product card surfaces and deep-tone overlay text |
| Ash Veil | `#665a54` | `--color-ash-veil` | Warm desaturated gray used in product imagery backdrops, not an active UI token |

## Tokens — Typography

### GT Standard — Primary typeface at all sizes — body and headings alike. GTStandard-MRegular at 16px/-0.031em is the workhorse for body, buttons, and labels. GTStandard-MSemibold at 20px/-0.05em powers the few display-scale headings; GTStandard-MMedium at 11–12px handles micro-labels. Every weight renders at 400 optical weight — the font family carries its hierarchy through subtle grade shifts and tight negative tracking, not bold contrast. This is the signature: Shop doesn't shout with bold, it shapes text with tracking. · `--font-gt-standard`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400
- **Sizes:** 9px, 11px, 12px, 14px, 16px, 20px
- **Line height:** 1.10–1.38
- **Letter spacing:** -0.05em at 20px, -0.031em at 16px, -0.014em at 14px, -0.017em at 12px, -0.058em at 9px
- **Role:** Primary typeface at all sizes — body and headings alike. GTStandard-MRegular at 16px/-0.031em is the workhorse for body, buttons, and labels. GTStandard-MSemibold at 20px/-0.05em powers the few display-scale headings; GTStandard-MMedium at 11–12px handles micro-labels. Every weight renders at 400 optical weight — the font family carries its hierarchy through subtle grade shifts and tight negative tracking, not bold contrast. This is the signature: Shop doesn't shout with bold, it shapes text with tracking.

### Shopify Sans — Reserved for system-level messaging like the app download banner and cookie consent copy · `--font-shopify-sans`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 10px, 14px
- **Line height:** 1.20–1.71
- **Letter spacing:** -0.0230em
- **Role:** Reserved for system-level messaging like the app download banner and cookie consent copy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.33 | — | `--text-caption` |
| body-sm | 12px | 1.33 | — | `--text-body-sm` |
| body | 14px | 1.33 | — | `--text-body` |
| body-lg | 16px | 1.33 | — | `--text-body-lg` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 28px |
| chips | 9999px |
| pills | 20px |
| inputs | 9999px |
| search | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.06) 0px 2px 8px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm-2` |
| lg | `rgba(0, 0, 0, 0.12) 0px 4px 24px 0px` | `--shadow-lg` |
| lg-2 | `rgba(69, 36, 219, 0.34) 0px 4px 24px 0px` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Hero Floating Product Card
**Role:** Hero showcase tile hovering above the wordmark

White surface, 28px radius, 2-layer soft shadow (0 4px 6px -1px rgba(0,0,0,0.1) + 0 2px 4px -2px rgba(0,0,0,0.1)). Contains a 1:1 product image with its own 20px radius, brand name in 14px semibold ink-black beneath, and a 5-star rating row in 9px caption. Zero internal padding on the card; the image bleeds to the rounded edge.

### Brand Spotlight Card
**Role:** Elevated product card promoting a featured merchant

White surface, 28px radius, same dual-layer soft shadow. A 1:1 product image fills the upper area with 20px inner radius. Below: brand name in 14px semibold, star rating and review count in 9px caption. No visible border; the shadow alone separates it from the canvas.

### Search Input with Violet Submit
**Role:** Primary navigation and discovery control

Pill-shaped container at 9999px radius, white fill, 1px ink-black border at 0.1 opacity, 4px vertical / 20px left horizontal padding. Right side reserves 48px for a circular violet (#5433eb) submit button with a white arrow glyph. The violet button carries a tinted shadow: 0 4px 24px rgba(69,36,219,0.34). Placeholder text in 16px regular at muted gray.

### Category Pill
**Role:** Top-level category quick-access chip

Pill at 9999px radius, white fill, 1px faint (#ebebeb) border, subtle elevation shadow (0 2px 8px rgba(0,0,0,0.06)). Left side: 16px circular category icon in its native brand color. Right: 16px GTStandard-MRegular label in ink-black. Horizontal padding 6px, vertical 6px.

### Product Image Tile
**Role:** Category-grid product type card with overlay label

Tall or wide image fills the entire card with zero internal padding. The card itself has 0px radius in the grid context (image defines the shape). A semi-transparent white label box sits at the bottom-left with the product type in 14px semibold, 12px internal padding, and 12px radius on the label chip.

### Category Section Header
**Role:** Section title with chevron affordance

Left-aligned 20px GTStandard-MSemibold at -1.0px tracking in ink-black, followed by a 16px ink-black chevron. No background, no border. Sits above a 2-column or 4-column product grid with 24px bottom margin before the grid.

### Sidebar Nav Rail
**Role:** Persistent left-edge navigation

Narrow vertical column (~64px wide), white background, no border. Each nav item is a 24px ink-black icon centered in a 48px square tappable area. Active state fills the icon container with #f2f4f5 at 20px radius. Profile avatar at the bottom is a 32px circle with a 1px #ebebeb ring.

### App Download Banner
**Role:** Top-of-page cross-platform install prompt

Full-width dark band (#000000) at 48px height, 1px radius, white centered text. Contains a 24px rounded app icon, a 14px Shopify Sans link label reading 'Download Shop app', subtext 'Available on iOS & Android' at 10px, and a white right-pointing arrow. Sits flush against the top edge with zero internal margins beyond 12px horizontal.

### Cookie Consent Button
**Role:** Cookie banner action button

Pill at 9999px radius, white fill, 1px #ebebeb border. Black 12px semibold label centered. Padding 6px vertical, 16px horizontal. Shadow: 0 2px 8px rgba(0,0,0,0.06) for subtle lift on the white canvas.

### Category Carousel Arrow
**Role:** Carousel navigation control within product grids

Circular 32px white button with 0 4px 24px rgba(0,0,0,0.12) shadow. Contains a 16px ink-black right-chevron. Sits at the right edge of any horizontal product rail, vertically centered.

### Product Type Hero Image
**Role:** Full-bleed product image with brand name overlay

Large rounded image (28px radius) filling roughly 60% of a category row. Brand name rendered in large white display type directly on the image at the top-left, followed by a star rating and review count in 14px white. No card chrome — the image IS the card.

### Mini Product Thumbnail Strip
**Role:** Horizontal swatch row within a product card

Row of 3–4 small product images at ~48px square with 12px radius each, separated by 2px gaps. Sits at the bottom of a brand card as a quick-browse affordance. No labels, no borders — just the cropped product images.

### Cookie Modal Link
**Role:** Inline text link in cookie consent copy

14px GTStandard-MRegular ink-black, underlined. No background, no border. Sits inline within body copy at standard line height.

## Do's and Don'ts

### Do
- Use 28px radius for all product cards and 9999px for all pills, inputs, and category chips — the generous rounding is the brand signature
- Set the violet (#5433eb) exclusively on the search submit button and the wordmark dot — it is the only saturated color in the system and must stay singular
- Type body text at 16px GTStandard-MRegular with -0.5px tracking, never smaller for primary content — 12px is the floor for secondary labels
- Pair every elevated card with the dual-layer soft shadow (0 4px 6px -1px + 0 2px 4px -2px at 10% black) — never use a single hard shadow
- Separate layers with shadow alone on white surfaces; skip borders on cards and rely on the canvas-to-card color shift
- Maintain 64–80px vertical breathing room between major content sections to preserve the airy, browseable feel
- Tint the search button's shadow with the brand violet (rgba(69,36,219,0.34)) so the accent color is reinforced in the elevation itself

### Don't
- Do not add a second saturated accent color — the system is monochrome with one violet, introducing a second will flatten its impact
- Do not use sharp corners on cards, buttons, or inputs — 0px radius is reserved for image edges only
- Do not use bold (700+) weights — the GTStandard family carries hierarchy through grade and tracking, not weight contrast
- Do not add visible borders to elevated cards — the shadow and white surface against the faint canvas do the separation work
- Do not use colored backgrounds for UI containers — the product photography provides all color in the experience
- Do not break the 9999px pill convention for any control that sits inline with text (search, category chips, cookie buttons)
- Do not set body text below 12px — 9px is reserved exclusively for review counts and brand metadata in tight cards
- Do not add gradients, illustrations, or decorative shapes — the visual language is product photography on white with soft shadows

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f2f4f5` | Page background — only visible at page edges and behind the sidebar rail |
| 1 | Surface | `#ffffff` | Main content surface for cards, inputs, pills, the sidebar, and the search bar |
| 2 | Elevated Card | `#ffffff` | Hero floating product cards and brand spotlights — same white but lifted by dual-layer soft shadow |
| 3 | Accent Product Image | `#000000` | Dark product imagery that reads as a 'dark mode' surface within the light canvas, holding white overlay text |

## Elevation

- **Hero Product Card:** `rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px`
- **Search Submit Button:** `rgba(69,36,219,0.34) 0px 4px 24px 0px`
- **Category Pill:** `rgba(0,0,0,0.06) 0px 2px 8px 0px`
- **Carousel Arrow:** `rgba(0,0,0,0.12) 0px 4px 24px 0px`
- **Cookie Button:** `rgba(0,0,0,0.06) 0px 2px 8px 0px`

## Imagery

Photography is the dominant visual: full-bleed product photography on white, 1:1 crops, and lifestyle imagery with warm earth-tone palettes (tans, terracotta, sage, ivory). Product images carry their own color — the UI stays achromatic so product hues become the visual variety. Brand logos appear as overlay type on dark or light hero images rather than separate badges. The hero composition arranges product cards as a floating, slightly overlapping constellation above the wordmark. Icons are minimal and mono (ink-black outlined strokes), except for category pill icons which use a single brand color each. No illustrations, no 3D, no gradients on product imagery.

## Layout

Max-width 1200px centered on a faint #f2f4f5 canvas, with a persistent 64px-wide left sidebar rail of icon-only navigation. The hero is a full-width band where product cards float above a centered violet 'shop' wordmark, with the pill search bar directly below. Category pills sit in a single centered row beneath the search. Content sections (Women, Men, Beauty, Home, Baby & Toddler) follow as labeled bands, each containing a 4-column card grid of product image tiles or a 2-column hero-and-grid composition. Vertical rhythm is generous: 64–80px between major sections. The footer is a dark band at the page bottom with columnar link groups. Right-side carousel arrows on horizontal product rails indicate scrollable content without pagination dots.

## Agent Prompt Guide

Quick Color Reference:
- Background: #f2f4f5 (canvas), #ffffff (surface)
- Text: #000000 (primary), #787574 (secondary)
- Border: #ebebeb (hairline)
- Accent: #5433eb (Shop violet — wordmark + search submit)
- Shadow tint: rgba(69,36,219,0.34) for the violet button only
- primary action: #5433eb (filled action)

Example Component Prompts:

1. Create the hero search bar: 9999px radius pill, #ffffff fill, 1px border in rgba(5,41,77,0.1). Placeholder 'What are you shopping for today?' in 16px GTStandard-MRegular at #787574. Right-aligned circular submit button in #5433eb with a white right-arrow glyph, 48px diameter, shadow 0 4px 24px rgba(69,36,219,0.34). The input padding is 4px vertical, 20px left, reserving 48px right for the submit.

2. Create a floating brand spotlight card: 28px radius, #ffffff fill, dual shadow (rgba(0,0,0,0.1) 0 4px 6px -1px + rgba(0,0,0,0.1) 0 2px 4px -2px). Top half: 1:1 product image at 20px inner radius filling to the card edges. Below: brand name in 14px GTStandard-MSemibold at #000000 with -0.2px tracking, followed by a 9px star-rating row at -0.5px tracking. No card padding, no border.

3. Create a category pill chip: 9999px radius, #ffffff fill, 1px #ebebeb border, shadow rgba(0,0,0,0.06) 0 2px 8px. Left: 16px circular category icon in its native color. Right: 16px GTStandard-MRegular label in #000000 with -0.5px tracking. Padding 6px vertical, 6px left, 16px right.

4. Create a category section header: 20px GTStandard-MSemibold at -1.0px tracking in #000000, followed by a 16px #000000 right-chevron, left-aligned. 24px bottom margin before the 4-column product grid beneath.

5. Create the left sidebar nav: 64px-wide vertical rail, #ffffff fill, no border. Each item is a 24px #000000 icon centered in a 48px tap target. Active state fills a 20px-radius background of #f2f4f5 behind the icon. Profile avatar at bottom: 32px circle with 1px #ebebeb ring.

## Typography Hierarchy Rules

The GT Standard family carries its entire hierarchy through three grades (Regular, Medium, Semibold) and negative tracking — never through weight contrast alone. Display and heading sizes use aggressive tracking tightening (-1.0px at 20px, -0.5px at 16px), while micro-labels relax to -0.2px. This creates a visual compression effect: big text pulls tight, small text breathes. Always pair size with the correct family grade: 16px body is Regular, 14px subheadings are Semibold, 12px meta is Medium. Never mix grades within a single text run — a label and its value must use the same family grade for visual coherence.

## Product Card Composition

Product cards are image-first: the image defines the card's visual identity, and type is a supporting label beneath or overlaid on the image. White product cards stack the image on top with type below in a 12–16px gap. Dark product cards reverse this — brand name in large display type overlays the image at the top-left in white. The card radius (28px) is always larger than the inner image radius (20px) by ~8px, creating a subtle white frame effect even on white-background product images. Never crop a product image to the card's exact rounded shape — the inner 20px radius provides a visible white border that separates the product from the card edge.

## Similar Brands

- **Instagram Shopping** — Same white-canvas product discovery model with image-first cards and minimal chrome around merchandise
- **Pinterest** — Floating rounded product tiles, soft shadows, and a browseable constellation layout over a centered search affordance
- **SSENSE** — Large-format product imagery in heavily-rounded cards, compact 16px body type, and a single restrained accent color
- **Apple Shop** — Generous 20–28px radii across all interactive surfaces and pill-shaped controls on a white canvas
- **Faire** — Product-first discovery with elevated floating image cards, tight negative tracking on body type, and warm-neutral palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-mist: #f2f4f5;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-faint-border: #ebebeb;
  --color-muted-gray: #787574;
  --color-cool-stone: #cccccc;
  --color-warm-fog: #acb0aa;
  --color-shop-violet: #5433eb;
  --color-violet-wash: #c0b5f3;
  --color-slate-ink: #332f2d;
  --color-ash-veil: #665a54;

  /* Typography — Font Families */
  --font-gt-standard: 'GT Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shopify-sans: 'Shopify Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.33;
  --text-body-sm: 12px;
  --leading-body-sm: 1.33;
  --text-body: 14px;
  --leading-body: 1.33;
  --text-body-lg: 16px;
  --leading-body-lg: 1.33;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 0px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 11.4046px;
  --radius-2xl: 17.1064px;
  --radius-2xl-2: 20px;
  --radius-2xl-3: 22.8092px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 28px;
  --radius-chips: 9999px;
  --radius-pills: 20px;
  --radius-inputs: 9999px;
  --radius-search: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 8px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-lg: rgba(0, 0, 0, 0.12) 0px 4px 24px 0px;
  --shadow-lg-2: rgba(69, 36, 219, 0.34) 0px 4px 24px 0px;

  /* Surfaces */
  --surface-canvas: #f2f4f5;
  --surface-surface: #ffffff;
  --surface-elevated-card: #ffffff;
  --surface-accent-product-image: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-mist: #f2f4f5;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-faint-border: #ebebeb;
  --color-muted-gray: #787574;
  --color-cool-stone: #cccccc;
  --color-warm-fog: #acb0aa;
  --color-shop-violet: #5433eb;
  --color-violet-wash: #c0b5f3;
  --color-slate-ink: #332f2d;
  --color-ash-veil: #665a54;

  /* Typography */
  --font-gt-standard: 'GT Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shopify-sans: 'Shopify Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.33;
  --text-body-sm: 12px;
  --leading-body-sm: 1.33;
  --text-body: 14px;
  --leading-body: 1.33;
  --text-body-lg: 16px;
  --leading-body-lg: 1.33;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 11.4046px;
  --radius-2xl: 17.1064px;
  --radius-2xl-2: 20px;
  --radius-2xl-3: 22.8092px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 8px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-lg: rgba(0, 0, 0, 0.12) 0px 4px 24px 0px;
  --shadow-lg-2: rgba(69, 36, 219, 0.34) 0px 4px 24px 0px;
}
```
