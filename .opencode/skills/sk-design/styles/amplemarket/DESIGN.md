# Amplemarket — Style Reference
> Sunlit workspace with scattered confetti

**Theme:** light

Amplemarket uses a warm, editorial-meets-product language: off-white canvas with a soft cream wash, generous breathing room, and dark near-black type that reads like printed ink. The visual signature is a multi-hue pastel palette — petal pink, mint green, canary yellow, violet, cyan — used as flat card and section backgrounds rather than decoration, creating a 'color-coded' taxonomy of product areas. A vivid phoenix-orange accent grounds the brand identity against a charcoal secondary surface (#272625). Type is set in a geometric grotesque (Labil Grotesk) with aggressive negative tracking on display sizes, where weight 900 84px uppercase headlines act as poster titles and weight 400 44–56px headlines feel calm and confident. The overall mood is light, airy, and approachable — a productivity tool that doesn't feel like enterprise software.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Phoenix Orange | `radial-gradient(386.06% 162.79% at 3.76985% -12.1005%, rgb(232, 64, 13) 0%, rgb(255, 238, 216) 31.14%, rgb(208, 178, 255) 81.98%)` | `--color-phoenix-orange` | Brand accent, hero gradient origin, marketing highlights — vivid warm orange that gives the brand its identity; Hero background gradient — radial wash from phoenix orange through cream to violet |
| Midnight Indigo | `#10054d` | `--color-midnight-indigo` | Deep brand surface, feature card backgrounds, text on light cards — the dark counterweight to the bright accents |
| Charcoal | `#272625` | `--color-charcoal` | Secondary dark surface, testimonial card backgrounds, dark UI panels — warm-tinted near-black |
| Ink | `#111111` | `--color-ink` | Primary text, heading color, filled action button background — near-black with slight warmth |
| Canvas White | `#ffffff` | `--color-canvas-white` | Primary page background, card surface, text on dark surfaces |
| Cream Wash | `#f6f5f3` | `--color-cream-wash` | Soft surface tint, secondary card backgrounds, muted section backgrounds |
| Ash | `#6d6c6b` | `--color-ash` | Muted body text, secondary labels, helper copy |
| Stone | `#b1b1af` | `--color-stone` | Hairline borders, subtle dividers, muted placeholder |
| Pearl | `#ecebea` | `--color-pearl` | Subtle button backgrounds, hover states on ghost controls |
| Petal Pink | `#ffd7f0` | `--color-petal-pink` | Pastel accent card surface — category-coded color tile |
| Mint Green | `#b7efb2` | `--color-mint-green` | Pastel accent card surface — category-coded color tile |
| Canary Yellow | `#ffef99` | `--color-canary-yellow` | Pastel accent card surface — category-coded color tile |
| Soft Violet | `#e2ddfd` | `--color-soft-violet` | Pastel accent card surface — category-coded color tile |
| Aqua | `#99fff9` | `--color-aqua` | Gradient endpoint, hero highlight wash |
| Indigo Deep | `#2e2460` | `--color-indigo-deep` | Dark input field background, form surface on dark sections |

## Tokens — Typography

### Labil Grotesk Variable — Primary typeface — geometric grotesque with variable weight axis. Weight 400 for all body, nav, and most headings (unusual restraint at large sizes); weight 900 reserved for poster-size 84px display headlines set uppercase. Negative letter-spacing scales aggressively with size: -0.05em at 56px, -0.04em at 44px, -0.03em at 36px. Body and small UI text tracks at normal or near-zero. · `--font-labil-grotesk-variable`
- **Substitute:** Inter, DM Sans, or General Sans Variable
- **Weights:** 400, 500, 700, 900
- **Sizes:** 8, 10, 12, 14, 16, 18, 20, 24, 28, 36, 44, 56, 84
- **Line height:** 0.8, 1.0, 1.1, 1.2, 1.3, 1.4
- **Letter spacing:** -0.05em at 56px; -0.04em at 44px; -0.03em at 36px; -0.02em at 24-28px; -0.017em at 28px; -0.011em at 20px; +0.03em at 10px uppercase; +0.025em at 8px
- **OpenType features:** `"ss02" on, "ss01" on`
- **Role:** Primary typeface — geometric grotesque with variable weight axis. Weight 400 for all body, nav, and most headings (unusual restraint at large sizes); weight 900 reserved for poster-size 84px display headlines set uppercase. Negative letter-spacing scales aggressively with size: -0.05em at 56px, -0.04em at 44px, -0.03em at 36px. Body and small UI text tracks at normal or near-zero.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 10px | 1 | 0.3px | `--text-eyebrow` |
| caption | 12px | 1 | — | `--text-caption` |
| body-sm | 14px | 1.3 | — | `--text-body-sm` |
| body | 16px | 1 | — | `--text-body` |
| body-lg | 20px | 1.3 | -0.4px | `--text-body-lg` |
| subheading | 28px | 1.1 | -0.476px | `--text-subheading` |
| heading-sm | 36px | 1.1 | -1.08px | `--text-heading-sm` |
| heading | 44px | 1.1 | -1.76px | `--text-heading` |
| heading-lg | 56px | 1 | -2.8px | `--text-heading-lg` |
| display | 84px | 0.8 | -2.52px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 84 | 84px | `--spacing-84` |
| 100 | 100px | `--spacing-100` |
| 112 | 112px | `--spacing-112` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| small | 4px |
| badges | 9999px |
| inputs | 12px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(17, 17, 17, 0.05) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| xl | `rgba(17, 17, 17, 0.12) 0px 26px 60px -6px, rgba(17, 17, 1...` | `--shadow-xl` |
| sm | `rgba(17, 17, 17, 0.02) 0px -6px 6px 0px, rgba(17, 17, 17,...` | `--shadow-sm` |
| subtle-2 | `rgba(17, 17, 17, 0.05) 0px 0px 1px 0px, rgba(17, 17, 17, ...` | `--shadow-subtle-2` |
| xl-2 | `rgba(25, 34, 35, 0.12) 0px 26px 60px -6px, rgba(25, 34, 3...` | `--shadow-xl-2` |
| subtle-3 | `rgba(17, 17, 17, 0.04) 0px 1px 2px 0px, rgba(17, 17, 17, ...` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20px
- **Element gap:** 8-12px

## Components

### Primary Filled Button
**Role:** Main call-to-action, highest-emphasis interactive element

Background #111111 (Ink), text #ffffff, no border, border-radius 8px, padding 12px 16px. Label in 16px Labil Grotesk weight 400. Used for 'Get free trial' and 'Get started' actions. Pair with white-outlined secondary beside it.

### Ghost Navigation Button
**Role:** Secondary CTA in navigation and footer

Transparent background, text rgba(255,255,255,0.6) on dark surfaces, no border, border-radius 8px, padding 12px 16px. Inverts to Ink text on light surfaces. Used for 'Open app' in nav.

### Neutral Filled Button
**Role:** Tertiary action on light surfaces

Background #ecebea (Pearl), text #111111 (Ink), no border, border-radius 8px, padding 12px 16px. Subtler alternative to the primary filled button when a secondary action needs more presence than ghost.

### White Pill Badge
**Role:** Logo lockup with brand mark

Background #ffffff, text #111111, border #ffffff, border-radius 12px, padding 6px 6px 6px 14px. Small icon-prefixed badge used for the Amplemarket logo lockup and similar brand marks.

### Email Capture Input
**Role:** Hero email signup field

Background #ffffff, text #111111, 1px border rgba(17,17,17,0.08), border-radius 12px, padding 0 16px. Field height ~48px. Joined inline with primary filled button — input fills flex space, button sits at right.

### Pastel Category Card
**Role:** Feature/category showcase tile

Flat color fill from the pastel palette (Petal Pink, Mint Green, Canary Yellow, Soft Violet), border-radius 12px, padding 16px 20px. No shadow, no border. Color IS the differentiation — these are color-coded taxonomy tiles for product capabilities.

### Dark Testimonial Card
**Role:** Customer quote on dark sections

Background #272625 (Charcoal), border-radius 12px, padding 8px. Subtle inset — no drop shadow. White text, small avatar with name in 14px and title in #6d6c6b Ash.

### Light Feature Card
**Role:** Feature content card on light sections

Background #ffffff, border-radius 12px, padding 16px 20px. Minimal elevation using rgba(17,17,17,0.02) ambient shadow or none at all. Borders are hairline 1px rgba(17,17,17,0.08) when present.

### Logo Grid Card
**Role:** Customer logo with migration caption

Transparent or #ffffff background, border-radius 12px, padding ~20px. Centered logo above small caption 'Migrated off [competitor]' in Ash #6d6c6b. Part of 4-column grid.

### Sticky Navigation Bar
**Role:** Top-level page navigation

Transparent to #ffffff on scroll, height ~62px, horizontal layout with logo left, center links (Product, Why us, Resources, Customers, Pricing), and dual-action cluster right (ghost + filled). Backdrop blur 16-32px on scroll for frosted-glass effect over content.

### Hero Video Container
**Role:** Large embedded media frame below hero text

Black background (#000000), border-radius ~12px, full-width within max-width container, aspect ratio ~16:9. Contains video player with centered play button.

### Dark Section Panel
**Role:** Full-bleed dark content sections (testimonials, footer)

Background #272625 or #10054d (Midnight Indigo), full viewport width, internal padding 80-120px vertical. White text (#ffffff), Ash #6d6c6b for secondary copy. Creates a dramatic light-to-dark rhythm against the predominantly white page.

## Do's and Don'ts

### Do
- Use Labil Grotesk Variable at weight 400 for headings up to 56px — restraint at large sizes is the signature
- Apply weight 900 uppercase at 84px only for poster/display moments, not regular section titles
- Use the pastel palette (Petal Pink, Mint Green, Canary Yellow, Soft Violet) as flat card fills for category differentiation — never as decoration or gradients
- Set border-radius to 8px on buttons and 12px on cards — these two values define the entire shape language
- Use #111111 (Ink) for primary action buttons and #272625 (Charcoal) for dark surface backgrounds
- Apply negative letter-spacing proportional to size: -0.05em at 56px, scaling down to 0 at body text
- Alternate light sections (#ffffff / #f6f5f3) with dark panels (#272625 / #10054d) for visual rhythm

### Don't
- Don't use weight 500 or 700 for large headings — weight 400 at 44-56px is the signature, not 600-700
- Don't apply shadows to pastel category cards — the flat color IS the elevation
- Don't use the pastel colors as gradients — they are flat solid fills for taxonomy coding
- Don't set border-radius above 12px on cards or below 8px on buttons — the system uses exactly these two values
- Don't use #000000 pure black for text — #111111 (Ink) is the primary text color with subtle warmth
- Don't add drop shadows to cards on white backgrounds — use 1px borders or hairline insets instead
- Don't use color for decoration on dark sections — reserve Phoenix Orange for hero gradient origins and brand moments

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background |
| 1 | Cream Wash | `#f6f5f3` | Soft secondary surface, alternating section bands |
| 2 | Pastel Tiles | `#ffd7f0` | Color-coded category cards (taxonomy system) |
| 3 | Midnight Indigo | `#10054d` | Brand feature surface, deep accent cards |
| 4 | Charcoal | `#272625` | Dark testimonial and footer surfaces |

## Elevation

- **White cards:** `rgba(17, 17, 17, 0.02) 0px -6px 6px 0px, rgba(17, 17, 17, 0.01) 0px -23px 9px 0px`
- **Featured cards:** `rgba(17, 17, 17, 0.12) 0px 26px 60px -6px, rgba(17, 17, 17, 0.02) 0px 28px 28px -14px, rgba(17, 17, 17, 0.04) 0px 6px 6px -3px, rgba(17, 17, 17, 0.04) 0px 1px 1px -0.5px`
- **Hairline insets:** `rgba(17, 17, 17, 0.05) 0px 0px 0px 1px inset`

## Imagery

Hand-drawn line illustrations with loose, sketchy quality — the rocket/spaceship motif appears as a black outlined drawing with minimal fill. Hero uses a warm radial gradient (orange → cream → violet) as a soft atmospheric backdrop rather than a photographic image. Product screenshots are presented in dark-framed video containers with rounded corners. Customer logos are monochrome black on white in a clean 4-column grid. Overall: minimal photography, relies on illustrated personality + gradient washes + product UI captures.

## Layout

Centered max-width ~1200px container with full-bleed sections that alternate between white and dark backgrounds. Hero is split: centered headline + subtext + email capture stacked vertically, with gradient atmosphere behind. Video container below hero spans near-full container width. Feature sections use 3-4 column card grids with pastel color-coded tiles. Testimonial section is full-bleed dark with masonry-style quote cards. Footer is dark with centered headline and CTA. Navigation is sticky at top with frosted-glass blur on scroll.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #111111
- Background (canvas): #ffffff
- Surface (soft): #f6f5f3
- Border (hairline): rgba(17,17,17,0.08)
- Accent (brand): #e8400d (Phoenix Orange)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Hero headline: "84px Labil Grotesk Variable weight 900, uppercase, #111111, letter-spacing -2.52px, line-height 0.8. Place over a radial gradient background from #e8400d through #ffeed8 to #d0b2ff."

2. Section heading: "56px Labil Grotesk Variable weight 400, #111111, letter-spacing -2.8px, line-height 1.0. Calmer than the display weight — this is the default for all section titles."

3. Category feature card: "Flat fill #ffd7f0 (Petal Pink), border-radius 12px, padding 20px, no shadow. Title in 24px weight 400 #111111. Color is the differentiator — no borders or elevation needed."

4. Email capture input: "White background, 1px border rgba(17,17,17,0.08), border-radius 12px, padding 0 16px, height 48px. Placeholder text in #6d6c6b. Join inline with a filled Ink button (#111111) at the right edge."

5. Dark testimonial card: "Background #272625, border-radius 12px, padding 20px. Quote text in #ffffff at 16px. Name in 14px white, role in 12px #6d6c6b. Avatar circle 32px at top-left."

## Pastel Taxonomy System

The five pastel colors (Petal Pink #ffd7f0, Mint Green #b7efb2, Canary Yellow #ffef99, Soft Violet #e2ddfd, Aqua #99fff9) are not decorative — they form a category-coding system. Each product pillar (Intelligence, Lead Generation, Engagement, Deliverability) maps to one color, and feature cards within that pillar inherit the color. Never use these as gradients, hover states, or accent text — they are flat surface fills for flat taxonomy tiles.

## Typography Weight Philosophy

Labil Grotesk Variable is used almost exclusively at weight 400 — even at 44px and 56px heading sizes. This is anti-convention: most brands push weight 600-700 for authority at large sizes. Amplemarket achieves authority through restraint — the whisper-weight headlines feel confident because they don't shout. Weight 900 is reserved for 84px display headlines set in uppercase, creating a poster-like moment. Weights 500 and 700 exist in the variable font but are rarely deployed.

## Letter-Spacing Scale

Letter-spacing tracks aggressively negative on display sizes and tightens proportionally as size decreases: -2.52px at 84px, -2.8px at 56px, -1.76px at 44px, -1.08px at 36px, -0.48px at 24px, -0.4px at 20px. Small UI text inverts to positive tracking: +0.3px at 10px uppercase eyebrow, +0.25px at 8px. Body text at 14-16px sits at normal tracking. This tight optical scaling gives geometric typefaces their characteristic compressed-but-readable character.

## Animation Philosophy

Motion is expressive but not showy: standard duration 0.25s with ease timing for micro-interactions, cubic-bezier(0.23, 1, 0.32, 1) for entrance animations on scroll. Sticky nav uses backdrop-filter blur (16-32px) transitioning from transparent to frosted white on scroll. Radial gradient hero has subtle scale/opacity animation. Transitions focus on transform and opacity — never animating layout properties.

## Similar Brands

- **Linear** — Same weight-400-at-large-sizes typographic restraint and minimal dark accent approach, though Linear leans dark while Amplemarket is light
- **Notion** — Similar generous whitespace, off-white canvas, and quiet monochrome-with-pastel-punctuation palette for category surfaces
- **Framer** — Same flat pastel card system for feature taxonomy, large weight-400 geometric headings, and minimal elevation philosophy
- **Pitch** — Shared editorial-meets-product feel with negative-tracked display headings and warm dark surfaces contrasting light sections
- **Raycast** — Similar playful brand accent (orange) against a clean off-white canvas with geometric grotesque type at restrained weights

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-phoenix-orange: #e8400d;
  --gradient-phoenix-orange: radial-gradient(386.06% 162.79% at 3.76985% -12.1005%, rgb(232, 64, 13) 0%, rgb(255, 238, 216) 31.14%, rgb(208, 178, 255) 81.98%);
  --color-midnight-indigo: #10054d;
  --color-charcoal: #272625;
  --color-ink: #111111;
  --color-canvas-white: #ffffff;
  --color-cream-wash: #f6f5f3;
  --color-ash: #6d6c6b;
  --color-stone: #b1b1af;
  --color-pearl: #ecebea;
  --color-petal-pink: #ffd7f0;
  --color-mint-green: #b7efb2;
  --color-canary-yellow: #ffef99;
  --color-soft-violet: #e2ddfd;
  --color-aqua: #99fff9;
  --color-indigo-deep: #2e2460;

  /* Typography — Font Families */
  --font-labil-grotesk-variable: 'Labil Grotesk Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1;
  --tracking-eyebrow: 0.3px;
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1;
  --text-body-lg: 20px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.4px;
  --text-subheading: 28px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.476px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -1.08px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.76px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.8px;
  --text-display: 84px;
  --leading-display: 0.8;
  --tracking-display: -2.52px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-84: 84px;
  --spacing-100: 100px;
  --spacing-112: 112px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-small: 4px;
  --radius-badges: 9999px;
  --radius-inputs: 12px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(17, 17, 17, 0.05) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(17, 17, 17, 0.12) 0px 26px 60px -6px, rgba(17, 17, 17, 0.02) 0px 28px 28px -14px, rgba(17, 17, 17, 0.04) 0px 6px 6px -3px, rgba(17, 17, 17, 0.04) 0px 1px 1px -0.5px;
  --shadow-sm: rgba(17, 17, 17, 0.02) 0px -6px 6px 0px, rgba(17, 17, 17, 0.01) 0px -23px 9px 0px;
  --shadow-subtle-2: rgba(17, 17, 17, 0.05) 0px 0px 1px 0px, rgba(17, 17, 17, 0.04) 1px 1px 1px 0px, rgba(17, 17, 17, 0.03) 2px 3px 2px 0px, rgba(17, 17, 17, 0.01) 4px 4px 2px 0px;
  --shadow-xl-2: rgba(25, 34, 35, 0.12) 0px 26px 60px -6px, rgba(25, 34, 35, 0.02) 0px 28px 28px -14px, rgba(25, 34, 35, 0.04) 0px 6px 6px -3px, rgba(25, 34, 35, 0.04) 0px 1px 1px -0.5px;
  --shadow-subtle-3: rgba(17, 17, 17, 0.04) 0px 1px 2px 0px, rgba(17, 17, 17, 0.04) 0px 4px 8px 0px, rgba(17, 17, 17, 0.04) 0px 0px 1px 0px, rgba(17, 17, 17, 0.04) 0px 0px 1px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-cream-wash: #f6f5f3;
  --surface-pastel-tiles: #ffd7f0;
  --surface-midnight-indigo: #10054d;
  --surface-charcoal: #272625;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-phoenix-orange: #e8400d;
  --color-midnight-indigo: #10054d;
  --color-charcoal: #272625;
  --color-ink: #111111;
  --color-canvas-white: #ffffff;
  --color-cream-wash: #f6f5f3;
  --color-ash: #6d6c6b;
  --color-stone: #b1b1af;
  --color-pearl: #ecebea;
  --color-petal-pink: #ffd7f0;
  --color-mint-green: #b7efb2;
  --color-canary-yellow: #ffef99;
  --color-soft-violet: #e2ddfd;
  --color-aqua: #99fff9;
  --color-indigo-deep: #2e2460;

  /* Typography */
  --font-labil-grotesk-variable: 'Labil Grotesk Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1;
  --tracking-eyebrow: 0.3px;
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1;
  --text-body-lg: 20px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.4px;
  --text-subheading: 28px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.476px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -1.08px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.76px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.8px;
  --text-display: 84px;
  --leading-display: 0.8;
  --tracking-display: -2.52px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-84: 84px;
  --spacing-100: 100px;
  --spacing-112: 112px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgba(17, 17, 17, 0.05) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(17, 17, 17, 0.12) 0px 26px 60px -6px, rgba(17, 17, 17, 0.02) 0px 28px 28px -14px, rgba(17, 17, 17, 0.04) 0px 6px 6px -3px, rgba(17, 17, 17, 0.04) 0px 1px 1px -0.5px;
  --shadow-sm: rgba(17, 17, 17, 0.02) 0px -6px 6px 0px, rgba(17, 17, 17, 0.01) 0px -23px 9px 0px;
  --shadow-subtle-2: rgba(17, 17, 17, 0.05) 0px 0px 1px 0px, rgba(17, 17, 17, 0.04) 1px 1px 1px 0px, rgba(17, 17, 17, 0.03) 2px 3px 2px 0px, rgba(17, 17, 17, 0.01) 4px 4px 2px 0px;
  --shadow-xl-2: rgba(25, 34, 35, 0.12) 0px 26px 60px -6px, rgba(25, 34, 35, 0.02) 0px 28px 28px -14px, rgba(25, 34, 35, 0.04) 0px 6px 6px -3px, rgba(25, 34, 35, 0.04) 0px 1px 1px -0.5px;
  --shadow-subtle-3: rgba(17, 17, 17, 0.04) 0px 1px 2px 0px, rgba(17, 17, 17, 0.04) 0px 4px 8px 0px, rgba(17, 17, 17, 0.04) 0px 0px 1px 0px, rgba(17, 17, 17, 0.04) 0px 0px 1px 0px;
}
```
