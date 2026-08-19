# TinyFaces NFT — Style Reference
> Printed collector's catalog on warm paper. Imagine a heavyweight art-book spread where vivid vinyl-toy photography sits beside oversized editorial serifs and pastel-tinted feature panels — the interface is the binding, the characters are the exhibition.

**Theme:** light

TinyFaces presents a curated editorial aesthetic for an NFT collection: cream-paper canvas, oversized serif display type in Migra, and pastel-saturated feature cards that feel lifted from a printed collector's catalog. The 3D character renders are the stars — each one a tactile, toy-like portrait shot against muted, painterly backdrops (sage, periwinkle, blush, cream). The chrome stays disciplined and dark — charcoal text, hairline borders, pill buttons — so the colorful artwork and pastel cards can carry the energy. Accent orange-red (#ed4a29) is reserved for the wordmark, decorative borders, and as a thin callout underline, never as a dominant button fill. Headlines lean on italic emphasis within otherwise upright serif to add cadence without shouting. Spacing is compact and dense like a magazine spread, with 10px card radii that feel like printed page edges rather than glassmorphic panels.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Press | `#212529` | `--color-charcoal-press` | Primary text, body copy, filled buttons, hairline borders — the dominant ink of the system |
| Bone White | `#f4f4f2` | `--color-bone-white` | Page canvas, secondary surface fill behind content sections |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, white-space inside pastel cards, icon contrast against dark fills |
| Silver Rule | `#d4d5d4` | `--color-silver-rule` | Hairline dividers, subtle structural borders between dense sections |
| Vermillion Mark | `#ed4a29` | `--color-vermillion-mark` | Orange accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Sage Panel | `#8d9876` | `--color-sage-panel` | Feature card background — muted olive-green panel for storytelling sections like environmental impact |
| Periwinkle Panel | `#a0b1cd` | `--color-periwinkle-panel` | Feature card background — dusty blue panel for collection-overview sections |
| Blush Panel | `#e5cce0` | `--color-blush-panel` | Feature card background — soft lilac-pink panel for rarity/utility sections |
| Peach Headline | `#f4ddbe` | `--color-peach-headline` | Accent on display headlines, decorative borders within heading contexts — warm cream tint that sits between the ink and the pastel cards |

## Tokens — Typography

### Migra — Display and editorial headlines only. The custom serif brings fashion-magazine authority: weight 500 (medium) avoids the heavy black-serif cliché and keeps the type feeling like ink on paper rather than poster art. Used at 64px for section openers and stretched to 187px for hero statements with line-height 1.0 — the tight setting lets oversized serifs lock into compositional blocks. Italic within upright passages (e.g. 'blockchain', 'rare', 'matters') creates editorial cadence without leaving the family. · `--font-migra`
- **Substitute:** Playfair Display, DM Serif Display, or Source Serif Pro
- **Weights:** 500
- **Sizes:** 50px, 64px, 187px
- **Line height:** 1.00–1.30
- **Role:** Display and editorial headlines only. The custom serif brings fashion-magazine authority: weight 500 (medium) avoids the heavy black-serif cliché and keeps the type feeling like ink on paper rather than poster art. Used at 64px for section openers and stretched to 187px for hero statements with line-height 1.0 — the tight setting lets oversized serifs lock into compositional blocks. Italic within upright passages (e.g. 'blockchain', 'rare', 'matters') creates editorial cadence without leaving the family.

### Inter — All running text: body copy at 16px/400, card descriptions at 14px, sub-headings and emphasized text at 20–24px. Light weight 300 used for de-emphasized text, medium 500 for inline emphasis and button labels. The letter-spacing of ~0.079em (relative) adds breathing room that complements the dense spacing grid without feeling loose. Inter's geometric neutrality keeps the focus on the serif display moments. · `--font-inter`
- **Substitute:** Inter (already Google-available), or fallback to system-ui
- **Weights:** 300, 400, 500
- **Sizes:** 14px, 16px, 20px, 24px
- **Line height:** 1.50–2.88
- **Letter spacing:** 0.0790em
- **Role:** All running text: body copy at 16px/400, card descriptions at 14px, sub-headings and emphasized text at 20–24px. Light weight 300 used for de-emphasized text, medium 500 for inline emphasis and button labels. The letter-spacing of ~0.079em (relative) adds breathing room that complements the dense spacing grid without feeling loose. Inter's geometric neutrality keeps the focus on the serif display moments.

