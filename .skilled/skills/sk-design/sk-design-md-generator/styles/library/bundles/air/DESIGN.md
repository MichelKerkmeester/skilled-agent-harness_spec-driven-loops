# Air — Style Reference
> midnight sky through glass sculpture

**Theme:** dark

Air uses a dark, atmospheric canvas with full-bleed cloud photography and sculptural glass-like 3D forms as its primary visual mode. The type system is the brand: a single sans-serif at moderate weights carries everything from nav to body, while compressed and cursive display cuts break in for emphasis — one italic word ("AI") in cursive sets a confident, slightly playful tone against the otherwise restrained UI. Components are lightweight — minimal elevation, thin borders, small radii, and near-transparent surfaces — letting the imagery carry emotion while the interface stays functional and fast.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Whiteout | `#ffffff` | `--color-whiteout` | Primary text on dark surfaces, nav button borders, hairline strokes, card surfaces over photographic backgrounds |
| Haze | `#f5f5f5` | `--color-haze` | Card surfaces, input fields, subtle button fills on dark backgrounds — the off-white layer that sits above the dark canvas |
| Ink | `#1b1b1b` | `--color-ink` | Body and heading text on light surfaces, button borders on light cards |
| Black Void | `#000000` | `--color-black-void` | Navigation borders, link underlines, deepest contrast layer on white surfaces |
| Twilight Blue | `#426188` | `--color-twilight-blue` | Heading text on dark backgrounds — the only chromatic text color, a desaturated steel blue that reads as cool and atmospheric rather than vivid |
| Signal Blue | `#2b7fff` | `--color-signal-blue` | Blue text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |

## Tokens — Typography

### Control — Primary interface typeface — carries everything from navigation labels to body text to button text at a consistent medium weight, creating visual quietness · `--font-control`
- **Substitute:** Inter, system-ui
- **Weights:** 500 (body, nav, buttons, links) + 400 (long-form body)
- **Sizes:** 12px, 13px, 14px, 16px, 20px
- **Line height:** 1.10 (display-adjacent) / 1.40 / 1.50 (body)
- **Role:** Primary interface typeface — carries everything from navigation labels to body text to button text at a consistent medium weight, creating visual quietness

### Control Compressed — Ultra-large display headlines (e.g. "MAKE IT ONCE.") — extreme weight and tight leading create poster-scale impact, always uppercase, always dominant · `--font-control-compressed`
- **Substitute:** Anton, Druk Wide
- **Weights:** 900
- **Sizes:** 259px
- **Line height:** 0.85
- **Role:** Ultra-large display headlines (e.g. "MAKE IT ONCE.") — extreme weight and tight leading create poster-scale impact, always uppercase, always dominant

### Control Cursive — Italic accent for emphasis within headlines — used for words like "AI" or "real" to add personality against the geometric sans body · `--font-control-cursive`
- **Substitute:** Caveat, Reenie Beanie
- **Weights:** 400, 500
- **Sizes:** 20px, 32px, 56px
- **Line height:** 1.00, 1.10, 1.50
- **Role:** Italic accent for emphasis within headlines — used for words like "AI" or "real" to add personality against the geometric sans body

### Control TNT — Alternative display variant for headlines — same scale as cursive but upright, used for taglines and feature headlines · `--font-control-tnt`
- **Substitute:** Inter, sans-serif
- **Weights:** 400, 500
- **Sizes:** 20px, 32px, 56px
- **Line height:** 1.00, 1.10, 1.50
- **Role:** Alternative display variant for headlines — same scale as cursive but upright, used for taglines and feature headlines

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading | 32px | 1.1 | — | `--text-heading` |
| heading-lg | 56px | 1 | — | `--text-heading-lg` |
| display | 259px | 0.85 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| images | 11px |
| inputs | 4px |
| buttons | 8px |

### Layout

- **Page max-width:** 1150px
- **Section gap:** 48px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Ghost Navigation Button
**Role:** Primary nav CTA — transparent fill on dark canvas

Transparent background, 1px white border, white text, 8px radius, 10px 16px padding. Used for "Start for free" and "Book a demo" in the nav bar.

