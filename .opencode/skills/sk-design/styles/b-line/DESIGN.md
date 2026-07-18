# B—Line — Style Reference
> Monospaced editorial museum catalog — achromatic typographic grid where the wordmark out-sizes every product.

**Theme:** light

B—Line operates as an editorial product index rather than a marketing site — the brand name itself is the hero, rendered at architectural scale before any product imagery appears. The palette is intentionally colorless: pure black, white, and a single mid-gray carry every text, border, and surface decision. Monospace typography (HELVMONO) dominates body, navigation, and metadata, giving every label the feel of a museum catalog entry. Product photography is treated as object documentation: uniform gray studio backdrops, tight crops, and zero lifestyle staging. Surfaces stay flat — no elevation, no decorative gradients, no rounded corners beyond a few subtle link treatments. The result is a Swiss-inflected minimalism where the absence of color and decoration is the statement.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, all borders, nav link color, product card frame, massive hero wordmark — the structural color of the entire system |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card backgrounds, image backgrounds, inverted text on dark controls |
| Graphite | `#595959` | `--color-graphite` | Muted secondary text, tertiary borders, inactive UI elements |

## Tokens — Typography

### HELVMONO — Primary interface font — all body text, navigation links, product names, section labels, card metadata. The monospaced character set is the signature choice; it makes even navigation read like a technical catalog. A 14px size with 1.0–1.3 line-height creates a dense, label-like rhythm. · `--font-helvmono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.0–1.3
- **Letter spacing:** normal
- **Role:** Primary interface font — all body text, navigation links, product names, section labels, card metadata. The monospaced character set is the signature choice; it makes even navigation read like a technical catalog. A 14px size with 1.0–1.3 line-height creates a dense, label-like rhythm.

### helvetica-bold — Footer/legal micro-copy and secondary link text. The 12px size with 2.5 line-height signals fine-print territory. · `--font-helvetica-bold`
- **Substitute:** Helvetica Neue Bold, Inter, Arial
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.13–2.5
- **Letter spacing:** normal
- **Role:** Footer/legal micro-copy and secondary link text. The 12px size with 2.5 line-height signals fine-print territory.

