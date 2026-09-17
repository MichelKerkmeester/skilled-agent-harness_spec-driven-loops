# Lottielab — Style Reference
> Animation studio on bright paper

**Theme:** light

Lottielab's visual language is a quiet, generous workspace built for creators: a near-white canvas, hairline borders, and a single vivid violet accent that appears only where attention is needed. The interface favors restraint over decoration — deep indigo-tinted text reads as authoritative without shouting, and components sit flat on the surface with almost no shadow, letting the product UI itself carry visual weight. Typography is geometric and contemporary, with tight negative tracking on large headlines and slightly open tracking on small labels, creating a confident vertical rhythm. Color is used surgically: brand violet highlights a keyword in headlines, fills the primary CTA, and marks active states; everything else stays neutral. The overall feel is an animation studio's digital sketchpad — spacious, tool-first, and engineered for flow.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#7270ff` | `--color-electric-violet` | Primary CTA buttons, active nav items, accent keywords in headlines, focus rings — the only chromatic element allowed to break the monochrome canvas, making every action feel switched on |
| Signal Blue | `#1560fb` | `--color-signal-blue` | Secondary accent for interactive highlights, selected states in tool surfaces, and inline brand emphasis where a cooler note is needed |
| Deep Indigo | `#2f2b4a` | `--color-deep-indigo` | Primary text and headings — a near-black with a violet undertone that warms the monochrome palette and distinguishes the brand from flat-charcoal SaaS defaults |
| Midnight Ink | `#1c1a2c` | `--color-midnight-ink` | Heaviest text weight, section titles, and surface-dark contexts — a deeper step than Deep Indigo for maximum contrast moments |
| Slate | `#4b5563` | `--color-slate` | Secondary body text, descriptions, metadata — sits between Deep Indigo and Silver for layered reading hierarchy |
| Silver | `#9ca3af` | `--color-silver` | Muted helper text, placeholder copy, disabled labels, and icon secondary tones |
| Fog | `#d9dbda` | `--color-fog` | Icon strokes at rest, subtle surface borders, low-emphasis dividers |
| Mist | `#e5e7eb` | `--color-mist` | Primary hairline borders across cards, inputs, dividers, and component edges — the dominant structural neutral |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, button text on violet fills, inverted icon strokes |
| Bone | `#f9fafb` | `--color-bone` | Alternate surface for nested panels, input fills, quiet sections within white pages |
| Pebble | `#f3f4f6` | `--color-pebble` | Page canvas, section bands between white blocks, product mockup backgrounds, footer wash |
| Sunset Gradient | `linear-gradient(to right, #facc15, #f97316)` | `--color-sunset-gradient` | Decorative gradient endpoint for marketing visuals and showcase cards |
| Bloom Gradient | `linear-gradient(to right, #ec4899, #f87171)` | `--color-bloom-gradient` | Decorative gradient endpoint for showcase cards and hero illustration accents |

## Tokens — Typography

### Plus Jakarta Sans — Sole typeface across the product. Geometric humanist sans with subtly squared terminals — contemporary but not cold. Weight 700 carries display and headings for confident vertical presence; weight 500 serves UI controls and labels; weight 400 handles body and descriptions. The slight openness in counters at small sizes keeps labels legible on dense tool surfaces. · `--font-plus-jakarta-sans`
- **Substitute:** Inter, Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 36px, 48px, 60px
- **Line height:** 1.00 (60px), 1.11 (36px, 48px), 1.43 (18px), 1.50 (16px), 1.56 (14px), 1.71 (12px)
- **Letter spacing:** -0.025em at 36px, 48px, 60px; 0.025em at 12px, 14px, 16px; normal at 18px
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Sole typeface across the product. Geometric humanist sans with subtly squared terminals — contemporary but not cold. Weight 700 carries display and headings for confident vertical presence; weight 500 serves UI controls and labels; weight 400 handles body and descriptions. The slight openness in counters at small sizes keeps labels legible on dense tool surfaces.

