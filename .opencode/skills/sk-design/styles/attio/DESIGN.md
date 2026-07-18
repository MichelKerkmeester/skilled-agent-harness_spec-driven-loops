# Attio — Style Reference
> Architectural editorial on white marble

**Theme:** light

Attio uses an editorial SaaS language: near-white canvas, near-black type, and one vivid cobalt accent (#266df0) that does the talking while everything else stays quiet. The type stack is a deliberate three-voice system — Inter for UI, InterDisplay for marketing headlines at weight 600 with tight tracking, and TiemposText (serif) for testimonial/pull-quote moments that need warmth and human weight. Components feel light and precise: 7px and 12px radii, hairline borders, blue-tinted shadows at very low opacity, and ghost/outline buttons that defer to the primary filled dark action. Layout breathes — generous vertical rhythm with a 1440px max-width — but density is compact within cards and lists. The signature move is restraint: the same monochrome restraint you'd see in a financial publication, punctuated by exactly one chromatic moment per screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Page Canvas | `#ffffff` | `--color-page-canvas` | Primary page background, card surfaces, button backgrounds |
| Ink Black | `#1c1d1f` | `--color-ink-black` | Primary heading and body text, logo mark |
| Graphite | `#232529` | `--color-graphite` | Dark surface text, dark filled button background |
| Obsidian | `#101113` | `--color-obsidian` | Deepest text and dark surface fills |
| Carbon | `#2e3238` | `--color-carbon` | Secondary dark text, nav states, button text on light fills |
| Slate 500 | `#505967` | `--color-slate-500` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Slate 600 | `#6f7988` | `--color-slate-600` | Muted body text, secondary descriptions |
| Slate 700 | `#8f99a8` | `--color-slate-700` | Tertiary headings, captions, low-emphasis text |
| Fog 400 | `#9fa1a7` | `--color-fog-400` | Placeholder text, disabled states, subtle icons |
| Mist 300 | `#b5bdc9` | `--color-mist-300` | Muted body text, secondary copy |
| Cloud 200 | `#cad0d9` | `--color-cloud-200` | Hairline borders on cards, input borders, dividers |
| Cloud 100 | `#d3d8df` | `--color-cloud-100` | Card borders, surface boundaries |
| Mist 50 | `#e4e7ec` | `--color-mist-50` | Primary border color, dividers, subtle backgrounds, button borders |
| Haze | `#eeeff1` | `--color-haze` | Subtle background fills, section bands, inset borders |
| Paper | `#f4f5f6` | `--color-paper` | Alternate surface background, subtle elevated panels |
| Cobalt Core | `#266df0` | `--color-cobalt-core` | Primary brand accent — link text, focus rings, active states, highlighted icons, gradient midtone |
| Cobalt Bright | `#407ff2` | `--color-cobalt-bright` | Secondary accent, hover states, decorative strokes in illustrations |
| Cobalt Soft | `#538bf3` | `--color-cobalt-soft` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Periwinkle | `#bad0fa` | `--color-periwinkle` | Decorative card borders, subtle blue-tinted surface outlines |
| Ice Wash | `#e4edff` | `--color-ice-wash` | Soft blue-tinted background, highlight washes, button box-shadow tints |
| Onyx Footer | `#000000` | `--color-onyx-footer` | Footer background, dark section backgrounds, high-contrast text on light |

## Tokens — Typography

### Inter — UI body — used for all body text, buttons, nav, links, card content, footers, icons. Weight 500 is the default for nearly all UI text (buttons, nav, body), giving Attio a slightly heavier, more confident UI voice than typical 400-only systems. Activated 'ss03' alternates give the text a distinctive geometric character. · `--font-inter`
- **Substitute:** Inter (Google Fonts) — already a freely available open-source font, no substitute needed
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 11, 12, 13, 14, 15, 16, 18, 20, 32px
- **Line height:** 1.2–1.5
- **Letter spacing:** -0.02em at 14px, -0.01em at 16px, 0 at 12px
- **OpenType features:** `"ss03" on`
- **Role:** UI body — used for all body text, buttons, nav, links, card content, footers, icons. Weight 500 is the default for nearly all UI text (buttons, nav, body), giving Attio a slightly heavier, more confident UI voice than typical 400-only systems. Activated 'ss03' alternates give the text a distinctive geometric character.

### InterDisplay — Marketing headlines and display copy — weight 600 exclusively for large hero and section headings, with tight tracking (-0.015em to -0.02em) and near-1.0 line-heights creating dramatic, compact display blocks. The 56px size with -0.015em tracking is the signature hero voice. Activates 'ss03' and 'calt' for the same alternate character as Inter body. · `--font-interdisplay`
- **Substitute:** Inter Tight (Google Fonts) — same family tree, tighter default metrics
- **Weights:** 500, 600
- **Sizes:** 12, 19, 20, 32, 40, 56, 64px
- **Line height:** 1.0–1.2
- **Letter spacing:** -0.02em at 64px, -0.015em at 56px, -0.01em at 32-40px, -0.017em at 19px body display, 0.06em at 12px eyebrow
- **OpenType features:** `"ss03" on, "calt" on`
- **Role:** Marketing headlines and display copy — weight 600 exclusively for large hero and section headings, with tight tracking (-0.015em to -0.02em) and near-1.0 line-heights creating dramatic, compact display blocks. The 56px size with -0.015em tracking is the signature hero voice. Activates 'ss03' and 'calt' for the same alternate character as Inter body.

### TiemposText — Editorial pull-quote and testimonial headings — a humanist serif that breaks the sans-serif system to create warmth and editorial weight. Used sparingly for quoted customer voices. This serif/sans contrast is the single most distinctive typographic choice in the system. · `--font-tiempostext`
- **Substitute:** Source Serif 4 (Google Fonts) or Spectral (Google Fonts)
- **Weights:** 400, 500
- **Sizes:** 28, 40px
- **Line height:** 1.1–1.23
- **Letter spacing:** -0.015em at 28-40px
- **OpenType features:** `"ss03" on`
- **Role:** Editorial pull-quote and testimonial headings — a humanist serif that breaks the sans-serif system to create warmth and editorial weight. Used sparingly for quoted customer voices. This serif/sans contrast is the single most distinctive typographic choice in the system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.42 | -0.22px | `--text-caption` |
| body-lg | 16px | 1.38 | -0.16px | `--text-body-lg` |
| subheading | 20px | 1.3 | -0.2px | `--text-subheading` |
| heading-sm | 32px | 1.19 | -0.32px | `--text-heading-sm` |
| heading | 40px | 1.1 | -0.4px | `--text-heading` |
| heading-lg | 56px | 1.07 | -0.84px | `--text-heading-lg` |
| display | 64px | 1 | -1.28px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 10px |
| cards | 11-14px |
| badges | 7px |
| inputs | 10px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(238, 239, 241) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(28, 40, 64, 0.1) 0px 2px 3px -2px, rgba(28, 40, 64, ...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(28, 40, 64, 0.18) 0px 0px 2px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-subtle-3` |
| sm | `rgba(28, 40, 64, 0.06) 0px 2px 6px 0px, rgba(28, 40, 64, ...` | `--shadow-sm` |
| xl | `rgba(0, 0, 0, 0.04) 0px 12px 30px 0px` | `--shadow-xl` |
| subtle-4 | `rgba(0, 0, 0, 0.06) 0px 1px 2px 0px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-subtle-4` |
| subtle-5 | `lab(74.4644 0.482172 -39.075 / 0.25) 0px 0px 0px 4px` | `--shadow-subtle-5` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Main conversion action

Dark filled button, background #232529 (Graphite) or near-black, text #ffffff (white), 10px border-radius, 12px horizontal padding, height ~40px. Inter weight 500, 15px. No border. Signature element: the only colored-fill button in the system. Examples: 'Start for free'.

### Secondary Outline Button
**Role:** Companion action beside primary

White background (#ffffff), 1px border #e4e7ec (Mist 50), text #1c1d1f (Ink Black), 10px radius, 12px horizontal padding. Inter weight 500, 15px. Ghost-like restraint — sits beside the dark primary without competing. Examples: 'Talk to sales'.

### Ghost Text Button
**Role:** Tertiary inline action

Transparent background, no border, text in #1c1d1f or #2e3238, 10px radius, 0px padding. Inter weight 500, 15px. Used in nav and inline contexts where the action is implied, not proclaimed. Examples: nav items, 'Sign in'.

### Dark Inverted Button
**Role:** Action on dark surfaces

Background #1c1d1f (Ink Black), text #ffffff, 1px border #2e3238, 10px radius. Same dimensions as primary but inverted for use on dark bands or footers.

### Tab Bar
**Role:** Section navigation

Horizontal tab strip with bottom-border active indicator. Text Inter 15px weight 500, inactive in #6f7988 (Slate 600), active in #1c1d1f (Ink Black) with a 2px bottom border in Ink Black. No background fill. Examples: 'Ask Attio / Data model / Workflows / Reporting'.

### Product Screenshot Card
**Role:** Product visual showcase

White background (#ffffff), 11-14px border-radius, subtle blue-tinted shadow (rgba(28, 40, 64, 0.04) 0px 12px 30px 0px or rgba(28, 40, 64, 0.08) 0px 6px 20px -2px). Zero or very minimal internal padding — the screenshot IS the card. No border.

### Feature Card
**Role:** Content card with description

White background, 12px border-radius, 1px border #e4e7ec or subtle shadow stack (rgba(28, 40, 64, 0.1) 0px 2px 3px -2px + rgba(28, 40, 64, 0.04) 0px 4px 6px -2px), 11-24px internal padding. Heading 20-32px InterDisplay 600, body 15-16px Inter 500 in #6f7988.

### Logo Strip
**Role:** Social proof / customer logos

Inline row of monochrome customer logos on white background, all rendered in #1c1d1f or #2e3238. No card wrapping, no dividers. Generous vertical padding (60-80px) above and below. Example: granola, Flow, Listen, Obvious, Modal, USV logos.

### Eyebrow Pill / Tag
**Role:** Section category label

Small pill or bordered label above section headings. Transparent or very light background, 1px border #e4e7ec, 7px radius, 6-8px vertical padding, 10-12px horizontal. Inter weight 500, 12px. Used as a quiet signifier. Example: 'Explore GTM frameworks from operators like Elena Verna'.

### New Badge
**Role:** Status indicator

Small filled badge, background #538bf3 (Cobalt Soft), text #ffffff or dark, 7px radius, ~5px vertical / 8px horizontal padding. Inter weight 500, 11-12px. The only chromatic badge in the system — its rarity makes it meaningful.

### Promo Banner
**Role:** Top-of-page announcement

Thin dark bar at top of page (48px height), background #000000 or #101113, text #ffffff, Inter 14px weight 500, centered content with an arrow link in white. Dismissable. Example: 'Orchestrate revenue agents with the new Workflows →'.

### Chat Input Field
**Role:** AI query input

White background, 1px border #e4e7ec, 10-12px radius, subtle shadow, generous internal padding (12-16px). Placeholder text in #9fa1a7 (Fog 400). Send button: small cobalt blue square, #266df0 background, 7px radius.

### Sidebar Navigation
**Role:** In-product navigation

Light background (#ffffff or #f4f5f6), no visible border separating from main content. Items: Inter 14-15px weight 500, text #1c1d1f, hover/active state in #2e3238. Indentation uses 16-24px left padding. Icons: 16px, 1.5px stroke, monochrome.

### Footer
**Role:** Site-wide footer

Black background (#000000), text #ffffff and #b5bdc9 (muted), Inter 14-15px weight 500. Column-based layout (4 columns: Platform, Import from, Apps, Resources). Logo + wordmark in white at top-left. Generous vertical padding (80-120px).

## Do's and Don'ts

### Do
- Use #266df0 (Cobalt Core) as the single accent for all interactive highlights, active states, and link text — never introduce additional saturated colors
- Set display headlines in InterDisplay weight 600 at 40-64px with tracking -0.015em to -0.02em and line-height 1.0-1.1
- Use 10px border-radius for all buttons and inputs, 7px for tags and badges, 11-14px for cards
- Apply blue-tinted shadows at very low opacity (rgba(28, 40, 64, 0.04) to rgba(28, 40, 64, 0.1)) — never use warm-gray or pure-black shadows
- Use Inter weight 500 as the default UI weight, not 400 — the slightly heavier weight is the system's default voice
- Activate 'ss03' on all Inter and InterDisplay text for the alternate geometric character
- Keep the max-width at 1440px and maintain 80-120px vertical gaps between major sections

### Don't
- Don't use rounded buttons with radius above 12px — the 10px radius is part of the system identity
- Don't introduce secondary accent colors, gradients on buttons, or decorative color — one blue accent is the rule
- Don't use TiemposText for anything other than testimonial pull-quote headings — the serif/sans contrast is earned by rarity
- Don't use Inter weight 400 as a default — weight 500 carries the UI voice
- Don't apply shadows warmer than rgba(28, 40, 64, ...) — the blue-tinted shadow is deliberate, not neutral
- Don't use letter-spacing wider than 0 for body or heading text — the system is consistently tight-tracked
- Don't place the cobalt accent on filled backgrounds in body copy — it belongs to links, icons, and small interactive moments

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background, dominant surface |
| 1 | Paper | `#f4f5f6` | Subtle elevated panels, alternate section backgrounds |
| 2 | Card Surface | `#ffffff` | Cards, inputs, product screenshots — sits on Canvas |
| 3 | Dark Surface | `#000000` | Footer, promo banner, dark section bands |

## Elevation

- **Card (subtle):** `rgba(28, 40, 64, 0.1) 0px 2px 3px -2px, rgba(28, 40, 64, 0.04) 0px 4px 6px -2px`
- **Card (elevated):** `rgba(28, 40, 64, 0.06) 0px 2px 6px 0px, rgba(28, 40, 64, 0.08) 0px 6px 20px -2px`
- **Card (drifting):** `rgba(0, 0, 0, 0.04) 0px 12px 30px 0px`
- **Inset border (input/focus):** `rgb(238, 239, 241) 0px 0px 0px 1px inset`

## Imagery

Product screenshots are the primary visual — real interface captures rendered as cards with subtle blue-tinted shadows, zero internal padding (the screenshot fills the card). One hero section uses a grid of small user avatar tiles arranged in a wave/contour pattern as decorative atmosphere. Customer logos appear in a monochrome strip (all rendered in near-black) — no photography, no lifestyle imagery. Iconography is 16-20px line icons, 1.5px stroke weight, monochrome, consistent across nav and UI. The overall visual density is low — white space dominates, and imagery is either product UI or abstract decorative elements, never stock photography.

## Layout

Max-width 1440px centered, with a prominent top promo banner (48px) + nav header (68px) → fixed total header of ~116px. Hero pattern: centered headline + subtext + two-button row, with a product screenshot card below — no split-image, no full-bleed hero. Section rhythm: white → white with subtle Paper-tone bands, alternating full-bleed white and off-white. Content arrangement is predominantly centered stacks and symmetrical 2-column grids; asymmetric layouts are rare. Feature sections use 3-column card grids and side-by-side text+product-screenshot rows. Footer is full-bleed black with a 4-column link grid. Overall density is spacious — 80-120px between major sections, compact 8-12px gaps within cards and lists.

## Agent Prompt Guide

Quick Color Reference:
- text primary: #1c1d1f (Ink Black)
- text muted: #6f7988 (Slate 600)
- background: #ffffff (Page Canvas)
- border: #e4e7ec (Mist 50)
- accent: #266df0 (Cobalt Core)
- primary action: #232529 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #232529 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a product screenshot card: white background, 14px border-radius, shadow rgba(0,0,0,0.04) 0px 12px 30px 0px, zero internal padding, product UI image fills the card edge-to-edge.

3. Create a section with eyebrow pill + heading + body: Eyebrow pill (7px radius, 1px border #e4e7ec, Inter 12px weight 500, #6f7988 text, 8px 12px padding). Heading at 40px InterDisplay 600, #1c1d1f, tracking -0.4px. Body at 16px Inter weight 500, #6f7988, line-height 1.38.

4. Create a chat input field: white background, 1px border #e4e7ec, 12px radius, shadow rgba(28,40,64,0.06) 0px 2px 6px 0px. Placeholder in #9fa1a7 (Fog 400) Inter 15px weight 500. Send button: 28px square, #266df0 background, 7px radius, white arrow icon.

5. Create a footer: full-bleed #000000 background, 4-column grid with column titles (Inter 15px weight 500, #b5bdc9) and links below (Inter 14px weight 500, #ffffff). Logo + wordmark in white at top-left, 80-120px vertical padding.

## Similar Brands

- **Linear** — Same monochrome restraint with a single vivid accent (Linear's purple), Inter-based type stack, hairline borders, and near-white canvas with tight 10px button radii
- **Stripe** — Editorial SaaS language with a custom display sans for headlines, generous white space, and the same 'one accent color doing all the work' philosophy
- **Vercel** — Black-and-white interface with a single bright accent, Inter at weight 500 for UI, and the same compact card padding with subtle shadows
- **Notion** — Near-white canvas with a serif/sans contrast in headings, compact component density, and the same editorial approach to product marketing pages
- **Framer** — Bold display headlines, single cobalt-blue accent, dark footer inversion, and the same 'architectural editorial' treatment of product UI cards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-page-canvas: #ffffff;
  --color-ink-black: #1c1d1f;
  --color-graphite: #232529;
  --color-obsidian: #101113;
  --color-carbon: #2e3238;
  --color-slate-500: #505967;
  --color-slate-600: #6f7988;
  --color-slate-700: #8f99a8;
  --color-fog-400: #9fa1a7;
  --color-mist-300: #b5bdc9;
  --color-cloud-200: #cad0d9;
  --color-cloud-100: #d3d8df;
  --color-mist-50: #e4e7ec;
  --color-haze: #eeeff1;
  --color-paper: #f4f5f6;
  --color-cobalt-core: #266df0;
  --color-cobalt-bright: #407ff2;
  --color-cobalt-soft: #538bf3;
  --color-periwinkle: #bad0fa;
  --color-ice-wash: #e4edff;
  --color-onyx-footer: #000000;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-interdisplay: 'InterDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tiempostext: 'TiemposText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.42;
  --tracking-caption: -0.22px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.38;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.32px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.4px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.84px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-tabs: 10px;
  --radius-cards: 11-14px;
  --radius-badges: 7px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-subtle: rgb(238, 239, 241) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(28, 40, 64, 0.1) 0px 2px 3px -2px, rgba(28, 40, 64, 0.04) 0px 4px 6px -2px;
  --shadow-subtle-3: rgba(28, 40, 64, 0.18) 0px 0px 2px 0px, rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
  --shadow-sm: rgba(28, 40, 64, 0.06) 0px 2px 6px 0px, rgba(28, 40, 64, 0.08) 0px 6px 20px -2px;
  --shadow-xl: rgba(0, 0, 0, 0.04) 0px 12px 30px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.06) 0px 1px 2px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
  --shadow-subtle-5: lab(74.4644 0.482172 -39.075 / 0.25) 0px 0px 0px 4px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-paper: #f4f5f6;
  --surface-card-surface: #ffffff;
  --surface-dark-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-page-canvas: #ffffff;
  --color-ink-black: #1c1d1f;
  --color-graphite: #232529;
  --color-obsidian: #101113;
  --color-carbon: #2e3238;
  --color-slate-500: #505967;
  --color-slate-600: #6f7988;
  --color-slate-700: #8f99a8;
  --color-fog-400: #9fa1a7;
  --color-mist-300: #b5bdc9;
  --color-cloud-200: #cad0d9;
  --color-cloud-100: #d3d8df;
  --color-mist-50: #e4e7ec;
  --color-haze: #eeeff1;
  --color-paper: #f4f5f6;
  --color-cobalt-core: #266df0;
  --color-cobalt-bright: #407ff2;
  --color-cobalt-soft: #538bf3;
  --color-periwinkle: #bad0fa;
  --color-ice-wash: #e4edff;
  --color-onyx-footer: #000000;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-interdisplay: 'InterDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tiempostext: 'TiemposText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.42;
  --tracking-caption: -0.22px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.38;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.32px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.4px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.84px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-subtle: rgb(238, 239, 241) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(28, 40, 64, 0.1) 0px 2px 3px -2px, rgba(28, 40, 64, 0.04) 0px 4px 6px -2px;
  --shadow-subtle-3: rgba(28, 40, 64, 0.18) 0px 0px 2px 0px, rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
  --shadow-sm: rgba(28, 40, 64, 0.06) 0px 2px 6px 0px, rgba(28, 40, 64, 0.08) 0px 6px 20px -2px;
  --shadow-xl: rgba(0, 0, 0, 0.04) 0px 12px 30px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.06) 0px 1px 2px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
  --shadow-subtle-5: lab(74.4644 0.482172 -39.075 / 0.25) 0px 0px 0px 4px;
}
```
