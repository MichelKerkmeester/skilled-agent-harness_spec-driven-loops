# Automate Supplier Payments — Style Reference
> butcher paper bakery ledger.

A cream-colored, sun-warmed workspace where thick slab type, pill buttons, and a single school-bus yellow accent do all the work — no shadows, no gradients, just warm paper and confident black ink.

**Theme:** light

Apron wears a warm bakery-counter aesthetic: buttercream canvas, thick slab-serif display type, pill-shaped CTAs in vivid school-bus yellow, and bone-black text that snaps against the cream. The visual logic is "honest ledger on butcher paper" — confident, slightly retro, unapologetically saturated. Surfaces stack in warm cream tones (not cool grays), borders are hairline black rather than soft shadows, and the only chromatic accent is a single yellow that means "act now." Components feel handmade rather than enterprise — rounded cards, chunky buttons, and a custom display face (Champ) that signals brand voice before any copy is read.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Buttercream | `#fff6d2` | `--color-buttercream` | Page canvas, card surfaces, and warm backgrounds — the dominant neutral that gives the entire UI its sun-warmed temperature |
| Marigold | `#ffd801` | `--color-marigold` | Primary CTA fill, brand accent — school-bus yellow that carries the only chromatic voice in the system, reserved exclusively for action surfaces |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, borders, icon strokes, and structural outlines — near-universal use, defines the high-contrast ledger feel |
| Bone White | `#ffffff` | `--color-bone-white` | Reversed text on dark fills, surface inversion, and contrast pairings against black |
| Char | `#666664` | `--color-char` | Secondary surfaces and muted structural fills where warm cream is too light to carry a block |
| Oat | `#cccbc7` | `--color-oat` | Neutral button borders and subtle dividers where pure black would be too heavy |
| Fawn | `#dcdce6` | `--color-fawn` | Faint cool-tinted neutral for secondary surface layers and quiet dividers |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.15
- **Role:** sans-serif — detected in extracted data but not described by AI

### Champ — Display and headline typeface — chunky slab serif at weight 800 for hero and large headings, weight 500 for sub-display sizes. The tight lineHeight (1.01 at 72px) and +0.01em tracking let lines stack aggressively. This is the brand's voice carrier; headlines should feel carved, not typeset · `--font-champ`
- **Substitute:** Roboto Slab, Zilla Slab, or Bitter
- **Weights:** 500, 800
- **Sizes:** 26px, 38px, 54px, 72px
- **Line height:** 1.01-1.40
- **Letter spacing:** 0.01em at all sizes
- **Role:** Display and headline typeface — chunky slab serif at weight 800 for hero and large headings, weight 500 for sub-display sizes. The tight lineHeight (1.01 at 72px) and +0.01em tracking let lines stack aggressively. This is the brand's voice carrier; headlines should feel carved, not typeset

### DM Sans — Body, UI labels, buttons, and small interface text — the workhorse neutral grotesque. 400 for body copy, 500 for labels, 700 for emphasized UI text. Negative tracking (-0.02em) at 20px tightens small headings, positive tracking (0.016em) at 10px adds air to micro labels · `--font-dm-sans`
- **Substitute:** Inter, Manrope, or system-ui
- **Weights:** 400, 500, 700
- **Sizes:** 10px, 16px, 20px
- **Line height:** 1.00-2.33
- **Letter spacing:** -0.0200em, 0.0100em, 0.0160em
- **Role:** Body, UI labels, buttons, and small interface text — the workhorse neutral grotesque. 400 for body copy, 500 for labels, 700 for emphasized UI text. Negative tracking (-0.02em) at 20px tightens small headings, positive tracking (0.016em) at 10px adds air to micro labels

### DM Mono — Monospaced accent for ledger-style numerical data, prices, and technical callouts where monospaced alignment reinforces the financial-document feel · `--font-dm-mono`
- **Substitute:** IBM Plex Mono or JetBrains Mono
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.20
- **Letter spacing:** 0.01em
- **Role:** Monospaced accent for ledger-style numerical data, prices, and technical callouts where monospaced alignment reinforces the financial-document feel

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.16px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | -0.4px | `--text-subheading` |
| heading-sm | 26px | 1.2 | — | `--text-heading-sm` |
| heading | 38px | 1.16 | — | `--text-heading` |
| heading-lg | 54px | 1.01 | — | `--text-heading-lg` |
| display | 72px | 1.01 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

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
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 132 | 132px | `--spacing-132` |
| 236 | 236px | `--spacing-236` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 20px |
| inputs | 16px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(70, 58, 0, 0.1) 0px 4px 12px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Pill Button — Filled (Marigold)
**Role:** Primary CTA

