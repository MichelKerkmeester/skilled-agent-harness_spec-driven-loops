# ARKET — Style Reference
> Scandinavian white gallery. Full-bleed photography on bone-white canvases, hairline rules, and a small-caps monospace labeling each section like a museum wall tag.

**Theme:** light

ARKET is a Scandinavian fashion retailer whose digital presence reads as a curated white-gallery space: bone-white canvases, carbon-black type, hairline borders, and no color anywhere except inside the photography itself. Typography pairs a quiet humanist sans with a small-caps monospace that labels editorial cards like museum wall text, reinforcing the art-direction-over-advertising voice. Interactive elements are sharp (2px corners), flat, and rely on inversion rather than color for emphasis — a solid black button sits beside an outlined one at the same height. The system prizes restraint: generous whitespace, no gradients, minimal elevation, and a single nearly invisible blue accent reserved for links. Every screen should feel like a printed lookbook page — spacious, monochrome, and let the imagery do the chromatic work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon | `#000000` | `--color-carbon` | Primary text, navigation, icons, hairline borders, filled emphasis buttons, and the membership overlay surface |
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, card surfaces, and inverse text on dark surfaces |
| Linen | `#eaeae8` | `--color-linen` | Outlined button borders, tag and chip backgrounds |
| Mist | `#e0e0e0` | `--color-mist` | Hairline dividers, input borders, subtle section separators |
| Slate | `#333333` | `--color-slate` | Button labels and secondary headings on light surfaces |
| Graphite | `#666666` | `--color-graphite` | Input placeholder text and form helper copy |
| Pewter | `#767676` | `--color-pewter` | Muted metadata, tag fill, and secondary link underlines |
| Obsidian | `#080808` | `--color-obsidian` | Deep text and link stroke alternative — visually indistinguishable from Carbon but slightly softer on screen |
| Indigo Whisper | `#3860be` | `--color-indigo-whisper` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Arket Sans — Primary UI and body typeface. Renders navigation, buttons, links, form labels, and product copy. Humanist proportions with generous x-height keep body text legible at 13–16px while the 18–24px steps carry section headings without visual weight. · `--font-arket-sans`
- **Substitute:** Inter, Söhne, or system-ui sans-serif
- **Weights:** 400
- **Sizes:** 10px, 13px, 16px, 18px, 24px
- **Line height:** 1.23, 1.50
- **Role:** Primary UI and body typeface. Renders navigation, buttons, links, form labels, and product copy. Humanist proportions with generous x-height keep body text legible at 13–16px while the 18–24px steps carry section headings without visual weight.

### arketSansMono — The signature editorial label font. Used for navigation, product cards, tags, button text, and headings throughout the site. The monospace geometry contrasts the humanist sans and reinforces the museum-catalogue voice. · `--font-arketsansmono`
- **Substitute:** IBM Plex Mono, JetBrains Mono, or Roboto Mono
- **Weights:** 400
- **Sizes:** 10px, 12px, 16px, 22px, 28px
- **Line height:** 1.21, 1.27, 1.38, 1.50, 1.88
- **Role:** The signature editorial label font. Used for navigation, product cards, tags, button text, and headings throughout the site. The monospace geometry contrasts the humanist sans and reinforces the museum-catalogue voice.

