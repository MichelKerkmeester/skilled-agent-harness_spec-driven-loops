# Fallen Grape — Style Reference
> Sun-drenched vineyard at golden hour. Warm cream paper, walnut ink, terracotta warmth — a wine label breathed into a full interface.

**Theme:** light

Fallen Grape uses a sun-drenched, vineyard-at-golden-hour language: warm cream canvases, deep walnut typography, and peach-terracotta accents that feel pressed from ripe grapes rather than screen-painted. The interface stays nearly monochromatic in warm neutrals, letting product photography and a single sage-green accent carry visual variety. Hairline brown borders separate regions instead of shadows or elevation — surfaces are flat and paper-like, evoking a hand-pressed wine label. Typography is a deliberate two-voice system: a humanist serif (Romie) for brand and editorial moments, paired with a condensed utilitarian sans (Arial Narrow) for functional text, creating a tension between craft and clarity that defines the brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vintage Cream | `#ece0d2` | `--color-vintage-cream` | Page canvas, section backgrounds, footer surface — the warm paper tone that grounds all content and sets the sun-faded, natural mood |
| Bone White | `#f3f3f3` | `--color-bone-white` | Card surfaces, navigation background — a cooler off-white that lifts cards above the cream canvas without harsh contrast |
| Walnut Ink | `#573d21` | `--color-walnut-ink` | Primary text, headings, body copy, link color — deep brown that reads as ink on aged paper rather than digital black |
| Saddle Brown | `#7c664d` | `--color-saddle-brown` | Hairline borders (cards, nav, body dividers), secondary text, muted UI lines — the structural outline color that replaces shadows |
| Peach Sand | `#e1c6ab` | `--color-peach-sand` | Outlined action border, button fill for shop actions — warm neutral peach for CTA buttons and soft fills |
| Terracotta Glow | `#e3a36e` | `--color-terracotta-glow` | Filled action buttons, link highlights, secondary call-to-action fill — saturated peach-orange that signals action and energy |
| Apricot Whisper | `#efa164` | `--color-apricot-whisper` | Top announcement bar, promotional highlights, hover state for terracotta buttons — the warmest orange, used sparingly for urgency and promos |
| Vine Sage | `#d8deb7` | `--color-vine-sage` | Decorative heading accent, botanical illustration tint — the only green in the system, evoking grape leaves and organic origin |

## Tokens — Typography

### Romie — Brand wordmark, hero display headlines, section headings, editorial body — a humanist serif that brings warmth and craft authority. The weight 400 at 48-64px sizes is the signature display voice; 700 is used for emphasis in smaller text. Free substitute: Fraunces, Lora, or DM Serif Display · `--font-romie`
- **Substitute:** Fraunces
- **Weights:** 400, 700
- **Sizes:** 12px, 15px, 20px, 48px, 64px
- **Line height:** 1.20-1.70
- **Letter spacing:** 0.0300em
- **Role:** Brand wordmark, hero display headlines, section headings, editorial body — a humanist serif that brings warmth and craft authority. The weight 400 at 48-64px sizes is the signature display voice; 700 is used for emphasis in smaller text. Free substitute: Fraunces, Lora, or DM Serif Display

### Arial Narrow — Body copy, navigation items, button labels, product titles, utility text — a condensed utilitarian sans that creates deliberate tension with the Romie serif. Uppercase with widened tracking (0.0630em) for nav and button labels gives a vintage label feel. Free substitute: Barlow Condensed, Oswald, or Roboto Condensed · `--font-arial-narrow`
- **Substitute:** Barlow Condensed
- **Weights:** 400, 700
- **Sizes:** 13px, 14px, 16px, 18px, 20px, 24px, 48px
- **Line height:** 1.20-1.80
- **Letter spacing:** 0.0300em-0.0630em
- **Role:** Body copy, navigation items, button labels, product titles, utility text — a condensed utilitarian sans that creates deliberate tension with the Romie serif. Uppercase with widened tracking (0.0630em) for nav and button labels gives a vintage label feel. Free substitute: Barlow Condensed, Oswald, or Roboto Condensed

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.5
- **Letter spacing:** 0.03
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | 0.36px | `--text-caption` |
| body-sm | 14px | 1.7 | 0.42px | `--text-body-sm` |
| body | 16px | 1.7 | 0.48px | `--text-body` |
| subheading | 20px | 1.5 | 0.6px | `--text-subheading` |
| heading-sm | 24px | 1.3 | 0.72px | `--text-heading-sm` |
| heading | 48px | 1.2 | 1.44px | `--text-heading` |
| display | 64px | 1.2 | 1.92px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 110 | 110px | `--spacing-110` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Announcement Bar
**Role:** Top promotional banner

