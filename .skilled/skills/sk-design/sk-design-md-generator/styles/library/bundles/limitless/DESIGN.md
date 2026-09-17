# Limitless — Style Reference
> monochrome editorial on plaster white. A single weight-contrast typeface, no accent color, and one violet spark — the system achieves identity through restraint, not decoration.

**Theme:** light

Limitless reads as a restrained editorial spread — white paper, a single neutral typeface doing all the talking, and almost no color anywhere. The interface depends on weight contrast inside one font family (Greycliff at 300 for display, 500–600 for body and UI) rather than color or ornament to create hierarchy. Surfaces are nearly invisible: the page is #f2f3f5, cards barely register above it at #ffffff or #e5e7eb tints, and the only true color in the system is a single small violet spark in the wordmark. The personality is funeral-formal-meets-product-page — wide left-aligned headlines at 60px, generous 48–80px vertical breathing room, and one subtle 16px corner radius to keep things from feeling boxy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Plaster | `#f2f3f5` | `--color-plaster` | Page background, full-bleed canvas |
| Mist | `#e5e7eb` | `--color-mist` | Card surfaces, placeholder image wells, subtle inset zones |
| Chalk | `#ffffff` | `--color-chalk` | Elevated card surfaces when differentiation from Plaster is needed |
| Hairline | `#d1d5db` | `--color-hairline` | Stronger dividers, disabled icon strokes, secondary borders |
| Inkstone | `#0f172a` | `--color-inkstone` | Primary heading text, high-emphasis body copy, nav logo wordmark |
| Slate | `#334155` | `--color-slate` | Secondary headings, medium-emphasis text, icon strokes |
| Graphite | `#475569` | `--color-graphite` | Body text, nav links, button labels — the everyday workhorse neutral |
| Pewter | `#64748b` | `--color-pewter` | Muted helper text, secondary links, metadata |
| Fog | `#939eae` | `--color-fog` | Disabled state text, tertiary captions, low-emphasis labels |
| Obsidian | `#000000` | `--color-obsidian` | Maximum-contrast text where #0f172a still feels too soft (rare) |
| Spark Violet | `#6d4aff` | `--color-spark-violet` | Wordmark icon and the sole chromatic accent in the entire system — used at the smallest possible size to mark the brand without coloring the interface |

## Tokens — Typography

### Greycliff — Single-family system. Weight 300 carries display (60px) and large headings (36px) for a quiet, editorial whisper. Weight 400–500 handles body (16–18px) and UI labels. Weight 600–700 reserved for emphasis and the wordmark. Because there is no secondary face, the system creates rhythm purely through weight and size contrast inside one typeface. · `--font-greycliff`
- **Substitute:** Inter (for body), Söhne or GT America (for display)
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 14, 16, 18, 30, 36, 60
- **Line height:** 1.00, 1.11, 1.20, 1.43, 1.50, 1.56, 1.63
- **Letter spacing:** -0.025em applied at display and heading sizes; relaxes to near-normal at body sizes
- **Role:** Single-family system. Weight 300 carries display (60px) and large headings (36px) for a quiet, editorial whisper. Weight 400–500 handles body (16–18px) and UI labels. Weight 600–700 reserved for emphasis and the wordmark. Because there is no secondary face, the system creates rhythm purely through weight and size contrast inside one typeface.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.56 | — | `--text-body-lg` |
| subheading | 30px | 1.2 | -0.75px | `--text-subheading` |
| heading | 36px | 1.11 | -0.9px | `--text-heading` |
| display | 60px | 1 | -1.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| inputs | 8px |
| avatars | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(30, 41, 59, 0.15) 0px 25px 50px -12px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Display Heading
**Role:** Hero and page-level titles

60px Greycliff weight 300, color #0f172a, line-height 1.0, letter-spacing -1.5px. Left-aligned, never centered. The light weight is the signature — it reads as editorial, not marketing.

### Section Heading
**Role:** H2-level headings

36px Greycliff weight 300, color #0f172a, line-height 1.11, letter-spacing -0.9px. Same whisper-weight treatment as display.

