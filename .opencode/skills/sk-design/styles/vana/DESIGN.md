# Vana — Style Reference
> Digital constellation map on midnight canvas — a dark protocol interface where electric blue traces the topography of user-owned data across a starfield of ASCII characters.

**Theme:** dark

Vana operates as a dark data-sovereign canvas: near-black surfaces host a vivid electric blue that functions less as decoration and more as signal. The hero's ASCII-art world map is not a graphic but a data texture — character density forms continents, suggesting the protocol maps personal data across the globe. Typography is restrained and geometric (Cofo Sans) with a pixel variant for technical metadata labels, creating tension between human-readable prose and machine-precise notation. Buttons are sharp-cornered (2px radius) and minimal, letting the blue carry the action language. The palette is deliberately narrow: one brand blue, two violet tints, and a stack of near-black surfaces, with green and pink appearing only as rare chromatic punctuation on outlined controls and decorative markers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Indigo | `#0000ff` | `--color-electric-indigo` | Primary CTA fill, brand text, decorative ASCII pattern — the signal color that makes actions switched on against the dark canvas |
| Cobalt Pulse | `#4141fc` | `--color-cobalt-pulse` | Button borders, secondary accent — slightly lighter than Electric Indigo for outlined controls and hover states |
| Periwinkle Veil | `#8b8bfe` | `--color-periwinkle-veil` | Outlined action border, light violet accent — ghost button outlines and muted decorative strokes |
| Lime Beacon | `#7fd579` | `--color-lime-beacon` | Rare chromatic punctuation — cursor marker, outlined button variant, location indicator on the data map |
| Orchid Whisper | `#d896ff` | `--color-orchid-whisper` | Rare chromatic punctuation — outlined button variant, decorative icon accent |
| Midnight Void | `#0d0d0d` | `--color-midnight-void` | Page background — the base canvas everything floats on |
| Carbon Panel | `#161616` | `--color-carbon-panel` | Card and panel surfaces — one step above the canvas for contained content blocks |
| Graphite Lift | `#252525` | `--color-graphite-lift` | Dark elevated surface for cards, headers, and contained panels. Do not promote it to the primary CTA color |
| Steel Hover | `#3b3b3b` | `--color-steel-hover` | Highest surface elevation, filled neutral button background — the brightest the neutrals get |
| Pure Signal | `#ffffff` | `--color-pure-signal` | Primary headings, button text, high-contrast text — the loudest text voice |
| Soft Mist | `#eaeaea` | `--color-soft-mist` | Body text, secondary copy, subtle fill — quieter than Pure Signal for paragraphs and descriptions |
| Charcoal | `#333333` | `--color-charcoal` | Borders in light sections, link underlines — visible only against the white band |
| Warm Filament | `#b8ad97` | `--color-warm-filament` | Decorative SVG stroke and fill — warm-toned accent for abstract graphics and illustration details |

## Tokens — Typography

### Cofo Sans — Primary typeface across all UI — headings at 64px weight 700, body at 14–16px weight 400, nav links at 13–14px. The tight -0.02em tracking at 64px creates a compressed, technical headline feel; most crypto/data brands use looser tracking at this size. · `--font-cofo-sans`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 13px, 14px, 16px, 24px, 64px
- **Line height:** 1.00–1.25
- **Letter spacing:** -0.02em at 64px, -0.015em at 24px, -0.02em at 13–16px
- **Role:** Primary typeface across all UI — headings at 64px weight 700, body at 14–16px weight 400, nav links at 13–14px. The tight -0.02em tracking at 64px creates a compressed, technical headline feel; most crypto/data brands use looser tracking at this size.

### Cofo Sans Pixel — Technical metadata labels — nav dot-prefixed links (BUILD, ABOUT, COMMUNITY, TOOLS), small uppercase tags, and machine-precise annotations. The pixel variant creates a monospace-adjacent rhythm that signals 'system metadata' vs 'human prose'. · `--font-cofo-sans-pixel`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 10px, 13px, 14px
- **Line height:** 1.00–1.25
- **Letter spacing:** -0.02em to -0.002em
- **Role:** Technical metadata labels — nav dot-prefixed links (BUILD, ABOUT, COMMUNITY, TOOLS), small uppercase tags, and machine-precise annotations. The pixel variant creates a monospace-adjacent rhythm that signals 'system metadata' vs 'human prose'.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.25 | -0.2px | `--text-caption` |
| body-lg | 16px | 1.5 | -0.32px | `--text-body-lg` |
| subheading | 24px | 1.15 | -0.36px | `--text-subheading` |
| display | 64px | 1.1 | -1.28px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 2px |
| large | 16px |
| pills | 1440px |
| buttons | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Navigation Bar
**Role:** Top-level site navigation

