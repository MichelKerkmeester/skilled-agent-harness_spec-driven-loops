---
title: Supabase Style Reference Example
description: Gold-standard dark v3 Style Reference example for studying measured Supabase design tokens, typography, surfaces, and component prose.
trigger_phrases:
  - Supabase DESIGN.md example
  - dark developer style reference example
  - study Supabase design tokens
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Supabase — Style Reference
> Postgres infrastructure rendered in near-black — one Voltage green threading an achromatic developer canvas.

**Theme:** dark

The canvas is a near-black field — `#171717` cards and `#0f0f0f` footers layered against true `#000000`, with Snow (`#fafafa`) carrying nearly all text at 17:1 contrast or higher. Colour is rationed hard: a single Voltage green (`#3ecf8e`) is the only chromatic signal across an otherwise achromatic ramp of grays, from Slate (`#898989`) body text down through Graphite (`#4d4d4d`) and Obsidian (`#2e2e2e`) borders. Two typefaces split the work — Circular sets every heading and body run from 12px to a 72px hero, while Source Code Pro is reserved for numerics and uppercase tier labels (`$0`, `FREE`, `PRO`). Spacing rides a strict 4px base unit through a 14-step scale, and the page runs full-bleed at 100% width. Pill radii (`9999px`) and 6px controls do the shaping; depth is mostly carried by tonal contrast rather than shadow.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#2e2e2e` | `--color-obsidian` | borders, gradients, backgrounds — a deep near-black |
| Snow | `#fafafa` | `--color-snow` | text, borders, backgrounds — a near-white |
| Slate | `#898989` | `--color-slate` | text, borders, backgrounds — a mid gray |
| Graphite | `#4d4d4d` | `--color-graphite` | text, borders — a dark gray |
| Steel | `#b4b4b4` | `--color-steel` | text, borders, backgrounds — a light gray |
| Graphite 2 | `#393939` | `--color-graphite-2` | borders, text, backgrounds — a dark gray |
| Obsidian 2 | `#171717` | `--color-obsidian-2` | backgrounds, text, gradients — a deep near-black |
| Voltage | `#3ecf8e` | `--color-voltage` | borders, text, backgrounds — a green |
| Ink | `#000000` | `--color-ink` | backgrounds — a near-black |
| Obsidian 3 | `#242424` | `--color-obsidian-3` | borders, backgrounds, text — a deep near-black |
| Deep Voltage | `#006239` | `--color-deep-voltage` | backgrounds — a deep green |
| Ink 2 | `#0f0f0f` | `--color-ink-2` | backgrounds — a near-black |
| Voltage 2 | `#00c573` | `--color-voltage-2` | text, borders — a green |
| Voltage 3 | `#85e0ba` | `--color-voltage-3` | text, borders — a green |
| Ember | `#db8e00` | `--color-ember` | borders — a orange |
| Deep Voltage 2 | `#002918` | `--color-deep-voltage-2` | backgrounds — a deep green |
| Light Azure | `#93c5fd` | `--color-light-azure` | decorative use — a light blue |

## Tokens — Typography

Two families divide cleanly: Circular owns prose and headings, Source Code Pro owns figures and tier labels. Both run at weight 400 almost everywhere — hierarchy comes from size, not weight.

### Circular — Primary brand typeface, geometric sans-serif. Headings, body, navigation, and buttons. · `--font-circular`
- **Substitute:** Inter, system sans-serif
- **Weights:** 400, 500
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 72px
- **Line height:** 16px, 19.5px, 20px, 24px, 28px, 32px, 36px, 40px, 72px
- **Letter spacing:** normal, except -0.16px at the 24px body-paragraph level
- **Role:** Carries the 72px hero ("Build in a weekend / Scale to millions"), every heading, all body copy, and the 14px / weight 500 navigation and button labels.

