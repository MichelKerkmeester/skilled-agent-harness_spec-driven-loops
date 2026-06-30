# Anobel — Style Reference
> Dutch maritime supply, Swiss graphic restraint — near-black Ink on a Snow canvas, with Azure and Crimson 2 as the only chromatic signals.

**Theme:** light

Anobel operates as a near-monochrome system with two signal colours breaking an otherwise achromatic field. The canvas is Snow, against which Ink text sits at 19.6:1 contrast. Silka Webfont carries the page — weight 600 for all headlines, weight 400 for body — one family across every element. Azure anchors links, borders, and primary CTAs, while Crimson 2 is rationed strictly to one destructive button variant and sparse decorative overlays. The system is entirely flat: zero shadow tokens — depth is communicated through border contrast and whitespace alone. Sections are full-bleed with fluid clamp-based spacing, and the page maxes at 100%.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#0a0a0a` | `--color-ink` | borders, text, backgrounds — a near-black |
| Azure | `#06458c` | `--color-azure` | borders, text, backgrounds — a blue |
| Snow | `#fefefe` | `--color-snow` | borders, text, backgrounds — a near-white |
| Crimson | `#b4120e` | `--color-crimson` | borders, text — a red |
| Mist | `#cfcfcf` | `--color-mist` | borders, backgrounds — a pale gray |
| Linen | `#e2e2e2` | `--color-linen` | borders, backgrounds — a soft off-white |
| Crimson 2 | `#fd4f19` | `--color-crimson-2` | borders, backgrounds, icons — a red |
| Ink 2 | `#000000` | `--color-ink-2` | borders, text — a near-black |
| Deep Azure | `#031d3c` | `--color-deep-azure` | borders, gradients — a deep blue |
| Deep Azure 2 | `#043367` | `--color-deep-azure-2` | backgrounds, gradients — a deep blue |
| Azure 2 | `#8591b3` | `--color-azure-2` | borders — a blue |

### Current Campaign Colors (Subject to change)

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sage | `#4bae4f` | `--color-sage` | backgrounds — a green-gray |
| Light Sage | `#e6f4e5` | `--color-light-sage` | backgrounds — a light green-gray |
| Crimson 3 | `#bb3a12` | `--color-crimson-3` | borders — a red |

## Tokens — Typography

### Silka Webfont — Primary brand typeface, geometric sans-serif. Weight 600 for headlines, weight 400 for body, weight 500 for tight labels. Loaded only from Webflow CDN. · `--font-silka`
- **Substitute:** Inter, system sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px, 21px, 49px, 63px, 112px
- **Line height:** normal, 16px, 23.2px, 25.2px, 25.375px, 58.8px, 75.6px, 112px
- **Letter spacing:** normal (all levels)
- **Role:** Sole font for all UI, headlines, body, navigation, and buttons. No secondary font in practice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | normal | normal | `--text-caption` |
| body-sm | 14px | 23.2px | normal | `--text-body-sm` |
| body | 16px | 23.2px | normal | `--text-body` |
| body-bold | 16px | 23.2px | normal | `--text-body-bold` |
| body-lg | 18px | 25.375px | normal | `--text-body-lg` |
| label | 18px | 23.2px | normal | `--text-label` |
| label-sm | 18px | 16px | normal | `--text-label-sm` |
| subheading | 21px | 25.2px | normal | `--text-subheading` |
| heading | 49px | 58.8px | normal | `--text-heading` |
| display | 63px | 75.6px | normal | `--text-display` |
| hero | 112px | 112px | normal | `--text-hero` |

The hero size (112px / 600 weight) was measured once on the ISPS page and is campaign-layer, not part of the stable type scale. The label-sm level (18px / 16px line-height / 500 weight) appears only as product category tags in tight containers.

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 28 | 28px | `--spacing-28` |
| 56 | 56px | `--spacing-56` |
| 72 | 72px | `--spacing-72` |
| 92 | 92px | `--spacing-92` |

### Border Radius

