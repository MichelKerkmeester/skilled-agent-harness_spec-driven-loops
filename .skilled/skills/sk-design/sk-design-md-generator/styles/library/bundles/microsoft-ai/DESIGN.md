# Microsoft AI — Style Reference
> old library at golden hour

**Theme:** mixed

Microsoft AI reads like a rare-press manuscript bound in linen — warm parchment canvases, deep ink-teal voids, and oversized serif type that treats the page as editorial space rather than product surface. The palette is almost entirely earth-toned: cream, walnut, faded rose, and a single anchoring deep green-black that appears only in the hero, creating a dramatic chiaroscuro between top-of-page and everything below. Typography is the entire personality: a custom transitional serif (Bradford LL) dominates display and body, carrying italic for emphasis and aggressive negative tracking as sizes grow; a monospace (Red Hat Mono) handles the few UI affordances — tabs, labels, search, accessibility toggle. There are no saturated brand colors, no gradient buttons, no filled CTAs with hue. Action lives in text, in arrow glyphs, and in the giant pill radius that makes every control look like a wax seal on an envelope. The design intentionally avoids shadow and elevation — surfaces are flat planes of warm paper stacked against each other, separated by generous breathing room and the occasional peach wash.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#fef9ed` | `--color-parchment` | Page canvas, card surface, light text on dark — the foundational warm cream that carries 80% of the interface |
| Bone | `#f5f0e4` | `--color-bone` | Secondary surface, muted panels, badge backgrounds, tab track — one shade deeper than the canvas for subtle layering without shadow |
| Walnut | `#5d524b` | `--color-walnut` | Primary text, body copy, nav links, icons, borders — warm dark brown replaces black, keeping the system on the earth-tone spectrum |
| Cedar | `#72675b` | `--color-cedar` | Muted secondary text, helper copy, inactive nav — mid-tone brown for de-emphasis within the warm scale |
| Linen | `#cec7bc` | `--color-linen` | Hairline borders, input outlines, dividers — warm light gray that reads as thread on the cream canvas |
| Library Ink | `#2e4d4d` | `--color-library-ink` | Hero background, dark section fill — deep desaturated teal-green, the only cool note in the system; creates the dramatic contrast with the warm display type |
| Apricot Wash | `#fbd3be` | `--color-apricot-wash` | Gradient accent, warm highlight band, peachy atmosphere — the only chromatic warmth, used as a wash rather than a fill |
| Faded Rose | `#8c5462` | `--color-faded-rose` | Accent text, italic emphasis, decorative label — muted burgundy that recedes into the warm palette without shouting |
| Slate Lilac | `#666583` | `--color-slate-lilac` | Cool secondary accent for sparse cross-palette moments — muted blue-gray, used sparingly to break the warm monotony |

## Tokens — Typography

### Bradford LL — Primary serif for body, headings, and all display. Custom transitional serif with warm proportions; the italic cut carries the hero word 'Humanist' and functions as the system's expressive voice. Aggressive negative tracking at display sizes (up to -5px at 125px) tightens the wordmark into a sculpted slab. Single weight axis (400-450) keeps the system restrained — hierarchy comes from size and italic, never from bold. · `--font-bradford-ll`
- **Substitute:** Source Serif Pro, Lora, or EB Garamond
- **Weights:** 400, 450
- **Sizes:** 15, 20, 25, 35, 40, 45, 100, 125
- **Line height:** 1.00, 1.13, 1.20, 1.25, 1.40
- **Letter spacing:** -0.0400em at 125px, -0.0300em at 100px, -0.0200em at 45px, -0.0130em at 20-25px, -0.0100em at 15px
- **OpenType features:** `"kern" on`
- **Role:** Primary serif for body, headings, and all display. Custom transitional serif with warm proportions; the italic cut carries the hero word 'Humanist' and functions as the system's expressive voice. Aggressive negative tracking at display sizes (up to -5px at 125px) tightens the wordmark into a sculpted slab. Single weight axis (400-450) keeps the system restrained — hierarchy comes from size and italic, never from bold.

### Red Hat Mono — Monospace for UI chrome — search input, tab labels, badge text, navigation links, the accessibility mode toggle, footer micro-copy. Its mechanical character provides the only structural counterpoint to the flowing serif. Use with positive tracking (0.05-0.10em) for uppercase tag labels to create a printed-typesetter effect. · `--font-red-hat-mono`
- **Substitute:** IBM Plex Mono, JetBrains Mono, or Space Mono
- **Weights:** 400, 450, 500
- **Sizes:** 12, 13, 15, 20
- **Line height:** 1.00, 1.20, 1.25, 1.60
- **Letter spacing:** -0.0170em at 12-15px, -0.0150em at 13px, -0.0130em at 15px, 0.0500em-0.1000em for tracked labels (badges, tag text)
- **OpenType features:** `"kern" on`
- **Role:** Monospace for UI chrome — search input, tab labels, badge text, navigation links, the accessibility mode toggle, footer micro-copy. Its mechanical character provides the only structural counterpoint to the flowing serif. Use with positive tracking (0.05-0.10em) for uppercase tag labels to create a printed-typesetter effect.

