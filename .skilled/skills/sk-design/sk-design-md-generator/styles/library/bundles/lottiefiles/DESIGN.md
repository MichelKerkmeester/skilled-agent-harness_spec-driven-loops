# LottieFiles — Style Reference
> Bright motion studio with teal accent

**Theme:** light

LottieFiles operates as a playful motion marketplace: a near-white canvas with confident near-black headlines, soft warm-gray surfaces, and a single signature teal that marks every primary action. Typography pairs Inter for utility and DM Sans for display, with aggressive negative letter-spacing at large sizes that pulls characters into tight, poster-like compositions. The system is built on generous rounded corners (16px–24px dominate) with minimal elevation, letting animated content and illustrations carry visual weight rather than chrome or shadows. Color is used sparingly — teal for action, near-black for text, warm gray for surfaces, and a curated handful of pastel cards (yellow, mint, blush) as categorical accents. The result feels like a well-organized creative studio: quiet structural chrome that recedes so motion can lead.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lottie Teal | `#019d91` | `--color-lottie-teal` | Teal action color for filled buttons, selected navigation states, and focused conversion moments. |
| Ink | `#09090b` | `--color-ink` | Primary text, headings, dark card surfaces, footer background, icon strokes — near-black with a barely-perceptible cool cast |
| Charcoal | `#18181b` | `--color-charcoal` | Dark card backgrounds, elevated dark surfaces, strong icon strokes, secondary dark UI blocks |
| Slate 700 | `#27272a` | `--color-slate-700` | Dark muted surfaces and inverse muted backgrounds |
| Steel | `#71717b` | `--color-steel` | Muted body text, secondary copy, icon fills, helper labels — sits between the primary ink and lighter grays |
| Fog | `#9f9fa9` | `--color-fog` | Subtle text, tertiary metadata, low-priority descriptions |
| Cloud | `#e4e4e7` | `--color-cloud` | Hairline borders, input outlines, subtle dividers between UI sections |
| Mist | `#f2f2f3` | `--color-mist` | Largest-volume border color across the UI; subtle separators, input borders, form outlines |
| Warm Gray | `#f4f4f5` | `--color-warm-gray` | Page canvas and soft card surfaces — the dominant background tone beneath white |
| Paper | `#ffffff` | `--color-paper` | Pure white surfaces: raised cards, button fills, content containers on top of warm-gray canvas |
| Sunshine | `#f0b100` | `--color-sunshine` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Mint Wash | `#b7ffe7` | `--color-mint-wash` | Soft decorative fill in illustration/illustration-adjacent graphics |
| Mint Pop | `#61f7cf` | `--color-mint-pop` | Bright decorative fill used in hero illustration characters and supporting graphics |
| Ember | `#ff6900` | `--color-ember` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### DM Sans — Display and heading family. Used for hero headlines (48–96px, weight 500), section headings (24–32px, weight 500), and large body (20px, weight 400). Letter-spacing tightens aggressively at large sizes — -0.0500em at 96px pulls characters into a compressed, poster-like composition that feels editorial rather than utilitarian. The medium weight (500) is the headline default, avoiding the heavy 700-800 convention used by most SaaS sites. · `--font-dm-sans`
- **Substitute:** Sora, Bricolage Grotesque, or Plus Jakarta Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 18, 20, 24, 32, 48, 64, 96
- **Line height:** 1.04–1.56
- **Letter spacing:** -0.0500em at 96px, -0.0400em at 64px/48px, -0.0300em at 32px, -0.0100em at 24px and below
- **Role:** Display and heading family. Used for hero headlines (48–96px, weight 500), section headings (24–32px, weight 500), and large body (20px, weight 400). Letter-spacing tightens aggressively at large sizes — -0.0500em at 96px pulls characters into a compressed, poster-like composition that feels editorial rather than utilitarian. The medium weight (500) is the headline default, avoiding the heavy 700-800 convention used by most SaaS sites.

