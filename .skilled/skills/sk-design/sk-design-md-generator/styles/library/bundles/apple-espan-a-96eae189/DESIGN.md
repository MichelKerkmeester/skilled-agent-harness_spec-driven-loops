# Apple (España) — Style Reference
> cinematic gallery on poured concrete — every product its own still life, every headline a wall label

**Theme:** light

Apple's product page language is cinematic and confident: a full-bleed photographic hero bleeds edge-to-edge, then resolves into spacious white and pale-gray bands where the product sits alone, photographed under controlled studio light. Type is the primary voice — SF Pro Display at display scale carries short, declarative Spanish headlines with aggressively tight negative tracking, while SF Pro Text keeps UI and body quiet. Color is almost entirely neutral; the only chromatic move is a single vivid Apple blue that powers the buying action, with text links and legal footnotes wearing a slightly deeper blue. The system rewards breathing room: large product images sit opposite single short paragraphs, feature lists collapse into icon-pill accordions, and elevation is barely perceptible — corners are generously rounded but cards rely on tonal contrast against #f5f5f7, never on drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Apple Blue | `#0071e3` | `--color-apple-blue` | Primary CTA fill — the single saturated button on the page (Comprar, Learn more). Vivid mid-blue that reads as a switch-on moment against matte neutrals |
| Link Blue | `#0066cc` | `--color-link-blue` | Inline text links, footnote references, and underlined link borders. Slightly deeper and cooler than the CTA blue so links and buttons read as distinct actions |
| Signal Green | `#03aa49` | `--color-signal-green` | Accent stroke for positive health/sleep metric visualizations and decorative data highlights on product UI |
| Ember Orange | `#ed6300` | `--color-ember-orange` | Orange outline accent for tags, dividers, and focused UI edges |
| Iris Violet | `#8668ff` | `--color-iris-violet` | Tertiary accent for multicolor data rings, decorative product UI, and illustration strokes |
| Deep Teal | `#00a1b3` | `--color-deep-teal` | Quaternary accent completing the Apple Watch activity ring palette |
| Space Black | `#1d1d1f` | `--color-space-black` | Primary text, heading fills, icon strokes, and card borders. Apple's near-black — softer than #000, reads warm against white |
| Sterling | `#707070` | `--color-sterling` | Secondary/muted text, nav borders, list dividers, and subdued UI labels |
| Graphite | `#474747` | `--color-graphite` | Nav border-bottom, link muted state, and mid-contrast UI text |
| Slate | `#333336` | `--color-slate` | Nav-specific dark text and borders in the top utility bar |
| Smoke | `#777779` | `--color-smoke` | Disabled or de-emphasized button/link background fill |
| Pebble | `#d6d6d6` | `--color-pebble` | Hairline borders, inactive dividers, and subdued list separators |
| Concrete | `#e2e2e5` | `--color-concrete` | Light surface tone for secondary buttons and list-item fills sitting on white |
| Fog | `#f5f5f7` | `--color-fog` | Page canvas and section background — the dominant pale-gray that separates content bands from pure white card surfaces |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, button text on dark fills, nav backgrounds, and badge interiors |
| Absolute | `#000000` | `--color-absolute` | True black for hero image overlays, icon fills, and high-contrast heading strokes |

## Tokens — Typography

### SF Pro Display — Headlines and display. The 48–64px range carries section titles like 'Lo principal.' and 'Más de cerca.' with aggressively tight letter-spacing (-0.015em to -0.003em) that lets words lock into a single visual block. Weight 600 is the workhorse; 700 appears on the most emphatic display sizes. 260px is the extreme hero-numeral scale. Substitute: Inter, system-ui. · `--font-sf-pro-display`
- **Substitute:** Inter
- **Weights:** 600, 700
- **Sizes:** 21, 24, 28, 48, 56, 60, 64, 260
- **Line height:** 1.07, 1.08, 1.14, 1.33
- **Letter spacing:** -0.015em at 48px, -0.005em at 56-60px, -0.003em at 64px
- **OpenType features:** `"numr"`
- **Role:** Headlines and display. The 48–64px range carries section titles like 'Lo principal.' and 'Más de cerca.' with aggressively tight letter-spacing (-0.015em to -0.003em) that lets words lock into a single visual block. Weight 600 is the workhorse; 700 appears on the most emphatic display sizes. 260px is the extreme hero-numeral scale. Substitute: Inter, system-ui.

