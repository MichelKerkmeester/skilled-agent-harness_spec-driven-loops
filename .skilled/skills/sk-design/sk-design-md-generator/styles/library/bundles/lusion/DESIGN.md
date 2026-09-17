# Lusion — Style Reference
> 3D sculpture gallery on a frosted lavender plane. Every interface element should feel like a tactile object resting on a pale, slightly cool gallery floor, with the 3D content doing all the chromatic and dramatic work.

**Theme:** light

Lusion treats its website as a digital sculpture gallery rather than a typical agency portfolio. The entire chrome sits on a cold lavender-tinted off-white (#f0f1fa) that makes pure black Aeonik text feel etched into the canvas, while the 3D renders — vivid electric indigo crosses, polished metal, glass cylinders — supply every drop of chromatic energy. Pill-shaped components at 87–100px radius make the UI feel like physical objects placed on a gallery floor, never card stacks. Shadows are reduced to a 4% whisper; depth and drama come from the 3D content itself, not from UI elevation. Whitespace is generous, navigation is reduced to bare essentials, and the few text links are pure black with the same tight -0.02em tracking as body copy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lavender Mist | `#f0f1fa` | `--color-lavender-mist` | Page canvas — the dominant background, a cool off-white with a barely-perceptible lavender cast that makes pure black text feel sharper than it would on pure white |
| Paper White | `#ffffff` | `--color-paper-white` | Elevated card and surface backgrounds, button text on dark fills, inverted surfaces |
| Ink | `#000000` | `--color-ink` | Primary text, all headings, body copy, icons, and link text — pure black with no softening |
| Graphite | `#2b2e3a` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Haze | `#e4e6ef` | `--color-haze` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Slate Hollow | `#34393f` | `--color-slate-hollow` | Deep surface layer for dark bands or modal overlays, darker than graphite for clear hierarchy separation |
| Electric Indigo | `#1a2ffb` | `--color-electric-indigo` | Chromatic brand accent — appears as icon stroke, inline highlight marks, and as the signature color inside the 3D hero render. The single source of energy against the otherwise achromatic UI |
| Acid Lime | `#c1ff00` | `--color-acid-lime` | Highlight wash for emphasis zones, secondary accent inside 3D compositions — used sparingly as a surprise contrast |

## Tokens — Typography

### Aeonik — Used for every text element on the site — navigation, body, headings, buttons, inputs. The deliberate weight ceiling at 500 (no bold) and uniformly tight -0.02em tracking create a uniform geometric confidence. Display sizes compress line-height to 0.90, letting the largest headlines (108–144px) feel sculpted rather than set. The 400 weight is the workhorse; 500 is reserved for navigation, labels, and button text where a slight emphasis is needed. · `--font-aeonik`
- **Substitute:** Inter, Satoshi, General Sans, or DM Sans
- **Weights:** 400, 500
- **Sizes:** 12, 13, 14, 16, 18, 20, 22, 26, 36, 38, 43, 49, 50, 108, 115, 144
- **Line height:** 0.90, 1.00, 1.10, 1.15, 1.20, 1.40, 1.50
- **Letter spacing:** -0.02em applied uniformly across all sizes
- **Role:** Used for every text element on the site — navigation, body, headings, buttons, inputs. The deliberate weight ceiling at 500 (no bold) and uniformly tight -0.02em tracking create a uniform geometric confidence. Display sizes compress line-height to 0.90, letting the largest headlines (108–144px) feel sculpted rather than set. The 400 weight is the workhorse; 500 is reserved for navigation, labels, and button text where a slight emphasis is needed.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.28px | `--text-body-sm` |
| body | 16px | 1.4 | -0.32px | `--text-body` |
| subheading | 20px | 1.2 | -0.4px | `--text-subheading` |
| heading-sm | 26px | 1.2 | -0.52px | `--text-heading-sm` |
| heading | 38px | 1.15 | -0.76px | `--text-heading` |
| heading-lg | 50px | 1.1 | -1px | `--text-heading-lg` |
| display | 144px | 0.9 | -2.88px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 168 | 168px | `--spacing-168` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 15px |
| inputs | 18px |
| buttons | 87.5px |
| smallDetails | 3px |
| imageContainers | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.04) 0px 6px 10px 0px, rgba(0, 0, 0, 0.04)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 72px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Pill Action Button
**Role:** Primary call-to-action (e.g. 'LET'S TALK')

Filled dark pill at #2b2e3a background, white text in Aeonik 14px weight 500, -0.02em tracking, uppercase. Radius 87.5px (full pill). Padding 14px 24px. No border, no shadow. A small 1px white dash or plus icon sits to the left of the label as a decorative tick mark.

### Ghost Navigation Link
**Role:** Header menu items and inline links

Pure black text (#000000) in Aeonik 14–16px weight 500, uppercase, -0.02em tracking. No underline, no background. Hover state increases opacity or adds a subtle underline. Sits directly on the Lavender Mist canvas.

### Menu Toggle Button
**Role:** Header right-side menu trigger

Text label 'MENU' in Aeonik 14px weight 500, black, followed by a small horizontal dash/plus icon. No background or border. Identical visual weight to the pill button label but without the dark fill — it relies on proximity and the canvas for separation.

### Hero Image Container
**Role:** Large 3D artwork display

Full-width container with 100px border-radius (the signature soft-rectangle shape). No padding inside — the 3D render bleeds to the edges. Sits directly on the Lavender Mist canvas with no shadow; the contrast between the dark 3D scene and the pale canvas is the only visual separation.

### Card Surface
**Role:** Content cards, secondary information blocks

White (#ffffff) background, 15px border-radius, 24px padding, no shadow. Optional 1px border in #e4e6ef for definition against the canvas. Typography inside uses black on white at Aeonik 16px weight 400.

### Scroll Indicator
**Role:** Bottom-of-viewport prompt

Centered 'SCROLL TO EXPLORE' label in Aeonik 12–14px weight 500, black, uppercase, with flanking plus signs (+) as decorative ticks. No background, sits in the margin between hero and content sections.

### Input Field
**Role:** Form inputs in contact or newsletter areas

White or Lavender Mist background, 18px border-radius, 1px border in #e4e6ef, Aeonik 16px weight 400 placeholder text in a muted gray. Focus state replaces border with Electric Indigo (#1a2ffb). Padding 14px 18px.

### Header Bar
**Role:** Site-wide navigation

Transparent, sits directly on the Lavender Mist canvas with 24–32px vertical padding. Logo (Aeonik wordmark) left-aligned, a short descriptive headline centered, and action + menu controls right-aligned. No background fill, no border, no shadow — the header is typographic, not architectural.

### Section Divider Tick
**Role:** Visual rhythm element between sections

Small plus-sign (+) marks in black, scattered as decorative punctuation along section edges. Aeonik 16px, no background, used as a signature visual signature rather than functional UI.

## Do's and Don'ts

### Do
- Use Lavender Mist (#f0f1fa) as the canvas for every full-page background; never use pure white as the page base — the slight lavender cast is the brand
- Set all text to pure black (#000000) with Aeonik at weight 400–500 and tracking -0.02em; never introduce a bold weight or a softer gray for emphasis
- Use the 87.5px pill radius for all action buttons and the 100px radius for all image/hero containers; these two radii are the signature shape language
- Reach for Electric Indigo (#1a2ffb) only as a chromatic punctuation — icon stroke, inline highlight, focus ring on inputs — never as a large filled surface
- Keep shadows at the single 4% black whisper stack (0px 6px 10px + 0px 2px 4px); do not stack multiple elevations or introduce colored shadows
- Space sections at 72px vertical rhythm; let the generous breathing room and 3D content do the work rather than adding dividers or borders
- Use Aeonik at the full size range from 12px caption through 144px display; let the type scale itself create hierarchy rather than color or weight variation

### Don't
- Don't introduce a third type weight above 500 — bold or black weights break the restrained typographic system
- Don't use white (#ffffff) as the page background; the Lavender Mist canvas is what makes black text and 3D content feel cut and crisp
- Don't fill large UI surfaces with Electric Indigo; it is an accent, not a brand wash — large indigo blocks destroy the gallery-floor metaphor
- Don't add decorative gradients, glassmorphism, or blur effects; surfaces are flat and physical
- Don't use 8px, 12px, or 20px border-radii on cards, buttons, or containers — stick to the defined 3px, 15px, 18px, 87.5px, and 100px values
- Don't add hover states that change background fill or introduce color; rely on opacity shifts and underline reveals against the static canvas
- Don't use the Acid Lime (#c1ff00) as a CTA or text background; it lacks the contrast hierarchy needed for interactive elements and belongs only inside 3D compositions or highlight washes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Lavender Canvas | `#f0f1fa` | Default page background, dominant surface |
| 1 | Paper Surface | `#ffffff` | Elevated cards and content blocks |
| 2 | Haze Edge | `#e4e6ef` | Borders, dividers, disabled states |
| 3 | Graphite Plate | `#2b2e3a` | Dark UI elements, button fills |
| 4 | Slate Hollow | `#34393f` | Darkest surface layer for inverted sections or overlays |

## Elevation

- **Pill Action Button:** `rgba(0, 0, 0, 0.04) 0px 6px 10px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px`
- **Card Surface:** `rgba(0, 0, 0, 0.04) 0px 6px 10px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px`

## Imagery

The site is image-driven through full-bleed 3D renders — metallic, glass, and matte plastic objects (cross shapes, cylinders, spheres) rendered in Electric Indigo, black, and white. These renders occupy the entire viewport inside 100px-radius containers, floating on the Lavender Mist canvas with no padding or frame. No photography, no illustration, no icons in the traditional sense — the 3D content IS the visual system. Iconography is minimal: small plus signs, dashes, and arrows in pure black or Electric Indigo, used as decorative ticks and scroll prompts. The 3D work carries all the chromatic and dramatic weight, leaving the UI chrome achromatic and quiet.

## Layout

Full-bleed canvas with a max content width of approximately 1400px centered. The header is a thin transparent bar with the wordmark left, a short descriptive line center, and action/menu controls right — no sticky behavior, no background fill. The hero pattern is a centered short headline (3 lines max) followed by a massive rounded-corner 3D render container that fills the viewport width. Section rhythm is consistent vertical spacing at 72px with no dividers or background alternation — the entire page sits on the same Lavender Mist canvas, so visual separation comes from 3D content and generous whitespace rather than from colored bands. Content arrangement is centered stacks for text and full-bleed for imagery; no asymmetric two-column layouts or z-patterns. The overall density is spacious and gallery-like, with each 3D render given room to breathe as a standalone object.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (pure black, all sizes and weights)
- background (canvas): #f0f1fa (Lavender Mist)
- surface (cards): #ffffff (white)
- border: #e4e6ef (Haze)
- accent: #1a2ffb (Electric Indigo, for icons and focus rings only)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero section: Lavender Mist (#f0f1fa) canvas. Centered headline in Aeonik 50px weight 500, #000000, letter-spacing -1.0px, line-height 1.10, 3 lines max. Below, a full-width 3D render container at 100px border-radius, bleeding edge-to-edge, no padding, no border, no shadow. Centered below the container, a 'SCROLL TO EXPLORE' label in Aeonik 12px weight 500, #000000, uppercase, flanked by plus signs.

2. Create a header navigation bar: Transparent on Lavender Mist (#f0f1fa), 24px vertical padding. Left: 'LUSION' wordmark in Aeonik 16px weight 500, #000000. Center: short descriptive line in Aeonik 16px weight 400, #000000. Right: a pill button (background #2b2e3a, text #ffffff, Aeonik 14px weight 500, uppercase, padding 14px 24px, radius 87.5px) with a small white dash icon to the left of the label, followed by a 'MENU' text trigger in Aeonik 14px weight 500, #000000, with a dash icon.

3. Create a card grid: White (#ffffff) cards at 15px border-radius, 24px padding, optional 1px border in #e4e6ef. Title in Aeonik 22px weight 500, #000000. Body in Aeonik 16px weight 400, #000000. No drop shadow on the card itself; rely on the white-on-lavender contrast for separation. Space cards with 24–32px gap in a 3-column grid, max-width 1200px centered on the Lavender Mist canvas.

4. Create an input field: Background #ffffff, border 1px solid #e4e6ef, 18px border-radius, padding 14px 18px. Placeholder text in Aeonik 16px weight 400 in a muted gray. Focus state: border switches to Electric Indigo (#1a2ffb), no other change — no glow, no shadow, no background shift.

5. Create a section divider: On the Lavender Mist canvas, place a centered horizontal row of three small plus signs (+) in #000000, Aeonik 16px, spaced 16px apart, serving as a decorative tick separator between content blocks. No lines, no background change.

## Similar Brands

- **Active Theory** — Both are 3D/webGL agency sites that use full-bleed rendered scenes as the primary visual, with a minimal achromatic UI frame and a single chromatic accent inside the 3D content
- **Resn** — Same spacious-gallery layout philosophy, dark 3D artwork against pale canvas, and restrained UI chrome that defers all drama to the rendered content
- **Locomotive** — Shares the pill-shaped button language, generous whitespace, and an almost-typographic navigation approach with nearly no border or shadow on the interface
- **Basement Studio** — Both use vivid single-hue accents (indigo/blue) inside 3D compositions while keeping the surrounding UI strictly achromatic and gallery-like
- **Gunner** — Similar dark 3D renders inside soft-cornered containers, with flat chrome and a focus on letting the artwork dominate while UI stays quiet

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lavender-mist: #f0f1fa;
  --color-paper-white: #ffffff;
  --color-ink: #000000;
  --color-graphite: #2b2e3a;
  --color-haze: #e4e6ef;
  --color-slate-hollow: #34393f;
  --color-electric-indigo: #1a2ffb;
  --color-acid-lime: #c1ff00;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.52px;
  --text-heading: 38px;
  --leading-heading: 1.15;
  --tracking-heading: -0.76px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1px;
  --text-display: 144px;
  --leading-display: 0.9;
  --tracking-display: -2.88px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-168: 168px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 72px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-xl: 15px;
  --radius-2xl: 18px;
  --radius-full: 76.5px;
  --radius-full-2: 87.5px;
  --radius-full-3: 100px;

  /* Named Radii */
  --radius-cards: 15px;
  --radius-inputs: 18px;
  --radius-buttons: 87.5px;
  --radius-smalldetails: 3px;
  --radius-imagecontainers: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 0px 6px 10px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-lavender-canvas: #f0f1fa;
  --surface-paper-surface: #ffffff;
  --surface-haze-edge: #e4e6ef;
  --surface-graphite-plate: #2b2e3a;
  --surface-slate-hollow: #34393f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lavender-mist: #f0f1fa;
  --color-paper-white: #ffffff;
  --color-ink: #000000;
  --color-graphite: #2b2e3a;
  --color-haze: #e4e6ef;
  --color-slate-hollow: #34393f;
  --color-electric-indigo: #1a2ffb;
  --color-acid-lime: #c1ff00;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.52px;
  --text-heading: 38px;
  --leading-heading: 1.15;
  --tracking-heading: -0.76px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1px;
  --text-display: 144px;
  --leading-display: 0.9;
  --tracking-display: -2.88px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-168: 168px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-xl: 15px;
  --radius-2xl: 18px;
  --radius-full: 76.5px;
  --radius-full-2: 87.5px;
  --radius-full-3: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 0px 6px 10px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px;
}
```
