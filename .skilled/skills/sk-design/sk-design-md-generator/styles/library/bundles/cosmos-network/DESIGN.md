# Cosmos Network — Style Reference
> Deep space command center — a near-black financial observatory where white type and concentric diagrams float in measured silence.

**Theme:** dark

Cosmos Network presents an institutional dark-mode financial infrastructure aesthetic: a near-black canvas where white typography does all the visual work, supported by pill-shaped ghost controls and generous whitespace. The single custom typeface 'The Future' carries a slight positive tracking that gives headlines a measured, ceremonial quality — authority through restraint rather than volume. Layout follows a disciplined two-column rhythm: large declarative headlines paired with restrained secondary imagery (like the concentric-circle globe diagram), followed by horizontal case-study card carousels. Color is almost entirely suppressed — any chromatic presence is deeply desaturated, creating a quiet, high-trust environment where structure and whitespace carry the weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, section backgrounds, maximum-contrast surface |
| Carbon | `#181818` | `--color-carbon` | Navigation bar, elevated surface base, footer surface |
| Graphite | `#1e1f20` | `--color-graphite` | Card surfaces, elevated panels, contained content blocks |
| Iron | `#333333` | `--color-iron` | Hairline borders, dividers, structural separators |
| Slate | `#807f7f` | `--color-slate` | Muted secondary text, inactive nav items, subtle metadata |
| Fog | `#999999` | `--color-fog` | Disabled labels, low-emphasis helper text, tertiary metadata |
| Ash | `#666666` | `--color-ash` | Deep-recessed borders, very-low-emphasis outlines |
| Chalk | `#f1f4f4` | `--color-chalk` | Alternate light surface, inverted card context |
| Pure White | `#ffffff` | `--color-pure-white` | Primary headings, body text, icon strokes, button borders, link text — the single chromatic force in the system |
| Signal Mint | `#22e2a8` | `--color-signal-mint` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Deep Navy | `#0a2142` | `--color-deep-navy` | Ambient atmospheric tint, decorative background wash behind globe visualization |
| Concentric Teal | `#085556` | `--color-concentric-teal` | Diagram and data-visualization stroke, subtle infographic accent |

## Tokens — Typography

### The Future — Sole typeface across the entire system — navigation, body, headings, buttons, and labels. The slight positive tracking (0.02–0.04em) at all sizes creates a measured, architectural quality uncommon in fintech. · `--font-the-future`
- **Substitute:** Geist, Inter, or DM Sans with positive letter-spacing applied at small sizes
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 24px, 32px, 36px, 60px
- **Line height:** 1.13–1.63
- **Letter spacing:** 0.02em at 12–14px, 0.025em at 16–24px, 0.04em at 32–60px
- **OpenType features:** `"ss02" on, "ss09" on`
- **Role:** Sole typeface across the entire system — navigation, body, headings, buttons, and labels. The slight positive tracking (0.02–0.04em) at all sizes creates a measured, architectural quality uncommon in fintech.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.24px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.28px | `--text-body-sm` |
| body | 16px | 1.6 | 0.4px | `--text-body` |
| subheading | 24px | 1.33 | 0.6px | `--text-subheading` |
| heading-sm | 32px | 1.25 | 0.8px | `--text-heading-sm` |
| heading | 36px | 1.13 | 0.9px | `--text-heading` |
| display | 60px | 1.13 | 2.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 50 | 50px | `--spacing-50` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 20px |
| cards | 20px |
| images | 10px |
| buttons | 20px |
| largeCards | 30px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Ghost Pill Button
**Role:** Primary interactive control used for top-level calls-to-action in navigation and hero

