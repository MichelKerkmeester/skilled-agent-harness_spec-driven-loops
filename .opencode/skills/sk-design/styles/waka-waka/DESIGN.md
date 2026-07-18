# Waka Waka — Style Reference
> museum poster in bone and ink — monumental black grotesk type printed on warm off-white paper, everything else recedes

**Theme:** light

Waka Waka treats its website like a printed exhibition catalog: a warm bone-colored paper canvas, one near-black ink, and a custom grotesk typeface deployed at both 10px footnote size and 560px monumental scale. The system is essentially monoline and monochromatic — there are no accents, no secondary hues, no gradients, and almost no decorative chrome. Visual hierarchy is created entirely through typographic weight, scale, and whitespace, with the brand's own name acting as the dominant graphic device on every screen. Components are flat, borderless or hairline-bordered, and feel curated rather than interactive — the page reads as a gallery wall of objects and oversized letterforms, not a software interface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Paper | `#edeae4` | `--color-bone-paper` | Page background, all canvas surfaces — warm off-white that reads as unbleached paper rather than digital white |
| Stone Gray | `#c9c7c4` | `--color-stone-gray` | Secondary surface and muted contextual neutral — appears in contrast pairings as a slightly deeper layer below the canvas |
| Ink Black | `#28282a` | `--color-ink-black` | Primary text, all borders, hairline rules, icon strokes, and the only chromatic anchor in the system — near-black with a hint of warmth so it sits comfortably on the bone background instead of vibrating |

## Tokens — Typography

### Waka Sans — Single custom grotesk used for everything from 10px captions to 560px display — tight tracking scales with size (-0.09em at display, -0.02em at body) so the enormous type locks into a dense block while body text stays readable. The 0.80–0.83 line-height at display size is the signature: letterforms stack into an almost solid mass of ink · `--font-waka-sans`
- **Substitute:** Inter (free) or Söhne (paid) — modern grotesks with similarly tight apertures and even stroke weights
- **Weights:** 400, 500, 700
- **Sizes:** 10px, 14px, 18px, 24px, 560px
- **Line height:** 0.80, 0.83, 1.00, 1.20, 1.60
- **Letter spacing:** -0.09em at 560px, -0.03em at 24px, -0.02em at 18px
- **Role:** Single custom grotesk used for everything from 10px captions to 560px display — tight tracking scales with size (-0.09em at display, -0.02em at body) so the enormous type locks into a dense block while body text stays readable. The 0.80–0.83 line-height at display size is the signature: letterforms stack into an almost solid mass of ink

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 18px | 1.2 | -0.36px | `--text-body` |
| subheading | 24px | 1 | -0.72px | `--text-subheading` |
| display | 560px | 0.8 | -50.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 27 | 27px | `--spacing-27` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Monumental Display Headline
**Role:** Hero wordmark and section dividers

Waka Sans weight 700 at 560px, line-height 0.80, letter-spacing -0.09em, color #28282a. Used for the brand name rendered as a single oversized graphic element that fills the vertical viewport. No other type element approaches this scale — the contrast between 560px display and 10px captions defines the visual rhythm.

### Editorial Section Heading
**Role:** Mid-scale titles and category labels

Waka Sans weight 700 at 24px, line-height 1.0, letter-spacing -0.03em, color #28282a. Functions as a quiet secondary headline that appears above product blocks or image grids.

### Product Image Plate
**Role:** Photography containers in grid layouts

Raw product photography on the #edeae4 canvas with no border, no padding, no radius, and no shadow. Images are presented as full-bleed crops at grid cell size, sitting directly on the bone background so the negative space between images becomes part of the composition.

### Hairline Divider
**Role:** Section and content separators

1px solid #28282a rule spanning the full content width. The divider is the only structural separator in the system — no background tints, no shadows, no spacing tricks to divide content.

### Nav Link
**Role:** Top navigation items

Waka Sans weight 500 at 14px, color #28282a, 10px horizontal margin between items. No background, no underline, no active state background — navigation reads as a quiet list of words in the top margin of the page.

### Footer Text
**Role:** Bottom page information

Waka Sans weight 400 at 10–14px, line-height 1.6, color #28282a, 20px horizontal padding. Multi-column text block at the foot of the page that mirrors the density of a printed colophon.

### Outlined Action Border
**Role:** The only interactive element treatment available

Uses #28282a as a 1px border on interactive surfaces (ACTION_BORDER evidence present, ACTION_BACKGROUND=0). This is a ghost/outlined pattern only — no filled buttons exist. Interactive areas are demarcated by a hairline outline against the bone background, never by a colored fill.

### Icon Stroke
**Role:** All iconography

Waka Sans weight 400 glyphs or simple stroke icons at #28282a, sized to match surrounding text (10–18px). 6px margin offset. Icons are treated as typographic elements, not illustrations.

### Full-Bleed Poster Page
**Role:** Landing and index pages

The entire viewport acts as a single composition: oversized type at top, image grid below, footer at bottom. #edeae4 background, no card containers, no sections with distinct surface colors. The page itself is the component.

## Do's and Don'ts

