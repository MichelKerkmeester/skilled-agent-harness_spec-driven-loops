# Le Puzz — Style Reference
> Sunny Sunday circular — a yellow tabloid stuffed with puzzles.

**Theme:** light

Le Puzz is a maximalist boutique e-commerce system built on a two-color foundation: an aggressively saturated honeycomb yellow paired with pure black, floated on a cool pearl-gray canvas. The personality is vintage-newspaper-meets-puzzle-box — Times serif for body copy and a custom display serif (Times Now) for headlines, deliberately bucking the sans-serif e-commerce convention. The interface itself stays quiet and grid-driven so the photographed product packaging (dense, illustrated, toy-stuffed compositions) can carry the visual drama. UI controls are weighty: black-bordered buttons on yellow fills, pill-shaped badges, 12px-radius cards, and generous letter-spacing on small caps that gives even a "QUICK ADD" button editorial swagger.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Honeycomb Yellow | `#ffd931` | `--color-honeycomb-yellow` | Primary brand color, header band, primary action buttons, nav active state, link underline color, accent fills — the one chromatic note everything else orbits around |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary text, heavy borders, button outlines, icon strokes, nav text — the structural ink of the entire system |
| Ink Black | `#231f20` | `--color-ink-black` | Secondary text, body copy, button borders, input borders — a slightly warmer near-black for softer reading |
| Pearl Gray | `#c8cbcd` | `--color-pearl-gray` | Page canvas, product card backgrounds, the cool stage on which yellow and black perform |
| Fog Gray | `#a6a8aa` | `--color-fog-gray` | Muted badge surfaces, secondary chip backgrounds, low-emphasis UI fills |
| Smoke Line | `#d6d6d6` | `--color-smoke-line` | Hairline dividers, subtle table/card separators |

## Tokens — Typography

### Times Now — Display and heading serif — used for hero headlines, product names, and section titles. The ultralight 100 weight at 47px creates a tall, almost compressed editorial feel; the condensed letterforms (lineHeight 0.87–0.90) let large headlines sit close to their supporting copy, mimicking a printed poster. · `--font-times-now`
- **Substitute:** Playfair Display, DM Serif Display, or GT Sectra
- **Weights:** 100, 400
- **Sizes:** 16px, 23px, 27px, 47px
- **Line height:** 0.87, 0.90, 1.15, 1.56, 1.93
- **Role:** Display and heading serif — used for hero headlines, product names, and section titles. The ultralight 100 weight at 47px creates a tall, almost compressed editorial feel; the condensed letterforms (lineHeight 0.87–0.90) let large headlines sit close to their supporting copy, mimicking a printed poster.

### Times — Body copy serif — an unexpected choice for e-commerce that gives the whole site a literary, catalog-like voice. The tight 1.15 line-height keeps paragraph blocks compact and readable. · `--font-times`
- **Substitute:** Times New Roman, Source Serif Pro, Lora
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.15
- **Role:** Body copy serif — an unexpected choice for e-commerce that gives the whole site a literary, catalog-like voice. The tight 1.15 line-height keeps paragraph blocks compact and readable.

### Helvetica Neue — Small UI labels, button text, micro-copy — set in 11px with generous letter-spacing (0.0730em) to create an all-caps editorial feel even at body temperature · `--font-helvetica-neue`
- **Substitute:** Helvetica, Inter, Neue Haas Grotesk
- **Weights:** 100, 400
- **Sizes:** 11px
- **Line height:** 1.15, 2.27
- **Letter spacing:** 0.0730em
- **Role:** Small UI labels, button text, micro-copy — set in 11px with generous letter-spacing (0.0730em) to create an all-caps editorial feel even at body temperature

