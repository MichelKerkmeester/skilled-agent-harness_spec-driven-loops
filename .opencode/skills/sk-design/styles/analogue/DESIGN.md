# Analogue — Style Reference
> Black gallery vitrine — products float in void

**Theme:** dark

Analogue presents as a black-box gallery: products float untethered against pure dark voids, lit like museum objects rather than marketed like commodities. The visual language is rigorously monochrome — black, white, and a single soft gray do all the work, with no chromatic accents competing for attention. Typography is a single custom family used at whisper-to-medium weights, carrying dramatic negative tracking that tightens aggressively as size increases. Components feel weighted and architectural: rounded card corners, generous breathing room, and the only 'action' surface is a clean white pill that reads as a beacon against the dark. Every screen should read as quiet and confident, letting the hardware itself be the spectacle.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Canvas | `#000000` | `--color-carbon-canvas` | Page backgrounds, section canvases, card surfaces in dark sections |
| Bone White | `#ffffff` | `--color-bone-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Ash Veil | `#e5e7eb` | `--color-ash-veil` | Subtle borders, hairline dividers, light-mode card surfaces, light section backgrounds |
| Smoke | `#bfbfbf` | `--color-smoke` | Secondary text, muted captions, supporting metadata on dark surfaces |
| Iron Gray | `#999999` | `--color-iron-gray` | Tertiary text, placeholders, disabled state text, publication/attribution labels |

## Tokens — Typography

### circularXx — Single-family system used everywhere. Display sizes (47-53px) carry dramatic -3.18px to -2.35px tracking that compresses letterforms into near-monoline blocks; body sizes hold -0.32px to -0.26px tracking. The 450 weight is the signature — lighter than typical medium, thicker than regular — giving headlines a precise, engineered feel. Font feature 'ss08' is globally active. · `--font-circularxx`
- **Substitute:** Inter, General Sans, Satoshi
- **Weights:** 400, 450, 500
- **Sizes:** 13, 15, 16, 18, 19, 21, 26, 35, 47, 53
- **Line height:** 0.80, 1.00, 1.11, 1.14, 1.15, 1.20, 1.23, 1.50
- **Letter spacing:** -0.06em at 53px, -0.05em at 47px, -0.033em at 35px, -0.03em at 26px, -0.029em at 21px, -0.031em at 19px, -0.02em at 16px and below
- **OpenType features:** `"ss08" on`
- **Role:** Single-family system used everywhere. Display sizes (47-53px) carry dramatic -3.18px to -2.35px tracking that compresses letterforms into near-monoline blocks; body sizes hold -0.32px to -0.26px tracking. The 450 weight is the signature — lighter than typical medium, thicker than regular — giving headlines a precise, engineered feel. Font feature 'ss08' is globally active.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.26px | `--text-caption` |
| body-sm | 15px | 1.5 | -0.3px | `--text-body-sm` |
| subheading-lg | 19px | 1.2 | -0.59px | `--text-subheading-lg` |
| heading-sm | 21px | 1.15 | -0.61px | `--text-heading-sm` |
| heading | 26px | 1.14 | -0.78px | `--text-heading` |
| heading-lg | 35px | 1.11 | -1.16px | `--text-heading-lg` |
| display | 47px | 1 | -2.35px | `--text-display` |
| display-lg | 53px | 0.8 | -3.18px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 26 | 26px | `--spacing-26` |
| 29 | 29px | `--spacing-29` |
| 35 | 35px | `--spacing-35` |
| 41 | 41px | `--spacing-41` |
| 47 | 47px | `--spacing-47` |
| 103 | 103px | `--spacing-103` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 17.6px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 26px
- **Element gap:** 18px

## Components

### Primary Action Pill
**Role:** Single conversion surface — 'Available Now', 'Shop Now'

White filled pill, 9999px radius, 16px 32px padding, circularXx weight 500 at 15px in #000000. Sits as a beacon against the dark canvas. No border, no shadow — pure contrast is the affordance.

### Ghost Nav Link
**Role:** Primary navigation items in header

No background, no border. circularXx weight 400-450 at 15px in #ffffff, tracking -0.30px. Stack label (Store, Editions, Support) above link (Products, Developer, Announcements) with 2-3px row gap, creating a compact two-line nav cell.

### Brand Mark
**Role:** Logo placement in top-left

Abstract 'A' glyph in #ffffff on dark canvas, approximately 30px square. No wordmark adjacent — symbol carries identity alone.

### Section Title Block
**Role:** Section header pairing product family with status word

