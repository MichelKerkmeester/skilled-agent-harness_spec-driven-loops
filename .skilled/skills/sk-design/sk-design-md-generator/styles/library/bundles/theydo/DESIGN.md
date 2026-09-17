# TheyDo — Style Reference
> Blush editorial spread with magenta confetti. Warm pink paper, serif headlines, a single hot-pink accent that only outlines and whispers — never shouts.

**Theme:** light

TheyDo reads as an editorial product page printed on warm blush paper: a soft #fce7f3 canvas (never cold white) carries a confident serif headline (Wulkan) that pairs with a pragmatic sans (DM Sans) for body and UI. The visual identity is built on a single saturated hot-pink (#e82183) used exclusively as outline, stroke, and italic accent — never as a filled surface — which keeps the interface calm while still feeling branded. Floating magenta diamond motifs (echoing the TheyDo logo mark) scatter across the hero like confetti, establishing a playful geometry that recurs in card borders and section dividers. Components are flat and border-driven: 8px corners, 1px hairline rules (#c6c3c3 or pink tints), no shadows, and dark charcoal filled buttons (#131110) as the single primary action. The rhythm is generous — 80px between sections, 15–20px within cards — producing a spacious, magazine-like cadence rather than a dense SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Paper | `#fce7f3` | `--color-blush-paper` | Primary page canvas, hero washes, and large background blocks — the warm off-white that replaces cold #ffffff in most full-page contexts |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, button text on dark fills, and the contrast layer that sits on top of the blush canvas inside containers |
| Charcoal Ink | `#131110` | `--color-charcoal-ink` | Primary text, filled primary-action buttons (Get a demo, Explore Ask TheyDo), and the nav's dark CTA — the heaviest value in the system |
| Black | `#000000` | `--color-black` | Secondary text color, icon strokes, and sharp typographic accents where maximum weight is needed without warmth |
| Graphite | `#56504d` | `--color-graphite` | Body text, nav labels, and list copy — slightly warmer than pure black, carries the paragraph voice |
| Stone | `#7b7674` | `--color-stone` | Muted helper text, secondary link color, and disabled-state labels — the quietest text tier |
| Smoke | `#888381` | `--color-smoke` | Tertiary body and caption text — barely darker than Stone, used for timestamp-style metadata |
| Ash | `#625c5b` | `--color-ash` | Deep muted text for sub-labels and fine print |
| Hairline | `#c6c3c3` | `--color-hairline` | The dominant border color (2,700+ occurrences) — 1px dividers, card edges, list separators, link underlines. The structural skeleton of every layout |
| Mist | `#e8e8e8` | `--color-mist` | Secondary card borders and subtle internal dividers where Hairline would feel too heavy against the blush canvas |
| Magenta Pop | `#e82183` | `--color-magenta-pop` | The single brand accent — italic headline words, decorative diamond strokes, icon outlines, and outlined/ghost action borders. Never used as a filled surface or background |
| Rose Whisper | `#fad6e9` | `--color-rose-whisper` | Pink-tinted card borders that carry the magenta family into container edges without the visual weight of the vivid hue |
| Rose Glow | `#f9b4db` | `--color-rose-glow` | Mid-saturation pink border accent for highlighted cards and decorative borders that need more presence than Rose Whisper |

## Tokens — Typography

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 15px, 16px
- **Line height:** 1.2, 1.25, 1.5
- **Role:** Times — detected in extracted data but not described by AI

### Wulkan — Display and heading serif — carries the editorial voice. Used for hero headlines, section titles, and large numerical callouts. The aggressive negative tracking (-0.035em at 72px) makes the letterforms lock together into a sculpted block rather than a loose paragraph. Wulkan is custom; a close substitute is GT Super or Tobias. · `--font-wulkan`
- **Substitute:** GT Super (Bold) or Tobias
- **Weights:** 400, 500
- **Sizes:** 19px, 24px, 32px, 36px, 40px, 48px, 60px, 72px
- **Line height:** 1.10–1.25
- **Letter spacing:** -0.035em at 72px → -0.004em at 19px (tighter as size grows)
- **Role:** Display and heading serif — carries the editorial voice. Used for hero headlines, section titles, and large numerical callouts. The aggressive negative tracking (-0.035em at 72px) makes the letterforms lock together into a sculpted block rather than a loose paragraph. Wulkan is custom; a close substitute is GT Super or Tobias.