### Body Paragraph
**Role:** Long-form content

16px Greycliff weight 400, color #334155, line-height 1.63. Generous line height for reading comfort; link color #475569.

### Pill Button
**Role:** Primary and secondary actions

16px Greycliff weight 500, padding 8px 16px, border-radius 9999px. Filled variant uses #0f172a background with #ffffff text. Ghost variant has transparent background with #475569 text and 1px #e5e7eb border. No drop shadow.

### Nav Link
**Role:** Top navigation items

16px Greycliff weight 400, color #475569. Hover transitions to #0f172a. Active state uses #0f172a. No underline, no background — weight shift carries the state.

### Brand Mark / Wordmark
**Role:** Logo in nav

Violet spark icon (#6d4aff) to the left of the wordmark 'Limitless' in 16px Greycliff weight 600, color #0f172a. The spark is the only chromatic element allowed at any size.

### Hero Image Well
**Role:** Large media placeholder on the landing surface

16px border-radius, background #e5e7eb, centered icon glyph indicating media slot. Single permitted use of the slate-tinted shadow: rgba(30, 41, 59, 0.15) 0px 25px 50px -12px. Minimum height 360px.

### Content Card
**Role:** General-purpose surface for grouped content

Background #ffffff, 16px border-radius, padding 24px, no border, no shadow. Sits on the #f2f3f5 canvas with a tone-on-tone contrast.

### Article / Message Block
**Role:** Long-form communication (CEO message, legal text)

No card chrome. Flows directly on the #f2f3f5 page background. Heading at 18px Greycliff weight 600, body at 16px weight 400, line-height 1.63. Inline links underlined in #475569.

### Inset Placeholder
**Role:** Empty-state or media slot inside a content area

Background #e5e7eb, 16px border-radius, no border, no padding chrome. Holds a centered line-icon at #939eae.

### Footer
**Role:** Page-bottom utility links

16px Greycliff weight 400, color #64748b, separated from content by 48–64px vertical space. No background change from the page.

## Do's and Don'ts

### Do
- Use Greycliff weight 300 for any text 30px and above — the light weight is the brand's voice, not a fallback
- Maintain letter-spacing of -0.025em on display and heading sizes; let it relax to normal at body sizes
- Keep the palette monochromatic on the page surface — introduce the violet spark (#6d4aff) only in the wordmark icon, never as a button fill, border, or background
- Use 16px border-radius for all cards and image wells; use 9999px (full pill) for all buttons, tags, and avatars
- Apply the single shadow (rgba(30, 41, 59, 0.15) 0px 25px 50px -12px) only to the hero media well — do not propagate it to cards or modals
- Set body text to #334155 and nav/UI text to #475569 — reserve #0f172a for headings and the wordmark
- Use 8px and 16px for inline element gaps; jump to 48px or 64px between sections; never use 24px as a section gap

### Don't
- Do not introduce a second typeface — the system is single-family by design
- Do not use weight 700 on headings; weight 300 is the display treatment and weight 500–600 is the UI treatment
- Do not use a chromatic color as a button background, link color, or badge fill — the interface is intentionally colorless
- Do not add borders to cards that sit on #f2f3f5; let the white-on-plaster contrast do the work
- Do not center display headings — they are always left-aligned with the content column
- Do not use sharp corners (0–4px radius) on any surface — the system reads rounded or pill, never squared
- Do not stack multiple shadow layers or add glow effects — one shadow, used once, is the rule

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f2f3f5` | Full-bleed page background; the dominant neutral that everything else sits on |
| 1 | Card Surface | `#ffffff` | Standard card or content block raised above the page |
| 2 | Inset / Placeholder | `#e5e7eb` | Image wells, empty-state panels, subtle inset zones that need to feel present without competing with content |

## Elevation

- **Hero / Feature Panel:** `rgba(30, 41, 59, 0.15) 0px 25px 50px -12px`

## Imagery

The site is text-dominant with a single large media placeholder per page (the hero well). Photography or video would sit inside the #e5e7eb image well at 16px radius with the slate-tinted shadow. Icons are line-style, single-weight, drawn in #939eae or #475569. No illustrations, no decorative graphics, no background patterns — the visual rest between text blocks is the design.

## Layout

Max-width 1200px centered content column on a #f2f3f5 full-bleed canvas. The hero is a left-aligned 60px headline above a single full-width image well. Subsequent sections stack vertically with 48–64px gaps, flowing as flat content blocks with no alternating bands. Navigation is a single horizontal bar at the top with logo left, links center, sign-in right. The layout never goes multi-column at the section level — cards and feature blocks are stacked, not gridded, keeping the editorial reading rhythm intact.

## Agent Prompt Guide

**Quick Color Reference**
- text (heading): #0f172a
- text (body): #334155
- text (muted): #64748b
- background (page): #f2f3f5
- background (card): #ffffff
- border / divider: #e5e7eb
- accent: #6d4aff (wordmark icon only)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Hero section: #f2f3f5 page background. Headline at 60px Greycliff weight 300, #0f172a, letter-spacing -1.5px, line-height 1.0, left-aligned. Below it, a #e5e7eb image well at 16px radius, minimum 360px tall, with the shadow rgba(30, 41, 59, 0.15) 0px 25px 50px -12px and a centered #939eae line-icon.
2. Section heading block: 36px Greycliff weight 300, #0f172a, letter-spacing -0.9px, line-height 1.11. 48px of space above.
3. Body paragraph: 16px Greycliff weight 400, #334155, line-height 1.63, max-width 680px. Inline links in #475569 with underline.
4. Ghost nav button: transparent background, 1px #e5e7eb border, 9999px radius, 8px 16px padding, 16px Greycliff weight 500, #475569 text. Hover shifts text to #0f172a.
5. Content card: #ffffff background, 16px radius, 24px padding, no border, no shadow. Sits on the #f2f3f5 canvas with tone-on-tone contrast.

## Voice & Restraint Principle

Limitless is a maximalist product housed in a minimalist site. Every visual decision defers to the writing. When in doubt: remove the color, remove the border, remove the shadow, lower the weight. The system gets quieter before it gets louder.

## Similar Brands

- **Things 3 (Cultured Code)** — Same single-typeface confidence, same near-monochrome surface treatment, same editorial left-aligned hierarchy with whisper-weight display sizes
- **Notion (early marketing site)** — White-paper canvas, one neutral sans carrying all hierarchy, content blocks that flow without card chrome or borders
- **Linear (docs / changelog)** — Slate-tinted neutrals (#0f172a, #334155, #475569) as the entire typographic palette with virtually no chromatic accent
- **Vercel (product pages)** — Restrained black-and-white system where identity comes from typeface weight contrast and generous spacing rather than color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-plaster: #f2f3f5;
  --color-mist: #e5e7eb;
  --color-chalk: #ffffff;
  --color-hairline: #d1d5db;
  --color-inkstone: #0f172a;
  --color-slate: #334155;
  --color-graphite: #475569;
  --color-pewter: #64748b;
  --color-fog: #939eae;
  --color-obsidian: #000000;
  --color-spark-violet: #6d4aff;

  /* Typography — Font Families */
  --font-greycliff: 'Greycliff', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.75px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: -0.9px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-inputs: 8px;
  --radius-avatars: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(30, 41, 59, 0.15) 0px 25px 50px -12px;

  /* Surfaces */
  --surface-page-canvas: #f2f3f5;
  --surface-card-surface: #ffffff;
  --surface-inset-placeholder: #e5e7eb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-plaster: #f2f3f5;
  --color-mist: #e5e7eb;
  --color-chalk: #ffffff;
  --color-hairline: #d1d5db;
  --color-inkstone: #0f172a;
  --color-slate: #334155;
  --color-graphite: #475569;
  --color-pewter: #64748b;
  --color-fog: #939eae;
  --color-obsidian: #000000;
  --color-spark-violet: #6d4aff;

  /* Typography */
  --font-greycliff: 'Greycliff', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.75px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: -0.9px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(30, 41, 59, 0.15) 0px 25px 50px -12px;
}
```
