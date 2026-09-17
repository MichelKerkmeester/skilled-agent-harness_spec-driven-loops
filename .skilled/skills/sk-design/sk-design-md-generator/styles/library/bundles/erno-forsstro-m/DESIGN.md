# Erno Forsström — Style Reference
> editorial gallery on warm paper

**Theme:** light

A personal design director's portfolio built on radical editorial restraint: a warm off-white canvas, a single weight of a single grotesque typeface, and near-black ink for everything typographic. The page behaves like a printed monograph — generous margins, tight tracking, lines of body text that sit close together while the display headline compresses to a 0.93 line-height so ascenders and descenders nearly touch. The chrome is essentially invisible: a three-word header, hairline section dividers, project labels in the same size as the body. Color and shadow are absent by design; the only chromatic information comes from the photographic work itself, which sits as full-bleed dark imagery against the warm paper. Hierarchy is built exclusively through scale, tracking, and the dramatic jump from 21px to 58px.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#202020` | `--color-ink` | Body text, headings, project titles, hairline borders, and the bottom edge of links — a soft near-black that reads as flat black at body sizes but never goes dead 000 |
| Bone | `#dfdcdc` | `--color-bone` | Page canvas and the implicit surface for every project card — a warm off-white with just enough gray to feel like paper, not a screen |
| Ash | `#cdcecf` | `--color-ash` | Hairline divider tone that sits one step darker than the canvas to register as a visible rule without becoming a hard line |

## Tokens — Typography

### NB Akademie Pro — The only font in the system, used at a single weight across every role. 58px at 0.93 line-height carries the hero — lines overlap slightly, creating editorial density. 43px at 1.10 serves medium section heads. 21px at 1.33 is the body, nav, labels, and project metadata — a single typographic voice at conversational size. The 'tnum' feature is active sitewide, forcing tabular figures in any year label or date. · `--font-nb-akademie-pro`
- **Substitute:** Inter (free) or Söhne (paid) — both share the geometric grotesque character; Inter is the closest free option
- **Weights:** 400
- **Sizes:** 21px, 43px, 58px
- **Line height:** 0.93 / 1.10 / 1.33
- **Letter spacing:** -0.0500em at 58px (-2.9px), -0.0270em at 43px (-1.16px), -0.0150em at 21px (-0.32px) — tracking tightens as size grows, the inverse of browser defaults
- **OpenType features:** `"tnum"`
- **Role:** The only font in the system, used at a single weight across every role. 58px at 0.93 line-height carries the hero — lines overlap slightly, creating editorial density. 43px at 1.10 serves medium section heads. 21px at 1.33 is the body, nav, labels, and project metadata — a single typographic voice at conversational size. The 'tnum' feature is active sitewide, forcing tabular figures in any year label or date.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 21px | 1.33 | -0.32px | `--text-body` |
| heading | 43px | 1.1 | -1.16px | `--text-heading` |
| display | 58px | 0.93 | -2.9px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 31 | 31px | `--spacing-31` |
| 42 | 42px | `--spacing-42` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 0px
- **Element gap:** 18px

## Components

### Tri-Column Header
**Role:** Persistent site navigation

Three inline groups on a single row: name at left, discipline label centered, two text links (Works, About) at right. Set in 21px NB Akademie Pro at 1.33 line-height with -0.32px tracking — the same size as body copy, never a different 'nav' style. No background, no border, no logo mark. The three groups are justified across the full content width.

### Hero Headline Block
**Role:** Opening statement on the home page

