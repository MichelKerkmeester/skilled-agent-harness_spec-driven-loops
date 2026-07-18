# Haley Park — Style Reference
> Illuminated manuscript on forest vellum

**Theme:** dark

A personal portfolio system built on a dark forest-green manuscript — the page reads like a hand-illuminated codex rather than a website. The entire interface lives inside a single chromatic mood: deep pine canvas (#143930), warm parchment text (#f8f2de), and a sage structural accent (#456859) for line work and iconography. Typography stays in the weight-200 whisper range across a curated family of editorial serifs, with one display cut (Wispy, 96px) used as a single monumental name treatment. Decorative gothic architecture — rose windows, arches, intersecting plus-signs at line junctions — bleeds through the layout as full-width structural pattern rather than ornament. No drop shadows, no gradients, no rounded cards; the system draws its depth from line weight, the cream-on-green contrast pair (11.3:1), and the disciplined rhythm of thin horizontal rules with terminal crosses.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pine Vellum | `#143930` | `--color-pine-vellum` | Page canvas, all section backgrounds, box-shadow tint for the only subtle elevation present |
| Cedar Stroke | `#456859` | `--color-cedar-stroke` | Stroke color for background architectural illustrations, icon outlines, sage decorative line art, secondary borders |
| Parchment | `#f8f2de` | `--color-parchment` | Primary text, link text, outlined button borders, heading characters, and the full suite of hairline rules and dividers |
| Aged Tan | `#bead89` | `--color-aged-tan` | Muted secondary text and metadata labels (project years, category tags) — sits between parchment and the background, a quieter tertiary |

## Tokens — Typography

### EditorialOld — Primary editorial serif — runs the entire information layer: navigation links, project titles, body paragraphs, list items, inline labels. Weight 200 across all sizes keeps the type from competing with the architectural background; this is the workhorse face and everything else is a special occasion. Letter-spacing stays at +0.004–0.005em, giving the thin strokes a touch of air without becoming formal. · `--font-editorialold`
- **Substitute:** Old Standard TT (weight 200) or Cormorant Garamond Light
- **Weights:** 200
- **Sizes:** 16, 19, 21, 22, 27, 32px
- **Line height:** 1.20–1.50
- **Letter spacing:** 0.0040em at body sizes (16–22px), 0.0050em at 27–32px
- **Role:** Primary editorial serif — runs the entire information layer: navigation links, project titles, body paragraphs, list items, inline labels. Weight 200 across all sizes keeps the type from competing with the architectural background; this is the workhorse face and everything else is a special occasion. Letter-spacing stays at +0.004–0.005em, giving the thin strokes a touch of air without becoming formal.

### Wispy — The single monumental display cut — used exactly once for the owner's name in the hero. The -0.01em tracking pulls the hairlines tight; this is the only place the design allows itself to be loud, and it earns that volume by being the only 96px element on the page. · `--font-wispy`
- **Substitute:** Italiana, Marcellus, or Cormorant SC at weight 300 with tightened tracking
- **Weights:** 100
- **Sizes:** 96px
- **Line height:** 1.00
- **Letter spacing:** -0.0100em
- **Role:** The single monumental display cut — used exactly once for the owner's name in the hero. The -0.01em tracking pulls the hairlines tight; this is the only place the design allows itself to be loud, and it earns that volume by being the only 96px element on the page.

### Old Standard TT — Google-available fallback for EditorialOld at the smallest sizes — 13px captions and 16px secondary paragraphs. Same ultra-light weight, same manuscript register. · `--font-old-standard-tt`
- **Substitute:** Old Standard TT is the open substitute for itself; Cormorant Garamond Light is a close stand-in
- **Weights:** 200
- **Sizes:** 13, 16px
- **Line height:** 1.50
- **Letter spacing:** normal
- **Role:** Google-available fallback for EditorialOld at the smallest sizes — 13px captions and 16px secondary paragraphs. Same ultra-light weight, same manuscript register.

### GTA — A secondary body serif with slightly more open leading (1.60) and a touch more weight (300) — appears in longer-form sections where the tighter EditorialOld would feel constraining. Looser tracking at +0.004em matches the primary family. · `--font-gta`
- **Substitute:** Cormorant Garamond Light (300) or EB Garamond Light
- **Weights:** 300
- **Sizes:** 15, 21px
- **Line height:** 1.60
- **Letter spacing:** 0.0040em
- **Role:** A secondary body serif with slightly more open leading (1.60) and a touch more weight (300) — appears in longer-form sections where the tighter EditorialOld would feel constraining. Looser tracking at +0.004em matches the primary family.

### bodoni-classic-ornaments — Ornamental display face — used sparingly for the small decorative motifs embedded in body text (flourishes, dingbats, the small flowers in the rose-window pattern). Wider tracking (+0.011em) is intentional, these characters need room to breathe as mark-making rather than text. · `--font-bodoni-classic-ornaments`
- **Substitute:** Baskerville Ornaments via Adobe Fonts, or replace with Bodoni Moda glyphs
- **Weights:** 200, 300, 400
- **Sizes:** 16, 21px
- **Line height:** 1.44–1.50
- **Letter spacing:** 0.0110em
- **Role:** Ornamental display face — used sparingly for the small decorative motifs embedded in body text (flourishes, dingbats, the small flowers in the rose-window pattern). Wider tracking (+0.011em) is intentional, these characters need room to breathe as mark-making rather than text.

### altesse-std-24pt — Reserved display serif for mid-level section headers — the rare heading that isn't set in EditorialOld. Tight line-height (1.10) and the highest stroke contrast in the family make it feel like a pull-quote. · `--font-altesse-std-24pt`
- **Substitute:** Playfair Display (300) or DM Serif Display Light
- **Weights:** 300
- **Sizes:** 27px
- **Line height:** 1.10
- **Letter spacing:** normal
- **Role:** Reserved display serif for mid-level section headers — the rare heading that isn't set in EditorialOld. Tight line-height (1.10) and the highest stroke contrast in the family make it feel like a pull-quote.

### ui-sans-serif — System fallback for the rare non-serif surface — the keyboard-shortcut chips (W, T, A) in the navigation, where a monospaced feel is needed for the boxed letter. · `--font-ui-sans-serif`
- **Substitute:** Any geometric sans at weight 100 / 400 (Inter, IBM Plex Mono for the chips)
- **Weights:** 100, 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Letter spacing:** normal
- **Role:** System fallback for the rare non-serif surface — the keyboard-shortcut chips (W, T, A) in the navigation, where a monospaced feel is needed for the boxed letter.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| body-sm | 15px | 1.6 | 0.06px | `--text-body-sm` |
| subheading | 19px | 1.3 | 0.076px | `--text-subheading` |
| heading-sm | 21px | 1.44 | 0.084px | `--text-heading-sm` |
| heading | 27px | 1.1 | 0.135px | `--text-heading` |
| heading-lg | 32px | 1.2 | 0.16px | `--text-heading-lg` |
| display | 96px | 1 | -0.96px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 22 | 22px | `--spacing-22` |
| 26 | 26px | `--spacing-26` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 51 | 51px | `--spacing-51` |
| 64 | 64px | `--spacing-64` |
| 102 | 102px | `--spacing-102` |
| 138 | 138px | `--spacing-138` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| pills | 64px |
| inputs | 4.8px |
| buttons | 4.8px |

### Layout

- **Section gap:** 51px
- **Card padding:** 26px
- **Element gap:** 11px

## Components

### Navigation Bar
**Role:** Primary top navigation spanning full viewport width

Full-bleed horizontal bar with Parchment hairline border (1px) top and bottom against Pine Vellum. Three evenly-spaced link clusters: 'Work' (with W keyboard chip), 'Thoughts' (T chip), 'About Me' (A chip). Link text in EditorialOld 16px weight 200, Parchment, with the single-letter shortcut rendered in a 1px-bordered Parchment box (4.8px radius) to its right — the box is a ghost outline, no fill. Total bar height is minimal, roughly 48px, and lives in the 13px gap rhythm of the page.

### Outlined Link Button
**Role:** Ghost / outlined interactive element (the only button pattern in this system)

No filled buttons exist. Interactive elements use a 1px Parchment border (#f8f2de) at 4.8px radius with no background fill, paired with Parchment text in EditorialOld 16px weight 200. Padding 11px vertical × 18–22px horizontal, with 11–12px gap between the text and any trailing shortcut chip. ACTION_BORDER=140 confirms this is the system's only action treatment — it's an outlined action, never a solid one.

### Keyboard Shortcut Chip
**Role:** Single-letter keycap indicator paired with navigation links

A 1px Parchment-bordered square (4.8px radius) containing a single uppercase letter in ui-sans-serif 16px weight 400 (Parchment). Approximately 24×24px footprint, vertically centered with the parent link text. No fill, no shadow — the border alone does the work of identifying it as an interactive surface.

### Section Divider Rule
**Role:** Horizontal hairline separator between major page sections

A 1px Parchment line stretching the full viewport width, interrupted in the center by a small italic section label (EditorialOld italic, 16px, Parchment) such as 'Work projects' or 'Lil projects'. At each end and at the center break, a small '+' crosshair sits on the line in Parchment — this is a signature motif and should appear on every major divider. Zero vertical padding above and below the line itself; the surrounding section gap is 51px.

### Project Tile
**Role:** Name-and-date entry in the work grid

A borderless, shadowless block. Project name set in EditorialOld 21px weight 200 Parchment, centered. Directly below, the year range in EditorialOld 13–16px weight 200, Aged Tan (#bead89) — the tan is the visual cue for metadata, never use Parchment for years. 26px vertical gap between the title and year. Tiles live in a 4-column grid with 26px column gaps and 51px row gaps; no card chrome whatsoever.

### Category Tag
**Role:** Small label above project titles in the secondary project grid (e.g. 'iOS', '3D', 'Figma plugin')

EditorialOld 13px weight 200, Aged Tan, no border, no background. Sits 3–4px above the project title. The tan-on-green treatment is the signal that this is supplementary information, not a heading.

### Display Name Plate
**Role:** The hero treatment for the owner's name in the page header

Centered, single line, Wispy 96px weight 100, Parchment, letter-spacing -0.96px, line-height exactly 1.0. No underline, no ornament, no background — the type itself is the hero. The only other element in this region is two short italic descriptors ('Software design' left, 'Assorted tomfoolery' right) in EditorialOld italic 19px weight 200 Parchment, sitting on the same baseline as the name with ~20% viewport width on each side. This is the single most-loud element the system produces; nothing else in any screen may reach 96px.

### Architectural Line Illustration
**Role:** Full-bleed decorative background pattern (rose windows, pointed arches)

SVG line art drawn entirely in Cedar Stroke (#456859) at 1px stroke width, no fill, sitting directly on the Pine Vellum canvas. The drawings bleed from edge to edge of their section, partially clipped by the next section's divider rule. Opacity should be kept at roughly 30–40% of the base Cedar value to read as a watermark rather than foreground content. These are not illustrations in a card — they ARE the background of the section.

### Inline Text Link
**Role:** In-body reference or cross-link within paragraphs

Parchment text in EditorialOld 16px weight 200 with a 1px Parchment underline (1px offset). No color shift on hover — the link's only active-state signal is the underline thickening to 2px or shifting to a slight cream-to-tan gradient. The link evidence (link/borderColor=84) confirms underlines are the primary link affordance, not color.

### Hero Ornament (Rosette)
**Role:** Small decorative motif anchoring project grids

A 64px-radius circular ornament drawn in Cedar Stroke at 1px, used as a visual rest point between project groups. Not a button, not clickable — it is a typographic dingbat that happens to be drawn. Renders as a geometric rose-window pattern, centered between rows of project tiles in the work grid.

## Do's and Don'ts

### Do
- Use Pine Vellum (#143930) as the only page background. Do not introduce lighter or darker surface tints for cards or sections.
- Set every text element in weight 200 of EditorialOld (or Old Standard TT at body sizes). Weight 300+ breaks the manuscript voice.
- Reserve 96px Wispy for a single display use per page — the hero name plate. Never reuse 96px for subheadings or section titles.
- Mark every section divider with the terminal '+' crosshair in Parchment on both ends and at the center break.
- Use Aged Tan (#bead89) for all secondary metadata (years, category labels, captions). Parchment is for primary content only.
- Build decorative line art in Cedar Stroke (#456859) at 1px stroke, no fill, as full-bleed background elements — never inside cards or containers.
- Space project tiles with 26px column gaps and 51px row gaps; the grid must feel like a printed index, not a card collection.

### Don't
- Do not introduce filled buttons, drop shadows, or card elevation. The system has no 'lift' — depth comes from line and contrast alone.
- Do not use corner radii above 64px except for the pill/ornament shape. Cards, inputs, and links stay at 0–4.8px.
- Do not mix chromatic colors into the palette. The whole system is one green–cream–tan axis; adding blue, red, or purple would destroy the manuscript feel.
- Do not set body type above 22px. The page is intentionally quiet; the 96px display is the only element that gets to be large.
- Do not use solid backgrounds behind text blocks. Text sits directly on the canvas, over line art if necessary — let the architecture show through.
- Do not replace the terminal '+' crosshairs on dividers with arrows, dots, or other markers. The crosshair is a load-bearing motif.
- Do not add gradients, blurs, or glassmorphism. The only shadow in the entire dataset is a single pine-tinted boxShadow token; keep it that way.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pine Vellum | `#143930` | Universal page canvas — every section sits directly on this dark green ground |
| 1 | Cedar Pattern | `#456859` | Decorative line-drawing layer — architectural illustrations rendered as low-contrast sage strokes sit on top of the canvas |

## Elevation

Elevation is replaced by line. The design carries no drop shadows in the conventional sense; depth comes from the single boxShadow token in the raw data (a faint pine-green glow on heading backgrounds) and from the contrast between architectural line art and empty canvas. Never introduce card shadows, floating panels, or neumorphism — those would shatter the manuscript illusion.

## Imagery

Imagery is almost entirely abstract architectural line art — SVG drawings of rose windows, pointed cathedral arches, and intersecting grid lines, all rendered as 1px Cedar Stroke outlines on the Pine Vellum canvas. No photography, no product screenshots, no realistic illustrations. The drawings function as section-level background patterns that bleed edge-to-edge and clip softly into adjacent dividers. Iconography follows the same logic: small line-art glyphs (the + crosshairs, the rosette ornaments, the single-letter keyboard chips) all in Parchment or Cedar Stroke, 1px, no fills, no multicolor. The overall density is text-dominant — the line art is atmosphere, the serif type is the content, and there is a strict 70/30 split favoring type over decoration in any given viewport.

## Layout

Full-bleed layout with no max-width container; content lives edge-to-edge with interior margins of roughly 26–51px from the viewport edge. The hero is a centered single-line display name flanked by two short italic descriptors, with no imagery — the name is the hero. Below, a section divider with the terminal '+' crosshair introduces the work grid: a 4-column tile layout centered in the page, tiles are borderless text blocks (title over year) with 26px column and 51px row gaps. The page rhythm alternates between text-only sections and sections where architectural line art bleeds through the background, creating a pulse of quiet-then-ornament. Navigation is a single top bar, non-sticky, no sidebar, no mega-menu — the three primary destinations are listed inline with their keyboard shortcuts. The page reads top-to-bottom as a scroll, not as distinct screens.

## Agent Prompt Guide

**Quick Color Reference**
- text: #f8f2de (Parchment)
- background: #143930 (Pine Vellum)
- border: #f8f2de (Parchment, 1px)
- accent: #456859 (Cedar Stroke — decorative line art and icons only)
- secondary text: #bead89 (Aged Tan — years, metadata)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Build the hero name plate.* Full-bleed Pine Vellum background. Center the name in Wispy, 96px, weight 100, color #f8f2de, letter-spacing -0.96px, line-height 1.0. Two italic descriptors ('Software design' left, 'Assorted tomfoolery' right) in EditorialOld italic, 19px, weight 200, #f8f2de, sitting on the same baseline with ~20% viewport width on each side.

2. *Build a project tile in the work grid.* No card, no border, no shadow. Title in EditorialOld, 21px, weight 200, #f8f2de, centered. Year directly below in EditorialOld, 16px, weight 200, #bead89. 26px gap between title and year. Place in a 4-column grid with 26px column gaps and 51px row gaps.

3. *Build a section divider with crosshair terminals.* Full-width 1px #f8f2de horizontal line. Place a small '+' crosshair in #f8f2de at both far ends and at the exact center break. In the center break, render an italic section label in EditorialOld, 16px, weight 200, #f8f2de (e.g. 'Work projects').

4. *Build the outlined link button (the only action pattern).* 1px #f8f2de border, 4.8px radius, transparent fill. Padding 11px vertical, 18px horizontal. Text in EditorialOld, 16px, weight 200, #f8f2de. Place a keyboard-shortcut chip (1px #f8f2de bordered square, 4.8px radius, single uppercase letter in ui-sans-serif 16px weight 400) 11px to the right of the text.

5. *Build the architectural background pattern.* Full-bleed SVG line art on Pine Vellum, 1px stroke in #456859, no fill. Draw three adjacent pointed-arch cathedral windows across the viewport. Keep overall opacity around 35% of the base Cedar value so the pattern reads as a watermark, not foreground content.

## Similar Brands

- **Tobias van Schneider** — Same single-color dark canvas, editorial serif at whisper weights, and a portfolio that treats the personal name as a display monument
- **Aether Pro / Manuel Bortoletti** — Same manuscript-influenced serif typography and architectural ornament embedded in dark backgrounds
- **Locomotive (locomotive.ca)** — Same discipline of full-bleed dark canvas with thin serifs and decorative line-drawn background motifs
- **Nicolae Robin — personal portfolio** — Same combination of deep forest green canvas, cream serif, and gothic-architectural decorative line art
- **Rauno Freiberg** — Same restraint: one chromatic background, one accent weight, no shadows, no rounded cards — the page as a printed sheet

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pine-vellum: #143930;
  --color-cedar-stroke: #456859;
  --color-parchment: #f8f2de;
  --color-aged-tan: #bead89;

  /* Typography — Font Families */
  --font-editorialold: 'EditorialOld', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wispy: 'Wispy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-old-standard-tt: 'Old Standard TT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gta: 'GTA', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bodoni-classic-ornaments: 'bodoni-classic-ornaments', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-altesse-std-24pt: 'altesse-std-24pt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-sm: 15px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: 0.06px;
  --text-subheading: 19px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.076px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.44;
  --tracking-heading-sm: 0.084px;
  --text-heading: 27px;
  --leading-heading: 1.1;
  --tracking-heading: 0.135px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.16px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.96px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-51: 51px;
  --spacing-64: 64px;
  --spacing-102: 102px;
  --spacing-138: 138px;

  /* Layout */
  --section-gap: 51px;
  --card-padding: 26px;
  --element-gap: 11px;

  /* Border Radius */
  --radius-md: 4.8px;
  --radius-full: 64px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-pills: 64px;
  --radius-inputs: 4.8px;
  --radius-buttons: 4.8px;

  /* Surfaces */
  --surface-pine-vellum: #143930;
  --surface-cedar-pattern: #456859;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pine-vellum: #143930;
  --color-cedar-stroke: #456859;
  --color-parchment: #f8f2de;
  --color-aged-tan: #bead89;

  /* Typography */
  --font-editorialold: 'EditorialOld', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wispy: 'Wispy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-old-standard-tt: 'Old Standard TT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gta: 'GTA', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bodoni-classic-ornaments: 'bodoni-classic-ornaments', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-altesse-std-24pt: 'altesse-std-24pt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-sm: 15px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: 0.06px;
  --text-subheading: 19px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.076px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.44;
  --tracking-heading-sm: 0.084px;
  --text-heading: 27px;
  --leading-heading: 1.1;
  --tracking-heading: 0.135px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.16px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-51: 51px;
  --spacing-64: 64px;
  --spacing-102: 102px;
  --spacing-138: 138px;

  /* Border Radius */
  --radius-md: 4.8px;
  --radius-full: 64px;
}
```
