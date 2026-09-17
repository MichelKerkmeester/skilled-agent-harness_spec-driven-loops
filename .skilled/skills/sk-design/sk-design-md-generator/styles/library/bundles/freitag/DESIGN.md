# Freitag — Style Reference
> Swiss industrial catalog — a printed manifest of truck tarpaulins laid flat on poured concrete, where the only color is the recycled product itself.

**Theme:** light

Freitag operates as a Swiss industrial catalog in monochrome: an almost color-zero system where the only chromatic surface is the product itself (truck tarpaulin bags bleeding red, yellow, blue, green). The UI is a grid of black, white, and concrete gray, serving as a neutral stage for the circular-economy merchandise. Typography is compressed and uppercase-driven (Akkurat Standard), line-heights tight as machinery, letterspacing wide on labels, and interactive elements shaped as horizontal pills with hard-edged 1px outlines. Layout follows a strict modular grid — full-bleed 50/50 hero, then 3-column category blocks, then 6-column product matrices. The signature trick: the site reads as a technical specification sheet or shipping manifest, not a fashion storefront. Components feel like they're stamped on the page rather than designed — pill buttons, thin rules, hairline grids, and almost no shadow depth.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Black | `#000000` | `--color-carbon-black` | Primary text, logo plate, pill-button fills, hairline borders, icon strokes — the dominant ink that carries every label, heading, and outline |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, product image backdrops, button text on dark fills, inverted text on category overlays |
| Concrete Gray | `#cacaca` | `--color-concrete-gray` | Card borders, thumbnail dividers, secondary dividers between product cells — the structural neutral that frames the grid |
| Mist Gray | `#f1f1f1` | `--color-mist-gray` | Subtle surface tint for inactive button states and soft fill washes, never a page background |
| Iron Gray | `#404040` | `--color-iron-gray` | Deep shadow tone and heavier border treatment for elevated containers and section breaks |
| Ash Gray | `#616161` | `--color-ash-gray` | Muted secondary text, body helpers, tertiary borders — the gray that whispers beneath the ink |
| Ink | `#1a1b1e` | `--color-ink` | Rare near-black accent for solid button fills that need a touch of warmth without drifting to pure carbon |
| Caution Yellow | `#ffdd00` | `--color-caution-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |

## Tokens — Typography

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 11px, 16px
- **Line height:** 1.15, 1.5
- **Letter spacing:** 0.02
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### AkkStdRg (Akkurat Standard) — Sole brand typeface. The neo-grotesque Swiss workhorse used for everything from display headlines down to 8px eyebrow labels. Weight stays at 400 — no bold weight exists in the system; emphasis is achieved through size, uppercase, and tracking. The 0.74 line-height on display sizes is anti-conventional and creates a compressed, industrial poster effect. Wide tracking on small sizes (0.04–0.05em) gives labels the spacing of machine-stamped serial numbers. · `--font-akkstdrg-akkurat-standard`
- **Substitute:** Inter, Helvetica Neue, Aktiv Grotesk
- **Weights:** 400
- **Sizes:** 8px, 10px, 11px, 16px, 24px, 32px, 48px
- **Line height:** 0.74 / 0.97 / 1.10 / 1.15 / 1.28 / 1.50
- **Letter spacing:** −0.48px at 48px, −0.16px at 32px, +0.32px at 16px, +0.44px at 11px, +0.50px at 10px, +0.40px at 8px
- **OpenType features:** `"tnum" on, "ss01" on`
- **Role:** Sole brand typeface. The neo-grotesque Swiss workhorse used for everything from display headlines down to 8px eyebrow labels. Weight stays at 400 — no bold weight exists in the system; emphasis is achieved through size, uppercase, and tracking. The 0.74 line-height on display sizes is anti-conventional and creates a compressed, industrial poster effect. Wide tracking on small sizes (0.04–0.05em) gives labels the spacing of machine-stamped serial numbers.

### FRg (Freitag Regular) — Reserved for product model codes (F141 CLARK, F531 ARCHER) — a secondary condensed-mark treatment that makes the SKU read as a stamped part number on a shipping crate · `--font-frg-freitag-regular`
- **Substitute:** Akkurat Standard Small Caps
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 0.74
- **Letter spacing:** +0.50px
- **Role:** Reserved for product model codes (F141 CLARK, F531 ARCHER) — a secondary condensed-mark treatment that makes the SKU read as a stamped part number on a shipping crate

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1
- **Role:** Arial — detected in extracted data but not described by AI

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label-sm | 11px | 1.15 | 0.44px | `--text-label-sm` |
| body | 16px | 1.5 | 0.32px | `--text-body` |
| subheading | 24px | 1.28 | — | `--text-subheading` |
| heading | 32px | 0.97 | -0.16px | `--text-heading` |
| display | 48px | 0.97 | -0.48px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| badges | 9999px |
| images | 12px |
| buttons | 9999px |
| inline-links | 4px |
| nav-elements | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.12) 2px 2px 10px 0px` | `--shadow-md` |
| subtle | `rgb(64, 64, 64) 0px -1px 0px 0px` | `--shadow-subtle` |
| sm | `rgba(45, 45, 45, 0.5) 2px 2px 5px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64-80px
- **Card padding:** 12px
- **Element gap:** 12px

## Components

### Primary Pill Button
**Role:** Highest-priority action — hero CTAs, category entry, product discovery

Solid Carbon Black (#000000) fill, Paper White (#ffffff) text, 9999px border-radius (fully rounded pill), padding 12px 22px, Akkurat 10–11px weight 400 uppercase with +0.5px tracking. Subtle drop shadow rgba(0,0,0,0.12) 2px 2px 10px. The pill shape is the signature — never rectangular buttons exist in this system.

### Ghost Pill Button
**Role:** Secondary action — 'DISCOVER ONE-OFF ITEMS', 'ABOUT PRODUCTION' on category cards

Paper White (#ffffff) fill, 1px Carbon Black border, Carbon Black text, 9999px radius, 12px 22px padding. Sits over photographic category backdrops where the white fill makes the CTA legible without competing with the image.

### Category Card (3-Column)
**Role:** Top-level product category entry — Shoulder Bags, Laptop Sleeves, Made in Europe

Square aspect ratio, full-bleed product photography (not contained — the image IS the card), Concrete Gray (#cacaca) optional 1px border. Heading overlays bottom-left in Paper White, 32–48px Akkurat weight 400 uppercase. Ghost pill button positioned directly beneath the heading. Three cards in a horizontal row, separated by 1px white gutters rather than margins.

### Product Cell (6-Column Grid)
**Role:** Individual SKU display in catalog matrix

White surface with 1px Concrete Gray (#cacaca) border on all sides — the cells form a continuous ruled grid. Top: product photo on white background, 12px corner radius. Below: FRg 10px model code (e.g. 'F141 CLARK'), price in Akkurat 11px (e.g. '175.75 CHF'). No card shadow — the grid lines provide all separation. Status badges float bottom-right of the photo.

### Status Badge (NEW / BESTSELLER)
**Role:** Product highlight indicator

Pill shape (9999px radius), Paper White fill, 1px Carbon Black border, 8px Akkurat uppercase text. Positioned absolute bottom-right of product image. The 'NEW' variant sometimes uses Caution Yellow (#ffdd00) dot accent next to the white pill. Restrained — never more than 5% of catalog cells carry a badge.

### Top Navigation Bar
**Role:** Persistent site chrome

White background, 1px bottom border in Concrete Gray. Left: 'FREITAG' eyebrow label and 'PRODUCTS' / 'MISSION' links in Akkurat 10px uppercase. Center: black rectangular logo plate (Carbon Black fill, white 'FREITAG' wordmark, 16px corner radius). Right: language switcher (LANGUAGE (EN), DELIVER TO (CH)), cart icon, account icon. Height approximately 56–64px. Sticky on scroll.

### Language & Region Switcher
**Role:** Top-right utility — locale and shipping destination

Two inline pill containers (16px radius), each with eyebrow label in muted gray + active value in Carbon Black uppercase, separated by 8px gap. Reads as a labeled control rather than a dropdown when collapsed.

### Hero Section (50/50 Split)
**Role:** Above-the-fold editorial / campaign module

Full-bleed, two equal vertical panels — left image on green backdrop, right image on neutral backdrop. Display headline (48px Akkurat weight 400) overlays bottom-left of the first panel in Paper White, followed by a primary pill button. Below the panels: eyebrow label ('WE THINK AND ACT IN CYCLES') in 10px uppercase, then a 48–56px display heading that often truncates mid-phrase — the truncation IS the layout, not an error.

### Section Heading Block
**Role:** Introduces a new content band (e.g. 'FRESHLY UPLOADED')

Left-aligned Akkurat 32px weight 400 uppercase, Paper White surface, no decoration. Followed by an optional 16px body paragraph in Iron Gray (#404040). 64–80px vertical padding separates from the grid below.

### Scroll-to-Top Indicator
**Role:** Bottom-center affordance on long catalog pages

Minimal arrow glyph (↑) in Carbon Black on white, positioned at the bottom edge of the product matrix above the footer. No button chrome — just the typographic mark.

### Chat Bubble (Bottom-Right)
**Role:** Customer service entry

Black circular icon (44px) in the fixed bottom-right corner with a white speech-bubble glyph. The only persistently floating element on the page.

## Do's and Don'ts

### Do
- Use Akkurat Standard (or Inter / Aktiv Grotesk as substitute) for ALL text — no other typefaces, no decorative scripts, no display serifs
- Set display headlines at 48px with line-height 0.97 and letter-spacing −0.48px for the compressed industrial poster effect
- Use the 9999px pill radius for every button, badge, and pill-shaped control — rectangular buttons do not exist in this system
- Apply 0.04–0.05em letter-spacing on all text 11px and smaller to make labels read as stamped serial numbers
- Keep the product grid on a strict 1px Concrete Gray (#cacaca) ruled lattice — no card shadows, no rounded card containers around individual SKUs
- Reserve #ffdd00 (Caution Yellow) for 'NEW' dot accents only — never as a wash, background, or large surface
- Let product photography carry all color — the UI chrome must remain achromatic so the recycled tarpaulin goods read as the only chromatic element

### Don't
- Do not introduce color fills, gradients, or brand chromatic washes — the system is intentionally 0% colorful in the UI layer
- Do not use bold (600+) or semibold (500) weights — the entire system is weight 400, and emphasis comes from size, case, and tracking
- Do not add drop shadows to product cells or category cards — shadow is reserved for floating primary buttons only
- Do not center-align body text or section headings — everything is left-aligned with a hard left margin
- Do not use a separate 'primary action' color — buttons are pure Carbon Black on white or white on Carbon Black, nothing in between
- Do not add rounded card containers around products inside the catalog matrix — the ruled grid IS the container
- Do not let line-height exceed 1.5 on body text or drop below 0.74 on display — those are the system's tight compression bounds

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background and product photo backdrop |
| 1 | Muted Surface | `#f1f1f1` | Inactive button fills and subtle tonal washes |
| 2 | Ruled Cell | `#cacaca` | 1px borders that form the catalog grid lattice |
| 3 | Logo Plate | `#000000` | Inverted black surface for the centered FREITAG wordmark and the only primary button fill |

