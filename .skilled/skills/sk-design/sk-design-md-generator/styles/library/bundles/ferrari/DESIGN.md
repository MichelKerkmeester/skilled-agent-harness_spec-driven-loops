# Ferrari — Style Reference
> cavallino rampante on black marble. Black voids punctuated by singular Ferrari red, white uppercase tracking, and full-bleed cinematic photography.

**Theme:** dark

Ferrari.com speaks in a restrained editorial whisper over cinematic darkness: a predominantly black canvas broken by full-bleed photography and a single signal red that interrupts only when something demands attention. Typography is set in uppercase with wide tracking, small sizes, and tight weights — the type behaves as captions and labels, never as decoration. Layout favors negative space, centered compositions, and vertical scrolling over chrome — the cars and content breathe in full-viewport panels while navigation sits flat and borderless, signaled by color shifts rather than rules. Every element is reduced to its essential geometry: square corners, hairline dividers, flat surfaces, no rounded buttons.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Rosso Corsa | `#da291c` | `--color-rosso-corsa` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Rosso Scuro | `#9d2211` | `--color-rosso-scuro` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Bianco Ferrari | `#ffffff` | `--color-bianco-ferrari` | Canvas, primary text on dark surfaces, iconography, and link color — the dominant tone across the entire interface |
| Carbone Nero | `#000000` | `--color-carbone-nero` | Full-bleed dark backgrounds, hero panels, and overlay surfaces — creates the cinematic void behind photography |
| Notte Profonda | `#181818` | `--color-notte-profonda` | Footer and secondary dark surfaces — one step softer than pure black to break the infinite void |
| Grafite | `#303030` | `--color-grafite` | Borders, dividers, and muted surface treatments — thin structural separation between dark layers |
| Fumo | `#8f8f8f` | `--color-fumo` | Muted body text, caption labels, and secondary metadata on light surfaces |
| Piombo | `#666666` | `--color-piombo` | Supporting body text and quieter label treatments |
| Argento Chiaro | `#d2d2d2` | `--color-argento-chiaro` | Light surface dividers and disabled borders on white backgrounds |
| Velo di Luce | `#f7f7f7` | `--color-velo-di-luce` | Lightest surface wash — subtle background tonal shifts on white sections |
| Cemento | `#ebebeb` | `--color-cemento` | Section backgrounds on light areas — the only chromatic step in the white canvas |

## Tokens — Typography

### Body-Font — Body-Font — detected in extracted data but not described by AI · `--font-body-font`
- **Weights:** 400
- **Sizes:** 9px, 11px, 12px, 13px
- **Line height:** 1.27, 1.5, 1.78, 2
- **Letter spacing:** 0.015, 0.022, 0.028, 0.083, 0.091
- **Role:** Body-Font — detected in extracted data but not described by AI

### FerrariSans — Primary display and interface typeface — custom sans used across all copy · `--font-ferrarisans`
- **Substitute:** Inter, Helvetica Neue, Arial Narrow
- **Weights:** 400-500
- **Sizes:** 
- **Line height:** 1.27-2.0
- **Letter spacing:** 0.005em to 0.091em depending on size — tracking widens as type shrinks
- **OpenType features:** `"ss01" on`
- **Role:** Primary display and interface typeface — custom sans used across all copy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.78 | — | `--text-caption` |
| body-sm | 12px | 1.78 | — | `--text-body-sm` |
| body | 13px | 1.78 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 44 | 44px | `--spacing-44` |
| 50 | 50px | `--spacing-50` |
| 54 | 54px | `--spacing-54` |
| 60 | 60px | `--spacing-60` |
| 123 | 123px | `--spacing-123` |

### Border Radius

| Element | Value |
|---------|-------|
| full | 9999px |
| tags | 0px |
| cards | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 10-16px

## Components

### Ghost Navigation Link
**Role:** Primary nav element

Transparent background, white uppercase text at 11-12px with 0.083-0.091em tracking, zero border-radius, 5px vertical padding. No fill, no border — relies on color shift to white on hover. The nav itself is a flat bar without background, floating over hero imagery.

### Dark Cinematic Hero Panel
**Role:** Full-viewport section

Full-bleed #000000 or #181818 background with centered or overlaid display type at 16px weight 500. Display headlines rendered in uppercase, tightly tracked, centered. Car photography fills the viewport edge-to-edge with no padding or frame — the image IS the layout.

### Section Label Button
**Role:** Categorical navigation chip

Transparent background, white uppercase 12px Body-Font with 0.083em tracking, 5px vertical padding, 0px radius, 1px bottom border that appears on hover. No fill, no rounded corners — text-only with underline state.

### Carousel Indicator Dot
**Role:** Scroll position indicator

8-10px circles at 0px radius, inactive state #8f8f8f, active state #ffffff or #da291c. No labels — purely geometric position markers below full-bleed hero panels.

### Footer Block
**Role:** Site footer

#181818 background extending edge-to-edge, white text at 11-12px uppercase with wide tracking, no borders between columns — only vertical white space separates groups. Social icons are white outlined, 16px square, no fill.

