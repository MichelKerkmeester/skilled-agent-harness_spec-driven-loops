# EVOKE — Style Reference
> Saturated flat tiles swallowed by a massive black wordmark

**Theme:** light

EVOKE is a design studio site that speaks in full-bleed saturated color panels — coral, cyan, yellow, lavender — each one a flat, unmodulated field that doubles as a section anchor. The work lives in a tight 3-column grid of oversized tiles where lifestyle photography, flat vector illustration, and licensed cartoon character art share equal billing at full bleed with no framing or padding. Type is deliberately compressed: TT Norms Pro sets everything, with the Normal weight for content headings and ExtraBlack reserved for the brand wordmark itself, which becomes architecture — a slab of near-black display type at massive scale that anchors the lower half of the page. The system rejects depth entirely: no shadows, no gradients, no rounded softness, no card chrome. Visual hierarchy comes from scale, color contrast, and full-bleed composition rather than z-axis separation. Every surface is a declaration; every wordmark is a wall.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Coral | `#ff5a46` | `--color-ember-coral` | Full-bleed section panels, project tile backgrounds — warm coral against flat illustration reads as editorial heat |
| Electric Cyan | `#00ffff` | `--color-electric-cyan` | Full-bleed section panels, project tile backgrounds — synthetic cyan reads as digital, screen-native energy |
| Solar Yellow | `#ffe100` | `--color-solar-yellow` | Full-bleed section panels, project tile backgrounds — saturated yellow as high-attention section marker |
| Lavender Mist | `#ebebf5` | `--color-lavender-mist` | Full-bleed section panels, soft transitions between louder panels — cool lavender for quieter moments |
| Void Black | `#000000` | `--color-void-black` | Text, display wordmark, hairline borders — compressed near-black carries the entire typographic system and grounds every color panel |
| Pure White | `#ffffff` | `--color-pure-white` | Base canvas, text on color panels — the white ground that separates saturated panels and gives the wordmark its field |

## Tokens — Typography

### tt_norms_proextrablack — tt_norms_proextrablack — detected in extracted data but not described by AI · `--font-ttnormsproextrablack`
- **Weights:** 400
- **Sizes:** 31px
- **Line height:** 1.2
- **Letter spacing:** -0.015
- **Role:** tt_norms_proextrablack — detected in extracted data but not described by AI

### TT Norms Pro — Sole typeface. Normal weight (400) sets all content headings; ExtraBlack (900) is reserved exclusively for the EVOKE wordmark and any display-scale identity moments. The two-weight binary creates a deliberate whisper/shout split: compressed grotesk for information, ExtraBlack slab for brand presence. The tight -0.015em tracking is signature — it makes the Normal weight feel set in concrete, and makes the ExtraBlack wordmark read as a single architectural mass rather than a word. · `--font-tt-norms-pro`
- **Substitute:** Inter (for Normal weight), Space Grotesk Bold or Inter Black (for ExtraBlack)
- **Weights:** 400 (Normal), 900 (ExtraBlack)
- **Sizes:** 31px (detected); display scale ~200–300px (wordmark, inferred from screenshot)
- **Line height:** 1.20
- **Letter spacing:** -0.015em across all sizes — at 31px = -0.465px; tight tracking is a defining choice
- **Role:** Sole typeface. Normal weight (400) sets all content headings; ExtraBlack (900) is reserved exclusively for the EVOKE wordmark and any display-scale identity moments. The two-weight binary creates a deliberate whisper/shout split: compressed grotesk for information, ExtraBlack slab for brand presence. The tight -0.015em tracking is signature — it makes the Normal weight feel set in concrete, and makes the ExtraBlack wordmark read as a single architectural mass rather than a word.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| heading | 31px | 37.2 | -0.465px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0 |
| cards | 0 |
| inputs | 0 |
| buttons | 0 |

### Layout

- **Section gap:** 80px
- **Element gap:** 20px

## Components

### Work Tile
**Role:** Project showcase in a 3-column grid

Full-bleed image at column width. 0 padding, 0 border-radius, 0 border. Image fills the tile edge-to-edge with no framing, no overlay, no caption. Gutter between tiles is 20px. The tile is a pure image container — no chrome, no metadata, no hover treatment beyond the image itself.

### Color Block Section
**Role:** Full-width saturated background panel

One of four brand colors (#ff5a46, #00ffff, #ffe100, #ebebf5) fills the full viewport width as an unmodulated field. No gradient, no noise, no texture, no border. Content sits directly on the saturated surface. These panels function as section dividers and visual punctuation between work grids.

### Display Wordmark
**Role:** Brand identity anchor and page divider

TT Norms Pro ExtraBlack (900), #000000, set at display scale (~200–300px, inferred from screenshot), letter-spacing -0.015em. The wordmark spans the full page width and functions as a section transition, not just a logo placement. It is the largest element on every page it appears on.

### Section Heading
**Role:** Content heading for project names, section titles

31px TT Norms Pro Normal (400), #000000, letter-spacing -0.465px, line-height 1.20 (37.2px). Tight, compressed, confident — the Normal weight is heavy

## Do's and Don'ts

### Do

### Don't

## Agent Prompt Guide

primary action: no distinct CTA color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-coral: #ff5a46;
  --color-electric-cyan: #00ffff;
  --color-solar-yellow: #ffe100;
  --color-lavender-mist: #ebebf5;
  --color-void-black: #000000;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-ttnormsproextrablack: 'tt_norms_proextrablack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-norms-pro: 'TT Norms Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-heading: 31px;
  --leading-heading: 37.2;
  --tracking-heading: -0.465px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;
  --spacing-21: 21px;

  /* Layout */
  --section-gap: 80px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0;
  --radius-cards: 0;
  --radius-inputs: 0;
  --radius-buttons: 0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-coral: #ff5a46;
  --color-electric-cyan: #00ffff;
  --color-solar-yellow: #ffe100;
  --color-lavender-mist: #ebebf5;
  --color-void-black: #000000;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-ttnormsproextrablack: 'tt_norms_proextrablack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-norms-pro: 'TT Norms Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-heading: 31px;
  --leading-heading: 37.2;
  --tracking-heading: -0.465px;

  /* Spacing */
  --spacing-20: 20px;
  --spacing-21: 21px;
}
```
