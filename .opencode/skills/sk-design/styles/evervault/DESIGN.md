# Evervault — Style Reference
> Encrypted vault behind ultraviolet light — a dark crypt where one violet beam reveals everything.

**Theme:** dark

Evervault is a nocturnal crypto-vault interface: an almost-black canvas pierced by ultraviolet light, where every surface feels like brushed obsidian. The palette is 95% achromatic, leaning on cool gray-violet tints (#dfe1f4, #ececfb) rather than pure white, with a single vivid violet (#b88cff) acting as the encryption key — it appears on links, icons, gradient washes, and a glowing portal in the hero. Typography is the brand's quiet flex: Roobert for headlines with aggressive negative tracking that pulls characters into each other, Inter for body/UI at a comfortable density, and Roboto Mono for code that signals developer-first credibility. Components are floating and layered — a pill-shaped nav bar, 12–16px-radius cards with inset shadow stacks, pill CTAs — and the layout alternates between deep canvas and luminous gradient bands to create a sense of moving through encrypted chambers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Canvas | `#010314` | `--color-void-canvas` | Primary page background, hero canvas — near-black with a blue-violet undertone, not a true neutral |
| Obsidian Surface | `#171825` | `--color-obsidian-surface` | Elevated panels, nav bar, secondary cards — one step up from canvas, reads as a subtle surface tier |
| Slate Layer | `#2a2b3a` | `--color-slate-layer` | Card backgrounds, input fields, inset panels — the main surface level for content containers |
| Carbon Border | `#343543` | `--color-carbon-border` | Hairline borders, dividers, card edges — barely visible structural lines on dark surfaces |
| Ash Text | `#5e6077` | `--color-ash-text` | Muted helper text, disabled labels, tertiary metadata |
| Fog Text | `#9fa2b9` | `--color-fog-text` | Secondary body text, inactive icons, subdued UI labels |
| Mist Text | `#babcd2` | `--color-mist-text` | Link resting state, sub-labels, low-emphasis body |
| Lunar White | `#dfe1f4` | `--color-lunar-white` | Primary body and heading text — a cool off-white, the dominant readable surface in the system |
| Frost White | `#ececfb` | `--color-frost-white` | High-contrast text, hover states, icon highlights — the brightest text in the hierarchy |
| Pure White | `#ffffff` | `--color-pure-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Ultraviolet Key | `#b88cff` | `--color-ultraviolet-key` | Brand accent — links, highlight icons, gradient termini, the signature violet that signals encryption |
| Deep Iris | `#6633ee` | `--color-deep-iris` | Brand gradient anchor — hero gradient origin, logo violet, saturated primary brand tone |
| Amethyst Glow | `#8e64ff` | `--color-amethyst-glow` | Mid-gradient violet, hover states on brand elements, secondary accent fills |
| Shadow Iris | `#2e2a4c` | `--color-shadow-iris` | Tinted shadows and border accents — gives depth a violet cast rather than pure black |
| Plum Depth | `#1f1d3a` | `--color-plum-depth` | Deep accent backgrounds, violet-tinted shadow layers, card hover glows |
| Code Rose | `#f92672` | `--color-code-rose` | Code syntax highlighting (Monokai-style keywords), inline emphasis in code blocks |

## Tokens — Typography

### Roobert — Headlines and display text — the brand's signature face. Aggressive negative tracking at large sizes makes characters pull into each other, creating a custom-display feel no system font replicates. Use for h1–h3, hero copy, and section titles. · `--font-roobert`
- **Substitute:** Inter Tight or Manrope
- **Weights:** 400, 500, 600
- **Sizes:** 12, 13, 14, 16, 18, 24, 32, 48, 52, 56
- **Line height:** 1.00, 1.13, 1.25, 1.30
- **Letter spacing:** -0.010em to -0.025em (tightens as size grows; -0.025em at 56px display, -0.010em at 14px body)
- **OpenType features:** `"kern", "liga", "salt"`
- **Role:** Headlines and display text — the brand's signature face. Aggressive negative tracking at large sizes makes characters pull into each other, creating a custom-display feel no system font replicates. Use for h1–h3, hero copy, and section titles.

### Inter — Body text, navigation, buttons, UI labels, footer copy. The workhorse face for everything below the headline tier. Weight 580 is an uncommon mid-weight that fills the gap between 500 and 600 for UI emphasis. · `--font-inter`
- **Substitute:** Inter (native)
- **Weights:** 400, 500, 580
- **Sizes:** 9, 11, 12, 13, 14, 15, 16
- **Line height:** 1.00, 1.55, 1.75, 1.76, 1.94, 2.00
- **OpenType features:** `"kern", "liga", "salt"`
- **Role:** Body text, navigation, buttons, UI labels, footer copy. The workhorse face for everything below the headline tier. Weight 580 is an uncommon mid-weight that fills the gap between 500 and 600 for UI emphasis.

### Roboto Mono — Code snippets, terminal output, technical labels. The 0.400em tracking at small sizes is a deliberate eyebrow/label pattern for uppercase micro-copy like 'Built for Developers'. · `--font-roboto-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400, 500, 600
- **Sizes:** 10, 12, 15, 18, 20
- **Line height:** 1.00, 1.21, 1.40, 1.50
- **Letter spacing:** -0.050em at small sizes, 0.400em for all-caps micro-labels (tracking-out for eyebrow text)
- **OpenType features:** `"kern", "liga", "salt"`
- **Role:** Code snippets, terminal output, technical labels. The 0.400em tracking at small sizes is a deliberate eyebrow/label pattern for uppercase micro-copy like 'Built for Developers'.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.55 | — | `--text-caption` |
| body | 14px | 1.76 | — | `--text-body` |
| body-lg | 16px | 1.94 | — | `--text-body-lg` |
| subheading | 18px | 1.5 | -0.18px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.36px | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.64px | `--text-heading` |
| heading-lg | 48px | 1.13 | -1.2px | `--text-heading-lg` |
| display | 56px | 1.13 | -1.4px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 19.2px |
| hero | 38.4px |
| cards | 16px |
| badges | 8px |
| inputs | 12px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(0, 0...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.12) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |
| md | `rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25...` | `--shadow-md` |
| subtle-4 | `rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset, rgba(255,...` | `--shadow-subtle-4` |
| md-2 | `rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25...` | `--shadow-md-2` |
| md-3 | `rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25...` | `--shadow-md-3` |
| subtle-5 | `rgba(255, 255, 255, 0.12) 0px 0px 0px 1px inset, rgba(0, ...` | `--shadow-subtle-5` |
| subtle-6 | `rgb(223, 225, 244) 0px 0px 0px 1px inset` | `--shadow-subtle-6` |
| subtle-7 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 2px, rgba(255, 255, 255, ...` | `--shadow-subtle-7` |
| subtle-8 | `rgba(255, 255, 255, 0.15) 0px 0px 0px 0.5px inset, rgba(0...` | `--shadow-subtle-8` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Floating Pill Navigation
**Role:** Primary site navigation

Pill-shaped nav bar (19.2px radius) floating over the hero with #171825 background, 1px white-alpha inset highlight on top edge. Contains logo left, centered link cluster, CTA right. Padding approximately 8px 12px internally with 13px gap between links.

### Primary CTA Button (Pill)
**Role:** Main call-to-action

White background (#ffffff), dark text (#010314), Inter 13–14px weight 500, pill radius (9999px), padding 8px 16px. Subtle inset shadow at top. The inversion against the dark canvas makes it the brightest element on screen.

### Ghost Text Link
**Role:** Secondary navigation or inline link

No background, #ececfb or #dfe1f4 text, Inter weight 500, with a right-arrow chevron (→) suffix. Used for 'Get Started' and 'View our docs' alongside the primary pill CTA.

### Hero Credit Card Visualization
**Role:** Hero centerpiece

Rounded card (24px radius) with white-to-violet gradient, chip, card number, and contactless icon. Positioned left of a vertical violet glow beam (#6633ee → #ffffff radial) and a cascade of encrypted characters (#847fa1) suggesting tokenization.

### Product Feature Card
**Role:** Feature explanation container

Dark card (#2a2b3a background), 12px radius, 24px padding. Contains a violet-tinted icon or 3D cube illustration, bold heading, and 2–3 line description. Multi-layer shadow with inset violet glow (rgba(190,167,255,0.24) 1px inset) gives an encrypted-chamber depth.

### Code Snippet Card
**Role:** Developer-facing code example

Dark card with frosted-glass treatment, tabbed header (Checkout.jsx | theme.js), syntax-highlighted code using Monokai-like palette (#f92672 keywords, #b88cff strings, #ececfb variables). Roboto Mono 12–13px, 1px border #343543, 12px radius.

### Trust Logo Cloud
**Role:** Social proof band

Two-row grid of partner/client logos on transparent background, rendered in #dfe1f4 or white monochrome. Centered caption below in muted gray: 'Global leaders trust Evervault to secure their most sensitive payment data'.

### Product Icon Grid
**Role:** Product line overview

8-column horizontal grid of square icon tiles (each ~48×48px) on rounded dark containers. Icons are violet-tinted line-art. Labels below in Inter 11px caption. Used to enumerate the product suite (PCI, Payments, Card, Network, etc.).

### Gradient Hero Band
**Role:** Section background

Full-bleed gradient zone transitioning from #6633ee radial at top-center fading to white at bottom edge (radial-gradient 130% 120% at 50% 0px). Creates a luminous arch over content sections — the visual signature of page transitions.

### Eyebrow Label Pill
**Role:** Section category indicator

Small rounded badge (8px radius), #2a2b3a background, 1px inset border. Text in Roboto Mono 11–12px with 0.400em letter-spacing, uppercase, #ececfb color. Used for 'Built for Developers' and similar categorical labels.

### Logo Wordmark
**Role:** Brand identity in nav/footer

Custom Evervault logo: three horizontal bars forming an 'E' shape (varying lengths) + 'evervault' wordmark in Roobert or Inter weight 500, all in #dfe1f4 on dark canvas.

### Announcement Bar
**Role:** Top-of-page notification

Full-width thin bar (2–3px vertical padding), centered text in Inter 12–13px, #dfe1f4. No background tint — sits directly on the canvas. Icon prefix + 'Learn more →' link suffix.

## Do's and Don'ts

### Do
- Use #010314 as the universal canvas — never introduce a lighter background for page-level surfaces
- Reserve #b88cff for links, icons, and gradient termini — it is the encryption key, not a fill color
- Set headline tracking to -0.025em at 48px+ display sizes; tighten as type scales up
- Apply 19.2px radius to the floating nav and 16px to content cards; use 9999px for all CTA buttons and tags
- Layer shadows with the violet-tinted shadow stack (rgba(190,167,255,0.24) inset + rgba(0,0,0,0.25) drop) for cards, not generic gray shadows
- Use Roboto Mono 0.400em-tracked uppercase for all eyebrow/category labels under 14px
- Alternate between Void Canvas sections and Gradient Hero Bands to create the encrypted-chamber rhythm

### Don't
- Do not introduce a light theme — the dark canvas is the brand's identity
- Do not use #6633ee as a flat fill for large surfaces — it belongs inside gradients and the logo only
- Do not use pure #ffffff for body text — use #dfe1f4 or #ececfb to avoid harsh contrast on the near-black canvas
- Do not apply the same radius everywhere — 8px for badges/buttons, 12px for cards, 19.2px for nav, 24px+ for hero shapes
- Do not use generic gray shadows — the violet-tinted shadow stack is what makes the depth feel encrypted
- Do not use Roobert for body copy below 18px — switch to Inter for readability at UI sizes
- Do not center-align long-form body paragraphs — center only headlines and short CTA clusters

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#010314` | Primary page background, hero base — the deepest surface in the stack |
| 1 | Obsidian Panel | `#171825` | Floating nav bar, secondary panels, inset containers |
| 2 | Slate Card | `#2a2b3a` | Content cards, feature tiles, input fields, the standard card surface |
| 3 | Frost Surface | `#ffffff` | Primary action buttons, inverted card sections, maximum-emphasis elements |

## Elevation

- **Content Card:** `rgba(0,0,0,0.25) 0px 8px 16px -4px, rgba(0,0,0,0.25) 0px 4px 8px -2px, rgba(0,0,0,0.2) 0px 1px 2px 0px, rgba(190,167,255,0.24) 0px 0px 0px 1.5px inset`
- **Elevated Card (hero / feature):** `rgba(255,255,255,0.2) 0px 1px 0px 0px inset, rgba(0,0,0,0.12) 0px -1px 24px 0px inset, rgba(0,0,0,0.08) 0px 0px 16px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 1px, rgba(0,0,0,0.2) 0px 1px 2px 0px, rgba(0,0,0,0.2) 0px 2px 4px 0px`
- **Badge / Pill:** `rgba(0,0,0,0.12) 0px 0px 0px 1px inset`

## Imagery

Visual language is dominated by 3D abstract renders and gradient washes rather than photography. The hero centerpiece is a credit card illustration paired with a cascade of encrypted character glyphs, suggesting tokenization. Product feature cards use isometric 3D cube/hexagon shapes in violet-to-blue gradients. The gradient hero bands are full-bleed radial washes of ultraviolet that arch over content like light through a cathedral window. Icons are thin-stroke line-art in violet (#b88cff) or white, never filled. The overall feel is diagrammatic and cryptographic — the visual is the data, not a metaphor for it.

## Layout

Max-width 1200px centered container, but hero sections break to full-bleed. Hero is a centered headline stack over a full-bleed dark canvas with the credit-card visualization floating left. Below the hero, a trust logo cloud spans full-width. Sections alternate between dark canvas and luminous gradient bands (radial violet → white arches) that act as visual room-changers. Content sections use a 2-column split (text-left, visual-right) pattern. Product features arrange as 4-column icon grids. Code examples sit in single-column card blocks. Navigation is a floating pill bar anchored to the top, never a full-width strip.

## Agent Prompt Guide

## Quick Color Reference

- **Canvas**: #010314
- **Primary text**: #dfe1f4
- **High-emphasis text**: #ececfb
- **Muted text**: #9fa2b9 / #5e6077
- **Card surface**: #2a2b3a
- **Border**: #343543
- **Brand accent**: #b88cff
- **primary action: no distinct CTA color

## Example Component Prompts

**1. Hero Section (centered headline)**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

**2. Product Feature Card**
Background #2a2b3a, 12px radius, 24px padding. Shadow: rgba(0,0,0,0.25) 0px 8px 16px -4px with rgba(190,167,255,0.24) 0px 0px 0px 1.5px inset. Violet line icon (24px, #b88cff) at top. Heading at 18px Roobert weight 500, #ececfb. Body at 14px Inter weight 400, #9fa2b9, line-height 1.76.

**3. Floating Pill Navigation**
Background #171825, 19.2px radius, 8px 12px padding, 1px rgba(255,255,255,0.1) inset top border. Links in Inter 13px weight 500, #dfe1f4, 13px gap. White pill button on right (#ffffff, #010314 text, 9999px radius, 6px 12px padding).

**4. Code Snippet Block**
Background #2a2b3a, 12px radius, 16px padding. Tabs in Roboto Mono 12px weight 500, #9fa2b9 (inactive) / #ececfb (active). Code in Roboto Mono 12px, line-height 1.50. Keywords in #f92672, strings in #b88cff, variables in #ececfb. 1px #343543 border.

**5. Eyebrow Label Pill**
Background #2a2b3a, 8px radius, 6px 10px padding. Text in Roboto Mono 11px weight 500, uppercase, letter-spacing 4.4px (0.400em), color #ececfb. Inset border: rgba(0,0,0,0.12) 0px 0px 0px 1px.

## Similar Brands

- **Vercel** — Same near-black canvas with a single bright white pill CTA, and tight letter-spaced display headlines over gradient hero washes
- **Linear** — Identical floating pill nav pattern and dark-mode UI with violet-tinted accent glow, plus inset shadow stacks on cards
- **Stripe** — Similar developer-first product presentation with gradient hero bands, code snippet cards, and a trust logo cloud mid-page
- **Railway** — Same encrypted-vault aesthetic: deep canvas, violet accent, terminal/code-forward typography, and pill-shaped navigation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-canvas: #010314;
  --color-obsidian-surface: #171825;
  --color-slate-layer: #2a2b3a;
  --color-carbon-border: #343543;
  --color-ash-text: #5e6077;
  --color-fog-text: #9fa2b9;
  --color-mist-text: #babcd2;
  --color-lunar-white: #dfe1f4;
  --color-frost-white: #ececfb;
  --color-pure-white: #ffffff;
  --color-ultraviolet-key: #b88cff;
  --color-deep-iris: #6633ee;
  --color-amethyst-glow: #8e64ff;
  --color-shadow-iris: #2e2a4c;
  --color-plum-depth: #1f1d3a;
  --color-code-rose: #f92672;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.55;
  --text-body: 14px;
  --leading-body: 1.76;
  --text-body-lg: 16px;
  --leading-body-lg: 1.94;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.36px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.2px;
  --text-display: 56px;
  --leading-display: 1.13;
  --tracking-display: -1.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w580: 580;
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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 19.2px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 38.4px;

  /* Named Radii */
  --radius-nav: 19.2px;
  --radius-hero: 38.4px;
  --radius-cards: 16px;
  --radius-badges: 8px;
  --radius-inputs: 12px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.12) 0px -1px 24px 0px inset, rgba(0, 0, 0, 0.08) 0px 0px 16px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.12) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px inset;
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25) 0px 4px 8px -2px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(190, 167, 255, 0.24) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.1) 0px 0px 0px 0.5px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25) 0px 4px 8px -2px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(190, 167, 255, 0.24) 0px 0px 0px 1.5px inset;
  --shadow-md-3: rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25) 0px 4px 8px -2px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(190, 167, 255, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(255, 255, 255, 0.12) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
  --shadow-subtle-6: rgb(223, 225, 244) 0px 0px 0px 1px inset;
  --shadow-subtle-7: rgba(0, 0, 0, 0.05) 0px 0px 0px 2px, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.5) 0px 0.5px 0px 0px inset;
  --shadow-subtle-8: rgba(255, 255, 255, 0.15) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.04) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-void-canvas: #010314;
  --surface-obsidian-panel: #171825;
  --surface-slate-card: #2a2b3a;
  --surface-frost-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-canvas: #010314;
  --color-obsidian-surface: #171825;
  --color-slate-layer: #2a2b3a;
  --color-carbon-border: #343543;
  --color-ash-text: #5e6077;
  --color-fog-text: #9fa2b9;
  --color-mist-text: #babcd2;
  --color-lunar-white: #dfe1f4;
  --color-frost-white: #ececfb;
  --color-pure-white: #ffffff;
  --color-ultraviolet-key: #b88cff;
  --color-deep-iris: #6633ee;
  --color-amethyst-glow: #8e64ff;
  --color-shadow-iris: #2e2a4c;
  --color-plum-depth: #1f1d3a;
  --color-code-rose: #f92672;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.55;
  --text-body: 14px;
  --leading-body: 1.76;
  --text-body-lg: 16px;
  --leading-body-lg: 1.94;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.36px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.2px;
  --text-display: 56px;
  --leading-display: 1.13;
  --tracking-display: -1.4px;

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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 19.2px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 38.4px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.12) 0px -1px 24px 0px inset, rgba(0, 0, 0, 0.08) 0px 0px 16px 0px inset, rgba(0, 0, 0, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.12) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px inset;
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25) 0px 4px 8px -2px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(190, 167, 255, 0.24) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.1) 0px 0px 0px 0.5px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25) 0px 4px 8px -2px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(190, 167, 255, 0.24) 0px 0px 0px 1.5px inset;
  --shadow-md-3: rgba(0, 0, 0, 0.25) 0px 8px 16px -4px, rgba(0, 0, 0, 0.25) 0px 4px 8px -2px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(190, 167, 255, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(255, 255, 255, 0.12) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
  --shadow-subtle-6: rgb(223, 225, 244) 0px 0px 0px 1px inset;
  --shadow-subtle-7: rgba(0, 0, 0, 0.05) 0px 0px 0px 2px, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.5) 0px 0.5px 0px 0px inset;
  --shadow-subtle-8: rgba(255, 255, 255, 0.15) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.04) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
}
```
