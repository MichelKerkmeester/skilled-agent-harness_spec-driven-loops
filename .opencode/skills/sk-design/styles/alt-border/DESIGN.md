# Alt–Border — Style Reference
> Monochrome editorial gallery — broadsheet headline on gallery white.

**Theme:** light

Alt–Border is an editorial gallery built on a strict monochrome foundation: pure white canvas, near-black ink, hairline gray rules, and image as the sole carrier of color. Typography carries the entire personality — a massive condensed display face at ~105px with line-height locked near 0.85 lets headlines sprawl edge-to-edge like a magazine cover, while a lighter humanist sans handles body and labels. The layout reads as a print spread translated to the web: a minimal top bar, a hero that is just type, thin rules that separate sections, and 3-column image grids with almost no gap. There is no decoration, no shadow, no rounded corner language, no button styling — every interface decision is editorial restraint. The site treats itself as a publication, not a product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary type, body text, hairline rules, link borders, and the structural color of the entire page — used at high frequency for borders and text alike, creating a printed-ink quality against the white canvas |
| Gallery White | `#ffffff` | `--color-gallery-white` | Page canvas, card and image backgrounds, the negative space that lets type and photography breathe |
| Graphite | `#333333` | `--color-graphite` | Secondary text, muted borders, image strokes — a slightly softened black for elements that should not compete with primary ink |
| Ash | `#808080` | `--color-ash` | Section divider rules, link borders, faint hairlines where a true black stroke would be too assertive |

## Tokens — Typography

### Neuehaasdisplay — Hero display — used only for the massive opening headline and section-statement lines that fill the viewport. The 0.85 line-height is a deliberate choice: lines nearly touch, producing the compressed broadsheet effect. Substitute: Neue Haas Grotesk Display Pro 35 Thin, or Inter at extreme sizes. · `--font-neuehaasdisplay`
- **Substitute:** Neue Haas Grotesk Display Pro 35 Thin
- **Weights:** 300
- **Sizes:** 105px
- **Line height:** 0.85-0.92
- **Letter spacing:** normal
- **Role:** Hero display — used only for the massive opening headline and section-statement lines that fill the viewport. The 0.85 line-height is a deliberate choice: lines nearly touch, producing the compressed broadsheet effect. Substitute: Neue Haas Grotesk Display Pro 35 Thin, or Inter at extreme sizes.

### Inferi — Multi-purpose face — medium-weight paragraphs (21px), oversized secondary statements (34px, 120px), and small UI labels (14px). The negative tracking (-0.0270em) tightens the rhythm at every size. Substitute: Söhne, Inter, or Untitled Sans. · `--font-inferi`
- **Substitute:** Söhne
- **Weights:** 200-400
- **Sizes:** 14px, 21px, 34px, 120px
- **Line height:** 1.00-2.00
- **Letter spacing:** -0.0270em
- **Role:** Multi-purpose face — medium-weight paragraphs (21px), oversized secondary statements (34px, 120px), and small UI labels (14px). The negative tracking (-0.0270em) tightens the rhythm at every size. Substitute: Söhne, Inter, or Untitled Sans.

### Suisseintl — Body and supporting copy — quiet, legible, never decorative. Same negative tracking as Inferi keeps the family consistent. Substitute: Suisse Int'l Light, or Inter Light. · `--font-suisseintl`
- **Substitute:** Suisse Int'l Light
- **Weights:** 300
- **Sizes:** 21px
- **Line height:** 1.00
- **Letter spacing:** -0.0270em
- **Role:** Body and supporting copy — quiet, legible, never decorative. Same negative tracking as Inferi keeps the family consistent. Substitute: Suisse Int'l Light, or Inter Light.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1 | -0.38px | `--text-caption` |
| body | 21px | 1 | -0.57px | `--text-body` |
| subheading | 34px | 1 | -0.92px | `--text-subheading` |
| heading | 105px | 0.85 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 9 | 9px | `--spacing-9` |
| 11 | 11px | `--spacing-11` |
| 19 | 19px | `--spacing-19` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Card padding:** 0px
- **Element gap:** 9px

## Components

### Top Navigation Bar
**Role:** Minimal global navigation — three items distributed across the full viewport width.

