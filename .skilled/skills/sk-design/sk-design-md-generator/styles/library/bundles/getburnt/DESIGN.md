# Getburnt — Style Reference
> editorial monochrome on warm paper — a minimal typeset spread where warm-black ink, a light display serif, and pill-shaped controls turn a B2B tool into something that reads like a quarterly journal.

**Theme:** light

Getburnt operates in a near-achromatic editorial register: a warm near-black ink against white paper, with a single mid-gray for secondary text. The visual language borrows from print typography — a featherweight display serif carries headlines while a neutral grotesque handles everything operational, creating the rhythm of a magazine spread rather than a SaaS dashboard. Pill-shaped controls and small-radius cards keep the UI tactile and quick, and the deliberate absence of chromatic accents forces hierarchy through scale, weight, and whitespace alone. Product mockups float as photographic-style still lifes within warm grayscale containers, making the interface feel like a curated catalog rather than a software platform.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1a1a17` | `--color-ink` | Primary text, filled buttons, dark surface backgrounds, heading strokes — a warm-tinted near-black that replaces pure #000 throughout the system |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, light section backgrounds, button borders on dark surfaces |
| Ash | `#5f5f5d` | `--color-ash` | Secondary body text, helper text, muted borders, low-emphasis UI metadata |

## Tokens — Typography

### Nyght Serif — Reserved exclusively for display and heading levels (26-72px). Weight 300 is the signature: most systems reach for 600-700 serif, this whisper-weight creates editorial gravitas through restraint. Letter-spacing widens slightly at smaller sizes (0.03em) and tightens at display sizes (0.01em) to preserve optical balance. · `--font-nyght-serif`
- **Substitute:** Fraunces (Google Fonts) at weight 300, or Cormorant Garamond Light
- **Weights:** 300
- **Sizes:** 26px, 48px, 62px, 72px
- **Line height:** 1.00-1.20
- **Letter spacing:** 0.01em at 62-72px, 0.03em at 26-48px
- **Role:** Reserved exclusively for display and heading levels (26-72px). Weight 300 is the signature: most systems reach for 600-700 serif, this whisper-weight creates editorial gravitas through restraint. Letter-spacing widens slightly at smaller sizes (0.03em) and tightens at display sizes (0.01em) to preserve optical balance.

### Switzer — Workhorse for nav, body, buttons, labels, card metadata, and small headings. Tracking runs consistently at 0.03em — a subtle positive letter-spacing that gives the grotesque a calm, considered cadence. Weight 500 for emphasis, 600 for button text and nav active states. · `--font-switzer`
- **Substitute:** Inter, or Manrope (Google Fonts)
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 15px, 16px, 20px
- **Line height:** 1.50
- **Letter spacing:** 0.03em uniform across all sizes
- **Role:** Workhorse for nav, body, buttons, labels, card metadata, and small headings. Tracking runs consistently at 0.03em — a subtle positive letter-spacing that gives the grotesque a calm, considered cadence. Weight 500 for emphasis, 600 for button text and nav active states.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 21 | 0.42px | `--text-caption` |
| body | 16px | 24 | 0.48px | `--text-body` |
| subheading | 20px | 30 | 0.6px | `--text-subheading` |
| heading-sm | 26px | 31.2 | 0.78px | `--text-heading-sm` |
| heading | 48px | 52.8 | 0.48px | `--text-heading` |
| heading-lg | 62px | 68.2 | 0.62px | `--text-heading-lg` |
| display | 72px | 72 | 0.72px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 1440px |
| tags | 1440px |
| cards | 6px |
| buttons | 1440px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Primary Button
**Role:** Filled action button for top-level CTAs

Background #1a1a17, text #ffffff, 1440px border-radius (full pill), 28px horizontal padding × ~12px vertical, Switzer 15-16px weight 500, 0.03em tracking. Optional trailing arrow icon in white. Anchors the header and hero.

### Pill Ghost Button
**Role:** Outlined or text-only action for secondary actions

Transparent background, 1px border #1a1a17 or #ffffff depending on surface, 1440px radius, matching pill padding. Used for less prominent CTAs alongside the filled pill.

### Pill Nav Link
**Role:** Navigation items in header

