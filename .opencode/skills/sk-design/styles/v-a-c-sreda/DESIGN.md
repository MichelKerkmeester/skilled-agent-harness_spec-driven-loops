# V–A–C Sreda — Style Reference
> white-cube exhibition diagram — pencil-thin connectors link floating type against a white field, like a curator's wall label meets a constellation chart

**Theme:** light

V–A–C Sreda reads as a white-cube exhibition catalog translated into the browser: pure black ink on a white field, with thin dotted and dashed lines connecting headlines, captions, and navigation arrows like a hand-drawn constellation map. The composition is deliberately diagrammatic — type elements sit at variable positions linked by hairline rules rather than sitting inside conventional containers, and every UI surface is borderless and shadowless. Typography does all the structural work through two custom faces (Diagramatika Display for oversized markers, Diagramatika Text for prose), both held at weight 400, which keeps the system flat, editorial, and resistant to visual decoration. Color is never used as ornament; the only chromatic role is the faint #999999 that recedes for helper metadata. Density is comfortable and the rhythm is generous, with content floating in white space and connected by ruled connectors rather than boxed into cards or panels.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, and the only background color used across the system |
| Pencil Gray | `#999999` | `--color-pencil-gray` | Faded helper text and secondary metadata — recedes so primary content carries weight |

## Tokens — Typography

### Diagramatika Display — Oversized display headlines and landmark letters (the 80px V–A–C spread) — a custom geometric face held at weight 400, so the monumental size carries presence without bold weight, letting the letterforms do the work. Substitute: Space Grotesk or any wide geometric sans. · `--font-diagramatika-display`
- **Substitute:** Space Grotesk
- **Weights:** 400
- **Sizes:** 16px, 24px, 48px, 80px
- **Line height:** 0.80, 1.20
- **Letter spacing:** normal
- **Role:** Oversized display headlines and landmark letters (the 80px V–A–C spread) — a custom geometric face held at weight 400, so the monumental size carries presence without bold weight, letting the letterforms do the work. Substitute: Space Grotesk or any wide geometric sans.

### Diagramatika Text — Body prose, captions, navigation labels, and secondary headings — pairs with Display at a more human scale, keeping a single weight across the system. Substitute: Inter or Söhne. · `--font-diagramatika-text`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 16px, 20px, 24px
- **Line height:** 0.9–1.2
- **Role:** Body prose, captions, navigation labels, and secondary headings — pairs with Display at a more human scale, keeping a single weight across the system. Substitute: Inter or Söhne.

### Arial — Falls back for form controls and button labels where the custom face is unavailable; stays at weight 400 to preserve the flat typographic voice. · `--font-arial`
- **Substitute:** Helvetica
- **Weights:** 400
- **Sizes:** 13px, 20px
- **Line height:** 1.20
- **Role:** Falls back for form controls and button labels where the custom face is unavailable; stays at weight 400 to preserve the flat typographic voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body-sm | 16px | 1.2 | — | `--text-body-sm` |
| body | 20px | 1.2 | — | `--text-body` |
| subheading | 24px | 1.1 | — | `--text-subheading` |
| heading | 48px | 0.8 | — | `--text-heading` |
| display | 80px | 0.8 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 20 | 20px | `--spacing-20` |
| 26 | 26px | `--spacing-26` |
| 48 | 48px | `--spacing-48` |
| 50 | 50px | `--spacing-50` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 48-50px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Constellation Connector
**Role:** Hairline dotted or dashed line linking separate type elements across the canvas — replaces conventional section dividers, card borders, and visual grouping

1px stroke in #000000, either dotted (1px on, 4px off) or dashed (4px on, 4px off). Used to link a headline to a caption, a language toggle to a logo, or a navigation arrow to its label. No padding, no border, no radius — the line is the component.

### Diagrammatic Heading
**Role:** Oversized display title for landmark content blocks — the visual anchor of a section

Diagramatika Display at 80px / line-height 0.8, weight 400, #000000. Often accompanied by a small 'fig 1'–style caption in Diagramatika Text at 13px in Pencil Gray. Anchored to the canvas by a dotted connector running to a secondary label.

### Arrow Navigation
**Role:** Tri-directional content entry (Read / Watch / Listen) placed along a horizontal axis with connector lines

