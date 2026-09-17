# Resident — Style Reference
> Architecture monograph on cream paper

**Theme:** light

Resident operates as a quiet editorial gallery for design objects: white paper canvas, near-zero chrome, and large-format photography doing all the visual work. The interface is almost entirely monochrome — black ink on white paper with hairline rules and small ghost text — letting the rooms, furniture, and light fixtures themselves provide every chromatic decision. Typography is a single custom sans-serif (MessinaSans) at moderate weights with tightened tracking, giving headlines a precise, catalogue-like authority without ever feeling loud. Components are reduced to their skeletons: a tiny underlined nav, border-only buttons, a section heading that scales to the edge of the column. No shadows, no gradients, no surface elevation — depth comes only from the photographs and generous vertical breathing room between editorial spreads.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Body text, nav links, icon strokes, and all hairline borders (1px rules under nav, around inputs, and between editorial blocks). The structural workhorse — 724 borderColor occurrences and 336 body borders show it carries the layout's edges |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, nav background, and ghost button fills. Everything floats on this surface; the entire interface is one flat sheet |
| Soft Graphite | `#979797` | `--color-soft-graphite` | Muted body text and secondary borders. 2.9:1 contrast against white means it is intentionally faint — used for helper copy and less critical dividers, never for primary content |
| Charcoal | `#333333` | `--color-charcoal` | Icon strokes, fills, and button borders for secondary controls. Sits between ink-black and mid-gray, giving icons a softer presence than body text without losing legibility at 12.6:1 |

## Tokens — Typography

### MessinaSansWeb — Brand typeface — used for all headings, body copy, nav, and product descriptions. Custom geometric sans with tightened tracking (-0.0370em at display, -0.0300em at body) and moderate weight (400–500, never bold). The anti-conventional choice: running a custom sans at weight 400 for section headings instead of 600–700 — authority comes from the typeface's precision and the negative letter-spacing, not from weight. · `--font-messinasansweb`
- **Substitute:** Inter, Suisse Int'l, or Söhne (for closest tracking and geometric character)
- **Weights:** 400, 500
- **Sizes:** 14, 18, 19, 23, 27
- **Line height:** 1.00–1.40 (varies by size: 1.00 at 27px display, 1.20 at 23px heading, 1.29–1.40 at body sizes)
- **Letter spacing:** -0.0370em at display sizes (27px), -0.0300em at body sizes (14–19px)
- **Role:** Brand typeface — used for all headings, body copy, nav, and product descriptions. Custom geometric sans with tightened tracking (-0.0370em at display, -0.0300em at body) and moderate weight (400–500, never bold). The anti-conventional choice: running a custom sans at weight 400 for section headings instead of 600–700 — authority comes from the typeface's precision and the negative letter-spacing, not from weight.

### system-ui sans-serif — Utility text for small chrome — nav secondary items, footer micro-copy, minor UI labels. Deliberately reduced to two sizes and one weight; the system stack disappears so MessinaSans remains the voice of the brand. · `--font-system-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 12, 14
- **Line height:** 1.20–1.30
- **Letter spacing:** normal
- **Role:** Utility text for small chrome — nav secondary items, footer micro-copy, minor UI labels. Deliberately reduced to two sizes and one weight; the system stack disappears so MessinaSans remains the voice of the brand.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.3 | -0.42px | `--text-body-sm` |
| body-lg | 19px | 1.4 | -0.57px | `--text-body-lg` |
| heading-sm | 23px | 1.2 | -0.69px | `--text-heading-sm` |
| display | 27px | 1 | -1px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 21 | 21px | `--spacing-21` |
| 27 | 27px | `--spacing-27` |
| 28 | 28px | `--spacing-28` |
| 35 | 35px | `--spacing-35` |
| 42 | 42px | `--spacing-42` |
| 83 | 83px | `--spacing-83` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48-64px
- **Card padding:** 0px
- **Element gap:** 18-21px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Sticky top bar on white background. Left cluster: primary nav items (Furniture, Lighting, Designers, Journal, Resources, About) in 12–14px MessinaSans 400, black, spaced ~18–21px apart. Right cluster: secondary actions (Login, Search, Cart with count) in system sans 12–14px. 21px vertical padding. No background, no border-bottom — the nav sits naked on white paper.

### Ghost Nav Link
**Role:** Navigation item

