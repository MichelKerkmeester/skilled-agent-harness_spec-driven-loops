# Anacuna — Style Reference
> Oversized broadsheet with blush punctuation — a page where type IS the design and the single pink pill is the only color the eye can find.

**Theme:** light

Anacuna runs on a typographic monosystem: a single grotesque weight at three sizes does every job on the page, from 94px project headlines down to 15px nav labels. The canvas is pure white and almost every stroke is pure black — the only chromatic note is a single blush-pink (#ffc8c8) used as a soft brand seal, never as decoration. Layout is an editorial index: full-bleed rows separated by hairlines, oversized titles bleeding past the viewport, client names tucked into small outlined pills at the row's right edge. Everything interactive collapses into one shape — a 27px pill — which makes the page feel like a printed broadsheet that happens to be clickable.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, all borders, every hairline divider, filled language toggle — the entire structural skeleton of the page |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, pill interiors, button text on dark fills |
| Blush Bloom | `#ffc8c8` | `--color-blush-bloom` | Brand mark fill (the ANA CUNA pill in the header) and the sole chromatic accent — a whisper of warmth that marks identity without ever shouting |

## Tokens — Typography

### ABCMonumentGrotesk-Regular — Sole typeface for the entire system. One weight — regular — is used at all three sizes: 94px for project titles (display), 31px for secondary headings, 15px for body, nav, tags, and footer. The refusal to introduce a bold or italic weight is a signature editorial choice; hierarchy comes purely from size, not weight. · `--font-abcmonumentgrotesk-regular`
- **Substitute:** Suisse Int'l Regular, or fallback to Inter Regular at matching optical sizes
- **Weights:** 400
- **Sizes:** 15px, 31px, 94px
- **Line height:** 1.00–1.11
- **Role:** Sole typeface for the entire system. One weight — regular — is used at all three sizes: 94px for project titles (display), 31px for secondary headings, 15px for body, nav, tags, and footer. The refusal to introduce a bold or italic weight is a signature editorial choice; hierarchy comes purely from size, not weight.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 15px | 1.11 | — | `--text-body` |
| heading-sm | 31px | 1.11 | — | `--text-heading-sm` |
| display | 94px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 21 | 21px | `--spacing-21` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 27px |
| pills | 27px |
| buttons | 27px |

### Layout

- **Section gap:** 48-80px
- **Card padding:** 14px
- **Element gap:** 7px

## Components

### Brand Seal Pill
**Role:** Site identity in the top-left corner — the only chromatic element on the page

Fully filled pill with #ffc8c8 background, #000000 text, 27px border-radius, approximately 6-8px vertical padding and 14px horizontal padding. Reads 'ANA CUNA' in ABC Monument Grotesk Regular at 15px. Functions as the brand mark, the home link, and the sole visual signature that the page belongs to anyone.

### Project Title Row
**Role:** The dominant unit of the portfolio — one project per row

Massive 94px ABC Monument Grotesk Regular text (#000000) set at line-height 1.00, left-aligned, bleeding past the right edge of the viewport. A 1px black hairline (#000000) sits above and below each row, creating a ruled-paper rhythm. Project title is truncated by the viewport edge — the bleed is intentional, signalling that the work extends beyond the frame.

### Client Tag Pill
**Role:** Client attribution label nested at the right end of each project row

Small outlined pill: 1px #000000 border, #ffffff fill, 27px border-radius, 6-8px vertical padding, 14px horizontal padding. Text in ABC Monument Grotesk Regular at 15px, #000000. Examples: 'Google Play', 'The New York Times Kids', 'Foot Locker'. Sits inline with the massive title text — the size contrast between 94px title and 15px tag is the row's entire visual dynamic.

### Outlined Nav Button
**Role:** Primary navigation (PLAY, ABOUT) in the top-right header

Ghost/outlined pill: 1px #000000 border, transparent or #ffffff fill, 27px border-radius, 6-8px vertical padding, 14px horizontal padding. Text at 15px ABC Monument Grotesk Regular, #000000. Inherits the same pill geometry as the client tags, making the nav feel like part of the editorial system rather than a separate UI layer.

### Language Toggle
**Role:** EN/ES language switcher in the header

Filled pill with #000000 background, #ffffff text, 27px border-radius. Two states (EN / ES) sit adjacent inside the same pill; the active language appears inverted against the dark fill. The only filled-dark element on the page besides text — a deliberate inversion of the otherwise all-outline pill system.

### Hairline Divider
**Role:** Horizontal separator between project rows

1px solid #000000 line spanning the full viewport width. No margin above or below — sits flush against the type. This is the only structural divider on the page; no cards, no boxes, no elevation.

### Footer Bar
**Role:** Persistent copyright and legal links at the page bottom

Full-width row, 1px #000000 top border, #ffffff background. Left: 'ANA CUNA ILUSTRACIÓN © 2026' at 15px. Right: 'LEGAL | COOKIES' at 15px. The vertical pipe separator carries the only inline typographic glyph in the system besides the pill text.

## Do's and Don'ts

### Do
- Set every project title in ABC Monument Grotesk Regular at 94px with line-height 1.00 — never introduce a bold or italic weight to create hierarchy.
- Separate every project row with a 1px #000000 hairline, flush against the type with no vertical margin.
- Use the 27px pill radius for every clickable element — nav, tags, brand mark, language toggle.
- Reserve #ffc8c8 exclusively for the ANA CUNA brand seal; it is the only chromatic color permitted on the page.
- Let display text bleed past the right viewport edge — the truncation is intentional editorial framing.
- Set body, nav, tags, and footer text at 15px ABC Monument Grotesk Regular with line-height 1.11.
- Keep the page background pure #ffffff and all text/borders pure #000000 — no intermediate grays.

### Don't
- Do not add a bold, semibold, or italic weight to the type system — Monument Grotesk Regular at varying sizes is the entire hierarchy.
- Do not introduce card backgrounds, drop shadows, or elevated surfaces — the design is flat ruled paper, not a card system.
- Do not use #ffc8c8 for hover states, secondary CTAs, or decorative washes — it is locked to the brand mark only.
- Do not center-align project titles or constrain them to a max-width container — the full-bleed left alignment is the layout.
- Do not add intermediate neutral grays (#666, #999, etc.) — the system is binary black-on-white.
- Do not use 8px or 12px border-radius on any element — the 27px pill is the only radius in the system.
- Do not add icons, illustrations, or imagery to the index page — the typography alone carries the portfolio.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the entire site is one continuous white surface |
| 1 | Pill Interior | `#ffffff` | Inside of outlined pills (nav, client tags) — visually identical to the canvas, distinguished only by the 1px black border |
| 2 | Blush Mark | `#ffc8c8` | Sole chromatic surface — the brand seal pill in the header |

## Elevation

The design has zero elevation. No drop shadows, no border-radius other than the 27px pill, no surface stacking. Hierarchy is established entirely through type scale and 1px hairlines, creating a printed-broadsheet flatness rather than a software-UI depth model.

## Imagery

Zero imagery on the index page — the typography IS the content. The portfolio communicates entirely through oversized project titles and client names in outlined pills; the actual illustration work is presumably reached via the PLAY link or individual project pages. No photography, no icons, no decorative graphics, no color washes.

## Layout

Full-bleed single-column editorial index. The header is a thin bar with the blush brand seal at top-left and nav + language toggle at top-right, separated from content by whitespace. The body is a vertical stack of project rows, each consisting of a 94px title bleeding left-to-right and a small client tag pill anchored at the row's right side. Rows are separated by 1px black hairlines with generous vertical breathing room (48-80px). No max-width container, no centered column, no grid — the layout is a single ruled list that occupies the entire viewport width. Footer is a full-width bar with copyright left and legal links right, capped by a 1px top border.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px hairlines)
- accent: #ffc8c8 (brand seal only)
- primary action: #ffc8c8 (filled action)

**Example Component Prompts**

1. *Project Title Row*: Full-width row on #ffffff background. Title in ABC Monument Grotesk Regular at 94px, line-height 1.00, #000000, left-aligned, allowed to bleed past the right edge. A 1px solid #000000 hairline sits flush above the text. 48-80px of vertical space between rows.

2. *Client Tag Pill*: Outlined pill, 1px #000000 border, #ffffff fill, 27px border-radius, 6-8px vertical padding, 14px horizontal padding. Text in ABC Monument Grotesk Regular at 15px, line-height 1.11, #000000. Anchored to the right end of the project title row.

3. *Brand Seal Pill*: Filled pill, #ffc8c8 background, 27px border-radius, 6-8px vertical padding, 14px horizontal padding. Text 'ANA CUNA' at 15px ABC Monument Grotesk Regular, #000000. Top-left of header.

4. *Language Toggle*: Single pill, #000000 background, 27px border-radius, containing two 15px labels in #ffffff ABC Monument Grotesk Regular. The active language is displayed in #ffffff against the black fill; the inactive language may be dimmed or shown in a lighter tone. Top-right of header.

5. *Hairline Divider*: 1px solid #000000 line spanning 100% viewport width, with zero vertical margin — sits flush against adjacent type.

## Similar Brands

- **Manual (manual.to)** — Same oversized grotesque display type bleeding past the viewport edge, same ruled-list project index, same near-zero color palette
- **Bureau Cool** — Same single-weight grotesque at extreme size contrast, same editorial broadsheet rhythm, same restraint to one accent color
- **Pentagram (pentagram.com)** — Same typographic-led portfolio structure where the title size and a hairline do all the structural work
- **Raficelli** — Same pill-shaped tag system anchoring client attribution to oversized project titles, same monochrome editorial tone

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-blush-bloom: #ffc8c8;

  /* Typography — Font Families */
  --font-abcmonumentgrotesk-regular: 'ABCMonumentGrotesk-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.11;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.11;
  --text-display: 94px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-21: 21px;

  /* Layout */
  --section-gap: 48-80px;
  --card-padding: 14px;
  --element-gap: 7px;

  /* Border Radius */
  --radius-3xl: 27.4285px;

  /* Named Radii */
  --radius-tags: 27px;
  --radius-pills: 27px;
  --radius-buttons: 27px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-pill-interior: #ffffff;
  --surface-blush-mark: #ffc8c8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-blush-bloom: #ffc8c8;

  /* Typography */
  --font-abcmonumentgrotesk-regular: 'ABCMonumentGrotesk-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.11;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.11;
  --text-display: 94px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-21: 21px;

  /* Border Radius */
  --radius-3xl: 27.4285px;
}
```
