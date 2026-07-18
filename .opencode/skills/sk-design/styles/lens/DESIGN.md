# Lens — Style Reference
> mint signal on white paper — a single teal CTA floating in a sea of quiet graphite and pale gray.

**Theme:** light

Lens Protocol reads as a quiet developer platform: white paper background, a single cloud-black logo mark, and one mint-teal accent that powers every interactive surface. The system is overwhelmingly achromatic — graphite type on white with a pale neutral mid-gray border palette — so the teal CTA feels switched on rather than decorative. Pill-shaped controls (50px radius) dominate over square cards (16px), creating a soft, rounded interaction language. Feature cards use faint pastels (peach, mint, lavender, periwinkle) as backdrops for small monochrome icons, giving each capability its own colored tile without ever breaking the achromatic system. Typography pairs Saans (a humanist display sans with ss01 alternates) for headings and Inter for utility text, with both using tight negative tracking that makes the type feel engineered rather than editorial.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Mint Signal | `#00caa0` | `--color-mint-signal` | Primary CTA fill, active nav indicator, link accent on dark — vivid teal against white creates the only chromatic punctuation in the system |
| Graphite | `#2c2d30` | `--color-graphite` | Primary text, heading strokes, icon fills, button borders — the near-black workhorse, kept slightly warm to avoid a cold digital feel |
| Carbon Black | `#211d1d` | `--color-carbon-black` | Body text at high contrast, deep surface text — warmer alternative to Graphite for long-form copy |
| Slate Mid | `#808183` | `--color-slate-mid` | Secondary text, helper copy, muted borders — sits between Graphite and Silver for tertiary hierarchy |
| Silver | `#afafaf` | `--color-silver` | Hairline borders, dividers, disabled states, icon outlines — the workhorse neutral border, freq=808 makes it the most-used color in the system |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surface, input field, filled-on-accent button text |
| Peach Wash | `#ffe4d6` | `--color-peach-wash` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Lavender Wash | `#e8e0ff` | `--color-lavender-wash` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Mint Wash | `#d4f5e8` | `--color-mint-wash` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Periwinkle Wash | `#dde7f7` | `--color-periwinkle-wash` | Supporting palette color for small decorative accents when the core palette needs contrast. |

## Tokens — Typography

### Saans — Primary display and heading face. Custom humanist sans with the ss01 stylistic set active across the entire site. Used at 46px for hero headlines (lineHeight 1.20), 28px for section titles, 26px for card headings, and 16–21px for UI labels. The positive +0.015em tracking on display sizes is an anti-convention — most crypto brands tighten display, but Saans loosens it, giving headlines a slightly architectural, blueprint-like cadence. · `--font-saans`
- **Substitute:** Inter (close geometric alternative) or General Sans
- **Weights:** 400, 500, 600
- **Sizes:** 16px, 21px, 26px, 28px, 46px
- **Line height:** 1.20, 1.35, 1.40
- **Letter spacing:** 0.015em (positive — the only positive tracking in the system, reserved for display)
- **OpenType features:** `"ss01" on`
- **Role:** Primary display and heading face. Custom humanist sans with the ss01 stylistic set active across the entire site. Used at 46px for hero headlines (lineHeight 1.20), 28px for section titles, 26px for card headings, and 16–21px for UI labels. The positive +0.015em tracking on display sizes is an anti-convention — most crypto brands tighten display, but Saans loosens it, giving headlines a slightly architectural, blueprint-like cadence.

