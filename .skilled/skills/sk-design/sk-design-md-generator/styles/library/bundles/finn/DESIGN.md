# Finn — Style Reference
> warm puppy-kissed comfort

**Theme:** mixed

Finn is a warm, approachable pet wellness brand that feels like a friendly neighborhood vet clinic: cozy without being clinical. The interface rests on a white canvas with generous breathing room, anchored by a deep warm-brown #321004 used for nearly all type — unusual for modern e-commerce, where near-black dominates — and one decisive navy-violet #161345 that powers every button, dark section, and brand mark. Sections alternate between white card surfaces and full-bleed color washes (blush pink, sky blue, teal) that match the product flavor, giving each product line its own atmospheric room without diluting the brand voice. Typography pairs a humanist geometric (Larsseit) for body and UI with an extra-condensed display face (Athletics) for big headlines, the latter carrying wide tracking that gives the page editorial confidence. Components feel light and friendly: pill-shaped buttons at 60px radius, 20px-rounded cards with no visible borders, thin 1px gray hairlines, and almost no shadow — the system trusts color blocks and whitespace to separate layers rather than elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#161345` | `--color-midnight-ink` | Primary brand navy — CTA buttons, dark section backgrounds, active nav, logo wordmark. Filled pill buttons carry white text on this surface; dark testimonial/footer bands use it as the full-bleed canvas |
| Cocoa Bean | `#321004` | `--color-cocoa-bean` | Primary text and headline color across the entire site — body copy, navigation, product names, prices, and the hero headline. This warm near-black replaces the typical neutral-black and gives the brand its human, non-corporate feel |
| Ember Orange | `#ff7f00` | `--color-ember-orange` | Vivid accent for product highlights, badge borders, and select link underlines. Used sparingly as functional punctuation — never as a full surface — to draw the eye to a specific callout without competing with the navy CTA |
| Blush Petal | `#ffcfdb` | `--color-blush-petal` | Hero section background and product-line wash. Sets the emotional tone for the first screen — warm, soft, pet-friendly. Returns in lighter tints for cards and decorative strips |
| Sky Powder | `#d7ecff` | `--color-sky-powder` | Press/logo bar background and alternate section wash. Cool counterpoint to the warm blush — gives the page rhythm as sections alternate pink and blue bands |
| Mint Tide | `#60c4bf` | `--color-mint-tide` | Calming-aid product accent and tertiary section wash. Closes the trio of pastel section colors (pink, blue, teal) that map to the product SKUs |
| Cloud White | `#ffffff` | `--color-cloud-white` | Page canvas and card surface base. The default background; also the inverse color for text on navy buttons and dark sections |
| Fog Gray | `#f9f9f9` | `--color-fog-gray` | Card and product-tile background. One shade below the white canvas — enough to lift a card off the page without a border or shadow |
| Ash Border | `#ebebeb` | `--color-ash-border` | Hairline borders, dividers, input outlines, and subtle icon strokes. Always 1px. The system uses this in place of shadow to separate layers |
| Stone Mute | `#999999` | `--color-stone-mute` | Muted helper text, secondary labels, and disabled-state chrome. Never the primary text color |

## Tokens — Typography

### Larsseit — Primary workhorse — body copy, product names, prices, button labels, navigation, form fields. Carries positive letter-spacing (~0.025–0.071em) that gives even small sizes an open, airy feel. Weight 500 anchors emphasis, 600 reserved for button text. · `--font-larsseit`
- **Substitute:** Inter, DM Sans, or Söhne
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 15px, 18px, 24px, 26px, 30px, 36px
- **Line height:** 1.40–1.67
- **Letter spacing:** 0.38px at 15px body, 0.42px at 14px, 0.63px at 18px, 1.54px at 24px, 2.13px at 30px
- **Role:** Primary workhorse — body copy, product names, prices, button labels, navigation, form fields. Carries positive letter-spacing (~0.025–0.071em) that gives even small sizes an open, airy feel. Weight 500 anchors emphasis, 600 reserved for button text.

