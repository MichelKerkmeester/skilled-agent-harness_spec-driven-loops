# Allfeat — Style Reference
> Backstage monitor at midnight — one teal stage light cutting through warm cream type on charcoal glass.

**Theme:** dark

Allfeat is a dark-mode music infrastructure platform that uses a warm cream-on-charcoal palette as its resting state, then ignites the canvas with a teal radial wash for heroes and a coral-red gradient for emotional punctuation. The system is built on a single typeface (TASA Orbiter) in three restrained weights, with display sizes pulled tight via -0.02em tracking so headlines read as confident blocks rather than airy declarations. Geometry splits sharply: anything interactive is a full pill (900px), anything containing content is a 12px-radius card with an inset hairline border in #383835 — no floating shadows, no glass, no blur. Color is rationed: teal is the only fill that means 'do this', coral is the only color that means 'feel something', and every other surface stays in the warm-gray neutral family. The result feels like a concert venue's backstage monitor — dark, functional, with one stage light cutting through.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Stage | `#151515` | `--color-charcoal-stage` | Page canvas, primary surface, all dark backgrounds — the base layer every other color sits on |
| Warm Cream | `#fffbeb` | `--color-warm-cream` | Primary text, nav links, heading copy, hairline borders on dark surfaces — never pure white, always slightly buttered |
| Card Edge | `#383835` | `--color-card-edge` | Inset 1px card borders, card ambient shadow, subtle separator lines on elevated surfaces |
| Mute Cream | `#b8b8b8` | `--color-mute-cream` | Secondary body text, subdued descriptions, muted helper copy |
| Ash Gray | `#a6a6a6` | `--color-ash-gray` | Subdued heading text, list separators, inactive link borders |
| Bronze Veil | `#504f4a` | `--color-bronze-veil` | Badge borders, card hairline accents, low-emphasis outline treatments |
| Signal Teal | `#00b18c` | `--color-signal-teal` | Teal action color for filled buttons, selected navigation states, and focused conversion moments. |
| Ember Coral | `#ff4a5f` | `--color-ember-coral` | Red action color for filled buttons, selected navigation states, and focused conversion moments |

## Tokens — Typography

### TASA Orbiter — Single typeface across the entire system. Weight 600 for hero and section headlines, weight 500 for subheadings and emphasized body runs, weight 400 for body and metadata. The tight -0.02em tracking on display sizes (54-56px) collapses the headline into a confident slab; the 0.02em loosening on badge/eyebrow text (13-14px) makes labels feel like printed marks. · `--font-tasa-orbiter`
- **Substitute:** Inter, Manrope, or any geometric humanist sans at matching weights
- **Weights:** 400, 500, 600
- **Sizes:** 13px, 14px, 16px, 18px, 19px, 20px, 24px, 25px, 40px, 54px, 56px
- **Line height:** 0.95–1.20
- **Letter spacing:** -0.02em on display/headings; 0.02em on small caps and labels
- **Role:** Single typeface across the entire system. Weight 600 for hero and section headlines, weight 500 for subheadings and emphasized body runs, weight 400 for body and metadata. The tight -0.02em tracking on display sizes (54-56px) collapses the headline into a confident slab; the 0.02em loosening on badge/eyebrow text (13-14px) makes labels feel like printed marks.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.1 | 0.2px | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| body-lg | 18px | 1.2 | — | `--text-body-lg` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading-sm | 24px | 1.1 | — | `--text-heading-sm` |
| heading-lg | 40px | 1 | — | `--text-heading-lg` |
| display | 56px | 0.95 | -1.12px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 88 | 88px | `--spacing-88` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 900px |
| cards | 12px |
| badges | 900px |
| images | 12px |
| buttons | 900px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(56, 56, 53) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 251, 235, 0.25) 0px 0px 0px 2px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Pill Primary Button
**Role:** The default call-to-action — teal fill on charcoal

