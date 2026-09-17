# Afterglo — Style Reference
> Editorial boudoir printed on cream paper — quiet, tactile, typographic.

**Theme:** light

Afterglo is an editorial intimacy shop: warm cream canvas, sensual product photography, and typographic drama built from one neo-grotesque (Aeonik) and one high-contrast display serif (Cardinal Fruit). The palette is near-monochrome with paper-warm neutrals (ivory, sage gray, ink black) punctuated by a single warm coral accent in the footer and a dusty powder blue for badges — color is rationed, never decorative. Surfaces stay flat and matte with hairline 5px radii; the depth comes from oversized type and image crops, not shadows. The rhythm alternates between full-bleed photographic hero panels and quiet editorial spreads where the serif display type does the work of an art director, not a CMS.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ivory Paper | `#f3f2ec` | `--color-ivory-paper` | Page canvas, card surfaces, footer wash — the warm off-white that makes every photograph feel printed, not digital |
| Sage Mist | `#e3e4df` | `--color-sage-mist` | Hairline borders, input outlines, subtle dividers, secondary card backgrounds — the cool-warm neutral that separates layers without contrast shouting |
| Bone Gray | `#cbc9bd` | `--color-bone-gray` | Mid-tone neutrals for input shadows and muted surface fills — the bridge between ivory and ink |
| Ink Black | `#131313` | `--color-ink-black` | Primary text, filled buttons, icon strokes, navigation borders — slightly softer than pure black, reads as printer's ink rather than screen |
| Pure Black | `#000000` | `--color-pure-black` | Highest-contrast borders, pure ink for heaviest typographic moments and fine dividers |
| Snow White | `#ffffff` | `--color-snow-white` | Product card photography backdrop, badge fills — the cleanest white for product isolation |
| Ember Coral | `#f68e6d` | `--color-ember-coral` | Footer background, singular warm accent — the one chromatic gesture in the system, used only when the design needs to feel touched, not seen |
| Powder Blue | `#7faad2` | `--color-powder-blue` | Blue state accent for badges, validation surfaces, and short status labels. Do not promote it to the primary CTA color |

## Tokens — Typography

### Aeonik — Workhorse sans for navigation, body, buttons, product cards, and hero overlays. 500 weight for active nav, labels, and emphasis; 400 for body copy. The 132px display size at 0.80 line-height is the signature — oversized headlines that sit tight and confident over photography. · `--font-aeonik`
- **Substitute:** Inter, Satoshi, or General Sans
- **Weights:** 400, 500
- **Sizes:** 13, 15, 22, 33, 50, 132
- **Line height:** 0.80, 0.90, 1.00, 1.10, 1.20, 1.30
- **Role:** Workhorse sans for navigation, body, buttons, product cards, and hero overlays. 500 weight for active nav, labels, and emphasis; 400 for body copy. The 132px display size at 0.80 line-height is the signature — oversized headlines that sit tight and confident over photography.

### Cardinal Fruit — Display serif reserved for editorial moments: the 'FEEL YOUR SELF' statement, category callouts, and the small italic accent '(BEST)'. At 187px with 1.00 line-height it becomes the visual anchor of the page — a magazine-cover gesture that reframes the whole interface as editorial, not transactional. · `--font-cardinal-fruit`
- **Substitute:** Playfair Display, Reckless, or DM Serif Display
- **Weights:** 400, 500
- **Sizes:** 33, 42, 54, 187
- **Line height:** 1.00, 1.10
- **Role:** Display serif reserved for editorial moments: the 'FEEL YOUR SELF' statement, category callouts, and the small italic accent '(BEST)'. At 187px with 1.00 line-height it becomes the visual anchor of the page — a magazine-cover gesture that reframes the whole interface as editorial, not transactional.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.1 | — | `--text-caption` |
| body-sm | 15px | 1.3 | — | `--text-body-sm` |
| body | 22px | 1.2 | — | `--text-body` |
| subheading | 42px | 1.1 | — | `--text-subheading` |
| heading-sm | 50px | 1 | — | `--text-heading-sm` |
| heading | 54px | 1 | — | `--text-heading` |
| heading-lg | 132px | 0.8 | — | `--text-heading-lg` |
| display | 187px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 17 | 17px | `--spacing-17` |
| 25 | 25px | `--spacing-25` |
| 29 | 29px | `--spacing-29` |
| 33 | 33px | `--spacing-33` |
| 44 | 44px | `--spacing-44` |
| 50 | 50px | `--spacing-50` |
| 58 | 58px | `--spacing-58` |
| 67 | 67px | `--spacing-67` |
| 83 | 83px | `--spacing-83` |
| 216 | 216px | `--spacing-216` |
| 231 | 231px | `--spacing-231` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 5px |
| badges | 5px |
| inputs | 5px |
| buttons | 5px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(243, 242, 236) 0px 0px 0px 1000px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 25-33px
- **Card padding:** 17px
- **Element gap:** 8-17px

