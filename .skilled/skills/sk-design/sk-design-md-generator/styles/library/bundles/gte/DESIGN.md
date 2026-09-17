# GTE — Style Reference
> Trading terminal behind gallery lighting

**Theme:** mixed

GTE operates on a high-contrast split-personality canvas: a near-black hero stage gives way to a stark white content body, with a single vivid orange accent acting as the connective tissue between the two. Typography carries the brand identity more than color does — a thin, high-contrast serif (Ogg Text Light) handles every headline while a humanist sans (Inter) and a custom geometric monospace (PP Supply Mono) handle UI and data, creating a editorial-meets-terminal feel. Surfaces are flat and unshadowed; depth is achieved through tonal layering (white → soft gray → near-black) and generous border-radius on cards (12–24px) rather than drop shadows. The orange is deployed sparingly and surgically: CTA fills, small tag pills, and accent strokes — never as a wash or gradient. Density leans compact (10px gaps, 16px card padding) with breathing room reserved for section transitions (40px+). The visual rhythm is: dark dramatic hero → clean white feature grid → dark CTA band — a structure that reads as confident, editorial, and trading-desk serious.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff7817` | `--color-ember-orange` | Primary CTAs, feature tag pills, active states, and brand accent strokes — the only chromatic color in the system, used surgically to signal action and brand presence against the monochrome canvas |
| Vellum | `#ffffff` | `--color-vellum` | Page canvas background, card surfaces, and inverted text on dark sections |
| Obsidian | `#18181b` | `--color-obsidian` | Primary text, dark section backgrounds, and strong borders — the structural near-black that defines all dark surfaces and high-contrast outlines |
| Onyx | `#09090b` | `--color-onyx` | Deepest dark — modal backgrounds, input borders on dark, the darkest UI layer above Obsidian |
| Graphite | `#000000` | `--color-graphite` | True black used for dominant text and structural borders in the light theme — renders as maximum-contrast text and outline work |
| Pebble | `#e5e7eb` | `--color-pebble` | Hairline borders, dividers, and subtle surface tints — the lightest structural gray |
| Bone | `#ebebeb` | `--color-bone` | Secondary surface fill for cards and inset panels — sits one step above the canvas |
| Slate | `#71717a` | `--color-slate` | Muted body text, secondary metadata, and disabled-state labels |
| Mist | `#a1a1aa` | `--color-mist` | Lightest muted text — placeholder, tertiary helper, and subtle border accents |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Ogg Text Light — Display and heading serif — used exclusively for editorial headlines and section titles. The thin weight (300) is the signature: high-contrast strokes that feel like a luxury financial publication rather than a SaaS dashboard. Pairs with font-feature-settings for refined alternates (blwf, cv03, cv04, cv09, cv11). · `--font-ogg-text-light`
- **Substitute:** Playfair Display, Cormorant Garamond
- **Weights:** 300, 400
- **Sizes:** 28px, 40px, 80px
- **Line height:** 0.95–1.20
- **Letter spacing:** -0.02em at all sizes
- **OpenType features:** `\"blwf\", \"cv03\", \"cv04\", \"cv09\", \"cv11\"`
- **Role:** Display and heading serif — used exclusively for editorial headlines and section titles. The thin weight (300) is the signature: high-contrast strokes that feel like a luxury financial publication rather than a SaaS dashboard. Pairs with font-feature-settings for refined alternates (blwf, cv03, cv04, cv09, cv11).

### Inter — Primary UI and body text — handles navigation, descriptions, labels, and input fields. The workhorse of the system at 16px body / 14px secondary / 12px micro. Weight 500 for emphasis, 400 for default. · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1.00–1.30
- **Letter spacing:** -0.02em at body sizes
- **Role:** Primary UI and body text — handles navigation, descriptions, labels, and input fields. The workhorse of the system at 16px body / 14px secondary / 12px micro. Weight 500 for emphasis, 400 for default.

### PP Supply Mono — Data, metrics, and terminal-feeling accents — used for stat readouts, ticker labels, code-like UI text, and emphasis labels. Tighter letter-spacing (-0.04em at small sizes) gives a compressed, technical quality. Weight 500 for standout labels. · `--font-pp-supply-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 500
- **Sizes:** 18px
- **Line height:** 0.75–1.40
- **Letter spacing:** -0.04em at 14–16px, -0.02em at 18–20px
- **Role:** Data, metrics, and terminal-feeling accents — used for stat readouts, ticker labels, code-like UI text, and emphasis labels. Tighter letter-spacing (-0.04em at small sizes) gives a compressed, technical quality. Weight 500 for standout labels.

