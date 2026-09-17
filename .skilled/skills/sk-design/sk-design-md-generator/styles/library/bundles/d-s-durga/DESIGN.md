# D.S. & DURGA — Style Reference
> indie perfumery broadsheet on bone-white paper — a single warm cream canvas where black ink and oversized type do all the talking.

**Theme:** light

D.S. & Durga reads as an indie perfumery broadsheet printed on bone-white paper. The entire system is monochrome-warm: a single warm cream canvas, black ink for all type and rules, and a dusty rose secondary surface that only appears as quiet tonal shifts between bands. Typography does the heavy lifting — Sofia Pro is pushed to its extremes, with a chunky weight-800 display face at 120px serving as editorial hero headlines and a whisper-thin weight-400 for utility labels, creating dramatic size contrast that feels like a fashion magazine spread. Photography is the dominant visual element: full-bleed product shots on dark moody backdrops, torn-paper collages, and oversized object crops sit directly on the cream canvas with no card chrome or borders. Components are stripped to absolute minimum — no buttons with backgrounds, no rounded containers, no shadows; the only interactive affordance is a thin black arrow and uppercase tracked text. The site feels more like an art object or printed catalog than a typical e-commerce experience.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Bone White | `#f2e9de` | `--color-bone-white` | Page canvas, announcement bar, card surfaces, product label backgrounds, button fills — warm cream that makes the entire site feel like aged paper |
| Dusty Rose | `#ddc9c0` | `--color-dusty-rose` | Secondary surface band, subtle tonal shift between cream sections — barely-distinguishable warm blush that creates the only depth in an otherwise flat system |

## Tokens — Typography

### Sofia Pro — Only typeface in the system. Weight 800 at 120px with 0.83 line-height and -0.05em tracking for editorial display headlines — the face is pushed to extreme sizes to feel like magazine cover type. Weight 400 at 12-16px for body and utility labels, all-caps with 0.05em tracking for nav items. Weight 600 used sparingly for emphasis in product copy. · `--font-sofia-pro`
- **Substitute:** Manrope or Söhne for body; Founders Grotesk Condensed for display
- **Weights:** 400, 600, 800
- **Sizes:** 12px, 14px, 16px, 18px, 30px, 60px, 120px
- **Line height:** 0.83 (display), 0.92, 1.17, 1.22, 1.25, 1.27, 1.43
- **Letter spacing:** -0.05em for display (tightens the heavy weight 800 at 120px), 0.05em for uppercase nav and labels (opens up small caps for readability)
- **Role:** Only typeface in the system. Weight 800 at 120px with 0.83 line-height and -0.05em tracking for editorial display headlines — the face is pushed to extreme sizes to feel like magazine cover type. Weight 400 at 12-16px for body and utility labels, all-caps with 0.05em tracking for nav items. Weight 600 used sparingly for emphasis in product copy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | 0.05px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.05px | `--text-body-sm` |
| body | 16px | 1.27 | — | `--text-body` |
| subheading | 18px | 1.25 | — | `--text-subheading` |
| heading-sm | 30px | 1.22 | -0.05px | `--text-heading-sm` |
| heading | 60px | 0.92 | -0.05px | `--text-heading` |
| display | 120px | 0.83 | -0.05px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 33 | 33px | `--spacing-33` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 70 | 70px | `--spacing-70` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 50-60px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Top Announcement Bar
**Role:** Promotional message strip above main nav

