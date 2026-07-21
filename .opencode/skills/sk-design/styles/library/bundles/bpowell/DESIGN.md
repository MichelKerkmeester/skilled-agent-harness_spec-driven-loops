# Bpowell — Style Reference
> type as architecture on white plaster

**Theme:** mixed

A text-only portfolio that lets typography do every job — no imagery, no decoration, no chrome. The page reads as an architectural list: small tightly-set labels act as section markers, then oversized project names stack like concrete blocks on a wall. Two surfaces alternate — a bright white canvas for design work, an inverted near-black canvas for film — and the contrast between them is the only visual rhythm. The layout is brutally asymmetric: a single column of oversized text pinned to the left, generous gutters of negative space, and a top nav that distributes itself across the full viewport width rather than clustering in a corner. The system has no buttons, no cards, no borders in the traditional sense — the nearest thing to a border is a 1px black hairline, and even that is used sparingly. The result feels like reading a credits sequence printed on a gallery wall: austere, deliberate, and confident that the names themselves carry the weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Plaster White | `#ffffff` | `--color-plaster-white` | Primary canvas for the light sections; text color on the dark sections; hairline dividers on the dark sections |
| Carbon | `#111111` | `--color-carbon` | Page background for the dark/film section; primary body text on light sections; structural fill for project name typography |
| Ink Black | `#000000` | `--color-ink-black` | Secondary text and fill on light sections; used where maximum contrast is needed against the white canvas |
| Graphite | `#2b2b2b` | `--color-graphite` | Subtle darker border for low-emphasis rules on light surfaces |

## Tokens — Typography

### Teg — Display — reserved for the largest project names and the hero text. The aggressive -0.033em tracking at 86px tightens the letters into a near-monolithic block; this is the font that creates the 'stacked concrete' reading. Substitute: Migra, Editorial New, or Canela Display. · `--font-teg`
- **Substitute:** Migra or Editorial New
- **Weights:** 500, 600
- **Sizes:** 58px, 86px
- **Line height:** 1.04, 1.05
- **Letter spacing:** -0.0330em at 86px, -0.0170em at 58px
- **Role:** Display — reserved for the largest project names and the hero text. The aggressive -0.033em tracking at 86px tightens the letters into a near-monolithic block; this is the font that creates the 'stacked concrete' reading. Substitute: Migra, Editorial New, or Canela Display.

### Beatrice Display — Mid-scale editorial type — appears as secondary project list text alongside the larger Teg names, providing typographic counterpoint at a calmer scale. Substitute: Tiempos Headline, Canela, or Reckless. · `--font-beatrice-display`
- **Substitute:** Tiempos Headline or Canela
- **Weights:** 500, 600
- **Sizes:** 26px
- **Line height:** 1.15
- **Letter spacing:** normal
- **Role:** Mid-scale editorial type — appears as secondary project list text alongside the larger Teg names, providing typographic counterpoint at a calmer scale. Substitute: Tiempos Headline, Canela, or Reckless.

### Beatrice — Body-weight Beatrice variant for the same 26px role but with the text-figure character set. Substitute: same as Beatrice Display. · `--font-beatrice`
- **Substitute:** Tiempos Text
- **Weights:** 500
- **Sizes:** 26px
- **Line height:** 1.15
- **Letter spacing:** normal
- **Role:** Body-weight Beatrice variant for the same 26px role but with the text-figure character set. Substitute: same as Beatrice Display.

### Diatype — Workhorse sans for body copy, nav items, and supporting text. Weight 500 is the default; 700 is reserved for the nav name 'Ben Powell' to give it anchor weight in the distributed nav. Substitute: Söhne, Inter, or ABC Diatype. · `--font-diatype`
- **Substitute:** Söhne or Inter
- **Weights:** 500, 700
- **Sizes:** 26px, 58px
- **Line height:** 1.04, 1.05, 1.15
- **Letter spacing:** -0.0170em
- **Role:** Workhorse sans for body copy, nav items, and supporting text. Weight 500 is the default; 700 is reserved for the nav name 'Ben Powell' to give it anchor weight in the distributed nav. Substitute: Söhne, Inter, or ABC Diatype.

