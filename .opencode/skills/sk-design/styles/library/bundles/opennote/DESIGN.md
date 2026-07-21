# Opennote — Style Reference
> warm leather journal on sunlit paper — the interface feels hand-bound, not engineered

**Theme:** light

Opennote speaks in the voice of a well-loved notebook: warm cream paper, serif headlines that feel hand-set, and a dark-sepia CTA that reads like a leather binding rather than a SaaS button. The palette is almost entirely achromatic — ivory canvas, charcoal ink, hairline graphite rules — with four dark chromatic accents (sepia, ink-violet, forest, oxblood) used sparingly as marginalia, never as fills. Chrome is minimal: a 10px radius, a single border tone, and almost no shadow. Whitespace carries the layout, broken up by hand-drawn line illustrations that float like doodles in a margin. The result is a product that looks like it was designed in a studio with good natural light, not a dashboard that was optimized in a sprint.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ivory Page | `#fffdf8` | `--color-ivory-page` | Primary canvas, page background, card surface. Warm off-white reads as paper, not screen |
| Ink Charcoal | `#0a0a0a` | `--color-ink-charcoal` | Primary text, icon strokes, body copy. Near-black with a touch of warmth against the ivory canvas |
| Pressed Black | `#000000` | `--color-pressed-black` | Illustration fill, SVG marks, fine ink details. Hard black reserved for the hand-drawn graphics layer |
| Graphite Rule | `#e5e5e5` | `--color-graphite-rule` | Hairline borders, dividers, card outlines, image frames. The dominant structural neutral — everything thin on the page is drawn with this |
| Smoke | `#8c8c8c` | `--color-smoke` | Muted helper text, captions, secondary metadata. Reads as pencil-gray against ivory |
| Ash Border | `#d1d1d1` | `--color-ash-border` | Button borders, outlined-control frames, slightly heavier than Graphite Rule |
| Slate Body | `#474747` | `--color-slate-body` | Secondary body copy, subdued icon detail, supporting prose |
| Soft Halo | `#f9f9f9` | `--color-soft-halo` | Alternate surface, recessed panels, secondary card backgrounds beneath the primary ivory |
| Sepia | `#512906` | `--color-sepia` | Primary action fill, filled CTA buttons, key accent text. Dark warm brown reads as leather binding — the brand's single chromatic commitment to interface weight |
| Ink Violet | `#242d64` | `--color-ink-violet` | Feature-panel surface, deep accent headings, large display blocks. The nocturnal counterpart to ivory — used as a full bleed to break the paper rhythm |
| Forest Ink | `#0c3b1a` | `--color-forest-ink` | Secondary accent text, category tags, decorative strokes. Saturated dark green used the way a fountain-pen user might switch inks |
| Oxblood | `#5e0831` | `--color-oxblood` | Tertiary accent, pull-quote emphasis, rare highlight text. The most restrained of the ink colors — deployed once or twice per page at most |
| Margin Yellow | `#ffc934` | `--color-margin-yellow` | Decorative highlighter wash, accent backgrounds, illustration fill. The single vivid color — used as a flat block behind a handful of illustrations and never on chrome |

## Tokens — Typography

### IowanOld — All headlines, hero text, feature titles, and emphasis blocks. The serif carries the 'notebook' voice — its oldstyle proportions, small contrast, and bracketed serifs read as editorial print, not product UI. Weight 400 at 42–48px lets the type feel set, not shouted; weight 500 reserved for the smallest display lines. IowanOld is a custom brand face; substitute with Source Serif Pro, Tiempos Text, or PT Serif. · `--font-iowanold`
- **Substitute:** Source Serif Pro
- **Weights:** 400, 500
- **Sizes:** 16px, 20px, 32px, 42px, 48px
- **Line height:** 1.08–1.50
- **Role:** All headlines, hero text, feature titles, and emphasis blocks. The serif carries the 'notebook' voice — its oldstyle proportions, small contrast, and bracketed serifs read as editorial print, not product UI. Weight 400 at 42–48px lets the type feel set, not shouted; weight 500 reserved for the smallest display lines. IowanOld is a custom brand face; substitute with Source Serif Pro, Tiempos Text, or PT Serif.

