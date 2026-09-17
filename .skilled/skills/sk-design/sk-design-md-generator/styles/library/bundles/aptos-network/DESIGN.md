# Aptos Network — Style Reference
> Earth-toned code atelier — a sage-walled observatory where terracotta, sand, and powder-blue panels hold monospaced code beside serif prose, framed by 1px ink hairlines.

**Theme:** light

Aptos presents a warm, editorial take on blockchain infrastructure — full-bleed color sections in muted sage, khaki, sand, and powder blue replace the typical dark-and-neon crypto visual language. A single custom serif (Season Serif) with fractional weights from 335–444 carries the entire voice, from 120px display headlines to 9px captions, with negative tracking on display and positive tracking on micro type. Layout is split-composition: left-aligned text, right-side decorative geometry. Components are flat, borderless, and weightless — 1px hairlines drawn as inset shadows do the work of dividers, and pill-shaped buttons (9999px) are the only rounded form. The aesthetic reads like a terracotta-tinted monograph about distributed systems, not a dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#0f0e0b` | `--color-ink` | Primary text, hairline borders, icon strokes, nav outlines — the near-black that carries 90% of all foreground weight. Not pure black: a warm brown-black that feels printed, not screened |
| Bone | `#f9f9f0` | `--color-bone` | Page canvas, card surfaces, nav-pill fill, button text on dark — a warm off-white with the faintest yellow-green cast that matches the sage and sand sections without competing |
| Ash | `#6d6c67` | `--color-ash` | Secondary text, subtle borders, muted metadata — a mid neutral that sits between Ink and the page; used when primary text would be too heavy |
| Charcoal | `#21201c` | `--color-charcoal` | Filled CTA buttons, active markers — slightly warmer than Ink; the button fill that reads as a dense matte stamp rather than a flat black |
| Graphite | `#555450` | `--color-graphite` | Tertiary text, low-emphasis borders — for labels and helper text that should recede further than Ash |
| Mist | `#84837d` | `--color-mist` | Heading borders, de-emphasized dividers — the lightest neutral that still registers as a line on Bone |
| Deep Earth | `#3d3b34` | `--color-deep-earth` | Alternate surface for code-adjacent panels and inset blocks — a warm dark that bridges Ink and the mid neutrals |
| Soft Sand | `#ccc5a3` | `--color-soft-sand` | Secondary section background, 1px sand-colored hairline dividers, striped-pattern accent — the warm neutral that lives between the chromatic sections and true gray |
| Warm Stone | `#9d937c` | `--color-warm-stone` | Khaki section background, tonal counterpoint to Sage — the muted olive-khaki that fills body-text sections and grounds the palette's middle register |
| Sage | `#d5fad3` | `--color-sage` | Hero section background, signature accent — a desaturated mint that signals freshness without being loud; the only color bold enough to hold a 120px headline |
| Powder Blue | `#badbee` | `--color-powder-blue` | Code-panel background, striped-pattern accent, 1px blue hairlines — the cool counterweight to all the warm earth tones; appears wherever monospace code or technical data lives |

## Tokens — Typography