### SF Pro Text — Body, nav, buttons, legal copy, and supporting UI. 17px is the canonical body size; 14px carries secondary descriptions and footnote text; 12px is reserved for micro-labels and legal fine print. Weight 400 for body, 600 for nav items, button labels, and emphasis. Tight tracking throughout (-0.022em at 12px down to -0.003em at 44px) keeps even long paragraphs visually dense. Substitute: Inter, -apple-system. · `--font-sf-pro-text`
- **Substitute:** Inter
- **Weights:** 400, 600
- **Sizes:** 12, 14, 17, 20, 44
- **Line height:** 1.18, 1.24, 1.33, 1.43, 1.47, 1.83
- **Letter spacing:** -0.022em at 12px, -0.019em at 14px, -0.016em at 17px, -0.010em at 20px, -0.003em at 44px
- **OpenType features:** `"numr"`
- **Role:** Body, nav, buttons, legal copy, and supporting UI. 17px is the canonical body size; 14px carries secondary descriptions and footnote text; 12px is reserved for micro-labels and legal fine print. Weight 400 for body, 600 for nav items, button labels, and emphasis. Tight tracking throughout (-0.022em at 12px down to -0.003em at 44px) keeps even long paragraphs visually dense. Substitute: Inter, -apple-system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.22px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.19px | `--text-body-sm` |
| body | 17px | 1.47 | -0.27px | `--text-body` |
| subheading | 21px | 1.38 | -0.32px | `--text-subheading` |
| heading-sm | 28px | 1.14 | -0.42px | `--text-heading-sm` |
| heading | 40px | 1.1 | -0.6px | `--text-heading` |
| heading-lg | 56px | 1.07 | -0.28px | `--text-heading-lg` |
| display | 64px | 1.06 | -0.19px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 89 | 89px | `--spacing-89` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 28px |
| chips | 28px |
| links | 10px |
| buttons | 980px |
| accordions | 28px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 28px
- **Element gap:** 10px

## Components

### Pill CTA Button (Primary)
**Role:** The single saturated blue action — 'Comprar', 'Buy', primary download.

Background #0071e3, text #ffffff in SF Pro Text 17px/600. Fully rounded at 980px radius. Horizontal padding ~20px, vertical padding ~11px. No border. Sits beside a white pricing chip on the hero.

### Pricing Chip
**Role:** Adjacent price display next to a primary CTA — 'Desde 449 €'.

Pill at 980px radius, background #333336 with 60% opacity over the hero image, text #ffffff in SF Pro Text 14px/400. No border.

### Outline Ghost Link
**Role:** Secondary action — 'Learn more', 'Compare', section deep-links.

Transparent fill, no border. Text in Link Blue #0066cc, SF Pro Text 17px/400, with a trailing › glyph. Underline appears on hover.

### Eyebrow Label
**Role:** Category tag above a hero headline — 'WATCH SERIES 11'.

SF Pro Text 12px/600, uppercase, color matches the surrounding text (white on hero, Space Black on light sections). Often prefixed by a small product icon.

### Section Headline
**Role:** Opening line of each content band — 'Lo principal.', 'Más de cerca.'.

SF Pro Display 48-56px/600, color #1d1d1f, letter-spacing -0.005em. Left-aligned, sentence case ending with a period — the full stop is a signature Apple editorial move.

### Feature Accordion Row
**Role:** Expandable feature list item in product deep-dive sections.

Horizontal pill at 28px radius, background #f5f5f7, padding 8px 16px. Left-aligned circular icon (24px circle with +/• glyph) followed by feature label in SF Pro Text 14px/400 #1d1d1f. Active row darkens to #1d1d1f fill with white text and icon.

### Product Feature Card
**Role:** White surface card pairing a product image with a short feature description.

Background #ffffff, border-radius 28px, padding 28px. No shadow — relies on tonal contrast against the #f5f5f7 canvas. Text pairs with product photography at 1:1 or 2:3 ratio.

### Global Nav Bar
**Role:** Sticky top utility bar with product category links.