### New Grotesk — Wide-tracked all-caps label face for section markers ('Design', 'Film'). The extreme +0.069em tracking turns short words into spaced-out type-art — this is the system's only 'decorative' choice. Substitute: ABC Diatype Mono Upper, Space Grotesk, or Neue Haas Grotesk Display. · `--font-new-grotesk`
- **Substitute:** Space Grotesk or ABC Diatype Mono
- **Weights:** 600
- **Sizes:** 58px, 60px
- **Line height:** 1.00, 1.04
- **Letter spacing:** 0.0690em
- **Role:** Wide-tracked all-caps label face for section markers ('Design', 'Film'). The extreme +0.069em tracking turns short words into spaced-out type-art — this is the system's only 'decorative' choice. Substitute: ABC Diatype Mono Upper, Space Grotesk, or Neue Haas Grotesk Display.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 26px | 1.15 | — | `--text-caption` |
| heading | 58px | 1.05 | -0.17px | `--text-heading` |
| display | 86px | 1.04 | -2.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| none | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 104px
- **Card padding:** 0px
- **Element gap:** 16px

## Components

### Distributed Top Nav
**Role:** Primary navigation — replaces a conventional logo-cluster layout

A single horizontal row pinned to the very top of the viewport, 40px horizontal padding, items distributed across the full width using flexbox space-between (no centered logo, no hamburger). Four text items: the owner name (Diatype 500/700), the descriptor ('Designer & filmmaker'), the email address, and an availability status. Font: Diatype 500 at 26px, color #111111. The first item (owner name) is set at weight 700 to act as the only visual anchor in an otherwise flat row.

### Section Label
**Role:** Marker that introduces a new category block

Small, wide-tracked, acts as a typographic flag above each project list. Font: New Grotesk 600, ~12-14px, letter-spacing 0.069em, all uppercase or sentence case. Color: #111111 on light sections, #ffffff on the dark section. Sits 40-56px above the first project name. No underline, no icon — the tracking does the work.

### Project List Item — Large
**Role:** The primary content unit; project names that form the page's structure

Oversized text in Teg 500 or 600, 86px on desktop, line-height 1.04, letter-spacing -0.033em. Color: #111111 on light sections, #ffffff on the dark section. Stacked vertically with 0-4px gap between lines (the lines nearly touch, creating a continuous block). No bullet, no link styling, no metadata — the name is the entire item.

### Project List Item — Secondary
**Role:** Typographic counterpoint in the list stack

Slightly smaller project names at 58px, set in Beatricedisplay or Teg weight 500, line-height 1.05, letter-spacing -0.017em. Appears alongside the 86px names to create a rhythmic size alternation in the list — some names shout, others speak. Same color rules as the large variant.

### Light Canvas Section
**Role:** The default page surface for design work