### Season Serif — Sole typeface — display, headings, body, nav, buttons, footer, code labels. Custom variable serif with fractional weights (no standard 300/400/700 scale) that allow whisper-light display at 335–340 and confident body at 420–444. · `--font-season-serif`
- **Substitute:** Source Serif 4 or Newsreader (both variable serifs with fine weight control)
- **Weights:** 335, 340, 358, 363, 400, 420, 444
- **Sizes:** 9px, 16px, 18px, 20px, 24px, 55px, 90px, 120px
- **Line height:** 0.95, 1.00, 1.10, 1.25, 1.30, 1.40, 1.50, 1.63
- **Letter spacing:** -0.030em at 120px (-3.6px), -0.030em at 90px (-2.7px), -0.020em at 55px (-1.1px), -0.010em at 24px (-0.24px), -0.010em at 20px (-0.2px), 0 at 18px and 16px, +0.010em at 9px (+0.09px)
- **OpenType features:** `"calt"`
- **Role:** Sole typeface — display, headings, body, nav, buttons, footer, code labels. Custom variable serif with fractional weights (no standard 300/400/700 scale) that allow whisper-light display at 335–340 and confident body at 420–444.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.3 | -0.2px | `--text-subheading` |
| heading | 24px | 1.25 | -0.24px | `--text-heading` |
| heading-lg | 55px | 1.1 | -1.1px | `--text-heading-lg` |
| display-sm | 90px | 1 | -2.7px | `--text-display-sm` |
| display | 120px | 1 | -3.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 90 | 90px | `--spacing-90` |
| 150 | 150px | `--spacing-150` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |
| nav-pill | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(15, 14, 11) -1px 0px 0px 0px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(204, 197, 163) -1px 0px 0px 0px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(186, 219, 238) -1px 0px 0px 0px inset` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 90-150px
- **Card padding:** 30px
- **Element gap:** 15-30px

## Components

### Floating Nav Pill
**Role:** Primary site navigation container

A centered, floating white pill containing logo, menu items, and CTA. Fill: Bone (#f9f9f0). Inset border: 1px Ink (#0f0e0b) via box-shadow inset -1px 0 0 0. Radius: 9999px. Horizontal padding: ~20px. Nav items in Season Serif weight 400 at 16px, Ink color, with chevron icons for dropdowns. Right-side CTA is a Charcoal (#21201c) filled pill with Bone text, 10px 20px padding, 9999px radius. The pill floats at the top of the viewport with ~30px top margin and 1px Ink bottom border.

### Filled Pill CTA
**Role:** Primary action button

Charcoal (#21201c) fill, Bone (#f9f9f0) text, Season Serif weight 420 at 16px, letter-spacing normal. Padding: 10px 20px. Radius: 9999px. No border, no shadow. Text is uppercase, tightly tracked. Used for all primary actions: GET STARTED, CTA triggers.

### Ghost Text Link
**Role:** Secondary inline action or nav item

No background, no border. Ink (#0f0e0b) text in Season Serif weight 400 at 16px, letter-spacing normal. Underline appears on hover only. 5px vertical padding. Used for nav items, inline links, and secondary actions.

### Full-Bleed Color Section
**Role:** Page section with solid muted-color background

Spans full viewport width, no max-width constraint. Background: Sage (#d5fad3), Warm Stone (#9d937c), Soft Sand (#ccc5a3), or Powder Blue (#badbee). No border, no shadow, no radius. Internal content is left-aligned text on the left half, decorative geometry on the right half. Vertical padding: 90–150px.

### Section Hairline Divider
**Role:** Horizontal divider between sections or within sections

1px line implemented as inset box-shadow: `inset 0 -1px 0 0 {color}`. Colors rotate: Ink (#0f0e0b), Soft Sand (#ccc5a3), Powder Blue (#badbee). No actual border property, no margin, full width of parent. Creates the impression of a printed line on paper.

### Display Headline
**Role:** Hero and section-opening title

Season Serif weight 335–340 at 90–120px, line-height 1.0, letter-spacing -0.030em (-2.7 to -3.6px). Color: Ink (#0f0e0b). Left-aligned. The whisper-weight display is the system's signature: most brands use 600–700 for 120px headlines; Aptos uses the lightest weight, creating authority through restraint. Two-line max.

### Body Copy Block
**Role:** Editorial prose section content

Season Serif weight 400 at 18px, line-height 1.4, letter-spacing 0. Color: Ink (#0f0e0b). Narrow column (~400px width), right-aligned within its half of the split layout. Sits below a section hairline divider. 30px row-gap between paragraphs.

### Code Panel
**Role:** Monospace code display

Background: Powder Blue (#badbee). Monospace text in Season Serif at 9–16px, weight 420. Dark text on light blue. Full-height panel on the right side of split sections. No padding frame — code bleeds to panel edges. 1px Ink inset border at panel edges.

### Striped Geometric Panel
**Role:** Decorative right-side pattern

Hard-edge striped pattern (not a smooth gradient): alternating 44px-wide vertical bands of two colors, distorted by a wave/curve mask. Color pairs: Ink + Powder Blue, Ink + Soft Sand. Implemented as linear-gradient with sharp color stops. 1px white or 1px color hairlines between bands. Occupies the right 40–50% of split sections.

### Nav Dropdown Item
**Role:** Submenu item within nav pill

Bone (#f9f9f0) text in Season Serif weight 400 at 16px, Ink on hover background. 5px vertical padding, 15px horizontal padding. No icon, no description text. Appears in a dropdown panel below the nav pill on click.

### Section Opening Label
**Role:** Small caption above headlines or between sections

Season Serif weight 420 at 9px, letter-spacing +0.010em (+0.09px). Ink color. All caps or sentence case. Used for eyebrow labels, category tags, and metadata. The 9px size with positive tracking creates a printed-caption feel.

## Do's and Don'ts

### Do
- Use Season Serif for all text — there is no secondary typeface. Weight 335–340 for display 55px+, weight 400–420 for body and UI, weight 420–444 for emphasis.
- Apply -0.030em letter-spacing to any type 90px or larger. Positive tracking (+0.01em) only at 9px caption size. Body text uses normal tracking.
- Use full-bleed color section backgrounds (Sage, Warm Stone, Soft Sand, Powder Blue) at 90–150px vertical padding. Never constrain sections to a max-width background.
- Draw all dividers as `inset 0 0 0 1px {color}` box-shadows, not as border properties. Rotate colors: Ink, Soft Sand, Powder Blue.
- Use 9999px radius for all buttons, nav container, and tags. Use 0px radius for all other surfaces (cards, code panels, inputs).
- Enable `font-feature-settings: "calt"` on all Season Serif text — contextual alternates are part of the brand voice.
- Split every section into left text / right decoration at roughly 55/45. Text left-aligns; decorative striped panel occupies the right.

### Don't
- Do not use any sans-serif typeface. Season Serif carries everything, including buttons, nav, and code labels.
- Do not use drop shadows. The system is flat by design — all line work is 1px inset.
- Do not use border-radius on cards, panels, code blocks, or images. Only buttons and the nav pill are rounded (9999px).
- Do not use bright or saturated colors. Every chromatic value is muted: sage, khaki, sand, powder blue. Saturation above 40% breaks the system.
- Do not use smooth gradients. The decorative right-side panels are hard-edge striped patterns implemented with sharp linear-gradient color stops.
- Do not use standard font weights (300, 400, 700). Season Serif uses fractional weights (335, 340, 420, 444) — pick from the available scale.
- Do not place text on both halves of a split section. The right side is always decorative (striped pattern or code panel), never text.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#f9f9f0` | Default page background between colored sections |
| 1 | Sage Field | `#d5fad3` | Hero section background — carries the largest display type |
| 2 | Warm Stone Field | `#9d937c` | Body-copy sections, editorial prose blocks |
| 3 | Soft Sand Field | `#ccc5a3` | Tonal break sections, striped-pattern panels |
| 4 | Powder Blue Field | `#badbee` | Code display panels, technical data surfaces |
| 5 | Charcoal Stamp | `#21201c` | Filled button surface, inverted modal background |

