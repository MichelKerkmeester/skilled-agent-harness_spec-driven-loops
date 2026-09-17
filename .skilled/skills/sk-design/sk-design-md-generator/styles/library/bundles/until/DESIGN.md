# until — Style Reference
> warm parchment monograph under a single olive tree.

**Theme:** light

Until presents a warm, editorial biotech identity: a cream-paper canvas (#f7f3ec) carries nearly all surfaces, text is near-black (#121212), and a single olive green (#6c853b) acts as botanical punctuation on headings and borders. The system is fundamentally photographic — full-bleed overhead lifestyle imagery replaces illustration, and copy rides directly over pictures with no tinted overlays. Typography carries the weight: Neue Haas Display in compressed tracking at near-1.0 line-height creates a Swiss editorial cadence, while Neue Haas Text at 14–16px keeps body content quiet. Everything is rounded generously — 32px on cards, 64px on buttons — producing soft, pill-heavy UI that feels like a printed science monograph rather than a dashboard. Shadows are almost imperceptible; the cream-on-cream layering and thick border lines (1px solid #121212) provide separation instead of elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#f7f3ec` | `--color-parchment` | Page background, card surfaces, nav container — warm off-white that replaces pure white to soften the entire system |
| Ink | `#121212` | `--color-ink` | Primary text, all borders, card outlines, nav links — near-black with a whisper of warmth, drives every structural line on the page |
| Black | `#000000` | `--color-black` | Link borders, footer accents, and icon fills — pure black reserved for high-emphasis micro elements |
| Paper | `#ffffff` | `--color-paper` | Button fills, elevated surface accents, footer background — pure white used sparingly for contrast punctuation against the cream canvas |
| Mist | `#bebebe` | `--color-mist` | Disabled or secondary body text and subtle dividers — sits below the ink line |
| Olive Branch | `#6c853b` | `--color-olive-branch` | Heading color and accent borders — the sole chromatic note, an organic olive green that gives the brand its botanical, anti-corporate feel |
| Bone | `#121c0f` | `--color-bone` | Deep text on light backgrounds where extra weight is needed — almost-black with a green undertone matching the olive |

## Tokens — Typography

### neueHaasDisplay — Display and headings — from subhead at 24px to hero at 69px, with tight line-heights (0.90–1.10) and aggressive negative tracking (up to -0.037em) creating a compressed Swiss-editorial feel · `--font-neuehaasdisplay`
- **Substitute:** Neue Haas Grotesk Display Pro, or Inter at matching weight + tight letter-spacing
- **Weights:** 400, 500
- **Sizes:** 16px, 24px, 32px, 39px, 56px, 69px
- **Line height:** 0.90–1.50
- **Letter spacing:** -2.55px at 69px, -0.96px at 32px, -0.4px at 16px
- **Role:** Display and headings — from subhead at 24px to hero at 69px, with tight line-heights (0.90–1.10) and aggressive negative tracking (up to -0.037em) creating a compressed Swiss-editorial feel

### neueHaasText — Body copy, nav links, button labels, card text — 14px and 16px with moderate negative tracking (-0.025em at 14px, -0.009em at 16px), reads as a clean grotesque but not clinical · `--font-neuehaastext`
- **Substitute:** Neue Haas Grotesk Text Pro, or Inter
- **Weights:** 400, 500
- **Sizes:** 14px, 16px
- **Line height:** 1.43–1.50
- **Letter spacing:** -0.35px at 14px, -0.14px at 16px
- **Role:** Body copy, nav links, button labels, card text — 14px and 16px with moderate negative tracking (-0.025em at 14px, -0.009em at 16px), reads as a clean grotesque but not clinical

### Geist Mono — Captions, annotations, code-like labels, scroll prompts — 12–14px with +0.05em tracking on the 12px size, adds a technical/research-lab accent · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 500
- **Sizes:** 12px, 14px
- **Line height:** 1.40–1.50
- **Letter spacing:** -0.3px at 12px (normal), +0.7px at 12px (annotation)
- **OpenType features:** `"ss01" on`
- **Role:** Captions, annotations, code-like labels, scroll prompts — 12–14px with +0.05em tracking on the 12px size, adds a technical/research-lab accent

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.3px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.35px | `--text-body-sm` |
| body | 16px | 1.5 | -0.14px | `--text-body` |
| subheading | 24px | 1.1 | -0.6px | `--text-subheading` |
| heading-sm | 32px | 1 | -0.96px | `--text-heading-sm` |
| heading | 39px | 1 | -1.17px | `--text-heading` |
| heading-lg | 56px | 1 | -1.68px | `--text-heading-lg` |
| display | 69px | 0.9 | -2.55px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 64px |
| cards | 32px |
| small | 6px |
| badges | 50px |
| images | 24px |
| buttons | 64px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.1) 0px -1px 2px 0px inset, rgba(255...` | `--shadow-subtle` |
| xl | `rgba(0, 0, 0, 0.043) 0px 7.5px 30px 0px, rgba(255, 255, 2...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Navigation Bar
**Role:** Primary site navigation

Floating capsule container with 64px border-radius, white or cream fill, 1px solid #121212 border, 16px vertical padding. Brand wordmark left, centered nav links at 14px Neue Haas Text weight 400, rounded 'Join Us' button right. Sits over the hero with a subtle inset highlight.

### Pill Primary Button
**Role:** Main call-to-action

64px border-radius (full pill), white #ffffff fill, 1px solid #121212 border, 8px–16px horizontal padding, 14px Neue Haas Text weight 500, color #121212. Joins CTAs, contact actions, and team invites.

### Pill Ghost Button
**Role:** Secondary action

Same 64px radius and border as primary, but transparent fill over the cream canvas. Used in nav for 'Join Us' when not filled, and for lower-emphasis actions like FAQ links.

### Hero Display Headline
**Role:** First-screen editorial headline

Neue Haas Display 69px weight 400, line-height 0.90, letter-spacing -2.55px, color #121212 or #ffffff depending on image brightness. Sits bottom-left of the hero image, often paired with a Geist Mono 12px caption like '[ Scroll to discover ]'.

### Editorial Image Card
**Role:** Team / lab photography card

32px border-radius, 1px solid #121212 border, no shadow. Image fills the card edge-to-edge. Small Geist Mono label (e.g., '| 3 |') sits above in olive #6c853b or ink.

### Feature Image Card Grid
**Role:** Four-column lab/team showcase

Four cards in a row, each 32px radius, 1px solid #121212 border, equal width with 16–24px gaps. Numbered annotations in olive above each card: '| 1 | A remarkably interdisciplinary lab'.

### Recruitment Copy Block
**Role:** Hiring section text

Two-column layout: bold statement left in Neue Haas Display 32–39px weight 500, supporting paragraph right in Neue Haas Text 16px weight 400, color #121212. Pairs with a primary pill button below.

### Scroll Prompt Caption
**Role:** Editorial micro-label

Geist Mono 12px, color #ffffff over hero images, often wrapped in brackets '[ Scroll to discover ]' with +0.05em letter-spacing — functions as a typographic ornament.

### Top Header Strip
**Role:** Above-nav utility bar

Thin horizontal strip with the brand wordmark and three small dots on the left, nav links center, 'Join Us' pill right. Cream #f7f3ec fill, 1px #121212 bottom border.

### Full-Bleed Hero Image
**Role:** First-viewport visual

Edge-to-edge photograph (overhead lifestyle, grass/picnic scenes), no overlay tint, no border-radius on the image itself. Headline overlays directly on the image at bottom-left.

### Nav Pill Container
**Role:** Floating navigation capsule

White #ffffff pill with 64px radius, 1px #121212 border, floats centered at top of inner pages (not the hero). Contains two small dots (page indicator) and the 'Join Us' CTA.

### Borderless Stacked Section
**Role:** Content block separator

Sections flow into each other with only whitespace — no visible dividers. Vertical rhythm driven by 48–96px gaps between sections.

## Do's and Don'ts

### Do
- Use #f7f3ec as the page background on every screen; never substitute pure white for the main canvas.
- Set all headings in Neue Haas Display with letter-spacing between -0.020em and -0.037em — the negative tracking is the brand's editorial signature.
- Round all interactive elements to 64px (full pill) and all cards to 32px; the softness is non-negotiable.
- Use #6c853b olive only on heading text, heading underlines, and small annotation labels — never as a button fill or large surface.
- Use Geist Mono 12px with +0.05em tracking for bracketed micro-labels like '[ Scroll to discover ]' — these are decorative research-journal accents.
- Keep shadows to the single inset-highlight pattern (rgba(255,255,255,0.1) inset top and bottom + rgba(0,0,0,0.05) 0 3px 17px outer); avoid heavy drop-shadows.
- Maintain 48–96px vertical gaps between major sections; the page breathes like a printed magazine spread.

### Don't
- Do not use pure black (#000000) for body text — use #121212, which has a slight warmth matching the cream canvas.
- Do not introduce additional chromatic colors; the olive is the only accent and overusing it dilutes the botanical restraint.
- Do not use sharp corners (0–6px radius) on cards, buttons, or images — the rounded language defines the softness.
- Do not place text on tinted overlays over photography; headlines sit directly on images or on the cream canvas.
- Do not set body text below 14px or above 16px; the type scale is deliberately narrow and editorial.
- Do not use filled colored buttons — every CTA is a pill with a 1px #121212 border, either white or ghost.
- Do not use box-shadows heavier than the defined inset/outer combo; the system relies on cream-on-cream layering, not elevation.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#f7f3ec` | Base page background — every page, every section |
| 1 | Paper Elevation | `#ffffff` | Floating nav capsule, primary button fills, footer, elevated badges |
| 2 | Olive Accent | `#6c853b` | Decorative heading accents and annotation labels only |

## Elevation

- **Editorial Image Card:** `rgba(255, 255, 255, 0.1) 0px -1px 2px 0px inset, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.1) 0px 0px 2px 0px, rgba(0, 0, 0, 0.05) 0px 3px 17px 0px`
- **Floating Nav Pill:** `rgba(0, 0, 0, 0.043) 0px 7.5px 30px 0px, rgba(255, 255, 255, 0.3) 0px 1px 1px 0px inset`

## Imagery

Photography dominates the visual language: full-bleed overhead lifestyle shots of people in nature (a couple on a picnic blanket in grass, lab scientists at work) serve as the entire hero and section visuals. No illustration, no product renders, no abstract graphics. Images are treated raw — no overlays, no duotone, no rounded crops except inside cards (24–32px). The photography style is warm, natural-light, slightly nostalgic, shot from above or at eye level in real environments. Icons are minimal and inline; most visual punctuation is typographic (brackets, pipes, mono annotations). Density is image-heavy in the hero and card grids, text-dominant in body sections.

## Layout

Max-width 1200px centered container, full-bleed hero, then alternating cream bands. Hero is a full-viewport photograph with a bottom-left display headline and a centered floating nav pill at top. Content sections use a 4-column card grid for visual showcases (lab/team), then transition to 2-column text-heavy blocks for hiring copy. Navigation is a thin header strip on the home page and a floating white pill capsule on inner pages. Vertical rhythm is generous (48–96px between sections) creating a magazine-spread cadence. The page reads top-to-bottom as: hero photo → 4-up card grid → recruitment copy block → footer.

## Agent Prompt Guide

Quick Color Reference:
- text: #121212
- background: #f7f3ec
- border: #121212
- accent: #6c853b
- surface (elevated): #ffffff
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero section: full-bleed photograph background, no overlay tint. Headline at 69px neueHaasDisplay weight 400, color #ffffff, letter-spacing -2.55px, line-height 0.90, positioned bottom-left. Below the headline, add a 12px Geist Mono caption in white with +0.7px tracking: '[ Scroll to discover ]'.

2. Create a four-column image card grid: each card 32px border-radius, 1px solid #121212 border, 1px inset highlight rgba(255,255,255,0.1). Above each card, a small olive label in 12px Geist Mono: '| 1 |', '| 2 |', etc., color #6c853b. 24px gap between cards, all on #f7f3ec background.

3. Create a floating nav pill: white #ffffff fill, 64px border-radius, 1px solid #121212 border, horizontal padding 24px, vertical padding 8px. Contains two small black dots (8px circles) on the left and a 'Join Us' text button on the right in 14px neueHaasText weight 500, color #121212.

4. Create a recruitment copy block: two-column layout on #f7f3ec. Left column: headline at 39px neueHaasDisplay weight 500, color #121212, letter-spacing -1.17px. Right column: body text at 16px neueHaasText weight 400, color #121212, line-height 1.5. Below left column, a pill button: white fill, 64px radius, 1px #121212 border, padding 8px 16px, label 'Join the team' in 14px neueHaasText weight 500.

5. Create a secondary ghost button: transparent fill, 64px border-radius, 1px solid #121212 border, padding 8px 16px, label in 14px neueHaasText weight 500, color #121212. Sits on the cream canvas.

## Gradient System

A single decorative gradient appears on the site: linear-gradient(90deg, rgb(203, 53, 15) 0%, rgb(244, 224, 155) 50%, rgb(171, 193, 227) 100%) — a warm-to-cool sunset sweep (terracotta → cream → soft blue). This is used as a thin accent rule or section divider, not as a surface. Treat it as a rare typographic ornament, not a fill.

## Similar Brands

- **Ginkgo Bioworks** — Same cream-canvas editorial biotech aesthetic with large display type and minimal chromatic palette
- **Modern Meadow** — Similar warm off-white backgrounds, soft rounded cards, and bio-laboratory photography in lifestyle settings
- **Notion (marketing site)** — Pill-shaped CTAs, generous border-radius on cards, and restrained near-monochrome palette with a single accent
- **Arc Browser** — Cream canvas with near-black text, tight Neue-Haas-style display tracking, and full-bleed photographic hero treatment

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #f7f3ec;
  --color-ink: #121212;
  --color-black: #000000;
  --color-paper: #ffffff;
  --color-mist: #bebebe;
  --color-olive-branch: #6c853b;
  --color-bone: #121c0f;

  /* Typography — Font Families */
  --font-neuehaasdisplay: 'neueHaasDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaastext: 'neueHaasText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.14px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.96px;
  --text-heading: 39px;
  --leading-heading: 1;
  --tracking-heading: -1.17px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.68px;
  --text-display: 69px;
  --leading-display: 0.9;
  --tracking-display: -2.55px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 50px;
  --radius-full-2: 64px;

  /* Named Radii */
  --radius-nav: 64px;
  --radius-cards: 32px;
  --radius-small: 6px;
  --radius-badges: 50px;
  --radius-images: 24px;
  --radius-buttons: 64px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px -1px 2px 0px inset, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.1) 0px 0px 2px 0px, rgba(0, 0, 0, 0.05) 0px 3px 17px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.043) 0px 7.5px 30px 0px, rgba(255, 255, 255, 0.3) 0px 1px 1px 0px inset;

  /* Surfaces */
  --surface-parchment-canvas: #f7f3ec;
  --surface-paper-elevation: #ffffff;
  --surface-olive-accent: #6c853b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #f7f3ec;
  --color-ink: #121212;
  --color-black: #000000;
  --color-paper: #ffffff;
  --color-mist: #bebebe;
  --color-olive-branch: #6c853b;
  --color-bone: #121c0f;

  /* Typography */
  --font-neuehaasdisplay: 'neueHaasDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaastext: 'neueHaasText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.14px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.96px;
  --text-heading: 39px;
  --leading-heading: 1;
  --tracking-heading: -1.17px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.68px;
  --text-display: 69px;
  --leading-display: 0.9;
  --tracking-display: -2.55px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 50px;
  --radius-full-2: 64px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px -1px 2px 0px inset, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.1) 0px 0px 2px 0px, rgba(0, 0, 0, 0.05) 0px 3px 17px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.043) 0px 7.5px 30px 0px, rgba(255, 255, 255, 0.3) 0px 1px 1px 0px inset;
}
```
