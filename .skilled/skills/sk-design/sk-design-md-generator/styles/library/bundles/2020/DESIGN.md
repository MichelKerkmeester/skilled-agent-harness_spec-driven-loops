# 2020 — Style Reference
> Solid color poster wall. A single saturated color fills the viewport like painted drywall, and massive black type sits on top as if stenciled.

**Theme:** light

Album Colors is a color-first editorial canvas: the entire viewport is a single saturated wash that changes on refresh, and everything else — type, images, UI — defers to it. The design language is brutally minimal: one custom geometric sans (Helvetica LT Pro) in a single weight, set at extraordinary sizes with aggressively tight leading, producing headline blocks that read as solid shapes rather than text. Color is the product, the navigation, and the identity — the only chrome is a small record-button icon in the corner and a rotated label urging the viewer to refresh. Album covers float on the colored field as unframed tiles; the page is closer to a poster than a website.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Orange | `#e4822e` | `--color-signal-orange` | Primary canvas — the full-viewport page background that changes on refresh; this is the design system |
| Olive Ink | `#4f503e` | `--color-olive-ink` | Primary text, headline color, and the only outlined action accent (outlined-button borders, link underlines) — warm dark green-brown that pairs with the orange field without competing chroma |
| Oxblood | `#b13225` | `--color-oxblood` | Alternating surface variation — one of the page colors the background can take on refresh |
| Burnt Sienna | `#c97f40` | `--color-burnt-sienna` | Alternating surface variation — secondary warm shade the canvas can adopt |
| Near Black | `#081618` | `--color-near-black` | Alternating surface variation — deep cool surface the canvas can adopt, creates the darkest mode of the page |
| Pearl | `#feccc0` | `--color-pearl` | Soft warm highlight — one of the lighter surface variations the canvas can adopt |
| Sage Mist | `#99aa91` | `--color-sage-mist` | Soft cool surface variation — one of the muted color states the canvas cycles through |
| Carbon | `#000000` | `--color-carbon` | Album cover backgrounds, deep text on light surface states |
| Ink | `#161616` | `--color-ink` | Album cover backgrounds and heavy dark surface tone |
| Charcoal | `#111111` | `--color-charcoal` | Album cover and card backgrounds within the grid |
| Ash | `#8d8d8d` | `--color-ash` | Mid-neutral for muted helper text and secondary surface states |
| Paper | `#ffffff` | `--color-paper` | Album cover backgrounds, text on dark surface states |

## Tokens — Typography

### Helvetica LT Pro — The sole typeface across all text — display, heading, body, button, link. A single weight (400 regular) is used at every scale, which is the most distinctive typographic choice on the site. The whisper-regular giant-size headlines are anti-convention; most poster/editorial sites use 700–900 for display type, and using the book weight at 137px makes the headline feel stamped rather than shouted — authority through stillness. · `--font-helvetica-lt-pro`
- **Substitute:** Helvetica Neue, Inter, Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 16px, 21px, 75px, 137px
- **Line height:** 0.79 (display), 0.80 (heading), 0.90 (heading), 1.20 (subheading/button), 1.60 (body)
- **Letter spacing:** -0.0500em at every size (equates to -0.8px at 16px, -1.05px at 21px, -3.75px at 75px, -6.85px at 137px)
- **Role:** The sole typeface across all text — display, heading, body, button, link. A single weight (400 regular) is used at every scale, which is the most distinctive typographic choice on the site. The whisper-regular giant-size headlines are anti-convention; most poster/editorial sites use 700–900 for display type, and using the book weight at 137px makes the headline feel stamped rather than shouted — authority through stillness.

### Helvetica — Helvetica — detected in extracted data but not described by AI · `--font-helvetica`
- **Weights:** 400
- **Sizes:** 21px
- **Line height:** 1.2
- **Role:** Helvetica — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.6 | -0.8px | `--text-caption` |
| subheading | 21px | 1.2 | -1.05px | `--text-subheading` |
| heading | 75px | 0.8 | -3.75px | `--text-heading` |
| display | 137px | 0.79 | -6.85px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |

### Border Radius

| Element | Value |
|---------|-------|
| page | 0px |
| tags | 0px |
| buttons | 0px |
| album-tiles | 0px |

### Layout

- **Section gap:** 20px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Display Headline Block
**Role:** The page-defining typographic element — site title rendered as a monolithic shape

