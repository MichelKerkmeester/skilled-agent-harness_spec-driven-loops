# Titan — Style Reference
> warm-toned monochrome archive

**Theme:** light

Titan is a warm-toned monochrome editorial system: generous whitespace, a near-black ink color against soft cream surfaces, and pill-shaped geometry that softens what would otherwise feel like a strict financial product. Color is deliberately absent from the interface — all visual hierarchy comes from typography, spacing, and the warm/cool gray duality between structural borders (#e9eaeb) and surface tones (#f3efeb). Headlines carry authority through weight 500 at large sizes with tight -0.03em tracking rather than through bold weight or accent color. Components feel tactile but flat: no shadows, no gradients, no elevation — depth comes purely from the warm cream card surface (#f3efeb) sitting on the white canvas. The only dark element is the footer (#1e1e1d), creating a single inversion moment at the page bottom. Monospaced Geist Mono is reserved for large numerical stats ($1.2B, 10,000+, 2017), giving data a distinctive editorial quality that mirrors print financial journalism.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#111111` | `--color-ink` | Primary text, filled button background, icon strokes — near-black ink that carries the entire brand identity. The slight softness vs pure #000 keeps it from feeling sterile |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text — the dominant light field the entire interface sits on |
| Mist Border | `#e9eaeb` | `--color-mist-border` | Primary hairline borders, nav pill background, structural dividers — cool gray that defines edges and containers without competing with content |
| Cream Surface | `#f3efeb` | `--color-cream-surface` | Warm card and section surfaces — the warm signature tone that gives the system its editorial, paper-like quality against the cool white canvas |
| Tan Divider | `#d8d3cc` | `--color-tan-divider` | Secondary borders on warm surfaces, subtle background washes — extends the cream warmth into the border layer |
| Warm Subtle | `#615e5b` | `--color-warm-subtle` | Muted helper text, secondary copy — warm gray that recedes on cream surfaces while staying readable on white |
| Mid Gray | `#888888` | `--color-mid-gray` | Tertiary text and disabled states — only when even Warm Subtle is too prominent |
| Pure Black | `#000000` | `--color-pure-black` | Rare SVG fills and graphic accents — used sparingly where absolute black is required |
| Obsidian | `#1e1e1d` | `--color-obsidian` | Footer background, dark section inversions — the only dark surface in the system, creating a terminal moment at page bottom |

## Tokens — Typography

### Geist — Primary interface and headline typeface — used at weight 500 (not 700) for all headings, a deliberate restraint that gives headlines editorial weight without shouting. Variable substitute: Inter. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px, 32px, 40px, 60px
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.03em at display/heading sizes (60px: -1.8px, 40px: -1.2px, 32px: -0.96px); -0.01em at 48px; 0 at body sizes
- **OpenType features:** `"ss02", "ss03"`
- **Role:** Primary interface and headline typeface — used at weight 500 (not 700) for all headings, a deliberate restraint that gives headlines editorial weight without shouting. Variable substitute: Inter.

### Geist Mono — Numerical stats, metadata, small labels — reserved for figures like $1.2B, 10,000+, 2017 where monospaced digits create an editorial financial-journalism quality. Variable substitute: JetBrains Mono. · `--font-geist-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400, 500
- **Sizes:** 11px, 13px, 28px, 48px
- **Line height:** 1.0–1.1
- **Letter spacing:** -0.01em at 48/28px; 0.03em at 13px (uppercase overlines); 0.03em at 11px
- **OpenType features:** `"ss08"`
- **Role:** Numerical stats, metadata, small labels — reserved for figures like $1.2B, 10,000+, 2017 where monospaced digits create an editorial financial-journalism quality. Variable substitute: JetBrains Mono.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 11 | 0.33px | `--text-micro` |
| overline | 13px | 13 | 0.39px | `--text-overline` |
| body-sm | 16px | 19.2 | — | `--text-body-sm` |
| body | 18px | 23.4 | — | `--text-body` |
| body-lg | 20px | 26 | — | `--text-body-lg` |
| subheading | 28px | 30.8 | -0.28px | `--text-subheading` |
| heading-sm | 32px | 35.2 | -0.96px | `--text-heading-sm` |
| heading | 40px | 44 | -1.2px | `--text-heading` |
| heading-lg | 48px | 52.8 | -0.48px | `--text-heading-lg` |
| display | 60px | 66 | -1.8px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 160px |
| tags | 9999px |
| cards | 32px |
| icons | 50% |
| buttons | 160px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-120px
- **Card padding:** 56px
- **Element gap:** 16-24px

## Components

### Filled Pill Button (Primary)
**Role:** Primary call-to-action across the site

160px border-radius (full pill), background #111111, text #ffffff, padding 0 24px, height ~48px, font Geist 16px weight 500. No border. The pill shape is signature — never use sharp corners or square buttons for primary actions.

### Outline Pill Button (Secondary)
**Role:** Secondary actions, less prominent CTAs

140px border-radius, transparent background, 1px solid #111111 border, text #111111, padding 11px 18px, font Geist 16px weight 500. Used when two actions sit side-by-side and hierarchy must be preserved.

### Inverse Pill Button
**Role:** Actions on dark backgrounds

160px border-radius, background #ffffff, text #111111, 1px solid #ffffff border. Used in the dark footer for 'TALK TO AN ADVISOR'.

### Circular Icon Button
**Role:** Compact icon-only controls

50% border-radius, background rgba(0,0,0,0.1), no border, contains a single icon at #111111. Used for utility controls and compact interactions.

### Cream Editorial Card
**Role:** Content blocks that need warmth and breathing room

32px border-radius, background #f3efeb, padding 56-60px all sides, no border, no shadow. Sits on the white canvas to create tonal depth. Generous internal padding signals editorial importance.

### Borderless Feature Card
**Role:** Inline content blocks without surface weight

0px border-radius, transparent background, no padding, no shadow. Pure layout containers — the content itself provides hierarchy.

### Stat Block
**Role:** Displaying numerical proof points ($1.2B, 10,000+, 2017)

Label in Geist 13px weight 500 uppercase, tracking 0.03em, color #111111. Value in Geist Mono 48px weight 500, line-height 1.1, tracking -0.01em, color #111111. The mono typeface for large numbers is a signature choice — gives financial data an editorial-print quality.

### Feature Item with Icon
**Role:** Feature lists with small circular icon + text

Small circular icon badge (~40px) with #111111 icon glyph, paired with Geist 16-18px text at #111111. Arranged in a left-aligned column with 24-32px row gaps. Simple, no card chrome.

### Navigation Bar
**Role:** Top-level site navigation

88px height, white background, 1px solid #e9eaeb bottom border. Logo left, nav links center, auth buttons right. Nav links are Geist 16px weight 400 at #111111. The auth buttons ('Log In' text, 'Join Titan' filled pill) sit on the right.

### Hero Split Layout
**Role:** Above-the-fold page entry

Two-column asymmetric split: left column holds large headline (60px Geist weight 500), primary CTA, supporting copy, and stat row; right column holds a full-bleed portrait photograph. Generous vertical padding (~80px top/bottom).

### Dark Footer
**Role:** Site-wide footer with links and legal

Background #1e1e1d, padding 56-80px vertical, white text at varying opacity. Multi-column link grid (Titan / Offerings / Diversify). Inverse pill button ('TALK TO AN ADVISOR') for final CTA. Social icons in a row. Large disclaimer text block at bottom in Geist 10px weight 400, tracking 0.03em.

## Do's and Don'ts

### Do
- Use pill buttons with 160px border-radius for all primary actions — never square or slightly-rounded buttons
- Set all headlines to weight 500 in Geist with -0.03em tracking at 32px+; reserve weight 400 for body copy
- Use Geist Mono 48px weight 500 for all large numerical stats — the mono typeface for financial figures is signature
- Pair cream #f3efeb card surfaces with the white canvas to create depth; never add box-shadow for elevation
- Keep the interface fully monochrome — do not introduce accent colors, the absence of color IS the brand identity
- Use 1px solid #e9eaeb for hairline borders on white surfaces and #d8d3cc for borders on cream surfaces
- Apply 0.03em positive tracking to all uppercase labels and micro-copy (10-14px) for an editorial-tag quality

### Don't
- Do not use weight 600 or 700 for headings — weight 500 at large sizes with tight tracking is the system's voice
- Do not add box-shadow, gradients, or any form of elevation — depth comes from surface color contrast only
- Do not introduce blue, green, or any chromatic accent — the 0% colorfulness is intentional
- Do not use sharp corners (0-8px radius) on buttons or cards — the pill (160px) and large-rounded (32px) geometry is mandatory
- Do not center body text — left-align all paragraphs, descriptions, and feature lists
- Do not use pure #000000 for body text or button backgrounds — use #111111 for a softer near-black
- Do not place dark cards on light backgrounds outside the footer — the Obsidian #1e1e1d inversion is reserved for terminal page sections only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Primary page background, dominant light field |
| 2 | Cream Card | `#f3efeb` | Warm editorial card surface — sits on canvas to create tonal depth without shadow |
| 3 | Obsidian Footer | `#1e1e1d` | Dark inversion for footer and terminal sections |

## Elevation

No drop shadows. The system intentionally avoids box-shadow entirely — depth is communicated through surface color contrast (cream #f3efeb on white #ffffff) and hairline borders (#e9eaeb), creating a flat editorial feel rather than a layered card-stack metaphor.

## Imagery

Photography is full-bleed editorial portraiture — medium-toned, warm-lit shots of tech professionals in candid working environments (holding laptops, walking through offices). Subjects are captured mid-action rather than posed, giving an authentic editorial-magazine quality. Images are treated with warm color grading that matches the cream/ivory interface tones, creating cohesion between photography and UI surfaces. Photography occupies the right column of the hero at large scale and appears as full-width supporting imagery in mid-page sections. No illustration or 3D renders — the visual language is exclusively photographic + typographic.

## Layout

Max-width 1280px centered container with generous side padding. The hero is a two-column asymmetric split: left ~55% holds headline + CTA + supporting copy + stat row, right ~45% holds a large editorial portrait photograph with no border or rounding treatment. Mid-page sections alternate between two-column text+icon-feature layouts and three-column feature card grids. Cards use generous 56px internal padding on cream #f3efeb surfaces. Section gaps are 80-120px creating a spacious, editorial rhythm. The footer is a full-width dark inversion (#1e1e1d) that closes the page with a multi-column link grid and a single inverse pill CTA. Navigation is a thin 88px top bar with logo left, nav center, auth buttons right.

## Agent Prompt Guide

## Quick Color Reference
- Canvas: #ffffff
- Card surface: #f3efeb (warm cream)
- Primary text: #111111
- Subtle text: #615e5b
- Hairline border: #e9eaeb (on white) / #d8d3cc (on cream)
- Footer surface: #1e1e1d
- primary action: #111111 (filled action)

## 3 Example Component Prompts
1. **Hero section**: White canvas (#ffffff). Two-column split. Left: headline at 60px Geist weight 500, #111111, letter-spacing -1.8px. Subtext at 18px Geist weight 400, #615e5b. Filled pill CTA: #111111 background, white text, 160px radius, 16px 24px padding. Right: full-bleed editorial portrait photograph. Below: stat row with Geist Mono 48px weight 500 values (#111111) and Geist 13px weight 500 uppercase labels (0.03em tracking).

2. **Cream editorial card**: Background #f3efeb, 32px border-radius, 56px padding all sides. Heading at 32px Geist weight 500, #111111, letter-spacing -0.96px. Body text at 18px Geist weight 400, #111111. No border, no shadow.

3. **Footer**: Full-width background #1e1e1d, 80px vertical padding. Multi-column link grid in Geist 16px weight 400 white text. Single inverse pill button: white background, #111111 text, 160px radius. Disclaimer text in Geist 10px weight 400 at ~60% opacity white.

## Typography Voice

The typography follows a deliberate restraint philosophy: weight 500 (not 700) at large sizes gives headlines authority through size and tracking, not volume. The -0.03em letter-spacing on all display text (32px+) tightens the letterforms for a refined editorial feel — headlines feel composed, not projected. Body copy sits at 16-18px weight 400 with default tracking, creating a calm reading rhythm. The signature move is Geist Mono at 48px for financial stats: monospaced digits at display size give numbers a distinctive editorial-print quality, differentiating data from prose and making financial figures feel considered rather than incidental.

## Motion Profile

Motion is moderate and unobtrusive. Primary duration is 0.3s with a custom easing curve cubic-bezier(0.83, 0, 0.17, 1) — a smooth-out curve that feels responsive but not bouncy. Properties transitioned most frequently: color (54×), transform (21×), opacity (15×), background-color (13×). Transitions are functional — hover state color shifts, subtle transforms — never decorative. The system avoids elaborate entrance animations or parallax.

## Similar Brands

- **Mercury** — Both use fully monochrome interfaces with pill-shaped buttons and generous editorial whitespace, though Mercury is dark-mode dominant while Titan stays light with warm cream surfaces
- **Wealthsimple** — Shared editorial-fintech aesthetic: generous typography, restrained palette, and rounded card geometry that feels more like a premium publication than a traditional banking product
- **Arc Browser** — Identical monochrome philosophy with pill-shaped UI elements and 32px card radii — both rely on surface tone contrast rather than shadows for depth
- **Copilot Money** — Personal finance apps that share the warm-neutral card-on-white pattern and the editorial typography approach to displaying financial data

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #111111;
  --color-pure-white: #ffffff;
  --color-mist-border: #e9eaeb;
  --color-cream-surface: #f3efeb;
  --color-tan-divider: #d8d3cc;
  --color-warm-subtle: #615e5b;
  --color-mid-gray: #888888;
  --color-pure-black: #000000;
  --color-obsidian: #1e1e1d;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 11;
  --tracking-micro: 0.33px;
  --text-overline: 13px;
  --leading-overline: 13;
  --tracking-overline: 0.39px;
  --text-body-sm: 16px;
  --leading-body-sm: 19.2;
  --text-body: 18px;
  --leading-body: 23.4;
  --text-body-lg: 20px;
  --leading-body-lg: 26;
  --text-subheading: 28px;
  --leading-subheading: 30.8;
  --tracking-subheading: -0.28px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 35.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 40px;
  --leading-heading: 44;
  --tracking-heading: -1.2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 52.8;
  --tracking-heading-lg: -0.48px;
  --text-display: 60px;
  --leading-display: 66;
  --tracking-display: -1.8px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-120px;
  --card-padding: 56px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 20px;
  --radius-3xl: 32px;
  --radius-full: 140px;
  --radius-full-2: 160px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-nav: 160px;
  --radius-tags: 9999px;
  --radius-cards: 32px;
  --radius-icons: 50%;
  --radius-buttons: 160px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-cream-card: #f3efeb;
  --surface-obsidian-footer: #1e1e1d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #111111;
  --color-pure-white: #ffffff;
  --color-mist-border: #e9eaeb;
  --color-cream-surface: #f3efeb;
  --color-tan-divider: #d8d3cc;
  --color-warm-subtle: #615e5b;
  --color-mid-gray: #888888;
  --color-pure-black: #000000;
  --color-obsidian: #1e1e1d;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 11;
  --tracking-micro: 0.33px;
  --text-overline: 13px;
  --leading-overline: 13;
  --tracking-overline: 0.39px;
  --text-body-sm: 16px;
  --leading-body-sm: 19.2;
  --text-body: 18px;
  --leading-body: 23.4;
  --text-body-lg: 20px;
  --leading-body-lg: 26;
  --text-subheading: 28px;
  --leading-subheading: 30.8;
  --tracking-subheading: -0.28px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 35.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 40px;
  --leading-heading: 44;
  --tracking-heading: -1.2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 52.8;
  --tracking-heading-lg: -0.48px;
  --text-display: 60px;
  --leading-display: 66;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 20px;
  --radius-3xl: 32px;
  --radius-full: 140px;
  --radius-full-2: 160px;
  --radius-full-3: 9999px;
}
```
