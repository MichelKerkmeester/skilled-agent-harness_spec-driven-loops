# Julia Krantz — Style Reference
> Darkroom contact sheet — a grid of photographic tiles on pure black, identity spelled in barely-visible weight-300 letterforms.

**Theme:** dark

Julia Krantz's portfolio operates like a darkroom contact sheet — dense grid of image tiles on near-black, with stark white typography hovering over photography. The canvas is #000000, surfaces are pure darkness, and the only warmth comes from the photographic content inside each tile. Typographic restraint is extreme: ClashDisplay at weight 300 for large display initials (the abbreviated project codes 'Se', 'Fd', 'Ga') creates a barely-there identity mark, while DM Sans at weight 300 handles all body and navigation at 10-14px with wide tracking. The grid is the interface — a mosaic of image tiles with 1px solid rgba(248,248,248,0.12) borders separating them, no rounded corners anywhere, no shadows, no gradients. Color is entirely absent from the UI layer; all chromatic interest is delegated to the photography.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, all section backgrounds — the true floor of the UI; every element floats above absolute black |
| Salt | `#f8f8f8` | `--color-salt` | All text, links, nav labels, borders, icons — the single foreground tone serving every text and UI edge function against black |
| Ash | `#707070` | `--color-ash` | Secondary labels, muted nav text, subdued body copy — mid-tone for visual hierarchy without introducing any hue |
| Ghost Line | `rgba(248,248,248,0.12)` | `--color-ghost-line` | Grid tile borders, dividers — rgba(248,248,248,0.12) at 12% opacity; nearly invisible structural seams |
| Veil | `rgba(248,248,248,0.45)` | `--color-veil` | Overlay labels, secondary text on image tiles — rgba(248,248,248,0.45) at 45% opacity for text sitting over photography |

## Tokens — Typography

### DM Sans — All body copy, navigation labels, press list items, links, captions. Weight 300 across every size — the site refuses to bold anything in this family, keeping the text layer visually quiet against photography. · `--font-dm-sans`
- **Substitute:** DM Sans (Google Fonts — same family)
- **Weights:** 300
- **Sizes:** 10px, 12px, 13px, 14px
- **Line height:** 1.30 – 1.72
- **Letter spacing:** 0.06em at small sizes (10-12px), 0.07em at 13-14px — wide tracking compensates for the light weight at small sizes
- **Role:** All body copy, navigation labels, press list items, links, captions. Weight 300 across every size — the site refuses to bold anything in this family, keeping the text layer visually quiet against photography.

### ClashDisplay — Project initials on tiles (44px weight 300, tracking -0.04em), section codes and labels (12-14px weight 300, tracking +0.05em to +0.14em), name logotype. The 44px weight-300 display setting — a nearly invisible letterform over a photograph — is the signature visual move of the portfolio. · `--font-clashdisplay`
- **Substitute:** Cabinet Grotesk (Fontshare) or Space Grotesk (Google Fonts)
- **Weights:** 300, 500
- **Sizes:** 10px, 12px, 14px, 29px, 44px
- **Line height:** 1.00 at display / 1.72 at text sizes
- **Letter spacing:** -0.04em at 44px display; +0.04em to +0.14em at 10-14px label sizes
- **Role:** Project initials on tiles (44px weight 300, tracking -0.04em), section codes and labels (12-14px weight 300, tracking +0.05em to +0.14em), name logotype. The 44px weight-300 display setting — a nearly invisible letterform over a photograph — is the signature visual move of the portfolio.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | 0.6px | `--text-caption` |
| heading | 29px | 1 | -1.16px | `--text-heading` |
| display | 44px | 1 | -1.76px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| tiles | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 30px
- **Card padding:** 16px
- **Element gap:** 6px

## Components

### Project Grid Tile
**Role:** Primary portfolio navigation — each tile is a cropped photograph with abbreviated project code overlaid

Full-bleed photograph filling the tile. No border-radius (0px). Border: 1px solid rgba(248,248,248,0.12). Project code (e.g. 'Cd', 'Ga') in ClashDisplay 44px weight 300, #f8f8f8, letter-spacing -0.04em, positioned top-left with 16px padding. Sequential number ('01', '02') in DM Sans 10px weight 300, #707070, top-left above the code. Practice/category label in DM Sans 10px weight 300, tracking 0.14em, #707070 below project name. Hover: filter: brightness(0.82) transition 0.4s ease.

### Name Logotype
**Role:** Primary identity mark in the top-left header

ClashDisplay weight 500, approximately 29px, #f8f8f8, letter-spacing -0.04em. Sits against #000000 background with 16px left padding. No decoration, no logo mark — text is the entire brand.

### Navigation Link
**Role:** Top-right global nav: Magic Fabric ↗, Bio, Contact

DM Sans 12px weight 300, #f8f8f8, letter-spacing 0.06em. External links include '↗' glyph appended directly. No underline by default. Color transitions to rgba(248,248,248,0.45) on hover over 0.2s ease. No background, no border, no padding block.

### About Bio Block
**Role:** Multi-column text section with label headers

