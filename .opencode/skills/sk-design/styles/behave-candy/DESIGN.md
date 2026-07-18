# BEHAVE Candy — Style Reference
> neon candy-aisle pop. A single electric cobalt carries every word, chartreuse lime stabs through as the only accent, and pale lavender makes the whole thing feel lit from within rather than printed.

**Theme:** light

BEHAVE candy speaks in a maximalist candy-aisle visual language: a single dominant cobalt blue carries every word, border, and icon, while electric chartreuse lime punctuates only the moments that need to act or shout. The canvas is pale lavender rather than white, which makes the cobalt feel like neon signage rather than corporate navy. Photography is editorial and full-bleed — close-cropped people mid-bite, rows of gummy bears — and text is almost entirely the brand blue, never black or gray. Components are soft-cornered but not pillowy: cards carry a 20px radius and thin cobalt outlines, buttons sit at a tighter 7px radius, and type runs tight (-0.05em at display sizes) to give the wide headlines a compressed, almost squished punch. The overall feeling is unapologetically loud, friendly, and slightly bratty — built for a single product category, not a platform.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cobalt Surge | `#061fff` | `--color-cobalt-surge` | Headlines, body text, card borders, nav links, icons, and the filled primary CTA — this is the single voice of the brand and appears in nearly every context including input outlines. Saturated blue at near-maximum chroma reads as neon rather than corporate |
| Sour Lime | `#d3ff56` | `--color-sour-lime` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Blush Puck | `#ffcfd1` | `--color-blush-puck` | Product card fills behind the flavor name — a warm pink that softens the cobalt/lime intensity and reads as candy packaging rather than UI chrome |
| Lavender Mist | `#efe5ff` | `--color-lavender-mist` | Primary page canvas — every content section between photographic full-bleeds lives on this pale lavender. Replaces what would normally be white or light gray |
| Lilac Bloom | `#ceb3ff` | `--color-lilac-bloom` | Elevated card surface — a step up from Lavender Mist for highlighted panels or hover states where a card needs to rise off the canvas without using a shadow |
| Soft Lilac | `#dfceff` | `--color-soft-lilac` | Input field background — sits between the lavender canvas and the Lilac Bloom elevated surface, giving form fields a subtle fill without introducing a new hue |
| Paper White | `#ffffff` | `--color-paper-white` | Headline text on photographic full-bleeds, text inside filled cobalt CTAs, and the gummy bear product row. White does not appear as a page background |

## Tokens — Typography

### Good Sans — Sole typeface across every UI surface — nav, body, card titles, hero, footer, buttons. Custom geometric sans with extremely tight tracking at large sizes (-0.05em at 86px through 56px) that compresses wide display lines into a dense, almost squished block. The 400 weight carries body text, 500 for nav and card titles, 700 for display. The aggressive negative letter-spacing on headlines is the signature — most sans-serif brands open up tracking at large sizes, BEHAVE closes it. · `--font-good-sans`
- **Substitute:** Inter, DM Sans, or Space Grotesk
- **Weights:** 400, 500, 700
- **Sizes:** 12, 14, 16, 18, 22, 24, 32, 53, 56, 72, 86
- **Line height:** 1.0, 1.1, 1.15, 1.2, 1.3, 1.5, 1.51, 2.14, 2.5
- **Letter spacing:** -0.05em at 56px and above, -0.022em at 32px, -0.02em at 24px, -0.016em at 18px, -0.015em at 16px and below
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Sole typeface across every UI surface — nav, body, card titles, hero, footer, buttons. Custom geometric sans with extremely tight tracking at large sizes (-0.05em at 86px through 56px) that compresses wide display lines into a dense, almost squished block. The 400 weight carries body text, 500 for nav and card titles, 700 for display. The aggressive negative letter-spacing on headlines is the signature — most sans-serif brands open up tracking at large sizes, BEHAVE closes it.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 2.5 | -0.18px | `--text-caption` |
| body-sm | 14px | 2.14 | -0.21px | `--text-body-sm` |
| body | 16px | 1.5 | -0.24px | `--text-body` |
| body-lg | 18px | 1.5 | -0.29px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.48px | `--text-subheading` |
| heading-sm | 32px | 1.15 | -0.7px | `--text-heading-sm` |
| heading | 56px | 1.1 | -2.8px | `--text-heading` |
| heading-lg | 72px | 1 | -3.6px | `--text-heading-lg` |
| display | 86px | 1 | -4.3px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 55 | 55px | `--spacing-55` |
| 58 | 58px | `--spacing-58` |
| 100 | 100px | `--spacing-100` |
| 110 | 110px | `--spacing-110` |
| 120 | 120px | `--spacing-120` |
| 151 | 151px | `--spacing-151` |
| 220 | 220px | `--spacing-220` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| inputs | 6.95px |
| buttons | 6.95px |
| arrowButtons | 25px |