### Inter — Utility and body family. Owns all body copy (16px), navigation (14px medium), buttons (14px medium), small labels (10–12px medium), and supporting icons. Consistent -0.0100em letter-spacing keeps it visually aligned to DM Sans at smaller sizes. Two-weight discipline (regular and medium only) keeps the interface feeling light and fast. · `--font-inter`
- **Substitute:** system-ui, -apple-system, or Manrope
- **Weights:** 400, 500
- **Sizes:** 10, 12, 14, 16, 18, 24, 32
- **Line height:** 1.10–1.71
- **Letter spacing:** -0.0100em across all sizes
- **Role:** Utility and body family. Owns all body copy (16px), navigation (14px medium), buttons (14px medium), small labels (10–12px medium), and supporting icons. Consistent -0.0100em letter-spacing keeps it visually aligned to DM Sans at smaller sizes. Two-weight discipline (regular and medium only) keeps the interface feeling light and fast.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| body-lg | 20px | 1.4 | -0.2px | `--text-body-lg` |
| subheading | 24px | 1.12 | -0.24px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.96px | `--text-heading-sm` |
| heading | 48px | 1.15 | -1.92px | `--text-heading` |
| heading-lg | 64px | 1.15 | -2.56px | `--text-heading-lg` |
| display | 96px | 1.04 | -4.8px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| inputs | 8px |
| buttons | 8px |
| hero-panels | 48px |
| feature-cards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Teal Button
**Role:** Main call-to-action — sign-up, start, explore

Fill #019d91, white text (#ffffff), Inter 14px weight 500, padding 8px 16px, border-radius 8px, no border. Used for 'Get started for free', 'Sign up', 'Explore All Animations'.

### Outline Button
**Role:** Secondary action — contact, learn more

Fill #ffffff, text #09090b, 1px border #e4e4e7, Inter 14px weight 500, padding 8px 16px, border-radius 8px. Used for 'Get in touch', 'Log in'.

### Ghost Button
**Role:** Tertiary or nav-adjacent action