### arketSCSansMono — Small-caps variant of the mono for editorial metadata like 'GUÍA DE CUIDADO', 'FEBRERO 2026', 'ENTREVISTAS'. Tighter letter-spacing (-0.05em) and uppercase transforms make category labels feel like archival wall text. · `--font-arketscsansmono`
- **Substitute:** IBM Plex Mono SC, JetBrains Mono with text-transform: uppercase
- **Weights:** 400
- **Sizes:** 10px, 12px, 16px
- **Line height:** 1.00, 1.38, 1.50
- **Letter spacing:** -0.5
- **OpenType features:** `"smcp" on, "c2sc" on`
- **Role:** Small-caps variant of the mono for editorial metadata like 'GUÍA DE CUIDADO', 'FEBRERO 2026', 'ENTREVISTAS'. Tighter letter-spacing (-0.05em) and uppercase transforms make category labels feel like archival wall text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body-md | 16px | 1.5 | — | `--text-body-md` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 22px | 1.21 | — | `--text-heading-sm` |
| heading | 24px | 1.23 | — | `--text-heading` |
| display | 28px | 1.21 | — | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| inputs | 2px |
| modals | 0px |
| buttons | 2px |
| contentBlocks | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 2px 10px 2px` | `--shadow-md` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64-80px
- **Card padding:** 20-24px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Slim top strip surfacing seasonal or membership messages

Full-bleed #ffffff background, single line of 12px arketSansMono text in Carbon. Inline link underlined with 1px Pewter. Padding 8px top/bottom, centered content. No divider above or below — it sits flush against the header.

### Primary Header Bar
**Role:** Sticky top navigation containing brand mark, search, and account actions

#ffffff background, 64px tall, no border. Left: ARKET wordmark in Arket Sans 24px Carbon. Center: 48px-tall search input with Linen border (#eaeae8), 2px radius, 12px Arket Sans placeholder in Graphite, and a leading search icon in Carbon. Right: account, wishlist, and bag icons in Carbon, 24px, 32px gap between.

### Category Navigation
**Role:** Horizontal product category selector below the header

#ffffff background, 48px tall, no border. Arket Sans 13px Carbon, uppercase-transformed, 32px horizontal gap. Active item uses Carbon weight 400 (no bolder weight — the system never increases weight to indicate state). Right-aligned utility links ('ARKET CAFÉ', 'Servicio de atención al cliente') and locale switcher in the same type style.

### Outlined Text Button
**Role:** Secondary action — explore, discover, read more

Transparent background, 1px Carbon border, 2px radius. Padding 12px 24px. Arket Sans 13px Carbon, uppercase or sentence case. Example from the hero: 'Explora novedades en ropa femenina' — a quiet invitation that doesn't compete with the photography.

### Solid Black Button
**Role:** Primary emphasis action — commit, join, checkout

#000000 fill, #ffffff text, 2px radius. Padding 12px 24px. Arket Sans 13px, letter-spacing normal. Example: 'Hacerse miembro' on the membership card. Always used sparingly — never more than one per viewport — because the system inverts for emphasis rather than colors.

### Membership Overlay Card
**Role:** Persistent bottom-right panel promoting the loyalty program

#000000 solid surface, #ffffff text, 0px radius (flush square corner). Padding 24px. Width ~320px. Headline in Arket Sans 16px white, body copy 12px white at 80% opacity, three checklist items with circular check icons in white. Solid Black Button anchored at the bottom for the CTA. The card floats above page content with no shadow — it relies on its tonal contrast alone to separate from the page.

### Editorial Content Card
**Role:** Journal or story tile in the 4-up content grid

Vertical card on #ffffff canvas, no border, no shadow, no radius (square corners in the grid, 20px radius only on container blocks). Image fills the top 70% of the card edge-to-edge with 0px radius. Below the image: 10px arketSansMono uppercase category label in Slate (#333333), then 22px Arket Sans headline in Carbon, then 13px Arket Sans excerpt in Pewter. 20px vertical gap between image and headline, 8px between headline and excerpt. Grid gap: 24px column, 32px row.

### Hero Image Block
**Role:** Full-bleed editorial photography anchoring the top of the page

100vw width, auto height (typically 70vh), 0px radius, no overlay text. A single outlined text button ('Explora novedades en ropa femenina') sits centered just below the image as the only UI element in the hero zone. The button has a #ffffff background to lift it off the photo.

### Search Input
**Role:** Inline product and content search in the header

#ffffff fill, 1px Linen (#eaeae8) border, 2px radius. 40px height, 16px horizontal padding. Leading search icon 16px Carbon. Placeholder 'Buscar' in 13px Graphite (#666666). No visible focus ring — on focus the border darkens to Carbon.

### Category Tag (Small Caps)
**Role:** Editorial metadata label above headlines and on product cards

#ffffff background, no border. 10px arketSCSansMono uppercase, letter-spacing -0.05em, in Slate (#333333). 0px padding, 8px bottom margin to the headline it labels.

### Footer Link Column
**Role:** Dense link grid in the site footer

#ffffff background, separated from content by a 1px Mist (#e0e0e0) top border. Column titles in 12px arketSansMono uppercase Carbon, 16px gap to the first link. Links in 13px Arket Sans Carbon, 8px row gap. Four to five columns on desktop, stacking to two on tablet and one on mobile.

### Product Card (implicit)
**Role:** Merchandising tile for clothing items in category grids

#ffffff surface, no border or radius. Product image edge-to-edge, 0px radius. Below: product name in 13px Arket Sans Carbon, price in 13px arketSansMono Carbon. 16px vertical gap between image and name, 4px between name and price. No hover state beyond image scale — the system doesn't add color or shadows on interaction.

## Do's and Don'ts

### Do
- Use 2px radius on all buttons, inputs, and tags — sharp corners are a signature of the ARKET restraint
- Pair a solid black button with an outlined white button at the same height when offering primary + secondary actions, rather than using a chromatic accent
- Use arketSCSansMono at 10–12px with -0.05em letter-spacing for editorial category labels and metadata, never for body copy
- Keep all UI surfaces achromatic — #ffffff canvas, Carbon text, Mist dividers, Linen borders — and let the photography supply the only color on a page
- Maintain 16px element gaps and 64–80px section gaps; whitespace is the primary hierarchy tool, not weight or color
- Use #000000 filled cards (like the membership overlay) as the only way to introduce tonal contrast; never add shadows to lift a surface
- Anchor every editorial content card with an edge-to-edge photograph at 0px radius — the image IS the card, the type sits below it like a caption

### Don't
- Never use the #3860be Indigo Whisper as a decorative fill, badge background, or illustration color — it exists only for link or interactive states
- Never increase type weight above 400 to signal emphasis — use size, position, or tonal contrast (black on white vs. white on black) instead
- Never add gradient fills, glow effects, or colored shadows — the system is deliberately flat
- Never round card corners with anything other than 0px in grids or 20px on isolated content blocks; mixing radii breaks the gallery wall feel
- Never replace the custom Arket Sans or arketSansMono with a system fallback in production — the mono is essential to the editorial voice
- Never add more than one filled black button per viewport — the inversion effect loses its emphasis if everything is inverted
- Never apply shadows to elevate cards, navigation, or modals — the single rgba(0,0,0,0.1) 0px 2px 10px 2px shadow is reserved for floating link tooltips only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background and card surfaces — the dominant uninterrupted light field |
| 2 | Hairline | `#e0e0e0` | Dividers, input borders, and tag outlines that separate content bands without weight |
| 3 | Inverse Panel | `#000000` | Membership card and filled emphasis buttons — solid black panels that invert type to white |

