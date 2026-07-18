# Simon Liesinger — Style Reference
> Drafting table on bone paper. A designer’s monograph rendered as a website — serif body type sitting on a vast off-white canvas, punctuated by a single stroke of red.

**Theme:** light

Liesingers is a gallery-wrapped-in-a-browser: a near-monochromatic editorial portfolio where a warm vermillion red is the only chromatic interruption in an otherwise graphite-and-bone-white composition. The system behaves like a printed monograph — Garamond sets the voice for headlines and body copy, while Helvetica with tabular figures handles the metadata column at the foot of the page. The grid is unapologetically wide and columnar, sections stack as full-bleed bands separated by hairline rules, and the navigation lives at the bottom rather than the top. Components are flat, borderless in the traditional sense, and rely on line weight and whitespace for structure rather than fill, shadow, or color blocks. The wireframe illustration in vermillion is the only piece of ornament — everything else earns its place as structure or text.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f2f2f2` | `--color-bone` | Page canvas, card surfaces, section backgrounds — the paper of the monograph |
| Graphite | `#181818` | `--color-graphite` | Primary text, body copy, hairline rules, column dividers — softer than pure black, reads as printed ink |
| Ink | `#000000` | `--color-ink` | Hardest rule weights, foot dividers, densest border lines — the purest black on the page |
| Ash | `#6e6e6e` | `--color-ash` | Muted column rules, secondary divider strokes — the gray that softens the grid |
| Vermillion | `#fc523b` | `--color-vermillion` | Link arrows, the wireframe illustration, the only chromatic accent — a printer’s mark red, not an interface brand color |

## Tokens — Typography

### Garamond — Editorial serif used for headlines, body copy, and the introductory address. Set exclusively at weight 400 — the typeface’s contrast and oldstyle proportions do the visual lifting. The 36px tier is the opening statement, 29px is section copy, 25px is dense paragraphs. · `--font-garamond`
- **Substitute:** EB Garamond, Cormorant Garamond
- **Weights:** 400
- **Sizes:** 25px, 29px, 36px
- **Line height:** 0.86–1.28
- **Letter spacing:** 0.0160em
- **Role:** Editorial serif used for headlines, body copy, and the introductory address. Set exclusively at weight 400 — the typeface’s contrast and oldstyle proportions do the visual lifting. The 36px tier is the opening statement, 29px is section copy, 25px is dense paragraphs.

### Helvetica — Small UI metadata — navigation labels, contact lines, service labels, collaborator names. Renders with tabular figures and stylistic alternates (ss04, ss07, zero) so columns of names align like a typeset index. · `--font-helvetica`
- **Substitute:** Inter, Neue Haas Grotesk, Helvetica Neue
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20–1.67
- **Letter spacing:** 0.0170em
- **OpenType features:** `"case", "kern", "ss04", "ss07", "tnum", "zero"`
- **Role:** Small UI metadata — navigation labels, contact lines, service labels, collaborator names. Renders with tabular figures and stylistic alternates (ss04, ss07, zero) so columns of names align like a typeset index.

### Times — Micro-copy at 10px — copyright, fine print, the smallest annotations. System serif fallback for the tiniest type tier. · `--font-times`
- **Substitute:** Times New Roman
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.20
- **Role:** Micro-copy at 10px — copyright, fine print, the smallest annotations. System serif fallback for the tiniest type tier.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 25px | 1.22 | 0.4px | `--text-body` |
| subheading | 29px | 1 | 0.46px | `--text-subheading` |
| heading | 36px | 0.86 | 0.58px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 25 | 25px | `--spacing-25` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 119 | 119px | `--spacing-119` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 30px
- **Card padding:** 30px
- **Element gap:** 5px

## Components

### Section Column
**Role:** Vertical content column within a multi-column grid band

