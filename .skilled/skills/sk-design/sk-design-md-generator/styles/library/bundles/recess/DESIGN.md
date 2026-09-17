# Recess — Style Reference
> pastel sunset over a swimming pool

**Theme:** mixed

Recess lives in a daydream of pastel skies: soft periwinkle canvases, peach-pink horizon glows, and floating cloud shapes create an atmosphere of deliberate calm rather than commerce. The brand speaks through one confident geometric sans-serif (Sharp Grotesk) paired with a script logo lockup — the contrast between structural type and hand-drawn mark defines the personality. Color is mood, not decoration: deep navy ink carries all text, a single vivid blue punctuates emphasis, and the rest of the palette is washed-out lavender, cream, and coral that feel like the inside of a sunset. Components are low-elevation and quietly rounded — borders and soft fills do the work, not shadows. The layout is centered, generous, and breathing-room heavy, with a horizontal marquee banner at the very top and content that always feels like it could be a magazine spread.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Twilight Navy | `#25385b` | `--color-twilight-navy` | Primary text, headings, body copy, links, icons — the structural ink color that carries the entire voice |
| Periwinkle Sky | `#a2b0ff` | `--color-periwinkle-sky` | Dominant section background, soft accents, atmospheric washes — the signature background that gives Recess its dreamy identity |
| Dusk Indigo | `#0a0a3a` | `--color-dusk-indigo` | Footer backgrounds, high-contrast dark surfaces, deep accent fills |
| Cobalt Pop | `#3252f4` | `--color-cobalt-pop` | Rare vivid accent for emphasis, active states, and standout headings — used sparingly to create a single electric beat against the muted palette |
| Coral Blush | `#ff5a5a` | `--color-coral-blush` | Decorative warmth, occasional accent — the single warm note in an otherwise cool palette |
| Cloud White | `#ffffff` | `--color-cloud-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Cream Linen | `#fffcef` | `--color-cream-linen` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Slate Mist | `#84849c` | `--color-slate-mist` | Muted secondary text, captions, helper text, low-emphasis borders |
| Onyx | `#000000` | `--color-onyx` | Logo mark, icon strokes, high-contrast borders, nav elements |

## Tokens — Typography

### Sharp Grotesk Web — Primary typeface for all UI text, headings, body, buttons, and nav — a geometric sans that is structural, even, and modern. The 60px display weight feels confident without being heavy; 400/500 for body keeps things light and airy. Sharp Grotesk's clean geometry contrasts with the handwritten script logo, and that tension is the type personality. · `--font-sharp-grotesk-web`
- **Substitute:** Space Grotesk or DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 14, 15, 16, 18, 20, 24, 60
- **Line height:** 1.0–1.63
- **Role:** Primary typeface for all UI text, headings, body, buttons, and nav — a geometric sans that is structural, even, and modern. The 60px display weight feels confident without being heavy; 400/500 for body keeps things light and airy. Sharp Grotesk's clean geometry contrasts with the handwritten script logo, and that tension is the type personality.

### Recess Script (logo) — Wordmark only — a hand-drawn cursive script that reads 'Recess' with a casual, personal warmth. The script is intentionally casual against Sharp Grotesk's formality: the logo is a signature, the body is a label. · `--font-recess-script-logo`
- **Substitute:** Caveat or Pacifico
- **Weights:** 400
- **Sizes:** 32–40
- **Line height:** 1.0
- **Role:** Wordmark only — a hand-drawn cursive script that reads 'Recess' with a casual, personal warmth. The script is intentionally casual against Sharp Grotesk's formality: the logo is a signature, the body is a label.

### Adobe Blank — Adobe Blank — detected in extracted data but not described by AI · `--font-adobe-blank`
- **Weights:** 400
- **Sizes:** 14px, 24px
- **Line height:** 1.38, 1.63
- **Role:** Adobe Blank — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.38 | — | `--text-caption` |
| body | 16px | 1.63 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 20px | 1.33 | — | `--text-heading-sm` |
| heading | 24px | 1.25 | — | `--text-heading` |
| display | 60px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 84 | 84px | `--spacing-84` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 9999px |
| badges | 9999px |
| inputs | 4px |
| buttons | 4-8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Primary CTA Button (Outlined)
**Role:** Main action — e.g. 'SHOP NOW', 'SHOP ALL PRODUCTS'

