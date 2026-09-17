# Everlane — Style Reference
> Minimalist atelier on raw linen. White walls, bare architecture, a single sage-green ribbon of light.

**Theme:** light

Everlane operates as a minimalist editorial fashion catalogue: near-total achromatic palette, one soft sage accent reserved for promotional urgency, and Maison Neue set almost entirely in uppercase with wide tracking. Photography carries nearly all visual weight — full-bleed editorial shots and tightly cropped product images sit on white canvases with zero decoration, zero shadows, and zero chrome. Type is the only ornament: tracked uppercase headings float over imagery, body copy stays minimal and quiet. Components are stripped to their essentials — thin text links, sharp-edged product tiles, no buttons, no cards, no panels. The result reads less like a storefront and more like a printed lookbook translated to screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Onyx | `#000000` | `--color-onyx` | Primary text, icons, hairline borders, nav typography, footer text — the dominant ink across every surface |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, product card backgrounds, hero text overlays, input fills |
| Soot | `#121212` | `--color-soot` | Dark feature sections, inverted text on light surfaces, high-contrast blocks |
| Ink | `#161912` | `--color-ink` | Near-black body text variant, deep borders — virtually indistinguishable from Onyx but carries a barely-warm cast |
| Graphite | `#4c4c4c` | `--color-graphite` | Secondary body text, muted descriptions, helper copy beneath headlines |
| Slate | `#737373` | `--color-slate` | Tertiary text, captions, price labels, disabled links |
| Ash | `#9b9b9b` | `--color-ash` | Subtle borders, dividers between product tiles, low-emphasis separators |
| Linen | `#c8c0b8` | `--color-linen` | Warm taupe surface for editorial bands, soft section backgrounds — the only chromatic neutral |
| Pistachio Wash | `#d9e9bb` | `--color-pistachio-wash` | Promotional bar fill, seasonal event accent — the single chromatic note in the entire system, used sparingly for time-bound urgency |

## Tokens — Typography

### Maison Neue Book — Primary workhorse for nav, body, labels, prices, and most UI — used at 400 for body, 700 for emphasized inline text and section anchors · `--font-maison-neue-book`
- **Substitute:** Inter, Helvetica Neue, Neue Haas Grotesk
- **Weights:** 400, 700
- **Sizes:** 10px, 12px, 14px, 15px, 16px, 20px, 24px, 32px
- **Line height:** 1.00–2.25
- **Letter spacing:** Ranges from 0.020em at 12px to 0.067em at 32px — tracking widens as size increases, reflecting the uppercase headline convention
- **Role:** Primary workhorse for nav, body, labels, prices, and most UI — used at 400 for body, 700 for emphasized inline text and section anchors

### Maison Neue Demi — Rare mid-weight emphasis for sub-headers and category labels — the half-step between Book and Book Bold · `--font-maison-neue-demi`
- **Substitute:** Inter Semi Bold, Helvetica Neue Medium
- **Weights:** 600
- **Sizes:** 12px
- **Line height:** 1.33
- **Letter spacing:** 0.0200em
- **Role:** Rare mid-weight emphasis for sub-headers and category labels — the half-step between Book and Book Bold

### Maison Neue — Secondary body variant for longer-form descriptive paragraphs in editorial sections · `--font-maison-neue`
- **Substitute:** Inter, Helvetica Neue
- **Weights:** 400
- **Sizes:** 12px, 16px, 24px
- **Line height:** 1.33–1.50
- **Letter spacing:** 0.0200em, 0.0400em
- **Role:** Secondary body variant for longer-form descriptive paragraphs in editorial sections

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Letter spacing:** 0.038
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 0.4px | `--text-caption` |
| heading | 20px | 1.25 | 0.8px | `--text-heading` |
| heading-lg | 24px | 1.2 | 1.2px | `--text-heading-lg` |
| display | 32px | 1.2 | 1.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 64-80px
- **Element gap:** 8px

