# Raad Cycling — Style Reference
> Ink and ivory gallery runway

**Theme:** light

Raad Cycling operates as a monochrome editorial gallery where cycling apparel is presented as wearable sculpture. The entire visual system is built on the tension between pure black and pure white — no chromatic accent, no decorative gradient, no warm undertone. Typography carries all the personality: a single geometric sans-serif rendered at extreme scale for headlines (filling nearly the full viewport width) and shrunken to whisper-thin captions for product labels. Photography is treated as gallery art — full-bleed, tightly cropped, no rounded corners, no drop shadows, no decorative framing. The aesthetic borrows from high-fashion lookbooks and contemporary art catalogues, not from sports retail. Every surface is either ink or ivory. Every interaction is a hairline border, never a filled button. The result is a brand that feels curated, expensive, and silent — the product must do the talking.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary canvas for dark sections, product photography backgrounds, all body text on light surfaces, divider lines, and the dominant border color throughout the system |
| Ivory White | `#ffffff` | `--color-ivory-white` | Primary canvas for light sections, text on dark backgrounds, ghost-button fills and borders, the base surface against which all product photography is staged |
| Charcoal Edge | `#181818` | `--color-charcoal-edge` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Graphite | `#333333` | `--color-graphite` | Secondary border tone for subtle UI structure, divider lines between content blocks, and depth separation on otherwise flat surfaces |
| Stone Gray | `#666666` | `--color-stone-gray` | Muted helper text, secondary metadata, and the only step down in the type hierarchy where pure black would feel too heavy — the softest voice in the system |

## Tokens — Typography

### Arial — Fallback system font for micro-text and edge-case rendering — appears so rarely it functions as a safety net rather than a design choice · `--font-arial`
- **Substitute:** system-ui, sans-serif
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Fallback system font for micro-text and edge-case rendering — appears so rarely it functions as a safety net rather than a design choice

### Raad Display (custom geometric sans-serif) — The sole brand typeface used for everything from uppercase product category labels to the massive hero display 'LIQUID LOVE'. The custom face is a clean geometric sans with tall x-height and wide letterforms that hold up at extreme scale. It is used at weight 400 only — no bold, no light variations. The 0.1em positive letter-spacing is applied uniformly across all sizes, creating a slightly aired-out feel even at body text. This single-font, single-weight discipline is the most opinionated choice in the system: Raad removes the typographic hierarchy tools (weight contrast, family contrast) that most sites rely on, forcing scale and letter-spacing to do all the structural work instead. · `--font-raad-display-custom-geometric-sans-serif`
- **Substitute:** Space Grotesk, NB Architekt, or Inter at weight 400 with 0.1em tracking
- **Weights:** 400
- **Sizes:** 12px, 13px, 16px, 18px, 50px, 54px
- **Line height:** 1.00–1.40 (tight at display sizes, generous at body)
- **Letter spacing:** 0.1em across all sizes
- **Role:** The sole brand typeface used for everything from uppercase product category labels to the massive hero display 'LIQUID LOVE'. The custom face is a clean geometric sans with tall x-height and wide letterforms that hold up at extreme scale. It is used at weight 400 only — no bold, no light variations. The 0.1em positive letter-spacing is applied uniformly across all sizes, creating a slightly aired-out feel even at body text. This single-font, single-weight discipline is the most opinionated choice in the system: Raad removes the typographic hierarchy tools (weight contrast, family contrast) that most sites rely on, forcing scale and letter-spacing to do all the structural work instead.

### wfont_8b8bfe_cd7287b5071a4785a78bba57128a74e2 — wfont_8b8bfe_cd7287b5071a4785a78bba57128a74e2 — detected in extracted data but not described by AI · `--font-wfont8b8bfecd7287b5071a4785a78bba57128a74e2`
- **Weights:** 400
- **Sizes:** 12px, 13px, 16px, 18px, 50px, 54px
- **Line height:** 1, 1.2, 1.4, 2.5
- **Letter spacing:** 0.1
- **Role:** wfont_8b8bfe_cd7287b5071a4785a78bba57128a74e2 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 1.2px | `--text-caption` |
| body | 16px | 1.4 | 1.6px | `--text-body` |
| subheading | 18px | 1.2 | 1.8px | `--text-subheading` |
| heading | 50px | 1 | 5px | `--text-heading` |
| display | 54px | 1 | 5.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| buttons | 100px |

### Layout

- **Section gap:** 120px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Ghost Outline Button
**Role:** Primary call-to-action across the system

Transparent fill with a 1px white or black border, fully rounded at 100px radius. Padding approximately 12px vertical by 30px horizontal. Text is uppercase, 12-13px, 0.1em letter-spacing, in the inverse color of the border. On dark sections the border is white and text is white; on light sections the border is black and text is black. No fill state, no shadow, no hover transition beyond subtle opacity. These are the only interactive elements in the system — there is never a filled or solid-color button.

### Minimal Navigation Bar
**Role:** Top-level site navigation