### Inter — Secondary body and UI face. Handles all long-form copy, table cells, nav links, button text, and form labels. The cv11 alternates and the aggressive negative tracking on larger sizes make Inter feel custom-tuned for the protocol's data-dense areas. The 0.88 lineHeight on certain 14–15px contexts suggests inline icon+label rows. · `--font-inter`
- **Substitute:** System default Inter
- **Weights:** 400, 500
- **Sizes:** 14px, 15px, 16px, 18px, 20px
- **Line height:** 0.88, 1.10, 1.20, 1.29, 1.40, 1.43, 1.45
- **Letter spacing:** -0.025em to -0.006em (tight negative tracking scales with size: -0.025em at 20px, -0.006em at 14px)
- **OpenType features:** `"cv11" on`
- **Role:** Secondary body and UI face. Handles all long-form copy, table cells, nav links, button text, and form labels. The cv11 alternates and the aggressive negative tracking on larger sizes make Inter feel custom-tuned for the protocol's data-dense areas. The 0.88 lineHeight on certain 14–15px contexts suggests inline icon+label rows.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.006px | `--text-caption` |
| body | 16px | 1.4 | -0.015px | `--text-body` |
| subheading | 18px | 1.29 | -0.017px | `--text-subheading` |
| heading-sm | 20px | 1.4 | -0.022px | `--text-heading-sm` |
| heading | 26px | 1.35 | 0.015px | `--text-heading` |
| heading-lg | 28px | 1.2 | 0.015px | `--text-heading-lg` |
| display | 46px | 1.2 | 0.015px | `--text-display` |

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
| 104 | 104px | `--spacing-104` |
| 152 | 152px | `--spacing-152` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 16px |
| links | 28px |
| small | 4px |
| buttons | 50px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `color(display-p3 0.172549 0.176471 0.188235 / 0.02) 0px 0...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Pill Primary Button
**Role:** Main CTA

Filled mint pill: background #00caa0, text #ffffff, 50px border-radius, 16px vertical × 24px horizontal padding, Saans 16px weight 500, includes trailing arrow icon (↗). Used for the single high-intent action per view — 'Create Account', 'Start Building'.

### Pill Ghost Button
**Role:** Secondary CTA

Outlined pill: background #ffffff, 1px border #2c2d30 or #afafaf at 5% opacity, text #2c2d30, 50px border-radius, 16px × 24px padding, Saans 16px weight 500. Used for 'Developer Docs' and other secondary actions.

### Top Nav Bar
**Role:** Global navigation

White background, 64–72px height, 8px radius on hover states. Left: cloud logo + 'Lens' wordmark in Graphite. Center-left: 'News', 'FAQs', 'Developers' (with dropdown chevron) in Inter 16px weight 500. Right: 'Bridge' (icon + label) then the Pill Primary Button. All separators invisible, balanced on whitespace.

### Hero Section
**Role:** Above-the-fold introduction

Full-width white canvas, centered stack. Cloud logo (Graphite, ~80px). Display headline Saans 46px weight 400 Graphite, letter-spacing +0.015em, lineHeight 1.20. Subheadline Inter 21px weight 400 in Slate Mid. Two-button row: Pill Ghost ('Developer Docs') + Pill Primary ('Start Building'). Optional faint radial gradient or contour lines in the background — near-imperceptible.

### Feature Card — Pastel
**Role:** Capability highlight tile

Three-column grid card, 16px border-radius, 24px–32px padding. Background is one of the four pastel washes (Peach, Mint, Lavender, Periwinkle). Small monochrome Graphite icon (~32px) centered in a white circular badge. Heading Saans 21px weight 500, body Inter 15px in Slate Mid. Card has no border — the pastel fill is the surface.

### Integration Feature Card
**Role:** Two-column capability card

2×2 grid in a 2-column layout. White card with 1px #afafaf border at 5% opacity, 16px radius, 32px padding. Left column: circular badge with Graphite icon on a faint pastel wash. Right column: heading Saans 21px weight 500 Graphite, body Inter 16px weight 400 Slate Mid. Used for the 'Integrate Lens' section.

### Node Diagram Card
**Role:** Process flow visualization

White card with dashed border (1px dashed #afafaf). Contains 4 circular node badges connected by faint lines, each with a Graphite icon and label below in Inter 14px. The four nodes (Explore, Earn, Social, Transact, Publish) form a cross/plus pattern.

### Icon-Lead List Item
**Role:** Feature explanation row

Horizontal row: small Graphite icon (24px) + heading Saans 16px weight 500 Graphite + descriptive body Inter 15px weight 400 Slate Mid. No card chrome — sits directly on white. Used in 'Your users will love it' section.

### Dashed Section Divider
**Role:** Visual section separator

Full-width 1px dashed line in #afafaf at low opacity. Separates major content bands (e.g., hero → All-in-One, Integrate → node diagram). Creates a printed-blueprint rhythm.

### Nav Dropdown Trigger
**Role:** Expandable nav item

Inter 16px weight 500 Graphite label with trailing chevron (▾). Hover state shows a subtle background fill. The 'Developers' nav item uses this pattern.

## Do's and Don'ts

### Do
- Use #00caa0 only for the single primary action per view — never as a decorative accent, icon fill, or text color.
- Default every button to 50px border-radius and every card to 16px border-radius; the pill/square split is the system's strongest visual signal.
- Pair Saans (display) with Inter (body) — never use Inter for headings above 20px or Saans for body copy below 18px.
- Reserve the four pastel washes for feature card backgrounds only; never apply them to buttons, text, or page backgrounds.
- Use 1px dashed #afafaf dividers to separate content bands — not solid lines, not extra whitespace alone.
- Keep page background pure #ffffff and let Graphite (#2c2d30) carry all text weight; do not introduce new dark surfaces.
- Apply Saans ss01 and Inter cv11 font features globally; both faces are tuned for these alternates and look generic without them.

### Don't
- Do not use the teal #00caa0 for borders, icons, or hover states — its only job is filled-button background.
- Do not add box-shadow beyond the 1px border-shadow (`rgba(0,0,0,0.05) 0 0 0 1px`); the system has no elevation, only hairline separation.
- Do not use square buttons or sharp-edged cards — the pill language is signature and any radius under 16px reads as a system break.
- Do not introduce additional accent hues (purple, orange, etc.) outside the four pastel washes; the system is 99% achromatic.
- Do not center-align long-form body copy; the system uses left-aligned stacked text for everything below hero headlines.
- Do not use positive letter-spacing on Inter; negative tracking is part of its identity, and loosening it flattens the type.
- Do not place cards directly on a colored section background without a white surface layer — pastels are card-only, never page-level.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#ffffff` | Global page background — the only base surface, used at all times |
| 1 | Card Surface | `#ffffff` | Feature and integration cards sit on the same white as the canvas, differentiated by 1px border or pastel backdrop |
| 2 | Pastel Tile | `#ffe4d6 / #d4f5e8 / #e8e0ff / #dde7f7` | Soft color tiles that float inside cards as icon containers or feature backdrops |

