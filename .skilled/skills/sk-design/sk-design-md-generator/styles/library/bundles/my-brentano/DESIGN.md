# My Brentano — Style Reference
> Pharmacy broadsheet on cream paper. A Swiss editorial layout where one typewriter voice does all the speaking and warm-toned product photography supplies the only color.

**Theme:** light

My Brentano channels a Swiss-editorial pharmacy aesthetic: warm cream canvas, one typewriter-serif display face at monumental sizes, and a single near-black ink for almost everything. The design is radical in its restraint — no shadows, no rounded cards, no accent colors, no gradient washes. Hierarchy is built through typographic scale (60px display down to 15px body) and generous negative space, not through color or elevation. Imagery is the only chromatic moment: warm product photography with beige, mustard, and burgundy tones that bleed off-frame. Components feel like printed editorial: thin horizontal rules, circular outlined arrows, and text-aligned links with no fills. Every surface sits on the same flat plane; the design is a typographic object, not a digital interface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Ink | `#212529` | `--color-charcoal-ink` | Body text, headings, nav text, footer text, most borders — the dominant text and structural color, slightly softer than pure black for warmth |
| Pure Press | `#000000` | `--color-pure-press` | Secondary text, button borders, link borders, input outlines, nav separators — true black for maximum contrast on outlined elements |
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, card surfaces, button fills, input backgrounds — the ground that all ink sits on |

## Tokens — Typography

### Studio Feixen Sans Writer Book Regular — Studio Feixen Sans Writer Book Regular — detected in extracted data but not described by AI · `--font-studio-feixen-sans-writer-book-regular`
- **Weights:** 400
- **Sizes:** 30px
- **Line height:** 1.2
- **Role:** Studio Feixen Sans Writer Book Regular — detected in extracted data but not described by AI

### Studio Feixen Sans Writer — Primary typeface for all text — body, headings, nav, links, buttons, lists. The Writer variant carries a typewriter/letterpress quality with subtle ink-trapped details that a geometric sans cannot replicate. Weight 700 is used sparingly only on the 60px display; everything else stays at 400, making the single bold moment feel intentional and declarative. · `--font-studio-feixen-sans-writer`
- **Substitute:** IBM Plex Mono or JetBrains Mono for the typewriter character; Inter for a neutral fallback
- **Weights:** 400, 700
- **Sizes:** 12, 15, 18, 25, 30, 60
- **Line height:** 1.20, 1.67, 2.08, 2.50
- **Letter spacing:** normal across all sizes — no negative tracking on display, which is unusual and preserves the mechanical, evenly-spaced typewriter rhythm
- **Role:** Primary typeface for all text — body, headings, nav, links, buttons, lists. The Writer variant carries a typewriter/letterpress quality with subtle ink-trapped details that a geometric sans cannot replicate. Weight 700 is used sparingly only on the 60px display; everything else stays at 400, making the single bold moment feel intentional and declarative.

### Studio Feixen Sans — Secondary sans variant for select body passages and inputs where the typewriter serifs would be too loud. The same family, stripped of the Writer details, creates a quiet alternation within the same typographic world. · `--font-studio-feixen-sans`
- **Substitute:** Inter or system-ui sans-serif
- **Weights:** 400
- **Sizes:** 15, 30
- **Line height:** 1.20
- **Role:** Secondary sans variant for select body passages and inputs where the typewriter serifs would be too loud. The same family, stripped of the Writer details, creates a quiet alternation within the same typographic world.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 15px | 1.67 | — | `--text-body-sm` |
| body | 18px | 2.08 | — | `--text-body` |
| subheading | 25px | 2.5 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| display | 60px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| images | 0px |
| inputs | 0px |
| buttons | 9999px |
| navCircles | 9999px |

### Layout

- **Section gap:** 40-60px
- **Element gap:** 10px

## Components

### Circular Nav Arrow Button
**Role:** Navigation link with directional affordance

