# Basic.Space — Style Reference
> curated gallery on white marble

**Theme:** light

Basic.Space is a curated gallery-commerce platform built on near-total achromatic restraint. White gallery walls, 2px-sharp product frames, and one electric blue (#0700ff) that appears only on the top announcement strip — a single chromatic interruption in an otherwise monochrome world. Typography is a custom geometric humanist (FTBasicSpace) used in three restrained weights, with tight negative letter-spacing that gives headlines a quietly confident voice. Components are gallery-light: pill-shaped controls, hairline #ebebeb dividers, no shadows, no rounded card corners. Layout is full-bleed horizontally-scrolling rails of product cards, evoking the experience of walking through a design museum where the objects are the heroes and the interface disappears.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#0700ff` | `--color-electric-cobalt` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Gallery Black | `#000000` | `--color-gallery-black` | Primary text, product titles, prices, navigation links, icon strokes, and dominant fill on collection overlay labels |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, product image backgrounds, and inverse text on dark imagery and the cobalt announcement bar |
| Hairline Gray | `#ebebeb` | `--color-hairline-gray` | Primary border color, page canvas background, card dividers, list separators, input field backgrounds — the dominant structural neutral |
| Fog Gray | `#cecccc` | `--color-fog-gray` | Secondary surface for elevated sections and secondary borders, providing one subtle step above the dominant #ebebeb |
| Chalk White | `#f7f7f7` | `--color-chalk-white` | Soft background wash for alternating sections and subtle card lift without shadows |
| Ash Gray | `#b5b5b5` | `--color-ash-gray` | Muted helper text, disabled icon fills, and secondary metadata |

## Tokens — Typography

### FTBasicSpace — Single custom typeface used across all surfaces — UI chrome, product metadata, and section headlines. The 500/600 weights are reserved for product titles and brand labels (WAKA WAKA, RARIFY, PROSA), while 400 carries navigation, prices, and body. The signature is the tight negative tracking (-0.0220em at display sizes) which compresses the letterforms into a dense, almost monolinear rhythm — unlike typical e-commerce type that opens up, this tightens. · `--font-ftbasicspace`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 18, 20, 38, 39, 40
- **Line height:** 1.12–1.71
- **Letter spacing:** -0.0220em at display sizes (38–40px), -0.0100em at body sizes (14–18px)
- **Role:** Single custom typeface used across all surfaces — UI chrome, product metadata, and section headlines. The 500/600 weights are reserved for product titles and brand labels (WAKA WAKA, RARIFY, PROSA), while 400 carries navigation, prices, and body. The signature is the tight negative tracking (-0.0220em at display sizes) which compresses the letterforms into a dense, almost monolinear rhythm — unlike typical e-commerce type that opens up, this tightens.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.38 | -0.14px | `--text-caption` |
| body-sm | 16px | 1.43 | -0.16px | `--text-body-sm` |
| body | 18px | 1.22 | -0.18px | `--text-body` |
| subheading | 20px | 1.2 | -0.2px | `--text-subheading` |
| heading-sm | 38px | 1.13 | -0.836px | `--text-heading-sm` |
| display | 40px | 1.12 | -0.88px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 2px |
| images | 2px |
| inputs | 16px |
| buttons | 9999px |

### Layout

- **Section gap:** 48px
- **Card padding:** 0px
- **Element gap:** 4px

## Components

### Cobalt Announcement Bar
**Role:** Top-of-page promotional strip

Full-bleed #0700ff background, 100% page width, approximately 32px tall. White (#ffffff) text centered at 14px weight 400. The sole chromatic element in the entire design system — acts as a deliberate visual interruption above an achromatic world.

### Primary Navigation Bar
**Role:** Site-wide horizontal navigation

White (#ffffff) background, no shadow, no border-bottom. Left: wordmark 'Basic.Space' in 16px weight 500 #000000. Center-left: text-only category links (All, Design, Art, Womens, Mens, Basic.Space LA) in 14px weight 400 #000000, separated by consistent 24px gaps, with subtle section dividers between groups. Right: search input, 'Account', and 'Cart' as text links. No backgrounds, no borders on nav items — the typographic hierarchy alone provides structure.

### Pill Button (Primary)
**Role:** Call-to-action and navigation controls

9999px border-radius (fully pill-shaped). 8px vertical / 16px horizontal padding. Background #000000 with #ffffff text at 14px weight 500. No border, no shadow. Used for 'Shop' CTA and app download prompts. The pill shape is the signature — no sharp-cornered buttons exist in the system.

### Pill Button (Ghost)
**Role:** Secondary actions and text-level controls

9999px border-radius, transparent background, 1px solid #ebebeb border, #000000 text at 14px weight 400. Used for arrow navigation controls (← →) in section headers.

### Product Card
**Role:** Individual product listing in horizontal scroll rails

Zero card padding, zero border, zero shadow. Structure: 2px-radius product image filling the card width on a #ffffff background, followed by 12px gap, then product title (16px weight 500 #000000, truncated to 2 lines), price (14px weight 400 #000000), and brand label in uppercase 12px weight 500 #000000 with 8px letter-spacing. The image itself carries the 2px corner radius — the card has no container chrome at all.

### Section Header
**Role:** Subsection title with carousel controls

Left-aligned title in 20px weight 500 #000000 with an external-link arrow icon. Right-aligned ghost pill buttons (← →) for horizontal rail navigation. 48px vertical margin above and below the section content rail.

### Horizontal Product Rail
**Role:** Scrollable product collection display

Full-viewport-width horizontal scroll container. Cards arranged in a single row with 4px gap between cards. No visible scrollbar — navigation via the ghost pill arrows. Each card is approximately 180–220px wide. The rail extends beyond the viewport edge, creating the gallery-continuous-scroll effect.

### Hero Collection Banner
**Role:** Full-bleed lifestyle image for featured collection

Full-viewport-width image, approximately 60vh tall. Bottom-left overlay contains: date label in 14px weight 400 white with 80% opacity, then large collection title in 38–40px weight 500 #ffffff. Bottom-right contains a white pill button ('Shop') with 9999px radius and black text. No gradient overlay — text sits directly on the image.

### Collection Category Card
**Role:** Large featured collection tile

Full-bleed image, approximately 400px tall. Centered overlay with two text lines: small uppercase category label (14px weight 500 #ffffff, letter-spacing 0.08em) above a large collection title (38px weight 500 #ffffff). No background scrim, no border. Arranged in a 3-column grid with no gaps between cards (seamless).

### Search Input
**Role:** Site search field in navigation

16px border-radius, 80px right/left padding (from icon), no visible border. Icon (magnifying glass) at left in #b5b5b5. Placeholder text 'Search' in 14px weight 400 #b5b5b5. Appears flush within the nav bar — no container chrome distinguishes it from the nav links.

### Product Image Thumbnail
**Role:** Primary product photography

Square or 4:5 aspect ratio, 2px border-radius, #ffffff background (the image canvas). No border, no shadow, no padding. Photography is studio-shot on pure white — the object IS the image, no lifestyle context.

### Brand Label (Metadata)
**Role:** Designer/maker attribution on product cards

Uppercase, 12px weight 500, #000000, 8px letter-spacing. Appears below price. The uppercase tracked treatment distinguishes it from the sentence-case product title, creating a two-tier metadata hierarchy.

## Do's and Don'ts

### Do
- Use 9999px border-radius for all interactive controls — buttons, tags, icon containers. The pill shape is non-negotiable; sharp-cornered buttons break the gallery-curator language.
- Set card and image border-radius to 2px. This near-sharp radius reads as 'gallery mount' rather than 'app card' — it should feel like a print pinned to a wall.
- Use only #ebebeb for dividers and borders. Never use shadows to separate elements — separation comes from hairline 1px borders and surface tone shifts.
- Restrict the electric cobalt #0700ff to the top announcement bar only. It is the single chromatic accent in the entire system; diluting it across buttons or links destroys its interruptive power.
- Apply -0.0220em letter-spacing at display sizes (38–40px) and -0.0100em at body sizes. The tight tracking is what makes headlines feel curated rather than generic.
- Let product images fill their containers edge-to-edge with 2px corners. Never wrap product photos in padded containers or apply drop shadows.
- Use full-bleed horizontally-scrolling rails for product collections. The continuous-scroll gallery experience is core to the site's museum-walk rhythm.

### Don't
- Don't introduce any color other than the cobalt announcement bar into the interface. Greens, warm tones, pastels — all break the gallery-white-wall discipline.
- Don't use box-shadows on cards, buttons, or images. Depth is expressed through surface tone differences (#ebebeb canvas vs #ffffff cards), never through elevation.
- Don't use rounded corners above 2px on cards or images. The contrast between 9999px pill buttons and 2px sharp cards is the signature geometry.
- Don't use more than two font weights per visual element. The hierarchy is weight + case + tracking, not weight + size + color + decoration.
- Don't place text on colored backgrounds other than the announcement bar's cobalt or full-bleed photography. All UI text sits on #ebebeb, #ffffff, or #f7f7f7.
- Don't add padding inside product card containers. Cards are zero-chrome — the image and text stack with only 12px internal gap, no bordered container.
- Don't use icons with fills or multi-color treatments. Icons are single-weight line glyphs in #000000 or #b5b5b5 only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ebebeb` | Default page background, creating a soft warm-gray gallery wall behind white product cards |
| 1 | Card | `#ffffff` | Product image and content card surface — the bright white object against the gray wall |
| 2 | Soft Lift | `#f7f7f7` | Subtle background for nested sections and quiet visual separation without elevation |
| 3 | Divider | `#cecccc` | Heavier neutral used for section boundaries and secondary structural elements |

## Elevation

The design uses zero shadows as a deliberate philosophy. All depth and hierarchy are achieved through flat surface tone differences (#ebebeb canvas, #ffffff cards) and hairline #ebebeb borders. This produces the gallery-wall effect where objects sit directly on their surface without artificial lift, reinforcing the curatorial, museum-object sensibility.

## Imagery

Product photography is the dominant visual element. All product shots are studio-captured on pure white or contextual neutral environments — the object fills the frame with no lifestyle staging, no models, no environmental context. The product IS the hero. Hero banners and collection tiles use editorial lifestyle photography (warm interior scenes, art gallery shots) that creates mood and aspiration, contrasting with the clinical product cards. Photography is full-bleed and edge-to-edge with 2px corner radius. No illustrations, no 3D renders, no abstract graphics. Icons are line-weight single-color glyphs, never filled or multicolor. Image density is high: a typical viewport contains 6+ product images or one full-bleed hero — the interface is image-led, text-secondary.

## Layout

The page is full-bleed with no max-width container. The dominant pattern is horizontally-scrolling rails of product cards (6+ visible per row) that extend beyond the viewport, navigated by ghost pill arrow controls. The hero section is a full-viewport-width lifestyle image with overlaid text. Section rhythm: announcement bar → nav → product rail ('For You') → full-bleed hero banner → 3-column collection grid → additional product rails. Vertical gaps between sections are 48–72px. The grid system is implicit — cards size to viewport width with a consistent 4px gap, creating flexible column counts (5–8 cards visible depending on viewport). Navigation is a flat horizontal bar, not sticky on scroll, with no logo-background distinction. The overall feeling is museum-continuous: the eye scrolls horizontally through curated objects, then vertically to the next gallery room.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background (page canvas): #ebebeb
- background (card/image): #ffffff
- border/divider: #ebebeb
- accent: #0700ff (announcement bar only)
- primary action: no distinct CTA color

**Example Component Prompts**
1. **Cobalt Announcement Bar**: Full-bleed #0700ff background, 100% page width, 32px height. Centered white (#ffffff) text 'Download the app to get the full experience' at 14px, weight 400, letter-spacing -0.14px.

2. **Product Card**: Zero container chrome, no border, no shadow. 2px-radius product image on #ffffff background, 4:5 aspect ratio. Below: 12px gap, product title at 16px weight 500 #000000 (truncate to 2 lines), then 4px gap, price at 14px weight 400 #000000, then 8px gap, brand label in uppercase 12px weight 500 #000000 with 8px letter-spacing.

3. **Pill Navigation Arrow**: 9999px border-radius, 32px × 32px, transparent background, 1px solid #ebebeb border, centered ← or → glyph in #000000 at 14px weight 400.

4. **Section Header**: Left-aligned title in 20px weight 500 #000000 with ↗ external-link icon. Right-aligned: two ghost pill buttons (← →) with 9999px radius, 1px #ebebeb border, 8px 12px padding. 48px vertical margin above and below.

5. **Hero Collection Banner**: Full-viewport-width image, 60vh height. Bottom-left: date 'March 27-29' in 14px weight 400 #ffffff at 80% opacity, then 8px gap, title 'Basic.Space LA Collection' in 38px weight 500 #ffffff with -0.836px letter-spacing. Bottom-right: white pill button 'Shop' with 9999px radius, #000000 text, 8px 16px padding.

## Similar Brands

- **SSENSE** — Same achromatic e-commerce gallery approach with full-bleed editorial imagery, near-zero card chrome, and tight typographic restraint
- **The Citizenry** — Curated home goods marketplace using white-on-warm-gray surfaces, product-first photography, and minimal type hierarchy
- **Muji** — Same museum-object sensibility — products photographed on pure white, no decorative chrome, typographic labels as the only metadata
- **Areaware** — Design-object retailer with gallery-wall product presentation, single-column metadata, and 2px-sharp image edges
- **Goodreads (product rails)** — Same horizontally-scrolling collection rails with arrow-controlled navigation and zero card container chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #0700ff;
  --color-gallery-black: #000000;
  --color-paper-white: #ffffff;
  --color-hairline-gray: #ebebeb;
  --color-fog-gray: #cecccc;
  --color-chalk-white: #f7f7f7;
  --color-ash-gray: #b5b5b5;

  /* Typography — Font Families */
  --font-ftbasicspace: 'FTBasicSpace', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.22;
  --tracking-body: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.836px;
  --text-display: 40px;
  --leading-display: 1.12;
  --tracking-display: -0.88px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --section-gap: 48px;
  --card-padding: 0px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 2px;
  --radius-images: 2px;
  --radius-inputs: 16px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #ebebeb;
  --surface-card: #ffffff;
  --surface-soft-lift: #f7f7f7;
  --surface-divider: #cecccc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #0700ff;
  --color-gallery-black: #000000;
  --color-paper-white: #ffffff;
  --color-hairline-gray: #ebebeb;
  --color-fog-gray: #cecccc;
  --color-chalk-white: #f7f7f7;
  --color-ash-gray: #b5b5b5;

  /* Typography */
  --font-ftbasicspace: 'FTBasicSpace', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.22;
  --tracking-body: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.836px;
  --text-display: 40px;
  --leading-display: 1.12;
  --tracking-display: -0.88px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```
