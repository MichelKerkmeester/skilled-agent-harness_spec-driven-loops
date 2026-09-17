# Gigantic — Style Reference
> punk-rock candy wrapper shouting on cream paper

**Theme:** light

Gigantic operates on a punk-rock confectionery visual language: an oversized headline voice shouting over warm cream paper, a single screaming orange-red accent, and packaging-forward product photography that treats each bar like a streetwear drop. The dominant near-black is the brand's primary action and text color — buttons are not colorful, they are assertive and monochromatic, with the orange-red reserved for product flavor coding, the footer wash, and the brand mark. Typography carries the energy: Neue Haas Grotesk Display set at near-display sizes, tracked wide and set heavy, so the type itself becomes the graphic. Whitespace is generous, the canvas is always warm (#f0ede7) rather than clinical white, and components stay flat — no shadows, no gradients, no glassmorphism — just bold ink on cream paper with a single loud accent.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#231f20` | `--color-ink-black` | Primary text, filled action buttons, nav, headings, hairline borders, product bar backgrounds |
| Cream Paper | `#f0ede7` | `--color-cream-paper` | Primary page canvas, section backgrounds, image backgrounds |
| Pure White | `#ffffff` | `--color-pure-white` | Inverted text on dark surfaces, button text, card/image backgrounds |
| Blast Red | `#ff634b` | `--color-blast-red` | Flavor-coded product accent (Salted Peanut bar), footer band, brand mark, single decorative punctuation across the cream canvas |
| True Black | `#000000` | `--color-true-black` | Minor icon strokes and print-style detail |

## Tokens — Typography

### Neue Haas Grotesk Display — Exclusive brand typeface. Weight 700 drives the hero display voice and section openers — set huge, tracked wide, the type IS the graphic. Weights 450/500 handle subheadings, nav, and product labels. Weight 400 at 14–16px with wide tracking (0.0310–0.0500em) runs body and button text. The all-caps + wide-tracking + heavy-weight combination is the signature. · `--font-neue-haas-grotesk-display`
- **Substitute:** Neue Haas Grotesk Display Pro, or free alternatives: Inter (700 for display, 500/450 medium weights are not available so use 500/600), or Neue Haas Unica Pro trial. For closest free feel: Space Grotesk at matching weights.
- **Weights:** 400, 450, 500, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 25px, 32px (plus oversized display usage beyond detected body sizes for hero text)
- **Line height:** 1.00–1.80 depending on size; tighter at display sizes, breathing room at body
- **Letter spacing:** 0.0160em (12px) → 0.0250em (14px) → 0.0280em (16px) → 0.0310em (18px) → 0.0360em (24px) → 0.0440em (25px) → 0.0500em (32px) → 0.0570–0.0580em at display sizes. Tracking widens with size — a deliberate choice that opens up heavy display letters and lets cream paper breathe between strokes.
- **OpenType features:** `If using an alternative with stylistic alternates available, the brand reads identically in standard set; no detected custom OpenType features beyond standard tracking.`
- **Role:** Exclusive brand typeface. Weight 700 drives the hero display voice and section openers — set huge, tracked wide, the type IS the graphic. Weights 450/500 handle subheadings, nav, and product labels. Weight 400 at 14–16px with wide tracking (0.0310–0.0500em) runs body and button text. The all-caps + wide-tracking + heavy-weight combination is the signature.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Letter spacing:** 0.031
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.19px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.35px | `--text-body-sm` |
| body | 16px | 1.8 | 0.45px | `--text-body` |
| subheading | 18px | 1.44 | 0.56px | `--text-subheading` |
| heading-sm | 24px | 1.3 | 0.86px | `--text-heading-sm` |
| heading-lg | 32px | 1.2 | 1.6px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 35 | 35px | `--spacing-35` |
| 50 | 50px | `--spacing-50` |
| 55 | 55px | `--spacing-55` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 30px
- **Element gap:** 20px

