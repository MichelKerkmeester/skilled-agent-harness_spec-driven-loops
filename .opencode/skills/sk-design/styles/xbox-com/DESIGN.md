# Xbox.com — Style Reference
> stadium-lit arcade storefront. Stark white shelves displaying game artwork under dramatic lighting, with one signature green neon strip cutting through the rows.

**Theme:** light

Xbox.com runs a high-contrast storefront language: a stark white canvas interrupted by full-bleed game artwork and product photography, with Xbox's signature deep green (#107c10) acting as a structural accent across category labels, promotional bands, and section headers. The interface is dense and catalog-driven — compact nav, tile grids, and split content blocks — but the visual weight is deliberately held back to let game artwork dominate. Typography stays utilitarian via Segoe UI at conservative weights, with a single bold display size (46px) for hero headlines. The system uses uppercase badge labels with wide tracking (0.075em) as a recurring visual punctuation mark, and lime-green (#9bf00b) promotional buttons punctuate an otherwise monochrome surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Xbox Green | `#107c10` | `--color-xbox-green` | Dominant brand color — Game Pass wordmark, promotional section headers, decorative dividers, link accents. The single chromatic identity anchor in an otherwise achromatic interface |
| Forest Green | `#054b16` | `--color-forest-green` | Deep secondary green for dark-surface accents, button hover states on dark backgrounds, Game Pass subheadings on dark imagery |
| Volt Lime | `#9bf00b` | `--color-volt-lime` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Caution Yellow | `#ffd800` | `--color-caution-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Ink Black | `#000000` | `--color-ink-black` | Primary text color, dark surface fills, footer background, icon strokes. The structural backbone — appears 1086 times across nav, body, button, and icon contexts |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark fills, hero text on dark imagery. The default background layer |
| Carbon | `#333333` | `--color-carbon` | Hero and section heading text, secondary dark surfaces. Slightly softer than pure black for long-form readability |
| Ash Gray | `#f2f2f2` | `--color-ash-gray` | Section dividers, alternating band backgrounds, footer top edge. Creates subtle separation without darkening the page |
| Steel | `#616161` | `--color-steel` | Muted body text, nav dropdown items, icon fills, link colors in body copy. The 215-frequency workhorse for secondary information |
| Graphite | `#262626` | `--color-graphite` | Alternative body text and link color for slightly higher contrast on light gray backgrounds |
| Smoke | `#999999` | `--color-smoke` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |

## Tokens — Typography

### Segoe UI — Primary system typeface — used across nav links, body copy, button labels, and hero headlines. The 46px/1.20 headline is the system's maximum display size, keeping Xbox's typographic scale compressed and catalog-like rather than editorial. · `--font-segoe-ui`
- **Substitute:** system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
- **Weights:** 400, 600, 700
- **Sizes:** 11px, 13px, 15px, 16px, 20px, 24px, 46px
- **Line height:** 1.20–2.27
- **Letter spacing:** -0.01em for body sizes (13–16px); 0.075em for 11px uppercase badge labels
- **Role:** Primary system typeface — used across nav links, body copy, button labels, and hero headlines. The 46px/1.20 headline is the system's maximum display size, keeping Xbox's typographic scale compressed and catalog-like rather than editorial.

### SegoeProBlack — Custom heavier-weight variant for button and link text where extra weight is needed for emphasis. Weight 900 instances push CTA labels past standard bold for maximum legibility at small sizes. · `--font-segoeproblack`
- **Substitute:** "Segoe UI Black", "Segoe UI", system-ui, sans-serif
- **Weights:** 600, 900
- **Sizes:** 15px
- **Line height:** 1.23–1.53
- **Role:** Custom heavier-weight variant for button and link text where extra weight is needed for emphasis. Weight 900 instances push CTA labels past standard bold for maximum legibility at small sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.45 | 0.83px | `--text-caption` |
| body-md | 16px | 1.5 | — | `--text-body-md` |
| subheading | 20px | 1.33 | — | `--text-subheading` |
| heading | 24px | 1.25 | — | `--text-heading` |
| display | 46px | 1.2 | -0.46px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 43 | 43px | `--spacing-43` |
| 50 | 50px | `--spacing-50` |
| 71 | 71px | `--spacing-71` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| badges | 0px |
| buttons | 0px |
| gameTiles | 0px |

### Layout

- **Section gap:** 48-64px
- **Card padding:** 8-12px
- **Element gap:** 8-16px

## Components

