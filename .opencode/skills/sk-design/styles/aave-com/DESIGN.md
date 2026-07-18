# aave.com — Style Reference
> neon violet threading twilight — a light lavender noon collapses into a midnight product surface, and one electric violet is the only color that survives the transition.

**Theme:** mixed

Aave operates as a dual-mood system: a sunlit lavender hero dissolves into a near-black product surface, with vivid violet (#998eff) threading both halves as the sole chromatic accent. Typography runs on a custom display family (Aave Repro) held in a narrow 400–500 weight range — hierarchy comes from generous size jumps and aggressive negative tracking, not from going bold. Components are soft and pill-shaped by default: 20px is the workhorse corner radius, 1584px marks the full-pill CTA, and elevation is essentially absent — a single soft shadow recipe appears on floating elements only. The result reads as a fintech app that absorbed crypto's electric energy and SaaS's editorial restraint simultaneously, presenting dense DeFi mechanics through a calm, high-contrast canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aave Violet | `#998eff` | `--color-aave-violet` | Primary CTA fill, outlined action borders, category label accent, decorative icon strokes — the single chromatic thread across light and dark sections; warm enough to feel alive against matte black without becoming aggressive |
| Obsidian | `#221d1d` | `--color-obsidian` | Dominant dark surface, body text in light sections, primary nav text — the near-black that anchors the Pro and Markets bands |
| Inkwell | `#0f0f10` | `--color-inkwell` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Charcoal | `#000000` | `--color-charcoal` | Pure-black fallbacks for fills, strokes, and high-contrast borders |
| Iron | `#636161` | `--color-iron` | Body text, muted paragraph copy, secondary nav text — carries the bulk of reading weight in light sections |
| Graphite | `#858387` | `--color-graphite` | Medium-neutral helper text, secondary borders, placeholder fills |
| Pewter | `#8f8e8e` | `--color-pewter` | Icon strokes, tertiary borders, disabled-state outlines |
| Ash | `#bcbbbb` | `--color-ash` | Hairline dividers, subtle fills, low-emphasis SVG strokes |
| Bone | `#f6f7f4` | `--color-bone` | Off-white card surface, light icon borders, tinted secondary background — the warm neutral behind badges and product pills |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, light button fills, text in dark sections |

## Tokens — Typography

### Aave Repro — Sole brand typeface across headlines, body, UI, and nav — the 400→450→500 spread is deliberately narrow, so hierarchy is created through size and tight tracking rather than weight contrast · `--font-aave-repro`
- **Substitute:** Inter (close in x-height and neutrality) or General Sans for the same calm, geometric feel
- **Weights:** 400, 450, 500
- **Sizes:** 13px, 14px, 15px, 16px, 17px, 18px, 20px, 24px, 32px, 40px, 72px
- **Line height:** 1.0–1.5
- **Letter spacing:** -3.6px at 72px, -1.24px at 40px, -0.96px at 32px, -0.6px at 24px, -0.4px at 20px, -0.16px at 16px, -0.084px at 14px, 0.13px at 13px
- **OpenType features:** `"ss07"`
- **Role:** Sole brand typeface across headlines, body, UI, and nav — the 400→450→500 spread is deliberately narrow, so hierarchy is created through size and tight tracking rather than weight contrast

### Inter — Reserve typeface for compact nav utility labels where Aave Repro is not loaded — appears as a fallback rather than a stylistic counterpoint · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 10px, 14px
- **Line height:** 0.8, 1.5
- **Letter spacing:** -0.0060em
- **OpenType features:** `"ss07"`
- **Role:** Reserve typeface for compact nav utility labels where Aave Repro is not loaded — appears as a fallback rather than a stylistic counterpoint

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.13px | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.2 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.6px | `--text-heading-sm` |
| heading | 32px | 1.1 | -0.96px | `--text-heading` |
| heading-lg | 40px | 1.05 | -1.24px | `--text-heading-lg` |
| display | 72px | 1 | -3.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 176 | 176px | `--spacing-176` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| badges | 8px |
| inputs | 20px |
| buttons | 1584px (full pill) |
| nav-items | 8px |
| cards-featured | 24px |
| buttons-secondary | 50px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.05) 0px 6px 20px 0px, rgba(0, 0, 0, 0.06)...` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Violet Pill Button
**Role:** Hero CTA and any single dominant action on a section

Filled #998eff background, #ffffff text, 1584px border-radius (fully pill), 14px 24px padding, 14–16px Aave Repro weight 500, leading icon optional. Used for 'Download on iOS' and equivalent download/launch actions.

### Dark Inverted Pill Button
**Role:** Primary action inside a light section (mirror to violet pill on dark sections)

Filled #0f0f10 background, #ffffff text, 1584px border-radius, 14px 24px padding, Aave Repro 14–16px weight 500. The 'Use Aave' nav button and any dark-mode equivalent of the violet CTA.

### Light Pill Button
**Role:** Primary action on a dark section

Filled #ffffff background, #221d1d text, 50px border-radius, 14px 24px padding, Aave Repro 16px weight 500. The 'Get Started' CTA on the Aave Pro dark band.

### Ghost Outline Button
**Role:** Secondary action alongside a primary CTA

Transparent background, 1px border (#ffffff on dark, #221d1d on light), text matching the border, 50px border-radius, 14px 24px padding. The 'Learn More' pairing button.

### Outlined Violet Button
**Role:** Tertiary action with chromatic emphasis

Transparent background, 1px #998eff border, #998eff text, 50px border-radius, 14px 24px padding. Used when an action needs to feel on-brand but secondary to the filled violet CTA.

### Adaptive Navigation Bar
**Role:** Top-level site navigation across light and dark sections

Horizontal bar with logo at left (Aave mark + wordmark in #221d1d or #ffffff depending on section), centered link group (Products, Resources, Developers, About) in 14px Aave Repro 450, and a dark pill CTA at right. Nav item padding 8px 6px, link color tracks the section: #221d1d in light, #ffffff in dark.

### Product Badge
**Role:** Section label that introduces a product band

Pill containing a small violet icon (16–20px) + label text ('Aave App', 'Aave Pro'). Background #f6f7f4, text #221d1d, 8px border-radius, 8px 12px padding, 14px Aave Repro 450. Floats centered above section headlines.

### Feature Card (Dark)
**Role:** Three-column feature card on the Markets / Pro sections

Background #221d1d (sits on the midnight band), 20px border-radius, 24px padding, no border, no shadow. Contains a violet category label in 14px Aave Repro 500 ('General purpose', 'Predictable', 'Strategy-specific'), a white title in 20px weight 500, and a body paragraph in 14px Iron (#636161 inverted to #bcbbbb on dark).

### App Screen Card (Light)
**Role:** Phone mockup container or app preview surface

White #ffffff surface, 20px border-radius, sits on the lavender hero wash. Houses the iOS device render; no internal padding concern since the device art is the content.

### Input Field
**Role:** Form input across the Pro dashboard and any form context

Background #ffffff, 1px border #bcbbbb, 20px border-radius, 12px 16px padding, 14px Aave Repro 400 placeholder text in #858387, focus state thickens border to #998eff.

### Stat Highlight
**Role:** Large numeric display inside app and dashboard screens

Display-weight numeral (40–72px Aave Repro 500) in #221d1d or #ffffff, paired with a small violet delta or label (e.g. '6.50% APY' in 14px weight 500 #998eff). The visual hook of every phone and dashboard mockup.

### Section Divider Header
**Role:** Title-plus-CTA row that introduces a content section

Two-column row inside a 1200px container: left side holds a display-size heading (40px Aave Repro 500) and a one-sentence subhead in 18px Iron; right side holds a single ghost or outlined action button. Used to open the Markets band.

## Do's and Don'ts

### Do
- Use 1584px border-radius for any filled CTA — the pill shape is non-negotiable and defines the brand's button language
- Reserve #998eff for actions and accents only; never use it for body text, borders on cards, or large background washes beyond the hero lavender gradient
- Set display text at 72px / weight 500 / letter-spacing -3.6px — the aggressive negative tracking at large sizes is what makes headlines feel custom rather than templated
- Hold the type system to weights 400–500; escalate hierarchy through size and tracking before reaching for bolder weights
- Apply the 20px radius as the default for cards, inputs, and secondary buttons; 8px is reserved for badges and nav items
- Use the lavender hero wash (#ffffff fading to ~#ece6ff) only at the top of marketing pages; product sections must start on a #221d1d surface
- Pair every dark-section CTA group as a filled white pill + a ghost outlined pill; never use two filled buttons in the same pair

### Don't
- Don't introduce a second chromatic accent — the entire interface is monochrome plus #998eff, and adding another hue will break the dual-surface system
- Don't use shadows on cards or buttons; the only sanctioned shadow is the soft 6px-blur recipe on floating nav elements
- Don't set body text larger than 18px or smaller than 14px; the scale is deliberate and the gaps between sizes carry the rhythm
- Don't break the light → dark page sequence; every page must transition through a hard surface change between the marketing hero and any product detail
- Don't apply bold (600+) weights; the 400–500 spread is the signature, and a heavier weight reads as off-brand at any size
- Don't use #998eff as a background fill for anything larger than a button or a small badge — at scale it overwhelms the dark surfaces and loses its CTA clarity
- Don't use color alone to signal state in the dark sections; pair violet emphasis with a weight or size change so the meaning survives in monochrome

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base light-section background, hero top wash |
| 1 | Lavender Wash | `#ece6ff` | Hero backdrop — soft violet gradient blooming downward into the phone mockup band |
| 2 | Warm Card | `#f6f7f4` | Light-section secondary surface, product badge backgrounds |
| 3 | Midnight | `#221d1d` | Dark-section primary surface, feature card fill |
| 4 | Abyss | `#0f0f10` | Inverted button fill, deepest surface for high-contrast CTAs |

