# Ssense — Style Reference
> White gallery wall with editorial serifs. A high-fashion magazine spread rendered as a single-page web experience — where the only color is photography and the only weight is restraint.

**Theme:** light

SSENSE operates as a digital fashion editorial: pristine white canvas, razor-thin sans-serif navigation, and oversized serif headlines that behave like magazine cover titles rather than web UI. The visual system is deliberately monochrome — no accent colors, no filled CTAs, no decorative gradients — letting editorial photography and typography do all the expressive work. Hierarchy is achieved through extreme scale contrast (95px display down to 11px meta labels) and tight negative letter-spacing on serif faces that pulls letterforms into elegant, compressed shapes. Components are minimal and ghost-like: outlined buttons, hairline borders, near-invisible dividers. The site reads less like a store and more like a curated print publication that happens to sell things.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, navigation links, logo wordmark, footer links, SVG icon strokes — the anchor color of the entire system |
| Graphite | `#333333` | `--color-graphite` | Body text and headings — slightly softer than pure black for long-form editorial readability at large sizes |
| Silver | `#979797` | `--color-silver` | Hairline borders, dividers, inactive UI separators, secondary meta labels |
| Ash | `#888888` | `--color-ash` | Muted helper text, list items, tertiary metadata, subdued navigation states |
| Marble | `#f4f4f4` | `--color-marble` | Page canvas background, subtle section differentiation, footer surface — barely warmer than pure white |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, hero background, product tiles, elevated content panels |
| Mist | `#e8e8e8` | `--color-mist` | Alternative surface tint, subtle alternating bands, ghost button hover backgrounds |

## Tokens — Typography

### JHA Times Now — Editorial display and subhead serif — the voice of the brand. Used at 56px for hero editorial titles with extreme tight tracking (-0.04em) and 1.07 line-height, creating a compressed magazine-cover effect. Weight 100 is a near-hairline whisper that feels anti-commerce. Substitute: Playfair Display, GT Sectra, or Canela for a similar high-contrast transitional serif. · `--font-jha-times-now`
- **Substitute:** Playfair Display, GT Sectra, Canela
- **Weights:** 100, 400
- **Sizes:** 15px, 20px, 56px
- **Line height:** 1.07, 1.20, 1.30, 2.00
- **Letter spacing:** -0.0400em at 56px, -0.0030em at 20px, -0.0020em at 15px
- **Role:** Editorial display and subhead serif — the voice of the brand. Used at 56px for hero editorial titles with extreme tight tracking (-0.04em) and 1.07 line-height, creating a compressed magazine-cover effect. Weight 100 is a near-hairline whisper that feels anti-commerce. Substitute: Playfair Display, GT Sectra, or Canela for a similar high-contrast transitional serif.

### Favorit SSENSE Inter — Primary UI and content sans-serif — used for navigation, body text, editorial descriptions, and the largest display sizes (95px). The letter-spacing scales aggressively tighter as size increases: -0.047em at 95px pulls the giant wordforms into a dense architectural block, while -0.004em at 14px keeps body text natural. This negative-tracking-at-scale pattern is the signature. Substitute: Inter, Söhne, or Neue Haas Grotesk. · `--font-favorit-ssense-inter`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 100, 400
- **Sizes:** 11px
- **Line height:** 0.99, 1.16, 1.19, 1.26, 1.37
- **Letter spacing:** -0.0470em at 95px, -0.0330em at 38px, -0.0180em at 29px, -0.0130em at 19px, -0.0040em at 14px
- **Role:** Primary UI and content sans-serif — used for navigation, body text, editorial descriptions, and the largest display sizes (95px). The letter-spacing scales aggressively tighter as size increases: -0.047em at 95px pulls the giant wordforms into a dense architectural block, while -0.004em at 14px keeps body text natural. This negative-tracking-at-scale pattern is the signature. Substitute: Inter, Söhne, or Neue Haas Grotesk.

### ssense-fonts (micro-tag) — Bold micro-label for category tags and merchandising markers — the one place weight 700 appears in the entire system. Always uppercase, always 11px, always tight line-height. · `--font-ssense-fonts-micro-tag`
- **Substitute:** Inter Bold, Söhne Bold
- **Weights:** 700
- **Sizes:** 11px
- **Line height:** 1.00
- **Letter spacing:** normal
- **Role:** Bold micro-label for category tags and merchandising markers — the one place weight 700 appears in the entire system. Always uppercase, always 11px, always tight line-height.

