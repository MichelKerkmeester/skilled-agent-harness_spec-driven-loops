# Index — Style Reference
> editorial broadsheet with yellow highlighter — a stark black-and-white printed publication where #ffd600 marks the only point of emphasis

**Theme:** light

Index reads as an editorial broadsheet translated to the web: near-total achromatic discipline, a single condensed serif for display headlines, and one highlighter-yellow accent used sparingly to mark what matters. Surfaces stay paper-white for most content, but the design flips to full-ink black for announcement bars and feature cards, creating high-contrast plate-like breaks rather than gradients or shadows. Typography does the heavy lifting — light-weight serif at 75–80px with aggressive negative tracking for headlines, a geometric sans for UI, and small uppercase labels with positive tracking as section markers. Components are flat, thin-bordered, and unornamented: links live as outlined text pills, buttons are 6px-radius rectangles, and the only color punctuation is a 16px yellow dot. The world map is rendered as a row of black triangular segments with yellow location pins — graphic, diagrammatic, and never illustrative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Index Ink | `#000000` | `--color-index-ink` | Primary text, announcement bar background, dark feature cards, map silhouettes, hairline borders. The dominant structural color — used where ink would go on a printed page |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, body backgrounds, inverted text on dark surfaces. The base layer of the entire system |
| Highlighter Yellow | `#ffd600` | `--color-highlighter-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |

## Tokens — Typography

### ITCGaramondStdLtCond — Display headlines and editorial body. The condensed light Garamond at 75–80px is the brand's voice — narrow proportions and hairline weight make it feel printed, not digital. The 2.10 line-height appears for tall stacked address blocks. Free substitute: Cormorant Garamond Light (condensed cut if available), or Playfair Display Light as a looser alternative. · `--font-itcgaramondstdltcond`
- **Substitute:** Cormorant Garamond Light, Playfair Display Light
- **Weights:** 300, 400
- **Sizes:** 20, 24, 40, 50, 75px
- **Line height:** 1.00, 1.05, 1.20, 2.10
- **Letter spacing:** -0.022em at 50px, 0.011em at 20px, 0.018em at small sizes
- **Role:** Display headlines and editorial body. The condensed light Garamond at 75–80px is the brand's voice — narrow proportions and hairline weight make it feel printed, not digital. The 2.10 line-height appears for tall stacked address blocks. Free substitute: Cormorant Garamond Light (condensed cut if available), or Playfair Display Light as a looser alternative.

### ABCDiatypeLight — UI text, navigation, labels, buttons, body, input. The workhorse sans — geometric and clean with tight negative tracking at display sizes. Small sizes get slight positive tracking for legibility. Free substitute: Inter, or Söhne if licensed. · `--font-abcdiatypelight`
- **Substitute:** Inter, Söhne
- **Weights:** 300, 400
- **Sizes:** 12, 16, 24, 30, 50, 56, 80px
- **Line height:** 0.90, 1.10, 1.20, 1.25
- **Letter spacing:** -0.037em at 80px, -0.027em at 56px, -0.015em at 30px, -0.009em at 24px, 0.008em at 12–16px
- **Role:** UI text, navigation, labels, buttons, body, input. The workhorse sans — geometric and clean with tight negative tracking at display sizes. Small sizes get slight positive tracking for legibility. Free substitute: Inter, or Söhne if licensed.

### IndexLogotype — The wordmark 'Index' in the top-left navigation. A custom logotype only used at this single placement — not a body font. Do not substitute for headlines. · `--font-indexlogotype`
- **Substitute:** ITCGaramondStdLtCond 50px (closest visual match)
- **Weights:** 300
- **Sizes:** 50px
- **Line height:** 0.90
- **Letter spacing:** normal
- **Role:** The wordmark 'Index' in the top-left navigation. A custom logotype only used at this single placement — not a body font. Do not substitute for headlines.

### Times — Falls back to system Times for unstyled content. Not a brand choice — system fallback only. · `--font-times`
- **Substitute:** serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Falls back to system Times for unstyled content. Not a brand choice — system fallback only.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.18px | `--text-caption` |
| body-sm | 16px | 1.2 | 0.128px | `--text-body-sm` |
| body | 20px | 1.2 | 0.22px | `--text-body` |
| subheading | 24px | 1.2 | -0.216px | `--text-subheading` |
| heading-sm | 30px | 1.2 | -0.45px | `--text-heading-sm` |
| heading | 50px | 1 | -1.1px | `--text-heading` |
| heading-lg | 56px | 0.9 | -1.512px | `--text-heading-lg` |
| display | 80px | 0.9 | -2.96px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 16px |
| icons | 6px |
| links | 6px |
| buttons | 6px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Announcement Bar
**Role:** Site-wide notification strip

Full-width black (#000000) bar at the very top of every page. White text, ABCDiatype 16px, 1px top/bottom padding, left-aligned message. Contains a 'MORE' outlined text link button (1px white border, 6px radius, white text) and a close '×' icon right-aligned. No shadow, no rounding on the bar itself — flush with viewport edges.

### Top Navigation
**Role:** Persistent site header

Minimal white bar with three elements: 'Index' wordmark in IndexLogotype 50px at the left, a circular menu button (black border, 6px radius, three dots inside) beside it, and a cart counter (black circle with white number '0', ~24px) at the far right. Transparent/white background, no border, no shadow. Sits directly below the announcement bar.

### Outlined Text Link
**Role:** In-text navigation and tag link — the signature interaction

The most repeated component on the site. 1px solid #000000 border, transparent background, ABCDiatype uppercase text at 12–16px, 4–8px vertical padding and 6–8px horizontal padding, 6px border-radius. Examples: PROGRAMMING, CHINATOWN, GREENPOINT, NODES, ABOUT, RESOURCES, OUR DISCORD, LEARN MORE. On dark surfaces, the border and text invert to #ffffff. No fill state — always outlined.

### Filled Dark Button
**Role:** Primary compact action

Solid #000000 background, white ABCDiatype 12–16px uppercase text, 6px border-radius, 8px vertical and 20px horizontal padding. Used sparingly — the 'MORE' button in the announcement bar is the clearest example. Inverts to white-on-black only; never a chromatic fill.

### Editorial Display Headline
**Role:** Hero and section titles

ITCGaramondStdLtCond at 50–80px, weight 300, with aggressive negative letter-spacing (-0.022em to -0.037em) and tight line-height (0.90–1.00). Black on white, never reversed color. The condensed light weight + negative tracking combination is the most distinctive visual signature of the brand — it reads as broadsheet print, not web.

### Section Label
**Role:** Small uppercase category marker

ABCDiatype uppercase at 12–16px, weight 400, with positive letter-spacing (0.008–0.015em), black text. Used to label sections like 'ASYNCHRONOUS COURSES'. Sits above or beside content as a typographic marker, not a chip or pill — no border, no background.

### Dark Feature Card
**Role:** Promoted content block with full-bleed image

Full-width #000000 background, 16px border-radius. Two-column layout: left half is a tightly cropped photographic image (no rounding, bleeds to card edge), right half holds white ABCDiatype text and a white-bordered outlined text link button at the bottom. The 'Learn at your own pace' / asynchronous courses card is the reference. High contrast plate — appears as a dark band breaking up the white page.

### World Map Visualization
**Role:** Location directory graphic

A row of black triangular/pyramidal segments tiled horizontally to form a flattened world map silhouette. No fill detail, no coastlines — just the triangular lattice. Yellow (#ffd600) circular pins (~12–16px diameter) mark specific locations. Each pin anchors a stacked address block below in ABCDiatype 12–16px black. The map has no border or container — it bleeds full-width.

### Map Location Pin
**Role:** Map annotation marker

Solid #ffd600 circle, 12–16px diameter, no border, no shadow. Sits on the map at each physical location. The only yellow element in the entire system besides highlights — its visual weight is amplified by the total absence of other color.

### Location Info Block
**Role:** Address caption under map pin

Stacked three-line block: location name (ABCDiatype 16px bold/400), street address (ABCDiatype 12px), city/state/zip (ABCDiatype 12px). All #000000, left-aligned, 4–8px line spacing. Appears in a horizontal row beneath the map, one per pin.

### Menu Trigger Button
**Role:** Hamburger/menu toggle in nav

Circular or pill-shaped button with 1px black border, 6px radius, three horizontal dots inside (ellipsis indicator). White background, black icon. Tapping opens the navigation menu.

### Cart Counter Badge
**Role:** Notification dot in nav

Solid #000000 circle (~24px diameter) with white ABCDiatype number inside, positioned at the far right of the navigation. Functions as a cart or notification indicator. No border, no shadow.

## Do's and Don'ts

### Do
- Set display headlines in ITCGaramondStdLtCond at 50–80px, weight 300, with letter-spacing between -0.022em and -0.037em — this is the brand's most distinctive choice
- Use ABCDiatype (or Inter substitute) for all UI, navigation, body, and labels at 12–30px
- Use the outlined text link (1px border, 6px radius, transparent fill) as the default interactive element — reserve the filled black button for compact primary actions only
- Reserve #ffd600 exclusively for map pins and single-point highlights — never use it for backgrounds, text, or buttons
- Break long white pages with full-width black-surface bands (announcement bar, feature cards) to create high-contrast plate transitions
- Set letter-spacing to slightly positive values (0.008–0.015em) on text 16px and below for legibility, and to negative values above 24px for editorial density
- Keep all borders at 1px and all component radii at 6px (buttons, links, nav) or 16px (cards) — the system has only two corner-radius values

### Don't
- Don't introduce a third font family — the system runs on exactly two: ITCGaramondStdLtCond for display, ABCDiatype for everything else
- Don't use box-shadows for elevation — the system is deliberately shadowless; rely on color inversion and hairline borders
- Don't use #ffd600 for buttons, text, or large fills — it is a marker color, not a surface color
- Don't set display headlines at weight 400 or above in the serif — the hairline 300 weight is the signature; heavier weights break the broadsheet feel
- Don't use border-radius values other than 6px (small elements) or 16px (cards) — rounded corners should be subtle and uniform
- Don't add gradients — the system is strictly flat; color is solid, never blended
- Don't use chromatic borders for outlined buttons on dark surfaces — always invert to #ffffff border and text, not a color tint

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas and all light content sections |
| 1 | Ink Plate | `#000000` | Dark surface for announcement bars, feature cards, and dramatic breaks |

