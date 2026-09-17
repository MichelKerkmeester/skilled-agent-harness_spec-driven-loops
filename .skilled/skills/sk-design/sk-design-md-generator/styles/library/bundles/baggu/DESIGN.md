# Baggu — Style Reference
> Sunlit print catalog on cream paper — a single warm off-white surface where black type and product photography do all the work, and a single green whisper says 'new'.

**Theme:** light

Baggu operates as an editorial product catalog: a single warm cream canvas, black type and hairline borders, and product photography that takes 90% of the viewport. The interface is almost entirely achromatic — one warm off-white surface, one true black, and one muted warm gray for secondary metadata. The only chromatic element is a single medium green reserved for the 'New Arrivals' label and success states, functioning as a quiet signal rather than a brand color. Typography is custom and compact: a neo-grotesque at 12–18px with tight tracking and stylistic alternates enabled, sitting close to the baseline so product cards feel like printed price tags. Layout is image-first, text-second: full-bleed editorial triptychs, 5-up product grids, category tiles with caption labels. Density is tight, but the cream surface gives the whole thing room to breathe.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Cream | `#f6f4ee` | `--color-bone-cream` | Page background, card surfaces, button fills, input fields. The signature warm off-white that defines the entire visual field — never pure white, always slightly toasted |
| True Black | `#000000` | `--color-true-black` | Primary text, hairline borders, icons, nav, button outlines, footer. Drawn at full saturation — no softened grays for type |
| Warm Ash | `#7b7a77` | `--color-warm-ash` | Secondary text, muted metadata, breadcrumb separators, helper labels. Sits at AA contrast against bone cream for body text |
| Moss Signal | `#298018` | `--color-moss-signal` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |

## Tokens — Typography

### studioPro — All interface type — body, nav, buttons, headings, product names, prices, footer. The custom neo-grotesque carries the entire identity. Weight 600 for product names and section headers, 700 for the centered wordmark, 400 for everything else. The 'case' feature and full alternates set (ss03, ss06–ss09) are signature — they reshape the letterforms subtly to feel printed rather than rendered. · `--font-studiopro`
- **Substitute:** Söhne, Inter Tight, or Neue Haas Grotesk
- **Weights:** 400, 600, 700
- **Sizes:** 12, 14, 16, 18px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.025em to -0.004em
- **OpenType features:** `"case", "ss02" 0, "ss03", "ss06", "ss07", "ss08", "ss09"`
- **Role:** All interface type — body, nav, buttons, headings, product names, prices, footer. The custom neo-grotesque carries the entire identity. Weight 600 for product names and section headers, 700 for the centered wordmark, 400 for everything else. The 'case' feature and full alternates set (ss03, ss06–ss09) are signature — they reshape the letterforms subtly to feel printed rather than rendered.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2, 1.5
- **Role:** Times — detected in extracted data but not described by AI

### Metropolis — Metropolis — detected in extracted data but not described by AI · `--font-metropolis`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.14
- **Letter spacing:** -0.004
- **Role:** Metropolis — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.01px | `--text-caption` |
| body-sm | 14px | 1.38 | -0.009px | `--text-body-sm` |
| body | 16px | 1.5 | -0.004px | `--text-body` |
| subheading | 18px | 1.2 | -0.025px | `--text-subheading` |

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
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 44 | 44px | `--spacing-44` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| inputs | 4px |
| buttons | 24px |

### Layout

- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 4px

## Components

### Announcement Bar
**Role:** Top-of-page shipping/promo banner

