# PORTO ROCHA — Style Reference
> white-walled design library

**Theme:** light

Porto Rocha is an editorial design system dressed in a gallery wall aesthetic: near-total monochrome, surgical use of one Apple-blue accent for links, and typography that behaves like a printed monograph. The interface is structurally two-column — a fixed left rail of agency metadata and project index, and a wide content field of image-led cards arranged in a three-column grid. Surfaces are flat white with hairline gray borders; elevation is communicated through stacking and whitespace, never shadows. The single blue accent (#007aff) is reserved for interactive text and active states, creating a restrained system where color only appears when something is actionable or linked. The design reads as anti-decorative: no gradients, no rounded buttons, no illustrations — content and photography carry every screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Body text, headings, nav borders, card borders, button borders |
| Ash Gray | `#808080` | `--color-ash-gray` | Secondary text, card borders, nav dividers, muted metadata |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, sidebar background |
| System Blue | `#007aff` | `--color-system-blue` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### SF Pro Display — Display and heading weight — used for article titles, section headers, and the 'PORTO ROCHA' wordmark. The unusual +0.02em positive letter-spacing on display type (most sites use negative tracking on large sizes) creates a slightly more open, editorial cadence rather than a tight display feel. · `--font-sf-pro-display`
- **Substitute:** Inter, Helvetica Neue, system-ui
- **Weights:** 400
- **Sizes:** 23px and up
- **Line height:** 1.17
- **Letter spacing:** 0.02em
- **Role:** Display and heading weight — used for article titles, section headers, and the 'PORTO ROCHA' wordmark. The unusual +0.02em positive letter-spacing on display type (most sites use negative tracking on large sizes) creates a slightly more open, editorial cadence rather than a tight display feel.

### SF Pro Text — Body text, nav labels, button text, captions, project descriptions, dates. Single weight (400) across the entire system — no bold variants for emphasis; hierarchy is built through size and color alone, keeping the typographic voice flat and consistent. · `--font-sf-pro-text`
- **Substitute:** Inter, -apple-system, BlinkMacSystemFont, Helvetica Neue
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.25
- **Role:** Body text, nav labels, button text, captions, project descriptions, dates. Single weight (400) across the entire system — no bold variants for emphasis; hierarchy is built through size and color alone, keeping the typographic voice flat and consistent.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.25 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| heading-sm | 18px | 1.35 | — | `--text-heading-sm` |
| heading | 23px | 1.17 | 0.46px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Section gap:** 24-32px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Project Index Card
**Role:** Sidebar list item showing a project name and brand icon

White card with 8px radius, 16px padding, 1px Ash Gray bottom border, 40px circular brand icon on left, project name in SF Pro Text 14px weight 400 Ink Black on right, short gray description below in 12-13px.

### Sidebar Info Block
**Role:** Static agency metadata panel

Fixed left column, white background, no border, contains agency wordmark at top, current date/time in SF Pro Text 14px, 'About us' label in uppercase tracking, and project list. No background fill — sits directly on the page canvas.

### Hero Image Panel
**Role:** Full-width dominant visual at the top of the content field

Large photograph or composite, contained within the content column, no border, no radius, flush to the grid. Images bleed to the column edges without padding to maximize visual weight.

### Article Card
**Role:** Content card in the three-column grid below the hero

White surface, 8px border-radius, 16px padding, 1px Ash Gray border on top. Date label in SF Pro Text 14px weight 400 Ink Black at top. Title in SF Pro Display 23px weight 400 with 0.02em tracking. Body excerpt in SF Pro Text 14px Ash Gray. No shadow, no fill — relies on hairline border to separate from the canvas.

### Date Label
**Role:** Timestamp displayed above article titles

SF Pro Text 14px weight 400 Ink Black, left-aligned, no separator or bullet. The date is its own line, creating a clear typographic step before the headline.

### Brand Mark Icon
**Role:** Circular logo thumbnail representing a project in the sidebar

40-48px diameter, fully circular, contains the project's brand symbol or monogram. No border, sits directly on white. The circle is a hard mask — no rounding artifacts.

### Toggle Switch
**Role:** 'Show all projects' control at the top of the sidebar

iOS-style toggle: 51x31px track, 27px circular thumb, white thumb with subtle shadow, Ash Gray track in off state, System Blue track in on state. Sits inline with its label text.

### Wordmark
**Role:** Agency name display in the sidebar header

'PORTO ROCHA' in SF Pro Display 23px weight 400 Ink Black with 0.02em tracking, all caps, centered or left-aligned. Functions as the only typographic logo element.

### Text Link
**Role:** Inline interactive text for navigation and references

SF Pro Text 14px weight 400 System Blue (#007aff), no underline by default, underline on hover. The System Blue is the sole chromatic element in an otherwise monochrome interface.

### Nav Row
**Role:** Sidebar project listing with dividers

Stacked rows separated by 1px Ash Gray horizontal borders, 16px vertical padding per row, 8px gap between icon and text. No background fill per row — white canvas shows through.

## Do's and Don'ts

### Do
- Use #007aff exclusively for interactive text and active states — never as a decorative fill or background
- Apply 8px border-radius to all cards, buttons, and nav elements for a consistent subtle softness
- Set 16px padding on all content cards with 1px Ash Gray (#808080) top borders for separation
- Use SF Pro Text 14px weight 400 as the single body style — build hierarchy through size, not weight
- Reserve SF Pro Display 23px with +0.02em letter-spacing for headlines and the wordmark
- Let the two-column layout (sidebar + content) define the page structure — 25/75 split with no overlap
- Use hairline borders (1px) and whitespace for card separation instead of shadows or background fills

### Don't
- Do not introduce additional accent colors — the system is monochrome plus one blue
- Do not use bold or semibold weights — the system runs on a single 400 weight
- Do not apply shadows, glows, or blur effects — elevation is communicated by stacking alone
- Do not use negative letter-spacing on display text — the +0.02em tracking is intentional and signature
- Do not round buttons to pill shapes (38px) as a default — keep the 8px radius consistent with cards
- Do not fill cards with gray or colored backgrounds — all surfaces are pure white
- Do not add decorative elements, icons, or illustrations to the UI chrome — content photography carries the visual weight

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Full page background across sidebar and content area |
| 2 | Card Surface | `#ffffff` | Article cards, project cards, and sidebar info blocks — same hex as canvas, separated by 1px borders |

## Elevation

The design system intentionally avoids shadows entirely. Surface separation is achieved exclusively through 1px hairline borders in Ash Gray (#808080) and generous whitespace. This flat, border-driven approach gives the interface a printed/monograph quality — every element feels laid out on paper rather than floating in digital space.

## Imagery

Photography is the primary visual content, not the UI. Hero images are large, full-column-width composites of printed brand collateral, book spreads, and packaging systems — these are project showcases, not lifestyle photography. Article thumbnails in the grid show architectural photography, event documentation, and product/brand artifacts. Images are presented with no masking, no rounded corners, and no overlay treatments; they sit flush in their grid cells. The image style itself is editorial: natural light, documentary tone, printed-material focus. No illustrations, no 3D renders, no abstract graphics appear in the interface itself — all visual richness comes from the project photography.

## Layout

The page uses a persistent two-column layout: a fixed left sidebar (~25% width) and a fluid content field (~75%). The sidebar contains the agency wordmark, live date/time, about copy, and a scrollable project index with circular brand icons. The content field is a three-column card grid for articles and a full-column-width hero image at the top. The sidebar has a 1px Ash Gray right border separating it from the content. There is no global max-width constraint — the layout fills the viewport. Vertical rhythm is 24-32px between card rows, with 16px padding inside each card. Navigation is sidebar-based, not top-bar. The grid is rigid: sidebar left, three equal columns right, no asymmetric or overlapping compositions.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink Black)
- background: #ffffff (Paper White)
- border: #808080 (Ash Gray) for hairlines, #000000 for emphasis borders
- accent: #007aff (System Blue) — links and active states only
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. *Article Card*: White surface, 8px border-radius, 16px padding, 1px #808080 top border. Date label at top in SF Pro Text 14px #000000. Title in SF Pro Display 23px #000000, letter-spacing 0.02em. Body excerpt in SF Pro Text 14px #808080.
2. *Sidebar Project Row*: 16px vertical padding, 1px #808080 bottom border, 40px circular brand icon on left, project name in SF Pro Text 14px #000000, short description in SF Pro Text 13px #808080 below.
3. *Hero Image*: Full content-column width, no border, no radius, flush to grid edges. No overlay, no caption inside the image frame.
4. *Inline Text Link*: SF Pro Text 14px #007aff, no underline at rest, underline on hover. Sits within body text copy.
5. *Wordmark*: 'PORTO ROCHA' in SF Pro Display 23px #000000, +0.02em letter-spacing, all caps, weight 400.

## Similar Brands

- **Wieden+ Kennedy** — Agency portfolio sites with large editorial photography, sidebar project index, and minimal typographic chrome
- **Pentagram** — Design agency sites that function as monographs — monochrome palette, project-led grid, typographic restraint
- **Instrument** — Minimal agency sites with hairline-bordered cards, flat surfaces, and content photography as the sole visual element
- **Ramotion** — Agency/brand sites using single-weight typography, no shadows, and border-based surface separation
- **Manual (manualcreative.com)** — Design studio portfolios with two-column sidebar+grid layouts and anti-decorative visual systems

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-ash-gray: #808080;
  --color-paper-white: #ffffff;
  --color-system-blue: #007aff;

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.35;
  --text-heading: 23px;
  --leading-heading: 1.17;
  --tracking-heading: 0.46px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;

  /* Layout */
  --section-gap: 24-32px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 38px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-ash-gray: #808080;
  --color-paper-white: #ffffff;
  --color-system-blue: #007aff;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.35;
  --text-heading: 23px;
  --leading-heading: 1.17;
  --tracking-heading: 0.46px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 38px;
}
```
