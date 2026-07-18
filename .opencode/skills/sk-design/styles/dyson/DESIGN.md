# Dyson — Style Reference
> engineering gallery on warm paper — products are specimens on a mat board, framed by a black lintel and a single green purchase signal in an otherwise monochrome room.

**Theme:** light

Dyson treats its products as museum objects on a warm cream canvas (#fff8e6) rather than items on a clinical white grid. The interface is overwhelmingly monochrome — charcoal text (#333333), white product cards, hairline dividers (#ebebeb) — with chromatic color appearing only as functional punctuation: a green (#79b928) for the occasional filled promotional button, a vivid blue (#0066cc) for announcement bars and price text, and a single warm brown (#ac5d00) reserved for new-product labels. A solid black header bar anchors every page like a gallery lintel, and content sections breathe through generous vertical rhythm rather than tight stacking. Typography is geometric and precise (DysonFutura, a custom Futura derivative), preferring weight 300 for headlines so engineering speaks quietly. Corners stay sharp — 2px on controls, 8px on imagery — and shadows are entirely absent; surfaces layer through flat planes and 1px rules, producing the vitrine-like effect of objects placed on paper rather than stacked in 3D space.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Canvas | `#fff8e6` | `--color-cream-canvas` | Page background, hero and section canvas — the warm off-white that replaces pure white and gives the interface its gallery-mat quality |
| Paper White | `#ffffff` | `--color-paper-white` | Product card surfaces, input fields, secondary navigation bar — the brighter white that sits on top of the cream canvas |
| Charcoal Ink | `#333333` | `--color-charcoal-ink` | Primary text, headings, product names, body copy — the dominant text color across the entire interface |
| Graphite Body | `#555555` | `--color-graphite-body` | Secondary body text, descriptions, paragraph copy — a softer dark gray for long-form reading |
| Silver Mute | `#999999` | `--color-silver-mute` | Tertiary text, helper labels, placeholder text, muted icons |
| Border Gray | `#ebebeb` | `--color-border-gray` | Hairline dividers, input borders, card separators, section rules — the 1px line that defines structure without weight |
| Rule Gray | `#dadada` | `--color-rule-gray` | Slightly stronger borders for emphasis, secondary hairline dividers |
| Lintel Black | `#000000` | `--color-lintel-black` | Top header bar background, dark surface anchor — the solid black band that frames every page |
| Signal Blue | `#0066cc` | `--color-signal-blue` | Announcement bar background, price text, inline links, the brand's only chromatic interface surface — carries informational weight across the site |
| Link Blue | `#149ecc` | `--color-link-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Promotional Green | `#79b928` | `--color-promotional-green` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember Brown | `#ac5d00` | `--color-ember-brown` | Orange supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### DysonFutura — Sole typeface across the entire interface. Weight 300 for display and headings — the whisper-weight is a signature anti-convention choice; most premium brands push to 600-700 for authority, Dyson lets engineering speak quietly. Weight 400 for body, product names, and UI labels. Weight 500 reserved for button text and emphasis. The geometric Futura skeleton (perfect circles, monoline strokes) reinforces the precision-instrument brand identity. · `--font-dysonfutura`
- **Substitute:** Futura PT (closest commercial match), Avenir Next, Jost
- **Weights:** 300, 400, 500
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 28px, 32px, 36px
- **Line height:** 1.22, 1.25, 1.30, 1.33, 1.44, 1.50, 1.56, 1.67
- **Role:** Sole typeface across the entire interface. Weight 300 for display and headings — the whisper-weight is a signature anti-convention choice; most premium brands push to 600-700 for authority, Dyson lets engineering speak quietly. Weight 400 for body, product names, and UI labels. Weight 500 reserved for button text and emphasis. The geometric Futura skeleton (perfect circles, monoline strokes) reinforces the precision-instrument brand identity.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.67 | — | `--text-caption` |
| body-sm | 14px | 1.56 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.44 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 28px | 1.3 | — | `--text-heading` |
| heading-lg | 32px | 1.25 | — | `--text-heading-lg` |
| display | 36px | 1.22 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 2px |
| images | 8px |
| inputs | 2px |
| buttons | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-64px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Black Lintel Header
**Role:** Primary navigation bar anchoring every page

Full-bleed #000000 background, 48-56px height. Left: white 'dyson' wordmark in DysonFutura 16px weight 500. Right: utility links (Iniciar sesión, Iniciar sesión icon) in #ffffff DysonFutura 12-14px. Secondary row below: white #ffffff background with category links in #333333 at 14px, separated by 12-16px gaps, with a search input (white bg, 1px #ebebeb border, 2px radius) and a cart icon on the right.

### Blue Announcement Bar
**Role:** Promotional strip below the header

Full-bleed #0066cc background, 40-48px height. Centered text in #ffffff DysonFutura 14px weight 400, with an inline text link also in white. Sits between the black header and the cream content area as a strong horizontal color band.

### Editorial Hero Split
**Role:** First-screen hero section

Cream #fff8e6 canvas. Left column: headline in DysonFutura 36px weight 300, #333333, with subtext at 18px weight 400, #555555, and a filled green button below. Right column: 3-column × 2-row image grid with 8px gap between tiles, each image at 8px radius. The split ratio is approximately 1:2 (text : images).

### Filled Green Promotional Button
**Role:** Primary promotional action button

#79b928 background, #ffffff text in DysonFutura 14px weight 500, 2px border-radius, 12px vertical / 24px horizontal padding. No border, no shadow. The single chromatic button in the system — used sparingly for seasonal campaigns and product discovery actions.

### Product Card
**Role:** Individual product display in grids and lists

#ffffff background, no border, no shadow. Product image at top on white or light pastel background with 8px radius. Below: 'NUEVO' label in #ac5d00 at 12px uppercase DysonFutura, product name at 16px weight 400 #333333, price at 18px weight 400 in #0066cc, and a full-width filled green button at the bottom (#79b928, white text, 2px radius, 12px 16px padding).

### 'NUEVO' New Badge
**Role:** Novelty indicator on new products

Text-only label in #ac5d00, DysonFutura 12px weight 500, uppercase tracking. No background fill, no border, no padding — the color alone communicates 'new'.

### Price Display
**Role:** Product pricing in cards and detail views

#0066cc text, DysonFutura 18px weight 400. The only inline text that uses the brand blue — price is the most important data point and gets the color signal.

### Search Input
**Role:** Product and content search

#ffffff background, 1px #ebebeb border, 2px radius. DysonFutura 14px, placeholder text in #999999. 10px 12px padding. Magnifying glass icon in #333333 on the left. Rounded pill shape not used — stays sharp-cornered to match the system's minimal radii.

### Hairline Divider
**Role:** Section separator within content areas

1px height, #ebebeb or #dadada color, full-width within the content container. No margin — sits flush between content blocks. Replaces shadows as the structural separator.

### Category Navigation Row
**Role:** Product category links in the secondary header

Horizontal list of category names (Cuidado del cabello, Cuidado del aire, etc.) in DysonFutura 14px weight 400, #333333, separated by 12-16px gaps. No active state indicator (no underline, no color change) — the minimalist approach trusts the user to know where they are.

### Text Link / Inline Link
**Role:** Navigational and contextual links within body text

#0066cc color, no underline at rest. DysonFutura inherits the surrounding text size. Hover state shifts to #149ecc. Used for 'Ver todos los ofertas' and similar inline navigation.

## Do's and Don'ts

### Do
- Use #fff8e6 cream as the page canvas — never pure white as the base surface; the warm offset is the system's signature.
- Use DysonFutura weight 300 for all headlines and display text — the whisper-weight is a deliberate anti-convention choice.
- Keep button and badge corner radii at exactly 2px — the near-sharp corners reinforce the precision-engineering brand.
- Separate surfaces with 1px #ebebeb hairlines, not drop shadows — the design uses flat color planes, not elevation.
- Use #79b928 exclusively for filled promotional buttons, paired with white text and 2px radius.
- Anchor every page with a solid #000000 header bar — the black lintel is the structural constant across all screens.
- Use #0066cc for announcement bars, price values, and inline links — the only chromatic surface treatments in the system.

### Don't
- Don't use #ffffff as the page background — always the warm cream canvas (#fff8e6); pure white kills the gallery-mat effect.
- Don't apply drop shadows to cards, images, or buttons — surfaces stay flat; structure comes from color contrast and hairlines.
- Don't introduce a third accent color beyond blue (#0066cc) and green (#79b928) — the system is at 1% colorfulness by design.
- Don't use border-radius above 8px on any element — buttons stay at 2px, images at 8px, nothing rounder.
- Don't use font weights above 500 — the type system tops out at medium; heaviness would break the geometric lightness.
- Don't place gradient backgrounds, tinted overlays, or decorative color washes on any surface — the palette is purely flat.
- Don't use color to indicate active or selected navigation states — the system relies on spatial position, not chromatic feedback.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#fff8e6` | Page-wide background, hero and content section canvas |
| 1 | Paper White | `#ffffff` | Product cards, input fields, secondary nav bar — elevated above the cream base |
| 2 | Frost Gray | `#f8f8f8` | Subtle alternating section background, disabled surface tone |
| 3 | Lintel Black | `#000000` | Header bar, dark structural anchor |

## Elevation

The design deliberately eliminates drop shadows. Surfaces are separated by flat color contrast (cream canvas → white card) and 1px hairline dividers (#ebebeb), not by elevation. This creates a gallery-vitrine effect where products and content rest on paper-like planes rather than floating in 3D space — the visual logic of a museum display case, not a software UI.

## Imagery

Photography is the dominant visual content. Dyson uses high-end editorial photography — tight product crops on pure white backgrounds, and lifestyle portraits of models against soft pastel and neutral backdrops (dusty pink, sage, cream). The hero section is a 3×2 grid mixing lifestyle portraits with product detail shots, creating a magazine-editorial rhythm. Product card images are isolated on white — no lifestyle context, the object is the hero. There are no illustrations, no 3D renders, no abstract graphics. Icons are minimal and line-based, rendered in #333333 at 16-20px. Photography occupies roughly 50% of the hero viewport and is contained within rounded tiles (8px radius) rather than full-bleed. The treatment is consistently high-key, bright, and premium — no dark or moody photography.

## Layout

The page uses a max-width centered content area (~1200px) on a full-bleed cream (#fff8e6) canvas. The hero follows a split pattern: left third holds the headline, subtext, and promotional button; right two-thirds hold a 3-column image grid. Below the hero, sections alternate between cream and white backgrounds with 48-64px vertical gaps, using 2-column text+image layouts and 3-column product card grids. The navigation is a two-tier system: a solid black utility bar on top (account, location, links) and a white category bar below (product categories, search, cart). Content density is spacious and editorial — generous whitespace between elements, no information-dense blocks. Section dividers are 1px hairlines (#ebebeb), not colored bands or shadows.

## Agent Prompt Guide

## Quick Color Reference
- text: #333333
- background: #fff8e6
- border: #ebebeb
- accent: #0066cc
- promotional button: #79b928
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero section**: Cream #fff8e6 canvas. Headline at 36px DysonFutura weight 300, #333333, line-height 1.22. Subtext at 18px weight 400, #555555. A filled green button at 14px weight 500: #79b928 background, white text, 2px radius, 12px 24px padding. A 3×2 image grid to the right with 8px gap and 8px image radius.

2. **Product card**: #ffffff background, no border, no shadow. Product image at top (8px radius, white or pastel background). 'NUEVO' label in #ac5d00, 12px uppercase DysonFutura. Product name at 16px weight 400, #333333. Price at 18px weight 400, #0066cc. Full-width filled green button: #79b928 background, white text, 2px radius, 12px 16px padding.

3. **Navigation header**: #000000 background, full-width, 48-56px height. White 'dyson' wordmark left in DysonFutura 16px weight 500. Utility links right in #ffffff at 12-14px. Secondary row below on #ffffff with #333333 category links at 14px, 12-16px gap. Search input: white bg, 1px #ebebeb border, 2px radius, DysonFutura 14px, #999999 placeholder.

4. **Announcement bar**: Full-bleed #0066cc background, 40-48px height. Centered text in #ffffff DysonFutura 14px weight 400 with an inline white text link. Sits between the black header and the cream content area.

5. **Content section**: #fff8e6 cream background, max-width 1200px centered. Section heading at 28px DysonFutura weight 300, #333333. 1px #ebebeb hairline divider below. Two-column layout with 48px gap, text left at 16px weight 400 #555555, product image right with 8px radius.

## Similar Brands

- **Apple** — Same product-as-hero photography on neutral backgrounds, extreme color restraint, and flat surfaces without shadows
- **Bang & Olufsen** — Warm neutral canvas with premium electronics, editorial product presentation, and near-monochrome interfaces punctuated by a single accent
- **Braun** — Geometric Futura-derived typography at light weights, engineering-heritage minimalism, and near-zero corner radii on controls
- **Vitra** — Design-brand editorial product grids, generous whitespace, and the museum-vitrine approach to product presentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-canvas: #fff8e6;
  --color-paper-white: #ffffff;
  --color-charcoal-ink: #333333;
  --color-graphite-body: #555555;
  --color-silver-mute: #999999;
  --color-border-gray: #ebebeb;
  --color-rule-gray: #dadada;
  --color-lintel-black: #000000;
  --color-signal-blue: #0066cc;
  --color-link-blue: #149ecc;
  --color-promotional-green: #79b928;
  --color-ember-brown: #ac5d00;

  /* Typography — Font Families */
  --font-dysonfutura: 'DysonFutura', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 28px;
  --leading-heading: 1.3;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --text-display: 36px;
  --leading-display: 1.22;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-64px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 46.545px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 2px;
  --radius-images: 8px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-cream-canvas: #fff8e6;
  --surface-paper-white: #ffffff;
  --surface-frost-gray: #f8f8f8;
  --surface-lintel-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-canvas: #fff8e6;
  --color-paper-white: #ffffff;
  --color-charcoal-ink: #333333;
  --color-graphite-body: #555555;
  --color-silver-mute: #999999;
  --color-border-gray: #ebebeb;
  --color-rule-gray: #dadada;
  --color-lintel-black: #000000;
  --color-signal-blue: #0066cc;
  --color-link-blue: #149ecc;
  --color-promotional-green: #79b928;
  --color-ember-brown: #ac5d00;

  /* Typography */
  --font-dysonfutura: 'DysonFutura', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 28px;
  --leading-heading: 1.3;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --text-display: 36px;
  --leading-display: 1.22;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 46.545px;
}
```
