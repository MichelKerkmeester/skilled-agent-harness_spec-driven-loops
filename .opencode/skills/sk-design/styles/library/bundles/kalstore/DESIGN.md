# Kalstore® — Style Reference
> Paper atelier on a quiet morning. The interface is warm off-white, sparsely set, and lets one mustard accent and oversized editorial type do the talking.

**Theme:** light

Kalstore is a paper atelier rendered as a quiet editorial spread: warm off-white canvas, sparse generous breathing room, large-scale lifestyle photography, and one warm mustard accent that interrupts the monochrome calm like a sticky note on a drafting table. Typography is the loudest element — a single editorial sans at multiple registers, from whisper-thin 19px body copy to 140px display treatments with aggressively tight tracking. Chromatic color appears almost entirely as editorial art (the ALESAL typographic block uses a palette of terracotta, sage, cobalt, and rust) rather than functional UI, keeping the interface itself disciplined. Components are small, flat, and almost unstyled — thin hairline borders, 8px corners, 6px button padding, barely-there shadows. The overall feel is less e-commerce and more independent magazine.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#faf9f7` | `--color-paper-white` | Page canvas — warm off-white that mimics uncoated paper stock; the default surface behind everything |
| Ink | `#242424` | `--color-ink` | Primary text, icon strokes, and dominant border color. Slightly softened from pure black to sit comfortably on the warm canvas |
| Felt Gray | `#d3d3d3` | `--color-felt-gray` | Hairline dividers, card borders, list separators — the structural neutral that holds the layout together without drawing attention |
| Linen | `#edecea` | `--color-linen` | Subtle surface elevation for nav backgrounds and hover states; slightly cooler than Paper White to create depth without contrast |
| Parchment | `#e0ddd7` | `--color-parchment` | Warm-toned surface for body sections and secondary cards; introduces a faint paper-fiber warmth against the cooler Linen |
| Slate | `#727272` | `--color-slate` | Muted secondary text and subdued borders for de-emphasized content like timestamps and helper labels |
| Ash | `#8d9090` | `--color-ash` | Tertiary text and disabled-state borders; sits between Slate and Felt Gray in the neutral ladder |
| Charcoal | `#585a5a` | `--color-charcoal` | Navigation borders and medium-emphasis UI structure; a bridge between the near-black Ink and the mid-grays |
| Pure White | `#ffffff` | `--color-pure-white` | Badge fills, icon backgrounds, and the highest surface elevation — used sparingly to lift elements above Linen and Parchment |
| Mustard | `#f1ba35` | `--color-mustard` | Primary action color — CTA buttons, nav accents, and badge highlights. A warm sunlit yellow that reads as a sticky-note moment against the monochrome layout |
| Espresso | `#30250b` | `--color-espresso` | Dark accent paired with Mustard on badges and nav — provides a near-black complement that makes the yellow pop without using pure black |
| Terracotta | `#d26c46` | `--color-terracotta` | Editorial accent — appears in the typographic art palette and decorative product imagery. Rust-orange warmth that belongs in illustrations, not buttons |
| Sage | `#458e71` | `--color-sage` | Editorial accent — a muted forest green used in the typographic art palette. Decorative, not functional |
| Cobalt | `#3b59a3` | `--color-cobalt` | Editorial accent — deep ultramarine from the typographic art palette. The strongest chromatic statement in the decorative system |
| Rust | `#6c3c3c` | `--color-rust` | Editorial accent — dark brick red from the typographic art palette, echoing the warmth of Terracotta but grounded |
| Sky Dust | `#90abc8` | `--color-sky-dust` | Editorial accent — a washed, chalky blue used in the typographic art palette. The lightest chromatic in the decorative system |

## Tokens — Typography

