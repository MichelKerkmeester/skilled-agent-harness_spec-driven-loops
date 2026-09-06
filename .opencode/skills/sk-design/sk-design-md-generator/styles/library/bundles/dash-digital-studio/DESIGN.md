# Dash Digital Studio — Style Reference
> Editorial museum on warm paper. A gallery where giant whisper-weight typography floats over off-white walls and full-bleed product photography does all the talking.

**Theme:** light

Dash Digital Studio runs a strictly achromatic editorial system — warm off-white canvases, near-black type, and absolutely zero chromatic accent. The entire visual language is carried by two type weights of Founders Grotesk at extreme sizes: whisper-light 300 for monumental display headlines (70–101px) and regular 400 for body and navigation. Letter-spacing tightens aggressively at large sizes (-0.0600em at display) while line-heights compress to 0.80–0.88, making the giant headlines feel architectural and sculptural rather than promotional. Work is presented like a gallery: full-bleed product photography inside 2-up case study frames, minimal UI chrome, pill-shaped dark badges for actions, and hairline rules separating brand lists. The absence of color is the system — every signal (hierarchy, emphasis, interaction) must be built from type weight, scale, spacing, and the tonal shift between #fafafa, #f0f0f0, and #2a2a2a.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Black | `#2a2a2a` | `--color-carbon-black` | Primary text, nav links, body copy, badge text, footer copy — the near-black that carries every word on the site |
| Bone | `#f0f0f0` | `--color-bone` | Page canvas and primary surface — the warm off-white that fills every section background |
| Ink | `#000000` | `--color-ink` | Maximum-contrast text and hard borders, reserved for the strongest emphasis moments |
| Linen | `#fafafa` | `--color-linen` | Subtle elevated surface and section dividers — one step lighter than the canvas for soft separation |
| Ash | `#d6d6d6` | `--color-ash` | Muted fills, hairline borders, and disabled/inactive surface treatments |
| Parchment | `#f0edea` | `--color-parchment` | Alternate warm section background — introduces a barely-perceptible cream tint to break the neutral flow |
| Stone | `#bcbcb4` | `--color-stone` | Deepest mid-gray — used for low-emphasis supporting text and the dimmest UI separators |
| Clay | `#ccc4b9` | `--color-clay` | Warm mid-gray for transitional surfaces between bone and parchment |

## Tokens — Typography

### Founders Grotesk — Sole brand typeface. Weight 300 at 70–101px for the monumental editorial hero and section titles; weight 400 at 12–22px for body, nav, meta labels, and case study descriptions. The extreme weight contrast (300 vs 400) and the 5× size jump from body to display are the core typographic moves — no other type system in the palette. · `--font-founders-grotesk`
- **Substitute:** Söhne, Inter, GT America, Neue Haas Grotesk
- **Weights:** 300, 400
- **Sizes:** 12, 14, 16, 17, 22, 40, 70, 101
- **Line height:** 0.80–1.20
- **Letter spacing:** -0.0600em at 101px, -0.0300em at 70px, -0.0230em at 40px, -0.0200em at 22px, -0.0180em at 16–17px, -0.0180em at 12–14px
- **OpenType features:** `"ss01" on, "ss02" on, "tnum" on`
- **Role:** Sole brand typeface. Weight 300 at 70–101px for the monumental editorial hero and section titles; weight 400 at 12–22px for body, nav, meta labels, and case study descriptions. The extreme weight contrast (300 vs 400) and the 5× size jump from body to display are the core typographic moves — no other type system in the palette.

