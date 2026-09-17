# Anna Jóna — Style Reference
> a love letter on blush paper

**Theme:** light

Anna Jóna speaks in a hushed, single-color voice: a blush-pink canvas washed warm and soft, with one vivid coral-red doing all the talking for type, icons, and accents. The page reads like a folded letter — generous whitespace, oversized display headings in a custom condensed serif, and angled full-bleed image cuts that bleed warm interior photography into the pink field. Every interface element is weightless: no shadows, no cards with elevation, no border treatments. Structure comes from typography scale and spatial rhythm alone, with large rounded shapes (90px) and a single pill button (300px) as the only geometric gestures. The mood is intimate, editorial, and slightly melancholic — a closing tribute rendered as quiet visual poetry.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Paper | `#fce1e3` | `--color-blush-paper` | Page canvas, section backgrounds, the warm field all content lives on |
| Coral Crimson | `#db404f` | `--color-coral-crimson` | All headings, body text, icons, and the sole action color — the entire voice of the brand |
| Midnight Ink | `#0e1736` | `--color-midnight-ink` | Deep accent for select surfaces and inverse contexts, a cool counterpoint to the warm field |
| Pure White | `#ffffff` | `--color-pure-white` | Image backgrounds, inline accents, negative space within photographs and cards |
| Soft Black | `#000000` | `--color-soft-black` | Decorative strokes, icon fills, hairline borders — the only place pure black appears |

## Tokens — Typography

### Sansita — Display and heading face — bold, slightly condensed, with -0.02em tracking that tightens at every size. Carries all editorial weight: the page announces itself through this one confident voice. · `--font-sansita`
- **Substitute:** Playfair Display, DM Serif Display
- **Weights:** 700
- **Sizes:** 28px, 39px, 49px, 70px
- **Line height:** 1.06-1.17
- **Letter spacing:** -0.02em (e.g. -0.56px at 28px, -1.4px at 70px)
- **Role:** Display and heading face — bold, slightly condensed, with -0.02em tracking that tightens at every size. Carries all editorial weight: the page announces itself through this one confident voice.

### Nunito Sans — Body and UI face — the 18px body sets a generous reading rhythm at 1.5 line-height; 700 weight for emphasized inline phrases and small caps headers. The 72px outlier is likely a single oversized numeral or pull-quote. · `--font-nunito-sans`
- **Substitute:** Inter, Source Sans 3
- **Weights:** 400, 700
- **Sizes:** 18px, 25px, 72px
- **Line height:** 1.20-1.50
- **Role:** Body and UI face — the 18px body sets a generous reading rhythm at 1.5 line-height; 700 weight for emphasized inline phrases and small caps headers. The 72px outlier is likely a single oversized numeral or pull-quote.

### Clarkson — Secondary prose — the slightly taller 1.7 line-height is for long-form letter passages where breathing room matters more than density · `--font-clarkson`
- **Substitute:** Lora, Source Serif 4
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.50-1.70
- **Role:** Secondary prose — the slightly taller 1.7 line-height is for long-form letter passages where breathing room matters more than density

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 18px | 1.5 | — | `--text-body` |
| body-lg | 25px | 1.5 | — | `--text-body-lg` |
| heading-sm | 28px | 1.17 | -0.56px | `--text-heading-sm` |
| heading | 39px | 1.14 | -0.78px | `--text-heading` |
| heading-lg | 49px | 1.11 | -0.98px | `--text-heading-lg` |
| display | 70px | 1.06 | -1.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 58 | 58px | `--spacing-58` |
| 86 | 86px | `--spacing-86` |
| 95 | 95px | `--spacing-95` |
| 115 | 115px | `--spacing-115` |
| 144 | 144px | `--spacing-144` |
| 173 | 173px | `--spacing-173` |

### Border Radius

| Element | Value |
|---------|-------|
| images | 0px |
| shapes | 90px |
| buttons | 300px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 144px
- **Card padding:** 48px
- **Element gap:** 11px

## Components

### Hero Statement
**Role:** Opening page declaration — the largest text block on the site

