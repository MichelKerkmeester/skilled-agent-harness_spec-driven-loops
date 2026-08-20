# 19–86 — Style Reference
> Monumental numerals on white ledger

**Theme:** light

19–86 is a typographic ledger — a French design studio that compresses its entire visual identity into a single hairline weight of one custom typeface and the barest possible palette: black on white. The brand number itself, set at 490px, lives behind the content as a permanent architectural watermark, never louder than the project list it organizes. Information is presented as a flat, left-aligned index — date, title, typology, location, surface, status — separated by 1px rules, never by cards, shadows, or color. The 24px body and the 490px display are the same font, the same whisper weight; the difference is amplitude, not voice. White space is the primary design tool: 24px between rows, generous side margins, and the watermark breathing through the gaps. Every screen should feel like a page from a Swiss architecture manual — spare, certain, unsentimental, and confident that less is enough.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Dark supporting neutral for text, icons, and strong contrast |
| Paper | `#ffffff` | `--color-paper` | Page canvas and every surface; the design's only second value, existing solely to make Ink legible |

## Tokens — Typography

### store_norske_ja_light — The single typeface of the entire system — a custom hairline display used both for the 24px catalog body and the 490px brand mark. Weight 400 on this font already renders as an extreme thin; the same whisper set at 24px feels like a table of contents, set at 490px it becomes a building facade. Tracking is tightened to -0.0200em at every size — letters should feel pressed together, not floating apart. Kerning is explicitly enabled ("kern") to keep the negative tracking from creating collisions at the display scale. · `--font-storenorskejalight`
- **Substitute:** Inter (weight 200 or 300), or Manrope ExtraLight for a slightly more characterful alternative
- **Weights:** 400
- **Sizes:** 24px, 490px
- **Line height:** 1.20 (body), 1.00 (display)
- **Letter spacing:** -0.0200em at all sizes (≈ -0.48px at 24px, ≈ -9.8px at 490px)
- **OpenType features:** `"kern"`
- **Role:** The single typeface of the entire system — a custom hairline display used both for the 24px catalog body and the 490px brand mark. Weight 400 on this font already renders as an extreme thin; the same whisper set at 24px feels like a table of contents, set at 490px it becomes a building facade. Tracking is tightened to -0.0200em at every size — letters should feel pressed together, not floating apart. Kerning is explicitly enabled ("kern") to keep the negative tracking from creating collisions at the display scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 24px | 28.8 | -0.48px | `--text-body` |
| display | 490px | 490 | -9.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| dots | 9999px |
| rows | 0px |
| headers | 0px |
| brand-mark | 0px |

### Layout

- **Section gap:** 24px
- **Element gap:** 24px

## Components

### Project Index Row
**Role:** The fundamental content unit — one project, one line

Single horizontal row ~56–60px tall, full-bleed width. Separated from adjacent rows by a 1px Ink hairline. Padding 5px top, 8px bottom. Contains a date cell (left, narrow ~100px), title cell (wide, left-aligned), metadata cells (Typologie, Lieu, Surface, Date, Statut — left-aligned in their columns), and a status dot (right-aligned). All text in store_norske_ja_light weight 400, 24px, lineHeight 1.20, tracking -0.48px, color Ink. No background, no border, no hover state beyond a cursor change.

### Index Column Header
**Role:** Labels the five metadata categories of each project row

A single row above the first project entry. Text in store_norske_ja_light weight 400, 24px, Ink, left-aligned in the same column positions as the row data. A 1px Ink hairline sits below the header row to separate it from the first project entry. No background fill, no bold weight — the header is visually identical to a data row except for its position and the rule beneath it.

### Brand Watermark
**Role:** The brand identity, present on every page as a background element

The text "19–86" set in store_norske_ja_light weight 400, 490px, lineHeight 1.00, tracking -9.8px, color Ink. Positioned absolutely behind the project list, typically centered horizontally and vertically, bleeding into the surrounding margins. Functions as a permanent stamp or watermark — the user reads through it, not at it. Never used as a foreground headline or logo lockup; its job is to be a presence, not a message.

### Status Dot
**Role:** Single-character indicator on the far right of each project row

A filled circle, ~6px diameter, color Ink, right-aligned with 30px right padding. Radius 9999px. No label, no tooltip in the visual layer — the dot is purely a typographic punctuation mark that signals "there is something to interact with here." Do not add color, animation, or a ring; it is monochrome by design.

### Hairline Rule
**Role:** The only separator in the system