### DM Sans — Body, UI, and navigation sans-serif — the workhorse. Paragraph copy at 16–18px/400, nav labels and buttons at 14–15px/500, and bold emphasis at 600–700. The tight tracking even at small sizes gives the UI a crisp, intentional feel rather than a relaxed default. · `--font-dm-sans`
- **Substitute:** Inter or General Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14px, 15px, 16px, 17px, 18px
- **Line height:** 1.33–1.60
- **Letter spacing:** -0.014em at 18px → -0.005em at 14px (mild tightening, barely perceptible at body sizes)
- **Role:** Body, UI, and navigation sans-serif — the workhorse. Paragraph copy at 16–18px/400, nav labels and buttons at 14–15px/500, and bold emphasis at 600–700. The tight tracking even at small sizes gives the UI a crisp, intentional feel rather than a relaxed default.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | -0.07px | `--text-caption` |
| body | 16px | 1.5 | -0.112px | `--text-body` |
| body-lg | 18px | 1.56 | -0.252px | `--text-body-lg` |
| subheading | 24px | 1.25 | -0.456px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.768px | `--text-heading-sm` |
| heading | 40px | 1.17 | -1.16px | `--text-heading` |
| heading-lg | 48px | 1.16 | -1.392px | `--text-heading-lg` |
| display | 72px | 1.1 | -2.52px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 176 | 176px | `--spacing-176` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 8px |
| buttons | 8px |
| small-chips | 5px |
| decorative-shapes | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 15px

## Components

### Filled Primary Button
**Role:** Primary action (Get a demo, Explore Ask TheyDo)

Charcoal #131110 background, white #ffffff text, 8px radius, 15px vertical / 20px horizontal padding, DM Sans 15px weight 500. The only dark filled surface in the system — appears once per screen as the dominant CTA. No shadow, no border.

### Outlined Magenta Button
**Role:** Secondary brand action with color

Transparent background, 1px border in Magenta Pop #e82183, text in #e82183, 8px radius, 15px/20px padding, DM Sans 15px weight 500. Used when the action is brand-relevant but secondary to the dark filled CTA.

### Outlined Neutral Button
**Role:** Tertiary action (Talk to a person, Login)

Transparent background, 1px border in Hairline #c6c3c3, text in Charcoal #131110, 8px radius, 15px/20px padding. The quiet ghost variant — always paired with a dark filled CTA.

### Nav Bar
**Role:** Top-level site navigation

Horizontal bar on blush canvas, 15px padding, DM Sans nav items at 15px weight 500 in Graphite #56504d. The TheyDo diamond logo sits left; the dark filled 'Get a demo' button sits right. No drop shadow, no sticky background change.

### Hero Headline
**Role:** Page-top title with italic accent

Wulkan 72px weight 400 (or 500), tracking -2.52px, color #131110. One word is set in italic Magenta Pop #e82183 as the editorial accent. Subhead below in DM Sans 18px weight 400 in Graphite #56504d. Centered alignment, 80px vertical breathing room.

### Diamond Motif
**Role:** Decorative geometric element

Rotated squares (45°) in two sizes: small at ~15px, large at ~40px, scattered asymmetrically around the hero. Filled in Magenta Pop #e82183, Rose Glow #f9b4db, or Rose Whisper #fad6e9. Echoes the TheyDo logo mark — a signature visual device.

### Pink-Bordered Card
**Role:** Feature or content card with brand-tinted edge

White #ffffff surface, 1px border in Rose Whisper #fad6e9 or Rose Glow #f9b4db, 8px radius, 20px padding. Title in DM Sans 16px weight 600 in Charcoal, body in DM Sans 15px weight 400 in Graphite. No shadow — the colored border is the elevation signal.

### Neutral Card
**Role:** Standard content container

White #ffffff surface, 1px border in Mist #e8e8e8, 8px radius, 20px padding. Used for product UI panels, journey map previews, and grouped content blocks. Flat — no shadow.

### Client Logo Strip
**Role:** Social proof — 'world's leading brands' band