### SuisseIntl — All body copy, navigation, button labels, footer text, utility chrome. The neo-grotesque companion stays quiet so the serif can lead. Line-height 1.00 is reserved for the smallest UI text inside compact controls; 1.50 for body paragraphs. SuisseIntl is a custom brand face; substitute with Inter, Söhne, or Helvetica Neue. · `--font-suisseintl`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.00–1.50
- **Role:** All body copy, navigation, button labels, footer text, utility chrome. The neo-grotesque companion stays quiet so the serif can lead. Line-height 1.00 is reserved for the smallest UI text inside compact controls; 1.50 for body paragraphs. SuisseIntl is a custom brand face; substitute with Inter, Söhne, or Helvetica Neue.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 32px | 1.12 | — | `--text-heading-sm` |
| heading | 42px | 1.1 | — | `--text-heading` |
| display | 48px | 1.08 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 10px |
| cards | 10px |
| buttons | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Sepia Filled CTA
**Role:** Primary action button

Background #512906, text #fffdf8, SuisseIntl 14px weight 400, line-height 1.00, padding 8px 16px, radius 10px. The dark warm brown against ivory paper is the brand's signature interaction surface — it reads as a leather label on a book cover. No border, no shadow, no hover elevation — the button just deepens slightly on hover.

### Outlined Ghost Button
**Role:** Secondary action, "Get started free" in header

Transparent background, 1px border #d1d1d1, text #0a0a0a, SuisseIntl 14px, padding 8px 16px, radius 10px. Used when the filled Sepia would compete with the primary action. On dark Ink Violet panels, the border inverts to a light hairline and text becomes ivory.

### Tab Navigation
**Role:** Section-level tab switcher above feature panels

Horizontal row of text-only tabs in SuisseIntl 14px, color #8c8c8c inactive / #0a0a0a active, separated by ~24px gaps. The active tab is the only one without a visual treatment — just a color shift and an underline. No background, no pill, no border.

### Ink Violet Feature Panel
**Role:** Hero feature surface, the single dark section in a page

Full-width surface #242d64, padded generously (40px+ on all sides), with #fffdf8 text. The headline is IowanOld 32–42px and the supporting body SuisseIntl 16px in #fffdf8. A single ghost button with light hairline border anchors the bottom-left. This panel is the page's reset moment — it is the only place the interface stops being paper and starts being book cover.

### University Logo Strip
**Role:** Social proof band beneath the hero

Single row of monochrome wordmark logos (Michigan, NUS, Yale, Waterloo, Caltech, Stanford, CMU, Princeton) set in #0a0a0a on #fffdf8, evenly distributed with ~40px gaps. No card, no background, no caption — the logos float directly on the canvas. Height is the natural cap-height of the marks; no equal-height forcing.

### Centered Hero Block
**Role:** Above-the-fold headline + illustration + single CTA