### Google Sans Code — Google Sans Code — detected in extracted data but not described by AI · `--font-google-sans-code`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Letter spacing:** 0.025
- **Role:** Google Sans Code — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.71 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.56 | 0.35px | `--text-body-sm` |
| body | 16px | 1.5 | 0.4px | `--text-body` |
| subheading | 18px | 1.43 | — | `--text-subheading` |
| heading-sm | 36px | 1.11 | -0.9px | `--text-heading-sm` |
| heading | 48px | 1.11 | -1.2px | `--text-heading` |
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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| icons | 9999px |
| pills | 9999px |
| inputs | 8px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary CTA Button
**Role:** Single decisive conversion action on every page

Filled Electric Violet (#7270ff) background, Paper (#ffffff) text, Plus Jakarta Sans 16px weight 600, 12px border radius, 12px 24px padding, no border. The only button allowed to use full chromatic fill.

### Outlined Nav Button
**Role:** Secondary action in the header

Electric Violet (#7270ff) 1px border, Paper (#ffffff) fill, Electric Violet text, 12px radius, 8px 20px padding. Used for Sign up in the nav bar — the quieter sibling of the primary CTA.

### Ghost Text Link
**Role:** Inline navigation and tertiary actions

No background, Deep Indigo (#2f2b4a) text 14px weight 500, underline on hover, 4px vertical padding for hit area. Appears in nav items, footer, inline content references.

### Product Mockup Frame
**Role:** Browser-style container around the editor preview

Paper (#ffffff) background, Mist (#e5e7eb) 1px border, 8px radius, 24px internal padding. Top chrome bar with three traffic-light dots (Fog #d9dbda) and a thin border-bottom separator. Renders the timeline editor and animation cards inside.

### Animation Preview Card
**Role:** Showcase tile in the product gallery

Paper (#ffffff) surface, 8px radius, Mist (#e5e7eb) border, 16px padding. Contains a centered animation preview on Bone (#f9fafb) inner background with a 4px label strip below the preview.

### Timeline Track Row
**Role:** Animation keyframe row inside the editor

Horizontal row, 24px row gap, Fog (#d9dbda) keyframe block with 4px radius. Active track uses a filled Slate (#9ca3af) block, inactive tracks use a Bone (#f9fafb) block. Playhead is a 1px Midnight Ink (#1c1a2c) vertical line with a circular handle.

### Trust Logo Strip
**Role:** Social proof bar below the hero

Full-width Pebble (#f3f4f6) band, logos rendered in Silver (#9ca3af) at uniform height, 40px horizontal padding per logo, evenly distributed via flex justify-between. No dividers.

### Section Heading Block
**Role:** Centered text intro before content sections

Centered stack, 24px element gap. Eyebrow text at 14px weight 600 in Electric Violet (#7270ff) with 0.025em tracking. Heading at 48px weight 700 Deep Indigo with -1.2px tracking. Subtext at 18px weight 400 Slate (#4b5563).

### Input Field
**Role:** Text entry in forms and editor

Paper (#ffffff) fill, Mist (#e5e7eb) 1px border, 8px radius, 12px 16px padding. Placeholder text in Silver (#9ca3af). Focus state swaps border to Electric Violet (#7270ff) with no shadow ring.

### Nav Bar
**Role:** Top-level site navigation

Paper (#ffffff) background, 64px height, 40px horizontal padding, bottom border 1px Mist (#e5e7eb). Logo left, nav links center-right (Deep Indigo 14px weight 500), CTA pair right-aligned. Sticky on scroll.

### Brand Logo Mark
**Role:** Lottielab identity

Rounded square 32×32 with 8px radius, Electric Violet (#7270ff) fill, white serif 'L' glyph centered. Paired with 'Lottielab' wordmark in Deep Indigo (#2f2b4a) 16px weight 600.

### Gradient Showcase Card
**Role:** Decorative card in feature sections

Uses one of the two brand gradients (Sunset #facc15→#f97316 or Bloom #ec4899→#f87171) as background, Paper (#ffffff) text overlay, 24px radius, 32px padding. Reserved for marketing showcase, never for UI controls.

## Do's and Don'ts

### Do
- Use #7270ff as the only chromatic fill on the page — every other surface stays in the neutral scale from #f3f4f6 to #2f2b4a.
- Set display text at 60px and headings at 48px with letter-spacing -1.5px and -1.2px respectively to match the contemporary tight-tracking rhythm.
- Apply 8px radius to all cards and panels, 12px to buttons, 9999px to tags and icon containers — the three-tier system is non-negotiable.
- Use Mist (#e5e7eb) 1px borders instead of shadows to separate layers; elevation comes from background stepping, not blur.
- Highlight one keyword per headline in Electric Violet (#7270ff) — the rest of the sentence stays Deep Indigo to create a single beat of color.
- Pair Plus Jakarta Sans weight 700 with 1.00–1.11 line-height for headlines; reserve weight 500 for UI labels and weight 400 for body copy.
- Alternate between #ffffff and #f3f4f6 section bands to create rhythm without using color or shadows.

### Don't
- Don't introduce additional brand hues — the palette is intentionally violet-only; resist adding teals, greens, or pinks to core UI.
- Don't use shadows, glows, or blur effects for elevation; rely on surface color stepping and 1px hairline borders instead.
- Don't set body text below 14px or use weights under 400 — the type system is calibrated for comfortable reading at 16px+.
- Don't apply gradient fills to buttons, inputs, or navigation — gradients are reserved for showcase and marketing visuals only.
- Don't use pure #000000 for text on light backgrounds; use Deep Indigo (#2f2b4a) to preserve the warm violet undertone of the brand.
- Don't break the 8px spacing grid — all padding, gaps, and margins should land on multiples of 8 (with 4px and 2px allowed only for micro-adjustments inside components).
- Don't stack multiple violet elements on a single screen — one chromatic moment per viewport keeps the accent meaningful.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f3f4f6` | Page background between content bands |
| 1 | Panel | `#ffffff` | Card and component surfaces |
| 2 | Nested | `#f9fafb` | Inner panels, inputs, quiet wells |

## Elevation

The design deliberately avoids box-shadows and blur effects. Elevation is communicated entirely through surface color stepping — moving from Pebble (#f3f4f6) canvas to Paper (#ffffff) panels to Bone (#f9fafb) nested wells — and through 1px Mist (#e5e7eb) hairline borders. This keeps the interface feeling flat, fast, and tool-oriented, like a design canvas rather than a card-stack app.

## Imagery

Product-led imagery dominates: large browser-frame mockups containing the actual editor interface, with timeline tracks, animation preview cards, and keyframe blocks visible. Marketing illustrations are abstract and kinetic — colorful gradient washes (sunset yellow→orange, pink→red) and floating shape compositions evoke motion. No photography of people or workplaces. Icons are minimal, rendered as 1.5px stroke line work in Fog (#d9dbda) or Silver (#9ca3af), with circular pill backgrounds in Bone (#f9fafb) for icon containers. The visual density sits in the product UI itself — the marketing site shows rather than tells.

## Layout

Centered max-width 1200px container with 40px horizontal padding on desktop. Hero is a single centered text stack with headline, subtext, and CTA stacked vertically with 24px gaps, no hero image. Below the hero, a full-bleed Pebble (#f3f4f6) band hosts the trust logo strip, then transitions to white for the product mockup section. Sections alternate between white and #f3f4f6 backgrounds in a consistent rhythm with 80px vertical gaps. Content blocks use 2-column text-plus-mockup splits for feature explanations and 4-column grids for template galleries. Navigation is a single sticky top bar at 64px height — no sidebar, no mega-menu. The page reads top-to-bottom as a vertical scroll: headline → trust → product preview → features → templates → CTA.

## Agent Prompt Guide

## Quick Color Reference
- text: #2f2b4a
- background: #f3f4f6
- panel: #ffffff
- border: #e5e7eb
- accent: #7270ff
- primary action: #7270ff (filled action)

## Example Component Prompts

1. **Hero Section** — Centered max-width 800px stack on #ffffff. Display headline at 60px Plus Jakarta Sans weight 700, #2f2b4a, letter-spacing -1.5px, with the phrase 'for product teams' set in #7270ff. Subtext at 18px weight 400, #4b5563. Primary action button: #7270ff fill, white text 16px weight 600, 12px radius, 12px 24px padding.

2. **Product Mockup Frame** — Browser-style container, #ffffff background, #e5e7eb 1px border, 8px radius, 24px padding. Top chrome bar 32px tall with three #d9dbda dots and a 1px #e5e7eb bottom border. Inside: a 2-row timeline with #9ca3af keyframe blocks on #f9fafb tracks and a 1px #1c1a2c playhead line.

3. **Trust Logo Strip** — Full-width #f3f4f6 band, 80px vertical padding. Eight logos in #9ca3af, evenly distributed across max-width 1200px with 40px gaps, no dividers.

4. **Section Heading Block** — Centered stack with 24px gaps. Eyebrow: 14px weight 600 #7270ff with 0.025em tracking. Heading: 48px weight 700 #2f2b4a, letter-spacing -1.2px. Subtext: 18px weight 400 #4b5563.

5. **Animation Preview Card** — #ffffff surface, 8px radius, 1px #e5e7eb border, 16px padding. Centered preview on #f9fafb inner background (200px square), with a 4px #e5e7eb label strip below.

## Gradient System

Two decorative gradients are available for marketing visuals and showcase cards only — never for UI controls or navigation. Sunset: linear-gradient(to right, #facc15, #f97316) for warm energy compositions. Bloom: linear-gradient(to right, #ec4899, #f87171) for softer, playful compositions. Both should appear at 24px radius on cards with white text overlays, always inside a #f3f4f6 section to keep them contained.

## Similar Brands

- **Linear** — Same single-accent strategy with a vivid violet/indigo on a near-white canvas, identical tight-tracking display headlines, and flat surface stepping without shadows.
- **Framer** — Clean light SaaS with generous whitespace, product mockups as hero visuals, and a single brand hue used for keyword emphasis in headlines.
- **Pitch** — Geometric sans typography, monochrome surface palette, and one chromatic accent that appears only on CTAs and active states.
- **Vercel** — Hairline border-driven layering, no-shadow elevation philosophy, and a deep-tinted near-black for primary text instead of pure black.
- **Raycast** — Comfortable-density spacing on an 8px grid, restrained palette with one functional accent, and components that sit flat on the canvas.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #7270ff;
  --color-signal-blue: #1560fb;
  --color-deep-indigo: #2f2b4a;
  --color-midnight-ink: #1c1a2c;
  --color-slate: #4b5563;
  --color-silver: #9ca3af;
  --color-fog: #d9dbda;
  --color-mist: #e5e7eb;
  --color-paper: #ffffff;
  --color-bone: #f9fafb;
  --color-pebble: #f3f4f6;
  --color-sunset-gradient: #facc15;
  --gradient-sunset-gradient: linear-gradient(to right, #facc15, #f97316);
  --color-bloom-gradient: #ec4899;
  --gradient-bloom-gradient: linear-gradient(to right, #ec4899, #f87171);

  /* Typography — Font Families */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans-code: 'Google Sans Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.71;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.9px;
  --text-heading: 48px;
  --leading-heading: 1.11;
  --tracking-heading: -1.2px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Typography — Weights */
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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-icons: 9999px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-canvas: #f3f4f6;
  --surface-panel: #ffffff;
  --surface-nested: #f9fafb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #7270ff;
  --color-signal-blue: #1560fb;
  --color-deep-indigo: #2f2b4a;
  --color-midnight-ink: #1c1a2c;
  --color-slate: #4b5563;
  --color-silver: #9ca3af;
  --color-fog: #d9dbda;
  --color-mist: #e5e7eb;
  --color-paper: #ffffff;
  --color-bone: #f9fafb;
  --color-pebble: #f3f4f6;
  --color-sunset-gradient: #facc15;
  --color-bloom-gradient: #ec4899;

  /* Typography */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans-code: 'Google Sans Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.71;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.9px;
  --text-heading: 48px;
  --leading-heading: 1.11;
  --tracking-heading: -1.2px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```
