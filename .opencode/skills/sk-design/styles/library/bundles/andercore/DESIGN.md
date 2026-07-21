# Andercore — Style Reference
> Steel blueprint at midnight

**Theme:** dark

Andercore runs on a chiaroscuro industrial language: near-black canvases (#0b0405) with crisp white type, sharp 4px corners, and a single rationed red (#e32735) that does all the talking. The page alternates between a light navigation band and full-bleed dark sections where borders (1px, #382e30) define structure instead of shadows or elevation. Archivo carries geometric precision at every size with tight -0.02em tracking, while Space Mono at 12px stamps industrial instrument-style labels onto badges and step counters. Red never decorates — it activates, marking the single primary action, the active step underline, and key UI connectors. The whole system feels like a control room: dense, deliberate, and lit by a single indicator lamp.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Red | `#e32735` | `--color-signal-red` | Red action color for filled buttons, selected navigation states, and focused conversion moments |
| Carbon | `#0b0405` | `--color-carbon` | Primary section background, full-bleed dark canvases, secondary button fill |
| Graphite | `#150e0f` | `--color-graphite` | Alternate near-black surface for cards and elevated panels on dark sections |
| Steel | `#382e30` | `--color-steel` | Hairline borders on dark surfaces, card edges, table dividers, UI mockup outlines |
| Slate | `#858182` | `--color-slate` | Secondary text, badge borders, badge labels, muted helper copy |
| Chalk | `#ffffff` | `--color-chalk` | Primary text on dark, nav and hero overlay type, inverted button text, light section backgrounds |
| Foil | `#000000` | `--color-foil` | SVG icon fills, decorative vector detail |

## Tokens — Typography

### Archivo — All interface type — headlines (40/56px, weight 500), subheads (24px, weight 500), body and UI (14/16px, weight 400), nav links (12/14px). The geometric grotesque with tight -0.02em tracking gives industrial precision; weight 500 (not 700) for display type keeps the system restrained rather than shouty. · `--font-archivo`
- **Substitute:** Inter, DM Sans, Geist
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 24, 40, 56
- **Line height:** 1.10–1.50
- **Letter spacing:** -0.02em across all sizes
- **Role:** All interface type — headlines (40/56px, weight 500), subheads (24px, weight 500), body and UI (14/16px, weight 400), nav links (12/14px). The geometric grotesque with tight -0.02em tracking gives industrial precision; weight 500 (not 700) for display type keeps the system restrained rather than shouty.

### Space Mono — Badge labels, step counters ('01', '02', '03'), industrial tag stamps — the monospace face signals instrumentation and serial-number precision, contrasting Archivo's proportional geometry · `--font-space-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Roboto Mono
- **Weights:** 400
- **Sizes:** 12
- **Line height:** 1.50
- **Letter spacing:** normal
- **Role:** Badge labels, step counters ('01', '02', '03'), industrial tag stamps — the monospace face signals instrumentation and serial-number precision, contrasting Archivo's proportional geometry

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 24px | 1.2 | -0.48px | `--text-subheading` |
| heading | 40px | 1.2 | -0.8px | `--text-heading` |
| display | 56px | 1.1 | -1.12px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| badges | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Primary CTA Button (Red Filled)
**Role:** The single high-priority action on any surface

Filled Signal Red (#e32735), white text at 14px Archivo weight 500, padding 12px 24px, 4px radius. No shadow, no gradient. The borderless rectangle sits flush with the dark canvas.

### Ghost/Dark Button
**Role:** Secondary action when a primary red CTA is present

Dark fill (#0b0405 or #150e0f), 1px border in #382e30, white text at 14px Archivo weight 500, padding 12px 24px, 4px radius. Visually quiet partner to the red CTA.

### Navigation Header
**Role:** Top-level site navigation and authentication

White background (#ffffff), Archivo 14px nav links in dark text, logo left ('ANDERCORE' wordmark), utility links and CTAs right. Fixed thin bar, no shadow, separates from dark sections below via background shift not a border.

### Industrial Badge / Tag
**Role:** Category labels, section eyebrows, status stamps

1px border in #858182, Space Mono 12px text in #858182, padding 8px 12px, 4px radius. Transparent fill so it reads as an outlined instrument label, not a filled chip.

### Step Progress Indicator
**Role:** Multi-step process navigation (Request → Quote → Track'n'Trace)

Horizontal row of step labels in Archivo 14px. Active step: red (#e32735) text with a 2px red underline bar. Inactive steps: #858182 text, no underline. Step numbers ('01', '02', '03') in Space Mono 12px right-aligned.

### Feature Card with UI Mockup
**Role:** Three-column challenge/solution display

Dark card on #0b0405 canvas, no border or 1px #382e30 border, 32px padding. Contains a small UI mockup (mini browser/panel) in a slightly lighter dark (#150e0f or #1a1213) with a red #e32735 icon/dot accent. Heading in Archivo 24px white, body in 14px #858182.

### Dark Content Section
**Role:** Primary content blocks after the hero

Full-bleed #0b0405 background, 80px vertical padding, max-width 1200px centered. White Archivo heading at 40px, muted body in #858182 at 16px. Section eyebrows via Space Mono badge above the heading.

### Chat Interface Card
**Role:** Product walkthrough visualization

Panel showing conversation bubbles on a lighter dark fill (#1a1213 implied). User bubbles: #382e30 fill with white text. Assistant bubbles: outlined or lighter fill. Andercore 'A' mark avatar in Signal Red. Sits beside a full-bleed photo of the user on the right.

### Hero with Photographic Overlay
**Role:** Above-the-fold brand statement

Full-bleed image (truck/industrial subject) with dark gradient overlay, display headline at 56px Archivo weight 500 in white, 1.10 line-height, -1.12px tracking. Body subtext at 16px in muted white. Primary red CTA + ghost dark button inline below.

### Connector Line / Accent Divider
**Role:** Visual flow between cards or sections

1px line in #382e30 with small square nodes (#ffffff) at junction points. Occasionally terminates in a red #e32735 square node or the Andercore 'A' mark. Links the three-column challenge cards vertically into a single system.

### Eyebrow / Section Label
**Role:** Tiny uppercase or tracked label above section headings

Space Mono 12px or Archivo 12px weight 500, all-caps where used, #858182 color, sometimes paired with a 1px red #e32735 underline accent.

## Do's and Don'ts

### Do
- Use Signal Red #e32735 exclusively for the single primary action per surface — never as a decorative or background fill
- Set all corners to 4px radius — no exceptions, no pill shapes, no zero-radius hard edges
- Separate dark sections with 80px vertical padding and rely on background-value shift rather than dividers or shadows
- Use Archivo 500 (not 700) for headings 40px and above to keep weight restrained and consistent
- Apply -0.02em letter-spacing to all Archivo type at all sizes for tight industrial density
- Stamp step numbers, serial codes, and technical labels in Space Mono 12px — never Archivo for these
- Define card and panel edges with 1px #382e30 borders on dark, never with box-shadow or background tint shifts

### Don't
- Don't introduce drop shadows, glows, or blur-based elevation — structure is line-based only
- Don't use #e32735 for body text, icons, or secondary UI — it's an action color, rationed
- Don't round corners beyond 4px — no 8px, 12px, 16px, or pill radii anywhere
- Don't set headings in bold (700+); weight 500 Archivo at 40–56px is the maximum voice
- Don't alternate between light and dark sections within a single content flow — the page is dark-dominant after the hero
- Don't use Archivo for numeric step counters, product codes, or instrumentation labels — those are Space Mono territory
- Don't add gradient fills to buttons or cards — the one gradient in the system (white→red) is reserved for the hero-to-content transition

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas — Light | `#ffffff` | Navigation bar, light interstitial bands |
| 1 | Canvas — Dark | `#0b0405` | Primary content section background, full-bleed dark bands |
| 2 | Card Surface | `#150e0f` | Elevated panels and feature cards on dark sections |

## Elevation

No drop shadows. Structure is defined entirely by 1px hairline borders (#382e30 on dark, #e5e5e5 implied on light) and the 4-step surface value stack. Components sit flat against their canvas, separated by lines rather than lifted by blur — the industrial-control-room approach.

## Imagery

Photography is the dominant visual: industrial subjects (logistics trucks, construction sites, workers in hard hats) shot in golden-hour or moody low-light conditions. Images are full-bleed with dark gradient overlays so they merge into the #0b0405 section backgrounds. UI mockups (mini browser panels, chat interfaces) appear as flat dark-on-dark diagrams with red accent dots, never as realistic product screenshots. The Andercore 'A' mark functions as both logo and a small red UI token (avatar, connector node). No illustration style — everything is either photographic, diagrammatic, or pure typography on dark canvas.

## Layout

The page runs at max-width 1200px centered, but most sections are full-bleed dark bands. The hero is a full-bleed photographic image with dark overlay, headline left-aligned in the lower-third. Content sections follow a single-column rhythm: section eyebrow badge → heading → body text, with primary CTAs right-aligned. Three-column feature grids appear inside dark sections at equal 32px gutters. The step progress flow uses a 2/3-left text, 1/3-right visual (chat + photo) split. Vertical spacing is generous: 80px between sections, 32px card padding, 24px element gaps. Navigation is a thin white fixed bar at the top — the only consistently light surface on an otherwise dark page.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (on dark) / #0b0405 (on light)
- background: #0b0405 (dark sections) / #ffffff (nav)
- border: #382e30 (on dark) / #858182 (badges)
- accent: #e32735 (Signal Red)
- muted text: #858182 (Slate)
- primary action: #e32735 (filled action)

**3-5 Example Component Prompts**

1. *Create a dark hero section*: #0b0405 full-bleed background, 80px vertical padding. Display headline at 56px Archivo weight 500, #ffffff, letter-spacing -1.12px, line-height 1.10. Subtext at 16px Archivo weight 400, #858182. Primary CTA: #e32735 fill, white text 14px Archivo weight 500, 12px 24px padding, 4px radius. Ghost button beside it: #150e0f fill, 1px #382e30 border, white text, same padding and radius.

2. *Create a three-column feature row*: #0b0405 background, 32px between columns. Each card: 1px #382e30 border, 32px padding, 4px radius. Eyebrow badge above: Space Mono 12px, #858182 text, 1px #858182 border, 8px 12px padding. Card heading at 24px Archivo weight 500, #ffffff. Body at 14px Archivo weight 400, #858182.

3. *Create a step progress indicator*: horizontal row on #0b0405. Three steps labeled 'Request', 'Quote', 'Track'n'Trace' in Archivo 14px. Active step: #e32735 text with a 2px #e32735 underline bar. Inactive: #858182 text, no underline. Step numbers '01', '02', '03' in Space Mono 12px #858182, right-aligned.

4. *Create a dark content section*: #0b0405 background, max-width 1200px centered, 80px vertical padding. Section heading at 40px Archivo weight 500, #ffffff, -0.80px letter-spacing. Body paragraph at 16px Archivo weight 400, #858182. Red accent CTA button top-right: #e32735 fill, white 'Get access now' text, 12px 24px padding, 4px radius.

5. *Create an industrial badge/tag*: transparent fill, 1px #858182 border, Space Mono 12px text in #858182, padding 8px 12px, 4px radius. Used as section eyebrows above headings.

## Gradient System

The system uses exactly one gradient: a horizontal white-to-red transition (linear-gradient 90deg, #ffffff 18%, #e32735)) applied only to the hero image overlay edge or to decorative connector lines that fade from canvas to signal. No other gradients exist — buttons, cards, and backgrounds are all flat fills.

## Similar Brands

- **Kommo** — Same dark-near-black canvas with a single rationed chromatic accent for primary actions, Archivo-style geometric sans throughout
- **Tensor** — Industrial/B2B tone with 1px line-based card borders, 4px corners, and a single red-orange signal color against deep black
- **Framer** — Dark full-bleed sections with sharp 4px radii, no shadows, and a tight geometric grotesk as the only typeface
- **Vercel** — Max-width 1200px centered layout, sharp minimal corners, dark-dominant sections, and a monochrome palette with one accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-red: #e32735;
  --color-carbon: #0b0405;
  --color-graphite: #150e0f;
  --color-steel: #382e30;
  --color-slate: #858182;
  --color-chalk: #ffffff;
  --color-foil: #000000;

  /* Typography — Font Families */
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1.12px;

  /* Typography — Weights */
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
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-badges: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-canvas-light: #ffffff;
  --surface-canvas-dark: #0b0405;
  --surface-card-surface: #150e0f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-red: #e32735;
  --color-carbon: #0b0405;
  --color-graphite: #150e0f;
  --color-steel: #382e30;
  --color-slate: #858182;
  --color-chalk: #ffffff;
  --color-foil: #000000;

  /* Typography */
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1.12px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
}
```
