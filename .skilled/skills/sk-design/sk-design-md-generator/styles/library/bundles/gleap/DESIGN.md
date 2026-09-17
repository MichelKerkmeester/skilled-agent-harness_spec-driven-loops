# Gleap — Style Reference
> warm cream-paper workspace with graphite accents — a studio where matte-black ink dots float over linen architecture.

**Theme:** light

Gleap operates in a warm-paper product language: a slightly cream canvas carries flat, low-elevation surfaces in sage-tinted stone, with almost no chromatic presence — one vivid green dot punctuates an otherwise fully achromatic system. The whole product reads as architectural: weight 400 headlines, tight -0.01em tracking, and pill-shaped controls feel drawn rather than printed. Color is rationed to functional punctuation (status dots, active nav dots, gradient-free product screenshots) while the primary CTA is a matte black capsule, not a brand-colored button. Surfaces stack from canvas → white card → sage tile → glass overlay without ever using shadows as decoration; depth is communicated through color temperature shifts from cool gray to warm stone.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Linen Canvas | `#edede8` | `--color-linen-canvas` | Page background, section surfaces — warm off-white that pushes the whole system toward paper rather than screen |
| Frosted White | `#ffffff` | `--color-frosted-white` | Card surfaces, elevated panels, glass overlays — clean white floats above the linen canvas for primary content |
| Warm Stone | `#dbdbd2` | `--color-warm-stone` | Secondary card fills, secondary button backgrounds, accent surface — sage-tinted beige gives neutral elements warmth without becoming chromatic |
| Pebble | `#c0c0c0` | `--color-pebble` | Circular accent tiles, muted card backgrounds — cool gray that sits one step back from stone for de-emphasized surfaces |
| Graphite Ink | `#141414` | `--color-graphite-ink` | Primary action button background, dark text on light surfaces — near-black with a hair of warmth, anchors every CTA |
| Charcoal Body | `#292929` | `--color-charcoal-body` | Primary body and heading text — readable but softer than pure black, keeps long-form copy from feeling harsh |
| Slate Caption | `#6f6f6e` | `--color-slate-caption` | Secondary body, helper text, descriptive copy — carries the most volume of any text color |
| Ash Subheading | `#8f8f8e` | `--color-ash-subheading` | Subtle labels, muted headings, decorative type — sits between caption and hairline |
| Iron Nav | `#353535` | `--color-iron-nav` | Secondary body text, navigation labels, and subdued headings. Do not promote it to the primary CTA color |
| Onyx Border | `#000000` | `--color-onyx-border` | Hairline borders, strong dividers, selected-state outlines — used at 1-2px to outline cards, buttons, and focus rings |
| Quartz | `#d0d0c8` | `--color-quartz` | Quietest surface tint, reserved for low-contrast dividers and hover-state hints |
| Lime Pulse | `#4cc02b` | `--color-lime-pulse` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Switzer — Primary typeface for all UI, body, headings, and buttons. Weight 400 dominates even at display sizes — headlines whisper rather than shout, which gives the brand authority through restraint. The Minor Third scale (1.2) is unusually compressed for a SaaS site, so sizes cluster more tightly than a Major Third or Perfect Fourth system would produce. · `--font-switzer`
- **Substitute:** Inter, Manrope, or DM Sans at matching weights
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 17, 19, 23, 27, 32, 38, 40, 45, 64, 80
- **Line height:** 1.0 / 0.8 / 1.2 / 1.3 / 1.35 / 1.4 / 1.5 / 1.77
- **Letter spacing:** -0.02em at 80px display, -0.01em at 64px and below, normal at body sizes — tight tracking compounds the calm architectural feel
- **Role:** Primary typeface for all UI, body, headings, and buttons. Weight 400 dominates even at display sizes — headlines whisper rather than shout, which gives the brand authority through restraint. The Minor Third scale (1.2) is unusually compressed for a SaaS site, so sizes cluster more tightly than a Major Third or Perfect Fourth system would produce.

