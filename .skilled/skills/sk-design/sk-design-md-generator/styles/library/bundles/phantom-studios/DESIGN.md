# Phantom Studios — Style Reference
> green signal line on a black void

**Theme:** dark

Phantom Studios operates as a near-totalist dark canvas: a single black field with one centered white text mark and a thin green horizon line anchoring the bottom of the viewport. The aesthetic is terminal-meets-poster — almost no chrome, no images, no navigation visible in the fold, just type on void with one signal color doing all the work. Typography is split between a geometric workhorse (Helvetica Now) for UI and display, and a tiny monospace face (ballinger-mono) for metadata, taglines, and trademark marks — the pairing reads as coded rather than designed. Everything is uppercase, everything is small, and the green line acts as a system indicator or cursor rather than decoration. The page makes you look harder than usual because there is almost nothing to look at; restraint is the product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, primary surface — the only background; every other color reads as light emitted from this base |
| Pure White | `#ffffff` | `--color-pure-white` | All text, dividers, list markers, and outline borders — 21:1 contrast against Void means type is the loudest element on the page by far |
| Dark Graphite | `#333333` | `--color-dark-graphite` | Hairline borders, secondary dividers, and structural rules — sits just above the void to define edges without lifting weight |
| Mid Gray | `#666666` | `--color-mid-gray` | Muted helper text and inactive label borders — 3.7:1 against black intentionally fails contrast, signaling de-emphasis rather than legibility |
| Signal Green | `#1eff66` | `--color-signal-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |

## Tokens — Typography

### Helvetica Now — Primary UI and display face — geometric grotesque set tight (0.93 on the 56px display creates an almost single-line block of text) · `--font-helvetica-now`
- **Substitute:** Inter, Helvetica Neue, Neue Haas Grotesk
- **Weights:** 400, 500, 700
- **Sizes:** 11, 16, 18, 22, 24, 56px
- **Line height:** 0.93 (display 56px), 1.20 (16–24px)
- **Role:** Primary UI and display face — geometric grotesque set tight (0.93 on the 56px display creates an almost single-line block of text)

### ballinger-mono — Micro-copy, taglines, and trademark marks (the ® in 'PHANTOM STUDIOS® TECHNOLOGY CREATIVE'); 11px monospaced at 1.10 is intentionally difficult — it reads as metadata, not prose · `--font-ballinger-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Berkeley Mono
- **Weights:** 400
- **Sizes:** 11px
- **Line height:** 1.10
- **Role:** Micro-copy, taglines, and trademark marks (the ® in 'PHANTOM STUDIOS® TECHNOLOGY CREATIVE'); 11px monospaced at 1.10 is intentionally difficult — it reads as metadata, not prose

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.1 | — | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 18px | 1.2 | — | `--text-subheading` |
| heading | 22px | 1.2 | — | `--text-heading` |
| heading-lg | 24px | 1.2 | — | `--text-heading-lg` |
| display | 56px | 0.93 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 88 | 88px | `--spacing-88` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 14px |
| cards | 14px |
| buttons | 14px |

### Layout

- **Section gap:** 88px
- **Card padding:** 24-40px
- **Element gap:** 16px

## Components

### Centered Display Lockup
**Role:** Primary brand mark for hero/landing screens

