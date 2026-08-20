# FORA — Style Reference
> Swiss editorial mosaic on white. A grid of monumental color tiles and airy geometric type, where each panel of terracotta or lilac functions as a full-bleed typographic stage.

**Theme:** light

FORA presents as a Swiss editorial mosaic: a strict white grid broken by full-bleed panels of terracotta and lilac, each tile a self-contained statement. Typography carries the brand's authority — Theinhardt at generous sizes with consistently positive letter-spacing, giving headlines room to breathe and creating an anti-Silicon-Valley attitude where space signals confidence. Black is absolute and unsoftened; chromatic color never decorates, it claims entire zones. The interface feels like a printed design annual translated to web — bold rules, quiet type, and the conviction that two colors plus white can carry an entire brand system.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | All text, headings, icons, nav links, dividers, and borders. Unsoftened true black anchors every chromatic panel |
| Paper | `#ffffff` | `--color-paper` | Page canvas, default card surface, and the negative space that lets chromatic panels breathe. Never tinted |
| Terracotta | `#a9553c` | `--color-terracotta` | Full-bleed section panels and hero zones. Warm oxidized red-brown against pure black and white — evokes raw clay and printed editorial covers |
| Lilac Veil | `#ddbdea` | `--color-lilac-veil` | Full-bleed section panels, content cards, and soft surface tint. Muted chalky pink that cools the terracotta into a balanced two-color rhythm |

## Tokens — Typography

### Theinhardt — Sole typeface across all UI: nav, body, headings, buttons, labels. Positive letter-spacing (0.01em→0.024em) that grows with size is the anti-trend signature — tracking opens up rather than tightens, producing a Swiss neo-grotesque with editorial breathing room. The 700 weight appears only for micro-emphasis (tag labels), keeping the system light and even. · `--font-theinhardt`
- **Substitute:** Neue Haas Grotesk, Inter, Söhne
- **Weights:** 400, 700
- **Sizes:** 15px, 18px, 23px, 35px
- **Line height:** 1.17–1.53
- **Letter spacing:** 0.01em at 15px → 0.024em at 35px (tracking opens with size)
- **Role:** Sole typeface across all UI: nav, body, headings, buttons, labels. Positive letter-spacing (0.01em→0.024em) that grows with size is the anti-trend signature — tracking opens up rather than tightens, producing a Swiss neo-grotesque with editorial breathing room. The 700 weight appears only for micro-emphasis (tag labels), keeping the system light and even.

### Theinhardt Medium — Theinhardt Medium — detected in extracted data but not described by AI · `--font-theinhardt-medium`
- **Weights:** 700
- **Sizes:** 15px
- **Line height:** 1.33
- **Letter spacing:** 0.024
- **Role:** Theinhardt Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1.33 | 0.15px | `--text-caption` |
| body | 18px | 1.3 | 0.29px | `--text-body` |
| subheading | 23px | 1.17 | 0.46px | `--text-subheading` |
| display | 35px | 1.17 | 0.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 50 | 50px | `--spacing-50` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| buttons | 5px |

### Layout

- **Card padding:** 25px
- **Element gap:** 20px

## Components

### Full-Bleed Color Panel
**Role:** Section container that claims a grid cell

