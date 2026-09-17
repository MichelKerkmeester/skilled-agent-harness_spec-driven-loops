# Sauce Labs — Style Reference
> Neon-lit command center on obsidian glass — a dark engineering console where a single green pulse marks every live signal.

**Theme:** dark

Sauce Labs operates as a neon-lit engineering console: deep obsidian canvas (#132322) with white precision typography and a single vivid green (#3ddc91) that activates every interactive surface. The system alternates between dark structural bands and light content cards (#edf7f5), creating rhythm through luminance contrast rather than ornament or elevation. Components are confident and generously rounded — 56px pill buttons, 20px card radii, minimal shadow — reading as high-end developer tooling where the product's intelligence is the visual subject. The green accent is rationed: it appears on primary actions, active tab states, announcement bars, and stat highlights, never as decoration, which gives it real semantic weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Shell | `#132322` | `--color-obsidian-shell` | Primary page background, dark navigation, dark card surfaces — the structural canvas that absorbs everything else and makes the green accent feel electric by contrast |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text on dark surfaces, card content backgrounds, light section canvases — maximum contrast against the obsidian shell |
| Mint Frost | `#edf7f5` | `--color-mint-frost` | Light content card surfaces, elevated feature panels — the bright counterpoint that breaks up dark sections and hosts detailed content |
| Deep Abyss | `#0e1a19` | `--color-deep-abyss` | Darker surface variant for nested elements, deep card backgrounds, gradient endpoints — pushes further into the void when extra depth is needed |
| Charcoal | `#070f0f` | `--color-charcoal` | Darkest surface for overlays, modals, and maximum-contrast panels |
| Fog Border | `#d0d3d3` | `--color-fog-border` | Hairline dividers and borders on light surfaces — quiet structural lines that never compete with content |
| Stone Border | `#b2b6b4` | `--color-stone-border` | Medium borders on light cards, secondary dividers, subtle frame lines |
| Slate Text | `#828786` | `--color-slate-text` | Muted body text, captions on light backgrounds, secondary labels |
| Graphite Fill | `#424f4f` | `--color-graphite-fill` | Icon fills, decorative SVG strokes on light sections |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills, high-contrast decorative strokes — graphic asset workhorse |
| Neon Pulse | `#3ddc91` | `--color-neon-pulse` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Mint Whisper | `#97ddbc` | `--color-mint-whisper` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Signal Yellow | `#ffcd48` | `--color-signal-yellow` | Accent fills within isometric illustrations and product mockups — a warm punctuation that breaks the green monochrome and adds dimensional interest to graphics |

## Tokens — Typography

### Aeonik — Body and UI text — the workhorse typeface for paragraphs, button labels, nav items, card content, and form fields. Clean geometric humanist sans at weight 400, tightly tracked at body sizes (-0.08px at 16px). · `--font-aeonik`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 15px, 16px, 18px, 20px, 24px
- **Line height:** 1.20–1.50
- **Letter spacing:** -0.08px at 16px body, 0.96px at 24px subheading
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Body and UI text — the workhorse typeface for paragraphs, button labels, nav items, card content, and form fields. Clean geometric humanist sans at weight 400, tightly tracked at body sizes (-0.08px at 16px).

### AeonikFono — Display, headings, and uppercase eyebrow labels. Weight 500 for the largest display sizes (40–64px) to anchor the hierarchy; weight 400 for 14–32px headings and 9px all-caps labels with 0.05em tracking. The 9px tracked-out caps create the small structural labels that sit above section titles. · `--font-aeonikfono`
- **Substitute:** Inter Display
- **Weights:** 400 500
- **Sizes:** 9px, 14px, 16px, 24px, 32px, 40px, 48px, 64px
- **Line height:** 1.10–1.30
- **Letter spacing:** 0.45px at 9px caption (0.05em), 0.05em throughout
- **Role:** Display, headings, and uppercase eyebrow labels. Weight 500 for the largest display sizes (40–64px) to anchor the hierarchy; weight 400 for 14–32px headings and 9px all-caps labels with 0.05em tracking. The 9px tracked-out caps create the small structural labels that sit above section titles.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.45 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.08px | `--text-body` |
| body-lg | 18px | 1.45 | — | `--text-body-lg` |
| subheading | 24px | 1.4 | 0.96px | `--text-subheading` |
| heading-sm | 32px | 1.22 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.12 | — | `--text-heading-lg` |
| display | 64px | 1.1 | — | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 56px |
| cards | 20px |
| buttons | 56px |
| largeCards | 60px |
| smallElements | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.04) 1px 0px 9px 2px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary CTA Button (Pill)
**Role:** Main conversion action — sign up, try free, get started