### Athletics — Display and editorial headlines — hero statements, section titles, and the oversized endorsement quotes. Tight line-heights (as low as 0.72) and wide tracking (0.05–0.10em) give it a magazine-cover weight. This is the voice that makes "Hi! We love your dog." and "Loved by Pets, Endorsed by Vets" land. · `--font-athletics`
- **Substitute:** Druk, Compacta, or Antonio
- **Weights:** 400, 500
- **Sizes:** 30px, 36px, 64px, 83px, 85px, 96px, 133px
- **Line height:** 0.72–1.28
- **Letter spacing:** 3.2px at 64px, 9.6px at 96px, 13.3px at 133px
- **Role:** Display and editorial headlines — hero statements, section titles, and the oversized endorsement quotes. Tight line-heights (as low as 0.72) and wide tracking (0.05–0.10em) give it a magazine-cover weight. This is the voice that makes "Hi! We love your dog." and "Loved by Pets, Endorsed by Vets" land.

### Monosten — Micro-copy and tag accents — small all-caps detail labels. 0.30em letter-spacing pushes the type to feel like stamped/engraved marks on packaging. · `--font-monosten`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.40
- **Letter spacing:** 3.9px at 13px
- **Role:** Micro-copy and tag accents — small all-caps detail labels. 0.30em letter-spacing pushes the type to feel like stamped/engraved marks on packaging.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.4 | 3.9px | `--text-caption` |
| body | 15px | 1.67 | 0.38px | `--text-body` |
| body-lg | 18px | 1.6 | 0.63px | `--text-body-lg` |
| heading-sm | 24px | 1.25 | 1.54px | `--text-heading-sm` |
| heading | 26px | 1.25 | 1.65px | `--text-heading` |
| heading-lg | 30px | 1.1 | 2.13px | `--text-heading-lg` |
| display | 36px | 1.17 | 2.57px | `--text-display` |
| display-lg | 64px | 1.04 | 3.2px | `--text-display-lg` |
| display-xl | 96px | 0.72 | 9.6px | `--text-display-xl` |
| display-2xl | 133px | 0.72 | 13.3px | `--text-display-2xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| pills | 60px |
| inputs | 60px |
| buttons | 60px |
| logo/badge | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 15px

## Components

### Pill CTA Button (Filled)
**Role:** Primary action button — used for every Shop, Take Quiz, and Shop Now call-to-action.

Fully rounded pill at 60px radius. Background #161345 Midnight Ink, text #ffffff Cloud White, 15px vertical padding, 24–32px horizontal padding. Type is Larsseit 500 at 15–18px with a right arrow → glyph. No shadow. The arrow is part of the button's identity — every filled CTA pairs its label with an arrow.

### Pill Outline Button
**Role:** Secondary action when a filled navy CTA already appears in the same row.

60px radius, 1px border in #161345 Midnight Ink, text #161345, no fill. Same padding and arrow as the filled variant. Used for the second action in a button pair (e.g. 'Take Quiz' next to 'Shop Now').

### Pill Ghost Button
**Role:** Tertiary or in-content action that should not compete with the main CTA.

60px radius, no border, transparent background, text #161345 with a right arrow. Renders on white or light-pastel surfaces. Used for inline 'Shop Now →' links inside sections.

### Active Nav Pill
**Role:** Active state indicator in the top navigation bar.

40–50px radius (effectively pill), filled with #161345, white text 14px Larsseit 500. Inactive nav items are plain #321004 text with no chrome.

### Top Announcement Bar
**Role:** Shipping or promo banner above the main nav.

Full-width strip, #161345 background, centered white Larsseit 14px text at 0.025em tracking. Always uppercase or sentence-case single line.

### Product Tile Card
**Role:** Card for individual product SKUs (Allergy, Calming, Probiotics).

#f9f9f9 Fog Gray background, 20px corner radius, 24px padding. Contains a product image on a flat colored backdrop (yellow / teal / lavender) and product name in Larsseit 500 18–24px #321004. No border, no shadow — the tinted image does the visual work.

### Benefit Bullet Row
**Role:** List item on product detail blocks — e.g. 'Cleans teeth & gums'.

Inline flex row: 16–20px green checkmark icon (#3aaf3a) at left, Larsseit 400 15–18px #321004 label. Vertical gap 9–10px between rows. No background or border.

### Press Logo Strip
**Role:** Horizontal band of editorial logos (The Dodo, Travel + Leisure, Forbes, Great Pet).

Full-width section with #d7ecff Sky Powder background. Logos are grayscale or original-color at uniform ~40px height, evenly spaced across the strip. No card chrome — logos sit directly on the colored wash.

### Testimonial Section Card
**Role:** Dark inverted section showcasing vet endorsement quotes.

Full-bleed #161345 Midnight Ink background, white text. 133–96px display headline at top in Athletics Medium, then a circular avatar (120–160px, no border) left-aligned next to a 18–24px Larsseit white quote. Attribution in 12–14px all-caps with wide tracking underneath.

### Feature Image + Text Block
**Role:** Two-column product feature block (used for Plaque Patrol).

Left column: photographic product image (toothbrush being used on a dog), cropped to the column. Right column: headline in Larsseit 600 24–30px #321004, benefit bullets below, single filled navy CTA at the bottom. Vertical rhythm of 15–17px between elements.

### Section Heading (Light)
**Role:** Large display heading for white-background sections — 'Shop Supplements'.

Athletics Medium 64–83px, #161345 Midnight Ink, tracking 0.05–0.10em, line-height ~1.04. Anchored to the left of a wide container with a ghost 'Shop Now →' button aligned right on the same baseline.

### Section Heading (Inverted)
**Role:** Display heading on dark navy sections — 'Loved by Pets, Endorsed by Vets'.

Athletics Medium 64–133px, #ffffff, same wide tracking. Often spans two lines and slightly overhangs the column to feel editorial. No underline or decoration.

### Circular Avatar
**Role:** Round portrait thumbnail for vet or customer testimonials.

120–160px square, border-radius 9999px (or 50%), no border, object-fit cover. Sits inside the dark testimonial section with no card frame.

### Input Field
**Role:** Newsletter or quiz form input.

60px pill radius, 1px border in #ebebeb Ash Border, 15px vertical padding, Larsseit 400 15px placeholder in #999999 Stone Mute. Focus state: border thickens to 1.5px in #161345.

## Do's and Don'ts

### Do
- Use 60px radius on every button, input, and tag — never square or sharp-cornered interactive elements
- Pair every filled CTA with a right arrow → glyph as part of the button label
- Use #321004 Cocoa Bean for all body and heading text — do not introduce pure black #000000
- Set display headlines in Athletics Medium with 0.05–0.10em tracking and tight 0.72–1.04 line-heights
- Separate layers with Fog Gray #f9f9f9 card surfaces or 1px #ebebeb hairlines, never with box-shadow
- Alternate section backgrounds between white, Blush Petal, Sky Powder, and Midnight Ink to create page rhythm
- Use Blush Petal #ffcfdb, Sky Powder #d7ecff, and Mint Tide #60c4bf as paired washes for their matching product SKUs

### Don't
- Do not add box-shadow to any element — the system intentionally communicates depth through color blocks, not elevation
- Do not use green #3aaf3a for anything other than the benefit-checkmark icon — it is purely functional
- Do not render a CTA without a trailing → arrow — it is part of the brand's button language
- Do not use pure black #000000 or #1a202c for text — Cocoa Bean #321004 is the system text color
- Do not mix pill radius (60px) with square radius on buttons in the same row
- Do not use gradients anywhere — the palette is flat, clean, and wash-based
- Do not introduce new accent hues — the system is intentionally limited to navy, brown, orange, pink, blue, and teal

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cloud White | `#ffffff` | Page canvas — the base everything sits on |
| 1 | Fog Gray | `#f9f9f9` | Card and product tile surface — one step above the canvas |
| 2 | Blush Petal | `#ffcfdb` | Hero band — emotional opening of the page |
| 3 | Sky Powder | `#d7ecff` | Press logo strip and alternate section wash |
| 4 | Mint Tide | `#60c4bf` | Tertiary section wash — product-flavor-coded accent |
| 5 | Midnight Ink | `#161345` | Dark endorsement and footer section — inverted canvas |

