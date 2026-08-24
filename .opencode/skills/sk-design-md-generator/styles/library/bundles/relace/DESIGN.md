# Relace — Style Reference
> Warm paper notebook with amber ink — an editor's desk, not a dashboard.

**Theme:** light

Relace operates as a warm-paper devtool: a cream canvas (#fffef2) rather than cold white, with a single rationed amber accent (#fcaa2d) that punctuates CTAs and inline highlights. Typography carries the entire personality — a distinctive geometric sans (Parabole Trial) with aggressively tight tracking at display sizes produces editorial-weight, left-aligned headlines, while a monospace (Decima Mono Pro) handles all UI chrome, version labels, and code. The system is radically sharp: 2px radii dominate, hairlines replace shadows, and structural black borders (#000000) define separation rather than elevation. Landscape photography with code overlays breaks the monochrome rhythm, and the single warm accent is reserved for moments that must land — never decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Page Cream | `#fffef2` | `--color-page-cream` | Universal page background and card surface — the warm, almost unbleached paper that defines the entire visual temperature |
| Ink Black | `#191918` | `--color-ink-black` | Primary text color, dark surface fills, and code-window backgrounds — warm near-black, never pure optical black |
| Rule Black | `#000000` | `--color-rule-black` | Structural hairlines and borders — 1px lines that define cards, separate sections, and replace shadow as the elevation language |
| Warm Stone | `#75756f` | `--color-warm-stone` | Muted body text, secondary borders, and inactive link states — a warm gray that recedes without going cool |
| Linen Beige | `#edece0` | `--color-linen-beige` | Secondary elevated surface — warm light beige for tags, subtle background panels, and hover washes that lift off the cream canvas |
| Ash Gray | `#bab9b0` | `--color-ash-gray` | Tertiary dividers and inactive UI elements — a mid-warm gray for the lightest structural lines |
| Amber Signal | `#fcaa2d` | `--color-amber-signal` | Yellow outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Parabole Trial — Primary typeface across all display, heading, and body contexts. Regular weight 400 carries body and display; Medium 500 handles subheadings (20px) and emphasis captions (14px). The aggressively tight tracking at large sizes (-0.05em at 64px) is a signature choice — display headlines compress into a confident block rather than spreading airy. Substitute: 'Instrument Sans' or 'Space Grotesk' from Google Fonts for the closest free match to Parabole's geometric character · `--font-parabole-trial`
- **Substitute:** Instrument Sans
- **Weights:** 400, 500
- **Sizes:** 14px, 20px
- **Line height:** 1.06–1.50
- **Letter spacing:** -0.0500em at 64px → -0.0400em at 40px → -0.0500em at 36px → -0.0300em at 20px → -0.0400em at 18px → -0.0400em at 16px → -0.0300em at 14px
- **Role:** Primary typeface across all display, heading, and body contexts. Regular weight 400 carries body and display; Medium 500 handles subheadings (20px) and emphasis captions (14px). The aggressively tight tracking at large sizes (-0.05em at 64px) is a signature choice — display headlines compress into a confident block rather than spreading airy. Substitute: 'Instrument Sans' or 'Space Grotesk' from Google Fonts for the closest free match to Parabole's geometric character

### Decima Mono Pro — Monospace for all UI chrome: version labels, timeline ticks, navigation micro-text, code blocks, badge labels, and tag metadata. The slight positive tracking (0.03–0.04em) at small sizes is anti-default — monospace usually tightens at small sizes, but this opens up to read clearly as inline UI text. Substitute: 'JetBrains Mono' or 'IBM Plex Mono' · `--font-decima-mono-pro`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 10px, 12px, 16px
- **Line height:** 1.10–1.20
- **Letter spacing:** 0.0400em at 10px → 0.0300em at 12px → 0.0300em at 16px
- **Role:** Monospace for all UI chrome: version labels, timeline ticks, navigation micro-text, code blocks, badge labels, and tag metadata. The slight positive tracking (0.03–0.04em) at small sizes is anti-default — monospace usually tightens at small sizes, but this opens up to read clearly as inline UI text. Substitute: 'JetBrains Mono' or 'IBM Plex Mono'

### Parabole Trial Regular Text — Parabole Trial Regular Text — detected in extracted data but not described by AI · `--font-parabole-trial-regular-text`
- **Weights:** 400
- **Sizes:** 10px, 12px, 16px, 18px, 36px, 40px, 64px
- **Line height:** 1.1, 1.2, 1.5
- **Letter spacing:** -0.05, -0.04, 0.04
- **Role:** Parabole Trial Regular Text — detected in extracted data but not described by AI

### Parabole Trial Regular Display — Parabole Trial Regular Display — detected in extracted data but not described by AI · `--font-parabole-trial-regular-display`
- **Weights:** 400
- **Sizes:** 36px, 40px, 64px
- **Line height:** 1.1
- **Letter spacing:** -0.05, -0.04
- **Role:** Parabole Trial Regular Display — detected in extracted data but not described by AI

### Karla — Karla — detected in extracted data but not described by AI · `--font-karla`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** Karla — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| mono-xs | 10px | 1.2 | 0.4px | `--text-mono-xs` |
| mono-sm | 12px | 1.2 | 0.36px | `--text-mono-sm` |
| caption | 14px | 1.5 | -0.42px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.64px | `--text-body-sm` |
| body | 18px | 1.5 | -0.72px | `--text-body` |
| subheading | 20px | 1.06 | -0.6px | `--text-subheading` |
| heading | 36px | 1.1 | -1.8px | `--text-heading` |
| heading-lg | 40px | 1.1 | -1.6px | `--text-heading-lg` |
| display | 64px | 1.1 | -3.2px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 2px |
| icons | 800px |
| badges | 800px |
| inputs | 2px |
| buttons | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-60px
- **Card padding:** 20-40px
- **Element gap:** 8-20px

## Components

### Amber CTA Button
**Role:** Primary action trigger — the only filled button in the system

Filled #fcaa2d background, #191918 or #000000 text, 2px border-radius, 10px 20px padding. Label in Decima Mono at 12px (0.04em tracking) or Parabole Medium at 14px. Often paired with a small ↗ arrow icon. No hover state elevation — the design trusts color to communicate action, not depth.

### Ghost Outline Button
**Role:** Secondary action paired with the amber CTA

Transparent or #fffef2 background, 1px #000000 border, #191918 text, 2px border-radius, 10px 20px padding. Same label typography as the amber button. Functions as the 'lighter weight sibling' in button pairs — never standalone.

### Navigation Bar
**Role:** Sticky top header across all pages

Full-width #fffef2 background, ~60-80px height, 1px #000000 bottom border. Logo lockup left (small square icon + 'Relace' wordmark in Parabole), nav links in Parabole 16px left-of-center, amber CTA button + 'APP' text link far right. Generous horizontal padding (~40px) keeps the bar breathing.

### Hero Headline
**Role:** Above-the-fold display headline

64px Parabole Regular, #191918, tracking -3.2px, line-height 1.10, left-aligned. Sits beside a ~400px right-column of body text and CTA pair. Never centered — the editorial left-align is a brand-defining choice that separates Relace from typical SaaS hero conventions.

### Section Header with Inline Accent
**Role:** Mid-page section titles with a single amber word

Display or heading-lg Parabole, left-aligned, where one word switches to #fcaa2d color mid-sentence (e.g. 'Get started in minutes'). The amber word is the same size and weight as the surrounding text — it earns attention purely through color, not size or weight change.

### Code Window with Image Overlay
**Role:** Product showcase — code floating over a landscape photograph

Dark #191918 window with 3 traffic-light dots top-left, 12px Decima Mono code with syntax highlighting (keywords amber/white, strings green-tinted, comments muted), positioned over a full-bleed warm landscape image. The code window has 2px radius and no shadow — it sits ON the image as a flat overlay, not floating above it.

### Horizontal Timeline Strip
**Role:** Version or milestone visualization

Full-width band with dense vertical tick marks (hundreds of small 1px lines), short amber tick markers at key positions, version labels in 10px Decima Mono at corners (e.g. 'v3.001', 'v3.851'). The density of tick marks is the visual hook — it looks like a ruler or printer's registration mark, not a typical progress bar.

### Concentric Circles Diagram
**Role:** Feature or capability explanation graphic

Three nested circles with thin #000000 borders, innermost solid #75756f, outer two #edece0 and transparent fills. Labels in 12px Parabole sit outside each ring. A small stylized logo glyph sits in the center. 2px radius on any hard edges.

### FAQ Accordion Item
**Role:** Expandable Q&A list

Full-width row, 20px 40px padding, 1px #000000 bottom border separating items, question text in 16-18px Parabole left-aligned, '+' icon in 20px right-aligned. Expanded state reveals answer text below at 16px body. No background change on hover — the border IS the interaction affordance.

### Brand Trust Strip
**Role:** Social proof row of customer/partner logos

Horizontal row of grayscale brand logos (desaturated, ~60% opacity), preceded by a small mono label 'Trusted by the best leading brands' in 12px Decima Mono. Logos sit on the cream canvas with generous spacing (~40-60px gaps), no dividers between them.

### List Item with Left Accent Border
**Role:** Feature list or navigation list item

Left-aligned text with a 2px #fcaa2d vertical bar on the left edge (8-20px tall), 20px 40px padding, 16-18px Parabole text. The amber bar replaces traditional bullet points or icons — it is the only chromatic element in the list.

### Pill Badge
**Role:** Tags, status indicators, and category labels

800px (fully rounded) border-radius, #edece0 or #fcaa2d background, 10px 16px padding, 10-12px Decima Mono text at 0.04em tracking. Used sparingly — only for genuine metadata labels, not decorative chips.

## Do's and Don'ts

### Do
- Use #fffef2 for every page and card background — never #ffffff or any cool neutral
- Set display heading tracking to -0.05em (-3.2px at 64px) to compress headlines into confident blocks
- Use #fcaa2d exclusively for filled CTAs, single inline accent words in headlines, and left-border list indicators
- Apply 2px border-radius to all rectangular components — buttons, cards, inputs, code windows
- Use Decima Mono (or JetBrains Mono substitute) for all UI chrome: version labels, timestamps, metadata tags, and code
- Separate sections with 1px #000000 hairlines rather than background color shifts or shadows
- Left-align all headlines and body text — the editorial left-flow is a brand-defining layout choice

### Don't
- Never use #ffffff as a background — the warm cream canvas is the brand's visual temperature
- Do not round corners beyond 2px on rectangular components; reserve 800px only for badges and icon containers
- Do not use #fcaa2d for body text, large background areas, or decorative fills — it is rationed for action and single-word emphasis only
- Never add drop shadows or box-shadows — the design uses lines, not depth, for separation
- Do not use cool grays, blues, or any non-warm neutrals — the entire palette is warm-toned
- Do not center headlines or use centered text blocks — left-alignment is non-negotiable
- Do not use system sans-serif (Arial, Helvetica) for headlines — always use Parabole or a geometric sans substitute at tight tracking

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#fffef2` | Page-wide background — the warm paper field everything sits on |
| 2 | Linen | `#edece0` | Subtle elevated wash for tags, secondary panels, and quiet hover states |
| 3 | Ink | `#191918` | Code windows, dark feature blocks, and high-contrast content surfaces |
| 4 | Amber | `#fcaa2d` | Accent surface for filled CTAs, active indicators, and brand-colored highlights |

## Elevation

Relace uses 1px #000000 hairline borders as its sole separation language. There are no drop shadows, no layered surfaces, and no z-axis elevation — the design is deliberately flat. Structure comes from line weight, not from shadow depth. This is an intentional choice: the editorial paper aesthetic would be broken by any sense of digital depth or floating panels.

## Imagery

Photography appears as full-bleed landscape bands — warm-toned outdoor scenes (grasslands, mountains at golden hour) that break the monochrome text rhythm at major section transitions. Images always carry a dark code-window or UI element overlaid on top, creating a 'nature interrupted by interface' juxtaposition. Treatment is unfiltered, natural-color, no duotone or color grading. Product screenshots are absent — all visual storytelling is done through code overlays and abstract diagrams (concentric circles, timeline strips) rather than product UI captures. Icons are minimal: a small square logo glyph, ↗ arrows on CTUs, and a few line-style indicators. No illustration or 3D rendering.

## Layout

Max-width 1200px centered content with generous left/right padding (~40px). Header is full-width sticky with bottom border. Hero is a two-column split: left 60% headline, right 40% body text + CTA pair, no hero image. Sections are left-aligned stacks — never centered text blocks. Content rhythm alternates between text-only sections and full-bleed image bands, creating a breathing pattern of compressed text and wide visual resets. FAQ and feature lists use full-width single-column rows. No card grids, no masonry, no multi-column feature matrices — the layout stays in 1-2 column editorial flows.

## Agent Prompt Guide

**Quick Color Reference**
- text: #191918
- background: #fffef2
- border: #000000
- accent: #fcaa2d
- muted text: #75756f
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Code window over image**: Full-bleed warm landscape photograph. Overlaid code window with #191918 background, 2px radius, positioned center-left. Three small traffic-light dots (8px) in top-left. Code in 12px JetBrains Mono, keywords in #fcaa2d, strings in #edece0, comments in #75756f. No shadow on the window — it sits flat on the image.

3. **FAQ accordion row**: Full-width row on #fffef2 background, 20px 40px padding, 1px #000000 bottom border. Question text left-aligned in 18px Parabole #191918. '+' icon right-aligned in 20px #191918. No background change on hover.

4. **Feature list item**: Text left-aligned in 18px Parabole #191918, with a 2px-wide #fcaa2d vertical bar on the left edge running the full height of the text. 20px 40px padding. 1px #000000 bottom border separating items in the list.

5. **Section header with accent word**: Display headline at 40px Parabole #191918 left-aligned, where one word is colored #fcaa2d. Same size and weight — the color switch alone creates the emphasis. Subtext below at 18px #75756f.

## Similar Brands

- **Anthropic** — Same warm cream backgrounds, editorial left-aligned headlines, and rationed single-color accent strategy against a muted neutral canvas
- **Linear** — Same sharp 2px radii, hairline-border separation, and monochrome-first approach with a single vivid accent reserved for action
- **Vercel** — Same geometric sans typography with tight tracking at display sizes, monospace for UI chrome, and flat no-shadow design language
- **Stripe** — Same left-aligned editorial layout flow, generous whitespace between sections, and confident typographic hierarchy as the primary visual tool

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-page-cream: #fffef2;
  --color-ink-black: #191918;
  --color-rule-black: #000000;
  --color-warm-stone: #75756f;
  --color-linen-beige: #edece0;
  --color-ash-gray: #bab9b0;
  --color-amber-signal: #fcaa2d;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-parabole-trial: 'Parabole Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-decima-mono-pro: 'Decima Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-parabole-trial-regular-text: 'Parabole Trial Regular Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-parabole-trial-regular-display: 'Parabole Trial Regular Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-mono-xs: 10px;
  --leading-mono-xs: 1.2;
  --tracking-mono-xs: 0.4px;
  --text-mono-sm: 12px;
  --leading-mono-sm: 1.2;
  --tracking-mono-sm: 0.36px;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.42px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.64px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.72px;
  --text-subheading: 20px;
  --leading-subheading: 1.06;
  --tracking-subheading: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -1.8px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -3.2px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-60px;
  --card-padding: 20-40px;
  --element-gap: 8-20px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 800px;

  /* Named Radii */
  --radius-cards: 2px;
  --radius-icons: 800px;
  --radius-badges: 800px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-canvas: #fffef2;
  --surface-linen: #edece0;
  --surface-ink: #191918;
  --surface-amber: #fcaa2d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-page-cream: #fffef2;
  --color-ink-black: #191918;
  --color-rule-black: #000000;
  --color-warm-stone: #75756f;
  --color-linen-beige: #edece0;
  --color-ash-gray: #bab9b0;
  --color-amber-signal: #fcaa2d;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-parabole-trial: 'Parabole Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-decima-mono-pro: 'Decima Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-parabole-trial-regular-text: 'Parabole Trial Regular Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-parabole-trial-regular-display: 'Parabole Trial Regular Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-mono-xs: 10px;
  --leading-mono-xs: 1.2;
  --tracking-mono-xs: 0.4px;
  --text-mono-sm: 12px;
  --leading-mono-sm: 1.2;
  --tracking-mono-sm: 0.36px;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.42px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.64px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.72px;
  --text-subheading: 20px;
  --leading-subheading: 1.06;
  --tracking-subheading: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -1.8px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -3.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 800px;
}
```
