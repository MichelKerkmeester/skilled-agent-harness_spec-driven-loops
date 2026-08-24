# FARFETCH España — Style Reference
> White-cube fashion gallery. Imagine a high-end retail space where the walls, floors, and fixtures have been bleached to bone, leaving only the garments and the people wearing them to provide every hue, texture, and visual weight.

**Theme:** light

Farfetch operates as a white-cube gallery for fashion: the interface is a near-total absence of color, letting editorial photography carry every visual decision. Typography does all the structural work — a custom geometric sans-serif (Farfetch Basis) at weights 400 and 700, with section titles and the wordmark set in a serif display treatment that treats text as composition. Layout is architectural: centered full-width content, rigid 3- and 4-column product grids, generous 48–72px section breathing room, and zero decorative chrome. Components are unornamented — thin underlines for search, ghost navigation links, uppercase category labels beneath imagery, flat product tiles with no shadows or borders. The only color in the system is the photography itself; the interface is the frame, never the picture.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon | `#222222` | `--color-carbon` | Primary text, body copy, nav links, icons, logo wordmark, footer surface, and the near-black anchoring tone for the entire monochrome system |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card backgrounds, product tile surfaces, input fields, and the dominant background that makes photography the only chromatic voice |
| Ash Gray | `#b6b6b6` | `--color-ash-gray` | Subtle icon strokes, secondary borders, search underline at rest, placeholder ghost text in inputs — the quietest non-text neutral |
| Stone | `#f5f5f5` | `--color-stone` | Hover wash on nav strips, secondary surface tone for utility bars and announcement backgrounds, the softest surface lift in the stack |
| Graphite | `#727272` | `--color-graphite` | Muted helper text, inactive form borders, disabled icon strokes — the mid-gray that signals de-emphasis without losing legibility |
| Smoke | `#e6e6e6` | `--color-smoke` | Hairline dividers between product rows, thin section separators, the barely-visible structural line in an otherwise seamless layout |

## Tokens — Typography

### Farfetch Basis — Custom geometric sans-serif used for everything user-facing: nav links at 13–15px/400, body and product labels at 15px/400, section titles at 22–30px/400, and the FARFETCH wordmark at 700. The 400-weight-only headings are a deliberate anti-bold move — section titles rest at regular weight, confident without shouting, while 700 is reserved for the wordmark and the most emphatic category labels. The custom geometry brings even stroke contrast and subtle humanist warmth that a system Helvetica wouldn't. · `--font-farfetch-basis`
- **Substitute:** Söhne (paid) or Inter (free) — both share the geometric humanist proportions; Inter as the practical open-source fallback
- **Weights:** 400, 700
- **Sizes:** 13px, 15px, 22px, 30px
- **Line height:** 1.20–1.33 (tightened as size increases)
- **Letter spacing:** normal at body sizes, slightly tightened at 30px display (~-0.3px)
- **Role:** Custom geometric sans-serif used for everything user-facing: nav links at 13–15px/400, body and product labels at 15px/400, section titles at 22–30px/400, and the FARFETCH wordmark at 700. The 400-weight-only headings are a deliberate anti-bold move — section titles rest at regular weight, confident without shouting, while 700 is reserved for the wordmark and the most emphatic category labels. The custom geometry brings even stroke contrast and subtle humanist warmth that a system Helvetica wouldn't.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.33 | — | `--text-caption` |
| heading-sm | 22px | 1.31 | — | `--text-heading-sm` |
| heading-lg | 30px | 1.2 | -0.3px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48-72px
- **Card padding:** 0px
- **Element gap:** 24px

## Components

### Announcement Bar
**Role:** Top-of-page utility strip with shipping and return policies

Full-bleed #f5f5f5 background, 6–10px vertical padding, centered text at 13px weight 400 #222222. No icons, no close button visible — minimal and informational.

### Header Navigation
**Role:** Primary site header with category nav, wordmark, and utility icons

White background, 0 border-radius, three-zone layout: left-anchored category links (Mujer, Hombre, Niños) at 13px weight 400 #222222 with 24px gap; center-anchored FARFETCH wordmark at 22–30px weight 700; right-anchored flag selector, account, wishlist, and cart icons at 16px stroke #222222. Total height ~64px, no shadow, no sticky visual treatment beyond the default.

### Search Input (Underline)
**Role:** Minimal search field with no visible bounding box

No background, no border, just a 1px #b6b6b6 bottom underline. Placeholder text in #b6b6b6 at 13px weight 400, query text in #222222. Left-aligned magnifying-glass icon at 14px. Width adapts to container; focus state likely darkens the underline to #222222.

