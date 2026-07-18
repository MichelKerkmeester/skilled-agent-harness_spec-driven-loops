# Dennis Snellenberg — Style Reference
> Dark editorial canvas with giant quiet headlines

**Theme:** dark

A dark editorial portfolio language built on a near-black canvas where the only color that matters is a single vivid violet. The entire interface collapses to two tones — #1c1d20 for the world, #ffffff for everything written — with a custom sans-serif at a fixed medium weight doing all the talking. Typography is the protagonist: a 216px display name bleeds off the page edge, while 12–15px body copy floats beside full-bleed photography. Violet appears as rare punctuation on cards and link fills, never as decoration. Components are flat, borderless, and large — rounded pills replace buttons, and a single 1px inset white ring is the only shadow language in the system.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Canvas | `#1c1d20` | `--color-obsidian-canvas` | Page background, card surfaces, text on light surfaces, hairline borders — the near-black that owns 95% of the interface |
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, inverted card surfaces, link text on violet, subtle inset borders — the only light tone in the system |
| Fog | `#999d9e` | `--color-fog` | Muted secondary text, captions, metadata — sits between the canvas and white in the neutral scale |
| Graphite | `#494a4d` | `--color-graphite` | Elevated surface layer above the canvas, soft card backgrounds, link hover glow — adds a half-step of depth without breaking the monochrome read |
| Electric Iris | `#455ce9` | `--color-electric-iris` | Accent card fills, link/button backgrounds, active state highlights — the one chromatic voice; its vividness is amplified by 99% achromatic surroundings |
| Deep Iris | `#334bd3` | `--color-deep-iris` | Secondary accent surface, deeper violet card variant — used when the primary iris needs a stepped companion for layered cards or gradient-feeling stacks |

## Tokens — Typography

### Dennis Sans — Single-family system. Weight 450 is non-standard — not light, not bold, sits in the medium range to feel editorial rather than corporate. Uniform 0.0500em letter-spacing across all sizes creates a distinctive mechanical rhythm. Display sizes (60–216px) use tight line-height (1.00–1.07) so headlines touch or nearly touch; body sizes (14–17px) open up to 1.40–1.66 for readability. The 216px hero name is the signature element — it dwarfs everything else and bleeds off-canvas as intent. · `--font-dennis-sans`
- **Substitute:** Inter (weight 500) or Untitled Sans
- **Weights:** 450
- **Sizes:** 10, 12, 14, 15, 17, 33, 60, 76, 88, 216px
- **Line height:** 1.00–1.66 (display 1.00–1.07, body 1.40–1.66)
- **Letter spacing:** 0.0500em across all sizes
- **Role:** Single-family system. Weight 450 is non-standard — not light, not bold, sits in the medium range to feel editorial rather than corporate. Uniform 0.0500em letter-spacing across all sizes creates a distinctive mechanical rhythm. Display sizes (60–216px) use tight line-height (1.00–1.07) so headlines touch or nearly touch; body sizes (14–17px) open up to 1.40–1.66 for readability. The 216px hero name is the signature element — it dwarfs everything else and bleeds off-canvas as intent.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.45 | 0.5px | `--text-caption` |
| body-lg | 15px | 1.66 | 0.75px | `--text-body-lg` |
| heading-sm | 33px | 1.2 | 1.65px | `--text-heading-sm` |
| heading | 60px | 1.07 | 3px | `--text-heading` |
| heading-lg | 88px | 1.06 | 4.4px | `--text-heading-lg` |
| display | 216px | 1 | 10.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 22 | 22px | `--spacing-22` |
| 43 | 43px | `--spacing-43` |
| 54 | 54px | `--spacing-54` |
| 58 | 58px | `--spacing-58` |
| 63 | 63px | `--spacing-63` |
| 115 | 115px | `--spacing-115` |
| 189 | 189px | `--spacing-189` |
| 230 | 230px | `--spacing-230` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| links | 36.72px |
| badges | 36.72px |
| buttons | 36.72px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Section gap:** 120-160px
- **Card padding:** 18-22px
- **Element gap:** 12px

## Components

### Full-Bleed Hero
**Role:** Opening viewport with photography and massive name

Edge-to-edge image (no radius, no border) on Obsidian Canvas background. Name set in Dennis Sans 216px / 1.00 line-height / letter-spacing 10.8px, color #ffffff, positioned bottom-left and intentionally bleeding off the canvas edge. No buttons in the hero — navigation is top-bar only.

### Top Navigation Bar
**Role:** Minimal site navigation

Absolute-positioned over hero. Logo '© Code by Dennis' in 12px #ffffff at top-left (12px from edges). Nav items (Work, About, Contact) in 12px #ffffff at top-right, 32px gap between items. No backgrounds, no borders, no underlines — text floats directly on the photograph.

