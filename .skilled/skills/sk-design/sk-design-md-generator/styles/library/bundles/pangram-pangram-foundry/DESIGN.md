# Pangram Pangram Foundry — Style Reference
> Museum vitrine on white marble. A gallery-style type foundry where the canvas is bare stone, the lighting is flat daylight, and the only vivid color is a single orange-red label used by a curator to flag what is new.

**Theme:** light

Pangram Pangram Foundry is a type foundry that lets the typefaces speak: an editorial canvas of near-pure grayscale, with one saturated orange-red acting as a hot accent. Hero sections are full-bleed photographic plates with massive display type overlaid in white — the type IS the product, so the UI recedes. Surfaces stay quiet (#fafafa and #ededed), borders are hairline black at 1px, and the only chromatic punctuation is the single #ff2f00 accent used for status badges, icons, and tag chrome. Components are lightweight: pill-shaped controls, ghost buttons, soft card containers, and almost no elevation. The overall effect is a curatorial print catalogue translated to screen — restrained, confident, type-first.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff2f00` | `--color-ember-orange` | Orange action color for filled buttons, selected navigation states, and focused conversion moments. |
| Marble White | `#fafafa` | `--color-marble-white` | Page canvas, card surfaces, input fields, default panel backgrounds. The dominant surface tone, barely off-white for warmth |
| Stone Gray | `#ededed` | `--color-stone-gray` | Secondary surface for filled buttons, muted card backgrounds, image placeholder fills. One step deeper than Marble White to create gentle separation without contrast |
| Graphite | `#666666` | `--color-graphite` | Secondary text, link color, subdued metadata, helper text. Reads as muted black — never used for primary text or headings |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, all headings, hairline borders (cards, lists, badges, inputs), icons, navigation. The structural backbone — 1px borders everywhere define the system |
| Signal Yellow | `#ffb700` | `--color-signal-yellow` | Yellow state accent for badges, validation surfaces, and short status labels. |
| Ice Blue | `#bfe0ff` | `--color-ice-blue` | Blue state accent for badges, validation surfaces, and short status labels. |

## Tokens — Typography

### Neue Montreal — The workhorse and display face. Weight 400 for body, weight 530 for subheads and medium emphasis, weight 600 for headings and display overlays. Used at 145px for hero type, 48px for section headlines, 18-20px for body, 14px for navigation, 12px for badges. The type IS the product — this single family carries the entire brand voice. · `--font-neue-montreal`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk Display Pro
- **Weights:** 400, 530, 600
- **Sizes:** 12, 14, 16, 18, 20, 22, 24, 36, 48, 121, 145
- **Line height:** 1.00, 1.10, 1.17, 1.20, 1.30
- **Role:** The workhorse and display face. Weight 400 for body, weight 530 for subheads and medium emphasis, weight 600 for headings and display overlays. Used at 145px for hero type, 48px for section headlines, 18-20px for body, 14px for navigation, 12px for badges. The type IS the product — this single family carries the entire brand voice.

### Neue Montreal Semibold — Heavy display variant used for the largest typographic moments in specimen cards. Tighter, more compressed than standard weight 600. · `--font-neue-montreal-semibold`
- **Substitute:** Inter Tight Bold
- **Weights:** 600
- **Sizes:** 103, 121
- **Line height:** 1.00
- **Role:** Heavy display variant used for the largest typographic moments in specimen cards. Tighter, more compressed than standard weight 600.

### Neue York — Companion serif/contrast face shown in specimen contexts. The 700 weight provides a sharp counterpoint to the geometric Montreal. · `--font-neue-york`
- **Weights:** 400, 700
- **Sizes:** 103, 121
- **Line height:** 1.00
- **Role:** Companion serif/contrast face shown in specimen contexts. The 700 weight provides a sharp counterpoint to the geometric Montreal.

### Frama Semibold — Specimen showcase weight — displayed at exact 103px in the grid to demonstrate each family's character at scale. · `--font-frama-semibold`
- **Weights:** 580
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase weight — displayed at exact 103px in the grid to demonstrate each family's character at scale.

### Kyoto Semibold — Specimen showcase — fixed 103px display size in the font grid. · `--font-kyoto-semibold`
- **Weights:** 600
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### Neue Gstaad Bold — Specimen showcase — fixed 103px display size in the font grid. · `--font-neue-gstaad-bold`
- **Weights:** 700
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### Palma Fizzy Heavy — Specimen showcase — fixed 103px display size in the font grid. · `--font-palma-fizzy-heavy`
- **Weights:** 800
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### Mori Bold — Specimen showcase — fixed 103px display size in the font grid. · `--font-mori-bold`
- **Weights:** 700
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### Museum Light — Specimen showcase — the 300 weight in the grid is deliberately whisper-light, making weight 300 headlines read as anti-convention: authority through restraint rather than volume. · `--font-museum-light`
- **Weights:** 300
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — the 300 weight in the grid is deliberately whisper-light, making weight 300 headlines read as anti-convention: authority through restraint rather than volume.

### Neue Corp Semibold — Specimen showcase — fixed 103px display size in the font grid. · `--font-neue-corp-semibold`
- **Weights:** 500
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### Watch Medium — Specimen showcase — fixed 103px display size in the font grid. · `--font-watch-medium`
- **Weights:** 485
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### Monument Narrow Medium — Specimen showcase — fixed 103px display size in the font grid. · `--font-monument-narrow-medium`
- **Weights:** 525
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### Model Plastic Regular — Specimen showcase — fixed 103px display size in the font grid. · `--font-model-plastic-regular`
- **Weights:** 500
- **Sizes:** 103
- **Line height:** 1.00
- **Role:** Specimen showcase — fixed 103px display size in the font grid.

### neue-gstaad-normal-bold — neue-gstaad-normal-bold — detected in extracted data but not described by AI · `--font-neue-gstaad-normal-bold`
- **Weights:** 700
- **Sizes:** 103px
- **Line height:** 1
- **Role:** neue-gstaad-normal-bold — detected in extracted data but not described by AI

### neue-corp-normal-semibold — neue-corp-normal-semibold — detected in extracted data but not described by AI · `--font-neue-corp-normal-semibold`
- **Weights:** 500
- **Sizes:** 103px
- **Line height:** 1
- **Role:** neue-corp-normal-semibold — detected in extracted data but not described by AI

### neue-york-normal-normal-bold — neue-york-normal-normal-bold — detected in extracted data but not described by AI · `--font-neue-york-normal-normal-bold`
- **Weights:** 400
- **Sizes:** 121px
- **Line height:** 1
- **Role:** neue-york-normal-normal-bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | — | `--text-caption` |
| body-sm | 14px | 1.3 | — | `--text-body-sm` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 18px | 1.2 | — | `--text-subheading` |
| heading-sm | 22px | 1.17 | — | `--text-heading-sm` |
| heading | 36px | 1.17 | — | `--text-heading` |
| heading-lg | 48px | 1.1 | — | `--text-heading-lg` |
| display | 121px | 1 | — | `--text-display` |
| display-xl | 145px | 1 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| small | 20px |
| badges | 999px |
| inputs | 20px |
| buttons | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 92px
- **Card padding:** 26px
- **Element gap:** 8px

## Components

### Hero Font Showcase Card
**Role:** Full-bleed feature card for a typeface release

Large rounded card (20px radius) with photographic background image filling the entire surface, title text in Neue Montreal at 121-145px weight 600 in white overlaid center, subtitle at 18px weight 400, and a small status badge pill floating above the title. The image darkens or uses a gradient overlay to ensure white text contrast.

### Status Badge — New
**Role:** Highlight tag for newly released fonts

Pill shape (999px radius), #ff2f00 background, white text in Neue Montreal 12px weight 500, padding 4px 12px. The signature accent — appears on most cards in the grid.

### Status Badge — Update
**Role:** Highlight tag for recently updated fonts

Pill shape (999px radius), #ffb700 background, black text in Neue Montreal 12px weight 500, padding 4px 12px. Yellow variant of the status badge.

### Status Badge — Early Access
**Role:** Highlight tag for preview/beta releases

Pill shape (999px radius), #bfe0ff background, black text in Neue Montreal 12px weight 500, padding 4px 12px. Cool blue variant for access-state distinction.

### Primary Filled Button
**Role:** Main call-to-action (Explore font, Try for Free)

20px border-radius, white (#fafafa) background, 1px black border, Neue Montreal 14px weight 500, black text, padding 8px 23px. The filled white pill against dark or photographic backgrounds is the signature button form.

### Ghost Outlined Button
**Role:** Secondary action paired with primary button

20px border-radius, transparent background, 1px white border, Neue Montreal 14px weight 500, white text, padding 8px 23px. Used alongside filled buttons on dark/image backgrounds for the secondary action.

### Font Specimen Card (Grid View)
**Role:** Card showing one typeface in the font catalog grid

#fafafa background, 1px black border, 20px radius, padding 26px. Contains font name at 18px weight 530, metadata (styles count, features) at 14px weight 400 in Graphite, a status badge in the top-right, and a large 'Aa' specimen at ~103px in the displayed font weight, bottom-aligned. Cards in a 4-column grid with 15-23px gaps.

### Navigation Bar
**Role:** Top site navigation

Full-width sticky bar, transparent or #fafafa background, height ~60px. Logo 'Pangram Pangram Foundry' in Neue Montreal 14px weight 530 left, nav links in Neue Montreal 14px weight 400 center (23px gap between items), search/cart/menu icons right. No background fill — relies on hairline bottom border.

### Section Divider
**Role:** Visual separator between content sections

1px black border-bottom or generous vertical spacing (92px). The system prefers whitespace over rules; dividers are minimal.

### Input Field
**Role:** Text input for search or forms

1px black border, 20px radius, padding 24px vertical, #fafafa background, Neue Montreal 16px weight 400, black text. Generous padding makes inputs feel spacious and editorial.

### View Toggle (Card View / List View)
**Role:** Switch between display modes in the font grid

Inline pill control with two text options separated by a small icon. Active state uses #ff2f00 underline or indicator. Neue Montreal 14px weight 500.

### Footer Link Group
**Role:** Footer navigation cluster

Stacked links in Neue Montreal 14px weight 400, Graphite color, 4-8px vertical gap. Underline on hover with #666 border-bottom.

## Do's and Don'ts

### Do
- Use only #ff2f00 as the chromatic accent — it must remain rare enough to register as editorial highlight, not decoration
- Set all borders to 1px solid #000000 for cards, lists, badges, and inputs — the hairline black is the structural skeleton
- Use 20px border-radius for cards, buttons, and inputs; reserve 999px exclusively for badge pills
- Set hero type to Neue Montreal at 121-145px weight 600 with line-height 1.00 — the type should fill the card vertically
- Use status badges (#ff2f00 New, #ffb700 Update, #bfe0ff Early Access) as the only chromatic elements in any view
- Set card padding to 26px and card gaps to 15-23px to maintain the comfortable editorial density
- Let full-bleed photography carry the hero sections — never apply colored backgrounds to hero cards

### Don't
- Do not use #ff2f00 for body text, headings, or large surfaces — its role is badge/punctuation only
- Do not apply box-shadow or heavy elevation — the system relies on 1px borders and whitespace, not depth
- Do not use radius values other than 20px (cards/buttons/inputs) and 999px (badges) — the rounded softness is signature
- Do not use colors other than the defined palette — no decorative blues, greens, or purples for UI chrome
- Do not use multiple type families in the same view — Neue Montreal carries everything except specimen showcases
- Do not set line-height above 1.30 for any size — the tight leading is essential to the editorial feel
- Do not center body text or metadata — only headlines and hero type use center alignment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` | Page background — the base white-marble surface |
| 1 | Card | `#fafafa` | Font specimen cards, content panels — same as canvas, separated by 1px black border |
| 2 | Secondary Fill | `#ededed` | Filled buttons, muted card backgrounds, image placeholders — one step deeper for gentle separation |
| 3 | Accent Surface | `#bfe0ff` | Info badge background for Early Access status |
| 4 | Accent Surface | `#ffb700` | Warning badge background for Update status |
| 5 | Accent Surface | `#ff2f00` | Primary accent badge background for New status and icon highlights |

## Elevation

The design system deliberately avoids box-shadow and elevation. Separation is achieved exclusively through 1px solid #000000 hairline borders and whitespace. The flat, borderless depth creates a print-catalogue feel — surfaces sit on the page like printed sheets rather than floating digital cards. The only 'depth' technique is a subtle dark gradient overlay on hero images to ensure white text contrast.

## Imagery

Full-bleed photography dominates the visual language. Each font hero features a high-resolution environmental photograph — cityscapes, food, lifestyle scenes — chosen to evoke the personality of the typeface (Montreal gets brutalist architecture, New York gets a sandwich, Palma gets cocktail citrus). Photos are unmanipulated: no duotone, no color grading, no overlays except a subtle dark gradient for text legibility. The card grid in specimen view contains no photography — just enormous 'Aa' letterforms in each typeface as the visual content. Icons are minimal, line-style, monochrome. No illustrations, no 3D renders, no abstract graphics — the type specimens and curated photography carry all visual weight.

## Layout

Max-width 1200px centered content with full-bleed hero cards that break the container. The page model alternates between two primary section types: (1) full-width feature cards with photographic backgrounds and overlaid display type, stacked vertically with generous gaps, and (2) a 4-column grid of font specimen cards on a #fafafa background. The font grid is the workhorse — 4 columns at desktop with 15-23px gaps, 2 columns on tablet, 1 column on mobile. Section rhythm is consistent: each section separated by 92px of vertical whitespace, with 1px hairlines as occasional dividers. Navigation is a single transparent top bar, not sticky, with a centered link cluster and right-aligned utility icons. The hero is never a traditional text+image split — it's always a full-bleed image with centered type overlay.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #fafafa
- border: #000000 (1px hairline)
- secondary surface: #ededed
- muted text: #666666
- accent: #ff2f00 (badges, icons, highlights only)
- primary action: #ff2f00 (filled action)

Example Component Prompts:

1. Create a hero font showcase card: full-bleed background image filling a 20px-radius card. Centered title in Neue Montreal 121px weight 600, color #ffffff, line-height 1.00. Subtitle below in Neue Montreal 18px weight 400, #ffffff. A #ff2f00 status pill badge (999px radius, white text, 12px) floats above the title. A white filled pill button ('Explore font') and a white ghost outlined button ('Try for Free') sit side by side at the bottom center — both 20px radius, padding 8px 23px, 14px weight 500.

2. Create a font specimen grid card: #fafafa background, 1px #000000 border, 20px radius, 26px padding. Font name at top-left in Neue Montreal 18px weight 530, #000000. Metadata below in Neue Montreal 14px weight 400, #666666. A #ff2f00 'New' pill badge (999px radius, 12px weight 500, white text) positioned top-right. A massive 'Aa' at ~103px in the showcased font, bottom-aligned, #000000. Cards arrange in a 4-column grid with 20px gaps.

3. Create a status badge: pill shape (999px radius), 4px 12px padding, Neue Montreal 12px weight 500. Three variants: #ff2f00 bg + white text (New), #ffb700 bg + black text (Update), #bfe0ff bg + black text (Early Access).

4. Create the top navigation bar: full-width, transparent background, ~60px height. 'Pangram Pangram Foundry' logo at far left in Neue Montreal 14px weight 530. Five nav links center-aligned in Neue Montreal 14px weight 400, #000000, with 23px gap between items. Search icon, cart icon, and hamburger menu icon right-aligned, all 1px stroke black.

5. Create a filled action button: 20px border-radius, #fafafa background, 1px #000000 border, Neue Montreal 14px weight 500, #000000 text, padding 8px 23px. Inline display, no shadow. This is the 'Explore font' button — the system's only filled button variant.

## Type System Rules

The foundry is a single-family UI system: Neue Montreal carries everything from 12px captions to 145px display. Weight 400 = body, weight 530 = subhead/card titles, weight 600 = headings and display. Line-height tightens with size: 1.30 at 12-14px, 1.20 at 16-20px, 1.10 at 36-48px, 1.00 at 121px+. No letter-spacing adjustment. No italic in the primary face. Specimen pages are the only place secondary typefaces appear, always at fixed 103px for visual comparison.

## Similar Brands

- **Dinamo (dinamo.com)** — Same type-foundry curatorial aesthetic — large display type over editorial imagery, single accent color, minimal UI chrome, type-as-product approach.
- **Grilli Type (grillitype.com)** — Similar specimen-driven layout with full-bleed feature cards, white-canvas grid of typeface cards, and restrained chromatic palette.
- **Klim Type Foundry (klim.co.nz)** — Editorial type-catalogue feel with hairline borders, generous whitespace, and large-format type specimens dominating the visual hierarchy.
- **OHno Type (ohnotype.com)** — Independent foundry with the same print-catalogue-on-screen treatment: 1px structural borders, pill controls, type-first hierarchy with minimal decorative color.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff2f00;
  --color-marble-white: #fafafa;
  --color-stone-gray: #ededed;
  --color-graphite: #666666;
  --color-ink-black: #000000;
  --color-signal-yellow: #ffb700;
  --color-ice-blue: #bfe0ff;

  /* Typography — Font Families */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-montreal-semibold: 'Neue Montreal Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-york: 'Neue York', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-frama-semibold: 'Frama Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kyoto-semibold: 'Kyoto Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-gstaad-bold: 'Neue Gstaad Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-palma-fizzy-heavy: 'Palma Fizzy Heavy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mori-bold: 'Mori Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-museum-light: 'Museum Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-corp-semibold: 'Neue Corp Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-watch-medium: 'Watch Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monument-narrow-medium: 'Monument Narrow Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-model-plastic-regular: 'Model Plastic Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-gstaad-normal-bold: 'neue-gstaad-normal-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-corp-normal-semibold: 'neue-corp-normal-semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-york-normal-normal-bold: 'neue-york-normal-normal-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.17;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 121px;
  --leading-display: 1;
  --text-display-xl: 145px;
  --leading-display-xl: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-w485: 485;
  --font-weight-medium: 500;
  --font-weight-w525: 525;
  --font-weight-w530: 530;
  --font-weight-w580: 580;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 92px;
  --card-padding: 26px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-small: 20px;
  --radius-badges: 999px;
  --radius-inputs: 20px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-canvas: #fafafa;
  --surface-card: #fafafa;
  --surface-secondary-fill: #ededed;
  --surface-accent-surface: #bfe0ff;
  --surface-accent-surface: #ffb700;
  --surface-accent-surface: #ff2f00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff2f00;
  --color-marble-white: #fafafa;
  --color-stone-gray: #ededed;
  --color-graphite: #666666;
  --color-ink-black: #000000;
  --color-signal-yellow: #ffb700;
  --color-ice-blue: #bfe0ff;

  /* Typography */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-montreal-semibold: 'Neue Montreal Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-york: 'Neue York', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-frama-semibold: 'Frama Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kyoto-semibold: 'Kyoto Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-gstaad-bold: 'Neue Gstaad Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-palma-fizzy-heavy: 'Palma Fizzy Heavy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mori-bold: 'Mori Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-museum-light: 'Museum Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-corp-semibold: 'Neue Corp Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-watch-medium: 'Watch Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monument-narrow-medium: 'Monument Narrow Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-model-plastic-regular: 'Model Plastic Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-gstaad-normal-bold: 'neue-gstaad-normal-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-corp-normal-semibold: 'neue-corp-normal-semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-york-normal-normal-bold: 'neue-york-normal-normal-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.17;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 121px;
  --leading-display: 1;
  --text-display-xl: 145px;
  --leading-display-xl: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 999px;
}
```
