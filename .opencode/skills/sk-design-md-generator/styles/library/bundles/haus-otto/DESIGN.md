# Haus Otto — Style Reference
> Monumental wordmark on white void

**Theme:** light

Haus Otto operates as a typographic monolith: a single ultra-condensed wordmark stretches across a vast white void, treating the brand name as both logo and content. The entire interface is two-tone — near-black on paper-white — with no shadows, no gradients, no borders, and no decorative geometry. Typography is the only material; Monument at 216px dominates with weight 400 and aggressive negative tracking, while smaller sizes at 13–23px handle navigation and metadata at near-whisper volumes. The layout is radically spacious, using emptiness as the primary compositional tool rather than fills, cards, or dividers. Every screen should feel like walking into a gallery where one object occupies the room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, wordmark fills, link text, all heading color — the only non-white pigment in the interface |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, inverse text on dark moments |
| Terracotta | `#af7653` | `--color-terracotta` | Sole chromatic accent — warm earthen tone for hover states, active indicators, or single-element highlights against the monochrome field |

## Tokens — Typography

### Monument — Sole typeface across the entire system. Regular variant at 13–23px for nav links, metadata, body micro-copy. Medium variant at 216px for the hero wordmark — the only element that earns the 216px scale, with -0.033em tracking to tighten the ultra-condensed letterforms into a continuous bar of black · `--font-monument`
- **Substitute:** Bebas Neue (display), Inter (body micro-copy)
- **Weights:** 400 (Regular + Medium variants)
- **Sizes:** 13px, 20px, 23px, 216px
- **Line height:** 1.15–2.00 (contextual: tight at display, generous at body)
- **Letter spacing:** -0.033em at 216px display; normal at 13–23px body sizes
- **Role:** Sole typeface across the entire system. Regular variant at 13–23px for nav links, metadata, body micro-copy. Medium variant at 216px for the hero wordmark — the only element that earns the 216px scale, with -0.033em tracking to tighten the ultra-condensed letterforms into a continuous bar of black

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 2 | — | `--text-caption` |
| body | 20px | 1.23 | — | `--text-body` |
| subheading | 23px | 1.16 | — | `--text-subheading` |
| display | 216px | 1 | -7.13px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 30px
- **Card padding:** 12-20px
- **Element gap:** 4px

## Components

### Display Wordmark
**Role:** Hero brand identifier — the signature element

