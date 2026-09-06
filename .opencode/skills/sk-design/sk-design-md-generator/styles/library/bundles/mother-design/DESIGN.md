# Mother Design — Style Reference
> broadsheet manifesto in black ink

**Theme:** light

Mother Design treats the browser as an editorial broadsheet: near-total monochrome, type doing all the expressive work, structure drawn in 1px ink rules rather than shadows or panels. The single chromatic note — a deep forest green at #306f09 — is so restrained it almost disappears, surfacing only as a near-invisible code-level accent. Display sizes push to 226px, making typography the hero of every screen; supporting text is set in a tight, slightly negative-tracked grotesque that reads as confident, not loud. Components are raw: bordered tabs, unframed thumbnails, vertical hairlines dividing the grid. The Times serif appears as a quiet editorial counterpoint, never as decoration. The result feels like a printed manifesto given a fixed URL — grids of ink on warm gray paper, where restraint IS the visual identity.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Newsprint | `#f4f4f4` | `--color-newsprint` | Soft section background, alternate surface, and quiet card fill. |
| Bone White | `#ffffff` | `--color-bone-white` | Navigation background, card surfaces, button fills, inverted text — pushes forward off the gray canvas |
| Press Black | `#000000` | `--color-press-black` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. |
| Foil Gray | `#808080` | `--color-foil-gray` | Secondary text, subdued link borders, metadata — sits behind Press Black as quiet annotation |
| Ink Green | `#306f09` | `--color-ink-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |

## Tokens — Typography

### Basis — Primary typeface across all UI. Weight 400 for body, links, and most running text; weight 600 used sparingly for the small uppercase-ish labels and the navigation tabs. The 226px size at 1.0 line-height is the signature — display type behaves like a poster headline, not a web heading. Negative tracking tightens as size grows: -0.04em at display, -0.02em at mid, -0.01em at body. · `--font-basis`
- **Substitute:** Inter, Suisse Int'l, or Neue Haas Grotesk
- **Weights:** 400, 600
- **Sizes:** 10, 14, 16, 48, 60, 110, 226
- **Line height:** 1.00–1.50 (context-dependent: 1.0 for display, 1.5 for body)
- **Letter spacing:** -0.04em at 226px, -0.04em at 110px, -0.02em at 60px, -0.02em at 48px, -0.01em at 16px, 0 at 14px and below
- **Role:** Primary typeface across all UI. Weight 400 for body, links, and most running text; weight 600 used sparingly for the small uppercase-ish labels and the navigation tabs. The 226px size at 1.0 line-height is the signature — display type behaves like a poster headline, not a web heading. Negative tracking tightens as size grows: -0.04em at display, -0.02em at mid, -0.01em at body.

### Basis Mono — Used for technical labels, metadata, timestamps, and small annotations. The +0.06em letter-spacing gives it the feel of a printed caption set in a typewriter face — a deliberate counterpoint to Basis's tight grotesque. · `--font-basis-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400
- **Sizes:** 14
- **Line height:** 1.20
- **Letter spacing:** 0.06em (8.4px at 14px)
- **Role:** Used for technical labels, metadata, timestamps, and small annotations. The +0.06em letter-spacing gives it the feel of a printed caption set in a typewriter face — a deliberate counterpoint to Basis's tight grotesque.

### Times — System serif used as a rare editorial accent — appears in icon and small body contexts where a note of 'newspaper' or 'footnotes' is wanted. Its presence is felt more than seen; the choice signals print lineage rather than decoration. · `--font-times`
- **Substitute:** Times New Roman, EB Garamond, or Source Serif
- **Weights:** 400
- **Sizes:** 14
- **Line height:** 1.20
- **Letter spacing:** 0.06em
- **Role:** System serif used as a rare editorial accent — appears in icon and small body contexts where a note of 'newspaper' or 'footnotes' is wanted. Its presence is felt more than seen; the choice signals print lineage rather than decoration.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| heading-sm | 48px | 1.1 | -0.96px | `--text-heading-sm` |
| heading | 60px | 1 | -1.2px | `--text-heading` |
| heading-lg | 110px | 1 | -4.4px | `--text-heading-lg` |
| display | 226px | 1 | -9.04px | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 160-200px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Navigation Tab
**Role:** Top-level page links (Work, Information, News, Contact)

