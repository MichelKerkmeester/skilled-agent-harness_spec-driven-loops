# ALIGNE — Style Reference
> editorial spec sheet on warm charcoal

**Theme:** light

ALIGNE operates in near-total monochrome — warm charcoal (#24170f) on warm white, with a single blue accent for badge punctuation. The visual language sits at the intersection of fashion editorial and architectural spec sheet: monospace body type, extended sans-serif headlines with dramatically wide tracking, almost zero border-radius, and photography that does the heavy lifting while UI chrome dissolves into thin lines and small uppercase labels. Layouts are grid-rigid and generous, with product cards sitting on bare white — the garments, not the interface, are the interface. The single chromatic event in the system is a vivid blue (#0073ff) reserved exclusively for 'NEW IN' badge outlines, functioning as functional punctuation rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Charcoal | `#24170f` | `--color-warm-charcoal` | Primary action background (filled CTA buttons), high-prominence borders, dark surface bands, nav and footer text on light backgrounds |
| Soft Black | `#151515` | `--color-soft-black` | Body text, headings on light backgrounds, general borders, link text — the workhorse dark neutral |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, text on dark hero/footer bands, outlined action borders (ghost buttons on dark imagery) |
| Ash Gray | `#ececec` | `--color-ash-gray` | Secondary surface for alternating sections, subtle background bands |
| Signal Blue | `#0073ff` | `--color-signal-blue` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis. |

## Tokens — Typography

### GT America Mono — Body, nav labels, product names, prices, buttons, badges, footer links, captions — the structural typeface carrying all functional UI text · `--font-gt-america-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 10, 11, 12, 14, 15, 16, 24
- **Line height:** 0.80–1.70
- **Letter spacing:** 0.063em at 14px, 0.067em at 12px, 0.093em at 10px, 0.011em at 16px, 0.010em at 24px
- **OpenType features:** `"kern" on`
- **Role:** Body, nav labels, product names, prices, buttons, badges, footer links, captions — the structural typeface carrying all functional UI text

### Nimbus Sans Extended — Display headings and section titles — dramatically wide tracking (0.10–0.15em at display sizes) creates architectural, label-like headlines that feel stamped rather than typeset · `--font-nimbus-sans-extended`
- **Substitute:** Bebas Neue, Oswald, Barlow Condensed
- **Weights:** 400, 700
- **Sizes:** 10, 15, 24, 25, 40, 60
- **Line height:** 0.70–1.20
- **Letter spacing:** 0.10em at 40px, 0.133em at 60px, 0.150em at 10px, 0.048em at 25px
- **OpenType features:** `"kern" on`
- **Role:** Display headings and section titles — dramatically wide tracking (0.10–0.15em at display sizes) creates architectural, label-like headlines that feel stamped rather than typeset

### GTAmericaMonoRegular — GTAmericaMonoRegular — detected in extracted data but not described by AI · `--font-gtamericamonoregular`
- **Weights:** 400, 700
- **Sizes:** 10px, 12px, 14px, 16px
- **Line height:** 1, 1.2, 1.5, 1.68
- **OpenType features:** `"kern"`
- **Role:** GTAmericaMonoRegular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | 0.93px | `--text-caption` |
| body | 14px | 1.7 | 0.88px | `--text-body` |
| heading-sm | 24px | 1.28 | 0.24px | `--text-heading-sm` |
| heading | 40px | 1.13 | 4px | `--text-heading` |
| display | 60px | 1.07 | 7.98px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.15) 0px 2px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary CTA Button
**Role:** Main action trigger — used for 'VIEW ALL', 'DISCOVER', category entry

Filled button, #24170f background, #ffffff text, 0px radius, padding 17px 40px, GT America Mono 12px weight 500, letter-spacing 0.067em uppercase, no shadow. Tight, rectangular, architectural.

### Ghost Outline Button
**Role:** Secondary action on dark imagery — 'DISCOVER THE COLLECTION' over hero photo

Transparent background, 1px #ffffff border, #ffffff text, 0px radius, padding 17px 40px, GT America Mono 12px weight 500, letter-spacing 0.067em uppercase.

### New In Badge
**Role:** Product novelty indicator on product cards

1px #0073ff border, #0073ff text, 0px radius, padding ~5px 10px, GT America Mono 10px weight 500, letter-spacing 0.093em uppercase. Sits inline with product name.

### Product Card
**Role:** Grid item for new arrivals and category listings

Full-bleed editorial photograph (0px radius, no border), product name in GT America Mono 12px weight 500 #151515, 'NEW IN' badge inline, price in GT America Mono 12px weight 400 #151515. A small '+' icon in bottom-right corner of image for quick-add. No card chrome — image bleeds directly into the white canvas.

