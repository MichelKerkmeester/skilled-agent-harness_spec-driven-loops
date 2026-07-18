# Design Full-Time — Style Reference
> black-box cinema with a single warm spotlight

**Theme:** dark

Design Full-Time runs a black-box cinema: pure #000000 canvas, white type, and one concentrated warm gradient (amber → ember → red) reserved for conversion surfaces and savings moments. The page is almost entirely achromatic — video thumbnails, course metadata, and navigation live in monochrome gray scale, letting the single gradient banner function as a stage spotlight. Components are flat and rectangular with hairline borders, minimal rounding, and zero shadows; hierarchy comes from type weight, whitespace, and the rare chromatic punctuation. Inter at 700/800 carries the brand's confident, instructor-led voice while body text stays at 400/600 in muted grays.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Black | `#000000` | `--color-pure-black` | Page canvas, dominant background — absorbs everything so content and the warm gradient banner can command attention |
| Surface Black | `#111111` | `--color-surface-black` | Card backgrounds, elevated panels, filled neutral button surface — one step off the canvas creates depth without gray noise |
| Lifted Charcoal | `#252525` | `--color-lifted-charcoal` | Mid-elevation surfaces, hover states, and subtle card depth — bridges the page black and border tones |
| Border Gray | `#343434` | `--color-border-gray` | Hairline dividers, card outlines, table rules — defines structural edges in a flat world |
| Edge Gray | `#4d4d4d` | `--color-edge-gray` | Heavier borders on outlined buttons and grouped control frames |
| Muted Text | `#888888` | `--color-muted-text` | Secondary body text, metadata, timestamps, supporting copy |
| Helper Gray | `#a0a0a0` | `--color-helper-gray` | Body text borders and subtle helper text where full white feels too loud |
| Pure White | `#ffffff` | `--color-pure-white` | Primary headings, nav text, button text, logo fill — the only color allowed to compete with the gradient banner |
| Amber Glow | `linear-gradient(90deg, #ffc84 0%, #fa3a19 100%)` | `--color-amber-glow` | Promotional banner start — the cool-yellow origin of the warm spotlight gradient (also gradient) |
| Ember Orange | `linear-gradient(90deg, #ff8a00 0%, #fa3a19 100%)` | `--color-ember-orange` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Crimson Heat | `linear-gradient(90deg, #ff8a00 0%, #fa3a19 100%)` | `--color-crimson-heat` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### Inter — Sole typeface. Inter 700/800 for the wordmark and section headlines (confident, instructor-led); 600 for video titles and nav labels; 400 for body copy and metadata. No display-size font in the system — the brand keeps type compact (capped at 24px) and lets the gradient banner and video thumbnails carry visual weight instead. · `--font-inter`
- **Substitute:** Inter (Google Fonts) or system-ui as fallback
- **Weights:** 400, 600, 700, 800
- **Sizes:** 15, 16, 18, 20, 24
- **Line height:** 1.00, 1.33, 1.40, 1.50, 1.56
- **Role:** Sole typeface. Inter 700/800 for the wordmark and section headlines (confident, instructor-led); 600 for video titles and nav labels; 400 for body copy and metadata. No display-size font in the system — the brand keeps type compact (capped at 24px) and lets the gradient banner and video thumbnails carry visual weight instead.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 21 | — | `--text-caption` |
| body-lg | 18px | 28 | — | `--text-body-lg` |
| subheading | 20px | 28 | — | `--text-subheading` |
| heading | 24px | 32 | — | `--text-heading` |

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

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| badges | 4px |
| banner | 4px |
| buttons | 6px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-width #000000 bar with 16px vertical padding, 32px horizontal padding. Left-aligned nav links in Inter 600/16px white, right-aligned 'Student Login' outlined button. 1px #343434 bottom border separates from page canvas.

### Brand Wordmark
**Role:** Logo / identity

Centered 'DESIGN FULL-TIME' in white, Inter 800, set in two stacked lines with a slight arc/swoosh framing — only chromatic-free brand mark, the gradient lives elsewhere.

### Promo Banner (Gradient Strip)
**Role:** Conversion / offer highlight

Full-width 64-72px tall bar with warm gradient wash (amber 12% opacity → red 10% opacity) on a #000000 base. 1px subtle border, 4px radius. Contains three zones: left 'Save 60%' in gradient text (amber → crimson), center 'Get all 5 courses for $399!' in white, right gradient-filled CTA button. This is the ONLY component allowed to introduce warm color.

