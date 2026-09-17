# Wayfinder — Style Reference
> A black cinema screen with one whispered title floating over a living illustration. The interface is a dimmer switch, not a dashboard.

**Theme:** dark

Wayfinder is an immersive interactive film that treats the entire viewport as a stage for animated illustration. The UI is deliberately vestigial: a pure black canvas, a single light-weight display title, two compact action buttons, and a few icon-only controls in the corners. Almost everything visual is illustration content — stylized trees, mushrooms, flowers, earth textures — while the interface stays flat, borderless, and silent. The design discipline is subtraction: no shadows, no gradients, no card layers, no decorative color. The wide letter-spacing on the display type and the centered composition give every screen a cinematic, title-card quality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, primary borders, icon strokes — the literal theater curtain everything sits on |
| Smolder Earth | `#0b0502` | `--color-smolder-earth` | Secondary surface tone — picks up a warm cast from the illustration overlay, used as a slightly lifted dark |
| Charcoal | `#1a1a1a` | `--color-charcoal` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Bone White | `#ffffff` | `--color-bone-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Ash | `#e3e3e2` | `--color-ash` | Hairline borders on the dark button, subtle separators, muted off-white dividers |
| Driftwood | `#c0bfbe` | `--color-driftwood` | Muted surface for low-emphasis background panels and body containers |

## Tokens — Typography

### Enreal — Display and UI type. Weight 300 carries the title — a thin geometric sans that whispers against the dark canvas. The 0.042em tracking (roughly 0.67px at 16px) is wide for a sans, giving every word a cinematic, breathing quality. Body and labels step up to 400, reserved to 700 for the rare emphasis. · `--font-enreal`
- **Substitute:** Jost Light, DM Sans Light, or Outfit Light
- **Weights:** 300, 400, 700
- **Sizes:** 14px, 16px, 24px
- **Line height:** 1.20, 1.75
- **Letter spacing:** 0.0420em
- **Role:** Display and UI type. Weight 300 carries the title — a thin geometric sans that whispers against the dark canvas. The 0.042em tracking (roughly 0.67px at 16px) is wide for a sans, giving every word a cinematic, breathing quality. Body and labels step up to 400, reserved to 700 for the rare emphasis.

### Ciutadella-Medium — Secondary support face at weight 300 — used for small labels, links, and metadata. Tight line-height (1.0) and normal tracking make it a quiet, textural companion to the wider Enreal. · `--font-ciutadella-medium`
- **Substitute:** Karla Light, Inter Light, or Manrope Light
- **Weights:** 300
- **Sizes:** 14px
- **Line height:** 1.00
- **Role:** Secondary support face at weight 300 — used for small labels, links, and metadata. Tight line-height (1.0) and normal tracking make it a quiet, textural companion to the wider Enreal.

