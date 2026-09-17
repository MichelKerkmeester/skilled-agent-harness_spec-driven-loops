# Tatem — Style Reference
> calm twilight command center — a hushed dark workspace washed in a single soft blue-to-charcoal gradient, with one warm sunburst as the only color punctuation.

**Theme:** dark

Tatem operates in a hushed, dark twilight palette where nearly the entire interface is rendered in neutral grays and near-black surfaces, creating a calm, focused environment for an email client. The hero breaks the monochrome with a single soft blue-gray gradient that fades to black, framing a large left-aligned headline and a gently rotated app preview. Typography is exclusively Inter at weight 400, relying on size and letter-spacing to establish hierarchy rather than weight contrast. Components stay flat and minimal: ghost buttons with thin borders, 6px-radius cards, keyboard shortcut chips, and inbox rows that use spacing and subtle gray separators rather than borders or shadows. The visual signature is restraint — one warm sunburst icon is the only chromatic punctuation, and the rest of the system communicates through negative space, neutral gradients, and whisper-quiet text colors.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| White | `#ffffff` | `--color-white` | Primary text, logo mark, ghost button borders on dark — the highest-contrast color, used sparingly for headlines and active labels |
| Ash Gray | `#c2c2c2` | `--color-ash-gray` | Secondary headings, emphasis text on dark surfaces |
| Mist | `#b5b5b5` | `--color-mist` | Muted body text, sub-labels, metadata |
| Smoke | `#919191` | `--color-smoke` | Tertiary text, icon strokes, inactive nav items, secondary button text |
| Graphite | `#606060` | `--color-graphite` | Mid-tone surface, card backgrounds, chip fills, subtle dividers |
| Obsidian | `#3b3b3b` | `--color-obsidian` | Base canvas, section background, primary surface — the dominant dark that anchors all content sections |
| Dusk Blue | `linear-gradient(180deg, #5a7694 0%, #759da5 50%, #abb7b5 100%)` | `--color-dusk-blue` | Hero gradient anchor — the start of the soft blue-to-gray wash that defines the first viewport and makes the brand feel atmospheric rather than corporate |
| Dusk Highlight | `linear-gradient(180deg, #5a7694 0%, #759da5 50%, #abb7b5 100%)` | `--color-dusk-highlight` | Gradient terminus — the pale gray-green endpoint of the hero wash that dissolves the page into the dark sections below |

## Tokens — Typography

### Inter — The sole typeface across all roles: captions, body, navigation, and display. The deliberate choice of a single weight (400) forces hierarchy through size and spacing alone, creating a quiet, anti-conventional rhythm where headlines feel like magnified body text rather than bold declarations. Substitute: Inter (Google Fonts). · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 13px, 14px, 16px, 20px, 40px
- **Line height:** 1.20, 1.43, 1.50
- **Letter spacing:** -0.007em uniform across all sizes (approximately -0.28px at 40px, -0.09px at 13px)
- **Role:** The sole typeface across all roles: captions, body, navigation, and display. The deliberate choice of a single weight (400) forces hierarchy through size and spacing alone, creating a quiet, anti-conventional rhythm where headlines feel like magnified body text rather than bold declarations. Substitute: Inter (Google Fonts).

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.09px | `--text-caption` |
| body | 16px | 1.5 | -0.11px | `--text-body` |
| subheading | 20px | 1.5 | -0.14px | `--text-subheading` |
| display | 40px | 1.2 | -0.28px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 140 | 140px | `--spacing-140` |
| 200 | 200px | `--spacing-200` |
| 232 | 232px | `--spacing-232` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| chips | 6px |
| buttons | 6px |
| heroElements | 16px |
| largeSurfaces | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Ghost CTA Button
**Role:** Primary action in the hero and nav

Transparent fill, 1px solid #ffffff border, #ffffff text, 6px radius, Inter 16px weight 400, padding 10px 24px. Hovers by inverting to white fill with dark text. The absence of a filled chromatic button is intentional — the hero is gradient, the rest is dark, and a filled button would break the system.

### Top Navigation Bar
**Role:** Persistent site navigation

Full-width transparent on hero gradient, switches to #3b3b3b on scroll. Left: sunburst logo mark + 'tatem' wordmark in #ffffff. Right: three text links (Pricing, Changelog, Sign in) in #919191 plus a 'Get started' ghost button. Top-center: small #919191 announcement line. Height ~64px, no shadow, no border-bottom.

### Inbox Row
**Role:** Email list item in product preview

