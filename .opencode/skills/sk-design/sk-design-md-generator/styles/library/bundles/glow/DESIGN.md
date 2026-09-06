# Glow — Style Reference
> Magenta pulse on porcelain white. A single saturated brand color cuts through a quiet, gallery-bright canvas where phone screens are the art and a peach badge is the only warmth.

**Theme:** light

Glow uses a gallery-white product launch language: a porcelain #f4f5f6 canvas with confident bold headlines and phone mockups as the hero artifact. One vivid magenta carries the brand — appearing in the filled CTA, the logo gradient, and link accents — while orange and a peach badge provide small warm punctuation. Typography is geometric and tight-tracked (Roobert at -0.018em), giving copy a designed-objects feel rather than a marketing-brochure feel. The layout is spacious with large 40px-radius cards cradling product screenshots, and a distinctive layer of ghosted feature text on the hero that lists capabilities like museum wall labels.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Magenta | `#cc62d5` | `--color-voltage-magenta` | Filled buttons, link borders, brand accents — the single saturated current that makes the otherwise quiet page feel switched on |
| Plasma Gradient | `radial-gradient(86% 86% at 6% 9%, rgb(136, 0, 255) 0%, rgb(167, 50, 214) 51%, rgb(239, 121, 255) 100%)` | `--color-plasma-gradient` | Logo fill, decorative gradient washes — the spectrum from deep purple to hot pink that anchors brand identity |
| Ember Orange | `#ec660d` | `--color-ember-orange` | NEW badges, lightning-bolt icons, warm accent punctuation — used sparingly as energy, not as a second brand |
| Signal Red | `#e83b47` | `--color-signal-red` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Ink Black | `#131517` | `--color-ink-black` | Primary text, all borders and dividers, dark button surface, icon strokes — the structural neutral that carries 800+ usages |
| Porcelain | `#f4f5f6` | `--color-porcelain` | Page background, feature card surfaces, phone-mockup panels — the off-white that lets white cards lift off the canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Graphite | `#333537` | `--color-graphite` | Dark filled-button variant, high-contrast surfaces, secondary button backgrounds |
| Stone | `#737577` | `--color-stone` | Body text, icon strokes, supporting metadata — the readable gray for non-headline copy |
| Mist | `#b3b5b7` | `--color-mist` | Light borders, link underlines, disabled dividers, subtle separators |

## Tokens — Typography

### Roobert — All UI text — headlines at 700/56px, section headings at 700/40px, body at 400/16px, caption labels at 500/12px tracked out · `--font-roobert`
- **Substitute:** Inter, Manrope, or Satoshi for a similarly geometric grotesque with tight tracking
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 16px, 18px, 24px, 40px, 56px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.018em on body and display sizes; 0.083em on all-caps labels (12px captions)
- **OpenType features:** `"ss01" on, "ss02" on, "cv11" on`
- **Role:** All UI text — headlines at 700/56px, section headings at 700/40px, body at 400/16px, caption labels at 500/12px tracked out

### -apple-system — Fallback / system rendering · `--font-apple-system`
- **Substitute:** SF Pro Text
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Role:** Fallback / system rendering

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.996px | `--text-caption` |
| body | 16px | 1.5 | -0.288px | `--text-body` |
| subheading | 18px | 1.5 | -0.324px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.432px | `--text-heading-sm` |
| heading | 40px | 1.1 | -0.72px | `--text-heading` |
| display | 56px | 1 | -1.008px | `--text-display` |

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

### Border Radius

| Element | Value |
|---------|-------|
| cards | 40px |
| pills | 100px |
| small | 8px |
| badges | 4px |
| buttons | 19px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Main conversion action — mobile app download, primary CTAs

Background #cc62d5, text #ffffff, font Roobert 500/16px, border-radius 19px, padding 10px 14px. No shadow; the saturated fill alone carries the weight. Letter-spacing inherits the tight body tracking (-0.018em).

### Outlined Ghost Button
**Role:** Secondary action paired with primary — browser extension, alt CTAs

Background #ffffff, border 1.5px #131517, text #131517, border-radius 19px, padding 10px 14px. Matches primary height exactly so the pair sits as equal-weight siblings.

### Dark Filled Button
**Role:** Tertiary or contrast action on light cards

Background #333537 or #131517, text #ffffff, border-radius 19px, padding 10px 14px. Used when a neutral high-contrast surface beats the magenta accent.

### NEW Announcement Badge
**Role:** Inline product-news callout in the hero

