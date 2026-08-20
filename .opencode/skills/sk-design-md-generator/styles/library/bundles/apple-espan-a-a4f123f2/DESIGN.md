# Apple (España) — Style Reference
> Museum gallery in soft daylight — the gallery is a single, immersive, weightless white room where each product is spotlit against a faintly tinted wall.

**Theme:** light

Apple (España) operates on a gallery principle: the product is the hero, the page is the pedestal. The system rests on a near-white canvas (#f5f5f7) that reads as infinite light, interrupted only by soft gradient washes per product section (pale blue, pale gray) that visually separate campaigns without resorting to borders. Typography is restrained, centered, and almost conversational — weight 600 headlines at 40-56px paired with weight 400 subheads create a quiet authority. The only chromatic color is a vivid blue (#0071e3) used exclusively for the filled primary action button; everything else is monochrome. Components are minimal: a 44px nav bar, pill-shaped buttons (980px radius), text links, and large product imagery that floats on the canvas with no card or shadow treatment.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fog White | `#f5f5f7` | `--color-fog-white` | Dominant page canvas, section backgrounds, footer |
| Pure White | `#ffffff` | `--color-pure-white` | Nav background, button text, elevated surface |
| Obsidian | `#1d1d1f` | `--color-obsidian` | Primary headline and body text — the only true dark for editorial content |
| Carbon | `#000000` | `--color-carbon` | Nav glyphs, link underlines, dark text on light surfaces |
| Pewter | `#707070` | `--color-pewter` | Secondary body text, footer copy, muted helper text |
| Slate | `#505050` | `--color-slate` | Tertiary body text and subdued link states |
| Graphite | `#474747` | `--color-graphite` | Nav and link text at rest — sits between body text and pure black |
| Iron | `#333333` | `--color-iron` | Nav icons (fill) and button text — the dominant dark accent in chrome |
| Silver | `#858585` | `--color-silver` | Icon strokes, tertiary glyphs, muted UI controls |
| Pale Mist | `#d6d6d6` | `--color-pale-mist` | Hairline dividers, subtle borders between content blocks |
| Ash Veil | `#e2e2e5` | `--color-ash-veil` | Button backgrounds for secondary filled actions (dark mode variant) |
| Iris Blue | `#0071e3` | `--color-iris-blue` | Filled primary action buttons — the sole chromatic CTA, signals the only commitment the page asks of you |
| Sapphire | `#0066cc` | `--color-sapphire` | Outlined action buttons, body and link text — darker blue for outlined variants and inline links |
| Sky Signal | `#2997ff` | `--color-sky-signal` | Outlined action buttons on dark sections, secondary CTAs — lighter blue for ghost buttons against dark hero bands |
| Cornflower | `#509be7` | `--color-cornflower` | Hover state for inline links, decorative link accent |
| Ice Wash | `#aad0f6` | `--color-ice-wash` | Gradient section background wash — the pale blue tint behind iPad Air / MacBook Air hero bands |

## Tokens — Typography

### SF Pro Display — Product headlines, large editorial display text. Used at 56px/600 for hero titles like 'MacBook Air' and 40px/600 for section subheads. The tighter 1.07 line height at 56px is signature — it lets the headline sit as a single visual block without breathing room between lines. · `--font-sf-pro-display`
- **Substitute:** system-ui, -apple-system, BlinkMacSystemFont
- **Weights:** 400, 600, 700
- **Sizes:** 21px, 28px, 40px, 56px
- **Line height:** 1.07–1.19
- **Letter spacing:** -0.0050em, 0.0070em, 0.0110em
- **OpenType features:** `"numr" on`
- **Role:** Product headlines, large editorial display text. Used at 56px/600 for hero titles like 'MacBook Air' and 40px/600 for section subheads. The tighter 1.07 line height at 56px is signature — it lets the headline sit as a single visual block without breathing room between lines.

### SF Pro Text — Navigation, body copy, buttons, footer, subheads below display. The 17px/400/1.47 body setting appears 221 times — this is the workhorse. The 12px/400/1.33 setting handles everything in the footer and micro-copy. 44px/400/1.00 is the nav logo wordmark. · `--font-sf-pro-text`
- **Substitute:** system-ui, -apple-system, BlinkMacSystemFont
- **Weights:** 400, 600
- **Sizes:** 12px, 13px, 14px, 17px, 26px, 34px, 44px
- **Line height:** 1.00–1.47
- **Letter spacing:** -0.0300em, -0.0270em, -0.0220em, -0.0160em, -0.0150em, -0.0110em, -0.0100em, -0.0030em
- **OpenType features:** `"numr" on`
- **Role:** Navigation, body copy, buttons, footer, subheads below display. The 17px/400/1.47 body setting appears 221 times — this is the workhorse. The 12px/400/1.33 setting handles everything in the footer and micro-copy. 44px/400/1.00 is the nav logo wordmark.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.12px | `--text-caption` |
| body | 17px | 1.47 | -0.37px | `--text-body` |
| subheading | 21px | 1.19 | 0.23px | `--text-subheading` |
| heading-sm | 26px | 1.47 | -0.39px | `--text-heading-sm` |
| heading | 34px | 1.47 | -0.37px | `--text-heading` |
| heading-lg | 40px | 1.1 | — | `--text-heading-lg` |
| display | 56px | 1.07 | -0.28px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 0px |
| tags | 980px |
| buttons | 980px |
| sections | 0px |

### Layout

- **Page max-width:** 980px
- **Section gap:** 80-120px
- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Filled Primary Button
**Role:** The single chromatic CTA on any page — signals the most important action

Pill-shaped (border-radius: 980px), background #0071e3, text #ffffff at 14px/400, padding 11px 21px. Sits on the light canvas as the only non-monochrome element in the action set. Used for 'Más información' across product sections.

### Outlined Secondary Button
**Role:** Companion action to the filled primary, typically 'Comprar' or 'Comprar un iPhone'

Pill-shaped (border-radius: 980px), transparent background, 1px border in #0066cc, text #0066cc at 14px/400, padding 11px 21px. Always appears to the right of the filled primary button. Pairs the two pills side by side with an 8px gap.

### Ghost Outline Button (Dark Surface)
**Role:** Outlined action variant used on dark hero bands like Apple TV+ carousel

Pill-shaped (border-radius: 980px), transparent background, 1px border in #2997ff, text #2997ff at 14px/400, padding 8px 15px (slightly tighter than the light-surface outlined variant).

### Text Link
**Role:** Inline links in body copy, footer terms, and the global message bar

No border-radius, no background, color #0066cc, text-decoration-underline on hover. The link 'Comprar >' in the financing banner is the canonical example — it sits inline with body text, underlined or with a chevron suffix.

### Global Nav Bar
**Role:** Persistent top navigation across all pages

Height 44px, full viewport width, background #ffffff with backdrop-filter saturate(1.8) blur(20px). Left: Apple logo glyph. Center: 9 nav items (Tienda, Mac, iPad, iPhone, Watch, AirPods, TV y Casa, Entretenimiento, Accesorios, Soporte) at 12px/400, color #1d1d1f with #474747 hover. Right: search icon and bag icon, both 44px tap targets.

### Global Message Bar
**Role:** Promotional ribbon below the nav — financing offers, launch announcements

Background #ffffff, 12px/400 body text, centered, includes an inline blue text link. No border, no padding above or below beyond the nav's own spacing.

### Product Hero Section
**Role:** The dominant unit of the page — one product per full-width section

Full-bleed width, background switches between #f5f5f7 (neutral) and soft gradient washes (e.g. pale blue for iPad Air, near-white for MacBook Air). Centered content stack: product name at 56px/600 in #1d1d1f, subhead at 21px/400 in #1d1d1f, button pair centered below, then a large product render image (MacBook open, iPhone lineup) at full width. Section height typically 600-700px.

### Button Pair (CTA Cluster)
**Role:** The action duo under every product headline

Two pill buttons centered horizontally with 8px gap. Left: filled #0071e3 with 'Más información'. Right: outlined #0066cc with 'Comprar' or 'Comprar un iPhone'. The pair is the only place on the page where blue appears as a color — everything else is monochrome.

### Entertainment Carousel
**Role:** Full-bleed horizontal scroll for Apple TV+ content

Background dark or photographic, large card tiles (roughly 280px wide, 420px tall) with rounded corners ~12px. Each card has a 'Ver ahora' white pill button overlaid in the bottom-left corner. Dot pagination (8 dots) below the carousel indicates position.

### Product Lineup Display
**Role:** Showcase of product variants (iPhone 17 colors, MacBook angles)

Full-width product photography with no card or border — the products float on the section background. Multiple product angles or colorways arranged in a row, shot on pure #f5f5f7 or #aad0f6 backgrounds with soft drop shadows in the photography itself.

### iPad Air Wordmark
**Role:** Product name with mixed-weight treatment

The word 'iPad' at 40px/600 in #1d1d1f followed by 'air' in a lighter italic-leaning weight (visually distinct script treatment) at the same size, in #1d1d1f. The weight contrast within a single wordmark is the signature treatment for Air-tier products.

### Footer Link List
**Role:** Dense grid of navigational and legal links at the page bottom

Background #f5f5f7, two-column layout with column headings at 12px/600 in #1d1d1f and link items at 12px/400 in #515154. Columns separated by ~10px row gap. No dividers between items, no card containers.

### Legal / Terms Block
**Role:** Fine-print legal text at the very bottom of the page

Full width within the footer band, 12px/400 in #707070, line-height 1.33. Dense paragraph blocks with inline blue links to 'Consulta las condiciones'.

## Do's and Don'ts

### Do
- Use border-radius 980px on all buttons and pill tags — this is the system's defining shape language.
- Use SF Pro Display weight 600 for product headlines at 40px or 56px; never use display weight 400 for headlines.
- Center all hero text stacks horizontally — the system is symmetrical, not left-aligned.
- Use #0071e3 exclusively for filled primary action buttons; use #0066cc for outlined buttons and inline links. These are the only two blues in the action set.
- Separate product sections with a change in background tint (#f5f5f7 → #aad0f6 → dark photo), never with a border or divider line.
- Set body text at 17px/400/1.47 with letter-spacing -0.022em — this is the workhorse setting and appears in 221 instances.
- Use a 44px-tall nav bar with backdrop-filter blur(20px) saturate(1.8) — the frosted glass effect is essential to the page's weightless feel.

### Don't
- Don't add box-shadows to buttons, cards, or sections — elevation comes from color contrast, not shadows.
- Don't use the brand blue (#0071e3) for anything other than filled primary action buttons; links and outlines use #0066cc.
- Don't left-align product headlines; the system is always centered.
- Don't use border-radius values below 980px on buttons — no square buttons, no 4px or 8px pill variants.
- Don't place horizontal rules or border lines between sections; use background color shifts instead.
- Don't use SF Pro Display at sizes below 21px; that family is reserved for headlines and large body. Use SF Pro Text for everything under 21px.
- Don't introduce secondary accent colors, gradients, or decorative backgrounds within the product hero areas — the product render is the only visual interest.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f7` | Page background and the majority of section fills |
| 1 | Pure White | `#ffffff` | Nav bar surface, white-on-blue button text, card elevation |
| 2 | Section Wash — Ice | `#aad0f6` | Soft blue gradient band behind certain product hero sections |
| 3 | Dark Band | `#000000` | Apple TV+ / entertainment carousel section — full-bleed dark surface |

## Elevation

- **Global Nav:** `No shadow — uses backdrop-filter: saturate(1.8) blur(20px) for a frosted glass effect against any background`

## Imagery

Product photography is the dominant visual content — large, center-anchored renders of MacBooks, iPhones, and iPads float directly on the section background with no card framing. Photography style is studio-catalog: pure white or pale blue seamless backgrounds, soft natural shadows under the product, no lifestyle context or human models in the product sections. The Apple TV+ carousel uses cinematic dark photography with strong color grading. Iconography is minimal — SF Symbols-style glyphs in the nav at 1.5-2px stroke weight, monochrome. The page contains zero illustrations, zero abstract graphics, and zero decorative backgrounds beyond the per-section tint washes. Imagery occupies roughly 50% of the page's visual area, with the remaining 50% being typography and the off-white canvas.

## Layout

The page is a vertical stack of full-bleed product sections, each one viewport-height or taller. Max content width for text is ~980px, always centered. Nav is a fixed 44px bar at the top with a frosted glass effect. Each product section follows the same vertical rhythm: centered headline (56px) → centered subhead (21px) → centered button pair → large product render filling the lower 60% of the section. Sections alternate between #f5f5f7 canvas and soft gradient washes to create visual separation. The Apple TV+ entertainment carousel is the only section that breaks the centered-text pattern — it is a full-bleed edge-to-edge horizontal scroll with large card tiles. Footer is a dense 4-column link grid in a #f5f5f7 band at the very bottom. No sidebar navigation, no mega-menus in the visible viewport.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #1d1d1f
- text (secondary): #707070
- text (nav glyphs): #333333
- background (canvas): #f5f5f7
- border / hairline: #d6d6d6
- accent (nav text, links): #0066cc
- primary action: #0071e3 (filled action)

**Example Component Prompts**

1. **Product Hero Section**: Full-bleed section, background #f5f5f7. Centered headline at 56px SF Pro Display weight 600, color #1d1d1f, letter-spacing -0.28px. Subhead at 21px SF Pro Display weight 400, color #1d1d1f. Below the text, a centered button pair with 8px gap: filled blue button (#0071e3, white text, 980px radius, 11px 21px padding) and outlined blue button (transparent background, 1px solid #0066cc border, #0066cc text, 980px radius, 11px 21px padding). Below the buttons, a large product render at full section width with no card or shadow.

2. **Filled Primary Button**: border-radius 980px, background #0071e3, color #ffffff, padding 11px 21px, font 14px SF Pro Text weight 400, letter-spacing -0.22px. No border, no shadow.

3. **Outlined Secondary Button**: border-radius 980px, background transparent, 1px solid border #0066cc, color #0066cc, padding 11px 21px, font 14px SF Pro Text weight 400.

4. **Global Nav Bar**: Height 44px, full viewport width, background #ffffff, backdrop-filter saturate(1.8) blur(20px). Apple logo glyph on the left, nav items centered at 12px SF Pro Text weight 400 in #1d1d1f, search and bag icons on the right. A thin 1px bottom border in #d6d6d6 may appear on scroll.

5. **Product Lineup Section**: Full-width section on background #aad0f6. A horizontal arrangement of product renders (no cards, no borders) photographed with soft natural shadows. Section padding-top 80px, section padding-bottom 80px. Headline at 40px SF Pro Display weight 600 centered above.

## Section Background System

Apple (España) uses a rotating palette of nearly-white tinted backgrounds to separate product sections without borders or dividers. The pattern: each major product gets a full-bleed band with a soft gradient or flat tint. MacBook Air sits on a near-white wash. iPhone 17 on pure #f5f5f7. iPad Air on a pale blue (#aad0f6) gradient. Apple TV+ content fills the entire viewport edge-to-edge with photographic dark imagery. This color rotation is the primary visual divider on the page — there are zero horizontal rules or section dividers used in the main content flow.

## Button Pair Convention

Every product hero contains exactly one button pair, always centered, always in the same order: filled blue on the left, outlined blue on the right. The filled button always says 'Más información'. The outlined button says 'Comprar', 'Comprar un iPhone', or a product-specific variant. The gap between them is 8px. This pair is never repeated, never stacked vertically, and never appears more than once per section.

## Similar Brands

- **Bang & Olufsen** — Same museum-gallery aesthetic: product-as-hero on a near-white canvas, centered restrained typography, no card containers, product photography floating on negative space
- **Teenage Engineering** — Same monochrome discipline with a single vivid accent color, pill-shaped buttons, and product photography on plain off-white backgrounds with no decorative chrome
- **Nothing (nothing.tech)** — Same product-showcase homepage pattern with full-bleed product renders, centered text stacks, and minimal UI chrome — though Nothing pushes to dark mode while Apple stays light
- **Leica Camera** — Same editorial product-gallery layout: large centered product names, pill-shaped action buttons, generous vertical spacing, photography-first with no decorative illustration
- **Uniqlo** — Same sectioned full-bleed homepage with per-section background tints, centered headline+subhead+CTA rhythm, and minimal UI ornamentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fog-white: #f5f5f7;
  --color-pure-white: #ffffff;
  --color-obsidian: #1d1d1f;
  --color-carbon: #000000;
  --color-pewter: #707070;
  --color-slate: #505050;
  --color-graphite: #474747;
  --color-iron: #333333;
  --color-silver: #858585;
  --color-pale-mist: #d6d6d6;
  --color-ash-veil: #e2e2e5;
  --color-iris-blue: #0071e3;
  --color-sapphire: #0066cc;
  --color-sky-signal: #2997ff;
  --color-cornflower: #509be7;
  --color-ice-wash: #aad0f6;

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.37px;
  --text-subheading: 21px;
  --leading-subheading: 1.19;
  --tracking-subheading: 0.23px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.47;
  --tracking-heading-sm: -0.39px;
  --text-heading: 34px;
  --leading-heading: 1.47;
  --tracking-heading: -0.37px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: -0.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 980px;
  --section-gap: 80-120px;
  --card-padding: 0px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-full: 980px;
  --radius-full-2: 999px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-nav: 0px;
  --radius-tags: 980px;
  --radius-buttons: 980px;
  --radius-sections: 0px;

  /* Surfaces */
  --surface-canvas: #f5f5f7;
  --surface-pure-white: #ffffff;
  --surface-section-wash-ice: #aad0f6;
  --surface-dark-band: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fog-white: #f5f5f7;
  --color-pure-white: #ffffff;
  --color-obsidian: #1d1d1f;
  --color-carbon: #000000;
  --color-pewter: #707070;
  --color-slate: #505050;
  --color-graphite: #474747;
  --color-iron: #333333;
  --color-silver: #858585;
  --color-pale-mist: #d6d6d6;
  --color-ash-veil: #e2e2e5;
  --color-iris-blue: #0071e3;
  --color-sapphire: #0066cc;
  --color-sky-signal: #2997ff;
  --color-cornflower: #509be7;
  --color-ice-wash: #aad0f6;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.37px;
  --text-subheading: 21px;
  --leading-subheading: 1.19;
  --tracking-subheading: 0.23px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.47;
  --tracking-heading-sm: -0.39px;
  --text-heading: 34px;
  --leading-heading: 1.47;
  --tracking-heading: -0.37px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: -0.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-full: 980px;
  --radius-full-2: 999px;
  --radius-full-3: 9999px;
}
```
