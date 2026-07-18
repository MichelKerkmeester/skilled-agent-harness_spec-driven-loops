# teenage engineering — Style Reference
> industrial catalogue under studio light — the product is the only rich object on the page and everything else is whispered around it

**Theme:** light

teenage engineering reads as an industrial product catalogue rendered in typographic whispers: a near-white canvas of #f6f8f7 hosts photographed products on seamless studio backdrops, while everything else — nav items, body copy, borders, labels — sits in ultra-thin weight 100 type that almost disappears into the page. The contrast comes not from ornament but from material: products are the only dense visual objects; the UI around them is mostly negative space, hairline rules, and one occasional dark band of #0f0e12 that acts like a display case wall. Zero rounded corners, zero drop shadows, zero gradients — every edge is a straight cut, every surface is flat. Color is deliberately rationed: pure black text, gray hairlines, a slightly purplish near-black for inverted sections, and a single chromatic note (the amber warning triangle) that earns its presence by being the only non-neutral element on the page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Mist | `#f6f8f7` | `--color-canvas-mist` | Page background, product photography backdrop, the dominant surface — everything else sits on this almost-white field |
| Ink Black | `#000000` | `--color-ink-black` | Primary body text, dominant hairline borders, footer rules — the most-used color in the system at ~1017 occurrences, functioning as the typographic anchor |
| Carbon | `#0f0e12` | `--color-carbon` | Near-black with a barely-perceptible violet cast — used for dark hero bands, inverted text, and footer/divider blocks where pure black would feel too clinical |
| Steel Gray | `#e5e5e5` | `--color-steel-gray` | Light border hairlines, nav icon fills, list dividers — the structural gray that organizes the page into ruled sections without ever calling attention to itself |
| Graphite | `#b2b2b2` | `--color-graphite` | Muted secondary borders and subdued helper text — the quietest neutral, used only when a rule needs to be present but not assertive |

## Tokens — Typography

### te-20 — The signature voice — a custom industrial sans used for nearly everything. Weight 100 (ultra-thin) at 13px is the body default and it is an anti-convention: most sites use 400-500 for body copy, this one uses a hairline that lets the photography do the talking. Weight 300 takes over at 19px and up for nav items, labels, and mid-size UI. Substitute: Inter at weight 100, or Suisse Int'l Thin — both preserve the wire-like quality that makes teenage engineering's type feel engineered rather than designed · `--font-te-20`
- **Substitute:** Inter (weight 100/300) or Suisse Int'l Thin
- **Weights:** 100, 300
- **Sizes:** 13px, 19px, 24px, 26px
- **Line height:** 1.11 (headings), 1.15 (subheads), 1.50 (body)
- **Letter spacing:** normal
- **Role:** The signature voice — a custom industrial sans used for nearly everything. Weight 100 (ultra-thin) at 13px is the body default and it is an anti-convention: most sites use 400-500 for body copy, this one uses a hairline that lets the photography do the talking. Weight 300 takes over at 19px and up for nav items, labels, and mid-size UI. Substitute: Inter at weight 100, or Suisse Int'l Thin — both preserve the wire-like quality that makes teenage engineering's type feel engineered rather than designed

### te-40 — Reserved for primary page headings at exactly 40px in light weight 300 — the lightest possible headline voice paired with tight 1.11 leading keeps the type block compact and poster-like against the generous canvas · `--font-te-40`
- **Substitute:** Inter (weight 300)
- **Weights:** 300
- **Sizes:** 40px
- **Line height:** 1.11
- **Role:** Reserved for primary page headings at exactly 40px in light weight 300 — the lightest possible headline voice paired with tight 1.11 leading keeps the type block compact and poster-like against the generous canvas

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| subheading | 19px | 1.15 | — | `--text-subheading` |
| heading-sm | 24px | 1.15 | — | `--text-heading-sm` |
| heading | 26px | 1.15 | — | `--text-heading` |
| heading-lg | 40px | 1.11 | — | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 15 | 15px | `--spacing-15` |
| 22 | 22px | `--spacing-22` |
| 33 | 33px | `--spacing-33` |
| 66 | 66px | `--spacing-66` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| global | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 66px
- **Card padding:** 0px
- **Element gap:** 15px

