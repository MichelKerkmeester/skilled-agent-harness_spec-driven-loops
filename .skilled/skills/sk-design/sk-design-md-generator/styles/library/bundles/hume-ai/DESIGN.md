# Hume AI — Style Reference
> Scientific pastel instrument panel. A calm white laboratory where near-black typography measures soft watercolor data washes.

**Theme:** light

Hume AI reads as a scientific pastel instrument panel: a near-white laboratory canvas where the only hard mark is a near-black #222222, and color enters as soft watercolor washes — rose, lavender, peach, mint, sky — that visualize data rather than decorate it. The headline typographic move is tight, low-contrast Fellix at 36–48px with negative tracking, set in a weight that whispers rather than shouts, framing emotional intelligence as measured restraint. Components are pill-shaped or softly rounded (8/12/16/24px radii), borders are invisible or hairline, shadows are absent — surfaces separate by hue and whitespace, not elevation. Monospace PP Fraktion Mono appears as the 'lab label' voice: uppercase column headers, tag chips, and data annotations carry a positive +0.025em tracking that contrasts the display sans's tight -0.025em. The overall rhythm is centered, generous, and editorial — sections breathe with 48–64px gaps, content never crowds, and the only saturated accent (#c094e4 violet) lives inside data bars and brand moments, never on chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#222222` | `--color-ink` | Primary text, filled buttons, nav strokes, icon fills — near-black rather than pure black to soften the interface |
| Paper | `#ffffff` | `--color-paper` | Base canvas, card surfaces, button text on dark fills |
| Bone | `#fff9f3` | `--color-bone` | Warm off-white secondary surface, subtle background tints behind sections |
| Smoke | `#7a7876` | `--color-smoke` | Muted helper text, secondary button text, disabled labels |
| Carbon | `#000000` | `--color-carbon` | Pure black reserved for icon fills and maximum-contrast accents |
| Iris | `linear-gradient(90deg, #c094e4 0%, #f7bbe6 50%, #ffb760 100%)` | `--color-iris` | Primary chromatic accent — data bar fills, brand gradient anchor, link color — violet carries the only sustained saturation in the UI; Sole vivid accent — horizontal bar chart fills, hero gradient, brand wordmark moments |
| Blush | `#fce0ee` | `--color-blush` | Pastel pink surface wash — category tile backgrounds, data card tints |
| Rose Mist | `#fdebf7` | `--color-rose-mist` | Softest pink surface — subtle section tints, card backgrounds |
| Meringue | `#ffe9cf` | `--color-meringue` | Warm peach surface — category tiles, dataset swatches, complementary pastel |
| Mint | `#daf7ee` | `--color-mint` | Mint pastel surface — category tiles, complementary data swatch |
| Seafoam | `#cef1e1` | `--color-seafoam` | Green-tinted pastel surface — category swatch, soft data background |
| Slate Plum | `#574853` | `--color-slate-plum` | Cool dark plum for body text and dark-on-light icon strokes |

## Tokens — Typography

### Fellix — Primary interface and display typeface — geometric grotesque with unusually low contrast; weight 520 is a near-medium custom step that gives headlines substance without going bold, weight 400 handles body. Tracking sits tight at -0.025em across the scale, which is anti-convention for a sans and makes even 48px headlines feel compact and scientific rather than airy or editorial. · `--font-fellix`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400, 520
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px
- **Line height:** 1.00–1.63
- **Letter spacing:** -0.025em
- **Role:** Primary interface and display typeface — geometric grotesque with unusually low contrast; weight 520 is a near-medium custom step that gives headlines substance without going bold, weight 400 handles body. Tracking sits tight at -0.025em across the scale, which is anti-convention for a sans and makes even 48px headlines feel compact and scientific rather than airy or editorial.