### Source Code Pro — Monospace numerics and uppercase tier labels. · `--font-source-code-pro`
- **Substitute:** Fira Code, monospace
- **Weights:** 400, 500, 700
- **Sizes:** 11px, 12px, 18px, 20px, 24px, 36px, 48px
- **Letter spacing:** normal, except 0.66px at the 11px uppercase micro-label
- **Role:** Reserved for pricing figures (`$0`, `$25`, `$599`) and uppercase plan/section labels (`FREE`, `PRO`, `TEAM`, `CUSTOMER STORIES`). Several levels carry text-transform uppercase; the 11px / weight 500 / 0.66px-tracked micro-label ("Micro") is the smallest type in the system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 12.1px | 0.66px | `--text-caption` |
| body-sm | 12px | 16px | normal | `--text-body-sm` |
| body | 13px | 19.5px | normal | `--text-body` |
| body-lg | 14px | 20px | normal | `--text-body-lg` |
| subheading | 16px | 24px | normal | `--text-subheading` |
| heading-sm | 18px | 28px | normal | `--text-heading-sm` |
| heading | 20px | 28px | normal | `--text-heading` |
| heading-lg | 24px | 32px | -0.16px | `--text-heading-lg` |
| title | 30px | 36px | normal | `--text-title` |
| title-lg | 36px | 40px | normal | `--text-title-lg` |
| display | 48px | 48px | normal | `--text-display` |
| hero | 72px | 72px | normal | `--text-hero` |

The caption role (11px / 0.66px tracking, uppercase) and the display role (48px, used for the largest pricing figures) are both Source Code Pro; everything from body through hero is Circular. The -0.16px tracking appears only at the 24px body-paragraph level — every other level runs at normal tracking.

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** spacious

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| div | 9999px |
| div | 8px |
| button | 6px |
| div | 16px |
| div | 12px |
| div | 11px |
| div | 0px 0px 4px 4px |
| div | 4px |
| div | 12px 0px 0px 12px |
| div | 9px 9px 0px 0px |
| div | 0px 12px 12px 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| 1 | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px` | `--shadow-1` |
| 2 | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px` | `--shadow-2` |
| 3 | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px` | `--shadow-3` |
| 4 | `rgb(255, 255, 255) 0px 0px 0px 0px, rgba(147, 197, 253, 0.5) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px` | `--shadow-4` |

### Layout
- **Page max-width:** 100%

## Components

### Primary Button
**Role:** Default action — "Sign in", "Start your project". The most-used button in the system.

Background Obsidian 3 (`#242424`), text Snow (`#fafafa`), Circular weight 400 at 12px, border-radius 6px, padding 4px 10px, 1px solid dark-gray border. Transition 0.2s cubic-bezier(0, 0, 0.2, 1). No captured hover, focus, or active state.

### Secondary Button
**Role:** Comparison / alternative action — "Compare Plans".

Background Snow (`#fafafa`), near-black text, Circular weight 400 at 12px, border-radius 6px, padding 4px 10px, 1px solid Steel (`#b4b4b4`) border. Transition 0.2s cubic-bezier(0, 0, 0.2, 1). This is the only light-filled button — it inverts the canvas to read as the heavier call to action.

### Ghost Button
**Role:** Navigation triggers — "Product", "Developers", "Solutions".

Background transparent, text Snow (`#fafafa`), Circular weight 500 at 14px, border-radius 6px, padding 8px, 1px solid transparent border, box-shadow `--shadow-1` (a no-op transparent stack). Transition 0.2s cubic-bezier(0, 0, 0.2, 1). The button is defined by its label and padding, not by fill or border.

### Ghost Link
**Role:** Inline navigation and footer links — "Pricing", "Docs".

Background transparent, text Snow (`#fafafa`), Circular weight 400 at 16px, border-radius 0px, 0px padding. Transition: all. No captured hover or focus state.

### Card
**Role:** Feature and product cards — "Postgres Database", "Authentication", "Edge Functions".

Background Obsidian 2 (`#171717`), text Slate (`#898989`), Circular weight 400 at 16px, border-radius 11px, padding 24px 16px. Snow (`#fafafa`) at 17.18:1 carries the card title against the `#171717` fill; Slate body sits at 5.12:1. Transition: all. No border, no shadow — the card is a tonal step up from the page, not an elevated surface.

### Estimate Card
**Role:** Pricing summary panel — "Monthly estimate". The one bordered card variant.

