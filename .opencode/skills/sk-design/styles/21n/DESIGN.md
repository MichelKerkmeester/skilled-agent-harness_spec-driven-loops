# 21n — Style Reference
> Open atlas under pale daylight — a spacious, light-mode canvas where knowledge tools feel weightless against a single charcoal anchor.

**Theme:** light

Memotron is a whisper-quiet, light-mode knowledge workspace built on a near-monochrome neutral stack — pure white canvas, cool off-white surfaces, and a single hairline border gray carry the entire visual system. The only filled button variant is charcoal-dark, which makes the single primary action feel weighty and deliberate against an otherwise weightless interface. Two accent hues (vivid green and vivid blue) appear only as functional punctuation — icons, link states, decorative strokes — never as backgrounds or large fills. Typography is humanist (Sen) with a dramatic scale jump to 56px display, giving headlines atlas-scale presence. The system is flat and border-driven: 12.5px surfaces and #e5e7eb hairlines create structure, with zero shadows or gradients.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Snow | `#ffffff` | `--color-snow` | Primary canvas — page backgrounds, card surfaces, button text on dark fills |
| Fog | `#f9f9fb` | `--color-fog` | First surface layer above canvas — subtle alternating sections, soft elevated cards |
| Mist | `#eff0f6` | `--color-mist` | Cool card surface — slightly bluer than fog, used for inset panels and secondary cards |
| Silver | `#e5e7eb` | `--color-silver` | Hairline borders, dividers, and 1px structural lines — the system's primary separator color |
| Charcoal | `#333333` | `--color-charcoal` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Graphite | `#545454` | `--color-graphite` | Secondary text, subdued button borders, and metadata — sits between primary text and muted gray |
| Smoke | `#767676` | `--color-smoke` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Ash | `#808080` | `--color-ash` | Disabled and inactive states — lowest-priority neutral for de-emphasized text and icons |
| Emerald Pulse | `#24b26d` | `--color-emerald-pulse` | Green supporting accent for decorative details and low-frequency emphasis |
| Cobalt Signal | `#2c70dd` | `--color-cobalt-signal` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Sen — Display and body — humanist sans-serif with warm proportions and open apertures, the sole typeface in the system. Weight 400 carries body text, 500–600 for UI controls and subheadings, 700 reserved for the 56px display headline where it provides atlas-scale presence without resorting to a separate display face. · `--font-sen`
- **Substitute:** Inter, DM Sans, or Source Sans 3
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13px, 15px, 16px, 17px, 19px, 22px, 36px, 44px, 56px
- **Line height:** 1.07 (display) → 2.21 (loose body)
- **Role:** Display and body — humanist sans-serif with warm proportions and open apertures, the sole typeface in the system. Weight 400 carries body text, 500–600 for UI controls and subheadings, 700 reserved for the 56px display headline where it provides atlas-scale presence without resorting to a separate display face.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 20 | — | `--text-caption` |
| body-sm | 15px | 23 | — | `--text-body-sm` |
| body-lg | 17px | 26 | — | `--text-body-lg` |
| subheading | 19px | 33 | — | `--text-subheading` |
| heading-sm | 22px | 33 | — | `--text-heading-sm` |
| heading | 36px | 54 | — | `--text-heading` |
| heading-lg | 44px | 55 | — | `--text-heading-lg` |
| display | 56px | 60 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 13 | 13px | `--spacing-13` |
| 17 | 17px | `--spacing-17` |
| 21 | 21px | `--spacing-21` |
| 25 | 25px | `--spacing-25` |
| 29 | 29px | `--spacing-29` |
| 33 | 33px | `--spacing-33` |
| 38 | 38px | `--spacing-38` |
| 50 | 50px | `--spacing-50` |
| 67 | 67px | `--spacing-67` |
| 84 | 84px | `--spacing-84` |
| 90 | 90px | `--spacing-90` |
| 95 | 95px | `--spacing-95` |
| 134 | 134px | `--spacing-134` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| links | 6px |
| buttons | 12px or 9999px (pill) |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 17-25px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Persistent site navigation

