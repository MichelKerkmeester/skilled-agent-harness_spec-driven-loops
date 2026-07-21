# Clipdrop — Style Reference
> photo studio on bone paper

**Theme:** light

Clipdrop reads like a contemporary art-book spread rendered as a working tool: bone-white canvas, oversized editorial serif headlines, a single vivid cobalt for actions, and generous negative space that lets the image-heavy content breathe. Surfaces are flat and borderless, with the visual system doing its work through typography, a 16px card radius, and pill-shaped controls rather than shadows or gradients. The checkerboard transparency pattern in the hero establishes the brand's image-tool DNA without competing with the photography. Color is rationed — almost the entire interface lives in three near-blacks and an off-white, with cobalt blue and a single warm orange used as precise functional punctuation for primary actions and brand marks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cobalt Signal | `#1c60f6` | `--color-cobalt-signal` | Violet action color for filled buttons, selected navigation states, and focused conversion moments |
| Ember Vermillion | `#fa4028` | `--color-ember-vermillion` | Brand mark accent, the Jasper wordmark stem, and the rare warm fill. Used sparingly so it never dilutes the cobalt's primacy as the action color |
| Midnight Ink | `#24355c` | `--color-midnight-ink` | Deep navy-violet for icon fills and emphasis body copy. Sits between black and cobalt in the chromatic hierarchy — a quieter alternative to pure black when an element needs a hint of brand color |
| Periwinkle Mist | `#c9d7f5` | `--color-periwinkle-mist` | Soft lavender-blue used as a ghost/secondary button surface. Reads as a desaturated echo of Cobalt Signal — the same hue at low saturation, signaling a non-primary action without going neutral |
| Bone | `#ededed` | `--color-bone` | Page canvas, hairline borders, and the dominant surface tone. With 1000+ occurrences it is the structural backbone of the system — everything else sits on it or is carved out of it |
| Ink Black | `#000000` | `--color-ink-black` | Maximum-emphasis headings, primary text, and icon strokes. Reserved for the loudest moments; never used for body copy where 2d2d/404040 take over |
| Charcoal | `#2d2d2d` | `--color-charcoal` | Headings and button text — slightly softer than pure black for elements that need weight but not the harshest contrast |
| Graphite | `#404040` | `--color-graphite` | Body copy, secondary headings, and icon fills. The workhorse neutral — used wherever readability matters but Ink Black feels too heavy |
| Slate | `#767676` | `--color-slate` | Muted helper text, captions, and low-emphasis labels. The lightest text color that still passes on bone canvas |
| Frost | `#dddddd` | `--color-frost` | Subtle dividers and elevated surface tone, one step darker than the canvas bone. Used when a section needs a quiet visual break |
| Ash | `#8f8f8f` | `--color-ash` | Card and tag backgrounds in compact density zones. Mid-gray surface that lifts content off the bone canvas without introducing color |
| Onyx | `#171717` | `--color-onyx` | Deep alternative to Ink Black for links and emphasis icons when the element needs to feel slightly warmer or paired with cobalt |
| Paper White | `#ffffff` | `--color-paper-white` | Button text on cobalt fills, and the second surface tier for cards/elevated content layered over bone canvas |

## Tokens — Typography

### Primary — Primary — detected in extracted data but not described by AI · `--font-primary`
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 20px
- **Line height:** 1, 1.2, 1.4, 1.5
- **Role:** Primary — detected in extracted data but not described by AI

### Custom Sans (likely Inter or a geometric humanist substitute) — Body copy, UI labels, button text, captions, card titles. The utilitarian workhorse — never decorative. Weight 500 for emphasis, 600 for card titles, 400 for body and labels. · `--font-custom-sans-likely-inter-or-a-geometric-humanist-substitute`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 20px
- **Line height:** 1.00–1.50
- **Letter spacing:** normal
- **Role:** Body copy, UI labels, button text, captions, card titles. The utilitarian workhorse — never decorative. Weight 500 for emphasis, 600 for card titles, 400 for body and labels.

### Editorial Serif (custom — high-contrast modern serif, Didone family) — Hero and section headlines only. The signature choice — a whisper-weight serif at display sizes against an otherwise sans-serif interface creates editorial tension. Weight 400 at 96px is anti-convention; most AI tool brands use 700 sans-serif, this trusts the typeface's contrast and tracking to carry authority. · `--font-editorial-serif-custom-high-contrast-modern-serif-didone-family`
- **Substitute:** GT Sectra, Tiempos Headline, or Newsreader
- **Weights:** 400
- **Sizes:** 60, 96px
- **Line height:** 1.10
- **Letter spacing:** -0.02em
- **Role:** Hero and section headlines only. The signature choice — a whisper-weight serif at display sizes against an otherwise sans-serif interface creates editorial tension. Weight 400 at 96px is anti-convention; most AI tool brands use 700 sans-serif, this trusts the typeface's contrast and tracking to carry authority.