### -apple-system — Button labels and the dominant system fallback for interactive elements. The bold weight creates a single moment of typographic contrast against the 400-weight monospace body. · `--font-apple-system`
- **Substitute:** system-ui, -apple-system, BlinkMacSystemFont
- **Weights:** 700
- **Sizes:** 14px
- **Line height:** 2.71
- **Letter spacing:** normal
- **Role:** Button labels and the dominant system fallback for interactive elements. The bold weight creates a single moment of typographic contrast against the 400-weight monospace body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 2.5 | — | `--text-caption` |
| body | 14px | 1.3 | — | `--text-body` |
| display | 220px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

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
| 16 | 16px | `--spacing-16` |
| 22 | 22px | `--spacing-22` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 14.4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.15) 0px 0px 0px 1px` | `--shadow-subtle` |

### Layout

- **Section gap:** 32px
- **Card padding:** 4px
- **Element gap:** 5px

## Components

### Hero Wordmark
**Role:** Brand identity element and first-screen focal point

The text 'B—Line' rendered at ~220px line-height 1.0 in a heavy sans-serif (not the body monospace). Occupies nearly the full viewport width. Letter-spacing is wide to stretch the wordmark across the canvas. Color is #000000 on #ffffff. The dash between B and Line is a long em-dash, becoming a visual line in itself — reinforcing the brand name literally.

### Primary Navigation
**Role:** Site-wide top navigation

Horizontal row at the top of every page, no background fill. Brand mark 'B—Line' at far left in monospace 14px #000. Nav groups (Prodotti, Designer, News, About B—Line, Area Stampa) in HELVMONO 14px #000 with 7px right margin between links. Right side holds language toggle (IT/EN) and a small circular dark mode/accessibility toggle. No dropdowns, no dividers — just text on white.

### Nav Sub-Label
**Role:** Secondary descriptor under primary nav links

HELVMONO 12–14px #000 text directly below certain nav items (e.g., 'Designer' under Prodotti, 'Download' under News, 'Contact' under About, 'Registrazione' under Area Stampa). Functions as a static breadcrumb/expansion hint without interaction.

### Product Grid Card
**Role:** Individual product tile in the catalog grid

Square aspect ratio. Product image fills the frame with a uniform #000000 1px hairline border (no radius, no shadow). Product name in HELVMONO 14px #000 sits in the top-left corner of the card, overlaying the image. 4px padding on sides. No background fill on the card itself — the image is the surface.

### Product Grid
**Role:** Catalog index layout

4-column grid spanning full viewport width. No gutters between cards — they sit edge-to-edge. Cards are arranged in rows with identical square dimensions. No headings, no section dividers — the grid is the content. A small teal chat-bubble icon appears in the bottom-right corner as a floating utility.

### Language Toggle
**Role:** Site language switcher

IT / EN text pair in HELVMONO 14px #000, inline in the top-right nav. No button chrome, no border — just monospaced letters separated by a slash.

### Outlined Button
**Role:** Secondary interactive control

Transparent background, 1px #000 border with 4px radius, 16px top/right/bottom margin, system-ui bold 14px #000 text. Used sparingly. No fill state in the observed system — these are ghost controls.

### Hairline Link
**Role:** Inline link treatment

HELVMONO 14px #000 text, no underline by default. Some links carry a 14.4px border-radius pill treatment (likely the current page indicator). Links inherit the monospace body — no visual differentiation between link and body text beyond hover state.

### Brand Mark
**Role:** Compact wordmark for header and footer

'B—Line' in HELVMONO 14px #000 with a full em-dash separator. The dash is a typographic device that visually splits the name into two components, echoing the product naming convention (Boby, Ring, Spinny).

## Do's and Don'ts

### Do
- Use HELVMONO (or IBM Plex Mono / JetBrains Mono) at 14px for all body, nav, and product label text
- Keep the palette strictly achromatic — #000000, #ffffff, and #595959 only
- Apply 1px solid #000000 borders to product card images with 0px radius and no shadow
- Let the 'B—Line' wordmark dominate the hero at 180–240px in a heavy sans-serif, full viewport width
- Use 4px base unit for all spacing — element gaps of 5–7px, card padding of 4px, section gaps of 32px
- Render product photography on uniform neutral gray studio backdrops with tight, centered crops
- Maintain full-bleed layouts — no centered max-width container, content runs edge-to-edge

### Don't
- Never introduce chromatic color — no blues, reds, greens, or accent hues; the system is intentionally colorless
- Never use shadows, elevation, or gradients on cards or surfaces — flatness is structural
- Never use rounded corners above 4px on containers — the design is rectilinear
- Never set body text above 14px in HELVMONO — the monospace is meant for labels, not paragraphs
- Never add decorative imagery, lifestyle photography, or background textures to the interface
- Never use a serif or proportional body font — monospace is the identity, not a stylistic choice
- Never add section dividers, background tints, or visual breaks between grid rows — let the grid be continuous

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Base background for the entire site — no gradient, no texture, pure white |
| 2 | Product Frame | `#000000` | Hairline 1px black border around each product card image — the only 'frame' in the system |

## Elevation

The design deliberately uses no elevation. Surfaces are flat; cards carry no shadow, relying on a 1px #000000 hairline border to define their edge. The only shadow-like effect in the extracted data is a 0px-spread 1px outline on one button — effectively a border, not a shadow. Flatness is structural to the editorial-catalog aesthetic.

## Imagery