Background #ffd801, text #000000, border-radius 9999px (full pill), padding 20px 32px, DM Sans 16px weight 500. The only chromatic button in the system. Used for the single most important action per screen.

### Pill Button — Outlined (Black)
**Role:** Secondary action or navigation

Background transparent, border 1.5px solid #000000, text #000000, border-radius 9999px, padding 12-20px 32px, DM Sans 16px weight 500. For secondary CTAs and nav bar actions like Sign In.

### Pill Button — Filled (Black)
**Role:** High-emphasis secondary CTA

Background #000000, text #ffffff, border-radius 9999px, padding 20px 32px, DM Sans 16px weight 500. Inverse of the Marigold primary; used when the primary yellow is already present and a second action needs equal weight.

### Card — Surface
**Role:** Content container on cream canvas

Background #ffffff, border-radius 20px, padding 32px, optional soft shadow rgba(70,58,0,0.1) 0 4px 12px. The standard card sits as a white island on the warm cream background.

### Card — Warm
**Role:** Feature or content card blending into canvas

Background #fff6d2 (same as canvas, or 1-2% darker variant), border-radius 20px, padding 32px, no border. Cards that belong to the page rather than floating on it.

### Navigation Bar
**Role:** Top-level site navigation

Background #fff6d2, left-aligned logo, center-aligned nav links (DM Sans 16px weight 400, #000000), right-aligned action buttons. Height ~64px. No border or shadow — the cream-to-content contrast is the divider.

### Hero — Full-bleed with scrim
**Role:** Above-the-fold brand statement

Full-viewport background image with dark scrim overlay. Centered headline in Champ 72px weight 800, #ffffff. Subtext in DM Sans 18-20px, #ffffff. Marigold pill CTA centered below. The scrim uses a warm dark tone, not pure black, to maintain palette cohesion.

### Section Divider
**Role:** Visual separation between content blocks

A horizontal line at 1px #000000, or simply a spacing gap of 80px. The system prefers generous whitespace over visible dividers.

### Input Field
**Role:** Form input

Background #ffffff, border 1.5px solid #cccbc7, border-radius 16px, padding 16px, DM Sans 16px weight 400, placeholder #666664. Focus state shifts border to #000000.

### Feature Grid — 3 Column
**Role:** Feature or benefit showcase

3-column grid of cards with 24px gap, each card 20px radius with 32px padding. Headings in Champ 26px weight 800, body in DM Sans 16px weight 400. Cards sit on the cream canvas.

### Tag / Badge
**Role:** Category or status label

Background #fff6d2 or #000000, text #000000 or #ffffff, border-radius 9999px, padding 6px 16px, DM Sans 13-16px weight 500. Compact, pill-shaped, no icons.

### Stat Callout
**Role:** Numerical proof point or key metric

Large number in Champ 54px weight 800, label in DM Sans 16px weight 400 #000000. May use DM Mono 18px for currency or precise figures.

## Do's and Don'ts

