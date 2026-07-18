# Sneak in Peace — Style Reference
> Editorial gallery behind frosted glass. A single muted fashion film bleeds edge-to-edge while every interactive surface — tabs, now-playing card, product tiles — hovers in a translucent white panel pinned to the right edge, as if pinned to a museum vitrine.

**Theme:** light

Sneak in Peace operates as a floating editorial vitrine: a full-bleed fashion film runs behind a translucent white panel that carries every interactive surface. The system is aggressively monochrome — 99% of pixels live in a narrow band between white, warm off-white, and two workhorse grays (#3d3d3d and #000000). Color is rationed like ink: one vivid red reserved exclusively for live-status punctuation, one deep navy (#142161) that surfaces only as a link border, and nothing else. Typography splits sharply between a utilitarian grotesque (NTNeuss) at 8–14px with generous tracking — creating a label/UI vocabulary — and a single editorial serif (RecklessNeue) used at 16–21px for narrative titles. Components are compact, 6px-cornered, almost flat, and float over the media rather than block it. The dominant gesture is restraint: the camera does the talking, the UI whispers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, icon strokes, high-contrast borders — the strongest voice in the system, used sparingly on headlines and glyphs |
| Charcoal | `#3d3d3d` | `--color-charcoal` | Default text, dividers, input and card borders — the workhorse gray carrying the entire UI structure |
| Concrete | `#9e9e9e` | `--color-concrete` | Subdued body text and secondary borders — the whisper layer beneath Charcoal |
| Ash | `#b5b5b5` | `--color-ash` | Disabled or resting-state button fills — surfaces that should recede |
| Smoke | `#8d8d8d` | `--color-smoke` | Active tab/segmented control background — the only gray used as a filled surface to indicate selected state |
| Paper White | `#ffffff` | `--color-paper-white` | Page and panel backgrounds, card surfaces, icon fills, image borders — the base canvas and the glass-panel fill |
| Bone | `#f0eeed` | `--color-bone` | Warm off-white used for badge fills and subtle surface lifts — gives a paper-like warmth against the cool grays |
| Liberty Navy | `#142161` | `--color-liberty-navy` | Outlined-action border and link underline — the only chromatic stroke in the system, indicating navigation or interactive text |
| Signal Red | `#ba2223` | `--color-signal-red` | Red action color for filled buttons, selected navigation states, and focused conversion moments |

## Tokens — Typography

### NTNeuss — The workhorse grotesque for all UI: body copy, labels, tab text, button text, badges, product metadata, timestamps, counts. Tracks wide (0.036–0.122em) — especially at 8–11px — giving micro-text a monospace-like label feel. Weight 500 is reserved for emphasized labels and tab active states; weight 400 carries everything else. · `--font-ntneuss`
- **Substitute:** Inter, Söhne, or Untitled Sans
- **Weights:** 400, 500
- **Sizes:** 8, 9, 10, 11, 12, 13, 14px
- **Line height:** 1.00, 1.20, 1.50, 2.10
- **Letter spacing:** 0.036em (0.36px) at 10px, 0.038em (0.456px) at 12px, 0.060em (0.72px) at 12px, 0.122em (0.976px) at 8px
- **Role:** The workhorse grotesque for all UI: body copy, labels, tab text, button text, badges, product metadata, timestamps, counts. Tracks wide (0.036–0.122em) — especially at 8–11px — giving micro-text a monospace-like label feel. Weight 500 is reserved for emphasized labels and tab active states; weight 400 carries everything else.

### RecklessNeue-Book — The editorial serif — used only for narrative titles (e.g. the 'NOW PLAYING' presentation headline). Its normal letter-spacing and serif detail cut through the utilitarian grotesque to signal editorial content. This is the ONLY moment the system speaks in anything other than UI voice. · `--font-recklessneue-book`
- **Substitute:** Reckless (Pangram Pangram), GT Sectra, or Lyon Display
- **Weights:** 400
- **Sizes:** 16px, 21px
- **Line height:** 1.40, 1.50
- **Role:** The editorial serif — used only for narrative titles (e.g. the 'NOW PLAYING' presentation headline). Its normal letter-spacing and serif detail cut through the utilitarian grotesque to signal editorial content. This is the ONLY moment the system speaks in anything other than UI voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body-sm | 11px | 1.5 | — | `--text-body-sm` |
| body | 12px | 1.5 | — | `--text-body` |
| body-lg | 13px | 1.5 | — | `--text-body-lg` |
| heading-sm | 14px | 1.5 | — | `--text-heading-sm` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| badges | 6px |
| inputs | 6px |
| avatars | 26px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.08) 1px 1px 6px -1px` | `--shadow-sm` |

### Layout

- **Page max-width:** 420px
- **Card padding:** 16px
- **Element gap:** 6px

## Components

### Glass Panel
**Role:** Primary container for all interactive UI, pinned to the right edge of the viewport

Semi-transparent white (~70% opacity) surface with backdrop blur. 6px radius corners, 1px subtle shadow rgba(0,0,0,0.08) 1px 1px 6px -1px. Vertically fills the viewport and contains tabs, schedule, now-playing card, and product list.

### Segmented Tab Bar
**Role:** Top-level navigation between Sneak / Shop / Wishlist

Three pill segments on a single row, each 6px radius. Active segment filled with Smoke (#8d8d8d) background, white text. Inactive segments transparent with Charcoal (#3d3d3d) text. Text in NTNeuss 12px weight 500 with ~0.5px tracking. 2px vertical padding.

### LIVE Badge
**Role:** Broadcast-status indicator

Filled Signal Red (#ba2223) rectangle, 6px radius, 5px vertical / 7px horizontal padding. White text in NTNeuss 9px weight 500, uppercase, ~0.5px tracking. The single place vivid red appears in the system.

### Schedule Toggle
**Role:** View-mode switch (Live vs Scheduled)

Two compact pill segments — 'LIVE' (red filled when active) and 'SCHEDULE' (outlined Charcoal border when active). NTNeuss 9–10px uppercase text. Sits directly below the tab bar.

### View Counter
**Role:** Passive social proof indicator

Charcoal (#3d3d3d) text with eye icon, NTNeuss 9–10px, followed by a 3-digit count. No background — lives inline within the glass panel header.

### Now Playing Card
**Role:** Featured editorial content (current broadcast presentation)

Opaque white tile nested in the glass panel. 'NOW PLAYING' label in NTNeuss 10px uppercase with wide tracking (~0.6px). Serif title in RecklessNeue-Book 21px, Ink Black (#000000). Body description in NTNeuss 12px weight 400, Charcoal (#3d3d3d). 16px interior padding. 6px radius.

### Artist / Brand Bar
**Role:** Source attribution below the now-playing card

Single horizontal row with a 26px circular avatar, brand name in NTNeuss 12px weight 500, URL in lighter gray NTNeuss 11px, and an outbound arrow icon on the right. No background — uses the glass panel's translucency.

### Product Card
**Role:** Shoppable sneaker tile linked to the current broadcast

Horizontal layout: ~64px square sneaker thumbnail on the left with a 1px white border, product name and SKU in NTNeuss 12px on the right, small 'SHOP' tag in top-right corner. Charcoal (#3d3d3d) 1px border, 6px radius, 16px padding. Stacked vertically in a scrollable list.

### Outlined Link Button
**Role:** Text-link with chromatic border indicator (e.g. external artist URL)

No fill. Liberty Navy (#142161) 1px bottom or full border, Charcoal (#3d3d3d) text, NTNeuss 12px. Used for any link that leads off-platform or to a named brand.

### Ghost Icon Button
**Role:** Compact utility action (open link, share, close)

No background, 1px Charcoal border at 6px radius, ~24px square. Icon stroke at 1px in Ink Black. 2–4px internal padding.

## Do's and Don'ts

### Do
- Use 6px radius for every card, button, badge, and input — the 26px value is reserved exclusively for circular avatars
- Apply NTNeuss for all UI text; switch to RecklessNeue-Book only for narrative headlines (Now Playing titles, editorial labels)
- Set tracking to 0.036–0.122em on all NTNeuss text at sizes ≤12px; let tracking fall to normal at 14px and above
- Use Charcoal (#3d3d3d) for default text, borders, and dividers; reserve Ink Black (#000000) for headings, icon strokes, and badge borders where maximum contrast is needed
- Treat Signal Red (#ba2223) as a rationed accent — use it only for LIVE/broadcast status, never for primary CTAs or decoration
- Layer UI as a floating translucent white panel with backdrop blur over full-bleed media — never build opaque page backgrounds that would hide the visual content
- Apply the subtle 1px shadow (rgba(0,0,0,0.08) 1px 1px 6px -1px) to lift cards and the glass panel off the media — no other shadows are permitted

### Don't
- Don't introduce additional accent colors beyond Signal Red and Liberty Navy — the system is 99% monochrome by design
- Don't use RecklessNeue for body copy, labels, or UI chrome — its role is strictly editorial/narrative
- Don't use border-radius values other than 6px (or 26px for avatars) — 4px, 8px, 12px, or pill shapes break the system's compact label aesthetic
- Don't place opaque full-width page backgrounds — the media backdrop must always be visible
- Don't use multi-layer shadows, colored glows, or heavy elevation — the soft 1px shadow is the entire depth language
- Don't use the Liberty Navy (#142161) for fills or backgrounds — it is an outlined-action stroke color only
- Don't use sizes above 14px in NTNeuss or above 21px in RecklessNeue — the system caps at editorial-headline scale, never display or poster sizes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Media Backdrop | `#ffffff` | Page base — the full-bleed fashion film visually overrides this, but the underlying canvas is pure white |
| 1 | Glass Panel | `#ffffff` | Translucent white (~70% opacity) with backdrop blur — the floating right-side container that holds all interactive UI over the video |
| 2 | Card Surface | `#ffffff` | Opaque white tiles (Now Playing, product cards) nested inside the glass panel — full-opacity variants |
| 3 | Bone Highlight | `#f0eeed` | Warm off-white for tags, badges, and subtle selected-state fills inside cards |