### MWF-MDL2 — MWF-MDL2 — detected in extracted data but not described by AI · `--font-mwf-mdl2`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.25
- **Letter spacing:** -0.013
- **OpenType features:** `"kern"`
- **Role:** MWF-MDL2 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.25 | 0.05px | `--text-caption` |
| body | 15px | 1.4 | -0.15px | `--text-body` |
| subheading | 20px | 1.25 | -0.26px | `--text-subheading` |
| heading-sm | 25px | 1.25 | -0.33px | `--text-heading-sm` |
| heading | 35px | 1.2 | — | `--text-heading` |
| heading-lg | 45px | 1.13 | -0.9px | `--text-heading-lg` |
| display | 125px | 1 | -5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 23 | 23px | `--spacing-23` |
| 25 | 25px | `--spacing-25` |
| 41 | 41px | `--spacing-41` |
| 42 | 42px | `--spacing-42` |
| 47 | 47px | `--spacing-47` |
| 50 | 50px | `--spacing-50` |
| 58 | 58px | `--spacing-58` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 65px |
| cards | 25px |
| icons | 4px |
| badges | 4px |
| inputs | 50px |
| buttons | 86px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 12px

## Components

### Masthead Navigation
**Role:** Top-of-page bar over the dark hero canvas

Sits on #2e4d4d background. Left: search field (#fef9ed background, Walnut #5d524b text, 50px radius, 15px Red Hat Mono, search icon prefix). Center: MAI wordmark in Bradford LL 20px 450 #fef9ed. Right: nav links (About, News, Team, Careers) in Red Hat Mono 13px #fef9ed, followed by a 'Playground ↗' link with arrow glyph in same color. The bar has no visible border or background fill — it floats on the hero void with generous horizontal padding.

### Hero Display Headline
**Role:** Full-bleed editorial title

Bradford LL at 125px, weight 400, line-height 1.00, letter-spacing -5px. Rendered in #fef9ed on the #2e4d4d canvas. The first word uses the italic cut ('Humanist') while the second word stays roman ('Superintelligence') — the italic/roman contrast is the hero's only typographic gesture. Centered alignment with 80-120px vertical breathing room above and below.

### Hero Subhead
**Role:** Tagline beneath the display headline

Bradford LL 20px, weight 400, #fef9ed, line-height 1.25, letter-spacing -0.26px. Centered. Sits 24-32px below the display block. Functions as the quiet attribution to the editorial title.

### Editorial Body Block
**Role:** Long-form statement copy in content sections

Bradford LL 25px weight 400, Walnut #5d524b, line-height 1.40, letter-spacing -0.33px. Centered or left-aligned within a max-width ~720px column. No paragraph spacing — use line-height for rhythm. The serif at this size carries gravity without needing bold weight.

### Gradient Atmosphere Band
**Role:** Peachy warm interlude between content sections

Background uses the linear gradient from #fbd3be (top) to #fef9ed (bottom) at 50%-100% stops. Contains a single editorial body block centered in Cedar or Walnut. Full-bleed width, 200-320px tall. Functions as a visual palate cleanser between denser content sections.

### Pill Tab Navigation
**Role:** Product category switcher

Track: #f5f0e4 background, 65px radius, 17px row-gap and padding-top. Active tab: #fef9ed background with no visible border — distinguished from the track purely by the one-step tonal lift. Inactive tabs: transparent background, Walnut text. Labels in Red Hat Mono 15px, weight 450, letter-spacing -0.20px. All four tabs share equal width within the track. No underline, no chevron, no animation indicator.

### Pill Search Input
**Role:** Search field in the masthead

Bradford LL or Red Hat Mono 15px, #5d524b text on #fef9ed background. 50px border-radius (full pill). No visible border — the tonal step from track to fill is sufficient. Magnifying-glass icon prefix in Walnut. Width grows to accommodate query, min-width ~240px.

### Accessibility Mode Toggle
**Role:** Persistent accessibility control, bottom-left

Pill-shaped control, #fef9ed background, 4px radius, fixed position bottom-left. Contains a small toggle switch (OFF state: gray knob left) and the label 'Accessibility Mode' in Red Hat Mono 12px, Walnut text. The toggle is intentionally unobtrusive — it sits over content rather than in a drawer.

### Section Heading (Bradford Display)
**Role:** Large serif title for content sections like 'Core products and experiences'

Bradford LL 100px weight 400, Walnut #5d524b, line-height 1.00, letter-spacing -3px. Centered above the section. This is the display size reused below the hero — the system commits to one monumental scale rather than fragmenting into h1-h6.

