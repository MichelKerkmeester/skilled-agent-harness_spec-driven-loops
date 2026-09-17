# Common — Style Reference
> graph paper under neon streaks

**Theme:** light

Common operates on a graphite-and-paper economy: the canvas is near-white, structure is near-black, and everything meaningful is signalled by one of two narrow chromatic accents or a single full-spectrum gradient. Type is compact and uniform (NeueHaasUnica, tabular figures, whisper-wide tracking) so the page reads as a ledger rather than a brochure. The 6px radius is the system's only bend — nothing is fully pill, nothing is sharp. Color is rationed: blue and violet appear as thin borders, link strokes, and icon dots; the vivid spectrum is reserved for the launch card and the launch button, which together form a single ceremonial moment on an otherwise quiet page. Elevation is barely there (a 1px/5% shadow) — depth is created by hairline borders on a stacked gray surface, not by floating cards.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon | `#000000` | `--color-carbon` | Body text, structural hairlines, dark icon strokes — the universal ink that defines every other element on the page |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, input fields, button text on dark fills |
| Fog | `#f0eff0` | `--color-fog` | Body background wash, second surface tier below cards |
| Silver | `#e0dfe1` | `--color-silver` | Input borders, subtle dividers between content bands |
| Mist | `#c1c0c2` | `--color-mist` | Card borders — a half-step lighter than the structural hairline, used to separate stacked cards from the canvas |
| Ash | `#a09da1` | `--color-ash` | Muted icon strokes, inactive nav borders, secondary metadata |
| Obsidian | `#282729` | `--color-obsidian` | Heavy icon borders, strong dividers, secondary structural lines that need more weight than #000 hairline |
| Onyx | `#141315` | `--color-onyx` | Deepest text tier for high-emphasis labels over light surfaces |
| Graphite | `#3d3a3e` | `--color-graphite` | Primary action button fill — the dark solid button (Sign in, Randomize); slightly lifted from pure black to read as a surface, not absence |
| Cobalt Pulse | `#338fff` | `--color-cobalt-pulse` | Link text, icon dots, chromatic borders — the blue half of the system, used to mark tokens, active links, and the start of gradients |
| Ultraviolet | `#7a33ff` | `--color-ultraviolet` | Outlined action border, secondary link accent — appears as a stroke on ghost controls and as the mid-stop in gradient transitions |
| Spectrum Bridge | `linear-gradient(90deg, #0079cc 0%, #050fa3 27%, #ff1000 59%, #ff1000 100%)` | `--color-spectrum-bridge` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Aurora Wash | `linear-gradient(90deg, rgba(255, 31, 0, 0.3) 0%, rgba(255, 128, 215, 0.3) 50%, rgba(0, 121, 204, 0.3) 100%)` | `--color-aurora-wash` | Hero card gradient — soft translucent wash from ember through pink to cobalt, a 30% opacity field that sits behind the launch prompt |

## Tokens — Typography

### NeueHaasUnica — All interface type — body, nav, buttons, cards, inputs, links, icons labels. Weight 400 for body and secondary; 500 for buttons and emphasized labels; 600 reserved for section headings. Tabular figures ('tnum', 'lnum') on all numeric displays so token counts and prices align in columns. · `--font-neuehaasunica`
- **Substitute:** Inter, Neue Haas Grotesk Display, Söhne
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 20, 24, 28, 32, 36px
- **Line height:** 1.00–1.71
- **Letter spacing:** 0.01em at body sizes (14–16px); 0.02em at display sizes (28–36px) — tracking tightens relative to size, giving headlines a slightly tighter optical fit than body
- **OpenType features:** `"lnum" on, "tnum" on`
- **Role:** All interface type — body, nav, buttons, cards, inputs, links, icons labels. Weight 400 for body and secondary; 500 for buttons and emphasized labels; 600 reserved for section headings. Tabular figures ('tnum', 'lnum') on all numeric displays so token counts and prices align in columns.