Left-aligned paragraph set at 58px / 0.93 line-height / -2.9px letter-spacing in Ink (#202020). Occupies roughly 70% of the content width. The tight line-height causes descenders to brush the cap-height of the line below — an editorial, typeset-on-paper quality, not a UI choice. No drop cap, no accent color, no accompanying image or button.

### Section Heading Label
**Role:** Introduces a content band (e.g. 'Featured', '2018–2020')

21px NB Akademie Pro in Ink, left-aligned, sitting flush with the left edge of the content column. Same size as body — the label is distinguished only by position and by being the only text in its row, never by weight or color. A hairline horizontal rule in Ash (#cdcecf) typically follows beneath.

### Project Card (Featured)
**Role:** Hero project entry in the featured band

Full-width image block (no border, no radius, no shadow) followed by a 18px gap, then the project title in 21px Ink, then a 8px gap, then a one-line descriptor in 21px Ink. Image edge meets content edge — no card surface, no padding, no background fill. The dark photography itself is the visual container.

### Project Card (Grid)
**Role:** Standard two-up project entry

Rectangular image filling half the content width with 18px column gap between siblings. Zero radius, zero border, zero shadow. Title and one-line label stack below the image in 21px Ink with the same 8px / 18px internal rhythm as the featured card. The grid sits inside the same content column as the hero text — the label 'Featured' on the left aligns with the first image's left edge.

### Hairline Divider
**Role:** Marks the end of a content section

A 1px horizontal line in #cdcecf (Ash), full content width, with roughly 42px of space above and 31px below. No ornament, no icon, no 'see more' link. The rule is the only structural signal between sections.

### Period Label
**Role:** Date range heading for a chronological grouping (e.g. '2018–2020')

Set in the display size 58px / 0.93 / -2.9px in Ink, but acting as a section label rather than a paragraph. Left-aligned to the content edge. The en-dash uses a real em/en dash character, not a hyphen.

### Inline Text Link
**Role:** Navigation between pages (Works, About, project titles)

Plain text in Ink with no underline by default. On hover or when active, a bottom border in #202020 appears — the only interactive affordance in the system. No color change, no weight change, no background fill. The border is the button.

## Do's and Don'ts

### Do
- Use NB Akademie Pro (or Inter as substitute) at weight 400 for every text element — never introduce a second weight or a second family
- Set the hero headline at 58px with line-height 0.93 and letter-spacing -2.9px so lines physically overlap
- Keep the canvas at #dfdcdc and ink at #202020 — the warm off-white is a brand choice, not a fallback
- Let project images sit edge-to-edge with the content column: zero radius, zero border, zero shadow
- Separate sections with a 1px hairline in #cdcecf rather than background-color changes or extra whitespace bands
- Use the 21px body size for nav, labels, titles, and metadata — hierarchy is built from size jumps (21 → 43 → 58), not from weight or color
- Activate tabular numerals ("tnum") site-wide so year labels and dates align on the decimal

### Don't
- Don't add a CTA button, a colored accent, or a filled background — this system has no primary action surface
- Don't round image corners, add drop shadows, or apply any elevation to project cards
- Don't introduce a second typeface, a serif companion, or a different weight of NB Akademie Pro
- Don't use white (#ffffff) as the canvas — #dfdcdc is the signature warm paper tone
- Don't break the three-size type scale (21 / 43 / 58) with intermediate steps; the gap between sizes is the hierarchy
- Don't underline links by default — use the bottom border in #202020 only on hover/active to signal interaction
- Don't add gradients, colored badges, tags, or status pills — the system is strictly two-color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone | `#dfdcdc` | Page canvas — every project card, image, and text block sits directly on this warm off-white surface; there is no card surface above it |

## Elevation

The system uses zero shadows and zero stacked surfaces. Elevation is implied only by hairline borders and by full-bleed dark photography breaking through the warm canvas. Project images are the only 'elevated' elements, and they achieve their separation through tonal contrast (near-black photo on warm paper), never through box-shadow or background fill.

## Imagery

Full-bleed editorial photography — fashion editorials, brand campaigns, and digital product shots, almost all set against dark or near-black backgrounds. The photography is the only source of color and texture in the system; the surrounding page is a monochrome frame around it. Images are always rectangular with sharp corners, cropped tight to the subject, and sized large enough to dominate their band. No illustrations, no icons, no decorative graphics, no video. The visual language is 'printed monograph meets fashion lookbook' — high production value, no lifestyle context, the artifact is the hero.

## Layout

Max-width contained at roughly 1280px, with the header and section labels justified to the same left edge as the hero paragraph. The header is a single row of three groups (name | discipline | Works / About) with no background. Below the hero, a hairline rule introduces the 'Featured' band, which is a single full-width project image followed by title and label, then a two-column grid of additional project images with an 18px column gap. Subsequent chronological bands (e.g. '2018–2020') repeat the same structure: large period label, hairline rule, project images. Content density is low and the page breathes — roughly 80px between major sections, with the dark imagery providing visual punctuation against the warm, quiet canvas. No sidebar, no sticky nav, no footer chrome visible above the fold.

## Agent Prompt Guide

**Quick Color Reference**
- text: #202020
- background: #dfdcdc
- border: #cdcecf (hairline), #202020 (link active state)
- accent: none
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Hero headline paragraph*: Bone (#dfdcdc) canvas. Text at 58px NB Akademie Pro weight 400, color #202020, line-height 0.93, letter-spacing -2.9px. Left-aligned, occupying roughly 70% of the 1280px content width. No accompanying image, no button, no border.

2. *Project card (two-up grid)*: Image filling half the content width, zero border-radius, zero shadow, sitting directly on the #dfdcdc canvas with 18px column gap to the next card. Below the image: title in 21px NB Akademie Pro #202020, then 8px gap, then one-line label in 21px #202020.

3. *Tri-column header*: Single row with three inline groups at 21px NB Akademie Pro weight 400, color #202020, line-height 1.33, letter-spacing -0.32px. Left group: name. Center group: discipline label. Right group: two text links (Works, About). No background, no border, no logo.

4. *Section divider*: 1px horizontal line in #cdcecf spanning the full content width, with 42px space above and 31px space below. No label, no icon, no ornament.

5. *Period label*: Set in 58px NB Akademie Pro #202020, line-height 0.93, letter-spacing -2.9px — the same display treatment as the hero, but acting as a section heading (e.g. '2018–2020'). Left-aligned to the content edge. Use a real en-dash, not a hyphen.

## Similar Brands

- **Pentagram partner sites** — Same editorial restraint — single typeface, generous margins, dark photography on warm off-white, zero decorative chrome
- **Manual (manual.co)** — Personal portfolio language with the same single-weight grotesque and monochrome canvas, with color appearing only inside project imagery
- **Studio Dumbar** — Display-type-led hierarchy with tight tracking and paper-like backgrounds, no UI buttons or accent colors
- **are.na** — Same instinct for a quiet, monochrome frame around content-rich imagery — the page disappears so the work can speak
- **Cargo portfolio sites** — Editorially spaced grid layouts with full-bleed project images and minimal text chrome, typographic hierarchy from size alone

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #202020;
  --color-bone: #dfdcdc;
  --color-ash: #cdcecf;

  /* Typography — Font Families */
  --font-nb-akademie-pro: 'NB Akademie Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 21px;
  --leading-body: 1.33;
  --tracking-body: -0.32px;
  --text-heading: 43px;
  --leading-heading: 1.1;
  --tracking-heading: -1.16px;
  --text-display: 58px;
  --leading-display: 0.93;
  --tracking-display: -2.9px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-31: 31px;
  --spacing-42: 42px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 0px;
  --element-gap: 18px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone: #dfdcdc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #202020;
  --color-bone: #dfdcdc;
  --color-ash: #cdcecf;

  /* Typography */
  --font-nb-akademie-pro: 'NB Akademie Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 21px;
  --leading-body: 1.33;
  --tracking-body: -0.32px;
  --text-heading: 43px;
  --leading-heading: 1.1;
  --tracking-heading: -1.16px;
  --text-display: 58px;
  --leading-display: 0.93;
  --tracking-display: -2.9px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-31: 31px;
  --spacing-42: 42px;
}
```
