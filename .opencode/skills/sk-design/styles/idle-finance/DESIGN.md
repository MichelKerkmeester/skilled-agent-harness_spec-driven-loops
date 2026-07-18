# Idle Finance — Style Reference
> Neon deep-sea trading floor — a dark navy terminal where a single cyan signal pierces the gloom.

**Theme:** dark

Idle Finance uses a deep-ocean DeFi terminal language: near-black navy canvas with a single electric cyan accent that glows against the dark like a depth signal. The page behaves like a trading interface — dense, data-forward, atmospheric — with radial blue gradients creating a sense of horizon light emanating from behind content. Typography is the workhorse: Open Sans at heavy weights, with the hero statement split by a cyan highlight to break the headline into a branded mantra. Cards are nearly flat with hairline borders (no shadows, no elevation tricks), and the only chrome is a 1px border. Components are compact and utilitarian: pill-shaped action buttons, chip-style chain badges with extreme 80px radii, tab navigation that looks like an exchange filter bar.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyss Navy | `#17202e` | `--color-abyss-navy` | Page canvas and card surfaces — the foundational darkness every other element floats on |
| Tide Card | `#202a3e` | `--color-tide-card` | Elevated surface for nested cards, button backgrounds, and section containers — one step lighter than the canvas to imply depth without shadow |
| Spectral Cyan | `#6ae4ff` | `--color-spectral-cyan` | Hero highlight word, outlined action borders, icon strokes, link borders — the single electric signal that draws the eye through the dark interface |
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, filled action buttons, and high-contrast labels — the only fully white tone, reserved for reading and final calls-to-action |
| Carbon Black | `#000000` | `--color-carbon-black` | Hairline borders on dark surfaces and fine dividers — invisible structural lines that define cards without lifting them off the page |
| Fog Gray | `#cdd0d6` | `--color-fog-gray` | Secondary body copy and muted helper text — lowered brightness to create a clear reading hierarchy beneath Bone White |
| Horizon Glow | `radial-gradient(circle, rgb(8, 33, 143) 40%, rgb(41, 138, 203) 100%)` | `--color-horizon-glow` | Gradient atmosphere — the midtone of the radial background bloom that makes the page feel lit from behind |
| Yield Gradient | `linear-gradient(73.6deg, rgb(52, 237, 179) 2.11%, rgb(0, 209, 255))` | `--color-yield-gradient` | Accent gradient for highlights and yield indicators — teal-to-cyan sweep signaling positive performance |

## Tokens — Typography

### Open Sans — Primary typeface across the entire system. Weight 700 carries headings and the hero statement; weight 400 handles body copy and metadata; weight 600 sits on emphasized inline labels. The negative letter-spacing of -0.0360em tightens large display sizes so headlines read as solid blocks rather than airy typography. Hero sizes reach 100px — a deliberate terminal-instrument scale that makes the page feel like a financial readout. · `--font-open-sans`
- **Substitute:** Inter, DM Sans
- **Weights:** 400, 600, 700
- **Sizes:** 12, 14, 18, 20, 22, 28, 36, 56, 100
- **Line height:** 1.0–2.14 (scale varies by context; 1.36 for body, 1.20 for display)
- **Letter spacing:** -0.0360em (all sizes)
- **Role:** Primary typeface across the entire system. Weight 700 carries headings and the hero statement; weight 400 handles body copy and metadata; weight 600 sits on emphasized inline labels. The negative letter-spacing of -0.0360em tightens large display sizes so headlines read as solid blocks rather than airy typography. Hero sizes reach 100px — a deliberate terminal-instrument scale that makes the page feel like a financial readout.

