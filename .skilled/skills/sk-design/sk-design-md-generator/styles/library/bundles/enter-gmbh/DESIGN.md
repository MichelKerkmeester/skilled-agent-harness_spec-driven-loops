# Enter GmbH — Style Reference
> Bauhaus poster workshop, midday sun

**Theme:** mixed

Enter GmbH reads like a Bauhaus-influenced IT services brochure printed on warm stock: bold full-bleed color panels (seafoam, cream, signal orange) stack like poster sheets, and a monospaced face (Maax Mono) carries nearly every word, giving the whole site the cadence of a technical readout rather than a marketing page. The visual rhythm is theatrical — each horizontal band changes color and mood, with no soft transitions, just hard seams between cream, teal, white, and orange. A single abstract geometric illustration of stacked blocks on poles lives in the hero, and every interactive control is a dark pill on a colored ground. Neutrality is the default (black on white for text, #282828 for filled buttons), with orange and teal used as architectural surfaces rather than accents — they ARE the layout, not decoration on it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Orange | `#ff5000` | `--color-signal-orange` | Full-bleed section surfaces, geometric illustration caps, partner section canvas — carries warmth and authority across an otherwise achromatic text system |
| Seafoam Panel | `#a5d3d4` | `--color-seafoam-panel` | Hero canvas and alternating section ground — a cool counterweight to the warm orange, used as full-bleed background, never as a text highlight |
| Cream Stock | `#f9f8ea` | `--color-cream-stock` | Soft band surfaces between content sections — a paper-like off-white warmer than pure #ffffff, signals a transition zone |
| Charcoal | `#282828` | `--color-charcoal` | Filled button background, dark illustration blocks, heading accents — the loaded weight of the palette, softer than pure black |
| Ink | `#000000` | `--color-ink` | Primary body and heading text, hairline borders, icon strokes, link underlines — the dominant typographic color |
| Pebble | `#6a6a6a` | `--color-pebble` | Muted border and separator color for subtle structural lines that shouldn't compete with text |
| Paper | `#ffffff` | `--color-paper` | Default page canvas, text on dark filled buttons, surface for content sections between color bands |

## Tokens — Typography

### Maax Mono — Primary text and body — monospaced at body size gives the whole site a code-readout, technical-manual cadence. This is the signature choice: a service company writing like a terminal · `--font-maax-mono`
- **Substitute:** IBM Plex Mono, JetBrains Mono, Roboto Mono
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50–1.60
- **Letter spacing:** normal
- **Role:** Primary text and body — monospaced at body size gives the whole site a code-readout, technical-manual cadence. This is the signature choice: a service company writing like a terminal

### Sofia-Regular — Display headings — a softer humanist sans used sparingly for larger section titles, providing the only non-monospaced typographic moment in the system · `--font-sofia-regular`
- **Substitute:** Sofia Sans, Nunito Sans, Quicksand
- **Weights:** 400
- **Sizes:** 28px
- **Line height:** 1.29–1.36
- **Letter spacing:** normal
- **Role:** Display headings — a softer humanist sans used sparingly for larger section titles, providing the only non-monospaced typographic moment in the system

### Helvetica — Micro UI text — marquee strips, tiny labels, and small interface markers; falls back to system monospaced where available · `--font-helvetica`
- **Substitute:** Inter, system-ui, Arial
- **Weights:** 400, 700
- **Sizes:** 10px
- **Line height:** 1.15
- **Letter spacing:** normal
- **Role:** Micro UI text — marquee strips, tiny labels, and small interface markers; falls back to system monospaced where available

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.15 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| heading | 28px | 1.3 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 25px |
| cards | 25px |
| buttons | 25px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 24px
- **Card padding:** 20px
- **Element gap:** 24px

## Components

### Filled Pill Button
**Role:** Primary action control (Support, Submit)

Background #282828, text #ffffff, border-radius 25px, padding 13px 25px, Maax Mono 16px weight 400. The only filled button variant — black pill on whatever color band it sits on.

### Icon Pill Button
**Role:** Compact utility control (the + button)

Background #282828, icon stroke #ffffff, border-radius 25px (reads as circular at this size), padding 13px. Same dark fill as the filled button, sized for single glyph.

### Text Link with Arrow
**Role:** Inline navigation to subpages

Maax Mono 16px weight 400, color #000000, underlined, prefixed with → arrow character. Underline is the standard link affordance — no button chrome.

### Marquee Strip
**Role:** Top-of-page announcement ticker

Pill-shaped container (border-radius 25px), background #ffffff, Maax Mono 10–16px, color #000000, horizontal padding ~20px. Sits between the logo and the action buttons in the header.

### Header Bar
**Role:** Top navigation

Full-width transparent bar over whatever section color it sits on. Logo text left, marquee center, two pill buttons right. No background fill — the section color shows through.

### Hero Illustration Block
**Role:** Abstract visual identity asset

Three vertical posts (cream and charcoal), three charcoal cubes, three orange caps — flat geometric composition centered on the hero canvas. No shadows, no gradients, hard 90° edges.

### Two-Column Text Layout
**Role:** Narrative + link list pair

Left column: Maax Mono 16px body text in dark ink, max-width ~50% of container. Right column: vertically stacked text links with → arrows, aligned to a left margin offset from the text column.

### Section Divider Band
**Role:** Color-block transition between content zones

Full-bleed horizontal strip, typically cream (#f9f8ea) or seafoam (#a5d3d4), 80–120px tall, containing a single small centered label in Maax Mono (e.g. 'Enter: Läuft bei Ihnen', 'Unsere Partner').

### Partner Section (Orange Field)
**Role:** Full-bleed spectacle band

Solid #ff5000 background spanning the full viewport width and significant height, minimal content — the loudest color in the system used as an architectural moment, not a CTA trigger.

### Footer Label
**Role:** Bottom-of-section identification

Centered Maax Mono text in a cream or white band, small size (10–14px), functions as a section title rather than legal footer copy.

## Do's and Don'ts

### Do
- Use Maax Mono (or a monospaced substitute) for all body, nav, link, and button text — the monospaced cadence is the site's identity
- Set border-radius to 25px on all buttons, tags, marquee containers, and link pills
- Stack sections as full-bleed color bands (#ffffff → #f9f8ea → #a5d3d4 → #ff5000) with hard seams and no gradients between them
- Use #282828 as the filled button background and #ffffff as the button text — no other filled-button color
- Anchor headings in Sofia-Regular 28px line-height 1.3; everything else stays in the mono family
- Use 24px as the default element gap and 20px as the default link/heading padding token
- Keep links typographic: underlined #000000 Maax Mono with a → arrow prefix, never styled as buttons or chips

### Don't
- Do not introduce a sans-serif body font — replacing the mono face destroys the technical-manual personality
- Do not use orange (#ff5000) as a button or link color — it's an architectural surface, not an interactive accent
- Do not add shadows, glows, or elevation effects to cards or buttons — the system is flat and hard-edged
- Do not use teal (#a5d3d4) for text or borders — it only works as a full-bleed surface
- Do not use border-radius values other than 25px on interactive elements — partial rounding breaks the pill vocabulary
- Do not place photography or product screenshots — the site is text-and-illustration only
- Do not add gradient transitions between color bands — every section boundary must be a hard seam

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Default content canvas for text-heavy sections |
| 2 | Cream Stock | `#f9f8ea` | Warm transition band between content blocks |
| 3 | Seafoam Panel | `#a5d3d4` | Hero and alternate section canvas — the cool beat |
| 4 | Signal Orange | `#ff5000` | Full-bleed partner/spectacle section — the loud beat |

## Elevation

The design is intentionally flat. No box-shadows, no drop shadows, no glow effects. Depth is created through color contrast between full-bleed bands, not through simulated elevation. Interactive elements (buttons) are identified by their dark fill and pill shape, not by casting shadow on the surface below.

## Imagery

A single abstract geometric illustration in the hero: three vertical posts in cream and dark charcoal with charcoal cubes and orange caps stacked at varying heights. The aesthetic is Bauhaus / De Stijl / mid-century toy — flat, hard-edged, no gradients, no shadows, no human figures. Elsewhere, the site is text-only: no photography, no product screenshots, no decorative icons beyond minimal arrow markers (→) on links. The visual personality comes entirely from typography, color blocking, and this one sculptural illustration.

## Layout

Full-bleed horizontal color bands that stack top to bottom with hard seams — no gradients or soft transitions between sections. Hero is seafoam with a large centered illustration; the body alternates between white text columns and cream transition strips; a full-bleed orange partner band appears below. Content inside each band uses a centered max-width container (~1200px) with generous horizontal padding. The text layout is two-column on desktop (narrative text left, link list right) with wide gutters. Navigation is minimal: logo top-left, a marquee strip center, and two pill buttons top-right. The overall rhythm is poster-like — each screen is a single color field with one or two pieces of content, not a dense information layout.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border: #000000 (hairline) or #6a6a6a (muted)
- accent: #ff5000 (Signal Orange — surfaces only, not interactive)
- primary action: #282828 (filled action)
- section surface: #a5d3d4 (Seafoam), #f9f8ea (Cream Stock), #ff5000 (Signal Orange)

3-5 Example Component Prompts:

1. Build a Support pill button: background #282828, text #ffffff, border-radius 25px, padding 13px 25px, font Maax Mono 16px weight 400. Place on a seafoam (#a5d3d4) hero canvas.

2. Build a hero section with full-bleed background #a5d3d4. Center an abstract geometric illustration of three vertical posts in cream (#f9f8ea) and charcoal (#282828) with three charcoal cubes and three orange (#ff5000) caps at varying heights. No shadows. No gradients.

3. Build a two-column content section: left column contains Maax Mono 16px weight 400 body text in #000000 describing IT services; right column contains three text links stacked vertically, each prefixed with → and underlined. Background #ffffff, max-width 1200px centered, 24px gap between columns.

4. Build a marquee announcement strip: pill-shaped container (border-radius 25px) with background #ffffff, Maax Mono text in #000000 at 10–16px, padding ~6px 20px. Position it in the header between the logo and the action buttons.

5. Build a partner section: full-bleed #ff5000 background spanning the full viewport width, minimal content, no buttons or CTAs. Below it, a cream (#f9f8ea) band with a centered small label 'Unsere Partner' in Maax Mono.

## Similar Brands

- **Basecamp** — Same flat-color-band section stacking with hard seams and no decorative chrome
- **Linear** — Mono-influenced UI vocabulary with pill buttons and achromatic surfaces accented by a single signal color
- **Vercel** — Full-bleed color blocks alternating with white content panels, minimal text-only composition
- **Are.na** — Editorial / poster-like layout with bold color fields and quiet, typographic content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-orange: #ff5000;
  --color-seafoam-panel: #a5d3d4;
  --color-cream-stock: #f9f8ea;
  --color-charcoal: #282828;
  --color-ink: #000000;
  --color-pebble: #6a6a6a;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-maax-mono: 'Maax Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sofia-regular: 'Sofia-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.15;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 28px;
  --leading-heading: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 24px;
  --card-padding: 20px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-3xl: 25px;

  /* Named Radii */
  --radius-tags: 25px;
  --radius-cards: 25px;
  --radius-buttons: 25px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-cream-stock: #f9f8ea;
  --surface-seafoam-panel: #a5d3d4;
  --surface-signal-orange: #ff5000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-orange: #ff5000;
  --color-seafoam-panel: #a5d3d4;
  --color-cream-stock: #f9f8ea;
  --color-charcoal: #282828;
  --color-ink: #000000;
  --color-pebble: #6a6a6a;
  --color-paper: #ffffff;

  /* Typography */
  --font-maax-mono: 'Maax Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sofia-regular: 'Sofia-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.15;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 28px;
  --leading-heading: 1.3;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-3xl: 25px;
}
```
