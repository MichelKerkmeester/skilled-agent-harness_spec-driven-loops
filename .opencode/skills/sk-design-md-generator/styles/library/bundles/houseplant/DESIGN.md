# HOUSEPLANT — Style Reference
> walnut bookstore on linen paper

**Theme:** light

Houseplant operates in a warm, earthy monochrome — deep walnut brown on aged cream, with the product photography doing all the chromatic work. The system reads like a vintage housewares catalog: tight custom typography, generous breathing room, no decorative gradients, and almost no accent color. The dark brown #321e1 is both text and surface, flipping between background and foreground depending on context, while the cream #f4f1e1 plays canvas. Components are minimal — solid filled buttons, hairline dividers, soft cards with a single subtle shadow. The signature move is the oversized custom wordmark that anchors the page footer, treating the brand name as a graphic element rather than a logo.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Walnut | `#321e1e` | `--color-walnut` | Primary text color, filled action buttons, dark hero sections, footer wordmark. Deep warm brown that reads as near-black while carrying the brand's earthy warmth — used as both foreground and background surface |
| Linen | `#f4f1e0` | `--color-linen` | Page canvas, card surfaces, light text on dark backgrounds. Warm aged-cream that gives the entire system its paper-like, vintage quality |
| Graphite | `#464545` | `--color-graphite` | Secondary borders, muted helper text, subtle dividers. Neutral medium gray providing quiet separation without competing with the Walnut/Linen pair |
| Espresso | `#463938` | `--color-espresso` | Button text on light surfaces, alternate dark fill. Slightly lighter brown variant for typographic contrast within the dark family |
| Onyx | `#000000` | `--color-onyx` | Icon strokes, true-black accents on borders. Used sparingly where absolute contrast is needed |
| Soft Sand | `#f4f4f4` | `--color-soft-sand` | Alternate light surface, hover-state wash. Neutral off-white for slight tonal shifts away from the cream canvas |

## Tokens — Typography

### Houseplant — Custom display and body typeface used for all UI text — headlines at 30-70px with tight negative tracking, body at 16-20px, captions at 14px. The custom font carries geometric warmth that off-the-shelf alternatives cannot replicate · `--font-houseplant`
- **Substitute:** Archivo, Inter Tight, or DM Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px, 20px, 21px, 28px, 30px, 32px, 45px, 60px, 70px
- **Line height:** 1.00–2.79
- **Letter spacing:** -0.05em at 60-70px, -0.047em at 45px, -0.02em at 14-32px
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** Custom display and body typeface used for all UI text — headlines at 30-70px with tight negative tracking, body at 16-20px, captions at 14px. The custom font carries geometric warmth that off-the-shelf alternatives cannot replicate

### Roboto — Fallback body text — minimal usage, system-safe default · `--font-roboto`
- **Substitute:** system-ui, sans-serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 2.00
- **Role:** Fallback body text — minimal usage, system-safe default

