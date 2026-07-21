# Aspelin Reitan — Style Reference
> Candlelit architectural archive — the page reads like a portfolio of built places pinned to a warm cream wall, with a single line of white type floating over each full-bleed image.

**Theme:** light

Aspelin Reitan treats the website as a curated architectural gallery: warm cream canvases, full-bleed dark photography as section anchors, and a single custom sans-serif that stays small and editorial. The interface is deliberately quiet — no filled CTAs, no bright accent colors, no shadow stacks — letting the buildings and interiors carry the brand voice. Warmth is structural, not decorative: cream parchment for surfaces, deep walnut for dark sections, amber for the few interactive moments. Every UI element is a hairline outline or a small caption; the photograph does the heavy lifting.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Parchment | `#ffebd0` | `--color-warm-parchment` | Gray accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Candlelight | `#fff8e9` | `--color-candlelight` | Lighter cream for elevated surfaces and secondary text on dark — a half-step above Parchment for subtle layering |
| Obsidian | `#000000` | `--color-obsidian` | Structural borders, section dividers, image edge treatments — used as a hairline, never as a fill |
| Walnut Shell | `#2f2116` | `--color-walnut-shell` | Dark canvas behind full-bleed photographs, footer backgrounds, and dark editorial sections — the deep brown that makes white type glow warm |
| Aged Bronze | `#4f3622` | `--color-aged-bronze` | Secondary dark surface and border on dark sections — a half-step lighter than Walnut for subtle layering on dark |
| Amber Glow | `#fee197` | `--color-amber-glow` | Navigation borders, active state accents, warning/attention states, and the single chromatic punctuation in an otherwise warm-neutral system |
| Muted Gold | `#987f61` | `--color-muted-gold` | Link borders and heading underlines on dark sections — a desaturated brass for typographic detail without breaking the monochrome feel |

## Tokens — Typography

### ModernEra — Sole typeface for body, navigation, buttons, links, headings, and overlay captions — a custom humanist sans that sits at 400 for body and 500 for emphasis. The entire type scale tops out at 40px, which is anti-SaaS: no 56px or 72px display sizes, no dramatic weight jumps. Authority comes from restraint, not volume. · `--font-modernera`
- **Substitute:** Söhne, Inter, or GT America — all humanist sans-serifs with similar x-height and warmth
- **Weights:** 400, 500
- **Sizes:** 16px, 18px, 20px, 24px, 28px, 40px
- **Line height:** 1.17–1.40
- **Role:** Sole typeface for body, navigation, buttons, links, headings, and overlay captions — a custom humanist sans that sits at 400 for body and 500 for emphasis. The entire type scale tops out at 40px, which is anti-SaaS: no 56px or 72px display sizes, no dramatic weight jumps. Authority comes from restraint, not volume.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.4 | — | `--text-caption` |
| body | 18px | 1.25 | — | `--text-body` |
| subheading | 20px | 1.22 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 28px | 1.17 | — | `--text-heading` |
| display | 40px | 1.17 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 8px |
| images | 0px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 100px
- **Card padding:** 40px
- **Element gap:** 12-20px

## Components

### Outlined Navigation Button
**Role:** Primary interactive element in the header