### PP Supply Mono Regular — PP Supply Mono Regular — detected in extracted data but not described by AI · `--font-pp-supply-mono-regular`
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1, 1.2, 1.4
- **Letter spacing:** -0.04, -0.02
- **Role:** PP Supply Mono Regular — detected in extracted data but not described by AI

### PP Supply Mono Medium — PP Supply Mono Medium — detected in extracted data but not described by AI · `--font-pp-supply-mono-medium`
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 20px
- **Line height:** 0.75, 1.1, 1.2, 1.4
- **Letter spacing:** -0.04, -0.02
- **Role:** PP Supply Mono Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.3 | -0.28px | `--text-body-sm` |
| body | 16px | 1.3 | -0.32px | `--text-body` |
| subheading | 18px | 1.3 | -0.36px | `--text-subheading` |
| heading-sm | 28px | 1.1 | -0.56px | `--text-heading-sm` |
| heading | 40px | 1.05 | -0.8px | `--text-heading` |
| display | 80px | 0.95 | -1.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 12-24px |
| inputs | 8px |
| buttons | 8px |
| pillButtons | 600px |
| smallElements | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-80px
- **Card padding:** 16-24px
- **Element gap:** 10px

## Components

### Launch App Pill Button
**Role:** Primary hero CTA — full-pill radius orange button with bold mono label

Background #ff7817, white text in PP Supply Mono Medium at 14px, padding 8px 16px, border-radius 600px (full pill). Includes a small geometric icon glyph to the right of the label. Sits in the top-right of the dark hero.

### Feature Tag Badge
**Role:** Section category label — small orange-outlined pill above section headings

Orange #ff7817 text, Inter 12px weight 500, no background, 8px border-radius, sits 16-24px above the serif section heading. Functions as editorial kicker text.

### Dark Hero Section
**Role:** Full-bleed dramatic opener with chart imagery and large serif headline

Background #18181b (near-black) full-bleed. Centered content with Ogg Text Light 80px display headline in white, with a double-slash orange accent (///) appended to the second line. Layered photography/3D of teal-cyan trading chart elements with floating copper/amber circular tokens. Cookie consent modal overlays bottom-right.

### Feature Card
**Role:** Content card in the features grid — light gray inset surface with rounded corners

Background #ebebeb, border-radius 12-24px, padding 24-40px. Serif heading (Ogg Text Light 28-40px) in #18181b, Inter 14-16px body in #71717a. Some cards contain internal illustrations (chart, speed gauge, exchange diagram) in monochromatic gray tones. No drop shadow — depth comes from the tonal step between #ebebeb and #ffffff canvas.

### Cookie Consent Modal
**Role:** Bottom-right dark overlay with action buttons

Background #09090b (deepest dark), border-radius 12px, padding 16-24px. Inter 14px white heading, 12px #a1a1aa body text. Two buttons: ghost 

### Top Navigation Bar
**Role:** Minimal dark header with centered status indicators

Transparent over dark hero. GTE wordmark left (white, bold). Center: small mono labels 

### Section Heading Group
**Role:** Editorial heading block with kicker tag + serif title + implied subtitle

Vertical stack: orange Feature Tag Badge (12px Inter 500), then large Ogg Text Light heading (40px) in #18181b, optional Inter body at 18px in #71717a. Left-aligned, max-width constrained to readable measure.

### Feature Illustration Block
**Role:** Monochromatic inline diagram inside feature cards

Gray-scale illustrations on #ebebeb card background: candlestick charts, circular gauges with LONG/SHORT labels, exchange flow diagrams, and order book visualizations. Rendered in #71717a and #a1a1aa line work — no fill color, purely informational.

## Do's and Don'ts

### Do
- Use Ogg Text Light at weight 300 for all headlines and section titles — the thin serif is the brand's most distinctive typographic choice
- Apply 12-24px border-radius on all cards and 8px on buttons/inputs — never use sharp 0px corners on content surfaces
- Reserve #ff7817 exclusively for primary actions, feature tag pills, and the slash accent marks in navigation — never use it as a fill for large decorative surfaces
- Use PP Supply Mono for any data, metrics, ticker labels, or terminal-feeling emphasis text to reinforce the trading-desk identity
- Set letter-spacing to -0.02em on all body and heading text — the tight tracking is part of the system, not an accident
- Separate light and dark sections with at least 40-80px of vertical space and no transition gradients — the contrast should be hard and editorial
- Use #ebebeb as the card surface against #ffffff canvas — never use white cards on white background, always create the tonal step

