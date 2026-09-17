# Aplós — Style Reference
> Old-world apothecary at dusk

**Theme:** light

Aplós is an old-world apothecary rendered in warm monochrome: bone-white canvas, deep cocoa accents, and a single editorial serif (Goudy Old Style) that does the work a sans-serif system normally would. The page rhythm is slow and confident — dramatic dark hero slabs, generous cream sections, and tightly spaced type that reads more like a printed cocktail menu than a DTC storefront. The product itself is always the visual hero; the interface stays out of the way with minimal borders, one shared 5px radius, and almost no chromatic accent. Color appears only as tonal shift: bone → white → cocoa → ink, never as decorative hue.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f2f1ed` | `--color-bone` | Page background, large section canvases — the warm off-white that gives the system its paper-like editorial feel |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, light benefit cards — sits one step above Bone to create lift without shadows |
| Cocoa | `#3b3429` | `--color-cocoa` | Dark accent cards, inverted text blocks — warm near-black that softens pure ink and keeps dark sections feeling organic rather than digital |
| Ink | `#000000` | `--color-ink` | Primary text, nav links, logo wordmark, hairline borders, hero backdrop |
| Stone | `#646464` | `--color-stone` | Secondary body copy, muted helper text, subdued descriptions |
| Ash | `#b4aeac` | `--color-ash` | Subtle link hover shadows, barely-there elevation hints |

## Tokens — Typography

### Goudy Old Style — Sole typeface for headlines, section titles, product names, card titles, and editorial body — a classical Venetian serif that signals craft and heritage. The narrow weight range (400 only) and tight line-heights (1.05–1.08) let the type sit in dense, menu-like stacks. Letter-spacing of -0.012em tightens optical gaps in display sizes without losing the serif's elegance. · `--font-goudy-old-style`
- **Substitute:** Cormorant Garamond, EB Garamond, Playfair Display
- **Weights:** 400
- **Sizes:** 26px, 40px
- **Line height:** 1.05–1.08
- **Letter spacing:** -0.012em
- **OpenType features:** `"liga" on, "kern" on`
- **Role:** Sole typeface for headlines, section titles, product names, card titles, and editorial body — a classical Venetian serif that signals craft and heritage. The narrow weight range (400 only) and tight line-heights (1.05–1.08) let the type sit in dense, menu-like stacks. Letter-spacing of -0.012em tightens optical gaps in display sizes without losing the serif's elegance.

### System Sans (UI chrome) — Inferred secondary face for navigation, buttons, captions, and dense utility text where serif would be illegible at small sizes. Kept restrained so the serif remains dominant. · `--font-system-sans-ui-chrome`
- **Substitute:** Inter, system-ui, -apple-system, Helvetica Neue
- **Weights:** 400–500
- **Sizes:** 
- **Line height:** 1.4–1.5
- **Role:** Inferred secondary face for navigation, buttons, captions, and dense utility text where serif would be illegible at small sizes. Kept restrained so the serif remains dominant.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | -0.2px | `--text-subheading` |
| heading-sm | 26px | 1.08 | -0.31px | `--text-heading-sm` |
| heading | 40px | 1.05 | -0.48px | `--text-heading` |
| display | 56px | 1.05 | -0.67px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 5px |
| cards | 5px |
| inputs | 5px |
| buttons | 5px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96-120px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Announcement Bar
**Role:** Top utility strip