## Elevation

- **Nav Pill Border:** `inset 0 0 0 1px #0f0e0b`
- **Section Hairline (Warm):** `inset 0 0 0 1px #ccc5a3`
- **Section Hairline (Cool):** `inset 0 0 0 1px #badbee`

## Imagery

No photography. The visual language is entirely abstract: (1) Full-bleed muted color fields that act as atmosphere, not content. (2) Hard-edge striped geometric patterns on the right side of sections, distorted by wave/curve masks to create flowing vertical bands. (3) Monospace code blocks inside Powder Blue panels, showing actual Move/Rust syntax. (4) 1px hairline lines as printed-matter dividers. The aesthetic is editorial-graphic, not product-screenshot. Everything is flat, geometric, and color-blocked. No 3D renders, no illustrations, no product mockups, no lifestyle photography — the palette and typography ARE the imagery.

## Layout

Full-bleed page model with no outer container. Each section is a viewport-width color block. Internal layout is split-composition: text occupies the left ~55%, decorative geometry or code occupies the right ~45%. Text is left-aligned within its column; body prose sometimes right-aligns in a narrow sub-column. The nav is a floating centered pill, not a full-width bar — it detaches from the layout grid. Hero section uses a Sage background with a 120px headline left and a curved striped panel right. Subsequent sections alternate Warm Stone, Soft Sand, and Powder Blue backgrounds. Section gaps are generous (90–150px vertical padding). No card grids, no pricing tables, no feature matrices — content is prose-led, not grid-led. The page reads top-to-bottom as a sequence of colored editorial spreads.

