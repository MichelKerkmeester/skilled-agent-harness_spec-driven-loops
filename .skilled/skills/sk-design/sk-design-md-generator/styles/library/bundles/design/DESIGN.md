# Design — Style Reference
> neon green glyph in a dark void

**Theme:** dark

Cash App's design system is a dark-mode monolith: near-black canvas, white type that ranges from whisper-quiet 10px labels to 122px display monuments, and exactly one chromatic accent — electric Cash Green — that appears almost never but defines the brand when it does. Depth is communicated through typographic scale and whitespace rather than shadows or layered surfaces; hairline silver borders (#e5e7eb) at sub-1px visual weight separate regions without breaking the void. The type scale is intentionally extreme: no medium headings exist between 16px body and 86px display, forcing dramatic contrast that makes every page feel like an editorial spread. Spacing is generous (64px section gaps, 30px internal padding) and density stays low — this system rewards restraint and punishes decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, inverted surfaces, display type on light blocks |
| Snow | `#ffffff` | `--color-snow` | Primary text, high-contrast headings, logo lockup fills |
| Mist | `#e5e7eb` | `--color-mist` | Hairline dividers, section borders, card outlines, link borders — the only structural separator in the system |
| Slate | `#858585` | `--color-slate` | Muted body text, secondary labels, list items, metadata |
| Fog | `#b3b3b3` | `--color-fog` | Tertiary text, disabled states, icon strokes, subtle UI annotations |

## Tokens — Typography

### CashSans — All text — Cash App's custom geometric sans. The 400 weight handles body and utility; 500 for sub-labels and nav; 700 reserved for extreme display moments. The type scale is deliberately bimodal: micro (10–16px) for functional UI and monumental (86–122px) for editorial display, with nothing in between. · `--font-cashsans`
- **Substitute:** Inter, SF Pro Display, or General Sans
- **Weights:** 400, 500, 700
- **Sizes:** 10px, 12px, 16px, 86px, 117px, 122px
- **Line height:** 1.00 (display) / 1.50 (body & utility)
- **Letter spacing:** -0.015em across all sizes
- **Role:** All text — Cash App's custom geometric sans. The 400 weight handles body and utility; 500 for sub-labels and nav; 700 reserved for extreme display moments. The type scale is deliberately bimodal: micro (10–16px) for functional UI and monumental (86–122px) for editorial display, with nothing in between.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | -0.15px | `--text-caption` |
| body | 16px | 1.5 | -0.24px | `--text-body` |
| heading-lg | 86px | 1 | -1.29px | `--text-heading-lg` |
| display | 117px | 1 | -1.755px | `--text-display` |
| display-xl | 122px | 1 | -1.83px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 15px |
| buttons | 0px |

### Layout

- **Section gap:** 64px
- **Card padding:** 20-30px
- **Element gap:** 12px

## Components

### Display Heading
**Role:** Hero and section titles

CashSans 700, 86–122px, line-height 1.0, letter-spacing -0.015em. Color: #ffffff. Sets editorial tone with monumental scale; never wraps below two lines. No medium-weight headings exist — this is the heading.

### Body Paragraph
**Role:** Descriptive content, explanations

CashSans 400, 16px, line-height 1.5, letter-spacing -0.015em. Color: #ffffff for primary, #b3b3b3 for secondary. Max-width should constrain reading measure; comfortable leading compensates for tight tracking.

### Micro Label
**Role:** Captions, metadata, section indices, footnotes

CashSans 500, 10–12px, line-height 1.5, letter-spacing -0.015em. Color: #858585. Uppercase optional. The second pole of the bimodal type scale — whisper-quiet against the display monuments.

### Hairline Divider
**Role:** Section separation, content boundaries

1px solid #e5e7eb. Full-width or inset. The only structural element separating regions — no cards, no shadows, no background fills. Dividers carry the entire structural load.

### Ghost Link
**Role:** Inline navigation, cross-references

CashSans 400, 16px, #ffffff. No underline by default; underline appears on hover. Inherits the flat, borderless language — no chip, no background, no arrow unless the link leaves the site.

### Muted Link
**Role:** Secondary navigation, footer links

CashSans 400, 12–16px, #858585. Same interaction model as ghost link but de-emphasized. Used for utility navigation where the user is leaving the primary content path.

### Logo Lockup
**Role:** Brand mark, app icon, favicon