### Do
- Use Marigold (#ffd801) exclusively for the single primary CTA per surface — it's the only chromatic voice in the system and loses power if diluted
- Set all buttons to border-radius 9999px (full pill) — sharp or moderately rounded buttons break the handmade ledger feel
- Use Champ weight 800 at 38-72px for all display text and weight 500 at 26px for sub-display — never use DM Sans for headlines
- Build on the Buttercream (#fff6d2) canvas with white (#ffffff) cards floating on top — never use cool grays for surfaces
- Use hairline 1px #000000 borders and 1.5px for interactive elements — shadows are reserved for floating UI (menus, popovers) at rgba(70,58,0,0.1) 0 4px 12px
- Pair every Marigold CTA with a black-outlined pill button as its secondary partner — the contrast between filled-yellow and outlined-black is a signature moment
- Keep section gaps at 80px and element gaps at 24px — the spaciousness is what makes the warm palette feel calm rather than overwhelming

### Don't
- Don't use any blue, green, or red chromatic accents — the system is monochromatic except for Marigold; semantic colors should be expressed through form (borders, icons) not hue
- Don't apply shadows to cards or content blocks — cards should sit on the canvas via color contrast alone, not elevation
- Don't use sans-serif body text at sizes above 24px — Champ owns all display territory
- Don't set background to pure white (#ffffff) for the page canvas — Buttercream is the base; white appears only on card surfaces
- Don't mix border-radius values within the same component category — all buttons are pills, all cards are 20px, all inputs are 16px
- Don't use multiple yellow shades — Marigold (#ffd801) is the only yellow; lighter cream tones are neutrals, not accents
- Don't add gradients — the system is flat and warm; depth comes from color layering (cream → white → ink), not gradient washes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fff6d2` | Base page background — the warm buttercream that defines the entire aesthetic |
| 1 | Card | `#ffffff` | White surface for elevated content cards against the cream canvas |
| 2 | Oat | `#cccbc7` | Quiet neutral blocks for muted UI sections |
| 3 | Ink | `#000000` | Inverted dark surface for footer, inverted sections, or high-contrast blocks |

## Elevation

- **Floating card or menu:** `rgba(70, 58, 0, 0.1) 0px 4px 12px 0px`

## Imagery

Photography is warm-toned, documentary-style lifestyle — real workplaces, hands at work, candid human moments rather than staged stock. Images are treated with a warm color grade that blends into the cream palette. Hero photography sits full-bleed behind text with a dark overlay for legibility. Product UI mockups appear as clean white cards inset within cream sections. No illustrations or 3D renders — the brand is photographic and textural.

## Layout

Full-bleed sections that alternate between the cream canvas and white cards. The hero is a full-viewport image with a dark scrim and centered headline. Navigation is a simple top bar with left-aligned logo, center nav links, and right-aligned sign-in/get-started pair. Content sections stack vertically with generous 80px gaps. Cards are arranged in 2-3 column grids with 20px radius. The layout is centered, symmetric, and unhurried — spacing does the work rather than compositional tricks.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #fff6d2
- surface/card: #ffffff
- border: #000000 (structural), #cccbc7 (subtle)
- accent/brand: #ffd801 (Marigold)
- primary action: #ffd801 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #ffd801 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a 3-column feature card grid on a Buttercream (#fff6d2) background. Each card: white (#ffffff) background, 20px radius, 32px padding. Heading in Champ 26px weight 800, #000000. Body in DM Sans 16px weight 400, #000000. 24px gap between cards. 80px section padding top and bottom.

3. Create a nav bar: Buttercream (#fff6d2) background, ~64px height. Left: brand name in Champ 26px weight 800. Center: 3 nav links in DM Sans 16px weight 400, #000000. Right: a ghost pill button (1.5px #000000 border, 9999px radius, 12px 32px padding, DM Sans 16px weight 500) and beside it a Marigold (#ffd801) filled pill button with #000000 text, 9999px radius, 20px 32px padding.

4. Create an input field: white (#ffffff) background, 1.5px #cccbc7 border, 16px radius, 16px padding, DM Sans 16px weight 400, placeholder text #666664. On focus, border shifts to #000000.

5. Create a stat block: a large number in Champ 54px weight 800, #000000, with a label beneath in DM Sans 16px weight 400, #000000. If the stat is a currency figure, render the number in DM Mono 18px weight 400 instead.

## Color Temperature Philosophy

The palette operates on a single warm temperature axis. Every neutral — from the Buttercream canvas through Oat and Char — carries a slight warm cast. This is deliberate: the system rejects the cool-gray convention of modern SaaS in favor of a paper-and-ink warmth that evokes a physical ledger or a bakery's order pad. Any new color added to the system must be tested against this warmth. A blue that reads as cool would break the entire visual logic. When in doubt, warm it up.

## Similar Brands

- **Lemonade (Insurance)** — Same warm-cream + single vivid yellow accent palette with chunky display type and pill-shaped CTAs
- **Ramp** — Warm-toned light theme with high-contrast black text and a single accent color for primary actions
- **Brewdog / beverage DTC brands** — Buttery cream canvas with saturated yellow CTAs and rounded, friendly component shapes
- **GoCardless** — Warm light palette with pill buttons and generous spacing, though Apron pushes further into the cream/yellow territory

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-buttercream: #fff6d2;
  --color-marigold: #ffd801;
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;
  --color-char: #666664;
  --color-oat: #cccbc7;
  --color-fawn: #dcdce6;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-champ: 'Champ', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.16px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading: 38px;
  --leading-heading: 1.16;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.01;
  --text-display: 72px;
  --leading-display: 1.01;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-132: 132px;
  --spacing-236: 236px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 20px;
  --radius-inputs: 16px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-md: rgba(70, 58, 0, 0.1) 0px 4px 12px 0px;

  /* Surfaces */
  --surface-canvas: #fff6d2;
  --surface-card: #ffffff;
  --surface-oat: #cccbc7;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-buttercream: #fff6d2;
  --color-marigold: #ffd801;
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;
  --color-char: #666664;
  --color-oat: #cccbc7;
  --color-fawn: #dcdce6;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-champ: 'Champ', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.16px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading: 38px;
  --leading-heading: 1.16;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.01;
  --text-display: 72px;
  --leading-display: 1.01;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-132: 132px;
  --spacing-236: 236px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(70, 58, 0, 0.1) 0px 4px 12px 0px;
}
```
