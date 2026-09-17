# Cap — Style Reference
> quiet white studio with a single blue spark

**Theme:** light

Cap reads as a calm, white-canvas workspace with a single confident blue accent — the visual language of a focused native desktop tool that happens to live in a browser. Surfaces are nearly white with hairline gray borders doing most of the structural work; elevation is barely-there, leaning on 1px strokes and subtle inset highlights rather than heavy drop shadows. Typography is a single geometric sans at three weights, set generously tight on display sizes, with uppercase eyebrow labels floating at 20% letter-spacing above section headings. The two-color button system — black for download/ownership, blue for upgrade/purchase — carries all the decision-making in the layout; everything else stays quiet. Multi-color gradients appear only inside the product mockup (the wave/ribbon artwork) and never bleed into UI chrome, keeping the interface disciplined.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#3b82f6` | `--color-signal-blue` | Primary brand accent — links, active nav indicators, icon highlights, the inner play-button of the product mockup. Saturated enough to be the one color users remember, restrained enough to never compete with copy |
| Action Blue | `#2563eb` | `--color-action-blue` | Filled CTA buttons (Upgrade to Cap Pro), focus rings, and the strongest interactive state. One shade deeper than Signal Blue to give pressed actions a subtle weight shift |
| Ink Black | `#202020` | `--color-ink-black` | Headings, body text, the dark CTA button fill (Download for free). Off-black rather than pure #000 to avoid harsh edges on white |
| Carbon | `#000000` | `--color-carbon` | Pure black reserved for the highest-emphasis text and icon fills where maximum contrast is required |
| Paper | `#fcfcfc` | `--color-paper` | Page and card canvas — the dominant surface across the entire site. Near-white, not pure white, to soften the reading field |
| Mist | `#f0f0f0` | `--color-mist` | Secondary surface for subtle differentiation — the segmented control track, inset highlights, and muted button backgrounds |
| Fog | `#e0e0e0` | `--color-fog` | Hairline borders on cards, buttons, and the nav bar. The structural divider of the design system |
| Ash | `#e5e7eb` | `--color-ash` | Borders and dividers at the lowest visual layer; also appears as a subtle backdrop wash behind the footer card |
| Steel | `#c2c2c2` | `--color-steel` | Mid-gray for secondary icon strokes and placeholder-like elements that should recede but remain visible |
| Graphite | `#838383` | `--color-graphite` | Muted captions, helper text, and de-emphasized UI labels. |
| Slate | `#646464` | `--color-slate` | Button text on light surfaces, tertiary metadata text. One step deeper than Graphite for buttons that need a touch more presence |
| Outlined Indigo | `#1e40af` | `--color-outlined-indigo` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Spark Violet | `#7c3aed` | `--color-spark-violet` | Violet text accent for links, tags, and emphasized short phrases |
| Spark Violet Soft | `#8b5cf6` | `--color-spark-violet-soft` | Lighter violet companion to Spark Violet for secondary decorative strokes and gradient endpoints |
| Ember | `#d97706` | `--color-ember` | Orange text accent for links, tags, and emphasized short phrases. |
| Sky | `#0d74ce` | `--color-sky` | Icon stroke variant within the mode selector — the paired companion to Ember for the three-mode icon set |
| Ice | `#e0ecfc` | `--color-ice` | Tinted blue surface wash — a barely-perceptible cool tint used for soft highlight backgrounds and the outer glow ring on the product mockup play button |
| Cyan Glow | `#0090ff` | `--color-cyan-glow` | Bright cyan accent for the glow/shadow halo behind the play button overlay in the product mockup |
| Alert Red | `#ef4444` | `--color-alert-red` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| macOS Red | `#ff5f57` | `--color-macos-red` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| macOS Yellow | `#ffbd2e` | `--color-macos-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| macOS Green | `#28c840` | `--color-macos-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### defaultFont — defaultFont — detected in extracted data but not described by AI · `--font-defaultfont`
- **Weights:** 400, 500, 700
- **Sizes:** 9px, 10px, 11px, 12px, 14px, 15px, 16px, 18px, 20px, 30px, 36px, 52px, 60px
- **Line height:** 1, 1.07, 1.11, 1.2, 1.25, 1.33, 1.38, 1.4, 1.43, 1.5, 1.56, 1.6, 1.63, 1.71, 2, 2.18, 2.4, 2.67
- **Letter spacing:** 0.025, 0.05, 0.2
- **Role:** defaultFont — detected in extracted data but not described by AI

