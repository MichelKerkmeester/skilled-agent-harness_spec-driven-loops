# CHRISTOPHER IRELAND CREATIVE — Style Reference
> bone-white gallery wall, editorial monograph in morning light

**Theme:** light

A photographer's portfolio rendered as a quiet editorial spread: a warm bone canvas, a single typeface pairing (a contemporary serif for display, a geometric sans for utility), and no chromatic accent whatsoever. The visual system defers entirely to the photography — text is a thin scaffolding of category labels and a few oversized serif headlines that behave like magazine pull-quotes. The feeling is closer to a printed monograph than a website: large blocks of breathing room, asymmetric split layouts (text-left, image-right), and weight 400 everywhere — the serif never thickens, the sans never condenses, so hierarchy comes from size and tracking rather than emphasis.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f2f1ec` | `--color-bone` | Page canvas, card surface — warm off-white reads as paper, not screen; gives the page a tactile, printed quality |
| Ink | `#000000` | `--color-ink` | Primary text, borders, dividers, plus-marks, section rules — pure black against bone creates the highest-possible contrast for a posterized editorial feel |
| Graphite | `#333332` | `--color-graphite` | Headline text — nearly black but with a quarter-step of warmth; lets the serif headings feel set rather than stamped |
| Ash | `#5d5b5b` | `--color-ash` | Secondary body text, captions, sub-labels — the only muted step in an otherwise binary palette |

## Tokens — Typography

### Playfair Display — Display and section headings — at 94px with weight 400 and positive 0.01em tracking, the serif behaves like a magazine masthead rather than a UI heading. The regular weight is anti-convention; most display serifs go bold for authority, but Playfair 400 at this size carries authority through proportion and negative space alone. Use for hero name, section titles (Commercial, Creative, Community), and any single-word moment that should feel like a printed title page. · `--font-playfair-display`
- **Substitute:** Cormorant Garamond, Lora, DM Serif Display
- **Weights:** 400
- **Sizes:** 63px, 94px
- **Line height:** 1.00–1.20
- **Letter spacing:** 0.01em at 63–94px
- **Role:** Display and section headings — at 94px with weight 400 and positive 0.01em tracking, the serif behaves like a magazine masthead rather than a UI heading. The regular weight is anti-convention; most display serifs go bold for authority, but Playfair 400 at this size carries authority through proportion and negative space alone. Use for hero name, section titles (Commercial, Creative, Community), and any single-word moment that should feel like a printed title page.

### Rubik — All utility text — body copy, sub-labels, navigation, metadata. Rubik at 400 / 16px / 1.5 line-height is deliberately quiet; it never competes with the serif display. The geometric humanist forms provide enough structure for small UI elements (the "+" expand marks, the "About" link) without introducing a second visual voice. · `--font-rubik`
- **Substitute:** Inter, IBM Plex Sans, Work Sans
- **Weights:** 400
- **Sizes:** 16px, 94px
- **Line height:** 1.50
- **Role:** All utility text — body copy, sub-labels, navigation, metadata. Rubik at 400 / 16px / 1.5 line-height is deliberately quiet; it never competes with the serif display. The geometric humanist forms provide enough structure for small UI elements (the "+" expand marks, the "About" link) without introducing a second visual voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.5 | — | `--text-body` |
| heading | 63px | 1.2 | 0.63px | `--text-heading` |
| display | 94px | 1 | 0.94px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 30 | 30px | `--spacing-30` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 0px
- **Element gap:** 11-14px

## Components

### Editorial Display Heading
**Role:** Hero name and section titles

Playfair Display 400 at 94px (display) or 63px (section), line-height 1.0–1.2, letter-spacing 0.01em, color #333332. Sits flush-left in its column with no decoration. The oversized lowercase-as-uppercase treatment ("CHRISTOPHER IRELAND" in caps at 94px) creates the masthead moment.

### Category List Item
**Role:** Expandable portfolio category (Commercial, Creative, Community)