## Elevation

- **Floating link tooltip:** `rgba(0, 0, 0, 0.1) 0px 2px 10px 2px`

## Imagery

ARKET's visual language is photography-first, editorial-grade lifestyle imagery rendered as full-bleed or edge-to-edge blocks with 0px radius. Shots are high-key, softly lit by natural window light, and staged in calm domestic interiors — linen bedding, warm wood, neutral ceramics. Models appear unposed and intimate, often in motion or partially cropped, reinforcing the unretouched, quiet-luxury voice. Wardrobe stays within muted earth tones and softened primaries (terracotta, navy, oatmeal, deep red), so the photography carries all the chromatic weight the interface refuses to. The single blue accent (#3860be) never appears inside the imagery — it belongs only to the UI as a near-invisible link color. Icons throughout the site are thin, single-color Carbon line icons at 16–24px, used sparingly for account, search, wishlist, and cart actions.

## Layout

ARKET uses a full-bleed page model with no central max-width container on the hero and editorial bands — imagery and content stretch edge-to-edge. The page opens with a sticky two-row header (utility bar + main header) followed by a thin category navigation, then a single full-viewport hero photograph with a centered outlined text button beneath it. Below the hero, content shifts to a 4-column editorial card grid for journal content, with generous 64–80px vertical gaps between bands. A persistent membership overlay card anchors the bottom-right of the viewport, floating above all content. The footer is a dense 4–5 column link grid separated from the page by a 1px hairline. The system never uses alternating colored bands — every section shares the same #ffffff canvas, with tonal variation introduced only by photography.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 Carbon
- background: #ffffff Bone White
- border: #e0e0e0 Mist
- accent: #3860be Indigo Whisper (links only)
- inverse surface: #000000 Carbon with #ffffff text
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build the header: 64px tall, #ffffff background, no border. Left ARKET wordmark in Arket Sans 24px #000000. Center a 48px search input with 1px #eaeae8 border, 2px radius, 13px 'Buscar' placeholder in #666666. Right three icons (account, wishlist, bag) in #000000, 32px gap, 24px size.

