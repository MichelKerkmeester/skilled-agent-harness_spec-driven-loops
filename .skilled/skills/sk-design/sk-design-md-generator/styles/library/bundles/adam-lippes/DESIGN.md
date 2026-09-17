# Adam Lippes — Style Reference
> Monochrome editorial atelier on cream paper — a Vogue spread where the layout grid, not the color palette, is the only decoration.

**Theme:** light

Adam Lippes is a monochrome editorial atelier built on cream paper (#fefcf8) with Optima typography and full-bleed fashion photography. The interface is deliberately restrained: zero chromatic accents, zero decorative gradients, near-zero corner radii — the photographic plate IS the design. Product imagery carries all visual weight inside a dense five-column grid; UI chrome recedes behind hairline rules and uppercase tracked nav. Buttons are stark black fills or ghost outlines against the warm canvas, and the only tonal shifts between pages come from the photography itself, never from UI chroma.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Canvas | `#fefcf8` | `--color-bone-canvas` | Primary page background — warm off-white, the entire site sits on this paper-like canvas rather than pure white |
| Press White | `#ffffff` | `--color-press-white` | Alternate surface for product cards, input fields, and crisp overlays that need to separate from Bone Canvas |
| Onyx Black | `#000000` | `--color-onyx-black` | Primary text, hairline rules, filled action buttons, icon strokes, and nav borders. The structural ink of the system |
| Graphite | `#403f3e` | `--color-graphite` | Secondary text and icon color — a softened black for less critical copy and outline button borders |
| Carbon | `#121212` | `--color-carbon` | Deep alt-black for button borders, dark badges, and high-contrast text on white surfaces where pure black feels too harsh |
| Iron | `#1d1d1d` | `--color-iron` | Button border accent — a near-black used for refined button outlines |
| Slate | `#2f2f2f` | `--color-slate` | Badge and secondary text — sits between Graphite and Carbon for mid-emphasis labels |
| Stone | `#4c4c4a` | `--color-stone` | Body text secondary and subtle borders — warm-leaning gray that pairs with the cream canvas without going cold |
| Ash | `#b2b0ae` | `--color-ash` | Light neutral action fill for buttons on dark surfaces. |

## Tokens — Typography

### Optima — Primary typeface across all UI — nav, buttons, body, headings. Optima's humanist flares and geometric curves carry the brand's editorial luxury; its narrow proportions let dense 5-column product grids breathe without feeling cramped. Nav and button text is uppercase at 11–12px with wide tracking (0.0640em); body sits at 14px, larger body/links at 16px, subheadings at 24px. · `--font-optima`
- **Substitute:** Avenir Next, Futura PT, or ITC Avant Garde Gothic
- **Weights:** 400
- **Sizes:** 10, 11, 12, 13, 14, 16, 24px
- **Line height:** 1.20–1.50 depending on size
- **Letter spacing:** 0.0310em at body sizes, 0.0640em on uppercase nav and button labels
- **Role:** Primary typeface across all UI — nav, buttons, body, headings. Optima's humanist flares and geometric curves carry the brand's editorial luxury; its narrow proportions let dense 5-column product grids breathe without feeling cramped. Nav and button text is uppercase at 11–12px with wide tracking (0.0640em); body sits at 14px, larger body/links at 16px, subheadings at 24px.

### Arial — System fallback used sparingly for button and icon labels when Optima is unavailable — do not introduce as a primary face. · `--font-arial`
- **Substitute:** Helvetica, Inter
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** System fallback used sparingly for button and icon labels when Optima is unavailable — do not introduce as a primary face.

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 0.31px | `--text-caption` |
| body | 14px | 1.4 | 0.43px | `--text-body` |
| heading | 24px | 1.2 | 0.74px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| pills | 1000px |
| badges | 40px |
| buttons | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.05) 0px 4px 5px 0px` | `--shadow-sm` |
| lg | `rgba(0, 0, 0, 0.15) 0px -8px 24px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Site-wide navigation with centered wordmark

Full-width, white background, 1px Onyx Black hairline bottom border, subtle rgba(0,0,0,0.05) 0 4px 5px shadow. Left side: 5 uppercase nav links in Optima 11px, weight 400, letter-spacing 0.0640em, color Onyx Black. Center: ADAM LIPPES wordmark in Optima, uppercase, tracking 0.0640em, 2-line stacked. Right: SEARCH label, account icon, cart icon with circular count badge. Total height ~60px, z-index fixed.

### Filled Action Button — Onyx
**Role:** Primary CTA (Shop Now, View All)