### Helvetica — Navigation, links, utility text, large numbers — the utility sans that handles everything Times can't. Letter-spacing of 0.0630–0.0910em on small sizes gives all-caps nav items a wide, confident gait. · `--font-helvetica`
- **Substitute:** Helvetica, Arial, Inter
- **Weights:** 100, 300, 400
- **Sizes:** 11px, 13px, 14px, 16px, 40px
- **Line height:** 0.90, 1.15, 1.38, 1.56, 2.63
- **Letter spacing:** 0.0630em at 13px, 0.0730em at 11px, 0.0770em at 11px, 0.0910em at 11px
- **Role:** Navigation, links, utility text, large numbers — the utility sans that handles everything Times can't. Letter-spacing of 0.0630–0.0910em on small sizes gives all-caps nav items a wide, confident gait.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.15 | 0.8px | `--text-caption` |
| body | 16px | 1.15 | — | `--text-body` |
| subheading | 23px | 1.15 | — | `--text-subheading` |
| heading-sm | 27px | 0.9 | — | `--text-heading-sm` |
| heading | 40px | 0.9 | — | `--text-heading` |
| display | 47px | 0.87 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 70 | 70px | `--spacing-70` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 12px |
| buttons | 12px |
| heroImages | 40-55px |
| pillButtons | 25px |
| productImages | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 30-40px
- **Card padding:** 15px
- **Element gap:** 15px

## Components

### Yellow Primary Button
**Role:** Primary call-to-action (Add to Cart, Quick Add, Shop All)