56px border-radius (fully pill-shaped). Background: #3ddc91 (Neon Pulse). Text: #132322, Aeonik 16px weight 400, letter-spacing -0.08px. Padding: 14px 28px. No border. On hover, slightly brightens. This is the single most prominent interactive element in the system.

### Ghost CTA Button (Pill)
**Role:** Secondary action — book demo, learn more

56px border-radius. Background: transparent. Border: 1.5px solid #ffffff. Text: #ffffff, Aeonik 16px weight 400. Padding: 14px 28px. Pairs directly beside the primary green pill in the nav and hero.

### Dark Text Button
**Role:** Tertiary nav action — Book a Demo in top bar

No background, no border. Text: #ffffff, Aeonik 15px weight 400. Minimal padding. Sits left of the CTA cluster in navigation.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width bar. Background: #3ddc91 (Neon Pulse). Text: #132322, Aeonik 14px weight 400. Small close (×) button on the right. Creates immediate green punctuation at the page entry point.

### Navigation Bar
**Role:** Primary site navigation

Full-width dark bar. Background: #132322. Logo left, nav items centered (Aeonik 15px white, with dropdown chevrons), CTA cluster right. No visible border or shadow — sits directly on the dark canvas.

### Stat Block
**Role:** Social proof metrics below hero

Horizontal row. Number: #3ddc91, AeonikFono 48px weight 500. Label: #ffffff at ~50% opacity, Aeonik 9px weight 400, letter-spacing 0.45px, uppercase. No container — floats directly on the dark hero background.

### Logo Bar Tile
**Role:** Enterprise social proof — client logos

