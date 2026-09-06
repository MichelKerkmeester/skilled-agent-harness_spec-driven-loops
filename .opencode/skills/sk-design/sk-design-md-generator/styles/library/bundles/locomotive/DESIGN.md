# Locomotive — Style Reference
> Monochrome zine between blood-red slides. Black ink and white paper form the structural grammar; only photography is allowed to scream.

**Theme:** light

Locomotive operates a strict two-color monochrome system — black ink on white paper, nothing else. The visual language is editorial and gallery-like: massive display type at 110px sets a museum-catalogue tone, while a single weight 400 across all text avoids the visual noise of bold or light variants, letting scale alone carry hierarchy. Full-bleed dramatic photography supplies all color and atmosphere; the interface itself never does. Generous vertical breathing room (150px section padding) and hairline horizontal dividers create a Swiss-style zine rhythm. The result feels like flipping through a high-end art monograph where typography is the architecture and images are the exhibits.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Body text, headings, footer text, inverted section backgrounds, cards, borders, nav — the universal structural color |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces on dark sections, text on inverted black backgrounds |

## Tokens — Typography

### HelveticaNowDisplay — Workhorse for everything non-display: body copy at 15px, section sub-headings and card titles at 26px. The choice to stay at a single weight 400 — no bold, no light — forces hierarchy through size and space rather than stroke contrast. Substitute: Neue Haas Grotesk Display Pro or Inter at 400. · `--font-helveticanowdisplay`
- **Substitute:** Neue Haas Grotesk Display Pro
- **Weights:** 400
- **Sizes:** 15px, 26px
- **Line height:** 1.0–1.3
- **Letter spacing:** normal
- **Role:** Workhorse for everything non-display: body copy at 15px, section sub-headings and card titles at 26px. The choice to stay at a single weight 400 — no bold, no light — forces hierarchy through size and space rather than stroke contrast. Substitute: Neue Haas Grotesk Display Pro or Inter at 400.

### LocomotiveNew — Signature display face for hero headlines and feature titles. At 110px it commands the viewport; the tight 1.0–1.1 line-height and zero tracking make the letterforms feel architectural and monolithic. Custom and ownable — no direct substitute, but Migra or Söhne Breit at 400 come close in feel. Do not substitute with a bold weight; the whisper-thin strokes at scale are the point. · `--font-locomotivenew`
- **Substitute:** Söhne Breit at 400 or Migra Display at 400
- **Weights:** 400
- **Sizes:** 70px, 110px
- **Line height:** 1.0–1.1
- **Role:** Signature display face for hero headlines and feature titles. At 110px it commands the viewport; the tight 1.0–1.1 line-height and zero tracking make the letterforms feel architectural and monolithic. Custom and ownable — no direct substitute, but Migra or Söhne Breit at 400 come close in feel. Do not substitute with a bold weight; the whisper-thin strokes at scale are the point.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 15px | 1.3 | — | `--text-body` |
| heading-sm | 26px | 1.2 | — | `--text-heading-sm` |
| heading-lg | 70px | 1.1 | — | `--text-heading-lg` |
| display | 110px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 150px
- **Card padding:** 20-40px
- **Element gap:** 20px

## Components

### Full-Bleed Hero Image
**Role:** First-viewport dramatic photography with overlaid display headline

100vw × 100vh image with no rounding, no border. Display headline (LocomotiveNew 110px, weight 400, white or black depending on image) overlaid bottom-left. Nav floats absolute over the image.

### Editorial Display Headline
**Role:** Hero and section title type

LocomotiveNew at 70–110px, weight 400, line-height 1.0–1.1, normal tracking. No bold, no italic. Sits in the lower-left quadrant over full-bleed imagery, or breaks the left margin of a white section.

### Ghost Navigation Link
**Role:** Top-bar nav items and 'Let's talk' CTA

HelveticaNowDisplay 15px, weight 400. No background, no border, no underline. Color: Ink on Paper canvas, Paper on Ink canvas. The 'Locomotive®' wordmark carries a registered trademark glyph as a typographic signature.

### Article List Row
**Role:** Editorial index of articles, culture entries, or store links

Full-width single-line row, HelveticaNowDisplay 15px, separated from neighbors by a 1px Ink hairline. Category label left-aligned, title fills the center-right, optional arrow icon right-aligned. 20px vertical padding per row.

### Centered Image with Floating Labels
**Role:** Portfolio feature block

A single product/portrait image centered on the canvas, approximately 40% page width, with no rounding. Short text labels (HelveticaNowDisplay 15–26px) float in the surrounding white space — top-left, top-right, bottom-left, bottom-right — connected to the image by proximity rather than lines. The composition is curatorial: the object is the exhibit, labels are wall text.

### Inverted Section Panel
**Role:** Full-bleed black block interrupting the white canvas

Background #000000, text #ffffff. Used for footer, closing CTAs, or featured project blocks. Maintains the same typography scale but inverts the color pair. No elevation, no rounded corners.

### Hairline Section Divider
**Role:** Vertical or horizontal separator

1px solid Ink rule, full-width. The only structural element besides typography. No gradients, no shadows.

### Workhorse Text Link
**Role:** Inline or standalone link within editorial copy

HelveticaNowDisplay 15px weight 400, Ink color. May be underlined or sit inline without decoration. Hover state: no color change — the only feedback is the registered ® mark on the wordmark.

## Do's and Don'ts