## Elevation

- **Buttons, nav items, interactive surfaces:** `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px`

## Imagery

The site avoids photography entirely. The only visual elements are: (1) a single cloud-shape brand mark used at hero scale, (2) small monochrome Graphite icons inside white circular badges or pastel wash containers, and (3) a faint contour-line background pattern behind the hero that resembles a topographic map. All capability illustrations are abstract diagrams (node-and-connector flows) rather than product screenshots. The visual density is very low — imagery occupies under 10% of the page area; type and whitespace carry the design.

## Layout

Max-width 1200px centered container. The hero is a centered single-column stack (logo → headline → sub → two buttons). Below the fold, content alternates between 3-column pastel card grids and 2-column white integration cards. Section separators are dashed hairlines, not background color changes — the entire page is white with periodic pastel insets. Navigation is a thin top bar (no sticky behavior visible). Vertical rhythm is generous: ~80px between major bands, ~48px between sub-sections, 16px between elements within a section.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2c2d30 (Graphite)
- background: #ffffff (Paper White)
- border: #afafaf (Silver) at 5% opacity
- accent: #00caa0 (Mint Signal) — buttons only
- card pastel backdrops: #ffe4d6 / #d4f5e8 / #e8e0ff / #dde7f7
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Hero section*: white #ffffff background. Centered cloud logo (~80px, #2c2d30). Headline 'Build SocialFi with Lens' at 46px Saans weight 400 #2c2d30, letter-spacing +0.015em, line-height 1.20. Subheadline at 21px Inter weight 400 #808183, line-height 1.35. Two buttons side by side: ghost pill 'Developer Docs' (#ffffff bg, 1px #2c2d30 border, 50px radius, 16px×24px padding) and filled pill 'Start Building' (#00caa0 bg, #ffffff text, 50px radius, Saans 16px weight 500, trailing ↗ arrow).