## Components

### Top Navigation Bar
**Role:** Persistent site navigation

A single horizontal rule on a white canvas, ~66px tall. Left side holds the lowercase 'teenage engineering' wordmark in te-20 weight 300 at ~24px. Right side holds a row of section entries (products, store, latest, finder) each with a small square te-20 icon above the label, separated by equal 15px gaps. No background fill, no shadow — just type and hairline rules at #000000 on #f6f8f7. Top and bottom borders are 1px #e5e5e5.

### Product Grid Card
**Role:** E-commerce product listing tile

Three columns on a #f6f8f7 background. Each card is a vertical stack: product image fills the cell edge-to-edge (no padding, no border, no radius), below it a product name in te-20 weight 100 at 13px, then a 'buy now' link in te-20 weight 100 at 13px in the blue link color. No card container, no background plate — the product photography IS the card. Separated by 22px gutters with #e5e5e5 vertical rules between columns.

### Dark Hero Band
**Role:** Full-width product showcase section

A full-bleed horizontal band in #0f0e12 (not pure black — the slight violet tint differentiates it from text). Holds a single product photographed at 3/4 perspective, floating against the dark field with generous margin on all sides. Small uppercase te-20 weight 100 label ('EP-133 K.O. II') in #f6f8f7 sits in the bottom-left corner at 13px. No overlay UI, no gradient — the product sits on the dark plane like a sculpture in a vitrine.

### Inverted Section Label
**Role:** Caption-level text on dark sections

Small te-20 weight 100 at 13px in #b2b2b2 (graphite), positioned bottom-left of dark hero bands. Pairs with the dark Carbon #0f0e12 background to create a subtle 'engraved on metal plate' effect — the type is always quieter than the product it labels.

### Cookie Consent Triangle
**Role:** Privacy/cookie consent overlay

