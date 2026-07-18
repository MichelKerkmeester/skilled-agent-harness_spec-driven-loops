# Josephmark — Style Reference
> Midnight editorial gallery. Monochrome walls, warm spotlights, oversized grotesque typography floating in negative space.

**Theme:** dark

Josephmark operates as a midnight editorial gallery for digital craftsmanship: dark-dominant canvases, oversized Scto Grotesk set tight with aggressive negative tracking, and an almost entirely achromatic palette where a single warm taupe (#a9a498) acts as the only chromatic relief. The system prizes restraint over decoration — flat surfaces, hairline borders, pill-shaped buttons, zero shadows, and text that does the heavy lifting through scale and weight rather than color. Screens alternate between deep charcoal stages and cream-paper inserts, creating a rhythm of dark void and quiet warmth. Content is allowed to be loud (the case study artwork, the orange RCA piece, the Walking Dead illustration) while the chrome around it stays nearly invisible — a museum wall, not a website chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Black | `#000000` | `--color-carbon-black` | Primary dark canvas — hero backgrounds, full-bleed section stages, base for the editorial atmosphere |
| Pure White | `#ffffff` | `--color-pure-white` | Inverse text on dark canvases, form field backgrounds, button text on filled dark elements |
| Stone Taupe | `#a9a498` | `--color-stone-taupe` | The system's sole warm chromatic note — muted link states, secondary surface tints, paper-like card backgrounds that soften the black-to-gray transitions |
| Bone Cream | `#f4f5ef` | `--color-bone-cream` | Warm off-white surface — secondary card and panel backgrounds, breaks the clinical feel of pure white and echoes the studio's paper-based brand collateral |
| Mist Gray | `#e5e7eb` | `--color-mist-gray` | Hairline borders, dividers, list separators, subtle structural lines — the 999-occurrence border color that defines spatial relationships without visual weight |
| Graphite | `#666666` | `--color-graphite` | Mid-tone text — secondary headings, supporting copy, metadata that needs presence without competing with primary type |
| Forest Ink | `#4e5449` | `--color-forest-ink` | Body text on light surfaces — a desaturated dark olive that reads warmer than pure black, the only hue-leaning neutral in the system |

## Tokens — Typography

### Scto Grotesk A — The sole typeface — a custom neo-grotesque used for everything from 70px display headlines down to 12px captions. Weight 300 carries display and large headings (a deliberate anti-convention choice — most agency sites use bold for impact; Josephmark whispers with light). Weight 400 for body, 500 reserved for emphasis and interactive elements. The consistent aggressive negative tracking (-0.019em to -0.035em) tightens the grotesque's natural apertures, creating a compressed, editorial density even at body sizes. · `--font-scto-grotesk-a`
- **Substitute:** Inter (weight 300/400/500), Space Grotesk, or Söhne if licensed
- **Weights:** 300, 400, 500
- **Sizes:** 12, 14, 16, 19, 20, 28, 36, 70
- **Line height:** 1.10, 1.20, 1.25, 1.38, 1.40, 1.50
- **Letter spacing:** -0.035em at 70px display → -0.030em at 36px → -0.027em at 28px → -0.025em at 19-20px → -0.020em at 16px → -0.019em at 12-14px
- **Role:** The sole typeface — a custom neo-grotesque used for everything from 70px display headlines down to 12px captions. Weight 300 carries display and large headings (a deliberate anti-convention choice — most agency sites use bold for impact; Josephmark whispers with light). Weight 400 for body, 500 reserved for emphasis and interactive elements. The consistent aggressive negative tracking (-0.019em to -0.035em) tightens the grotesque's natural apertures, creating a compressed, editorial density even at body sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.23px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.28px | `--text-body-sm` |
| body | 16px | 1.38 | -0.32px | `--text-body` |
| subheading | 20px | 1.25 | -0.5px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.76px | `--text-heading-sm` |
| heading | 36px | 1.2 | -1.08px | `--text-heading` |
| display | 70px | 1.1 | -2.45px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |

### Layout

- **Section gap:** 64-96px
- **Card padding:** 16-24px
- **Element gap:** 16px

## Components

### Editorial Hero
**Role:** Full-bleed dark opening section with oversized headline

#000000 background spanning full viewport. Display headline at 70px, weight 300, color #ffffff, letter-spacing -2.45px, line-height 1.10. Generous top/bottom padding (64-96px). Navigation floats in a single row at the top with 28-32px padding.

### Minimal Nav Bar
**Role:** Transparent top navigation

Full-width, transparent over the dark canvas. Wordmark 'Josephmark' left-aligned in 12-14px Scto Grotesk weight 500, color #ffffff. 'Menu' text link right-aligned at same size and weight. No background, no border, no logo mark — just two pieces of text floating in the void.

### Pill Text Button
**Role:** Primary interactive element

Fully rounded with 9999px border-radius. Padding 8px 16px or 8px 20px. Border 1px solid #e5e7eb on dark backgrounds or #000000 on light. Text at 14px weight 500, letter-spacing -0.28px. Transparent fill — the pill is defined by its border, not its background. This is the only interactive component shape in the system.

### Project Showcase Card
**Role:** Case study entry in grid

Full-bleed or 2-column grid tile on #000000 background. Large project artwork/image fills the card. Project name overlaid below at 16-20px weight 400, color #ffffff, letter-spacing -0.32 to -0.5px. No border, no radius, no shadow — the image IS the card surface.

### Cream Content Insert
**Role:** Warm light section breaking the dark rhythm

Background #f4f5ef with sharp 0px corners. Contains product photography or printed collateral. Headings at 28-36px weight 300, color #000000. Body at 16px weight 400, color #4e5449. The warm cream creates a paper-like quality that echoes physical design deliverables.

### Arrow Link
**Role:** Directional text link with chevron icon

Text at 16-20px weight 400 or 500, color #ffffff on dark or #000000 on light, with a right-pointing chevron (» or →). No underline. Letter-spacing -0.32 to -0.5px. The chevron sits inline after the text with ~8px gap.

### Section Heading
**Role:** Editorial sub-section title

28-36px weight 300, color #ffffff on dark surfaces or #000000 on light. Line-height 1.20, letter-spacing -0.76 to -1.08px. Generous margin-bottom of 40px. Left-aligned, full-width within its container.

### Body Text Block
**Role:** Paragraph and supporting copy

16px weight 400, line-height 1.38, letter-spacing -0.32px. Color #ffffff on dark sections, #4e5449 on light/cream surfaces, #666666 for secondary/supporting copy. Max-width implied by reading measure; no enforced container.

### Horizontal Divider
**Role:** Structural separator between content blocks

1px solid #e5e7eb line. Full-width or contained. The 999-frequency border color makes this the system's primary spatial delineation tool — it defines where one thing ends and another begins without any visual ceremony.

### Menu Toggle
**Role:** Full-screen navigation overlay

When activated, covers the viewport with #000000 or #f4f5ef. Large nav links at 36-70px weight 300, centered or left-aligned, with generous vertical spacing (24-40px between items). Closes via the same 'Menu' text in the top nav.

## Do's and Don'ts

### Do
- Use Scto Grotesk A at weight 300 for all display and heading sizes — the light weight is the signature, not a fallback
- Apply negative letter-spacing consistently: -0.035em at display (70px), scaling proportionally to -0.019em at caption (12px)
- Build with full-bleed sections, not contained max-width layouts — let the dark canvas extend to the viewport edges
- Use #000000 and #f4f5ef as the two primary canvas colors, alternating between them for section rhythm
- Define interactive elements with 1px borders and 9999px radius — the pill shape is the only button form
- Set body text at 16px/1.38 with #ffffff on dark and #4e5449 on light surfaces
- Separate content blocks with 1px #e5e7eb hairlines, never with shadows or background fills

### Don't
- Do not introduce color beyond the single warm taupe (#a9a498) — the system's power comes from its 1% colorfulness
- Do not add shadows, glows, or any drop effects — this system is rigorously flat
- Do not use rounded corners on cards, images, or containers — only buttons are rounded (to 9999px)
- Do not center text — everything is left-aligned, following editorial column logic
- Do not use bold weights (600+) for emphasis — the scale goes 300 → 400 → 500, and contrast comes from size and color, not weight
- Do not add icon systems or decorative graphics — typography and photography are the only visual elements
- Do not use #ffffff as a section background — it appears only as surface within forms and as text color on dark

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Full-bleed dark canvas for hero, editorial sections, and project showcases |
| 1 | Bone | `#f4f5ef` | Warm secondary surface — case study inserts, lighter content blocks |
| 2 | Paper | `#ffffff` | Light form surfaces, input fields, micro-cards |

## Elevation

Zero elevation. No shadows, no drop effects, no blur. The system achieves spatial hierarchy through color contrast (dark vs. cream), generous whitespace, and hairline borders — never through simulated depth. This is a flat, editorial, print-derived visual logic where layers exist in sequence, not in z-axis.

## Imagery

Imagery is content, not chrome. The system's own visual language is pure typography on flat color — no decorative graphics, no abstract patterns, no icon systems. When imagery appears, it's always project artwork: photography of printed materials (cash-flow reports, magazines), digital design work (RCA Records, The Walking Dead), and brand collateral. The case study images are vivid and full-color (orange, green, illustrations) — the surrounding system is deliberately monochrome so the project work reads as the only colorful thing in the room. Photography treatment: natural lighting, product-focused, no filters or duotones. Images are presented full-bleed within their containers with no rounded corners or masking.

## Layout

Full-bleed, edge-to-edge layout with no max-width container. Navigation is a single row of two text elements floating over the void. Hero sections span the full viewport with display headlines left-aligned. The page alternates between black stages and warm cream inserts, creating a rhythm of darkness interrupted by paper-like warmth. Content is left-aligned throughout, never centered. Project showcases appear in 2-column grids on dark backgrounds. The layout is deliberately architectural — large blocks of solid color define spatial zones rather than cards or floating elements. Density is spacious: 64-96px section padding, 40px between heading and body, giving every element room to breathe.

## Agent Prompt Guide

**Quick Color Reference**
- text (on dark): #ffffff
- text (on light): #4e5449
- text (secondary): #666666
- background (primary dark): #000000
- background (warm light): #f4f5ef
- border: #e5e7eb
- accent: #a9a498
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a full-bleed hero section: #000000 background, padding-top 96px, padding-bottom 64px. Display headline at 70px, Scto Grotesk weight 300, #ffffff, letter-spacing -2.45px, line-height 1.10. Left-aligned, no max-width.

2. Create a project showcase card: no border, no radius, no shadow. Full-bleed image fills the card on #000000 background. Project title at 20px weight 400, #ffffff, letter-spacing -0.5px, positioned below the image with 16px gap.

3. Create a cream content insert: #f4f5ef background, 0px radius, padding 64px. Section heading at 36px weight 300, #000000, letter-spacing -1.08px. Body text at 16px weight 400, #4e5449, line-height 1.38. Product image right-aligned with no border.

4. Create a pill text button: 9999px border-radius, 1px solid #e5e7eb border, transparent fill, padding 8px 20px. Text at 14px weight 500, #ffffff, letter-spacing -0.28px. On dark backgrounds only.

5. Create a full-screen menu overlay: covers viewport with #000000. Nav links stacked vertically at 70px weight 300, #ffffff, letter-spacing -2.45px, with 40px vertical gap between items. Left-aligned with 28px padding.

## Color Philosophy

The palette is deliberately impoverished — seven colors total, six of them achromatic or near-achromatic. This scarcity is the system: when a studio's work is bold, colorful, and inventive (RCA Records, Walking Dead), the website itself must recede. The only chromatic accent is #a9a498, a warm taupe that appears in just two contexts: as a subtle link color and as a rare secondary surface tint. It exists to prevent the system from feeling clinical or sterile — a human warmth in the machine. Every other color decision is about value contrast: #000000 against #f4f5ef, #000000 against #ffffff, #e5e7eb as the quietest possible structural line.

## Typography Philosophy

Scto Grotesk A is custom — designed by Schick Toikka specifically for Josephmark. The system's typographic attitude comes from three choices: (1) weight 300 for display, which is anti-convention and forces the design to rely on scale and tracking rather than boldness for hierarchy; (2) aggressive negative tracking across the entire scale, from -0.019em at 12px to -0.035em at 70px, which compresses the grotesque's natural letterforms into a dense, editorial rhythm; (3) a line-height of 1.10 on the largest display size, meaning the headline almost touches itself — the type fills its container with no air, creating urgency and presence. There is no secondary typeface, no monospace, no serif. One family, one voice.

## Similar Brands

- **Manual (manual.co)** — Same dark-canvas editorial approach with oversized light-weight grotesque typography and minimal navigation
- **Resn (resn.co.nz)** — Full-bleed dark sections alternating with warm content areas, project showcase grids, zero decorative chrome
- **Locomotive (locomotive.ca)** — Monochrome system where project artwork provides all the color, generous whitespace, editorial typographic scale
- **Pentagram (pentagram.com)** — Grid-based project showcase on dark canvas, left-aligned display type, hairline structural elements
- **Active Theory (activetheory.net)** — Dark-dominant agency portfolio with pill-shaped text buttons and flat, borderless card surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-black: #000000;
  --color-pure-white: #ffffff;
  --color-stone-taupe: #a9a498;
  --color-bone-cream: #f4f5ef;
  --color-mist-gray: #e5e7eb;
  --color-graphite: #666666;
  --color-forest-ink: #4e5449;

  /* Typography — Font Families */
  --font-scto-grotesk-a: 'Scto Grotesk A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.23px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.76px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -1.08px;
  --text-display: 70px;
  --leading-display: 1.1;
  --tracking-display: -2.45px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Layout */
  --section-gap: 64-96px;
  --card-padding: 16-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-bone: #f4f5ef;
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-black: #000000;
  --color-pure-white: #ffffff;
  --color-stone-taupe: #a9a498;
  --color-bone-cream: #f4f5ef;
  --color-mist-gray: #e5e7eb;
  --color-graphite: #666666;
  --color-forest-ink: #4e5449;

  /* Typography */
  --font-scto-grotesk-a: 'Scto Grotesk A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.23px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.76px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -1.08px;
  --text-display: 70px;
  --leading-display: 1.1;
  --tracking-display: -2.45px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