### Source Sans Pro — Secondary typeface for tabular data, small labels, and inline micro-copy. Its tighter glyph widths complement Open Sans for data-dense rows like TVL figures and percentage chips without competing with display headlines. · `--font-source-sans-pro`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 15, 16
- **Line height:** 1.0–2.33
- **Letter spacing:** normal
- **Role:** Secondary typeface for tabular data, small labels, and inline micro-copy. Its tighter glyph widths complement Open Sans for data-dense rows like TVL figures and percentage chips without competing with display headlines.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.43px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.5px | `--text-body-sm` |
| body | 16px | 1.5 | -0.58px | `--text-body` |
| body-lg | 18px | 1.57 | -0.65px | `--text-body-lg` |
| subheading | 22px | 1.36 | -0.79px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -1.01px | `--text-heading-sm` |
| heading | 36px | 1.2 | -1.3px | `--text-heading` |
| heading-lg | 56px | 1.2 | -2.02px | `--text-heading-lg` |
| display | 100px | 1 | -3.6px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 52 | 52px | `--spacing-52` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 136 | 136px | `--spacing-136` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 15px |
| links | 8px |
| badges | 80px |
| inputs | 4px |
| panels | 24px |
| buttons | 80px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Pill Action Button (Filled)
**Role:** Primary navigation call-to-action (Enter App, Join)

