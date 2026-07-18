# Glein — Style Reference
> Atelier lookbook on warm linen — full-bleed photography, hairline rules, one whisper-weight voice.

**Theme:** light

Glein operates as a monochromatic editorial canvas: oversized product and lifestyle photography fills nearly every viewport, with white sans-serif category labels floating directly on top of the imagery. The palette is a tight warm-achromatic system — Bone White, Midnight Black, a signature Warm Sand beige, and Concrete Gray — with zero chromatic accent, which forces the photography's natural tones (denim, linen, leather) to become the color story. Typography stays at weight 400 across both the grotesque and monospace companion; no bold weights exist, so hierarchy is built through size alone, culminating in a 111px display. Components are razor-thin: hairline black borders, zero radius, micro-padding, and no shadows. The result reads like an art-school lookbook — restrained, tactile, and quiet, where the absence of decoration is the signature.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#000000` | `--color-midnight-ink` | Primary text, nav hairline borders, footer dividers, section rules, button text. Dominant structural color — defines the graphic skeleton against the warm canvas |
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, card surfaces, overlay text on dark imagery, cookie dialog background. The breathing space |
| Warm Sand | `#ebe6dc` | `--color-warm-sand` | Secondary surface and section bands — the warm beige that gives the atelier its linen-like tactility. Section dividers, footer wash, category card backgrounds |
| Concrete Gray | `#8c8c8c` | `--color-concrete-gray` | Muted secondary text, tertiary borders, subdued image overlays. The recede color — present but never competing |
| Ash Gray | `#b3b3b3` | `--color-ash-gray` | Subtle dividers, inactive nav borders, low-emphasis rules. The quietest member of the scale |

## Tokens — Typography

### F-Grotesk — Primary grotesque — used for everything from body to display. The entire type system runs at weight 400 only; hierarchy is pure scale. · `--font-f-grotesk`
- **Substitute:** Söhne, Inter, or Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 13px, 15px, 20px, 30px, 111px
- **Line height:** 1.00, 1.19, 1.20, 1.30
- **Role:** Primary grotesque — used for everything from body to display. The entire type system runs at weight 400 only; hierarchy is pure scale.

### Maison-Neue-Mono — Monospace companion — navigation, category labels, button text, footer meta, promotional strip. The 'labelling' voice that contrasts the editorial grotesque. · `--font-maison-neue-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 13px, 15px, 20px
- **Line height:** 1.00, 1.19, 1.20, 1.30
- **Role:** Monospace companion — navigation, category labels, button text, footer meta, promotional strip. The 'labelling' voice that contrasts the editorial grotesque.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body-sm | 15px | 1.19 | — | `--text-body-sm` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading | 30px | 1 | — | `--text-heading` |
| display | 111px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 42 | 42px | `--spacing-42` |
| 156 | 156px | `--spacing-156` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 42px
- **Card padding:** 13px
- **Element gap:** 13px

## Components

### Category Image Tile
**Role:** Primary navigation and discovery surface — large editorial image with overlaid white category title

Full-bleed photography (denim, linen, leather textures) occupying 2-column or 3-column grid cells. White F-Grotesk 30px category title ('T-Shirts', 'Hosen', 'Leinen', 'Taschen klein') overlaid bottom-left. Below the title, a 13px monospace 'mehr anzeigen' link in #ffffff. No border, no radius, no shadow — the image is the component.

### Editorial Section Block
**Role:** Scrolling content band that mixes imagery with body text

Alternating layout: left-aligned or center-aligned text columns of 15–20px F-Grotesk body in #000000 on #ebe6dc warm sand background. Text max-width ~400px for comfortable line length. Section separated by hairline 1px #000000 rule or warm band transition.

### Top Promo Strip
**Role:** Persistent thin announcement bar above the navigation

Full-width hairline strip with 13px monospace text in #000000 on #ffffff. Promotional copy ('30-TAGE RÜCKGABERECHT', 'GRATIS VERSAND AB EUR 150,-') repeated three times across the viewport at 11px padding top/bottom. Separated from nav by a 1px #000000 bottom border.

### Primary Navigation
**Role:** Top-level site navigation with brand wordmark center

Horizontal bar: left cluster 'SHOP' / 'NACHHALTIGE MATERIALIEN' (monospace 13px), center brand wordmark 'Glein' (F-Grotesk 20px), right cluster 'STUDIO' / 'DE | EN' / 'Warenkorb'. 18px top padding. 1px #000000 bottom border. No background fill — sits on the page canvas.

