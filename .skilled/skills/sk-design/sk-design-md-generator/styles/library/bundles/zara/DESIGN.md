# Zara — Style Reference
> Gallery wall for fashion — pure white space, hairline frames, editorial imagery as the only color.

**Theme:** light

Zara's design system is editorial minimalism pushed to its logical extreme: a flat, monochromatic canvas where the interface deliberately recedes so editorial photography can carry the entire brand experience. The palette is essentially binary — pure black on pure white with a single mid-gray for secondary text — and the only decorative typographic moment is the ZARA wordmark itself, a high-contrast didone-style serif that functions as a logo, not as a heading font. UI typography is unusually compact (11–16px) and uses a single neutral sans-serif, giving every screen the look of a fashion magazine page. Components are borderless or use hairline strokes, with zero shadows, zero gradients, and zero rounded corners — the design language of a gallery wall, not a software product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `#ffffff` | `--color-canvas` | Page backgrounds, form surfaces, image backgrounds — the silent stage on which all content sits |
| Ink | `#000000` | `--color-ink` | Primary text, icons, hairline borders, button outlines, checkbox marks, form labels |
| Stone | `#757575` | `--color-stone` | Secondary/helper text, placeholder text, disabled labels — the only mid-tone that breaks the binary |

## Tokens — Typography

### Helvetica Now Text — All UI text — form labels, dropdowns, buttons, body copy, helper text, links. The deliberately compressed size range (11–16px) gives every screen an editorial-print feel; body copy at 11–13px is anti-convention for digital, making the interface feel like a magazine layout rather than a software product. · `--font-helvetica-now-text`
- **Substitute:** Inter, Helvetica Neue, Arial
- **Weights:** 300, 400
- **Sizes:** 11px, 12px, 13px, 15px, 16px
- **Line height:** 1.00–1.60
- **Letter spacing:** normal
- **Role:** All UI text — form labels, dropdowns, buttons, body copy, helper text, links. The deliberately compressed size range (11–16px) gives every screen an editorial-print feel; body copy at 11–13px is anti-convention for digital, making the interface feel like a magazine layout rather than a software product.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | — | `--text-caption` |
| body-sm | 12px | 1.5 | — | `--text-body-sm` |
| body | 13px | 1.5 | — | `--text-body` |
| body-lg | 15px | 1.5 | — | `--text-body-lg` |
| heading-sm | 16px | 1.5 | — | `--text-heading-sm` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 0px |
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### ZARA Wordmark
**Role:** Brand identity mark

Custom high-contrast didone-style serif (extreme thin-to-thick stroke variation, flat unbracketed serifs). Functions as the sole decorative typographic element in the system. Always rendered in #000000 on white. No tagline, no lockup variations. Substitutes: 'Didot', 'Bodoni Moda'.

### Section Header (Uppercase Label)
**Role:** Form section title

Small uppercase text at 13px weight 400, #000000, tracking 0. No underline, no accent color, no icon. Examples: 'SELECT YOUR LOCATION', 'LOCATION', 'LANGUAGE'. The uppercase treatment is the only typographic emphasis — no bold, no color change.

### Select Dropdown
**Role:** Location/language selector

Full-width field, 0px radius, no background fill, 1px bottom border in #000000. Label above in 11px #757575 uppercase. Value text in 13px #000000. No focus ring, no box-shadow — the bottom border IS the affordance. Custom dropdown arrow implied, not styled.

### Outlined Button
**Role:** Primary form action (CONTINUE)

Rectangular button, 0px radius, 1px solid #000000 border, transparent background, no shadow. Text in 13px weight 400 uppercase, #000000. Padding approximately 12px horizontal × 20px vertical. No hover fill, no color inversion — the outline is the identity. Inverts contextually: the border weight is the only visual weight it carries.

### Checkbox
**Role:** Remember selection / opt-in toggle

Minimal square checkbox, 0px radius, 1px solid #000000 border, transparent fill. When checked, filled with #000000. Label to the right in 13px #000000. No focus ring, no animation, no color accent.

### Helper Text Link
**Role:** Inline contextual link

13px #000000 text with underline. Used for inline references like 'Islas Canarias'. Underline is the only hover state — no color change, no weight change, no animation.

### Editorial Image Block
**Role:** Full-bleed campaign/model photography

Large photographic block occupying roughly 60% of viewport width. No border, no radius, no shadow, no overlay. Natural color and lighting — the image is unprocessed UI element, not decoration. Aspect ratio varies but tends to be landscape (roughly 3:2 or 16:9).

### Form Container
**Role:** Left-aligned form column

Narrow column (roughly 280–320px), left-aligned within page, vertically centered. 112px horizontal padding from page edge. Contains all form elements with 20px vertical gaps between fields. No card background, no border, no shadow — floats on white canvas.

## Do's and Don'ts

### Do
- Use 0px border-radius on every component — buttons, inputs, cards, badges, images. The system is intentionally sharp-cornered.
- Keep the palette to three values: #000000 for text and borders, #ffffff for surfaces, #757575 for secondary text. No additional colors.
- Set body text at 11–13px to maintain the editorial-print scale. Larger sizes break the magazine-layout feel.
- Use the ZARA wordmark (custom didone serif) as the only display/decorative type — never apply it to headings or UI labels.
- Let editorial photography occupy 50–60% of any layout. The image is the content; the form is the frame.
- Use 1px hairline borders in #000000 for all interactive elements. The line weight is the visual language.
- Maintain generous whitespace: 48px between sections, 20px between form elements, 112px outer padding.

