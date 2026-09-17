# Fey — Style Reference
> a printed broadsheet on warm paper — type and silence, nothing else.

**Theme:** light

Fey operates as a quiet editorial announcement — a near-empty white page where a single column of 21px serif-quality system text does all the talking. The entire visual system reduces to two ink tones on warm off-white: a graphite body for narrative and a near-black for emphasis and the one link. There are no buttons, cards, icons, or color accents — the restraint IS the design. Layout is centered and narrow (~520px column), with generous vertical rhythm between paragraphs and a small left-edge navigation index that acts as the only structural decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Paper | `#fafafa` | `--color-warm-paper` | Page background — the only surface; everything floats on this warm off-white |
| Graphite | `#595959` | `--color-graphite` | Body text, nav labels, footer copy — medium-dark gray keeps long-form reading comfortable without high-contrast harshness |
| Ink | `#1c1c1c` | `--color-ink` | Secondary body text, navigation labels, and subdued headings. |

## Tokens — Typography

### -apple-system — Body and navigation. At 21px / 600 / line-height 1.55 with -0.01em tracking, the system stack carries the entire page — the signature is the size and rhythm, not a custom face. 13px / 400 nav labels use the same -0.002em micro-tracking. A 16px / 400 utility size appears for small captions. · `--font-apple-system`
- **Substitute:** Inter or SF Pro Text
- **Weights:** 400, 600
- **Sizes:** 13px, 16px, 21px
- **Line height:** 1.20, 1.55
- **Letter spacing:** -0.0100em, -0.0020em
- **Role:** Body and navigation. At 21px / 600 / line-height 1.55 with -0.01em tracking, the system stack carries the entire page — the signature is the size and rhythm, not a custom face. 13px / 400 nav labels use the same -0.002em micro-tracking. A 16px / 400 utility size appears for small captions.

### Wealthsimple Sans Display — Reserved for the "Wealthsimple" link — a single display-grade cut at 21px / 700 / -0.01em. It signals partnership without changing the page's monochrome restraint. · `--font-wealthsimple-sans-display`
- **Substitute:** Inter (weight 700) or GT Walsheim Bold
- **Weights:** 700
- **Sizes:** 21px
- **Line height:** 1.55
- **Letter spacing:** -0.0100em
- **Role:** Reserved for the "Wealthsimple" link — a single display-grade cut at 21px / 700 / -0.01em. It signals partnership without changing the page's monochrome restraint.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.55 | — | `--text-caption` |
| body-sm | 16px | 1.55 | — | `--text-body-sm` |
| body | 21px | 1.55 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 29 | 29px | `--spacing-29` |

### Border Radius

| Element | Value |
|---------|-------|
| none | 0px |

### Layout

- **Page max-width:** 520px
- **Section gap:** 48px
- **Card padding:** 0px
- **Element gap:** 8px

## Components

### Editorial Text Column
**Role:** Main content container

A narrow centered column (~520px max-width) holding 3-4 paragraphs of 21px / 600 body text at line-height 1.55. Paragraphs separated by ~29px margin-bottom. No headings, dividers, or decorative elements — just text on #fafafa.

### Inline Emphasis Word
**Role:** Inline bold highlight within a paragraph

Selected words ("Fey joined", "Everything", "Fey", "Wealthsimple") rendered at the same 21px size but in #1c1c1c instead of #595959, using weight 600. Creates contrast within the same line without changing scale or family.

### Inline Text Link
**Role:** The single navigational link in the body

"Wealthsimple" rendered in #1c1c1c at 21px / 600 / -0.01em, optionally in Wealthsimple Sans Display 700. No underline by default; relies on weight and color shift to signal interactivity.

### Signature Hand-Off Glyphs
**Role:** Closing illustration

Three small hand-drawn line illustrations beneath the final paragraph, in #595959 stroke at ~16px height. The closing visual punctuation of the announcement — informal marks replacing a button or CTA.

## Do's and Don'ts