### Hairline CTA Button
**Role:** Micro interactive element — 'Alle akzeptieren' and 'Auswählen' in the cookie dialog

Inverted black button: #000000 background, #ffffff text, F-Grotesk 13px. Padding 2px top/bottom, 6px left/right — a deliberately tiny footprint. Zero radius. Ghost alternative: #ffffff background, 1px #000000 border, #000000 text. No hover elevation, no shadow.

### Monospace Text Link
**Role:** Inline navigational link — 'mehr anzeigen' below category titles, footer links

13px Maison-Neue-Mono in #ffffff when on image overlays, #000000 on light surfaces. Underline on hover only. Generous letter-spacing from the mono face gives the link a label/tag character.

### Cookie Consent Dialog
**Role:** GDPR consent overlay

White card (#ffffff) centered or bottom-right on viewport. Black 1px border, zero radius, 24px padding. Body text in F-Grotesk 15px #000000 with underlined 'Datenschutzrichtlinie' link. Two buttons in a row: filled black 'Alle akzeptieren' + outlined black 'Auswählen'.

### Image Grid Container
**Role:** The layout chassis for category and product imagery

Multi-column CSS grid (2- or 3-column) with 0px gap — images meet edge to edge with no gutters. No rounded corners, no borders between cells. Photography carries the visual weight entirely.

### Brand Wordmark
**Role:** Centered logo lockup in the primary navigation

F-Grotesk 20px weight 400 in #000000. The wordmark is treated as a typographic element, not a graphic — no custom letterforms, no symbol mark beside it. The lowercase 'G' of 'Glein' is the only brand signature beyond the type system itself.

## Do's and Don'ts

### Do
- Keep every element at weight 400 — F-Grotesk and Maison-Neue-Mono both run single-weight. Build hierarchy through size and space, never through bold.
- Let photography fill the viewport edge to edge. No internal gutters in image grids, no rounded corners, no borders around photos.
- Overlay white F-Grotesk category titles directly on imagery. Use 30px for category names, 13px monospace for 'mehr anzeigen' sub-links.
- Separate sections with warm sand (#ebe6dc) bands or 1px #000000 hairlines — never with shadows or card elevation.
- Use Maison-Neue-Mono for all functional labels: nav items, buttons, tags, footer meta. The mono face is the system's 'utility voice'.
- Let the display type breathe: 111px F-Grotesk at line-height 1.0 with generous surrounding whitespace. No letter-spacing tightening — the natural mono-influenced rhythm of F-Grotesk carries it.
- Use the 2px/6px micro-padding for all interactive elements. Buttons are stamp-sized by design, not 'small by accident'.

### Don't
- Don't introduce any chromatic color. The system is 0% colorful — adding even one accent breaks the entire monochrome contract.
- Don't use bold, semibold, or light weights. The font files are loaded at 400 only; attempting 500/600/700 will fall back or look wrong.
- Don't add shadows, glows, or blur effects. The surface model is flat — elevation is communicated by warm-band transitions, not z-axis depth.
- Don't round corners. Every radius in the system is 0px. Adding border-radius introduces a 'card' or 'button' feel that contradicts the editorial-paper aesthetic.
- Don't use sans-serif for functional labels. Monospace is reserved for nav, buttons, and meta — mixing it with F-Grotesk here dilutes the atelier voice.
- Don't crowd the 111px display with surrounding UI. Display type needs air — no buttons, links, or images in its immediate margin zone.
- Don't use colored hover states on links. Underline-on-hover in the same color is the only state change the system supports.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background, cookie dialog surface, overlay text reverse |
| 1 | Warm Band | `#ebe6dc` | Secondary section background, warm neutral contrast band |
| 2 | Muted Field | `#8c8c8c` | Tertiary field, subdued image tint zones |

## Elevation

The system has no elevation. Surfaces are flat and differentiated by background color alone (white → warm sand → concrete gray) and by 1px #000000 hairline rules. This is a deliberate paper/print metaphor — the site reads like a magazine spread, not a software interface. Any shadow would break the editorial contract.

## Imagery

Imagery IS the interface. Photography is full-bleed, edge-to-edge in tight grid cells, with no rounded corners or decorative framing. Shots are editorial fashion photography: tight crops on garments (T-shirt on hanger, linen on body, leather bag, denim waistband with leather label), natural warm light, tactile material focus. No lifestyle context, no models in environment — the garment and its texture are the subject. Color treatment is honest and unmanipulated: denim blue, warm tan leather, natural linen cream become the page's only chromatic moments. Image density is extremely high — photography occupies roughly 70% of the viewport on category pages, with text overlay only as labels.

## Layout

Full-bleed editorial grid, no max-width container. The header is a thin announcement strip + hairline-bordered nav. The page body is a multi-column image grid (2-col on smaller viewports, 3-col on wider) with zero gap — tiles meet at shared edges. Category titles overlay the bottom-left of each image cell. Section transitions happen via warm sand (#ebe6dc) bands or 1px hairlines. Information sections (about, atelier address) use centered narrow text columns (~400px) on the warm sand band, creating a 'note from the studio' rhythm between image grids. Navigation is a fixed top bar with brand wordmark centered and functional links flanking.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- secondary surface: #ebe6dc (Warm Sand)
- border: #000000 (1px hairline)
- muted text: #8c8c8c
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Category Image Tile*: Full-bleed 3-column grid cell containing a fashion photograph. No padding, no border, no radius. White F-Grotesk 30px category title ('Leinen') overlaid at bottom-left, with 13px Maison-Neue-Mono 'mehr anzeigen' link directly beneath in #ffffff.

2. *Top Navigation*: Full-width bar with 1px #000000 bottom border. Left: 'SHOP' and 'NACHHALTIGE MATERIALIEN' in 13px Maison-Neue-Mono #000000. Center: 'Glein' wordmark in F-Grotesk 20px #000000. Right: 'STUDIO', 'DE | EN', 'Warenkorb' in 13px Maison-Neue-Mono. 18px top padding, 11px bottom padding. Background: #ffffff.

3. *Ghost Outlined Button*: White background, 1px #000000 border, zero radius. Text 'Auswählen' in F-Grotesk 13px #000000. Padding 2px vertical, 6px horizontal. No hover state change beyond a background-color shift to #ebe6dc.

4. *Editorial Text Block*: Centered narrow column (~400px max-width) on #ebe6dc warm sand background. Body text in F-Grotesk 20px weight 400, line-height 1.3, color #000000. No headings, no decorations — just generous typographic space.

5. *Promo Strip*: Full-width 1px #000000 bottom border, 11px top/bottom padding. Text 'GRATIS VERSAND AB EUR 150,-' repeated 3x in 13px Maison-Neue-Mono #000000, separated by whitespace, on #ffffff background.

## Similar Brands

- **Toteme** — Same editorial grid-with-overlay-text pattern and monochromatic surface treatment on product photography
- **The Row** — Identical single-weight type philosophy, zero-chrome palette, and full-bleed garment photography with hairline navigation
- **Studio Nicholson** — Same atelier/studio brand voice — warm-neutral canvas, oversized category type, monospace nav labels, no decorative UI
- **Lemaire** — Matches the lookbook-as-website approach — editorial photography, restrained type, warm sand and bone white surface system, hairline rules as the only graphic element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #000000;
  --color-bone-white: #ffffff;
  --color-warm-sand: #ebe6dc;
  --color-concrete-gray: #8c8c8c;
  --color-ash-gray: #b3b3b3;

  /* Typography — Font Families */
  --font-f-grotesk: 'F-Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-maison-neue-mono: 'Maison-Neue-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 15px;
  --leading-body-sm: 1.19;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading: 30px;
  --leading-heading: 1;
  --text-display: 111px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-42: 42px;
  --spacing-156: 156px;

  /* Layout */
  --section-gap: 42px;
  --card-padding: 13px;
  --element-gap: 13px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-band: #ebe6dc;
  --surface-muted-field: #8c8c8c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #000000;
  --color-bone-white: #ffffff;
  --color-warm-sand: #ebe6dc;
  --color-concrete-gray: #8c8c8c;
  --color-ash-gray: #b3b3b3;

  /* Typography */
  --font-f-grotesk: 'F-Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-maison-neue-mono: 'Maison-Neue-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 15px;
  --leading-body-sm: 1.19;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading: 30px;
  --leading-heading: 1;
  --text-display: 111px;
  --leading-display: 1;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-42: 42px;
  --spacing-156: 156px;
}
```