Background transparent, text Steel (`#b4b4b4`), Circular weight 400 at 16px, border-radius 12px, padding 16px, 1px solid a dark-gray border. Transition: all. Where the feature Card is a filled tonal step, this variant is drawn with a visible 1px outline and no fill.

### Badge
**Role:** Pill marker — `9999px` fully-rounded chip.

Background Slate (`#898989`), Circular weight 400 at 16px, border-radius 9999px, 0px padding. Transition: all. The pill shape (`9999px`) is the defining property; it is the only place the maximum radius appears on an inline element.

### Input
**Role:** Form field — search and entry, on dark sections.

Background a near-transparent Snow wash (~2.7% opacity), text Snow (`#fafafa`), Circular weight 400 at 12px, border-radius 6px, padding 8px, 1px solid Graphite 2 (`#393939`) border. Transition: all. The field reads as a faint tonal lift off the canvas, framed by the `#393939` border.

### Footer
**Role:** Site footer block — link columns and the "We protect your data" panel.

Background Ink 2 (`#0f0f0f`), text Snow (`#fafafa`), Circular weight 400 at 16px, border-radius 0px, 0px padding. The footer drops a half-step darker than the `#171717` cards, anchoring the bottom of the page against true `#000000`.

## Do's and Don'ts

### Do
- Use Obsidian 2 (`#171717`) for cards and Ink 2 (`#0f0f0f`) for the footer — the two surfaces are one tonal step apart, which is how the page separates content from chrome.
- Use Snow (`#fafafa`) for nearly all text; it clears 17:1 against `#171717` and 20:1 against `#000000`.
- Ration Voltage (`#3ecf8e`) to interactive and brand accents only — it is the sole chromatic colour in the system.
- Use Slate (`#898989`) for secondary/body text inside cards, and Steel (`#b4b4b4`) for muted labels — both clear AA on the dark surfaces.
- Use Obsidian 3 (`#242424`) as the default button fill and 6px as the default control radius; reserve `9999px` for pill badges.
- Set Source Code Pro for every numeric and uppercase tier label (`$25`, `FREE`, `PRO`); set Circular for everything else.

### Don't
- Do not place Slate (`#898989`) text on the Obsidian (`#2e2e2e`) border colour expecting body contrast — it measures 3.88:1 and fails AA; keep Slate on `#171717` (5.12:1) or darker.
- Do not put Graphite (`#4d4d4d`) text on a transparent dark background — it measures 2.48:1 and fails AA; promote to Steel (`#b4b4b4`) or Slate for any reading text.
- Do not introduce a second accent colour — Voltage (`#3ecf8e`) and its ramp (`#00c573`, `#85e0ba`, `#006239`) are the only chromatic tokens; Ember (`#db8e00`) and Light Azure (`#93c5fd`) appear only as rare border and decorative one-offs.
- Do not give the feature Card a border or shadow — it is defined by an `#171717` fill and 11px radius alone; the bordered, no-fill treatment belongs to the Estimate Card only.
- Do not reach for the elevation shadow tokens (`--shadow-2`, `--shadow-3`) on flat surfaces — most components ship the no-op `--shadow-1` stack and lean on tonal contrast instead.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` | Full-bleed page background |
| 1 | Steel | `#b4b4b4` | Surface / panel |
| 2 | Slate | `#898989` | Surface / panel |
| 3 | Voltage | `#3ecf8e` | Surface / panel |

## Elevation

Four shadow tokens exist, but most components ship `--shadow-1` — a three-layer stack of fully transparent `rgba(0, 0, 0, 0)` values that renders no visible shadow. Real elevation is reserved for two stacks: `--shadow-2` (`rgba(0, 0, 0, 0.1) 0px 10px 15px -3px` over a `0px 4px 6px -4px` layer) for lifted panels, and `--shadow-3` (a tighter `0px 1px 3px` / `0px 1px 2px -1px` pair) for low-lift surfaces. The fourth, `--shadow-4`, carries a Light Azure (`rgba(147, 197, 253, 0.5)`) ring layer ahead of the same `--shadow-2` elevation — a focus-style glow. In practice depth is mostly tonal: `#171717` cards and `#0f0f0f` footers step against `#000000`, and the shadow tokens are the exception, not the system.

## Imagery