## Elevation

The system deliberately avoids shadow. Layer separation comes from three tools only: (1) the Fog Gray #f9f9f9 card surface one step above the white canvas, (2) pastel color washes that re-zone sections, and (3) 1px Ash Border hairlines. There is no box-shadow token, no hover lift, no glow — depth is communicated through color temperature and surface tint shifts, not elevation. This keeps the interface feeling flat, friendly, and editorial rather than skeuomorphic.

## Imagery

Lifestyle photography dominates: candid shots of real dogs and their owners in natural-light, high-key environments (a woman kneeling with a doodle on a pink seamless, a small dog with a toothbrush mid-chew). No staged studio backdrops, no product-only hero shots — the dog or owner is always part of the composition. Product photography appears on flat color backdrops that match the SKU flavor (yellow, teal, lavender) rather than the brand palette, letting the product feel like a distinct object. Icons are minimal and mono — only the green checkmark bullet appears repeatedly. No illustrations, no 3D renders, no abstract graphics. Imagery fills roughly 50% of the page on the hero and shrinks to 30% in product sections. Images are cropped tight and often bleed edge-to-edge in their containers.

## Layout

Max-width 1280px centered container with generous side padding. The hero is a full-bleed Blush Petal band with a 50/50 split: left column holds the 64–96px headline and two pill CTAs stacked above a feature bullet; right column is a full-bleed lifestyle image. Sections alternate full-width pastel bands (blush → white → sky-blue → white → midnight-navy) with 80px vertical gaps between bands. Content within sections is 2-column (text+image) or 3-column (product card grid), never masonry. Navigation is a thin top bar (60–70px) centered on a 3-zone layout: left cluster (Shop + Take Quiz links), centered wordmark logo, right cluster (account + cart icons). Sticky on scroll. The dark endorsement section breaks the pattern with inverted contrast but keeps the same 2-column rhythm. Density is comfortable — sections breathe, never crammed, and whitespace does most of the layout work.

