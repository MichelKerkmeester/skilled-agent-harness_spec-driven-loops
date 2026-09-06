# Getclockwise — Style Reference
> monogrammed letterhead on cream paper — a warm, editorial announcement, not a product page

**Theme:** light

Clockwise speaks in a warm, paper-like voice: cream canvas, deep forest-green ink, and generous white space that lets short paragraphs breathe. The design is editorial rather than product-UI — think a well-typeset letter rather than a dashboard. A single custom display face (PP Mori) carries every heading at 52–66px with tight line-heights, while Inter handles body text with a subtle -0.03em tracking. The palette is ruthlessly restrained: nearly every visual element is either warm off-white, deep green ink, or a hairline border. Pill-shaped radii (800px) wrap around tags, buttons, and logo containers, giving every rounded element the same soft capsule form. Interactivity is whisper-quiet — no filled CTA buttons, no heavy shadows, no gradients — just a vivid emerald accent (#039861) that appears on ghost-style links and section rules.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#003f2e` | `--color-forest-ink` | Primary brand color, headlines, logo mark, body emphasis, heavy borders, dark surface blocks — deep emerald reads as ink-stamp rather than digital green, anchoring every page with editorial weight |
| Vivid Emerald | `#039861` | `--color-vivid-emerald` | Outlined/ghost link borders, thin section rules, and occasional icon accents — the only chromatic accent in the system, used sparingly so it reads as a signal rather than decoration |
| Cream Canvas | `#fdf9f7` | `--color-cream-canvas` | Page background, document body — warm off-white gives the entire site a paper-like, non-screen feel |
| Pure Paper | `#ffffff` | `--color-pure-paper` | Card and elevated surfaces layered above the cream canvas |
| Ink Black | `#333333` | `--color-ink-black` | Primary body and link text on light surfaces — softened pure black to feel printed rather than digital |
| Faded Pencil | `#6e7673` | `--color-faded-pencil` | Muted body text, secondary metadata, helper copy |
| Hairline Gray | `#d6d6d6` | `--color-hairline-gray` | Light borders, dividers, accordion separators, subtle structural rules |
| Mid Gray | `#a6a6a6` | `--color-mid-gray` | Medium-weight borders, icon strokes, secondary dividers |

## Tokens — Typography

### PP Mori — All headings and display text — the custom geometric face gives headlines a distinctive modern character unavailable in system fonts; tight line-heights (0.95–1.00) make large display sizes stack into compact, poster-like blocks · `--font-pp-mori`
- **Substitute:** DM Serif Display, or as fallback: Söhne Breit, General Sans
- **Weights:** 600, 700
- **Sizes:** 23px, 52px, 64px, 66px
- **Line height:** 0.95–1.20
- **Role:** All headings and display text — the custom geometric face gives headlines a distinctive modern character unavailable in system fonts; tight line-heights (0.95–1.00) make large display sizes stack into compact, poster-like blocks

### Inter — Body text, subheadings, UI labels, and smaller headings — the -0.03em tracking tightens Inter enough to read as editorial body copy rather than default system text · `--font-inter`
- **Weights:** 400, 500, 700
- **Sizes:** 16px, 18px, 20px, 23px, 24px
- **Line height:** 1.30–1.40
- **Letter spacing:** -0.03em (≈ -0.48px at 16px, -0.72px at 24px)
- **Role:** Body text, subheadings, UI labels, and smaller headings — the -0.03em tracking tightens Inter enough to read as editorial body copy rather than default system text

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.4 | -0.48px | `--text-body` |
| body-lg | 18px | 1.4 | -0.54px | `--text-body-lg` |
| subheading | 20px | 1.3 | -0.6px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.72px | `--text-heading-sm` |
| heading | 52px | 1 | — | `--text-heading` |
| heading-lg | 64px | 1 | — | `--text-heading-lg` |
| display | 66px | 0.95 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 800px |
| cards | 0px |
| logos | 800px |
| buttons | 800px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20-40px
- **Element gap:** 20px

## Components

### Display Headline
**Role:** Primary page-level heading

PP Mori weight 600–700 at 52–66px, color #003f2, line-height 0.95–1.00, center-aligned. The compact line-height is signature — large sizes stack into a tight visual block rather than spreading across multiple lines.

### Body Paragraph
**Role:** Long-form editorial text

Inter 400 at 18px, color #333333, line-height 1.40, max-width ~640px centered. Generous margin-bottom (20–32px) between paragraphs. Reads as letter or announcement copy, not interface text.

### Ghost Link Button
**Role:** Primary action and navigation link

No filled background. Inter 500 at 16–18px, color #039861, with a 1px #039861 bottom border. Pill or text-only form. The lack of a filled CTA is signature — the brand never shouts for clicks.

### FAQ Accordion Item
**Role:** Expandable question/answer block

Question in Inter 700 at 16–18px, color #003f2e. Plus-icon toggle in a 1px #003f2 circle outline (pill radius). Answer body in Inter 400 at 16px, #333333. Hairline #d6d6d6 divider between items.

### Pill Badge / Tag
**Role:** Inline label or category marker

Fully rounded 800px radius, 8px vertical / 14–20px horizontal padding, Inter 500 at 14–16px, color #003f2 on #fdf9f7 or transparent background with 1px #003f2 border.

### Client Logo Grid
**Role:** Social proof / customer showcase

3-column grid on desktop, each cell ~200px wide, logos rendered in their native brand colors against #ffffff cells. Equal column gaps of 32–48px. No card chrome — logos float directly on the cream canvas.

### Stat Block
**Role:** Large quantitative highlight

PP Mori 700 at 52–66px, color #003f2 for the number, followed by Inter 400 at 16–18px label in #333333. Center-aligned, minimal spacing between number and label (~8px). The number does the visual work; the label whispers beneath.

### Section Divider
**Role:** Horizontal separator between content blocks

1px solid #d6d6d6, full container width, used between FAQ items and before/after major sections. Sometimes rendered as a vivid #039861 rule for emphasis.

### Logo Mark
**Role:** Brand identity anchor

Diamond/compass glyph in #003f2 paired with 'clockwise' wordmark in PP Mori or Inter weight 600, same green. Centered above headlines. The mark is flat, geometric, and unembellished.

## Do's and Don'ts

### Do
- Use PP Mori weight 600–700 for all headings; set line-height to 0.95–1.00 at 52px+ to keep display text compact and poster-like.
- Apply -0.03em letter-spacing to all Inter text to achieve the editorial, non-system feel.
- Use 800px border-radius for all pills, buttons, and logo containers — this is the system's only radius shape.
- Anchor every page on the #fdf9f7 cream canvas; use #ffffff only for card/elevated surfaces above it.
- Limit #039861 to link borders, thin rules, and icon accents — never as a filled background or large surface.
- Set body text max-width to ~640px and center it for editorial readability, even on wide pages.
- Use #d6d6d6 hairline dividers (1px) between repeated items like FAQ entries and logo grid rows.

### Don't
- Do not introduce filled CTA buttons or colored background buttons — the system uses ghost/outlined links only.
- Do not apply drop shadows, glows, or elevation effects — the design is flat and paper-like.
- Do not use system fonts as a fallback for PP Mori headlines; substitute with a geometric serif or grotesque of similar character.
- Do not use #039861 for body text, headings, or large surfaces — it is an accent signal, not a structural color.
- Do not use sharp 0px radii on pills or buttons — the capsule form is system-defining.
- Do not use pure #000000 for text — soften to #333333 to maintain the printed, non-digital tone.
- Do not add gradients, textures, or background patterns to any surface.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#fdf9f7` | Base page background — warm paper tone |
| 1 | Pure Paper | `#ffffff` | Cards, elevated content blocks, logo cells |
| 2 | Forest Ink Surface | `#003f2` | Dark inverted sections, footer, brand blocks |

## Elevation

The design is intentionally flat — no box-shadows, no elevation stacking. Depth is achieved through surface color contrast alone: cream canvas → white card → forest-green block. Borders are hairline (1px) rather than shadowed.

## Imagery

No photography, illustration, or decorative graphics on this page. The visual system is pure typography and logo marks. Client logos in the social-proof grid are the only graphical content, rendered in each brand's native color treatment against white cells. The page reads as an editorial document, not a visual showcase.

## Layout

Single-column, centered, max-width ~1200px page container with body text constrained to ~640px. The hero is a centered logo + headline + subtitle stack on the cream canvas. Below the fold, the FAQ section uses a single column of accordion items separated by hairlines. The client logo grid is a 3-column matrix of equal cells. The stat block is a 2-column centered pair of large numbers with labels. No sidebar, no multi-column body text, no asymmetric layouts — everything is vertically stacked and center-aligned.

## Agent Prompt Guide

**Quick Color Reference**
- text: #333333
- heading: #003f2e
- background: #fdf9f7
- surface (card): #ffffff
- border: #d6d6d6
- accent link: #039861
- primary action: #039861 (outlined action border)

**Example Component Prompts**

1. *Hero announcement block*: Cream canvas (#fdf9f7). Centered logo (diamond mark + 'clockwise' wordmark, both #003f2e). Headline at 64px PP Mori weight 600, #003f2e, line-height 1.0. Subtitle at 20px Inter weight 400, #6e7673, line-height 1.30. 64px vertical padding above and below.

2. *Body text paragraph*: Max-width 640px, centered. Inter 400 at 18px, #333333, line-height 1.40, letter-spacing -0.54px. 32px margin-bottom between paragraphs. Cream canvas background.

3. *FAQ accordion item*: Full-width row with 1px #d6d6d6 top border. Question in Inter 700 at 18px, #003f2e. Plus-icon toggle: 32px circle with 1px #003f2e border, 800px radius. Expanded answer in Inter 400 at 16px, #333333.

4. *Stat highlight*: Two-column centered pair. Number in PP Mori 700 at 66px, #003f2e, line-height 0.95. Label in Inter 400 at 16px, #333333, 8px gap above. 48px gap between the two stat columns.

5. *Client logo grid*: 3-column grid, 32px gaps, each cell on #ffffff background with no border. Logos centered in each cell, ~120px wide. Full grid centered in a max-width 1200px container.

## Similar Brands

- **Notion** — Same warm off-white background with deep near-black text and a single brand accent used sparingly on links and key elements
- **Linear** — Both use a custom display face for headlines with tight line-heights, and Inter for body, creating the same editorial-meets-product tension
- **Stripe** — Deep brand-color headings on warm white canvas with generous vertical spacing and pill-shaped UI elements
- **Substack** — Editorial, letter-like layout with centered single-column body text, serif or distinctive display headings, and minimal chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #003f2e;
  --color-vivid-emerald: #039861;
  --color-cream-canvas: #fdf9f7;
  --color-pure-paper: #ffffff;
  --color-ink-black: #333333;
  --color-faded-pencil: #6e7673;
  --color-hairline-gray: #d6d6d6;
  --color-mid-gray: #a6a6a6;

  /* Typography — Font Families */
  --font-pp-mori: 'PP Mori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.48px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.54px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.72px;
  --text-heading: 52px;
  --leading-heading: 1;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --text-display: 66px;
  --leading-display: 0.95;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20-40px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-full: 800px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 800px;
  --radius-cards: 0px;
  --radius-logos: 800px;
  --radius-buttons: 800px;

  /* Surfaces */
  --surface-cream-canvas: #fdf9f7;
  --surface-pure-paper: #ffffff;
  --surface-forest-ink-surface: #003f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #003f2e;
  --color-vivid-emerald: #039861;
  --color-cream-canvas: #fdf9f7;
  --color-pure-paper: #ffffff;
  --color-ink-black: #333333;
  --color-faded-pencil: #6e7673;
  --color-hairline-gray: #d6d6d6;
  --color-mid-gray: #a6a6a6;

  /* Typography */
  --font-pp-mori: 'PP Mori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.48px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.54px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.72px;
  --text-heading: 52px;
  --leading-heading: 1;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --text-display: 66px;
  --leading-display: 0.95;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-full: 800px;
  --radius-full-2: 9999px;
}
```