## Elevation

The system uses zero box-shadows. Elevation is achieved entirely through color inversion — a black surface on a white canvas reads as 'raised' or 'emphasized' without needing shadow. This keeps the aesthetic flat and print-like. The only spatial separation comes from hairline 1px borders and generous whitespace.

## Imagery

Photography appears only in the dark feature card as a full-bleed left-half image — a moody, dimly lit still life (open book among white lilies on dark ground) that matches the card's black surface. The primary visual element is the diagrammatic world map: a row of black triangular segments forming a simplified world silhouette, diagrammatic rather than illustrative, with yellow circular pins. No decorative gradients, no abstract graphics, no 3D renders. Icons are minimal — a three-dot menu glyph and a close '×' — rendered as simple line marks. The overall visual language is editorial broadsheet: high-contrast photography used sparingly, diagrammatic information graphics, and type as the dominant visual element.

## Layout

The page is full-bleed horizontally — the world map, announcement bar, and feature cards all span the full viewport width. Text content sits in a centered max-width container of ~1200px with generous left/right margins. The vertical rhythm alternates between white paper sections and black ink-plate sections, creating dramatic contrast breaks. The hero is a massive left-aligned serif headline that fills most of the first viewport. The map and location blocks form a full-width horizontal band. The dark feature card breaks the page with a full-bleed two-column image+text plate. Navigation is a minimal sticky-feeling white bar at the top with a dark announcement bar above it. The overall pattern reads top-to-bottom: announcement bar → nav → editorial hero headline → world map band → location directory → editorial headline + body text + outlined links → dark feature card → continuation content. No sidebar, no multi-column dashboard layout — this is a long-scroll editorial page, not an application.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px solid)
- accent: #ffd600 (map pins only)
- dark surface: #000000 (announcement bars, feature cards)
- primary action: #000000 (filled action)