| Element | Value |
|---------|-------|
| button | 7px |
| img | 10.5px |
| div | 14px |
| div | 100% |
| div | 0px 0px 14px 14px |
| div | 14px 14px 0px 0px |
| div | 3.5px |
| div | 50% |
| img | 14px 0px 0px 14px |
| div | 225px 0px 0px 14px |
| div | 0px 0px 0px 17.5px |

### Layout
- **Page max-width:** 100%

## Components

### Primary CTA
**Role:** Primary call-to-action — Azure fill with Snow text, used for cookie acceptance and main CTAs.

Background `#06458c`, text `#fefefe`, Silka Webfont 600 at 17.5px, border-radius 7px, horizontal padding 17.5px. No border. Hover: border shifts to `#06458c`. Transition: color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out. Focus-visible: outline `#cfcfcf` solid 0px (no visible ring).

### Secondary Button
**Role:** Cookie consent and secondary CTAs — Snow fill with Ink text and a Mist border.

Background `#fefefe`, text `#0a0a0a`, Silka Webfont 600 at 17.5px, border-radius 7px, horizontal padding 17.5px, 1px solid `#cfcfcf` border. Hover: border shifts to `#06458c`. Transition: color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out. Focus-visible: outline `#cfcfcf` solid 0px.

### Ghost Button
**Role:** Navigation action on dark sections — transparent fill with Snow text.

Background transparent, text `#fefefe`, Silka Webfont 600 at 15.75px, border-radius 7px, horizontal padding 14px, 1px solid transparent border. Hover: border shifts to `#06458c`. Transition: color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out. Focus-visible: outline `#cfcfcf` solid 0px.

### Destructive Button
**Role:** Crimson 2 action — used once for the webshop CTA on the bunkering page.

Background `#fd4f19`, text `#fefefe`, Silka Webfont 400 at 16px, border-radius 10.5px, 17.5px padding all sides, 1px solid `#bb3a12` border. Transition: color 0.2s ease-out. Focus-visible: outline `#cfcfcf` solid 0px. Fails AA contrast — white-on-orange at 3.3:1. Do not replicate.

### Ghost Link
**Role:** Inline text link — Azure text with Deep Azure hover, the only component with a visible focus ring.

Background transparent, text `#06458c`, Silka Webfont 400 at 15.75px, border-radius 0px, 0px padding. Hover: text shifts to `#031d3c`. Focus-visible: outline `#cfcfcf` solid 4px — the only component in the system with a visible focus ring. Transition: color 0.2s ease-out.

### Nav Item
**Role:** Top navigation and footer links — Ink text on transparent fill.

Background transparent, text `#0a0a0a`, Silka Webfont 400 at 16px, border-radius 0px, 0px padding. Transition: all. No hover or focus states captured.

### Card
**Role:** Contact and info cards — warm off-white with Azure text and a barely-perceptible border.

Background `#f8f8f8`, text `#06458c`, Silka Webfont 400 at 16px, border-radius 14px, 28px padding all sides, 1px solid `#f4f4f4` border. Transition: all. No shadow.

### Badge — Primary
**Role:** Success/status indicator — Sage pill.

Background `#4bae4f`, text `#0a0a0a`, Silka Webfont 600 at 15.75px, border-radius 100% (pill), 0px padding. Transition: all.

### Badge — Light
**Role:** Lighter success badge variant — Light Sage pill with slower transition.

Background `#e6f4e5`, text `#0a0a0a`, Silka Webfont 600 at 15.75px, border-radius 100% (pill), 0px padding. Transition: background-color 0.3s.

## Do's and Don'ts

### Do
- Use `#fefefe` as the page background canvas — cards sit on it with `#f8f8f8` fill and a `#f4f4f4` border.
- Use `#0a0a0a` for all body text — contrast ratio 19.63:1 against Snow.
- Use `#06458c` for links, primary CTA fills, and brand border accents.
- Use `#cfcfcf` as the default border colour for secondary buttons and dividers.
- Use `#031d3c` for link hover darkening and brand-dark accents.
- Use `#e2e2e2` for light borders and subtle surface separations.
- Rely on border contrast (`#0a0a0a` / `#cfcfcf` / `#e2e2e2`) and generous whitespace to communicate hierarchy — there are no shadows.

