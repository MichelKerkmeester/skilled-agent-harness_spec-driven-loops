# Exante — Style Reference
> neon greenhouse at midnight

**Theme:** light

A fintech site that lives in two registers: a near-black hero with wireframe geometry and whisper-light Alliance No.2 display headlines at 52–80px with aggressive negative tracking, then sections that snap to a white canvas and erupt with a single radioactive mint accent. The system is deliberately sharp — a 2px border radius governs almost every surface, rejecting softness in favor of an architectural, blueprint-like language. Typography carries the brand: custom display faces set tight and large, Geist Variable keeps the interface grounded, and Geist Mono at 12px with +0.06em tracking introduces an editorial eyebrow label used above every section. Color is surgical: black, white, and a near-black with a green undertone (#1e211e) do 90% of the work; the mint #90fc95 is reserved as a single bright punctuation mark for highlight bands and metric surfaces.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#1e211e` | `--color-obsidian` | Filled buttons, hero canvas, primary text on light surfaces — near-black with a barely-there green undertone that links it to the mint accent without announcing itself |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, button text on dark fills, nav background |
| Pure Black | `#000000` | `--color-pure-black` | Hairline borders, icon strokes, sharpest outlines — provides the crispest edge against white surfaces |
| Graphite | `#4b4d4b` | `--color-graphite` | Secondary body text, subdued borders — the middle voice between Obsidian and Ash |
| Ash | `#d2d3d2` | `--color-ash` | Hairline dividers, accordion separators, disabled and inactive states |
| Neon Mint | `#90fc95` | `--color-neon-mint` | Highlight section backgrounds, stat callout fills, wireframe geometry accents — the single chromatic moment that makes the brand instantly recognizable |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Alliance No.2 — Display and heading face for editorial moments — set large (52–80px) with aggressive negative tracking (-0.05em to -0.01em). The Light weight at 80px is used once for a hero statement, a deliberate whisper-quiet choice against the dark canvas. Enables stylistic set ss10 plus character variants 03, 04, 09, 11. · `--font-alliance-no2`
- **Substitute:** Tiempos Headline, GT Sectra, or for free: Fraunces at -2% tracking
- **Weights:** 300, 400
- **Sizes:** 24, 28, 52, 58, 80px
- **Line height:** 1.00–1.20
- **Letter spacing:** -4px at 80px, -2.9px at 58px, -2.6px at 52px, -1.12px at 28px, -1.2px at 24px
- **OpenType features:** `"ss10" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Display and heading face for editorial moments — set large (52–80px) with aggressive negative tracking (-0.05em to -0.01em). The Light weight at 80px is used once for a hero statement, a deliberate whisper-quiet choice against the dark canvas. Enables stylistic set ss10 plus character variants 03, 04, 09, 11.

### Geist — Secondary display and large body — used at 72px for an alternative hero treatment and 19–21px for comfortable long-form reading. Weight 300 echoes the Alliance No.2 Light restraint. · `--font-geist`
- **Substitute:** Inter, General Sans
- **Weights:** 300, 400
- **Sizes:** 19, 21, 72px
- **Line height:** 1.00, 1.40, 1.50
- **Letter spacing:** -0.76px at 19px
- **Role:** Secondary display and large body — used at 72px for an alternative hero treatment and 19–21px for comfortable long-form reading. Weight 300 echoes the Alliance No.2 Light restraint.

### Geist Variable — Primary UI and body face — nav links, button labels, body copy, form fields, card text. Slightly negative tracking (-0.01 to -0.02em) tightens Geist's default spacing for a more engineered feel. · `--font-geist-variable`
- **Substitute:** Inter, General Sans
- **Weights:** 400
- **Sizes:** 14, 16, 17, 19, 21, 24px
- **Line height:** 1.40
- **Letter spacing:** -0.28px at 14px, -0.32px at 16px, -0.34px at 17px, -0.38px at 19px, -0.42px at 21px, -0.48px at 24px
- **OpenType features:** `"ss03" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Primary UI and body face — nav links, button labels, body copy, form fields, card text. Slightly negative tracking (-0.01 to -0.02em) tightens Geist's default spacing for a more engineered feel.

### Geist Mono — Eyebrow labels and monospaced micro-text — ALWAYS set in UPPERCASE with +0.06em tracking, used as the section-introduction line above every heading (e.g. 'AUTOMATE COLLECTIONS, YOUR WAY'). The only place tracking opens up. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12, 16px
- **Line height:** 1.20, 1.40
- **Letter spacing:** +0.72px at 12px, +0.96px at 16px
- **Role:** Eyebrow labels and monospaced micro-text — ALWAYS set in UPPERCASE with +0.06em tracking, used as the section-introduction line above every heading (e.g. 'AUTOMATE COLLECTIONS, YOUR WAY'). The only place tracking opens up.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.72px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.28px | `--text-body-sm` |
| body | 16px | 1.4 | -0.32px | `--text-body` |
| body-lg | 19px | 1.5 | -0.38px | `--text-body-lg` |
| subheading | 24px | 1.4 | -0.48px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -1.12px | `--text-heading-sm` |
| heading | 52px | 1.1 | -2.08px | `--text-heading` |
| heading-lg | 58px | 1 | -2.32px | `--text-heading-lg` |
| display | 80px | 1 | -4px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 124 | 124px | `--spacing-124` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 2px |
| images | 8px |
| inputs | 2px |
| buttons | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96-160px
- **Card padding:** 24px
- **Element gap:** 10-12px

## Components

### Filled Dark Button
**Role:** Primary action on light surfaces

Obsidian (#1e211e) background, Paper (#ffffff) text at 14px Geist, 2px radius, 11px vertical / 16px horizontal padding, no border. Used for the dominant 'Request a Demo' action in the nav and hero.

### Outlined Dark Button
**Role:** Secondary action on light surfaces

Transparent background, 1px Obsidian (#1e211e) border, Obsidian text at 14px Geist, 2px radius, 11px / 16px padding. Sits beside the filled button as a quieter companion.

### Outlined Light Button
**Role:** Tertiary action on dark surfaces

Transparent background, 1px Paper (#ffffff) border at 50% opacity, Paper text at 14px Geist, 2px radius. Used sparingly for secondary actions inside dark sections.

### Top Navigation Bar
**Role:** Global site header

Paper (#ffffff) background, 64–72px height, horizontal flex with 24px column gap. Logo left, dropdown links center, two dark buttons right. No shadow, no border-bottom — floats on the canvas.

### Dark Hero Section
**Role:** First-screen brand statement

Full-bleed Obsidian (#1e211e) background, ~600–700px tall, split layout: text-left at max-width 560px with 80px Alliance No.2 Light headline and 18px Geist body, wireframe cube graphic bleeding off the right edge.

### Neon Mint Highlight Band
**Role:** Metrics and proof section

Full-bleed Neon Mint (#90fc95) background, houses 4 stat cards in a horizontal row. Includes geometric cube outlines in dark green as decorative bleed on the right edge.

### Stat Card
**Role:** Single metric display

Paper (#ffffff) background, 2px radius, 24px padding, no border. Eyebrow label in Geist Mono 12px uppercase +0.06em, massive number at 80px Alliance No.2 Light, descriptor at 16px Geist in Graphite. Floats on Neon Mint.

### Eyebrow Label
**Role:** Section introduction line

Geist Mono 12px UPPERCASE, +0.72px letter-spacing, Obsidian or Paper color depending on surface. ALWAYS appears directly above a section headline as a category marker.

### Section Headline
**Role:** Primary content heading

Alliance No.2 Regular at 52–58px, -0.04em tracking, Obsidian on light / Paper on dark. Sets the editorial tone of every content section.

### FAQ Accordion Row
**Role:** Expandable question item

Paper background, 1px Ash (#d2d3d2) bottom border only, 24px vertical padding, question text in 19px Geist Obsidian. No background fill, no card chrome — the divider line IS the component.

### Wireframe Cube Graphic
**Role:** Decorative hero/section geometry

Isometric cube outlines in 1px strokes — Neon Mint on dark hero, Obsidian on Neon Mint band. Stacked offset to create depth, always bleeding off a page edge.

### Footer
**Role:** Site footer

Paper background, multi-column link grid, Obsidian text, 1px Ash hairline divider above. Echoes the nav's flatness.

## Do's and Don'ts

### Do
- Use Alliance No.2 for all display and heading text at 28px or above, with negative tracking between -0.01em and -0.05em depending on size.
- Set every section-introduction label in Geist Mono 12px UPPERCASE with +0.06em tracking — this is the system's signature editorial punctuation.
- Use 2px border radius on all buttons, cards, inputs, and tags. 8px is reserved for images only.
- Reach for Neon Mint (#90fc95) as a full-bleed section background or large surface, never as a button fill or text color on a small element.
- Use Obsidian (#1e211e) for filled buttons and primary text — its faint green undertone ties the dark surface back to the brand accent.
- Place at least one full-bleed dark (Obsidian) section and at least one full-bleed Neon Mint section on every marketing page — the two-mood rhythm is the brand.
- Stack headlines at line-height 1.00–1.10 and body copy at 1.40–1.50; the contrast between tight display and comfortable body is a signature.

### Don't
- Don't use soft or large border radii — 2px is the system limit, anything above 8px breaks the architectural language.
- Don't use the Neon Mint as a button background, link color, or text accent — it is a SURFACE, not a point color.
- Don't use drop shadows or blur for elevation — the system stacks surfaces through color contrast only.
- Don't set body copy below 14px or above 24px — Geist's comfort range is narrow and intentional.
- Don't use pure black (#000000) for large fills or text blocks — reserve it for borders and 1px details; Obsidian handles surfaces.
- Don't use more than one chromatic color per page — the entire palette is one accent.
- Don't set headings in Geist when Alliance No.2 is available — the contrast between the custom display face and the UI face is the typographic signature.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas and dominant section background |
| 1 | Stat Card | `#ffffff` | White cards floating on the Neon Mint highlight band |
| 2 | Neon Mint Band | `#90fc95` | Full-bleed highlight section breaking the white rhythm |
| 3 | Obsidian Hero | `#1e211` | Dark full-bleed hero canvas with wireframe geometry |

## Elevation

Elevation is achieved through color contrast and surface bands, not shadows. Dark hero on white page, white cards on Neon Mint, white card on Obsidian — the system stacks surfaces through hue and value, keeping every edge crisp. No drop shadows, no blur.

## Imagery

The site uses almost no photography. The dominant visual device is a geometric wireframe: isometric cubes drawn in 1px strokes in Neon Mint (on the dark hero) or Obsidian (on the green band), stacked offset to create a sense of depth and bleeding off the page edge. These cubes function as both decoration and abstract brand mark — suggesting structure, systems, and modularity. The only photographic opportunity is in the dark hero, where the wireframe floats over the near-black canvas with no supporting imagery.

## Layout

Centered max-width ~1200px content column with a two-mood vertical rhythm: full-bleed Obsidian hero (split text-left / wireframe-right) → white content sections → full-bleed Neon Mint highlight band with 4-column stat cards → back to white for FAQ and remaining content. Navigation is a flat horizontal bar with no shadow, no border. The hero is the only asymmetric layout moment; everything else centers or uses simple column grids. Sections are separated by generous 96–160px vertical gaps, creating a confident, unhurried scroll. The wireframe geometry always bleeds off the right edge of the page, anchoring the right side of the visual field.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1e211e (Obsidian)
- background: #ffffff (Paper)
- border: #1e211e or #d2d3d2 (Ash)
- accent surface: #90fc95 (Neon Mint) — for full-bleed bands only
- primary action: #1e211e (filled action)

**3 Example Component Prompts**

1. **Dark Hero Section**: Full-bleed Obsidian (#1e211e) background, ~640px tall. Headline at 80px Alliance No.2 Light, #ffffff, letter-spacing -4px, line-height 1.00, positioned left at max-width 560px. Body subtext at 19px Geist weight 400, #ffffff at 80% opacity. Two buttons: filled #1e211e would disappear — instead use a Filled Light button (white bg, dark text, 2px radius) and an Outlined Light button (1px white border at 50% opacity, white text). Wireframe cube graphic in 1px Neon Mint strokes bleeding off the right edge.

2. **Neon Mint Highlight Band**: Full-bleed #90fc95 background, 120px vertical padding. Eyebrow label in Geist Mono 12px UPPERCASE +0.72px tracking, #1e211e. Section headline at 52px Alliance No.2 Regular, #1e211e, letter-spacing -2.08px. Below, a 4-column row of Stat Cards: #ffffff background, 2px radius, 24px padding, 80px Alliance No.2 Light number in #1e211e, 16px Geist descriptor in #4b4d4b.

3. **FAQ Accordion List**: White (#ffffff) background, max-width 800px centered. List title at 52px Alliance No.2 Regular, #1e211e. Each row: 24px vertical padding, 19px Geist #1e211e question text, 1px #d2d3d2 bottom border only. No card backgrounds, no shadows — the divider line is the component.

## Similar Brands

- **Linear** — Same near-black surfaces paired with a single vivid accent, sharp 2–4px corners, and editorial-grade display typography with tight negative tracking
- **Mercury** — Same restraint with one chromatic highlight, large light-weight display headlines, and white-canvas product surfaces with dark hero blocks
- **Vercel** — Same dark/light two-mood page rhythm, monochrome base with a single neon green accent, and architectural wireframe geometry as hero decoration
- **Pigment** — Same obsession with custom display serifs/sans, generous whitespace between sections, and a flat non-shadowed surface system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #1e211e;
  --color-paper: #ffffff;
  --color-pure-black: #000000;
  --color-graphite: #4b4d4b;
  --color-ash: #d2d3d2;
  --color-neon-mint: #90fc95;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-alliance-no2: 'Alliance No.2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-variable: 'Geist Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.38px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.12px;
  --text-heading: 52px;
  --leading-heading: 1.1;
  --tracking-heading: -2.08px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.32px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -4px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-124: 124px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96-160px;
  --card-padding: 24px;
  --element-gap: 10-12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 2px;
  --radius-images: 8px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-stat-card: #ffffff;
  --surface-neon-mint-band: #90fc95;
  --surface-obsidian-hero: #1e211;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #1e211e;
  --color-paper: #ffffff;
  --color-pure-black: #000000;
  --color-graphite: #4b4d4b;
  --color-ash: #d2d3d2;
  --color-neon-mint: #90fc95;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-alliance-no2: 'Alliance No.2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-variable: 'Geist Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.38px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.12px;
  --text-heading: 52px;
  --leading-heading: 1.1;
  --tracking-heading: -2.08px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.32px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-124: 124px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
}
```
