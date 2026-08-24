# Simone Sniekers — Style Reference
> A single editorial photograph breathes behind whisper-thin black captions — the image does all the work, the UI almost disappears.

**Theme:** light

Simone Sniekers is a photography portfolio stripped to its essence: the photograph is the interface. The site uses a single full-bleed editorial image as the entire canvas, with a barely-there UI layer of three text elements — a progress counter bottom-left, a name credit bottom-center, and an 'Info' trigger bottom-right. Typography is unified to one size and one weight across every UI element, treating all chrome as equal-weight caption text. The color palette is almost entirely photographic: warm amber, vermillion, and ochre washes bleed from the imagery itself, while the UI overlay sticks to black on whatever the photo presents. No cards, no borders, no shadows, no gradients in the traditional sense — the image provides all visual richness.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Dark borders and separators for elevated surfaces and inverted UI |
| Paper White | `#ffffff` | `--color-paper-white` | Inset text on dark photographic zones and button border accents |
| Warm Fog | `#bcbcbc` | `--color-warm-fog` | Dominant canvas wash — the neutral mid-tone the warm gradient settles into at its lower band |
| Bone | `#cccbbb` | `--color-bone` | Cool-warm neutral surface, secondary canvas tone between photography passages |
| Slate Drift | `#c0c4ca` | `--color-slate-drift` | Cooler neutral surface variant for section breaks and contrast |
| Rose Clay | `#cdbcb9` | `--color-rose-clay` | Warm-tinted neutral surface — desaturated pink-beige for soft section transitions |
| Linen | `#cfbca6` | `--color-linen` | Warm cream neutral for lighter photographic sections |
| Graphite | `#4f4c4c` | `--color-graphite` | Mid-neutral for subdued text and secondary borders |
| Espresso | `#2e2321` | `--color-espresso` | Deep warm neutral for dark photographic zones and shadow anchors |
| Vermillion | `#e01365` | `--color-vermillion` | Photographic accent — vivid magenta-red pulled from editorial imagery, not a UI token |
| Saffron | `#d0a43e` | `--color-saffron` | Photographic accent — warm gold from editorial imagery, bleeds into the canvas wash |
| Cinnabar | `#cc4132` | `--color-cinnabar` | Photographic accent — vivid red-orange from editorial imagery |
| Ochre | `#a48b0b` | `--color-ochre` | Photographic accent — deep saturated gold from editorial imagery |

## Tokens — Typography

### Neue Haas Grotesk — The only typeface and the only size — applied to every UI element (progress counter, name credit, info button, nav). Using a single weight and size for all chrome treats every UI element as equal-weight editorial caption text, not as hierarchical interface · `--font-neue-haas-grotesk`
- **Substitute:** Helvetica Neue, Inter, Neue Haas Unica
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00, 1.20
- **Letter spacing:** normal
- **Role:** The only typeface and the only size — applied to every UI element (progress counter, name credit, info button, nav). Using a single weight and size for all chrome treats every UI element as equal-weight editorial caption text, not as hierarchical interface

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1 | — | `--text-caption` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Full-Bleed Editorial Image
**Role:** The primary content surface — occupies the entire viewport as the page background

Single photographic image fills 100% viewport width and height. No padding, no border, no radius, no shadow. The image carries all visual weight; UI elements float over it. Color and warmth are provided entirely by the photograph.

### Progress Counter (bottom-left)
**Role:** Scroll/section position indicator

Left-aligned text at bottom edge, 16px Neue Haas Grotesk weight 400, #000000, positioned with 12-16px from viewport edge. No background, no border. Displays percentage like '0%'.

### Name Credit (bottom-center)
**Role:** Persistent photographer attribution

Center-aligned text at bottom edge, 16px Neue Haas Grotesk weight 400, #000000. No decoration. Functions as both watermark and navigation anchor to home.

### Info Trigger (bottom-right)
**Role:** Secondary navigation to metadata or contact

Right-aligned text at bottom edge, 16px Neue Haas Grotesk weight 400, #000000. Functions as a text-only link — no button chrome, no background, no border. Identical typographic treatment to the progress counter and name credit.

### Three-Element Bottom Bar
**Role:** Minimal persistent UI layer

Three text nodes anchored to bottom of viewport: progress (left), name (center), info (right). All 16px, weight 400, #000000. No container, no background, no divider lines. Spacing between elements is governed by viewport edges and flex distribution.

## Do's and Don'ts