Full-bleed white (#ffffff) background, left-aligned content column starting at the 40px page margin, 104px top/bottom internal padding. Contains the section label and project list. No borders, no shadows, no card containers.

### Dark Canvas Section
**Role:** Inverted surface for the film category

Full-bleed near-black (#111111) background with identical layout rhythm to the light section — same 40px left margin, same 104px vertical padding, same typographic structure. Text and labels invert to #ffffff. The alternation between the two surfaces is the page's only visual section break; there is no dividing line or gradient between them.

### Content Column
**Role:** The single left-aligned text column that holds all content

Left-pinned at 40px from the viewport edge, extends rightward as far as the longest line needs. No max-width cap on the text itself, but the longest project names (e.g. 'Iceland in Winter') naturally bound the column at roughly 800-900px. No centering, no right rail.

## Do's and Don'ts

### Do
- Use exactly two surfaces — #ffffff and #111111 — and alternate them as full-bleed sections to create rhythm without any divider lines
- Set project names in Teg at 86px / line-height 1.04 / letter-spacing -0.033em on desktop; this aggressive tracking is what makes the list read as a wall of text
- Use New Grotesk 600 with 0.069em tracking for all section labels — the wide spacing is the system's only 'decorative' typographic move
- Distribute nav items across the full viewport width with space-between; never cluster them in a corner or center them
- Anchor the leftmost nav item at weight 700 (Diatype) so the owner's name reads as the only visual weight in an otherwise flat row
- Maintain 40px left padding from the viewport edge for the content column on all sections
- Use 104px for the major vertical section padding — it is the largest spacing unit in the system and defines the page's breathing rhythm

### Don't
- Do not introduce any color beyond #ffffff, #111111, #000000, and #2b2b2b — the system is monochrome by design
- Do not add images, thumbnails, or preview artwork to project list items; the name alone is the entry
- Do not center project names or align them to a grid — they are pinned to the left margin and let their own length determine the column
- Do not use card containers, rounded corners, or drop shadows; the system has zero elevation and zero radius
- Do not set body or nav text larger than 26px; the scale jumps directly to 58px for sub-headings and 86px for display, and bridging that gap destroys the contrast
- Do not add hover color changes, underlines, or button styles to project names — they read as a list, not as links
- Do not use more than one typeface per text block; mixing Teg with Beatricedisplay inside the same line breaks the typographic system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Plaster White | `#ffffff` | Default page canvas for the design section; all text and labels render as #111111 on it |
| 2 | Carbon | `#111111` | Inverted canvas for the film section; all text and labels render as #ffffff on it |

## Imagery

No imagery whatsoever — the site is pure typography. There are no photographs, illustrations, product screenshots, project thumbnails, icons, or decorative graphics. Every visual decision is made through type, color inversion, and spatial rhythm. Even the contact email in the nav is rendered as raw text rather than an icon. The absence of imagery is the defining visual language: the work itself is the portfolio, and the typography asks you to recognize the names.

## Layout

The page is a vertical scroll of full-bleed sections that alternate between white and near-black surfaces. There is no traditional hero — the viewport opens directly onto the distributed top nav, then immediately into a left-aligned list of project names. Each section begins with a tiny wide-tracked label ('Design', 'Film') followed by a stack of oversized project names pinned to the left margin. Content is asymmetric and left-aligned throughout; there is no centered text, no right rail, no grid columns. The nav itself is the only horizontal layout decision, and it uses space-between to push four text items to the four edges of the viewport. Section breaks are created entirely by surface color inversion — there are no dividers, rules, or extra spacing between sections beyond the 104px internal padding. The overall density is extremely sparse: one or two text elements per viewport height, with vast areas of negative space.

## Agent Prompt Guide

## Quick Color Reference
- background (light): #ffffff
- background (dark): #111111
- text (on light): #111111
- text (on dark): #ffffff
- border: #2b2b2b
- accent: none (monochrome system)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Distributed top nav**: Full-width horizontal row at the top of the page, 40px padding from the viewport edges. Four text items pushed to the far edges with space-between justification. Items use Diatype 500 at 26px, color #111111. The leftmost item (owner name) is weight 700; the remaining three items are weight 500.

2. **Section label**: Small wide-tracked marker text reading 'Design' or 'Film'. Set in New Grotesk 600, ~12-14px, letter-spacing 0.069em, color #111111 on a white background. Sits 40-56px above the first project name in the list below it.

3. **Oversized project name**: Text block pinned to the left margin, font Teg 500, 86px, line-height 1.04, letter-spacing -0.033em, color #111111. No underline, no hover state, no surrounding card — the name sits directly on the white canvas with zero decoration.

4. **Full-bleed dark section**: A section that fills the entire viewport width with background #111111. Internal padding is 104px top and bottom, 40px left. All text within inverts to #ffffff. The section contains the same label-plus-list structure as the light sections, with no visual transition or divider from the preceding white section.

5. **Project list stack**: A vertical column of project names in alternating sizes — some at 86px in Teg 500/600, others at 58px in Beatricedisplay 500/600. Each name is on its own line with 0-4px vertical gap between lines so the names nearly touch, reading as a continuous typographic wall.

## Similar Brands

- **Manual (manual.co)** — Same text-as-portfolio philosophy with oversized project names stacked on a near-empty canvas
- **Rauno Freiberg (raunofreiberg.com)** — Single-column left-aligned typography, monochrome palette, no imagery, work presented as a typographic list
- **Frank Chimero** — Editorial manuscript feel with generous whitespace and typography carrying all visual weight
- **Bret Victor** — Extreme typographic restraint, text-only page structure, content density expressed through size jumps rather than imagery

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-plaster-white: #ffffff;
  --color-carbon: #111111;
  --color-ink-black: #000000;
  --color-graphite: #2b2b2b;

  /* Typography — Font Families */
  --font-teg: 'Teg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-beatrice-display: 'Beatrice Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-beatrice: 'Beatrice', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-new-grotesk: 'New Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 26px;
  --leading-caption: 1.15;
  --text-heading: 58px;
  --leading-heading: 1.05;
  --tracking-heading: -0.17px;
  --text-display: 86px;
  --leading-display: 1.04;
  --tracking-display: -2.84px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 104px;
  --card-padding: 0px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-none: 0px;

  /* Surfaces */
  --surface-plaster-white: #ffffff;
  --surface-carbon: #111111;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-plaster-white: #ffffff;
  --color-carbon: #111111;
  --color-ink-black: #000000;
  --color-graphite: #2b2b2b;

  /* Typography */
  --font-teg: 'Teg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-beatrice-display: 'Beatrice Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-beatrice: 'Beatrice', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-new-grotesk: 'New Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 26px;
  --leading-caption: 1.15;
  --text-heading: 58px;
  --leading-heading: 1.05;
  --tracking-heading: -0.17px;
  --text-display: 86px;
  --leading-display: 1.04;
  --tracking-display: -2.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-104: 104px;
}
```