### Location Pill Badge
**Role:** Geographic metadata indicator

36.72px radius pill, 18px vertical / 22px horizontal padding, background #1c1d20 (or transparent over image). White globe icon on the right, 'Located in the Netherlands' text in 12px #ffffff stacked in three lines at 1.20 line-height on the left. Feels like a floating tag, not a button.

### Pill Link / Button
**Role:** Primary interactive element across the system

36.72px border-radius (fully pill-shaped). Padding 12px 22px. Background #1c1d20 or #455ce9 depending on variant. Text 14px Dennis Sans 450 #ffffff or #1c1d20. Optional inset border: rgba(255,255,255,0.2) 0 0 0 1px inset for subtle definition. No drop shadow, no hover lift — state changes happen via background swap only.

### Violet Accent Card
**Role:** Featured or category card

10px border-radius, background #455ce9, padding 22px. White text at 17–33px. Used to break the monochrome grid with a single chromatic block — never more than 1–2 per page.

### Graphite Card
**Role:** Standard elevated card on dark canvas

10px border-radius, background #494a4d, padding 18–22px. White text at 14–17px. Sits half a step above the canvas to create quiet layering without shadows.

### Arrow Indicator
**Role:** Directional or scroll cue

Thin 1px white SVG arrow (↘) with no container. Often paired with adjacent body text like 'Freelance Designer & Developer' in 15px #ffffff. The arrow carries the interactive meaning; the text is purely descriptive.

### Section Headline Block
**Role:** Large typographic section opener

Dennis Sans 60–88px / line-height 1.06–1.07 / letter-spacing 3–4.4px, color #ffffff. Aligned left, sits directly on Obsidian Canvas with no eyebrow label, no underline, no container — type alone defines the section.

### Inset-Border Link
**Role:** Text link with subtle focus ring

Pill-shaped (36.72px) text container with 1px inset white border at 20% opacity. Text in 14px #ffffff. The inset border is the entire depth system — no drop shadows exist in this design language.

### Metadata Caption
**Role:** Helper text, labels, small annotations

10–12px Dennis Sans 450 in #999d9e. Letter-spacing 0.5–0.6px. Used for project dates, categories, footnote-style info. Never colored — always sits in the neutral gray range.

## Do's and Don'ts

### Do
- Use Dennis Sans at weight 450 exclusively — never bold, never light; the single weight is the system
- Set letter-spacing to 0.0500em on every text element including body copy; the uniform tracking is signature
- Use #1c1d20 as the canvas for every page; other surfaces (#494a4d, #455ce9) are exceptions, not the rule
- Set all interactive elements (links, buttons, badges) to 36.72px border-radius for full pill shape
- Use the 1px inset white border at 20% opacity as the only elevation technique — no drop shadows
- Let display headlines (88–216px) bleed off the canvas edge for editorial tension
- Reserve #455ce9 for one accent element per viewport — the violet is punctuation, not decoration

### Don't
- Don't introduce additional weights (400, 600, 700) — the single-weight system is intentional and fragile
- Don't add drop shadows or multi-layer elevation; the inset border is the entire depth vocabulary
- Don't use #455ce9 on more than one element per section — overuse dilutes the accent's impact
- Don't use sharp corners (0–4px radius) on interactive elements; the pill shape is the signature
- Don't introduce new chromatic colors — the palette is monochrome plus one violet, period
- Don't center-align body copy or long-form text; left-align everything to preserve the editorial gravity
- Don't use line-height above 1.07 on display sizes (60px+); tight leading is what makes the type feel monolithic

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#1c1d20` | Page background — the default ground for every screen |
| 2 | Graphite | `#494a4d` | Elevated surface for cards, badges, and secondary panels |
| 3 | Deep Iris | `#334bd3` | Accent surface for featured or category cards |
| 4 | Electric Iris | `#455ce9` | Top accent surface for CTA cards and interactive link fills |

## Elevation

- **Inset-Border Link:** `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset`

## Imagery

Full-bleed editorial photography dominates the visual language. Images are high-resolution portraits or environmental shots with natural lighting and minimal color grading — they sit directly on the Obsidian canvas without frames, masks, or rounded corners. Photography is the only color source beyond the violet accent; everything else is monochrome. No illustrations, no 3D, no abstract graphics. The subject of the photograph is the hero — not a product, not a UI mockup, a person or place rendered at human scale.

## Layout

Full-bleed pages with no max-width container — the canvas extends edge to edge. Hero is a single viewport: full-bleed photograph with navigation floating at top corners, a location badge anchored mid-left, and a 216px name bleeding off the bottom-left edge. Content sections below follow a left-aligned single-column rhythm with generous vertical gaps (120–160px between sections). Cards and content blocks use 10px radius and sit on the dark canvas with no visible boundaries — they are defined by surface color step alone. The grid is implicit, not drawn: elements anchor to the left edge with 12px gutters, creating a strong left-gravity editorial flow.

