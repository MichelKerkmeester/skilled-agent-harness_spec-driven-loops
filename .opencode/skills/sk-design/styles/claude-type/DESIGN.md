# Claude Type — Style Reference
> curated gallery on warm parchment

**Theme:** light

Claude Type operates as a curated type foundry gallery rendered on warm linen parchment: an editorial cream canvas, pill-shaped UI chrome, and arched image portals that frame type specimens like museum vitrines. The interface is almost entirely achromatic — deep warm-black text on cream surfaces — with a single electric green badge as the only chromatic punctuation. Frosted-glass navigation floats over content, display serifs are treated as hero artwork not as UI text, and borders rather than shadows define every surface. The visual rhythm is gallery-slow: generous breathing room, tombstone-arched cards, and the type itself doing the heavy lifting.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Cream | `#fcfbf7` | `--color-parchment-cream` | Primary page canvas and hero section background — warm off-white that flatters display serifs the way museum walls flatter paintings |
| Pure Linen | `#ffffff` | `--color-pure-linen` | Card surfaces, button fills, icon strokes — the cleanest white sits one step above the cream canvas to separate cards from page |
| Warm Linen | `#e7e4e0` | `--color-warm-linen` | Secondary surface and frosted nav background — a muted stone tone that softens the nav bar against the cream canvas |
| Ink Black | `#0d0d0f` | `--color-ink-black` | Primary text and button borders — near-black with a cool undertone, used for all body copy and the outlined button strokes |
| Espresso | `#2b1b1b` | `--color-espresso` | Secondary text and hairline borders — a warm dark brown that acts as the dominant border color across cards, nav, and dividers |
| Carbon | `#000000` | `--color-carbon` | SVG fills, logo marks, and icon strokes — pure black for the highest-contrast graphic elements |
| Bitter Brown | `#100401` | `--color-bitter-brown` | Dark showcase card background — nearly black with warm brown undertone, used for display type specimen cards to make white serifs glow |
| Acid Lime | `#99ff66` | `--color-acid-lime` | Accent badge fill for metadata tags — the only chromatic color in the UI, used sparingly to mark type specs, style counts, and new releases |

## Tokens — Typography

### MagicUIPro — Sole UI typeface — all navigation, body copy, buttons, labels, and section headings use this family at 11–18px; the custom font includes discretionary ligatures ("dlig") that add character to small text · `--font-magicuipro`
- **Substitute:** Inter, General Sans, or Söhne
- **Weights:** 400
- **Sizes:** 11px, 12px, 14px, 15px, 18px
- **Line height:** 1.00–2.00
- **Letter spacing:** 11px: -0.0020em, 12px: 0.0010em, 14px: 0.0020em, 15px: 0.0100em, 18px: 0.0200em
- **OpenType features:** `"dlig" on`
- **Role:** Sole UI typeface — all navigation, body copy, buttons, labels, and section headings use this family at 11–18px; the custom font includes discretionary ligatures ("dlig") that add character to small text

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | -0.022px | `--text-caption` |
| body-lg | 15px | 1.67 | 0.15px | `--text-body-lg` |
| subheading | 18px | 2 | 0.36px | `--text-subheading` |

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
| 32 | 32px | `--spacing-32` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 180 | 180px | `--spacing-180` |
| 208 | 208px | `--spacing-208` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px |
| badges | 100px |
| buttons | 100px |
| heroCard | 40px |
| archedCards | 900px |
| standardCards | 16-32px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 64-96px
- **Card padding:** 16px
- **Element gap:** 8-16px

## Components

### Frosted Glass Navigation Bar
**Role:** Primary site navigation

