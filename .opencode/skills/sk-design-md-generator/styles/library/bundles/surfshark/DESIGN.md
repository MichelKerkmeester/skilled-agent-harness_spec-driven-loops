# Surfshark — Style Reference
> crisp ocean horizon at golden hour — warm coral sun meets teal sea, all floating on white sand

**Theme:** light

Surfshark's design language is a confident light-mode consumer SaaS anchored by a vivid teal brand mark and a warm coral primary action. Dark charcoal hero cards and feature panels provide high-contrast resting places between airy white sections, creating a rhythm of dark→light→dark that frames the product as both trustworthy and modern. Typography is exclusively Inter with a wide size range (12–60px) and a slight negative tracking at display sizes that tightens headlines without feeling clinical. Components lean rounded and pill-like — 48px card radii, 12px button radii — giving the interface a friendly, approachable feel. The three-color accent system (teal for brand identity, coral for conversion, yellow for promotional urgency) keeps the chromatic footprint tiny but high-impact, while a deep neutral scale handles 95% of the UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Surfshark Teal | `#1ebfbf` | `--color-surfshark-teal` | Brand mark icon, accent highlights, inline link emphasis — the signature chromatic thread that ties logo, headings, and accent text together |
| Coral Pulse | `#fa3556` | `--color-coral-pulse` | Primary action buttons, high-urgency CTAs — warm pink-red against the cool palette creates immediate conversion pull |
| Promo Gold | `#ffc200` | `--color-promo-gold` | Promotional banner background, limited-time deal strips — golden yellow reserved exclusively for urgency framing |
| Charcoal Ink | `#16191c` | `--color-charcoal-ink` | Primary text, dark hero backgrounds, footer surfaces, button text on coral — near-black with a hint of cool depth |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark fills, text on coral CTAs |
| Fog White | `#f9f9f9` | `--color-fog-white` | Alternate canvas surface, subtle card backgrounds, soft section differentiation from pure white |
| Tide Tint | `#e8f7f8` | `--color-tide-tint` | Faint teal-tinted surface wash — barely-perceptible background variant for feature blocks |
| Ash Gray | `#dadadd` | `--color-ash-gray` | Light borders, dividers, subtle separation lines — cooler-toned hairline color |
| Mist Gray | `#bfbfc0` | `--color-mist-gray` | Secondary borders, disabled states, heavy-use divider color (highest neutral frequency after black) |
| Slate | `#5b6065` | `--color-slate` | Muted body text, secondary copy, icon strokes in resting state |
| Graphite | `#393e41` | `--color-graphite` | Navigation borders, tertiary UI elements, slightly lighter than Charcoal for layered depth |
| Carbon | `#000000` | `--color-carbon` | Maximum-contrast borders, SVG icon fills, structural strokes — used heavily for crisp 1px rules |
| Deep Abyss | `#1e2327` | `--color-deep-abyss` | Alternate dark surface — slightly bluer than Charcoal, used in distinct dark panels |

## Tokens — Typography

### Inter — Sole typeface across the entire product — 400 for body and descriptions, 600 for navigation, subheadings, and emphasis, 700 for display headlines and button labels. Inter's geometric neutrality and tall x-height keep the system legible at 12px captions while the 60px display weight holds authority without requiring a custom display face. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto
- **Weights:** 400, 600, 700
- **Sizes:** 12, 14, 16, 18, 24, 32, 40, 48, 60
- **Line height:** 1.0–1.75
- **Letter spacing:** -1.5px at 60px (-0.025em), near-zero at body sizes, +0.24px at 14px (0.017em) for micro-copy
- **OpenType features:** `\"cv11\", \"ss01\"`
- **Role:** Sole typeface across the entire product — 400 for body and descriptions, 600 for navigation, subheadings, and emphasis, 700 for display headlines and button labels. Inter's geometric neutrality and tall x-height keep the system legible at 12px captions while the 60px display weight holds authority without requiring a custom display face.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.17px | `--text-caption` |
| body-sm | 14px | 1.71 | 0.24px | `--text-body-sm` |
| body | 16px | 1.75 | — | `--text-body` |
| subheading | 18px | 1.67 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.3 | — | `--text-heading` |
| heading-lg | 40px | 1.21 | — | `--text-heading-lg` |
| display | 60px | 1.07 | -1.5px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 48px |
| links | 8px |
| pills | 96px |
| small | 8px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Promo Banner
**Role:** Top-of-page limited-time deal strip

