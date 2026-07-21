# Udemy — Style Reference
> Modern classroom whiteboard with violet ink.

**Theme:** light

Udemy reads as a calm, instructive marketplace: white canvas with soft cool-gray surfaces, a near-black ink scale for type, and two chromatic accents — a signature violet and a warm orange — that always appear as outlined borders or small marks rather than filled panels. Components are flat and lightweight, leaning on 8px radii and hairline borders instead of heavy elevation. A 3D-illustration vocabulary (soft clay-like product objects, isometric shapes, saturated accent pops) carries the personality, while the UI itself stays disciplined and instructional.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#2a2b3f` | `--color-ink` | Primary text, heading strokes, default icon strokes, body copy |
| Obsidian | `#202230` | `--color-obsidian` | Card backgrounds in dark sections, inverted surfaces, footer panel |
| Graphite | `#33364a` | `--color-graphite` | Body-level dark surfaces, secondary panel fills |
| Slate | `#3d4055` | `--color-slate` | Card borders and muted dark backgrounds |
| Steel | `#595c73` | `--color-steel` | Muted text, heading accents, low-emphasis borders |
| Fog | `#9194ac` | `--color-fog` | Helper text, hairline borders, disabled strokes |
| Mist | `#b7b9cd` | `--color-mist` | Card outlines, subtle dividers on light surfaces |
| Chalk | `#d1d2e0` | `--color-chalk` | Light borders, icon strokes on white, card edges |
| Porcelain | `#e9eaf2` | `--color-porcelain` | Page background, secondary surface, button ghost fills |
| Paper | `#f6f7f9` | `--color-paper` | Off-white panel surface between white and porcelain |
| Canvas | `#ffffff` | `--color-canvas` | Card surface, button text on dark, primary surface |
| Aubergine | `#6d28d2` | `--color-aubergine` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Lavender Haze | `#c0c4fc` | `--color-lavender-haze` | Tinted link hover, soft violet highlight wash, light brand surface |
| Ember | `#c4710d` | `--color-ember` | Secondary accent — badge borders, callout borders, warm icon accent |

## Tokens — Typography