## Elevation

- **Floating Nav / Dropdown:** `rgba(0, 0, 0, 0.05) 0px 6px 20px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`

## Imagery

Imagery is product-surface driven, not lifestyle. The hero anchors on three iOS device renders arranged in a tight fanned cluster, each showing a different stat highlight (interest rate, weekly balance, projected yield) on pure-white screens. The Pro section uses a full browser chrome with dashboard UI — nav, search bar, and a markets table — rendered as a flat dark-mode screenshot. No photography, no illustration, no decorative 3D: every visual is either a real product capture or a UI mockup. Icons are line-based, ~1.5px stroke, monochrome (#998eff for accents, #636161 or #ffffff for neutral). The restraint is deliberate — the interface is the visual.

## Layout

Centered max-width 1200px container with generous outer gutters. The hero is a full-bleed lavender wash with a centered headline, subhead, CTA pair, and a fanned phone cluster below. The page then hard-cuts to a full-bleed black Pro band: centered badge, display heading, white/dark button pair, and a centered browser-mockup screenshot. The Markets band continues the dark surface with a two-column section header (title left, ghost CTA right) and a three-column feature card grid below. Vertical rhythm is wide — 64–96px between bands — and content is always centered, never asymmetric. Navigation is a flat top bar that swaps its color from dark-on-light to light-on-dark as the user scrolls past the hero.

## Agent Prompt Guide

**Quick Color Reference**
- text-primary-light: #221d1d
- text-primary-dark: #ffffff
- text-muted: #636161
- border-default: #bcbbbb
- accent: #998eff (Aave Violet)
- surface-light: #ffffff
- surface-dark: #221d1d
- primary action: #998eff (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #998eff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


3. **Three-column feature card grid**: 3 cards in a row, each 20px radius, #221d1d background, 24px padding, no border or shadow. Card content: violet category label in 14px Aave Repro weight 500 #998eff, white title in 20px weight 500 #ffffff, body in 14px #bcbbbb. 24px gap between cards.

4. **Input field**: White #ffffff background, 1px #bcbbbb border, 20px radius, 12px 16px padding. Placeholder text 14px Aave Repro weight 400 in #858387. On focus, border becomes #998eff.

5. **Stats display inside a phone screen**: 40–56px Aave Repro weight 500 numeral in #221d1d, with a 14px Aave Repro weight 500 violet label ('6.50% APY') directly above. Sits inside a white phone screen on a lavender hero wash.

## Dual-Surface Architecture

Aave deliberately runs two parallel color systems: a light canvas (#ffffff, #f6f7f4, #221d1d text) for marketing/hero surfaces, and a dark canvas (#221d1d, #0f0f10, #ffffff text) for product surfaces. The bridge is #998eff — it is the only color that is correct in both contexts, used as the CTA fill, the outlined-action border, the category label, and the stat delta. When extending the system, never introduce a second accent; instead, reuse violet at varying weights (fill, stroke, text) across both surfaces. This is the system.

## Weight Restraint

The custom typeface (Aave Repro) is held in a narrow 400/450/500 weight spread. This is a signature choice: instead of jumping to 700 for emphasis, Aave leans on size jumps and tight letter-spacing (down to -0.05em at 72px) to create hierarchy. The result is a system that feels editorial rather than aggressive — appropriate for a financial product where shouting undermines trust.

## Similar Brands

- **Lido Finance** — Same dual light-and-dark section architecture with a single chromatic accent, pill-shaped CTAs, and tight-tracked custom or near-custom display type on a DeFi product surface
- **Compound Labs** — Shared DeFi-product visual grammar: nearly flat dark product surfaces, white pill CTAs inside dark bands, and a single restrained accent color used sparingly for actions
- **Linear** — Same tight 400–500 weight type, aggressive negative tracking at large sizes, and a 'one accent does everything' philosophy across mixed light/dark marketing layouts
- **Uniswap** — Shared pink-as-accent restraint on otherwise monochrome surfaces, soft-cornered (20px-range) cards, and a clear light-to-dark band rhythm across product and protocol pages
- **Phantom Wallet** — Same violet-leaning accent, pill buttons, and a hero phone-mockup trio that mirrors Aave's app marketing band almost beat for beat

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aave-violet: #998eff;
  --color-obsidian: #221d1d;
  --color-inkwell: #0f0f10;
  --color-charcoal: #000000;
  --color-iron: #636161;
  --color-graphite: #858387;
  --color-pewter: #8f8e8e;
  --color-ash: #bcbbbb;
  --color-bone: #f6f7f4;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-aave-repro: 'Aave Repro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.6px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.24px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-176: 176px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 1584px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-badges: 8px;
  --radius-inputs: 20px;
  --radius-buttons: 1584px (full pill);
  --radius-nav-items: 8px;
  --radius-cards-featured: 24px;
  --radius-buttons-secondary: 50px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.05) 0px 6px 20px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-lavender-wash: #ece6ff;
  --surface-warm-card: #f6f7f4;
  --surface-midnight: #221d1d;
  --surface-abyss: #0f0f10;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aave-violet: #998eff;
  --color-obsidian: #221d1d;
  --color-inkwell: #0f0f10;
  --color-charcoal: #000000;
  --color-iron: #636161;
  --color-graphite: #858387;
  --color-pewter: #8f8e8e;
  --color-ash: #bcbbbb;
  --color-bone: #f6f7f4;
  --color-paper: #ffffff;

  /* Typography */
  --font-aave-repro: 'Aave Repro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.6px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.24px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-176: 176px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 1584px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.05) 0px 6px 20px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
}
```