### Editorial Neue — Secondary editorial serif used sparingly as an accent counterpoint to Founders Grotesk — appears in specific body or pull-text moments to break the grotesque monotony with a classical note. Tight -0.0600em tracking and 0.90 line-height match the display discipline. · `--font-editorial-neue`
- **Substitute:** Tiempos Text, Lyon Display, Source Serif Pro
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 0.90
- **Letter spacing:** -0.0600em
- **Role:** Secondary editorial serif used sparingly as an accent counterpoint to Founders Grotesk — appears in specific body or pull-text moments to break the grotesque monotony with a classical note. Tight -0.0600em tracking and 0.90 line-height match the display discipline.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.17 | -0.018px | `--text-caption` |
| body-sm | 14px | 1.2 | -0.018px | `--text-body-sm` |
| body-lg | 17px | 1.2 | -0.018px | `--text-body-lg` |
| subheading | 22px | 1.17 | -0.02px | `--text-subheading` |
| heading-sm | 40px | 0.9 | -0.023px | `--text-heading-sm` |
| display | 70px | 0.88 | -0.03px | `--text-display` |
| display-xl | 101px | 0.8 | -0.06px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 0px |
| images | 0px |
| inputs | 4px |
| buttons | 999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80-120px
- **Card padding:** 20-24px
- **Element gap:** 12-20px

## Components

### Pill Action Button
**Role:** Primary call-to-action for case studies and work links

Solid #2a2a2a background with #fafafa text in Founders Grotesk 400 at 12px, uppercase tracked label. Fully rounded 999px radius. Horizontal padding ~14px, vertical padding ~4px. No border, no shadow. Reads as a small dark dot against the warm canvas.

### Text Nav Link
**Role:** Top navigation primary items (Work, Case Studies, Services, About, Insights, Contact)

Founders Grotesk 400 at 12–14px, #2a2a2a, uppercase. No underline, no background, no border. Hover state may shift to #000000. Separated by 29px horizontal padding. No active state indicator beyond color shift.

### Brand Mark Wordmark
**Role:** Top-left logo

DashDigital in Founders Grotesk 400 at 12–14px, #2a2a2a, followed by a superscript registered trademark glyph (®). No icon. Sits flush left in the header.

### Editorial Display Heading
**Role:** Hero and section-level headlines

Founders Grotesk 300 at 70–101px, #2a2a2a, uppercase. Line-height 0.80–0.88, letter-spacing -0.0300em to -0.0600em. Sets across the full content width with no max-line constraint — lines are intentionally long to feel monumental. No subheading, no eyebrow above.

### Case Study Card
**Role:** Portfolio project tile in the work grid

