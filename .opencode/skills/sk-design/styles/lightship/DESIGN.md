# Lightship — Style Reference
> Cinematic open-road diorama. Warm cream gallery walls with oversized landscape photographs pinned at gentle radii, thin black type whispering across the frames, one ember-orange accent breaking the monochrome like a campfire in a meadow.

**Theme:** light

Lightship is a photography-first editorial system built on a warm cream canvas (#faf6ef) with full-bleed cinematic imagery doing all the storytelling. The UI is deliberately invisible: a single custom geometric sans (F37Bolton) with tight negative tracking, hairline borders, 20px rounded photo cards, and pill-shaped navigation chips. The entire palette is near-monochrome with one warm orange (#fa5c40) reserved as a rare surface accent. Density is generous — large breathing room around elements, 100px section gaps — letting landscape photography and short editorial headlines command attention. No shadows, no gradients, no decorative chrome: the product and the places it goes are the interface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Cream | `#faf6ef` | `--color-warm-cream` | Primary page canvas, card surfaces — warm off-white replaces stark white to soften the photography-first layout and avoid the cold SaaS feel |
| Pure White | `#ffffff` | `--color-pure-white` | Image borders, elevated card surfaces, contrast panel behind embedded media |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, hairline borders, icon strokes, navigation typography — the structural anchor of the entire system |
| Pebble | `#999999` | `--color-pebble` | Muted body text, secondary borders, disabled states — the one step above placeholder gray |
| Driftwood | `#a1a1a1` | `--color-driftwood` | Helper text, low-emphasis captions, subtle dividers |
| Mist | `#d9d9d9` | `--color-mist` | Light hairline dividers, nav separators, input borders in resting state |
| Ember Orange | `#fa5c40` | `--color-ember-orange` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### F37Bolton — Sole typeface across the entire system. Custom geometric sans with tight aperture and industrial DNA. Weight 400 for body, 700 only for display headlines and the wordmark. Tracking runs -0.05em at display sizes down to -0.03em at body, giving headlines a compressed editorial feel and body text a quiet, compact rhythm · `--font-f37bolton`
- **Substitute:** Söhne, Inter, or DM Sans — pick the variant with the most geometric (non-humanist) character to preserve the industrial tone
- **Weights:** 400, 700
- **Sizes:** 12, 14, 16, 20, 22, 24, 34, 48, 64, 72, 75px
- **Line height:** 1.00, 1.20, 1.25
- **Letter spacing:** -0.05em at 48px and above, -0.03em at 34px and below
- **Role:** Sole typeface across the entire system. Custom geometric sans with tight aperture and industrial DNA. Weight 400 for body, 700 only for display headlines and the wordmark. Tracking runs -0.05em at display sizes down to -0.03em at body, giving headlines a compressed editorial feel and body text a quiet, compact rhythm

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.36px | `--text-caption` |
| body-sm | 14px | 1.2 | -0.42px | `--text-body-sm` |
| body | 16px | 1.25 | -0.48px | `--text-body` |
| body-lg | 20px | 1.25 | -0.6px | `--text-body-lg` |
| subheading | 22px | 1.2 | -0.66px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.72px | `--text-heading-sm` |
| heading | 34px | 1.2 | -1.02px | `--text-heading` |
| heading-lg | 48px | 1 | -2.4px | `--text-heading-lg` |
| display | 72px | 1 | -3.6px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| images | 20px |
| inputs | 100px |
| buttons | 100px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 100px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Full-Bleed Hero Frame
**Role:** Cinematic opening image spanning the entire viewport

100vw × 100vh image, no border-radius, no overlay tint. Text sits directly on the photograph in white (#ffffff) at 72px / 75px display weight 400, letter-spacing -3.6px, line-height 1.0. Headline and supporting phrase anchor to opposite edges of the viewport (left + right split) to create compositional tension against the centered image.

### Navigation Bar
**Role:** Minimal top bar over hero and subsequent sections

Three-zone layout: left cluster (hamburger icon + nav links: AE1, Technology, Specs), centered wordmark (LIGHTSHIP at 16px weight 400, letter-spacing 0.4em for the brand mark treatment), right cluster (Experience, Buy it now as text links). All type at 14px, weight 400, #ffffff over hero / #000000 over cream sections. No background fill — sits transparently over content.

### Pill Navigation Link
**Role:** Text link styled as a rounded chip

14px F37Bolton weight 400, no background fill, no border. Sits inline within the nav bar. The 100px radius token governs interactive elements (links, buttons) when a pill shape is needed.

### Photo Mosaic Card
**Role:** Asymmetrically arranged editorial photo block

Photograph framed with 20px border-radius, no border, no shadow. Cards are placed in an off-grid collage layout (not equal columns) at varying sizes and vertical offsets. The 20px radius is the signature — it softens editorial photography without looking app-like or corporate.

### Editorial Headline Pair
**Role:** Two-line complementary headline layout

Left-aligned statement (

### Hamburger Menu Trigger
**Role:** Mobile/utility menu opener

Two thin horizontal lines, #ffffff over hero / #000000 over cream, 2px stroke weight, 24px wide. Sits in a pill-shaped touch target (100px radius) with 12px padding all sides.

### Scroll Indicator
**Role:** Fixed-bottom-right prompt to continue reading

Small downward arrow icon (1.5px stroke, #ffffff) above 12px caption text (

### Ghost Text Button
**Role:** Secondary action link (Buy it now, Experience)

Text-only, no fill, no border. 14px F37Bolton weight 400, #000000 or #ffffff depending on surface. Underline appears on hover. This is the system's only interactive pattern — there are no filled buttons anywhere on the site.

### Hairline Divider
**Role:** Section separator

1px solid #d9d9d9 or #000000 horizontal rule. Used sparingly — the system prefers whitespace and full-bleed image transitions over visible dividers.

### Pill Input Field
**Role:** Form input (newsletter, configuration)

100px border-radius, 1px border in #d9d9d9 resting state, focus shifts border to #000000. Cream or white fill, 16px F37Bolton weight 400, generous 20px horizontal padding.

## Do's and Don'ts

### Do
- Let photography fill the viewport — use full-bleed images (100vw) with no border-radius for hero and section breaks
- Use 20px border-radius on all framed photographs and content cards — this is the system's signature softness
- Use 100px border-radius for all interactive elements (nav links, buttons, inputs) to create the pill geometry
- Set type at -0.05em letter-spacing on anything 48px and above, -0.03em on 34px and below — tight tracking is non-negotiable for the editorial feel
- Keep the entire UI monochromatic — black text, white/cream surfaces, hairline borders. The only chromatic color in the system is #fa5c40, used as a surface accent strip, not as a button fill
- Separate hero text to opposite viewport edges (left + right split) at 72–75px display weight to create compositional tension across the photograph
- Use whitespace as the primary separator between sections — 100px vertical gaps, no visible dividers needed

### Don't
- Do not use filled buttons or saturated CTA backgrounds — the system has no primary action color; interactions are ghost text links and pill nav items
- Do not introduce shadows or elevation effects — the design is intentionally flat, relying on border-radius and whitespace for depth
- Do not use gradients anywhere — surfaces are solid (cream, white, black, or ember orange)
- Do not use rounded type, decorative serifs, or display scripts — F37Bolton's geometric sans is the only voice
- Do not place content in equal-width grid columns — photo layouts use asymmetric, offset collage positioning
- Do not use #ffffff as the page background — the warm cream #faf6ef is the canvas; pure white is reserved for card elevation
- Do not use the ember orange #fa5c40 at large surface areas — it should appear only as small accent strips or focused-state washes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#faf6ef` | Full-page warm cream background |
| 2 | Card | `#ffffff` | Elevated white surface for content cards, image frames, embedded panels |
| 3 | Accent Wash | `#fa5c40` | Rare ember-orange highlight strip or focused-state surface |

## Imagery

Photography is the dominant visual element — full-bleed cinematic landscape shots (mountains, meadows, open roads) serve as hero backdrops, while asymmetric collages of lifestyle and product photography populate content sections. All photographs share a warm, slightly desaturated treatment that complements the cream canvas. Product shots show the trailer in use: towed on mountain roads, parked at campsites, integrated into family life. No illustrations, no 3D renders, no abstract graphics. Images are framed with 20px border-radius, never sharp-cornered, and are placed in off-grid compositions with varying vertical offsets. Icons are minimal thin-line (1.5–2px stroke) monochrome.

## Layout

Hero is full-viewport (100vw × 100vh) with a single cinematic photograph and a two-column headline split (left statement + right statement at opposite viewport edges). The navigation bar sits transparently over the hero with three zones (left nav / centered wordmark / right utility links). Below the hero, the layout shifts to an asymmetric photo mosaic on the warm cream canvas — images of varying sizes offset vertically rather than aligned to a strict grid, with generous 100px vertical breathing room between major sections. Content blocks alternate between editorial two-column (text + image) and pure photography passages. The layout is max-width contained at 1440px for content areas but allows sections to break to full-bleed when the visual demands it. There is no sidebar, no sticky header that persists aggressively, and no footer chrome visible in the initial scroll.

## Agent Prompt Guide

## Quick Color Reference\n- Canvas: #faf6ef (warm cream)\n- Card surface: #ffffff (pure white)\n- Primary text: #000000\n- Hairline border: #d9d9d9\n- Muted text: #999999\n- Accent: #fa5c40 (ember orange — surface washes only)\n- primary action: no distinct CTA color

## Similar Brands

- **Patagonia** — Same full-bleed landscape photography as the primary visual, warm/natural color palette, minimal text overlay, editorial headline weight on product pages
- **Airstream** — Same product-lifestyle photography approach with cinematic outdoor settings, generous whitespace, and near-monochrome UI that lets the product imagery lead
- **Rivian** — Same premium adventure-brand visual language: large display type with tight tracking, photography-first layout, minimal UI chrome, warm accent restraint
- **Fellow (fellowproducts.com)** — Same warm cream canvas, custom geometric sans with tight tracking, rounded product photography, and near-invisible UI chrome that lets product imagery dominate

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-cream: #faf6ef;
  --color-pure-white: #ffffff;
  --color-obsidian: #000000;
  --color-pebble: #999999;
  --color-driftwood: #a1a1a1;
  --color-mist: #d9d9d9;
  --color-ember-orange: #fa5c40;

  /* Typography — Font Families */
  --font-f37bolton: 'F37Bolton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.42px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: -0.48px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.25;
  --tracking-body-lg: -0.6px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.66px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 34px;
  --leading-heading: 1.2;
  --tracking-heading: -1.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 100px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-inputs: 100px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-canvas: #faf6ef;
  --surface-card: #ffffff;
  --surface-accent-wash: #fa5c40;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-cream: #faf6ef;
  --color-pure-white: #ffffff;
  --color-obsidian: #000000;
  --color-pebble: #999999;
  --color-driftwood: #a1a1a1;
  --color-mist: #d9d9d9;
  --color-ember-orange: #fa5c40;

  /* Typography */
  --font-f37bolton: 'F37Bolton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.42px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: -0.48px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.25;
  --tracking-body-lg: -0.6px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.66px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 34px;
  --leading-heading: 1.2;
  --tracking-heading: -1.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 100px;
}
```
