# LUNCH — Style Reference
> velvet runway on warm parchment

**Theme:** mixed

LUNCH CONCEPT reads as a printed fashion editorial dropped onto the web: one full-bleed dark photographic hero where the brand wordmark appears as oversized 3D chrome text, followed by a calm, catalog-like product gallery on warm parchment. The page alternates between cinematic confrontation and quiet restraint — the hero assaults, the body section whispers. A single muted lavender surfaces only on the announcement bar, the 'Sold Out' state, and the footer, acting as a brand period rather than a shout. Typography is overwhelmingly one custom sans-serif (Good Sans) at modest sizes, with the hero wordmark as the singular moment of typographic spectacle. Interaction is text-link only: no filled buttons, no gradients, no decorative chrome beyond the hero's 3D logotype.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lilac Veil | `#b8aad0` | `--color-lilac-veil` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Ink Black | `#000000` | `--color-ink-black` | All body text, navigation text, link borders, card borders, and badge borders — the structural linework of the entire interface |
| Warm Parchment | `#f4f1e4` | `--color-warm-parchment` | Page and section backgrounds in the editorial/product area — the calm canvas against which the product photography sits |
| Ivory Mist | `#fcfaf1` | `--color-ivory-mist` | Navigation text color over the dark hero, subtle surface variant and hairline borders — a warmer alternative to pure white for the dark-section UI |

## Tokens — Typography

### Good Sans — Sole workhorse typeface for navigation, body copy, product metadata, links, and all UI text. The dual-weight system (regular 400 for body/labels, bold 700 for brand names, prices, and emphasis) creates hierarchy without size escalation. The near-zero positive letter-spacing keeps it editorial rather than geometric. · `--font-good-sans`
- **Substitute:** Söhne, Inter, or Untitled Sans
- **Weights:** 400, 700
- **Sizes:** 12px, 16px, 24px, 32px
- **Line height:** 1.00 (nav), 1.80 (body)
- **Letter spacing:** 0.0050em to 0.0130em, increasing slightly at larger sizes
- **Role:** Sole workhorse typeface for navigation, body copy, product metadata, links, and all UI text. The dual-weight system (regular 400 for body/labels, bold 700 for brand names, prices, and emphasis) creates hierarchy without size escalation. The near-zero positive letter-spacing keeps it editorial rather than geometric.

### Redaction — Hero wordmark only — a custom display face for the 'LUNCH' 3D chrome text that anchors the full-bleed hero. Used exactly once per page; this is the typographic signature, not a reusable component. · `--font-redaction`
- **Substitute:** GT Sectra Display Bold, Domaine Display Bold, or Editorial New Bold
- **Weights:** 700
- **Sizes:** 72px
- **Line height:** 1.80
- **Letter spacing:** 0.0020em
- **Role:** Hero wordmark only — a custom display face for the 'LUNCH' 3D chrome text that anchors the full-bleed hero. Used exactly once per page; this is the typographic signature, not a reusable component.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | 0.6px | `--text-caption` |
| body | 16px | 1.8 | 0.08px | `--text-body` |
| subheading | 24px | 1.8 | 0.12px | `--text-subheading` |
| heading | 32px | 1.8 | 0.16px | `--text-heading` |
| display | 72px | 1.8 | 0.144px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 60-80px
- **Element gap:** 20-30px

## Components

### Announcement Bar
**Role:** Site-wide top message strip

Full-width #b8aad0 background, centered #000000 text at 12-16px Good Sans regular, line-height 1.8. No padding above/below — the color band itself is the container. Typically a single sentence about store status or thanks.

### Primary Navigation
**Role:** Site header navigation

Horizontal text-only link bar: LUNCH CONCEPT (left, weight 700), then ABOUT, SHOP, JOURNAL, SEARCH spaced across the right. Text in #fcfaf1 over the dark hero, switching to #000000 over light sections. No background, no borders, no icons. Gap between items approximately 20-30px.

### Hero with 3D Wordmark
**Role:** Full-bleed opening viewport

Full-viewport-width photographic image (model, product, or editorial scene) with the brand wordmark rendered as oversized 3D metallic/chrome text overlaid across the full width. The wordmark uses Redaction at 72px but with 3D extrusion and reflective material treatment. Text spans edge-to-edge, partially intersecting the subject.