### Category Tile (Editorial Hero)
**Role:** Large primary category entry point with overlay label

Full-bleed editorial photograph, 0 border-radius, aspect ratio approximately 4:3 or 16:10. Category label (MUJER, HOMBRE, INFANTIL) overlaid center-center in white at 22–30px weight 400 with generous letter-spacing. No hover effect visible — the tile is a static editorial composition, not an interactive card.

### Product Category Card
**Role:** Secondary category entry beneath each main section (NOVEDADES, ROPA, BOLSOS, ZAPATOS)

Photograph occupying ~75% of card height with 0 border-radius and no border. Caption at 13px weight 400 #222222 in uppercase, left-aligned, positioned below the image with ~12px gap. No price, no metadata, no overlay — pure editorial card.

### Section Title (Serif Display)
**Role:** Centered section heading introducing a product rail

Set in the display/serif treatment of the brand type, 22–30px weight 400, #222222, centered, with ~48px vertical breathing room above and below. Examples: 'Elige una sección', 'Moda para mujer', 'Moda para hombre'.

### Ghost Navigation Link
**Role:** Text-only category link in header

13px weight 400 #222222, no underline at rest, underline on hover with 1px #222222 and a subtle transition. No background, no border, no padding beyond the text bounds.

### Utility Icon Button
**Role:** Flag, account, wishlist, and cart actions in the header

16–20px icon at #222222 stroke 1.5px, no background, no border, 8–12px tap target padding. Active states communicated through weight or fill, not color.

### Footer (Inverted Surface)
**Role:** Terminal page section with site-wide links and legal

#222222 background, white text at 13–15px weight 400, organized in multi-column link lists. This is the only place the page inverts — a confident full-bleed black close after the entire white gallery above.

## Do's and Don'ts

### Do
- Set all text and interactive elements in #222222 — there is no chromatic palette to draw from
- Use 24px as the standard element gap in grids and 48–72px as the section breathing room
- Apply weight 400 to all headings and body; reserve weight 700 exclusively for the wordmark and emphatic category labels
- Render product tiles with 0 border-radius, 0 border, 0 box-shadow — the photograph is the entire visual
- Anchor the header as a three-zone layout: category links left, wordmark center, utility icons right, all on a #ffffff background
- Use #f5f5f5 as the only non-white surface for utility bars and hover washes; #e6e6e6 for hairlines
- Invert to #222222 for the footer as the single dramatic close of an otherwise luminous white page

### Don't
- Never introduce chromatic color anywhere in the interface — color lives exclusively in the photography
- Never apply box-shadow, gradient, or border to product tiles, category cards, or navigation elements
- Never use weight 500 or 600 — the system is strictly binary: 400 for everything, 700 for the wordmark
- Never use filled buttons with background color — the only interactive surface treatments are underline and hover wash
- Never break the 3- or 4-column grid with asymmetric or masonry layouts in product sections
- Never place text directly on imagery without a tested contrast treatment or overlay scrim
- Never use color to signal state — communicate active, hover, and selected through underline, weight shift, or opacity

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the infinite white wall of the gallery |
| 1 | Wash | `#f5f5f5` | Utility bar and hover state for nav strips — the only non-white surface that ever appears |
| 2 | Divider | `#e6e6e6` | Hairline structural separator between product grid rows and footer sections |
| 3 | Inversion | `#222222` | Footer background and any high-contrast terminal surface — used sparingly to close the page |

## Elevation

The system has zero shadow vocabulary. Elevation is achieved through surface tone shifts (Paper → Wash) and photography scale, never through drop-shadow or blur. A product tile is just an image on white with a caption beneath — no card chrome, no border, no lift. This is a deliberate editorial choice: the product IS the elevation, the photograph carries the visual weight that shadows normally would.

## Imagery

Editorial fashion photography dominates the visual system — large-format, high-resolution, full-bleed images of models in architectural indoor settings and tightly cropped product still lifes. The photography itself carries a muted, desaturated palette: concrete walls, natural stone, neutral interiors, soft directional daylight. Models are shot at medium and full length with editorial posing rather than e-commerce catalog stiffness. Product images (bags, shoes) are isolated on neutral gray or stone backgrounds with no lifestyle context — the object IS the hero. The interface contributes zero imagery chrome: no badges, no promotional stickers, no decorative frames. All visual richness comes from the photography department, not the design system.

## Layout