Full-width band divided by 1px Graphite (#181818) vertical rules into equal columns. 30px horizontal padding per column. No card background — the bone canvas shows through. Headings, lists, and prose stack within the column at 30px top padding.

### Service List
**Role:** Left-aligned vertical list of discipline or service labels

Stacked Garamond 25px or Helvetica 12px items separated by 12–14px of vertical space. No bullets, no dividers between items — whitespace carries the rhythm. Left-aligned to the column edge.

### Collaborator Roster
**Role:** Right-side column listing names and disciplines

Two-line pair: name in Helvetica 12px weight 400, discipline label in the same size immediately below, separated by tight line-height. Names carry an asterisk marker (★ or *) to flag them. Tabular figures keep the names optically aligned in a column.

### Bottom Navigation
**Role:** Primary site navigation anchored to page foot

Three segments — about ↗, work ↗, lab ↗ — set in Garamond, separated by 1px Graphite (#181818) vertical rules. Arrow glyph rendered in Vermillion (#fc523b). 30px horizontal padding, ~79px bottom padding from viewport edge.

### Link Arrow
**Role:** External/internal link indicator

Vermillion (#fc523b) diagonal arrow (↗) trailing a text label. The only place the accent color touches text. Functions as a signifier of navigation away from the current context.

### Wireframe Illustration
**Role:** Decorative centerpiece in the hero region

Geometric line drawing in Vermillion (#fc523b) — thin 1px strokes, no fills, transparent. Sits as a free-floating ornament on the bone canvas. The only non-textual, non-structural element on the page.

### Prologue Block
**Role:** Long-form editorial copy section

Indented label 'prologue' in 12px Helvetica sits in a narrow left column; the body text occupies a wider right column at Garamond 25px with 40px bottom margin before the next band. Generous left margin (119px) creates the indentation.

### Contact Strip
**Role:** Email and phone metadata at page foot

Two-line stack: 'hello@liesingers.com*' and '+43 (0)650 68 98 665*' in Helvetica 12px, Graphite (#181818). Tightly packed against the bottom-left of the viewport.

### Section Divider
**Role:** Horizontal rule between bands

1px Ash (#6e6e6e) or Graphite (#181818) hairline spanning the full viewport width. 160px of vertical padding above and below creates the breathing room between sections.

### Heading Statement
**Role:** Opening address or section title

Garamond 36px weight 400, line-height 0.86 (tight), set left-aligned. The tight leading is a deliberate editorial choice — lines almost touch, creating a compact monogram-like block.

## Do's and Don'ts

### Do
- Use #f2f2f2 for the page canvas and never introduce a different background color within the main content bands
- Set all body and headline text in Garamond at weight 400; the serif contrast is the only typographic voice needed
- Use #fc523b exclusively for the wireframe illustration and the ↗ arrow glyph — never as a fill on text, buttons, or borders
- Separate sections with 1px hairline rules in #181818 or #6e6e6 and 160px of vertical padding rather than cards or backgrounds
- Anchor primary navigation to the bottom of the viewport with three text segments divided by vertical rules
- Use 0px border-radius on every component — the system is square-cornered throughout
- Reserve 12px Helvetica for metadata columns (names, services, contact) and pair it with tabular figures to keep stacked names aligned

### Don't
- Do not add drop shadows, glows, or any form of elevation — the system is flat and reads as printed matter
- Do not introduce a second accent color or shift the vermillion to a more saturated or muted red
- Do not set body type in Helvetica or display type in Times — the serif/sans division is strictly size-based
- Do not use rounded corners on cards, buttons, tags, or images
- Do not place navigation at the top of the page or use a hamburger menu
- Do not use color blocks, filled buttons, or solid panels as section backgrounds
- Do not use font-weight above 400; bold or black weights break the printed-page illusion

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#f2f2f2` | Full-page background, the paper on which everything is printed |
| 2 | Ink Plate | `#181818` | Dark contrast surface for selected sections or footers |

## Elevation

No shadows. No elevation. Structure is communicated exclusively through line weight, column rules, and whitespace. The system trusts the grid.

## Imagery

No photography, no raster images. The visual language is almost entirely typographic and structural — the single ornamental element is a wireframe/3D wireframe illustration rendered in thin vermillion (#fc523b) strokes with no fill. Illustrations, when present, are line-based geometric constructions that sit as free-floating objects on the bone canvas. The site’s iconography is limited to the ↗ arrow glyph, which appears exclusively in vermillion.

## Layout

Full-bleed page with no max-width container — content stretches to the viewport edges. The page is organized as a vertical stack of horizontal bands, each band subdivided by 1px vertical rules into 3–4 equal columns. The opening statement occupies the top-left in a generous column with the wireframe illustration floating in the center-right space. A four-column metadata band follows (services, services, awards, collaborators), then a two-column prologue block (narrow label column + wide body column), and finally a three-segment bottom navigation. Spacing between bands is ~160px; padding within columns is uniformly 30px. Density is spacious — the grid breathes.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #f2f2f2
- text: #181818
- border: #181818 (strong) / #6e6e6e (muted)
- accent: #fc523b (illustration and link arrow only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Opening Statement**: Left-aligned Garamond 36px weight 400, #181818, line-height 0.86, letter-spacing 0.58px. Sits in the left third of the viewport with 30px column padding. Below it, body text at Garamond 25px, line-height 1.22, same graphite color. A 5px top margin separates heading from body.

2. **Bottom Navigation Bar**: Full-width band anchored to the viewport bottom with ~79px bottom padding. Three equal-width segments separated by 1px vertical rules in #181818. Each segment contains a Garamond label (e.g. 'about') followed by a ↗ glyph in #fc523b. 30px horizontal padding per segment.

3. **Four-Column Metadata Band**: Full-width section with 160px top padding. Four equal columns divided by 1px #181818 vertical rules. Each column contains a left-aligned vertical list of items at 12px Helvetica weight 400, separated by 12–14px vertical space, color #181818. The rightmost column pairs a name (12px) with a discipline label directly below it.

4. **Prologue Block**: Full-width band with 160px top padding. Narrow left column (narrow margin offset of 119px) holds the label 'prologue' in 12px Helvetica, color #181818. Wider right column holds body copy in Garamond 25px, line-height 1.22, color #181818. 40px bottom margin before the next band.

5. **Wireframe Illustration**: Centered in the right portion of the opening band. Thin 1px strokes in #fc523b, no fills, transparent background. Pure geometric line construction, roughly 400–500px wide. Sits on the #f2f2f2 canvas with no container or border.

## Similar Brands

- **Pentagram** — Same monograph-on-the-web treatment: editorial serif body type, generous whitespace, columnar grids, zero ornament beyond typography
- **Manual Madrid** — Studio portfolio with the same single-accent-color discipline — almost entirely monochrome with one vivid red used sparingly for arrows and small marks
- **A Practice for Everyday Life** — Print-design sensibility applied to web — Garamond-adjacent serif, column rules, flat composition, no shadows or rounded corners
- **Lars Müller Publishers** — Editorial publishing aesthetic with hairline rules, a single chromatic accent, and typography doing all the structural work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f2f2f2;
  --color-graphite: #181818;
  --color-ink: #000000;
  --color-ash: #6e6e6e;
  --color-vermillion: #fc523b;

  /* Typography — Font Families */
  --font-garamond: 'Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 25px;
  --leading-body: 1.22;
  --tracking-body: 0.4px;
  --text-subheading: 29px;
  --leading-subheading: 1;
  --tracking-subheading: 0.46px;
  --text-heading: 36px;
  --leading-heading: 0.86;
  --tracking-heading: 0.58px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-119: 119px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 30px;
  --card-padding: 30px;
  --element-gap: 5px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #f2f2f2;
  --surface-ink-plate: #181818;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f2f2f2;
  --color-graphite: #181818;
  --color-ink: #000000;
  --color-ash: #6e6e6e;
  --color-vermillion: #fc523b;

  /* Typography */
  --font-garamond: 'Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 25px;
  --leading-body: 1.22;
  --tracking-body: 0.4px;
  --text-subheading: 29px;
  --leading-subheading: 1;
  --tracking-subheading: 0.46px;
  --text-heading: 36px;
  --leading-heading: 0.86;
  --tracking-heading: 0.58px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-119: 119px;
  --spacing-160: 160px;
}
```