### Favorit SSENSE Inter1 — Favorit SSENSE Inter1 — detected in extracted data but not described by AI · `--font-favorit-ssense-inter1`
- **Weights:** 100, 400
- **Sizes:** 14px, 19px, 29px, 38px, 95px
- **Line height:** 0.99, 1.16, 1.19, 1.26, 1.37
- **Letter spacing:** -0.047, -0.033, -0.018, -0.013, -0.004
- **Role:** Favorit SSENSE Inter1 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1 | — | `--text-caption` |
| body-sm | 14px | 1.37 | -0.056px | `--text-body-sm` |
| subheading | 20px | 1.2 | -0.06px | `--text-subheading` |
| heading-sm | 29px | 1.19 | -0.522px | `--text-heading-sm` |
| heading | 38px | 1.16 | -1.254px | `--text-heading` |
| heading-lg | 56px | 1.07 | -2.24px | `--text-heading-lg` |
| display | 95px | 0.99 | -4.465px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 31 | 31px | `--spacing-31` |
| 40 | 40px | `--spacing-40` |
| 55 | 55px | `--spacing-55` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 105 | 105px | `--spacing-105` |
| 119 | 119px | `--spacing-119` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| links | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 10-20px

## Components

### Ghost Outlined Button
**Role:** Primary call-to-action on editorial banners (e.g. 'View Editorial')

1px solid #000000 border, no fill, transparent background, #000000 text. Padding approximately 10px 20px. No border-radius — completely sharp corners. Text in Favorit SSENSE Inter at 11px weight 400, uppercase, letter-spacing normal. On hover: fill becomes #000000, text inverts to #ffffff. This is the only interactive element style in the system.

### Top Navigation Bar
**Role:** Primary site navigation across all pages

