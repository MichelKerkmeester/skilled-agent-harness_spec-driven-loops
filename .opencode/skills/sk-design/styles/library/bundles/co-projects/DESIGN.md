# Co Projects — Style Reference
> black geometric sculpture on white void. Massive circular forms carved from a pure white gallery wall, where the only type is whisper-weight 400 and the only accent is the void between things.

**Theme:** light

Co Projects operates as a geometric art gallery translated into web form: a pure white void interrupted by massive black circular forms, a single hairline gray for structural rules, and two weight-400 typefaces doing all the communication. The system rejects almost every contemporary UI convention — no shadows, no gradients, no color, no rounded rectangles, no bold weights, no icons. What remains is raw figure/ground contrast at architectural scale: tiny 16px nav labels float in the corners while 60px display text and viewport-spanning black rings dominate the canvas. Spacing is museum-generous, with 139–208px gaps between major elements creating room to breathe that most product interfaces would call wasteful. The visual language trusts that shape, scale, and negative space carry the brand harder than any color system could.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, background of all surfaces, inner counter of the ring forms — the negative space that gives the black marks their mass |
| Graphite Ink | `#000000` | `--color-graphite-ink` | Primary mark fill, text, and the large circular ring forms. The sole chromatic-payload element in the system |
| Fog Hairline | `#e5e7eb` | `--color-fog-hairline` | Hairline borders, structural dividers, and subtle separator rules at 1px. The only gray in the palette and it never fills — it only divides |

## Tokens — Typography

### Alpha — Primary face for nav, body, and display. Used at 16px for navigation labels and links (lineHeight 1.50), 29px for mid-scale headings, and 60px for the display headline (lineHeight 1.00 — headline sits tight on its baseline). The signature move is running 60px display text at weight 400, which reads as architectural line-drawing rather than shouted headline · `--font-alpha`
- **Substitute:** Inter, Söhne, GT America
- **Weights:** 400
- **Sizes:** 16px, 29px, 60px
- **Line height:** 1.00, 1.10, 1.50
- **Role:** Primary face for nav, body, and display. Used at 16px for navigation labels and links (lineHeight 1.50), 29px for mid-scale headings, and 60px for the display headline (lineHeight 1.00 — headline sits tight on its baseline). The signature move is running 60px display text at weight 400, which reads as architectural line-drawing rather than shouted headline

### Takt — Secondary face for body copy and 36px subheadings. Tight lineHeight (1.10–1.11) at all sizes gives it a compact, editorial-block feel — runs in long stacked paragraphs where Alpha would feel too austere. Weight 400 is the ONLY weight in the entire system · `--font-takt`
- **Substitute:** Söhne, Neue Haas Grotesk, Helvetica Now
- **Weights:** 400
- **Sizes:** 16px, 36px
- **Line height:** 1.10, 1.11
- **Role:** Secondary face for body copy and 36px subheadings. Tight lineHeight (1.10–1.11) at all sizes gives it a compact, editorial-block feel — runs in long stacked paragraphs where Alpha would feel too austere. Weight 400 is the ONLY weight in the entire system

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.5 | — | `--text-body` |
| heading-sm | 29px | 1.1 | — | `--text-heading-sm` |
| heading | 36px | 1.1 | — | `--text-heading` |
| display | 60px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 32 | 32px | `--spacing-32` |
| 96 | 96px | `--spacing-96` |
| 208 | 208px | `--spacing-208` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| shapes | 50% |
| buttons | 0px |

### Layout

- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Sparse Top Navigation
**Role:** Primary site navigation

Three text links absolutely positioned across the top edge: brand mark at far left, primary nav item in the center-left, and a secondary link at far right. Uses Alpha at 16px / weight 400, color #000000, sitting on the bare #ffffff canvas with no background, no border, no padding. The nav occupies less than 2% of the viewport vertically — deliberately negligible so the hero geometry dominates.

### Geometric Ring Hero
**Role:** Brand-defining visual composition