## Elevation

- **Glass Panel, Card, Link tile:** `rgba(0, 0, 0, 0.08) 1px 1px 6px -1px`

## Imagery

The visual language IS the imagery — full-bleed fashion editorial video/photography fills the entire viewport behind the UI. Treatment: muted, desaturated, slightly cool-toned, high-fashion, shot in gallery or studio environments. The photography is the hero; the UI is a glass curtain pulled aside to let you interact with it. Density: maximum — the media occupies 100% of the canvas, with the glass panel covering roughly 30–35% of the right side. No product mockups, no illustrations, no abstract graphics. The only icons are utilitarian 1px-stroke glyphs (eye, arrow, external link) in monochrome.

## Layout

Full-bleed media-first layout: the viewport is dominated by a continuous fashion video/photo, with a single translucent glass panel pinned to the right edge (~30–35% width) carrying all interactive content. The panel is vertically centered and tall, holding a compact stack: tab bar → schedule toggle → view counter → Now Playing card → artist bar → product list. No traditional page sections, no hero, no grid. The layout is a constant — scrolling happens inside the product list, never on the page itself. Navigation is minimal: a 3-segment tab bar and two mode toggles.

## Agent Prompt Guide

Quick Color Reference:
- text: #3d3d3d (Charcoal)
- heading/icon: #000000 (Ink Black)
- background/surface: #ffffff (Paper White)
- subtle surface: #f0eeed (Bone)
- border: #3d3d3d (Charcoal)
- accent/status: #ba2223 (Signal Red)
- outlined link border: #142161 (Liberty Navy)
- primary action: #ba2223 (filled action)