Horizontal bar, full-width, #0d0d0d background with bottom hairline border in #ffffff (1px). Logo 'vana' left-aligned in Cofo Sans weight 700 at 16px. Nav links right-aligned in Cofo Sans Pixel at 10–13px uppercase with small dot prefix indicators. Vertical padding 22px, horizontal padding 24px.

### Filled Primary Button
**Role:** Primary CTA (GET STARTED)

#0000ff background, #ffffff text in Cofo Sans weight 700 at 13–14px uppercase, letter-spacing -0.02em. Padding 11px 20px. Border-radius 2px. No shadow, no gradient. The flat rectangular shape with 2px radius is deliberately sharp — it reads as a protocol command, not a marketing button.

### Outlined Ghost Button
**Role:** Secondary action (OUR VISION, START BUILDING)

Transparent background, 1px border in #8b8bfe or #ffffff, #ffffff text in Cofo Sans weight 700 at 13–14px uppercase. Padding 11px 20px. Border-radius 2px. Some variants include a leading arrow icon (→). The outlined form lets the blue do the work elsewhere while this button stays neutral.

### Chromatic Outlined Button
**Role:** Accent action variant

Transparent background, 1px border in #7fd579 (lime) or #d896ff (orchid), matching-color text. Same padding and 2px radius as other buttons. These rare variants add chromatic punctuation — used sparingly to draw the eye to specific protocol actions.

### Pill Button
**Role:** Rounded action variant

Border-radius 1440px (fully rounded). Same color tokens as filled or outlined variants. Used for tag-like actions or compact controls where the pill shape signals a different interaction type.

### Feature Card
**Role:** Four-column feature display (Connect, Move, Control, Build)

#161616 background with 1px border in #ffffff (12% opacity) or subtle #333333. Padding 24–32px. Border-radius 2px. Icon centered top (24–32px, #ffffff or accent color, thin stroke). Title in Cofo Sans weight 700 at 16–24px, #ffffff. Description in Cofo Sans weight 400 at 14px, #eaeaea. No shadow — separation comes from the surface stack step, not elevation.

### Hero Section
**Role:** Full-bleed landing hero

Full-viewport dark background with ASCII-art world map pattern rendered in #0000ff at low opacity across the full width. Headline at 64px Cofo Sans weight 700, #ffffff, letter-spacing -1.28px, positioned left-of-center. Subtext at 16px weight 400, #eaeaea. CTA pair (filled + outlined) below. A small #7fd579 cursor marker sits on the map as an interactive location indicator.

### Section Header
**Role:** Centered section title block

Title at 24–64px Cofo Sans weight 700, #ffffff, centered. Subtitle at 16px weight 400, #eaeaea, centered, max-width ~640px. Vertical spacing 48px above and below. This header pattern repeats across feature and content sections.

### Pixel Nav Link
**Role:** Navigation item with dot indicator

Cofo Sans Pixel at 10–13px uppercase, #ffffff. Prefixed with a small dot (•) in the same color. Tight letter-spacing. The pixel font + dot prefix is the signature navigation micro-style — it reads as protocol metadata, not a website menu.

### Split Content Section
**Role:** Two-column text + visual layout

Light or dark background band. Left column: heading in #0000ff or #ffffff at 24–40px, body text at 14–16px, outlined CTA button. Right column: full-bleed 3D render or illustration. Used for protocol explainer sections.

### Band Divider
**Role:** Full-width colored separator band

Solid #0000ff or #4141fc background, full-bleed, 80–120px height. Contains left-aligned text in #ffffff at 14–16px. Functions as a visual pause between major content sections.

## Do's and Don'ts