Product photography only — no lifestyle, no editorial, no people. Each piece is shot on a uniform neutral gray studio backdrop (#d4d4d4-ish) with soft even lighting and a tight centered crop. Products float on the background with no pedestal, no scale reference, and no context. The image is the entire product surface inside its hairline black frame. No illustrations, no icons beyond a single small utility chat-bubble glyph. Iconography is minimal to absent — navigation is text-only. The visual language is museum documentation, not commerce.

## Layout

Full-bleed edge-to-edge layout with no centered max-width container. Hero is a massive centered wordmark ('B—Line' at ~220px) that fills the viewport width with the brand name, followed immediately by a compact horizontal nav bar (brand mark left, nav groups center, language toggle right). The product grid begins directly below in a seamless 4-column layout with zero gutters, continuing row after row of square product cards. Each card is image + top-left monospace label, with 1px black hairline borders forming a continuous grid pattern. No section backgrounds alternate — the entire page is white. A single floating chat-bubble icon sits in the bottom-right corner. Density is compact and catalog-like; vertical rhythm comes from identical card heights repeating rather than from section spacing.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border: #000000 (1px hairline)
- muted text: #595959
- primary action: no distinct CTA color
- accent: none (achromatic system)

3-5 Example Component Prompts:
1. Create a hero section: white #ffffff background, no padding above. Center the text 'B—Line' at 220px line-height 1.0 in a heavy sans-serif (Helvetica Bold or system-ui bold), color #000000, with a long em-dash between B and Line. The wordmark should stretch to fill 90% of viewport width.

2. Create a product grid card: square aspect ratio, 1px solid #000000 border with 0px radius, no shadow, no background fill. Product image fills the card. Product name in HELVMONO 14px #000000, positioned absolute top-left with 4px padding.

3. Create a navigation bar: full-width white background, no border, 16px vertical padding. Left: 'B—Line' brand mark in HELVMONO 14px #000000. Center-left: nav items 'Prodotti', 'News', 'About B—Line', 'Area Stampa' in HELVMONO 14px #000000 with sub-labels ('Designer', 'Download', 'Contact', 'Registrazione') in 12px below. Right: 'IT / EN' language toggle in HELVMONO 14px #000000. 7px gap between nav links.

4. Create a product grid: 4 equal columns, full viewport width, no gutters between columns, rows of square product cards. White #ffffff page background. No section headings, no dividers between rows — continuous grid.

5. Create an outlined button: transparent background, 1px solid #000000 border, 4px border-radius, system-ui 14px bold #000000 text, 16px top/right/bottom margin, inline padding ~12px horizontal. Ghost/inverted style only — no filled state.

## Similar Brands

- **Vitra** — Same Swiss-inflected product catalog approach with edge-to-edge grids, minimal typographic navigation, and flat product photography on neutral backgrounds
- **Established & Sons** — Full-bleed product grid with hairline borders, monospaced-adjacent label typography, and zero decorative chrome — the object is the design
- **HAY** — Compact product index layout with full-width grid tiles and minimal navigation — though HAY introduces color where B—Line refuses to
- **MUJI** — Achromatic restraint, monospaced labels, and flat product documentation aesthetic — the catalog-as-design philosophy
- **Fantastic Furniture (edit brands like Massproductions)** — Edge-to-edge product grids, typographic minimalism, and the museum-object treatment of each furniture piece

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-graphite: #595959;

  /* Typography — Font Families */
  --font-helvmono: 'HELVMONO', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica-bold: 'helvetica-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2.5;
  --text-body: 14px;
  --leading-body: 1.3;
  --text-display: 220px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-22: 22px;

  /* Layout */
  --section-gap: 32px;
  --card-padding: 4px;
  --element-gap: 5px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 14.4px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 14.4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-product-frame: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-graphite: #595959;

  /* Typography */
  --font-helvmono: 'HELVMONO', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica-bold: 'helvetica-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2.5;
  --text-body: 14px;
  --leading-body: 1.3;
  --text-display: 220px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-22: 22px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 14.4px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px;
}
```