### system-ui — Icon-internal text and OS-native labels — minimal usage, mostly decorative · `--font-system-ui`
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.0
- **Role:** Icon-internal text and OS-native labels — minimal usage, mostly decorative

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400, 600
- **Sizes:** 15px
- **Line height:** 1.6
- **Letter spacing:** 0.007
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| small | 12px | 1.77 | — | `--text-small` |
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 19px | 1.4 | -0.19px | `--text-body` |
| body-lg | 23px | 1.35 | -0.23px | `--text-body-lg` |
| subheading | 27px | 1.3 | -0.27px | `--text-subheading` |
| heading-sm | 32px | 1.3 | -0.32px | `--text-heading-sm` |
| heading | 45px | 1.2 | -0.45px | `--text-heading` |
| heading-lg | 64px | 0.8 | -0.64px | `--text-heading-lg` |
| display | 80px | 1 | -1.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 84 | 84px | `--spacing-84` |
| 96 | 96px | `--spacing-96` |
| 138 | 138px | `--spacing-138` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 200px |
| avatars | 9999px |
| buttons | 200px |
| innerTiles | 6px |
| smallElements | 3.75px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.3) 0px 32px 68px 0px` | `--shadow-xl` |
| xl-2 | `rgba(16, 24, 40, 0.12) 0px 18px 55px 0px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 18px
- **Element gap:** 9px

## Components

### Pill Button — Dark (Primary)
**Role:** Primary CTA

Matte black capsule. Background #141414, text #ffffff, border-radius 200px, padding 0 18px, height matches line-height at 16px text (≈44px). Weight 400 in Switzer at 16px. Letter-spacing inherits body tracking.

### Pill Button — Stone (Secondary)
**Role:** Secondary action, pricing CTA

Warm sage capsule. Background #dbdbd2, text #292929, optional 1-2px #292929 border, border-radius 200px, padding 0 24px, height ≈44px. Same Switzer 16px/400 as primary. This is the workhorse — pricing cards, demo buttons, and feature CTAs use this instead of the dark fill.

### Pill Button — Ghost (Tertiary)
**Role:** Inline link, low-emphasis action

Transparent fill, 1px #353535 border, text #353535, border-radius 200px, padding 9px 12px. Smaller padding profile marks it as a lightweight control, not a section-level CTA.

### Square White Button
**Role:** Consent dialog action

The system outlier. Background #ffffff, text #000000, border-radius 3.75px (sharp — breaks the pill language intentionally for cookie/consent contexts), padding 15px square. Use only when the pill vocabulary is wrong for the context.

### Feature Card — Warm Stone
**Role:** Feature highlight, de-emphasized panel

Background #dbdbd2, border-radius 12px, padding 18px, no shadow. Used for secondary feature blocks that should recede behind the main white content card.

### Feature Card — White
**Role:** Primary content panel

Background #ffffff, border-radius 12px, padding 18px, optional 1px solid #0000001f border. The default elevated surface. No shadow by default; depth comes from the warmer canvas behind it.

### Glass Overlay Panel
**Role:** Floating widget, sticky chat

Background rgba(255, 255, 255, 0.7), border-radius 6px, padding 18px, backdrop-filter blur(12px). Used for the floating support widget and any UI that needs to float over imagery while staying legible.

### Circular Accent Tile
**Role:** Category icon container, decorative dot

Background #c0c0c0, border-radius 50%, no padding (icon centered inside). Functions as a quiet visual marker — never the primary CTA, always a supporting element.

### Navigation Bar
**Role:** Top-level site navigation

Transparent background over linen canvas. Logo + product nav + auth links + dark pill CTA right-aligned. Height ≈60px. Nav text in #353535 at 14-16px Switzer 400.

### Pricing Card
**Role:** Pricing tier display

Background #dbdbd2 with 12px radius and 18px padding. Tier name and price at 32px/27px Switzer 400. Checklist uses Lime Pulse (#4cc02b) checkmarks at 14-16px. Featured tier gains a subtle gradient highlight strip across the top edge.

### Trust Bar
**Role:** Social proof row

Horizontal row of grayscale customer logos with one-line caption at left. Logos desaturated to monochrome at 60-80% opacity. 9-12px vertical gap between logo and caption.

### Status Dot
**Role:** Online indicator, success pulse

8px circle filled with #4cc02b (Lime Pulse). The single chromatic element in the system — appears next to live chat, active features, and system status. Use sparingly.

## Do's and Don'ts

