# Alpine Hearing Protection — Style Reference
> Sunlit Scandinavian editorial. A cinnamon-ink wordmark on warm cream paper, with one red exclamation — the rest is photography and generous whitespace.

**Theme:** light

Alpine uses a warm Scandinavian-editorial language: an off-white canvas bathed in cinnamon undertones, a near-black cocoa ink for text, and a single electric red accent that appears only in the brand bar and product badges. The system feels like a print magazine spread — generous full-bleed photography sits next to tight, sharp-cornered product cards with minimal rounding (2.23px) and no decorative elevation. Typography is custom and slightly compressed (Antarctica), pulling headlines close for editorial tension. Warm cream surfaces (#f8f0ec, #f3e7e2, #fde3d6) layer underneath product imagery like a gallery wall. The visual mood is calm, premium, and tactile — photography does the emotional work while UI components stay near-flat and information-dense. Red is rationed: a logo bar, a badge, a guarantee bar — never buttons. The only filled action color is the warm cocoa (#200e0e), which replaces what most sites would use as black.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cocoa Ink | `#200e0e` | `--color-cocoa-ink` | Primary text, filled action buttons, card text, icon strokes, card borders — warm near-black replaces pure black throughout, giving every label a roasted, tactile quality |
| Signal Red | `#ed212d` | `--color-signal-red` | Red decorative accent for icons, marks, and small graphic details. |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, nav text, button labels on dark surfaces — the neutral base all warm tones sit on |
| Blush Cream | `#f8f0ec` | `--color-blush-cream` | Card surfaces, soft elevated sections, product detail backgrounds — the warm secondary layer beneath the white canvas |
| Rose Stone | `#f3e7e2` | `--color-rose-stone` | Badge backgrounds, subtle card elevation, border tints on light cards — a step warmer than Blush Cream for tag/label contexts |
| Apricot Wash | `#fde3d6` | `--color-apricot-wash` | Decorative illustration panels, soft highlight washes on icons and product imagery backgrounds |
| Warm Gray | `#d2cfcf` | `--color-warm-gray` | Hairline borders, dividers, input field outlines on neutral surfaces |
| Deep Espresso | `#202020` | `--color-deep-espresso` | Secondary card backgrounds for dark product variants — used sparingly as a near-black with slight warmth |
| Sage Mist | `#9ac9b5` | `--color-sage-mist` | Product color swatch — specific earplug variant color, not a system-wide token |
| Dusty Rose | `#dbb0b3` | `--color-dusty-rose` | Product color swatch — specific earplug variant color, not a system-wide token |

## Tokens — Typography

### Antarctica — Sole typeface across all UI: navigation, buttons, product cards, body, and display headlines. Custom geometric sans with slight warmth in the terminals. Medium-weight (545) is the workhorse for body and UI; 600 carries CTAs and product names; 400 appears in secondary metadata. Headlines compress with -0.02em tracking to feel editorial rather than airy. · `--font-antarctica`
- **Substitute:** DM Sans or Söhne — both have the geometric warmth and humanist terminal cuts that match Antarctica's character
- **Weights:** 400, 500, 545, 600
- **Sizes:** 10, 12, 13, 14, 16, 18, 24, 27, 42
- **Line height:** 1.10, 1.15, 1.20, 1.30, 1.45, 1.50, 1.60
- **Letter spacing:** -0.01em to -0.02em at 18px and above; normal below
- **Role:** Sole typeface across all UI: navigation, buttons, product cards, body, and display headlines. Custom geometric sans with slight warmth in the terminals. Medium-weight (545) is the workhorse for body and UI; 600 carries CTAs and product names; 400 appears in secondary metadata. Headlines compress with -0.02em tracking to feel editorial rather than airy.

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 18px | 1.3 | -0.18px | `--text-heading-sm` |
| heading | 24px | 1.2 | -0.24px | `--text-heading` |
| heading-lg | 27px | 1.15 | -0.27px | `--text-heading-lg` |
| display | 42px | 1.1 | -0.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 2.23px |
| badges | 2.23px |
| images | 2.23px |
| inputs | 2.23px |
| buttons | 2.23px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 15px
- **Element gap:** 8px

## Components

### Red Brand Bar
**Role:** Slim brand-identity header

Full-width Signal Red (#ed212d) bar, ~48px tall, containing a white hamburger icon on the left, centered 'Alpine' wordmark in white Antarctica 600, and a language selector (ES) with shopping bag icon on the right. Sits directly below the dark guarantee bar. Padding: 10px top/bottom. This is the single most identifiable UI element of the system.

### Guarantee Announcement Bar
**Role:** Trust signal above the fold

Narrow dark band at the very top, Cocoa Ink (#200e0e) background, white centered text at 10–12px Antarctica 500, uppercase tracking. Single line, no close button visible. Sets a premium tone before the red brand bar.

### Hero Photograph Section
**Role:** Full-bleed marketing hero

100% viewport width lifestyle photograph with a white headline overlaid at bottom-left in Antarctica weight 500 at 42px, letter-spacing -0.02em. Subhead in weight 400 at 16px, slightly muted white. A filled Cocoa Ink (#200e0e) CTA button with white text and right-arrow icon sits below the subhead. A small carousel dot indicator appears at bottom-right.

### Category Navigation Bar
**Role:** Horizontal category selector

Centered row of 7 text-only navigation links (Focus, Music, Playing, DIY, Motor, Watersport, Race) in Antarctica 500 at 16px, Cocoa Ink color, no underlines or backgrounds. 64px vertical padding above and below. No active state styling visible — pure typographic navigation.

### Help Me Choose Pill
**Role:** Outlined contextual action

Centered button below the category nav: 1px Cocoa Ink (#200e0e) border, 2.23px radius, transparent background, 'Help Me Choose' label in Cocoa Ink Antarctica 500 14px, with a right-arrow chevron icon. Padding: 10px 20px. Ghost/outlined style — not filled.

### Product Card
**Role:** E-commerce product tile

Square product image on a solid colored background (purple, sand, blue, or pink — matching the earplug color), 2.23px border in Cocoa Ink (#200e0e), 2.23px radius. Below the image: product name in Antarctica 600 16px Cocoa Ink, feature line in Antarctica 400 13px Cocoa Ink, 'Stay in conversation' tagline in 13px, 5-star rating with review count in 13px, price in Antarctica 600 16px. No shadow, no hover lift — the card is flat and printed.

### Top Seller Badge
**Role:** Product status tag

Small rectangular label in the top-left corner of a product image: white background, 2.23px radius, 'Top Seller' text in Antarctica 500 12px Cocoa Ink. No border, no color fill — pure typographic badge sitting on the product photo.

### Color Swatch Row
**Role:** Product variant selector

Horizontal row of 4–5 small color squares (each ~16px, 2.23px radius) positioned below the product image, above the product name. Colors are exact product variants: sand, gold, black, navy, blue, pink. No labels — the swatches are self-explanatory.

### Star Rating Display
**Role:** Social proof indicator

Row of 5 small filled stars in Cocoa Ink (#200e0e) followed by review count in Antarctica 400 13px (e.g. '394 reviews'). Stars are tightly spaced, ~10px each. Half-star rendering supported. No separate star+text vertical stacking — always horizontal.

### Hero CTA Button
**Role:** Primary filled action

Filled button with Cocoa Ink (#200e0e) background, white Antarctica 500 text, 2.23px radius, right-arrow icon after the label. Padding: 12px 20px. Label is sentence-case ('Find Calm Throughout The Day'). This is the only filled button style in the system.

### Advice Card
**Role:** Editorial content tile

Full-bleed or near-full-bleed image (portrait photograph or line illustration) with a title and body paragraph below in Antarctica 600/400 at 18px/14px Cocoa Ink. No card background or border — sits directly on the white or cream section background. Images themselves are the visual container.

### Carousel Navigation Arrows
**Role:** Horizontal scroll control

Pair of circular outlined arrow buttons (left/right) at the right edge of horizontally-scrolling rows, 32px diameter, 1px Cocoa Ink border, 2.23px radius, Cocoa Ink arrow icon inside. Transparent fill, ghost style.

## Do's and Don'ts

### Do
- Use Cocoa Ink (#200e0e) for all body text, icons, and borders — never use pure #000000 or charcoal grays; the warm undertone is the brand
- Apply 2.23px radius to every surface — cards, buttons, badges, inputs, images; sharp corners are non-negotiable
- Use Signal Red (#ed212d) only in three places: the brand bar, the guarantee bar, and product status badges — never on CTAs, links, or body text
- Compress display headlines to letter-spacing -0.02em (e.g. -0.84px at 42px) for editorial tightness; body and below stays at normal tracking
- Alternate white (#ffffff) and Blush Cream (#f8f0ec) section backgrounds to create rhythm without using shadows
- Center-align the category navigation row and the 'Help Me Choose' button — left-aligned navigation would break the print-catalogue feel
- Use full-bleed lifestyle photography (portrait crops, natural light, shallow DOF) for heroes and editorial sections; product-only shots on solid color backgrounds for the grid

### Don't
- Do not add box-shadows to any component — elevation comes from background-color shifts, never from blur or offset
- Do not round corners beyond 2.23px — no pill buttons, no large radii; the near-sharp aesthetic defines the system
- Do not use Signal Red (#ed212d) for buttons, links, or hover states — it is brand-identity color, not an action color
- Do not introduce drop shadows, gradients, or glassmorphism — the design is deliberately flat and print-like
- Do not use the product color swatches (Sage Mist #9ac9b5, Dusty Rose #dbb0b3) as system-wide accent tokens — they are product variant colors only
- Do not center-align body paragraphs or use fonts other than Antarctica (or its substitute); the single-typeface discipline is what makes the system feel like one publication
- Do not use pure black (#000000) for text or icons — always use Cocoa Ink (#200e0e) to maintain the warm tonal harmony

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, full-bleed white surface for navigation, hero, and product grids |
| 1 | Blush Card | `#f8f0ec` | Soft product detail cards, gentle elevation from canvas |
| 2 | Rose Tag | `#f3e7e2` | Badge backgrounds, tag pills, label containers |
| 3 | Apricot Panel | `#fde3d6` | Decorative illustration backdrops and icon highlight washes |

## Elevation

- **Top Seller Badge:** `none — flat rectangle with text only, no shadow`
- **Product Card:** `none — sharp 2.23px border in Cocoa Ink (#200e0e), no box-shadow`

## Imagery

Photography is the dominant visual element: tight, intimate portrait crops of people wearing earplugs, always full-bleed or large-format, shot in natural light with shallow depth of field. The hero image (profile of a woman with closed eyes against blue sky) is the signature — calm, sensory, slightly aspirational. Product photography is clean, product-only on solid colored backgrounds (purple, sand, blue, pink) that double as color swatches. Illustrations are minimal: a single line-art headphone drawing on Apricot Wash (#fde3d6) in coral stroke, used as a decorative section accent. No 3D renders, no abstract graphics, no icon families beyond simple stroke icons. The overall impression is editorial fashion-photography meets medical-product catalogue.

## Layout

Full-bleed hero photograph (100% viewport width) with white headline overlaid bottom-left. Below the hero: a max-width 1280px centered container with compact product grid (3–4 columns). Navigation is a slim text bar of category links centered above the grid. Section rhythm: white bands alternating with warm cream (#f8f0ec) bands, separated by generous 64px gaps. Content blocks alternate between centered text stacks and asymmetric photo+text pairs. Product cards are uniform size with a consistent internal grid: image → badge → name → metadata → price. No sidebar, no mega-menu — navigation stays as a single horizontal row. Carousel arrows on the right edge suggest horizontal scroll for product and advice rows. The layout reads top-to-bottom as: guarantee bar → red brand bar → hero photo → category nav → product grid → advice section with 3-column image grid.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #200e0e (Cocoa Ink)
- Background: #ffffff (Canvas White)
- Border: #200e0e or #d2cfcf (hairline)
- Accent: #ed212d (Signal Red — brand only)
- Surface: #f8f0ec (Blush Cream)
- primary action: #200e0e (filled action)

**Example Component Prompts**

1. *Product Card*: 2.23px border in #200e0e, no shadow. Square product image on a solid colored background filling the top 75%. Below: product name in Antarctica 600 16px #200e0e, feature line in Antarctica 400 13px #200e0e, 5-star rating in #200e0e with '394 reviews' in 13px, price in Antarctica 600 16px #200e0e. Card padding 15px. No hover lift.

2. *Hero Section*: Full-bleed lifestyle photograph (portrait crop, natural light, shallow depth of field). Bottom-left overlay: headline in Antarctica 500 42px white, letter-spacing -0.84px. Subhead in Antarctica 400 16px white at 90% opacity. Filled CTA below: #200e0e background, white text in Antarctica 500 14px, 2.23px radius, 12px 20px padding, right-arrow icon after label.

3. *Category Navigation Bar*: Centered single row of 7 text links, Antarctica 500 16px #200e0e, 40px horizontal gap between links, 64px vertical padding. No background, no borders, no active state styling. Ghost 'Help Me Choose' button centered below: 1px #200e0e border, 2.23px radius, transparent fill, label in Antarctica 500 14px #200e0e with right-arrow icon.

4. *Top Seller Badge*: Small rectangle in top-left corner of a product image. White background, 2.23px radius, no border. Label 'Top Seller' in Antarctica 500 12px #200e0e. Padding 5px 10px.

5. *Advice Section Card*: Full-width image (portrait photograph or coral line-art illustration on #fde3d6 background). Below image: title in Antarctica 600 18px #200e0e, body paragraph in Antarctica 400 14px #200e0e at 1.5 line-height. No card border, no background — the image is the container.

## Similar Brands

- **Teenage Engineering** — Same near-sharp 2px corners, warm cream card surfaces, and photography-driven product grid with minimal UI chrome
- **Olab (oratory eyewear brands)** — Same editorial lifestyle photography, warm-neutral palette, and print-catalogue layout rhythm with centered text navigation
- **Aesop** — Same warm cream-and-white tonal layering, serif-adjacent editorial restraint, and rationed single accent color
- **Muji** — Same near-flat components, minimal elevation, and warm off-white canvas with brown text replacing pure black
- **Mismo** — Same Scandinavian-product-photography approach, tight type spacing, and card grids with hairline borders in a warm dark tone

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cocoa-ink: #200e0e;
  --color-signal-red: #ed212d;
  --color-canvas-white: #ffffff;
  --color-blush-cream: #f8f0ec;
  --color-rose-stone: #f3e7e2;
  --color-apricot-wash: #fde3d6;
  --color-warm-gray: #d2cfcf;
  --color-deep-espresso: #202020;
  --color-sage-mist: #9ac9b5;
  --color-dusty-rose: #dbb0b3;

  /* Typography — Font Families */
  --font-antarctica: 'Antarctica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.18px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.24px;
  --text-heading-lg: 27px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.27px;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: -0.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w545: 545;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 15px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2.23px;

  /* Named Radii */
  --radius-cards: 2.23px;
  --radius-badges: 2.23px;
  --radius-images: 2.23px;
  --radius-inputs: 2.23px;
  --radius-buttons: 2.23px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-blush-card: #f8f0ec;
  --surface-rose-tag: #f3e7e2;
  --surface-apricot-panel: #fde3d6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cocoa-ink: #200e0e;
  --color-signal-red: #ed212d;
  --color-canvas-white: #ffffff;
  --color-blush-cream: #f8f0ec;
  --color-rose-stone: #f3e7e2;
  --color-apricot-wash: #fde3d6;
  --color-warm-gray: #d2cfcf;
  --color-deep-espresso: #202020;
  --color-sage-mist: #9ac9b5;
  --color-dusty-rose: #dbb0b3;

  /* Typography */
  --font-antarctica: 'Antarctica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.18px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.24px;
  --text-heading-lg: 27px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.27px;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: -0.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-sm: 2.23px;
}
```