### Silka — Supplementary display face — used sparingly for editorial moments and icon-adjacent labels where a different texture is needed from the interface default · `--font-silka`
- **Substitute:** Söhne, Inter, GT America
- **Weights:** 400, 700
- **Sizes:** 20, 24, 28px
- **Line height:** 1.17–1.50
- **Role:** Supplementary display face — used sparingly for editorial moments and icon-adjacent labels where a different texture is needed from the interface default

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | 0.14px | `--text-caption` |
| body | 16px | 1.5 | 0.16px | `--text-body` |
| subheading | 20px | 1.4 | 0.2px | `--text-subheading` |
| heading-sm | 24px | 1.43 | 0.24px | `--text-heading-sm` |
| heading | 28px | 1.17 | 0.56px | `--text-heading` |
| heading-lg | 32px | 1.15 | 0.64px | `--text-heading-lg` |
| display | 36px | 1 | 0.72px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| icons | 6px |
| inputs | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(40, 39, 41, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 32px
- **Card padding:** 16px
- **Element gap:** 8-16px

## Components

### Spectrum Launch Button
**Role:** The single ceremonial action — the launch token submission

Filled button with the full-spectrum gradient (cobalt → violet → ember red, 90deg), white text, weight 500 at 16px, 6px radius, 8px 16px padding, optional rocket/arrow icon in white. The only button that carries color.

### Graphite Filled Button
**Role:** Standard dark action — Sign in, Randomize, confirmations

Solid #3d3a2 background, #ffffff text, weight 500 at 16px, 6px radius, 8px 16px padding. No border. This is the workhorse button; the dark fill sits squarely between paper and carbon so it reads as a solid object, not a void.

### Ghost Outlined Button
**Role:** Secondary action — Create account, cancel

Transparent background, 1px #000000 border, #000000 text, 6px radius, 8px 16px padding. Hairline border matches the system border weight — the button is a container, not a filled object.

### Aurora Launch Card
**Role:** Hero surface wrapping the token-launch prompt

Full-width card with the aurora-wash gradient (ember→pink→cobalt at 30% opacity) on a white base, 1px #c1c0c2 border, 6px radius, 16–20px padding. Contains a single text input and the spectrum launch button. This card is the only place a gradient appears as a surface.

### Text Input
**Role:** Token idea entry, search

White background, 1px #e0dfe1 border, 6px radius, 8–10px vertical / 12px horizontal padding, 14–16px placeholder text in Ash #a09da1. Focus state: border darkens to Carbon #000000 — no glow, no ring, just a weight shift.

### Section Header Row
**Role:** Trending, Recently Launched, Graduated — list section titles

NeueHaasUnica 24px weight 500 in Carbon, paired with a right-aligned text link in Cobalt #338fff weight 400 at 16px. No background, no border — just a typographic moment. Token indicator dots (4px circles in Cobalt and Ultraviolet) sit inline as visual punctuation.

### Token Indicator Dot
**Role:** Marks a list section as token-related

Two 8px filled circles in Cobalt #338fff and Ultraviolet #7a33ff, overlapping or adjacent at 6px gap. No border, no shadow. The system uses only these two colors as filled chromatic shapes; everything else is a stroke.

### Notification Banner
**Role:** Top-of-page announcement strip

Full-width row with the aurora-wash gradient at 30% opacity, 2–4px vertical padding, centered 14px text in Carbon, with a compact spectrum-fill claim button on the right. Close icon (×) in Carbon at the far right.

### Side Rail
**Role:** Left-edge contextual panel — sign-in prompt, community filters

Narrow column (≈200px), white background, no visible border, separated from the main content by whitespace alone. Contains stacked icon buttons (4px squares in Ash) and a graphite sign-in button. The rail is whisper-thin; it hints rather than divides.

### Top Navigation Bar
**Role:** Primary site navigation

White background, 16px vertical padding, 1px bottom border in #e0dfe1. Left: brand mark. Center: search input (full-width, 1px Silver border, 6px radius, magnifier icon in Ash). Right: text link (About), icon buttons (theme toggle, help — 1px Ash borders, 6px radius), ghost outlined Create account, graphite filled Sign in.

### Search Input
**Role:** Global site search

White field, 1px #e0dfe1 border, 6px radius, 8–10px vertical padding, leading magnifier icon in #a09da1, placeholder in #a09da1. Stretchable to fill available width — there is no max-width on the search itself, only on its container.

### Icon Button
**Role:** Theme toggle, help, sidebar controls

1px border in #a09da1 or #282729, transparent background, 6px radius, 6–8px internal padding, 16px icon in matching color. Hover: border darkens to #000000, icon darkens to #000000. The stroke IS the button — no fill state.

### Arrow Link
**Role:** Inline navigation — 'Tokens →', 'See all →', 'Create Your Community →'

NeueHaasUnica 16px weight 400 in Cobalt #338fff, trailing → arrow (U+2192) at 1.1em size. The arrow is part of the text, not a separate icon — it inherits color and weight.

### Hairline Divider
**Role:** Separates nav from content, cards from lists, sections within the page

1px solid line in #e0dfe1 (or #000000 for stronger structural breaks). No padding above or below — the line lives in the gap. The system has no thick rules.

## Do's and Don'ts

### Do
- Use 6px border-radius on every container — cards, buttons, inputs, icon buttons. There is one radius in this system; the pill (80px) appears only on the launch card's gradient border treatment and should not propagate.
- Reserve the full-spectrum gradient exclusively for the launch action. No other button, no other card, no other element should carry cobalt→violet→ember.
- Set body type at 16px / line-height 1.5 and never go below 14px. The type scale is compact but not micro — density comes from spacing, not from shrinking text.
- Use #3d3a3 (Graphite) for primary action fills, not pure #000000. Pure black reads as absence; graphite reads as a solid object. Reserve #000000 for text and hairlines.
- Apply tabular figures ('tnum', 'lnum') on every numeric display via font-feature-settings. Token counts, prices, and percentages must align vertically.
- Separate cards from the canvas with a 1px #c1c0c2 hairline. Reach for the 1px/5% shadow only when a border alone cannot break the card from its background.
- Use Cobalt #338fff and Ultraviolet #7a33ff only as strokes, dots, and link text. The system has exactly two chromatic filled shapes: the two token indicator dots.

### Don't
- Do not introduce a second gradient surface. The aurora wash belongs only on the launch card and the notification banner — not on pricing, not on feature blocks, not on empty states.
- Do not use rounded-rectangle shadows of 8px+ blur. The system is flat; a 1px/2px offset at 5% opacity is the ceiling.
- Do not use a chromatic border on a filled action button. Spectrum goes on spectrum buttons; graphite goes on graphite buttons; outlines go on ghost buttons. Mixing fill and chromatic stroke is not in the vocabulary.
- Do not place type below 14px or above 36px. The scale is narrow by design — out-of-scale sizes read as imported from another system.
- Do not use a soft drop shadow to indicate focus. Focus is communicated by a 1px border weight shift from Silver to Carbon, nothing else.
- Do not apply color to body text. Carbon #000000 is the only text color; muted helper text uses Ash #a09da1, never a tinted gray.
- Do not create new radii. If 6px doesn't fit a component, the component doesn't belong in this system.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background — the dominant white field |
| 2 | Body Wash | `#f0eff0` | Optional second-tier background for sections that need to recede behind the canvas |
| 3 | Card | `#ffffff` | Card surfaces — sit on the canvas with a #c1c0c2 hairline border, no shadow |
| 4 | Launch Card | `#ff80d7` | Sole ceremonial surface — translucent aurora gradient field wrapping the token-launch prompt |

## Elevation

- **Card:** `rgba(40, 39, 41, 0.05) 0px 1px 2px 0px`

## Imagery

Common is essentially imageless — the visual identity is carried by the aurora gradient on the launch card and the two filled token dots, not by photography or illustration. Where icons appear (magnifier, theme toggle, help, close, arrow), they are 16px line icons with 1.5px stroke weight in Carbon or Ash, sitting inside 1px-bordered 6px-radius containers. Token entries are represented by the two-color dot pair (Cobalt + Ultraviolet, 8px each) — no avatars, no thumbnails, no product imagery. The only gradient treatment that functions as 'imagery' is the aurora wash and the spectrum button, both of which are system elements, not decorative media. There are no people, no product photos, no screenshots anywhere in the interface.

## Layout

The page is a max-width 1200px centered column on a white canvas, with a thin side rail on the left (≈200px, whitespace-separated, not bordered) and the main content column on the right. The hero is a full-width launch card with the aurora gradient, sitting flush between the top nav and the first list section. Below the hero, content is a single vertical stack of section header rows (Trending, Recently Launched, Graduated, Trending Communities) each followed by a list — no multi-column grids, no card carousels, no masonry. Navigation is a top bar with a borderless full-width search, right-aligned controls, and a compact notification strip above it. The layout rhythm is: gradient card → repeated plain rows → repeated plain rows. The eye is led by the gradient, then by the alignment of section labels and right-aligned arrow links. Density is compact — 8–16px element gaps, 32px section gaps, no hero illustration to compete with the launch card.

## Agent Prompt Guide

Quick Color Reference
- text: #000000 (Carbon)
- background: #ffffff (Paper)
- border: #e0dfe1 (Silver) for inputs/separators; #c1c0c2 (Mist) for card outlines
- accent: #338fff (Cobalt Pulse) for links, dots, and the blue half of the spectrum
- primary action: #3d3a3e (filled action)
- gradient action: cobalt→violet→ember (90deg) — reserved exclusively for the launch button and the aurora hero card surface

Example Component Prompts
1. **Section Header Row**: NeueHaasUnica 24px weight 500 in #000000, label left-aligned. Right side: a 16px weight 400 Cobalt #338fff arrow link reading 'Tokens →'. Inline before the label: two 8px filled circles (#338fff and #7a33ff) with 6px gap. No background, no border, 32px vertical padding above and below.
2. **Aurora Launch Card**: Full-width card, 1px #c1c0c2 border, 6px radius, 20px padding. Background: aurora gradient (linear-gradient(90deg, rgba(255,31,0,0.3) 0%, rgba(255,128,215,0.3) 50%, rgba(0,121,204,0.3) 100%)) on a white base. Inside: a 24px weight 500 Carbon headline ('Launch your idea'), then a 16px text input (white fill, 1px #e0dfe1 border, 6px radius, 10px vertical / 12px horizontal padding, Ash #a09da1 placeholder), then a row with a graphite #3d3a3e 'Randomize' button (6px radius, 8px 16px padding, white text weight 500) and a spectrum-gradient 'Launch Token' button (6px radius, 8px 16px padding, white text weight 500, gradient: linear-gradient(90deg, #0079cc 0%, #050fa3 27%, #ff1000 59%, #ff1000 100%)) with a leading white arrow icon.
3. **Text Input (Search)**: White background, 1px #e0dfe1 border, 6px radius, 8px 10px padding. Leading 16px magnifier icon in #a09da1. Placeholder 'Search Common' in 14px weight 400 Ash. Focus state: border shifts to #000000 — no glow, no ring. Stretchable to container width.
4. **Top Nav Row**: White background, 1px bottom border in #e0dfe1, 16px vertical padding. Left: brand mark. Center: search input at full available width. Right cluster at 16px gap: 'About' text link in Carbon 14px, icon buttons (1px #a09da1 border, 6px radius, 6px padding, 16px icon in #282729), 'Create account' ghost button (transparent, 1px #000000 border, 6px radius, 8px 16px padding, 14px Carbon), 'Sign in' graphite button (#3d3a3e, 6px radius, 8px 16px padding, 14px weight 500 white text).
5. **Icon Button**: Transparent background, 1px border in #a09da1, 6px radius, 6px internal padding, 16px line icon (1.5px stroke) in #282729. Hover: border and icon shift to #000000. The stroke is the button; there is no filled state.

6. **Notification Banner**: Full-width strip with the aurora gradient at 30% opacity, 4px vertical padding, 14px weight 400 Carbon text centered, with a compact spectrum-gradient claim button (6px radius, 4px 10px padding, 13px white text) on the right and a 14px Carbon × close icon at the far right.

## Color Rationing Rules

The system is monochrome by default. Color is a resource, not a baseline.
- **Carbon & Paper** handle all structural and textural work (text, hairlines, fills, surfaces).
- **Silver, Mist, Ash, Obsidian** form the neutral scale — borders get lighter as emphasis drops, from #000000 structural lines down to #e0dfe1 input edges.
- **Cobalt and Ultraviolet** appear only as 1px strokes, 8px filled dots, and link text. They never fill large surfaces.
- **The spectrum gradient** (cobalt→violet→ember) is the system's only high-chroma fill. It appears in exactly two places: the aurora launch card surface and the spectrum launch button. No other element may use it.
- **The aurora wash** (30% opacity) is the soft form of the spectrum — used only for the launch card and the notification banner background.

## Similar Brands

- **Farcaster** — Same near-monochrome canvas with a single vivid accent per surface — the launch experience uses gradient where everything else is grayscale
- **Mirror.xyz** — Compact type, 6px radii, editorial ledger layout — both treat the page as a structured list rather than a marketing surface
- **Paragraph** — Newsletter-native crypto publishing with the same restrained palette and gradient-reserved-for-ceremony approach
- **Paragraph.xyz** — Identical type-system discipline (NeueHaasUnica or close substitute, tabular figures, 6px radius, hairline borders) and the same compact rhythm of header-plus-list rows
- **Tally** — Same hairline-bordered cards on a white canvas with chromatic dots and arrows as the only color punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon: #000000;
  --color-paper: #ffffff;
  --color-fog: #f0eff0;
  --color-silver: #e0dfe1;
  --color-mist: #c1c0c2;
  --color-ash: #a09da1;
  --color-obsidian: #282729;
  --color-onyx: #141315;
  --color-graphite: #3d3a3e;
  --color-cobalt-pulse: #338fff;
  --color-ultraviolet: #7a33ff;
  --color-spectrum-bridge: #0079cc;
  --gradient-spectrum-bridge: linear-gradient(90deg, #0079cc 0%, #050fa3 27%, #ff1000 59%, #ff1000 100%);
  --color-aurora-wash: #ff80d7;
  --gradient-aurora-wash: linear-gradient(90deg, rgba(255, 31, 0, 0.3) 0%, rgba(255, 128, 215, 0.3) 50%, rgba(0, 121, 204, 0.3) 100%);

  /* Typography — Font Families */
  --font-neuehaasunica: 'NeueHaasUnica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka: 'Silka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: 0.24px;
  --text-heading: 28px;
  --leading-heading: 1.17;
  --tracking-heading: 0.56px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.64px;
  --text-display: 36px;
  --leading-display: 1;
  --tracking-display: 0.72px;

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
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 32px;
  --card-padding: 16px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 80px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-icons: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-subtle: rgba(40, 39, 41, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-body-wash: #f0eff0;
  --surface-card: #ffffff;
  --surface-launch-card: #ff80d7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon: #000000;
  --color-paper: #ffffff;
  --color-fog: #f0eff0;
  --color-silver: #e0dfe1;
  --color-mist: #c1c0c2;
  --color-ash: #a09da1;
  --color-obsidian: #282729;
  --color-onyx: #141315;
  --color-graphite: #3d3a3e;
  --color-cobalt-pulse: #338fff;
  --color-ultraviolet: #7a33ff;
  --color-spectrum-bridge: #0079cc;
  --color-aurora-wash: #ff80d7;

  /* Typography */
  --font-neuehaasunica: 'NeueHaasUnica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-silka: 'Silka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: 0.24px;
  --text-heading: 28px;
  --leading-heading: 1.17;
  --tracking-heading: 0.56px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.64px;
  --text-display: 36px;
  --leading-display: 1;
  --tracking-display: 0.72px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 80px;

  /* Shadows */
  --shadow-subtle: rgba(40, 39, 41, 0.05) 0px 1px 2px 0px;
}
```