Switzer 15-16px weight 400-500, no background, 1440px radius only when active (inverted: #1a1a17 bg, #ffffff text). Dropdown items get 12-16px padding.

### Editorial Display Heading
**Role:** Section and hero headlines

Nyght Serif weight 300, color #1a1a17, sizes 48-72px, line-height 1.0-1.1, letter-spacing 0.01em. The light weight and generous line-height create breathing space between lines — never set tight.

### Product Mockup Card
**Role:** Embedded product UI screenshots within feature sections

White card surface, 6px radius, ~24px internal padding, subtle #5f5f5d or #1a1a17 hairline border. Contains a miniaturized product UI with a chat input, task list, and status badges. Floats over a soft warm gradient backdrop in the surrounding panel.

### Workflow Card
**Role:** Three-column feature card on light section

White surface, 6px radius, 24px padding, faint 1px border. Contains a product mockup at top, then a Switzer small caps label (14px weight 500, 0.06em tracking), a Nyght Serif heading-sm (26px weight 300), and Ash body text. Three cards sit on a soft horizontal band gradient.

### Stat Tile
**Role:** Metric callouts in the trust strip below hero

Three equal columns separated by hairline #5f5f5d dividers. Each tile: small icon (16px) in #1a1a17, Switzer 15-16px weight 400, the numeric value not styled larger — the stat is part of the sentence rather than a hero number.

### Feature Row
**Role:** Two-column text + visual feature layout

Left column holds a Switzer small-caps eyebrow label and a Nyght Serif heading (48-62px weight 300). Right column holds a large dark-surface panel (#1a1a17 with subtle warm gradient) containing the product mockup. 48-64px vertical gap between rows.

### Chat Input Bar
**Role:** AI assistant prompt inside product mockup

Rounded pill input, white background, placeholder text in #5f5f5d, send button is a solid purple-ish or Ink filled circle. Sits as the top element of the Ozai Task List card.

### Task List Item
**Role:** Individual row inside the product mockup task list

White surface, no border, 16px row gap, 16px Switzer weight 500 title, 14px Ash subtitle, right-side chevron in #5f5f5d. Inactive rows fade to ~50% opacity.

### Status Pill Badge
**Role:** Order/inventory status indicators inside mockups

Inline pill, ~6px vertical × 10px horizontal padding, 1440px radius, Switzer 12-13px weight 500. Healthy = subtle green-tinted neutral bg + dark text; Critical = warm-tinted neutral bg + dark text. The system deliberately avoids saturated red/green — badges stay within the warm-monochrome palette.

### Icon Bullet
**Role:** Small leading icon for feature list items

16-18px monochrome icon, stroke weight ~1.5px, color #1a1a17, aligned to the first line of each feature row with 16-24px gap to the label.

### Header Bar
**Role:** Top-of-page navigation

White background, ~16px vertical padding, flex row with logo (left), nav links (center-left, 34px gap), and CTA pill (right). No border-bottom — the header relies on the white-on-white separation from the hero.

## Do's and Don'ts

### Do
- Use Nyght Serif weight 300 for all heading and display text — never set a heading in Switzer
- Keep the entire interface within the #1a1a17 / #ffffff / #5f5f5d triad; resist introducing chromatic accents
- Set all buttons, nav active states, and tags to 1440px border-radius for the pill signature
- Maintain 0.03em letter-spacing on all Switzer text to preserve the editorial cadence
- Use 6px radius for cards, mockup containers, and any rectangular UI surface
- Place product mockups on #1a1a17 dark panels to create a museum-vitrine effect against the white page
- Anchor every section with 48-64px vertical gap to keep the editorial pacing

### Don't
- Do not introduce blue, green, red, or any saturated brand color — the warmth comes from the near-black, not from accents
- Do not set Nyght Serif in weights other than 300 — adding bold or medium breaks the editorial voice
- Do not use square or 12px+ radii on buttons or tags — the pill shape is load-bearing
- Do not set body or heading text in pure #000000 — always use #1a1a17 for the warm-ink quality
- Do not use heavy drop shadows on cards — the system relies on hairline borders and surface contrast, not elevation
- Do not set line-height above 1.2 on Nyght Serif display sizes — the serif needs to sit tight to read as display, not body
- Do not apply gradients to text, buttons, or text containers — the palette is flat by design

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas and default section background |
| 1 | Ink Plate | `#1a1a17` | Inverted surface used for dark feature panels, product mockup backings, and high-contrast blocks |

## Elevation

The system avoids drop shadows entirely. Spatial separation is achieved through hairline 1px borders in #5f5f5d, surface contrast (white card on #1a1a17 panel or white card on white canvas with border), and generous whitespace. Elevation is implied by container, not by blur.

## Imagery

Photography plays a hero role: a single large full-bleed image of stacked wooden crates of strawberries in a warehouse occupies the entire right half of the hero, warm-toned, natural light, no overlays. The image is treated as a photographic still life — the physical supply chain is the product, not abstract illustration. Product mockups appear as in-page screenshots on dark panels, functioning as visual evidence rather than decoration. No icons beyond minimal 1.5px stroke monochrome marks; no illustration system; no decorative graphics.

## Layout

Max-width 1200px centered container, comfortable density. Hero is a 50/50 split: left column holds the serif headline at 62-72px, Switzer subtext, and a pill CTA; right column holds a full-bleed food photograph. Below the hero, a three-column stat strip divided by hairline rules. Subsequent sections alternate between left-text/right-dark-panel-with-mockup layouts and centered three-column workflow card grids. Sections are separated by 48-64px vertical gaps on a continuous white canvas. Navigation is a single white header bar with left-aligned logo and right-aligned pill CTA, no sticky behavior or mega-menu.

## Agent Prompt Guide

Quick Color Reference:
- text: #1a1a17
- background: #ffffff
- border: #5f5f5d (hairline) or #1a1a17 (emphasized)
- accent: no distinct accent — the system is monochromatic
- primary action: #1a1a17 (filled action)
- inverted surface: #1a1a17

Example Component Prompts:
1. Build a hero section: white background, max-width 1200px centered. Left half holds a Nyght Serif weight 300 headline at 72px, color #1a1a17, letter-spacing 0.01em, line-height 1.0. Below it a Switzer 16px weight 400 subtext in #5f5f5d, then a pill button — #1a1a17 background, #ffffff text, 1440px radius, 28px horizontal padding, Switzer 15px weight 500. Right half is a full-bleed photograph with no border-radius.
2. Build a workflow card: white surface, 6px radius, 24px padding, 1px border #5f5f5d. Top section is a product mockup on a #1a1a17 dark panel. Below the mockup, a Switzer 14px weight 500 eyebrow label in #1a1a17 with 0.06em tracking, then a Nyght Serif 26px weight 300 heading in #1a1a17, then a Switzer 16px weight 400 body paragraph in #5f5f5d.
3. Build a stat strip: three equal columns separated by 1px #5f5f5d vertical dividers, no top/bottom borders. Each column has a 16px monochrome icon in #1a1a17, then Switzer 16px weight 400 text in #1a1a17, 8px row gap between icon and text.
4. Build a feature row: two-column layout, 48px column gap. Left column has a Switzer 14px weight 500 eyebrow in #1a1a17, then a Nyght Serif 48px weight 300 heading, then three feature bullets each with a 16px icon, Switzer 20px weight 500 label, and Ash body text. Right column is a #1a1a17 dark panel, 6px radius, containing a white product mockup card with 24px padding.
5. Build a pill nav bar: white background, 64px height, flex row. Left: logo text in Switzer 16px weight 600 #1a1a17. Center: four Switzer 15px weight 400 nav links in #1a1a17, 34px gap. Right: a pill ghost button — transparent background, 1px border #1a1a17, 1440px radius, Switzer 15px weight 500 text #1a1a17, 16px 24px padding.

## Similar Brands

- **Linear** — Same editorial discipline: near-monochrome palette, generous whitespace, serif-or-grotesque type pairing, and pill-shaped controls that disappear into the layout
- **Vercel** — Identical reliance on typographic scale and weight contrast over color for hierarchy, with the warm-black-on-white palette and minimal interface chrome
- **Notion** — Same warm-tinted near-black replacing pure #000, the same avoidance of saturated accent colors, and a serif-light display weight used for editorial moments
- **Arc browser** — Same design-philosophy move of letting a single warm-tinted near-black do all the work while reserving color for functional moments inside product surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1a1a17;
  --color-paper: #ffffff;
  --color-ash: #5f5f5d;

  /* Typography — Font Families */
  --font-nyght-serif: 'Nyght Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 21;
  --tracking-caption: 0.42px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: 0.48px;
  --text-subheading: 20px;
  --leading-subheading: 30;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 31.2;
  --tracking-heading-sm: 0.78px;
  --text-heading: 48px;
  --leading-heading: 52.8;
  --tracking-heading: 0.48px;
  --text-heading-lg: 62px;
  --leading-heading-lg: 68.2;
  --tracking-heading-lg: 0.62px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: 0.72px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-nav: 1440px;
  --radius-tags: 1440px;
  --radius-cards: 6px;
  --radius-buttons: 1440px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink-plate: #1a1a17;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1a1a17;
  --color-paper: #ffffff;
  --color-ash: #5f5f5d;

  /* Typography */
  --font-nyght-serif: 'Nyght Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 21;
  --tracking-caption: 0.42px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: 0.48px;
  --text-subheading: 20px;
  --leading-subheading: 30;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 31.2;
  --tracking-heading-sm: 0.78px;
  --text-heading: 48px;
  --leading-heading: 52.8;
  --tracking-heading: 0.48px;
  --text-heading-lg: 62px;
  --leading-heading-lg: 68.2;
  --tracking-heading-lg: 0.62px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: 0.72px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 1440px;
}
```