A small hand-drawn line illustration sits centered above an IowanOld 42–48px headline (#0a0a0a) on a #fffdf8 canvas. The headline is two lines, centered, with a single filled Sepia CTA directly beneath. Generous vertical breathing room (80–120px above and below) — the hero is a single beat, not a stacked column.

### Marginalia Illustration
**Role:** Decorative line drawings scattered around feature sections

Hand-drawn black-stroke illustrations (DNA helix, keys, beaker, compass, notepad, equation sketches) rendered in #000000 or #0a0a0a with no fill, placed loosely in the negative space around content blocks. They sit at varied sizes and rotations, anchored to nothing — the placement is editorial, not gridded. They never overlap body copy.

### Feature Card (paper)
**Role:** Compact card on the ivory canvas

1px border #e5e5e5, radius 10px, background #fffdf8, padding 24px. No shadow. Holds an IowanOld 20–32px title and SuisseIntl 16px body. Optional small icon in #0a0a0a at the top.

### Section Heading
**Role:** Centered serif title introducing a new module

IowanOld 42–48px weight 400, color #0a0a0a, centered, with a line-height of 1.08–1.10. Often paired with a single-line subhead in SuisseIntl 16px #8c8c8c directly below, 16–24px gap. The serif at 48px is the largest type that appears anywhere on the site.

### Header Bar
**Role:** Site-wide navigation

Transparent background, 1px bottom border #e5e5e5. Left: wordmark + small logomark. Center: nav links in SuisseIntl 14px #0a0a0a with ~20px gaps. Right: outlined ghost button. Height approximately 60–72px. No sticky shadow, no background fill — the border is the only separator.

### Cream Band Background
**Role:** Sectional canvas for tabbed feature areas

Background transitions from #fffdf8 to a slightly cooler washed blue (#daeff8 detected in surface stack) with thin horizontal hairline rules in #e5e5e5 spaced ~40px apart, evoking ruled notebook paper. Text and cards sit on top of this lined texture; the lines run full-bleed.

### Body Paragraph
**Role:** Default long-form copy

SuisseIntl 16px weight 400, line-height 1.50, color #0a0a0a on #fffdf8. Max-width roughly 60ch for readability. No first-line indent, no drop cap — the journal voice comes from the serif headlines around it, not the body styling.

## Do's and Don'ts

### Do
- Use #512906 Sepia as the only filled button background — it is the brand's single chromatic commitment to chrome.
- Set all headlines in IowanOld (or Source Serif Pro) weight 400; never bold the serif. The restraint is the voice.
- Reserve #242d64 Ink Violet for one full-bleed feature panel per page — the contrast against #fffdf8 ivory is the only elevation the system needs.
- Draw structural separation with 1px borders in #e5e5e5 Graphite Rule. Do not use shadows, gradients, or background tints to divide sections.
- Keep all radii at 10px — buttons, cards, tags. A single radius is part of the quiet, notebook-stapled feel.
- Place hand-drawn line illustrations (#000000 stroke, no fill) loosely in the negative space; let them float, do not center them on a grid.
- Pair the serif headline with a small SuisseIntl 16px #8c8c8c subhead directly beneath — the type pairing is the brand.

### Don't
- Do not introduce a cool blue, green, or red as a "modern" accent — the four ink colors (Sepia, Ink Violet, Forest, Oxblood) are the entire chromatic vocabulary.
- Do not apply drop shadows, glow effects, or layered elevations to cards or buttons. The paper metaphor has no thickness.
- Do not bold the IowanOld serif headlines. Use weight 500 only for the smallest display lines if emphasis is needed.
- Do not fill the canvas with #ffffff pure white. The ivory #fffdf8 is the point — losing the warm tint makes the design feel like a generic SaaS template.
- Do not use a sans-serif for headlines, feature titles, or any text above 24px. The serif/sans split is non-negotiable.
- Do not apply #ffc934 Margin Yellow to buttons, badges, or any interactive surface — it is a decorative wash for illustration backgrounds only.
- Do not stack more than one filled Sepia CTA in a single viewport. If a second action is needed, use the outlined ghost variant.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Ivory Page | `#fffdf8` | Base canvas, the literal page the product is metaphorically printed on. |
| 1 | Soft Halo | `#f9f9f9` | Recessed sections, sub-panels, tabular areas that sit one shade below the page. |
| 2 | Ink Violet Panel | `#242d64` | Hero feature surface, used as a full-bleed band to introduce a new module and reset the eye. |
| 3 | Sepia Action | `#512906` | Filled CTA — the only chromatic interactive surface, and the only surface darker than charcoal. |

## Elevation

Opennote has no shadow system. Elevation is expressed entirely through a chromatic contrast jump — the ivory canvas (#fffdf8) to the Ink Violet feature panel (#242d64) — and through 1px hairline borders in #e5e5e5. Cards do not float; they sit on the page like a sheet of paper laid over another sheet. This is a deliberate anti-shadow stance: the notebook metaphor has no thickness, and introducing elevation would break the voice.

## Imagery

Imagery is hand-drawn line illustration in the style of a thoughtful margin doodle: DNA helices, keys, beakers, compass roses, notepad sketches, physics equations, abstract shapes. All illustrations are black-stroke on no-fill, sometimes with a single flat wash of #ffc934 yellow or #242d64 violet behind one element. They float in negative space at varied scales and slight rotations — editorial placement, not grid-snapped. There is no photography, no product screenshots in the hero, no 3D renders. The brand uses a single small illustration per hero (a person riding a surfboard-shaped rocket), then scatters smaller marginalia illustrations around feature sections. Density is low: illustrations are punctuation, not content.

## Layout

Centered, max-width ~1200px, generous vertical breathing room. The hero is a single-column stack: small illustration, two-line serif headline, single CTA, nothing else. Sections are separated by either whitespace (64–96px) or a single full-bleed band — a lined-paper cream/blue section or an Ink Violet feature panel — that resets the eye. Below the hero, a single horizontal logo strip serves as the only social proof. Feature sections alternate between a centered three-column card layout and a tabbed full-bleed Ink Violet panel. Content is consistently centered; there is no asymmetric or z-pattern layout. Navigation is a thin top bar with transparent background, a 1px bottom border, wordmark left, nav center, ghost button right. The page reads top-to-bottom as a series of quiet spreads, not a dashboard.

## Agent Prompt Guide

## Quick Color Reference
- canvas: #fffdf8 (ivory)
- text: #0a0a0a (ink charcoal)
- border: #e5e5e5 (graphite rule)
- accent: #ffc934 (margin yellow, decorative only)
- feature panel: #242d64 (ink violet)
- primary action: #512906 (filled action)

## 3 Example Component Prompts

1. Create a Primary Action Button: #512906 background, #8c8c8c text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Ink violet feature panel** — Full-bleed surface #242d64, padding 64px top and bottom, max-width 1200px centered. IowanOld 32px weight 400 title in #fffdf8, followed by SuisseIntl 16px body in #fffdf8 with line-height 1.50. Outlined ghost button at bottom-left: 1px border in #d1d1d1, transparent fill, #fffdf8 text, 10px radius, 8px 16px padding.

3. **Feature card (paper)** — 1px border #e5e5e5, radius 10px, background #fffdf8, padding 24px. Small monochrome icon in #0a0a0a at top (16–20px). IowanOld 20px weight 400 title in #0a0a0a, 16px gap, SuisseIntl 16px body in #474747 line-height 1.50. No shadow, no hover state beyond a 1px border darkening to #0a0a0a.

## Type Pairing Rule

The IowanOld serif and SuisseIntl sans are not interchangeable — they are a locked pairing. IowanOld is for headlines, feature titles, and any display text above 24px. SuisseIntl is for everything else: body, nav, buttons, footer, captions, form labels. Never set body copy in the serif, and never set headlines in the sans. The serif/sans tension is what reads as 'notebook on a clean desk' rather than 'product on a dashboard'.

## Similar Brands

- **Notion** — Same restrained chromatic palette, serif/sans type pairing for editorial warmth, and a single dark accent surface (Notion's near-black) breaking up an otherwise light page.
- **Are.na** — Both treat the canvas as a piece of paper — generous whitespace, hand-drawn or editorial illustration accents, and a single chromatic commit that feels like a chosen ink color rather than a brand-guideline afterthought.
- **Substack** — Same editorial-print sensibility with serif headlines on a warm off-white canvas, minimal chrome, and a focus on the page-as-publication metaphor rather than the dashboard metaphor.
- **Read.cv** — Both use a notebook/personal-journal visual language: hand-drawn line illustrations, sparse color, warm cream background, and serif headlines that signal craft over scale.
- **Cron (Notion Calendar)** — Same warm cream canvas, hairline gray rules, single saturated accent reserved for the brand's most distinctive interactions, and serif-in-headlines confidence.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ivory-page: #fffdf8;
  --color-ink-charcoal: #0a0a0a;
  --color-pressed-black: #000000;
  --color-graphite-rule: #e5e5e5;
  --color-smoke: #8c8c8c;
  --color-ash-border: #d1d1d1;
  --color-slate-body: #474747;
  --color-soft-halo: #f9f9f9;
  --color-sepia: #512906;
  --color-ink-violet: #242d64;
  --color-forest-ink: #0c3b1a;
  --color-oxblood: #5e0831;
  --color-margin-yellow: #ffc934;

  /* Typography — Font Families */
  --font-iowanold: 'IowanOld', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.12;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --text-display: 48px;
  --leading-display: 1.08;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 10px;
  --radius-cards: 10px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-ivory-page: #fffdf8;
  --surface-soft-halo: #f9f9f9;
  --surface-ink-violet-panel: #242d64;
  --surface-sepia-action: #512906;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ivory-page: #fffdf8;
  --color-ink-charcoal: #0a0a0a;
  --color-pressed-black: #000000;
  --color-graphite-rule: #e5e5e5;
  --color-smoke: #8c8c8c;
  --color-ash-border: #d1d1d1;
  --color-slate-body: #474747;
  --color-soft-halo: #f9f9f9;
  --color-sepia: #512906;
  --color-ink-violet: #242d64;
  --color-forest-ink: #0c3b1a;
  --color-oxblood: #5e0831;
  --color-margin-yellow: #ffc934;

  /* Typography */
  --font-iowanold: 'IowanOld', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.12;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --text-display: 48px;
  --leading-display: 1.08;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
