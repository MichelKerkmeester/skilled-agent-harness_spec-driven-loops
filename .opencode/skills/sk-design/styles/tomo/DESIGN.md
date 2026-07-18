# TOMO — Style Reference
> torn zine pages taped to a fridge — flat, warm, and unapologetically analog.

**Theme:** light

TOMO reads as a printed zine taped to a refrigerator — warm linen canvas, oversized serif display type, torn-paper navigation stickers, and tomato-red marquee banners. Every surface is flat: no shadows, no gradients, no elevation. The visual grammar is collage, not card grid: food photography, street photography, and rubber-stamp typography layered freely on a cream page, anchored by razor-thin black borders. Recife's high-contrast serif does the heavy lifting at 80–120px scale while body stays small and functional. A single accent — tomato red — arrives as a marquee ribbon and stamp ink, never as a button fill. The system refuses the conventions of restaurant websites: no menus in accordions, no reservation widgets floating mid-page, no color-coded CTAs.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Linen | `#eee2d4` | `--color-warm-linen` | Page canvas, section backgrounds — the cream that everything is taped onto |
| Press Black | `#000000` | `--color-press-black` | Display headlines, body text, card borders, image frames — the dominant ink across all surfaces |
| Paper White | `#ffffff` | `--color-paper-white` | Inset card surfaces, nav sticker fills, reverse type on dark or red panels |
| Tape Gray | `#efefef` | `--color-tape-gray` | Subtle surface lift on rare neutral buttons — almost invisible |
| Tomo Red | `#ff6347` | `--color-tomo-red` | Marquee banner background, rubber-stamp text fill, promotional callouts — the single chromatic accent, tomato-toned for a restaurant called TOMO |

## Tokens — Typography

### Recife — Display and headline serif — used at extreme sizes (80px+) for the TOMO wordmark and large section titles; weight 300 keeps the high-contrast strokes elegant rather than heavy. Signature voice: if the headline were a voice it would be a whisper in a cathedral · `--font-recife`
- **Substitute:** DM Serif Display or Playfair Display (both free, both carry similar high-contrast didone energy)
- **Weights:** 300, 400
- **Sizes:** 26px, 32px
- **Line height:** 1.00–1.30
- **Letter spacing:** normal at body sizes; slightly tight at display
- **Role:** Display and headline serif — used at extreme sizes (80px+) for the TOMO wordmark and large section titles; weight 300 keeps the high-contrast strokes elegant rather than heavy. Signature voice: if the headline were a voice it would be a whisper in a cathedral

### Times — Small functional text, timestamps, fine print — the only body-weight serif in the system, used sparingly for texture rather than readability at scale · `--font-times`
- **Substitute:** Times New Roman (already system) or Cormorant Garamond for a less utilitarian feel
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Small functional text, timestamps, fine print — the only body-weight serif in the system, used sparingly for texture rather than readability at scale

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body | 26px | 1.3 | — | `--text-body` |
| subheading | 32px | 1.3 | — | `--text-subheading` |
| display | 96px | 1 | -1.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 13 | 13px | `--spacing-13` |
| 75 | 75px | `--spacing-75` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 65-115px
- **Card padding:** 6px
- **Element gap:** 13px

## Components

### Marquee Banner
**Role:** Top-of-page announcement ribbon

Full-bleed horizontal band, #ff6347 background, white Recife 26px/32px text, tight line-height, no padding differentiation — reads as a stuck-on strip of colored paper. Text is uppercase, runs edge to edge.

### Wordmark Display
**Role:** Brand identity, page-opening headline

TOMO rendered in Recife at ~120px, weight 300, #000000, line-height 1.00, tracking tight. Single-line, spans viewport width. This is the heaviest typographic moment on any page.

### Sticker Navigation
**Role:** Primary site navigation

Nav items appear as individual torn-paper labels: white #ffffff fill, #000000 1px border, 6px horizontal padding, 0 radius, Recife 26–32px text. Labels sit on the cream canvas with small gaps between them, not in a bar. One active item (BUDS) appears stamped/overprinted in a textured style.

