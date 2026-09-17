# Wemakethings — Style Reference
> Brutalist editorial broadsheet — ink-on-white architecture with type as the only building material.

**Theme:** light

WeMakeThings operates on a brutally reductive editorial logic: pure black ink on a white paper canvas, with nothing but typography and whitespace to carry the entire visual system. The site reads like a design broadsheet — massive outlined display type acts as architectural scaffolding behind bold all-caps headlines, creating depth and scale without any color, shadow, or imagery. Components are stripped to their skeleton: hairline underlines, thin borders, and direct unadorned type. Density is comfortable with generous margins, and the brand grid uses vertical text columns to turn a simple list into a typographic wall. There is no decoration, no warmth, no gradient — just confident restraint where every pixel earns its place.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, all borders, outline strokes, link underlines, background type fill |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surface, filled button background |

## Tokens — Typography

### Maison Neue — Primary UI and headline typeface — used for nav links, body copy, button text, and bold all-caps hero statements. The 65px weight 500 is the signature headline voice: tight leading (1.11), all-caps, commanding without decorative weight. Substitute: Inter, Helvetica Neue, Neue Haas Grotesk · `--font-maison-neue`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 16px, 18px, 24px, 43px, 65px
- **Line height:** 1.11 / 1.20 / 1.33 / 2.50
- **Role:** Primary UI and headline typeface — used for nav links, body copy, button text, and bold all-caps hero statements. The 65px weight 500 is the signature headline voice: tight leading (1.11), all-caps, commanding without decorative weight. Substitute: Inter, Helvetica Neue, Neue Haas Grotesk

### BASEBLOOM — Architectural display layer — rendered as massive outlined characters (864px, line-height 0.83) that sit behind body content as visual scaffolding, never carrying readable information. Substitute: a custom ultra-condensed display face or CSS stroke text · `--font-basebloom`
- **Substitute:** Custom outlined display type
- **Weights:** 400
- **Sizes:** 864px
- **Line height:** 0.83
- **Role:** Architectural display layer — rendered as massive outlined characters (864px, line-height 0.83) that sit behind body content as visual scaffolding, never carrying readable information. Substitute: a custom ultra-condensed display face or CSS stroke text

### Unzyale — Rare secondary display use — appears in link context at 58px as a typographic accent. Substitute: a condensed or script contrast face · `--font-unzyale`
- **Weights:** 400
- **Sizes:** 58px
- **Line height:** 1.20
- **Role:** Rare secondary display use — appears in link context at 58px as a typographic accent. Substitute: a condensed or script contrast face

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.33 | — | `--text-caption` |
| body-lg | 18px | 1.2 | — | `--text-body-lg` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| heading-sm | 43px | 1.11 | — | `--text-heading-sm` |
| heading | 65px | 1.11 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Site-wide header