Full-width white (#ffffff) bar, 1px bottom border in #e5e3df. Single line of small sans-serif text (12–14px) centered in #000000. Fixed height ~40px.

### Primary Navigation
**Role:** Site header with logo + nav links

White background, logo wordmark 'APLŌS' in Goudy Old Style 26px #000000 left-aligned. Nav links (Shop, Recipes, Journal, Store Locator, Cart) right-aligned in sans-serif 14px #000000. Generous horizontal padding (24px+), height ~72px.

### Dark Hero Section
**Role:** Full-bleed editorial hero

Pure black (#000000) background, full viewport width. Headline in Goudy Old Style 40–56px white, left-aligned, sitting beside or overlapping large product photography (can + cocktail glass). No gradient, no decoration — just type and image in negative space.

### Outlined CTA Button (Light)
**Role:** Primary action on dark hero

White background, no border or 1px border in #ffffff, 5px radius. Sans-serif text 14px, weight 500, #000000. Padding 9px 12px. Compact pill proportion.

### Ghost Text Link
**Role:** Secondary action (Learn More, Shop Now)

No background, no border. Sans-serif 14px, #000000, text-decoration: underline on hover only. Sits centered below content blocks.

### Benefits Section Heading
**Role:** Editorial section title

Centered Goudy Old Style 40px #000000, letter-spacing -0.48px, line-height 1.05. Small body paragraph below in sans-serif 14–16px #646464, max-width ~600px, centered.

### Benefit Card (Light)
**Role:** Standard feature card

White (#ffffff) surface on Bone (#f2f1ed) canvas. 1px border in #e5e3df. 5px radius. 24px internal padding. Goudy Old Style heading 20–26px #000000 at top, small Stone (#646464) sans-serif number ('01', '02') positioned in corner or below.

### Benefit Card (Dark / Cocoa)
**Role:** High-contrast accent card

Cocoa (#3b3429) surface, 5px radius, 24px internal padding. Goudy Old Style heading 20–26px #ffffff. Optional small white descriptive text in sans-serif 14px. No border — the dark fill is the contrast.

### Product Collection Card
**Role:** Featured product showcase

Overlapping composition: large product image (bottle/can) bleeds across full card width, ~60–70% card height. White (#ffffff) text panel overlays the lower-left with Goudy Old Style product name 26px #000000 and sans-serif description 14px #646464. No visible card border — image and text panel merge.

### Section Divider Spacer
**Role:** Vertical rhythm control

No visible line. Pure whitespace of 96–120px between major sections, creating the slow editorial pace.

## Do's and Don'ts

### Do
- Set all section backgrounds to Bone (#f2f1ed); reserve pure white only for card surfaces that need lift.
- Use Goudy Old Style at 26px and 40px with letter-spacing -0.012em for every heading and product name — the serif IS the brand.
- Anchor all CTAs to 5px radius with 9px 12px padding; never round buttons to pill or full-circle.
- Place 96–120px of vertical whitespace between major sections to maintain the printed-menu cadence.
- Use Cocoa (#3b3429) for inverted accent cards to add tonal variety — never introduce chromatic color where grayscale shift can do the work.
- Keep hero photography full-bleed on Ink (#000000) with white serif headlines; the contrast does the dramatization.
- Set secondary body copy in Stone (#646464) at 14–16px sans-serif, never in the serif at small sizes.

### Don't
- Don't introduce any chromatic color (blue, green, red, etc.) — the system is deliberately 0% colorful and any hue will break the apothecary language.
- Don't use large border-radius (12px+) or pill shapes — the 5px radius is non-negotiable and keeps the system feeling editorial, not app-like.
- Don't use bold weights (600+) for headings — Goudy Old Style 400 only; the whisper-weight serif is the signature.
- Don't add drop shadows, glows, or gradient overlays — elevation comes from tonal contrast between Bone, Paper, and Cocoa, not from blur effects.
- Don't use a sans-serif for product names or section titles — those are exclusively Goudy Old Style domain.
- Don't crowd sections with dense grids — the rhythm depends on 96–120px breathing room between blocks.
- Don't place dark text directly on Cocoa (#3b3429) without testing contrast — use white (#ffffff) text on Cocoa surfaces.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone | `#f2f1ed` | Page-level canvas, most section backgrounds |
| 1 | Paper White | `#ffffff` | Card surfaces, product panels, light benefit cards |
| 2 | Cocoa | `#3b3429` | Inverted accent cards, dark feature blocks |
| 3 | Ink | `#000000` | Hero backdrop, footer, maximum contrast slabs |

## Elevation

The system deliberately avoids drop shadows and blur effects. Elevation is communicated entirely through tonal layering: Bone canvas → Paper White cards → Cocoa accent cards → Ink hero slabs. The only shadow token (#b4aeac) is a barely-perceptible link hover state, never used for component lift.

## Imagery

Product photography is the dominant visual element — tightly cropped cans, bottles, and styled cocktail glassware on pure black. No lifestyle, no people, no contextual environments: the object IS the hero. Photography is high-contrast, studio-lit, and occupies 60–80% of hero and product card real estate. No illustrations, no icons beyond minimal UI chrome, no decorative graphics. Color treatment is natural (sage green can, pale yellow cocktail liquid) but always grounded against black backgrounds so the warmth feels intentional rather than incidental.

## Layout

Max-width 1200px centered content with full-bleed dark hero and alternating section bands. The hero is a full-viewport dark slab with large product photography and left-aligned serif headline. Below, the page shifts to a Bone (#f2f1ed) canvas hosting a centered 'Benefits' section: serif heading, body paragraph, then a 3-column card grid mixing one Cocoa card and two Paper White cards. The grid is symmetric and equal-width. Subsequent sections follow the pattern: centered serif heading → 1–2 column product showcases with overlapping image+text panels. Navigation is a simple top bar (not sticky, not mega-menu) with logo left and 4–5 text links right. Footer follows in dark Ink. Vertical rhythm is very slow — 96–120px between sections — creating a gallery-like scroll rather than a dense commerce page.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #f2f1ed (Bone)
- Surface: #ffffff (Paper White)
- Text: #000000 (Ink)
- Secondary text: #646464 (Stone)
- Accent surface: #3b3429 (Cocoa)
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Benefits Section**: Bone (#f2f1ed) background. Centered Goudy Old Style heading 40px #000000, letter-spacing -0.48px. Below, sans-serif paragraph 16px #646464, max-width 600px, centered. 3-column card grid below with 24px gaps.

3. **Cocoa Accent Card**: #3b3429 background, 5px radius, 24px padding. Goudy Old Style title 26px #ffffff at top-left, letter-spacing -0.31px. Small sans-serif number '01' in 14px #ffffff positioned bottom-left.

4. **Light Benefit Card**: #ffffff background, 1px border #e5e3df, 5px radius, 24px padding. Goudy Old Style title 26px #000000 top-left, small sans-serif number '02' in 14px #646464 bottom-left.

5. **Product Collection Card**: Large product image (bottle crop) occupying top 65% of card, edge-to-edge with no border-radius on image. Overlapping white text panel at lower-left: Goudy Old Style product name 26px #000000, sans-serif description 14px #646464 below, no panel background — text floats on the image.

## Typographic Discipline

The entire visual identity hinges on restraint with Goudy Old Style. Only weight 400 is used; no italic, no bold. Letter-spacing is a near-imperceptible -0.012em across all sizes — enough to tighten optical gaps in display type without making the serif feel mechanical. Line-heights of 1.05–1.08 on headings let lines stack almost touching, mimicking engraved menu typography. Body and UI text defers to a quiet sans-serif to avoid serif fatigue at small sizes.

## Tonal Layering System

With zero chromatic color, depth is built entirely from four neutral surfaces in a fixed hierarchy: Bone (#f2f1ed) → Paper White (#ffffff) → Cocoa (#3b3429) → Ink (#000000). Each step increases contrast and visual weight. New components should always be assigned a position in this stack — never invent new grays. The 0% colorfulness is a feature, not a limitation; it forces hierarchy through value, not hue.

## Similar Brands

- **Chamberlain Coffee** — Same warm cream (#f2f1ed-style) canvas, serif-forward editorial type, and monochrome product photography approach
- **Ghia** — Non-alcoholic apothecary positioning with botanical product shots, serif headlines, and a restrained warm-neutral palette
- **Olipop** — Editorial commerce layout with large product imagery, centered serif section titles, and generous section breathing room
- **Augustinus Bader** — Luxury wellness brand language: cream canvas, deep near-black accent blocks, classical serif typography, and product-as-art photography
- **Theopiq / Kin Euphorics** — Non-alcoholic spirit category neighbor with dark hero slabs, serif wordmarks, and monochrome-tonal product pages

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f2f1ed;
  --color-paper-white: #ffffff;
  --color-cocoa: #3b3429;
  --color-ink: #000000;
  --color-stone: #646464;
  --color-ash: #b4aeac;

  /* Typography — Font Families */
  --font-goudy-old-style: 'Goudy Old Style', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-ui-chrome: 'System Sans (UI chrome)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.08;
  --tracking-heading-sm: -0.31px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: -0.48px;
  --text-display: 56px;
  --leading-display: 1.05;
  --tracking-display: -0.67px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96-120px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 5px;

  /* Named Radii */
  --radius-tags: 5px;
  --radius-cards: 5px;
  --radius-inputs: 5px;
  --radius-buttons: 5px;

  /* Surfaces */
  --surface-bone: #f2f1ed;
  --surface-paper-white: #ffffff;
  --surface-cocoa: #3b3429;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f2f1ed;
  --color-paper-white: #ffffff;
  --color-cocoa: #3b3429;
  --color-ink: #000000;
  --color-stone: #646464;
  --color-ash: #b4aeac;

  /* Typography */
  --font-goudy-old-style: 'Goudy Old Style', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-ui-chrome: 'System Sans (UI chrome)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.08;
  --tracking-heading-sm: -0.31px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: -0.48px;
  --text-display: 56px;
  --leading-display: 1.05;
  --tracking-display: -0.67px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 5px;
}
```