Horizontal bar with logo left, center nav links (Resources dropdown, Pricing, Compare, Extension, Discord), and dark pill button right. Height ~60px, white background, 1px #e5e7eb bottom border. Nav links at 15px Sen 500, #333. Dropdown indicated by chevron icon.

### Charcoal Pill Button
**Role:** Primary navigation action — the system's only filled button variant

Dark filled button, #333333 background, white text, 9999px border-radius (fully pill). 16px Sen 600, 8px 20px padding. Used for the single 'Go to web app' action in the header. No hover shadow — the button's weight comes from the dark fill against the white canvas, not from elevation.

### Ghost Download Button
**Role:** Secondary action with platform hint

Outlined pill button with small Apple icon prefix, text 'Download for Mac' at 15px Sen 500, #333. 1px #545454 border, 9999px radius, transparent background. 10px 20px padding. Sits centered in the hero below the headline.

### Nav Link Item
**Role:** Text-only navigation entry

15px Sen 500, #333, no underline by default. Hover state shifts to Cobalt Signal (#2c70dd). Resources includes a chevron-down icon to indicate dropdown. 17px horizontal spacing between links.

### Hero Headline
**Role:** Page-level display heading

56px Sen 700, #333, line-height 1.07, centered. Dramatic scale jump from 17px body to 56px display creates atlas-scale presence. Single-line or tight two-line treatment.

### Hero Subtitle
**Role:** Supporting description text below headline

19px Sen 400, #545454, centered, line-height 1.75. Sits 17px below the headline. Generous line-height creates breathing room around the dense body copy.

### Product Showcase Frame
**Role:** Multi-device product visual

