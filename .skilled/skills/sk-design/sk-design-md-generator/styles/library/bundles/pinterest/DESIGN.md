# Pinterest — Style Reference
> A pinboard under warm gallery light — white walls, one bold red thumbtack, everything else quietly waiting to be discovered.

**Theme:** light

Pinterest operates as a bright, gallery-lit scrapbook: white canvas, near-black text in a custom geometric sans, and one unmistakable red that acts as the only functional signal in an otherwise quiet interface. The visual rhythm is built on oversized rounded corners (16-40px), generous breathing room between elements (16-32px gaps), and a typography attitude that uses size and italic weight — not color — to create hierarchy. Secondary hues (violet, orange, blue) appear as small decorative punctuation inside illustrated cards and image treatments, never on chrome or controls. Components feel lightweight and playful: tilted photo cards, pill-shaped search and filters, a flat red CTA, and a single high-contrast accent for emphasis. The system reads as approachable discovery, not utility — surfaces stay matte, elevation stays minimal, and personality comes from layout composition rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pin Red | `#e60023` | `--color-pin-red` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink Plum | `#211922` | `--color-ink-plum` | Primary text, logo wordmark, filled dark buttons — a warm near-black that reads softer than pure #000 |
| Gallery White | `#ffffff` | `--color-gallery-white` | Page canvas, card surfaces, button text on dark fills, search field background |
| Fog Gray | `#666666` | `--color-fog-gray` | Secondary text, nav labels, icon strokes at rest, helper copy |
| Stone Gray | `#8c8c8c` | `--color-stone-gray` | Input placeholders, input borders, disabled hairlines |
| Linen | `#e5e5e0` | `--color-linen` | Subtle section bands, ghost button borders, soft surface tint for alternating blocks |
| Charcoal | `#000000` | `--color-charcoal` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Halo Yellow | `#fffd92` | `--color-halo-yellow` | Highlight wash behind emphasis moments, sticker-style accent in illustrated cards |
| Ember Coral | `#fa5f2e` | `--color-ember-coral` | Decorative image accent, filter chip color, illustrated card warm fill |
| Lavender Veil | `#9270d7` | `--color-lavender-veil` | Decorative image accent, highlighted word in headlines, illustrated card cool fill — the secondary brand color that softens the red |
| Link Cobalt | `#2b48d4` | `--color-link-cobalt` | Inline link text, focusable content links |

## Tokens — Typography

### Pin Sans — Sole typeface for the entire system — nav, body, buttons, headlines, display. Geometric humanist sans with a tall x-height and open apertures. · `--font-pin-sans`
- **Substitute:** Inter, DM Sans, or Noto Sans as free fallbacks
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 12, 14, 16, 20, 32, 38, 50, 70
- **Line height:** 1.0, 1.2, 1.4, 1.5
- **Letter spacing:** -0.0370em across all sizes (slight tightening applied globally)
- **OpenType features:** `"ss01" on if available, default numerals`
- **Role:** Sole typeface for the entire system — nav, body, buttons, headlines, display. Geometric humanist sans with a tall x-height and open apertures.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.44px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.52px | `--text-body-sm` |
| body | 16px | 1.5 | -0.59px | `--text-body` |
| subheading | 20px | 1.4 | -0.74px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -1.18px | `--text-heading-sm` |
| heading | 38px | 1.2 | -1.41px | `--text-heading` |
| heading-lg | 50px | 1.1 | -1.85px | `--text-heading-lg` |
| display | 70px | 1 | -2.59px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| cards | 20-40px |
| pills | 9999px |
| inputs | 16px |
| buttons | 16px |
| imageCards | 32px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 16-24px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Sticky header with brand mark, primary search, and account actions

White background, 64px height, no shadow. Logo (red P glyph + black wordmark) at far left, Explore nav link, full-width pill search field with #e5e5e0 fill, text nav items in Ink Plum 16px/500, terminated by a filled red Log in button (16px radius) and a ghost Sign up button (transparent fill, 1px Ink Plum border, 16px radius).

### Primary Search Field
**Role:** Hero search affordance, always pill-shaped and dominant in the nav

Width fills available nav space, height 48px, fill #e5e5e0, radius 16px, no border. Placeholder text 16px Pin Sans 400 in Stone Gray. Search icon at left in Fog Gray. No focus ring; instead the field brightens to #ffffff on focus with a 1px Stone Gray border.

### Filled Red CTA Button
**Role:** Sole high-emphasis action — sign up, join, continue

Fill #e60023, text #ffffff, Pin Sans 16px/600, horizontal padding 20px, vertical padding 12px, radius 16px. No shadow. Hover deepens to ~#b8001d. Used for Log in and Join Pinterest for free.

### Ghost Outline Button
**Role:** Secondary action paired beside a filled CTA

