# Lamanna — Style Reference
> Neon circus tent on a Naples sidewalk

**Theme:** light

Lamanna's is a maximalist Italian-bakery visual system built on screaming color confidence: a saturated orange-red canvas, sunshine-yellow display type, and a blush-pink secondary surface that act as a three-band color rhythm across the page. Type is the loudest voice — an ultra-wide, squished-black display face (Right Grotesk Spatial) set at near-zero line-height, so headlines read as massive solid blocks rather than airy typographic statements. Layout is full-bleed, edge-to-edge, with no max-width containment; sections are separated by hard color changes rather than whitespace. Decorative energy (zigzags, pointing hands, starburst badges) is integral to the brand — the system expects graphical accents everywhere rather than clean minimalism.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Anger Orange | `#ff4100` | `--color-anger-orange` | Primary brand canvas and surface fill — hero backgrounds, section dividers, and headline text. The entire site is painted in this color; restraint is not the goal |
| Sun Yellow | `#ffc700` | `--color-sun-yellow` | Display type, starburst badges, and decorative graphic fills. Sits on top of orange sections for maximum contrast and excitement |
| Royal Blue | `#1573dd` | `--color-royal-blue` | Outlined link and icon border color — used as a chromatic accent stroke for interactive elements and decorative icon outlines against the orange field |
| Charcoal | `#292a2c` | `--color-charcoal` | Primary text and structural border color. Near-black but slightly warm — softer than pure black, used for body copy, dividers, and image borders |
| Obsidian | `#000000` | `--color-obsidian` | Button borders, link text, and SVG fills. Reserved for the sharpest contrast moments where pure black is needed over lighter surfaces |
| Blush Peach | `#fdbeba` | `--color-blush-peach` | Soft secondary surface — pastel section background that breaks the orange dominance and introduces a calmer band for content |
| Cream | `#fee3c1` | `--color-cream` | Softest surface tint and decorative shape fill in pink sections. Functions as a quiet third surface level above blush |
| Lemon Cream | `#f6e653` | `--color-lemon-cream` | Secondary yellow used in decorative shapes and softer accent fills where pure sun-yellow would be too aggressive |

## Tokens — Typography

### rightgrotesk-spatialblack-webfont — Display and heading typeface. Ultra-wide, compressed-black sans with near-zero leading (0.89) that makes headlines read as solid slabs. This is the signature voice — every page must use it for its loudest statements. · `--font-rightgrotesk-spatialblack-webfont`
- **Substitute:** Bowlby One SC or Tungsten Bold
- **Weights:** 400
- **Sizes:** 18px, 24px, 30px, 36px, 54px
- **Line height:** 0.89-1.00
- **Letter spacing:** -0.0200em at 18px (-0.36px), -0.0110em at 24px (-0.26px), -0.0090em at 30px+ (-0.27px at 30, -0.32px at 36, -0.49px at 54)
- **Role:** Display and heading typeface. Ultra-wide, compressed-black sans with near-zero leading (0.89) that makes headlines read as solid slabs. This is the signature voice — every page must use it for its loudest statements.

### nimbus-sans-extended-bold — Secondary body emphasis type. Heavy negative tracking at 23px gives a chunky condensed feel for subheadings or emphasized inline copy. · `--font-nimbus-sans-extended-bold`
- **Substitute:** Helvetica Inserat or Compacta Bold
- **Weights:** 400
- **Sizes:** 23px
- **Line height:** 1.13
- **Letter spacing:** -0.0510em (-1.17px)
- **Role:** Secondary body emphasis type. Heavy negative tracking at 23px gives a chunky condensed feel for subheadings or emphasized inline copy.

### nimbus-sans-extended-regular — Extended sans for body and subheading roles where rightgrotesk would be too heavy. Tight 0.89 leading on the 36px size is an intentional match to the display voice. · `--font-nimbus-sans-extended-regular`
- **Substitute:** Helvetica Neue Extended or Roboto Condensed
- **Weights:** 400
- **Sizes:** 21px, 36px
- **Line height:** 0.89-1.48
- **Role:** Extended sans for body and subheading roles where rightgrotesk would be too heavy. Tight 0.89 leading on the 36px size is an intentional match to the display voice.

### Open Sans — Readable body and hero paragraph text. At 1.67 leading on 22px, it's the quiet voice for longer passages; at 1.00 on 18px, it acts as a dense label. · `--font-open-sans`
- **Substitute:** Open Sans (direct)
- **Weights:** 400
- **Sizes:** 18px, 22px
- **Line height:** 1.00-1.67
- **Role:** Readable body and hero paragraph text. At 1.67 leading on 22px, it's the quiet voice for longer passages; at 1.00 on 18px, it acts as a dense label.