### ABCDiatype — The only typeface. A neo-grotesque editorial sans used at every register — 19px body copy, 25px section headings, and dramatic 71–140px display treatments with tight tracking. The wide weight range (400–500) keeps the system monovariational; hierarchy comes from size, not weight contrast. · `--font-abcdiatype`
- **Substitute:** Inter, Neue Haas Grotesk, or Söhne
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 19, 21, 22, 25, 71, 82, 140
- **Line height:** 0.93–1.40
- **Letter spacing:** Tight tracking at display sizes (-0.04em at 140px, -0.03em at 71–82px, -0.02em at 21–25px), nearly normal at body sizes, wide tracking (0.1em) at 12px likely for uppercase labels and badges
- **OpenType features:** `Consider 'tnum' for tabular price alignment and 'ss01' if the custom font includes alternate glyphs`
- **Role:** The only typeface. A neo-grotesque editorial sans used at every register — 19px body copy, 25px section headings, and dramatic 71–140px display treatments with tight tracking. The wide weight range (400–500) keeps the system monovariational; hierarchy comes from size, not weight contrast.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 1.2px | `--text-caption` |
| body-sm | 14px | 1.3 | — | `--text-body-sm` |
| body | 16px | 1.35 | — | `--text-body` |
| subheading | 19px | 1.3 | — | `--text-subheading` |
| heading-sm | 21px | 1.25 | -0.42px | `--text-heading-sm` |
| heading-lg | 25px | 1.2 | -0.5px | `--text-heading-lg` |
| display | 71px | 1 | -2.13px | `--text-display` |
| display-lg | 82px | 0.95 | -2.46px | `--text-display-lg` |
| display-xl | 140px | 0.93 | -5.6px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 4px |
| badges | 4px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.01) 0px 24px 10px 0px, rgba(0, 0, 0, 0.05...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 12px
- **Element gap:** 10px

## Components

### Primary CTA Button (Mustard)
**Role:** Filled action button for purchases, subscriptions, and key conversions

Mustard (#f1ba35) background, Ink (#242424) text, ABCDiatype weight 500 at 14px, 8px corner radius, 6px horizontal × 8px vertical padding, 1px Ink border for definition. Compact, almost link-sized — this button whispers rather than shouts, relying on the yellow hue to draw the eye.

### Ghost Navigation Button
**Role:** Secondary navigation and text-style links

No background, Ink (#242424) text, 4–6px padding, no border. Inherits link underline behavior on hover. Sits inline with navigation items as the default interactive element.

### Product Card
**Role:** Individual product display in grids and featured sections

White or Paper White (#faf9f7) surface, 8px corner radius, 1px Felt Gray (#d3d3d3) border, 12px internal padding. Product image fills the card top, title in ABCDiatype weight 400 at 16px Ink, price at 14px Slate (#727272). Optional 'Sold out' badge in the top-left corner. No shadow — the hairline border does all the structural work.

### Sold Out Badge
**Role:** Status indicator for unavailable products

Mustard (#f1ba35) background, Ink (#242424) text, ABCDiatype weight 500 at 12px with 0.1em tracking (likely uppercase), 4px corner radius, 4px padding. A small rectangular tag anchored to the top-left of the product card.

### Typographic Art Block
**Role:** Full-bleed decorative section using stacked chromatic letterforms

A grid of oversized letterforms (the ALESAL pattern) rendered in the editorial accent palette: Terracotta (#d26c46), Sage (#458e71), Cobalt (#3b59a3), Rust (#6c3c3c), and Sky Dust (#90abc8) on a deep maroon or dark background. Letterforms are tightly stacked, creating a textile-like pattern. This is the only place chromatic color appears at scale — it functions as art, not UI.

### Newsletter Popup
**Role:** Email capture overlay triggered after page interaction

Dark surface (Espresso #30250b or near-black), Pure White (#ffffff) text, Mustard (#f1ba35) CTA button. ABCDiatype 19px headline, 14px body, 12px fine print. 8px input radius with 1px Felt Gray border. Fixed bottom-right with close (×) in the top-right corner. This is the most visually dense component — it's the only place dark surfaces and colored buttons coexist.

### Sticky Navigation Bar
**Role:** Top-level site navigation that persists on scroll

White or Linen (#edecea) background, 1px Felt Gray bottom border, ABCDiatype 14px weight 500 nav items in Ink. Logo left, nav center, icons (search, account, cart) right. Cart icon may carry a Mustard dot indicator. Height approximately 56–64px.

### Price Display
**Role:** Product pricing with optional original/sale price strikethrough

ABCDiaype weight 400 at 14px, Ink for current price, Slate (#727272) with strikethrough for original price. Compact inline layout — prices sit close together with minimal gap (4–6px) to emphasize the sale.

### Hero Lifestyle Image
**Role:** Full-bleed editorial photography in the primary hero section

Large lifestyle photograph (people in warm interior settings, interacting with paper products) filling the left half of the hero split. No overlay text or chrome — the image is the content. Aspect ratio approximately 4:5 or 3:4, sharp corners, no border.

### Sale Banner Section
**Role:** Promotional call-to-action band with headline and CTA

Parchment (#e0ddd7) or Paper White background, centered ABCDiatype display-size headline (71–82px) in Ink with -0.03em tracking, Mustard CTA button below. Generous vertical padding (40–64px). Functions as a mid-page editorial interlude.

### Product Detail Card (Calendar)
**Role:** Featured product showcase with large image and metadata

Split layout: large product image left, product metadata right. Title at 21–25px weight 500 Ink, 'Wall calendar' descriptor at 16px weight 400, color option ('White') at 14px, price at 16px Ink. No visible 'Add to cart' button — purchase flow may be product-page linked.

### Email Input Field
**Role:** Single-line text input for newsletter and form capture

Transparent or Paper White (#faf9f7) background, 1px Felt Gray (#d3d3d3) border, 8px corner radius, ABCDiatype 14px weight 400 placeholder text in Slate (#727272), 10–12px vertical padding. No visible focus ring in the raw data — the interaction is understated.

## Do's and Don'ts

### Do
- Use #f1ba35 Mustard exclusively for filled action buttons — it is the only chromatic that functions as a CTA in this system.
- Set display type at 71–140px ABCDiatype with -0.04em to -0.02em letter-spacing for editorial impact; the tight tracking is what makes the oversized type feel intentional rather than bloated.
- Use 8px border-radius for cards, buttons, and inputs; reserve 4px for badges and icon containers.
- Use 1px #d3d3d3 Felt Gray borders for structural definition; avoid using box-shadow as the primary separator.
- Set body text at 19px ABCDiatype weight 400 with 1.30 line-height — the 19px body size is larger than typical e-commerce (usually 14–16px) and signals editorial intent.
- Use the chromatic accent palette (#d26c46, #458e71, #3b59a3, #6c3c3c, #90abc8) only in editorial art blocks and illustrations — never in functional UI elements like buttons, links, or status indicators.
- Maintain 64px minimum section gaps to preserve the spacious, magazine-like reading rhythm.

### Don't
- Don't use chromatic colors for functional UI — no green for success, no red for error, no blue for info. The system is monochrome with one warm accent.
- Don't apply box-shadows with opacity above 10% — the elevation philosophy is paper-lift, not digital pop.
- Don't use bold weights (600+) — the system maxes out at weight 500; hierarchy comes from size, not weight contrast.
- Don't use pure black (#000000) for text or backgrounds — use #242424 Ink to maintain warmth on the paper-tone canvas.
- Don't add gradients — the raw data shows zero gradient usage; the system is entirely flat surfaces.
- Don't use button padding larger than 8px vertical — the compact 6×8px button size is a signature; larger padding would break the restrained feel.
- Don't place Mustard (#f1ba35) on large filled surfaces — it works as a button fill or badge, not as a section background.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#faf9f7` | Page canvas — warm off-white base |
| 1 | Linen | `#edecea` | Nav background, subtle elevation |
| 2 | Parchment | `#e0ddd7` | Body section backgrounds, secondary cards |
| 3 | Pure White | `#ffffff` | Badge fills, icon surfaces, highest elevation |

## Elevation

- **Product Card / Elevated Surface:** `rgba(0, 0, 0, 0.01) 0px 24px 10px 0px, rgba(0, 0, 0, 0.05) 0px 13px 8px 0px, rgba(0, 0, 0, 0.09) 0px 6px 6px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px`

## Imagery

Editorial lifestyle photography dominates: warm-toned interior scenes with people interacting with paper products (calendars, notebooks) in domestic settings. Lighting is natural and soft, color palette is warm and slightly desaturated. Images are full-bleed in hero sections and contained with 8px radius in product cards. A single large-scale typographic art block (the ALESAL pattern) serves as a decorative interlude, using stacked chromatic letterforms in a grid pattern on a dark ground. No product-only white-background shots — everything is contextualized in lived-in spaces.

## Layout

Max-width ~1200px centered content, but hero and art sections break to full-bleed. Hero is a split: large lifestyle image left (60%), typographic art block right (40%). Below the fold, the layout alternates between contained product grids and full-bleed editorial sections. Product cards sit in a 2-column layout in the visible screenshots, with generous 64px section gaps. Navigation is a sticky top bar. The page reads top-to-bottom as a magazine spread: hero image → art block → product feature → sale banner → continuation.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #faf9f7 (Paper White)
- Text/Border: #242424 (Ink)
- Hairline: #d3d3d3 (Felt Gray)
- Surface: #edecea (Linen)
- primary action: #f1ba35 (filled action)
- Dark surface: #30250b (Espresso)

**Example Component Prompts**
1. Create a product card: #faf9f7 background, 1px #d3d3d3 border, 8px radius, 12px padding. Product image fills top. Title in ABCDiatype 16px weight 400 #242424. Price in ABCDiatype 14px #727272. Optional Mustard (#f1ba35) sold-out badge top-left with 4px radius and 12px text.
2. Create a hero section: full-bleed lifestyle photograph left (60% width), dark typographic art block right (40% width) with stacked chromatic letterforms in #d26c46, #458e71, #3b59a3, #6c3c3c, #90abc8. No overlay text — the image is the content.
3. Create a Primary Action Button: #f1ba35 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
4. Create a newsletter popup: #30250b dark surface, #ffffff text, 19px ABCDiatype headline, 14px body copy, 12px fine print. Email input with #faf9f7 background and 8px radius. Mustard (#f1ba35) subscribe button. Fixed bottom-right with × close in top-right.

## Similar Brands

- **Muji** — Same warm off-white canvas, restrained typography, single warm accent color, and editorial product photography approach
- **Papier** — Identical paper-goods editorial aesthetic, large lifestyle photography, generous spacing, and minimal UI chrome
- **Everlane** — Same clean monochrome layout with warm neutrals, small ghost-style CTAs, and hairline-border product cards
- **Aesop** — Same editorial restraint with generous whitespace, single warm accent, and typography that does the heavy lifting
- **Mociun** — Same indie-magazine product presentation with full-bleed lifestyle imagery and sparse, typographic UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #faf9f7;
  --color-ink: #242424;
  --color-felt-gray: #d3d3d3;
  --color-linen: #edecea;
  --color-parchment: #e0ddd7;
  --color-slate: #727272;
  --color-ash: #8d9090;
  --color-charcoal: #585a5a;
  --color-pure-white: #ffffff;
  --color-mustard: #f1ba35;
  --color-espresso: #30250b;
  --color-terracotta: #d26c46;
  --color-sage: #458e71;
  --color-cobalt: #3b59a3;
  --color-rust: #6c3c3c;
  --color-sky-dust: #90abc8;

  /* Typography — Font Families */
  --font-abcdiatype: 'ABCDiatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.35;
  --text-subheading: 19px;
  --leading-subheading: 1.3;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.42px;
  --text-heading-lg: 25px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.5px;
  --text-display: 71px;
  --leading-display: 1;
  --tracking-display: -2.13px;
  --text-display-lg: 82px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -2.46px;
  --text-display-xl: 140px;
  --leading-display-xl: 0.93;
  --tracking-display-xl: -5.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 12px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 4px;
  --radius-badges: 4px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.01) 0px 24px 10px 0px, rgba(0, 0, 0, 0.05) 0px 13px 8px 0px, rgba(0, 0, 0, 0.09) 0px 6px 6px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;

  /* Surfaces */
  --surface-paper-white: #faf9f7;
  --surface-linen: #edecea;
  --surface-parchment: #e0ddd7;
  --surface-pure-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #faf9f7;
  --color-ink: #242424;
  --color-felt-gray: #d3d3d3;
  --color-linen: #edecea;
  --color-parchment: #e0ddd7;
  --color-slate: #727272;
  --color-ash: #8d9090;
  --color-charcoal: #585a5a;
  --color-pure-white: #ffffff;
  --color-mustard: #f1ba35;
  --color-espresso: #30250b;
  --color-terracotta: #d26c46;
  --color-sage: #458e71;
  --color-cobalt: #3b59a3;
  --color-rust: #6c3c3c;
  --color-sky-dust: #90abc8;

  /* Typography */
  --font-abcdiatype: 'ABCDiatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.35;
  --text-subheading: 19px;
  --leading-subheading: 1.3;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.42px;
  --text-heading-lg: 25px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.5px;
  --text-display: 71px;
  --leading-display: 1;
  --tracking-display: -2.13px;
  --text-display-lg: 82px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -2.46px;
  --text-display-xl: 140px;
  --leading-display-xl: 0.93;
  --tracking-display-xl: -5.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.01) 0px 24px 10px 0px, rgba(0, 0, 0, 0.05) 0px 13px 8px 0px, rgba(0, 0, 0, 0.09) 0px 6px 6px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
}
```
