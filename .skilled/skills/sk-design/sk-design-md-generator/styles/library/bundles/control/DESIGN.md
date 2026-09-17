# Control — Style Reference
> Editorial Swiss grid meets creative tool

**Theme:** light

Control operates as an editorial design tool: white canvas, hard black borders, and a near-monochrome palette punctured by vivid green, orange, and yellow accents that feel like editorial highlighter marks. The signature is a brutalist typographic contrast — massive Melange display type (71–146px) at near-zero tracking set against tiny uppercase Favorit Mono labels (9–10px) with tight negative letter-spacing. Every surface is flat; depth comes from black border outlines (1–2px), not shadows. The aesthetic reads like a Swiss editorial spread rebuilt for software: grid-anchored, unapologetically geometric, and confident in its asymmetry.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, structural borders, and outline contours that define all surface edges |
| Paper | `#ffffff` | `--color-paper` | Page canvas, inverted text on dark surfaces, and button labels on green fills |
| Gridline | `#d2d2d2` | `--color-gridline` | Subtle dividers and light borders on secondary surfaces |
| Slate | `#3d3d3d` | `--color-slate` | Secondary text and muted UI elements |
| Smoke | `#c6c6c0` | `--color-smoke` | Mid-tier borders and inactive form strokes |
| Fog | `#babab9` | `--color-fog` | Hairline borders and tertiary dividers |
| Ash | `#acaca6` | `--color-ash` | Faint outlines and placeholder chrome |
| Graphite | `#606060` | `--color-graphite` | Deemphasized body text and metadata |
| Stone | `#828282` | `--color-stone` | Tertiary captions and disabled states |
| Concrete | `#7a7a7a` | `--color-concrete` | Disabled button surfaces |
| Bone | `#f5f5f4` | `--color-bone` | Card surfaces and elevated panel backgrounds — one shade off white |
| Voltage Green | `#01ea40` | `--color-voltage-green` | Primary action buttons, active states, and live UI feedback — saturated green on black-and-white canvas reads as switched-on electricity |
| Ember Orange | `#ff5c02` | `--color-ember-orange` | Orange action color for filled buttons, selected navigation states, and focused conversion moments |
| Highlighter Yellow | `#ffdb4d` | `--color-highlighter-yellow` | Decorative borders, selection marks, and editorial accent strokes — never used as fill |

## Tokens — Typography

### Melange — Display and headline type. Set at extreme sizes (71–146px) with aggressive negative tracking (-0.05 to -0.058em). The medium weight is deliberate — heavy enough to anchor, not so heavy it shouts. Brings editorial magazine energy; no system sans substitutes this · `--font-melange`
- **Substitute:** GT Sectra Display, Canela, or Editorial New
- **Weights:** 500
- **Sizes:** 16px, 25px, 36px, 71px, 146px
- **Line height:** 1.01–1.52
- **Letter spacing:** -0.0580em, -0.0550em, -0.0510em, -0.0500em, -0.0370em, -0.0240em, -0.0170em, 0.0070em
- **Role:** Display and headline type. Set at extreme sizes (71–146px) with aggressive negative tracking (-0.05 to -0.058em). The medium weight is deliberate — heavy enough to anchor, not so heavy it shouts. Brings editorial magazine energy; no system sans substitutes this

### Favorit Mono — Micro-labels, UI chrome, and metadata. Tiny uppercase tracking at -0.03 to -0.037em creates Swiss editorial caption feel. Line-heights stretch to 2.4 for dense vertical stacks. Always set small — this is a caption font, never a body font · `--font-favorit-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 9px, 10px, 16px
- **Line height:** 1.20–2.40
- **Letter spacing:** -0.0370em, -0.0300em, 0.0200em
- **Role:** Micro-labels, UI chrome, and metadata. Tiny uppercase tracking at -0.03 to -0.037em creates Swiss editorial caption feel. Line-heights stretch to 2.4 for dense vertical stacks. Always set small — this is a caption font, never a body font

### Arial — Fallback system body text. Likely a detection artifact; real product body is handled by the headline and mono systems. Treat as last-resort stack · `--font-arial`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Fallback system body text. Likely a detection artifact; real product body is handled by the headline and mono systems. Treat as last-resort stack

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.52 | -0.37px | `--text-body` |
| subheading | 25px | 1.2 | -0.58px | `--text-subheading` |
| heading | 36px | 1.07 | -1.84px | `--text-heading` |
| heading-lg | 71px | 1.06 | -3.55px | `--text-heading-lg` |
| display | 146px | 1.01 | -8.47px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 15 | 15px | `--spacing-15` |

### Border Radius

| Element | Value |
|---------|-------|
| full | 273px |
| cards | 8px |
| pills | 80px |
| buttons | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 15px

## Components

