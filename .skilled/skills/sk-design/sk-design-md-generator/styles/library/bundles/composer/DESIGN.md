# Composer — Style Reference
> Bauhaus confetti on concrete

**Theme:** light

Composer speaks in the language of an editorial trading manifesto: a light ash canvas scattered with Bauhaus confetti — vivid blue, green, pink, and yellow rectangles that read as information shapes, not decoration. The Neue Haas Grotesk Display type stretches to 244px, letting headlines dominate like magazine covers while Inter handles the quiet, compact UI chrome below. The system is confident and maximalist for marketing surfaces but contracts to a clean, functional dashboard for product work — sharp 2px icon edges and pill-shaped 9999px buttons coexist without contradiction, because both serve clarity over softness. Color is deployed as functional punctuation: black text on near-white surfaces, hairline gray borders everywhere, and saturated chromatic blocks that mark emphasis, group information, and create visual rhythm across an otherwise monochrome grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#1871da` | `--color-signal-blue` | Brand blue — decorative color blocks, icon fills, secondary borders, and the blue-tinted shadow that gives elevation its on-brand cast |
| Pulse Green | `#1ec072` | `--color-pulse-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Hot Pink | `#f6609f` | `--color-hot-pink` | Vivid pink — decorative strokes, confetti blocks, and gradient underline washes |
| Cotton Candy | `#ffb4ed` | `--color-cotton-candy` | Pink action color for filled buttons, selected navigation states, and focused conversion moments. |
| Solar Yellow | `#ffbb38` | `--color-solar-yellow` | Yellow accent — confetti blocks, gradient underlines, and warm decorative surfaces |
| Ember Orange | `#ff5500` | `--color-ember-orange` | Orange accent — decorative fills, strokes, and secondary button surfaces |
| Forest Moss | `#31805a` | `--color-forest-moss` | Deep green — heading text color, card backgrounds, and muted button surfaces that need an earthy chromatic weight |
| Tangerine | `#ffa724` | `--color-tangerine` | Warm orange — button backgrounds and body accent fills, slightly softer than Ember Orange |
| Ultraviolet | `#9664d7` | `--color-ultraviolet` | Purple accent — rare chromatic punctuation for buttons and decorative fills |
| Deep Iris | `#0c4cbe` | `--color-deep-iris` | Dark blue border — used for emphasis borders that need more weight than Signal Blue |
| Azure | `#1f86ff` | `--color-azure` | Lighter blue border — paired with Deep Iris in decorative border compositions |
| Alert Red | `#c60808` | `--color-alert-red` | Red action color for filled buttons, selected navigation states, and focused conversion moments. Use as a supporting accent, not as a status color |
| Deep Moss | `#1c372a` | `--color-deep-moss` | Dark text/footer — near-black with a green undertone, used for footer backgrounds and deep heading text |
| Concrete | `#e5e7eb` | `--color-concrete` | Hairline border — the dominant neutral border color, appearing on virtually every element |
| Obsidian | `#000000` | `--color-obsidian` | Primary text and filled CTA — all body and heading text, plus filled button backgrounds |
| Paper | `#ffffff` | `--color-paper` | Card and nav surface — opaque white for cards, navigation bar, and button text |
| Carbon | `#101516` | `--color-carbon` | Dark surface — footer background and inverted dark blocks, near-black with a slight teal undertone |
| Mist | `#f7f7f7` | `--color-mist` | Subtle background — off-white fill for sections that need separation from Paper without a visible border |
| Pebble | `#bec6cc` | `--color-pebble` | Secondary border — slightly darker than Concrete for borders that need more weight |
| Ash | `#cccccc` | `--color-ash` | Border and shadow base — mid-gray borders and shadow midtones |
| Smoke | `#d7d7d7` | `--color-smoke` | Background wash — light gray fill for inactive states and subtle surface differentiation |
| Stone | `#999999` | `--color-stone` | Icon border — medium gray for icon outlines that recede behind content |
| Graphite | `#262d2f` | `--color-graphite` | Dark card surface and stroke — deep neutral for inverted cards and decorative strokes |
| Iron | `#666666` | `--color-iron` | Muted text and icon fill — secondary text color, icon fills, and decorative strokes |
| Slate | `#808080` | `--color-slate` | Tertiary border and shadow — mid-gray for low-emphasis borders and shadow accents |

