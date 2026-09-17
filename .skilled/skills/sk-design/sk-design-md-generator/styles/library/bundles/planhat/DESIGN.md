# Planhat — Style Reference
> Cinematic monochrome editorial — a darkroom print on cold-pressed paper.

**Theme:** mixed

Planhat speaks in a near-monochrome editorial voice: a cinematic dark hero — photographic forest warmth fading into black — gives way to cool white space below, where content breathes between hairline borders and large, tightly-tracked display type. The system is almost entirely black, white, and a warm taupe; chromatic color is absent from the marketing surface, making any accent feel intentional when it appears. Type does the heavy lifting: a custom neo-grotesque variable face with aggressive negative tracking carries headlines up to 113px, while Inter handles UI and body at a compact rhythm. The overall feel is a printed annual report crossed with a darkroom — quiet authority, generous whitespace, and the confidence to leave large areas of the page nearly empty.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, filled-button text — the bright stage everything sits on |
| Deep Ink | `#121211` | `--color-deep-ink` | Secondary text and input field treatment — a near-black that softens long-form body copy without losing contrast |
| Graphite | `#575551` | `--color-graphite` | Muted helper text and secondary descriptions — a mid-gray that recedes behind Obsidian labels |
| Warm Stone | `#958d7e` | `--color-warm-stone` | Tertiary text, subdued link and border accents — a desaturated taupe that warms the otherwise cold grayscale |
| Ember Tag | `#e8552b` | `--color-ember-tag` | Product-UI accent visible in feature mockups (agent tags, handoff markers) — the only chromatic punctuation, kept small and functional |

## Tokens — Typography

### Geigy LL Duplex Var — Display and editorial headings — a custom neo-grotesque variable face that sets the entire tone; aggressive negative tracking at 48–113px pulls letters tight for a compressed, architectural headline · `--font-geigy-ll-duplex-var`
- **Substitute:** Inter Tight or General Sans at matching weight, with manual tracking
- **Weights:** 400
- **Sizes:** 18px, 24px, 32px, 48px, 60px, 113px
- **Line height:** 1.00, 1.10, 1.20, 1.25, 1.40
- **Letter spacing:** -0.06em at 113px, -0.045em at 60px, -0.035em at 48px, -0.03em at 32px, -0.02em at 24px
- **OpenType features:** `'blwf' on, 'cv03' on, 'cv04' on, 'cv09' on, 'cv11' on`
- **Role:** Display and editorial headings — a custom neo-grotesque variable face that sets the entire tone; aggressive negative tracking at 48–113px pulls letters tight for a compressed, architectural headline

### Inter — UI, body copy, form fields, button labels — the workhorse at 14–16px, with 10px reserved for uppercase eyebrow labels at expanded tracking · `--font-inter`
- **Substitute:** system-ui or Helvetica Neue
- **Weights:** 400, 500
- **Sizes:** 10px, 12px, 14px, 16px
- **Line height:** 1.00, 1.20, 1.40, 1.43, 1.50
- **Letter spacing:** -0.02em at 16px, -0.015em at 14px, -0.01em at 12px, 0.1em at 10px (uppercase labels)
- **Role:** UI, body copy, form fields, button labels — the workhorse at 14–16px, with 10px reserved for uppercase eyebrow labels at expanded tracking

### system sans-serif — Fallback and small utility rendering at 12px — appears in decorative or rendering contexts where Inter is not loaded · `--font-system-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Fallback and small utility rendering at 12px — appears in decorative or rendering contexts where Inter is not loaded

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 10px | 1 | 1px | `--text-eyebrow` |
| caption | 12px | 1.2 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.21px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| body-lg | 18px | 1.4 | -0.36px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.48px | `--text-subheading` |
| heading-sm | 32px | 1.25 | -0.96px | `--text-heading-sm` |
| heading | 48px | 1.1 | -1.68px | `--text-heading` |
| heading-lg | 60px | 1.1 | -2.7px | `--text-heading-lg` |
| display | 113px | 1 | -6.78px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 8px |
| images | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64-80px
- **Card padding:** 24-32px
- **Element gap:** 8-12px

## Components

### Filled Dark Button
**Role:** Primary navigation action (LOG IN)

Solid #000000 background, white (#ffffff) text at 12px Inter 500, uppercase tracking +0.1em. 4px radius. 12px 20px padding. No shadow.

### Outlined Ghost Button
**Role:** Secondary action (REQUEST A DEMO) on light surfaces

Transparent background, 1px #000000 border, #000000 text at 12px Inter 500 uppercase, 0.1em tracking, trailing chevron arrow. 4px radius. 12px 20px padding.

### Outlined Light Button
**Role:** Secondary action (REQUEST A DEMO) on dark hero

Transparent background, 1px #ffffff border, #ffffff text at 12px Inter 500 uppercase, 0.1em tracking, trailing chevron. 4px radius. 12px 20px padding.

### Top Navigation Bar
**Role:** Persistent header