Two-column row: serif label on the left (Playfair Display 400, 63px, #333332) and a "+" glyph on the right (Rubik 400, 16px, #000000). Vertical rhythm of ~11–14px between items. No background, no border — the type itself is the component.

### Plus-Mark Expand Indicator
**Role:** Indicates a tappable/expandable category

Rubik 400 at 16px, #000000, single character "+". Left-aligned in its own column, vertically centered against the serif label. Functions as the only interactive affordance on the page.

### Featured Image Panel
**Role:** Photography showcase beside category text

Full-bleed photograph, no border, no radius, no shadow, no caption. Occupies the right column in the category section. Sits on the bone canvas with no card surface or framing — the image meets the canvas edge directly.

### Top Bar
**Role:** Site identity and profession label

Centered masthead at top of page. Name in Playfair Display 400 caps at 94px, #333332. Profession label "Photographer | Director" in Rubik 400 at 16px, #5d5b5b, right-aligned beneath the name.

### Section Divider
**Role:** Separates header from content

Single 1px hairline rule in #000000 spanning the full page width. No gradient, no shadow, no extra weight — a printed-page rule.

### Sub-Nav Row
**Role:** Service categories and secondary link

Rubik 400 at 16px, #000000. Left side: comma-separated service list ("Commercial campaigns · Documentary films · Long-form photography"). Right side: "About" text link, underlined on hover. 30px vertical padding above and below.

### Body Caption
**Role:** Any supporting paragraph or metadata

Rubik 400 at 16px, #5d5b5b, line-height 1.5. Used for photographer credits, project descriptions, and any text that is not a display heading or a label.

## Do's and Don'ts

### Do
- Use Playfair Display 400 at 63px or 94px for every display heading — never bold it
- Set the canvas to #f2f1ec and let photographs meet it edge-to-edge with no card, border, or shadow
- Maintain a three-step text scale: #333332 for headings, #000000 for primary labels and rules, #5d5b5b for body
- Use 1px #000000 hairlines as the only divider — never use shadows, fills, or gradient fades to separate sections
- Keep all interactive elements as text or a single "+" character in Rubik 400 — no buttons, no backgrounds, no rounded shapes
- Set image and card radius to 0px; the bone canvas and the photograph should share a hard edge
- Apply 48px of vertical padding above and below section rules to create the printed-page breathing rhythm

### Don't
- Do not introduce any color — the palette is intentionally achromatic and adding a hue breaks the monograph feel
- Do not bold the Playfair Display headings; the weight-400 display IS the signature
- Do not wrap photographs in cards, frames, or shadows — let them sit on the bone canvas directly
- Do not add border-radius to any element; every corner in the system is sharp
- Do not use icons beyond the "+" character; the system communicates through type and image only
- Do not use gradients, blurs, or glassmorphism — these contradict the printed-page metaphor
- Do not set body copy larger than 16px; the contrast between 16px body and 63–94px display is what creates editorial hierarchy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#f2f1ec` | Page background — the single surface layer; everything sits on it directly |
| 2 | Photograph Surface | `#000000` | The darkest surface — full-bleed photography provides the only departure from bone; no card, border, or elevation separates it from the canvas |

## Elevation

No elevation is used anywhere in the system. There are no shadows, no card lifts, no overlays. The page is flat as a printed page — the 1px hairline rule and the shift from bone to photograph are the only depth cues. This is a deliberate choice: the portfolio is about photography, and any shadow or floating element would compete with the images for visual weight.

## Imagery

Photography is the entire visual language. All imagery is high-quality, naturalistic photography — warm, softly lit, often interior scenes with natural window light (visible in the screenshot: a person sitting on a bed in golden-hour light). Images are full-bleed within their column, never cropped to rounded shapes, never overlaid with text or UI. There are no illustrations, no icons beyond the "+" character, no decorative graphics, no product mockups. The image-to-text ratio favors images heavily once the category sections begin, but the header and nav areas are pure typography. The warmth of the bone canvas complements the warm color temperature of the photography, creating a cohesive editorial palette.

## Layout

Centered max-width container (~1200px) on a bone canvas, but the interior composition is asymmetric. The top region is a centered masthead (name centered, profession right-aligned beneath). Below a 1px hairline rule, a two-column sub-nav row with service list on the left and an "About" link on the right. The main content area splits into a two-column grid: large serif category labels (Commercial, Creative, Community) stacked vertically on the left at ~50% width, with a large featured photograph occupying the right column. Each category row is separated by ~11–14px of vertical space. The layout is editorial — it reads like a magazine table of contents, not a grid of cards. Navigation is minimal: no sidebar, no sticky header, no mega-menu, just the top masthead and the two text links in the sub-nav.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #f2f1ec
- primary text: #000000
- heading text: #333332
- body / muted text: #5d5b5b
- borders / rules: #000000
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. **Editorial hero masthead**: Center a name in Playfair Display 400 at 94px, letter-spacing 0.01em, color #333332. Below it, right-align "Photographer | Director" in Rubik 400 at 16px, #5d5b5b. All on a #f2f1ec canvas.
2. **Category list row**: Two-column layout on #f2f1ec. Left column: "Commercial" in Playfair Display 400, 63px, #333332, line-height 1.2. Right column: a single "+" in Rubik 400, 16px, #000000, vertically centered. 11px row gap between items.
3. **Featured image panel**: Full-bleed photograph in the right column with 0px border-radius, no border, no shadow, no caption. The image edge meets the #f2f1ec canvas directly.
4. **Section divider**: A 1px solid #000000 hairline rule spanning 100% width, with 48px padding above and below.
5. **Sub-nav row**: Rubik 400, 16px, on #f2f1ec. Left: "Commercial campaigns · Documentary films · Long-form photography" in #000000. Right: "About" as a plain text link in #000000 with underline on hover. 30px vertical padding.

## Similar Brands

- **Pelle Cass** — Same bone-canvas + oversized serif + single-photograph layout; both are photographer portfolios that read as printed monographs rather than websites
- **Peter Lindbergh** — Identical editorial discipline — weight-400 serif at display size, zero color, photography as the only visual element beyond type
- **Coco Capitan** — Same warm off-white canvas with generous whitespace and serif display headings; both use typography as gallery-label scaffolding around large photographs
- **Cereal magazine** — Same printed-publication metaphor — serif display on warm neutral, hairline rules, no UI chrome, images that float without card containers

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f2f1ec;
  --color-ink: #000000;
  --color-graphite: #333332;
  --color-ash: #5d5b5b;

  /* Typography — Font Families */
  --font-playfair-display: 'Playfair Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 63px;
  --leading-heading: 1.2;
  --tracking-heading: 0.63px;
  --text-display: 94px;
  --leading-display: 1;
  --tracking-display: 0.94px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-30: 30px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 0px;
  --element-gap: 11-14px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #f2f1ec;
  --surface-photograph-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f2f1ec;
  --color-ink: #000000;
  --color-graphite: #333332;
  --color-ash: #5d5b5b;

  /* Typography */
  --font-playfair-display: 'Playfair Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 63px;
  --leading-heading: 1.2;
  --tracking-heading: 0.63px;
  --text-display: 94px;
  --leading-display: 1;
  --tracking-display: 0.94px;

  /* Spacing */
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-30: 30px;
  --spacing-48: 48px;
}
```
