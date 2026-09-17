# DrawHistory — Style Reference
> Warm gallery wall behind charcoal display panels

**Theme:** mixed

DrawHistory presents a muted editorial language: warm parchment canvas framed by charcoal display panels, like an exhibition catalog spread open on a gallery table. The system is overwhelmingly achromatic — near-black, warm off-white, and a dusty olive-charcoal — with a single saffron dot used as the only chromatic punctuation. Typography carries the entire personality: Eloquia Text at weight 300 in uppercase, aggressively tracked negative, creates the hushed, architectural tone of a museum wall label. Components are flat, borderless except for hairline outlines on ghost controls, and rely on surface-tone shifts rather than shadows to establish hierarchy. Density is spacious; whitespace does the structural work that borders and elevation do in more conventional systems.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#faf6f3` | `--color-parchment` | Page canvas, body text on dark panels — a warm desaturated cream that makes the dark editorial cards feel inset rather than overlaid |
| Ash | `#e5e7eb` | `--color-ash` | Hairline borders, dividers, subtle surface separators — the workhorse neutral that defines the 1px structural rhythm across the page |
| Smoke | `#999999` | `--color-smoke` | Secondary borders and muted structural lines where Ash is too present |
| Silver | `#b3b3b3` | `--color-silver` | Input borders and disabled-state surfaces |
| Ink | `#000000` | `--color-ink` | Primary text, icon strokes, and the darkest borders on light surfaces |
| Bone | `#ffffff` | `--color-bone` | Reverse text on dark panels, card surfaces, and icon fills on dark backgrounds |
| Olive Charcoal | `#3d3b2f` | `--color-olive-charcoal` | Warm editorial panel surface (left card) and primary action background — a dusty olive-black that distinguishes DrawHistory's signature dark from generic #111 |
| Obsidian | `#1d1d1b` | `--color-obsidian` | Deep display panel surface (right card) and button background — the second editorial tone, slightly cooler and deeper than Olive Charcoal |
| Saffron Dot | `#ff6714` | `--color-saffron-dot` | Sole chromatic accent — announcement indicators and small functional punctuation only. Never used for fills, buttons, or large areas |

## Tokens — Typography

### Eloquia Text — Primary typeface across all UI text. Weight 300 in uppercase at display sizes (55–104px) creates the signature hushed editorial tone — the same approach as museum wall labels, where the label's weight is anti-authoritarian and confident. Body copy uses weight 400 at 16–18px. The negative tracking tightens as size increases, compressing display headlines while keeping body text optically normal. · `--font-eloquia-text`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 300, 400
- **Sizes:** 14, 16, 18, 20, 22, 35, 36, 40, 44, 55, 100, 104
- **Line height:** 0.95–1.56
- **Letter spacing:** -0.05em at 100–104px (-5 to -5.2px), -0.03em at 35–55px (-1.05 to -1.65px), -0.025em at 18–22px (-0.45 to -0.55px), -0.018em at 16px (-0.29px), -0.009em at 14px (-0.13px), normal for body
- **OpenType features:** `"case" on for uppercase tracking, "ss01" if available for alternate letterforms`
- **Role:** Primary typeface across all UI text. Weight 300 in uppercase at display sizes (55–104px) creates the signature hushed editorial tone — the same approach as museum wall labels, where the label's weight is anti-authoritarian and confident. Body copy uses weight 400 at 16–18px. The negative tracking tightens as size increases, compressing display headlines while keeping body text optically normal.

