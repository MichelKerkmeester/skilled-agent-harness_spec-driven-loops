# mishmash® — Style Reference
> paper boutique, black frame, vivid contents.

**Theme:** light

mishmash® operates as a paper goods gallery: the chrome (type, borders, buttons, cards) is almost entirely achromatic, letting the saturated product photography carry every color moment. The layout is a compact, image-led grid where large editorial photos do the heavy lifting and UI elements stay quiet, small, and confident. Only two chromatic tokens exist in the interface — a soft butter yellow and a warmer amber — and both appear as small floating punctuation (sale badges, the persistent discount chip) rather than as filled buttons or backgrounds. Type is the only place warmth enters the system: Circular at modest sizes with comfortable line-height, set tight to the grid. The result feels like a curated stationery boutique — restrained shell, vivid contents.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#171717` | `--color-ink` | Primary text, nav links, button text, card borders, footer dividers — near-black with a hint of warmth, not pure #000 |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surface, product card background |
| Bone | `#f2f2f2` | `--color-bone` | Subtle body borders, secondary text, input borders, hairline dividers between sections |
| Ash | `#e3e3e3` | `--color-ash` | Button borders, card surface variant, footer separator lines — slightly darker than Bone for elevated borders |
| Smoke | `#c7c7c7` | `--color-smoke` | Muted helper text, disabled borders, de-emphasized labels |
| Graphite | `#a1a1a1` | `--color-graphite` | Secondary heading text, subdued body copy, inactive state labels |
| Pewter | `#919191` | `--color-pewter` | Tertiary headings, less prominent metadata |
| Iron | `#858585` | `--color-iron` | Body helper text, captions, subtle annotations |
| Buttercream | `#f4debb` | `--color-buttercream` | Soft category card surface (kraft-adjacent pastel), gentle highlight wash behind editorial text |
| Amber Tag | `#f9cb86` | `--color-amber-tag` | Yellow action color for filled buttons, selected navigation states, and focused conversion moments. |

## Tokens — Typography

### Circular — Sole typeface across all contexts — nav, body, buttons, headings, hero, footer. Circular's geometric humanism gives the brand a friendly-but-editorial voice; weight 500 is the workhorse for headings, 400 for body, 600 reserved for emphasis and small caps labels. The 10px step (likely for legal/announcement bars) and 46px display step define the extreme ends of the scale. · `--font-circular`
- **Substitute:** Inter or Manrope for system fallback
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 14px, 16px, 18px, 20px, 30px, 38px, 46px
- **Line height:** 1.04 (display) / 1.12 (headings) / 1.20 (body)
- **Role:** Sole typeface across all contexts — nav, body, buttons, headings, hero, footer. Circular's geometric humanism gives the brand a friendly-but-editorial voice; weight 500 is the workhorse for headings, 400 for body, 600 reserved for emphasis and small caps labels. The 10px step (likely for legal/announcement bars) and 46px display step define the extreme ends of the scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 18px | 1.2 | — | `--text-subheading` |
| heading-sm | 20px | 1.2 | — | `--text-heading-sm` |
| heading | 30px | 1.12 | — | `--text-heading` |
| heading-lg | 38px | 1.12 | — | `--text-heading-lg` |
| display | 46px | 1.04 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| tags | 9999px |
| cards | 12px |
| inputs | 4px |
| buttons | 12px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary Filled Button (Black)
**Role:** Main conversion action — 'Shop now', 'Add to cart'