### Do
- Use 200px border-radius on every button and pill — the capsule shape is non-negotiable for brand recognition
- Set primary CTAs to #141414 fill with white text; use the stone (#dbdbd2) capsule as the default for any non-purchase action
- Keep headlines at weight 400 Switzer with -0.01em tracking at 64px and below, -0.02em at 80px display — never bold a headline above body weight
- Use the linen canvas (#edede8) as the base; place white (#ffffff) cards on top for contrast, and step down to stone (#dbdbd2) for de-emphasized content
- Apply backdrop-filter blur(12px) to any panel that floats over imagery or gradient backgrounds
- Use #4cc02b Lime Pulse only as a status dot or checkmark — never as a button fill, page accent, or decorative color
- Pair the 6px base unit for inline gaps with 18px card padding and 80px section gaps to maintain the comfortable density

### Don't
- Don't introduce a brand-colored CTA — the system is intentionally chromatic-free; colored buttons would break the architectural language
- Don't use bold (600+) on headlines — weight 400 at display sizes is the signature; heavier weights belong in buttons and badges only
- Don't stack more than three surface tones in one screen (canvas → white → stone); the palette is rationed to preserve warmth
- Don't use drop shadows as decoration — if depth is needed, shift surface tone from white to stone to graphite instead
- Don't apply sharp corners to feature cards or panels — 12px is the floor for content surfaces; only consent dialogs may use 3.75px
- Don't add gradients to UI elements — the gradient zone is reserved for the hero product screenshot backdrop only
- Don't use letter-spacing wider than -0.01em on body copy; positive tracking breaks the tight architectural feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Linen Canvas | `#edede8` | Page background — warm off-white that warms the entire system |
| 1 | Frosted White | `#ffffff` | Primary card surface, feature panels, elevated content blocks |
| 2 | Warm Stone | `#dbdbd2` | Secondary surface for pricing cards, de-emphasized panels, button backgrounds |
| 3 | Glass Overlay | `#ffffffb3` | Floating panels, chat widgets, sticky elements — paired with backdrop blur(12px) |
| 4 | Graphite | `#141414` | Inverted surface — dark CTAs, emphasis blocks, cookie consent panels |

## Elevation

- **Floating Chat Widget:** `rgba(0, 0, 0, 0.3) 0px 32px 68px 0px`
- **Glass Overlay Panel:** `rgba(16, 24, 40, 0.12) 0px 18px 55px 0px`

## Imagery

Product screenshots dominate over photography — the hero features a full app interface rendered against a soft gradient backdrop of lavender, teal, and peach (decorative, not part of the design system palette). Secondary imagery is tight UI crops with no lifestyle context. No stock photography, no illustrations, no 3D renders. Icons are monoline outlined at consistent stroke weight, sitting flat on circular pebble (#c0c0c0) tiles. The visual narrative is entirely product-led: the interface IS the hero.

## Layout

Max-width 1200px centered container with generous outer padding. Hero is a centered text stack (display headline, sub-headline, description, trust bar, dual CTA) followed by a full-width product screenshot with gradient backdrop. Sections alternate between linen canvas and white card surfaces separated by 80px gaps. Feature blocks use a 2-column text-plus-screenshot layout that alternates sides. Pricing is a 4-column card grid with equal widths. The footer is a multi-column link directory (4 nav blocks) over a slightly darker section tone. Navigation is a single transparent top bar with logo left and pill CTA right.

## Agent Prompt Guide

**Quick Color Reference**
- Text primary: #292929
- Text secondary: #6f6f6e
- Background (canvas): #edede8
- Surface (card): #ffffff
- Border (hairline): #0000001f
- Accent (status only): #4cc02b
- primary action: #141414 (filled action)

**Example Component Prompts**

1. *Create a hero section*: Linen canvas (#edede8) background, centered max-width 1200px. Display headline at 80px Switzer weight 500, color #292929, letter-spacing -1.6px. Sub-headline at 45px weight 400, color #292929. Body description at 19px weight 400, color #6f6f6e, line-height 1.4. Two CTAs centered: dark pill (#141414 fill, white text, 200px radius, 0 18px padding, 16px Switzer 400) followed by stone pill (#dbdbd2 fill, #292929 text, 200px radius, 0 24px padding).

2. Create a Primary Action Button: #141414 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. *Create a feature card*: White surface (#ffffff), 12px radius, 18px padding, no shadow. Optional 1px #0000001f border. Heading at 27px Switzer 400 in #292929. Body text at 16px Switzer 400 in #6f6f6e, line-height 1.5. Optional circular accent tile (background #c0c0c0, 50% radius, 40px diameter) at top of card containing an outlined icon in #353535.

4. *Create a floating chat widget*: Glass panel (rgba(255,255,255,0.7) with backdrop-filter blur(12px)), 6px radius, 18px padding, shadow rgba(0,0,0,0.3) 0 32px 68px 0. Header text at 16px Switzer 400 in #292929. Status indicator: 8px Lime Pulse (#4cc02b) circle to the left of any 'online' label. Position fixed bottom-right.

5. *Create a navigation bar*: Transparent background over linen canvas, height 60px, max-width 1200px centered. Logo at left in #292929 at 16px Switzer 500. Center nav links at 14px Switzer 400 in #353535 with 24px horizontal gap. Right cluster: Login link in #353535 + dark pill CTA (#141414 fill, white text, 200px radius, 0 18px padding).

## Gradient Zone

The only gradient usage in the system is the hero product screenshot backdrop — a soft sweep of lavender, peach, and teal that sits behind the app screenshot. This is decorative screenshot context, not a UI surface. No gradients are applied to buttons, cards, or text. Treat gradients as off-limits for component design; reserve them for full-bleed image backgrounds only.

## Color Rationing

Gleap's chromatic budget is exactly one color: #4cc02b Lime Pulse. This discipline is the brand. Adding a secondary brand color, accent palette, or status spectrum would dilute the architectural feel. Even success/warning/error states default to monochrome (icon + label) rather than chromatic swatches. If a state requires visual emphasis, use surface tone (white → stone → graphite) before reaching for hue.

## Similar Brands

- **Linear** — Same weight-400-at-display-sizes typography discipline and matte black pill-button vocabulary; both reject colored CTAs in favor of monochrome depth
- **Vercel** — Similar warm off-white canvas with tight tracking and pill-shaped controls; both treat color as rationed punctuation rather than decoration
- **Resend** — Shared architectural flatness — warm neutral surfaces, minimal shadows, product-screenshot-as-hero imagery, and weight 400 headlines that whisper
- **Frame.io** — Same dual-pill CTA pairing (dark primary + light secondary) and warm-paper product aesthetic with desaturated supporting imagery
- **Stripe (documentation)** — Identical approach to typography tracking (-0.01em at large sizes) and the same rationed chromatic palette with one accent green for status

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-linen-canvas: #edede8;
  --color-frosted-white: #ffffff;
  --color-warm-stone: #dbdbd2;
  --color-pebble: #c0c0c0;
  --color-graphite-ink: #141414;
  --color-charcoal-body: #292929;
  --color-slate-caption: #6f6f6e;
  --color-ash-subheading: #8f8f8e;
  --color-iron-nav: #353535;
  --color-onyx-border: #000000;
  --color-quartz: #d0d0c8;
  --color-lime-pulse: #4cc02b;

  /* Typography — Font Families */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-small: 12px;
  --leading-small: 1.77;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 19px;
  --leading-body: 1.4;
  --tracking-body: -0.19px;
  --text-body-lg: 23px;
  --leading-body-lg: 1.35;
  --tracking-body-lg: -0.23px;
  --text-subheading: 27px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.27px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.32px;
  --text-heading: 45px;
  --leading-heading: 1.2;
  --tracking-heading: -0.45px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -0.64px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-138: 138px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 18px;
  --element-gap: 9px;

  /* Border Radius */
  --radius-md: 3.75px;
  --radius-md-2: 6px;
  --radius-xl: 12px;
  --radius-3xl: 30px;
  --radius-full: 48px;
  --radius-full-2: 200px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 200px;
  --radius-avatars: 9999px;
  --radius-buttons: 200px;
  --radius-innertiles: 6px;
  --radius-smallelements: 3.75px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.3) 0px 32px 68px 0px;
  --shadow-xl-2: rgba(16, 24, 40, 0.12) 0px 18px 55px 0px;

  /* Surfaces */
  --surface-linen-canvas: #edede8;
  --surface-frosted-white: #ffffff;
  --surface-warm-stone: #dbdbd2;
  --surface-glass-overlay: #ffffffb3;
  --surface-graphite: #141414;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-linen-canvas: #edede8;
  --color-frosted-white: #ffffff;
  --color-warm-stone: #dbdbd2;
  --color-pebble: #c0c0c0;
  --color-graphite-ink: #141414;
  --color-charcoal-body: #292929;
  --color-slate-caption: #6f6f6e;
  --color-ash-subheading: #8f8f8e;
  --color-iron-nav: #353535;
  --color-onyx-border: #000000;
  --color-quartz: #d0d0c8;
  --color-lime-pulse: #4cc02b;

  /* Typography */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-small: 12px;
  --leading-small: 1.77;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 19px;
  --leading-body: 1.4;
  --tracking-body: -0.19px;
  --text-body-lg: 23px;
  --leading-body-lg: 1.35;
  --tracking-body-lg: -0.23px;
  --text-subheading: 27px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.27px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.32px;
  --text-heading: 45px;
  --leading-heading: 1.2;
  --tracking-heading: -0.45px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -0.64px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-138: 138px;

  /* Border Radius */
  --radius-md: 3.75px;
  --radius-md-2: 6px;
  --radius-xl: 12px;
  --radius-3xl: 30px;
  --radius-full: 48px;
  --radius-full-2: 200px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.3) 0px 32px 68px 0px;
  --shadow-xl-2: rgba(16, 24, 40, 0.12) 0px 18px 55px 0px;
}
```