### PP Fraktion Mono — Monospace lab-label voice — uppercase column headers, tag chips, dataset captions, metric labels. Tracking opens up to +0.025em and ligatures/contextual alternates are explicitly disabled, producing a deliberately clinical, index-card feel that contrasts the tight sans. The 'COMBINED', 'DATASET COMPOSITION', 'BLOG POST' eyebrows are the signature use. · `--font-pp-fraktion-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 10px, 12px, 14px
- **Line height:** 1.33–1.50
- **Letter spacing:** +0.025em
- **OpenType features:** `"calt" 0, "liga" 0`
- **Role:** Monospace lab-label voice — uppercase column headers, tag chips, dataset captions, metric labels. Tracking opens up to +0.025em and ligatures/contextual alternates are explicitly disabled, producing a deliberately clinical, index-card feel that contrasts the tight sans. The 'COMBINED', 'DATASET COMPOSITION', 'BLOG POST' eyebrows are the signature use.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.25px | `--text-caption` |
| body | 16px | 1.5 | -0.4px | `--text-body` |
| subheading | 18px | 1.43 | -0.45px | `--text-subheading` |
| heading-sm | 20px | 1.33 | -0.5px | `--text-heading-sm` |
| heading | 24px | 1.25 | -0.6px | `--text-heading` |
| heading-lg | 30px | 1.2 | -0.75px | `--text-heading-lg` |
| heading-xl | 36px | 1.11 | -0.9px | `--text-heading-xl` |
| display | 48px | 1.11 | -1.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12-16px |
| input | 8px |
| buttons | 9999px |
| category-tiles | 16px |
| hero-illustration | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-64px
- **Card padding:** 24-32px
- **Element gap:** 12-16px

## Components

### Filled Pill Button (Primary)
**Role:** The only high-emphasis action — used for 'Get Started', 'Learn More'

Near-black #222222 fill, white #ffffff text, 9999px (fully rounded) radius, 16px 24px padding, Fellix 14px weight 520 with -0.025em tracking. The pill geometry is a hard signature — every primary action is a stadium, never a rectangle.

### Ghost Text Button
**Role:** Secondary navigation actions like 'Log In'

No background, no border. Fellix 14px weight 520 in #222222. Sits inline next to the primary pill with 12–16px gap.

### Dark Pill Button (on hero)
**Role:** In-page anchor like 'Learn More →'

Same near-black pill treatment as primary, but may carry a 14px → arrow icon. Identical 9999px radius and 16px 24px padding.

### Top Navigation Bar
**Role:** Global header

White #ffffff background, 73px horizontal padding, no border. Left: wordmark + dot-cluster logo. Center: nav links (Research, Products, Models, Resources) in Fellix 14px weight 400, 32px gap, with chevron-down indicators on dropdown items. Right: ghost 'Log In' + filled 'Get Started' pill. Total height ~60px, airy.

### Hero Section
**Role:** Above-the-fold brand moment