1px solid Ink, full row width, no margin, no rounding. Used to separate every project row, to underline the column header, and to mark the bottom of the index. Never thicker than 1px. Never colored. Never replaced by background tinting or vertical padding tricks — the hairline is the system.

### Date Cell
**Role:** Left column — encodes the project's year-month identifier

Format "YY-MM" (e.g. "19-86", "14-01", "21-05"). store_norske_ja_light weight 400, 24px, Ink, left-aligned, ~100px column width. 24px left padding. Note: "19-86" appears as both a brand mark and a date — this visual rhyme is intentional and should be preserved on any screen that references the founding year.

### Project Title Cell
**Role:** The project's human-readable name

store_norske_ja_light weight 400, 24px, Ink, left-aligned, no truncation, no max-width clamp. Width is the remaining space after date and metadata columns. Treated as plain text, never as a link styled with underline or color — the entire row is the click target, not just the title.

### Metadata Cell (Typologie / Lieu / Surface / Date / Statut)
**Role:** The five structured attributes describing each project

store_norske_ja_light weight 400, 24px, Ink, left-aligned, ~120–160px column width each. 24px right padding between cells. Headers ("Typologie", "Lieu", "Surface", "Date", "Statut") are identical in type and color to the data — there is no visual distinction between label and value. The reader must infer hierarchy from position, not from weight or color.

## Do's and Don'ts

### Do
- Set all text in store_norske_ja_light weight 400 — never use bold, semibold, or medium; the system has only one voice
- Use #000000 Ink for every stroke, character, and rule; use #ffffff Paper for every background; never introduce a third color
- Separate rows with 1px hairlines and 5px/8px vertical padding — never with cards, backgrounds, or border-radius
- Left-align everything; reserve center-alignment exclusively for the 490px brand watermark behind the content
- Let the 490px "19–86" sit behind the project list as a permanent watermark on every screen — it is part of the chrome, not the content
- Use 24px gaps everywhere one element needs to breathe from another; 6px base unit applies to micro-spacing only
- Set status indicators as small filled Ink dots, right-aligned, 9999px radius — no icons, no labels, no color states

### Don't
- Do not add any color — no accent, no semantic green/red/yellow, no hover tints, no selection highlights beyond the system default
- Do not introduce box-shadows, drop-shadows, blurs, or any z-axis depth; the page is flat on flat
- Do not use border-radius on rows, headers, or containers; the only rounded element is the status dot at 9999px
- Do not add buttons, CTAs, or any element that implies an action surface — navigation is by row click, not by button press
- Do not introduce a second typeface family; the system is one font, one weight, many sizes
- Do not use bold, semibold, or medium weights to create hierarchy; hierarchy comes from size and position only
- Do not cap the lineHeight at 1.20 for body or 1.00 for display; these tight values are signature and not a bug

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | The single surface in the entire system — the page canvas, every table cell, and the ground against which the Ink brand mark is read. No card layer, no elevated layer, no overlay layer exists. |

## Elevation

The design is completely flat. Surfaces are never separated by shadow, blur, or border-radius — only by 1px hairlines or by white space. There is no z-axis. Every element exists on the same plane as the paper it is printed on. Do not introduce box-shadows, drop-shadows, or any form of depth simulation; doing so breaks the editorial restraint that defines the system.

## Imagery

No photography, no illustration, no icons, no product shots. The only graphic on the page is the typographic brand mark itself — the 490px "19–86" set as a permanent watermark behind the project index. Visual interest comes entirely from negative space, type scale, and the contrast between hairline rules and the colossal numerals. Any new screen should preserve this: type is the imagery, white space is the composition.

## Layout

Full-bleed layout with no max-width container — the project index runs edge to edge. Top-aligned to a header row showing column labels (Typologie, Lieu, Surface, Date, Statut) flush to the left. Below, a vertical list of project rows, each row ~56–60px tall, left-aligned dates in a narrow column, project names in a wide column, metadata fields center-aligned, and a small status dot right-aligned. 1px horizontal rules separate every row. The 490px brand mark sits absolutely positioned, centered or slightly left-of-center, behind the list — it is part of the background layer, not the foreground. Section transitions happen by scrolling, not by alternating bands; the entire page is one continuous white field. Navigation is minimal — likely a thin top bar or a single column of filter labels, not a sticky header or mega-menu.

## Agent Prompt Guide

Quick Color Reference
- text: #000000 (Ink)
- background: #ffffff (Paper)
- border / hairline: #000000 (Ink)
- brand mark: #000000 (Ink) at 490px, behind content
- status dot: #000000 (Ink), 6px, right-aligned
- primary action: no distinct CTA color

