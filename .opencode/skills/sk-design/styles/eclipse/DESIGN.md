# Eclipse — Style Reference
> Cel-shaded neon comic strip — think Akira signage rendered as a finance terminal.

**Theme:** mixed

Eclipse runs a monochromatic canvas with a single neon-green pulse — the visual grammar is closer to a 90s anime cel than a blockchain dashboard. Headlines use GT Alpina Condensed at hairline weights (100–200), the thinnest possible serif line that still reads as letterforms, paired with Barlow Condensed for compact UI chrome. The single chromatic token (#a1fea0) behaves like a highlighter drawn over an ink-on-paper sketch: borders, button fills, cloud illustrations, and glow halos all share that one vivid green against pure black and white. Surfaces are flat — no shadows, no gradients, no elevation tricks. Buttons are fat pills (25px radius), labels are tracked-out typewriter caps, and illustration carries the atmosphere while the type does the structural work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Eclipse Green | `#a1fea0` | `--color-eclipse-green` | Primary action fill, active nav state, decorative border accents, cloud and glow illustration fills, investor-card spotlight — the only chromatic token in the system, applied sparingly to make each occurrence feel like a marker pen stroke |
| Ink Black | `#000000` | `--color-ink-black` | Body and heading text, hairline borders across cards/badges/buttons, footer rules, outlined button stroke — the dominant neutral that carries all structural lines |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills, nav backgrounds, image backdrop — the base layer everything sits on |

## Tokens — Typography

### Barlow Condensed — UI chrome, nav links, buttons, badges, secondary headlines, marquee strips. Condensed proportions keep horizontal copy tight inside pill buttons and ticker bars. 700 for emphasis, 500 for nav, 400 for body UI. Letter-spacing opens up on small caps labels (0.1–0.2em) and tightens on large display uses (-0.02 to -0.03em). · `--font-barlow-condensed`
- **Substitute:** Barlow Condensed (Google Fonts native)
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 16px, 32px, 44px, 48px, 80px, 96px, 120px, 182px
- **Line height:** 0.83–1.60
- **Letter spacing:** 0.1em to 0.2em for small caps labels, -0.02em to -0.03em for large display
- **Role:** UI chrome, nav links, buttons, badges, secondary headlines, marquee strips. Condensed proportions keep horizontal copy tight inside pill buttons and ticker bars. 700 for emphasis, 500 for nav, 400 for body UI. Letter-spacing opens up on small caps labels (0.1–0.2em) and tightens on large display uses (-0.02 to -0.03em).

### GT Alpina Condensed — Display and hero headlines — the signature voice. Hairline weights 100–200 push the serif into a near-glyph wireframe, making words feel stamped rather than typeset. Letter-spacing tightens as size grows: -0.01em at 24px climbing to -0.06em at the 562px masthead. Substitutes: Cormorant Garamond Condensed Light, EB Garamond 200. · `--font-gt-alpina-condensed`
- **Substitute:** Cormorant Garamond Condensed Light
- **Weights:** 100, 200
- **Sizes:** 24px, 33px, 44px, 46px, 61px, 64px, 88px, 120px, 562px
- **Line height:** 0.80–1.20 (tight, display-driven)
- **Letter spacing:** -0.01em at 24px, -0.03em at 44px, -0.04em at 64px, -0.06em at 88px+
- **Role:** Display and hero headlines — the signature voice. Hairline weights 100–200 push the serif into a near-glyph wireframe, making words feel stamped rather than typeset. Letter-spacing tightens as size grows: -0.01em at 24px climbing to -0.06em at the 562px masthead. Substitutes: Cormorant Garamond Condensed Light, EB Garamond 200.

### Atlas Typewriter — Eyebrow labels, section tags, small body annotations — the 'label maker' voice. Always set in uppercase with 0.2em tracking, functioning as a timestamp or chapter mark. Substitutes: IBM Plex Mono, Space Mono, JetBrains Mono. · `--font-atlas-typewriter`
- **Substitute:** Space Mono
- **Weights:** 400
- **Sizes:** 12px, 16px, 18px
- **Line height:** 1.00–1.60
- **Letter spacing:** 0.2em (consistent across sizes)
- **Role:** Eyebrow labels, section tags, small body annotations — the 'label maker' voice. Always set in uppercase with 0.2em tracking, functioning as a timestamp or chapter mark. Substitutes: IBM Plex Mono, Space Mono, JetBrains Mono.

### math — math — detected in extracted data but not described by AI · `--font-math`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.2
- **Role:** math — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.2px | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.6 | 0.2px | `--text-body` |
| body-lg | 18px | 1.56 | 0.2px | `--text-body-lg` |
| subheading | 32px | 1.2 | — | `--text-subheading` |
| heading-sm | 48px | 1 | -0.03px | `--text-heading-sm` |
| heading | 80px | 0.9 | -0.04px | `--text-heading` |
| heading-lg | 120px | 0.83 | -0.06px | `--text-heading-lg` |
| display | 182px | 0.8 | -0.06px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 25px |
| pills | 100px |
| badges | 25px |
| buttons | 25px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 10-16px

## Components

### Primary Pill Button (Eclipse Green Fill)
**Role:** Main CTA — 'Start Building', 'Build on Eclipse'

Filled #a1fea0 background, Ink Black text. Barlow Condensed 500, 16px, uppercase, 0.1em tracking. Padding 10px 24px. Border 1px solid Ink Black. Radius 25px (pill). No shadow. On hover the background intensifies and the border thickens to 2px.

### Secondary Pill Button (Black Outline)
**Role:** Companion CTA — 'Bridge to Eclipse'

White background, Ink Black text and 1px border. Barlow Condensed 500, 16px, uppercase, 0.1em tracking. Padding 10px 24px. Radius 25px. Trailing arrow icon (→) in Ink Black. Pairs directly beside the primary green button to create a two-step 'softer / louder' hierarchy.

### Top Navigation Bar
**Role:** Site-wide navigation

White background, transparent until scrolled. Left: text nav links in Barlow Condensed 500, 16px, uppercase (ABOUT, BUILDERS, CAREERS, ECOSYSTEM) with caret dropdowns. Center: Eclipse wordmark in Barlow Condensed 700. Right: social icon cluster (Instagram, YouTube, Discord, X) + 100px-radius pill 'Start Building' CTA in Ink Black with Paper White text.

### Hero Display Headline
**Role:** Above-the-fold brand statement

Stacked three-line composition. Line 1 'SOLANA' in GT Alpina Condensed 200, 120–182px, line-height 0.80, -0.06em tracking, Paper White on Ink Black band. Line 2 'ON' in 80px regular, treated as connector. Line 3 'ETHEREUM' mirrors Line 1. Eyebrow 'ECLIPSE IS' in Atlas Typewriter 12px, 0.2em tracking, sits above. Center-aligned. No drop cap, no decoration — the type does the work.

### Section Eyebrow Label
**Role:** Section identifier above headlines

Atlas Typewriter 12px, weight 400, uppercase, 0.2em tracking, Ink Black. Centered. 16px gap to the headline below. Examples: 'ECLIPSE IS', 'BACKED BY', 'ETHEREUM'S FIRST SVM L2'.

### Investor Spotlight Card
**Role:** Backer logo grid item with highlight state

White card, 1px Ink Black border, 25px radius, padding 32px. Serif name (e.g. 'Portal Ventures') in GT Alpina Condensed 100–200, 24–33px, centered. Active state: #a1fea0 fill replaces white, text remains Ink Black, and a soft green glow halo extends ~20px beyond the card edge (a blurred green ellipse behind the card). Inactive state: pure white.

### Full-Bleed Hero Illustration Panel
**Role:** Animated hero visual + video entry point

Ink Black background, Paper White crescent ring (the Eclipse), green cloud illustrations at the base, and an illustrated character/vehicle in the lower third. Centered play button: 80px circle, 1px Paper White border, no fill, with a Paper White triangle icon. No drop shadow on the illustration itself — depth comes from the green cloud layer sitting below the character.

### Marquee Strip
**Role:** Ticker banner of value props

Single horizontal line scrolling edge-to-edge. Barlow Condensed 700, 48–80px, uppercase, Ink Black on Paper White. Items separated by em-dashes and 32px gaps. No background color change — relies on weight and scale for emphasis.

### Footer / Social Footer
**Role:** Bottom anchor and social links

Ink Black background band. White text and icons. Barlow Condensed 500, 16px, uppercase for link lists. Social icons 24px, 1px stroke, Paper White. Generous 80px top padding.

## Do's and Don'ts

### Do
- Use #a1fea0 only for primary CTAs, active states, and the investor-card spotlight — never as a body text color or page background.
- Set display headlines in GT Alpina Condensed at weight 100 or 200, not 300+; the hairline serif is the signature.
- Apply 25px radius to all buttons, badges, and cards, and 100px radius only to the nav-pill CTA.
- Set all eyebrows and section labels in Atlas Typewriter, uppercase, 0.2em tracking, 12px.
- Keep #000000 borders at 1px; thicken to 2px only on hover for buttons.
- Separate sections with at least 80px of vertical space; the design breathes between bands.
- Pair the green primary button directly beside a black-outlined secondary button in every CTA group.

### Don't
- Don't introduce any color other than #a1fea0, #000000, and #ffffff — the system is intentionally bichromatic-plus-one.
- Don't use GT Alpina Condensed above weight 200 — heavier weights break the hairline signature.
- Don't apply drop shadows to cards, buttons, or illustrations; the flat ink-outline language is the look.
- Don't set body copy in the typewriter face; reserve Atlas Typewriter for labels and eyebrows at 12–18px only.
- Don't use 4px, 8px, or 12px radii — all corners should be 25px or 100px.
- Don't place green text on white or white text on green at body sizes; the 1.2:1 contrast fails accessibility.
- Don't break the 1200px page column with edge-bleed content; only the hero and footer break out.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Default page and card canvas |
| 2 | Eclipse Green | `#a1fea0` | Accent wash — investor spotlight, decorative blob, active highlight |
| 3 | Ink Black | `#000000` | Hero and footer inversion band |

## Elevation

- **Investor Card (active glow):** `0 0 40px 10px rgba(161, 254, 160, 0.5)`

## Imagery

Illustration-first, anime/cel-shaded style with thick ink outlines and flat color fills. Characters (bull-headed rider on a motorcycle, turbo car) drawn in a 90s-anime register. Environments mix pure black negative space with flat green cloud forms — no gradients, no atmospheric perspective. Photography is absent; product UI is rendered through illustration and video. Icons are minimal-stroke line icons, mono (Ink Black or Paper White), 1px weight, never filled. Imagery is contained — never full-bleed except inside the hero band — and always sits above a flat color field, never composited onto a photo.

## Layout

Centered max-width 1200px column with full-bleed dark hero at the top. The hero is a pure vertical stack: eyebrow label → stacked display headline → dual pill CTAs → illustration anchored bottom-center. Below the hero, the page alternates between Paper White sections (investor grid, feature blocks) and thin marquee strips, with generous 80px section gaps. The investor grid is a 3-column layout that collapses vertically on narrow screens. Footer is a full-bleed Ink Black band. Navigation is a fixed white top bar with a centered wordmark and right-aligned social + CTA cluster.

## Agent Prompt Guide

Quick Color Reference
- text: #000000
- background: #ffffff
- border: #000000
- accent / decorative: #a1fea0
- primary action: #a1fea0 (filled action)
- inversion band: #000000 background, #ffffff text

Example Component Prompts
1. Hero Display Headline: full-bleed #000000 background. Eyebrow 'ECLIPSE IS' in Atlas Typewriter 12px, 0.2em tracking, #ffffff, centered. Then a three-line stacked headline: 'SOLANA' / 'ON' / 'ETHEREUM' in GT Alpina Condensed weight 200, 120px, line-height 0.80, -0.06em letter-spacing, #ffffff, centered. Below, a 16px gap, then two pill buttons side by side: outlined black 'Bridge to Eclipse →' and filled #a1fea0 'Build on Eclipse', both 25px radius, Barlow Condensed 500, 16px, uppercase, 0.1em tracking, 10px 24px padding, 1px solid #000000 border.

2. Investor Spotlight Card: 1200px max-width parent, 3-column grid. Each card is 32px padded, 1px solid #000000 border, 25px radius, #ffffff background. Name in GT Alpina Condensed 200, 24px, centered. Active card swaps #a1fea0 for the background and gains a 40px green outer glow (#a1fea0 at 50% alpha). Eyebrow 'BACKED BY' / 'GREAT INVESTORS & ANGELS' in Atlas Typewriter 12px above the grid.

3. Marquee Strip: full-bleed band, 80px tall, #ffffff background. Scrolling single-line copy in Barlow Condensed 700, 48px, uppercase, #000000, with em-dash separators and 32px gaps between items (e.g. 'FASTEST LAYER 2 — POWERED BY SVM — ETHEREUM'S FASTEST LAYER 2').

4. Footer Band: full-bleed #000000 background, 80px top padding. Two-column inner layout, 1200px max-width, #ffffff text. Left: Barlow Condensed 500, 16px, uppercase link list. Right: row of social icons at 24px, 1px stroke, #ffffff.

5. Section Header Pair: an Atlas Typewriter 12px eyebrow (#000000, 0.2em tracking, centered) with 16px gap, then a Barlow Condensed 700, 48px heading below — pair this whenever a section needs a title without using the full display serif.

## Similar Brands

- **Berachain** — Same mono-plus-one-accent discipline with a single vivid brand color against black/white, plus pill-shaped CTAs and heavy condensed display type.
- **Blur (blur.io)** — Cel-illustration meets crypto dashboard — flat black/white surfaces with one neon token, tight letter-spaced caps, and pill buttons.
- **Phantom Wallet** — Dark hero inversion over a white site, outlined-vs-filled pill CTA pairing, and a single saturated accent used as spotlight not chrome.
- **Azuki** — Anime/cel-shaded illustration language applied to a tech brand, with ultra-condensed display type and high-contrast ink-on-white surfaces.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-eclipse-green: #a1fea0;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-barlow-condensed: 'Barlow Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-alpina-condensed: 'GT Alpina Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlas-typewriter: 'Atlas Typewriter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-math: 'math', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.2px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --tracking-body-lg: 0.2px;
  --text-subheading: 32px;
  --leading-subheading: 1.2;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.03px;
  --text-heading: 80px;
  --leading-heading: 0.9;
  --tracking-heading: -0.04px;
  --text-heading-lg: 120px;
  --leading-heading-lg: 0.83;
  --tracking-heading-lg: -0.06px;
  --text-display: 182px;
  --leading-display: 0.8;
  --tracking-display: -0.06px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-3xl: 25px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 25px;
  --radius-pills: 100px;
  --radius-badges: 25px;
  --radius-buttons: 25px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-eclipse-green: #a1fea0;
  --surface-ink-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-eclipse-green: #a1fea0;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-barlow-condensed: 'Barlow Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-alpina-condensed: 'GT Alpina Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlas-typewriter: 'Atlas Typewriter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-math: 'math', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.2px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --tracking-body-lg: 0.2px;
  --text-subheading: 32px;
  --leading-subheading: 1.2;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.03px;
  --text-heading: 80px;
  --leading-heading: 0.9;
  --tracking-heading: -0.04px;
  --text-heading-lg: 120px;
  --leading-heading-lg: 0.83;
  --tracking-heading-lg: -0.06px;
  --text-display: 182px;
  --leading-display: 0.8;
  --tracking-display: -0.06px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-3xl: 25px;
  --radius-full: 100px;
}
```
