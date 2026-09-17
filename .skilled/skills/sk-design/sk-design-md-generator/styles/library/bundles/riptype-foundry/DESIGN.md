# Riptype Foundry — Style Reference
> ink on black paper — the type is the only bright thing in the room

**Theme:** dark

Riptype is a specimen-book for a type foundry: a dark matte canvas the type sits on like ink on black paper. Monochrome structure is absolute — the only chromatic element is a single acid yellow-green (#d9ff00) that functions as a signal flare, marking interactive moments and decorative accents without ever becoming decorative. Typography is the product, so the layout is dense and editorial, with characters rendered at spec-sheet size and minimal chrome between them. Components are flat, border-driven, and near-invisible — the system gets out of the way so the typeforms can speak. The mood is workshop-dark: process-oriented, print-referenced, confident in restraint.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Workshop Black | `#121212` | `--color-workshop-black` | Page background, primary canvas — the dark surface the type sits on |
| Platen Gray | `#292929` | `--color-platen-gray` | Raised surface for buttons, hover fills, interactive plate |
| Bone | `#d0d0d0` | `--color-bone` | Default body text, link strokes, hairline rules, icon outlines |
| Ash | `#a0a0a0` | `--color-ash` | Secondary text, metadata, subdued borders and captions |
| Paper White | `#ffffff` | `--color-paper-white` | Headings, display type, high-contrast text, image borders |
| Acid Flash | `#d9ff00` | `--color-acid-flash` | Green outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### Office — Sole typeface — used for navigation, body, buttons, specimens, and display. The foundry sells custom type so the UI type IS the product showcase. Weights 400 (regular) for UI and body, 700 (bold) for the large display announcement and emphasis. · `--font-office`
- **Substitute:** Inter (system fallback) or any clean geometric grotesque
- **Weights:** 400, 700
- **Sizes:** 12, 16, 43
- **Line height:** 0.95–1.58 (context-dependent: 0.95 for tight display, 1.58 for body)
- **Letter spacing:** 0.015em–0.016em for body and UI; 0.083em (wide) for tracked labels and display specimens
- **Role:** Sole typeface — used for navigation, body, buttons, specimens, and display. The foundry sells custom type so the UI type IS the product showcase. Weights 400 (regular) for UI and body, 700 (bold) for the large display announcement and emphasis.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.19 | 0.083px | `--text-caption` |
| body | 16px | 1.58 | 0.016px | `--text-body` |
| display | 43px | 1 | 0.083px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| pills | 144px |
| buttons | 4px |

### Layout

- **Section gap:** 84px
- **Card padding:** 13px
- **Element gap:** 6px

## Components

### Sidebar Nav Link
**Role:** Primary navigation entry

Text link in Office 400 at 12–16px, color #d0d0d0 with optional #a0a0a0 hover. Preceded by a small icon mark. Zero radius, no background, separated by hairline #d0d0d0 borders at 1px. No fill state — selected items are implied by absence of stroke or by icon color shift.

### Acid Download Pill
**Role:** Primary CTA — the single most important action on the site

Pill-shaped button at 144px radius, background transparent, 1px #d9ff00 border. Text in Office 400, #d9ff00, 12px with 0.083em letter-spacing. 8px vertical padding, 13px horizontal padding. Small download icon glyph precedes the label. This is the only filled-feeling button in the system — its signal value depends on the rarity of the green.

### Platen Button
**Role:** Secondary action, secondary CTA

Standard button at 4px radius, background #292929, text #ffffff in Office 700, 12px. 6px vertical / 13px horizontal padding. Used when a surface-level interactive element is needed but the acid green pill is too loud.

### Font Specimen Row
**Role:** Core content unit — the product itself

Horizontal row pairing a font name label (Office 400, 16px, #ffffff) with a large character specimen (43px+ display, #d0d0d0 or #ffffff, letter-spacing 0.083em). Dotted #a0a0a0 underline below the specimen. No card chrome — the type sits directly on the black canvas. 7px row gap between specimens creates the dense specimen-book feel.

### Annotation Block
**Role:** Descriptive copy paired with specimens

Left-aligned text in Office 400, 16px, #d0d0d0, line-height 1.58. Tight column, 13px right padding from the next element. Headings and first letters in #ffffff for contrast within the same block.

### Custom Type Image Card
**Role:** Showcase of a commissioned type project

Full-bleed image in a square or rectangular frame with 1px #d0d0d0 border. No radius, no shadow. Caption may sit above or below in 12px #a0d0d0. The image IS the card — no padding around it.

### Release Announcement Panel
**Role:** Featured product launch banner

Full-width red (#d8261b) block with a grain/noise texture overlay. White display type at 43px, weight 700, letter-spacing 0.083em, centered. Sits between sidebar and image column, breaking the black/white rhythm. This is the one place saturated red appears — it earns its presence by being the only block that breaks monochrome.

### Decorative Star Mark
**Role:** Ornamental accent on nav and section headers

Small star icon in #d9ff00, placed at the start of section headers. Not interactive. Functions as the visual equivalent of a printer's ornament — a moment of color punctuation.

### Cart Badge
**Role:** Persistent shopping indicator

Circular badge at bottom-left, 4px radius approximation, #d9ff00 fill, #121212 text in Office 700, 12px. Minimal label, always visible.

### Section Header
**Role:** Major content section title

Office 400 at 16px, #ffffff, left-aligned, often paired with a #d9ff00 star mark. 6px top margin from section boundary. The text is small but white-on-black gives it full weight.

## Do's and Don'ts

### Do
- Use #d9ff00 exclusively for the Download Pill CTA and decorative star marks — the acid green's power comes from scarcity
- Pair all body text (#d0d0d0) with the Workshop Black (#121212) canvas — contrast ratio 12.2:1 exceeds AAA
- Set type specimens at 43px+ with 0.083em letter-spacing to give the display characters room to demonstrate their own proportions
- Use 6px as the default element gap; 7px rowGap is the specimen-book rhythm
- Communicate elevation through surface tone (#121212 → #292929) and 1px #d0d0d0 hairlines, never through shadows
- Keep radius at 0px for cards and images — the only rounded elements are the 144px pill CTA and the 4px standard button
- Default to Office 400 for all UI; reach for Office 700 only for display specimens and emphasis moments

### Don't
- Do not introduce additional chromatic colors — the red announcement panel and acid green are the only breaks from monochrome
- Do not add drop shadows to any component — the system is intentionally flat and print-referenced
- Do not use rounded corners on cards or images beyond what the data specifies (0px)
- Do not substitute a different display font for specimens — the typeforms on this site ARE the product catalog
- Do not soften the dark canvas with gradients or tints — #121212 is absolute and edge-to-edge
- Do not apply the acid green to body text, icons, or large areas — it loses signal value at any surface area larger than the pill button
- Do not add decorative dividers, background tints, or section backgrounds — content is separated by whitespace and hairlines only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Workshop Black | `#121212` | Base page canvas — extends edge to edge |
| 1 | Platen Gray | `#292929` | Interactive surface for buttons and hover states |

## Elevation

The system is shadowless. Elevation is communicated through surface tone shift (#121212 → #292929) and hairline #d0d0d0 borders, never through drop shadows. The flat, unlit quality keeps attention on the typeforms.

## Imagery

Product photography is tightly cropped and square, focused on objects that demonstrate the type in use: printed packaging, laser-cut letter forms on a lunar surface, resin-cast specimen objects, branded product shots. Images are treated as flat tiles with 1px #d0d0d0 borders and no rounding — they read as prints pinned to the page. The right column functions as a visual proof gallery: each image answers the question 'what does this type look like in the world?' with minimal lifestyle context. No people, no environments beyond controlled studio setups. The red announcement panel carries a visible grain/noise texture overlay that references risograph and screen-print production aesthetics — a deliberate signal that this is a workshop, not a storefront.

## Layout

Three-column full-bleed layout with no max-width container. Left column (~200px): sticky navigation with text links and small icon marks, separated by hairline borders. Center column (flexible, dominant): font specimens stacked vertically with 7px row gap, paired with descriptive copy. Right column (~260px): vertical image gallery of custom type applications, each image a square or near-square tile. The red announcement panel interrupts the center column as a full-height block, breaking the monochrome rhythm. The grid is intentionally tight and editorial — the layout reads like a specimen book opened to a spread, not a modern web page. Navigation lives in the left margin, content in the middle, proof on the right. No hero, no large display area at the top — the first viewport is already into the product.

## Agent Prompt Guide

**Quick Color Reference**
- text (body): #d0d0d0
- text (heading): #ffffff
- background: #121212
- border/hairline: #d0d0d0
- accent: #d9ff00 (decoration + outlined action border)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a navigation link: transparent background, no border, text in Office 400 at 16px color #d0d0d0, 6px top margin, preceded by a small icon mark. Separated from the next link by a 1px #d0d0d0 hairline.
2. Build a font specimen row: 43px display text in Office 400 with 0.083em letter-spacing, color #d0d0d0, line-height 1.0, with the font name label in 16px #ffffff above it. Dotted #a0a0a0 underline at 7px row gap to the next specimen.
3. Build an acid download pill: 144px border-radius, transparent background, 1px solid #d9ff00 border, text in Office 400 at 12px with 0.083em letter-spacing, color #d9ff00, 8px vertical / 13px horizontal padding, with a small download icon glyph before the label.
4. Build a custom type image card: full-bleed square image, 1px #d0d0d0 border, 0px radius, no padding, optional 12px #a0a0a0 caption below in Office 400.
5. Build a release announcement panel: full-width block, solid red (#d8261b) background with a grain/noise texture overlay, centered white display text at 43px in Office 700 with 0.083em letter-spacing, line-height 1.0.

## Similar Brands

- **Dinamo (dinamo.xyz)** — Same type-foundry specimen-book layout: dark canvas, dense character displays, minimal chrome, and the type itself as the visual hero
- **Production Type** — Editorial dark-mode specimen presentation with single accent color signals and monospace-grid information density
- **Grilli Type** — Type foundry site that treats typography as product — border-driven flat cards, no shadows, high-contrast monochrome with rare chromatic punctuation
- **OH no Type** — Dark specimen sheets with acid-bright accent color for interactive elements, prioritizing the typeforms over UI ornamentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-workshop-black: #121212;
  --color-platen-gray: #292929;
  --color-bone: #d0d0d0;
  --color-ash: #a0a0a0;
  --color-paper-white: #ffffff;
  --color-acid-flash: #d9ff00;

  /* Typography — Font Families */
  --font-office: 'Office', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.19;
  --tracking-caption: 0.083px;
  --text-body: 16px;
  --leading-body: 1.58;
  --tracking-body: 0.016px;
  --text-display: 43px;
  --leading-display: 1;
  --tracking-display: 0.083px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;

  /* Layout */
  --section-gap: 84px;
  --card-padding: 13px;
  --element-gap: 6px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 144px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-pills: 144px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-workshop-black: #121212;
  --surface-platen-gray: #292929;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-workshop-black: #121212;
  --color-platen-gray: #292929;
  --color-bone: #d0d0d0;
  --color-ash: #a0a0a0;
  --color-paper-white: #ffffff;
  --color-acid-flash: #d9ff00;

  /* Typography */
  --font-office: 'Office', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.19;
  --tracking-caption: 0.083px;
  --text-body: 16px;
  --leading-body: 1.58;
  --tracking-body: 0.016px;
  --text-display: 43px;
  --leading-display: 1;
  --tracking-display: 0.083px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 144px;
}
```