### Featured Content Card
**Role:** Editorial card

Flat rectangular block on #181818 or #000000 background, 0px corner radius, no shadow, no border. Headline set in 16px weight 500 uppercase FerrariSans with tight tracking. Body copy at 11-13px. Photography bleeds to card edges with no inset.

### Utility Icon Button
**Role:** Functional icon control

Search and close icons rendered as white SVG strokes at 16px, transparent background, 0px radius. No background fill, no border — icon alone signals function. 10px padding all sides.

### Category Pill (Full Radius)
**Role:** Filter or tag label

The single rounded element in the system: 9999px radius pill for filter tags or status labels on body copy contexts. Transparent background with 1px hairline white border, uppercase 9-11px text.

### Hairline Divider
**Role:** Structural separator

1px solid line in #303030 on dark surfaces or #d2d2d2 on light surfaces. No double rules, no decorative spacing — minimal structural geometry between content blocks.

### Full-Bleed Photography Frame
**Role:** Imagery container

Edge-to-edge image presentation with 0px radius, no padding, no border, no caption overlay chrome. The image speaks for itself against the black void.

### Body Text Link
**Role:** Inline text link

White #ffffff text with no underline by default, uppercase tracking matching surrounding copy. Color shifts to #da291c on hover — the only chromatic moment in body copy.

### CTA Arrow Link
**Role:** Action prompt with directional indicator

Uppercase 11-12px text in white with a right-pointing arrow (→) glyph appended. Transparent background, no border, no radius. The arrow IS the affordance — no button chrome surrounds the action.

## Do's and Don'ts

### Do
- Set all display copy in uppercase with tracking between 0.083em and 0.091em — the wide letter-spacing is the system's voice
- Use #000000 and #181818 as full-bleed section backgrounds; let photography and white type carry the visual weight without competing surfaces
- Use #da291c exclusively for interactive hover, focus, and active states — never as a background fill, never as decorative color
- Keep all corner radii at 0px except for the single 9999px pill — sharp geometry is the signature
- Set type at 11-13px for all interface copy; reserve 16px only for section titles and hero headlines
- Let images bleed to viewport edges with no padding, frames, or rounding — the photograph is the layout
- Use hairline 1px #303030 or #d2d2d2 dividers for structural separation — never card shadows or elevated panels

### Don't
- Do not introduce rounded corners on buttons, cards, or panels — the system is zero-radius by design
- Do not use #da291c as a filled background or decorative wash — it signals action only
- Do not set body copy below 11px without uppercase treatment; the tracking depends on the size relationship
- Do not add card shadows, elevation, or floating panels — surfaces sit flush on the black void
- Do not use colored type for anything other than #ffffff, #8f8f8f, or #da291c hover states
- Do not introduce gradients as backgrounds — the CSS tokens define gradient behavior for specific component states, not page-level decoration
- Do not add padding or margins around full-bleed hero photography — the image must reach every edge

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Black | `#000000` | Full-bleed hero panels and cinematic section backgrounds |
| 1 | Night Surface | `#181818` | Footer and secondary dark surfaces — one tonal step softer than void |
| 2 | Graphite Edge | `#303030` | Hairline borders and subtle dividers on dark surfaces |
| 3 | Canvas White | `#ffffff` | Light section backgrounds and primary text color |
| 4 | Smoke Wash | `#f7f7f7` | Tonal shifts on white sections — almost imperceptible warmth |
| 5 | Concrete | `#ebebeb` | Lightest background step for alternating sections |

## Imagery

Imagery is full-bleed cinematic photography: vehicles shot against dark or studio environments, filling the viewport edge-to-edge with no inset, frame, or rounding. Photography occupies 70-90% of each viewport section. No lifestyle context, no people-centric shots — the car is always the subject, isolated and hero-prominent. Color treatment is high-contrast with deep shadows and vivid reds or metallic paint catching light. No illustrations, no abstract graphics, no product screenshots — pure photographic storytelling. Iconography is minimal white outlined SVG at 16px stroke weight, used only for functional navigation (search, social, close).

## Layout

Full-bleed vertical scroll with no max-width constraint — sections extend edge-to-edge at 100vw. Each viewport-height section is either a full-bleed photograph with centered white type overlay or a dark void with minimal copy. Hero pattern: first screen is a cinematic car photograph with a centered headline beneath or overlaid, followed by vertically scrolling full-bleed panels. Navigation sits as a flat transparent bar over the hero — no sticky background, no border. Content rhythm alternates between massive image-driven panels and quiet dark sections with centered uppercase typography. No sidebar, no multi-column grids in the fold — composition is single-column and centered throughout. Card grids appear only in secondary content areas (collections, editorial) and remain flat with 0px radius against dark backgrounds. Section transitions are seamless — no dividers, no alternating color bands — only the photography itself marks the shift.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff (primary), #8f8f8f (muted), #da291c (interactive hover)
- background: #000000 (hero void), #181818 (footer/secondary), #ffffff (light sections)
- border: #303030 (dark hairlines), #d2d2d2 (light hairlines)
- accent: #da291c (Rosso Corsa — hover, focus, active states only)
- primary action: no distinct CTA color