Full-width white bar, 64–72px height. Left: Planhat wordmark in Obsidian. Center: horizontal menu items at 14px Inter 400 with dropdown carets (Solutions, Platform, Customers, Explore, Pricing). Right: LOG IN filled dark button + REQUEST A DEMO outlined ghost button. Hairline #000000 1px bottom border.

### Hero Section
**Role:** Above-the-fold brand statement

Full-viewport dark photographic background (forest/nature imagery with golden light) overlaid with ~60% black gradient wash. Eyebrow text in 10px uppercase white at 0.1em tracking. Headline in 60px Geigy Var 400, -0.045em tracking, white. Subtext in 18px Inter 400 white. CTA: outlined light button with chevron.

### Logo Grid Card
**Role:** Social proof / customer logos

12-cell grid (2 rows × 6 columns), 1px #000000 hairline borders, #ffffff background. Each cell ~140px tall, centered monochrome logo at 60% black. No padding inside cells, no individual cell radius.

### Feature Column Card
**Role:** Three-column feature explanation with embedded product UI

#f5f5f3 or #f0eeea background panel, 8px radius, 24–32px internal padding. Contains a product mockup illustration at top (stylized UI elements on neutral surface) and below: 18px Inter 400 title in Obsidian + 14px Inter 400 body in Graphite. No drop shadow; separation comes from hairline borders and surface color shift.

### Section Heading Pair
**Role:** Two-column section intro

Left: 48px Geigy Var 400, -0.035em, Obsidian, 2–3 lines. Right: 18px Inter 400 Graphite, 1–2 sentence description. Generous gap between columns; vertically aligned to the grid.

### Product Mockup Panel
**Role:** Embedded UI illustration within feature cards

Neutral-warm background (#f0eeea) containing floating card elements: small tag pills with 4px radius and faint borders, connecting lines, icon squares with 4px radius, occasional Ember Tag (#e8552b) accent on active/agent labels. All internal elements use 4px radius consistently.

### Footer Link Group
**Role:** Site map navigation

Vertical stack at 14px Inter 400, 8px row gap, Obsidian text. Section title in 12px Inter 500 uppercase, 0.1em tracking, Graphite.

## Do's and Don'ts

### Do
- Use Geigy LL Duplex Var for all display and heading text at 32px and above, with negative tracking between -0.02em and -0.06em scaled to size
- Keep the palette strictly monochromatic on marketing surfaces — black, white, and the Warm Stone taupe are the only permitted colors outside the hero photograph
- Set all button text to 10–12px Inter 500 uppercase with 0.1em tracking and a trailing chevron arrow for directional actions
- Maintain 4px radius on all interactive elements (buttons, inputs, tags) and 8px on cards and content panels
- Use 1px hairline #000000 borders for table-like grids and card dividers instead of background-color separation
- Let display headlines run to 48–60px on section intros and reserve 113px exclusively for hero-level statements
- Anchor every section with a 10px uppercase eyebrow label at 0.1em tracking, 16–24px above its heading

### Don't
- Do not introduce chromatic color on the marketing surface — if a color is needed, use it at functional-product level only (inside mockup illustrations), never on CTAs, headings, or background fills
- Do not use rounded radii above 8px on content cards — the system reads as architectural and precise, not soft or playful
- Do not set display type in Inter or any system font — the custom Geigy face with its stylistic alternates (cv03, cv04, cv09, cv11) is the brand signature
- Do not add drop shadows to cards or panels — separation is achieved through hairline borders and surface color shifts only
- Do not use letter-spacing looser than -0.01em on body text or positive tracking below 10px — the system relies on density and tightness
- Do not center-align body paragraphs or long-form descriptions — keep them left-aligned to maintain the editorial print feel
- Do not place text directly on the hero photograph without the dark gradient overlay — 60% black wash minimum is required for legibility

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default light page background |
| 1 | Card Surface | `#f5f5f3` | Lightly tinted card and feature-block backgrounds (derived from white + warm undertone) |
| 2 | Product Mockup Surface | `#f0eeea` | Neutral-warm panel behind embedded product UI illustrations |
| 3 | Hero Overlay | `#000000` | Dark photographic hero with semi-transparent black wash, text in white |

## Elevation

The design avoids drop shadows almost entirely. Elevation is communicated through three mechanisms instead: (1) surface color shift (white → faint warm gray → deeper warm gray), (2) 1px hairline borders in Obsidian, and (3) generous negative space between elements. Where shadows do appear — inside embedded product-UI mockups — they are extremely soft and warm-tinted, serving as illustration detail rather than as a UI convention.

## Imagery

Photography is reserved exclusively for the hero: a single full-bleed dark environmental shot — a misty forest with warm golden light filtering through — that sets a cinematic, almost editorial tone. Below the fold, there is no photography at all; the visual language shifts entirely to clean white space, hairline-bordered logo grids, and stylized product-UI mockups rendered as flat illustrations on neutral warm panels. Icons are simple monochrome line/solid glyphs at 16–20px. The product mockups themselves are mini product screenshots with subtle drop shadows and small chromatic accent tags (Ember Tag) — these are illustrative, not photographic.

## Layout

Max-width 1280px centered content with a persistent full-width top nav. The hero is the only full-bleed element: a full-viewport dark photographic background with left-aligned text block occupying roughly 45% of the viewport width. Below the fold, content flows in generous 64–80px vertical sections on pure white. Sections alternate between two patterns: (1) a two-column intro — large display headline left, short description right — followed by visual content, and (2) centered narrow text blocks. Feature explanations use a 3-column card grid. The logo grid is a 6×2 table-like layout with hairline borders. Navigation is a single horizontal bar with dropdown menus and a right-aligned CTA pair. The overall density is spacious despite the compact base spacing unit — large type and generous vertical gaps give each section room to breathe.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Obsidian)
- background: #ffffff (Paper White)
- border: #000000 (Obsidian, 1px hairline)
- muted text: #575551 (Graphite)
- warm accent: #958d7e (Warm Stone)
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Hero section*: Full-viewport dark photographic background (forest/nature with warm golden tones) overlaid with ~60% black gradient wash. Eyebrow at 10px Inter 500 uppercase white, 0.1em tracking. Headline at 60px Geigy Var 400 white, letter-spacing -2.7px, line-height 1.1. Subtext at 18px Inter 400 white. Ghost button: transparent background, 1px white border, white text 12px uppercase 0.1em, 4px radius, 12px 20px padding, trailing chevron.