Fully rounded (900px) pill button. Fill #00b18c, text #fffbeb at 14-16px weight 500. Padding 16px horizontal by 9px vertical. No drop shadow; instead a 2px inset ring at rgba(255,251,235,0.25) defines the edge so the button reads as illuminated rather than elevated.

### Pill Ghost Button
**Role:** Secondary navigation action — text only inside a pill outline

900px radius, transparent fill on #151515, 1px border in #fffbeb at ~40% opacity, 14-16px weight 500 text in #fffbeb. Padding 16px horizontal. Sits beside filled CTAs in the nav as the quieter option.

### Nav Capsule
**Role:** The header pill containing all nav controls

A single 900px-radius container floating top-right of the page. Fill #151515, subtle border. Houses nav links, dropdown caret, and the 'Get started' filled pill, all separated by thin #fffbeb dividers.

### Inset-Border Card
**Role:** Feature/product/insight card — the system's only card pattern

12px radius, fill #151515 (same as canvas so it reads as a cutout), 1px inset border in #383835. Padding 24px. Image area at the top uses 12px radius and bleeds to card edges. No drop shadow — the inset stroke is the only depth signal.

### Hero Radial Wash
**Role:** Atmospheric background for hero and section transitions

A large soft radial gradient centered on the page in #00b18c at 20-35% opacity, fading to transparent over 60-80% of the viewport height. Creates a stage-light effect against the #151515 canvas.

### Display Headline Block
**Role:** Section-spanning typographic statement

TASA Orbiter 56px weight 600, color #fffbeb, line-height 0.95, letter-spacing -1.12px (-0.02em). Mixed-weight runs are common: weight 600 for the primary statement, weight 400-500 in #a6a6a6 or #504f4a for the secondary clause, creating a built-in hierarchy within a single headline.

### Eyebrow Label
**Role:** Section pre-titles — 'OUR SOLUTION', 'PRELUDE'

13-14px TASA Orbiter weight 500, letter-spacing 0.02em (positive, unusual), uppercase, color #00b18c or #ff4a5f. Acts as a colored tag that names the section before the headline arrives.

### Pill Badge
**Role:** Status, tag, and identifier labels

900px radius, no fill, 1px border in #504f4a or #383835, padding 6px 12px, 13px text in #fffbeb or #b8b8b8 weight 500. Used for identifiers like 'ATS', 'Soon - MIDS'.

### Community Node
**Role:** Circular avatar/badge element in the hero orbital layout

Fully round disc, ~80-100px diameter, #151515 fill with 1px #383835 border. Contains either a partner logo (ISRC, IPI, ISWC, etc.) in #b8b8b8 or a portrait photo. Arranged in concentric orbits around the central logo.

### Central Brand Mark
**Role:** Hero focal point — the Allfeat logo with headline

White #fffbeb triangular/constellation logo glyph at 48-64px, centered above a 40-56px headline in #fffbeb weight 600. Followed by a single Signal Teal filled pill button ('Discover how').

### Gradient Accent Border
**Role:** Decorative hairline that traces card or section edges in coral

A 1px linear gradient from #151515 through #ff4a5f back to #151515, applied as a border on select highlight cards. Frequency is low — only used to signal featured or status-quo-breaking content.

## Do's and Don'ts

### Do
- Use #00b18c fill as the only chromatic CTA — every interactive filled button in the system is this exact teal
- Set all buttons, badges, and nav capsules to 900px radius — this is non-negotiable, the only allowed exception is cards/images at 12px
- Pull all display type to letter-spacing -0.02em and line-height 0.95-1.00 so headlines collapse into confident slabs
- Use the 1px inset #383835 border as the sole card depth treatment — never add a drop shadow on top of it
- Reserve #ff4a5f for eyebrow labels, gradient accents, and emotional emphasis runs inside headlines — never as a button fill or body text color
- Anchor every hero and major section in a soft teal radial wash fading from #00b18c at ~25% opacity to transparent
- Keep body text in TASA Orbiter weight 400 at 16-18px in #fffbeb or #b8b8b8; never go below 13px

