# Ingmar Coenen — Style Reference
> Oversized masthead on white paper — a 295px geometric letterform pressed against a vast white wall, with tiny serif footnotes and pill-shaped navigation floating below.

**Theme:** light

Ingmar Coenen's portfolio operates as an editorial gallery wall: a single colossal Megazoid wordmark dominates the top of the page like a magazine masthead, then the system retreats into ruthless white-space and tiny Swiss-type UI. The entire color palette is binary — pure black on pure white with one warm stone-gray for ghost controls — because the work itself is supposed to carry the color. Typography is the brand: a 295px geometric display face (Megazoid) for monumental headings, ITC Garamond Light Condensed for reflective serif body copy, and Neue Haas Unica Pro at 12-13px with negative tracking for all interface chrome. Components are minimal and rounded — 100px pill buttons, 12px cards — creating a tension between the heavy display voice and the soft, almost cartoonish corner radii. Density is compact at the UI level (4-14px gaps) but generous in layout (80-120px section breathing room).

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Black | `#000000` | `--color-pure-black` | Primary text, logo wordmark, filled pill buttons, hairline borders — the structural ink that holds every element together |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surfaces, button text on dark fills — the paper everything sits on |
| Charcoal Slate | `#3a4042` | `--color-charcoal-slate` | Secondary text, link color, body copy, subtle borders — slightly softened black for hierarchy below the primary text level |
| Pale Stone | `#f2f2f2` | `--color-pale-stone` | Ghost button and segmented toggle background — the only non-white surface, used for inactive controls like the Grid/List switcher |
| Mid Gray | `#919191` | `--color-mid-gray` | Muted helper text, low-emphasis borders, disabled states |
| Silver | `#cccccc` | `--color-silver` | Lightest border tone, placeholder outlines, decorative strokes |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Megazoid — Monumental display wordmark for the site title and any project-level hero headings. Ultra-heavy geometric letterforms at near-zero line-height, used sparingly as a single full-bleed statement that bleeds past container edges. The Fill variant is used for filled/knockout versions of the same glyphs. · `--font-megazoid`
- **Substitute:** Druk Wide, Antonio Bold, or a heavy geometric display like Objektiv Blk
- **Weights:** 400
- **Sizes:** 295px
- **Line height:** 0.90
- **Role:** Monumental display wordmark for the site title and any project-level hero headings. Ultra-heavy geometric letterforms at near-zero line-height, used sparingly as a single full-bleed statement that bleeds past container edges. The Fill variant is used for filled/knockout versions of the same glyphs.

### ITC Garamond Std Light Condensed — Editorial serif for reflective about/bio paragraphs and any long-form copy that needs a literary voice. The Light Condensed cut is deliberately anti-corporate — it reads as a thoughtful side note against the massive Megazoid masthead, not as marketing prose. · `--font-itc-garamond-std-light-condensed`
- **Substitute:** Cormorant Garamond Light, EB Garamond Light, or Playfair Display
- **Weights:** 400
- **Sizes:** 36px
- **Line height:** 0.94
- **Role:** Editorial serif for reflective about/bio paragraphs and any long-form copy that needs a literary voice. The Light Condensed cut is deliberately anti-corporate — it reads as a thoughtful side note against the massive Megazoid masthead, not as marketing prose.

### Neue Haas Unica Pro — Primary UI and body typeface — the workhorse for navigation labels, project metadata, links, and inline annotations. Set extremely tight at -0.02em letter-spacing and 1.1 line-height, giving labels a compact, Swiss-catalog density. · `--font-neue-haas-unica-pro`
- **Substitute:** Inter, Neue Haas Grotesk, or Helvetica Neue Medium
- **Weights:** 400
- **Sizes:** 12px, 13px
- **Line height:** 1.10
- **Letter spacing:** -0.02em
- **Role:** Primary UI and body typeface — the workhorse for navigation labels, project metadata, links, and inline annotations. Set extremely tight at -0.02em letter-spacing and 1.1 line-height, giving labels a compact, Swiss-catalog density.

### Megazoid Regular — Megazoid Regular — detected in extracted data but not described by AI · `--font-megazoid-regular`
- **Weights:** 400
- **Sizes:** 295px
- **Line height:** 0.9
- **Role:** Megazoid Regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| heading | 36px | 0.94 | — | `--text-heading` |
| display | 295px | 0.9 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| images | 12px |
| buttons | 100px |
| smallElements | 4px |

### Layout

- **Section gap:** 80px
- **Card padding:** 14px
- **Element gap:** 10px

## Components

### Sticky Navigation Bar
**Role:** Persistent top header with rounded pill nav items and a CTA

Full-width white bar with no visible border, floated 8px from the top edge. Left cluster: three pill-shaped nav links ('Work', 'About', 'Capabilities') with 100px radius, 9px top padding, 14px horizontal padding, 12px Neue Haas Unica Pro Medium text in #000000. Right cluster: a filled black 'Start a project' pill button with white text. The bar sits as a floating island on scroll with subtle shadow or just edge proximity.

