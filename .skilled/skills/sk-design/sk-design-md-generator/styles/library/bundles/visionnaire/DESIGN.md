# VISIONNAIRE — Style Reference
> Editorial streetwear gallery on bone-white. The brand behaves like a printed lookbook: flat white canvas, sharp black ink, and a single warm cream panel used as a colour-block stage for product or wordmark.

**Theme:** light

VISIONNAIRE is an editorial streetwear shop rendered as a gallery on bone-white: large-format photography, heavy uppercase tracking, and a stripped-down achromatic palette that lets garment prints and color-block hero panels do the visual work. The interface avoids chrome — no shadows, no rounded card stacks, no gradient washes — relying on hard edges, hairline rules, and a single warm cream (#f7f5e8) to break the black-on-white monotony. Pill buttons (50px radius) and generous letter-spacing on every label give the system a fashion-magazine cadence rather than a retail-grid feel. Product tiles are dense and uniform (4 across), prioritising catalogue breadth over white-space breathing room, and the entire chrome reads as uppercase, tracked, and slightly shouted — like a runway programme.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, product card backgrounds, modal surfaces — the base everything sits on |
| Vellum Cream | `#f7f5e8` | `--color-vellum-cream` | Warm off-white used for color-block hero panels, editorial sections, and the newsletter module background — the only chromatic surface in the system |
| Charcoal | `#231f20` | `--color-charcoal` | Near-black for body copy on white and cream surfaces — slightly softer than pure obsidian, preserving AAA contrast on the warm cream |
| Pewter | `#888888` | `--color-pewter` | Muted icon strokes, separators, and secondary graphic details. |
| Dahlen Rust | `#b94e3a` | `--color-dahlen-rust` | Supporting palette color for small decorative accents when the core palette needs contrast. |

## Tokens — Typography

### PP Neue Montreal — The sole typeface across the entire site. All UI labels are uppercase, weight 500, with generous tracking — the fashion-magazine signature. Headings and display sizes use weight 700 with tightened tracking for editorial weight · `--font-pp-neue-montreal`
- **Substitute:** Inter (500/700) with letter-spacing manually applied, or Space Grotesk (500/700)
- **Weights:** 500
- **Sizes:** 8px, 10px, 11px, 12px, 14px, 15px, 18px, 21px, 24px, 30px, 33px, 45px
- **Line height:** 1.15-2.78
- **Letter spacing:** 0.016em to 0.10em — tracking is INVERSE to size: smallest text (8px) gets the widest tracking (0.10em), display (45px) gets the tightest (0.016em)
- **Role:** The sole typeface across the entire site. All UI labels are uppercase, weight 500, with generous tracking — the fashion-magazine signature. Headings and display sizes use weight 700 with tightened tracking for editorial weight

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 1px | `--text-caption` |
| body | 14px | 1.5 | 0.4px | `--text-body` |
| subheading | 18px | 1.3 | 0.5px | `--text-subheading` |
| heading-sm | 21px | 1.2 | 0.34px | `--text-heading-sm` |
| heading | 24px | 1.2 | 0.38px | `--text-heading` |
| heading-lg | 33px | 1.15 | 0.53px | `--text-heading-lg` |
| display | 45px | 1.15 | 0.72px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 23 | 23px | `--spacing-23` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 70 | 70px | `--spacing-70` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 50px |
| cards | 50px |
| buttons | 50px |
| navLinks | 40px |
| productImages | 15px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 30-35px
- **Card padding:** 20px
- **Element gap:** 4px

## Components

### Announcement Marquee Bar
**Role:** Top scrolling promotional bar

Full-bleed black background (#000000), white uppercase text at 12px weight 500, letter-spacing 0.023em, 2px vertical padding. Text repeats horizontally with CSS marquee animation. Content: shipping/promo messages in French.

### Main Navigation Header
**Role:** Primary site navigation

White background, centered. VISIONNAIRE® logo at far left in 14px weight 700 uppercase with 0.064em tracking. Nav links (NOUVEAUTÉS, SHOP, COLLECTIONS, ARCHIVES) in 14px weight 500 uppercase, 25px horizontal spacing between items, 0.058em tracking. Cart icon at far right with 0-1 count badge. No dropdown menus visible — flat horizontal nav only.

### Split Editorial Hero
**Role:** First-screen brand/collection statement

50/50 split. Left half: full-bleed lifestyle photograph (model wearing product against a wall). Right half: solid Vellum Cream (#f7f5e8) panel with centered brand wordmark — VISIONNAIRE® in 21px weight 500 dark, 'DAHLEN' in 45px weight 700 Dahlen Rust (#b94e3a), 'ART CLUB' in 12px weight 500 tracked. 'VOIR' pill button (50px radius) overlaid on both halves. No gradient, no overlay — hard edge between photo and color block.

### VOIR Pill Button
**Role:** Primary call-to-action on hero and collection tiles

50px border-radius (fully rounded). Two variants: (1) Outlined ghost — 1px #000000 border, transparent fill, 14px weight 500 uppercase text in black, letter-spacing 0.058em, 20px horizontal / 10px vertical padding. (2) Filled — #000000 background, white text, identical dimensions. Always uppercase, always tracked.

### Product Grid Card
**Role:** Catalogue tile in product listing

White background, no border, no shadow. Product image with 15px border-radius at top. Below image: product name in 12px weight 500 uppercase, 0.047em tracking, centered. Size selector row (XXS XXS S M L XL XXL) in 10px weight 500 uppercase, 0.039em tracking, with hover/active size underlined. Price in 12px weight 500 below sizes, centered. 20px internal padding. 4-column grid with 30px gap between cards.

### Size Selector
**Role:** Inline size picker on product cards

Horizontal row of size codes (XXS through XXL) in 10px weight 500 uppercase, 0.039em tracking, 4-5px gaps between codes. Default state: Pewter (#888888). Active/selected: Obsidian (#000000) with underline. No dropdown — all sizes visible inline.

### Collection Banner
**Role:** Section divider/collection promo block

Full-width Vellum Cream (#f7f5e8) background band. Collection title in 33px weight 700 uppercase, 0.053em tracking, centered. 'ÉPUISÉ' (sold out) state shown as white pill badge with 50px radius overlaying the product image, 12px weight 500 uppercase, 0.047em tracking.

### ÉPUISÉ Sold-Out Badge
**Role:** Status indicator for unavailable products

White background (#ffffff), black text in 12px weight 500 uppercase, 50px border-radius pill, centered over the product image. 20px horizontal / 10px vertical padding. High-contrast pill on top of product photography.

### Newsletter Modal
**Role:** Email capture overlay

White background card, no border, no shadow. 1px hairline (#000000) divider between header and body. 'VISIONNAIRE CLUB®' header in 14px weight 700 uppercase, Dahlen Rust (#b94e3a). 'ABONNEZ-VOUS À NOTRE NEWSLETTER' in 18px weight 500 uppercase, black. Email input: 1px #000000 bottom border only, 15px horizontal padding, no visible fill. 'VALIDER' link in 12px weight 500 uppercase as a text action, black, underlined on hover. Close (×) icon top-right in 14px.

### Cookie Consent Bar
**Role:** Bottom-of-page legal notice

Full-width black (#000000) bar, white text at 11px weight 500, 0.033em tracking. Single line of disclaimer text, left-aligned. No visible accept/dismiss button in the data — text-only compliance strip.

### Product Image Thumbnail
**Role:** Visual element within product card

15px border-radius on the product photograph. No border, no shadow, no overlay. Image fills the card width. Square or 4:5 aspect ratio for garment-on-white photography. Background of photo is pure white or neutral grey — no lifestyle context within the grid.

## Do's and Don'ts

### Do
- Use PP Neue Montreal (or Inter/Space Grotesk substitute) at weight 500 for all UI labels and weight 700 for headings — never mix in a second typeface family
- Set all UI text to uppercase with 0.04-0.10em letter-spacing — the tracking IS the brand voice
- Use 50px border-radius for all buttons, badges, and pill-shaped interactive elements
- Use the cream Vellum (#f7f5e8) for color-block editorial panels — it is the only surface that is not pure black or pure white
- Alternate sections between white, cream, and black backgrounds with 30-35px gaps — never use shadows to create depth between sections
- Keep product cards borderless and shadowless with 15px image radius — depth comes from image-to-canvas contrast, not elevation
- Use the inverse letter-spacing rule: the smaller the text, the wider the tracking (0.10em at 10px, 0.016em at 45px)

### Don't
- Do not introduce colour outside of Obsidian, Bone White, Vellum Cream, Charcoal, Pewter, and Dahlen Rust — the system is 0% colourful by design
- Do not use drop-shadows on any component — the system is intentionally flat
- Do not use lowercase text in any UI label — every label is uppercase with tracking
- Do not use card stacks with white-on-white subtle borders — use a 1px Obsidian hairline or rely on the Vellum cream surface for separation
- Do not add gradients, blurs, or glassmorphism effects — the brand reads as ink on paper, not as a glass UI
- Do not use border-radius below 15px on images or below 40px on buttons — the system is either pill-rounded or soft-rounded, never sharp-cornered
- Do not introduce a secondary typeface for body copy or descriptions — PP Neue Montreal serves every weight and size

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#ffffff` | Base page background and product grid surface |
| 1 | Vellum Panel | `#f7f5e8` | Editorial color-block panels — hero, collection banners, newsletter module |
| 2 | Obsidian Field | `#000000` | Inverted sections and CTA button fills |

## Elevation

No shadows. The system is deliberately flat — depth is achieved through solid color-block alternation (white → cream → black) and hairline 1px borders, never through drop-shadow elevation. This is a deliberate editorial-print choice: the page should look like ink on paper, not like a skeuomorphic UI.

## Imagery

Product photography is the dominant visual element and is treated with editorial precision: garments photographed on a clean white or light-grey background, no models in the grid view (models appear only in the hero), no lifestyle context, no props. The hero uses a single full-bleed lifestyle shot (model in interior, natural light, slightly desaturated). Graphic prints on garments (camo, leopard, illustrated artwork) provide the only colour within the product grid. Imagery treatment: sharp, flat, catalogue-grade — the object IS the hero, not the setting. No overlays, no duotone treatments, no decorative graphics. The right half of the hero is a pure flat colour block — no texture, no pattern, no gradient.

## Layout

Full-bleed sections that alternate between photography and flat colour blocks. The hero is a hard 50/50 vertical split: photo left, solid cream right. Below the hero, sections flow seamlessly with 30-35px vertical gaps. The product grid is a strict 4-column layout with 20px internal card padding and 30px inter-card gaps — dense and uniform, prioritising catalogue volume. Navigation is a single horizontal bar with centered links. No sidebar, no mega-menu, no sticky elements beyond the top nav. The page reads top-to-bottom as: marquee → nav → split hero → product grid (row 1) → product grid (row 2) → repeating sections. Max-width 1400px for the product grid; hero and marquee are full-bleed.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- cream panel: #f7f5e8
- border: #000000 (1px hairline)
- muted text: #888888
- accent (wordmark only): #b94e3a
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Product Grid Card**: White background, no border, no shadow. Product image with 15px border-radius, square aspect. Below: product name centered in PP Neue Montreal 12px weight 500 uppercase, letter-spacing 0.56px, #000000. Size row (XXS XS S M L XL XXL) in 10px weight 500 uppercase, #888888, 5px gaps, active size in #000000 with underline. Price in 12px weight 500 #000000 below. 20px internal padding.

2. **VOIR Ghost Button**: Transparent background, 1px #000000 border, 50px border-radius. Text 'VOIR' in PP Neue Montreal 14px weight 500 uppercase, letter-spacing 0.81px, #000000. Padding 10px vertical / 20px horizontal. Hover: fill #000000, text #ffffff.

3. **Split Editorial Hero**: 50/50 grid, full-bleed. Left: lifestyle photograph. Right: #f7f5e8 solid background. Centered text stack: 'VISIONNAIRE®' in 21px weight 500 uppercase #000000, 'DAHLEN' in 45px weight 700 #b94e3a, 'ART CLUB' in 12px weight 500 #000000. VOIR ghost button bottom-left of right panel.

4. **ÉPUISÉ Badge**: White background #ffffff, 50px border-radius. Text 'ÉPUISÉ' in PP Neue Montreal 12px weight 500 uppercase, letter-spacing 0.56px, #000000. Padding 10px vertical / 20px horizontal. Positioned centered over product image.

5. **Announcement Marquee**: Full-width #000000 background, 2px vertical padding. Repeating text in PP Neue Montreal 12px weight 500 uppercase, letter-spacing 0.28px, #ffffff, CSS marquee scroll animation.

## Similar Brands

- **Represent CLO** — Same black/white monochrome product grid with pill-shaped CTAs and uppercase tracked labels in a single sans-serif
- **KITH** — Editorial fashion layout with alternating white and cream sections, pill buttons, and catalogue-dense product grids
- **Stüssy** — Streetwear brand using ultra-minimal chrome, uppercase tracked nav, and a product-first grid with no decorative UI
- **Aimé Leon Dore** — Fashion-editorial site with cream and white tonal panels, pill buttons, and dense uniform product grids

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone-white: #ffffff;
  --color-vellum-cream: #f7f5e8;
  --color-charcoal: #231f20;
  --color-pewter: #888888;
  --color-dahlen-rust: #b94e3a;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 1px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.34px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: 0.38px;
  --text-heading-lg: 33px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.53px;
  --text-display: 45px;
  --leading-display: 1.15;
  --tracking-display: 0.72px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-70: 70px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 30-35px;
  --card-padding: 20px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-3xl: 40px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-tags: 50px;
  --radius-cards: 50px;
  --radius-buttons: 50px;
  --radius-navlinks: 40px;
  --radius-productimages: 15px;

  /* Surfaces */
  --surface-bone-canvas: #ffffff;
  --surface-vellum-panel: #f7f5e8;
  --surface-obsidian-field: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone-white: #ffffff;
  --color-vellum-cream: #f7f5e8;
  --color-charcoal: #231f20;
  --color-pewter: #888888;
  --color-dahlen-rust: #b94e3a;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 1px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.34px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: 0.38px;
  --text-heading-lg: 33px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.53px;
  --text-display: 45px;
  --leading-display: 1.15;
  --tracking-display: 0.72px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-70: 70px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-3xl: 40px;
  --radius-full: 50px;
}
```