Transparent background, 1px Warm Parchment (#ffebd0) border, 8px radius, 16-18px horizontal padding, 6-8px vertical padding. Text in ModernEra 400 at 16px in Warm Parchment. The 'Portefølje' button in the header is the canonical example. No fill state — outlined only.

### Ghost Link with Border
**Role:** Text links throughout content sections

No background, 1px bottom border in the link's color (Obsidian on cream sections, Muted Gold on dark sections). Text in ModernEra 400-500 at 16-18px. Padding-bottom of 8-12px to create breathing room below the border line. The border IS the affordance — no underline color change needed.

### Full-Bleed Editorial Hero
**Role:** Opening section of each major page

Photograph fills the entire viewport with no padding or margin. White type overlay positioned bottom-left at 40px / 1.17 in ModernEra 400, with ~40px left/bottom inset. Navigation floats on top: logo top-left, buttons top-right. The photograph's content provides all color and atmosphere — the UI adds no overlay tint.

### Portfolio Image Card
**Role:** Project or case-study thumbnails in the portfolio grid

Large image at full column width, no border, no radius, no shadow — images are sharp-cornered and bleed to the grid edge. Caption sits below at 16-18px ModernEra 400 in Obsidian, with ~40px padding around the text. The image and caption are vertically separated; no card container.

### Two-Column Project Layout
**Role:** Portfolio detail or story sections

Two images side by side in a single row on a Warm Parchment (#ffebd0) background. The left image is ~40% width, the right image fills the remainder. A single line of project name text sits below the right image at 16px ModernEra 400, aligned left, with 40px of padding around the entire group.

### Dark Overlay Section
**Role:** Editorial story or mood sections between cream content areas

Full-bleed warm-toned photograph with Walnut Shell (#2f2116) as the base if the image is absent. Section title in ModernEra 400 at 28-40px in Warm Parchment (#ffebd0) positioned top-left with ~40px inset. Optional 'Historier' or category label at top-right at 16px. The contrast between dark image and light text is the entire design — no gradient overlays needed.

### Header Bar
**Role:** Persistent navigation across all pages

Fixed or absolute over hero imagery. Logo 'ASPELIN REITAN' top-left at 16-18px ModernEra 500 in Warm Parchment, letter-spaced wide enough to read as a wordmark. Navigation items top-right: an outlined 'Portefølje' button (8px radius) and a 'Meny' text label. No background fill — the header is transparent over the hero photograph.

### Navigation Item
**Role:** Menu links in the header

Plain text in ModernEra 400 at 16px in Warm Parchment. No border, no background. 20px margin-right between items. Active state indicated by Amber Glow (#fee197) bottom border at 1px.

### Section Heading
**Role:** Titles for content blocks on cream backgrounds

ModernEra 500 at 24-28px in Obsidian (#000000). No decorative element, no underline. Left-aligned with 40px left padding. Generous space below before content begins (40-100px).

### Footer
**Role:** Bottom of page

Walnut Shell (#2f2116) background. Text in Warm Parchment (#ffebd0) at 16px ModernEra 400. Single column or two-column layout with 40px padding. Same outlined-button pattern for any footer CTAs.

### Outlined Action Button (Cream Section)
**Role:** Interactive buttons when on a cream background

Transparent background, 1px Obsidian (#000000) border, 8px radius, 18px horizontal padding, 16px vertical padding. Text in ModernEra 500 at 16px in Obsidian. Hover state: background fills with Obsidian, text shifts to Warm Parchment.

### Input Field
**Role:** Form inputs (newsletter, contact)

Transparent background, 1px Warm Parchment (#ffebd0) or Obsidian border (context-dependent), 8px radius, 16px padding. Text in ModernEra 400 at 16px. Placeholder in same color at reduced opacity.

## Do's and Don'ts

### Do
- Use outlined buttons with 8px radius exclusively — no filled CTAs. Pair with 1px borders in Warm Parchment on dark or Obsidian on cream.
- Let full-bleed photography carry the visual weight. Keep UI chrome transparent or minimal over photographs.
- Stay within the type scale: 16, 18, 20, 24, 28, 40px. Do not exceed 40px for display text — the restrained scale is the signature.
- Use Warm Parchment (#ffebd0) as the dominant canvas for content sections and Walnut Shell (#2f2116) for dark editorial breaks.
- Maintain 100px vertical section gaps to preserve the spacious, gallery-walk rhythm.
- Pair every link with a visible border or bottom-line treatment — the line IS the affordance, not a color change.
- Set body text at 18px / 1.25 in ModernEra 400 — never below 16px, and keep line-height generous.

### Don't
- Do not introduce filled CTA buttons, drop shadows, or gradient backgrounds — the system is flat and outlined by design.
- Do not add chromatic colors beyond Amber Glow (#fee197) and Muted Gold (#987f61). The palette is warm-neutral only.
- Do not use display sizes above 40px or bold weights above 500. The system whispers; it does not shout.
- Do not apply border-radius to images or cards. Only buttons and links get 8px. Images and cards are sharp-cornered.
- Do not place white text on Warm Parchment backgrounds — contrast is reserved for Walnut Shell dark sections.
- Do not add icons, illustrations, or decorative graphics over photographs. The photograph is the only visual layer.
- Do not use multiple typefaces. ModernEra is the sole family — no serifs, no display fonts, no mono.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Walnut Shell | `#2f2116` | Dark full-bleed sections, photo overlays, footer canvas |
| 1 | Warm Parchment | `#ffebd0` | Primary page canvas where text, cards, and project grids live |
| 2 | Candlelight | `#fff8e9` | Lighter cream for elevated content blocks and secondary surfaces |

## Elevation

No shadows. The design uses flat surfaces, hairline borders, and photographic backgrounds to create depth. There is no z-axis layering via box-shadow — separation comes from color contrast between Warm Parchment and Walnut Shell, and from the full-bleed photographic sections that naturally create visual breaks.

## Imagery

Full-bleed architectural photography is the dominant visual content. Exterior shots of completed buildings (historic brick facades, modern glass towers, residential developments) serve as full-viewport section anchors. Interior shots appear in two-column layouts, showing furnished hotel lobbies, offices, and residential interiors with people present to convey scale and livability. Photographs have a warm color temperature — amber-lit interiors, golden-hour exteriors — that harmonizes with the cream palette. No illustrations, no abstract graphics, no product mockups. The imagery is documentary, not aspirational: real places, real light, real scale. Images are sharp-cornered and bleed to the viewport edge with no rounded masks.

## Layout

The page follows a full-bleed gallery rhythm: each major section is either a full-viewport photograph with minimal text overlay, or a cream canvas with a contained content block. Hero sections are 100vh with text positioned bottom-left in 40px ModernEra 400. Content sections sit on Warm Parchment (#ffebd0) with 1200px max width, 40px inner padding, and images arranged in two-column or single-column grids. Section transitions alternate between dark photographic breaks and cream content blocks. Navigation is a minimal floating bar over the hero — logo left, two items right. The overall density is very spacious: 100px between sections, single-image compositions, no multi-row card grids.

## Agent Prompt Guide

## Quick Color Reference
- Text (on cream): Obsidian #000000
- Text (on dark): Warm Parchment #ffebd0
- Background (primary): Warm Parchment #ffebd0
- Background (dark sections): Walnut Shell #2f2116
- Border: Obsidian #000000 (on cream) or Warm Parchment #ffebd0 (on dark)
- Accent: Amber Glow #fee197
- primary action: #ffebd0 (outlined action border)

## Example Component Prompts
1. **Full-bleed hero with overlay text**: Set a full-viewport photograph as the section background with no tint overlay. Position a headline bottom-left at 40px ModernEra 400 in Warm Parchment (#ffebd0), with 40px inset from left and bottom. Add a transparent header bar with the wordmark top-left and an outlined button (1px Warm Parchment border, 8px radius, 16px/8px padding) top-right.

2. **Portfolio image card on cream**: Warm Parchment (#ffebd0) background, full-column-width image with no border and no radius. Below the image, 40px of space, then a project name in ModernEra 400 at 16px in Obsidian (#000000), left-aligned.

3. **Two-column project section**: Cream (#ffebd0) canvas. Left column ~40% width: a square image. Right column ~60% width: a wider architectural exterior image. Below the right image, a single caption line at 16px ModernEra 400 in Obsidian. 40px padding around the entire group.

4. **Outlined action button on cream**: Transparent fill, 1px Obsidian (#000000) border, 8px border-radius, 18px horizontal padding, 16px vertical padding. Label text in ModernEra 500 at 16px in Obsidian. No shadow, no gradient.

5. **Dark editorial section with overlay**: Full-bleed warm-toned photograph as background. Section title in ModernEra 400 at 28px in Warm Parchment (#ffebd0), positioned top-left with 40px inset. Optional category label top-right at 16px in Warm Parchment.

## Similar Brands

- **Snøhetta** — Same warm cream backgrounds, full-bleed architectural photography, and restrained editorial typography — both treat the website as a portfolio of built work rather than a product
- **Selvaag Bolig** — Norwegian real estate with the same gallery-walk rhythm: dark photographic hero sections alternating with cream content areas, custom sans-serif, minimal outlined navigation
- **M Moser Associates** — Same flat-design discipline with no shadows, hairline borders, warm neutral palette, and full-bleed photography as the primary visual content
- **BIG (Bjarke Ingels Group)** — Architecture firm using full-viewport project photography with minimal text overlays and a single restrained typeface throughout
- **The Modern House** — Same editorial gallery approach to real estate — warm cream page surfaces, large untitled photographs, and a single humanist sans-serif at modest sizes

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-parchment: #ffebd0;
  --color-candlelight: #fff8e9;
  --color-obsidian: #000000;
  --color-walnut-shell: #2f2116;
  --color-aged-bronze: #4f3622;
  --color-amber-glow: #fee197;
  --color-muted-gold: #987f61;

  /* Typography — Font Families */
  --font-modernera: 'ModernEra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.4;
  --text-body: 18px;
  --leading-body: 1.25;
  --text-subheading: 20px;
  --leading-subheading: 1.22;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1.17;
  --text-display: 40px;
  --leading-display: 1.17;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 100px;
  --card-padding: 40px;
  --element-gap: 12-20px;

  /* Border Radius */
  --radius-lg: 8px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 8px;
  --radius-images: 0px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-walnut-shell: #2f2116;
  --surface-warm-parchment: #ffebd0;
  --surface-candlelight: #fff8e9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-parchment: #ffebd0;
  --color-candlelight: #fff8e9;
  --color-obsidian: #000000;
  --color-walnut-shell: #2f2116;
  --color-aged-bronze: #4f3622;
  --color-amber-glow: #fee197;
  --color-muted-gold: #987f61;

  /* Typography */
  --font-modernera: 'ModernEra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.4;
  --text-body: 18px;
  --leading-body: 1.25;
  --text-subheading: 20px;
  --leading-subheading: 1.22;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1.17;
  --text-display: 40px;
  --leading-display: 1.17;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
}
```