### Do
- Use #0000ff as the sole filled CTA color — no other blue should ever fill a button background
- Set border-radius to 2px on all rectangular buttons and cards; use 1440px only for pill-shaped controls
- Set the page background to #0d0d0d and step surfaces to #161616 → #252525 → #3b3b3b for elevation — never use shadows for separation
- Use Cofo Sans weight 700 for all headings and button text; reserve weight 400 for body copy and descriptions
- Use Cofo Sans Pixel with a dot prefix (•) for nav links, tags, and technical metadata labels
- Apply letter-spacing -0.02em at 64px and -0.015em at 24px — the tight tracking is a signature choice, not a default
- Keep the chromatic palette narrow: if you need a second color, use it as a 1px border or icon stroke, never as a background fill

### Don't
- Don't use shadows or drop effects for card elevation — the surface stack (#0d0d0d → #161616 → #252525) is the elevation system
- Don't introduce new blues outside the #0000ff / #4141fc / #8b8bfe family — the brand blue is singular
- Don't use #7fd579 or #d896ff for backgrounds or large fills — these are punctuation colors, only for thin borders and small icons
- Don't set border-radius above 2px on cards or buttons (except pill shapes at 1440px) — sharp corners are intentional
- Don't use #ffffff for body copy — reserve it for headings and button text; use #eaeaea for paragraphs
- Don't render the ASCII-art pattern at full opacity — it should sit at 10–20% opacity to read as texture, not content
- Don't mix the pixel and non-pixel fonts in the same text block — use Cofo Sans Pixel only for standalone labels and nav items

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Midnight Void | `#0d0d0d` | Page base background — the canvas everything sits on |
| 2 | Carbon Panel | `#161616` | Cards, feature panels, content containers — one step up from the canvas |
| 3 | Graphite Lift | `#252525` | Elevated cards, hover states, interactive panels — second elevation step |
| 4 | Steel Hover | `#3b3b3b` | Highest neutral surface — filled neutral buttons, active states |

## Elevation

This design deliberately avoids drop shadows. Separation is achieved entirely through the surface stack: #0d0d0d → #161616 → #252525 → #3b3b3b, with 1px hairline borders in #ffffff (10–20% opacity) for additional delineation. The flat treatment reinforces the protocol/command-line aesthetic — surfaces feel like terminal panels, not floating cards. No element should appear to 'lift off' the page; everything sits flush in the dark stack.

## Imagery

The visual language is dominated by the ASCII-art world map texture in the hero — character density forms continental outlines in #0000ff at low opacity, suggesting a data topology rather than a literal map. A small #7fd579 cursor marker sits on the map as an interactive location indicator. The secondary visual is a 3D-rendered cloud/bubble structure in #0000ff and #4141fc with geometric dotted surfaces, used in split-layout sections. Abstract graphics favor geometric, computational forms (grids, interconnected nodes, stacked cubes) over organic or photographic imagery. Icons are thin-stroke line illustrations in #ffffff, centered above card titles. No photography, no lifestyle imagery — the visual system is pure data-art, not marketing photography.

## Layout

The page model is centered max-width (1200px) for content blocks, with full-bleed dark backgrounds extending to the viewport edges. The hero is full-bleed with the ASCII map spanning the full width, headline left-aligned over the texture. Subsequent sections use centered section headers (title + subtitle stack) followed by 4-column feature card grids. The layout rhythm is: dark hero → dark features section → light split-content band → blue divider band. Navigation is a minimal top bar (logo left, 4 links right) with a hairline bottom border. Cards are arranged in equal-width columns with 16–20px gaps. The overall density is comfortable — generous vertical breathing room between sections (48px+) with content blocks that feel measured and unhurried.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (headings, buttons), #eaeaea (body)
- background: #0d0d0d (page), #161616 (cards), #252525 (elevated)
- border: #ffffff at 10–20% opacity (hairlines), #333333 (light sections)
- accent: #0000ff (brand), #4141fc (secondary blue), #8b8bfe (light violet)
- primary action: #3b3b3b (filled action)

**3 Example Component Prompts:**
1. Create a Primary Action Button: #3b3b3b background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. Create a feature card on a dark page: #161616 background, 1px border in #ffffff at 15% opacity, 2px border-radius, 24px padding. Centered thin-stroke line icon in #ffffff at 32px. Title in Cofo Sans weight 700, #ffffff, 16px. Description in Cofo Sans weight 400, #eaeaea, 14px.
3. Create a nav bar: full-width #0d0d0d background, 1px bottom border in #ffffff at 10% opacity, padding 22px 24px. Logo 'vana' left in Cofo Sans weight 700, #ffffff, 16px. Four right-aligned links in Cofo Sans Pixel, 10–13px, uppercase, #ffffff, each prefixed with a small dot (•).

