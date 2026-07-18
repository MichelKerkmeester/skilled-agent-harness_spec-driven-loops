# Langbase — Style Reference
> Midnight aurora console

**Theme:** dark

Langbase is a midnight developer console where a single chromatic aurora is the only color in an otherwise pure dark-gray world. The canvas is #232324 — a near-black charcoal — structured by hairline borders at #232324 and #5c5c61 that create an architectural blueprint grid visible behind the hero. The interface reads as a terminal: GeistSans provides clean geometric UI, GeistMono adds the developer identity at display sizes, and CTAs are achromatic pills (white-on-dark) so the multi-hue gradient — peach, pink, violet, mint, sky — becomes the sole emotional accent. Components stay flat and lightweight: no decorative shadows, no colorful buttons, no rounded-everything softness. The only color is the aurora, and it appears as fragmented horizontal bars beside the hero — decorative spectacle, never functional chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Console Charcoal | `#232324` | `--color-console-charcoal` | Dominant page canvas, structural hairline borders, and the visible grid backdrop behind the hero. The single most-used color in the system; defines the near-black field that everything else sits on |
| Bone White | `#fafafa` | `--color-bone-white` | Primary text, primary action fill, and the bright pole of the system. White-on-charcoal carries all the hierarchy; nothing else is allowed to compete |
| True Black | `#000000` | `--color-true-black` | Deepest surface tone for the darkest interactive states and the reverse-text base inside white CTA buttons. Used sparingly — never as the page background |
| Off-White | `#ebeced` | `--color-off-white` | Slightly warmer white for secondary text and subtle emphasis where #fafafa would feel too clinical |
| Mute Gray | `#a1a1aa` | `--color-mute-gray` | Muted helper text, nav links, and secondary icon strokes. The readable-but-quiet gray that supports body copy without claiming focus |
| Wire Gray | `#5c5c61` | `--color-wire-gray` | Hairline borders, icon strokes, and the dividing lines between content sections. The 1px wire that holds the console together |
| Recess Black | `#181818` | `--color-recess-black` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Nav Ink | `#0e0e10` | `--color-nav-ink` | Navigation bar background — the only surface darker than the canvas, anchoring the top of the page as a distinct horizontal band |
| Smoke | `#454546` | `--color-smoke` | Muted body text and the mid-tone of the neutral scale. Quieter than #a1a1aa for de-emphasized copy |
| Ash | `#696970` | `--color-ash` | Quietest readable gray for tertiary metadata and timestamps |
| Aurora Spectrum | `linear-gradient(to right, #f6d1ac, #f3b5d2, #c7b8f5, #a7eadc, #afcdf6)` | `--color-aurora-spectrum` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### GeistSans — All UI text — navigation, buttons, body copy, and subheadings. Custom geometric sans with -0.025em tracking baked in; weight 500 carries most of the voice. The maximum sans size (48px) is reserved for the hero headline, after which GeistMono takes over for display. · `--font-geistsans`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 48
- **Line height:** 1.0–1.75
- **Letter spacing:** -0.025em at all sizes (≈ -0.3px at 12px, -1.2px at 48px)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** All UI text — navigation, buttons, body copy, and subheadings. Custom geometric sans with -0.025em tracking baked in; weight 500 carries most of the voice. The maximum sans size (48px) is reserved for the hero headline, after which GeistMono takes over for display.