### Cap Sans (custom geometric sans, similar to General Sans or Inter Display) — Single-family system. Weight 700 at 52–60px for hero and section display headings — tight tracking, almost no letter-spacing, confident and unornamented. Weight 500 at 18–20px for subheadings and feature titles. Weight 400 at 14–16px for body and descriptions. Weight 500 at 11–12px for uppercase eyebrow labels with +0.2em tracking creates the only typographic accent in the system. · `--font-cap-sans-custom-geometric-sans-similar-to-general-sans-or-inter-display`
- **Substitute:** General Sans, Inter, or DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 9, 10, 11, 12, 14, 15, 16, 18, 20, 30, 36, 52, 60
- **Line height:** 1.20, 1.25, 1.33, 1.40, 1.43, 1.50, 1.56, 1.60, 1.63, 1.71, 2.00, 2.18, 2.40, 2.67
- **Role:** Single-family system. Weight 700 at 52–60px for hero and section display headings — tight tracking, almost no letter-spacing, confident and unornamented. Weight 500 at 18–20px for subheadings and feature titles. Weight 400 at 14–16px for body and descriptions. Weight 500 at 11–12px for uppercase eyebrow labels with +0.2em tracking creates the only typographic accent in the system.

### ui-monospace, SFMono-Regular, Menlo, Consolas — Used sparingly for micro-labels and version numbers in the product mockup. Not part of the marketing surface. · `--font-ui-monospace-sfmono-regular-menlo-consolas`
- **Weights:** 400, 500
- **Sizes:** 8, 10
- **Line height:** 1.40, 2.40, 3.00
- **Role:** Used sparingly for micro-labels and version numbers in the product mockup. Not part of the marketing surface.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.2px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.63 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 20px | 1.4 | — | `--text-heading-sm` |
| heading | 30px | 1.2 | — | `--text-heading` |
| heading-lg | 36px | 1.25 | — | `--text-heading-lg` |
| display | 52px | 1.07 | — | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 140 | 140px | `--spacing-140` |
| 168 | 168px | `--spacing-168` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| inputs | 6px |
| buttons | 9999px |
| nav-bar | 9999px |
| small-tags | 2px |
| large-cards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.2) 0px 1.5px 0px 0px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px` | `--shadow-subtle-2` |
| md | `rgba(0, 0, 0, 0.05) 0px 4px 10px 0px` | `--shadow-md` |
| subtle-3 | `rgba(191, 219, 254, 0.5) 0px 1px 2px 0px` | `--shadow-subtle-3` |
| xl | `rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.0...` | `--shadow-xl` |
| md-2 | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md-2` |
| subtle-4 | `rgba(221, 214, 254, 0.5) 0px 1px 2px 0px` | `--shadow-subtle-4` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |
| subtle-5 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-5` |
| subtle-6 | `rgba(255, 255, 255, 0.4) 0px 1.5px 0px 0px inset` | `--shadow-subtle-6` |
| xl-2 | `rgba(0, 0, 0, 0.4) 0px 60px 40px 3px` | `--shadow-xl-2` |
| xl-3 | `rgba(0, 0, 0, 0.18) 0px 8px 32px 0px` | `--shadow-xl-3` |
| md-3 | `rgba(0, 0, 0, 0.12) 0px 4px 16px 0px` | `--shadow-md-3` |
| sm-2 | `rgba(18, 22, 31, 0.02) 0px 2px 8px 0px` | `--shadow-sm-2` |
| md-4 | `rgba(0, 0, 0, 0.25) 0px 4px 14px 0px, rgba(0, 0, 0, 0.1) ...` | `--shadow-md-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Floating Nav Bar
**Role:** Top-level navigation, centered and floating