Background #fef0e8 (soft peach), text #ec660d, font Roobert 600/12px uppercase, letter-spacing 0.083em, border-radius 4px, padding 2px 8px. Sharp 4px corners deliberately contrast the pill-radius buttons nearby.

### Phone Mockup Card
**Role:** Hero artifact — product showcase, feature illustration

Outer panel background #f4f5f6, border-radius 40px, padding 48–64px on all sides. Contains a centered phone frame with #ffffff screen and a faint drop shadow. The large 40px radius is a signature: mockups feel cradled, not boxed.

### Brand Logo Mark
**Role:** Wordmark + gradient icon in nav and hero

Wordmark 'glow' in Roobert 700 lowercase, #131517. Companion icon: 56px rounded square (19px radius) filled with the Plasma Gradient (#8800ff → #a732d6 → #ef79ff radial), with a white abstract glyph centered.

### Hero Headline
**Role:** Primary page-level headline

Roobert 700 at 56px, line-height 1.0, letter-spacing -1px, color #131517. Sets in two to three short lines; the tight tracking and weight 700 create a designed-poster feel, not a SaaS-hero feel.

### Section Heading
**Role:** Feature-section title below the fold

Roobert 700 at 40px, line-height 1.1, letter-spacing -0.72px, color #131517. Used for 'Swap Coins with Zero Fees', 'All your activity. In one place.', and other feature blocks.

### All-Caps Feature Label
**Role:** Museum-label text, section dividers, link accents

Roobert 500 at 12px, uppercase, letter-spacing 0.083em (~1px), color #737577 or #131517. Examples: 'EXPLORE GLOW FEATURES' under the hero. The tracked-out caps create a print-design rhythm against the bold display headlines.

### Ghosted Feature Text Layer
**Role:** Decorative background texture listing product capabilities

Set at very low opacity (~8–12%) in Roobert 600, color #131517. Words like 'Transaction History', 'Cloud Backup', 'NFT Exchange' tile the hero right side behind the phone. The signature move: turning a feature list into wallpaper.

### Quote / Attribution Block
**Role:** Social proof — investor or founder endorsement

Quote in Roobert 400/16px italic-feel regular #131517 with opening curly quote, em-dash attribution below in #737577, 13px. Sits flush-left, no border or container.

### Footer Link Bar
**Role:** Minimal site footer

Horizontal row of inline links in Roobert 400/13px #737577, separated by ~16px gap. No dividers, no background — the footer is just type on the porcelain canvas.

## Do's and Don'ts

### Do
- Use Roobert at 700/56px with letter-spacing -1px for the hero headline — this is the signature display treatment.
- Use #cc62d5 (Voltage Magenta) for exactly one element per viewport — the primary CTA — and let it carry the brand alone.
- Use 19px border-radius for all buttons; this half-pill is the system's signature shape language.
- Use 40px border-radius for product cards and phone-mockup cradles — the soft enclosure is what makes the layout feel gallery-like.
- Use uppercase 12px Roobert 500 with 0.083em letter-spacing for section labels, 'NEW' badges, and museum-style captions.
- Stack a 24px card padding inside 48–64px section padding to create the calm, spacious rhythm.
- Keep the page at least 85% achromatic; let magenta and orange function as punctuation, not decoration.

### Don't
- Do not use #cc62d5 for body text, borders, or non-action surfaces — overusing it dilutes the brand accent.
- Do not use system fonts or fall back to Arial/Helvetica — Roobert's geometric letterforms (with ss01/ss02 alternates) carry the identity.
- Do not use sharp 0px or 4px radii on buttons; 19px is the rule. 4px is reserved for the peach NEW badge only.
- Do not add drop shadows to cards or buttons — the design is intentionally flat, using surface color and radius for separation.
- Do not place more than one filled magenta button per screen; pair it with a ghost outlined button in #131517.
- Do not use the Plasma Gradient outside the logo mark — it is an identity element, not a decorative wash.
- Do not break the white-on-#f4f5f6 surface stack with mid-gray cards; only #ffffff sits on top of porcelain.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Porcelain Canvas | `#f4f5f6` | Page background; the off-white floor beneath all content |
| 1 | Pure White Card | `#ffffff` | Card surfaces, phone-mockup screens, button fills — the lifted top layer |
| 2 | Ink Surface | `#131517` | Dark filled buttons, inverted surface moments |

## Elevation

The design relies on large radii and color contrast rather than shadow to separate layers. Phone mockups carry the only visible shadow — a soft, short blur (~0 12px 32px rgba(0,0,0,0.06)) that lifts them off the porcelain panel. Cards, buttons, and badges are flat; depth comes from the white-on-#f4f5f6 surface stack and the 40px-radius cradling.

