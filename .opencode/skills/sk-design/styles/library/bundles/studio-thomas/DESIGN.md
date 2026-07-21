# Studio Thomas — Style Reference
> Alarm-orange broadcast panel on raw linen

**Theme:** mixed

Studio Thomas operates as an editorial broadcast system: raw linen canvas, one alarm-bell orange, and overscale geometric type that fills the frame. The site reads less like a product and more like a magazine spread — a hamburger and a wordmark are the only chrome, everything else is hero-block, full-bleed photograph, or oversized typography at weight 300. Color appears in single, committed blocks rather than as scattered accents: a hero panel saturates the screen, a cream footer grounds it, and project showcases are wall-sized photography with white display text floating on top. The signature is restraint meets volume — the palette is three colors, but one of them is loud enough to own every screen it touches.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Orange | `#ff4f00` | `--color-signal-orange` | Hero blocks, brand statement panels, full-bleed feature sections — the single chromatic commitment, used in large committed areas rather than small accents |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, logo, hairline borders, dark UI elements, and display type on light surfaces |
| Paper White | `#ffffff` | `--color-paper-white` | Display headings overlaid on photography and colored panels, input fields, light surface level, inverse text on dark hero blocks |
| Raw Linen | `#ebe9e3` | `--color-raw-linen` | Page canvas, footer background, secondary surface — warm off-white that softens the contrast between stark white and pure black |
| Faint Stone | `#767676` | `--color-faint-stone` | Input field borders, low-emphasis form chrome — the only mid-tone in the system |

## Tokens — Typography

### Moderat — Sole typeface — geometric sans-serif used at weight 300 for display and project names (120px) and weight 400 for body copy (16px). The light weight at display scale is a deliberate anti-shout: headlines whisper authority rather than declaring it, letting the orange blocks and editorial photography carry visual volume instead. · `--font-moderat`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 300, 400
- **Sizes:** 16px, 33px, 40px, 120px
- **Line height:** 1.00, 1.13, 1.20, 1.25, 1.60
- **Letter spacing:** -0.004em, +0.005em
- **Role:** Sole typeface — geometric sans-serif used at weight 300 for display and project names (120px) and weight 400 for body copy (16px). The light weight at display scale is a deliberate anti-shout: headlines whisper authority rather than declaring it, letting the orange blocks and editorial photography carry visual volume instead.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.6 | — | `--text-body` |
| subheading | 33px | 1.2 | -0.004px | `--text-subheading` |
| heading | 40px | 1.13 | -0.004px | `--text-heading` |
| display | 120px | 1 | -0.004px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 100px
- **Card padding:** 40px
- **Element gap:** 20-30px

## Components

### Signal Orange Hero Block
**Role:** Full-bleed brand statement panel

Edgeless rectangle filling the viewport or section, #ff4f00 background, centered display text at 120px in Ink Black (#000000), weight 300, line-height 1.0, letter-spacing -0.004em. No padding tokens measured — the type sits with generous optical margins inside the block.

### Project Showcase Panel
**Role:** Full-bleed editorial project card