### Don't
- Don't introduce a new accent color — teal and coral are the only chromatic voices in the system
- Don't use 8px or 16px radius on cards or images; the system is strictly 12px for containers and 900px for interactive elements
- Don't use pure white (#ffffff) for text — always #fffbeb, the warm cream tint is part of the brand
- Don't apply drop shadows anywhere — the entire elevation system is inset-only
- Don't break the single-typeface rule by introducing a second font; TASA Orbiter at 400/500/600 covers every need
- Don't set headlines in light or thin weights — 600 is the floor for display sizes, mixing in 400-500 only as muted secondary clauses
- Don't fill buttons with #ff4a5f coral — coral is atmospheric, not actionable; only #00b18c signals an action

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Charcoal Canvas | `#151515` | Page base, hero background beneath the teal radial wash |
| 1 | Card Surface | `#151515` | Card interior — same color as canvas, distinguished only by the 1px inset border in #383835 |
| 2 | Teal Wash | `#00b18c` | Hero radial gradient overlay creating atmospheric depth, not a true surface |

## Elevation

- **Inset-Border Card:** `rgb(56, 56, 53) 0px 0px 0px 1px inset`
- **Pill Primary Button:** `rgba(255, 251, 235, 0.25) 0px 0px 0px 2px inset`

## Imagery

Visuals are dominated by illustrated 3D isometric graphics (a translucent cube on a grid, networked circular nodes with geometric face patterns) rendered in a limited palette of teal, coral, cream, and charcoal. Photography is restricted to small circular partner portraits in the community orbital hero, presented as soft black-and-white crops. Icons are monoline geometric marks (ISRC, IPI, ISWC badges) in #b8b8b8. The illustrative style is flat-isometric with hard edges, no gradients on the objects themselves — the only gradient in the system is the atmospheric teal wash behind them.

## Layout

Max-width 1200px centered, full-bleed dark canvas. The hero is a full-viewport radial teal wash with the brand mark, headline, and single CTA dead-centered; the community nodes orbit this center as fixed-position circles. Below the fold, content arranges in alternating 2-column card grids (2-up on desktop, stacked on mobile) with generous 80px vertical section gaps. Each section opens with a centered eyebrow + display headline, then drops into 2-up or 3-up card rows. Navigation is a fixed top-left wordmark plus a top-right floating pill capsule — no full-width nav bar. The footer is compact, dark, and text-only. The overall rhythm is: one big centered moment, then a long quiet section of paired cards, then another big centered moment.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #fffbeb
- text (muted): #b8b8b8
- background (canvas): #151515
- border (card hairline): #383835
- accent (eyebrow, gradient): #ff4a5f
- primary action: #00b18c (filled action)

## Example Component Prompts

1. **Hero Centered Stage** — Full-bleed #151515 canvas with a soft radial teal wash (#00b18c at ~25% opacity, fading to transparent over 70% viewport height). Center the white triangular logo glyph at 56px. Below it, a headline in TASA Orbiter 56px weight 600 #fffbeb, letter-spacing -1.12px, line-height 0.95. One Signal Teal pill button (900px radius, #00b18c fill, #fffbeb text 14px weight 500, padding 16px horizontal, 2px inset #fffbeb25 ring).

2. Create a Primary Action Button: #00b18c background, #151515 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Mixed-Weight Display Headline** — Single TASA Orbiter 56px block, line-height 0.95, letter-spacing -1.12px. Primary clause in weight 600 #fffbeb; secondary clause in weight 400 #504f4a within the same paragraph. Above it, a 13px eyebrow in #00b18c weight 500, letter-spacing 0.26px (0.02em), uppercase.


5. **Nav Capsule** — Floating top-right, 900px radius, #151515 fill, 1px #383835 border, padding 9px 16px. Inside: nav links in 14px #fffbeb weight 500, separated by thin dividers, a small caret glyph, and a final 'Get started' filled Signal Teal pill button.