40px circle, 1px border in #000000, transparent fill, centered right-arrow glyph in Charcoal Ink (#212529). Used for Shop, Blog, Über uns nav items. Pairs with the language selector.

### Language Selector Pill
**Role:** Locale switcher

Circular outlined element identical to nav buttons — 1px #000000 border, transparent fill, 'DE' label in Charcoal Ink at 15px weight 400 Writer font.

### Editorial Display Headline
**Role:** Hero and section H1

60px Studio Feixen Sans Writer, weight 700, line-height 1.20, Charcoal Ink (#212529). Left-aligned, full-width, no max-width constraint. The typewriter weight at this size is the signature moment — mechanical but monumental.

### Section Heading
**Role:** H2/H3 within content blocks

30px Writer weight 400, line-height 1.20, Charcoal Ink. Same family as display but at half the size and regular weight — maintains the editorial voice without competing with the hero.

### Body Paragraph
**Role:** Long-form description text

15–18px Writer weight 400, line-height 1.67–2.08 (generous, almost double), Charcoal Ink. The tall line-height is a print-magazine convention; it makes reading feel like turning a page, not scrolling a feed.

### Offset Image Stack
**Role:** Product/editorial imagery placement

Two or three rectangular photographs overlapping at slight angles (2–5° rotation), unbordered (0px radius), casting no shadow. One image is always rotated to break the grid — a deliberate Swiss-editorial gesture. Warm-toned: beige, mustard, deep burgundy product photography on warm cream paper backgrounds.

### Text Link
**Role:** Inline navigation and reference

15px Writer weight 400, Charcoal Ink, no underline by default, no color change. Underline or contextual differentiation is avoided — navigation is implied by position and surrounding arrows.

### Outlined Action Button
**Role:** Interactive controls (implied from nav pattern)

1px #000000 border, transparent fill, Charcoal Ink text, 0px radius, 5px vertical / 10px horizontal padding. Ghost/outlined — never filled. The same pattern is used for nav and would extend to all CTAs.

### Shopping Bag Icon
**Role:** Cart access in top-right

Small line-icon in Charcoal Ink, no background, no badge. Sits in the top-right corner as a quiet utility affordance.

### Top Navigation Bar
**Role:** Primary site navigation

Single horizontal row, full-bleed, separated from content by a 1px hairline border in #000000. Left: brand text 'Hallo. Wir sind Brentano'. Center: language + 3 nav arrows. Right: cart icon. Fixed height, no background fill distinct from page.

## Do's and Don'ts

### Do
- Use Studio Feixen Sans Writer at 60px weight 700 for the single most important headline on any page
- Set body text at 15–18px with line-height between 1.67 and 2.08 — never tighter than 1.5
- Use 0px border-radius on all images, inputs, and rectangular elements; reserve 9999px exclusively for circular nav controls
- Separate the top nav from page content with a single 1px #000000 hairline — no background fill, no shadow
- Let product imagery supply all color; keep UI strictly in Charcoal Ink (#212529), Pure Press (#000000), and Bone White (#ffffff)
- Break the grid by rotating overlapping product images 2–5° rather than aligning them perfectly
- Use 10px gaps for inline element spacing, 40–60px for vertical section rhythm

### Don't
- Never introduce an accent or brand color — the system is intentionally near-monochrome, and color belongs only to photography
- Never apply shadows, glows, or any form of elevation — surfaces must remain flat like printed paper
- Never use bold weight (700) for anything smaller than 30px — the single bold moment must remain monumental
- Never round corners on cards, images, or input fields — 0px radius is non-negotiable
- Never use more than two typefaces per view; alternate between Writer and Sans within the same family only
- Never center-align body paragraphs or set them narrower than 50% of the viewport — the grid is left-aligned and generous
- Never apply a colored background to the page — the cream warmth comes from the paper-tone canvas and the imagery, not from a tint

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone White Canvas | `#ffffff` | The single page surface — no separate card or elevated layers exist; all content sits directly on this plane |

## Elevation

Elevation is absent by design. The system treats the page as a flat printed sheet — no box-shadows, no z-axis differentiation. Hierarchy is achieved entirely through typographic scale, whitespace, and hairline 1px borders. A surface that needs to feel distinct should rely on a different image crop or a rotated placement, never on a drop shadow.

## Imagery

Imagery is the sole chromatic system. Product photography is shot on warm cream paper backgrounds with natural daylight, featuring hands holding skincare jars and dropper bottles. The palette within photography is tightly controlled: beige/butter, mustard yellow, deep burgundy/wine red, and soft skin tones. Images are presented as unframed rectangles (0px radius) that frequently overlap at slight rotation angles, breaking the grid. No lifestyle or environmental context — the product and the hand holding it are the entire composition. No icons beyond minimal line-glyphs in the nav.

## Agent Prompt Guide

**Quick Color Reference**
- text: #212529 (Charcoal Ink)
- background: #ffffff (Bone White)
- border: #000000 (Pure Press)
- accent: none — color exists only in product photography
- primary action: no distinct CTA color

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Body text block with offset images*: Above the text, place two rectangular product photographs (0px radius) overlapping at a 3° clockwise rotation on the right side of the layout, with the leftmost image slightly larger and the right image cropped to show a warm mustard-yellow cream swirl. Below, two paragraphs of body text at 18px Writer weight 400, line-height 2.08, color #212529, left-aligned, occupying roughly 45% of the viewport width. No background, no border around the text.

3. *Outlined nav button*: A 40px circle with 1px #000000 border, transparent fill. Inside, a right-arrow glyph (→) in #212529 at 15px Writer weight 400, vertically and horizontally centered. No hover fill, no shadow — on hover, optionally invert to a #000000 fill with a white arrow, but the default state is strictly outlined.

## Similar Brands

- **Aesop** — Same near-monochrome restraint with warm cream backgrounds and serif/typewriter-flavored type, where product photography is the only source of color
- **Le Labo** — Editorial pharmacy aesthetic with oversized display type, hairline rules, and a radical absence of decorative UI chrome
- **Mara Hoffman** — Swiss-grid editorial layouts with large left-aligned typewriter-quality headlines and unframed offset imagery on a flat cream canvas
- **Studio Feixen (parent type studio)** — The custom typeface and its mechanical, evenly-spaced rhythm define the visual identity — brands using Feixen fonts inherit this same editorial discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-ink: #212529;
  --color-pure-press: #000000;
  --color-bone-white: #ffffff;

  /* Typography — Font Families */
  --font-studio-feixen-sans-writer-book-regular: 'Studio Feixen Sans Writer Book Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-studio-feixen-sans-writer: 'Studio Feixen Sans Writer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-studio-feixen-sans: 'Studio Feixen Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 15px;
  --leading-body-sm: 1.67;
  --text-body: 18px;
  --leading-body: 2.08;
  --text-subheading: 25px;
  --leading-subheading: 2.5;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-display: 60px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-30: 30px;
  --spacing-40: 40px;

  /* Layout */
  --section-gap: 40-60px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;
  --radius-navcircles: 9999px;

  /* Surfaces */
  --surface-bone-white-canvas: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-ink: #212529;
  --color-pure-press: #000000;
  --color-bone-white: #ffffff;

  /* Typography */
  --font-studio-feixen-sans-writer-book-regular: 'Studio Feixen Sans Writer Book Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-studio-feixen-sans-writer: 'Studio Feixen Sans Writer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-studio-feixen-sans: 'Studio Feixen Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 15px;
  --leading-body-sm: 1.67;
  --text-body: 18px;
  --leading-body: 2.08;
  --text-subheading: 25px;
  --leading-subheading: 2.5;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-display: 60px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-30: 30px;
  --spacing-40: 40px;
}
```
