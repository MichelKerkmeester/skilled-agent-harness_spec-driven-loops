# Uniswap — Style Reference
> cotton-candy swap terminal in white air. Vivid magenta accents pierce an otherwise colorless, floating interface, while soft chromatic orbs drift in the background like currency made visible.

**Theme:** light

Uniswap presents a light, airy swap terminal aesthetic: a near-white canvas where a single vivid magenta-pink brand color carries every interactive signal, surrounded by soft floating color orbs that lend the page a playful, weightless atmosphere. Typography is confident and tight — a single custom display face (Basel) at near-black weight, with an unusual 485 weight that sits between regular and medium, creating a subtly compressed, modern feel across both display and UI copy. Components stay compact and rounded — 20px radii on swap cards, 16px on buttons, pill shapes for tokens — with barely-there shadows that let the white surface breathe. The overall experience feels like a DeFi command center rendered in pastel air: structured enough to trust with money, colorful enough to feel alive.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Uniswap Magenta | `#ff37c7` | `--color-uniswap-magenta` | Pink supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink | `#131313` | `--color-ink` | Primary text, nav labels, headings, body copy, and default icon strokes — near-black rather than pure black for a slightly softer read |
| Charcoal | `#222222` | `--color-charcoal` | Secondary text and strong UI borders where extra weight is needed without going to pure black |
| Steel | `#6a6a6a` | `--color-steel` | Muted helper text, secondary labels, inactive nav items, and supporting copy |
| Fog | `#acacac` | `--color-fog` | Disabled states, placeholder text, and faint dividers |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, and button text on magenta fills |
| Bone | `#f2f2f2` | `--color-bone` | Subtle button borders and faint surface tints |
| Onyx | `#000000` | `--color-onyx` | Maximum-contrast text and select icon fills where absolute black is required |
| Electric Violet | `#8251fb` | `--color-electric-violet` | Decorative icon accent and floating orb color — part of the hero atmosphere palette, not a UI state |
| Ember Orange | `#ff4d00` | `--color-ember-orange` | Decorative orb and icon accent in the hero atmosphere |
| Hot Pink | `#f50db4` | `--color-hot-pink` | Decorative orb accent — deeper sibling to the primary magenta for tonal variety in background blobs |
| Sky Cyan | `#2abdff` | `--color-sky-cyan` | Decorative orb and icon accent in the hero atmosphere |
| Mint Teal | `#00c3a0` | `--color-mint-teal` | Decorative orb and icon accent in the hero atmosphere |
| Coral Red | `#e01a2b` | `--color-coral-red` | Decorative orb accent and select icon tint |
| Forest Green | `#0c8911` | `--color-forest-green` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Basel — Sole typeface for every text surface — nav, body, buttons, headings, and display. The signature 485 weight (slightly heavier than regular, lighter than medium) creates a distinctive subtly-compressed feel that no system font replicates. Consistent -0.02em tracking tightens the rhythm at every scale, from 12px captions to 64px display. · `--font-basel`
- **Substitute:** Inter (closest free match for the geometric grotesque structure) or General Sans; replicate the 485 weight by using 500 at 96% opacity
- **Weights:** 400, 485, 500, 535
- **Sizes:** 12, 13, 14, 16, 18, 24, 36, 52, 64
- **Line height:** 1.2–1.5 body, 0.96–1.19 display
- **Letter spacing:** -0.02em across all sizes
- **Role:** Sole typeface for every text surface — nav, body, buttons, headings, and display. The signature 485 weight (slightly heavier than regular, lighter than medium) creates a distinctive subtly-compressed feel that no system font replicates. Consistent -0.02em tracking tightens the rhythm at every scale, from 12px captions to 64px display.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.25 | -0.28px | `--text-body-sm` |
| body | 16px | 1.49 | -0.32px | `--text-body` |
| subheading | 18px | 1.33 | -0.36px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 36px | 1.15 | -0.72px | `--text-heading` |
| heading-lg | 52px | 1 | -1.04px | `--text-heading-lg` |
| display | 64px | 0.96 | -1.28px | `--text-display` |

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
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 20px |
| cards | 20px |
| links | 32px |
| tokens | 999999px |
| buttons | 12-16px |
| swap-widget | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `color(srgb 0.0745098 0.0745098 0.0745098 / 0.00313726) 0p...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Filled Magenta CTA
**Role:** Primary action button — Connect wallet, Get started, Select token

Background #ff37c7, white text, 16px radius, padding 12px 20px, Basel 485 at 16px. Filled magenta against the white canvas is the loudest UI moment; never use more than one per viewport.

### Soft Pink CTA
**Role:** Secondary full-width action — Get started in hero

A paler pink fill (near #f2f2f2 with a magenta tint) with magenta text, 20px radius, 16px 24px padding. Reads as a gentler sibling of the filled magenta button for cases where the full-saturation version would dominate the hero.

### Ghost Text Link
**Role:** Tertiary navigation — Trade without fees, Get the app

No background, no border. Basel 485 at 14–16px in #131313 with a trailing arrow glyph. Lives inline with body copy or in the top-right nav cluster.

### Swap Input Card
**Role:** Token swap interface container — Sell and Buy panels

White surface, 1px border in #f2f2f2, 20px radius, padding 16px 20px. Label (Sell/Buy) at 14px Steel, input value at 36px Ink. Token selector chip is a pill (999999px radius) with token icon + ticker + chevron.

### Token Selector Pill
**Role:** Inline token picker inside swap cards

White pill, 999999px radius, 1px border #f2f2f2, padding 6px 12px. Contains a 24px circular token icon (ETH, etc.) and 16px Basel 500 ticker, with a 12px chevron.

### Stat Tile
**Role:** Metrics display — All time volume, TVL, swapper count, 24H volume

White card, 1px border #f2f2f2, 20px radius, padding 20px. Label at 14px Steel, value at 36–52px Ink. The 24H volume variant uses #0c8911 for the value text and a #c5e3c6 tint background to signal real-time data.

### Nav Bar
**Role:** Top-level navigation

White with a subtle frosted/blurred quality. Logo (magenta unicorn) at left, nav links in Basel 485 14–16px, center search field (rounded pill, 1px border, placeholder text in Fog), right cluster with Ghost text link + filled magenta Connect button. Active nav item carries a soft magenta background highlight.

### Search Field
**Role:** Centered token/pool/wallet search in nav

Pill-shaped (999999px radius), 1px border #f2f2f2, white fill, 40px height. Leading search icon in Steel, placeholder at 14px Fog. Slash-key hint badge on the right.

### Feature Card
**Role:** Product entry points — Web App, Uniswap Wallet

Rounded card with 20px radius, light tinted background (pastel blue or pink wash), padding 24px. Icon at top-left in chromatic accent, heading at 24px Ink, subtle description text below.

### Floating Decorative Orb
**Role:** Atmospheric background element in hero

Large soft-blurred circular shapes (60–120px diameter) scattered across the hero in violet, orange, pink, cyan, teal, and red. No border, no shadow — pure color clouds. They carry the page's personality without adding UI weight.

### Section Heading
**Role:** Page-level section titles — Build for all the ways you swap

Basel 485 at 36–52px in #131313, line-height 1.15, letter-spacing -0.02em. Left-aligned with comfortable left margin; no underline, no accent bar.

## Do's and Don'ts

### Do
- Use #ff37c7 for filled action buttons — the single chromatic moment in the UI
- Set all type to Basel at 485 weight with -0.02em letter-spacing across every size
- Use 20px radius for all card surfaces and 999999px for token pills and search fields
- Keep the page canvas pure white (#ffffff); let floating orbs supply all background color
- Use #0c8911 exclusively for highlighted real-time stat values — no other color for data emphasis
- Pair 16px padding inside cards with 8px gaps between elements for a compact-but-airy rhythm
- Place at most one filled magenta CTA per viewport; use ghost or soft-pink variants for additional actions

### Don't
- Don't introduce a second chromatic accent into the UI — the system is monochrome + magenta by design
- Don't use pure black (#000000) for body copy — use #131313 for a slightly softer, warmer read
- Don't apply visible drop shadows; the one allowed shadow is the 10px black-3% on elevated widgets
- Don't use any color outside the orb palette for backgrounds — orbs decorate, surfaces stay white
- Don't round buttons to 999999px (pill) unless they are token selectors or search; use 12–16px for CTAs
- Don't use colored text for body or nav labels; only #ff37c7 (actions), #0c8911 (data), and the Ink/Steel neutral scale
- Don't reduce the 64px display size or increase the 0.96 line-height — the tight display rhythm is signature

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-page background; the white space that lets the magenta and floating orbs carry all the visual energy |
| 1 | Card Surface | `#ffffff` | Swap input cards, stat tiles, and feature cards sit on the same white but are defined by a faint border or near-invisible shadow |
| 2 | Elevated Widget | `#ffffff` | The swap terminal and overlay surfaces; same white but separated by a barely-perceptible 10px black-3% shadow |

