# Good Glyphs — Style Reference
> oversized charity poster on mint paper — type so large it behaves as architecture, not text.

**Theme:** light

Good Glyphs treats the whole page as a printed charity poster: one mint-green canvas, one black ink, and type so large it functions as architecture rather than text. The system is anti-UI — there are no neutral grays, no semantic colors, no shadows, no gradients. A single soft celadon green (#c7ffcd) carries the entire chromatic load while pure black handles every stroke, border, label, and filled element. The signature move is the 288px display: the brand name itself becomes a graphic object, set tight with negative tracking so the letterforms lock into a wall of ink. Surfaces alternate between full-bleed mint and full-bleed black bands, producing a poster-strip rhythm rather than card-based hierarchy. Everything is built on a 4px base unit with tight 7–14px paddings; the only radii are 14px (soft cards) and a fully pill-shaped 140px for all interactive controls. Components feel stamped rather than designed: borders are always solid 1px black, text is always 13–14px, and the only moment of color contrast is white-on-black glyph artwork inside the dark showcase band.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pledge Mint | `#c7ffcd` | `--color-pledge-mint` | Page canvas, full-bleed section backgrounds, the site's only color. Washes the entire light theme |
| Ink Black | `#000000` | `--color-ink-black` | All text, all borders, all filled elements, icon strokes, footer background, the black showcase band. The structural dark |
| Carbon | `#101010` | `--color-carbon` | Input field borders and input text — functionally identical to Ink Black, kept as a token for form-state flexibility |

## Tokens — Typography

### Helvetica Neue — Primary typeface for everything readable. Weight 300 carries the massive 288px display headlines — the light weight at extreme size lets the letters breathe inside the locked -0.03em tracking. Weight 400 handles body copy at 13–14px and short uppercase labels. 28px serves as a mid-tier subhead. The 0.80 line-height on the display is critical: it stacks the giant letters tight enough to read as a single graphic block. · `--font-helvetica-neue`
- **Substitute:** Inter, Neue Haas Grotesk, or system-ui sans
- **Weights:** 300, 400
- **Sizes:** 13, 14, 28, 288
- **Line height:** 0.80 (display) / 1.20 (subhead) / 1.50 (body)
- **Letter spacing:** -0.0300em across all sizes; display at 288px reads as tight poster type rather than display tracking
- **OpenType features:** `none`
- **Role:** Primary typeface for everything readable. Weight 300 carries the massive 288px display headlines — the light weight at extreme size lets the letters breathe inside the locked -0.03em tracking. Weight 400 handles body copy at 13–14px and short uppercase labels. 28px serves as a mid-tier subhead. The 0.80 line-height on the display is critical: it stacks the giant letters tight enough to read as a single graphic block.

### good-glyphs — The actual product — the dingbat glyphs themselves rendered at full display scale. Only ever appears inside the black showcase band as proof that the font works at intended size. Not used for UI text. · `--font-good-glyphs`
- **Substitute:** Custom / project asset — no substitute
- **Weights:** 400
- **Sizes:** 288
- **Line height:** 1.00, 1.20
- **Letter spacing:** normal
- **OpenType features:** `none`
- **Role:** The actual product — the dingbat glyphs themselves rendered at full display scale. Only ever appears inside the black showcase band as proof that the font works at intended size. Not used for UI text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.39px | `--text-caption` |
| subheading | 28px | 1.2 | -0.84px | `--text-subheading` |
| display | 288px | 0.8 | -8.64px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 7 | 7px | `--spacing-7` |
| 14 | 14px | `--spacing-14` |
| 28 | 28px | `--spacing-28` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| buttons | 140px |

### Layout

- **Section gap:** 84px
- **Card padding:** 14px
- **Element gap:** 7px

## Components

### Display Headline
**Role:** The site's defining typographic moment — the project name rendered as a graphic wall.

Helvetica Neue weight 300 at 288px, line-height 0.80, letter-spacing -0.0300em (-8.64px). Pure black on Pledge Mint. Uppercase. The letters are so large the line-height compresses them into a single dense block. Never use weight 700 — the system insists on light-weight display at scale.

### Pill Donation Button
**Role:** Quick-select amount chips for the donation flow.

Fully pill-shaped at 140px border-radius. 1px black border on transparent background over the mint canvas. Helvetica Neue weight 400, 14px, -0.42px tracking. Padding 4px 7px. On hover/active the chip fills solid black with mint text. The pill geometry is absolute — no squared or rounded-rect variants exist.

### Pill Action Button (Large)
**Role:** The primary DONATE & DOWNLOAD call to action.

Same 140px pill radius as donation chips, scaled up with generous horizontal padding. Black 1px border on mint background, text is weight 400, ~14px uppercase, tracking -0.42px. The button stretches nearly full-width inside its container to read as a poster strip rather than a UI control.

### Contributor Card
**Role:** Grid card showing one designer's name and their submitted glyph.

Mint canvas with 1px black border and 14px corner radius. Padding 14px. Designer name sits in the top-left at 14px weight 400 black, with a small letter chip (the designer's initial in a tiny black square) to the right. Glyph artwork fills the card body. Cards sit in a 3-column grid with 14–28px gutters.

### Black Showcase Band
**Role:** Full-width dark section displaying the custom dingbat font at use size.

Pure black (#000000) full-bleed background spanning the viewport width. A horizontal row of glyph characters rendered in the custom good-glyphs font at ~288px. The glyphs appear in the same Pledge Mint as the rest of the palette — the only color-on-black moment in the system. A small expand/collapse control sits flush-right in the top corner.

### Body Paragraph Block
**Role:** Explanatory copy beneath the headline and donation controls.

Black text on Pledge Mint. Helvetica Neue weight 400, 14px, line-height 1.50, tracking -0.42px. Max width not constrained — the text runs naturally across the full canvas width. Links inherit black with a black underline (no blue, no chromatic accent).

### Section Heading (Mid-tier)
**Role:** Sub-section labels like 'CONTRIBUTORS'.

Helvetica Neue weight 300, 28px, line-height 1.20, tracking -0.84px. Uppercase. Black on Pledge Mint. Visually the smallest headline tier; the system jumps from 28px straight to 288px with nothing in between.

### Form Input
**Role:** Custom-amount entry field beside the donation chips.

Transparent background, 1px Carbon (#101010) border, 14px radius. Padding 4px 7px. Helvetica Neue weight 400 at 13–14px, black text. No focus ring color change — the system has no color to spend on focus states. Functions as a quiet inline form element.

## Do's and Don'ts

### Do
- Set the primary display at 288px / weight 300 / line-height 0.80 / tracking -8.64px — the size IS the identity
- Use 1px black borders with 14px radius for cards and 140px (full pill) for every interactive control
- Alternate full-bleed bands of #c7ffcd and #000000 to produce poster-strip rhythm
- Hold all body and label text at 13–14px Helvetica Neue weight 400, tracking -0.0300em
- Use 4px as the base spacing unit; paddings should land on 4, 7, 14, or 28px
- Render any glyph artwork in Pledge Mint on the black band — it is the only color-on-color moment allowed
- Let the section gap breathe at 84px between major bands — enough space to read each poster as separate

### Don't
- Never introduce a second chromatic color — no semantic reds, greens, blues, or grays
- Never use weight 700 for display — the system insists on light-weight headlines at extreme scale
- Never add drop shadows, gradients, or blurs — flatness is the contract
- Never break the pill geometry on buttons — no rounded-rect, no sharp corners, no 8px radius
- Never use the custom good-glyphs font for UI text — it is product showcase only
- Never set the canvas to white or off-white — Pledge Mint is the only acceptable light surface
- Never add a chromatic focus or hover color — state changes happen by fill inversion (mint→black, black→mint) only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Pledge Mint Canvas | `#c7ffcd` | Base page background, all light sections, the default surface for cards and buttons |
| 2 | Ink Black Band | `#000000` | Full-bleed dark section for showcasing the glyph font — the only non-mint surface |

## Elevation

The system has no elevation. No drop shadows, no glows, no lifted surfaces. Hierarchy is produced entirely by scale (288px vs 14px), by band alternation (mint → black → mint), and by border weight (1px black strokes). Components sit flat on the canvas; depth would dilute the poster-strip reading.

## Imagery

No photography, no illustration beyond the product itself. The 'imagery' IS the custom good-glyphs font rendered at 288px inside the black showcase band, and the hand-drawn dingbat glyphs in each contributor card. Everything is monochrome line art on flat color — the design system treats the typography as the only visual asset the page needs.

## Layout

Full-bleed sections with no max-width container — the page runs edge-to-edge as printed posters would. The hero is a single massive 288px headline stacked over a short uppercase descriptor, both flush-left, with no centered alignment. Below the hero sits a black showcase band spanning the full viewport width holding the glyph proof. Donation controls form a horizontal row of pill chips followed by a full-width pill action button. The contributor section is a 3-column card grid with 14–28px gutters. Navigation is minimal — a single flush-right project credit link in the hero's top-right corner. The overall rhythm is band-driven: mint, black, mint, with each band acting as an independent printed sheet rather than a continuous scroll.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink Black)
- background: #c7ffcd (Pledge Mint)
- border: #000000 (Ink Black, 1px)
- accent: #c7ffcd (Pledge Mint — used as mint-on-black inside the dark showcase band)
- primary action: #c7ffcd (filled action)

**Example Component Prompts**
1. Build a hero headline: 'GOOD GLYPHS' in Helvetica Neue weight 300, 288px, line-height 0.80, letter-spacing -8.64px, uppercase, color #000000, on a #c7ffcd canvas.
2. Build a contributor card: 1px #000000 border, 14px radius, padding 14px, with the designer's name in 14px weight 400 #000000 top-left and their glyph artwork filling the card body on a #c7ffcd background.
3. Build a donation amount chip: 140px border-radius, 1px #000000 border on transparent over #c7ffcd, 14px weight 400 black text, padding 4px 7px, tracking -0.42px.
4. Build a full-width action button: 140px radius, 1px #000000 border, #c7ffcd background, uppercase 14px weight 400 black text, tracking -0.42px, padding 7px 14px, stretching to nearly full container width.
5. Build a black showcase band: full-bleed #000000 background spanning viewport width, with a horizontal row of custom dingbat glyphs at 288px rendered in #c7ffcd.

## Similar Brands

- **Pinterest Brand Pages** — Same oversized display type on a single soft tinted canvas with full-bleed section bands
- **Field Notes (fieldnotesbrand.com)** — Printed-poster aesthetic: one accent color, flat black ink, tight letter-spacing, pill controls, zero shadows
- **It's Nice That** — Editorial charity-poster treatment — giant display type, tight tracking, two-color palette, no UI chrome
- **Locomotive (locomotive.ca)** — Full-bleed band layouts with no max-width container and type pushed to architectural scale

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pledge-mint: #c7ffcd;
  --color-ink-black: #000000;
  --color-carbon: #101010;

  /* Typography — Font Families */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-good-glyphs: 'good-glyphs', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.39px;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.84px;
  --text-display: 288px;
  --leading-display: 0.8;
  --tracking-display: -8.64px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-14: 14px;
  --spacing-28: 28px;

  /* Layout */
  --section-gap: 84px;
  --card-padding: 14px;
  --element-gap: 7px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-full: 140px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-buttons: 140px;

  /* Surfaces */
  --surface-pledge-mint-canvas: #c7ffcd;
  --surface-ink-black-band: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pledge-mint: #c7ffcd;
  --color-ink-black: #000000;
  --color-carbon: #101010;

  /* Typography */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-good-glyphs: 'good-glyphs', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.39px;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.84px;
  --text-display: 288px;
  --leading-display: 0.8;
  --tracking-display: -8.64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-14: 14px;
  --spacing-28: 28px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-full: 140px;
}
```
