# reboot — Style Reference
> quiet atelier on cream paper — a design studio's homepage that reads like a printed monograph, where the only color is the one blue mark in the margin

**Theme:** light

Reboot reads like a carefully typeset editorial page: a vast warm-white canvas, a single typographic voice (Inter at 14/16/40), and almost no visual furniture. Text hierarchy comes from grayscale gradation and weight shifts between 400 and 500 rather than dramatic size jumps — the page communicates through luminance contrast, not typography volume. The only chromatic punctuation is a small blue gradient diamond used inline as a period between sentences. One black pill button anchors the interface; everything else is whitespace and well-set prose. The aesthetic is a design studio's own homepage: confident enough to let words do the work, restrained enough to make the one accent color feel like a shout.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper Gray | `#e5e7eb` | `--color-paper-gray` | Page canvas and hairline borders — the warm off-white ground that all type sits on |
| Editorial Black | `#000000` | `--color-editorial-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Charcoal Ink | `#232323` | `--color-charcoal-ink` | Headings and emphasized prose — a near-black that softens headlines against the pure black of running text |
| Soft Graphite | `#a7a7a7` | `--color-soft-graphite` | Muted body text and secondary metadata — the gray that carries secondary sentences without competing with the lead |
| Faded Pencil | `#c8c8c8` | `--color-faded-pencil` | Tertiary annotations and the most restrained helper text — the lightest voice in the grayscale scale |
| Pure White | `#ffffff` | `--color-pure-white` | Surface highlights and inverse text on the black pill button |
| Sapphire Beam | `linear-gradient(#00c8fb, #1a2ff7)` | `--color-sapphire-beam` | Decorative inline gradient — cyan-to-indigo mark used as a full-stop between sentences, never as a fill or background |
| Ember Sunset | `linear-gradient(to right bottom, #a4341, #ef3313, #f4a41b)` | `--color-ember-sunset` | Secondary decorative gradient — warm triple-stop used sparingly for moments that need a chromatic counterpoint to the blue |

## Tokens — Typography

### Inter — The sole typographic voice — used for everything from nav metadata to display headlines. Weight 400 carries running prose, weight 500 lifts section lead-ins and the primary action, weight 600 is reserved for the wordmark. The narrow three-size scale (14/16/40) is deliberate: hierarchy comes from luminance and weight, not from a cascading type ramp. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 40px
- **Line height:** 1.43 (14px), 1.50–1.80 (16px), 1.50 (40px)
- **Role:** The sole typographic voice — used for everything from nav metadata to display headlines. Weight 400 carries running prose, weight 500 lifts section lead-ins and the primary action, weight 600 is reserved for the wordmark. The narrow three-size scale (14/16/40) is deliberate: hierarchy comes from luminance and weight, not from a cascading type ramp.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body-relaxed | 16px | 1.8 | — | `--text-body-relaxed` |
| heading | 40px | 1.5 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.0...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 720px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 10px

## Components

### Primary Pill Button
**Role:** The single action surface — used for 'See work' and any definitive call to action

Fill #000000, text #ffffff, Inter 14px weight 500, horizontal padding 16px, vertical padding 10px, border-radius 9999px. No border, no shadow. Sits flush against the paper background. The only fully-dark element in the system.

### Status Badge
**Role:** Inline metadata pill — used for 'Hiring' indicators in the header