The $ glyph in Cash Green (#00d54b) on the dark canvas, or inverted (#000000) on white inverted blocks. Rounded square container with 15px radius. Typically 48–80px display size. The only element that uses brand green.

### List Item
**Role:** Enumerated content, navigation menus, spec lists

CashSans 400, 12–16px, #ffffff or #858585. 1px #e5e7eb bottom border on each item. 20–30px vertical padding per item. Minimal hierarchy — no bullets, no icons, no indentation unless nested.

### Full-Bleed Section
**Role:** Page-level content blocks

100% width, #000000 background, 64px vertical padding (top and bottom). No max-width container — content sits on the raw canvas edge. Type provides internal structure.

### Rounded Image
**Role:** Product visuals, illustrative content

15px border-radius. No border, no shadow. The only radius in the system — a deliberate single-value choice that keeps the geometric language sharp while softening visual content.

### Icon
**Role:** UI affordances, decorative marks

CashSans glyphs or custom stroke icons. 1–1.5px stroke weight, #ffffff or #b3b3b3. No fill icons. Sized to match adjacent type (12–16px for inline, up to 24px for standalone).

## Do's and Don'ts

### Do
- Use #000000 as the page canvas for all primary screens; the dark void is the system's foundation
- Set display type at 86–122px in CashSans 700 with -0.015em tracking and line-height 1.0
- Separate content regions with 1px #e5e7eb hairline dividers — never with cards, shadows, or background fills
- Reserve Cash Green (#00d54b) for the $ logo and singular signature moments; one appearance per screen maximum
- Use 64px vertical padding for section gaps and 20–30px for internal content padding
- Apply 15px border-radius exclusively to images and logo containers; keep all other elements sharp-edged
- Maintain the bimodal type scale: jump from 16px body directly to 86px display with no intermediate heading sizes

### Don't
- Do not introduce box-shadows, drop-shadows, or glow effects — depth comes from contrast and scale only
- Do not use Cash Green on text, borders, or large fills — it loses impact at scale and belongs only in the logo
- Do not create medium-weight headings (20–40px range) — the gap between 16px and 86px is the system
- Do not add background colors to cards, buttons, or panels — everything sits flush on #000000
- Do not use border-radius on buttons, tags, or inputs — keep geometry sharp except for the 15px image/logo radius
- Do not exceed three text colors per screen (#ffffff, #b3b3b3, #858585) — the hierarchy is strict
- Do not use light theme surfaces except for rare inverted blocks; the dark canvas is non-negotiable

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#000000` | Full-bleed page background; the dark void the entire system sits on |
| 2 | Inverted Block | `#ffffff` | Inverted content panels (rare) — white blocks on the black canvas for emphasis |

## Elevation

No shadows. Depth is achieved exclusively through hairline borders (#e5e7eb at 1px), whitespace, and extreme type-scale contrast. The dark canvas eliminates the need for elevated cards — everything sits flush on the void.

## Imagery

The visual language is almost entirely typographic and flat. The only chromatic element is the Cash Green $ logo mark. Imagery, when present, uses the 15px border-radius and sits directly on the black canvas without frames, captions, or supporting graphics. No photography, no illustration system, no decorative gradients — the void and the type do all the work.

## Layout

Full-bleed, edge-to-edge layout with no max-width container. Sections are separated by 64px vertical padding and hairline dividers rather than alternating background bands. The page rhythm is editorial: large white display type on black, generous breathing room, minimal navigation chrome. Content stacks vertically with centered alignment in hero moments. No card grids, no multi-column feature layouts — the system is a single-column editorial canvas. Navigation, when present, sits as a flat top bar with ghost links.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #b3b3b3 (secondary), #858585 (muted)
- background: #000000
- border: #e5e7eb
- accent: #00d54b (Cash Green — logo and signature moments only)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Create a display heading: CashSans 700, 117px, line-height 1.0, letter-spacing -1.755px, color #ffffff on #000000 background. Full-bleed, 64px vertical padding above and below.
2. Create a body text block: CashSans 400, 16px, line-height 1.5, letter-spacing -0.24px, color #b3b3b3, max-width 720px, 20px top padding.
3. Create a micro label: CashSans 500, 10px, line-height 1.5, letter-spacing -0.15px, color #858585, uppercase optional.
4. Create a hairline divider: 1px solid #e5e7eb, full-width, with 30px vertical margin on each side.
5. Create a logo lockup: $ symbol in #00d54b on #000000 canvas, 15px border-radius container, 64px display size, centered alignment.

## Similar Brands

- **Linear** — Dark canvas with strict type-driven hierarchy and minimal chromatic accents
- **Vercel** — Black background, oversized display type, hairline structural dividers, near-zero decoration
- **Arc Browser** — Dark void aesthetic with one electric accent color and geometric type at extreme scales
- **Stripe** — Restraint-first system with generous spacing and type as the primary visual element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-snow: #ffffff;
  --color-mist: #e5e7eb;
  --color-slate: #858585;
  --color-fog: #b3b3b3;

  /* Typography — Font Families */
  --font-cashsans: 'CashSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: -0.15px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-heading-lg: 86px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.29px;
  --text-display: 117px;
  --leading-display: 1;
  --tracking-display: -1.755px;
  --text-display-xl: 122px;
  --leading-display-xl: 1;
  --tracking-display-xl: -1.83px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-64: 64px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 20-30px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-xl: 15px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 15px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-inverted-block: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-snow: #ffffff;
  --color-mist: #e5e7eb;
  --color-slate: #858585;
  --color-fog: #b3b3b3;

  /* Typography */
  --font-cashsans: 'CashSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: -0.15px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.24px;
  --text-heading-lg: 86px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.29px;
  --text-display: 117px;
  --leading-display: 1;
  --tracking-display: -1.755px;
  --text-display-xl: 122px;
  --leading-display-xl: 1;
  --tracking-display-xl: -1.83px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-xl: 15px;
}
```
