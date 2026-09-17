# Replicate — Style Reference
> Golden hour API workshop

**Theme:** light

Replicate projects a sunlit developer playground on white: one signature sunset gradient (magenta → ember → gold) anchors the hero, section borders, and brand moments, while every interactive surface dissolves into a pill (9999px radius). The system pairs a high-contrast display face (RB Freigeist Neue, up to 128px) for editorial headlines against Basier Square at 14–16px with -0.025em tracking for functional UI — two voices, one warm-white canvas. Code is first-class: GitHub-syntax editor cards live directly inside marketing layouts, not buried in docs. Color discipline is severe: nearly the entire interface is #202020 on #ffffff, with a single ember accent (#ea2804) appearing only inside the gradient and the logo mark. Shadows are essentially absent — flat surfaces and 1px hairline borders carry the elevation language instead.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sunset Gradient | `linear-gradient(135deg, #ff6bfc 0%, #ea2804 50%, #f6f47f 100%)` | `--color-sunset-gradient` | Hero background wash, section border frames, brand-mark dot grid — the only chromatic surface treatment in the system. Always at full saturation; never desaturated or muted; The single non-gradient accent — appears in the logo mark and the warm shadow tint. Never used for buttons, links, or text; its job is to anchor the gradient's red midpoint |
| Forest Signal | `#2b9a66` | `--color-forest-signal` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, card surfaces, code editor background. The base layer everything sits on |
| Ink | `#202020` | `--color-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Graphite | `#646464` | `--color-graphite` | Secondary text, metadata, run counts, helper labels. Provides a quiet middle step between Ink and the silver border tones |
| Silver | `#bfbfbf` | `--color-silver` | Avatar ring borders, decorative shadow tint, inactive dividers |
| Smoke | `#d9d9d9` | `--color-smoke` | Hairline borders on cards, model tiles, and input fields. The primary structural divider color |
| Fog | `#f0f0f0` | `--color-fog` | Subtle surface step (alt card backgrounds, section bands), input field default state |
| Vellum | `#f9f9f9` | `--color-vellum` | Warm-white off-state surface used for the secondary surface tier (e.g. model card backgrounds behind thumbnails) |
| Cream Paper | `#fefce9` | `--color-cream-paper` | Rare warm-tinted surface used inside editor cards and callout blocks — a very subtle nod to the gradient's yellow endpoint |
| Carbon | `#000000` | `--color-carbon` | True black for the logo wordmark, high-contrast icon strokes, and maximum-impact filled buttons when Ink is insufficient |

## Tokens — Typography

### RB Freigeist Neue — Display and editorial headlines. The high-contrast geometric face carries all the visual drama — 128px hero ('Run AI with an API.'), 48–72px section openers, 30px sub-headers. The 1.0 line-height at display sizes is a signature: letters almost touch, creating a dense monumental block. Tracking tightens to -0.025em at every size. · `--font-rb-freigeist-neue`
- **Substitute:** Space Grotesk or Archivo
- **Weights:** 400, 600, 700
- **Sizes:** 16px, 30px, 48px, 72px, 128px
- **Line height:** 1.00, 1.20, 1.50
- **Letter spacing:** -0.025em
- **Role:** Display and editorial headlines. The high-contrast geometric face carries all the visual drama — 128px hero ('Run AI with an API.'), 48–72px section openers, 30px sub-headers. The 1.0 line-height at display sizes is a signature: letters almost touch, creating a dense monumental block. Tracking tightens to -0.025em at every size.

### Basier Square — All functional UI: body copy, navigation, buttons, labels, badges, metadata, table cells, footer. The geometric humanist counterpoint to Freigeist — quiet enough to disappear, warm enough to read at 12px captions. 14px body, 16px default, 20–24px for sub-headings, 29px for the largest non-display heading tier. · `--font-basier-square`
- **Substitute:** Inter or Geist
- **Weights:** 400, 600
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 29px
- **Line height:** 1.11, 1.33, 1.40, 1.43, 1.50, 1.56
- **Letter spacing:** -0.025em
- **Role:** All functional UI: body copy, navigation, buttons, labels, badges, metadata, table cells, footer. The geometric humanist counterpoint to Freigeist — quiet enough to disappear, warm enough to read at 12px captions. 14px body, 16px default, 20–24px for sub-headings, 29px for the largest non-display heading tier.

