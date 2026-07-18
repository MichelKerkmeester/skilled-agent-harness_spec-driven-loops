# AI Product Generation — Style Reference
> editorial photography studio on white paper — headline display type as cover, orange as the editor's highlight pen

**Theme:** light

Fourmula is an editorial product-photography studio rendered in code: vast white pages, near-black display type at extreme sizes, and a single disciplined orange accent that reads like editorial highlight pen rather than brand chrome. The system is almost monochromatic — three near-grays carry the entire interface, and color appears only as semantic punctuation inside headlines and gradients. Surfaces are flat and borderless, relying on hairline gray dividers and generous whitespace to separate regions instead of shadow or elevation. Typography is the dominant design move: SF Pro Display at weights 400–500, tracked tight at large sizes, producing headlines that feel like magazine cover titles rather than SaaS hero copy. Components are quiet and minimal — a thin outlined button, a small tag badge, flat cards with generous padding, and a single rounded image corner. The result is a site that treats its product imagery as the spectacle while the chrome recedes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#020108` | `--color-ink-black` | Primary text, borders, icon strokes — near-black carries all body and heading copy |
| Charcoal | `#333333` | `--color-charcoal` | Dominant border color across the entire interface, card outlines, dividers |
| Steel | `#5d5c61` | `--color-steel` | Secondary borders, muted icon fills, tertiary structural lines |
| Pewter | `#818084` | `--color-pewter` | Muted helper text, secondary link text, subdued metadata |
| Ash | `#d7d7d6` | `--color-ash` | Subtle background washes, low-contrast surface differentiation |
| Canvas White | `#ffffff` | `--color-canvas-white` | Card surfaces, image backgrounds, inverted text on dark regions |
| Paper | `#f7f7f7` | `--color-paper` | Page background — the dominant canvas tone behind all content |
| Ember Orange | `linear-gradient(rgb(249, 74, 0), rgb(253, 123, 3))` | `--color-ember-orange` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Cobalt Drift | `linear-gradient(rgb(58, 84, 255), rgb(122, 103, 197) 23%, rgb(253, 123, 3))` | `--color-cobalt-drift` | Gradient stop — blue-violet entry point in the tri-color brand gradient (blue → violet → orange) used for special accent surfaces |
| Crimson Edge | `linear-gradient(rgb(154, 1, 1), rgb(253, 123, 3))` | `--color-crimson-edge` | Gradient stop — deep red entry in the four-color brand gradient variant |
| Teal Bridge | `linear-gradient(rgb(72, 163, 209), rgb(253, 123, 3))` | `--color-teal-bridge` | Gradient stop — cool blue bridge into orange in the dual-tone gradient |

## Tokens — Typography

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.39
- **Role:** Arial — detected in extracted data but not described by AI

### SF Pro Display — Sole typeface across the system — display headlines reach 100px at weight 400 with -3.1% tracking, subheadings at 53px weight 500 with -2% tracking, body at 15–17px weight 400. The choice to use weight 400–500 even at display sizes (rather than going bold) is signature: the type commands attention through scale and tightness, not weight. Substitute: Inter, or any geometric grotesque with strong x-height and tight default tracking. · `--font-sf-pro-display`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 8, 10, 11, 12, 13, 14, 15, 17, 20, 27, 43, 53, 73, 100
- **Line height:** 0.94, 1.00, 1.05, 1.15, 1.20, 1.25, 1.50
- **Letter spacing:** -0.0310em at 100px, -0.0300em at 73px, -0.0200em at 53px, -0.0150em at 43px, -0.0130em at 27px, -0.0100em at 20px, -0.0090em at 17px, normal at ≤15px
- **OpenType features:** `"ss01" on`
- **Role:** Sole typeface across the system — display headlines reach 100px at weight 400 with -3.1% tracking, subheadings at 53px weight 500 with -2% tracking, body at 15–17px weight 400. The choice to use weight 400–500 even at display sizes (rather than going bold) is signature: the type commands attention through scale and tightness, not weight. Substitute: Inter, or any geometric grotesque with strong x-height and tight default tracking.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.25 | — | `--text-caption` |
| body | 15px | 1.5 | -0.135px | `--text-body` |
| body-lg | 17px | 1.5 | -0.153px | `--text-body-lg` |
| subheading | 20px | 1.2 | -0.2px | `--text-subheading` |
| heading-sm | 27px | 1.15 | -0.351px | `--text-heading-sm` |
| heading | 43px | 1.05 | -0.645px | `--text-heading` |
| heading-lg | 53px | 1 | -1.06px | `--text-heading-lg` |
| display | 100px | 0.94 | -3.1px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 100 | 100px | `--spacing-100` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 7px |
| badges | 1.3px |
| images | 27px |
| buttons | 9999px |
| featureCards | 40px |
| imageContainers | 20px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 27px
- **Element gap:** 20px

