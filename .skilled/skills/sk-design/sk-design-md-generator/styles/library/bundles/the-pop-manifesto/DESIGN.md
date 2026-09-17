# The Pop Manifesto — Style Reference
> Orange editorial firehose

**Theme:** light

The Pop Manifesto operates on editorial maximalism: a single saturated orange field floods the entire viewport, and the only typographic authority is raw black sans-serif at oversized display scale. Layout is brutally simple — full-bleed canvas, edge-to-edge photo grid, no card surfaces or shadows to soften the impact. The brand wordmark 'POP' uses a custom balloon/bubble script that punctures the otherwise austere type system with a single moment of softness. Color lives inside the photography (hot pink, electric blue backdrops) rather than in UI chrome, making the orange the only color the interface itself ever wears.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Manifesto Orange | `#ff7a00` | `--color-manifesto-orange` | Full-viewport canvas, page background — one unmodulated orange flood with no gradients, no overlays, no surface variation |
| Magenta Backdrop | `#ff29f1` | `--color-magenta-backdrop` | Photography studio backdrop — appears as flat color blocks behind models, not as UI chrome |
| Cobalt Backdrop | `#287aea` | `--color-cobalt-backdrop` | Photography studio backdrop — second flat color block behind models in the photo grid |
| Ink Black | `#000000` | `--color-ink-black` | All text, wordmark, hairline borders, nav links, photo tile labels — pure black with no softening |
| Paper White | `#ffffff` | `--color-paper-white` | Inset text on dark photo backgrounds, photo label cards where reverse-out is needed |

## Tokens — Typography

### Roobert — Primary typeface for all UI — navigation, body, subheadings, and display headlines. Used exclusively at weight 400; the design system gains its heaviness from size and uppercase transforms, not from font weight. A geometric humanist sans with high x-height and clean terminals that reads as modern European editorial. Free substitute: Inter or Söhne. · `--font-roobert`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 12px, 15px, 22px, 33px
- **Line height:** 1.2
- **Letter spacing:** normal
- **Role:** Primary typeface for all UI — navigation, body, subheadings, and display headlines. Used exclusively at weight 400; the design system gains its heaviness from size and uppercase transforms, not from font weight. A geometric humanist sans with high x-height and clean terminals that reads as modern European editorial. Free substitute: Inter or Söhne.

### Roobert (Bubble Display Cut) — Reserved for the 'POP' wordmark in the masthead — a custom balloon/bubble script with rounded inflated letterforms that is the system's only counterpoint to the otherwise hard-edged sans-serif. Never use this style for body, nav, or section labels. · `--font-roobert-bubble-display-cut`
- **Substitute:** Pangram Sans Rounded (display variant)
- **Weights:** 400
- **Sizes:** 12px, 15px, 22px, 33px
- **Line height:** 0.7
- **Role:** Reserved for the 'POP' wordmark in the masthead — a custom balloon/bubble script with rounded inflated letterforms that is the system's only counterpoint to the otherwise hard-edged sans-serif. Never use this style for body, nav, or section labels.

### Roobert Bold — Roobert Bold — detected in extracted data but not described by AI · `--font-roobert-bold`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.2
- **Role:** Roobert Bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.2 | — | `--text-body` |
| subheading | 22px | 1.2 | — | `--text-subheading` |
| heading | 33px | 1.2 | — | `--text-heading` |
| display | 120px | 0.7 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 9 | 9px | `--spacing-9` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| photos | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 40px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Full-Bleed Orange Canvas
**Role:** Page background

Single solid #ff7a00 fills the entire viewport with no gradient, texture, or banding. The orange is the page — no card surfaces, no white sections, no alternating bands. Body and padding sit directly on this color.

### Masthead Wordmark
**Role:** Brand identity header

'THE [POP] MANIFESTO' anchored to the very top edge of the viewport. 'THE' and 'MANIFESTO' set in Roobert 400 uppercase at ~120px, line-height 0.7, letter-spacing tight, in pure #000000. The 'POP' portion uses a custom bubble/balloon display cut in the same black, breaking the typographic grid as the only curved, soft element on the page.

### Top-Right Nav
**Role:** Site navigation

Right-aligned horizontal row: SHOP, ARCHIVE, NEWSLETTER. Roobert 400, 12px, uppercase, #000000, no separators or bullets. ~20px gap between items. Sits at the same baseline as the wordmark, optically aligned to the top edge.

### Photo Grid Row
**Role:** Editorial content listing

Three edge-to-edge photo tiles arranged horizontally with no gutters (or 0px gap). The center tile is roughly 2x the width of the flanking tiles. Photos are full-bleed with no border, radius (0px), or shadow. Each tile sits directly on the orange canvas.

### Photo Tile Label
**Role:** Caption beneath photo

Small uppercase Roobert 400, 12–15px, #000000, sits in the orange margin ~20–25px below each photo. Left-aligned to the photo edge. Text is the section name (INTERVIEW, connections, TOTAL LUXURY SPA, READ MORE) — mixed case acceptable, with some labels lowercase to create rhythm.

### Magenta Studio Tile
**Role:** Photography variant

Photo tile with flat #ff29f1 magenta as the studio backdrop behind a model. The magenta is a hard color block, not a gradient — it bleeds to all four edges of the crop.

### Cobalt Studio Tile
**Role:** Photography variant

Photo tile with flat #287aea deep blue as the studio backdrop. Same edge-bleed treatment as the magenta variant. Blue and magenta never appear together in the same tile.

### Neutral Studio Tile
**Role:** Photography variant

Photo tile with white/off-white interior backdrop (lifestyle, natural light). Provides visual rest between the two saturated studio tiles.

