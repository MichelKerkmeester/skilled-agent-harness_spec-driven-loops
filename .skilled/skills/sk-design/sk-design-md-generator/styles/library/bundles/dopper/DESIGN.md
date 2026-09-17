# Dopper — Style Reference
> Sunlit cream lagoon with a vivid blue current. A warm beige expanse where one electric blue channel and full-bleed candy-bright cards cut through like sunlight on water.

**Theme:** light

Dopper's visual language reads as a sunlit eco-counter: a warm cream canvas (#f6ecc8 hero, #fcfaf2 page body) carries generous whitespace and a single saturated blue (#0067e5) that snaps every interactive element into focus. The brand voice is confident but friendly — oversized display headlines in a custom 'Dopper' face, rounded 20px corners on every card and button, and solution blocks painted in candy-bright full fills (teal, yellow, sky, navy) that turn the product grid into a poster. Typography is dual-personality: a quirky custom display face for hero punch and a clean grotesque (Gilroy) for everything structural. The system avoids heavy shadows and decoration, instead using color blocks, generous 20px gaps, and large product imagery to create rhythm.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Navy | `#000f2e` | `--color-midnight-navy` | Primary text, headings, dark surface cards, logo wordmark — the dominant ink of the system. Deep enough to anchor the cream canvas without going pure black |
| Warm Cream | `#f6ecc8` | `--color-warm-cream` | Hero band background, alternating section backdrop — sets the warm, sunlit atmosphere of the brand |
| Soft Off-White | `#fcfaf2` | `--color-soft-off-white` | Page canvas, card surfaces, button text on filled blue — the base layer everything sits on |
| Electric Blue | `#0067e5` | `--color-electric-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Heather Violet | `#515a8a` | `--color-heather-violet` | Muted secondary text, supporting body copy — keeps longer passages from competing with the Midnight Navy headings |
| Signal Yellow | `#fed200` | `--color-signal-yellow` | Solution card fill, decorative high-energy accent — one of the candy-bright poster colors for the product grid |
| Deep Teal | `#116973` | `--color-deep-teal` | Solution card fill, decorative oceanic accent — reinforces the water brand narrative in the product grid |
| Sky Wash | `#8ab1e6` | `--color-sky-wash` | Solution card fill, soft brand-blue companion — a lighter blue tone for visual variety in card blocks |
| Black Ink | `#000000` | `--color-black-ink` | Outlined button stroke, icon strokes, text in solid dark contexts — used sparingly for maximum contrast outlines |
| Brand Blue Drift | `linear-gradient(90deg, rgb(0, 103, 229) 0px, rgb(65, 131, 217) 100%)` | `--color-brand-blue-drift` | Gradient terminus paired with Electric Blue — used in the subtle horizontal brand gradient for decorative washes |

## Tokens — Typography

### Dopper — Display hero headlines ('Hot, cold, or fizzy.') — a custom quirky face with tight line-height that sits like a poster cut-out. Substitute with Fraunces or a chunky display serif for close fidelity. · `--font-dopper`
- **Substitute:** Fraunces
- **Weights:** 400
- **Sizes:** 58px, 72px
- **Line height:** 1.00
- **Role:** Display hero headlines ('Hot, cold, or fizzy.') — a custom quirky face with tight line-height that sits like a poster cut-out. Substitute with Fraunces or a chunky display serif for close fidelity.

### Gilroy — Headlines, subheadings, card titles, body emphasis — the structural workhorse. Weight 600 for section headings ('Explore our solutions'), 700 for card titles, 400 for body. Substitute with Manrope or Outfit. · `--font-gilroy`
- **Substitute:** Manrope
- **Weights:** 400, 600, 700
- **Sizes:** 18px, 20px, 24px, 27px, 43px, 48px
- **Line height:** 1.10, 1.20, 1.30
- **Role:** Headlines, subheadings, card titles, body emphasis — the structural workhorse. Weight 600 for section headings ('Explore our solutions'), 700 for card titles, 400 for body. Substitute with Manrope or Outfit.

### -apple-system — System fallback for utility text and small body — inherits platform-native rhythm. · `--font-apple-system`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **Role:** System fallback for utility text and small body — inherits platform-native rhythm.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.3 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 27px | 1.2 | — | `--text-heading-sm` |
| heading | 43px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.1 | — | `--text-heading-lg` |
| display | 72px | 1 | — | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 20px |
| images | 20px |
| buttons | 20px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Header with centered logo, grouped nav items, utility links