Background #ffffff with 60% opacity and backdrop blur. 44px height. Links in SF Pro Text 12px/400 #1d1d1f, separated by 8px gaps. Hairline #333336 border-bottom. Apple logo, search, and bag icon at far left/right.

### Promo Banner
**Role:** Thin announcement strip above the nav — education pricing, trade-in.

Background #ffffff, text #1d1d1f in SF Pro Text 14px/400, with an inline link in #0066cc. Centered, single line, dismissible.

### Hero Section
**Role:** Full-bleed cinematic opener with overlaid editorial text.

100vw × ~100vh. Background is a high-resolution photograph (warm-toned lifestyle). Dark gradient overlay from transparent to rgba(0,0,0,0.4) at the bottom for legibility. Eyebrow label, headline, and CTA cluster sit bottom-left at ~40px gutter. Headline in SF Pro Display 40-56px/600 white.

### Split Feature Block
**Role:** Two-column section: short text on one side, product image on the other.

Background #f5f5f7, max-width 1440px centered. 50/50 column split with 40-60px gutter. Text column carries a 48px headline and 17px body paragraph. Image column carries a masked product render with no border.

### List Separator
**Role:** Horizontal divider within stacked content rows.

1px solid #d6d6d6 hairline spanning the content width with ~40px horizontal padding from the viewport edge.

## Do's and Don'ts