## Striped Pattern System

The decorative right-side panels are not smooth gradients — they are hard-edge striped patterns. Each pattern is a linear-gradient with sharp color stops at 44px intervals, then masked by a wave/curve shape to create flowing vertical bands. Color pairs alternate: (Ink + Powder Blue) and (Ink + Soft Sand). The stripes are always 1px-separated by a hairline of the lighter color. Two pattern orientations exist: stripes flowing left-to-right (background) and stripes flowing right-to-left (foreground overlay), creating a layered weaving effect. This pattern system replaces stock photography, illustrations, and product imagery — it is the brand's sole visual decoration.

## Color Section Rotation

Sections rotate through four background colors in a deliberate sequence: Sage (#d5fad3) opens the page (hero), Warm Stone (#9d937c) carries body prose, Powder Blue (#badbee) frames code, and Soft Sand (#ccc5a3) provides tonal breaks. The rotation is not random — sage and powder blue are the cool accents, khaki and sand are the warm neutrals. A new screen should always start with either Sage (if it's a hero/opening) or Warm Stone (if it's a body section), then alternate to maintain the earthy-cool balance.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #0f0e0b
- Background (canvas): #f9f9f0
- Border (hairline): #0f0e0b
- Accent (hero/section): #d5fad3
- Accent (code panel): #badbee
- primary action: #21201c (filled action)

**3–5 Example Component Prompts**

1. *Create a hero section:* Sage (#d5fad3) full-bleed background, 150px vertical padding. Headline in Season Serif weight 335, 120px, #0f0e0b, letter-spacing -3.6px, line-height 1.0, left-aligned. A 10px×20px Charcoal (#21201c) filled pill button with Bone (#f9f9f0) text, weight 420, 16px, 9999px radius, positioned below the headline. Right side: a curved striped panel with alternating 44px bands of #0f0e0b and #badbee.

2. *Create a body-copy section:* Warm Stone (#9d937c) full-bleed background, 90px vertical padding. Top headline: Season Serif weight 340, 90px, #0f0e0b, letter-spacing -2.7px. Below a 1px Ink hairline divider (`box-shadow: inset 0 0 0 1px #0f0e0b`), a narrow ~400px right-aligned text column in Season Serif weight 400, 18px, #0f0e0b, line-height 1.4, 30px row-gap between paragraphs.

3. *Create a code-display section:* Soft Sand (#ccc5a3) left half, Powder Blue (#badbee) right half. Left: headline Season Serif weight 340, 55px, #0f0e0b, letter-spacing -1.1px. Right: monospace code in Season Serif weight 420, 14px, #0f0e0b on #badbee, 1px Ink inset border on the panel edges.

4. Create a Primary Action Button: #21201c background, #f9f9f0 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. *Create a section divider:* Full-width 1px line using `box-shadow: inset 0 -1px 0 0 #ccc5a3`. No actual border, no margin, no padding. Sits between two full-bleed color sections.

## Similar Brands

- **Linear** — Same editorial restraint — single typeface, muted color blocks, generous spacing, 1px hairline dividers instead of cards or shadows. Linear's purple accent is replaced here by sage, but the structural grammar (flat sections, whisper-weight display, zero decoration) is shared.
- **Stripe** — Same full-bleed color sections as content containers (not cards), same split-composition (text left, visual right), same generous vertical padding. Both treat color as atmosphere rather than as a button fill.
- **Vercel** — Same monochrome-first approach with one or two muted accent colors for section backgrounds. Both use 9999px pill buttons, 1px borders, and flat surfaces with no drop shadows. Vercel's Geist Sans is swapped for Season Serif here, but the component weight is identical.
- **Anthropic** — Same custom-serif-as-sole-typeface approach (Anthropic uses a custom serif, Aptos uses Season Serif), same earth-toned palette, same editorial pacing where color sections act as chapter breaks rather than as UI cards.
- **Loom** — Same split-section layout (prose left, visual right), same warm neutral backgrounds replacing the standard white/gray, same pill-shaped floating nav container. The decorative right panels here are geometric stripes where Loom uses product imagery, but the compositional rhythm is shared.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #0f0e0b;
  --color-bone: #f9f9f0;
  --color-ash: #6d6c67;
  --color-charcoal: #21201c;
  --color-graphite: #555450;
  --color-mist: #84837d;
  --color-deep-earth: #3d3b34;
  --color-soft-sand: #ccc5a3;
  --color-warm-stone: #9d937c;
  --color-sage: #d5fad3;
  --color-powder-blue: #badbee;

  /* Typography — Font Families */
  --font-season-serif: 'Season Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -0.24px;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.1px;
  --text-display-sm: 90px;
  --leading-display-sm: 1;
  --tracking-display-sm: -2.7px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-w335: 335;
  --font-weight-w340: 340;
  --font-weight-w358: 358;
  --font-weight-w363: 363;
  --font-weight-regular: 400;
  --font-weight-w420: 420;
  --font-weight-w444: 444;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-150: 150px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 90-150px;
  --card-padding: 30px;
  --element-gap: 15-30px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;
  --radius-nav-pill: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(15, 14, 11) -1px 0px 0px 0px inset;
  --shadow-subtle-2: rgb(204, 197, 163) -1px 0px 0px 0px inset;
  --shadow-subtle-3: rgb(186, 219, 238) -1px 0px 0px 0px inset;

  /* Surfaces */
  --surface-bone-canvas: #f9f9f0;
  --surface-sage-field: #d5fad3;
  --surface-warm-stone-field: #9d937c;
  --surface-soft-sand-field: #ccc5a3;
  --surface-powder-blue-field: #badbee;
  --surface-charcoal-stamp: #21201c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #0f0e0b;
  --color-bone: #f9f9f0;
  --color-ash: #6d6c67;
  --color-charcoal: #21201c;
  --color-graphite: #555450;
  --color-mist: #84837d;
  --color-deep-earth: #3d3b34;
  --color-soft-sand: #ccc5a3;
  --color-warm-stone: #9d937c;
  --color-sage: #d5fad3;
  --color-powder-blue: #badbee;

  /* Typography */
  --font-season-serif: 'Season Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -0.24px;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.1px;
  --text-display-sm: 90px;
  --leading-display-sm: 1;
  --tracking-display-sm: -2.7px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-150: 150px;
  --spacing-180: 180px;

  /* Shadows */
  --shadow-subtle: rgb(15, 14, 11) -1px 0px 0px 0px inset;
  --shadow-subtle-2: rgb(204, 197, 163) -1px 0px 0px 0px inset;
  --shadow-subtle-3: rgb(186, 219, 238) -1px 0px 0px 0px inset;
}
```
