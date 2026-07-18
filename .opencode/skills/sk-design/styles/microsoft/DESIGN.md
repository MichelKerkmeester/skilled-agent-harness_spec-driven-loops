# Microsoft — Style Reference
> Corporate blue retail catalog — think 4-square logo against a white showroom floor with one accent blue guiding every interaction.

**Theme:** light

Microsoft.com is a corporate store-and-marketing surface: a near-white canvas punctuated by a single vivid corporate blue, with product cards floating on subtle elevation and one-color hero banners. Segoe UI carries the entire system — a humanist grotesque that reads utilitarian and confident rather than editorial. The visual rhythm is grid-disciplined: 4-column product rows, centered max-width bands, and hero sections that alternate between blue-tinted lifestyle photography and pure white card overlays. Components feel light, flat, and functional — minimal radii, thin borders, one shadow stack, no decorative gradients — letting product photography do the visual heavy lifting while the blue accent marks every action.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Microsoft Blue | `#0067b8` | `--color-microsoft-blue` | Primary action background, link text, navigation accents, icon strokes — the single chromatic authority in the system, used for all filled CTAs and interactive highlights |
| Pure White | `#ffffff` | `--color-pure-white` | Page background, card surfaces, button text on blue, surface elevation |
| Mist Gray | `#f2f2f2` | `--color-mist-gray` | Footer background, subtle surface tone, page canvas under cards |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary text, card borders, hairline dividers — the dominant typographic and structural color |
| Steel Gray | `#616161` | `--color-steel-gray` | Secondary text, navigation text, muted UI elements, footer copy |
| Graphite | `#262626` | `--color-graphite` | Body text variant, list borders, navigation dividers, secondary headings |
| Deep Charcoal | `#171717` | `--color-deep-charcoal` | Dense text blocks, list separators, button border variant — the darkest neutral after pure black |

## Tokens — Typography

### Segoe UI — Sole typeface across the entire system — navigation, body, headings, buttons, footer. Weight 400 is the workhorse; weight 600 is reserved for headings and button labels to create section-level contrast without switching families. Segoe UI's humanist proportions and open apertures give the system its calm, enterprise-confident voice — the type does not perform, it informs. · `--font-segoe-ui`
- **Substitute:** Open Sans, Source Sans Pro, or system-ui as free alternatives that share Segoe UI's humanist grotesque DNA
- **Weights:** 400, 600
- **Sizes:** 11px, 13px, 14px, 15px, 16px, 29px, 37px
- **Line height:** 1.00–2.27 (varies by context: 1.0 for nav icons, 1.2 for hero, 1.33–1.5 for body, 2.27 for hero subtext)
- **Role:** Sole typeface across the entire system — navigation, body, headings, buttons, footer. Weight 400 is the workhorse; weight 600 is reserved for headings and button labels to create section-level contrast without switching families. Segoe UI's humanist proportions and open apertures give the system its calm, enterprise-confident voice — the type does not perform, it informs.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1 | — | `--text-caption` |
| heading-sm | 29px | 1.2 | — | `--text-heading-sm` |
| heading | 37px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 0px |
| inputs | 2px |
| buttons | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.13) 0px 3px 7px 0px, rgba(0, 0, 0, 0.11) ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Action Button
**Role:** Filled CTA used for 'Comprar ahora', 'Descargar ahora', 'Unirse ahora', 'Más información'

Background #0067b8, text #ffffff, Segoe UI weight 600, 15px, 2px border-radius, 12px vertical × 16px horizontal padding, no border. 8px gap between icon and label. Text on solid blue without outlined variant — chromatic filled is the sole CTA style.

### Ghost Text Link
**Role:** Inline links in navigation rows, card text links, footer links

No background, no border. Text #0067b8, Segoe UI weight 400, 15px. Underline appears on hover. 7–8px gap between icon and text. The blue link color does all the work — no button chrome needed.

### Product Card
**Role:** Grid card for Surface, Xbox, accessories, and software promotions

