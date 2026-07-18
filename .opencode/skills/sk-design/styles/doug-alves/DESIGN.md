# Doug–Alves — Style Reference
> Oversized typographic monolith on warm charcoal

**Theme:** mixed

Doug Alves' portfolio treats every viewport like a gallery wall: one massive piece of typographic art dominates the dark hero, then the site steps down into compact, editorial information grids. The palette is ruthlessly achromatic — warm espresso black, bone white, and graphite — with no chromatic accent anywhere; all visual energy comes from type scale and contrast. Headlines run to 197px at weight 300 with aggressive negative tracking, while body copy stays at 16-18px, creating a 10:1 size ratio that makes the whole site feel like a single oversized poster surrounded by fine-print specifications. Layout is full-bleed with sections switching between warm-dark and white, and information always arranges into crisp multi-column grids separated by hairline graphite rules.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Espresso | `#1d1610` | `--color-espresso` | Hero and dark section background — warm-tinted near-black reads as architectural, not as raw #000, giving the oversized display type a gallery-wall feel |
| Graphite | `#282828` | `--color-graphite` | Primary body text, structural borders, section dividers — the workhorse neutral that draws the hairline rules and most interface lines |
| Slate | `#333333` | `--color-slate` | Secondary body and heading text — slightly lighter than Graphite, used for headings and emphasized body copy where Graphite is reserved for borders |
| Obsidian | `#000000` | `--color-obsidian` | Display headings on light sections and pure-black accents — used sparingly for maximum impact on the white About and Latest sections |
| Paper | `#ffffff` | `--color-paper` | Content section surfaces and inverted text on dark hero — the bright surface that the warm espresso sections cut against |
| Bone | `#fff5f2` | `--color-bone` | Warm off-white page canvas — subtle pink-ivory tint replaces plain white as the base, keeping the entire palette on the warm side of neutral |

## Tokens — Typography

### Inter — Primary body and UI text. The 18px body size with 1.78 line-height creates a generous, editorial reading rhythm that contrasts the compact, tight display type. The 0.89 line-height variant handles single-line labels and metadata where vertical density matters. · `--font-inter`
- **Substitute:** Inter (Google Fonts) or Söhne at 400
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.78 (body) → 0.89 (tight label)
- **Letter spacing:** normal
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** Primary body and UI text. The 18px body size with 1.78 line-height creates a generous, editorial reading rhythm that contrasts the compact, tight display type. The 0.89 line-height variant handles single-line labels and metadata where vertical density matters.

### wtqc — Signature display and heading face. The massive 197px/72px/28px scale at weight 300 with tight tracking (-0.033em → -0.014em) creates the poster-art identity. At 300 weight, headlines whisper rather than shout — authority through scale and restraint, not boldness. The lighter weight prevents the enormous letterforms from feeling heavy or aggressive. · `--font-wtqc`
- **Substitute:** Inter Tight at weight 300, or Söhne Breit at 300 as a free alternative
- **Weights:** 300, 400
- **Sizes:** 12px, 28px, 72px, 197px
- **Line height:** 1.00 (display) → 1.33 (caption)
- **Letter spacing:** -0.033em at 197px, -0.021em at 72px, -0.014em at 28px, -0.003em at 12px
- **OpenType features:** `default ligatures only`
- **Role:** Signature display and heading face. The massive 197px/72px/28px scale at weight 300 with tight tracking (-0.033em → -0.014em) creates the poster-art identity. At 300 weight, headlines whisper rather than shout — authority through scale and restraint, not boldness. The lighter weight prevents the enormous letterforms from feeling heavy or aggressive.

### System UI (-apple-system) — Tertiary fallback for cards, metadata blocks, and system-level UI that doesn't carry brand typographic weight · `--font-system-ui-apple-system`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **Role:** Tertiary fallback for cards, metadata blocks, and system-level UI that doesn't carry brand typographic weight

### -apple-system — -apple-system — detected in extracted data but not described by AI · `--font-apple-system`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** -apple-system — detected in extracted data but not described by AI

### Roboto — Roboto — detected in extracted data but not described by AI · `--font-roboto`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.33
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** Roboto — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.04px | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.78 | — | `--text-body` |
| subheading | 28px | 1.29 | -0.39px | `--text-subheading` |
| heading | 72px | 1.04 | -1.51px | `--text-heading` |
| display | 197px | 1 | -6.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 20px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Hero Display Block
**Role:** Full-bleed opening section carrying the signature oversized type