Two-up grid layout. Each card has a 20px top padding block containing meta tags (uppercase, 12px, #2a2a2a) and a project name (uppercase, 22px, weight 400). Below sits a full-bleed square/landscape product photograph with 0px radius, no border, no shadow — the image is the card. Cards separated by ~29px column gap.

### Meta Tag Row
**Role:** Discipline/service labels above case study titles

Founders Grotesk 400 at 12px, uppercase, #2a2a2a. Multiple tags joined with middot or middle-dot separators (e.g. "DIGITAL DESIGN · WEB DEVELOPMENT"). No background, no border. Sits 20px above the project title.

### Brand List Row
**Role:** Client roster table in the brands section

Horizontal row with 1px solid #2a2a2a bottom border, full width. Left column: brand name in Founders Grotesk 400, 12–14px, uppercase. Right column: service tags uppercase 12px, then "MORE +" in same style as Pill Action Button. Row height ~40px. Hairline-only separation, no alternating fills.

### Project Image Frame
**Role:** Full-bleed product photography holder

Raw 0px-radius image containers, no border, no shadow, no overlay. Photographs extend edge-to-edge within their grid column. Aspect ratios vary (portrait, landscape, square) to match the work's content. This is the only place visual content lives — the UI never decorates around the image.

### Section Divider Rule
**Role:** Horizontal separator between major page sections

1px solid #2a2a2a or #000000, full-bleed width. Used sparingly — most sections separate by generous whitespace (~115px gap) rather than lines. When a line appears, it is absolute and structural, not decorative.

### Footer Wordmark
**Role:** Page footer signature

Founders Grotesk 400 at 12–14px, #2a2a2a, uppercase. Contains the studio address or contact line, separated from content by a hairline rule. Minimal — no social icons, no nav repeat.

### Text Input
**Role:** Contact form fields (inferred from the 4px radius data)

1px solid #2a2a2a border, 4px corner radius, no background fill. Founders Grotesk 400 at 16px. No focus ring color visible — likely shifts to #000000 border on focus. Underlined appearance from the strict border discipline.

## Do's and Don'ts

### Do
- Set hero and section titles in Founders Grotesk 300 at 70–101px with line-height 0.80–0.88 and letter-spacing -0.0300em to -0.0600em — the tight tracking and compressed leading are what make the type feel architectural.
- Use only #2a2a2a for body text and #f0f0f0 for the page background — maintain the 18:1 contrast ratio by never introducing a mid-gray for running text.
- Apply 999px border-radius exclusively to pill buttons and the "MORE +" tags; keep all images, cards, and content blocks at 0px radius for the editorial edge.
- Separate content sections with 80–120px vertical gap rather than dividers — the system breathes on whitespace alone.
- Use 29px as the standard horizontal padding inside nav rows and as the column gap between case study cards.
- Render every action label (VIEW CASE STUDY, VIEW WORK, MORE +) in uppercase 12px Founders Grotesk 400 inside a solid #2a2a2a pill.
- Place discipline tags (DIGITAL DESIGN · WEB DEVELOPMENT) as uppercase 12px meta above each project title with 20px of vertical space between them.

### Don't
- Never introduce a chromatic color — the 0% colorfulness is the brand. Any hue breaks the editorial contract.
- Never set body copy in weight 300; reserve weight 300 exclusively for display sizes 40px and above. Body stays at 400.
- Never apply a drop shadow, glow, or gradient to any element — the system is flat, paper-like, and shadowless by design.
- Never round image corners or add borders to product photography — full-bleed 0px edges are the rule.
- Never use line-height above 1.20 on any text size; the display sizes specifically need 0.80–0.88 to feel sculpted.
- Never underline text links; navigation and inline links use color contrast alone, with the registered-trademark glyph as the only typographic ornament.
- Never place a CTA button in a chromatic color or with a soft background — actions are always solid #2a2a2a pills with #fafafa text.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#f0f0f0` | Default page background |
| 1 | Linen Sheet | `#fafafa` | Elevated card and section surface |
| 2 | Parchment Block | `#f0edea` | Alternate warm section band |
| 3 | Ash Mat | `#d6d6d6` | Muted inactive or disabled fill |

## Elevation

The system is deliberately shadowless. All surface separation is achieved through tonal shifts between #fafafa, #f0f0f0, and #f0edea, and through hairline 1px borders in #2a2a2a. Elevation is implied by tonal warmth, not by depth.

## Imagery

Full-bleed product photography is the only imagery — no illustration, no icons, no decorative graphics. Photographs sit at 0px corner radius, no border, no overlay, no duotone treatment. Shots are tight, editorial-grade product crops (laptops, phones, packaging, venues) with strong color contrast of their own — the studio lets the work carry visual energy so the UI can stay neutral. Photography occupies roughly 40–50% of the viewport on case study pages, arranged in 2-up grids with generous 29px column gaps. No lifestyle or people photography. No masked or shaped images.

## Layout

Full-bleed light page on a #f0f0f0 canvas with a max-width content track around 1440px. The hero is a pure typographic block: massive 70–101px uppercase headline left-aligned, with a small uppercase tag line below, no hero image. Navigation is a single top bar with a left wordmark and right-aligned text links at 12–14px, separated by horizontal padding. Below the hero, a 2-up case study grid shows large product photographs with meta tags and project titles above each image. Further down, a 4-up client testimonial/log-row grid displays brand wordmarks with short descriptions and dark pill "VIEW CASE STUDY" buttons. A "BRANDS WE'VE WORKED WITH" table follows with hairline 1px row separators, left-aligned brand names, right-aligned service tags and "MORE +" actions. Section spacing is generous (~115px between major bands). The rhythm alternates between wide whitespace and dense content rows but never uses alternating background colors — everything stays on the same warm off-white.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2a2a2a
- background: #f0f0f0
- surface: #fafafa
- border: #2a2a2a
- accent: none (monochromatic system)
- primary action: no distinct CTA color

**Example Component Prompts**
1. **Case Study Card** — 2-up grid column, 29px column gap. Top: meta tag row "DIGITAL DESIGN · WEB DEVELOPMENT" in Founders Grotesk 400, 12px, uppercase, #2a2a2a. 20px gap. Project title in Founders Grotesk 400, 22px, uppercase, #2a2a2a. Below: full-bleed 0px-radius product photograph, no border, no shadow. Dark pill button "VIEW CASE STUDY" at 12px Founders Grotesk 400, #fafafa text on #2a2a2a background, 999px radius, 14px horizontal padding.
2. **Editorial Hero** — full-width block on #f0f0f0 background. Display headline in Founders Grotesk 300 at 101px, #2a2a2a, uppercase, line-height 0.80, letter-spacing -0.0600em. No eyebrow, no supporting visual. 80–120px vertical space, then a 12px uppercase tag line in weight 400.
3. **Brand List Row** — full-width row with 1px solid #2a2a2a bottom border. Left: brand name in Founders Grotesk 400, 14px, uppercase, #2a2a2a. Right: service tags (e.g. "RESEARCH · STRATEGY · DESIGN · DEVELOPMENT") in 12px uppercase, followed by a "MORE +" pill button matching the primary pill spec.
4. **Top Nav Bar** — left-aligned "DashDigital®" wordmark in Founders Grotesk 400, 12–14px, #2a2a2a with a superscript ® glyph. Right-aligned nav links (WORK, CASE STUDIES, SERVICES, ABOUT, INSIGHTS, CONTACT) in 12px uppercase, #2a2a2a, separated by 29px horizontal padding. No background, no border, no underline.
5. **Section Divider** — 1px solid #2a2a2a horizontal rule, full-bleed, used sparingly between major content bands. Prefer 80–120px of whitespace over the rule when possible.

## Similar Brands

- **Locomotive (locomotive.ca)** — Same achromatic editorial palette with massive tight-tracked display type and zero accent color
- **Pentagram** — Monochrome grid-based agency sites with uppercase meta tags and large product-photography case studies
- **Manual (manual.co)** — Strictly off-white canvas, hairline rules, and weight-300 display headlines in a grotesque
- **Resn (resn.co.nz)** — Gallery-style presentation of work with full-bleed photography and minimal UI chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-black: #2a2a2a;
  --color-bone: #f0f0f0;
  --color-ink: #000000;
  --color-linen: #fafafa;
  --color-ash: #d6d6d6;
  --color-parchment: #f0edea;
  --color-stone: #bcbcb4;
  --color-clay: #ccc4b9;

  /* Typography — Font Families */
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-neue: 'Editorial Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.17;
  --tracking-caption: -0.018px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.018px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.018px;
  --text-subheading: 22px;
  --leading-subheading: 1.17;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -0.023px;
  --text-display: 70px;
  --leading-display: 0.88;
  --tracking-display: -0.03px;
  --text-display-xl: 101px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -0.06px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80-120px;
  --card-padding: 20-24px;
  --element-gap: 12-20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 4px;
  --radius-buttons: 999px;

  /* Surfaces */
  --surface-bone-canvas: #f0f0f0;
  --surface-linen-sheet: #fafafa;
  --surface-parchment-block: #f0edea;
  --surface-ash-mat: #d6d6d6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-black: #2a2a2a;
  --color-bone: #f0f0f0;
  --color-ink: #000000;
  --color-linen: #fafafa;
  --color-ash: #d6d6d6;
  --color-parchment: #f0edea;
  --color-stone: #bcbcb4;
  --color-clay: #ccc4b9;

  /* Typography */
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-neue: 'Editorial Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.17;
  --tracking-caption: -0.018px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.018px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.018px;
  --text-subheading: 22px;
  --leading-subheading: 1.17;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -0.023px;
  --text-display: 70px;
  --leading-display: 0.88;
  --tracking-display: -0.03px;
  --text-display-xl: 101px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -0.06px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 999px;
}
```
