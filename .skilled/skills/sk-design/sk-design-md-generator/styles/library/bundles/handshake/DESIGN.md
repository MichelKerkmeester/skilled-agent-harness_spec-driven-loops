# Handshake — Style Reference
> neon highlighter on white paper

**Theme:** light

Handshake runs on a monochrome canvas punched open by one radioactive lime (#d3fb52) that acts less like a brand color and more like a highlighter dragged across white paper. The system is deliberately binary: almost everything is black text on white surfaces, and then the accent ignites — on nav pills, primary actions, and the hero's cyan-to-lime radial glow. Custom NoiGrotesk carries the UI with tight tracking and three stylistic sets (ss03, ss06, ss12) active everywhere, while SansPlomb at 201px declares the page in display headlines so large they feel architectural rather than typographic. Surfaces are pillow-soft (24px on cards and inputs), buttons are compact (8px), and the overall density is comfortable — the page breathes because the typography and gradient do the heavy emotional work, not ornament.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Lime | `#d3fb52` | `--color-voltage-lime` | Primary action fill, nav pill, active state, hero gradient endpoint — the single chromatic ignition point against an otherwise monochrome system |
| Cyan Spark | `radial-gradient(at 55% 45%, rgb(122, 243, 255) 0%, rgb(211, 251, 82) 70%, rgba(0, 0, 0, 0) 76%)` | `--color-cyan-spark` | Hero gradient start point, secondary glow tone — pairs with Voltage Lime to create the aurora-like radial background |
| Mid Abyss | `#052326` | `--color-mid-abyss` | Footer surface, dark section backgrounds — a near-black with a subtle teal undertone that keeps the dark mode on-brand |
| Carbon Ink | `#14151c` | `--color-carbon-ink` | Primary text, icon strokes, input borders — the slightly cool near-black used for the majority of foreground content |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on lime fills, input interiors — the dominant surface tone (1590+ appearances) |
| True Black | `#000000` | `--color-true-black` | Nav borders, strong text emphasis, icon fills — used sparingly where maximum contrast is needed |
| Ash | `#666666` | `--color-ash` | Body helper text, muted body borders — the secondary text level for de-emphasized copy |

## Tokens — Typography

### NoiGrotesk — Primary UI and body typeface — handles all navigation, buttons, inputs, cards, and headings up to 40px. Custom grotesque with active stylistic sets ss03, ss06, and ss12 that subtly shape letterforms across the entire system · `--font-noigrotesk`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 20, 22, 28, 40
- **Line height:** 0.85, 1.10, 1.40, 1.50
- **Letter spacing:** -0.025em at 40px, -0.020em at 22–28px, -0.015em at 14–20px, normal at 12–16px
- **OpenType features:** `"ss03" on, "ss06" on, "ss12" on`
- **Role:** Primary UI and body typeface — handles all navigation, buttons, inputs, cards, and headings up to 40px. Custom grotesque with active stylistic sets ss03, ss06, and ss12 that subtly shape letterforms across the entire system

### SansPlomb — Display-only typeface for hero and section-defining headlines. Used at 201px with ultra-tight 0.80 line-height and -0.020em tracking — the sheer scale makes the headline feel architectural, not typographic · `--font-sansplomb`
- **Substitute:** Druk Wide, Obviously, or Knockout
- **Weights:** 600
- **Sizes:** 201
- **Line height:** 0.80
- **Letter spacing:** -0.020em at 201px
- **Role:** Display-only typeface for hero and section-defining headlines. Used at 201px with ultra-tight 0.80 line-height and -0.020em tracking — the sheer scale makes the headline feel architectural, not typographic

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **OpenType features:** `"ss03", "ss06", "ss12"`
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | -0.015px | `--text-body-sm` |
| body | 16px | 1.5 | -0.015px | `--text-body` |
| subheading | 20px | 1.4 | -0.015px | `--text-subheading` |
| heading-sm | 22px | 1.1 | -0.02px | `--text-heading-sm` |
| heading | 28px | 1.1 | -0.02px | `--text-heading` |
| heading-lg | 40px | 0.85 | -0.025px | `--text-heading-lg` |
| display | 201px | 0.8 | -0.02px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24px |
| inputs | 24px |
| buttons | 8px |
| navPills | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Voltage CTA Button
**Role:** Primary action trigger

Filled with #d3fb52 Voltage Lime, #000000 text, 8px radius, 12px vertical / 16px horizontal padding. NoiGrotesk 16px weight 500. The lime fill is the only chromatic action surface in the system — it glows against the monochrome canvas.

### Ghost Button
**Role:** Secondary action trigger

Transparent fill, 1px #000000 border, #000000 text, 8px radius, 12px/16px padding. NoiGrotesk 16px weight 500. Used when a primary CTA is present and the secondary needs to recede.

### Sign Up Nav Pill
**Role:** Top-right primary action in header

#d3fb52 fill, #000000 text, 8px radius, 8px/16px padding, NoiGrotesk 14px weight 500. Distinct from the ghost Log In button beside it — the lime marks the desired action.

### Search Input
**Role:** Hero search bar for job queries

White fill, 1px #e5e5e5 border, 24px radius, 16px vertical / 24px horizontal padding. Placeholder text in #666666, 16px NoiGrotesk. A magnifier icon sits left, an arrow submit button sits right. The 24px radius is the softest radius in the system — this input is the user's main tool.

### Suggestion Chip
**Role:** Quick-select filter tags below search

Transparent fill, 1px #ffffff border on dark background (or #000000 on light), 9999px radius, 8px/16px padding. NoiGrotesk 14px. Fully pill-shaped — the 9999px radius makes these feel like removable labels.

### Job Card
**Role:** Individual job listing in results grid

White surface, 1px #e5e5e5 border, 24px radius, 24px internal padding. Company logo top-left, title in NoiGrotesk 20px weight 500, metadata in 14px #666666. No drop shadow — the border and radius provide structure.

### Hero Gradient Banner
**Role:** Page-opening atmospheric section

Full-bleed radial gradient from #7af3ff to #d3fb52 fading to transparent at ~76%, centered at ~50% 50%. 201px SansPlomb 600 headline in #ffffff. The gradient is the brand's signature — no other section uses this treatment.

### Footer
**Role:** Site-wide bottom navigation

#052326 Mid Abyss background, white text, 24px radius on outer container. Links in NoiGrotesk 14px. The dark footer is the only dark surface besides the hero, creating a bookend structure.

### Nav Link
**Role:** Header navigation items

NoiGrotesk 14px weight 500, #ffffff text on the dark hero header. No underline, no background — just the word in space, relying on the 8px padding and spacing to create hit areas.

## Do's and Don'ts

### Do
- Use #d3fb52 Voltage Lime only for the single most important action per view — CTAs, active nav pills, and the hero gradient endpoint
- Set font-feature-settings to 'ss03' on, 'ss06' on, 'ss12' on for all NoiGrotesk usage — the stylistic sets are part of the brand identity
- Apply 24px radius to all cards, inputs, and large containers; 8px to buttons and nav items; 9999px to tags and chips
- Use the radial cyan-to-lime gradient only in the hero and atmospheric section backgrounds — never on content cards or UI surfaces
- Anchor all spacing to the 8px base unit: 8, 16, 24, 32, 40, 80, 120px
- Keep the canvas #ffffff for 90% of the page — dark surfaces are limited to the hero gradient and the #052326 footer
- Set letter-spacing to -0.025em at 40px and tighten further as size increases — the system relies on dense tracking

### Don't
- Don't use #d3fb52 for body text, borders, icons, or non-action surfaces — it is an action color, not a decoration
- Don't use multiple chromatic colors — the system is monochrome with one accent; adding a second hue breaks the binary
- Don't apply drop shadows to cards or panels — depth comes from the 24px radius and hairline borders only
- Don't use system fonts as a substitute for NoiGrotesk at UI sizes — the custom letterforms and feature settings carry the identity
- Don't use display type (201px SansPlomb) more than once per page — its scale is meant to be a singular declaration
- Don't reduce the 24px input/card radius to match the 8px button radius — the soft/pillow vs compact contrast is intentional
- Don't use #000000 for large backgrounds — the system prefers #ffffff canvas with #052326 for the only dark surface

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background — the white paper the entire system sits on |
| 1 | Card | `#ffffff` | Elevated content blocks with 24px radius and hairline borders |
| 2 | Accent Surface | `#d3fb52` | Voltage Lime fills for CTAs, nav pills, and accent panels |
| 3 | Hero Glow | `#7af3ff` | Radial gradient origin — cyan-to-lime aurora on the hero |
| 4 | Dark Surface | `#052326` | Footer and dark section background — near-black with teal undertone |

## Elevation

- **Search Input:** `0 1px 0 rgba(0,0,0,0.04)`

## Imagery

Minimal photography or illustration. The hero is a pure gradient aurora with no photographic content. Product UI relies on typography, the gradient, and the lime accent to create atmosphere. When imagery appears (job listings, company logos), it is contained within 24px-radius cards and treated as functional data, not decoration. The visual language is: gradient atmosphere + massive type + monochrome surface + one chromatic spark.

## Layout

Max-width 1200px centered container. Hero is full-bleed with a centered radial gradient and left-aligned 201px headline that dominates the viewport. Below the hero, content shifts to white-background sections with 80px vertical gaps. Search bar spans the container width within the hero. Suggestion chips sit below the search in a horizontal row. The page uses a single-column flow for the hero, transitioning to multi-column card grids (2–3 columns) in content sections. Navigation is a simple top bar with logo left, links center, and Log In / Sign Up right — no sticky behavior, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #14151c (primary), #666666 (muted)
- background: #ffffff (canvas), #052326 (dark surface)
- border: #000000 (emphasis), #e5e5e5 (hairline)
- accent: #d3fb52 (Voltage Lime — action fills, nav pills)
- gradient: #7af3ff → #d3fb52 (hero radial)
- primary action: #d3fb52 (filled action)

**3-5 Example Component Prompts**
1. Create a hero section: full-bleed radial gradient from #7af3ff to #d3fb52 fading to transparent at 76%, centered. Headline in SansPlomb 201px weight 600, #ffffff, letter-spacing -0.02em, line-height 0.80. Below the headline, a white search input at 24px radius, 16px/24px padding, 1px #e5e5e5 border, placeholder text at 16px NoiGrotesk #666666.

2. Create a Voltage Lime CTA button: #d3fb52 background, #000000 text, 8px border-radius, 12px padding-top/bottom, 16px padding-left/right. Font: NoiGrotesk 16px weight 500, letter-spacing -0.015em, font-feature-settings 'ss03' on, 'ss06' on, 'ss12' on. No border, no shadow.

3. Create a job listing card: white background, 1px #e5e5e5 border, 24px border-radius, 24px internal padding. Title in NoiGrotesk 20px weight 500 #14151c. Company name in NoiGrotesk 14px #666666. Location and salary in NoiGrotesk 14px #666666. No drop shadow.

4. Create a suggestion chip: transparent background, 1px #ffffff border, 9999px border-radius, 8px padding-top/bottom, 16px padding-left/right. Text: NoiGrotesk 14px weight 500 #ffffff. On hover: background #d3fb52, text #000000.

5. Create a footer: #052326 background, full-width, 120px padding-top/bottom, 24px radius on outer container. Links in NoiGrotesk 14px #ffffff, arranged in a 4-column grid with 24px gap. Logo in #d3fb52 at top-left.

## Similar Brands

- **Linear** — Both use a near-monochrome interface with a single vivid accent color and custom geometric sans-serif typography with tight tracking
- **Spotify Design** — Similar binary palette approach — white/black canvas with a single high-saturation accent (lime for Handshake, green for Spotify) and oversized display headlines
- **Arc Browser** — Shared philosophy of one explosive accent color against a neutral system, with custom typography and gradient hero treatments
- **Substack** — Both rely on massive display type as the primary visual element, monochrome layouts, and a single accent color for interactive elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-lime: #d3fb52;
  --color-cyan-spark: #7af3ff;
  --gradient-cyan-spark: radial-gradient(at 55% 45%, rgb(122, 243, 255) 0%, rgb(211, 251, 82) 70%, rgba(0, 0, 0, 0) 76%);
  --color-mid-abyss: #052326;
  --color-carbon-ink: #14151c;
  --color-pure-white: #ffffff;
  --color-true-black: #000000;
  --color-ash: #666666;

  /* Typography — Font Families */
  --font-noigrotesk: 'NoiGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sansplomb: 'SansPlomb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.015px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.015px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.015px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.02px;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -0.02px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -0.025px;
  --text-display: 201px;
  --leading-display: 0.8;
  --tracking-display: -0.02px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-inputs: 24px;
  --radius-buttons: 8px;
  --radius-navpills: 8px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-accent-surface: #d3fb52;
  --surface-hero-glow: #7af3ff;
  --surface-dark-surface: #052326;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-lime: #d3fb52;
  --color-cyan-spark: #7af3ff;
  --color-mid-abyss: #052326;
  --color-carbon-ink: #14151c;
  --color-pure-white: #ffffff;
  --color-true-black: #000000;
  --color-ash: #666666;

  /* Typography */
  --font-noigrotesk: 'NoiGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sansplomb: 'SansPlomb', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.015px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.015px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.015px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.02px;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -0.02px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -0.025px;
  --text-display: 201px;
  --leading-display: 0.8;
  --tracking-display: -0.02px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```