Transparent fill with 1px white border (#ffffff), 20px border-radius (pill shape), 10px 30px padding, text in 'The Future' at 16px weight 400, letter-spacing 0.025em, with a trailing arrow icon ›

### Card Surface
**Role:** Container for case studies, features, and content blocks

20px border-radius, #1e1f20 background, no visible border or shadow, generous internal padding (20px), full-bleed image at top with sharp top corners rounding to match card

### Case Study Card
**Role:** Horizontal card displaying a customer/partnership story in a scrollable carousel

Image header (rounded top corners), #1e1f20 background, 20px radius, white company name at 24px with positive tracking, body description at 16px in #807f7f, small uppercase category tag at bottom (Lending, Payments, Tokenization)

### Navigation Bar
**Role:** Top-level site navigation

Dark Carbon (#181818) background, 'C☿SMOS' wordmark left, four nav items centered (Solutions, Technology, Resources, About) with dropdown indicators, ghost pill CTA 'Contact Us' right-aligned

### Headline Display Block
**Role:** Hero and section headlines

Left-aligned, 'The Future' at 60px weight 400, pure white (#ffffff), line-height 1.13, letter-spacing 0.04em, occupies left half of a two-column hero layout

### Body Paragraph
**Role:** Supporting descriptive text under headlines

'The Future' at 16px weight 400, white with reduced visual weight, line-height 1.6, max-width ~540px, left-aligned in hero context

### Stat Strip
**Role:** Horizontal row of key metrics in the hero

Single line, 'The Future' at 24–32px, large numeric value in white followed by descriptive label in #807f7f, items separated by generous horizontal spacing (30px+)

### Carousel Navigation Dots
**Role:** Indicator for horizontal scroll position in case-study carousel

Small circular dots (6px), #807f7f for inactive, #ffffff for active state, positioned top-right of carousel header

### Globe Visualization
**Role:** Decorative data-visualization element in hero

Stylized Earth render in dark tones with concentric circles radiating from a 'TDeFi' node, white annotation labels ('FIGURE', 'Ondo fintech', 'ripple'), positioned right of headline

### Footer Surface
**Role:** Site footer with links and metadata

#181818 background, same nav and typography as header, hairline #333333 top border, compact link rows

### Category Tag Label
**Role:** Small uppercase tag at bottom of case study cards

'The Future' at 12px weight 400, letter-spacing 0.02em, #807f7f color, no background or border, sits flush left at card bottom

## Do's and Don'ts

### Do
- Use 'The Future' exclusively at weight 400 — the system carries authority through spacing and restraint, not bold weights
- Maintain 20px border-radius for all interactive surfaces (buttons, nav items, cards) to preserve the pill geometry
- Keep the canvas near-pure-black (#000000) with #1e1f20 as the only card elevation — avoid introducing mid-gray fills that dilute contrast
- Apply positive letter-spacing from the type scale to every text element, including body copy at small sizes
- Use #ffffff for all text and icon strokes; introduce #807f7f only for genuine de-emphasis, never for decoration
- Anchor hero and section layouts on a two-column split (text-left, visual-right) with the headline at 60px display size
- Reserve #22e2a8 for live-status or active-state indicators only — do not use it as a brand color or button fill

### Don't
- Do not introduce a second typeface — 'The Future' at varying sizes and tracking covers the entire system
- Do not use colored backgrounds (blue, teal, orange) as section backgrounds — these appeared only in decorative diagrams and would break the monochrome system
- Do not add box-shadows or glows to cards or buttons — the system relies on flat dark surfaces and hairline borders, never elevation effects
- Do not bold or italicize type — weight 400 with tracking is the only typographic move available
- Do not place buttons in a filled-white style on dark sections — the ghost outlined pill is the canonical action surface
- Do not use #0000ee or any default-link blue — links inherit #ffffff with optional underline only
- Do not introduce gradients between surfaces — the system is strictly flat, with color appearing only in infographic elements

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page-level canvas, full-bleed section backgrounds |
| 1 | Carbon | `#181818` | Navigation bar, footer, primary surface container |
| 2 | Graphite | `#1e1f20` | Elevated card surfaces, content blocks above canvas |
| 3 | Chalk | `#f1f4f4` | Inverted light surface for contrast sections or modal dialogs |

## Elevation

The system intentionally avoids all shadow and glow effects. Elevation is communicated exclusively through surface tone shifts: #000000 canvas → #181818 nav/footer → #1e1f20 card. No drop-shadows, no inner-shadows, no blur effects. This flat elevation strategy creates a clean, diagrammatic quality where every element sits clearly on the same plane, reinforcing the institutional and technical character of the brand.

## Imagery

Visual language is restrained and diagrammatic rather than photographic. The hero uses a single large data-visualization element — a dark globe render with concentric circle nodes and white annotation labels (FIGURE, Ondo fintech, ripple) that reads like a schematic or system diagram. Case study cards use real photography but crop it tight to the top of the card, desaturated to fit the dark palette, functioning as content headers rather than lifestyle imagery. No full-bleed editorial photography exists anywhere on the page. Iconography is minimal-stroke white line icons used sparingly for nav dropdowns and directional arrows. The overall visual register is institutional and technical — closer to an annual report or infrastructure dashboard than a consumer product.

## Layout

Page architecture is centered max-width contained at ~1280px with generous outer padding. The hero is a two-column split: headline + body left (~55%), globe diagram right (~45%), with the headline at 60px and a clear vertical hierarchy of headline → body → CTA → stat strip below. Below the hero, sections flow seamlessly on the same #000000 canvas with 80px vertical gaps between blocks. Case study content uses a horizontal card carousel with 4 visible cards and partial bleed on the right edge to suggest scroll continuation, with navigation dots top-right. Navigation is a single horizontal bar — no sidebar, no mega-menu overlay visible. The overall rhythm is quiet and spacious: large headlines anchor dark sections, whitespace separates content blocks, and no section uses a contrasting background color, keeping the monochrome system intact throughout.

## Agent Prompt Guide

## Quick Color Reference
- text: #ffffff
- background: #000000
- border: #333333
- muted text: #807f7f
- card surface: #1e1f20
- nav surface: #181818
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero section (dark, two-column)**: #000000 canvas, max-width 1280px centered. Left column: 60px 'The Future' weight 400, #ffffff, letter-spacing 2.4px, headline text. Below: 16px body, #807f7f, line-height 1.6, max-width 540px. Below: ghost pill button, 1px #ffffff border, 20px radius, 10px 30px padding, 16px 'The Future' #ffffff with arrow. Right column: 400px globe diagram with concentric circles, white annotation labels.

2. **Case Study Card**: #1e1f20 background, 20px radius, 20px internal padding. Top: full-width image header, 16:9 ratio, top corners rounded to 20px. Middle: 24px 'The Future' weight 400, #ffffff, company name. Below: 16px 'The Future', #807f7f, 2-line description. Bottom: 12px 'The Future', #807f7f, letter-spacing 0.24px, category tag.

3. **Navigation Bar**: #181818 background, full-width, 80px height. Left: 'C☿SMOS' wordmark in 16px 'The Future' weight 400, #ffffff. Center: four nav items at 16px 'The Future', #ffffff, separated by 30px gap, each with a dropdown chevron icon. Right: ghost pill button 'Contact Us' with 1px #ffffff border, 20px radius, 10px 30px padding.

4. **Stat Strip**: horizontal row, 24px 'The Future' weight 400, #ffffff for numeric values (150+, $70bn, 10 years+, 10000+, <1 second), followed immediately by 16px 'The Future', #807f7f, for descriptor text. Items separated by 30px gap, no dividers.

5. **Carousel Header with Nav Dots**: 36px 'The Future' weight 400, #ffffff headline on the left. Right side: two small 6px circular dots, #807f7f (inactive) and #ffffff (active), 8px gap between them, positioned vertically centered with the headline.

## Typographic System Philosophy

The system uses a single weight (400) across all roles — the visual hierarchy is created entirely through size, tracking, and color opacity. Letter-spacing scales proportionally: smaller text gets tighter positive tracking (0.02em at 12px) while display text gets expansive tracking (0.04em at 60px). This creates a consistent 'architectural' feel where every element feels carefully measured. The font features ss02 and ss09 should always be enabled to preserve the intended character variants. Never simulate bold with font-weight — use size and tracking instead.

## Similar Brands

- **Chainalysis** — Same dark-canvas financial-infrastructure aesthetic with white tracked type and minimal color
- **Stripe (Press / Institutional pages)** — Large declarative headlines on near-black backgrounds with pill-shaped ghost controls and flat card surfaces
- **Messari** — Institutional crypto research aesthetic with dark backgrounds, generous whitespace, and single-weight geometric type
- **Fidelity Institutional** — Financial trust language expressed through monochrome dark surfaces and measured typography rather than color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-carbon: #181818;
  --color-graphite: #1e1f20;
  --color-iron: #333333;
  --color-slate: #807f7f;
  --color-fog: #999999;
  --color-ash: #666666;
  --color-chalk: #f1f4f4;
  --color-pure-white: #ffffff;
  --color-signal-mint: #22e2a8;
  --color-deep-navy: #0a2142;
  --color-concentric-teal: #085556;

  /* Typography — Font Families */
  --font-the-future: 'The Future', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.28px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.8px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: 0.9px;
  --text-display: 60px;
  --leading-display: 1.13;
  --tracking-display: 2.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-nav: 20px;
  --radius-cards: 20px;
  --radius-images: 10px;
  --radius-buttons: 20px;
  --radius-largecards: 30px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-carbon: #181818;
  --surface-graphite: #1e1f20;
  --surface-chalk: #f1f4f4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-carbon: #181818;
  --color-graphite: #1e1f20;
  --color-iron: #333333;
  --color-slate: #807f7f;
  --color-fog: #999999;
  --color-ash: #666666;
  --color-chalk: #f1f4f4;
  --color-pure-white: #ffffff;
  --color-signal-mint: #22e2a8;
  --color-deep-navy: #0a2142;
  --color-concentric-teal: #085556;

  /* Typography */
  --font-the-future: 'The Future', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.28px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.8px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: 0.9px;
  --text-display: 60px;
  --leading-display: 1.13;
  --tracking-display: 2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-50: 50px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
}
```