### Intro Text Block
**Role:** Brand statement / about paragraph

Centered paragraph on Warm Parchment (#f4f1e4) background, max-width approximately 600-700px. Body text at 16px Good Sans regular, line-height 1.8. Followed by a centered underlined 'Find Out More' link in 12px uppercase.

### Text Link (Underline)
**Role:** Primary interactive element

12-16px Good Sans, weight 400, #000000, with a 1px #000000 underline offset 2-4px below the baseline. No fill, no border, no radius. Uppercase for navigational links (FIND OUT MORE), mixed case for inline links (Learn more).

### Product Card
**Role:** Grid item in the product gallery

Zero radius. Product/lookbook image at native proportions on a flat #fcfaf1 or white panel. Below the image: brand name in 12px Good Sans bold (#000000), product name in 12px regular, price in 12px bold, followed by 'Sold Out' in 12px Lilac Veil (#b8aad0) when unavailable. No card border, no shadow, no padding wrapper — the image IS the card.

### Product Grid
**Role:** Gallery layout for products and editorial looks

4-5 column grid, gap approximately 5px between columns. Images are flush — no gutters, no padding between cards. The grid flows full-width up to the page max-width of ~1280px.

### Sold Out Status
**Role:** Availability indicator on product cards

Inline text 'Sold Out' in 12px Good Sans, color #b8aad0 (Lilac Veil). Appears immediately after the price. No background, no badge shape, no border — it is text colored with the brand accent.

### Cookie Consent Banner
**Role:** Bottom-right utility notice

Small white card with black text, positioned bottom-right corner. Body text at 12px with a 'Learn more.' underlined link. Minimal close affordance.

### Footer Band
**Role:** Page-close branding strip

Full-width #b8aad0 (Lilac Veil) background, likely with centered navigation or brand text in #000000. Mirrors the announcement bar to bookend the page with the brand color.

## Do's and Don'ts

### Do
- Use only the four-token palette: #000000 for all text and lines, #f4f1e4 for content backgrounds, #fcfaf1 for the hero-context UI and surface variant, #b8aad0 for the brand whisper (announcement, footer, Sold Out).
- Set all text in Good Sans; reach for weight (400 vs 700) for hierarchy before increasing size.
- Make interactive elements text links with 1px underlines, not filled buttons — this is a text-driven interface, not a button-driven one.
- Let product and editorial photography be the visual weight; the UI is a frame, not a performer.
- Use the hero wordmark as the single moment of typographic spectacle — one large Redaction instance per page, nothing else at display scale.
- Pair dark full-bleed photography with Warm Parchment product sections to create the editorial rhythm.
- Keep card and image edges sharp (0px radius everywhere) — the system relies on flush, gallery-style composition.

### Don't
- Don't introduce filled buttons, pill shapes, or rounded corners — the system is 0px radius across all components.
- Don't use #b8aad0 as a CTA background or call-to-action fill — it is a brand whisper for the announcement bar, footer, and 'Sold Out' state only.
- Don't add gradients, drop shadows, or glassmorphism — the system uses flat surfaces and photographic depth.
- Don't scale body text above 32px outside the hero wordmark — Good Sans is a workhorse, not a display face.
- Don't place colored borders or chromatic UI elements; all structural lines are #000000.
- Don't split the brand color into light/dark variants — Lilac Veil is one flat tone, used as a punctuation mark.
- Don't add decorative iconography, badges, or UI ornamentation — the product photography and wordmark are the only visual performers.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Editorial Canvas | `#f4f1e4` | Page background for the intro, product grid, and all post-hero content |
| 1 | Hero Void | `#000000` | Full-bleed dark backdrop for the opening photographic spread and overlaid wordmark |
| 2 | Brand Whisper | `#b8aad0` | Announcement bar and footer — punctuation strips of lilac that bookend the content |

## Imagery

Editorial fashion photography dominates: full-bleed dark, high-contrast model imagery for the hero (moody studio lighting, avant-garde styling — red leather corset, tartan, dramatic poses) and clean product/lookbook shots on flat neutral backgrounds for the grid (models and items photographed against light gray/white with no lifestyle context). Images are sharp-edged, zero radius, and sit flush against adjacent images in the grid. The hero image bleeds to all four edges of the viewport with the 3D chrome wordmark overlapping the subject. Product grid images maintain consistent height-to-width ratios across the row. No illustrations, no icons beyond minimal text-based navigation. The visual language is: shoot it well, frame it tight, let the photography carry the brand.

## Layout

Max-width ~1280px centered for the content sections; the hero is full-bleed edge-to-edge. The page rhythm is: full-bleed dark hero (viewport height) → centered text intro on Warm Parchment → 4-5 column product grid on the same parchment → Lilac Veil footer band. Navigation sits as a thin text bar over the hero (light text on dark) and above the intro (dark text on light). The product grid is a tight 5px-gutter flush layout with no card padding or visual separation between images. The intro section is a narrow centered column (~600-700px) with generous vertical breathing room (60-80px) above and below. Overall density: spacious in the editorial sections, compressed in the product grid.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #f4f1e4
- surface variant: #fcfaf1
- border: #000000
- accent: #b8aad0 (Lilac Veil — announcement bar, footer, Sold Out only)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Announcement Bar**: Full-width #b8aad0 background strip, 12-16px Good Sans regular #000000 text, centered, single line. No padding wrapper, no border.

2. **Product Card**: Flush image (zero radius) on #fcfaf1 panel. Below: brand name 12px Good Sans weight 700 #000000, product name 12px weight 400 #000000, price 12px weight 700 #000000. If sold out, append 'Sold Out' in 12px #b8aad0.

3. **Hero Wordmark**: Full-bleed dark photograph filling the viewport. Overlaid across the full width: the word 'LUNCH' in 72px Redaction weight 700 with 3D metallic chrome material treatment, partially intersecting the photographic subject.

4. **Text Link**: 12px Good Sans weight 400 #000000 with 1px #000000 underline offset 4px from baseline. No background, no border, no radius. Uppercase for navigational links.

5. **Intro Text Block**: Centered column, max-width 640px, on #f4f1e4 background. 16px Good Sans regular #000000, line-height 1.8. Followed by 'FIND OUT MORE' centered text link 12px uppercase underlined.

## Similar Brands

- **SSENSE** — Same dramatic full-bleed dark editorial hero with oversized brand wordmark, followed by a restrained monochrome product grid
- **Farfetch** — Fashion concept-store identity with sharp-edged product photography on warm neutral backgrounds and text-link-only navigation
- **Dover Street Market** — Concept-store editorial language: one bold typographic or photographic moment at the top, then quiet product cataloging
- **Toteme** — Warm parchment/ivory surfaces with black text, zero-radius flush product imagery, and minimal sans-serif typography
- **Need Supply Co.** — Curated independent-designer store with text-link navigation, single-accent status indicators, and gallery-style product grids

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lilac-veil: #b8aad0;
  --color-ink-black: #000000;
  --color-warm-parchment: #f4f1e4;
  --color-ivory-mist: #fcfaf1;

  /* Typography — Font Families */
  --font-good-sans: 'Good Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-redaction: 'Redaction', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: 0.6px;
  --text-body: 16px;
  --leading-body: 1.8;
  --tracking-body: 0.08px;
  --text-subheading: 24px;
  --leading-subheading: 1.8;
  --tracking-subheading: 0.12px;
  --text-heading: 32px;
  --leading-heading: 1.8;
  --tracking-heading: 0.16px;
  --text-display: 72px;
  --leading-display: 1.8;
  --tracking-display: 0.144px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 60-80px;
  --element-gap: 20-30px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-editorial-canvas: #f4f1e4;
  --surface-hero-void: #000000;
  --surface-brand-whisper: #b8aad0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lilac-veil: #b8aad0;
  --color-ink-black: #000000;
  --color-warm-parchment: #f4f1e4;
  --color-ivory-mist: #fcfaf1;

  /* Typography */
  --font-good-sans: 'Good Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-redaction: 'Redaction', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: 0.6px;
  --text-body: 16px;
  --leading-body: 1.8;
  --tracking-body: 0.08px;
  --text-subheading: 24px;
  --leading-subheading: 1.8;
  --tracking-subheading: 0.12px;
  --text-heading: 32px;
  --leading-heading: 1.8;
  --tracking-heading: 0.16px;
  --text-display: 72px;
  --leading-display: 1.8;
  --tracking-display: 0.144px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-80: 80px;
}
```