### Green Action Button
**Role:** Primary call-to-action for Start, Submit, and Continue

Filled #01ea40 green background, 0px border, 40px border-radius (fully pill-shaped). Label in Favorit Mono 10px uppercase, #000000, letter-spacing -0.03em. Padding roughly 12px 20px. High-contrast green-on-black-white canvas reads as an activated state — press me

### Ghost Nav Link
**Role:** Top-level navigation items (Tutorials, Pricing, Login)

No background or border. Text in #000000, Arial 16px. Generous horizontal padding. Underline only on hover. Inset 40px from logo left, social links inset 40px from right edge

### Editorial Display Headline
**Role:** Hero and section-level typographic anchors

Melange 500 at 71–146px, line-height 1.01–1.07, letter-spacing -0.05 to -0.058em. Color #000000. Single-sentence or two-line left-aligned stacks. No drop shadow, no gradient — pure flat ink on paper

### Mono Caption Label
**Role:** Subheadlines, helper text, and editorial micro-copy

Favorit Mono 400 at 9–10px, uppercase, letter-spacing -0.03em. Color #000000. Line-height stretches to 2.2–2.4 for readable multi-line stacks. Looks like Swiss design system annotations

### Outline Card
**Role:** Product showcase frames and canvas containers

8px border-radius, 1–2px #000000 border, #ffffff or #f5f5f4 fill. No shadow. Tight padding (15–24px). Sometimes overlaid on a visible grid pattern to communicate the drawing-surface metaphor

### Tool Toolbar (In-Product)
**Role:** Bottom dock for design controls

Horizontal strip, #000000 background, rounded 8px. Mono icons in #01ea40 and #ffdb4d. Slider values and labels in Favorit Mono 9px. Sits absolutely positioned at bottom of canvas

### Status Pill
**Role:** Cookie/consent banner labels and inline status markers

80–273px pill radius. #000000 background with #ffffff text. Tiny mono label (9px) inline. Used to flag passive notifications without breaking the editorial grid

### Grid Canvas Frame
**Role:** In-product drawing surface wrapper

Large bordered viewport, 8px radius, 1–2px #000000 stroke. Internal grid of fine #d2d2d2 or #babab9 lines (roughly 8–16px cells). Fills most of the viewport width; the grid IS the texture — no additional backgrounds

### Social Link Mono Tag
**Role:** External social links (Insta, X, Discord) in header

Plain text in #000000, Arial 16px. No icon, no border. Right-aligned cluster, 40px inset from edge. Clean typographic labels beat logos here

### Body Paragraph
**Role:** Long-form descriptions and supporting copy

Arial or system sans 16px, line-height 1.5–1.6, color #000000 or #606060. Max width ~480–560px for comfortable reading. Always left-aligned. Follows a mono caption label that sets context

## Do's and Don'ts

### Do
- Use Melange at 71–146px for every primary headline — never below 36px. The type needs room to breathe or it loses its editorial authority
- Set all UI labels in Favorit Mono 9–10px uppercase with -0.03em letter-spacing. Larger mono sizes break the caption rhythm
- Use #01ea40 sparingly — one primary action per screen. Additional green usage reads as noise
- Default card radius to 8px and button radius to 40px (full pill). Never mix mid-range radii like 16px or 24px
- Lean on 1–2px black borders for surface definition instead of shadows. Shadows don't belong in this system
- Keep section gaps generous (80–120px). The editorial cadence depends on air between content blocks
- Pair every product screenshot with a visible grid texture — the tool's drawing-surface metaphor should never be hidden

### Don't
- Don't use more than two vivid colors on a single screen — green for action, one accent for emphasis. Orange and yellow compete if both appear as fills
- Don't set Melange below 25px. At small sizes the tight tracking becomes illegible
- Don't introduce drop shadows, glows, or blur effects. Depth comes from borders and flat color blocks only
- Don't use the system Arial stack for hero text. Reserve it for fallback body copy only
- Don't center-align body paragraphs — the editorial grid is strictly left-anchored
- Don't add gradient fills to any UI element. The palette is deliberately flat
- Don't use color-coded semantic states (green=success, red=error). The system is editorial, not dashboard — communicate state with typography and borders instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Primary page canvas |
| 1 | Bone | `#f5f5f4` | Card and elevated panel backgrounds |
| 2 | Obsidian | `#000000` | Inverted surfaces (toolbars, status pills) |

## Imagery

Product screenshots dominate over photography and illustration. Imagery is always shown inside a visible grid frame to communicate the drawing-surface metaphor. No lifestyle photography, no abstract illustration. Inside the product, bright editorial photography (people, magazine covers) appears as canvas content with vivid color overlays. Icon style is monoline mono — thin strokes, single-weight, no color fills. All visuals serve the tool, not the marketing — you see the canvas, not a polished render.