### obviously-condensed-semibold — Link and CTA typeface. Condensed semibold for narrow, punchy action labels. · `--font-obviously-condensed-semibold`
- **Substitute:** Bebas Neue or Oswald Semibold
- **Weights:** 400
- **Sizes:** 32px
- **Line height:** 1.16
- **Role:** Link and CTA typeface. Condensed semibold for narrow, punchy action labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 18px | 1 | -0.36px | `--text-body-sm` |
| subheading | 24px | 1 | -0.26px | `--text-subheading` |
| heading-sm | 30px | 1 | -0.27px | `--text-heading-sm` |
| heading-lg | 36px | 0.89 | -0.32px | `--text-heading-lg` |
| display | 54px | 0.89 | -0.49px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 42 | 42px | `--spacing-42` |
| 43 | 43px | `--spacing-43` |
| 50 | 50px | `--spacing-50` |
| 55 | 55px | `--spacing-55` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 105 | 105px | `--spacing-105` |
| 120 | 120px | `--spacing-120` |
| 130 | 130px | `--spacing-130` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| buttons | 0px |
| starbursts | 0px |

### Layout

- **Section gap:** 60-100px
- **Element gap:** 10-20px

## Components

### Full-Bleed Hero Section
**Role:** Opening visual statement that defines the brand canvas

