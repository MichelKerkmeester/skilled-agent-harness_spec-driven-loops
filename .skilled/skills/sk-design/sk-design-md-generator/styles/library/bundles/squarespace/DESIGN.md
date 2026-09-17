# Squarespace — Style Reference
> Cinematic monochrome gallery

**Theme:** light

Squarespace speaks in absolute black and white — a purely achromatic system where drama comes from scale, contrast, and full-bleed photography rather than color. The visual identity is cinematic: a single massive headline floats over a full-bleed photographic hero, then the page alternates between stark black bands and white expanses, each section announcing itself through scale rather than color. Typography carries the entire brand voice — Clarkson, a custom geometric sans, is used at whisper-light 300 weight for huge 64–72px displays with aggressively tight tracking (-0.06em), creating a serif-like density that feels editorial. Components are intentionally minimal: ghost buttons, pill-shaped filter tabs, dark image cards with arrow indicators. The system is deliberately austere so user content (the websites being built) inherits all the visual energy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, nav bar, black section bands, dark feature cards, logo mark |
| Paper | `#ffffff` | `--color-paper` | Page background, hero text on dark imagery, light section canvases, button text on filled buttons |
| Charcoal | `#2f2f2f` | `--color-charcoal` | Filled button background, elevated dark surfaces — softer than pure black, reads as premium matte |
| Ash | `#898989` | `--color-ash` | Muted body text, secondary borders, de-emphasized labels on dark backgrounds |
| Fog | `#dddddd` | `--color-fog` | Light borders, button outlines on light surfaces, subtle dividers, pill-tab inactive background |
| Slate | `#999999` | `--color-slate` | Tertiary text, very subtle UI dividers, placeholder-level hierarchy |

## Tokens — Typography

### Clarkson — Primary brand typeface. Weight 300 at 64–72px for hero/display creates editorial whisper-weight headlines with serif-like density. Weight 400 for body and UI. Weight 500 for active nav and tab labels. Tight tracking (-0.06em at display) collapses glyphs into a continuous visual mass. · `--font-clarkson`
- **Substitute:** Inter, Neue Haas Grotesk, Helvetica Neue
- **Weights:** 300, 400, 500
- **Sizes:** 12px, 13px, 14px, 15px, 20px, 26px, 40px, 64px, 72px
- **Line height:** 0.93, 1.00, 1.20, 1.40
- **Letter spacing:** -0.0600em at 64–72px, -0.0500em at 40px, -0.0400em at 26px, -0.0200em at 20px, -0.0100em at 14–15px, -0.0010em at 12–13px
- **Role:** Primary brand typeface. Weight 300 at 64–72px for hero/display creates editorial whisper-weight headlines with serif-like density. Weight 400 for body and UI. Weight 500 for active nav and tab labels. Tight tracking (-0.06em at display) collapses glyphs into a continuous visual mass.

### Clarkson Serif — Accent serif used selectively for editorial subheadings — the italic-feel contrast against the geometric sans adds visual punctuation · `--font-clarkson-serif`
- **Substitute:** Tiempos Text, GT Sectra, Lyon Text
- **Weights:** 400
- **Sizes:** 26px
- **Line height:** 1.00
- **Letter spacing:** -0.0200em
- **Role:** Accent serif used selectively for editorial subheadings — the italic-feel contrast against the geometric sans adds visual punctuation

### System sans-serif — Fallback rendering when Clarkson fails to load — 16px base for system text only · `--font-system-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Fallback rendering when Clarkson fails to load — 16px base for system text only

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.001px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.01px | `--text-body-sm` |
| subheading | 20px | 1.2 | -0.02px | `--text-subheading` |
| heading-sm | 26px | 1.2 | -0.04px | `--text-heading-sm` |
| heading | 40px | 1 | -0.05px | `--text-heading` |
| display | 72px | 0.93 | -0.06px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 100px |
| inputs | 8px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-40px
- **Element gap:** 12-16px

## Components

### Ghost Button (Hero CTA)
**Role:** Primary action over full-bleed photography

Transparent background, 1px #ffffff border, #ffffff text. Clarkson 400, 14px, uppercase tracking 0. Padding 16px 32px. 0px border-radius (sharp corners — a deliberate contrast to the pill shapes used elsewhere). Sits centered below the hero headline.

### Filled Dark Button (Nav CTA)
**Role:** Persistent top-right conversion action

Background #ffffff on dark nav, 1px #ffffff border, #000000 text. Clarkson 500, 13px, uppercase, tracking 0.02em. Padding 12px 24px. 0px radius. Stays in the same position across all sections.

### Login Text Link
**Role:** Secondary nav action

