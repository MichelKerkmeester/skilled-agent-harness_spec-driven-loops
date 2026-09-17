# Emmalewisham — Style Reference
> porcelain apothecary at golden hour. Warm linen surfaces cradle jewel-toned glass vessels; the brand violet traces hairlines through the room; serif labels float over clean sans-serif UI like engraved pharmacy signs.

**Theme:** light

Emma Lewisham is a porcelain apothecary rendered in editorial photography: warm stone-linen canvases, full-bleed pastel product vignettes, and a single deep iris-violet accent that whispers through thin outlines and links rather than shouting from filled buttons. The system feels calm, considered, and almost analog — serif wordmarks float over sans-serif UI text, products are presented as still-life objects on color-drenched stages, and surfaces stay nearly weightless with hairline borders instead of shadows. Color is used as atmosphere (peach, blush, mauve washes) and as restraint (violet for emphasis only); density is sparse, whitespace is generous, and the only interactive surface style is a thin outlined border in the brand violet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris Violet | `#49369e` | `--color-iris-violet` | Outlined action borders, link color, heading accents, navigation emphasis — the singular brand hue, deployed as a fine outline or thin underline rather than a filled mass |
| Soft Lavender | `#a9a7db` | `--color-soft-lavender` | Muted secondary accent for list borders, decorative link borders, and subtle dividers — the diluted echo of Iris Violet used when the full intensity would overpower |
| Iris Focus | `#524eb7` | `--color-iris-focus` | Input focus state text/border — a slightly lifted tonal variant of Iris Violet to signal active text fields |
| Blush Petal | `#ec9bad` | `--color-blush-petal` | Atmospheric surface wash and decorative accent — warm pink used for full-bleed product stage backgrounds and occasional badge fills |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, product image cutouts, nav and button borders, inverted text on dark or violet fields |
| Stone Linen | `#f2f1ef` | `--color-stone-linen` | Page canvas — the warm off-white that grounds every section, used as the base layer beneath product stages and text blocks |
| Warm Ash | `#a09c97` | `--color-warm-ash` | Muted background panels, announcement bar, low-emphasis surfaces |
| Charcoal | `#333333` | `--color-charcoal` | Secondary text and low-emphasis fills — softer than pure black for body copy and metadata |
| Graphite | `#000000` | `--color-graphite` | Primary text, button outlines, icon strokes — used at hairline weights to stay quiet |

## Tokens — Typography

### Martina Plantijn — Primary UI and body sans-serif — used for navigation, buttons, body text, product copy, form fields, badges, and micro-labels. The weight 300 thin gives the system its airy, unforced feel; weight 700 is reserved for navigation emphasis and select labels. This is the workhorse — almost everything visible reads in this face. · `--font-martina-plantijn`
- **Substitute:** Inter, Söhne, or Untitled Sans
- **Weights:** 300, 400, 700
- **Sizes:** 11px, 13px, 14px, 16px, 20px, 30px
- **Line height:** 1.20–1.86
- **Role:** Primary UI and body sans-serif — used for navigation, buttons, body text, product copy, form fields, badges, and micro-labels. The weight 300 thin gives the system its airy, unforced feel; weight 700 is reserved for navigation emphasis and select labels. This is the workhorse — almost everything visible reads in this face.

### Regola Pro Book — Display and editorial serif — used for the brand wordmark and large hero/display copy. Its 80px presence carries the entire brand identity: the 'EMMA LEWISHAM' logotype and product-feature headlines float in Regola Pro Book, creating a distinctive serif-on-sans pairing. The single weight keeps the display quiet and editorial rather than decorative. · `--font-regola-pro-book`
- **Substitute:** GT Sectra, Tiempos Headline, or Canela
- **Weights:** 400
- **Sizes:** 16px, 20px, 24px, 80px
- **Line height:** 1.20–1.63
- **Role:** Display and editorial serif — used for the brand wordmark and large hero/display copy. Its 80px presence carries the entire brand identity: the 'EMMA LEWISHAM' logotype and product-feature headlines float in Regola Pro Book, creating a distinctive serif-on-sans pairing. The single weight keeps the display quiet and editorial rather than decorative.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body-lg | 16px | 1.69 | — | `--text-body-lg` |
| subheading | 20px | 1.38 | — | `--text-subheading` |
| heading-sm | 30px | 1.25 | — | `--text-heading-sm` |
| display | 80px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 90 | 90px | `--spacing-90` |
| 120 | 120px | `--spacing-120` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 50px |
| cards | 30px |
| badges | 10px |
| buttons | 3px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48-80px
- **Card padding:** 20-30px
- **Element gap:** 12px

## Components

### Brand Wordmark
**Role:** Primary brand identity lockup

EMMA LEWISHAM set in Regola Pro Book at 20px in the header, letter-spaced wide. White on warm backgrounds, Graphite on light. Always centered, always quiet — never bolded, never enlarged beyond 24px in the header context.

### Outlined Action Button
**Role:** Primary interactive element