A Basis 14px / weight 600 / -0.01em text label inside a 1px Press Black border, Bone White fill, no radius, 16px horizontal padding, 2px vertical padding. Multiple tabs sit edge-to-edge forming a segmented control. The brand mark (heart icon) sits in its own bordered cell to the left of the tab group. Tabs are rectangular, unornamented — they read as printed tabs on a file folder.

### Brand Mark Cell
**Role:** Logo container at the far left of the nav row

A small square (~32px) Bone White cell with a 1px Press Black border containing a Press Black heart glyph. Mirrors the visual weight of the nav tabs and anchors the brand within the same grid as the navigation.

### News Marquee Bar
**Role:** Headline/news ticker running across the top right

Bone White fill, 1px Press Black border, Basis Mono 14px / weight 400 / +0.06em tracking, Press Black text. Headlines sit in a horizontal row separated by thin vertical Press Black rules. Reads as a printed dateline.

### Theme Toggle Cluster
**Role:** Icon-only controls in the top-right corner

Four small square cells (~32px each), 1px Press Black border, Bone White fill, each containing a single Press Black icon stroke (sun, moon, gear, etc.). Tiles sit edge-to-edge with no gap, forming a second segmented control. Icons are 1.5px stroke, geometric, no fill.

### Portfolio Thumbnail
**Role:** Project preview tiles in the work grid

Raw image tiles with zero border, zero radius, zero shadow, zero caption treatment above or below. Each tile fills its grid cell exactly; the image IS the card. Project titles and credits appear outside the grid in a small caption role. The lack of chrome lets the work — not the UI — carry attention.

### Project Caption Block
**Role:** Title + role text below the work grid

Left-aligned, no border. Project name in Basis 14px / weight 600, role/category text in Basis 14px / weight 400, both Press Black, line-height 1.2. Sits far below the grid with generous whitespace — the relationship is a footnote, not a label.

### Manifesto Block
**Role:** Large editorial paragraph introducing the studio's voice

Basis at display sizes (60–110px) / weight 400 / line-height 1.0 / letter-spacing -0.02em to -0.04em, Press Black. Flows full-width with no max-width constraint — the line length is controlled by the column count, not by a container. Inline links underlined in 1px Press Black. This is the closest the site comes to a 'hero' and it is pure type.

### Section Display Header
**Role:** Monumental section titles (Rigor, Rebellion, Depth, Care)

Basis 226px / weight 400 / line-height 1.0 / letter-spacing -0.04em, Press Black. Center-aligned within its grid cell. The cell is defined by 1px Press Black horizontal and vertical rules that frame the entire section like a table. The text floats inside the cell with ~120px of padding on all sides — the type breathes in negative space.

### Grid Section Frame
**Role:** Container for 2-up section displays and content

Full-bleed, no padding, no background, no radius. Divided by a single 1px Press Black vertical rule at the column midpoint. The vertical line is the only structural element — no cards, no fills, no spacing tricks. Top and bottom 1px Press Black horizontal rules bracket the section.

### Service List Item
**Role:** Vertical list of capabilities (Brand Strategy, Naming, etc.)

Basis 60px / weight 400 / line-height 1.0 / letter-spacing -0.02em, Press Black. Left-aligned, stacked vertically with ~8px row gap. No bullets, no borders between items — the type rhythm itself creates separation. Sits in the right column of a 2-column grid; left column contains the section display header and descriptive body copy in a small mono label role.

### Inline Link
**Role:** Hyperlinks within manifesto and body copy

Press Black text with a 1px Press Black underline. No hover color change, no background, no arrow icon. Underline thickness matches the system's hairline border — links read as underlined copy in a print layout, not as interactive web affordances.