### Rubber-Stamp Text
**Role:** Editorial callout overlay

Large display text (~80–120px) in a dark teal or #ff6347, rendered with a distressed, slightly rotated, offset-print texture. Used as section titles floating over photography collages. Recife or similar serif, uppercase, tracked tight. Position is art-directed, never centered by default.

### Photo Collage Tile
**Role:** Image element in editorial layout

Photographs placed freely on the cream canvas with 0 radius, 1–2px #000000 hairline borders (sometimes absent), no shadow, no padding. Images overlap and are scaled to bleed off edges. Each photo is treated as a physical print taped to the page.

### Reverse-Type Card
**Role:** Content panel on dark or red surface

White #ffffff text on Press Black or Tomo Red background, Recife 26–32px, 6px padding. Used for photo captions, menu items on red panels, or stamp text. No border, no radius.

### Outlined Nav Label
**Role:** Secondary link or footer item

White fill, #000000 1px border, Recife text, 0 radius. Visually identical to the main nav stickers but smaller (13px Times or 26px Recife) and used for inline links or footer navigation.

### Promotional Red Panel
**Role:** Full-bleed red section or callout

#ff6347 background, white Recife text, generous vertical padding (65–115px). Functions as a marquee, announcement, or section divider. Always full-width, never a contained card.

### Hovered/Inset Image Frame
**Role:** Image with hairline border

Photography wrapped in a 1px #000000 border, 0 radius, no padding between image and border. The border is the image's container, not decorative chrome.

## Do's and Don'ts

### Do
- Use Recife at 80px+ for any display-level headline; let it dominate the viewport the way the TOMO wordmark does
- Set every border to exactly 1px #000000 — hairline black is the only border weight in the system
- Use 0 radius everywhere — no rounded corners on cards, buttons, tags, or images
- Let #ff6347 appear only as marquee ribbons, stamp ink, or full-bleed sections — never as a button fill
- Space sections with 65–115px bottom padding on the cream canvas; the page breathes
- Layer photography and type freely; overlap, rotate stamps slightly, bleed images off edges
- Keep body text small (13–26px) and functional; let the display type carry the visual weight
- Use white #ffffff as a surface for sticker labels and reverse type, not as the page background

### Don't
- Do not introduce shadows, gradients, or any elevation language — the system is intentionally flat
- Do not add rounded corners anywhere; 0px radius is non-negotiable
- Do not use #ff6347 as a button background or filled CTA chip; it belongs on marquees and stamps only
- Do not use a sans-serif for headlines — the serif (Recife or substitute) is the brand voice
- Do not center every element; the layout is art-directed and asymmetric, not gridded
- Do not build a card grid with equal gutters — the collage has its own rhythm
- Do not introduce a secondary accent color; the entire chromatic vocabulary is one tomato red
- Do not wrap content in a max-width container on the homepage — the canvas is full-bleed
- Do not use Times for display or large headings; it is functional fine print only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Linen Canvas | `#eee2d4` | Base page background — the cream that absorbs everything |
| 1 | Paper White | `#ffffff` | Sticker labels, inset cards, reverse type panels |
| 2 | Tomo Red Marquee | `#ff6347` | Promotional ribbon — a surface, not a button |

## Elevation

TOMO has no elevation system. Surfaces never lift — they sit flat on the cream canvas, separated only by 1px hairline borders or by the canvas itself. When something needs to read as 'on top,' it uses a different fill (white on cream, red on cream) rather than a shadow. This is a deliberate editorial decision: the page is a printed page, not a glass UI.

## Imagery

Photography is collage-cut and laid flat: restaurant interiors, food close-ups (crab, strawberries, melon, cooked prawns, rice cookers, oysters, wine bottles), street photography of a White Center neighborhood, and Japanese cultural objects (a maneki-neko, tape cassettes, a 'Tahoe' motel sign). Images have 0 radius, 1px black borders or none, and overlap each other and the type. No lifestyle staging, no soft-focus food photography — the crops are tight, the light is natural, the color is saturated. Rubber-stamp text overlays in teal and red sit on top of the imagery. The visual density is high: most of the page is image, with type acting as collage elements rather than content blocks.