### Don't
- Do not add `box-shadow` — there are zero shadow tokens; any shadow is an invention.
- Do not use `#fd4f19` as a primary CTA or on a light background as text — it fails AA and is measured only as a single button fill on one page.
- Do not place `#fefefe` text on `#fd4f19` background — contrast ratio is 3.3:1, failing AA.
- Do not place `#06458c` text on a transparent background expecting readable contrast — measured at 2.24:1 against transparency.
- Do not rely on focus indicators for keyboard navigation — focus-visible renders a 0px solid outline on every component except ghost links (4px ring). Focus is captured but inconsistent.
- Do not use gradients to simulate depth — gradients in this system are decorative surface washes, not a z-axis layering tool.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fefefe` | Full-bleed page background |
| 1 | Light Sage | `#e6f4e5` | Surface / panel |
| 2 | Linen | `#e2e2e2` | Surface / panel |
| 3 | Mist | `#cfcfcf` | Surface / panel |

## Elevation

This is a flat system — zero shadow tokens. Depth is communicated through border contrast: heavy Ink borders (`#0a0a0a`) vs hairline Mist dividers (`#cfcfcf`), and generous whitespace. Gradient overlays at measured opacities (55–80%) add tonal depth to dark sections without simulating z-axis layering. Six gradient tokens exist — all decorative surface treatments, never a depth system.

## Imagery

No structural imagery data was extracted beyond alt-text statistics (66 images, 23% with alt text). Gradient overlays are the dominant visual treatment: a Deep Azure-to-transparent linear gradient at 270deg on cards, Azure fills at 80% opacity, and Crimson 2 fills at 55% opacity as decorative section washes. Images carry a 10.5px border radius or asymmetric corner radii (14px top-left, 0px elsewhere).

## Layout

Full-width fluid layout with 100% page max-width and fluid clamp-based spacing. Section spacing ranges from `clamp(4rem,7.5vh,6rem)` for small gaps through `clamp(7.5rem,15vh,12.5rem)` for large breaks, up to `clamp(12.5rem,25vh,17.5rem)` for extra-large section gaps. Breakpoints fire at max-width 991px (tablet), 767px (mobile landscape), and 479px (mobile). Desktop page padding is 5vw, tablet 4rem, mobile 2rem. Column grids range from single to six columns. Content alignment is full-width. The navigation bar sits at z-index 996, cookie banner at 997, modals at 998–999.

## Agent Prompt Guide

### Quick Color Reference
- background: `#fefefe` (Snow)
- text (primary): `#0a0a0a` (Ink)
- border (default): `#cfcfcf` (Mist)
- accent / primary action: `#06458c` (Azure)
- signal accent: `#fd4f19` (Crimson 2) — ration as destructive only

### Example Component Prompts

1. Create a primary CTA button: Background `#06458c`, text `#fefefe`, Silka Webfont 600 at 17.5px, border-radius 7px, horizontal padding 17.5px. Transition color/background-color/border-color 0.2s ease-out. On hover, add a `#06458c` border.

2. Create a secondary outline button: Background `#fefefe`, text `#0a0a0a`, 1px solid `#cfcfcf` border, Silka Webfont 600 at 17.5px, border-radius 7px, horizontal padding 17.5px. On hover, border shifts to `#06458c`.

3. Create a ghost navigation button for dark sections: Background transparent, text `#fefefe`, Silka Webfont 600 at 15.75px, border-radius 7px, horizontal padding 14px, 1px solid transparent border. On hover, border becomes `#06458c`.

4. Create a text link: Color `#06458c`, Silka Webfont 400 at 15.75px, transition color 0.2s ease-out. On hover, color shifts to `#031d3c`. On focus-visible, add outline `#cfcfcf` solid 4px.