### SecondaryFont — SecondaryFont — detected in extracted data but not described by AI · `--font-secondaryfont`
- **Weights:** 400
- **Sizes:** 60px, 96px
- **Line height:** 1.1
- **Letter spacing:** -0.02
- **Role:** SecondaryFont — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading | 60px | 1.1 | -1.2px | `--text-heading` |
| display | 96px | 1.1 | -1.92px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| links | 8px |
| buttons | 9999px |
| smallButtons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 20-24px
- **Element gap:** 8-12px

## Components

### Cobalt Primary Button
**Role:** The only filled CTA on the site

Pill-shaped (9999px radius), #1c60f6 background, Paper White (#ffffff) text, 12px vertical × 20px horizontal padding, Inter weight 500 at 14-16px. Single-CTA-per-section discipline — these are the moments the system actually demands an action.

### Ghost Outline Button
**Role:** Secondary navigation and boundary actions

Pill-shaped (9999px radius), 1px #ededed border on bone canvas, #2d2d2d text, 12px × 20px padding. Used for 'Tools', 'API', 'Jasper Free Trial', 'Pricing' in the header and for 'Show more' in the FAQ.

### Periwinkle Soft Button
**Role:** Tertiary or low-emphasis action

Pill-shaped, #c9d7f5 background, Midnight Ink (#24355c) text. The desaturated echo of the cobalt primary — signals 'available but not required'.

### Tool Card
**Role:** Grid card showcasing each AI tool capability

