# ddna — Style Reference
> warm museum vitrine on raw linen

**Theme:** light

ddna is a warm earth-toned luxury system built on a single temperature of pigment: cream canvas, stone beige surfaces, dark warm-charcoal text. There is no accent color — the brand speaks through material, texture, and generous silence. Typography is uniformly weight 400 across every level, with wide tracking on small text that makes even body copy feel like a museum label. The hero is a composition of iridescent floating orbs against a peach-cream field, the only chromatic event in an otherwise monochrome world. Surfaces are flat and shadowless; depth comes from tonal layering, not elevation. Components are quiet to the point of absence — text links replace buttons, labels replace cards, and the product photography does the work that chrome would normally do.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Stone Charcoal | `#444242` | `--color-stone-charcoal` | Primary text, navigation links, hairline borders, footer anchors — dark warm gray carries the same temperature as the cream surfaces it sits on, never pure black |
| Linen Cream | `#efe3dc` | `--color-linen-cream` | Heading text, footer surface, and the lighter plane in the surface stack — sits one step above the canvas |
| Warm Sand | `#dacabf` | `--color-warm-sand` | Page canvas — the dominant field every section and hero lives on |
| Dust | `#938a83` | `--color-dust` | Secondary borders and dividers when Stone Charcoal would be too heavy |
| Mortar | `#595552` | `--color-mortar` | Muted body text and subdued borders — the quietest readable neutral |

## Tokens — Typography

### Basis — Body, nav, labels, captions — the only text family used for everything below display. The 0.066–0.099em tracking on 10–14px is the signature: it makes small text feel like a printed catalogue label rather than screen UI. · `--font-basis`
- **Substitute:** Söhne, Inter, or Untitled Sans
- **Weights:** 400
- **Sizes:** 10px, 14px, 15px, 17px
- **Line height:** 1.0–1.5
- **Letter spacing:** 0.066em at 14–15px, 0.099em at 10px
- **Role:** Body, nav, labels, captions — the only text family used for everything below display. The 0.066–0.099em tracking on 10–14px is the signature: it makes small text feel like a printed catalogue label rather than screen UI.

### Favorit — Display and heading — set at a single 30px size, weight 400 only. The narrow, slightly quirky character shapes (open apertures, subtle inktraps) carry all the personality the system allows. No bold weight exists. · `--font-favorit`
- **Substitute:** Söhne Breit, Migra, or Editorial New (light)
- **Weights:** 400
- **Sizes:** 30px
- **Line height:** 1.3–2.0
- **Role:** Display and heading — set at a single 30px size, weight 400 only. The narrow, slightly quirky character shapes (open apertures, subtle inktraps) carry all the personality the system allows. No bold weight exists.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | 0.99px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.92px | `--text-body-sm` |
| body-lg | 17px | 1.5 | 1.12px | `--text-body-lg` |
| heading | 30px | 1.3 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 33 | 33px | `--spacing-33` |
| 45 | 45px | `--spacing-45` |
| 50 | 50px | `--spacing-50` |
| 100 | 100px | `--spacing-100` |
| 135 | 135px | `--spacing-135` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 100px
- **Card padding:** 135px
- **Element gap:** 20-25px

## Components

### Top Navigation
**Role:** Site header

Full-bleed, transparent over canvas. Logo (Favorit-style wordmark) at far left, 3–4 nav links at far right. Links in Basis 14px, weight 400, letter-spacing 0.066em, color Stone Charcoal. 50px horizontal padding, 25px vertical padding. No background, no border, no shadow.

### Text Link with Arrow
**Role:** Primary action affordance

The system has no filled buttons. A text link in Basis 14px weight 400, color Stone Charcoal, with a downward arrow glyph (↓) for scroll cues or a right arrow for navigation. Underline appears only on hover. This is the only 'CTA' the system uses.

### Product Card
**Role:** Jewelry item display