White-translucent bar on cream canvas. Left group: 'Bottle', 'Travel Mug', 'Tap', 'Mission', 'Get Involved' (each with dropdown chevrons). Center: Dopper wordmark in Electric Blue (#0067e5). Right group: 'Find a Store' (link), 'For Businesses' (bold link), 'EN' locale, cart icon. No background fill, sits on the cream page.

### Filled Blue Action Button
**Role:** Primary action

Background #0067e5, text #fcfaf2, weight 600, ~16px font, 20px border-radius, ~20px horizontal padding × ~12px vertical. Rounded pill-adjacent shape (20px not full pill). Used for the most important action on each screen.

### Outlined Dark Action Button
**Role:** Secondary action paired with primary

Transparent fill, 1.5px black (#000000) border, black text, weight 600, 20px border-radius, matching padding to filled button. Always appears alongside the filled blue button in hero and feature blocks.

### Hero Band
**Role:** Full-bleed opening section

Background #f6ecc8 cream, no max-width constraint — the band stretches edge to edge. Display headline (Dopper 72px weight 400) sits left-aligned in the lower half. Body subtext (18px, Midnight Navy) follows. Two-button CTA cluster left-aligned. Downward chevron at the bottom center hints at scroll.

### Marquee Ticker
**Role:** Scrolling announcement strip

Sits between the hero and the feature section. Repeating 'new' word (Gilroy 27px weight 700, Midnight Navy) alternating with Electric Blue water droplet icons. Single horizontal row, no background, just inline text + icon rhythm.

### Feature Block (Image + Copy)
**Role:** Two-column product highlight

Left: large product imagery with 20px rounded corners, no shadow. Right: heading (Gilroy 43px weight 600, Midnight Navy) and supporting body (18px). Vertically centered alignment, generous gap (40-60px) between columns.

### Solution Card — Teal Variant
**Role:** Product solution tile

Background #116973 Deep Teal, 20px radius, full-bleed colored surface. Card title (Gilroy 27px weight 700, white) at top, descriptive copy (16px, white) below, product image filling lower portion, 'Learn more' link (white, underlined) at bottom-left.

### Solution Card — Yellow Variant
**Role:** Product solution tile

Background #fed200 Signal Yellow, 20px radius. Same structure as teal variant: title, copy, product image, 'Learn more' link. Title and body in Midnight Navy (#000f2e) for contrast against the bright yellow.

### Solution Card — Electric Blue Variant
**Role:** Product solution tile

Background #0067e5 Electric Blue, 20px radius. Title and body in #fcfaf2 off-white. Features the Tap product image with a stylized water drop graphic.

### Solution Card — Sky Blue Variant
**Role:** Product solution tile

Background #8ab1e6 Sky Wash, 20px radius. Title and body in Midnight Navy (#000f2e) for readability against the lighter blue. Features the Map product with green location pins.

### Solution Card — Photo Variant
**Role:** Product solution tile with real photography

Full-bleed lifestyle photo (people on paddleboards) as card surface, 20px radius. White title and copy overlay the photograph at the top, 'Learn more' link in white at bottom.

### Section Heading
**Role:** Intro for content grids

Gilroy 48px weight 700, Midnight Navy (#000f2e), left-aligned. No underline or accent — relies on size and weight alone. Pairs with a max-width container and generous top margin (~70-80px) before the grid.

### Inline Link / 'Learn More'
**Role:** Card-level navigation

Underlined text link, Gilroy 16px weight 600, color matches the card surface context (white on dark/colored cards, Midnight Navy on light cards). Sits at the bottom-left of every solution card.

## Do's and Don'ts

### Do
- Use 20px border-radius on every card, button, and product image — consistency creates the rounded warm identity.
- Default to the #f6ecc8 cream band for hero and alternating section backgrounds, and #fcfaf2 for the main page canvas.
- Use Gilroy weight 700 for card titles and section headings, weight 600 for buttons and subheadings, weight 400 for body.
- Pair the filled Electric Blue button (#0067e5) with the outlined black button on every hero — the duo is the signature action pattern.
- Keep the Solution Card grid to 5 equal-width columns at desktop; the candy-bright color variety only works as a complete set.
- Use the Dopper display face only at 58px or larger, weight 400, with tight 1.0 line-height — it's a poster face, not a body face.
- Maintain 20px gaps within cards and 40-60px gaps between major layout elements for the comfortable spacious density.

### Don't
- Don't add drop shadows to cards or images — the system is intentionally flat, depth comes from color blocks.
- Don't use pure white (#ffffff) for the canvas — always use #fcfaf2 to preserve the warm cream undertone.
- Don't introduce more than one button style per screen — filled blue for primary, outlined black for secondary, nothing else.
- Don't use the Dopper display face for anything smaller than 48px — it loses its quirky character at body sizes.
- Don't dilute the cream hero band with images or gradients — the emptiness is the design.
- Don't use gray neutrals for body text — Midnight Navy (#000f2e) and Heather Violet (#515a8a) are the two text tones.
- Don't break the 20px radius rule with sharp 0px corners on cards or buttons; the 9999px pill is reserved for tags only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fcfaf2` | Default page background, off-white warm base |
| 1 | Hero Cream | `#f6ecc8` | Full-bleed hero band and alternating section backdrop |
| 2 | Solution Cards | `#0067e5` | Colorful product solution tiles, each card a different brand hue |
| 3 | Navy Block | `#000f2` | Dark surface for contrast sections, text-heavy blocks |

## Elevation

- **Solution cards, feature block images, hero product imagery:** `none — zero shadow. Depth comes from 20px corner radius and color contrast against the cream canvas, not from drop shadows.`

## Imagery

Product photography is tight-cropped and dominant — bottles, taps, and map graphics fill their containers with no decorative context. The hero section uses massive whitespace instead of a hero image, letting the display headline own the frame. Solution cards mix product photography with a real lifestyle photo (paddleboarders) for human warmth. Colors in imagery are vibrant and saturated to match the candy-bright card palette. The only iconography is the Electric Blue water droplet, used as a small repeating brand mark in the marquee.

## Layout

The page uses a centered max-width container (~1200-1280px) for all content, but hero and section backgrounds stretch full-bleed. The hero is left-aligned text on a cream band, no hero image — just typography breathing in space. Below the hero, a horizontal marquee strip breaks the vertical flow. Content sections alternate: the feature block is a 2-column text-right/image-left composition, then a 5-column card grid of equal-width colored tiles. Navigation is a minimal top bar with centered logo. Vertical rhythm is generous — ~70-80px between major sections — creating a poster-like pace rather than a dense information layout.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #fcfaf2
- hero/section band: #f6ecc8
- text: #000f2e
- border/stroke: #000000
- accent: #0067e5
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Solution card (teal variant)*: 20px border-radius, background #116973, padding 20px. Title 27px Gilroy weight 700 #fcfaf2. Body 16px Gilroy weight 400 #fcfaf2. Product image filling lower 60% of card, 0px radius on image (rounded by parent overflow). 'Learn more' link at bottom: 16px Gilroy weight 600 #fcfaf2, underlined.

3. *Section heading + card grid*: 48px Gilroy weight 700 #000f2e, left-aligned, 0-80px top margin. Below: 5-column equal-width grid with 20px column gap. Each card: 20px radius, full-bleed color fill, product image, title, 'Learn more' link.

4. *Marquee ticker row*: Single horizontal flex row, no background, 20px row padding. Repeating pair: 'new' in 27px Gilroy weight 700 #000f2e, 20px gap, water droplet icon in #0067e5 at 24px size, 40px gap, repeat.

5. *Feature block (image + copy)*: Two-column grid, 40px column gap. Left column: product image with 20px border-radius, no shadow. Right column: 43px Gilroy weight 600 #000f2e heading, 18px Gilroy weight 400 #000f2e body text, vertically centered. Outer container: max-width 1200px, 80px top/bottom margin.

## Similar Brands

- **BKR** — Same warm cream aesthetic with rounded product photography and a single saturated accent — the water bottle space shares this sunlit clean palette.
- **Chilly's** — Rounded 20px corners on every card, oversized display headlines, and a candy-bright product grid of colored tiles — the poster-card layout language is nearly identical.
- **Hydroflask** — Vivid full-bleed color blocks in the product grid and a flat no-shadow card system — both rely on color saturation instead of elevation for visual hierarchy.
- **S'well** — Generous whitespace, large custom-feeling display type for hero punch, and a single brand blue that appears in logo, CTA, and small repeated marks.
- **Boll & Branch** — Warm cream hero bands with massive left-aligned display headlines and no hero image — the text-on-cream approach to opening pages.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-navy: #000f2e;
  --color-warm-cream: #f6ecc8;
  --color-soft-off-white: #fcfaf2;
  --color-electric-blue: #0067e5;
  --color-heather-violet: #515a8a;
  --color-signal-yellow: #fed200;
  --color-deep-teal: #116973;
  --color-sky-wash: #8ab1e6;
  --color-black-ink: #000000;
  --color-brand-blue-drift: #4183d9;
  --gradient-brand-blue-drift: linear-gradient(90deg, rgb(0, 103, 229) 0px, rgb(65, 131, 217) 100%);

  /* Typography — Font Families */
  --font-dopper: 'Dopper', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.2;
  --text-heading: 43px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-page-canvas: #fcfaf2;
  --surface-hero-cream: #f6ecc8;
  --surface-solution-cards: #0067e5;
  --surface-navy-block: #000f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-navy: #000f2e;
  --color-warm-cream: #f6ecc8;
  --color-soft-off-white: #fcfaf2;
  --color-electric-blue: #0067e5;
  --color-heather-violet: #515a8a;
  --color-signal-yellow: #fed200;
  --color-deep-teal: #116973;
  --color-sky-wash: #8ab1e6;
  --color-black-ink: #000000;
  --color-brand-blue-drift: #4183d9;

  /* Typography */
  --font-dopper: 'Dopper', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.2;
  --text-heading: 43px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;
}
```
