# UY Studio — Style Reference
> Monastic stone gallery — a quiet concrete-walled space where perfume bottles sit on white plinths, lit by one weight-400 voice and four warm grays.

**Theme:** light

UY operates as a monastic gallery: four warm grays, one weight of type, zero ornament. The entire interface speaks in a single 400-weight voice from 13px captions to 48px display lines, letting whitespace and grid alignment do what color and weight would in a louder system. The palette is almost geological — a limestone canvas, soot text, chalk surfaces, and a single graphite for the rare dark button — all warm-tinted to harmonize with the raw concrete and weathered plaster in the photography. Products are treated as still-life objects on white plinths, presented full-bleed against textured walls with no decorative chrome, UI patterns, or color to compete with the objects themselves.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Soot | `#24241f` | `--color-soot` | Primary text, all icon strokes, hairline borders, nav links, footer text — the single dark voice of the system |
| Limestone | `#d1d3cf` | `--color-limestone` | Page canvas, announcement bar, nav background — the warm-tinted near-gray that replaces white as the system's base tone |
| Chalk | `#e5e5e5` | `--color-chalk` | Secondary surface, subtle borders, product photo backgrounds — a slightly cooler neutral for layering atop Limestone |
| Graphite | `#333333` | `--color-graphite` | Dark button fill — the only filled surface in the system, used sparingly for a single tonal shift from the Soot text |

## Tokens — Typography

### GP — Universal typeface — used for nav, body, headings, buttons, and footer at weight 400 only. The single-weight constraint is the signature: no bold, no light, no medium. Hierarchy comes from size (13→48px) and tracking (0.0110em body, 0.0390em display), not weight contrast. The slight positive tracking gives the type an editorial, architectural quality. · `--font-gp`
- **Substitute:** Inter or DM Sans
- **Weights:** 400
- **Sizes:** 13px, 15px, 16px, 30px, 48px
- **Line height:** 1.10–1.77
- **Letter spacing:** 0.0110em (body 13–16px), 0.0390em (display 30–48px)
- **Role:** Universal typeface — used for nav, body, headings, buttons, and footer at weight 400 only. The single-weight constraint is the signature: no bold, no light, no medium. Hierarchy comes from size (13→48px) and tracking (0.0110em body, 0.0390em display), not weight contrast. The slight positive tracking gives the type an editorial, architectural quality.

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.14px | `--text-caption` |
| body-sm | 15px | 1.5 | 0.17px | `--text-body-sm` |
| subheading | 30px | 1.2 | 1.17px | `--text-subheading` |
| heading | 48px | 1.1 | 1.87px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 143 | 143px | `--spacing-143` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| inputs | 3px |
| buttons | 0px |

### Layout

- **Section gap:** 96px
- **Card padding:** 16px
- **Element gap:** 13px

## Components

### Announcement Bar
**Role:** Top-of-page brand message strip