Full-width bar, no background fill, no border on top or bottom. Logo (brand name) flush left in 21px Inferi or Neuehaasdisplay at 300 weight. Two text links ('PROJECTS (Index)' and 'INFORMATION') flush center and right respectively, same size and weight. A single 1px hairline rule in #808080 may sit below.

### Hero Display Headline
**Role:** Opening statement that defines the studio's identity.

Spans full viewport width with 7-9px top padding. Type: Neuehaasdisplay 300 weight at 105px, line-height 0.85, letter-spacing normal. Color: #000000. No background, no border, no decoration. Text wraps naturally across 2-3 lines. Small thumbnail images may be embedded inline within the text flow as inline-block elements.

### Section Label Row
**Role:** Identifies the section and provides a navigation cue to related content.

Horizontal row with a small section title on the left ('Feed', 'Our practice', 'Selected projects') at 14px Inferi 400 weight, #000000. On the right, an arrow-prefixed link ('→ Instagram', '→ Read more', '→ View all projects') at the same size. A 1px hairline in #808080 below the row.

### Image Feed Grid
**Role:** Three-column photography showcase for project work and social feed.

Three equal columns, 9px gap between images, 0px border-radius, 0px padding. Images are object-fit cover, no captions visible at grid level. Each image is a full-bleed rectangle with a 1px #333333 or #000000 border at very low frequency.

### Image Card with Caption
**Role:** Individual portfolio thumbnail with title underneath.

Image at top, 9px gap, then a title in 14px Inferi 400 weight #000000 below (e.g. 'Water games', 'Woke up like this', 'Nike — 24.7'). No border, no padding around the text.

### Statement Section
**Role:** Mid-page manifesto block — the second editorial moment after the hero.

Full-width block with ~19px top margin, set in Neuehaasdisplay 300 at 105px with line-height 0.92 and 7-9px top padding. No background fill, no border. Functions as a typographic breather between image grids.

### Link with Arrow
**Role:** Inline navigation cue used in section label rows.

Right arrow glyph (→) followed by text in 14px Inferi 400 weight #000000. 5px padding-bottom. No underline, no color change on hover — the system relies on cursor change only.

### Inline Thumbnail
**Role:** Small photographic element embedded within a hero headline.

Square or near-square image, ~60-80px, placed inline with the display type as if it were a character. 0px radius. Sits on the same baseline grid as the surrounding text.

### Section Divider Rule
**Role:** Hairline separator between editorial sections.

1px horizontal line in #808080 spanning the full viewport width. 7-9px vertical padding above and below. The only structural element in the entire system.

## Do's and Don'ts

### Do
- Set display headlines in Neuehaasdisplay 300 at 105px with line-height 0.85 — the compressed vertical rhythm is the signature, not a default.
- Use #000000 for all primary type, borders, and rules; #808080 only for soft dividers.
- Keep all radii at 0px — the design is anti-rounded, it reads as print, not product UI.
- Separate sections with a single 1px #808080 hairline and 7-9px vertical padding, never with background color changes or cards.
- Let photographs carry all color and texture; the type and chrome stay strictly achromatic.
- Set body and supporting type at 21px with letter-spacing -0.0270em — the negative tracking is consistent across the Inferi and Suisseintl families.
- Place small square thumbnails inline within hero text as if they were characters on the baseline.

### Don't
- Do not introduce any chromatic color — the palette is achromatic by design, not by omission.
- Do not add drop shadows, blurs, or any elevation — separation comes from rules and whitespace alone.
- Do not round corners on images, buttons, or cards — 0px radius is the system.
- Do not use a CTA button style — there is no primary action color; navigation is text-only with arrow links.
- Do not exceed 0.92 line-height on the 105px display — looser tracking destroys the broadsheet compression.
- Do not set body type below 14px or above 34px — the scale jumps are deliberate: 14, 21, 34, 105.
- Do not add background fills to sections, cards, or navigation — the page is a single white sheet.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Full-page background, the only surface layer |
| 2 | Image Plate | `#ffffff` | Behind photographs in the feed grid — invisible, just the white showing between images |
| 3 | Rule Line | `#808080` | Hairline horizontal dividers that separate sections and groupings |

## Elevation

Zero shadow language. The design treats every element as flat ink on flat paper. Separation is achieved through whitespace and hairline rules, never through drop shadow or blur.

## Imagery