Fully white fill (#ffffff), #000000 text at 14px Open Sans 600, 80px border-radius for a perfect pill, 12px 20px padding. Sits on the dark canvas like a lighthouse — the brightest object on screen demands the click.

### Ghost Link Button
**Role:** Secondary inline action (Learn more, external links)

Transparent fill, #6ae4ff 1px border at 8px radius, 14px Open Sans 400 in Spectral Cyan. Arrow glyph follows the label. Low visual weight keeps primary actions dominant.

### Yield Card
**Role:** Display of a single yield source with TVL and APY

#202a3 background, #000000 1px hairline border, 15px radius, 20–24px internal padding. Top row: protocol icon (circular) + name in 20px Open Sans 600 white + category label in 12px Fog Gray. Middle: APY in 36px Open Sans 700 white with 'Up to' in 12px muted above. Bottom: TVL pill in 12px Source Sans Pro on #202a3 with 80px radius, plus a chain badge in Spectral Cyan circle and an arrow chevron.

### Chain Badge
**Role:** Network indicator on yield cards and integration chips

80px border-radius circle or capsule, #6ae4ff stroke, transparent or #202a3 fill, 12px Spectral Cyan label inside. Acts as a functional dot — identity without weight.

### Tab Pill (Ecosystem Filter)
**Role:** Section-level tab navigation switching between content views

Active tab: #ffffff fill, #000000 text, 80px radius, 12px 20px padding, Open Sans 600. Inactive tabs: transparent, #cdd0d6 text at 14px Open Sans 400. Exactly one tab is active at any time, creating a clean filter bar above content.

### Protocol Logo Tile
**Role:** Integration partner display in the ecosystem grid

#202a3 background, 15px radius, centered partner logo (brand color, ~24px height), 40–60px vertical padding. Arranged in a 3-up grid that wraps to 2-up on narrower widths. No text labels — the brand mark speaks for itself.

### Partner Section Column
**Role:** Three-column call-to-action for partner audiences

Transparent background, 24px gap between columns. Each column: 48px decorative icon at top, 22px Open Sans 700 white heading, 16px Open Sans 400 Fog Gray description, then a Join button (white fill pill) and Learn more ghost link in a horizontal pair.

### Stat Block
**Role:** Large-number display in the Governance section

Centred, no card wrapper. Number in 56–100px Open Sans 700 white, label in 14px Fog Gray directly beneath. The oversized numbers function as the section's visual anchor.

### Top Announcement Bar
**Role:** Site-wide update banner above the navigation

Full-width strip, #1a2638 background or slightly lighter than canvas, 14px Open Sans 400 centered text in #cdd0d6. Inline links in Spectral Cyan with underline on hover. Fixed-height, low-prominence chrome.

### Navigation Header
**Role:** Primary site navigation

Transparent over the dark canvas, left-aligned logo (white mark + wordmark), centered nav links in 14px Open Sans 400 white, right-aligned Enter App button. 64–80px height. No border — the header bleeds into the hero gradient.

### Hero Headline
**Role:** Largest typographic statement on the page

100px Open Sans 700 white, line-height ~1.2, letter-spacing -0.0360em. Centered above the yield card row. A single word is split out in Spectral Cyan to create a branded two-tone reading.

### Trust Strip
**Role:** Footer-tier credibility row (Trusted by, Current TVL, Generated yield)

Bottom band with #cdd0d6 14px labels above partner logo row. Logos rendered in white at 40–60% opacity to recede into the background. TVL and yield figures right-aligned in Open Sans 600 white.

## Do's and Don'ts

### Do
- Use the pill (80px) radius on every button, tab, and chain badge — this is the system's most recognisable shape
- Keep cards at #202a3 with a 1px #000000 hairline border; never use shadows for elevation
- Reserve Spectral Cyan (#6ae4ff) for exactly three roles: hero highlight words, outlined action borders, and functional icons
- Set headlines at 56–100px Open Sans 700 with -0.0360em letter-spacing for the terminal-display feel
- Use the radial blue gradient only as a background bloom behind hero-level content — never as a card fill
- Pair every primary filled button with a ghost Spectral Cyan link as the secondary action in the same row
- Maintain 80px vertical breathing room between major sections to keep the page atmospheric rather than crowded

### Don't
- Do not introduce any new accent hues — the single-cyan discipline is the brand's signature
- Do not use rounded shadows, glows, or blur effects on cards; the system is deliberately flat and defined by borders only
- Do not mix Open Sans and Source Sans Pro in the same line — Open Sans owns display and body, Source Sans Pro only handles tabular micro-data
- Do not use square or 4px radii on primary buttons; the 80px pill is mandatory for action affordances
- Do not place dark text on the dark canvas; all text must be Bone White or Fog Gray for AAA contrast
- Do not apply the cyan accent to large filled areas — it loses its signal quality when it covers more than a border or single word
- Do not use light theme surfaces or white card backgrounds; the entire system is dark-mode by design

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Abyss Canvas | `#17202` | The page-wide background, sits behind everything including the radial gradient bloom |
| 1 | Tide Card | `#202a3` | Yield cards, protocol tiles, button fills — the only surface one step off the canvas |
| 2 | Bone Surface | `#ffffff` | Reserved exclusively for filled primary action buttons; never used as a card or panel surface |

## Elevation

The system has no shadows. Depth is communicated exclusively through two mechanisms: a 1px #000000 hairline border that defines card edges, and a one-step lighter surface color (#202a3e) that separates nested cards from the #17202 canvas. This is a deliberate flat-design choice that keeps the interface feeling like a data terminal rather than a material UI — the darkness itself implies depth.

## Imagery

The site uses almost no traditional imagery. Instead, the visual atmosphere is built from the radial blue gradient that blooms from the upper-left of the page, creating the impression of a light source behind a dark terminal. Partner protocol logos (Lido, Compound, Aave, Morpho, Clearpool) function as the only graphic content beyond UI chrome — they appear as small brand-coloured marks inside dark tiles, never as full-bleed hero images. Decorative section icons (wallet, credit card) are minimal 48px line illustrations in Spectral Cyan. There is no photography, no lifestyle imagery, no product screenshots — the yield figures and TVL numbers ARE the visual content.

## Layout

The page follows a centered single-column rhythm with a max-width of ~1200px. The hero is a vertically stacked composition: radial blue gradient background, centered 100px headline, then a 3-column yield card row that reads as a data dashboard. Below, the ecosystem section uses a horizontal tab filter bar above a 3-column (wrapping to 2) grid of dark logo tiles — a clean exchange-style filter layout. The partner section returns to a 3-column text-heavy layout with icon + heading + description + paired buttons. The governance section breaks into 4 centered stat blocks, each a number-over-label stack. Vertical rhythm uses 80px section gaps to give each block room to breathe; horizontal rhythm is tight within cards (16–24px padding). Navigation is a transparent header that sits directly on the hero gradient, with the logo left, links centered, and the pill action button right — no sticky behaviour, no sidebar, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (Bone White)
- background: #17202e (Abyss Navy)
- card surface: #202a3e (Tide Card)
- border: #000000 hairline
- accent: #6ae4ff (Spectral Cyan)
- muted text: #cdd0d6 (Fog Gray)
- primary action: #ffffff (filled action)

**Example Component Prompts**

1. Build a hero section: #17202e base with a radial-gradient(circle, rgb(8,33,143) 40%, rgb(41,138,203) 100%) bloom from upper-left. Centered 100px headline in Open Sans 700 white with -0.0360em letter-spacing; split a single word in #6ae4ff Spectral Cyan.

2. Build a yield card: #202a3e background, 1px #000000 border, 15px radius, 24px padding. Top row has 32px circular protocol icon, 20px Open Sans 600 white name, 12px Fog Gray category. Center shows 36px Open Sans 700 white APY with 12px muted 'Up to' above. Bottom row has an 80px-radius TVL pill in #202a3e with 12px Source Sans Pro white text, a 32px circular chain badge with #6ae4ff stroke, and a white arrow chevron.

3. Build a pill action button: 80px border-radius, #ffffff fill, #000000 text, 14px Open Sans 600, 12px 20px padding. Pair it inline with a ghost link: transparent fill, 8px radius, 1px #6ae4ff border, 14px Spectral Cyan text.

4. Build an ecosystem tab filter: horizontal row of pills at 80px radius, 12px 20px padding. Active tab is #ffffff fill with #000000 Open Sans 600 text; inactive tabs are transparent with #cdd0d6 14px Open Sans 400 text.

5. Build a governance stat block: centered, no wrapper. Number at 56px Open Sans 700 white with -0.0360em tracking; label directly beneath in 14px Fog Gray Open Sans 400.

## Gradient System

Two gradients carry the entire atmospheric load: (1) A radial blue bloom from rgb(8,33,143) to rgb(41,138,203) that washes the upper portion of the page and creates the sense of a digital horizon behind the hero. (2) A linear teal-to-cyan sweep from rgb(52,237,179) to rgb(0,209,255) used sparingly for positive-yield indicators and accent highlights. Both are background-only — never applied to text or card surfaces. The radial gradient is the only gradient allowed at large scale; the linear gradient is restricted to 1–2px strokes or tiny yield badges.

## Similar Brands

- **Lido Finance** — Same deep-navy canvas with a single luminous accent colour, data-terminal card grid, and yield-figure-as-hero treatment
- **Curve Finance** — Similar dark DeFi dashboard with flat bordered cards, pill-shaped buttons, and a single brand cyan against near-black surfaces
- **Aave** — Identical atmosphere: dark navy with a glowing accent, large-numeric stat blocks, protocol-integration tile grid, and exchange-style tab filters
- **Yearn Finance** — Matching single-accent dark-mode DeFi language with hairline-bordered cards, no shadows, and a terminal-style reading hierarchy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyss-navy: #17202e;
  --color-tide-card: #202a3e;
  --color-spectral-cyan: #6ae4ff;
  --color-bone-white: #ffffff;
  --color-carbon-black: #000000;
  --color-fog-gray: #cdd0d6;
  --color-horizon-glow: #298acb;
  --gradient-horizon-glow: radial-gradient(circle, rgb(8, 33, 143) 40%, rgb(41, 138, 203) 100%);
  --color-yield-gradient: #00d1ff;
  --gradient-yield-gradient: linear-gradient(73.6deg, rgb(52, 237, 179) 2.11%, rgb(0, 209, 255));

  /* Typography — Font Families */
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.43px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.5px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.58px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.57;
  --tracking-body-lg: -0.65px;
  --text-subheading: 22px;
  --leading-subheading: 1.36;
  --tracking-subheading: -0.79px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.01px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -1.3px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -2.02px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -3.6px;

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
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-136: 136px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 15px;
  --radius-3xl: 24px;
  --radius-full: 80px;

  /* Named Radii */
  --radius-cards: 15px;
  --radius-links: 8px;
  --radius-badges: 80px;
  --radius-inputs: 4px;
  --radius-panels: 24px;
  --radius-buttons: 80px;

  /* Surfaces */
  --surface-abyss-canvas: #17202;
  --surface-tide-card: #202a3;
  --surface-bone-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyss-navy: #17202e;
  --color-tide-card: #202a3e;
  --color-spectral-cyan: #6ae4ff;
  --color-bone-white: #ffffff;
  --color-carbon-black: #000000;
  --color-fog-gray: #cdd0d6;
  --color-horizon-glow: #298acb;
  --color-yield-gradient: #00d1ff;

  /* Typography */
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.43px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.5px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.58px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.57;
  --tracking-body-lg: -0.65px;
  --text-subheading: 22px;
  --leading-subheading: 1.36;
  --tracking-subheading: -0.79px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.01px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -1.3px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -2.02px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-136: 136px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 15px;
  --radius-3xl: 24px;
  --radius-full: 80px;
}
```