### Top Navigation Bar
**Role:** Global site navigation

Full-width white bar, ~56px height. Left: Microsoft logo (4-color squares) and Xbox sphere logo in green. Center: dropdown nav items (Game Pass, Juegos, Dispositivos, Juega, Tienda, Más) in 13px Segoe UI weight 400, #616161, expanding to black on hover. Right: secondary utility links (Todo Microsoft, Buscar, Carrito) and a circular avatar icon. Bottom border: 1px solid #f2f2f2.

### Hero Banner with Game Artwork
**Role:** Primary campaign showcase

Full-bleed dark hero (~520px height) with game key art filling the entire background area. Text overlays on the right third: yellow badge label (11px uppercase, #ffd800 bg, #000 text, 0px radius, 4px 8px padding), 46px/1.20 Segoe UI weight 700 headline in #ffffff, 15px/1.53 subtext in #ffffff, and a lime-green (#9bf00b) pill action button + ghost text link side by side. Pagination dots at bottom center (4-5 indicators, active dot filled #ffffff, inactive #ffffff at 40% opacity).

### Category Icon Row
**Role:** Primary site sections

Horizontal strip on white background, 6 icon+label pairs (GAME PASS, JUEGOS, DISPOSITIVOS, ACCESORIOS, JUEGA, INICIAR SESIÓN). Each pair: 48px outlined green icon (#107c10 stroke, 1.5px) above 13px Segoe UI weight 600 label in #107c10, letter-spacing 0.075em uppercase. Equal-width columns, centered alignment, ~80px row height total.

### Game Tile Card
**Role:** Individual game entry in grid/catalog

Rectangular tile with game cover artwork or key art filling the card edge-to-edge (0px radius). Variable aspect ratios — portrait for game covers, landscape for key art tiles. Title appears below or overlaid in 15px Segoe UI weight 600 #000000. Cards sit directly adjacent with no gap or border, creating a continuous poster wall effect in grid layouts.

### Game Pass Promotional Banner
**Role:** Subscription acquisition block

Full-width section with solid #107c10 green background. Split layout: left half has white headline text (24px Segoe UI weight 700) and 15px body copy, right half shows 4 game tile thumbnails with 4px radius. Lime-green (#9bf00b) CTA button at bottom-left of text area. This is the only fully green section on the page — it functions as a brand color statement.

### Spring Offers Section
**Role:** Seasonal promotional band

Dark section (background: game artwork or #000000) with white headline "Ofertas de Primavera" at 46px and 15px subtext. Ghost text action link ("COMPRAR AHORA") in 13px weight 600 with white chevron. Above the text: a horizontal row of game cover thumbnails with 4px radius, 16px gaps between them.

### Feature Block (Text + Product Image)
**Role:** Product or content showcase

Two-column layout, 50/50 split. Left column: yellow badge label, 24px headline in #000000, 15px body in #262626, ghost text action link. Right column: product photography or device render (e.g., ROG Xbox Ally handheld) on neutral or contextual background. Vertical alignment centered between columns.

### Yellow Category Badge
**Role:** Label / tag for content categorization

Small inline label, #ffd800 background, #000000 text, 0px radius, 2px 8px padding. Text: 11px Segoe UI weight 600, uppercase, letter-spacing 0.075em. Used for seasonal labels ("NUEVA TEMPORADA"), availability tags ("YA DISPONIBLES"), and edition markers. Appears above headlines in hero and feature blocks.

### Lime Promotional Button
**Role:** High-emphasis conversion button

Filled button with #9bf00b background, #000000 text, 0px radius, 8px 16px padding. Label: 15px SegoeProBlack weight 600 or 900, uppercase, with trailing chevron (›). Used for Game Pass join, download, and primary conversion actions. The 14.9:1 contrast ratio with black text ensures the button is the loudest element on any page.

### Ghost Text Action Link
**Role:** Secondary navigation / de-emphasized action

Text-only link with no background or border. 13px Segoe UI weight 600, uppercase, letter-spacing 0.075em, color #000000 on light surfaces or #ffffff on dark. Trailing chevron (›) in the same color. 4px bottom margin from preceding text. Used for "VER DETALLES", "COMPRAR AHORA", "RESERVAR" — anything secondary to the primary CTA.

### Footer
**Role:** Site-wide footer with legal and navigation links

Full-width #f2f2f2 background band. Multi-column link grid (4-6 columns) with 13px Segoe UI weight 400 links in #616161. Xbox sphere logo and Microsoft attribution at top. Bottom strip: copyright, legal links, region selector, 12px Segoe UI in #616161. Minimal visual weight — functions as a utility band, not a design moment.

### Hardware Showcase Section
**Role:** Product detail / device feature page block

Full-bleed section with device photography on a contextual or neutral background (e.g., floating controller on gradient). Text positioned left or overlaid with white headline at 24-46px, yellow badge label, and ghost text action. Background often uses subtle environmental lighting (studio-style product photography, not lifestyle).

## Do's and Don'ts

### Do
- Use 0px border-radius on all cards, buttons, tags, and game tiles — the system is sharp and industrial
- Use the yellow (#ffd800) badge label pattern above headlines: 11px Segoe UI weight 600, uppercase, 0.075em letter-spacing, 0px radius, 2px 8px padding
- Use #9bf00b lime green only for primary promotional action buttons — let its rarity amplify its impact
- Use the 46px/1.20 Segoe UI weight 700 as the maximum display size — do not go larger
- Pair a filled action button with a ghost text link (chevron-suffixed) in the same row for primary+secondary actions
- Let game artwork fill its container edge-to-edge with no padding, border, or decorative frame
- Use #107c10 for all green accents — text, icons, section headers, promotional band fills — it is the system's only chromatic identity color

### Don't
- Do not use rounded corners on cards, buttons, or tiles — the system is deliberately sharp
- Do not use multiple greens in the same component — pick #107c10, #054b16, or #9bf00b based on context, never blend
- Do not use #9bf00b as a background fill for large surfaces — it is a button-accent color, not a section color
- Do not exceed 46px for display text — the scale is compressed and catalog-like
- Do not use color to indicate hover or focus states on light backgrounds — use weight changes or underline instead
- Do not place game artwork inside rounded containers, with drop shadows, or with decorative borders — artwork is always raw and edge-to-edge
- Do not use the 0.075em wide letter-spacing on anything longer than 20 characters or below 11px — it is a badge-label pattern, not body text treatment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas White | `#ffffff` | Page background, card surfaces, light section bands |
| 1 | Ash Gray | `#f2f2f2` | Footer background, alternating section bands, subtle separation |
| 2 | Ink Black | `#000000` | Dark section backgrounds (promotional bands, hero overlays, game art containers) |
| 3 | Xbox Green | `#107c10` | Brand-colored promotional section fills (Game Pass bands) |
| 4 | Caution Yellow | `#ffd800` | Badge and tag surface layer — sits above all other surfaces as a label |

## Imagery

Game artwork dominates the visual language — full-bleed key art on heroes, cover art in catalog grids, and character renders in feature blocks. Treatment is always edge-to-edge with no rounded corners, 0px radius, no decorative frames. Product photography (controllers, consoles, handhelds) is studio-lit on neutral or contextual backgrounds, never lifestyle. Game art varies wildly in palette (dark fantasy, neon sci-fi, vibrant cartoon) but is always presented at maximum scale with minimal padding. The only consistent visual across all imagery is the sharp rectangular crop — no rounded masks, no soft edges, no decorative overlays. Icons are uniformly outlined in #107c10 at ~1.5px stroke weight.

## Layout

Full-bleed sections that span edge-to-edge with no max-width constraint. Hero is a full-width dark band with game key art filling the entire visual area and text overlaid in the right third. Below the hero: a centered 6-column icon row on white, followed by a multi-column game tile grid (4-6 tiles per row, 0px gaps). The page alternates between white and full-bleed image sections — Game Pass promotional block (solid green fill), then dark seasonal offers, then white content blocks, then dark product showcases. Content blocks are typically 50/50 split layouts (text left, image right) or full-width image with overlaid text. Navigation is a fixed top bar with a Microsoft co-brand slot. Section vertical rhythm is ~48-64px between major bands. The overall density is catalog-like — many sections, compact cards, information-forward.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (primary), #262626 (body), #616161 (muted/secondary)
- background: #ffffff (canvas), #f2f2f2 (band), #000000 (dark section)
- border: #f2f2f2 (hairline), #107c10 (brand accent)
- accent: #107c10 (Xbox green), #9bf00b (volt lime highlight)
- label badge: #ffd800 background + #000000 text
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a hero banner: full-bleed dark game artwork background. Yellow badge label at top ("NEW SEASON") with #ffd800 background, #000000 text, 0px radius, 2px 8px padding, 11px Segoe UI weight 600 uppercase, letter-spacing 0.075em. Headline at 46px Segoe UI weight 700, #ffffff, line-height 1.20. Subtext at 15px weight 400, #ffffff. A #9bf00b filled action button (8px 16px padding, 0px radius, 15px SegoeProBlack weight 600) beside a ghost text link ("VIEW DETAILS ›") in 13px weight 600 white uppercase.
2. Create a Game Pass promotional section: full-width #107c10 green background. Left half: 24px Segoe UI weight 700 #ffffff headline + 15px body copy. A #9bf00b button at bottom-left. Right half: 2×2 grid of game cover thumbnails (0px radius, 16px gap, each ~200px wide).
3. Create a category icon row: white background, 6 equally-spaced icon+label columns. Each icon is 48px outlined in #107c10 at 1.5px stroke. Label below in 13px Segoe UI weight 600, #107c10, uppercase, letter-spacing 0.075em.
4. Create a feature block (text + product): 50/50 two-column split. Left: yellow badge label, 24px headline in #000000, 15px body in #262626, ghost text action link in 13px weight 600 uppercase. Right: product device render on neutral background, 0px radius.
5. Create a game tile card: rectangular card filled with game cover artwork edge-to-edge (0px radius, no border, no shadow). Game title in 15px Segoe UI weight 600 #000000 below the image.

## Typography Philosophy

Xbox.com uses a single typeface family (Segoe UI) at a compressed scale — the largest size is 46px, which is modest for a hero headline. This restraint is deliberate: the catalog and game artwork carry visual weight, not typography. Two letter-spacing values define the system: -0.01em for body text (tight, efficient reading) and 0.075em for 11px uppercase labels (wide, attention-grabbing badges). The wide-tracked uppercase labels are a signature device — they appear as category tags, seasonal markers, and edition indicators throughout. The custom SegoeProBlack at weight 900 is used sparingly on small button labels where extra weight pushes readability past standard bold.

## Similar Brands

- **PlayStation Store** — Same full-bleed game artwork catalog approach with sharp rectangular tiles and dark-on-light contrast
- **Steam Store** — Dense tile-grid game catalog with edge-to-edge cover art and compact information density
- **Nintendo eShop** — Bright white canvas with game artwork as the dominant visual element and minimal typographic ambition
- **Epic Games Store** — Game-artwork-first storefront with full-bleed hero sections and category-driven navigation
- **Microsoft Store** — Shares Segoe UI typography and the Microsoft design language — Xbox extends the parent system's visual rules into gaming

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-xbox-green: #107c10;
  --color-forest-green: #054b16;
  --color-volt-lime: #9bf00b;
  --color-caution-yellow: #ffd800;
  --color-ink-black: #000000;
  --color-pure-white: #ffffff;
  --color-carbon: #333333;
  --color-ash-gray: #f2f2f2;
  --color-steel: #616161;
  --color-graphite: #262626;
  --color-smoke: #999999;

  /* Typography — Font Families */
  --font-segoe-ui: 'Segoe UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-segoeproblack: 'SegoeProBlack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: 0.83px;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --text-display: 46px;
  --leading-display: 1.2;
  --tracking-display: -0.46px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-43: 43px;
  --spacing-50: 50px;
  --spacing-71: 71px;

  /* Layout */
  --section-gap: 48-64px;
  --card-padding: 8-12px;
  --element-gap: 8-16px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-buttons: 0px;
  --radius-gametiles: 0px;

  /* Surfaces */
  --surface-canvas-white: #ffffff;
  --surface-ash-gray: #f2f2f2;
  --surface-ink-black: #000000;
  --surface-xbox-green: #107c10;
  --surface-caution-yellow: #ffd800;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-xbox-green: #107c10;
  --color-forest-green: #054b16;
  --color-volt-lime: #9bf00b;
  --color-caution-yellow: #ffd800;
  --color-ink-black: #000000;
  --color-pure-white: #ffffff;
  --color-carbon: #333333;
  --color-ash-gray: #f2f2f2;
  --color-steel: #616161;
  --color-graphite: #262626;
  --color-smoke: #999999;

  /* Typography */
  --font-segoe-ui: 'Segoe UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-segoeproblack: 'SegoeProBlack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: 0.83px;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --text-display: 46px;
  --leading-display: 1.2;
  --tracking-display: -0.46px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-43: 43px;
  --spacing-50: 50px;
  --spacing-71: 71px;
}
```
