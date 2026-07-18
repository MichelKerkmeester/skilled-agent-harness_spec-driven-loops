# Rains INT — Style Reference
> Nordic rain catalog on fog-gray paper.

A Scandinavian weather report where massive editorial type sits over raincoat photography on a warm gray field — almost no color, all atmosphere, type as the only dramatic gesture.

**Theme:** light

Rains operates in a near-monochromatic Scandinavian editorial register: a warm off-white canvas (not clinical white), a single charcoal accent for interactive surfaces, and photography that does all the emotional work. The defining signature is typographic scale — headlines reach 200+ pixels and sit directly over full-bleed product photography, with line-heights compressed to ~0.9 so massive type locks into tight visual bands. UI chrome is deliberately spare: pill buttons, hairline borders, no shadows, no gradients, no color. The single chromatic moment is a pale butter-cream hero text (#fffb85) that breaks the grayscale without breaking the quiet. Every screen should feel like a printed fashion catalog: generous breathing room, product-first imagery, and type that whispers and shouts in the same family.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fog | `#efefef` | `--color-fog` | Page canvas, card surfaces, divider hairlines — the warm light gray that IS the page background |
| Ink | `#10100f` | `--color-ink` | Primary text, nav links, body copy, icon strokes — near-black with a barely-warm bias (never pure #000) |
| Paper | `#ffffff` | `--color-paper` | Card surfaces over the gray canvas, text on dark buttons, product image backgrounds |
| Charcoal | `#26292a` | `--color-charcoal` | Filled button background, active states, inverted UI surfaces — warm-tinted dark, never pure black |
| Graphite | `#40403f` | `--color-graphite` | Secondary button fill, subtle dark UI accents |
| Ash | `#b3b3b2` | `--color-ash` | Muted helper text, tertiary metadata, inactive nav items |
| Black | `#000000` | `--color-black` | Pure black for SVG icon fills and the occasional hard edge — functional, not brand |
| Butter Cream | `#fffb85` | `--color-butter-cream` | Hero display text accent — the single chromatic voice on the page, used only on oversized seasonal headlines over photography |

## Tokens — Typography

### EuropaGroNr2SH — Headings, display statements, nav items, body emphasis — the hero font. Used at 232–245px with weight 400 and line-height 0.90 for the signature oversized editorial type. The ultra-tight leading locks massive letters into a single visual band. Subheads drop to 32–48px at weight 600–700. · `--font-europagronr2sh`
- **Substitute:** Neue Haas Grotesk Display, Space Grotesk, Inter
- **Weights:** 400, 600, 700
- **Sizes:** 14, 16, 20, 32, 40, 48, 232, 245
- **Line height:** 0.90–1.20
- **Letter spacing:** normal
- **Role:** Headings, display statements, nav items, body emphasis — the hero font. Used at 232–245px with weight 400 and line-height 0.90 for the signature oversized editorial type. The ultra-tight leading locks massive letters into a single visual band. Subheads drop to 32–48px at weight 600–700.

### EuropaGroNr2SB — Small UI text, nav labels, button copy, captions, footer micro-copy. The functional sans — quiet, compact, only at 12–14px. The deliberate size gap between this and EuropaGroNr2SH creates a clear voice split: small = system, large = editorial. · `--font-europagronr2sb`
- **Substitute:** Inter, DM Sans, Söhne
- **Weights:** 400
- **Sizes:** 12, 14
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Small UI text, nav labels, button copy, captions, footer micro-copy. The functional sans — quiet, compact, only at 12–14px. The deliberate size gap between this and EuropaGroNr2SH creates a clear voice split: small = system, large = editorial.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 20px | 1.02 | — | `--text-subheading` |
| heading-sm | 32px | 1.02 | — | `--text-heading-sm` |
| heading | 40px | 1 | — | `--text-heading` |
| heading-lg | 48px | 1 | — | `--text-heading-lg` |
| display | 245px | 0.9 | — | `--text-display` |

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
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48-56px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Pill Button (Filled Dark)
**Role:** Primary action button on light backgrounds

Charcoal #26292a fill, white #ffffff text, 9999px border-radius, 12px vertical and 32px horizontal padding, EuropaGroNr2SB 14px weight 400. No shadow, no border, no hover lift. The dark-on-pill is the only filled button in the system.

### Pill Button (Outlined)
**Role:** Secondary action on light backgrounds

Transparent fill, #10100f 1px border, #10100f text, 9999px border-radius, same 12×32 padding as filled. Shares identical geometry — only fill distinguishes primary from secondary.

### Pill Button (On Image)
**Role:** Hero or category card CTA

Charcoal #26292a fill, white text, pill radius, sits over product photography. The dark fill provides contrast against light-toned product shots without requiring opacity tricks.

### Category Split Card
**Role:** Men/Women category entry on homepage

Full-bleed product photograph filling 50% viewport width, no padding or card chrome, white EuropaGroNr2SH text overlay (weight 600, ~40px) positioned bottom-left. No border, no radius, no shadow — the image IS the card.

### Product Card
**Role:** Individual product listing in grid

Full-bleed product image on #efefef canvas, no card border or background, no padding around image. Product name and price appear below image in EuropaGroNr2SB 14px. Zero chrome — the photograph provides all visual weight.

### Product Grid
**Role:** 3-column product showcase

Three equal columns at desktop, each card fills its column edge-to-edge with no gap between image and label. White space between columns comes from the gray canvas showing through, not from padding.

### Hero Section
**Role:** Seasonal campaign entry with oversized editorial type

Full-bleed product photography as background, Butter Cream #fffb85 display text at 232–245px (EuropaGroNr2SH weight 400, line-height 0.90) positioned over the image, white subtext below, two pill CTAs at bottom-left. The text color is the only chromatic moment in the entire design system.

### Top Navigation
**Role:** Primary site navigation

Transparent or #efefef background, all links left-aligned (brand mark + categories: NEWIN, WOMEN, MEN, BAGS, ACCESSORIES, HOME AWAY, RAINS WORLD), search and cart right-aligned. EuropaGroNr2SB 14px uppercase, #10100f, 32px horizontal padding on nav items. No background bar, no border, no shadow.

### Footer
**Role:** Site footer with link columns

Sits on #efefef canvas, 80px top padding, EuropaGroNr2SB 12–14px text in #10100f, organized in multi-column link groups. Generous spacing, no background color change, no dividers between columns.

### Search Trigger
**Role:** Search button in nav

Pill-shaped (9999px) with magnifying glass icon and 'SEARCH' label, EuropaGroNr2SB 14px, #10100f, transparent background. Sits in top-right nav.

### Cart Trigger
**Role:** Cart button in nav

Pill-shaped (9999px) with bag icon, 'CART' label and item count '(0)', EuropaGroNr2SB 14px, #10100f, transparent background. Sits in top-right nav beside search.

## Do's and Don'ts

### Do
- Use EuropaGroNr2SH for all display and heading text — never substitute a different display face; the 232–245px scale with 0.90 line-height is the signature
- Set border-radius to 9999px on every button, tag, and pill-shaped control — sharp corners are not in this system
- Keep the palette to fog, ink, paper, and charcoal for all UI chrome — let photography provide the only visual richness
- Use #fffb85 exclusively for oversized hero display text over photography — never for buttons, links, or small UI text
- Let product images fill their containers edge-to-edge with no card borders, no padding, and no shadows
- Space sections at 48–56px and let the gray canvas carry the rhythm between content blocks
- Use weight 400 for display headlines at maximum scale — the whisper-weight at 245px creates authority through restraint, not volume

### Don't
- Do not introduce saturated accent colors (reds, blues, greens) into the UI — the 1% colorfulness is deliberate
- Do not apply box-shadows, drop-shadows, or gradient fills to any component — the system is completely flat
- Do not use sharp or moderately rounded corners on buttons or interactive elements — only 9999px or 0px exist
- Do not use pure #000000 for text — use #10100f; the near-black warmth is a design choice, not a compromise
- Do not place body text directly over product photography without sufficient contrast or a dark scrim
- Do not break the two-font split: EuropaGroNr2SB for 12–14px system text, EuropaGroNr2SH for 16px and above — mixing sizes across fonts fragments the voice
- Do not add decorative borders, dividers, or background tints to card components — the photograph and gray canvas define all visual structure

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#efefef` | Page background — the warm off-white that defines the entire visual field |
| 2 | Card | `#ffffff` | Product card surfaces and inverted text on dark buttons |
| 3 | Inverted | `#26292a` | Filled button background, interactive dark surfaces |

## Elevation

This system is completely flat. No box-shadows, no drop-shadows, no gradient lifts, no z-axis elevation. Visual hierarchy is created through typography scale, generous spacing, and the contrast between the gray canvas and full-bleed photography — not through depth. Components sit on the same plane as the page itself.

## Imagery

Full-bleed editorial fashion photography is the dominant visual element. Product shots fill their containers edge-to-edge with no borders, padding, or decorative framing. Models are shown in studio environments against neutral or urban backdrops, wearing the garments as the sole focus. No lifestyle context beyond the clothing itself. Photography is high-key, evenly lit, with natural color rendering — no duotone, no desaturation filters. The images are the only source of color saturation on the page. Category cards and hero sections use the same photography treatment at larger scale, with type overlaid directly on the image.

## Layout

Full-bleed layout with no max-width constraint on imagery — product photos span the full viewport width. The navigation is a single minimal top bar with all elements left-aligned and search/cart right-aligned, no background fill, no border below. The hero is a full-viewport-height editorial image with massive display type (245px) overlaid and two pill CTAs anchored bottom-left. Below the hero, a 50/50 split-card section divides Women and Men categories as edge-to-edge image pairs. Product showcases use a 3-column equal grid with no gaps between image and label, the gray canvas providing column separation. Section spacing is generous (48–56px) and rhythm is maintained through consistent vertical cadence rather than alternating background colors. The footer continues the same #efefef canvas with generous top padding.

## Agent Prompt Guide

**Quick Color Reference**
- text: #10100f
- background: #efefef
- surface/card: #ffffff
- border: #efefef
- primary action: #26292a (filled action)
- hero accent: #fffb85

**3-5 Example Component Prompts**

1. *Hero Section*: Full-viewport-height product photograph as background. Display headline at 245px EuropaGroNr2SH weight 400, color #fffb85, line-height 0.90, positioned center-left. Subtext at 20px weight 400, #ffffff, below headline. Two pill CTAs at bottom-left: first filled #26292a with white text 14px, second outlined 1px #ffffff border with white text 14px. Both buttons at 9999px radius, 12px vertical / 32px horizontal padding.

2. *Category Split Card (50/50)*: Full-bleed product photograph filling left or right half of viewport, edge-to-edge, no border or padding. Overlay text 'Shop Women' or 'Shop Men' at bottom-left in EuropaGroNr2SH 40px weight 600, color #ffffff, with 20px left and bottom margin from image edge.

3. *Product Card in 3-Column Grid*: Product image filling full column width, edge-to-edge, no padding, no border, no shadow. Below image: product name at 14px EuropaGroNr2SB weight 400, #10100f, and price on the same line right-aligned at 14px. No card background color — the #efefef canvas shows through.

4. *Pill Button (Filled)*: Background #26292a, text at 14px EuropaGroNr2SB weight 400, color #ffffff, padding 12px vertical / 32px horizontal, border-radius 9999px, no border, no shadow, no hover transition beyond color shift to #40403f.

5. *Top Navigation*: Single row, #efefef or transparent background, no bottom border. Brand mark 'RAINS' at far left in EuropaGroNr2SB 14px. Nav links NEWIN, WOMEN, MEN, BAGS, ACCESSORIES, HOME AWAY, RAINS WORLD left-aligned with 32px left padding each, 14px uppercase #10100f. Search and Cart pill buttons at far right, 9999px radius, transparent fill, #10100f icon and label, 14px.

## Similar Brands

- **COS** — Same Scandinavian minimalism with oversized editorial type, nearly monochromatic palette, and pill-shaped CTA buttons over full-bleed fashion photography
- **Stutterheim** — Fellow Nordic rainwear brand sharing the gray canvas, massive display headlines, and zero-color UI approach
- **Our Legacy** — Similar restrained grayscale palette, small functional type for nav, and editorial fashion photography as the sole color source
- **Arc'teryx Veilance** — Product-first minimalism with technical outerwear photography, no decorative shadows, and a near-monochrome interface
- **Toteme** — Same typographic confidence at extreme scale, warm off-white canvas, and pill-button navigation with zero color accents

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fog: #efefef;
  --color-ink: #10100f;
  --color-paper: #ffffff;
  --color-charcoal: #26292a;
  --color-graphite: #40403f;
  --color-ash: #b3b3b2;
  --color-black: #000000;
  --color-butter-cream: #fffb85;

  /* Typography — Font Families */
  --font-europagronr2sh: 'EuropaGroNr2SH', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-europagronr2sb: 'EuropaGroNr2SB', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.02;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.02;
  --text-heading: 40px;
  --leading-heading: 1;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-display: 245px;
  --leading-display: 0.9;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-56: 56px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48-56px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #efefef;
  --surface-card: #ffffff;
  --surface-inverted: #26292a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fog: #efefef;
  --color-ink: #10100f;
  --color-paper: #ffffff;
  --color-charcoal: #26292a;
  --color-graphite: #40403f;
  --color-ash: #b3b3b2;
  --color-black: #000000;
  --color-butter-cream: #fffb85;

  /* Typography */
  --font-europagronr2sh: 'EuropaGroNr2SH', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-europagronr2sb: 'EuropaGroNr2SB', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.02;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.02;
  --text-heading: 40px;
  --leading-heading: 1;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-display: 245px;
  --leading-display: 0.9;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
