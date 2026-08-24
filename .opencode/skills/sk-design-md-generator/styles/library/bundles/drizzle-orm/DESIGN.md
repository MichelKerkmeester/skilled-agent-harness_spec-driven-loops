# Drizzle ORM — Style Reference
> Rainwater terminal on graph paper — a clean developer workbench where ink-blue notes float over monochrome code, with little raindrop creatures as the only witnesses.

**Theme:** light

Drizzle ORM presents as a quiet code workshop: a near-monochrome canvas where dark slate text sits on warm-white surfaces, with electric blue appearing only where intention demands it — in handwritten annotations sketched over the page, in performance graphs, and in the occasional code link. The visual language is deliberately restrained but not sterile: raindrop mascots and hand-drawn notes inject personality into an otherwise terminal-like layout, giving the interface a workbench feel rather than a polished marketing surface. Components stay compact and information-dense — thin borders at 8px radius, code blocks that look pasted from a real terminal, and cards that hold metrics rather than decoration. Color is rationed: two near-grays for text layers, one border gray, one bright blue, and the rest is whitespace and charts.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#3e7ff0` | `--color-electric-cobalt` | Handwritten annotations overlaid on headlines, heading-level emphasis, brand voice. The single saturated color in the system; its scarcity makes it feel like a marker pen picked up to circle something important |
| Signal Blue | `#006be6` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink | `#222222` | `--color-ink` | Primary body and heading text. Off-black with a hair of warmth so long passages never feel like printed laser output |
| Slate | `#282b3b` | `--color-slate` | High-density text color across the interface — appears in button labels, icon strokes, and link copy. The workhorse dark tone that carries most interface chrome |
| Graphite | `#444444` | `--color-graphite` | Secondary body text, list items, paragraph copy. One step lighter than Ink for hierarchy without changing weight |
| Stone | `#334155` | `--color-stone` | Muted headings and subdued text — used where you need emphasis over Ink but don't want true black. Pairs with borders |
| Steel | `#4b5563` | `--color-steel` | Icon strokes at rest, tertiary metadata, badge text. Cool enough to recede behind primary content |
| Fog | `#969faf` | `--color-fog` | Placeholder text, disabled labels, the softest readable gray before content disappears |
| Ash | `#909090` | `--color-ash` | Hairline metadata, timestamps, count badges — present but not demanding attention |
| Pure Black | `#000000` | `--color-pure-black` | Maximum-contrast emphasis on icons and small inline marks where Slate is too soft |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, input fields. The default light surface for every elevated component |
| Cloud | `#f6f6f7` | `--color-cloud` | First surface step down from Paper — subtle panels, code-block fills, button hover grounds. Warm enough to read as intentional, not gray-by-default |
| Chalk | `#f0f0f0` | `--color-chalk` | Tag and badge fills where a colored surface is too loud but Paper reads as unstyled |
| Pebble | `#e5e7eb` | `--color-pebble` | The system border color — dividers, input outlines, card edges, button outlines. This is the most-used neutral after Ink and carries structural separation across the layout |
| Mist | `#cfd9de` | `--color-mist` | Image and screenshot frame borders, slightly cooler than Pebble to distinguish illustrated content blocks from UI borders |

## Tokens — Typography

### ui-sans-serif (Inter / system-ui) — All UI text — navigation, body copy, headings, buttons, badges. System sans-serif keeps the file weight zero and the feel native; weights cluster around 400–600, with 700 reserved for headings and the logo wordmark. · `--font-ui-sans-serif-inter-system-ui`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 11, 12, 14, 16, 18, 20, 32, 40
- **Line height:** 1.17 (display) / 1.20 (large heading) / 1.42 (14px body) / 1.50 (16px+ body)
- **Letter spacing:** normal across all sizes; tracking is intentionally default
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** All UI text — navigation, body copy, headings, buttons, badges. System sans-serif keeps the file weight zero and the feel native; weights cluster around 400–600, with 700 reserved for headings and the logo wordmark.

