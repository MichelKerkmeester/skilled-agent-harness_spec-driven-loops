# Gamma — Style Reference
> white-walled art gallery. The UI is a silent frame; the artwork is the only thing that should be loud.

**Theme:** light

Gamma uses a gallery-frame design language: the interface is nearly invisible (near-black text on white with cool gray hairlines) so the digital artworks become the only source of color. The custom Gamma Sans Display is a neo-grotesque with weights at 300/400/600 that whisper rather than shout, and the 999px pill radius on interactive elements contrasts deliberately with the sharp 4px corners on artwork thumbnails. Cards are flat with no elevation or shadow — everything sits on one plane, like prints hung flush against a museum wall. The grid is a 2-column row of oversized featured drops, then a compact numbered list for the rest, letting the hierarchy be carried entirely by image size rather than color or depth.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#0c0c0d` | `--color-ink-black` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, text on dark fills, input backgrounds |
| Ash | `#e9e9ec` | `--color-ash` | Hairline borders, subtle dividers, hover surfaces, secondary button outlines |
| Smoke | `#808080` | `--color-smoke` | Muted body text, metadata (mint counts, prices), inactive icons, placeholder content |
| Graphite | `#242629` | `--color-graphite` | Icon strokes, secondary button borders, slightly elevated neutral surfaces |
| Charcoal | `#1d1d1e` | `--color-charcoal` | Rare dark surface (e.g. featured card panels) — used sparingly to create a single dark anchor in an otherwise all-white page |
| Blush to Violet | `linear-gradient(168.57deg, #ffffff 14.81%, #fbf0ed 22.79%, #e0a6b5 81.04%, #dc94d5 91.42%)` | `--color-blush-to-violet` | Hero wash gradient — soft pink-to-magenta transition used only as a backdrop to large featured artworks, never as a UI fill |

## Tokens — Typography