Background #000000. Column header label (e.g. 'ABOUT', 'PRESS') in DM Sans 10px weight 300, #707070, letter-spacing 0.07em, uppercase. Body text in DM Sans 13px weight 300, #f8f8f8, line-height 1.72. Paragraph margin-bottom 3px. Column gap 20-32px. Top border: 1px solid rgba(248,248,248,0.12) separating from header.

### Press List Item
**Role:** Numbered external press links within the bio section

DM Sans 12px weight 300, #f8f8f8. Number prefix in #707070. '↗' arrow glyph after publication name. Spacing: margin-bottom 3-4px per item. On hover: color transitions from #f8f8f8 to rgba(248,248,248,0.45) over 0.2s ease.

### Email CTA Link
**Role:** Contact email in the top-right of the header, the site's only direct CTA

DM Sans 12px weight 300, #f8f8f8. Followed by ' →' directional arrow. Letter-spacing 0.06em. Small dot indicator (8px circle, #f8f8f8) sits adjacent — likely an availability indicator. No button chrome — plain text link on black.

### Section Divider
**Role:** Horizontal rule separating header from bio section and bio section from grid

1px solid rgba(248,248,248,0.12). Full-width of container. No margin offset — content begins immediately below.

### Category Label
**Role:** Small uppercase tag beneath project initials on tiles

DM Sans 10px weight 300, #707070, letter-spacing 0.14em. Values: 'PRACTICE', 'ARCHIVE', 'BLOG'. All-caps text transform. No background, no border — pure typographic label.

### Archive Year Badge
**Role:** Year label on archive tiles (e.g. '· 2009', '· 2011')

DM Sans 10px weight 300, rgba(248,248,248,0.45). Preceded by middot separator. Inline after project title on tile.

## Do's and Don'ts

### Do
- Use #000000 for all backgrounds — the CSS token --bg: #000 is absolute; never substitute dark gray or near-black
- Set all ClashDisplay display headings (44px tile codes) at weight 300 with letter-spacing -0.04em — the ultra-light setting against photography is the signature move
- Apply 1px solid rgba(248,248,248,0.12) for every structural border: tile separators, section dividers, column rules
- Keep all interactive hover states to color/filter transitions only — color: rgba(248,248,248,0.45) for links, filter: brightness(0.82) for image tiles, 0.2s ease
- Use 0px border-radius on every element — tiles, any containers, any interactive elements. The sharp-corner rule is absolute
- Maintain DM Sans weight 300 for all body, nav, and label text — no bold text anywhere in the UI layer
- Express secondary hierarchy through #707070 (section labels, numbers, category tags) — never through size increases or weight changes

### Don't
- Never add any color to the UI chrome — buttons, links, labels, borders must remain in the #f8f8f8 / #707070 / rgba opacity system only
- Never round corners — no border-radius on tiles, containers, or any interactive element; 0px is non-negotiable
- Never use font weight above 500 — ClashDisplay 500 is the ceiling and used only for the name logotype; DM Sans stays at 300
- Never add box-shadows or elevation — the design has zero shadow tokens; depth comes from contrast with the black canvas only
- Never add hover backgrounds or button fills — interactive states change text opacity or image brightness only, never add a background color
- Never introduce gradients, overlays, or tinted backgrounds — the CSS tokens confirm no gradient system exists; #000 is the only background
- Never separate the category label from its tile project code with more than 4px margin — the tight stacking (4px marginBottom between elements) is the spatial rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void Canvas | `#000000` | Base page background, section backgrounds, nav bar |
| 2 | Image Tile | `#111111` | Grid project tiles — filled with photography, bordered by Ghost Line 1px |

## Elevation

Zero shadows across the entire system. Depth is created purely by the contrast between the black canvas and photographic tile content. No box-shadow values appear anywhere; the 1px rgba(248,248,248,0.12) border is the only surface separator. Hover states use filter: brightness(0.82) — darkening the image rather than lifting the element.

## Imagery

Photography-dominant — every project grid tile is a full-bleed photographic crop: fashion portraiture, macro textile/material studies, AI-generated imagery, event photography. Photographs are raw-edged, sharp-cornered, zero border-radius. Images are not contained or padded — they fill their tile completely, edge to edge. No lifestyle staging context visible; images are treated as abstract color fields at tile scale, only readable as subjects when enlarged. Color in the UI exists exclusively within these photographs — from vivid AI-generated chromatics to desaturated fashion editorial. The photographic density IS the design: at the grid scale, the tiles form a chromatic mosaic against black. Icons: minimal use of directional glyphs ('↗', '→') inline with text, no standalone icon components. No illustrations, no 3D renders in the UI chrome.

## Layout

Full-bleed, no max-width container. Header bar spans full width: name logotype pinned left, email and nav pinned right, both at 16px horizontal padding. Bio section below header uses a multi-column horizontal layout — approximately 4-5 text columns (About, Press, Speaking, Podcasts, Links) filling full width with 20-32px column gaps. Grid section below bio: 10-column mosaic of variable-width tiles in rows, each tile filled with photography. Tiles vary in width — some span one column, some two — creating a journalistic contact-sheet rhythm. No gutters visible between tiles except the 1px Ghost Line border. Navigation is a minimal top-right inline set of 3 links. No sidebar, no sticky header. The entire page scrolls vertically with no section anchoring or visual dividers beyond the Ghost Line horizontal rule.

