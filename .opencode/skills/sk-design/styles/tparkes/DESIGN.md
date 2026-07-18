# Tparkes — Style Reference
> Editorial broadsheet on white. A four-word image: a designer typesetting their own name at 86px and lets the page breathe around it.

**Theme:** light

Tparkes is a typographic portfolio that treats the page as a printed broadsheet: almost entirely monochrome, white-canvas, text-driven, with one warm cream accent (#f5ffbe) appearing as a flash of color on a single surface. The hero is a single oversized statement — Instrumentsans at 86px, weight 600, line-height 0.83, negative tracking — that swallows the viewport and uses inline glyph icons (bird, plane, flower) as visual punctuation rather than decoration. Everything else recedes: a tiny 4px-radiused avatar, 20px nav items, a thin hairline border as section divider, and work thumbnails that are full-bleed images with 16px radius and quiet captions underneath. The system is anti-decorative — no shadows, no gradients, no fills on buttons, no card elevation. Communication is carried by scale, weight, and proximity, not by color or chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, work-thumbnail backings |
| Newsprint | `#333333` | `--color-newsprint` | Primary text, dominant hairline borders, image outlines |
| Faint Gray | `#a7a7a7` | `--color-faint-gray` | Muted text, secondary borders, caption-scale copy |
| Typesetter Gray | `#b3b3b3` | `--color-typesetter-gray` | Display-weight text, large heading fills where contrast is intentionally reduced |
| Rule Gray | `#d6d6d6` | `--color-rule-gray` | Hairline dividers, icon strokes, light borders |
| Ink | `#000000` | `--color-ink` | Nav text and nav borders, maximum-contrast moments |
| Press Black | `#222222` | `--color-press-black` | Nav foreground, slight off-black for body nav links |
| Footnote | `#808080` | `--color-footnote` | Outlined link borders, secondary link text — a quiet hover/focus state |
| Hi-Liter Wash | `#f5ffbe` | `--color-hi-liter-wash` | The single chromatic moment — a warm pale-yellow surface used as a full-bleed band, never as fill or text |

## Tokens — Typography

### Instrumentsans — All display, heading, nav, and caption text. Condensed sans with very tight tracking. The 86px/0.83 line-height is the signature move — type runs together vertically, producing the broadsheet effect. Substitute with 'Archivo Narrow' (600, 700) or 'Roboto Condensed' (700). · `--font-instrumentsans`
- **Substitute:** Archivo Narrow
- **Weights:** 600, 700
- **Sizes:** 10px, 17px, 22px, 24px, 86px
- **Line height:** 0.83–1.80 (tightest at 86px display, loosest at 10px caption)
- **Letter spacing:** -0.035em (≈ -0.35px at 10px, -0.84px at 24px, -3.01px at 86px)
- **Role:** All display, heading, nav, and caption text. Condensed sans with very tight tracking. The 86px/0.83 line-height is the signature move — type runs together vertically, producing the broadsheet effect. Substitute with 'Archivo Narrow' (600, 700) or 'Roboto Condensed' (700).

### Arial — Body, metadata, link copy, and supporting micro-text. Tracked extremely tight (-0.214em ≈ -3px at 14px), which is a counter-intuitive choice for body — it reads as a typesetter pulling body to match the display weight. Substitute with system Arial or 'Helvetica Neue'. · `--font-arial`
- **Substitute:** Helvetica Neue
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Letter spacing:** -0.214em (≈ -3px at 14px)
- **Role:** Body, metadata, link copy, and supporting micro-text. Tracked extremely tight (-0.214em ≈ -3px at 14px), which is a counter-intuitive choice for body — it reads as a typesetter pulling body to match the display weight. Substitute with system Arial or 'Helvetica Neue'.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.8 | -0.35px | `--text-caption` |
| body | 14px | 1.43 | -2.996px | `--text-body` |
| heading-sm | 22px | 1.09 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| display | 86px | 0.83 | -3.01px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| links | 12px |
| avatars | 4px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Hero Statement
**Role:** Opening typographic manifesto

Full-width Instrumentsans 600/700 at 86px, line-height 0.83, letter-spacing -3px, color #333333. Glyph icons (bird, plane, flower) sit inline as text-flow pictograms, not as separate elements. Headline wraps over 4–5 lines. Sits on #ffffff with no padding above the nav, 120px below.

### Avatar Tile
**Role:** Personal mark in nav

Square 4px-radius image, 40–48px, 1px #333333 border. Black-and-white photo treatment. Sits flush left of the nav row.

### Inline Nav Link
**Role:** Primary navigation item

Instrumentsans 600/700 at ~17–22px, color #222222, no background, no underline, no padding. Active/hover state: color shifts to #000000. 20px horizontal gap between items.

### Section Caption
**Role:** Underline-free large label

Instrumentsans 600/700 at 22–24px, color #333333, leading 1.18. Sits flush-left, no decorative mark, 39px top/bottom margin within the section.

### Work Thumbnail
**Role:** Full-bleed project image

Edge-to-edge image, 16px radius, 1px #333333 border. Caption row below: 14px Arial #333333 with a 24px Instrumentsans 600 #333333 project title. No overlay, no hover state beyond subtle color shift on the caption.

### Hi-Liter Band
**Role:** The only chromatic section

Full-width #f5ffbe surface, 120px vertical padding, contains a single Instrumentsans 86px statement in #222222. Functions as a palette rest and the site's only color.

### Footer Link Group
**Role:** Footer nav and external links

Instrumentsans 600/700 14–17px, color #808080, 12px radius on hover indicator. 24px vertical stack, flush-left.

### Hairline Rule
**Role:** Section divider

1px #d6d6d6 horizontal line, full content width, 120px vertical breathing room above and below. The only structural separator in the system.

### Pictogram Glyph
**Role:** Inline icon-as-punctuation

1.2em Instrumentsans 600/700 inline with hero text, color #333333. Treated as a text run, not an image — wraps with the line. Used to break dense statements.

### Ghost CTA Arrow
**Role:** Single text-link action

24px circular black badge with a down-arrow glyph in white, 26px radius, paired with a 14px Arial #333333 'Explore my work' label. Sits flush-left, 20px gap between badge and text.

## Do's and Don'ts

### Do
- Use Instrumentsans 600/700 for all display, heading, nav, and caption text — Arial is reserved for 14px body and metadata only.
- Set display headlines at 86px with line-height 0.83 and letter-spacing -3px; this compression is the signature and must not be loosened.
- Use 120px as the section gap and 20px as the element gap; maintain the 4px base unit for all micro-padding (4, 8, 10, 16, 20, 24).
- Use 16px radius on all work thumbnails and 8px radius on icon containers and small image tiles; do not introduce new radii.
- Use #f5ffbe as the only chromatic surface, and only as a full-bleed band — never as a fill on text, buttons, or borders.
- Express separation through color (white → cream) and hairline #d6d6d6 rules, never through box-shadow or elevation stacks.
- Inline pictogram glyphs as text runs inside hero statements; do not place them as separate image elements.

### Don't
- Do not introduce any color other than #f5ffbe — the page is a monochrome system and adding a brand blue, red, or green breaks the broadsheet language.
- Do not add drop-shadows, glow effects, or any box-shadow stack; the design rejects elevation.
- Do not use filled buttons or colored CTA backgrounds; actions are expressed as ghost text links or the 24px black arrow badge.
- Do not set display text at line-height above 0.95 — looser leading destroys the condensed broadsheet effect.
- Do not use #0000ee or browser-default link blue; links are #808080 borders with #333333 text.
- Do not center-align hero text or work captions; everything is flush-left.
- Do not use system font weights below 600 for headings — Instrumentsans 400 would collapse the typographic hierarchy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Base canvas for the entire page |
| 1 | Hi-Liter Band | `#f5ffbe` | Sole chromatic surface — used as a full-bleed section to break the monochrome |

## Elevation

The design has no shadow system. Elevation is expressed only through the 16px image radius and the warm cream band — surfaces separate by color, not by depth. Do not introduce drop-shadows, glow, or any box-shadow stack.

## Imagery

Imagery is sparse and editorial: one small square black-and-white avatar (4px radius, 1px border) in the nav, then a series of full-bleed work thumbnails (16px radius, 1px border) presented as captioned cards. No decorative photography, no lifestyle shots, no overlapping or masked visuals. The visual feed section uses a masonry-like grid of project stills — app screenshots, brand wordmarks, infographic crops — all on the same white canvas with consistent 16px rounding. Iconography is inline glyph-as-text (bird, plane, flower, arrow) flowing with the type, not a separate icon system.

## Layout

Full-width, flush-left, max-width ~1200px content rail with no centered hero. The page reads top-to-bottom as a single typographic column: nav (avatar + 3 links flush-right) → massive 86px hero statement spanning 4–5 lines → 'Explore my work' ghost CTA → full-bleed dark work image with caption → bolded project title + secondary description → a 'Visual Feed' section header at 86px Instrumentsans → a 2-column image grid with 16px-radius work cards and quiet captions. Section rhythm is driven by 120px vertical gaps and 1px #d6d6d6 hairlines, not by alternating background colors. The only color interruption is a single #f5ffbe full-bleed band. No sidebar, no sticky header, no mega-menu.

## Agent Prompt Guide

Quick Color Reference:
- canvas: #ffffff
- text: #333333
- border: #d6d6d6 (hairline) / #333333 (dominant)
- muted text: #a7a7a7
- accent surface: #f5ffbe
- primary action: no distinct CTA color

Example Component Prompts:
1. Hero statement: 86px Instrumentsans 600, #333333, letter-spacing -3px, line-height 0.83, full-width flush-left on #ffffff. Inline a 1.2em bird glyph mid-sentence as text.
2. Nav bar: 48px square avatar (4px radius, 1px #333333 border) flush-left, 3 Instrumentsans 600 17px links in #222222 flush-right, 20px gap, 4px vertical padding.
3. Work thumbnail card: full-bleed image, 16px radius, 1px #333333 border, 24px Instrumentsans 600 project title in #333333 below, 14px Arial 400 caption in #333333, 120px section gap above.
4. Hi-Liter band section: full-width #f5ffbe surface, 120px vertical padding, centered Instrumentsans 600 86px statement in #222222 with -3px tracking.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Similar Brands

- **Frank Chimero** — Same editorial-portfolio language: massive flush-left type, monochrome, white canvas, tiny avatar, work presented as captioned full-bleed images with no card chrome.
- **Rauno Freiberg** — Identical broadsheet structure — oversized Instrumentsans-family display at tight line-height, single warm accent surface, work grid with consistent image radii.
- **Charlie Gerard** — Same text-as-hero approach: the personal statement is the entire viewport, glyph icons inline, no buttons, no shadows, hairline rules as the only structural element.
- **Linear's design site** — Shares the monochrome palette plus a single soft accent surface, but trades the typographic manifesto for product UI density.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-newsprint: #333333;
  --color-faint-gray: #a7a7a7;
  --color-typesetter-gray: #b3b3b3;
  --color-rule-gray: #d6d6d6;
  --color-ink: #000000;
  --color-press-black: #222222;
  --color-footnote: #808080;
  --color-hi-liter-wash: #f5ffbe;

  /* Typography — Font Families */
  --font-instrumentsans: 'Instrumentsans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.8;
  --tracking-caption: -0.35px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -2.996px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.09;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-display: 86px;
  --leading-display: 0.83;
  --tracking-display: -3.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 26px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-links: 12px;
  --radius-avatars: 4px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-hi-liter-band: #f5ffbe;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-newsprint: #333333;
  --color-faint-gray: #a7a7a7;
  --color-typesetter-gray: #b3b3b3;
  --color-rule-gray: #d6d6d6;
  --color-ink: #000000;
  --color-press-black: #222222;
  --color-footnote: #808080;
  --color-hi-liter-wash: #f5ffbe;

  /* Typography */
  --font-instrumentsans: 'Instrumentsans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.8;
  --tracking-caption: -0.35px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -2.996px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.09;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-display: 86px;
  --leading-display: 0.83;
  --tracking-display: -3.01px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 26px;
}
```