Full-width bar at the very top, Limestone (#d1d3cf) background, Soot (#24241f) text, GP 400 at 13px with 0.14px tracking. Centered text. 1px Soot bottom border. Sits above the nav with no gap.

### Main Navigation
**Role:** Primary site navigation

Full-width bar, Limestone background, 1px Soot bottom border. Three zones: left-aligned category links (FRAGRANCE COLLECTION ▾, CORE HOMEWEAR, GIFT COLLECTION, CLOTHING), centered wordmark 'UY' at 30px, right-aligned utility links (JOURNAL, THE STUDIO ▾, LOG IN, EUR ▾, cart icon, account icon). All text GP 400, 13px, Soot. Category links have 13px horizontal spacing between items.

### Hero Image with Overlay Text
**Role:** Full-bleed editorial banner

Edge-to-edge product photography (no border-radius) with centered text overlay. Overlay text is Chalk (#e5e5e5) on the darker portions of the image, GP 400 at 48px, letter-spacing 1.87px. Text is vertically centered. No gradient overlay — text relies on the image's natural contrast zones.

### Product Card
**Role:** Individual product listing in the grid

Full-bleed product photo on Chalk (#e5e5e5) surface, 0px radius. Below the image: product name and price in GP 400, 15px, Soot (#24241f), centered, 0.17px tracking. Name and price are on the same line or stacked. No card border, no shadow — the product photo IS the card.

### Product Grid
**Role:** 5-column product listing

Equal-width 5-column grid spanning the full viewport width. Each column holds one Product Card. 1px Soot vertical dividers between columns. 1px Soot horizontal divider below the entire grid. No gutters between columns — the dividers create the grid structure.

### Newsletter Input
**Role:** Email signup field

Single-line text input, no fill, 1px Soot (#24241f) bottom border only (underline style), 3px border-radius. Placeholder 'E-mail' in GP 400, 15px, Soot, 0.17px tracking. No label. The 'JOIN' action is a text link to the right, GP 400, 15px, Soot, with no underline by default.

### Footer Link Column
**Role:** Footer navigation links

Vertical stack of text links, GP 400, 13px, Soot (#24241f), 0.14px tracking. No bullet points, no icons. Left-aligned. Column header (e.g. 'OPENING TIMES') is uppercase at 13px. 1px Soot top border separates footer from product grid.

### Language Toggle
**Role:** Language selector

Two-letter codes (EN | DE) separated by a thin Soot vertical bar. GP 400, 13px, Soot. Positioned bottom-left of the hero overlay. Active language is bold by convention — but since weight 400 is the only weight, active state uses a Soot underline instead.

### Dropdown Nav Link
**Role:** Category navigation with submenu indicator

Standard nav link (GP 400, 13px, Soot) followed by a small downward chevron (▾). The chevron is a text character, not an icon. No background change, no border on hover — the link underline appears on hover.

### Utility Icon
**Role:** Cart and account icons in nav

Stroke-only icons (bag silhouette, person silhouette) in Soot (#24241f), approximately 16px. No fill. Positioned at the far right of the nav. Icons are inline with text links at the same 13px baseline.

## Do's and Don'ts

### Do
- Use GP at weight 400 for ALL text — from 13px footer notes to 48px display lines. No bold, no semibold, no light variants exist in this system.
- Use Limestone (#d1d3cf) as the page background for every screen. Never substitute pure white (#ffffff) — the warm gray tint is the system's identity.
- Use Soot (#24241f) for all text, icon strokes, and 1px borders. The warm-tinted near-black replaces standard #000 and ties the type to the concrete textures in the photography.
- Apply 0.0390em letter-spacing to display sizes (30px+) and 0.0110em to body sizes (13–16px). The dual-tracking system is how hierarchy is expressed in a single-weight world.
- Use 0px border-radius on all cards, images, and containers. 3px radius is reserved exclusively for text inputs. Sharp edges reinforce the architectural, gallery-like feel.
- Present products as full-bleed photography on Chalk (#e5e5e5) surfaces with no card borders or shadows. The photograph IS the card.
- Use text links with underlines as the primary interaction pattern. Filled buttons in Graphite (#333333) are reserved for single-purpose dark actions and should appear at most once per page.

### Don't
- Don't introduce bold, semibold, or light font weights. Weight 400 is the only voice — adding weight would break the flat, even texture that defines the system.
- Don't add saturated colors, brand hues, or accent fills. The palette is four warm grays only — any chromatic color would shatter the monastic quality.
- Don't use box-shadow or drop-shadow for elevation. Depth comes from the warm-gray surface stack (Limestone → Chalk → Graphite → Soot), not from shadows.
- Don't round corners on cards, images, or containers. 0px everywhere except inputs. Rounded corners would soften the architectural, museum-pedestal feel.
- Don't use color or weight to indicate interactive states. Use Soot underlines on hover, position shifts on active, and the underline-on-current pattern for navigation state.
- Don't add decorative gradients, patterns, background textures, or ornamental graphics. The only imagery is product photography against real textures.
- Don't use filled, colored, or rounded icon buttons. Icons are stroke-only in Soot, inline with text at the same baseline. The interface is text-first.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Limestone Canvas | `#d1d3cf` | Page background, nav, announcement bar — the base warm gray that defines the entire tonal range |
| 1 | Chalk Surface | `#e5e5e5` | Product photography backgrounds, subtle dividers — cooler neutral for the white plinths in product shots |
| 2 | Graphite Button | `#333333` | Rare dark button fill — the only tonal step down from text, used for single-purpose dark actions |
| 3 | Soot Text | `#24241f` | Text, icon strokes, hairline borders — functions as the darkest surface in the tonal stack |

## Elevation

The system deliberately avoids box-shadows and drop-shadows. Elevation is communicated entirely through the warm-gray surface stack: Limestone (page) → Chalk (product surfaces) → Graphite (dark button) → Soot (text and borders). Where depth is needed, it comes from 1px hairline borders in Soot, not from blur or offset shadows. The only shadows in the system are the natural ones cast by products in the photography.

## Imagery

Product photography is editorial still-life: perfume bottles, candles, and room sprays shot in natural directional light against raw concrete and weathered plaster walls. Products rest on white or off-white plinths, creating a museum-pedestal effect. Full-bleed hero images, contained grid thumbnails with no rounding. Long, dramatic shadows cast across the surfaces. Color treatment is desaturated and warm — amber liquids in glass bottles, natural wax tones, the warm gray of concrete and stone. No lifestyle imagery, no models, no hands — the object alone is the subject, lit like a gallery installation. The photography carries all the visual warmth that the UI refuses to express through color.

## Layout

Full-bleed layout with no max-width container — every section spans edge to edge. Navigation is a single horizontal bar: left-aligned category links, centered wordmark, right-aligned utility links, all on one row. The hero is full-viewport-height photography with centered text overlay. The product grid is a 5-column equal-width layout filling the viewport, separated by 1px Soot dividers. Footer is a horizontal band with three link columns and a newsletter input, all on the Limestone canvas. Vertical rhythm is generous: 96px between major sections, with the hero-to-grid transition being the largest break. No sidebar, no asymmetric compositions — everything is centered or evenly distributed. The page reads top-to-bottom as: announcement → nav → hero → product grid → footer, a clean vertical stack with no deviation.

## Agent Prompt Guide

## Quick Color Reference
- text: #24241f (Soot)
- background: #d1d3cf (Limestone)
- border: #24241f (Soot, 1px hairline)
- accent: #d1d3cf (Limestone — the warm gray IS the accent)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Overlay Text**: Centered text over a full-bleed product photograph. GP 400, 48px, color #e5e5e5, letter-spacing 1.87px, line-height 1.10. Vertically centered in the viewport. No background overlay — text relies on the image's natural dark areas for contrast.

2. **Product Card**: Full-bleed product photograph on a #e5e5e5 surface, 0px border-radius, no border, no shadow. Below the image: product name and price in GP 400, 15px, #24241f, centered, letter-spacing 0.17px. The name and price sit on one line or stack with 4px gap. No card padding on the image — the photo fills the column edge to edge.

3. **Navigation Link**: GP 400, 13px, #24241f, letter-spacing 0.14px, text-transform uppercase. No background, no border. On hover: 1px #24241f underline. Active state: permanent underline. 13px horizontal spacing between adjacent links. Chevron ▾ characters for dropdowns are inline text, not icons.

4. **Newsletter Input**: Single-line text input, no background fill, 1px #24241f bottom border only (underline style), 3px border-radius. Placeholder 'E-mail' in GP 400, 15px, #24241f, letter-spacing 0.17px. The 'JOIN' action to the right is a text link in GP 400, 15px, #24241f, with no default underline.

5. **Footer Link Column**: Vertical stack of text links, GP 400, 13px, #24241f, letter-spacing 0.14px, left-aligned. Column header uppercase at 13px. 17px vertical gap between links. 1px #24241f top border above the entire footer block. No icons, no bullets, no dividers between links.

## The Letter System

Every product carries a single uppercase letter as its primary brand mark (T, U, S). This letter is rendered in the same GP 400 weight as all other typography, at a large display size on the product label. The letter system is a typographic logo reduced to its most essential element — one character, one weight, one voice. When building new product pages, assign each product line a single letter and render it as a display element on the label. Do not add logos, wordmarks, or secondary marks to product surfaces.

## Similar Brands

- **Byredo** — Same single-weight sans-serif typography and monochrome product photography approach, with editorial type that whispers rather than shouts
- **Aesop** — Same warm-neutral palette and museum-pedestal product presentation, where the object is the hero and the UI stays out of the way
- **Le Labo** — Same raw-material-forward aesthetic and sparse, text-based navigation with zero decorative chrome on the product cards
- **The Row** — Same weight-400-only typography philosophy and warm grayscale palette that treats restraint as the ultimate luxury signal
- **Mansur Gavriel** — Same full-bleed product photography and minimal text-driven interface where negative space carries the compositional weight

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-soot: #24241f;
  --color-limestone: #d1d3cf;
  --color-chalk: #e5e5e5;
  --color-graphite: #333333;

  /* Typography — Font Families */
  --font-gp: 'GP', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.14px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.17px;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: 1.17px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: 1.87px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-143: 143px;

  /* Layout */
  --section-gap: 96px;
  --card-padding: 16px;
  --element-gap: 13px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 3px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-limestone-canvas: #d1d3cf;
  --surface-chalk-surface: #e5e5e5;
  --surface-graphite-button: #333333;
  --surface-soot-text: #24241f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-soot: #24241f;
  --color-limestone: #d1d3cf;
  --color-chalk: #e5e5e5;
  --color-graphite: #333333;

  /* Typography */
  --font-gp: 'GP', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.14px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.17px;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: 1.17px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: 1.87px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-143: 143px;

  /* Border Radius */
  --radius-sm: 3px;
}
```
