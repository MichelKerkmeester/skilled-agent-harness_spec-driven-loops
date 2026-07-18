# Elva — Style Reference
> Monumental type on warm concrete

**Theme:** light

Elva is a typographic monument, not a typical agency site. The entire visual system is built on a custom Basis sans-serif rendered at extreme sizes — from 12px navigation to 640px hero headlines — on a warm bone-white canvas with near-zero color information. The signature moves are compressed display lines at line-height 0.82 with -0.06em tracking that force words to stack as architectural blocks, and generous 80–160px section gaps that make negative space the primary compositional tool. There are no buttons, cards, or shadows — only text links with arrows and a handful of pictogram glyphs (heart, asterisk, peace sign, victory hand) that replace individual letters in the display type, acting as typographic flourishes rather than traditional icons. The warm undertone of the #262523 text prevents the minimalism from feeling cold or clinical — the page reads as printed matter on warm paper.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Obsidian | `#262523` | `--color-warm-obsidian` | Primary text, logos, pictogram strokes, structural elements — the near-black with a brown undertone is the only ink in the system and gives the minimalism its printed-on-paper warmth |
| Bone White | `#ececec` | `--color-bone-white` | Page canvas and primary surface — the warm slightly-grayed white fills the entire viewport and provides the breathing room around monumental type |
| Pale Ash | `#cfcdcd` | `--color-pale-ash` | Secondary surface and hairline borders — one step darker than the canvas, used for subtle dividers and the rare nested surface |
| Pure Black | `#000000` | `--color-pure-black` | Sparing deep contrast for the smallest marks and AAA contrast anchors — never used for body text (that is always Warm Obsidian) |

## Tokens — Typography

### Basis Grotesque — Primary workhorse typeface — carries the entire system from 10px metadata to 640px hero statements. Weight 400 for body and display, 500 for navigation and small labels, 700 reserved for rare emphasis. The extreme size range is the signature: Basis is asked to perform as both a 10px caption and a building-scale poster without switching families. · `--font-basis-grotesque`
- **Substitute:** Inter or Manrope — a neo-grotesque with similar proportions and warm default tracking; the closest free match for the full weight range
- **Weights:** 400, 500, 700
- **Sizes:** 10, 12, 15, 16, 32, 40, 120, 160, 640
- **Line height:** 0.80, 0.82, 0.90, 1.00, 1.20, 1.30, 2.00
- **Letter spacing:** -0.02em at 10–16px, -0.04em at 32–40px, -0.06em at 120–160px, -0.08em at 640px
- **Role:** Primary workhorse typeface — carries the entire system from 10px metadata to 640px hero statements. Weight 400 for body and display, 500 for navigation and small labels, 700 reserved for rare emphasis. The extreme size range is the signature: Basis is asked to perform as both a 10px caption and a building-scale poster without switching families.