**Example Component Prompts**

1. **Editorial hero headline**: Set text in ITCGaramondStdLtCond at 80px, weight 300, line-height 0.90, letter-spacing -2.96px, color #000000 on a #ffffff canvas. Left-align. Let the text fill 80% of the viewport width.

2. **Outlined text link (the signature interaction)**: Create a link with 1px solid #000000 border, 6px border-radius, transparent background, ABCDiatype uppercase text at 14px, padding 4px 8px. Text color #000000. On a #000000 surface, invert both border and text to #ffffff.

3. **Announcement bar**: Full-width #000000 bar, 1px top and bottom padding, white ABCDiatype 16px message text left-aligned, an outlined 'MORE' link (1px white border, 6px radius, white text, 4px 8px padding) beside it, and a '×' close icon right-aligned.

4. **World map location pin**: A solid #ffd600 circle, 14px diameter, no border, positioned over a black triangular world-map lattice. Below each pin, stack three lines of ABCDiatype at 12–16px in #000000: location name, street, city.

5. **Dark feature card**: Full-width #000000 surface, 16px border-radius, two-column grid — left half is a full-bleed photographic image bleeding to the card edge, right half contains a white ITCGaramondStdLtCond headline at 40px, white ABCDiatype body at 20px, and a white-bordered outlined text link at the bottom-left of the text column.