## Components

### Hero Display Headline
**Role:** Oversized section opener that dominates the viewport

Neue Haas Grotesk Display weight 700, set at near-viewport-bleed size (estimated 120–180px), Ink Black (#231f20) on Cream Paper (#f0ede7). Three lines stacked, line-height ~1.0, letter-spacing wide (~0.05em). Sentence case with only the final word italicized for a deliberate cadence break. The headline IS the hero — no supporting visual needed.

### Filled Ink Button
**Role:** Primary action — shop, add to cart, CTAs

Ink Black (#231f20) background, Pure White (#ffffff) text, 0px border-radius, padding 19px horizontal by 15px vertical, Neue Haas Grotesk Display weight 500 at 16px with 0.0310em tracking, all-caps. No hover state lifts or shadows — the color flip is the interaction. Width fits content (not full-width).

### Outline Ink Button
**Role:** Secondary action and product grid CTAs

Transparent background, 1px Ink Black (#231f20) border, Ink Black text, 0px radius, 19px horizontal × 15px vertical padding, same type as filled variant. The bordered rectangular form is the brand's workhorse — appears under every product card.

### Announcement Bar
**Role:** Top-of-page promo strip and product ticker

Pure White background with 1px Ink Black bottom border; text 14px weight 500 all-caps tracking 0.0250em. Scrolling ticker variant runs Ink Black on Pure White with product names cycling.

### Minimal Nav Bar
**Role:** Primary site navigation

Cream Paper background, 0px radius, left-aligned text nav links (14–16px, weight 500, tracking 0.0310em, uppercase), centered Gigantic script logo, right-aligned account + cart icons. No background, no border — floats on the canvas.

### Product Card
**Role:** Grid item for candy bar SKUs

No card chrome. White product image, product name below in Ink Black weight 700 at 24px tracking 0.0360em all-caps, then an outline button beneath. Image fills roughly 70% of card height. Cards sit on Cream Paper with 20px gaps between — no card background, no border, no shadow.

### Flavor-Coded Product Image
**Role:** Product bar photography with brand-specific accent

Each flavor box and bar wrapper carries a distinct accent color coordinated with its identity — Salted Peanut uses Blast Red (#ff634b), Almond Horchata uses warm brown, Crispy Coconut uses teal, Double Dark Mint uses green. The Gigantic script wordmark in cream/off-white sits over a halftone-dotted or grainy dark panel on each wrapper.

### Dark Feature Section
**Role:** Product variety showcase and product bar reveal

Ink Black (#231f20) full-bleed background section. Display text cut from a textured halftone/ripped-edge effect in cream and white, 100–140px weight 700. Product bar image overlaps and breaks the section boundaries — torn-edge effect where the cream above meets the ink below.

### Section Header Block
**Role:** Centered intro text under hero

Centered stack: small red icon mark (lollipop/dollar-sign variant), then 16–18px Ink Black weight 500 with 0.0310em tracking all-caps body copy at 1.5–1.7 line-height. Two to three short paragraphs max — the copy punches in short sentences with period-driven rhythm.

### Brand Script Logo
**Role:** Wordmark in nav and on packaging

Custom hand-drawn brush-script reading 'Gigantic' with a small swirl/candy decoration. Used in nav center, on product packaging, and as a stamp/seal motif. Cream color on dark packaging, Ink Black on cream canvas. No fixed type substitute — the script is a custom mark.

### Footer Band
**Role:** Closing brand statement and secondary nav

Blast Red (#ff634b) full-bleed background, Cream Paper (#f0ede7) or Pure White text. Sits as a single colored band at the page bottom — the only place where the accent color takes over a whole surface.

### Account Icon Group
**Role:** Utility icons in nav

Minimal stroke icons (account person, cart) in Ink Black, ~20px, no fill, no background. Aligned right, 19px gap between.

## Do's and Don'ts

### Do
- Use Neue Haas Grotesk Display exclusively; weight 700 for display, 500 for UI, 400 for body. No other typefaces.
- Set the canvas to Cream Paper (#f0ede7) by default. Reserve Pure White for product images and inverted text surfaces only.
- Use Ink Black (#231f20) as the primary action color for filled buttons. Make them rectangular with 0px radius, padding 19px × 15px, and 16px uppercase text with 0.0310em tracking.
- Track all text wide: 0.0250em minimum at body sizes, scaling up to 0.0570em at display sizes. Tight tracking breaks the brand voice.
- Reserve Blast Red (#ff634b) for three uses only: flavor-coded product packaging, the footer band, and the brand mark. Never as a button fill or body text accent.
- Make the hero headline oversized and sentence-case, with the final word optionally italicized for a cadence break. The type is the hero — no supporting visual.
- Separate sections with hard color transitions (cream → black → cream), not with whitespace or dividers. Full-bleed, not padded.

### Don't
- Do not add shadows, gradients, or any form of elevation. Surfaces stay flat.
- Do not round corners on buttons, cards, images, or tags. 0px radius is the signature.
- Do not use Blast Red as a CTA or button background. Red is decoration; black is action.
- Do not set body text in sentence case at large sizes — body and UI text should be uppercase with wide tracking.
- Do not use multiple accent colors or introduce new hues. The palette is mononeutral + one red.
- Do not add illustrative graphics, lifestyle photography, or decorative backgrounds. The system is type + product photography only.
- Do not use light or thin font weights for display headlines. Weight 700 is the only display weight.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f0ede7` | Primary page canvas — every section sits on this warm off-white |
| 1 | Pure White | `#ffffff` | Card/product image backgrounds, elevated content blocks |
| 2 | Ink Black | `#231f20` | Dark feature sections, product bar background, button fills |
| 3 | Blast Red | `#ff634b` | Flavor-coded product surfaces and footer wash |

## Elevation

No shadows anywhere. Depth is achieved through color contrast, full-bleed dark sections, and product photography that physically overlaps section boundaries (torn-edge effect on the product bar reveal). Surfaces are flat — elevation is a non-concept in this system. The Ink Black filled button does not sit 'above' the page; it IS the page in another tone.

## Imagery

Product photography is the entire visual system beyond type. Each candy bar/bar wrapper is shot on a pure white or warm cream backdrop, perfectly square or upright portrait, filling the frame — the object IS the hero, no lifestyle context, no hands, no props. The variety section uses a single dramatic full-bleed product bar image with a torn-paper/ragged-edge effect that breaks across the cream-to-black transition, giving a punk-zine ripped-poster feel. Halftone dots and grain texture overlay the dark sections and product packaging for a printed/risograph aesthetic. Icons are stroke-only line icons, single-weight, no fills. No illustrations, no abstract graphics, no lifestyle photography — every visual is either type, the product, or the brand mark.

## Layout

Full-width sections with content centered to ~1200px max. Hero is a single centered oversized headline on cream — no image, no side-by-side. The page flows: announcement bar → minimal nav → centered hero text → small intro block → dark full-bleed product reveal section with torn edge → 4-column product grid on cream → red footer band. Sections are separated by hard color changes (cream → ink black → cream → red), not by dividers or generous whitespace. The product grid is the only multi-column layout — 4 equal columns with 20px gaps. Navigation is a single minimal top bar; no sidebar, no mega-menu. Vertical rhythm: hero commands ~70–80vh, dark feature section ~60vh, product grid section ~auto. No asymmetric or z-pattern compositions — everything is centered and stacked.

## Agent Prompt Guide

**Quick Color Reference**
- text: #231f20
- background: #f0ede7
- border/divider: #231f20
- accent: #ff634b
- button text: #ffffff
- primary action: #231f20 (filled action)

**3-5 Example Component Prompts**

1. **Hero Headline Block** — Cream Paper (#f0ede7) full-bleed background. Display text 'HAVE A LITTLE THRILL' centered, Neue Haas Grotesk Display weight 700 at ~140px, line-height 1.0, color #231f20, letter-spacing ~0.05em. Three lines stacked, sentence case, final word italicized. No image, no supporting visual — the type fills 70% of the viewport.

2. **Product Grid Card** — White (#ffffff) product image filling the top 70% of the card, no border, no radius. Below the image: product name in Neue Haas Grotesk Display weight 700, 24px, color #231f20, all-caps, letter-spacing 0.0360em. Then an outline button: 1px #231f20 border, 0px radius, 19px horizontal × 15px vertical padding, 16px uppercase text in #231f20 with 0.0310em tracking.

3. **Dark Feature Section** — Ink Black (#231f20) full-bleed background. Display text 'VARIETY' at ~120px weight 700 in #f0ede7, with a halftone-dot texture pattern inside the letterforms. Product bar image (candy bar on dark background with torn-paper edge) overlaps the section's top edge, breaking from the cream section above.

4. **Filled Ink Button** — Background #231f20, text #ffffff, 0px border-radius, padding 19px horizontal × 15px vertical, Neue Haas Grotesk Display weight 500 at 16px, all-caps, letter-spacing 0.0310em. Width auto-fits content. No hover lift, no shadow — only color stays flat.

5. **Footer Band** — Blast Red (#ff634b) full-bleed background, cream text (#f0ede7) for brand statement, centered, 16px Neue Haas Grotesk Display weight 500 all-caps with 0.0310em tracking. White secondary nav links above the red band, separated only by the color change — no divider line.

## Tracking Philosophy

Tracking scales with size. The brand's type voice depends on this curve: at 12px the letter-spacing is barely perceptible (0.0160em), by 16px it's 0.0280–0.0310em, and at display sizes it balloons to 0.0570–0.0580em. This widening is not a default CSS value — it is hand-tuned per role. Small text needs to read as cohesive; body text needs to feel confident and slightly editorial; display text needs the letters to breathe enough that the heavy weight doesn't become a black mass. Always set tracking explicitly, never 'normal'.

## Similar Brands

- **Tony's Chocolonely** — Same oversized display type shouting from a warm cream canvas, single-color product packaging photography, editorial brand voice with punk attitude
- **Behave (supplement brand)** — Same punk-zine aesthetic with blown-out type on cream paper, mononeutral palette with one loud accent, rectangular buttons with no radius
- **Moo (print brand)** — Same wide-tracked Neue Haas-adjacent grotesque, flat surfaces, no shadows, oversized display headlines as primary hero device
- **Graza (olive oil)** — Same single-accent-color packaging-forward photography, cream canvas with near-black type, rectangular buttons, editorial flat layout
- **Ghia (non-alcoholic beverages)** — Same warm cream background, oversized all-caps display type, single saturated accent for product variant coding, no shadows or gradients

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #231f20;
  --color-cream-paper: #f0ede7;
  --color-pure-white: #ffffff;
  --color-blast-red: #ff634b;
  --color-true-black: #000000;

  /* Typography — Font Families */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.19px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.8;
  --tracking-body: 0.45px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: 0.56px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.86px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-35: 35px;
  --spacing-50: 50px;
  --spacing-55: 55px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 30px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-cream-paper: #f0ede7;
  --surface-pure-white: #ffffff;
  --surface-ink-black: #231f20;
  --surface-blast-red: #ff634b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #231f20;
  --color-cream-paper: #f0ede7;
  --color-pure-white: #ffffff;
  --color-blast-red: #ff634b;
  --color-true-black: #000000;

  /* Typography */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.19px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.8;
  --tracking-body: 0.45px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: 0.56px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.86px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-35: 35px;
  --spacing-50: 50px;
  --spacing-55: 55px;
}
```
