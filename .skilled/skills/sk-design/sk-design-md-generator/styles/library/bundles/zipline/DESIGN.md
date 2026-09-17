# Zipline — Style Reference
> open meadow in morning light

**Theme:** light

Zipline reads like a nature magazine cover reimagined for a drone-delivery startup: a warm cream canvas (#f7f4e8) replaces the usual stark SaaS white, and the entire visual rhythm is dictated by fkScreamer — a massive, ultra-heavy display face that stamps oversized editorial statements across the page. Photography is the primary medium, shot at ground level with motion blur so the landscape itself feels like it's moving; the UI is a secondary layer that only intrudes with thin black outlines, a single violet (#643aed) accent for cards, and restrained type. Components are generous (20px radii, 24px interior padding) but never decorative — the system prizes breathing room and confident restraint over dense information architecture.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Meadow Cream | `#f7f4e8` | `--color-meadow-cream` | Page canvas, card surfaces, body text inverse, button borders — the warm off-white that gives the whole system its outdoor, paper-like character instead of clinical SaaS white |
| Hillside Ink | `#000000` | `--color-hillside-ink` | Primary headings, body copy, icon strokes, filled action buttons, hairline borders — maximum-contrast black that lets the cream breathe and makes fkScreamer headlines land |
| Stone Border | `#c6c3ba` | `--color-stone-border` | Muted dividers, secondary surfaces, low-contrast borders — warm gray that sits a step behind Meadow Cream and prevents the canvas from looking flat |
| Drone Violet | `#643aed` | `--color-drone-violet` | Card and feature-block backgrounds, accent surfaces — the single chromatic note in an otherwise achromatic system; vivid against the cream so attention-grabbing blocks pop without breaking the editorial mood |

## Tokens — Typography

### fkGroteskNeue — Body copy, navigation, buttons, captions, and any text smaller than the display headlines — the workhorse grotesque that handles all functional UI at 14–22px. The consistent -0.01em tracking keeps it tight even at small sizes. · `--font-fkgroteskneue`
- **Substitute:** Inter, Neue Haas Grotesk, or Söhne
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 16, 18, 22, 120px
- **Line height:** 0.85, 1.0, 1.2, 1.4
- **Letter spacing:** -0.14px at 14px, -0.16px at 16px, -0.18px at 18px, -0.22px at 22px
- **Role:** Body copy, navigation, buttons, captions, and any text smaller than the display headlines — the workhorse grotesque that handles all functional UI at 14–22px. The consistent -0.01em tracking keeps it tight even at small sizes.

### fkScreamer — Signature display face — used only for oversized editorial statements (40–150px). This is the voice of the brand: ultra-heavy, aggressively condensed, line-height 0.85 so the letters nearly touch. The restraint of using one weight at one role makes the moments it appears feel like magazine pull-quotes, not just headings. · `--font-fkscreamer`
- **Substitute:** Druk Wide, Antonio Bold, or Tungsten Bold
- **Weights:** 700
- **Sizes:** 40, 90, 120, 150px
- **Line height:** 0.85
- **Role:** Signature display face — used only for oversized editorial statements (40–150px). This is the voice of the brand: ultra-heavy, aggressively condensed, line-height 0.85 so the letters nearly touch. The restraint of using one weight at one role makes the moments it appears feel like magazine pull-quotes, not just headings.

### fkDisplay — Mid-weight display variant for sub-statements that need fkScreamer's character at a smaller scale — bridges the gap between the massive editorial type and fkGroteskNeue body · `--font-fkdisplay`
- **Substitute:** Tungsten, Druk Condensed, or Compacta
- **Weights:** 400
- **Sizes:** 22px
- **Line height:** 0.85
- **Role:** Mid-weight display variant for sub-statements that need fkScreamer's character at a smaller scale — bridges the gap between the massive editorial type and fkGroteskNeue body

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | -0.14px | `--text-caption` |
| body | 16px | 1.4 | -0.16px | `--text-body` |
| body-lg | 18px | 1.4 | -0.18px | `--text-body-lg` |
| subheading | 22px | 1 | -0.22px | `--text-subheading` |
| heading-sm | 40px | 0.85 | — | `--text-heading-sm` |
| heading | 90px | 0.85 | — | `--text-heading` |
| heading-lg | 120px | 0.85 | — | `--text-heading-lg` |
| display | 150px | 0.85 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 20px |
| images | 20px |
| buttons | 20px |

### Layout

- **Section gap:** 60-128px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Pill Action Button (Filled Black)
**Role:** Primary conversion action

Hillside Ink (#000000) filled background, Meadow Cream (#f7f4e8) text, fkGroteskNeue 16px weight 500, 20px radius, 14px vertical / 24px horizontal padding. Thin black border (1px #000000) sits flush with the fill.

### Ghost Outline Button
**Role:** Secondary action or navigation CTA

Transparent background, 1px Hillside Ink border, Hillside Ink text, fkGroteskNeue 16px weight 500, 20px radius, 12–14px vertical / 20–24px horizontal padding. Used for "Try it now" and "Get delivery" CTAs.

### Editorial Display Statement
**Role:** Hero or section-level headline

fkScreamer 700, sizes 90–150px, line-height 0.85, normal letter-spacing. No color override needed — renders in Hillside Ink on Meadow Cream. The type itself is the component.

### Violet Feature Card
**Role:** Highlighted content block

Drone Violet (#643aed) background, Meadow Cream text, 20px radius, 24px padding. The single chromatic surface in the system — use sparingly to mark featured content.

### Outlined Cream Card
**Role:** Standard content card on cream canvas

Meadow Cream (#f7f4e8) background, 1px Hillside Ink border, 20px radius, 24px padding. No shadow — the border does the elevation work.

### Full-Bleed Photo Hero
**Role:** Hero section background

Edge-to-edge photography (no max-width, no rounding at the page edge) with Meadow Cream headline overlay in fkScreamer. The photo bleeds off all sides; the curve at the bottom transitions into the cream canvas below.

### Top Navigation Bar
**Role:** Global header

Transparent or Meadow Cream background, hamburger icon (left), centered Zipline wordmark, ghost outline CTA (right) "Get delivery ↗". No background fill — sits directly on the hero photo or cream canvas.

### Inline Thumbnail Token
**Role:** Embedded visual within display text

Small rounded photograph (20px radius) dropped into a line of fkScreamer text as a visual inline element. Unique editorial device — the image becomes a word.

## Do's and Don'ts

### Do
- Use fkScreamer 700 at 90–150px for editorial headlines; line-height 0.85 is non-negotiable — it's what makes the type feel stamped rather than set
- Keep the canvas at Meadow Cream (#f7f4e8) on every body section; reserve stark white for moments you specifically want to feel clinical
- Default all buttons, cards, and images to 20px radius — this single value unifies the system and is the most repeated shape token
- Pair fkGroteskNeue body at 16px/1.4 with fkScreamer displays; never use fkScreamer for anything under 40px
- Reach for Drone Violet (#643aed) only as a card or feature-block surface, never as a text color or border — its job is to make a block pop, not to tint typography
- Use 1px Hillside Ink borders in place of shadows for elevation; the system is flat-by-default and the border carries the separation
- Bleed photography full-bleed in heroes and section dividers; avoid contained rounded image cards at large scale

### Don't
- Don't use fkScreamer for body copy, navigation, captions, or anything under 40px — the weight and line-height collapse at small sizes
- Don't introduce additional chromatic accent colors; the entire system's restraint depends on having exactly one violet
- Don't add box-shadows to cards or buttons — use 1px borders or the violet surface for separation instead
- Don't use pure white (#ffffff) as a background; Meadow Cream is the canvas and stark white breaks the warm editorial tone
- Don't set body type at anything other than fkGroteskNeue 16px/1.4 as the default — resist the urge to mix in a serif or secondary sans
- Don't apply radii smaller than 20px to interactive elements; buttons, cards, and images all share the same generous rounding
- Don't use letter-spacing on fkScreamer — it ships with normal tracking and the tight glyph spacing is part of its impact

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Meadow Cream | `#f7f4e8` | Page canvas — the warm off-white base that all content sits on |
| 1 | Stone Border | `#c6c3ba` | Subtle secondary surface and divider tone for low-emphasis sections |
| 2 | Drone Violet | `#643aed` | Accent card / feature-block surface — the only chromatic surface in the system |
| 3 | Hillside Ink | `#000000` | Inverted surface for filled buttons, dark hero photo zones, and high-contrast text blocks |

## Elevation

- **Outlined Cream Card:** `none (1px #000000 border instead of shadow)`
- **Violet Feature Card:** `none (surface color contrast instead of shadow)`
- **Pill Action Button:** `none (flat fill, no shadow)`

## Imagery

Full-bleed landscape photography dominates: motion-blurred green hillsides, low-angle nature shots, and small embedded portrait thumbnails integrated inline with display type. All photography is shot at ground level with natural daylight — no studio, no product-on-white, no abstract 3D renders. The blur and speed in the hero photo communicates 'drone delivery' without ever showing a drone. A small portrait thumbnail of a person appears as a visual token dropped into the middle of an fkScreamer headline, a signature editorial device.

## Layout

Full-bleed layout with no max-width container — pages extend edge-to-edge. The hero is a full-viewport landscape photograph with the headline (fkScreamer, cream-colored) positioned bottom-left and a ghost button below it. Below the hero, a curved mask transitions the photo into the Meadow Cream canvas. The main body uses centered display statements at 90–150px, often broken across multiple lines, with body copy left-aligned in a narrower measure below. Navigation is a minimal top bar (hamburger left, centered wordmark, ghost CTA right) that floats transparently over the hero. Section gaps are generous (60–128px) and the system relies on the type scale and photography, not grids or columns, to create rhythm.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 (Hillside Ink)
- background: #f7f4e8 (Meadow Cream)
- border: #000000 (Hillside Ink) or #c6c3ba (Stone Border)
- accent surface: #643aed (Drone Violet)
- primary action: #000000 (filled action)

## Example Component Prompts

1. **Editorial hero section**: Full-bleed landscape photograph as background. Headline at 120px fkScreamer weight 700, #f7f4e8, line-height 0.85, positioned bottom-left. Subtext at 18px fkGroteskNeue weight 400, #f7f4e8. Ghost outline button below: 1px #f7f4e8 border, #f7f4e8 text, 20px radius, 14px 24px padding, fkGroteskNeue 16px weight 500.

2. **Centered display statement on cream**: Meadow Cream (#f7f4e8) background. Headline at 90px fkScreamer weight 700, #000000, line-height 0.85, centered. Body text at 16px fkGroteskNeue weight 400, #000000, max-width 640px, centered below with 60px top margin.

3. **Violet feature card**: Drone Violet (#643aed) background, 20px radius, 24px padding. Headline at 22px fkGroteskNeue weight 600, #f7f4e8. Body at 16px fkGroteskNeue weight 400, #f7f4e8.

4. **Outlined cream card**: Meadow Cream (#f7f4e8) background, 1px #000000 border, 20px radius, 24px padding. No shadow. Text in #000000.

5. **Top navigation bar**: Transparent background, no border. Hamburger icon (2px stroke) left, wordmark "Zipline" centered in fkGroteskNeue 16px weight 600, ghost button right: 1px #000000 border, #000000 text, 20px radius, 12px 20px padding.

## Type Pairing Logic

fkScreamer is a one-role font: display only, 40px+, weight 700, line-height 0.85. fkGroteskNeue handles everything else (body, nav, buttons, captions) at 14–22px, weights 400–700, line-height 1.0–1.4. fkDisplay (22px, weight 400) is a bridge option for mid-size statements that need display character without Screamer's volume. The contrast between Screamer's aggressive compression and Grotesk's clean readability is the system's signature — never use them at the same size in the same block.

## Similar Brands

- **Patagonia** — Same warm cream canvas, nature-first full-bleed photography, oversized editorial type, and one restrained accent color — the print-magazine-over-photography approach
- **Allbirds** — Warm off-white background replacing typical e-commerce white, oversized condensed display type, and photography that bleeds edge-to-edge without rounded containers
- **Rivian** — Nature-led hero photography with motion blur, minimal UI chrome, and a single accent color (violet here, teal for Rivian) against a warm neutral canvas
- **Arc'teryx** — Editorial product-page layout with massive display headlines over landscape imagery, thin black borders instead of shadows, and a commitment to one warm neutral as the system base

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-meadow-cream: #f7f4e8;
  --color-hillside-ink: #000000;
  --color-stone-border: #c6c3ba;
  --color-drone-violet: #643aed;

  /* Typography — Font Families */
  --font-fkgroteskneue: 'fkGroteskNeue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fkscreamer: 'fkScreamer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fkdisplay: 'fkDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 0.85;
  --text-heading: 90px;
  --leading-heading: 0.85;
  --text-heading-lg: 120px;
  --leading-heading-lg: 0.85;
  --text-display: 150px;
  --leading-display: 0.85;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --section-gap: 60-128px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-meadow-cream: #f7f4e8;
  --surface-stone-border: #c6c3ba;
  --surface-drone-violet: #643aed;
  --surface-hillside-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-meadow-cream: #f7f4e8;
  --color-hillside-ink: #000000;
  --color-stone-border: #c6c3ba;
  --color-drone-violet: #643aed;

  /* Typography */
  --font-fkgroteskneue: 'fkGroteskNeue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fkscreamer: 'fkScreamer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fkdisplay: 'fkDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 0.85;
  --text-heading: 90px;
  --leading-heading: 0.85;
  --text-heading-lg: 120px;
  --leading-heading-lg: 0.85;
  --text-display: 150px;
  --leading-display: 0.85;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-2xl: 20px;
}
```