Example Component Prompts

1. Project Index Row
Build a single horizontal row, full-bleed width, ~58px tall. Left cell: date in "YY-MM" format, 100px column, 24px left padding. Middle cell: project title, no max-width. Right cells: five metadata fields (Typologie, Lieu, Surface, Date, Statut), ~140px each, 24px right padding. Far right: a 6px filled Ink dot, 30px right padding. All text in store_norske_ja_light weight 400, 24px, lineHeight 1.20, letterSpacing -0.48px, color #000000. 1px solid #000000 hairline below the row. No background, no border-radius, no shadow.

2. Brand Watermark
Behind the project index, place the text "19–86" absolutely positioned, centered horizontally, ~40% down the viewport. Font: store_norske_ja_light weight 400, 490px, lineHeight 1.00, letterSpacing -9.8px, color #000000. It should read as a watermark — present, architectural, never overlapping the foreground text in a way that breaks legibility. z-index below the rows, opacity at full Ink (do not reduce opacity; the scale handles the visual recession).

3. Index Column Header
Build a single header row above the first project entry, full-bleed width. Five labels left-aligned in their respective columns: "Typologie", "Lieu", "Surface", "Date", "Statut". Font: store_norske_ja_light weight 400, 24px, lineHeight 1.20, letterSpacing -0.48px, color #000000. 1px solid #000000 hairline below. Visually identical to a data row — no bold, no background, no color distinction from the rows that follow.

4. Hairline-Separated List Section
Build a vertical list of 10–20 project rows. Between every row, a 1px solid #000000 rule with no margin. Above the first row, a header row with the five column labels, followed by its own 1px #000000 rule. 5px padding top and 8px padding bottom inside each row. No alternating background, no hover state beyond a cursor change.

5. Project Detail Page (extending the system)
A project detail page should keep the same restraint: a single white canvas, a 24px store_norske_ja_light weight 400 body, a 1px Ink hairline separating content blocks, and the 490px "19–86" watermark repositioned (smaller, perhaps 120–200px, or moved to a corner). No images unless absolutely necessary; if used, treat them as raw material pasted onto the page, not as styled components. No captions, no thumbnails, no metadata badges — let the typography carry the page.

## Typography Strategy

The entire system runs on a single weight (400) of a single family (store_norske_ja_light) at two extremes of scale. Hierarchy is not built through weight contrast — it is built through amplitude: 24px whispers the catalog, 490px shouts the brand. The same letter, set small, reads as a ledger entry; set enormous, it reads as a building. This is the design's central trick, and any new screen must preserve it. Do not interpolate intermediate sizes carelessly; if a third size is needed, choose between 24 and 490 deliberately, and document why that scale point was chosen. The tight tracking (-0.0200em everywhere) and the explicit kerning feature are not optional — they prevent the display-size letters from colliding and give the body text a pressed, editorial feel. If the custom font is unavailable, Inter weight 200–300 is the most accessible substitute; Manrope ExtraLight is a slightly more characterful alternative. Do not reach for a system default like Helvetica or Arial — the thinness is the identity.

## Similar Brands

- **Bureau Borsche** — Same reliance on a single bold typographic gesture carrying the entire brand identity, with all secondary information rendered in hairline weight
- **OK-RM (London)** — Editorial restraint on a single white field, with project metadata presented as flat left-aligned text rather than as styled cards or modules
- **Werkplaats Typografie (archive)** — Swiss/Dutch tradition of using oversized type as a structural element on the page, with content organized as a typographic index rather than a visual grid
- **Pentagram (project case listings)** — Project index presented as a date-and-title ledger with metadata columns, letting the sheer volume and naming of the work carry the page
- **Standard Projects** — Monochrome editorial design with hairline rules as the primary separator, and brand identity reduced to a typographic mark rather than a logo system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-storenorskejalight: 'store_norske_ja_light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 24px;
  --leading-body: 28.8;
  --tracking-body: -0.48px;
  --text-display: 490px;
  --leading-display: 490;
  --tracking-display: -9.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 24px;
  --element-gap: 24px;

  /* Named Radii */
  --radius-dots: 9999px;
  --radius-rows: 0px;
  --radius-headers: 0px;
  --radius-brand-mark: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography */
  --font-storenorskejalight: 'store_norske_ja_light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 24px;
  --leading-body: 28.8;
  --tracking-body: -0.48px;
  --text-display: 490px;
  --leading-display: 490;
  --tracking-display: -9.8px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-30: 30px;
}
```
