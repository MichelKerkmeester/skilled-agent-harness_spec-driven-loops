# Lpalo — Style Reference
> A children's storybook spread on warm peach paper — one slab-serif headline shouting through scattered crayon doodles.

**Theme:** light

La puce à l'oreille reads like a children's storybook spread across warm peach paper — a playful podcast platform where chunky black slab-serif headlines anchor the page while vivid color accents and floating line-art illustrations dance around them. The visual rhythm is generous and unhurried: a soft peach canvas (#f6e0db) holds scattered doodles, pill-shaped containers float with thick black borders, and a single oversized headline (Alfa Slab One at near-120px) does the heavy lifting for brand voice. Components feel handmade rather than engineered — black-outlined white cards, 47px pill radii, no shadows, no gradients. Color is treated as a palette of crayons pulled from a single box: every hue is saturated and flat, used as decorative punctuation on surfaces, icons, and section backgrounds rather than as functional UI states. The contrast between the type's serious slab-serif weight and the whimsical illustrations creates the site's identity tension — authoritative voice, childlike delivery.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Peach Paper | `#f6e0db` | `--color-peach-paper` | Page canvas — the warm pastel ground that makes every black border and colored accent pop |
| Charcoal Ink | `#000000` | `--color-charcoal-ink` | Primary text, hairlines, card borders, nav outlines — the structural skeleton at 1400+ border occurrences |
| Snow | `#ffffff` | `--color-snow` | Primary page canvas and white card surfaces. Do not promote it to the primary CTA color |
| Ember Orange | `#ef724f` | `--color-ember-orange` | Decorative accent and warm card surfaces — a crayon-orange that carries the most frequency of any chromatic color across the UI |
| Magenta Pop | `#981082` | `--color-magenta-pop` | Decorative accent, nav highlight, and vivid card fills — a saturated fuchsia used as bold punctuation on the peach canvas |
| Sunbeam Yellow | `#e7db4c` | `--color-sunbeam-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Mint Wash | `#ace2df` | `--color-mint-wash` | Decorative accent and soft card surface — a desaturated teal that cools the warm palette without breaking its energy |
| Powder Blue | `#84bfff` | `--color-powder-blue` | Decorative accent and card surface — a mid-saturation sky blue appearing in the largest non-black count (60 fills), used for illustration washes |
| Lilac Tint | `#e69dff` | `--color-lilac-tint` | Decorative accent and card surface — a soft pastel pink-violet that lightens the magenta without competing |
| Lime Zest | `#6ed311` | `--color-lime-zest` | Decorative accent — high-chroma green used sparingly as playful punctuation among illustrations |
| Cobalt Spark | `#5196ff` | `--color-cobalt-spark` | Decorative accent — a single vivid blue dot in the illustration palette |

## Tokens — Typography

### Alfa Slab One — Display and editorial headlines — a single-weight chunky slab serif that carries the entire brand voice; the 46px size with tight 1.09 leading is the signature 'shouting headline' treatment, while 16px serves emphasized inline text · `--font-alfa-slab-one`
- **Substitute:** Bowlby One, Roboto Slab 900, or Recoleta Black
- **Weights:** 400
- **Sizes:** 16px, 35px, 46px
- **Line height:** 1.09–1.20
- **Role:** Display and editorial headlines — a single-weight chunky slab serif that carries the entire brand voice; the 46px size with tight 1.09 leading is the signature 'shouting headline' treatment, while 16px serves emphasized inline text

### Manrope — UI text, navigation, body copy, and large display alternates — geometric sans used for everything that isn't an Alfa Slab headline; weight 500 for nav labels, 700-800 for emphasized UI text, 400 for body; the 120px extreme is a secondary display tier · `--font-manrope`
- **Substitute:** Inter, Outfit, or Plus Jakarta Sans
- **Weights:** 400, 500, 700, 800
- **Sizes:** 12px, 25px, 34px, 50px, 120px
- **Line height:** 1.00–1.60
- **Role:** UI text, navigation, body copy, and large display alternates — geometric sans used for everything that isn't an Alfa Slab headline; weight 500 for nav labels, 700-800 for emphasized UI text, 400 for body; the 120px extreme is a secondary display tier

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 16px | 1.6 | — | `--text-body` |
| heading-sm | 25px | 1.24 | — | `--text-heading-sm` |
| subheading | 34px | 1.16 | — | `--text-subheading` |
| heading | 46px | 1.09 | — | `--text-heading` |
| heading-lg | 50px | 1.12 | — | `--text-heading-lg` |
| display | 120px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 27 | 27px | `--spacing-27` |
| 30 | 30px | `--spacing-30` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 46 | 46px | `--spacing-46` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 47px |
| cards | 40-47px |
| small | 10px |
| buttons | 47px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 46-64px
- **Card padding:** 24-40px
- **Element gap:** 8-16px

## Components

### Pill Navigation Button
**Role:** Top-bar nav item

White fill, 2px black border, 47px border-radius (fully pill-shaped), 10px vertical / 20px horizontal padding, Manrope 500 at 16px, black text. Active state swaps to a colored fill (orange, magenta, or teal). Appears in clusters of 4-5 across the header.

### Pill Dropdown Trigger
**Role:** Nav item with caret

Identical to Pill Navigation Button but includes a small orange triangle (▾) suffix indicating an expandable menu. Sits as the leftmost primary nav item.

### Outline Content Card
**Role:** General-purpose content card

White (#ffffff) fill, 2px solid black border, 40-47px border-radius, 24-40px padding, no shadow. Uses Alfa Slab One for the card title and Manrope for body text. The thick black outline on white is the signature card treatment.

### Flat Color Card
**Role:** Bold panel for featured content

Single vivid fill (Ember Orange, Magenta Pop, or Sunbeam Yellow), no border, 40-47px border-radius, 24-40px padding. Black text on top. Used sparingly as visual punctuation between white card sections.

### Display Headline Block
**Role:** Hero or section title

Alfa Slab One 400 at 46-120px, line-height 1.09-1.20, black on peach canvas. No gradient, no color treatment — the slab-serif weight alone carries impact. Often multi-line with manual line breaks creating a 'shout' rhythm.

### Line-Art Illustration
**Role:** Decorative floating graphic

Thin black-stroke line drawings (robots, headphones, cameras, cassette tapes, faces) scattered across the peach canvas at varied rotations. Each is a standalone SVG, outlined only, no fill or minimal flat fill. Functions as visual breathing room around text.

### Tilted Content Card
**Role:** Featured episode or highlight card

A white card rotated 2-4 degrees with a slight teal or lavender offset behind it, creating a hand-placed scrapbook effect. 40px radius, black border, Manrope body text, Alfa Slab One title.

### Tag Pill
**Role:** Category or filter label

Small pill (47px radius), 8px vertical / 16px horizontal padding, Manrope 700 at 12-14px. Fill can be any brand accent color with black text, or white with black border.

### Footer Link Group
**Role:** Secondary navigation block

Manrope 500 at 16px, black text, minimal spacing (8-10px between items). No borders or background — sits directly on the peach canvas.

### Event Card
**Role:** Date-specific listing card

White fill, black border, 40px radius, 15-16px padding. Features a date marker (Alfa Slab One large numerals), event title (Manrope 700), and location/meta (Manrope 400). 2-3 cards arranged in a horizontal row.

### Amplified Poster Card
**Role:** Featured visual content card

Large card with image-first layout: full-bleed illustration or poster at top, title in Alfa Slab One 35px, description in Manrope 16px, black border 2px, 47px radius. Acts as a 'magazine cover' within the content flow.

### Section Divider
**Role:** Visual separator between content blocks

A wide, thin band of solid color (alternating between Ember Orange, Mint Wash, Sunbeam Yellow, or Lilac Tint) stretching edge-to-edge, 60-100px tall. No text — pure color rhythm.

## Do's and Don'ts

### Do
- Set display headlines in Alfa Slab One at 46px or above with line-height ≤ 1.20 — the tight leading is what makes the slab serif feel like it's shouting.
- Use 47px border-radius on all primary containers (nav, cards, buttons) and 10px only for small nested elements; never use 0px or 4px radii.
- Default to the peach canvas (#f6e0db) for every section; introduce a colored card surface only when breaking visual rhythm is intentional.
- Pair 2px black borders with white fills for cards — this is the signature outlined-card language; never use shadows for elevation.
- Scatter line-art illustrations at varied rotations around text blocks rather than aligning them to a grid; asymmetry is part of the storybook feel.
- Use Manrope 500 for nav and 400 for body; reserve 700-800 for inline emphasis only — the default weight should feel conversational, not heavy.
- Pick one vivid accent color per content block (orange, magenta, yellow, teal, blue, lilac) and let it saturate a whole card or band rather than mixing hues within a single component.

### Don't
- Don't apply drop shadows, inner shadows, or any elevation effects — the design is intentionally flat with borders doing the structural work.
- Don't use gradients — all color is flat and saturated, like crayon on paper.
- Don't set Alfa Slab One below 16px — at small sizes the slab serifs become illegible noise; switch to Manrope for anything under 16px.
- Don't center-align body paragraphs — body text in Manrope reads left-aligned; centering is reserved for headlines and short labels.
- Don't use neutral grays for borders or text — all structural lines are pure black (#000000); any gray breaks the storybook ink-on-paper metaphor.
- Don't mix more than two accent colors within a single card or button — the palette is crayon-box broad, but each component should pick one crayon.
- Don't add a traditional CTA button with a solid colored fill and white text; primary actions are pill-shaped with black borders on white, or colored-fill cards, not a conventional 'Buy now' button.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Peach Canvas | `#f6e0db` | Full-page background — warm pastel base for all sections |
| 1 | Snow Card | `#ffffff` | Primary card and button fill, outlined by black borders |
| 2 | Color Card | `#ef724f` | Vivid flat card surface in orange — same color as accent, used as a bold panel |
| 3 | Mint Card | `#ace2df` | Soft teal card surface for variety within content sections |
| 4 | Lilac Card | `#e69dff` | Pastel pink-violet card surface for softer content panels |

## Elevation

The design intentionally avoids all shadows. Elevation is communicated exclusively through 2px black borders on white surfaces and through color contrast (vivid fills against the peach canvas). This is a deliberate flat-illustration aesthetic — depth would break the storybook metaphor. Components sit ON the page, not ABOVE it.

## Imagery

The visual language is hand-drawn line illustration over flat color. Illustrations are thin-stroke black outlines (headphones, robots, cassette tapes, cameras, abstract faces, musical notes) scattered at irregular rotations around text — they function as decorative atmosphere, not as explanatory content. Cards occasionally feature full-bleed illustrated posters with a children's-book quality. No photography is present. The peach canvas with floating doodles creates a scrapbook or zine feel where the page itself is the artwork. Icons are mono-line, black-stroke only, matching the illustration style.

## Layout

The page is full-bleed with no fixed max-width container — content breathes from edge to edge on the peach canvas, broken by colored bands. The hero is a centered oversized Alfa Slab One headline (multi-line, tight leading) with illustrations orbiting it on all sides at different distances and rotations. Navigation sits as a horizontal row of pill-shaped buttons in the top-left third, not spanning full width. Content sections alternate between white-outlined card grids (2-3 columns) and full-bleed colored bands that act as visual rest stops. Cards are loosely arranged with slight rotations, not locked to a rigid grid. The rhythm is spacious: 46-64px between sections, generous whitespace inside cards. Footer is minimal — a few link groups on the peach canvas with no background change. The overall density is comfortable and editorial, not information-dense.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background (canvas): #f6e0db
- card surface: #ffffff
- border: #000000 (2px solid)
- accent (warm): #ef724f (Ember Orange)
- accent (cool): #ace2df (Mint Wash)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero Headline Block**: Render a 4-line headline in Alfa Slab One 400 at 50px, line-height 1.12, color #000000, centered on a #f6e0db canvas. Surround with 3-5 scattered line-art SVG illustrations (headphones, robot, cassette) at varied rotations between -15° and +15°.

2. **Outlined Content Card**: White (#ffffff) fill, 2px solid #000000 border, 40px border-radius, 32px padding. Title in Alfa Slab One 400 at 25px black, body in Manrope 400 at 16px black with 1.6 line-height. No shadow.

3. **Pill Navigation Button**: White fill, 2px #000000 border, 47px border-radius, 10px vertical / 20px horizontal padding. Label in Manrope 500 at 16px #000000. 8px gap between adjacent pills.

4. **Flat Color Band**: Full-bleed horizontal band, 80px tall, fill #ef724f (Ember Orange). No text, no border — pure color break between content sections.

5. **Tilted Feature Card**: White card rotated 3°, 47px radius, 2px black border, 24px padding. Behind it, a slightly offset #ace2df rectangle (same dimensions) at 0° rotation, creating a scrapbook layered effect. Title in Alfa Slab One 35px, body in Manrope 16px.

6. **Tag Pill**: Fill #e7db4c (Sunbeam Yellow), 47px border-radius, 8px vertical / 16px horizontal padding, Manrope 700 at 14px #000000. One tag per accent color, never mixing fills within a group.

## Similar Brands

- **Brio magazine / Highlights for Kids** — Same children's-publication language: peach/pastel canvas, oversized slab-serif headlines, scattered hand-drawn doodles, and a crayon-box color palette applied as flat washes.
- **Mailchimp (illustration system)** — Same playful brand voice: flat vivid colors used as illustration fills, pill-shaped containers, and black-outlined white cards with zero shadow depth.
- **Headspace (early brand)** — Same generous whitespace, oversized display headlines as the primary visual anchor, and warm pastel canvas with scattered decorative line-art elements.
- **The Browser Company / Arc** — Same pill-shaped navigation, black-bordered white containers at large radii, and a refusal to use shadows — relying on border-weight and color for structure.
- **Ridmik Dictionary (or other Bangla/French playful media)** — Same storybook-on-paper feeling: a warm tinted canvas with floating line illustrations and a single bold display face carrying all typographic weight.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-peach-paper: #f6e0db;
  --color-charcoal-ink: #000000;
  --color-snow: #ffffff;
  --color-ember-orange: #ef724f;
  --color-magenta-pop: #981082;
  --color-sunbeam-yellow: #e7db4c;
  --color-mint-wash: #ace2df;
  --color-powder-blue: #84bfff;
  --color-lilac-tint: #e69dff;
  --color-lime-zest: #6ed311;
  --color-cobalt-spark: #5196ff;

  /* Typography — Font Families */
  --font-alfa-slab-one: 'Alfa Slab One', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.24;
  --text-subheading: 34px;
  --leading-subheading: 1.16;
  --text-heading: 46px;
  --leading-heading: 1.09;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.12;
  --text-display: 120px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 46-64px;
  --card-padding: 24-40px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 40px;
  --radius-3xl-2: 47px;

  /* Named Radii */
  --radius-nav: 47px;
  --radius-cards: 40-47px;
  --radius-small: 10px;
  --radius-buttons: 47px;

  /* Surfaces */
  --surface-peach-canvas: #f6e0db;
  --surface-snow-card: #ffffff;
  --surface-color-card: #ef724f;
  --surface-mint-card: #ace2df;
  --surface-lilac-card: #e69dff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-peach-paper: #f6e0db;
  --color-charcoal-ink: #000000;
  --color-snow: #ffffff;
  --color-ember-orange: #ef724f;
  --color-magenta-pop: #981082;
  --color-sunbeam-yellow: #e7db4c;
  --color-mint-wash: #ace2df;
  --color-powder-blue: #84bfff;
  --color-lilac-tint: #e69dff;
  --color-lime-zest: #6ed311;
  --color-cobalt-spark: #5196ff;

  /* Typography */
  --font-alfa-slab-one: 'Alfa Slab One', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.24;
  --text-subheading: 34px;
  --leading-subheading: 1.16;
  --text-heading: 46px;
  --leading-heading: 1.09;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.12;
  --text-display: 120px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 40px;
  --radius-3xl-2: 47px;
}
```
