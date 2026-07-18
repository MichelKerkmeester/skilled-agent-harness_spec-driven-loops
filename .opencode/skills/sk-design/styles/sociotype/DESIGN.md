# Sociotype — Style Reference
> Type specimen museum on white paper

**Theme:** light

Sociotype is a type foundry site that operates as a curated letterform gallery: a near-pure black-and-white canvas where custom typefaces are the only chromatic event. The interface is essentially a specimen book rendered in a browser — enormous 251px type specimens sit on paper-white backgrounds, with hairline 1px borders and zero shadows drawing all the visual weight. The hero breaks the monochrome contract with a single full-bleed atmospheric photograph (refracted glass, water, prismatic color) used as a rotating feature stage, letting the photography supply the one moment of saturated color per page load. Navigation, labels, and chrome are uniformly small (11–14px) Onsite Regular with wide letter-spacing, behaving like museum wall text rather than app UI. Components are stripped to their minimum: a top bar, a size selector, a fullscreen toggle, arrow-suffix text links, and category lists — every element defers to the type being sold.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Onyx | `#000000` | `--color-onyx` | Primary text, all borders and dividers, nav and link strokes — the structural black of every UI line |
| Paper | `#ffffff` | `--color-paper` | Page and card surfaces, reverse text on dark overlays |
| Charcoal | `#1a1818` | `--color-charcoal` | Body text on light surfaces where true black reads too clinical — used for paragraph copy and descriptions |
| Graphite | `#818181` | `--color-graphite` | Secondary text, caption labels, size selector, muted metadata |
| Ash | `#9d9d9d` | `--color-ash` | Hairline list dividers and subtle separators within type family navigation |
| Bone | `#d6d6d6` | `--color-bone` | Light section dividers, subtle structural borders |

## Tokens — Typography

### Main Onsite — Main Onsite — detected in extracted data but not described by AI · `--font-main-onsite`
- **Weights:** 400
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 18px, 26px, 40px
- **Line height:** 1, 1.13, 1.19, 1.22, 1.29, 1.31, 1.33, 1.38
- **Letter spacing:** 0.015, 0.025, 0.04, 0.05, 0.08
- **Role:** Main Onsite — detected in extracted data but not described by AI

### Onsite — Primary UI typeface for body, nav, buttons, links, captions, and headings — used at every interface scale from 11px micro-labels to 40px section titles. The wide letter-spacing range (0.015em–0.080em) gives small text a museum-label quality; the custom 400 weight keeps the entire interface at one calm voice. · `--font-onsite`
- **Substitute:** Inter, IBM Plex Sans, Söhne
- **Weights:** 400
- **Sizes:** 251px
- **Line height:** 1.00–1.38
- **Letter spacing:** 0.015em at body, 0.025em at small UI, 0.040em at nav, 0.050em at captions, 0.080em at the smallest 11px labels
- **Role:** Primary UI typeface for body, nav, buttons, links, captions, and headings — used at every interface scale from 11px micro-labels to 40px section titles. The wide letter-spacing range (0.015em–0.080em) gives small text a museum-label quality; the custom 400 weight keeps the entire interface at one calm voice.

### Avec Sharp / Ceno / Meso / Gestura / Rework — Display specimens — each font is showcased at a single massive 251px size as the product being sold. These are page heroes, not UI text. The tight 0.001em letter-spacing lets the display type breathe at its own proportions while the UI chrome (Onsite) keeps wide tracking for contrast. · `--font-avec-sharp-ceno-meso-gestura-rework`
- **Substitute:** Each is a custom font; substitute with Playfair Display, GT Sectra, Recoleta, or PP Editorial New for editorial display needs
- **Weights:** 400
- **Sizes:** 251px
- **Line height:** 1.25
- **Letter spacing:** 0.001em (essentially normal)
- **OpenType features:** `liga (on Gestura)`
- **Role:** Display specimens — each font is showcased at a single massive 251px size as the product being sold. These are page heroes, not UI text. The tight 0.001em letter-spacing lets the display type breathe at its own proportions while the UI chrome (Onsite) keeps wide tracking for contrast.

### Ceno — Ceno — detected in extracted data but not described by AI · `--font-ceno`
- **Weights:** 400
- **Sizes:** 251px
- **Line height:** 1.25
- **Letter spacing:** 0.001
- **Role:** Ceno — detected in extracted data but not described by AI

