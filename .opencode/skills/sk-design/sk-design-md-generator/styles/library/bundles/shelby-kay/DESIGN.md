# Shelby Kay — Style Reference
> botanical editorial spread on warm linen — two-color ink system on aged paper, with display type that bleeds past the page edge and metadata that whispers from the margins.

**Theme:** light

Shelby Kay is a botanical editorial portfolio: a warm linen canvas, one dark-olive ink color, and a single sage-green accent that does all the brand expression. Typography is extreme — Ranade display type stretches to 265px and bleeds edge-to-edge, while Switzer handles everything else at a compact 10–20px range, creating a magazine-spread tension between monumental headers and whispering metadata. Navigation is text-only with no buttons, no rounded controls, no shadows — the interface reads as a printed art book, not a software product. Sections shift through warm tonal layers (cream → tan → taupe) rather than alternating hard color blocks, and the overall system rewards restraint: hierarchy comes from scale, weight, and whitespace, never from color or chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Olive Ink | `#393c2a` | `--color-olive-ink` | Primary text, borders, and structural strokes — all type from body to display headings, all card and image borders, all interactive outlines |
| Sage Type | `#737955` | `--color-sage-type` | Display headings and brand voice — used for the monumental SHELBY wordmark, section anchors, and selective heading accents that carry the brand's botanical identity |
| Linen | `#efe6d9` | `--color-linen` | Primary canvas and card surfaces — page background, card fills, the base warm tone the entire system sits on |
| Sienna | `#d6b292` | `--color-sienna` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Driftwood | `#afa199` | `--color-driftwood` | Tertiary surface and muted helpers — profile-section backdrop, desaturated metadata, low-emphasis UI text and dividers |
| Riverstone | `#7b8785` | `--color-riverstone` | Cool-toned neutral for subtle contrast shifts — secondary surface, hover or muted state for UI elements needing visual separation from the warm base |

## Tokens — Typography

### Ranade — Display and editorial headlines. Used at extreme scale (83–265px) for the wordmark and section anchors, and at 24px for the CONTACT callout. The geometric, slightly condensed forms give the brand its monumental-but-restrained voice — the type fills the frame without shouting. Substitute: Boldonse or Bold Neue for display, Space Grotesk for smaller uses. · `--font-ranade`
- **Substitute:** Boldonse, Space Grotesk
- **Weights:** 400, 700
- **Sizes:** 24px, 83px, 158px, 265px
- **Line height:** 0.90, 1.00, 1.20
- **Role:** Display and editorial headlines. Used at extreme scale (83–265px) for the wordmark and section anchors, and at 24px for the CONTACT callout. The geometric, slightly condensed forms give the brand its monumental-but-restrained voice — the type fills the frame without shouting. Substitute: Boldonse or Bold Neue for display, Space Grotesk for smaller uses.

### Switzer — Everything else: body copy, nav, labels, metadata, card titles, list items. The compact grotesque reads as editorial running text. Weight 500–600 is the workhorse range; 700 is reserved for section headers and emphasized nav. Substitute: Inter, Untitled Sans, or Suisse Int'l for full weight coverage. · `--font-switzer`
- **Substitute:** Inter, Untitled Sans
- **Weights:** 500, 600, 700
- **Sizes:** 10px, 11px, 14px, 16px, 20px
- **Line height:** 1.00, 1.20, 1.25, 1.30
- **Role:** Everything else: body copy, nav, labels, metadata, card titles, list items. The compact grotesque reads as editorial running text. Weight 500–600 is the workhorse range; 700 is reserved for section headers and emphasized nav. Substitute: Inter, Untitled Sans, or Suisse Int'l for full weight coverage.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 14px | 1.3 | — | `--text-body` |
| heading-sm | 20px | 1.2 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| display | 83px | 0.9 | — | `--text-display` |
| display-lg | 158px | 0.9 | — | `--text-display-lg` |
| wordmark | 265px | 0.9 | — | `--text-wordmark` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 36-56px
- **Card padding:** 20px
- **Element gap:** 12px

