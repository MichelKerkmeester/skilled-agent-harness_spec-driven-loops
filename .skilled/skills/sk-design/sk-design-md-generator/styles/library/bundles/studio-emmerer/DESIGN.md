# Studio Emmerer — Style Reference
> Typeset on drafting paper

**Theme:** light

Studio Emmerer presents itself as typed content first, photography second — a two-tone document where NHaasGrotesk weight 400 carries every word at 16px or 30px, with tight 0.90–1.16 line-heights and negative tracking at every size. The palette is strictly black, white, and a single mid-gray (#999999) reserved for table column headers; there are no fills, no shadows, no rounded corners, no decorative graphics of any kind. A flat project table dominates the page — 1px black row dividers, 12px vertical padding, edge to edge with no card containers wrapping the rows. The right-arrow glyph (→) is the only interactive ornament, prefixing inline underlined links for both site navigation and individual project entries. Everything else is whitespace and type: the layout reads like a printed catalogue spread, not a software interface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Black | `#000000` | `--color-pure-black` | Body text, inline links, project titles, table row dividers, the arrow (→) glyph |
| Drafting White | `#ffffff` | `--color-drafting-white` | Page background, surface under all content — no tint, no gradient |
| Index Gray | `#999999` | `--color-index-gray` | Table column headers (PROJECT, TYPE, LOCATION, YEAR), supporting metadata, secondary borders |

## Tokens — Typography

### NHaasGrotesk — Sole typeface for every UI element — headlines, body, links, table cells, column headers, navigation. Single weight 400 across the entire system, with negative letter-spacing tightening at every size. The Neue Haas Grotesk DNA (geometric neutrality, grotesque proportions) is what carries the architectural-document feel; substitute Helvetica Neue or Inter as a free fallback. · `--font-nhaasgrotesk`
- **Substitute:** Helvetica Neue, Inter, Neue Haas Grotesk Text Pro
- **Weights:** 400
- **Sizes:** 15px, 16px, 20px, 30px
- **Line height:** 0.90 (display), 1.16 (body, caption, subheading)
- **Letter spacing:** -0.0110em at 30px, -0.0100em at 20px, -0.0080em at 16px, -0.0050em at 15px
- **Role:** Sole typeface for every UI element — headlines, body, links, table cells, column headers, navigation. Single weight 400 across the entire system, with negative letter-spacing tightening at every size. The Neue Haas Grotesk DNA (geometric neutrality, grotesque proportions) is what carries the architectural-document feel; substitute Helvetica Neue or Inter as a free fallback.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 17.4 | -0.08px | `--text-caption` |
| subheading | 20px | 23.2 | -0.2px | `--text-subheading` |
| display | 30px | 27 | -0.33px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 32px
- **Element gap:** 5px

## Components

### Project Table Row
**Role:** The primary repeating element on the page — each project is one row in a four-column table.

Flat table cell with no fill, no padding-top, 12px padding-bottom, 4px padding-left. 1px solid #000000 bottom border separates each row. Project name (left column) in 16px NHaasGrotesk weight 400 #000000, left-aligned with 4px indent. Type, Location, and Year columns are right-aligned in the same 16px #000000. No hover state, no zebra striping, no rounded corners.

### Table Column Header
**Role:** Labels the four columns above the project list.

Small caps (or CSS text-transform: uppercase with default tracking) set in 15px NHaasGrotesk weight 400 #999999. Same 12px bottom padding as data rows. Words: PROJECT, TYPE, LOCATION, YEAR. The lighter gray distinguishes the header label from the data row beneath without changing weight or size drastically.

### Inline Navigation Link
**Role:** Site-level navigation — about, contact, imprint, read more.

Inline text with a 1px #000000 underline. No pill shape, no fill, no border-radius. Often prefixed with a → arrow glyph and separated by 30px right margin. Wraps inline with the surrounding paragraph text. Hover state: no change — color and weight stay constant.

### Arrow Glyph (→)
**Role:** The only icon in the entire system. Marks navigability.

U+2192 RIGHTWARDS ARROW rendered in NHaasGrotesk at the same size and color as the adjacent text. Used to prefix every link (→ about, → contact, → Open Project, → read more) and as left/right nav controls (← →) beside the news count. Never replaced by a graphic icon or SVG.

### Hero Photograph
**Role:** Large editorial image occupying the right half of the viewport on first load.

Full-bleed within its column, no border, no border-radius, no padding, no caption overlaid. Aspect ratio is determined by the viewport — it is simply the right half of the screen at 100% height. Subject is always architectural site documentation at high contrast (stone, concrete, interior, tunnel, building). No filter, no duotone, no gradient overlay.

### Intro Paragraph
**Role:** Landing text describing the practice, anchored in the upper-left column.

30px NHaasGrotesk weight 400 #000000, line-height 0.90, letter-spacing -0.33px. Wraps at approximately 45% of viewport width to leave room for the hero image. The display scale is used here rather than the body scale — there is no separate headline element.

### News/Featured Project Caption
**Role:** Metadata strip directly under the hero image.

Three-part inline row: 'News 2/19' in 15px #999999 on the left, ← → nav arrows in 16px #000000 centered, project title ('Castle museum Linz - New underground city access') and '→ Open Project' link in 16px #000000 on the right. No box, no border, no background.

## Do's and Don'ts

### Do
- Use NHaasGrotesk weight 400 for every piece of text on the page — no exceptions, no weight variations.
- Set display text to 30px with line-height 0.90 and letter-spacing -0.33px; set body to 16px / 1.16 / -0.13px.
- Use 1px solid #000000 as the only border — for table row dividers, link underlines, and any structural separator.
- Prefix every interactive link with the → arrow glyph in the same size and color as the link text.
- Use #999999 for table column headers and supporting metadata only; keep all primary text and links at #000000.
- Let whitespace define hierarchy — use 12px row padding and 32px section gaps rather than cards or fills.
- Keep photography edge-to-edge with no border-radius, no overlay, and no caption box.

### Don't
- Never introduce a chromatic color — the palette is strictly black, white, and #999999.
- Never use font-weight above 400 — bold or semibold would shatter the single-weight voice of the system.
- Never add box-shadow, drop-shadow, or any z-axis elevation.
- Never apply border-radius — all corners stay at 0px.
- Never wrap content in filled cards, panels, or containers — rows sit directly on the page surface.
- Never introduce an icon set beyond the → arrow; no SVGs, no pictograms, no button shapes.
- Never change link color on hover — links stay #000000 with the same underline weight to preserve the printed-page feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Drafting White | `#ffffff` | Sole surface — page background, table background, everything. No card, panel, or elevated layer exists. |

## Elevation

Elevation is intentionally absent. Surfaces are flat to the page. Hierarchy comes from type size, weight (which never changes from 400), and 1px solid #000000 hairlines — never from shadow or z-axis. The design treats the browser viewport as a sheet of paper, not a stack of cards.

## Imagery

Photography only, and exclusively architectural site documentation — stone tunnels, concrete interiors, built environments in raw daylight or shadow. Full-bleed within their column, zero border-radius, zero padding, no caption frame. The subject is the building itself, never people, never lifestyle, never staged. High contrast, documentary sharpness, no color treatment, no duotone, no filter. There are no illustrations, no decorative graphics, no abstract shapes, and no product renders. The arrow glyph is the only non-photographic visual element in the system.

## Layout

Single-page composition with no scrollable sub-pages in the visible chrome. The viewport is split roughly 45/55 on first load: a 30px intro paragraph and three inline arrow-links occupy the left column; a full-height hero photograph occupies the right. Below the fold, a full-width four-column table (PROJECT / TYPE / LOCATION / YEAR) extends edge to edge, with 12px row padding and 1px black dividers. The table is the entire body of the page — there is no card grid, no feature sections, no pricing rows, no testimonials. Navigation is three inline links, not a top bar or sidebar. The whole layout reads as one continuous document, not a stack of distinct page sections.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #000000
- background: #ffffff
- border / divider: #000000
- secondary text (column headers, metadata): #999999
- primary action: no distinct CTA color

EXAMPLE COMPONENT PROMPTS
1. Project table row — White background, 1px solid #000000 bottom border, 12px padding-bottom, 4px padding-left. Project name in 16px NHaasGrotesk weight 400 #000000, left-aligned. Type, Location, Year columns in the same 16px #000000, right-aligned. No fill, no hover state, no border-radius.

2. Inline navigation link — Render the text '→ about' where → is U+2192 in 16px NHaasGrotesk weight 400 #000000 with a 1px #000000 underline spanning the full text including the arrow. 30px margin-right between adjacent links. No color change on hover.

3. Intro paragraph — 30px NHaasGrotesk weight 400 #000000, line-height 0.90, letter-spacing -0.33px. Wraps at ~45% viewport width. No sub-headline above it, no button beneath — the paragraph itself is the headline.

4. Table column header — 15px NHaasGrotesk weight 400 #999999, uppercase, 12px padding-bottom, 1px solid #000000 bottom border separating header band from data rows. No background fill, no bold weight.

5. Hero photograph — Full-bleed within the right 55% of the viewport, no border, no border-radius, no padding, no overlay text. Architectural documentary photograph at high contrast. An adjacent caption strip below shows 'News 2/19' in 15px #999999 on the left, ← → arrows in 16px #000000 centered, and the project title with '→ Open Project' inline link in 16px #000000 on the right.

## Similar Brands

- **Sou Fujimoto (sou-fujimoto.net)** — Same single-weight grotesque typography on white, photography placed without frames or filters, project list rendered as a flat table rather than a card grid.
- **John Pawson (johnpawson.com)** — Identical architectural-document restraint — no shadows, no rounded corners, no decorative graphics, content delivered as type and unframed photography.
- **Pinboard (pinboard.in)** — Same two-tone text-on-white vocabulary with thin row dividers and inline arrow-prefixed links; treats the browser viewport as a printed index rather than a software surface.
- **OMA / AMO (oma.eu)** — Project listings rendered as flat tables with the same hairline-divider rhythm, relying on a single grotesque family at one weight to carry the entire hierarchy.
- **Bureau Borsche (bueroborsche.com)** — Catalogue-style project index set tight in a single Helvetica-family weight, black on white, with the same discipline of avoiding fills, shadows, and decorative iconography.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-black: #000000;
  --color-drafting-white: #ffffff;
  --color-index-gray: #999999;

  /* Typography — Font Families */
  --font-nhaasgrotesk: 'NHaasGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 17.4;
  --tracking-caption: -0.08px;
  --text-subheading: 20px;
  --leading-subheading: 23.2;
  --tracking-subheading: -0.2px;
  --text-display: 30px;
  --leading-display: 27;
  --tracking-display: -0.33px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 32px;
  --element-gap: 5px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-drafting-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-black: #000000;
  --color-drafting-white: #ffffff;
  --color-index-gray: #999999;

  /* Typography */
  --font-nhaasgrotesk: 'NHaasGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 17.4;
  --tracking-caption: -0.08px;
  --text-subheading: 20px;
  --leading-subheading: 23.2;
  --tracking-subheading: -0.2px;
  --text-display: 30px;
  --leading-display: 27;
  --tracking-display: -0.33px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-30: 30px;
}
```
