# Rally — Style Reference
> Cosmic farewell observatory

**Theme:** dark

Rally speaks in the language of deep space: a near-black canvas scattered with faint starfield noise, a single elevated navy card carrying the message, and a solitary colorful planet anchoring the bottom. The palette is monastic — only three tones do all the work: a near-black ground, a slightly lifted midnight blue for the message surface, and white for type. Black appears not as ink but as a hairline material — thin dividers and card borders that subdivide the void into readable zones. Typography is quiet and even: a single variable grotesque carries both the farewell headline and the body copy at restrained sizes, with a touch of positive tracking that lets the words breathe against the dark. Everything curves softly (24px card radius) and everything is spaced generously, giving the page the feel of a quiet observatory rather than a product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#0d100d` | `--color-void` | Page canvas — the near-black ground on which everything floats |
| Midnight Surface | `#08102b` | `--color-midnight-surface` | Elevated message cards and content surfaces — a slightly bluer lift off the Void |
| Halo | `#ffffff` | `--color-halo` | Primary text, heading strokes, and reverse-mode accents |
| Hairline | `#000000` | `--color-hairline` | Hairline borders, dividers, and card outlines — 1px strokes that architect the void |

## Tokens — Typography

### TikTok Sans Variable — Headlines (32px) and body copy (24px) — the only voice on the page. Slight positive tracking (0.0150em) and the cv04 alternate glyph set soften the geometric grotesque into something more human. Variable weight axis available for whisper-to-emphasis range. · `--font-tiktok-sans-variable`
- **Substitute:** Inter, Sohne, General Sans
- **Weights:** 400
- **Sizes:** 24px, 32px
- **Line height:** 1.10, 1.40
- **Letter spacing:** 0.0150em
- **OpenType features:** `"cv04"`
- **Role:** Headlines (32px) and body copy (24px) — the only voice on the page. Slight positive tracking (0.0150em) and the cv04 alternate glyph set soften the geometric grotesque into something more human. Variable weight axis available for whisper-to-emphasis range.

### system-ui sans-serif — Micro-labels, nav chrome, and small supporting text. 12px is the floor — nothing smaller. · `--font-system-ui-sans-serif`
- **Substitute:** SF Pro Text, Inter, Segoe UI
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Micro-labels, nav chrome, and small supporting text. 12px is the floor — nothing smaller.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 24px | 1.4 | 0.36px | `--text-body` |
| heading | 32px | 1.1 | 0.48px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24px |
| buttons | 24px |

### Layout

- **Page max-width:** 720px
- **Section gap:** 48px
- **Card padding:** 40px
- **Element gap:** 20px

## Components

### Farewell Card
**Role:** Primary content container — holds all narrative copy on the page

