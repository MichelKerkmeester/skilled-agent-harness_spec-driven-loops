# Discover — Style Reference
> Type museum on white marble — a near-black wordmark, a whisper of coral, and everything else recedes.

**Theme:** light

Fonts Ninja is a near-monochrome gallery for letterforms, where the only chromatic note is a single warm coral that punctuates action. The canvas is near-white and stays quiet; type is the protagonist, presented at extreme scale and paired with generous negative space. Cards are soft-cornered white panels floating on a barely-there shadow, and every interactive element earns its color — most UI is ink-on-paper, and the coral appears only when something wants to be clicked. Density is compact but the layout breathes because margins are large and rhythm is measured in 10px and 24px increments rather than tight 4-8px stacks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#121212` | `--color-ink` | Primary text, card borders, icon strokes, hairline dividers. A warm near-black chosen over #000 to soften contrast against white without losing authority |
| Canvas | `#ffffff` | `--color-canvas` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Fog | `#dbdada` | `--color-fog` | Ambient shadow tint, muted background washes, subtle surface elevation. Carries the 0.16-alpha shadow that lifts cards off the canvas |
| Slate | `#8e8e93` | `--color-slate` | Secondary body text, de-emphasized metadata, inactive nav borders, helper copy |
| Obsidian | `#000000` | `--color-obsidian` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Signal Coral | `#ee585a` | `--color-signal-coral` | Filled CTA backgrounds (action buttons, filter pills), inline text links, notification dot, hover/focus glow. The sole chromatic accent — one warm red against matte white creates urgency without aggression |

## Tokens — Typography

### Aeonik — Sole typeface across all UI. 700 for the monumental wordmark and large display headings, 500 for medium-emphasis labels and nav, 400 for body and metadata. Tight -0.011em tracking across all sizes tightens the geometric forms and gives the wordmark its dense, packed look. · `--font-aeonik`
- **Substitute:** Inter, Satoshi, or General Sans
- **Weights:** 400, 500, 700
- **Sizes:** 12, 14, 16, 24, 32, 44px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.011em (consistent across all sizes, roughly -0.13px at 12px through -0.48px at 44px)
- **Role:** Sole typeface across all UI. 700 for the monumental wordmark and large display headings, 500 for medium-emphasis labels and nav, 400 for body and metadata. Tight -0.011em tracking across all sizes tightens the geometric forms and gives the wordmark its dense, packed look.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.13px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.15px | `--text-body-sm` |
| body | 16px | 1.5 | -0.18px | `--text-body` |
| subheading | 24px | 1.2 | -0.26px | `--text-subheading` |
| heading-sm | 32px | 1.14 | -0.35px | `--text-heading-sm` |
| heading | 44px | 1.15 | -0.48px | `--text-heading` |
| display | 120px | 1 | -1.32px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 66 | 66px | `--spacing-66` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 32px |
| links | 16px |
| pills | 9999px |
| buttons | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(72, 72, 74, 0.16) 0px 2px 32px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1320px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Font Preview Card
**Role:** Grid tile displaying a single typeface specimen