### Meso — Meso — detected in extracted data but not described by AI · `--font-meso`
- **Weights:** 400
- **Sizes:** 251px
- **Line height:** 1.25
- **Letter spacing:** 0.001
- **Role:** Meso — detected in extracted data but not described by AI

### Gestura — Gestura — detected in extracted data but not described by AI · `--font-gestura`
- **Weights:** 400
- **Sizes:** 251px
- **Line height:** 1.25
- **Letter spacing:** 0.001
- **OpenType features:** `"liga"`
- **Role:** Gestura — detected in extracted data but not described by AI

### Rework — Rework — detected in extracted data but not described by AI · `--font-rework`
- **Weights:** 400
- **Sizes:** 251px
- **Line height:** 1.25
- **Letter spacing:** 0.001
- **Role:** Rework — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.38 | 0.88px | `--text-caption` |
| body | 14px | 1.29 | 0.21px | `--text-body` |
| heading-sm | 18px | 1.19 | 0.45px | `--text-heading-sm` |
| heading | 26px | 1.13 | 0.39px | `--text-heading` |
| heading-lg | 40px | 1 | 0.6px | `--text-heading-lg` |
| display | 251px | 1.25 | 0.25px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 12px
- **Element gap:** 12px

## Components

### Top Navigation Bar
**Role:** Sticky site header with left-anchored section links and centered wordmark

Full-width transparent bar over the hero image. Left: 'Typefaces' link in Onsite 12px weight 400, #000000, letter-spacing 0.025em. Center: 'SOCIOTYPE' wordmark in Onsite 14px, letter-spacing 0.08em. Right: 'Shop', 'Trials', 'About', 'Cart' links in same treatment. No background fill, no border, no shadow — it floats over content.

### Hero Feature Image
**Role:** Full-bleed atmospheric photograph as a rotating featured typeface showcase

