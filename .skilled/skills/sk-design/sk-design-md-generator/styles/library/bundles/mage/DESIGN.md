# Mage — Style Reference
> data alchemy on parchment. Warm off-white canvas, whisper-weight Inter headlines, one cobalt switch for action, dark-mode product islands floating inside a bright editorial page.

**Theme:** light

Mage operates on a warm parchment canvas (#f7f7f1) that gives the data-platform brand an editorial, almost lab-notebook warmth rather than the cold gray most SaaS tools default to. The interface is deliberately quiet: soft cards on a warm white field, generous breathing room, and a single vivid electric-cobalt accent (#244cff) that acts as a switch — it appears only on primary actions, nowhere else. Typography is Inter-only, used at restrained weights (400 dominates even at display sizes), which makes the large headlines feel declarative rather than shouting. Product surfaces (the pipeline editor) are dark-mode islands embedded inside the light page, creating a clear visual contract: marketing context is warm-paper light, working context is deep-graphite dark. Decorative violet (#c3aeff) threads through the brand illustration as a secondary color note, never as UI chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#244cff` | `--color-electric-cobalt` | Primary action fill — CTA buttons, active nav state, the single switched-on color in an otherwise muted system |
| Lavender Mist | `#c3aeff` | `--color-lavender-mist` | Brand illustration accent — decorative fills in the hero artwork and supporting graphics, echoes the cobalt at lower saturation |
| Parchment | `#f7f7f1` | `--color-parchment` | Page canvas — warm off-white background that gives the whole site its editorial, paper-like quality |
| Snow | `#ffffff` | `--color-snow` | Card surfaces, text on dark backgrounds, product thumbnail containers |
| Ice Wash | `#e8f8ff` | `--color-ice-wash` | Tinted card surface — subtle blue-white variant for differentiated cards (logo bar, feature callouts) |
| Sky Tint | `#d6f2ff` | `--color-sky-tint` | Decorative card wash — pale blue background for illustration overlays and feature card accents |
| Lemon Wash | `#ffffbd` | `--color-lemon-wash` | Decorative card wash — warm yellow tint for illustration card backgrounds and feature highlights |
| Blush | `#fcc2cd` | `--color-blush` | Decorative card wash — soft pink for illustration card backgrounds |
| Buttercream | `#fced9f` | `--color-buttercream` | Decorative card wash — warm cream-yellow for illustration card backgrounds |
| Azure | `#3388ff` | `--color-azure` | Illustration accent — mid-blue used in hero artwork and data visualization elements |
| Slate Blue | `#5487a1` | `--color-slate-blue` | Illustration accent — muted blue for decorative borders and secondary graphic elements |
| Amber | `#9e770b` | `--color-amber` | Illustration accent — warm dark-yellow for decorative graphic elements |
| Lilac Pop | `#ba9ffc` | `--color-lilac-pop` | Illustration accent — vivid lavender for hero artwork highlights |
| Deep Cobalt | `#294dba` | `--color-deep-cobalt` | Illustration accent — darker blue for hero artwork depth and contrast |
| Pure Black | `#000000` | `--color-pure-black` | Primary text, hairline borders, high-contrast edges |
| Graphite | `#2b2b2b` | `--color-graphite` | Secondary text, body copy on light surfaces — softer than pure black for reading comfort |
| Obsidian | `#1d1f21` | `--color-obsidian` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Ash | `#878787` | `--color-ash` | Muted text — captions, helper text, secondary metadata |
| Fog | `#b0b0b0` | `--color-fog` | Borders, dividers, disabled state outlines, muted link text |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Inter — Workhorse body and UI text — body copy at 400, buttons/labels at 500-600, bold callouts at 700. The font's open apertures and tall x-height make it readable at 12-16px on the warm canvas · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 15px, 16px, 17px, 18px, 21px, 22px, 24px
- **Line height:** 1.20-1.65
- **OpenType features:** `"cv03", "cv04", "cv09", "cv11", "blwf"`
- **Role:** Workhorse body and UI text — body copy at 400, buttons/labels at 500-600, bold callouts at 700. The font's open apertures and tall x-height make it readable at 12-16px on the warm canvas

### Inter Variable — Display and heading sizes — 60px display headlines, 38px section headers, 30px subheadings. Weight stays at 400 even at display size: the headlines whisper rather than shout, authority through scale not weight · `--font-inter-variable`
- **Substitute:** Inter (static weights)
- **Weights:** 400
- **Sizes:** 20px, 22px, 30px, 38px, 60px
- **Line height:** 1.30-1.40
- **Role:** Display and heading sizes — 60px display headlines, 38px section headers, 30px subheadings. Weight stays at 400 even at display size: the headlines whisper rather than shout, authority through scale not weight

### Geist — Small bold labels — compact uppercase-style tags and category markers at 14px weight 600 · `--font-geist`
- **Substitute:** Inter 600
- **Weights:** 600
- **Sizes:** 14px
- **Line height:** 1.50
- **Role:** Small bold labels — compact uppercase-style tags and category markers at 14px weight 600

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 22px | 1.3 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 30px | 1.4 | — | `--text-heading` |
| heading-lg | 38px | 1.3 | — | `--text-heading-lg` |
| display | 60px | 1.3 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| images | 16px |
| buttons | 100px |
| largeSurfaces | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24-40px
- **Element gap:** 10px

## Components

### Primary CTA Button
**Role:** High-emphasis action — 'Start Building', form submissions

Electric Cobalt #244cff background, white text, Inter 500 at 15-16px, pill radius (100px), padding 12px 24px. The single vivid color in the system — every primary action uses this exact shade. No hover darkening needed at this saturation; it already commands attention.

### Dark CTA Button
**Role:** Secondary high-emphasis — 'Try Mage' in nav, product entry points

Obsidian #1d1f21 background, white text, Inter 500 at 15-16px, pill radius (100px), padding 8px 16px. Used for the persistent product-access button in the nav bar. The dark-on-warm-white contrast creates a different kind of urgency than the cobalt — more 'enter the tool' than 'start here'.

### Ghost Text Link
**Role:** Low-emphasis action — 'Get a demo', inline navigation

No background, Graphite #2b2b2b text, Inter 500 at 15-16px. Sits beside filled CTAs as the secondary path. Underline appears on hover only.

### Navigation Bar
**Role:** Top-level site navigation

Transparent over Parchment #f7f7f1 canvas. Left: Mage logo (custom mark) + nav links (Platform, Solutions, Resources, Pricing, Try) in Inter 500 at 15px. Right: 'Demo' ghost link + 'Try Mage' dark pill button. No background fill, no border — the bar relies on whitespace and the warm canvas to separate from content below.

### Hero Product Thumbnail
**Role:** Embedded product preview in the hero section

Dark-mode product UI screenshot (Obsidian #1d1f21 surface) inside a Snow #ffffff container with 16px radius. Central play button overlay (white circle with cobalt play icon) signals video. The dark product island inside the warm light page is the signature visual contrast — 'here is where the work happens'.

### Trust Logo Bar
**Role:** Social proof — 'Trusted by data teams at leading companies'

Horizontal strip of company logos (Samsung, Stability.ai, Comcast, IBM, etc.) on Parchment #f7f7f1 canvas. Logos rendered in Pure Black or Graphite. The logos themselves sit on subtle individual card containers with 6px radius and Ice Wash #e8f8ff or Parchment backgrounds.

### Feature Card (Product Screenshot)
**Role:** Feature showcase — 'Build pipelines', 'Connect data', 'Run continuously', 'Fix and recover'

Two-column layout: heading (Inter 400 at 18-22px) + subtext (Inter 400 at 16px, Graphite) above a dark-mode product screenshot with 6px radius. The screenshot shows the pipeline editor with dark sidebar and monospace code. The dark product image anchors each card and signals 'this is real, working software'.

### Section Heading Group
**Role:** Section titles and descriptions

Inter Variable 400 at 38px for the section title, Inter 400 at 16-18px Graphite for the subtitle. The 38px headline at weight 400 is the signature: no bold, no uppercase, no decorative flourishes — just scale and Inter's geometric clarity doing the work.

### Illustration Overlay
**Role:** Decorative hero artwork — people interacting with a data orb

Full-color custom illustration: characters in varied clothing (coral, yellow, purple, teal) around a central blue spherical data object with circuit patterns. Uses the illustration palette: Lavender Mist #c3aeff, Azure #3388ff, Blush #fcc2cd, Buttercream #fced9f. Sits to the right of the hero text, roughly 50% of viewport width.

### Data Source Icon Grid
**Role:** Integration showcase within the product UI

Grid of colorful integration logos (PostgreSQL, MongoDB, etc.) visible in the 'Connect data' product screenshot. Each icon is a rounded square with the brand's native color. This is product UI content, not design system chrome.

## Do's and Don'ts

### Do
- Use Electric Cobalt #244cff exclusively for primary action fills — never as a decorative element or text color
- Set all buttons to pill radius (100px) for both the cobalt primary and obsidian dark variants
- Keep headlines at Inter weight 400 — authority comes from size (38px section, 60px display), not weight
- Use Parchment #f7f7f1 as the page canvas for all marketing pages; reserve Snow #ffffff for elevated cards and containers
- Embed dark-mode product screenshots (#1d1f21 surface) as visual anchors inside the light page — this light-dark contrast is the signature
- Apply Inter font features "cv03", "cv04", "cv09", "cv11" to get the alternate glyph sets that distinguish Mage's Inter from default Inter
- Use 6px radius for cards and product thumbnails, 16px for larger image containers, 100px (pill) for all interactive controls

### Don't
- Do not use multiple vivid colors as action buttons — the system has one action color (cobalt) and one dark variant; everything else is text or surface
- Do not set headlines to weight 600 or 700 — the whisper-weight 400 at large size is the signature; bolding breaks the editorial tone
- Do not add drop shadows to cards on the Parchment canvas — the warm tonal contrast between #f7f7f1 and #ffffff is enough separation
- Do not use the illustration palette colors (#fcc2cd, #fced9f, #ba9ffc) as UI chrome — they are reserved for the hero artwork and decorative card washes
- Do not mix Light Slate Blue #5487a1 or Amber #9e770b into text or border roles — they are illustration-only accents
- Do not use sharp corners (0px radius) on cards or images — the 6px minimum radius is a system-wide baseline
- Do not put body text below 14px — the Inter 12px usage is limited to micro-labels and metadata, never running prose

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment | `#f7f7f1` | Page canvas — the warm off-white base of all marketing pages |
| 1 | Snow | `#ffffff` | Card surfaces, elevated containers, product thumbnails |
| 2 | Ice Wash | `#e8f8ff` | Tinted card surface for differentiated sections (logo trust bar, feature callouts) |
| 3 | Obsidian | `#1d1f21` | Dark-mode product UI — the code editor and pipeline builder embedded as screenshots |

## Imagery

Hero features a large custom illustration: 3-4 illustrated characters in colorful casual clothing (coral pants, yellow tops, purple overalls) interacting with a central blue spherical data object with circuit-board patterns. The illustration uses the brand's decorative palette (lavender, azure, blush, buttercream) and occupies the right half of the hero. Product screenshots are dark-mode (graphite sidebar + code editor) with vibrant integration logos in a grid. No photography. No abstract gradients or 3D renders beyond the illustration. Icon style in the UI is a mix: product UI uses small monospace-style code icons; the illustration uses flat filled shapes with no outlines.

## Layout

Max-width 1200px centered content. Hero is a two-column split: left ~40% holds headline + subtext + CTAs + a dark product video thumbnail stacked vertically; right ~55% holds the full-color illustration. Below the hero, a full-width trust logo bar spans the content width. Feature sections use a 2x2 grid: each cell has a heading + subtext on top, dark product screenshot below with 6px radius. The page alternates between warm-canvas sections and slightly different surface tints (Ice Wash) for visual separation. Navigation is a simple top bar with left-aligned logo + links, right-aligned CTA pair. No sidebar, no mega-menu. Section gaps are generous (~64px) creating a comfortable editorial rhythm rather than a dense product-grid feel.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #f7f7f1 (Parchment)
- Card surface: #ffffff (Snow)
- Tinted surface: #e8f8ff (Ice Wash)
- Primary text: #000000 / #2b2b2b
- Muted text: #878787 / #b0b0b0
- Accent: #244cff (Electric Cobalt)
- Dark surface: #1d1f21 (Obsidian)
- primary action: no distinct CTA color

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Create a feature card**: No card background (sits on Parchment). Section heading at 38px Inter Variable weight 400, #000000. Subtitle at 16px Inter 400, #2b2b2b. Dark product screenshot below with 6px border-radius, 24px internal padding, showing a code editor with dark sidebar.


4. **Create a navigation bar**: Transparent over Parchment. Left: logo + 5 nav links in Inter 500 at 15px, #000000. Right: 'Demo' ghost text link (#2b2b2b) + dark 'Try Mage' pill button (#1d1f21 background, white text, 8px 16px padding, 100px radius).

5. **Create a trust logo bar**: Full-width Parchment background. Caption 'Trusted by data teams' at 14px Inter 400, #878787. Row of 7 company logos in #000000, evenly spaced, max-height 24px each, with 10px gap between logos.

## Similar Brands

- **Vercel** — Same single-accent-plus-black approach with whisper-weight headlines and a warm off-white canvas; both use a dark-mode product surface inside a light marketing page
- **Linear** — Similar pill-radius buttons, generous whitespace, Inter typography at restrained weights, and a dark product island embedded in light marketing context
- **Airplane** — Same warm off-white canvas, Inter type system, single vivid accent color for primary actions, and dark-mode product screenshots as feature anchors
- **PlanetScale** — Light editorial canvas with dark product UI previews, generous section spacing, and a single saturated brand color for action
- **Modal** — Similar data-platform identity with light parchment-toned pages, custom illustration as hero centerpiece, and dark product UI as feature evidence

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #244cff;
  --color-lavender-mist: #c3aeff;
  --color-parchment: #f7f7f1;
  --color-snow: #ffffff;
  --color-ice-wash: #e8f8ff;
  --color-sky-tint: #d6f2ff;
  --color-lemon-wash: #ffffbd;
  --color-blush: #fcc2cd;
  --color-buttercream: #fced9f;
  --color-azure: #3388ff;
  --color-slate-blue: #5487a1;
  --color-amber: #9e770b;
  --color-lilac-pop: #ba9ffc;
  --color-deep-cobalt: #294dba;
  --color-pure-black: #000000;
  --color-graphite: #2b2b2b;
  --color-obsidian: #1d1f21;
  --color-ash: #878787;
  --color-fog: #b0b0b0;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 30px;
  --leading-heading: 1.4;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.3;
  --text-display: 60px;
  --leading-display: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24-40px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-images: 16px;
  --radius-buttons: 100px;
  --radius-largesurfaces: 12px;

  /* Surfaces */
  --surface-parchment: #f7f7f1;
  --surface-snow: #ffffff;
  --surface-ice-wash: #e8f8ff;
  --surface-obsidian: #1d1f21;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #244cff;
  --color-lavender-mist: #c3aeff;
  --color-parchment: #f7f7f1;
  --color-snow: #ffffff;
  --color-ice-wash: #e8f8ff;
  --color-sky-tint: #d6f2ff;
  --color-lemon-wash: #ffffbd;
  --color-blush: #fcc2cd;
  --color-buttercream: #fced9f;
  --color-azure: #3388ff;
  --color-slate-blue: #5487a1;
  --color-amber: #9e770b;
  --color-lilac-pop: #ba9ffc;
  --color-deep-cobalt: #294dba;
  --color-pure-black: #000000;
  --color-graphite: #2b2b2b;
  --color-obsidian: #1d1f21;
  --color-ash: #878787;
  --color-fog: #b0b0b0;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 30px;
  --leading-heading: 1.4;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.3;
  --text-display: 60px;
  --leading-display: 1.3;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 100px;
}
```