3-5 Example Component Prompts:

1. Full-bleed hero section: #000000 background extending 100vw. Centered headline at 16px FerrariSans weight 500, uppercase, #ffffff, letter-spacing 0.005em. Body subtitle at 13px weight 400, #8f8f8f, uppercase, letter-spacing 0.015em. Photography fills the viewport with 0px radius and no inset. Zero padding around the image.

2. Ghost navigation link: transparent background, 12px Body-Font weight 400, uppercase, #ffffff, letter-spacing 0.083em, 5px vertical padding, 0px border-radius. On hover, color shifts to #da291c. No fill, no border, no underline.

3. Editorial content card: #181818 background, 0px border-radius, no shadow, no border. Headline at 16px FerrariSans weight 500, uppercase, #ffffff, letter-spacing 0.005em. Body at 11px weight 400, #ffffff, uppercase, letter-spacing 0.091em. Image bleeds to card edges with no padding or rounding.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

5. Footer block: #181818 background, full-width. Column headers at 12px uppercase #ffffff letter-spacing 0.083em. Link list at 11px uppercase #ffffff letter-spacing 0.091em. 1px #303030 top border. Social icons at 16px white outlined SVG, transparent background.

## Typography Philosophy

The entire type system speaks in a whisper: uppercase, widely tracked, and small. There is no display-weight shouting — the maximum weight is 500 at 16px. Letter-spacing widens inversely with size: 16px headings get 0.005em tracking while 9px micro-copy gets 0.091em. This inverted tracking-size relationship is the signature — type never crowds itself, even at its smallest. All text is uppercase in interface contexts (nav, buttons, links, labels) while body paragraphs may use mixed case at 13px. The custom FerrariSans family handles this gracefully with proportions designed for tight tracking at display sizes and generous breathing at caption sizes. Font-feature-settings 'ss01' should be enabled for alternate glyph forms that define the brand voice.

## Elevation Philosophy

Ferrari.com uses zero elevation. No box-shadows on cards, buttons, or panels — the CSS shadow token (--f-shadow-small) exists for utility but is not applied to core interface elements. Depth is achieved exclusively through: (1) tonal layering of the four-step dark surface stack (#000000 → #181818 → #303030 → #ffffff), (2) full-bleed photography that creates visual depth without UI chrome, and (3) generous negative space that lets dark sections feel cavernous rather than flat. This flat-on-black approach is deliberate: the products (cars) are the three-dimensional elements; the interface recedes.

## Similar Brands

- **Aston Martin** — Same dark cinematic full-bleed photography approach with centered uppercase tracked typography and a single restrained accent color
- **Porsche** — Black-dominant editorial layout with sharp 0px geometry, hairline dividers, and photography that bleeds to viewport edges
- **Lamborghini** — Dark void backgrounds with full-bleed vehicle photography, uppercase tracked display type, and zero-radius sharp UI elements
- **McLaren** — Monochromatic dark UI with cinematic hero panels, minimal navigation chrome, and uppercase widely-tracked micro-copy as the typographic voice
- **Bugatti** — Full-bleed dark editorial sections with centered white display type and a single brand color used only for interactive states

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-rosso-corsa: #da291c;
  --color-rosso-scuro: #9d2211;
  --color-bianco-ferrari: #ffffff;
  --color-carbone-nero: #000000;
  --color-notte-profonda: #181818;
  --color-grafite: #303030;
  --color-fumo: #8f8f8f;
  --color-piombo: #666666;
  --color-argento-chiaro: #d2d2d2;
  --color-velo-di-luce: #f7f7f7;
  --color-cemento: #ebebeb;

  /* Typography — Font Families */
  --font-body-font: 'Body-Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ferrarisans: 'FerrariSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.78;
  --text-body-sm: 12px;
  --leading-body-sm: 1.78;
  --text-body: 13px;
  --leading-body: 1.78;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-50: 50px;
  --spacing-54: 54px;
  --spacing-60: 60px;
  --spacing-123: 123px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-full: 9999px;
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-void-black: #000000;
  --surface-night-surface: #181818;
  --surface-graphite-edge: #303030;
  --surface-canvas-white: #ffffff;
  --surface-smoke-wash: #f7f7f7;
  --surface-concrete: #ebebeb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-rosso-corsa: #da291c;
  --color-rosso-scuro: #9d2211;
  --color-bianco-ferrari: #ffffff;
  --color-carbone-nero: #000000;
  --color-notte-profonda: #181818;
  --color-grafite: #303030;
  --color-fumo: #8f8f8f;
  --color-piombo: #666666;
  --color-argento-chiaro: #d2d2d2;
  --color-velo-di-luce: #f7f7f7;
  --color-cemento: #ebebeb;

  /* Typography */
  --font-body-font: 'Body-Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ferrarisans: 'FerrariSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.78;
  --text-body-sm: 12px;
  --leading-body-sm: 1.78;
  --text-body: 13px;
  --leading-body: 1.78;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-50: 50px;
  --spacing-54: 54px;
  --spacing-60: 60px;
  --spacing-123: 123px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
