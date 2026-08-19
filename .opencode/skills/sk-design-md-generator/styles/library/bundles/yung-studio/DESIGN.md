# Yung Studio — Style Reference
> white chalk drawing on a black gallery wall

**Theme:** dark

Yung Studio operates in absolute monochrome: a pure black void against which white type and white illustration do all the work. The visual language is gallery-like — sparse, confident, and editorial — with a single violet (#c692ff) reserved as a whisper-quiet accent that only surfaces in hover or selection states. Typography carries the entire brand voice through the PolySans optical-size family: Slim whispers in body text, Neutral fills mid-scale sections, and Bulky anchors the hero as oversized display. Layout breathes aggressively; sections are separated by 100+ pixel gaps and framed by generous horizontal padding, giving every element room to perform. The aesthetic is closer to a zine or art-book cover than a SaaS dashboard — flat, bold, typographically expressive, and unafraid of negative space.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, full-bleed backgrounds, surface for all primary content |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Ultraviolet | `#c692ff` | `--color-ultraviolet` | Accent for hover states, active link underline, and occasional highlight punctuation — appears at near-zero frequency, so it functions as surprise, not decoration |

## Tokens — Typography

### PolySans-Slim — Body copy at 16px, subheadings at 20–30px, and section headings at 40px. The Slim optical is the voice of the site: narrow, space-efficient, never decorative. Its tight -0.01em tracking makes 16px body text feel composed rather than casual. · `--font-polysans-slim`
- **Substitute:** Inter, Manrope, or General Sans
- **Weights:** 400
- **Sizes:** 16px, 20px, 30px, 40px
- **Line height:** 1.00–1.35
- **Letter spacing:** -0.0100em
- **Role:** Body copy at 16px, subheadings at 20–30px, and section headings at 40px. The Slim optical is the voice of the site: narrow, space-efficient, never decorative. Its tight -0.01em tracking makes 16px body text feel composed rather than casual.

### PolySans-Neutral — Display and hero typography. 60px for section openers, 160px for the brand-level wordmark/display moments. At 160px with 0.90 line-height, the letters nearly touch vertically — an intentional compression that makes the type feel architectural rather than airy. · `--font-polysans-neutral`
- **Substitute:** Inter Display, Migra, or any weight-400 neo-grotesque at large size
- **Weights:** 400
- **Sizes:** 60px, 160px
- **Line height:** 0.90–1.10
- **Letter spacing:** -0.0200em
- **Role:** Display and hero typography. 60px for section openers, 160px for the brand-level wordmark/display moments. At 160px with 0.90 line-height, the letters nearly touch vertically — an intentional compression that makes the type feel architectural rather than airy.

### PolySans-Bulky — Link and CTA text at 28px. The Bulky optical adds weight and warmth to interactive elements without requiring a bold weight shift — buttons and links feel substantial at body-relative sizes. · `--font-polysans-bulky`
- **Substitute:** Inter, or the same family at weight 600
- **Weights:** 400
- **Sizes:** 28px
- **Line height:** 1.01
- **Letter spacing:** -0.0100em
- **Role:** Link and CTA text at 28px. The Bulky optical adds weight and warmth to interactive elements without requiring a bold weight shift — buttons and links feel substantial at body-relative sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.35 | -0.16px | `--text-body` |
| body-lg | 20px | 1.2 | -0.2px | `--text-body-lg` |
| subheading | 30px | 1.1 | -0.3px | `--text-subheading` |
| heading | 40px | 1 | -0.4px | `--text-heading` |
| heading-lg | 60px | 1.1 | -1.2px | `--text-heading-lg` |
| display | 160px | 0.9 | -3.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 14 | 14px | `--spacing-14` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 68 | 68px | `--spacing-68` |
| 110 | 110px | `--spacing-110` |
| 124 | 124px | `--spacing-124` |
| 222 | 222px | `--spacing-222` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 10px |
| buttons | 9999px |

### Layout

- **Section gap:** 110-124px
- **Card padding:** 32-36px
- **Element gap:** 20px

## Components

### Pill Button (Filled)
**Role:** Primary interactive element

Full-pill (9999px radius) button with white fill (#ffffff), black text, 14px vertical padding, 50px horizontal padding. Text in PolySans-Bulky at 28px weight 400, tracking -0.28px. No border, no shadow — the geometry and contrast do the work.

### Pill Button (Ghost)
**Role:** Secondary interactive element

Same 9999px radius and 28px Bulky type as the filled button, but with transparent background, 1px white border, and white text. Used for lower-emphasis actions on the dark canvas.

### Hero Display Word
**Role:** Brand-level typographic moment

PolySans-Neutral at 160px, line-height 0.90, tracking -3.2px, white on black. Functions as the visual centerpiece of any landing screen. No padding around it — the negative space around the word IS the design.

### Section Heading
**Role:** Mid-page typographic anchor

PolySans-Neutral at 60px, line-height 1.10, tracking -1.2px, white. Sits at the top of content sections with 110-124px margin-bottom to create the spacious section rhythm.

### Body Text Block
**Role:** Running copy

PolySans-Slim at 16-20px, line-height 1.35 (body) to 1.20 (larger), tracking -0.16 to -0.20px, white. Generous max-width implied by natural line length; no container card.

### Link (Inline)
**Role:** Navigable text

PolySans-Bulky at 28px, white, with violet (#c692ff) underline or hover state. The Bulky optical is the only weight contrast against the Slim body text, so links are typographically distinct without needing color emphasis.

### Top Navigation Bar
**Role:** Site-level navigation

Full-width black bar with 36-50px horizontal padding. Left: wordmark in PolySans-Slim white at 16-20px. Right: menu trigger (three-line or stacked icon) in white. No background fill, no border — it sits directly on the black canvas.

### Illustrative Graphic
**Role:** Hand-drawn visual accent

White (#ffffff) line-art illustrations at large scale, stroke weight 4-6px, no fill, no shadow. Appears alongside or behind display type. Sits flat on the black canvas with no containing frame — the artwork bleeds to the page edge.

### Content Card (Rounded)
**Role:** Contained content block

10px border-radius, black or near-black fill, white text, 32-36px padding. Used sparingly — the system prefers uncontained text on canvas over card-heavy layouts. Optional 1px white hairline border for definition.

### Tag / Pill Label
**Role:** Category or status label

9999px radius, 14px vertical padding, ~20px horizontal padding, PolySans-Slim at 16px white. Either white-fill/black-text or transparent-fill/white-border/white-text.

## Do's and Don'ts

### Do
- Use pure #000000 as the page background for every screen — no gray, no off-black, no subtle tint
- Set all interactive text in PolySans-Bulky at 28px so links and buttons are typographically distinct from Slim body copy without needing color
- Use 9999px border-radius for all buttons, tags, and pill-shaped elements
- Separate sections with 110-124px vertical gaps to maintain the spacious editorial rhythm
- Let the 160px display type breathe with no padding or container — surround it with at least 60px of black negative space on all sides
- Pair PolySans-Slim body text with PolySans-Neutral headings within the same section to create optical-size contrast within a single family
- Use #c692ff violet only as a hover-state or active-state accent — never as a default fill, never as background, never at large scale

### Don't
- Do not introduce gray mid-tones (#333, #666, #999) — the system is binary: pure white on pure black
- Do not use card backgrounds with surface tints — content sits directly on the black canvas or inside 10px-radius cards with hairline borders only
- Do not apply drop shadows, glows, or blur effects to any element — hierarchy comes from size and spacing
- Do not use #c692ff violet as a CTA background or large fill area — it is a hover/active whisper, not a brand field
- Do not use PolySans-Slim for display headlines above 40px — the optical design compresses at large sizes and loses presence
- Do not break the 9999px pill convention with rectangular buttons — the pill shape is the system's only geometric signature
- Do not crowd the layout — if a section needs to be dense, split it into two sections with 100+ px of black space between them

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#000000` | Full-bleed page background — the only surface in the system |

## Elevation

No shadows. The design system uses absolute color contrast (white on black) and generous negative space to create visual hierarchy. Elevation is implied by typographic scale and spacing, never by drop shadow or blur.

## Imagery

Hand-drawn white line-art illustrations on pure black. Strokes are 4-6px, organic and slightly irregular, featuring motifs like candles, sparklers, and abstract shapes. Illustrations sit flat on the canvas with no container, no fill, and no shadow — they read like white chalk on a blackboard. No photography, no product renders, no 3D. The visual language is graphic, editorial, and illustrative, with illustration scale reaching the full page width to create hero moments.

## Layout

Full-bleed black canvas with no max-width constraint on the outer page. Navigation is a thin top bar with 36-50px horizontal padding. Hero sections feature oversized 160px display type with no container, centered or left-aligned, often paired with large hand-drawn illustration. Content sections follow a single-column or two-column rhythm with 110-124px vertical gaps. Text blocks use natural line length (roughly 400-600px implied max-width) without visible containers. The page reads top-to-bottom as discrete full-bleed black plates separated by generous whitespace — closer to a scrollable art-book than a traditional webpage grid.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #000000
- Text: #ffffff
- Border: #ffffff (hairline)
- Accent (hover/active only): #c692ff
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero display moment**: Black (#000000) full-bleed background. Display type: PolySans-Neutral weight 400, 160px, line-height 0.90, letter-spacing -3.2px, color #ffffff. No padding around the type — let it sit in the center of the canvas with at least 80px of black space on all sides.

2. **Pill navigation button**: Transparent background, 1px solid #ffffff border, 9999px border-radius, 14px vertical padding, 50px horizontal padding. Text: PolySans-Bulky weight 400, 28px, color #ffffff, letter-spacing -0.28px.

3. **Section heading + body**: Section heading in PolySans-Neutral weight 400, 60px, line-height 1.10, letter-spacing -1.2px, color #ffffff, with 124px margin-bottom. Body text below in PolySans-Slim weight 400, 20px, line-height 1.20, letter-spacing -0.20px, color #ffffff, max natural line length (~500px).

4. **Hand-drawn illustration accent**: White (#ffffff) SVG line art, stroke-width 5px, no fill, positioned to the right of or behind display type. No container, no border, no shadow — it bleeds directly onto the black canvas.

5. **Content card**: #000000 background, 10px border-radius, 1px solid #ffffff border at 20% opacity (hairline effect), 32px padding. Body text inside in PolySans-Slim 16px #ffffff.

## Typography Philosophy

The PolySans family provides three optical sizes — Slim, Neutral, Bulky — all at weight 400. The system exploits this by using WEIGHT and OPTICAL SIZE as its only typographic variables, never mixing typefaces. This creates a calm, almost typographic-monoculture feel where the voice shifts register (whisper, speak, shout) without changing character. The tight tracking (-0.01em body, -0.02em display) pulls all sizes toward a dense, composed, editorial feel — nothing is airy or loose.

## Similar Brands

- **Studio Dumbar** — Same high-contrast monochrome presentation with oversized custom display type on full-bleed dark canvas, and white pill buttons
- **Resn** — Editorial dark-mode agency site with generous vertical spacing, no card containers, and typography-as-hero
- **Locomotive (locomotive.ca)** — Full-bleed black backgrounds, typographic-forward layouts, and single-accent-color discipline for hover states
- **Manual (manual.work)** — Ultra-minimal dark agency aesthetic relying on type scale and white illustration on black, with no decorative UI chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ultraviolet: #c692ff;

  /* Typography — Font Families */
  --font-polysans-slim: 'PolySans-Slim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-neutral: 'PolySans-Neutral', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-bulky: 'PolySans-Bulky', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.35;
  --tracking-body: -0.16px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.2px;
  --text-subheading: 30px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.3px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -0.4px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.2px;
  --text-display: 160px;
  --leading-display: 0.9;
  --tracking-display: -3.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-14: 14px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-110: 110px;
  --spacing-124: 124px;
  --spacing-222: 222px;

  /* Layout */
  --section-gap: 110-124px;
  --card-padding: 32-36px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 10px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ultraviolet: #c692ff;

  /* Typography */
  --font-polysans-slim: 'PolySans-Slim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-neutral: 'PolySans-Neutral', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-bulky: 'PolySans-Bulky', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.35;
  --tracking-body: -0.16px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.2px;
  --text-subheading: 30px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.3px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -0.4px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.2px;
  --text-display: 160px;
  --leading-display: 0.9;
  --tracking-display: -3.2px;

  /* Spacing */
  --spacing-14: 14px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-110: 110px;
  --spacing-124: 124px;
  --spacing-222: 222px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 9999px;
}
```
