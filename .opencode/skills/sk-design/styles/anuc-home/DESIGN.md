# Anuc Home — Style Reference
> editorial gallery in warm white — a quiet, magazine-like space where oversized serif headlines and monumental rounded geometric letterforms frame intimate interior photography

**Theme:** light

Anuc Home is an editorial interior-design gallery: a near-monochrome warm-white canvas where oversized Instrument Serif headlines converse with quiet Instrument Sans UI, creating a magazine-meets-architectural-portfolio atmosphere. The signature move is the massive ANUC wordmark built from pure geometric shapes — full-radius arches and circles — that doubles as the brand's visual identity and its spatial language. The palette is deliberately restrained to 2% chromatic, letting photography of styled interiors carry all the warmth; the UI never competes, just frames. Components feel architectural rather than app-like: sharp corners, hairline borders, generous negative space, and no shadows. Density is compact in data sections but breathing in editorial sections, with 96px+ section gaps creating a gallery-walk rhythm.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1a1a1e` | `--color-ink` | Primary text, all borders, logo forms, icon strokes — the structural near-black that defines every contour across the system |
| Canvas | `#f3f3f2` | `--color-canvas` | Page background — warm off-white that gives the entire system its gallery-wall warmth rather than clinical white |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, article blocks, elevated panels — pure white sits on top of Canvas to create subtle layering without shadows |
| Ash | `#d1d1d2` | `--color-ash` | Hairline borders, divider lines, subtle structural rules — the thinnest visible grid |
| Stone | `#c1c2bd` | `--color-stone` | Secondary borders, muted fills, icon strokes at lower emphasis |
| Linen | `#e7e6e4` | `--color-linen` | Muted surface for category tags, soft chips, low-emphasis backgrounds — warm-tinted neutral that steps between Paper and Canvas |
| Graphite | `#4d4942` | `--color-graphite` | Muted body text, secondary copy — warm dark gray for hierarchy below Ink |
| Mist | `#8d8d8f` | `--color-mist` | Tertiary text, timestamps, metadata — the lightest readable gray |
| Bronze | `#9a682c` | `--color-bronze` | Sparingly used warm accent — appears as small punctuation dots or category indicators, never as fills; adds a whisper of warmth to the achromatic system |
| Slate | `#4a626f` | `--color-slate` | Secondary accent — cool counterpoint to Bronze, used in equally restrained dot/tag contexts to create subtle color rhythm |

## Tokens — Typography

### Instrument Sans — All UI, navigation, body copy, button labels, and small headlines. Weight 500 carries nav and button emphasis; weight 400 is the default reading voice. Free substitute: Inter, DM Sans. · `--font-instrument-sans`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 15, 16, 18px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** All UI, navigation, body copy, button labels, and small headlines. Weight 500 carries nav and button emphasis; weight 400 is the default reading voice. Free substitute: Inter, DM Sans.

### Instrument Serif — All display and editorial headlines — the 52px and 74px sizes carry the brand's magazine-portfolio voice. The contrast between this high-contrast serif and the neutral sans is the system's signature typographic gesture. Free substitute: Playfair Display, Cormorant Garamond. · `--font-instrument-serif`
- **Substitute:** Cormorant Garamond
- **Weights:** 400
- **Sizes:** 15, 16, 32, 52, 74px
- **Line height:** 1.00–1.20
- **Letter spacing:** normal
- **Role:** All display and editorial headlines — the 52px and 74px sizes carry the brand's magazine-portfolio voice. The contrast between this high-contrast serif and the neutral sans is the system's signature typographic gesture. Free substitute: Playfair Display, Cormorant Garamond.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1.2 | — | `--text-caption` |
| body-lg | 18px | 1.2 | — | `--text-body-lg` |
| subheading | 32px | 1.1 | — | `--text-subheading` |
| heading | 52px | 1.05 | — | `--text-heading` |
| display | 74px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 96 | 96px | `--spacing-96` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| buttons | 0px |
| logoShapes | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### ANUC Wordmark
**Role:** Primary brand identity — monumental geometric letterforms

