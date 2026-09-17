# DNCO — Style Reference
> editorial gallery on white linen.

**Theme:** light

DNCO operates on radical typographic restraint: a single sans-serif at a single weight (Neue Haas Unica Pro, 400) deployed across a 72px-to-16px scale, anchored on a near-achromatic palette of white, off-white, and pure black. The site reads like an editorial print spread — headlines breathe against generous whitespace, borders are whisper-thin hairlines (#e5e7eb), and the only color in the system comes from project photography, never from chrome or accent fills. Navigation and interactive elements are pill-shaped (9999px radius), text is always the interactive primitive, and the brand wordmark doubles as a full-bleed hero that inverts to black. Components are minimal, weightless, and border-driven rather than shadow-driven — the aesthetic is gallery catalogue, not SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, primary surface for content blocks, card bases |
| Hairline Mist | `#e5e7eb` | `--color-hairline-mist` | Hairline borders, dividers, subtle surface wash, filter chip backgrounds, image placeholder fill |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, brand wordmark fill, dark hero background, link text, heading color |
| Ash | `#a3a3a3` | `--color-ash` | Muted secondary text, captions, inactive filter labels, helper text |

## Tokens — Typography

### Neue Haas Unica Pro — Sole typeface for all UI — navigation, body, headlines, and brand wordmark. Weight 400 only, no bold or light variants; hierarchy is built purely through size and tracking rather than weight contrast. · `--font-neue-haas-unica-pro`
- **Substitute:** Inter, Neue Haas Grotesk, Helvetica Now, Untitled Sans
- **Weights:** 400
- **Sizes:** 16px, 18px, 22px, 72px
- **Line height:** 1.00–1.56
- **Letter spacing:** -0.025em across all sizes (tight tracking creates a refined, editorial density)
- **Role:** Sole typeface for all UI — navigation, body, headlines, and brand wordmark. Weight 400 only, no bold or light variants; hierarchy is built purely through size and tracking rather than weight contrast.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.5 | -0.4px | `--text-caption` |
| body | 18px | 1.56 | -0.45px | `--text-body` |
| subheading | 22px | 1.33 | -0.55px | `--text-subheading` |
| heading | 72px | 1 | -1.8px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| tags | 9999px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 64px
- **Card padding:** 0px
- **Element gap:** 24px

## Components

### Brand Wordmark Hero
**Role:** Signature full-bleed opener

Massive 'DNCO' logotype at ~72px+, white on pure black (#000000), fills the entire first viewport edge-to-edge with no padding or safe area. The wordmark is the hero — no headline, no subtext, no CTA. Acts as the brand's single most identifiable moment.

### Pill Navigation Bar
**Role:** Top-level site navigation

Horizontal text-only nav, 14px weight 400, 24px gap between items, floating on white. Active item marked by a small filled circle (•) beneath the label rather than color change. No background, no border, no logo lockup beyond the wordmark at far left.

### Editorial Headline
**Role:** Page-level statement copy

72px Neue Haas Unica Pro, weight 400, line-height 1.0, tracking -0.025em, color #000000. Sits flush-left at page edge with no max-width constraint. Two lines maximum, set tight and confident.

### Filter Chip Row
**Role:** Project categorization controls

Vertical stack of text labels (All, Sector, Location, Expertise) at 16px weight 400, #a3a3a3 for inactive items, #000000 for active. No background, no border, no chip shape — filters are typographic only, not buttons.

### Hairline Divider
**Role:** Visual section separation

1px solid #e5e7eb, full container width. The only structural divider in the system — replaces all spacing-only breaks and card borders.

### Project Image Tile
**Role:** Case study thumbnail in grid

Raw photographic image, no border, no radius, no shadow, no caption overlay. Aspect ratio is generous (landscape). Tiles are separated by whitespace alone, not by visible borders. Where an image is missing, a solid #e5e7eb fill takes its place.

### Filter Label Active Indicator
**Role:** Active state for filter chips

A 4px filled circle (#000000) rendered 4px below the active filter label. Sole indicator of state — no color change, underline, or weight shift.

### Text Link Inline
**Role:** In-content navigation / project titles

16–18px weight 400, color #000000, no underline by default, tracking -0.025em. Hover state not defined in data — assume underline appearance or color hold.

### Case Study Card (Grid Unit)
**Role:** Project entry on Work index

Image-only unit in a multi-column grid. No card chrome, no padding, no background — the photograph is the entire card. Spacing between tiles is achieved through container padding, not internal margin.

### Footer Text Block
**Role:** Site-level links and contact

Small text at 16px weight 400, #000000 or #a3a3a3, flush-left, minimal structure. No social icon row, no newsletter signup, no decorative elements — just contact and legal links.

## Do's and Don'ts

### Do
- Use Neue Haas Unica Pro (or Inter / Neue Haas Grotesk) at weight 400 exclusively — never introduce bold, medium, or light weights
- Set all type with letter-spacing -0.025em; tight tracking is non-negotiable for the editorial feel
- Use only #ffffff, #e5e7eb, #000000, and #a3a3a3 — no chromatic accents anywhere in the UI
- Build hierarchy through size jumps (16 → 18 → 22 → 72), not through weight or color shifts
- Separate sections with 1px #e5e7eb hairlines or generous whitespace, never with fills or shadows
- Make every interactive element a pill (9999px) or a text-only label — no filled buttons, no rounded cards, no bordered inputs
- Let photography carry all color; images bleed into the layout without frames, radii, or overlays

### Don't
- Do not add a second typeface family — the system is monotypographic by design
- Do not introduce any color other than the four neutrals — no brand red, blue, or accent green
- Do not use box-shadows or elevation on any component — depth comes from whitespace, not blur
- Do not add border-radius to cards or images — only navigation and chips use 9999px
- Do not bold or italicize text to create emphasis — increase size instead
- Do not place content inside bordered containers or filled panels — use whitespace to group
- Do not use background colors for buttons, tags, or interactive states — use text color and the dot indicator

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas White | `#ffffff` | Page background, primary content surface |
| 2 | Image Placeholder Mist | `#e5e7eb` | Solid fill behind loading or empty project tiles |
| 3 | Obsidian Invert | `#000000` | Hero/wordmark inversion — full-bleed black with white type |

## Imagery

Photography is the only source of color in the system. Project images are shot on location — outdoor environments, people in public spaces, architecture, transit, signage, urban textures. Treatment is natural-light, documentary-style, full-bleed, and uncropped: no duotone, no overlay, no border, no radius. Images are presented at large landscape aspect ratios (roughly 4:3 or 3:2) and arranged in generous grids where whitespace does the work of gutters. The first-viewport brand wordmark is set in pure white on black, creating a dramatic tonal pivot before the white gallery layout begins. No illustrations, no icons, no abstract graphics — the visual identity is carried entirely by the wordmark and the project photography.

## Layout

The page model is a wide single-column or 2-column grid with a generous max-width (~1400px) and flush-left alignment. The hero is a full-bleed black band dominated by the DNCO wordmark at extreme scale — no headline copy competes. Below the hero, the layout shifts to white with an editorial two-line headline flush-left at the page edge. Project work is presented as a multi-column image grid (2–3 columns) with no card chrome, separated by whitespace alone. Filter controls sit as a plain text list above the grid, not as a toolbar. Section rhythm is defined by hairline #e5e7eb dividers and 64px vertical gaps rather than by alternating background bands. Navigation is a minimal top bar with pill-radius text links and a tiny dot indicator for the active route.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border / divider: #e5e7eb
- muted text: #a3a3a3
- dark surface (hero inversion): #000000
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Brand wordmark hero*: Full-bleed black (#000000) section, edge-to-edge. The text 'DNCO' set in Neue Haas Unica Pro (or Inter) at 72px+, weight 400, color #ffffff, letter-spacing -0.025em, flush-left with no padding offset. No other elements on the screen.

2. *Editorial page headline*: 72px Neue Haas Unica Pro, weight 400, line-height 1.0, tracking -0.025em, color #000000, flush-left at the page edge over a #ffffff background. No max-width constraint.

3. *Pill navigation bar*: Horizontal row of text links at 16px weight 400, color #000000, gap 24px, over a #ffffff background. Active item is marked by a 4px black filled circle positioned 4px below the label — no background fill, no border, no weight change. Top-left wordmark 'DNCO' at 16px weight 400.

4. *Filter label group*: Vertical stack of four text labels (All, Sector, Location, Expertise) at 16px weight 400. Inactive items in #a3a3a3, active item in #000000 with a 4px black dot 4px below the label. No chip background, no border.

5. *Project image grid*: Two or three equal columns of uncropped landscape photography, no borders, no radius, no captions overlaid. Tiles separated only by container padding (24px gap). Missing images render as a solid #e5e7eb fill block at the same aspect ratio.

## Elevation Philosophy

The system has zero elevation. No component uses box-shadow, drop-shadow, or blur. Depth is created exclusively through: (1) whitespace between elements, (2) 1px #e5e7eb hairline dividers, and (3) the single full-bleed black inversion that breaks the otherwise all-white canvas. Never add shadows to cards, buttons, modals, or popovers — if a component appears to need depth, it should be flattened against the surface instead.

## Similar Brands

- **Pentagram** — Same editorial restraint — a single neutral canvas, a single typeface, typographic navigation, and photography as the sole color source
- **Werkplaats** — Dutch design-agency aesthetic with generous whitespace, monotypographic system, and pill-shaped nav on a white surface
- **Anagrama** — Wordmark-as-hero opener, achromatic palette, grid of large uncropped project photography, minimal text chrome
- **Apt Studio** — Gallery-like presentation of place-based work, white background, hairline dividers, no decorative UI elements
- **Made Thought** — Brand-agency site language: massive headlines in a single weight, near-zero color, project photography bleeding into a clean grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-hairline-mist: #e5e7eb;
  --color-obsidian: #000000;
  --color-ash: #a3a3a3;

  /* Typography — Font Families */
  --font-neue-haas-unica-pro: 'Neue Haas Unica Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: -0.4px;
  --text-body: 18px;
  --leading-body: 1.56;
  --tracking-body: -0.45px;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.55px;
  --text-heading: 72px;
  --leading-heading: 1;
  --tracking-heading: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 64px;
  --card-padding: 0px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas-white: #ffffff;
  --surface-image-placeholder-mist: #e5e7eb;
  --surface-obsidian-invert: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-hairline-mist: #e5e7eb;
  --color-obsidian: #000000;
  --color-ash: #a3a3a3;

  /* Typography */
  --font-neue-haas-unica-pro: 'Neue Haas Unica Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: -0.4px;
  --text-body: 18px;
  --leading-body: 1.56;
  --tracking-body: -0.45px;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.55px;
  --text-heading: 72px;
  --leading-heading: 1;
  --tracking-heading: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
