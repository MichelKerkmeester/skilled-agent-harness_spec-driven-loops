# Backlight — Style Reference
> Vermillion stamp on warm vellum — a printed catalog cover where one ink red commands the cream page and everything else stays in quiet grayscale.

**Theme:** light

Backlight uses a warm editorial language built on cream vellum and one vermillion accent. The full-bleed orange-red hero acts as the cover page of a printed catalog, with white type and a single white pill button as the only allowed elements. Below the hero, the canvas shifts to warm cream (#e4ddd5) carrying white cards, dark text, and a thin peach hairline (#f3b8a9) that traces the grid like a printer's rule. Chat-bubble cards are used as a signature device to dramatize team conversations and pain points. The type system is confident but quiet — Instrument Sans with consistent negative tracking creates density without weight, and Fragment Mono punctuates timestamps and metadata. The palette never escalates: no shadows, no gradients, no secondary accents — just warm neutrals, one bold red, and a single full-bleed black band for tonal contrast.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vermillion | `#dd3508` | `--color-vermillion` | Orange accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Peach Hairline | `#f3b8a9` | `--color-peach-hairline` | Orange outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Cream Vellum | `#e4ddd5` | `--color-cream-vellum` | Page canvas below the hero, input borders, soft surface washes — the warm paper stock everything else sits on |
| Bone White | `#ffffff` | `--color-bone-white` | Card surfaces, button fills on the orange hero, nav text on dark/orange, inverted typography — the bright surface layer |
| Midnight Ink | `#151515` | `--color-midnight-ink` | Primary headings, body text, dark section backgrounds, chat bubble fills, button borders on light — the heavy type and the rare full-bleed dark band |
| Graphite | `#4f4f4f` | `--color-graphite` | Card borders, secondary text, muted UI rules — the mid-neutral that softens edges between Bone White and Midnight Ink |
| Charcoal | `#333333` | `--color-charcoal` | Link text on light surfaces, image strokes, secondary borders |
| Ochre Tan | `#d7cabb` | `--color-ochre-tan` | Badge backgrounds and borders, secondary surface tint — a warm neutral tag fill that sits between cream and peach |
| Press Black | `#000000` | `--color-press-black` | Icon fills, tight border accents, true-black for print-style contrast moments |

## Tokens — Typography

### Instrument Sans — Primary interface and editorial typeface. Weight 500 for nav and buttons, weight 600 for headings, weight 400 for body. Consistent -0.02em tracking across all sizes tightens the geometric forms and gives the warm palette a modern editorial voice. The slight positive tracking at caption (12px) opens up small labels so they don't feel crushed. · `--font-instrument-sans`
- **Substitute:** Inter, DM Sans, or system-ui sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 20, 24, 28, 32, 39, 48
- **Line height:** 1.00, 1.15, 1.20, 1.25, 1.30, 1.43
- **Letter spacing:** -0.020em at 14px and up; +0.020em at 12px caption
- **Role:** Primary interface and editorial typeface. Weight 500 for nav and buttons, weight 600 for headings, weight 400 for body. Consistent -0.02em tracking across all sizes tightens the geometric forms and gives the warm palette a modern editorial voice. The slight positive tracking at caption (12px) opens up small labels so they don't feel crushed.

### Fragment Mono — Accent monospace for timestamps in chat bubbles, metadata labels, and small data tags. The extreme -0.08em tracking at 14px collapses letterforms into a dense printed-stamp feel that contrasts the airy sans-serif body. · `--font-fragment-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400, 700
- **Sizes:** 14, 16
- **Line height:** 1.00, 1.15, 1.30
- **Letter spacing:** -0.08em at 14px, -0.02em at 16px
- **Role:** Accent monospace for timestamps in chat bubbles, metadata labels, and small data tags. The extreme -0.08em tracking at 14px collapses letterforms into a dense printed-stamp feel that contrasts the airy sans-serif body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 17 | 0.24px | `--text-caption` |
| body-sm | 14px | 20 | -0.28px | `--text-body-sm` |
| body | 16px | 21 | -0.32px | `--text-body` |
| subheading | 18px | 23 | -0.36px | `--text-subheading` |
| heading-sm | 20px | 24 | -0.4px | `--text-heading-sm` |
| heading | 24px | 29 | -0.48px | `--text-heading` |
| heading-lg | 32px | 37 | -0.64px | `--text-heading-lg` |
| display | 39px | 45 | -0.78px | `--text-display` |
| display-lg | 48px | 48 | -0.96px | `--text-display-lg` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 60px |
| inputs | 4px |
| buttons | 80px |
| chat-bubbles | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 16-24px
- **Element gap:** 16px

## Components

### Primary Pill Button
**Role:** Hero CTA and form submit

Bone White (#ffffff) fill, Midnight Ink (#151515) text, 1px Midnight Ink border, 80px border-radius (full pill), 12px 24px padding, Instrument Sans 14px weight 500. Sits on the Vermillion hero as the only permitted action element.

### Outlined Action Button
**Role:** Secondary call-to-action on light backgrounds

Transparent fill, 1px Vermillion (#dd3508) border, Midnight Ink text, 80px border-radius, 12px 24px padding, Instrument Sans 14px weight 500. The chromatic border is the only color this button carries.

### Email Input
**Role:** Hero capture form

Transparent background, 1px Bone White border, Bone White placeholder text, 4px border-radius, Instrument Sans 14px, 12px 16px padding. No focus ring color change — the border remains the same weight.

### Transparent Nav Bar
**Role:** Top navigation over the Vermillion hero

Sits directly on the Vermillion hero with no background fill. Logo 'BACKLIGHT' left in Bone White, Instrument Sans 12px weight 600, letter-spacing wide (uppercase tracking). Nav items in Bone White, 14px weight 500, with Peach Hairline (#f3b8a9) underline indicating active state. Primary CTA is a Bone White pill button flush right.

### Hero Band
**Role:** Full-bleed opening section

Vermillion (#dd3508) background spanning full viewport width, 64-96px vertical padding, left-aligned content with 1200px max-width. Display headline in Bone White at 48px, body at 18px in Bone White. The hero is the only place Vermillion appears as a surface.

### Dark Contrast Band
**Role:** Full-bleed section for tonal break

Midnight Ink (#151515) background, Bone White text, 64-96px vertical padding. Used sparingly — once per page — to create a printed-poster moment of inversion between the warm cream sections.

### Chat Bubble Card (Dark)
**Role:** Team pain-point messaging on light background

Midnight Ink (#151515) fill, Bone White text, 20px border-radius, 16px padding, small avatar circle on the left. Name + Fragment Mono 14px timestamp above message, message in Instrument Sans 16px weight 400. Functions as a social-proof dramatization device.

### Chat Bubble Card (Light)
**Role:** Team pain-point messaging on light background (alternate)

Bone White fill, Graphite (#4f4f4f) 1px border, Midnight Ink text, 20px border-radius, 16px padding. Same internal structure as the dark variant but inverts the relationship — sits on Cream Vellum canvas.

### FAQ Accordion Row
**Role:** Expandable question list

Full-width row, Graphite (#4f4f4f) 1px hairline divider, 24px vertical padding, Instrument Sans 18px weight 500 question text in Midnight Ink. Plus icon right-aligned in Vermillion (#dd3508), 20px. No background fill, no card chrome — the divider does the visual work.

### Carousel Arrow Button
**Role:** Horizontal content navigation

Circular button, 40px diameter, Bone White fill, Midnight Ink (#151515) 1px border, Midnight Ink chevron icon centered. Left/right pair sits above content blocks.

### Product Card
**Role:** Feature or product listing

Bone White fill, Graphite (#4f4f4f) 1px border, 8px border-radius, 16-24px padding, Instrument Sans 18px weight 500 title in Midnight Ink, body at 14px in Graphite. No shadow, no hover elevation — the border carries the definition.

### Pill Badge
**Role:** Status, category, or NEW tag

Ochre Tan (#d7cabb) background, Graphite (#4f4f4f) 1px border, 60px border-radius (pill), 4px 12px padding, Instrument Sans 12px weight 500 in Midnight Ink. Used for 'NEW' labels and category tags.

### Sticky Promo Banner
**Role:** Bottom-right persistent announcement

Midnight Ink (#151515) fill, 8px border-radius, Bone White text, Fragment Mono 12px weight 700 for the 'NEW' label in Vermillion, headline at 16px Instrument Sans weight 500, inline thumbnail image on the right with Peach Hairline border.

### Footer
**Role:** Site footer with link columns

Sits on the Vermillion hero continuation or transitions to Midnight Ink. Bone White text, Instrument Sans 14px, link columns separated by Peach Hairline (#f3b8a9) vertical rules. Logo bottom-left in Bone White uppercase.

## Do's and Don'ts

### Do
- Use Vermillion (#dd3508) as a full-bleed hero background — it is the only place this color appears as a surface
- Set border-radius to 80px (full pill) for all primary buttons and to 8px for all cards and rectangular elements
- Apply -0.02em letter-spacing to all Instrument Sans text at 14px and above; use +0.02em at 12px caption
- Use Cream Vellum (#e4ddd5) as the page canvas and Bone White (#ffffff) for all cards and surfaces that sit on it
- Use Fragment Mono at 14px with -0.08em tracking for timestamps, metadata, and small data labels in chat bubbles
- Use chat-bubble cards (dark or light, 20px radius) to dramatize team conversations and social proof moments
- Limit Vermillion accents on light backgrounds to thin 1px borders and small icons (FAQ plus, carousel arrows)

### Don't
- Do not add drop shadows, glow effects, or any box-shadow to cards, buttons, or modals — the system is intentionally flat
- Do not use Vermillion as a filled button background — it is only an outlined-action border and a hero surface
- Do not use Peach Hairline (#f3b8a9) as a text color or interactive fill — it is decorative border only
- Do not introduce a second chromatic accent color — the system is monochromatic warm with one red
- Do not use gradients anywhere in the interface — surfaces are solid colors only
- Do not use Midnight Ink (#151515) as body text on the Vermillion hero — all hero text must be Bone White
- Do not center-align headlines — Backlight's editorial voice is left-aligned with generous left padding

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Vellum | `#e4ddd5` | Page canvas — the warm paper background that carries the majority of content |
| 1 | Bone White | `#ffffff` | Cards, chat bubbles, button fills — the bright surface layer above the canvas |
| 2 | Midnight Ink | `#151515` | Dark chat bubbles, full-bleed contrast bands, footer — tonal inversion surfaces |
| 3 | Vermillion | `#dd3508` | Hero band — the single chromatic surface, used once per page for maximum impact |

## Elevation

Flat by design. No drop shadows, no elevation effects. Surface separation is achieved entirely through color contrast between the warm cream canvas and Bone White cards, and through thin 1px borders in Graphite. This reinforces the printed/editorial feel — the design reads as ink on paper, not as digital elevation.

## Imagery

Backlight uses three image modes: (1) small circular avatar portraits inside chat bubble cards, shown at ~32px with a subtle Peach Hairline border, (2) inline product/media thumbnails in the sticky promo banner with a 1px Peach Hairline stroke, and (3) full-bleed media crops on the right edge of content sections, treated with sharp rectangular edges (no rounding) so they read as printed halftones. Photography is warm-toned and editorial — never stock-lifestyle. No illustrations, no 3D renders, no abstract graphics. The visual language is print-catalog: portraits, media stills, and chat artifacts arranged in a grid of cards and bubbles.

## Layout

Backlight is a left-aligned, max-width 1200px layout with full-bleed section bands. The hero is a full-viewport-width Vermillion band with left-aligned headline and email capture. Below the hero, the layout alternates between Cream Vellum canvas and occasional Midnight Ink full-bleed bands. Content blocks use generous 64-96px vertical section gaps. The FAQ section is a single-column list of left-aligned questions with right-aligned Vermillion plus icons. Carousel sections use left/right circular arrow buttons above horizontally-scrolling content. Navigation is a transparent top bar flush with the hero — no sticky behavior, no background fill until the hero ends. The page reads top-to-bottom as a sequence of editorial spreads: orange cover, cream pages with card grids and chat dramatizations, one black inversion page, then a warm footer.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #151515
- text (muted/border): #4f4f4f
- background (canvas): #e4ddd5
- surface (cards/buttons): #ffffff
- accent border (outlined action, hero surface): #dd3508
- decorative border (printed rules): #f3b8a9
- primary action: #dd3508 (outlined action border)

**Example Component Prompts**
1. **Vermillion Hero Band**: Full-width #dd3508 background, 96px vertical padding. Headline at 48px Instrument Sans weight 500, #ffffff, letter-spacing -0.96px, left-aligned with 1200px max-width container. Body text at 18px weight 400, #ffffff. Top nav: 'BACKLIGHT' logo in 12px Instrument Sans weight 600 uppercase, #ffffff, with 0.24px letter-spacing. Nav links in #ffffff 14px weight 500. Right-aligned white pill button: #ffffff fill, #151515 text, 1px #151515 border, 80px radius, 12px 24px padding.
2. **Cream Canvas Section with Chat Cards**: #e4ddd5 background. Section heading at 32px Instrument Sans weight 500, #151515, letter-spacing -0.64px, left-aligned. Below: a staggered layout of chat bubble cards — alternating between #151515 dark bubbles (20px radius, 16px padding, #ffffff text, Fragment Mono 14px weight 400 at -1.12px letter-spacing for timestamps) and #ffffff light bubbles with 1px #4f4f4f border (same 20px radius and internal structure).
3. **FAQ Accordion List**: #e4ddd5 background. List of questions at 18px Instrument Sans weight 500, #151515, 24px vertical padding, separated by 1px #4f4f4f hairline dividers. Each row has a Vermillion (#dd3508) plus icon right-aligned, 20px size. No background fill on rows — dividers do the work.
4. **Dark Contrast Band**: Full-width #151515 background, 80px vertical padding. Headline at 32px Instrument Sans weight 500, #ffffff. 1200px max-width content container, left-aligned.
5. **Outlined Action Button on Cream Canvas**: Transparent fill, 1px #dd3508 border, 80px border-radius, #151515 text at 14px Instrument Sans weight 500, 12px 24px padding. The chromatic border is the only color the button carries.

## Similar Brands

- **Frame.io** — Same warm editorial palette with cream/beige surfaces and a single bold accent — both are media-workflow tools that favor a printed-catalog feel over a typical SaaS dashboard
- **Pitch** — Same warm cream canvas with one strong accent color and left-aligned editorial headlines — both use generous spacing and chat/bubble cards as signature visual devices
- **Ceros** — Same warm-toned, editorial-brand aesthetic with flat surfaces, no shadows, and a single chromatic voice — both treat the page as a printed publication
- **Stripe** — Same tight tracking on display headlines, generous section spacing, and confident use of a warm-leaning palette with one strong accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vermillion: #dd3508;
  --color-peach-hairline: #f3b8a9;
  --color-cream-vellum: #e4ddd5;
  --color-bone-white: #ffffff;
  --color-midnight-ink: #151515;
  --color-graphite: #4f4f4f;
  --color-charcoal: #333333;
  --color-ochre-tan: #d7cabb;
  --color-press-black: #000000;

  /* Typography — Font Families */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fragment-mono: 'Fragment Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 17;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 21;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 23;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 24;
  --tracking-heading-sm: -0.4px;
  --text-heading: 24px;
  --leading-heading: 29;
  --tracking-heading: -0.48px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 37;
  --tracking-heading-lg: -0.64px;
  --text-display: 39px;
  --leading-display: 45;
  --tracking-display: -0.78px;
  --text-display-lg: 48px;
  --leading-display-lg: 48;
  --tracking-display-lg: -0.96px;

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
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 16-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 60px;
  --radius-full-2: 80px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 60px;
  --radius-inputs: 4px;
  --radius-buttons: 80px;
  --radius-chat-bubbles: 20px;

  /* Surfaces */
  --surface-cream-vellum: #e4ddd5;
  --surface-bone-white: #ffffff;
  --surface-midnight-ink: #151515;
  --surface-vermillion: #dd3508;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vermillion: #dd3508;
  --color-peach-hairline: #f3b8a9;
  --color-cream-vellum: #e4ddd5;
  --color-bone-white: #ffffff;
  --color-midnight-ink: #151515;
  --color-graphite: #4f4f4f;
  --color-charcoal: #333333;
  --color-ochre-tan: #d7cabb;
  --color-press-black: #000000;

  /* Typography */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fragment-mono: 'Fragment Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 17;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 21;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 23;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 24;
  --tracking-heading-sm: -0.4px;
  --text-heading: 24px;
  --leading-heading: 29;
  --tracking-heading: -0.48px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 37;
  --tracking-heading-lg: -0.64px;
  --text-display: 39px;
  --leading-display: 45;
  --tracking-display: -0.78px;
  --text-display-lg: 48px;
  --leading-display-lg: 48;
  --tracking-display-lg: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 60px;
  --radius-full-2: 80px;
}
```
