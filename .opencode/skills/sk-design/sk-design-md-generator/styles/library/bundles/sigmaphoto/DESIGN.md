# Sigmaphoto — Style Reference
> Monochrome gallery for precision instruments — a hushed white room where the only color that matters is the one that asks you to act.

**Theme:** light

Sigma's site reads like a museum exhibition catalog for precision optical instruments — entirely weight-400 typography, vast whitespace, and a single vivid cobalt-blue accent that punctuates an otherwise purely monochrome experience. Product photography dominates at near-full-bleed scale, shot against dark studio gradients that let matte-black lens bodies dissolve into shadow and re-emerge as sculptural objects. The editorial restraint — centered serif headlines, tiny all-caps section labels, text-only CTAs — signals confidence through quietness, with the single blue button (#0048ff) functioning as the only raised voice in an otherwise whispered conversation. Sharp corners, no shadows, no gradients, no decorative motion: every screen is a frame around a piece of glass and metal.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Slate Ink | `#333333` | `--color-slate-ink` | Primary text, dominant borders, nav links — the workhorse dark that replaces pure black everywhere a softer edge is wanted |
| Pure White | `#ffffff` | `--color-pure-white` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Onyx Black | `#000000` | `--color-onyx-black` | Icon strokes, input borders, and hard-edge accents where maximum contrast is required |
| Warm Bone | `#faf7ef` | `--color-warm-bone` | Secondary surface — a barely-warm cream that lifts cards off pure white without introducing visible color |
| Ash Gray | `#707070` | `--color-ash-gray` | Muted helper text, secondary borders, disabled states — quieter than Slate Ink by two stops |
| Cobalt Signal | `#0048ff` | `--color-cobalt-signal` | Primary action fill — the only chromatic color in the system, reserved for CTA buttons and live action moments |
| Stone Gray | `#999999` | `--color-stone-gray` | Tertiary borders and inactive icon strokes — the quietest neutral, used only when Ash is still too loud |

## Tokens — Typography

### Sigma Sans — Navigation links, buttons, form labels, and utility micro-copy — the functional voice, compact and quiet · `--font-sigma-sans`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 13px, 16px
- **Line height:** 1.20–1.54
- **Letter spacing:** -0.3100em, 0.0050em, 0.0060em, 0.0200em
- **Role:** Navigation links, buttons, form labels, and utility micro-copy — the functional voice, compact and quiet

### Sigma Serif Head — Display and hero headlines — a high-contrast didone-style serif at regular weight only, creating editorial authority without boldness · `--font-sigma-serif-head`
- **Substitute:** Playfair Display
- **Weights:** 400
- **Sizes:** 48px, 88px
- **Line height:** 1.10–1.25
- **Letter spacing:** -0.3px at 48px, -0.5px at 88px
- **Role:** Display and hero headlines — a high-contrast didone-style serif at regular weight only, creating editorial authority without boldness

### Sigma Serif — Subheadings, body paragraphs, and mid-size editorial text — the reading voice of the site, set at regular weight with generous line-height · `--font-sigma-serif`
- **Substitute:** Cormorant Garamond
- **Weights:** 400
- **Sizes:** 16px, 24px
- **Line height:** 1.25
- **Letter spacing:** -0.3100em, 0.0030em, 0.0050em, 0.0160em
- **Role:** Subheadings, body paragraphs, and mid-size editorial text — the reading voice of the site, set at regular weight with generous line-height

### Metropolis — Rare medium-weight sans for emphasized micro-labels — the only weight above 400 in the system, used sparingly · `--font-metropolis`
- **Substitute:** Inter Medium
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.14
- **Letter spacing:** -0.0040em
- **Role:** Rare medium-weight sans for emphasized micro-labels — the only weight above 400 in the system, used sparingly

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| heading-sm | 24px | 1.25 | — | `--text-heading-sm` |
| heading | 48px | 1.25 | -0.3px | `--text-heading` |
| display | 88px | 1.1 | -0.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 184 | 184px | `--spacing-184` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 1px |
| buttons | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.5) -2px 0px 5px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Promotional Banner
**Role:** Top-of-page announcement strip

Full-width bar, #333333 background, 13px Sigma Sans weight 400 in white, centered text with a 'SHOP NOW' link on the right. Height ~40px, no padding variations. This is the darkest surface on the site and the first element users see.

### Primary Navigation Bar
**Role:** Site-wide navigation

White background, 1px #333333 bottom border. Left: section links in 13px Sigma Sans uppercase (PRODUCTS, MADE IN AIZU, INSPIRATION, SUPPORT, NEWS). Center: SIGMA wordmark in 24px Sigma Serif Head. Right: utility links (LOG IN, SEARCH, CART (0)) in 13px Sigma Sans uppercase. Height ~60px, no fill, no shadow.

### Full-Bleed Hero Image
**Role:** Primary product showcase on landing

100vw width, ~100vh height or ~600px minimum. Dark studio gradient background (charcoal to black). Single camera lens centered, photographed in dramatic isolation. No overlay UI on the hero itself. Sharp corners, no border.