Vertically and horizontally centered all-caps wordmark 'PHANTOM STUDIOS® TECHNOLOGY CREATIVE' — Helvetica Now 400 at 16px white (#ffffff) on Void (#000000), line-height 1.20, with a ballinger-mono 11px superscript ® separating the two phrases. Total lockup spans the full viewport with massive negative space above and below — the mark reads at arm's length.

### Signal Horizon Line
**Role:** Page-level system indicator and visual anchor

A 1–2px tall Signal Green (#1eff66) horizontal rule pinned to the absolute bottom edge of the viewport, full-bleed. Functions as a loading/scan bar, a system status pulse, or a closing punctuation mark. 15.6:1 contrast against Void makes even a hairline register as a deliberate UI event.

### Outlined Link / Ghost Action Border
**Role:** Interactive text and outline-button borders

White (#ffffff) 1px border on transparent Void fill. ACTION_BORDER evidence is strong (270 instances on #ffffff, 90 on #333333) — links and outline buttons are rendered as border-only geometry, never as filled shapes. Inset text 16px Helvetica Now 500, uppercase, letter-spacing normal.

### Section Divider
**Role:** Horizontal rule between content blocks

Dark Graphite (#333333) 1px full-width line, 16px vertical padding above and below. Used to separate stacked sections without introducing a surface change — the void remains continuous.

### Mono Caption / Tagline Strip
**Role:** Micro-copy, version marks, and metadata

ballinger-mono 400 at 11px, line-height 1.10, Pure White (#ffffff) on Void. Always uppercase, always tracked at normal. Sits as a small secondary line under or beside display type, reading as a system log rather than marketing copy.

### List Marker
**Role:** Ordered/unordered list bullets and item separators

White (#ffffff) 1px borders used as inline list rules (list/borderColor=1796 instances). Lists are rendered as text with thin white horizontal rules between items rather than bullet glyphs — a terminal-list aesthetic.

### Input / Form Field
**Role:** Text fields and form controls

Transparent Void fill with White (#ffffff) 1px border, 14px corner radius, 16px Helvetica Now 400 in white, 11px ballinger-mono placeholder in Mid Gray (#666666). Focus state thickens the border to 2px and shifts to Signal Green (#1eff66) — the only time green touches a component.

### Tag / Chip
**Role:** Category labels and status pills

White (#ffffff) 1px border, Void fill, 14px radius, ballinger-mono 11px uppercase white text, 3px vertical / 8px horizontal padding. No fill color — tags are always hollow.

## Do's and Don'ts

### Do
- Use #1eff66 only on the viewport-edge signal line and on input focus borders — it is a system event color, not a decoration
- Keep all type uppercase across all sizes — mixed case breaks the coded/terminal reading
- Use 14px radius for every rounded component (tags, inputs, buttons) — the single radius value unifies the system
- Center critical content both vertically and horizontally in the viewport; the void is the layout grid
- Pair Helvetica Now with ballinger-mono so every screen has a geometric-plus-mono contrast — never use a second sans-serif
- Set display type (56px) at line-height 0.93 so multi-line headlines almost touch — the tight lockup is signature
- Use Dark Graphite (#333333) for structural rules and White (#ffffff) for interactive borders — gray signals passive, white signals actionable

### Don't
- Never fill a button or surface with a solid color — the system is outline-only on transparent void
- Never use #1eff66 on body text, icons, or large surfaces — a single pixel-thin line is the maximum dose
- Never introduce shadows, blurs, or gradients — depth must come from the green horizon line alone
- Never use Mid Gray (#666666) for primary text — it intentionally fails contrast and should only mark inactive/muted states
- Never mix in a third font family — Helvetica Now for structure, ballinger-mono for metadata, nothing else
- Never pad sections less than 48px — the void needs breathing room; compact spacing collapses the poster effect
- Never use a color background for cards or panels — every surface stays transparent over Pure Black

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Unified page canvas — no distinction between background and surface; the entire site is one black field |
| 1 | Signal Green Plane | `#1eff66` | Edge-of-screen accent stripe that doubles as a system indicator and the only non-monochrome surface |

## Elevation

No shadows. Depth is communicated through the single Signal Green accent line at the viewport edge — the only element that implies a plane above the void. Everything else sits flush on Pure Black, relying on contrast and weight (not elevation) to establish hierarchy.

## Imagery

No photography, illustration, or product imagery. The page is pure type on void with one Signal Green horizon line. Any visual content would compete with the terminal aesthetic and is treated as out-of-system. Iconography (if present elsewhere) is line-only in White (#ffffff) with 1px stroke, never filled and never green.

## Layout

Full-bleed viewport — no max-width container, no side margins. The hero is a single centered text lockup with the entire viewport as negative space around it. The Signal Green line sits at the absolute bottom edge of the viewport (not the page) as a system indicator. Navigation is absent from the visible fold; the page is treated as a poster rather than a document. Section rhythm is defined by Dark Graphite (#333333) 1px horizontal dividers with 88px vertical spacing, not by alternating surface colors — the void remains continuous top to bottom.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff
- background: #000000
- border (structural): #333333
- border (interactive): #ffffff
- muted: #666666
- accent / signal: #1eff66
- primary action: no distinct CTA color

3-5 Example Component Prompts:
1. Centered brand lockup: Pure Black (#000000) viewport. Wordmark 'PHANTOM STUDIOS® TECHNOLOGY CREATIVE' centered both axes, Helvetica Now 400 16px Pure White (#ffffff), line-height 1.20, uppercase, with a ballinger-mono 11px superscript ® between the two phrases. Add a 1px Signal Green (#1eff66) full-width line pinned to the absolute bottom of the viewport.
2. Outline ghost button: 1px Pure White (#ffffff) border, transparent Void (#000000) fill, 14px radius, Helvetica Now 500 16px uppercase white text, 16px vertical / 24px horizontal padding. No fill state — hover shifts border to 2px, never changes color.
3. Metadata caption strip: ballinger-mono 400 11px Pure White (#ffffff), line-height 1.10, uppercase, 8px margin-bottom above a 16px Helvetica Now 400 display line. Sits flush left, never centered, on Void background.
4. Form input field: transparent Void (#000000) fill, 1px White (#ffffff) border, 14px corner radius, 16px Helvetica Now 400 white text, 11px ballinger-mono placeholder in Mid Gray (#666666), 16px vertical / 16px horizontal padding. Focus state replaces border with 2px Signal Green (#1eff66).
5. Section divider: Dark Graphite (#333333) 1px full-width horizontal rule with 48px vertical padding above and below. Void background remains continuous — the divider is the only structure.

## System Philosophy

Phantom Studios treats the page as a terminal screen, not a website. There is no chrome, no navigation, no imagery — only a centered wordmark and one signal line. The entire visual identity is built from four neutrals and one accent, with two type families that never compete. Recreate this by defaulting to empty void, adding white type last, and reserving green for system-level events only.

## Similar Brands

- **Active Theory** — Dark immersive canvas, single-color accent punctuation, geometric sans display type centered on near-empty viewport
- **Resn** — Creative technology studio aesthetic with near-monochrome dark pages, minimal chrome, and one signature accent doing all the work
- **Pentagram partner sites** — Poster-like centered lockups on void, Helvetica/Helvetica-class type, uppercase wordmarks, no decoration
- **Instrument** — Creative technology agency using black canvas with selective chromatic accent lines and tight geometric typography
- **Ueno** — Creative agency with all-caps wordmark, monospace metadata, and a single neon signal color against pure black

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-pure-white: #ffffff;
  --color-dark-graphite: #333333;
  --color-mid-gray: #666666;
  --color-signal-green: #1eff66;

  /* Typography — Font Families */
  --font-helvetica-now: 'Helvetica Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ballinger-mono: 'ballinger-mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading: 22px;
  --leading-heading: 1.2;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.2;
  --text-display: 56px;
  --leading-display: 0.93;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-88: 88px;

  /* Layout */
  --section-gap: 88px;
  --card-padding: 24-40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 14px;

  /* Named Radii */
  --radius-tags: 14px;
  --radius-cards: 14px;
  --radius-buttons: 14px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-signal-green-plane: #1eff66;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-pure-white: #ffffff;
  --color-dark-graphite: #333333;
  --color-mid-gray: #666666;
  --color-signal-green: #1eff66;

  /* Typography */
  --font-helvetica-now: 'Helvetica Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ballinger-mono: 'ballinger-mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --text-heading: 22px;
  --leading-heading: 1.2;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.2;
  --text-display: 56px;
  --leading-display: 0.93;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-88: 88px;

  /* Border Radius */
  --radius-xl: 14px;
}
```