## Similar Brands

- **Cooper Hewitt** — Same broadsheet editorial aesthetic — large condensed serif display headlines, achromatic palette, flat surfaces, and minimal UI ornamentation
- **Cabinet Magazine** — Same printed-publication typographic approach with tight-tracked serif headlines and a single restrained color accent on an otherwise monochrome page
- **Printed Matter** — Similar near-total-black-and-white palette with a single high-saturation yellow accent used for specific functional marks
- **Rhizome** — Cultural/arts organization with editorial web typography, minimal nav, and a diagrammatic visual approach to information
- **The New York Review of Books** — Same light-mode editorial layout with a condensed serif carrying the visual identity and hairline sans for secondary text

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-index-ink: #000000;
  --color-paper-white: #ffffff;
  --color-highlighter-yellow: #ffd600;

  /* Typography — Font Families */
  --font-itcgaramondstdltcond: 'ITCGaramondStdLtCond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcdiatypelight: 'ABCDiatypeLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-indexlogotype: 'IndexLogotype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.18px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.128px;
  --text-body: 20px;
  --leading-body: 1.2;
  --tracking-body: 0.22px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.216px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.45px;
  --text-heading: 50px;
  --leading-heading: 1;
  --tracking-heading: -1.1px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.512px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -2.96px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 16px;
  --radius-icons: 6px;
  --radius-links: 6px;
  --radius-buttons: 6px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink-plate: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-index-ink: #000000;
  --color-paper-white: #ffffff;
  --color-highlighter-yellow: #ffd600;

  /* Typography */
  --font-itcgaramondstdltcond: 'ITCGaramondStdLtCond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcdiatypelight: 'ABCDiatypeLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-indexlogotype: 'IndexLogotype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.18px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.128px;
  --text-body: 20px;
  --leading-body: 1.2;
  --tracking-body: 0.22px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.216px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.45px;
  --text-heading: 50px;
  --leading-heading: 1;
  --tracking-heading: -1.1px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.512px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -2.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 100px;
}
```
