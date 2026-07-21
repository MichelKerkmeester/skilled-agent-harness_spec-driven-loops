# Altius — Style Reference
> Molten embers on obsidian. A blockchain command center lit from within by coral fire, where dark surfaces breathe warm light through hairline gaps and inset glows.

**Theme:** dark

Altius operates in a volcanic-ember register: deep obsidian-brown surfaces warmed by coral and flare-orange highlights, like a blockchain control room rendered in molten glass and cooled lava. The page rhythm alternates between heavy dark sections and light peach breathing spaces, creating a thermal oscillation rather than the typical dark-mode-everywhere crypto UI. Typography is tight-tracked and weight-confident — Matter (sans) at weight 700 for display, with Fabrikatmono (monospace) as a technical accent for tags and labels. Components feel pressed-in rather than floating: buttons carry an inner ember-glow shadow, cards use hairline coral borders on dark, and the hero's vertical gradient bars suggest a sound wave or thermal spectrum. Color is the brand's primary voice — expect a dark, warm, confident system that treats coral-orange as functional punctuation across a near-black canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Ember | `#190501` | `--color-obsidian-ember` | Primary dark canvas — page background in dark sections, card surface, deepest borders. The black-with-warmth that defines the brand atmosphere |
| Dark Cocoa | `#340a01` | `--color-dark-cocoa` | Secondary dark surface, deep link borders, icon outlines — one step lifted from obsidian for layering depth |
| Molten Core | `#631303` | `--color-molten-core` | Inset glow shadow source, deep red-brown accents — the pressed-ember tone that gives buttons their internal fire |
| Signal Red | `#951c04` | `--color-signal-red` | Outlined/ghost action border, nav borders, icon strokes, interactive outlines — the chromatic action color used for outlined buttons and active control edges |
| Flare Orange | `#fa5838` | `--color-flare-orange` | Primary brand accent — links, decorative borders, the hero gradient spectrum, highlight washes. The single hottest color in the system; used sparingly as functional punctuation |
| Warm Blush | `#fcac9c` | `--color-warm-blush` | Soft surface wash, secondary peach background, decorative highlight fields — the diffused ember tone for breathing sections |
| Vapor Peach | `#feeae6` | `--color-vapor-peach` | Light section background, light-mode card surface, body text on dark, ghost button text — the warm off-white that breaks the dark rhythm |
| Linen | `#f7f6ff` | `--color-linen` | Primary text on dark, crisp borders on dark sections, inverse text. The near-white that carries most typography on dark surfaces |
| Warm Ash | `#baadab` | `--color-warm-ash` | Muted button borders on light sections, tertiary text, subtle dividers — a warm gray that softens edges without going cold |
| Pure Black | `#000000` | `--color-pure-black` | Decorative SVG fills, icon line art, graphical accents — high-contrast details that read as deep-ink on the warm canvas |
| Mist | `#cccccc` | `--color-mist` | Input field borders on light backgrounds — the only cool-neutral in the system, used minimally for form controls |

## Tokens — Typography

### Matter — Primary typeface — body, display, headings, buttons, navigation, icons. Weight 700 carries display headlines; 500 for emphasis in body; 400 for regular text. Tight tracking across all sizes creates a compressed, confident read. · `--font-matter`
- **Substitute:** Inter, Söhne, or Geist Sans
- **Weights:** 400, 500, 700
- **Sizes:** 14, 16, 20, 24, 48, 60
- **Line height:** 1.08 (60px), 1.13 (48px), 1.16 (24px), 1.25 (20px), 1.40-1.50 (16px), 1.50 (14px)
- **Letter spacing:** -0.0430em, -0.0420em, -0.0400em, -0.0330em, -0.0100em
- **Role:** Primary typeface — body, display, headings, buttons, navigation, icons. Weight 700 carries display headlines; 500 for emphasis in body; 400 for regular text. Tight tracking across all sizes creates a compressed, confident read.

