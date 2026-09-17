# Fiasco — Style Reference
> "editorial gallery on cream paper" — warm off-white canvas with confident black type and single-color project cards.

**Theme:** light

Fiasco operates in an editorial, gallery-like register: a warm off-white canvas (#f8f9f3) with near-black text (#1d1e19) creates a hushed paper feel, while every project card introduces a single vivid color field that acts as wayfinding rather than decoration. The type system pairs a geometric sans (area-normal) for body and interface with a more characterful display family (Gooper) for headlines, giving the page an italic, magazine-like confidence. Components are deliberately unembellished — pill-shaped buttons (800px radius), 8px-cornered cards, 3px input fields, and a 40px radius reserved for hero and feature surfaces. Color appears as sparse, deliberate punctuation: yellow, pink, blue, orange, green blocks behind work, while the rest of the system stays in warm neutrals so the colored surfaces read as the loudest thing in the room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Cream | `#f8f9f3` | `--color-canvas-cream` | Page background, button borders, soft surface |
| Ink Black | `#1d1e19` | `--color-ink-black` | Primary text, nav borders, link borders, all structural outlines |
| Stone Mist | `#e9eae2` | `--color-stone-mist` | Nav borders, icon strokes, subtle dividers, secondary borders |
| Shadow Stone | `#d0d1cc` | `--color-shadow-stone` | Card and hero box-shadow base, low-contrast elevation |
| Carbon | `#151612` | `--color-carbon` | Footer background, deep surface for dark sections |
| Pewter | `#686e77` | `--color-pewter` | Input border, muted form fields |
| Sulfur Yellow | `#fff714` | `--color-sulfur-yellow` | Featured project card fill, callout blocks — the loudest accent, reserved for hero-grade emphasis |
| Carnation Pink | `#fbc2d1` | `--color-carnation-pink` | Project card background, soft accent block |
| Sky Blue | `#84bdff` | `--color-sky-blue` | Project card background, cool accent block |
| Ember Orange | `#fd6b01` | `--color-ember-orange` | Project card background, warm accent block |
| Cobalt Violet | `#204ce5` | `--color-cobalt-violet` | Filled button background — the only chromatic action in the system, used sparingly |
| Midnight | `#112337` | `--color-midnight` | Input text, deep navy utility for form labels |
| Lichen Green | `#03ac47` | `--color-lichen-green` | Project card background, rare accent block |

## Tokens — Typography

### area-normal — Primary workhorse — body, UI labels, buttons, inputs, project titles. Wide weight range lets it carry both fine 14px body copy and 80px display headlines without leaving the family. · `--font-area-normal`
- **Substitute:** Inter, GT America, Söhne
- **Weights:** 400, 500, 600
- **Sizes:** 12, 13, 14, 18, 20, 30, 60, 80
- **Line height:** 1.0–1.6
- **Letter spacing:** -0.005em to -0.029em (tighter as size grows)
- **Role:** Primary workhorse — body, UI labels, buttons, inputs, project titles. Wide weight range lets it carry both fine 14px body copy and 80px display headlines without leaving the family.

### HAL Timezone — Nav labels, small caps treatments, secondary headings. The 100-weight gives nav items a thin, almost editorial feel that contrasts with the bolder body sans. · `--font-hal-timezone`
- **Substitute:** Söhne Breit, ABC Diatype Mono, GT America Mono
- **Weights:** 100, 400, 500
- **Sizes:** 12, 20, 22, 34
- **Line height:** 1.2–1.5
- **Letter spacing:** -0.012em to -0.033em
- **Role:** Nav labels, small caps treatments, secondary headings. The 100-weight gives nav items a thin, almost editorial feel that contrasts with the bolder body sans.

### Gooper — Display and editorial headlines with personality — used for large pull-quotes, italic-feeling treatments, and section titles. The tight 0.8 line-height at 40px gives headlines a compressed, magazine-like density. · `--font-gooper`
- **Substitute:** Migra, Editorial New, GT Sectra Display
- **Weights:** 400, 500, 700
- **Sizes:** 16, 17, 19, 40
- **Line height:** 0.8–1.3
- **Letter spacing:** -0.01em to -0.025em
- **Role:** Display and editorial headlines with personality — used for large pull-quotes, italic-feeling treatments, and section titles. The tight 0.8 line-height at 40px gives headlines a compressed, magazine-like density.

### OC Highway — Micro-labels and tracked-out uppercase tags (e.g. '01:27 UK' timestamp). The +0.10em tracking makes 10px text readable as a label. · `--font-oc-highway`
- **Substitute:** JetBrains Mono, ABC Diatype Mono
- **Weights:** 400
- **Sizes:** 10
- **Line height:** 1.1
- **Letter spacing:** 0.10em
- **Role:** Micro-labels and tracked-out uppercase tags (e.g. '01:27 UK' timestamp). The +0.10em tracking makes 10px text readable as a label.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 14.4 | -0.15px | `--text-caption` |
| body-sm | 14px | 20 | -0.07px | `--text-body-sm` |
| body | 18px | 25.2 | -0.23px | `--text-body` |
| subheading | 20px | 28 | -0.4px | `--text-subheading` |
| heading-sm | 30px | 36 | -0.9px | `--text-heading-sm` |
| heading | 40px | 32 | -1px | `--text-heading` |
| heading-lg | 60px | 66 | -1.74px | `--text-heading-lg` |
| display | 80px | 88 | -2.32px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| hero | 40px |
| cards | 8px |
| links | 44px |
| inputs | 3px |
| buttons | 800px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(18, 25, 97, 0.08) 0px 1px 4px 0px` | `--shadow-sm` |
| xl | `rgba(0, 0, 0, 0.16) 0px 28px 80px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 22px
- **Element gap:** 12px

## Components

### Pill Button (Primary)
**Role:** Primary CTA

Fully rounded (800px radius), 12px 20px padding, area-normal 500 at 14px, text in Canvas Cream (#f8f9f3) on Cobalt Violet (#204ce5) fill. Carries the faint blue-tinted shadow rgba(18,25,97,0.08) 0 1px 4px. Used extremely rarely — the system prefers ghost/underline actions over filled buttons.

### Ghost Pill Button
**Role:** Secondary action

800px radius, 12px 20px padding, area-normal 500 at 14px, Ink Black (#1d1e19) text with a 1px Ink Black border. No fill, no shadow. The default button form for most interactive elements.

### Project Card
**Role:** Work/case study tile

8px radius, 22px padding on all sides, vivid solid-color background (Sulfur Yellow, Carnation Pink, Sky Blue, Ember Orange, Lichen Green, or Canvas Cream). 0.16-alpha black shadow 0 28px 80px lifts it off the canvas. Contains a project image, italic title, description, and tag pills.

### Hero Block
**Role:** Above-the-fold showcase

40px radius, full-bleed within the 1200px max-width, receives the heavy 0 28px 80px shadow. Used for the opening video/visual block beneath the hero headline.

### Text Input
**Role:** Form field

3px radius, 1px Pewter (#686e77) border, 12px horizontal padding, area-normal 400 at 18px in Midnight (#112337). Carries the 0 1px 4px blue-tinted shadow. No visible focus ring change in the data — the border itself is the affordance.

### Tag Pill
**Role:** Category/discipline label

800px radius, 6px 12px padding, area-normal 400 at 13px in Ink Black. Outlined with a 1px Ink Black border. No fill. Used for project disciplines like 'Technology' and 'Brand & Digital'.

### Nav Link
**Role:** Top navigation item

HAL Timezone 400 at ~20px, Ink Black, no underline. Right-aligned cluster includes a 10px OC Highway timestamp ('01:27 UK') with +0.10em tracking as a small editorial detail.

### Section Heading (Display)
**Role:** Hero/page title

area-normal 500 at 60–80px, Ink Black, letter-spacing -0.029em, line-height ~1.1. Centered alignment, narrow measure (~720px) for the hero statement. This is the largest type in the system.

### Project Title (Italic)
**Role:** Card heading

Gooper 500 at 17–19px in italic, Ink Black, line-height 1.2. Sits directly under the project image and gives the card an editorial pull-quote feel.

### Section Label
**Role:** Pre-title / kicker

Gooper 400 at 16px italic, centered, Ink Black. Sits above section content as a quiet 'Selected works' style marker.

### Footer Block
**Role:** Site footer

Carbon (#151612) background, full-width, Canvas Cream text. Inverts the page's dominant warm-light feel for a closing dark band.

## Do's and Don'ts

### Do
- Use pill-shaped buttons (800px radius) for every interactive element — never square or slightly-rounded buttons
- Let project cards own color: pick one vivid hex from the accent set per card, keep the rest of the page in warm neutrals
- Set body copy at 18px in area-normal 400 — the system reads at editorial size, not product-UI size
- Anchor all headlines in Ink Black (#1d1e19) and let the canvas (#f8f9f3) carry the warmth — never introduce white
- Reserve 40px radius exclusively for hero and feature surfaces; cards stay at 8px to maintain the gallery hierarchy
- Apply the heavy 0 28px 80px shadow only to hero blocks and project cards — the depth comes from a small number of well-placed shadows, not constant elevation
- Use OC Highway at 10px with +0.10em tracking for micro-labels and timestamps — the tracked uppercase is a signature detail

### Don't
- Don't use the chromatic accent palette for buttons, nav, or text — they belong only to project card backgrounds
- Don't mix multiple vivid colors on the same card or section — one color field per surface
- Don't introduce pure black (#000000) as a fill — Ink Black (#1d1e19) is the system black, the tiny warm shift is the difference
- Don't use more than one shadow tier per page level — the heavy shadow is for cards/hero, the faint one for inputs, nothing else
- Don't set body text below 18px — the system is editorial, not data-dense
- Don't use Cobalt Violet (#204ce5) for anything other than a single filled primary action — it's the system's only chromatic action and overuse flattens its meaning
- Don't round inputs at 8px — the 3px input radius creates a deliberate contrast with the pill buttons and is part of the system language

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f8f9f3` | Default page background, warm off-white paper |
| 1 | Colored Card | `#fff714 / #fbc2d1 / #84bdff / #fd6b01 / #03ac47` | Project card backgrounds, each a different vivid hue |
| 2 | Quiet Card | `#e9eae2` | Subtle secondary surfaces, nav-adjacent blocks |
| 3 | Deep Surface | `#151612` | Footer and dark contrast sections |

## Elevation

- **Hero block:** `rgba(0, 0, 0, 0.16) 0px 28px 80px 0px`
- **Project card:** `rgba(0, 0, 0, 0.16) 0px 28px 80px 0px`
- **Input field:** `rgba(18, 25, 97, 0.08) 0px 1px 4px 0px`
- **Button:** `rgba(18, 25, 97, 0.08) 0px 1px 4px 0px`

## Imagery

Imagery is project-led: each case study carries a full-bleed photograph or render inside the card, and the colored card background acts as a matte frame. Photography is real-world, cinematic, and editorial — city streets, product launches, festival signage, aerial shots — never stock-staged. No illustrations, no abstract graphics, no icon system beyond simple geometric tags. Hero sections use a single dominant visual (video or still) inside a 40px-radius container rather than collage or grid. Icons are minimal: small line weights used only for nav arrows and timestamp markers. The overall feel is photo-journalistic, not product-shot.

## Layout

Page model is max-width 1200px, centered, with generous outer margins on desktop. The hero opens with a centered display headline over the warm cream canvas, immediately followed by a full-bleed 40px-radius hero visual. Sections alternate between cream canvas and slightly tinted cards without ever using a full dark band until the footer. The work grid is a 2-column layout with generous gutters — each card is large enough to feel like a magazine spread, not a thumbnail. Section rhythm is unhurried: ~80px vertical gaps between major sections, with small labels (italic Gooper) providing quiet dividers. Navigation is a single top bar with a left-aligned wordmark ('Fiasco') and a right-aligned cluster of HAL Timezone links plus an editorial timestamp. No sidebar, no sticky behavior visible in the data. The footer inverts to dark Carbon for a clean closing band.

## Agent Prompt Guide

Quick Color Reference:
- text: #1d1e19 (Ink Black)
- background: #f8f9f3 (Canvas Cream)
- border: #1d1e19 (Ink Black for structural) / #e9eae2 (Stone Mist for subtle)
- accent: #fff714 (Sulfur Yellow — the loudest project card color)
- primary action: #204ce5 (filled action)
- form input border: #686e77 (Pewter)

Example Component Prompts:

1. Create a project card: 8px border-radius, 22px padding on all sides, background #fff714 (Sulfur Yellow). Project image at top filling card width. Below: italic Gooper 500 19px in #1d1e19 reading the project title. Description in area-normal 400 18px in #1d1e19. Two tag pills at the bottom: 800px radius, 6px 12px padding, 1px #1d1e19 border, area-normal 400 13px #1d1e19. Apply shadow rgba(0,0,0,0.16) 0 28px 80px.

2. Create a hero section: cream canvas (#f8f9f3). Centered headline in area-normal 500 72px, color #1d1e19, letter-spacing -0.029em, line-height 1.1, max-width 720px. Below: a full-bleed visual block, 40px border-radius, 600px tall, with the heavy shadow rgba(0,0,0,0.16) 0 28px 80px.

3. Create a ghost button: 800px border-radius, 12px 20px padding, 1px solid #1d1e19 border, no fill. Text in area-normal 500 14px, color #1d1e19. No shadow. Pair with a second identical button to the right for a dual-action pattern.

4. Create a text input: 3px border-radius, 1px solid #686e77 border, 12px horizontal padding, area-normal 400 18px in #112337, with the faint shadow rgba(18,25,97,0.08) 0 1px 4px. Placeholder in #686e77 at the same size.

5. Create a nav bar: cream canvas background, left-aligned 'Fiasco' wordmark in area-normal 600 24px #1d1e19. Right-aligned cluster of links in HAL Timezone 400 20px #1d1e19, separated by ~24px gaps. Append a 10px OC Highway timestamp with +0.10em tracking at the far right in #1d1e19.

## Typography Pairing Logic

The system uses three font roles that must not blur: area-normal is the voice (body, UI, even large headlines when the message is functional), Gooper is the personality (editorial pull-quotes, italic project titles, section kickers), and HAL Timezone is the utility (nav, small labels, secondary headings). OC Highway only appears as tracked micro-labels. When choosing a type role, ask: is this content speaking to the reader (Gooper), serving the reader (area-normal), or labeling for the reader (HAL Timezone / OC Highway)? Mixing these roles on the same element breaks the editorial register.

## Similar Brands

- **Pentagram** — Same editorial agency approach with a single wordmark, generous whitespace, and large confident display type on a neutral canvas
- **Wolff Olins** — Similar project-led gallery layout with each case study given its own color field, and minimal chrome between sections
- **Instrument** — Warm off-white canvas with near-black text, pill-shaped buttons, and vivid accent blocks behind featured work
- **Resn** — Playful agency aesthetic with custom type, cream backgrounds, and unembellished components that let the work dominate
- **Locomotive** — Bold display headlines, warm neutral palette, and the same restraint of using color only on project surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-cream: #f8f9f3;
  --color-ink-black: #1d1e19;
  --color-stone-mist: #e9eae2;
  --color-shadow-stone: #d0d1cc;
  --color-carbon: #151612;
  --color-pewter: #686e77;
  --color-sulfur-yellow: #fff714;
  --color-carnation-pink: #fbc2d1;
  --color-sky-blue: #84bdff;
  --color-ember-orange: #fd6b01;
  --color-cobalt-violet: #204ce5;
  --color-midnight: #112337;
  --color-lichen-green: #03ac47;

  /* Typography — Font Families */
  --font-area-normal: 'area-normal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hal-timezone: 'HAL Timezone', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gooper: 'Gooper', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-oc-highway: 'OC Highway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 14.4;
  --tracking-caption: -0.15px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.07px;
  --text-body: 18px;
  --leading-body: 25.2;
  --tracking-body: -0.23px;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 36;
  --tracking-heading-sm: -0.9px;
  --text-heading: 40px;
  --leading-heading: 32;
  --tracking-heading: -1px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 66;
  --tracking-heading-lg: -1.74px;
  --text-display: 80px;
  --leading-display: 88;
  --tracking-display: -2.32px;

  /* Typography — Weights */
  --font-weight-thin: 100;
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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 22px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-3xl: 40px;
  --radius-3xl-2: 44px;
  --radius-full: 800px;

  /* Named Radii */
  --radius-hero: 40px;
  --radius-cards: 8px;
  --radius-links: 44px;
  --radius-inputs: 3px;
  --radius-buttons: 800px;

  /* Shadows */
  --shadow-sm: rgba(18, 25, 97, 0.08) 0px 1px 4px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.16) 0px 28px 80px 0px;

  /* Surfaces */
  --surface-canvas: #f8f9f3;
  --surface-colored-card: #fff714 / #fbc2d1 / #84bdff / #fd6b01 / #03ac47;
  --surface-quiet-card: #e9eae2;
  --surface-deep-surface: #151612;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-cream: #f8f9f3;
  --color-ink-black: #1d1e19;
  --color-stone-mist: #e9eae2;
  --color-shadow-stone: #d0d1cc;
  --color-carbon: #151612;
  --color-pewter: #686e77;
  --color-sulfur-yellow: #fff714;
  --color-carnation-pink: #fbc2d1;
  --color-sky-blue: #84bdff;
  --color-ember-orange: #fd6b01;
  --color-cobalt-violet: #204ce5;
  --color-midnight: #112337;
  --color-lichen-green: #03ac47;

  /* Typography */
  --font-area-normal: 'area-normal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hal-timezone: 'HAL Timezone', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gooper: 'Gooper', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-oc-highway: 'OC Highway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 14.4;
  --tracking-caption: -0.15px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.07px;
  --text-body: 18px;
  --leading-body: 25.2;
  --tracking-body: -0.23px;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 36;
  --tracking-heading-sm: -0.9px;
  --text-heading: 40px;
  --leading-heading: 32;
  --tracking-heading: -1px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 66;
  --tracking-heading-lg: -1.74px;
  --text-display: 80px;
  --leading-display: 88;
  --tracking-display: -2.32px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-3xl: 40px;
  --radius-3xl-2: 44px;
  --radius-full: 800px;

  /* Shadows */
  --shadow-sm: rgba(18, 25, 97, 0.08) 0px 1px 4px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.16) 0px 28px 80px 0px;
}
```