Split layout on a single horizontal line. Left: two text links (Collection, About) in 13-16px uppercase with 0.1em tracking, in the current section's text color. Center: the wordmark 'raad' in the custom face at approximately 24-30px, lowercase. Right: a profile icon and a bag icon (the bag shows a count badge) in the same icon color as the text. No background fill — the nav floats over whatever section is behind it. No border, no shadow, no sticky transform visible in the static state.

### Hero Display Banner
**Role:** Full-viewport editorial header

Black canvas with a single display headline ('LIQUID LOVE') in white, uppercase, at the custom font's maximum weight and scale. The headline stretches to occupy the full width of the viewport. Below it, a small-caps subtitle in 12-13px with 0.1em letter-spacing, centered. Approximately 120px of vertical padding top and bottom. The hero contains no imagery — the typographic scale is the hero. No border, no radius.

### Product Category Split Card
**Role:** Jersey collection entry point (Women's / Men's)

Full-bleed photograph split into two equal-width columns (50/50 layout). Each half shows a model wearing the product, shot tight against a neutral studio backdrop. The product title ('Women's Pro Jersey' / 'Men's Pro Jersey') is overlaid in white, 30-40px, at the vertical center of each image. Below the title, a ghost outline button (white border, white text). No card background, no border around the image, zero radius. The photograph bleeds to all four edges of the viewport.

### Editorial Dark Section
**Role:** Brand story / craft explanation block

Black background section with a 50/50 split. Left column: a heading in the custom face at 36-50px, white, followed by two paragraphs of body text in 16-18px, white, at 1.4-1.6 line-height. The heading uses the standard 0.1em tracking. Right column: a large detail-crop photograph of the product (zipper, fabric texture) filling the full column height, no border, no radius. This is the only section that uses a dark background to create a pause in the page rhythm.

### Full-Bleed Product Photograph
**Role:** Visual showcase of garments and cycling details

Photography is always edge-to-edge, no padding, no border, no rounded corners, no shadow. Subjects are tightly cropped — faces often partially out of frame, focus on the garment, helmet, or body in motion. Lighting is high-key studio for product shots, natural available light for lifestyle shots. Color treatment is unfiltered: the jerseys' actual colors (red, orange, magenta, blue) appear at full saturation against the otherwise monochrome system, which is why the UI itself stays achromatic — the product provides the color.

### Footer
**Role:** Site-bottom information block

Minimal — likely follows the same black-on-white or white-on-black pattern as the preceding section. Small text only (12-13px), 0.1em letter-spacing. Contains legal links, social icons, and brand mark. No elaborate footer columns or newsletter forms.

## Do's and Don'ts

### Do
- Use only #000000 and #ffffff as the foundation — every section must resolve to one of these two surfaces, creating hard editorial breaks
- Apply 0.1em letter-spacing to every piece of text set in the custom brand face, at every size, without exception
- Render all photography edge-to-edge with zero border-radius, zero padding, zero shadow — let images bleed to the viewport edges
- Use the 100px border-radius exclusively for ghost outline buttons — every interactive element should be a transparent pill with a 1px border
- Set the hero headline at maximum display scale (the 50-54px token, scaled to fill the viewport width) to make typography function as the visual hero instead of imagery
- Maintain 120px vertical padding above and below major sections to create the breathing room of a gallery wall
- Use uppercase for all headings, button labels, and navigation items — sentence case appears nowhere in the system

### Don't
- Never introduce a chromatic color, gradient, or accent — the system is 0% colorful by design, and any hue would break the gallery aesthetic
- Never use a filled or solid-background button — ghost outlines are the only button pattern permitted
- Never apply box-shadow, drop-shadow, or blur to any element — depth comes from black/white alternation, not elevation
- Never use border-radius on images or cards — the only rounded element is the pill button at 100px
- Never use bold or semibold weights — the custom font exists at weight 400 only, and introducing weight contrast would destroy the system
- Never set body text tighter than 1.4 line-height — the generous leading is what keeps small white-on-black text legible
- Never add decorative UI elements (badges, tags, pills, chips, tooltips) — the system is intentionally stripped to typography, photography, and hairline borders

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Ivory Canvas | `#ffffff` | Base page background for light sections — product category cards, body content areas |
| 2 | Ink Backdrop | `#000000` | Full-bleed dark sections — hero banner, editorial story blocks, section dividers that create visual pauses |

## Elevation

Zero elevation. The system uses no box-shadows, no drop-shadows, no inner shadows, no blur effects, no gradient overlays. Depth is created entirely through section-to-section contrast (black band to white band) and through full-bleed photography that sits flush against adjacent content. This is a defining constraint: even interactive elements like buttons are flat outlines, never raised. The flatness is what makes the system feel like a printed catalogue rather than a software interface.

## Imagery

