# Maëlan Le Meur — Style Reference
> Museum wall, warm parchment and tobacco — a portfolio printed on bone-colored paper with ink-black display type and deep umber chapter breaks.

**Theme:** mixed

Maëlan Le Meur is an editorial portfolio rendered in the voice of a printed art book: a warm parchment canvas (#eee9cc) carrying the entire interface, with deep tobacco and near-black blocks used as chapter dividers rather than chrome. Typography is a single weight — PP Neue Montreal 400 — stretched across an extreme scale that goes from 15px captions to 317px display words, creating hierarchy through size and whitespace alone rather than weight shifts or color emphasis. There are no buttons, no cards with shadows, no rounded containers in the conventional sense; the only radius that exists in the system is 40px, applied to link affordances. Every surface is a full-bleed band, every section is a typographic statement, and the whole composition reads like a gallery wall — confident, quiet, and unhurried.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#eee9cc` | `--color-parchment` | Primary canvas and card surface — the warm bone tone that carries all body content, tables, and quiet sections |
| Aged Linen | `#cecab1` | `--color-aged-linen` | Secondary surface and muted text — slightly deeper parchment for sub-surfaces, helper text, and table headers |
| Tobacco Brown | `#674825` | `--color-tobacco-brown` | Chapter-break sections and featured band backgrounds — rich warm umber that anchors the page's heaviest typographic moments |
| Midnight Espresso | `#1e1915` | `--color-midnight-espresso` | Full-bleed dark sections and navigation background — the near-black that creates the page's dramatic section breaks |
| Ink Black | `#111111` | `--color-ink-black` | Primary text and hairline rules — the deepest tone for body copy, headings, table content, and footer dividers |

## Tokens — Typography

### PP Neue Montreal — The sole typeface across the entire system — used at every size from 15px captions to 317px display words. Weight stays at 400 throughout, so hierarchy is built purely through scale, whitespace, and the choice of dark or light ground. This single-weight restraint is the signature: no bold, no italic, no medium — just one calm voice that gets larger or smaller depending on how much the page wants to say. Substitute with Inter or Söhne for similar geometric neutrality. · `--font-pp-neue-montreal`
- **Substitute:** Inter, Söhne, or any geometric grotesque at weight 400
- **Weights:** 400
- **Sizes:** 15px, 16px, 26px, 30px, 58px, 115px, 225px, 317px
- **Line height:** 0.95–1.50
- **Role:** The sole typeface across the entire system — used at every size from 15px captions to 317px display words. Weight stays at 400 throughout, so hierarchy is built purely through scale, whitespace, and the choice of dark or light ground. This single-weight restraint is the signature: no bold, no italic, no medium — just one calm voice that gets larger or smaller depending on how much the page wants to say. Substitute with Inter or Söhne for similar geometric neutrality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1.5 | — | `--text-caption` |
| body | 26px | 1.2 | — | `--text-body` |
| subheading | 30px | 1.2 | — | `--text-subheading` |
| heading-sm | 58px | 0.95 | — | `--text-heading-sm` |
| heading | 115px | 0.95 | — | `--text-heading` |
| heading-lg | 225px | 0.95 | — | `--text-heading-lg` |
| display | 317px | 0.95 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 210 | 210px | `--spacing-210` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 40px |
| buttons | 0px |

### Layout

- **Card padding:** 40px
- **Element gap:** 20px

## Components

### Full-Bleed Dark Section
**Role:** Chapter-break bands that segment the portfolio

Full-viewport-width section with #1e1915 background, white or parchment text, 210px vertical padding. Labeled in large type (58px+) left-aligned. These are not cards — they are architectural divisions of the page.

### Display Heading Block
**Role:** Hero and section statement typography

PP Neue Montreal 400 at 115–317px, line-height 0.95, text in #111111 on parchment or #eee9cc on dark. Characters often bleed off the right edge of the viewport — the type is cropped, not contained. No margin, no max-width constraint.

### Top Navigation Bar
**Role:** Persistent site navigation

Full-width bar with #1e1915 background. Brand name 'Maëlan' left-aligned in small caps at 15–16px. Three nav items (VOUS, RÉALISATIONS, ÉCRIVEZ-MOI) right-aligned in uppercase tracking. No borders, no background fill on items — pure typographic links.

### Text Navigation Link
**Role:** All interactive navigation throughout the site

PP Neue Montreal 400 at 15–16px, uppercase, color #eee9cc on dark or #111111 on parchment. No underline, no background, no border. The 40px radius from the data applies to the link's hit area or subtle pill treatment.

### Section Label Heading
**Role:** Category headers within the portfolio grid

26–30px PP Neue Montreal 400, #111111, left-aligned with generous left padding (40px). Used to label sections like 'Design de marque', 'Design d'objet', 'Design d'événement', 'Design web'.

### Quote / Manifesto Block
**Role:** Large typographic statement sections

Multi-line statement set at 58–115px PP Neue Montreal 400, line-height ~1.0, #111111 on #eee9cc background. Text fills the viewport width without a max-width container — lines are deliberately long, creating a rhythmic typographic wall.

### Project Table
**Role:** Portfolio listing of works

Three-column table (PROJET, DESCRIPTION, DATE) with header row in #cecab1 tone and body rows separated by 1px hairlines in #111111. Headers in small uppercase at 15px, body text at 16px. Full-width, no rounded corners, no cell padding asymmetry — strict editorial grid.

### Table Row
**Role:** Individual project entry

Single row with 20px vertical padding, separated by a 1px #111111 hairline. Project name in uppercase, description in mixed case, date right-aligned. No hover state, no background change — static editorial listing.

### Featured Band Header
**Role:** Page title section with warm color background

Full-width #674825 (Tobacco Brown) band with large display text in #eee9cc at 225px+. Used for major page transitions like 'Réalisations'. Text bleeds to the right edge of the viewport, creating a cropped, dramatic title treatment.

### Footer
**Role:** Site footer

Minimal footer using #111111 text on #eee9cc background. Small text at 15px, hairline 1px border-top in #111111. No links, no social icons, no columns — just attribution text.

## Do's and Don'ts

### Do
- Use PP Neue Montreal 400 at every size — never introduce bold, medium, or italic weights; the single-weight restraint is the signature
- Set all large display text (58px+) with line-height 0.95 to create the tight, architectural rhythm
- Apply 210px vertical padding to full-bleed section bands to create the gallery-wall breathing room
- Use #1e1915 and #674825 as full-bleed chapter breaks — never as card or component backgrounds
- Let display type bleed off the right viewport edge without a max-width container
- Build all navigation as typographic text links at 15–16px uppercase — no buttons, no pills, no fills
- Separate table rows with 1px #111111 hairlines — never use row backgrounds or zebra striping

### Don't
- Do not introduce accent colors, gradients, or chromatic highlights — the warm earth palette is the entire system
- Do not add shadows, elevations, or depth effects to any component — the design is intentionally flat
- Do not use rounded corners on cards, inputs, or containers — the only radius is 40px, reserved for link hit areas
- Do not set a max-width on hero or display sections — the type is meant to crop at the viewport edge
- Do not use color to indicate interactive states — links remain typographically identical across hover, active, and visited
- Do not add icons, badges, or decorative graphics inside text blocks — the typographic hierarchy carries all meaning
- Do not use line-height above 1.20 for any heading or display size — tight leading is essential to the editorial feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#eee9cc` | Default page background for all body content, tables, quotes, and text-heavy sections |
| 2 | Aged Linen Sub-surface | `#cecab1` | Muted secondary surface for table headers, helper zones, and slightly recessed text blocks |
| 3 | Tobacco Feature Band | `#674825` | Full-width featured sections with display typography — creates warm color punctuation |
| 4 | Midnight Espresso Break | `#1e1915` | Full-bleed dark section dividers, navigation bar, and the page's dramatic dark bands |

## Elevation

The system is entirely flat — no shadows, no glows, no elevation. Depth is created exclusively through the contrast between the warm parchment canvas and the deep umber/espresso section bands. Components sit on the page as typographic statements, not as raised surfaces.

## Imagery

No photography, illustration, or decorative imagery in the conventional sense. The visual content IS the typography — oversized words like 'Réalisations' at 225px+ serve as the hero imagery. The only graphic element is a serif/italic 'M' monogram used as a brand mark on dark sections. The portfolio itself is text-only (project names, descriptions, dates) — no thumbnails, no project images, no case study visuals. This is a purely typographic portfolio.

## Agent Prompt Guide

**Quick Color Reference**
- text: #111111
- background: #eee9cc
- border: #111111
- accent: #674825 (Tobacco Brown)
- dark section: #1e1915 (Midnight Espresso)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Full-bleed dark section**: Background #1e1915, full viewport width, 210px padding-top and padding-bottom. Section label in PP Neue Montreal 400 at 58px, color #eee9cc, left-aligned with 40px padding-left. Text reads 'Design de marque'.

2. **Display heading block**: PP Neue Montreal 400 at 225px, line-height 0.95, color #111111 on #eee9cc background. Text: 'Je construis des images aux formes simples et harmonieuses.' The text should fill the full viewport width without a max-width container, bleeding off the right edge.

3. **Project table**: Three columns (PROJET, DESCRIPTION, DATE) on #eee9cc background. Header row in 15px PP Neue Montreal 400, uppercase, color #111111, with 20px vertical padding. Body rows at 16px PP Neue Montreal 400, separated by 1px #111111 hairlines. No row backgrounds, no hover states.

4. **Top navigation bar**: Full-width #1e1915 bar, 15–16px PP Neue Montreal 400. Brand name 'Maëlan' left-aligned in #eee9cc. Three nav items (VOUS, RÉALISATIONS, ÉCRIVEZ-MOI) right-aligned, uppercase, color #eee9cc. No borders, no background fills on links, no underline.

5. **Featured band header**: Full-width #674825 (Tobacco Brown) section with display text 'Réalisations' at 225px PP Neue Montreal 400, color #eee9cc, line-height 0.95. Text left-aligned, bleeding to the right viewport edge. 210px vertical padding.

## Typographic Philosophy

The single-weight constraint (PP Neue Montreal 400 only) is the system's most radical choice. In a landscape where most sites use 3–4 weights to create hierarchy, this design creates hierarchy through scale alone — from 15px captions to 317px display words. The tight line-heights (0.95) on large sizes create an architectural, almost monolithic quality. This is a design that trusts whitespace and scale to do the work that weight and color do elsewhere.

## Similar Brands

- **Studio Dumbar** — Same editorial portfolio approach with single-weight typography, full-bleed color bands, and oversized display type that bleeds off the viewport edge
- **Pentagram** — Identical typographic-first portfolio language — no decorative imagery, project listings as text tables, warm neutral canvas, and display type as the primary visual element
- **A Practice for Everyday Life** — Same museum-catalog sensibility with earth-tone palette, single-weight sans-serif, and section-based page architecture with generous vertical rhythm
- **Heydays (Oslo)** — Same warm parchment canvas, restrained earth-tone palette, and editorial typographic hierarchy built through scale rather than weight variation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #eee9cc;
  --color-aged-linen: #cecab1;
  --color-tobacco-brown: #674825;
  --color-midnight-espresso: #1e1915;
  --color-ink-black: #111111;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.5;
  --text-body: 26px;
  --leading-body: 1.2;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --text-heading-sm: 58px;
  --leading-heading-sm: 0.95;
  --text-heading: 115px;
  --leading-heading: 0.95;
  --text-heading-lg: 225px;
  --leading-heading-lg: 0.95;
  --text-display: 317px;
  --leading-display: 0.95;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-210: 210px;

  /* Layout */
  --card-padding: 40px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 40px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-parchment-canvas: #eee9cc;
  --surface-aged-linen-sub-surface: #cecab1;
  --surface-tobacco-feature-band: #674825;
  --surface-midnight-espresso-break: #1e1915;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #eee9cc;
  --color-aged-linen: #cecab1;
  --color-tobacco-brown: #674825;
  --color-midnight-espresso: #1e1915;
  --color-ink-black: #111111;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.5;
  --text-body: 26px;
  --leading-body: 1.2;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --text-heading-sm: 58px;
  --leading-heading-sm: 0.95;
  --text-heading: 115px;
  --leading-heading: 0.95;
  --text-heading-lg: 225px;
  --leading-heading-lg: 0.95;
  --text-display: 317px;
  --leading-display: 0.95;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-210: 210px;

  /* Border Radius */
  --radius-3xl: 40px;
}
```
