# Eduardo del Fraile — Style Reference
> Black gallery vitrine — a darkened room where one object glows in white text

**Theme:** dark

Eduardo del Fraile is a portfolio built on radical subtraction: a pure black void where one custom grotesk and white text form the entire interface. The UI recedes almost entirely so that 3D renders float in negative space like objects under museum spotlights. Every typographic decision, every near-absence of color, every flat shadowless surface serves the same purpose — make the canvas feel infinite and weightless, then place one object inside it. Components are text-first and borderless; hierarchy comes from weight shifts in Akzidenz Grotesk alone, not from fills, elevations, or accent colors.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page background, full-bleed canvas for all content |
| Bone White | `#ffffff` | `--color-bone-white` | All text, navigation, footer instructions, and thin UI strokes |
| Ash Gray | `#888888` | `--color-ash-gray` | Secondary or muted text, de-emphasized labels, inactive hints |

## Tokens — Typography

### Akzidenz-Grotesk — Sole typeface across navigation, body, footer, and brand mark. The weight 400/700 pairing is the entire hierarchy system — no color, no size jumps, no italic to differentiate roles. At 14–15px the grotesk reads as utilitarian editorial; at 20–21px it becomes signage. Normal tracking preserves the geometric, mechanical feel. · `--font-akzidenz-grotesk`
- **Substitute:** Inter, Helvetica Neue, Neue Haas Grotesk
- **Weights:** 400, 700
- **Sizes:** 14px, 15px, 20px, 21px
- **Line height:** 1.30
- **Letter spacing:** 0
- **Role:** Sole typeface across navigation, body, footer, and brand mark. The weight 400/700 pairing is the entire hierarchy system — no color, no size jumps, no italic to differentiate roles. At 14–15px the grotesk reads as utilitarian editorial; at 20–21px it becomes signage. Normal tracking preserves the geometric, mechanical feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.3 | — | `--text-caption` |
| body-sm | 15px | 1.3 | — | `--text-body-sm` |
| body | 20px | 1.3 | — | `--text-body` |
| body-lg | 21px | 1.3 | — | `--text-body-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Brand Mark (Wordmark)
**Role:** Site identifier in top-left

Plain text 'Eduardo del Fraile' in Akzidenz-Grotesk 14–15px, weight 400, color #ffffff, no decoration. Sits flush left at the viewport edge with 0px padding from the canvas.

### Text Navigation Link
**Role:** Primary navigation items in top-right

Akzidenz-Grotesk 14–15px, weight 400, color #ffffff, no underline, no background, no border. ~20px gap between links. Active state indicated only by default-vs-hover color shift; no fill or pill.

### Social Icon Link
**Role:** Instagram entry in top-right

Single line-stroke Instagram glyph in #ffffff at the same height as text links (14–15px). No background, no border-radius, no container — the icon is sized to align with the text baseline.

### Footer Instruction Text
**Role:** Scroll-hint labels at bottom-left

Akzidenz-Grotesk 14px weight 400 #ffffff, two short phrases separated by ~20px gap ('Scroll with the mouse' / 'Scroll with L and R keyboard arrows'). No icons, no buttons — plain instructional copy.

### Full-Bleed Showcase Frame
**Role:** Container for 3D content in the page body

No container at all. 3D renders are placed directly on the #000000 canvas, centered both axes, scaled to occupy the viewport. No padding, no border, no shadow, no background plate — the artwork terminates at its own silhouette.

### Language Toggle
**Role:** Locale switcher in nav (ESP)

Same treatment as a text nav link — Akzidenz-Grotesk 14–15px weight 400 #ffffff. Functions as a plain label, not a styled control.

## Do's and Don'ts

### Do
- Set the page background to #000000 on every screen — there is no light variant and no secondary surface color.
- Use only Akzidenz-Grotesk at 14, 15, 20, or 21px with weight 400 or 700; line-height 1.3; tracking 0. Never introduce a second typeface.
- Build navigation as raw text links in #ffffff with 0px border-radius and 20px gap between items — no pills, no fills, no underlines.
- Let 3D or photographic content sit directly on the black canvas with no frame, card, or shadow around it.
- Use weight 700 (bold) as the sole way to emphasize — never use color, italics, or size jumps larger than 6px to create hierarchy.
- Use #888888 only for genuinely de-emphasized secondary text; never for interactive states or active nav.
- Keep all UI micro-copy short and instructional (one to three words) so the void stays empty.

### Don't
- Do not add accent colors, brand fills, or chromatic highlights of any kind — the palette is strictly black, white, and ash gray.
- Do not apply border-radius to anything — buttons, cards, tags, and images all stay at 0px.
- Do not introduce drop shadows, inner glows, or elevated card layers; the canvas must remain flat.
- Do not use italic, condensed, or extended Akzidenz weights; the family is restricted to 400 and 700.
- Do not wrap the 3D content in a bordered card, a gradient backdrop, or a vignette — it should float on pure black.
- Do not use #ffffff as a filled button background; the system has no filled buttons — actions are text or icons only.
- Do not exceed 21px for any UI text — the grotesk's editorial scale is part of the signature.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Single-level surface — there is no card or panel layer above the canvas; content sits directly on black |

## Elevation

No elevation. No drop shadows, no inner glows, no stacked panels. The only depth cue is the 3D content itself against the flat black void. Surfaces never lift off the page — they are the page.

## Imagery

Photorealistic 3D renders are the only imagery on the site: a porcelain gorilla-bottle hybrid, a matte orange with a striped paper straw, and a glossy green pepper. Each render is full-bleed, centered on the black canvas, and lit like a product photograph under a single key light. No lifestyle context, no background plate, no overlay text — the object is cropped at its silhouette and floats in the void. Imagery occupies roughly 80% of the visible viewport per scene, with UI text pushed to the corners. There are no icons, illustrations, or decorative graphics beyond the single Instagram glyph in the nav.

## Layout

Full-bleed black canvas, no max-width container, no centered column. Navigation is split: brand wordmark flush-left at the top edge, nav links + social icon flush-right, both vertically aligned to a single ~15px text row. The main body is a horizontal scroll sequence of 3D renders — each render fills the viewport and the user advances by mouse-wheel or L/R arrow keys (per the footer hint). There is no grid, no sidebar, no card stack. Sections are not separated by dividers or color bands; the transition between works is a hard cut from one rendered object to the next against the same black field. Footer is a thin row of instructional text flush-left at the bottom edge. The entire page reads as a darkened gallery corridor where the visitor walks past lit objects.

## Agent Prompt Guide

Quick Color Reference
- text: #ffffff
- background: #000000
- border: none (no border system; use #ffffff only for 1px hairlines if absolutely needed)
- accent: none
- primary action: no distinct CTA color

Example Component Prompts
1. Top navigation: Place the wordmark 'Eduardo del Fraile' flush-left at the top edge, and the links 'Work', 'About', 'Contact', 'ESP' followed by a 14px Instagram line-icon flush-right. All text is Akzidenz-Grotesk 15px weight 400, color #ffffff, with 20px gap between links. No background, no border, no underline.
2. Full-bleed showcase: Render a 3D object (e.g. a matte ceramic bottle) centered on a pure #000000 canvas. The object occupies ~70% of the viewport height, lit with a single overhead key light. No frame, no card, no border, no shadow around the object. The canvas is edge-to-edge with no margin.
3. Footer: Bottom-left, two short instructions in Akzidenz-Grotesk 14px weight 400 #ffffff, separated by 20px gap: 'Scroll with the mouse' and 'Scroll with L and R keyboard arrows'. No icons, no buttons, no background.
4. De-emphasized helper text: A label like 'ESP' or a secondary annotation in #888888 Akzidenz-Grotesk 14px weight 400 — only when the text is not interactive and must recede behind the primary white type.
5. Active section title: Use Akzidenz-Grotesk 20px weight 700 #ffffff for a section heading. This is the only typographic emphasis allowed — do not change color, add a background, or add a divider line.

## Similar Brands

- **Aristide Benoist** — Same black-void portfolio treatment with 3D renders floating without frames on a pure #000000 canvas, text-only navigation in the corners.
- **Charlie Davis** — Minimalist dark portfolio using a single grotesk face, no accent color, and no UI chrome beyond corner-aligned text links.
- **Active Theory** — Full-bleed dark creative studio site that lets immersive 3D content dominate while the interface recedes to plain white type.
- **Rafaël Rozendaal** — Single-color-canvas artist sites with zero decorative UI — the work is the entire visual system and the chrome is nearly invisible.
- **Studio AKAA** — Editorial-feel dark portfolio relying on weight contrast in a single sans-serif and a strictly monochrome palette to let imagery lead.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-bone-white: #ffffff;
  --color-ash-gray: #888888;

  /* Typography — Font Families */
  --font-akzidenz-grotesk: 'Akzidenz-Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body-sm: 15px;
  --leading-body-sm: 1.3;
  --text-body: 20px;
  --leading-body: 1.3;
  --text-body-lg: 21px;
  --leading-body-lg: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;

  /* Layout */
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-void: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-bone-white: #ffffff;
  --color-ash-gray: #888888;

  /* Typography */
  --font-akzidenz-grotesk: 'Akzidenz-Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body-sm: 15px;
  --leading-body-sm: 1.3;
  --text-body: 20px;
  --leading-body: 1.3;
  --text-body-lg: 21px;
  --leading-body-lg: 1.3;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
}
```
