# Figma — Style Reference
> white gallery wall with a single indigo spotlight.

**Theme:** light

Figma operates as a pure white canvas for creativity: an achromatic interface where black text, white surfaces, and a single electric indigo accent do all the work. The visual system stays out of the way so that user-generated design work can speak — bold display headlines, light weight body text, and pill-shaped controls create a quiet, confident stage. Color appears sparingly as functional punctuation (CTAs, hover states, the Figma logo) while the surrounding page is deliberately blank, almost gallery-like. Elevation is reduced to one soft drop shadow on elevated cards; the rest of the hierarchy is built with whitespace, weight contrast, and scale. The rhythm alternates between vast breathing-room sections and tightly packed card grids, producing a museum-meets-workspace feel.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, icon strokes, high-contrast borders — the default for all body, heading, and UI stroke color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button fills for ghost/outlined controls — the dominant surface tone |
| Soft Mist | `#e2e2e2` | `--color-soft-mist` | Subtle card surface, secondary panel backgrounds — sits one step above pure white |
| Graphite | `#595959` | `--color-graphite` | Muted helper text, secondary labels, de-emphasized metadata |
| Electric Indigo | `#4d49fc` | `--color-electric-indigo` | Primary CTA buttons, active nav indicators, brand focal points — the only saturated fill the system uses for action |
| Figma Cyan | `#00b6ff` | `--color-figma-cyan` | Figma logo accent, decorative icon highlight — one of the four brand-marker colors in the mark |
| Figma Green | `#24cb71` | `--color-figma-green` | Figma logo accent, decorative icon highlight — second brand-marker in the four-color mark |
| Figma Orange | `#ff7237` | `--color-figma-orange` | Figma logo accent, decorative icon highlight — third brand-marker in the four-color mark |
| Lime Wash | `#e4ff97` | `--color-lime-wash` | Decorative illustration fill, playful community-card tint — pastel accent for expressive backgrounds |
| Lilac | `#c4baff` | `--color-lilac` | Decorative illustration fill, pastel accent for expressive backgrounds and tags |
| Blush | `#ffc9c1` | `--color-blush` | Decorative illustration fill, pastel accent for expressive backgrounds |
| Aqua Mist | `#c7f8fb` | `--color-aqua-mist` | Decorative illustration fill, pastel accent for expressive backgrounds |
| Earworm Teal | `#33dfdf` | `--color-earworm-teal` | Ring stroke, radial highlight accents on decorative graphics — high-energy neon teal |
| Mustard | `#b98e01` | `--color-mustard` | Ring stroke, radial highlight accents on decorative graphics — warm gold companion to teal |

## Tokens — Typography

### figmaSans — Primary typeface for all UI. The variable axis spanning 320–700 enables ultra-light display weights for hero headlines (creating whispered authority) up to 700 for bold labels. The custom 'kern' feature and tight negative tracking (-0.02em at 72px) give it a precision-instrument feel. All body, headings, buttons, navigation, and cards use this family. · `--font-figmasans`
- **Substitute:** Inter
- **Weights:** 320, 330, 340, 400, 450, 480, 520, 700
- **Sizes:** 16, 18, 24, 56, 72
- **Line height:** 1.00, 1.10, 1.30, 1.35, 1.40, 1.45
- **Letter spacing:** -0.02em at 72px → -0.007em at 16px (tighter as size increases)
- **OpenType features:** `"kern"`
- **Role:** Primary typeface for all UI. The variable axis spanning 320–700 enables ultra-light display weights for hero headlines (creating whispered authority) up to 700 for bold labels. The custom 'kern' feature and tight negative tracking (-0.02em at 72px) give it a precision-instrument feel. All body, headings, buttons, navigation, and cards use this family.