### Filled Pill Button
**Role:** Primary action — the only chromatic-strength CTA in the system

100px border-radius, #000000 background, #ffffff text. Horizontal padding 14px, vertical padding 9px. Neue Haas Unica Pro 12px medium, letter-spacing -0.02em. No border. The fully rounded shape softens what would otherwise be an aggressive black block — a signature decision that makes the CTA feel friendly despite the monochrome severity.

### Ghost Nav Pill
**Role:** Inactive or default nav link

Same 100px radius and 12px Neue Haas Unica Pro text as the filled button, but transparent background and #000000 text. On hover or active state, background fills to #000000 with text inverting to #ffffff — a single-color toggle rather than introducing any new hue.

### Segmented View Toggle
**Role:** Grid/List layout switcher at page bottom

Two adjacent pill segments ('Grid' and 'List') in a shared capsule. Active segment: #000000 background with #ffffff text. Inactive segment: #f2f2f2 background with #000000 text. 100px radius on outer container, shared internal gap of 4px. 12px Neue Haas Unica Pro labels.

### Work Card — Image
**Role:** Project tile with a product/photograph area

Full-bleed image inside a 12px-radius container, no visible card border. Metadata (project name, client, number) overlaid in white Neue Haas Unica Pro 12px at lower-left of the image, set with -0.02em tracking. Aspect ratio varies per project but always cropped tight — the object is the hero, no decorative framing.

### Work Card — Typographic
**Role:** Project tile expressed as type-only artwork

Cream/warm-white background surface within a 12px-radius card. Central content is a circular arrangement of repeated text (e.g. 'Haven-1' rotating around a circle) with a small caps center label ('MICROGRAVITY RESEARCH LAB') set in Neue Haas Unica Pro 12px. No photographic element — the typography itself is the project artifact.

### About Paragraph Block
**Role:** Long-form bio copy

Right-aligned or right-anchored text block set in ITC Garamond Std Light Condensed 36px, line-height 0.94, #000000. No max-width constraint — text sits as a narrow column aligned to the right margin. The extremely tight line-height at display size gives the paragraph a compressed, almost headline-like weight despite being body copy.

### Masthead Wordmark
**Role:** The site identity — a full-bleed display heading

Megazoid Regular at 295px, line-height 0.9, #000000, set flush-left and bleeding past viewport edges. Single line. No margin above or below — it IS the page. The Megazoid Fill variant may be used for knock-out or reversed treatments on dark surfaces.

### Link with Underline
**Role:** Inline link in body or nav context

Neue Haas Unica Pro 12px, #3a4042 text, 1px solid #3a4042 underline offset ~4px from baseline. No hover state color change — only weight or underline thickness shifts. Underline acts as a hairline divider rather than decorative emphasis.

### Card Metadata Label
**Role:** Small caps project metadata overlaid on images

Neue Haas Unica Pro 12px, letter-spacing -0.02em, uppercase, #ffffff on dark images or #3a4042 on light surfaces. Set in a tight two-line stack (name on line 1, detail on line 2) with ~4px row gap.

## Do's and Don'ts

### Do
- Use Megazoid at 295px with line-height 0.9 for any site-level display heading — it is the only element that earns full-bleed real estate
- Set all UI text in Neue Haas Unica Pro 12-13px with letter-spacing -0.02em and line-height 1.1
- Use 100px border-radius on every interactive element (buttons, nav pills, toggles) to soften the monochrome severity
- Reach for ITC Garamond Light Condensed 36px for any reflective or editorial paragraph longer than two lines
- Maintain 80-120px vertical breathing room between major layout sections
- Keep the entire palette to black, white, charcoal, and pale stone — let project imagery supply any color
- Use 12px radius for all cards and image containers, 4px for inline elements and hairline details

### Don't
- Never introduce a chromatic color — the 0% colorfulness is structural to the brand
- Never set body copy below 12px or above 36px (the type system is intentionally a two-scale system: tiny UI and monumental display)
- Never use box-shadows for elevation — rely on the stark black/white contrast and 12px corner radius for surface separation
- Never center-align the Garamond about paragraph — it lives right-anchored as a deliberate editorial decision
- Never use a system font for body or nav — Neue Haas Unica Pro's tight tracking is the signature, not a fallback
- Never add decorative gradients, textures, or background patterns to cards or surfaces
- Never use line-height above 1.2 on Neue Haas Unica Pro — the tight 1.1 is part of the Swiss-catalog character

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Default page background, the dominant visual field |
| 2 | Stone Fill | `#f2f2f2` | Ghost controls and inactive toggle segments |
| 3 | Ink Surface | `#000000` | Filled pill buttons and the inverted logo zone |

## Elevation

- **Floating Navigation Bar:** `0 2px 12px rgba(0,0,0,0.06)`

## Imagery

Photography is product-focused and tightly cropped — objects fill the frame with no lifestyle context or environmental staging. The wood furniture piece in the work grid is shot against a neutral studio ground with dramatic shadow, treating the object as sculpture. There is no people photography, no color-grading beyond natural tones, and no decorative illustration. Type-only project cards (like the 'Haven-1' circular composition) replace imagery when the project IS the typography. The visual density is overwhelmingly text-and-object — no atmospheric or environmental photography appears anywhere.