No structural imagery data was extracted beyond the icon and gradient signals. The icon system is Lucide (811 icons, fixed colour mode) on a 12px / 24px size scale. Five gradient treatments were measured, all decorative surface washes on `div` elements: an Obsidian (`#2e2e2e`)-to-transparent vertical fade and a left-to-right Obsidian band on cards, plus radial and linear top fades into the near-black canvas. These are tonal section treatments, not a depth or layering mechanism.

## Layout

Full-width fluid layout at 100% page max-width with full-width content alignment. Spacing rides a 4px base unit through a 14-step scale (4px to 128px), with section gaps drawn from a larger rhythm (48px, 64px, 80px, 96px, 112px, 128px and up to 464px for the widest breaks). Column grids range from single up to twelve columns. Breakpoints are min-width-first at 480px, 640px, 768px, 1024px, 1280px, and 1536px, with a handful of max-width overrides at 600px and 769px. The system honours `prefers-reduced-motion: reduce`. Motion is restrained: measured durations run 70ms, 180ms, 200ms, and 500ms on an `ease` / `cubic-bezier(.4,0,.2,1)` timing pair (one 180000ms marquee outlier aside).

## Agent Prompt Guide

### Quick Color Reference
- background (canvas): `#000000` (Ink), with `#171717` (Obsidian 2) cards and `#0f0f0f` (Ink 2) footer
- text (primary): `#fafafa` (Snow)
- text (secondary): `#898989` (Slate) / `#b4b4b4` (Steel)
- border (default): `#393939` (Graphite 2) / `#2e2e2e` (Obsidian)
- accent / primary action: `#3ecf8e` (Voltage) — the only chromatic colour

### Example Component Prompts

1. Create a primary button: background `#242424`, text `#fafafa`, Circular (Inter substitute) weight 400 at 12px, border-radius 6px, padding 4px 10px, 1px solid dark-gray border. Transition 0.2s cubic-bezier(0, 0, 0.2, 1). No hover/focus state. Example label "Start your project".

2. Create a secondary button: background `#fafafa`, near-black text, Circular weight 400 at 12px, border-radius 6px, padding 4px 10px, 1px solid `#b4b4b4` border. Transition 0.2s cubic-bezier(0, 0, 0.2, 1). Example label "Compare Plans".

3. Create a feature card on a dark page: background `#171717`, title in `#fafafa` and body in `#898989`, Circular weight 400 at 16px, border-radius 11px, padding 24px 16px. No border, no shadow. Example content "Postgres Database — every project is a full Postgres database".

4. Create a pricing figure block: numeral in Source Code Pro (Fira Code substitute) weight 400 at 48px, line-height 48px, color `#fafafa`, with an uppercase tier label in Source Code Pro at 20px, line-height 28px, letter-spacing normal, text-transform uppercase. Example "$25 / PRO".

5. Create a search input on a dark section: background a near-transparent white wash (~2.7% opacity), text `#fafafa`, Circular weight 400 at 12px, border-radius 6px, padding 8px, 1px solid `#393939` border. Transition: all.

## Similar Brands

