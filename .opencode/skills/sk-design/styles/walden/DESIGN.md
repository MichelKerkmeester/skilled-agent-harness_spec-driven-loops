# Walden — Style Reference
> A still forest floor — every product is a stone, every pixel is moss and silence.

**Theme:** light

Walden is a meditation and ritual-object brand whose interface behaves like a quiet gallery wall. The canvas is pure white; nearly every surface, border, and control is rendered in warm grayscale, with no chromatic accent anywhere in the system. Type is small, tight, and lowercase-leaning, and the only structural cues are hairline strokes in stone-gray (#d3cec5) — no drop shadows, no elevation tricks, no gradients. Full-bleed nature and product photography carries the entire emotional load, so the chrome around it must stay almost invisible. Components feel handmade, not templated: a 2px button radius, a 16px max radius on cards, and 1px inset rings as the only shadows in the system.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Ink | `#3f3f3f` | `--color-charcoal-ink` | Primary text, default borders, link underlines, icon strokes — the workhorse gray that carries almost every label and divider in the system |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, nav background, card surfaces, button text — the absolute ground of the interface |
| Stone Veil | `#d3cec5` | `--color-stone-veil` | Hairline borders, inset focus rings, soft separator lines — the warm gray that makes every edge feel like a seam in paper or stone, not a UI stroke |
| Sumi Black | `#030302` | `--color-sumi-black` | Filled button backgrounds, active state borders, highest-emphasis text — the near-black ink, warmer than pure black, used when a control must be pressed or selected |
| Ash | `#686867` | `--color-ash` | Secondary text, muted metadata, tertiary borders — used for captions, helper copy, and inactive states where Charcoal would be too heavy |
| Pebble | `#acacac` | `--color-pebble` | Lightest separator, disabled borders, placeholder strokes — the quietest gray, visible only when something must be outlined but not announced |
| Lampblack | `#000000` | `--color-lampblack` | Occasional deep text and body borders — reserved for the few headings and rules that need absolute black, used sparingly to avoid competing with Sumi |

## Tokens — Typography

### Graphik — Primary interface face — navigation, body copy, links, headings, product names. Weight 400 is the default for almost all text; weight 600 appears only on section titles and emphasized labels. The signature is restraint: the largest size on site is 20px, forcing a small, intimate reading experience that mirrors the brand's contemplative tone. No display weights, no italic, no dramatic scale jumps. · `--font-graphik`
- **Substitute:** Inter or Untitled Sans (close geometric grotesque matches)
- **Weights:** 400, 600
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px
- **Line height:** 1.00–1.67
- **Role:** Primary interface face — navigation, body copy, links, headings, product names. Weight 400 is the default for almost all text; weight 600 appears only on section titles and emphasized labels. The signature is restraint: the largest size on site is 20px, forcing a small, intimate reading experience that mirrors the brand's contemplative tone. No display weights, no italic, no dramatic scale jumps.

### Geist — Button and chip labels — a slightly different rhythm from Graphik, used specifically on interactive controls to give them their own voice without adding color or weight · `--font-geist`
- **Substitute:** Geist Sans (Google Fonts) or Söhne
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.00–1.40
- **Role:** Button and chip labels — a slightly different rhythm from Graphik, used specifically on interactive controls to give them their own voice without adding color or weight

### GT Standard Mono — Monospaced accent for product codes, SKUs, or small numeric metadata — appears sparingly as a technical whisper against the proportional Graphik · `--font-gt-standard-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.50
- **Role:** Monospaced accent for product codes, SKUs, or small numeric metadata — appears sparingly as a technical whisper against the proportional Graphik

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 18px | 1.3 | — | `--text-heading-sm` |
| heading | 20px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 16px |
| images | 0px |
| inputs | 2px |
| buttons | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(211, 206, 197) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(3, 3, 2) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(211, 206, 197) 0px 1px 0px 0px` | `--shadow-subtle-3` |

### Layout

- **Section gap:** 40-60px
- **Card padding:** 12px
- **Element gap:** 12-20px

## Components

### Primary Navigation Bar
**Role:** Sticky top bar holding brand mark, primary menu, utility links, and account/cart icons

White background (#ffffff), 1px bottom border in Stone Veil (#d3cec5), 12px vertical padding. Left: WALDEN wordmark in Charcoal Ink (#3f3f3f), 14px Graphik 600. Center: primary nav (Shop, Seating, Aroma, Home, Body) at 14px Graphik 400 in Charcoal. Right: utility links (Live Concierge, Hospitality and Studio) in 12px Graphik 400, then currency selector, search icon, account icon, cart icon — all 16px, 1.5px stroke, Charcoal.

### Filled Action Button
**Role:** The only high-emphasis control in the system — used for primary commerce actions

Background: Sumi Black (#030302). Text: Paper White (#ffffff) at 14px Geist 400, uppercase or sentence case. Padding: 4px vertical, 8px horizontal (compact pill). Border-radius: 2px. No shadow, no hover fill change — the near-black ink is already the most emphatic surface available, so it simply darkens to Lampblack (#000000) on press.

### Ghost Link Button
**Role:** Low-emphasis inline action — used in nav, breadcrumbs, and secondary flows

No background, no border. Text: Charcoal Ink (#3f3f3f) at 14px Graphik 400. On hover: 1px bottom border in Charcoal appears (the link/borderColor=48 pattern). Padding: 0, 10px vertical breathing room. No fill, no color shift — the only state change is an underline that fades in.

### Hero Product Banner
**Role:** Full-bleed editorial image that opens the page and carries the brand mood

Edge-to-edge photograph, no padding, no border, no radius. Optional centered overlay text in Paper White (#ffffff) at 16px Graphik 400 with a small caption line below in 12px Charcoal. The image is the component — no card, no container, no shadow.

### Product Feature Card
**Role:** Large single-product showcase with image, title, and optional link

White canvas. Full-width product photograph above, 0px radius, no border. Product title below image in Charcoal Ink at 14px Graphik 400, centered. Optional subline ('The Original Cushion') in 12px Ash (#686867). Vertical spacing between image and label: 20px. No card chrome, no hover lift — the image changes opacity on hover, nothing else moves.

### Category Grid Card
**Role:** Tiled product or collection image in a multi-column grid

Photograph fills the tile, 0px radius, no border. Title overlaid or sits below in 14px Graphik 400 Charcoal. Grid gap: 20px column, 20px row. No card surface, no shadow — tiles sit directly on the white canvas separated only by whitespace.

### Section Header
**Role:** Small left-aligned label introducing a content block

Text: Charcoal Ink (#3f3f3f) at 16px Graphik 400, sentence case, left-aligned at the page edge with 24px left padding. No rule, no underline, no uppercase treatment. The 16px size is the largest heading weight on site — the section breathes because the photography around it is loud.

### Text Input
**Role:** Form fields for search, email, concierge requests

No visible border by default. On focus: 1px bottom border in Stone Veil (#d3cec5) (the rgb(211,206,197) 0 1px 0 0 shadow pattern). Placeholder: Ash (#686867) at 14px Graphik 400. No rounded corners, no filled background — the input is a line on paper, not a box.

### Header Action Icon
**Role:** Search, account, and cart icons in the top nav

16px geometric line icons, 1.5px stroke, Charcoal Ink (#3f3f3f). No background, no border, no badge dot for cart count. Tappable hit area expanded to 24px square, but the icon itself stays small and quiet.

### Image Caption Overlay
**Role:** Small product or scene label centered on or beneath a hero image

14px Graphik 400, Charcoal Ink, centered. When overlaid on dark photography, color shifts to Paper White (#ffffff) for legibility. No background plate, no shadow — the text floats directly on the image.

### Footer
**Role:** Minimal closing block with secondary navigation and legal text

White background, 1px top border in Stone Veil (#d3cec5). Two or three rows of links in 12px Graphik 400 Charcoal, 20px row gap. No newsletter form, no social icons, no logo repeat. Legal copy in 10px Ash at the bottom, 40px above the footer edge.

### Currency / Locale Selector
**Role:** Dropdown in the top-right nav

Text: Charcoal Ink at 12px Graphik 400, followed by a small downward chevron icon at 10px. No border, no background. Opens a white dropdown panel with 1px Stone Veil border and 2px radius — the only place a small radius is used on a surface.

## Do's and Don'ts

### Do
- Keep the entire interface achromatic — never introduce a brand color, accent hue, or chromatic gradient.
- Use Stone Veil (#d3cec5) for every hairline border, divider, and focus ring; reserve Sumi Black (#030302) only for filled buttons and active states.
- Hold the type scale at 10–20px; if a heading needs to be louder, increase weight to 600, not size.
- Let product and nature photography occupy the full viewport width with 0px radius and no surrounding card chrome.
- Use the 2px button radius for all controls, inputs, and tags — and the 16px radius only on large content containers if a radius is required at all.
- Separate content with whitespace (40–60px section gap) rather than rules, dividers, or alternating background bands.
- Set body text in Charcoal Ink (#3f3f3f), never Lampblack (#000000), to preserve the warm grayscale cast.

### Don't
- Do not add drop shadows, elevation, or blur effects — the system uses 1px inset rings and hairline strokes only.
- Do not introduce a chromatic CTA color, hover fill, or selected-state highlight; the near-black button is already the loudest element.
- Do not use type larger than 20px — the small scale is the brand's signature, and oversized display type breaks the contemplative tone.
- Do not wrap product imagery in cards with borders, backgrounds, or padding; let the photograph touch the page edges.
- Do not use rounded corners above 2px on buttons, inputs, or tags — the 16px radius belongs to large content surfaces only.
- Do not alternate background colors between sections; keep the canvas uniformly white from top to bottom.
- Do not add icons inside buttons, colored badges, or status pills — the system has no chips, no tags, no notification dots.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | The universal canvas — every page, section, and component sits on this surface |
| 1 | Sumi Black | `#030302` | Inverted surface used only for filled buttons and the active nav/selection state |

## Elevation

The design has no elevation. Depth is communicated entirely through 1px hairline borders in Stone Veil (#d3cec5) and 1px inset rings in the same tone — the system treats the interface as a flat sheet of paper with drawn-on edges, never as stacked layers with cast shadows.

## Imagery

Full-bleed editorial photography is the primary visual language. Product shots are staged in natural settings — moss-covered forest floors, stone-paved zen courtyards, weathered wood decks — lit with soft overcast light. Products (matte ceramic cushions, rough-hewn stone, cast bronze, incense boxes) read as objects found in a landscape, not studio-packaged SKUs. Color treatment is desaturated and earth-toned, harmonizing with the warm grayscale UI. There are no illustrations, no icons-as-artwork, no decorative graphics — the photographs do all the emotional work, and the chrome around them disappears.

## Layout

The page is a vertical sequence of full-bleed image bands separated by small white gaps. The top nav is a single sticky white bar with hairline border. The hero is a full-viewport photograph with a centered two-line caption ('Space for the Self. Shop Best Sellers'). Below, section headers ('Meditation Seating', 'Aroma Products') sit left-aligned at the page edge in 16px, and each section is a single product photograph at full width, followed by a row of 3–4 square product tiles. Content is never centered in a max-width container — text and images both anchor to the page edges with consistent 24px gutters. The rhythm is: full-bleed image, quiet white gap, small label, next image.

## Agent Prompt Guide

**Quick Color Reference**
- text: #3f3f3f (Charcoal Ink)
- background: #ffffff (Paper White)
- border: #d3cec5 (Stone Veil)
- accent: none — the system is fully achromatic
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Sticky top navigation*: White background, 1px bottom border in #d3cec5, 12px vertical padding. WALDEN wordmark left in 14px Graphik 600 #3f3f3f. Center nav links (Shop, Seating, Aroma, Home, Body) in 14px Graphik 400 #3f3f3f. Right: utility links in 12px Graphik 400, then 16px stroke icons in #3f3f3f.

2. *Hero editorial banner*: Full-bleed photograph, 0px radius, no border. Centered two-line caption overlay in 16px Graphik 400 #ffffff (first line) and 12px Graphik 400 #ffffff at 80% opacity (second line). No card, no shadow, no padding.

3. *Product feature block*: Full-width product photograph with 0px radius. Below: product title in 14px Graphik 400 #3f3f3f, centered, with 20px gap above. No card surface, no border, no hover lift — image opacity drops to 0.85 on hover.

4. *Filled action button*: Background #030302, text #ffffff in 14px Geist 400, padding 4px vertical and 8px horizontal, border-radius 2px. No shadow. On press, background shifts to #000000.

5. *Section header label*: 16px Graphik 400 #3f3f3f, sentence case, left-aligned with 24px left padding from page edge, 40px top margin. No rule, no underline, no uppercase.

## Similar Brands

- **Aesop** — Same warm grayscale palette, tiny restrained type, photography-led hero, and complete absence of UI color — the interface disappears so the product can speak
- **Muji** — Identical aesthetic of achromatic minimalism, hairline borders, small grotesque type, and full-bleed product-in-nature photography with no decorative chrome
- **Cereal Magazine** — Same editorial photography treatment, quiet lowercase type, white canvas, and near-zero colorfulness — the page reads like a printed zine rather than a storefront
- **Maap (cycling apparel)** — Similar weight-600 wordmark paired with weight-400 nav, hairline separators, and full-bleed imagery — though Maap adds one accent hue, Walden holds to pure grayscale

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-ink: #3f3f3f;
  --color-paper-white: #ffffff;
  --color-stone-veil: #d3cec5;
  --color-sumi-black: #030302;
  --color-ash: #686867;
  --color-pebble: #acacac;
  --color-lampblack: #000000;

  /* Typography — Font Families */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-standard-mono: 'GT Standard Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.3;
  --text-heading: 20px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Layout */
  --section-gap: 40-60px;
  --card-padding: 12px;
  --element-gap: 12-20px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 16px;
  --radius-images: 0px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Shadows */
  --shadow-subtle: rgb(211, 206, 197) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(3, 3, 2) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(211, 206, 197) 0px 1px 0px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-sumi-black: #030302;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-ink: #3f3f3f;
  --color-paper-white: #ffffff;
  --color-stone-veil: #d3cec5;
  --color-sumi-black: #030302;
  --color-ash: #686867;
  --color-pebble: #acacac;
  --color-lampblack: #000000;

  /* Typography */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-standard-mono: 'GT Standard Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.3;
  --text-heading: 20px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgb(211, 206, 197) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(3, 3, 2) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(211, 206, 197) 0px 1px 0px 0px;
}
```