2. Build an editorial content card: vertical card, no border, no shadow, 0px radius. Top 70% is a full-bleed photograph with 0px radius. Below the image, 20px gap, then a 10px arketSCSansMono uppercase category label in #333333. Below that 8px gap, a 22px Arket Sans headline in #000000. Below that 4px gap, a 13px Arket Sans excerpt in #767676.

3. Build the membership overlay card: 320px wide, #000000 background, #ffffff text, 0px radius, 24px padding. Headline 'Te damos la bienvenida al programa de membresía de ARKET' in Arket Sans 16px white at 100%. Three checklist items in 12px white at 80% opacity with circular check icons. Bottom-anchored solid black-outlined button with #ffffff border, #ffffff text, 2px radius, 12px 24px padding, reading 'Hacerse miembro'.

4. Build the hero zone: 100vw width, 70vh height, edge-to-edge photograph, 0px radius, no overlay text. Centered 16px below the image, an outlined text button — #ffffff background, 1px #000000 border, 2px radius, 12px 24px padding, 13px Arket Sans #000000 text reading 'Explora novedades en ropa femenina'.

5. Build the category navigation: 48px tall, #ffffff background, no border. Horizontal list of Arket Sans 13px #000000 items, uppercase, 32px column gap. Left-aligned: Mujer, Hombre, Niños, Home. Right-aligned: ARKET CAFÉ, Servicio de atención al cliente, ES | ES locale switcher.

## Typography Pairing Logic

The Arket Sans / arketSansMono pairing is load-bearing for the brand voice. Arket Sans (humanist, 400 only) carries everything that reads as 'product' — navigation, body copy, button labels, prices, forms. arketSansMono (monospace, 400 only) carries everything that reads as 'editorial' — section labels, category tags, dates, and metadata, especially in the arketSCSansMono small-caps variant. Because both families are locked at weight 400, hierarchy is expressed entirely through size, spacing, and the mono/sans switch — not through weight contrast. The small-caps variant arketSCSansMono at 10–12px with -0.05em letter-spacing is reserved exclusively for archival-style labels above editorial content, mimicking museum wall text.

## Similar Brands

- **COS** — Same Scandinavian restraint, achromatic UI, full-bleed editorial photography, and 2px corner radius on interactive elements
- **Toteme** — Identical white-gallery aesthetic, large serif-free headings paired with mono labels, and no color anywhere except inside campaign imagery
- **Mr Porter** — Same monochrome editorial layout language — black-on-white sans type, full-bleed hero photography, and a persistent side utility card
- **Aesop** — Equal commitment to achromatic UI, thin rule lines, monospace category labels, and letting the product photography carry all visual interest
- **&Other Stories** — Shares the H&M-group design DNA — custom humanist sans + monospace pairing, hairline borders, and a flat card-driven editorial grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon: #000000;
  --color-bone-white: #ffffff;
  --color-linen: #eaeae8;
  --color-mist: #e0e0e0;
  --color-slate: #333333;
  --color-graphite: #666666;
  --color-pewter: #767676;
  --color-obsidian: #080808;
  --color-indigo-whisper: #3860be;

  /* Typography — Font Families */
  --font-arket-sans: 'Arket Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arketsansmono: 'arketSansMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arketscsansmono: 'arketSCSansMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.21;
  --text-heading: 24px;
  --leading-heading: 1.23;
  --text-display: 28px;
  --leading-display: 1.21;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64-80px;
  --card-padding: 20-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-inputs: 2px;
  --radius-modals: 0px;
  --radius-buttons: 2px;
  --radius-contentblocks: 20px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 2px 10px 2px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-hairline: #e0e0e0;
  --surface-inverse-panel: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon: #000000;
  --color-bone-white: #ffffff;
  --color-linen: #eaeae8;
  --color-mist: #e0e0e0;
  --color-slate: #333333;
  --color-graphite: #666666;
  --color-pewter: #767676;
  --color-obsidian: #080808;
  --color-indigo-whisper: #3860be;

  /* Typography */
  --font-arket-sans: 'Arket Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arketsansmono: 'arketSansMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arketscsansmono: 'arketSCSansMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.21;
  --text-heading: 24px;
  --leading-heading: 1.23;
  --text-display: 28px;
  --leading-display: 1.21;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 20px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 2px 10px 2px;
}
```
