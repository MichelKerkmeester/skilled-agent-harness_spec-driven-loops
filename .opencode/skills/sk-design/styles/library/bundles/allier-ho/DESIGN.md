# Allier Ho — Style Reference
> serif whisper on warm paper

**Theme:** light

Allier Ho is an editorial creative-portfolio system built like a quiet art monograph: a warm off-white canvas (#fcfcfc) holds deep black ink and two whisper-quiet chromatic accents — a dusty mauve (#6c5f7d) and a pale sage (#cee6cc) — used as hairline borders and occasional heading tints rather than as fills. The signature typographic move pairs Crimson Pro at weight 300 for display headlines (an anti-conventionally light serif that whispers instead of projects) with Azeret Mono for body and label text, producing a technical-editorial tone uncommon for agency portfolios. All interactive elements share a single 200px pill radius, reinforcing a tactile, button-as-pebble language, and imagery is dominated by full-bleed sculptural 3D renders and project photography that anchor the generous negative space. Density is compact in micro-typography (10px gaps, 12px labels) but breathes widely between sections, creating a gallery-walk rhythm rather than a scrolling-page rhythm.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Paper | `#fcfcfc` | `--color-warm-paper` | Page canvas, card surfaces, and nav background — the base layer everything sits on |
| Deep Ink | `#000000` | `--color-deep-ink` | Primary text, body copy, nav links, and dominant border color — the structural voice |
| Press Black | `#1c1c1c` | `--color-press-black` | Heading text and heavy borders — slightly softer than pure black for large display sizes |
| Charcoal Trace | `#262626` | `--color-charcoal-trace` | Secondary borders, dividers, and muted text on dark surfaces |
| Ash | `#a8a8a8` | `--color-ash` | Helper text, disabled states, and hairline borders on light surfaces |
| Dusty Mauve | `#6c5f7d` | `--color-dusty-mauve` | Accent panel backgrounds, heading color, and chromatic border — a near-gray purple that signals brand moments without shouting |
| Pale Sage | `#cee6cc` | `--color-pale-sage` | Secondary heading tint and accent border — a near-gray green that appears as quiet punctuation alongside the mauve |

## Tokens — Typography

### Crimson Pro — Display headlines at 44–50px, weight 300 with negative tracking. The anti-conventionally light serif whispers authority instead of projecting it; most agencies use 600–700 here, this restraint is the signature move. · `--font-crimson-pro`
- **Substitute:** Playfair Display, Lora, or system serif
- **Weights:** 300
- **Sizes:** 44px, 50px
- **Line height:** 0.95–1.15
- **Letter spacing:** -0.0340em, -0.0300em
- **Role:** Display headlines at 44–50px, weight 300 with negative tracking. The anti-conventionally light serif whispers authority instead of projecting it; most agencies use 600–700 here, this restraint is the signature move.

### Azeret Mono — Body copy, labels, and metadata at 12–18px. Monospace for a portfolio is a deliberate editorial choice — it reads as technical, precise, and un-decorative, contrasting the flowing serif headlines. · `--font-azeret-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or system monospace
- **Weights:** 400
- **Sizes:** 12px, 18px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.0100em
- **Role:** Body copy, labels, and metadata at 12–18px. Monospace for a portfolio is a deliberate editorial choice — it reads as technical, precise, and un-decorative, contrasting the flowing serif headlines.

### System Sans-Serif — Navigation links and micro-labels at 12px. Neutral utility voice that stays out of the way of the serif/mono dialogue. · `--font-system-sans-serif`
- **Substitute:** Inter, system-ui, or Helvetica Neue
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Navigation links and micro-labels at 12px. Neutral utility voice that stays out of the way of the serif/mono dialogue.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.12px | `--text-caption` |
| body | 18px | 1.2 | -0.18px | `--text-body` |
| heading | 44px | 1.15 | -1.5px | `--text-heading` |
| display | 50px | 0.95 | -1.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 200px |
| panels | 0px |
| buttons | 200px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 100px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Minimal Top Nav
**Role:** Site navigation bar

Full-width row, 20px vertical padding, warm paper background. Brand wordmark "ALLIER HO" left-aligned in 12px system sans uppercase; three nav links (WORK, ABOUT, PLAYGROUND) right-aligned, same type. No borders, no background fill, no shadow — pure typographic navigation.

### Pill Text Button
**Role:** Interactive button

200px border-radius (fully pill-shaped), 10px vertical / 18px horizontal padding. Transparent background, 1px black border (#000000), 12px system sans text in black. No fill state, no shadow — the pill outline is the entire visual identity. Examples: "LEARN MORE", "VIEW ALL WORK".

### Hero Overlay Panel
**Role:** Hero text block

Rectangular panel with dusty mauve (#6c5f7d) background, no radius, positioned over hero imagery. Contains Crimson Pro 44px weight 300 white headline. The only chromatic surface in the system — its presence is a signal that this is a brand-defining moment.

### Service List
**Role:** Metadata sidebar in hero

Left-aligned column of 12px Azeret Mono uppercase labels (SERVICE, ART DIRECTION, BRANDING, CONCEPT IDEATION/DEVELOPMENT, INTERACTION DESIGN) in dusty mauve (#6c5f7d). No bullet points, no dividers — vertical stack with 10px row gap.

### Section Heading
**Role:** Section title

Crimson Pro 44px weight 300, centered or left-aligned, deep black (#000000). Example: "See the latest & greatest" with the second clause in italic. Followed by a pill button centered below.

### Project Showcase Card
**Role:** Work portfolio entry

Full-bleed image (no border, no radius, no shadow) with 20px top padding for caption block below. Caption: 12px Azeret Mono uppercase project title in black, followed by category tag (BRAND, etc.) in 12px system sans. The image IS the component — text is secondary.

### Category Tag
**Role:** Project metadata label

Plain text, 12px system sans, uppercase, in muted gray (#a8a8a8). No background, no border, no radius — a typographic tag, not a visual chip.

### Footer Page Indicator
**Role:** Page position marker

Small number (e.g., "1") in bottom-left corner, 12px system sans, black. Minimal context indicator — a single character anchoring the page.

### Inline Text Link
**Role:** Body link

Body text with thin underline (1px black, 3px offset), no color change. The underline is the only affordance — no hover state decoration documented.

### Work Grid Row
**Role:** Two-column project layout

Two project showcase cards side by side, equal width, 10px column gap. Images are editorial crops — no rounded corners, no borders, no shadows. The grid edge-to-edge within the page max-width.

## Do's and Don'ts

### Do
- Use Crimson Pro at weight 300 for all display headlines between 44–50px with letter-spacing around -1.5px — the whisper-weight is the signature
- Set border-radius to 200px on all buttons and tags for the fully pill-shaped interactive language
- Use #fcfcfc as the sole page canvas — never introduce pure white (#ffffff) or cooler grays
- Apply #6c5f7d dusty mauve as the only chromatic surface fill, reserved for hero overlay panels and occasional heading tints
- Pair serif headlines with Azeret Mono body text — the mono/serif dialogue defines the editorial tone
- Keep section gaps at 100px and element gaps at 10px to maintain the gallery-walk rhythm
- Let imagery run edge-to-edge with no borders, radius, or shadow — the photograph or 3D render is the visual

### Don't
- Don't use Crimson Pro at weight 400 or heavier — the light weight is non-negotiable
- Don't add drop shadows, inner shadows, or glow effects to cards, buttons, or images — the system is flat
- Don't introduce additional accent colors beyond dusty mauve and pale sage — the palette is deliberately two-note
- Don't round corners on cards, panels, or images — only buttons and tags use radius
- Don't use a sans-serif for body copy — Azeret Mono is the body voice; sans-serif is reserved for nav and labels only
- Don't fill buttons with solid color — the pill outline on transparent background is the only button style
- Don't use system serif or serif substitutes for body — Crimson Pro is display-only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Warm Paper | `#fcfcfc` | Base page canvas and default card surface |
| 2 | Ash Mist | `#a8a8a8` | Subtle raised surface tint for inset panels or muted containers |
| 3 | Dusty Mauve Panel | `#6c5f7d` | Brand overlay panels (hero text block) — the only chromatic surface |
| 4 | Charcoal Plane | `#262626` | Dark surface for inverted sections or image overlays |

## Elevation

The system uses zero shadows and zero elevation. All depth is created through color contrast (warm paper vs deep ink), surface color shifts (#fcfcfc → #a8a8a8 → #6c5f7d → #262626), and typographic weight. Components are flat — they sit on the page like printed matter, not floating UI.

## Imagery

Imagery is the visual anchor: full-bleed 3D sculptural renders (organic, web-like, matte black forms) dominate the hero, while the work section uses editorial photography crops — billboard mockups, device screens, lifestyle environments. All imagery is borderless, radius-free, and runs edge-to-edge within its container. The 3D work reads as fine art sculpture, not product visualization. Photography is high-contrast, naturalistic, and often dark against light backgrounds. No illustrations, no icons in the traditional sense, no decorative graphics — the 3D renders serve the same role illustrations would in other portfolios.

## Layout

Full-bleed hero with the 3D sculpture centered and slightly right, the dusty mauve text panel overlapping the right third, and a vertical service list in the left margin. Navigation is a single thin row at the very top with brand left and three links right. The work section shifts to a centered two-column grid: large headline above, two equal-width project showcases below with 10px column gap. All sections use 100px vertical padding for gallery-walk breathing room. Page max-width is approximately 1280px, centered. No sidebar, no sticky header, no mega-menu — the layout is deliberately flat and scroll-driven.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #fcfcfc
- border: #1c1c1c or #a8a8a8
- accent: #6c5f7d (dusty mauve)
- secondary accent: #cee6cc (pale sage)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Create a hero overlay panel*: 320px wide rectangular block, background #6c5f7d, no border-radius, 40px padding. White Crimson Pro weight 300 at 44px, line-height 1.15, letter-spacing -1.5px. Below the headline, a pill outline button: 200px radius, 10px/18px padding, 1px #000000 border, transparent fill, 12px system sans black text reading "LEARN MORE".

2. *Create a section heading*: Centered Crimson Pro weight 300 at 44px, line-height 1.15, letter-spacing -1.5px, color #000000. Second clause in italic. Below at 40px gap, a centered pill outline button (same spec as above) with text "VIEW ALL WORK".

3. *Create a project showcase card*: Full-width image (no border, no radius, no shadow), 20px top padding, then a caption block: 12px Azeret Mono uppercase title in #000000, followed by 10px gap, 12px system sans category tag in #a8a8a8.

4. *Create the top navigation*: Full-width row, 20px vertical padding, background #fcfcfc. Left: "ALLIER HO" in 12px system sans uppercase, letter-spacing normal. Right: three links "WORK", "ABOUT", "PLAYGROUND" in same style, 40px gap between them. No borders, no background change on hover.

5. *Create a service list sidebar*: Vertical stack of 12px Azeret Mono uppercase labels, 10px row gap, color #6c5f7d. No bullets, no dividers, no borders. First item "SERVICE" slightly larger or in a different color as a section header.

## Similar Brands

- **Pentagram** — Same editorial white-canvas portfolio with minimal nav and large-scale imagery as the primary content
- **DIA Studio** — Shared restrained typographic palette with serif display + mono accents and dusty chromatic tints
- **Studio Function** — Both use pill-shaped outline buttons, warm off-white canvas, and generous section gaps for gallery rhythm
- **Locomotive** — Similar flat elevation philosophy, monochrome base with single near-gray accent, and full-bleed project photography
- **&Walsh** — Same agency-portfolio restraint: hairline borders, compact micro-typography, and serif/mono type pairing

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-paper: #fcfcfc;
  --color-deep-ink: #000000;
  --color-press-black: #1c1c1c;
  --color-charcoal-trace: #262626;
  --color-ash: #a8a8a8;
  --color-dusty-mauve: #6c5f7d;
  --color-pale-sage: #cee6cc;

  /* Typography — Font Families */
  --font-crimson-pro: 'Crimson Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-azeret-mono: 'Azeret Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: -0.18px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -1.5px;
  --text-display: 50px;
  --leading-display: 0.95;
  --tracking-display: -1.5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 100px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-full: 200px;

  /* Named Radii */
  --radius-tags: 200px;
  --radius-panels: 0px;
  --radius-buttons: 200px;

  /* Surfaces */
  --surface-warm-paper: #fcfcfc;
  --surface-ash-mist: #a8a8a8;
  --surface-dusty-mauve-panel: #6c5f7d;
  --surface-charcoal-plane: #262626;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-paper: #fcfcfc;
  --color-deep-ink: #000000;
  --color-press-black: #1c1c1c;
  --color-charcoal-trace: #262626;
  --color-ash: #a8a8a8;
  --color-dusty-mauve: #6c5f7d;
  --color-pale-sage: #cee6cc;

  /* Typography */
  --font-crimson-pro: 'Crimson Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-azeret-mono: 'Azeret Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: -0.18px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -1.5px;
  --text-display: 50px;
  --leading-display: 0.95;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-full: 200px;
}
```