## Components

### Promo Bar
**Role:** Seasonal sale announcement strip

Full-width band at #d9e9bb (Pistachio Wash), 40-48px tall, centered uppercase text in Onyx at 12px weight 400 with 0.033em tracking. Items separated by 24-32px gaps. No borders, no radius. Single chromatic element in the system — replace or remove for non-promotional periods.

### Primary Navigation
**Role:** Site-wide top navigation

White background, three-zone layout: left-aligned nav links (WOMEN, MEN, SUSTAINABILITY, EVERWORLD) at 12px uppercase with 0.020em tracking in Onyx, centered wordmark in Onyx at ~20px with wide tracking, right-aligned utility links (SEARCH, ACCOUNT, BAG) in same style. ~56px tall. Active nav item gets a thin Onyx underline.

### Hero Overlay
**Role:** Full-bleed editorial homepage hero

Edge-to-edge photograph, minimum 600px tall. Headline in white uppercase 24-32px, weight 400, tracking 0.050-0.067em, positioned lower-left over the image. Subhead in white at 14-15px, weight 400, one or two lines. CTA is a text link in white with thin underline, 12px uppercase, 0.040em tracking — no button chrome. No dark gradient overlay; text sits directly on the photograph relying on contrast zones.

### Editorial Split Section
**Role:** Brand storytelling block

50/50 split: large photograph left, text block right on white. Headline in Onyx uppercase at 20-24px with 0.043-0.060em tracking. Body paragraphs in Graphite at 14-15px, weight 400, generous line-height (1.6-1.8). Text block vertically centered, max-width ~480px. Followed by a text-link CTA with thin Onyx underline.

### Product Card
**Role:** Individual product tile in grid

Sharp-edged rectangle, zero radius. Full-width product photograph with no border or padding. Below image: product name at 12px uppercase Onyx with 0.033em tracking, then price at 12px Onyx directly beneath. No card background, no shadow, no hover state beyond subtle image opacity shift. ~16px vertical gap between image and text.

### Product Grid
**Role:** 4-column product listing

4 equal-width columns on desktop, 2 on tablet, 1 on mobile. Column gap 0px (items separated only by hairline borders). Section title above grid in 12px uppercase Onyx with 0.033em tracking, left-aligned with no decoration. Optional 1px Ash divider beneath the section label.

### Text Link CTA
**Role:** Primary call-to-action element

No button — the system uses underlined text links. 12px uppercase Onyx with 0.040em tracking, 1px solid Onyx underline offset 4px below baseline. Hover darkens to #4c4c4c (Graphite). No fill, no border, no padding, no radius. This is the only interactive component pattern.

### Section Heading
**Role:** Category or collection label

Uppercase Onyx at 12-14px, weight 400, tracking 0.033-0.040em. Left-aligned. No decorative lines, no spacing flourishes. Sits directly above content with 16-24px margin-bottom.

### Price Label
**Role:** Product price display

Onyx at 12px weight 400, no tracking adjustment from body. Positioned directly below product name with 4px gap. Currency symbol (€, $, etc.) inherits same size. No strikethrough for sale prices in primary data — keep minimal.

### Footer
**Role:** Site-wide footer

White or very light gray background, multi-column link grid. Column headers in 12px uppercase Onyx with 0.033em tracking. Links below in 12-14px Onyx weight 400, stacked with 8px vertical gap. Hairline 1px Ash divider above footer zone. Generous 48-64px top padding.

## Do's and Don'ts