Fixed-top bar on white background. Logo mark (five parallel slashes /////) at far left in black, weight 500. Nav links right-aligned in 16px Maison Neue weight 400, all-caps: ABOUT, BRANDS, CAREER, CONTACT, followed by a right arrow (→). Active page is indicated by a thin black underline. No background fill, no border-bottom — the nav floats on white.

### Logo Mark
**Role:** Brand identifier

Five parallel diagonal slashes (/////) in black, functioning as a typographic logogram. No container, no fill — raw glyphs on white.

### Hero Headline Statement
**Role:** Opening page message

Bold all-caps 65px Maison Neue weight 500, line-height 1.11, left-aligned. Black text on white. Tight, commanding, no decoration. Sits in front of massive outlined background type (BASEBLOOM at 864px) that acts as an architectural layer.

### Architectural Background Type
**Role:** Decorative typographic layer

BASEBLOOM or similar outlined display face at 864px, line-height 0.83, rendered as stroke-only outlines. Sits behind body content as a visual landmark — never readable, only structural. Black outlines on white, full-bleed.

### Body Paragraph
**Role:** Informational text

16px Maison Neue weight 400, line-height 1.33, black on white. Left-aligned, max-width constrained for readability (roughly 500-600px column). The supporting sentence beneath the hero is the primary use.

### Inline Section Label
**Role:** Small typographic tag

10-12px Maison Neue weight 500, all-caps, black on white. Used as inline annotations like 'WE MAKE' preceding larger text. Minimal tracking, sits flush with surrounding type.

### Brand Column Card
**Role:** Brand listing entry

Full-height vertical column containing a single brand name written vertically (rotated 90° or stacked). Maison Neue weight 500 at 24-43px, all-caps, black. Columns separated by hairline 1px black vertical borders. No padding between text and edges. The column extends full viewport height, creating a wall of brands.

### Text Link with Arrow
**Role:** Navigation and CTA link

16-18px Maison Neue weight 400, black text, with a → arrow character appended. No button chrome, no background, no padding. On hover, optional thin black underline appears beneath the text.

### Scroll Indicator
**Role:** Page-scroll affordance

Minimal downward-pointing arrow (↓ or ↓) centered at the bottom of the hero section. Black, 16px, no animation specified. Signals vertical scroll continuity.

### Section Divider
**Role:** Inter-section separator

1px black horizontal hairline spanning the full content width. The only structural division between sections. No padding, no background change.

## Do's and Don'ts

### Do
- Use only #000000 and #ffffff — no chromatic colors anywhere in the UI
- Set all headlines in Maison Neue weight 500, all-caps, 43-65px with tight 1.11 line-height
- Render at least one massive outlined display type element (800px+) as architectural scaffolding behind primary content
- Separate brand listings with 1px black hairline borders, not background fills or shadows
- Use Maison Neue weight 400 at 16px with 1.33 line-height for all body copy
- Append → arrow characters to nav links and CTAs — the arrow IS the affordance
- Maintain 80-120px vertical padding between major sections

### Don't
- Never introduce color, gradients, or tinted backgrounds — the system is strictly monochromatic
- Never use border-radius on buttons, cards, inputs, or tags — all corners are sharp at 0px
- Never add drop shadows or box-shadows — depth comes from typographic layering, not elevation
- Never use photographic imagery or illustration — type is the only visual material
- Never use rounded or soft type — all display text is all-caps with tight leading
- Never center body paragraphs — left-align with a constrained reading column
- Never decorate links with fills, pills, or button chrome — links are bare text with optional underline and arrow

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Single uniform surface — the page canvas and all content sits directly on it with no elevation layers |

## Imagery

No photography, illustration, or iconography is used. The visual language is entirely typographic: massive outlined display characters (BASEBLOOM at 864px) serve as architectural backdrops behind readable content, and vertical rotated brand names form visual walls. The logo is a typographic mark (/////). Imagery density is zero — the design treats empty white space as a primary compositional element.

## Layout

Full-bleed layout with no max-width container — sections span 100% viewport width. The hero pattern is a layered typographic composition: massive outlined background type sits behind a bold all-caps headline, left-aligned, with a supporting body paragraph beneath. The brand listing page uses a full-viewport-height grid of vertical text columns, each separated by 1px hairline vertical borders, creating a wall of brands readable only by scrolling. Navigation is a minimal top bar with right-aligned text links. Section rhythm uses generous vertical padding (80-120px) with hairline horizontal dividers rather than background color changes. The overall cadence is slow and editorial — long scroll, high whitespace, low information density per screen.

## Agent Prompt Guide

## Quick Color Reference
- Text / borders: #000000
- Background / surfaces: #ffffff
- primary action: no distinct CTA color

## 3-5 Example Component Prompts

1. **Hero section**: White background (#ffffff). Architectural background layer: outlined display type at 800px+ size, black stroke, 0px fill, positioned full-bleed behind content. Headline: 65px Maison Neue weight 500, all-caps, #000000, line-height 1.11, left-aligned. Supporting paragraph: 16px Maison Neue weight 400, #000000, line-height 1.33. No shadows, no borders, no color.

2. **Brand grid column**: Full-height vertical column, 1px #000000 hairline border-right. Brand name set vertically in 43px Maison Neue weight 500, all-caps, #000000, with a small 'WE MAKE' label at 10px weight 500 above. White background, 0px radius, 20px padding.

3. **Top navigation bar**: 100% width, white background (#ffffff), 20px vertical padding, no border. Left: logo mark (/////) in #000000 at 24px. Right: nav links in 16px Maison Neue weight 400, all-caps, #000000, with 20px gap between items. Active link underlined with 1px #000000. Contact link followed by → character.

4. **Text link / ghost button**: Bare text link, 16px Maison Neue weight 400, #000000, followed by → arrow character at same size. No background, no border, no padding, no radius. Optional 1px #000000 underline on hover.

5. **Section divider**: 1px solid #000000 horizontal line, full content width, 0px margin top/bottom. White space above and below provides rhythm, not the line itself.

## Similar Brands

- **Pentagram** — Same editorial typographic system — bold all-caps headlines, no color, type as the primary visual material, generous whitespace as composition
- **Werkplaats Typografie** — Same brutalist editorial broadsheet aesthetic — pure black/white, large display type, hairlines for structure, no decorative imagery
- **Anrt Archive / Experimental Jetset** — Same architectural type-as-scaffolding approach with outlined display characters behind direct sans-serif statements
- **Bureau Borsche** — Same confident monochromatic restraint with oversized type and hairline-bordered grids as the primary structural device

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-maison-neue: 'Maison Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basebloom: 'BASEBLOOM', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-unzyale: 'Unzyale', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.33;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 43px;
  --leading-heading-sm: 1.11;
  --text-heading: 65px;
  --leading-heading: 1.11;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-maison-neue: 'Maison Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basebloom: 'BASEBLOOM', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-unzyale: 'Unzyale', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.33;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 43px;
  --leading-heading-sm: 1.11;
  --text-heading: 65px;
  --leading-heading: 1.11;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-120: 120px;
}
```
