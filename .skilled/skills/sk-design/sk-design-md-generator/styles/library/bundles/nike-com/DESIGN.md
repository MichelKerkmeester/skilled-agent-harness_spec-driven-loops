# Nike.com — Style Reference
> monochrome gallery of athletic performance — white walls, product as art, chrome dissolved into the background.

**Theme:** mixed

Nike.com operates as a product-first monochrome gallery: the UI stays nearly invisible so product photography can carry every screen. The entire interface is built from black, white, and three tints of gray — no accent color, no decorative gradient, no warm brand chrome. The Nike identity lives in the swoosh and the photography, never in the UI itself. Typography is compact and utilitarian, leaning on a custom Helvetica Now family at 12-20px with one oversized Nike Futura ND moment at 76px for hero headlines. Components are minimal: pill-shaped buttons at 30px radius, flat product cards, hairline borders, and almost zero elevation. The page alternates between pure white product surfaces and dramatic full-bleed dark editorial hero sections, creating rhythm through contrast rather than ornament.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#111111` | `--color-obsidian` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surface, button text on dark fills, icon strokes — the default canvas for product grids and category sections |
| Concrete Gray | `#e5e5e5` | `--color-concrete-gray` | Borders, dividers, hairline separators between grid sections, subtle input outlines |
| Soft Mist | `#f5f5f5` | `--color-soft-mist` | Subtle background tint for secondary surfaces, nav search field fill, tag backgrounds |
| Steel | `#707072` | `--color-steel` | Secondary text, muted helper copy, icon outlines at smaller sizes, breadcrumb labels, footer link separators |
| Faint Gray | `#9e9ea0` | `--color-faint-gray` | Disabled icon strokes, tertiary UI affordances, lowest-emphasis borders |

## Tokens — Typography

### Helvetica Now Text Medium — Helvetica Now Text Medium — detected in extracted data but not described by AI · `--font-helvetica-now-text-medium`
- **Weights:** 500
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.5, 1.75, 1.86
- **Role:** Helvetica Now Text Medium — detected in extracted data but not described by AI

### Helvetica Now Text — Primary UI body and interface text — nav links, button labels, card titles, product names, footer lists, all running copy · `--font-helvetica-now-text`
- **Substitute:** Inter or Helvetica Neue
- **Weights:** 400, 500
- **Sizes:** 16px, 20px
- **Line height:** 1.50, 1.75, 1.86
- **Letter spacing:** normal
- **Role:** Primary UI body and interface text — nav links, button labels, card titles, product names, footer lists, all running copy

### Helvetica Now Display Medium — Section headings, card category labels, medium-scale titles — medium weight at 20-24px is the signature of Nike's non-hero headings: never bold, always composed · `--font-helvetica-now-display-medium`
- **Substitute:** Inter Medium or Helvetica Neue Medium
- **Weights:** 500
- **Sizes:** 20px, 24px
- **Line height:** 1.20, 1.50
- **Role:** Section headings, card category labels, medium-scale titles — medium weight at 20-24px is the signature of Nike's non-hero headings: never bold, always composed

### Nike Futura ND — Hero-scale editorial headlines — used at full display size with line-height locked to 1.0 for maximum impact; the one moment where Nike uses a custom display face instead of Helvetica Now · `--font-nike-futura-nd`
- **Substitute:** Futura PT Medium
- **Weights:** 500
- **Sizes:** 76px
- **Line height:** 1.00
- **Role:** Hero-scale editorial headlines — used at full display size with line-height locked to 1.0 for maximum impact; the one moment where Nike uses a custom display face instead of Helvetica Now

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400, 700
- **Sizes:** 16px
- **Line height:** 1.75
- **Role:** Arial — detected in extracted data but not described by AI

### Helvetica Neue — Helvetica Neue — detected in extracted data but not described by AI · `--font-helvetica-neue`
- **Weights:** 400, 500
- **Sizes:** 16px
- **Line height:** 1
- **Role:** Helvetica Neue — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.75 | — | `--text-body-sm` |
| body | 16px | 1.75 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| display | 76px | 1 | — | `--text-display` |

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
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 24px |
| tags | 30px |
| cards | 0px |
| inputs | 0px |
| buttons | 30px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Pill Button (Primary)
**Role:** The only interactive button style — used for Comprar, Comprar todo, and all call-to-action moments