### Do
- Use Waka Sans weight 700 at 560px with line-height 0.80 and letter-spacing -0.09em for any monumental display element — this is the system's single most recognizable choice
- Set all backgrounds to #edeae4 and all text, borders, and icons to #28282a — never introduce a second color
- Use 0px border-radius on every component including cards, buttons, and image containers
- Use hairline 1px #28282a dividers and borders instead of background-color contrast to separate content
- Set tight letter-spacing at scale: -0.09em at display, -0.03em at subheading, -0.02em at body
- Keep spacing compact: 10px element gaps, 20px container padding, 80px section gaps
- Let product photography sit directly on the bone background with no frame, shadow, or radius

### Don't
- Do not introduce any chromatic color, gradient, or accent hue — the system is strictly two-tone
- Do not use filled buttons, colored backgrounds, or background-fill hover states on interactive elements
- Do not apply border-radius greater than 0px to any element
- Do not use box-shadow or any elevation effect — surfaces are flat
- Do not set type below 10px or above 560px — the scale is deliberate and extreme
- Do not use light line-heights (1.5+) on display or heading sizes — 0.80–1.00 is required to maintain density
- Do not separate sections with colored bands or background fills — use whitespace and hairline rules only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Paper | `#edeae4` | Base canvas — the entire page surface |
| 2 | Stone Gray | `#c9c7c4` | Secondary contextual surface appearing in contrast relationships, slightly deeper than the canvas |

## Elevation

The system is intentionally flat. There are no shadows, no elevation effects, and no layered surfaces. Depth is communicated entirely through typographic scale contrast, hairline 1px #28282a borders, and the arrangement of objects on the bone-colored plane.

## Imagery

Product photography is the only visual content beyond type. Images are presented as documentary-style object studies on the warm bone background — furniture and functional objects photographed frontally or at slight angle, with no lifestyle context, no human subjects, and no environmental staging. Each image is a tight crop that fills its grid cell edge-to-edge with no margin, frame, or radius. The photography carries the role of a museum catalog plate: the object IS the image, and the surrounding bone paper is the gallery wall. No illustration, no abstract graphics, no decorative imagery. Color treatment is natural and slightly desaturated so the objects read as physical artifacts rather than advertising.

## Layout

Max-width 1200px centered on the bone canvas with generous outer margins that create a printed-page feel. The page is organized as a single vertical scroll of stacked sections rather than a multi-column dashboard. The hero is a full-viewport editorial poster: oversized 560px wordmark anchored to the top, followed by an image grid, then a second monumental type block. Below the hero, sections alternate between product image grids (2-column and asymmetric layouts) and typographic statements. Navigation is a minimal top bar with small text and 10px gaps. Footer is a dense colophon-style text block. The overall rhythm is the rhythm of a printed catalog: one bold image or type statement, then breathing space, then the next. Grid usage is restrained — 2-column image grids and asymmetric editorial compositions, not dense card matrices.

## Agent Prompt Guide

**Quick Color Reference**
- background: #edeae4
- text: #28282a
- border: #28282a
- accent: no accent color
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. *Create a hero poster section:* Full-viewport on #edeae4 background. Headline at 560px Waka Sans weight 700, color #28282a, line-height 0.80, letter-spacing -50.4px (-0.09em). Subtitle at 18px weight 400, color #28282a, letter-spacing -0.36px. No buttons, no decoration — the type is the hero.

2. *Create a product image grid:* 2-column grid with 10px gap on #edeae4 background. Each cell is a product photograph filling the cell edge-to-edge with 0px radius, no border, no padding, no shadow. Caption below each image at 10px Waka Sans weight 400, color #28282a, 6px margin-top.

3. *Create a minimal top navigation:* Full-width on #edeae4 background, 20px horizontal padding. Nav items in Waka Sans weight 500 at 14px, color #28282a, 10px horizontal gap between items. No background, no border, no underline on hover — just a quiet list of words.

4. *Create a section divider:* Full-width 1px solid #28282a hairline rule, no padding, no margin decoration. This is the only structural separator in the system.

5. *Create a footer colophon:* 3-column text block at the bottom of the page on #edeae4 background, 20px horizontal padding, separated from content above by a 1px #28282a hairline. Text in Waka Sans weight 400 at 10–14px, line-height 1.6, color #28282a.

## Similar Brands

- **Menu Space** — Same bone-and-ink monochromatic palette, same editorial poster approach, same custom grotesk used at monumental scale against warm off-white
- **Areaware** — Same museum-catalog product presentation on warm neutral canvas, same hairline-bordered grid layouts, no decorative chrome
- **Hem** — Same Scandinavian furniture-studio restraint — single background tone, oversized wordmark as primary graphic, products photographed flat on neutral
- **Coming Soon (studio)** — Same editorial typographic system with grotesk at extreme scale, same printed-publication rhythm instead of app-like sectioning

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-paper: #edeae4;
  --color-stone-gray: #c9c7c4;
  --color-ink-black: #28282a;

  /* Typography — Font Families */
  --font-waka-sans: 'Waka Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --tracking-subheading: -0.72px;
  --text-display: 560px;
  --leading-display: 0.8;
  --tracking-display: -50.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-27: 27px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-paper: #edeae4;
  --surface-stone-gray: #c9c7c4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-paper: #edeae4;
  --color-stone-gray: #c9c7c4;
  --color-ink-black: #28282a;

  /* Typography */
  --font-waka-sans: 'Waka Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --tracking-subheading: -0.72px;
  --text-display: 560px;
  --leading-display: 0.8;
  --tracking-display: -50.4px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-27: 27px;
}
```