Solid Onyx Black (#000000) background, Press White (#ffffff) text, Optima 12px uppercase, letter-spacing 0.0640em, weight 400. Padding 12px 20px. Radius 0px (sharp corners — editorial). No shadow. Hover: invert to white bg / black border / black text.

### Ghost Button
**Role:** Secondary or low-emphasis action

Transparent or Bone Canvas background, 1px Onyx Black border, Onyx Black text, Optima 12px uppercase, letter-spacing 0.0640em. Same padding and sharp corners as filled variant.

### Hero Overlay Text Block
**Role:** Headline + subtext + CTA on full-bleed editorial imagery

Sits in the left third of a full-bleed image. Heading in Optima 24px, weight 400, Onyx Black, letter-spacing ~0.74px. Subtext in Optima 14px, Stone (#4c4c4a). CTA is a filled Onyx button. Left-aligned, vertically centered to the model or composition.

### Product Card
**Role:** Individual SKU in the 5-column product grid

White or transparent background, no border, 0px radius. Product image on white seamless background, no frame. Below image: product name (e.g. 'anais top') in Optima 14px Onyx Black lowercase, price right-aligned ('€1.470,95') in Optima 14px. Below: small horizontal color swatches (8×8px squares with 1px Onyx Black border, 5px gap). Optional hairline underline indicator for promotional items. Card padding 16px. No hover lift — only subtle image zoom or text underline.

### Category Banner Card
**Role:** Editorial section promo (Spring Knitwear, Seasonal Dresses)

Two-column layout, each card full-bleed cropped model photo, text overlay in left third. Heading in Optima 24px Onyx Black. Subtext in Optima 14px Stone. CTA is filled Onyx button. No card border or background — the photo is the card.

### Circular Carousel Arrow
**Role:** Pagination control on product grid

24×24px circle, Stone (#b2b0ae) fill, small black arrow icon centered. No border, no shadow. Sits at the vertical midpoint of the product row.

### Cart Count Badge
**Role:** Numeric indicator on the cart icon in nav

Small circular badge, Onyx Black background, white numeral inside, ~16px diameter. Top-right corner of the cart icon.

### Color Swatch
**Role:** Product variant color indicator

8×8px square, no radius, 1px Onyx Black border. Sits in a horizontal row under the product card with 5px gaps. Active swatch gets a slightly heavier border or filled interior.

### Email Signup Bar
**Role:** Footer promotional strip

Full-width, Bone Canvas background, 1px Onyx Black hairline top border. Single line: 'Sign up for emails and save 10% on your first purchase' in Optima 12–14px Onyx Black left-aligned, with a + icon (expand) on the far right. Padding 16px vertical.

### Text Link
**Role:** Inline navigation or action link

Optima 16px Onyx Black, no underline by default, underline on hover. Lowercase. Used for product names, footer links.

### Promo Hairline Rule
**Role:** Section divider and emphasis marker

1px Onyx Black horizontal line, used to separate product cards, section headers, and the nav. The system's primary structural divider — replaces cards and boxes.

## Do's and Don'ts

### Do
- Use Onyx Black (#000000) as the only fill for primary action buttons; pair with Press White text and 12px Optima uppercase at 0.0640em tracking.
- Set page background to Bone Canvas (#fefcf8), never pure white — the warm off-white is the system's identity.
- Use 0px corner radius on all product cards, buttons, and section dividers; the only rounded elements are badges (40px) and the legacy pill button (1000px).
- Render nav and button labels in uppercase Optima at 11–12px with letter-spacing 0.0640em; this tracking is what makes the interface read as editorial rather than utilitarian.
- Use 1px Onyx Black hairlines as the primary structural divider in place of cards or boxes.
- Maintain a 5-column product grid with 10px element gap and 16px card padding; keep product names lowercase in Optima 14px.
- Keep all UI chrome flat and monochrome; let photography provide every color and visual interest.

### Don't
- Do not introduce any chromatic color, gradient, or accent hue — the system is intentionally 0% colorful.
- Do not use rounded corners on product cards, category banners, or section dividers — sharp edges are non-negotiable.
- Do not add drop shadows to product cards, buttons, or images; shadows are reserved for the nav and one promo card.
- Do not use a sans-serif replacement font for body or nav; Optima (or Avenir Next as substitute) is the brand voice.
- Do not break the cream-on-black inversion; dark sections must be full-bleed photography, never solid color blocks.
- Do not use color, weight, or size alone to indicate state; pair with an underline, border, or tracking change.
- Do not use emoji, icons with color, or decorative illustrations — the only iconography is monochrome line glyphs (account, cart, search, arrows).

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#fefcf8` | Primary page background — the entire site rests on this warm off-white. |
| 1 | Press White | `#ffffff` | Product card backgrounds, input fields, and overlays that need a slightly brighter separation from the canvas. |

## Elevation

- **Top navigation bar:** `rgba(0, 0, 0, 0.05) 0px 4px 5px 0px`
- **Promo card:** `rgba(0, 0, 0, 0.15) 0px -8px 24px 0px`

## Imagery

Editorial fashion photography dominates every screen. Hero and category banners use full-bleed models photographed against concrete, plaster, or warm neutral architectural backdrops — high-key lighting, editorial crop, tight framing on garments. Product grid images are clean white-seamless studio shots with no model, no shadow, no props — the object alone on a white field. All photography is desaturated toward warm gray, matching the cream canvas. Iconography is minimal: monochrome line icons for account, cart, search, and carousel arrows, no color fills.

## Layout

Full-bleed editorial layout with no fixed background containers. Navigation is a single fixed white bar at the top with a hairline bottom border. The hero is a full-viewport split: large model photograph right, text overlay block left over a separate concrete-textured panel. Below, a 5-column product grid spans the full page width with no gutters between cards — just hairline rules and product metadata. Two-column category banners follow (Spring Knitwear, Seasonal Dresses) at full width, each a single photo with left-aligned text overlay. The footer is a single full-width hairline-bordered strip with the email signup. Content max-width is ~1440px but hero, category banners, and product grid are all edge-to-edge. Vertical rhythm is compact: 48px between major sections, 10px between metadata rows, no dramatic whitespace.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Onyx Black)
- background: #fefcf8 (Bone Canvas)
- surface: #ffffff (Press White)
- border: #000000 (Onyx Black, 1px hairline)
- accent: none (no chromatic accent in the system)
- primary action: #000000 (filled action)

**Example Component Prompts**
1. *Create a product card*: white seamless background image at full card width, no border, 0px radius. Below: product name in Optima 14px lowercase #000000 left-aligned, price in Optima 14px #000000 right-aligned, 10px row gap. Underneath: row of 8×8px color swatches with 1px #000000 border, 5px gap. Total card padding 16px. No shadow, no hover lift.
2. *Create a filled action button*: #000000 background, #ffffff text, Optima 12px uppercase, letter-spacing 0.0640em, weight 400. Padding 12px 20px. Radius 0px. No shadow.
3. *Create a hero overlay block*: left third of a full-bleed editorial image. Heading in Optima 24px #000000 letter-spacing 0.74px. Subtext in Optima 14px #4c4c4a. Filled #000000 button with white uppercase text, 0px radius, 12px 20px padding. Vertically centered.
4. *Create a category banner card*: full-bleed cropped model photo, no border or background. Text overlay in left third: heading Optima 24px #000000, subtext Optima 14px #4c4c4a, filled #000000 button below. Text vertically centered.
5. *Create a top nav bar*: full width, #ffffff background, 1px #000000 bottom border, subtle rgba(0,0,0,0.05) 0 4px 5px shadow. Left: 5 uppercase Optima 11px nav links at 0.0640em tracking, #000000. Center: stacked 'ADAM' / 'LIPPES' wordmark in Optima uppercase. Right: 'SEARCH' label, account icon, cart icon with small #000000 circular count badge.

## Photography Direction

Photography is a design token. Hero and category imagery is shot against concrete, plaster, and warm architectural surfaces with high-key directional lighting. Models are framed tight to the garment — often waist-up — with neutral expressions. Product-only images use a white seamless background with no props, no shadow, and a straight-on or three-quarter view. The overall photographic palette desaturates toward warm gray, so it harmonizes with Bone Canvas (#fefcf8) and never introduces competing chroma. Any page built with this system must commission or select photography in this register; the layout cannot save the system from off-brand imagery.

## Similar Brands

- **The Row** — Same monochrome editorial restraint — cream canvas, uppercase tracked nav, product photography as the only color, sharp-cornered product cards.
- **Khaite** — Same luxury-fashion 5-column product grid, dense hairline dividers, and stark black CTA buttons on warm off-white backgrounds.
- **Toteme** — Same quiet-luxury approach: minimal nav chrome, serif-adjacent display typography, full-bleed editorial imagery with monochrome product grids.
- **Jil Sander** — Same minimalist fashion house identity — uppercase tracked wordmark, product-first layout, zero decorative UI elements, photography carries the brand.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-canvas: #fefcf8;
  --color-press-white: #ffffff;
  --color-onyx-black: #000000;
  --color-graphite: #403f3e;
  --color-carbon: #121212;
  --color-iron: #1d1d1d;
  --color-slate: #2f2f2f;
  --color-stone: #4c4c4a;
  --color-ash: #b2b0ae;

  /* Typography — Font Families */
  --font-optima: 'Optima', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.31px;
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: 0.43px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: 0.74px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-pills: 1000px;
  --radius-badges: 40px;
  --radius-buttons: 0px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 4px 5px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px -8px 24px 0px;

  /* Surfaces */
  --surface-bone-canvas: #fefcf8;
  --surface-press-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-canvas: #fefcf8;
  --color-press-white: #ffffff;
  --color-onyx-black: #000000;
  --color-graphite: #403f3e;
  --color-carbon: #121212;
  --color-iron: #1d1d1d;
  --color-slate: #2f2f2f;
  --color-stone: #4c4c4a;
  --color-ash: #b2b0ae;

  /* Typography */
  --font-optima: 'Optima', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.31px;
  --text-body: 14px;
  --leading-body: 1.4;
  --tracking-body: 0.43px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: 0.74px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 1000px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 4px 5px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px -8px 24px 0px;
}
```