Espresso (#1d1610) full-viewport background, no padding constraints, text fills the width. Display text at 197px, weight 300, letter-spacing -6.5px, color Bone (#fff5f2) with secondary word fragments in Graphite (#282828) for internal contrast. A single small monochrome refresh icon (8-12px, Bone) sits in the top-right corner. No CTAs, no nav — the type IS the content.

### Section Mega-Header
**Role:** Section opener that repeats the poster-scale type on white

White or Bone surface, massive black or Graphite text at 72-120px, weight 300-400, tight tracking. Examples: "LATEST", "ABOUT" filling the left portion of the viewport. Acts as a visual reset between dark and light sections, re-establishing scale each time.

### Project Image Card
**Role:** Showcase tiles for case studies and design work

Full-bleed image container with 20px border-radius, no border, no shadow. Sits directly on Bone or Paper surface. Images carry their own color (design work, photography) — the chrome around them is invisible. Caption metadata in Inter 12px, Slate text, sits 8-16px below the image edge.

### Info Grid Row
**Role:** Multi-column structured data display (footer, contact, experience)

4-column grid on desktop, collapsing to 2 on mobile. Columns separated by hairline 1px Graphite (#282828) borders or generous whitespace (32-64px gutters). Column header in Inter 12-16px, weight 400, Slate color. Column content in Inter 16-18px, weight 400, Graphite color. Vertical padding 24-32px per row. Horizontal rules between rows are 1px Graphite at 50-80% opacity.

### Bio Statement Block
**Role:** Long-form introductory text on white sections

Single text column, max-width 800-900px, left-aligned. Inter 18px, weight 400, line-height 1.78, Graphite (#282828) color. No background, no border, sits directly on Paper or Bone. Arrow glyphs (↪) and em-dashes act as typographic punctuation between clauses.

### Experience Entry
**Role:** Compact career timeline item within the Info Grid

Three-line stack: date range (Inter 14-16px, Slate), role title (Inter 16-18px, Graphite, weight 400), employer (Inter 14-16px, Graphite). No bullets, no icons — pure typographic separation. 8-16px vertical gap between entries.

### Hairline Divider
**Role:** Section separator and row delimiter

1px solid Graphite (#282828) at full or near-full width. No color variation, no decorative treatment. The ONLY structural element that repeats throughout the site — it is the skeleton.

### External Link
**Role:** Outbound links to Instagram, LinkedIn, email, etc.

Inter 16-18px, weight 400, Graphite color. Inline text style — no underline by default, no button chrome. A trailing arrow glyph (↪ or ⤴) signals the link is external. A 1px bottom border in Graphite appears on hover.

### Refresh Icon Button
**Role:** Top-right utility icon on the dark hero

12-16px monochrome SVG icon in Bone (#fff5f2) on Espresso background. 1px hairline border, no fill, square corners (0px radius). Triggers a page/state refresh.

## Do's and Don'ts

### Do
- Use weight 300 at display sizes (72px+). The light weight on massive type is the identity — using 600+ kills the gallery-wall feel.
- Set letter-spacing at -0.033em or tighter for any text above 48px. Tight tracking is what makes the display type look like one continuous mark.
- Alternate between Espresso (#1d1610) full-bleed sections and Paper/Bone sections with no gradient transitions. Hard cuts only.
- Use 1px Graphite (#282828) rules as the primary structural element between rows and sections.
- Keep the palette strictly achromatic. No brand color, no accent, no hover tint — color in the work itself is the only chromatic element.
- Set body copy at 18px with 1.78 line-height. The generous reading rhythm balances the compressed display type.
- Maintain a 4-column grid for all structured information (contact, experience, portfolio meta). Consistency of grid is the layout signature.

### Don't
- Don't add a brand accent color. The system is monochrome by design — introducing a blue or red CTA breaks the editorial identity.
- Don't use border-radius above 0px on UI elements (buttons, cards, dividers, tags). The single 20px radius applies only to image containers. Sharp corners are the rule.
- Don't set display type above weight 400. The 300 weight whispers — bolding it turns a poster into a billboard.
- Don't use drop shadows, glows, or blur effects. Elevation is communicated through contrast (dark on light, light on dark) and the hairline border system, never through shadow.
- Don't add decorative gradients. The palette is flat — gradients introduce a visual register the system doesn't support.
- Don't set body text below 16px. The 18px body is paired with massive display type; shrinking body to 12-14px breaks the hierarchy rhythm.
- Don't add icons to body content, navigation, or section headers. The refresh icon in the hero is the only icon in the system — all other structure is pure typography.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#fff5f2` | Base page background — warm off-white tints the entire site away from clinical white |
| 1 | Paper Surface | `#ffffff` | Content cards, image containers, and structural sections that need to lift off the bone canvas |
| 2 | Espresso Field | `#1d1610` | Full-bleed dark hero and section breaks — the warm dark that carries the massive display type |
| 3 | Obsidian | `#000000` | Accent-only black, used for pure display headings on light sections |

## Elevation

No shadows anywhere. Elevation is expressed exclusively through surface color contrast (Espresso on Bone, Paper on Espresso) and 1px hairline borders. This is a deliberate flat-design choice that keeps every element on the same physical plane, letting type scale do all the depth work.

## Imagery

The site itself is image-free as a design system — it contains no decorative photography, no illustrations, no product mockups, no abstract graphics. Imagery appears only as content (project showcases, case study images) with no consistent photographic treatment: crops are full-bleed or near-full-bleed inside 20px-radius containers, often at extreme angles. The 'visual language' of the chrome is purely typographic.

## Layout

Full-bleed sections alternating between warm-dark and warm-light. The dark hero (Espresso) occupies 80-100vh with text left-aligned, overflowing the right edge — type breaks the viewport intentionally. White content sections are contained to ~1200px max-width, centered, with 4-column grids for structured information and single-column text blocks for prose. Section rhythm: dark hero → light work showcase → light about/contact → dark footer repeat. Navigation is absent or minimal (just the refresh icon). Vertical gaps between sections are 80-120px; within sections, 8-16px. The layout reads top-to-bottom as a sequence of poster-art moments connected by fine-print specification blocks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #282828 (Graphite)
- background: #fff5f2 (Bone canvas) or #1d1610 (Espresso dark)
- border: #282828 (Graphite, 1px)
- display heading: #000000 (Obsidian) on light, #fff5f2 (Bone) on dark
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Create a full-bleed dark hero section:* Background #1d1610, no max-width. Display text 'P-2026.DA' at 197px, font-family 'wtqc' (substitute: Inter Tight), weight 300, line-height 1.0, letter-spacing -6.5px, color #fff5f2. The first and last fragments ('P-' and '.DA') in #282828 for internal contrast. A 12px monochrome refresh icon in #fff5f2 sits at top-right with a 1px #fff5f2 border, 0px radius.

2. *Create a section mega-header:* Background #ffffff, left-aligned text 'LATEST' at 120px, weight 300, letter-spacing -4px, color #000000. No underline, no border, no padding above — sits flush at section top.

3. *Create a 4-column info grid row:* Background #fff5f2, 4 equal columns with 32px gutters. Each column: header label in Inter 12px weight 400 #333333, body text in Inter 16px weight 400 #282828. Rows separated by 1px #282828 horizontal rules at 60% opacity. 24px vertical padding per row.

4. *Create a project image card:* Image fills container, 20px border-radius, no border, no shadow. Caption below: Inter 14px #333333, 12px gap between image edge and text.

5. *Create a bio statement block:* Max-width 900px, left-aligned, Inter 18px weight 400 line-height 1.78 #282828 on #ffffff background. Arrow glyphs (↪) between clauses. No border, no padding beyond the text block itself.

## Typographic Scale Philosophy

The system operates on a brutalist size ratio: display text is 10-12x body text. This is not a typical SaaS 1.25 modular scale — it is a two-register system (poster + fine print). Any new component must choose which register it belongs to. Section headers above 48px live in the poster register (weight 300, tight tracking). Everything below 24px lives in the fine-print register (weight 400, normal tracking). There is no middle ground. Components that try to bridge both (e.g. 32px headings at weight 500) will look orphaned.

## Similar Brands

- **Bureau Cool** — Same editorial portfolio approach with oversized display type on monochrome backgrounds and structured multi-column info grids
- **Pentagram partner sites** — Same gallery-wall aesthetic with poster-scale typography filling the viewport and compact biographical grids below
- **Rauno Freiberg (raunofreiberg.com)** — Same minimalist portfolio language with extreme type scale contrast and zero chromatic accent
- **Manual (manual.co)** — Same warm-tinted dark backgrounds and achromatic palette with light-weight oversized display headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-espresso: #1d1610;
  --color-graphite: #282828;
  --color-slate: #333333;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-bone: #fff5f2;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wtqc: 'wtqc', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-apple-system: 'System UI (-apple-system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.04px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.78;
  --text-subheading: 28px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.39px;
  --text-heading: 72px;
  --leading-heading: 1.04;
  --tracking-heading: -1.51px;
  --text-display: 197px;
  --leading-display: 1;
  --tracking-display: -6.5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 20px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #fff5f2;
  --surface-paper-surface: #ffffff;
  --surface-espresso-field: #1d1610;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-espresso: #1d1610;
  --color-graphite: #282828;
  --color-slate: #333333;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-bone: #fff5f2;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wtqc: 'wtqc', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-apple-system: 'System UI (-apple-system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.04px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.78;
  --text-subheading: 28px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.39px;
  --text-heading: 72px;
  --leading-heading: 1.04;
  --tracking-heading: -1.51px;
  --text-display: 197px;
  --leading-display: 1;
  --tracking-display: -6.5px;

  /* Spacing */

  /* Border Radius */
  --radius-2xl: 20px;
}
```
