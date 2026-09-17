# Bareis + Nicolaus — Style Reference
> White chalk on black slate. A typographic control panel and a full-bleed visual index share one strict monochrome stage, with pill-shaped outlines as the only punctuation.

**Theme:** dark

Bareis + Nicolaus operates as a monochrome editorial grid: pitch-black canvas, bone-white outlines, and a single typeface carrying the entire voice. The interface is a split workspace — a typographic control column on the left filters and indexes, a full-bleed visual index on the right showcases the work. Every interactive element is a pill: 120px radius, 1px white stroke, no fill, no shadow, no hover fill — the geometry does the work. Typography is the protagonist: 72px display at weight 400 with a 1.0 line-height gives headlines architectural presence without weight, while 24px body text reads as quiet annotation. The system refuses decoration — no gradients, no brand color, no elevation, no rounded cards — and that absence is the identity. Every element earns its pixel by being typographic, structural, or navigational.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page background, card surface, filled button fill — the flat black ground that all white typography and outlines sit on |
| Bone | `#ffffff` | `--color-bone` | Primary text, pill button borders, link text, section dividers, card hover overlays — every outlined and typographic element |
| Ash | `#a9a9a9` | `--color-ash` | Muted borders and secondary structural strokes where pure white would compete with primary controls |

## Tokens — Typography

### Lausanne — The single voice — used for display headings (72px/1.00), section labels, body text, pill labels, and navigation. Weight 400 at 72px is a deliberate anti-convention: headlines whisper into the dark rather than shout, gaining authority through geometric restraint instead of boldness. The tight 1.0 line-height at display size creates blocky architectural headlines. · `--font-lausanne`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 24px, 72px
- **Line height:** 1.00–1.20
- **Letter spacing:** normal
- **Role:** The single voice — used for display headings (72px/1.00), section labels, body text, pill labels, and navigation. Weight 400 at 72px is a deliberate anti-convention: headlines whisper into the dark rather than shout, gaining authority through geometric restraint instead of boldness. The tight 1.0 line-height at display size creates blocky architectural headlines.

### Victor Serif — Rare editorial accent — appears as italic or contrast voice at body size. A serif breaking the sans-only system signals 'this text is different' (timestamps, quotes, personal notes). Used sparingly enough that each appearance is noticed. · `--font-victor-serif`
- **Substitute:** GT Sectra, Lyon Text, or Source Serif Pro
- **Weights:** 400
- **Sizes:** 24px
- **Line height:** 1.20
- **Role:** Rare editorial accent — appears as italic or contrast voice at body size. A serif breaking the sans-only system signals 'this text is different' (timestamps, quotes, personal notes). Used sparingly enough that each appearance is noticed.

### Black Tie — Decorative display face for one-off moments — a monospaced or display serif/script that breaks rhythm. The system is nearly all Lausanne, so a single Black Tie appearance acts as typographic spice. · `--font-black-tie`
- **Substitute:** Editorial New, Migra, or Tobias
- **Weights:** 400
- **Sizes:** 24px
- **Line height:** 1.00
- **Role:** Decorative display face for one-off moments — a monospaced or display serif/script that breaks rhythm. The system is nearly all Lausanne, so a single Black Tie appearance acts as typographic spice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 24px | 1.2 | — | `--text-body` |
| display | 72px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 20 | 20px | `--spacing-20` |
| 29 | 29px | `--spacing-29` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 120px |
| tags | 120px |
| cards | 0px |
| images | 0px |
| buttons | 120px |

### Layout

- **Section gap:** 48-80px
- **Card padding:** 0px
- **Element gap:** 10-13px

## Components

### Pill Tag (Outlined)
**Role:** Category filter and navigation control — the signature element of the system