### Centered Editorial Text Block
**Role:** Product introduction copy on white

White background, max-width ~600px, centered horizontally. Headline in 48px Sigma Serif Head weight 400, #333333, slight negative tracking. Body in 16px Sigma Serif weight 400, #707070, 1.54 line-height, 20px paragraph spacing. No card chrome, no background fill.

### Text-Only Link CTA
**Role:** Exploration trigger ("EXPLORE MORE")

No background, no border, no button chrome. 13px Sigma Sans uppercase, #333333, with subtle hover underline. Vertically separated from body by 24–32px. This is the default interactive element on content sections.

### Cobalt Action Button
**Role:** Primary action (cart, checkout, form submit)

Filled rectangle, #0048ff background, white text in 13–16px Sigma Sans weight 400, 11px vertical × 16px horizontal padding, 0px radius. One button type in one color — no hover state variation needed since the color itself is the rarity.

### Section Label
**Role:** Content divider between editorial blocks

13px Sigma Sans uppercase, #707070, letter-spacing 0.08em, centered above a content band. Functions as a typographic section break replacing visual dividers.

### Product Feature Banner
**Role:** Full-bleed product spotlight with overlay text

Full-viewport image with a large white headline overlaid in 48px Sigma Serif Head weight 400. The text sits at left or center, directly on the dark image. A small "EXPLORE MORE" text link appears below the headline. This is the second-level hero pattern, used after the opening section.

### Ghost Form Input
**Role:** Search and form fields

1px #333333 border, 7px vertical × 11px horizontal padding, 1px border-radius, 13–16px Sigma Sans in #333333. No fill, no focus glow — the design trusts the border to do all the work.

### Product Card (Grid Context)
**Role:** Catalog or collection grid items

White background, 0px radius, no shadow, 16px padding around a product image. Image fills card with no rounding. Product name in 16px Sigma Serif, price in 13px Sigma Sans #707070. Minimal — the image carries the visual weight.

### Search Icon Trigger
**Role:** Utility action in nav

Text label "SEARCH" in 13px Sigma Sans uppercase, #333333. No icon button — the text IS the button. Hover adds underline.

### Cart Link with Count
**Role:** Utility action in nav

Text label "CART (0)" in 13px Sigma Sans uppercase, #333333. Count is inline, no badge background, no color emphasis — zero is treated identically to ten.

### Footer Navigation
**Role:** Site map and legal links

White or #faf7ef background, multi-column link lists in 13px Sigma Sans, #333333. 1px #333333 top border separator. No newsletter signup, no social icons in primary footer — these are utility links only.

## Do's and Don'ts