## Elevation

- **Elevated widget (swap terminal, overlays):** `0px 0px 10px 0px rgba(19, 19, 19, 0.003) — a near-invisible shadow that separates surfaces without adding visual weight`

## Imagery

The visual language is dominated by soft, blurred floating color orbs scattered across the hero — large circular shapes in violet, orange, pink, cyan, teal, and red that drift against the white canvas like chromatic clouds. These are the only atmospheric imagery; there is no photography, no illustration, no product screenshots in the hero. Token icons are simple circular logos in their native brand colors (ETH violet, USDC blue, etc.) and serve as the primary recognizable visuals. The page is overwhelmingly UI-and-typography, with the orbs providing personality without competing for attention.

## Layout

Centered max-width 1200px container with generous left/right gutters. The hero is a centered vertical stack: 64px display headline, subtitle, the swap terminal widget (contained max-width ~420px), and a soft-pink CTA below. Sections below use full-width bands with the same centered 1200px content area. The stats section uses a 2-column grid of 4 stat tiles. Product feature cards form a multi-column grid below. Navigation is a single top bar with frosted/blurred quality, center search field, and right-aligned action cluster. Vertical rhythm is built on 64px section gaps with 8px element gaps within cards.

## Agent Prompt Guide

**Quick Color Reference**
- text: #131313
- background: #ffffff
- border: #f2f2f2
- muted text: #6a6a6a
- accent (decorative orbs only): #ff37c7 / #8251fb / #2abdff / #00c3a0 / #ff4d00
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero Section**: White #ffffff background. Display headline '64px' in Basel weight 485, #131313, letter-spacing -1.28px, line-height 0.96. Soft decorative orbs (120px blurred circles in #ff37c7, #2abdff, #8251fb) scattered in the background. Centered swap widget (white card, 20px radius, 1px #f2f2f2 border, 20px padding).