Two stacked centered lines: top line circularXx weight 400 at 21px in #e5e7eb (e.g., 'Analogue Pocket'), bottom line circularXx weight 450 at 47-53px in #ffffff (e.g., 'Restock', 'Shipping Now'). Tracking on the large line is -2.35px to -3.18px. No other decoration.

### Product Hero Composition
**Role:** First-screen product showcase

Central product device (Analogue Pocket) at 60-70% viewport height, surrounded by 6-8 floating game cartridges in random rotation, each with subtle drop shadow. Pure #000000 background. No grid, no alignment — objects appear scattered in 3D space.

### Review Card
**Role:** Press quotes on dark sections

17.6px radius, 1px border in rgba(255,255,255,0.1) or #e5e7eb at low opacity, 26px internal padding. Layout: rating (35px weight 450 #ffffff) top-left, publication logo top-right, pull-quote (16px weight 400 #e5e7eb) middle, attribution (15px weight 400 #999999) bottom. Arranged in 4-column grid with 12-18px gaps.

### Product Showcase Card
**Role:** Light-section product display tiles

#ffffff surface on #e5e7eb background, 17.6px radius, 26px padding. Product photo centered, label below at 16px weight 400 in #000000. No shadow — flat against the gray field.

### Shipping Note
**Role:** Temporal metadata under action button

circularXx weight 400 at 15px in #999999, centered, single line. No icon, no decoration — typographic only.

### Social Icon Button
**Role:** Header social link (Instagram)

24px square white stroke icon, no background, no label. Sits far-right of nav.

## Do's and Don'ts

### Do
- Use only the five neutrals: #000000, #ffffff, #e5e7eb, #bfbfbf, #999999. No chromatic colors in the system.
- Apply circularXx at weight 450 for all display and heading sizes — this mid-weight is the signature, not 500 or 700.
- Tighten letter-spacing aggressively as size grows: -0.02em at 16px, scaling to -0.06em at 53px. Never use positive tracking.
- Use the single 17.6px radius for all cards and containers. Buttons and tags get 9999px for pill shape.
- Set section backgrounds to pure #000000; let product photography carry color and light, not the interface.
- Pair every section title with a two-line stack: small light-gray label above large white status word.
- Keep the single white pill button as the only filled action surface on dark sections — no secondary buttons compete.

### Don't
- Don't introduce any color outside the five neutrals — no blues, reds, greens, or accent hues.
- Don't use weights above 500 — headlines should feel precise and engineered, not bold or shouty.
- Don't apply box-shadows to cards on dark backgrounds — use 1px hairline borders in low-opacity white instead.
- Don't use positive letter-spacing or letter-spacing: normal anywhere in the system.
- Don't use corner radii other than 17.6px (cards) or 9999px (pills). No sharp 0px corners, no 8px defaults.
- Don't add gradients, glows, or color washes — the aesthetic depends on flat darkness and pure contrast.
- Don't use icons in colored fills — all icons are white strokes on dark, or black strokes on light.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Primary page canvas and section background |
| 2 | Light Section | `#e5e7eb` | Alternating light bands for product showcases on light backgrounds |
| 3 | Pure White | `#ffffff` | Card surfaces within light sections, pill button fills |

## Imagery

Product photography is the entire visual language. Devices and game cartridges are shot on pure black, floating in space with no surface or context — each object is isolated like a museum artifact. Cartridges appear in slight rotation and varied scale, scattered around a central hero device in a loose orbital composition. Lighting is studio-precise: hard key light reveals product texture, no environmental spill. No lifestyle photography, no human subjects, no backgrounds beyond pure void. The product IS the image; the page provides only darkness and typography.

## Layout