Single-line brand name at 216px Monument Medium, weight 400, letter-spacing -0.033em, Obsidian (#000000) on Paper (#ffffff). Fills viewport width edge-to-edge. No surrounding chrome, no tagline, no subtitle — the word IS the content.

### Navigation Link
**Role:** Top-level nav items (e.g. 'Info')

13px Monument Regular, weight 400, Obsidian color, no underline, no padding. Sits at the absolute top edge of the viewport with 3–4px horizontal margin. Hover state: Terracotta (#af7653).

### Top-Left Brand Mark
**Role:** Persistent brand identifier in nav

13px Monument Regular, 'Haus Otto' in Obsidian, top-left corner, no logo mark — text only. Functions as home link.

### Page Dot Indicators
**Role:** Section navigation (right edge, top)

Two small circular dots (approximately 8px diameter) stacked vertically at the top-right edge. Active dot: Obsidian. Inactive: Terracotta (#af7653). Zero border-radius added — native circle shape.

### Cookie Consent Bar
**Role:** Legal/UX footer notice

Full-width bar at viewport bottom, 30px vertical padding, Paper background. Body text at 13px Monument Regular, Obsidian. 'Yes' button: solid Obsidian fill, Paper text, 4px padding, 0px radius — no rounding. 'No' and 'More': text-only links in Obsidian.

### Page Section Spacer
**Role:** Vertical rhythm device between content blocks

30px top/bottom padding with no visible divider line, no background change, no rule. Whitespace itself separates sections. This is the primary structural tool.

### Tertiary Body Text
**Role:** Supplementary information, metadata, descriptions

20–23px Monument Regular, line-height 1.16–1.23, Obsidian. Sits in generous white space beneath the display wordmark. No max-width constraint — text is allowed to breathe at whatever length it needs.

## Do's and Don'ts

### Do
- Set hero type at exactly 216px Monument Medium with letter-spacing -0.033em — this scale is non-negotiable, it IS the brand
- Use zero border-radius on every interactive element: buttons, tags, inputs, cards — sharp corners only
- Keep the color palette to Obsidian (#000000) and Paper (#ffffff) as the default; reserve Terracotta (#af7653) for single-element accent moments only
- Set base spacing to a 4px grid with 30px section gaps — the design is compact in its tokens but vast in its whitespace
- Let the wordmark fill the full viewport width — no max-width container should clip the display type
- Use 13px Monument Regular for all navigation and metadata at line-height 1.77–2.00 for breathing room at small sizes
- Treat the white canvas as an active design element — never fill backgrounds with color or imagery behind text

### Don't
- Never introduce a second typeface family — Monument is the sole voice
- Never apply border-radius to buttons, cards, or tags — every corner is sharp
- Never use shadows, gradients, or glow effects — the design is flat and chromatically minimal
- Never add borders, dividers, or rules between sections — whitespace is the only separator
- Never reduce the 216px display below 120px — the wordmark's authority depends on its scale
- Never use more than one accent color per screen — Terracotta appears as punctuation, not decoration
- Never fill the page with imagery, illustrations, or product photography — text on void is the entire visual system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Full-page background, all content sits on this surface |

## Elevation

The design eliminates elevation entirely. There are no shadows, no stacked layers, no depth cues. Hierarchy is achieved through scale (216px vs 13px) and whitespace alone, not through z-axis separation. This flatness is deliberate — it treats the white page as a single infinite plane.

## Imagery

No imagery present. The site is pure typography on white space — no photography, no illustrations, no icons, no product shots, no decorative graphics. The only visual marks are the two navigation dot indicators in the top-right corner. This is a typographic-first identity where the wordmark replaces all visual content.

## Agent Prompt Guide

**Quick Color Reference**
- text/wordmark: #000000 (Obsidian)
- background: #ffffff (Paper)
- border: none (use whitespace, not lines)
- accent: #af7653 (Terracotta — single-element highlights only)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero Display Wordmark**: Full-viewport Paper (#ffffff) background. Single text element at 216px, Monument Medium weight 400, color Obsidian (#000000), letter-spacing -0.033em, line-height 1.0. Text fills 100% of viewport width edge-to-edge. No subtitle, no tagline.

2. **Navigation Bar**: Top edge of viewport, 4px vertical padding. Left: 'Haus Otto' at 13px Monument Regular Obsidian. Center-left: nav link 'Info' at 13px Monument Regular Obsidian with 20px right margin. Right: two 8px circular dots stacked vertically — top dot Obsidian (active), bottom dot Terracotta #af7653 (inactive). No background, no border.

3. **Body Text Block**: Paper background. 20px Monument Regular Obsidian, line-height 1.23. No max-width constraint. 30px top margin from preceding element. Single paragraph only — no bullet points, no subheadings.

4. **Bottom Consent Bar**: Full-width fixed bar at viewport bottom, Paper background, 30px top/bottom padding. Left: 13px Monument Regular Obsidian consent text. Right group: 'Yes' button (Obsidian fill, Paper text, 4px 8px padding, 0px radius), 'No' text link (Obsidian, no background), 'More' text link (Obsidian, no background), separated by 20px right margins.

5. **Section Divider (Invisible)**: No visible element. Simply 30px of vertical whitespace between the bottom of one content block and the top of the next. The absence of a line IS the divider.

## Composition Rules

The layout follows a single principle: the wordmark commands the first viewport, and everything else descends from it at increasingly smaller scales. Sections stack vertically with 30px gaps and no visual separation. Navigation is absolute-positioned at the viewport's top edge with 4px padding — it hovers above the content rather than occupying its own zone. Content blocks never compete with the display type; they exist at 13–23px and defer to the 216px wordmark. There is no card system, no grid of features, no sidebar, no footer beyond the consent bar. The page is a single vertical scroll of typographic moments, each separated by silence.

## Similar Brands

- **Pentagram** — Same radical typographic-first identity where the studio name IS the visual content — no imagery, no decoration, just type on white
- **Bureau Cool** — Shares the ultra-condensed display typeface at extreme scale with near-zero supporting visual elements
- **Manuel Bürger (manuelbuerger.com)** — Identical approach: single bold wordmark on infinite white void, no chrome, no navigation beyond text links
- **Dia Studio** — Same minimal agency presentation — monochrome palette, display-scale typography, whitespace as the primary design material

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-terracotta: #af7653;

  /* Typography — Font Families */
  --font-monument: 'Monument', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 2;
  --text-body: 20px;
  --leading-body: 1.23;
  --text-subheading: 23px;
  --leading-subheading: 1.16;
  --text-display: 216px;
  --leading-display: 1;
  --tracking-display: -7.13px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 30px;
  --card-padding: 12-20px;
  --element-gap: 4px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-terracotta: #af7653;

  /* Typography */
  --font-monument: 'Monument', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 2;
  --text-body: 20px;
  --leading-body: 1.23;
  --text-subheading: 23px;
  --leading-subheading: 1.16;
  --text-display: 216px;
  --leading-display: 1;
  --tracking-display: -7.13px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-30: 30px;
}
```