### Do
- Set all UI text in Maison Neue Book (or Inter substitute) at 400 — weight 700 is reserved for inline emphasis, never for standalone headlines
- Use uppercase with tracking 0.033-0.067em for every label, nav item, product name, and headline — this is the system's signature
- Use Pistachio Wash (#d9e9bb) exclusively for the top promo bar; never apply it to buttons, cards, or section backgrounds
- Use Text Link CTA pattern (underlined uppercase 12px) as the only interactive component — no filled buttons, no outlined buttons
- Keep all corners sharp: 0px radius on cards, buttons, images, inputs, and tags — rounding would break the editorial print aesthetic
- Let photography fill the full viewport width for hero and editorial sections — no max-width container, no gutters around imagery
- Use #c8c0b8 (Linen) as the only warm surface for editorial brand-story bands; everything else stays white or achromatic

### Don't
- Do not introduce colored buttons, badges, or filled CTAs — the system has no primary action color and never should
- Do not add drop shadows, box-shadows, or any elevation to cards, images, or product tiles — surfaces are flat and flush
- Do not use rounded corners on any element — 0px radius is non-negotiable across the entire system
- Do not set body text in anything other than 400 weight — bolding body copy breaks the restrained editorial voice
- Do not use color to create hierarchy — rely on size, tracking, and uppercase/lowercase contrast instead
- Do not add decorative dividers, ornamental rules, or graphic flourishes between sections — rely on whitespace and Linen surface shifts
- Do not use Pistachio Wash as a hover state, focus ring, or link color — it is strictly a promotional surface treatment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background, dominant surface across most screens |
| 1 | Promo Bar | `#d9e9bb` | Top announcement strip for sales and events |
| 2 | Editorial Band | `#c8c0b8` | Warm taupe section backgrounds for brand-story content |
| 3 | Dark Section | `#121212` | Inverted feature blocks, footer, high-contrast editorial moments |
| 4 | Deepest Surface | `#000000` | Full-black closures, dramatic hero backgrounds |

## Elevation

The system intentionally eliminates all shadows. Surfaces are defined by flat color shifts (white → Linen → dark) and generous whitespace rather than elevation. This is a deliberate editorial-print decision: no component floats, no card lifts off the page, no depth illusion exists. Hierarchy is built through scale, tracking, and photography scale alone.

## Imagery

Photography dominates the visual system at roughly 70-80% of screen real estate on key pages. Treatment is editorial fashion editorial: full-bleed, sharp-edged, no masks or rounded crops. Models are shot in minimal architectural environments — concrete walls, beige plaster, natural light — to keep focus on garments. Color treatment is naturalistic with warm neutral grading (beiges, taupes, soft blacks). Product photography is shot on pure white/light gray seamless backgrounds with no lifestyle context — the garment IS the hero. No illustrations, no abstract graphics, no 3D renders, no icon-based imagery. Icon usage is limited to tiny utility icons (search, account, bag) rendered as 1px stroke outlines in Onyx.

## Layout

Full-bleed layout with no max-width container on any section. Each section edge runs to the viewport edge. Vertical rhythm: promo bar (40-48px) → nav (56px) → full-bleed hero (600px+) → editorial split bands alternating image-left/text-right → product grids in 4 columns → footer. Section transitions are seamless — no horizontal rules, no cards, no boxed containers. Spacing between major sections is 64-80px. The text blocks within editorial splits are centered vertically and constrained to ~480px max-width. Navigation is a sticky top bar with the wordmark centered. No sidebar, no mega-menu panels — nav links route to destination pages directly.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Onyx)
- background: #ffffff (Paper White)
- border: #9b9b9b (Ash) for dividers, #000000 for active states
- accent: #d9e9bb (Pistachio Wash) — promo bar only
- secondary surface: #c8c0b8 (Linen) for editorial bands
- primary action: no distinct CTA color

Example Component Prompts:

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a product grid section: 4 equal columns, 0px column gap, no card backgrounds, no borders, no shadows. Section label 'SHOP CULT FAVORITES' in Onyx 12px uppercase letter-spacing 0.40px (0.033em) with 16px margin-bottom. Each product tile: full-bleed product photo (no padding), then 12px uppercase Onyx product name with 0.40px tracking, then 12px Onyx price directly below with 4px gap.


