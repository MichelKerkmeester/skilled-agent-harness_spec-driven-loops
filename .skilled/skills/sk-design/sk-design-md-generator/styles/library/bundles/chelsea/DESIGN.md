# CHELSEA — Style Reference
> Black-box cinema with a single blue spotlight — the roster plays, the chrome disappears.

**Theme:** dark

Chelsea is a talent roster presented as a black-box cinema: full-bleed cinematic photography sits directly on pure black, with a single vivid blue (#4490ff) as the only chromatic voice. The interface is deliberately skeletal — a thin top bar, a tiny floating blue dot, and a name list rendered in the accent color — letting the roster's work carry all visual weight. Typography is one family (Neue Haas Unica Pro) in two weights, set with tight 1.0–1.15 line-heights so the type reads like a film credit rather than a website. Everything that can be invisible is invisible: no borders on the canvas, no shadows, no card containers, no section backgrounds — the only surface transition is the sudden black-to-photography cut. Buttons and links are pill-shaped (9999px radius) and extremely compact, reinforcing the sense that this is a viewing room, not a product dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, all section backgrounds, negative space — the floor everything sits on |
| Spotlight Blue | `#4490ff` | `--color-spotlight-blue` | Primary action, interactive links, roster name listings, focal dot indicator, highlighted borders — the only chromatic voice in an otherwise monochrome system |
| Carbon Slate | `#1f2937` | `--color-carbon-slate` | Headings, heavy borders, structural borders on dark surfaces — near-black with a slight cool cast for separation from the pure black canvas |
| Bone White | `#f4efe9` | `--color-bone-white` | Warm off-white for text and subtle borders — softer than pure white, evoking film stock and gallery walls against the black canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Maximum-contrast text and dividers when absolute clarity is needed over photography or dark media |
| Ash Gray | `#e5e7eb` | `--color-ash-gray` | Light-mode surfaces, neutral borders on cards or panels, secondary dividers — provides a paper-like counterpoint when a section lifts off the black canvas |

## Tokens — Typography

### Neue Haas Unica Pro — All UI and content type — nav labels at 14px, body at 16px, section headings at 32px, display at 48px · `--font-neue-haas-unica-pro`
- **Substitute:** Neue Haas Grotesk, Inter, Helvetica Neue
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 16px, 32px, 48px
- **Line height:** 1.00–1.50
- **Letter spacing:** normal
- **Role:** All UI and content type — nav labels at 14px, body at 16px, section headings at 32px, display at 48px

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| heading-sm | 32px | 1.12 | — | `--text-heading-sm` |
| display | 48px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 32 | 32px | `--spacing-32` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| links | 9999px |
| images | 0px |
| buttons | 9999px |

### Layout

- **Section gap:** 96px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Cinema-Full-Bleed Media Frame
**Role:** Hero and section media containers

Photographic or video content scaled edge-to-edge with zero margin, zero radius, zero border. The image bleeds off all four sides of the viewport, sitting directly on the #000000 canvas with no wrapper or frame.

### Thin Top Navigation Bar
**Role:** Primary site navigation

Single horizontal row of text links (Roster, Latest, Team, Collaborators) in 14px Neue Haas Unica Pro weight 400, #ffffff, spaced across the full viewport width with generous gaps. A 1px #1f2937 or hairline white rule separates it from the canvas. No logo block, no background fill — text floats on black.

### Focal Dot Indicator
**Role:** Brand punctuation and active-state marker

A small solid #4490ff circle (~12px diameter) placed inline with content — used as a near-logo near the nav, and as a visual anchor on key media frames. No border, no shadow, no label. Its job is to plant the brand color in a monochrome field.

### Pill Button / Pill Link
**Role:** All interactive controls

Fully rounded (9999px radius) controls. Default: 8px vertical / 16px horizontal padding, 12–14px Neue Haas Unica Pro weight 700. Two variants: (1) Outlined — 1px #4490ff border, transparent fill, #4490ff text; (2) Solid — #4490ff fill, #ffffff text. No shadow, no hover transform, no state gradient.

### Roster Name Listing
**Role:** Talent directory display

Names rendered in #4490ff, Neue Haas Unica Pro weight 400 at 32px with 1.12–1.15 line-height, flowing as a continuous text block. Regional labels (US, UK) sit to the left as small #4490ff caps. No bullets, no dividers between names — periods separate them like a credit roll.

### Wordmark Lockup
**Role:** Brand identity stamp

The 'CHELSEA' wordmark set in three stacked lines (CH / EL / SEA.) at large size in Neue Haas Unica Pro weight 700, white, bottom-left anchored over imagery. The period after SEA. is deliberate — it functions as a redacted/censored signal and is part of the mark.

### Hairline Divider
**Role:** Section separation

1px line in #1f2937 or #ffffff at low opacity, used to separate the nav from the canvas and to section transitions where background color does not change. The only structural line in the system.

### Credit Caption
**Role:** Metadata under media

Small 12–14px Neue Haas Unica Pro weight 400, #f4efe9 or #4490ff, used for project titles, collaborator credits, or category labels. Often appears in the corners of media frames at 8–16px inset.

## Do's and Don'ts

### Do
- Use #4490ff as the only chromatic color in the system — every link, every accent, every focal dot uses it
- Set all interactive elements to 9999px border-radius for the pill shape that defines the brand
- Keep the canvas pure #000000; never introduce a card surface, a gray panel, or a light section mid-page
- Let media bleed edge-to-edge with zero margin, zero radius, and zero frame
- Use Neue Haas Unica Pro weight 400 for body and weight 700 only for the wordmark and button labels
- Set headlines and body at tight line-heights (1.0–1.15) to maintain the credit-roll density
- Use 8px for element gaps and 16px for component padding; jump to 96px between major sections

### Don't
- Do not introduce drop shadows, elevation layers, or card containers — the system is flat by design
- Do not add a second accent color or any warm tone; the palette is black + white + one blue
- Do not round images or media frames — they must be sharp rectangles bleeding to the viewport edge
- Do not use #0000ee or browser-default link blue; links must be #4490ff
- Do not add a visible logo block, nav background, or header bar — the nav is text floating on black
- Do not set body type above 1.5 line-height; the credit-roll feel depends on tight leading
- Do not introduce semantic colors (green/yellow/red) for status — the system has no UI states to encode

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Base page background — every section, every gap, every margin is this color |
| 1 | Media Surface | `#000000` | Photographic and video content replaces the void — no surface transition, the canvas IS the background behind media |

## Elevation

Zero elevation. The system treats depth as a sin: no shadows, no z-axis layering, no floating panels, no card lift. Media bleeds directly on the black canvas and type floats on the same plane. The single visual hierarchy device is the jump from #000000 to full-color photography, which is an absolute contrast rather than a soft elevation.

## Imagery

Photography and video are the entire visual system. Imagery is full-bleed, edge-to-edge, unmasked, with zero rounding and no frame. Treatment is cinematic and high-production: warm tungsten key lights, deep shadows, saturated color pockets against darker backgrounds — the aesthetic is music-video or indie film still, not corporate lifestyle. No illustration, no abstract graphics, no product shots. The people in the imagery are the roster — the work is self-portraiture of the talent. Imagery occupies 100% of the viewport in hero and section positions; there is no image-on-canvas composition, only image-as-canvas. A small blue focal dot is sometimes the only UI element overlaid on the photography.

## Layout

Full-bleed, edge-to-edge layout with no max-width container. The page reads as a vertical sequence of full-viewport-height screens: (1) a full-bleed photographic or video hero with a minimal top nav overlaid and a small wordmark bottom-left, (2) subsequent full-bleed media sections stacking vertically with generous 96px breathing gaps, (3) a terminal section that is pure black with a two-column text layout — tiny region labels (US, UK) left-aligned and a flowing block of talent names right-aligned. Navigation is a single thin horizontal row of four evenly-spaced text links with no background and no logo block. Content alignment is asymmetric: nav is spread across the full width, wordmark anchors bottom-left, text blocks pull left with a slight indent. The grid is implicit — there is no visible column structure, only full-width media and text that reads as a credit roll. Density is sparse between sections but tight within text blocks.

## Agent Prompt Guide

primary action: #4490ff (filled action)
Create a Primary Action Button: #4490ff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
QUICK COLOR REFERENCE
- Canvas/background: #000000
- Primary action / accent: #4490ff (pill buttons, links, focal dot, roster names)
- Body text on canvas: #ffffff
- Warm text/border: #f4efe9
- Heavy border / structural: #1f2937
- Light surface (rare): #e5e7eb

EXAMPLE COMPONENT PROMPTS

1. Full-bleed hero section: pure #000000 canvas, top nav in 14px Neue Haas Unica Pro weight 400 #ffffff evenly spaced across the viewport (Roster, Latest, Team, Collaborators) with a 1px #1f2937 hairline beneath. A 12px #4490ff solid circle sits inline at the far left of the nav. Main visual is a full-viewport photograph bleeding to all four edges with zero radius. Wordmark 'CHELSEA' stacked in three lines (CH / EL / SEA.) in 48px Neue Haas Unica Pro weight 700 #ffffff, bottom-left, 32px inset.

2. Pill link button: 1px #4490ff border, transparent fill, 16px horizontal / 8px vertical padding, 9999px border-radius, 14px Neue Haas Unica Pro weight 700 #4490ff text. No shadow, no hover state change beyond opacity.

3. Roster name listing: two-column layout on #000000. Left column: small 12px Neue Haas Unica Pro weight 700 #4490ff region labels (US, UK), 16px left padding. Right column: continuous block of names in 32px Neue Haas Unica Pro weight 400 #4490ff, line-height 1.12, separated by periods and spaces, no bullets or dividers.

4. Caption over media: 12px Neue Haas Unica Pro weight 400 #f4efe9, positioned 16px from the bottom-left corner of a full-bleed media frame, no background plate.

5. Section transition: from one full-bleed media screen to the next, separated by 96px of pure #000000 void with no divider, no label, no indicator — the gap itself is the transition.

## Similar Brands

- **Anonymous Content** — Same black-canvas cinema aesthetic with full-bleed directorial photography and minimal text UI
- **RSA Films** — Talent roster presented as a viewing room — dark mode, pill links, single accent color, no card containers
- **Wieden+Kennedy** — Agency portfolio treated as art exhibition: black canvas, edge-to-edge imagery, skeletal nav
- **Somesuch** — Director roster with the same credit-roll name presentation and monochrome dark UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-spotlight-blue: #4490ff;
  --color-carbon-slate: #1f2937;
  --color-bone-white: #f4efe9;
  --color-pure-white: #ffffff;
  --color-ash-gray: #e5e7eb;

  /* Typography — Font Families */
  --font-neue-haas-unica-pro: 'Neue Haas Unica Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.12;
  --text-display: 48px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-96: 96px;

  /* Layout */
  --section-gap: 96px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-links: 9999px;
  --radius-images: 0px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-media-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-spotlight-blue: #4490ff;
  --color-carbon-slate: #1f2937;
  --color-bone-white: #f4efe9;
  --color-pure-white: #ffffff;
  --color-ash-gray: #e5e7eb;

  /* Typography */
  --font-neue-haas-unica-pro: 'Neue Haas Unica Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.12;
  --text-display: 48px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