White (#ffffff) surface, 16px border-radius, image-first layout (full-bleed photo up to 16px radius corners), 20-24px padding on the text block. Title in Inter weight 600 at 16px with small icon prefix; description in Inter weight 400 at 14px Graphite (#404040). No visible border or shadow — the card is defined purely by the white-on-bone surface contrast.

### Hero Visual Card
**Role:** Full-width hero showcase with transparency grid

Rounded container (16px radius) with a checkerboard transparency pattern as background, overlay text in white at 48-60px editorial serif, play button centered. This is the signature component — it visually communicates 'image tool' without explanation.

### FAQ Accordion Row
**Role:** Expandable question/answer in the FAQ section

Full-width row, 1px #ededed bottom border, no background. Question in Inter weight 500 at 16px in Charcoal (#2d2d2d), chevron icon in Slate (#767676) on the left. Expanded answers add 12-16px vertical padding.

### Header Navigation Bar
**Role:** Sticky top navigation

Bone (#ededed) background matching canvas, no border, 64-80px height. Logo left ('Clipdrop by jasper' with 'jasper' in Ember Vermillion), centered or right-aligned nav links in Inter weight 500 at 14px Charcoal, 'Sign-in / Sign-up' as Ghost Outline Button on the far right.

### Editorial Section Heading
**Role:** Centered section titles like 'Tools' and 'Frequently Asked Questions'

Editorial serif at 60px, weight 400, letter-spacing -1.2px, Charcoal (#2d2d2d) color, centered alignment. The visual signature of the entire site — never use sans-serif for section titles, the serif is reserved for these moments.

### Icon Prefix Tag
**Role:** Small icon+label used in tool cards

Inter weight 600 at 16px, 4-8px gap between icon and text, icon in Midnight Ink (#24355c) at 16-20px.

## Do's and Don'ts

### Do
- Use the editorial serif at 60-96px for all section and page headlines — never substitute the sans-serif for these moments
- Use Cobalt Signal (#1c60f6) as the only filled button background on the page — one CTA per section maximum
- Apply 16px border-radius to all cards, images, and media containers
- Use pill-shaped (9999px) radius for every button, tag, and pill control
- Keep the page bone canvas (#ededed) as the dominant background — introduce white only for cards that need to lift
- Pair Ember Vermillion (#fa4028) exclusively with the Jasper wordmark or single-point brand accents
- Use 1px #ededed hairline borders for section dividers, never rely on shadows to separate regions

### Don't
- Don't use the editorial serif for body copy, UI labels, or button text — it is reserved for headlines only
- Don't introduce green/red semantic colors for success/error states — extend the neutral and cobalt palette instead
- Don't add drop shadows to cards, buttons, or navigation — the system is intentionally flat
- Don't use 9999px radius on cards or images — pill radius is for buttons and tags only
- Don't fill large surfaces with Periwinkle Mist (#c9d7f5) — it is a button surface, not a section background
- Don't set body copy in pure black (#000000) — use Graphite (#404040) or Charcoal (#2d2d2d) for text
- Don't stack more than one Cobalt primary button in the same viewport — the system demands action hierarchy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ededed` | Full-page background — the bone paper that the entire system is printed on. |
| 2 | Card Surface | `#ffffff` | Tool cards, FAQ items, and any content block that needs to lift off the canvas. |
| 3 | Subtle Elevation | `#dddddd` | Quiet section dividers and inline emphasis blocks, one shade darker than canvas. |

## Elevation

- **Tool Card:** `none — cards rely on white surface against bone canvas, no shadow`
- **FAQ Row:** `none — dividers are 1px #ededed borders, not shadows`
- **Header:** `none — flat against canvas`

## Imagery

Photography is the dominant visual content — tool cards feature lifestyle and product photography (people, fashion, objects, food) that demonstrate the AI capabilities. Images are full-bleed within 16px-radius card containers, no internal padding. The hero features a checkerboard transparency grid as a signature graphic element, communicating 'image tool' instantly. No illustrations or 3D renders are used; no abstract decorative graphics. Icon style is minimal outlined/duotone in Midnight Ink or Slate, 16-20px, single-stroke weight.

## Layout

Max-width 1200px centered container on a full-bleed bone canvas. Hero is a centered editorial headline (96px serif) above a single large media card spanning the container width. Below the hero, the Tools section uses a 3-column card grid with generous gutters (24-32px). The FAQ section switches to a single-column centered stack. Section gaps are 64-80px — spacious, editorial breathing room. The header is a single-row sticky bar with left-aligned logo and right-aligned nav. No sidebar, no mega-menu.

## Agent Prompt Guide

Quick Color Reference:
- text primary: #000000 / Charcoal #2d2d2d
- text body: #404040
- text muted: #767676
- canvas: #ededed
- card surface: #ffffff
- border: #ededed
- accent: #24355c (icons, emphasis)
- primary action: #1c60f6 (filled action)

Example Component Prompts:

1. Create an editorial hero: bone (#ededed) canvas, centered serif headline at 96px weight 400 letter-spacing -1.92px in #2d2d2d reading like a magazine title. Below it, a full-width 16px-radius card with a checkerboard transparency grid background, white overlay text at 60px, and a centered circular play button.

2. Build a tool card: white (#ffffff) surface, 16px border-radius, no shadow. Top half is a full-bleed lifestyle photo clipped to the 16px radius. Bottom half has 20px padding, a small 16px icon in #24355c, title in Inter weight 600 at 16px in #2d2d2d, description in Inter weight 400 at 14px in #404040.

3. Create a ghost navigation button: pill-shaped (9999px radius), 1px #ededed border, 12px vertical × 20px horizontal padding, Inter weight 500 at 14px in #2d2d2d. Used for secondary nav items.

4. Build a FAQ accordion row: full-width, no background, 1px #ededed bottom border. Chevron icon in #767676 on the left, question text in Inter weight 500 at 16px in #2d2d2d, 16px vertical padding.

5. Create a Cobalt primary button: pill-shaped (9999px radius), #1c60f6 background, #ffffff text, Inter weight 500 at 16px, 14px vertical × 24px horizontal padding. The only filled action button on the site.

## Similar Brands

- **Framer** — Same oversized editorial headlines over a near-white canvas with a single saturated blue accent driving actions
- **Linear** — Similar pill-shaped controls, hairline borders, and flat surfaces — though Linear is dark, the component vocabulary overlaps
- **Arc Browser** — Same editorial typography choice mixing a display serif with a workhorse sans for body, generous spacing, single accent color
- **Vercel** — Minimalist near-white canvas, generous vertical rhythm, hairline borders, and a single chromatic action color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cobalt-signal: #1c60f6;
  --color-ember-vermillion: #fa4028;
  --color-midnight-ink: #24355c;
  --color-periwinkle-mist: #c9d7f5;
  --color-bone: #ededed;
  --color-ink-black: #000000;
  --color-charcoal: #2d2d2d;
  --color-graphite: #404040;
  --color-slate: #767676;
  --color-frost: #dddddd;
  --color-ash: #8f8f8f;
  --color-onyx: #171717;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-primary: 'Primary', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-sans-likely-inter-or-a-geometric-humanist-substitute: 'Custom Sans (likely Inter or a geometric humanist substitute)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-serif-custom-high-contrast-modern-serif-didone-family: 'Editorial Serif (custom — high-contrast modern serif, Didone family)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-secondaryfont: 'SecondaryFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading: 60px;
  --leading-heading: 1.1;
  --tracking-heading: -1.2px;
  --text-display: 96px;
  --leading-display: 1.1;
  --tracking-display: -1.92px;

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
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 20-24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-links: 8px;
  --radius-buttons: 9999px;
  --radius-smallbuttons: 12px;

  /* Surfaces */
  --surface-canvas: #ededed;
  --surface-card-surface: #ffffff;
  --surface-subtle-elevation: #dddddd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cobalt-signal: #1c60f6;
  --color-ember-vermillion: #fa4028;
  --color-midnight-ink: #24355c;
  --color-periwinkle-mist: #c9d7f5;
  --color-bone: #ededed;
  --color-ink-black: #000000;
  --color-charcoal: #2d2d2d;
  --color-graphite: #404040;
  --color-slate: #767676;
  --color-frost: #dddddd;
  --color-ash: #8f8f8f;
  --color-onyx: #171717;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-primary: 'Primary', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-sans-likely-inter-or-a-geometric-humanist-substitute: 'Custom Sans (likely Inter or a geometric humanist substitute)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-serif-custom-high-contrast-modern-serif-didone-family: 'Editorial Serif (custom — high-contrast modern serif, Didone family)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-secondaryfont: 'SecondaryFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading: 60px;
  --leading-heading: 1.1;
  --tracking-heading: -1.2px;
  --text-display: 96px;
  --leading-display: 1.1;
  --tracking-display: -1.92px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```
