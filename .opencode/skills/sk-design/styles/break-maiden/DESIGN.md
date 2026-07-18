# Break Maiden — Style Reference
> Oversized white type carved into a black gallery wall. A single condensed display face at 150px sits in a sea of negative space, surrounded by product photographs arranged like a magazine spread.

**Theme:** dark

Break Maiden operates as a black-canvas portfolio for a creative studio: pure black surfaces, oversized white display type, and product imagery presented like a curated print spread. The visual system is deliberately monochrome and typographically aggressive — a single custom display face (Martin) at near-billboard scale does all the emotional work, while a restrained neo-grotesque (America) carries navigation, body, and captions. The page is a gallery: project tiles sit on an irregular three-column grid with generous gutters, letting the product photography carry the color that the interface refuses to. There are no buttons, gradients, shadows, or decoration in the chrome itself — the system derives its identity from the contrast between negative space and a colossal heading, not from palette depth.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Onyx Black | `#000000` | `--color-onyx-black` | Page canvas, hero background, card surface base — the only color that ever fills a region. Every section, card, and divider sits on this absolute black |
| Bone White | `#ffffff` | `--color-bone-white` | Primary display type, nav text, card titles, body copy, hairline borders on the few framed elements — used wherever a shape or letter needs to be seen against black |
| Ash Gray | `#8e8e8e` | `--color-ash-gray` | Muted metadata and secondary nav strokes — the only mid-tone in the system, reserved for information that must recede behind the headline |

## Tokens — Typography

### Martin — Signature display headline. A custom condensed sans rendered at 153px — used only for the hero statement. Its scale is the brand: every other element on the page visually defers to it. Substitute: Anton, Tungsten Bold, Druk Wide Bold. · `--font-martin`
- **Substitute:** Anton
- **Weights:** 400
- **Sizes:** 153px
- **Line height:** normal
- **Letter spacing:** normal
- **Role:** Signature display headline. A custom condensed sans rendered at 153px — used only for the hero statement. Its scale is the brand: every other element on the page visually defers to it. Substitute: Anton, Tungsten Bold, Druk Wide Bold.

### America — Primary UI and body voice — nav links, card titles, and tagline copy. A neo-grotesque with quiet character; the contrast against Martin's display weight is what creates the system's editorial rhythm. Substitute: Söhne, Inter, Neue Haas Grotesk. · `--font-america`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 19px, 22px
- **Line height:** 1.00–1.50
- **Role:** Primary UI and body voice — nav links, card titles, and tagline copy. A neo-grotesque with quiet character; the contrast against Martin's display weight is what creates the system's editorial rhythm. Substitute: Söhne, Inter, Neue Haas Grotesk.

### Helvetica Neue — Fallback / system layer. Appears where America is absent — likely secondary display moments or browser-default rendering. Keeps a grotesque geometry consistent with America at smaller scale. · `--font-helvetica-neue`
- **Substitute:** Helvetica
- **Weights:** 400, 500
- **Sizes:** 25px
- **Line height:** 1.00
- **Role:** Fallback / system layer. Appears where America is absent — likely secondary display moments or browser-default rendering. Keeps a grotesque geometry consistent with America at smaller scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 19px | 1.25 | — | `--text-body-sm` |
| body | 22px | 1.5 | — | `--text-body` |
| display | 153px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 13 | 13px | `--spacing-13` |
| 18 | 18px | `--spacing-18` |
| 27 | 27px | `--spacing-27` |
| 43 | 43px | `--spacing-43` |
| 78 | 78px | `--spacing-78` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 43px
- **Card padding:** 18px
- **Element gap:** 18px

## Components

### Display Headline Block
**Role:** Hero statement

