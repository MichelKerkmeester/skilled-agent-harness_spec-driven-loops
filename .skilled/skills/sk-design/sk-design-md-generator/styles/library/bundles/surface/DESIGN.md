# Surface — Style Reference
> editorial gallery on bone linen — a single 230px word anchors scattered photography against pure off-white, with everything else reduced to a whisper of black type.

**Theme:** light

Surface is a print-publication-shaped digital editorial: a bone-white canvas (#f7f7f7) where almost everything is black type, with the layout itself acting as the brand. The visual system is radical in its restraint — no accent color, no borders, no shadows, no gradients, no rounded corners. Instead, personality comes from the type scale (a 230px display weight) and from deliberately placed editorial photography that breaks the grid at angles. Navigation is reduced to a monogram, a wordmark, and a hamburger. Content sections breathe with wide left margins and generous vertical padding, reading like a magazine spread rather than a web product. An AI agent should treat this as a 'design system of absence' — every added element must earn its place against the white field.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f7f7f7` | `--color-bone` | Page canvas, card surfaces, section backgrounds — the only non-black color in the system |
| Pressed Ink | `#000000` | `--color-pressed-ink` | All text, all borders, all icons, all link states, nav strokes, heading rules — the entire interface communicates in pure black against Bone |

## Tokens — Typography

### Munken Sans Web — Sole typeface for everything. Munken Sans is a Swedish editorial grotesque designed for print — the custom web version preserves the paper-origin feel. Weight 900 at 230px creates the signature display headlines (e.g. 'HOPE'). Weight 700 at 30–40px for section headings. Weight 400 at 16–20px for body. The single-family, three-weight system is the typographic identity — do not introduce a secondary face. · `--font-munken-sans-web`
- **Substitute:** Neue Haas Grotesk, Inter (weight 900), or Aktiv Grotesk
- **Weights:** 400, 700, 900
- **Sizes:** 16, 20, 30, 40, 230
- **Line height:** 1.00 (display), 1.20 (heading), 1.35 (subheading), 1.50 (body/caption)
- **Letter spacing:** normal at all sizes — Munken Sans already has calibrated tracking, do not override
- **Role:** Sole typeface for everything. Munken Sans is a Swedish editorial grotesque designed for print — the custom web version preserves the paper-origin feel. Weight 900 at 230px creates the signature display headlines (e.g. 'HOPE'). Weight 700 at 30–40px for section headings. Weight 400 at 16–20px for body. The single-family, three-weight system is the typographic identity — do not introduce a secondary face.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 20px | 1.5 | — | `--text-body` |
| subheading | 30px | 1.35 | — | `--text-subheading` |
| heading | 40px | 1.2 | — | `--text-heading` |
| display | 230px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 96px
- **Card padding:** 0px
- **Element gap:** 10px

## Components

### Wordmark Navigation
**Role:** Primary site header

Three-element header on a 72px column-gap layout. Left: monogram logo ('AV' with diagonal cut, black). Center: 'ARCTIC VOLUME' in 16px weight 400, letter-spacing normal, all caps. Right: hamburger icon (3 horizontal black lines). No background, no border-bottom, no shadow — the nav floats directly on the Bone canvas. Sticky or static depending on context, but always borderless.

### Display Headline (Hero Word)
**Role:** Anchor element of hero and feature sections

Munken Sans weight 900 at 230px, line-height 1.0, color #000000. The text is a single word or short phrase (e.g. 'HOPE') that occupies the full horizontal canvas. This is the loudest element in the system and the only place a designer earns the right to use 230px. Never apply color, shadow, or decoration — the size and weight alone carry the impact.

### Scattered Editorial Image
**Role:** Photography that frames the display headline

Square or rectangular editorial photographs placed at varying vertical offsets around the display word, creating a collage effect. Images are 0px radius (sharp corners), full-color, no overlays or borders. Positioning is intentionally irregular — not on a grid. Each image can rotate slightly or sit at different scales to create visual rhythm against the massive type.

### Article Heading
**Role:** Section title in long-form content

Munken Sans weight 700 at 30px, line-height 1.35, color #000000. Left-aligned with a 225px left margin from the canvas edge (the content column starts deep into the page). The heading can wrap to 2–3 lines and uses a numbered prefix (e.g. 'Surface N° 3:') to signal editorial structure.

### Body Copy Block
**Role:** Long-form article text

Munken Sans weight 400 at 20px, line-height 1.5, color #000000. Set in the same 225px left-margin column as article headings. Paragraphs run to natural measure (roughly 50–60 characters per line) with no first-line indent and no extra paragraph spacing — the line-height alone creates rhythm. The large body size (20px vs the typical 16px web default) is a signature choice that signals print readability.

### Section Spacer
**Role:** Vertical breathing room between content blocks

96px or 128px of pure Bone canvas between sections. No dividers, no rules, no background shifts — the space itself is the divider. This is a deliberate editorial choice: the absence of visual chrome makes the page feel like a printed spread.

### Inline Link
**Role:** Hyperlinks within body text and navigation

Same type as surrounding text (Munken Sans 400 at 20px) with #000000 color. Underlined to distinguish — the underline is the only link affordance. No color change, no bold shift, no hover animation other than a possible underline thickness change.

### Outlined Action Button
**Role:** Secondary interactive element (rare in this system)

1px solid #000000 border, transparent (#f7f7f7) fill, 6px–14px vertical padding, 38px horizontal padding. Text in Munken Sans weight 400 at 16px, color #000000. 0px radius — sharp corners. The system uses neutral-action-border only, never a chromatic fill. Buttons are minimal; most interactions are text links or image-based.

### Footer
**Role:** Site bottom information

80px horizontal padding, 52px bottom padding. Munken Sans weight 400 at 16px, color #000000. No background change from canvas. Content is sparse — copyright, colophon, social links. The footer is an afterthought by design, not a visual element.

## Do's and Don'ts

### Do
- Use #f7f7f7 for every surface and #000000 for every mark, text, border, and icon — the system is two colors, not one with accents
- Let the display headline do the heavy lifting at 230px weight 900 with line-height 1.0; surround it with generous Bone canvas, not competing elements
- Set body copy at 20px (not 16px) with line-height 1.5 — the oversized body type is a print-publication signature that distinguishes this from typical web UIs
- Apply the 225px left margin to editorial content columns so text reads like a magazine spread, not a centered web page
- Use 96px or 128px section gaps with zero dividers — the white space IS the structure
- Place editorial images at irregular positions and slight rotations around display type to create collage energy; keep all images at 0px radius for sharp print-crop edges

### Don't
- Do not introduce any color beyond #000000 and #f7f7f7 — no blues, no reds, no grays, no hover-state tints
- Do not add box-shadows, gradients, or border-radius — the system is intentionally flat and sharp-cornered
- Do not use a secondary typeface for body, captions, or UI labels; Munken Sans handles everything at three weights
- Do not use accent color, icon backgrounds, or colored badges — information hierarchy comes from size and weight, never hue
- Do not center body text or content columns; left-align everything with the 225px editorial margin
- Do not add card backgrounds, borders, or elevation surfaces — content sits directly on the Bone canvas, period
- Do not use icons that are filled, colored, or multi-stroke; if icons are needed, use 1px-weight single-color black strokes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#f7f7f7` | Page-wide background; the only surface color in the system |
| 2 | Pressed Ink | `#000000` | Type and graphic elements read as the second visual layer against the Bone canvas |

## Imagery

Photography is the only color in the system and serves as the brand's emotional register. Images are editorial: portraits, product shots, still life, and illustrated artwork related to sustainability and design culture. Treatment is full-color, unfiltered, with sharp 0px corners (no rounded crops, no masks, no duotone). Placement is deliberately scattered — images float at irregular positions around the massive display type, sometimes overlapping the letterforms, sometimes hovering at the page edges. The effect is a curated wall or magazine tear-sheet, not a polished e-commerce grid. No lifestyle staging, no overlays, no text-on-image treatments. Images should feel like they were lifted from a printed catalog and pinned to the page.

## Layout

The page model is full-bleed with no max-width container — the Bone canvas extends edge to edge, and content columns are positioned by margin rather than by a centered container. Navigation is a single horizontal row (logo, centered wordmark, hamburger) with 72px column gaps. The hero is the signature: a 230px display word spans the full width while square/rectangular editorial images are scattered at various vertical offsets and positions around it, creating a collage. Below the hero, content sections alternate between full-width image bands and text columns set with a deep 225px left margin. There are no card grids, no pricing tables, no feature matrices — the page reads as a sequence of editorial spreads. Section rhythm is defined by 96–128px vertical gaps with no dividers or background shifts. The overall density is extremely sparse: most of the page is Bone canvas, with text and images acting as deliberate punctuation.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f7f7f7
- border: #000000
- accent: no distinct accent color (system is monochrome)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. **Editorial Hero**: Full-bleed #f7f7f7 canvas. Single display word in Munken Sans weight 900 at 230px, line-height 1.0, color #000000, left-aligned. 4–6 square editorial photographs placed at scattered positions around the word, each 0px radius, no border, no shadow, no rotation restriction.

2. **Article Content Section**: #f7f7f7 background. Article heading in Munken Sans weight 700 at 30px, line-height 1.35, color #000000, positioned with 225px left margin. Body text in Munken Sans weight 400 at 20px, line-height 1.5, color #000000, same 225px left margin, running to natural measure (~55 chars per line). 96px of empty #f7f7f7 space above and below.

3. **Outlined Action Button**: Transparent (#f7f7f7) fill, 1px solid #000000 border, 0px radius, 14px vertical padding, 38px horizontal padding. Label in Munken Sans weight 400 at 16px, color #000000. No hover state color change — only underline or border-weight shift.

4. **Navigation Header**: #f7f7f7 background (no fill, transparent over canvas). Three elements with 72px column gaps: left-side monogram logo in #000000, centered 'ARCTIC VOLUME' wordmark in Munken Sans weight 400 at 16px all-caps color #000000, right-side hamburger icon (3 horizontal #000000 lines). No bottom border, no shadow.

5. **Image-Only Content Block**: Full-width section on #f7f7f7 background. A single editorial photograph at 0px radius, positioned with 80px horizontal padding. 128px of #f7f7f7 space above and below. No caption, no overlay, no text on the image.

## Similar Brands

- **It's Nice That** — Same editorial-publication aesthetic with monochrome canvas, oversized display type, and scattered image placement around headlines
- **Are.na** — Same near-white canvas with pure-black type, no chrome or decoration, and content that breathes against generous white space
- **Kinfolk Magazine** — Same print-magazine DNA: oversized serif-free headlines, generous margins, and editorial photography treated as the primary content
- **Heller Gallery** — Same gallery-wall approach to layout — images scattered at irregular positions against a pure off-white field with minimal UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f7f7f7;
  --color-pressed-ink: #000000;

  /* Typography — Font Families */
  --font-munken-sans-web: 'Munken Sans Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.35;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-display: 230px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --section-gap: 96px;
  --card-padding: 0px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #f7f7f7;
  --surface-pressed-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f7f7f7;
  --color-pressed-ink: #000000;

  /* Typography */
  --font-munken-sans-web: 'Munken Sans Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.35;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-display: 230px;
  --leading-display: 1;

  /* Spacing */
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
}
```
