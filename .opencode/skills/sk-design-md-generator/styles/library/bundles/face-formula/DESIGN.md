# Face Formula — Style Reference
> Nordic editorial portrait. A quiet Scandinavian magazine spread where the model's gaze and a 120px condensed-serif masthead do all the talking against walls of cool mist.

**Theme:** light

Face Formula reads like a Scandinavian editorial spread translated into a storefront: a near-monochromatic canvas of warm grays and cool mists, anchored by a colossal condensed-serif wordmark that makes the brand name feel like a magazine masthead rather than a logo. The palette is deliberately desaturated — 94% achromatic — so the only color the eye registers is the cool slate (#3b505a) that defines borders, navigation, and primary text against washes of mist (#f2f5f8) and white. Every interface decision whispers: ghost text links with hairline underlines instead of filled buttons, hairline 1px dividers, generous 8px-base vertical rhythm, and product surfaces that feel like gallery plinths. Two typefaces do all the work — Libre Caslon Condensed for editorial authority at display sizes, Circular Pro for every utilitarian surface — and the absence of shadows, gradients, or accent color forces the photography to carry all warmth and emotion.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| White Canvas | `#ffffff` | `--color-white-canvas` | Page background, product photography backdrop, hero base layer |
| Mist | `#f2f5f8` | `--color-mist` | Primary light surface for cards, product tiles, section bands, input fills, hairline borders — the most-used non-white color |
| Soft Mist | `#e6ebee` | `--color-soft-mist` | Elevated surface layer one step above Mist for nested cards or secondary content blocks |
| Pale Slate | `#cfdce7` | `--color-pale-slate` | Button and navigation borders, subtle dividers, outlined-control stroke |
| Steel | `#58737e` | `--color-steel` | Secondary text, muted helper labels, subdued body copy where Deep Slate would feel too heavy |
| Deep Slate | `#3b505a` | `--color-deep-slate` | The signature brand color — primary text, all hairline borders (536 nav + 304 misc border uses), nav link color, footer text, and the single dark surface tone that anchors the otherwise pale system |
| Deep Ink | `#202f3b` | `--color-deep-ink` | Heaviest heading text where maximum contrast against white is needed |
| Carbon | `#000000` | `--color-carbon` | Icon strokes, strict-contrast text, and occasional fill — used sparingly only when absolute black is required |

## Tokens — Typography

### Libre Caslon Condensed — Editorial display — the wordmark, section headings, and any text that needs to feel like a magazine title. Used at only three sizes, all dramatic, all in a single weight 400. The condensed proportions and negative tracking make the brand name feel architectural and permanent rather than decorative. · `--font-libre-caslon-condensed`
- **Substitute:** Playfair Display SC, Bodoni Moda, Cormorant Garamond Condensed
- **Weights:** 400
- **Sizes:** 32px, 52px, 120px
- **Line height:** 1.00, 1.10, 1.20
- **Letter spacing:** -0.0200em at 120px, -0.0100em at 52px and 32px
- **Role:** Editorial display — the wordmark, section headings, and any text that needs to feel like a magazine title. Used at only three sizes, all dramatic, all in a single weight 400. The condensed proportions and negative tracking make the brand name feel architectural and permanent rather than decorative.

### Circular Pro — The single workhorse sans for all navigation, body copy, buttons, links, inputs, icons, and utility UI. The geometric neutrality and slightly wide letterforms give the system a calm, clinical tone appropriate to a biology-driven skincare brand. Never goes above 16px, never goes bold — the 400 weight at small sizes is the only voice UI text gets. · `--font-circular-pro`
- **Substitute:** Inter, Söhne, Manrope
- **Weights:** 400
- **Sizes:** 12px, 13px, 15px, 16px
- **Line height:** 1.00, 1.40
- **Letter spacing:** 0.0100em to 0.2000em — the 0.2em tracking at 12px is for uppercase micro-labels like BESTSELLER, turning functional text into quiet typographic punctuation
- **Role:** The single workhorse sans for all navigation, body copy, buttons, links, inputs, icons, and utility UI. The geometric neutrality and slightly wide letterforms give the system a calm, clinical tone appropriate to a biology-driven skincare brand. Never goes above 16px, never goes bold — the 400 weight at small sizes is the only voice UI text gets.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 2.4px | `--text-caption` |
| body-lg | 16px | 1.4 | 0.32px | `--text-body-lg` |
| subheading | 32px | 1.2 | -0.32px | `--text-subheading` |
| heading | 52px | 1.1 | -0.52px | `--text-heading` |
| display | 120px | 1 | -2.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 47 | 47px | `--spacing-47` |
| 84 | 84px | `--spacing-84` |
| 95 | 95px | `--spacing-95` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Wordmark Logo
**Role:** Primary brand identity — overlaid on hero photography and centered in navigation

120px Libre Caslon Condensed weight 400, letter-spacing -2.4px, white (#ffffff) on dark photography. The em-dash between FACE and FORMULA is a signature compositional device. Functions as the dominant visual element on every screen — it is both logo and hero typography.

### Ghost Text Link
**Role:** Primary CTA pattern — used for SHOP NOW, READ MORE, FIND YOUR FORMULA

Circular Pro 13px weight 400, letter-spacing 0.13px, color Deep Slate (#3b505a), uppercase, with a 1px underline. No background, no border, no padding beyond a small click target. The underline is the entire visual mechanism. This replaces what other sites would use a filled button for.

### Outlined Navigation Button
**Role:** Secondary action — language/region selector (Ship to: Europa / EUR)

Circular Pro 12-13px, color Deep Slate (#3b505a), 1px border in Pale Slate (#cfdce7) or Deep Slate, no fill, no radius, inline with surrounding text. Behaves like a text element with a hairline outline.

### Bestseller Tag
**Role:** Product status indicator — appears on featured product cards

Circular Pro 12px weight 400, uppercase, letter-spacing 2.4px (0.2em), color Deep Slate (#3b505a) or Deep Ink, on a Mist (#f2f5f8) rectangular fill. No border, no radius. Positioned as a small horizontal label at the top of product cards. The wide tracking turns a functional label into editorial typography.

### Product Card
**Role:** Product showcase unit in grid sections

Mist (#f2f5f8) background, 0px radius, generous internal padding (~24px). Product image centered on a white or light surface within the card. Bestseller tag top-left. Product name and category in Circular Pro 13-15px Deep Slate below or beside the image. No shadow, no border — the surface color contrast alone defines the card boundary.

### Top Navigation Bar
**Role:** Primary site navigation — overlaid on hero, solid on interior pages

Three-zone horizontal layout: left-aligned utility links (SHOP, COLLECTIONS, ABOUT US, SIGNATURE TREATMENTS) in Circular Pro 13px Deep Slate; centered wordmark logo in white or Deep Slate depending on context; right-aligned account/cart utilities with 12px uppercase labels and uppercase region selector. 1px hairline Deep Slate bottom border. 12px row-gap between nav groups. Transparent over hero, white on interior pages.

### Hero Overlay Block
**Role:** Headline + subtext + CTA stack positioned over full-bleed photography

Left-aligned, bottom-left positioned. Headline: Circular Pro or Libre Caslon at 32-52px, white (#ffffff), letter-spacing tight. Subtext: 15px Circular Pro white at 80% opacity. CTA: ghost text link in white with underline. No background card — the text floats directly on the photograph.

### Section Heading
**Role:** Editorial section titles — "Rooted in Norway. Guided by biology."

Libre Caslon Condensed 52px weight 400, color Deep Ink (#202f3b), letter-spacing -0.52px, line-height 1.1. Two-line stacking is a signature compositional pattern. Centered or left-aligned depending on section. No underline, no decoration.

### Image Grid Tile
**Role:** Editorial imagery block in content sections

Two side-by-side images with 16px column-gap, 0px radius, raw edges. One image is landscape photography (Norwegian landscape), the other is a product hero shot on neutral background. Aspect ratios vary — the irregularity is intentional, mimicking editorial layout.

### Input Field
**Role:** Form input — newsletter signup, search

0px radius, 1px border in Deep Slate (#3b505a) or Pale Slate (#cfdce7), Mist (#f2f5f8) fill, Circular Pro 13-15px Deep Slate text. No focus ring glow — focus likely intensifies the border. Minimal padding ~12px vertical.

### Inline Underline Link
**Role:** Text-level navigation and reference links in body copy

Circular Pro 15px Deep Slate with 1px Deep Slate underline. The underline sits below the baseline with small offset. No color change on hover — weight or opacity shift only. This is the most-used interactive element after ghost buttons.

### Footer
**Role:** Site footer with link columns and legal text

Likely Deep Slate (#3b505a) background with white (#ffffff) or Mist text. Circular Pro 12-13px. Organized in multi-column link groups with uppercase column headers. Hairline 1px dividers in a lighter slate between groups.

## Do's and Don'ts

### Do
- Use Libre Caslon Condensed weight 400 at 32px, 52px, or 120px only — no other sizes, no bold variants, no italics
- Apply 0px border-radius to every surface, button, card, input, badge, and image — sharpness is non-negotiable
- Use ghost text links (Circular Pro 13px, uppercase, 1px underline, Deep Slate #3b505a) as the primary CTA pattern instead of filled buttons
- Maintain 8px as the base spacing unit with multiples of 8 for section and card padding, and 4-16px increments for micro-spacing
- Set the wordmark at 120px on the hero with letter-spacing -2.4px and the em-dash between FACE and FORMULA as a fixed compositional device
- Limit the palette to the eight neutral tones — no accent colors, no gradients, no chromatic highlights
- Use Mist (#f2f5f8) as the only light surface tone and Deep Slate (#3b505a) as the only dark surface tone; Soft Mist (#e6ebee) is the single step between them

### Don't
- Do not introduce any chromatic color — no greens, blues, reds, or warm accents; the 6% colorfulness is the brand
- Do not use filled buttons, pill shapes, or rounded corners — the system is entirely sharp-edged and ghost-by-default
- Do not add shadows, glows, or blur effects — depth comes from surface color contrast alone, never from elevation
- Do not use Circular Pro above 16px or in bold weight — if you need larger text, switch to Libre Caslon Condensed
- Do not use Libre Caslon Condensed below 32px — the condensed proportions become illegible at small sizes and strip the editorial signal
- Do not center body copy or multi-line text blocks — editorial layouts left-align; center only for section headlines and short labels
- Do not stack more than two typefaces on a single screen in a way that competes — the wordmark dominates or body text dominates, never both equally

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | White Canvas | `#ffffff` | Page background, full-bleed photography base |
| 1 | Mist | `#f2f5f8` | Primary light surface — product cards, section bands, input fields |
| 2 | Soft Mist | `#e6ebee` | Elevated surface for nested or secondary content blocks |
| 3 | Deep Slate | `#3b505a` | Dark accent surface for footer or inverted sections |

## Elevation

This design system deliberately avoids all shadows and elevation effects. Depth and hierarchy are created exclusively through surface color layering (White Canvas → Mist → Soft Mist → Deep Slate) and 1px hairline borders in Deep Slate or Pale Slate. There are no box-shadows, no glows, no blur effects, and no z-axis signaling — the flatness is a core brand expression of clinical, honest, science-led design.

## Imagery

Full-bleed editorial portraiture dominates the hero: close-cropped, high-key, natural-light photography of faces with visible skin texture, freckles, and natural hair movement — no retouching cues, no studio gloss. The model is the atmosphere, not the product. Product photography is equally unstyled: bottles and jars shot on pure white or light neutral backgrounds with soft natural shadows, no lifestyle context, no props, no hands. The product is presented like a museum object. Secondary editorial imagery shows Norwegian landscape (foggy fjords, muted greens and grays) with a desaturated, slightly cool color grade that matches the UI palette. Iconography is minimal — thin-line circular icons in the navigation at near-iconographic scale, barely registering as graphic elements. Overall the visual system is image-heavy in the hero but text-dominant in the body, with photography used as atmosphere rather than explanation.

## Layout

Full-bleed hero with a massive overlaid wordmark logo, navigation transparent over photography. Interior pages use a max-width ~1400px content area centered on a white canvas. Section rhythm is generous: 64px vertical gaps between bands, with sections alternating between White Canvas and Mist (#f2f5f8) surface tones to create visual breaks without dividers. Content blocks are two-column or centered single-column — never three or more columns at the body level. Product showcases use a 2-column grid with generous internal padding. Navigation is a single horizontal bar: left utility links, center wordmark, right account/cart, with a 1px hairline bottom border. The layout philosophy is magazine-spread: the hero is the cover, the interior is sequential editorial sections that read top-to-bottom with breathing room, and the footer is a compact dark-slate band. Everything is left-aligned or centered — no asymmetric or offset compositions.

## Agent Prompt Guide

**Quick Color Reference**
- text: #3b505a (primary), #202f3b (headings), #58737e (secondary)
- background: #ffffff (canvas), #f2f5f8 (surface)
- border: #3b505a (primary hairline), #cfdce7 (subtle)
- accent: none — the system is fully achromatic
- primary action: no distinct CTA color
- dark surface: #3b505a (footer/inverted sections)

**Example Component Prompts**

1. Create a hero section: full-bleed editorial portrait photograph as background. Overlaid in the top-left, 120px Libre Caslon Condensed weight 400 wordmark in #ffffff with -2.4px letter-spacing and an em-dash between brand words. Bottom-left headline block: 52px Libre Caslon Condensed in white, then 15px Circular Pro white body text, then a ghost text link in white — Circular Pro 13px uppercase, 1px underline.

2. Create a product card: #f2f5f8 background, 0px radius, 24px padding. Product image centered (white-background product shot). Top-left bestseller tag: Circular Pro 12px weight 400, uppercase, 0.2em letter-spacing, #3b505a text on #f2f5f8 fill. Product name below image in Circular Pro 15px #3b505a. No border, no shadow.

3. Create a section with editorial heading: white canvas background, 64px top padding. Centered headline at 52px Libre Caslon Condensed weight 400, #202f3b, letter-spacing -0.52px, two-line stack. Below, a two-column layout with 16px column-gap: left column is a 15px Circular Pro #3b505a body paragraph, right column is a landscape product image at 0px radius.

4. Create the top navigation: 1px bottom border in #3b505a, 16px vertical padding, transparent background. Left zone: Circular Pro 13px uppercase links in #3b505a with 12px column-gap (SHOP, COLLECTIONS, ABOUT US, SIGNATURE TREATMENTS). Center: wordmark logo in #3b505a at reduced scale. Right zone: Circular Pro 12px uppercase utilities (Ship to: Europa / EUR, SEARCH, ACCOUNT, CART) in #3b505a.

5. Create a footer: #3b505a background, 48px vertical padding, max-width 1400px centered. Three or four columns of links in Circular Pro 13px #ffffff at 80% opacity, with uppercase column headers at 12px letter-spacing 0.2em in #cfdce7. Hairline 1px #58737e divider between header zone and link zone.

## Similar Brands

- **Aesop** — Same editorial minimalism with near-monochromatic palette, serif display type, ghost text-link CTAs, and full-bleed portrait photography on white canvas
- **Glossier** — Similar achromatic light theme with sparse layouts, thin-line navigation, and product photography on pure white backgrounds — though Glossier leans pinker, the structural restraint is the shared trait
- **By Far** — Same condensed serif wordmark treatment, editorial spread layout, and hairline-border minimal navigation
- **Toteme** — Same Scandinavian quiet-luxury language: oversized serif type, full-bleed editorial photography, zero accent color, and text-link-only CTAs
- **Norse Projects** — Same Norwegian minimal heritage, muted slate-and-mist palette, and utilitarian Circular/Inter-class sans-serif paired with editorial display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-white-canvas: #ffffff;
  --color-mist: #f2f5f8;
  --color-soft-mist: #e6ebee;
  --color-pale-slate: #cfdce7;
  --color-steel: #58737e;
  --color-deep-slate: #3b505a;
  --color-deep-ink: #202f3b;
  --color-carbon: #000000;

  /* Typography — Font Families */
  --font-libre-caslon-condensed: 'Libre Caslon Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-circular-pro: 'Circular Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 2.4px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: 0.32px;
  --text-subheading: 32px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.32px;
  --text-heading: 52px;
  --leading-heading: 1.1;
  --tracking-heading: -0.52px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-47: 47px;
  --spacing-84: 84px;
  --spacing-95: 95px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-white-canvas: #ffffff;
  --surface-mist: #f2f5f8;
  --surface-soft-mist: #e6ebee;
  --surface-deep-slate: #3b505a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-white-canvas: #ffffff;
  --color-mist: #f2f5f8;
  --color-soft-mist: #e6ebee;
  --color-pale-slate: #cfdce7;
  --color-steel: #58737e;
  --color-deep-slate: #3b505a;
  --color-deep-ink: #202f3b;
  --color-carbon: #000000;

  /* Typography */
  --font-libre-caslon-condensed: 'Libre Caslon Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-circular-pro: 'Circular Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 2.4px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: 0.32px;
  --text-subheading: 32px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.32px;
  --text-heading: 52px;
  --leading-heading: 1.1;
  --tracking-heading: -0.52px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-47: 47px;
  --spacing-84: 84px;
  --spacing-95: 95px;
}
```