### Top Navigation Bar
**Role:** Persistent site navigation

Transparent over hero, sits over imagery. Logo mark (small icon) far left, nav links (SHOP, DISCOVER, currency selector, LOGIN, CART with count) far right. All text GT America Mono 11px weight 500, letter-spacing 0.071em uppercase, #ffffff on dark hero / #151515 on light sections.

### Section Header
**Role:** Intro label for each content block — New Arrivals, Network, etc.

Two-tier: a small uppercase eyebrow label (GT America Mono 10px, letter-spacing 0.093em, #151515) above a large extended heading (Nimbus Sans Extended weight 700, 40px, letter-spacing 4px, #151515). Centered or left-aligned depending on section.

### Hero Image Section
**Role:** Full-viewport campaign imagery with text overlay

Full-bleed editorial photograph spanning viewport width. Centered text overlay: headline in Nimbus Sans Extended 60px weight 700, letter-spacing 8px, #ffffff. Ghost outline button below. No gradients, no overlays — text sits directly on the photograph.

### Category Split Banner
**Role:** Two-column product category showcase

Dark (#24170f) background section, two large images side by side. Small white silhouette product icon centered on each image, creating a label/tab effect.

### Instagram Grid Card
**Role:** Social proof — UGC content in the 'Aligne Network' section

Full-bleed square or portrait image, 0px radius, Instagram icon (#ffffff, ~20px) overlaid in bottom-left corner. No text, no border — pure image tile.

### Footer Link Column
**Role:** Site map and customer care links

Three-column layout (EXPLORE, CUSTOMER CARE, FOLLOW). Column title in Nimbus Sans Extended 16px weight 700, letter-spacing 1.6px, #151515 uppercase. Links in GT America Mono 12px weight 400, #151515, stacked vertically with ~8px row gap.

### Quick-Add Plus Icon
**Role:** Add-to-cart trigger on product card images

Small '+' glyph in bottom-right of product image, #151515, ~16px. No background, no border — sits as a subtle affordance on the raw image.

## Do's and Don'ts

### Do
- Use 0px border-radius on all components — cards, buttons, badges, images, inputs. Sharp edges are the default.
- Use Nimbus Sans Extended with letter-spacing ≥4px for any heading at 40px or above. The wide tracking is non-negotiable for brand identity.
- Use GT America Mono for all body, nav, button, badge, and price text. The monospace face is the system's structural backbone.
- Use #24170f as the filled primary action color and #ffffff as the text color on it. No other button background color.
- Reserve #0073ff exclusively for 'NEW IN' badge borders and text. Never use it for buttons, links, headings, or large surfaces.
- Let product photography bleed full-width within its container with 0px radius. No rounded image crops, no image borders, no image shadows.
- Use uppercase for all UI text — nav items, buttons, section labels, footer links. Sentence case breaks the system's typographic logic.

### Don't
- Don't introduce border-radius > 0px on any element. The system is intentionally sharp-edged.
- Don't use a sans-serif body font. GT America Mono is the only body typeface. Switching to a proportional sans would erase the system's identity.
- Don't use color for buttons other than #24170f (filled) or transparent with white border (ghost). No blue buttons, no red buttons, no gradients.
- Don't apply tracking below 0.01em to GT America Mono body text. The positive letter-spacing is essential to the monospace feel.
- Don't use #0073ff for anything larger than a badge. It is a 10–12px accent, not a surface color or CTA color.
- Don't add card shadows, floating panels, or elevated modals. The system is flat — everything sits flush on white or warm charcoal.
- Don't use illustrations, icons beyond tiny monochrome silhouettes, or decorative graphics. Photography and type are the only visual languages.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm White Canvas | `#ffffff` | Default page background for all content sections |
| 1 | Ash Gray Band | `#ececec` | Alternating section background for visual separation |
| 2 | Warm Charcoal Surface | `#24170f` | Dark hero overlays, category banners, dark contrast sections |

## Elevation

- **Primary CTA Button (hover/active):** `rgba(0, 0, 0, 0.15) 0px 2px 10px 0px`

## Imagery

Full-bleed editorial fashion photography is the dominant visual element. Images span edge-to-edge within their containers, always with 0px border-radius, creating a raw print-magazine quality. Photography is high-contrast, natural-light, street and rooftop settings — models in urban environments wearing the garments. No lifestyle staging, no props, no text overlays on product images. The only non-photographic visual elements are tiny white product silhouette icons (dress outlines) used as category labels on dark banner images. The ratio of imagery to UI chrome is extremely high — roughly 70% of viewport real estate is photograph.

## Agent Prompt Guide

**Quick Color Reference**
- text: #151515
- background: #ffffff
- border: #24170f
- accent: #0073ff (badges only)
- primary action: #24170f (filled action)
- dark surface: #24170f

**3-5 Example Component Prompts**

1. **Hero section with overlaid headline:** Full-bleed editorial photograph spanning viewport. Centered headline in Nimbus Sans Extended 60px weight 700, letter-spacing 8px, #ffffff, uppercase. Ghost outline button below: transparent background, 1px #ffffff border, #ffffff text, 0px radius, 17px 40px padding, GT America Mono 12px weight 500, letter-spacing 0.067em uppercase.

2. **Product card grid item:** Full-bleed photograph, 0px radius, no border. Below image: product name in GT America Mono 12px weight 500, #151515, with inline 'NEW IN' badge (1px #0073ff border, #0073ff text, 0px radius, 5px 10px padding, GT America Mono 10px weight 500, letter-spacing 0.093em uppercase). Price in GT America Mono 12px weight 400, #151515. Small '+' icon in bottom-right of image in #151515.

3. **Section header block:** Small uppercase eyebrow label in GT America Mono 10px, letter-spacing 0.093em, #151515, centered. Below it, large heading in Nimbus Sans Extended 40px weight 700, letter-spacing 4px, #151515, centered. No divider, no rule — just vertical spacing.

4. **Footer link column:** Column title in Nimbus Sans Extended 16px weight 700, letter-spacing 1.6px, #151515, uppercase. Links stacked vertically with 8px row gap, GT America Mono 12px weight 400, #151515. Three columns side by side on white background.

5. **Category dark banner:** Full-width section with #24170f background. Two large editorial images side by side, each with a small white dress silhouette icon centered on top, #ffffff, ~24px. No text, no buttons — the images and icons carry the section.

## Typography Philosophy

The system pairs GT America Mono (monospace) for all functional text with Nimbus Sans Extended (wide sans-serif) for display headings. This creates a deliberate tension: monospace signals precision, technicality, spec-sheet authority; extended sans-serif with dramatic tracking signals fashion editorial. Body text at 12–14px carries positive tracking (0.06–0.09em) — unusual for body copy, which makes the monospace feel airier and more deliberate. Display headings at 40–60px reach tracking values of 4–8px, making them feel stamped or engraved rather than typeset. The "kern" font feature is always on.

## Similar Brands

- **Toteme** — Same near-monochrome palette, editorial full-bleed photography, minimal UI chrome, and restrained typography for a luxury fashion feel
- **The Row** — Similar austere monochrome aesthetic with warm dark surfaces, sharp edges, and photography as the sole decorative element
- **Mr Porter** — Same editorial layout pattern — full-bleed hero, 3-column product grid, uppercase nav, and minimal-but-precise UI elements
- **Aesop** — Comparable typographic discipline — monospace and wide-tracked sans-serif pairing, warm-neutral palette, zero decorative ornamentation
- **COS** — Same architectural flat-layout approach with product grids, generous white space, and a single restrained accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-charcoal: #24170f;
  --color-soft-black: #151515;
  --color-pure-white: #ffffff;
  --color-ash-gray: #ececec;
  --color-signal-blue: #0073ff;

  /* Typography — Font Families */
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-nimbus-sans-extended: 'Nimbus Sans Extended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtamericamonoregular: 'GTAmericaMonoRegular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 0.93px;
  --text-body: 14px;
  --leading-body: 1.7;
  --tracking-body: 0.88px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.28;
  --tracking-heading-sm: 0.24px;
  --text-heading: 40px;
  --leading-heading: 1.13;
  --tracking-heading: 4px;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: 7.98px;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;

  /* Surfaces */
  --surface-warm-white-canvas: #ffffff;
  --surface-ash-gray-band: #ececec;
  --surface-warm-charcoal-surface: #24170f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-charcoal: #24170f;
  --color-soft-black: #151515;
  --color-pure-white: #ffffff;
  --color-ash-gray: #ececec;
  --color-signal-blue: #0073ff;

  /* Typography */
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-nimbus-sans-extended: 'Nimbus Sans Extended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtamericamonoregular: 'GTAmericaMonoRegular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 0.93px;
  --text-body: 14px;
  --leading-body: 1.7;
  --tracking-body: 0.88px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.28;
  --tracking-heading-sm: 0.24px;
  --text-heading: 40px;
  --leading-heading: 1.13;
  --tracking-heading: 4px;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: 7.98px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;
}
```