Solid black (#000000) background, white (#f6f4ee) text, centered. Compact line-height ~1.2 at 12–14px. Functions as a full-bleed inverse band — the only dark surface in the entire interface.

### Sticky Header
**Role:** Primary navigation bar

Bone cream (#f6f4ee) background, 16px horizontal padding, three-zone layout: left nav (SHOP, INFO, search icon), centered wordmark (BAGGU at 700 weight), right cart. All type at 14px weight 400 uppercase, black. No border, no shadow — sits directly on the cream canvas.

### Wordmark
**Role:** Brand identity in header

studioPro at 700 weight, uppercase, ~18px, letter-spacing -0.025em. Centered between nav zones. No logo mark — the word IS the mark.

### Editorial Triptych Hero
**Role:** Full-width hero banner

Three equal-width product photographs edge-to-edge with no gutters, filling the viewport height below the header. No overlay text, no gradient, no CTA — the imagery is the content. No border-radius on images.

### Section Header Bar
**Role:** Category page section divider

Two-element row: left-aligned section title in black at 18px weight 600 uppercase ('SHOP'), right-aligned label in Moss Signal green (#298018) at 18px weight 600 ('NEW ARRIVALS'). No background, no border — type sits directly on the cream surface.

### Product Grid Card
**Role:** Individual product in 5-up grid

Image-first card with zero padding and no background distinction from the page. Product image fills the cell square-cropped. Below: product name at 14px weight 400 black, price at 14px weight 400 black, variant count (e.g. '+ 4 MORE') in Warm Ash (#7b7a77). No border, no shadow, no radius.

### Category Tile
**Role:** Browse-by-category grid cell

Tall product image with category label centered below at 14px weight 600 uppercase black ('PURSES', 'RECYCLED LEATHER', 'BAG ACCESSORIES'). 5-up grid, equal aspect ratios, no gutters between tiles.

### Pill Button
**Role:** Primary action button

Border-radius 24px (pill shape). Padding 16px horizontal × 4px vertical. Background transparent or bone cream, border 1px black (#000000), text at 14px weight 600 uppercase black. No fill state — outlined only.

### Ghost Text Link
**Role:** Inline navigational link

Underlined at all times, black (#000000) text at 14px weight 400. Letter-spacing -0.009em. No color change on hover — the underline thickens or the color inverts to cream on a black fill.

### Footer
**Role:** Bottom-of-page navigation and legal

Bone cream background, black text, multi-column link lists at 14px weight 400. Hairline 1px black border-top separating it from the page body. No colored accents, no social icons in color.

## Do's and Don'ts

### Do
- Use #f6f4ee for every background — never pure #ffffff, the warmth is the signature
- Set type in studioPro (or Söhne/Inter Tight) at 12–18px only — this system has no display sizes, headlines live in the imagery
- Apply font-feature-settings: 'case', 'ss02' 0, 'ss03', 'ss06', 'ss07', 'ss08', 'ss09' to all studioPro instances
- Reserve #298018 exclusively for the 'New Arrivals' label and success badges — one color, one job
- Use 24px border-radius on every button, 4px on inputs, and zero radius on all images and cards
- Let product photography bleed edge-to-edge with no gutters in hero and grid contexts — the cream canvas is the only breathing room
- Draw all borders and icons in pure #000000 at 1px — never gray, never softened

### Don't
- Don't introduce additional brand colors, accent hues, or gradients — the palette is three neutrals and one green
- Don't use type larger than 18px — there are no display sizes in this system, visual weight comes from the wordmark at 700 and product imagery
- Don't add box-shadows, drop shadows, or elevated card surfaces — the cream canvas IS the elevation system
- Don't use #ffffff anywhere — it breaks the warm printed-paper illusion
- Don't round product images or add inner card backgrounds — tiles sit flush on the cream surface
- Don't apply the green (#298018) to CTAs, buttons, or decorative elements — it is metadata only
- Don't use letter-spacing above 0 or below -0.025em — tracking stays tight to feel printed

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#f6f4ee` | Full-page background — the single warm surface everything sits on |
| 2 | Product Stage | `#f6f4ee` | Inset product image background within grid cards (visually identical to canvas, no card surface distinction) |

## Elevation

There are no shadows in this system. Elevation is communicated entirely through scale: the announcement bar inverts to black, the header sits on the cream canvas with no border, and product cards have zero background distinction from the page. Visual hierarchy is built with type weight (400 vs 600 vs 700) and the single color inversion, never with depth.

## Imagery

Photography is the entire visual language. Product shots are full-bleed, studio-lit against a neutral light gray or white seamless backdrop, with models shown mid-gesture (hands holding bags, legs mid-stride) rather than full-body portraits. Treatment is editorial-magazine: tight crops, no lifestyle context, no props, no location. Colors in imagery are vibrant and varied (striped pinks, cherry prints, orange citrus charms) but the UI around them stays achromatic. No illustrations, no icons in the interface (only a search magnifier and a accessibility circle), no decorative graphics — the photographs do all the emotional work.

## Layout

Full-bleed page model with no max-width container — the cream canvas extends to the viewport edges. Header is a fixed three-zone row (nav | wordmark | cart) with 16px horizontal padding. The hero is a full-viewport-height triptych of edge-to-edge product images with no gutters. Below the hero, a two-element section header row sits directly on the cream surface (black left, green right). Product grids are 5-up with zero gap and equal-aspect cells. Category tiles follow the same 5-up flush grid with centered uppercase labels. Bottom editorial section returns to full-bleed photography. Vertical rhythm is set by 64px section gaps; the cream surface itself is the only breathing room. Navigation is minimal top-bar only — no sidebar, no mega-menu, no sticky secondary nav.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f6f4ee
- border: #000000 (1px)
- muted text: #7b7a77
- accent: #298018 (only for 'New Arrivals' label and success states)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. **Product Grid Card**: Flush 5-up grid cell, no padding, no background. Product image fills the cell square-cropped edge-to-edge. Below image: product name in studioPro 14px weight 400 #000000, price in studioPro 14px weight 400 #000000, variant count in studioPro 14px weight 400 #7b7a77 (e.g. '+ 4 MORE'). No border, no radius, no shadow.

2. **Sticky Header**: Full-width row, 16px horizontal padding, bone cream #f6f4ee background. Left: 'SHOP' and 'INFO' in studioPro 14px weight 400 uppercase #000000, followed by a search magnifier icon in #000000. Center: 'BAGGU' wordmark in studioPro 18px weight 700 uppercase #000000, letter-spacing -0.025em. Right: 'CART (0)' in studioPro 14px weight 400 uppercase #000000. No border, no shadow.

3. **Section Header Bar**: Full-width row with no background, 16px vertical padding. Left: section title in studioPro 18px weight 600 uppercase #000000 (e.g. 'SHOP'). Right: label in studioPro 18px weight 600 uppercase #298018 (e.g. 'NEW ARRIVALS').

4. **Pill Button**: 24px border-radius, 16px horizontal × 4px vertical padding, transparent fill, 1px solid #000000 border, text in studioPro 14px weight 600 uppercase #000000. No hover fill, no shadow.

5. **Category Tile**: Full-bleed product image filling the cell with no radius, category label centered below in studioPro 14px weight 600 uppercase #000000 (e.g. 'PURSES', 'BAG ACCESSORIES'). Part of a 5-up flush grid with zero gap.

## Similar Brands

- **Aesop** — Same editorial restraint — warm off-white canvas, true black type, product photography that dominates the viewport, and an almost entirely achromatic palette
- **Muji** — Same compact neo-grotesque type at small sizes, hairline borders, and a no-nonsense product-grid-first layout with zero decorative chrome
- **Toteme** — Same warm cream background, uppercase tracked-tight type, and editorial triptych/full-bleed product photography approach
- **Cuyana** — Same minimal product-grid commerce pattern, neutral warm background, and type that stays small and functional rather than display-sized
- **Mansur Gavriel** — Same tight product card density, cream/white canvas, and monochromatic UI that lets the product color and print be the only visual excitement

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-cream: #f6f4ee;
  --color-true-black: #000000;
  --color-warm-ash: #7b7a77;
  --color-moss-signal: #298018;

  /* Typography — Font Families */
  --font-studiopro: 'studioPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-metropolis: 'Metropolis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --tracking-body-sm: -0.009px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.004px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.025px;

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
  --spacing-36: 36px;
  --spacing-44: 44px;
  --spacing-64: 64px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-inputs: 4px;
  --radius-buttons: 24px;

  /* Surfaces */
  --surface-bone-canvas: #f6f4ee;
  --surface-product-stage: #f6f4ee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-cream: #f6f4ee;
  --color-true-black: #000000;
  --color-warm-ash: #7b7a77;
  --color-moss-signal: #298018;

  /* Typography */
  --font-studiopro: 'studioPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-metropolis: 'Metropolis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --tracking-body-sm: -0.009px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.004px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.025px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-44: 44px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-3xl: 24px;
}
```