### Do
- Set every section background to #f5f5f7 and every card surface to #ffffff — this is the only elevation system in use
- End every section headline with a period: 'Lo principal.', 'Más de cerca.' — the full stop is a signature editorial move
- Use SF Pro Display at 48-56px weight 600 for section openers, with letter-spacing -0.005em
- Use the 28px radius for every card, accordion pill, and chip; reserve 980px only for true pill-shaped buttons
- Pair every CTA blue (#0071e3) with a white pricing chip (#333336 60%) when the price is part of the call to action
- Place the eyebrow label as 'PRODUCT ICON + ALL-CAPS 12px/600' directly above the hero headline at 3px gap
- Keep body paragraphs to a single 17px sentence per line — the system edits for visual silence, not information density

### Don't
- Never use #0066cc as a button fill — it is a link/underline color only; buttons use #0071e3
- Never apply a drop shadow to a card or button — tonal contrast against #f5f5f7 is the only depth signal
- Never set body type below 14px or above 21px — the 17px body / 14px secondary split is fixed
- Never use #000000 for body text — use #1d1d1f; reserve pure black for hero overlays and icon fills on white
- Never introduce a chromatic accent outside the activity-ring palette (green/orange/violet/teal) — these are decorative only, never CTA
- Never end a headline without a period or use a question mark — the system is declarative, not interrogative
- Never use a border-radius below 10px or above 28px for any container — the 28px radius is the lower bound for everything

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Fog Canvas | `#f5f5f7` | Dominant page background — every section band lives here by default. |
| 1 | Pure White | `#ffffff` | Elevated product card surface and feature block background; creates the subtle tonal lift without shadow. |
| 2 | Concrete | `#e2e2e5` | Inline surface for secondary buttons, accordion list items, and nested chips. |
| 3 | Pebble | `#d6d6d6` | Inactive dividers and disabled state surfaces. |

## Elevation

- **Product Feature Card:** `none — relies on #ffffff surface against #f5f5f7 canvas for tonal lift`
- **Primary CTA Button:** `none — flat #0071e3 fill, no shadow`

## Imagery

Photography is cinematic and lifestyle-led: the hero uses a wide warm-toned bedroom scene at golden hour, shot with natural available light, shallow depth, and no product visible — the human moment comes first, the product enters in subsequent sections. Product imagery shifts to high-key studio renders on pure white with soft contact shadows: the Apple Watch appears in 3/4 profile, screen lit, isolated against #f5f5f7 or #ffffff. No infographics, no charts, no stock photography. Iconography is SF Symbols weight-matched to surrounding text, monochrome in Space Black or white. No decorative illustration anywhere — the system is photo + product render + text, nothing else.

## Layout

Full-bleed cinematic hero (100vw, ~85vh) with bottom-left editorial text overlay. Subsequent sections resolve to max-width 1440px centered, each sitting on #f5f5f7 or pure white. The standard section pattern is a 2-column split: short text block on the left (max ~420px wide), large product render on the right. Headlines are short — one to three words — ending with a period. Feature lists use a left-aligned vertical stack of icon-pills rather than a grid. Section vertical rhythm is generous: ~80px between bands. Navigation is a thin sticky top bar with backdrop blur, not a sidebar or mega-menu. Footer is minimal, single column, centered.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1d1d1f
- background: #f5f5f7
- card surface: #ffffff
- border: #d6d6d6
- link: #0066cc
- primary action: #0071e3 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #0071e3 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Section opener**: Background #f5f5f7, max-width 1440px centered, 80px top/bottom padding. Headline left-aligned in SF Pro Display 48px/600 #1d1d1f, letter-spacing -0.005em, ending with a period. No body text, no button — the headline alone opens the section.

3. **Split feature block**: Background #f5f5f7, two-column at max-width 1440px. Left column (40%): headline at 40px SF Pro Display/600 #1d1d1f, followed by 17px SF Pro Text/400 #1d1d1f body paragraph with line-height 1.47. Right column (60%): product render on pure white with 28px radius, no border, no shadow.

4. **Feature accordion list**: Vertical stack of 28px-radius pills on #f5f5f7 canvas. Each row: 8px vertical padding, 16px horizontal padding, background #f5f5f7, 24px circular icon on the left in #1d1d1f, label in SF Pro Text 14px/400 #1d1d1f. 6px gap between rows. Active row: background #1d1d1f, text and icon flip to #ffffff.

5. **Outlined/ghost link row**: Single line of 17px SF Pro Text/400 #0066cc text with trailing › glyph, 8px gap to the right of preceding content. No background, no border, no padding. On hover: underline appears via 1px #0066cc border-bottom.

## Similar Brands

- **Bang & Olufsen** — Same full-bleed cinematic photography hero followed by white product cards, same single-weight editorial headlines with tight tracking
- **Tesla** — Identical hero-to-product transition: dark cinematic full-bleed opener resolving into generous white product bands with minimal type
- **Teenage Engineering** — Same monochrome-first palette with a single saturated accent, same SF-style tight tracking, same product-on-pale-gray card pattern
- **Nothing** — Same restraint to near-monochrome UI, same pill-radius buttons, same product-render-on-flat-surface photography treatment

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-signal-green: #03aa49;
  --color-ember-orange: #ed6300;
  --color-iris-violet: #8668ff;
  --color-deep-teal: #00a1b3;
  --color-space-black: #1d1d1f;
  --color-sterling: #707070;
  --color-graphite: #474747;
  --color-slate: #333336;
  --color-smoke: #777779;
  --color-pebble: #d6d6d6;
  --color-concrete: #e2e2e5;
  --color-fog: #f5f5f7;
  --color-pure-white: #ffffff;
  --color-absolute: #000000;

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.19px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.27px;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.32px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.42px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.28px;
  --text-display: 64px;
  --leading-display: 1.06;
  --tracking-display: -0.19px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-89: 89px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 28px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 980px;

  /* Named Radii */
  --radius-cards: 28px;
  --radius-chips: 28px;
  --radius-links: 10px;
  --radius-buttons: 980px;
  --radius-accordions: 28px;

  /* Surfaces */
  --surface-fog-canvas: #f5f5f7;
  --surface-pure-white: #ffffff;
  --surface-concrete: #e2e2e5;
  --surface-pebble: #d6d6d6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-signal-green: #03aa49;
  --color-ember-orange: #ed6300;
  --color-iris-violet: #8668ff;
  --color-deep-teal: #00a1b3;
  --color-space-black: #1d1d1f;
  --color-sterling: #707070;
  --color-graphite: #474747;
  --color-slate: #333336;
  --color-smoke: #777779;
  --color-pebble: #d6d6d6;
  --color-concrete: #e2e2e5;
  --color-fog: #f5f5f7;
  --color-pure-white: #ffffff;
  --color-absolute: #000000;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.19px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.27px;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.32px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.42px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -0.28px;
  --text-display: 64px;
  --leading-display: 1.06;
  --tracking-display: -0.19px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-89: 89px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 980px;
}
```
