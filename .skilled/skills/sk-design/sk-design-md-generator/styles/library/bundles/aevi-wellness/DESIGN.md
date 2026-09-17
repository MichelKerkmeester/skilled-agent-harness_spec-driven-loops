# Aevi Wellness — Style Reference
> Nordic apothecary, weightless type. A muted slate-blue accent interrupts an otherwise achromatic, light-as-air editorial layout where product photography overlaps hairline-bordered cards on warm white.

**Theme:** light

Aevi Wellness reads like a Nordic editorial spread translated into e-commerce: generous product photography overlapping a warm off-white canvas, whisper-weight typography that gives headlines room to breathe, and a single muted slate-blue accent that appears only where the brand needs to signal action or section shift. The palette is almost entirely achromatic — warm near-black text (#231f20), pure white surfaces, and a powder-blue band (#d5e0ea) that structures the page into editorial chapters. Components are barely-there: ultra-thin hairline borders, 2px corner radii on most elements, and 60px pill buttons for primary actions. The overall feel is clinical-luxury — the products themselves are the visual subject, and the interface stays out of their way.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Powder Blue | `#d5e0ea` | `--color-powder-blue` | Section bands, card borders, decorative dividers — the brand's secondary canvas, used to segment the page into editorial chapters without introducing contrast |
| Slate Bloom | `#a3bfdb` | `--color-slate-bloom` | Primary action buttons, active states — the single chromatic accent; its low saturation keeps it feeling clinical rather than commercial |
| Warm Ink | `#231f20` | `--color-warm-ink` | Primary text, hairline borders, card outlines, icon strokes — near-black with a warm undertone that softens the high-contrast text against white |
| True Black | `#000000` | `--color-true-black` | Icon fills, occasional heavy borders — used sparingly for graphical weight when maximum contrast is needed |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, text on dark blocks — the dominant canvas, never off-white or cream |
| Mist Gray | `#5f6368` | `--color-mist-gray` | Muted helper text, secondary metadata, low-priority labels — only when a softer reading level is needed without leaving the achromatic palette |

## Tokens — Typography

### Primary Font — Primary Font — detected in extracted data but not described by AI · `--font-primary-font`
- **Weights:** 300
- **Sizes:** 10px, 12px, 14px, 16px
- **Line height:** 1.29, 1.3, 1.31, 1.33
- **Role:** Primary Font — detected in extracted data but not described by AI

### Primary Sans (custom, serif-influenced grotesque) — Body text, button labels, badge text, list items, card metadata at weight 300 — the light weight is anti-convention for utility text and signals editorial restraint · `--font-primary-sans-custom-serif-influenced-grotesque`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 300
- **Sizes:** 
- **Line height:** 1.29–1.33
- **Letter spacing:** normal
- **Role:** Body text, button labels, badge text, list items, card metadata at weight 300 — the light weight is anti-convention for utility text and signals editorial restraint

### Tertiary Sans — Emphasized body copy, card descriptions — weight 500 lifts importance without breaking the light-typographic system · `--font-tertiary-sans`
- **Substitute:** Inter, Söhne
- **Weights:** 500
- **Sizes:** 
- **Line height:** 1.29
- **Role:** Emphasized body copy, card descriptions — weight 500 lifts importance without breaking the light-typographic system

### Display Sans — All headlines and section titles at weight 300 with extremely tight leading — the whisper-weight headlines create authority through restraint, not volume · `--font-display-sans`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 300
- **Sizes:** 
- **Line height:** 1.08–1.11
- **Letter spacing:** normal
- **Role:** All headlines and section titles at weight 300 with extremely tight leading — the whisper-weight headlines create authority through restraint, not volume

### Tertiary Font — Tertiary Font — detected in extracted data but not described by AI · `--font-tertiary-font`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.29
- **Role:** Tertiary Font — detected in extracted data but not described by AI

### Button Font — Button Font — detected in extracted data but not described by AI · `--font-button-font`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.21, 2.71
- **Role:** Button Font — detected in extracted data but not described by AI

### Heading Font — Heading Font — detected in extracted data but not described by AI · `--font-heading-font`
- **Weights:** 300
- **Sizes:** 24px, 28px, 36px, 42px, 54px
- **Line height:** 1.08, 1.09, 1.1, 1.11
- **Role:** Heading Font — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.29 | — | `--text-caption` |
| body | 14px | 1.31 | — | `--text-body` |
| body-lg | 16px | 1.33 | — | `--text-body-lg` |
| heading-sm | 24px | 1.11 | — | `--text-heading-sm` |
| heading | 28px | 1.1 | — | `--text-heading` |
| heading-lg | 36px | 1.09 | — | `--text-heading-lg` |
| heading-xl | 42px | 1.08 | — | `--text-heading-xl` |
| display | 54px | 1.08 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 2px |
| pills | 60px |
| inputs | 2px |
| buttons | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Primary Pill Button
**Role:** Main call-to-action (e.g., 'Create Your Routine')

Filled background #a3bfdb, white text at 14px weight 500, 60px border-radius, 16px horizontal padding and 12px vertical padding. No shadow. The pill shape is the only soft radius in the system — everything else is sharp.

### Ghost / Outlined Button
**Role:** Secondary actions, filter triggers

Transparent background, 1px border in #d5e0ea, text in #231f20, 2px radius, 16px horizontal and 8–12px vertical padding. Sits quietly next to the primary pill without competing.

### Editorial Section Card
**Role:** Content blocks for features, product categories, reviews

White background (#ffffff), 1px hairline border in #231f20, 2px radius, 16px internal padding. No shadow, no elevation — the border alone defines the surface. Often overlaps with photography behind it.

### Product Hero Banner
**Role:** Full-bleed hero on landing and category pages

Full-viewport-width background image (product photography), overlaid with a large display headline (54px, weight 300) and a primary pill CTA. The brand wordmark is set at display size as a decorative overlay, not a heading.

### Press Logo Strip
**Role:** Social proof band of media mentions

Sits on a #d5e0ea background band, logos rendered in #231f20 at uniform height, evenly spaced across the full width. No card containers — the band itself is the container.

### Testimonial Block
**Role:** Customer reviews carousel

#d5e0ea background, 5-star row in #231f20 above body text at 14px weight 300, quoted review text centered, product name and reviewer attribution in small caps below at 10–12px. 2px radius container.

### Hairline Divider
**Role:** Structural separation between content blocks

1px line in #d5e0ea or #231f20, full-width or section-width. Used more often than spacing alone to define page structure.

### Product Category Card
**Role:** Grid cards linking to product categories (Bestsellers, New, Face Care)

Full-bleed photography with a category label overlaid in the bottom-left corner at 14px weight 300 white text. No border, no padding, no shadow — pure image with typographic caption.

### Header Navigation
**Role:** Top-level site navigation

Transparent or white background, logo left, nav links center or right in 14px weight 300, no background fill on active state — active state indicated by underline in #a3bfdb or color shift to #231f20.

### Badge / Tag
**Role:** Product tags, labels, status indicators

1px border in #d5e0ea, background #ffffff or #d5e0ea, 2px radius, 6–8px vertical padding, text 10–12px weight 300 in #231f20. Minimal footprint.

### Input Field
**Role:** Email capture, search, form fields

1px bottom border in #231f20 (no side or top borders), transparent background, placeholder text 14px weight 300, focus state darkens the border to #000000. No fill, no box.

### Icon
**Role:** Utility and decorative icons

Stroke-based, 1px weight, #231f20 fill, 16–20px size. Minimal, clinical — no rounded ends, no filled variants. Icons never carry color.

## Do's and Don'ts

### Do
- Use #a3bfdb exclusively for the primary action button — never as a decorative fill, text color, or large background area
- Set all headlines at weight 300 with line-height between 1.08 and 1.11; never bold a heading
- Use the 60px radius only for the primary pill button; all other elements (cards, inputs, ghost buttons) use 2px
- Build section separation with #d5e0ea background bands and 1px #231f20 hairlines, not with shadows or large margins
- Let product photography fill its container edge-to-edge; do not pad or frame product images with whitespace
- Keep the palette 95%+ achromatic; any chromatic use must be functional (action, active state) — decorative color dilutes the editorial tone
- Use 4px as the base spacing unit and snap all gaps to multiples of 4 (4, 8, 16, 24, 32, 48)

### Don't
- Do not introduce a second accent color — the system is built on a single muted blue against achromatic neutrals
- Do not apply shadows, glows, or blur to any element; the elevation philosophy is hairline borders only
- Do not use border-radius larger than 2px on anything except the primary pill button (60px)
- Do not set headings at weight 400 or above; weight 300 is the system voice and any heavier weight breaks the editorial register
- Do not use vibrant or saturated colors for icons, links, or hover states — keep all interactive chrome in the existing palette
- Do not pad product photography with large gutters or contained frames; images should bleed
- Do not use colored or filled backgrounds for cards; the card surface is always #ffffff with a 1px border

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base page canvas, card surfaces, product image backgrounds |
| 1 | Powder Blue Band | `#d5e0ea` | Section dividers, press strip, testimonial background — editorial chapter break |
| 2 | Slate Bloom | `#a3bfdb` | Primary action surface, occasional highlight wash — the only chromatic surface |
| 3 | Warm Ink | `#231f20` | Inverted dark surface for text-heavy or closing sections |

## Elevation

The design intentionally avoids shadows, glows, and blur effects entirely. All elevation is communicated through 1px hairline borders in #231f20 or #d5e0ea, through the #d5e0ea background band that separates editorial chapters, and through photography that bleeds beyond its logical container to create depth. The absence of shadow is a deliberate Nordic-apothecary choice — surfaces feel printed rather than digital.

## Imagery

Photography is the dominant visual medium. Product shots are tightly cropped, often with overlapping bottles and dropper applicators creating editorial collage compositions. Lifestyle portraits are natural-light, intimate close-ups (faces, hands applying product), always desaturated or black-and-white in the editorial sections. Press imagery uses a grainy, high-contrast treatment. No illustration, no 3D renders, no abstract graphics — every image is photographic. Imagery is full-bleed and overlapping rather than contained in cards, and labels float over the bottom corner of the image in plain white type. The object is always the subject; there is no lifestyle staging or environmental context.

## Layout

Max-width ~1200px centered, but hero and section bands break out to full-bleed. The page reads as a sequence of full-width editorial chapters: a full-bleed product hero with overlaid wordmark, a press logo strip on a #d5e0ea band, a split editorial section (image left, text right with framed photography), a testimonial carousel on a #d5e0ea band, and a 3-column product category grid. Sections alternate between white and powder-blue to create rhythm. The navigation is a minimal top bar. Section gaps are 48px but feel larger because of the band-to-band color contrast. The layout is text-left/image-right in editorial sections and centered-stacked in product grids.

## Agent Prompt Guide

Quick Color Reference
- text: #231f20
- background: #ffffff
- border: #231f20 (hairline) or #d5e0ea (soft)
- accent: #d5e0ea (section bands, ghost button borders)
- primary action: #a3bfdb (filled action)

Example Component Prompts
1. Create a Primary Action Button: #a3bfdb background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
3. Create an editorial card: background #ffffff, 1px border in #231f20, 2px radius, padding 16px. Body text at 16px weight 300 in #231f20.
4. Create a testimonial block: background #d5e0ea, padding 32px, centered text at 14px weight 300 in #231f20, 5-star row above in #231f20, attribution below in 10px small caps.
5. Create a press logo strip: background #d5e0ea, logos evenly spaced, rendered in #231f20 at uniform height, padding 24px vertical.

## Typography Voice

The most distinctive typographic choice is the exclusive use of weight 300 across the entire system — from body copy to the 54px display headlines. This whisper weight is uncommon in beauty/ecommerce, where most brands default to 500–700 for authority. Here, weight 300 signals clinical confidence: the products speak, the type stays out of the way. Line-heights are notably tight on display (1.08–1.11) and comfortable on body (1.29–1.33), creating a clear contrast between editorial headers and readable utility text. No italic, no decorative serifs in the system itself; serif italics appear only in partner logos and editorial content.

## Similar Brands

- **Tata Harper** — Same editorial-meets-clinical beauty language: hairline borders, light typography, generous product photography, nearly monochrome with one soft accent
- **Noble Panacea** — Similar ultra-minimal skincare aesthetic with whisper-weight headlines, full-bleed product photography, and an almost entirely achromatic palette
- **Lesse** — Same Nordic apothecary mood — sparse layout, product-forward imagery, thin sans-serif at light weights, subtle blue-gray accents on white
- **Sigil Scent** — Shared editorial restraint: weight 300 type, hairline dividers, near-monochrome palette with a single dusty accent, photography that overlaps layout edges

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-powder-blue: #d5e0ea;
  --color-slate-bloom: #a3bfdb;
  --color-warm-ink: #231f20;
  --color-true-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #5f6368;

  /* Typography — Font Families */
  --font-primary-font: 'Primary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-primary-sans-custom-serif-influenced-grotesque: 'Primary Sans (custom, serif-influenced grotesque)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tertiary-sans: 'Tertiary Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display-sans: 'Display Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tertiary-font: 'Tertiary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-button-font: 'Button Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-heading-font: 'Heading Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.29;
  --text-body: 14px;
  --leading-body: 1.31;
  --text-body-lg: 16px;
  --leading-body-lg: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.11;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.09;
  --text-heading-xl: 42px;
  --leading-heading-xl: 1.08;
  --text-display: 54px;
  --leading-display: 1.08;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 60px;

  /* Named Radii */
  --radius-cards: 2px;
  --radius-pills: 60px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-powder-blue-band: #d5e0ea;
  --surface-slate-bloom: #a3bfdb;
  --surface-warm-ink: #231f20;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-powder-blue: #d5e0ea;
  --color-slate-bloom: #a3bfdb;
  --color-warm-ink: #231f20;
  --color-true-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #5f6368;

  /* Typography */
  --font-primary-font: 'Primary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-primary-sans-custom-serif-influenced-grotesque: 'Primary Sans (custom, serif-influenced grotesque)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tertiary-sans: 'Tertiary Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display-sans: 'Display Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tertiary-font: 'Tertiary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-button-font: 'Button Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-heading-font: 'Heading Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.29;
  --text-body: 14px;
  --leading-body: 1.31;
  --text-body-lg: 16px;
  --leading-body-lg: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.11;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.09;
  --text-heading-xl: 42px;
  --leading-heading-xl: 1.08;
  --text-display: 54px;
  --leading-display: 1.08;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 60px;
}
```
