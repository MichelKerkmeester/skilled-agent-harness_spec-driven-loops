# Bibliothèque — Style Reference
> Black-cube gallery under spotlight — a single illuminated plate in a vast dark room.

**Theme:** dark

Bibliothèque operates as a black-cube gallery aesthetic: the entire interface is a dark void (#000000) where only white hairline type and centered photographic plates exist. The only brand mark is a small white serif 'B.' tucked in the top-left corner. Components feel like museum vitrines — thin white rules, generous negative space, no fills, no shadows, no gradients, and no chromatic accent of any kind. Typography is a single weight (400) of a custom neo-grotesque at an extreme binary scale: 12–18px functional text against an isolated 80px display. The visual system is fundamentally about restraint and curation — every UI element should feel like it could be removed and the page would not lose meaning.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Page canvas, card surfaces, footer — the universal background. Cards do not lift from the canvas; they are demarcated only by hairline white borders |
| Gallery White | `#ffffff` | `--color-gallery-white` | Body text, headings, nav marks, hairline borders, link underlines, list dividers — the sole foreground. Used as 1px structural lines rather than fills |

## Tokens — Typography

### Unica77 LL — The entire interface speaks in a single weight of one custom neo-grotesque. Weight 400 only — no bold, no light, no italic. The signature is the binary scale: 12–18px functional metadata against an isolated 80px display, with nothing in between. This extreme jump is the hierarchy. · `--font-unica77-ll`
- **Substitute:** Inter (400) or Neue Haas Grotesk Display (40/45)
- **Weights:** 400
- **Sizes:** 12px, 14px, 18px, 80px
- **Line height:** 1.00 (display), 1.20 (body), 1.22 (body), 1.33 (body)
- **Letter spacing:** normal across all sizes
- **Role:** The entire interface speaks in a single weight of one custom neo-grotesque. Weight 400 only — no bold, no light, no italic. The signature is the binary scale: 12–18px functional metadata against an isolated 80px display, with nothing in between. This extreme jump is the hierarchy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.33 | — | `--text-body-sm` |
| body | 18px | 1.22 | — | `--text-body` |
| display | 80px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 34 | 34px | `--spacing-34` |
| 38 | 38px | `--spacing-38` |
| 59 | 59px | `--spacing-59` |
| 80 | 80px | `--spacing-80` |
| 162 | 162px | `--spacing-162` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 900px
- **Section gap:** 30px
- **Card padding:** 20px
- **Element gap:** 5px

## Components

### Brand Mark
**Role:** Site identity anchor

White 'B.' monogram in the top-left corner, set in Unica77 LL 400 at ~14px, color #ffffff on #000000. The only persistent UI element. No wordmark, no tagline.

### Image Card
**Role:** Primary content unit — a single photograph in a vitrine

Photographic content centered on the #000000 canvas with generous margin (~120px+ vertical). No card chrome, no border, no shadow. The image's edges are the only boundary.

### Hairline-Bordered Card
**Role:** Secondary content container for text or metadata

Transparent interior on #000000 canvas, 1px solid #ffffff border, 0px border-radius, 20px padding. Functions as a drawn frame, not a lifted surface.

### List Item
**Role:** Sequenced content rows (catalog, index, archive)

1px solid #ffffff bottom border, 0px border-radius, 4–5px vertical padding, 18px padding-left. Text in Unica77 LL 400 at 14–18px #ffffff. The border is the structure.

### Text Link
**Role:** Inline navigation or reference

Unica77 LL 400 14–18px #ffffff with 1px solid #ffffff border-bottom acting as an underline. No color change, no bold, no fill — the underline is the affordance.

### Nav Bar
**Role:** Minimal site-level navigation

Top-edge strip on #000000, 15–20px horizontal padding, white text at 14px. No background fill, no border, no sticky treatment visible. The brand mark sits alone to the left.

### Input Field
**Role:** Search or form entry

Transparent background on #000000, 1px solid #ffffff border, 0px radius, Unica77 LL 400 14px #ffffff text. No focus ring color shift — focus may intensify the border to 2px or remain static.

### Footer
**Role:** Closing structural element

Full-width #000000 band, white hairline 1px top border, Unica77 LL 400 12–14px #ffffff text. Matches the list-item and link language — border defines the edge.

### Display Heading
**Role:** Section or page title

Unica77 LL 400 80px #ffffff, line-height 1.0, letter-spacing normal. Sits alone in the void with ~30px+ margin. No decoration, no underline, no accent.

## Do's and Don'ts

### Do
- Use only #ffffff and #000000 — no chromatic accent exists in the system
- Set all text in Unica77 LL weight 400 — never introduce bold, light, or italic
- Use 1px solid #ffffff borders for all structural separation — cards, inputs, list items, footers
- Maintain the binary type scale: 12–18px for functional text, 80px for display, nothing in between
- Center primary content on the canvas with 120px+ vertical breathing room above and below
- Use 0px border-radius everywhere — sharp corners are part of the gallery language
- Let the image be the hero — surround it with negative space rather than UI chrome

### Don't
- Do not introduce any color beyond #ffffff and #000000
- Do not use shadows, gradients, or glows — the canvas is flat and must stay flat
- Do not add border-radius to cards, buttons, or images — corners stay sharp
- Do not use font-weight above 400 or any typographic emphasis (bold, italic, uppercase tracking tricks)
- Do not fill buttons or tags with color — the system has no filled components
- Do not use intermediate type sizes (24, 32, 48, 64px) — jump directly from 18 to 80
- Do not add hover color shifts, focus glows, or animated state changes — affordance comes from structure, not color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Ink Black | `#000000` | Universal canvas — pages, cards, inputs, footer, nav all sit on this single level |

## Elevation

Elevation is deliberately absent. Surfaces do not lift — they are defined by 1px white hairlines or by negative space alone. The design operates on a single plane: #000000. This is the flatest possible interface and the flatness IS the brand.

## Imagery

Imagery is the content itself — large, centered, uncropped photographs function as the primary page unit, treated like plates hung in a gallery wall. Images sit with sharp edges (no border-radius), surrounded by vast black margin. No overlays, no text on top of images, no image grids or thumbnails. The visual ratio is overwhelmingly text-dominant negative space with one or two image moments per page.

## Layout

Max-width ~900px centered on a full-bleed #000000 canvas. The hero is a single large image or a display heading at 80px, centered both axes, with 120px+ of vertical padding above and below. Content stacks vertically in a single column — no multi-column grids, no sidebars, no asymmetric compositions. Sections are separated by whitespace alone rather than dividers or alternating bands. Navigation is a minimal top bar with a single brand mark and no menu chrome. The rhythm is: void → content → void.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- border: 1px solid #ffffff
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a centered image hero: #000000 canvas, a single photograph at max-width 900px, sharp 0px corners, 120px top and bottom padding. Below the image, a white 1px hairline divider, then 30px gap, then Unica77 LL 400 80px #ffffff display heading with line-height 1.0.

2. Create a list/index page: #000000 canvas, max-width 900px centered. Each list item is Unica77 LL 400 18px #ffffff text with 5px padding-bottom and 4px padding-top, separated by 1px solid #ffffff bottom border. 30px gap between items.

3. Create a text link: Unica77 LL 400 14px #ffffff with 1px solid #ffffff border-bottom. No fill, no color change on hover, no bold.

4. Create an input field: transparent background on #000000, 1px solid #ffffff border, 0px radius, 20px horizontal padding, Unica77 LL 400 14px #ffffff placeholder and text. No visible focus ring color shift.

5. Create a footer: full-width #000000, 1px solid #ffffff top border, 20px vertical padding, Unica77 LL 400 12px #ffffff text centered.

## Similar Brands

- **Are.na** — Same black-canvas minimalism with white hairline type and single-weight neo-grotesque — the interface recedes to let content lead
- **David Zwirner online exhibitions** — Gallery-vitrine language: full-bleed black, one large centered image, white type, zero UI chrome
- **It's Nice That** — Editorial restraint with monochrome palette and hairline structural rules framing content
- **Document Journal** — Black-on-white / white-on-black flip with a single display weight and no chromatic accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-gallery-white: #ffffff;

  /* Typography — Font Families */
  --font-unica77-ll: 'Unica77 LL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.33;
  --text-body: 18px;
  --leading-body: 1.22;
  --text-display: 80px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-38: 38px;
  --spacing-59: 59px;
  --spacing-80: 80px;
  --spacing-162: 162px;

  /* Layout */
  --page-max-width: 900px;
  --section-gap: 30px;
  --card-padding: 20px;
  --element-gap: 5px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-ink-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-gallery-white: #ffffff;

  /* Typography */
  --font-unica77-ll: 'Unica77 LL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.33;
  --text-body: 18px;
  --leading-body: 1.22;
  --text-display: 80px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-38: 38px;
  --spacing-59: 59px;
  --spacing-80: 80px;
  --spacing-162: 162px;
}
```