Full-viewport photographic image (refracted glass, water droplets, prismatic green/yellow/blue). 251px specimen text overlaid in the bottom-left in white (#ffffff) for the featured font name. No rounded corners, no overlay tint — the photo IS the section.

### Featured Overlay Label
**Role:** Top-left caption identifying the current hero specimen

'Featured: Avec' in Onsite 16px weight 400, #ffffff, overlaid on the hero image. Short description paragraph beneath in Onsite 12px #ffffff at 50% line width, 6px margin-bottom from the headline.

### Image Carousel Counter
**Role:** Top-right pagination indicator for the featured image rotation

'1/5' in Onsite 16px #ffffff, top-right of the hero, tracking the current featured typeface position.

### Type Specimen Display
**Role:** Massive single-word specimen of the font being sold

The font name ('Avec', 'Onsite') set in itself at 251px Onsite 400 weight, #000000, line-height 1.25, letter-spacing 0.001em. Sits on Paper (#ffffff) with 0px padding/margin from the viewport edges, giving the specimen maximum visual real estate.

### Specimen Meta Header
**Role:** Top-of-specimen breadcrumb and size indicator

Left: font family + style name in Onsite 12px #000000 with 0.08em letter-spacing (e.g. 'Avec Sharp    Regular'). Right: current display size '25px' in Onsite 12px and a fullscreen toggle icon. A 1px #d6d6d6 hairline border separates this header from the specimen below.

### Style Category List
**Role:** Vertical list of font sub-families (Text, Curve, Sharp, Stencil / Mono, SemiMono, etc.)

Left column, fixed ~120px wide. Each category name in Onsite 14px weight 400 #000000, with '14 Styles' / '8 Styles' caption beneath in Onsite 11px #818181, letter-spacing 0.05em. Items separated by 1px #9d9d9d borders with 9px vertical padding between entries.

### Specimen Description Block
**Role:** Editorial description of the font family beside the category list

Right column, Onsite 16px weight 400 #000000, line-height 1.22, max-width ~540px. Plain prose paragraph. 30px margin-bottom separating it from the next element.

### More Info Arrow Link
**Role:** Text link to the font's full detail page

Inline link in Onsite 16px #000000 with a right-arrow glyph (→) appended with a space. No underline, no color change, no border. The arrow IS the affordance — it signals clickability through the suffix character rather than styling.

### Size Selector Control
**Role:** Dropdown/toggle for switching specimen display size

Onsite 12px #818181, top-right of the specimen page. Minimal text-only control, no border, no background. Adjacent fullscreen icon is a 12px outlined square glyph.

### Specimen Section Divider
**Role:** Hairline separator between meta header and the large specimen

1px solid #d6d6d6 horizontal rule, full width of the content area, 0px padding above/below.

## Do's and Don'ts

### Do
- Use 0px border-radius on every component — buttons, cards, inputs, tags, and images all stay sharp. The angularity is part of the type-foundry aesthetic.
- Set all UI text in Onsite weight 400, never bold. The site speaks in one calm voice; weight 700 would shout over the specimens.
- Use letter-spacing between 0.025em and 0.080em for any UI text under 16px to give small labels a museum-card quality. Reserve 0.001em for 251px display specimens only.
- Keep surfaces pure Paper (#ffffff) with Onyx (#000000) text. No tints, no dark mode, no card fills — the background is always the same white that holds the specimens.
- Use 1px solid #d6d6d6 or #9d9d9d for all dividers and structural borders. No 2px+ rules, no shadows, no double lines.
- Suffixed arrows (→) on text links replace button styling. 'More Info →' is the canonical link pattern, never 'Read More' inside a bordered box.
- Use a single atmospheric photograph (one per featured font) as the only source of color per page. The hero image is the moment the palette earns its saturation.

### Don't
- Don't introduce any chromatic color into the UI. The 0% colorfulness is a deliberate signal that the type is the product — adding blue, red, or any accent would compete with the specimens.
- Don't use shadows, gradients, or any elevation effects. The design language is flat; depth comes from typography scale and whitespace, not from z-axis tricks.
- Don't use bold (600/700) for headings. Stay at Onsite 400; size alone carries hierarchy (14 → 18 → 26 → 40 → 251).
- Don't round any corner. A 4px or 8px radius would make the type foundry look like a generic SaaS card — the sharp 0px is what makes it feel like editorial print.
- Don't fill backgrounds on cards or nav. Let Paper show through; if a component needs to separate from the page, use a 1px #d6d6d6 border instead of a fill.
- Don't use icon-only buttons with colorful backgrounds. Controls are text-only in #818181 or use outlined glyphs at 12px — the size selector and fullscreen toggle show the pattern.
- Don't set body text below 14px. The smallest UI is 11–12px and those are reserved for captions and meta labels, never long-form reading.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Universal page and card background — the same white holds the hero photo, the type specimens, and all detail pages |

## Elevation

The design has no shadows. Depth and separation are produced entirely through 1px hairlines (#d6d6d6, #9d9d9d) and whitespace. Elevation would feel heavy in a system whose entire job is to let 251px letterforms float unencumbered on a white page.

## Imagery

The site uses a single full-bleed atmospheric photograph per featured typeface — refracted light, water droplets, glass textures, prismatic color (green, yellow, blue, red). These are the only chromatic events on the site: editorial, mood-rich, full-bleed with 0px radius, no overlay tint, no masking. The photography behaves like a museum spotlight on the specimen, and the white text overlaid is the only typographic element competing with the letterforms. All other pages are pure UI — no product photography, no lifestyle imagery, no icon decoration. Icons (fullscreen toggle, category dots) are 12px outlined glyphs in #818181, mono weight, functional not decorative.

## Layout

Full-bleed hero photographs with the wordmark and featured label overlaid; the rest of the site is a max-width ~1200px content area centered on Paper. Specimen pages follow a strict two-column pattern: a narrow ~120px left rail listing sub-family categories (Text, Curve, Sharp, Stencil / Mono, SemiMono, Condensed, Standard, Extended) and a wider right column with the 251px specimen on top, an editorial description paragraph below, and a 'More Info →' link. Vertical rhythm is generous (120px section gaps) with 1px hairlines marking transitions. Navigation is a single top bar — no sidebar, no footer chrome, no breadcrumbs. The featured image carousel rotates the hero position but the underlying layout is identical across all five featured typefaces. The site never uses card grids, pricing tables, or multi-column feature blocks — every page is essentially one long specimen wall.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Onyx)
- background: #ffffff (Paper)
- border: #d6d6d6 (Bone) for section dividers, #9d9d9d (Ash) for list separators
- secondary text: #818181 (Graphite)
- body text: #1a1818 (Charcoal)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Build a top navigation bar: transparent background, no border. Left 'Typefaces' in Onsite 12px #000000, 0.025em letter-spacing. Center wordmark 'SOCIOTYPE' in Onsite 14px #000000, 0.08em letter-spacing. Right 'Shop', 'Trials', 'About', 'Cart' in same treatment as the left link. 50px right margin between right-side links.

2. Build a type specimen display: full-width Paper (#ffffff) surface, 0px padding. Font name set in itself at 251px, weight 400, line-height 1.25, letter-spacing 0.001em, #000000. No border, no shadow, no background fill.

3. Build a category list rail: 120px wide left column. Each item is a category name in Onsite 14px #000000 with a '14 Styles' caption beneath in Onsite 11px #818181, 0.05em letter-spacing. Items separated by 1px solid #9d9d9d borders, 9px vertical padding between entries.

4. Build a 'More Info →' link: inline Onsite 16px #000000, no underline, no border, with a space and a right-arrow glyph appended. The arrow is the only affordance — no button chrome.

5. Build a specimen meta header: full-width 1px solid #d6d6d6 bottom border. Left: font family + variant in Onsite 12px #000000, 0.08em letter-spacing. Right: current size '25px' in Onsite 12px #818181, followed by a 12px outlined fullscreen glyph in #818181.

## Similar Brands

- **Dinamo (dinamo.com)** — Same type-foundry-as-product model: white canvas, oversized specimen display, single sans UI face at wide letter-spacing, hairline rules, no shadows or color
- **Grilli Type (grillitype.com)** — Type foundry site with monochrome interface, 0px radii, specimen-first pages, and full-bleed atmospheric photography as the only color source
- **Commercial Type (commercialtype.com)** — Editorial type foundry aesthetic — paper-white pages, editorial paragraph blocks beside specimen displays, museum-label typography for UI chrome
- **OH no Type (ohnotype.com)** — Independent type foundry with zero-chrome specimen pages: massive display type, thin dividers, no card fills, no buttons — links carry an arrow suffix
- **Production Type (productiontype.com)** — Type specimen gallery with single-word 200px+ hero displays, hairline-bordered meta rows, and 0% colorful interface that defers entirely to the letterforms

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-onyx: #000000;
  --color-paper: #ffffff;
  --color-charcoal: #1a1818;
  --color-graphite: #818181;
  --color-ash: #9d9d9d;
  --color-bone: #d6d6d6;

  /* Typography — Font Families */
  --font-main-onsite: 'Main Onsite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-onsite: 'Onsite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-avec-sharp-ceno-meso-gestura-rework: 'Avec Sharp / Ceno / Meso / Gestura / Rework', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ceno: 'Ceno', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-meso: 'Meso', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gestura: 'Gestura', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rework: 'Rework', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.38;
  --tracking-caption: 0.88px;
  --text-body: 14px;
  --leading-body: 1.29;
  --tracking-body: 0.21px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: 0.45px;
  --text-heading: 26px;
  --leading-heading: 1.13;
  --tracking-heading: 0.39px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 0.6px;
  --text-display: 251px;
  --leading-display: 1.25;
  --tracking-display: 0.25px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 12px;
  --element-gap: 12px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-onyx: #000000;
  --color-paper: #ffffff;
  --color-charcoal: #1a1818;
  --color-graphite: #818181;
  --color-ash: #9d9d9d;
  --color-bone: #d6d6d6;

  /* Typography */
  --font-main-onsite: 'Main Onsite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-onsite: 'Onsite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-avec-sharp-ceno-meso-gestura-rework: 'Avec Sharp / Ceno / Meso / Gestura / Rework', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ceno: 'Ceno', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-meso: 'Meso', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gestura: 'Gestura', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rework: 'Rework', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.38;
  --tracking-caption: 0.88px;
  --text-body: 14px;
  --leading-body: 1.29;
  --tracking-body: 0.21px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: 0.45px;
  --text-heading: 26px;
  --leading-heading: 1.13;
  --tracking-heading: 0.39px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 0.6px;
  --text-display: 251px;
  --leading-display: 1.25;
  --tracking-display: 0.25px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-120: 120px;
  --spacing-140: 140px;
}
```