Dark rounded card (60px radius, background: #0e1a19) containing a white monochrome logo. Arranged in a horizontal row with even spacing. Logos sit at white or light gray for contrast against the dark tile.

### Light Content Card
**Role:** Feature section container — platform overviews, product modules

60px border-radius. Background: #edf7f5 (Mint Frost). Padding: 48px internal. Shadow: rgba(0,0,0,0.04) 1px 0px 9px 2px. Contains headline, description text, tab navigation, and product preview. The bright counterpoint to the dark page.

### Tab Pill Navigation
**Role:** Feature section content switcher

Horizontal row of pill-shaped tabs. Active tab: 56px radius, #3ddc91 background, #132322 text. Inactive tabs: 56px radius, transparent background, #828786 text. Padding: 12px 24px. Arrow chevrons at both ends for overflow indication.

### Eyebrow Label
**Role:** Section category indicator above headlines

AeonikFono 9px weight 400, letter-spacing 0.45px, uppercase. Color: #132322 on light cards, #3ddc91 on dark sections. Examples: 'ENTERPRISE-READY. AI-DRIVEN. ONE UNIFIED VIEW.'

### Hero Headline
**Role:** Primary page-level value proposition

AeonikFono 64px weight 500, line-height 1.10, color #ffffff on dark hero. Multi-line, left-aligned. The largest text element on the page — sets the tone for everything below.

### Isometric Product Illustration
**Role:** Visual product representation in hero

3D isometric phone rendering with stacked colored module cards (green #3ddc91, mint #97ddbc, yellow #ffcd48, light gray). Thin connecting lines and small floating elements (Test, Build, Deploy, Operate labels). Sits on the right side of the hero split.

### Product Screenshot Panel
**Role:** Dashboard or UI preview within content cards

Embedded within Mint Frost content cards. Shows realistic product UI with browser chrome, dashboard widgets, and data visualizations. Background: #ffffff for the screen area, #0e1a19 for the chrome frame.

## Do's and Don'ts

### Do
- Use #3ddc91 exclusively for primary actions, active states, and the announcement bar — ration it to preserve its signal weight
- Set all buttons to 56px border-radius for the fully pill-shaped interactive language
- Use 60px radius for large content cards and 20px for smaller nested cards
- Place uppercase eyebrow labels (AeonikFono 9px, 0.45px tracking) above section headlines as structural anchors
- Alternate between dark #132322 bands and light #edf7f5 content cards to create section rhythm through luminance contrast
- Set Aeonik body text to weight 400 with -0.08px tracking at 16px for the clean geometric feel
- Use #0e1a19 for nested dark surfaces to create depth within the obsidian shell without introducing new hues

### Don't
- Don't apply #3ddc48 or any green to decorative non-interactive elements — the accent only works as a live signal because it's rationed
- Don't use square or slightly-rounded buttons — the 56px pill is non-negotiable for system identity
- Don't place light cards directly adjacent to each other without a dark band between them
- Don't use box shadows heavier than rgba(0,0,0,0.04) — depth comes from luminance layers, not drop shadows
- Don't use color gradients — the system is entirely flat with luminance-defined depth
- Don't use body weight above 400 or display weight above 500 — the thin weights are the signature
- Don't introduce new chromatic colors beyond the defined palette — green, yellow, and white are the only voices

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#132322` | Primary page background — the dark structural plane |
| 2 | Deep Card | `#0e1a19` | Nested dark cards, logo bar tiles, stat containers |
| 3 | Mint Card | `#edf7f5` | Light content cards floating on the dark canvas |
| 4 | White Panel | `#ffffff` | Product screenshots, dashboard previews, maximum-light surfaces |

## Elevation

- **Light content card:** `rgba(0, 0, 0, 0.04) 1px 0px 9px 2px`
- **Dark stat tile:** `none — relies on #0e1a19 against #132322 for depth`

## Imagery

The visual language centers on isometric product illustrations — a 3D phone rendering with stacked colored cards representing product modules (AI-Powered Insights, Mobile App Testing, Web Testing, Model App Distribution, Error Reporting, Visual Testing). Illustrations use flat geometric shapes with soft shadows, brand greens (#3ddc91, #97ddbc) and signal yellow (#ffcd48) for card surfaces, and thin connector lines linking modules. Product screenshots appear in dashboard mockup panels with realistic UI chrome. Logo bars for social proof use dark tile containers with white monochrome logos. No photography — the product itself is the hero, rendered as 3D isometric and flat UI mockups.

## Layout

Full-bleed dark canvas with max-width 1200px content containers. The hero is a split composition: left-aligned headline and CTAs (roughly 50% width) with a right-aligned isometric product illustration. Section rhythm alternates between dark structural bands and light content cards (mint frost #edf7f5) that float on the dark background. Logo bar uses evenly-spaced dark tiles in a single row. Feature sections use centered headline stacks with tab-pill navigation below. Stats appear as a horizontal row of large green numbers with small uppercase labels. Navigation is a single dark bar with logo left, centered nav items, and CTA cluster right. The overall feel is a dark dashboard with bright content cards rising from it.

## Agent Prompt Guide

**Quick Color Reference**
- text on dark: #ffffff
- text on light: #132322
- dark canvas: #132322
- light card: #edf7f5
- border (light): #d0d3d3
- primary action: #3ddc91 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #3ddc91 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Build a stat block row: Four columns on #132322 background. Each shows a number in AeonikFono 48px weight 500, color #3ddc91, with a label below in AeonikFono 9px weight 400, letter-spacing 0.45px, uppercase, color #ffffff at 50% opacity.

3. Build a light content card: 60px border-radius, background #edf7f5, padding 48px. Eyebrow label in AeonikFono 9px weight 400, letter-spacing 0.45px, uppercase, color #132322. Headline in AeonikFono 40px weight 500, color #132322, line-height 1.20. Body text in Aeonik 16px, color #132322.

4. Build a tab pill navigation row: Five pill tabs, each 56px radius, 12px 24px padding. Active tab: #3ddc91 background, #132322 text. Inactive: transparent background, #828786 text. Aeonik 16px weight 400 throughout. Left/right chevron arrows in #828786.

5. Build a logo bar: Row of five tiles, each 60px border-radius, #0e1a19 background, 120px tall. Inside each: white monochrome client logo, centered. Even 24px gap between tiles.

## Dark/Light Rhythm

The page oscillates between dark structural sections and light content cards. Dark sections host: navigation, hero, stats, CTA bands, footer. Light cards (Mint Frost #edf7f5, 60px radius) float on the dark canvas to host: feature deep-dives, platform overviews, product module breakdowns. This luminance alternation replaces the need for section dividers, borders, or heavy shadows. Never place a light card on a light card or a dark card on a dark card — the contrast is the structure.

## Similar Brands

- **Vercel** — Same dark-canvas + single-accent approach with pill-shaped CTAs and minimal shadow — both treat the dark background as a stage for a single luminous signal color
- **Linear** — Identical dark navigation, restrained green accent on interactive states, geometric sans typography, and the same sense of a product-first engineering tool
- **Datadog** — Dark devtools dashboard aesthetic with monospace-influenced geometric sans, flat surfaces, and accent colors reserved for live data signals
- **Resend** — Dark hero with vivid single-color accent, generous card radii, uppercase tracked-out eyebrow labels, and alternating dark/light content bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-shell: #132322;
  --color-pure-white: #ffffff;
  --color-mint-frost: #edf7f5;
  --color-deep-abyss: #0e1a19;
  --color-charcoal: #070f0f;
  --color-fog-border: #d0d3d3;
  --color-stone-border: #b2b6b4;
  --color-slate-text: #828786;
  --color-graphite-fill: #424f4f;
  --color-pure-black: #000000;
  --color-neon-pulse: #3ddc91;
  --color-mint-whisper: #97ddbc;
  --color-signal-yellow: #ffcd48;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonikfono: 'AeonikFono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.45;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.96px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.22;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.12;
  --text-display: 64px;
  --leading-display: 1.1;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-full: 50px;
  --radius-full-2: 56px;
  --radius-full-3: 60px;
  --radius-full-4: 80px;

  /* Named Radii */
  --radius-tabs: 56px;
  --radius-cards: 20px;
  --radius-buttons: 56px;
  --radius-largecards: 60px;
  --radius-smallelements: 10px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 1px 0px 9px 2px;

  /* Surfaces */
  --surface-obsidian-canvas: #132322;
  --surface-deep-card: #0e1a19;
  --surface-mint-card: #edf7f5;
  --surface-white-panel: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-shell: #132322;
  --color-pure-white: #ffffff;
  --color-mint-frost: #edf7f5;
  --color-deep-abyss: #0e1a19;
  --color-charcoal: #070f0f;
  --color-fog-border: #d0d3d3;
  --color-stone-border: #b2b6b4;
  --color-slate-text: #828786;
  --color-graphite-fill: #424f4f;
  --color-pure-black: #000000;
  --color-neon-pulse: #3ddc91;
  --color-mint-whisper: #97ddbc;
  --color-signal-yellow: #ffcd48;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonikfono: 'AeonikFono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.45;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.96px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.22;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.12;
  --text-display: 64px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-full: 50px;
  --radius-full-2: 56px;
  --radius-full-3: 60px;
  --radius-full-4: 80px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 1px 0px 9px 2px;
}
```
