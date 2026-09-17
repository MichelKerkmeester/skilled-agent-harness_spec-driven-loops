# Fidèle Editions — Style Reference
> Risograph blue ink on warm cream paper. A single fluorescent blue floods headlines, the announcement bar, and a giant asterisk logo, stamped onto a flat cream stock with zero shadows and near-zero rounding — the page reads as a printed broadsheet, not a SaaS interface.

**Theme:** light

Fidèle Editions operates as a risograph studio's web storefront: a warm cream paper canvas printed with one aggressive blue ink. The entire system is built on flatness — no shadows, no gradients, near-zero corner rounding, no decorative borders. Typography does the heavy lifting: a custom geometric sans (BaselGrotesk) at extreme size contrast, with display sizes crushed tight at 0.92 line-height and negative tracking, while small labels breathe with wide positive tracking. The vivid blue is used as a printing press uses ink — for type, nav, the announcement bar, and the massive asterisk logo — never as a subtle accent. Content lives in dense, editorial blocks: full-bleed imagery, tight product grids, photo strips. Every element feels stamped onto paper, not rendered on a screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fidèle Blue | `#1664eb` | `--color-fidle-blue` | Headlines, nav links, brand asterisk, announcement bar fill, body borders — the single chromatic ink of the system; whenever color appears, this is it |
| Lighter Press Blue | `#4f89ec` | `--color-lighter-press-blue` | Secondary blue used for subtle borders, icon tints, and decorative strokes where Fidèle Blue would dominate |
| Link Blue | `#006ce5` | `--color-link-blue` | Deeper blue for inline hyperlinks within running text, slightly darker than the primary to read as a separate interactive state |
| Paper White | `#f8f7ef` | `--color-paper-white` | Page canvas and card surfaces — a warm off-white that gives the entire system its print-stock identity; never use pure #ffffff for page background |
| Card Cream | `#e2e2df` | `--color-card-cream` | Elevated surface for cards, panels, and product tiles — one step warmer/darker than Paper White for layering without shadows |
| Pure White | `#ffffff` | `--color-pure-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Press Black | `#121212` | `--color-press-black` | Body text, dark backgrounds, and the rare filled button — near-black rather than pure black, softening contrast on the cream stock |

## Tokens — Typography

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### BaselGrotesk — The sole typeface of the system. Book weight (400) for body and most UI; Regular (400) for lists and some headings; Bold (700) for the rarest emphasis. Display sizes (62px) use line-height 0.92 with -0.049em tracking — characters nearly touch. Small labels (14px) use +0.063em tracking — wide, airy, stamped. The contrast between these two tracking regimes is the type signature. · `--font-baselgrotesk`
- **Substitute:** Inter, or NB International Pro for a closer geometric match
- **Weights:** 400 (Book), 400 (Regular), 700 (Bold)
- **Sizes:** 14, 16, 20, 22, 24, 26, 28, 32, 37, 38, 41, 62
- **Line height:** 0.92–1.80
- **Letter spacing:** Display 62px: -0.049em (~-3.0px); 32–41px: -0.020em (~-0.8px); 20–28px: 0.025em (~+0.5px); 14–16px body: 0.043–0.067em (~+0.6 to +1.0px)
- **Role:** The sole typeface of the system. Book weight (400) for body and most UI; Regular (400) for lists and some headings; Bold (700) for the rarest emphasis. Display sizes (62px) use line-height 0.92 with -0.049em tracking — characters nearly touch. Small labels (14px) use +0.063em tracking — wide, airy, stamped. The contrast between these two tracking regimes is the type signature.