Photography is the entire color story. The visual language is high-fashion editorial: tight beauty close-ups (lips, eyes, skin), product still-life (perfume bottles, headphones, glassware) on saturated colored backdrops (magenta, cyan, deep blue), and CGI/3D-rendered objects with a glossy, hyperreal finish. Treatment is always full-bleed, 0px radius, no overlays, no filters. Images are presented in a strict 3-column grid with ~9px gaps, each one a self-contained visual statement. There is no lifestyle context, no candid photography, no people-in-environment shots — every frame is a controlled studio composition. Icons and illustration are absent; the photographic crops ARE the graphic system.

## Layout

Full-bleed editorial spread with no max-width constraint — text and images both run edge-to-edge of the viewport. The page is a vertical sequence of typographic and photographic bands: (1) minimal top nav with three text items distributed across the row, (2) hero headline at 105px filling the width across 2-3 lines, (3) section label row with hairline rule, (4) 3-column image grid with ~9px gaps, (5) second display statement headline, (6) another 3-column grid. Every section is separated by a single 1px hairline in #808080. There is no sidebar, no sticky header, no mega-menu, no footer beyond the navigation itself. The rhythm is: type → images → type → images, like flipping through a magazine.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border / hairline: #808080
- muted border: #333333
- accent: none (no chromatic accent in the system)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create the hero headline band: white background, full viewport width. Type 'A multidisciplinary art direction studio working across fashion, beauty, and luxury.' set in Neuehaasdisplay 300 weight at 105px, color #000000, line-height 0.85, letter-spacing normal. 7-9px top padding. A 1px #808080 hairline below.

2. Create a section label row: full-width, white background. Left side reads 'Feed' in 14px Inferi 400 weight #000000. Right side reads '→ Instagram' in the same type. 1px #808080 hairline below with 7-9px vertical padding.

3. Create a 3-column image grid: full viewport width, white background, 9px gap between columns and rows. Images are object-fit cover, 0px border-radius, no captions inside the grid. Below one image, place a title in 14px Inferi 400 weight #000000 with 9px top margin.

4. Create a statement section: white background, full-width, 19px top margin. Type 'We create concept-driven imagery and identities through CGI, photography, and design.' in Neuehaasdisplay 300 at 105px, line-height 0.92, color #000000. 7-9px top padding. No border, no background.

5. Create a text-link with arrow: 14px Inferi 400 weight #000000, preceded by a → glyph, 5px padding-bottom. No underline, no hover color change, no border.

## Similar Brands

- **M/M (Paris)** — Same Parisian art-direction pedigree with monochrome editorial layouts, massive display type, and full-bleed photography grids.
- **Bureau Borsche** — Identical approach of letting a single display typeface dominate the viewport against pure white, with photography in strict equal-column grids.
- **Commission Studio** — Shared editorial-spread layout language — typographic hero, hairline section rules, 3-column image feeds with zero decoration.
- **Random Studio** — Same restraint: no shadows, no rounded corners, achromatic chrome, with color and personality carried entirely by photography.
- **Savvy Studio** — Identical treatment of 0px radii, hairline rules as section dividers, and oversized single-weight display type as the primary design move.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-gallery-white: #ffffff;
  --color-graphite: #333333;
  --color-ash: #808080;

  /* Typography — Font Families */
  --font-neuehaasdisplay: 'Neuehaasdisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inferi: 'Inferi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl: 'Suisseintl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1;
  --tracking-caption: -0.38px;
  --text-body: 21px;
  --leading-body: 1;
  --tracking-body: -0.57px;
  --text-subheading: 34px;
  --leading-subheading: 1;
  --tracking-subheading: -0.92px;
  --text-heading: 105px;
  --leading-heading: 0.85;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-19: 19px;

  /* Layout */
  --card-padding: 0px;
  --element-gap: 9px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-image-plate: #ffffff;
  --surface-rule-line: #808080;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-gallery-white: #ffffff;
  --color-graphite: #333333;
  --color-ash: #808080;

  /* Typography */
  --font-neuehaasdisplay: 'Neuehaasdisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inferi: 'Inferi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl: 'Suisseintl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1;
  --tracking-caption: -0.38px;
  --text-body: 21px;
  --leading-body: 1;
  --tracking-body: -0.57px;
  --text-subheading: 34px;
  --leading-subheading: 1;
  --tracking-subheading: -0.92px;
  --text-heading: 105px;
  --leading-heading: 0.85;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-19: 19px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
