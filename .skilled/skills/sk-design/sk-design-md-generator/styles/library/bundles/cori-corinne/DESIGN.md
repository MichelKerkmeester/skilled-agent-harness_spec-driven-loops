# Cori Corinne — Style Reference
> editorial gallery on warm paper

**Theme:** light

Cori Corinne is a personal portfolio site that reads like an editorial print spread — a warm cream canvas, a single massive serif name as the cover line, and quiet sans-serif navigation that almost disappears. The entire system is restrained to one ink color and one paper color, letting photography and typography do all the expressive work. Every element earns its place: the wordmark is the hero, the page sections function as gallery plates, and the only UI chrome is a hairline-thin top bar. Components are essentially absent — this is a typography-and-photography system, not a component library. The visual identity comes from the tension between the whisper-light cream background (#f6f5f0) and the dense, high-contrast serif display, which creates a fashion-editorial or art-catalog feeling rather than a typical portfolio grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper Cream | `#f6f5f0` | `--color-paper-cream` | Page background — warm off-white canvas, the surface everything floats on |
| Bone White | `#ffffff` | `--color-bone-white` | Alternate surface for image plates and card containers layered on the cream canvas |
| Ink Charcoal | `#292a2c` | `--color-ink-charcoal` | Primary text, heading fills, and structural borders — near-black with a faint warm cast that sits softer on cream than pure black |
| Pure Ink | `#000000` | `--color-pure-ink` | Navigation text, link colors, and heading strokes — reserved for the most weighty typographic moments |

## Tokens — Typography

### Editorial Serif (display — likely Bodoni/Didone family or custom) — Hero nameplate only — the massive 'Cori Corinne' cover line. High-contrast strokes (hairline serifs, thick verticals) create a fashion-magazine authority. Not used anywhere else on the site; this is a one-shot signature moment. · `--font-editorial-serif-display-likely-bodonididone-family-or-custom`
- **Substitute:** Bodoni Moda, Playfair Display, or DM Serif Display
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.0
- **Role:** Hero nameplate only — the massive 'Cori Corinne' cover line. High-contrast strokes (hairline serifs, thick verticals) create a fashion-magazine authority. Not used anywhere else on the site; this is a one-shot signature moment.

### Neue Haas Grotesk Text — Navigation and body text — the workhorse sans. Tight line-height (1.0) at large sizes for nav, generous (2.33) for body. Its restraint and neutrality are the point: the serif gets all the drama. · `--font-neue-haas-grotesk-text`
- **Substitute:** Inter, Helvetica Neue, or system-ui
- **Weights:** 400
- **Sizes:** 18px, 30px
- **Line height:** 1.0 to 2.33
- **Role:** Navigation and body text — the workhorse sans. Tight line-height (1.0) at large sizes for nav, generous (2.33) for body. Its restraint and neutrality are the point: the serif gets all the drama.

### Open Sans — Secondary body and link text — slightly warmer geometry than Neue Haas, used as a fallback or accent voice for long-form reading sections. · `--font-open-sans`
- **Substitute:** Source Sans 3 or Noto Sans
- **Weights:** 400
- **Sizes:** 18px, 30px
- **Line height:** 1.67 to 2.33
- **Role:** Secondary body and link text — slightly warmer geometry than Neue Haas, used as a fallback or accent voice for long-form reading sections.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 18px | 30 | — | `--text-body` |
| display | 180px | 180 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 0px
- **Element gap:** 30px

## Components

### Top Navigation Bar
**Role:** Minimal horizontal nav — monogram left, menu items right

No background fill, no border-bottom. Monogram 'C+C' in #000000 at left, menu items (About, Work, Teaching, Artifacts, Contact) in #000000 at right, all in 18px Neue Haas Grotesk Text weight 400. 30px horizontal padding on both sides. Vertically centered, no shadow, no fill — the cream paper shows through.

### Display Nameplate
**Role:** Hero typographic element — the site's signature

Single line of editorial serif text ('Cori Corinne') at ~180px, weight 400, line-height 1.0, color #000000. Spans nearly full viewport width. No underline, no decoration. The letterforms themselves do the work — high contrast, elegant terminals.

### Photography Plate
**Role:** Full-bleed or grid-aligned image container

Edge-to-edge or column-width images with 0px border-radius. No border, no shadow, no frame. Photographs sit directly on the cream canvas, sometimes with white (#ffffff) plate behind them. Images carry the content — no overlays or captions layered on top.

### Body Text Block
**Role:** Long-form content reading area

18px Open Sans weight 400, line-height 2.33 (generous, editorial). Color #292a2c. No max-width constraint apparent — reads as a full-width column or naturally constrained by image grid alignment.

### Monogram Logo
**Role:** Brand mark — top-left anchor

'C+C' in 18px Neue Haas Grotesk Text weight 400, #000000. Minimal, almost invisible — functions as a return-to-home cue rather than a decorative logo.

## Do's and Don'ts

### Do
- Let the cream (#f6f5f0) canvas dominate — never add a full-bleed colored background section
- Use the editorial serif at 120-180px only for the nameplate or equivalent hero moment; never as body text
- Set body text at 18px with 2.33 line-height for the editorial reading rhythm
- Keep all border-radius at 0px — this system is sharp-edged and print-like
- Use 30px horizontal padding on the nav bar to create edge-to-edge breathing
- Let photography fill its container edge-to-edge with no rounded corners or frames
- Use #292a2c for body text and #000000 for nav/links/display — the slight tonal shift adds subtle hierarchy

### Don't
- Don't introduce any color outside the cream/white/charcoal/black palette — the 1% colorfulness is the brand
- Don't use shadows, gradients, or elevation — the system is flat and paper-like
- Don't round corners on images, buttons, or cards — sharp edges are mandatory
- Don't use the editorial serif for body copy or navigation — it is display-only
- Don't add borders, dividers, or rules between sections — let whitespace separate content
- Don't center body text in long blocks — left-align for editorial readability
- Don't use the monogram 'C+C' at large sizes or with decoration — it stays small and quiet

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper Canvas | `#f6f5f0` | Base page background — warm cream, the dominant surface |
| 2 | Plate White | `#ffffff` | Image plate backgrounds and card containers that sit on the cream |

## Imagery

Natural-light documentary photography — candid portraits with shallow depth of field, warm color temperature, grain or film texture visible. Images function as gallery plates: full-bleed or column-width, no rounded corners, no frames, no overlays. Photography is the primary visual content; the UI is almost invisible around it. Subjects are human, close-cropped, and editorial in tone — fashion-magazine sensibility rather than corporate headshots.

## Layout

Full-bleed single-column layout with no visible max-width constraint. The top navigation is a thin horizontal bar with monogram left and menu right, sitting directly on the cream canvas. The hero is a single massive display line that spans nearly the full viewport width, followed by full-bleed or two-column photography sections. Content alternates between edge-to-edge image plates and left-aligned text blocks. Vertical rhythm is extremely spacious — 80-120px between sections. No sidebar, no card grid, no multi-column content layout visible. The structure is essentially: nav → display type → image → image → text → image, with generous whitespace as the only divider.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #f6f5f0 (Paper Cream)
- Surface: #ffffff (Bone White)
- Text/Heading: #292a2c (Ink Charcoal)
- Nav/Link/Display: #000000 (Pure Ink)
- Border: #292a2c at 1px
- Accent: none (monochrome only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a top navigation bar: cream background (#f6f5f0), no border, no shadow. Left-aligned monogram 'C+C' in 18px Neue Haas Grotesk weight 400, #000000. Right-aligned menu items (About, Work, Teaching, Artifacts, Contact) in the same font and color. 30px padding left and right. Vertically centered.

2. Create a display nameplate: a single line of 'Cori Corinne' in an editorial serif (Bodoni Moda), weight 400, ~180px size, line-height 1.0, color #000000. Spans nearly full viewport width. Sits on the cream (#f6f5f0) canvas with 60-80px top padding.

3. Create a photography plate: full-bleed image at viewport width, 0px border-radius, no border, no shadow. Image sits directly on the cream canvas with 80-100px vertical breathing room above and below. No captions, no overlays.

4. Create a body text block: 18px Open Sans weight 400, line-height 2.33, color #292a2c. Left-aligned. No max-width constraint — flows naturally or is constrained by adjacent image columns. 80px vertical gap to next section.

5. Create a two-column image grid: two photographs side by side, each at 50% viewport width, 0px border-radius, 0px gap between them. No gutter, no border, no frame. Sits on cream (#f6f5f0) canvas.

## Similar Brands

- **Werkplaats Typografie** — Same editorial portfolio-on-cream aesthetic with massive display serif type and minimal sans-serif navigation
- **Aesop (corinccorporate.com style sites)** — Same paper-warm background, monochromatic restraint, and serif/sans typographic contrast
- **Kinfolk Magazine web** — Same editorial-print sensibility — warm neutral canvas, full-bleed documentary photography, near-zero UI chrome
- **Portfolio sites by designers like Frank Chimero or Tim Van Damme** — Same single-name display nameplate as hero, cream or off-white background, photography-forward, minimal nav

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-cream: #f6f5f0;
  --color-bone-white: #ffffff;
  --color-ink-charcoal: #292a2c;
  --color-pure-ink: #000000;

  /* Typography — Font Families */
  --font-editorial-serif-display-likely-bodonididone-family-or-custom: 'Editorial Serif (display — likely Bodoni/Didone family or custom)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 30;
  --text-display: 180px;
  --leading-display: 180;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 0px;
  --element-gap: 30px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-canvas: #f6f5f0;
  --surface-plate-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-cream: #f6f5f0;
  --color-bone-white: #ffffff;
  --color-ink-charcoal: #292a2c;
  --color-pure-ink: #000000;

  /* Typography */
  --font-editorial-serif-display-likely-bodonididone-family-or-custom: 'Editorial Serif (display — likely Bodoni/Didone family or custom)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 30;
  --text-display: 180px;
  --leading-display: 180;

  /* Spacing */
  --spacing-30: 30px;
}
```