### Messina Sans — Secondary editorial display face — reserved for oversized moments at 240px+ where a slightly more humanist, wider-cut character set can break the Basis rhythm. The 1.0 line-height (versus Basis's 0.82) creates a more relaxed, poster-like cadence when both faces appear together. · `--font-messina-sans`
- **Substitute:** Editorial New or Druk Wide — a wide-cut editorial sans with similar humanist warmth at display scale
- **Weights:** 500
- **Sizes:** 240
- **Line height:** 1.00
- **Letter spacing:** -0.08em
- **Role:** Secondary editorial display face — reserved for oversized moments at 240px+ where a slightly more humanist, wider-cut character set can break the Basis rhythm. The 1.0 line-height (versus Basis's 0.82) creates a more relaxed, poster-like cadence when both faces appear together.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 12 | -0.2px | `--text-caption` |
| body | 15px | 30 | -0.3px | `--text-body` |
| subheading | 32px | 28.8 | -1.28px | `--text-subheading` |
| heading-sm | 40px | 40 | -1.6px | `--text-heading-sm` |
| heading | 120px | 108 | -7.2px | `--text-heading` |
| heading-lg | 160px | 131.2 | -9.6px | `--text-heading-lg` |
| display | 240px | 240 | -19.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 70px |
| cards | 10px |
| inputs | 10px |
| buttons | 10px |

### Layout

- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Brand Wordmark
**Role:** Site identity lockup

"Elva" set in Basis weight 700 at ~32px, with the subtitle "A Third And Grove Company" in Basis weight 400 at 10px below it. Color #262523. Sits at the top-left of the viewport with 40px padding from the edges. No symbol or mark — the wordmark is the entire identity.

### Top Navigation
**Role:** Primary site navigation

Horizontal row of text links (WORK, COMPANY, CAPABILITIES, CONTACT) in Basis weight 500 at 12px, uppercase, letter-spacing -0.24px, color #262523. Items separated by 40px gaps. No background, no border, no underline. Pinned to the top edge of the viewport, right-of-center alignment.

### Contact Email Link
**Role:** Primary contact affordance

Email address (e.g. INFO@HELLOELVA.COM) in Basis weight 500 at 12px, uppercase, color #262523, positioned at the far top-right of the viewport. Behaves as a plain text link with a 200ms opacity-to-0.6 hover state. No arrow glyph.

### Display Hero Headline
**Role:** Monumental typographic statement

The signature element. Full-bleed text in Basis weight 400 at 160px (or 640px for the absolute largest moments), line-height 0.82, letter-spacing -9.6px, color #262523. Left-aligned to the viewport edge (no max-width container), starting at roughly 100px from the top. Words stack as architectural blocks rather than flowing as prose. Individual letters may be replaced by pictogram glyphs. Always ends with a period.

### Pictogram Glyph
**Role:** Typographic flourish replacing a letter

Monochrome line-art icon (heart, asterisk, peace sign, victory hand) sized to match the cap-height of the surrounding 160–640px Basis text. Color #262523, no fill, stroke weight 6–8px. Inserted inline to substitute for a specific letter, never used standalone. Functions as a typographic ornament, not as a UI icon.

### Section Label Pill
**Role:** Small marker for content sections

Short text (e.g. "HELLO") in Basis weight 500 at 10px, uppercase, letter-spacing -0.2px, color #262523. Background #ececec with optional 1px #cfcdcd border. 70px border-radius (pill-shaped), 6px vertical / 12px horizontal padding. Functions as a quiet wayfinding marker, not a button.

### Inline Newsletter Notice
**Role:** Compact contextual update with link

Two stacked lines of body-sm text (12px Basis weight 400/500) in color #262523. First line is a statement, second line is a text link followed by a rightward arrow glyph (→) in the same color. No background, no border. Acts as the only contextual action surface on the page.

### Text Link with Arrow
**Role:** Primary interactive element (replaces buttons)

Inline text in Basis weight 500 at 12–15px, color #262523, no underline. Followed by a rightward arrow glyph (→) in the same color and size. Hover state: opacity transitions to 0.6 over 200ms. This is the only interactive pattern in the system — there are no filled buttons, no outlined buttons, no icon buttons.

### Body Paragraph
**Role:** Long-form text content

Basis weight 400 at 15px, line-height 2.0 (30px), letter-spacing -0.3px, color #262523. Max-width 480px for readability. No first-line indent, no bold emphasis within paragraphs, no drop caps. The 2.0 line-height is unusually airy and is a deliberate choice — it treats body text as editorial prose, not as UI copy.

## Do's and Don'ts

### Do
- Use Basis at 120px+ for every display moment, with line-height ≤ 0.90 and letter-spacing ≤ -0.06em — the compressed stacking is the signature
- Keep the canvas at #ececec and all ink at #262523 — chromatic color breaks the printed-on-paper warmth
- Maintain section gaps of at least 80px; use 160px+ for the gap above the hero headline
- Replace individual letters in display text with pictogram glyphs (heart, asterisk, peace sign, victory hand) at matching cap-height
- Set body text at 15px with 2.0 line-height — the airy leading is editorial, not utilitarian
- Use 70px border-radius only for pill-shaped tags and section labels; use 10px for any nested surface
- Make every interactive element a text link followed by a → arrow — never a filled or outlined button

### Don't
- Don't introduce filled buttons, outlined buttons, or any button-shaped affordance — text links with arrows are the only interactive pattern
- Don't add drop shadows, gradients, or any elevation effect — depth is communicated through type size and negative space only
- Don't use #000000 for body or display text — always use #262523 to preserve the warm undertone
- Don't center text or constrain it to a max-width container — content left-aligns to the viewport edge for an editorial spread feel
- Don't use color to create hierarchy — use size and weight only
- Don't set display type with line-height above 1.0 — the 0.80–0.90 compression is what makes the headline a monument
- Don't use icons in the traditional UI sense (nav icons, button icons, status icons) — pictograms belong inline with display text only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ececec` | Page background — the warm bone-white that fills the entire viewport and provides the breathing room around monumental type |
| 1 | Subtle Surface | `#cfcdcd` | Secondary surface for the rare nested element or alternating section band — just one step darker than the canvas |

## Elevation

This design system is deliberately shadowless. All depth is communicated through type size, weight, and negative space — never through drop shadows, borders, or stacked surfaces. The flatness reinforces the printed-on-paper quality and keeps the type as the undisputed visual hierarchy. If a element needs to feel 'above' another, it gets larger and tighter, not elevated.

## Imagery

No photography, no illustration, no decorative graphics. The visual language IS the typography — the Basis custom sans rendered at building-scale, with negative space as the composition. The only graphic elements are four hand-drawn pictogram glyphs (heart, asterisk, peace sign, victory hand) that replace individual letters in the display headline, acting as typographic flourishes rather than standalone icons. These glyphs are monochrome line-art, sized to match the x-height of the surrounding letters. The page is a poster, not a product page.

## Layout

Full-bleed, edge-to-edge content with no max-width container. All text left-aligns to the viewport edge, creating a raw editorial spread rather than a centered web page. The navigation sits as a whisper at the very top — brand wordmark top-left, primary nav center-right, contact email far-right — with the entire upper third of the viewport left as negative space. The hero display headline begins at roughly 100px from the top and fills the remaining viewport. Sections flow vertically with 80–160px gaps, never alternating light and dark bands. There is no visible grid, no card system, no sidebar — just monumental type cascading down the page like a single column of poster art.

## Agent Prompt Guide

## Quick Color Reference
- text: #262523
- background: #ececec
- secondary surface: #cfcdcd
- border: #cfcdcd
- accent: none
- primary action: no distinct CTA color

## Example Component Prompts

1. **Display Hero Headline**: Full-bleed, edge-to-edge. Set in Basis weight 400, size 160px, line-height 0.82, letter-spacing -9.6px, color #262523. Begin text at 100px from viewport top, left-align to the viewport edge (no max-width). Allow the final line to end with a period. Optionally replace one letter per line with a pictogram glyph (heart, asterisk, peace sign, or victory hand) at matching cap-height.

2. **Pictogram Glyph Inline**: A monochrome line-art icon (heart, asterisk, peace sign, or victory hand) sized to match the cap-height of 160px Basis text, color #262523, no fill, stroke weight 8px. Inserted inline to replace a specific letter in a display headline. Never used standalone.

3. **Top Navigation Item**: 12px Basis weight 500, uppercase, letter-spacing -0.24px, color #262523. Separated by 40px gap from adjacent items. Pinned to the top edge of the viewport with 40px horizontal padding from each edge. No background, no border, no underline. Hover state: opacity 0.6 over 200ms.

4. **Section Label Pill**: 10px Basis weight 500, uppercase, letter-spacing -0.2px, color #262523. Background #ececec with 1px #cfcdcd border. 70px border-radius, 6px vertical / 12px horizontal padding. Functions as a quiet wayfinding marker.

5. **Inline Text Link with Arrow**: 12–15px Basis weight 500, color #262523, no underline. Followed immediately by a rightward arrow glyph (→) in the same color and size. Hover state: opacity transitions to 0.6 over 200ms. This is the only interactive pattern in the system.

## Typographic Scale Philosophy

The type scale spans four orders of magnitude — from 10px captions to 640px hero statements — within a single font family (Basis). This is not a responsive scale; it is a fixed scale of dramatic size contrasts that forces every element on the page to declare its hierarchy through size alone. The smaller end (10–16px) uses -0.02em tracking and 1.2–2.0 line-height for editorial body text. The mid-range (32–40px) steps up to -0.04em tracking and 0.9–1.0 line-height. The display range (120–640px) tightens further to -0.06em to -0.08em tracking with line-height as low as 0.80, which forces words to stack as architectural blocks rather than flow as prose. The 2.0 line-height on 15px body text is deliberately airy — it treats paragraphs as editorial prose, not as UI copy. When in doubt, make it bigger and tighter.

## Similar Brands

- **Pentagram** — Both treat type as architecture — monumental sans-serif headlines that function as visual identity rather than just content, with the wordmark carrying the entire brand
- **Manual** — Same extreme monochrome palette and editorial spread layout — the page is a poster, not a product, with negative space doing the compositional work
- **Ueno** — Same custom-typographic approach and playful pictogram-as-letter substitution in display headlines
- **Resn** — Same integration of hand-drawn pictogram glyphs inline with oversized display text, treating icons as typographic ornaments rather than UI elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-obsidian: #262523;
  --color-bone-white: #ececec;
  --color-pale-ash: #cfcdcd;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-basis-grotesque: 'Basis Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-messina-sans: 'Messina Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 12;
  --tracking-caption: -0.2px;
  --text-body: 15px;
  --leading-body: 30;
  --tracking-body: -0.3px;
  --text-subheading: 32px;
  --leading-subheading: 28.8;
  --tracking-subheading: -1.28px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 40;
  --tracking-heading-sm: -1.6px;
  --text-heading: 120px;
  --leading-heading: 108;
  --tracking-heading: -7.2px;
  --text-heading-lg: 160px;
  --leading-heading-lg: 131.2;
  --tracking-heading-lg: -9.6px;
  --text-display: 240px;
  --leading-display: 240;
  --tracking-display: -19.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-16: 16px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 70px;

  /* Named Radii */
  --radius-tags: 70px;
  --radius-cards: 10px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-canvas: #ececec;
  --surface-subtle-surface: #cfcdcd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-obsidian: #262523;
  --color-bone-white: #ececec;
  --color-pale-ash: #cfcdcd;
  --color-pure-black: #000000;

  /* Typography */
  --font-basis-grotesque: 'Basis Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-messina-sans: 'Messina Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 12;
  --tracking-caption: -0.2px;
  --text-body: 15px;
  --leading-body: 30;
  --tracking-body: -0.3px;
  --text-subheading: 32px;
  --leading-subheading: 28.8;
  --tracking-subheading: -1.28px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 40;
  --tracking-heading-sm: -1.6px;
  --text-heading: 120px;
  --leading-heading: 108;
  --tracking-heading: -7.2px;
  --text-heading-lg: 160px;
  --leading-heading-lg: 131.2;
  --tracking-heading-lg: -9.6px;
  --text-display: 240px;
  --leading-display: 240;
  --tracking-display: -19.2px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 70px;
}
```