## Signature Elements

Three elements define Vana's visual identity and should be preserved across all pages:

1. **ASCII-art world map hero texture** — Character density in #0000ff at 10–20% opacity forming continental outlines. This is the single most recognizable visual element. It should appear on the primary landing page and any major section that introduces a geographic or network concept.

2. **Pixel-font nav links with dot prefixes** — Every navigation item uses Cofo Sans Pixel with a leading • dot. This micro-style signals 'protocol metadata' and distinguishes the nav from a standard website menu.

3. **2px sharp-cornered buttons** — All rectangular buttons use 2px border-radius. This is deliberately sharp — it reads as a system command, not a marketing affordance. Combined with the flat surface stack (no shadows), buttons feel like terminal inputs rather than web CTAs.

## Color Usage Hierarchy

The palette operates on strict frequency rules:

- **#0000ff** is the only color that fills large areas (hero pattern, CTA buttons, band dividers). It appears in body text and borders frequently but never as a page background.
- **#4141fc and #8b8bfe** are the blue family for outlined controls and secondary accents. They should never fill large surfaces.
- **#7fd579 and #d896ff** appear in a combined total of fewer than 10 instances across the site. They are chromatic exclamation points — use them only for 1px borders, small icons, or the cursor marker. Never as backgrounds.
- **Neutrals form a strict stack** — #0d0d0d (canvas) → #161616 (card) → #252525 (elevated) → #3b3b3b (highest). Each step is +21–37 luminance. No element should skip a step.

## Similar Brands

- **Protocol Labs** — Same dark-canvas + single electric blue accent approach for data protocol branding, with a similar monospace-adjacent technical label treatment in navigation
- **The Graph** — Dark developer-focused UI with a vivid blue as the sole chromatic accent, sharp-cornered components, and a restrained neutral surface stack
- **Helium** — Dark hero with a textural background (map/network imagery) and a single brand blue, targeting a crypto/infrastructure audience with minimal marketing chrome
- **Ocean Protocol** — Data sovereignty narrative with a dark interface, electric blue accent, and geometric/abstract 3D renders as supporting imagery
- **Ceramic (ComposeDB)** — Dark devtool aesthetic with sharp 2px-radius components, a narrow blue palette, and technical metadata labels in a monospace variant

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-indigo: #0000ff;
  --color-cobalt-pulse: #4141fc;
  --color-periwinkle-veil: #8b8bfe;
  --color-lime-beacon: #7fd579;
  --color-orchid-whisper: #d896ff;
  --color-midnight-void: #0d0d0d;
  --color-carbon-panel: #161616;
  --color-graphite-lift: #252525;
  --color-steel-hover: #3b3b3b;
  --color-pure-signal: #ffffff;
  --color-soft-mist: #eaeaea;
  --color-charcoal: #333333;
  --color-warm-filament: #b8ad97;

  /* Typography — Font Families */
  --font-cofo-sans: 'Cofo Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cofo-sans-pixel: 'Cofo Sans Pixel', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.25;
  --tracking-caption: -0.2px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.36px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-cards: 2px;
  --radius-large: 16px;
  --radius-pills: 1440px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-midnight-void: #0d0d0d;
  --surface-carbon-panel: #161616;
  --surface-graphite-lift: #252525;
  --surface-steel-hover: #3b3b3b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-indigo: #0000ff;
  --color-cobalt-pulse: #4141fc;
  --color-periwinkle-veil: #8b8bfe;
  --color-lime-beacon: #7fd579;
  --color-orchid-whisper: #d896ff;
  --color-midnight-void: #0d0d0d;
  --color-carbon-panel: #161616;
  --color-graphite-lift: #252525;
  --color-steel-hover: #3b3b3b;
  --color-pure-signal: #ffffff;
  --color-soft-mist: #eaeaea;
  --color-charcoal: #333333;
  --color-warm-filament: #b8ad97;

  /* Typography */
  --font-cofo-sans: 'Cofo Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cofo-sans-pixel: 'Cofo Sans Pixel', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.25;
  --tracking-caption: -0.2px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.32px;
  --text-subheading: 24px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.36px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -1.28px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-full: 1440px;
}
```