## Tokens — Typography

### Neue Haas Grotesk Display — Primary typeface — the editorial voice of the brand. Drives the 244px display headline that defines the hero, all headings down to 14px nav links. The extreme range from 244px to 14px in a single family creates visual cohesion: one geometric grotesque doing everything from poster-scale headlines to micro-labels. · `--font-neue-haas-grotesk-display`
- **Substitute:** Inter (closest free alternative), Helvetica Neue, or Suisse Int'l
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 16, 20, 24, 32, 36, 56, 64, 244
- **Line height:** 1.00, 1.07, 1.11, 1.20, 1.25, 1.30, 1.33, 1.40, 1.43, 1.50
- **Letter spacing:** 0.0100em to 0.0570em — tracking stays positive even at display sizes, an unusual choice that keeps the massive 244px headline from feeling condensed and preserves breathing room at all scales
- **Role:** Primary typeface — the editorial voice of the brand. Drives the 244px display headline that defines the hero, all headings down to 14px nav links. The extreme range from 244px to 14px in a single family creates visual cohesion: one geometric grotesque doing everything from poster-scale headlines to micro-labels.

### Inter — Secondary typeface — handles compact UI chrome: fine-print body text, captions, tabular data, and icon-adjacent labels below 16px. Frees the primary face to own the editorial moments. · `--font-inter`
- **Substitute:** System UI sans-serif (SF Pro, Segoe UI)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 9, 10, 12, 14, 16
- **Line height:** 1.25, 1.33, 1.43, 1.50
- **Letter spacing:** 0.0250em
- **OpenType features:** `"calt" on`
- **Role:** Secondary typeface — handles compact UI chrome: fine-print body text, captions, tabular data, and icon-adjacent labels below 16px. Frees the primary face to own the editorial moments.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.35px | `--text-body-sm` |
| body | 16px | 1.5 | 0.4px | `--text-body` |
| subheading | 20px | 1.33 | 0.5px | `--text-subheading` |
| heading-sm | 24px | 1.25 | 0.6px | `--text-heading-sm` |
| heading | 32px | 1.2 | 0.8px | `--text-heading` |
| heading-lg | 56px | 1.07 | 1.4px | `--text-heading-lg` |
| display | 64px | 1.07 | 1.28px | `--text-display` |
| display-xl | 244px | 1 | 2.44px | `--text-display-xl` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| icons | 2px |
| buttons | 9999px |
| large-buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(24, 113, 218, 0.25) 0px 1px 2px 0px` | `--shadow-subtle` |
| xl | `rgba(0, 0, 0, 0.01) 45px 68px 33px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-xl` |
| xl-2 | `rgba(31, 33, 35, 0.03) 54px 82px 39px 0px, rgba(31, 33, 3...` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Editorial Display Headline
**Role:** Hero and section-defining headlines

Neue Haas Grotesk Display at 244px, weight 600, line-height 1.0, letter-spacing 0.01em. Renders in Obsidian (#000000). The extreme size is the brand's signature — it transforms headings from text into posters. Pair with a smaller-weight subtitle at 24-32px to create the editorial 'headline + dek' structure.

### Confetti Color Block
**Role:** Decorative geometric rectangles scattered across the canvas

Solid-filled rectangles in Signal Blue (#1871da), Pulse Green (#1ec072), Hot Pink (#f6609f), Solar Yellow (#ffbb38), and Cotton Candy (#ffb4ed). Zero border-radius (sharp 0px edges), various sizes from 40px to 200px, positioned absolutely or in a grid. These are the Bauhaus confetti — they carry visual rhythm without representing any data.

### Pill Navigation Link
**Role:** Top navigation bar items

Neue Haas Grotesk 14px, weight 500, Obsidian text. 8px vertical padding, 12px horizontal padding. No visible border or background. Sits directly on the white nav bar with 16px gaps between items. The 'Sign Up' variant is a filled black pill with white text.

### Filled Black CTA Button
**Role:** Primary call-to-action — the only filled button style

Obsidian (#000000) background, Paper (#ffffff) text, 9999px border-radius (fully pill-shaped), 12px vertical padding, 24px horizontal padding. Neue Haas Grotesk 16px weight 500. Includes a right arrow (→) glyph for directional actions. This is the system's only CTA — there is no chromatic filled button variant.

### Ghost Text Link
**Role:** Inline links and secondary navigation

Neue Haas Grotesk 16px weight 500, Obsidian text, no background or border. Underline appears on hover only. The 'Login' link in the nav uses this style — it sits alongside the filled 'Sign Up' pill to create a quiet/loud pair.

### Highlighted Body Text
**Role:** Emphasized words within body copy

Body text (16px Neue Haas Grotesk 400) with selected words wrapped in a Cotton Candy (#ffb4ed) background fill. The highlight extends slightly beyond the text bounds (2-4px padding) with no radius. This is the editorial 'marker pen' effect — it makes key phrases scannable without changing text color.

### Gradient Underline Accent
**Role:** Decorative underline beneath headings or links

A 20px-tall horizontal line that fades from a solid chromatic color to transparent: Hot Pink (#f6609f), Pulse Green (#1ec072), or Solar Yellow (#ffbb38). Rendered as a pseudo-element with a linear-gradient (solid 20px → transparent). Sits 4px below the text it accompanies.

### Elevated Card
**Role:** Content cards for features, pricing, and data panels

Paper (#ffffff) background, 6px border-radius, 1px Concrete (#e5e7eb) border, 24px padding. Optional multi-layer soft shadow (45px/68px spread at 1% opacity, cascading to 3px/4px at 4% opacity) for cards that need to float above the canvas. Zero or minimal shadow for cards on flat sections.

### Icon Container
**Role:** Small icon backgrounds for feature lists and nav

2px border-radius (near-sharp), 16-20px padding, filled with a chromatic accent color or Concrete gray. Icons inside are 16-20px, rendered in Paper white or Obsidian. The sharp 2px radius contrasts deliberately with the 9999px pill buttons to create geometric tension.

### Dark Footer
**Role:** Site footer

Carbon (#101516) background, Paper (#ffffff) text, Deep Moss (#1c372a) as a secondary surface tone. 64px vertical padding. Links in 14px Neue Haas Grotesk 400. The only dark surface on the page — it creates a strong terminal band.

### Section Divider Band
**Role:** Visual separation between page sections

Full-width horizontal band in a chromatic accent color (Pulse Green, Hot Pink, Solar Yellow) or Mist (#f7f7f7), 8-16px tall. Acts as a color-coded section break without using a visible border line.

### Navigation Bar
**Role:** Sticky top navigation

Paper (#ffffff) background, 1px Concrete (#e5e7eb) bottom border, 16px vertical padding. Logo (Composer wordmark) on the left, nav links centered, Login + Sign Up on the right. Sticky on scroll. The border-bottom is the only structural divider — the nav itself is borderless on three sides.

## Do's and Don'ts

### Do
- Use 9999px border-radius for all interactive elements that are buttons, tags, or nav items — the pill shape is non-negotiable.
- Let the display headline reach 244px when it needs to own the page; don't constrain editorial moments to 48-64px.
- Deploy confetti color blocks as geometric composition elements — zero radius, solid fills, scattered across the gray canvas in Signal Blue, Pulse Green, Hot Pink, Solar Yellow, and Cotton Candy.
- Use the blue-tinted shadow (rgba(24, 113, 218, 0.25)) for focus rings and brand-flavored elevation — never use a neutral gray shadow when the blue cast is available.
- Set body text and headings in Obsidian (#000000) on Paper (#ffffff) or Concrete (#e5e7eb) — the 21:1 contrast ratio is the system's safety floor.
- Use the Cotton Candy (#ffb4ed) highlight background on emphasized words within body copy to create editorial scannability without changing text color.
- Keep letter-spacing positive at all sizes including display — 0.01em to 0.057em — the airy tracking distinguishes this system from condensed editorial type.

### Don't
- Don't create a chromatic filled CTA button — the only filled button is Obsidian (#000000). Color is for decoration, not action.
- Don't use shadows on flat sections — cards on the Concrete canvas should rely on 1px Concrete borders, not elevation, to maintain the Swiss-editorial flatness.
- Don't set body text below 14px or above 16px — the 14-16px band is where the secondary Inter face takes over from Neue Haas Grotesk.
- Don't apply border-radius larger than 6px to cards or containers — the 2px (icons) and 6px (cards) are the system; 9999px is reserved for buttons and tags only.
- Don't use more than three chromatic accent colors in a single composition — the confetti effect works because each color is isolated, not blended.
- Don't substitute the blue-tinted shadow with a neutral shadow on interactive elements — the brand cast at rgba(24, 113, 218, 0.25) is what makes focus states feel on-system.
- Don't set the display headline below 56px or use negative letter-spacing at any size — the positive tracking (0.01em minimum) preserves the editorial breathing room.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Concrete | `#e5e7eb` | Page canvas — the dominant light gray background that unifies the entire page |
| 1 | Paper | `#ffffff` | Card and nav surface — opaque white that lifts elements off the gray canvas |
| 2 | Mist | `#f7f7f7` | Subtle fill — near-white for sections that need tonal separation without a hard border |
| 3 | Graphite | `#262d2f` | Dark elevated card — for inverted content blocks and data-dense panels |
| 4 | Carbon | `#101516` | Deepest surface — footer and dark-mode-adjacent blocks |

## Elevation

- **Brand-tinted focus ring:** `0 1px 2px 0 rgba(24, 113, 218, 0.25)`
- **Elevated card (subtle):** `45px 68px 33px 0 rgba(0,0,0,0.01), 25px 38px 27px 0 rgba(0,0,0,0.02), 11px 17px 20px 0 rgba(0,0,0,0.03), 3px 4px 11px 0 rgba(0,0,0,0.04)`
- **Elevated card (strong):** `54px 82px 39px 0 rgba(31,33,35,0.03), 31px 46px 33px 0 rgba(31,33,35,0.09), 14px 20px 24px 0 rgba(31,33,35,0.15), 3px 5px 13px 0 rgba(31,33,35,0.18)`

## Imagery

The site has no photography or illustration. Visual language is built entirely from typography, flat color blocks, and geometric composition. The 'confetti' rectangles in Signal Blue, Pulse Green, Hot Pink, Solar Yellow, and Cotton Candy function as the only graphic elements — they read as Bauhaus information shapes rather than decoration. Icons are minimal, rendered in 2px-radius containers with solid chromatic fills. No product screenshots, no lifestyle photography, no 3D renders. The restraint is total: the display type and color blocks do all the visual work.

## Layout

Full-bleed layout with no max-width container on the hero — the gray Concrete canvas extends edge-to-edge, and the confetti blocks scatter beyond any column boundary. Below the fold, content contracts to a 1200px max-width centered column. The hero is a split composition: left-aligned text block (headline + subhead + CTA) occupying roughly 40% of the width, with the display headline bleeding into the right 60% where the confetti blocks cluster. Sections are separated by full-width chromatic divider bands (8-16px tall) rather than whitespace gaps. Feature sections use 3-column card grids. The footer is a full-width dark band (Carbon) that extends edge-to-edge.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Obsidian)
- background: #e5e7eb (Concrete canvas) / #ffffff (Paper surface)
- border: #e5e7eb (Concrete, 1px hairline)
- accent: #1871da (Signal Blue — decorative blocks, borders, shadow tint)
- accent: #1ec072 (Pulse Green — decorative blocks, gradient underlines)
- primary action: #ff5500 (filled action)