Full-bleed image card with no border, no radius, no shadow. Image fills the card edge-to-edge. Product name overlay in Basis 10–14px, letter-spacing 0.066–0.099em, color Stone Charcoal on a Linen Cream chip or directly on the image. Padding around card content: none — image bleeds. Card-to-card gap: 25px.

### Hero Composition
**Role:** Above-the-fold brand statement

Full-viewport Warm Sand canvas with a scattered constellation of iridescent 3D orbs (content, not tokens — purple/magenta/teal). Centered headline overlay in Favorit 30px, weight 400, line-height 2.0, color Stone Charcoal, max-width ~600px. 100px bottom padding, 50px horizontal padding.

### Statement Paragraph
**Role:** Brand body copy

Centered, Favorit 30px weight 400 at line-height 2.0, color Stone Charcoal. Two sentences max. This is the only place Favorit runs long — the wide line-height gives body text a poetic, spaced-out rhythm.

### Section Container
**Role:** Vertical rhythm unit

Full-bleed Warm Sand bands stacked vertically. Section gap: 100px. Horizontal padding: 50px. No dividers between sections — visual rhythm comes from whitespace alone.

### Footer
**Role:** Site footer

Linen Cream (#efe3dc) surface — one tonal step lighter than the Warm Sand canvas above it. Basis 10–14px text, letter-spacing 0.066–0.099em, color Stone Charcoal. Minimal link list, no logo repeat, no social icons.

### Image Label
**Role:** Product caption overlay

Basis 10px, weight 400, letter-spacing 0.099em, uppercase by convention. Sits on a Linen Cream rectangular chip at top-left of the image with 25px padding. No border, no radius.

## Do's and Don'ts

### Do
- Set all text at weight 400 — never introduce bold or semibold weights, the system has no hierarchy through weight
- Use 0.066em letter-spacing on 14–15px text and 0.099em on 10px captions to maintain the catalogue-label feel
- Keep the palette to five warm neutrals (#444242, #595552, #938a83, #dacabf, #efe3dc) — no accent colors, no blue links
- Use Favorit at 30px with line-height 2.0 for any heading or statement — one size, one leading, one weight
- Build depth through tonal layering (sand → cream → charcoal), never through box-shadow
- Pair every affordance with a downward or rightward arrow glyph instead of a button shape
- Use full-bleed product images with 0px radius — let the texture and material do the work

### Don't
- Do not add drop-shadows, blurs, or any z-axis elevation to cards, buttons, or images
- Do not introduce a brand accent color — the iridescent orbs are content, not tokens
- Do not use bold (600/700) or semibold (500) weights at any level
- Do not use border-radius greater than 0px on any component — sharp edges preserve the printed-catalogue feel
- Do not set body copy below 14px or above 17px; display should stay at 30px
- Do not fill a button background — the system uses text links with arrow glyphs, not filled rectangles
- Do not separate sections with hairline dividers; use 100px of whitespace as the only separator

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Warm Sand | `#dacabf` | Page canvas — every section sits on this warm beige field |
| 2 | Linen Cream | `#efe3dc` | Footer and lighter text-grounding surface, one step lighter than canvas |
| 3 | Stone Charcoal | `#444242` | Inverted dark surface for contrast moments — anchors the tonal stack |

## Elevation

No shadows, no blur, no z-axis. Depth is purely tonal: the surface stack moves through warm beige → cream → charcoal, and that is the entire elevation model. Any added drop-shadow would break the flat, printed-catalogue language.

## Imagery

Imagery is the system's only chromatic event. The hero is a constellation of iridescent 3D orbs — translucent spheres in magenta, teal, and violet with subsurface scattering and soft cast shadows on the Warm Sand floor. These are content, not decorative chrome: they carry the brand's only color. Product photography uses tight, edge-to-edge crops of raw materials (wood grain, stone, bone, woven fabric) as backgrounds beneath jewelry — no lifestyle context, no models, no hands. The object sits on its own material, like a museum specimen.

## Layout

Full-bleed Warm Sand canvas, no max-width container. The hero is a viewport-height composition with centered text overlay floating over scattered 3D orbs. Sections stack vertically as Warm Sand bands with 100px gaps — no dividers, no alternating colors, no card grids breaking the page rhythm. Content is positioned through generous side margins (50px+ on mobile, breathing room expanding on desktop) rather than a fixed container width. The product section uses a 2-column or full-bleed alternating grid where each product image bleeds to its column edge with no padding. Navigation is a single transparent bar with logo left and 3–4 links right. The footer is a Linen Cream band — the only tonal shift on the entire page.

## Agent Prompt Guide

**Quick Color Reference**
- text: #444242
- background: #dacabf
- surface: #efe3dc
- border: #444242 (primary) / #938a83 (secondary)
- muted text: #595552
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Create a hero section*: Full-viewport Warm Sand (#dacabf) background. Centered statement copy in Favorit 30px, weight 400, line-height 2.0, color #444242, max-width ~600px, 100px bottom padding. Below the copy, a ghost text link: 'Explore Collections ↓' in Basis 14px, weight 400, letter-spacing 0.066em, color #444242. No background, no border, no shadow.

2. *Create a product card*: Full-bleed image, 0px radius, no border, no shadow. Product name in Basis 10px, weight 400, letter-spacing 0.099em, color #444242, set on a Linen Cream (#efe3dc) chip at top-left with 25px padding. Card sits on Warm Sand (#dacabf) canvas with 25px gap to neighbors.

3. *Create the navigation bar*: Transparent background over Warm Sand (#dacabf) canvas. Logo wordmark (Favorit 30px, weight 400, #444242) at far left. 3–4 nav links at far right in Basis 14px, weight 400, letter-spacing 0.066em, color #444242. 50px horizontal padding, 25px vertical padding. No border, no shadow, no background fill.

4. *Create a footer*: Linen Cream (#efe3dc) background, 50px padding. 2–3 minimal link columns in Basis 10–14px, weight 400, letter-spacing 0.066–0.099em, color #444242. No logo repeat, no social icons, no filled buttons.

5. *Create a section band*: Full-bleed Warm Sand (#dacabf) background, 100px vertical gap to the next section, 50px horizontal padding. Centered heading in Favorit 30px weight 400 line-height 2.0, color #444242. No dividers, no card containers, no shadows.

## Similar Brands

- **Aesop** — Same warm monochromatic restraint, weight 400 typography, and the absence of accent colors — both let material and product photography carry the visual weight
- **Mara Hoffman** — Similar spacious warm-cream canvas, minimal nav, and floating organic imagery against a flat earth-toned field
- **The Elder Statesman** — Luxury brand with weight-400-only typography, wide letter-spacing on small text, and a tonal-neutral palette with no primary action color
- **Toast (toa.st)** — Earth-toned product presentation, generous whitespace, museum-label type tracking, and full-bleed material photography
- **Maison Margiela** — Printed-catalogue aesthetic, text links replacing buttons, and a near-monochromatic warm neutral system with no accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-stone-charcoal: #444242;
  --color-linen-cream: #efe3dc;
  --color-warm-sand: #dacabf;
  --color-dust: #938a83;
  --color-mortar: #595552;

  /* Typography — Font Families */
  --font-basis: 'Basis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 0.99px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.92px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 1.12px;
  --text-heading: 30px;
  --leading-heading: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-33: 33px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-100: 100px;
  --spacing-135: 135px;

  /* Layout */
  --section-gap: 100px;
  --card-padding: 135px;
  --element-gap: 20-25px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-warm-sand: #dacabf;
  --surface-linen-cream: #efe3dc;
  --surface-stone-charcoal: #444242;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-stone-charcoal: #444242;
  --color-linen-cream: #efe3dc;
  --color-warm-sand: #dacabf;
  --color-dust: #938a83;
  --color-mortar: #595552;

  /* Typography */
  --font-basis: 'Basis', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 0.99px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.92px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 1.12px;
  --text-heading: 30px;
  --leading-heading: 1.3;

  /* Spacing */
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-33: 33px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-100: 100px;
  --spacing-135: 135px;
}
```
