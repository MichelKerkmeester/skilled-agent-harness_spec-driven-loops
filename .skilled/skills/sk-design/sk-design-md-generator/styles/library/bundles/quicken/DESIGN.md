# Quicken — Style Reference
> electric violet on white marble

**Theme:** mixed

Quicken's design system orbits a single electric violet — vivid #471cff — that acts as the power source for every interactive element against a clean white canvas. The visual personality is confident financial-tech: a custom geometric sans (Haffer) sets the voice with tight negative tracking that tightens further as type grows, creating density and authority without weight. Dark violet sections (#0f0733) alternate with white bands to create rhythm, while soft lavender card borders (#dbd3ff, #bbc5fa) replace the usual gray dividers and reinforce brand identity at every edge. Components lean rounded and pill-shaped: cards use 16px corners, buttons stretch to 400px radius, and shadows are nearly absent — depth comes from color contrast and border treatment, not elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Violet | `#471cff` | `--color-voltage-violet` | Primary action buttons, active nav items, key links, brand emphasis — the single chromatic pulse of the interface; everything else defers to it |
| Deep Iris | `#0f0733` | `--color-deep-iris` | Dark section backgrounds, hero canvas, high-contrast text on light surfaces — the midnight counterpart that anchors alternating dark bands |
| Signal Red | `#eb0130` | `--color-signal-red` | Promotional accents, sale/urgency indicators, highlight strokes — used sparingly to flag attention without competing with the primary violet |
| Lilac Whisper | `#dbd3ff` | `--color-lilac-whisper` | Soft card and container borders — a low-contrast violet edge that brands outlines without adding visual weight |
| Periwinkle Mist | `#bbc5fa` | `--color-periwinkle-mist` | Cooler card border tone for grouping and container edges — second step in the violet border scale for layered cards |
| Coral Burst | `#ff5a43` | `--color-coral-burst` | Error and warning badge fills, alert pills — warm contrast against the cool violet system |
| Aqua Pop | `#7ae7fb` | `--color-aqua-pop` | Decorative badge backgrounds, hero trust-pill fill — cool cyan that brightens dark sections |
| Ink Black | `#18181f` | `--color-ink-black` | Primary body and heading text, dominant border color, icon strokes — the near-black that carries all readable content |
| Carbon | `#494949` | `--color-carbon` | Secondary text, muted nav, supporting borders — the mid-gray step between ink and white |
| Pure White | `#ffffff` | `--color-pure-white` | Page and card backgrounds, text on dark surfaces, button fills for ghost variants |
| Frost Blue | `#f0f5fa` | `--color-frost-blue` | Subtle surface tint for alternating bands, header backgrounds — barely-there cool wash |
| Linen Gray | `#eaecf7` | `--color-linen-gray` | Table dividers, hairline borders in data-heavy layouts — a cool neutral that doesn't fight the violet palette |

## Tokens — Typography

### Haffer — Single-family system for everything from body to display. Weight 400 carries body, nav, and table text; weight 600 handles headings, buttons, and emphasis. The custom geometric construction gives a contemporary financial-tech voice — rounder apertures than Inter, tighter terminals than Geist. · `--font-haffer`
- **Substitute:** Inter, DM Sans, or General Sans
- **Weights:** 400, 600
- **Sizes:** 12, 13, 14, 16, 17, 18, 19, 20, 22, 26, 30, 48, 60
- **Line height:** 1.0–2.0 (tight 1.0–1.2 on display, comfortable 1.4–1.5 on body)
- **Letter spacing:** -0.045em at 60px, -0.033em at 30px, -0.030em at 20px and below
- **Role:** Single-family system for everything from body to display. Weight 400 carries body, nav, and table text; weight 600 handles headings, buttons, and emphasis. The custom geometric construction gives a contemporary financial-tech voice — rounder apertures than Inter, tighter terminals than Geist.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.03px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.03px | `--text-body-sm` |
| body | 16px | 1.5 | -0.03px | `--text-body` |
| subheading | 20px | 1.31 | -0.03px | `--text-subheading` |
| heading-sm | 26px | 1.2 | -0.033px | `--text-heading-sm` |
| heading | 30px | 1.16 | -0.033px | `--text-heading` |
| heading-lg | 48px | 1 | -0.045px | `--text-heading-lg` |
| display | 60px | 1 | -0.045px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 400px |
| tags | 100px |
| cards | 16px |
| badges | 20px |
| buttons | 400px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.15) 10px 20px 30px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Action Button
**Role:** Main CTA for conversion moments

Pill shape (400px radius), background #471cff, white text at 16px Haffer weight 600, padding 12px 24px, no border. Hover deepens the violet fill. The signature interactive element of the system.

### Ghost Action Button
**Role:** Secondary CTA paired beside a primary

Pill shape (400px radius), transparent background, 1.5px border in #471cff, text in #471cff at 16px Haffer weight 600, padding 12px 24px. Mirrors the primary's shape but defers visually — violet outline against white card.

### Hero Headline
**Role:** Top-of-page value proposition