### Roboto Mono — Monospace label typeface for technical or meta annotations — small captions, metadata, button labels in outlined buttons. Its geometric monospaced rhythm contrasts with Eloquia's editorial proportions, providing a secondary voice for system-level information. · `--font-roboto-mono`
- **Substitute:** IBM Plex Mono, JetBrains Mono, Space Mono
- **Weights:** 400
- **Sizes:** 14, 15, 16
- **Line height:** 1.25–1.50
- **Role:** Monospace label typeface for technical or meta annotations — small captions, metadata, button labels in outlined buttons. Its geometric monospaced rhythm contrasts with Eloquia's editorial proportions, providing a secondary voice for system-level information.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.13px | `--text-caption` |
| body | 16px | 1.5 | -0.29px | `--text-body` |
| subheading | 20px | 1.4 | -0.5px | `--text-subheading` |
| heading-sm | 22px | 1.4 | -0.55px | `--text-heading-sm` |
| heading | 36px | 1.13 | -1.08px | `--text-heading` |
| heading-lg | 44px | 1.1 | -1.32px | `--text-heading-lg` |
| display | 100px | 0.95 | -5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 144 | 144px | `--spacing-144` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 9999px |
| images | 16px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Editorial Display Card — Olive
**Role:** Primary editorial panel for narrative content with imagery