### Footer Link List
**Role:** Minimal text-only footer navigation

Red Hat Mono 13px, weight 400, Cedar #72675b, letter-spacing -0.20px. Items separated by space, not pipes or bullets. Sits centered at the bottom of the page on the Parchment canvas with generous top padding (80-96px).

## Do's and Don'ts

### Do
- Use Bradford LL for everything that is meant to be read as editorial content — body, headings, display. Use Red Hat Mono only for UI affordances: tabs, search, labels, toggles, footer.
- Set display type at 100-125px with letter-spacing of -3px to -5px. The aggressive negative tracking is the signature — text at this size with default tracking will look generic.
- Use italic Bradford LL to carry emphasis (the 'Humanist' word in the hero). Do not use bold weight to create emphasis — the system intentionally has no bold axis.
- Separate surfaces with tonal steps in the cream family (#fef9ed → #f5f0e4 → #fbd3be) rather than drop shadows. The palette IS the elevation system.
- Use 86px border-radius for all button and pill controls. This extreme pill is a signature — using 8px or 16px radius on controls will break the wax-seal metaphor.
- Use the Apricot Wash gradient only as a full-bleed atmosphere band, never as a button fill, badge background, or inline accent.
- Keep the Library Ink #2e4d4d surface reserved for the hero and the masthead. Do not introduce dark cards or dark sections lower on the page.

### Don't
- Do not introduce saturated brand colors — no blues, no greens, no reds. The system is 95% earth-toned by design.
- Do not use box-shadow on cards, buttons, or inputs. The elevation philosophy is paper-on-table, not floating material.
- Do not use bold or semibold weights. Bradford LL maxes at 450 and the system relies on size and italic for hierarchy.
- Do not set body type below 15px or above 20px in Bradford LL — the comfortable density band is 15-25px. Use Red Hat Mono for anything smaller.
- Do not use filled CTA buttons with distinct background colors. Action is text + arrow glyph, or text inside a pill control. ACTION_BACKGROUND is intentionally zero across the system.
- Do not place light text on the warm cream sections. Walnut on Parchment is the only light-theme text combination; the system is not designed for inverted content cards below the hero.
- Do not add a traditional header bar with a distinct background fill. The masthead floats on the hero void with no visible chrome.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Library Ink | `#2e4d4d` | Hero void — the deep teal-green stage for the largest display type and the masthead |
| 2 | Parchment | `#fef9ed` | Primary page canvas — warm cream that carries all content sections below the hero |
| 3 | Apricot Wash | `#fbd3be` | Atmospheric gradient surface — peachy band that signals a warm interlude between editorial sections |
| 4 | Bone | `#f5f0e4` | Recessed surface — tab tracks, subtle panels, the track behind pill controls |

## Elevation

This system has no shadows. Surfaces are flat planes of warm color stacked beside each other, with hierarchy delivered through the warm-on-warm tonal step from #fef9ed to #f5f0e4 to #fbd3be. The single dark plane (#2e4d4d) creates the only true elevation contrast in the system, and it does so through color temperature inversion rather than drop shadow. Do not introduce box-shadow on cards, buttons, or inputs — the design language is explicitly paper-on-table, not floating-material.

## Imagery

Imagery is sparse and editorial. Photography appears as single full-width crops — a person mid-gesture on the gradient band, product surfaces in the tabs section — always with generous breathing room and no decorative framing. The peachy gradient bands and the deep teal hero void do most of the atmospheric work, so photographs function as punctuation rather than atmosphere. There are no icons in the traditional UI sense — the only glyphs are the search magnifying glass, the Playground arrow, and the MWF-MDL2 system icon font for Microsoft product marks. No illustrations, no 3D renders, no abstract graphics. The visual language is: warm paper, dark ink, one human photograph per section, no decoration.

## Layout

Page is full-bleed with no constrained max-width on the hero and gradient bands. Content sections center within ~720-1200px. Vertical rhythm is generous — 80-120px between sections, creating a gallery-like scroll where each band feels like turning a page. The hero is a full-viewport dark void with centered monumental type; below it, warm cream sections stack vertically with alternating flat-cream and gradient-peach bands. The products section uses a centered heading + paragraph + pill tab strip + image stack, reading top-to-bottom as a single editorial column. Navigation is minimal: search field left, wordmark center, text links right, no hamburger, no sidebar. The page is not a dashboard — it is a sequence of editorial spreads.

## Agent Prompt Guide

## Quick Color Reference

- text: Walnut #5d524b
- background: Parchment #fef9ed
- border: Linen #cec7bc
- accent: Apricot Wash #fbd3be
- dark surface: Library Ink #2e4d4d
- primary action: no distinct CTA color

## Example Component Prompts

1. **Editorial hero section**: Full-bleed #2e4d4d background. Centered headline: first word in Bradford LL italic 125px weight 400, second word roman 125px weight 400, both #fef9ed, letter-spacing -5px, line-height 1.00. Subheadline 20px Bradford LL #fef9ed, 32px below. 200px vertical padding above and below the type block.

2. **Product tab strip**: Track background #f5f0e4, 65px radius, centered, max-width 900px. Four tab labels (Copilot, Bing, Edge, GroupMe) in Red Hat Mono 15px weight 450, Walnut #5d524b, 20px horizontal padding. Active tab: #fef9ed background filling the full height of the track, no border. Inactive tabs: transparent.

3. **Gradient atmosphere section**: Full-bleed background with linear-gradient(#fbd3be 50%, #fef9ed 100%), 240px tall. Centered body text: Bradford LL 25px weight 400, Walnut #5d524b, line-height 1.40, max-width 720px. No buttons, no images — atmosphere only.

4. **Pill search field**: Background #fef9ed, border-radius 50px, no visible border. Red Hat Mono 15px #5d524b placeholder text 'Search'. Magnifying-glass icon prefix in Walnut, 16px. Min-width 240px, padding 10px 20px. Sits on the Library Ink hero canvas.

5. **Section heading block**: Centered on Parchment #fef9ed canvas. Bradford LL 100px weight 400, Walnut #5d524b, letter-spacing -3px, line-height 1.00. Body paragraph 20px Bradford LL Walnut, max-width 640px, 24px below the heading. 96px section padding top and bottom.

## Similar Brands

- **Stripe** — Same editorial commitment to oversized serif type with aggressive negative tracking, warm monochromatic palette, and a single dark hero moment anchoring a light-content scroll
- **Anthropic** — Same restrained earth-tone palette, custom serif display type, and quiet typographic hierarchy that lets the writing carry the page
- **Linear** — Same commitment to typographic precision, generous vertical rhythm between sections, and a palette that recedes to let structure and type lead
- **Are.na** — Same warm cream paper aesthetic, serif-led hierarchy, and the feeling of curating a quiet editorial space rather than a product interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #fef9ed;
  --color-bone: #f5f0e4;
  --color-walnut: #5d524b;
  --color-cedar: #72675b;
  --color-linen: #cec7bc;
  --color-library-ink: #2e4d4d;
  --color-apricot-wash: #fbd3be;
  --color-faded-rose: #8c5462;
  --color-slate-lilac: #666583;

  /* Typography — Font Families */
  --font-bradford-ll: 'Bradford LL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-red-hat-mono: 'Red Hat Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-mwf-mdl2: 'MWF-MDL2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.05px;
  --text-body: 15px;
  --leading-body: 1.4;
  --tracking-body: -0.15px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.33px;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.9px;
  --text-display: 125px;
  --leading-display: 1;
  --tracking-display: -5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-41: 41px;
  --spacing-42: 42px;
  --spacing-47: 47px;
  --spacing-50: 50px;
  --spacing-58: 58px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4.16667px;
  --radius-md-2: 6.66667px;
  --radius-3xl: 25px;
  --radius-full: 50px;
  --radius-full-2: 65px;
  --radius-full-3: 85.8333px;

  /* Named Radii */
  --radius-tabs: 65px;
  --radius-cards: 25px;
  --radius-icons: 4px;
  --radius-badges: 4px;
  --radius-inputs: 50px;
  --radius-buttons: 86px;

  /* Surfaces */
  --surface-library-ink: #2e4d4d;
  --surface-parchment: #fef9ed;
  --surface-apricot-wash: #fbd3be;
  --surface-bone: #f5f0e4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #fef9ed;
  --color-bone: #f5f0e4;
  --color-walnut: #5d524b;
  --color-cedar: #72675b;
  --color-linen: #cec7bc;
  --color-library-ink: #2e4d4d;
  --color-apricot-wash: #fbd3be;
  --color-faded-rose: #8c5462;
  --color-slate-lilac: #666583;

  /* Typography */
  --font-bradford-ll: 'Bradford LL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-red-hat-mono: 'Red Hat Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-mwf-mdl2: 'MWF-MDL2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.05px;
  --text-body: 15px;
  --leading-body: 1.4;
  --tracking-body: -0.15px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.33px;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.9px;
  --text-display: 125px;
  --leading-display: 1;
  --tracking-display: -5px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-41: 41px;
  --spacing-42: 42px;
  --spacing-47: 47px;
  --spacing-50: 50px;
  --spacing-58: 58px;

  /* Border Radius */
  --radius-md: 4.16667px;
  --radius-md-2: 6.66667px;
  --radius-3xl: 25px;
  --radius-full: 50px;
  --radius-full-2: 65px;
  --radius-full-3: 85.8333px;
}
```
