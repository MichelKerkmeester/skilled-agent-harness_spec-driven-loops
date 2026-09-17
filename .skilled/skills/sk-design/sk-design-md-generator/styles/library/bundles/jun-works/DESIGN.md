# jun.works — Style Reference
> printed editorial zine with sticker labels — black ink on bright white, nothing else

**Theme:** light

jun.works is a monochrome editorial manifest — pure black ink on white paper, no accent colors, no gradients, no imagery. The entire visual identity collapses into two ideas: a custom display sans (Standard) set at 45–54px with aggressive negative tracking, and a system serif (Times) for body at small size, creating a headline-vs-zine tension. Every interactive element is a fully rounded pill (129.6px radius) with a 1px black border, giving the page the feeling of a printed page covered in adhesive labels. The layout is left-anchored and two-columned, generous but dense, treating the portfolio as a typographic specimen rather than a product page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Press Black | `#000000` | `--color-press-black` | Body text, all borders, pill outlines, button strokes — the sole ink color, used at full opacity for every foreground element |
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, card surfaces, pill fills — the only surface color, creating maximum contrast against Press Black |
| Smoke Gray | `#cccccc` | `--color-smoke-gray` | Hairline dividers, muted outlines, secondary borders where a softer separation is needed |

## Tokens — Typography

### Standard — Display and heading type only — a custom geometric sans used at two large sizes with extreme negative tracking (-0.045em to -0.054em). Also sets link and button text. The single weight (400) and tight tracking create a compressed, poster-like presence that dominates the page. No bold variant exists; hierarchy is achieved through size and tracking alone. · `--font-standard`
- **Substitute:** Inter Tight 400, or NB International Pro Regular
- **Weights:** 400
- **Sizes:** 45px, 54px
- **Line height:** 1.12–1.70
- **Letter spacing:** -0.0540em, -0.0450em
- **Role:** Display and heading type only — a custom geometric sans used at two large sizes with extreme negative tracking (-0.045em to -0.054em). Also sets link and button text. The single weight (400) and tight tracking create a compressed, poster-like presence that dominates the page. No bold variant exists; hierarchy is achieved through size and tracking alone.

### Times — Body and micro-copy type — the system serif at 13px, used in editorial contexts (footnotes, annotations, fine print). The serif/sans collision with Standard is deliberate: the sans shouts, the serif footnotes. · `--font-times`
- **Substitute:** Times New Roman, or any system serif
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Body and micro-copy type — the system serif at 13px, used in editorial contexts (footnotes, annotations, fine print). The serif/sans collision with Standard is deliberate: the sans shouts, the serif footnotes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| heading | 45px | 1.15 | -2.025px | `--text-heading` |
| display | 54px | 1.12 | -2.916px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 13 | 13px | `--spacing-13` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 26 | 26px | `--spacing-26` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 129.6px |
| links | 129.6px |
| pills | 129.6px |
| buttons | 129.6px |

### Layout

- **Section gap:** 52px
- **Card padding:** 19px
- **Element gap:** 13px

## Components

### Pill Button
**Role:** All clickable actions — nav toggles, social links, CTAs

129.6px border-radius, 1px solid #000000 border, #ffffff fill, #000000 text. Padding approximately 5px top, 3px bottom, 18px right, 19px left. Uses Standard font. The pill shape is universal — no rounded rectangles, no sharp corners on any interactive element.

### Pill Section Label
**Role:** Category headers like 'Service', 'Clients', 'Recognition'

Same pill geometry as buttons: 129.6px radius, 1px #000000 border, white fill, white text on a #000000 filled version (inverted). The label sits above its content list as a visual anchor. Uses Standard font at heading size.

### Display Heading
**Role:** Page-level statements and paragraph introductions

Standard font, 45–54px, weight 400, letter-spacing -0.045em to -0.054em. Line-height 1.12–1.15. Single weight only — no bold, no italic. The tight tracking makes the letterforms nearly touch.

### Body Paragraph
**Role:** Primary prose content — bio text, descriptions

Times serif, normal letter-spacing, generous line-height (~1.70). Left-aligned, no max-width constraint — text runs as far as content demands.

### Dashed List Item
**Role:** Service offerings, client names, recognition entries

Standard font at heading size, each line prefixed with an em-dash (—). No bullets, no markers — just the typographic dash acting as a list indicator. Lines stack with 13px vertical gap.

### Footnote Link
**Role:** Superscript annotations referencing email, social, etc.

Small superscript numbers in Times serif, linking to pill-shaped contact buttons. The footnote-to-pipeline pattern mimics academic citations.

### Social Pill Row
**Role:** External profile links (LinkedIn, Instagram, Soot, Behance)

Horizontal row of pill buttons, each 129.6px radius, 1px #000000 border, white fill. 13px gap between pills. Uses Standard font.

### Logo Lockup
**Role:** Brand mark at top-left of page

'jun.works™' set in Standard at display size with tight tracking. The ™ superscript is inline. No icon, no symbol — the wordmark is the logo.

### Hamburger Toggle
**Role:** Menu trigger at top-right

Two horizontal black lines, equal length, 1px weight. Positioned at the top-right corner, opposite the logo lockup. Minimal — no border, no pill, no label.

### Two-Column Content Grid
**Role:** Service/Clients/Recognition layout

Two equal columns with ~26px horizontal padding per column. Each column headed by a Pill Section Label. Content stacks vertically with 13px gaps between dashed list items.