## Components

### Wordmark Display
**Role:** Brand-defining type element

Ranade at 265px, weight 400, line-height 0.90, Sage Type (#737955), no letter-spacing. Stretches full viewport width edge-to-edge, character spacing visually tight. This is the signature element — a single word filling the frame. Always uppercase, always at maximum scale.

### Section Anchor
**Role:** Section transition label

Ranade at 24px, weight 400, line-height 1.20, Olive Ink (#393c2a). Centered, used as a quiet callout like 'CONTACT' that invites scroll rather than commanding action. No underline, no decoration — the typographic scale does the work.

### Rotated Side Label
**Role:** Vertical decorative element

Ranade at 83–158px, weight 400, Olive Ink (#393c2a), rotated 90° counter-clockwise, pinned to the right edge of the viewport. Functions as a running header equivalent — stays fixed or appears on hero to mark the page identity without competing with the wordmark.

### Minimal Nav
**Role:** Text-only site navigation

Switzer 11–14px, weight 500, uppercase, Olive Ink (#393c2a), letter-spacing normal. Aligned to the page edges (left for primary links, right for meta like '2026'). No buttons, no backgrounds, no separators between items — whitespace defines the links. Links carry an Olive Ink underline or border on hover.

### Project Card
**Role:** Work grid item

Full-bleed image inside a 0px-radius frame on Sienna (#d6b292) background. Date stamp in top-left corner at Switzer 10px, weight 500, Olive Ink. Two-letter abbreviation label centered below the card at Switzer 11px, weight 600, Olive Ink. No card border, no shadow — the image IS the card.

### Date Stamp
**Role:** Editorial metadata

Switzer 10px, weight 500, Olive Ink (#393c2a), positioned absolutely in the top-left of a project card or section. Oriented vertically (rotated 90°). Functions as an issue number on a magazine cover — establishes the editorial metaphor.

### Client List Column
**Role:** Sidebar content list

Switzer 11–14px, weight 500, Olive Ink (#393c2a), no bullet points, no indentation — items stack directly. Functions as a type-only index, running vertically along the left margin of the work section.

### Portrait Image Card
**Role:** Profile photo with duotone treatment

Square or near-square image, 0px radius, desaturated to sit within the olive palette. No border, no caption box. The image breathes directly against Driftwood (#afa199) surface. Functions as the only 'media' moment on the profile page — type does the rest.

### Recognition / Award List
**Role:** Right-aligned metadata column

Switzer 11–14px, weight 500, Olive Ink, right-aligned text. Multi-line entries with project name on one line, award details indented below. Dense, compact — reads as a colophon or index page from a printed book.

### Full-Bleed Botanical Background
**Role:** Hero atmosphere layer

Large nature/plant photography at extremely low opacity (roughly 10–15%) overlaid on the Linen (#efe6d9) canvas. Images extend edge-to-edge with no border. Creates a greenhouse/atelier atmosphere without competing with the wordmark. No rounded corners, no mask.

### Hero Subtitle
**Role:** Opening statement below the wordmark

Switzer 14–16px, weight 500, line-height 1.30, Olive Ink (#393c2a). Two short lines maximum, left-aligned. Sets the editorial voice — reads as an author's bio on a book jacket, not a marketing tagline.

## Do's and Don'ts

### Do
- Use Ranade at 83px or larger for any brand or section-defining headline — it is the only type with permission to fill the frame.
- Set body and metadata in Switzer weight 500–600 at 10–16px — the compact grotesque is the workhorse and should handle 90% of the interface.
- Build the palette from exactly two brand colors: Olive Ink (#393c2a) for structure, Sage Type (#737955) for brand voice. Use Sage sparingly — one display element per section maximum.
- Let the canvas shift through warm tonal layers (Linen → Sienna → Driftwood) to define sections instead of hard borders or color blocks.
- Use 0px border-radius everywhere — cards, images, tags. The printed-page metaphor demands sharp corners.
- Use 7–8px padding for tight metadata containers and 20px for card padding — the 8px base unit governs all spacing.
- Use Olive Ink (#393c2a) for all text and borders. The 9.2:1 contrast ratio on Linen makes it readable at 10px and monumental at 265px.

### Don't
- Don't add drop shadows, glows, or any CSS elevation — the system is deliberately flat and print-like.
- Don't introduce rounded corners (border-radius > 0) on any element — it breaks the editorial metaphor.
- Don't use Sage Type (#737955) for body text — its 3.7:1 contrast on Linen fails readability standards. Reserve it for display headings only.
- Don't create filled button backgrounds in any color — this system has no CTA buttons. Navigation is text-only, contact is a typographic anchor.
- Don't use gradients, brand illustrations, or icon sets — the visual language is photography, type, and tonal layering only.
- Don't use any cool or neutral gray outside the Riverstone (#7b8785) token — all neutrals must stay warm to maintain the botanical atmosphere.
- Don't center body text. Left-align everything except section anchors, which are the only elements that get centered treatment.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Linen | `#efe6d9` | Primary page canvas — hero, default section background |
| 2 | Sienna | `#d6b292` | Work/index section — tonal page break |
| 3 | Driftwood | `#afa199` | Profile section background — deeper warm shift |
| 4 | Riverstone | `#7b8785` | Cool-tinted neutral for contrast states or secondary overlays |

## Elevation

The system is flat by editorial design principle: no drop shadows, no elevation, no floating surfaces. Depth is created only through tonal layering of warm surfaces, border lines, and full-bleed photography. Cards sit directly on their section surface with a hairline border or none at all — the printed-page metaphor forbids digital lift.

## Imagery

Photography is botanical and atmospheric, used as a low-opacity texture layer behind the wordmark — large plants, palms, foliage rendered at 10–15% opacity so they read as a greenhouse shadow rather than a subject. One full-bleed portrait appears on the profile page, desaturated to sit within the olive palette and cropped tight. No product photography, no abstract 3D, no illustration. No icon system — the only graphic elements are type itself. Image treatment is always full-bleed with 0px radius and no border or mask. Imagery is atmospheric, never explanatory.

## Layout

Full-bleed layout with no max-width container — the wordmark stretches edge-to-edge, and section backgrounds span the full viewport. The hero is a single massive headline (SHELBY) overlaid on low-opacity botanical photography, with a hero subtitle in the lower-left and minimal nav along the bottom edge. A rotated 'KAY' label sits on the right margin. The work section uses a 4-column card grid on a warm tan background, with a vertical client list running down the left margin. The profile section shifts to a 3-column layout: portrait left, label/title center, dense metadata right. Section rhythm is defined by tonal surface shifts (cream → tan → taupe) rather than hard dividers. Navigation is a bottom-aligned minimal text bar on the hero; absent on interior pages which use scrolling. The page model is editorial — asymmetric, generous vertical breathing room between sections, no centered max-width constraint.

## Agent Prompt Guide

**Quick Color Reference**
- text: #393c2a (Olive Ink)
- background: #efe6d9 (Linen)
- border: #393c2a (Olive Ink)
- accent: #737955 (Sage Type)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Build the wordmark hero**: Full-bleed #efe6d9 canvas with a large botanical photograph at ~12% opacity filling the background. Centered display heading 'SHELBY' in Ranade weight 400, size 265px, line-height 0.90, color #737955, stretching edge-to-edge. A hero subtitle below in Switzer weight 500, 14px, line-height 1.30, color #393c2a, left-aligned, two short lines maximum.

2. **Build a project card for the work grid**: On a #d6b292 section background, render a full-bleed image with 0px border-radius as the card body. Overlay a date stamp in the top-left corner using Switzer weight 500, 10px, color #393c2a, rotated 90°. Below the card, center a two-letter label in Switzer weight 600, 11px, color #393c2a. No border, no shadow, 20px gap between cards.

3. **Build the minimal nav bar**: Fixed or bottom-aligned, 7px vertical padding. Left side: three text links ('WORK', 'PROFILE', 'CONTACT') in Switzer weight 500, 11px, uppercase, color #393c2a, separated by 20px gap. Right side: a year label ('2026') in the same style, right-aligned. No backgrounds, no borders, no dividers — whitespace defines the items.

4. **Build the profile section**: On a #afa199 background, place a square portrait image on the left (0px radius, no border). In the center, a label 'RECOGNITION' in Switzer weight 700, 14px, color #393c2a, followed by a vertical list of names in Switzer weight 500, 11px. On the right, a right-aligned column of award entries in Switzer weight 500, 11px, with project names on one line and details below. 36px gap between sections.

5. **Build the rotated side label**: Pin a 'KAY' text element to the right edge of the viewport, rotated 90° counter-clockwise. Ranade weight 400, 158px, color #393c2a, line-height 0.90. Positioned vertically centered in the hero. Functions as a running header — the type touches the frame edge with no padding.

## Typography Philosophy

The system operates on radical type-scale contrast: Ranade at 265px for the wordmark, Switzer at 10px for metadata. This 26× ratio is the primary visual device — hierarchy is created by size alone, never by color or weight variation within a single element type. Ranade is used in weight 400 for display (the weight is light but the size is monumental, creating authority through scale not boldness). Switzer weight 500 is the default body; weight 600 for emphasized labels; weight 700 reserved for section headers. There is no italic, no underline decoration, no drop-cap — the type speaks through scale and the two-color ink system.

## Similar Brands

- **Locomotive (locomotive.ca)** — Same editorial-portfolio approach with massive display type bleeding edge-to-edge, warm neutral palette, and botanical/nature photography as atmospheric backdrop
- **Bureau Cool** — Two-color ink system (dark + one accent) on warm cream canvas, custom display type at extreme scale, text-only navigation, no buttons or shadows
- **Pentagram (pentagram.com)** — Editorial portfolio rhythm — full-bleed sections, type-as-imagery, tonal surface shifts instead of color blocks, zero chrome between sections
- **Rauno Freiberg** — Minimal text-only nav, extreme type contrast between display and metadata, flat surfaces with no shadows, warm neutral palette
- **Eli Hava (personal portfolio)** — Large stretched wordmark hero, rotated side text element, card-based work grid with date stamps — same magazine-spread structure

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-olive-ink: #393c2a;
  --color-sage-type: #737955;
  --color-linen: #efe6d9;
  --color-sienna: #d6b292;
  --color-driftwood: #afa199;
  --color-riverstone: #7b8785;

  /* Typography — Font Families */
  --font-ranade: 'Ranade', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.3;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-display: 83px;
  --leading-display: 0.9;
  --text-display-lg: 158px;
  --leading-display-lg: 0.9;
  --text-wordmark: 265px;
  --leading-wordmark: 0.9;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-56: 56px;

  /* Layout */
  --section-gap: 36-56px;
  --card-padding: 20px;
  --element-gap: 12px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-linen: #efe6d9;
  --surface-sienna: #d6b292;
  --surface-driftwood: #afa199;
  --surface-riverstone: #7b8785;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-olive-ink: #393c2a;
  --color-sage-type: #737955;
  --color-linen: #efe6d9;
  --color-sienna: #d6b292;
  --color-driftwood: #afa199;
  --color-riverstone: #7b8785;

  /* Typography */
  --font-ranade: 'Ranade', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.3;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-display: 83px;
  --leading-display: 0.9;
  --text-display-lg: 158px;
  --leading-display-lg: 0.9;
  --text-wordmark: 265px;
  --leading-wordmark: 0.9;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-56: 56px;
}
```
