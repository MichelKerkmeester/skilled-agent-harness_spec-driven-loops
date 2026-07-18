# Home — Style Reference
> Sunlit eucalyptus grove on warm parchment — the design rests on a cream page where ink-black type and a single electric yellow accent do all the talking.

**Theme:** light

Airtree's design language reads as a sunlit editorial spread on warm parchment: a cream canvas (#f7f6e3) carries confident charcoal type, with a single electric yellow accent that punctuates rather than decorates. Prody's oversized display serif at 131px is the brand's loudest voice — everything else is deliberate whitespace and a clean grotesque. Components stay light and paper-like: 37px-rounded cards, outlined ghost controls, pill-shaped yellow CTAs, and hairline borders that define structure without weight. The system avoids heavy elevation, gradients, or saturated color fields; it relies on generous spacing, large radii, and a calm two-tone palette to let photography and quoted founders carry the emotional weight. Color is rationed: a cream page, ink-black type, and one jolt of yellow — no decorative gradients, no multi-hue branding.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Cream | `#f7f6e3` | `--color-parchment-cream` | Page canvas, card surfaces, bordered containers — near-gray cream that warms the entire interface and gives the whole site its paper-like calm; Outlined/ghost action borders, pill outlines, and interactive rings that echo the canvas tone — only visible against darker overlays |
| Ink Black | `#262d29` | `--color-ink-black` | Primary text, navigation, body copy, card borders, icon strokes — the only structural color, used for hairline definition and all readable content |
| Electric Lemon | `#ffff48` | `--color-electric-lemon` | Filled CTA buttons, active states, standout badges — a single saturated yellow that breaks the cream/ink calm to signal action; the ratio against #262d29 is 13.2:1 AAA |

## Tokens — Typography

### Prody — Display headlines — the signature voice. Used at 131px for the hero statement and 42px for secondary display; the heavy serif counters against the flat grotesque body to create editorial tension. Weight stays at 400; size alone carries the authority. · `--font-prody`
- **Substitute:** GT Sectra Display, Tiempos Headline, Canela, Playfair Display
- **Weights:** 400
- **Sizes:** 42px, 131px
- **Line height:** 1.15
- **Role:** Display headlines — the signature voice. Used at 131px for the hero statement and 42px for secondary display; the heavy serif counters against the flat grotesque body to create editorial tension. Weight stays at 400; size alone carries the authority.

### SuisseIntl — Body copy, card titles, subheadings, UI labels — the working typeface. Weight 500 for emphasized text, 600 for card titles, 400 default. Sizes step 13→14→16→19→21→33→42 covering caption through heading. · `--font-suisseintl`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk, Switzer
- **Weights:** 400, 500, 600
- **Sizes:** 13px, 14px, 16px, 19px, 21px, 33px, 42px
- **Line height:** 1.15
- **Role:** Body copy, card titles, subheadings, UI labels — the working typeface. Weight 500 for emphasized text, 600 for card titles, 400 default. Sizes step 13→14→16→19→21→33→42 covering caption through heading.

### SuisseIntl Book — Navigation links, form input text, small button labels — a lighter cut of the same family for quieter interactive surfaces · `--font-suisseintl-book`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 13px, 28px
- **Line height:** 1.15
- **Role:** Navigation links, form input text, small button labels — a lighter cut of the same family for quieter interactive surfaces

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.15 | — | `--text-caption` |
| body | 16px | 1.15 | — | `--text-body` |
| subheading | 19px | 1.15 | — | `--text-subheading` |
| heading-sm | 21px | 1.15 | — | `--text-heading-sm` |
| heading | 33px | 1.15 | — | `--text-heading` |
| heading-lg | 42px | 1.15 | — | `--text-heading-lg` |
| display | 131px | 1.15 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 28 | 28px | `--spacing-28` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 37px |
| pills | 9999px |
| buttons | 18px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 75-112px
- **Card padding:** 37px
- **Element gap:** 9-20px

## Components

### Hero Statement
**Role:** Page-opening headline block

Cream canvas with a centered Prody display headline at 131px, line-height 1.15, in #262d29. Optional subtext at 19px SuisseIntl 400. Sits inside a max-width ~960px container with generous top/bottom padding (~112px). No background fill — the cream is the hero.

### Pill CTA — Filled
**Role:** Primary action button

Background #ffff48, text #262d29, border-radius 9999px (pill). Padding 8px 18px. SuisseIntl 400 at 14px. The only filled button in the system — reserved for highest-priority actions. Contrast 13.2:1 against the yellow fill.

### Pill CTA — Ghost
**Role:** Secondary action button

Transparent background, 1px border in #f7f6e3 or #262d29 at low opacity, border-radius 9999px, padding 8px 18px, SuisseIntl Book 400 at 13px, text in #262d29. Used for navigation-adjacent actions like 'Get in touch'.

