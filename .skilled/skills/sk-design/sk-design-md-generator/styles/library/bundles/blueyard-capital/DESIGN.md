# BlueYard Capital — Style Reference
> Sunset editorial observatory. A warm peach horizon bleeds into pure white, one oversized headline floats in the negative space, and a single 3D celestial body hangs below like a planet in a printed monograph.

**Theme:** light

BlueYard Capital reads as a printed editorial object disguised as a venture capital homepage: a vast white canvas anchored by one warm peach atmospheric wash, a single oversized Instrument Sans headline, and a rendered spherical artwork that behaves like a magazine cover image. The palette is 98% achromatic — a warm near-black (#3a3a3e) does all the textual heavy lifting against pure white — with three pale chromatic tints (peach, lavender, pink) appearing only as card backgrounds and hairlines, never as functional buttons. Cards are flat, borderless or hairline-bordered, and float on whitespace rather than sitting in shadow wells. Navigation is barely there: a tiny two-line wordmark and a hamburger square. The whole site earns attention through restraint and scale, not chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surfaces, ghost button fill — the primary stage everything else sits on |
| Graphite Ink | `#3a3a3e` | `--color-graphite-ink` | Primary text, link color, icon strokes, hairline borders, ghost button borders — a warm near-black that carries 97% of all typographic weight |
| Deep Carbon | `#090b11` | `--color-deep-carbon` | Accent text, nav strokes, strong card borders — slightly cooler and harder than Graphite Ink, reserved for moments of maximum contrast |
| Ash Veil | `#b5b0b0` | `--color-ash-veil` | Muted body backgrounds, soft borders — a warm gray used for secondary surface bands beneath the main canvas |
| Apricot Wash | `#ffcf9e` | `--color-apricot-wash` | Card backgrounds and borders — the dominant chromatic accent, used as a warm fill or hairline outline on featured cards |
| Iris Mist | `#babfff` | `--color-iris-mist` | Card backgrounds and borders — cool lavender counterpoint to Apricot Wash, pairs with peach on portfolio or feature cards |
| Fuchsia Bloom | `#e3a2ef` | `--color-fuchsia-bloom` | Card backgrounds — a vivid pink fill, the most saturated color in the system, appears as a solid block rather than a border |
| Polar Blue | `#bfe0f7` | `--color-polar-blue` | Soft surface tint — pale sky blue used as a rare secondary card or section background, cooling the warm peach/lavender/pink palette |

## Tokens — Typography

### Instrument Sans — The only typeface. Used for every UI element, every headline, every caption. Weight 400 is default body and display; weight 500 sparingly for nav labels and emphasis. The signature move: Instrument Sans is a humanist geometric grotesque with optical corrections — paired with aggressive negative tracking at display sizes, it produces tight, modern, almost couture typography that reads as editorial, not SaaS. · `--font-instrument-sans`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 500
- **Sizes:** 12px, 24px, 48px, 54px
- **Line height:** 1.00, 1.20, 1.50
- **Letter spacing:** -0.36px at 12px, -0.24px at 24px, -1.62px at 54px, -0.54px at 48px
- **Role:** The only typeface. Used for every UI element, every headline, every caption. Weight 400 is default body and display; weight 500 sparingly for nav labels and emphasis. The signature move: Instrument Sans is a humanist geometric grotesque with optical corrections — paired with aggressive negative tracking at display sizes, it produces tight, modern, almost couture typography that reads as editorial, not SaaS.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.36px | `--text-caption` |
| body | 24px | 1.5 | -0.24px | `--text-body` |
| heading | 48px | 1.2 | -0.54px | `--text-heading` |
| display | 54px | 1 | -1.62px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 60 | 60px | `--spacing-60` |
| 90 | 90px | `--spacing-90` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 90px
- **Card padding:** 12px
- **Element gap:** 5px

## Components

### Centered Editorial Headline
**Role:** Hero typography block

Full-width centered headline at 54px Instrument Sans weight 400, line-height 1.0, letter-spacing -1.62px, color #3a3a3e. Sits in the upper third of the viewport with generous top padding (~90px). Optional subtitle at 24px below with 24px gap. No underline, no decoration — the scale and tracking do the work.

### Apricot-Bordered Card
**Role:** Featured content card with warm border

White card surface with a 1px #ffcf9 border, 12px internal padding, 0px radius. Text inside uses #3a3a3 at 12-24px. No shadow. The peach border is the only signal — it reads as warm, hand-marked, not decorative.

### Apricot Fill Card
**Role:** Solid peach card

Full #ffcf9 background, 12px padding, 0px radius. Dark text (#3a3a3e) reads at AAA contrast (13.7:1). Used sparingly — one per section — to mark a single highlighted item.

### Lavender-Bordered Card
**Role:** Cool counterpoint card

White surface with 1px #babfff border, 12px padding, 0px radius. Pairs visually with Apricot cards on portfolio or team grids to create warm/cool rhythm.

### Fuchsia Fill Card
**Role:** Vivid solid-color card

Full #e3a2ef background, 12px padding, 0px radius, #090b11 text (10:1 contrast). The most saturated element in the system — appears as a single block, never repeated in a row.

### Polar Blue Surface Band
**Role:** Soft section background

Full-bleed #bfe0f7 band used as a section background — no border, no radius. Provides a cool pause between warm peach moments.

### Wordmark Lockup
**Role:** Brand identifier in top-left

Two-line uppercase text 'BLUE / YARD' in Instrument Sans weight 500 at 12px, line-height 1.0, letter-spacing -0.36px, color #3a3a3e. No logo symbol, no container — just the text stacked tight against the top-left corner.

### Hamburger Menu Button
**Role:** Primary navigation trigger

A 40x40px white square in the top-right corner with a thin #3a3a3 border and a three-line hamburger icon centered inside. 0px radius, no fill. The square outline is the only chrome — the whole nav is this single tap target.

### Ghost Link
**Role:** Inline navigation and text links

Body text styled as link: #3a3a3 color, no underline by default, 1px underline on hover in #3a3a3e. Weight stays 400. Links inherit surrounding type size.

### Full-Bleed 3D Artwork Stage
**Role:** Atmospheric visual anchor

Large rendered sphere or abstract 3D object positioned in the lower half of the viewport, bleeding off the bottom edge. No frame, no border, no caption. Background uses a soft radial peach-to-white gradient. The artwork is the hero, not a supporting illustration.

### Hairline Divider
**Role:** Section separator

1px line in #3a3a3 spanning the full content width. No double lines, no dots, no decorative breaks. The starkest structural element in a system that otherwise avoids borders.

## Do's and Don'ts

### Do
- Keep 97%+ of all text and borders in #3a3a3 — let the warm near-black carry the entire interface
- Use the three chromatic tints (#ffcf9, #babfff, #e3a2ef) only as card backgrounds or 1px hairline borders, never as text or icons
- Set every radius to 0px — cards, buttons, tags, and nav all share sharp corners
- Reserve Instrument Sans weight 500 for nav labels and the wordmark; use weight 400 for everything else including 54px display headlines
- Apply -1.62px tracking to the 54px display size and proportional tightening down the scale; never use positive letter-spacing
- Anchor every section with 90px of vertical breathing room top and bottom; let the white canvas do the work of hierarchy
- Let one 3D or photographic artwork occupy the lower half of the hero — full-bleed, uncaptioned, off-frame

### Don't
- Do not introduce shadows, glows, or elevated surfaces — the system is intentionally flat and border-driven
- Do not round corners on any element, including buttons, cards, and tags — 0px radius is the signature
- Do not use a chromatic color as a button background or text color — peach, lavender, and pink are card-only
- Do not add a visible primary CTA button in a brand color; the system uses white-fill ghost buttons on #3a3a3 borders instead
- Do not use positive letter-spacing anywhere; the system tracks tight, especially at display sizes
- Do not use drop shadows under cards or images; rely on whitespace and hairlines to separate layers
- Do not add decorative gradients to UI components; gradients are reserved for atmospheric hero washes only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background — the dominant surface occupying most of the viewport |
| 1 | Ash Band | `#b5b0b0` | Soft warm-gray section background used as a quiet band beneath the main canvas |
| 2 | Polar Blue Field | `#bfe0f7` | Cool pale-blue surface tint, used as a full-bleed section background for variety |
| 3 | Apricot Field | `#ffcf9` | Warm peach card fill — marks a single highlighted card per section |
| 4 | Fuchsia Field | `#e3a2ef` | Vivid pink card fill — the most saturated surface, used as a singular accent block |

## Elevation

- **Cards:** `none — flat surfaces, no box-shadow`
- **Buttons:** `none — flat surfaces, no box-shadow`
- **Navigation:** `none — flat surfaces, no box-shadow`

## Imagery

The visual identity is anchored by large, uncaptioned 3D rendered objects — primarily spherical or planetary forms with particle effects, set against warm peach-to-white radial gradients. Imagery bleeds off the viewport edges with no frame, border, or caption. There is no photography, no stock illustration, and no decorative iconography. When icons appear, they are thin-line Instrument Sans-adjacent glyphs in #3a3a3e. The 3D artwork occupies 40-60% of the viewport and functions as a magazine cover plate rather than a product screenshot.

## Layout

Full-bleed page model with content centered or left-aligned within a ~1200px implicit max-width. The hero is the defining pattern: a massive centered Instrument Sans headline in the upper third, with a large 3D artwork hanging in the lower half bleeding off the bottom edge. Below the hero, the page flows in alternating white and soft-tinted bands (ash gray, polar blue) with 90px vertical padding separating each section. Cards appear in single-column or 2-3 column grids with 5-12px gaps. Navigation is minimal: a tiny two-line wordmark top-left and a single hamburger square top-right — no mega-menu, no horizontal nav bar. The overall rhythm is spacious and editorial, with content sections that breathe rather than pack.

## Agent Prompt Guide

Quick Color Reference:
- text: #3a3a3e (primary) / #090b11 (accent)
- background: #ffffff (canvas) / #b5b0b0 (ash band) / #bfe0f7 (polar blue)
- border: #3a3a3e (hairline) / #ffcf9e (peach accent) / #babfff (lavender accent)
- accent: #ffcf9e (apricot) / #babfff (iris) / #e3a2ef (fuchsia)
- primary action: no distinct CTA color

Example Component Prompts:
1. Centered Hero Headline: 54px Instrument Sans weight 400, #3a3a3e, line-height 1.0, letter-spacing -1.62px, centered, with 90px top padding on a #ffffff canvas. Optional 24px subtitle below in same color with 24px gap.
2. Apricot-Bordered Featured Card: white surface, 1px #ffcf9e border, 12px padding, 0px radius, 12-24px #3a3a3e text inside, no shadow, 5px gap to next card.
3. Fuchsia Fill Highlight Block: full #e3a2ef background, 12px padding, 0px radius, #090b11 text at 24px weight 400, letter-spacing -0.24px. Use once per page as a singular accent.
4. Hamburger Nav Button: 40x40px white square with 1px #3a3a3e border, 0px radius, three-line hamburger icon centered in #3a3a3e. Positioned top-right with 12px margin.
5. Hairline Section Divider: 1px solid #3a3a3e line spanning the full content width (~1200px), 0px height container, used between sections in place of a background-color shift.

## Color System Philosophy

The palette is structured as a 5-step surface scale rather than a traditional primary/secondary model: white (canvas) → ash (warm gray band) → polar blue (cool pause) → apricot (warm accent) → fuchsia (vivid singularity). Peach (#ffcf9e) is the workhorse chromatic, used 4x more frequently than lavender and 5x more than fuchsia. The three chromatic tints share a similar value range (~85% lightness) so they read as a family of card materials rather than competing brand colors. Text color is monolithic: #3a3a3e handles 97% of all text rendering, with #090b11 reserved for moments of maximum emphasis. This is a system that uses color as a form of categorization (what kind of card is this?) rather than as a form of decoration.

## Typography Philosophy

Instrument Sans is the only typeface. The system uses four sizes (12, 24, 48, 54) with a 4.5x jump from caption to display — this is an editorial scale, not a UI scale. Body text sits at a generous 24px rather than the typical 16px, which gives every paragraph printed-magazine density. The display size of 54px combined with line-height 1.0 creates a single-line headline treatment; the headline is never meant to wrap. Negative letter-spacing scales proportionally with size: -3% at 12px (-0.36px) to -3% at 54px (-1.62px), producing tightly knit letterforms that feel couture rather than corporate. Weight 500 is used only for the wordmark and nav labels — weight 400 carries everything else including the largest display text.

## Similar Brands

- **Stripe Press** — Same editorial-monograph restraint: a single typeface, white canvas, and large centered headlines paired with single atmospheric images — no SaaS chrome
- **Index Ventures** — Venture capital sites that treat the homepage as a printed publication, with oversized headlines and minimal navigation relying on a single menu trigger
- **Koto Studio** — Branding-agency portfolio aesthetic with pale chromatic card accents (peach, lavender, pink) sitting on white with sharp 0px corners and no shadows
- **The Browser Company** — Single warm atmospheric gradient on a light canvas paired with a singular oversized 3D object as the hero visual anchor
- **Are.na** — Quiet, text-led interface that uses a warm near-black as the sole text color against white, with chromatic tints appearing only as surface bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-graphite-ink: #3a3a3e;
  --color-deep-carbon: #090b11;
  --color-ash-veil: #b5b0b0;
  --color-apricot-wash: #ffcf9e;
  --color-iris-mist: #babfff;
  --color-fuchsia-bloom: #e3a2ef;
  --color-polar-blue: #bfe0f7;

  /* Typography — Font Families */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.36px;
  --text-body: 24px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.54px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -1.62px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-60: 60px;
  --spacing-90: 90px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 90px;
  --card-padding: 12px;
  --element-gap: 5px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-ash-band: #b5b0b0;
  --surface-polar-blue-field: #bfe0f7;
  --surface-apricot-field: #ffcf9;
  --surface-fuchsia-field: #e3a2ef;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-graphite-ink: #3a3a3e;
  --color-deep-carbon: #090b11;
  --color-ash-veil: #b5b0b0;
  --color-apricot-wash: #ffcf9e;
  --color-iris-mist: #babfff;
  --color-fuchsia-bloom: #e3a2ef;
  --color-polar-blue: #bfe0f7;

  /* Typography */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.36px;
  --text-body: 24px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.54px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -1.62px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-60: 60px;
  --spacing-90: 90px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