Black (#171717) background, white text, 12px radius, 14px vertical × 20px horizontal padding, Circular 16px weight 500. Used sparingly — only one per viewport section.

### Ghost/Text Button
**Role:** Secondary navigation actions

Transparent background, #171717 text, 12px radius, 14px×20px padding. Used in category cards and inline links.

### Outlined Input Field
**Role:** Email capture, search, newsletter signup

White background, 1px solid #e3e3e3 border, 4px radius, 14px vertical × 16px horizontal padding, Circular 16px weight 400 placeholder in #858585. Focus state: border darkens to #171717.

### Pill Discount Badge
**Role:** Discount indicator on product cards and floating CTA

Amber (#f9cb86) background, #171717 text, 9999px full radius, 10–14px Circular weight 600. Two contexts: (a) small circular '30%' badge top-left of product card, (b) elongated 'WANT 15% OFF?' floating chip bottom-right.

### Wishlist Heart Icon
**Role:** Save product action on cards

Stroke-only heart icon, 1.5px stroke, #171717, top-right of product card. 16px container, no background.

### Product Card
**Role:** Planner/stationery product in grid

White surface, 12px radius, 24px padding, product photo fills top, Circular 16px weight 500 title, 14px weight 400 price in #171717 with strikethrough original in #a1a1a1. White outlined 'Add' button (1px #e3e3e3) bottom-right of card body.

### Category Editorial Card
**Role:** Collection/feature highlight (Log, Accessories, etc.)

Full-bleed colored background (yellow, pink, kraft), product imagery overlapping right half, title in Circular 20–30px weight 500 left-aligned, subtitle in lighter weight 400, black 'Shop now' button bottom-left. No border, relies on image bleed for edge.

### Announcement Bar
**Role:** Site-wide promotional strip at top

Solid #171717 background, white Circular 14px weight 400 text, centered, 8–10px vertical padding. Single-line scrollable.

### Top Navigation
**Role:** Primary site navigation

White background, 'Shop' and 'Search' left in Circular 16px weight 500, centered wordmark logo (Circular 600 with ® mark), wishlist/cart/account icons right at 20px. 4px radius on any active search/pill state. ~64px height.

### Hero Banner
**Role:** Full-bleed editorial product image

Large lifestyle/product photograph fills width, 12px corner radius, black 'Shop now' button overlaid bottom-left at 12px radius. No headline overlay — the image IS the headline.

### Newsletter Card
**Role:** Email capture with incentive

Kraft/tan (#f4debb or similar) background, Circular 20px weight 500 headline, 14px body, inline email input + black 'Join now' button side by side. 16px radius, 24px padding.

### Footer Link Column
**Role:** Site map navigation in footer

White background, column header in Circular 16px weight 600, links in 14px weight 400 #171717, 12px vertical spacing between links. No dividers between columns.

### Section Heading with Accent Dots
**Role:** Editorial copy break between product bands

Large Circular 30–38px weight 500 body text, black, with small colored circle/rectangle decorations inline (buttercream, mint, amber) at 12–16px. Left-aligned, max-width ~800px, relaxed line-height 1.2.

## Do's and Don'ts

### Do
- Keep the UI achromatic — let product photography be the only source of saturated color on any given screen.
- Use #f9cb86 exclusively for small floating chips and percentage badges; never fill large surfaces with it.
- Default to 12px radius for cards, buttons, and images; use 4px only for inputs and nav-pill states; use 9999px for tag/discount pills only.
- Set body type at 16px Circular weight 400, 1.2 line-height; reserve weight 600 for footer column headers and small labels.
- Use 48px section padding and 24px card padding; maintain a 1280px max-width container.
- Place exactly one filled black 'Shop now' or 'Add to cart' button per viewport — let ghost/text buttons carry secondary actions.
- Anchor every page with the black announcement bar at 14px Circular weight 400 in white.

### Don't
- Don't introduce new chromatic colors into the UI chrome — the 1% colorfulness is the brand.
- Don't fill buttons with #f9cb86 or #f4debb; those are surface/accent tokens, not action tokens.
- Don't use box-shadows or gradients — the system is flat, separated by borders and surface contrast.
- Don't use corner radius other than 4px (inputs/nav), 12px (cards/buttons), or 9999px (pills).
- Don't set type below 14px for body or above 46px for display; 10px is reserved for the announcement bar and legal micro-copy only.
- Don't place two filled black buttons in the same viewport — use ghost or text variants for additional actions.
- Don't use colored backgrounds for navigation, footer, or structural chrome — only for editorial category cards.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, product card base |
| 1 | Card | `#f2f2f2` | Secondary card surfaces, soft band backgrounds |
| 2 | Border | `#e3e3e3` | Button outlines, elevated card borders, footer rules |
| 3 | Accent Card | `#f4debb` | Editorial category cards, newsletter accent panels |

## Elevation

The system is intentionally flat. Depth is communicated through surface color contrast (#ffffff → #f2f2f2 → #e3e3e3) and 1px hairline borders in #e3e3e3 or #f2f2f2, never through drop shadows. Product photography provides the only sense of dimensionality.

## Imagery

Product photography is the dominant visual asset — tight crops of planners, notebooks, pens, and sticky tabs on neutral surfaces, often showing hands or desk context. Treatment is high-key with natural light, vivid but not oversaturated, allowing the product colors (red M cover, blue W cover, yellow D cover, green UNDATED) to read as graphic elements. Images are full-bleed in heroes, contained within 12px-radius cards in grids, and used as overlapping right-half bleeds in editorial category cards. No illustration, no 3D, no abstract graphics — photography is the sole visual language beyond type.

## Layout

Full-width sections contained within a 1280px max-width, centered. The hero is a single full-bleed image with one overlaid CTA. Below the hero, category cards sit in a 3-column grid with varied background colors and overlapping product imagery. Product grids are 4-column on desktop with consistent card sizing. The page alternates between white bands and single-accent-color bands (buttercream, pink, kraft) to create rhythm without dark-mode sections. Navigation is a single thin top bar with centered logo; no sidebar, no mega-menu visible. Floating 'WANT 15% OFF?' chip is fixed bottom-right across all viewports. Spacing between sections is generous (48px) but within sections the rhythm is compact (24px gaps, 14–20px button padding).

## Agent Prompt Guide

**Quick Color Reference**
- text: #171717
- background: #ffffff
- border: #e3e3e3
- muted text: #858585
- accent: #f9cb86
- primary action: #f9cb86 (filled action)

**Example Component Prompts**

1. *Product grid card*: White surface, 12px radius, 24px padding. Product photo fills top 60% with no inner border. Circular 16px weight 500 title in #171717, 14px weight 400 price in #171717 with strikethrough original in #a1a1a1. White outlined 'Add' button (1px #e3e3e3 border, 4px radius, 14px×20px padding) bottom-right. Optional 9999px amber pill (#f9cb86, #171717 text) top-left for '30%' discount.

2. *Editorial category card*: Full-bleed buttercream (#f4debb) or pink background, no border, 16px radius. Product photo overlapping right half (extending beyond card edge). Title in Circular 30px weight 500 #171717 left-aligned, subtitle in 16px weight 400. Black 'Shop now' button (#171717 bg, white text, 12px radius, 14px×20px padding) bottom-left.

3. *Hero banner*: Full-width photograph, 12px corner radius, max-height 600px. No overlay headline. Black 'Shop now' button (#171717, white text, 12px radius, 14px×20px padding) positioned bottom-left at 24px inset.

4. *Announcement bar*: Full-width #171717 background, 10px vertical padding, single line of centered white Circular 14px weight 400 text. Sticky at top.

5. *Newsletter card*: Buttercream (#f4debb) background, 16px radius, 24px padding. Circular 20px weight 500 #171717 headline, 14px weight 400 subtext. Inline email input (white bg, 1px #e3e3e3 border, 4px radius, 14px×16px padding) adjacent to black 'Join now' button (12px radius, 14px×20px padding).

## Accent Discipline

The system contains exactly two chromatic UI colors: #f4debb (buttercream, for soft editorial card surfaces) and #f9cb86 (amber, for discount badges and floating chips). These must never appear as button fills, never as body text, and never as large background bands. Their role is punctuation — a single amber tag on a white product card, a single buttercream card in a row of three. The 1% colorfulness ratio is a hard constraint: if a new screen feels colorful, the chrome is wrong.

## Similar Brands

- **Papier** — Same achromatic chrome with product photography as the sole color source; similar editorial category cards with overlapping imagery; compact type and tight card grids.
- **Field Notes (fieldnotesbrand.com)** — Minimalist stationery DTC with near-black/white palette, small accent badges, product-grid homepage, and wordmark-as-logo navigation.
- **Areaware** — Design-object retailer using a restrained black/white/cream palette where product imagery provides all color; flat surfaces, no shadows, tight card padding.
- **HAY (hay.dk)** — Design retailer with a paper-goods sensibility; uses single-color editorial cards, flat product grids, and a wordmark-centered header with minimal navigation chrome.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #171717;
  --color-paper-white: #ffffff;
  --color-bone: #f2f2f2;
  --color-ash: #e3e3e3;
  --color-smoke: #c7c7c7;
  --color-graphite: #a1a1a1;
  --color-pewter: #919191;
  --color-iron: #858585;
  --color-buttercream: #f4debb;
  --color-amber-tag: #f9cb86;

  /* Typography — Font Families */
  --font-circular: 'Circular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.12;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.12;
  --text-display: 46px;
  --leading-display: 1.04;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 99999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-inputs: 4px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #f2f2f2;
  --surface-border: #e3e3e3;
  --surface-accent-card: #f4debb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #171717;
  --color-paper-white: #ffffff;
  --color-bone: #f2f2f2;
  --color-ash: #e3e3e3;
  --color-smoke: #c7c7c7;
  --color-graphite: #a1a1a1;
  --color-pewter: #919191;
  --color-iron: #858585;
  --color-buttercream: #f4debb;
  --color-amber-tag: #f9cb86;

  /* Typography */
  --font-circular: 'Circular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.12;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.12;
  --text-display: 46px;
  --leading-display: 1.04;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 99999px;
}
```