White surface (#ffffff) with hairline border (1px #000000 or near-black at low opacity). No border-radius. Card shadow: rgba(0,0,0,0.13) 0px 3px 7px 0px + rgba(0,0,0,0.11) 0px 1px 2px 0px. Image flush to top edge, 24px padding on text block. Headline in Segoe UI 600 at 24–29px, description in weight 400 at 14–15px, CTA button at bottom.

### Hero Card Overlay
**Role:** White text card layered over a blue photographic hero

White background (#ffffff), 32–48px padding, no border, no radius. Headline Segoe UI 600 at 29–37px in #000000. Body text 15px weight 400. Primary button below. The card is offset-left against a full-bleed blue hero image.

### Category Icon Link
**Role:** Icon + label links for 'Comprar portátiles Surface', 'Comprar consolas y juegos para Xbox', etc.

Centered stack: simple line icon (24px) above label. Label in #0067b8, Segoe UI 400, 15px. 5–8px gap between icon and text. No background, no border. Arranged in a 5-column row with equal spacing.

### Top Navigation Bar
**Role:** Sticky header with Microsoft logo, product links, and account controls

White background. Microsoft logo (4-color square) left-aligned. Nav links in Segoe UI 400, 15px, #616161 or #000000. Right-aligned cluster: dropdown, search, cart icon, sign-in button (circular avatar or text). 8px horizontal padding on links. No visible border-bottom.

### Hero Banner
**Role:** Full-width promotional section with product or lifestyle photography

Full-bleed background image (blue gradient or lifestyle photo). White card overlay positioned left or center. Right side may contain product render. 'Copilot+PC' or product name in large white Segoe UI 600 text overlaid on image. Dot-pagination indicator below.

### Carousel Pagination Dots
**Role:** Slide indicator for hero carousel

Row of small circular dots, ~8px diameter. Active dot filled #000000, inactive dots outlined or #616161. Paired with left/right arrow chevrons. 40px+ click targets.

### Feature Band
**Role:** Full-width promotional section (e.g., Microsoft Edge, AI for Earth)

Full-bleed lifestyle/landscape image background. White card overlay (32px padding) containing heading, description, and CTA. Image extends edge-to-edge. Text block is left-aligned within the overlay card.

### Section Heading Group
**Role:** Text block above a card grid or content row

Segoe UI 600, 24–29px, #000000. Optional subtext in 15px weight 400, #616161. 16–20px margin-bottom before the grid begins.

### 4-Column Card Grid
**Role:** Product or content grid layout

4 equal-width columns with 16–24px gap. Each cell is a Product Card. Grid sits inside the max-width container with symmetric horizontal padding.

### Footer
**Role:** Site-wide footer with links and legal

Background #f2f2f2. Links in Segoe UI 400, 13px, #616161. Organized in multi-column lists. Top border or separator. Copyright and legal text in 11–13px.

### Back-to-Top Button
**Role:** Floating scroll-to-top control

Fixed bottom-right. White background, 1px #000000 border, 2px radius. Text 'Volver al principio' in Segoe UI 400, 13px, #000000. Up-arrow icon. Small shadow for lift.

## Do's and Don'ts

### Do
- Use #0067b8 as the sole chromatic color for all filled action buttons, link text, and active navigation indicators
- Set button border-radius to 2px — subtle rounding, not pill-shaped
- Apply the card shadow stack (rgba(0,0,0,0.13) 0 3px 7px + rgba(0,0,0,0.11) 0 1px 2px) only to product cards in grids
- Use Segoe UI weight 600 for headings, card titles, and button labels; weight 400 for all body, nav, and link text
- Maintain 8px as the base spacing unit — use 8/16/24/48px steps for padding, margins, and gaps
- Layer white overlay cards (32–48px padding, no border) over full-bleed hero photography for text legibility
- Keep card grids at 4 equal columns with 16–24px gaps inside a max-width 1200px container

### Don't
- Do not introduce additional brand colors — the system is monochrome plus #0067b8
- Do not use border-radius greater than 2px on buttons, inputs, or cards — keep edges nearly sharp
- Do not apply shadows to navigation bars, buttons, or text blocks — only to product cards
- Do not use Segoe UI weights other than 400 and 600 — no 300 whisper-weights or 700 bold declarations
- Do not create outlined or ghost button variants — all actions are filled blue or simple text links
- Do not add decorative gradients — the system relies on photography and flat surfaces
- Do not use fully saturated icons — category icons should be 1.5–2px stroke outline style in #616161 or #000000

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background — the showroom floor |
| 1 | Card Surface | `#ffffff` | Product cards, hero overlays, content blocks — same white as canvas but elevated by border and shadow |
| 2 | Muted Surface | `#f2f2f2` | Footer background, subtle section differentiation |

## Elevation

- **Product Card:** `rgba(0, 0, 0, 0.13) 0px 3px 7px 0px, rgba(0, 0, 0, 0.11) 0px 1px 2px 0px`

## Imagery

Photography is product-led and lifestyle-secondary. Hero sections use blue-tinted studio renders of Surface devices and Xbox controllers on gradient backgrounds, or atmospheric landscape photography (lakes, mountains) for brand stories like Microsoft Edge or AI for Earth. Product card images are tight crops on pure white or contextual backgrounds, with no human models in the primary grid. Icon style is consistently outlined line-art (1.5–2px stroke) in neutral gray, used for category navigation. The 4-color Microsoft logo (red/green/blue/yellow squares) is the only multi-color mark in the system.

## Layout

Max-width 1200px centered container with full-bleed hero sections that break out. Hero pattern: full-viewport-width image or blue gradient with a white text card overlaid on the left and product render or branded text on the right. Section rhythm: alternating white canvas and blue photographic bands, each 480–600px tall, separated by 48px vertical gaps. Content arrangement: hero → icon-link row (5 columns) → 4-column product card grid → full-bleed feature band → another 4-column grid. Navigation is a sticky top bar, no sidebar. The page is information-dense but breathable — generous vertical spacing between sections prevents the grid from feeling cramped.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (hairline, 1px)
- accent: #0067b8 (links, icons, navigation)
- primary action: #0067b8 (filled action)
- muted surface: #f2f2f2 (footer)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #0067b8 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Create a hero section with overlay card:* Full-bleed blue gradient background (linear from #0050a0 to #003a75). White overlay card on left side: 400px wide, 48px padding, no radius, no border, white background. Headline: Segoe UI 600, 37px, #000000. Body: Segoe UI 400, 15px, #000000. Primary button (#0067b8 background, white text, Segoe UI 600, 15px, 2px radius, 12px 16px padding). Right side: product render or large brand text in white Segoe UI 600, 48px.

3. *Create a category icon-link row:* 5-column row, centered, 24px gap between items. Each item: 24px outlined icon (#616161, 1.5px stroke) stacked above label. Label in Segoe UI 400, 15px, #0067b8. No background, no border. Items are links with underline on hover.

4. *Create a top navigation bar:* White background, 16px vertical padding. Left: Microsoft 4-square logo (16px). Center: nav links in Segoe UI 400, 15px, #616161 with 16px horizontal padding. Right: search icon, cart icon, sign-in button — all #000000, 24px icons. No border-bottom, no shadow.


## Similar Brands

- **Apple** — Same full-bleed photography hero pattern with centered product text and white text cards over atmospheric backgrounds; product grid rhythm with generous spacing
- **Dell** — Corporate enterprise catalog layout with 4-column product grids, single accent color, and utilitarian Segoe-ui-adjacent type system
- **Samsung** — Hero card overlay + product grid structure with one dominant brand color on a near-white canvas and flat, minimal components
- **HP** — Light-theme retail catalog with blue accent, card-based product showcases, and restrained shadow usage limited to cards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-microsoft-blue: #0067b8;
  --color-pure-white: #ffffff;
  --color-mist-gray: #f2f2f2;
  --color-carbon-black: #000000;
  --color-steel-gray: #616161;
  --color-graphite: #262626;
  --color-deep-charcoal: #171717;

  /* Typography — Font Families */
  --font-segoe-ui: 'Segoe UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.2;
  --text-heading: 37px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 0px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.13) 0px 3px 7px 0px, rgba(0, 0, 0, 0.11) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-muted-surface: #f2f2f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-microsoft-blue: #0067b8;
  --color-pure-white: #ffffff;
  --color-mist-gray: #f2f2f2;
  --color-carbon-black: #000000;
  --color-steel-gray: #616161;
  --color-graphite: #262626;
  --color-deep-charcoal: #171717;

  /* Typography */
  --font-segoe-ui: 'Segoe UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.2;
  --text-heading: 37px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.13) 0px 3px 7px 0px, rgba(0, 0, 0, 0.11) 0px 1px 2px 0px;
}
```