### ui-monospace (JetBrains Mono / SF Mono) — Code blocks, terminal panels, inline code. 12px is for badge-style inline `<code>` chips; 16px is for full code-block passages with breathing room. · `--font-ui-monospace-jetbrains-mono-sf-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400, 500
- **Sizes:** 12, 16
- **Line height:** 1.00, 1.50
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** Code blocks, terminal panels, inline code. 12px is for badge-style inline `<code>` chips; 16px is for full code-block passages with breathing room.

### Menlo — Tiny metadata and version-tag monospace where a tighter face is needed — the strict geometric Menlo reads as a system stamp. · `--font-menlo`
- **Substitute:** Menlo / SF Mono
- **Weights:** 500, 700
- **Sizes:** 10
- **Line height:** 1.20
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** Tiny metadata and version-tag monospace where a tighter face is needed — the strict geometric Menlo reads as a system stamp.

### FirstTimeWriting (custom handwriting) — Signature playful annotation overlay — the 'ship ship ship' scribble above the hero, callouts pointing at UI elements. This single custom face is the entire brand voice. Never use it for body copy, navigation, or any interface text. · `--font-firsttimewriting-custom-handwriting`
- **Substitute:** Caveat or Kalam (Google Fonts) for close visual match
- **Weights:** 600, 700
- **Sizes:** 14, 16, 20, 30
- **Line height:** 1.50, 1.60
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** Signature playful annotation overlay — the 'ship ship ship' scribble above the hero, callouts pointing at UI elements. This single custom face is the entire brand voice. Never use it for body copy, navigation, or any interface text.