Centered frame containing three overlapping device mockups (tablet, laptop, phone) on a soft warm cream background (#f9f9fb with wave illustration). No shadow on the frame — the cream canvas creates the separation. 12.5px radius on the cream background. Play button overlay centered on the laptop screen.

### Vertical Side Label
**Role:** Section anchor text on page edges

Rotated 90° text at the far left ('21n') and far right ('Products') of the page. 13px Sen 500, #767676. Acts as a section index rather than navigation — fixed-position or per-section, aligned to the viewport edge.

### Hairline Section Divider
**Role:** Structural separator between content sections

1px solid #e5e7eb line, full width or content-width. No vertical padding on the line itself — sections use 80-100px vertical gap above and below. The divider is invisible in many sections, only appearing where two surfaces of similar brightness need separation.

### Wave Illustration Decoration
**Role:** Atmorphic background graphic

Thin curved line illustrations in soft coral/red and warm gray tones, rendered as overlapping sine-wave patterns. Full-bleed behind the product showcase section, masked by the cream background container. No fill colors — stroke-only at ~1px, 40% opacity.

### Feature Content Card
**Role:** Content container for feature blocks

White or #f9f9fb surface, 12.5px border-radius, 1px #e5e7eb border, 17-25px padding. No shadow. Optional inner content uses 19-22px Sen headings and 16px body. Cards stack in 2- or 3-column grids with 33px gap.

### Availability Caption
**Role:** Small platform-availability note below download CTA

15px Sen 400, #767676, centered. 'Available as web, chrome extension, iOS and macOS apps.' No icon, no link styling — pure muted text.

## Do's and Don'ts

### Do
- Use #333333 (Charcoal) exclusively for the single filled button variant — never introduce a chromatic fill for primary actions
- Set all borders to 1px solid #e5e7eb (Silver) — hairline structure is the system's primary separator
- Use 9999px border-radius for pill buttons and tags, 12px for cards and surfaces, 6px for inline links
- Reserve #24b26d (Emerald Pulse) and #2c70dd (Cobalt Signal) for icons, link states, and small functional accents — never as surface fills or large background blocks
- Follow the type scale strictly: 13/15/16/17/19/22/36/44/56 — the 56px display jump is the system's signature scale gesture
- Use #f9f9fb (Fog) and #eff0f6 (Mist) for surface layering instead of shadows to imply depth
- Keep element gaps at 8px and section gaps at 80-100px to maintain the atlas-scale breathing room

### Don't
- Do not introduce drop shadows, glows, or blur effects — the system is intentionally flat
- Do not use gradients on buttons, cards, or backgrounds — the palette is pure solid color
- Do not call #2c70dd or #24b26d a CTA or primary action color — they are accent hues only
- Do not add a chromatic background fill to any button — Charcoal #333 is the only filled button color
- Do not use letter-spacing adjustments on Sen — the typeface ships with normal tracking across all sizes
- Do not use #545454 (Graphite) for body text — reserve it for secondary metadata and button borders; primary text is always #333
- Do not introduce a second display font — Sen carries from 13px caption to 56px display with no substitution

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Snow Canvas | `#ffffff` | Base page background — the dominant surface |
| 1 | Fog Section | `#f9f9fb` | First elevated section band — subtle alternation |
| 2 | Mist Card | `#eff0f6` | Card and inset panel surface — cool-tinted elevation |
| 3 | Silver Border | `#e5e7eb` | Structural hairline — the primary separator |
| 4 | Charcoal Anchor | `#333333` | Dark button and inverse text — the only heavy surface |

## Elevation

The system is intentionally shadow-free. Structure comes from hairline #e5e7eb borders, 12.5px surface rounding, and surface-layer contrast (#ffffff → #f9f9fb → #eff0f6) rather than from drop shadows. Depth is implied through cool-tinted off-whites stacking against pure white, not through elevation. This keeps the interface flat, fast, and atlas-like — no visual weight that would compete with the product content.

## Imagery

Product-device mockups (tablet, laptop, phone) are the primary visual — three overlapping screens showing the actual app interface, arranged on a warm cream canvas. The product UI itself is the hero imagery. Supporting graphics are thin stroke-only wave illustrations in soft coral and warm gray, rendered as overlapping sine curves at ~40% opacity. Photography is entirely absent — no lifestyle shots, no stock imagery, no team photos. Icons are mono-weight, small-scale, and appear inline with text rather than as standalone decoration. The visual density is low: large expanses of white space punctuated by the single product showcase frame.

## Layout

Centered max-width container at 1200px, with full-bleed sections inside it. The hero is a centered text stack (headline → subtitle → download button → availability caption) over a subtle cream/wave background. Vertical side labels ('21n' left, 'Products' right) sit at the viewport edges, rotated 90°, acting as section anchors. Sections flow seamlessly with hairline #e5e7eb dividers rather than alternating background bands. The product showcase section uses a centered frame with overlapping device mockups. Navigation is a fixed top bar with logo left, center links, and dark pill button right. Content grids are 2- or 3-column with 33px gaps. Vertical rhythm is generous — 80-100px between sections — giving the interface an open-atlas feel.

## Agent Prompt Guide

**Quick Color Reference**
- text: #333333 (Charcoal)
- background: #ffffff (Snow)
- surface: #f9f9fb (Fog) / #eff0f6 (Mist)
- border: #e5e7eb (Silver)
- accent: #2c70dd (Cobalt Signal) and #24b26d (Emerald Pulse) — icons and link states only
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Charcoal Pill Button**: Create a filled pill button with #333333 background, white text at 16px Sen 600, 8px 20px padding, 9999px border-radius, no border, no shadow. Text: 'Go to web app'.

2. **Ghost Download Button**: Create an outlined pill button with transparent background, 1px #545454 border, 9999px radius, 10px 20px padding. Left-aligned Apple icon in #333, text 'Download for Mac' at 15px Sen 500 in #333.

3. **Hero Headline + Subtitle**: Centered text stack. Headline 'Your memory atlas' at 56px Sen 700, #333, line-height 1.07. Subtitle below at 19px Sen 400, #545454, line-height 1.75, 17px gap from headline.

4. **Feature Content Card**: White surface, 12px border-radius, 1px #e5e7eb border, 25px padding, no shadow. Heading at 22px Sen 600 #333, body text at 16px Sen 400 #545454, 8px gap between heading and body.

5. **Vertical Side Label**: Text rotated 90°, 13px Sen 500, #767676, positioned at the far left edge of the viewport. No background, no border — pure typographic anchor.

## Accent Color Discipline

The green (#24b26d) and blue (#2c70dd) accents follow a strict rule: they appear only at sizes ≤ 24px and only on icons, link underlines, small badges, or decorative strokes. They never fill a button, card, or section background. This discipline keeps the system monochrome at scale — when you zoom out, the page is white, gray, and charcoal; the accents are only visible up close as functional punctuation. Violating this rule (e.g., a green section background or blue CTA) breaks the system's whisper-quiet character.

## Surface Layering Without Shadows

Depth is communicated through a four-layer surface stack: #ffffff (base canvas) → #f9f9fb (section band) → #eff0f6 (card/panel) → #e5e7eb (border/separator). Each layer is a subtle step cooler or grayer than the one below. Cards never need shadows because the surface tint shift provides enough visual separation. When a design needs more emphasis, the solution is a cooler surface tint, not a darker shadow.

## Similar Brands

- **Notion** — Same airy, light-mode knowledge-tool aesthetic with generous whitespace, humanist sans-serif typography, and a near-monochrome palette accented by small functional color
- **Capacities** — Similar light-mode productivity tool with flat surfaces, hairline borders, and a single dark button variant against an otherwise white canvas
- **Reflect** — Same whisper-quiet light-mode notes app with minimal chromatic palette and border-driven structure rather than shadow-based elevation
- **Tana** — Similar airy, structured knowledge tool with humanist sans-serif type and a calm, atlas-like spatial rhythm between content sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-snow: #ffffff;
  --color-fog: #f9f9fb;
  --color-mist: #eff0f6;
  --color-silver: #e5e7eb;
  --color-charcoal: #333333;
  --color-graphite: #545454;
  --color-smoke: #767676;
  --color-ash: #808080;
  --color-emerald-pulse: #24b26d;
  --color-cobalt-signal: #2c70dd;

  /* Typography — Font Families */
  --font-sen: 'Sen', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 20;
  --text-body-sm: 15px;
  --leading-body-sm: 23;
  --text-body-lg: 17px;
  --leading-body-lg: 26;
  --text-subheading: 19px;
  --leading-subheading: 33;
  --text-heading-sm: 22px;
  --leading-heading-sm: 33;
  --text-heading: 36px;
  --leading-heading: 54;
  --text-heading-lg: 44px;
  --leading-heading-lg: 55;
  --text-display: 56px;
  --leading-display: 60;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-33: 33px;
  --spacing-38: 38px;
  --spacing-50: 50px;
  --spacing-67: 67px;
  --spacing-84: 84px;
  --spacing-90: 90px;
  --spacing-95: 95px;
  --spacing-134: 134px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 17-25px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6.26325px;
  --radius-xl: 12.5265px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-links: 6px;
  --radius-buttons: 12px or 9999px (pill);

  /* Surfaces */
  --surface-snow-canvas: #ffffff;
  --surface-fog-section: #f9f9fb;
  --surface-mist-card: #eff0f6;
  --surface-silver-border: #e5e7eb;
  --surface-charcoal-anchor: #333333;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-snow: #ffffff;
  --color-fog: #f9f9fb;
  --color-mist: #eff0f6;
  --color-silver: #e5e7eb;
  --color-charcoal: #333333;
  --color-graphite: #545454;
  --color-smoke: #767676;
  --color-ash: #808080;
  --color-emerald-pulse: #24b26d;
  --color-cobalt-signal: #2c70dd;

  /* Typography */
  --font-sen: 'Sen', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 20;
  --text-body-sm: 15px;
  --leading-body-sm: 23;
  --text-body-lg: 17px;
  --leading-body-lg: 26;
  --text-subheading: 19px;
  --leading-subheading: 33;
  --text-heading-sm: 22px;
  --leading-heading-sm: 33;
  --text-heading: 36px;
  --leading-heading: 54;
  --text-heading-lg: 44px;
  --leading-heading-lg: 55;
  --text-display: 56px;
  --leading-display: 60;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-33: 33px;
  --spacing-38: 38px;
  --spacing-50: 50px;
  --spacing-67: 67px;
  --spacing-84: 84px;
  --spacing-90: 90px;
  --spacing-95: 95px;
  --spacing-134: 134px;

  /* Border Radius */
  --radius-md: 6.26325px;
  --radius-xl: 12.5265px;
  --radius-full: 9999px;
}
```