Transparent fill, text inherits context (often #09090b or #71717b), no border, border-radius 0–6px, padding 4px 24px. Used for inline text-style actions and toolbar items.

### Search Field
**Role:** Animation search input in header and hero

White fill, 1px border #e4e4e7, border-radius 6–8px, padding 8px 16px, Inter 14px with ⌘K hint. Icon button on the right edge for submit.

### Language Toggle
**Role:** Locale selector in header

Pill-shaped control with transparent fill, hairline border, Inter 14px, and a chevron. 9999px radius or 6px depending on context.

### Feature Tile
**Role:** Compact 4-column feature highlight with icon

Off-white tile (#f4f4f5 or white), 16px radius, 24px padding, small colored icon block (yellow/pink/teal/dark-blue square) + bold label + muted helper line. No shadow.

### Brand Case-Study Card
**Role:** Featured customer animation showcase

Full-bleed art card at 16–24px radius, contains a brand's creative artwork (no chrome). Used in the horizontal brand carousel.

### Animation Preview Tile
**Role:** Lottie animation grid item

White card on #f4f4f5 grid background, 16px radius, no shadow, transparent inner surface so the animation sits on the page. Arranged in 5-column grid.

### Dark Feature Card
**Role:** Inverted card for emphasis sections

Fill #18181b or #09090b, 16px radius, 24px padding, white text. Used for 'Your motion' and footer-adjacent feature blocks.

### Hero Headline
**Role:** Page-top display headline

DM Sans 48–64px weight 500, color #09090b, letter-spacing -0.0400em. Sits left-aligned against the warm-gray canvas, paired with a colorful character illustration cluster on the right.

### Trust Logo Strip
**Role:** Social proof band beneath hero

Centered label in #71717b above a row of desaturated brand logos (Google, Disney, Nike, Uber, Spotify, Netflix, Microsoft, Airbnb, Amazon, TikTok). Logos rendered in #71717b or #9f9fa9 — muted gray to recede.

### Footer Block
**Role:** Site footer

Fill #09090b, white text, multi-column link grid, logo lockup top-left, social icons right-aligned.

### Search Input (Hero)
**Role:** Large centered search for animation library

White fill, 1px border #e4e4e7, radius 8px, generous 16px vertical padding, Inter 16px placeholder. Wider variant than header search.

### Navigation Bar
**Role:** Top-level site navigation

White background, logo left, link clusters center, search + lang + auth actions right. Inter 14px weight 500 for nav links, 16px gap between groups, no visible border but subtle separation via background.

## Do's and Don'ts

### Do
- Use #019d91 fill + #ffffff text for every primary action button (Get started, Sign up, Explore, See all).
- Apply border-radius 8px to buttons and inputs, 16px to standard cards, 24px to feature/hero panels, 48px to oversized dark hero panels.
- Headlines 32px and above must use DM Sans weight 500 with the matching negative letter-spacing: -0.0300em at 32px, -0.0400em at 48–64px, -0.0500em at 96px.
- Body, navigation, buttons, and small UI copy use Inter only — never mix DM Sans into utility text below 24px.
- Set page background to #f4f4f5 and place raised white cards (#ffffff) on top with 24px or 32px padding.
- Use 1px solid #e4e4e7 or #f2f2f3 as the only border treatment — never thicker than 1px on standard UI.
- Place colorful illustrations and animation thumbnails on the warm-gray canvas with no card chrome — let the artwork be the visual, not a wrapper.

### Don't
- Never use #000000 pure black as a card or surface fill — use #09090b or #18181b instead so surfaces feel ink-toned, not harsh.
- Never apply weight 700 or 800 to headlines — the system uses weight 500 even at 96px display sizes.
- Never use a drop shadow on cards — the elevation language is built from background contrast and rounded corners, not shadows.
- Never combine #019d91 with bold gradients, glassmorphism, or neon glow — the teal must read as a flat, confident fill.
- Never use #ff6900 (ember) for decoration or branding — it is reserved for warning/attention states.
- Never put body copy below 14px — captions stop at 12px and labels at 10px, and always use weight 500 for non-body sizes under 16px.
- Never break the spacing rhythm: gaps inside components are 4–8px, component-internal padding is 16–24px, between sections is 80px.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Gray Canvas | `#f4f4f5` | Base page background, the largest surface tone beneath all content |
| 1 | Paper | `#ffffff` | Raised cards, primary buttons, content containers on warm-gray canvas |
| 2 | Soft Highlight Wash | `#fff8e5` | Subtle warm-tinted surfaces for category tiles and decorative panels |
| 3 | Charcoal Dark | `#18181b` | Dark-mode card blocks and contrast sections that invert the page |
| 4 | Ink Dark | `#09090b` | Deepest surface for footer and high-contrast feature panels |

## Elevation

- **Buttons and inputs:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`

## Imagery

The visual language is animation- and illustration-first. Hero illustrations are flat, colorful vector character clusters with rounded organic shapes — faces, stars, robots, blobs — in saturated pastels (mint, orange, pink, teal, yellow) against the warm-gray canvas. Lottie animation thumbnails fill the library grid as full-bleed tile content (no card wrappers), each one a self-contained mini-scene. Brand case-study cards are full-bleed creative artwork from customers (Walmart smileys, Washington Post graphics, Canva birthday cards, CNN Create cityscapes). Photography is absent — the site replaces it entirely with motion graphics and illustration. Icons are mono-color filled glyphs, often small colored square backgrounds (yellow, pink, dark-blue, dark-green) behind simple line icons in feature tiles.

## Layout

Max-width 1200px centered container. Hero is a 2-column split: left-aligned oversized headline + subtext + dual CTAs, right-aligned illustration cluster. Below hero is a 4-column feature tile row, then a centered trust-strip with logo band, then a horizontal-scroll brand case-study carousel (full-bleed cards, partially visible peek on the right edge). Library section shifts to a centered stack: large centered headline, subtext, large search field, then a 5-column animation grid with rounded tiles. Footer is full-bleed dark (#09090b) with multi-column link grid. Vertical rhythm is consistent — sections separated by ~80px gaps, section headings centered above their content blocks, no alternating colored bands (the page stays on warm-gray canvas throughout, except for the dark footer).

## Agent Prompt Guide

Quick Color Reference:
- Primary text: #09090b
- Page background: #f4f4f5
- Card surface: #ffffff
- Border: #e4e4e7
- Accent: #019d91 (teal)
- primary action: #019d91 (filled action)

Example Component Prompts:
1. Create a Primary Action Button: #019d91 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. Create a feature tile row (4 columns): off-white tiles (#ffffff), 16px radius, 24px padding. Each tile has a 32px colored icon block (yellow #f0b100, pink #ff8a80, teal #61f7cf, dark-blue #111827) with a mono icon, then an Inter 14px weight 500 label in #09090b, then Inter 14px weight 400 helper text in #71717b. 16px gap between tiles.
3. Create an animation preview grid: 5 columns on warm-gray (#f4f4f5) canvas, each tile is a white (#ffffff) card with 16px radius, no shadow, transparent inner area where the Lottie animation plays. 16px gap between columns and rows.
4. Create a search input (large): white fill (#ffffff), 1px border #e4e4e7, 8px radius, 16px vertical padding, Inter 16px placeholder text in #71717b, small search icon on the left, ⌘K hint chip on the right.
5. Create a footer: full-bleed #09090b fill, white (#ffffff) text, Inter 14px weight 500 for column headers and Inter 14px weight 400 for links in #71717b. Multi-column grid (4–5 columns), logo top-left, social icons right-aligned, 80px top padding and 80px bottom padding.

## Radius Scale

The radius scale follows a deliberate progression: 8px for buttons and inputs (functional, slightly soft), 16px for standard cards and animation tiles (the most-used radius, gives content rooms), 24px for hero panels and feature cards (soft, container-like), 48px for oversized dark feature panels (dramatic, billboard-like). The 8–16–24–48 cadence skips 12px and 20px as deliberate choice — UI never sits between two adjacent radius steps, it snaps to a named level.

## Animation & Motion Personality

Motion is the product, so the UI's own transitions stay restrained: 150ms ease-out for hover and color states, 300ms ease-in-out for layout changes, 100ms for instant micro-feedback (button presses). The site uses Lottie-format animations throughout — every preview tile is a live Lottie, not a static image — so the design system intentionally avoids heavy CSS transitions, decorative loaders, or skeleton screens that would compete with the animation content. Transition easings: cubic-bezier(0.4, 0, 0.2, 1) for layout shifts, ease for color/border hovers.

## Similar Brands

- **Giphy** — Same marketplace-for-motion approach: white canvas, centered search, dense grid of full-bleed animated content tiles with minimal card chrome
- **Figma** — Same restrained neutral palette with a single saturated brand accent, generous rounded corners on cards, and oversized editorial headlines with tight negative tracking
- **Notion** — Same DM Sans / Inter pairing for display vs utility, same warm-gray canvas with white raised surfaces, same minimal-shadow flat elevation philosophy
- **Stripe** — Same oversized display headlines with aggressive negative letter-spacing at 48–96px and a quiet monochrome interface that lets featured content lead
- **Dribbble** — Same illustration-first hero, same trust-logo strip beneath hero, same warm-gray canvas with colorful artwork tiles — both feel like galleries more than product pages

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lottie-teal: #019d91;
  --color-ink: #09090b;
  --color-charcoal: #18181b;
  --color-slate-700: #27272a;
  --color-steel: #71717b;
  --color-fog: #9f9fa9;
  --color-cloud: #e4e4e7;
  --color-mist: #f2f2f3;
  --color-warm-gray: #f4f4f5;
  --color-paper: #ffffff;
  --color-sunshine: #f0b100;
  --color-mint-wash: #b7ffe7;
  --color-mint-pop: #61f7cf;
  --color-ember: #ff6900;

  /* Typography — Font Families */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.2px;
  --text-subheading: 24px;
  --leading-subheading: 1.12;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.15;
  --tracking-heading: -1.92px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -2.56px;
  --text-display: 96px;
  --leading-display: 1.04;
  --tracking-display: -4.8px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 48px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-hero-panels: 48px;
  --radius-feature-cards: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-warm-gray-canvas: #f4f4f5;
  --surface-paper: #ffffff;
  --surface-soft-highlight-wash: #fff8e5;
  --surface-charcoal-dark: #18181b;
  --surface-ink-dark: #09090b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lottie-teal: #019d91;
  --color-ink: #09090b;
  --color-charcoal: #18181b;
  --color-slate-700: #27272a;
  --color-steel: #71717b;
  --color-fog: #9f9fa9;
  --color-cloud: #e4e4e7;
  --color-mist: #f2f2f3;
  --color-warm-gray: #f4f4f5;
  --color-paper: #ffffff;
  --color-sunshine: #f0b100;
  --color-mint-wash: #b7ffe7;
  --color-mint-pop: #61f7cf;
  --color-ember: #ff6900;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.2px;
  --text-subheading: 24px;
  --leading-subheading: 1.12;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.15;
  --tracking-heading: -1.92px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -2.56px;
  --text-display: 96px;
  --leading-display: 1.04;
  --tracking-display: -4.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 48px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
```