### Udemy Sans — Single-family system: weight 700 for display headlines, 500 for subheadings and nav labels, 400 for body and UI, 300 sparingly for muted large text. The custom face has open apertures and a humanist x-height — it reads as instructional, not corporate. · `--font-udemy-sans`
- **Substitute:** Inter, Source Sans 3, IBM Plex Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 32px
- **Line height:** 1.10, 1.20, 1.40, 1.50, 1.60
- **Role:** Single-family system: weight 700 for display headlines, 500 for subheadings and nav labels, 400 for body and UI, 300 sparingly for muted large text. The custom face has open apertures and a humanist x-height — it reads as instructional, not corporate.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.6 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.4 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 1000px |
| inputs | 4px |
| buttons | 8px |
| largeCards | 16px |
| featureCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `oklch(0.6295 0.0204 306.5 / 0.08) 0px 2px 8px 0px, oklch(...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Outlined Violet Action
**Role:** Primary action trigger

Transparent fill, 1.5px #6d28d2 border, 8px radius, 12px 24px padding. Label in Udemy Sans 16px weight 500, #6d28d2. On hover a double-layer cool shadow appears. This is the signature control — the brand speaks through outline, not fill.

### Solid Dark Action
**Role:** Inverse action on light surfaces

#202230 fill, white text weight 500 at 16px, 8px radius, 12px 24px padding. Used sparingly where the outlined violet would lose contrast against a colored illustration.

### Ghost Neutral Button
**Role:** Secondary text action

Transparent fill, 1px #d1d2e0 border, 8px radius, 12px 20px padding, label #2a2b3f weight 500 16px.

### Pill Search Field
**Role:** Hero-level search

Full-width white pill at 1000px radius, 48px tall, magnifier icon at left in #2a2b3f, placeholder #9194ac, 1px #d1d2e0 border, 16px horizontal padding.

### Text Input
**Role:** Form input

White fill, 4px radius, 1px #d1d2e0 border, 16px text, 12px 16px padding. Focus ring shifts to 1.5px #6d28d2.

### Category Card
**Role:** Topic landing tile

16px radius, white surface, 0px top padding with full-bleed illustration, then 24px bottom padding for label and arrow. 1px #d1d2e0 border, 8px inner image radius. Label is 18px weight 500 #2a2b3f.

### Course Thumbnail Card
**Role:** Course listing tile

8px radius, white fill, 1px #e9eaf2 border. Top half is a 16:9 image with top corners matched, bottom half has 16px padding with title 16px weight 500 and instructor 14px weight 400 #595c73.

### Testimonial Card
**Role:** Social proof block

White surface, 8px radius, 24px padding, no border. Large violet quotation glyph top-left at 32px, quote text 16px weight 400 #2a2b3f, author block with 40px avatar + name 14px weight 500 + role 14px weight 400 #595c73, and a violet arrow link at bottom.

### Certification Provider Card
**Role:** Certification upsell tile

On dark #202230 panel. Image fills top with 16px radius, 24px padding below with provider name 18px weight 700 white, topic 14px weight 400 #b7b9cd.

### Pagination Indicator
**Role:** Carousel page control

Pill at 1000px radius, 24px wide x 6px tall, #6d28d2 fill for active state, #d1d2e0 for inactive. Surrounded by 40px circular ghost prev/next buttons with #2a2b3f chevrons.

### Logo Lockup
**Role:** Brand mark

Lowercase wordmark 'udemy' in Udemy Sans 24px weight 700, #2a2b3f, preceded by a rounded-square violet badge with white 'U' glyph. Icon and wordmark share a 28px cap height.

### Footer Link List
**Role:** Site directory

Vertical list, 8px row gap, each item 14px weight 400 #595c73, hover transitions to #2a2b3f.

### Dark Hero Band
**Role:** Section inversion

#202230 full-bleed band with 48px vertical padding. Internal card at 16px radius, #33364a fill, hosts image placeholder on right and text stack on left with 32px gap.

## Do's and Don'ts

### Do
- Use outlined violet #6d28d2 with 1.5px stroke as the primary action treatment — never a flooded fill.
- Set page background to #e9eaf2 and card surfaces to #ffffff; band intermediate sections in #f6f7f9.
- Use 8px radius for buttons and small cards, 16px for feature cards, 1000px for pills and search.
- Keep type to one family (Udemy Sans / Inter) and use weight 700 for display, 500 for subheadings and nav, 400 for body, 300 only for muted large text.
- Reach for 1px #d1d2e0 or #e9eaf2 borders before adding shadow; reserve the double-layer cool shadow for hover and lift states.
- Pair the violet Aubergine with the warm Ember #c4710d as a secondary accent — never introduce a third chromatic hue.
- Maintain 24px card padding and 16px element gap as the default interior rhythm.

### Don't
- Don't fill buttons with #6d28d2 — the brand voice comes from outline, not flood.
- Don't use solid #6d28d2 as a panel background; reserve violet for stroke, icon, and small marks.
- Don't add gradients — the surface language is flat and instructional.
- Don't mix radii on the same component class: all standard buttons share 8px, all pills share 1000px.
- Don't introduce a third type family; the single-family discipline is part of the identity.
- Don't apply warm orange #c4710d to body text or large fills — keep it to badge borders and small icon accents.
- Don't use pure #000 or #fff for surfaces — use #2a2b3f for ink and #e9eaf2 for canvas to preserve the cool instructional tone.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e9eaf2` | Page background |
| 1 | Paper | `#f6f7f9` | Soft banded sections between cards |
| 2 | Card | `#ffffff` | Card surfaces, input fills, raised content |
| 3 | Inverted Panel | `#202230` | Dark hero/banner sections, certification blocks |

## Elevation

- **Button hover, card lift:** `oklch(0.6295 0.0204 306.5 / 0.08) 0px 2px 8px 0px, oklch(0.6295 0.0204 306.5 / 0.12) 0px 4px 16px 0px`

## Imagery

Illustration-driven, not photographic. 3D clay-like renders dominate category cards: geometric solids, isometric phones and tablets, oversized hands holding objects, a golden trophy, confetti on white. Tiles use saturated local color (teal, red, gold, cobalt) on neutral beige backdrops. Course thumbnails mix portrait photography (instructor headshots in context) with product-screenshot mockups. Imagery is always contained inside 8–16px rounded cards — never full-bleed hero photography. Icon style is mono-stroke line icons at 1.5px weight, typically in #2a2b3f on white, with the violet Aubergine reserved for active and brand-marked icons.

## Layout

Max-width 1200px centered content column on a #e9eaf2 canvas. Hero is a top-anchored search bar with a large brand wordmark at left, followed by a 2-column band: a left text block describing the value prop and a right 3D-illustration placeholder. Below, a 3-column category grid with carousel pagination, then a single dark #202230 hero band for course content, then a 4-column testimonial grid, then another dark band for certification providers, then a multi-column footer. Vertical rhythm uses 48px between major sections, 24px within cards, 16px between list items. Navigation is a minimal top bar with a search field, login link, and outlined action — no mega-menu, no sidebar.