## Components

### Display Headline
**Role:** Hero and section titles at editorial scale

Renders at 73–100px, weight 400, line-height 0.94, tracking -3.1%. Color #020108. Two-tone treatment: one noun or phrase is swapped to Ember Orange (#fd7b03) as inline emphasis while the rest stays Ink Black. The orange word is a continuation of the sentence, not a separate label — the sentence reads as a single typographic unit with a colored pivot.

### Section Heading
**Role:** Mid-page section introductions

43–53px, weight 500, tracking -0.645 to -1.06px. #020108. Same orange inline highlight pattern as display headlines. Often paired with a 15–17px body paragraph in Pewter (#818084).

### Pill Button (Primary Ghost)
**Role:** Call-to-action and navigation links

Border-radius 9999px. Thin border in #333333 or #020108 (1px). Padding 12px 20px. Text 14–15px weight 500, #020108. No background fill — ghost/outlined style. Inherits the system's flat, borderless-to-border contrast.

### Feature Card
**Role:** Container for product shots and video previews

Background #f7f7f7, padding 27px, border-radius 7px (tight radius keeps it utilitarian). No border, no shadow. Contains an inner image area with its own 20–27px radius. The card itself is a subtle tonal step from the page canvas.

### Image Tile
**Role:** Product photography thumbnail in grid

Border-radius 20–27px. Fills its grid cell edge-to-edge. Often presented as part of a 5-column grid. No border, no shadow. The image does the work; the chrome is invisible.

### Section Tag Badge
**Role:** Small contextual label above sections

Text 11–12px, weight 500, #020108. Prefixed with a small upward triangle or arrow glyph (↑). No background, no border — purely typographic. Examples: '↑ AI Fashion Photoshoot', '↑ AI Product Shots'.

### Product Card Header
**Role:** Label strip on AI-generated output tiles