Two massive black ring/donut forms rendered in #000000 fill, each approximately 60-70% of viewport height in diameter, with stroke width roughly 25-30% of the outer radius. The inner counter reveals #ffffff. Positioned to dominate the full viewport width, with the rings partially cropped at the page edges. No border-radius because the geometry is already circular — the shape IS the radius. This component is the brand identity rendered at architectural scale.

### Display Headline Block
**Role:** Primary text statement on hero

Alpha font at 60px / weight 400 / lineHeight 1.00, color #000000. The tight lineHeight makes multi-line headlines stack as a solid rectangular mass rather than airy text. No letter-spacing manipulation — sits at default tracking. Positioned with generous margin (139-208px from viewport edges) to feel placed rather than centered.

### Subhead Text Block
**Role:** Secondary descriptive copy

Takt font at 36px / weight 400 / lineHeight 1.11, color #000000. Runs as stacked paragraph blocks under display headlines. The tight 1.11 lineHeight creates a dense editorial column. Left-aligned with no decorative treatment — the type itself is the visual element.

### Hairline Divider
**Role:** Structural section separator

1px solid #e5e7eb rule spanning the full content width or the full viewport. The only use of the gray tone in the system. No padding, no margin above/below except to define section rhythm. Functions as the only architectural detail in an otherwise bare composition.

### Text-Link Nav Item
**Role:** Inline navigation element

Alpha or Takt at 16px / weight 400, color #000000, no underline, no background, no padding. Inline with surrounding text or spaced across the top bar. Hover state is the only interactive feedback and it should stay minimal — a subtle color shift or underline appearance, never a fill or transform.

### Body Paragraph
**Role:** Long-form descriptive text

Takt at 16px / weight 400 / lineHeight 1.50, color #000000. Runs in single-column blocks with no max-width constraint beyond the content flow. Generous paragraph spacing (32px column-gap) between blocks. The 1.50 lineHeight on Takt is the most relaxed setting in the type system, creating readable editorial rhythm.

### Image Placeholder Counter
**Role:** Visual break / negative space element

The white inner circle of a ring form, or a standalone white circular cutout within a black field. Functions as a 'hole' in the composition that draws the eye and gives the black geometry its meaning. Pure #ffffff — no border, no shadow, no texture.

## Do's and Don'ts

### Do
- Use only the three palette colors: #ffffff for canvas, #000000 for ink and geometric fills, #e5e7eb exclusively for 1px hairline dividers
- Set all type to weight 400 — never bold, never medium, never light. The system has exactly one weight and that constraint is the brand
- Apply 139-208px vertical margins between major sections to maintain gallery-scale breathing room
- Let geometric ring/circle forms occupy 50-70% of the viewport to create the architectural scale contrast with 16px nav text
- Use Alpha at 60px / lineHeight 1.00 for display headlines and Takt at 36px / lineHeight 1.11 for subhead blocks
- Position navigation as three sparse text labels at the top corners — no bar, no background, no border
- Set border-radius to 0 on all rectangular elements; reserve all rounding for intentional circular geometry

### Don't
- Never add a shadow, blur, or elevation effect — the system is completely flat and any depth cue breaks the figure/ground purity
- Never introduce a color outside the three achromatic tokens — no accent hues, no tinted grays, no hover-state colors beyond opacity shifts
- Never use a font weight other than 400 — no 500, 600, 700, or 800 under any circumstance
- Never apply border-radius to buttons, cards, tags, or inputs — rectangular means sharp corners, always
- Never constrain the hero composition to a max-width container — let the geometric forms run full-bleed and crop at viewport edges
- Never add icons, illustrations, photography, or decorative graphics — the circle/ring IS the imagery
- Never use letter-spacing adjustment — all type sits at default tracking, the custom typefaces are already tuned

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | The default white background filling the entire viewport |
| 1 | Divider Rule | `#e5e7eb` | Hairline structural separator — separates sections, frames regions, and provides the only non-ink/non-paper tone in the system |
| 2 | Ink Mark | `#000000` | Full-bleed black geometric mass — the ring forms, text glyphs, and nav labels sit on this layer |

## Elevation