### Gamma Sans Display — Single-family system used for everything from micro-labels to the 72px hero display. Weight 300 for oversized hero titles ('LIGHT') creates a near-tracery effect that lets the artwork underneath read through; weight 600 reserved for short labels and the Connect button; weight 400 carries body and metadata. The custom neo-grotesque has a slightly condensed character width and flat apertures that feel more architectural than friendly. · `--font-gamma-sans-display`
- **Substitute:** Inter
- **Weights:** 300, 400, 600
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px, 48px, 72px
- **Line height:** 1.15–1.50
- **Letter spacing:** -0.005em to +0.023em (slight positive tracking on small caps labels, near-zero on large display)
- **Role:** Single-family system used for everything from micro-labels to the 72px hero display. Weight 300 for oversized hero titles ('LIGHT') creates a near-tracery effect that lets the artwork underneath read through; weight 600 reserved for short labels and the Connect button; weight 400 carries body and metadata. The custom neo-grotesque has a slightly condensed character width and flat apertures that feel more architectural than friendly.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 12px | 1.43 | 0.02px | `--text-micro` |
| caption | 14px | 1.43 | 0.01px | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.33 | — | `--text-body` |
| subheading | 20px | 1.33 | -0.005px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.01px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.01px | `--text-heading` |
| heading-lg | 40px | 1.17 | -0.02px | `--text-heading-lg` |
| display | 48px | 1.15 | -0.02px | `--text-display` |
| hero | 72px | 1.15 | -0.05px | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 52 | 52px | `--spacing-52` |
| 88 | 88px | `--spacing-88` |
| 104 | 104px | `--spacing-104` |
| 140 | 140px | `--spacing-140` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 8px |
| images | 4px |
| inputs | 999px |
| buttons | 999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-88px
- **Card padding:** 20-24px
- **Element gap:** 4-8px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-width white bar, 64-72px tall, sticky. Left: Gamma monogram logo + pill-shaped search input (999px radius, #e9e9ec border). Center: text nav links (Explore, Charts, Create, Learn) with dropdown carets, 14px weight 400 #0c0c0d. Right: 'Connect' filled black pill button (999px radius, #0c0c0d bg, #ffffff text, 16-20px horizontal padding, 8-10px vertical). Bottom border: 1px #e9e9ec.

### Search Input (Pill)
**Role:** Global collection/artist search

Rounded pill at 999px, 1px #e9e9ec border, #ffffff background, 36-40px tall. Placeholder text in #808080, search icon left in #808080. Focus state: border darkens to #0c0c0d.

### Connect Button (Filled Pill)
**Role:** Primary action — wallet connection

999px radius, #0c0c0d background, #ffffff text, 14-15px weight 600 Gamma Sans Display, 18-20px horizontal padding, 8-10px vertical padding. No border, no shadow. This is the only filled dark element in the system — it earns its weight by being the only call to action.

### Nav Link (Ghost)
**Role:** Section navigation

Transparent background, #0c0c0d text, 14px weight 400, no underline, small dropdown caret. Hover: text remains #0c0c0d (no color shift — restraint).

### Hero Feature Banner
**Role:** Showcase for the top curated drop

Full-bleed image container, 4px corner radius, with the featured artwork bleeding edge-to-edge. Overlaid massive display text ('LIGHT' at 72px weight 300) sits directly on the artwork in #0c0c0d, with no text background or scrim — the type is allowed to compete with the art. Below the image, a meta row: collection title (20-24px weight 400), creator description (16px #808080), mints claimed count with progress bar, BTC mint price in mono-weight, and a 'View Drop' outlined pill button.

### Collection Card (Grid)
**Role:** Featured drop in 2-column grid

Large rectangular card, 4px image radius on top (artwork is the visual), white surface below image, no padding between image and meta. Meta block: title (18-20px weight 400), description (14px #808080, 2 lines clamp), mints-claimed progress bar (#0c0c0d fill on #e9e9ec track), price label, 'View Drop' button. No card border, no shadow — the image edge defines the card.

### Numbered Collection List Item
**Role:** Compact ranked list of drops

Horizontal row: large ordinal number (1, 2, 3…) in 24px weight 300 #808080 on the far left, 64-80px square thumbnail (4px radius), then title (18px weight 400 #0c0c0d) and meta line (14px #808080: minted count · mint price). No card background, just whitespace separation; subtle bottom border in #e9e9ec or no border at all.

### View Drop Button (Outlined Pill)
**Role:** Secondary action on collection cards

999px radius, transparent background, 1px #0c0c0d border, #0c0c0d text, 13-14px weight 400, 16px horizontal padding, 8px vertical. Ghost/inverse of the Connect button — same shape, opposite fill, signals 'explore further' rather than 'commit'.

### Print Product Card
**Role:** Section product showcase (Prints / Editions)

Full-bleed image with a 12-20px radius depending on artwork, pink/violet gradient wash background (the Blush-to-Violet gradient), title and artist meta stacked on the left, sale status and edition count on the right with a dot indicator. A subtle white download/original chip sits at the bottom right.

### Mints Claimed Progress Bar
**Role:** Scarcity / progress indicator

Thin 2-3px tall bar, #e9e9ec track, #0c0c0d fill. Sits directly under the mints-claimed label (e.g. '44% · 432 / 1,410'). No border, no radius (or 2px max).

### Metadata Label
**Role:** Caption-level info (price, counts, dates)

14px weight 400 in #808080, often inline with a '·' separator. Numeric values may be slightly heavier (weight 600) in #0c0c0d to lift them from the label.

### Section Header with Inline Link
**Role:** Section title bar

Large section title (24-32px weight 600) with a small inline icon to its left, short descriptive subhead in 14px #808080 on the same line, and a ghost/text action link ('Explore prints') right-aligned. No divider, no background — just spacing.

## Do's and Don'ts

### Do
- Use #0c0c0d filled pills with 999px radius for the single primary action per screen; the rest must be ghost or text
- Keep all UI surfaces achromatic — only the artwork or the Blush-to-Violet gradient carries color
- Use 4px radius on artwork images and thumbnails at every size, 8px on text cards, 999px on any interactive element
- Set headlines in Gamma Sans Display weight 300 at 48-72px so the type reads as a watermark, not a wall
- Separate cards with 1px #e9e9ec hairlines or whitespace alone; never use box-shadow for elevation
- Use 14px #808080 weight 400 for all metadata (mint counts, prices, dates) and inline numerics in #0c0c0d weight 600 to lift them
- Maintain ~88px vertical gap between major sections and 40px between sub-blocks to let the artworks breathe

### Don't
- Do not introduce a chromatic accent color, brand fill, or saturated button — the UI must stay colorless so the artwork remains the only loud element
- Do not round artwork thumbnails beyond 4px; the sharp corner is what makes the image feel like a print pinned to a wall
- Do not use box-shadow, glow, or blur on any component — depth is communicated only by hairline borders and a single dark surface
- Do not place UI text inside a scrim or colored box over artwork; the display type must sit directly on the image
- Do not use the Blush-to-Violet gradient on buttons, navs, or borders — it is reserved for the Prints section backdrop only
- Do not mix more than two type weights on a single screen; the 300/400/600 scale is for hierarchy, not decoration
- Do not center-align body text or metadata; keep descriptions and counts left-aligned with consistent left margin to the thumbnail edge

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the gallery wall |
| 1 | Card | `#ffffff` | Collection cards, list items, product panels — same color as canvas, separated only by hairline borders |
| 2 | Hover / Subtle | `#e9e9ec` | Hover wash, progress bar fill, secondary surface tint |
| 3 | Dark Anchor | `#1d1d1` | Rare inverted card surface for featured/highlighted content |
| 4 | Inverse CTA | `#0c0c0d` | Primary action button (Connect) — only filled dark element in the system |

## Elevation

No shadows anywhere. Depth is communicated exclusively through hairline 1px borders in #e9e9ec and the single dark surface (#1d1d1e) as an inversion. This is a deliberate flat-gallery choice — shadows would make UI elements feel like they are floating in front of the artwork instead of being part of the same wall.

## Imagery

Imagery is the entire product. The UI hosts third-party digital artworks at full scale; Gamma itself contributes no illustration or photography. Artwork thumbnails are sharp-cornered (4px) at every size — no rounded softening. The one in-house visual asset is the Blush-to-Violet hero wash gradient, which acts as a 'scaffold' that disappears behind the work. Iconography is monochrome line art in #0c0c0d or #242629, stroke-weight around 1.5px, no fill. No 3D, no product mockups, no lifestyle photography — the work speaks for itself.

## Layout

Max-width ~1200px centered, generous outer gutters. Hero is a single full-bleed featured drop, not a split layout — the image spans the full content width and text overlays it. Below: 2-column grid of large collection cards, one row of two, with comfortable ~24-32px gap. Then a compact numbered list (single column, 3-5 items) with no card containers — just typographic rhythm. Section headers sit on the left margin with right-aligned ghost links. Vertical rhythm: ~88px between major sections, ~40px between sub-blocks. No sidebar, no sticky elements beyond the top nav. The page is essentially: hero → grid → list → product spotlight, stacking downward with no visual break devices.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0c0c0d
- background: #ffffff
- border: #e9e9ec
- muted text: #808080
- accent: no distinct accent — UI is intentionally achromatic
- primary action: #0c0c0d (filled action)

**Example Component Prompts**
1. Build the top nav: white bar, 1px #e9e9ec bottom border, 64px tall. Left: Gamma logo + pill search (999px radius, 1px #e9e9ec border, #ffffff bg, 14px placeholder in #808080). Center: ghost links 'Explore', 'Charts', 'Create', 'Learn' in 14px #0c0c0d. Right: 'Connect' filled pill — #0c0c0d bg, #ffffff text, 999px radius, 14px weight 600, 20px 8px padding.

2. Build a hero feature: full-bleed artwork image (4px radius), overlaid display text 'LIGHT' at 72px Gamma Sans weight 300 in #0c0c0d, sitting directly on the image with no scrim. Below image: title in 20px weight 400, creator description in 16px #808080, mints-claimed progress bar (2px tall, #e9e9ec track, #0c0c0d fill), and a 'View Drop' outlined pill (999px, 1px #0c0c0d border, transparent bg, #0c0c0d text).

3. Build a 2-column collection grid: each card is 4px-radius artwork on top, 20-24px padding below for the meta block (no card background, no border, no shadow). Meta: title 18px weight 400 #0c0c0d, description 14px #808080 truncated to 2 lines, progress bar, and a 'View Drop' ghost pill.

4. Build a numbered list item: horizontal row, ordinal number in 24px weight 300 #808080 on the far left, 72px square thumbnail (4px radius), then title in 18px weight 400 #0c0c0d and a meta line in 14px #808080 ('X minted · 0.00021 BTC'). No card background, no border, just whitespace.

5. Build a section header row: left-aligned title in 24-32px weight 600 with a small leading icon, followed by a 14px #808080 subhead inline, and a right-aligned ghost link ('Explore prints') in 14px weight 400 #0c0c0d. No background, no divider — spacing alone separates sections.

## Gradient System

One gradient only: the Blush-to-Violet wash (168.57deg, #ffffff → #fbf0ed → #e0a6b5 → #dc94d5). It is used exclusively as a soft backdrop for the 'Prints' / product spotlight section, never as a button fill, never as a border, never on a primary CTA. Its job is to act as a neutral 'frame color' that complements the artwork without competing with it. Do not introduce additional gradients — the system is otherwise achromatic by design.

## Similar Brands

- **Sotheby's digital** — Same gallery-frame approach: achromatic UI with oversized whitespace, sharp-cornered artwork thumbnails, and ultra-thin type that disappears so the lot speaks
- **Foundation (foundation.app)** — Same monochrome art-marketplace treatment with near-zero UI color, oversized hero drops, and weight-300 display type overlaid directly on artwork
- **Christie's online** — Comparable white-canvas auction layout: clean grid of featured lots, numbered lists, hairline dividers, and a single dark filled CTA
- **Objkt (Tezos marketplace)** — Same numbered-list + 2-column-grid rhythm for artist drops, and same restraint on UI color so digital art carries the palette
- **SuperRare** — Same flat gallery approach: no shadows, 4px image corners, pill buttons, and an almost all-white surface that recedes behind the work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #0c0c0d;
  --color-pure-white: #ffffff;
  --color-ash: #e9e9ec;
  --color-smoke: #808080;
  --color-graphite: #242629;
  --color-charcoal: #1d1d1e;
  --color-blush-to-violet: #e09bb5;
  --gradient-blush-to-violet: linear-gradient(168.57deg, #ffffff 14.81%, #fbf0ed 22.79%, #e0a6b5 81.04%, #dc94d5 91.42%);

  /* Typography — Font Families */
  --font-gamma-sans-display: 'Gamma Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.43;
  --tracking-micro: 0.02px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.01px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.33;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.005px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.01px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.01px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -0.02px;
  --text-display: 48px;
  --leading-display: 1.15;
  --tracking-display: -0.02px;
  --text-hero: 72px;
  --leading-hero: 1.15;
  --tracking-hero: -0.05px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-88: 88px;
  --spacing-104: 104px;
  --spacing-140: 140px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-88px;
  --card-padding: 20-24px;
  --element-gap: 4-8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 8px;
  --radius-images: 4px;
  --radius-inputs: 999px;
  --radius-buttons: 999px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-hover-subtle: #e9e9ec;
  --surface-dark-anchor: #1d1d1;
  --surface-inverse-cta: #0c0c0d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #0c0c0d;
  --color-pure-white: #ffffff;
  --color-ash: #e9e9ec;
  --color-smoke: #808080;
  --color-graphite: #242629;
  --color-charcoal: #1d1d1e;
  --color-blush-to-violet: #e09bb5;

  /* Typography */
  --font-gamma-sans-display: 'Gamma Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.43;
  --tracking-micro: 0.02px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.01px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.33;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.005px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.01px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.01px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -0.02px;
  --text-display: 48px;
  --leading-display: 1.15;
  --tracking-display: -0.02px;
  --text-hero: 72px;
  --leading-hero: 1.15;
  --tracking-hero: -0.05px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-88: 88px;
  --spacing-104: 104px;
  --spacing-140: 140px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;
}
```