### NeueHelvetica55Roman — NeueHelvetica55Roman — detected in extracted data but not described by AI · `--font-neuehelvetica55roman`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.15, 1.63
- **Role:** NeueHelvetica55Roman — detected in extracted data but not described by AI

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.71 | -0.02px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.02px | `--text-body-sm` |
| body | 18px | 1.44 | -0.02px | `--text-body` |
| subheading | 21px | 1.33 | -0.02px | `--text-subheading` |
| heading-sm | 28px | 1.3 | -0.02px | `--text-heading-sm` |
| heading | 32px | 1.3 | -0.021px | `--text-heading` |
| heading-lg | 45px | 1.15 | -0.047px | `--text-heading-lg` |
| display | 70px | 1 | -0.05px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 2px 8px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.15) 0px 2px 8px 0px` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary Filled Button
**Role:** Main action button — Shop Now, Explore Now, Submit

Solid Walnut (#321e1e) background, Linen (#f4f1e0) text at 16px weight 500, 4px radius, 12px vertical × 30px horizontal padding, uppercase tracking. Shadow rgba(0,0,0,0.15) 0px 2px 8px. Letter-spacing -0.02em for a tight, confident feel

### Outlined / Ghost Button
**Role:** Secondary action on dark backgrounds — Explore Now on dark hero

Transparent background, 1px Linen (#f4f1e0) border, Linen text, 4px radius, 12px vertical × 20-30px horizontal padding. Used when the primary filled button would be lost against a dark surface

### Product Card
**Role:** E-commerce product tile in grid layouts

Linen (#f4f1e0) background, 8px radius, 20px padding, shadow rgba(0,0,0,0.1) 0px 2px 8px. Product image on top half, product name in 16px Walnut, price in 14px, filled Shop Now button below. Card has no border — the shadow does the separation work

### Navigation Bar
**Role:** Top-level site navigation

Solid Walnut (#321e1e) background, full-width, ~60px tall. Brand wordmark centered in Linen with house icon, nav links in 16px Linen uppercase with -0.02em tracking spaced horizontally. Account/cart icons on far right. Underline appears on active/hover state

### Hero Banner
**Role:** Full-bleed promotional section — Italian Collection, New Arrivals

Edge-to-edge image with text overlay, no gradient. Bold display headline (30-45px) in warm color. Diagonal geometric shapes in solid blocks (terracotta, green) frame the composition for a vintage poster aesthetic

### Dark Feature Section
**Role:** Promotional block on Walnut background — Houseplant + Carbone

Full-width Walnut background, two-column layout: product image left, headline + body + ghost button right. Headline at 32-45px Linen weight 500, body at 16-18px Linen. Generous vertical padding (~80-100px) for breathing room

### Section Header
**Role:** Category section title — New & Featured

Left-aligned, 21-28px Walnut weight 500, 8-10px margin-bottom. Uppercase tracking, hairline border or no decoration. Sits flush left at content edge

### Footer Wordmark
**Role:** Brand identity anchor at page bottom

Full-bleed Walnut (#321e1e) text 'HOUSEPLANT' at 60-70px weight 600, -0.05em letter-spacing, filling the viewport width. Functions as both branding and visual closing — the text IS the graphic element, no logo or icon accompanies it

### Footer Link List
**Role:** Site utility links — Contact, FAQ, Privacy, Terms

Stacked text links in 16-18px Walnut on Linen background, no bullet markers, generous line-height (~2.5). Separated by hairline Graphite (#464545) horizontal rules

### Social Icon Link
**Role:** Footer social media icons — Instagram, Twitter, Facebook

Walnut line icons, ~24px, no fill, 1.5px stroke weight. Spaced 20-30px apart in a horizontal row. Minimal — icons are recognizable at small sizes without color coding

### Price Label
**Role:** Product pricing display under product name

14-16px Walnut weight 400, $XX.XX format, left-aligned. No sale/strike-through treatment detected — pricing stays simple

### Product Image Container
**Role:** Image holder within product card

Full card-width image, no border or radius at top (inherits card's 8px radius only at corners), object-fit cover. Photography is warm-lit, lifestyle-context, often on wood or marble surfaces

## Do's and Don'ts

### Do
- Use #321e1 as the single primary action color — solid fill for buttons, no gradients, no hover color shifts
- Set page canvas to #f4f1e0 (Linen) — never pure white. The warm cream is the system's identity
- Apply -0.05em letter-spacing at 45px+ and -0.02em at body sizes. Tracking is non-negotiable for the custom typeface's character
- Use 4px radius for all buttons and 8px for all cards. Do not introduce larger radii — the system stays sharp
- Let product photography supply all chromatic color. The UI stays monochromatic brown/cream; images bring terracotta, green, and warm wood tones
- Maintain generous vertical rhythm: 80-120px between major sections, 20px between elements, 20px card padding
- Anchor every page with the oversized footer wordmark at 60-70px — the brand name as graphic closure

### Don't
- Never use pure white (#FFFFFF) for backgrounds — Linen #f4f1e0 is the canonical canvas
- Do not introduce accent colors (blue, green, red) for buttons or interactive states — the brown/cream system is intentionally narrow
- Do not use sans-serif system fonts for headlines — the custom Houseplant typeface at 30px+ is the brand's signature
- Avoid drop shadows beyond the single rgba(0,0,0,0.1) 0px 2px 8px on cards. No glow effects, no colored shadows
- Do not center body text or product descriptions — left-align everything except the nav wordmark and hero headlines
- Never use border-radius above 8px. Pills, circles, and large rounded shapes break the vintage-catalog geometry
- Do not add gradients, glassmorphism, or decorative overlays. The system is flat surfaces, hairline rules, and soft shadows only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f4f1e0` | Primary page background — aged cream paper feel |
| 2 | Card | `#f4f4f4` | Product card surface, slight tonal lift from canvas |
| 3 | Dark Feature | `#321e1` | Promotional sections, filled button backgrounds |
| 4 | Footer Mark | `#321e1` | Full-bleed footer wordmark surface |

## Elevation

- **Product Card:** `rgba(0, 0, 0, 0.1) 0px 2px 8px 0px`
- **Primary Button:** `rgba(0, 0, 0, 0.15) 0px 2px 8px 0px`

## Imagery

Warm, editorial product photography on natural surfaces — wood tables, marble countertops, terracotta tiles. Lifestyle-adjacent but product-focused, with Italian tableware, pasta, and home goods shot in natural light. Full-bleed hero images with no gradient overlays. Color palette within photography: terracotta, olive green, deep blue ceramic patterns, warm wood grain. Icons are line-style, 1.5px stroke, monochrome Walnut.