Pill-shaped (9999px radius), white (#fcfcfc) background, 1px #e5e7eb border, 1.5px inset white highlight at the top edge (rgba(255,255,255,0.2)). Contains the logo, nav links, GitHub star count, Login (ghost), and Sign Up (black filled pill). Height ~48px, horizontal padding ~20px. Stays at the top of the viewport with generous margin from the viewport edge.

### Primary CTA Button (Blue)
**Role:** Filled call-to-action for upgrade / purchase

9999px pill radius. Background #2563eb, text #fcfcfc (white), 14–16px, weight 500. Horizontal padding 20px, vertical padding 10px. Subtle 0px 4px 10px rgba(0,0,0,0.05) drop shadow. The 'Upgrade to Cap Pro' button is the canonical example.

### Secondary CTA Button (Black)
**Role:** Filled call-to-action for download / ownership

9999px pill radius. Background #202020 (near-black), text #fcfcfc, weight 500. Same dimensions as the blue CTA. The 'Download for free' button is the canonical example — paired with the blue CTA to form the two-button decision cluster.

### Ghost Button
**Role:** Low-emphasis navigation action (Login)

9999px pill radius, transparent background, 1px #e0e0e0 border, text #202020. Used for secondary actions that should not compete with the primary CTAs.

### Outlined Action Link
**Role:** Tertiary action ('or Switch from Loom')

No background, underlined text link or small ghost button with #1e40af accent border. Sits centered below the CTA pair as a de-prioritized alternative path.

### Segmented Control (Mode Selector)
**Role:** Switching between Instant, Studio, and Screenshot modes

Rounded container with #f0f0f0 background, ~9999px pill radius. Three equally-sized segments. The active segment has a white (#fcfcfc) background with a 1px #e0e0e0 border and a subtle shadow lift. Icons inside are filled/outlined: lightning bolt (Instant), clapperboard (Studio), image (Screenshot). Active icon is larger and bolder; inactive icons are smaller and gray (#838383).

### Eyebrow Badge
**Role:** Uppercase section label above feature titles

11–12px, weight 500, text in #d97706 (Ember) or #202020, letter-spacing 0.2em (20%), uppercase. Optionally preceded by a small 16px filled icon. Examples: 'INSTANT MODE' with a lightning-bolt icon, '3 MODES' in the section header.

### Feature Card
**Role:** Container for feature highlights within a section

White (#fcfcfc) background, 1px #e0e0e0 border, 12px radius, 24px padding. No drop shadow by default; optional 0px 20px 25px -5px rgba(0,0,0,0.05) lift for elevated variants. Content is image-on-top, text-below with 12px gap.

### Download CTA Card
**Role:** Final pre-footer conversion block

White (#fcfcfc) surface, 16px radius, 1px #e0e0e0 border, generous internal padding (~48px vertical). Contains a centered heading, the two-button CTA pair, and a tertiary text link below. Sits inside a subtle #e5e7eb page background to create a contained card feel.

### Product Mockup Container
**Role:** Large hero visual showing the Cap app

Full app window mockup with macOS traffic-light buttons (#ff5f57, #ffbd2, #28c840), title bar, and the recording canvas. A 64px circular blue (#3b82f6) play button with a white triangle sits centered, ringed by a soft #e0ecfc glow and a #0090ff shadow halo. The recording timeline below uses a blue progress fill.

### Trust Logo Strip
**Role:** Social proof line below the hero CTAs

Horizontal row of partner/user logos at 32–40px height, rendered in monochrome gray (#838383 or #c2c2c2). Preceded by a small caption: 'Trusted by 30,000+ teams, builders and creators'. Logos are evenly spaced with 24–32px gaps, left-aligned to the text column.

### Footer Link Column
**Role:** Site-map navigation in the footer

Vertical stack of 14–15px text links in #838383 (Graphite), 8px row gap. Column heading is 15–16px weight 500 in #202020. Six columns typically: Product, Additional Links, Cap, Use Cases, Socials, Tools.

### Chat Widget
**Role:** Persistent floating support button

Fixed-position, bottom-right. 48px circle, #202020 background, white speech-bubble icon. Sits above all other content with a subtle 0px 10px 15px rgba(0,0,0,0.1) shadow.

## Do's and Don'ts

### Do
- Use 9999px border-radius for all buttons, nav bar, segmented controls, and tags — the pill shape is the signature silhouette.
- Pair the two-button CTA cluster as black (#202020) 'Download' on the left and blue (#2563eb) 'Upgrade' on the right; never invert this order.
- Set hero and section display headings at 52–60px, weight 700, with natural (0) letter-spacing and 1.07–1.11 line-height — tight, confident, no breath wasted.
- Use 0.2em letter-spacing at 11–12px weight 500 for all uppercase eyebrow labels above feature titles.
- Default to white (#fcfcfc) surfaces with 1px #e0e0e0 or #e5e7eb borders for separation; reach for shadows only on elevated cards and the floating chat widget.
- Keep the product mockup window and decorative ribbon artwork as the only place where multi-color gradients appear — the UI chrome stays monochrome plus one blue.
- Set page max-width to 1200px with ~20px horizontal padding; hero is always a two-column split (text left, product visual right) at this width.

### Don't
- Do not fill CTAs with any color other than #202020 (ownership) or #2563eb (upgrade) — the two-color button system is the entire decision architecture.
- Do not use the Spark Violet (#7c3aed), Ember (#d97706), or Sky (#0d74ce) accent colors for buttons, links, or interactive states — they are decorative only.
- Do not add shadows to cards inside the main content flow; use a 1px #e0e0e0 border instead. Shadows are reserved for the floating chat widget and the download CTA card.
- Do not set body text below 14px or above 16px — the body type is narrow by design.
- Do not use pure #ffffff for the page background; use #fcfcfc (Paper) so the canvas sits gently below content.
- Do not place multi-color gradients in buttons, badges, nav, or footer; gradients live exclusively inside the product mockup artwork.
- Do not break the 9999px pill convention for primary actions — the only valid card radii are 12px (feature card) and 16px (download CTA card).

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fcfcfc` | The dominant site background; nearly white with the faintest warmth so content sits slightly forward. |
| 1 | Card Surface | `#fcfcfc` | Identical to the canvas — separation comes from 1px borders, not background shifts. |
| 2 | Subtle Wash | `#e5e7eb` | A barely-visible cool-gray tint used behind the download CTA card to create a contained-block effect. |
| 3 | Inset Track | `#f0f0f0` | The segmented control track, subtle button hover, and any place needing a step-down from the main surface. |
| 4 | Blue Tint | `#e0ecfc` | The only chromatic surface — a pale blue wash used for the glow ring behind the play button in the product mockup. |

## Elevation

- **Floating Nav Bar:** `inset rgba(255, 255, 255, 0.2) 0px 1.5px 0px 0px`
- **Primary Buttons (both variants):** `rgba(0, 0, 0, 0.05) 0px 4px 10px 0px`
- **Download CTA Card:** `rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.05) 0px 8px 10px -6px`
- **Chat Widget:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Active Segmented Control Segment:** `rgba(0, 0, 0, 0.05) 0px 4px 10px 0px`

## Imagery

Visuals are concentrated in the hero product mockup — a full app-window screenshot showing the recording interface with a large blue play-button overlay ringed by a soft glow. The mockup uses macOS window-chrome conventions (traffic-light dots, title bar) to signal native-app credibility. Behind the play button, a dark abstract wave/ribbon illustration in gradients (blue→cyan, pink→orange, violet→pink) adds chromatic energy without competing with the UI. Trust logos appear as a monochrome gray strip (~32px height) below the hero. No lifestyle photography, no full-bleed editorial images — the product IS the hero. Iconography throughout is outlined, 1.5–2px stroke weight, monoline geometric style.

## Layout

Max-width 1200px centered layout with ~20px horizontal padding. The hero is always a two-column asymmetric split: text column on the left (55%) and product mockup on the right (45%), vertically centered. Below the hero, sections alternate between centered single-column text blocks (like 'One app, every workflow') and two-column feature explanations (text left, visual right). The segmented mode selector sits centered as a horizontal tab bar. Section gaps are generous (~80px) with seamless white-to-white flow — no alternating background bands. The footer is a six-column link grid with a bordered card wrapping the final download CTAs. The nav bar is a floating pill, centered at the top with margin from the viewport edge. Density is compact in components (8–12px gaps) but spacious at the section level.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary heading): #202020
- text (body): #202020
- text (muted/helper): #838383
- background (page/card): #fcfcfc
- border (hairline): #e0e0e0
- accent (links, highlights): #3b82f6
- primary action: #2563eb (filled action)
- Create a Primary Action Button: #2563eb background, #fcfcfc text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

**3-5 Example Component Prompts**

1. **Hero Section**: White (#fcfcfc) page background, max-width 1200px centered. Left column at 55% width: 52px display headline in weight 700 #202020, line-height 1.07. Below, a 16px body paragraph in #202020, max-width 480px. Two-button CTA cluster with 8px gap: black filled pill (#202020 background, white #fcfcfc text, 9999px radius, 20px 10px padding) reading 'Download for free', and blue filled pill (#2563eb background, white text, same dimensions) reading 'Upgrade to Cap Pro'. Right column at 45%: the product mockup image with the blue play button overlay.

2. **Mode Selector (Segmented Control)**: Container with 9999px radius, #f0f0f0 background, 2px padding, inline-flex with three equal segments. Active segment: white (#fcfcfc) background, 1px #e0e0e0 border, 0 4px 10px rgba(0,0,0,0.05) shadow. Each segment contains a 20px icon above a 12px label in #202020. Inactive labels are #838383. Above the selector, centered eyebrow text at 12px weight 500, letter-spacing 0.2em, uppercase #d97706: 'INSTANT MODE'.

3. **Feature Section Card**: White (#fcfcfc) surface, 12px border-radius, 1px #e0e0e0 border, 24px padding. Contains a 30px heading in weight 700 #202020, followed by a 16px body paragraph in #202020. 16px gap between heading and body. No drop shadow.


5. **Footer Link Column**: Six columns, each with a 15px weight 500 #202020 heading and a vertical stack of 14px #838383 links with 8px row gap. Column headings: Product, Additional Links, Cap, Use Cases, Socials, Tools.

## Similar Brands

- **Loom** — Same screen-recording product category, same hero two-column text-plus-mockup layout, same pill-shaped floating nav bar, same white-canvas aesthetic with a single blue accent.
- **Linear** — Same restrained two-color button system (dark + accent blue), same hairline-border card surfaces, same near-white canvas with minimal shadows, same geometric sans typography at tight line-heights.
- **Vercel** — Same black-filled primary CTA paired with a ghost/outlined secondary, same generous section spacing on a white canvas, same trust-logo strip beneath the hero, same compact density inside components.
- **Raycast** — Same native-app-meets-web aesthetic with macOS window-chrome mockups, same pill-shaped nav and buttons, same uppercase eyebrow labels with wide letter-spacing above feature titles.
- **Arc Browser** — Same playful confidence in hero product mockups with bold overlay elements, same light theme with a single saturated accent color, same custom geometric sans typeface.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #3b82f6;
  --color-action-blue: #2563eb;
  --color-ink-black: #202020;
  --color-carbon: #000000;
  --color-paper: #fcfcfc;
  --color-mist: #f0f0f0;
  --color-fog: #e0e0e0;
  --color-ash: #e5e7eb;
  --color-steel: #c2c2c2;
  --color-graphite: #838383;
  --color-slate: #646464;
  --color-outlined-indigo: #1e40af;
  --color-spark-violet: #7c3aed;
  --color-spark-violet-soft: #8b5cf6;
  --color-ember: #d97706;
  --color-sky: #0d74ce;
  --color-ice: #e0ecfc;
  --color-cyan-glow: #0090ff;
  --color-alert-red: #ef4444;
  --color-macos-red: #ff5f57;
  --color-macos-yellow: #ffbd2e;
  --color-macos-green: #28c840;

  /* Typography — Font Families */
  --font-defaultfont: 'defaultFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cap-sans-custom-geometric-sans-similar-to-general-sans-or-inter-display: 'Cap Sans (custom geometric sans, similar to General Sans or Inter Display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-sfmono-regular-menlo-consolas: 'ui-monospace, SFMono-Regular, Menlo, Consolas', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.25;
  --text-display: 52px;
  --leading-display: 1.07;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-140: 140px;
  --spacing-168: 168px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-inputs: 6px;
  --radius-buttons: 9999px;
  --radius-nav-bar: 9999px;
  --radius-small-tags: 2px;
  --radius-large-cards: 16px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 1.5px 0px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 4px 10px 0px;
  --shadow-subtle-3: rgba(191, 219, 254, 0.5) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.05) 0px 8px 10px -6px;
  --shadow-md-2: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-4: rgba(221, 214, 254, 0.5) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle-5: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-6: rgba(255, 255, 255, 0.4) 0px 1.5px 0px 0px inset;
  --shadow-xl-2: rgba(0, 0, 0, 0.4) 0px 60px 40px 3px;
  --shadow-xl-3: rgba(0, 0, 0, 0.18) 0px 8px 32px 0px;
  --shadow-md-3: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
  --shadow-sm-2: rgba(18, 22, 31, 0.02) 0px 2px 8px 0px;
  --shadow-md-4: rgba(0, 0, 0, 0.25) 0px 4px 14px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-page-canvas: #fcfcfc;
  --surface-card-surface: #fcfcfc;
  --surface-subtle-wash: #e5e7eb;
  --surface-inset-track: #f0f0f0;
  --surface-blue-tint: #e0ecfc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #3b82f6;
  --color-action-blue: #2563eb;
  --color-ink-black: #202020;
  --color-carbon: #000000;
  --color-paper: #fcfcfc;
  --color-mist: #f0f0f0;
  --color-fog: #e0e0e0;
  --color-ash: #e5e7eb;
  --color-steel: #c2c2c2;
  --color-graphite: #838383;
  --color-slate: #646464;
  --color-outlined-indigo: #1e40af;
  --color-spark-violet: #7c3aed;
  --color-spark-violet-soft: #8b5cf6;
  --color-ember: #d97706;
  --color-sky: #0d74ce;
  --color-ice: #e0ecfc;
  --color-cyan-glow: #0090ff;
  --color-alert-red: #ef4444;
  --color-macos-red: #ff5f57;
  --color-macos-yellow: #ffbd2e;
  --color-macos-green: #28c840;

  /* Typography */
  --font-defaultfont: 'defaultFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cap-sans-custom-geometric-sans-similar-to-general-sans-or-inter-display: 'Cap Sans (custom geometric sans, similar to General Sans or Inter Display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-sfmono-regular-menlo-consolas: 'ui-monospace, SFMono-Regular, Menlo, Consolas', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.25;
  --text-display: 52px;
  --leading-display: 1.07;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-140: 140px;
  --spacing-168: 168px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 1.5px 0px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 4px 10px 0px;
  --shadow-subtle-3: rgba(191, 219, 254, 0.5) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.05) 0px 8px 10px -6px;
  --shadow-md-2: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-4: rgba(221, 214, 254, 0.5) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle-5: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-6: rgba(255, 255, 255, 0.4) 0px 1.5px 0px 0px inset;
  --shadow-xl-2: rgba(0, 0, 0, 0.4) 0px 60px 40px 3px;
  --shadow-xl-3: rgba(0, 0, 0, 0.18) 0px 8px 32px 0px;
  --shadow-md-3: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
  --shadow-sm-2: rgba(18, 22, 31, 0.02) 0px 2px 8px 0px;
  --shadow-md-4: rgba(0, 0, 0, 0.25) 0px 4px 14px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
}
```
