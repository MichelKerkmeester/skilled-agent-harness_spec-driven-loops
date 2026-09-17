# Mezmo — Style Reference
> observatory at dawn

**Theme:** light

Mezmo uses a quiet observatory language: warm off-white canvases, generous whitespace, and a single confident violet as the sole chromatic voice. The interface is typographically driven — thin weight 300 Onest headlines, compact monospace for telemetry values — with color appearing sparingly as semantic punctuation (violet for emphasis, muted teal for primary action, amber/green for data states). Components are flat and border-defined rather than elevated; 5–8px radii and 1px hairline borders create a low-noise, instrument-panel feel. Density is compact but the overall rhythm is unhurried, with wide section gaps and an emphasis on data density within calm containers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Ink | `#0a090c` | `--color-deep-ink` | Primary text, card borders, list dividers, nav labels |
| Near-Black Green | `#031403` | `--color-near-black-green` | Secondary text, heavy borders, code-adjacent content |
| Bone White | `#e6e6e5` | `--color-bone-white` | Page canvas, outer section backgrounds |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, button text, elevated content blocks |
| Frost | `#f4f4f4` | `--color-frost` | Subtle surface fill, decorative washes |
| Stone | `#8a8a8a` | `--color-stone` | Muted helper text, inactive borders |
| Slate | `#696969` | `--color-slate` | Body secondary text, disabled labels |
| Ash | `#777777` | `--color-ash` | Body borders at 1px, low-priority dividers |
| Dust | `#d1d5db` | `--color-dust` | Card borders on elevated surfaces, input frames |
| Cinder | `#2d2d2d` | `--color-cinder` | Dark mode accents, badge fills, strong contrast borders |
| Smoke | `#5a5a5a` | `--color-smoke` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Iron | `#404040` | `--color-iron` | Dark badges, dense contrast text on tinted chips |
| Iris | `#7561b1` | `--color-iris` | Signature emphasis color — hero word highlights, key callouts, brand accents — the only saturated chromatic voice in the system |
| Coastal Teal | `#96beca` | `--color-coastal-teal` | Gray action color for filled buttons, selected navigation states, and focused conversion moments |
| Slate Blue | `#74a9b9` | `--color-slate-blue` | Decorative borders, icon strokes, secondary blue accents |
| Amber Glow | `#f4b811` | `--color-amber-glow` | Yellow outline accent for tags, dividers, and focused UI edges |
| Moss | `#9db161` | `--color-moss` | Green outline accent for tags, dividers, and focused UI edges |
| Lilac Mist | `#ccc6df` | `--color-lilac-mist` | Tinted card borders, violet-tinted shadow glows |
| Pale Aqua | `#d5e8ed` | `--color-pale-aqua` | Cool surface wash, hover state for primary buttons |
| Sand Sage | `#dfe4d1` | `--color-sand-sage` | Warm neutral surface, decorative section tint |
| Faded Aqua | `#b4cfd7` | `--color-faded-aqua` | Muted border tone, low-contrast decorative strokes |
| Dusk | `#3a344b` | `--color-dusk` | Dark violet text — used for emphasis on light surfaces |

## Tokens — Typography

### Onest Variable — All interface text — display headlines at weight 300 create a technical-confident tone; body at 16–18px weight 400; labels and micro UI at 11–13px weight 500. Weight 300 headlines are a signature anti-convention choice that makes the system feel like an instrument panel rather than a marketing page · `--font-onest-variable`
- **Substitute:** Inter, Geist, Satoshi
- **Weights:** 300, 400, 500, 600
- **Sizes:** 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 22, 24, 26, 30, 36, 48
- **Line height:** 1.00, 1.05, 1.13, 1.20, 1.23, 1.25, 1.33, 1.45, 1.50, 1.55
- **Letter spacing:** 0.04em at 9–11px (uppercase eyebrow labels); 0.06em at 10–12px (badge text); 0.12em at 9–10px (tracked micro UI)
- **Role:** All interface text — display headlines at weight 300 create a technical-confident tone; body at 16–18px weight 400; labels and micro UI at 11–13px weight 500. Weight 300 headlines are a signature anti-convention choice that makes the system feel like an instrument panel rather than a marketing page