White surface (#ffffff) on Canvas, 32px border-radius, ambient shadow rgba(72,72,74,0.16) 0px 2px 32px 0px. Centered specimen at ~120px Aeonik weight 700 in Ink (#121212) dominates the card. Below: font name in 16px weight 500 Ink, foundry and style count/price in 12-14px Slate (#8e8e93). Internal padding 24px, specimen area ~60% of card height.

### Primary CTA Button (Filled)
**Role:** Action trigger — filter, submit, navigate

Signal Coral (#ee585a) background, white (#ffffff) text, Aeonik 500 at 14-16px, 32px border-radius, 16px vertical × 24px horizontal padding. No border. Sits at full saturation against the monochrome canvas — the coral is the only chromatic voice in the room.

### Ghost Text Link
**Role:** Inline navigation and secondary affordances

Signal Coral (#ee585a) text in Aeonik 500 at 16px with an external-arrow glyph (↗). No underline, no background, no border. Inline within body copy or as standalone link. 16px border-radius on any container.

### Floating Filter Pill
**Role:** Sticky filter trigger for typeface grid

Signal Coral (#ee585a) filled pill, white text reading 'Filter typefaces' with a dropdown caret icon, 9999px border-radius (full pill), 10-12px vertical × 20px horizontal padding. Floats over grid content at fixed position.

### Top Navigation Bar
**Role:** Primary site navigation

Transparent/Canvas background, 56px horizontal padding. Left: small ninja mark icon. Right cluster: 'Fonts' (active, weight 500 Ink), 'Bookmarks' (weight 400 Slate), search icon, profile icon, hamburger — all 24px outlined icons in Ink with 24-32px gap between items.

### Hero Wordmark
**Role:** Brand statement and page identity

Full-bleed 'FONTS NINJA' set in Aeonik 700 at ~120px, Ink (#121212), tracking -1.32px, line-height 1.0. Near-edge-to-edge horizontal span. A 12px Signal Coral notification dot sits at the top-right of the final 'A' — a single pop of color that says 'new' without a badge or banner.

### Notification Dot
**Role:** Status indicator on wordmark and possibly nav elements

12px diameter circle, Signal Coral (#ee585a), no border, no shadow. Positioned as a superscript overlay.

### Metadata Label
**Role:** Supporting text — foundry name, style count, price

Aeonik 400 at 12-14px, Slate (#8e8e93). Two-column layout within cards: left-aligned descriptor, right-aligned price/style count. 10px gap between label and value.

### Body Paragraph
**Role:** Hero subtext and descriptive copy

Aeonik 400 at 16-24px, Ink (#121212), line-height 1.5, max-width constrained to ~50-60ch. Inline links adopt Ghost Text Link styling.

## Do's and Don'ts

### Do
- Use Signal Coral (#ee585a) exclusively for filled CTAs, inline text links, notification dots, and the floating filter pill — never as a background wash, never on large surface areas
- Set all type in Aeonik (or Inter/Satoshi substitute) at -0.011em letter-spacing regardless of size — the consistent tight tracking is part of the brand voice
- Apply 32px border-radius to all cards, buttons, and containers — this large radius is signature and defines the soft, modern feel
- Use Ink (#121212) for all text and borders instead of pure #000000 — the warmth keeps the near-monochrome palette from feeling harsh
- Limit shadows to the single token rgba(72,72,74,0.16) 0px 2px 32px 0px, applied only to cards and floating elements
- Maintain 10px element gaps and 24px card padding as the base rhythm — jump to 48px for section separation
- Let the wordmark or display heading carry visual weight; keep supporting UI quiet and monochrome

### Don't
- Don't introduce additional accent colors — the 1% colorfulness is deliberate; Signal Coral is the only chromatic note allowed
- Don't use sharp corners (0-4px radius) on any container — the 32px radius defines the system
- Don't apply drop shadows to text, nav, or inline elements — shadows are reserved for cards and floating pills only
- Don't use pure #000000 for body text — always use #121212 to maintain the soft contrast ratio (18.7:1)
- Don't set display type at loose or normal letter-spacing — the -0.011em tight tracking is non-negotiable
- Don't fill large background areas with Signal Coral — it loses impact at scale and should remain a small functional accent
- Don't add gradients, textures, or decorative imagery — the system is deliberately flat and typographic

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background, full-bleed |
| 1 | Card | `#ffffff` | Font preview tiles, content panels — same hex as canvas but separated by shadow |
| 2 | Shadow Tint | `#dbdada` | Ambient gray carried in card shadows at 0.16 alpha |
| 3 | Action Surface | `#ee585a` | Filled CTAs, floating filter button, notification dot |

## Elevation

- **Font Preview Card:** `rgba(72, 72, 74, 0.16) 0px 2px 32px 0px`

## Imagery

No photography, no illustration, no abstract graphics. The only visual content beyond UI chrome is typographic specimens — oversized 'Aa' glyphs rendered directly in the interface as the product itself. Icons are minimal outlined glyphs (search, profile, hamburger, ninja mark) drawn in Ink at 24px with thin consistent stroke weight, monoline style. The wordmark functions as the hero image. Visual density is extremely low — text and specimens dominate, the rest is whitespace.

## Layout

Full-bleed layout with the wordmark stretching nearly edge-to-edge in the hero, establishing maximum typographic impact immediately. Below the hero, a 3-column responsive grid of font preview cards with generous 24-32px gutters. Content max-width approximately 1320px centered on the canvas. Section rhythm: the hero is a single expansive band, followed by a tighter grid section. Navigation is a minimal top bar with right-aligned utility cluster. No sidebar, no mega-menu, no sticky elements beyond the floating filter pill. The page reads top-to-bottom as: monumental wordmark → short descriptive paragraph → dense specimen grid. Asymmetric only in the hero's near-full-bleed scale; the grid below is symmetric and evenly spaced.

## Agent Prompt Guide

**Quick Color Reference**
- text: #121212 (Ink)
- background: #ffffff (Canvas)
- border: #121212 (Ink) at 1px
- accent: #ee585a (Signal Coral)
- primary action: #ee585a (filled action)
- muted: #8e8e93 (Slate)

**3-5 Example Component Prompts**

1. *Hero wordmark section*: Full-bleed white canvas. Set 'FONTS NINJA' in Aeonik weight 700 at 120px, color #121212, letter-spacing -1.32px, line-height 1.0, stretching nearly edge-to-edge. Place a 12px diameter #ee585a circle at the top-right corner of the final letter as a notification dot. Below at 48px gap, add a body paragraph: Aeonik 400 at 24px, #121212, line-height 1.5, max-width 60ch. Inline the phrase 'Browse our library' as #ee585a Aeonik 500 with an external-arrow glyph (↗).

2. *Font preview card*: White (#ffffff) surface, 32px border-radius, shadow rgba(72,72,74,0.16) 0px 2px 32px 0px. Centered specimen of 'Aa' at 120px Aeonik weight 700 in #121212 occupying the top 60% of the card. Bottom section with 24px internal padding: font name in Aeonik 500 16px #121212 on the left, style count in Aeonik 400 14px #8e8e93 on the right. Second row: foundry name in Aeonik 400 12px #8e8e93.

3. Create a Primary Action Button: #ee585a background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. *Top navigation bar*: White transparent background, 56px horizontal padding. Left: 24px outlined ninja mark icon in #121212. Right cluster with 32px gaps: 'Fonts' (Aeonik 500 16px #121212), 'Bookmarks' (Aeonik 400 16px #8e8e93), search icon, profile icon, hamburger icon — all 24px outlined in #121212.

5. *Typography grid section*: 3-column CSS grid with 24px gap, cards as described above. Section padding 48px top/bottom. Each card 32px border-radius with the single shadow token.

## Similar Brands

- **Pangram Pangram** — Same near-monochrome gallery treatment for type specimens, oversized 'Aa' previews, and large border-radius on specimen cards
- **Klim Type Foundry** — Editorial type-foundry presentation with white canvas, single-weight typography, and type specimens as the primary visual
- **Are.na** — Near-monochrome minimalist interface with quiet chrome and a single accent color reserved for interactive elements
- **Linear** — Compact dense UI with generous border-radius, near-black text on white, and a single restrained accent palette
- **Velvetyne Type Foundry** — Type-specimen-first layout with specimen cards on white, minimal chrome, and no decorative imagery

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #121212;
  --color-canvas: #ffffff;
  --color-fog: #dbdada;
  --color-slate: #8e8e93;
  --color-obsidian: #000000;
  --color-signal-coral: #ee585a;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.13px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.15px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.35px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -0.48px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -1.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-66: 66px;

  /* Layout */
  --page-max-width: 1320px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 69px;

  /* Named Radii */
  --radius-cards: 32px;
  --radius-links: 16px;
  --radius-pills: 9999px;
  --radius-buttons: 32px;

  /* Shadows */
  --shadow-xl: rgba(72, 72, 74, 0.16) 0px 2px 32px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-shadow-tint: #dbdada;
  --surface-action-surface: #ee585a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #121212;
  --color-canvas: #ffffff;
  --color-fog: #dbdada;
  --color-slate: #8e8e93;
  --color-obsidian: #000000;
  --color-signal-coral: #ee585a;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.13px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.15px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.35px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -0.48px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -1.32px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-66: 66px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 69px;

  /* Shadows */
  --shadow-xl: rgba(72, 72, 74, 0.16) 0px 2px 32px 0px;
}
```