2. *Pastel feature card*: 16px border-radius, 32px padding, background #ffe4d6. Center a 48px white circle containing a 24px Graphite icon. Below, heading at 21px Saans weight 500 #2c2d30, body at 15px Inter weight 400 #808183.

3. *Integration card (2-column)*: white bg, 1px #afafaf border at 5% opacity (or `0 0 0 1px rgba(0,0,0,0.05)`), 16px radius, 32px padding. Left: 56px circle on #d4f5e8 with 24px Graphite icon. Right column: heading Saans 21px weight 500 #2c2d30, body Inter 16px weight 400 #808183.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

5. *Dashed section divider*: full-width 1px dashed line in #afafaf, 48px vertical margin above and below.

## Similar Brands

- **Optimism** — Same white-canvas + single accent color + pill CTA approach, though Optimism uses red where Lens uses mint
- **Aave** — Developer-protocol aesthetic with achromatic body and one chromatic action color, pill-shaped buttons, generous whitespace
- **Mirror.xyz** — Minimal Web3 publishing platform with white background, centered hero, and pastel-tinted feature cards
- **Uniswap** — Same restraint: near-monochrome UI with a single brand-pink accent and pill navigation controls

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-mint-signal: #00caa0;
  --color-graphite: #2c2d30;
  --color-carbon-black: #211d1d;
  --color-slate-mid: #808183;
  --color-silver: #afafaf;
  --color-paper-white: #ffffff;
  --color-peach-wash: #ffe4d6;
  --color-lavender-wash: #e8e0ff;
  --color-mint-wash: #d4f5e8;
  --color-periwinkle-wash: #dde7f7;

  /* Typography — Font Families */
  --font-saans: 'Saans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.006px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.015px;
  --text-subheading: 18px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.017px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.022px;
  --text-heading: 26px;
  --leading-heading: 1.35;
  --tracking-heading: 0.015px;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.015px;
  --text-display: 46px;
  --leading-display: 1.2;
  --tracking-display: 0.015px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-104: 104px;
  --spacing-152: 152px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 16px;
  --radius-links: 28px;
  --radius-small: 4px;
  --radius-buttons: 50px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-2: color(display-p3 0.172549 0.176471 0.188235 / 0.02) 0px 0px 0px 0px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-pastel-tile: #ffe4d6 / #d4f5e8 / #e8e0ff / #dde7f7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-mint-signal: #00caa0;
  --color-graphite: #2c2d30;
  --color-carbon-black: #211d1d;
  --color-slate-mid: #808183;
  --color-silver: #afafaf;
  --color-paper-white: #ffffff;
  --color-peach-wash: #ffe4d6;
  --color-lavender-wash: #e8e0ff;
  --color-mint-wash: #d4f5e8;
  --color-periwinkle-wash: #dde7f7;

  /* Typography */
  --font-saans: 'Saans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.006px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.015px;
  --text-subheading: 18px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.017px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.022px;
  --text-heading: 26px;
  --leading-heading: 1.35;
  --tracking-heading: 0.015px;
  --text-heading-lg: 28px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.015px;
  --text-display: 46px;
  --leading-display: 1.2;
  --tracking-display: 0.015px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-104: 104px;
  --spacing-152: 152px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-2: color(display-p3 0.172549 0.176471 0.188235 / 0.02) 0px 0px 0px 0px;
}
```