## Elevation

- **Primary Pill Button:** `rgba(0, 0, 0, 0.12) 2px 2px 10px 0px`
- **Section Divider:** `rgb(64, 64, 64) 0px -1px 0px 0px`

## Imagery

Photography is product-first and brutally direct — no lifestyle, no models-in-context, no environmental shots. Bags are shot dead-center on pure white, cropped at the handle, occupying the full cell of the catalog grid. Hero photography uses two complementary editorial shots side-by-side: one on a saturated brand-colored backdrop (green, blue) and one on neutral gray, so the tarpaulin colors pop against the solid color while the second shot anchors it to the monochrome system. The 'Made in Europe' category card shows a hand at work — leather, thread, industrial textile — as documentary proof of the manufacturing process rather than aspirational lifestyle. No illustrations, no 3D renders, no abstract graphics. Icons are line-only, single-weight, and confined to the nav (cart, account, search). The visual density is overwhelmingly product-driven: the catalog grid takes roughly 70% of any catalog page's vertical real estate.

## Layout

Full-bleed hero alternates with max-width 1440px centered content bands. The hero is a strict 50/50 vertical split with no margin between the two image panels — the seam between images is the layout. After the hero, content flows through left-aligned section blocks with 64–80px vertical padding, each capped by an uppercase Akkurat heading. The catalog itself uses a 6-column grid of equal-width product cells separated by 1px Concrete Gray rules (no gutters — the borders touch), creating a continuous ruled sheet. Category entry uses a 3-column row of square aspect-ratio image cards. Navigation is a single sticky white bar with a centered black logo plate — logo-on-black is the only inverted surface in the header. The footer (partially visible) continues the flat white treatment with sparse uppercase links. There is no sidebar, no mega-menu, no modal overlay chrome — every interaction either navigates or opens a minimal lightbox.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #cacaca
- muted text: #616161
- accent (NEW tag dot only): #ffdd00
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Category card row*: Three equal square cells in a horizontal row on white, each with a full-bleed product photograph (no border, no padding around the image). Paper White heading 'SHOULDER BAGS' in 48px Akkurat weight 400 uppercase, positioned bottom-left. Ghost pill button 'DISCOVER ONE-OFF ITEMS' below: white fill, 1px Carbon Black border, black text, 9999px radius. 1px Concrete Gray (#cacaca) vertical rules between the three cells.

3. *Product catalog cell*: White surface, 1px Concrete Gray (#cacaca) border on all four sides. Product photograph centered on white with 12px corner radius. Below the image: FRg 10px uppercase model code 'F141 CLARK' with +0.5px tracking, then '175.75 CHF' in Akkurat 11px weight 400. Optional 'BESTSELLER' pill badge absolute bottom-right of the photo: 9999px radius, white fill, 1px black border, 8px Akkurat uppercase.

4. *Navigation bar*: White background, 1px Concrete Gray bottom border. Left side: 'FREITAG' eyebrow + 'PRODUCTS' / 'MISSION' links in Akkurat 10px uppercase. Center: Carbon Black rectangular logo plate 16px corner radius, white 'FREITAG' wordmark inside. Right side: 'LANGUAGE (EN)' and 'DELIVER TO (CH)' as inline 16px-radius pills, then cart icon and account icon as line-only glyphs. Total height 56px, sticky.

5. *Section heading block*: Left-aligned on white canvas, 64px top padding. 'FRESHLY UPLOADED' in Akkurat 32px weight 400 uppercase, letter-spacing −0.16px, line-height 0.97. Optional subhead below in 16px Akkurat weight 400, Iron Gray (#404040), line-height 1.5. No underline, no accent rule, no decoration.

## Similar Brands

- **Patagonia** — Same industrial-utility catalog language — monochrome UI serving as a neutral stage for colorful product photography, and uppercase eyebrow labels leading every section
- **Carhartt WIP** — Same workwear-rooted monochrome system: black logo plate, pill-shaped CTAs, ruled grid of product cells, and a complete absence of decorative gradients or color washes
- **VEJA** — Same Swiss-eco-brand approach — zero colorfulness in the UI layer so the recycled/organic products carry all the chromatic weight, with strict 1px-bordered grid cells
- **Café du Cycliste** — Same editorial-cycling aesthetic with full-bleed photography, oversized Akkurat-style neo-grotesque headlines, and a flat white catalog grid
- **Aesop** — Same Swiss-apothecary catalog restraint: typographic hierarchy doing the work that color usually does, with dense product matrices and hairline grid rules

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-black: #000000;
  --color-paper-white: #ffffff;
  --color-concrete-gray: #cacaca;
  --color-mist-gray: #f1f1f1;
  --color-iron-gray: #404040;
  --color-ash-gray: #616161;
  --color-ink: #1a1b1e;
  --color-caution-yellow: #ffdd00;

  /* Typography — Font Families */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-akkstdrg-akkurat-standard: 'AkkStdRg (Akkurat Standard)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-frg-freitag-regular: 'FRg (Freitag Regular)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label-sm: 11px;
  --leading-label-sm: 1.15;
  --tracking-label-sm: 0.44px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.28;
  --text-heading: 32px;
  --leading-heading: 0.97;
  --tracking-heading: -0.16px;
  --text-display: 48px;
  --leading-display: 0.97;
  --tracking-display: -0.48px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64-80px;
  --card-padding: 12px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-badges: 9999px;
  --radius-images: 12px;
  --radius-buttons: 9999px;
  --radius-inline-links: 4px;
  --radius-nav-elements: 16px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 2px 2px 10px 0px;
  --shadow-subtle: rgb(64, 64, 64) 0px -1px 0px 0px;
  --shadow-sm: rgba(45, 45, 45, 0.5) 2px 2px 5px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-muted-surface: #f1f1f1;
  --surface-ruled-cell: #cacaca;
  --surface-logo-plate: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-black: #000000;
  --color-paper-white: #ffffff;
  --color-concrete-gray: #cacaca;
  --color-mist-gray: #f1f1f1;
  --color-iron-gray: #404040;
  --color-ash-gray: #616161;
  --color-ink: #1a1b1e;
  --color-caution-yellow: #ffdd00;

  /* Typography */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-akkstdrg-akkurat-standard: 'AkkStdRg (Akkurat Standard)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-frg-freitag-regular: 'FRg (Freitag Regular)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label-sm: 11px;
  --leading-label-sm: 1.15;
  --tracking-label-sm: 0.44px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.28;
  --text-heading: 32px;
  --leading-heading: 0.97;
  --tracking-heading: -0.16px;
  --text-display: 48px;
  --leading-display: 0.97;
  --tracking-display: -0.48px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 2px 2px 10px 0px;
  --shadow-subtle: rgb(64, 64, 64) 0px -1px 0px 0px;
  --shadow-sm: rgba(45, 45, 45, 0.5) 2px 2px 5px 0px;
}
```