### GeistMono — Developer-identity display type and inline code/numeric emphasis. The extreme -0.3em letter-spacing at 60-72px collapses the letterforms into dense blocks of glyph — a signature choice that reads as 'terminal' rather than 'poster'. Used for large statistics, code tokens, and the largest display moments. · `--font-geistmono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, ui-monospace
- **Weights:** 400, 500
- **Sizes:** 12, 13, 16, 60, 72
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.3em at 60-72px (≈ -18px to -21.6px); tight tracking at smaller sizes
- **Role:** Developer-identity display type and inline code/numeric emphasis. The extreme -0.3em letter-spacing at 60-72px collapses the letterforms into dense blocks of glyph — a signature choice that reads as 'terminal' rather than 'poster'. Used for large statistics, code tokens, and the largest display moments.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 18 | -0.3px | `--text-caption` |
| body-sm | 14px | 20 | -0.35px | `--text-body-sm` |
| body | 16px | 24 | -0.4px | `--text-body` |
| subheading | 18px | 28 | -0.45px | `--text-subheading` |
| heading | 20px | 28 | -0.5px | `--text-heading` |
| heading-lg | 48px | 56 | -1.2px | `--text-heading-lg` |
| display | 60px | 60 | -18px | `--text-display` |
| display-xl | 72px | 72 | -21.6px | `--text-display-xl` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 12px |
| icons | 4px |
| inputs | 4px |
| buttons | 9999px |
| large-buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary Pill CTA
**Role:** The only filled action button in the system

Bone White #fafafa background, True Black #0e0e10 text, fully rounded at 9999px. Padding 8px 16px (compact) or 10px 20px (comfortable). GeistSans 14px weight 500. Carries the single subtle shadow: rgba(0,0,0,0.1) 0px 1px 3px 0px, rgba(0,0,0,0.1) 0px 1px 2px -1px. No hover state changes color — it stays the system anchor.

### Ghost Outline Button
**Role:** Secondary action that defers to the primary

Transparent background, 1px Wire Gray #5c5c61 border, Bone White #fafafa text, 9999px radius. Same padding scale as the primary pill (8px 16px or 10px 20px). GeistSans 14px weight 500. Sits beside the primary CTA as the quieter option — outlined, never filled.

### Sticky Navigation Bar
**Role:** Top-of-page anchor that persists on scroll

Nav Ink #0e0e10 background (distinctly darker than the canvas), 1px Console Charcoal #232324 bottom border. Height ~56px. Horizontal flex: logo left, link cluster center, Primary Pill CTA right. GeistSans 14px weight 500 for links in Mute Gray #a1a1aa.

### Announcement Strip
**Role:** Time-sensitive message above or below the nav

Full-width band, 1px Console Charcoal #232324 border on all sides, centered GeistSans 12px text in Mute Gray #a1a1aa. Small leading icon (4px radius, 16px). 8px vertical padding. Acts as a quiet ticker, not a banner.

### Hero Grid Backdrop
**Role:** Architectural texture behind the hero

1px Console Charcoal #232324 lines forming a visible coordinate grid across the hero section. Creates a 'blueprint' or 'IDE canvas' feel — the grid is the visual texture, not a gradient or image. Sits behind both the headline and the aurora bars.

### Aurora Gradient Bars
**Role:** The single decorative spectacle on the page

Fragmented horizontal bars (8px height, varying widths) filled with the multi-hue aurora gradient: peach #f6d1ac → pink #f3b5d2 → violet #c7b8f5 → mint #a7eadc → sky #afcdf6. Positioned right of the hero headline as an abstract chart-like arrangement. Never used as a button fill, text color, or container background.

### Hero Headline
**Role:** Largest type on the page

GeistSans 48px weight 500 (or GeistMono 60px for a terminal feel), Bone White #fafafa, -1.2px letter-spacing. Line height 56px. Two-line max. The most visually weighted element after the aurora.

### Logo Trust Strip
**Role:** Social proof band below the hero

Horizontal grid of company wordmarks (6 per row, then 5). Logos rendered in Bone White #fafafa or Mute Gray #a1a1aa — monochrome, never brand-colored. 24px gap between logos, 32px row gap. 'Trusted by developers at 5000+ companies' caption in GeistSans 12px Mute Gray above the grid.

### Code / Mono Label
**Role:** Inline technical references and terminal snippets

GeistMono 13px weight 400 in Mute Gray #a1a1aa. No background. 0 letter-spacing at body size (the -0.3em tracking is for display only). Used for file paths, API endpoints, and command-line cues that need to read as code.

### Input / Code Field
**Role:** Text entry in a dark recessed surface

