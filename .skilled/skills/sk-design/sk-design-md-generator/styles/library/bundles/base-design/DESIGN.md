# Base Design — Style Reference
> Monochrome art book unbound — two-tone editorial monolith with documentary bleed photography and zero chromatic accent

**Theme:** mixed

Base Design operates as a stark, print-inspired editorial system: a pure two-tone canvas where black and white alternate as full-bleed sections without mediation. Typography carries every visual decision — a single custom grotesque (BaseGrotesk) speaks in one voice across 12px nav labels and 65px display wordmarks, with consistent 0.01em tracking tightening the rhythm. Photography is the only color, presented as oversized documentary frames that bleed to the edges and let white text sit directly on the image. Components are almost invisible: pill-shaped buttons, hairline rules, and zero decorative chrome. The system feels like flipping through a brutalist monograph — nothing is colored, everything is composed.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, card surfaces, heading text on dark sections, overlaid text on photography |
| Lamp Black | `#000000` | `--color-lamp-black` | Primary text, display wordmarks, full-bleed dark section backgrounds, hairlines, border rules, button borders |
| Fog | `#ababab` | `--color-fog` | Muted secondary text, inactive link borders, de-emphasized helper text |

## Tokens — Typography

### BaseGrotesk — Sole typeface for everything — navigation, body copy, buttons, and the 60–65px display wordmark. Weight 300 carries body and large display copy, 500 is reserved for active states and emphasis, 700 appears in button labels and the page title. Custom grotesque with squared geometry; substitute with Inter or Neue Haas Grotesk. · `--font-basegrotesk`
- **Substitute:** Inter, Neue Haas Grotesk, or Söhne
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12, 16, 18, 25, 30, 32, 50, 60, 65
- **Line height:** 1.15 (display), 1.20 (headings), 1.30–1.40 (body)
- **Letter spacing:** 0.0100em across all sizes — consistent positive tracking tightens the grotesque's natural width
- **Role:** Sole typeface for everything — navigation, body copy, buttons, and the 60–65px display wordmark. Weight 300 carries body and large display copy, 500 is reserved for active states and emphasis, 700 appears in button labels and the page title. Custom grotesque with squared geometry; substitute with Inter or Neue Haas Grotesk.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 16px | 1.4 | — | `--text-body-sm` |
| body | 18px | 1.33 | — | `--text-body` |
| subheading | 25px | 1.3 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 50px | 1.17 | — | `--text-heading-lg` |
| display | 65px | 1.15 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 65 | 65px | `--spacing-65` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 54px |
| cards | 0px |
| images | 0px |
| buttons | 54px |

### Layout

- **Section gap:** 40px
- **Card padding:** 20px
- **Element gap:** 7px

## Components

### Primary Pill Button
**Role:** Filled action for primary navigation moments (e.g., project launches, contact, index entry)

