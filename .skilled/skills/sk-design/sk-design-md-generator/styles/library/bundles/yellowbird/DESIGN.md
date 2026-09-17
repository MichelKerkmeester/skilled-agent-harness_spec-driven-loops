# Yellowbird® — Style Reference
> Retro condiment billboard in midday sun — a single yellow plane under a black sun, every letter drawn with a fat marker.

The system breathes through color contrast, not elevation: yellow on yellow separated by thick black strokes, with cream cards as the only neutral relief.

**Theme:** light

Yellowbird is a high-volume, two-color world: a single vivid yellow floods every section while black does all the structural and typographic work. The page reads like a hand-drawn condiment billboard — flat surfaces, thick hairline borders instead of shadows, generous breathing room, and a custom chunky display face that turns the wordmark into the hero. There is no gradient depth, no glassmorphism, no card-on-card layering; spatial separation comes from color swaps (yellow band → cream card → black button) and generous padding. Interactive elements stay minimal and confident: most surfaces are borderless on the yellow canvas, product cards use a 30px radius and a solid black stroke, and the one true CTA is a heavy black pill-shaped button with white text. The blue (#007aff) appears only as a ghost-button border for secondary actions, making it feel borrowed rather than owned.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sunglow | `#ffe845` | `--color-sunglow` | Brand canvas — the dominant page background across all sections, hero, footer, and announcement bar; also fills product category tags and sticker burst shapes |
| Sauce Bottle Black | `#000000` | `--color-sauce-bottle-black` | Primary text, all borders and hairlines, product card strokes, mascot linework, and the filled primary action button background — does the heavy structural and typographic lifting |
| Pure White | `#ffffff` | `--color-pure-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Buttermilk | `#fbfaf2` | `--color-buttermilk` | Alternate card surface for quieter product tiles — an off-white that reads as warm cream against the saturated yellow canvas |
| Cool Link Blue | `#007aff` | `--color-cool-link-blue` | Ghost/outlined secondary action border — a borrowed utility color for low-emphasis links, never used for filled buttons or primary navigation |

## Tokens — Typography

### Gooper — Signature wordmark display — the massive 'Yellowbird' logotype and any oversized display headings; a custom bubbly, ultra-chunky display face that functions as the brand's icon. Tight tracking (-0.028em) keeps the rounded forms from feeling wobbly at 91px · `--font-gooper`
- **Substitute:** Bagel Fat One, Fraunces 900, or Bowlby One
- **Weights:** 400, 700
- **Sizes:** 91px
- **Line height:** 1.05
- **Letter spacing:** -0.0280em
- **Role:** Signature wordmark display — the massive 'Yellowbird' logotype and any oversized display headings; a custom bubbly, ultra-chunky display face that functions as the brand's icon. Tight tracking (-0.028em) keeps the rounded forms from feeling wobbly at 91px

### ABC Monument Grotesk — Primary workhorse — nav links, body copy, product names, section headings, button text, footer, and hero subhead. The single weight (400) carries all roles from 14px caption to 61px hero subhead, unified by negative tracking that tightens as size grows (-0.04em at 14px to -0.011em at 61px) · `--font-abc-monument-grotesk`
- **Substitute:** Inter, GT America, Söhne, or General Sans
- **Weights:** 400
- **Sizes:** 14px, 18px, 27px, 30px, 41px, 45px, 61px
- **Line height:** 0.87, 0.90, 1.00, 1.10, 1.20, 1.30, 1.67
- **Letter spacing:** -0.0400em, -0.0300em, -0.0140em, -0.0110em, -0.0070em, -0.0060em
- **Role:** Primary workhorse — nav links, body copy, product names, section headings, button text, footer, and hero subhead. The single weight (400) carries all roles from 14px caption to 61px hero subhead, unified by negative tracking that tightens as size grows (-0.04em at 14px to -0.011em at 61px)

### Pitch Sans — Secondary utility — used for badges, tags, micro-labels, and supporting metadata where a slightly more compact feel is needed. Weight 600 for badge text adds the only weight contrast in the system · `--font-pitch-sans`
- **Substitute:** Söhne, Inter, or Untitled Sans
- **Weights:** 400, 600
- **Sizes:** 16px, 18px, 27px
- **Line height:** 0.84, 1.00, 1.20, 1.30, 1.46
- **Letter spacing:** -0.0310em, -0.0120em, -0.0110em, 0.0500em
- **Role:** Secondary utility — used for badges, tags, micro-labels, and supporting metadata where a slightly more compact feel is needed. Weight 600 for badge text adds the only weight contrast in the system

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | -0.56px | `--text-caption` |
| body-sm | 16px | 1.3 | -0.18px | `--text-body-sm` |
| body | 18px | 1.3 | -0.18px | `--text-body` |
| subheading | 27px | 1.2 | -0.57px | `--text-subheading` |
| heading | 41px | 1.1 | -0.45px | `--text-heading` |
| heading-lg | 61px | 0.9 | -0.67px | `--text-heading-lg` |
| display | 91px | 1.05 | -2.55px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 30px |
| images | 30px |
| buttons | 14px |
| stickers | 36px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 20px

## Components

### Announcement Bar
**Role:** Slim site-wide utility bar above the nav

Full-width #000000 background, ~36px tall, centered white text in Monument Grotesk 14px. Used for shipping promos and trust signals. No padding beyond vertical centering.

### Primary Navigation Header
**Role:** Main site nav anchored to the top of every page

#ffe845 background, full-bleed. Left-aligned nav links (SHOP, ABOUT, FIND US) and right-aligned utility links (SEARCH, LOG IN, CART) in Monument Grotesk 18px, #000000, all caps, letter-spacing -0.011em. The bird-mark logo sits centered as a small inline icon. No background, no border — nav floats on the yellow canvas.

### Hero Wordmark Block
**Role:** Above-the-fold brand statement replacing a typical headline+subhead+CTA

Full-bleed #ffe845 section. Centered Gooper 91px 'Yellowbird' wordmark in #000000 with the spiky-bird mascot illustration overlapping the top of the letters. No subtitle, no CTA — the wordmark IS the hero. Vertical padding ~80px above and below.

### Hero Subhead Paragraph
**Role:** Long-form intro text under the hero wordmark

Monument Grotesk 45px, weight 400, line-height 1.0, letter-spacing -0.014em, #000000, centered, max-width ~900px. Black text on yellow — no background card. This is the largest running text in the system.

### Product Card
**Role:** Primary commerce tile for sauce SKUs in the featured grid

White (#ffffff) or cream (#fbfaf2) background, 1.5–2px solid #000000 border, 30px border-radius. ~24px internal padding. Product image centered, category badge overlaid at top-center, product name in Monument Grotesk 18–27px below. No shadow — separation comes from the black stroke against the yellow page.

### Product Category Badge
**Role:** Label tag overlaid on product cards (CLASSIC, ORGANIC, SMALL BATCH)

#ffe845 fill with 1.5px #000000 border, 6px border-radius, ~15px vertical and ~18px horizontal padding. Pitch Sans 16px weight 600, #000000, all caps. Sits at the top-center of the product card, slightly overlapping the card edge.

### Primary Action Button
**Role:** The single filled CTA — used for SHOP ALL and checkout actions

#000000 fill, #ffffff text, 14px border-radius, ~15px vertical and ~18px horizontal padding. Monument Grotesk 18px weight 400, all caps, letter-spacing -0.011em. No border, no shadow, no hover lift — sits flat like a sticker on the yellow canvas.

### Ghost Secondary Action
**Role:** Outlined secondary button for lower-emphasis links

Transparent fill, 1.5px #007aff border, 10px border-radius, ~10px vertical and ~18px horizontal padding. Monument Grotesk 18px, #007aff text. The only place blue enters the system — treats blue as borrowed utility, not brand.

### Starburst Sticker
**Role:** Decorative seal/burst shape for callouts and trust signals

#ffe845 fill with #000000 stroke, 36px border-radius, hand-drawn jagged edge approximation. Monument Grotesk 18px, weight 400, #000000, all caps, slightly rotated (~5°). Used sparingly as a visual exclamation point — never more than one per viewport.

### Testimonial Quote Block
**Role:** Full-width customer quote band

#ffe845 background, no card. Monument Grotesk 45px italic-feel weight 400, #000000, centered, with opening/closing curly quotes rendered extra-large. Attribution in Pitch Sans 16px, letter-spacing 0.05em (the only positive tracking in the system), all caps, #000000. Carousel arrow controls sit at the left/right edges in #000000.

### Section Divider
**Role:** Horizontal separator between content bands

Thin 1px #000000 hairline spanning the full content width. Used sparingly — most section separation comes from color swap, not a visible line.

### Starburst Mascot Mark
**Role:** Small brand icon used in nav center and testimonial accent

#000000 linework illustration of a spiky-feathered cartoon bird face, ~40px tall in nav, larger in testimonial accent. No fill, no color — pure black ink on yellow.

## Do's and Don'ts

### Do
- Use #ffe845 as the full-bleed canvas for every full-width section — hero, product grids, testimonials, and footer should all sit on yellow, never on white or gray
- Set body and heading copy in Monument Grotesk weight 400 only; the system has no bold weight for this face, so hierarchy comes from size and tracking, not weight
- Use 30px border-radius on all product cards and images; 14px on primary buttons; 6px on category badges — these three radii define the shape language
- Separate sections by color swap (yellow band → cream card → yellow band), not by shadows or dividers — the design is deliberately flat
- Use the Gooper 91px display face only for the wordmark and equivalent brand statements; never for product names, body, or UI text
- Size all CTAs in Monument Grotesk 18px all caps with -0.011em tracking — consistency in button typography is a signature
- Apply the starburst sticker pattern to exactly one callout per viewport — it loses impact as a repeated motif

### Don't
- Never introduce a new chromatic color beyond the yellow/black/white/cream/blue set — the system's power is its two-color discipline
- Never add drop shadows, inner glows, or blur effects to cards or buttons — separation comes from solid black strokes, not elevation
- Never use the blue (#007aff) as a filled button background or for navigation; it is a ghost-border utility color only
- Never use a font weight heavier than 400 for Monument Grotesk; the face doesn't ship bold, and faking bold breaks the geometric evenness
- Never place body copy on white over the yellow canvas without a card surface — floating text on white feels broken; always commit to cream or pure white as a card surface
- Never use positive letter-spacing on body or display text — the only positive tracking (0.05em) is reserved for Pitch Sans testimonial attributions
- Never reduce the wordmark below 61px or substitute a standard display face for Gooper; the bubbly custom face is the brand's most recognizable element

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Sunglow Canvas | `#ffe845` | Full-bleed page background for every section including hero, product grid, testimonial band, and footer |
| 2 | Cream Card | `#fbfaf2` | Alternate product tile background for lower-prominence SKUs |
| 3 | White Card | `#ffffff` | Primary product card surface sitting on the yellow canvas |
| 4 | Black Button | `#000000` | Primary action surface — the single filled CTA pattern |

## Elevation

The design intentionally avoids shadows. Spatial separation is achieved exclusively through: (1) color contrast — yellow surfaces against black-bordered white cards, (2) thick solid 1.5–2px black strokes on all elevated elements, and (3) generous padding. There is no z-axis hierarchy — the system is deliberately flat, reading more like screen-printed packaging than a typical depth-using SaaS UI. Adding even a subtle shadow would break the printed-poster feel that defines the brand.

## Imagery

Product photography is tight, centered, and isolated on pure white card backgrounds — bottles are shot straight-on with no lifestyle context, no hands, no food pairings. The hero wordmark is paired with a hand-drawn black-line cartoon bird mascot (spiky feathers, expressive eyes, no color fill) that functions as a secondary brand asset. A hand-drawn starburst sticker shape with jagged edges appears as a decorative seal. No full-bleed photography, no video, no abstract gradients — imagery is limited to: (1) clean white-background product shots, (2) black-line mascot illustrations, and (3) the hand-drawn starburst. Iconography is entirely custom and line-art based, rendered in solid black on yellow.

## Layout

Full-bleed yellow canvas with no max-width constraint on background color. Content is max-width ~1280px centered. The hero is a centered wordmark + mascot stack with a large subhead paragraph below, followed by a 3-column product card grid (3 visible products per row at desktop). Sections are separated by color swap rather than by dividers or shadow changes — the rhythm reads as yellow → yellow-band-with-cream-cards → yellow → yellow. Navigation is a single full-bleed horizontal bar at the top, no sticky behavior implied, no sidebar. The product grid uses uniform card sizing with equal gutters. Below the grid, a centered SHOP ALL button acts as the section closer. A testimonial band follows at full viewport width with side-edge carousel arrows, then the footer. Vertical rhythm is generous: ~80px between major sections, ~24px between cards and internal card elements.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #ffe845
- Text: #000000
- Card surface: #ffffff
- Alternate card: #fbfaf2
- Border/stroke: #000000
- primary action: #ffe845 (filled action)
- Secondary action: #007aff (outlined ghost border only)

**3-5 Example Component Prompts**

1. **Product Card**: White (#ffffff) background, 1.5px solid #000000 border, 30px border-radius, 24px padding. Centered sauce bottle product image. Category badge overlaid at top-center: #ffe845 fill, 1.5px #000000 border, 6px radius, Pitch Sans 16px weight 600, all caps, #000000. Product name below in Monument Grotesk 27px, #000000, letter-spacing -0.011em.

2. Create a Primary Action Button: #ffe845 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Hero Subhead Paragraph**: Full-bleed #ffe845 background, no card. Monument Grotesk 45px, weight 400, line-height 1.0, letter-spacing -0.014em, #000000, centered, max-width 900px. ~80px vertical padding above and below.

4. **Starburst Sticker**: #ffe845 fill, 1.5px #000000 stroke, 36px border-radius with hand-drawn jagged edge, rotated ~5°. Monument Grotesk 18px, weight 400, #000000, all caps, centered inside. Place at top-right of viewport as a single decorative callout.

5. **Testimonial Quote Section**: Full-bleed #ffe845 background. Monument Grotesk 45px, weight 400, #000000, centered, with oversized curly quotes. Attribution in Pitch Sans 16px, letter-spacing 0.05em, all caps, #000000, below the quote. Carousel arrow controls in #000000 at the far left and right edges.

## Similar Brands

- **HEATONIST** — Same saturated yellow-and-black hot-sauce brand palette with thick custom display typography and flat card-based product grids
- **Cholula** — Bold condiment branding with a single dominant brand color, custom display wordmark, and flat illustration-driven mascot identity
- **Omsom** — High-contrast packaging-forward food brand using thick black strokes, saturated canvas colors, and a flat no-shadow component language
- **Fly By Jing** — Premium condiment brand with playful illustrated mascot, oversized custom display type, and a two-color identity system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sunglow: #ffe845;
  --color-sauce-bottle-black: #000000;
  --color-pure-white: #ffffff;
  --color-buttermilk: #fbfaf2;
  --color-cool-link-blue: #007aff;

  /* Typography — Font Families */
  --font-gooper: 'Gooper', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-monument-grotesk: 'ABC Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pitch-sans: 'Pitch Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.56px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.18px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-subheading: 27px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.57px;
  --text-heading: 41px;
  --leading-heading: 1.1;
  --tracking-heading: -0.45px;
  --text-heading-lg: 61px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -0.67px;
  --text-display: 91px;
  --leading-display: 1.05;
  --tracking-display: -2.55px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-3xl: 30px;
  --radius-3xl-2: 36px;

  /* Named Radii */
  --radius-tags: 6px;
  --radius-cards: 30px;
  --radius-images: 30px;
  --radius-buttons: 14px;
  --radius-stickers: 36px;

  /* Surfaces */
  --surface-sunglow-canvas: #ffe845;
  --surface-cream-card: #fbfaf2;
  --surface-white-card: #ffffff;
  --surface-black-button: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sunglow: #ffe845;
  --color-sauce-bottle-black: #000000;
  --color-pure-white: #ffffff;
  --color-buttermilk: #fbfaf2;
  --color-cool-link-blue: #007aff;

  /* Typography */
  --font-gooper: 'Gooper', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-monument-grotesk: 'ABC Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pitch-sans: 'Pitch Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.56px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.18px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-subheading: 27px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.57px;
  --text-heading: 41px;
  --leading-heading: 1.1;
  --tracking-heading: -0.45px;
  --text-heading-lg: 61px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -0.67px;
  --text-display: 91px;
  --leading-display: 1.05;
  --tracking-display: -2.55px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-3xl: 30px;
  --radius-3xl-2: 36px;
}
```
