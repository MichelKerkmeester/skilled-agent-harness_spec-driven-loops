# Spacelab — Style Reference
> Swiss editorial grid on raw paper. A quiet gallery where Helvetica sits at the baseline and a single slate-violet button is the loudest thing in the room.

**Theme:** light

Spacelab is a Swiss-editorial architecture studio site built on near-total monochrome restraint: one typeface, one chromatic accent, and almost no surface decoration. The page behaves like a printed monograph — white canvas, oversized architectural photography, and a left-rail index navigation that recalls a museum catalogue sidebar. Type carries the entire voice: HelveticaNeue at weight 400 with line-heights compressed to 1.0–1.2 sits closer to the baseline than typical web type, making every paragraph feel set rather than typed. The single muted violet-slate (#495472) appears only on filled buttons and a rare card surface, functioning as a quiet navigational signal rather than a brand statement. Components are reduced to their skeleton: hairline borders, 4px corners, no shadows, no gradients — every element earns its weight by occupying negative space rather than filling it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, body text inversion, button labels. The dominant background; everything else sits on top of it |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, icon strokes, hairline borders, the logo wordmark. Used for most dividers and structural lines (border frequency 1,156) |
| Charcoal | `#2c2222` | `--color-charcoal` | Secondary text and the heaviest border color in the system (freq 3,104). A warm-toned near-black that softens harsh contrast on long reads |
| Fossil | `#b2b4b1` | `--color-fossil` | Muted link color, inactive nav items, tertiary text. Desaturated green-gray that recedes against both paper white and ink black |
| Slate Iris | `#495472` | `--color-slate-iris` | Filled button background and select card surfaces — the only chromatic voice in the system. A muted violet-slate that reads as architectural blue-grey rather than brand color, so it never shouts over the photography |

## Tokens — Typography

### HelveticaNeue — The sole typeface. Used for everything from the lowercase 'spacelab_' logo to 62px display headlines, 19–21px section headings, 17px body, and 15px captions. · `--font-helveticaneue`
- **Substitute:** Helvetica, Inter, Neue Haas Grotesk, Arial
- **Weights:** 400
- **Sizes:** 15px, 17px, 19px, 21px, 30px, 62px
- **Line height:** 1.00–1.20 (tight; display at 1.0, body at 1.20)
- **Letter spacing:** 0.0110em (0.165px at 15px, 0.682px at 62px — consistent positive tracking across all sizes)
- **Role:** The sole typeface. Used for everything from the lowercase 'spacelab_' logo to 62px display headlines, 19–21px section headings, 17px body, and 15px captions.

### HelveticaNeue-Light — Body copy and supporting paragraphs where a quieter voice is needed. The light cut creates typographic variety without changing families — a single-typeface system that breathes through weight, not variety. · `--font-helveticaneue-light`
- **Substitute:** Helvetica Neue Light, Inter Light, Neue Haas Grotesk Light
- **Weights:** 300 (rendered as 400 in data — light weight optical)
- **Sizes:** 17px
- **Line height:** 1.20
- **Letter spacing:** 0.0110em
- **Role:** Body copy and supporting paragraphs where a quieter voice is needed. The light cut creates typographic variety without changing families — a single-typeface system that breathes through weight, not variety.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1.2 | 0.165px | `--text-caption` |
| body | 17px | 1.2 | 0.187px | `--text-body` |
| subheading | 19px | 1.15 | 0.209px | `--text-subheading` |
| heading-sm | 21px | 1.15 | 0.231px | `--text-heading-sm` |
| heading | 30px | 1.1 | 0.33px | `--text-heading` |
| display | 62px | 1 | 0.682px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 21 | 21px | `--spacing-21` |
| 42 | 42px | `--spacing-42` |
| 84 | 84px | `--spacing-84` |
| 147 | 147px | `--spacing-147` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| other | 4px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 84px
- **Card padding:** 21px
- **Element gap:** 21px

## Components

### Sidebar Logo Wordmark
**Role:** Brand identifier pinned to the top-left of every page

Lowercase 'spacelab_' in HelveticaNeue 21px, weight 400, color #000000, letter-spacing 0.231px. The trailing underscore is signature — it reads as a code-syntax artifact and is the logo's only visual gimmick.

### Vertical Section Index
**Role:** Primary navigation — always visible in the left rail

Stacked list at 17px HelveticaNeue weight 400. Active item ('All stories') rendered in #000000 weight 400; inactive items ('Work', 'News', 'Exploration', 'About', 'Contact') rendered in #b2b4b1 weight 400. 10px gap between items. No bullets, no icons, no separators — a pure typographic index.

### Filled Accent Button
**Role:** Primary interactive element — the only filled button in the system

Background #495472, text #ffffff, 15px HelveticaNeue weight 400, letter-spacing 0.165px, padding 21px horizontal / 21px vertical, border-radius 0. No hover state deviation specified — the button is already quiet, so state change is minimal.

### Ghost Text Link
**Role:** Inline links and secondary navigation

Color #b2b4b1 default, #000000 on hover. 17px HelveticaNeue weight 400, 5px margin-bottom for paragraph spacing. No underline by default — link affordance comes from color shift and the hairline border-bottom 1px #000000 applied to body context.

### Accent Card Surface
**Role:** Featured content card — the only chromatic surface

Background #495472, padding 21px, border-radius 0. Used to surface a single project or story; the card contains #ffffff text. Functions as a typographic 'pull-quote panel' more than a content container — it interrupts the white canvas rather than organizing content.

### Full-Bleed Image Block
**Role:** Primary visual unit for project and editorial pages

Architectural photograph at native aspect ratio, no border, no radius, no caption. Aligned to the right column of the asymmetric grid. May span the full content area width.

### Body Paragraph
**Role:** Long-form editorial copy

17px HelveticaNeue-Light at line-height 1.20, color #000000, letter-spacing 0.187px. Paragraph spacing 21px. Left-aligned, ragged right. No max-width constraint — text follows the column.

### Display Headline
**Role:** Page titles and editorial section openers

62px HelveticaNeue weight 400, line-height 1.00, letter-spacing 0.682px, color #000000. The tight 1.0 line-height makes the headline sit on the baseline like a printed masthead — no airy leading, no decorative space.

### Section Heading
**Role:** Mid-level headings for content sections

21–30px HelveticaNeue weight 400, line-height 1.10–1.15, color #000000. 42px margin-bottom to separate from body content.

### Hairline Divider
**Role:** Structural separator between content blocks

1px solid #000000 or #2c2222, no other styling. The most common element in the system (over 1,100 instances in the data) — Spacelab uses lines, not spacing, to organize content.

## Do's and Don'ts

### Do
- Use only HelveticaNeue (or HelveticaNeue-Light) for every text element — no display fonts, no serifs, no monospaced accents.
- Hold line-heights at 1.00 for display sizes (30–62px) and never above 1.20 for body — the tight rhythm is the signature.
- Use #495472 exclusively for filled buttons and accent card surfaces; treat it as a switch, not a decoration.
- Separate content blocks with 1px hairline borders in #000000 or #2c2222 rather than padding or background fills.
- Keep border-radius at 0px on all cards, buttons, tags, and images; the 4px token is reserved for the rare utility element.
- Maintain 21px as the base unit for element gaps and card padding; step up to 42px and 84px for section-level separation.
- Render the logo as lowercase 'spacelab_' with a trailing underscore — the underscore is non-negotiable brand grammar.

### Don't
- Do not introduce a second typeface, even for emphasis — vary weight (400 vs Light) within HelveticaNeue instead.
- Do not add drop shadows, inner glows, or blur effects — the system uses flat surfaces and hairline borders only.
- Do not use #495472 for body text, icons, borders, or decorative accents — it is reserved for filled interactive surfaces.
- Do not round corners on images, cards, or buttons; the 0px radius is a deliberate editorial choice.
- Do not exceed 62px for headlines or drop below 15px for text — the scale is intentionally narrow.
- Do not center-align body paragraphs; ragged-right text aligns with the Swiss editorial baseline.
- Do not apply gradients, duotone effects, or color overlays to photography — images are shown as captured.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Base canvas — the entire page background |
| 2 | Slate Iris Surface | `#495472` | Accent card and filled button surface — used sparingly as functional punctuation |

## Elevation

The design avoids shadows entirely. Surfaces are separated by hairline borders (1px, #000000 or #2c2222) or by white space alone. Elevation is communicated through z-order and the single accent surface color, not through blur or drop shadow. This keeps the visual language in register with printed editorial design — flat, honest, material.

## Imagery

Architecture and interior photography is the primary visual content. Shots are full-bleed, uncropped to editorial dimensions, and unstyled — no overlays, no duotone treatments, no rounded corners. The image IS the composition: large-format documentation of built environments (atria, workspaces, public buildings) shown with documentary clarity. People appear as scale figures, not portraits. Color photography is used as-shot — natural light, natural palette. There is no illustration, no iconography beyond simple line glyphs, and no decorative graphics.

## Layout

Asymmetric two-column structure: a fixed left rail (~20% width) holds the logo and vertical navigation, while the right ~80% carries the current page's content. The nav is a flat list of section labels (All stories, Work, News, Exploration, About, Contact) stacked vertically with generous vertical rhythm. The hero is a full-bleed architectural photograph that occupies the right column with no caption or overlay. Page rhythm relies on the 84px section gap and 21px card padding to create breathing room between blocks. The grid is implicitly column-based rather than card-based — images and text blocks align to a vertical column structure rather than a uniform card system.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (primary), #2c2222 (secondary), #b2b4b1 (muted/inactive)
- background: #ffffff
- border: #000000 or #2c2222 (hairline 1px)
- accent surface: #495472 (Slate Iris)
- primary action: #495472 (filled action)

**Example Component Prompts**

1. *Display Headline*: 62px HelveticaNeue weight 400, line-height 1.00, letter-spacing 0.682px, color #000000, left-aligned, no margin-top, 84px margin-bottom to next element.

2. *Filled Accent Button*: 15px HelveticaNeue weight 400, letter-spacing 0.165px, color #ffffff on background #495472, padding 21px 21px, border-radius 0, no border, no shadow, inline-block.

3. *Vertical Sidebar Nav*: Stacked list of links, 17px HelveticaNeue weight 400, 10px row-gap, color #b2b4b1 for inactive items, color #000000 for active item, no bullets, no underlines, left-aligned in a 200px-wide left rail.

4. *Body Paragraph*: 17px HelveticaNeue-Light, line-height 1.20, letter-spacing 0.187px, color #000000, 21px margin-bottom between paragraphs, left-aligned, ragged right, no max-width.

5. *Full-Bleed Architectural Image*: Native aspect ratio, no border, border-radius 0, no caption, no overlay, aligned to right column of asymmetric grid, no decorative treatment.

## Similar Brands

- **Vitsoe** — Same Swiss-editorial restraint, single accent used sparingly, typography that sits at the baseline with tight line-heights, architectural photography as the primary visual.
- **Aesop** — Editorial grid layout with generous whitespace, muted monochrome palette with a single quiet accent, serif-free typographic system that prioritizes content over chrome.
- **Frieze** — Gallery-catalogue information architecture with a left-rail section index, large-format unstyled photography, and Helvetica-driven type hierarchy at compressed line-heights.
- **Studio Ma** — Architecture studio site with documentary photography, minimal surface decoration, single-typeface system, and a near-monochrome palette with one muted chromatic accent.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #2c2222;
  --color-fossil: #b2b4b1;
  --color-slate-iris: #495472;

  /* Typography — Font Families */
  --font-helveticaneue: 'HelveticaNeue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticaneue-light: 'HelveticaNeue-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.2;
  --tracking-caption: 0.165px;
  --text-body: 17px;
  --leading-body: 1.2;
  --tracking-body: 0.187px;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --tracking-subheading: 0.209px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: 0.231px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: 0.33px;
  --text-display: 62px;
  --leading-display: 1;
  --tracking-display: 0.682px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-21: 21px;
  --spacing-42: 42px;
  --spacing-84: 84px;
  --spacing-147: 147px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 84px;
  --card-padding: 21px;
  --element-gap: 21px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-other: 4px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-slate-iris-surface: #495472;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #2c2222;
  --color-fossil: #b2b4b1;
  --color-slate-iris: #495472;

  /* Typography */
  --font-helveticaneue: 'HelveticaNeue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticaneue-light: 'HelveticaNeue-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.2;
  --tracking-caption: 0.165px;
  --text-body: 17px;
  --leading-body: 1.2;
  --tracking-body: 0.187px;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --tracking-subheading: 0.209px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: 0.231px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: 0.33px;
  --text-display: 62px;
  --leading-display: 1;
  --tracking-display: 0.682px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-21: 21px;
  --spacing-42: 42px;
  --spacing-84: 84px;
  --spacing-147: 147px;

  /* Border Radius */
  --radius-md: 4px;
}
```
