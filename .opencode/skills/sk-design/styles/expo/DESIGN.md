# Expo — Style Reference
> precision notebook in graphite and signal blue — every control a rounded chip, every screen a quiet page of ink and paper until blue says "look here."

**Theme:** light

Expo is a precision instrument for developers: near-monochrome canvas, generous pill-shaped radii, and a single signal-blue accent that lights up only when something matters. The visual language is text-first and utilitarian — Inter handles everything from UI labels to documentation prose, with weight doing the hierarchy work instead of size or color. Surfaces stay flat; separation comes from hairline borders and tonal steps in a narrow gray scale rather than shadows or gradients. Every interactive element leans toward the round — buttons, nav items, and tags all use 24-36px radii — making the UI feel softer than its developer-tool audience would expect. Color is rationed: near-black ink, three grays, white canvas, and one electric blue for the moments that need to register.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1c2024` | `--color-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surfaces, button text on filled dark buttons |
| Graphite | `#60646c` | `--color-graphite` | Secondary body text, muted descriptions, secondary button text, icon strokes, inactive nav labels |
| Steel | `#80838d` | `--color-steel` | Tertiary text, disabled states, subtle icon strokes, low-emphasis metadata |
| Mist | `#d9d9e0` | `--color-mist` | Hairline borders, subtle dividers, outlined button borders |
| Fog | `#f0f0f3` | `--color-fog` | Elevated surface wash, subtle background tints, nav hover surfaces |
| Signal Blue | `#0090ff` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Signal | `#0072de` | `--color-deep-signal` | Darker accent variant for pressed/active states, gradient endpoints, and focused accent surfaces |

## Tokens — Typography

### Inter — Universal typeface — handles all text from micro-labels to documentation headings. Weight 400 for body, 500 for emphasized inline text and nav, 600 for section headings and buttons, 700 for page titles. Tight -0.012em tracking keeps dense documentation feeling composed. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20
- **Line height:** 1.00–1.75
- **Letter spacing:** -0.012em globally, applied uniformly from 12px through 20px
- **Role:** Universal typeface — handles all text from micro-labels to documentation headings. Weight 400 for body, 500 for emphasized inline text and nav, 600 for section headings and buttons, 700 for page titles. Tight -0.012em tracking keeps dense documentation feeling composed.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | -0.144px | `--text-caption` |
| body-sm | 14px | 1.63 | -0.168px | `--text-body-sm` |
| body | 16px | 1.75 | -0.192px | `--text-body` |
| subheading | 18px | 1.4 | -0.216px | `--text-subheading` |
| heading | 20px | 1.4 | -0.24px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 24-36px |
| cards | 12-24px |
| links | 32px |
| pills | 9999px |
| buttons | 36px |

### Layout

- **Page max-width:** 720px
- **Section gap:** 40-48px
- **Card padding:** 16-24px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Main call-to-action (Sign up, Get started)