Full-width bone white (#f2e9de) band, 10px vertical padding, single line of centered uppercase text at 12px weight 400 with 0.05em tracking in black. Thin hairline border below in #000000.

### Main Navigation Bar
**Role:** Primary site navigation

Full-width bar on bone canvas. Centered brand wordmark 'DS&D URGA' at large display size (30-60px) weight 800. Left-side nav items in uppercase 12-14px weight 400 with 0.05em tracking and 30px horizontal padding. Right-side utility cluster: currency selector (boxed label '$ USD'), account icon, search icon, cart icon — all stroke-only at 1px black. 10px vertical padding. Thin 1px black border-bottom.

### Editorial Caption Block
**Role:** Hero or section caption anchored to left margin

Left-aligned text block sitting in white space beside full-bleed imagery. Two-line headline at 30-60px weight 800 in black, tightly tracked at -0.05em. Below, a small uppercase link/CTA at 12px weight 400 with 0.05em tracking, often underlined or in a subtle button style. No background, no border, no card container.

### Product Image Tile
**Role:** Grid cell in product/editorial grid

Large product photograph at full grid cell size, no padding or margin around image. Bone white (#f2e9de) gap between tiles. Images have 0px border-radius (sharp corners). No overlay text on product shots — let the product label do the talking.

### Display Type Overlay Block
**Role:** Oversized editorial headline laid over imagery

Display-size Sofia Pro weight 800 at 60-120px, line-height 0.83-0.92, letter-spacing -0.05em, in black. Sits directly on top of a large grayscale or muted product photo (glass vessels, scissors, abstract objects). The type becomes the section's primary visual; the imagery is a textural backdrop. No background or text-shadow.

### Carousel Section with Arrow
**Role:** Horizontally scrolling product/editorial row

A row of product tiles (3-4 visible) with a thin 1px black hairline border separating it from adjacent sections. A simple '>' chevron icon at the right edge in black stroke, indicating more content. No pagination dots, no progress bar — the arrow is the only affordance.

### Vertical Side Label
**Role:** Rotated text running along section edge

Uppercase Sofia Pro weight 400 at 12-14px with 0.05em tracking, rotated 90° to run vertically along the left or right edge of a grid section. Functions as a section identifier or product name, in pure black.

### Ghost Text Button
**Role:** Minimal text-only interactive element

Uppercase text at 12-14px weight 400 with 0.05em tracking in black. No background fill, no border, no padding beyond inline text rhythm. On hover: underline or color shift. Examples: 'MOTHER'S DAY GIFT GUIDE', 'SHOP NOW', 'VIEW ALL'. This is the only button style in the system — there are no filled buttons, no rounded pills, no color backgrounds.

### Product Label Typography (Bottle)
**Role:** Type on physical product packaging as shown in photography

Cream (#f2e9de) label background on black/glass bottle. Product name in large Sofia Pro weight 600-800 at 16-24px, tracked -0.05em. Below: 'fragrance / enhancer' or category descriptor at 10-12px weight 400. Bottom: 'D.S. & DURGA / eau de parfum 50 ml' at 8-10px. Sharp 0px corners on the label itself.

### Currency Selector Box
**Role:** Region/currency picker in nav utility cluster

Small bordered rectangle in the nav: 1px black border, bone white fill, text '$ USD' at 12px weight 400 uppercase with 0.05em tracking. Approximately 25px horizontal padding, 5-7px vertical padding. No dropdown chevron visible — the box itself is the trigger.

## Do's and Don'ts

### Do
- Use only three colors: Ink Black (#000000), Bone White (#f2e9de), and Dusty Rose (#ddc9c0). Never introduce a chromatic accent — the system is intentionally achromatic-warm.
- Push Sofia Pro to its extremes: weight 800 at 60-120px for display, weight 400 at 12-16px for body. The size contrast between 12px and 120px is the signature rhythm.
- Use 0px border-radius on every component, image, and surface. Sharp corners reinforce the printed/broadsheet aesthetic.
- Set nav items and utility labels in uppercase with 0.05em letter-spacing. Reserve -0.05em tracking exclusively for large display type at 60px+ to tighten the heavy weight.
- Let product photography bleed edge-to-edge with no card chrome, no padding frames, no drop shadows. The bone canvas IS the container.
- Use the ghost text button as the sole interactive style — uppercase tracked text in black, no background fill, no border, no radius.
- Maintain the 10px element gap and 20px component padding as the baseline spatial rhythm; let the section-level whitespace (50-60px) create the editorial breathing room.

### Don't
- Never add a chromatic accent color — no blue links, no red sale tags, no green success states. The system is monochrome by design discipline, not by limitation.
- Never use border-radius above 0px on any UI element. No pill buttons, no rounded cards, no circular avatars — the aesthetic is printed page, not app interface.
- Never use drop shadows, box-shadows, or gradients. Depth comes only from the surface shift between #f2e9de and #ddc9c0, and from the contrast of black photography against the cream canvas.
- Never fill a button with a solid color background. The ghost text style (uppercase, tracked, underline-on-hover) is the only acceptable interactive treatment.
- Never use more than one typeface. Sofia Pro across all weights and sizes is the entire typographic system — introducing a second family breaks the editorial discipline.
- Never set body text below 12px or use a line-height looser than 1.43 at small sizes. Tight, compact typography maintains the catalog/zine density.
- Never place imagery inside a bordered card or framed container. Images sit raw on the bone canvas — the whitespace gap and adjacent surface tone are the only separators.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone White Canvas | `#f2e9de` | Page background and dominant surface — every section sits on this warm cream |
| 2 | Dusty Rose Band | `#ddc9c0` | Secondary tonal surface that breaks up cream sections — barely a shade shift, creates subtle depth |
| 3 | Ink Black Overlay | `#000000` | Dark photography backdrops and product label surfaces — used for dramatic full-bleed product imagery |

## Elevation

The system deliberately avoids all shadow-based elevation. Depth and hierarchy are achieved through three mechanisms only: (1) surface tone shifts between Bone White and Dusty Rose bands, (2) dramatic typographic size contrast from 12px utility text to 120px display headlines, and (3) full-bleed black product photography that reads as its own 'dark surface' against the cream canvas. There are no card elevations, no modal overlays with shadows, no hover lift effects. The flatness is intentional — the site should feel like a printed page, not a software interface.

## Imagery

Photography dominates the visual language and is the actual product. Full-bleed product shots on dark/black backdrops with dramatic lighting — perfume bottles as still-life subjects, isolated on torn paper or moody dark surfaces. Editorial collage treatment: torn pink/red paper edges frame the bottles, creating a handmade zine aesthetic. Overhead object crops (scissors on gray paper, glass vessels) fill large grid cells. No lifestyle photography, no models, no people — the objects themselves are the heroes. Images sit directly on the bone canvas with zero padding or border, often bleeding edge-to-edge. Black-and-white and desaturated treatments are common; color appears only in the product packaging itself.

## Layout

Full-bleed editorial layout with a centered max-width of ~1440px. Navigation is a single horizontal bar at the top: centered wordmark, uppercase nav items left-aligned, utility icons (account, search, cart, currency) right-aligned, with a thin cream announcement bar above. Hero is a split composition — left side holds a caption block in white space, right side holds a large full-bleed product image. Below the hero, content flows in an asymmetric editorial grid: a 2-column or 3-column image grid where one cell is oversized, with large display type overlaid directly on imagery. Section dividers are minimal — just whitespace and a shift to the dusty rose surface. A right-pointing arrow on the right edge of grids indicates horizontal scroll/carousel pagination. Vertical text labels run sideways along the left edge of grid sections. The overall rhythm is magazine-spread: dramatic size jumps between sections, no consistent card or container chrome.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f2e9de
- secondary surface: #ddc9c0
- border: #000000
- accent: no distinct accent color (system is monochromatic-warm)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Create the top announcement bar: full-width #f2e9de background, centered uppercase text at 12px Sofia Pro weight 400, 0.05em letter-spacing, #000000, 10px vertical padding, 1px solid #000000 border-bottom.

2. Create the main navigation: full-width #f2e9de background, centered wordmark 'DS&D URGA' at 30px Sofia Pro weight 800 with -0.05em tracking in #000000. Left side: uppercase nav items (PERFUME, CANDLES, SKIN, AUTO, GIFTS) at 14px weight 400 with 0.05em tracking, 30px horizontal padding. Right side: '$ USD' in a 1px black-bordered box, then account/search/cart icons as 1px black strokes. 10px vertical padding, 1px solid #000000 border-bottom.

3. Create an editorial hero caption block: left-aligned in white space, no container. Headline 'For Your Mom' at 60px Sofia Pro weight 800, -0.05em tracking, line-height 0.92, #000000. Below: ghost text link 'MOTHER\u2019S DAY GIFT GUIDE' at 12px weight 400, 0.05em tracking, uppercase, #000000, underlined.

4. Create a product image grid cell: full-bleed product photograph at 100% width and height of its grid cell, 0px border-radius, no padding, no border, no shadow. The bone canvas (#f2e9de) gap between cells is the only separator.

5. Create a carousel section: horizontal row of 3 product tiles with a 1px solid #000000 border separating the section from adjacent content. At the right edge, a '>' chevron icon in 1px black stroke at 40px size, vertically centered. No dots, no progress bar, no background — just the arrow.

## Typographic Scale Philosophy

The type scale is deliberately bimodal: a tight cluster of small sizes (12, 14, 16, 18px) for all utility, body, and label work, and a dramatic leap to 30, 60, and 120px for editorial display. The gap between 18px and 30px is intentional — there are no 20-24px intermediate sizes because the system wants to jump from 'reading' to 'announcing' without middle ground. Line-height tightens aggressively as size increases: 1.43 at 12px → 1.27 at 16px → 0.92 at 60px → 0.83 at 120px. This compression at large sizes is what makes the 800-weight display feel like a magazine cover rather than a web headline.

## Similar Brands

- **Aesop** — Same restrained warm-neutral palette (cream/ivory with black type) and editorial product photography as the primary visual content — both treat the product as still-life art rather than merchandise
- **Le Labo** — Shared indie-perfumery sensibility with a single display typeface pushed to extreme sizes and a minimal interface that lets product photography dominate — both feel more like zine than storefront
- **Byredo** — Similar use of oversized serif/sans display type as hero element with a near-achromatic warm palette and product-as-hero photography approach
- **Mansur Gavriel** — Same bone-white canvas with black ink typography and minimal UI chrome — both use type size contrast and whitespace as their primary design tools, with no decorative color or effects
- **Maison Margiela (replica site)** — Editorial broadsheet layout with asymmetric grids, oversized type overlaid on imagery, and a near-total absence of conventional e-commerce interface patterns

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #f2e9de;
  --color-dusty-rose: #ddc9c0;

  /* Typography — Font Families */
  --font-sofia-pro: 'Sofia Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.05px;
  --text-body: 16px;
  --leading-body: 1.27;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.05px;
  --text-heading: 60px;
  --leading-heading: 0.92;
  --tracking-heading: -0.05px;
  --text-display: 120px;
  --leading-display: 0.83;
  --tracking-display: -0.05px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 50-60px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-white-canvas: #f2e9de;
  --surface-dusty-rose-band: #ddc9c0;
  --surface-ink-black-overlay: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #f2e9de;
  --color-dusty-rose: #ddc9c0;

  /* Typography */
  --font-sofia-pro: 'Sofia Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.05px;
  --text-body: 16px;
  --leading-body: 1.27;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.05px;
  --text-heading: 60px;
  --leading-heading: 0.92;
  --tracking-heading: -0.05px;
  --text-display: 120px;
  --leading-display: 0.83;
  --tracking-display: -0.05px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-80: 80px;
}
```
