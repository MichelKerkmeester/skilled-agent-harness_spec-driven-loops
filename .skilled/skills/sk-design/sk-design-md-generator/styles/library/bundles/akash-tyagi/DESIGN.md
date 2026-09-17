# Akash Tyagi — Style Reference
> midnight gallery wall with hot pink markers

**Theme:** dark

Akash Tyagi is a dark editorial portfolio rendered as a midnight canvas with warm parchment text and a single vivid pink accent that acts as functional punctuation rather than decoration. The layout breathes — 200px section gaps, generous asymmetric two-column compositions, and display labels set in Geist Pixel Triangle create a gallery-wall rhythm where each project is given the silence it needs. Every neutral carries a warm sepia undertone, deliberately steering away from the cool blue-grays of typical tech portfolios. Components are minimal and flat: pill CTAs, hairline dividers, status dots, and large unfettered project imagery — there is no elevation, no gradients, no ornamentation beyond typography and a single chromatic accent.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Canvas | `#000000` | `--color-obsidian-canvas` | Page background, card surfaces, inverted text on pink fills |
| Parchment | `#efe6d8` | `--color-parchment` | Primary body and heading text — warm near-white with sepia undertone, replaces the typical cool white of dark UIs |
| Bone | `#aca69c` | `--color-bone` | Secondary text, button borders, metadata — mid-tone warm gray |
| Ash | `#736e68` | `--color-ash` | Muted body text, subtle link borders, inactive labels |
| Charcoal | `#605c56` | `--color-charcoal` | Hairline dividers, low-emphasis borders, heading underlines on dark |
| Neon Petal | `#ffa1f7` | `--color-neon-petal` | Primary action buttons, active nav states, selected markers, occasional heading accents — the single chromatic punctuation in the system |
| Acid Lime | `#4dff00` | `--color-acid-lime` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Geist — Primary UI and body typeface — medium and semibold weights, tight negative tracking at -0.013em to -0.031em. Used for body copy, links, navigation, and small headings. · `--font-geist`
- **Substitute:** Inter, Satoshi
- **Weights:** 500, 600
- **Sizes:** 13px, 14px, 15px
- **Line height:** 1.14, 1.23, 1.33
- **Letter spacing:** -0.031em at 13px, -0.029em at 14px, -0.013em at 15px
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Primary UI and body typeface — medium and semibold weights, tight negative tracking at -0.013em to -0.031em. Used for body copy, links, navigation, and small headings.

### Geist Pixel Triangle — Display and section-label typeface — pixel/decorative variant used for all-caps section headers like 'SELECTED WORK' and the year range '2015 — 2026'. The pixel treatment gives editorial weight without serifs. · `--font-geist-pixel-triangle`
- **Substitute:** Space Mono Bold, Departure Mono
- **Weights:** 400
- **Sizes:** 30px
- **Line height:** 1.33
- **Letter spacing:** -0.033em at 30px
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Display and section-label typeface — pixel/decorative variant used for all-caps section headers like 'SELECTED WORK' and the year range '2015 — 2026'. The pixel treatment gives editorial weight without serifs.

### Geist Mono — Metadata typeface — timestamps, email, technical labels, year stamps. The monospace signals system/data language against the proportional body. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 500
- **Sizes:** 13px
- **Line height:** 1.23, 1.54
- **Letter spacing:** -0.031em at 13px
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Metadata typeface — timestamps, email, technical labels, year stamps. The monospace signals system/data language against the proportional body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-lg | 15px | 1.4 | -0.2px | `--text-body-lg` |
| display | 30px | 1.33 | -1px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 104 | 104px | `--spacing-104` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| pills | 1000px |
| buttons | 40px |
| indicators | 1000px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 200px
- **Card padding:** 0px
- **Element gap:** 16px

## Components

### Pill CTA Button
**Role:** Primary action trigger

Filled pill button, #ffa1f7 background, Obsidian (#000000) text, 40px border-radius, 12px vertical padding × 24px horizontal padding. Geist 500 at 13px. Used for the single most important action on screen (e.g. 'Book an intro call').