Fully rounded pill at 120px border-radius, 1px Bone (#ffffff) stroke, transparent fill on Obsidian (#000000) background. Internal padding 10px vertical × 13px horizontal, with 7px margin-right for inline tag flow. Label in Lausanne 400/24px Bone. No fill on any state — the outline IS the element.

### Pill Tag (Filled Black)
**Role:** Active/selected state for category tags

Same 120px pill geometry, but filled with Obsidian (#000000) and bordered with 1px Bone (#ffffff). Used only for the 'Selected' filter — the active state is signaled by inversion, not by color.

### Pill Tag (Muted)
**Role:** Secondary or inactive labels (e.g., footer 'Imprint')

120px pill, 1px Ash (#a9a9a9) stroke, transparent fill, Lausanne 400/24px in Ash. Sits quieter than Bone-outlined tags to indicate metadata rather than control.

### Display Heading
**Role:** Brand name, section headers ('Work', 'Info', 'Contact')

Lausanne 400/72px at line-height 1.0, Bone (#ffffff) on Obsidian. No margin tricks — the tight line-height and weight 400 create the architectural block. Used left-aligned against the split-screen gutter.

### Project Thumbnail with Overlay Label
**Role:** Right-column portfolio index items

Full-bleed image (no border-radius — images sit sharp against the page), with a pill-shaped overlay label in the top-left corner. Label uses the outlined Pill Tag style with 1px Bone stroke over the image. No captions, no shadows, no padding around the image itself.

### Top Nav Pill
**Role:** Persistent header navigation (Archive, Research)

Two Pill Tags anchored to the top-right of the left column, same 120px geometry. Functions as a sticky secondary nav, separated from the Work filter grid below by a 1px Bone divider line.

### Section Divider
**Role:** Horizontal rule separating nav from content sections

1px Bone (#ffffff) full-width line, no padding above/below. Used to separate brand area, Work filter grid, Info header, Contact header. The only structural separator in the system.

### Footer Info Bar
**Role:** Bottom strip with location, weather, email, discipline

Full-width band at the very bottom. Inline text in Lausanne 400/24px Bone, separated by pipe characters (|). 1px Bone top border. Content reads as a single quiet line: city · temperature · city · temperature · brand · discipline · email.

### Collapse Toggle
**Role:** Minus-sign control next to the 'Work' header

A small circular control (120px radius) containing a minus glyph, used to collapse/expand the Work filter grid. Same outlined-pill construction as tags, scaled down to icon size.

## Do's and Don'ts

### Do
- Use 120px border-radius on every button, tag, and nav element — the pill is the system's only shape
- Use exactly 1px Bone (#ffffff) strokes for all outlined controls; never go thicker
- Set display text to 72px Lausanne weight 400 at line-height 1.0 — the light weight at large size is the signature
- Keep all spacing between tags at 7-13px; the tight cluster density is deliberate
- Use Bone (#ffffff) and Obsidian (#000000) only — Ash (#a9a9a9) is reserved for metadata, never for primary controls
- Use the split-screen layout: typographic control column left, visual index right, full-bleed both sides
- Separate sections with a 1px Bone line and generous vertical air — no cards, no panels, no backgrounds

### Don't
- Never add a fill color, gradient, or brand accent — the system is strictly monochrome
- Never apply a border-radius other than 120px (or 0px for images/dividers) — mixed radii break the geometric language
- Never use bold or semibold weights on Lausanne — weight 400 at all sizes is the rule
- Never add drop shadows, glows, or any elevation effect to any element
- Never add internal padding to project images — they must sit flush against the page edge
- Never use Ash (#a9a9a9) for active states or primary text — it is metadata-only
- Never introduce a second font for body or navigation — Victor Serif and Black Tie are accents, not workhorses

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Field | `#000000` | Full-bleed page background — the single flat stage |
| 1 | Bone Plate | `#ffffff` | Inverse surface for image fills and right-column content; also the text/border color on the dark side |

## Elevation

No shadows. No drop shadows, no glows, no inner shadows. Depth is communicated exclusively through 1px Bone strokes on an Obsidian field — the system treats light and dark as the only spatial language. Adding a shadow would break the flat editorial stage.

## Imagery

Photography is the right column's sole content. Project thumbnails are full-bleed, no border-radius, no padding, no overlay effects beyond the pill-shaped label in the top-left. The images span from product photography (the phone in a painted blur) to editorial portraiture (the basketball player with tattooed arm), spanning cultural, commercial, and identity work. There is no consistent photographic treatment — the work itself is the diversity. The label overlay is the only consistent graphic element tying images to the typographic system. No illustrations, no abstract graphics, no icons beyond the minus-glyph toggle.

## Layout

A rigid split-screen full-bleed layout. Left column (~40% width) contains the entire typographic interface: brand wordmark at top, two-pill top nav, section heading 'Work', a dense filter tag grid (8+ rows of outlined pills), then 'Info' and 'Contact' section headers further down. Right column (~60% width) is a full-bleed vertical stack of project thumbnails, each filling its row edge-to-edge. No max-width container — both columns run to the viewport edges. A single 1px Bone horizontal line separates the top brand area from the Work grid; another separates the last filter row from the Info/Contact area. The bottom 40-60px is a horizontal footer info bar with inline pipe-separated metadata. There are no cards, no gutters between sections, no centered content — the layout is a strict two-column editor.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff (Bone)
- background: #000000 (Obsidian)
- border: #ffffff (Bone) for primary, #a9a9a9 (Ash) for metadata
- accent: none — system is strictly monochrome
- primary action: #000000 (filled action)

Example Component Prompts:

1. **Filter Tag Grid**: Create a dense grid of outlined pill buttons on #000000. Each pill has 120px border-radius, 1px #ffffff border, transparent fill, padding 10px vertical × 13px horizontal, 7px margin-right. Label text in Lausanne 400/24px #ffffff. Pack 6–8 pills per row. One pill in the grid is the 'active' state: filled #000000 with 1px #ffffff border (inversion, not color).

2. **Display Heading Block**: Place a 72px Lausanne weight 400 heading in #ffffff on #000000, line-height exactly 1.0, left-aligned. Below it, a 1px #ffffff horizontal divider line spanning the column width with 48px vertical air above and below.

3. **Project Thumbnail Row**: Full-bleed image, 0px border-radius, no padding, no shadow. Overlay a pill-shaped label in the top-left corner: 120px radius, 1px #ffffff stroke, transparent fill, containing 24px Lausanne #ffffff text.

4. **Footer Info Bar**: Full-width band at page bottom, 1px #ffffff top border, 24px Lausanne #ffffff text, inline items separated by ' | ' characters on a single line. No background change — sits on the same #000000 field.

5. **Section Collapse Control**: Small circular button (120px radius), 1px #ffffff stroke, transparent fill, containing a single minus glyph in #ffffff at 24px. Placed flush right of a 72px display heading.

## Typographic Restraint

Lausanne carries 99% of the system at weight 400. The contrast between 72px display and 24px body is the only hierarchy tool — there are no weights, no italics in Lausanne, no color shifts, no size intermediates. Victor Serif appears in body-size slots only when the content type warrants a different voice (dates, quotes, attribution). Black Tie is a single-flavor spice: one appearance per page maximum. This scarcity makes the serif and display faces feel like editorial interjections rather than system fonts.

## Similar Brands

- **Pentagram** — Same monochrome editorial portfolio structure with split-screen navigation and full-bleed project thumbnails, typographic-first identity
- **Studio Dumbar** — Restrained geometric typography, strict 2-column layouts, and a refusal of decorative color or shadow
- **Manual Studio** — Dense pill-based navigation systems, split-screen index/control layouts, and editorial discipline
- **Violaine & Jérémy** — Dark-mode studio portfolio with white outline controls and large light-weight display type
- **Kasper-Florio** — Typographic monolith landing pages with filter-pill navigation and full-bleed image grids

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;
  --color-ash: #a9a9a9;

  /* Typography — Font Families */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-victor-serif: 'Victor Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-black-tie: 'Black Tie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 24px;
  --leading-body: 1.2;
  --text-display: 72px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-20: 20px;
  --spacing-29: 29px;

  /* Layout */
  --section-gap: 48-80px;
  --card-padding: 0px;
  --element-gap: 10-13px;

  /* Border Radius */
  --radius-full: 120px;

  /* Named Radii */
  --radius-nav: 120px;
  --radius-tags: 120px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 120px;

  /* Surfaces */
  --surface-obsidian-field: #000000;
  --surface-bone-plate: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;
  --color-ash: #a9a9a9;

  /* Typography */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-victor-serif: 'Victor Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-black-tie: 'Black Tie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 24px;
  --leading-body: 1.2;
  --text-display: 72px;
  --leading-display: 1;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-20: 20px;
  --spacing-29: 29px;

  /* Border Radius */
  --radius-full: 120px;
}
```