### Do
- Use exactly one type size (16px) and one weight (400) for all UI chrome — do not introduce hierarchy through type
- Let the photograph provide all color, warmth, and visual richness — the UI layer stays black on whatever the image presents
- Anchor UI elements to viewport edges (top, bottom, corners) rather than centering them in content areas
- Use Neue Haas Grotesk or Helvetica Neue as the system typeface — no serif, no display, no decorative fonts
- Treat every interactive element as a text link — no buttons, no backgrounds, no borders, no fill states
- Let images bleed to the full viewport with zero padding, zero radius, zero border

### Don't
- Do not introduce a type scale — do not use multiple font sizes to create visual hierarchy
- Do not use card components, containers, boxes, or any surface that frames the image
- Do not add shadows, gradients, or background colors to UI elements
- Do not use chromatic colors for UI chrome — all color comes from the photography
- Do not add borders or dividers between UI elements or sections
- Do not use rounded corners on any element — the system is entirely sharp-edged
- Do not add navigation menus, hamburger icons, or visible chrome beyond the three text elements

## Elevation

The design intentionally has no elevation. The photograph IS the surface — it occupies the full viewport at z-index zero, and all UI text floats directly on it without containers, shadows, or backgrounds to create separation. This eliminates the distinction between foreground and background, making the photograph and the UI coexist in the same visual plane.

## Imagery

Full-bleed editorial fashion photography. Single hero image occupies the entire viewport. The model wears avant-garde sculptural clothing in vivid vermillion, saffron, and black against warm amber and ochre tones. Lighting is studio-controlled with rich directional warmth. The image bleeds to all edges with no padding or framing. The photograph is not cropped or masked — it IS the page. The warm gradient quality (red-orange at top transitioning to golden yellow at bottom) is baked into the photograph itself, not an overlay.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: photographic (no solid UI background — the image is the canvas)
- border: none (UI uses no borders)
- accent: no distinct UI accent color (chromatic warmth comes from photography only)
- surface: #bcbcbc (neutral wash when photography is absent)
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a full-bleed editorial photograph page: image fills 100vw × 100vh with no padding, no border, no radius. A single 16px Neue Haas Grotesk weight 400 text element at bottom-left reading '0%' in #000000. A 16px weight 400 text at bottom-center reading 'Simone Sniekers' in #000000. A 16px weight 400 text at bottom-right reading 'Info' in #000000. No containers, no backgrounds, no borders anywhere.
2. Create a progress counter: 16px Neue Haas Grotesk weight 400, #000000, positioned 12px from the bottom-left viewport edge. No background, no border, no padding. Text only.
3. Create a name credit watermark: 16px Neue Haas Grotesk weight 400, #000000, centered horizontally, positioned 12px from the bottom viewport edge. No decoration, no background, no link styling.
4. Create an info text link: 16px Neue Haas Grotesk weight 400, #000000, positioned 12px from the bottom-right viewport edge. Behaves as a text link with no button styling, no background, no border, no fill state on hover.
5. Create the bottom UI bar: three 16px Neue Haas Grotesk weight 400 #000000 text elements distributed left/center/right along the bottom edge of the viewport, separated only by flex space-between distribution with no visible dividers.

## Similar Brands

- **Mert Alas (mertalas.com)** — Same full-bleed editorial photograph with minimal black text overlay and no visible UI chrome
- **Tim Walker (timwalkerphotography.com)** — Same single-image-per-viewport approach with the photograph as the entire page and whisper-thin caption text
- **Annie Leibovitz (annieleibovitz.com)** — Same photographer-portfolio pattern where one image fills the screen and UI text is reduced to near-invisibility
- **Paolo Roversi (paoloroversi.com)** — Same approach of letting editorial fashion photography occupy the full viewport with no card frames, borders, or type hierarchy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-warm-fog: #bcbcbc;
  --color-bone: #cccbbb;
  --color-slate-drift: #c0c4ca;
  --color-rose-clay: #cdbcb9;
  --color-linen: #cfbca6;
  --color-graphite: #4f4c4c;
  --color-espresso: #2e2321;
  --color-vermillion: #e01365;
  --color-saffron: #d0a43e;
  --color-cinnabar: #cc4132;
  --color-ochre: #a48b0b;

  /* Typography — Font Families */
  --font-neue-haas-grotesk: 'Neue Haas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-16: 16px;

  /* Layout */
  --card-padding: 0px;
  --element-gap: 12px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-warm-fog: #bcbcbc;
  --color-bone: #cccbbb;
  --color-slate-drift: #c0c4ca;
  --color-rose-clay: #cdbcb9;
  --color-linen: #cfbca6;
  --color-graphite: #4f4c4c;
  --color-espresso: #2e2321;
  --color-vermillion: #e01365;
  --color-saffron: #d0a43e;
  --color-cinnabar: #cc4132;
  --color-ochre: #a48b0b;

  /* Typography */
  --font-neue-haas-grotesk: 'Neue Haas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
}
```