### Fabrikatmono — Monospace accent — section labels, tags, technical metadata, trust signals. Used in uppercase for eyebrow labels like 'THE PROBLEM' and 'SOLUTIONS'. The technical-utility voice that contrasts Matter's editorial confidence. · `--font-fabrikatmono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400, 500
- **Sizes:** 14, 16, 20
- **Line height:** 1.50-1.75
- **Letter spacing:** -0.0500em, -0.0400em
- **Role:** Monospace accent — section labels, tags, technical metadata, trust signals. Used in uppercase for eyebrow labels like 'THE PROBLEM' and 'SOLUTIONS'. The technical-utility voice that contrasts Matter's editorial confidence.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 21 | -0.14px | `--text-caption` |
| body | 16px | 24 | -0.16px | `--text-body` |
| subheading | 20px | 25 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 28 | -0.8px | `--text-heading-sm` |
| heading | 48px | 54 | -1.92px | `--text-heading` |
| display | 60px | 65 | -2.58px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 108 | 108px | `--spacing-108` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgb(99, 19, 3) 0px 0px 20px 0px inset` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Site-wide header

Dark Obsidian Ember (#190501) background, full-width. Logo (Altius mark in Flare Orange #fa5838) left-aligned, nav links right-aligned in Linen (#f7f6ff) at 16px Matter weight 500, followed by 2 icon-only social buttons. No visible border-bottom — separation comes from background change only. Height ~64px.

### Hero Section
**Role:** Landing page hero

Full-viewport Obsidian Ember background with centered text stack: 60px display headline in Linen, 16px body subtext at 60% opacity, dual CTAs. Below the text block, 11-13 vertical gradient bars in Flare Orange (#fa5838) with peak-to-zero fade — creating a thermal spectrum / sound-wave visual that is the brand's signature motif. No gradient in CSS, but visual gradient via opacity-faded rectangles.

### Filled Primary Button
**Role:** Primary action

Background: Dark Cocoa (#340a01) to Molten Core (#631303). Text: Linen (#f7f6ff) at 16px Matter weight 500. Padding: 8px 20px. Radius: 4px. Inset shadow: rgb(99,19,3) 0px 0px 20px 0px — creates the internal ember glow. No border. Slight letter-spacing: 0 or -0.01em.

### Outlined Ghost Button
**Role:** Secondary action

Transparent background. Border: 1px solid Linen (#f7f6ff) or Signal Red (#951c04) depending on context. Text: matching border color at 16px Matter weight 500. Padding: 8px 20px. Radius: 4px. No shadow. The 'Read Documentation' style in the hero uses Linen border on dark.

### Investor Logo Grid
**Role:** Social proof band

4-column grid (responsive to 2-3 on smaller screens) on Obsidian Ember background. Logos rendered in Linen (#f7f6ff) or white at uniform opacity ~70%. Centered eyebrow label 'TRUSTED BY LEADING INVESTORS AND BUILDERS' in Flare Orange (#fa5838) Fabrikatmono 14px uppercase, letter-spacing tracked.

### Section Header (Tag + Heading)
**Role:** Section introduction

Vertical stack: small Fabrikatmono tag in Flare Orange (#fa5838) at 14px uppercase (e.g. 'THE PROBLEM', 'SOLUTIONS') with optional square bracket icon, followed by 48px heading in Linen (#f7f6ff) or Obsidian Ember (#190501) depending on section background. Tag-to-heading gap: 16px.

### Problem Statement Card
**Role:** Light-section content card

White/Linen (#f7f6ff) background card on Vapor Peach (#feeae6) section. Padding: 40px. Radius: 8px. Contains wireframe/3D illustration on left or top. Border: 1px solid Warm Ash (#baadab) subtle. Content body text in Obsidian Ember at 16px.

### Solutions Feature Card
**Role:** Feature highlight (dark variant)

Background: Dark Cocoa (#340a01). Border: 1px solid Signal Red (#951c04) or Dark Cocoa — hairline coral edge. Padding: 32px. Radius: 8px. Contains: numbered label (01/02/03) in Flare Orange Fabrikatmono, small icon in Flare Orange top-right, 24px heading in Linen, 14-16px body text in Linen at 80% opacity. No drop shadow.

### Input Field
**Role:** Form control

Background: transparent or Vapor Peach. Border: 1px solid Mist (#cccccc) on light or Signal Red (#951c04) on dark. Padding: 10px 12px. Radius: 4px. Text: 16px Matter weight 400. Placeholder: 60% opacity.

### Footer
**Role:** Site footer

Obsidian Ember background. Social icon links (X, LinkedIn) as outlined squares with Flare Orange (#fa5838) or Linen borders, 32x32px, 1px border, 4px radius. Minimal text, generous vertical padding (64px+).

### Hero Gradient Bar
**Role:** Decorative hero element

Vertical rectangles (40-80px wide, 200-300px tall) in Flare Orange (#fa5838) arranged in a row spanning the hero width. Each bar fades from full opacity at center to transparent at top and bottom, creating a thermal-spectrum visual. 11-13 bars in total, varying widths.

### Eyebrow Tag Label
**Role:** Section category indicator

Fabrikatmono 14px uppercase, letter-spacing -0.05em, color Flare Orange (#fa5838) on dark backgrounds or Signal Red (#951c04) on light. Often preceded by a small square outline icon. Provides technical-utility voice above editorial headings.

## Do's and Don'ts

### Do
- Use Obsidian Ember (#190501) as the default canvas for all primary content sections
- Apply 60px Matter weight 700 with -2.58px letter-spacing for display headlines
- Use the Flare Orange (#fa5838) sparingly as functional punctuation — links, accents, single highlight elements per section
- Include the 20px inset ember-glow shadow (rgb(99,19,3)) on all filled primary buttons
- Alternate between dark and Vapor Peach (#feeae6) sections to create thermal rhythm across the page
- Set all buttons to 4px radius and cards to 8px radius — sharp enough to feel technical, soft enough to feel crafted
- Use Fabrikatmono 14px uppercase in Flare Orange for all section tags and technical labels

### Don't
- Don't add drop shadows to cards or panels — the system uses hairline borders and surface differentiation only
- Don't use blue or cool tones — the entire palette is warm, from Vapor Peach through Molten Core
- Don't create filled buttons with Flare Orange (#fa5838) background — Flare Orange is for accents, not button fills
- Don't use display sizes below 48px or above 60px — the type scale is compressed and confident
- Don't let dark sections run more than 2-3 before introducing a Vapor Peach break — the thermal alternation is structural
- Don't use generic sans-serif fallbacks as the primary face — Matter's tight tracking is part of the voice
- Don't apply color to body text — keep body text in Linen (#f7f6ff) on dark or Obsidian Ember (#190501) on light

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Vapor Peach | `#feeae6` | Light section background — problem statement, alternating breathing space |
| 2 | Obsidian Ember | `#190501` | Primary dark canvas — hero, investor logos, solutions, footer |
| 3 | Dark Cocoa | `#340a01` | Elevated card surface on dark — slightly lifted from canvas for card depth |
| 4 | Molten Core | `#631303` | Accent surface — button fills with inset glow, emphasis panels |