### JetBrains Mono — Code blocks, API tokens, version strings, inline code, keyboard shortcuts (e.g. the '⌘+K' chip inside the search input). Lives exclusively inside editor cards and technical micro-labels. · `--font-jetbrains-mono`
- **Substitute:** Fira Code or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 10px, 11px, 14px, 16px
- **Line height:** 1.43, 1.50
- **Letter spacing:** normal
- **Role:** Code blocks, API tokens, version strings, inline code, keyboard shortcuts (e.g. the '⌘+K' chip inside the search input). Lives exclusively inside editor cards and technical micro-labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.3px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.35px | `--text-body-sm` |
| body | 16px | 1.5 | -0.4px | `--text-body` |
| subheading | 20px | 1.4 | -0.5px | `--text-subheading` |
| heading-sm | 24px | 1.4 | -0.6px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.75px | `--text-heading` |
| heading-lg | 48px | 1.2 | -1.2px | `--text-heading-lg` |
| display | 128px | 1 | -3.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| icons | 9999px |
| badges | 9999px |
| images | 0px |
| inputs | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(228, 199, 103) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Primary Action Button (Filled Black)
**Role:** Highest-priority action across hero, nav, and section CTAs

Background #000000 or #202020, text #ffffff, Basier Square 14px weight 600, 9999px radius, horizontal padding 16px, vertical padding 8px. May include a 14px leading icon. The 'Try for free', 'Get started for free', and 'Explore models' buttons all use this variant. There is no chromatic CTA — the button's contrast against Bone White is its emphasis.

### Ghost / Outlined Button
**Role:** Secondary action sitting beside a primary CTA

Transparent background, 1px #d9d9d9 border, text #202020, Basier Square 14px weight 600, 9999px radius, 16px / 8px padding. Used for 'Push a model' and other low-emphasis paired actions.

### Pill Category Tag
**Role:** Category filters above model grids

Bone White background, 1px #d9d9d9 border, 9999px radius, 10–12px horizontal padding, 4–6px vertical padding, Basier Square 14px weight 400, text #202020. The 'Generate images', 'Generate speech', 'Generate music' filters in the screenshots are this component.

### Official / Status Badge
**Role:** Trust signal on model and contributor cards

Forest Signal #2b9a66 background with white text for success/verified, or transparent with #646464 text for neutral metadata. 9999px radius, 4–6px padding, Basier Square 12px weight 600. The 'Official' checkmark badge on model cards uses the green variant.

### Model Card
**Role:** Primary content unit in model browse grids

Bone White background, 1px #d9d9d9 border, 0px radius, 16px internal padding. Left column: square or wide thumbnail (0px radius, full-bleed to card edge). Right column: model name in Basier Square 16px weight 600, owner handle 12px weight 400 #646464, description in Basier Square 14px weight 400 #202020 truncated to 2 lines, run count in Basier Square 12px weight 600 #646464, and an 'Official' badge aligned right.

### Code Editor Card
**Role:** Live code snippet embedded in marketing surfaces

Bone White background, 1px #d9d9d9 border, 0px radius. Top bar: tab switcher (Node / Python / HTTP) in Basier Square 12px weight 600, 16px horizontal padding, 10px vertical padding, with the active tab showing a 2px #202020 bottom indicator. Code area: JetBrains Mono 14px on Bone White, 16px line-height, 16px padding. Syntax colors follow GitHub palette: keywords #d73a49, strings #032f62, properties #005cc5, function names #6f42c1, numbers/comments #6a737d. A small circle/dot in the top-right corner acts as a window-control decoration.

### Top Navigation Bar
**Role:** Persistent site-wide header

Bone White background, 0px radius, 64px tall, 1px #f0f0f0 bottom border. Left: wordmark 'replicate' in Carbon #000000 Basier Square 16px weight 600 with a custom three-arc logomark. Center: expanded search input. Right: text links (Explore ▾, Pricing, Enterprise, Docs, Blog, Sign in) in Basier Square 14px weight 400 #202020, 16px gap, followed by the black filled 'Try for free' button.

### Search Input
**Role:** Primary site search, visible in nav and above model grids

Bone White background, 1px #d9d9d9 border, 9999px radius, 40px tall. Leading 14px search icon in #646464. Placeholder 'Search best image models or 

### Gradient Hero Banner
**Role:** First-viewport brand statement

