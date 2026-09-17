# clau.as.kee — Style Reference
> lavender poster wall, monumental type. A flat periwinkle field with a single black-letter sculpture filling the viewport and a thin line of small nav text floating above it.

**Theme:** light

clau.as.kee is a typographic monolith on a field of periwinkle. The page is essentially one giant poster: a single lavender canvas (#8e93ff) carries colossal custom-drawn letterforms that dwarf everything else, while a thin black hairline system and one jarring green badge do the work of UI. Almost no component vocabulary exists — navigation, headlines, and portfolio frames are all variations of oversized type and flat color blocks. The design is anti-SaaS: no cards, no shadows, no buttons-as-pills, no soft radii. The restraint is total: two neutrals (black ink, paper white), one saturated background, one green signal. When new pages are built, the first decision is canvas: lavender. The second is scale: type must be monumental or it is wrong.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Periwinkle Field | `#8e93ff` | `--color-periwinkle-field` | Page canvas, hero background, full-bleed section fills — the single defining brand color, a mid-saturation lavender that swallows the viewport and against which all type is set in black ink |
| Carbon Ink | `#1a1a1a` | `--color-carbon-ink` | Primary text, display type, hairline borders, dark panels, nav links — near-black rather than pure black, keeps the lavender from vibrating too hard |
| Paper White | `#ffffff` | `--color-paper-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Signal Green | `#47f654` | `--color-signal-green` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |

## Tokens — Typography

### Beastly clauworks — Display / wordmark — the proprietary display face, used only at monumental scale (288–504px) for the brand wordmark and hero sculpture. Chunky, almost stencil-cut geometric forms that read as a graphic object rather than readable text. Single weight, no italic. Substitute: a heavy display grotesque like Druk Wide or a custom commission. Do not use at small sizes — this face is architecture, not communication. · `--font-beastly-clauworks`
- **Weights:** 400
- **Sizes:** 288px, 504px
- **Line height:** 1.00–1.05
- **Letter spacing:** normal
- **Role:** Display / wordmark — the proprietary display face, used only at monumental scale (288–504px) for the brand wordmark and hero sculpture. Chunky, almost stencil-cut geometric forms that read as a graphic object rather than readable text. Single weight, no italic. Substitute: a heavy display grotesque like Druk Wide or a custom commission. Do not use at small sizes — this face is architecture, not communication.

### Suisse Intl clauworks — Headlines, subheads, and long-form body — a custom-cut Suisse International (Swiss grotesque) in a single weight. Used at three distinct scales: 20px for body and nav, 30px for section subheads, 144px for editorial display headings like 'Art direction – Dig…'. The absence of bold/medium weights is the signature: everything is the same quiet weight, hierarchy comes from size alone. Substitute: Suisse Int'l, Inter, or Neue Haas Grotesk. · `--font-suisse-intl-clauworks`
- **Weights:** 400
- **Sizes:** 20px, 30px, 144px
- **Line height:** 1.15–1.50
- **Letter spacing:** normal
- **Role:** Headlines, subheads, and long-form body — a custom-cut Suisse International (Swiss grotesque) in a single weight. Used at three distinct scales: 20px for body and nav, 30px for section subheads, 144px for editorial display headings like 'Art direction – Dig…'. The absence of bold/medium weights is the signature: everything is the same quiet weight, hierarchy comes from size alone. Substitute: Suisse Int'l, Inter, or Neue Haas Grotesk.

### Times — Smallest body fallback / metadata — appears as system Times at 16px, likely the serif default for tiny labels and captions. Single weight, system face. Substitute: any system serif. · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.15
- **Letter spacing:** normal
- **Role:** Smallest body fallback / metadata — appears as system Times at 16px, likely the serif default for tiny labels and captions. Single weight, system face. Substitute: any system serif.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.15 | — | `--text-caption` |
| body | 20px | 1.5 | — | `--text-body` |
| subheading | 30px | 1.3 | — | `--text-subheading` |
| display | 144px | 1.15 | — | `--text-display` |
| display-lg | 288px | 1.05 | — | `--text-display-lg` |
| display-xl | 504px | 1 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 58 | 58px | `--spacing-58` |
| 65 | 65px | `--spacing-65` |
| 90 | 90px | `--spacing-90` |
| 130 | 130px | `--spacing-130` |
| 202 | 202px | `--spacing-202` |

### Border Radius

| Element | Value |
|---------|-------|
| badge | 75px |
| default | 0px |

### Layout

- **Section gap:** 130px
- **Card padding:** 65px
- **Element gap:** 30px

## Components

### Display Wordmark
**Role:** Hero brand mark and section-opening sculpture

Beastly clauworks at 288–504px, Carbon Ink (#1a1a1a), set tight on the periwinkle canvas with near-zero letter-spacing and line-height 1.00–1.05. Fills the full viewport width; characters bleed off the edges intentionally. Single line, no wrapping. The letters are the layout — there is no other hero content.

### Editorial Display Headline
**Role:** Large in-flow headings on the periwinkle canvas

Suisse Intl clauworks at 144px, weight 400, line-height 1.15, Carbon Ink (#1a1a1a). Example: 'Art direction – Dig…'. Set as a single sentence that may run past the viewport — cropping is acceptable and expected. No underline, no italic, no color variation.

### Top Navigation
**Role:** Minimal horizontal nav across the top edge

Three text links ('About', 'Contact', 'Playground') in Suisse Intl clauworks 20px weight 400, Carbon Ink. Distributed across the full viewport width with left/center/right alignment rather than grouped. No background, no border, no hover state visible — the nav is a whisper, not a bar.

### Request Badge
**Role:** Sole chromatic interactive element on the page

Circular pill in Signal Green (#47f654) with Carbon Ink text. Radius 75px (appears fully circular). Text reads 'ON REQUEST • ON REQUEST' in a repeating ring pattern, or curved along the circumference in Suisse Intl clauworks 20px. Placed as a floating overlay element, typically bottom-left of a portfolio block.

### Carbon Panel
**Role:** Dark inverted section for portfolio content

Full-bleed Carbon Ink (#1a1a1a) band, no border, no shadow, no radius. Contains Paper White (#ffffff) sub-surfaces that frame individual portfolio spreads or images. Generous internal padding (130px top/bottom). Functions as a negative-space container that makes the surrounding lavender feel more saturated by contrast.

### Portfolio Spread
**Role:** Image-and-text content block inside a Carbon Panel

Rectangular composition: a large photographic or scan plate (Paper White background, 0px radius) on the left, dense editorial copy in Suisse Intl clauworks 20px on the right. Copy uses Carbon Ink on Paper White, line-height 1.50. No card chrome, no shadow — the white rectangle against black does all the separation.

### Image Carousel
**Role:** Horizontal scroller for project imagery

Contained inside a Carbon Panel. Large landscape images, Paper White or photographic fill, 0px radius. Pagination dots below (Carbon Ink dots on Paper White). Frame counter in small monospace numerals ('04 / 24'). No rounded corners, no padding around individual images.

### Hairline Divider
**Role:** Section separator

1px solid Carbon Ink (#1a1a1a) line, full viewport width, 0px margin above and below. The only border in the system. Used sparingly — typically once between major editorial sections.

### Body Copy
**Role:** Long-form paragraph text

Suisse Intl clauworks 20px, weight 400, line-height 1.50, Carbon Ink on periwinkle or Carbon Ink on Paper White inside a dark panel. Justified-left, no hyphenation, no first-line indent. Paragraph spacing 30px between blocks.

### Subheading
**Role:** Section label and small editorial title

Suisse Intl clauworks 30px, weight 400, line-height 1.30, Carbon Ink. Single weight — no bold option. Used above body copy to introduce a portfolio spread or service description.

## Do's and Don'ts

### Do
- Set every page background to Periwinkle Field (#8e93ff) — this is the operating mode of the system
- Use Beastly clauworks at 288px or larger for any display-level headline; do not use it below 200px
- Reach for Suisse Intl clauworks at 20px, 30px, or 144px only — do not interpolate intermediate sizes
- Separate dark content from the lavender canvas with a full-bleed Carbon Ink (#1a1a1a) panel, not a shadow or border
- Let display type run past the viewport edge — cropping is the layout, not a bug
- Place at most one Signal Green (#47f654) badge per page; it is punctuation, not decoration
- Use 130px vertical breathing room between major sections; 30px between typographic elements within a section

### Don't
- Do not add a fifth color, a tinted neutral, or a soft shadow to soften the lavender — the flatness is the design
- Do not use rounded corners on panels, cards, or images; 0px radius everywhere except the green badge
- Do not introduce a bold or medium weight of Suisse Intl — hierarchy is size-driven only
- Do not use Beastly at small sizes (under 200px) — it loses its character and becomes a bad display grotesque
- Do not center body copy or set it in narrow columns; body text is left-aligned, full-width-feeling, generous
- Do not add a sticky header, breadcrumb, or secondary navigation; the three-link top bar is the entire nav system
- Do not use gradients, blur, glow, or any CSS filter on the lavender background — it must read as a flat printed field

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Periwinkle Canvas | `#8e93ff` | Base page background, occupies the entire viewport by default |
| 2 | Carbon Panel | `#1a1a1a` | Dark inverted bands for portfolio content — the magazine spread, the image carousel wrapper |
| 3 | Paper Plate | `#ffffff` | Inner surfaces inside dark panels — the white paper of a catalog page, the clean rectangle around a photograph |

## Elevation

No shadows. The design rejects elevation entirely — surfaces are defined by color contrast (periwinkle vs carbon vs paper), not depth. No drop shadows, no inner glow, no tinted shadows on lavender. The only separator is the 1px Carbon Ink hairline. If something needs to feel 'above' the canvas, flip the surface to Carbon Ink — do not add blur.

## Imagery

Imagery is portfolio-first and editorial in tone. Photographs and scans are presented as large rectangular plates with 0px radius, framed by a Carbon Ink panel. No lifestyle, no stock, no decoration — every image is project output (catalog spreads, exhibition documentation, printed materials). No illustration, no 3D, no icon system. The visual language is: flat color background → flat color frame → flat image surface → flat text. Three layers, zero effects.

## Layout

Full-bleed single-page architecture with no max-width container. The hero is a viewport-filling Beastly wordmark on periwinkle, followed by a full-width Carbon Panel band of portfolio content, then a return to periwinkle for editorial display headlines. Sections alternate periwinkle → carbon → periwinkle in a strict 1:1 rhythm. Spacing is generous: 130px between major sections, 30px between typographic elements, 65px container padding on the sides. Navigation is a single row of three text links distributed across the top edge. No sidebar, no grid system, no card layout — content is a vertical editorial scroll where every section is allowed to break the viewport.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #8e93ff (Periwinkle Field)
- text: #1a1a1a (Carbon Ink)
- surface: #ffffff (Paper White)
- border: #1a1a1a (Carbon Ink hairline)
- accent: #47f654 (Signal Green)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a hero section: full-viewport Periwinkle Field (#8e93ff) background, Beastly clauworks at 504px line-height 1.00 in Carbon Ink (#1a1a1a), single line of display type filling the viewport width, characters may bleed off edges.
2. Build a portfolio dark band: full-bleed Carbon Ink (#1a1a1a) panel, 130px top/bottom padding. Inside, a Paper White (#ffffff) image plate at 0px radius on the left (60% width), and body copy in Suisse Intl clauworks 20px weight 400 line-height 1.50 Carbon Ink on the right.
3. Build an editorial display headline: Periwinkle Field background, Suisse Intl clauworks at 144px weight 400 line-height 1.15 in Carbon Ink, single sentence that may run past the viewport. Below it, a 1px Carbon Ink hairline divider spanning full width.
4. Build a Signal Green request badge: circular shape at 75px radius, Signal Green (#47f654) fill, Carbon Ink text in Suisse Intl clauworks 20px reading 'ON REQUEST', positioned as a floating overlay bottom-left of a portfolio block.
5. Build the top navigation: full-width row, three text links ('About' left, 'Contact' center, 'Playground' right) in Suisse Intl clauworks 20px weight 400 Carbon Ink, no background, no border, 20px top padding.

## Type System Philosophy

This system runs on a two-font engine: Beastly (custom display, monumental scale only) and Suisse Intl (custom grotesque, everything else). There are no bold weights, no italics, no condensed cuts. Hierarchy is produced exclusively by size: 20 / 30 / 144 / 288 / 504. When in doubt, go bigger, not heavier. The smallest type on the site (16px) uses system Times as a deliberate contrast against the Swiss grotesques — it is the only serif and it only appears at caption scale.

## Color Discipline

The palette is four colors and they are not interchangeable. Periwinkle is the canvas, always. Carbon Ink is the type and frame, always. Paper White is the inner surface, always. Signal Green is the punctuation, used once per page maximum. Any new color added to a new page breaks the system. If a new page needs a different mood, adjust the photography inside the Carbon Panel — do not change the canvas color.

## Similar Brands

- **Bureau Cool** — Same custom-display-monumentalism on a single saturated field, same flat periwinkle-adjacent canvas, same anti-component minimalism
- **Pentagram portfolio sites** — Editorial full-bleed sections on a vivid brand color, oversized custom display type, hairline-divided dark/light rhythm
- **M/M (Paris) site** — Lavender-adjacent monochrome field, sculptural custom wordmark, the work itself is the only other content
- **Vitra design museum microsites** — Flat saturated color blocks alternating with dark image bands, display type that treats the page as a poster rather than a layout
- **Actual Source** — Custom grotesque + custom display duo, single chromatic field, almost no UI chrome — type and color do the work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-periwinkle-field: #8e93ff;
  --color-carbon-ink: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-signal-green: #47f654;

  /* Typography — Font Families */
  --font-beastly-clauworks: 'Beastly clauworks', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-clauworks: 'Suisse Intl clauworks', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.15;
  --text-body: 20px;
  --leading-body: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.3;
  --text-display: 144px;
  --leading-display: 1.15;
  --text-display-lg: 288px;
  --leading-display-lg: 1.05;
  --text-display-xl: 504px;
  --leading-display-xl: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-58: 58px;
  --spacing-65: 65px;
  --spacing-90: 90px;
  --spacing-130: 130px;
  --spacing-202: 202px;

  /* Layout */
  --section-gap: 130px;
  --card-padding: 65px;
  --element-gap: 30px;

  /* Border Radius */
  --radius-full: 75px;

  /* Named Radii */
  --radius-badge: 75px;
  --radius-default: 0px;

  /* Surfaces */
  --surface-periwinkle-canvas: #8e93ff;
  --surface-carbon-panel: #1a1a1a;
  --surface-paper-plate: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-periwinkle-field: #8e93ff;
  --color-carbon-ink: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-signal-green: #47f654;

  /* Typography */
  --font-beastly-clauworks: 'Beastly clauworks', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-clauworks: 'Suisse Intl clauworks', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.15;
  --text-body: 20px;
  --leading-body: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.3;
  --text-display: 144px;
  --leading-display: 1.15;
  --text-display-lg: 288px;
  --leading-display-lg: 1.05;
  --text-display-xl: 504px;
  --leading-display-xl: 1;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-58: 58px;
  --spacing-65: 65px;
  --spacing-90: 90px;
  --spacing-130: 130px;
  --spacing-202: 202px;

  /* Border Radius */
  --radius-full: 75px;
}
```