## Agent Prompt Guide

Quick Color Reference:
- Text: #321004 (primary), #999999 (muted), #ffffff (on dark)
- Background: #ffffff (canvas), #f9f9f9 (card), #ffcfdb (hero), #d7ecff (section), #161345 (dark section)
- Border: #ebebeb (hairline)
- Accent: #ff7f00 (highlight), #3aaf3a (check)
- primary action: #161345 (filled action)

Example Component Prompts:

1. Create a hero band: full-bleed #ffcfdb Blush Petal background. Left column holds an Athletics Medium 96px headline #321004, line-height 0.72, letter-spacing 9.6px. Below it, two 60px-radius pill buttons side by side: filled #161345 with #ffffff text reading 'Shop Now →', and outlined #161345 with #161345 text reading 'Take Quiz →'. Button text is Larsseit 500, 16px, 15px vertical / 28px horizontal padding. Right column is a lifestyle photo bleeding to the container edge.

2. Create a product card grid section: white canvas, 80px top padding. Section heading is Athletics Medium 64px #161345, letter-spacing 3.2px, left-aligned. To the right on the same row, a ghost pill button (60px radius, no fill, #161345 text, 15px/24px padding) reading 'Shop Now →'. Below, a 3-column grid of product tiles: each tile is 20px radius, #f9f9f9 background, 24px padding, with a product photo on its own colored backdrop and the product name in Larsseit 500 20px #321004 centered below.

