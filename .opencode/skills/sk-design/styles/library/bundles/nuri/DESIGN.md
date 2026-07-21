# Nuri — Style Reference
> Lavender art-deco bank lobby — pill-soft, serif-meets-stencil, cool violet bleeding into warm cream.

**Theme:** light

Nuri operates on a soft lavender canvas with a single bold typographic gesture: enormous Sharp Grotesk black-slab headlines colliding with whisper-weight Harriet Display serifs in the same line, like a financial publication cut by a graffiti stencil. The palette stays in cool violet territory across canvas, card, and hero surfaces, with a warm cream band cutting in near the footer — a deliberate cool-to-warm color temperature arc that signals a human, editorial fintech rather than a blue-and-white banking clone. Surfaces are pill-soft (9999px and 48px radii dominate), shadows are nearly absent, and accents appear as small illustrated characters and one Bitcoin-orange punctuation mark rather than as saturated UI chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hero Violet | `#beaaff` | `--color-hero-violet` | Hero section background, full-bleed brand wash — saturated lavender makes the page unmistakable from a thumbnail |
| Card Lilac | `#e2d9ff` | `--color-card-lilac` | Card and panel surfaces — desaturated companion to Hero Violet, used for elevated content blocks on the lighter canvas |
| Bitcoin Orange | `#f97316` | `--color-bitcoin-orange` | Accent for the Bitcoin currency icon and selective callouts — the only warm chromatic note in a cool palette, anchoring the crypto identity |
| Warm Cream | `#fff7ed` | `--color-warm-cream` | Footer band and warm transitions — breaks the lavender monotony with a peach-tinged neutral |
| Lavender Mist | `#f7f2ff` | `--color-lavender-mist` | Page canvas — the dominant background across most sections, a barely-there violet tint instead of pure white |
| Off-White | `#f9fafb` | `--color-off-white` | Footer base surface, light secondary backgrounds |
| Pure White | `#ffffff` | `--color-pure-white` | Button text, inverse surfaces, card highlights on colored backgrounds |
| Ink Plum | `#2c232e` | `--color-ink-plum` | Primary text, filled button backgrounds, dark borders — near-black with a violet undertone that keeps it on-palette |
| Graphite | `#4b5563` | `--color-graphite` | Secondary headings, link text, subdued body copy |
| Slate | `#6b7280` | `--color-slate` | Muted helper text, captions, tertiary metadata |
| Steel | `#374151` | `--color-steel` | Icon strokes, button text on light surfaces, mid-emphasis labels |
| Mist | `#e2e8f0` | `--color-mist` | Hairline borders, dividers, input outlines — the universal 1px rule throughout the UI |
| Fog | `#d1d5db` | `--color-fog` | Button borders, disabled-state surfaces, secondary dividers |
| Jet | `#000000` | `--color-jet` | Maximum-contrast text, logo marks, hard-edge elements where Ink Plum feels too soft |

## Tokens — Typography

### Sharp Grotesk Bold — Display headlines for brand words ('NURI', 'BACK.') — extreme weight 900 with tight tracking creates a stencil/spray-paint impact that contrasts deliberately with the serif body of the same headline. At 118px it fills the hero column; the 0.018em positive tracking at that size is unusual and prevents the slabs from merging at extreme scale. · `--font-sharp-grotesk-bold`
- **Substitute:** Druk Wide Bold, Knockout 90, Antonio Black
- **Weights:** 900
- **Sizes:** 72px, 118px
- **Line height:** 0.90, 1.00
- **Letter spacing:** -0.0200em at 72px, 0.0180em at 118px
- **Role:** Display headlines for brand words ('NURI', 'BACK.') — extreme weight 900 with tight tracking creates a stencil/spray-paint impact that contrasts deliberately with the serif body of the same headline. At 118px it fills the hero column; the 0.018em positive tracking at that size is unusual and prevents the slabs from merging at extreme scale.

