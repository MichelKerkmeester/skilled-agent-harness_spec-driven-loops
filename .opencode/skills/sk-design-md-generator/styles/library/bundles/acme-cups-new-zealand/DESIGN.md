# Acme Cups New Zealand — Style Reference
> editorial ceramics gallery. A stark white-walled room with a single massive black headline and quiet gray dividers, where handmade cups in terracotta, forest, and teal are the only vivid things visible.

**Theme:** light

Acme's interface is a deliberately austere stage: a near-monochrome gallery wall of concrete gray and hairline black, where the only color in the room comes from the ceramic products themselves. The 148px Helvetica Neue wordmark and all-caps uppercase labels behave like a magazine cover or museum catalog rather than a typical storefront. Structural separation is done with 1px borders rather than shadows, every corner sits at 3px, and product photography does the emotional work that color, gradients, and illustration would otherwise do. The result reads as editorial, architectural, and confident — restraint as a design statement.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, all structural borders, logo wordmark, button outlines — the load-bearing color of the entire system |
| Gallery White | `#fefefe` | `--color-gallery-white` | Card surfaces, product photography backgrounds, badge fills, hero overlay text color |
| Concrete Canvas | `#e3e2e2` | `--color-concrete-canvas` | Dominant page background — the warm-tinted gray that sets the gallery-like stage for every section |
| Ash Border | `#c3c3c3` | `--color-ash-border` | Card borders, badge outlines, subtle dividers — secondary structure below the black hairline |
| Steel Mute | `#aeaaaa` | `--color-steel-mute` | Secondary text, muted button borders, caption-level borders where black feels too heavy |
| Pewter Caption | `#666666` | `--color-pewter-caption` | Badge and tag text — the only readable gray for small uppercase labels |
| Terracotta Alert | `#9b1b01` | `--color-terracotta-alert` | Input validation error borders, error state signals — the single chromatic UI color, echoing the product terracotta |

## Tokens — Typography

### Helvetica Neue — Sole typeface across the entire interface. Weight 700 is reserved for the ACME wordmark and bold display headlines; 500 for product names and emphasis; 400 for all body, nav, and caption copy. The 148px wordmark is the system's signature — no other brand does this with a system font at this scale. · `--font-helvetica-neue`
- **Substitute:** Inter, Arial, Helvetica
- **Weights:** 400, 500, 700
- **Sizes:** 10, 12, 13, 14, 15, 16, 20, 21, 26, 30, 48, 148px
- **Line height:** 1.00, 1.04, 1.15, 1.20, 1.30, 1.40, 1.43
- **Letter spacing:** -0.009em at display sizes (30px+), +0.015em to +0.020em at 10-13px uppercase UI labels
- **OpenType features:** `"kern" 0, "liga" 0`
- **Role:** Sole typeface across the entire interface. Weight 700 is reserved for the ACME wordmark and bold display headlines; 500 for product names and emphasis; 400 for all body, nav, and caption copy. The 148px wordmark is the system's signature — no other brand does this with a system font at this scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 0.2px | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| heading-sm | 20px | 1.3 | — | `--text-heading-sm` |
| heading | 26px | 1.2 | -0.23px | `--text-heading` |
| heading-lg | 30px | 1.15 | -0.27px | `--text-heading-lg` |
| display | 48px | 1.04 | -0.43px | `--text-display` |
| wordmark | 148px | 1 | -1.33px | `--text-wordmark` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 72 | 72px | `--spacing-72` |
| 76 | 76px | `--spacing-76` |
| 104 | 104px | `--spacing-104` |
| 120 | 120px | `--spacing-120` |
| 124 | 124px | `--spacing-124` |
| 148 | 148px | `--spacing-148` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 3px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### ACME Wordmark
**Role:** Brand identity anchor displayed in hero, sidebar, and footer

