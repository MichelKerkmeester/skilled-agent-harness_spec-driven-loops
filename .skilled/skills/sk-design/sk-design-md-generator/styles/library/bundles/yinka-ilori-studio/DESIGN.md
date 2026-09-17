# Yinka Ilori Studio — Style Reference
> West African textile gallery on blush paper

**Theme:** light

Yinka Ilori Studio operates on a single dramatic rule: alternate between maximalist pattern explosions and vast, silent pink fields. The pale blush canvas (#f5e5e5) is the breath between visual shouts — full-bleed SVG compositions of wavy vertical stripes and grid-aligned circles in saturated magenta, orange, and green act as gallery walls for the wordmark. Typography is binary and extreme: a tiny 14px Haas Grotesk for navigation and body, then a sudden 120px custom display face (Yinka Sans Ultra) for the wordmark. The system refuses gradients, shadows, and rounded corners — everything is flat, editorial, and printed. The contrast between dense pattern and empty pink IS the brand voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Paper | `#f5e5e5` | `--color-blush-paper` | Page canvas, breathing space between pattern sections, card surfaces on quiet pages |
| Ink | `#000000` | `--color-ink` | Body text, navigation links, hairline borders, structural grid lines, icon strokes |
| Rose | `#d9698c` | `--color-rose` | Wavy stripe fill in hero/pattern compositions, deeper pink surface variant |

## Tokens — Typography

### Haas Grotesk Display R Web — All UI text: navigation links, body copy, footer, labels. The 14px weight 400 is the default for everything clickable; 20px weight 500 for subheadings and journal titles. This is the working typeface — small, neutral, Swiss-grid functional. · `--font-haas-grotesk-display-r-web`
- **Substitute:** Inter, Helvetica Neue, Neue Haas Grotesk
- **Weights:** 400, 500
- **Sizes:** 14px, 20px
- **Line height:** 1.30, 1.50
- **Role:** All UI text: navigation links, body copy, footer, labels. The 14px weight 400 is the default for everything clickable; 20px weight 500 for subheadings and journal titles. This is the working typeface — small, neutral, Swiss-grid functional.

### Yinka Sans Ultra — Exclusive to the studio wordmark and oversized display moments. The +0.04em tracking at 120px is critical — it gives the dense letterforms air without losing the custom geometric character. Custom face only used at this display scale; never below 80px. · `--font-yinka-sans-ultra`
- **Substitute:** No direct substitute — closest available would be Druk Wide or Aktiv Grotesk Black at expanded tracking
- **Weights:** 400, 500
- **Sizes:** 120px
- **Line height:** 1.10
- **Letter spacing:** 4.8px at 120px
- **Role:** Exclusive to the studio wordmark and oversized display moments. The +0.04em tracking at 120px is critical — it gives the dense letterforms air without losing the custom geometric character. Custom face only used at this display scale; never below 80px.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 14px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| display | 120px | 1.1 | 4.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 15 | 15px | `--spacing-15` |
| 30 | 30px | `--spacing-30` |
| 80 | 80px | `--spacing-80` |
| 136 | 136px | `--spacing-136` |
| 175 | 175px | `--spacing-175` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 175px
- **Card padding:** 30px
- **Element gap:** 15px

## Components

### Split Navigation Bar
**Role:** Primary site navigation

Sticky top bar on #f5e5e5 background. Left cluster: WORK, ABOUT (left-aligned, 0px from edge, 80px padding). Right cluster: JOURNAL, CONTACT, STORE, FOUNDATION (right-aligned). All links in Haas Grotesk 14px weight 500, uppercase, #000000, 30px column gap between items. No background, no border, no underline — pure text. Navigation persists across all section types including full-bleed pattern sections.

### Hero Pattern Banner
**Role:** Full-bleed opening visual

Viewport-height SVG composition on #f5e5e5 base. Contains vertical wavy stripes in #d9698c and orange (warm) alternating with solid green circles (#3a8a3a approximate) arranged in a 7-column × 4-row grid offset. Pattern fills the entire screen edge-to-edge. No border, no padding — the SVG IS the surface. Designed to be recolored per project context.

### Wordmark Overlay
**Role:** Studio identity on pattern backgrounds

Yinka Sans Ultra 120px, weight 500, color #f5e5e5 (blush paper, matching canvas) for visibility on dark/saturated pattern sections. Letter-spacing 4.8px. Centered horizontally, positioned in upper-middle of hero. No shadow or glow — relies on color contrast against the pattern.

### Scroll Indicator
**Role:** Downward scroll cue

Simple arrow (↓) in #f5e5e5 or #000000 depending on section background, ~20px size, centered horizontally. Single element, no animation described, sits at bottom of hero pattern sections to bridge into the next quiet pink field.

### Quiet Pink Section
**Role:** Breathing space between pattern compositions

Full-viewport #f5e5e5 background with no content or minimal text. The absence of visual is the component. Section gap of 175px above and below. Sometimes contains a single small block of body text or an image, but the vast majority is empty pink — this is intentional negative space that makes the adjacent pattern sections feel louder.

### Project Card
**Role:** Portfolio project entry

No border, no shadow, no radius. Full-bleed image or pattern preview at native proportions, with project title and year below in Haas Grotesk 14px weight 400 #000000. 30px padding-bottom between image and text. Cards sit directly on #f5e5e5 canvas without container.

### Journal Entry Card
**Role:** Editorial/blog listing

Title in Haas Grotesk 20px weight 500 #000000, date or category in 14px weight 400, separated by 15px gap. No background fill, no border, no card chrome. Entries are typographic blocks on the #f5e5e5 canvas — the type itself is the visual.

### Footer Link List
**Role:** Site footer navigation and legal

Haas Grotesk 14px weight 400 #000000, organized in columns with 30px row gap. Plain text links, no icons, no social buttons styled as buttons. Footer sits directly on #f5e5e5 with generous top padding (136px or more).

### Full-Bleed Project Image
**Role:** Portfolio showcase

Edge-to-edge photographic or pattern documentation of work. No border-radius, no padding, no caption overlay. Images span full viewport width and sit directly between pink fields.

## Do's and Don'ts

### Do
- Alternate pattern sections with quiet #f5e5e5 fields — never place two pattern compositions adjacent without 175px+ of breathing pink between them
- Use Yinka Sans Ultra exclusively at 120px with 4.8px letter-spacing for the wordmark and never below 80px
- Keep all UI text at exactly 14px Haas Grotesk weight 400; use 20px weight 500 only for subheadings and journal titles
- Apply the 80px horizontal padding to all section content and the 175px vertical section gap to create editorial breathing room
- Use #f5e5e5 as the only canvas color and #000000 as the only structural/text color outside of SVG pattern artwork
- Let the split navigation (left cluster + right cluster, 30px column gap) persist across every page state including full-bleed pattern sections
- Treat empty #f5e5e5 space as a deliberate design element — resist the urge to fill it

### Don't
- Never add box-shadows, gradients, or border-radius to any component — the system is strictly flat and sharp-cornered
- Never introduce blue, green, or cool tones as UI colors — the palette is warm pink/orange/green within patterns, neutral outside
- Never use a type size between 20px and 120px — the scale is intentionally binary: small functional type or massive display type
- Never apply background colors to cards, buttons, or links — all UI chrome is transparent on the #f5e5e5 canvas
- Never decorate navigation with icons, buttons, or containers — it must remain plain uppercase text links
- Never compress section gaps below 175px between pattern and quiet sections — the rhythm requires dramatic vertical distance
- Never use Yinka Sans Ultra for navigation, body text, or anything below display scale — it is a wordmark face only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Blush Canvas | `#f5e5e5` | Base page background and breathing space between pattern sections |
| 2 | Pattern Surface | `#d9698c` | Deeper rose within SVG pattern compositions; not used as UI surface |

## Elevation

No shadows, no elevation, no z-depth. The system is completely flat — pattern sections achieve visual weight through color saturation and density, not depth. Cards and components are edge-to-edge with the canvas; the only structural separator is the #f5e5e5 → pattern transition itself.

## Imagery

The site IS its own imagery. SVG pattern compositions — wavy vertical stripes alternating warm magenta and orange, with grid-aligned solid green circles — function as the primary visual language, referencing West African wax print and textile traditions. When photography appears in project sections, it is full-bleed editorial documentation of designed objects, furniture, and installations, shot on neutral backgrounds and placed edge-to-edge without framing. No lifestyle photography, no stock imagery, no icons beyond a single downward scroll arrow. The visual density oscillates between 100% pattern saturation and near-zero negative space — the ratio of pattern to pink is the site's compositional meter.

## Layout

Full-bleed sections that alternate between pattern compositions and quiet pink fields, separated by 175px+ vertical gaps. Navigation is a split sticky bar (left-aligned 2-item cluster, right-aligned 4-item cluster, 80px edge padding). The hero is a full-viewport pattern with a 120px centered wordmark overlay and a small centered scroll arrow. Interior sections are typographic blocks on #f5e5e5 with no max-width container — content reads edge-to-edge with only the 80px horizontal padding enforcing margins. Project images span full viewport width. The grid is invisible but implied by the circular dot pattern in the hero.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #f5e5e5
- border: #000000 (hairline structural lines)
- accent: #d9698c (deeper rose, used in pattern compositions)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a full-bleed hero pattern section: SVG composition covering 100vh. Base fill #f5e5e5. Vertical wavy stripes in #d9698c and warm orange, full height, distributed evenly across width. Grid of solid green circles (~80px diameter) in 7 columns × 4 rows, offset to overlap the stripes. Center overlay text: 'YINKA ILORI' in Yinka Sans Ultra 120px weight 500, #f5e5e5, letter-spacing 4.8px, centered horizontally in upper third.

2. Create a quiet section: full-viewport #f5e5e5 background, zero content, 175px padding-top and padding-bottom. Functions as visual breath between pattern sections. No borders, no shadows.

3. Create a split navigation bar: sticky top, 80px padding-left and padding-right, #f5e5e5 background. Left-aligned: 'WORK' and 'ABOUT' in Haas Grotesk 14px weight 500 #000000, 30px gap. Right-aligned: 'JOURNAL', 'CONTACT', 'STORE', 'FOUNDATION' same spec, 30px gap. Uppercase. No background, no border, no underline.

4. Create a journal entry: title in Haas Grotesk 20px weight 500 #000000, 15px below a date in 14px weight 400. No card chrome, no border, sits directly on #f5e5e5 canvas with 30px padding-bottom.

5. Create a scroll indicator: single downward arrow character (↓) at 20px, #f5e5e5, centered horizontally, positioned at bottom of a pattern section with 30px from edge. No animation, static element.

## Pattern System

The site operates on a binary visual rhythm: full-bleed SVG pattern compositions and empty #f5e5e5 fields. The pattern compositions are built from two repeating motifs — vertical wavy stripes (magenta #d9698c and warm orange, ~6-8 stripes across viewport, full height) and a grid of solid circles (green ~#3a8a3a, ~80px diameter, offset rows). The circles overlap the stripes to create layered color intersections. These patterns are the primary surface treatment for hero and project opening sections. The quiet #f5e5e5 fields with no content are equally important — they are not 'empty' states but deliberate negative space. New pages should always pair at least one pattern section with one quiet field.

## Similar Brands

- **Camille Walala** — Same maximalist Memphis-inspired pattern language with bold geometric motifs and saturated color — both designers treat the website itself as a textile composition
- **Morag Myerscough** — Full-bleed vivid color blocks and pattern-first page architecture, with the studio identity acting as overlay type on saturated backgrounds
- **Pentagram** — Editorial flat layout with no shadows, no rounded corners, sharp typographic hierarchy, and project showcases that span full viewport width
- **Studio Dumbar** — Portfolio site pattern of dramatic typographic wordmark overlays on bold graphic backgrounds, alternating with restrained editorial sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-paper: #f5e5e5;
  --color-ink: #000000;
  --color-rose: #d9698c;

  /* Typography — Font Families */
  --font-haas-grotesk-display-r-web: 'Haas Grotesk Display R Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yinka-sans-ultra: 'Yinka Sans Ultra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-display: 120px;
  --leading-display: 1.1;
  --tracking-display: 4.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-15: 15px;
  --spacing-30: 30px;
  --spacing-80: 80px;
  --spacing-136: 136px;
  --spacing-175: 175px;

  /* Layout */
  --section-gap: 175px;
  --card-padding: 30px;
  --element-gap: 15px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-blush-canvas: #f5e5e5;
  --surface-pattern-surface: #d9698c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-paper: #f5e5e5;
  --color-ink: #000000;
  --color-rose: #d9698c;

  /* Typography */
  --font-haas-grotesk-display-r-web: 'Haas Grotesk Display R Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-yinka-sans-ultra: 'Yinka Sans Ultra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-display: 120px;
  --leading-display: 1.1;
  --tracking-display: 4.8px;

  /* Spacing */
  --spacing-15: 15px;
  --spacing-30: 30px;
  --spacing-80: 80px;
  --spacing-136: 136px;
  --spacing-175: 175px;
}
```