The page is a centered, full-width composition with a max content width of ~1280px. The header is a thin three-zone bar (category nav left, centered wordmark, utility icons right) with the search field floating beneath on the right. The first section is a 3-column grid of full-bleed editorial category tiles (MUJER, HOMBRE, INFANTIL), each with an overlay label. Below each category section, a 4-column grid of product category cards (NOVEDADES, ROPA, BOLSOS, ZAPATOS) with uppercase captions. Section titles are centered in display type with ~48px vertical padding above and below. No alternating background bands — the entire page is one continuous white field. The footer inverts to #222222 as the single dark band. Navigation is a minimal top bar with no sticky treatment, no mega-menu chrome, and no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- text: #222222
- background: #ffffff
- border: #e6e6e6
- muted text: #727272
- icon / placeholder: #b6b6b6
- surface wash: #f5f5f5
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Category tile (editorial hero)*: Full-width image filling a 4:3 container, 0px border-radius, no border, no shadow. Category label centered over the image in white, 30px Farfetch Basis weight 400, letter-spacing 0.5px. No hover effect, no overlay — the photograph and the word are the entire component.

2. *Product category card*: Photograph in a 1:1 or 3:4 container, 0px border-radius, no border, no shadow. Caption below at 13px Farfetch Basis weight 400, #222222, uppercase, left-aligned, 12px margin-top from the image. No price, no badge, no metadata.

3. *Header navigation*: White background, 64px height, three zones. Left: 'Mujer · Hombre · Niños' at 13px weight 400, #222222, 24px gap between links. Center: 'FARFETCH' wordmark at 24px weight 700, #222222. Right: four 18px outline icons (flag, person, heart, bag) at #222222, 16px gap. No border-bottom, no shadow.

4. *Underlined search input*: Full width of its container, 1px solid #b6b6b6 bottom border only, no other borders, no background. Placeholder 'Buscar piezas y marcas' at 13px weight 400, #b6b6b6. 14px magnifying-glass icon at left. Focus state: bottom border becomes #222222.

5. *Section title*: Centered text 'Moda para mujer' in the serif/display variant of the brand type, 30px weight 400, #222222. 48px padding-top and padding-bottom. No border, no decorative element — the title and its white space are the entire section opener.

## Typography Duality

The visual system operates on a two-mode typography model: (1) the custom geometric sans-serif (Farfetch Basis) at 400/700 for all functional UI — navigation, body, product labels, utility text; (2) a display/serif treatment reserved for section titles and the wordmark, treating these elements as editorial composition rather than UI. This duality means an AI agent should not apply one typeface uniformly — the section title and the product caption beneath its grid are intentionally different voices, and that contrast is what makes the hierarchy readable at a glance.

## The Photography-as-Color Principle

The system has been architected so that the interface provides zero chromatic information. Every hue, every texture, every gradient the user perceives comes from the product photography. This means: (a) the design system cannot rely on color-coded states — use weight, underline, and opacity instead; (b) product images must carry their own visual context (background, lighting, styling) because the page provides none; (c) any chromatic addition to the UI would break the contract and feel like an error. An AI agent building new screens should treat the #ffffff canvas as a stage and the images as the only performers.

## Similar Brands

- **SSENSE** — Same editorial-fashion-gallery approach — achromatic interface, large-format editorial photography, display serif section titles, ghost navigation, zero shadows on product tiles
- **Mr Porter** — Identical monochrome restraint with a strong serif/sans duality, centered wordmark, uppercase category labels beneath imagery, and product tiles that are pure image with a caption
- **Net-a-Porter** — Same luxury-fashion white-cube philosophy — white canvas, editorial photography, thin sans-serif body type, generous section breathing room, and the absence of decorative chrome
- **COS** — Same architectural minimalism — full-bleed photography, strict grid systems, monochrome interface that lets the product be the only color, generous whitespace as the primary layout tool
- **Aesop** — Same typographic confidence and restraint — custom sans-serif body, serif display moments, completely achromatic interface, zero decorative elements, typography as the only structure

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon: #222222;
  --color-paper: #ffffff;
  --color-ash-gray: #b6b6b6;
  --color-stone: #f5f5f5;
  --color-graphite: #727272;
  --color-smoke: #e6e6e6;

  /* Typography — Font Families */
  --font-farfetch-basis: 'Farfetch Basis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.33;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.31;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48-72px;
  --card-padding: 0px;
  --element-gap: 24px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-wash: #f5f5f5;
  --surface-divider: #e6e6e6;
  --surface-inversion: #222222;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon: #222222;
  --color-paper: #ffffff;
  --color-ash-gray: #b6b6b6;
  --color-stone: #f5f5f5;
  --color-graphite: #727272;
  --color-smoke: #e6e6e6;

  /* Typography */
  --font-farfetch-basis: 'Farfetch Basis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.33;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.31;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.3px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-72: 72px;
}
```