Full-bleed page model with no persistent sidebar. Navigation is a minimal top bar: brand mark far-left, three two-line nav groups center, social icon far-right — all on a single transparent row over the dark canvas. Hero is a full-viewport dark composition with centered product cluster and centered title block below. Sections alternate between full-bleed dark (#000000) and full-bleed light (#e5e7eb) bands with sharp edges, no gradients between. Light sections house product showcase grids (centered, max-width ~1200px). Dark sections house review card grids (4 columns, equal-width). Vertical rhythm is generous: ~80px between major sections, 26-29px internal padding. Content is always horizontally centered with auto margins — no asymmetric or left-aligned compositions.

## Agent Prompt Guide

## Quick Color Reference
- text: #ffffff (primary), #e5e7eb (secondary), #999999 (tertiary)
- background: #000000 (dark sections), #e5e7eb (light sections), #ffffff (cards on light)
- border: #e5e7eb at 10-20% opacity (dark mode), #bfbfbf (light mode)
- accent: none — monochrome only
- primary action: no distinct CTA color

## Example Component Prompts
1. **Section Title Block**: Two stacked centered lines on #000000. Line 1: circularXx weight 400, 21px, #e5e7eb, letter-spacing -0.61px. Line 2: circularXx weight 450, 53px, #ffffff, letter-spacing -3.18px, line-height 0.80. 12px vertical gap between lines.

2. **Available Now Pill Button**: White filled pill on #000000. 9999px border-radius. circularXx weight 500, 15px, #000000, letter-spacing -0.30px. Padding 16px vertical, 32px horizontal. No border, no shadow.

3. **Review Card**: 17.6px border-radius, 1px solid border in rgba(229,231,235,0.15), 26px padding on all sides, #000000 background. Rating at 35px circularXx weight 450 in #ffffff, letter-spacing -1.16px. Quote at 16px weight 400 in #e5e7eb. Attribution at 15px weight 400 in #999999.

4. **Ghost Nav Link Group**: No background. Two stacked lines with 3px row gap: category label (Store) in circularXx weight 400 at 15px #e5e7eb, sub-link (Products) in circularXx weight 450 at 15px #ffffff. Letter-spacing -0.30px both lines. 29px horizontal padding.

5. **Product Hero Background**: Full-viewport #000000 canvas. Single centered product image at 60% viewport height, surrounded by 6-8 smaller product images in random rotation (-20° to +20°), each with subtle drop-shadow (0 10px 30px rgba(0,0,0,0.5)). No grid alignment.

## Elevation Philosophy

Analogue deliberately avoids shadow-based elevation. Dark sections use 1px hairline borders in low-opacity white (rgba(229,231,235,0.1-0.2)) to delineate cards — borders carry separation, not depth. Light sections rely on the #e5e7eb-to-#ffffff surface step. The only shadows present are on product photography itself, where studio lighting creates natural depth on the objects, not on the UI containers. This creates a flat, architectural feel where the page is a stage and the products are sculptures lit within it.

## Similar Brands

- **Apple** — Same product-as-sculpt presentation on pure black canvases with centered white typography and dramatic negative tracking on display sizes
- **Teenage Engineering** — Same dark, design-forward hardware aesthetic with monochrome palettes and product photography floating without context
- **Leica** — Same premium dark product presentation — objects on void, gallery-style isolation, minimal UI chrome
- **Nothing** — Same restrained monochrome interface and dramatic floating product compositions on pure black
- **Bang & Olufsen** — Same luxury hardware treatment with dark product photography and tightly tracked sans-serif display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-canvas: #000000;
  --color-bone-white: #ffffff;
  --color-ash-veil: #e5e7eb;
  --color-smoke: #bfbfbf;
  --color-iron-gray: #999999;

  /* Typography — Font Families */
  --font-circularxx: 'circularXx', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.26px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.3px;
  --text-subheading-lg: 19px;
  --leading-subheading-lg: 1.2;
  --tracking-subheading-lg: -0.59px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.61px;
  --text-heading: 26px;
  --leading-heading: 1.14;
  --tracking-heading: -0.78px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.16px;
  --text-display: 47px;
  --leading-display: 1;
  --tracking-display: -2.35px;
  --text-display-lg: 53px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -3.18px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-26: 26px;
  --spacing-29: 29px;
  --spacing-35: 35px;
  --spacing-41: 41px;
  --spacing-47: 47px;
  --spacing-103: 103px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 26px;
  --element-gap: 18px;

  /* Border Radius */
  --radius-2xl: 17.6256px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 17.6px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-light-section: #e5e7eb;
  --surface-pure-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-canvas: #000000;
  --color-bone-white: #ffffff;
  --color-ash-veil: #e5e7eb;
  --color-smoke: #bfbfbf;
  --color-iron-gray: #999999;

  /* Typography */
  --font-circularxx: 'circularXx', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.26px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.3px;
  --text-subheading-lg: 19px;
  --leading-subheading-lg: 1.2;
  --tracking-subheading-lg: -0.59px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.61px;
  --text-heading: 26px;
  --leading-heading: 1.14;
  --tracking-heading: -0.78px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.16px;
  --text-display: 47px;
  --leading-display: 1;
  --tracking-display: -2.35px;
  --text-display-lg: 53px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -3.18px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-26: 26px;
  --spacing-29: 29px;
  --spacing-35: 35px;
  --spacing-41: 41px;
  --spacing-47: 47px;
  --spacing-103: 103px;

  /* Border Radius */
  --radius-2xl: 17.6256px;
}
```