### Promo Gradient Button
**Role:** Primary conversion CTA on banner

Filled button with linear-gradient(90deg, #ff8a00, #fa3a19) background, white Inter 700 text, 6px radius, 8px 16px padding. Sits right-aligned inside the promo banner.

### Outlined Nav Button
**Role:** Secondary account action

Transparent background, 1px #343434 border, 6px radius, 8px 16px padding, white Inter 600/15px label. Used for 'Student Login' and similar account-level actions.

### Video Lesson Card
**Role:** Course / free lesson entry point

#111111 background, 1px #343434 border, 6px radius, 16px internal padding. Composed of 16:9 video thumbnail on top, then 8px gap to title (Inter 700/16px white) and 4px gap to category label (Inter 400/15px #a0a0a0). Clickable as a unit.

### Video Duration Badge
**Role:** Thumbnail metadata overlay

Absolute-positioned bottom-right of video thumbnail. #000000 80% opacity background, 4px radius, 4px 8px padding, Inter 600/13px white text. Reports runtime (e.g., '21:35', '1:16').

### Section Heading
**Role:** Section title

Left-aligned Inter 700/24px white, 16px bottom margin, 0 letter-spacing. Used for 'Try these FREE video lessons' style headers. No accent color, no underline, no decoration — type weight alone does the work.

### Video Title
**Role:** Lesson card primary label

Inter 700/16px white, 1.4 line-height, max two lines. Sets the card's voice.

### Category Label
**Role:** Lesson card metadata

Inter 400/15px #a0a0a0, single line, below video title. Identifies the source course (e.g., 'Standout Web Designer', 'That Portfolio Course').

## Do's and Don'ts

### Do
- Use #000000 as the page canvas and keep all non-promo content achromatic — let the warm gradient banner be the only chromatic event on the page.
- Apply the linear-gradient(90deg, #ff8a00, #fa3a19) exclusively to the promo CTA button; never use it for nav, icons, or course cards.
- Use Inter 700/800 for all headings and Inter 400/600 for body — never mix in a second typeface family.
- Define card edges with 1px #343434 borders on #111111 surfaces; skip shadows and rely on flat color steps for hierarchy.
- Set video card padding to 16px and maintain an 8px gap between thumbnail, title, and category label inside each card.
- Keep the type scale capped at 24px — let video thumbnails and the gradient banner carry visual scale instead of oversized headlines.
- Use #ffffff for interactive text and headings, #a0a0a0 / #888888 for metadata and secondary copy.

### Don't
- Don't introduce any blue, green, or purple accent — the brand is a two-tone system (monochrome + warm gradient) and extra hues will dilute the spotlight effect.
- Don't apply the warm gradient to body text, icons, or borders — reserve it for the promo banner surface and its CTA button only.
- Don't use shadows or heavy rounded corners (>=12px); the system is intentionally flat with 4-6px radii and hairline borders.
- Don't set headings above 24px; oversized display type breaks the compact, instructor-led feel.
- Don't use #111111 as a button background for primary actions — that role belongs exclusively to the warm gradient CTA.
- Don't introduce a second typeface, custom display face, or serif — Inter alone carries the brand at every weight.
- Don't place the gradient banner inside cards or repeated lists; it must remain a singular full-width conversion event.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000000` | Page-wide background; absorbs visual noise so video thumbnails and the gradient banner read first |
| 1 | Card | `#111111` | Video lesson cards and grouped content blocks; one step off canvas to define edges without gray noise |
| 2 | Elevated | `#252525` | Subtle elevation for hover states, tooltips, or higher-tier promotional panels |

## Imagery

Imagery is dominated by 16:9 video thumbnails showing the instructor (bearded, beanie-wearing) in his studio with board-of-design and tools visible behind him. Thumbnails are treated as rectangular crops with no rounded corners or color treatment — they read as direct screencaps. A few thumbnails use a slide/UI overlay on the left half (e.g., a 'modern way to build for the web' slide) composited against the instructor on the right. No illustration, no abstract graphics, no photography beyond the instructor videos. Icon usage is minimal (chevrons in nav dropdowns). The promo banner introduces the only non-photographic color via gradient. Visual density is medium: the page mixes 4-column thumbnail rows with text-led sections, so thumbnails occupy roughly 40-50% of above-the-fold visual real estate.

## Layout

Full-bleed dark layout with no decorative side margins — content is centered within a 1200px max-width container. The hero is a centered stack: nav bar → centered logo → single subtitle line → full-width promo banner → section heading → 4-column thumbnail row. Sections stack vertically with 48px gaps and no alternating light/dark bands (the page is uniformly #000000). The video grid is a 4-column equal-width row on desktop, collapsing to 2-1 columns on smaller widths. Content arrangement is strictly left-aligned within cards and sections; only the logo and subtitle are center-aligned. Navigation is a flat top bar with a single dropdown (Courses → Jobs and Events / Coming Soon) and a right-aligned login button. No sidebar, no sticky header, no mega-menu.

## Gradient System

The brand runs a single warm gradient family with three operational variants: (1) Text gradient — linear-gradient(90deg, #ffc840, #fa3a19) applied to the 'Save 60%' wordmark on the promo banner; (2) Button gradient — linear-gradient(90deg, #ff8a00, #fa3a19) applied to the promo CTA fill; (3) Wash gradient — the same hues at 10-12% opacity used as a soft background tint behind the promo banner text. Never extend this family to other UI surfaces.

## Agent Prompt Guide

primary action: #111111 (filled action)
Create a Primary Action Button: #111111 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

Example Component Prompts:

1. Promo banner: full-width bar, 4px radius, 1px subtle border, soft amber→crimson wash background (12%→10% opacity). Left zone: 'Save 60%' in gradient text (amber #ffc840 → crimson #fa3a19, Inter 700/20px). Center zone: white Inter 600/16px text. Right zone: gradient-filled button (90deg, #ff8a00 → #fa3a19), white Inter 700/15px label, 6px radius, 8px 16px padding.

2. Video lesson card: #111111 surface, 1px #343434 border, 6px radius, 16px padding. Thumbnail (16:9) fills top, bottom-right duration badge (#000000 80% opacity, 4px radius, Inter 600/13px white). 8px gap to title (Inter 700/16px #ffffff), 4px gap to category (Inter 400/15px #a0a0a0).

3. Outlined nav button: transparent background, 1px #343434 border, 6px radius, 8px 16px padding, Inter 600/15px white label. Used for 'Student Login'.

4. Section heading: left-aligned Inter 700/24px #ffffff, 16px bottom margin, no decoration. Followed by a 4-column equal-width video grid with 16px gaps.

5. Page canvas: #000000 full-bleed background, 1200px max-width centered content container, 48px vertical gap between major sections, no shadows, no alternating bands.

## Similar Brands

- **Maven** — Same dark monochrome course-platform canvas with instructor-led video thumbnails and minimal type-driven hierarchy
- **Refind** — Black-canvas content site that lets a single warm accent color or gradient own the only chromatic moment on the page
- **Levels.fyi** — Pure black background with hairline gray borders, flat rectangular cards, and zero decorative shadow — content-first density
- **Design Buddies** — Design-education brand using a black-canvas layout with bold centered wordmark and conversion-focused promo strips

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-black: #000000;
  --color-surface-black: #111111;
  --color-lifted-charcoal: #252525;
  --color-border-gray: #343434;
  --color-edge-gray: #4d4d4d;
  --color-muted-text: #888888;
  --color-helper-gray: #a0a0a0;
  --color-pure-white: #ffffff;
  --color-amber-glow: #ffc840;
  --gradient-amber-glow: linear-gradient(90deg, #ffc84 0%, #fa3a19 100%);
  --color-ember-orange: #ff8a00;
  --gradient-ember-orange: linear-gradient(90deg, #ff8a00 0%, #fa3a19 100%);
  --color-crimson-heat: #fa3a19;
  --gradient-crimson-heat: linear-gradient(90deg, #ff8a00 0%, #fa3a19 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 21;
  --text-body-lg: 18px;
  --leading-body-lg: 28;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --text-heading: 24px;
  --leading-heading: 32;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-badges: 4px;
  --radius-banner: 4px;
  --radius-buttons: 6px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-card: #111111;
  --surface-elevated: #252525;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-black: #000000;
  --color-surface-black: #111111;
  --color-lifted-charcoal: #252525;
  --color-border-gray: #343434;
  --color-edge-gray: #4d4d4d;
  --color-muted-text: #888888;
  --color-helper-gray: #a0a0a0;
  --color-pure-white: #ffffff;
  --color-amber-glow: #ffc840;
  --color-ember-orange: #ff8a00;
  --color-crimson-heat: #fa3a19;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 21;
  --text-body-lg: 18px;
  --leading-body-lg: 28;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --text-heading: 24px;
  --leading-heading: 32;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
}
```
