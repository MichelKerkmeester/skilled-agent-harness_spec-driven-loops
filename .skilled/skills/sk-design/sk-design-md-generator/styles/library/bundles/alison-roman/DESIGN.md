# Alison Roman — Style Reference
> cookbook pages on warm cream paper — a printed spread from an artisan food memoir, translated to screen with zero loss of tactility

**Theme:** light

Alison Roman's site is a warm, editorial cookbook author's atelier — cream-paper canvas, elegant serif typography, and a single near-black warm-brown that carries every text and action. The palette is almost entirely tonal: three creams layered from canvas to card, a whisper-pale yellow for link underlines, and a burgundy flash reserved for book-cover backgrounds. Layout is generous, magazine-paced, and asymmetric — book covers on the left, descriptive copy on the right, with the dark-brown filled 'Order' button as the sole structural punctuation. No shadows, no gradients, no decorative borders; hierarchy is built through type scale, generous whitespace, and the contrast between warm cream and warm black. The design reads like a printed cookbook spread translated faithfully to the web: confident, restrained, and food-warm without ever resorting to food clichés.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine Ink | `#290a08` | `--color-aubergine-ink` | Primary text, headings, filled action buttons, footer text — the warm near-black that anchors every screen; it is the only chromatic dark in the system and the only acceptable fill for primary actions |
| Vintage Burgundy | `#810c00` | `--color-vintage-burgundy` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Buttery Highlight | `#fff3cc` | `--color-buttery-highlight` | Link text and selected heading accent — a pale custard yellow used sparingly to mark hyperlinks and tiny editorial highlights, sitting at AAA contrast on the ink |
| Parchment Canvas | `#f6f0e1` | `--color-parchment-canvas` | Page background — the dominant warm cream that defines the entire site mood; every screen sits on this surface |
| Linen Card | `#fffaec` | `--color-linen-card` | Card surfaces, list-item backgrounds, subtle elevated zones — a step lighter than the canvas, the only card treatment in the system |
| Hairline Mist | `#e5e7eb` | `--color-hairline-mist` | All borders and dividers throughout the system; used on cards, body blocks, links, and structural dividers — the single hairline color of the site |
| Paper White | `#ffffff` | `--color-paper-white` | Button borders, reverse text on dark fills, and the lightest possible surface lift; the only true white in the palette |

## Tokens — Typography

### Jannon Neo — Display and heading serif — carries every headline, section title, and large editorial moment from 20px through a dramatic 120px. The custom transitional serif with weight 300 for the largest sizes is the signature choice: the 'Books by Alison Roman' hero and book titles sit at whisper-light weight, giving the page a printed-book authority rather than a SaaS-bold shout. Substitute with Cormorant Garamond or EB Garamond at light weights. · `--font-jannon-neo`
- **Substitute:** Cormorant Garamond, EB Garamond
- **Weights:** 300, 400
- **Sizes:** 20px, 32px, 48px, 80px, 120px
- **Line height:** 1.00, 1.10, 1.30
- **Letter spacing:** -0.03em at 48px+ displays, -0.02em at 20-32px, 0 at 20px body
- **Role:** Display and heading serif — carries every headline, section title, and large editorial moment from 20px through a dramatic 120px. The custom transitional serif with weight 300 for the largest sizes is the signature choice: the 'Books by Alison Roman' hero and book titles sit at whisper-light weight, giving the page a printed-book authority rather than a SaaS-bold shout. Substitute with Cormorant Garamond or EB Garamond at light weights.

### Modale Antique — Body, button, card, and UI serif — a slightly more grounded old-style serif for all running text, button labels, card descriptions, and footer lines. The workhorse that lets Jannon Neo's headlines breathe. Substitute with Lora or Source Serif Pro. · `--font-modale-antique`
- **Substitute:** Lora, Source Serif Pro
- **Weights:** 400, 500
- **Sizes:** 18px, 26px, 29px
- **Line height:** 1.00, 1.20, 1.50
- **Letter spacing:** -0.01em
- **Role:** Body, button, card, and UI serif — a slightly more grounded old-style serif for all running text, button labels, card descriptions, and footer lines. The workhorse that lets Jannon Neo's headlines breathe. Substitute with Lora or Source Serif Pro.

### -apple-system — System fallback for legacy card content blocks; only present at 29px with normal tracking — used as a safety net rather than a deliberate voice · `--font-apple-system`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 29px
- **Line height:** 1.50
- **Role:** System fallback for legacy card content blocks; only present at 29px with normal tracking — used as a safety net rather than a deliberate voice

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 18px | 1.5 | -0.18px | `--text-body-sm` |
| body | 20px | 1.5 | — | `--text-body` |
| subheading | 26px | 1.2 | -0.26px | `--text-subheading` |
| subheading-lg | 29px | 1.5 | — | `--text-subheading-lg` |
| heading-sm | 32px | 1.1 | -0.64px | `--text-heading-sm` |
| heading | 48px | 1.1 | -1.44px | `--text-heading` |
| heading-lg | 80px | 1 | -2.4px | `--text-heading-lg` |
| display | 120px | 1 | -3.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-96px
- **Card padding:** 24-48px
- **Element gap:** 24px