### Don't
- Do not use drop shadows on cards or components — depth must come from tonal layering, not blur
- Do not use the Ogg Text Light serif for body text, UI labels, or anything below 28px — it's a display face only
- Do not introduce additional chromatic colors — the system is monochrome + single orange accent; adding blues, greens, or purples breaks the discipline
- Do not use 0px border-radius on buttons, inputs, or cards — the rounded geometry is essential to the feel
- Do not use the orange #ff7817 for body text, links, or large text blocks — it is an action color, not a content color
- Do not mix system sans-serif as a primary face for content — Inter is the default UI face at 12px+
- Do not use gradients as section backgrounds — the single observed gradient is a decorative texture element, not a layout tool

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background for all light sections — the default working surface |
| 1 | Card | `#ebebeb` | Inset feature cards and content blocks with soft tonal separation from canvas |
| 2 | Border | `#e5e7eb` | Hairline structural borders and dividers between sections |
| 3 | Dark Surface | `#18181b` | Hero background, dark band sections, and elevated dark panels |
| 4 | Deep Dark | `#09090b` | Modal overlays, cookie consent, and deepest dark UI layer |

## Elevation

- **Dark cards on dark sections:** `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset`

## Imagery

Hero features a dark, dramatic product photography/3D render composition: floating amber and copper circular token objects suspended in a black void, with vertical teal-cyan light bars and candlestick chart elements in the background creating depth. The teal-cyan accent (saturated, electric) contrasts with the warm amber tokens, giving a trading-floor energy. Inset feature card illustrations are purely diagrammatic — monochromatic line art in #71717a showing candlestick charts, circular execution gauges with LONG/SHORT buttons, order book visualizations, and exchange architecture flows. No lifestyle photography, no people, no product screenshots — the visual language is abstract financial infrastructure rendered as editorial illustration.

## Layout

Full-bleed dark hero (100vw, ~80vh) with centered content stack: kicker tag, large serif headline, and floating Launch App CTA in top-right. Transitions sharply to a max-width 1200px centered content body on white canvas. Feature sections use a 2-column asymmetric grid (larger card left, smaller card right) with 10px gaps, followed by a 3-column equal grid below. All section headings are left-aligned with the kicker tag above. Navigation is a single transparent horizontal bar over the dark hero only — no sticky header. Vertical rhythm: dark hero → white features → likely dark CTA band (mixed theme structure).

## Agent Prompt Guide

primary action: #ff7817 (filled action)
Create a Primary Action Button: #ff7817 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Hyperliquid** — Same dark-hero-to-light-content split with a single vivid accent color and large thin serif/sans display headlines over near-black backgrounds
- **Jupiter Exchange** — Monochrome crypto UI with a single saturated accent (green in their case) and heavy reliance on generous border-radius for card separation
- **dYdX** — Dark-canvas trading terminal aesthetic with compact density, monospace data labels, and a single accent color for CTAs
- **GMX** — Minimal crypto exchange layout with light content body, gray inset cards (no shadows), and large editorial-style headlines
- **Uniswap** — Clean white-feature-grid crypto interface with flat cards, soft gray surfaces, and typographic hierarchy driven by size/weight rather than color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff7817;
  --color-vellum: #ffffff;
  --color-obsidian: #18181b;
  --color-onyx: #09090b;
  --color-graphite: #000000;
  --color-pebble: #e5e7eb;
  --color-bone: #ebebeb;
  --color-slate: #71717a;
  --color-mist: #a1a1aa;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ogg-text-light: 'Ogg Text Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-supply-mono: 'PP Supply Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-supply-mono-regular: 'PP Supply Mono Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-supply-mono-medium: 'PP Supply Mono Medium', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.56px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: -0.8px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-80px;
  --card-padding: 16-24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 56px;
  --radius-full-2: 600px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 12-24px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-pillbuttons: 600px;
  --radius-smallelements: 4px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ebebeb;
  --surface-border: #e5e7eb;
  --surface-dark-surface: #18181b;
  --surface-deep-dark: #09090b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff7817;
  --color-vellum: #ffffff;
  --color-obsidian: #18181b;
  --color-onyx: #09090b;
  --color-graphite: #000000;
  --color-pebble: #e5e7eb;
  --color-bone: #ebebeb;
  --color-slate: #71717a;
  --color-mist: #a1a1aa;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ogg-text-light: 'Ogg Text Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-supply-mono: 'PP Supply Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-supply-mono-regular: 'PP Supply Mono Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-pp-supply-mono-medium: 'PP Supply Mono Medium', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.56px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: -0.8px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 56px;
  --radius-full-2: 600px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
}
```