## Elevation

- **Filled Primary Button:** `rgb(99, 19, 3) 0px 0px 20px 0px inset`

## Imagery

Imagery is minimal and treatment-specific. The hero uses abstract decorative elements: 11-13 vertical gradient bars in Flare Orange that read as a thermal spectrum or audio visualizer — this is the signature visual. The problem section features a single wireframe/3D illustration of a radar or grid dome (rendered in coral on light). The solutions section has subtle background line art (technical schematics) at very low opacity. No photography is used. Icons are minimal — line-art style in Flare Orange or Linen, ~1px stroke weight, used sparingly. The visual language is closer to a Bloomberg terminal meets volcanic data-viz: technical, warm, confident, with color doing structural work rather than decorative work.

## Layout

Full-bleed section design with no horizontal page borders. Each section spans 100% width with its own background color. Content within sections is contained to a max-width of ~1200px, centered. Hero is centered-stack: large headline over subtext over dual CTAs, with decorative gradient bars below. Middle sections use 2-column split (text left / visual right) for the problem statement, then 3-column card grid for solutions features. Section rhythm: dark hero → dark investor band → light peach problem section → dark solutions section. Vertical spacing between sections is generous (80-120px). Navigation is a simple top bar, not sticky. The page reads as 3-4 full-viewport bands rather than a scrolling content stream.

## Agent Prompt Guide

primary action: #951c04 (outlined action border)
Create an Outlined Primary Action: Transparent background, #951c04 border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.
Quick Color Reference:
- text: #f7f6ff (on dark) / #190501 (on light)
- background: #190501 (dark sections) / #feeae6 (light sections)
- border: #190501 (hairline on dark) / #baadab (on light)
- accent: #fa5838 (links, highlights, single-color punctuation)
- outlined action: #951c04 (ghost/outlined button border)

Example Component Prompts:

1. Create a hero section: Obsidian Ember (#190501) full-width background. Centered 60px Matter weight 700 headline in Linen (#f7f6ff), letter-spacing -2.58px. 16px subtext in Linen at 70% opacity. Two CTAs: filled button with Dark Cocoa (#340a01) background, Linen text, 4px radius, 8px 20px padding, inset shadow rgb(99,19,3) 0px 0px 20px; outlined button with 1px Linen border, transparent fill, Linen text, same radius and padding. Below text, 12 vertical Flare Orange (#fa5838) bars (40-80px wide, 240px tall) with center-to-edge opacity fade.

2. Create a solutions feature card: Dark Cocoa (#340a01) background, 8px radius, 32px padding, 1px border in Signal Red (#951c04). Top-left: '01' in Fabrikatmono 14px Flare Orange (#fa5838). Top-right: small line-art icon in Flare Orange. Center: 24px Matter weight 700 heading in Linen (#f7f6ff), letter-spacing -0.8px. Body: 16px Matter weight 400 Linen at 80% opacity.

3. Create a section header: Fabrikatmono 14px uppercase tag in Flare Orange (#fa5838) with letter-spacing -0.05em, preceded by a 12x12px outlined square icon. 16px gap. Followed by 48px Matter weight 700 headline in Linen (#f7f6ff), letter-spacing -1.92px.

4. Create a light problem-statement card: Linen (#f7f6ff) background on Vapor Peach (#feeae6) section. 40px padding, 8px radius, 1px Warm Ash (#baadab) border. Contains a coral wireframe illustration on the left half and 16px body text in Obsidian Ember (#190501) on the right half.

5. Create a footer: Obsidian Ember (#190501) background, 64px vertical padding. Two 32x32px outlined social icons (X, LinkedIn) with 1px Flare Orange (#fa5838) border, 4px radius, Flare Orange line-art icons centered inside.

## Thermal Section Rhythm

The page alternates between dark molten sections and light peach breathing sections — this is not optional. A page built with this system should have a section sequence that shifts surface temperature at least every 2-3 dark blocks. Dark sections use Obsidian Ember (#190501) canvas with Linen (#f7f6ff) text; light sections use Vapor Peach (#feeae6) canvas with Obsidian Ember (#190501) text. Flare Orange (#fa5838) crosses both modes as the single accent, shifting in role from highlight-on-dark to action-on-light.

## Similar Brands

- **Phantom Wallet** — Same dark-mode crypto UI with warm coral-purple accent palette and tight display typography
- **Helius (Solana RPC)** — Same developer-infrastructure audience with dark background, tight letter-spacing on headlines, and technical monospace tags above editorial headings
- **Monad** — Same blockchain-infra dark aesthetic with single warm accent color and compressed display type
- **Eclipse (L2)** — Same thermal-orange-on-dark palette treatment and similar hairline-bordered card style

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-ember: #190501;
  --color-dark-cocoa: #340a01;
  --color-molten-core: #631303;
  --color-signal-red: #951c04;
  --color-flare-orange: #fa5838;
  --color-warm-blush: #fcac9c;
  --color-vapor-peach: #feeae6;
  --color-linen: #f7f6ff;
  --color-warm-ash: #baadab;
  --color-pure-black: #000000;
  --color-mist: #cccccc;

  /* Typography — Font Families */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fabrikatmono: 'Fabrikatmono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 21;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 25;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 28;
  --tracking-heading-sm: -0.8px;
  --text-heading: 48px;
  --leading-heading: 54;
  --tracking-heading: -1.92px;
  --text-display: 60px;
  --leading-display: 65;
  --tracking-display: -2.58px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-108: 108px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-lg: rgb(99, 19, 3) 0px 0px 20px 0px inset;

  /* Surfaces */
  --surface-vapor-peach: #feeae6;
  --surface-obsidian-ember: #190501;
  --surface-dark-cocoa: #340a01;
  --surface-molten-core: #631303;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-ember: #190501;
  --color-dark-cocoa: #340a01;
  --color-molten-core: #631303;
  --color-signal-red: #951c04;
  --color-flare-orange: #fa5838;
  --color-warm-blush: #fcac9c;
  --color-vapor-peach: #feeae6;
  --color-linen: #f7f6ff;
  --color-warm-ash: #baadab;
  --color-pure-black: #000000;
  --color-mist: #cccccc;

  /* Typography */
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fabrikatmono: 'Fabrikatmono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 21;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 25;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 28;
  --tracking-heading-sm: -0.8px;
  --text-heading: 48px;
  --leading-heading: 54;
  --tracking-heading: -1.92px;
  --text-display: 60px;
  --leading-display: 65;
  --tracking-display: -2.58px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-108: 108px;
  --spacing-128: 128px;

  /* Shadows */
  --shadow-lg: rgb(99, 19, 3) 0px 0px 20px 0px inset;
}
```