- **Linear** — Achromatic near-black canvas with a single rationed accent, geometric sans-serif across every surface, and depth carried by tonal steps over heavy shadow.
- **Vercel** — Near-black developer-tool canvas, restrained gray ramp, one accent, and large geometric display type.
- **Railway** — Dark infrastructure aesthetic with a green-family accent on a gray ramp and monospace numerics for plan and usage figures.
- **PlanetScale** — Developer-database peer: dark surfaces, a constrained palette, and a single brand colour reserved for interactive elements.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #2e2e2e;
  --color-snow: #fafafa;
  --color-slate: #898989;
  --color-graphite: #4d4d4d;
  --color-steel: #b4b4b4;
  --color-graphite-2: #393939;
  --color-obsidian-2: #171717;
  --color-voltage: #3ecf8e;
  --color-ink: #000000;
  --color-obsidian-3: #242424;
  --color-deep-voltage: #006239;
  --color-ink-2: #0f0f0f;
  --color-voltage-2: #00c573;
  --color-voltage-3: #85e0ba;
  --color-ember: #db8e00;
  --color-deep-voltage-2: #002918;
  --color-light-azure: #93c5fd;
  /* Typography — Scale */
  --text-t0: 11px;
  --leading-t0: 12.1px;
  --text-t1: 12px;
  --leading-t1: 16px;
  --text-t2: 12px;
  --leading-t2: 16px;
  --text-t3: 12px;
  --leading-t3: 16px;
  --text-t4: 13px;
  --leading-t4: 19.5px;
  --text-t5: 14px;
  --leading-t5: 20px;
  --text-t6: 14px;
  --leading-t6: 20px;
  --text-t7: 16px;
  --leading-t7: 24px;
  --text-t8: 18px;
  --leading-t8: 28px;
  --text-t9: 18px;
  --leading-t9: 28px;
  --text-h3: 20px;
  --leading-h3: 28px;
  --text-t11: 24px;
  --leading-t11: 32px;
  --text-h3: 24px;
  --leading-h3: 32px;
  --text-h3: 24px;
  --leading-h3: 32px;
  --text-h2: 30px;
  --leading-h2: 36px;
  --text-t15: 36px;
  --leading-t15: 40px;
  --text-t16: 36px;
  --leading-t16: 40px;
  --text-t17: 48px;
  --leading-t17: 48px;
  --text-h1: 72px;
  --leading-h1: 72px;
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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  /* Layout */
  --page-max-width: 100%;
  /* Border Radius */
  --radius-div: 9999px;
  --radius-div: 8px;
  --radius-button: 6px;
  --radius-div: 16px;
  --radius-div: 12px;
  --radius-div: 11px;
  --radius-div: 0px 0px 4px 4px;
  --radius-div: 4px;
  --radius-div: 12px 0px 0px 12px;
  --radius-div: 9px 9px 0px 0px;
  --radius-div: 0px 12px 12px 0px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #2e2e2e;
  --color-snow: #fafafa;
  --color-slate: #898989;
  --color-graphite: #4d4d4d;
  --color-steel: #b4b4b4;
  --color-graphite-2: #393939;
  --color-obsidian-2: #171717;
  --color-voltage: #3ecf8e;
  --color-ink: #000000;
  --color-obsidian-3: #242424;
  --color-deep-voltage: #006239;
  --color-ink-2: #0f0f0f;
  --color-voltage-2: #00c573;
  --color-voltage-3: #85e0ba;
  --color-ember: #db8e00;
  --color-deep-voltage-2: #002918;
  --color-light-azure: #93c5fd;
  /* Typography — Scale */
  --text-t0: 11px;
  --leading-t0: 12.1px;
  --text-t1: 12px;
  --leading-t1: 16px;
  --text-t2: 12px;
  --leading-t2: 16px;
  --text-t3: 12px;
  --leading-t3: 16px;
  --text-t4: 13px;
  --leading-t4: 19.5px;
  --text-t5: 14px;
  --leading-t5: 20px;
  --text-t6: 14px;
  --leading-t6: 20px;
  --text-t7: 16px;
  --leading-t7: 24px;
  --text-t8: 18px;
  --leading-t8: 28px;
  --text-t9: 18px;
  --leading-t9: 28px;
  --text-h3: 20px;
  --leading-h3: 28px;
  --text-t11: 24px;
  --leading-t11: 32px;
  --text-h3: 24px;
  --leading-h3: 32px;
  --text-h3: 24px;
  --leading-h3: 32px;
  --text-h2: 30px;
  --leading-h2: 36px;
  --text-t15: 36px;
  --leading-t15: 40px;
  --text-t16: 36px;
  --leading-t16: 40px;
  --text-t17: 48px;
  --leading-t17: 48px;
  --text-h1: 72px;
  --leading-h1: 72px;
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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  /* Border Radius */
  --radius-div: 9999px;
  --radius-div: 8px;
  --radius-button: 6px;
  --radius-div: 16px;
  --radius-div: 12px;
  --radius-div: 11px;
  --radius-div: 0px 0px 4px 4px;
  --radius-div: 4px;
  --radius-div: 12px 0px 0px 12px;
  --radius-div: 9px 9px 0px 0px;
  --radius-div: 0px 12px 12px 0px;
}
```
