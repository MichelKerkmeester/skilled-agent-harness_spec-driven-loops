# GUSTAVO Faria © — Style Reference
> Editorial monograph on white paper

**Theme:** light

Gustavo Faria's portfolio operates as a printed monograph on white paper: an editorial spread where one massive serif date range dominates the right column while a compact bio and portrait anchor the left. The system is almost aggressively monochrome — four grays/black on white, no decorative color, no shadows, no rounded corners. Typography does all the heavy lifting: a custom display serif at 125-142px creates scale contrast against 16px system body text, and negative letter-spacing tightens the display letters into a single confident statement. Content is organized as a work selection table — project name, category, year — separated by hairline rules. The atmosphere is that of an art director's contact sheet: restrained, intentional, every element earning its space.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces — the foundational surface on which all content sits |
| Charcoal | `#282828` | `--color-charcoal` | Primary text, hairline borders, structural rules — softer than pure black, reduces glare for long reading |
| Ink Black | `#000000` | `--color-ink-black` | Display text fill, link borders, maximum contrast elements |
| Ash Gray | `#dcdcdc` | `--color-ash-gray` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Flesh Peach | `#efc4b2` | `--color-flesh-peach` | Warm surface wash behind portrait and select portfolio imagery — the only chromatic surface, used sparingly as atmospheric punctuation |

## Tokens — Typography

### -apple-system — Body text, navigation, bio description, and work list content — system font chosen for zero-loading neutrality, letting the custom display serif own the page's identity. The system choice is deliberate: it disappears so the display type can speak. · `--font-apple-system`
- **Substitute:** SF Pro Text or system-ui
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** Body text, navigation, bio description, and work list content — system font chosen for zero-loading neutrality, letting the custom display serif own the page's identity. The system choice is deliberate: it disappears so the display type can speak.

### custom_21879 / custom_49610 — Display serif used for the signature '2019 — 2025' hero statement at 125-142px with weight 400 and tight negative tracking; the 12px instance serves as small-caps section labels. The extreme size jump from 12px to 125px creates the page's defining scale contrast. Substitute: GT Sectra, Editorial New, or Tobias for similar editorial character. · `--font-custom21879-custom49610`
- **Substitute:** GT Sectra or Editorial New
- **Weights:** 400, 700
- **Sizes:** 12px, 125px, 142px
- **Line height:** 0.81, 1.00, 1.02, 1.17, 1.67
- **Letter spacing:** -0.047em (-6.7px at 142px)
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** Display serif used for the signature '2019 — 2025' hero statement at 125-142px with weight 400 and tight negative tracking; the 12px instance serves as small-caps section labels. The extreme size jump from 12px to 125px creates the page's defining scale contrast. Substitute: GT Sectra, Editorial New, or Tobias for similar editorial character.

### custom_49610 — custom_49610 — detected in extracted data but not described by AI · `--font-custom49610`
- **Weights:** 400
- **Sizes:** 125px
- **Line height:** 1.02
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** custom_49610 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.67 | -0.56px | `--text-caption` |
| body | 16px | 1.17 | — | `--text-body` |
| display-lg | 125px | 1.02 | — | `--text-display-lg` |
| display | 142px | 0.81 | -6.67px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 48-64px
- **Card padding:** 0px
- **Element gap:** 8px

## Components

### Display Headline
**Role:** Hero-level typographic statement

Massive custom serif at 125-142px, weight 400, letter-spacing -0.047em, color #000000. Line-height 0.81-1.02 creates tight vertical rhythm. No background, no border — pure typographic presence. Used for date ranges and title statements that anchor a page.

### Work List Row
**Role:** Project entry in work selection