Photography is the sole visual medium — no illustration, no icon-driven graphics, no abstract shapes. All imagery is full-bleed editorial photography shot in a studio or on location with available light. Subjects are tightly cropped: jersey details, fabric texture, helmets, partial faces, bikes in motion. The color palette of the photography itself is the only color in the system — vivid jersey prints (red, orange, magenta, electric blue) appear at full saturation against the monochrome UI, creating a deliberate contrast where the product provides all chromatic energy. There are no lifestyle scenes with environmental context, no group shots, no posed studio portraits with full bodies visible. Every photograph functions as a flat art print, not as a marketing image.

## Layout

Full-bleed page model with no max-width container — content stretches edge-to-edge at all viewport sizes. The page is organized as alternating full-width bands: a black hero band with centered display text, a split-image product category band (50/50 columns), a dark editorial band (50/50 text + image), and likely continues with full-bleed detail shots. Section rhythm is defined by 120px vertical gaps and hard color transitions between black and white bands — no gradients, no soft dividers. Navigation is a single minimal bar at the very top with no sticky behavior, no background fill, and no shadow. The grid system is binary: either 50/50 splits or full-width single-column stacks. There is no 3-column or 4-column card grid. Content density is extremely low — the page is a slow scroll through large-format editorial compositions, not a compact product listing.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 on light surfaces, #ffffff on dark surfaces
- background: #ffffff (light sections) or #000000 (dark sections)
- border: #000000 on light surfaces, #ffffff on dark surfaces (1px hairline)
- accent: none — the system is fully achromatic
- primary action: no distinct CTA color

## 5 Example Component Prompts
1. **Hero Display Banner**: Full-viewport black (#000000) section, 120px top/bottom padding. Centered headline in the custom geometric sans at maximum display scale, weight 400, uppercase, white (#ffffff), 0.1em letter-spacing. Below it, a small-caps subtitle in 12px, white, 0.1em letter-spacing, centered. No imagery, no border, no radius.

2. **Ghost Outline Button**: Transparent fill, 1px border in #000000 (on light backgrounds) or #ffffff (on dark backgrounds). Fully rounded at 100px radius. Padding 12px vertical, 30px horizontal. Text: 12-13px, uppercase, 0.1em letter-spacing, in the border color. No shadow, no fill state, no hover transform.

3. **Product Category Split Card**: Full-bleed two-column 50/50 layout with no gap between columns. Each half is a photograph bleeding to all edges (no border-radius, no padding). Overlaid at vertical center: product title in 30-40px white (#ffffff) with 0.1em letter-spacing, followed by a ghost outline button with white border and white text.

4. **Editorial Dark Section**: Black (#000000) full-width section. Left 50% column: heading in 36-50px white (#ffffff) with 0.1em letter-spacing, followed by two body paragraphs in 16-18px white, 1.4-1.6 line-height. Right 50% column: a single large photograph filling the full column height, edge-to-edge, no border, no radius.

5. **Minimal Navigation Bar**: Single horizontal row with three groups — left-aligned (two text links in 13-16px uppercase, 0.1em tracking, surface-inverse color), center-aligned (wordmark in the custom face at ~24-30px lowercase), right-aligned (profile icon and bag icon with count badge, surface-inverse color). No background, no border, no shadow, no sticky behavior. Floats over the section content behind it.

## Similar Brands

- **Bandit Cycling** — Same monochrome product photography approach with full-bleed model shots and zero-color UI that lets the garment prints carry all visual energy
- **MAAP Cycling** — Same high-contrast black/white interface with minimal ghost-button interactions and large-scale editorial typography for hero sections
- **Passoni** — Same gallery-catalogue presentation of cycling products — full-bleed art-direction photography, tight crops, no decorative UI chrome, typography as the primary visual element
- **ASSOS of Switzerland** — Same editorial-magazine page rhythm with alternating dark and light full-width bands and large display headlines that function as section markers

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-ivory-white: #ffffff;
  --color-charcoal-edge: #181818;
  --color-graphite: #333333;
  --color-stone-gray: #666666;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-raad-display-custom-geometric-sans-serif: 'Raad Display (custom geometric sans-serif)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wfont8b8bfecd7287b5071a4785a78bba57128a74e2: 'wfont_8b8bfe_cd7287b5071a4785a78bba57128a74e2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.2px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 1.6px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: 1.8px;
  --text-heading: 50px;
  --leading-heading: 1;
  --tracking-heading: 5px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: 5.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Layout */
  --section-gap: 120px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-ivory-canvas: #ffffff;
  --surface-ink-backdrop: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-ivory-white: #ffffff;
  --color-charcoal-edge: #181818;
  --color-graphite: #333333;
  --color-stone-gray: #666666;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-raad-display-custom-geometric-sans-serif: 'Raad Display (custom geometric sans-serif)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wfont8b8bfecd7287b5071a4785a78bba57128a74e2: 'wfont_8b8bfe_cd7287b5071a4785a78bba57128a74e2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.2px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 1.6px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: 1.8px;
  --text-heading: 50px;
  --leading-heading: 1;
  --tracking-heading: 5px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: 5.4px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-full: 100px;
}
```
