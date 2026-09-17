# Syllabus — Style Reference
> cream-paper magazine meets geometric sans-serif. Warm off-white surfaces, near-black violet ink, and one buttery yellow accent that functions as the page's only raised voice — like a sticky note pressed onto fine stationery.

**Theme:** light

Syllabus operates as a warm, editorial-tech environment: a cream paper-like canvas with deep violet as the near-black structural color, punctuated by buttery yellow interactive surfaces and teal section blocks. The aesthetic reads like a premium print magazine reinterpreted as a product — flat illustrations with selective color fills, generous vertical breathing room, and confident oversized headlines. Typography is restrained to one custom geometric sans (Roobert) that carries personality through scale jumps rather than weight contrast. The single signature trick: yellow CTA buttons with a hard offset shadow, turning every action into a physical, pressable artifact against the cream.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Violet | `#0d0129` | `--color-ink-violet` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Butter Yellow | `#fae59b` | `--color-butter-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Deep Teal | `#19615c` | `--color-deep-teal` | Dark section backgrounds for contrasting content blocks and nav text. Used as a full-bleed band color when a section needs to shift away from the cream canvas into a more saturated, grounded tone |
| Cream Paper | `#fffcf7` | `--color-cream-paper` | Primary page canvas and card surface — replaces the default pure white. The slight warm tint is the most distinctive choice in the system; it makes the violet ink and yellow accent feel intentional rather than stark |
| Pure White | `#ffffff` | `--color-pure-white` | Inset card surfaces and elevated panels layered over the cream canvas. Used when a component needs to feel lifted off the paper without introducing a tint |
| Shadow Black | `#000000` | `--color-shadow-black` | Hard-offset button shadow color and SVG illustration fills. Never used as text or large surface — only as the 1–3px offset shadow behind Butter Yellow buttons and as fill on line-art elements that need maximum contrast |

## Tokens — Typography

### Roobert — The sole typeface across the system. Weight 700 reserved for display headlines and button labels; weight 400 for body, nav, and subheadings. The custom geometric forms give the cream-paper palette its modern editorial backbone — a system font would flatten the identity. · `--font-roobert`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 400, 700
- **Sizes:** 16, 20, 24, 40, 48, 56, 64
- **Line height:** 1.25–2.0 (tight for display, generous for body)
- **Letter spacing:** normal at all sizes; the wide size jumps carry visual hierarchy instead of tracking
- **Role:** The sole typeface across the system. Weight 700 reserved for display headlines and button labels; weight 400 for body, nav, and subheadings. The custom geometric forms give the cream-paper palette its modern editorial backbone — a system font would flatten the identity.

### Supply — Secondary use at 20px body size for supporting paragraphs in illustration-adjacent contexts. The monospace-adjacent quality suggests a technical or data-oriented voice; treat it as a sparing accent, not a co-equal voice. · `--font-supply`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 20
- **Line height:** 1.60
- **Role:** Secondary use at 20px body size for supporting paragraphs in illustration-adjacent contexts. The monospace-adjacent quality suggests a technical or data-oriented voice; treat it as a sparing accent, not a co-equal voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.6 | — | `--text-body-sm` |
| body | 20px | 1.6 | — | `--text-body` |
| subheading | 24px | 1.4 | — | `--text-subheading` |
| heading-sm | 40px | 1.27 | — | `--text-heading-sm` |
| heading | 48px | 1.25 | — | `--text-heading` |
| heading-lg | 56px | 1.25 | — | `--text-heading-lg` |
| display | 64px | 1.25 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(0, 0, 0) 1px 1px 3px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 40px
- **Element gap:** 24px

## Components

### Primary CTA Button (Butter Yellow)
**Role:** The signature action button for in-page conversions

Fill: #fae59b. Border: 1px solid #0d0129. Text: 'JOIN WAITLIST' in Roobert 700, uppercase, tracked, ~14–16px, color #0d0129. Padding: ~16px 32px. Box-shadow: 1px 1px 3px 0px #000000 (hard offset, not soft). Radius: 0px (sharp corners). The shadow offset and 1px border combine to make the button feel like a physical sticker pressed onto the cream surface.

### Navigation CTA Button (Ink Violet)
**Role:** Top-bar 'Join Waitlist' button in the header

Fill: #0d0129. Text: 'Join Waitlist' in Roobert 700, white or cream, ~16px. Padding: ~10px 20px. Radius: 0px. No shadow. Reads as a solid, confident block against the cream nav — the inverse of the yellow in-page button.

### Ghost Nav Link
**Role:** Standard navigation text links ('Request a Demo', 'Log In')

No background, no border. Text: Roobert 400, ~16px, color #0d0129. Hover state likely darkens or underlines. Sits flush left/right in the nav bar with the solid CTA button at the far end.