### Harriet Display — Editorial serif used for headline companions ('BANK IS', 'One Tap. You're In.'), feature section headings, and the hero subhead — weight 300 at 50–62px is a restrained, magazine-display choice that creates tension with the 900-weight sans beside it. The 0.90 line-height at display sizes keeps stacked lines touching like fine print. · `--font-harriet-display`
- **Substitute:** Source Serif Pro, PT Serif, Lora
- **Weights:** 300, 400
- **Sizes:** 24px, 30px, 50px, 55px, 62px, 112px
- **Line height:** 0.90, 0.94, 1.20, 1.33
- **Role:** Editorial serif used for headline companions ('BANK IS', 'One Tap. You're In.'), feature section headings, and the hero subhead — weight 300 at 50–62px is a restrained, magazine-display choice that creates tension with the 900-weight sans beside it. The 0.90 line-height at display sizes keeps stacked lines touching like fine print.

### Inter — Workhorse for body, navigation, buttons, inputs, footer copy, card text — weight 400 for body, 500 for nav/links, 600 for subheadings and button labels. The tight 1.20–1.33 range for 20–32px sizes keeps mid-scale text compact and confident. · `--font-inter`
- **Substitute:** Inter (same), IBM Plex Sans, system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 15px, 16px, 17px, 20px, 24px, 28px, 32px
- **Line height:** 1.20, 1.32, 1.33, 1.40, 1.43, 1.50, 1.63
- **Role:** Workhorse for body, navigation, buttons, inputs, footer copy, card text — weight 400 for body, 500 for nav/links, 600 for subheadings and button labels. The tight 1.20–1.33 range for 20–32px sizes keeps mid-scale text compact and confident.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.32 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 32px | 1.33 | — | `--text-heading` |
| heading-lg | 50px | 1.2 | — | `--text-heading-lg` |
| display | 72px | 1 | -1.44px | `--text-display` |
| display-xl | 112px | 0.9 | 2.02px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

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
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 48px |
| icons | 9999px |
| badges | 9999px |
| inputs | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |
| subtle | `rgba(44, 35, 46, 0.16) 0px 0px 0px 1px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Dark Pill Button
**Role:** Primary form submission (Get App, Submit)

Filled background #2c232, white text in Inter weight 600, 9999px radius, 12px 24px padding, 8px vertical internal padding on text rows. Sits inside the phone-number input on a lavender-tinted shell.

### Ghost Outline Button
**Role:** Secondary action (Sign In with Passkey)

Transparent background, 1px border in #2c232, Inter weight 600 text in #2c232, 9999px radius, 14px 24px padding. Renders as a thin dark ring on a light card surface.

### Phone Number Input
**Role:** Hero lead-capture field

Outer pill shell: 9999px radius, #ffffff background, 1px hairline border in #e2e8f0, 8px vertical padding. Inner: country flag prefix, Inter 16px #2c232 for number, Dark Pill Button docked inside the right edge.

### App Store Badge
**Role:** Download CTA pair

Black (#000000) rounded rectangle, Apple/Google logo + label in white, 8px corner radius, approximately 40px tall. Paired horizontally with consistent gap.

### Cryptocurrency Icon Row
**Role:** Trust signal — accepted currencies

Small circular icons at ~32px diameter on a single row, including Bitcoin (orange #f97316 fill), Ethereum, and others. The Bitcoin circle anchors the color story; the rest are muted.

### Mixed-Weight Headline
**Role:** Hero display text

A single line combining Sharp Grotesk Bold 900 at 112–118px for the brand-anchor word ('NURI', 'BACK.') with Harriet Display 300 at 50–62px for the connecting words ('BANK IS'). Tight 0.90–1.00 line-height stacks them as a single optical block.

### Section Headline (Serif)
**Role:** Feature section titles

Harriet Display 300–400 at 50–55px, #2c232, line-height 1.20. Used standalone on white or lavender-mist backgrounds, often centered or left-aligned beside a device mockup.

### Device Mockup Frame
**Role:** Phone/app showcase

iPhone-style bezel with thin dark border, displayed centered on Lavender Mist or Hero Violet. The interior shows the app's own UI — illustrations on a lavender card with its own CTA pills stacked vertically.

### Editorial Body Text
**Role:** Hero subhead and section descriptions

Harriet Display 300 at 20–24px, #2c232 or #4b5563, generous line-height 1.33–1.50. Feels like a magazine pull-quote rather than a SaaS subtitle.

### Top Navigation Bar
**Role:** Site header

Transparent or Lavender Mist background, no visible border. Left: small square NURI logo mark (#2c232 on lavender tile). Right: language switcher pill (#ffffff background, country flag + 'English', 9999px radius, 12px padding).

### Illustration Panel
**Role:** Decorative editorial art

Large-scale character or object illustrations rendered in flat warm tones (browns, greens, peach) on lavender or cream backgrounds. Occupies significant vertical space near the footer — the visual equivalent of a magazine cover.

### Footer Band
**Role:** Site footer with legal and download links

Warm Cream (#fff7ed) or Off-White (#f9fafb) background, Inter 14px #4b5563 for legal copy, centered layout with Privacy/Terms links and a centered '© 2026 Nuri' copyright. App store badges and Visa/Gnosis Pay logos in a single row.

## Do's and Don'ts

### Do
- Use 9999px radius for every button, input, and interactive pill — the pill shape is the signature
- Pair Sharp Grotesk Bold 900 with Harriet Display 300 in the same headline for the signature mixed-weight effect
- Set page background to #f7f2ff and hero background to #beaaff — never pure white as the dominant canvas
- Apply the 48px radius to cards and large containers, reserving 9999px for interactive elements
- Use #2c232 for primary text and filled buttons — its violet undertone keeps it on-palette against lavender
- Break sections into full-bleed color bands that transition from cool violet to warm cream toward the footer
- Anchor the color story with #f97316 only on the Bitcoin currency icon — it is the sole warm accent

### Don't
- Do not use standard banking blue, green, or neutral gray as a brand color — it breaks the lavender identity
- Do not apply heavy drop shadows — the system relies on surface color contrast, not elevation, for depth
- Do not mix the Sharp Grotesk 900 and Harriet 300 at the same size — the contrast is in their weight difference at different sizes
- Do not use border-radius values between 8px and 48px on primary surfaces — the system jumps from pill to soft-card
- Do not place more than one filled chromatic button per section — the dark pill is the only primary action
- Do not use stock photography or 3D renders — the visual language is flat editorial illustration on lavender
- Do not set body type below 16px in Inter — the 14–16px floor preserves the spacious, magazine-like feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f7f2ff` | Default page background — barely-tinted lavender |
| 1 | Card Lilac | `#e2d9ff` | Elevated content panels and feature cards |
| 2 | Hero Violet | `#beaaff` | Full-bleed hero band and brand-wash sections |
| 3 | Warm Cream | `#fff7ed` | Footer band — warm counterpoint to cool violet |
| 4 | Off-White | `#f9fafb` | Footer base and neutral light sections |

## Elevation

- **Dark Pill Button:** `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px`
- **Phone Number Input (focused state):** `rgba(44, 35, 46, 0.16) 0px 0px 0px 1px`

## Imagery

Editorial illustration is the dominant visual asset — flat, hand-drawn character portraits and object compositions (a woman with a cactus, a close-cropped face filling the viewport) rendered in warm earth tones (browns, peach, sage green) that deliberately contrast with the cool lavender UI. The illustrations occupy full viewport-width bands near the footer, functioning as a magazine-cover climax. Device mockups (iPhone frames) are used as product showcases in mid-page sections. No photography appears; the brand avoids lifestyle imagery entirely in favor of illustrated narrative. Icons are simple, monocolor, and small (32px cryptocurrency marks, small UI icons in #374151). The hero gradient is a soft radial wash of violet fading to transparent — atmospheric rather than structural.

## Layout

Full-bleed sections stacked vertically with alternating surface colors: Hero Violet band → Lavender Mist band → Warm Cream band → large illustration band. Hero is a two-column split with left-aligned headline and phone-input stack on the left, illustrative photograph (hand holding card near cactus) on the right. Mid-page sections use a centered three-column pattern: serif text left, device mockup center, serif text right — a classic editorial spread. The page max-width is approximately 1200px for content containers, but hero sections break to full-bleed. Navigation is a minimal top bar with logo left and language switcher right. Vertical rhythm uses 64px section gaps with 48px internal spacing. The overall density is spacious — single headlines and single CTAs per section, with generous breathing room around each block.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2c232e
- background: #f7f2ff
- border: #e2e8f0
- accent: #beaaff
- primary action: #f97316 (filled action)

**Example Component Prompts**
1. **Hero Mixed-Weight Headline**: Render 'NURI BANK IS BACK.' on a #beaaff full-bleed background. 'NURI' and 'BACK.' in Sharp Grotesk Bold at 118px weight 900, letter-spacing 0.018em, color #2c232e, line-height 0.90. 'BANK IS' in Harriet Display at 50px weight 300, color #2c232e, positioned between the two display lines as a single stacked block.

2. **Phone Number Input with Dark Pill**: Outer pill on #f7f2ff background, 9999px radius, 1px border #e2e8f0, 8px vertical padding. Country flag + Inter 16px #2c232e placeholder 'Mobile number' on the left. Dark Pill Button (#2c232e fill, white Inter 600 'Get App' text, 9999px radius, 12px 24px padding) docked to the right inside the shell.

3. **Ghost Outline Secondary Button**: Transparent background, 1px border #2c232e, Inter 600 16px 'Sign In with Passkey' in #2c232e, 9999px radius, 14px 24px padding. Place on a #e2d9ff card surface.

4. **Serif Section Title**: Harriet Display 300 at 55px, color #2c232e, line-height 1.20, centered or left-aligned on Lavender Mist (#f7f2ff) background beside a centered iPhone mockup frame.

5. **Cryptocurrency Trust Row**: Horizontal row of 32px circular icons on #f7f2ff. Bitcoin circle filled #f97316 with white 'B' mark; other currency circles in #4b5563 outline style. 12px gap between icons, 8px gap to a 'VISA' and 'SEPA' text lockup in Inter 500 14px #4b5563.

## Gradient System

One signature gradient defines the hero atmosphere: radial-gradient(circle at 50% 0%, rgba(190, 170, 255, 0.45), rgba(0, 0, 0, 0) 48%). It bleeds from the top-center as a soft violet glow over the Hero Violet (#beaaff) background, creating a sense of overhead light source. Do not introduce additional gradients — the system relies on flat color blocks and this single atmospheric wash.

## Similar Brands

- **Revolut** — Same pill-shaped buttons and spacious section rhythm, though Nuri swaps Revolut's black-and-white for a violet editorial palette
- **Plaid** — Same editorial serif headlines mixed with bold sans wordmarks, though Nuri's color story is warmer-cool lavender rather than black-and-coral
- **Cash App** — Same oversized, ultra-bold display type and pill buttons, though Nuri uses serif companions and a lavender canvas instead of Cash App's neon green
- **Stripe** — Same spacious light-mode fintech layout with generous section gaps, though Nuri leans editorial-illustration where Stripe is flat-product

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hero-violet: #beaaff;
  --color-card-lilac: #e2d9ff;
  --color-bitcoin-orange: #f97316;
  --color-warm-cream: #fff7ed;
  --color-lavender-mist: #f7f2ff;
  --color-off-white: #f9fafb;
  --color-pure-white: #ffffff;
  --color-ink-plum: #2c232e;
  --color-graphite: #4b5563;
  --color-slate: #6b7280;
  --color-steel: #374151;
  --color-mist: #e2e8f0;
  --color-fog: #d1d5db;
  --color-jet: #000000;

  /* Typography — Font Families */
  --font-sharp-grotesk-bold: 'Sharp Grotesk Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-harriet-display: 'Harriet Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.32;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.33;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.2;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;
  --text-display-xl: 112px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: 2.02px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 48px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 48px;
  --radius-icons: 9999px;
  --radius-badges: 9999px;
  --radius-inputs: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle: rgba(44, 35, 46, 0.16) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-page-canvas: #f7f2ff;
  --surface-card-lilac: #e2d9ff;
  --surface-hero-violet: #beaaff;
  --surface-warm-cream: #fff7ed;
  --surface-off-white: #f9fafb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hero-violet: #beaaff;
  --color-card-lilac: #e2d9ff;
  --color-bitcoin-orange: #f97316;
  --color-warm-cream: #fff7ed;
  --color-lavender-mist: #f7f2ff;
  --color-off-white: #f9fafb;
  --color-pure-white: #ffffff;
  --color-ink-plum: #2c232e;
  --color-graphite: #4b5563;
  --color-slate: #6b7280;
  --color-steel: #374151;
  --color-mist: #e2e8f0;
  --color-fog: #d1d5db;
  --color-jet: #000000;

  /* Typography */
  --font-sharp-grotesk-bold: 'Sharp Grotesk Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-harriet-display: 'Harriet Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.32;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.33;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.2;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;
  --text-display-xl: 112px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: 2.02px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 48px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle: rgba(44, 35, 46, 0.16) 0px 0px 0px 1px;
}
```