Diagramatika Text at 24px weight 400, #000000. Arrow glyphs (←, ↓, →) sit inline with the label. Beneath each label, a Pencil Gray #999999 caption at 13px ('till 22 April') provides temporal context. Separated from each other by dashed rules rather than borders or buttons.

### Language Toggle
**Role:** Minimal two-option locale switcher (Ru / En) integrated into the diagrammatic field

Diagramatika Text 16px weight 400, #000000. Options separated by a forward slash with generous spacing. No background, no border — a pure text control connected to neighboring elements by a dotted line.

### Outlined Action Border
**Role:** The only interactive visual treatment in the system — used for clickable text links and outlined controls

1px solid #000000 border or underline, 0px radius, no fill. ACTION_BORDER evidence shows #000000 used as a link/outline border 36 times. No filled buttons exist in this system — actions are signaled by rule and weight alone.

### Editor Caption
**Role:** Small-scale metadata for figure numbers, dates, and editorial notes

Diagramatika Text or Arial at 13px, line-height 1.2, color Pencil Gray #999999. Sits beneath or beside a primary element, connected by a dotted line if a visual link is needed.

### Body Prose Block
**Role:** Long-form editorial copy in the magazine's main reading column

Diagramatika Text at 20px, line-height 1.2, weight 400, #000000. No max-width container; the block flows in the natural reading column with 20px column gap. No drop cap, no indent, no decorative rule above or below.

### Cookie Notice
**Role:** Dismissable utility bar anchored to the bottom of the viewport

Pill or rectangular surface in #000000 fill or border, white or black text, Diagramatika Text 13–16px. Includes a small × close affordance. Sits as a flat overlay without shadow or backdrop blur.

### Inverted Media Band
**Role:** Full-bleed dark surface for embedded video, images, or featured content — the only departure from the white canvas

Background #000000, spans full viewport width regardless of page max-width. Internal type remains Diagramatika Text in #ffffff when captioning is needed. No border, no radius, no shadow — a clean tonal flip from paper to ink.

### Section Anchor Label
**Role:** Small uppercase-or-mixed-case marker placed at the start of a diagrammatic section, tied to the heading by a dashed rule

Diagramatika Text 16–20px weight 400, #000000, positioned at the left margin with a dashed connector extending to the right toward the section title.

## Do's and Don'ts