## Layout

Full-width sections stacked vertically. Navigation is a fixed top bar on Walnut, full viewport width. Hero is a full-bleed image with overlaid graphic blocks (terracotta and green geometric shapes) for a vintage poster effect. Product grid below uses 5 equal columns with ~20px gap. Dark feature sections use two-column split (image left, text right) at full viewport width. Footer is utility links above a full-bleed oversized wordmark that fills the viewport width. Max content width ~1200px for grids and text blocks, but hero/footer extend edge-to-edge.

## Agent Prompt Guide

Quick Color Reference:
- text: #321e1e (Walnut)
- background: #f4f1e0 (Linen)
- border: #464545 (Graphite)
- accent: none — system is monochromatic
- primary action: #321e1e (filled action)

Example Component Prompts:

1. Create a product card: Linen (#f4f1e0) background, 8px radius, 20px padding, shadow rgba(0,0,0,0.1) 0px 2px 8px. Product image fills top half. Below: product name at 16px Houseplant weight 500 in Walnut, price at 14px weight 400. Filled Shop Now button: #321e1e background, #f4f1e0 text, 4px radius, 12px×30px padding, weight 500.

2. Create a navigation bar: Full-width #321e1e background, 60px height. Brand wordmark centered at 18px Houseplant weight 600 in #f4f1e0. Nav links (SHOP ALL, NEW ARRIVALS, ITALIAN COLLECTION, SCENT, COLLABORATIONS, EXPLORE) in 14px uppercase #f4f1e0 with -0.02em tracking, spaced horizontally.

3. Create a dark feature section: Full-width #321e1e background, two-column 50/50 split. Left: product image with no border. Right: headline at 32px Houseplant weight 500 in #f4f1e0, body text at 16px weight 400 in #f4f1e0, ghost button with 1px #f4f1e0 border, #f4f1e0 text, 4px radius.

4. Create a section header: Left-aligned 'NEW & FEATURED' at 21px Houseplant weight 500 in #321e1e, uppercase, -0.02em letter-spacing, 8px margin-bottom. No decoration, no border.

5. Create a footer wordmark: Full-width #321e1e block, 'HOUSEPLANT' text filling the viewport at 60-70px Houseplant weight 600, -0.05em letter-spacing, #321e1e color, line-height 1.0. Functions as the page's visual closing element.

## Similar Brands

- **Soho House** — Same warm-cream-and-walnut palette, editorial product photography, custom serif-adjacent display type, and full-bleed dark hero sections
- **Aesop** — Monochromatic earthy palette, warm off-white canvas, no accent colors, product photography carrying all the warmth, tight custom typography
- **Toast** — Vintage-catalog aesthetic, warm cream backgrounds, dark brown text, editorial food and home product photography, restrained UI chrome
- **Goop** — Dark brown feature sections against cream, editorial product grid, oversized brand wordmark as footer element, warm lifestyle photography
- **Food52** — Warm earth-tone palette, product-forward grid layouts, lifestyle food and home photography, comfortable spacing rhythm

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-walnut: #321e1e;
  --color-linen: #f4f1e0;
  --color-graphite: #464545;
  --color-espresso: #463938;
  --color-onyx: #000000;
  --color-soft-sand: #f4f4f4;

  /* Typography — Font Families */
  --font-houseplant: 'Houseplant', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehelvetica55roman: 'NeueHelvetica55Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.71;
  --tracking-caption: -0.02px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.02px;
  --text-body: 18px;
  --leading-body: 1.44;
  --tracking-body: -0.02px;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.02px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.021px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.047px;
  --text-display: 70px;
  --leading-display: 1;
  --tracking-display: -0.05px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.15) 0px 2px 8px 0px;

  /* Surfaces */
  --surface-canvas: #f4f1e0;
  --surface-card: #f4f4f4;
  --surface-dark-feature: #321e1;
  --surface-footer-mark: #321e1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-walnut: #321e1e;
  --color-linen: #f4f1e0;
  --color-graphite: #464545;
  --color-espresso: #463938;
  --color-onyx: #000000;
  --color-soft-sand: #f4f4f4;

  /* Typography */
  --font-houseplant: 'Houseplant', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehelvetica55roman: 'NeueHelvetica55Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.71;
  --tracking-caption: -0.02px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.02px;
  --text-body: 18px;
  --leading-body: 1.44;
  --tracking-body: -0.02px;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.02px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.021px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.047px;
  --text-display: 70px;
  --leading-display: 1;
  --tracking-display: -0.05px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.15) 0px 2px 8px 0px;
}
```
