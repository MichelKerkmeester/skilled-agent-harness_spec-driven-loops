# Acne Studios — Style Reference
> Minimalist gallery white space with bold photographic moments — a fashion magazine laid flat on marble.

**Theme:** light

Acne Studios operates as a digital fashion magazine rather than a conventional storefront: white canvas, full-bleed editorial photography, and almost no UI chrome. The entire page reads as curated art-direction — product images sit edge-to-edge in tight grids, and the only typographic punctuation is tiny uppercase labels with generous letter-spacing. The signature electric cobalt (#0018a8) is used sparingly on links and interactive accents, never as a filled button, letting the photography own attention. Components are deliberately weightless: no shadows, no card surfaces, no rounded containers, no decorative borders. Space between elements does the structural work that elevation does elsewhere.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#0018a8` | `--color-electric-cobalt` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, logo wordmark, icon strokes, nav labels, and footer copy. Used at 21:1 contrast on white for absolute legibility |
| Graphite | `#6b6b6b` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, product card backgrounds, and nav bar surface. The dominant ground that lets editorial photography breathe |
| Bone | `#f2f2f2` | `--color-bone` | Subtle box-shadow tint and hairline border for elevated overlays. Used minimally — the system prefers whitespace to tinted surfaces |

## Tokens — Typography

### Helvetica Monospaced Pro — Helvetica Monospaced Pro — detected in extracted data but not described by AI · `--font-helvetica-monospaced-pro`
- **Weights:** 400
- **Sizes:** 9px
- **Line height:** 1.15
- **Letter spacing:** 0.033
- **Role:** Helvetica Monospaced Pro — detected in extracted data but not described by AI

### Acne Studios (custom wordmark) — Oversized brand wordmark overlaid on hero photography. The custom face has geometric construction with humanist terminals; no system font replicates it, but its character is closest to a wide-aperture geometric sans. · `--font-acne-studios-custom-wordmark`
- **Substitute:** GT Walsheim or Manrope at matching optical size and weight
- **Weights:** 400-500
- **Sizes:** 
- **Line height:** 
- **Letter spacing:** tight (0 to -0.02em at display)
- **Role:** Oversized brand wordmark overlaid on hero photography. The custom face has geometric construction with humanist terminals; no system font replicates it, but its character is closest to a wide-aperture geometric sans.

### Helvetica Neue / system sans — All functional UI text: nav links, section labels, product captions, footer. Always rendered uppercase with generous tracking — this typographic treatment is the single most recognizable non-photographic element on the site. · `--font-helvetica-neue-system-sans`
- **Substitute:** Helvetica or Inter
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.15-1.4
- **Letter spacing:** 0.0330em across small sizes; 0.02em on slightly larger
- **Role:** All functional UI text: nav links, section labels, product captions, footer. Always rendered uppercase with generous tracking — this typographic treatment is the single most recognizable non-photographic element on the site.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| display | 120px | 1 | -1.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 60px
- **Card padding:** 0px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Minimal text-only site header

Full-bleed white bar, 30px vertical padding. Left: WOMAN, MAN, BAGS, RUNWAY at 10-11px uppercase, 0.0330em tracking, #000000. Right: SEARCH, HELP, ACCOUNT, cart icon with counter at same spec. No background fill, no border, no shadow. Sticky to top on scroll.

### Section Label
**Role:** Category indicator above editorial splits

Tiny uppercase label (SHOP WOMAN, SHOP MAN) at 10px, 0.0330em letter-spacing, #000000. Sits at the top-left of each half of a split hero, functioning as a clickable text link. 9-10px horizontal padding from viewport edge.

### Full-Bleed Split Hero
**Role:** Primary landing visual

Two equal-width editorial photographs spanning full viewport width with no gap. The Acne Studios wordmark in custom display face is centered across the seam at 120px+, #000000, overlapping both images. No overlay, no gradient, no CTA button — the wordmark and the photographs do all the work.

### Product Grid Cell
**Role:** Individual product listing in the category grid

Full-bleed product photograph with no border, radius, or background. Caption above image: category name (WOMEN'S JEANS, BAGS, T-SHIRTS) at 10px uppercase, 0.0330em tracking, #000000. No visible price, no quick-add button, no badge. Cells butt directly against neighbors with 0px gap to create a seamless editorial spread.

### Editorial Tile Row
**Role:** Brand storytelling content beneath product grid

Five equal-width tiles in a single row, each containing a full-bleed photograph (packaging, storefront, lookbook, building). No captions, no borders, no interactive chrome — purely atmospheric. Functions as a mood board rather than navigation.

### Text Link
**Role:** Interactive inline link in body copy and nav

Inherits body type and size, colored #0018a8 with no underline by default. On hover, underline appears at 1px. No pill shape, no background, no border.

### Icon Button
**Role:** Search, help, account, and cart triggers

Text label at 10-11px uppercase with 0.0330em tracking. Cart includes a 2-digit counter at the same size. Icons are 1px stroke, #000000, no fill, no background container.

## Do's and Don'ts

### Do
- Use #0018a8 only for text links, active nav states, and icon strokes — never as a filled button background
- Set body and nav text to 10-11px uppercase with 0.0330em letter-spacing for the signature editorial voice
- Let product and editorial images span full viewport width with 0px gap between adjacent cells
- Default page background to #ffffff and avoid any tinted surface unless absolutely necessary
- Keep card and image radius at 0px — the system uses hard edges to read as printed magazine spreads
- Use #000000 at 21:1 contrast for all primary text on white; reserve #6b6b6b for genuinely secondary copy
- Maintain 60px vertical section gaps and 30px nav padding as the structural rhythm

### Don't
- Do not introduce filled CTA buttons, pill shapes, or rounded containers — they break the editorial-flat aesthetic
- Do not apply box-shadow to product cards, nav, or content tiles; separation comes from whitespace alone
- Do not use colors outside the five-token palette for interface chrome — photography supplies all chromatic richness
- Do not set type below 9px or render body text in anything other than uppercase with tracking for nav-adjacent labels
- Do not center body content or constrain to a max-width — layouts should be full-bleed to feel like a magazine spread
- Do not add borders, dividers, or background fills to product cells — they must bleed into each other
- Do not use #0018a8 as decorative illustration color; it is reserved for functional interactive states

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Page canvas and dominant background across all sections |
| 2 | Bone | `#f2f2f2` | Imperceptible shadow and border tint for subtle UI lift |

## Elevation

The system intentionally avoids shadows and elevation. White space, not depth, creates separation between elements. The only shadow token (#f2f2f2) is nearly imperceptible — used only for overlays that must float above photography.

## Imagery

Photography is the entire product. Editorial fashion shots dominate at full-bleed scale: models in avant-garde styling against neutral studio backdrops (gray, striped fabric, muted interiors). Products are shot on pure white with zero lifestyle context. Secondary imagery includes brand packaging (pink Acne Studios boxes), storefront photography, and architectural shots. No illustrations, no icons beyond simple line glyphs, no gradients, no 3D renders. Images are always rectangular with sharp corners — no masking, no rounded crops, no overlapping. The role of imagery is not decorative atmosphere but primary content; it occupies roughly 90% of visible pixel area.

## Layout

Full-bleed, edge-to-edge viewport layouts with no max-width constraint. The page follows a strict editorial rhythm: (1) sticky top nav with text links and cart counter, (2) full-viewport split hero (50/50) with overlaid wordmark, (3) 4-column product grid with zero gutters, (4) 5-column editorial tile row with zero gutters. All sections stack vertically with consistent 60px gaps. The grid is always even — no asymmetric or masonry compositions. Navigation is minimal top bar only, no sidebar or mega-menu. The layout reads left-to-right, top-to-bottom like a printed fashion magazine spread.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- border/shadow tint: #f2f2f2
- accent/brand: #0018a8
- muted text: #6b6b6b
- primary action: no distinct CTA color

## 3-5 Example Component Prompts
1. **Top Nav Bar**: Full-width white bar, 30px top/bottom padding. Left-aligned links (WOMAN, MAN, BAGS, RUNWAY) at 10px uppercase, letter-spacing 0.33px, #000000. Right-aligned SEARCH, HELP, ACCOUNT, cart icon at same spec, 10px horizontal gap between items. No background fill, no border, sticky to top.

2. **Product Grid Cell**: Full-bleed photograph with 0px radius and no border. Caption 30px above image: category name at 10px uppercase, 0.33px letter-spacing, #000000. No price visible, no button. Cell width is 25% of viewport in a 4-column row with 0px gaps.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Editorial Tile Row**: 5 equal-width tiles in a single row, each containing one full-bleed photograph (0px radius, no border). No captions, no interactive elements within tiles. Tiles touch at 0px gap to form a continuous strip.

5. **Text Link**: Inline at 10px uppercase, 0.33px letter-spacing. Color #0018a8, no underline by default. 1px underline on hover. No background, no padding, no border.

## Similar Brands

- **SSENSE** — Same editorial-fashion e-commerce language: full-bleed photography, minimal UI chrome, uppercase tracked-out nav text, and white-dominant canvas
- **COS** — Identical restraint philosophy — large whitespace, flat product photography, no decorative elevation, and a near-monochrome interface that lets imagery dominate
- **Lemaire** — Shared art-direction approach: tiny uppercase labels, zero-radius image crops, no card containers, and editorial tile grids beneath product listings
- **The Row** — Same digital-magazine-as-storefront structure with full-viewport hero splits, 4-column product grids, and complete absence of traditional e-commerce UI affordances

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #0018a8;
  --color-ink-black: #000000;
  --color-graphite: #6b6b6b;
  --color-paper-white: #ffffff;
  --color-bone: #f2f2f2;

  /* Typography — Font Families */
  --font-helvetica-monospaced-pro: 'Helvetica Monospaced Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-acne-studios-custom-wordmark: 'Acne Studios (custom wordmark)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-system-sans: 'Helvetica Neue / system sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -1.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-60: 60px;

  /* Layout */
  --section-gap: 60px;
  --card-padding: 0px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-bone: #f2f2f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #0018a8;
  --color-ink-black: #000000;
  --color-graphite: #6b6b6b;
  --color-paper-white: #ffffff;
  --color-bone: #f2f2f2;

  /* Typography */
  --font-helvetica-monospaced-pro: 'Helvetica Monospaced Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-acne-studios-custom-wordmark: 'Acne Studios (custom wordmark)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue-system-sans: 'Helvetica Neue / system sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -1.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-60: 60px;
}
```