No background or border. #ffffff text, Clarkson 400, 13px, uppercase. Sits left of the filled CTA in nav. Underline appears on hover.

### Pill Category Tab
**Role:** Filter chips for feature category selection

100px border-radius. Inactive: transparent bg, #000000 text, no border. Active: #dddddd background, #000000 text. Clarkson 400, 14px. Padding 8px 18px. No horizontal gap between pills — they sit in a single row with even spacing.

### Dark Feature Card
**Role:** Product capability showcase in 4-column grid

8px border-radius. Full-bleed background image (photographic or product UI screenshot) with dark overlay. #ffffff heading (Clarkson 300, 20px), #ffffff body copy (Clarkson 400, 13px, #898989 for muted). Arrow icon (→) in bottom-right corner, #ffffff. Cards are equal-width in a 4-col grid with ~24px gap.

### Stat Display Block
**Role:** Social proof numbers in black band section

Three-column layout on #000000 background. Massive number: Clarkson 300, ~80–100px, #ffffff. Period/comma rendered as small superscript element beside the digits. Label below: Clarkson 400, 12px, #898989 or #ffffff, uppercase. Numbers are the dominant visual — labels are subordinate.

### Section Header (Centered)
**Role:** Opening headline for light sections

Centered text block. Clarkson 300, 40–64px, #000000, tracking -0.05em. Optional subline in Clarkson 400, 15px, #898989, max-width 480px.

### Transparent Navigation Bar
**Role:** Persistent top header

Transparent background over hero photography, transitions to #000000 on scroll. Logo (squarespace wordmark + cube icon) left-aligned in #ffffff. Center nav items (Products, Solutions, Resources) with chevron dropdowns — Clarkson 400, 13px, #ffffff, uppercase. Right side: Log In text link + filled CTA. No visible background or border until scrolled.

### Category Image Card
**Role:** Hero-adjacent product preview tiles