### Arial — System fallback for button text and small body contexts where the custom faces are not loaded. · `--font-arial`
- **Substitute:** system-ui, -apple-system, Helvetica
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** System fallback for button text and small body contexts where the custom faces are not loaded.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body | 16px | 1.2 | 0.67px | `--text-body` |
| subheading | 24px | 1.2 | 1.01px | `--text-subheading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 40px
- **Card padding:** 16px
- **Element gap:** 4px

## Components

### Centered Title Block
**Role:** Hero typography composition

Vertically and horizontally centered in the viewport. Title at ~48-64px in Enreal weight 300, #ffffff, letter-spacing 0.042em, all-caps. Subtitle in Ciutadella-Medium weight 300, 14px, #ffffff at reduced opacity, two short lines separated by a hard line break. No drop shadow, no background — type floats directly on the illustration.

### Start Button (Filled White)
**Role:** Primary user action

White (#ffffff) solid fill, #000000 text, no border, 0px radius. Inline arrow icon (→) left of the label 'start' in Enreal or Arial 13px. Padding ~8px 16px. The only visually loud element on the page besides the title.

### Info Button (Outlined Dark)
**Role:** Secondary action

Charcoal (#1a1a1a) fill with Ash (#e3e3e2) 1px hairline border, 0px radius, white text 'info' at 13px. Sits 30px below the primary action. Quiet but clearly interactive — the border is the affordance.

### Corner Utility Cluster (Top-Left)
**Role:** Scene control toggles

Three small icon-only controls aligned top-left at ~8-10px padding: a filmstrip/scene-selector icon, a pause/play toggle, and an info dot. Monochrome white on black, no background, no labels. The film-strip icon implies a chapter/segment picker.

### Corner Utility Cluster (Top-Right)
**Role:** Global controls

Three icon-only controls top-right: language toggle 'FR', speaker/audio icon, and fullscreen expand icon. Same monochrome treatment as the left cluster. Equal padding from the edge as the left cluster to create visual balance.

### Immersive Illustration Layer
**Role:** Full-bleed visual content

The page background is not a color — it is a full-viewport animated illustration. Warm earth palette (ochre, terracotta, moss green, cream) rendered in a flat, slightly textured style with stylized trees, mushrooms, wildflowers, and landscape motifs. Edges are not masked; the illustration bleeds into every corner. This layer is content, not chrome, and carries the entire emotional weight of the experience.

### Button Stack
**Role:** Action container

Two buttons stacked vertically with 30px gap between them. Center-aligned. No background container — the buttons exist directly on the illustration.

## Do's and Don'ts

### Do
- Keep the canvas at #000000. The black is a stage, not a background color.
- Set all type in Enreal weight 300 for titles and weight 400 for body. The thinness is the signature.
- Maintain 0.042em letter-spacing on all Enreal usage — do not tighten it for body sizes.
- Center the primary composition vertically and horizontally in the viewport.
- Use the filled white button for the single most important action and the dark outlined button for secondary.
- Keep corner utility controls icon-only and monochrome. No labels, no backgrounds, no tooltips.
- Let the illustration occupy the full viewport. Never crop it, never overlay a surface on top of it.

### Don't
- Do not introduce shadows, glows, or elevation effects on any element.
- Do not add gradients, brand accent colors, or chromatic highlights — the palette is intentionally achromatic.
- Do not use border-radius on any component. Everything is sharp-edged and architectural.
- Do not switch the title to a bold or heavy weight. Weight 300 on Enreal is the defining voice.
- Do not add card containers, backgrounds, or frosted-glass panels behind the type or buttons.
- Do not use any color from the illustration (ochre, terracotta, moss) as a UI token — those belong to the artwork.
- Do not build dense layouts. This is a one-screen-at-a-time experience; whitespace is the layout.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void Black | `#000000` | Underlying page canvas — the theater-dark base layer |
| 2 | Smolder Earth | `#0b0502` | Warm dark surface that absorbs the illustration's color cast |
| 3 | Charcoal | `#1a1a1a` | Secondary button fill and border — the only stepped dark |

## Elevation

The design uses no shadows whatsoever. Depth is implied only through the illustrated background and the slight contrast step from #000000 to #1a1a1a. Components float on the illustration as flat shapes — any shadow would compete with the artwork and break the cinematic illusion.

## Imagery

The visual language is hand-illustrated 2D animation — flat shapes with a slight painterly texture, no outlines on most forms, warm earth palette (terracotta, ochre, olive, cream, sienna). Trees are rendered as triangular canopies with horizontal striping; mushrooms and wildflowers are scattered as small graphic accents. The illustration occupies the entire viewport at all times and is animated (parallax or character movement). There is no photography, no product imagery, no 3D. Icons in the UI are thin, monochrome, line-based and sit at roughly 1px stroke weight. The art style evokes mid-century children's book illustration crossed with a Studio Ghibli background plate — cozy, handcrafted, slightly nostalgic.

## Layout

