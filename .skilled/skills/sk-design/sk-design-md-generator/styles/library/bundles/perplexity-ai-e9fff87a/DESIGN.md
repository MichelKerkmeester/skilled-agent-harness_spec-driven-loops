# Perplexity AI — Style Reference
> Warm research terminal. A cream-toned search bar floats on aged-paper canvas, surrounded by quiet monochrome controls — the calm of a library reading desk distilled into a single input field.

**Theme:** light

Perplexity's interface operates like a quiet research terminal: a warm off-white canvas (#faf8f5) that reads more like aged paper than sterile app-white, a single monochrome typographic voice, and one restrained teal accent (#016a71) that appears only as functional punctuation. The entire visual system compresses to a search bar as the hero — every surrounding control (sidebar, top nav, model selector, voice button) is a subordinate satellite. Density is compact but not cramped: 8px is the workhorse gap, 12–16px the padding standard, with 9999px pill rounding on all interactive controls. There is almost no elevation — the design is deliberately flat, using a barely-there 1px border at #d1d1cd and a single whisper-soft shadow to separate the card layer from the canvas. Typography is custom (pplxSans) at exactly two weights (400, 500) and three sizes (12, 14, 16) — the scale is intentionally narrow, making the interface feel like a document rather than a dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aged Paper | `#faf8f5` | `--color-aged-paper` | Page canvas and card surfaces — warm off-white replaces sterile pure white, giving the interface a document-like, paper-textured quality |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, icon strokes, and the dominant fill across navigation and body copy |
| Charcoal | `#27251e` | `--color-charcoal` | Primary action button background and high-emphasis text — warm near-black that pairs with the cream canvas for a softer than pure-black contrast |
| Ash Gray | `#72706b` | `--color-ash-gray` | Secondary text, muted icons, and inactive nav fills — carries the warm tint of the palette |
| Stone | `#92918b` | `--color-stone` | Tertiary/placeholder text and low-emphasis labels |
| Pebble | `#d1d1cd` | `--color-pebble` | Hairline borders on cards and input containers — warm gray that recedes against the cream canvas |
| Deep Teal | `#016a71` | `--color-deep-teal` | Sole chromatic accent — active nav indicator and selected state fill, provides the only color punctuation in the interface |

## Tokens — Typography

### pplxSans — All interface text — the deliberately narrow scale (3 sizes, 2 weights) makes the system feel document-like. Weight 400 handles body, labels, and input text; weight 500 is reserved for active/selected states and emphasis. The custom typeface is geometric and humanist, tighter and more distinctive than a system sans like Inter. Normal letter-spacing throughout. · `--font-pplxsans`
- **Substitute:** Inter (system fallback) — closest in geometric proportions; alternatively DM Sans for similar warmth
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.25, 1.33, 1.43, 1.50, 2.00
- **Role:** All interface text — the deliberately narrow scale (3 sizes, 2 weights) makes the system feel document-like. Weight 400 handles body, labels, and input text; weight 500 is reserved for active/selected states and emphasis. The custom typeface is geometric and humanist, tighter and more distinctive than a system sans like Inter. Normal letter-spacing throughout.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.43 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 32 | 32px | `--spacing-32` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| input | 12px |
| buttons | 9999px |
| nav-items | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 640px
- **Section gap:** 32px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Search Input
**Role:** Central input field — the primary action surface of the product