## Layout

Full-bleed editorial composition with no max-width container. The page opens with a red marquee banner edge-to-edge, then the TOMO wordmark at viewport scale on the cream canvas. Navigation is a horizontal row of sticker labels on cream, not a bar. Below the fold, photography and type are arranged in an art-directed collage: images bleed off edges, overlap, and sit at different scales, with rubber-stamp section titles floating over them. There is no card grid, no two-column feature pattern, no pricing table. The rhythm is driven by 65–115px section padding and the natural composition of the collage rather than by a grid system. The page is designed to scroll vertically as a sequence of editorial spreads.

## Agent Prompt Guide

## Quick Color Reference
- background: #eee2d4 (Warm Linen)
- text: #000000 (Press Black)
- border: #000000 (1px hairline only)
- surface: #ffffff (Paper White, for stickers and reverse type)
- accent: #ff6347 (Tomo Red — marquees and stamps only)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Wordmark header**: Render 'TOMO' in Recife (or DM Serif Display) at 120px, weight 300, #000000, line-height 1.00, tracking -0.02em, on a #eee2d4 cream canvas. No border, no padding around the wordmark — let it fill the viewport width.

2. **Marquee banner**: Full-bleed horizontal band, #ff6347 background, white Recife 26px uppercase text reading 'WE'RE OPEN FOR DINNER AND DRINKS 6 DAYS A WEEK FROM 5 PM. CLOSED TUESDAYS.' Line-height 1.0, 6px vertical padding, no border, 0 radius.

3. **Sticker nav item**: A 6px-padded white #ffffff label with 1px #000000 border, 0 radius, containing Recife 32px #000000 text like 'Info', 'Food', 'Drinks', 'Contact'. Sit on the cream canvas with 13px gaps between stickers.

4. **Rubber-stamp section title**: Large Recife 96px uppercase text in a dark teal (~#1f4d4d) or #ff6347, slightly rotated 2–4 degrees, with a distressed offset-print texture, floating over a photography collage on the cream canvas.

5. **Photo collage tile**: A full-bleed photograph (food or street scene) with 0 radius and a 1px #000000 border, placed on the cream canvas so it bleeds slightly off the viewport edge. No shadow, no padding, no rounded corners. The image IS the container.

## Similar Brands

- **Frank Ocean – Blonded.co** — Same collage-on-cream editorial language, oversized serif type, flat images with hairline borders, refusal of standard web conventions
- **Bottega Veneta (editorial site)** — Tall serif display type at extreme scale on a warm neutral canvas, full-bleed photography, art-directed rather than gridded layout
- **JACQUEMUS** — Warm cream backgrounds, oversized serif wordmarks, tomato-terracotta accent, collage-style product photography laid flat
- **Cereal Magazine** — Printed-magazine aesthetic, generous white space on warm paper, serif display type, photography treated as editorial spread not as thumbnails

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-linen: #eee2d4;
  --color-press-black: #000000;
  --color-paper-white: #ffffff;
  --color-tape-gray: #efefef;
  --color-tomo-red: #ff6347;

  /* Typography — Font Families */
  --font-recife: 'Recife', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 26px;
  --leading-body: 1.3;
  --text-subheading: 32px;
  --leading-subheading: 1.3;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-13: 13px;
  --spacing-75: 75px;

  /* Layout */
  --section-gap: 65-115px;
  --card-padding: 6px;
  --element-gap: 13px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-warm-linen-canvas: #eee2d4;
  --surface-paper-white: #ffffff;
  --surface-tomo-red-marquee: #ff6347;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-linen: #eee2d4;
  --color-press-black: #000000;
  --color-paper-white: #ffffff;
  --color-tape-gray: #efefef;
  --color-tomo-red: #ff6347;

  /* Typography */
  --font-recife: 'Recife', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 26px;
  --leading-body: 1.3;
  --text-subheading: 32px;
  --leading-subheading: 1.3;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-13: 13px;
  --spacing-75: 75px;
}
```
