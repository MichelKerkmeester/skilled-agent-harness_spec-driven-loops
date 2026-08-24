# Morflax — Style Reference
> Porcelain gallery, one blue spark — a near-black nav bar hovers above a white room that briefly blushes lavender, while every action and border stays in grayscale until a single cobalt button confirms the moment.

**Theme:** light

Morflax reads as a monochrome showroom with a single blue beacon: a near-black navigation bar floats above a porcelain-white canvas that is briefly washed in soft lavender at the hero, then returns to a crisp neutral white for every content section. Color is rationed — vivid blue (#298ef5) earns its presence on exactly one filled action, while everything else (borders, body text, surfaces) is graded grays from #e5e7eb hairlines through #171718 ink. The typography pairs Inter's clinical neutrality at 400/500/600 with a wide-tracked display treatment (0.05em) reserved for the brand wordmark, and the hero exploits oversized type that bleeds off-canvas. Components are quiet and rounded: pill buttons, 16–24px card radii, soft 25px-blur shadows — the only visual noise comes from the 3D-rendered product cards, which carry the chromatic energy the interface refuses to.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cobalt Spark | `#298ef5` | `--color-cobalt-spark` | Primary filled action, active states, brand accent — the sole chromatic voice in an otherwise monochrome system, so it must appear sparingly to retain its charge |
| Obsidian Bar | `#333333` | `--color-obsidian-bar` | Navigation background — dark anchor that frames the light canvas below |
| Ink | `#171718` | `--color-ink` | Primary headings and body text — near-black with a barely-warm cast that softens against pure #000 |
| Carbon | `#25282b` | `--color-carbon` | Icon strokes, secondary text, UI graphics — a touch cooler than Ink for icon differentiation |
| Smoke | `#7c7e83` | `--color-smoke` | Muted helper text, secondary nav, inactive labels |
| Ash | `#a3a7ad` | `--color-ash` | Tertiary icon fills, disabled-state text, low-priority metadata |
| Frost | `#e5e7eb` | `--color-frost` | Hairline borders, card outlines, divider lines — the structural backbone of the grayscale system |
| Bone | `#f5f5f7` | `--color-bone` | Card surfaces, section backgrounds, subtle elevation — the off-white between pure white and Frost |
| Porcelain | `#ffffff` | `--color-porcelain` | Page canvas, button fills, card base — the default surface everything sits on |
| Shadow Veil | `#bfbfbf` | `--color-shadow-veil` | Soft shadow tint used in card and button drop-shadows to imply elevation without color |
| Lavender Wash | `radial-gradient(64.38% 210.53% at 35.62% 50%, #dfe1f0 0%, #aeb1cc 100%)` | `--color-lavender-wash` | Hero background atmospheric tint — a radial gradient that briefly warms the monochrome with a cool violet glow |

## Tokens — Typography

### Inter — All interface text — nav, buttons, body, subheads, and most headings; the 600 weight is reserved for emphasis, never used decoratively, and the tight -0.025em tracking on 48–72px display sizes is what makes headlines feel engineered rather than typed · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 20, 24, 36, 48, 60, 72
- **Line height:** 1.00, 1.11, 1.33, 1.40, 1.43, 1.50, 1.56
- **Letter spacing:** -0.025em at 48–72px, -0.01em at 24–36px, 0 at body sizes
- **Role:** All interface text — nav, buttons, body, subheads, and most headings; the 600 weight is reserved for emphasis, never used decoratively, and the tight -0.025em tracking on 48–72px display sizes is what makes headlines feel engineered rather than typed

### Rogan — Wide-tracked label/eyebrow text — its defining move is the 0.05em positive tracking at modest sizes, which forces the type to read as caption-or-category rather than heading; appears as uppercase or small-caps markers above content blocks · `--font-rogan`
- **Substitute:** Inter with text-transform: uppercase and letter-spacing: 0.05em
- **Weights:** 500
- **Sizes:** 16, 24
- **Line height:** 1.33, 1.50
- **Letter spacing:** 0.05em
- **Role:** Wide-tracked label/eyebrow text — its defining move is the 0.05em positive tracking at modest sizes, which forces the type to read as caption-or-category rather than heading; appears as uppercase or small-caps markers above content blocks

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.6px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.24px | `--text-heading-sm` |
| heading | 36px | 1.11 | -0.36px | `--text-heading` |
| heading-lg | 48px | 1.11 | -1.2px | `--text-heading-lg` |
| display | 72px | 1 | -1.8px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 12px |
| cards | 24px |
| buttons | 9999px |
| smallCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Top Navigation Bar
**Role:** Persistent dark header — frames the light content below and carries the brand logo, primary links, and account actions

Full-width bar at 333333 background, 64–72px tall, with white Inter 14–16px nav links (weight 500), spaced at 24px gaps. Right side holds ghost text links ('Pro Access', 'Sign in') and a white pill CTA ('Open Studio') with 9999px radius, 1px Frost border, and Inter 14px weight 500. No drop shadow — sits flush with the lavender hero below.

### Hero Section with Oversized Wordmark
**Role:** Opening brand statement — establishes identity through scale, not color

Lavender radial-gradient background (centered at ~35% horizontal, 50% vertical, fading from #dfe1f0 to #aeb1cc). An oversized display wordmark in white, Inter 72–120px weight 600, letter-spacing -0.025em, bleeds off the right and left edges of the viewport. Subtext in white Inter 18px weight 400, max-width 480px, sits below the wordmark at 24px gap.

### Primary Filled Button
**Role:** Sole high-emphasis action — the only place Cobalt Spark appears as a fill

Background #298ef5, text #ffffff, Inter 14–16px weight 500, padding 12px 24px, border-radius 9999px (full pill). No border. Soft two-layer shadow: 0px 10px 15px -3px rgba(0,0,0,0.1) and 0px 4px 6px -4px rgba(0,0,0,0.1). Use sparingly — when more than one appears on a page, the brand charge is diluted.

### Ghost Outlined Button
**Role:** Secondary action paired with a primary — the neutral companion to the blue spark

Transparent background, 1px solid border in #ffffff (on dark/hero) or #e5e7eb (on light sections), text in matching tone, Inter 14–16px weight 500, padding 12px 24px, border-radius 9999px. No shadow. Always renders beside or near a Primary Filled Button.

### Section Heading with Carousel Controls
**Role:** Marks the start of a scrollable content block and exposes navigation

Left-aligned H2 in Inter 36px weight 600, #171718, letter-spacing -0.36px. Right side carries a text link ('Explore more' at 14px weight 500, #171718) and a pair of circular carousel arrows (40px circles, 1px Frost border, Frost icon glyph, 4px gap between them). Vertical section gap of 40px above, 24px below.

### Featured Tool Card
**Role:** Showcases a product or tool with a full-bleed visual identity

Aspect ratio roughly 1:1.2, border-radius 24px, no visible border. The card is dominated by a 3D-rendered visual that fills 100% of the card area (coral, violet, peach, or device imagery). A label row sits overlaid at the top: a small monochrome icon (16px, Frost or #ffffff) + Inter 14px weight 500 label text. Heavy drop shadow: 0px 25px 50px -12px rgba(0,0,0,0.25) to lift the card off the canvas.

### Carousel Arrow Button
**Role:** Navigation control inside section headers and card carousels

40px diameter circle, #ffffff fill, 1px solid #e5e7eb border, centered chevron icon (stroke #25282b, 1.5px). No shadow. Arranged in pairs with 4px horizontal gap; on mobile, swiping replaces the arrows.

### Display Statement Block
**Role:** Centered editorial interlude between product sections — voice of the brand

White canvas section, max-width 800px centered. Headline in Inter 36px weight 600, #171718, letter-spacing -0.36px, line-height 1.11, centered. No subtext, no button, no imagery — relies entirely on typographic weight to carry the page.

### Eyebrow Label
**Role:** Tiny wide-tracked category marker above content blocks

Inter 12px or rogan 16px weight 500, letter-spacing 0.05em (≈ 0.6–0.8px), text-transform uppercase, color #7c7e83. Sits 8–12px above the heading it qualifies.

### Ghost Nav Link
**Role:** Inline action in the top bar — 'Pro Access' and 'Sign in'

Inter 14px weight 500, #ffffff, no background, no border, no underline by default. 24px horizontal padding. Hover state shifts to #f5f5f7 or adds a Frost underline.

### Body Text
**Role:** Default paragraph and description copy

Inter 16px weight 400, #171718, line-height 1.5, max-width 65ch for readability. Secondary copy (descriptions, metadata) uses #7c7e83 at the same size.

### Hero CTA Pair
**Role:** The two-button unit at the bottom of the hero — one ghost, one filled or ghost

Two pill buttons at 16px horizontal gap. Ghost Outlined Button on the left ('Explore Ecosystem', white border on lavender) and a second Ghost Outlined Button on the right ('Open Studio ↗', white border with external-link arrow glyph). Both 9999px radius, 12px 24px padding, white text.

## Do's and Don'ts

### Do
- Use #298ef5 for exactly one filled action per viewport — its scarcity is what makes it feel switched on
- Apply 24px radius to all large feature cards and 16px to smaller image cards; never square corners on cards
- Set every button to 9999px radius — the pill shape is a system signature, not a style choice
- Reserve Inter weight 600 for headings and active emphasis; body copy stays at 400 or 500
- Track display sizes (48–72px) at -0.025em and body sizes at 0 — the negative tracking on large type is what makes headlines feel engineered
- Use the Lavender Wash gradient only on the hero — every other section stays on pure white or Bone
- Apply 0px 25px 50px -12px rgba(0,0,0,0.25) to all card-level surfaces, never to inline elements

### Don't
- Do not introduce additional chromatic accents — the system is monochrome plus one blue, and a second hue breaks the ratio
- Do not use 0px border-radius anywhere — the system is built on rounded geometry, not flat panels
- Do not set body text below 14px or above 18px — the scale jumps 14→16→20 to preserve readability rhythm
- Do not place color on body text — text colors are restricted to Ink (#171718), Carbon (#25282b), Smoke (#7c7e83), and Ash (#a3a7ad)
- Do not use the Cobalt Spark as a background for cards, sections, or large surfaces — it is a button and accent only
- Do not mix #000000 and #171718 — pick Ink (#171718) for text and use pure black only for photographic or illustration contexts
- Do not add drop shadows to nav bars, body text, or inline links — shadows are reserved for cards and filled buttons

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Porcelain | `#ffffff` | Page canvas, default content background |
| 1 | Bone | `#f5f5f7` | Card surface, subtle elevation above canvas |
| 2 | Frost | `#e5e7eb` | Hairline border layer, thin dividers |
| 3 | Obsidian Bar | `#333333` | Navigation bar — dark inversion of the light canvas |
| 4 | Lavender Wash | `#b1b3cc` | Hero atmospheric background — temporary chromatic departure |

## Elevation

- **Featured Tool Card:** `0px 25px 50px -12px rgba(0, 0, 0, 0.25)`
- **Primary Button:** `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)`

## Imagery

Imagery is split between two distinct registers. The hero uses a single large photographic plate — a soft, high-key portrait of a person interacting with a device, lit to blend into the lavender wash behind it. Below the fold, all visual energy is carried by 3D-rendered product cards: organic, sculptural forms in coral, violet, peach, and metallic silver-gray, with iridescent and gradient-shaded surfaces. These renders are not decorative — they ARE the card content, filling the full card area with no surrounding border or padding. Icons are minimal: simple 16px monochrome line glyphs in the card labels and nav, stroked at ~1.5px in #25282b or #ffffff. The system does not use stock photography, lifestyle imagery, or illustration elsewhere — the 3D product shots are the sole source of color and visual richness on the page.

## Layout

The page is a max-width contained layout (≈1200px content column, centered) sitting on a full-bleed white canvas. The hero breaks this containment deliberately — the oversized MORFLAX wordmark bleeds past both viewport edges, and the lavender background extends full-bleed behind it. Below the hero, the layout snaps to a strict vertical rhythm: each section is a centered max-width band with 80px vertical gaps, alternating between white (#ffffff) and barely-off-white (#f5f5f7) surfaces. Content arrangement is primarily a horizontal card carousel (the Featured Tools row) and centered stacked text blocks (the editorial statement). Card grids do not exist — every product row scrolls horizontally rather than wrapping into columns, which keeps the visual line horizontal and prevents the page from feeling like a catalog. Navigation is a single dark bar fixed to the top, never repeating or duplicating into a sidebar or mega-menu.

## Agent Prompt Guide

Quick Color Reference:
- text: #171718 (headings, body)
- background: #ffffff (canvas), #f5f5f7 (card surface)
- border: #e5e7eb (hairlines, card outlines)
- accent: #298ef5 (Cobalt Spark — filled action only)
- nav background: #333333 (dark bar)
- primary action: #298ef5 (filled action)

Example Component Prompts:
1. **Hero section**: Full-bleed background using radial-gradient(64.38% 210.53% at 35.62% 50%, #dfe1f0 0%, #aeb1cc 100%). Center an oversized Inter 72px weight 600 wordmark in #ffffff, letter-spacing -1.8px, bleeding off the left and right viewport edges. Below, Inter 18px weight 400 subtext in white, max-width 480px. Two pill buttons (9999px radius, 12px 24px padding) at 16px gap: first ghost with 1px white border, second ghost with 1px white border and external-link arrow.

2. **Featured Tool Card**: 1:1.2 aspect ratio, border-radius 24px, no border, no internal padding. Top-left overlay: 16px monochrome icon + Inter 14px weight 500 label text, both in #ffffff. The card interior is entirely filled by a 3D-rendered visual (coral, violet, or peach organic form). Apply shadow 0px 25px 50px -12px rgba(0,0,0,0.25).

3. **Section Header with Carousel**: Left-aligned Inter 36px weight 600 heading in #171718, letter-spacing -0.36px. Right side: Inter 14px weight 500 'Explore more' link in #171718, then two 40px circular arrow buttons (white fill, 1px #e5e7eb border, Frost chevron icon) at 4px gap.

4. **Primary Filled Button**: Background #298ef5, text #ffffff, Inter 14px weight 500, padding 12px 24px, border-radius 9999px, no border. Shadow: 0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1).

5. **Editorial Statement Block**: White background section, max-width 800px centered. Inter 36px weight 600 headline in #171718, letter-spacing -0.36px, line-height 1.11, centered. No imagery, no button — typography only.

## Color Discipline

The system is governed by a 1-cobalt-to-N-grayscale ratio. Cobalt Spark (#298ef5) may appear as a fill on exactly one primary action per viewport. All other interactive elements use neutral surfaces (white, Bone, Frost borders) with text in Ink or Carbon. The Lavender Wash is a hero-only atmospheric color and must not appear in content sections. Violating this ratio — for example, using #298ef5 as a link color, a badge background, or a section header — collapses the entire visual hierarchy into a flat blue field.

## Radius System

Three radius tiers, applied by component size, not by component type. Cards at 24px are the default; smaller cards and tight image tiles drop to 16px. Tags and chips use 12px. Buttons, pills, and circular controls use 9999px. Never use 0px, 4px, or 8px — the system has no sharp or slightly-rounded geometry.

## Similar Brands

- **Linear** — Same pill-shaped buttons, single accent color against dark nav + light canvas split, and weight-600 Inter display headlines with tight negative tracking
- **Vercel** — Monochrome palette with a single vivid blue accent on primary actions, oversized display type, and horizontal card carousels over centered editorial statements
- **Framer** — Dark top navigation bar, porcelain-white content canvas, and the same restraint of letting 3D-rendered product visuals carry the only color on the page
- **Pitch** — Quiet monochrome UI that relies on tight typographic hierarchy and pill buttons, with chromatic energy delegated to product imagery rather than UI chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cobalt-spark: #298ef5;
  --color-obsidian-bar: #333333;
  --color-ink: #171718;
  --color-carbon: #25282b;
  --color-smoke: #7c7e83;
  --color-ash: #a3a7ad;
  --color-frost: #e5e7eb;
  --color-bone: #f5f5f7;
  --color-porcelain: #ffffff;
  --color-shadow-veil: #bfbfbf;
  --color-lavender-wash: #b1b3cc;
  --gradient-lavender-wash: radial-gradient(64.38% 210.53% at 35.62% 50%, #dfe1f0 0%, #aeb1cc 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rogan: 'Rogan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: -0.36px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 12px;
  --radius-cards: 24px;
  --radius-buttons: 9999px;
  --radius-smallcards: 16px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-porcelain: #ffffff;
  --surface-bone: #f5f5f7;
  --surface-frost: #e5e7eb;
  --surface-obsidian-bar: #333333;
  --surface-lavender-wash: #b1b3cc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cobalt-spark: #298ef5;
  --color-obsidian-bar: #333333;
  --color-ink: #171718;
  --color-carbon: #25282b;
  --color-smoke: #7c7e83;
  --color-ash: #a3a7ad;
  --color-frost: #e5e7eb;
  --color-bone: #f5f5f7;
  --color-porcelain: #ffffff;
  --color-shadow-veil: #bfbfbf;
  --color-lavender-wash: #b1b3cc;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rogan: 'Rogan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: -0.36px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

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
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