### Section Label
**Role:** Small all-caps-style label above content blocks (e.g. 'How we do it', 'What we do')

Basis Mono 14px / weight 400 / +0.06em tracking, Press Black. Sits at the top-left of a content area, establishing the section's category before the display type takes over.

## Do's and Don'ts

### Do
- Set display type at 226px with -0.04em letter-spacing and line-height 1.0 — the extreme scale is the signature, not an exception.
- Use only the five colors: #f4f4f4 canvas, #ffffff surface, #000000 text and rules, #808080 secondary, #306f09 as the only chromatic note.
- Structure all layout with 1px Press Black rules — vertical, horizontal, and as borders on interactive cells. Never use shadows or fills to separate regions.
- Use Basis Mono with +0.06em tracking for metadata, labels, and the news ticker. Reserve Basis for everything else; bring in Times only for the occasional editorial annotation.
- Keep card and thumbnail padding at 0px. Let raw images sit edge-to-edge in their grid cells with no chrome, border, or radius.
- Anchor the nav with a 1px-bordered segmented control: brand mark cell + tab group on the left, theme toggle cluster on the right. Bone White fill, no radius.
- Treat whitespace as a structural element — large vertical gaps (160-200px) between the portfolio grid and the next section are part of the system, not negative space to be filled.

### Don't
- Do not introduce additional colors. Any new hue, even a desaturated one, will dilute the broadsheet identity. The green is a printer's mark, not a palette swatch.
- Do not add box-shadows, blurs, or any form of elevation. The system has no z-axis — depth is typographic.
- Do not round corners. Every border, button, and cell stays at 0px radius. Curvature would betray the printed-page metaphor.
- Do not cap display type at conventional web sizes (48-72px). The 226px / 110px scale is the point — shrinking it to 'feel more modern' removes the signature.
- Do not use weight 700 or 800. Basis 600 is the heaviest weight in the system; 400 does the work at display sizes because the size itself provides weight.
- Do not add icons inside buttons or cards. Icons live only in the theme toggle cluster and the brand mark cell.
- Do not center body copy or set paragraphs to a narrow max-width. The manifesto reads full-bleed; column width is controlled by the grid, not by a content container.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Newsprint | `#f4f4f4` | Page canvas — the warm gray 'paper' everything sits on |
| 1 | Bone White | `#ffffff` | Navigation bar, button surfaces, and the few elevated card containers that need to step forward from the canvas |

## Elevation