Single-screen, full-bleed layout with no scrolling content sections. The page model is 100vw × 100vh, center-aligned. The hero is the entire page: a centered title block, a two-line subtitle, and a vertical button stack, all overlaid on the full-bleed animated illustration. Top-left holds a 3-icon scene control cluster; top-right holds a 3-icon utility cluster (language, audio, fullscreen). There is no navigation bar, no sidebar, no footer. Section rhythm does not apply — there is only one section, and it loops between scenes controlled by the top-left filmstrip icon.

## Agent Prompt Guide

**Quick Color Reference**
- text (display): #ffffff
- text (body/label): #ffffff at reduced opacity
- background (page canvas): #000000
- background (secondary button fill): #1a1a1a
- border (subtle separator): #e3e3e2
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. *Full-bleed title screen*: Set body and html background to #000000, 100vw × 100vh. Center a display headline at 48px in Enreal weight 300, #ffffff, letter-spacing 0.042em, all caps. Beneath it, a two-line subtitle in Ciutadella-Medium weight 300, 14px, #ffffff at 70% opacity, line-height 1.0, hard line break between lines. No background container.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
4. *Corner utility cluster (top-left)*: Three icon-only buttons in a horizontal row, 8-10px padding from viewport edge. Each icon is white line-art at ~16px, no background, no border, no label. Spacing between icons ~8px.
5. *Immersive illustration background*: A full-viewport absolutely-positioned layer behind all UI at z-index 0, rendering a warm earth-toned illustrated landscape. The UI lives at z-index 1 or above and does not dim or tint the artwork.

## Scene Structure

Wayfinder is a sequence of illustrated scenes rather than a multi-page site. The top-left filmstrip icon implies the user can scrub between segments; the play/pause icon controls auto-progression. When generating new 'pages' for this system, treat each one as a new scene: a single full-viewport illustration, the same centered title block pattern, the same two-button stack, and the same corner clusters. Do not invent navigation menus, breadcrumbs, footers, or multi-column content — they would break the cinematic contract.

## Type Atmosphere

The display title uses weight 300 specifically because a heavier weight would overpower the quiet, hand-drawn world behind it. A bold sans here would feel like a billboard stapled onto a watercolor. The wide 0.042em tracking ensures the letters don't crowd when the type is large, preserving the title-card pacing. Any new page generated in this system should keep the same restraint: thin weights, wide tracking, generous vertical space, and a single, generous moment of type centered in the frame.

## Similar Brands

- **Bear 71 (NFB Interactive)** — Same NFB interactive-film lineage — full-bleed illustrated/photographic canvas with minimal monochrome UI overlaid, no shadows, no card layers, type floating directly on imagery
- **The Boat (SBS Interactive)** — Cinematic full-viewport narrative with centered light-weight display type and an almost invisible interface — the art carries the page, the chrome stays out of the way
- **Silk – Interactive Generative Art** — Pure black canvas with thin, airy type and a single primary action button — the generative artwork is the entire visual system
- **Everyone Has a Story (Google)** — Full-bleed illustrated scenes with centered whisper-light display type and a single white-on-dark action button — the same title-card, cinema-screen discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-smolder-earth: #0b0502;
  --color-charcoal: #1a1a1a;
  --color-bone-white: #ffffff;
  --color-ash: #e3e3e2;
  --color-driftwood: #c0bfbe;

  /* Typography — Font Families */
  --font-enreal: 'Enreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ciutadella-medium: 'Ciutadella-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: 0.67px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 1.01px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-30: 30px;
  --spacing-40: 40px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 16px;
  --element-gap: 4px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-void-black: #000000;
  --surface-smolder-earth: #0b0502;
  --surface-charcoal: #1a1a1a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-smolder-earth: #0b0502;
  --color-charcoal: #1a1a1a;
  --color-bone-white: #ffffff;
  --color-ash: #e3e3e2;
  --color-driftwood: #c0bfbe;

  /* Typography */
  --font-enreal: 'Enreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ciutadella-medium: 'Ciutadella-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: 0.67px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 1.01px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-30: 30px;
  --spacing-40: 40px;
}
```