Floating pill-shaped bar with 100px border-radius, Warm Linen (#e7e4e0) semi-transparent background, and 1px Espresso (#2b1b1b) border. Contains CLAUDE wordmark centered with nav links in two pairs flanking it. Vertical padding 14px, horizontal padding 16px. Sits above content with a slight backdrop blur effect.

### Pill Nav Link
**Role:** Navigation item

Text-only link at 12–14px MagicUIPro weight 400, Ink Black (#0d0d0f) color. No background or border — the parent nav bar provides the pill shape. No active state styling visible beyond the grouping.

### Arched Image Card
**Role:** Product/editorial showcase card

Full-bleed image with 900px border-radius creating a tombstone/arched-top shape. No padding, no shadow, no border. Images fill the entire card. Used for fashion editorial and product photography in the hero row.

### Dark Display Specimen Card
**Role:** Typeface showcase on dark background

Bitter Brown (#100401) background, 900px border-radius (matching the arched card language). Contains oversized white display serif at 80–120px as the hero element. Two pill buttons centered below the display text. Represents the inverted dark variant of the arched card system.

### Outlined Pill Button
**Role:** Primary action button on dark cards

100px border-radius, 1px white border, transparent fill, white text at 14px MagicUIPro. Padding 14px vertical, 20px horizontal. Used for 'Explore' and 'Buy' actions on dark specimen cards.

### Filled Dark Pill Button
**Role:** Primary action on light backgrounds

100px border-radius, Ink Black (#0d0d0f) fill, white text at 14px MagicUIPro. Padding 14px vertical, 20px horizontal. High-contrast filled variant for CTAs on cream surfaces.

### Acid Lime Badge
**Role:** Metadata tag for type specimens

100px border-radius pill, Acid Lime (#99ff66) background, Ink Black (#0d0d0f) text at 12px. Padding 3px vertical, 8–10px horizontal. Marks metadata like '12 Styles' next to typeface names. The only chromatic element in the system.

### Standard Card
**Role:** Content card with border

16–32px border-radius, Pure Linen (#ffffff) background, 1px Espresso (#2b1b1b) border. No shadow. Padding 16px. Used for content blocks, type listings, and secondary information.

### Section Title
**Role:** Page section heading

MagicUIPro weight 400 at 18px, Ink Black color, letter-spacing 0.36px. Centered alignment. No bold weight — the type system is intentionally quiet, letting display serifs elsewhere carry visual weight.

### Hero Display Serif
**Role:** Typeface specimen headline

Custom serif (one of Claude's own typefaces) at 80–120px, white on Bitter Brown background. Tight letter-spacing, centered. This is product content, not UI — but establishes the typographic authority the entire site orbits.

### Gradient Feature Section
**Role:** Promotional band between content blocks

Full-bleed soft gradient section transitioning from pale green to warm peach/pink. Centered text at 18px MagicUIPro, weight 400. Creates a momentary color wash in an otherwise achromatic layout.

### Footer
**Role:** Site footer

Cream (#fcfbf7) background, generous padding (64px top, 48px bottom, 42px horizontal). Minimal text content in Ink Black. Hairline Espresso borders separate footer from content above.

## Do's and Don'ts

### Do
- Use 100px border-radius for all interactive elements: nav bar, buttons, badges, and tags
- Use 900px border-radius for full-bleed image cards and dark specimen cards to create the signature arched/tombstone shape
- Set all body text in MagicUIPro weight 400 — never use bold weights in UI copy; the system stays visually quiet so display serifs can speak
- Reserve #99ff66 (Acid Lime) exclusively for metadata badges; never apply it to backgrounds, borders, or body text
- Use #2b1b1b (Espresso) for all hairline borders at 1px; this warm brown is the structural line color across the system
- Maintain generous spacing: 64px minimum between major sections, 14–16px within component groups
- Activate "dlig" font-feature-settings on all MagicUIPro text to enable the custom discretionary ligatures

### Don't
- Do not add drop shadows, glows, or blur effects to cards or buttons — the system is shadow-free by design
- Do not introduce additional accent colors beyond #99ff66; the 3% colorfulness is intentional
- Do not use border-radius values below 10px for cards or 100px for interactive elements — the pill/arch vocabulary is binary
- Do not set body text above 18px or use MagicUIPro for display headlines; display serifs are product content, not UI
- Do not use pure white (#ffffff) as a page background — always use #fcfbf7 cream as the canvas
- Do not apply bold (600+) or semibold weights to MagicUIPro; the family exists at 400 only and any synthetic bolding breaks the system
- Do not center-align body paragraphs or create dense text blocks; the layout is gallery-sparse with generous line-height (1.6–2.0)

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#fcfbf7` | Base page background, hero sections |
| 1 | Linen Card | `#ffffff` | Card surfaces raised above canvas |
| 2 | Stone Overlay | `#e7e4e0` | Frosted nav bar, secondary surface |
| 3 | Bitter Card | `#100401` | Dark display specimen card — inverted surface for type showcase |

## Elevation

- **Arched Image Card:** `none — relies on full-bleed imagery and arched radius for presence`
- **Standard Card:** `none — 1px Espresso (#2b1b1b) border provides definition`
- **Frosted Nav:** `none — frosted glass effect replaces shadow as elevation signal`

## Imagery

Full-bleed editorial photography dominates the visual hierarchy: tight fashion crops, portraiture, and product close-ups fill the arched image cards with no padding or margins. Photography is naturalistic and high-resolution — no filters, duotones, or color treatments. The images function as type specimens' contextual environments, showing the typefaces in luxury editorial use. No illustrations, no abstract graphics, no icons beyond minimal UI nav indicators. The one gradient element (green-to-peach band) provides the only non-photographic color moment. Image density is high in the hero and feature sections, then drops to text-only for type specimen displays.

## Layout

Max-width ~1400px centered with full-bleed image cards breaking the container. The page follows an editorial rhythm: frosted glass nav floats over everything, then a three-column arched image hero row, then a full-bleed gradient text section, then alternating dark specimen cards and light content blocks. Section gaps are large (64–96px) creating gallery-pace breathing room. Content arrangement is consistently centered — no left-aligned text-left/image-right patterns. The layout treats the page as a vertical exhibition: each typeface or product gets its own dedicated dark card or light section with generous whitespace above and below.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0d0d0f
- background: #fcfbf7
- card surface: #ffffff
- border: #2b1b1b
- accent badge: #99ff66
- dark card: #100401
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Frosted Glass Nav Bar**: Floating pill navigation with 100px border-radius, semi-transparent #e7e4e0 background, 1px #2b1b1b border, 14px vertical padding, 16px horizontal padding. Center the CLAUDE wordmark in MagicUIPro 14px weight 400. Place 'Typefaces' and 'Studio' links to the left, 'Trials' and 'Cart' to the right, all in #0d0d0f at 12px.

2. **Arched Image Card**: Full-bleed editorial photograph with 900px border-radius creating a tombstone arch shape. No padding, no border, no shadow. The image fills the entire card edge to edge. Use for fashion, portrait, or product photography in showcase rows.

3. **Acid Lime Metadata Badge**: Small pill badge with 100px border-radius, #99ff66 background, #0d0d0f text in MagicUIPro 12px weight 400. Padding 3px vertical, 10px horizontal. Place inline next to typeface names or metadata. This is the only chromatic element — use sparingly.

4. **Dark Display Specimen Card**: Full-bleed card with 900px border-radius, #100401 background. Center a large white display serif at 80–120px as the showcase headline. Below the text, place two outlined pill buttons side by side: 100px radius, 1px white border, transparent fill, white 14px MagicUIPro text, 14px vertical and 20px horizontal padding.

5. **Standard Content Card**: White (#ffffff) background, 16–32px border-radius, 1px #2b1b1b border, 16px internal padding. No shadow. Contains MagicUIPro body text at 14px in #0d0d0f with 1.6 line-height. Use for type listings, descriptions, and secondary content blocks.

## Radii Vocabulary

The system uses a deliberate two-mode radius language: 100px for all interactive/contained elements (pills) and 900px for all full-bleed surfaces (arches). Intermediate values (16px, 32px) exist only for standard content cards. Never use 4px or 8px radii — there is no sharp-corner mode in this system. The 900px value is asymmetric: it creates the tombstone arch on top while the bottom remains straight, making every full-bleed card read as a portal or doorway.

## Type as Product

Claude Type sells typefaces, so display serifs appear as product content rather than UI elements. The UI itself is intentionally typographically quiet — MagicUIPro at weight 400 in small sizes (11–18px) with generous line-height. This creates a deliberate contrast: the interface whispers so the typefaces can sing. When generating pages, render display serifs as large centered artwork within dark specimen cards; never use them for navigation, labels, or functional UI text.

## Similar Brands

- **Dinamo (dinamo.xyz)** — Same editorial type foundry aesthetic with pill-shaped nav, cream canvas, and display serifs treated as hero artwork
- **Production Type** — French/European type foundry sensibility with gallery-sparse layouts, warm neutral palettes, and large type specimens
- **Grilli Type** — Minimal foundry site with frosted glass nav, arched image treatments, and achromatic palette with single accent color
- **Sharp Type** — Type specimen presentation with dark inverted cards for display type, pill buttons, and cream/off-white light sections
- **Future Fonts** — Curated type marketplace with tombstone/arched card shapes, warm linen backgrounds, and borders-as-structure (no shadows)

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-cream: #fcfbf7;
  --color-pure-linen: #ffffff;
  --color-warm-linen: #e7e4e0;
  --color-ink-black: #0d0d0f;
  --color-espresso: #2b1b1b;
  --color-carbon: #000000;
  --color-bitter-brown: #100401;
  --color-acid-lime: #99ff66;

  /* Typography — Font Families */
  --font-magicuipro: 'MagicUIPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.022px;
  --text-body-lg: 15px;
  --leading-body-lg: 1.67;
  --tracking-body-lg: 0.15px;
  --text-subheading: 18px;
  --leading-subheading: 2;
  --tracking-subheading: 0.36px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-180: 180px;
  --spacing-208: 208px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 64-96px;
  --card-padding: 16px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 900px;

  /* Named Radii */
  --radius-nav: 100px;
  --radius-badges: 100px;
  --radius-buttons: 100px;
  --radius-herocard: 40px;
  --radius-archedcards: 900px;
  --radius-standardcards: 16-32px;

  /* Surfaces */
  --surface-cream-canvas: #fcfbf7;
  --surface-linen-card: #ffffff;
  --surface-stone-overlay: #e7e4e0;
  --surface-bitter-card: #100401;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-cream: #fcfbf7;
  --color-pure-linen: #ffffff;
  --color-warm-linen: #e7e4e0;
  --color-ink-black: #0d0d0f;
  --color-espresso: #2b1b1b;
  --color-carbon: #000000;
  --color-bitter-brown: #100401;
  --color-acid-lime: #99ff66;

  /* Typography */
  --font-magicuipro: 'MagicUIPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.022px;
  --text-body-lg: 15px;
  --leading-body-lg: 1.67;
  --tracking-body-lg: 0.15px;
  --text-subheading: 18px;
  --leading-subheading: 2;
  --tracking-subheading: 0.36px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-180: 180px;
  --spacing-208: 208px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 900px;
}
```