Transparent fill with a 1px Iris Violet (#49369e) border, 3px corner radius, 12px vertical × 5px horizontal internal padding (tight, jewel-like). Text in Martina Plantijn 14px weight 400 in Iris Violet. No fill on any state — hover deepens border to 1.5px or shifts text to Graphite. The minimal 3px radius is deliberate: the system rejects pill buttons.

### Ghost Text Link
**Role:** Secondary navigation and inline links

Martina Plantijn 14px weight 400, Iris Violet text, no underline by default. 12px horizontal padding, 5px vertical padding. Inline links within body copy sit as plain colored text with no decoration. This is the primary 'action' style across the site.

### Announcement Bar
**Role:** Top-of-page utility message

Full-bleed Warm Ash (#a09c97) band, 3px vertical padding, centered Martina Plantijn 13px weight 400 white text. No close button visible, no shadow — sits as a flat strip above the main nav.

### Top Navigation
**Role:** Primary site navigation

Martina Plantijn 13px weight 400, Graphite for inactive items, 12px horizontal spacing between links. Left-aligned secondary nav (Shop, Routines, Gifts, Skin Academy) and right-aligned utility cluster (About, Sustainability, Loyalty, search, wishlist, account, cart) with 50px radius on the cart badge. The nav is a thin horizontal line of text — no background bar, no shadow, no border below.

### Full-Bleed Product Stage
**Role:** Hero and product showcase sections

Edge-to-edge colored background (Blush Petal or other atmospheric wash) with a single product bottle centered, scaled to dominate the viewport. No card frame, no padding around the product — the object IS the layout. Product text overlays bottom-left as a small 'Shop now' ghost link.

### Product Card
**Role:** Grid item for product listings

Pure White (#ffffff) surface, 30px border radius, 20-30px internal padding. Product image fills the card with no border. Martina Plantijn 14px body text, 20px subheading for product name. Hairline Soft Lavender (#a9a7db) border for subtle definition — no shadow.

### Badge
**Role:** Small status indicators and cart count

Blush Petal (#ec9bad) or Iris Violet fill, 10px radius, tight 5px padding. Martina Plantijn 11px weight 700 white text. Used sparingly — cart counter dot, sale tags, certification marks.

### Text Input
**Role:** Form fields for email, search, checkout

No visible border by default — just a bottom hairline in Soft Lavender. Focus state shifts the line to Iris Focus (#524eb7). Martina Plantijn 14px body, Charcoal placeholder text. 10px vertical padding, minimal footprint.

### Body Copy Block
**Role:** Editorial text sections

Martina Plantijn 14-16px weight 400, Charcoal (#333333) or Graphite (#000000), 1.63-1.82 line height for generous reading rhythm. No background, no card frame — text floats directly on Stone Linen canvas with 20-30px vertical margins between paragraphs.

### Section Heading
**Role:** Major section titles

Regola Pro Book 30-80px weight 400, Graphite on light, white on dark/colored stages. Tight 1.20-1.25 line height. The serif choice at this size is the brand's signature moment — these are the only moments the serif appears at scale.

### Footer Link List
**Role:** Footer navigation columns

Martina Plantijn 13px weight 400, Graphite, 7-12px vertical spacing between items. Column headers in 14px weight 700. No dividers, no card wrapping — the footer is pure text on Stone Linen.

## Do's and Don'ts

### Do
- Use Iris Violet (#49369e) exclusively for outlined action borders and link text — never fill a button or surface with it
- Set the brand wordmark and all display headings in Regola Pro Book at 400 weight, never bold it
- Keep all borders at 1px hairline weight; the system rejects thick borders and shadows
- Use Stone Linen (#f2f1ef) as the default canvas beneath all content; let Blush Petal (#ec9bad) and other atmospheric colors serve as full-bleed product stages, not inline backgrounds
- Use 30px radius on cards and 3px on buttons — the wide card / tight button ratio is the system's signature geometry
- Let product photography occupy the full viewport in hero sections with zero padding around the object
- Pair the sans-serif Martina Plantijn (UI) with the serif Regola Pro Book (display) — never use the serif for body copy or the sans for the wordmark

### Don't
- Don't fill buttons with Iris Violet or any other brand color — the action style is always outlined, never filled
- Don't apply box-shadows to cards, buttons, or nav — the system is shadow-free and uses hairline borders for definition
- Don't use bold or heavy weights in the serif (Regola Pro Book is 400 only) — the display must stay quiet
- Don't use Blush Petal (#ec9bad) as a text color or border — it's an atmospheric surface wash only
- Don't crowd the canvas with cards or panels — the layout breathes; let sections flow directly on Stone Linen
- Don't use more than one atmospheric color per section — the hero uses Blush Petal alone, never mixed with lavender or violet washes
- Don't use the 50px nav radius on anything other than the cart badge — it is a single accent, not a system-wide pattern

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Stone Linen Canvas | `#f2f1ef` | Base page background across all sections |
| 2 | Pure White Card | `#ffffff` | Product cards, content panels, image cutout zones |
| 3 | Warm Ash Panel | `#a09c97` | Announcement bar, muted utility surfaces |
| 4 | Blush Stage | `#ec9bad` | Full-bleed product photography backgrounds and atmospheric washes |
| 5 | Iris Accent | `#49369` | Brand emphasis — links, outlined actions, heading underlines |

## Imagery

Tight, centered product photography on full-bleed solid-color stages — glass bottles and jars float against warm pastel washes (blush pink, mauve, cream). No lifestyle context, no models, no environment: the product is the hero, presented as a still-life object. Background colors shift between sections to create visual rhythm without ever showing a real-world setting. All product images sit on pure white cutout zones within the card grid, with no shadows beneath the objects. Icon style is minimal — thin-line outlined icons at hairline weight in the nav utility cluster. The visual language is editorial-cosmetic: apothecary, laboratory, museum vitrine.

## Layout

Full-bleed product hero sections dominate the page, each using a different atmospheric color wash (blush, mauve, cream) with a single centered product vessel. The top stack is: gray announcement bar → thin transparent nav with centered wordmark → full-bleed colored hero with product. Below the hero, the site shifts to a max-width ~1440px contained grid for product cards and editorial text blocks on Stone Linen canvas. Content density is sparse — large vertical gaps between sections (48-80px), single-column text blocks, and 2-4 column product grids. Navigation is a flat horizontal text bar with no background fill, no border below, and no sticky behavior visible. The overall rhythm is: one full-bleed product stage, then a calm text or card section, then another full-bleed stage — like turning pages in a lookbook.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (primary), #333333 (secondary)
- background: #f2f1ef (canvas), #ffffff (card)
- border: #a9a7db (soft), #49369e (emphasis)
- accent: #ec9bad (atmospheric)
- primary action: #49369e (outlined action border)

**Example Component Prompts**
1. Build a hero stage: full-bleed Blush Petal (#ec9bad) background, a centered product bottle image at 60% viewport height, 'Shop now' ghost link in bottom-left as Martina Plantijn 14px Iris Violet text with 12px padding.
2. Build a product card: 30px radius, 20px padding, Pure White (#ffffff) surface, 1px Soft Lavender (#a9a7db) hairline border, product image filling the top 70%, product name in Martina Plantijn 20px Graphite, price in 14px Charcoal below.
3. Build the header nav: transparent background, no border, centered 'EMMA LEWISHAM' wordmark in Regola Pro Book 20px Graphite, left-aligned Shop/Routines/Gifts links and right-aligned utility icons all in Martina Plantijn 13px Graphite, 12px horizontal spacing.
4. Build an outlined action button: transparent fill, 1px Iris Violet (#49369e) border, 3px corner radius, 12px vertical × 5px horizontal padding, 'Add to bag' in Martina Plantijn 14px weight 400 Iris Violet.
5. Build a section heading: 'Our Routines' set in Regola Pro Book 30px weight 400 Graphite, 1.25 line height, 48px top margin from previous section, left-aligned on Stone Linen canvas.

## Similar Brands

- **Aesop** — Same apothecary sensibility — thin sans-serif nav, outlined actions, serif-free or minimal-serif headings, and full-bleed product photography on warm neutral backgrounds
- **Glossier** — Same editorial product-hero pattern with full-bleed colored stages and centered product vessels, paired with a quiet sans-serif UI and minimal card chrome
- **Hourglass Cosmetics** — Same luxury skincare visual language — large product silhouettes on pastel washes, hairline UI elements, and a single saturated accent color used sparingly for links and emphasis
- **Tatcha** — Same refined serif-on-sans pairing for brand wordmark over clean UI, with warm off-white canvases and product-centric full-bleed hero sections
- **Drunk Elephant** — Same minimal outlined button style with a single brand hue, paired with sparse editorial layouts and product photography as the primary visual content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris-violet: #49369e;
  --color-soft-lavender: #a9a7db;
  --color-iris-focus: #524eb7;
  --color-blush-petal: #ec9bad;
  --color-pure-white: #ffffff;
  --color-stone-linen: #f2f1ef;
  --color-warm-ash: #a09c97;
  --color-charcoal: #333333;
  --color-graphite: #000000;

  /* Typography — Font Families */
  --font-martina-plantijn: 'Martina Plantijn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-regola-pro-book: 'Regola Pro Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.69;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48-80px;
  --card-padding: 20-30px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-3xl: 30px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-nav: 50px;
  --radius-cards: 30px;
  --radius-badges: 10px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-stone-linen-canvas: #f2f1ef;
  --surface-pure-white-card: #ffffff;
  --surface-warm-ash-panel: #a09c97;
  --surface-blush-stage: #ec9bad;
  --surface-iris-accent: #49369;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris-violet: #49369e;
  --color-soft-lavender: #a9a7db;
  --color-iris-focus: #524eb7;
  --color-blush-petal: #ec9bad;
  --color-pure-white: #ffffff;
  --color-stone-linen: #f2f1ef;
  --color-warm-ash: #a09c97;
  --color-charcoal: #333333;
  --color-graphite: #000000;

  /* Typography */
  --font-martina-plantijn: 'Martina Plantijn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-regola-pro-book: 'Regola Pro Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.69;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-3xl: 30px;
  --radius-full: 50px;
}
```