Text-only, no background, no border, no underline at rest. 12–14px MessinaSans 400, #000000. On hover or active state, a 1px black underline appears beneath the text. 5–10px horizontal margin between items.

### Section Display Heading
**Role:** Editorial section title

Massive 27px MessinaSans 400, #000000, line-height 1.00, letter-spacing -1.00px. Can be set to the right column edge of a two-column layout (as in the 'Resident' wordmark in the hero). Zero margin — it anchors the section rather than centering within it.

### Editorial Image Spread
**Role:** Hero photography and product showcases

Full-bleed or column-width photographs with 0px border-radius, displayed at 1:1 or 4:3 aspect ratios. Images sit edge-to-edge with no frames, no captions overlays, and 24–48px gaps between paired photographs. The photographs themselves are the entire visual system — no illustrations, no icons overlaid.

### Two-Column Editorial Block
**Role:** Body content layout

Two equal columns with ~24px gap. Left column: descriptive body text in 18–19px MessinaSans 400, line-height 1.29–1.40, #000000. Right column: complementary paragraph at the same spec. No vertical rule between columns — the gap is the divider.

### Ghost Link / Text Button
**Role:** Inline link and minimal CTA

14px MessinaSans 400, #000000, 1px black underline, 3–6px horizontal padding. No background, no border, no fill. The only interactive element style on the site — there are no filled buttons anywhere.

### Bordered Input
**Role:** Form fields

1px solid #000000 border, 0px radius, white background, 14px MessinaSans 400, #000000 text. 10px vertical padding, no focus ring color shift (border remains black). Placeholder text at default body color.

### Footer
**Role:** Site footer

21px vertical padding, system sans-serif 12–14px, #000000. Organized in small text clusters (links, locale switcher EN/DE, legal). No dividers, no background fill — continues the white paper sheet.

### Product/Collection Card
**Role:** Product listing entry

Zero-padding card — just a photograph followed by product name in 14–18px MessinaSans 400 and price/spec in the same size. No card background, no border, no shadow. The card is a typographic block beneath a photograph, not a container.

### Locale Switcher
**Role:** Language toggle (EN/DE)

12px system sans, #000000, inline text with a thin space separator. No dropdown, no flags — just adjacent uppercase two-letter codes in a single line.

## Do's and Don'ts

### Do
- Set all borders to 1px solid #000000 — never use thicker rules or colored borders.
- Use MessinaSans at weights 400 or 500 only; never bold (700) — the typeface's geometry carries the hierarchy, not weight.
- Apply letter-spacing -0.0370em to display sizes (23px+) and -0.0300em to body sizes (14–19px).
- Keep all border-radius at 0px — the design is intentionally architectural and sharp-edged.
- Let full-bleed or column-width photography be the sole source of color and visual interest on the page.
- Use ghost/underline links (14px MessinaSans 400, 1px black underline) for all interactions — never filled buttons.
- Maintain 48–64px vertical gaps between editorial sections to preserve the magazine spread rhythm.

### Don't
- Do not introduce any chromatic color, gradient, or colored fill — the palette is four neutrals and the photographs provide everything else.
- Do not add box-shadow, elevation, or surface tinting — depth comes from photography, not chrome.
- Do not use bold (700) weights on MessinaSans — moderate weight with tight tracking is the signature.
- Do not use border-radius on any element — cards, buttons, images, and inputs are all sharp-edged.
- Do not use filled or colored buttons — all interactive elements are text links with 1px black underlines.
- Do not place icon overlays, badges, or decorative graphics on top of product photography.
- Do not center-align body text in multi-column layouts — the editorial grid uses left-aligned asymmetric columns.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas and the only surface in the system. All content — nav, cards, images, text blocks — sits directly on this single plane. |

## Elevation

The design deliberately avoids shadows, gradients, and any surface lift. Depth is achieved only through full-bleed photography and generous vertical whitespace. No box-shadow, no colored fills, no modal scrims — the page is a flat editorial sheet where images create their own dimensionality against white.

## Imagery

Photography is the entire visual language — no illustrations, no 3D renders, no iconography beyond minimal UI glyphs. Imagery is editorial-architectural: warm interior shots of rooms with Resident furniture and lighting, shot at natural light with muted earth tones (dusty pinks, warm woods, concrete greys, firelit ambers). Composition is wide and environmental — the furniture is shown in lived-in spaces, not on white seamless. Images are always full-bleed or column-width with 0px corner radius, never masked, never with text overlays. Color treatment is naturalistic with slight warmth — not desaturated, not duotone. Photography occupies 60–70% of the page surface area on most screens; the remaining white paper is intentional negative space.