Full-width strip at page top with Apricot Whisper (#efa164) or Terracotta Glow (#e3a36e) background, centered text in Walnut Ink (#573d21), Arial Narrow 12-13px uppercase with 0.0430em tracking. Padding 5px top/bottom. No border, no radius.

### Header Navigation
**Role:** Primary site navigation

Bone White (#f3f3f3) background with 1px Saddle Brown (#7c664d) bottom border. Left-aligned nav links (SHOP ALL with dropdown caret, SHOP MERCH, ABOUT US) and right-aligned (LOGIN, CART) in Arial Narrow 13-14px uppercase, 0.0430em tracking, Walnut Ink color. Centered Romie brand wordmark sits between groups, 20px size.

### Hero Illustration Banner
**Role:** Full-bleed hero with illustrated scene

Full-width illustrated landscape scene with peach sky gradient, grape vine clusters, butterfly motifs, and centered wine bottle silhouette. Headline 'It's natural' in Romie 48-64px weight 400, Walnut Ink, centered. CTA button overlaid on illustration. No border or card treatment — the illustration IS the hero.

### Shop All CTA Button
**Role:** Primary call-to-action

Rectangular button (0px radius) with Peach Sand (#e1c6ab) or Terracotta Glow (#e3a36e) background, 1px Walnut Ink (#573d21) border, padding 10px 24px. Text in Arial Narrow 13-14px uppercase, 0.0430em tracking, Walnut Ink. No shadow, no hover lift — warmth comes from color.

### Section Headline
**Role:** Editorial section titles

Romie weight 400 at 48px, Walnut Ink (#573d21), centered, with generous line-height 1.20. No underline or decorative element — the serif itself carries authority. Used for 'The 3-Pack', product section titles.

### Product Card
**Role:** Merchandise and wine product display

Bone White (#f3f3f3) background, 1px Saddle Brown (#7c664d) border, 0px radius. Image fills top portion edge-to-edge. Product title in Arial Narrow 14-16px uppercase bold below image. Price in Arial Narrow 13-14px, Walnut Ink, directly below title. Padding 17px sides. No shadow, no hover elevation.

### Product Grid Carousel
**Role:** 3-column product showcase with pagination

3-column grid of Product Cards with 24px gap. Left/right arrow navigation controls in Saddle Brown. Pagination dots below grid: active dot in Terracotta Glow (#e3a36e), inactive in Saddle Brown outline. Carousel arrow buttons are 36x36px, borderless, centered vertically.

### Editorial Text Block
**Role:** Long-form brand storytelling content

Romie 20px weight 400, Walnut Ink, centered text with 1.70 line-height for readability. Used for 'Natural wine made with organically farmed grapes...' statements. No background, no border — text floats on cream canvas with generous vertical breathing room.

### Two-Column About Section
**Role:** Brand story with image and text

Two-column layout: left column contains a rectangular image (edge-to-edge, 0px radius), right column contains 'ABOUT US' heading in Arial Narrow 20px bold uppercase with Saddle Brown border-bottom, followed by body text in Romie 15-16px, Walnut Ink. Columns separated by 48px gap.

### Navigation Dropdown
**Role:** SHOP ALL category menu

Dropdown panel appears below SHOP ALL nav item. Bone White background, 1px Saddle Brown border, 0px radius. Menu items in Arial Narrow 14px, Walnut Ink, with 8-10px vertical padding. No shadow — the border defines the edge.

### Footer
**Role:** Site footer with links and info

Vintage Cream (#ece0d2) background extending full-width. Contains centered text blocks in Romie 12-15px, Walnut Ink. Minimal — likely newsletter signup, social links, legal text. No heavy visual treatment.

## Do's and Don'ts

### Do
- Use Romie (serif) for all display headlines, brand wordmark, and editorial body text at 20px and above
- Use Arial Narrow (condensed sans) for all functional UI: navigation, buttons, product titles, utility text — always uppercase with 0.0430em-0.0630em tracking
- Set all borders to 1px solid Saddle Brown (#7c664d) — this is the primary structural separator, never use shadows for elevation
- Maintain 0px border-radius on all components — the sharp edges reinforce the wine label and hand-pressed paper aesthetic
- Use Peach Sand (#e1c6ab) or Terracotta Glow (#e3a36e) for button backgrounds with Walnut Ink text and 1px Walnut Ink border
- Keep the canvas at Vintage Cream (#ece0d2) for most full-bleed sections; reserve Bone White (#f3f3f3) for cards and navigation to create subtle layering
- Use Vine Sage (#d8deb7) sparingly — only for decorative heading accents or botanical illustration tints, never for interactive elements

### Don't
- Do not add box-shadows or drop-shadows to any component — this design is intentionally flat and paper-like
- Do not use rounded corners (border-radius > 0px) on cards, buttons, or images — the sharp 0px edges are signature
- Do not use cool grays, blues, or pure white (#ffffff) for backgrounds — the entire palette is warm earth tones
- Do not use Arial Narrow for display headlines or large editorial text — reserve it for functional/utility text under 24px
- Do not use the condensed sans for body paragraphs longer than 2 lines — switch to Romie for readability
- Do not apply Vine Sage (#d8deb7) to buttons, links, or interactive states — it is decorative only
- Do not introduce bright primary colors (saturated blues, greens, purples) — all accents must stay in the warm peach/terracotta family

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ece0d2` | Base page background, footer, full-bleed sections |
| 1 | Card | `#f3f3f3` | Product cards, navigation bar, elevated content blocks |
| 2 | Action Surface | `#e1c6ab` | Button fills, interactive highlights |

## Elevation

This design deliberately avoids shadows. Separation between surfaces is achieved through hairline Saddle Brown (#7c664d) borders, warm tonal contrast between cream and bone-white, and generous whitespace. The flat, paper-like quality reinforces the natural, hand-crafted wine label metaphor.

## Imagery

Product photography is warm-toned, sunlit, and tightly cropped on the object — wine bottles in earthy settings, hats on natural surfaces, clothing against botanical backdrops. The hero features a custom illustrated landscape with watercolor-style grape vines, butterflies, rolling hills, and a centered bottle silhouette in peach and sage tones. Photography style is organic and lifestyle-adjacent but not staged — products appear in their natural context (wood, leaves, fabric). All images use 0px border-radius for sharp edges. The visual density is moderate: one large hero illustration, then product photography in grid format, then editorial text sections. Iconography is minimal — the illustrations carry the visual storytelling rather than UI icons.

## Layout

Full-width sections with centered max-width 1200px content containers. The hero is full-bleed illustrated landscape with centered headline and button overlay. Below the hero, content alternates between centered editorial text blocks and 3-column product card grids. The 3-pack section uses a 3-column image grid followed by a product carousel with arrow navigation. The about section uses a 2-column asymmetric layout (image left, text right). Vertical rhythm is generous with 80px section gaps. Navigation is a top bar with left/center/right content zones. The overall page flows top-to-bottom in a single column with no sidebar. Dense information is avoided — the design breathes with whitespace and large type.

## Agent Prompt Guide

## Quick Color Reference
- Primary text: #573d21 (Walnut Ink)
- Background (canvas): #ece0d2 (Vintage Cream)
- Card surface: #f3f3f3 (Bone White)
- Border: #7c664d (Saddle Brown)
- Accent (decorative/botanical): #d8deb7 (Vine Sage)
- primary action: #e1c6ab (filled action)

## Example Component Prompts

1. **Create a product card**: Bone White (#f3f3f3) background, 1px solid #7c664d border, 0px radius. Product image fills top edge-to-edge. Product title below in Arial Narrow 16px bold uppercase, #573d21. Price in Arial Narrow 14px, #573d21. 17px horizontal padding on text area. No shadow.

2. **Create a hero headline**: Romie weight 400, 64px, #573d21, letter-spacing 1.92px, centered. Line-height 1.20. No background, no border. Sits directly on Vintage Cream (#ece0d2) canvas.

3. **Create a Shop All button**: 0px radius, background #e1c6ab, 1px solid #573d21 border, padding 10px 24px. Text: 'SHOP ALL' in Arial Narrow 13px bold uppercase, #573d21, letter-spacing 0.559px. No shadow, no hover transform.

4. **Create a navigation bar**: #f3f3f3 background, 1px solid #7c664d bottom border. Nav items left-aligned: 'SHOP ALL', 'SHOP MERCH', 'ABOUT US' in Arial Narrow 13px uppercase, #573d21, letter-spacing 0.559px. Brand wordmark centered in Romie 20px. Right-aligned: 'LOGIN', 'CART' in same style. Padding 17px vertical.

5. **Create an about section**: Two columns with 48px gap. Left column: full-bleed image (0px radius, no border). Right column: 'ABOUT US' heading in Arial Narrow 20px bold uppercase, #573d21, with 1px solid #7c664d border-bottom. Body text in Romie 16px weight 400, #573d21, line-height 1.70.

## Similar Brands

- **Brightland** — Same warm cream canvas, brown/terracotta accent palette, and humanist serif + condensed sans typography pairing for an artisan food/bev brand
- **B Corp Wine Brands (e.g., Folk Machine)** — Similar earth-tone palette, vintage label typography with condensed sans uppercase, and 0px-radius sharp product photography grids
- **Cote&Ciel** — Same warm neutral background, brown text on cream, minimal flat design with hairline borders instead of shadows, serif/sans typographic contrast
- **Toast (tabeo)** — Identical flat aesthetic with warm paper-tone backgrounds, brown text, and borderless/shadowless component design that feels printed rather than digital

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vintage-cream: #ece0d2;
  --color-bone-white: #f3f3f3;
  --color-walnut-ink: #573d21;
  --color-saddle-brown: #7c664d;
  --color-peach-sand: #e1c6ab;
  --color-terracotta-glow: #e3a36e;
  --color-apricot-whisper: #efa164;
  --color-vine-sage: #d8deb7;

  /* Typography — Font Families */
  --font-romie: 'Romie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial-narrow: 'Arial Narrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.7;
  --tracking-body-sm: 0.42px;
  --text-body: 16px;
  --leading-body: 1.7;
  --tracking-body: 0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.72px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: 1.44px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: 1.92px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-110: 110px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ece0d2;
  --surface-card: #f3f3f3;
  --surface-action-surface: #e1c6ab;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vintage-cream: #ece0d2;
  --color-bone-white: #f3f3f3;
  --color-walnut-ink: #573d21;
  --color-saddle-brown: #7c664d;
  --color-peach-sand: #e1c6ab;
  --color-terracotta-glow: #e3a36e;
  --color-apricot-whisper: #efa164;
  --color-vine-sage: #d8deb7;

  /* Typography */
  --font-romie: 'Romie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial-narrow: 'Arial Narrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.7;
  --tracking-body-sm: 0.42px;
  --text-body: 16px;
  --leading-body: 1.7;
  --tracking-body: 0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.72px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: 1.44px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: 1.92px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-110: 110px;
}
```