Pill-shaped (#9999px radius) with light surface fill, Inter 14px weight 500, padding 4px 10px. Sits inline with adjacent text. No border.

### Wordmark Lockup
**Role:** Brand identity in the header

Small geometric icon mark (rounded square, ~20px) adjacent to the wordmark 'reboot' in Inter weight 600. Left-aligned in the header bar.

### Inline Gradient Marker
**Role:** Chromatic punctuation between sentences — the only color in the body content

24×24px rounded square (8px radius) filled with the Sapphire Beam gradient (#00c8fb → #1a2ff7). Inserted inline between sentences as a visual period. Never used as a background or button fill.

### Text Link
**Role:** Inline navigation — 'Book a call' and similar

Inter 16px weight 400 in Soft Graphite (#a7a7a7), no underline by default. On hover, shifts to Editorial Black (#000000). Behaves like a quiet footnote, not a button.

### Prose Section Block
**Role:** The fundamental content unit — a paragraph with mixed-emphasis sentences

Left-aligned text block, max-width ~480px. Opens with a weight-500 sentence in Charcoal Ink (#232323), continues with weight-400 sentences in Editorial Black (#000000), and trails with weight-400 sentences in Soft Graphite (#a7a7a7). No background, no border, no padding — the text sits directly on the paper canvas.

### Muted Manifesto Block
**Role:** Secondary statements that should recede — lists of disciplines, timeframes, closing lines

Inter 16px weight 400 in Soft Graphite (#a7a7a7), line-height 1.80. Appears after a primary prose block to add context without competing for attention.

### Device Mockup Illustration
**Role:** Sole illustrative element — a phone frame used as inline punctuation

Minimal phone outline illustration, ~32px tall, stroke-only in Soft Graphite (#a7a7a7). Appears inline between sentences, mirroring the role of the gradient marker but for a different beat in the copy.

### Minimal Header Bar
**Role:** Top-of-page navigation and brand placement

Full-width, ~64px tall, transparent over the page canvas. Wordmark left, nav metadata right (Status Badge + text link). No background fill, no border-bottom, no shadow.

## Do's and Don'ts

### Do
- Use Inter at weights 400 and 500 for all body and heading text; reserve 600 for the wordmark only
- Use the three-step grayscale scale (#000000 → #232323 → #a7a7a7) to create text hierarchy within a single block instead of jumping to a larger size
- Use the black pill button (fill #000000, radius 9999px, text #ffffff, Inter 14px/500) for the single primary action per page
- Use the Sapphire Beam gradient (#00c8fb → #1a2ff7) only on 20–24px inline marker icons, never as a background or button fill
- Left-align all content in a single narrow column (max ~480px) inside an 720px page container
- Set section gap to 80px and use 32px internal padding for any surface that needs containment
- Set cards and non-button containers to 16px border-radius; set all buttons and badges to 9999px

### Don't
- Don't introduce chromatic colors beyond the two existing gradients — the palette is achromatic plus two accent gradients
- Don't use more than three type sizes; the scale is intentionally 14 / 16 / 40
- Don't use color to signal emphasis — use weight shifts (400 → 500) and grayscale steps instead
- Don't add backgrounds, borders, or cards to text blocks — text should sit directly on the page canvas
- Don't apply drop shadows to text, buttons, or content blocks; the design is flat by principle
- Don't center text or use multi-column layouts; everything is a single left-aligned column
- Don't scale the blue gradient to fill large areas or use it on the primary button — it is decorative punctuation, not a brand fill

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#e5e7eb` | The warm off-white ground; all type and elements float on this single surface |
| 1 | Pure Surface | `#ffffff` | Reserved for inverse text on the black button and any minimal card moments |

## Elevation

The design is almost entirely flat. The single shadow token in the system (a five-layer 6%-opacity black stack) is so faint it reads as paper grain rather than elevation. Buttons sit flush. Text blocks have no containers. Depth is communicated through grayscale tone shifts, not z-axis separation — the page behaves like a printed page, not a screen of stacked surfaces.

## Imagery

The site is almost entirely typographic. The only visual elements beyond type are two small inline icons: a 24px blue-gradient rounded square used as a sentence-period, and a minimal stroke-only phone outline used at a similar size. No photography, no product screenshots, no large illustrations, no abstract graphics. The visual density is the lowest possible: text and whitespace share the page roughly 40/60, and the two gradient marks are the entire chromatic vocabulary.

## Layout

Single-column, left-aligned, max-width ~720px page container with text blocks capped around 480px. No grid, no multi-column rows, no card stacks, no sidebar. The header is a thin transparent bar with the wordmark left and two pieces of metadata right. The body flows as a continuous vertical essay: each section is a left-aligned prose block, separated by ~80px of whitespace. The first screen leads with a large 40px headline sentence, followed by a softer secondary sentence with an inline gradient marker between them, establishing the pattern that repeats down the page. The single primary action (black pill button) sits at the natural end of the scroll, accompanied by a quiet text link.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #000000
- text (secondary): #232323
- text (muted): #a7a7a7
- background: #e5e7eb
- surface: #ffffff
- border (hairline): #e5e7eb
- accent: linear-gradient(#00c8fb, #1a2ff7) — decorative inline icons only
- primary action: no distinct CTA color

## Example Component Prompts
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Prose section block**: Inter 16px weight 400, color #000000, line-height 1.60, max-width 480px, left-aligned. Open with one sentence in #232323 weight 500, close with one sentence in #a7a7a7 weight 400. No background, no border, no padding.

3. **Headline**: Inter 40px weight 500, color #000000, line-height 1.50, left-aligned, max-width 560px. One sentence per headline.

4. **Inline gradient marker**: 24×24px rounded square (8px radius) filled with linear-gradient(#00c8fb, #1a2ff7). Sits inline between two text sentences, aligned to the x-height, used once per section as chromatic punctuation.

5. **Status badge** (e.g. 'Hiring'): Pill shape (9999px radius), light surface fill, Inter 14px weight 500, padding 4px 10px. Placed in the header next to a text label.

6. **Minimal header**: Full-width 64px-tall transparent bar. Wordmark (icon + 'reboot' in Inter 600) on the left; one status badge + one text link on the right. No background, no border-bottom.

## Similar Brands

- **Rauno Freiberg** — Same text-first, near-zero-chrome approach — the page is a narrow left-aligned column of well-set type on a single off-white ground
- **Linear** — Same monochrome palette with pill-shaped controls and a single accent color used sparingly rather than decoratively
- **Stripe** — Same confidence in grayscale hierarchy and generous whitespace, though Stripe allows itself more type sizes and chromatic moments
- **Apple product pages** — Same editorial restraint — one typeface, one accent, generous vertical breathing room between text blocks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-gray: #e5e7eb;
  --color-editorial-black: #000000;
  --color-charcoal-ink: #232323;
  --color-soft-graphite: #a7a7a7;
  --color-faded-pencil: #c8c8c8;
  --color-pure-white: #ffffff;
  --color-sapphire-beam: #00c8fb;
  --gradient-sapphire-beam: linear-gradient(#00c8fb, #1a2ff7);
  --color-ember-sunset: #ef3313;
  --gradient-ember-sunset: linear-gradient(to right bottom, #a4341, #ef3313, #f4a41b);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-relaxed: 16px;
  --leading-body-relaxed: 1.8;
  --text-heading: 40px;
  --leading-heading: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 720px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px;

  /* Surfaces */
  --surface-page-canvas: #e5e7eb;
  --surface-pure-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-gray: #e5e7eb;
  --color-editorial-black: #000000;
  --color-charcoal-ink: #232323;
  --color-soft-graphite: #a7a7a7;
  --color-faded-pencil: #c8c8c8;
  --color-pure-white: #ffffff;
  --color-sapphire-beam: #00c8fb;
  --color-ember-sunset: #ef3313;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-relaxed: 16px;
  --leading-body-relaxed: 1.8;
  --text-heading: 40px;
  --leading-heading: 1.5;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px;
}
```
