# Look inc — Style Reference
> White-walled gallery on a press proof. A typographic system of black serif and grotesque sans surrounds large documentary photography on pure white — the interface is the negative space between stories.

**Theme:** light

Look inc operates as a monochrome editorial gallery — the absence of color is the brand. The interface is a white canvas where serif headlines (Old Standard) and geometric sans (GT America) frame full-bleed project photography, letting the work itself supply all visual interest. Typography is the entire decorative system: a classical serif headline next to a modern grotesque body creates editorial tension that mirrors the agency's positioning as 'a non-traditional agency with roots in journalism.' Components are austere — no cards with shadows, no rounded containers, no accent buttons — just image tiles sitting directly on white with a small caption stack beneath. The grid is the design: equal-weight rectangular tiles arranged in rows, each tile a self-contained editorial spread.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Press Black | `#000000` | `--color-press-black` | Headlines, body text, navigation links, hairline dividers — the single dark mark in the system |
| Proof White | `#ffffff` | `--color-proof-white` | Page canvas, tile backgrounds, the only surface tone in the system |
| Galley Gray | `#878787` | `--color-galley-gray` | Muted captions, secondary metadata, editorial sub-labels — appears sparingly under project titles |
| Rule Line | `#e5e5e5` | `--color-rule-line` | Hairline nav dividers, ultra-subtle structural separators — the faintest non-black non-white mark allowed |

## Tokens — Typography

### Old Standard TT — Editorial headlines and sub-labels — a 19th-century book serif that signals journalism heritage. Used at 32px for project titles, 21px for section intros, 18px for compact serif captions. The single weight (400) is deliberate: this is a display serif meant to be set large and let breathe, not bolded for emphasis. · `--font-old-standard-tt`
- **Substitute:** EB Garamond, Cormorant Garamond, Playfair Display
- **Weights:** 400
- **Sizes:** 18px, 21px, 32px
- **Line height:** 1.10–1.40
- **Role:** Editorial headlines and sub-labels — a 19th-century book serif that signals journalism heritage. Used at 32px for project titles, 21px for section intros, 18px for compact serif captions. The single weight (400) is deliberate: this is a display serif meant to be set large and let breathe, not bolded for emphasis.

### GT America — Body copy, navigation, descriptive text — a modern American grotesque with mechanical precision. The 700 weight handles project subtitle/agency statements; 400 handles longer descriptive paragraphs. Its geometric neutrality balances the warmth of Old Standard without competing. · `--font-gt-america`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 400, 700
- **Sizes:** 18px, 21px, 23px
- **Line height:** 1.20–1.70
- **Role:** Body copy, navigation, descriptive text — a modern American grotesque with mechanical precision. The 700 weight handles project subtitle/agency statements; 400 handles longer descriptive paragraphs. Its geometric neutrality balances the warmth of Old Standard without competing.

### -apple-system — Smallest body and link text — system stack fallback for the GT America role, providing a baseline reading experience at 15px with generous 1.65 leading · `--font-apple-system`
- **Substitute:** system-ui, Segoe UI, Helvetica Neue
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.65
- **Role:** Smallest body and link text — system stack fallback for the GT America role, providing a baseline reading experience at 15px with generous 1.65 leading

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 15px | 1.65 | — | `--text-body-sm` |
| body | 18px | 1.7 | — | `--text-body` |
| subheading | 21px | 1.3 | — | `--text-subheading` |
| heading | 23px | 1.2 | — | `--text-heading` |
| display | 32px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 13 | 13px | `--spacing-13` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 26 | 26px | `--spacing-26` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-64px
- **Card padding:** 0px
- **Element gap:** 13-19px

## Components

### Project Tile
**Role:** Portfolio case-study entry — the primary content unit

Full-bleed image area (no border, no radius) on pure #ffffff, followed by a caption stack: project name in GT America 700 at 18px in #000000, then a single-line description in GT America 400 at 15px in #878787. Zero padding between image and caption. Tile width is grid-driven (1/3 or 1/2 of container), height is dictated by the photograph's aspect ratio.

### Editorial Hero
**Role:** Top-of-page brand introduction