Dark filled button using Ink (#1c2024) background with Canvas White text. Inter weight 600 at 14-16px. 36px border-radius (pill shape). 8px vertical × 16-20px horizontal padding. No shadow, no border. This is the highest-emphasis interactive element — the only surface where Ink fills an entire component.

### Ghost Text Button
**Role:** Secondary action (Log in, Learn more)

Transparent background, Graphite (#60646c) text, no border. Inter weight 500 at 14-16px. 36px radius to match filled buttons. 8px × 16px padding. Optionally paired with a small leading icon (36px circle, Fog background).

### Top Navigation Bar
**Role:** Site-wide header

White or transparent background, 64-72px height. Logo left (dark Expo mark), nav links center in Inter weight 500 Graphite with Ink on active/hover. Right cluster: avatar circle, Log in ghost button, Sign up filled button. Items separated by 8-16px gaps. No shadow or border — sits directly on canvas.

### Nav Link Chip
**Role:** Navigation item in top bar

Inter weight 500 at 14px, Graphite color. 24-36px border-radius. 6-8px vertical × 12-16px horizontal padding. Active state shifts to Ink text. May include small dropdown caret in Steel.

### Documentation Page Title
**Role:** h1 heading on docs/blog pages

Inter weight 700 at 20px, Ink color, -0.24px tracking. Flush left within 720px content column. 24-40px margin-bottom before body text.

### Section Heading
**Role:** h2/h3 within documentation

Inter weight 600 at 16-18px, Ink color. Tighter line-height (1.4) than body. 24-32px margin-top to separate from preceding content. No decorative element — weight alone establishes hierarchy.

### Body Paragraph
**Role:** Primary reading text

Inter weight 400 at 16px, Ink color, 1.75 line-height for comfortable reading. 12-16px margin-bottom between paragraphs. Max-width constrained to 720px reading column.

### Bulleted List
**Role:** Enumerated policy items, feature lists

16px Inter weight 400, Ink color. 6-8px row-gap between items. Bullet markers are simple 4px Ink dots with 8-12px left indent. 1.75 line-height for multi-line items.

### Metadata Line
**Role:** Page context indicators (Last updated, Author, Date)

Inter weight 400 at 14px, Graphite color. Prefixed by a small 16px outline icon in Steel (calendar, person, etc.). 8px gap between icon and text. 16-24px margin-bottom before page title.

### Avatar Circle
**Role:** User identity in nav

36px circle, Fog (#f0f0f3) background, Inter weight 600 initial in Ink. No border, no shadow. Positioned at nav right edge.

### Hairline Divider
**Role:** Section separator

1px solid Mist (#d9d9e0). Full content-width or 720px constrained. 24-40px vertical margin. No other visual treatment — the line alone separates sections.

### Footer Link
**Role:** Site footer navigation

Inter weight 400 at 14px, Graphite color. No underline by default; Ink on hover. 32px radius if rendered as chip. 6-8px gap between adjacent footer links.

## Do's and Don'ts

### Do
- Use 36px border-radius for all buttons, nav items, and interactive chips to maintain the rounded-pill signature
- Apply Inter at -0.012em letter-spacing uniformly; do not override tracking per-element
- Reserve Signal Blue (#0090ff) for decorative accents, code highlights, and brand iconography — never as a filled button background
- Use Ink (#1c2024) as the primary action fill for high-emphasis CTAs, paired with Canvas White text
- Separate sections with 1px Mist (#d9d9e0) hairlines, not cards or shadows
- Constrain documentation and reading content to a 720px max-width column for optimal line measure
- Let weight (400 → 500 → 600 → 700) carry typographic hierarchy before reaching for size or color

### Don't
- Do not introduce drop shadows, glow effects, or blur backdrops — the system is flat by design
- Do not use Signal Blue as a CTA fill — the only chromatic accent should punctuate, not dominate
- Do not add more than one typeface; Inter handles all contexts from micro-labels to headings
- Do not exceed 20px for body or heading sizes in documentation contexts — the scale is intentionally compact
- Do not use sharp corners (0-4px radius) on any interactive element — the rounded chip is non-negotiable
- Do not stack multiple chromatic accents; the system is monochromatic with one blue
- Do not apply gradients — the system is entirely flat color and relies on tonal contrast

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background, reading surface for documentation content |
| 1 | Fog Wash | `#f0f0f3` | Subtle elevation for nav bars, hover states, and quiet panel backgrounds |
| 2 | Mist Border | `#d9d9e0` | Hairline separators and outlined element boundaries |

## Elevation

No shadows, no raised surfaces, no blur effects. The design system achieves separation through tonal contrast (white → Fog → Mist) and hairline borders rather than elevation. Every surface is flush with the canvas — depth is implied by color step, not by z-axis. This keeps the UI feeling like a printed page rather than a layered application.

## Imagery

Documentation pages are text-only with minimal iconography — small 16px outline icons (calendar, arrows) in Steel accompany metadata. The broader site uses product screenshots, terminal captures, and code blocks rendered with syntax highlighting where Signal Blue may appear as a token color. No photography, no illustration, no decorative imagery. Icons are consistently outlined with thin strokes (1.5-2px), monochromatic in Ink or Steel, never filled or multicolor. The visual language is utilitarian documentation: the words and code are the content.

## Layout

Content-first centered layout. Top navigation spans full viewport width with a 64-72px tall bar (logo left, nav center, auth right) and no border or shadow. Main content constrained to 720px max-width reading column, centered horizontally with generous left/right margin. Vertical rhythm: metadata line → page title (20px h1) → 40px gap → body paragraphs with 12-16px spacing → section headings every 3-5 paragraphs with 24-32px top margin. Bulleted lists indent 24-32px from body. Footer full-width, separated by hairline divider. The overall page reads like a single-column document — wide margins, comfortable line measure, minimal visual interruption.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1c2024
- background: #ffffff
- border: #d9d9e0
- accent: #0090ff
- primary action: no distinct CTA color
- muted text: #60646c

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Create a ghost secondary button: transparent background, #60646c text, Inter weight 500 14px, 36px radius, 8px 16px padding.
3. Create a top navigation bar: #ffffff background, 72px height, logo left, 4 nav links in Inter weight 500 #60646c centered, avatar circle and filled Sign up button (#1c2024) right.
4. Create a documentation page layout: 720px max-width centered column, metadata line with 16px Steel calendar icon and #60646c 14px text, 20px h1 in Inter weight 700 #1c2024, 16px body in Inter weight 400 #1c2024 at 1.75 line-height, 16px bulleted list with 8px row-gap.
5. Create a section heading: Inter weight 600 18px, #1c2024, 1.4 line-height, 32px margin-top, no decorative element.

## Similar Brands

- **Vercel** — Same monochrome-first developer-tool aesthetic with generous pill-shaped radii and a single accent color used sparingly
- **Linear** — Identical approach: Inter as sole typeface, near-black ink on white, tight letter-spacing, compact spacing, and zero decorative chrome
- **Railway** — Similar rounded-button design language with a predominantly grayscale palette and minimal color as functional punctuation
- **Supabase** — Same Inter-only typography, pill-shaped controls, and monochromatic interface that lets a single brand color do the talking

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1c2024;
  --color-canvas-white: #ffffff;
  --color-graphite: #60646c;
  --color-steel: #80838d;
  --color-mist: #d9d9e0;
  --color-fog: #f0f0f3;
  --color-signal-blue: #0090ff;
  --color-deep-signal: #0072de;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: -0.144px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.63;
  --tracking-body-sm: -0.168px;
  --text-body: 16px;
  --leading-body: 1.75;
  --tracking-body: -0.192px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.216px;
  --text-heading: 20px;
  --leading-heading: 1.4;
  --tracking-heading: -0.24px;

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
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 720px;
  --section-gap: 40-48px;
  --card-padding: 16-24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 24-36px;
  --radius-cards: 12-24px;
  --radius-links: 32px;
  --radius-pills: 9999px;
  --radius-buttons: 36px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-fog-wash: #f0f0f3;
  --surface-mist-border: #d9d9e0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1c2024;
  --color-canvas-white: #ffffff;
  --color-graphite: #60646c;
  --color-steel: #80838d;
  --color-mist: #d9d9e0;
  --color-fog: #f0f0f3;
  --color-signal-blue: #0090ff;
  --color-deep-signal: #0072de;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: -0.144px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.63;
  --tracking-body-sm: -0.168px;
  --text-body: 16px;
  --leading-body: 1.75;
  --tracking-body: -0.192px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.216px;
  --text-heading: 20px;
  --leading-heading: 1.4;
  --tracking-heading: -0.24px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 9999px;
}
```