Centered layout on white canvas. Headline at 48px Fellix weight 520, tracking -1.20px, with the phrase 'Emotional Intelligence' rendered in a left-to-right oklab gradient (violet #c094e4 → pink #f7bbe6 → amber #ffb760) as text fill. Subtext in #7a7876 at 18px weight 400, centered, max-width ~640px. Pill CTA below. A pastel flowing-line illustration (violet/pink) sits ~40px below the CTA, spanning ~80% of the max-width with 24px corner radius.

### Stat Block Row
**Role:** Quantitative proof strip below hero

Three centered columns with a monospace '50+ / 48+ / 600+' headline (PP Fraktion Mono, 24px, uppercase implied) and a #7a7876 uppercase label below in 10–12px PP Fraktion Mono with +0.025em tracking. No dividers, pure whitespace separation.

### Pastel Category Tile
**Role:** Dataset category legend swatch

16px radius, no border, 12px dot in #c094e4 / #f7bbe6 / #ffb760 / #cef1e1 / #daf7ee / #ffe9cf / #fce0ee to the left of a Fellix 14px body label. Two-column grid with 16px gap. Pastel backgrounds appear as card containers for the entire composition block.

### Horizontal Bar Chart Card
**Role:** Primary data visualization — model rankings

White #ffffff card on Bone #fff9f3 canvas, 12–16px radius, 32px padding, no shadow. Tab row at top uses PP Fraktion Mono 12px uppercase for tab labels (COMBINED, LISTENABILITY, AUDIO QUALITY, SMOOTHNESS), with active tab rendered as a filled #222222 pill containing white text. Each row: 16px brand icon (favicon-style) + model name in Fellix 14px weight 400, then a #c094e4 violet bar with the value overlaid in white #ffffff Fellix 12px, finally a black H/I error-bar marker. X-axis labels in PP Fraktion Mono 10px.

### Blog Post Sidebar Card
**Role:** Companion content panel inside data section

Same white card on Bone canvas. Eyebrow: small RSS icon + 'BLOG POST' in PP Fraktion Mono 12px uppercase +0.025em. Headline in Fellix 20px weight 520, body in 14px weight 400 #7a7876. Bottom: 'COMING SOON' in PP Fraktion Mono 10px uppercase.

### Feature Card (Three-Column)
**Role:** RESTful API / High-Quality Ratings / Fast Turnaround

No card chrome — content sits directly on canvas with 24px top-padding for a small monochrome icon (Fellix-style stroke icon, 24px, #222222), then a Fellix 18px weight 520 heading, then a Fellix 14px weight 400 #7a7876 description. Equal-width 3-column grid with 32px gap.

### Dataset Composition Card
**Role:** Legend block for the pastel category swatches

Two-column grid of category tiles. Heading 'DATASET COMPOSITION' in PP Fraktion Mono 10–12px uppercase +0.025em, #7a7876. Each tile is a Fellix 14px label preceded by a 12px colored dot — the full pastel set (violet, pink, peach, mint, blue, green, etc.) is deployed here as a categorical palette.

### Pastel Stacked Card Set
**Role:** Visual showcase of dataset types (fanned cards)

A row of large rounded cards (24px radius) in alternating pastel tints (#fce0ee blush, #ffe9cf meringue, #daf7ee mint, #ccdff1 sky, #cef1e1 seafoam), slightly fanned/overlapping with a small circular icon and Fellix 20px weight 520 label. No shadow — separation comes from hue alone. Padding 32px.

### Section Heading Block
**Role:** Reusable section opener

Centered. Headline at 36px Fellix weight 520, tracking -0.90px, #222222. Subtext at 18px weight 400, #7a7876, max-width ~640px, centered. 48–64px vertical breathing room above and below.

### Wordmark + Dot-Cluster Logo
**Role:** Brand identity in nav

'hume' set in Fellix 18–20px weight 520, lowercase, #222222, preceded by a 5-dot cluster logo in #222222 arranged in a small constellation. No color, no decoration — the mark is purely typographic and shape-based.

## Do's and Don'ts

### Do
- Use the 9999px pill radius for every primary action, tag chip, and nav CTA — the fully rounded geometry is the strongest signature in the system and must be applied uniformly.
- Apply the oklab violet→pink→amber gradient (linear-gradient(90deg, #c094e4 0%, #f7bbe6 50%, #ffb760 100%)) only to the gradient-text phrase inside hero headlines, never to backgrounds, buttons, or large surfaces.
- Render eyebrows and data labels (COMBINED, BLOG POST, DATASET COMPOSITION, COMING SOON) in PP Fraktion Mono uppercase with +0.025em tracking and disabled ligatures — this is the 'lab label' voice that contrasts the display sans.
- Set all Fellix text with -0.025em letter-spacing across the entire scale from 12px to 48px; do not relax tracking at small sizes.
- Use #222222 (not #000000) for body text, buttons, and icons — the near-black is a deliberate softening and must stay consistent across the system.
- Communicate data category or status with the pastel tile colors (Blush, Meringue, Mint, Seafoam, Sky) as card backgrounds or 12px dots — never use these pastels as text fills or button backgrounds.
- Default all horizontal data bars to the single #c094e4 Iris violet — variety comes from bar length, not from a multi-hue data palette.

### Don't
- Do not introduce drop shadows, blurs, or elevation effects on cards or buttons — surfaces separate by hue and hairline borders only.
- Do not use the pastel accent colors as CTA fills, link text, or icon strokes — they are exclusively surface washes and category indicators.
- Do not use #ffffff as a card background on the white page canvas; pair white cards with a warm Bone #fff9f3 section background to create visual separation.
- Do not set Fellix headlines at weight 700 or 800 — the system's restraint comes from weight 520, which has more presence than regular but less volume than bold.
- Do not set PP Fraktion Mono body copy at large sizes (16px+); it is a label/annotation face, not a reading face. Pair it with Fellix for any paragraph-length content.
- Do not mix the oklab gradient with a standard CSS gradient or apply it as a background fill — it is reserved for inline gradient text on the hero wordmark only.
- Do not round cards at the same 9999px radius used for buttons; cards use 12–24px to preserve a clear distinction between the pill-shaped actions and the soft-cornered surfaces.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Base page canvas |
| 1 | Bone | `#fff9f3` | Warm off-white section wash, subtle warm shift from base |
| 2 | Blush Tile | `#fce0ee` | Pastel pink data card surface |
| 3 | Mint Tile | `#daf7ee` | Pastel mint category tile |
| 4 | Meringue Tile | `#ffe9cf` | Pastel peach category tile |

## Elevation

No drop shadows. Surfaces separate through hue (pastel tile colors), whitespace, and a single 1px hairline border at most. Elevation is communicated by stacking white cards on the warm Bone background, never by shadow blur. This is a deliberate scientific-flat choice — instruments on a lab bench, not cards floating in space.

## Imagery

Imagery is deliberately restrained and serves data, not decoration. The hero centerpiece is a custom flowing-line illustration — undulating pastel wave lines in violet #c094e4 and pink that suggest sound waves or emotional frequency curves, contained in a rounded 24px-radius frame. Below, dataset category visualizations use flat pastel tile stacks (Blush, Meringue, Mint, Seafoam) with monospace labels and small 12px colored dots — a categorical legend rather than illustration. Bar charts are pure data bars (violet #c094e4 on white) with error markers. Icons are minimal monochrome strokes in #222222 at 16–24px, no multicolor fills. No photography, no 3D renders, no lifestyle imagery. The visual language is that of a scientific dashboard: data and typography carry the entire visual weight, with pastel washes providing categorical structure.

## Layout

Page is max-width 1200px centered, with horizontal page padding around 73px on desktop. The hero is a centered vertical stack: 48px headline with gradient-text phrase → 18px subtext max-width 640px → 16px-24px filled pill CTA → 24px-radius pastel wave illustration spanning ~80% width. Sections below follow a consistent centered-heading + two-column or three-column body pattern. The bar-chart section uses a 2-column grid: large data card on the left (~60%), blog-post sidebar card on the right (~35%), with 24px gap. Feature blocks below are an equal 3-column grid with 32px gap, no card chrome. Vertical rhythm is generous: 48–64px between sections, with the warm Bone #fff9f3 background alternating with white to create section separation without dividers. Navigation is a single 60px top bar with no sticky shadow. The overall feel is editorial-scientific: centered prose, single-column reading, data visualizations treated as primary content not sidebar widgets.

## Agent Prompt Guide

**Quick Color Reference**
- text: #222222
- background: #ffffff
- secondary surface: #fff9f3
- border: transparent or #222222 1px
- accent (data bars, gradient text): #c094e4
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build the hero: white #ffffff canvas, centered 48px Fellix weight 520 headline #222222 with the inner phrase 'Emotional Intelligence' set as gradient text using linear-gradient(90deg, #c094e4 0%, #f7bbe6 50%, #ffb760 100%). Below, 18px Fellix weight 400 #7a7876 subtext centered, max-width 640px. A 16px-24px #222222 filled pill button with white 'LEARN MORE →' text, 9999px radius, 14px Fellix weight 520.

2. Build a horizontal bar chart card: white #ffffff card with 16px radius and 32px padding, sitting on a #fff9f3 warm canvas. Tab row at top in PP Fraktion Mono 12px uppercase +0.025em with the active 'COMBINED' tab as a #222222 filled pill (white text, 9999px radius). Each row has a 16px icon, a Fellix 14px model name in #222222, then a #c094e4 violet bar with the value overlaid in white 12px Fellix. No drop shadows.

3. Build a three-column feature row on white: 32px gap, no card chrome. Each column starts with a 24px #222222 stroke icon, then an 18px Fellix weight 520 heading #222222, then a 14px Fellix weight 400 #7a7876 description. Equal column widths.

4. Build the dataset-composition legend: a 2-column grid with 16px gap, 12px colored dots (using #c094e4, #f7bbe6, #ffb760, #daf7ee, #ccdff1, #cef1e1, #7a6875 sequence) preceding Fellix 14px labels. Eyebrow 'DATASET COMPOSITION' in PP Fraktion Mono 12px uppercase +0.025em #7a7876.

5. Build a row of pastel stacked cards: 24px radius, 32px padding, no borders, no shadows. Each card uses a different pastel surface (#fce0ee, #ffe9cf, #daf7ee, #ccdff1, #cef1e1), contains a 24px #222222 icon, a 20px Fellix weight 520 label, and 14px Fellix weight 400 #7a7876 body text. Cards overlap slightly to create a fanned composition.

## Similar Brands

- **Linear** — Same near-black on white, pill-shaped CTAs, tight tracked sans-serif headlines, and disciplined single-accent restraint — though Hume swaps Linear's electric blue for a soft violet + pastel system.
- **Vercel** — Centered editorial hero with tight negative tracking, max-width 1200px container, generous 48–64px section rhythm, and a monochrome-first palette that lets one accent carry the brand.
- **Anthropic** — Soft warm cream surfaces, a single low-saturation accent, and the same scientific-instrument restraint — though Hume is even more pastel-watercolor and less serif.
- **Runway** — Data-forward scientific aesthetic with pastel category swatches and a lab-label monospace voice for annotations, paired with generous whitespace and a calm white canvas.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #222222;
  --color-paper: #ffffff;
  --color-bone: #fff9f3;
  --color-smoke: #7a7876;
  --color-carbon: #000000;
  --color-iris: #c094e4;
  --gradient-iris: linear-gradient(90deg, #c094e4 0%, #f7bbe6 50%, #ffb760 100%);
  --color-blush: #fce0ee;
  --color-rose-mist: #fdebf7;
  --color-meringue: #ffe9cf;
  --color-mint: #daf7ee;
  --color-seafoam: #cef1e1;
  --color-slate-plum: #574853;

  /* Typography — Font Families */
  --font-fellix: 'Fellix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-fraktion-mono: 'PP Fraktion Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.25px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.5px;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -0.6px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.75px;
  --text-heading-xl: 36px;
  --leading-heading-xl: 1.11;
  --tracking-heading-xl: -0.9px;
  --text-display: 48px;
  --leading-display: 1.11;
  --tracking-display: -1.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w520: 520;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-64px;
  --card-padding: 24-32px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12-16px;
  --radius-input: 8px;
  --radius-buttons: 9999px;
  --radius-category-tiles: 16px;
  --radius-hero-illustration: 24px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-bone: #fff9f3;
  --surface-blush-tile: #fce0ee;
  --surface-mint-tile: #daf7ee;
  --surface-meringue-tile: #ffe9cf;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #222222;
  --color-paper: #ffffff;
  --color-bone: #fff9f3;
  --color-smoke: #7a7876;
  --color-carbon: #000000;
  --color-iris: #c094e4;
  --color-blush: #fce0ee;
  --color-rose-mist: #fdebf7;
  --color-meringue: #ffe9cf;
  --color-mint: #daf7ee;
  --color-seafoam: #cef1e1;
  --color-slate-plum: #574853;

  /* Typography */
  --font-fellix: 'Fellix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-fraktion-mono: 'PP Fraktion Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.25px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.5px;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -0.6px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.75px;
  --text-heading-xl: 36px;
  --leading-heading-xl: 1.11;
  --tracking-heading-xl: -0.9px;
  --text-display: 48px;
  --leading-display: 1.11;
  --tracking-display: -1.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
}
```