### Ghost Text Link
**Role:** Secondary navigation and inline links

No background, Parchment (#efe6d8) text with 1px Ash (#736e68) or Bone (#aca69c) border-bottom underline. Geist 500 at 13–14px. Underline appears only on hover, not at rest.

### Status Availability Indicator
**Role:** Live availability signal

8px Acid Lime (#4dff00) circle with 1000px border-radius, paired with Parchment (#efe6d8) text 'Available for work' at 13px Geist 500. The green dot is the only green element in the entire system.

### Section Header with Date Range
**Role:** Editorial section divider

Two-part label: section name left, date range right. Set in Geist Pixel Triangle 400 at 30px, Parchment (#efe6d8) for the label, Ash (#736e68) for the date range. Tight -0.033em letter-spacing. Separated from content by 104px of vertical space.

### Project Showcase Card
**Role:** Portfolio project entry

Full-width project image displayed edge-to-edge on the Obsidian canvas with no card chrome. No border, no shadow, no radius — the image IS the card. Caption/description appears below in Geist 500, 14px, Parchment text.

### Minimal Header Bar
**Role:** Identity and time stamp

Single-row layout: designer name left ('Akash Tyagi' in Geist 600, Parchment), current time and email right (Geist Mono 400, Ash). No logo, no nav links, no hamburger — the header is identity + clock, nothing more.

### Two-Column Intro Block
**Role:** Personal statement

Asymmetric two-column text block. Left column: condensed bio (2–3 short paragraphs). Right column: left empty or holds the CTA + status. Column gap 24–48px. Body text in Geist 500, 14px, Parchment with 16px paragraph spacing.

### Footer Social Link
**Role:** External profile references

Plain text links — 'X.com', 'LinkedIn', 'Dribbble' — set in Geist Mono 400, 13px, Ash (#736e68) color. No icons, no badges. Separated by consistent 24px gaps.

## Do's and Don'ts

### Do
- Use #000000 as the universal background for every screen — never introduce a lighter or colored canvas
- Apply #ffa1f7 only to the single primary action per view; treat it as the system's only chromatic voice
- Set section labels in Geist Pixel Triangle 30px with -0.033em tracking for editorial weight
- Maintain 200px vertical gaps between major sections to preserve the gallery-wall rhythm
- Use warm neutrals (#efe6d8 → #aca69c → #736e68 → #605c56) in descending tonal order for text hierarchy
- Use the green dot (#4dff00) exclusively for live status/availability — never as a generic accent or button color
- Render all project imagery edge-to-edge with no card chrome, radius, or shadow

### Don't
- Never introduce box-shadows, gradients, or glow effects — flatness is the point
- Never use #ffa1f7 for body text, backgrounds, or decorative purposes — it is an action color only
- Never round image corners on project showcases — images must meet the canvas edge
- Never add more than one filled CTA per screen — the system is single-action
- Never use cool blue-grays or pure whites for text — the warm sepia palette is the identity
- Never use icons in the header or footer — plain text links only
- Never reduce section gaps below 104px — the generous whitespace is structural, not optional

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000000` | Full-bleed page background — true black for maximum contrast against warm text |
| 1 | Project Surface | `#000000` | Project image and content frames sit directly on canvas without card elevation |
| 2 | Accent Surface | `#ffa1f7` | Inverted pill buttons and selected markers — the only chromatic surface |

## Elevation

No shadows. Surfaces are separated purely by tone and whitespace. Elevation is expressed through typographic scale and generous spacing, not box-shadow stacks. This flatness is deliberate — shadows would introduce visual noise on a portfolio that treats each project as a gallery frame.

## Imagery

Product photography dominates — large, high-fidelity device mockups (tablets, phones) shot in lifestyle or twilight contexts with dramatic sky gradients. Images are full-bleed, occupying the full viewport width within the project showcase cards. No rounded corners, no masks, no frames — images meet the dark canvas edge-to-edge. No illustration or iconography beyond a single green status dot. The visual rhythm is: text block → silence → massive product photograph → silence → text block. Photography is the only visual content; UI screenshots inside product shots show dark UIs with warm text, mirroring the portfolio's own aesthetic.

## Layout

Full-bleed dark canvas with max-width 1400px centered content. The page reads as a vertical scroll of alternating text and image bands with extreme vertical breathing room (200px between sections). No sidebar, no sticky nav, no mega-menu — the header is a single static line. Hero pattern: two-column asymmetric text block (bio left, CTA right) on pure black, no hero image. Content arrangement alternates between text-only sections and full-bleed project images, creating a gallery-wall rhythm. Section labels ('SELECTED WORK 2015 — 2026') act as horizontal typographic dividers. The grid is implicit — no visible columns or gutters, content flows in max-width containers with generous margins. Navigation is reduced to name + time + email in the header and three text links in the footer.

## Agent Prompt Guide

Quick Color Reference:
- text: #efe6d8 (Parchment)
- background: #000000 (Obsidian)
- border: #605c56 (Charcoal) / #736e68 (Ash)
- accent: #ffa1f7 (Neon Petal)
- status: #4dff00 (Acid Lime) — availability dot only
- primary action: #ffa1f7 (filled action)

Example Component Prompts:

1. Create a section header: 200px top padding. Left-aligned label 'SELECTED WORK' in Geist Pixel Triangle 30px, #efe6d8, letter-spacing -1px. Right-aligned date range '2015 — 2026' in Geist Mono 13px, #736e68.

2. Create a status row: 8px green circle (#4dff00, 1000px radius) followed by 'Available for work' in Geist 500, 14px, #efe6d8, separated by 8px gap.

3. Create a pill CTA: 40px border-radius, #ffa1f7 background, 12px 24px padding, 'Book an intro call' in Geist 500 13px, #000000 text, no border.

4. Create a footer link row: three text links 'X.com', 'LinkedIn', 'Dribbble' in Geist Mono 400, 13px, #736e68, 24px gap between each, left-aligned.

5. Create a project showcase: full-width image edge-to-edge on #000000 canvas, no border or radius, 104px top padding, caption below in Geist 500 14px #efe6d8.

## Similar Brands

- **Brittany Chiang** — Dark portfolio canvas with single accent color, all-caps section labels, generous vertical spacing, and minimal navigation reduced to name and contact
- **Rauno Freiberg** — Dark, near-black background with tight tracking, monospace metadata, and an editorial single-column scroll rhythm
- **Linear** — Same flat-on-black surface treatment with no shadows or gradients, and tight negative letter-spacing on small body text
- **Cobe (Pieter Levels)** — Personal portfolio with extreme whitespace, monospace timestamps, and text-only footer links without icons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-canvas: #000000;
  --color-parchment: #efe6d8;
  --color-bone: #aca69c;
  --color-ash: #736e68;
  --color-charcoal: #605c56;
  --color-neon-petal: #ffa1f7;
  --color-acid-lime: #4dff00;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-pixel-triangle: 'Geist Pixel Triangle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-lg: 15px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.2px;
  --text-display: 30px;
  --leading-display: 1.33;
  --tracking-display: -1px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-104: 104px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 200px;
  --card-padding: 0px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-3xl: 40px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-pills: 1000px;
  --radius-buttons: 40px;
  --radius-indicators: 1000px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-project-surface: #000000;
  --surface-accent-surface: #ffa1f7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-canvas: #000000;
  --color-parchment: #efe6d8;
  --color-bone: #aca69c;
  --color-ash: #736e68;
  --color-charcoal: #605c56;
  --color-neon-petal: #ffa1f7;
  --color-acid-lime: #4dff00;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-pixel-triangle: 'Geist Pixel Triangle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-lg: 15px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.2px;
  --text-display: 30px;
  --leading-display: 1.33;
  --tracking-display: -1px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-104: 104px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-3xl: 40px;
  --radius-full: 1000px;
}
```
