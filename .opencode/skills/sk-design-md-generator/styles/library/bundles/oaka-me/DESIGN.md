# Oakâme — Style Reference
> Sunlit Provençal atelier carved in warm stone

**Theme:** light

Oakâme operates as a sun-soaked Provençal atelier: a near-monochromatic warm-stone canvas (#f6f1eb) carrying deep walnut-brown ink (#403a34) and anchored by monumental display typography from the custom BwGradual face. The interface is deliberately quiet — no shadows, no gradients, no decorative color — letting reclaimed-oak furniture photography carry the entire visual weight. The signature rhythm comes from extreme type scale jumps: tiny tracked-out uppercase labels (10–12px) and ear-shattering display words (120–250px) share a page with almost no intermediate steps, producing a gallery-catalog tension between whisper and shout. Components stay architectural: hairline borders, pill-shaped controls, 8–20px padding, and a single 20px grid gutter. The system reads as a luxury furniture editorial — every screen is a spread.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Walnut Ink | `#403a34` | `--color-walnut-ink` | Neutral button treatment for secondary actions and selected controls. |
| Linen Canvas | `#f6f1eb` | `--color-linen-canvas` | Page background, card surface, button fill on light controls, image overlays. Warm cream tone — not pure white — that gives the whole interface its Mediterranean-stone atmosphere |
| Charcoal Note | `#333333` | `--color-charcoal-note` | Secondary body text and subdued copy where Walnut Ink is reserved for headings and UI. Pairs at 11.3:1 against the canvas for AAA-level reading |
| Slate Whisper | `#555555` | `--color-slate-whisper` | Tertiary helper text, metadata, and desaturated captions. The lightest readable neutral, sitting at 6.6:1 on the canvas |

## Tokens — Typography

### BwGradual — Sole typeface across the entire system — no secondary face. BwGradual is a contemporary geometric sans with wide proportions and a slightly humanist warmth that prevents the minimalist layout from feeling cold. Weight 400 handles body and most headings; weight 500 carries emphasized inline text; weight 700 anchors the largest display sizes. The most distinctive choice is the scale: 10px tracked-out labels and 120–250px display words coexist on the same page, bypassing 24–32px entirely. · `--font-bwgradual`
- **Substitute:** Neue Haas Grotesk Display, Inter (with `cv11`, `ss01` features), or Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 10, 12, 18, 20, 40, 50, 60, 120, 180, 250
- **Line height:** 1.10–1.50
- **Letter spacing:** Tight tracking on display: -0.056em at 120px+. Near-zero on body: -0.004em at 18–20px. Wide tracking on small uppercase labels: +0.083em to +0.100em at 10–12px.
- **OpenType features:** `"ss01" on, "cv11" on, "tnum" on`
- **Role:** Sole typeface across the entire system — no secondary face. BwGradual is a contemporary geometric sans with wide proportions and a slightly humanist warmth that prevents the minimalist layout from feeling cold. Weight 400 handles body and most headings; weight 500 carries emphasized inline text; weight 700 anchors the largest display sizes. The most distinctive choice is the scale: 10px tracked-out labels and 120–250px display words coexist on the same page, bypassing 24–32px entirely.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label | 10px | 1.3 | 1px | `--text-label` |
| caption | 12px | 1.3 | 0.83px | `--text-caption` |
| body-sm | 18px | 1.5 | -0.07px | `--text-body-sm` |
| body | 20px | 1.4 | -0.08px | `--text-body` |
| heading-sm | 40px | 1.25 | -2.24px | `--text-heading-sm` |
| heading | 50px | 1.24 | -2.8px | `--text-heading` |
| heading-lg | 60px | 1.2 | -3.36px | `--text-heading-lg` |
| display | 120px | 1.1 | -6.72px | `--text-display` |
| display-xl | 180px | 1.1 | -10.08px | `--text-display-xl` |
| display-hero | 250px | 1.1 | -14px | `--text-display-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 68 | 68px | `--spacing-68` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| images | 0px |
| buttons | 0px |
| pillButtons | 9999px |

### Layout

- **Section gap:** 120px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-bleed horizontal bar at 60–80px height, sitting on the Linen Canvas. Left side: wordmark 'oakâme' at 18px BwGradual 500 in Walnut Ink, underlined by a single hairline. Center: 'PRODUCTS' label with a small dropdown caret. Right: cluster of text-link nav items (EN STOCK, NOTRE CONCEPT, LOOKBOOK, ESPACE PRO) in 12px uppercase BwGradual 400 with +0.083em tracking, plus an account icon and a cart icon with numeric badge. All links separated by 20–30px column-gap. No background fill, no border, no shadow — the bar is defined by its typography and the bottom hairline divider.

### Pill Navigation Button
**Role:** Lightweight nav/filter action

Inline text link wrapped in a 1px Walnut Ink border, fully rounded (9999px radius). Padding 8px 20px. Label in 12px BwGradual 500, uppercase, +0.083em letter-spacing, Walnut Ink. Background stays Linen Canvas (no fill). Used for 'NOTRE CONCEPT' and similar conceptual links. Hover state: Walnut Ink fill with Linen Canvas text — an exact color inversion.

### Filled Action Button
**Role:** Primary conversion control

Solid Walnut Ink (#403a34) background, Linen Canvas text. 0px corner radius (square), 12px 24px padding. Label in 12px BwGradual 500, uppercase, +0.083em tracking. The button's weight comes from its dark fill against the otherwise pale page — it reads as 'pressed' rather than friendly. One filled button per view maximum.

### Product Category Card
**Role:** Category entry tile in 4-column grid

Square aspect ratio, 0px radius, 1px Walnut Ink border, 20px gutters between cards. No padding inside — the photographic content bleeds to the edges. The card is defined entirely by its frame and image; no overlay, no text-on-image. Used in the NOS CATÉGORIES section.

### Hero Thumbnail Strip
**Role:** Product image quick-nav at hero bottom-right

Horizontal row of 4 small landscape thumbnails (~140×90px each) tucked into the bottom-right of the hero canvas, 20px gap, 0px radius. The active thumbnail carries a 1px Walnut Ink border; inactive thumbnails are borderless. Tapping swaps the main hero image. No labels on the thumbnails.

### Hero Display Title
**Role:** Bottom-left product name overlay

Product name set in BwGradual 400 at 120–250px, line-height 1.10, letter-spacing -0.056em, in Linen Canvas against the dark photo. Above the title: a 10px tracked-out label (e.g. 'CANAPÉ') in the same color, +0.100em letter-spacing, uppercase. The display word itself is not bolded — its size alone does the work.

### Section Display Heading
**Role:** Full-bleed uppercase section opener

Multi-line heading at 50–60px BwGradual 500, uppercase, letter-spacing -0.056em, Walnut Ink on Linen Canvas. Line-height 1.20–1.24 so the lines lock tight. May span full viewport width and wrap to 3–4 lines — the wall of text is intentional, not paragraph copy. Paired with a 10–12px tracked-out eyebrow label above.

### Eyebrow Label
**Role:** Category or section preface

10–12px BwGradual 500, uppercase, +0.083em to +0.100em letter-spacing, Walnut Ink. Sets the museum-label tone used above every product name and section opener.

### Asymmetric Image-Text Split
**Role:** Editorial body section pattern

Two-column layout: left column holds a small headline-right-aligned label (e.g. 'QUALITÉ SUPÉRIÈRE ET DURABILITÉ') at 18–20px, right column holds body copy at 18–20px BwGradual 400 in Charcoal Note, 1.50 line-height. Photo bleeds in below or beside. Generous 60–120px vertical breathing room between the heading block and the split.

### Body Copy Block
**Role:** Long-form descriptive text

18–20px BwGradual 400, Charcoal Note (#333333) or Walnut Ink, line-height 1.50, letter-spacing -0.004em. Maximum measure ~50ch. Uppercase used sparingly for short impact phrases; body stays in sentence case.

### Product Detail Page
**Role:** Product information layout

Hero is a single full-bleed lifestyle photograph (100vw, ~80vh) with the Hero Display Title bottom-left and the Hero Thumbnail Strip bottom-right. No additional chrome, no floating panels, no overlays — the photograph is the entire product page above the fold.

### Hairline Divider
**Role:** Section separator

1px solid Walnut Ink horizontal rule, full-bleed or constrained to content width. The only visual divider used between sections — replaces cards, shadows, and background changes.

### Icon (Nav)
**Role:** Account and cart icons in top bar

Outline-style icons at 20px, 1px stroke weight, Walnut Ink. The cart icon is paired with a 12px numeric badge in a Walnut Ink circle (16px diameter) with Linen Canvas text.

## Do's and Don'ts

### Do
- Use Linen Canvas (#f6f1eb) as the only background. Never introduce a second surface color or a white card.
- Set all borders to 1px solid Walnut Ink (#403a34). No border-radius on cards, images, or content blocks — 0px only.
- Use pill radius (9999px) exclusively for buttons, tags, and the cart badge. Everything else is square.
- Reserve display sizes (120–250px) for hero product names and section openers. Never apply them to body copy or inline links.
- Apply +0.083em to +0.100em letter-spacing on every 10–12px uppercase label. Tighten to -0.056em on anything above 100px.
- Default body text to 18–20px BwGradual 400 in Walnut Ink, line-height 1.50. Go down to 12px only for tracked-out labels.
- Separate sections with a full-width 1px Walnut Ink hairline — never with background color changes, cards, or shadows.

### Don't
- Don't introduce a chromatic accent color, gradient, or shadow anywhere in the system. The palette is two colors plus charcoal variants.
- Don't set body text below 18px. Anything smaller must be uppercase and tracked-out, not regular running copy.
- Don't add border-radius to images, category cards, or section blocks. Square edges are the system.
- Don't mix two different dark text colors in the same paragraph. Choose Walnut Ink for headings, Charcoal Note for body, and don't alternate.
- Don't place more than one filled Walnut Ink button per viewport. Other actions must be pill-outlined or text-only.
- Don't use intermediate type sizes (24, 28, 32, 36px). The scale jumps from 20 to 40 — anything in between breaks the editorial tension.
- Don't overlay text, badges, or UI on top of lifestyle photography. Only the hero display title and thumbnail strip are allowed in the image area.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Linen Canvas | `#f6f1eb` | Page background — the warm cream that fills every section between images |
| 1 | Card Surface | `#f6f1eb` | Category tiles and content blocks sit on the same canvas tone, separated only by hairline 1px Walnut Ink borders rather than elevated fill |

## Elevation

The system is deliberately shadowless. Depth is communicated exclusively through 1px Walnut Ink borders and 20px column gaps — never through box-shadow, blur, or fill contrast. This is a conscious choice: reclaimed-oak furniture is a tactile, material-forward product, and digital elevation would undermine the physicality the brand sells. The flat treatment also flattens hierarchy between UI and photography, letting the images sit at the same depth as the chrome.

## Imagery

Imagery is the entire product: large-scale, full-bleed Mediterranean outdoor lifestyle photography showing reclaimed-oak furniture on warm stone terraces, olive groves, and sunlit Provençal architecture. Tonal treatment is warm and slightly desaturated — the photos read as late-afternoon golden hour, never bright midday. Editorial crops dominate: sofas anchored against arches, tables pushed against horizon lines, no people, no clutter, no staged domesticity. Category tiles use tighter interior product shots on neutral plaster walls with single hard shadow lines. No illustrations, no 3D renders, no icons-as-art. Image treatment is unmasked and unretouched — natural grain, natural light, natural stone. The photographs carry the brand's warmth; the UI exists to frame them.

## Layout

Full-bleed page model with no max-width container on the primary content axis. The first screen is a 100vw × ~80vh hero photograph with a bottom-left display word and bottom-right thumbnail strip. Below the fold, sections use a centered max-width (~1400px) with 20–30px page padding for text and category content, but imagery continues to bleed edge-to-edge. The editorial rhythm alternates: giant display heading band → asymmetric two-column image+text block → 4-column category grid → full-bleed lifestyle photograph, each separated by a single 1px hairline rather than color or elevation changes. Vertical section gaps run 60–120px. Navigation is a single thin top bar — no sticky header, no sidebar, no mega-menu. Content density is sparse and gallery-like, not catalog-like.

## Agent Prompt Guide

**Quick Color Reference**
- text: #403a34 (Walnut Ink)
- background: #f6f1eb (Linen Canvas)
- secondary text: #333333 (Charcoal Note)
- border: 1px solid #403a34
- accent: none — system is monochromatic
- primary action: #403a34 (filled action)

**Example Component Prompts**

1. **Hero with Display Title**
Full-viewport (100vw × 80vh) lifestyle photograph as background. Bottom-left overlay: a 10px BwGradual 500 uppercase label in Linen Canvas with +0.100em letter-spacing (e.g. 'CANAPÉ'), then below it a 120–250px BwGradual 400 product name in Linen Canvas, letter-spacing -0.056em, line-height 1.10. Bottom-right: a horizontal row of 4 small thumbnails (140×90px, 0px radius, 20px gap) with the first thumbnail carrying a 1px Linen Canvas border.

2. **Section Display Heading Block**
Linen Canvas background. A 10px BwGradual 500 uppercase eyebrow label in Walnut Ink with +0.100em tracking, then a 50–60px BwGradual 500 uppercase heading in Walnut Ink, letter-spacing -0.056em, line-height 1.20, spanning the full content width and wrapping over 3–4 lines. 120px vertical gap below before the next block.

3. **Product Category Grid**
Linen Canvas background. 4-column grid, 20px column-gap and row-gap, 0px radius, 1px Walnut Ink border on each tile. Each tile is a square photograph with no overlay text. Below the grid, a 1px Walnut Ink full-width hairline divider.

4. **Outlined Pill Button**
1px Walnut Ink border, 9999px radius, 8px 20px padding. Label: 12px BwGradual 500, uppercase, +0.083em letter-spacing, Walnut Ink on Linen Canvas. No background fill. Hover inverts: Walnut Ink fill, Linen Canvas text.

5. **Asymmetric Image-Text Split**
Two-column layout on Linen Canvas. Left column: a 18–20px BwGradual 500 right-aligned label in Walnut Ink. Right column: 18–20px BwGradual 400 body copy in Charcoal Note, line-height 1.50, max-width ~50ch. Below or beside, a full-bleed Walnut Ink-bordered photograph at 0px radius. 60px gap between heading block and split.

## Type Scale Philosophy

The scale is deliberately bimodal. There is no comfortable middle ground between the 10–12px tracked-out labels and the 120–250px display words. This forces every element to commit to being either a museum label or a wall-sized statement — there are no 'subtle headings'. An AI agent should not interpolate intermediate sizes like 24, 28, 32, or 36px; instead, choose the nearest scale step and let the type-size contrast carry the hierarchy.

## Photography Rules

Every photograph should be warm-toned, naturally lit, and shot outdoors or against a plaster/stone interior. Never use pure white studio backgrounds — the entire catalog lives in golden-hour Provençal light. Avoid people, avoid clutter, avoid styled domesticity. The object against texture (stone, olive grove, aged wall) is the only acceptable composition.

## Similar Brands

- **Maison du Monde** — Same warm-neutral canvas and monumental editorial display typography applied to a furniture catalog — though Oakâme's restraint and monochromatic palette are far more severe.
- **Aesop** — Identical discipline: a single warm neutral background, one dark text color, no shadows, and oversized serif-adjacent sans typography carrying the entire brand voice.
- **The Row** — Same gallery-editorial pattern — hairline borders, no decorative chrome, full-bleed photography, and tracking-out uppercase labels under monumental product names.
- **Menu Space (menu.space)** — Shares the hairline-border + full-bleed-photo + tracked-out-label structure for design-forward brands, though Oakâme is warmer and more material-driven.
- **Cereal magazine** — Same sun-washed desaturated photography, generous whitespace, and tall thin sans-serif display type — the editorial mood that anchors Oakâme's interface.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-walnut-ink: #403a34;
  --color-linen-canvas: #f6f1eb;
  --color-charcoal-note: #333333;
  --color-slate-whisper: #555555;

  /* Typography — Font Families */
  --font-bwgradual: 'BwGradual', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.3;
  --tracking-label: 1px;
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.83px;
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.07px;
  --text-body: 20px;
  --leading-body: 1.4;
  --tracking-body: -0.08px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -2.24px;
  --text-heading: 50px;
  --leading-heading: 1.24;
  --tracking-heading: -2.8px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -3.36px;
  --text-display: 120px;
  --leading-display: 1.1;
  --tracking-display: -6.72px;
  --text-display-xl: 180px;
  --leading-display-xl: 1.1;
  --tracking-display-xl: -10.08px;
  --text-display-hero: 250px;
  --leading-display-hero: 1.1;
  --tracking-display-hero: -14px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-68: 68px;

  /* Layout */
  --section-gap: 120px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;
  --radius-pillbuttons: 9999px;

  /* Surfaces */
  --surface-linen-canvas: #f6f1eb;
  --surface-card-surface: #f6f1eb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-walnut-ink: #403a34;
  --color-linen-canvas: #f6f1eb;
  --color-charcoal-note: #333333;
  --color-slate-whisper: #555555;

  /* Typography */
  --font-bwgradual: 'BwGradual', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.3;
  --tracking-label: 1px;
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.83px;
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.07px;
  --text-body: 20px;
  --leading-body: 1.4;
  --tracking-body: -0.08px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -2.24px;
  --text-heading: 50px;
  --leading-heading: 1.24;
  --tracking-heading: -2.8px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -3.36px;
  --text-display: 120px;
  --leading-display: 1.1;
  --tracking-display: -6.72px;
  --text-display-xl: 180px;
  --leading-display-xl: 1.1;
  --tracking-display-xl: -10.08px;
  --text-display-hero: 250px;
  --leading-display-hero: 1.1;
  --tracking-display-hero: -14px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-68: 68px;
}
```