Recess Black #181818 background, 1px Wire Gray #5c5c61 border, 4px radius. Padding 12px 16px. GeistMono 13px for code inputs, GeistSans 14px for regular text. Placeholder in Mute Gray #a1a1aa. Focus ring: 1px Bone White #fafafa border, no glow.

### Dark Card Surface
**Role:** Content container for features, pricing, or API examples

Console Charcoal #232324 background (same as canvas, distinguished by border), 1px Wire Gray #5c5c61 border, 12px radius, 24px padding. No shadow — the border is the entire depth signal. Cards never float above the page.

### Icon (Geometric Mono)
**Role:** Functional and decorative iconography

1.5px stroke weight, 16-20px size, 4px square or 9999px circular bounding. Color: Bone White #fafafa for primary, Mute Gray #a1a1aa for secondary, Wire Gray #5c5c61 for tertiary. Outlined, never filled. No multi-color icons — the aurora gradient is the only color in the system.

## Do's and Don'ts

### Do
- Use 9999px radius for all primary and ghost buttons — the pill is the system's shape signature
- Apply -0.025em letter-spacing to every GeistSans size and -0.3em to GeistMono display sizes — tracking is part of the brand
- Anchor every page on the Console Charcoal #232324 canvas with Nav Ink #0e0e10 reserved exclusively for the top navigation band
- Use the aurora gradient only as fragmented horizontal bars in hero/feature sections — never as a button fill, text color, or container background
- Hold the 4px spacing grid: 4, 8, 12, 16, 24, 32, 40, 48, 64 — no exceptions
- Express depth through #181818 recessed surfaces rather than shadows — inputs and dark buttons press into the canvas, not float above it
- Pair GeistMono 60-72px with -0.3em tracking for the largest display moments to read as terminal, not poster

### Don't
- Don't introduce any chromatic color for buttons, links, or icons — the palette is 99% achromatic; the aurora is the only exception and it is decoration only
- Don't use shadows beyond the single 1px whisper on the primary CTA — depth comes from tonal recess, not elevation
- Don't use #000000 as a page or section background — it is reserved for the deepest interactive states and inverted text
- Don't break the 4px grid or invent radii outside 4, 12, 100, and 9999px — the radius scale is closed
- Don't use the aurora gradient as text fill, border, or icon stroke — it appears exclusively as fragmented horizontal bars
- Don't introduce a second accent color, a brand red, or a success green — the system has no chromatic functional palette; state communication happens through weight and opacity
- Don't use multi-color or filled icons — outlined 1.5px mono icons in white or gray only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | True Black | `#000000` | Deepest accent surface — used inside inverted CTAs and the darkest focus states |
| 1 | Nav Ink | `#0e0e10` | Sticky navigation band, the only surface that reads as distinctly darker than the canvas |
| 2 | Recess Black | `#181818` | Recessed interactive fields — input boxes and dark-context buttons that feel pressed into the page |
| 3 | Console Charcoal | `#232324` | Dominant page canvas — the architectural ground plane that carries all content |

## Elevation