### Do
- Hold every type element at weight 400 — never introduce 600 or 700, the system's authority comes from size and white space, not boldness
- Use 0px border-radius on all elements — cards, buttons, tags, and inputs must read as sharp printed plates on the white field
- Connect related type elements with 1px dotted (#000000) or dashed rules instead of enclosing them in boxes or cards
- Reserve #999999 exclusively for captions, figure numbers, dates, and metadata that should recede behind primary copy
- Let the white field breathe — use 48–50px section padding and 20px element gaps to preserve the gallery-wall density
- Anchor oversized Diagramatika Display headings (48–80px) with small figure captions in Pencil Gray to preserve the diagrammatic voice
- Use #000000 as an outlined/ghost action border (1px solid) rather than ever filling a button — the system has no filled CTA

### Don't
- Do not introduce any chromatic color — no brand blue, no accent red, no gradients; the system is deliberately achromatic
- Do not apply box-shadow, blur, or any elevation — the field is intentionally flat
- Do not use rounded corners on any surface — 0px radius is structural, not optional
- Do not use bold or semibold weights to create hierarchy — scale size, change family (Display vs Text), or add space instead
- Do not enclose text in bordered cards or panel containers — separate zones with dotted/dashed rules and white space
- Do not use filled background buttons for actions — use text labels with outlined borders or underline rules
- Do not place body copy inside a constrained max-width container if a flowing column reads better — the system is full-bleed and diagram-shaped

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper Canvas | `#ffffff` | Base page background — the entire system sits on this single white field |
| 2 | Ink Plane | `#000000` | Inverted surface used for occasional full-bleed media bands or footer blocks |

## Elevation

No shadows, no blur, no glow. The system deliberately refuses three-dimensional depth — hierarchy is built through type scale, white space, and the dotted/dashed connector rules rather than stacked surfaces or raised cards. Every element sits flat on the white field at the same z-depth.

## Imagery

The page is almost entirely typographic and diagrammatic — no photography, illustration, or decorative graphics. The only visual media is a single full-bleed black band at the bottom of the page, likely an embedded video or image plate, which acts as a tonal inversion of the white canvas rather than a styled image component. There are no icons in the conventional sense; arrow glyphs (← ↓ →) are set in the body type and function as both navigation and visual punctuation. The 'fig 1' label and dotted connector lines function as a self-aware meta-illustration, telling the reader they are looking at a designed diagram, not a conventional web page.

## Layout

Full-bleed layout with no max-width constraint — content floats across the entire viewport, with major type elements positioned at deliberate coordinates (the V–A–C letters spread to the left, center, and right edges) and connected by hairline rules. The hero section is a constellation map: oversized display letters, a small 'fig 1' caption, a language toggle, the 'Sreda' wordmark, and a body description arranged asymmetrically and linked by dotted/dashed connector lines rather than sitting inside a conventional centered column. Below, a horizontal tri-navigation (Read / Watch / Listen) sits on a single axis separated by dashed rules, with a small downward arrow acting as a scroll indicator. Section rhythm is defined by generous 48–50px vertical gaps and full-width white space between elements, with the only tonal break being the black media band that appears later in the scroll. Navigation is minimal — no sticky header, no top bar, no sidebar; the language toggle and section markers are inline with the diagrammatic field.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000
- muted text / metadata: #999999
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Create a diagrammatic hero: white #ffffff background. A 80px Diagramatika Display weight 400 letter at the left edge, a 13px 'fig 1' caption in #999999 Diagramatika Text positioned above and to the right, connected to the letter by a 1px dotted #000000 line. A 'Ru / En' language toggle in 16px Diagramatika Text, #000000, anchored to the left margin.

2. Create a section heading: 48px Diagramatika Display weight 400 in #000000, line-height 0.8, with a 1px dashed #000000 rule extending horizontally to the right connecting it to a 20px Diagramatika Text label in #000000. No border, no background, no shadow.

3. Create a body prose block: Diagramatika Text 20px weight 400, #000000, line-height 1.2, no max-width, flowing in the natural reading column. 26px margin-bottom to separate from the next block. No borders or backgrounds.

4. Create a tri-navigation row: three items (Read / Watch / Listen) on a single horizontal axis, each in 24px Diagramatika Text weight 400 #000000, with an arrow glyph (← ↓ →) inline. Beneath each, a 13px Pencil Gray #999999 caption ('till 22 April'). Items separated by 1px dashed #000000 rules extending vertically. 0px radius on all elements.

5. Create an outlined ghost link: Diagramatika Text 20px weight 400, #000000 text, wrapped in a 1px solid #000000 border with 0px radius, 20px horizontal padding, 10px vertical padding. No background fill. On hover, the fill inverts to #000000 with #ffffff text.

## Similar Brands

- **ICA (Institute of Contemporary Arts)** — Same editorial-gallery voice — black-on-white type, generous white space, and a refusal of decorative color or rounded UI chrome
- **e-flux Architecture** — Diagrammatic type-and-rule composition with custom sans serifs, hairline connectors, and zero decorative imagery
- **M+ Museum (Hong Kong)** — Full-bleed white canvas with oversized custom display type, flat surfaces, and no shadows or gradients
- **Rhizome** — Austere editorial layout with pure black-on-white type, monolinear links, and generous breathing room between sparse content blocks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-pencil-gray: #999999;

  /* Typography — Font Families */
  --font-diagramatika-display: 'Diagramatika Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diagramatika-text: 'Diagramatika Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --text-body: 20px;
  --leading-body: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --text-heading: 48px;
  --leading-heading: 0.8;
  --text-display: 80px;
  --leading-display: 0.8;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-48: 48px;
  --spacing-50: 50px;

  /* Layout */
  --section-gap: 48-50px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-ink-plane: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-pencil-gray: #999999;

  /* Typography */
  --font-diagramatika-display: 'Diagramatika Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diagramatika-text: 'Diagramatika Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --text-body: 20px;
  --leading-body: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --text-heading: 48px;
  --leading-heading: 0.8;
  --text-display: 80px;
  --leading-display: 0.8;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-48: 48px;
  --spacing-50: 50px;
}
```