Helvetica Neue weight 700, 148px, line-height 1.00, letter-spacing -0.009em (-1.33px), color #ffffff on dark hero, #000000 on light sections. Always uppercase, never altered.

### Top Navigation Bar
**Role:** Primary site navigation

Full-width bar, #e3e2e2 background, 1px bottom border in #c3c3c3. Left cluster: SHOP, JOURNAL, ABOUT, CONTACT in 12-13px uppercase weight 500, letter-spacing +0.015em, #000000. Right cluster: NZD selector, SEARCH, ACCOUNT, CART [0] — same style. Vertical padding ~12-16px.

### Ghost Button with Arrow
**Role:** Primary and secondary call-to-action

Transparent or #fefefe fill, 1px solid #000000 border, 3px radius, padding 7-9px vertical × 12-16px horizontal. Label in 12-13px uppercase weight 500 with +0.015em tracking, followed by a "→" arrow character. No fill state, no shadow — the border IS the button.

### Product Card
**Role:** Individual product tile in range grids and collection pages

1px border in #c3c3c3, 3px radius, no shadow. Product name (e.g. "ROMAN CUP MINI") at 13px weight 700 uppercase, #000000. Variant line (e.g. "Kōkako 002") at 12px weight 400. Volume (e.g. "110ml") at 11-12px weight 400. Product image fills the lower portion on #fefefe background.

### Product Range Grid
**Role:** Container for grouped product variants within a collection

4-column grid with 3px column-gap and row-gap. Each cell is a Product Card. 1px black border wraps the entire grid container. Section header sits above with range name in 26-30px weight 700 uppercase and item count in brackets.

### Sidebar Category List
**Role:** Left-rail navigation for collection filtering

Vertical stack of category names (ROMAN, UNION, BIBBY, BOBBY, TAJIMI) in 20-26px weight 700 uppercase #000000. Active category is not visually distinguished beyond default state — the structure relies on the ACME wordmark sitting above the list as the constant anchor.

### Filter Tag / Pill
**Role:** Metadata tags for product attributes (e.g. "Great for Espresso")

Inline rectangular tag with 1px border in #c3c3c3 or #aeaaaa, 3px radius, padding 2-4px × 8-10px. Label in 11-12px uppercase weight 400 #000000, letter-spacing +0.020em.

### Carousel Arrow Control
**Role:** Horizontal scroll controls for product range and image carousels

Square button ~32-40px, 1px solid #000000 border, 3px radius, transparent fill. Contains only a "←" or "→" glyph at 16-20px weight 400. Often paired with a text label button (e.g. "SHOP COLLECTION") in the same row.

### Hero Text Overlay
**Role:** Tagline and CTA layered over the full-bleed dark product photograph

Right-aligned text block, 20-26px weight 400 #fefefe, line-height 1.30, letter-spacing -0.009em. CTA below is a Ghost Button with white fill, #000000 border, #000000 text. Headline "ACME" at 148px sits left-aligned in #fefefe.

### Section Header with Count
**Role:** Section title with item count and right-aligned carousel controls

Left: range name in 26-30px weight 700 uppercase #000000, followed by item count in brackets at smaller size (e.g. "[15]"). Right: ghost button + carousel arrows. A 1px black border separates the header from the grid below.

### Editorial Body Block
**Role:** Multi-column descriptive text on the About and collection pages

Two-column body text layout. Left column: large 20-26px sentence-case headline ("Born from a long-standing ambition…"). Right column: smaller 14-16px body copy in two stacked paragraphs. Generous 40-64px vertical spacing between blocks.

### Outlined Input
**Role:** Form fields for search, contact, and account

1px solid #c3c3c3 border, 3px radius, padding 9-12px, 14px weight 400 text. On focus, border shifts to #000000. Error state border: 1px solid #9b1b01. No fill, no shadow.

### Count Badge
**Role:** Cart count and small status indicators