Midnight Surface (#08102b) background, 24px border-radius, 1px Hairline (#000000) border, generous 40px+ padding on all sides. Contains a 32px headline and 24px body paragraphs in Halo (#ffffff). Centered horizontally with max-width ~720px. No shadow — the slight color lift off the Void does the elevation work.

### Wordmark Header
**Role:** Brand identification at page top

Lowercase 'rally' wordmark, white fill, centered, 12-16px equivalent, no other nav elements. Sits directly on the Void canvas with comfortable padding above and below.

### Hero Planet Illustration
**Role:** Sole decorative visual — a full-color 3D globe anchoring the page bottom

Full-color 3D render of Earth with greens, blues, and warm pink atmospheric edges. Centered below the card, roughly 50% of viewport width. The only chromatic element on the page — provides emotional warmth against the cold void.

### Starfield Background
**Role:** Ambient atmosphere — textural noise across the page

Faint scattered points of light overlaid on the Void (#0d100d) canvas. Not interactive, not a pattern — just sparse visual grain that gives the dark surface a sense of depth and space.

### Hairline Divider
**Role:** Structural separator between sections or around card edges

1px solid Hairline (#000000) stroke. Used on card borders and as subtle section separators. 60 occurrences as border-color confirm this is a primary structural material, not decoration.

### Body Paragraph
**Role:** Long-form copy within the Farewell Card

24px TikTok Sans Variable, weight 400, line-height 1.4, letter-spacing 0.36px, Halo (#ffffff) on Midnight Surface (#08102b). 20px gap between paragraphs.

## Do's and Don'ts

### Do
- Use Midnight Surface (#08102b) exclusively for the one elevated message card — never repeat it for a second surface
- Keep all type in TikTok Sans Variable weight 400 with 0.0150em tracking and cv04 enabled — this is the voice
- Use 24px radius for all cards and 9999px for any tag or pill — soft curves are mandatory against the hard void
- Let the Void (#0d100d) breathe: maintain at least 48px vertical section gaps and 40px card padding
- Anchor the page with a single colorful visual element at the bottom to balance the monochrome upper half
- Use Hairline (#000000) 1px borders on all card edges — color lift alone is not enough to define a surface

### Don't
- Do not introduce any additional chromatic colors — the palette is complete at three tones plus the planet illustration
- Do not use system-ui sans-serif for anything above 12px — the variable font carries everything visible
- Do not apply shadows or elevation effects — surface differentiation is purely color-based
- Do not break the 720px max-width on the message card — wide lines kill the intimacy
- Do not add navigation, CTAs, or interactive elements — this is a farewell, not a funnel
- Do not use white backgrounds — the entire page lives in the dark

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#0d100d` | Page canvas — the deep-space ground |
| 1 | Midnight Surface | `#08102b` | Elevated card surface carrying the primary message |
| 2 | Halo | `#ffffff` | Reverse text and highlight moments |

## Imagery

The page carries exactly one piece of imagery: a full-color 3D-rendered globe of Earth positioned below the message card, occupying roughly the bottom third of the viewport. The planet is rendered in a painterly, slightly soft style with green continents, blue oceans, and warm pink/magenta atmospheric edges catching light. It is the only chromatic element on an otherwise monochrome page, creating a powerful focal point and emotional anchor. The illustration is contained (not full-bleed), centered, and floats on the dark void without a container or border. No photography, no icons, no product screenshots — the planet is the entire visual story.

## Layout

Centered single-column layout. The page is max-width 720px for the content card, centered within the viewport. The composition reads top-to-bottom in three zones: (1) wordmark header, (2) single message card with all copy, (3) planet illustration. Hero is a full-viewport-height dark canvas — no split layouts, no asymmetric grids, no sidebar. Section rhythm is minimal: header, then 48px gap, then card, then 48px gap, then planet. The starfield texture provides ambient continuity across the full height.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #0d100d (Void)
- Card surface: #08102b (Midnight Surface)
- Primary text: #ffffff (Halo)
- Border / hairline: #000000 (Hairline)
- Decorative: full-color 3D Earth globe
- primary action: no distinct CTA color

## Example Component Prompts

1. **Farewell Card**: Centered card, max-width 720px, background #08102b, 1px solid #000000 border, 24px border-radius, 48px padding top and bottom, 40px padding left and right. Contains a 32px headline and 24px body paragraphs in #ffffff on this surface.

2. **Wordmark Header**: White (#ffffff) lowercase 'rally' wordmark, centered horizontally, 12px system-ui sans-serif, positioned at the top of the page with 32px of padding above and below, sitting directly on the #0d100d canvas.

3. **Body Paragraph Block**: 24px TikTok Sans Variable weight 400, line-height 1.4, letter-spacing 0.0150em, #ffffff text, 20px vertical gap between paragraphs, 720px max-width.

4. **Planet Illustration**: Full-color 3D Earth render, centered, roughly 50% of viewport width, positioned at the bottom of the page below the card, floating on the #0d100d void without a container.

5. **Starfield Overlay**: Sparse scattered white and light-blue dots, very low opacity, distributed randomly across the full #0d100d page background. Purely decorative texture, no interaction.

## Similar Brands

- **Stripe** — Same restrained dark-canvas approach with a single elevated surface and generous breathing room around limited content
- **Linear** — Dark-mode interface language with hairline borders as primary structural material and minimal color palette
- **Arc browser** — Cosmic/space-themed dark canvas with sparse content and a single colorful visual element as focal point
- **Vercel** — Near-black background with minimal palette, generous spacing, and content that reads as a quiet centered statement

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #0d100d;
  --color-midnight-surface: #08102b;
  --color-halo: #ffffff;
  --color-hairline: #000000;

  /* Typography — Font Families */
  --font-tiktok-sans-variable: 'TikTok Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 24px;
  --leading-body: 1.4;
  --tracking-body: 0.36px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: 0.48px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 720px;
  --section-gap: 48px;
  --card-padding: 40px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-buttons: 24px;

  /* Surfaces */
  --surface-void: #0d100d;
  --surface-midnight-surface: #08102b;
  --surface-halo: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #0d100d;
  --color-midnight-surface: #08102b;
  --color-halo: #ffffff;
  --color-hairline: #000000;

  /* Typography */
  --font-tiktok-sans-variable: 'TikTok Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 24px;
  --leading-body: 1.4;
  --tracking-body: 0.36px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: 0.48px;

  /* Spacing */
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-3xl: 24px;
}
```