### Solid Light Button
**Role:** Secondary action on light cards

#f5f5f5 background, #1b1b1b text, 1px #1b1b1b border, 8px radius, 8px 16px padding. Used on the photo upload card area.

### Pill Toggle Button
**Role:** Segmented control or filter chip

Fully rounded (16777220px ≈ pill), semi-transparent dark background (oklab 10% black), black text. Used for feature toggles and category filters.

### Underline Link
**Role:** Inline text link

Transparent background, 2px bottom underline, text in Signal Blue (#2b7fff) or Ink (#1b1b1b), 8px horizontal padding. Underline is the primary affordance — no color fill.

### Haze Card
**Role:** Content card on dark background

#f5f5f5 background, 12px radius, 20px padding, no shadow, no border. Sits as a light island on the dark photographic canvas.

### Image Card with Radius
**Role:** Media container for photo grids

Transparent background, 11px or 14px radius, no padding, no shadow. Holds product imagery and screenshot grids.

### Text Input
**Role:** Form field

#f5f5f5 background, #1b1b1b text, 1px border at rgba(0,0,0,0.1), 4px radius, 10px padding all sides. Minimal chrome — relies on background contrast rather than border weight.

### Logo Bar Row
**Role:** Client/partner logo grid

Single-row or two-row grid of monochrome logos on the dark canvas, 32px column gap, 48px row gap. Logos rendered in white or semi-transparent white.

### Full-Bleed Photographic Section
**Role:** Hero and atmospheric sections

Full-viewport-height sections with photographic background (clouds, glass sculpture), centered headline overlay in Whiteout or Twilight Blue, no border, no container constraint. Carries the brand's emotional weight.

### Compressed Display Headline
**Role:** Poster-scale statement

Control Compressed 900 weight at 259px, line-height 0.85, uppercase, Whiteout text. Bleeds to viewport edges. Used sparingly for maximum-impact statements.

### Dual-Style Headline
**Role:** Headline mixing upright and cursive

Combines Control Cursive italic (56px) for emphasized words with Control TNT upright for the rest. Creates typographic tension — the italic word carries personality while the upright stays grounded.

### Feature Section Header
**Role:** Section title block

Control 500 at 20px for subheading, Control Cursive or TNT at 32–56px for the main title. Center-aligned on dark background, generous 48px gap above and below.

## Do's and Don'ts

### Do
- Use Control at weight 500 for all body, nav, button, and link text — consistency of weight creates visual calm
- Set all buttons and interactive elements to 8px border-radius
- Apply 4px radius to form inputs only
- Use #f5f5f5 (Haze) for card surfaces and inputs on dark backgrounds
- Use #ffffff (Whiteout) for borders and text on dark surfaces
- Use #1b1b1b (Ink) for text and borders on light surfaces
- Break headlines with one italic word in Control Cursive against upright Control TNT or Control

### Don't
- Don't use solid filled colored buttons — buttons are ghost (transparent + border) or haze (light fill) only
- Don't apply shadows or elevation to cards — surfaces are flat with borders or background contrast only
- Don't use more than one saturated accent color per page — Signal Blue is for links only, not for buttons or backgrounds
- Don't set body text below 16px or above 500 weight — the type system is deliberately restrained
- Don't use rounded pill shapes for anything except toggle/filter controls
- Don't introduce new radii — stick to 4px (inputs), 8px (buttons), 11–14px (cards/images)
- Don't use gradients — the design relies on photography and flat color contrast for depth

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Dark Canvas | `#000000` | Base background behind photographic sections, footer, and dark UI moments |
| 1 | Haze Card | `#f5f5f5` | Light card surface sitting on top of dark photography — off-white card on dark sky |
| 2 | Whiteout | `#ffffff` | Pure white for inputs and elevated form surfaces |

## Elevation

No elevation. Surfaces distinguish themselves through background color and 1px borders, not shadows. Cards float on the dark canvas by virtue of being lighter, not by casting shadows.

## Imagery

Full-bleed photographic sections are the primary visual language — moody sky/cloud photography with sculptural translucent glass forms rendered in 3D. The imagery is atmospheric and slightly surreal, occupying the entire viewport with no container constraint. Product UI is shown via contained screenshots in light cards (Haze) that sit as islands on the dark photographic background. Logo bars are monochrome white on the dark canvas. The visual density is image-heavy at section-level but text-dominant in feature breakdowns.

## Layout

Full-bleed dark sections with photographic backgrounds alternate with centered content blocks. The page max-width is 1150px for text and card grids, but hero and atmospheric sections break to full viewport. Navigation is a minimal top bar (72px height) with left-aligned links and right-aligned actions. Feature sections follow a consistent pattern: centered headline + subtitle, then content arranged in 2-column or 3-column grids with 24px gutters. Display headlines (Control Compressed at 259px) bleed to viewport edges. Logo grids use a single horizontal row with generous spacing. Footer sits on the dark canvas with light text.

## Agent Prompt Guide

Quick Color Reference:
- text on dark: #ffffff (Whiteout)
- text on light: #1b1b1b (Ink)
- background canvas: #000000 (Black Void)
- card surface: #f5f5f5 (Haze)
- input surface: #f5f5f5 (Haze)
- link text: #2b7fff (Signal Blue)
- heading accent on dark: #426188 (Twilight Blue)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a ghost nav button: transparent background, 1px solid #ffffff border, #ffffff text, 8px radius, 10px vertical and 16px horizontal padding, Control font weight 500 at 14px.

2. Create a Haze card: #f5f5f5 background, 12px radius, 20px padding all sides, no shadow, no border. Place centered on a #000000 dark canvas.

3. Create a text input: #f5f5f5 background, 1px solid rgba(0,0,0,0.1) border, 4px radius, 10px padding all sides, #1b1b1b text, Control font weight 500 at 16px.

4. Create a compressed display headline: Control Compressed at 259px, weight 900, line-height 0.85, uppercase, #ffffff color, bleeding to viewport edges.

5. Create a dual-style headline: first line in Control TNT weight 500 at 56px, line-height 1.0, #ffffff. Second line with one word in Control Cursive weight 400 italic at 56px, remaining words upright. Both centered on dark canvas.

## Similar Brands

- **Linear** — Same dark-canvas aesthetic with minimal chrome, transparent ghost buttons, and type-driven hierarchy — both let typography carry the brand rather than color or illustration
- **Vercel** — Full-bleed dark sections with centered headlines, monochrome interface, and restrained accent color usage — both rely on photographic or gradient atmospheric backgrounds
- **Framer** — Bold display typography (compressed/condensed faces) over dark backgrounds with sparse UI chrome — both use poster-scale type as the hero moment
- **Pitch** — Dark-first product interface with ghost buttons, thin borders, flat card surfaces, and no shadows — components are distinguished by background contrast rather than elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-whiteout: #ffffff;
  --color-haze: #f5f5f5;
  --color-ink: #1b1b1b;
  --color-black-void: #000000;
  --color-twilight-blue: #426188;
  --color-signal-blue: #2b7fff;

  /* Typography — Font Families */
  --font-control: 'Control', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-control-compressed: 'Control Compressed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-control-cursive: 'Control Cursive', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-control-tnt: 'Control TNT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --text-display: 259px;
  --leading-display: 0.85;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1150px;
  --section-gap: 48px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-xl: 14px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-images: 11px;
  --radius-inputs: 4px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-dark-canvas: #000000;
  --surface-haze-card: #f5f5f5;
  --surface-whiteout: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-whiteout: #ffffff;
  --color-haze: #f5f5f5;
  --color-ink: #1b1b1b;
  --color-black-void: #000000;
  --color-twilight-blue: #426188;
  --color-signal-blue: #2b7fff;

  /* Typography */
  --font-control: 'Control', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-control-compressed: 'Control Compressed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-control-cursive: 'Control Cursive', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-control-tnt: 'Control TNT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --text-display: 259px;
  --leading-display: 0.85;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-xl: 14px;
}
```