## Gradient System

Two gradients define all atmospheric depth in the system:

1. **Teal Stage Wash** — Radial, centered, #00b18c at 20-35% opacity fading to #151515 transparent. Applied behind hero headlines and major section openings. Never applied to containers or text.

2. **Coral Edge Trace** — linear-gradient(90deg, #151515 0%, #ff4a5f 50%, #151515 100%), used as a 1px border on select highlight cards. Frequency is deliberately low — only one or two cards per page earn this treatment.

3. **Diagonal Ember** — linear-gradient(185deg, #fffbeb 0px, #ff4a5f 40%, #151515 77%), used sparingly as a full-section emotional backdrop, always in the lower 30% of a page where it bleeds into the dark canvas.

## Typography Voice

TASA Orbiter carries the entire brand voice alone. The signature move is **mixed-weight display headlines**: a single 56px line where weight 600 #fffbeb carries the statement and weight 400 #504f4a trails the supporting clause. This creates hierarchy without a second color, without a second size, and without a second font. The 0.02em positive tracking on 13-14px eyebrow labels is the system's only loosened tracking — it makes section pre-titles read as stamped marks rather than flowing type, echoing the engraved-badge aesthetic of music industry identifiers (ISRC, IPI, ISWC) that the platform governs.

## Similar Brands

- **Audius** — Same dark-mode music-infrastructure palette with a single vivid accent (Audius uses green, Allfeat uses teal) and pill-shaped CTAs
- **Sound.xyz** — Dark canvas, teal/vivid-green primary action, minimal card system with hairline borders, single sans-serif throughout
- **Zora** — Dark-mode crypto-creator platform using a single chromatic accent against near-black, with pill buttons and 12px-radius cards
- **Lens Protocol** — Identical dark-canvas-plus-vivid-teal accent language, pill navigation capsules, and inset-border card treatment
- **Royal** — Music-industry crypto platform with a warm-on-dark palette, single accent color, and display headlines that mix weights within one block

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-stage: #151515;
  --color-warm-cream: #fffbeb;
  --color-card-edge: #383835;
  --color-mute-cream: #b8b8b8;
  --color-ash-gray: #a6a6a6;
  --color-bronze-veil: #504f4a;
  --color-signal-teal: #00b18c;
  --color-ember-coral: #ff4a5f;

  /* Typography — Font Families */
  --font-tasa-orbiter: 'TASA Orbiter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.1;
  --tracking-caption: 0.2px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --text-display: 56px;
  --leading-display: 0.95;
  --tracking-display: -1.12px;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-88: 88px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 900px;

  /* Named Radii */
  --radius-nav: 900px;
  --radius-cards: 12px;
  --radius-badges: 900px;
  --radius-images: 12px;
  --radius-buttons: 900px;

  /* Shadows */
  --shadow-subtle: rgb(56, 56, 53) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(255, 251, 235, 0.25) 0px 0px 0px 2px inset;

  /* Surfaces */
  --surface-charcoal-canvas: #151515;
  --surface-card-surface: #151515;
  --surface-teal-wash: #00b18c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-stage: #151515;
  --color-warm-cream: #fffbeb;
  --color-card-edge: #383835;
  --color-mute-cream: #b8b8b8;
  --color-ash-gray: #a6a6a6;
  --color-bronze-veil: #504f4a;
  --color-signal-teal: #00b18c;
  --color-ember-coral: #ff4a5f;

  /* Typography */
  --font-tasa-orbiter: 'TASA Orbiter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.1;
  --tracking-caption: 0.2px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --text-display: 56px;
  --leading-display: 0.95;
  --tracking-display: -1.12px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-88: 88px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 900px;

  /* Shadows */
  --shadow-subtle: rgb(56, 56, 53) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(255, 251, 235, 0.25) 0px 0px 0px 2px inset;
}
```