Helvetica LT Pro 400 at 137px, line-height 0.79, letter-spacing -0.05em. Color is Olive Ink (#4f503e) — always dark regardless of canvas color. Text fills 2–4 lines of full-bleed width at the top of the page. No line breaks are manually constrained; the type wraps naturally to create a dense rectangular block. Padding: 0px from edges. This block is the visual signature.

### Section Subtitle
**Role:** Short descriptive line that sits directly under the display headline

Helvetica LT Pro 400 at 21px, line-height 1.2, letter-spacing -0.05em. Olive Ink (#4f503e). Set as a single sentence in all-caps, full-bleed or near-full-bleed width. Acts as the typographic period after the display headline.

### Album Cover Tile
**Role:** Unframed square image in the content grid

1:1 aspect ratio, 0px border-radius, 0px border, no padding, no shadow. Sits directly on the canvas with no gap treatment — the colored field bleeds between tiles. Sizing scales with viewport but tiles are uniform within a row.

### Refresh Record Button
**Role:** The only interactive control — a small circular record/disc icon that triggers a full page color change

Olive Ink (#4f503e) icon on the canvas background. Small, top-right corner. Functions as both the CTA and a visual metaphor (vinyl record). 0px border-radius (sharp) or true circle depending on icon shape — the icon itself is a simple disc with a center dot.

### Rotated Side Label
**Role:** Vertical instructional text — tells the user the page mechanic

Set in Helvetica LT Pro 400 at 16px, line-height 1.6, letter-spacing -0.05em. Olive Ink (#4f503e). Rotated 90° (reads bottom-to-top). Positioned flush to the right edge of the viewport. Acts as a micro-copy label rather than a control.

### Outlined Action Border
**Role:** Chromatic border treatment for interactive elements (links, tags, light buttons)

1px border in Olive Ink (#4f503e). No background fill. Padding ~20px. 0px border-radius. Pairs with Olive Ink text. This is the only 'button' variant — the site never uses filled buttons because the canvas color would clash with any solid fill.

### Body Caption
**Role:** Small helper text used in metadata, tags, or footnotes

Helvetica LT Pro 400 at 16px, line-height 1.6, letter-spacing -0.05em. Olive Ink (#4f503e) when on the orange canvas; Paper (#ffffff) when on dark album tiles or dark canvas states.

### Subheading Link
**Role:** In-text or tag-style link element

Helvetica LT Pro 400 at 21px, line-height 1.2, letter-spacing -0.05em. Olive Ink (#4f503e) with 1px Olive Ink underline. No hover state change beyond opacity reduction. Behaves like a static text label.

## Do's and Don'ts

### Do
- Set display headlines at 137px / line-height 0.79 / letter-spacing -0.05em in Helvetica LT Pro 400 — never bump the weight, the book weight is the signature
- Use Olive Ink (#4f503e) for all text and borders regardless of canvas color — the text must always be the same dark warm tone so the changing background feels like a single identity expressing different moods
- Let the page canvas fill 100% of the viewport edge-to-edge with no container, no max-width, no margin — full-bleed is non-negotiable
- Use 20px as the only spacing unit — vertical rhythm between the headline, subtitle, and grid is always 20px
- Keep all radii at 0px — album tiles, buttons, and tags are sharp-cornered; the colored field provides all the softness the page needs
- Treat the canvas color as the primary navigation: the user changes the page by changing the background, not by clicking links
- Set every text element in a single weight (400) — do not introduce bold, medium, or light variants

### Don't
- Do not use filled buttons — a solid fill would compete with the canvas color; all actions are outlined borders or pure icons
- Do not add card frames, drop shadows, or elevation to album tiles — they sit directly on the canvas with no chrome
- Do not introduce a second typeface — the entire site is set in one family at one weight
- Do not center body text — copy aligns left, full-bleed, and wraps naturally
- Do not use a max-width container — the layout is always edge-to-edge
- Do not pair Olive Ink (#4f503e) text with a colored background outside the established palette (oxblood, sienna, near-black, sage, pearl) — the six surface colors are the only valid canvases
- Do not add line-height above 1.0 for any size above 21px — the tight leading (0.79–0.80) on display text is what makes the headlines feel like solid shapes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e4822` | Full-viewport colored field that changes on refresh — the dominant surface |
| 1 | Album Tile | `#ffffff` | Default album cover background within the grid |
| 2 | Dark Album Tile | `#000000` | Dark album cover backgrounds for contrast within the grid |

## Imagery

The site's only imagery is a uniform grid of 1:1 album cover thumbnails. The covers are user-submitted editorial objects — they are the content, not decoration. The grid is unframed, radius-less, and bleeds directly into the canvas color. There is no lifestyle photography, no illustration, no abstract graphics. The colored background functions as the visual atmosphere; the album covers are the products on display. Above the grid, a single magazine-cover-style layout positions the massive headline, subtitle, and one featured album hero — the visual hierarchy is editorial poster, not web page.

## Layout

Full-bleed single-screen-per-color layout. The viewport is divided into two horizontal bands: a top header zone (~40% height) containing the massive multi-line display headline spanning full width, a one-line subtitle beneath it, and one hero album cover image; and a content zone below containing a uniform grid of square album cover tiles. No sidebar, no max-width constraint, no centered column — everything is edge-to-edge. The only off-canvas element is a 90°-rotated label pinned to the right edge. Navigation is absent; the user is invited to refresh rather than click. The grid density scales with viewport but tile size stays large — this is a poster, not a feed.

## Agent Prompt Guide

**Quick Color Reference**
- text: #4f503e (Olive Ink)
- background: #e4822e (Signal Orange) — changes on refresh
- border: #4f503e (Olive Ink, 1px)
- accent: #b13225 (Oxblood) / #c97f40 (Burnt Sienna) / #081618 (Near Black) — alternative canvas states
- surface: #ffffff (Paper) for light album tiles, #000000 (Carbon) for dark album tiles
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build the page hero: full-bleed Signal Orange (#e4822e) background, no padding, no container. Display headline 'ALBUM COLORS OF THE YEAR 2020' in Helvetica LT Pro 400 at 137px, line-height 0.79, letter-spacing -0.05em, color Olive Ink (#4f503e). Text fills width edge-to-edge, wrapping naturally. A 21px Olive Ink subtitle sits 20px below.
2. Build a single album tile: 1:1 aspect ratio, 0px border-radius, no border, no shadow, no padding. Sits directly on the canvas with 20px gap to neighbors. Image fills the tile.
3. Build the refresh button: top-right corner, 20px from edges, Olive Ink (#4f503e) disc icon on the orange canvas. No border, no background, icon only.
4. Build the rotated side label: positioned flush to the right viewport edge, text rotated 90° reading bottom-to-top, Helvetica LT Pro 400 at 16px, line-height 1.6, letter-spacing -0.05em, color Olive Ink (#4f503e).
5. Build the album grid: uniform columns of square tiles, 20px gap, no outer padding, tiles bleed to the viewport edges. Mix of Paper (#ffffff) and Carbon (#000000) backgrounds depending on cover content.

## Color-Mechanic Philosophy

The page background is the navigation system. There are no menus, no links to other pages, no categories — the only way to 'explore' the site is to refresh, which randomizes the entire canvas to a new color from a fixed six-color palette. This makes the background color a generated state, not a designed constant. When recreating this system, treat the canvas color as a variable token, not a fixed brand color: the brand is the mechanic of color change itself, and Olive Ink (#4f503e) is the one constant that anchors the identity across every color state.

## Similar Brands

- **Pantone Color of the Year** — Same single-color-canvas editorial treatment where the color itself is the subject — Pantone's year-of-color pages are also one saturated wash with minimal type on top
- **It's Nice That** — Editorial curation site with full-bleed colored fields and oversized sans-serif headlines set tight to the edges — the poster-meets-web layout grammar
- **Are.na** — Minimalist image-grid curation with zero chrome around tiles and a strong single-color identity — the no-frames, no-shadows, no-radius tile approach is shared
- **Kiel Mutschelknaus / Swiss design editorial sites** — Same Helvetica-driven, tight-leading, single-weight, massive-scale typographic system — the headline-as-solid-shape aesthetic comes directly from this Swiss tradition
- **The Browser Company / Frank Chimero** — Both treat a website as a poster rather than an app — one bold idea per page, the color is the story, the chrome is nearly absent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-orange: #e4822e;
  --color-olive-ink: #4f503e;
  --color-oxblood: #b13225;
  --color-burnt-sienna: #c97f40;
  --color-near-black: #081618;
  --color-pearl: #feccc0;
  --color-sage-mist: #99aa91;
  --color-carbon: #000000;
  --color-ink: #161616;
  --color-charcoal: #111111;
  --color-ash: #8d8d8d;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-helvetica-lt-pro: 'Helvetica LT Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.6;
  --tracking-caption: -0.8px;
  --text-subheading: 21px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1.05px;
  --text-heading: 75px;
  --leading-heading: 0.8;
  --tracking-heading: -3.75px;
  --text-display: 137px;
  --leading-display: 0.79;
  --tracking-display: -6.85px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;

  /* Layout */
  --section-gap: 20px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-page: 0px;
  --radius-tags: 0px;
  --radius-buttons: 0px;
  --radius-album-tiles: 0px;

  /* Surfaces */
  --surface-canvas: #e4822;
  --surface-album-tile: #ffffff;
  --surface-dark-album-tile: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-orange: #e4822e;
  --color-olive-ink: #4f503e;
  --color-oxblood: #b13225;
  --color-burnt-sienna: #c97f40;
  --color-near-black: #081618;
  --color-pearl: #feccc0;
  --color-sage-mist: #99aa91;
  --color-carbon: #000000;
  --color-ink: #161616;
  --color-charcoal: #111111;
  --color-ash: #8d8d8d;
  --color-paper: #ffffff;

  /* Typography */
  --font-helvetica-lt-pro: 'Helvetica LT Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.6;
  --tracking-caption: -0.8px;
  --text-subheading: 21px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1.05px;
  --text-heading: 75px;
  --leading-heading: 0.8;
  --tracking-heading: -3.75px;
  --text-display: 137px;
  --leading-display: 0.79;
  --tracking-display: -6.85px;

  /* Spacing */
  --spacing-20: 20px;
}
```