No background fill (sits directly on #606060 card), padding 12px horizontal, 8px vertical. Left: circular avatar placeholder + sender name in #ffffff weight 400 14px. Center: subject in #ffffff, preview in #919191. Right: date in #919191, 13px. Rows separated by 1px #606060 horizontal divider, not card borders.

### Keyboard Shortcut Display
**Role:** Visual showing keyboard-first interaction

#3b3b3b base card with 16px radius, padding 32px. Contains a flat-rendered keyboard at #606060 fill with individual keys as subtle raised rectangles. Highlighted keys (K, ⌘) rendered in #919191 or #b5b5b5 to stand out. Below: 'Command menu' label in a 6px-radius pill, #606060 background, #ffffff text 14px.

### Section Heading Block
**Role:** Content section header pattern

Left-aligned, max-width ~560px. Eyebrow label in #919191 13px uppercase tracking (e.g., 'SPLIT INBOX', 'SHORTCUTS'). Headline in #ffffff Inter 40px weight 400 line-height 1.2. Body paragraph in #919191 Inter 16px line-height 1.5. No dividers, no accent lines.

### App Preview Card
**Role:** Hero product screenshot treatment

The inbox app is shown as a slightly rotated (8-12°) rectangular capture, no border, no shadow, no radius. Sits on the hero gradient bleeding off the right edge of the viewport. The rotation and edge-bleed make the product feel alive and three-dimensional without decorative chrome.

### Logo Mark
**Role:** Brand identity

Small sunburst/burst icon (radial lines emanating from a center) in #ffffff, paired with lowercase 'tatem' wordmark in Inter 400 16px #ffffff. The only truly decorative mark in the system; the warm/light treatment of the burst is the one spot where the system allows itself personality.

### Top Announcement Bar
**Role:** Pre-navigation social proof strip

Centered single line of text: 'Join 10,000+ rethinking their email.' in #919191 13px. Sits above the nav, no background, no border. Ultra-minimal — a whisper of social proof, not a banner.

### Content Section Container
**Role:** Repeating section pattern for features

Full-width #3b3b3b background, content centered in 1200px max-width with 24px horizontal padding. 96px vertical padding top and bottom. Contains a Section Heading Block followed by an optional visual (card or illustration) at 16px radius on a #3b3b3b nested surface.

## Do's and Don'ts

### Do
- Use Inter weight 400 for everything — do not introduce bold or semibold weights; hierarchy comes from size alone
- Keep all radii at 6px for interactive elements (buttons, chips, tags) and 10-16px for content cards
- Anchor all content sections on the #3b3b3b dark canvas; reserve the blue-gray gradient exclusively for the hero
- Pair #ffffff headlines with #919191 body text for the signature high-contrast-yet-quiet hierarchy
- Use 1px solid #606060 hairlines for separators and #606060 backgrounds for elevated cards — never use shadows for elevation
- Default section spacing to 96px top/bottom with content centered in a 1200px max-width
- Use the 13px caption / 16px body / 40px display trio as the only typographic jumps needed

### Don't
- Do not use a filled chromatic button — the system relies on ghost outlines, never solid brand-colored CTAs
- Do not introduce shadows or drop-effects; elevation is communicated through surface tone shifts only
- Do not use more than one chromatic element on a single screen — the sunburst logo, the hero gradient, that's it
- Do not break the single-weight rule by adding 600 or 700 weights to Inter; if a heading feels too soft, increase its size instead
- Do not use border-radius larger than 16px anywhere; the system is angular-tight, not pillowy
- Do not use color for status or state in the main interface; rely on opacity shifts (ffffff vs 919191) for active/inactive
- Do not place the brand gradient behind content other than the hero; repeating it in sections will dilute its atmospheric impact

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#3b3b3b` | Base page background, section backdrop |
| 2 | Card | `#606060` | Inbox rows, keyboard display container, elevated content blocks |
| 3 | Subtle | `#919191` | Chip fills, muted indicators, secondary surface tone |

## Elevation

The system deliberately avoids box-shadows entirely. Elevation is communicated through surface tone: #3b3b3b canvas → #606060 cards/chips → #919191 subtle highlights. The absence of shadow keeps the interface feeling flat, modern, and weightless — closer to a printed interface than a skeuomorphic app. The only depth cue is the hero gradient itself, which creates a sense of atmospheric distance rather than physical elevation.

## Imagery

Almost no traditional imagery. The hero features a single angled product screenshot (the inbox app itself) bleeding off the right edge, rendered without border, shadow, or rounding — the screenshot IS the hero art. Other sections use flat-rendered UI mockups (keyboard, inbox rows) at the same dark surface tones as the page, so they blend into the environment rather than floating above it. Icons are minimal line-style strokes in #919191. No photography, no illustration, no abstract graphics — the entire visual language is product-surface-as-art.

## Layout

Single-column max-width 1200px layout, centered. The hero is the only full-bleed treatment, stretching edge to edge with the blue-gray gradient. Below the hero, every section is a #3b3b3b band with generous 96px vertical padding. The first viewport always contains the hero gradient; subsequent viewports are deep dark with content concentrated in the left half of the max-width container, leaving the right half empty or holding a product visual. Navigation is a thin top bar with no sticky behavior visible — it floats in the gradient in the hero and sits flush at the top of dark sections. The rhythm is slow: one section per viewport, no card grids, no multi-column feature blocks.

## Agent Prompt Guide

Quick Color Reference:
- text primary: #ffffff
- text secondary: #919191
- text muted: #b5b5b5
- background canvas: #3b3b3b
- surface card: #606060
- border / hairline: #606060
- accent: #5a7694 (hero gradient start)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero section: full-bleed linear-gradient from #5a7694 at top through #759da5 to #abb7b5 at bottom. Left-aligned headline in Inter 40px weight 400, color #ffffff, letter-spacing -0.28px. Body text in Inter 16px weight 400, color #919191. Below: a ghost button with 1px solid #ffffff border, #ffffff text, Inter 16px, 6px radius, padding 10px 24px. Right side: a slightly rotated (10°) rectangular product screenshot bleeding off the right viewport edge, no border or shadow.

2. Create a feature section on a #3b3b3b background: 1200px max-width centered, 96px vertical padding. Eyebrow label 'SPLIT INBOX' in Inter 13px weight 400, #919191, uppercase, tracking 0.5px. Headline 'Prioritize what's important.' in Inter 40px weight 400, #ffffff. Body in Inter 16px weight 400, #919191. Below: an inbox list on a #606060 surface with 6px radius, containing rows with #ffffff sender names, #919191 preview text, and 1px solid #3b3b3b row separators.

3. Create a keyboard shortcut display: 16px-radius card on #3b3b3b surface, 32px padding. Flat keyboard rendered in #606060 fill with individual keys as slightly lighter rectangles. One key (K) highlighted in #b5b5b5. Below the keyboard: a pill chip with #606060 background, #ffffff text 'Command menu', Inter 14px, 6px radius, padding 6px 16px.

4. Create a top navigation: transparent background (sits on hero gradient). Left: small white sunburst icon (8 radial lines from center) + 'tatem' wordmark in Inter 16px #ffffff. Right: three text links in Inter 16px #919191 ('Pricing', 'Changelog', 'Sign in'), followed by a ghost button ('Get started') with 1px solid #ffffff border, #ffffff text, 6px radius, padding 10px 24px. Above the nav, centered: a single line of #919191 13px text reading a short social proof message.

## Monochrome Discipline

The Tatem system is defined by what it refuses to add. No bold weights, no chromatic buttons, no shadows, no decorative gradients past the hero, no border-radius above 16px, no photography, no illustration. Every screen should be buildable with: Inter 400 in five sizes, four neutral grays, one dark canvas, one ghost button, and a hero gradient. If a design decision requires introducing a new color, weight, shadow, or radius tier — reconsider the design problem first.

## Similar Brands

- **Linear** — Shares the dark canvas, single-weight typography, ghost outlined buttons, and ultra-minimal navigation pattern
- **Vercel** — Same approach of letting a single hero gradient break an otherwise pure-black monochrome system, with whisper-quiet gray body text
- **Superhuman** — Both are email-productivity brands using dark surfaces, restrained neutrals, and keyboard-centric visual language with flat-rendered UI mockups as section art
- **Raycast** — The keyboard-shortcut visual treatment and 'command menu' pill pattern closely mirror Raycast's product-mockup-as-hero approach

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-white: #ffffff;
  --color-ash-gray: #c2c2c2;
  --color-mist: #b5b5b5;
  --color-smoke: #919191;
  --color-graphite: #606060;
  --color-obsidian: #3b3b3b;
  --color-dusk-blue: #5a7694;
  --gradient-dusk-blue: linear-gradient(180deg, #5a7694 0%, #759da5 50%, #abb7b5 100%);
  --color-dusk-highlight: #abb7b5;
  --gradient-dusk-highlight: linear-gradient(180deg, #5a7694 0%, #759da5 50%, #abb7b5 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.09px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.11px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.14px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: -0.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;

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
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-140: 140px;
  --spacing-200: 200px;
  --spacing-232: 232px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-chips: 6px;
  --radius-buttons: 6px;
  --radius-heroelements: 16px;
  --radius-largesurfaces: 10px;

  /* Surfaces */
  --surface-canvas: #3b3b3b;
  --surface-card: #606060;
  --surface-subtle: #919191;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-white: #ffffff;
  --color-ash-gray: #c2c2c2;
  --color-mist: #b5b5b5;
  --color-smoke: #919191;
  --color-graphite: #606060;
  --color-obsidian: #3b3b3b;
  --color-dusk-blue: #5a7694;
  --color-dusk-highlight: #abb7b5;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.09px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.11px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.14px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: -0.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-140: 140px;
  --spacing-200: 200px;
  --spacing-232: 232px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
}
```
