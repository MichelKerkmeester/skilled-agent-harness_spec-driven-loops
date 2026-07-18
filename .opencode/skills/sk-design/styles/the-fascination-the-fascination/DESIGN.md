# The Fascination The Fascination — Style Reference
> Sunday lifestyle magazine on cream paper. Warm off-white canvas, editorial photography grid, quiet sans-serif body type interrupted by handwritten script accents, with one vivid electric blue doing all the interactive work as link color and border accent — never as filled buttons.

**Theme:** light

The Fascination reads like a Sunday lifestyle magazine printed on warm cream paper: editorial photography dominates, type stays quiet, and color only appears as small chromatic punctuation. A geometric sans (Graphik) carries all functional text while a handwritten script (Qwitcher Grypen) interrupts section headers with hand-drawn personality. The vivid electric blue is reserved exclusively for links, borders, and interactive accents — never as filled button backgrounds — creating a system where the page feels mostly monochrome and blue is the only 'switched on' signal. Cards and product reviews float on subtle parchment surfaces (#efe8dc) against a cream canvas (#fbfbf7), with generous spacing and a tight 6px radius on interactive elements that keeps everything feeling tactile and paper-like.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#fbfbf7` | `--color-cream-paper` | Page canvas, primary background |
| Parchment | `#efe8dc` | `--color-parchment` | Card surfaces, secondary elevated backgrounds, subtle warm wash |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, card borders, heading text |
| Stone Gray | `#767676` | `--color-stone-gray` | Muted helper text, secondary metadata, input borders |
| Charcoal Slate | `#1a202c` | `--color-charcoal-slate` | Body text alternative, link text on light surfaces |
| Gunmetal | `#1f2937` | `--color-gunmetal` | Input text, dark UI element borders |
| Iron Gray | `#4b5563` | `--color-iron-gray` | Subtle borders, low-emphasis text |
| Electric Blue | `#2ea3f2` | `--color-electric-blue` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Deep Violet | `#4c40e0` | `--color-deep-violet` | Heading text, brand wordmark color, editorial display text |
| Indigo Bloom | `#454ad3` | `--color-indigo-bloom` | Secondary heading text, section title accents |
| Marigold | `#ffd92a` | `--color-marigold` | Decorative highlight wash, seasonal accent blocks |
| Sage Splash | `#91dea8` | `--color-sage-splash` | Decorative soft accent, editorial section markers |
| Sky Mist | `#90d3e3` | `--color-sky-mist` | Decorative cool accent, editorial section markers |

## Tokens — Typography

### Graphik — Primary UI and editorial typeface — all body copy, headlines, navigation, buttons, links, and functional text. Weight 400 for body, 500 for sub-emphasis, 700 for strong headlines, 100 as dramatic thin display · `--font-graphik`
- **Substitute:** Inter, Söhne, or DM Sans
- **Weights:** 100, 400, 500, 700
- **Sizes:** 12, 14, 16, 18, 20, 24, 30, 96px
- **Line height:** 1.20–1.70 body, 0.80–1.02 display
- **Role:** Primary UI and editorial typeface — all body copy, headlines, navigation, buttons, links, and functional text. Weight 400 for body, 500 for sub-emphasis, 700 for strong headlines, 100 as dramatic thin display

### Qwitcher Grypen — Decorative handwritten script used exclusively for editorial section accents and brand voice moments — never for functional UI text. Its appearance next to geometric sans creates the magazine-spread tension · `--font-qwitcher-grypen`
- **Substitute:** Caveat, Dancing Script, or Allura
- **Weights:** 400
- **Sizes:** 48, 60px
- **Line height:** normal
- **Role:** Decorative handwritten script used exclusively for editorial section accents and brand voice moments — never for functional UI text. Its appearance next to geometric sans creates the magazine-spread tension

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.53 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 20px | 1.33 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 30px | 1.2 | — | `--text-heading-lg` |
| display | 48px | 1.02 | — | `--text-display` |
| hero | 96px | 0.8 | — | `--text-hero` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 6px |
| buttons | 6px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Navigation Header
**Role:** Top bar site navigation

Minimal top header on Cream Paper (#fbfbf7) background. Wordmark left in Graphik 700 at ~20px. Search icon and 'Advertiser Disclosure' dropdown right-aligned. No background fill or border — sits directly on the warm canvas. Generous vertical padding ~32px.

### Category Filter Tab — Active
**Role:** Selected category filter

Outlined pill button. Electric Blue (#2ea3f2) 1px border, 6px radius, ~8px 16px padding. Text in Graphik 500 at 14px, color #2ea3f2. The blue border is the sole 'active' signal — no fill.

### Category Filter Tab — Inactive
**Role:** Unselected category filter

Outlined pill button. #000000 1px border, 6px radius, ~8px 16px padding. Text in Graphik 400 at 14px, color #000000. No fill, just a thin black outline.

### Section Header with Script Accent
**Role:** Editorial section divider

Two-part type composition. Category label in Qwitcher Grypen script at 48–60px in a brand violet (#4c40e0) or decorative accent. Section title in Graphik 700 at 24–30px in Ink Black (#000000). The script-handwritten-to-clean-sans contrast is the signature move.

### Product Review Card
**Role:** Article tile in content grid

Full-bleed photograph on top (no border-radius on images — they run edge-to-edge within their grid cell). Below: category label in Graphik 400 at 12px in a muted category color, then article title in Graphik 700 at ~18px in Ink Black. No card background fill; sits directly on Cream Paper. ~16px gap between image and text.

### Hero Banner
**Role:** Top-of-page editorial hero

Full-bleed lifestyle photograph with overlaid product imagery. Type sits over image with no background plate. Thin Electric Blue (#2ea3f2) 1px borders frame accent elements. No shadow or overlay gradient — photography is the atmosphere.

### Newsletter Modal
**Role:** Email capture overlay

Centered card on a deep space/nebula photograph background (#1a0d2 area). Headline in Graphik 700 at 24px white. Body copy in Graphik 400 at 14–16px white. Email input: full-width, 1px white border, transparent background, white placeholder text, 6px radius. Submit button: filled Electric Blue (#2ea3f2) background, white text, Graphik 700 at 14px, 6px radius, full-width. Close X in top-right corner.

### Outlined Link / Interactive Border
**Role:** Inline links and bordered interactive elements

The system's primary interactive pattern. 1px Electric Blue (#2ea3f2) border, 6px radius. Text in #2ea3f2 Graphik 400–500. No fill. This outlined approach is used consistently instead of filled CTA buttons.

### Content Image Grid
**Role:** Multi-column product review layout

3-column grid of Product Review Cards. ~22px row and column gap. Cards align to a clean editorial grid — no alternating sizes, no masonry. Images maintain consistent aspect ratios within each row.

### Category Tag Label
**Role:** Small metadata text above article titles

Graphik 400 at 12–14px. Color varies by category: Fashion uses #9333ea violet range, Food & Drink uses muted earthy tones. No background fill or border — just colored text acting as a section identifier.

## Do's and Don'ts

### Do
- Use Electric Blue (#2ea3f2) exclusively as outlined link/border color and interactive text — never as a filled button background
- Maintain the warm cream canvas (#fbfbf7) as the base for all pages; introduce Parchment (#efe8dc) only for subtle card surface elevation
- Pair Qwitcher Grypen script with Graphik sans for section headers — the handwritten-to-geometric contrast is the editorial signature
- Use weight 100 Graphik at 96px for hero/display type — extreme thinness at extreme size creates editorial drama
- Keep all card and image corners square (0px radius) — only interactive elements (buttons, links, inputs) get the 6px radius
- Use 8px base unit consistently: 8/16/24/32/48px for all padding, margins, and gaps
- Let photography be the visual atmosphere; avoid heavy overlays, gradients, or decorative chrome on images

### Don't
- Don't use Electric Blue (#2ea3f2) as a filled button background — the system defines blue as an outlined/border accent only
- Don't use Qwitcher Grypen script for functional UI text, navigation, buttons, or form labels — it's decorative only
- Don't add box-shadows, drop-shadows, or elevation effects to cards — the system relies on surface color contrast and hairline borders, not shadow depth
- Don't introduce new chromatic colors for interactive elements — the two-color accent system (blue + violet) is complete
- Don't use rounded corners on images, cards, or content containers — the 0px radius on surfaces vs 6px on interactives is intentional
- Don't use dark mode patterns or dark surfaces for content — the cream canvas is the brand identity, not a theme variant
- Don't mix the decorative accents (Marigold, Sage, Sky Mist) with functional UI — they are editorial decoration only, never interactive states

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#fbfbf7` | Base page canvas, all content sits on this warm off-white |
| 1 | Parchment | `#efe8dc` | Elevated card surfaces, product review containers, subtle warm separation |

## Imagery

Photography is the dominant visual language: full-bleed lifestyle and product photography fills the page. Images are square-cropped or maintain consistent aspect ratios within a strict 3-column grid. No rounded corners on photography — images run edge-to-edge in their grid cells with sharp edges. The photography style is bright, high-key, editorial product photography with clean white or pastel backgrounds. No duotone treatment, no color grading beyond natural product color. The newsletter modal uses a contrasting deep-space/cosmic photograph as background, creating a dramatic break from the cream-and-photo editorial rest of the site. Icons are minimal and functional (search icon, close X), thin-stroked, monochromatic.

## Layout

Max-width ~1200px centered content on a full-bleed cream canvas. Navigation is a minimal top bar with wordmark left, utility links right. The hero area features a large lifestyle photograph with overlaid product imagery, followed by a horizontal scrollable category filter row. Content flows in a 3-column card grid for product reviews, with square or 4:3 image crops. Section headers use a two-part type composition (script accent + bold sans title) and separate content blocks by category. The page reads top-to-bottom as: nav → hero photo with product overlay → category filters → first content grid → section break with script header → next category grid. No sidebar, no asymmetric layouts — everything centers on a clean editorial grid with generous 48px section gaps.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #fbfbf7 (Cream Paper)
- surface/card: #efe8dc (Parchment)
- text: #000000 (Ink Black)
- muted text: #767676 (Stone Gray)
- accent/interactive: #2ea3f2 (Electric Blue) — links and borders only
- primary action: #2ea3f2 (outlined action border)

**Example Component Prompts**
1. Build a category filter tab row: horizontal row of pill-shaped outlined buttons, 6px radius, 8px 16px padding, 16px gap. Active tab: 1px #2ea3f2 border, text #2ea3f2 Graphik 500 14px. Inactive: 1px #000000 border, text #000000 Graphik 400 14px. No fills.

2. Build a product review card for a 3-column grid: top half is a full-bleed product photograph with 0px radius edges, bottom half has 16px padding with a category label in Graphik 400 12px in a muted tone, then article title in Graphik 700 18px #000000. No card background, no shadow, no border.

3. Build a section header: two-part composition — decorative script in Qwitcher Grypen (or Caveat substitute) at 48px in #4c40e0, positioned above a Graphik 700 24px #000000 section title. Left-aligned, 32px gap between the two lines.

4. Build the newsletter modal: centered card ~500px wide on a cosmic/nebula photograph background. Headline Graphik 700 24px white. Email input: full-width, 1px white border, transparent bg, white placeholder, 6px radius, Graphik 400 14px. Submit button: full-width, #2ea3f2 fill (only place filled blue is acceptable), white text Graphik 700 14px, 6px radius, 12px 16px padding.

5. Build the top navigation: Cream Paper (#fbfbf7) background, no border or shadow. Left: wordmark 'The Fascination' in Graphik 700 20px #000000. Right: search icon (thin line, 16px) and 'Advertiser Disclosure' with dropdown caret in Graphik 400 14px #000000. 32px vertical padding, max-width 1200px centered.

## Similar Brands

- **The Strategist (NY Mag)** — Same editorial product-review grid on warm background, category-driven content architecture, photography-forward cards with category labels above titles
- **Wirecutter** — Same product review density, sans-serif editorial type, clean image-grid layout with minimal chrome around content
- **Cup of Jo** — Same lifestyle-magazine warmth, cream background, serif/script decorative accents, editorial grid with large lifestyle photography
- **The Everygirl** — Same warm off-white canvas, editorial review content structure, category filter tabs, lifestyle photography dominance

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #fbfbf7;
  --color-parchment: #efe8dc;
  --color-ink-black: #000000;
  --color-stone-gray: #767676;
  --color-charcoal-slate: #1a202c;
  --color-gunmetal: #1f2937;
  --color-iron-gray: #4b5563;
  --color-electric-blue: #2ea3f2;
  --color-deep-violet: #4c40e0;
  --color-indigo-bloom: #454ad3;
  --color-marigold: #ffd92a;
  --color-sage-splash: #91dea8;
  --color-sky-mist: #90d3e3;

  /* Typography — Font Families */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-qwitcher-grypen: 'Qwitcher Grypen', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.53;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.02;
  --text-hero: 96px;
  --leading-hero: 0.8;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 6px;
  --radius-buttons: 6px;

  /* Surfaces */
  --surface-cream-paper: #fbfbf7;
  --surface-parchment: #efe8dc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #fbfbf7;
  --color-parchment: #efe8dc;
  --color-ink-black: #000000;
  --color-stone-gray: #767676;
  --color-charcoal-slate: #1a202c;
  --color-gunmetal: #1f2937;
  --color-iron-gray: #4b5563;
  --color-electric-blue: #2ea3f2;
  --color-deep-violet: #4c40e0;
  --color-indigo-bloom: #454ad3;
  --color-marigold: #ffd92a;
  --color-sage-splash: #91dea8;
  --color-sky-mist: #90d3e3;

  /* Typography */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-qwitcher-grypen: 'Qwitcher Grypen', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.53;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.02;
  --text-hero: 96px;
  --leading-hero: 0.8;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 6px;
}
```
