# Caserne — Style Reference
> black gallery wall with white type whispers

**Theme:** dark

Caserne operates as a gallery-grade portfolio: a near-pure black canvas where oversized editorial photography does the heavy lifting, and the interface itself retreats into hairline borders and whisper-thin type. The visual language is gallery-grade restraint — true black dominates, type sits at 13–14px in custom ABC Oracle, and the only motion is the page scroll revealing monolithic project images. Every UI element earns its place: there is no navigation chrome, no button fills, no decorative gradient — just text, image, and a 1px line. The « » guillemets prefixing project labels are a French-Canadian editorial signature, hinting at the studio's Montreal roots and anchoring the brand in a curatorial, almost typographic sensibility.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, full-bleed section backgrounds, hero containers |
| Paper | `#ffffff` | `--color-paper` | Primary text, project labels, navigation links, icon strokes on dark surfaces |
| Frost | `#f2f2f2` | `--color-frost` | Hairline borders, image outlines, grid dividers, nav separators — the structural linework of the entire interface |
| Smoke | `#858484` | `--color-smoke` | Muted secondary text, project descriptions, metadata captions |
| Graphite | `#333333` | `--color-graphite` | Muted icon strokes, separators, and secondary graphic details. Do not promote it to the primary CTA color |

## Tokens — Typography

### ABC Oracle — Sole typeface across the entire site. Weight 100 (ultra-thin) carries the editorial gravitas in display contexts; weight 400 handles navigation and body labels at 13–14px. The custom Dinamo typeface gives Caserne a curatorial, typographic authority that a system sans cannot replicate — the thin cuts and optical adjustments signal a studio that takes type seriously. · `--font-abc-oracle`
- **Substitute:** Söhne, ABC Diatype, Inter (weight 100 available)
- **Weights:** 100, 400, 700
- **Sizes:** 13px, 14px (body/nav) with editorial display sizes inferred from visual hierarchy
- **Line height:** 1.29–1.43
- **Letter spacing:** normal at body sizes; tight tracking at display sizes
- **OpenType features:** `"ss01" on (if available — Oracle's stylistic alternates reinforce editorial personality)`
- **Role:** Sole typeface across the entire site. Weight 100 (ultra-thin) carries the editorial gravitas in display contexts; weight 400 handles navigation and body labels at 13–14px. The custom Dinamo typeface gives Caserne a curatorial, typographic authority that a system sans cannot replicate — the thin cuts and optical adjustments signal a studio that takes type seriously.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.29 | — | `--text-caption` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 45 | 45px | `--spacing-45` |
| 90 | 90px | `--spacing-90` |
| 120 | 120px | `--spacing-120` |
| 225 | 225px | `--spacing-225` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 90px
- **Card padding:** 0px
- **Element gap:** 5px

## Components

### Minimal Text Nav
**Role:** Primary site navigation

A single horizontal row of white text links (Caserne, Work, Culture, Notes, Studio, Contact, FORUM) in ABC Oracle weight 400 at 13–14px, floating on the black canvas. No background, no border, no logo lockup — the wordmark IS the brand. The word 'FORUM' is capitalized and right-aligned, separated by generous space. Padding 5px horizontal per link item.

### Full-Bleed Hero Image
**Role:** Project showcase opener

Photographic images that span the full viewport width with no border, no rounded corners, no overlay. Sits directly on #000000 canvas. Aspect ratio follows the viewport — typically landscape, filling ~80–100% of first screen height. No caption, no text overlay on the image itself.

### Project Card
**Role:** Portfolio work entry