### Do
- Stay at weight 400 for all type — no bold, no light variants exist in this system; let size and space build hierarchy instead
- Use LocomotiveNew at 70–110px for display moments and HelveticaNowDisplay at 15–26px for everything else; never cross the 26px/70px gap without editorial intent
- Anchor content to a 4px grid with 150px+ section padding and 20px row padding; the system breathes because it is mostly white space
- Keep all corners square — 0px radius on cards, buttons, tags, and images; sharpness reinforces the editorial catalog tone
- Use full-bleed photography to supply all color and mood; the interface itself should never introduce a chromatic accent
- Separate list rows with 1px Ink hairlines and generous 20px vertical padding rather than backgrounds or chips
- Invert by swapping Ink and Paper only — do not introduce a gray, a tint, or a third tone

### Don't
- Do not introduce a brand color or accent — the 0% colorfulness is a deliberate, ownable constraint, not an oversight
- Do not add bold, semibold, or light weights to either font family; the single-weight 400 stance is the signature
- Do not round corners on images, cards, buttons, or any container; keep all geometry orthogonal
- Do not use shadows, blurs, or elevation layers to imply depth — rely on the Ink/Paper inversion for contrast
- Do not apply letter-spacing or text-transform; the display type sits at default tracking and sentence/upper case as written
- Do not place UI chrome (badges, chips, tags with fills) inside the white canvas — these break the gallery-wall metaphor
- Do not use gradients under any circumstances; if a section needs energy, swap to a full-bleed photograph

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Primary page canvas — body, article lists, centered image compositions |
| 2 | Ink | `#000000` | Inverted section panels, footer, full-bleed hero overlays, project feature blocks |

## Elevation

This system has zero elevation. Depth is communicated exclusively through the full-bleed / inverted contrast between Paper (#ffffff) and Ink (#000000). There are no shadows, no blurs, no z-axis layering — the visual hierarchy is flat and editorial, like a printed page.

## Imagery

Photography is the sole source of color and atmosphere. Treatment is full-bleed, sharp-cornered, uncropped by UI elements. The hero uses a dramatic high-contrast portrait (red-lit face, near-black surroundings) at 100vw × 100vh. Secondary images (rings, product shots) sit centered on white at roughly 40% page width with floating editorial labels — museum-catalogue framing rather than e-commerce framing. No lifestyle or stock photography; imagery is always a focused subject on a controlled background.

## Layout

Full-bleed page model — content breaks the viewport edge rather than sitting inside a max-width container. The hero is a single 100vh image with absolutely-positioned nav and a bottom-left display headline. Below the hero, sections alternate between white Paper and black Ink inverted blocks, separated by hairline rules. The signature composition is a centered image (≈40% width) with short text labels floating in the surrounding white space at the corners — a curatorial, not commercial, arrangement. Navigation is a minimal top bar (logo left, center links, CTA right) that floats over the hero and becomes opaque as you scroll. Article and culture lists run full-width as single-line rows with hairline dividers — no cards, no grid cards. Vertical rhythm is built from 150px section padding and 20px row padding, giving the page the cadence of a print zine rather than a SaaS dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000
- accent: no distinct accent color (monochrome only)
- primary action: no distinct CTA color
- inverted text: #ffffff on #000000 panels

**Example Component Prompts**
1. **Full-bleed editorial hero**: 100vw × 100vh background image with a bottom-left headline at 110px LocomotiveNew weight 400, line-height 1.0, in white over the image. Navigation bar (transparent background) floats at the top with logo left, four center links, and a 'Let's talk' ghost link right — all HelveticaNowDisplay 15px weight 400.
2. **Centered image with floating labels**: A single product/portrait image at approximately 40% of the viewport width, centered, with 0px corner radius. Four short labels in HelveticaNowDisplay 15–26px weight 400 placed in the surrounding white space — top-left, top-right, bottom-left, bottom-right — using 20px element gap between label and image edge. No connecting lines, no borders around the image.
3. **Article index list**: Full-width column with 1px solid #000000 hairlines between rows. Each row: 20px padding top and bottom, category label in HelveticaNowDisplay 15px weight 400 on the left, article title right-aligned in the same face, optional right-arrow at the far right. No card backgrounds, no hover fills.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
5. **Section break**: A single 1px solid #000000 hairline running full viewport width, with 150px of white space above and below. Used between major editorial sections in place of background-color changes.

## Similar Brands

- **Ueno** — Same agency-portfolio restraint — monochrome palette, large editorial display type, full-bleed photography, zero decorative UI chrome
- **Resn** — Experimental creative agency sites that lean on custom display typefaces and full-bleed dramatic imagery rather than component-heavy interfaces
- **Manual** — Editorial-agency layouts with hairline dividers, centered compositions, and the same refusal to introduce a brand color
- **Pentagram** — Gallery-wall presentation: work presented as exhibits, type as architecture, white space as the dominant material

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-helveticanowdisplay: 'HelveticaNowDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-locomotivenew: 'LocomotiveNew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.3;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading-lg: 70px;
  --leading-heading-lg: 1.1;
  --text-display: 110px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 150px;
  --card-padding: 20-40px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;

  /* Typography */
  --font-helveticanowdisplay: 'HelveticaNowDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-locomotivenew: 'LocomotiveNew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 15px;
  --leading-body: 1.3;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --text-heading-lg: 70px;
  --leading-heading-lg: 1.1;
  --text-display: 110px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-160: 160px;
}
```