### Do
- Use #0048ff only for filled primary action buttons — it is the system's single chromatic voice and loses all power if applied to anything else
- Set all headings at weight 400 — the site has no bold weights and adding them would break the editorial whisper
- Pair Sigma Serif Head for display with Sigma Serif for body — the serif-to-serif continuity is the site's typographic signature, not sans-to-serif
- Leave at least 80px of vertical breathing room between full-bleed image bands and centered text blocks
- Use the warm bone #faf7ef as a secondary surface instead of gray cards — it is warmer than gray and more distinctive than white
- Keep corners sharp: 0px radius on all cards, buttons, and images; 1px maximum on form inputs
- Place section labels (13px uppercase, #707070, 0.08em tracking) as typographic dividers between content bands rather than using visible lines

### Don't
- Do not introduce any color other than #0048ff as an accent — the 0% colorfulness is the design
- Do not use bold or semibold weights in any font — weight 400 across all roles is deliberate, not a fallback
- Do not add box-shadows to cards or buttons — the flat system relies on whitespace and borders for separation
- Do not use rounded corners above 1px on any element — sharpness communicates precision and engineering
- Do not use gradients on buttons, backgrounds, or overlays — the only gradient is the photographic studio backdrop behind products
- Do not place multiple CTA buttons of different colors on the same screen — one blue button per view is the ceiling
- Do not use icon-only buttons in the navigation — Sigma labels every action in text, even SEARCH and CART

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pure Canvas | `#ffffff` | Default page background — the white gallery wall |
| 1 | Warm Bone | `#faf7ef` | Secondary surface for cards and content blocks that need subtle separation from the canvas |
| 2 | Cobalt Signal | `#0048ff` | The only chromatic surface — reserved for primary action buttons |
| 3 | Slate Ink | `#333333` | Dark surface used for the top promotional banner and inverse panels |

## Elevation

The design is deliberately flat: no card shadows, no elevation tiers, no depth illusions. Visual separation is achieved through whitespace, hairline borders (#333333 at 1px), and background contrast — never through shadow. The only shadow detected (rgba(0,0,0,0.5) -2px 0px 5px) appears on a minor decorative element and is not a systematic elevation pattern.

## Imagery

The visual language is almost entirely large-format product photography. Each lens is shot like a museum object: single subject, centered or slightly off-center, set against a dark studio gradient that fades from charcoal to near-black. Lenses are lit to reveal knurled metal rings, engraved markings, and glass element coatings — the tactile craft of the object is the content. No lifestyle photography, no human subjects, no environmental context. Overlay headlines sit in white serif type directly on the dark image, creating a cinematic poster effect. The treatment is full-bleed, sharp-cornered, and isolationist: every image is given the entire viewport to breathe.

## Layout

The page is a vertical sequence of full-bleed product vignettes separated by narrow centered text bands. The hero opens with a single dark product photograph filling the viewport. Below the fold, a white content section presents a centered headline (48px Sigma Serif Head), short body copy (16px, ~600px max-width), and a text-only link CTA. A small all-caps section label ("NEW PRODUCT") acts as a divider. The next band returns to full-bleed imagery with overlay text. Navigation is a single-line top bar: left-aligned section links, centered serif wordmark, right-aligned utility links (LOG IN, SEARCH, CART). A dark promotional banner sits above the nav. The overall rhythm alternates between maximum-width photography and narrow centered text, with 80px vertical breathing room between bands. No multi-column grids, no card carousels, no sidebar layouts — every page is a linear editorial scroll.

## Agent Prompt Guide

**Quick Color Reference**
- text: #333333
- background: #ffffff
- secondary surface: #faf7ef
- border: #333333
- muted text: #707070
- primary action: #0048ff (filled action)

**Example Component Prompts:**

1. *Full-bleed product hero*: Viewport-height image section. Dark charcoal-to-black photographic background. No overlay text, no UI elements. Product subject centered at ~40% width. 0px radius, full-bleed.

2. *Centered editorial intro*: White background, 80px top padding. Centered headline in 48px Playfair Display weight 400, #333333, letter-spacing -0.3px. Body text in 16px Cormorant Garamond weight 400, #707070, 1.54 line-height, max-width 600px centered. 32px gap to a text-only "EXPLORE MORE" link in 13px Inter weight 400, #333333, uppercase, 0.08em letter-spacing.

3. *Cobalt action button*: Filled rectangle, #0048ff background, 0px radius, 11px vertical × 16px horizontal padding. Text: "ADD TO CART" in 13px Inter weight 400, white, uppercase, 0.08em letter-spacing.

4. *Section divider label*: White background, 48px vertical padding, centered text "NEW PRODUCT" in 13px Inter weight 400, #707070, uppercase, 0.08em letter-spacing. No horizontal rules, no borders.

5. *Navigation bar*: White background, 1px #333333 bottom border, 60px height. Left: "PRODUCTS  MADE IN AIZU  INSPIRATION  SUPPORT  NEWS" in 13px Inter uppercase #333333. Center: "SIGMA" in 24px Playfair Display weight 400 #333333. Right: "LOG IN  SEARCH  CART (0)" in 13px Inter uppercase #333333.

## Similar Brands

- **Leica Camera** — Same editorial monochrome approach with full-bleed product photography on dark backgrounds, serif wordmark, and extreme typographic restraint
- **Hasselblad** — Identical museum-gallery treatment of camera equipment — no lifestyle imagery, centered serif headlines, near-zero color palette with photography as the only visual richness
- **Bang & Olufsen** — Same product-as-sculpture photography on dark gradient backgrounds, centered navigation wordmark, and a single accent color for the rare action element
- **Aesop** — Editorial typography-first layout with generous whitespace, no decorative imagery, and extreme typographic restraint that treats products as objects worth studying

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-slate-ink: #333333;
  --color-pure-white: #ffffff;
  --color-onyx-black: #000000;
  --color-warm-bone: #faf7ef;
  --color-ash-gray: #707070;
  --color-cobalt-signal: #0048ff;
  --color-stone-gray: #999999;

  /* Typography — Font Families */
  --font-sigma-sans: 'Sigma Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sigma-serif-head: 'Sigma Serif Head', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sigma-serif: 'Sigma Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-metropolis: 'Metropolis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --text-heading: 48px;
  --leading-heading: 1.25;
  --tracking-heading: -0.3px;
  --text-display: 88px;
  --leading-display: 1.1;
  --tracking-display: -0.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-184: 184px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 1px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 1px;
  --radius-buttons: 0px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.5) -2px 0px 5px 0px;

  /* Surfaces */
  --surface-pure-canvas: #ffffff;
  --surface-warm-bone: #faf7ef;
  --surface-cobalt-signal: #0048ff;
  --surface-slate-ink: #333333;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-slate-ink: #333333;
  --color-pure-white: #ffffff;
  --color-onyx-black: #000000;
  --color-warm-bone: #faf7ef;
  --color-ash-gray: #707070;
  --color-cobalt-signal: #0048ff;
  --color-stone-gray: #999999;

  /* Typography */
  --font-sigma-sans: 'Sigma Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sigma-serif-head: 'Sigma Serif Head', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sigma-serif: 'Sigma Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-metropolis: 'Metropolis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --text-heading: 48px;
  --leading-heading: 1.25;
  --tracking-heading: -0.3px;
  --text-display: 88px;
  --leading-display: 1.1;
  --tracking-display: -0.5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-184: 184px;

  /* Border Radius */
  --radius-sm: 1px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.5) -2px 0px 5px 0px;
}
```