### Portfolio Card
**Role:** Image-first content card in a horizontal carousel

Border-radius 37px, no visible border, cream background or image fill. Image fills the card edge-to-edge with the same 37px clip. Overlay label bottom-left in SuisseIntl 400 at 14px #f7f6e3 (over photography) or #262d29 (over solid). Cards sit in a horizontally scrollable row with arrow controls.

### Carousel Arrow Button
**Role:** Navigation control for card carousels

40×40px square button, border-radius 8px, 1px border in #262d29, transparent fill. Arrow icon centered, stroke 1.5px. Hover: background #262d29, arrow inverts to #f7f6e3.

### Logo Strip
**Role:** Portfolio company wordmarks

Single horizontal row of grayscale company logos in #262d29 at uniform visual weight. Logos sit at roughly 40px cap height with ~75px horizontal spacing. No lockups, no color logos — all rendered in the single ink tone.

### Testimonial Block
**Role:** Founder quote with attribution

Centered text block, max-width ~720px. Attribution line at 13px SuisseIntl 400 #262d29, space, then the quote at 28px SuisseIntl Book 400 #262d29 with curly typographic quotes. Company name + heart icon below at 14px. Two carousel arrows centered beneath.

### Top Navigation
**Role:** Site-wide primary nav

Fixed top bar, cream background, no border or shadow. Logo 'airtree' at far left in SuisseIntl 400 ~21px #262d29. Three-column link group centered or right-aligned at 13px SuisseIntl Book 400, 9px gap, each link a small circle bullet + label. CTA button at far right.

### Nav Link Item
**Role:** Individual navigation entry

SuisseIntl Book 400 at 13px #262d29, preceded by a 4px circle outline dot in #262d29. No underline, no hover background change beyond subtle opacity. Padding 8px vertical.

### Portfolio Program Card
**Role:** Text-and-button promotional card

Cream background, 37px border-radius, padding 37px. Headline at SuisseIntl 600 21-33px #262d29. Yellow pill CTA below. No image — this is a textual card variant for programs/initiatives.

### Footer
**Role:** Site footer with links and legal

Cream background, 37px padding, single row of text links in 13px SuisseIntl Book 400 #262d29 separated by spacing. No dividers, no social icons beyond a simple wordmark repetition.

## Do's and Don'ts

### Do
- Use #ffff48 only for filled primary CTAs — it's the system's only saturated color and its power comes from scarcity.
- Set hero headlines in Prody at 131px with line-height 1.15; let the size do the work, never bold the weight.
- Apply 37px border-radius to all content cards; 18px to buttons; 8px to inputs and nav — this three-tier radius is the system.
- Build all text-heavy pages on the #f7f6e3 canvas with #262d29 type; never invert the page background within a light-mode page.
- Use SuisseIntl Book at 13px for nav, links, and input text; reserve SuisseIntl 500/600 for emphasized body and card titles.
- Space sections with 75–112px vertical gaps to let the cream breathe; dense blocks fight the editorial language.
- Render all portfolio company logos in monochrome #262d29 — color logos break the system's two-tone discipline.

### Don't
- Never introduce a second saturated color; if something needs emphasis, use the yellow or a weight change, not a new hue.
- Never use #ffff48 for body text, icons, or decorative fills — it is a button color only.
- Never set display type under 80px; Prody at 33px or below loses its editorial character and reads as body text.
- Don't add box-shadow to cards or buttons; the system relies on border-radius and background contrast, not elevation.
- Don't place photography on a white background — always carry the #f7f6e3 warmth behind images to maintain the paper feel.
- Don't use gradients on buttons, cards, or page backgrounds; the only gradient in the system is the hero's subtle sky-to-cream wash.
- Don't bold Prody at 131px — its 400 weight is the brand voice; adding weight flattens the contrast with the body grotesque.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f7f6e3` | Page background, section fills, card surfaces |
| 1 | Card Surface | `#f7f6e3` | Portfolio cards, program cards, testimonial blocks — same tone as canvas, defined by radius and padding |
| 2 | Ink Surface | `#262d29` | Dark mode blocks, navigation bars, footer on dark sections — used sparingly as a full-bleed invert |
| 3 | Accent Surface | `#ffff48` | Filled CTA buttons only — never as a section or card background |

## Imagery

Photography is documentary and naturalistic: candid founder walks in botanical settings, team groups in real environments, no studio lighting or lifestyle staging. Images are contained within 37px-rounded cards, edge-to-edge, with no text overlays competing. The hero uses a subtle sky-to-cream atmospheric wash with scattered organic dot decorations. No illustrations, no 3D renders, no abstract graphics — all visual energy comes from real photography and the oversized Prody type. Logos are wordmark-only, monochrome, sized to read as a calm horizontal strip rather than a wall of partners.