## Imagery

Product photography is the only imagery: iPhone mockups showing the live Glow app, rendered at 1× scale and centered in 40px-radius porcelain cradles. Token/coin illustrations are holographic 3D disks with iridescent rainbow reflections, floating in negative space around the phones. No lifestyle photography, no people, no environments — the product screen IS the hero. The Plasma Gradient logo mark and lightning-bolt orange icon are the only branded graphic elements.

## Layout

Two-column hero (text-left, phone-mockup-right) inside a 1200px max-width container on a full-bleed #f4f5f6 canvas. Below the fold, single-column sections each centered around a phone mockup with a heading above and feature list below. Section rhythm: spacious 64px gaps, alternating placement of phones (center, then offset, then center) to create visual cadence. Navigation is a minimal top-left wordmark only — no nav bar, no menu, no CTA in the header. The Ghosted Feature Text Layer tiles the right side of the hero as decorative background type. Footer is a single inline link row, no container.

## Agent Prompt Guide

**Quick Color Reference**
- text: #131517
- background: #f4f5f6
- surface/card: #ffffff
- border: #b3b5b7
- accent: #cc62d5
- primary action: #cc62d5 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #cc62d5 background, #131517 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Phone mockup card:** Outer panel #f4f5f6, border-radius 40px, padding 64px. Inside, an iPhone frame with a #ffffff screen and a subtle 0 12px 32px rgba(0,0,0,0.06) shadow.

3. **NEW badge:** #fef0e8 background, #ec660d text, Roobert 600 12px uppercase, letter-spacing 1px, border-radius 4px, padding 2px 8px.

4. **All-caps feature label:** Roobert 500, 12px, uppercase, letter-spacing 0.083em, color #737577. Use for 'EXPLORE GLOW FEATURES' style section dividers.

5. **Section heading block:** Centered on #f4f5f6, heading in Roobert 700 40px line-height 1.1 letter-spacing -0.72px color #131517, with a 64px gap to the next section.

## Gradient System

One gradient is used in the system: the Plasma Gradient on the brand logo mark. radial-gradient(86% 86% at 6% 9%, #8800ff 0%, #a732d6 51%, #ef79ff 100%). It is anchored top-left, creating a luminous spot that fades from deep purple to hot pink. This gradient must not be reused for backgrounds, buttons, or decorative washes — it is an identity-only element. All other surfaces are flat color.

## Similar Brands

- **Phantom** — Same Solana-wallet product page structure — phone mockup hero, single saturated brand color, quiet white canvas with one vivid accent
- **Rainbow Wallet** — Similar product-showcase pattern with playful gradient branding on a minimal white landing page
- **Foundation (NFT marketplace)** — Gallery-white layout with oversized typography and large-radius cards cradling product artifacts
- **Zerion** — Clean DeFi product site with tight-tracked geometric sans (Inter-class) and confident bold display headlines
- **Backpack (xNFT wallet)** — Same Solana-wallet audience and product-card density, with phone mockups as the central visual artifact

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-magenta: #cc62d5;
  --color-plasma-gradient: #a732d6;
  --gradient-plasma-gradient: radial-gradient(86% 86% at 6% 9%, rgb(136, 0, 255) 0%, rgb(167, 50, 214) 51%, rgb(239, 121, 255) 100%);
  --color-ember-orange: #ec660d;
  --color-signal-red: #e83b47;
  --color-ink-black: #131517;
  --color-porcelain: #f4f5f6;
  --color-pure-white: #ffffff;
  --color-graphite: #333537;
  --color-stone: #737577;
  --color-mist: #b3b5b7;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.996px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.288px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.324px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.432px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.72px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.008px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 19px;
  --radius-3xl: 40px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 40px;
  --radius-pills: 100px;
  --radius-small: 8px;
  --radius-badges: 4px;
  --radius-buttons: 19px;

  /* Surfaces */
  --surface-porcelain-canvas: #f4f5f6;
  --surface-pure-white-card: #ffffff;
  --surface-ink-surface: #131517;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-magenta: #cc62d5;
  --color-plasma-gradient: #a732d6;
  --color-ember-orange: #ec660d;
  --color-signal-red: #e83b47;
  --color-ink-black: #131517;
  --color-porcelain: #f4f5f6;
  --color-pure-white: #ffffff;
  --color-graphite: #333537;
  --color-stone: #737577;
  --color-mist: #b3b5b7;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.996px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.288px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.324px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.432px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.72px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.008px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 19px;
  --radius-3xl: 40px;
  --radius-full: 100px;
}
```