## Layout

The page opens with a full-bleed monumental wordmark (INGMAR at 295px) that bleeds past both viewport edges, establishing a magazine-cover hierarchy. Below the masthead, a floating sticky nav bar sits as a horizontal island. The about paragraph is right-anchored to the right margin, creating a deliberate asymmetry against the left-aligned logo. The work section uses a 2-column grid of project cards with varying aspect ratios — image cards on one side, typographic cards on the other — creating a checkerboard rhythm. Cards use 12px radius and no visible borders; separation is achieved through white space alone. At the page bottom, a compact Grid/List toggle anchors the layout. Section gaps are 80-120px, generous enough to let the massive type breathe while keeping the UI itself compact. Navigation is a single sticky top bar with no sidebar, no mega-menu, no footer beyond the view toggle.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #3a4042
- accent: #000000 (used for filled pill buttons — the only 'accent' in this binary system)
- muted text: #919191
- ghost surface: #f2f2f2
- primary action: #000000 (filled action)

**Example Component Prompts**

1. Create a sticky navigation bar: white #ffffff background, 100px-radius pill nav links on the left in Neue Haas Unica Pro 12px #000000 with 14px horizontal and 9px vertical padding. On the right, a filled black pill button (#000000 bg, #ffffff text, 100px radius, same padding) reading 'Start a project'. The bar floats 8px from the top with a subtle 0 2px 12px rgba(0,0,0,0.06) shadow.

2. Create a monumental masthead: Megazoid Regular 295px, line-height 0.9, #000000, set flush-left bleeding past viewport edges, occupying the full top of the page with no margin.

3. Create a work grid card: 12px border-radius container, full-bleed product photograph inside, with overlaid metadata in Neue Haas Unica Pro 12px #ffffff, letter-spacing -0.02em, uppercase, positioned at lower-left with 14px padding.

4. Create an about paragraph: ITC Garamond Std Light Condensed 36px, line-height 0.94, #000000, right-anchored to the right margin, no max-width constraint, reading as a narrow editorial column.

5. Create a Grid/List toggle: two adjacent pill segments in a shared 100px-radius capsule, 4px gap between them. Active segment #000000 bg with #ffffff text, inactive segment #f2f2f2 bg with #000000 text. Labels in Neue Haas Unica Pro 12px.

## Typographic Philosophy

The system runs on a three-voice type hierarchy that creates deliberate tension: Megazoid shouts at 295px as a once-per-page masthead, Garamond Light Condensed whispers at 36px in editorial paragraphs, and Neue Haas Unica Pro at 12px with -0.02em tracking handles all functional UI. No font bridges these three scales — there is no 40px or 60px intermediate. This means any new page either commits to the monumental register (Megazoid) or the micro-catalog register (Unica), and Garamond only appears for human-voiced, reflective copy. The negative letter-spacing on the UI font and the extreme tightness of the display line-heights (0.9-0.94) are the signature: the type feels compressed and confident rather than airy and friendly.

## Similar Brands

- **Pentagram** — Same editorial-portfolio approach: massive type as identity, monochromatic severity, work presented as generous full-bleed case study cards
- **Rauno Freiberg** — Same Swiss-grid minimalism with oversized display type dominating a white canvas and tiny UI labels in a tight sans-serif
- **Locomotive (locomotive.ca)** — Same dark-text-on-white discipline with a large custom wordmark, pill-shaped navigation, and project-grid card layouts
- **Manuel Bortoletti** — Same monolithic typographic identity — a single oversized display letterform at the top of the page against a vast white field
- **Haus** — Same pill-button navigation over a minimal white portfolio layout with tight Swiss sans-serif UI labels

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-black: #000000;
  --color-canvas-white: #ffffff;
  --color-charcoal-slate: #3a4042;
  --color-pale-stone: #f2f2f2;
  --color-mid-gray: #919191;
  --color-silver: #cccccc;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-megazoid: 'Megazoid', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-itc-garamond-std-light-condensed: 'ITC Garamond Std Light Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-unica-pro: 'Neue Haas Unica Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-megazoid-regular: 'Megazoid Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-heading: 36px;
  --leading-heading: 0.94;
  --text-display: 295px;
  --leading-display: 0.9;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 14px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 200px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-images: 12px;
  --radius-buttons: 100px;
  --radius-smallelements: 4px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-stone-fill: #f2f2f2;
  --surface-ink-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-black: #000000;
  --color-canvas-white: #ffffff;
  --color-charcoal-slate: #3a4042;
  --color-pale-stone: #f2f2f2;
  --color-mid-gray: #919191;
  --color-silver: #cccccc;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-megazoid: 'Megazoid', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-itc-garamond-std-light-condensed: 'ITC Garamond Std Light Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-unica-pro: 'Neue Haas Unica Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-megazoid-regular: 'Megazoid Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-heading: 36px;
  --leading-heading: 0.94;
  --text-display: 295px;
  --leading-display: 0.9;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 200px;
}
```