Rectangular, 4–8px radius, padding 12px 24px. Twilight Navy (#25385b) 1–2px border, transparent or Periwinkle fill, Twilight Navy text. All-caps, 14–16px Sharp Grotesk weight 500, letter-spacing slight tracking. No shadow, no gradient — flat and confident.

### Ghost Pill Button
**Role:** Sticky/floating secondary action — e.g. bottom-right 'SHOP NOW'

Full pill radius (9999px), Cloud White (#ffffff) fill, Twilight Navy (#25385b) text, 1px Twilight Navy border. 14px Sharp Grotesk weight 500, padding 10px 20px. Designed to float unobtrusively over pastel sections.

### Top Marquee Banner
**Role:** Promotional strip — shipping, codes, announcements

Full-bleed horizontal strip, 32–40px height, Twilight Navy (#25385b) background, Cloud White text, 12–14px Sharp Grotesk. Repeating text with small dot separators. No padding, runs edge-to-edge above the nav.

### Header / Nav Bar
**Role:** Site-wide navigation

Transparent over hero, becomes solid on scroll. Script 'Recess' logo left (~32–40px), nav links right ('shop', 'subscribe & save', 'login') + cart icon. Links in Twilight Navy, 14–16px Sharp Grotesk weight 400. No background fill over the hero gradient — it floats.

### Hero Section
**Role:** First-screen brand statement

Full-bleed sky gradient background (blue to white). Headline 60px Sharp Grotesk weight 700 in Twilight Navy, left-aligned at ~10% from left. Subtext 16–18px, Slate Mist. Product visual right-aligned with organic blob/rounded-rectangle mask. No card chrome — the gradient IS the surface.

### Product Showcase Card
**Role:** Featured product row — e.g. 'calm for every occasion'

Center-aligned stack on a sunset gradient background. Products displayed in a horizontal row with no individual cards — just the product photography floating. Headline 60px above, subtext 16px, CTA button centered below. Background is a full-bleed linear gradient (cream → lavender → blush).

### Testimonial Card
**Role:** Social proof — quote cards in carousel

Cloud White (#ffffff) fill, 8px radius, 24–32px padding, 1px Slate Mist border. Large open-quote mark in Twilight Navy at top-left. Quote text 16–18px Sharp Grotesk weight 400, centered. Attribution (handle) 14px Slate Mist. Sits on Periwinkle Sky background with floating cloud shapes.

### Cloud Decoration
**Role:** Atmospheric graphic — floating cloud shapes

Soft white/cream blob shapes with irregular organic outlines, ~10% opacity shadow underneath. Scattered across Periwinkle sections at varying scales (60–160px). No border, no text — purely atmospheric depth.

### Footer
**Role:** Site footer

Dusk Indigo (#0a0a3a) full-bleed background, Cloud White text. Multi-column link grid, newsletter signup, social icons. 16px Sharp Grotesk weight 400, 64–80px section padding.

### Promo Card Border Style
**Role:** Outlined card with chromatic border

1–2px Periwinkle Sky border on transparent or white fill, 8px radius. Used for highlighted sections or product groupings. No shadow, no fill — the border alone defines the container.

## Do's and Don'ts

### Do
- Use Sharp Grotesk for all UI text; pair with the script logo only as a wordmark — never as body type.
- Set display headlines at 60px weight 700 with line-height 1.0 for the tight, confident voice.
- Build sections on Periwinkle Sky (#a2b0ff) or sunset gradients as full-bleed atmospheric layers, not contained boxes.
- Use Twilight Navy (#25385b) for all text and borders — it is the only structural color.
- Keep buttons flat: outlined rectangles with 1–2px Twilight Navy border, no gradients, no shadows.
- Add organic cloud shapes at 10–20% opacity as floating atmospheric decoration on lavender sections.
- Maintain 80–100px vertical breathing room between major sections to preserve the spacious, magazine-like rhythm.

### Don't
- Don't use the script logo for headings or body text — it's a signature mark, not a typeface.
- Don't apply heavy shadows or elevation to cards — Recess uses borders and gradients, not depth.
- Don't introduce additional accent colors beyond Cobalt Pop (#3252f4) and Coral Blush (#ff5a5a) — the palette is deliberately restrained.
- Don't use pure black backgrounds for anything other than small icon strokes — Dusk Indigo (#0a0a3a) is the dark surface.
- Don't crowd products into grids with visible card chrome — let product photography float freely over gradient surfaces.
- Don't use letter-spacing or all-caps for body text — only display headings and buttons get tracked caps.
- Don't break the sky-to-sunset gradient language with hard solid-color section dividers.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cloud White | `#ffffff` | Base page canvas |
| 1 | Periwinkle Sky | `#a2b0ff` | Dominant atmospheric section background |
| 2 | Cream Linen | `#fffcef` | Warm-tinted alt surface for contrast sections |
| 3 | Dusk Indigo | `#0a0a3a` | Footer and dark contrast surfaces |

## Elevation

Recess deliberately avoids drop shadows. All visual depth comes from layered gradient backgrounds, soft cloud shapes at reduced opacity, and 1–2px chromatic borders. The flat, shadow-free treatment keeps the aesthetic feeling like a printed poster or magazine spread rather than a web app.

## Imagery

Product photography is hero — the cans and jars are the visual content, shot on pure backgrounds or in lifestyle scenes (floating in a pool floatie, surrounded by fruit). Treatment: bright, high-key, saturated product colors against soft atmospheric backgrounds. The photography style is commercial-clean with playful lifestyle context. No illustrations, no abstract graphics beyond the organic cloud shapes. Cloud/blob SVG decorations are soft white with subtle opacity, serving as atmospheric depth rather than content.

## Layout

Full-bleed page model — every section extends edge-to-edge with its own gradient or color. Hero is a split composition: left-aligned headline block (~40% width) + right-aligned product visual with organic blob mask. Following sections are centered stacks: headline → subtext → product row → CTA. Testimonials are a 3-column card grid with carousel dots, centered on the page. Navigation is a simple transparent bar that floats over the hero. The marquee banner is a thin full-bleed strip above the nav. Vertical rhythm is spacious (80–100px section gaps) with content always centered within a ~1200px max-width. The overall flow feels like scrolling through a dreamy magazine — each section is a new mood color.

## Agent Prompt Guide

**Quick Color Reference**
- text: #25385b
- background: #a2b0ff (dominant atmospheric), #ffffff (canvas), #fffcef (warm alt)
- border: #25385b (structural), #a2b0ff (atmospheric)
- accent: #3252f4 (emphasis only), #ff5a5a (decorative warmth)
- primary action: no distinct CTA color

**3–5 Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Build a testimonial card: 8px radius, #ffffff fill, 1px #84849c border, 24px padding. Open-quote glyph 32px #25385b top-left. Quote text 16px Sharp Grotesk weight 400, #25385b, centered. Attribution 14px #84849c.

3. Build the top marquee: full-bleed, 36px height, #25385b background, #ffffff text, 12px Sharp Grotesk. Repeating text segments separated by dot characters, no padding.

4. Build a ghost pill button: 9999px radius, #ffffff fill, 1px #25385b border, #25385b text, 10px 20px padding, 14px Sharp Grotesk weight 500.

5. Build a footer: full-bleed #0a0a3a background, #ffffff text, 4-column link grid, 16px Sharp Grotesk weight 400, 80px vertical padding.

## Similar Brands

- **Omsom** — Same pastel-saturated gradient backgrounds and centered product showcase layouts with generous breathing room
- **Recess competitors like Kin Euphorics** — Same dreamy atmospheric aesthetic with sky/cloud imagery and pastel periwinkle palettes
- **Magic Spoon** — Same playful brand personality using soft pastel sections, geometric sans-serif type, and floating product photography
- **Olipop** — Same full-bleed gradient sections with centered display headlines and flat outlined CTA buttons
- **Imperfect Foods** — Same approach of atmospheric color washes as section backgrounds rather than white cards on gray

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-twilight-navy: #25385b;
  --color-periwinkle-sky: #a2b0ff;
  --color-dusk-indigo: #0a0a3a;
  --color-cobalt-pop: #3252f4;
  --color-coral-blush: #ff5a5a;
  --color-cloud-white: #ffffff;
  --color-cream-linen: #fffcef;
  --color-slate-mist: #84849c;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-sharp-grotesk-web: 'Sharp Grotesk Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recess-script-logo: 'Recess Script (logo)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-adobe-blank: 'Adobe Blank', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --text-display: 60px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-84: 84px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-badges: 9999px;
  --radius-inputs: 4px;
  --radius-buttons: 4-8px;

  /* Surfaces */
  --surface-cloud-white: #ffffff;
  --surface-periwinkle-sky: #a2b0ff;
  --surface-cream-linen: #fffcef;
  --surface-dusk-indigo: #0a0a3a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-twilight-navy: #25385b;
  --color-periwinkle-sky: #a2b0ff;
  --color-dusk-indigo: #0a0a3a;
  --color-cobalt-pop: #3252f4;
  --color-coral-blush: #ff5a5a;
  --color-cloud-white: #ffffff;
  --color-cream-linen: #fffcef;
  --color-slate-mist: #84849c;
  --color-onyx: #000000;

  /* Typography */
  --font-sharp-grotesk-web: 'Sharp Grotesk Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recess-script-logo: 'Recess Script (logo)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-adobe-blank: 'Adobe Blank', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --text-display: 60px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-84: 84px;
  --spacing-144: 144px;
}
```
