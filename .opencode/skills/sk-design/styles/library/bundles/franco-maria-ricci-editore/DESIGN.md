# Franco Maria Ricci Editore — Style Reference
> Art Déco gallery catalogue — burnished gold hairlines on bone-white vellum

**Theme:** light

Franco Maria Ricci is a quiet luxury of typographic restraint: a vast off-white vellum, a single high-contrast Bodoni voice, and a thread of burnished gold that hairlines every editorial moment. The system behaves like an art-book spread — no shadows, no gradients, no rounded corners, no filled buttons — only the architecture of type, generous white space, and vertical rules dividing book objects. Color appears as gold punctuation (borders on titles, rules beneath section headers, thin lines under links) rather than as fill, and the lone dark surface (#0a0a0a) reads as a gallery wall, not as a UI mode. All interactive elements are text-driven: ghost links, bracketed call-to-action markers like `{ ORDER NOW }`, and pagination arrows at page corners. The page is a long horizontal editorial scroll divided into discrete exhibition rooms, each introduced by a serif italic section title with a gold underline.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vellum White | `#f6f6f6` | `--color-vellum-white` | Page canvas — the warm off-white that grounds every section, never pure #ffffff so type never feels clinical |
| Paper | `#ffffff` | `--color-paper` | Card and section surfaces — book spreads, product panels, inset blocks sitting one shade above the vellum canvas |
| Gallery Ink | `#0a0a0a` | `--color-gallery-ink` | Dark sections (FMR Magazine block, footer band) and deepest typographic emphasis — reads as letterpress black, not screen black |
| Letterpress Black | `#000000` | `--color-letterpress-black` | Body copy, navigation text, icons, all hairlines and borders, pagination marks — the structural ink of the system |
| Silver Wash | `#b3b3b3` | `--color-silver-wash` | Muted surface for secondary hero panels and quiet tonal breaks — used sparingly as a gallery-shadow gray |
| Burnished Gold | `#bc9c5c` | `--color-burnished-gold` | Section header underlines, link hover rules, decorative title borders — the only chromatic voice in the system, applied as 1px strokes and inline rules, never as fill |

## Tokens — Typography

### BodoniSvntytwoITCStd-Book — Primary voice — every editorial moment. 42px with line-height 0.95 for the cinematic display headline (the tight leading lets the tall Bodoni capitals lock together as a single typographic object). 22px for section openers. 18px and 16px for body and book metadata. 14px and 12px for navigation, captions, and the monogrammed fine print. Substitute: Bodoni Moda, Bodoni 72, or Playfair Display when the ITC cut is unavailable. · `--font-bodonisvntytwoitcstd-book`
- **Substitute:** Bodoni Moda, Bodoni 72, Playfair Display
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 18px, 22px, 42px
- **Line height:** 0.95 (display), 1.25 (running text)
- **Letter spacing:** normal
- **Role:** Primary voice — every editorial moment. 42px with line-height 0.95 for the cinematic display headline (the tight leading lets the tall Bodoni capitals lock together as a single typographic object). 22px for section openers. 18px and 16px for body and book metadata. 14px and 12px for navigation, captions, and the monogrammed fine print. Substitute: Bodoni Moda, Bodoni 72, or Playfair Display when the ITC cut is unavailable.

### BodoniSvntytwoITCStd-BookIt — Editorial italics for the signature flourish — "Editore" wordmark, italic section titles like OUR SELECTION, and the quiet poetic asides. The italic is used as ornament, not emphasis: a single italic line beside a roman headline changes the register of the whole spread. Substitute: Bodoni Moda Italic, Playfair Display Italic. · `--font-bodonisvntytwoitcstd-bookit`
- **Substitute:** Bodoni Moda Italic, Playfair Display Italic
- **Weights:** 400
- **Sizes:** 16px, 22px, 42px
- **Line height:** 1.25
- **Role:** Editorial italics for the signature flourish — "Editore" wordmark, italic section titles like OUR SELECTION, and the quiet poetic asides. The italic is used as ornament, not emphasis: a single italic line beside a roman headline changes the register of the whole spread. Substitute: Bodoni Moda Italic, Playfair Display Italic.

### Arial — System utility for pagination counters (2/5), shipping notices, form labels, and the rare inline metadata. Arial sits beside Bodoni as a quiet functional label — the contrast between high-contrast serif and neutral sans is the only typographic tension the system permits. No tracking adjustments; letterspacing inherits from the browser default. · `--font-arial`
- **Substitute:** Helvetica, Inter, system-ui
- **Weights:** 400, 700
- **Sizes:** 12px, 14px
- **Line height:** 1.25
- **Role:** System utility for pagination counters (2/5), shipping notices, form labels, and the rare inline metadata. Arial sits beside Bodoni as a quiet functional label — the contrast between high-contrast serif and neutral sans is the only typographic tension the system permits. No tracking adjustments; letterspacing inherits from the browser default.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.25 | — | `--text-caption` |
| body-sm | 14px | 1.25 | — | `--text-body-sm` |
| body | 16px | 1.25 | — | `--text-body` |
| subheading | 22px | 1.25 | — | `--text-subheading` |
| heading | 42px | 0.95 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48px
- **Card padding:** 40px
- **Element gap:** 20px

## Components

### Top Bar Navigation
**Role:** Primary site navigation

Single horizontal row, transparent over the vellum canvas. Logo monogram (circular emblem with serif letter) on the far left in #000000. Far right carries the wordmark "Franco Maria Ricci" in Bodoni 14px with the italic "Editore" subtitle in 12px beneath, followed by a thin-line shopping bag icon and a hamburger menu icon — both 16px, 1px stroke, no fill. No background fill, no border, no shadow. 40px vertical padding, 64px horizontal padding at the container level.

### Hero Headline Block
**Role:** Opening editorial statement

Left-aligned text block, 40% page width. Headline in Bodoni 42px, line-height 0.95, #000000. Sub-headline paragraph in Bodoni 16px, #000000, max-width ~320px. Followed by a bracketed call-to-action in Bodoni 14px with 1px #000000 bottom border: { ORDER NOW }. The opposite ~60% of the viewport is held for a large illustrative plate (the Art Déco portrait in the primary screenshot).

### Section Title with Gold Rule
**Role:** Section divider heading

Centered text in italic Bodoni 22px, #000000, followed by a 1px horizontal rule in #bc9c5c (Burnished Gold) spanning the full column width. Appears above each book-selection band (BEST SELLERS, OUR SELECTION, NEW RELEASES, FMR MAGAZINE). The gold rule is the system's only chromatic gesture and signals a new exhibition room.

### Three-Column Book Grid
**Role:** Product showcase

Three equal columns separated by 1px vertical rules in #000000. Each column has 40px internal padding and a #ffffff surface. Book covers sit centered with generous top/bottom whitespace; the cover itself carries the only imagery in the column. No card shadow, no border-radius, no hover effect — the book is the object, the grid is the gallery wall.

### Book Cover Plate
**Role:** Individual product object

Centered book cover image with 24px top margin from the column rule. No caption, no price, no add-to-cart button at the grid level — interaction is implied by the cover itself. Cover proportions are preserved; no cropping, no frames.

### Ghost Link / Editorial CTA
**Role:** Outlined action

Text link in Bodoni 14px, #000000, with 1px #000000 bottom border, 4px gap between text and rule. Active and hover states swap the border color to #bc9c5c (Burnished Gold) and shift the text to #bc9c5c. The bracketed variant — `{ ORDER NOW }` — wraps the label in literal curly braces as an editorial convention, not a styled border. No background fill at any state.

### Magazine Brand Block
**Role:** Branded section separator

Full-bleed horizontal band, height ~40% of viewport, with a #0a0a0a (Gallery Ink) surface. Left half holds a richly colored FMR magazine cover plate; right half centers the FMR wordmark in Bodoni 42px, white, with "MAGAZINE" set in Arial 12px, letter-spaced, directly beneath. Functions as a dark break in the otherwise all-light editorial scroll.

### Pagination Indicator
**Role:** Scroll progress marker

Bottom-right corner, Bodoni 14px in italic (or Arial 12px), #000000. Format: `2 / 5` flanked by thin arrow glyphs (← →) at 14px. No background, no border. Optional 1px #000000 divider above the counter, aligned to the page edge with 20px inset.

### Section Header Tab
**Role:** In-grid category label

Inline three-part label (e.g. I/o · BEST SELLERS · NEW RELEASES) split across the three-column grid: the active category in italic Bodoni 22px #000000, the inactive categories in roman Bodoni 22px at 40% opacity (#000000 at alpha 0.4). No underline on inactive items, 1px #bc9c5c underline only on the active label.

## Do's and Don'ts

### Do
- Use Burnished Gold (#bc9c5c) only as 1px strokes: section header underlines, link hover rules, decorative title borders. Never as a fill.
- Set the display headline at 42px Bodoni 400 with line-height 0.95 — the tight leading locks the tall capitals into a single typographic block.
- Apply italic Bodoni for editorial flourishes: the wordmark subtitle, section openers, and quiet asides. Roman Bodoni carries the weight; italic ornaments it.
- Separate three-column book grids with 1px #000000 vertical rules at full column height. Gaps and padding cannot replace the rule — the dividers are the architecture.
- Keep every radius at 0px. Corners are sharp; softness comes from typography and whitespace, not from curves.
- Use #f6f6f6 as the base canvas, not #ffffff. The warm off-white prevents Bodoni from reading as clinical and keeps the system in the print-catalogue register.
- Express every action as text with a hairline bottom border. Bracketed markers like `{ ORDER NOW }` are an acceptable editorial convention for primary actions.

### Don't
- Do not introduce drop-shadows, blurs, or glow effects. The system is flat; elevation is tonal.
- Do not use Burnished Gold (#bc9c5c) as a background fill on buttons, badges, or surfaces. It is a stroke color only.
- Do not round any corner. Buttons, cards, inputs, images all keep 0px radius.
- Do not use any secondary accent color. The palette is monochrome + one gold; introducing red, blue, or green would destroy the letterpress discipline.
- Do not use Arial for headlines or editorial copy. Arial is reserved for pagination counters, form labels, and utility metadata.
- Do not set line-height above 0.95 on the 42px display headline — the tight leading is signature, not an oversight.
- Do not add hover animations, transitions, or micro-interactions. The page reads as a printed catalogue; movement would break the metaphor.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Vellum | `#f6f6f6` | Base page canvas — the warm off-white that all sections sit on |
| 1 | Paper | `#ffffff` | Card and column surfaces, one shade above the canvas to delineate without weight |
| 2 | Silver Wash | `#b3b3b3` | Muted hero panels and quiet tonal breaks, used sparingly |
| 3 | Gallery Ink | `#0a0a0a` | Dark editorial blocks (FMR Magazine) and deepest typographic surfaces |
| 4 | Letterpress Black | `#000000` | Maximum-contrast surfaces reserved for the most dramatic dark sections |

## Elevation

The system has no shadows. Elevation is communicated exclusively through tonal layering of the five neutrals (#f6f6f6 → #ffffff → #b3b3b3 → #0a0a0a → #000000) and through 1px hairline rules in #000000 or #bc9c5c. Every surface is flat; depth comes from typography scale, whitespace, and the occasional dark band. Adding drop-shadow, blur, or any soft-edge effect would break the letterpress-print metaphor that defines the brand.

## Imagery

Imagery is the centerpiece, not decoration. The system showcases two distinct image modes: (1) fine-art illustration plates — Art Déco portraits, botanical compositions, surrealist line drawings — presented at large scale, often occupying 50-60% of the viewport, with no framing, no border-radius, and no overlay treatment; and (2) book cover photography shown front-on, preserving original proportions, on pure white. Both modes are treated as museum objects: full-bleed or generously inset, never cropped to container shape, never given a drop shadow. Photography is high-key, product-staged, and color-faithful — no filters, no duotone. The illustration style is hand-drawn linework with restrained color (the gold-and-black Erté portrait defines the palette for the entire site). Icons are minimal: 16px outline, 1px stroke, monochrome black, used only for shopping bag and menu functions. The page is image-heavy in the hero and sparse in the structural chrome — the gallery breathes between objects.

## Layout

Full-bleed long-scroll editorial page, horizontally banded into five discrete sections (hero, bestsellers, magazine, selection, releases). Container max-width 1280px, centered, with 40px horizontal padding on the outer container. Navigation is a thin top bar, not sticky. The page alternates between three-column book grids and single-column full-bleed editorial blocks. Vertical rhythm is anchored by 48px section gaps and 40px internal column padding. The hero is split: left-third text, right-two-thirds illustration. All section headers are centered with a full-width gold rule beneath. There is no sidebar, no mega-menu, no footer chrome visible above the fold — pagination is the only persistent navigation aid. The three-column grid uses 1px vertical dividers rather than gutters, making the columns feel like adjacent museum vitrines rather than card grid cells.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Letterpress Black)
- background: #f6f6f6 (Vellum White)
- card surface: #ffffff (Paper)
- border / hairline: #000000 (Letterpress Black)
- accent stroke: #bc9c5c (Burnished Gold)
- dark band: #0a0a0a (Gallery Ink)
- primary action: #bc9c5c (outlined action border)

**Example Component Prompts**

1. **Hero editorial block** — Left third: headline "Erté. Style is Everything." in Bodoni 42px weight 400, line-height 0.95, #000000. Sub-copy in Bodoni 16px weight 400, #000000, max-width 320px. Action: text link `{ ORDER NOW }` in Bodoni 14px, #000000, with a 1px #000000 bottom border. Right two-thirds: a full-height Art Déco portrait illustration, no frame, no border-radius, sitting on the #f6f6f6 canvas.

2. **Three-column book grid with section header** — Section title centered in italic Bodoni 22px #000000, followed by a 1px #bc9c5c horizontal rule spanning the full grid width. Three equal columns on a #ffffff surface, separated by 1px #000000 vertical rules running the full column height. Each column has 40px internal padding and a centered book cover image with 24px top margin. No card shadow, no radius, no caption.

3. **Magazine dark band** — Full-bleed #0a0a0a band, ~40% viewport height. Left half: a large FMR magazine cover plate, sharp corners, no border. Right half: the wordmark "FMR" in Bodoni 42px weight 400 #ffffff, centered, with "MAGAZINE" in Arial 12px letter-spaced beneath in #ffffff.

4. **Ghost navigation link with gold hover** — Top-bar link in Bodoni 14px weight 400, #000000, 4px below a 1px #000000 bottom border. On hover, both text and border shift to #bc9c5c. No background fill at any state. 40px vertical padding around the link row.

5. **Pagination indicator** — Bottom-right corner, Arial 12px weight 400, #000000, format `← 2 / 5 →`. 1px #000000 horizontal rule above, aligned to the page edge with a 20px inset. No background, no border-radius.

## Editorial Conventions

The system carries three signature editorial devices that should be preserved across every new page: (1) the bracketed action — primary actions may be wrapped in literal `{ }` braces as a typographic convention, e.g. `{ ORDER NOW }`, `{ SUBSCRIBE }`; (2) the inline category trio — section labels split across a three-column grid with the active category in italic and underlined in gold, inactive categories in roman at 40% opacity; (3) the Art Déco gold rule — every section introduction is a centered italic Bodoni title with a 1px #bc9c5c horizontal rule beneath, spanning the full content width. These three devices are the visual equivalent of chapter ornaments in a printed monograph; treat them as load-bearing, not decorative.

## Similar Brands

- **Assouline** — Same luxury-publisher aesthetic — Bodoni-style display serif, monochrome canvas, single-color editorial accent, and book objects treated as art pieces rather than products
- **Hermès** — Same restraint of a single chromatic accent (Hermès orange) against a warm off-white canvas, hairline rules, and serif-first typography with no shadows or rounded corners
- **Aedes East Hampton** — Same Art Déco / gallery-catalog sensibility — large illustrated plates, italic serif section titles with thin underlines, three-column product grids divided by hairline rules
- **Galleria Continua** — Same museum-wall treatment of objects, generous white space, and the discipline of a single dark band breaking an otherwise all-white editorial scroll
- **Vogue Italia (editorial pages)** — Same high-contrast Bodoni display at near-zero line-height, italic flourishes for editorial asides, and the policy that a single gold/black accent carries the entire visual identity

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vellum-white: #f6f6f6;
  --color-paper: #ffffff;
  --color-gallery-ink: #0a0a0a;
  --color-letterpress-black: #000000;
  --color-silver-wash: #b3b3b3;
  --color-burnished-gold: #bc9c5c;

  /* Typography — Font Families */
  --font-bodonisvntytwoitcstd-book: 'BodoniSvntytwoITCStd-Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bodonisvntytwoitcstd-bookit: 'BodoniSvntytwoITCStd-BookIt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-subheading: 22px;
  --leading-subheading: 1.25;
  --text-heading: 42px;
  --leading-heading: 0.95;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48px;
  --card-padding: 40px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-vellum: #f6f6f6;
  --surface-paper: #ffffff;
  --surface-silver-wash: #b3b3b3;
  --surface-gallery-ink: #0a0a0a;
  --surface-letterpress-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vellum-white: #f6f6f6;
  --color-paper: #ffffff;
  --color-gallery-ink: #0a0a0a;
  --color-letterpress-black: #000000;
  --color-silver-wash: #b3b3b3;
  --color-burnished-gold: #bc9c5c;

  /* Typography */
  --font-bodonisvntytwoitcstd-book: 'BodoniSvntytwoITCStd-Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bodonisvntytwoitcstd-bookit: 'BodoniSvntytwoITCStd-BookIt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-subheading: 22px;
  --leading-subheading: 1.25;
  --text-heading: 42px;
  --leading-heading: 0.95;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
}
```