### Arial — System fallback for icon-adjacent micro-labels and button secondary text where a sans-serif system reference is acceptable · `--font-arial`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** System fallback for icon-adjacent micro-labels and button secondary text where a sans-serif system reference is acceptable

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 20px | 2.25 | — | `--text-body` |
| subheading | 24px | 2.88 | — | `--text-subheading` |
| heading | 50px | 1.1 | — | `--text-heading` |
| heading-lg | 64px | 1.1 | — | `--text-heading-lg` |
| display | 187px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| buttons | 23px |
| hairlines | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Filled CTA Button (Buy / Primary)
**Role:** Primary commerce action

Charcoal Press fill (#212529), white text, 23px pill radius, Inter 500 at 16px, ~20px vertical padding, ~32px horizontal padding. The pill shape is the signature button form — no squared edges on any action control. Sits as a dark anchor against the cream canvas.

### Outlined Wallet Button
**Role:** Secondary connect action

Transparent fill, 1px Charcoal Press border (#212529), charcoal text, 23px pill radius, Inter 400 at 16px, ~20px vertical padding, ~32px horizontal padding. Pairs next to the filled Buy button as a ghost alternative.

### Wordmark / Brand Lockup
**Role:** Site identity in header and footer

Custom TinyFaces wordmark in Vermillion Mark (#ed4a29), tight letter-spacing, stacked two-line treatment. Functions as the only saturated color in the chrome — everything else is restrained to let this red mark carry brand recognition.

### Character Portrait Card
**Role:** Primary content unit for the NFT collection grid

10px radius frame containing a full-bleed 3D character render on its own colored backdrop. Cards sit in a horizontal-scroll row with 8px gaps. No border, no shadow — the character artwork is the entire surface. Ticker/label below shows collection status in Inter 400.

### Pastel Feature Card
**Role:** Editorial content block (collection stats, rarity, impact)

10px radius, solid pastel fill (Sage / Periwinkle / Blush), ~48px internal padding. Contains a starburst/asterisk icon (8-point), Migra 500 serif heading at ~50px with selective italic emphasis (e.g. 'unique', 'rare', 'matters'), Inter 400 body at 16–20px in Charcoal Press. A single 3D character render occupies one half of the card at large scale.

### Editorial Section Heading
**Role:** Section openers in the long-form scroll

Migra 500 at 64px, Charcoal Press, line-height 1.1. Italic swash on one or two key words creates editorial rhythm. Sits above body text with ~32px gap. No underlines, no rules — the serif weight is the hierarchy.

### Navigation Bar
**Role:** Top-level site navigation

Bone Canvas (#f4f4f2) background, 2px hairline Charcoal Press border at the bottom for structure. Logo left, nav links centered or right in Inter 400 at 16px, action buttons right-aligned. ~64px vertical padding, max-width 1200px centered.

### Ticker / Collection Status Bar
**Role:** Horizontal status strip below the character grid

Narrow strip showing repeated status text ('4000/4000 • COLLECTION SOLD OUT') in Inter 400 at 14px, Charcoal Press, separated by bullet points. No background fill — sits directly on the bone canvas like a newspaper ticker.

### Starburst Icon Marker
**Role:** Decorative section marker inside feature cards

8-point asterisk/burst glyph in Charcoal Press at ~24px, positioned top-left of each pastel feature card. Functions as an editorial dingbat — never functional UI, always decorative.

### Social Icon Group
**Role:** External social links in the header

Row of three monochrome icon glyphs (Twitter/X, Instagram, Discord) in Charcoal Press, 16px, separated by 8px gaps. Minimal, no labels, no containers.

## Do's and Don'ts

### Do
- Use Migra 500 at 50–187px for all editorial display moments, with line-height locked at 1.0–1.1 so oversized serifs form compositional blocks
- Reserve Vermillion Mark (#ed4a29) for the wordmark, thin outlined borders, and decorative flourishes — never fill a button with it
- Set all buttons to 23px pill radius — pill shape is non-negotiable for any action control
- Use 10px radius for all content cards and 2px only for hairline borders/dividers
- Lay out the character gallery as a horizontal-scroll row with 8px gaps, no card borders, no shadows
- Apply pastel card backgrounds (#8d9876, #a0b1cd, #e5cce0) as full fills for feature sections — never as tints or overlays on white
- Keep body text in Inter 400 at 16–20px with generous line-height (1.5–2.25) to match editorial reading rhythm

### Don't
- Don't use drop shadows for elevation — hierarchy comes from canvas-to-pastel surface transitions, not shadows
- Don't fill buttons with Vermillion Mark — the orange-red is editorial punctuation, not an action color
- Don't use squared corners on buttons or action controls — 23px pill is the only button form
- Don't place 3D character renders on the bone canvas without their own colored backdrop — every portrait needs its tinted scene
- Don't break the two-font discipline: Migra for display, Inter for everything else — no other serif or sans should enter the system
- Don't use white or gray as a feature card fill — feature cards must be one of the three pastels (sage, periwinkle, blush)
- Don't use large bold weights on Migra — 500 medium is the only weight; bold/heavy serifs break the printed-ink quality

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#f4f4f2` | Page background — warm off-white that feels like paper stock |
| 1 | Paper Card | `#ffffff` | White surface inside pastel panels for readable text |
| 2 | Pastel Feature Card | `#e5cce0` | Blush/lilac tinted card for feature storytelling |
| 2 | Pastel Feature Card Alt | `#a0b1cd` | Periwinkle tinted card for collection overview |
| 2 | Pastel Feature Card Alt 2 | `#8d9876` | Sage tinted card for mission/impact sections |

## Elevation

The system avoids drop shadows almost entirely — visual hierarchy comes from the warm canvas-to-pastel-card surface transitions and from generous internal padding, not from elevation. This keeps the aesthetic flat and editorial, like a printed page, and lets the 3D character renders be the only dimensional element on screen.

## Imagery

Imagery is the centerpiece of the entire system: stylized 3D character renders in a toy-figurine aesthetic — smooth, rounded, soft-lit, with pastel color blocking. Each character is shot in a studio-style portrait against its own muted backdrop (sage, periwinkle, blush, cream, terracotta). The 3D style is deliberately tactile and collectible, not photorealistic — closer to vinyl art toys than CGI. Lighting is soft and even with gentle highlights, no harsh shadows, giving each figure a 'fresh from the box' quality. Characters wear whimsical accessories (hats, glasses, masks, scarves) in coordinated pastel palettes. There is no photography, no illustration, no abstract graphics — the 3D renders carry 100% of the visual weight outside the editorial typography. The renders are always full-bleed inside their frames, never cropped, never overlaid with text, always treated as the hero of their container.

## Layout

The page reads as a long-form editorial scroll, not a product dashboard. The grid structure is max-width 1200px centered on a bone canvas. The first viewport is a full-bleed horizontal character gallery (overflow-x scroll, 8px gaps) that sets the playful tone immediately. Below the gallery, a narrow ticker bar runs edge-to-edge. The main body alternates between: (1) large editorial section openers in oversized Migra serif with body copy beside, (2) 2-column pastel feature cards that pair a Migra headline + Inter description on the left with a large 3D character render on the right. Section gaps are 64–128px, creating a paced magazine rhythm. Cards stack into a 2-up grid on desktop. The navigation is a thin top bar with logo left, nav center, actions right, and a 2px hairline bottom border. No sidebar, no mega-menu, no floating elements — the page is vertical-scroll linear narrative from gallery → storytelling → impact.

## Agent Prompt Guide

**Quick Color Reference**
- text: #212529
- background: #f4f4f2
- border: #d4d5d4
- accent (wordmark & decorative borders): #ed4a29
- pastel cards: #8d9876 / #a0b1cd / #e5cce0
- primary action: #212529 (filled action)

**3 Example Component Prompts**

1. *Build an editorial section opener*: Bone Canvas (#f4f4f2) background. Headline in Migra 500 at 64px, color #212529, line-height 1.1, with the word 'collection' set in italic swash. Body copy beside in Inter 400 at 20px, line-height 2.25, also #212529. 32px gap between headline and body.

2. *Build a pastel feature card with character*: 10px radius, solid blush fill (#e5cce0), 48px padding. Starburst icon top-left in #212529 at 24px. Migra 500 heading at 50px, #212529, with one word in italic. Inter 400 body at 16px, #212529, below. Right half of the card shows a 3D character render at 100% width, contained within the card's padding.

3. *Build the primary buy button*: 23px pill radius, #212529 fill, white (#ffffff) Inter 500 at 16px label, 20px vertical padding, 32px horizontal padding. No border, no shadow. Pairs next to a ghost Wallet button with 1px #212529 border and transparent fill.

## Similar Brands

- **CryptoPunks / Larva Labs** — Same grid-of-portraits structure for a generative NFT collection, with each character presented as an individual collectible card
- **BAYC (Bored Ape Yacht Club)** — NFT gallery-first layout with a horizontal character row above editorial storytelling sections, and a prominent filled commerce button
- **Awwwards / Site Inspire editorial features** — Oversized serif display type, pastel feature cards, and magazine-spread pacing — the same editorial-meets-digital aesthetic
- **The New York Times Style section** — Custom serif headlines with italic emphasis on key nouns, generous line-height body copy, and muted pastel feature panels — the print-catalog rhythm
- **Coolors / editorial design portfolios** — Pastel-tinted feature panels paired with bold serif typography and a restrained dark neutral chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-press: #212529;
  --color-bone-white: #f4f4f2;
  --color-paper-white: #ffffff;
  --color-silver-rule: #d4d5d4;
  --color-vermillion-mark: #ed4a29;
  --color-sage-panel: #8d9876;
  --color-periwinkle-panel: #a0b1cd;
  --color-blush-panel: #e5cce0;
  --color-peach-headline: #f4ddbe;

  /* Typography — Font Families */
  --font-migra: 'Migra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 2.25;
  --text-subheading: 24px;
  --leading-subheading: 2.88;
  --text-heading: 50px;
  --leading-heading: 1.1;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --text-display: 187px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 23px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-buttons: 23px;
  --radius-hairlines: 2px;

  /* Surfaces */
  --surface-bone-canvas: #f4f4f2;
  --surface-paper-card: #ffffff;
  --surface-pastel-feature-card: #e5cce0;
  --surface-pastel-feature-card-alt: #a0b1cd;
  --surface-pastel-feature-card-alt-2: #8d9876;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-press: #212529;
  --color-bone-white: #f4f4f2;
  --color-paper-white: #ffffff;
  --color-silver-rule: #d4d5d4;
  --color-vermillion-mark: #ed4a29;
  --color-sage-panel: #8d9876;
  --color-periwinkle-panel: #a0b1cd;
  --color-blush-panel: #e5cce0;
  --color-peach-headline: #f4ddbe;

  /* Typography */
  --font-migra: 'Migra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 2.25;
  --text-subheading: 24px;
  --leading-subheading: 2.88;
  --text-heading: 50px;
  --leading-heading: 1.1;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --text-display: 187px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 23px;
}
```