Obsidian (#111111) fill, white text, Helvetica Now Text Medium 16px/1.5, 30px border-radius (full pill), 6px vertical / 8px horizontal padding. No border, no shadow, no hover state decoration beyond opacity.

### Category Hero Card
**Role:** Full-bleed product photography tiles in the 2x2 grid below the hero

Container has no border, no radius, no shadow. Product photography fills edge-to-edge. Overlaid text sits bottom-left in white: small Helvetica Now Text 16px category label above a 20-24px Helvetica Now Display Medium headline. Pill buttons (white background, black text variant) sit below the headline.

### Product Card
**Role:** Individual product tiles in the 3-column scrolling grid

White background, no border, no radius, no shadow. Product image centered in the upper portion. Product name label appears as a small white pill (Obsidian fill, white text, 30px radius, Helvetica Now Text Medium 12-16px) overlaid on or below the image. No price, no description, no CTAs inside the card.

### Top Navigation Bar
**Role:** Site-wide header with category access, search, and account actions

Two-tier layout: a thin top utility bar (search, help, login) in Helvetica Now Text 12px Obsidian on white, then the main nav row with Nike swoosh left, category links (Novedad, Hombre, Mujer, Niño/a, Deporte, NikeSKiMS) center in Helvetica Now Text Medium 16px, then search field + wishlist heart + bag icon right. The search field is #f5f5f5 with 24px radius. No background fill on the nav itself — sits directly on white.

### Editorial Hero Section
**Role:** Full-viewport dark hero with single product and oversized headline

Full-bleed near-black or dark gradient background. Product photographed large and centered or three-quarter. Headline in Nike Futura ND 76px white, line-height 1.0, positioned bottom-left. Sub-copy in Helvetica Now Text 16px white below. Single white pill button (white fill, black text) as the only CTA. No decorative elements, no carousel indicators visible.

### Footer Link Grid
**Role:** Multi-column resource and help links at the bottom of the page

White background. Four columns: Recursos, Ayuda, Empresa, Descuentos de la comunidad. Column headers in Helvetica Now Display Medium 16-20px Obsidian bold. Links in Helvetica Now Text 16px Steel (#707072) with 12px row-gap. Region selector (España) right-aligned in the header row. No dividers, no background fills.

### Search Field
**Role:** Inline search input in the main nav

#f5f5f5 background, 24px border-radius, no border, Helvetica Now Text 16px Obsidian placeholder text. Search icon in Steel (#707072) left-aligned. Compact 6px vertical / 8px horizontal padding.

### Icon System
**Role:** Utility icons for wishlist, bag, search, and account

Stroke-based outlined icons, 1.5-2px stroke weight, Obsidian (#111111) at default state, Steel (#707072) for secondary actions. No filled variants, no multicolor icons. 16-20px size range.

## Do's and Don'ts

### Do
- Use only the monochrome palette: Obsidian (#111111), Paper White (#ffffff), Concrete Gray (#e5e5e5), Soft Mist (#f5f5f5), and Steel (#707072). No accent colors in the UI — the product photography provides all chromatic interest.
- Set all interactive buttons to 30px border-radius for the pill shape; this is the only button geometry in the system.
- Use Helvetica Now Text Medium 16px as the default for nav links, button labels, and product names; never set body text above 20px or below 12px.
- Let product photography fill containers edge-to-edge with zero border-radius and zero border — the imagery is the design, not a framed element.
- Use Nike Futura ND 76px exclusively for hero headlines with line-height locked to 1.0; smaller headings stay in Helvetica Now Display Medium 20-24px.
- Separate surface layers with Concrete Gray (#e5e5e5) hairline borders or whitespace — never with shadows or colored backgrounds.
- Keep the nav transparent on white: no background fill, no shadow, no sticky blur effect.

### Don't
- Do not introduce any accent or brand color into the UI — no blue, red, green, or yellow fills on buttons, links, badges, or icons. The only color in the interface comes from product photography.
- Do not use bold or semibold weights; Nike's type system is exclusively 400 and 500. Heavier weights break the composed, restrained voice.
- Do not add box-shadows to cards, buttons, or nav elements. Elevation in this system is communicated by the dark/light section alternation, not by shadows.
- Do not round card corners. Product and category cards sit as sharp-edged full-bleed tiles — the only rounded elements are buttons (30px), the search field (24px), and the top utility bar (24px).
- Do not use more than one CTA color treatment per page. The pill button is always Obsidian on white or white on Obsidian — never a third variant.
- Do not add decorative gradients, patterns, or background imagery behind text. Every section is either pure white or full-bleed product photo.
- Do not use display typography below 20px or above 76px. Nike Futura ND lives at hero scale only; Helvetica Now Display handles everything in between.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Default page background for product grids, category sections, and footer |
| 2 | Soft Mist | `#f5f5f5` | Search field fill, subtle section background tint, tag pill backgrounds |
| 3 | Concrete Gray | `#e5e5e5` | Borders, dividers, separator lines between grid sections |

## Elevation

Nike's design system deliberately avoids box-shadows entirely. Elevation is communicated through three mechanisms only: (1) the stark alternation between full-bleed dark editorial hero sections and white product grids, (2) hairline Concrete Gray (#e5e5e5) borders between sections, and (3) generous whitespace. The flat aesthetic keeps focus on the product photography and reinforces the 'gallery' metaphor — nothing in the UI casts a shadow on the product.

## Imagery

Photography is the dominant visual element and carries the entire brand identity. The system uses high-resolution, full-bleed product shots: athletic shoes photographed in isolation against dark or gradient backgrounds, cropped tight enough to fill the frame with no lifestyle context. Lifestyle imagery appears in category tiles showing athletes' feet and lower legs in motion. Treatment is high-contrast and color-saturated — red shoes on black, neon accents on white soles, warm and cool lighting to dramatize materials. No illustration, no abstract graphics, no 3D renders. Images are always sharp-edged (no rounded corners on photo containers), always full-bleed within their tiles, and always paired with minimal text overlay. Iconography is purely functional: outlined stroke icons for search, wishlist, bag, and account in Obsidian or Steel.

## Layout

The page follows a full-bleed editorial rhythm: a dramatic dark viewport-height hero with a single product and oversized headline, followed by a 2x2 grid of full-bleed category tiles, then a horizontally-scrolling 3-column product card grid, then a dense multi-column footer. All content blocks span the full viewport width with no max-width container; the 1440px max-width applies to the nav and footer link grid only. Section transitions are stark: black hero → white category grid → white product grid → white footer, with Concrete Gray hairline borders as the only visual seam. The nav is a two-tier minimal bar (utility links top, main categories center) with no sticky behavior, no background fill, and no shadow. Content density is compact in the product grids (tight card padding) and spacious in the hero (full viewport).

## Agent Prompt Guide

**Quick Color Reference**
- text: #111111 (Obsidian)
- background: #ffffff (Paper White)
- border: #e5e5e5 (Concrete Gray)
- accent: none — no UI accent color; all color comes from product photography
- secondary text: #707072 (Steel)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a full-bleed dark hero: near-black (#111111) background filling the viewport. Centered product photography of a red running shoe, three-quarter angle, occupying 60% of the width. Bottom-left text overlay: Nike Futura ND weight 500 at 76px, white, line-height 1.0, letter-spacing normal, text 'POTENCIA TOTAL'. Below it a Helvetica Now Text 16px white subhead, then a pill button (white fill, Obsidian text, 30px radius, 6px vertical / 8px horizontal padding).

2. Create a 2x2 category card grid below the hero: four full-bleed tiles, no gap between tiles, no border-radius, no border. Each tile fills 50% of the viewport width and 50vh. Overlaid bottom-left on each tile: Helvetica Now Text 16px white category label above a Helvetica Now Display Medium 20px white headline. Two pill buttons (white fill, Obsidian text, 30px radius) sit stacked below the headline.

3. Create a 3-column scrolling product card row: white background, three cards in a row, each card 33% width, no border, no radius, no shadow. Product image centered in the card, white background. Small pill label at the bottom of each image: Obsidian fill, white text, Helvetica Now Text Medium 12px, 30px radius, 6px padding. No price, no description inside the card.

4. Create a top navigation bar: white background, no fill, no shadow, no border. Left: Nike swoosh SVG in Obsidian. Center: six nav links in Helvetica Now Text Medium 16px Obsidian with 24px gap. Right: Soft Mist (#f5f5f5) search field with 24px radius, 6px vertical / 8px horizontal padding, Helvetica Now Text 16px Obsidian placeholder, search icon in Steel (#707072), then wishlist heart icon and bag icon in Obsidian.

5. Create a footer link grid: white background, four equal columns. Column headers in Helvetica Now Display Medium 16-20px Obsidian. Links in Helvetica Now Text 16px Steel (#707072) with 12px row-gap. Region selector 'España' right-aligned in the header row. No dividers, no background fills, no social icons.

## Similar Brands

- **Apple** — Both sites use a monochrome UI palette (black/white/gray only) with zero accent color, letting full-bleed product photography carry all chromatic and emotional weight
- **Allbirds** — Same flat card aesthetic with sharp-edged full-bleed product photography and minimal chrome — product is the hero, UI stays invisible
- **Adidas** — Identical editorial structure: dark full-bleed hero with oversized headline, followed by 2x2 category tile grid, then 3-column product card row with pill labels
- **SSENSE** — Same high-contrast editorial e-commerce approach with generous whitespace, minimal navigation, and product imagery treated as art on a white gallery wall

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #111111;
  --color-paper-white: #ffffff;
  --color-concrete-gray: #e5e5e5;
  --color-soft-mist: #f5f5f5;
  --color-steel: #707072;
  --color-faint-gray: #9e9ea0;

  /* Typography — Font Families */
  --font-helvetica-now-text-medium: 'Helvetica Now Text Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-now-text: 'Helvetica Now Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-now-display-medium: 'Helvetica Now Display Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nike-futura-nd: 'Nike Futura ND', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.75;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-display: 76px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;

  /* Named Radii */
  --radius-nav: 24px;
  --radius-tags: 30px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 30px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-soft-mist: #f5f5f5;
  --surface-concrete-gray: #e5e5e5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #111111;
  --color-paper-white: #ffffff;
  --color-concrete-gray: #e5e5e5;
  --color-soft-mist: #f5f5f5;
  --color-steel: #707072;
  --color-faint-gray: #9e9ea0;

  /* Typography */
  --font-helvetica-now-text-medium: 'Helvetica Now Text Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-now-text: 'Helvetica Now Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-now-display-medium: 'Helvetica Now Display Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nike-futura-nd: 'Nike Futura ND', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.75;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-display: 76px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
}
```