Pill shape with border-radius 1.3px (nearly square). 7px vertical padding, ~12px horizontal. White background (#ffffff) with a thin #333333 border. Contains small orange dot indicator + product code text in #020108 at 10–11px.

### Sidebar Nav Item
**Role:** Left-edge 'What you can do' navigation

Plain text 13–14px, weight 400, #020108. No background, no active state chrome. Vertically stacked with ~20px gaps. A thin vertical rule separates it from the main content.

### Media Player Strip
**Role:** Top bar of the app preview window

Dark background (#020108) bar with traffic-light dots (red/orange/green) and a centered product breadcrumb in #ffffff. Border-radius matches the container (7px) at the top corners only. Serves as a meta-frame around the app preview content.

### Expand/Action Floating Button
**Role:** Bottom-right interactive control on sections

Perfectly circular, white (#ffffff) background, thin #333333 border. Contains four outward-pointing arrows (expand glyph) in #020108. Diameter ~48px. Floats with 20px offset from the section edge.

### Highlighted Inline Word
**Role:** Editorial emphasis within running text

A single word or short phrase within a headline or body sentence rendered in Ember Orange (#fd7b03) instead of #020108. No underline, no bold, no background — purely a color swap. Used sparingly: one or two per section maximum.

### Split Section (Text + Visual)
**Role:** Primary content section layout

Two-column grid at desktop: text block (40% width) on the left, visual block (60% width) on the right. 40–80px gap between columns. Text block contains tag → heading → body. Visual block is a bordered app-preview window containing a media strip and image grid.

### Image Gallery Grid
**Role:** Product photography collection

5-column grid of image tiles. All tiles same height, slight horizontal scroll overflow possible. Each tile has 20–27px radius. No gap between tiles in some variants, 7px gap in others.

## Do's and Don'ts

### Do
- Use #020108 for all primary text and heading copy — never substitute a softer gray for headlines
- Apply the orange inline highlight pattern (one word in #fd7b03 within an otherwise #020108 sentence) for editorial emphasis in headlines and subheadings
- Reach for display sizes of 73–100px at weight 400 — let scale carry authority, not weight
- Use -0.02em to -0.031em letter-spacing on all text 27px and above; keep tracking normal at 15px and below
- Set border-radius to 9999px for all buttons, links, and pill elements — 7px for cards, 20–27px for images
- Keep the page background #f7f7f7 and card surfaces #ffffff or #f7f7f7 — rely on the two-tone surface step, never on shadow
- Use 27px padding inside cards and 20px gaps between elements; 80px between major sections

### Don't
- Do not introduce a second chromatic accent — the system is monochrome with a single orange highlight, and adding color dilutes the editorial discipline
- Do not use bold or weight 600+ for headlines — weight 400–500 at large sizes is the signature; going heavy breaks the cover-type feel
- Do not apply box-shadows to cards, buttons, or images — the system is entirely flat; elevation must be communicated through tonal surface steps
- Do not use background colors on text spans, underlines, or pills for emphasis — color swap on a word within running text is the only emphasis pattern
- Do not use the gradient system for large hero backgrounds or section fills — gradients are for accent strokes and small decorative elements only
- Do not introduce more than two border-radius values per component type — 9999px is exclusively for buttons, 7px exclusively for cards, 20–27px exclusively for images
- Do not use fully saturated primaries (pure red, pure green, pure blue) anywhere — the palette's chromatic notes all carry warmth or desaturation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#f7f7f7` | Page background — the dominant canvas behind all content |
| 1 | Canvas White | `#ffffff` | Card surfaces, image backgrounds, inverted text on dark regions |
| 2 | Ash | `#d7d7d6` | Subtle background washes, low-contrast surface differentiation within cards |
| 3 | Ink Black | `#020108` | Inverse surface for media player strips, dark app preview frames, terminal-like zones |

## Elevation

The system deliberately avoids shadows entirely. Elevation is communicated exclusively through a two-step surface tonal ladder (Paper → Canvas White) and through the appearance of bordered containers. This is an editorial-print convention translated to screen: pages are flat, cards are defined by a one-step tonal shift, and depth is implied by content hierarchy, not visual lift.

## Imagery

Product photography is the primary visual content: tightly cropped fashion apparel (olive jackets with '4M' graphics, leather goods, perfume bottles) on neutral or environmental backgrounds. Images are presented as raw tiles in grids, not as lifestyle or contextualized scenes. The first-image-of-product is typically a flat white-background studio shot, followed by environment shots (wooden walls, city streets, studio backdrops). Imagery fills roughly 60% of the visual real estate on the page, with the remainder given to large-scale typography. No illustrations, no icons-within-imagery, no abstract graphics — only photography. Image containers use 20–27px border-radius, giving a subtle softness without becoming bubble-like.

## Layout

Max-width 1280px centered content with a left-edge sidebar ('What you can do') occupying roughly 20% of the viewport width. The main content area is 80% and uses a split pattern: text block (40%) + visual block (60%) for every major section. Section gap is 80px, establishing an airy, editorial magazine rhythm. The hero is a two-line display headline (100px) sitting flush-left, with the app preview visual positioned below at full content width. Navigation is minimal — a sidebar list rather than a top nav bar. The page flows in single-column at mobile, with the sidebar collapsing or moving above the main content. No alternating dark/light section bands — the entire page stays on the Paper surface with tonal cards as the only structural variation.

## Agent Prompt Guide

**Quick Color Reference**
- text: #020108
- background: #f7f7f7
- surface (card): #ffffff
- border: #333333
- accent (inline highlight): #fd7b03
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Display headline with inline highlight*: Render at 100px, SF Pro Display weight 400, line-height 0.94, letter-spacing -3.1px, color #020108. One word within the sentence swaps to Ember Orange (#fd7b03). No background, no border, flush-left.

2. *Split section (text left, visual right)*: Two-column grid, 40%/60% split, 40px column gap. Left column: section tag (12px weight 500, #020108, prefixed with ↑ glyph), heading (43px weight 500, tracking -0.645px, #020108 with one orange word), body (15px weight 400, #818084). Right column: bordered app-preview window at 7px radius, #020108 media strip on top (with traffic-light dots), image grid below.

3. *Ghost pill button*: 1px border in #333333, border-radius 9999px, padding 12px 20px, background transparent. Text 14px weight 500, #020108. No shadow, no fill on hover.

4. *Product image tile*: Fills its grid cell, border-radius 20px, no border, no shadow. Image extends to edges. No caption or label inside the tile itself.

5. *Section tag badge*: Pure text at 12px weight 500, #020108, prefixed with a small upward-pointing arrow glyph (↑). Zero background, zero border, sits above the section heading with 10px gap.

## Gradient System

Gradients are reserved for accent strokes and small decorative elements, never for large fills or hero backgrounds. The signature gradient is orange-to-orange-warm: linear-gradient(rgb(249, 74, 0), rgb(253, 123, 3)). A three-stop variant extends into cool territory: linear-gradient(rgb(58, 84, 255), rgb(122, 103, 197) 23%, rgb(253, 123, 3)) — blue → violet → orange, used for special accent surfaces. A teal bridge variant (linear-gradient(rgb(72, 163, 209), rgb(253, 123, 3))) and a crimson edge variant (linear-gradient(rgb(154, 1, 1), rgb(253, 123, 3))) exist as additional color-pivot options. All gradients resolve to Ember Orange at one terminus — the orange is the gravitational center of the gradient system.

## Similar Brands

- **Looka** — Same display-headline-as-cover-type approach with 100px+ weight 400 titles and tight negative tracking on a near-white canvas
- **Runway** — Same editorial product-tool language: vast whitespace, single chromatic accent used as inline text highlight, product imagery carrying the visual weight
- **Spline** — Same monochrome-with-one-orange-accent palette and ghost outlined pill buttons with 9999px radius
- **Framer** — Same flat-surface two-step tonal ladder (Paper → White) with zero shadows and large-scale display type as the primary design move
- **Linear** — Same restrained color discipline with near-black text on light canvas and single warm accent for emphasis

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #020108;
  --color-charcoal: #333333;
  --color-steel: #5d5c61;
  --color-pewter: #818084;
  --color-ash: #d7d7d6;
  --color-canvas-white: #ffffff;
  --color-paper: #f7f7f7;
  --color-ember-orange: #fd7b03;
  --gradient-ember-orange: linear-gradient(rgb(249, 74, 0), rgb(253, 123, 3));
  --color-cobalt-drift: #3a54ff;
  --gradient-cobalt-drift: linear-gradient(rgb(58, 84, 255), rgb(122, 103, 197) 23%, rgb(253, 123, 3));
  --color-crimson-edge: #9a0101;
  --gradient-crimson-edge: linear-gradient(rgb(154, 1, 1), rgb(253, 123, 3));
  --color-teal-bridge: #48a3d1;
  --gradient-teal-bridge: linear-gradient(rgb(72, 163, 209), rgb(253, 123, 3));

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.135px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.153px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.351px;
  --text-heading: 43px;
  --leading-heading: 1.05;
  --tracking-heading: -0.645px;
  --text-heading-lg: 53px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.06px;
  --text-display: 100px;
  --leading-display: 0.94;
  --tracking-display: -3.1px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-100: 100px;
  --spacing-172: 172px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 27px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 1.33084px;
  --radius-md: 6.65421px;
  --radius-2xl: 19.9626px;
  --radius-3xl: 26.6168px;
  --radius-3xl-2: 39.9252px;
  --radius-full: 119.776px;
  --radius-full-2: 1317.53px;

  /* Named Radii */
  --radius-cards: 7px;
  --radius-badges: 1.3px;
  --radius-images: 27px;
  --radius-buttons: 9999px;
  --radius-featurecards: 40px;
  --radius-imagecontainers: 20px;

  /* Surfaces */
  --surface-paper: #f7f7f7;
  --surface-canvas-white: #ffffff;
  --surface-ash: #d7d7d6;
  --surface-ink-black: #020108;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #020108;
  --color-charcoal: #333333;
  --color-steel: #5d5c61;
  --color-pewter: #818084;
  --color-ash: #d7d7d6;
  --color-canvas-white: #ffffff;
  --color-paper: #f7f7f7;
  --color-ember-orange: #fd7b03;
  --color-cobalt-drift: #3a54ff;
  --color-crimson-edge: #9a0101;
  --color-teal-bridge: #48a3d1;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.135px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.153px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.351px;
  --text-heading: 43px;
  --leading-heading: 1.05;
  --tracking-heading: -0.645px;
  --text-heading-lg: 53px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.06px;
  --text-display: 100px;
  --leading-display: 0.94;
  --tracking-display: -3.1px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-100: 100px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-sm: 1.33084px;
  --radius-md: 6.65421px;
  --radius-2xl: 19.9626px;
  --radius-3xl: 26.6168px;
  --radius-3xl-2: 39.9252px;
  --radius-full: 119.776px;
  --radius-full-2: 1317.53px;
}
```