Inline text "[0]" or "[15]" in 11-12px weight 500, #000000 on #fefefe, with a 1px #c3c3c3 border, 3px radius. No filled badge variants — the count is typographic, not chromatically marked.

## Do's and Don'ts

### Do
- Set every border-radius in the system to 3px — buttons, cards, inputs, tags, badges. This tight radius is a defining choice.
- Use 1px solid #000000 for primary structural borders and 1px solid #c3c3c3 for secondary/decorative borders. Never use shadows for separation.
- Apply uppercase letters with +0.015em to +0.020em tracking for all UI labels under 14px (nav, buttons, badges, tags).
- Keep the entire interface achromatic — #000000, #fefefe, #e3e2e2, #c3c3c3, #aeaaaa, #666666. Product photography is the only color source.
- Use the ACME wordmark at 148px weight 700 as the system's display moment — never set it below 48px or change the weight.
- Use "→" appended to button labels (e.g. "SHOP NOW →") as the universal interactive cue. No separate arrow icons.
- Place product images on #fefefe surfaces with generous whitespace, framed by a 1px border. The product is the hero, the card is just a frame.

### Don't
- Don't add drop shadows, inner shadows, glows, or any elevation effects — the design is intentionally flat.
- Don't introduce accent colors, brand hues, or gradients. The single chromatic UI color is the #9b1b01 error border; everything else is grayscale.
- Don't use border-radius larger than 3px. Rounded, pill, or large-radius shapes break the architectural system.
- Don't use sentence case in navigation, buttons, badges, product names, or category labels — always uppercase.
- Don't use anything other than Helvetica Neue (or system fallback) for the interface. No display fonts, no serif, no script.
- Don't center-align body text or long-form copy — left alignment reinforces the editorial/monograph rhythm.
- Don't use icons other than the "→" and "←" arrow glyphs. No social icons, no decorative iconography, no filled icon sets.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Concrete Canvas | `#e3e2e2` | Page background — the dominant warm gray field |
| 2 | Gallery White | `#fefefe` | Card and product tile surface — the clean stage for product photography |
| 3 | Soft Mist | `#eceeee` | Subtle surface variation for nested containers |

## Elevation

The design is deliberately shadowless. All structural separation is achieved through 1px hairline borders in #000000 or #c3c3c3. No drop shadows, no glows, no inner shadows. This flatness reinforces the editorial/museum-catalog feel — the product photography is the only thing that "lifts" off the page.

## Imagery

Full-bleed product photography is the only source of color and visual warmth in the system. Hero images are dark, moody, editorial — hands clinking colorful ceramic cups, tight product crops on near-black stages. Collection-page product images sit on pure white, centered with generous negative space. No illustration, no iconography beyond a single "→" arrow glyph, no decorative graphics. Photography treatment: natural light, no color grading overlays, subject-isolated compositions. The ceramic product palette (terracotta, forest green, teal, matte white) is the only place chromatic color appears in the entire experience.

## Layout

Full-bleed hero with overlaid text; below the fold, content sits in a max-width ~1440px container on a #e3e2e2 canvas. The dominant pattern is a three-column layout: left sidebar (ACME wordmark stacked vertically + category list), center content (editorial text blocks, product range headers, carousels), right utility column (descriptive text or filter tags). Product grids are 4-column with consistent 3px gutters. Section rhythm is defined by 1px black or ash borders rather than background color changes — the page stays in one warm gray the entire time, with the only color shift being the dark photographic hero. Navigation is a single sticky top bar; no sidebar menus, no mega-menus, no modals visible in primary flows.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background (page canvas): #e3e2e2
- background (card/surface): #fefefe
- border (primary): #000000
- border (secondary): #c3c3c3
- muted text: #aeaaaa
- error/input border: #9b1b01
- primary action: #000000 (filled action)

**3-5 Example Component Prompts**

