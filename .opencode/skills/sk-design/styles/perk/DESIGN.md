# Perk — Style Reference
> electric lime on warm parchment paper

**Theme:** light

Perk operates as an electric yellow command center on warm off-white paper — a travel platform that treats every screen like a piece of editorial product design. The dominant lime accent (#beff50) charges through an otherwise quiet achromatic palette of near-black ink (#14140f) and parchment cream (#f5f5eb), creating a brand presence that feels activated rather than decorated. Typography is single-source: OTSono carries every voice from 90px display headlines down to 10px micro-labels, weight 500 for emphasis moments, weight 400 for body, with tight tracking at scale (-0.03em) and a generous all-caps tracking (0.1em) reserved for tiny eyebrow labels. Surfaces stack in soft radii — 28px for cards and primary buttons, 9999px for pills and tags — and the system avoids elevation entirely, relying on tonal contrast and generous whitespace to separate layers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Lime | `#beff50` | `--color-electric-lime` | Primary action background, hero surface fills, accent panels — the singular chromatic charge against an otherwise achromatic system, creating brand presence through contrast not decoration |
| Off-Black Ink | `#14140f` | `--color-off-black-ink` | Body text, headings, icon fills, link borders, button text — warm-tinted near-black that feels less clinical than pure black against parchment |
| Off-White Canvas | `#f5f5eb` | `--color-off-white-canvas` | Card surfaces, secondary page background — warm parchment replacing cold white as the resting surface for the lime accent |
| Pure White | `#ffffff` | `--color-pure-white` | Highest surface level, card fills, input fields — used where clean white needs to lift above the parchment |
| Ash | `#d2d2c8` | `--color-ash` | Borders, dividers, subtle structural lines, inactive backgrounds — the warm gray that separates surfaces without harshness |
| Graphite | `#6e6e64` | `--color-graphite` | Muted body text, secondary copy, card text — warm gray for de-emphasized information |
| Deep Charcoal | `#30302a` | `--color-deep-charcoal` | Dark card surfaces, inverted blocks — for rare moments when the page flips to a dark island |
| Stone | `#919183` | `--color-stone` | Faint borders, decorative strokes — only visible at fine stroke widths |
| Smoke | `#b9b9b7` | `--color-smoke` | Placeholder backgrounds, subtle wash zones |

## Tokens — Typography

### OTSono — Single-family system covering everything from 90px display headlines (weight 500, line-height 0.89, tracking -0.03em) through 16px body (weight 400, line-height 1.5) to 10px micro-labels. Weight 500 is the emphasis voice used on headings, labels, and CTAs; weight 400 handles body, icons, and supporting text. The 0.1em tracking on small caps is reserved for eyebrow labels and category tags. · `--font-otsono`
- **Substitute:** Inter, system-ui sans-serif
- **Weights:** 400, 500
- **Sizes:** 10, 12, 14, 16, 17, 18, 20, 22, 24, 28, 32, 40, 60, 80, 90, 200
- **Line height:** 0.83–1.50
- **Letter spacing:** -0.03em at 28px and above, normal at body sizes, 0.1em on all-caps micro-labels
- **Role:** Single-family system covering everything from 90px display headlines (weight 500, line-height 0.89, tracking -0.03em) through 16px body (weight 400, line-height 1.5) to 10px micro-labels. Weight 500 is the emphasis voice used on headings, labels, and CTAs; weight 400 handles body, icons, and supporting text. The 0.1em tracking on small caps is reserved for eyebrow labels and category tags.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 10px | 1.4 | 1px | `--text-eyebrow` |
| caption | 12px | 1.33 | 1.2px | `--text-caption` |
| body-sm | 14px | 1.29 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 22px | 1.18 | — | `--text-subheading` |
| heading | 28px | 1.14 | -0.56px | `--text-heading` |
| heading-lg | 60px | 1 | -1.8px | `--text-heading-lg` |
| display | 90px | 0.89 | -2.7px | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 220 | 220px | `--spacing-220` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 28px |
| inner | 18px |
| pills | 9999px |
| inputs | 8px |
| buttons | 28px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-48px
- **Element gap:** 16-24px

## Components

### Primary Action Button (Lime Pill)
**Role:** Filled CTA on warm-white backgrounds

Background #beff50, text #14140f, radius 28px, padding 16px top/bottom × 16px left × 12px right. Weight 500, 16px OTSono. This is the only filled button in the system — the electric lime against off-white is the singular action signal.

### Ghost Text Button
**Role:** Inline navigation and secondary actions

Transparent background, text #14140f or #6e6e64, no border, radius 9999px or 0px. Weight 500 at 14px, weight 400 at 16px. Used for nav items, inline links, and tertiary actions where the lime CTA is already present.

### Underline Link
**Role:** In-content navigation and emphasis links

Transparent background, text inherits body color, bottom border 1px in #14140f or #ffffff. Weight 400–500, 14–16px. The underline is the affordance — no color change, no fill.

### Parallax Card
**Role:** Product feature card on parchment surface

Background #f5f5eb (warm parchment), radius 28px, padding 32–48px, no shadow. Text in #14140f with supporting copy in #6e6e64. The card sits on a white page, lifted by tonal contrast alone.

### White Surface Card
**Role:** Elevated content card or form container

Background #ffffff, radius 28px, padding 32–48px. Used when content needs to lift above parchment backgrounds — provides a cooler, cleaner reading surface.

### Dark Island Card
**Role:** Inverted feature block

Background #30302a (deep charcoal), radius 28px, text in white/cream. Rare usage — creates a dark moment in the otherwise light system, typically for testimonials or hero stats.

### Lime Accent Block
**Role:** Hero band or feature highlight surface

Full-bleed or large-area background fill in #beff50. No border, no shadow. Hosts display typography and imagery. The lime IS the background — no other chrome needed.

### Inline Label Tag
**Role:** Category eyebrow or status pill

Background transparent or #f5f5eb, text #14140f, weight 500, 12px OTSono, text-transform uppercase, letter-spacing 0.1em. Radius 9999px for pill form or 0px for inline. Sits above headings as a category marker.

### Input Field
**Role:** Form text input

Background #ffffff, text #000000, border 1px solid #d2d2c8, radius 0–8px. Weight 400, 16px OTSono. Minimal chrome — the border IS the affordance.

### Section Divider
**Role:** Horizontal structural separator

1px solid line in #d2d2c8. The system uses rules, not whitespace alone, to mark section boundaries. Full-width within container.

### Icon Container
**Role:** Feature icon or category indicator

16–24px OTSono glyph, color #14140f or accent, no background. Icons are typographic, not illustrated — weight 400 OTSono characters serve as the icon set.

### Logo Mark
**Role:** Brand identity lockup

OTSono wordmark "Perk" in #14140f, positioned top-left of header. Clean, single-weight — no separate logomark needed.

## Do's and Don'ts

### Do
- Use #beff50 as the ONLY filled button color — never introduce a second chromatic action color
- Set border-radius to 28px on all cards and primary buttons, 9999px on pills and tags
- Use OTSono weight 500 for all headings, labels, and CTAs; weight 400 for body and supporting text
- Apply letter-spacing -0.03em to any text at 28px and above; let body text use default tracking
- Build the surface stack as white → parchment (#f5f5eb) → lime (#beff50) — never use shadows to separate layers
- Use 0.1em tracking with uppercase for category eyebrows at 10–12px
- Let the off-black #14140f carry all text — never use pure #000000 except in input fields
- Keep section gaps between 80–120px to maintain the editorial breathing rhythm

### Don't
- Do not add box-shadows to cards — the system relies on tonal contrast, not elevation
- Do not use #000000 for body text — #14140f is warmer and more on-brand
- Do not introduce blue, red, or any secondary accent color — the lime is the only chromatic voice
- Do not mix border-radius values within the same component type (all buttons are 28px, all pills are 9999px)
- Do not use system fonts as fallback for display sizes — OTSono at 60px+ with -0.03em tracking is signature
- Do not place lime buttons on white surfaces without sufficient padding — the contrast is loud, give it room
- Do not use 600 or 700 weights — the system operates on 400 and 500 only
- Do not add gradients — the lime is already saturated; gradients would muddy it

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background — the clean white base |
| 1 | Off-White Card | `#f5f5eb` | Warm parchment surface for feature cards, secondary blocks, and content containers |
| 2 | Lime Accent Surface | `#beff50` | Hero bands, accent panels, and primary action backgrounds — the electric ground |
| 3 | Dark Island | `#30302a` | Rare inverted blocks for testimonials or stats — breaks the light monotony |

## Elevation

No shadows. The design separates layers through tonal contrast alone — white canvas → parchment card → lime accent → dark island. Elevation is communicated by surface color shifts, not drop shadows. This keeps the system feeling flat, editorial, and fast.

## Imagery

Photography and product screenshots are treated as editorial inserts — full-bleed or contained within the 28px-radius cards, always on warm parchment or white surfaces. Imagery is not decorative atmosphere; it serves explanatory content (product UI, travel context). No lifestyle photography, no overlapping compositions. Icons are typographic OTSono glyphs at 16–24px, monochromatic in #14140f. The lime color does not appear in imagery — it is reserved exclusively for UI surfaces and actions.

## Layout

Max-width ~1200px centered container with generous outer padding. Hero pattern is large display typography (60–90px) on a parchment or lime background, often paired with a product screenshot or illustration to the right. Sections alternate between white and parchment (#f5f5eb) backgrounds, creating gentle tonal bands. Content arrangement is mixed: full-width display headlines, 2-column text+image splits, and 3-column feature grids at 28px radii. Vertical rhythm is spacious — 80–120px between sections. Navigation is a single top bar with ghost text links and a lime pill CTA anchored right. Footer is dark (#14140f) with white text, providing the only inverted moment at page bottom.

## Agent Prompt Guide

Quick Color Reference:
- Text: #14140f
- Background (canvas): #ffffff
- Background (card/surface): #f5f5eb
- Border/divider: #d2d2c8
- Accent surface: #beff50
- primary action: #beff50 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #beff50 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a feature card grid: 3 columns on white canvas. Each card: background #ffffff, border-radius 28px, padding 40px, no shadow. Category eyebrow label at 12px OTSono weight 500, uppercase, letter-spacing 0.1em, color #6e6e64. Card title at 28px OTSono weight 500, color #14140f, letter-spacing -0.02em. Body text at 16px OTSono weight 400, color #6e6e64.

3. Create a lime accent panel: full-bleed #beff50 background, generous padding (80px vertical). Centered display text at 80px OTSono weight 500, color #14140f, letter-spacing -0.03em, line-height 0.9. Below: ghost text button (transparent background, #14140f text, 1px underline border).


5. Create a dark footer section: background #14140f, padding 80px. Multi-column layout with link lists. All text in #f5f5eb at 14px OTSono weight 400. Section headers at 12px uppercase, letter-spacing 0.1em, weight 500, color #d2d2c8.

## Type System Notes

OTSono is the sole typeface. The system uses only two weights: 400 (body, icons, supporting text) and 500 (headings, labels, CTAs). Line-height tightens dramatically at display sizes — 0.83 to 0.90 for 60px+ headings — while body text sits at a relaxed 1.5. Letter-spacing follows the same pattern: -0.03em on display text (28px and above), default tracking on body, and +0.1em reserved exclusively for uppercase micro-labels at 10–12px. There is no italic, no condensed variant, and no separate display face. The restraint is the signature — a single geometric sans carrying every voice in the system.

## Similar Brands

- **Linear** — Same single-accent strategy — one vivid chromatic color against an otherwise restrained neutral palette, with pill-shaped controls and tight typographic tracking
- **Arc browser** — Similar electric-saturated accent color on warm neutral surfaces, editorial card layouts with large radii, minimal shadows
- **Cash App** — Bold single-accent brand color against clean white/off-white, oversized display typography with tight tracking, playful geometric sans throughout
- **Vercel** — Minimal geometric sans typeface, generous whitespace, rounded card surfaces, single accent for action moments
- **Loom** — Warm off-white surfaces replacing cold grays, large display type, pill-shaped CTAs, flat hierarchy without shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-lime: #beff50;
  --color-off-black-ink: #14140f;
  --color-off-white-canvas: #f5f5eb;
  --color-pure-white: #ffffff;
  --color-ash: #d2d2c8;
  --color-graphite: #6e6e64;
  --color-deep-charcoal: #30302a;
  --color-stone: #919183;
  --color-smoke: #b9b9b7;

  /* Typography — Font Families */
  --font-otsono: 'OTSono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 1px;
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.18;
  --text-heading: 28px;
  --leading-heading: 1.14;
  --tracking-heading: -0.56px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.8px;
  --text-display: 90px;
  --leading-display: 0.89;
  --tracking-display: -2.7px;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-220: 220px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32-48px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 28px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 28px;
  --radius-inner: 18px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 28px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-off-white-card: #f5f5eb;
  --surface-lime-accent-surface: #beff50;
  --surface-dark-island: #30302a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-lime: #beff50;
  --color-off-black-ink: #14140f;
  --color-off-white-canvas: #f5f5eb;
  --color-pure-white: #ffffff;
  --color-ash: #d2d2c8;
  --color-graphite: #6e6e64;
  --color-deep-charcoal: #30302a;
  --color-stone: #919183;
  --color-smoke: #b9b9b7;

  /* Typography */
  --font-otsono: 'OTSono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 1px;
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.18;
  --text-heading: 28px;
  --leading-heading: 1.14;
  --tracking-heading: -0.56px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.8px;
  --text-display: 90px;
  --leading-display: 0.89;
  --tracking-display: -2.7px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-220: 220px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 28px;
  --radius-full: 9999px;
}
```