Filled Honeycomb Yellow (#ffd931) background, Carbon Black (#000000) 1-2px border, black text in Helvetica 11px at 0.0730em letter-spacing, 12px border-radius, ~6px 14px padding, uppercase tracking. The 15.2:1 contrast against black text makes the label feel stamped on.

### Outlined Nav Button
**Role:** Navigation and secondary actions (Shop All, Merch, About, Sign in)

Transparent or Pearl Gray fill, Carbon Black 1-2px solid border, black text at 11px Helvetica with 0.0630em tracking, 12px radius, ~10px vertical padding. Sits directly on the yellow header band as black-outlined cells.

### Ghost Text Link
**Role:** Inline links, nav text, footer links

No background, Carbon Black text, often with a black 1px underline (328 occurrences of black link border). 14px Helvetica with 0.0770em letter-spacing on small variants.

### Product Card
**Role:** Individual puzzle listing in grid

Pearl Gray (#c8cbcd) background, 12px border-radius, product image fills card with ~12px corner radius, product name in Times serif italic below, price in black bold, Honeycomb Yellow 'QUICK ADD' pill button at the bottom edge.

### Header Bar
**Role:** Site-wide top navigation

Full-width Honeycomb Yellow (#ffd931) band, 1-2px Carbon Black bottom border, centered logotype in Times Now display weight, flanked by email signup (left) and shipping/cart (right). Nav row below with outlined buttons on the same yellow.

### Quick Add Pill
**Role:** One-tap purchase on product cards

Honeycomb Yellow fill, Carbon Black text, fully rounded ends (25px radius), 11px Helvetica uppercase, sits as a compact action chip at the base of each product card.

### Hero Feature Block
**Role:** Featured collection showcase

Large centered photographic hero (person holding puzzle boxes) with rounded corners (40-55px radius), 23-27px Times Now headline, body description in Times serif 16px, no gradient — the photography carries the drama.

### Search Icon
**Role:** Header utility

Carbon Black outlined magnifier, 16-20px size, sits inline with right-rail header text on yellow background.

### Tag/Badge
**Role:** Labels, categories, status indicators

Fog Gray (#a6a8aa) or Pearl Gray background, Carbon Black text, 12px radius, 11px Helvetica uppercase with 0.0730em letter-spacing, 2-5px padding.

### Footer Section
**Role:** Site footer

Light background with Carbon Black text, 1px black hairline borders, Times serif body copy, narrow column layout with generous 15px gaps.

### Input Field
**Role:** Email signup, search, form fields

Transparent or white fill, 1-2px Carbon Black border, black placeholder text, 11-14px serif or sans, minimal 1-2px vertical padding. Border-bottom emphasis style on some inputs.

### Price Label
**Role:** Product price display

Carbon Black, bold, 14-16px Helvetica or Times, sits directly under product title with no decoration — the price is a statement, not a highlight.

## Do's and Don'ts

### Do
- Use Honeycomb Yellow (#ffd931) as the singular chromatic accent — it should appear on the header band, primary CTAs, and at most one element per viewport
- Pair every yellow surface with a 1-2px Carbon Black (#000000) border to maintain the stamped/printed look
- Set body copy in Times serif at 16px / 1.15 line-height — resist the urge to switch to sans-serif for 'readability'
- Apply 0.0630–0.0910em letter-spacing to all 11px Helvetica text (nav, buttons, micro-copy) to create an editorial small-caps feel
- Use 12px border-radius as the workhorse for cards, buttons, badges, and product images
- Let product photography fill the visual role — keep UI surfaces flat and quiet so packaging art can carry the drama
- Maintain the 15:1 minimum contrast between text and background — never soften black to gray for large text

### Don't
- Don't introduce additional chromatic colors — the system is monochrome black/white with one yellow accent, any second hue breaks the identity
- Don't use drop shadows, glows, or blur effects — depth comes from borders and color contrast, not elevation
- Don't set body text in Helvetica or any sans-serif — the serif is the signature
- Don't round corners above 12px on standard components — reserve 25px+ for pill buttons and hero images only
- Don't use low-contrast gray text on the yellow background — black at 15.2:1 is the only acceptable combination
- Don't center-align long-form paragraphs — left-align Times body copy to preserve editorial rhythm
- Don't apply gradients to any surface — the system is entirely flat, gradients would break the printed-catalog metaphor

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#c8cbcd` | Cool pearl background that lets the yellow pop |
| 1 | Product Card | `#ffd931` | Yellow surfaces for featured/highlighted areas |
| 2 | Elevated Section | `#a6a8aa` | Fog gray for badge/chip clusters and secondary groupings |
| 3 | Ink Surface | `#231f20` | Near-black for inverted text or strong contrast zones |

## Elevation

- **Product Cards:** `none — flat with 12px border-radius`
- **Buttons:** `none — flat fills with 1-2px black borders`
- **Header:** `none — anchored by 1-2px black bottom border`

## Imagery

Product photography is the dominant visual element. Puzzle boxes are shot frontally on white/neutral backgrounds, then placed on a warm blue or natural studio backdrop. The hero features a person holding multiple puzzle boxes — a lifestyle product shot with candid energy. The packaging itself is dense, illustrative, and maximalist: crowds of toys, food items, and characters in bright primary colors with thick black outlines, designed to look like a children's book illustration exploded across a 500-piece jigsaw. No abstract graphics, no 3D renders, no iconography beyond a single search magnifier — the puzzles ARE the visual language.

## Layout

Classic e-commerce grid with a strong editorial frame. The header is a full-bleed Honeycomb Yellow band with a 1-2px black border below, containing centered logotype and a secondary outlined-button nav row. Below, a centered welcome headline in Times Now sits above a 3-column product grid on a Pearl Gray canvas. The hero is a centered photographic block with rounded corners (40-55px) flanked by two product cards. Section rhythm is consistent: large vertical breathing room (30-40px section gaps), alternating yellow and gray surfaces, and a max-width of ~1200px centered on the page. Product cards are uniform in size, arranged in a clean 3-column grid with 15px gaps. The layout is symmetrical and grid-locked — no asymmetric compositions, no overlapping elements.

## Agent Prompt Guide

## Quick Color Reference
- Background: #c8cbcd (Pearl Gray)
- Text: #000000 (Carbon Black)
- Border: #000000 (Carbon Black), 1-2px
- Accent: #ffd931 (Honeycomb Yellow)
- primary action: #ffd931 (filled action)

## Example Component Prompts
1. **Product Card**: Pearl Gray (#c8cbcd) background, 12px radius. Product image fills card with 12px corner radius. Product name in Times serif 16px italic, #000000. Price in Helvetica 14px bold, #000000. Honeycomb Yellow (#ffd931) 'QUICK ADD' pill button: 25px radius, 1px black border, 11px Helvetica uppercase at 0.0730em letter-spacing, black text.

2. **Header Bar**: Full-width Honeycomb Yellow (#ffd931) band, 2px Carbon Black (#000000) bottom border. Centered logo in Times Now 47px weight 100. Below: row of outlined nav buttons — transparent fill, 1px black border, 12px radius, 11px Helvetica uppercase at 0.0630em letter-spacing.

3. **Hero Headline**: Times Now 40px weight 100, #000000, line-height 0.90, centered on Pearl Gray canvas. Subtext in Times serif 16px, #231f20, centered, max-width 600px.

4. **Outlined Nav Button**: Transparent fill, 1px Carbon Black border, 12px radius, 10px 14px padding, 11px Helvetica weight 400 at 0.0630em letter-spacing, uppercase, #000000 text.

5. **Product Grid Section**: Pearl Gray (#c8cbcd) canvas, 3-column grid with 15px gaps, max-width 1200px centered. Each card: 12px radius, product image with 12px image radius, 15px padding, name and price stacked below.

## Similar Brands

- **Areaware** — Same maximalist product-photography-forward e-commerce with flat color backgrounds and thick black borders on packaging art
- **Mudpuppy (puzzles)** — Same illustrated puzzle packaging aesthetic with dense character/object compositions on bright primary-color boxes
- **Chronicle Books** — Same editorial catalog feel — Times serif body copy, generous letter-spacing on small caps, quiet canvas that lets product art dominate
- **MoMA Design Store** — Same flat-design product grid with a single brand color accent and serif-driven editorial voice
- **Firebox** — Same playful product-first e-commerce with thick black borders, centered grid, and maximalist product photography as the visual hero

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-honeycomb-yellow: #ffd931;
  --color-carbon-black: #000000;
  --color-ink-black: #231f20;
  --color-pearl-gray: #c8cbcd;
  --color-fog-gray: #a6a8aa;
  --color-smoke-line: #d6d6d6;

  /* Typography — Font Families */
  --font-times-now: 'Times Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.15;
  --tracking-caption: 0.8px;
  --text-body: 16px;
  --leading-body: 1.15;
  --text-subheading: 23px;
  --leading-subheading: 1.15;
  --text-heading-sm: 27px;
  --leading-heading-sm: 0.9;
  --text-heading: 40px;
  --leading-heading: 0.9;
  --text-display: 47px;
  --leading-display: 0.87;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-70: 70px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 30-40px;
  --card-padding: 15px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 55px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 12px;
  --radius-buttons: 12px;
  --radius-heroimages: 40-55px;
  --radius-pillbuttons: 25px;
  --radius-productimages: 12px;

  /* Surfaces */
  --surface-page-canvas: #c8cbcd;
  --surface-product-card: #ffd931;
  --surface-elevated-section: #a6a8aa;
  --surface-ink-surface: #231f20;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-honeycomb-yellow: #ffd931;
  --color-carbon-black: #000000;
  --color-ink-black: #231f20;
  --color-pearl-gray: #c8cbcd;
  --color-fog-gray: #a6a8aa;
  --color-smoke-line: #d6d6d6;

  /* Typography */
  --font-times-now: 'Times Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.15;
  --tracking-caption: 0.8px;
  --text-body: 16px;
  --leading-body: 1.15;
  --text-subheading: 23px;
  --leading-subheading: 1.15;
  --text-heading-sm: 27px;
  --leading-heading-sm: 0.9;
  --text-heading: 40px;
  --leading-heading: 0.9;
  --text-display: 47px;
  --leading-display: 0.87;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-70: 70px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 55px;
}
```