## Layout

Max-width 1200px centered container with generous left/right padding. Hero is a left-aligned editorial stack: small mono caption label, massive Melange headline (two lines), supporting mono paragraph, then a full-width bordered canvas preview sitting below the fold. Navigation is a single thin top bar: logo far left, primary nav center-left (40px inset), social links far right (40px inset). Section rhythm is strictly left-anchored, single-column stacks alternating with full-bleed product previews. No multi-column feature grids — the layout is magazine-like, not dashboard-like. Vertical spacing is generous (80–120px between sections) to let the typographic contrast do the work.

## Agent Prompt Guide

**Quick Color Reference**
- Primary text: #000000
- Page background: #ffffff
- Card surface: #f5f5f4
- Border / outline: #000000 (1–2px)
- primary action: #ff5c02 (filled action)
- Secondary accent: #ff5c02 (used inside product UI)

**Example Component Prompts**

1. Create a Primary Action Button: #ff5c02 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Build an outline product card: 8px border-radius, 2px solid #000000 border, #f5f5f4 fill, 24px padding. No shadow. Inside, a 16:9 image area with the same border and radius. Caption below in Favorit Mono 9px, uppercase, letter-spacing -0.03em.

3. Build a top navigation bar: 100% width, 1px solid #000000 bottom border, 80px height, white background. Logo wordmark in Melange 500 at 25px, 40px left padding. Center nav links in Arial 16px black. Right cluster of social links (Insta, X, Discord) in Arial 16px, 40px right padding.

4. Build a grid canvas frame: 8px border-radius, 1px solid #000000 border, white fill, 800px wide. Internal pattern of fine #d2d2d2 vertical and horizontal lines at 16px intervals. Optional bottom toolbar: 8px radius, 1px black border, #000000 fill, 32px height, with mono icons in #01ea40 and yellow tool marks.

5. Build a status pill: 273px border-radius (full pill), #000000 background, 8px 16px padding. Label in Favorit Mono 9px, uppercase, letter-spacing -0.03em, color #ffffff.

## Similar Brands

- **Linear** — Editorial mono labels paired with massive tight-tracked display type and a near-monochrome palette with a single vivid accent
- **Vercel** — Brutalist black borders defining all surfaces, zero shadows, and confident typographic hierarchy over flat color blocks
- **Readymag** — Creative-tool marketing that uses Swiss-grid layout, generous whitespace, and product screenshots inside bordered frames to show the canvas itself
- **Framer** — Editorial hero typography (oversized display) with restrained palette and full-bleed product previews replacing feature lists

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-gridline: #d2d2d2;
  --color-slate: #3d3d3d;
  --color-smoke: #c6c6c0;
  --color-fog: #babab9;
  --color-ash: #acaca6;
  --color-graphite: #606060;
  --color-stone: #828282;
  --color-concrete: #7a7a7a;
  --color-bone: #f5f5f4;
  --color-voltage-green: #01ea40;
  --color-ember-orange: #ff5c02;
  --color-highlighter-yellow: #ffdb4d;

  /* Typography — Font Families */
  --font-melange: 'Melange', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-mono: 'Favorit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.52;
  --tracking-body: -0.37px;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.58px;
  --text-heading: 36px;
  --leading-heading: 1.07;
  --tracking-heading: -1.84px;
  --text-heading-lg: 71px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -3.55px;
  --text-display: 146px;
  --leading-display: 1.01;
  --tracking-display: -8.47px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-15: 15px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 40px;
  --radius-full: 80px;
  --radius-full-2: 273px;

  /* Named Radii */
  --radius-full: 273px;
  --radius-cards: 8px;
  --radius-pills: 80px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-bone: #f5f5f4;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-gridline: #d2d2d2;
  --color-slate: #3d3d3d;
  --color-smoke: #c6c6c0;
  --color-fog: #babab9;
  --color-ash: #acaca6;
  --color-graphite: #606060;
  --color-stone: #828282;
  --color-concrete: #7a7a7a;
  --color-bone: #f5f5f4;
  --color-voltage-green: #01ea40;
  --color-ember-orange: #ff5c02;
  --color-highlighter-yellow: #ffdb4d;

  /* Typography */
  --font-melange: 'Melange', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-favorit-mono: 'Favorit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.52;
  --tracking-body: -0.37px;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.58px;
  --text-heading: 36px;
  --leading-heading: 1.07;
  --tracking-heading: -1.84px;
  --text-heading-lg: 71px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -3.55px;
  --text-display: 146px;
  --leading-display: 1.01;
  --tracking-display: -8.47px;

  /* Spacing */
  --spacing-15: 15px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 40px;
  --radius-full: 80px;
  --radius-full-2: 273px;
}
```