### OTMagister — Occasional display headlines where a more editorial/serif-leaning voice is wanted. Same 62px display size and tight 0.92 leading as BaselGrotesk display, -0.016em tracking. · `--font-otmagister`
- **Substitute:** GT Sectra Display, or Editorial Old (Pangram Pangram)
- **Weights:** 400
- **Sizes:** 62
- **Line height:** 0.92
- **Letter spacing:** -0.0160em
- **Role:** Occasional display headlines where a more editorial/serif-leaning voice is wanted. Same 62px display size and tight 0.92 leading as BaselGrotesk display, -0.016em tracking.

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Assistant — Assistant — detected in extracted data but not described by AI · `--font-assistant`
- **Weights:** 400
- **Sizes:** 26px
- **Line height:** 1.5
- **Letter spacing:** 0.025
- **Role:** Assistant — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 0.88px | `--text-caption` |
| body-sm | 16px | 1.5 | 0.69px | `--text-body-sm` |
| body | 20px | 1.3 | 0.5px | `--text-body` |
| subheading | 22px | 1.3 | 0.55px | `--text-subheading` |
| heading-sm | 26px | 1.2 | 0.65px | `--text-heading-sm` |
| heading | 32px | 1 | -0.64px | `--text-heading` |
| heading-lg | 37px | 0.96 | -0.74px | `--text-heading-lg` |
| display | 62px | 0.92 | -3px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 156 | 156px | `--spacing-156` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 4px |
| images | 0px |
| buttons | 4px |

### Layout

- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 5px