The system rejects elevation entirely. There are no drop shadows, no surface lifts, no depth illusions. Structure is communicated through 1px Press Black rules that slice the layout into a grid, and through the tonal step from Newsprint (#f4f4f4) to Bone White (#ffffff) for the navigation bar. Depth is typographic, not architectural — the 226px display type carries the weight that shadows would in a conventional UI.

## Imagery

The work grid is the imagery: diverse, unframed, full-bleed thumbnails spanning product photography (soda can held against a rainbow sky), editorial poster design (Brooklyn Orioles type-heavy poster), brand identity systems (Babies type specimen), and 3D product render (Rolfr camera-can). No consistent photographic treatment — each project's thumbnail arrives raw, at full color, with no overlay, duotone, or filter. The page itself is text-dominant; imagery appears only in the portfolio grid and is treated as evidence of capability rather than atmosphere. Iconography is minimal: 1.5px stroke geometric glyphs confined to the theme toggle cluster and the heart brand mark. The visual language of the site is the visual language of a printed portfolio — let the work speak in full color against the otherwise black-on-gray page.

## Layout

Full-bleed edge-to-edge layout with no max-width container. The page is organized as a strict grid divided by 1px Press Black rules. The top row contains the nav (left: brand mark + segmented tabs, right: news marquee + theme toggles) in a fixed-height bar. Below the nav, the work grid is a 5-column row of thumbnail tiles with zero gap between cells — images touch. A large vertical gap (160-200px) separates the grid from the manifesto section, which is a full-width block of display-size running text. The 'How we do it' and 'What we do' sections use a 2-column grid split by a 1px vertical rule at the midpoint; the left column carries a small section label and body copy, the right column carries the monumental display type (Rigor/Rebellion, Depth/Care) or a vertical service list. Each major section is bracketed by 1px horizontal Press Black rules top and bottom. The page reads top-to-bottom as a printed document: header bar, portfolio spread, manifesto column, sectioned grid pages.

## Editorial System

Mother Design's UI borrows its logic from print — specifically from broadsheet newspapers and design annuals. The signature moves: display type at poster scale (226px) with aggressive negative tracking, 1px ink rules instead of cards or shadows, a single warm-gray 'newsprint' canvas, and a Times serif used as quiet editorial counterpoint to the Basis grotesque. The only color in the system is Press Black; everything else is paper. An AI building a new page should treat the layout as a typeset page, not a web app: no max-width container, no centered body text, no rounded corners, no elevation. The grid is the chrome.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f4f4f4
- surface: #ffffff
- border: #000000 (1px)
- secondary text: #808080
- accent: #306f09
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Section display header*: Render 'Rigor' at 226px Basis weight 400, color #000000, letter-spacing -0.04em, line-height 1.0, centered in a grid cell framed by 1px #000000 rules on all sides with ~120px internal padding.
2. *Navigation tab*: Basis 14px weight 600, text 'Work', color #000000, background #ffffff, 1px #000000 border, 16px horizontal padding, 2px vertical padding, 0px radius. Place in a row of similar tabs edge-to-edge.
3. *Service list item*: Basis 60px weight 400, text 'Brand Strategy', color #000000, letter-spacing -0.02em, line-height 1.0, left-aligned, stacked vertically with 8px row gap, no bullet, no border.
4. *Portfolio thumbnail*: Full-bleed image filling a 5-column grid cell, 0px border, 0px radius, 0px padding, no caption inside the cell.
5. *Section label*: Basis Mono 14px weight 400, text 'What we do', color #000000, letter-spacing 0.06em, line-height 1.2, positioned at the top-left of a content area.

## Similar Brands

- **Pentagram** — Same editorial agency tradition: 1px rules structuring the page, monochromatic canvas, display type doing the work of decoration, and a portfolio grid that lets the work arrive unframed.
- **Bureau Borsche** — Same broadsheet sensibility — massive type set tight, warm-gray backgrounds, and a refusal to round corners or add elevation. Both treat the browser as a typeset page.
- **Studio Dumbar** — Shared commitment to restrained color (essentially monochrome with one accent), grotesque sans-serif at extreme display sizes, and structural grids drawn in hairline rules rather than built from cards.
- **Anagrama** — Editorial agency sites that use the same playbook: canvas-light layout, oversized display headings with negative tracking, bordered segmented navigation, and a portfolio grid with no thumbnail chrome.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-newsprint: #f4f4f4;
  --color-bone-white: #ffffff;
  --color-press-black: #000000;
  --color-foil-gray: #808080;
  --color-ink-green: #306f09;

  /* Typography — Font Families */
  --font-basis: 'Basis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-mono: 'Basis Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.96px;
  --text-heading: 60px;
  --leading-heading: 1;
  --tracking-heading: -1.2px;
  --text-heading-lg: 110px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -4.4px;
  --text-display: 226px;
  --leading-display: 1;
  --tracking-display: -9.04px;

  /* Typography — Weights */
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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-200: 200px;

  /* Layout */
  --section-gap: 160-200px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tabs: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-newsprint: #f4f4f4;
  --surface-bone-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-newsprint: #f4f4f4;
  --color-bone-white: #ffffff;
  --color-press-black: #000000;
  --color-foil-gray: #808080;
  --color-ink-green: #306f09;

  /* Typography */
  --font-basis: 'Basis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-mono: 'Basis Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.96px;
  --text-heading: 60px;
  --leading-heading: 1;
  --tracking-heading: -1.2px;
  --text-heading-lg: 110px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -4.4px;
  --text-display: 226px;
  --leading-display: 1;
  --tracking-display: -9.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-200: 200px;
}
```