## Agent Prompt Guide

Quick Color Reference:
- canvas: #1c1d20
- text: #ffffff
- muted text: #999d9e
- elevated surface: #494a4d
- accent card: #455ce9
- primary action: no distinct CTA color

Example Component Prompts:

1. Hero section: Obsidian Canvas (#1c1d20) background, full-bleed photograph overlaid. Top-left: '© Code by Dennis' in 12px Dennis Sans 450 #ffffff, 12px from edges. Top-right nav: 'Work  About  Contact' in 12px #ffffff, 32px gaps. Bottom-left: display name in 88–216px Dennis Sans 450, #ffffff, letter-spacing 10.8px, line-height 1.00, intentionally bleeding off the left canvas edge.

2. Location pill badge: 36.72px radius, 18px 22px padding, background #1c1d20, white globe icon (1px stroke) on the right, 'Located in the Netherlands' text stacked in 3 lines at 12px #ffffff line-height 1.20 on the left. Floats over the hero image with no border.

3. Violet accent card: 10px radius, background #455ce9, 22px padding on all sides, content text in 17px Dennis Sans 450 #ffffff, line-height 1.40. One per viewport maximum.

4. Inset-border link: 36.72px radius pill, background #1c1d20, 12px 22px padding, 1px inset border rgba(255,255,255,0.2), text in 14px Dennis Sans 450 #ffffff with 0.7px letter-spacing. The inset border is the only depth indicator.

5. Section headline: Dennis Sans 60px, weight 450, #ffffff, line-height 1.07, letter-spacing 3px, left-aligned directly on Obsidian Canvas with no eyebrow, no underline, no container. 120–160px vertical gap above.

## Similar Brands

- **Cody Lindquist** — Same full-bleed dark photography hero, massive single-weight display name bleeding off canvas, monochrome canvas with one chromatic accent
- **Rauno Freiberg** — Identical editorial portfolio grammar — dark canvas, oversized name as hero element, minimal nav, single-weight custom sans-serif
- **Tobias van Schneider** — Same restraint philosophy: near-black background, full-bleed imagery, large confident type, violet/blue accent used as rare punctuation
- **Basement Studio** — Dark-mode portfolio with full-bleed photography, pill-shaped interactive elements, and a single accent color against monochrome surroundings

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-canvas: #1c1d20;
  --color-bone-white: #ffffff;
  --color-fog: #999d9e;
  --color-graphite: #494a4d;
  --color-electric-iris: #455ce9;
  --color-deep-iris: #334bd3;

  /* Typography — Font Families */
  --font-dennis-sans: 'Dennis Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.45;
  --tracking-caption: 0.5px;
  --text-body-lg: 15px;
  --leading-body-lg: 1.66;
  --tracking-body-lg: 0.75px;
  --text-heading-sm: 33px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 1.65px;
  --text-heading: 60px;
  --leading-heading: 1.07;
  --tracking-heading: 3px;
  --text-heading-lg: 88px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: 4.4px;
  --text-display: 216px;
  --leading-display: 1;
  --tracking-display: 10.8px;

  /* Typography — Weights */
  --font-weight-w450: 450;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-43: 43px;
  --spacing-54: 54px;
  --spacing-58: 58px;
  --spacing-63: 63px;
  --spacing-115: 115px;
  --spacing-189: 189px;
  --spacing-230: 230px;

  /* Layout */
  --section-gap: 120-160px;
  --card-padding: 18-22px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 36.72px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-links: 36.72px;
  --radius-badges: 36.72px;
  --radius-buttons: 36.72px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-obsidian-canvas: #1c1d20;
  --surface-graphite: #494a4d;
  --surface-deep-iris: #334bd3;
  --surface-electric-iris: #455ce9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-canvas: #1c1d20;
  --color-bone-white: #ffffff;
  --color-fog: #999d9e;
  --color-graphite: #494a4d;
  --color-electric-iris: #455ce9;
  --color-deep-iris: #334bd3;

  /* Typography */
  --font-dennis-sans: 'Dennis Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.45;
  --tracking-caption: 0.5px;
  --text-body-lg: 15px;
  --leading-body-lg: 1.66;
  --tracking-body-lg: 0.75px;
  --text-heading-sm: 33px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 1.65px;
  --text-heading: 60px;
  --leading-heading: 1.07;
  --tracking-heading: 3px;
  --text-heading-lg: 88px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: 4.4px;
  --text-display: 216px;
  --leading-display: 1;
  --tracking-display: 10.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-43: 43px;
  --spacing-54: 54px;
  --spacing-58: 58px;
  --spacing-63: 63px;
  --spacing-115: 115px;
  --spacing-189: 189px;
  --spacing-230: 230px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 36.72px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset;
}
```