Single line of Martin at 153px, weight 400, in Bone White (#ffffff) on Onyx Black (#000000). No line-height restriction, no max-width clamp — the headline occupies the full left two-thirds of the viewport. Inline graphic glyphs (parenthetical icon, arrow, sunburst) sit at display scale as type, not images.

### Top Navigation Bar
**Role:** Primary navigation

Horizontal bar on Onyx Black. Logo (circular stamp) at far left in Bone White. Four text links right-aligned: Work, About, Contact, Shop. America 400 at 19px, Bone White, no underline. ~43px horizontal padding from page edge, ~18px vertical padding.

### Hero Intro Paragraph
**Role:** Supporting hero copy

Short body sentence (2-3 lines) in America 400, 19px, Bone White, sitting to the right of the oversized headline. Provides context without competing — its smallness is the point.

### Project Tile
**Role:** Portfolio card

Full-bleed product photograph with no border, no radius, no shadow — image sits directly on the black canvas. Below the image: project name in America 400 at 19px Bone White, then a one-line tagline at 19px in a lighter weight. No card background, no padding around the image — the black of the page is the card.

### Project Grid
**Role:** Work index layout

Three-column irregular grid. Columns are not equal height — tiles span single, double, and offset positions to create a magazine-cut rhythm. Gutter is the page's own black; tiles touch visually but are separated by ~18px white space (or align to a sparse baseline).

### Logo Stamp
**Role:** Brand mark

Circular seal-style mark in the top-left corner — text wrapping a central glyph in Bone White on transparent black. Acts as the home link. No fill, no background plate.

### Ghost Link
**Role:** Inline navigation/action

Text link in America 400, 19-22px, Bone White, no underline at rest. On hover, a 1px Ash Gray underline appears. No filled buttons exist in the system — all CTAs are typographic.

### Section Divider
**Role:** Vertical rhythm

Pure negative space — no horizontal rules, no bands, no background changes. Sections are separated by ~43px of black and a shift in type scale or grid behavior.

## Do's and Don'ts

### Do
- Set the hero headline in Martin at 153px, weight 400, line-height normal — never shrink it below 96px, never set it in a different face
- Use only Onyx Black (#000000) as a fill for any region larger than a hairline — no charcoal, no near-black, no tinted grays
- Let project photography provide all color; the interface itself stays monochrome black-on-white
- Space project tiles on a three-column irregular grid where column heights differ — avoid uniform card grids
- Reserve America at 19-22px for everything that isn't the display headline — nav, card titles, taglines, body
- Use Ash Gray (#8e8e8e) only for metadata or hairline rules that must visually recede from the Bone White foreground
- Keep all corners at 0px radius — no rounded buttons, cards, or tags; the system is hard-edged throughout

### Don't
- Do not introduce any chromatic color — no accent blues, reds, or greens; the palette is black, white, gray
- Do not apply box-shadows, gradients, or glows — surfaces are flat, depth comes from type scale only
- Do not add a filled CTA button; all actions are typographic ghost links in Bone White
- Do not use a system sans for the display headline — Martin's condensed geometry is the signature
- Do not wrap the headline in a card, container, or centered max-width — it bleeds to the left edge
- Do not apply border-radius to images, cards, or any element — the aesthetic is razor-sharp
- Do not mix multiple mid-grays; Ash Gray at #8e8e8 is the only non-extreme neutral permitted

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#000000` | Every region of the page — hero, nav, grid, footer — sits directly on this surface. There is no higher elevation. |

## Elevation

The system has zero elevation. No shadows, no overlapping translucent layers, no z-stacked modals in the visual language. Depth is communicated entirely through typographic scale (153px headline vs 19px body) and the photograph-as-card relationship, not through surface stacking. This is a deliberate flat-aesthetic choice — adding shadows would shatter the print-spread / gallery-wall feel.

## Imagery

Product photography is the sole source of color in the system. All imagery is tightly cropped product shots (cans, bottles, jars, sauce labels) presented on light pastel or saturated single-color backdrops set against the black page. Photographs are square or 3:4, edge-to-edge with no border or frame, zero border-radius. The interface is icon-only in terms of graphic marks (a small greyhound illustration appears inline within the headline as a parenthetical character). No illustrations, no abstract graphics, no video. Photography does explanatory work (showcasing the work) rather than decorative work.

## Layout

Full-bleed dark canvas with no max-width container — the page extends to viewport edges on all sides. The hero is an asymmetric two-zone composition: a massive left-justified headline occupying roughly two-thirds of the viewport width, balanced by a small right-aligned intro paragraph. Navigation is a single top bar (logo left, four links right) with no sticky behavior implied. Below the hero, the layout shifts to a three-column irregular grid of project tiles where each tile is an edge-to-edge product photograph with a two-line caption (title + tagline) below in white type. The grid is deliberately uneven — tiles have different vertical positions and the column rhythm breaks across rows to create a magazine-cut feel rather than a uniform dashboard. Section transitions are made by black space alone, not by background color shifts.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff
- background: #000000
- border: #ffffff (hairline) or #8e8e8e (receded)
- accent: none — the system is monochrome
- primary action: no distinct CTA color

3-5 Example Component Prompts:

1. Hero headline block: Onyx Black (#000000) background. Display text in Martin (substitute: Anton) at 153px, weight 400, line-height 1.0, color #ffffff, left-aligned, no max-width. Include one inline graphic glyph (small running animal illustration inside parentheses) at display scale. No underline, no border.

2. Top navigation bar: Onyx Black (#000000) background, full-bleed. Circular stamp logo at far-left in #ffffff. Four text links right-aligned (Work, About, Contact, Shop) in America (substitute: Inter) 400, 19px, #ffffff, no fill, no border. Horizontal padding 43px from viewport edge, vertical padding 18px.

3. Project tile: Edge-to-edge product photograph (no border-radius, no border, no shadow) sitting directly on #000000. Below: project title in America 400, 19px, #ffffff. Below that: one-line tagline in America 400, 19px, #ffffff at reduced opacity or same weight. No card background, no padding around the image, no meta labels.

4. Ghost nav link: America 400, 19px, #ffffff, no underline, no background. On hover, 1px solid #8e8e8e underline appears. No filled state, no border-box, no padding beyond the text advance.

5. Supporting hero paragraph: America 400, 19-22px, line-height 1.5, #ffffff, right-aligned to the hero column, max-width ~30% of viewport. Sits at the vertical midpoint of the headline to the right of the display type.

## Similar Brands

- **Wieden+Kennedy** — Same agency-as-gallery approach: black canvas, oversized display type, product/portfolio imagery doing the color work, and zero UI chrome
- **Studio Dumbar** — Monochrome dark-mode portfolio with editorial display typography and irregular grid layouts for case studies
- **Pentagram** — Hard-edged zero-radius components, flat black surfaces, and let-the-work-speak composition with minimal navigation
- **Manual Creative** — Dark-canvas creative studio site that pairs a single condensed display face with product photography tiles in an uneven grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-onyx-black: #000000;
  --color-bone-white: #ffffff;
  --color-ash-gray: #8e8e8e;

  /* Typography — Font Families */
  --font-martin: 'Martin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-america: 'America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 19px;
  --leading-body-sm: 1.25;
  --text-body: 22px;
  --leading-body: 1.5;
  --text-display: 153px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-13: 13px;
  --spacing-18: 18px;
  --spacing-27: 27px;
  --spacing-43: 43px;
  --spacing-78: 78px;

  /* Layout */
  --section-gap: 43px;
  --card-padding: 18px;
  --element-gap: 18px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-onyx-black: #000000;
  --color-bone-white: #ffffff;
  --color-ash-gray: #8e8e8e;

  /* Typography */
  --font-martin: 'Martin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-america: 'America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 19px;
  --leading-body-sm: 1.25;
  --text-body: 22px;
  --leading-body: 1.5;
  --text-display: 153px;
  --leading-display: 1;

  /* Spacing */
  --spacing-13: 13px;
  --spacing-18: 18px;
  --spacing-27: 27px;
  --spacing-43: 43px;
  --spacing-78: 78px;
}
```