## Components

### Primary Navigation Bar
**Role:** Top-level site navigation

Horizontal bar on ivory canvas (#f3f2ec). Left: brand mark 'Afterglo' in Aeonik 500 at 15px. Center: category links ('New', 'Pleasure', 'Intimate Care', etc.) in Aeonik 400 at 13px with 17px horizontal padding. Right: utility links ('Together', 'Community', 'About Us', '(Vibes)'), locale selector, search/account/cart icons. 1px bottom border in #e3e4df. No background fill — sits directly on the page canvas.

### Product Card
**Role:** Product grid item in featured/listing sections

Card on ivory canvas (#f3f2ec) with no visible border or shadow. Product photograph on pure white (#ffffff) square background, occupying the full card area. Below: product name in Aeonik 400 at 15px in ink (#131313), price in same weight at 15px with 'CAD' suffix. 5px border-radius on image container. 17px vertical gap between image and text. No hover elevation — flat and still.

### Out of Stock Badge
**Role:** Availability indicator on product cards

Pill-shaped badge with 5px radius, #000000 background, #ffffff text in Aeonik 500 at 13px. 3-5px vertical and horizontal padding. Positioned top-left or top-right of product image. High-contrast black on white to cut through any product photography.

### Info Badge
**Role:** Decorative or informational tagging

Soft pill with 5px radius, #7faadd (powder blue) or sage (#e3e4df) background, ink (#131313) text in Aeonik 500 at 13px. 3-5px padding. Used sparingly for editorial tagging, not status.

### Hero Photography Panel
**Role:** Full-bleed opening section

Edge-to-edge photograph (artistic, sensual product/still-life) with no overlay treatment. Headline overlaid in white Aeonik at 132px, line-height 0.80, positioned top-left with generous left and top padding (29px+). Sub-text in Aeonik 400 at 15px in white, centered or bottom-aligned.

### Filled Primary Button
**Role:** Primary call-to-action (e.g. 'Start Exploring', 'About Us')

Rectangular button with 5px radius, solid ink (#131313) background, white (#ffffff) text in Aeonik 500 at 15px. 10px vertical padding, 17px horizontal padding. No border, no shadow. Flat and compact — the button is a label, not a widget.

### Ghost Text Button
**Role:** Secondary inline action or link styled as button

No background or border. Text only in Aeonik 500 at 15px in ink (#131313). 10px vertical padding. Appears beside or below filled buttons as the quieter option.

### Editorial Display Heading
**Role:** Section or page statement

Cardinal Fruit serif at 187px or 54px, line-height 1.00, in ink (#131313). Always left-aligned with generous left margin. May include an italic Cardinal Fruit accent word in parentheses (e.g. '(BEST)') at 33-42px. The typographic anchor of the editorial spread.

### Featured Section Header
**Role:** Section title for product grids

Aeonik at 50px, line-height 1.00, weight 500, in ink (#131313). Left-aligned, sits directly above the product grid with 25-33px vertical spacing. Clean sans-serif counterpoint to the serif display type.

### Image Collage Panel
**Role:** Editorial about/mission section visual

Overlapping or adjacent photographic tiles at slightly varied sizes and rotation, with no visible borders. Tiles sit on ivory canvas (#f3f2ec). Images are product crops or intimate still-lifes with a soft, warm color grade. The collage creates editorial energy without grid rigidity.

### Category Carousel Arrow
**Role:** Horizontal navigation for product carousels

Small ghost button — 29px square, 1px border in #e3e4df, 5px radius. Left/right arrow icon in Aeonik or system glyph. No fill, no shadow. Sits between section header and product grid.

### Input Field
**Role:** Form input (search, email, etc.)

Full-width field with 1px border in sage (#e3e4df), 5px radius, ivory (#f3f2ec) background. Inset shadow rgb(243,242,236) 0 0 0 1000px creates a soft inner fill. Placeholder text in Aeonik 400 at 15px, muted gray.

### Warm Footer
**Role:** Site footer with brand accent

Solid #f68e6d (ember coral) background — the only chromatic surface in the system. Ink (#131313) text in Aeonik 400 at 15px for links and legal copy. No images, no decorations. The coral wash is the closing gesture of the page.

## Do's and Don'ts

### Do
- Use Cardinal Fruit serif at 54px+ for editorial display moments and reserve it for those moments — one per section maximum
- Set Aeonik display sizes at tight line-heights: 0.80 for 132px headlines, 1.00 for 50-54px section titles, 1.20 for 22px body
- Apply the 5px radius universally to cards, buttons, badges, and inputs — it is the system's only rounding gesture
- Use the ivory canvas (#f3f2ec) as the default background for every page; let #ffffff appear only inside product photography frames
- Pair Aeonik weight 500 for navigation labels, buttons, and the brand mark; weight 400 for body copy and descriptions
- Let the footer be the only surface that uses #f68e6d — do not introduce the coral accent on buttons, badges, or links
- Build product cards as flat compositions: image on white, text below in ink, no hover elevation, no shadows, no borders around the card itself

### Don't
- Do not use the powder blue (#7faad2) as a CTA or filled action — it is decorative only, reserved for soft badges and washes
- Do not apply drop shadows to cards, buttons, or images — the system stays flat; depth comes from type and photography
- Do not introduce border-radius values other than 5px — the system uses one rounding gesture, repeated exactly
- Do not use pure black (#000000) for large body text — reserve it for fine borders and heaviest display moments; use #131313 for readable text and buttons
- Do not place the Cardinal Fruit serif below 33px — it loses its editorial weight at small sizes; switch to Aeonik for anything under 33px
- Do not use gradients, glows, or color tints on buttons or interactive elements — the system is matte and flat
- Do not center-align body copy or product descriptions — the editorial language reads left-aligned with generous left margin

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Ivory Canvas | `#f3f2ec` | Base page background — the warm paper tone every other surface sits on |
| 1 | Snow Card | `#ffffff` | Product photography cards and badge fills — the cleanest white for object isolation |
| 2 | Sage Divider | `#e3e4df` | Hairline borders, input borders, secondary surface fills |
| 3 | Bone Shadow | `#cbc9bd` | Mid-tone surface for input inset shadows and muted fills |
| 4 | Ember Footer | `#f68e6d` | Sole chromatic surface — footer only, never interactive |

## Elevation

The system intentionally avoids drop shadows on all components. Depth and visual separation are achieved through: (1) the warm-to-cool neutral progression from ivory canvas to sage borders, (2) photography isolation on pure white card backgrounds, and (3) generous whitespace. The only shadow present is an inset fill on input fields (rgb(243,242,236) 0 0 0 1000px inset) that softens the input interior without creating external elevation. This flat-everywhere approach keeps the editorial mood intact — the page should feel printed, not rendered.

## Imagery

Photography is editorial, intimate, and product-forward — close-up crops of objects on neutral surfaces, often in warm or moody lighting with no lifestyle context. Tiles in the about/mission section are arranged as an overlapping collage with slight rotation, giving a magazine-spread energy. Product images always sit on pure white (#ffffff) to isolate the object against the warm ivory canvas. Color treatment is warm and slightly desaturated, never clinical. No illustrations, no 3D renders, no icon-heavy graphics — icons are minimal line glyphs only.

## Layout

Full-bleed hero photograph opens the page with no margin or frame, followed by generous vertical breathing room (25-33px section gaps) between editorial spreads. The about/mission section uses a two-zone layout: large serif display type left-aligned on the left half, with a photograph collage on the right. Featured products appear in a horizontal carousel-style grid (3-4 cards visible) on the ivory canvas. Navigation is a single top bar with no sticky behavior implied. The footer is a full-width warm coral band. Overall rhythm: photograph → editorial statement → product grid → editorial statement → product grid → warm footer.

## Agent Prompt Guide

## Quick Color Reference
- text: #131313
- background: #f3f2ec
- border: #e3e4df
- accent: #f68e6d (footer only)
- badge: #7faad2
- card surface: #ffffff
- primary action: #131313 (filled action)

## Example Component Prompts

1. **Editorial Hero**: Full-bleed photograph background. Headline in Aeonik weight 500, 132px, line-height 0.80, white (#ffffff), positioned top-left with 29px padding. Sub-text in Aeonik 400, 15px, white, below the headline. No overlay gradient.

2. **Product Card**: Ivory (#f3f2ec) page background. Product image in a square container with 5px radius, pure white (#ffffff) backdrop, no border. Below: product name in Aeonik 400, 15px, #131313. Price in same style with 'CAD' suffix. 17px gap between image and text.

3. **Display Editorial Heading**: Cardinal Fruit serif, 187px, line-height 1.00, weight 400, color #131313, left-aligned. Optionally pair with a 42px italic Cardinal Fruit accent word in parentheses.

4. **Filled Button**: 5px radius, #131313 background, white text in Aeonik 500 at 15px, 10px vertical and 17px horizontal padding. No border, no shadow.

5. **Warm Footer**: Full-width band with #f68e6d background. Links and legal text in Aeonik 400, 15px, #131313. No images or icons.

## Similar Brands

- **Maude** — Same editorial intimacy-shop language: warm cream canvas, oversized display type, near-monochrome palette with a single warm accent, photography-first product cards
- **Dame** — Similar product-isolation photography on neutral backgrounds, compact sans-serif UI type, flat components with no decorative shadows
- **Unbound** — Same editorial magazine sensibility — display serif used sparingly for brand statements, sans-serif for utility, warm paper-tone canvas
- **Nette** — Restrained palette with one warm accent color, flat product cards on white, hairline borders, compact 5px-radius components
- **Cuvana** — Premium wellness-product language: ivory backgrounds, quiet typography, warm coral as a singular accent, no visual noise

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ivory-paper: #f3f2ec;
  --color-sage-mist: #e3e4df;
  --color-bone-gray: #cbc9bd;
  --color-ink-black: #131313;
  --color-pure-black: #000000;
  --color-snow-white: #ffffff;
  --color-ember-coral: #f68e6d;
  --color-powder-blue: #7faad2;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-fruit: 'Cardinal Fruit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.1;
  --text-body-sm: 15px;
  --leading-body-sm: 1.3;
  --text-body: 22px;
  --leading-body: 1.2;
  --text-subheading: 42px;
  --leading-subheading: 1.1;
  --text-heading-sm: 50px;
  --leading-heading-sm: 1;
  --text-heading: 54px;
  --leading-heading: 1;
  --text-heading-lg: 132px;
  --leading-heading-lg: 0.8;
  --text-display: 187px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-33: 33px;
  --spacing-44: 44px;
  --spacing-50: 50px;
  --spacing-58: 58px;
  --spacing-67: 67px;
  --spacing-83: 83px;
  --spacing-216: 216px;
  --spacing-231: 231px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 25-33px;
  --card-padding: 17px;
  --element-gap: 8-17px;

  /* Border Radius */
  --radius-md: 5px;

  /* Named Radii */
  --radius-cards: 5px;
  --radius-badges: 5px;
  --radius-inputs: 5px;
  --radius-buttons: 5px;

  /* Shadows */
  --shadow-subtle: rgb(243, 242, 236) 0px 0px 0px 1000px inset;

  /* Surfaces */
  --surface-ivory-canvas: #f3f2ec;
  --surface-snow-card: #ffffff;
  --surface-sage-divider: #e3e4df;
  --surface-bone-shadow: #cbc9bd;
  --surface-ember-footer: #f68e6d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ivory-paper: #f3f2ec;
  --color-sage-mist: #e3e4df;
  --color-bone-gray: #cbc9bd;
  --color-ink-black: #131313;
  --color-pure-black: #000000;
  --color-snow-white: #ffffff;
  --color-ember-coral: #f68e6d;
  --color-powder-blue: #7faad2;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-fruit: 'Cardinal Fruit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.1;
  --text-body-sm: 15px;
  --leading-body-sm: 1.3;
  --text-body: 22px;
  --leading-body: 1.2;
  --text-subheading: 42px;
  --leading-subheading: 1.1;
  --text-heading-sm: 50px;
  --leading-heading-sm: 1;
  --text-heading: 54px;
  --leading-heading: 1;
  --text-heading-lg: 132px;
  --leading-heading-lg: 0.8;
  --text-display: 187px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-33: 33px;
  --spacing-44: 44px;
  --spacing-50: 50px;
  --spacing-58: 58px;
  --spacing-67: 67px;
  --spacing-83: 83px;
  --spacing-216: 216px;
  --spacing-231: 231px;

  /* Border Radius */
  --radius-md: 5px;

  /* Shadows */
  --shadow-subtle: rgb(243, 242, 236) 0px 0px 0px 1000px inset;
}
```