## Components

### Filled Order Button
**Role:** Primary action for purchasing a book

Dark Aubergine Ink (#290a08) background, Paper White (#ffffff) text in Modale Antique 18px weight 400, no border-radius (0px), 8px vertical padding and 16px horizontal padding, 8px row-gap before/after an inline arrow glyph. Letter-spacing -0.01em. The only filled button variant in the system — every other action defers to it.

### Editorial Book Section
**Role:** Showcase a single book with cover and description

Two-column row on Parchment Canvas. Left column: book cover image at native ratio, no border, no radius, no shadow. Right column: title in Jannon Neo 32-48px weight 300, description in Modale Antique 18-20px weight 400 in Aubergine Ink, optional inline links, then the Filled Order Button. 48-80px row-gap between sections.

### Hero Headline Block
**Role:** Page-level title like 'Books by Alison Roman'

Centered Jannon Neo 80-120px weight 300, Aubergine Ink, letter-spacing -0.03em, line-height 1.0. Sits on Parchment Canvas with 96-113px vertical padding above and below. No subhead, no CTA, no decoration — the type IS the hero.

### Inline Editorial Link
**Role:** Hyperlink within body copy (e.g. 'here')

Body text in Modale Antique 18-20px weight 400, Aubergine Ink, with the link word highlighted in Buttery Highlight (#fff3cc) rather than the standard blue. The highlight is a color swatch, not an underline. Always inline, never standalone.

### Description Card / Book Plate
**Role:** The cream rectangle behind a book cover in the visual stack

Linen (#fffaec) background, no border, 0px radius, 48px padding all around the inner image. The card is a tonal step up from the canvas, giving the book cover a subtle 'mounted print' feel without a border or shadow.

### Footer / Nav Bar
**Role:** Top navigation and bottom footer

Minimal text-only links in Modale Antique 18px weight 500, Aubergine Ink, on Parchment Canvas. 24px padding top and bottom. No background fill, no border-top — separated from content by whitespace alone.

### Book Cover Image
**Role:** Primary product visual

Square or 4:5 ratio, full-bleed within its column, 0px radius, 1px Hairline Mist (#e5e7eb) optional border. No drop shadow, no hover effect. The cover IS the visual; it is not framed or decorated.

### Section Divider Spacer
**Role:** Vertical separation between book sections

Pure whitespace — 80-96px of Parchment Canvas between sections. No horizontal rule, no color band, no icon. The cream itself does the dividing work.

## Do's and Don'ts

### Do
- Set every page background to Parchment Canvas (#f6f0e1); do not introduce a true white page.
- Use Jannon Neo weight 300 for any text 48px or larger; the whisper-light serif is the headline voice.
- Reserve the Filled Order Button as the only chromatic action — fill #290a08, text #ffffff, 0px radius, 8px 16px padding.
- Space sections 80-96px apart with whitespace alone; never use a horizontal rule or background band to separate sections.
- Apply -0.03em letter-spacing to any display-size Jannon Neo text; the tight tracking is what makes the serif feel printed rather than digital.
- Mark every inline link with Buttery Highlight (#fff3cc) text color — do not use blue, do not use underline.
- Use Linen (#fffaec) for any card or list surface that needs to lift off the canvas; 0px radius, no border, no shadow.

### Don't
- Do not introduce drop shadows, glows, or blurred elevations anywhere — the system is intentionally flat.
- Do not use a border-radius on any element; the 0px geometry is the design's signature.
- Do not use blue for links, buttons, or accents — Buttery Highlight is the only accent color for hyperlinks.
- Do not use Vintage Burgundy (#810c00) for UI chrome, text, or buttons; it is reserved for book-cover backgrounds only.
- Do not use system sans-serifs (Inter, Helvetica) for headlines — the Jannon Neo serif is the identity.
- Do not fill more than 15% of any page with a non-cream, non-ink color; the system is overwhelmingly two-tone.
- Do not stack sections on alternating background colors; the cream canvas is continuous from top to bottom.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#f6f0e1` | Default page background — every screen starts here |
| 2 | Linen Card | `#fffaec` | Card and list-item surfaces, elevated slightly above the canvas |
| 3 | Paper White | `#ffffff` | Highest surface lift, used for book-cover image wells and reverse-text buttons |
| 4 | Aubergine Ink | `#290a08` | Darkest surface — the filled button and any dark inversion blocks |

## Elevation

The design is intentionally shadowless. Elevation is communicated entirely through cream-to-white surface steps (#f6f0e1 → #fffaec → #ffffff) and through 1px hairline borders in #e5e7eb. No drop shadows, no glows, no blurred halos — the page reads as a flat printed spread, not a software UI. This is a deliberate anti-SaaS choice: shadows would make the editorial typography feel like a product dashboard.

## Imagery

Imagery is book-cover photography and food photography only — no abstract graphics, no illustrations, no icons. Book covers are presented as raw product crops at full editorial scale on the left side of each book section, sitting on the parchment canvas with no frame or radius. Food photography inside the book covers is warm, natural-lit, and ingredient-forward (a bowl of tomatoes, a hand holding a dessert glass with berries). Images are always square or 4:5, always left-aligned, always paired with a right-column of text. No overlap, no masking, no decorative treatment — the photo is the artifact, not a styled element.

## Layout

Max-width 1200px, centered, fully contained — no full-bleed sections. The page reads as a single editorial column of stacked book sections. The hero is a centered serif headline ('Books by Alison Roman') with enormous breathing room above and below (96px+ top/bottom padding). Each book section is a two-column split: book cover image on the left at native ratio, title + description + 'Order' button on the right, with the title left-aligned in Jannon Neo. Sections are separated by 80-96px of vertical whitespace, never by dividers or color bands. Navigation is minimal — a simple top bar with text links. The rhythm is print-magazine, not dashboard: large headings, short body paragraphs, single action per section, generous margins on both sides.

## Agent Prompt Guide

**Quick Color Reference**
- background: #f6f0e1 (Parchment Canvas)
- card/surface: #fffaec (Linen)
- text: #290a08 (Aubergine Ink)
- border: #e5e7eb (Hairline Mist)
- link accent: #fff3cc (Buttery Highlight)
- primary action: #290a08 (filled action)

**3 Example Component Prompts**

1. Build a centered hero headline on a #f6f0e1 canvas. Set the text in Jannon Neo (substitute: Cormorant Garamond) at 96px, weight 300, color #290a08, letter-spacing -0.03em, line-height 1.0. Add 113px of padding above and below. No subtitle, no button, no decoration.

2. Build a two-column book section. Left column: a square book cover image with 0px radius and a 1px #e5e7eb border, sitting inside a #fffaec card with 48px padding. Right column: a Jannon Neo 40px weight 300 title in #290a08 with -0.02em tracking, followed by a Modale Antique 20px weight 400 description in #290a08, then a filled button. The button is #290a08 background, #ffffff text in Modale Antique 18px weight 400, 0px radius, 8px vertical and 16px horizontal padding, with a 12px gap before an inline arrow glyph.

3. Build an inline editorial link. Body text is Modale Antique 20px weight 400 in #290a08 on a #f6f0e1 background. The link word itself is colored #fff3cc with no underline. No other color treatment is used on the link.

## Similar Brands

- **Ottolenghi** — Same warm-cream canvas, serif display headlines, and product-photography-led editorial layout for a cookbook author brand
- **Smitten Kitchen** — Same near-black warm text on cream, zero-radius components, and book-cover-as-hero composition with right-column descriptive copy
- **Cherry Bombe Radio** — Same editorial-magazine pacing, single warm dark accent, and minimal UI chrome that defers to typography and photography
- **Bon Appétit** — Same two-tone cream-and-ink palette, serif-led hierarchy, and food-photography-first visual language

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine-ink: #290a08;
  --color-vintage-burgundy: #810c00;
  --color-buttery-highlight: #fff3cc;
  --color-parchment-canvas: #f6f0e1;
  --color-linen-card: #fffaec;
  --color-hairline-mist: #e5e7eb;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-jannon-neo: 'Jannon Neo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-modale-antique: 'Modale Antique', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.18px;
  --text-body: 20px;
  --leading-body: 1.5;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.26px;
  --text-subheading-lg: 29px;
  --leading-subheading-lg: 1.5;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.64px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-96px;
  --card-padding: 24-48px;
  --element-gap: 24px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-parchment-canvas: #f6f0e1;
  --surface-linen-card: #fffaec;
  --surface-paper-white: #ffffff;
  --surface-aubergine-ink: #290a08;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine-ink: #290a08;
  --color-vintage-burgundy: #810c00;
  --color-buttery-highlight: #fff3cc;
  --color-parchment-canvas: #f6f0e1;
  --color-linen-card: #fffaec;
  --color-hairline-mist: #e5e7eb;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-jannon-neo: 'Jannon Neo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-modale-antique: 'Modale Antique', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.18px;
  --text-body: 20px;
  --leading-body: 1.5;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.26px;
  --text-subheading-lg: 29px;
  --leading-subheading-lg: 1.5;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.64px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-160: 160px;
}
```