### Cream Card
**Role:** Content blocks and feature containers on the cream canvas

Background: #fffcf7 (matches canvas, so cards are defined by border alone) or #ffffff for lifted panels. Border: 1px solid #0d0129. Radius: 0px. Padding: 40px. The 1px Ink Violet border is the primary structural device — it outlines content blocks like a print frame.

### Teal Section Block
**Role:** Full-bleed dark section that shifts the page from cream to teal

Background: #19615c. Text: #fffcf7 (cream) for headlines and body. Yellow (#fae59b) used for accent dots, illustration highlights, and small labels inside the block. Typically used for problem-statement or contrast sections. Padding: 64–80px vertical, 80–150px horizontal.

### Hero Headline
**Role:** Primary page-level display text

Roobert 700, 48–64px, line-height 1.25, color #0d0129. Sentence-case or title-case depending on context. The headline is the largest typographic event on any page; no decorative elements precede or follow it — pure type on cream.

### Body Paragraph
**Role:** Standard descriptive text in hero, sections, and feature descriptions

Roobert 400, 20px, line-height 1.6, color #0d0129. On teal sections, color shifts to #fffcf7. Maximum measure should stay around 60–70 characters for readability.

### Line-Art Illustration Panel
**Role:** Decorative and explanatory graphics (dashboard mocks, workflow diagrams, data charts)

Stroke: 1–1.5px #0d0129 lines on #fffcf7 or #ffffff fills. Selective color fills: #fae59b for highlighted areas, #19615c for secondary elements. No gradients, no shadows. Illustrations are flat, geometric, and read as schematic diagrams — wireframe quality, not polished marketing renders.

### Illustration Container Card
**Role:** Outlined frame wrapping a complex illustration in the hero or feature sections

Background: #ffffff. Border: 1px solid #0d0129. Radius: 0px. Contains overlapping illustration elements (browser mock, document, chart) that visually break past the card edges to suggest depth — a flat-design 'isometric explosion' pattern.

### Accent Dot
**Role:** Small decorative marks within illustrations and diagrams

Circles ~4–8px diameter, fill #fae59b. Scattered around line-art illustrations to add visual interest and guide the eye. On teal sections, they may also appear as #fffcf7 dots.

### Teal Section Heading
**Role:** Headlines within dark teal content blocks

Roobert 700, 40–48px, line-height 1.27, color #fffcf7. Two-column body layout below: one column is supporting text, the other is the product value proposition — both in cream on teal.

## Do's and Don'ts

### Do
- Set page background to #fffcf7 — never use pure #ffffff as the canvas, the warm cream is the system's identity
- Use #fae59b with the 1px 1px 3px #000000 hard-offset shadow for every primary in-page CTA — the shadow is non-negotiable, it creates the pressable sticker effect
- Use the Roobert 700 / 400 weight pair at the 16→20→24→40→48→56→64px scale jumps — do not interpolate intermediate sizes, the jumps are the hierarchy
- Outline cards and illustration containers with exactly 1px solid #0d0129 — no rounded corners (radius 0), no drop shadows
- Switch section backgrounds to #19615c and text to #fffcf7 when a section needs tonal contrast — keep the switch full-bleed, not boxed
- Use #fae59b for small interactive accents (dot decorations, illustration highlights) at 4–8px size — never as a large fill or background wash
- Keep illustration strokes between 1–1.5px in #0d0129 and let selective yellow/teal fills do the color work — never add gradients or realistic shading to illustrations

### Don't
- Don't use #ffffff as the page background — the cream #fffcf7 canvas is the signature; pure white flattens the entire system
- Don't apply border-radius to buttons, cards, tags, or inputs — every container in this system is sharp-cornered (radius: 0)
- Don't use soft, blurred, or multi-layer drop shadows — the only shadow is the 1px hard-offset black on yellow buttons
- Don't use #0d0129 as a filled CTA button background on the cream canvas — the yellow button is the in-page CTA; violet-filled buttons are reserved for the nav
- Don't introduce additional typefaces, weights between 400 and 700, or font sizes outside the 16–64px scale — the type system is deliberately narrow
- Don't use photography, 3D renders, or realistic product mockups — all imagery is flat line-art with selective color fills
- Don't use gradients of any kind — the system is entirely flat color, including illustrations and buttons

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#fffcf7` | Base page background — warm off-white that replaces pure white throughout the site |
| 1 | White Card | `#ffffff` | Inset card and panel surfaces layered over the cream canvas for quiet elevation |
| 2 | Teal Block | `#19615c` | Full-bleed dark section backgrounds when content needs a tonal shift |

## Elevation

- **Butter Yellow CTA Button:** `1px 1px 3px 0px #000000`

## Imagery