### monospace (system) — Telemetry values, code snippets, configuration keys, metric labels in the product UI. Used at 10–12px weight 500 for data density; 0.057em tracking gives a technical, terminal-like read · `--font-monospace-system`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Berkeley Mono
- **Weights:** 300, 500, 600
- **Sizes:** 9, 10, 11, 12
- **Line height:** 1.50
- **Letter spacing:** 0.0570em
- **Role:** Telemetry values, code snippets, configuration keys, metric labels in the product UI. Used at 10–12px weight 500 for data density; 0.057em tracking gives a technical, terminal-like read

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 1.55 | 0.06px | `--text-micro` |
| caption | 13px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.45 | — | `--text-body` |
| subheading | 20px | 1.33 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.24px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.3px | `--text-heading` |
| heading-lg | 36px | 1.13 | -0.36px | `--text-heading-lg` |
| display | 48px | 1.05 | -0.48px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 5px |
| inputs | 5px |
| buttons | 5px |
| hairlines | 1px |
| large-cards | 14px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.2) 0px 2px 5px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.2) 2px 2px 8px 0px` | `--shadow-sm-2` |
| sm-3 | `rgba(0, 0, 0, 0.2) 2px 2px 5px 0px` | `--shadow-sm-3` |
| sm-4 | `rgba(10, 9, 12, 0.04) 0px 1px 4px 0px` | `--shadow-sm-4` |
| subtle | `rgba(10, 9, 12, 0.03) 0px 1px 3px 0px` | `--shadow-subtle` |
| lg | `rgba(117, 97, 177, 0.063) 0px 4px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Main call-to-action — e.g. "Get a demo", "Start building with AURA"

Background #96beca (Coastal Teal), text #ffffff or #0a090c at 16px Onest weight 500. 5px border-radius, 12px 24px padding (10px vertical / 20px horizontal variant). Subtle hover lift via rgba(0,0,0,0.2) 0px 2px 5px shadow. No border.

### Ghost Outline Button
**Role:** Secondary action — e.g. "Talk to an engineer"

Transparent background, 1px solid #031403 border, text #0a090c at 16px weight 500. 5px radius, 12px 24px padding. Sits adjacent to the primary filled button to create a two-button CTAs cluster.

### Top Navigation Bar
**Role:** Persistent header with logo, primary nav, and auth actions

Full-width white surface, 1px bottom border #d1d5db. Logo "mezmo+" in #0a090c with a violet + glyph (#7561b1). Nav items in Onest 14px weight 500, text #0a090c, 16px horizontal gap. Right side: "Sign In" text link + Primary Filled Button.

### Hero Stat Card
**Role:** Quantitative summary card in the hero — INGEST, DEDUPLICATE, CLUSTER, CONTEXT-READY

White card surface, 1px border #d1d5db, 8px radius. Title in monospace 10–11px weight 500 with 0.057em tracking and uppercase treatment. Metric value in monospace 22–26px weight 600, #0a090c. Colored horizontal progress bar beneath (amber #f4b811, teal #96beca, violet #7561b1, moss #9db161) showing proportional states.

### Code Window
**Role:** Embedded code/configuration snippet panel