- **Primary Pill CTA (only):** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`

## Imagery

Minimal decorative approach. The hero is dominated by a multi-hue aurora gradient rendered as fragmented horizontal bars — peach, pink, violet, mint, sky — providing the only chromatic burst against the monochrome interface. A subtle architectural grid of hairline #232324 lines creates a blueprint backdrop behind the hero. Company logos appear as monochrome wordmarks (Bone White or Mute Gray) in a two-row trust band. No photography, no illustrations, no 3D renders — the entire visual interest comes from the type, the grid, and the single aurora gradient.

## Layout

Full-bleed dark canvas (no max-width on the background) with content constrained to ~1200px. Sticky top navigation in Nav Ink. Hero uses a two-column split: headline + dual CTAs on the left, fragmented aurora bars on the right, all overlaid on a visible coordinate grid. Generous vertical spacing (64-80px between sections) with hairline #5c5c61 dividers rather than full color shifts. Below the hero, a compact two-row logo trust strip (6+5 grid) sits in Mute Gray. Section rhythm: announcement strip → nav → hero (generous) → trust strip (compact) → content sections follow the same spacious cadence. No sidebar, no mega-menu, no asymmetric column work — the layout is terminal-grid clean.

## Agent Prompt Guide

**Quick Color Reference**
- text: #fafafa
- background: #232324
- border: #5c5c61
- muted text: #a1a1aa
- aurora accent: multi-hue gradient (peach→pink→violet→mint→sky)
- primary action: #fafafa (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #fafafa background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Ghost button: transparent background, 1px #5c5c61 border, #fafafa text, 9999px radius, 10px 20px padding, GeistSans 14px weight 500.


4. Hero headline: GeistSans 48px weight 500, #fafafa color, -1.2px letter-spacing, line-height 56px, max two lines.

5. Input field: #181818 background, 1px #5c5c61 border, 4px radius, 12px 16px padding, GeistMono 13px, placeholder in #a1a1aa.

6. Aurora decoration: 8px tall horizontal bars in varying widths filled with the multi-hue gradient (peach→pink→violet→mint→sky), positioned right of the hero headline, never functional.

## Similar Brands

- **Vercel** — Same Geist typeface family, same near-black canvas, same developer-platform terminal feel, same achromatic pill CTAs
- **Linear** — Dark-mode product UI with hairline borders, pill buttons, and a single restrained palette — though Langbase is more console-like and less dense
- **Together.ai** — AI infrastructure platform with a similarly dark, type-forward hero and developer-terminal identity
- **Modal** — Developer infrastructure brand with comparable dark canvas, Geist-like geometric type, and hairline structural borders
- **Replicate** — AI cloud platform with a dark, minimal interface and a single decorative visual accent above the fold

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-console-charcoal: #232324;
  --color-bone-white: #fafafa;
  --color-true-black: #000000;
  --color-off-white: #ebeced;
  --color-mute-gray: #a1a1aa;
  --color-wire-gray: #5c5c61;
  --color-recess-black: #181818;
  --color-nav-ink: #0e0e10;
  --color-smoke: #454546;
  --color-ash: #696970;
  --color-aurora-spectrum: #c7b8f5;
  --gradient-aurora-spectrum: linear-gradient(to right, #f6d1ac, #f3b5d2, #c7b8f5, #a7eadc, #afcdf6);

  /* Typography — Font Families */
  --font-geistsans: 'GeistSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 28;
  --tracking-subheading: -0.45px;
  --text-heading: 20px;
  --leading-heading: 28;
  --tracking-heading: -0.5px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 56;
  --tracking-heading-lg: -1.2px;
  --text-display: 60px;
  --leading-display: 60;
  --tracking-display: -18px;
  --text-display-xl: 72px;
  --leading-display-xl: 72;
  --tracking-display-xl: -21.6px;

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
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 12px;
  --radius-icons: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 9999px;
  --radius-large-buttons: 100px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-true-black: #000000;
  --surface-nav-ink: #0e0e10;
  --surface-recess-black: #181818;
  --surface-console-charcoal: #232324;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-console-charcoal: #232324;
  --color-bone-white: #fafafa;
  --color-true-black: #000000;
  --color-off-white: #ebeced;
  --color-mute-gray: #a1a1aa;
  --color-wire-gray: #5c5c61;
  --color-recess-black: #181818;
  --color-nav-ink: #0e0e10;
  --color-smoke: #454546;
  --color-ash: #696970;
  --color-aurora-spectrum: #c7b8f5;

  /* Typography */
  --font-geistsans: 'GeistSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 28;
  --tracking-subheading: -0.45px;
  --text-heading: 20px;
  --leading-heading: 28;
  --tracking-heading: -0.5px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 56;
  --tracking-heading-lg: -1.2px;
  --text-display: 60px;
  --leading-display: 60;
  --tracking-display: -18px;
  --text-display-xl: 72px;
  --leading-display-xl: 72;
  --tracking-display-xl: -21.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
```