The system is deliberately elevation-free. No element casts a shadow, no surface lifts above another, no overlay dims the page beneath. Depth is implied exclusively through scale and figure/ground — a massive black ring reads as forward even though it sits flush on the same z-plane as the white canvas. Adding shadow would collapse the architectural purity that defines the aesthetic.

## Imagery

The visual language is zero photography, zero illustration, zero product screenshots, zero icons. Imagery consists exclusively of geometric forms — large black rings/donuts, full circles, and the white negative-space counters within them. These circular forms operate as both brand mark and content placeholder: they can represent a project, a concept, a link target, or simply structural punctuation. No gradients, no textures, no duotones, no masking. The circle is the only visual vocabulary.

## Layout

Full-bleed, unconstrained layout with no max-width container and no centered grid system. The hero occupies the entire first viewport with massive black ring forms cropped at the page edges, and the navigation is a row of three absolutely-positioned 16px text links at the top corners. Below the hero, content sections stack vertically with 139-208px vertical gaps, separated only by #e5e7eb 1px hairlines. Each section is a single full-width band — no column splits, no card grids, no sidebar. The page reads as a sequence of horizontal gallery rooms, each with one geometric or typographic statement, connected by hairline rules and vast white space. Navigation is minimal top-bar text only — no sticky header, no hamburger, no footer chrome.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border: #e5e7eb (1px hairline only)
- accent: #000000 (black is the accent in a monochrome system)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a full-bleed hero section: #ffffff background, no max-width constraint. A massive black ring (#000000 fill, outer diameter ~70% viewport height, inner counter ~40% diameter revealing #ffffff) positioned to crop at both left and right viewport edges. Display headline in Alpha at 60px / weight 400 / lineHeight 1.00, color #000000, positioned 139px from top edge.

2. Create a sparse top navigation: three text links in Alpha at 16px / weight 400 / lineHeight 1.50, color #000000. First link at top-left (0px, 0px), second at top-center, third at top-right. No background, no border, no padding, no underline. Sits as floating text on bare white canvas.

3. Create a subhead text block: Takt font at 36px / weight 400 / lineHeight 1.11, color #000000. Left-aligned paragraph block, no max-width constraint beyond natural reading flow, 32px gap above and below to neighboring elements.

4. Create a section divider: a single 1px solid #e5e7eb rule spanning the full viewport width, with 96-139px vertical margin above and below. No other styling — the hairline is the entire component.

5. Create a body paragraph: Takt at 16px / weight 400 / lineHeight 1.50, color #000000. Single-column block, left-aligned, 32px column-gap between successive paragraphs. No border, no background, no indent.

## Similar Brands

- **Bureau Cool** — Same radical achromatic palette, custom type at single weight, and architectural-scale geometric forms on pure white canvas
- **Pentagram (minimal project pages)** — Identical commitment to white space, hairline rules, and letting a single typographic or geometric gesture carry the entire page
- **Studio Dumbar (editorial case studies)** — Same weight-400-only typography and the discipline of using scale and negative space where other studios would add color or imagery
- **Andu Mtx** — Near-identical black-on-white brutalist approach with massive geometric shapes and whisper-weight type at huge sizes
- **Vercel (brand site, not product)** — Same full-bleed layout philosophy and trust in monochrome + scale over decoration, though Vercel allows itself subtle gradients

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-graphite-ink: #000000;
  --color-fog-hairline: #e5e7eb;

  /* Typography — Font Families */
  --font-alpha: 'Alpha', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-takt: 'Takt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.1;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-display: 60px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-32: 32px;
  --spacing-96: 96px;
  --spacing-208: 208px;

  /* Layout */
  --card-padding: 32px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-shapes: 50%;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-divider-rule: #e5e7eb;
  --surface-ink-mark: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-graphite-ink: #000000;
  --color-fog-hairline: #e5e7eb;

  /* Typography */
  --font-alpha: 'Alpha', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-takt: 'Takt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.1;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-display: 60px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-32: 32px;
  --spacing-96: 96px;
  --spacing-208: 208px;
}
```