2. *Section intro pair*: Left column headline at 48px Geigy Var 400 Obsidian, letter-spacing -1.68px, line-height 1.1, 2–3 lines. Right column description at 18px Inter 400 Graphite (#575551), line-height 1.4. 64–80px vertical gap above, on #ffffff canvas.

3. *Feature card with product mockup*: 8px radius panel with #f0eeea background, 24–32px internal padding. Top: stylized product UI illustration on neutral-warm surface — floating card elements with 4px radius, hairline borders, small tag pills. Bottom: 18px Inter 400 Obsidian title, 14px Inter 400 Graphite description. No shadow.

4. *Top navigation bar*: Full-width white bar, 64–72px height, 1px Obsidian bottom border. Left: Planhat wordmark in Obsidian. Center: menu items at 14px Inter 400 with dropdown carets. Right: filled dark button (#000000 bg, #ffffff text, 12px Inter 500 uppercase 0.1em, 4px radius, 12px 20px padding) labeled LOG IN, followed by outlined ghost button (1px Obsidian border, transparent bg, Obsidian text, same text style) labeled REQUEST A DEMO with chevron.

5. *Logo grid*: 6-column × 2-row table on #ffffff, 1px Obsidian hairline borders between cells, no internal cell padding, each cell ~140px tall with a centered monochrome logo at 60% black.

## Typographic Signature

The headline face — Geigy LL Duplex Var — carries five active stylistic alternates (cv03, cv04, cv09, cv11, blwf) that subtly reshape letterforms for a neo-grotesque feel. Combined with aggressive negative tracking at display sizes (-0.06em at 113px), this creates the compressed, architectural quality that defines the brand. Never substitute a system grotesque here; the alternates are the differentiator. Body text in Inter at 14–16px with light negative tracking (-0.01em to -0.02em) keeps the density tight without crowding.

## Similar Brands

- **Linear** — Same near-monochrome editorial system with a custom display typeface, hairline borders, and tight tracking on large headlines
- **Attio** — Similar clean light-surface SaaS aesthetic with generous whitespace, precise grid layouts, and minimal chromatic accent
- **Vercel** — Monochrome palette, large tightly-tracked display type, and architectural white-space-driven composition
- **Stripe** — Editorial-grade typography, restrained neutral palette, and the confidence to leave large page areas visually empty

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-deep-ink: #121211;
  --color-graphite: #575551;
  --color-warm-stone: #958d7e;
  --color-ember-tag: #e8552b;

  /* Typography — Font Families */
  --font-geigy-ll-duplex-var: 'Geigy LL Duplex Var', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1;
  --tracking-eyebrow: 1px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.68px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.7px;
  --text-display: 113px;
  --leading-display: 1;
  --tracking-display: -6.78px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64-80px;
  --card-padding: 24-32px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 100px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 8px;
  --radius-images: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #f5f5f3;
  --surface-product-mockup-surface: #f0eeea;
  --surface-hero-overlay: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-deep-ink: #121211;
  --color-graphite: #575551;
  --color-warm-stone: #958d7e;
  --color-ember-tag: #e8552b;

  /* Typography */
  --font-geigy-ll-duplex-var: 'Geigy LL Duplex Var', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1;
  --tracking-eyebrow: 1px;
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.68px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.7px;
  --text-display: 113px;
  --leading-display: 1;
  --tracking-display: -6.78px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 100px;
  --radius-full-2: 999px;
}
```