Anger Orange (#ff4100) background filling the entire viewport edge-to-edge with no max-width constraint. Centered logo (#292a2c) at top. Massive rightgrotesk display headline at 54px, line-height 0.89, sun-yellow (#ffc700) with -0.49px letter-spacing, breaking across full width. Decorative zigzag SVGs in #ffc700 flank the layout. A oversized product photo (pizza slice) is layered in front, sharp-edged, no radius, no shadow.

### Top Navigation Bar
**Role:** Persistent site navigation

Transparent or orange-fill bar at top, full-bleed. Left: \"SHOP MERCH\" in rightgrotesk 18px sun-yellow with a small circular icon, underlined. Center: LAMANNA'S logo mark (charcoal). Right: \"ORDER ONLINE\" in rightgrotesk 18px sun-yellow with Royal Blue (#1573dd) circular icon outline. Zero radius, zero shadow, no hover state subtlety.

### Outlined Link Button
**Role:** Primary interactive text link with visible action border

Royal Blue (#1573dd) border, 1-2px stroke, no background fill, no radius. Text in rightgrotesk 18px or obviously-condensed 32px in charcoal or black. The chromatic border is the only differentiator — no filled background variant exists. Padding roughly 6px 15px.

### Starburst Product Badge
**Role:** Featured product spotlight with energetic visual frame

Sun-yellow (#ffc700) multi-pointed star/sunburst SVG shape, zero radius on its outer points, containing a product photo centered. Sits on a blush peach (#fdbeba) section. Below: product name in rightgrotesk 18-24px charcoal. These badges are the system's primary product-card pattern — no rectangles, no shadows, just geometric sun shapes.

### 3D Drop-Shadow Headline
**Role:** Playful typographic statement with built-in depth

Right-grotesk display text in sun-yellow with a hard-edged, solid anger-orange (#ff4100) drop-shadow offset 4-6px right and down, no blur. The \"Toro\" and \"The Hall of Fame\" headlines use this treatment — it creates dimensional type without using actual CSS box-shadow blur.

### Section Color Band
**Role:** Full-width section divider

Hard color change across the full viewport — from anger-orange to blush-peach, or blush-peach to sun-yellow — with no border, no gradient, no margin transition. Sections are demarcated by chromatic contrast, not whitespace.

### Zigzag Decorative Element
**Role:** Brand-signature graphic accent

Hand-drawn or geometric zigzag lines in sun-yellow (#ffc700), 2-3px stroke, no fill, placed at section edges as visual punctuation. Reinforces the circus-tent/playful energy. Zero radius.

### Pointing Hand Graphic
**Role:** Directional call-to-action decoration

Small cartoon-style hand (in #ffc700 or charcoal) pointing toward content, used on the Hall of Fame section to direct the eye. Part of the decorative system, not a real UI element.

### Product Photo Tile
**Role:** Full-bleed product imagery

Product photography (pizza, donuts, gelato) presented as raw, uncropped, edge-touching images with no border-radius and no shadow. The product IS the card — no chrome, no padding frame, no label box around the image.

### Product Label Caption
**Role:** Short product name under a starburst badge

Two-line product name in rightgrotesk 18px charcoal, center-aligned, sitting directly below a starburst badge with ~20px vertical gap. No background, no border, no chrome.

### Logo Mark
**Role:** Brand identification at page center

LAMANNA'S wordmark in a condensed/extended bold face (nimbus-sans-extended-bold) with -1.17px letter-spacing, in charcoal (#292a2c). Centered, compact, acts as the visual anchor of the navigation bar.

### Header Strip
**Role:** Promotional or section intro band

Full-bleed anger-orange band containing large display text and a centered product image. Functions as a transitional hero between major content sections.

## Do's and Don'ts

### Do
- Use Right Grotesk Spatial (or Bowlby One SC) for all display headlines at 36px+ — this is the brand's voice, not a suggestion
- Set display headlines to line-height 0.89 so type stacks into dense solid blocks rather than airy typography
- Fill sections with solid color (anger orange, blush peach, sun yellow) edge-to-edge — never use max-width containers or card padding
- Use Royal Blue (#1573dd) only as a 1-2px outlined border on links and icons — never as a filled background
- Apply 3D drop-shadow to display headlines using a solid offset (#ff4100 shadow on #ffc700 text), never with blur
- Add zigzag and starburst decorative SVGs as visual punctuation in every section
- Let product photography bleed to the viewport edge with no radius, no border, no shadow

### Don't

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Anger Orange Canvas | `#ff4100` | Primary full-bleed page background and hero fill |
| 2 | Blush Peach Band | `#fdbeba` | Secondary section surface that breaks orange dominance |
| 3 | Cream Accent | `#fee3c1` | Softest decorative shape fill inside pink sections |

## Elevation

No elevation is used. The design system relies on hard color changes, full-bleed color bands, and offset solid-color type shadows instead of box-shadow blur. Depth is created by chromatic contrast, not by floating elements above surfaces.

## Imagery

Photography is the product hero — large, raw, uncropped food photography (pizza slices, donuts, gelato) presented edge-to-edge with no rounded corners, no shadow, and no frame. Images bleed into and out of the orange canvas as if torn from a magazine. Decorative graphic elements (zigzag lines, pointing hands, starburst shapes) are flat SVG illustrations in sun-yellow and charcoal, used as energetic punctuation throughout. No lifestyle photography, no dark moody shots — everything is high-saturation, high-energy, and shot or rendered against clean backgrounds. Icons are minimal and outlined, primarily in Royal Blue.

## Layout

Full-bleed, edge-to-edge layout with no max-width container. The page is a stack of horizontal color bands — each section fills the viewport width and is delineated by hard chromatic transitions rather than margins or borders. Hero sections are center-stacked: large display headline above a full-bleed product photo. Product showcases use a 3-column grid of starburst badges on a pink section. Navigation is a fixed top bar with left/center/right items. No sidebar, no nested containers, no card padding — every element touches the viewport edge. The overall rhythm is: orange band → orange-with-product → pink band → orange band, repeating.

## Agent Prompt Guide

Create an Outlined Primary Action: Transparent background, #1573dd border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-anger-orange: #ff4100;
  --color-sun-yellow: #ffc700;
  --color-royal-blue: #1573dd;
  --color-charcoal: #292a2c;
  --color-obsidian: #000000;
  --color-blush-peach: #fdbeba;
  --color-cream: #fee3c1;
  --color-lemon-cream: #f6e653;

  /* Typography — Font Families */
  --font-rightgrotesk-spatialblack-webfont: 'rightgrotesk-spatialblack-webfont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nimbus-sans-extended-bold: 'nimbus-sans-extended-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nimbus-sans-extended-regular: 'nimbus-sans-extended-regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-obviously-condensed-semibold: 'obviously-condensed-semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.27px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 0.89;
  --tracking-heading-lg: -0.32px;
  --text-display: 54px;
  --leading-display: 0.89;
  --tracking-display: -0.49px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-43: 43px;
  --spacing-50: 50px;
  --spacing-55: 55px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-105: 105px;
  --spacing-120: 120px;
  --spacing-130: 130px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 60-100px;
  --element-gap: 10-20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;
  --radius-starbursts: 0px;

  /* Surfaces */
  --surface-anger-orange-canvas: #ff4100;
  --surface-blush-peach-band: #fdbeba;
  --surface-cream-accent: #fee3c1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-anger-orange: #ff4100;
  --color-sun-yellow: #ffc700;
  --color-royal-blue: #1573dd;
  --color-charcoal: #292a2c;
  --color-obsidian: #000000;
  --color-blush-peach: #fdbeba;
  --color-cream: #fee3c1;
  --color-lemon-cream: #f6e653;

  /* Typography */
  --font-rightgrotesk-spatialblack-webfont: 'rightgrotesk-spatialblack-webfont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nimbus-sans-extended-bold: 'nimbus-sans-extended-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nimbus-sans-extended-regular: 'nimbus-sans-extended-regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-obviously-condensed-semibold: 'obviously-condensed-semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.27px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 0.89;
  --tracking-heading-lg: -0.32px;
  --text-display: 54px;
  --leading-display: 0.89;
  --tracking-display: -0.49px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-43: 43px;
  --spacing-50: 50px;
  --spacing-55: 55px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-105: 105px;
  --spacing-120: 120px;
  --spacing-130: 130px;
  --spacing-160: 160px;
}
```