### monospace — monospace — detected in extracted data but not described by AI · `--font-monospace`
- **Weights:** 700
- **Sizes:** 12px
- **Line height:** 1.5
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** monospace — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 14px | 1.42 | — | `--text-body` |
| heading-sm | 18px | 1.5 | — | `--text-heading-sm` |
| heading | 20px | 1.5 | — | `--text-heading` |
| heading-lg | 32px | 1.2 | — | `--text-heading-lg` |
| display | 40px | 1.17 | — | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 20px |
| badges | 2px |
| inputs | 8px |
| buttons | 8px |
| smallChips | 5px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-subtle` |
| subtle-2 | `rgb(205, 205, 230) 0px -2px 0px 0px inset, rgb(255, 255, ...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16-24px
- **Element gap:** 8-12px

## Components

### Top Announcement Bar
**Role:** Promotional ribbon

Slim band at the very top of the page, Paper background, single line of 12px body-sm text centered in Graphite. No icon, no close button — it sits flush with the nav, separated by a 1px Pebble bottom border.

### Navigation Header
**Role:** Top-level site nav

White background, 1px Pebble bottom border, horizontal layout. Left: raindrop logomark + 'drizzle' wordmark in weight 700 Ink. Center: pill-shaped nav links (8px radius, 8–10px horizontal padding, 8px row gap between items, Ink text at 14px). Right: GitHub star pill (Slate text, Pebble border, 8px radius, 20-star count), notification icon, theme toggle (square 8px-radius, Pebble border). Height: ~56px.

### Nav Link Pill (active/inactive)
**Role:** Navigation item

No background. Ink text, 14px weight 500, 8px horizontal padding, 8px vertical. Hover: Cloud background fills the pill. Active state would invert to Ink background with Paper text — no current instance on the captured page.

### GitHub Star Badge
**Role:** Social proof pill in header

8px radius, 1px Pebble border, Paper fill, 8–10px horizontal padding. GitHub octocat icon (16px, Slate) + '33k+' count in Ink, 14px weight 500. Thin notification dot in Electric Cobalt at top-right corner.

### Language Toggle Badge (JS / TS)
**Role:** Tab-style language switcher

Two adjacent pills sharing an 8px-radius container. Each pill: 8px 12px padding, 12px body-sm weight 500, Icon prefix (16px) in Slate. Active tab: Paper background, Ink text, 1px Pebble border. Inactive: transparent, Graphite text, no border. The two sit inside a single outlined track with 2px inner radius.

### Quick Action Card (Get Started / Documentation / Search Docs / Ask Docs)
**Role:** Hero navigation tile

White card, 8px radius, 1px Pebble border, no shadow. 12px 16px padding. Left: 16px icon in Slate. Right: label in Ink, 14px weight 500. Arranged 2×2 grid with 8px gap. Subtle, utilitarian — these are directory entries, not CTAs.

### Drizzle Illustration Frame
**Role:** Decorative hero artwork

Light gray (Cloud) rectangle, 8px radius, framed by a 2px orange-brown hand-drawn border (artwork-only color, not a token). Contains the 'drizzle' wordmark and two ghost-button labels. Surrounded by blue raindrop mascots with stick legs and tiny face dots. This is brand mascot territory — never replicate with stock imagery.

### Team Avatar Stack
**Role:** Contributor social proof

Horizontal row of 28×28px circular avatars (full round, not 8px), overlapping by 8px to form a continuous strip. 8–10px gap between the strip and the surrounding text. Underline: 'Drizzle Team and Active Contributors' in 14px Ink weight 500, with a 1px Ink underline beneath the active link portion.

### Release Progress Bar
**Role:** Milestone indicator

Inline row: 'v1.0 release' label in 12px Graphite on left, '98%' count in 12px weight 500 Ink on right. Below: 4px-tall bar with Cloud background, vivid green fill (not in token set — treat as a one-off brand color for release tracking), 8px radius. No percentage marker inside the bar.

### Timeline Item
**Role:** Changelog entry

Vertical card stack under month headers (February / March / This month). Each item: Paper card, 8px radius, 1px Pebble border, 16px padding. Title in 14px weight 500 Ink, description in 14px Graphite. Month header above is 16px weight 600 Ink with 24px top margin.

### Code Block / Terminal Panel
**Role:** Syntax-highlighted code display

Cloud (#f6f6f7) background, 8px radius, 1px Pebble border, 16px padding. 16px ui-monospace at line-height 1.50. No syntax tokens use Electric Cobalt — instead, keywords appear in weight 500 Ink, strings in a muted green (not extracted), comments in Ash. Sits flush with the timeline grid as a wider content card.

### Performance Comparison Card
**Role:** Benchmark visualization card

Paper card, 8px radius, 1px Pebble border, 16px padding. Header row: competitor name (16px weight 600 Ink) + version badge (12px weight 500 Graphite on Chalk background, 2px radius). Below: 'avg latency: 3.7s' in 14px Ink, then a full-width line chart with 2px teal/green stroke on a faint Cloud grid. Two cards sit side-by-side with 16px gap — left always Drizzle, right always the comparison.

### Theme Toggle Button
**Role:** Light/dark mode switch

32×32px square, 8px radius, 1px Pebble border, Paper fill, 16px sun/moon icon in Slate centered. No label.

### Handwritten Annotation Overlay
**Role:** Signature brand accent

FirstTimeWriting 30px, weight 700, color #3e7ff0, line-height 1.50. Positioned absolutely over hero headlines at a slight upward angle, no rotation transforms — the font itself provides the natural slant. Use sparingly: once per page maximum. Never inside navigation, buttons, or body text.

## Do's and Don'ts

### Do
- Use #e5e7eb (Pebble) at 1px for every card, input, and section divider — borders do the work that shadows do in other systems
- Apply 8px radius to cards, buttons, inputs, and images; 2px only for inline badges and code chips
- Reserve #3e7ff0 (Electric Cobalt) for the handwritten annotation overlay and heading-level emphasis — never for buttons, never for body links
- Use #006be6 (Signal Blue) exclusively for inline body links inside paragraphs — keep links discoverable but quieter than headings
- Use FirstTimeWriting for at most one annotation per page, positioned above or beside a hero headline at its native 30px size
- Let code blocks use the #f6f6f7 Cloud fill at 8px radius with 16px ui-monospace — this is a first-class surface, not a hack
- Stack sections with 64px vertical gaps; inside cards, use 8–12px between elements, 16–24px for card padding

### Don't
- Don't add drop shadows to cards or buttons — the system is border-driven; shadows break the notebook aesthetic
- Don't introduce additional brand colors — the palette is two blues against a near-monochrome scale, and any new hue dilutes the workbench feel
- Don't use FirstTimeWriting for navigation, buttons, labels, or any functional text — it's a one-trick voice for playful annotation only
- Don't use rounded radii above 12px on UI elements — the largest functional radius is 8px, and 20px+ breaks the technical feel
- Don't place the Electric Cobalt annotation on dark backgrounds — the handwriting color is calibrated for the Paper canvas
- Don't use weight 700 on body text — reserve 700 for the wordmark, headings, and the handwritten overlay only
- Don't fill cards with images or gradients — the page stays a near-monochrome workspace, with color only inside line-chart strokes and the progress bar

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f6f6f7` | Page-level background between cards; the warm-white that frames all content |
| 1 | Card | `#ffffff` | Default surface for every card, panel, and content block |
| 2 | Inset | `#f0f0f0` | Code blocks, tag fills, pressed button states — surfaces that nest inside a card |

## Elevation

- **Input field:** `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(0, 0, 0, 0.075) 0px 2px 4px 0px`

## Imagery

The visual language is dominated by hand-drawn illustration over flat UI surfaces. Hero artwork features blue raindrop mascots with stick limbs and two-dot faces — playful but sparse, positioned around a single framed 'drizzle' wordmark rather than filling the page. Handwritten annotations in FirstTimeWriting overlay hero text at a natural slant, as if someone circled a word with a marker. Functional imagery is limited to: contributor avatar circles (overlapping stacks, no crop effects), framed code/terminal panels that look copy-pasted from a real shell, and full-width line charts for benchmark comparisons. There is no photography anywhere on the site. Icons are uniformly 16px outlined, single-tone (Slate or Ink), and never colored — they sit inside pills or as list markers rather than as standalone decorations. The overall effect is closer to a developer zine than a polished SaaS product page.

## Layout

Layout is max-width 1200px centered, with a flush full-bleed top announcement bar above the nav. The hero splits into two columns at ~50/50: left column holds the headline, language toggle, and 2×2 quick-action grid; right column holds the raindrop illustration. Below the hero, sections alternate between full-width banded grids (timeline, changelog) and two-column comparison cards (benchmarks), with consistent 64px vertical gaps between sections. Card grids use 2 columns for medium content and stack to 1 column below ~768px. Navigation is a single horizontal bar with a centered link cluster — no sidebar, no mega-menu. The page is compact and information-dense, never spacious — sections feel like a developer's notes rather than a marketing site. Internal card padding is 16px; section-level breathing room is 64px; element gaps stay in the 8–12px range.

## Agent Prompt Guide

Quick Color Reference:
- background: #f6f6f7 (Cloud, page canvas) / #ffffff (Paper, card surface)
- text: #222222 (Ink, primary) / #444444 (Graphite, body) / #969faf (Fog, placeholder)
- border: #e5e7eb (Pebble, 1px structural)
- accent: #3e7ff0 (Electric Cobalt, annotations and emphasis)
- link: #006be6 (Signal Blue, inline body links)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero annotation overlay: 30px FirstTimeWriting (substitute Caveat) weight 700, color #3e7ff0, positioned absolute above a 40px Inter weight 700 #222222 headline. Letter-spacing normal, line-height 1.50. Use exactly once per page.

2. Create a quick-action navigation card: #ffffff background, 8px border-radius, 1px #e5e7eb border, 12px 16px padding. 16px outline icon in #4b5563 on the left, 14px Inter weight 500 #222222 label on the right. No shadow, no hover elevation. Arrange in a 2×2 grid with 8px gap.

3. Create a benchmark comparison card: #ffffff background, 8px border-radius, 1px #e5e7eb border, 16px padding. Header row with 16px Inter weight 600 #222222 name on the left and a 2px-radius badge (#f0f0f0 fill, 12px Inter weight 500 #4b5563 text, 4px 8px padding) on the right. Below: 14px #222222 'avg latency: X.Xs' label, then a full-width line chart with 2px teal-green stroke on a faint #f6f6f7 background grid, no fill under the line.

4. Create a code block panel: #f6f6f7 background, 8px border-radius, 1px #e5e7eb border, 16px padding. 16px ui-monospace (substitute JetBrains Mono) at line-height 1.50, weight 400 in #222222 for keywords, weight 500 for emphasis. Comments in #909090. No syntax highlighting colors outside the gray scale.

5. Create a language toggle pill track: 2px border-radius outer container, 1px #e5e7eb border, 4px 12px padding. Two child pills inside: active pill has #ffffff background, 12px Inter weight 500 #222222 text, 16px icon in #4b5563. Inactive pill is transparent with #444444 text. No shadow, no gap between pills — they share a single outlined track.

## Similar Brands

- **Prisma** — Same monochrome dev-tool palette with dark slate text on near-white, same 1px hairline card borders, same code-block-first content strategy. Both treat the homepage as documentation frontmatter rather than marketing.
- **Supabase** — Same restrained color usage with green progress/release indicators, same compact information density, same 8px-radius cards sitting on a warm off-white canvas.
- **PlanetScale** — Same developer-targeted monochrome aesthetic with a single chromatic accent, same bordered-not-shadowed elevation, same preference for terminal-like content blocks over decorative imagery.
- **Vercel** — Same minimal-canvas approach where the interface chrome nearly disappears — near-white background, hairline borders, dark text, with color appearing only in functional accents and data visualizations.
- **Railway** — Same workbench/dashboard feel with thin borders, compact spacing, and dark gray text on warm white — both treat the homepage as a place to look at metrics and code rather than lifestyle photography.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #3e7ff0;
  --color-signal-blue: #006be6;
  --color-ink: #222222;
  --color-slate: #282b3b;
  --color-graphite: #444444;
  --color-stone: #334155;
  --color-steel: #4b5563;
  --color-fog: #969faf;
  --color-ash: #909090;
  --color-pure-black: #000000;
  --color-paper: #ffffff;
  --color-cloud: #f6f6f7;
  --color-chalk: #f0f0f0;
  --color-pebble: #e5e7eb;
  --color-mist: #cfd9de;

  /* Typography — Font Families */
  --font-ui-sans-serif-inter-system-ui: 'ui-sans-serif (Inter / system-ui)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-jetbrains-mono-sf-mono: 'ui-monospace (JetBrains Mono / SF Mono)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-menlo: 'Menlo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-firsttimewriting-custom-handwriting: 'FirstTimeWriting (custom handwriting)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.42;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.5;
  --text-heading: 20px;
  --leading-heading: 1.5;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --text-display: 40px;
  --leading-display: 1.17;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16-24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 20px;
  --radius-badges: 2px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-smallchips: 5px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(0, 0, 0, 0.075) 0px 2px 4px 0px;
  --shadow-subtle-2: rgb(205, 205, 230) 0px -2px 0px 0px inset, rgb(255, 255, 255) 0px 0px 1px 1px inset, rgba(30, 35, 90, 0.4) 0px 1px 2px 1px;

  /* Surfaces */
  --surface-canvas: #f6f6f7;
  --surface-card: #ffffff;
  --surface-inset: #f0f0f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #3e7ff0;
  --color-signal-blue: #006be6;
  --color-ink: #222222;
  --color-slate: #282b3b;
  --color-graphite: #444444;
  --color-stone: #334155;
  --color-steel: #4b5563;
  --color-fog: #969faf;
  --color-ash: #909090;
  --color-pure-black: #000000;
  --color-paper: #ffffff;
  --color-cloud: #f6f6f7;
  --color-chalk: #f0f0f0;
  --color-pebble: #e5e7eb;
  --color-mist: #cfd9de;

  /* Typography */
  --font-ui-sans-serif-inter-system-ui: 'ui-sans-serif (Inter / system-ui)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-jetbrains-mono-sf-mono: 'ui-monospace (JetBrains Mono / SF Mono)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-menlo: 'Menlo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-firsttimewriting-custom-handwriting: 'FirstTimeWriting (custom handwriting)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.42;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.5;
  --text-heading: 20px;
  --leading-heading: 1.5;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --text-display: 40px;
  --leading-display: 1.17;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px, rgba(0, 0, 0, 0.075) 0px 2px 4px 0px;
  --shadow-subtle-2: rgb(205, 205, 230) 0px -2px 0px 0px inset, rgb(255, 255, 255) 0px 0px 1px 1px inset, rgba(30, 35, 90, 0.4) 0px 1px 2px 1px;
}
```