Equal-width cards with 8px radius, showing a cropped website preview with pink (#ff8d8d approximate) category tag overlay in top-left. Sits at the bottom of the hero, partially overlapping the video frame edge. 3-card row.

## Do's and Don'ts

### Do
- Use weight 300 Clarkson at 40–72px for all display headlines — the whisper-weight is the brand's signature, not 700
- Set display tracking to -0.06em at 72px and scale proportionally down — never use default letter-spacing on large type
- Alternate sections between full #000000 and #ffffff backgrounds — the page rhythm is defined by black/white contrast, not color
- Use 0px border-radius on buttons and 8px on cards — the sharp-to-soft radius contrast is intentional
- Set 100px border-radius on all pill-shaped tabs, tags, and filter chips
- Let full-bleed photography or video carry the hero — never use a solid color or gradient hero background
- Center-align section headlines and CTAs in light sections; left-align in dark feature grids

### Don't
- Never introduce chromatic color to the palette — the system is 0% colorfulness by design
- Never use Clarkson at weight 700 or 800 — the brand voice caps at weight 500
- Never use a solid-color hero background — the first screen must always be photographic or video
- Never use pill-radius (100px) on rectangular buttons or cards — pills are exclusive to filter chips and tags
- Never set body copy below 14px or above #898989 on white — contrast hierarchy must stay clean
- Never use drop shadows on cards — depth comes from contrast against the canvas, not elevation
- Never add gradient backgrounds to UI components — the one detected gradient is decorative only (a soft blue-to-yellow-to-white fade), not a UI pattern

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Primary page canvas and light section backgrounds |
| 1 | Fog | `#dddddd` | Active pill-tab fill, subtle dividers, secondary card surfaces |
| 2 | Ash | `#898989` | Muted text and tertiary borders — non-surface, hierarchy only |
| 3 | Charcoal | `#2f2f2f` | Filled button background — the softest non-pure-black surface |
| 4 | Obsidian | `#000000` | Black section bands, dark feature cards, nav bar on scroll, text |

## Elevation

Squarespace deliberately avoids box-shadows. Depth is communicated through two mechanisms only: (1) alternating pure black and pure white section bands, and (2) full-bleed photography with no visible card edges. Cards have no drop shadow — they rely on 8px radius and the contrast of their content (dark imagery with white text) to feel distinct from the white canvas.

## Imagery

Full-bleed cinematic photography and video dominate. The hero is a real-world documentary-style frame (a barber cutting hair) — no studio lighting, no staged perfection. Dark feature card backgrounds use a mix of product UI screenshots (design editor, email client, domain search) and atmospheric photography (a white flower, geometric objects). Imagery always bleeds to the card edge with 8px corner clipping. No illustrations, no icons-as-decoration, no 3D renders. Icons are functional only (arrow indicators, chevron dropdowns, logo mark).

## Layout

Full-bleed hero with a single centered headline floating over video/photo. Black stats band follows, then a white section with centered headline + pill filter row + 3-column image card grid. Feature sections use a 4-column dark card grid on white canvas. Page max-width ~1200px for content blocks; hero and stats bands are 100% viewport width. Vertical rhythm is dramatic: 80–120px between major sections, 24–40px between content blocks within a section. Navigation is a transparent top bar that becomes solid black on scroll, with logo left, center menu, and dual CTAs right.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000 (on light) or #ffffff (on dark)
- Background: #ffffff (canvas) or #000000 (bands)
- Border: #dddddd (light) or #ffffff (dark)
- Muted text: #898989
- Accent: none — system is purely achromatic
- primary action: #2f2f2f (filled action)

**Example Component Prompts**

1. Create a hero section: full-bleed photographic background, overlaid with a centered headline "A website makes it real" in Clarkson 300, 72px, #ffffff, letter-spacing -0.06em. Below it, a transparent ghost button with 1px #ffffff border, Clarkson 400 14px uppercase #ffffff text, padding 16px 32px, 0px radius. Small caption "Start for free. No credit card required." in Clarkson 400 13px #ffffff below the button.

2. Create a stat display band: #000000 full-width background, padding 80px 0. Three columns centered. Each column: massive number in Clarkson 300, 80px, #ffffff (e.g. "1.M+" with the period as a small superscript dot). Label below in Clarkson 400 12px #898989 uppercase.

3. Create a category filter row: 8 pill-shaped tabs in a single horizontal row, 100px border-radius, padding 8px 18px each, 8px gap. Inactive: transparent bg, #000000 text, Clarkson 400 14px. Active: #dddddd background, #000000 text. Tabs: Services, Online Store, Invoicing, Scheduling, Donations, Memberships, Blog, Portfolio.

4. Create a dark feature card grid: 4 equal-width columns, 24px gap, on #ffffff canvas. Each card: 8px border-radius, full-bleed background image with dark overlay, padding 32px. White heading Clarkson 300 20px, body text Clarkson 400 13px #898989. Arrow icon (→) in bottom-right, #ffffff, 16px.

5. Create a transparent nav bar: full-width, transparent background, positioned absolute over hero. Left: logo (wordmark + cube icon) in #ffffff. Center: nav items in Clarkson 400 13px uppercase #ffffff with chevron indicators. Right: "Log In" text link in #ffffff + filled button with #ffffff background, #000000 text, Clarkson 500 13px uppercase, padding 12px 24px, 0px radius.

## Gradient System

Only one gradient detected in the entire system: a 90° linear fade from #ffffff through rgb(136, 188, 216) (soft cornflower) to rgb(243, 255, 193) (pale chartreuse) and back to #ffffff. This is a decorative atmospheric band — it appears as a subtle wash, never as a UI component fill. Do not extend this gradient system to other elements; it exists as a single editorial accent, not a repeatable pattern.

## Similar Brands

- **Apple** — Same cinematic full-bleed photography hero with centered large-weight-light headline floating over it; same uncompromising black/white section rhythm
- **Stripe** — Same monumental display typography with aggressive negative tracking; same 0% colorfulness confidence; same editorial whitespace
- **Aesop** — Same achromatic restraint, same reliance on serif/sans typographic contrast, same gallery-like page rhythm with full-bleed imagery
- **Mubi** — Same full-bleed photographic hero with white overlay text; same minimal nav with dual CTA pattern
- **SSENSE** — Same weight-300-at-72px display treatment and same near-monochrome editorial system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-charcoal: #2f2f2f;
  --color-ash: #898989;
  --color-fog: #dddddd;
  --color-slate: #999999;

  /* Typography — Font Families */
  --font-clarkson: 'Clarkson', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clarkson-serif: 'Clarkson Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.001px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.04px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -0.05px;
  --text-display: 72px;
  --leading-display: 0.93;
  --tracking-display: -0.06px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32-40px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-3xl: 30px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 100px;
  --radius-inputs: 8px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #dddddd;
  --surface-ash: #898989;
  --surface-charcoal: #2f2f2f;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-charcoal: #2f2f2f;
  --color-ash: #898989;
  --color-fog: #dddddd;
  --color-slate: #999999;

  /* Typography */
  --font-clarkson: 'Clarkson', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clarkson-serif: 'Clarkson Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.001px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.04px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -0.05px;
  --text-display: 72px;
  --leading-display: 0.93;
  --tracking-display: -0.06px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-3xl: 30px;
  --radius-full: 100px;
}
```