Full-viewport photograph as background, no overlay or scrim, display text (project name) at 120px weight 300 in Paper White (#ffffff), positioned vertically centered-left. Project category caption (e.g. category label) at 16px weight 400 in white, bottom-left. "View project" link at 16px in white, bottom-right.

### Wordmark Header
**Role:** Minimal site identity

Fixed/sticky top bar on Raw Linen (#ebe9e3) canvas. Left: "Studio Thomas" at 16px weight 400, Ink Black. Right: hamburger icon (three lines) in Ink Black. No navigation links visible — the menu is collapsed behind the icon.

### Linen Footer
**Role:** Closing section

Full-width band with #ebe9e3 background, 100px top padding, 50px bottom padding. Contains small-format type and any secondary links at 16px weight 400 in Ink Black.

### Hairline-Bordered Link
**Role:** Text link with border treatment

Underlined or border-bordered text at 16px weight 400. Border color matches text (Ink Black on light surfaces, Paper White on dark/colored). 52 instances of white border and 32 of black border in the system — this border-link is the primary interactive pattern.

### Text Input Field
**Role:** Form input

Minimal input with 1px top/bottom padding, 2px left/right padding (very tight, likely CSS reset-level). Border-color #767676 (Faint Stone). White background. No visible focus ring in raw data — likely relies on browser default or subtle border-darken.

### Category Caption
**Role:** Project descriptor label

16px weight 400, Paper White (#ffffff), positioned at the bottom-left of a project showcase panel. Identifies the project type or industry. No background, no pill, no badge — raw text on photography.

### View Project Link
**Role:** Project CTA — text-only

16px weight 400, Paper White (#ffffff), bottom-right of project panel, likely with a subtle border or underline. No button background, no fill — the link is typographic only, consistent with the no-CTA-button system.

## Do's and Don'ts

### Do
- Use Signal Orange (#ff4f00) only in full, committed blocks — hero panels, section dividers, or accent rectangles. Never as a small dot, icon tint, or text color.
- Set display type at 120px weight 300 with line-height 1.0 and letter-spacing -0.004em. This is the signature scale — anything smaller undermines the editorial register.
- Use Raw Linen (#ebe9e3) as the page canvas, not pure white. The warm off-white is what separates this system from generic white-page SaaS layouts.
- Keep the header to a wordmark plus hamburger. Do not add nav links, search bars, or secondary actions to the top bar.
- Use weight 300 for all large-scale and display type. Reserve weight 400 for body copy (16px) and functional UI text.
- Let photography fill the entire viewport edge-to-edge for project showcases. Do not constrain to a max-width container or add margins.
- Space sections with 100px vertical gaps (footer token) and use 40px padding for contained content blocks.

### Don't
- Do not introduce a secondary accent color. The system is monochromatic-plus-orange — adding blue, green, or any other hue dilutes the commitment.
- Do not use border-radius on any element. The system is edgeless — buttons, cards, inputs, and tags are all sharp-cornered (0px radius).
- Do not use bold or black weights (600-900). Moderat is loaded at 300 and 400 only; using heavier weights breaks the restrained voice.
- Do not add drop shadows, glows, or elevation effects. Surfaces are flat — separation comes from color blocks and full-bleed edges, not depth.
- Do not create a filled CTA button. The system has no ACTION_BACKGROUND evidence — interactions are text links and border-bordered text, not filled buttons.
- Do not wrap project photography in cards with borders, backgrounds, or padding. The image IS the container.
- Do not use gradients. The system is entirely flat color — no detected gradient usage anywhere.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Raw Linen Canvas | `#ebe9e3` | Page background, footer surface, the base on which everything else floats |
| 1 | Paper White | `#ffffff` | Input fields, elevated text surfaces, and any contained light area above the linen canvas |
| 2 | Signal Orange | `#ff4f00` | Hero blocks, brand statement panels, full-bleed colored sections — the dominant chromatic surface |
| 3 | Photographic Full-Bleed | `#000000` | Project showcase panels where editorial photography replaces the colored block; black represents the void/photographic surface |

## Elevation

The system is intentionally shadowless. Surface separation is achieved through committed color blocks (orange, linen, white, black) and full-bleed edges — not through drop shadows or blur. This flat treatment keeps the layout feeling like editorial print: sections abut each other at hard edges, like a magazine spread turned digital.

## Imagery

Imagery is full-bleed editorial photography used at maximum scale — no thumbnails, no grids of small images, no constrained aspect ratios. The Yoni project panel shows the pattern: a single subject (model, product, or scene) fills the entire viewport, warm-toned and naturally lit, with display type floating directly on the image. Photography is high-key with warm color grading (peach, terracotta, golden skin tones) that harmonizes with the Signal Orange brand color. No illustrations, no icons beyond the hamburger glyph, no product screenshots. The visual density is image-dominant on project pages and text-only on the brand statement hero.

## Layout

The layout is full-bleed and section-stacked — no max-width container, no centered content rail. The page is a vertical sequence of full-viewport sections: linen canvas with orange hero block, then full-bleed photographic project panels, then linen footer. Each section occupies the entire screen width edge-to-edge with no side margins. Navigation is reduced to a wordmark and hamburger in the top corners. There is no sidebar, no grid system visible, and no card-based content arrangement — the layout is a scrollable sequence of full-screen moments, each one either a color block or a photograph with overlaid type.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink Black)
- background: #ebe9e3 (Raw Linen)
- border: #767676 (Faint Stone) for inputs, #000000 for hairlines
- accent: #ff4f00 (Signal Orange)
- inverse text: #ffffff (Paper White)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Signal Orange Hero Block**: Full-bleed rectangle with #ff4f00 background. Centered headline at 120px, Moderat weight 300, #000000, line-height 1.0, letter-spacing -0.004em. Page canvas is #ebe9e3 with the wordmark 'Studio Thomas' at 16px weight 400, #000000, top-left, and a hamburger icon top-right.

2. **Full-Bleed Project Showcase**: Edge-to-edge photographic background. Project name in #ffffff at 120px, weight 300, line-height 1.0, positioned left-center. Category caption at 16px weight 400, #ffffff, bottom-left. 'View project' text link at 16px weight 400, #ffffff with a white border, bottom-right. No card, no border, no padding around the image.

3. **Wordmark Header**: Sticky top bar on #ebe9e3. Left: brand name in 16px weight 400, #000000. Right: three-line hamburger icon, #000000. No nav links, no buttons.

4. **Linen Footer**: Full-width section with #ebe9e3 background, 100px top padding, 50px bottom padding. Footer text at 16px weight 400, #000000.

5. **Text Input Field**: White (#ffffff) background, 1px border in #767676, text at 16px weight 400 in #000000. No border-radius, no shadow, no fill button beside it — submit is a text link or border-bordered text.

## Color Philosophy

The system is a three-note chord: black, white, and orange. Raw Linen (#ebe9e3) is the canvas that prevents the black-white binary from feeling clinical. Signal Orange (#ff4f00) is deployed as a surface, not an accent — it fills blocks rather than tinting icons or text. This is a design studio that treats color as architecture, not decoration. The rule: if the orange isn't filling a committed area large enough to dominate the screen, it shouldn't be used at all.

## Typographic Voice

Moderat at weight 300 is the anti-loud headline. At 120px it should feel like a whisper amplified by size — geometric, clean, but with the thinness of a pencil line rather than the weight of a marker. The contrast between the thin type and the saturated orange blocks behind it creates the tension that makes the system feel editorial. Body copy at 16px/1.60 in weight 400 is invisible by design — the work and the photography carry the page.

## Similar Brands

- **Pentagram** — Same editorial full-bleed approach with one committed color block (typically black) and oversized geometric sans-serif display type floating without containers
- **Studio Dumbar** — Shared commitment to a single dominant chromatic surface used as a full-bleed panel rather than scattered accents, with minimal UI chrome
- **Bureau Cool** — Identical edgeless layout (0px radius everywhere), weight 300 display type at large scale, and a warm off-white canvas instead of pure white
- **Manual Studio** — Same full-bleed photographic project showcases with oversized white display text overlaid directly on the image, no card containers

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-orange: #ff4f00;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-raw-linen: #ebe9e3;
  --color-faint-stone: #767676;

  /* Typography — Font Families */
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 33px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.004px;
  --text-heading: 40px;
  --leading-heading: 1.13;
  --tracking-heading: -0.004px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -0.004px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-100: 100px;

  /* Layout */
  --section-gap: 100px;
  --card-padding: 40px;
  --element-gap: 20-30px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-raw-linen-canvas: #ebe9e3;
  --surface-paper-white: #ffffff;
  --surface-signal-orange: #ff4f00;
  --surface-photographic-full-bleed: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-orange: #ff4f00;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-raw-linen: #ebe9e3;
  --color-faint-stone: #767676;

  /* Typography */
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 33px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.004px;
  --text-heading: 40px;
  --leading-heading: 1.13;
  --tracking-heading: -0.004px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -0.004px;

  /* Spacing */
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-100: 100px;
}
```