Full-bleed linear-gradient(135deg, #ff6bfc 0%, #ea2804 50%, #f6f47f 100%) background. Overlaid with a faint dot-grid texture (rgb(0,0,0) dots at ~8% opacity, 16px spacing) to give the gradient tactile grain. Headline: RB Freigeist Neue 128px weight 600, #ffffff, line-height 1.0, letter-spacing -3.2px. Subtext: Basier Square 18px weight 400 #ffffff at ~85% opacity. CTA: Primary Action Button (Filled Black) with no color change — the black creates a hard focal point against the warm wash.

### Gradient-Bordered Section Frame
**Role:** Highlight callout wrapping content blocks (e.g. 'How it works')

Outer container has a 4–6px padding filled with the sunset gradient. Inner container is Bone White with 32–48px internal padding and 0px radius. Used to magnetize the eye toward a specific section without darkening the page.

### Community Avatar Strip
**Role:** Social proof — brands and contributors who use Replicate

Two horizontal rows of circular avatars (40–48px diameter) connected by a dotted #d9d9d9 1px line that threads through each circle's vertical center. Avatars are images clipped to a circle; no border, no shadow. Creates a constellation effect that reads as 'network' without explicit labels.

### Tab Control
**Role:** Code language switcher inside editor cards

Inline list of plain text labels in Basier Square 12px weight 600. Active tab: text #202020 with a 2px #202020 bottom underline, 4px padding-bottom. Inactive: text #646464, no underline. 16px horizontal gap between tabs. Sits flush-left at the top of the code area inside the Code Editor Card.

### Run Count Stat
**Role:** Model popularity metric on cards

Basier Square 12px weight 600 #646464, prefixed with a small numerical value (e.g. '219.5k runs'). Inline, right-aligned within the model card footer row.

## Do's and Don'ts

### Do
- Use the sunset gradient (magenta → ember → gold at 135deg) as a full-bleed hero background, section border frame, or accent wash — never as a text fill or icon fill.
- Apply 9999px radius to every button, tag, badge, input, and small interactive element; use 0px radius on cards, images, and code editors to create the flat/pill contrast.
- Set display headlines in RB Freigeist Neue at 48–128px with line-height 1.0 and letter-spacing -0.025em — the dense monumental block is the brand voice.
- Keep body and UI text in Basier Square 14–16px weight 400–600 with letter-spacing -0.025em; never let body text drop below 12px.
- Render code in JetBrains Mono 14px on Bone White with the GitHub syntax palette: keywords #d73a49, strings #032f62, properties #005cc5, functions #6f42c1.
- Anchor all body text and icons to #202020 on #ffffff — the 16:1 contrast is part of the visual identity.
- Use 64px section gaps and 8px element gaps; keep cards at 16px internal padding and 1px #d9d9d9 hairline borders.

### Don't
- Don't introduce a chromatic CTA — primary actions are always black-filled (#000000 / #202020), and secondary actions are ghost/outlined.
- Don't apply the gradient to text, icons, or button backgrounds — it belongs to surfaces and frames only, and at full saturation.
- Don't add drop shadows to cards, modals, or navigation; the system is flat. Use 1px Smoke borders for separation instead.
- Don't mix in a third typeface beyond Basier Square, Freigeist Neue, and JetBrains Mono.
- Don't use sharp 4–8px radii for buttons or tags; the pill shape (9999px) is non-negotiable across all chip-like components.
- Don't use Graphite (#646464) for primary body text — it is a metadata/helper tier only. Primary text must be Ink (#202020).
- Don't desaturate, mute, or pastel-tint the gradient. Its vibrancy is the system.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background |
| 1 | Card | `#ffffff` | Model cards, code editor, content tiles — same as canvas but with 1px Smoke border |
| 2 | Recessed | `#f9f9f9` | Subtle tier for model tile backgrounds behind thumbnails |
| 3 | Accent Surface | `#fefce9` | Warm-tinted callout/editor interior — echoes the gradient's yellow stop |

## Elevation

The system is essentially flat. No drop shadows on cards, tiles, or modals. Elevation is expressed through a single warm-tinted shadow rgb(228, 199, 103) 0px 1px 2px 0px applied to rare code/terminal blocks, and through 1px Smoke (#d9d9d9) hairline borders elsewhere. Cards float on the same Bone White as the canvas — only their border separates them.

## Imagery

Imagery is functional and code-centric rather than decorative. Model thumbnails fill the left half of every card — raw output crops at full saturation, no rounded corners, no overlay treatment. Avatars are circle-clipped portraits at 40–48px. The hero uses an abstract warm gradient with a faint black dot-grid texture rather than a photograph. There is no lifestyle photography, no product hero shot, no marketing illustration — the code snippet and model output images ARE the visual content. Icon style is minimal: thin 1.5px stroke, monochrome Ink or white on the gradient, no filled icons except the brand mark's three arcs.

## Layout

Page model is max-width 1200px centered with full-bleed gradient sections at the top and bottom. The hero is a single full-viewport gradient banner with a left-aligned headline stack and a side-by-side code-editor + model-output preview below the fold. Sections below alternate between white and white-with-gradient-border frames at 64px vertical gaps. Model grids are 3-column on desktop, 2-column on tablet, 1-column on mobile, with cards stacking image-left and text-right. The community avatar strip spans the full content width as a single decorative band. Navigation is a 64px sticky top bar with logo left, search center, links + CTA right. Density is compact but breathable: model cards have 16px padding and 24px gap, never crowding.

## Agent Prompt Guide

Quick Color Reference\n- text: #202020\n- background: #ffffff\n- border: #d9d9d9\n- accent: #ea2804 (gradient ember only — not for buttons)\n- primary action: no distinct CTA color

## Gradient System

A single canonical gradient carries the brand: linear-gradient(135deg, #ff6bfc 0%, #ea2804 50%, #f6f47f 100%). It appears in four contexts only: (1) full-bleed hero background, (2) 4–6px section border frames, (3) logo mark dot/accent, (4) subtle decorative washes. A secondary fade variant — linear-gradient(180deg, rgba(234,40,4,0.5), #ffffff) — is used for top-edge gradient transitions into white sections. Never rotate, skew, or split the gradient. Never replicate the three stops as separate solid colors in other components — they exist only as a sequence.

## Similar Brands

- **Hugging Face** — Same developer-first product browse with a 3-column model card grid, white canvas, and a single warm yellow emoji/icon accent — though Replicate swaps yellow for the magenta-ember-gold gradient.
- **Vercel** — Shared high-contrast black-on-white interface, monospaced code snippets inline with marketing, and near-identical minimal top nav with logo + search + filled black CTA.
- **Linear** — Same two-typeface strategy (one geometric display face + one tight-tracking UI sans), pill-shaped tags and buttons everywhere, and flat surfaces with hairline borders instead of drop shadows.
- **Modal** — Same approach of a vivid full-bleed gradient hero over a max-width white content stack, with display headlines that almost touch at 1.0 line-height.
- **Anthropic** — Similar warm-editorial-meets-technical posture: large display headlines, tight letter-spacing, and a single warm accent color used sparingly against a near-white canvas.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sunset-gradient: #ea2804;
  --gradient-sunset-gradient: linear-gradient(135deg, #ff6bfc 0%, #ea2804 50%, #f6f47f 100%);
  --color-forest-signal: #2b9a66;
  --color-bone-white: #ffffff;
  --color-ink: #202020;
  --color-graphite: #646464;
  --color-silver: #bfbfbf;
  --color-smoke: #d9d9d9;
  --color-fog: #f0f0f0;
  --color-vellum: #f9f9f9;
  --color-cream-paper: #fefce9;
  --color-carbon: #000000;

  /* Typography — Font Families */
  --font-rb-freigeist-neue: 'RB Freigeist Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basier-square: 'Basier Square', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.75px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.2px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -3.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-icons: 9999px;
  --radius-badges: 9999px;
  --radius-images: 0px;
  --radius-inputs: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(228, 199, 103) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-recessed: #f9f9f9;
  --surface-accent-surface: #fefce9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sunset-gradient: #ea2804;
  --color-forest-signal: #2b9a66;
  --color-bone-white: #ffffff;
  --color-ink: #202020;
  --color-graphite: #646464;
  --color-silver: #bfbfbf;
  --color-smoke: #d9d9d9;
  --color-fog: #f0f0f0;
  --color-vellum: #f9f9f9;
  --color-cream-paper: #fefce9;
  --color-carbon: #000000;

  /* Typography */
  --font-rb-freigeist-neue: 'RB Freigeist Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basier-square: 'Basier Square', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.75px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.2px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -3.2px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(228, 199, 103) 0px 1px 2px 0px;
}
```