Light surface (#f4f4f4 or #ffffff), 8px radius, 1px border #d1d5db. macOS-style traffic-light dots in red/yellow/green. Body text in monospace 11–12px weight 400, with syntax highlighting in #7561b1 (violet for keys), #74a9b9 (blue for strings), #9db161 (green for values), and #c04040 (red for errors). 16px internal padding.

### Pastel Gradient Banner
**Role:** Section divider / eyebrow strip above major sections

Horizontal band with soft 90deg linear gradient cycling through rgba(147,131,194,0.376) → rgba(116,169,185,0.376) → rgba(147,131,194,0.376) → rgba(157,177,97,0.376). Acts as a chromatic breath between content blocks without competing with content.

### Agent Timeline Step
**Role:** Node in the "Open-source agent control plane" flow

Circular icon node (24–32px) in #74a9b9 or #7561b1 fill, label below in Onest 12–13px weight 500. Connected by 1px horizontal divider line #d1d5db. Active state: filled color; inactive: outlined 1px border only.

### Tab / Pill Selector
**Role:** Entry-point selector — "Single Agent", "Agent Team", etc.

Transparent background, 1px solid #031403 border, 5px radius, 10px 16px padding. Text in Onest 13px weight 500, #0a090c. Active state: #0a090c background, #ffffff text. Horizontal flex row with 8px gaps.

### Logo Lockup
**Role:** Brand mark — "mezmo" wordmark with + glyph

Wordmark in Onest weight 500, #0a090c. The + symbol rendered in #7561b1 (Iris) at roughly 1.2x the cap height, positioned as a superscript accent. Functions as a monogram and the only place the violet appears at brand-logotype scale.

### Section Header
**Role:** Intro block for a content section — "Pick your entry point"

Eyebrow label in Onest 11px weight 500, uppercase, 0.06em tracking, #7561b1 or #8a8a8a. Main heading in Onest weight 300, 36–48px, #0a090c, tight -0.36 to -0.48px tracking. Optional subhead in 18px weight 400, #696969.

### Metric Stat Strip
**Role:** Inline KPIs — "<1min total investigation", "<1K signals", "<$1 per investigation"

Three or more inline stats in a horizontal flex row. Values in monospace 22–26px weight 600 colored by semantic state: moss #9db161 for positive, violet #7561b1 for emphasis. Labels in Onest 13px weight 400, #696969. Separated by 1px vertical dividers or 24px gaps.

### Feature Card
**Role:** Product capability card

White surface (#ffffff), 1px border #d1d5db or #ccc6df, 8px radius. Internal padding 24px. Optional violet-tinted shadow rgba(117,97,177,0.063) 0px 4px 20px for elevated variant. Title in Onest 18–20px weight 500, body in 16px weight 400.

### Eyebrow Tag
**Role:** Small all-caps label — "AURA", "MEZMO", "CONTEXT-READY"

5px radius, 4–6px vertical / 8–10px horizontal padding. Background: #e6e5ee or transparent with 1px #ccc6df border. Text in Onest 9–10px weight 600, uppercase, 0.12em tracking, #0a090c or #7561b1.

### Progress Bar (Data Signal)
**Role:** Colored horizontal bar beneath metric cards

4–6px height, full container width, 5px radius (or pill = 9999px). Colors drawn from the chromatic accent set: #f4b811 (amber), #96beca (teal), #7561b1 (violet), #9db161 (moss). Represents deduplication %, clustering volume, etc.

## Do's and Don'ts

### Do
- Use #7561b1 (Iris) as the sole emphasis color — apply it to one word or one element per section, never to a button background or body paragraph
- Set headlines at Onest weight 300 with -0.4 to -0.5px tracking; this whisper-weight is the system's most distinctive typographic move
- Use 5px radius for all buttons, badges, and pills; 8px for cards; 14px only for large feature cards
- Pair #96beca filled buttons with #031403 ghost outline buttons for any two-button CTA cluster
- Reserve monospace for telemetry values, code, and metric numbers — never for marketing copy
- Maintain 80px section gaps between major content blocks; the system needs air to read as an instrument panel
- Use 0.04–0.12em letter-spacing only on uppercase 9–12px text; never apply tracking to sentence-case body copy

### Don't
- Do not use #7561b1 as a button background — Iris is for emphasis only, not action
- Do not mix #96beca and #74a9b9 as both primary actions; Coastal Teal is the sole primary action color
- Do not apply shadows heavier than rgba(0,0,0,0.2) 0px 2px 5px — the system is flat-first, border-defined
- Do not use weight 600 or 700 for headlines; weight 300 is the signature move and carries the system's identity
- Do not use the chromatic accents (#f4b811, #9db161, #74a9b9) outside of data-visualization contexts — they signal signal-state, not decoration
- Do not set body text below 16px or above 20px; the 16–18px band is the readable core
- Do not introduce new radii between 5px and 8px — the two-tier system is intentional

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e6e6e5` | Outer page background, banded section backgrounds |
| 1 | Paper | `#ffffff` | Cards, buttons, input fields, code panels |
| 2 | Frost | `#f4f4f4` | Inline decorative fills, code body backgrounds, light accent surfaces |
| 3 | Tinted Wash | `#dfe4d1` | Warm-tinted section bands, hover state surfaces |
| 4 | Lilac Mist | `#e7e5ee` | Violet-tinted wash for emphasis sections, badge backgrounds |

## Elevation

- **Primary Filled Button:** `rgba(0, 0, 0, 0.2) 0px 2px 5px 0px`
- **Feature Card:** `rgba(0, 0, 0, 0.2) 2px 2px 8px 0px`
- **Elevated Feature Card:** `rgba(117, 97, 177, 0.063) 0px 4px 20px 0px`
- **Subtle Card Hover:** `rgba(10, 9, 12, 0.04) 0px 1px 4px 0px`

## Imagery

Minimal illustrative imagery — the system relies on data visualization rather than photography or illustration. The hero features a product mockup: a horizontal card row with colored progress bars (amber, teal, violet, moss) representing signal processing states. The agent timeline is a flat node-and-connector diagram with circular icon markers. Code panels with macOS chrome dots appear as product screenshots. The only photographic element is the logo mark (mezmo+). Overall density is text-and-data dominant; the page reads as a technical product surface, not a marketing canvas. When color appears in imagery, it is always one of the four data-state hues and never decorative.

## Layout

Max-width 1200px centered content with full-bleed section bands. The hero is a centered headline over a soft gradient strip, followed by a two-column primary button cluster and a full-width product mockup. Sections below alternate between text-left/data-right compositions and centered single-column blocks. The entry-point selector uses a horizontal pill row above a split layout: left column lists journey stages in a vertical stack, right column shows a code window. Navigation is a single top bar, sticky on scroll. Card grids appear in feature sections at 2–3 column counts with 16–24px gutters. Vertical rhythm is 80px between major sections, 16–24px between elements within sections.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a090c
- background: #e6e6e5 / #ffffff
- border: #d1d5db (1px)
- emphasis: #7561b1 (Iris)
- primary action: #96beca (filled action)
- monospace data: monospace 11–12px

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #96beca background, #0a090c text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Stat card with progress bar**: White card, 1px #d1d5db border, 8px radius, 24px padding. Eyebrow label in monospace 10px weight 500, uppercase, 0.057em tracking. Metric value in monospace 24px weight 600, #0a090c. Colored progress bar beneath: 6px height, 9999px radius, fill #96beca, background #f4f4f4.

3. **Code window panel**: Background #f4f4f4, 8px radius, 1px #d1d5db border, 16px padding. Three macOS dots (red, amber, green) top-left. Body in monospace 11px weight 400. Syntax colors: keys in #7561b1, strings in #74a9b9, values in #9db161, comments in #8a8a8a.

4. **Section header with eyebrow**: Eyebrow tag — 5px radius, 1px #ccc6df border, 4px 10px padding, text in Onest 9px weight 600 uppercase, 0.12em tracking, #7561b1. Heading below in Onest weight 300, 36px, #0a090c, tracking -0.36px. Subhead at 18px Onest weight 400, #696969.

5. **Entry-point tab selector**: Horizontal flex row, 8px gap. Each tab: transparent background, 1px solid #031403 border, 5px radius, 10px 16px padding, text Onest 13px weight 500, #0a090c. Active tab: #0a090c background, #ffffff text.

## Similar Brands

- **Linear** — Same typographic confidence with weight-light display headlines, compact density, and a single saturated accent against a near-monochrome interface
- **Vercel** — Light-mode instrument-panel aesthetic with flat surfaces, hairline borders, monospace for code and metrics, and minimal elevation
- **PlanetScale** — Developer-tool voice with a single signature color emphasis, 5–8px radii, and content sections that alternate between prose and code/data panels
- **Honeycomb** — Observability product with violet/purple as the brand voice, monospace-heavy metric presentation, and quiet canvas with data bars as the primary visual motif
- **Axiom** — Compact devtools layout, monospace telemetry values, and restrained color where accent appears only on data signals and emphasis text

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-ink: #0a090c;
  --color-near-black-green: #031403;
  --color-bone-white: #e6e6e5;
  --color-paper-white: #ffffff;
  --color-frost: #f4f4f4;
  --color-stone: #8a8a8a;
  --color-slate: #696969;
  --color-ash: #777777;
  --color-dust: #d1d5db;
  --color-cinder: #2d2d2d;
  --color-smoke: #5a5a5a;
  --color-iron: #404040;
  --color-iris: #7561b1;
  --color-coastal-teal: #96beca;
  --color-slate-blue: #74a9b9;
  --color-amber-glow: #f4b811;
  --color-moss: #9db161;
  --color-lilac-mist: #ccc6df;
  --color-pale-aqua: #d5e8ed;
  --color-sand-sage: #dfe4d1;
  --color-faded-aqua: #b4cfd7;
  --color-dusk: #3a344b;

  /* Typography — Font Families */
  --font-onest-variable: 'Onest Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace-system: 'monospace (system)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.55;
  --tracking-micro: 0.06px;
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.45;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.24px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.36px;
  --text-display: 48px;
  --leading-display: 1.05;
  --tracking-display: -0.48px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 14px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 5px;
  --radius-inputs: 5px;
  --radius-buttons: 5px;
  --radius-hairlines: 1px;
  --radius-large-cards: 14px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.2) 2px 2px 8px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.2) 2px 2px 5px 0px;
  --shadow-sm-4: rgba(10, 9, 12, 0.04) 0px 1px 4px 0px;
  --shadow-subtle: rgba(10, 9, 12, 0.03) 0px 1px 3px 0px;
  --shadow-lg: rgba(117, 97, 177, 0.063) 0px 4px 20px 0px;

  /* Surfaces */
  --surface-canvas: #e6e6e5;
  --surface-paper: #ffffff;
  --surface-frost: #f4f4f4;
  --surface-tinted-wash: #dfe4d1;
  --surface-lilac-mist: #e7e5ee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-ink: #0a090c;
  --color-near-black-green: #031403;
  --color-bone-white: #e6e6e5;
  --color-paper-white: #ffffff;
  --color-frost: #f4f4f4;
  --color-stone: #8a8a8a;
  --color-slate: #696969;
  --color-ash: #777777;
  --color-dust: #d1d5db;
  --color-cinder: #2d2d2d;
  --color-smoke: #5a5a5a;
  --color-iron: #404040;
  --color-iris: #7561b1;
  --color-coastal-teal: #96beca;
  --color-slate-blue: #74a9b9;
  --color-amber-glow: #f4b811;
  --color-moss: #9db161;
  --color-lilac-mist: #ccc6df;
  --color-pale-aqua: #d5e8ed;
  --color-sand-sage: #dfe4d1;
  --color-faded-aqua: #b4cfd7;
  --color-dusk: #3a344b;

  /* Typography */
  --font-onest-variable: 'Onest Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace-system: 'monospace (system)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.55;
  --tracking-micro: 0.06px;
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.45;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.24px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.36px;
  --text-display: 48px;
  --leading-display: 1.05;
  --tracking-display: -0.48px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 14px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.2) 2px 2px 8px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.2) 2px 2px 5px 0px;
  --shadow-sm-4: rgba(10, 9, 12, 0.04) 0px 1px 4px 0px;
  --shadow-subtle: rgba(10, 9, 12, 0.03) 0px 1px 3px 0px;
  --shadow-lg: rgba(117, 97, 177, 0.063) 0px 4px 20px 0px;
}
```