## Layout

Max-width 1280px centered, with sections using 75–112px vertical gaps to create editorial breathing room. The hero is a full-bleed atmospheric band (subtle blue-to-cream wash) with a centered Prody headline at 131px, then a horizontally scrollable card carousel. The portfolio section alternates between a full-width image carousel with edge-clipped photos and a monochrome logo strip centered beneath. Program/promotional cards are single-column text blocks stacked vertically with generous internal padding (37px). The testimonial section is a single centered text column, max-width ~720px, with carousel arrows directly below. Navigation is a minimal top bar with a left-aligned wordmark, centered link group, and right-aligned pill CTA — no sidebar, no mega-menu, no sticky shadow.

## Agent Prompt Guide

## Quick Color Reference
- Canvas / page background: #f7f6e3
- Primary text / ink: #262d29
- Card / content borders: #f7f6e3 (on cream) or #262d29 (on dark)
- Accent: #ffff48 (sparingly)
- primary action: #ffff48 (filled action)

## Example Component Prompts
1. **Hero Statement** — Cream canvas (#f7f6e3) with optional sky-to-cream wash overlay. Centered headline: Prody 400 at 131px, line-height 1.15, color #262d29. Optional subtext: SuisseIntl 400 at 19px, #262d29. Max-width 960px, vertical padding 112px top/bottom.

2. **Portfolio Card** — Image fills the card edge-to-edge, border-radius 37px, no border. Bottom-left label overlay: SuisseIntl 400 at 14px, #f7f6e3 text with subtle shadow over photography. Cards sit in a horizontal scroll row, 28px gap.

3. **Pill CTA (filled)** — Background #ffff48, text #262d29, border-radius 9999px, padding 8px 18px, font SuisseIntl 400 at 14px. One per section maximum.

4. **Testimonial Block** — Centered, max-width 720px. Attribution line: SuisseIntl 400 at 13px #262d29. Quote: SuisseIntl Book 400 at 28px #262d29 with curly typographic quotes. Company name + 12px heart icon below in #262d29. Two 40×40px ghost arrow buttons (8px radius, 1px #262d29 border) centered 37px below.

5. Create a Primary Action Button: #ffff48 background, #262d29 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Decorative Dot System

Scattered organic dots appear across the hero and section transitions as an ambient decorative layer. They float at varying sizes (4–12px diameter) in a single warm accent hue, distributed asymmetrically to create visual rhythm without pattern. The dots are purely atmospheric — they carry no data, no link, no interaction. On the cream canvas they read as confetti or pollen caught in light; their randomness is the point. Treat them as a page-layer decoration, not a component, and never replicate the pattern on every page — restrict them to hero and transitional sections.

## Similar Brands

- **Blackbird VC** — Same cream-paper canvas, oversized editorial display type, and monochrome two-tone palette with a single saturated accent
- **Index Ventures** — Spacious editorial layout with large display serifs, photographic content cards, and a restrained cream-and-ink palette
- **Accel** — Generous whitespace, large border-radius cards, and a confident single-accent approach to CTA buttons
- **Crane Venture Partners** — Editorial typography with oversized display heads, cream/ink color discipline, and a minimal nav bar with wordmark + link columns

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-cream: #f7f6e3;
  --color-ink-black: #262d29;
  --color-electric-lemon: #ffff48;

  /* Typography — Font Families */
  --font-prody: 'Prody', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl-book: 'SuisseIntl Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.15;
  --text-body: 16px;
  --leading-body: 1.15;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.15;
  --text-heading: 33px;
  --leading-heading: 1.15;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.15;
  --text-display: 131px;
  --leading-display: 1.15;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 75-112px;
  --card-padding: 37px;
  --element-gap: 9-20px;

  /* Border Radius */
  --radius-lg: 8.424px;
  --radius-2xl: 18.72px;
  --radius-3xl: 37.44px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 37px;
  --radius-pills: 9999px;
  --radius-buttons: 18px;

  /* Surfaces */
  --surface-canvas: #f7f6e3;
  --surface-card-surface: #f7f6e3;
  --surface-ink-surface: #262d29;
  --surface-accent-surface: #ffff48;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-cream: #f7f6e3;
  --color-ink-black: #262d29;
  --color-electric-lemon: #ffff48;

  /* Typography */
  --font-prody: 'Prody', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisseintl-book: 'SuisseIntl Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.15;
  --text-body: 16px;
  --leading-body: 1.15;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.15;
  --text-heading: 33px;
  --leading-heading: 1.15;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.15;
  --text-display: 131px;
  --leading-display: 1.15;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-lg: 8.424px;
  --radius-2xl: 18.72px;
  --radius-3xl: 37.44px;
}
```