### Layout

- **Section gap:** 100px
- **Card padding:** 29px
- **Element gap:** 20-30px

## Components

### Announcement Bar
**Role:** Top-of-page promo strip

Full-bleed Cobalt Surge (#061fff) background, white text at 12-14px weight 400, star glyphs flanking the message. Height ~40px, no padding variation, no rounded corners. Sits above the nav and persists across all pages.

### Primary Navigation Bar
**Role:** Site nav

Lavender Mist (#efe5ff) background, Cobalt Surge text at 12px weight 500 (line-height 2.5 for vertical centering), uppercase nav links left-aligned, logo wordmark center, account and cart icons right-aligned with 25px paddingBottom. No visible border or shadow — relies on the lavender canvas for separation from the announcement bar.

### Primary CTA Button (Filled Cobalt)
**Role:** Main action — purchase, shop, submit

Cobalt Surge (#061fff) background, white text at 16-18px weight 500, uppercase tracking normal, 6.95px border radius, padding 55px horizontal × 10px vertical. Full-bleed feel from the wide horizontal padding. Pairs with a 1px Cobalt Surge border as backup when used on lavender.

### Secondary CTA Button (Filled Lime)
**Role:** Secondary action — shop, learn more

Sour Lime (#d3ff56) background, Cobalt Surge text at 16px weight 500, 6.95px radius, similar generous horizontal padding to the primary. Used when the page already has a Cobalt filled CTA and needs a second color to prevent same-on-same collision.

### Carousel Arrow Button
**Role:** Horizontal scroll navigation for product rails

Sour Lime (#d3ff56) background, Cobalt Surge arrow icon, 25px border radius (capsule shape, ~30-40px tall), 10px padding. Sits as a floating circle on the left/right edge of the product card rail.

### Product Category Card
**Role:** Card in the flavor-collection horizontal rail

Blush Puck (#ffcfd1) background fill, 1px Cobalt Surge border, 20px border radius, ~29px padding. Centered stack: flavor list (Cobalt, 14-16px weight 500), product name (Cobalt, 32px weight 700, tight tracking), pack size (Cobalt, 14px weight 400). No shadow — the border does the lifting.

### Feature Shape (Gummy Bear Silhouette)
**Role:** Oversized brand illustration that anchors a content section

Sour Lime (#d3ff56) solid fill, rendered as a giant gummy bear or candy shape at 300-500px wide. Cobalt Surge quote text sits inside or beside it at 14-16px. No stroke, no shadow — the shape is pure flat color.

### Product Row Card
**Role:** Horizontal gummy bear product showcase

Blush Puck (#ffcfd1) background, 1px Cobalt Surge border, 20px radius, contains a single horizontal row of ~12 gummy bear product photos tightly cropped, no gaps. Cobalt Surge caption text below the row.

### Hero Section
**Role:** First screen of the homepage

Full-bleed photographic background (vivid amber/orange tones, person mid-bite, candies suspended in air). Display headline (86px, white, weight 700, -0.05em tracking) anchored bottom-left over a ~50% width column. Primary CTA below the headline. No nav inside the hero — the nav floats above it.

### Input Field
**Role:** Form input for email capture, search, account

Soft Lilac (#dfceff) background fill, no visible border, 6.95px radius, 10px vertical padding. Placeholder text in Cobalt Surge at 14px. Focus state intensifies the fill toward Lilac Bloom (#ceb3ff).

### Footer
**Role:** Bottom of page

Lavender Mist background matching the canvas, Cobalt Surge links and body text at 14-16px, separated by thin Cobalt Surge hairlines. No logo block prominence — the wordmark is implied through the nav.

## Do's and Don'ts

### Do
- Use Cobalt Surge (#061fff) for every piece of body text, heading, nav link, and card border — never introduce a secondary text color.
- Use Sour Lime (#d3ff56) only for filled actions and the feature shape — treat it as punctuation, not as a surface.
- Set heading letter-spacing to -0.05em at 56px and above; the compressed tracking is the signature.
- Give every card a 1px Cobalt Surge border and a 20px radius — borders do the lifting, not shadows.
- Default to Lavender Mist (#efe5ff) as the page background; reserve white for text on photographic full-bleeds and for the gummy bear product row.
- Use the 86px / 72px / 56px display sizes for hero and section headlines — BEHAVE does not have a mid-weight headline tier.
- Pair a Cobalt filled CTA with a Lime filled secondary CTA on the same screen; never put two Cobalt CTAs side by side.

### Don't
- Do not use black, gray, or any neutral text color — the brand is fully chromatic, and gray will read as broken.
- Do not add box-shadow elevation to cards — the system uses 1px Cobalt borders against the lavender canvas for depth.
- Do not use the Lime as a background for large content areas; it belongs to single moments, not surfaces.
- Do not open up letter-spacing on large headlines — the negative tracking is what makes the type read as BEHAVE rather than a default sans.
- Do not introduce pill-shaped buttons with 9999px radius for general CTAs — the 6.95px radius is tight on purpose.
- Do not place text directly on a full-bleed photo without a dark or warm wash; the hero uses white type because the photo is dark enough to hold 7.9:1 contrast.
- Do not add a third accent color — Cobalt and Lime are the entire chromatic vocabulary beyond the lavender family.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#efe5ff` | Lavender Mist — the base surface every content section sits on between full-bleed photographic blocks. |
| 1 | Product Card | `#ffcfd1` | Blush Puck — card fill for flavor collections, distinguishes product cards from the canvas without using elevation. |
| 2 | Input Field | `#dfceff` | Soft Lilac — one step toward Lilac Bloom from the canvas, used for form field fills. |
| 3 | Elevated Card / Hover | `#ceb3ff` | Lilac Bloom — highest neutral surface, used sparingly for highlighted panels or hover states. |

## Elevation

The design avoids box-shadows entirely. Depth is created through a three-step lavender surface scale (#efe5ff → #dfceff → #ceb3ff) and through 1px Cobalt Surge (#061fff) borders on cards. The only non-surface-based depth cue is the contrast between a full-bleed photographic section and the lavender content sections, which are separated by clean cuts rather than gradients or fade.

## Imagery

Editorial, full-bleed photography dominates the hero and section breaks — tight crops of a single subject mid-action (a person eating candy, candies suspended mid-air) with warm, saturated color treatment. The amber/orange hero photo is the only warm color in the system and reads as a deliberate contrast to the cool cobalt/lavender palette. Product photography is straightforward and unstyled: rows of gummy bears tightly packed at uniform size on a pink card. There are no illustrations in the traditional sense, but oversized flat-color gummy bear silhouettes in Sour Lime function as illustration. Icons are minimal — small cobalt glyphs for account, cart, and social. No lifestyle staging, no props beyond the product itself.

## Layout

Full-bleed page model — no max-width container, sections break to the viewport edges. The hero is a full-bleed photographic panel with a left-anchored text column (50% width max) and a bottom-left CTA. Product sections use a horizontally scrollable 3-column card rail (with a 4th card peeking to telegraph the scroll), floated arrow buttons on each edge. Feature sections are centered single-column stacks on the lavender canvas, anchored by a giant flat-color gummy bear shape. Vertical rhythm is spacious — roughly 100px between sections — and the page alternates between photographic full-bleeds and lavender content bands in a 1:1 rhythm. Nav is a single top bar, sticky, no hamburger; account and cart sit on the right, wordmark centered, links left.

## Agent Prompt Guide

**Quick Color Reference**
- text: #061fff (Cobalt Surge) — every word, every border
- background: #efe5ff (Lavender Mist) — page canvas
- border: #061fff — 1px on every card
- accent: #d3ff56 (Sour Lime) — CTAs and feature shapes only
- card fill: #ffcfd1 (Blush Puck) — product cards
- primary action: #d3ff56 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #d3ff56 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Product Category Card**: Blush Puck (#ffcfd1) fill, 1px Cobalt Surge border, 20px radius, 29px padding. Centered stack: flavor list at 14px Cobalt Surge weight 500, product name at 32px Cobalt Surge weight 700 with -0.7px tracking, pack size at 14px Cobalt Surge weight 400. No shadow.

3. **Carousel Arrow Button**: Sour Lime (#d3ff56) circle, 25px radius, Cobalt Surge arrow icon centered, 10px padding. Floats at the vertical midpoint on the left or right edge of the product rail.

4. **Feature Section with Gummy Bear**: Lavender Mist (#efe5ff) background. Center a 400px tall Sour Lime (#d3ff56) flat gummy bear silhouette. Below it, a 14px Cobalt Surge italic quote at 18px line-height 1.5.

5. **Announcement Bar**: Full-bleed Cobalt Surge (#061fff), white 12px text reading '★ TRY OUR SAMPLER PACK FOR JUST $15 ★', 40px tall, no rounded corners, no border.

## Similar Brands

- **Olipop** — Same single-dominant-chromatic-text approach — Olipop's UI uses one vivid color for nearly all type and borders against a soft tinted canvas, with a bright acid accent for CTAs.
- **Magic Spoon** — Bold candy-aisle palette with saturated primaries, playful editorial photography, and tight sans-serif display type — the same maximalist product-forward language.
- **Hi-Chew** — Candy brand visuals that lean on full-bleed saturated product photography and bright single-color chrome rather than restrained e-commerce conventions.
- **Graza** — Single dominant brand color used for text, borders, and icons against a soft tinted canvas, with a tight compressed display sans as the type signature.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cobalt-surge: #061fff;
  --color-sour-lime: #d3ff56;
  --color-blush-puck: #ffcfd1;
  --color-lavender-mist: #efe5ff;
  --color-lilac-bloom: #ceb3ff;
  --color-soft-lilac: #dfceff;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-good-sans: 'Good Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2.5;
  --tracking-caption: -0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 2.14;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.29px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.7px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -2.8px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -3.6px;
  --text-display: 86px;
  --leading-display: 1;
  --tracking-display: -4.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-55: 55px;
  --spacing-58: 58px;
  --spacing-100: 100px;
  --spacing-110: 110px;
  --spacing-120: 120px;
  --spacing-151: 151px;
  --spacing-220: 220px;

  /* Layout */
  --section-gap: 100px;
  --card-padding: 29px;
  --element-gap: 20-30px;

  /* Border Radius */
  --radius-md: 6.95px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-inputs: 6.95px;
  --radius-buttons: 6.95px;
  --radius-arrowbuttons: 25px;

  /* Surfaces */
  --surface-page-canvas: #efe5ff;
  --surface-product-card: #ffcfd1;
  --surface-input-field: #dfceff;
  --surface-elevated-card-hover: #ceb3ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cobalt-surge: #061fff;
  --color-sour-lime: #d3ff56;
  --color-blush-puck: #ffcfd1;
  --color-lavender-mist: #efe5ff;
  --color-lilac-bloom: #ceb3ff;
  --color-soft-lilac: #dfceff;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-good-sans: 'Good Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2.5;
  --tracking-caption: -0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 2.14;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.29px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.7px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -2.8px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -3.6px;
  --text-display: 86px;
  --leading-display: 1;
  --tracking-display: -4.3px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-55: 55px;
  --spacing-58: 58px;
  --spacing-100: 100px;
  --spacing-110: 110px;
  --spacing-120: 120px;
  --spacing-151: 151px;
  --spacing-220: 220px;

  /* Border Radius */
  --radius-md: 6.95px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
}
```