### Do
- Set body copy at 21px / weight 600 / line-height 1.55 with -0.01em tracking — this IS the brand voice.
- Use exactly two text colors: #595959 for narrative and #1c1c1c for emphasis and links. Nothing else.
- Constrain content to a ~520px centered column; let white space do the layout work.
- Separate paragraphs with ~29px margin-bottom for editorial rhythm.
- Keep the page to a single surface color (#fafafa) — no cards, no panels, no shadows.

### Don't
- Do not introduce accent colors, buttons, or CTAs — this page is a declaration, not an action.
- Do not add headings (h1/h2/h3) — the 21px body carries the hierarchy through weight and color alone.
- Do not use shadows, borders, or background fills on text containers.
- Do not break the 520px column with sidebars, images, or multi-column layouts.
- Do not use a display or serif font for body copy — the system stack at 21px / 600 is the intended voice.
- Do not add hover states beyond color/weight transitions on links; no transform, scale, or shadow effects.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Warm Paper | `#fafafa` | The only surface — page background and text container share this single warm off-white |

## Elevation

No elevation. The design deliberately avoids shadows, borders, and surface layering — everything exists on a single flat plane (#fafafa). Hierarchy is created through type weight, color contrast, and whitespace alone.

## Imagery

Pure typography page — no photography, no product screenshots, no illustration beyond three small hand-drawn line glyphs at the bottom that serve as a closing signature. The visual language is absence: white space, two ink tones, and the texture of the type itself.

## Layout

Single narrow centered column (~520px max-width) on a full-bleed #fafafa canvas. No hero, no grid, no sections — just one vertical flow of text paragraphs separated by ~29px gaps, with a tiny left-edge nav indicator aligned to the column. The page reads top-to-bottom like a printed letter: announcement, context, continuation, signature marks.

## Agent Prompt Guide

Quick Color Reference:
- text: #595959 (body) / #1c1c1c (emphasis + links)
- background: #fafafa
- border: none
- accent: none
- primary action: no distinct CTA color

Example Component Prompts:
1. "Create an editorial announcement page: full-bleed #fafafa background, a single centered column at 520px max-width. Body paragraphs at 21px, -apple-system, weight 600, line-height 1.55, letter-spacing -0.01em, color #595959. Paragraphs separated by 29px margin-bottom. No headings, no cards, no buttons."
2. "Add inline emphasis: render 'Fey joined' at the same 21px / 600 / -0.01em, but in color #1c1c1c instead of #595959. No underline, no background — color and weight carry the contrast."
3. "Create the single text link: 'Wealthsimple' at 21px / 600 / -0.01em, color #1c1c1c, optionally in Wealthsimple Sans Display weight 700. No default underline; let color signal interactivity."
4. "Add the left-edge nav indicator: five thin horizontal lines at the page's left margin (40px from viewport edge), 8px row-gap between lines, in #595959. Vertically centered against the text column."
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Similar Brands

- **Stripe Press** — Same editorial restraint — a single narrow column of type on warm white, no CTAs, no accent colors, narrative voice carrying the page
- **Linear Changelog** — Monochrome announcement pages with system-stack typography at a single comfortable size, using whitespace and type rhythm instead of visual decoration
- **Substack Blog** — Centered narrow text column on off-white with generous paragraph spacing — reading-first layout that treats type as the entire design

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-paper: #fafafa;
  --color-graphite: #595959;
  --color-ink: #1c1c1c;

  /* Typography — Font Families */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wealthsimple-sans-display: 'Wealthsimple Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.55;
  --text-body-sm: 16px;
  --leading-body-sm: 1.55;
  --text-body: 21px;
  --leading-body: 1.55;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-29: 29px;

  /* Layout */
  --page-max-width: 520px;
  --section-gap: 48px;
  --card-padding: 0px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-none: 0px;

  /* Surfaces */
  --surface-warm-paper: #fafafa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-paper: #fafafa;
  --color-graphite: #595959;
  --color-ink: #1c1c1c;

  /* Typography */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wealthsimple-sans-display: 'Wealthsimple Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.55;
  --text-body-sm: 16px;
  --leading-body-sm: 1.55;
  --text-body: 21px;
  --leading-body: 1.55;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-29: 29px;
}
```