Warm dark surface (#3d3b2f), 16px radius, generous internal padding (~32px), uppercase Eloquia Text at weight 300 in Parchment (#faf6f3). Contains a rounded photo (16px radius), short body paragraph in weight 400, and a ghost outlined button at the bottom. No shadow — the card's tonal contrast against the Parchment canvas is the only elevation signal.

### Editorial Display Card — Obsidian
**Role:** Deep display panel for logo or brand-identity content

Near-black surface (#1d1d1b), 16px radius, same 32px internal padding, uppercase Eloquia Text at weight 300 in Bone (#ffffff). Center-anchored logo block with generous vertical breathing room. Pairs beside the Olive card as a tonal counterpoint — one warm-dark, one cool-deep.

### Ghost Outlined Button
**Role:** Primary call-to-action across both light and dark surfaces

Transparent fill, 1px border in current text color (Parchment on dark cards, Ink on light surfaces), 8px radius, 12px 24px padding. Label in Roboto Mono weight 400 at 14px, uppercase, letter-spacing normal. On hover: fill becomes a 10% opacity wash of the border color. Never filled — the system's restraint is the point.

### Announcement Bar
**Role:** Site-wide notification strip above main content

Sits on Parchment canvas, centered text in Eloquia Text weight 400 at 14px, uppercase, tracked. Prefixed by a 6px Saffron Dot (#ff6714) acting as the sole chromatic punctuation in the system. No background fill, no border — just inline text and dot.

### Rounded Photo Block
**Role:** Inset image within editorial cards

16px border radius, no border, natural aspect ratio (roughly 1:1 or 4:3). Photos carry the only color in the editorial panels — the people and environments provide warmth against the Olive Charcoal background. No overlay, no treatment, no duotone.

### Logo Display Block
**Role:** Brand mark container within Obsidian cards

Centrally placed, 16px radius hairline border in a desaturated white (~20% opacity), generous internal padding (32–40px). The logo itself renders in solid Bone (#ffffff) at large scale. The bordered frame around the logo creates a second layer of inset within the panel.

### Card Headline
**Role:** Section-level heading within editorial cards

Eloquia Text weight 300, uppercase, ~35–36px, line-height 1.13, letter-spacing -1.08px. Color: Parchment on dark cards, Ink on light surfaces. Never bold — the thin weight IS the hierarchy. Wraps to 2 lines maximum.

### Card Body Copy
**Role:** Supporting paragraph text within editorial cards

Eloquia Text weight 400, sentence case, 16px, line-height 1.50, letter-spacing -0.29px. Color: Parchment (#faf6f3) on dark cards. Max width ~360px to maintain comfortable measure. Center-aligned within cards.

### Hairline Divider
**Role:** Structural separator between sections or within lists

1px solid Ash (#e5e7eb), full-width within container. The workhorse divider — used 820+ times in raw data, forming the page's structural rhythm.

## Do's and Don'ts

### Do
- Set headlines in Eloquia Text weight 300 uppercase with negative tracking; the thin weight is the hierarchy, not font-size alone
- Use 16px radius for all card-level surfaces and images, 8px for buttons, 9999px for pill tags — never mix these radius families
- Build the page on Parchment (#faf6f3) canvas and let Olive Charcoal (#3d3b2f) and Obsidian (#1d1d1b) panels create depth through tonal contrast
- Use Saffron Dot (#ff6714) only as a 6–8px indicator — never as a fill, button background, or large accent area
- Set body copy at 16px Eloquia Text weight 400 with -0.29px tracking; sentence case, never uppercase
- Use Roboto Mono for button labels and meta annotations to create a secondary technical voice distinct from Eloquia's editorial tone
- Maintain 80px section gaps and 32px card padding as the structural rhythm — the spaciousness IS the design

### Don't
- Do not use weight 500–700 for Eloquia Text headlines — the weight 300 whisper is the signature; heavier weights break the gallery tone
- Do not add box-shadows to cards or panels — tonal contrast against Parchment canvas is the only elevation system
- Do not use color for call-to-action buttons — stay with ghost outlined controls on both light and dark surfaces
- Do not place the Saffron accent on large areas, fills, or text — it is a 6–8px dot, not a brand color
- Do not use #0000ee or default browser blue for links — links should inherit the current text color and rely on underline or context
- Do not use rounded corners larger than 16px on cards or images — the geometry is architectural, not playful
- Do not mix the Olive Charcoal and Obsidian panel tones on the same card — one card, one panel tone, paired side by side

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#faf6f3` | Page background — warm cream that sets the editorial gallery tone |
| 1 | Olive Charcoal Panel | `#3d3b2f` | Warm editorial display card surface |
| 2 | Obsidian Panel | `#1d1d1b` | Deep editorial display card surface |
| 3 | Hairline Layer | `#e5e7eb` | Border and divider surface on light canvas |

## Elevation

DrawHistory deliberately avoids shadows as an elevation signal. The system uses tonal contrast — Parchment canvas against Olive Charcoal and Obsidian panels — to create depth. This is a flat editorial approach where surface-value shifts replace drop-shadow layering. Adding shadows would break the gallery-wall metaphor.

## Imagery

The site uses warm-toned portrait photography as the sole source of color in editorial panels. Photos are tightly cropped, environmental portraits of people in natural settings, presented at 16px radius within Olive Charcoal cards. The right panel uses a pure typographic logo mark in Bone on Obsidian — no imagery, just type as visual. The outer page background is a heavily blurred photographic wash visible at the viewport edges, creating an atmospheric gallery-wall effect. No illustrations, no 3D, no abstract graphics. Iconography is minimal and stroke-based in Eloquia Text's weight, using Ink or Parchment depending on surface.

## Layout

The page is a centered single-viewport announcement spread on Parchment canvas, max-width ~1200px. The hero is a two-column card grid: left Olive Charcoal panel (narrative + portrait photo + ghost button) and right Obsidian panel (logo + ghost button), each roughly 50% width with a small gap between them. A single-line announcement bar sits above the cards, centered. The blurred photo background extends full-bleed behind everything, visible as atmosphere at the viewport margins. Navigation is minimal or absent from the visible viewport — the announcement cards ARE the primary content. Section rhythm is generous: 80px between the announcement bar and cards, 32px internal card padding. No sidebar, no multi-section scroll structure visible — the design is a focused editorial moment.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (on light) / #faf6f3 (on dark)
- background: #faf6f3 (Parchment canvas)
- border: #e5e7eb (Ash hairline)
- accent: #ff6714 (Saffron Dot — 6–8px only)
- primary action: no distinct CTA color
- panel surface: #3d3b2f (warm) or #1d1d1b (deep)

**Example Component Prompts**

1. *Olive Editorial Card*: 16px radius, #3d3b2f background, 32px padding. Headline at 36px Eloquia Text weight 300, uppercase, #faf6f3, letter-spacing -1.08px, line-height 1.13. Body at 16px weight 400, #faf6f3, line-height 1.50, max-width 360px, centered. Rounded photo at 16px radius centered above body. Ghost button at bottom: transparent fill, 1px #faf6f3 border, 8px radius, 12px 24px padding, label in Roboto Mono 14px uppercase #faf6f3.

2. *Obsidian Logo Card*: 16px radius, #1d1d1b background, 32px padding, centered content. Inner logo frame: 16px radius, 1px border in rgba(255,255,255,0.2), generous internal padding. Logo mark in #ffffff, large scale. Ghost button below: transparent fill, 1px #ffffff border, 8px radius, 12px 24px padding, Roboto Mono 14px uppercase label.

3. *Announcement Bar*: Centered on #faf6f3 canvas. 6px #ff6714 dot, then 14px Eloquia Text weight 400, uppercase, #000000, letter-spacing -0.13px. No background, no border, no padding beyond vertical centering.

4. *Card Headline*: 36px Eloquia Text weight 300, uppercase, #faf6f3 on dark / #000000 on light, letter-spacing -1.08px, line-height 1.13. Maximum 2 lines. Never bold.

5. *Hairline Divider*: 1px solid #e5e7eb, full container width, no margins. The most-used structural element — use freely to establish rhythm.

## Radius System

Three radius values, strictly enforced: 16px for cards and images (the editorial scale), 8px for buttons and small interactive surfaces (the functional scale), 9999px for pill-shaped tags and avatars (the chip scale). Do not introduce intermediate values like 4px, 10px, or 12px — the binary simplicity is part of the geometric discipline.

## Tonal Pairing Logic

Dark editorial panels always come in pairs: one Olive Charcoal (#3d3b2f) and one Obsidian (#1d1d1b). The warm/cool tonal contrast between them creates visual rhythm without any border or shadow. A single panel alone feels incomplete; a triad or more feels redundant. This is a two-card system.

## Similar Brands

- **Aesop** — Same warm-cream canvas with deeply muted dark editorial panels, light-weight uppercase typography, and ghost outlined controls — both treat whitespace and surface tone as the primary structural system
- **Studio Dumbar** — Editorial agency language with weight 300 uppercase display type on warm dark panels, minimal color, and the same gallery-installation restraint
- **Pentagram** — Architectural typography, generous whitespace, and the convention of letting a single piece of content occupy a full viewport moment with no competing UI chrome
- **It's Nice That** — Warm parchment background with editorial card layouts, thin sans-serif type, and the same anti-SaaS presentation ethos

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #faf6f3;
  --color-ash: #e5e7eb;
  --color-smoke: #999999;
  --color-silver: #b3b3b3;
  --color-ink: #000000;
  --color-bone: #ffffff;
  --color-olive-charcoal: #3d3b2f;
  --color-obsidian: #1d1d1b;
  --color-saffron-dot: #ff6714;

  /* Typography — Font Families */
  --font-eloquia-text: 'Eloquia Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.29px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.55px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: -1.08px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.32px;
  --text-display: 100px;
  --leading-display: 0.95;
  --tracking-display: -5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-144: 144px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-images: 16px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-parchment-canvas: #faf6f3;
  --surface-olive-charcoal-panel: #3d3b2f;
  --surface-obsidian-panel: #1d1d1b;
  --surface-hairline-layer: #e5e7eb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #faf6f3;
  --color-ash: #e5e7eb;
  --color-smoke: #999999;
  --color-silver: #b3b3b3;
  --color-ink: #000000;
  --color-bone: #ffffff;
  --color-olive-charcoal: #3d3b2f;
  --color-obsidian: #1d1d1b;
  --color-saffron-dot: #ff6714;

  /* Typography */
  --font-eloquia-text: 'Eloquia Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.29px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.55px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: -1.08px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.32px;
  --text-display: 100px;
  --leading-display: 0.95;
  --tracking-display: -5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-144: 144px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```