1. **Hero section:** Full-bleed dark product photograph as background. Left-aligned ACME wordmark at 148px Helvetica Neue weight 700, color #fefefe, letter-spacing -1.33px, line-height 1.00. Right-aligned tagline block at 20px weight 400 #fefefe, line-height 1.30. Ghost button below: 3px radius, 1px #000000 border, #fefefe fill, 12px uppercase weight 500 label "SHOP NOW →", padding 9px 16px.

2. **Product range section:** #e3e2e2 page background. Section header "ROMAN RANGE [15]" at 30px weight 700 uppercase #000000, letter-spacing -0.27px. Right-aligned ghost button "SHOP COLLECTION →" with carousel arrow controls. 1px #000000 border separates header from grid. 4-column product grid with 3px gaps.

3. **Product card:** 1px #c3c3c3 border, 3px radius, no shadow. Product name "ROMAN CUP MINI" at 13px weight 700 uppercase #000000. Variant line "Kōkako 002" at 12px weight 400 #000000. Volume "110ml" at 11px weight 400 #aeaaaa. Product image fills lower 60% on #fefefe.

4. **Filter tag:** Inline pill with 1px #c3c3c3 border, 3px radius, padding 2px 8px. Label "Espresso" in 11px uppercase weight 400 #000000, letter-spacing 0.22px. Multiple tags can sit inline with 4-6px gap.

5. **Sidebar category nav:** Left column, vertical stack. ACME wordmark at 26-30px weight 700 #000000 at top. Below: category list (ROMAN, UNION, BIBBY, BOBBY, TAJIMI) in 20px weight 700 uppercase #000000, 8-12px vertical spacing between items. No active-state highlight — relies on page context to show current.

## Similar Brands

- **Sttoke** — Same monochrome product-first approach with achromatic UI and tight typographic hierarchy letting product photography carry color
- **Fellow Products** — Editorial product presentation with restrained gray UI, large uppercase headlines, and border-driven structure over shadows
- **Maison Balzac** — Gallery-like ceramics/homeware presentation with full-bleed photography, minimal chrome, and uppercase editorial typography
- **Mud Australia** — Achromatic product grid with bordered cards, sans-serif uppercase labels, and product color as the only chromatic element
- **Aesop** — Same editorial restraint with typographic wordmark, hairline borders, and product imagery providing the only color narrative

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-gallery-white: #fefefe;
  --color-concrete-canvas: #e3e2e2;
  --color-ash-border: #c3c3c3;
  --color-steel-mute: #aeaaaa;
  --color-pewter-caption: #666666;
  --color-terracotta-alert: #9b1b01;

  /* Typography — Font Families */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.2px;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: -0.23px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.27px;
  --text-display: 48px;
  --leading-display: 1.04;
  --tracking-display: -0.43px;
  --text-wordmark: 148px;
  --leading-wordmark: 1;
  --tracking-wordmark: -1.33px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-72: 72px;
  --spacing-76: 76px;
  --spacing-104: 104px;
  --spacing-120: 120px;
  --spacing-124: 124px;
  --spacing-148: 148px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-all: 3px;

  /* Surfaces */
  --surface-concrete-canvas: #e3e2e2;
  --surface-gallery-white: #fefefe;
  --surface-soft-mist: #eceeee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-gallery-white: #fefefe;
  --color-concrete-canvas: #e3e2e2;
  --color-ash-border: #c3c3c3;
  --color-steel-mute: #aeaaaa;
  --color-pewter-caption: #666666;
  --color-terracotta-alert: #9b1b01;

  /* Typography */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.2px;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: -0.23px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.27px;
  --text-display: 48px;
  --leading-display: 1.04;
  --tracking-display: -0.43px;
  --text-wordmark: 148px;
  --leading-wordmark: 1;
  --tracking-wordmark: -1.33px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-72: 72px;
  --spacing-76: 76px;
  --spacing-104: 104px;
  --spacing-120: 120px;
  --spacing-124: 124px;
  --spacing-148: 148px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-sm: 3px;
}
```