Three-column header: left column holds 'Hello, we are' in Old Standard 400 at 32px (#000000); center column holds the Look wordmark/logo; right column holds the agency statement in GT America 400 at 21px (#000000) with 1.30 line-height. Columns align to a shared baseline, separated only by white space — no dividers, no backgrounds.

### Nav Link
**Role:** Minimal top navigation anchor

Text-only link: GT America 400 at ~15–18px in #000000, no underline by default, no background, no border. Links are separated by the faint #e5e5e5 hairline running horizontally across the nav strip. Padding: 3px top/bottom, 26px left/right.

### Project Caption Block
**Role:** Metadata beneath each project tile

Two-line text block: line 1 = project/brand name in GT America 700, #000000; line 2 = tagline in GT America 400, #878787, line-height 1.65. No background, no border, no padding — text sits directly beneath the image with 13px top spacing.

### Portrait/Editorial Card
**Role:** Full-bleed photographic content block

A single image at edge-to-edge width of its grid column, no border-radius, no overlay, no text on image. When project title is set inside the image (e.g. 'VICTORIA'S SECRET', 'COSTA BRAZIL'), it uses Old Standard 400 white, large scale, centered — newspaper masthead treatment.

## Do's and Don'ts

### Do
- Use #000000 for all text — never introduce a chromatic accent or muted body color beyond #878787
- Set headlines in Old Standard at 32px with line-height 1.10 — the tight leading is part of the editorial voice
- Keep all corners at 0px radius — no rounded cards, no rounded buttons, no rounded images
- Let photographs bleed to the full width of their grid column without padding or border
- Separate elements with 13–19px gaps and 40–64px section gaps, never with decorative dividers
- Use GT America 700 for project titles and 400 for descriptors — weight contrast carries hierarchy
- Maintain 0% colorfulness: the photography supplies all color, the UI supplies only black, white, and two grays

### Don't
- Don't add shadows, elevation, or any z-axis depth to cards or tiles
- Don't use accent colors, brand colors, or chromatic borders — this is an achromatic system by design
- Don't bold the serif — Old Standard is set at 400 only; weight contrast belongs to GT America
- Don't round image corners or add overlay text treatments to most tiles
- Don't introduce card backgrounds, card borders, or card padding — tiles are images on canvas with a caption beneath
- Don't use color for interactive states — rely on underline, weight change, or cursor change only
- Don't break the 0px radius rule with pill buttons, rounded tags, or circular avatars

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Full-page white background — the single surface tier |

## Elevation

No shadows, no elevation, no depth. All content sits flush on the white canvas. The only separation between elements is whitespace and the rare #e5e5e5 hairline. Visual hierarchy is achieved through type scale and image scale, never through z-axis or surface tinting.

## Imagery

The visual language is documentary photography at editorial scale. Images are full-bleed, edge-to-edge, uncropped, and unfiltered — they look like contact sheets from a photo editor's desk: campaign stills, fashion editorials, aerial product shots, crowd scenes, intimate portraits. The photography is the design system. No illustration, no abstract graphics, no decorative shapes, no iconography beyond a possible wordmark. No image overlays, no duotone treatments, no color grading beyond the photograph's natural production. The density shifts: the page is roughly 60% image to 40% white space and type, with images acting as the pages and typography acting as the margins.

## Layout

Max-width ~1200px centered container on a pure white canvas. The hero is a three-column editorial header: 'Hello, we are' / logo / agency statement, all on a single horizontal band. Below the hero, the page becomes a portfolio grid: rows of 2–3 equal-width project tiles, each tile a full-bleed photograph with a two-line caption beneath. Tiles align to a strict grid — column widths are consistent, row heights are driven by image aspect ratio. Navigation is a single top bar with two text links ('Look', 'Info') separated by a faint #e5e5e5 hairline. The rhythm is gallery-like: each row of tiles is a spread, each tile is a plate, and the white space between rows is the gutter. The page is scroll-driven with no sticky elements, no sidebar, no modal layers.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border / hairline: #e5e5e5
- muted text: #878787
- accent: none (achromatic system)
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a project tile grid: pure white (#ffffff) background, 0px radius, no border, no shadow. Image fills the tile edge-to-edge with no padding. Caption beneath: project name in GT America 700, 18px, #000000; tagline in GT America 400, 15px, #878787, 1.65 line-height. 13px gap between image and caption.

2. Create the editorial hero: three columns on white. Left: 'Hello, we are' in Old Standard 400, 32px, #000000, line-height 1.10. Center: wordmark. Right: agency statement in GT America 400, 21px, #000000, line-height 1.30. Columns separated by white space only — no dividers, no backgrounds.

3. Create a top nav: left link 'Look', right link 'Info', both in GT America 400, 15px, #000000. A single #e5e5e5 hairline border-bottom runs across the full nav width. 26px horizontal padding per link, 3px vertical padding.

4. Create an overlay-title image block: full-width editorial photograph, no border-radius. White masthead text centered in the image, set in Old Standard 400 at large display scale, tracking normal. No box, no background, no shadow behind the text.

5. Create a section divider: nothing. Transition between sections is whitespace alone — 40–64px vertical gap, no line, no background change, no ornament.

## Typography Philosophy

The system pairs a 19th-century book serif (Old Standard) with a 21st-century American grotesque (GT America). The serif is a relic — it signals journalism, print heritage, the weight of editorial history. The sans is a tool — neutral, mechanical, ready for the present. Together they create the 'non-traditional agency' voice: one foot in the archive, one foot in the studio. Both fonts stay at 400 (serif) and 400/700 (sans); neither is set in italic, light, or compressed. The scale is narrow: 15, 18, 21, 23, 32 — a print designer's restraint, not a design system's exuberance.

## Similar Brands

- **Pentagram** — Same editorial agency-portfolio grid with full-bleed project photography and minimal serif/sans typography pairing on white
- **Wieden+Kennedy** — Agency-as-gallery approach: monochrome UI frame around documentary campaign photography, no decorative chrome
- **Mast Brothers** — Achromatic portfolio grid with editorial serif headlines and grotesque body text, photography carries all color
- **It's Nice That** — Editorial publication aesthetic — serif display type, sans body, full-bleed project tiles, zero accent color in the UI
- **&Friends** — Creative agency with strict two-typeface editorial system (serif + grotesque) and image-first portfolio grid on white

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-press-black: #000000;
  --color-proof-white: #ffffff;
  --color-galley-gray: #878787;
  --color-rule-line: #e5e5e5;

  /* Typography — Font Families */
  --font-old-standard-tt: 'Old Standard TT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.65;
  --text-body: 18px;
  --leading-body: 1.7;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --text-heading: 23px;
  --leading-heading: 1.2;
  --text-display: 32px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-13: 13px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-26: 26px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-64px;
  --card-padding: 0px;
  --element-gap: 13-19px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-press-black: #000000;
  --color-proof-white: #ffffff;
  --color-galley-gray: #878787;
  --color-rule-line: #e5e5e5;

  /* Typography */
  --font-old-standard-tt: 'Old Standard TT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.65;
  --text-body: 18px;
  --leading-body: 1.7;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --text-heading: 23px;
  --leading-heading: 1.2;
  --text-display: 32px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-13: 13px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-26: 26px;
}
```