Large rectangular image (full container width within grid) with no border-radius, no shadow, no card background. Below the image: a small white label prefixed with « (guillemet) and the project name, plus a one-line Smoke (#858484) description at 13–14px weight 400. The card itself is invisible — only the image and the tiny text label exist.

### Project Label
**Role:** Caption beneath project cards

Two-line text block: Line 1 in Paper (#ffffff) at 14px weight 400 with « prefix; Line 2 in Smoke (#858484) at 13px weight 400. Minimal gap (5px) between lines. Left-aligned, hugging the left edge of the image above it.

### Section Anchor Label
**Role:** Section navigation

Small text like « Work appearing as a section header. White, 13–14px, left-aligned at the start of a content block. Functions as both a label and an anchor link.

### Image Outline Border
**Role:** Subtle image containment

1px solid #f2f2f2 border on images, providing a hairline frame against the black canvas. This is the only decorative border in the system — it replaces the need for card backgrounds by giving every image a defined edge.

## Do's and Don'ts

### Do
- Use #000000 as the universal canvas — every section, card, and container sits on true black
- Set type at 13–14px in ABC Oracle weight 400 for all UI labels and navigation; let images carry the visual weight, not type
- Prefix project labels and section headers with « (guillemet) — it is a French-Canadian editorial signature, not optional punctuation
- Use 1px #f2f2f2 borders on images instead of card backgrounds or shadows to define containment
- Use #858484 (Smoke) for all secondary/descriptive text; reserve #ffffff (Paper) for primary labels and navigation only
- Maintain 90px vertical gaps between major content sections to let each project image breathe as a standalone artifact
- Let images fill full-bleed — never constrain portfolio photography to a card or rounded container

### Don't
- Never introduce a chromatic accent color — the palette is intentionally monochrome; the avril green is content, not chrome
- Never use box-shadows or elevation — flatness against black is the entire visual language
- Never add border-radius to images, cards, or buttons — sharp 0px edges maintain the gallery-print aesthetic
- Never use type below 13px or above 18px for UI text — the interface is whisper-quiet by design
- Never add a logo mark, brand symbol, or decorative element to the navigation — the wordmark 'Caserne' is the identity
- Never use filled buttons or colorful CTAs — there are no conversion actions on a portfolio site, and adding one would break the curatorial tone
- Never apply gradients, glows, or blur effects to backgrounds — the canvas is uniformly black

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#000000` | Dominant page background — every section, card, and hero sits on true black |
| 2 | Frosted Surface | `#f2f2f2` | Hairline outline layer — 1px borders delineating images, cards, and grid cells against the black canvas |

## Imagery

Photography dominates the visual language — full-bleed project photography spanning the full viewport width. Images are architectural and brand-focused: storefront signage (avril), institutional logos (Apple), award trophies (ADCC). No lifestyle, no people, no abstract illustration. Treatment is documentary and editorial: sharp focus, natural lighting, no duotone or color grading. Images sit unframed on black with only a hairline border. Zero illustration, zero 3D, zero icon system — the custom ABC Oracle typography and guillemet punctuation carry all typographic personality. Imagery occupies roughly 70% of the visual real estate; text is deliberately reduced to whisper-thin labels.

## Layout

Full-bleed dark canvas with no max-width constraint. The hero is a single full-viewport-width image that transitions seamlessly into a 2-column project grid below. Project cards are arranged in a 2-column layout with generous gutters, each cell containing one large image and a small text caption block below. Navigation is a single thin row of text links at the very top, floating on black with no background bar. Section rhythm is defined by 90px vertical gaps between content blocks, creating a museum-catalogue pacing where each project gets visual silence around it. No sidebar, no footer chrome visible — the page is a vertical scroll through curated artifacts.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (Paper)
- background: #000000 (Obsidian)
- border: #f2f2f2 (Frost)
- muted text: #858484 (Smoke)
- icon: #ffffff (Paper)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Create a full-bleed hero section: #000000 canvas. A single landscape photograph spanning 100% viewport width with 0px border-radius, 1px #f2f2f2 outline. No text overlay on the image. Below the hero, 90px of black space before the next section.

2. Create a 2-column project card: Full-width image with 0px radius and 1px #f2f2f2 border. Below the image, left-aligned label block: Line 1 = « Project Name in #ffffff ABC Oracle 14px weight 400; Line 2 = one-line description in #858484 ABC Oracle 13px weight 400. 5px gap between lines. No card background, no shadow.

3. Create a minimal text navigation bar: Single horizontal row on #000000 background. Items: Caserne (left), Work, Culture, Notes, Studio, Contact (centered/right), FORUM (far right, all caps). All text in #ffffff ABC Oracle 13px weight 400, 5px horizontal padding per item, 2px vertical padding. No background bar, no logo, no border-bottom.

4. Create a section anchor label: Left-aligned at the start of a content block. Text « Work in #ffffff ABC Oracle 13px weight 400, directly on #000000 canvas. No underline, no background, no border.

5. Create a vertical project gallery stack: Full-width rows on #000000 canvas, each containing one image (0px radius, 1px #f2f2f2 border) followed by a label block. 90px vertical gap between rows. No card containers, no grid lines, no dividers between sections — the black space itself is the separator.

## Elevation Philosophy

Caserne explicitly avoids all shadow-based elevation. The system operates on a flat plane where depth is created through image content (photographs projecting into space against the black void) rather than UI elevation. There are no z-axis hints: no drop shadows, no inner shadows, no glow effects. Containment is defined exclusively by 1px #f2f2f2 hairline borders and the contrast of full-color images against the uniform #000000 canvas. This zero-elevation approach reinforces the gallery-wall metaphor — artwork hangs on a flat black wall, separated by physical space, not by visual chrome.

## Similar Brands

- **Pentagram** — Same gallery-portfolio model with full-bleed project photography, minimal navigation, and monochrome restraint
- **Instrument** — Dark canvas with oversized editorial imagery and whisper-thin type — the curatorial, non-commercial portfolio tone
- **Locomotive** — Montreal design agency with French-Canadian editorial sensibility and gallery-grade image presentation
- **Bureau Cool** — Same restraint-first approach where the interface disappears and project work fills the viewport
- **Wieden+ Kennedy** — Full-bleed dark sections with large-scale imagery dominating over minimal text UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-frost: #f2f2f2;
  --color-smoke: #858484;
  --color-graphite: #333333;

  /* Typography — Font Families */
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.29;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-5: 5px;
  --spacing-45: 45px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-225: 225px;
  --spacing-240: 240px;

  /* Layout */
  --section-gap: 90px;
  --card-padding: 0px;
  --element-gap: 5px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-frosted-surface: #f2f2f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-frost: #f2f2f2;
  --color-smoke: #858484;
  --color-graphite: #333333;

  /* Typography */
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.29;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-45: 45px;
  --spacing-90: 90px;
  --spacing-120: 120px;
  --spacing-225: 225px;
  --spacing-240: 240px;
}
```