The ANUC logo constructed from four oversized shapes: two full-radius arches (left and right) and two full circles (inner letters), all filled with Ink (#1a1a1e) on the Canvas background. Each shape is roughly 250–300px tall and fills nearly the full viewport width in the hero. The shapes have 9999px border-radius making them pure geometric forms — no padding, no border, no shadow. This is not a typographic logo; it IS the page.

### Top Navigation
**Role:** Minimal site navigation

Horizontal bar at viewport top with brand mark 'ANUC HOME' left (Instrument Sans 500, 15–16px, Ink) and nav items (NOSOTROS, SERVICIOS, CONTACTO) right-aligned in Instrument Sans 400, 15–16px, uppercase or small-caps tracking. No background fill — sits directly on Canvas. Items separated by bullet dots (·). No border, no shadow, no sticky behavior visible.

### Hero Image Grid
**Role:** Full-viewport visual statement for the landing

Multi-column grid of interior photography tiles filling the viewport, separated by 1–2px hairline borders in Ink. Each tile is a different interior space (living rooms, reading nooks, styled corners). The 'ANUC' wordmark overlays as massive negative-space shapes. No captions, no overlays on the photos themselves.

### Editorial Section Heading
**Role:** Large display text for section openers

Instrument Serif 400, 52–74px, Ink, line-height 1.0–1.05, left-aligned with generous left margin. Preceded by a small uppercase label (e.g., 'SERVICIOS', 'ARTÍCULOS') in Instrument Sans 500, 15px, uppercase, letter-spacing wide, positioned above-left of the headline. The serif's high contrast at 74px is the brand's loudest typographic moment — it commands the page without color or weight tricks.

### Article Card
**Role:** Content preview block in articles section

Rectangular card on Paper (#ffffff) background, 24px padding, no border, no shadow, 0px radius. Contains: a date in Instrument Sans 400, 15px, Mist (#8d8d8f); a title in Instrument Serif 400, 32px, Ink; and a category tag below. Cards stack vertically with 8–16px gaps between them.

### Category Tag
**Role:** Small label chip for content categorization

Inline tag with a small leading dot (·) in Bronze (#9a682c) or Slate (#4a626f), followed by uppercase text in Instrument Sans 500, 15px, Ink. Background: transparent or Linen (#e7e6e4) when given more weight. No border, 0px radius, 4px 8px padding. The colored dot is the system's only chromatic punctuation.

### CTA Button — Outlined Ghost
**Role:** Primary action button (e.g., 'AGENDAR CONSULTA')

Rectangle, 0px radius, 1px solid Ink (#1a1a1e) border, transparent background. Label in Instrument Sans 500, 15px, uppercase, Ink, letter-spacing slightly tracked. Followed by a small arrow icon (→). Padding approximately 12px 24px. No fill state on hover — the border may thicken or the background fills with Ink inverting text to white. This is the system's only interactive element and it stays architecturally restrained.

### Two-Column Editorial Section
**Role:** Content layout pattern for text+image or label+content

Wide left column (label + headline) paired with a narrower right column (list of items or cards). Columns separated by generous whitespace rather than dividers. Left column uses the small uppercase label + oversized serif headline; right column uses compact sans-serif lists or cards.

### Hairline Divider
**Role:** Structural separation between sections and grid cells

1px solid line in Ash (#d1d1d2) or Ink (#1a1a1e). Used to define image grid cells, separate content sections, and outline cards. No decorative styling — the divider is pure architecture.

### Section Label
**Role:** Small uppercase section identifier (e.g., 'SERVICIOS', 'ARTÍCULOS')

Instrument Sans 500, 15px, Ink, uppercase, positioned at the top-left of each editorial section. Optional letter-spacing of 0.5–1px. Functions as the typographic equivalent of a museum placard.

## Do's and Don'ts

### Do
- Use Instrument Serif 400 at 52–74px for all display headlines — the high-contrast serif at oversized scale is the brand's signature typographic moment
- Set all radii to 0px for buttons, cards, and tags — the system is architectural, not soft; sharpness communicates precision
- Maintain the warm off-white Canvas (#f3f3f2) as the dominant background; never use pure clinical white for full-page backgrounds
- Use Ink (#1a1a1e) for all text and borders; let color do no work — the system is deliberately achromatic
- Separate image grid cells with 1–2px hairline borders in Ink to create the gallery-grid structure
- Precede every display headline with a small uppercase Instrument Sans 500 label (15px) to create the editorial section-opening rhythm
- Apply 96px minimum vertical spacing between major sections to maintain the gallery-walk pacing

### Don't
- Do not introduce shadows, glows, or blur effects — the system communicates elevation through background color steps (Canvas → Paper → Linen), never through box-shadow
- Do not use border-radius greater than 0px on any UI element — rounded buttons or cards would break the architectural language; the only rounded forms are the monumental logo shapes
- Do not add chromatic fills to buttons, backgrounds, or large UI surfaces — Bronze and Slate are reserved for dot punctuation only
- Do not use Instrument Sans for display headlines — the serif/sans contrast is the system's signature; flattening both to sans destroys the editorial voice
- Do not place body copy at sizes below 15px — the system is generous with reading size, not compact
- Do not stack dense information without the 96px section gap — the gallery-walk rhythm requires breathing room between content blocks
- Do not use decorative gradients, textures, or background imagery behind text — every text surface must sit on a flat, untextured neutral

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f3f3f2` | Base page background — the warm off-white gallery wall |
| 2 | Paper | `#ffffff` | Card surfaces and article blocks that float above Canvas |
| 3 | Linen | `#e7e6e4` | Soft chip and tag backgrounds — the most recessed surface |

## Elevation

The system deliberately avoids shadows entirely. Elevation is communicated exclusively through flat background color stepping: Canvas (#f3f3f2) → Paper (#ffffff) → Linen (#e7e6e4). This creates a paper-architecture feel where every surface feels physically placed, like prints mounted on a gallery wall, rather than digitally floating.

## Imagery

Photography is the visual centerpiece: large, warm-toned interior design photographs styled with natural light, organic materials (linen, wood, ceramics), and lived-in warmth. Images are treated as full-bleed grid tiles with no overlays, no rounded corners, and no color grading beyond natural warmth. The objects and spaces ARE the heroes — no lifestyle models, no abstract graphics, no illustration. The brand identity itself is geometric shapes rather than photography or illustration, creating a deliberate contrast between organic interiors and architectural wordmark.

## Layout

Full-bleed hero with multi-column image grid (4–5 columns) that spans the entire viewport, with the monumental ANUC wordmark as oversized negative-space shapes overlaying the grid. Below the hero, the layout shifts to a generous max-width (~1200–1440px) centered container for editorial sections. Section pattern is consistently two-column: a wide left column for the small label + oversized serif headline, and a right column for compact lists or article cards. Vertical rhythm is gallery-like: 96px+ between major sections, with flat transitions rather than alternating color bands. Navigation is a single minimal top bar. Content arrangement is left-aligned and asymmetric, with whitespace carrying the compositional weight rather than borders or rules.

## Agent Prompt Guide

QUICK COLOR REFERENCE:
- text: #1a1a1e
- background: #f3f3f2
- surface/card: #ffffff
- border: #d1d1d2
- accent dot: #9a682c
- primary action: no distinct CTA color

EXAMPLE COMPONENT PROMPTS:

1. Create an editorial section opener: Canvas (#f3f3f2) background, full-width with max-width 1200px centered. Small uppercase label 'SERVICIOS' in Instrument Sans 500, 15px, #1a1a1e, positioned top-left. Display headline below in Instrument Serif 400, 52px, #1a1a1e, line-height 1.05, left-aligned.

2. Create an article card: #ffffff background, 0px radius, 24px padding, no border, no shadow. Date '16.07.2025' in Instrument Sans 400, 15px, #8d8d8f at top. Title in Instrument Serif 400, 32px, #1a1a1e below. Category tag at bottom: small dot (·) in #9a682c followed by uppercase Instrument Sans 500, 15px, #1a1a1e text 'DISEÑO OFICINAS'.

3. Create a ghost action button: transparent background, 1px solid #1a1a1e border, 0px radius, 12px 24px padding. Label 'AGENDAR CONSULTA' in Instrument Sans 500, 15px, uppercase, #1a1a1e, letter-spacing 0.5px, followed by a small right-arrow icon (→) in #1a1a1e.

4. Create a hero image grid: 4–5 equal columns, full viewport width, each cell containing an interior photograph. Cells separated by 1px solid #1a1a1e borders. No captions, no overlays, images fill cells edge-to-edge with 0px radius.

5. Create a section divider: a single 1px solid #d1d1d2 horizontal line spanning the full content width, with 96px vertical space above and below it.

## Similar Brands

- **Studio KO** — Same editorial gallery approach — oversized serif display type, near-monochrome warm-white canvas, architectural grid layouts, and photography that speaks without UI decoration
- **Casa Brutus (magazine)** — Magazine-like restraint with Instrument Serif-style display typography, generous whitespace, and a hierarchy driven by typographic scale rather than color
- **Bureau Borsche** — Identical near-monochrome palette, monumental geometric identity marks, and the same editorial-gallery density where whitespace and type carry the composition
- **Gensler** — Architecture-portfolio layout language — full-bleed image grids, hairline cell borders, oversized serif section openers, and the same warm-off-white canvas treatment
- **Norm Architects** — Scandinavian interior-design restraint with 2% colorfulness, warm off-white backgrounds, serif/sans typographic duality, and architectural rather than app-like component design

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1a1a1e;
  --color-canvas: #f3f3f2;
  --color-paper: #ffffff;
  --color-ash: #d1d1d2;
  --color-stone: #c1c2bd;
  --color-linen: #e7e6e4;
  --color-graphite: #4d4942;
  --color-mist: #8d8d8f;
  --color-bronze: #9a682c;
  --color-slate: #4a626f;

  /* Typography — Font Families */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --text-subheading: 32px;
  --leading-subheading: 1.1;
  --text-heading: 52px;
  --leading-heading: 1.05;
  --text-display: 74px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-96: 96px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-buttons: 0px;
  --radius-logoshapes: 9999px;

  /* Surfaces */
  --surface-canvas: #f3f3f2;
  --surface-paper: #ffffff;
  --surface-linen: #e7e6e4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1a1a1e;
  --color-canvas: #f3f3f2;
  --color-paper: #ffffff;
  --color-ash: #d1d1d2;
  --color-stone: #c1c2bd;
  --color-linen: #e7e6e4;
  --color-graphite: #4d4942;
  --color-mist: #8d8d8f;
  --color-bronze: #9a682c;
  --color-slate: #4a626f;

  /* Typography */
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --text-subheading: 32px;
  --leading-subheading: 1.1;
  --text-heading: 52px;
  --leading-heading: 1.05;
  --text-display: 74px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-96: 96px;
  --spacing-240: 240px;
}
```