Two-column flex layout: oversized Sansita 70px/700 heading in Coral Crimson (#db404f) at left, a smaller Nunito Sans 18px body paragraph in the same color at right. Sits directly on Blush Paper (#fce1e3) canvas with 144px top padding. No card, no border — the type itself is the container. A small 90px-rounded red icon marks the top-left corner as a quiet signature mark.

### Angled Image Bleed
**Role:** Full-bleed photograph that breaks the pink field with a diagonal cut

A warm-toned photograph stretches edge-to-edge across the viewport, then meets the pink canvas along a sloped diagonal line (angled clip-path, roughly 8-12 degrees). No border, no radius, no shadow. The image becomes a landscape the text paragraphs rest against.

### Letter Section
**Role:** Long-form prose block — the emotional heart of the page

Centered or left-aligned text block on Blush Paper (#fce1e3), max-width ~640px. Opens with a Sansita 28px/700 Coral Crimson header, followed by Nunito Sans 18px/400 body at 1.5 line-height, also in Coral Crimson. Generous 48px vertical padding between paragraphs. The entire section is one unbroken column — no dividers, no cards, no background shifts.

### Pill Button
**Role:** Sole interactive element style

300px border-radius (full pill), 8px vertical padding, 40px horizontal padding, Coral Crimson (#db404f) fill, white (#ffffff) Nunito Sans text at 700 weight. Compact and confident — the generous radius makes a small element feel intentional rather than utilitarian.

### Rounded Decorative Shape
**Role:** 90px-radius geometric element used as visual punctuation

Square or rectangular elements clipped to 90px corners — used for the small logo/icon mark and potentially image masks. Always rendered in Coral Crimson (#db404f). The 90px radius is the design's signature curve, softer than typical 8-16px UI rounding but sharper than a pill.

### Side-by-Side Image Pair
**Role:** Two-photo composition for showing complementary views

Two photographs placed in a 1:1 grid (50/50 split), separated only by a thin gap (11px column gap). Both images share the same warm interior lighting treatment. No captions, no borders — the pair reads as a single panoramic statement.

### Inline Link
**Role:** Text-level navigation within body prose

Underlined Nunito Sans 18px text in Coral Crimson (#db404f), same color as surrounding body — distinguished by underline weight rather than color shift. No hover color change visible; the link is already saturated enough.

### Section Anchor Header
**Role:** Small-caps or oversized subhead marking a new prose section

Sansita 28-39px/700 in Coral Crimson, often with an underline to signal 'click for letter' or section anchor. Functions as a typographic wayfinding device in place of navigation chrome.

## Do's and Don'ts

### Do
- Use only Coral Crimson (#db404f) for all text, icons, and interactive elements — never introduce a second chromatic text color
- Set all body text at 18px with 1.5 line-height in Nunito Sans — smaller or denser prose breaks the editorial reading rhythm
- Apply -0.02em letter-spacing to every Sansita heading size, scaling proportionally (e.g. -1.4px at 70px, -0.56px at 28px)
- Break sections with full-bleed photographs using angled diagonal edges (8-12° clip-path), never with horizontal dividers or color bands
- Use 90px border-radius for decorative shapes and 300px for the pill button — these two radii are the only geometry in the system
- Maintain 144px top padding on major sections and 48px between paragraphs to preserve the slow, letter-like vertical cadence
- Place all content directly on Blush Paper (#fce1e3) — no white cards, no elevated panels, no background containers

### Don't
- Do not add box-shadows, drop-shadows, or any z-depth indication — the design is intentionally paper-flat
- Do not introduce additional accent colors — Coral Crimson is the only chromatic voice
- Do not use rectangular image containers, standard card components, or 8-16px UI corner radii — the system operates at two radius extremes only
- Do not set body text below 18px — the type scale starts at body and grows upward
- Do not use horizontal rules, section dividers, or background color bands to separate content — use diagonal image bleeds and whitespace instead
- Do not apply different colors to link states — all text including links stays Coral Crimson, distinguished only by underline
- Do not use sans-serif for headlines — Sansita 700 is the only display voice and defines the editorial character

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Blush Canvas | `#fce1e3` | The page field — every text block and letter section sits directly on this warm pink |
| 1 | Image Bleed | `#ffffff` | Full-bleed photography that breaks the canvas with diagonal angled edges |
| 2 | Midnight Plate | `#0e1736` | Rare dark surface for contrast moments, used sparingly to reset the eye |

## Elevation

No shadows, no elevation, no z-depth. The design is deliberately flat — all visual hierarchy comes from typographic scale, color contrast, and spatial rhythm. Even the 90px rounded shapes and pill buttons exist in the same plane as the canvas, not above it. This is a paper-based metaphor: ink on a page, not glass on a screen.

## Imagery

Photography is the emotional engine. All images are warm-toned, golden-hour interior shots — close crops of food on a pass, a hand holding a wine glass, the curved pink bar and arched doorways of the restaurant. The treatment is intimate and documentary: shallow depth of field, warm tungsten color temperature, no lifestyle staging. Images are always full-bleed with angled (diagonal) edges cutting into the pink field — never contained in cards or rectangles. The pink tones in the restaurant's physical design echo the page's blush canvas, so photography and UI share the same color world.

## Layout

Max-width ~1200px centered for text columns, but images break full-bleed. The page is a vertical sequence of alternating pink-text bands and full-bleed image bands, connected by diagonal cuts rather than horizontal rules. Section rhythm: 144px top padding between major blocks, 48px between paragraphs within a letter. No sidebar, no grid cards, no masonry. Navigation is minimal — likely a single small logo mark top-left and nothing else. Content is asymmetric two-column (heading left, supporting text right) in the hero, then collapses to single-column prose for the letter.

## Agent Prompt Guide

## Quick Color Reference
- text/heading: #db404f (Coral Crimson)
- background: #fce1e3 (Blush Paper)
- border/accent: #000000 (only for decorative strokes)
- image surface: #ffffff
- primary action: #db404f (filled action)
- dark accent: #0e1736

## Example Component Prompts

1. **Hero Statement**: Full-width section on #fce1e3 background, 144px top padding. Two-column flex layout. Left column: Sansita 70px/700 in #db404f, letter-spacing -1.4px, line-height 1.06. Right column: Nunito Sans 18px/400 in #db404f, max-width 480px, line-height 1.5.

2. **Angled Image Bleed**: Full-viewport-width photograph with a diagonal clip-path cutting from lower-left to upper-right (top edge angles up at ~10°). Image sits edge-to-edge with no padding or border. Below the image, content resumes on #fce1e3 background.

3. **Letter Section**: Centered single column, max-width 640px, on #fce1e3. Header: Sansita 28px/700 in #db404f, letter-spacing -0.56px. Body: Nunito Sans 18px/400 in #db404f, line-height 1.5, 48px gap between paragraphs.

4. **Pill Button**: 300px border-radius, #db404f background, Nunito Sans 700 white (#ffffff) text, 8px vertical padding, 40px horizontal padding, no border, no shadow.

5. **Rounded Logo Mark**: Small square element at ~48px size, 90px border-radius, #db404f fill, containing a white icon or letterform. Positioned top-left of the page with generous margin.

## Similar Brands

- **Aesop** — Same warm blush-and-coral palette with generous whitespace and editorial typography — though Aesop adds more product photography structure
- **Glossier** — Shared soft-pink canvas discipline with a single bold accent doing all the typographic work, though Glossier uses sans-serif throughout
- **Maison Margiela** — Same editorial restraint — paper-flat surfaces, oversized condensed display type, and the sense that every word is hand-placed rather than gridded
- **Aman Resorts** — Warm interior photography, slow vertical pacing, and the same feeling of intimate, unhurried luxury rendered through space rather than ornament
- **The Row** — Minimal color palette, custom condensed serif display face, and the editorial-magazine instinct to let type and image breathe without UI chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-paper: #fce1e3;
  --color-coral-crimson: #db404f;
  --color-midnight-ink: #0e1736;
  --color-pure-white: #ffffff;
  --color-soft-black: #000000;

  /* Typography — Font Families */
  --font-sansita: 'Sansita', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nunito-sans: 'Nunito Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clarkson: 'Clarkson', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 25px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.56px;
  --text-heading: 39px;
  --leading-heading: 1.14;
  --tracking-heading: -0.78px;
  --text-heading-lg: 49px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.98px;
  --text-display: 70px;
  --leading-display: 1.06;
  --tracking-display: -1.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-58: 58px;
  --spacing-86: 86px;
  --spacing-95: 95px;
  --spacing-115: 115px;
  --spacing-144: 144px;
  --spacing-173: 173px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 144px;
  --card-padding: 48px;
  --element-gap: 11px;

  /* Border Radius */
  --radius-full: 90px;
  --radius-full-2: 300px;

  /* Named Radii */
  --radius-images: 0px;
  --radius-shapes: 90px;
  --radius-buttons: 300px;

  /* Surfaces */
  --surface-blush-canvas: #fce1e3;
  --surface-image-bleed: #ffffff;
  --surface-midnight-plate: #0e1736;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-paper: #fce1e3;
  --color-coral-crimson: #db404f;
  --color-midnight-ink: #0e1736;
  --color-pure-white: #ffffff;
  --color-soft-black: #000000;

  /* Typography */
  --font-sansita: 'Sansita', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nunito-sans: 'Nunito Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clarkson: 'Clarkson', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 25px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.56px;
  --text-heading: 39px;
  --leading-heading: 1.14;
  --tracking-heading: -0.78px;
  --text-heading-lg: 49px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.98px;
  --text-display: 70px;
  --leading-display: 1.06;
  --tracking-display: -1.4px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-58: 58px;
  --spacing-86: 86px;
  --spacing-95: 95px;
  --spacing-115: 115px;
  --spacing-144: 144px;
  --spacing-173: 173px;

  /* Border Radius */
  --radius-full: 90px;
  --radius-full-2: 300px;
}
```
