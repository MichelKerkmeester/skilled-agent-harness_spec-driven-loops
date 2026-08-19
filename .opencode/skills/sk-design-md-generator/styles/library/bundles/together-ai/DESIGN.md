# Together AI — Style Reference
> Research console on glacier paper

**Theme:** mixed

Together AI reads as a research-grade console on glacier-white paper: stark black-on-white typography, near-zero chrome, and pastel data cards (blush, peach, sky, mint) that act as colored sticky-notes on an otherwise monochrome page. The single dark band — a near-black navy research section — is the dramatic inversion that gives the system its contrast and signals depth-of-work. Hierarchy is built through type weight and scale rather than color, and a thin periwinkle accent (#bdbbff) appears as small dashes and underlines to mark active states. Pastel backgrounds are decorative, not decorative-only: they tag metric categories. Components are sharp-cornered (4px), low-elevation, and rely on the monospace label family to feel like a lab notebook.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces on light theme, text on dark surfaces |
| Slate | `#4d4d4d` | `--color-slate` | Muted secondary text, subdued metadata, low-emphasis body copy |
| Hairline | `#d6d6d6` | `--color-hairline` | Hairline borders, table dividers, input outlines |
| Midnight Ink | `#010120` | `--color-midnight-ink` | Dark surface (research section background) — near-black navy that reads as deeper than pure black, giving the dark band a tinted, on-brand cast |
| Periwinkle | `#bdbbff` | `--color-periwinkle` | Accent dashes, active indicators, small UI punctuation — the system's only mid-saturation chromatic accent, used sparingly as underlines and section markers |
| Mint Cyan | `#c8f6f9` | `--color-mint-cyan` | Gray supporting accent for decorative details and low-frequency emphasis. |
| Sky | `#c1dff9` | `--color-sky` | Gray supporting accent for decorative details and low-frequency emphasis. |
| Blush | `#fde3f6` | `--color-blush` | Light supporting surface for subtle backgrounds and section separation. |
| Peach | `#ffdccd` | `--color-peach` | Card background — used for the third stat tile, warm counterweight to the cool pinks and blues |

## Tokens — Typography

### The Future — Primary sans-serif for body, nav, headings, and hero — the sole display and text family. Aggressive negative tracking at display sizes (-0.03em at 64px) tightens headlines into compact, near-condensed blocks. Tight line-heights (1.10 at display) keep multi-line headlines visually dense rather than airy. · `--font-the-future`
- **Substitute:** Inter Tight, Satoshi, General Sans
- **Weights:** 400, 500
- **Sizes:** 14, 16, 18, 22, 28, 40, 64
- **Line height:** 1.10–1.40
- **Letter spacing:** -1.92px at 64px, -0.80px at 40px, -0.42px at 28px, -0.22px at 22px, -0.18px at 18px, -0.16px at 16px, -0.14px at 14px
- **Role:** Primary sans-serif for body, nav, headings, and hero — the sole display and text family. Aggressive negative tracking at display sizes (-0.03em at 64px) tightens headlines into compact, near-condensed blocks. Tight line-heights (1.10 at display) keep multi-line headlines visually dense rather than airy.

### PP Neue Montreal Mono — Monospace for labels, category badges, button text, and technical metadata — the lab-notebook voice that signals research credibility. Slightly positive tracking (0.005–0.007em) keeps mono caps readable at small sizes. · `--font-pp-neue-montreal-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Geist Mono
- **Weights:** 400, 500
- **Sizes:** 10, 11, 13, 16
- **Line height:** 1.00–1.40
- **Letter spacing:** 0.07px at 10px, 0.08px at 11px, 0.09px at 13px, 0.11px at 16px
- **Role:** Monospace for labels, category badges, button text, and technical metadata — the lab-notebook voice that signals research credibility. Slightly positive tracking (0.005–0.007em) keeps mono caps readable at small sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.25 | -0.14px | `--text-caption` |
| body-sm | 16px | 1.3 | -0.16px | `--text-body-sm` |
| body | 18px | 1.3 | -0.18px | `--text-body` |
| subheading | 22px | 1.25 | -0.22px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.42px | `--text-heading-sm` |
| heading | 40px | 1.15 | -0.8px | `--text-heading` |
| display | 64px | 1.1 | -1.92px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 4px |
| cards | 4px |
| badges | 4px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(1, 1, 32, 0.1) -10px 0px 75px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-80px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Primary Dark Button
**Role:** High-emphasis action (START BUILDING, SIGN IN)

Filled black (#000000) background, white text in PP Neue Montreal Mono 13px weight 500, 4px radius, padding 8px 16px. No border. Black-on-black hover (no color shift). Inline arrow icon (→) on SIGN IN variant.

### Ghost Button
**Role:** Secondary action (CONTACT SALES)

Transparent background, 1px border in #d6d6d6 or currentColor, black text in PP Neue Montreal Mono 13px weight 500, 4px radius, padding 8px 16px. Hover darkens text to #000000.

### Announcement Bar
**Role:** Top-of-page news strip

Full-width #000000 background, white centered text in The Future 14px weight 400, padding 8px vertical. Sits above the nav with no separator.

### Sticky Navigation
**Role:** Primary site navigation

White (#ffffff) background, 1200px max-width container, 16–24px vertical padding. Logo (gradient mark + wordmark) left, nav links center (The Future 16px, weight 400, #000000), CTA cluster right (Ghost + Primary). Sticky with a soft navy-tinted horizontal glow on scroll: rgba(1,1,32,0.1) -10px 0px 75px 0px.

### Hero Section
**Role:** Above-the-fold introduction

Two-column split on white. Left: display headline at 64px The Future weight 500 (#000000), continuation line at 64px weight 400 in #4d4d4d, supporting subtext at 18px weight 400 in #4d4d4d, Primary + Ghost button pair. Right: abstract 3D illustration of translucent gradient shapes (blue, purple, orange rings and a diamond) with floating labels in mono.

### Stat Metric Card
**Role:** Performance headline tile (Faster Inference, Lower Cost, Faster Pre-training)

Solid pastel fill (one of #c1dff9, #fde3f6, #ffdccd, #c8f6f9), 4px radius, padding 20–24px. Small mono label top-left with directional arrow (↑ FASTER INFERENCE, ↓ LOWER COST). Giant metric number in The Future 64px weight 500 #000000. Single-line caption below in The Future 14–16px weight 400 #4d4d4d. No border, no shadow — the fill IS the card.

### Platform Tab Card
**Role:** Category selector for the Full-stack cloud section (Inference, Compute, Model shaping)

White background card with 4px radius, centered label in The Future 22px weight 500. Active state: pastel fill (#c8f6f9 mint) replaces the white surface, providing color-on-color contrast without a border or shadow change. Padding 20–24px vertical.

### Research Paper Card
**Role:** Featured publication tile in the dark research section

Dark card on Midnight Ink (#010120) background — card fill is a slightly lighter navy tone derived from the surface. 4px radius, padding 24–32px. Category badge top-center (PP Neue Montreal Mono 11px weight 500, white on translucent periwinkle or white on dark). Paper title centered in The Future 22px weight 500 white. Author list in PP Neue Montreal Mono 11px weight 400 in muted white (#4d4d4d equivalent at low opacity). A small periwinkle (#bdbbff) dash sits to the left edge of each card as a visual link.

### Category Badge
**Role:** Compact label for paper type or section tag

PP Neue Montreal Mono 11px weight 500, uppercase, white text on dark surface. No background fill (sits directly on the card). Tracking slightly positive for mono legibility.

### Trusted-By Logo Row
**Role:** Social proof strip

Single horizontal row of grayscale partner logos in #4d4d4d, separated by generous whitespace. Small 'TRUSTED BY' label in PP Neue Montreal Mono 11px weight 500 #4d4d4d to the left. No logos are colored — all are desaturated to preserve the monochrome system.

### Hero Illustration
**Role:** Brand-defining 3D visual on the hero

Abstract 3D render: translucent gradient rings, a central spherical form, and a faceted orange diamond shape, with small mono labels (PRODUCTION INFERENCE, OPTIMIZED TRAINING, CUTTING-EDGE RESEARCH) anchoring the shapes like callouts. Glossy, smooth, dimensional — not flat illustration. Gradient palette runs blue → purple → orange across the three main forms.

## Do's and Don'ts

### Do
- Set body and heading text in The Future with aggressive negative tracking at large sizes (-0.03em at 64px, -0.02em at 40px)
- Use mono (PP Neue Montreal Mono) for all labels, badges, button text, and technical metadata — the mono voice is the system's research credibility signal
- Use 4px radius for every card, button, badge, and input — the sharp corner is a defining trait
- Place at most one dark band per page, using #010120 (near-black navy, not pure black) to create a deliberate inversion
- Apply pastel card backgrounds (#c1dff9, #fde3f6, #ffdccd, #c8f6f9) as category-coded fills, not as decoration — each pastel should tag a distinct metric or topic
- Reserve #bdbbff periwinkle for small UI punctuation: active indicators, section dashes, underlines — never as a surface fill or large block
- Keep the sticky nav the only element with shadow; use the navy-tinted horizontal glow rgba(1,1,32,0.1) -10px 0px 75px 0px

### Don't
- Don't introduce drop shadows on cards, buttons, or sections — the system is flat by design
- Don't use pure white text on pure black surfaces — use #ffffff on #010120 so the dark band reads as brand-tinted, not generic dark mode
- Don't color trusted-by or partner logos — keep them desaturated to #4d4d4d so they don't compete with the pastel stat cards
- Don't round corners above 4px for standard UI; large radii (8px, 16px) break the sharp, editorial feel
- Don't use color to indicate hierarchy on light surfaces — use type weight (400 vs 500) and size instead, matching the headline pattern of one bold line + one lighter continuation line
- Don't add gradients to UI chrome; gradients belong only in the hero 3D illustration
- Don't mix the two font families casually — mono stays in labels/badges/buttons, sans stays in body and headings

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper Canvas | `#ffffff` | Default page background across hero, stats, and platform sections |
| 2 | Midnight Band | `#010120` | Dark research section — the single inverted surface that breaks the light theme |

## Elevation

- **Sticky Navigation:** `rgba(1, 1, 32, 0.1) -10px 0px 75px 0px`

## Imagery

Imagery is dominated by a single abstract 3D illustration on the hero: translucent gradient geometric forms (rings, a central sphere, a faceted orange diamond) in a blue→purple→orange palette, glossy and dimensional, floating against white space with small mono callout labels. No photography anywhere on the site. No flat illustration or iconographic graphics. The 3D style is the brand's only visual mark beyond typography and the pastel card system. Icons throughout the UI are mono outlines drawn from the system weight.

## Layout

Full-width sections with 1200px max-width centered content. Nav: top bar with logo left, links center, CTA cluster right. Hero: asymmetric two-column split — text block left (50%), 3D illustration right (50%) on white. Stats: three equal pastel cards in a row. Platform section: centered header, then three tab cards in a row with the active tab recolored. Research section: full-bleed dark band (#010120) with a horizontally scrollable row of four paper cards, section header left-aligned, nav arrows right. Section gaps run 40–80px; card padding runs 16–24px; element gaps run 8–16px on a 4px base grid.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border: #d6d6d6
- accent: #bdbbff
- dark surface: #010120
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a stat metric card: 4px radius, 24px padding, fill #c1dff9 sky blue. Top-left label in PP Neue Montreal Mono 11px weight 500 #000000 reading '↑ FASTER INFERENCE'. Metric number in The Future 64px weight 500 #000000 reading '2x'. Caption below in The Future 14px weight 400 #4d4d4d reading 'powered by cutting-edge research.'
2. Create a research paper card on #010120 background: 4px radius, 32px padding, slightly lighter navy card fill. Centered category badge in PP Neue Montreal Mono 11px weight 500 white reading 'AGENTS'. Title in The Future 22px weight 500 white, centered. Author list in PP Neue Montreal Mono 11px weight 400 #4d4d4d. Small #bdbbff periwinkle dash to the left edge.
3. Create a platform tab card: 4px radius, 20px vertical padding, white background. Centered label 'Inference' in The Future 22px weight 500 #000000. Active state: fill becomes #c8f6f9 mint cyan.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
5. Create a ghost button: transparent background, 1px #d6d6d6 border, 4px radius, padding 8px 16px. Label in PP Neue Montreal Mono 13px weight 500 #000000 reading 'CONTACT SALES'.

## Similar Brands

- **Anthropic** — Same clean light-paper aesthetic with a single dark inversion section, tight sans-serif display type, and mono labels for technical credibility
- **Hugging Face** — Pastel category-coded cards on a white canvas with mono badges, and a research-credibility layout where papers and models are the hero content
- **Linear** — Sharp 4px corners, almost shadowless surfaces, aggressive negative tracking on large display type, and near-monochrome palette with a single chromatic accent
- **Modal Labs** — Devtools-for-AI branding with a single bold headline + lighter continuation line pattern, pastel stat tiles, and dark research/feature bands as visual punctuation
- **Vercel** — Black-on-white editorial typography with tight letter-spacing, a sole dark hero variant, and minimal UI chrome that lets type and 3D illustration carry the brand

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-slate: #4d4d4d;
  --color-hairline: #d6d6d6;
  --color-midnight-ink: #010120;
  --color-periwinkle: #bdbbff;
  --color-mint-cyan: #c8f6f9;
  --color-sky: #c1dff9;
  --color-blush: #fde3f6;
  --color-peach: #ffdccd;

  /* Typography — Font Families */
  --font-the-future: 'The Future', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-mono: 'PP Neue Montreal Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.25;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.42px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -0.8px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -1.92px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-80px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tabs: 4px;
  --radius-cards: 4px;
  --radius-badges: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-xl: rgba(1, 1, 32, 0.1) -10px 0px 75px 0px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-midnight-band: #010120;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-slate: #4d4d4d;
  --color-hairline: #d6d6d6;
  --color-midnight-ink: #010120;
  --color-periwinkle: #bdbbff;
  --color-mint-cyan: #c8f6f9;
  --color-sky: #c1dff9;
  --color-blush: #fde3f6;
  --color-peach: #ffdccd;

  /* Typography */
  --font-the-future: 'The Future', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-mono: 'PP Neue Montreal Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.25;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.42px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -0.8px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -1.92px;

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
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-xl: rgba(1, 1, 32, 0.1) -10px 0px 75px 0px;
}
```