## Do's and Don'ts

### Do
- Flood the entire viewport with a single solid #ff7a00 orange — no gradients, no overlays, no panel differentiation.
- Set all type in Roobert 400 at the five-step scale (12/15/22/33/120px); let size and uppercase transforms carry weight, never bold cuts.
- Use 0px border-radius on all photos, buttons, tags, and cards — this system has no rounded corners anywhere.
- Reserve the bubble/balloon display cut exclusively for the 'POP' wordmark; it must never appear in body, nav, or section labels.
- Let photos bleed edge-to-edge with no gutters, no borders, and no drop shadows — the orange canvas is the only frame.
- Keep all text pure #000000 on the orange canvas; reserve #ffffff only for reverse-out on dark photo backdrops.
- Maintain ~291px of top padding before the photo grid to let the masthead breathe and signal editorial gravitas.

### Don't
- Don't introduce any new colors — the palette is orange, black, white, and the two photo backdrops (magenta + cobalt). No grays, no accent hues.
- Don't add card surfaces, drop shadows, or elevation — the design is intentionally flat, direct, and unmediated.
- Don't use bold or semibold weights — Roobert 400 at large sizes is the system's only voice.
- Don't round corners on photos, buttons, or any container — 0px radius is structural, not negotiable.
- Don't add body copy, paragraphs, or long-form text in the body type size — this is an editorial cover, not an article page.
- Don't use the bubble display font for headlines, nav, or labels — it is wordmark-only.
- Don't break the orange canvas with white sections, alternating bands, or boxed content — the orange must always reach all four edges.

## Elevation

This system intentionally uses zero shadows and zero elevation. The orange canvas is flat, the photos are flush against it, and the only depth comes from the typographic scale and the saturated color blocks inside the photography. Adding any drop shadow or card lift would soften the editorial directness that defines the look.

## Imagery

Photography is editorial fashion: tight to medium crops of male models in styled poses, shot against flat saturated studio backdrops (hot magenta, deep cobalt blue) or soft natural-light interiors. The model is always the subject; environment is reduced to a color field. Treatment is high-contrast and direct with no overlays, no duotones, no text-on-image — labels sit in the orange margin below each frame, never inside the photo. The central tile is given disproportionate scale (roughly 2x width) to create visual hierarchy within a simple 3-column grid.

## Layout

Full-bleed edge-to-edge layout with no max-width constraint. The masthead occupies the top ~15% of the viewport with the wordmark anchored to the top-left and nav to the top-right. A single horizontal photo grid row follows after ~291px of vertical breathing space, with three tiles at a 1:2:1 width ratio. Labels sit in the orange margin beneath each tile. The page is a single editorial cover frame — no scrolling sections, no cards, no sidebar. Navigation is minimal (3 text links) and hugs the top-right corner.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ff7a00
- border: #000000
- accent: #ff29f1 (photo backdrop only — not UI)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a full-bleed editorial cover page: solid #ff7a00 orange background filling the entire viewport. Masthead at top-left reads 'THE POP MANIFESTO' in Roobert 400 uppercase, 120px, line-height 0.7, #000000, anchored to the very top edge. Top-right nav row: 'SHOP   ARCHIVE   NEWSLETTER' in Roobert 400 uppercase, 12px, #000000, 20px gap between items.

2. Create a 3-tile horizontal photo grid sitting on the orange canvas after 291px of top padding. Tiles arranged at a 1:2:1 width ratio with 0px gap and 0px border-radius. No borders, no shadows. Each tile shows a fashion model: left tile against flat #ff29f1 magenta backdrop, center tile (2x width) against flat #287aea cobalt backdrop, right tile against soft white interior. Labels in Roobert 400 12–15px #000000 sit in the orange margin 20–25px below each tile, left-aligned to the photo edge.

3. Create the 'POP' wordmark variant: a single word 'POP' in a custom balloon/bubble display font, 120px+, weight 400, #000000, line-height 0.7, set between the words 'THE' and 'MANIFESTO' in the masthead. This is the only use of curved/inflated letterforms in the entire system.

4. Create a photo tile label: 'INTERVIEW' or 'connections' in Roobert 400, 15px, uppercase or lowercase (vary for rhythm), #000000, no background, no border, sitting 20px below a photo tile edge, left-aligned to the tile's left edge.

## Similar Brands

- **Apartamento Magazine** — Same editorial-cover approach with oversized black sans-serif masthead and full-bleed photography on a single saturated field
- **Ssense** — Same fashion-editorial confidence with bold type, edge-to-edge imagery, and zero decorative chrome
- **Hypebeast** — Same loud single-color canvas with black uppercase type and a minimal right-aligned nav
- **Acne Studios** — Same restraint — letting photography and typography do all the work with no cards, shadows, or surface variation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-manifesto-orange: #ff7a00;
  --color-magenta-backdrop: #ff29f1;
  --color-cobalt-backdrop: #287aea;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert-bubble-display-cut: 'Roobert (Bubble Display Cut)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert-bold: 'Roobert Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading: 33px;
  --leading-heading: 1.2;
  --text-display: 120px;
  --leading-display: 0.7;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-photos: 0px;
  --radius-buttons: 0px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-manifesto-orange: #ff7a00;
  --color-magenta-backdrop: #ff29f1;
  --color-cobalt-backdrop: #287aea;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert-bubble-display-cut: 'Roobert (Bubble Display Cut)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert-bold: 'Roobert Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading: 33px;
  --leading-heading: 1.2;
  --text-display: 120px;
  --leading-display: 0.7;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
}
```