## Agent Prompt Guide

**Quick Color Reference**
- Page background: #000000
- Primary text / all UI elements: #f8f8f8
- Secondary / muted text: #707070
- Borders / dividers: rgba(248,248,248,0.12)
- Overlay text on images: rgba(248,248,248,0.45)
- No accent colors exist — the palette is purely achromatic

**Example Component Prompts**

1. **Project Grid Tile**: Black background tile with full-bleed photograph. Top-left: sequential number in DM Sans 10px weight 300 #707070, then project code (e.g. 'Fd') in ClashDisplay 44px weight 300 #f8f8f8 letter-spacing -0.04em, then category label 'PRACTICE' in DM Sans 10px weight 300 #707070 letter-spacing 0.14em. All text padded 16px from edges. Border: 1px solid rgba(248,248,248,0.12). Border-radius: 0px. Hover: filter brightness(0.82) transition 0.2s ease.

2. **Page Header**: Full-width bar, #000000 background, 16px horizontal padding, 52px height. Left: 'Julia Krantz' in ClashDisplay 29px weight 500 #f8f8f8 letter-spacing -0.04em. Right: 'julia@magicfabricblog.com →' in DM Sans 12px weight 300 #f8f8f8 with small dot indicator, then nav links 'Magic Fabric ↗', 'Bio', 'Contact' in DM Sans 12px weight 300 #f8f8f8 letter-spacing 0.06em, 32px gap between items. Bottom border: 1px solid rgba(248,248,248,0.12).

3. **Bio Multi-Column Section**: #000000 background, 16px padding, 5 columns with 32px gaps. Each column starts with an uppercase label ('ABOUT', 'PRESS') in DM Sans 10px weight 300 #707070 letter-spacing 0.07em, margin-bottom 4px. Body text in DM Sans 13px weight 300 #f8f8f8 line-height 1.72. Numbered list items use #707070 for the number and #f8f8f8 for the link text. External links append '↗' glyph.

4. **Category Label / Tag**: DM Sans 10px weight 300 #707070 letter-spacing 0.14em. Uppercase. No background, no border, no padding. Values are 'PRACTICE', 'ARCHIVE', or 'BLOG'. Sits 4px below project title.

## Motion System

Two-tier transition system: fast micro-interactions at 0.2s ease for color state changes on hover (links, labels), slower content transitions at 0.4s ease for image filter changes (tile brightness). The single custom easing cubic-bezier(0.22, 0.61, 0.36, 1) is reserved for transforms — a deceleration curve suggesting controlled arrival. No entry animations, no scroll-triggered effects visible. The motion philosophy is minimal: only hover feedback, nothing decorative.

## Grid Architecture

The project grid is a mosaic with no fixed column count — tiles appear to vary in width (single-column vs double-column span) creating a contact-sheet irregularity. All tiles are flush to each other with 0px gap; the only visual separator is the 1px Ghost Line border. Tile height appears uniform within rows. Sequential numbering (01-13 visible) runs left-to-right, top-to-bottom. The grid is full-bleed with 0px page margins — tiles extend to browser edge. This flat, card-free, shadow-free grid is the dominant layout paradigm of the entire site.

## Similar Brands

- **Hiepler & Brunier (photographer portfolio)** — Same black-canvas grid-of-photographs approach where photography provides all color and UI chrome is pure white typography on black
- **Bureau Borsche** — Identical ultra-light weight-300 display typography as identity mark, with text-only brand and no decorative UI elements
- **Cargo Collective (minimal dark template)** — Same mosaic grid of full-bleed images with zero-radius tiles and typographic labels floating over photography
- **Koto Studio portfolio** — Shared achromatic UI-layer philosophy where brand color is entirely absent from chrome and delegated to content imagery

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-salt: #f8f8f8;
  --color-ash: #707070;
  --color-ghost-line: #f8f8f8;
  --gradient-ghost-line: rgba(248,248,248,0.12);
  --color-veil: #f8f8f8;
  --gradient-veil: rgba(248,248,248,0.45);

  /* Typography — Font Families */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clashdisplay: 'ClashDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.6px;
  --text-heading: 29px;
  --leading-heading: 1;
  --tracking-heading: -1.16px;
  --text-display: 44px;
  --leading-display: 1;
  --tracking-display: -1.76px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;

  /* Layout */
  --section-gap: 30px;
  --card-padding: 16px;
  --element-gap: 6px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-tiles: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-image-tile: #111111;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-salt: #f8f8f8;
  --color-ash: #707070;
  --color-ghost-line: #f8f8f8;
  --color-veil: #f8f8f8;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clashdisplay: 'ClashDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.6px;
  --text-heading: 29px;
  --leading-heading: 1;
  --tracking-heading: -1.16px;
  --text-display: 44px;
  --leading-display: 1;
  --tracking-display: -1.76px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
}
```