The signature building block. A grid tile filled edge-to-edge with Terracotta (#a9553c) or Lilac Veil (#ddbdea), containing a headline at 35px/400 and a short descriptor. Padding 25px on all sides, 0px radius, no border, no shadow. The panel IS the layout — no cards inside cards.

### Panel Link with Arrow
**Role:** Inline text link inside a colored panel

15px weight 400, color #000000, followed by a thin arrow glyph (→). Letter-spacing 0.024em. Sits at the bottom of full-bleed panels. No underline, no background, no button shape — the colored panel itself implies affordance.

### Pill Tag
**Role:** Category label overlay

White background (#ffffff), 9999px radius, 5px vertical padding, 10px horizontal padding. 15px weight 400, #000000 text. Used to mark content blocks like 'Meet our Team' or 'Our Projects' as floating labels in the top-left of a grid cell.

### Team Portrait Cell
**Role:** Photo showcase in grid

Full-bleed photographic cell within the grid. No border, no radius, no caption overlay — the portrait fills the tile edge-to-edge. Captions appear in the white footer band below, centered, 15px weight 400.

### Newsfeed Card
**Role:** Social content card

Lilac Veil (#ddbdea) background, 0px radius, 25px padding. Contains a small square thumbnail (no radius), a 18px body line, and a 'Mehr lesen' text link. The card sits within a grid cell — it does not float or shadow.

### Ghost Button
**Role:** Secondary action inside colored panels

No fill, no border. Simply 15px weight 400 black text with an arrow, e.g. 'Erfahren Sie mehr →'. Letter-spacing 0.024em. The colored panel provides the visual weight; the button is pure text.

### Primary Text Button
**Role:** The only true button — minimal

5px radius, transparent background, no border. 15px weight 400, #000000 text, letter-spacing 0.024em. Color is never applied to button fill. Rounding is subtle — sharp enough to feel editorial, not soft enough to feel app-like.

### Footer Navigation Bar
**Role:** Site-wide bottom nav

White (#ffffff) background, 0px radius, single horizontal row of 15px weight 400 links separated by generous whitespace. Items: 'About', 'Team', 'Work', 'Contact' (and social handle). No background, no border-top, no visual weight — it dissolves into the page.

### Grid Tile Divider
**Role:** Structural separator between panels

The white canvas itself acts as a 0px divider between colored panels. No hairline rules, no shadows. Adjacent tiles meet with 0px gap; the white paper between them is the only gutter.

### Display Headline
**Role:** Hero and panel headlines

35px Theinhardt weight 400, #000000, line-height 1.17, letter-spacing 0.024em (≈0.84px). Often wraps to two lines and fills the panel with confident, even rhythm. No mixing of weights — always 400.

### Location Marker
**Role:** Geographic descriptor in hero panel

Large display text in a white-on-terracotta or white-on-lilac panel, e.g. 'Wien & Berlin'. Same 35px/400 spec as headlines. Functions as both content and decorative typography.

## Do's and Don'ts

### Do
- Use Terracotta (#a9553c) and Lilac Veil (#ddbdea) only as full-bleed panel fills — never as button backgrounds, never as text colors, never as borders.
- Let letter-spacing grow with size: 0.01em at 15px, 0.024em at 35px. Never set negative tracking on headlines.
- Keep all type at weight 400 except the rare 700 micro-label. Weight contrast is a resource — spend it sparingly.
- Build the page as a strict grid of edge-to-edge tiles. White canvas between tiles is the gutter — no margins, no shadows, no hairlines.
- Use 0px border-radius on all panels and cards. Reserve 5px for buttons and 9999px only for pill tags.
- Pad panel interiors with 25px on all sides. Headlines sit 25px from the panel edge — flush, never floating.
- Pair every colored panel with a single short text element (headline + optional inline arrow link). Never stack multiple components inside a panel.

### Don't
- Don't soften black to near-black or add a tint — #000000 is absolute and the system depends on that contrast.
- Don't introduce a third chromatic color, a gradient, or a neutral mid-gray. The two-color discipline is the brand.
- Don't add shadows, glows, or elevation to cards. The grid is flat — surfaces sit on the page, not above it.
- Don't use negative letter-spacing on any size. The positive tracking is a signature, not a mistake to correct.
- Don't round card or panel corners beyond 0px. The sharp 90° edges are what make it feel like editorial print.
- Don't mix multiple typefaces or weight the headlines at 600-700. Theinhardt 400 everywhere, plus rare 700 for micro-tags.
- Don't create centered, max-width containers. The grid is full-bleed; content fills its tile completely.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas and base background between colored grid panels |
| 1 | Lilac Veil | `#ddbdea` | Chalky pink panel surface for content sections and social feeds |
| 2 | Terracotta | `#a9553c` | Bold full-bleed panel for hero statements and brand moments |

## Elevation

No shadows, no blur, no z-axis. All elements exist on a single flat plane. Hierarchy is established by color (terracotta > lilac > white), by type scale (35 > 23 > 18 > 15), and by spatial division — never by elevation. The page reads like a printed spread, not an app interface.

## Imagery

Photography is present but treated as raw material, not decoration. Portraits are tightly cropped, edge-to-edge in their grid tiles, with no captions, borders, or rounding — the face IS the panel. Product/glassware photography is staged in warm, natural light against muted backgrounds, with objects arranged as if for an editorial still life. No lifestyle imagery, no stock photography, no illustrations. The visual system treats every photograph as a full-bleed grid cell equal in weight to a colored typographic panel. Iconography is minimal: simple arrow glyphs (→) and a small bullet (•) for label tags. No filled icon set, no multicolor icons.

## Layout

The page is a strict edge-to-edge grid of full-bleed tiles — a mosaic, not a stacked layout. No max-width container, no centered alignment, no gutters between panels. The grid divides the viewport into 3-4 columns where each cell is either a white content band, a terracotta statement panel, a lilac content panel, or a photographic cell. There is no traditional hero — the first row of tiles IS the hero, with the brand mark 'FO RA' in oversized display type occupying one cell and a terracotta panel with tagline occupying the next. Below, rows alternate: team portraits beside lilac newsfeeds beside white nav bands. The bottom row is a single white footer band spanning full width. Vertical rhythm is created by the tile heights themselves — each row is 280-360px tall, and the eye scans horizontally row by row like reading a print magazine spread.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000
- accent: #ddbdea (Lilac Veil)
- brand panel: #a9553c (Terracotta)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. Build a full-bleed terracotta panel: background #a9553c, padding 25px, no radius, no border, no shadow. Inside, place a 35px Theinhardt 400 headline in #000000 with letter-spacing 0.024em, followed 20px below by a 15px ghost text link reading 'Erfahren Sie mehr →'.
2. Build a newsfeed card: background #ddbdea, padding 25px, 0px radius. Left-aligned 80×80px square thumbnail (no radius), 20px gap, then a 18px body line in #000000, letter-spacing 0.016em, followed by a 15px underlined text link 'Mehr lesen'.
3. Build a pill tag overlay: 9999px radius, white #ffffff background, 5px vertical padding, 10px horizontal padding, 15px Theinhardt 400 in #000000 with letter-spacing 0.024em. Position absolute top-left of a grid cell with 10px margin.
4. Build a footer nav bar: full-width #ffffff background, 0px radius, single row of inline links in 15px Theinhardt 400 #000000 separated by 40px gap. Items: About, Team, Work, Contact. No dividers, no background bar.
5. Build a display headline block: 35px Theinhardt 400 in #000000, line-height 1.17, letter-spacing 0.024em. Text wraps naturally to fill 2-3 lines. No background, no border, no decoration — pure typographic statement on the white canvas.

## The Two-Color Discipline

Terracotta and Lilac Veil are not accents — they are co-equal surfaces that divide the page into zones. Use them as a pair: when one appears, the other should appear nearby in the same row or adjacent row. Never use terracotta alone on a page; never use lilac alone. The system breathes through alternation: warm → cool → warm → cool → white footer.

## Tracking Philosophy

Letter-spacing scales linearly with type size: 0.01em at 15px body, 0.016em at 18px, 0.02em at 23px, 0.024em at 35px. This positive tracking at large sizes is the anti-SaaS signature — most modern sites tighten headlines with negative tracking to feel 'modern', but FORA opens them up to feel like Swiss editorial print. An AI agent must resist the urge to 'fix' this with negative values.

## Similar Brands

- **Werkplaats Typografie** — Same Swiss editorial grid approach with monumental sans-serif type and absolute restraint in color
- **Pentagram** — Bold typographic statements, full-bleed color blocks, and grid-based mosaic homepages that read like print spreads
- **Studio Dumbar** — Editorial typography discipline with strong color blocks and zero decorative chrome
- **Manual (manualcreative.com)** — Agency portfolios that use strict grids of color-tile panels with airy geometric type
- **Bureau Cool** — Minimalist studio site with white canvas, warm muted color panels, and confident single-weight typography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-terracotta: #a9553c;
  --color-lilac-veil: #ddbdea;

  /* Typography — Font Families */
  --font-theinhardt: 'Theinhardt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-theinhardt-medium: 'Theinhardt Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.33;
  --tracking-caption: 0.15px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: 0.29px;
  --text-subheading: 23px;
  --leading-subheading: 1.17;
  --tracking-subheading: 0.46px;
  --text-display: 35px;
  --leading-display: 1.17;
  --tracking-display: 0.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-50: 50px;

  /* Layout */
  --card-padding: 25px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-buttons: 5px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-lilac-veil: #ddbdea;
  --surface-terracotta: #a9553c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-terracotta: #a9553c;
  --color-lilac-veil: #ddbdea;

  /* Typography */
  --font-theinhardt: 'Theinhardt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-theinhardt-medium: 'Theinhardt Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.33;
  --tracking-caption: 0.15px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: 0.29px;
  --text-subheading: 23px;
  --leading-subheading: 1.17;
  --tracking-subheading: 0.46px;
  --text-display: 35px;
  --leading-display: 1.17;
  --tracking-display: 0.84px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-50: 50px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-full: 9999px;
}
```