3. Create a benefit bullet list: 4 rows, 10px vertical gap. Each row is a 20px green checkmark (#3aaf3a) at left, label in Larsseit 400 16px #321004, line-height 1.6. No background or border on the list.

4. Create a dark testimonial section: full-bleed #161345 Midnight Ink background, 100px vertical padding. Centered heading in Athletics Medium 96px #ffffff, letter-spacing 9.6px, two lines. Below in 2-column layout: left is a 140px circle avatar (object-fit cover, no border), right is a 22px Larsseit 400 #ffffff quote, attribution below in 12px all-caps #ffffff with 0.30em tracking.

5. Create a press logo strip: full-width #d7ecff Sky Powder band, 30px vertical padding. Four grayscale editorial logos evenly spaced across the strip, each ~40px tall, no background, no border.

## Color Wash System

Finn uses three pastel section washes as a navigation cue: Blush Petal #ffcfdb owns the hero, Sky Powder #d7ecff owns the press/editorial band and alternate feature sections, and Mint Tide #60c4bf appears for the calming-aid product line. These are not random — each product SKU has a paired wash that reappears when that product is highlighted, building associative memory between the color and the benefit.

## Pill Rule

Every interactive element that a user clicks — buttons, nav items, inputs, tags — uses a pill radius (60px) or fully rounded (9999px). Only product cards and section containers use 20px. This creates a clear visual contract: rounded-pill = you can act on it, rounded-card = it's content.

## Similar Brands

- **Wild One** — Same warm pastel section washes, pill-shaped CTAs, and editorial display headlines paired with a humanist body sans
- **Bark** — Similar pet-wellness positioning with white canvas, one decisive dark brand color for buttons, and lifestyle pet photography on full-bleed colored backdrops
- **Maev** — Friendly DTC pet brand with the same humanist sans body type, deep navy CTAs, and soft pastel section backgrounds for product differentiation
- **Ollie (pet food)** — Lifestyle-led hero photography on a tinted background, pill-radius buttons, and a single saturated brand color carried through CTAs and dark bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #161345;
  --color-cocoa-bean: #321004;
  --color-ember-orange: #ff7f00;
  --color-blush-petal: #ffcfdb;
  --color-sky-powder: #d7ecff;
  --color-mint-tide: #60c4bf;
  --color-cloud-white: #ffffff;
  --color-fog-gray: #f9f9f9;
  --color-ash-border: #ebebeb;
  --color-stone-mute: #999999;

  /* Typography — Font Families */
  --font-larsseit: 'Larsseit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-athletics: 'Athletics', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monosten: 'Monosten', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: 3.9px;
  --text-body: 15px;
  --leading-body: 1.67;
  --tracking-body: 0.38px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: 0.63px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 1.54px;
  --text-heading: 26px;
  --leading-heading: 1.25;
  --tracking-heading: 1.65px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 2.13px;
  --text-display: 36px;
  --leading-display: 1.17;
  --tracking-display: 2.57px;
  --text-display-lg: 64px;
  --leading-display-lg: 1.04;
  --tracking-display-lg: 3.2px;
  --text-display-xl: 96px;
  --leading-display-xl: 0.72;
  --tracking-display-xl: 9.6px;
  --text-display-2xl: 133px;
  --leading-display-2xl: 0.72;
  --tracking-display-2xl: 13.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 17982px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-pills: 60px;
  --radius-inputs: 60px;
  --radius-buttons: 60px;
  --radius-logobadge: 9999px;

  /* Surfaces */
  --surface-cloud-white: #ffffff;
  --surface-fog-gray: #f9f9f9;
  --surface-blush-petal: #ffcfdb;
  --surface-sky-powder: #d7ecff;
  --surface-mint-tide: #60c4bf;
  --surface-midnight-ink: #161345;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #161345;
  --color-cocoa-bean: #321004;
  --color-ember-orange: #ff7f00;
  --color-blush-petal: #ffcfdb;
  --color-sky-powder: #d7ecff;
  --color-mint-tide: #60c4bf;
  --color-cloud-white: #ffffff;
  --color-fog-gray: #f9f9f9;
  --color-ash-border: #ebebeb;
  --color-stone-mute: #999999;

  /* Typography */
  --font-larsseit: 'Larsseit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-athletics: 'Athletics', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monosten: 'Monosten', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: 3.9px;
  --text-body: 15px;
  --leading-body: 1.67;
  --tracking-body: 0.38px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: 0.63px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 1.54px;
  --text-heading: 26px;
  --leading-heading: 1.25;
  --tracking-heading: 1.65px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 2.13px;
  --text-display: 36px;
  --leading-display: 1.17;
  --tracking-display: 2.57px;
  --text-display-lg: 64px;
  --leading-display-lg: 1.04;
  --tracking-display-lg: 3.2px;
  --text-display-xl: 96px;
  --leading-display-xl: 0.72;
  --tracking-display-xl: 9.6px;
  --text-display-2xl: 133px;
  --leading-display-2xl: 0.72;
  --tracking-display-2xl: 13.3px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 17982px;
}
```