Full-width within 640px max-width container. White (#ffffff) background with 1px border in #d1d1cd, 12px border-radius. 16px pplxSans weight 400 placeholder text in #92918b. 16px vertical padding. Contains an inline '+' icon, a 'Computer' mode toggle chip, a 'Model' dropdown, a microphone icon, and a dark submit button (#27251, 9999px radius, white up-arrow icon).

### Primary Submit Button
**Role:** Search submission — the only filled dark button in the interface

28×28px circle, #27251 background, 9999px radius, white (#ffffff) up-arrow icon at 14px. Sits inline at the right edge of the search input.

### Sidebar Nav Item
**Role:** Left rail navigation links

36px height, 8px horizontal padding, 9999px radius. pplxSans 14px weight 400 in #27251e. Active state: #e8e6e1 background fill. Leading icon 16px in #27251e. Full-width within 220px sidebar.

### Top Nav Link
**Role:** Horizontal category links in the header

Inline 14px pplxSans weight 400 in #27251e. No background by default. Active/category indicator uses #016a71 teal fill as an underline or pill background.

### Mode Toggle Chip
**Role:** Inline capability selector within the search input

Compact pill with 6px radius, 4px 8px padding, #faf8f5 background, 12px pplxSans weight 500 label in #27251, with a small icon prefix and '+' suffix for adding more modes.

### Status Card
**Role:** System/connection status notification below the search

Full-width 640px, #ffffff background, 16px radius, 1px #d1d1cd border, 12px padding. 14px pplxSans weight 500 label in #27251 with a small status icon. Contains 3-4 skeleton placeholder blocks (rounded 9999px, #f0eeea fill) indicating loading state.

### Skeleton Placeholder
**Role:** Loading state for content cards

Rounded 9999px bar, 8px height, #f0eeea fill, animated with a subtle shimmer. Arranged in rows with 8px gap.

### Sign In Button
**Role:** Authentication entry at sidebar bottom

28px height, 8px 12px padding, 9999px radius, pplxSans 14px weight 500 in #27251e. Circular avatar/icon prefix.

### Model Selector
**Role:** Dropdown trigger for AI model selection

Inline text button, 14px pplxSans weight 400 in #27251, trailing chevron-down icon at 12px. No border or background.

## Do's and Don'ts

### Do
- Use 9999px border-radius for all interactive controls (buttons, nav items, toggle chips, tags)
- Maintain the narrow type scale: 12px caption, 14px body-sm, 16px body — do not introduce sizes outside this set
- Set all card and input backgrounds to #ffffff on the #faf8f5 canvas to create the paper-on-paper layering effect
- Use 1px #d1d1cd borders for all container separation — avoid shadows except the single whisper-soft card shadow
- Use #016a71 teal only for active/selected state indicators — it should appear on fewer than 5% of elements
- Keep the main content column at 640px max-width centered — the search bar is the focal point, not a wide canvas
- Use pplxSans weight 500 exclusively for emphasis and active states; weight 400 for all default and body text

### Don't
- Do not introduce new colors — the palette is deliberately minimal: cream, black, warm grays, and one teal
- Do not use bold weights (600+) — the system maxes at weight 500
- Do not use 0px or 4px border-radius on interactive elements — always pill (9999px) or 12px minimum
- Do not apply heavy shadows or multiple shadow layers — the design is intentionally flat
- Do not use pure white (#ffffff) as a page background — the warm #faf8f5 canvas is a signature choice
- Do not center-align body text — left-align all labels, descriptions, and input text
- Do not use the teal accent decoratively — it signals a functional state (active, selected, live)

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#faf8f5` | Page background — warm off-white that reads as paper or aged cream |
| 1 | Card | `#ffffff` | Elevated container surfaces — input fields, status cards, content blocks |
| 2 | Subtle Fill | `#e8e6e1` | Active nav item backgrounds, hover states — a barely-visible warm gray |

## Elevation

- **Status Card:** `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px`

## Imagery

No photography, illustration, or decorative graphics. The visual language is pure UI — typography, whitespace, and a single teal accent do all the work. Icons are minimal line-style at 16-20px, rendered in #27251 or #72706b. The brand wordmark 'perplexity' is the only typographic identity element. There are no product screenshots, hero images, or marketing visuals on the primary search interface.

## Layout

Centered single-column layout at 640px max-width. Left sidebar (220px) contains primary navigation (New, Computer, Spaces, Customize, History) with a Sign In button pinned at the bottom. Top header bar (56px) holds horizontal category links (Discover, Finance, Health, Academic, Patents) right-aligned. The main content area is dominated by the centered 'perplexity' wordmark and the search input — the hero is literally a search bar, not a visual. Below the search, a status card and skeleton placeholders extend the column. The layout is deliberately minimal: no multi-column grids, no hero imagery, no card carousels on the primary screen. Navigation is a compact sidebar + thin top bar. Section rhythm is defined by generous vertical breathing room (32px+) rather than visual dividers.

## Agent Prompt Guide

## Quick Color Reference
- canvas: #faf8f5
- card/surface: #ffffff
- text primary: #000000
- text secondary: #72706b
- text placeholder: #92918b
- border: #d1d1cd
- active fill: #e8e6e1
- accent (selected/active only): #016a71
- primary action: no distinct CTA color

## Example Component Prompts

1. **Search Input with Submit**: Create a 640px-wide search bar on #faf8f5 canvas. Input: white (#ffffff) background, 1px #d1d1cd border, 12px radius, 16px padding. Placeholder 'Ask anything…' in 16px pplxSans weight 400, #92918b. Inside: a '+' icon (#27251e), a mode chip ('Computer') with #faf8f5 background, 6px radius, 12px pplxSans weight 500, and a dark submit circle (28px, #27251e fill, 9999px radius, white arrow icon).

2. **Sidebar Nav Item**: 36px tall, 8px horizontal padding, 9999px radius. 14px pplxSans weight 400, #27251e text. 16px leading icon in #27251e. Active state: #e8e6e1 background fill. Full width within a 220px left sidebar with #faf8f5 background.

3. **Status Notification Card**: 640px wide, white (#ffffff) background, 16px radius, 1px #d1d1cd border, 12px padding, subtle shadow (rgba(0,0,0,0.08) 0px 1px 2px). 14px pplxSans weight 500 label in #27251e with a 12px status icon. Below: 3-4 skeleton bars (9999px radius, #f0eeea fill, 8px height) with 8px gap.

4. **Teal Active Nav Indicator**: Horizontal 14px pplxSans weight 500 text in #27251e with a #016a71 teal underline bar (2px height, 8px width) or teal pill background. This is the only place teal should appear in the interface.

5. **Top Header Category Link**: Inline 14px pplxSans weight 400, #27251e, no background. Spacing: 16px gap between links, right-aligned in a 56px-tall header bar on #faf8f5 background.

## Similar Brands

- **Notion AI** — Same warm off-white canvas, monochrome text system, and single accent color approach — both feel like documents rather than dashboards
- **Phind** — Developer-focused search interface with centered input hero, minimal chrome, and teal/dark dual-tone palette
- **You.com** — Search-first AI interface with compact sidebar nav, centered query input as the page hero, and restrained accent usage
- **Linear** — Same flat elevation philosophy, hairline borders instead of shadows, narrow type scale, and pill-shaped interactive controls

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aged-paper: #faf8f5;
  --color-ink-black: #000000;
  --color-charcoal: #27251e;
  --color-ash-gray: #72706b;
  --color-stone: #92918b;
  --color-pebble: #d1d1cd;
  --color-deep-teal: #016a71;

  /* Typography — Font Families */
  --font-pplxsans: 'pplxSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-32: 32px;

  /* Layout */
  --page-max-width: 640px;
  --section-gap: 32px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-input: 12px;
  --radius-buttons: 9999px;
  --radius-nav-items: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas: #faf8f5;
  --surface-card: #ffffff;
  --surface-subtle-fill: #e8e6e1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aged-paper: #faf8f5;
  --color-ink-black: #000000;
  --color-charcoal: #27251e;
  --color-ash-gray: #72706b;
  --color-stone: #92918b;
  --color-pebble: #d1d1cd;
  --color-deep-teal: #016a71;

  /* Typography */
  --font-pplxsans: 'pplxSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-32: 32px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px;
}
```