White (#ffffff) background, no border, no shadow. Left-aligned category links (MENSWEAR, WOMENSWEAR, EVERYTHING ELSE, SALE, SEARCH) in Favorit SSENSE Inter 11px weight 400, uppercase, #000000. Centered logo wordmark 'SSENSE' in larger weight. Right-aligned utility links (ENGLISH, LOGIN, WISHLIST, BAG). All text tracking normal, all elements vertically centered with ~20px horizontal padding.

### Editorial Hero Block
**Role:** Landing page hero section combining headline + editorial photography

Two-column layout: left column holds serif headline (JHA Times Now, 56px, weight 400, #333333) stacked over sans-serif editorial description (Favorit SSENSE Inter, 19-20px, weight 400, #333333), with ghost outlined button below. Right column holds a full-bleed editorial photograph. No card container, no background fill, no dividers — content floats directly on the #ffffff canvas. Gap between columns approximately 40-55px.

### Editorial Card Grid Item
**Role:** Content tiles in the secondary editorial grid below the hero

Three-column grid of editorial content cards. Each card: top is a landscape photograph with no border-radius, no padding around image. Below image: 'RECENT' micro-label in ssense-fonts weight 700, 11px, uppercase, #000000. Then a headline in Favorit SSENSE Inter 14-19px, weight 400, #000000. Then a metadata line (category + date) in 11px weight 400, #888888. No card background, no border, no shadow — the photograph is the visual anchor.

### Product Feature Card
**Role:** Featured product placement with dark moody photography

Two-column product feature layout. Each column contains a product photograph on a gradient background (dark teal-to-gray), sharp corners, no border. Below: 'Featured' label in 11px weight 400, then 'NEW ARRIVALS' in Favorit SSENSE Inter ~19px weight 400. The dark photographic backgrounds create tonal contrast against the white page without any colored UI elements.

### Promotional Banner Strip
**Role:** Site-wide announcement bar at the very top

Full-width horizontal strip at the top of the page. Very light background, thin bottom border. Centered text in Favorit SSENSE Inter 11px weight 400, #000000. A small close (×) icon in the far right corner. No padding drama — sits as a single-line 30-40px tall band.

### Header Logo Mark
**Role:** Brand wordmark centered in navigation

Text-only 'SSENSE' wordmark in Favorit SSENSE Inter, approximately 19-20px, weight 400, #000000, centered in the top navigation bar. No symbol, no tagline — the wordmark IS the logo. Functions as a home link.

### Micro Category Label
**Role:** Metadata and category tagging on editorial content

ssense-fonts family at weight 700, 11px, #000000, uppercase. Always precedes an editorial headline. Sets a typographic rhythm: bold tag → regular headline → muted meta. Letter-spacing normal, line-height 1.0 — sits tight against the line below.

### Meta Description Line
**Role:** Secondary descriptive text under editorial headlines

Favorit SSENSE Inter 14-15px, weight 400, #888888. Pairs with the black headline above to create a two-tone label hierarchy. The 3:1 contrast between #000000 headline and #888888 meta is the system's only typographic color gradient.

### Editorial Paragraph Block
**Role:** Long-form editorial body text in hero sections

JHA Times Now serif, 20px, weight 100 (hairline), #333333, line-height 1.30. The ultra-light serif weight for body copy is a signature anti-pattern — most luxury sites use regular or medium for body. This creates a whisper-thin text quality that feels typeset, not typed. No maximum width constraint visible — text flows within its column.

## Do's and Don'ts

### Do
- Use only the seven neutral colors — no accent colors, no brand colors, no fills on interactive elements
- Set display headlines at 56-95px with letter-spacing of -0.033em to -0.047em for compressed editorial weight
- Use weight 100 (hairline) for serif body text at 20px — the thinness is the signature
- Keep all component corners at 0px radius — SSENSE is a sharp-edged system
- Use the Ghost Outlined Button (1px #000000 border, transparent fill) for all calls to action
- Maintain 64px vertical gaps between major sections and 10-20px gaps between related elements
- Pair serif editorial headlines (JHA Times Now) with sans-serif body text (Favorit SSENSE Inter) — the contrast is the system

### Don't
- Never add a colored CTA button — the system has no primary action color
- Never use border-radius above 0px on any UI element
- Never use a sans-serif font for editorial display headlines above 38px
- Never use letter-spacing above normal on any element — tracking is always negative or zero
- Never place content on anything other than #ffffff or #f4f4f4 surfaces
- Never use drop shadows or elevation effects — the system is flat
- Never use bold weights (600-700) for anything other than the 11px micro-tag label

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f4f4f4` | Page background — the warm-white gallery wall |
| 1 | Card Surface | `#ffffff` | Elevated content areas, hero backgrounds, product tiles |
| 2 | Alt Band | `#e8e8e8` | Subtle section alternation, ghost hover states |

## Elevation

SSENSE is a completely flat design system. No drop shadows, no box-shadows, no elevation effects of any kind. Visual separation is achieved exclusively through whitespace, the natural contrast between #ffffff and #f4f4f4 surfaces, and 1px hairline borders in #979797. The flatness reinforces the editorial print-magazine metaphor — like ink on paper, not digital UI.

## Imagery

Photography is the sole source of color and visual energy in this system. Editorial fashion photography dominates: full-bleed or near-full-bleed landscape and portrait crops of models in designer clothing, product photography on gradient backgrounds (dark teal-to-gray studio shots), and environmental lifestyle imagery. Images have sharp corners with no border-radius, no overlays, no duotone treatment — they appear as raw photographic prints placed on the white page. No illustrations, no icons (except the × close button and minimal UI markers), no 3D renders, no abstract graphics. The images do all the emotional and chromatic work that a typical e-commerce site would delegate to color and decoration.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #000000
- text (body/editorial): #333333
- text (muted/meta): #888888
- background (canvas): #f4f4f4
- background (card): #ffffff
- border (hairline): #979797
- primary action: no distinct CTA color

## 3-5 Example Component Prompts
1. **Editorial Hero Section**: White (#ffffff) background, no card container. Left column: headline in JHA Times Now 56px weight 400, #333333, letter-spacing -0.04em, line-height 1.07. Below: body text in JHA Times Now 20px weight 100, #333333. Below: Ghost Outlined Button (1px solid #000000, no fill, 10px 20px padding, 11px Favorit SSENSE Inter text). Right column: full-bleed editorial photograph, sharp corners. Column gap: 40px.

2. **Editorial Grid Card**: No background, no border, no shadow. Top: landscape editorial photograph, sharp corners. Below image: 'RECENT' in ssense-fonts 11px weight 700 #000000. Below: headline in Favorit SSENSE Inter 19px weight 400, #000000, letter-spacing -0.013em. Below: meta line 'Category | Date' in Favorit SSENSE Inter 11px weight 400, #888888.

3. **Top Navigation Bar**: White (#ffffff) background, no border, no shadow, ~50px height. Left: category links in Favorit SSENSE Inter 11px weight 400 uppercase #000000, 20px horizontal spacing. Center: 'SSENSE' wordmark in Favorit SSENSE Inter 19px weight 400. Right: utility links (ENGLISH, LOGIN, etc.) same style as left.

4. **Ghost Outlined Button**: Transparent background, 1px solid #000000 border, 0px radius. Padding 10px vertical, 20px horizontal. Text: Favorit SSENSE Inter 11px weight 400, uppercase, #000000, letter-spacing normal. On hover: background #000000, text #ffffff.

5. **Promotional Banner**: Full-width, #f4f4f4 background, 1px solid #979797 bottom border, 35px height. Centered text in Favorit SSENSE Inter 11px weight 400 #000000. Right-aligned × close icon in #000000.

## Similar Brands

- **Mr Porter** — Same editorial-magazine approach to luxury e-commerce — large serif display type, monochrome palette, photography as the sole color source, sharp-cornered ghost buttons, and generous whitespace between editorial sections
- **The Row** — Identical restraint philosophy — pure white canvas, no accent colors, hairline-thin sans-serif navigation, serif editorial headlines, and an absolute refusal to use UI decoration that would distract from the product
- **COS** — Same ultra-minimal monochrome system with oversized sans-serif display type, negative letter-spacing on large text, completely flat surfaces with no shadows, and sharp 0px corners on all components
- **Aesop** — Shares the warm-white (#f4f4f4) canvas, deep typographic contrast between display and body sizes, and a near-total absence of color — both treat photography and typography as the entire visual language
- **Net-a-Porter** — Same luxury editorial e-commerce model — large-scale editorial headlines, monochrome navigation, content-card grids with image-dominant cards, and a flat no-elevation component system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-graphite: #333333;
  --color-silver: #979797;
  --color-ash: #888888;
  --color-marble: #f4f4f4;
  --color-paper: #ffffff;
  --color-mist: #e8e8e8;

  /* Typography — Font Families */
  --font-jha-times-now: 'JHA Times Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-ssense-inter: 'Favorit SSENSE Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ssense-fonts-micro-tag: 'ssense-fonts (micro-tag)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-ssense-inter1: 'Favorit SSENSE Inter1', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.37;
  --tracking-body-sm: -0.056px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.06px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.522px;
  --text-heading: 38px;
  --leading-heading: 1.16;
  --tracking-heading: -1.254px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -2.24px;
  --text-display: 95px;
  --leading-display: 0.99;
  --tracking-display: -4.465px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-31: 31px;
  --spacing-40: 40px;
  --spacing-55: 55px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-105: 105px;
  --spacing-119: 119px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 10-20px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-links: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #f4f4f4;
  --surface-card-surface: #ffffff;
  --surface-alt-band: #e8e8e8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-graphite: #333333;
  --color-silver: #979797;
  --color-ash: #888888;
  --color-marble: #f4f4f4;
  --color-paper: #ffffff;
  --color-mist: #e8e8e8;

  /* Typography */
  --font-jha-times-now: 'JHA Times Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-ssense-inter: 'Favorit SSENSE Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ssense-fonts-micro-tag: 'ssense-fonts (micro-tag)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-ssense-inter1: 'Favorit SSENSE Inter1', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.37;
  --tracking-body-sm: -0.056px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.06px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.522px;
  --text-heading: 38px;
  --leading-heading: 1.16;
  --tracking-heading: -1.254px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -2.24px;
  --text-display: 95px;
  --leading-display: 0.99;
  --tracking-display: -4.465px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-31: 31px;
  --spacing-40: 40px;
  --spacing-55: 55px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-105: 105px;
  --spacing-119: 119px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