Transparent fill, 1px solid #211922 border, text #211922, same 16px radius and 12px/20px padding as filled CTA. Hover swaps to #211922 fill with #ffffff text.

### Ghost Text Link
**Role:** Tertiary inline action beside a CTA

No border, no fill. Pin Sans 16px/500 in Ink Plum with a 1px underline on hover. Used for "I already have an account".

### Hero Carousel Indicator Dots
**Role:** Pagination for the hero rotating image composition

Five dots, 8px diameter, 8px gap. Active dot is Ink Plum; inactive dots are Fog Gray at 40% opacity. No background container — sits directly on canvas.

### Hero Display Headline
**Role:** Two-tone display headline that carries the brand voice into the page

First line "Find ideas for" in Pin Sans 70px/900 Ink Plum, line-height 1.0. Second line repeats the pattern with a thematic phrase set in Lavender Veil (#9270d7) italic weight 900 — the second line color is the only non-red chromatic use at display size, and it must always feel like a highlight, not a link.

### Tilted Image Card Stack
**Role:** Hero visual — layered, slightly rotated photo cards creating depth

Three cards, each ~280px wide with 32px radius, alternating ±6° and ±12° rotation, overlapping with negative space. Top card carries a 48px lavender circular badge with a white sparkle/trend icon centered. No shadow; the tilt and overlap create depth.

### Feature Card Panel
**Role:** Product showcase container for feature explanations

Linen (#e5e5e0) fill, 40px radius, generous internal padding (32-48px). Contains a mock UI screenshot at 12px radius (mini-app) layered over it. No border, no shadow.

### Mock Search Bar
**Role:** In-product search illustration inside feature cards

White surface, 16px radius, 1px Stone Gray border, filter pill chips below in Ember Coral / Linen / Lavender Veil with text on the matching or contrasting shade. Chips themselves use 9999px radius and 8px/14px padding.

### Skin Tone Range Selector
**Role:** Horizontal swatch row for inclusive search refinement

Row of 6 square swatches, each ~36px, 8px radius, ranging light peach to deep brown. Active swatch gets a 2px Ink Plum outer ring (4px offset) indicating selection.

### Image Grid Card
**Role:** Content preview tiles inside feature panels

20px radius, no border, no shadow, native image fills the card. A 12px three-dot menu appears top-right on hover only.

### Section Heading + CTA Pair
**Role:** Right-side text block beside feature illustrations

Heading at 38px/700 Ink Plum, body at 16px/400 Fog Gray with 1.5 line-height, followed by a filled red CTA identical to the hero CTA. Right column max-width ~480px.

## Do's and Don'ts

### Do
- Use Pin Red (#e60023) as the only filled button color on the page — never substitute it for orange, coral, or any other warm hue.
- Round all controls (buttons, inputs, search, chips) at exactly 16px and all image cards at 20-40px; the radius gradient is the system's softness signature.
- Set display headlines at 50-70px weight 900 with -0.037em tracking; let size and weight carry hierarchy before reaching for color.
- Keep the canvas white (#ffffff) and use Linen (#e5e5e0) only for full-band alternation, never for individual cards.
- Rotate hero photo cards between ±6° and ±12° to create the scrapbook depth — flat grids break the mood.
- Place decorative accents (Lavender Veil, Ember Coral, Halo Yellow) only inside illustrated mock surfaces — never on nav, buttons, or borders.
- Reserve italic weight 900 in Lavender Veil for the second line of a two-line display headline as the brand's signature emphasis move.

### Don't
- Don't apply Pin Red to anything that isn't a filled CTA, the logo, or an active state — it loses power when overused.
- Don't use Charcoal (#000000) for body text; use Ink Plum (#211922) for a softer, on-brand near-black.
- Don't add shadows to buttons, cards, or nav — depth comes from radius, rotation, and overlap, not elevation.
- Don't use Link Cobalt (#2b48d4) for buttons or nav; it's strictly for inline content links.
- Don't set body text below 16px; the smallest functional size is 14px for helper copy, 12px for captions only.
- Don't introduce gradients, glows, or glassmorphism — the system is intentionally flat and matte.
- Don't combine more than two decorative accent colors in a single surface; the page reads as a calm gallery, not a mosaic.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-page background; the gallery wall |
| 1 | Linen Band | `#e5e5e0` | Soft alternation section, ghost-button background at rest |
| 2 | Halo Wash | `#fffd92` | Emphasis highlight under key copy or callouts |

## Elevation

The system avoids shadows entirely. Depth is communicated through oversized border-radius (16-40px), rotated overlapping cards, and tonal surface bands (white → Linen → Halo Yellow). This flat, paper-like treatment keeps the focus on the photographed content and reinforces the scrapbook metaphor.

## Imagery

Imagery is the primary content medium — large, rounded, tilted photographs of food, fashion, beauty, and lifestyle subjects on pure backgrounds or in natural settings. Photos are presented as rounded tiles (20-40px corners) with no border or frame, and are frequently layered at small rotations to create collage energy. Illustrative accents (sparkle badges, sticker-style chips) use the secondary accent palette (Lavender Veil, Ember Coral, Halo Yellow) as flat shapes. No gradients, no duotones, no overlaid text on photos. Icon style is filled and monochromatic in Ink Plum or white, with rounded geometry that matches Pin Sans's warmth.

## Layout

Full-width sticky white nav at 64px height. Hero uses an asymmetric two-column composition inside a 1200px max-width: left half is centered-left headline + CTA + carousel dots, right half is a tilted overlapping photo stack. Subsequent sections alternate white and Linen (#e5e5e0) full-bleed bands separated by 80-120px vertical rhythm. Feature sections use a mirrored asymmetric pattern (illustration left, text right) with the feature panel at 40px radius. Grids are 2-3 columns at most — Pinterest's landing avoids dense card matrices in favor of breathing room. Navigation is minimal: a horizontal text nav with no mega-menu, no sidebar.

## Agent Prompt Guide

## Quick Color Reference
- text: #211922 (Ink Plum)
- background: #ffffff (Gallery White)
- border: #8c8c8c (Stone Gray) or #e5e5e0 (Linen)
- accent: #9270d7 (Lavender Veil)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Top Nav**: White background, 64px tall, no shadow. Left: Pinterest logo (red P + black wordmark). Center: pill search field, #e5e5e0 fill, 16px radius, 48px height, 16px Pin Sans placeholder "Search for easy dinners, fashion, etc." in #8c8c8c. Right: "Log in" filled red button (#e60023 / #ffffff / 16px radius / 12px 20px) and "Sign up" ghost button (transparent / 1px #211922 border / 16px radius).
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
3. **Tilted Image Card Stack**: Three 280px photo cards with 32px radius, rotated -12°, +6°, -3°, overlapping with 24px offset. Top card wears a 48px circular #9270d7 badge with a white sparkle icon centered.
4. **Feature Panel**: 40px radius, #e5e5e0 fill, 32-48px internal padding. Contains a white mock search field (16px radius, 1px #8c8c8c border) and a row of 6 skin-tone swatches (36px, 8px radius, light peach to deep brown). Active swatch gets a 2px #211922 ring at 4px offset.

## Similar Brands

- **Behance** — Same discovery-feed identity, white-canvas layout, oversized rounded image cards, and a single accent color against monochrome chrome
- **Etsy** — Similar approachable marketplace tone, large rounded product imagery, red brand accent, and a serif-free custom sans for warmth
- **Unsplash** — Identical matte white gallery aesthetic, photo-as-hero content, generous border-radius on tiles, and minimal chrome around the imagery
- **Are.na** — Shares the scrapbook/curation sensibility — tilted cards, soft canvas, and decorative pastel accents layered over photographic content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pin-red: #e60023;
  --color-ink-plum: #211922;
  --color-gallery-white: #ffffff;
  --color-fog-gray: #666666;
  --color-stone-gray: #8c8c8c;
  --color-linen: #e5e5e0;
  --color-charcoal: #000000;
  --color-halo-yellow: #fffd92;
  --color-ember-coral: #fa5f2e;
  --color-lavender-veil: #9270d7;
  --color-link-cobalt: #2b48d4;

  /* Typography — Font Families */
  --font-pin-sans: 'Pin Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.44px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.52px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.59px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.74px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.18px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -1.41px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.85px;
  --text-display: 70px;
  --leading-display: 1;
  --tracking-display: -2.59px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 16-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 40px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-cards: 20-40px;
  --radius-pills: 9999px;
  --radius-inputs: 16px;
  --radius-buttons: 16px;
  --radius-imagecards: 32px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-linen-band: #e5e5e0;
  --surface-halo-wash: #fffd92;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pin-red: #e60023;
  --color-ink-plum: #211922;
  --color-gallery-white: #ffffff;
  --color-fog-gray: #666666;
  --color-stone-gray: #8c8c8c;
  --color-linen: #e5e5e0;
  --color-charcoal: #000000;
  --color-halo-yellow: #fffd92;
  --color-ember-coral: #fa5f2e;
  --color-lavender-veil: #9270d7;
  --color-link-cobalt: #2b48d4;

  /* Typography */
  --font-pin-sans: 'Pin Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.44px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.52px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.59px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.74px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.18px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -1.41px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.85px;
  --text-display: 70px;
  --leading-display: 1;
  --tracking-display: -2.59px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 40px;
  --radius-full: 999px;
}
```
