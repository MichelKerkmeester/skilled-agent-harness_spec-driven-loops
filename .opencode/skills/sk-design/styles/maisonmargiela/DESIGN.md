# Maisonmargiela — Style Reference
> Gallery wall with a whisper

**Theme:** light

Maison Margiela operates on a radical editorial restraint: the interface is nearly invisible so that photography and product carry the entire experience. The palette is 100% achromatic — no chromatic accent exists anywhere in the system — using a near-black ink (#121212) against warm off-whites (#f7f7f2, #eaeae6) and pure white (#ffffff) to evoke gallery walls and atelier surfaces. Typography is custom and whispered, never shouted: Margiela Sans at low weights with extreme letter-spacing on small uppercase labels, and Margiela Serif with hairline negative tracking for the wordmark and editorial captions. Surfaces are flat, shadowless, and borderless; hierarchy is created by typographic scale and whitespace, not chrome. Components feel like printed matter — announcement strips, centered nav, full-bleed image plates, and tiny ghost text-links — not software.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#121212` | `--color-ink` | Primary text, nav links, button labels, footer copy — the near-black (not pure) gives the page a slightly warmer, printed feel rather than a screen feel |
| Paper | `#ffffff` | `--color-paper` | Page canvas, input fills, button text on dark — the clean base against which warm off-white sections layer |
| Atelier White | `#f7f7f2` | `--color-atelier-white` | Light supporting surface for subtle backgrounds and section separation. |
| Linen | `#eaeae6` | `--color-linen` | Deeper warm neutral for tertiary sections, input borders, subtle dividers — sits one step below Atelier White in the surface stack |
| Stone | `#898989` | `--color-stone` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Graphite | `#484847` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Pebble | `#bababa` | `--color-pebble` | Input field borders, form field outlines, subtle structural dividers |
| Smoke | `#818181` | `--color-smoke` | Disabled button text and inactive state labels |
| Charcoal | `#333333` | `--color-charcoal` | Long-form body text in editorial blocks where the slightly lighter tone than Ink reduces visual weight over long reads |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills, logo lockup, strict black-tone elements where maximum contrast is required |

## Tokens — Typography

### Margiela Sans — All UI text, navigation, buttons, labels, captions. The custom sans is the structural voice of the system. Weights 375-500 handle body and nav; 600-700 appear in micro-labels at the upper edge. The extreme letter-spacing (0.067-0.125em) applied to the smaller sizes is a signature choice — uppercase micro-text at 8-12px breathes like engraved metalwork rather than digital UI. The narrow weight range (no display-weight condensation) means type never yells; hierarchy comes from tracking and size, not boldness. · `--font-margiela-sans`
- **Substitute:** Inter or Neue Haas Grotesk with letter-spacing adjusted per size
- **Weights:** 375, 400, 475, 500, 600, 700
- **Sizes:** 8, 10, 11, 12, 13, 14, 15, 16
- **Line height:** 1.00, 1.20, 1.40, 1.50, 1.60
- **Letter spacing:** 0.0070em, 0.0100em, 0.0670em, 0.0770em, 0.0910em, 0.1250em
- **Role:** All UI text, navigation, buttons, labels, captions. The custom sans is the structural voice of the system. Weights 375-500 handle body and nav; 600-700 appear in micro-labels at the upper edge. The extreme letter-spacing (0.067-0.125em) applied to the smaller sizes is a signature choice — uppercase micro-text at 8-12px breathes like engraved metalwork rather than digital UI. The narrow weight range (no display-weight condensation) means type never yells; hierarchy comes from tracking and size, not boldness.

### Margiela Serif — The wordmark 'Maison Margiela Paris', editorial pull-quotes, product name captions, and serif body in select sections. Single weight (400) only, with hairline negative tracking (-0.004 to -0.002em) that makes the serif feel drawn rather than typeset. It appears sparingly — when it does, it signals a shift from UI to editorial register. · `--font-margiela-serif`
- **Substitute:** Cormorant Garamond or Adobe Caslon Pro at weight 400 with negative tracking
- **Weights:** 400
- **Sizes:** 14, 18, 20
- **Line height:** 1.30, 1.40
- **Letter spacing:** -0.0040em, -0.0020em
- **Role:** The wordmark 'Maison Margiela Paris', editorial pull-quotes, product name captions, and serif body in select sections. Single weight (400) only, with hairline negative tracking (-0.004 to -0.002em) that makes the serif feel drawn rather than typeset. It appears sparingly — when it does, it signals a shift from UI to editorial register.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption-xs | 10px | 1.2 | 0.91px | `--text-caption-xs` |
| eyebrow | 12px | 1.4 | 0.8px | `--text-eyebrow` |
| serif-body | 14px | 1.4 | -0.06px | `--text-serif-body` |
| serif-heading-sm | 18px | 1.3 | -0.07px | `--text-serif-heading-sm` |
| serif-heading | 20px | 1.3 | -0.08px | `--text-serif-heading` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 156 | 156px | `--spacing-156` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| inputs | 9999px |
| buttons | 0px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 16-24px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Site-wide top strip

Full-bleed horizontal band, Atelier White (#f7f7f2) background, Ink (#121212) text. Content is a single line of Margiela Sans 12px, weight 400, letter-spacing 0.8px, centered or left-aligned with a close (×) icon flush right. Height ≈ 40px. No border, no shadow.

### Primary Navigation
**Role:** Main site navigation

White background, no border, no shadow. Three-zone layout: left cluster (category links), center (wordmark logo), right cluster (utility links + icons). Links are Margiela Sans 12-13px, weight 400, letter-spacing 0.8-0.85px, uppercase, Ink color with no underline. Vertical padding 16-20px. The wordmark is Margiela Serif 14-18px centered.

### Ghost Text Link
**Role:** Inline and standalone text action

Ink (#121212) Margiela Sans 12px, weight 500-600, letter-spacing 0.8px, uppercase. No background, no border, no underline at rest. Underline appears on hover, 1px from baseline. Padding 0. This is the primary CTA pattern — there is no filled button anywhere in the system.

### Hero Image Plate
**Role:** Full-bleed editorial hero

Full-viewport-width image with no border, no radius, no overlay. Caption block (product name in Margiela Serif 18-20px + ghost CTA 'DESCUBRA MÁS' in uppercase sans) sits bottom-center or bottom-left, white text on the image, 32-48px above bottom edge. Aspect ratio follows image source, not a fixed ratio.

### Pill Input Field
**Role:** Form input, search field

Fully rounded (9999px radius), 1px border in Pebble (#bababa) or Linen (#eaeae6), background Paper (#ffffff) or transparent. Text in Margiela Sans 13-14px Ink, placeholder in Stone (#898989). Padding 12px 20px. Focus state: border darkens to Ink (#121212), no glow ring.

### Tab Pair Link
**Role:** Binary navigation between paired destinations

Two ghost text links side by side, separated by 24-32px gap, same uppercase Margiela Sans 12px style. Example: MUJER / HOMBRE. Active state: Ink color and optional 1px underline; inactive: Stone (#898989). No background fill, no pill, no border.

### Utility Icon Button
**Role:** Search, account, wishlist, cart in nav

Icon-only, 16-20px SVG in Ink (#121212) or Pure Black (#000000), no background, no border, no padding beyond the icon hit area. Label appears as uppercase Margiela Sans 12px text to the left of icon for nav text-links; icons are naked in the right cluster.

### Editorial Caption Block
**Role:** Image caption / product name label

Centered or left-aligned text overlay on imagery. Product name in Margiela Serif 18-20px weight 400, letter-spacing -0.08px, white. Followed by ghost text CTA in Margiela Sans 12px uppercase, white, 16px below. No background, no backdrop blur.

### Product Tile (implied)
**Role:** Product listing cell

Square or portrait image flush to grid, no card chrome. Product name and price in Margiela Sans 13-14px, Ink, 12-16px below image, left-aligned. No border, no radius, no shadow. Grid cells butt directly against neighbors or sit on Linen background with 16-20px gutters.

### Section Divider (implicit)
**Role:** Vertical rhythm between editorial sections

No visible divider line. Sections are separated by 80-120px vertical whitespace and/or a surface color shift from Paper to Atelier White. The page reads as a continuous scroll, not a series of boxed blocks.

### Footer
**Role:** Site footer

Atelier White (#f7f7f2) or Paper background, flush to viewport edges. Columns of Margiela Sans 12-13px uppercase links in Ink, 24-32px between columns, 16px between links within a column. Wordmark repeated at top in Margiela Serif. No background blocks, no social icon backgrounds, no newsletter card.

## Do's and Don'ts

### Do
- Use Margiela Sans for all UI, navigation, buttons, labels, and captions — the system has no second sans family
- Apply uppercase + letter-spacing 0.067-0.125em to all text at 12px and below to create the engraved-label feel
- Build hierarchy through size, tracking, and weight — never through color, borders, or shadows, which are absent from the system
- Let full-bleed photography carry the visual weight; the UI must remain a thin whisper around it
- Use only ghost text-links as actions — there is no filled or outlined button variant in this system
- Reach for Margiela Serif 14-20px only at moments that demand an editorial register: the wordmark, product name captions, pull-quotes
- Use the three-surface stack (#ffffff → #f7f7f2 → #eaeae6) to create depth instead of shadows or borders

### Don't
- Do not introduce any chromatic color — the palette is 100% achromatic; adding accent hues breaks the gallery-wall discipline
- Do not use border-radius on any component other than pill inputs (9999px); cards, images, buttons, and tiles must have 0px radius
- Do not apply box-shadow to any element; depth comes from surface color and whitespace alone
- Do not create a filled or outlined button variant — all actions are ghost text-links in Ink
- Do not set body text below 13px or above 16px without moving to the Serif family; the sans scale is tightly bounded
- Do not use bold (weight 700) for long-form text; reserve heavier weights for short uppercase labels where tracking does the work
- Do not use pure #000000 for body text or links — Ink #121212 is the text color throughout; pure black is reserved for SVG icon fills

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page base, announcement bar, full-bleed image plates behind white-text overlays |
| 2 | Atelier White | `#f7f7f2` | Warm off-white for secondary sections, product detail backgrounds, cart drawer, editorial blocks |
| 3 | Linen | `#eaeae6` | Tertiary surface for nested elements, input fills, subtle banded sections |

## Elevation

Shadows are absent from this system. Depth and separation are achieved through surface color shifts (white → f7f7f2 → eaeae6) and the natural contrast of full-bleed photography. Components never float — they sit flush on the page like prints on paper.

## Imagery

Imagery is editorial fashion photography: full-bleed, no crops, no rounded corners, no frames. Subjects are products (a black patent Tabi pump on translucent vinyl) and models in conceptual styling (denim jacket against draped industrial sheeting) with desaturated, cool, slightly muted color grading. The photography carries slight coolness and grain that complements the warm off-white surfaces. Logos, badges, illustrations, and icons-only screens are absent — the system does not draw, it photographs. Image density is high in the hero, then gives way to near-text-only editorial sections.

## Layout

Full-bleed, edge-to-edge layout with no max-width container — photography and sections span the full viewport. The nav is a single horizontal row with a centered wordmark and flanking link clusters. Hero is a single full-viewport image plate with a small bottom caption block. Below the fold, sections alternate between full-bleed photography plates and narrow centered text blocks (Margiela Serif captions and ghost CTAs). No card grids, no multi-column product tables, no sidebar layouts — the page is a vertical scroll of image + caption + link, one section at a time. Vertical rhythm is generous (80-120px section gaps) to mimic a printed lookbook rather than a catalog.

## Agent Prompt Guide

Quick Color Reference:
- text: #121212 (Ink)
- background: #ffffff (Paper)
- secondary background: #f7f7f2 (Atelier White)
- border: #bababa (Pebble) or #eaeae6 (Linen)
- muted text: #898989 (Stone)
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a top navigation bar: white (#ffffff) background, no border, no shadow, vertical padding 18px. Three zones — left links (Mujer, Hombre, Unisex, Sobre nosotros, Residencias), center wordmark in Margiela Serif 18px, right links (Buscar, Cuenta, Lista de deseos, Cesta). All links in Margiela Sans 12px weight 400, letter-spacing 0.8px, uppercase, #121212. Hit area includes 12px horizontal padding around text.

2. Create a full-bleed hero image plate: viewport-width image with no border and no radius, aspect ratio determined by source. Bottom-center caption block, 48px above bottom edge: product name in Margiela Serif 20px #ffffff, letter-spacing -0.08px; below it 16px gap, a ghost text-link 'DESCUBRA MÁS' in Margiela Sans 12px weight 500, uppercase, #ffffff, letter-spacing 0.8px, with no background or border.

3. Create a tab pair: two ghost text-links 'MUJER' and 'HOMBRE' side by side, 24px gap, both in Margiela Sans 12px weight 600 uppercase, letter-spacing 0.8px. Active tab in #121212 with 1px underline; inactive tab in #898989 with no underline. No background fill, no border, no pill shape.

4. Create a pill search input: 9999px border-radius, 1px border in #bababa, background #ffffff, padding 12px 20px, Margiela Sans 14px #121212 text, placeholder in #898989. On focus, border becomes #121212; no box-shadow or glow ring.

5. Create a footer: background #f7f7f2, flush to viewport edges, no border, no shadow. Top row: Margiela Serif 18px wordmark centered. Below: 3-4 columns of Margiela Sans 12px weight 400 uppercase #121212 links, 24-32px between columns, 16px between rows. No newsletter card, no social icon backgrounds.

## Type Behavior Notes

The Margiela Sans letter-spacing pattern is size-dependent and inverts the usual web convention: smaller sizes get wider tracking, larger sizes get tighter (or normal) tracking. Micro text at 8px carries 0.125em (1px) tracking because at that size the letters would otherwise merge. Body text at 14px carries only 0.01em — a hair of breathing room. This means the system never looks 'stamped' at body sizes, but reads as engraved metalwork at caption sizes. The Serif runs the opposite direction with -0.002 to -0.004em, pulling the wordmark and editorial captions into a tight, drawn quality.

## Editorial Tone

The entire system is an exercise in restraint as luxury signal. There is no accent color, no gradient, no drop shadow, no rounded card, no filled button, no icon badge, no progress indicator chrome, no celebratory animation language. The interface earns trust by disappearing. Every page should feel like turning a page in a printed lookbook — generous whitespace, a single image or sentence, a whispered invitation to 'DESCUBRA MÁS' (discover more). An AI agent building new pages should resist the urge to add UI density; the system's confidence comes from how little it shows.

## Similar Brands

- **The Row** — Same editorial restraint — near-invisible UI, achromatic palette, uppercase tracked nav, full-bleed photography as the primary visual element
- **Aesop** — Custom serif wordmark, warm off-white surfaces, no chromatic accent, ghost text-link actions, and a literary tone that treats the page as editorial
- **Bottega Veneta** — Full-bleed high-fashion imagery, centered wordmark, uppercase tracked nav, warm neutral canvas — the same 'the product is the only color' philosophy
- **Jil Sander** — Achromatic palette, generous whitespace, sans-serif micro-labels, and the same reductive design discipline that strips UI to its essential surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #121212;
  --color-paper: #ffffff;
  --color-atelier-white: #f7f7f2;
  --color-linen: #eaeae6;
  --color-stone: #898989;
  --color-graphite: #484847;
  --color-pebble: #bababa;
  --color-smoke: #818181;
  --color-charcoal: #333333;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-margiela-sans: 'Margiela Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-margiela-serif: 'Margiela Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption-xs: 10px;
  --leading-caption-xs: 1.2;
  --tracking-caption-xs: 0.91px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 0.8px;
  --text-serif-body: 14px;
  --leading-serif-body: 1.4;
  --tracking-serif-body: -0.06px;
  --text-serif-heading-sm: 18px;
  --leading-serif-heading-sm: 1.3;
  --tracking-serif-heading-sm: -0.07px;
  --text-serif-heading: 20px;
  --leading-serif-heading: 1.3;
  --tracking-serif-heading: -0.08px;

  /* Typography — Weights */
  --font-weight-w375: 375;
  --font-weight-regular: 400;
  --font-weight-w475: 475;
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-156: 156px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 16-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 9999px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-atelier-white: #f7f7f2;
  --surface-linen: #eaeae6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #121212;
  --color-paper: #ffffff;
  --color-atelier-white: #f7f7f2;
  --color-linen: #eaeae6;
  --color-stone: #898989;
  --color-graphite: #484847;
  --color-pebble: #bababa;
  --color-smoke: #818181;
  --color-charcoal: #333333;
  --color-pure-black: #000000;

  /* Typography */
  --font-margiela-sans: 'Margiela Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-margiela-serif: 'Margiela Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption-xs: 10px;
  --leading-caption-xs: 1.2;
  --tracking-caption-xs: 0.91px;
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 0.8px;
  --text-serif-body: 14px;
  --leading-serif-body: 1.4;
  --tracking-serif-body: -0.06px;
  --text-serif-heading-sm: 18px;
  --leading-serif-heading-sm: 1.3;
  --tracking-serif-heading-sm: -0.07px;
  --text-serif-heading: 20px;
  --leading-serif-heading: 1.3;
  --tracking-serif-heading: -0.08px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-156: 156px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