### Don't
- Don't introduce any color beyond the three neutrals. No brand accents, no semantic colors, no hover tints.
- Don't use rounded corners on any element. Even 2–4px radius breaks the system.
- Don't apply shadows, gradients, or glow effects. The design is completely flat.
- Don't use bold (700+) weights. The system runs 300–400 only.
- Don't use body text larger than 16px. The compressed scale is a signature choice.
- Don't add icons, badges, tags, or decorative UI elements. The interface is content-only.
- Don't center-align body text or form labels. Everything is left-aligned with uppercase section headers.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — pure white, no texture, no variation |
| 1 | Form Surface | `#ffffff` | Form fields and interactive areas — visually identical to canvas, separated only by hairline borders |

## Elevation

The design system has zero elevation. No shadows, no z-axis differentiation. Hierarchy is created through whitespace, border weight, and typography scale — not through depth. Components exist on a single plane, like printed matter on a page.

## Imagery

Editorial fashion photography is the sole visual content. Full-color, unprocessed, natural-lit campaign and model photography occupies the dominant visual space on every screen. Images are sharp-cornered, uncontained (no device frames, no polaroid effects), and presented at near-original aspect ratios. No illustrations, no icons-as-decoration, no abstract graphics. The photography carries all brand personality — mood, season, aesthetic — while the interface remains completely neutral.

## Layout

Asymmetric two-column split for entry screens: a narrow left column (280–320px) holds all form UI, left-aligned with 112px outer padding; the remaining 60% holds a large editorial photograph. The form column is vertically centered. No header bar, no navigation, no footer on entry flows — the ZARA wordmark sits alone at top-left as the only structural element. Content is max-width 1200px on inner pages with generous 48px section gaps. The layout philosophy: the interface is a magazine spread, not a software dashboard.

## Agent Prompt Guide

**Quick Color Reference:**
- text: #000000
- background: #ffffff
- border: #000000
- secondary text: #757575
- primary action: no distinct CTA color

**Example Component Prompts:**

1. Create a location selector screen: white (#ffffff) background, max-width 1200px, two-column asymmetric layout. Left column 320px wide, 112px outer padding, vertically centered. Right column holds a full-bleed editorial photograph with 0px radius. ZARA wordmark top-left in custom didone serif, #000000. Form label 'SELECT YOUR LOCATION' at 13px uppercase weight 400, #000000. Dropdown fields with 1px bottom border #000000, no background, no radius. Continue button: 1px solid #000000 border, transparent fill, 0px radius, 13px uppercase text #000000, 12px 20px padding.

2. Create a product listing section: white (#ffffff) background, 48px top/bottom padding, 20px gaps between items. Product cards: 0px radius, no border, no shadow. Product names at 13px weight 400 #000000, prices at 13px #757575.

3. Create a navigation bar: white (#ffffff) background, 1px solid #000000 bottom border. Menu items at 13px uppercase weight 400, #000000, left-aligned. ZARA wordmark centered or left-aligned in custom didone serif #000000. No background color, no shadow, 0px radius on all elements.

4. Create a category landing page hero: full-viewport editorial photograph as background, no overlay. ZARA wordmark top-left in #000000 over the image. Category title at display size (custom didone serif or large weight 300 Helvetica) centered or bottom-left, #000000 or #ffffff depending on image luminance. No buttons, no CTAs — the imagery is the entry point.

5. Create a form input field: 0px radius, no background, no border except 1px solid #000000 bottom border only. Label above at 11px uppercase weight 400, #757575. Input value at 13px #000000. No focus ring, no box-shadow on focus — the border remains static.

## Similar Brands

- **COS** — Same monochromatic black-on-white system, same hairline border aesthetic, same editorial photography dominance, same zero-radius flat design
- **Massimo Dutti** — Sibling-brand approach — serif wordmark, compressed UI type scale, pure white canvas, no decorative UI elements, photography-first layout
- **SSENSE** — Extreme minimalism with full-width editorial imagery, monochrome palette, small uppercase UI labels, flat components with no shadows
- **Aesop** — Same hairline-border form fields, same generous whitespace, same binary black/white palette, same editorial-print typography scale

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas: #ffffff;
  --color-ink: #000000;
  --color-stone: #757575;

  /* Typography — Font Families */
  --font-helvetica-now-text: 'Helvetica Now Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body-sm: 12px;
  --leading-body-sm: 1.5;
  --text-body: 13px;
  --leading-body: 1.5;
  --text-body-lg: 15px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 16px;
  --leading-heading-sm: 1.5;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-all: 0px;
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-form-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas: #ffffff;
  --color-ink: #000000;
  --color-stone: #757575;

  /* Typography */
  --font-helvetica-now-text: 'Helvetica Now Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body-sm: 12px;
  --leading-body-sm: 1.5;
  --text-body: 13px;
  --leading-body: 1.5;
  --text-body-lg: 15px;
  --leading-body-lg: 1.5;
  --text-heading-sm: 16px;
  --leading-heading-sm: 1.5;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-112: 112px;
}
```