## Agent Prompt Guide

Quick Color Reference:
- text: #2a2b3f
- background: #e9eaf2
- card surface: #ffffff
- border: #d1d2e0
- accent: #6d28d2 (Aubergine violet)
- secondary accent: #c4710d (Ember)
- primary action: #6d28d2 (outlined action border)

Example Component Prompts:

1. Outlined Violet Action Button: 12px 24px padding, 8px radius, transparent fill, 1.5px #6d28d2 border, label 'Enroll now' in Udemy Sans 16px weight 500 #6d28d2. On hover add the double-layer cool shadow: oklch(0.6295 0.0204 306.5 / 0.08) 0px 2px 8px 0px, oklch(0.6295 0.0204 306.5 / 0.12) 0px 4px 16px 0px.

2. Category Card: White #ffffff surface, 16px radius, 1px #d1d2e0 border. Top half is a 16:9 illustration placeholder, bottom 24px padding holds 'Generative AI' label in 18px weight 500 #2a2b3f and a right arrow in #2a2b3f.

3. Testimonial Card: White #ffffff, 8px radius, no border, 24px padding. Opening quote glyph at 32px #6d28d2, quote body 16px weight 400 #2a2b3f, 40px circular avatar, author name 14px weight 500 #2a2b3f, role 14px weight 400 #595c73, footer link 'View course →' in 14px weight 500 #6d28d2.

4. Dark Hero Band: Full-width #202230 panel, 48px vertical padding, internal card at 16px radius with #33364a fill. Left column has heading 32px weight 700 white over subtext 16px weight 400 #b7b9cd. Right column is a #2a2b3f image placeholder block.

5. Pill Search Field: 1000px radius, 48px tall, white #ffffff fill, 1px #d1d2e0 border, magnifier icon #2a2b3f at left 16px, placeholder 'Search for anything' in 16px weight 400 #9194ac, spans full content width.

## Similar Brands

- **Coursera** — Same light-canvas marketplace layout with 3D-illustration category cards, though Coursera leans more photographic and uses blue rather than violet.
- **Skillshare** — Equal emphasis on outlined-not-filled action language and a single chromatic accent (Skillshare's teal, Udemy's violet) over a neutral ink scale.
- **Notion** — Shares the quiet 8px-radius card grammar, minimal elevation, and white-on-cool-gray surface stack.
- **Duolingo** — Both lean on custom type, one chromatic brand color used sparingly, and dark-panel section inversions to break up light marketplaces.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #2a2b3f;
  --color-obsidian: #202230;
  --color-graphite: #33364a;
  --color-slate: #3d4055;
  --color-steel: #595c73;
  --color-fog: #9194ac;
  --color-mist: #b7b9cd;
  --color-chalk: #d1d2e0;
  --color-porcelain: #e9eaf2;
  --color-paper: #f6f7f9;
  --color-canvas: #ffffff;
  --color-aubergine: #6d28d2;
  --color-lavender-haze: #c0c4fc;
  --color-ember: #c4710d;

  /* Typography — Font Families */
  --font-udemy-sans: 'Udemy Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 1000px;
  --radius-inputs: 4px;
  --radius-buttons: 8px;
  --radius-largecards: 16px;
  --radius-featurecards: 24px;

  /* Shadows */
  --shadow-sm: oklch(0.6295 0.0204 306.5 / 0.08) 0px 2px 8px 0px, oklch(0.6295 0.0204 306.5 / 0.12) 0px 4px 16px 0px;

  /* Surfaces */
  --surface-canvas: #e9eaf2;
  --surface-paper: #f6f7f9;
  --surface-card: #ffffff;
  --surface-inverted-panel: #202230;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #2a2b3f;
  --color-obsidian: #202230;
  --color-graphite: #33364a;
  --color-slate: #3d4055;
  --color-steel: #595c73;
  --color-fog: #9194ac;
  --color-mist: #b7b9cd;
  --color-chalk: #d1d2e0;
  --color-porcelain: #e9eaf2;
  --color-paper: #f6f7f9;
  --color-canvas: #ffffff;
  --color-aubergine: #6d28d2;
  --color-lavender-haze: #c0c4fc;
  --color-ember: #c4710d;

  /* Typography */
  --font-udemy-sans: 'Udemy Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 1000px;

  /* Shadows */
  --shadow-sm: oklch(0.6295 0.0204 306.5 / 0.08) 0px 2px 8px 0px, oklch(0.6295 0.0204 306.5 / 0.12) 0px 4px 16px 0px;
}
```