Full-width 40px tall bar with #ffc200 background, centered 14px Inter weight 400 black text, no border or radius. Reserved for time-sensitive offers; appears above the navigation.

### Primary Navigation
**Role:** Sticky top navigation bar

White (#ffffff) background, 64px height. Left: Surfshark logo (teal 

### Hero Card (Dark)
**Role:** Full-bleed conversion-focused hero

#16191c background with 64px border-radius, full width up to 1200px max. Left column: 60px Inter weight 700 white headline, teal #1ebfbf inline accent text at 24px, white checkmark bullet list (16px), coral CTA button. Right column: product/hero image. Generous 48–64px internal padding.

### Coral Filled Button
**Role:** Primary conversion action

#fa3556 background, white text, 12px border-radius, 16px vertical × 24px horizontal padding, 16px Inter weight 600. The only fully chromatic filled button in the system. Used for 

### Dark Filled Button
**Role:** Secondary action on light backgrounds

#16191c background, white text, 12px border-radius, 16px × 24px padding, 16px Inter weight 600. Used when coral would compete with a nearby primary CTA.

### Text Link with Arrow
**Role:** Inline navigational link

16px Inter weight 600 #16191c text with trailing 

### Checkmark Feature List
**Role:** Benefit bullet list in hero/feature blocks

Teal #1ebfbf checkmark icon (16px) + 16px Inter weight 400 white or charcoal text, 8–12px row gap, left-aligned.

### Feature Card (Light)
**Role:** Product feature highlight card

#ffffff or #f9f9f9 background, 48px border-radius, 32px padding, no shadow or 1px #dadadd border. 24–32px Inter weight 700 charcoal heading, 16px body text in #5b6065.

### Feature Card (Dark)
**Role:** Alternating dark feature panel

#16191c or #1e2327 background, 48px border-radius, 32px padding. White 32px heading, #bfbfc0 or #dadadd body text, optional teal 

### Reviewer Avatar Strip
**Role:** Social proof header above testimonials

Row of 5–7 circular avatar images (64px diameter, full crop, no border), centered horizontally with 8–12px overlap. Small caption row beneath in 12px Inter weight 400 #5b6065.

### Testimonial Block
**Role:** Centered quote with attribution

White background, centered 32–40px Inter weight 700 #16191c quote text, 12px uppercase Inter weight 600 attribution name in #16191c, 14px #5b6065 subscriber count, dark charcoal pill button below.

### Pill Tag (Rating Badge)
**Role:** Star-rating display chip

Small inline label like 

### Footer
**Role:** Site-wide footer with link columns

#16191c or near-black background, white 16px link columns organized under bold 14px Inter weight 700 white headings, 32px column gap, 48px vertical padding. Logo repeats in white/teal at top.

### Pill Button (Dark)
**Role:** Compact secondary CTA in testimonial/mid-page zones

#16191c background, white 16px Inter weight 600 text, 96px border-radius (full pill), 12px × 24px padding. Used for 

## Do's and Don'ts

### Do
- Use Inter exclusively — never introduce a secondary typeface for display or body.
- Apply the three-color accent rule: teal for brand identity, coral for conversion, yellow for time-sensitive promos only.
- Use 12px radius for standard buttons and 48px radius for feature cards — these two radii define the system's personality.
- Maintain the dark→light→dark section rhythm: alternate between #16191c panels and #ffffff/#f9f9f9 sections at 64px gaps.
- Set display headlines at 60px Inter weight 700 with -1.5px letter-spacing — tighter tracking on large sizes is non-negotiable.
- Use #fa3556 filled coral buttons for the single primary action per view; switch to #16191c dark buttons for secondary actions to avoid CTA competition.
- Anchor every page with the yellow promo banner above the nav when a deal is active; never move it below the fold.

### Don't
- Don't use #1ebfbf as a button fill — teal is for brand identity, icons, and inline accent text, not for conversion surfaces.
- Don't apply shadows to cards — the system relies on background contrast and 48px radius for elevation, not drop shadows.
- Don't use border-radius values outside the scale: 8, 12, 32, 48, 64, 96px. Intermediate values break the visual language.
- Don't place two coral CTAs in the same viewport — one coral per view, the rest dark or ghost.
- Don't use the yellow #ffc200 outside promotional banners — leaking it into feature blocks dilutes its urgency signal.
- Don't use serif, display, or decorative fonts — Inter at multiple weights covers the full hierarchy.
- Don't set body text below 16px on marketing pages; 14px is the minimum and only for captions and micro-copy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f9f9f9` | Page background, soft neutral base |
| 1 | Card | `#ffffff` | Feature cards, content surfaces, light section panels |
| 2 | Tinted Wash | `#e8f7f8` | Faint teal-tinted section background for brand-adjacent blocks |
| 3 | Dark Panel | `#16191c` | Hero cards, feature panels, footer — high-contrast resting surfaces |
| 4 | Deep Abyss | `#1e2327` | Alternate dark surface with subtle blue shift for layered depth |

## Elevation

The system avoids drop shadows entirely. Elevation is communicated through background-color contrast (white card on #f9f9f9 canvas, or #16191c panel on white section), 48px border-radius on large surfaces, and 1px hairline borders in #dadadd or #bfbfc0. This keeps the interface flat, fast, and modern — shadows would add visual weight that conflicts with the airy consumer-SaaS tone.

## Imagery

Photography is warm-toned and lifestyle-oriented: people using devices in cozy, dimly-lit domestic settings (candlelit rooms, sofas, natural evening light). Hero product renders are hyper-saturated and conceptual — a translucent teal jelly dessert with raspberries styled as VPN iconography. Avatars are circular tight crops of diverse faces used as social proof. Icons throughout are flat, single-stroke, and teal (#1ebfbf) on light backgrounds or white on dark. The overall image-to-text ratio is moderate: imagery occupies roughly 40% of viewport real estate, concentrated in hero panels and feature cards rather than full-bleed editorial spreads.

## Layout

Max-width 1200px centered container with 64px section gaps. Hero is a full-bleed dark rounded card (64px radius) with 2-column split: text-left, image-right. Below the hero, sections alternate between centered single-column text blocks (testimonials, value props) and 2-column text+image feature panels. Navigation is a 64px-tall sticky white bar. The page rhythm is: promo banner → nav → dark hero card → white centered text → dark feature panel → white testimonial → footer. No sidebar, no mega-menu, no masonry — the layout is linear and vertically stacked with generous breathing room between sections.

## Agent Prompt Guide

primary action: #fa3556 (filled action)
Create a Primary Action Button: #fa3556 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **NordVPN** — Same dark hero card on light page pattern, teal-and-warm-accent palette, rounded 48px feature cards, Inter-style sans-serif throughout
- **ExpressVPN** — Similar alternating dark/light section rhythm, single warm accent color against deep charcoal panels, large display headlines on dark hero backgrounds
- **Proton VPN** — Shared consumer-VPN visual language with rounded cards, minimal shadows, and a single chromatic action color against an otherwise neutral system
- **1Password** — Same max-width 1200px centered layout, dark hero with split text+image, generous 64px section gaps, and Inter typography with tight display tracking

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-surfshark-teal: #1ebfbf;
  --color-coral-pulse: #fa3556;
  --color-promo-gold: #ffc200;
  --color-charcoal-ink: #16191c;
  --color-pure-white: #ffffff;
  --color-fog-white: #f9f9f9;
  --color-tide-tint: #e8f7f8;
  --color-ash-gray: #dadadd;
  --color-mist-gray: #bfbfc0;
  --color-slate: #5b6065;
  --color-graphite: #393e41;
  --color-carbon: #000000;
  --color-deep-abyss: #1e2327;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.17px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --tracking-body-sm: 0.24px;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.21;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: -1.5px;

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
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 48px;
  --radius-full-2: 64px;
  --radius-full-3: 96px;

  /* Named Radii */
  --radius-cards: 48px;
  --radius-links: 8px;
  --radius-pills: 96px;
  --radius-small: 8px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-canvas: #f9f9f9;
  --surface-card: #ffffff;
  --surface-tinted-wash: #e8f7f8;
  --surface-dark-panel: #16191c;
  --surface-deep-abyss: #1e2327;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-surfshark-teal: #1ebfbf;
  --color-coral-pulse: #fa3556;
  --color-promo-gold: #ffc200;
  --color-charcoal-ink: #16191c;
  --color-pure-white: #ffffff;
  --color-fog-white: #f9f9f9;
  --color-tide-tint: #e8f7f8;
  --color-ash-gray: #dadadd;
  --color-mist-gray: #bfbfc0;
  --color-slate: #5b6065;
  --color-graphite: #393e41;
  --color-carbon: #000000;
  --color-deep-abyss: #1e2327;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.17px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --tracking-body-sm: 0.24px;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.21;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 48px;
  --radius-full-2: 64px;
  --radius-full-3: 96px;
}
```