2. **Swap Input Card**: White #ffffff fill, 1px #f2f2f2 border, 20px radius, 16px 20px padding. Label 'Sell' at 14px Basel 485, #6a6a6a, letter-spacing -0.28px. Value input at 36px Basel 485, #131313. Token selector pill (999999px radius, white fill, 1px #f2f2f2 border, 6px 12px padding) with 24px ETH icon and 'ETH' label at 16px Basel 500.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Stat Tile**: White #ffffff card, 1px #f2f2f2 border, 20px radius, 20px padding. Label '24H swap volume' at 14px Basel 485, #6a6a6a. Value at 36–52px Basel 485, #0c8911, letter-spacing -0.72px. Optional #c5e3c6 background tint for live-data variants.

5. **Ghost Text Link**: No background, no border. Text 'Trade without fees' at 16px Basel 485, #131313, with a trailing arrow glyph →. Inline placement beside body copy or in nav.

## Similar Brands

- **Coinbase** — Same light-canvas, single-accent-color approach with a clean swap/trade hero; both use a blue or brand-color filled CTA against a white background
- **Phantom Wallet** — Similar light-mode crypto interface with compact rounded cards, pill-shaped token selectors, and a minimal near-monochrome palette punctuated by a vivid accent
- **1inch** — Both present a centralized swap terminal as the hero interaction with a tight typographic system and white card surfaces on a light background
- **Rainbow Wallet** — Shares the playful floating-orb aesthetic in the hero and the use of a single saturated brand color against an otherwise white, minimal interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-uniswap-magenta: #ff37c7;
  --color-ink: #131313;
  --color-charcoal: #222222;
  --color-steel: #6a6a6a;
  --color-fog: #acacac;
  --color-pure-white: #ffffff;
  --color-bone: #f2f2f2;
  --color-onyx: #000000;
  --color-electric-violet: #8251fb;
  --color-ember-orange: #ff4d00;
  --color-hot-pink: #f50db4;
  --color-sky-cyan: #2abdff;
  --color-mint-teal: #00c3a0;
  --color-coral-red: #e01a2b;
  --color-forest-green: #0c8911;

  /* Typography — Font Families */
  --font-basel: 'Basel', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.49;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -0.72px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.04px;
  --text-display: 64px;
  --leading-display: 0.96;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w485: 485;
  --font-weight-medium: 500;
  --font-weight-w535: 535;

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
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4.8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999999px;

  /* Named Radii */
  --radius-nav: 20px;
  --radius-cards: 20px;
  --radius-links: 32px;
  --radius-tokens: 999999px;
  --radius-buttons: 12-16px;
  --radius-swap-widget: 20px;

  /* Shadows */
  --shadow-md: color(srgb 0.0745098 0.0745098 0.0745098 / 0.00313726) 0px 0px 10px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-elevated-widget: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-uniswap-magenta: #ff37c7;
  --color-ink: #131313;
  --color-charcoal: #222222;
  --color-steel: #6a6a6a;
  --color-fog: #acacac;
  --color-pure-white: #ffffff;
  --color-bone: #f2f2f2;
  --color-onyx: #000000;
  --color-electric-violet: #8251fb;
  --color-ember-orange: #ff4d00;
  --color-hot-pink: #f50db4;
  --color-sky-cyan: #2abdff;
  --color-mint-teal: #00c3a0;
  --color-coral-red: #e01a2b;
  --color-forest-green: #0c8911;

  /* Typography */
  --font-basel: 'Basel', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.49;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -0.72px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.04px;
  --text-display: 64px;
  --leading-display: 0.96;
  --tracking-display: -1.28px;

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
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4.8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999999px;

  /* Shadows */
  --shadow-md: color(srgb 0.0745098 0.0745098 0.0745098 / 0.00313726) 0px 0px 10px 0px;
}
```