### figmaMono — Monospace companion for code snippets, technical labels, and UI annotations. Positive tracking (+0.03em to +0.05em) is deliberate — monospace text breathes wider to read as annotation, not body copy. · `--font-figmamono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 12, 16
- **Line height:** 1.00, 1.30
- **Letter spacing:** +0.03em to +0.05em
- **OpenType features:** `"kern"`
- **Role:** Monospace companion for code snippets, technical labels, and UI annotations. Positive tracking (+0.03em to +0.05em) is deliberate — monospace text breathes wider to read as annotation, not body copy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | 0.48px | `--text-caption` |
| body-sm | 16px | 1.45 | -0.11px | `--text-body-sm` |
| body | 18px | 1.4 | -0.18px | `--text-body` |
| heading | 24px | 1.35 | -0.24px | `--text-heading` |
| heading-lg | 56px | 1.1 | -0.84px | `--text-heading-lg` |
| display | 72px | 1.1 | -1.44px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 16px |
| icons | 2px |
| small | 8px |
| buttons | 50px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 24px 70px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 16-24px
- **Element gap:** 12-16px

## Components

### Hero Floating Card
**Role:** Primary hero content card

White surface (#ffffff), 16px border-radius, 24px padding all sides. The signature drop shadow: rgba(0,0,0,0.1) 0px 24px 70px 0px creates a soft float that lifts the card above the collage background. Headline at 56px figmaSans weight 320, ink black, letter-spacing -0.84px. No border, no outline — the shadow does the elevation work.

### Primary CTA Button
**Role:** Main action button

Electric Indigo (#4d49fc) fill, white text, figmaSans weight 480 at 16px. Fully rounded 50px radius (pill shape). Padding 10px 20px. One piece of saturated color in an otherwise monochrome interface — it must feel like the only 'switched-on' element on the page.

### Ghost Nav Button
**Role:** Secondary action / nav item

Transparent fill, 1px black border (#000000), ink black text, figmaSans weight 400 at 16px. 8px radius (subtle rounding, not pill). Padding 8px 18px. Sits beside the primary CTA as a quieter alternative path.

### Pill Nav Button
**Role:** Top-right 'Get started for free'

Black fill (#000000), white text, 50px pill radius, padding 8px 18px. Inverts the ghost button — solid black where the ghost is outlined. Used for the most important marketing CTA in the header.

### Top Navigation Bar
**Role:** Global navigation

White background, 64px tall, horizontal flex with logo left, primary nav center (Products, Solutions, Community, Resources, Pricing with dropdown carets), auth actions right. figmaSans weight 400 at 16px for nav items, 2px bottom margin on dropdown carets. No border, no shadow — sits flush on the white canvas.

### Figma Logo Mark
**Role:** Brand identifier

Four-color geometric logo: cyan (#00b6ff), green (#24cb71), orange (#ff7237), and the remaining shape in dark. Sits at top-left of nav at ~24px. The only place all four brand-marker colors appear together.

### Hero Collage Layer
**Role:** Decorative background composition

A 2D-scattered arrangement of full-color user design work (screenshots, posters, UI mockups) on the white canvas. Cards are slightly rotated, overlapping, with no uniform radius — the chaos is intentional. Serves as proof-of-capability rather than decoration. Scale: occupies ~60% of viewport width behind the floating card.

### Community Card Grid
**Role:** Gallery of community work

4-column grid (2 on smaller screens), 24px gaps. Each card: white surface, no border, no shadow in the grid, 16px radius. Thumbnail image fills the card top; title at 18px figmaSans weight 520 ink black below; creator name at 14px weight 400 graphite (#595959) with small avatar circle. The grid breathes — generous gaps, no card-to-card crowding.

### Product Feature Panel
**Role:** Product showcase block

Full-width white section containing a large product screenshot. Figma UI rendered with the app's own canvas toolbar (top bar with zoom controls, layer panel, share button). No card chrome around the screenshot — the product image IS the card. Caption text at 18px weight 400 ink black, max-width ~600px.

### Section Headline
**Role:** Major section title

figmaSans weight 320 at 56px, ink black, letter-spacing -0.84px, line-height 1.1. Left-aligned. No subtitle by default — the headline carries the section alone. The ultra-light weight is anti-convention; most sites use 600-700 here. Figma's whisper-weight creates authority through restraint.

### Decorative Ring
**Role:** Branded conic-gradient ring accent

Thin circular ring with conic-gradient fill — teal (#33dfdf) and mustard (#b98e01) sweep visible at 18° segments, fading to transparent. Used as a subtle brand mark in decorative contexts, never interactive. No border, no shadow, ~2px stroke.

## Do's and Don'ts

### Do
- Use Electric Indigo (#4d49fc) for exactly one CTA per viewport — repeating it dilutes its pull as the only saturated action color
- Set hero headlines at 56-72px figmaSans weight 320-340; the ultra-light weight is the signature, not a fallback
- Apply the 50px pill radius to all primary action buttons and tag chips — the 8px radius is reserved for ghost/outlined controls and inputs
- Use 16px radius for cards and 2px for fine UI elements (badges, dividers, icon containers) — the three-tier radius system (2/8/16/50) is the whole curvature language
- Pair black (#000000) text on white (#ffffff) for maximum contrast; introduce graphite (#595959) only for de-emphasized metadata
- Use figmaMono with positive tracking (+0.03em to +0.05em) for code snippets and technical annotations — never for body copy
- Let community galleries and product screenshots carry all decorative color; keep UI chrome strictly achromatic with indigo as the sole exception

### Don't
- Do not apply color fills to secondary buttons — ghost/outlined in black is the correct alternative to the indigo primary
- Do not use weights above 520 for body or heading text in user-facing content; reserve 700 for tight labels and nav items only
- Do not add drop shadows to cards in grid layouts — the single 24px 70px shadow is reserved for the floating hero card
- Do not use 50px radius on cards or inputs — the pill shape is button-exclusives only
- Do not introduce new chromatic colors to the UI palette; the four brand-marker colors live in the logo, the indigo lives in CTAs, pastels live in illustration only
- Do not set body text below 16px; the smallest readable step in the system is 16px (figmaMono 12px is annotation-only)
- Do not use letter-spacing values outside the -0.02em to +0.05em range; the custom kern-tuned tracking is the voice of the type system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background — the dominant surface, almost gallery-white |
| 2 | Card | `#ffffff` | Inset cards on the canvas (hero floating card, community cards) — visually identical to canvas, separated only by shadow or border |
| 3 | Soft Panel | `#e2e2e2` | Secondary panel backgrounds, muted surface for less-prominent blocks |

## Elevation

- **Hero Floating Card:** `rgba(0, 0, 0, 0.1) 0px 24px 70px 0px`

## Imagery

Figma's imagery strategy is: let users do the work. The hero is a 2D-scattered collage of real community-made designs — posters, app screens, editorial layouts, 3D renders — in full color and at full scale. These are not stock photos or staged lifestyle shots; they are the product output. The collage uses slight rotation, overlapping edges, and no uniform cropping to create a sense of creative chaos against the white canvas. Below the fold, product screenshots show the Figma app itself in use, rendered with its own UI chrome (toolbar, layers panel, share button). The community grid repeats this approach: 4-column gallery of real projects, thumbnails uncropped, each a small window into what the tool produces. No lifestyle photography, no people, no environmental context — the work IS the imagery.

## Layout

Max-width 1200px centered content within a fluid white canvas. The hero is full-viewport-width with a horizontally-scattered image collage behind a centered floating headline card — the card overlaps the collage at ~60% page width. Below the hero, sections alternate between generous whitespace bands (80-120px vertical padding) containing left-aligned display headlines and product screenshots. The community gallery is a clean 4-column grid with 24px gaps. Navigation is a flat 64px top bar — logo left, nav center, auth actions right — flush on the white canvas with no border or shadow. No sidebar, no mega-menu in the visible fold. The overall rhythm is: one dramatic collage, one quiet product showcase, one gallery grid — sparse, museum-paced, never dense.

## Agent Prompt Guide

Quick Color Reference:
- background: #ffffff
- text: #000000
- border: #000000
- muted text: #595959
- accent: #4d49fc
- primary action: #4d49fc (filled action)

Example Component Prompts:

1. Create a hero section with a centered floating card: white background (#ffffff), 16px radius, padding 24px all sides, shadow rgba(0,0,0,0.1) 0px 24px 70px 0px. Headline 'Make anything possible' at 56px figmaSans weight 320, #000000, letter-spacing -0.84px. Subtext at 18px weight 400, #595959. Behind the card, a collage of colorful design posters at slight rotations, uncropped, overlapping.

2. Create a primary action button: fill #4d49fc, text #ffffff, figmaSans weight 480 at 16px, 50px pill radius, padding 10px 20px. This is the only saturated fill in the entire UI.

3. Create a Primary Action Button: #4d49fc background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. Create a community card grid: 4 columns, 24px gap, white background, no shadow. Each card: 16px radius, thumbnail image filling the top, title at 18px weight 520 #000000 below, creator name at 14px weight 400 #595959 with a 24px circular avatar.

5. Create a section headline: figmaSans weight 320 at 56px, #000000, letter-spacing -0.84px, line-height 1.1, left-aligned, no subtitle. The ultra-light weight is the signature — do not bold it.

## Radius System

Figma uses a strict four-tier radius system: 2px for fine UI (badges, icon containers, dividers), 8px for ghost buttons and inputs, 16px for cards, and 50px (pill) for primary action buttons and tags. Never mix tiers — a card with 8px radius or a button with 16px radius breaks the visual grammar. The pill shape is reserved exclusively for action and chip elements.

## Color Discipline

The system is 0% colorful at the UI level. Black, white, and one indigo are the entire interface palette. Every other color in the raw token data is either: (1) a brand-marker color locked inside the Figma logo, (2) a decorative fill in the hero collage or community gallery — user-generated work shown at full saturation, or (3) a conic-gradient accent on branded ring illustrations. An AI agent must not introduce these decorative colors into UI components. The discipline is: the page is a white gallery, the work on the page is the color.

## Similar Brands

- **Linear** — Same ultra-light display weight headlines against a white canvas, same single accent-color discipline (Linear uses indigo, Figma uses electric indigo), same generous whitespace and pill-shaped primary controls
- **Notion** — Similar monochrome UI with black-and-white surfaces, left-aligned display headlines, and a single brand color for action — though Notion uses a warmer accent and softer radius
- **Vercel** — Both treat the marketing site as a gallery for the product: white canvas, minimal UI chrome, product screenshots as hero imagery, and a single bold accent for CTAs
- **Framer** — Both are design-tool brands that show user-generated work as the primary imagery, use scattered/overlapping collage layouts, and keep the UI strictly achromatic with one vivid accent
- **Stripe** — Same restraint in palette (near-monochrome with one accent), same generous breathing room, same left-aligned light-weight display headlines, same pill-radius primary buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-soft-mist: #e2e2e2;
  --color-graphite: #595959;
  --color-electric-indigo: #4d49fc;
  --color-figma-cyan: #00b6ff;
  --color-figma-green: #24cb71;
  --color-figma-orange: #ff7237;
  --color-lime-wash: #e4ff97;
  --color-lilac: #c4baff;
  --color-blush: #ffc9c1;
  --color-aqua-mist: #c7f8fb;
  --color-earworm-teal: #33dfdf;
  --color-mustard: #b98e01;

  /* Typography — Font Families */
  --font-figmasans: 'figmaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figmamono: 'figmaMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.48px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.11px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.18px;
  --text-heading: 24px;
  --leading-heading: 1.35;
  --tracking-heading: -0.24px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.84px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;

  /* Typography — Weights */
  --font-weight-w320: 320;
  --font-weight-w330: 330;
  --font-weight-w340: 340;
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-w480: 480;
  --font-weight-w520: 520;
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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 16-24px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 16px;
  --radius-icons: 2px;
  --radius-small: 8px;
  --radius-buttons: 50px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 24px 70px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-soft-panel: #e2e2e2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-soft-mist: #e2e2e2;
  --color-graphite: #595959;
  --color-electric-indigo: #4d49fc;
  --color-figma-cyan: #00b6ff;
  --color-figma-green: #24cb71;
  --color-figma-orange: #ff7237;
  --color-lime-wash: #e4ff97;
  --color-lilac: #c4baff;
  --color-blush: #ffc9c1;
  --color-aqua-mist: #c7f8fb;
  --color-earworm-teal: #33dfdf;
  --color-mustard: #b98e01;

  /* Typography */
  --font-figmasans: 'figmaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figmamono: 'figmaMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.48px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.11px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.18px;
  --text-heading: 24px;
  --leading-heading: 1.35;
  --tracking-heading: -0.24px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.84px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;

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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 24px 70px 0px;
}
```