All visuals are flat line-art illustrations, not photography. The illustration system uses 1–1.5px Ink Violet strokes on white or cream fills, with selective Butter Yellow and Deep Teal color fills for highlights and data elements. Illustrations depict abstract product interfaces — browser windows, document outlines, bar charts, pie charts, workflow nodes — rendered as schematic wireframes rather than realistic mockups. The aesthetic is blueprint-meets-editorial: confident geometry, no shadows, no gradients, no 3D. Illustrations often overlap and break container boundaries to create layered compositions. No photography or product photography appears anywhere; the visual world is 100% drawn. Icon style within illustrations: outlined, thin stroke, monochrome Ink Violet with occasional yellow accent.

## Layout

Max-width 1200px centered container, with horizontal padding of 80–150px at large breakpoints. The hero is a two-column split: left side holds the headline, body text, and a single Butter Yellow CTA; right side contains a layered line-art illustration with overlapping mock elements that break the right edge. Sections stack vertically with 120px gaps, alternating between cream-canvas and full-bleed teal sections. Teal sections use a two-column body layout (supporting text left, product pitch right) with a smaller line-art illustration above. The navigation is a minimal top bar: logo left, two ghost links and one solid Ink Violet CTA right, no mega-menu, no sidebar. The overall rhythm is editorial-magazine: generous vertical space, large type, and one illustration per major section rather than a scroll of dense visuals.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0d0129 (Ink Violet — body and headings on cream)
- background: #fffcf7 (Cream Paper — page canvas)
- card surface: #ffffff (Pure White — lifted panels over cream)
- border: #0d0129 (Ink Violet — 1px structural outlines)
- accent: #fae59b (Butter Yellow — decorative dots, illustration highlights)
- primary action: #0d0129 (outlined action border)

**3 Example Component Prompts**

1. Create an Outlined Primary Action: Transparent background, #0d0129 border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

2. **Teal Problem Section**: Full-bleed background #19615c with 64–80px vertical padding. Inside 1200px max-width: two-column layout. Left column: heading in Roobert 700, 48px, line-height 1.27, color #fffcf7. Below at 40px gap: two body paragraphs in Roobert 400, 20px, line-height 1.6, color #fffcf7, separated by 24px. Right column: a smaller line-art illustration in 1px cream (#fffcf7) strokes with selective #fae59b yellow fills, depicting a broken workflow diagram. Scattered #fae59b dots (4–6px) around the illustration.

3. **Outlined Feature Card**: Background #ffffff, border 1px solid #0d0129, padding 40px, radius 0px. Heading in Roobert 700, 24px, color #0d0129, margin-bottom 16px. Body text in Roobert 400, 20px, line-height 1.6, color #0d0129. An outlined ghost button at 24px gap below the body: transparent background, border 1px solid #0d0129, text 'Learn more →' in Roobert 400, 16px, color #0d0129, padding 10px 20px, radius 0px.

## Similar Brands

- **Linear** — Same sharp-cornered 0px-radius cards, thin 1px borders for structural definition, and custom geometric sans-serif typography carrying the brand voice
- **Notion** — Same editorial-meets-product feel with flat line-art illustrations, warm off-white surfaces, and a single accent color used sparingly for interactive elements
- **Pitch** — Same cream-paper canvas treatment, large confident display headlines in a custom geometric sans, and flat schematic-style illustrations in place of product photography
- **Arc** — Same commitment to a warm non-white canvas, hard-offset shadows on interactive elements, and a near-black brand color that reads as black but carries a subtle chromatic undertone

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-violet: #0d0129;
  --color-butter-yellow: #fae59b;
  --color-deep-teal: #19615c;
  --color-cream-paper: #fffcf7;
  --color-pure-white: #ffffff;
  --color-shadow-black: #000000;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-supply: 'Supply', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 20px;
  --leading-body: 1.6;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.27;
  --text-heading: 48px;
  --leading-heading: 1.25;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.25;
  --text-display: 64px;
  --leading-display: 1.25;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 40px;
  --element-gap: 24px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 1px 1px 3px 0px;

  /* Surfaces */
  --surface-cream-canvas: #fffcf7;
  --surface-white-card: #ffffff;
  --surface-teal-block: #19615c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-violet: #0d0129;
  --color-butter-yellow: #fae59b;
  --color-deep-teal: #19615c;
  --color-cream-paper: #fffcf7;
  --color-pure-white: #ffffff;
  --color-shadow-black: #000000;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-supply: 'Supply', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 20px;
  --leading-body: 1.6;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.27;
  --text-heading: 48px;
  --leading-heading: 1.25;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.25;
  --text-display: 64px;
  --leading-display: 1.25;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-120: 120px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 1px 1px 3px 0px;
}
```