A large amber-yellow warning triangle (roughly #f0a000–#f5b800) anchored bottom-left, containing a black hand-stop icon and a short paragraph in te-20 weight 100 at 13px in black. Two inline buttons: 'settings' (text-only, weight 100) and 'accept all' (solid black fill, white text, 0px radius). This is the only chromatic element on the page and its presence is structural — it signals that color is rationed and reserved for warning states.

### Text Link
**Role:** Inline navigation and action link

te-20 weight 100 at 13px, rendered in the standard blue link color (#0071bb). No underline by default, no arrow, no icon. Underlines appear only on hover. The visual weight stays in the hairline register — links whisper rather than announce.

### Footer Block
**Role:** Page footer with metadata

A dark band in #0f0e12 spanning full width, ~33px vertical padding. Contains te-20 weight 100 at 13px in #f6f8f7, arranged in a quiet row or column of legal/support links. No background image, no logo — just reversed type on the Carbon near-black surface.

### Icon Glyph
**Role:** Navigation and section icons

Small square icons (~20×20px) in te-20 weight 100, rendered as line drawings in #000000. Stroke weight matches the type weight — hairline-thin, geometric, no fills, no rounded terminals. Sit directly above their nav labels in the top bar and are interchangeable with text-only entries.

## Do's and Don'ts

### Do
- Use te-20 weight 100 as the default for all body copy, labels, links, and meta — it is the voice of the system; reserving weight 300 for sizes 19px+ and headings
- Photograph products on seamless white/gray studio backdrops and let them fill the grid cell edge-to-edge with zero padding, zero border, zero radius — the product is the card
- Set section gaps at 66px on the horizontal axis and use 15px as the universal element gap inside rows — these two values create the catalogue's breathing rhythm
- Use #0f0e12 (not pure #000000) for dark hero bands, footer blocks, and any inverted section — the slight violet cast keeps the near-black from feeling like a void
- Keep the palette to five neutrals: #f6f8f7 canvas, #000000 text, #0f0e12 dark surfaces, #e5e5e5 hairlines, #b2b2b2 muted text — never introduce a sixth color unless it serves a state (warning, error)
- Use 0px border-radius on every component — cards, buttons, inputs, tags — sharp edges are non-negotiable, they are what makes the system feel industrial rather than soft
- Anchor the page with hairline #e5e5e5 or #000000 rules at 1px to organize content into ruled bands rather than using background fills or shadows

### Don't
- Never use border-radius above 0px — the system is built on straight cuts, and any rounding breaks the industrial register
- Never use drop shadows, glows, or inset shadows — elevation is communicated through the #0f0e12 dark band, not through shadow stacks
- Never use weights above 300 in te-20 or above 300 in te-40 — the hairline quality is the system's most distinctive trait and bold weights would destroy it
- Never introduce gradients — the only tonal transition is the hard cut between #f6f8f7 and #0f0e12 section bands
- Never set body text below 13px or above 19px for running copy — the scale is deliberately compressed and the 13px floor is already daringly small
- Never use color as decoration — the only chromatic note (amber warning triangle) earns its presence by being the sole exception; adding a second accent dilutes the rationing
- Never center body paragraphs — text alignment is always left, even on light backgrounds, maintaining the technical-document reading rhythm
- Never add padding inside product image cells — let the photograph run to the grid edge, the seamlessness is what makes the catalogue feel like a gallery wall

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas Mist | `#f6f8f7` | Page background, default product photography backdrop — the base plane that almost everything sits on |
| 2 | Pure White (implicit) | `#ffffff` | Product image cards appear on white within the canvas — the photographic bleed creates an even brighter island inside the near-white field |
| 3 | Carbon | `#0f0e12` | Dark hero bands and footer — the only elevation device in the system, used to frame products like display cases |

## Elevation

The system has zero drop shadows. Elevation is communicated exclusively through the tonal jump from #f6f8f7 canvas to #0f0e12 dark band — when a product needs to feel important, it is placed on the dark plane, not given a shadow. This is a deliberate industrial choice: shadows would suggest soft, organic materials; flat dark planes suggest machined metal and display vitrines. Borders serve the same organizational function that shadows serve in other systems — 1px hairlines in #e5e5e5 or #000000 divide content into ruled sections, just as lines divide a technical drawing.

## Imagery

Photography is the dominant visual content and the only 'rich' element on the page. Products are shot on seamless studio backdrops (white or neutral gray gradient) at 3/4 perspective angles that show depth and material — the EP-133 K.O. II appears as a flat top-down product shot in the dark hero, while smaller grid items appear front-on. Images are edge-to-edge inside grid cells with no padding, no rounded corners, and no border. The photography is high-key, product-focused (no lifestyle, no models, no context), and the objects themselves carry all the visual interest. There is no illustration, no icon-driven decorative graphics, and no abstract backgrounds — the only non-product visual is the small set of hairline te-20 icons in the top nav. The product IS the design system.

## Layout

The page model is a max-width 1200px centered column on a #f6f8f7 canvas. The top of the page is a thin nav bar (~66px) with the wordmark left and icon+label sections right, separated by a 1px #e5e5e5 bottom border. The hero is a full-bleed dark band in #0f0e12 that breaks the max-width container and spans the viewport, containing a single large product photo and a small inverted label. Below the hero, the layout returns to the 1200px column and switches to a 3-column product grid on a light background, with vertical 1px #e5e5e5 rules between columns and a small product name + buy link beneath each image. Vertical rhythm is established by 66px horizontal padding on outer sections and 33px on footer blocks. The navigation is a simple top bar, not sticky, with no sidebar and no mega-menu — section icons are the only navigation surface. The overall feel is a paginated technical catalogue, not a scrollable marketing site.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #f6f8f7
- border: #e5e5e5
- dark surface: #0f0e12
- muted text: #b2b2b2
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a product grid card: #f6f8f7 background, product image fills the cell edge-to-edge with 0px padding and 0px radius. Below the image, product name in te-20 weight 100, 13px, #000000, 1.5 line-height. Below that, a 'buy now' link in te-20 weight 100, 13px, #0071bb, no underline. Vertical 1px #e5e5e5 rule on the right edge of the card. 22px gap to the next card.

2. Create a dark hero band: full-bleed #0f0e12 background (not pure black), product image centered with 66px top/bottom padding, product label 'EP-133 K.O. II' in te-20 weight 100, 13px, #b2b2b2, positioned bottom-left with 66px left padding.

3. Create a top nav bar: #f6f8f7 background, 66px tall, wordmark 'teenage engineering' in te-20 weight 300, 24px, #000000 on the left, row of icon+label pairs on the right in te-20 weight 100, 13px, #000000, separated by 15px gaps. 1px #e5e5e5 bottom border.

4. Create a warning/cookie consent overlay: large amber triangle (#f0a800) anchored bottom-left, black hand-stop icon centered inside, body text in te-20 weight 100, 13px, #000000. Two buttons: 'settings' as text-only in te-20 weight 100, and 'accept all' as solid #000000 fill with #f6f8f7 text, both 0px radius, inline padding 8px 16px.

5. Create a footer block: full-bleed #0f0e12 background, 33px vertical padding, single row of links in te-20 weight 100, 13px, #f6f8f7, left-aligned, 66px horizontal padding.

## Gradient System

There is no gradient system. The only tonal transition in the interface is the hard cut between #f6f8f7 (light canvas) and #0f0e12 (dark band). Any product photography may contain internal gradient backdrops, but the UI itself is strictly flat with sharp boundaries.

## Similar Brands

- **Nothing (nothing.tech)** — Same monochrome-first industrial aesthetic with hairline-thin type, zero shadows, and a single accent color used sparingly — though Nothing leans darker and more aggressive
- **Punkt. (punkt.shop)** — Shares the Swiss-minimal industrial design language with hairline typography, restrained palette, and product-as-hero photography on clean backdrops
- **Braun (braun-design)** — Both descend from Dieter Rams' design philosophy — functional purity, no ornament, straight edges, and the confidence to let the product carry the page
- **Areaware** — Similar product-catalog sensibility with monochrome layouts, minimal type, and full-bleed product photography on white backgrounds
- **HOTO Tools** — Shares the utilitarian product design language with muted palettes, weight-100-style thin type, and engineering-manual layout discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-mist: #f6f8f7;
  --color-ink-black: #000000;
  --color-carbon: #0f0e12;
  --color-steel-gray: #e5e5e5;
  --color-graphite: #b2b2b2;

  /* Typography — Font Families */
  --font-te-20: 'te-20', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-te-40: 'te-40', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.15;
  --text-heading: 26px;
  --leading-heading: 1.15;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.11;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;

  /* Spacing */
  --spacing-15: 15px;
  --spacing-22: 22px;
  --spacing-33: 33px;
  --spacing-66: 66px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 66px;
  --card-padding: 0px;
  --element-gap: 15px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-global: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas-mist: #f6f8f7;
  --surface-pure-white-implicit: #ffffff;
  --surface-carbon: #0f0e12;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-mist: #f6f8f7;
  --color-ink-black: #000000;
  --color-carbon: #0f0e12;
  --color-steel-gray: #e5e5e5;
  --color-graphite: #b2b2b2;

  /* Typography */
  --font-te-20: 'te-20', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-te-40: 'te-40', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.15;
  --text-heading: 26px;
  --leading-heading: 1.15;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.11;

  /* Spacing */
  --spacing-15: 15px;
  --spacing-22: 22px;
  --spacing-33: 33px;
  --spacing-66: 66px;
}
```