Blush canvas background, 30px vertical padding, centered Wulkan subhead ('The world's leading brands run on experience intelligence'), then a 2-row grid of monochrome black logos at consistent height. No card containers, no borders — logos float on the pink.

### Section Header
**Role:** Subsection title with centered alignment

Wulkan 40–48px weight 400, tracking -1.16 to -1.39px, Charcoal #131110. Centered on the page with 15–20px gap to a Graphite #56504d subhead in DM Sans 18px. Optional Magenta Pop diamond cluster above the headline as a visual entry point.

### Forrester / Award Badge Block
**Role:** Third-party validation card

White card with 8px radius, 1px Hairline border, 20px padding. Left column: Wulkan headline with one word in Magenta Pop italic. Right column: the award badge as a contained image. No decorative diamonds in this variant — it sits inside a structured card.

### Floating Prompt Bubble
**Role:** Interactive product demo element

White surface, 8px radius, 1px Hairline border, 15px padding. Contains a DM Sans prompt label and a magenta-accented action button. Positioned to overlap or sit beside a product screenshot — a bridge between the static page and the live tool.

### Journey Card Grid
**Role:** 4-column feature explanation

Four equal-width Neutral Cards in a single row, 30px gap, each with a short Wulkan-or-DM-Sans-bold label and a one-line DM Sans description. Connected below by a dashed/dotted Hairline line to a row of diamond-shaped capability cards — the only place the grid breaks symmetry.

## Do's and Don'ts

### Do
- Use the Charcoal #131110 filled button as the single dark surface in any view — one per screen, never two side by side.
- Set the primary headline in Wulkan and never let it exceed 72px on the largest display — beyond that, the tracking breaks.
- Apply Magenta Pop #e82183 only as outline, stroke, or italic accent — never as a filled background, badge fill, or text color on a colored ground.
- Default the page canvas to Blush Paper #fce7f3; reserve #ffffff for card surfaces that need to lift off the canvas.
- Use Rose Whisper #fad6e9 or Rose Glow #f9b4db for card borders when the card sits on the blush canvas and needs to feel on-brand without a dark stroke.
- Maintain 80px between major sections and 15–20px within cards — the spacious cadence is the difference between editorial and dashboard.
- Place 1–3 magenta diamond motifs near the hero or section transitions to signal the brand geometry; never use more than a handful per viewport.

### Don't
- Do not set the page background to pure #ffffff — the blush canvas is the brand's warm identity; cold white makes the site feel generic.
- Do not use Magenta Pop #e82183 as a filled button background, badge fill, or large solid block — it becomes visually aggressive and breaks the whisper-loud rhythm.
- Do not add drop shadows, glows, or blur effects to cards or buttons — the system is flat by design and elevation is expressed through border and surface color.
- Do not mix more than two border colors in a single card (e.g. Hairline + pink tint) — the visual noise competes with the editorial calm.
- Do not set body copy below 15px or use line-heights tighter than 1.45 — the generous leading is part of the magazine cadence.
- Do not center-align body paragraphs longer than two lines — use left-align for paragraphs, reserve center-align for headlines and short subheads.
- Do not introduce a third typeface or a new accent color — the system is built on the Wulkan/DM Sans pair and the single magenta accent; additions dilute the identity.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Blush Canvas | `#fce7f3` | Page-wide background — the warm off-white that defines the entire site's atmosphere |
| 1 | Card White | `#ffffff` | Elevated card surfaces, content containers, and product UI panels sitting on the canvas |
| 2 | Ink Surface | `#131110` | Filled primary-action buttons — the only dark surface in the system, used sparingly for maximum contrast |

## Elevation

The system is deliberately shadowless. Depth is communicated through surface color shifts (Blush Paper → Card White → Ink Surface) and border color (Hairline for structural, pink tints for brand-aware). A single 1px line carries more visual weight in this system than a 12px blur shadow would — adding elevation would break the editorial, printed-on-paper feel.

## Imagery

Photography is minimal and product-focused: tight crops of real human faces used in floating circular avatars that compose the hero diamond cluster, and contained product-UI screenshots of the journey-mapping tool shown as white-surface panels with Hairline borders. No full-bleed lifestyle photography, no abstract gradients, no 3D renders. The dominant graphic device is the magenta diamond motif — rotated 45° squares scattered as decorative confetti in sizes from 8px to 40px, filled in Magenta Pop, Rose Glow, or Rose Whisper. Icons are outline-style at ~20px stroke weight, mono-color, using Magenta Pop for decorative or category icons and Charcoal for functional UI icons. The visual language is printed-page-meets-product-tool: human faces and product screenshots sit in white containers, while the pink paper and diamond confetti provide atmospheric branding around them.

## Layout

Centered max-width 1200px content column on a full-bleed Blush Paper canvas. The hero is a centered text stack (Wulkan headline, DM Sans subhead, two-button row) with diamond motifs scattered asymmetrically to the left and product-UI screenshots anchored to the right at a lower z-position. Below the hero, sections alternate between full-width pink bands and white-surface card rows at 80px vertical gaps. Client logos appear in a centered 2-row grid floating directly on the pink canvas with no card containers — the only time logos are not inside a surface. Card grids use 4 equal columns at 30px gap; feature sections use 2-column text+visual alternation. The nav is a single horizontal bar with no sticky behavior or background change. The overall rhythm is editorial: generous whitespace, centered titles, and one prominent visual element per section rather than dense information stacking.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #131110
- Text (body): #56504d
- Text (muted): #7b7674
- Background (canvas): #fce7f3
- Background (card): #ffffff
- Border (structural): #c6c3c3
- Accent (magenta): #e82183
- primary action: #131110 (filled action)

**3 Example Component Prompts**

1. *Hero headline with italic brand accent*: Wulkan 72px weight 400, tracking -2.52px, color #131110, centered. Set the second word in italic #e82183 as the editorial accent. Subhead in DM Sans 18px weight 400, #56504d, max-width 600px, centered, 15px gap below headline.

2. *Outlined magenta button*: 1px border #e82183, transparent background, text #e82183 in DM Sans 15px weight 500, 8px radius, 15px vertical and 20px horizontal padding. Pair with a dark #131110 filled button of identical dimensions to its left.

3. *Pink-bordered feature card*: White #ffffff surface, 1px border #fad6e9, 8px radius, 20px padding on all sides. Title in DM Sans 16px weight 600 #131110, body in DM Sans 15px weight 400 #56504d. No shadow. Place 3–4 of these in a row at 30px gap on the blush canvas.

## Similar Brands

- **Notion** — Same flat, border-driven card system on a warm off-white canvas with a single accent color and generous editorial spacing.
- **Linear** — Similar tight tracking on display type and the discipline of using one dark filled button as the sole primary action per view.
- **Pitch** — Shares the editorial serif headline + clean sans body pairing and the playful use of geometric decorative shapes scattered across the hero.
- **Loom** — Same warm approachable canvas color (off-white/pink) replacing cold pure white, with confident display type and minimal shadow usage.
- **Framer** — Uses a similarly restrained single-accent-color system with bold serif headlines and floating decorative geometric motifs in the hero.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-paper: #fce7f3;
  --color-pure-white: #ffffff;
  --color-charcoal-ink: #131110;
  --color-black: #000000;
  --color-graphite: #56504d;
  --color-stone: #7b7674;
  --color-smoke: #888381;
  --color-ash: #625c5b;
  --color-hairline: #c6c3c3;
  --color-mist: #e8e8e8;
  --color-magenta-pop: #e82183;
  --color-rose-whisper: #fad6e9;
  --color-rose-glow: #f9b4db;

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wulkan: 'Wulkan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.112px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --tracking-body-lg: -0.252px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.456px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.768px;
  --text-heading: 40px;
  --leading-heading: 1.17;
  --tracking-heading: -1.16px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: -1.392px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -2.52px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-176: 176px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 8px;
  --radius-buttons: 8px;
  --radius-small-chips: 5px;
  --radius-decorative-shapes: 20px;

  /* Surfaces */
  --surface-blush-canvas: #fce7f3;
  --surface-card-white: #ffffff;
  --surface-ink-surface: #131110;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-paper: #fce7f3;
  --color-pure-white: #ffffff;
  --color-charcoal-ink: #131110;
  --color-black: #000000;
  --color-graphite: #56504d;
  --color-stone: #7b7674;
  --color-smoke: #888381;
  --color-ash: #625c5b;
  --color-hairline: #c6c3c3;
  --color-mist: #e8e8e8;
  --color-magenta-pop: #e82183;
  --color-rose-whisper: #fad6e9;
  --color-rose-glow: #f9b4db;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wulkan: 'Wulkan', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.112px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --tracking-body-lg: -0.252px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.456px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.768px;
  --text-heading: 40px;
  --leading-heading: 1.17;
  --tracking-heading: -1.16px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: -1.392px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -2.52px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-176: 176px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
}
```