Example Component Prompts:
1. Build a Now Playing Card: white opaque surface, 6px radius, 16px padding, subtle 1px shadow rgba(0,0,0,0.08) 1px 1px 6px -1px. Eyebrow label 'NOW PLAYING' in NTNeuss 10px weight 500, uppercase, letter-spacing 0.6px, #3d3d3d. Serif headline in RecklessNeue-Book 21px, line-height 1.5, #000000, normal tracking. Body description in NTNeuss 12px weight 400, line-height 1.5, letter-spacing 0.456px, #3d3d3d.
2. Build a LIVE Badge: filled Signal Red (#ba2223) background, 6px radius, 5px vertical and 7px horizontal padding. White text in NTNeuss 9px weight 500, uppercase, letter-spacing 0.5px.
3. Build a Product Card: horizontal layout, 1px Charcoal (#3d3d3d) border, 6px radius, 16px padding, white fill. Left: 64px square sneaker thumbnail with 1px white border. Right: product name in NTNeuss 12px weight 500 and SKU in NTNeuss 11px weight 400, both #3d3d3d. Top-right corner: small 'SHOP' tag in NTNeuss 9px uppercase on Bone (#f0eeed) fill, 6px radius.
4. Build a Glass Panel: translucent white (~70% opacity) with backdrop blur, 6px radius, subtle 1px shadow. Pinned to the right edge, full viewport height. Contains tab bar, mode toggle, view counter, Now Playing card, artist bar, and scrollable product list stacked vertically with 12–16px gaps.
5. Build a Segmented Tab Bar: three pill segments on one row, 6px radius. Active segment: Smoke (#8d8d8d) fill, white NTNeuss 12px weight 500 text. Inactive: transparent, Charcoal (#3d3d3d) NTNeuss 12px weight 500 text. 2px vertical padding per segment.

## Similar Brands

- **Nowness** — Full-bleed editorial video with a floating translucent side panel carrying metadata and navigation — same media-first, UI-second philosophy
- **Highsnobiety** — Monochrome streetwear/luxury interface with product tiles, single red accent, and ultra-compact tracked-out sans-serif labels
- **SSENSE** — Sparse product cards with generous whitespace, editorial serif headlines, and a single brand-driven accent color
- **Grailed** — Compact sneaker/streetwear marketplace with dense product lists, tight radii, and minimal color used as functional punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-charcoal: #3d3d3d;
  --color-concrete: #9e9e9e;
  --color-ash: #b5b5b5;
  --color-smoke: #8d8d8d;
  --color-paper-white: #ffffff;
  --color-bone: #f0eeed;
  --color-liberty-navy: #142161;
  --color-signal-red: #ba2223;

  /* Typography — Font Families */
  --font-ntneuss: 'NTNeuss', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recklessneue-book: 'RecklessNeue-Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 11px;
  --leading-body-sm: 1.5;
  --text-body: 12px;
  --leading-body: 1.5;
  --text-body-lg: 13px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 14px;
  --leading-heading-sm: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 420px;
  --card-padding: 16px;
  --element-gap: 6px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-3xl: 26px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-badges: 6px;
  --radius-inputs: 6px;
  --radius-avatars: 26px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.08) 1px 1px 6px -1px;

  /* Surfaces */
  --surface-media-backdrop: #ffffff;
  --surface-glass-panel: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-bone-highlight: #f0eeed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-charcoal: #3d3d3d;
  --color-concrete: #9e9e9e;
  --color-ash: #b5b5b5;
  --color-smoke: #8d8d8d;
  --color-paper-white: #ffffff;
  --color-bone: #f0eeed;
  --color-liberty-navy: #142161;
  --color-signal-red: #ba2223;

  /* Typography */
  --font-ntneuss: 'NTNeuss', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recklessneue-book: 'RecklessNeue-Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 11px;
  --leading-body-sm: 1.5;
  --text-body: 12px;
  --leading-body: 1.5;
  --text-body-lg: 13px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 14px;
  --leading-heading-sm: 1.5;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-3xl: 26px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.08) 1px 1px 6px -1px;
}
```