Pill shape with 54px border-radius, solid black (#000000) background, white (#ffffff) text at 16–18px weight 700, padding 8px vertical / 20–22px horizontal. No shadow, no border. Sits as the singular chromatic-free accent — a black mark on white paper.

### Ghost Outlined Button
**Role:** Secondary or alternative action with restrained presence

Pill shape (54px radius), transparent background, 1px solid black (#000000) border, black text. Same 8px / 20–22px padding as the primary variant. Used when the filled version would compete with primary content.

### Minimal Top Nav
**Role:** Global navigation — anchor for the entire site

Full-bleed horizontal row on white. Left cluster: site title plus 5–6 small text links (Work, About, Approach, News, Contact) at 12–16px weight 400, separated by 25–30px horizontal margins. Right cluster: utility links (Search, Index) at the same size, right-aligned. No background fill, no border, no logo mark — typography alone defines the bar.

### Display Wordmark
**Role:** Hero or page-title identity — the dominant visual element on landing

BaseGrotesk weight 300 at 60–65px, line-height 1.15, color #000000. Renders the brand name ('Base') as an oversized typographic object that bleeds across the viewport. No decoration — the letterforms ARE the design.

### Full-Bleed Documentary Photo
**Role:** Atmospheric image that fills the viewport edge-to-edge

Photograph cropped to viewport width with 0px radius and no border. White (#ffffff) text overlay sits directly on the image, centered both axes, weight 300–400 at 50px. Text uses no background plate — it relies on the photographic value contrast to remain legible.

### Black Editorial Section
**Role:** Full-bleed dark band for thought-leadership, statements, or transitions

Solid #000000 background spanning the full viewport. Centered white (#ffffff) body text at 30–50px weight 300, line-height 1.20–1.30. Acts as a visual breath and tonal pivot between white content sections. No imagery, no decorative elements.

### Inverted Pill Button
**Role:** Primary action on dark or photographic sections

Same 54px pill radius and padding as the primary button but inverted: white (#ffffff) background, black (#000000) text at 16–18px weight 700. Used when a black-filled button would disappear into a black background.

### Hairline Rule
**Role:** Section divider, underline, or subtle separation

1px solid #000000 line used to separate sections, underline active nav items, or frame content. No fill, no padding — just a pure horizontal mark.

### Page-Title Block
**Role:** Identifies the current page (e.g., 'Base', 'Work') below the global nav

Small 12–16px weight 500 label aligned left, 7px below the nav bar. Functions as a breadcrumb-style page indicator without visual noise.

### Overlay Caption
**Role:** Short statement set in white over photography or dark sections

Centered white text, 50px weight 300, line-height 1.15, letter-spacing 0.01em. Multi-line stacks are vertically and horizontally centered in the container. Examples in the system: 'A Family of Makers' and 'Read our latest thought-leadership articles, trend features, interviews, and other musings.'

## Do's and Don'ts

### Do
- Use BaseGrotesk weight 300 at 60–65px for the page or brand wordmark — the oversized light-weight grotesque is the signature
- Maintain a strict two-tone palette: #000000 and #ffffff only, with #ababab reserved for de-emphasized secondary text
- Alternate full-bleed white and full-bleed black sections without gradients, borders, or transitions between them
- Set every button to 54px border-radius — the pill shape is a defining element, not a style choice
- Let photography bleed to the viewport edges with 0px radius and overlay white text directly on the image with no background plate
- Use 0.01em positive letter-spacing consistently across all type sizes and weights
- Keep navigation text at 12–16px and separate links with 25–30px horizontal margins — the nav should feel like quiet marginalia

### Don't
- Never introduce chromatic color — no blues, reds, greens, or any accent hue anywhere in the system
- Never use box-shadows, gradients, or glow effects to create depth — use black/white contrast instead
- Never round card or image corners — the system uses 54px pills and 0px everything else
- Never use more than two type sizes in a single composition — the rhythm relies on confident scale jumps
- Never add borders thicker than 1px — hairlines are the only structural lines
- Never fill the inverted button on a black background with #000000 — it will disappear
- Never decorate the global nav with a logo mark, background fill, or border — it should read as floating text on white

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Default page canvas and most content sections |
| 2 | Ink | `#000000` | Alternating full-bleed dark bands for editorial contrast and thought-leadership callouts |

## Elevation

Elevation does not exist in this system. Depth and hierarchy are achieved exclusively through black/white contrast, scale, and full-bleed alternation. No box-shadows, no elevation tokens, no surface tints — components sit flat on the paper or flat on the ink.

## Imagery

Photography is the only non-textual visual element. All imagery is documentary in tone: behind-the-scenes agency work, panel discussions, people in their studios. Treatment is full-bleed (0px corner radius) with white sans-serif text overlaid directly on the image. No duotones, no filters, no color grading beyond natural tones. Icons are absent or extremely minimal. The photographic density is high — each section is dominated by either a single full-bleed photo or a solid black/white field, never small thumbnails in grids.

## Layout

Full-bleed layout with no max-width container — content scales edge-to-edge at every breakpoint. The hero is a massive typographic wordmark (60–65px Base) that bleeds across the viewport, overlapped by a contained full-bleed photograph with centered text. Sections alternate as full-viewport bands: white band, then a full-bleed photo, then a black editorial band with centered white text. Navigation is a minimal top bar (no sticky behavior evidenced, no logo) with text-only links clustered left and right. Content rhythm is spacious and editorial — each section is a full-screen moment rather than a compact information block. No multi-column card grids; each section asserts itself as a single full-bleed composition.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 (primary), #ababab (muted)
- background: #ffffff (paper), #000000 (ink band)
- border: #000000 hairline
- accent: none
- primary action: no distinct CTA color

## 3-5 Example Component Prompts

1. **Display Wordmark Hero** — Render the brand name at 65px BaseGrotesk weight 300, color #000000, letter-spacing 0.01em, line-height 1.15. Let it overflow the viewport naturally. Below it, layer a full-bleed photograph (0px radius) with 50px white text centered, weight 300, line-height 1.15.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Inverted Pill Button (dark section)** — 54px border-radius, #ffffff background, #000000 text at 18px weight 700, same 8px / 22px padding.

4. **Black Editorial Band** — Full-bleed #000000 section, centered white (#ffffff) text at 32px weight 300, line-height 1.30, letter-spacing 0.01em. No images, no decoration. Acts as a visual breath between content sections.

5. **Minimal Top Nav** — Full-bleed white row, no border or background. Left cluster: site title in 16px weight 500 followed by nav links (Work, About, Approach, News, Contact) in 12–16px weight 400, separated by 25–30px margin-right. Right cluster: Search and Index in the same size, right-aligned. No logo, no icons.

## Similar Brands

- **Pentagram** — Identical zero-chromatic agency aesthetic — pure black and white, oversized display type as the hero, full-bleed documentary photography, and flat editorial section composition
- **Manual (manualcreative.com)** — Same monochrome typographic system with custom grotesque at extreme display sizes and minimal nav as floating text on white
- **Wieden+Kennedy** — Full-bleed black/white editorial bands alternating with documentary photography and centered overlay text in a custom sans-serif
- **Bureau Borsche** — Brutalist typographic agency identity — oversized wordmarks, no color, hairline rules, and pill-shaped buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-lamp-black: #000000;
  --color-fog: #ababab;

  /* Typography — Font Families */
  --font-basegrotesk: 'BaseGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --text-body: 18px;
  --leading-body: 1.33;
  --text-subheading: 25px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.17;
  --text-display: 65px;
  --leading-display: 1.15;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-65: 65px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 20px;
  --element-gap: 7px;

  /* Border Radius */
  --radius-full: 54px;

  /* Named Radii */
  --radius-tags: 54px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 54px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-lamp-black: #000000;
  --color-fog: #ababab;

  /* Typography */
  --font-basegrotesk: 'BaseGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --text-body: 18px;
  --leading-body: 1.33;
  --text-subheading: 25px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.17;
  --text-display: 65px;
  --leading-display: 1.15;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-65: 65px;

  /* Border Radius */
  --radius-full: 54px;
}
```