## Do's and Don'ts

### Do
- Use 129.6px border-radius on every interactive element — no rectangles, no modest rounding
- Set all display text in Standard at 45–54px with -0.045em to -0.054em letter-spacing
- Render body text in Times serif with ~1.70 line-height for editorial breathing room
- Anchor all content to the left edge — no centering, no max-width containers
- Prefix list items with an em-dash (—) instead of bullets or numbers
- Use #000000 for all borders, text, and outlines — never introduce color
- Maintain #ffffff backgrounds everywhere; let the 1px black border define shape, not fill

### Don't
- Never add color — no accent, no semantic green/red/yellow, no brand color
- Never use box-shadow or elevation — depth comes from border definition, not shadow
- Never use border-radius below 129.6px on any element
- Never bold the display type — Standard ships in one weight (400) and that restraint is the system
- Never use a sans-serif for body text — the serif/sans split is structural, not optional
- Never center-align headings or body paragraphs
- Never add imagery, photography, or illustration — the page is pure typography and label geometry

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-bleed page background |
| 1 | Pill Surface | `#ffffff` | Interior of every pill-shaped element (buttons, links, section labels) — white fill on white canvas so only the black outline defines the shape |

## Elevation

Zero elevation. No shadows, no blur, no depth effects. Form is defined entirely by 1px black outlines on white surfaces. The design treats the screen as a flat printed page where only ink and paper exist.

## Imagery

No imagery of any kind. The site contains zero photographs, illustrations, icons, or graphics. The visual language is entirely typographic — the custom display sans, the system serif body, the pill-shaped outlined labels, and the em-dash list markers carry all visual interest. The page reads as a typographic specimen or printed editorial spread.

## Layout

Full-bleed left-anchored layout with no max-width constraint. The top of the page is a single column: logo top-left, hamburger top-right, followed by a display heading and a multi-paragraph bio in Times serif. Below the bio, content shifts to a two-column grid where the left column holds 'Service' and the right column holds 'Clients', each headed by a pill-shaped inverted label. A 'Recognition' section follows in the same two-column structure. Social link pills sit at the bottom-left as a horizontal row. Sections are separated by ~52px vertical gaps. The overall rhythm is: big display statement → dense editorial paragraph → structured two-column label-and-list → social links, with no decorative dividers or section backgrounds.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border: #000000
- muted border: #cccccc
- accent: none
- primary action: no distinct CTA color

3-5 Example Component Prompts:
1. Create a display heading: 'Selected Work' in Standard font, 54px, weight 400, #000000, letter-spacing -2.916px (or -0.054em). Line-height 1.12. Left-aligned, no margin.

2. Create a pill-shaped navigation button: 1px solid #000000 border, #ffffff fill, 129.6px border-radius, padding 5px 18px 3px 19px. Label text in Standard font, #000000. No shadow, no gradient.

3. Create a two-column service list: Left column headed by an inverted pill label ('Service' — #000000 fill, #ffffff text, 129.6px radius), followed by lines prefixed with em-dash (—) in Standard font at 45px. Right column mirrors with 'Clients' label and client names. 26px horizontal padding per column, 13px vertical gap between items.

4. Create a body paragraph: Times serif, ~1.70 line-height, #000000, left-aligned, running edge-to-edge with no max-width. Use normal letter-spacing.

5. Create a social link pill row: horizontal flex of 4 pills, each with 129.6px radius, 1px #000000 border, white fill. Labels: 'LinkedIn', 'Instagram', 'Soot', 'Behance' in Standard font. 13px gap between pills.

## Similar Brands

- **Pentagram (pentagram.com)** — Same monochrome editorial approach with left-anchored type, two-column structured lists, and zero decorative imagery — the portfolio IS the typography
- **David Carson design archives** — Editorial deconstruction aesthetic where the serif/sans collision, extreme tracking, and lack of color create a printed-page-on-screen feeling
- **Hato Press (hatopress.com)** — Minimal typographic identity with pill-shaped elements, black-on-white palette, and the sense that you're looking at a printed specimen rather than a website
- **Tobias Frere-Jones studio page** — Type designer portfolio treatment — the page functions as a typographic resume with label-pill section markers and Times serif body text

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-press-black: #000000;
  --color-bone-white: #ffffff;
  --color-smoke-gray: #cccccc;

  /* Typography — Font Families */
  --font-standard: 'Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-heading: 45px;
  --leading-heading: 1.15;
  --tracking-heading: -2.025px;
  --text-display: 54px;
  --leading-display: 1.12;
  --tracking-display: -2.916px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-13: 13px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-26: 26px;

  /* Layout */
  --section-gap: 52px;
  --card-padding: 19px;
  --element-gap: 13px;

  /* Border Radius */
  --radius-full: 129.6px;

  /* Named Radii */
  --radius-cards: 129.6px;
  --radius-links: 129.6px;
  --radius-pills: 129.6px;
  --radius-buttons: 129.6px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-pill-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-press-black: #000000;
  --color-bone-white: #ffffff;
  --color-smoke-gray: #cccccc;

  /* Typography */
  --font-standard: 'Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-heading: 45px;
  --leading-heading: 1.15;
  --tracking-heading: -2.025px;
  --text-display: 54px;
  --leading-display: 1.12;
  --tracking-display: -2.916px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-13: 13px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-26: 26px;

  /* Border Radius */
  --radius-full: 129.6px;
}
```