**3 Example Component Prompts**

1. Create a Primary Action Button: #ff5500 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Create a feature card.* Paper (#ffffff) background, 6px border-radius, 1px #e5e7eb border, 24px padding. Icon: 2px radius container, 16px padding, filled with #1ec072, white icon inside at 16px. Heading: Neue Haas Grotesk 20px weight 600, #000000. Body text: 16px weight 400, #000000, line-height 1.5. No shadow on flat sections; add the multi-layer soft shadow (45px/68px at 1% opacity cascading to 3px/4px at 4%) only if the card floats above other content.


## Similar Brands

- **Stripe** — Same editorial display typography approach — massive sans-serif headlines on light canvas, hairline gray borders, and color used sparingly for functional emphasis rather than decoration
- **Replit** — Same playful maximalist color deployment — vivid chromatic rectangles and shapes scattered across a light background, treating color as geometric information rather than UI chrome
- **Linear** — Same sharp-vs-pill geometric tension — crisp 2px icon edges and 6px cards alongside fully pill-shaped buttons, with near-white surfaces and hairline borders as the connective tissue
- **Pitch** — Same Swiss-editorial typography attitude — Neue Haas-adjacent grotesque at display sizes with positive letter-spacing, light canvas, and color blocks that feel like Bauhaus information shapes
- **Ramp** — Same compact density and pill-button-only interaction model — filled black CTAs, ghost text links, and a single brand accent color deployed as decoration rather than action

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #1871da;
  --color-pulse-green: #1ec072;
  --color-hot-pink: #f6609f;
  --color-cotton-candy: #ffb4ed;
  --color-solar-yellow: #ffbb38;
  --color-ember-orange: #ff5500;
  --color-forest-moss: #31805a;
  --color-tangerine: #ffa724;
  --color-ultraviolet: #9664d7;
  --color-deep-iris: #0c4cbe;
  --color-azure: #1f86ff;
  --color-alert-red: #c60808;
  --color-deep-moss: #1c372a;
  --color-concrete: #e5e7eb;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-carbon: #101516;
  --color-mist: #f7f7f7;
  --color-pebble: #bec6cc;
  --color-ash: #cccccc;
  --color-smoke: #d7d7d7;
  --color-stone: #999999;
  --color-graphite: #262d2f;
  --color-iron: #666666;
  --color-slate: #808080;

  /* Typography — Font Families */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.6px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: 1.4px;
  --text-display: 64px;
  --leading-display: 1.07;
  --tracking-display: 1.28px;
  --text-display-xl: 244px;
  --leading-display-xl: 1;
  --tracking-display-xl: 2.44px;

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
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-icons: 2px;
  --radius-buttons: 9999px;
  --radius-large-buttons: 100px;

  /* Shadows */
  --shadow-subtle: rgba(24, 113, 218, 0.25) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.01) 45px 68px 33px 0px, rgba(0, 0, 0, 0.02) 25px 38px 27px 0px, rgba(0, 0, 0, 0.03) 11px 17px 20px 0px, rgba(0, 0, 0, 0.04) 3px 4px 11px 0px;
  --shadow-xl-2: rgba(31, 33, 35, 0.03) 54px 82px 39px 0px, rgba(31, 33, 35, 0.09) 31px 46px 33px 0px, rgba(31, 33, 35, 0.15) 14px 20px 24px 0px, rgba(31, 33, 35, 0.18) 3px 5px 13px 0px;

  /* Surfaces */
  --surface-concrete: #e5e7eb;
  --surface-paper: #ffffff;
  --surface-mist: #f7f7f7;
  --surface-graphite: #262d2f;
  --surface-carbon: #101516;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #1871da;
  --color-pulse-green: #1ec072;
  --color-hot-pink: #f6609f;
  --color-cotton-candy: #ffb4ed;
  --color-solar-yellow: #ffbb38;
  --color-ember-orange: #ff5500;
  --color-forest-moss: #31805a;
  --color-tangerine: #ffa724;
  --color-ultraviolet: #9664d7;
  --color-deep-iris: #0c4cbe;
  --color-azure: #1f86ff;
  --color-alert-red: #c60808;
  --color-deep-moss: #1c372a;
  --color-concrete: #e5e7eb;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-carbon: #101516;
  --color-mist: #f7f7f7;
  --color-pebble: #bec6cc;
  --color-ash: #cccccc;
  --color-smoke: #d7d7d7;
  --color-stone: #999999;
  --color-graphite: #262d2f;
  --color-iron: #666666;
  --color-slate: #808080;

  /* Typography */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.6px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: 1.4px;
  --text-display: 64px;
  --leading-display: 1.07;
  --tracking-display: 1.28px;
  --text-display-xl: 244px;
  --leading-display-xl: 1;
  --tracking-display-xl: 2.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(24, 113, 218, 0.25) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.01) 45px 68px 33px 0px, rgba(0, 0, 0, 0.02) 25px 38px 27px 0px, rgba(0, 0, 0, 0.03) 11px 17px 20px 0px, rgba(0, 0, 0, 0.04) 3px 4px 11px 0px;
  --shadow-xl-2: rgba(31, 33, 35, 0.03) 54px 82px 39px 0px, rgba(31, 33, 35, 0.09) 31px 46px 33px 0px, rgba(31, 33, 35, 0.15) 14px 20px 24px 0px, rgba(31, 33, 35, 0.18) 3px 5px 13px 0px;
}
```