## Layout

Editorial two-column magazine grid. Max-width ~1440px with no centered container constraint — the grid runs edge-to-edge with generous outer margins. Hero pattern: oversized section heading (e.g. 'Resident') set at display weight positioned in the right column, with a two-photograph spread beneath filling the full width. Content sections alternate between two-column text blocks and image grids (2-up or 3-up). No full-viewport hero, no video, no animated banners — the page begins immediately as a quiet editorial spread. Section rhythm is consistent: 48–64px vertical gaps between blocks, no background bands, no visual dividers beyond whitespace. Navigation is a minimal top bar with small ghost links. No sidebar, no sticky elements beyond the nav, no mega-menu. The overall feel is of flipping through a design monograph rather than browsing a product catalog.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000 (Ink Black)
- Background: #ffffff (Paper White)
- Border: #000000 (1px hairline)
- Muted text: #979797 (Soft Graphite)
- Icon/secondary: #333333 (Charcoal)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Editorial section heading*: Render the word 'Resident' at 27px MessinaSans weight 400, #000000, line-height 1.00, letter-spacing -1.00px. Position right-aligned in a two-column grid. No margin.

2. *Two-column body block*: Create a two-column layout with 24px gap. Left column: paragraph in 18px MessinaSans 400, #000000, line-height 1.29, letter-spacing -0.54px. Right column: identical spec, different paragraph. No vertical divider between columns.

3. *Product photograph card*: Place a full-bleed photograph (4:3 ratio, 0px radius) above a text block: product name in 18px MessinaSans 400, #000000. No card background, no border, no shadow. 24px gap between image and text.

4. *Ghost navigation link*: Render a text link in 14px MessinaSans 400, #000000 with 1px solid #000000 underline, 3px horizontal padding. No background, no border-radius. 18px margin-right between adjacent links.

5. *Bordered input field*: Create an input with 1px solid #000000 border, 0px radius, #ffffff background, 10px vertical padding, 14px MessinaSans 400, #000000 text. Placeholder text in #979797.

## Editorial Spacing System

The spacing scale is deliberately narrow and content-driven:
- 3–6px: inline element padding (buttons, links)
- 10–14px: small component padding (inputs, micro elements)
- 18–21px: standard element gap (between nav items, between text blocks)
- 48–64px: editorial section gap (between major spreads)

There is no card padding because there are no card containers — content flows directly on the white paper surface. The base unit is 4px but most values are odd (5, 13, 19, 21) because the spacing follows typographic rhythm rather than a strict grid.

## Similar Brands

- **Menu (menu.world)** — Same editorial-monograph approach: custom geometric sans at moderate weights, near-zero chrome, full-bleed furniture photography as the sole color source, and hairline 1px rules replacing all decorative borders.
- **Aesop (aesop.com)** — Shared restraint philosophy: white canvas, single custom typeface, no filled buttons (all ghost links), photographic warmth providing the only chromatic content, and generous editorial whitespace between sections.
- **Hem (hem.com)** — Same Scandinavian design-object sensibility with monochrome UI, tight-tracked geometric sans, borderless image-led grids, and ghost-text navigation that disappears to let product photography lead.
- **Vitra (vitra.com)** — Identical editorial-design language: catalog-style two-column layouts, oversized section headings, architectural photography of furniture in rooms, and a four-neutral palette with no decorative color.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-soft-graphite: #979797;
  --color-charcoal: #333333;

  /* Typography — Font Families */
  --font-messinasansweb: 'MessinaSansWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.42px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.57px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.69px;
  --text-display: 27px;
  --leading-display: 1;
  --tracking-display: -1px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-35: 35px;
  --spacing-42: 42px;
  --spacing-83: 83px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48-64px;
  --card-padding: 0px;
  --element-gap: 18-21px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-soft-graphite: #979797;
  --color-charcoal: #333333;

  /* Typography */
  --font-messinasansweb: 'MessinaSansWeb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.42px;
  --text-body-lg: 19px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.57px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.69px;
  --text-display: 27px;
  --leading-display: 1;
  --tracking-display: -1px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-35: 35px;
  --spacing-42: 42px;
  --spacing-83: 83px;
}
```