Three-column row: project name (left, bold weight 700, #282828), category (center, weight 400, #282828 or #dcdcdc), year (right, weight 400, #dcdcdc). Separated by 1px solid bottom border in #dcdcdc. Padding 12-16px vertical. No hover state, no background change.

### Bio Block
**Role:** Personal introduction

Small body text block in -apple-system 16px, color #282828. Includes name as bold/link, age, location, and current work. Left-aligned in sidebar column. No background or border — sits directly on canvas.

### Hairline Divider
**Role:** Structural separator between sections

1px solid line, #dcdcdc or #282828. Full-width or column-width. The only structural element separating work list rows and page sections.

### Portrait Card
**Role:** Personal image with hover label

Square image container, 0px radius, on #efc4b2 background. Small '(+)' or '(Hover Here)' label overlaid at center in -apple-system 12px, #282828. No shadow, no border.

### Navigation Link
**Role:** Top-level navigation item

Plain text link in -apple-system 16px, weight 400, color #282828. 1px solid #282828 bottom border on active/hover. No padding, no background. Sits inline with other nav items with horizontal gap.

### Section Label
**Role:** Small heading for content groups

Uppercase or sentence-case label in -apple-system 12px, weight 400, color #dcdcdc. Marks sections like 'Work Selection' — intentionally muted to recede against project names.

### Brand Mark
**Role:** Identity lockup in header

'GUSTAVO Faria ©' in -apple-system 16px, weight 700, color #282828. Mixed case with capital first letter and lowercase. Sits at top-left as the page's identity anchor.

### Portfolio Thumbnail
**Role:** Preview image of work piece

Full-width or half-width image, 0px radius, no border, no shadow. May have a colored background (peach, green gradient) visible as part of the artwork itself. No caption or overlay chrome.

## Do's and Don'ts

### Do
- Use the custom display serif at 125-142px for hero statements with letter-spacing -0.047em
- Separate work list rows with 1px solid #dcdcdc bottom borders
- Set all text in #282828 on #ffffff — avoid pure #000000 for body text to reduce eye strain
- Maintain 0px border-radius on all elements — this is a flat, print-inspired system
- Use -apple-system for all UI and body text; the system font should disappear so the display serif owns the page
- Use #efc4b2 as the only chromatic surface, and only behind imagery — never as a UI background
- Anchor pages with a single massive display headline; let everything else stay small and quiet

### Don't
- Don't add shadows, gradients, or elevation effects — the design is intentionally flat
- Don't introduce accent colors, hover states with background fills, or decorative gradients
- Don't use border-radius greater than 0px — sharp corners are core to the editorial identity
- Don't mix the display serif into body text or UI labels — it belongs only at hero scale
- Don't use bold or heavy weights for body text — the 400 weight system font should stay calm
- Don't crowd the layout with multiple visual elements per section — let whitespace and scale do the work
- Don't use #000000 for borders or secondary text — reserve it for display text and high-contrast moments only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper Canvas | `#ffffff` | Primary page background |
| 2 | Flesh Surface | `#efc4b2` | Warm atmospheric wash behind portrait imagery |

## Elevation

No shadows, no depth. The design is completely flat — separation between elements is achieved through whitespace, hairline borders, and scale contrast rather than elevation. This is a print-design sensibility applied to the web: elements sit on the same plane, divided by rules.

## Imagery

Photography dominates: a single square portrait with a warm peach background anchors the left sidebar, and portfolio thumbnails appear as rectangular or square crops with their own contextual backgrounds (peach tones, green gradients). Images are sharp-edged with 0px radius, no overlays, no masks. The portrait is the only photographic element with a visible label ('(+) Hover Here'). Portfolio thumbnails may include typography or graphic elements as part of the artwork itself. No illustrations, no icons, no 3D renders — imagery is documentary and personal, treated as printed plates.

## Layout

Two-column asymmetric layout: a narrow left sidebar (roughly 25% width) holds the bio, portrait, and identity mark; the right column (roughly 75%) holds the massive display headline and the work selection list. The hero '2019 — 2025' headline spans the full width of the right column at ~140px. Below it, the work selection is a full-width three-column table (project | category | year) with hairline dividers. The page flows vertically as a single long scroll with no section breaks beyond the work list rows. Navigation sits inline at the top-left. The overall rhythm is: compact sidebar → massive typographic statement → dense list of work entries. Max-width is effectively full-bleed, with padding from viewport edges only.

## Agent Prompt Guide

**Quick Color Reference**
- text: #282828
- background: #ffffff
- border: #dcdcdc
- accent surface: #efc4b2
- ink black: #000000
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: white #ffffff background. Display headline '2019 — 2025' at 142px in custom display serif, weight 400, #000000, letter-spacing -0.047em, line-height 0.81. No other elements — let the type fill the space.

2. Create a work list row: three-column layout (60% / 25% / 15%). Project name in -apple-system 16px weight 700 #282828, category in 16px weight 400 #dcdcdc, year in 16px weight 400 #dcdcdc right-aligned. 1px solid #dcdcdc bottom border, 0px radius, 12px vertical padding.

3. Create a portrait card: square image container with #efc4b2 background, 0px radius, no border, no shadow. Centered overlay label '(+)' in -apple-system 12px #282828.

4. Create a bio block: left-aligned text in -apple-system 16px weight 400 #282828. Name 'Gustavo Faria' in weight 700. Short paragraph below. No background, no border, sits directly on white canvas.

5. Create a navigation bar: inline horizontal links 'Info' and 'Instagram' in -apple-system 16px weight 400 #282828, 8px horizontal gap between items. 1px solid #282828 bottom border on hover. No background, no padding above or below.

## Similar Brands

- **Pentagram partner portfolios** — Same editorial-monograph approach: massive display type anchoring sparse layouts, monochrome palette, work presented as a structured list with hairline dividers
- **Mark Owens (markowens.id)** — Identical 'designer contact sheet' aesthetic — custom display serif, white canvas, no decorative elements, content organized as typographic list with project/category/year columns
- **Bureau Cool** — Shared restraint: custom display serif hero, monochrome interface, work entries as text rows with minimal chrome, 0px radius throughout
- **Studio Dumbar** — Editorial portfolio structure with oversized display type, flat surfaces, and work presented as a typographic index rather than a visual gallery

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-charcoal: #282828;
  --color-ink-black: #000000;
  --color-ash-gray: #dcdcdc;
  --color-flesh-peach: #efc4b2;

  /* Typography — Font Families */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom21879-custom49610: 'custom_21879 / custom_49610', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom49610: 'custom_49610', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --tracking-caption: -0.56px;
  --text-body: 16px;
  --leading-body: 1.17;
  --text-display-lg: 125px;
  --leading-display-lg: 1.02;
  --text-display: 142px;
  --leading-display: 0.81;
  --tracking-display: -6.67px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;

  /* Layout */
  --section-gap: 48-64px;
  --card-padding: 0px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-flesh-surface: #efc4b2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-charcoal: #282828;
  --color-ink-black: #000000;
  --color-ash-gray: #dcdcdc;
  --color-flesh-peach: #efc4b2;

  /* Typography */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom21879-custom49610: 'custom_21879 / custom_49610', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom49610: 'custom_49610', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --tracking-caption: -0.56px;
  --text-body: 16px;
  --leading-body: 1.17;
  --text-display-lg: 125px;
  --leading-display-lg: 1.02;
  --text-display: 142px;
  --leading-display: 0.81;
  --tracking-display: -6.67px;

  /* Spacing */
}
```