## Components

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-bleed solid Fidèle Blue (#1664eb) background, white text, 1px white internal border. Centered single-line text in BaselGrotesk Book 14px, line-height 1.5, tracking +0.88px. Height ~40px. Acts as the loudest brand-color beat on every page.

### Top Navigation Bar
**Role:** Primary site navigation

Paper White (#f8f7ef) background, no border. Three-column flex: left nav links (Shop, About, Journal) in Fidèle Blue 14px; center wordmark 'Fidèle Editions' where 'Fidèle' is blue and 'Editions' is Press Black; right cluster (language selector, search icon, cart icon) in Fidèle Blue. Nav links have 5px horizontal padding. Height ~56px. No dropdown menus visible — flat, link-only.

### Hero Image Block
**Role:** Full-bleed editorial photograph

Edge-to-edge image with no rounding and no overlay. Sits directly below the nav and announcement bar. May have a single-line headline in BaselGrotesk 32–37px Fidèle Blue overlaid on the Paper White above the image, left-aligned with 14–24px padding.

### Product Card
**Role:** Grid tile for a book, zine, t-shirt, or blanket

Square product image, 1px Pure White (#ffffff) border, no rounding, Card Cream (#e2e2df) background behind image for letterboxing. Below image: product title in Press Black 14px, artist name in Press Black 14px, price right-aligned in Press Black 14px. 16px column-gap in the grid. Title and price sit on the Paper White canvas, not in a card surface.

### Product Grid
**Role:** Shop 'What's on: Latest' listing

5-column grid on desktop, uniform product cards, 16px column-gap, 32px row-gap. Section heading 'What's on: Latest' in BaselGrotesk 37–41px Fidèle Blue above the grid, left-aligned with 24px left margin. No card backgrounds behind individual tiles — the grid floats on Paper White.

### Outlined Action Button
**Role:** Primary interactive control

1–2px solid Fidèle Blue border, transparent or Paper White fill, Fidèle Blue text in BaselGrotesk Book 14px, padding 12px 24px, 4px corner radius. No fill state — this system uses outlined actions, not filled ones. Hover: invert (blue fill, white text).

### Photo Strip Section
**Role:** Full-bleed editorial image band

Edge-to-edge row of 4–6 images, each ~16.6% width, no gaps, no rounding, no captions. Functions as a visual divider between content blocks. Sits on Paper White with no card treatment.

### Split Feature Section
**Role:** Two-column image+content block

50/50 split: one side holds a single large element (the giant blue asterisk SVG, or a photograph), the other holds supporting content. No background change between columns, no border — separation is purely spatial. The asterisk itself fills ~60% of its column as a 200–300px solid Fidèle Blue shape.

### Giant Asterisk Mark
**Role:** Brand signature / decorative element

Solid Fidèle Blue SVG of a 6-point asterisk (~200–300px), no stroke, no shadow, no rounding. Functions as a logo, section anchor, and visual punctuation — the system's most identifiable shape. Always rendered on Paper White, never on blue.

### Product Detail Link
**Role:** Title link under a product image

Press Black 14px BaselGrotesk Book, no underline, hovers to Fidèle Blue. Sits flush-left under the image; price uses the same style, flush-right in a separate flex child.

### Language Selector
**Role:** Top-bar utility

Fidèle Blue 14px text 'English' with a small downward chevron icon in Fidèle Blue. No dropdown chrome visible — the control is text-only with the caret as the affordance.

### Icon Button (Search/Cart)
**Role:** Top-bar utility

Fidèle Blue line icon (search lens, cart bag) at 20px, no button background, no border. Tap target extends to ~40px via padding. Icons are stroke-only, 1.5px weight, no fill.

### Footer Rule Line
**Role:** Section divider

1px solid Press Black or 60% Press Black horizontal line spanning the full content width, used to separate the product grid from the photo strip. 32–64px vertical margin on each side.

## Do's and Don'ts

### Do
- Use #f8f7ef as the page canvas on every screen — never substitute #ffffff for the base background.
- Set display type (62px) with line-height 0.92 and letter-spacing -0.049em; characters must nearly touch to feel printed, not rendered.
- Set body and label type (14–16px) with tracking +0.043em to +0.067em — the wide tracking is half the editorial voice.
- Reserve Fidèle Blue (#1664eb) for type, the announcement bar, nav links, the asterisk, and outlined actions — one ink, used with volume.
- Keep all corner radii at 0–4px; the page should read as cut paper, not as rounded UI cards.
- Let the product grid float on Paper White without card backgrounds; the 1px white border around each product image is the only frame.
- Use full-bleed image sections (photo strips, hero) with no rounding, no overlay, no caption — let the photography do the work.

### Don't
- Don't introduce drop shadows, inner shadows, or glow effects — the system is deliberately flat and reads as paper, not glass.
- Don't use any chromatic color other than Fidèle Blue, Lighter Press Blue, and Link Blue — the cream + blue duotone is the entire palette.
- Don't use filled solid-color buttons for primary actions; the system's primary control is the outlined Fidèle Blue action.
- Don't set display type with generous line-height (1.2–1.5) — the crushed 0.92 leading is a signature, not a default.
- Don't round cards, images, or tags beyond 4px; anything rounder breaks the print-stock metaphor.
- Don't add gradients, textures, or noise — surfaces are flat solids, period.
- Don't use #ffffff as a page background; it must remain the warm Paper White #f8f7ef to keep the editorial warmth.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Stock | `#f8f7ef` | The base canvas — every page sits on this warm cream, never white |
| 1 | Card Cream | `#e2e2df` | Product cards, inset panels, and elevated tiles — the only layering step above the canvas |
| 2 | Pure White | `#ffffff` | Image frames and sharp contrast accents on top of the cream layers |
| 3 | Fidèle Blue | `#1664eb` | Brand-color surface for the announcement bar, the giant asterisk, and any section that needs to read as 'inked' |

## Elevation

The system is strictly flat. No drop shadows, no inner glows, no border-based depth tricks. Surface hierarchy is communicated by tonal shifts in the cream palette (Paper White → Card Cream) and by the sudden introduction of Fidèle Blue as an 'inked' layer. Edges are sharp (4px max) so the page reads as paper sheets stacked on a table, not as floating Material cards.

## Imagery

Imagery is documentary-style product and studio photography: hands operating a risograph press, stacked publications on a table, cardboard shipping boxes wrapped in branded tape, a person wearing a printed t-shirt. All photography is natural-light, unposed, slightly grainy, and full-bleed — the camera is in the studio, not in a lifestyle set. Product images (book covers, zines, textiles) are shot straight-on with 1px white borders against the cream canvas. No illustrations, no 3D renders, no abstract graphics — the only graphical mark is the solid blue asterisk. The asterisk itself functions as both logo and section divider, and is the only non-photographic visual element on the site.

## Layout

Full-bleed editorial layout with no max-width container on outer edges. The top stack is: announcement bar (full-bleed blue) → nav bar (Paper White) → optional headline strip → hero image (edge-to-edge). The product grid sits centered with a left-aligned 37–41px blue heading, 5 columns on desktop, tight 16px gaps. Below the grid, a 1px black rule line separates a full-bleed photo strip (4–6 images, no gaps). The final block is a 50/50 split — giant blue asterisk on the left, shipping photo on the right. The page rhythm is: loud brand bar → image → dense product grid → image band → brand mark + photo. Vertical spacing is compact (64px section gaps), and the layout never alternates light/dark — the cream canvas persists underneath everything except the announcement bar.

## Agent Prompt Guide

## Quick Color Reference
- text: #121212
- background: #f8f7ef
- border: #1664eb
- accent: #1664eb (Fidèle Blue — used for type, announcement bar, asterisk)
- card surface: #e2e2df
- primary action: #1664eb (outlined action border)

## 3-5 Example Component Prompts
1. **Announcement bar**: full-bleed solid #1664eb background, white text, 1px white internal border top and bottom. Single line, centered. BaselGrotesk Book 14px, line-height 1.5, letter-spacing +0.88px. Height ~40px.
2. **Product card**: square image with 1px #ffffff border, no rounding, #e2e2df letterbox behind. Below image, on #f8f7ef canvas: product title in #121212 BaselGrotesk Book 14px (tracking +0.6px), price right-aligned in same style. 16px column-gap in a 5-column grid.
3. **Section headline**: 'What's on: Latest' in #1664eb BaselGrotesk 37px, line-height 0.96, letter-spacing -0.74px, left-aligned with 24px left margin, sitting directly on #f8f7ef.
4. **Outlined action button**: 1px solid #1664eb border, #f8f7ef fill, #1664eb text in BaselGrotesk Book 14px (tracking +0.6px), padding 12px 24px, border-radius 4px. Hover state inverts to #1664eb fill with #ffffff text.
5. **Giant brand asterisk**: solid #1664eb 6-point asterisk SVG, ~250px, no stroke, no shadow, centered in a 50% column on the #f8f7ef canvas.

## Similar Brands

- **Apartamento Magazine** — Same editorial-print DNA — warm off-white canvas, large display type in a single brand color, full-bleed documentary photography, zero shadows or rounded corners.
- **Casa Magazines** — Independent publishing storefronts with a single bold accent color stamped across headlines and announcement bars, flat layout, and tight product grids.
- **The Newsprint (concept / newspaper-style Shopify themes)** — Shares the risograph-meets-newspaper sensibility: cream paper stock, one chromatic ink, sharp 4px corners, and type that ranges from crushed display to wide-tracked labels.
- **MoMA Design Store editorial pages** — Full-bleed photography bands, flat cream canvases, and a 5-column product grid with minimal card chrome — though Fidèle is more aggressive with its single blue.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fidle-blue: #1664eb;
  --color-lighter-press-blue: #4f89ec;
  --color-link-blue: #006ce5;
  --color-paper-white: #f8f7ef;
  --color-card-cream: #e2e2df;
  --color-pure-white: #ffffff;
  --color-press-black: #121212;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-baselgrotesk: 'BaselGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-otmagister: 'OTMagister', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-assistant: 'Assistant', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.88px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.69px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: 0.5px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.55px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.65px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -0.64px;
  --text-heading-lg: 37px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -0.74px;
  --text-display: 62px;
  --leading-display: 0.92;
  --tracking-display: -3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-156: 156px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 5px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 4px;
  --radius-images: 0px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-paper-stock: #f8f7ef;
  --surface-card-cream: #e2e2df;
  --surface-pure-white: #ffffff;
  --surface-fidle-blue: #1664eb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fidle-blue: #1664eb;
  --color-lighter-press-blue: #4f89ec;
  --color-link-blue: #006ce5;
  --color-paper-white: #f8f7ef;
  --color-card-cream: #e2e2df;
  --color-pure-white: #ffffff;
  --color-press-black: #121212;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-baselgrotesk: 'BaselGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-otmagister: 'OTMagister', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-assistant: 'Assistant', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.88px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.69px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: 0.5px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.55px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.65px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -0.64px;
  --text-heading-lg: 37px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -0.74px;
  --text-display: 62px;
  --leading-display: 0.92;
  --tracking-display: -3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-156: 156px;

  /* Border Radius */
  --radius-md: 4px;
}
```