White text at 60px Haffer weight 600, line-height 1.0, letter-spacing -0.045em. Sits on Deep Iris (#0f0733) background. Below it, 18px body text in #dbd3ff or white at 80% opacity for subtitle.

### Trust Badge Pill
**Role:** Social proof or category label above hero headline

Rounded pill (100–400px radius), background #7ae7fb or #f0f5fa, text in #18181f at 13px Haffer weight 600, padding 8px 16px. The cyan variant on the hero creates the only cool color interruption on dark sections.

### Pricing Tier Card
**Role:** Product plan comparison on pricing sections

White background, 16px corner radius, 1.5px border in #bbc5fa or #dbd3ff, padding 24px. Contains tier icon (violet square 32px), plan name at 20px weight 600, description at 14px, strikethrough original price + bold monthly price + red promotional badge. Drop shadow rgba(0,0,0,0.15) 10px 20px 30px for depth on white.

### Promotional Badge
**Role:** Highlight discount or urgency markers

Rounded pill (20px radius), background #eb0130 or #ff5a43, white text at 12px Haffer weight 600, padding 4px 8px. The red-on-white micro-badge attached to strikethrough prices.

### Feature Showcase Card
**Role:** Dark-section feature highlight with illustration

Deep Iris (#0f0733) background, 16px corner radius, padding 0 (image bleeds to edges). Upper portion is a full-bleed product visualization; lower portion is white with heading at 26px weight 600, body at 16px, and a violet text link.

### Feature Comparison Table
**Role:** Side-by-side plan feature matrix

White background, row dividers in #eaecf7 (1px), column headers with violet icon tiles (#471cff background, 16px radius, 40px square) above plan names at 16px weight 600. Checkmarks for included features rendered in a small green or violet circle.

### Top Navigation Bar
**Role:** Persistent site navigation

White background, 400px pill radius on nav items and CTA, 16px Haffer weight 400 for links, 600 for active item in #471cff. Quicken logo in #471cff at top-left. Sign-in link right-aligned. Sticky on scroll.

### Phone Mockup Frame
**Role:** Hero product visualization

iPhone-style frame with thin black bezel, slight 3D rotation (-10° to -15°), floating beside headline. Screen content is white with Haffer type and data visualizations. Sits on Deep Iris hero background.

### Centered Section Header
**Role:** Transitional section introduction

Centered heading at 48px Haffer weight 600, #18181f, letter-spacing -0.045em, with optional violet pill button (#471cff, white text, 400px radius) directly below. White background section.

### Inline Feature Icon
**Role:** Category indicator on pricing and feature cards

32×32px square with 8px radius, #471cff background, white line-icon centered. Marks each plan tier or feature category without adding label noise.

## Do's and Don'ts

### Do
- Use Voltage Violet (#471cff) exclusively for the single most important action per screen — never split attention across multiple violet CTAs
- Set card borders to Lilac Whisper (#dbd3ff) or Periwinkle Mist (#bbc5fa) instead of neutral gray to reinforce brand identity at every edge
- Set all buttons to 400px border-radius — pill shapes are non-negotiable in this system and signal action
- Tighten letter-spacing progressively: -0.030em at 16px, -0.033em at 26–30px, -0.045em at 48px+
- Alternate between white and Deep Iris (#0f0733) sections to create rhythm — never let two dark sections sit adjacent without a white break
- Anchor dark sections with white text at full opacity; use Lilac Whisper (#dbd3ff) for secondary text on dark rather than dimmed white
- Use Signal Red (#eb0130) only for discount badges and urgency — never as a replacement for the primary action color

### Don't
- Don't introduce new hues — the system is binary: violet accents on white, or white on Deep Iris
- Don't use drop shadows on components other than the pricing card stack — depth should come from color and border
- Don't use sharp 0px or minimal 4px corner radii on cards — 16px is the minimum card radius and buttons must stay pill-shaped
- Don't place body text below 14px or above 18px — the system avoids both micro-copy and large body type
- Don't use #18181f and #000000 interchangeably — #000000 is reserved for navigation chrome; body text uses #18181f
- Don't add gradients — the system is flat by design; depth comes from violet-to-Deep-Iris section contrast
- Don't use weight 400 for headings or weight 600 for body — the binary weight assignment is part of the typographic signature

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Default light page background and card surfaces |
| 2 | Frost Band | `#f0f5fa` | Subtle alternating section tint, header strip |
| 3 | Deep Iris | `#0f0733` | Dark hero sections and feature card surfaces |

## Elevation

- **Pricing Card:** `rgba(0, 0, 0, 0.15) 10px 20px 30px 0px`

## Imagery

Product screenshots take center stage, rendered as iPhone mockups floating at slight rotation angles against the Deep Iris hero background — the device is the hero, not lifestyle photography. Secondary visuals are flat data visualizations (charts, projected cash flow lines, budget breakdowns) rendered in violet, cyan, and white directly on dark card surfaces. Illustrations are absent — the system relies on real product UI, trust badges, and large numeric headlines. Photography is not used; the visual language is pure product-and-data.

## Layout

Max-width 1200px centered container with generous side padding. The hero is full-bleed Deep Iris (#0f0733) with asymmetric text-left/product-right composition at 60/40 split. Below the hero, content alternates: white pricing-card row (3-column grid), white centered comparison section, then 2×2 dark feature-card grid. Section gaps are 80px with consistent 24px card padding. Navigation is a clean white sticky top bar with centered nav links and right-aligned sign-in. Grid systems favor 2-column and 3-column arrangements; the layout never exceeds 3 columns of cards.

## Agent Prompt Guide

**Quick Color Reference**
- text: #18181f
- background: #ffffff
- border: #dbd3ff or #bbc5fa
- accent: Voltage Violet #471cff
- primary action: #471cff (filled action)
- dark surface: #0f0733

**Example Component Prompts**

1. Create a Primary Action Button: #471cff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a pricing tier card: white background, 16px corner radius, 1.5px border in #bbc5fa, padding 24px. A violet icon tile (32×32px, #471cff, 8px radius) sits top-left. Plan name at 20px Haffer weight 600 #18181f below. Description at 14px #494949. A price line showing $3.99/month at 22px weight 600, a strikethrough $7.00 at 14px #494949, and a Signal Red badge (#eb0130, white text, 20px radius, 4px 8px padding) reading '50% off'. Feature checklist below with small violet checkmarks. Footer row: filled Voltage Violet button + ghost violet button, both 400px radius.

3. Create a feature showcase card: Deep Iris (#0f0733) background, 16px radius, full-bleed product visualization in the upper 60% (chart or UI mock in violet/cyan/white). Lower 40% is white with 24px padding, heading at 26px Haffer weight 600 #18181f, body at 16px #494949, and a violet text link (#471cff, no underline by default, underline on hover).

4. Create a comparison table: white background, 1px row dividers in #eaecf7, three columns. Each column header has a 40×40px violet icon tile (#471cff, 8px radius) above the plan name at 16px weight 600. Feature rows at 16px weight 400 #18181f on the left, with violet circle checkmarks (8px filled #471cff) in the appropriate cells.

5. Create a centered section header: white background, 48px Haffer weight 600 #18181f heading centered with -0.045em letter-spacing, and a Voltage Violet pill button (#471cff, white text, 400px radius, 12px 24px padding) centered 16px below.

## Similar Brands

- **Plaid** — Same fintech authority through tight custom sans-serif type, violet/indigo dark sections alternating with white, and pill-shaped CTAs
- **Mercury** — Dark-mode hero sections with white display type, single accent color (Mercury's gold vs Quicken's violet), and clean borderless card grids
- **Notion** — Single-brand-color accent system on white with geometric sans type, pill buttons, and borderless minimal elevation
- **Linear** — Tight typographic tracking that intensifies at large sizes, flat surfaces, and single-accent-color action language
- **Brex** — Dark hero with large display headlines, product mockup floating at angle, and white-card pricing tiers with pill CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-violet: #471cff;
  --color-deep-iris: #0f0733;
  --color-signal-red: #eb0130;
  --color-lilac-whisper: #dbd3ff;
  --color-periwinkle-mist: #bbc5fa;
  --color-coral-burst: #ff5a43;
  --color-aqua-pop: #7ae7fb;
  --color-ink-black: #18181f;
  --color-carbon: #494949;
  --color-pure-white: #ffffff;
  --color-frost-blue: #f0f5fa;
  --color-linen-gray: #eaecf7;

  /* Typography — Font Families */
  --font-haffer: 'Haffer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.03px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.03px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.03px;
  --text-subheading: 20px;
  --leading-subheading: 1.31;
  --tracking-subheading: -0.03px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.033px;
  --text-heading: 30px;
  --leading-heading: 1.16;
  --tracking-heading: -0.033px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.045px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.045px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;
  --radius-full-2: 400px;

  /* Named Radii */
  --radius-nav: 400px;
  --radius-tags: 100px;
  --radius-cards: 16px;
  --radius-badges: 20px;
  --radius-buttons: 400px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.15) 10px 20px 30px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-frost-band: #f0f5fa;
  --surface-deep-iris: #0f0733;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-violet: #471cff;
  --color-deep-iris: #0f0733;
  --color-signal-red: #eb0130;
  --color-lilac-whisper: #dbd3ff;
  --color-periwinkle-mist: #bbc5fa;
  --color-coral-burst: #ff5a43;
  --color-aqua-pop: #7ae7fb;
  --color-ink-black: #18181f;
  --color-carbon: #494949;
  --color-pure-white: #ffffff;
  --color-frost-blue: #f0f5fa;
  --color-linen-gray: #eaecf7;

  /* Typography */
  --font-haffer: 'Haffer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.03px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.03px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.03px;
  --text-subheading: 20px;
  --leading-subheading: 1.31;
  --tracking-subheading: -0.03px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.033px;
  --text-heading: 30px;
  --leading-heading: 1.16;
  --tracking-heading: -0.033px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.045px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.045px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;
  --radius-full-2: 400px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.15) 10px 20px 30px 0px;
}
```