5. Create a card: Background `#f8f8f8`, text `#06458c` at 16px Silka Webfont 400, border-radius 14px, padding 28px, 1px solid `#f4f4f4` border. No shadow.

## Similar Brands

- **Stripe** — Same Swiss-precise near-black-on-white contrast, single-blue accent, geometric sans-serif discipline.
- **Linear** — Same flat elevation system on off-white, restrained blue-brand palette, geometric sans-serif across every surface.
- **Vercel** — Geometric display type at large sizes, flat/no-shadow, single accent colour on white canvas.
- **Mercury** — Restrained near-monochrome palette with one brand colour on paper-like backgrounds.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #0a0a0a;
  --color-azure: #06458c;
  --color-snow: #fefefe;
  --color-crimson: #b4120e;
  --color-mist: #cfcfcf;
  --color-linen: #e2e2e2;
  --color-crimson-2: #fd4f19;
  --color-ink-2: #000000;
  --color-deep-azure: #031d3c;
  --color-deep-azure-2: #043367;
  --color-azure-2: #8591b3;
  /* Typography — Scale */
  --text-t0: 14px;
  --leading-t0: normal;
  --text-t1: 14px;
  --leading-t1: 23.2px;
  --text-t2: 16px;
  --leading-t2: 23.2px;
  --text-t3: 16px;
  --leading-t3: 23.2px;
  --text-t4: 18px;
  --leading-t4: 25.375px;
  --text-t5: 18px;
  --leading-t5: 23.2px;
  --text-t6: 18px;
  --leading-t6: 16px;
  --text-t7: 21px;
  --leading-t7: 25.2px;
  --text-h2: 49px;
  --leading-h2: 58.8px;
  --text-t9: 63px;
  --leading-t9: 75.6px;
  --text-t10: 112px;
  --leading-t10: 112px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-28: 28px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-92: 92px;
  /* Layout */
  --page-max-width: 100%;
  /* Border Radius */
  --radius-button: 7px;
  --radius-img: 10.5px;
  --radius-div: 14px;
  --radius-div: 100%;
  --radius-div: 0px 0px 14px 14px;
  --radius-div: 14px 14px 0px 0px;
  --radius-div: 3.5px;
  --radius-div: 50%;
  --radius-img: 14px 0px 0px 14px;
  --radius-div: 225px 0px 0px 14px;
  --radius-div: 0px 0px 0px 17.5px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #0a0a0a;
  --color-azure: #06458c;
  --color-snow: #fefefe;
  --color-crimson: #b4120e;
  --color-mist: #cfcfcf;
  --color-linen: #e2e2e2;
  --color-crimson-2: #fd4f19;
  --color-ink-2: #000000;
  --color-deep-azure: #031d3c;
  --color-deep-azure-2: #043367;
  --color-azure-2: #8591b3;
  /* Typography — Scale */
  --text-t0: 14px;
  --leading-t0: normal;
  --text-t1: 14px;
  --leading-t1: 23.2px;
  --text-t2: 16px;
  --leading-t2: 23.2px;
  --text-t3: 16px;
  --leading-t3: 23.2px;
  --text-t4: 18px;
  --leading-t4: 25.375px;
  --text-t5: 18px;
  --leading-t5: 23.2px;
  --text-t6: 18px;
  --leading-t6: 16px;
  --text-t7: 21px;
  --leading-t7: 25.2px;
  --text-h2: 49px;
  --leading-h2: 58.8px;
  --text-t9: 63px;
  --leading-t9: 75.6px;
  --text-t10: 112px;
  --leading-t10: 112px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-28: 28px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-92: 92px;
  /* Border Radius */
  --radius-button: 7px;
  --radius-img: 10.5px;
  --radius-div: 14px;
  --radius-div: 100%;
  --radius-div: 0px 0px 14px 14px;
  --radius-div: 14px 14px 0px 0px;
  --radius-div: 3.5px;
  --radius-div: 50%;
  --radius-img: 14px 0px 0px 14px;
  --radius-div: 225px 0px 0px 14px;
  --radius-div: 0px 0px 0px 17.5px;
}
```