4. Create the promo bar: full-width #d9e9bb band, 44px tall, centered content. Items 'SPRING ESSENTIALS EVENT' and 'UP TO 40% OFF' and 'SHOP WOMEN' and 'SHOP MEN' in Onyx 12px weight 400, uppercase, letter-spacing 0.40px, separated by 32px gaps. No borders, no radius.

5. Create a text-link navigation: white background, 56px tall. Left zone: 'WOMEN MEN SUSTAINABILITY EVERWORLD' in Onyx 12px uppercase letter-spacing 0.24px. Center zone: 'EVERLANE' wordmark in Onyx 20px uppercase letter-spacing 0.80px. Right zone: 'SEARCH ACCOUNT BAG' in Onyx 12px uppercase letter-spacing 0.24px. Active item gets 1px Onyx underline at baseline.

## Uppercase Tracking Convention

The signature typographic move is uppercase text with wide tracking across all sizes — from 10px nav labels to 32px hero headlines. Smaller text uses less absolute tracking but proportionally more (0.040em at 12px), while larger text uses more absolute pixels but similar em ratios. This is a print-editorial convention adapted to screen: every label, price, and heading reads as if typeset in a fashion magazine. Body paragraphs in mixed case are the quiet exception, not the rule. Never set headlines or UI labels in lowercase — the system would lose its entire voice.

## Similar Brands

- **Aesop** — Same editorial restraint — full-bleed photography, uppercase tracked labels, near-zero color, no buttons or shadows, type-as-ornament approach
- **The Row** — Identical minimalist fashion language — all-white canvas, sharp-edged product tiles, widely tracked uppercase labels, warm neutral photography on plaster backgrounds
- **Toteme** — Shared monochrome Scandinavian fashion aesthetic — full-bleed editorial photography, no decorative chrome, uppercase wordmark, sharp 0px corners throughout
- **M.Gemi** — Same tight grid product layouts with flush tiles, uppercase tracked product names, prices directly below — the fashion e-commerce minimalism pattern
- **COS** — Editorial fashion brand using generous whitespace, uppercase tracking on all UI labels, full-bleed campaign imagery, and zero decorative shadows or borders

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-onyx: #000000;
  --color-paper-white: #ffffff;
  --color-soot: #121212;
  --color-ink: #161912;
  --color-graphite: #4c4c4c;
  --color-slate: #737373;
  --color-ash: #9b9b9b;
  --color-linen: #c8c0b8;
  --color-pistachio-wash: #d9e9bb;

  /* Typography — Font Families */
  --font-maison-neue-book: 'Maison Neue Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-maison-neue-demi: 'Maison Neue Demi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-maison-neue: 'Maison Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.4px;
  --text-heading: 20px;
  --leading-heading: 1.25;
  --tracking-heading: 0.8px;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1.2px;
  --text-display: 32px;
  --leading-display: 1.2;
  --tracking-display: 1.6px;

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
  --spacing-36: 36px;
  --spacing-48: 48px;

  /* Layout */
  --section-gap: 64-80px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-promo-bar: #d9e9bb;
  --surface-editorial-band: #c8c0b8;
  --surface-dark-section: #121212;
  --surface-deepest-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-onyx: #000000;
  --color-paper-white: #ffffff;
  --color-soot: #121212;
  --color-ink: #161912;
  --color-graphite: #4c4c4c;
  --color-slate: #737373;
  --color-ash: #9b9b9b;
  --color-linen: #c8c0b8;
  --color-pistachio-wash: #d9e9bb;

  /* Typography */
  --font-maison-neue-book: 'Maison Neue Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-maison-neue-demi: 'Maison Neue Demi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-maison-neue: 'Maison Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.4px;
  --text-heading: 20px;
  --leading-heading: 1.25;
  --tracking-heading: 0.8px;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1.2px;
  --text-display: 32px;
  --leading-display: 1.2;
  --tracking-display: 1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;
}
```
