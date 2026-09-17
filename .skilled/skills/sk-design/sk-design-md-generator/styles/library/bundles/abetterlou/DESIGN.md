# Abetterlou — Style Reference
> Embers on saddle leather — warm cream typography glowing against deep coffee-black, with amber-gold buttons that feel pressed into the page like heated metalwork.

**Theme:** dark

A warm dark 'private clinic at dusk' system: coffee-black canvas (#140b00), cream typography (#fff1e0), and a single amber accent (#ffb442) that fires only on action. PP Neue Montreal carries the entire voice at weights 400 and 500 — geometric and clinical, but the cream ink and tight negative tracking on the 43–81px range give it editorial weight rather than generic SaaS feel. The defining rhythm is a shape contrast: full-pill controls (buttons, inputs, links at ~1296px radius) sit on gently squared 6px surfaces, so action elements feel pressed-in and tactile while content cards stay quiet. Restraint is the system: one chromatic accent, two font weights, compact 12px gaps, and 52px section breath that reads premium without becoming airy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Espresso | `#140b00` | `--color-espresso` | Page canvas and primary surface — warm coffee-black rather than pure black, the entire site sits on this |
| Midnight Cocoa | `#0b0600` | `--color-midnight-cocoa` | Deepest surface for footers and recessed bands — almost-black brown for slight layering below Espresso |
| Warm Cream | `#fff1e0` | `--color-warm-cream` | Primary text and icon strokes — the only ink color across the system, reads as off-white parchment in dark contexts |
| Soft Cream | `#f1f1f1` | `--color-soft-cream` | Occasional light surface tint where near-white is needed (rare, secondary to Warm Cream) |
| Walnut | `#43392d` | `--color-walnut` | Subtle hairline borders on dark surfaces — warm taupe that holds edges without competing with content |
| Cedar | `#4f4538` | `--color-cedar` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Driftwood | `#85796c` | `--color-driftwood` | Muted helper text and secondary labels — warm gray that recedes against Espresso without disappearing |
| Burnt Edge | `#181109` | `--color-burnt-edge` | Faint internal border on cards and panels — barely-visible depth line on the dark canvas |
| Amber Forge | `#ffb442` | `--color-amber-forge` | Primary action fill, accent highlights, and the system signal color — the only chromatic accent; appears on filled CTAs, icon hover states, and section dividers. Pairs against Espresso for a heated-metal contrast that feels pressed-in and intentional |

## Tokens — Typography

### PP Neue Montreal — Sole typeface across the entire system. PP Neue Montreal is a geometric humanist sans with a soft, slightly rounded terminal — more editorial than Inter, more clinical than GT America. Used at weight 400 for body and 500 for emphasis; no weight 600+ anywhere, which keeps the voice restrained and high-end. Display sizes (43–81px) use tight negative tracking (down to -1.13px) to lock letters into compact editorial blocks. Substitute with Inter (close) or Manrope (slightly warmer). · `--font-pp-neue-montreal`
- **Substitute:** Inter (close), Manrope (warmer alternative), or Space Grotesk (geometric alternative)
- **Weights:** 400, 500
- **Sizes:** 10, 12, 13, 14, 16, 17, 19, 20, 22, 23, 27, 29, 30, 33, 35, 43, 55, 59, 69, 73, 81px
- **Line height:** 0.80, 1.00, 1.10, 1.20, 1.40, 1.43, 1.50
- **Letter spacing:** -1.13px at 81px, -0.80px at 73px, -0.69px at 69px, -0.53px at 59px, -0.44px at 55px, -0.30px at 43px, -0.21px at 35px, -0.17px at 33px, -0.12px at 29-30px, -0.08px at 27px, -0.05px at 22-23px, normal at 16px and below, +0.01em on small labels
- **OpenType features:** `"ss01" on, "kern" on, "liga" on`
- **Role:** Sole typeface across the entire system. PP Neue Montreal is a geometric humanist sans with a soft, slightly rounded terminal — more editorial than Inter, more clinical than GT America. Used at weight 400 for body and 500 for emphasis; no weight 600+ anywhere, which keeps the voice restrained and high-end. Display sizes (43–81px) use tight negative tracking (down to -1.13px) to lock letters into compact editorial blocks. Substitute with Inter (close) or Manrope (slightly warmer).

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.12px | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 19px | 1.4 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | -0.05px | `--text-heading-sm` |
| heading-lg | 35px | 1.1 | -0.21px | `--text-heading-lg` |
| display | 43px | 1.1 | -0.3px | `--text-display` |
| display-lg | 55px | 1.1 | -0.44px | `--text-display-lg` |
| hero | 73px | 1 | -0.8px | `--text-hero` |
| hero-xl | 81px | 0.8 | -1.13px | `--text-hero-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 52 | 52px | `--spacing-52` |
| 72 | 72px | `--spacing-72` |
| 152 | 152px | `--spacing-152` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 6px |
| icons | 9999px |
| inputs | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 52px
- **Card padding:** 12px
- **Element gap:** 12px

## Components

### Amber Filled Pill Button
**Role:** Primary CTA

Solid #ffb442 fill, Warm Cream (#fff1e0) text at 14px weight 500, full pill radius (9999px), 12px vertical padding × 15px horizontal padding. No border, no shadow. Text sits dead-center with optical adjustment. The amber glows against Espresso like a heated brand.

### Cream Outlined Pill Button
**Role:** Secondary action / Patient Portal

Transparent fill, 1px Warm Cream (#fff1e0) border, Warm Cream text at 14px weight 500, 9999px radius, 10–12px vertical padding. Pairs beside the amber primary to create a clear hierarchy without introducing new colors.

### Arrow Icon Circle
**Role:** Inline action accent (sits beside CTAs and card headers)

Filled Amber Forge circle, ~36–40px diameter, 9999px radius, centered diagonal-arrow icon in Espresso (#140b00) at ~16px. Functions as a secondary 'go' signal and visual companion to the pill button — a recurring motif.

### Top Navigation Bar
**Role:** Primary site navigation

Transparent over hero, becomes Espresso (#140b00) on scroll. Left: ABL monogram in Warm Cream weight 500. Center: nav links in Warm Cream at 14px weight 400. Right: outlined Cream pill 'Patient Portal' + Amber Forge filled 'Join the list' pill. Nav container itself has a 6px radius on inner elements, no pill radius on the bar.

### Feature Card (Icon + Title + Body)
**Role:** 3-up feature grid in the hero band

Transparent surface — no card fill. 1px Walnut (#43392d) bottom border as a hairline divider. Circular icon container ~40px diameter with Walnut border, monochrome icon inside. Title in Warm Cream 14px weight 500, body in Driftwood (#85796c) 14px weight 400. Tight 12px padding inside, no rounded corners on the card itself.

### FAQ Accordion Row
**Role:** Frequently asked questions list

Full-width row on a light Cream (#fff1e0) surface band. 1px Walnut hairline separator between items. Question text in Espresso (#140b00) at 17px weight 500, left-aligned, with a + icon in Espresso at the right. Compact 14px vertical padding, no card radius — the items are a vertical list, not boxes.

### Pill Input Field
**Role:** Form input

Transparent fill, 1px Cedar (#4f4538) border, full pill radius (9999px), 12px vertical padding. Placeholder text in Driftwood (#85796c), entered text in Warm Cream. Focus state intensifies border to Amber Forge (#ffb442) — no glow, just a color shift.

### Badge / Tag
**Role:** Small inline label

Filled Walnut (#43392d) or outlined Warm Cream, 9999px radius, 4–10px vertical padding, caption-size (12px) text in Warm Cream. Used sparingly for category tags.

### Section Headline Block
**Role:** Section title with optional CTA

Left-aligned or centered heading at 43–73px, weight 400, Warm Cream on dark, tight negative tracking. Optional Amber Forge filled 'Explore All' pill button + Arrow Icon Circle beneath, stacked vertically. No subtitle unless paired with subheading-sm.

### Clock Dial Visualization
**Role:** Signature data graphic (biological age widget)

Midnight Cocoa (#0b0600) deep dark band, centered circular dot-clock made of 60 small Warm Cream dots arranged in a ring, with a vertical pendulum line from top center. Large numeric readout in Warm Cream at 69px weight 500, label beneath in Driftwood 13px. Pure data-art, no chrome or shadow.

### Hero Headline
**Role:** Primary above-the-fold statement

Two-line statement at 73–81px weight 400, Warm Cream (#fff1e0), line-height 0.80–1.00, letter-spacing -0.80 to -1.13px. Sits over full-bleed hero image with a subtle Espresso gradient scrim. Below: body subtext in Driftwood at 16px weight 400, max-width ~440px, followed by Amber Filled Pill Button + Arrow Icon Circle row.

### Footer
**Role:** Site footer band

Midnight Cocoa (#0b0600) surface, one step deeper than the page. Content in Warm Cream and Driftwood, compact rows, no heavy decoration. Legal text in caption 12px.

## Do's and Don'ts

### Do
- Use Amber Forge (#ffb442) exclusively for primary actions and one-per-section accent moments — never as a background fill for large surfaces
- Set every button, input, and inline link to a 9999px pill radius; reserve 6px radius for cards, nav, and structural surfaces
- Anchor type with PP Neue Montreal weight 400 for body and weight 500 for headings/emphasis only — no weight 600 or above anywhere in the system
- Apply tight negative letter-spacing on any type at 27px or larger, scaling from -0.05px at 22px to -1.13px at 81px
- Keep section vertical spacing at 52px and element gaps at 12px to preserve the system's compact-premium rhythm
- Place Cream Outlined Pill Buttons adjacent to Amber Filled Pills to establish primary/secondary hierarchy without adding new colors
- Communicate elevation through Amber-on-Espresso color contrast and 1px Walnut hairlines, never through box-shadows or blur

### Don't
- Don't introduce a second chromatic accent — the system's restraint lives in having exactly one warm signal color
- Don't use pure black (#000000) or pure white (#ffffff); stay within the Espresso (#140b00) → Warm Cream (#fff1e0) warmth band
- Don't apply box-shadows, blurs, or glows to any component — depth is built through border tone and color contrast only
- Don't break the pill-vs-card radius convention: never put a pill button inside a 6px card frame, and never give a card a 9999px radius
- Don't set body text below 14px or above 18px — the system's voice lives in the 14–18px range, not in tiny micro-copy
- Don't use amber text on light sections — Amber Forge is a dark-canvas signal only; on Cream surfaces use Espresso for primary text
- Don't stack more than two font weights on a single screen; the system reads as 400-and-500-only, never 700+

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Espresso Canvas | `#140b00` | Base page background, dominant canvas |
| 1 | Midnight Cocoa | `#0b0600` | Footer and recessed dark bands, one step deeper than canvas |
| 2 | Walnut Outline | `#43392d` | Card and panel borders on the Espresso canvas |
| 3 | Amber Signal | `#ffb442` | Action fill, the only elevated chromatic surface |
| 4 | Warm Cream | `#fff1e0` | Inverse text surface (light bands, e.g. FAQ section) that flips the system |

## Elevation

- **Pill buttons and icon controls:** `none — buttons sit flat against the dark canvas, depth implied only by color contrast between Amber Forge fill and Espresso`
- **Cards and panels:** `none — cards rely on a 1px Walnut border (#43392d) rather than shadow to read as raised`
- **FAQ accordion items:** `none — separators are 1px Warm Cream at reduced opacity, no shadow`

## Imagery

Imagery is cinematic and masculine: high-resolution lifestyle photography of confident older men (60s+) in outdoor golden-hour settings — desert roads, mountain vistas, luxury vehicle interiors. Photography is full-bleed in the hero, color-graded warm to match the Espresso/Amber palette, with a subtle Espresso scrim to keep text legible. No illustrations, no product shots, no abstract graphics in the main flow — the brand leans entirely on human portraiture to carry trust. The one exception is the clock-dial data visualization, which is pure dot-and-line graphic art in Warm Cream. Icons throughout are monochrome line icons in Warm Cream at consistent ~16–20px stroke weight, sitting inside small Walnut-bordered circular containers when paired with feature text.

## Layout

Max-width 1200px centered content rail with hero that goes full-bleed for the background photograph. Hero is a split composition: left rail holds the headline + subtext + CTA row, right side is occupied by the photograph of the subject. Below the hero, a 3-up feature card grid sits on the same Espresso canvas with no card fills — just hairline bottom borders. Section rhythm alternates between full-bleed Espresso bands and occasional light Cream bands (the FAQ section flips to Cream-on-Espresso). Headlines left-align by default, section transitions use 52px vertical breath. Navigation is a transparent top bar that becomes solid Espresso on scroll. Overall density is comfortable but not airy — the system reads as confident and compact rather than spacious.

## Agent Prompt Guide

Quick Color Reference:
- text: #fff1e0 (Warm Cream) on #140b00 (Espresso) canvas
- Create a Primary Action Button: #ffb442 background, #140b00 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
- border: #43392d (Walnut) for hairlines, #4f4538 (Cedar) for input outlines
- accent: #ffb442 (Amber Forge) for highlights and signal moments
- muted text: #85796c (Driftwood)
- primary action: #ffb442 (filled action)

Example Component Prompts:
1. Build a hero section: full-bleed photograph with Espresso (#140b00) scrim. Headline at 73px PP Neue Montreal weight 400, #fff1e0, letter-spacing -0.80px, line-height 1.0. Subtext at 16px weight 400, #85796c, max-width 440px. Amber Filled Pill Button (#ffb442 fill, #fff1e0 text, 9999px radius, 12px 15px padding) paired with a 36px Amber Forge Arrow Icon Circle.
2. Build a 3-up feature card grid: transparent surfaces, 1px #43392d bottom border, 12px padding. Each card has a 40px circular Walnut-bordered icon container, 14px weight 500 #fff1e0 title, 14px weight 400 #85796c body. 12px gap between icon container and text.
3. Build a FAQ accordion on a #fff1e0 surface: full-width rows, 1px #43392d separator, question text at 17px weight 500 #140b00, + icon at the right in #140b00, 14px vertical padding per row.
4. Build a pill input field: transparent fill, 1px #4f4538 border, 9999px radius, 12px vertical padding, 14px #85796c placeholder that becomes #fff1e0 on input. Focus shifts border to #ffb442.
5. Build the clock-dial data graphic: centered on #0b0600 band, 60 small #fff1e0 dots in a circle, vertical pendulum line in #fff1e0 from top, numeric readout at 69px weight 500 #fff1e0 centered, label at 13px #85796c beneath.

## Similar Brands

- **Hims** — Same warm dark canvas with a single saturated accent for CTAs, pill-shaped buttons, and lifestyle portrait photography of confident older men
- **Ro (Roman)** — Dark-mode men's health interface with a restrained two-color palette (one accent + cream), pill controls, and editorial negative-tracked headlines
- **Saddleback Leather** — Warm coffee-black backgrounds with cream typography, masculine/premium product photography, and zero decorative noise
- **Oliver Cabell** — Same warm dark hero with golden-hour portrait photography, full-bleed imagery, and a single bright accent color on action elements
- **MUDWTR** — Dark earthy backgrounds (brown-black, not blue-black), single warm amber accent, and editorial negative-tracked display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-espresso: #140b00;
  --color-midnight-cocoa: #0b0600;
  --color-warm-cream: #fff1e0;
  --color-soft-cream: #f1f1f1;
  --color-walnut: #43392d;
  --color-cedar: #4f4538;
  --color-driftwood: #85796c;
  --color-burnt-edge: #181109;
  --color-amber-forge: #ffb442;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.12px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.05px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.21px;
  --text-display: 43px;
  --leading-display: 1.1;
  --tracking-display: -0.3px;
  --text-display-lg: 55px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: -0.44px;
  --text-hero: 73px;
  --leading-hero: 1;
  --tracking-hero: -0.8px;
  --text-hero-xl: 81px;
  --leading-hero-xl: 0.8;
  --tracking-hero-xl: -1.13px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-52: 52px;
  --spacing-72: 72px;
  --spacing-152: 152px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 52px;
  --card-padding: 12px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 1162.8px;
  --radius-full-2: 1296px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 6px;
  --radius-icons: 9999px;
  --radius-inputs: 9999px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-espresso-canvas: #140b00;
  --surface-midnight-cocoa: #0b0600;
  --surface-walnut-outline: #43392d;
  --surface-amber-signal: #ffb442;
  --surface-warm-cream: #fff1e0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-espresso: #140b00;
  --color-midnight-cocoa: #0b0600;
  --color-warm-cream: #fff1e0;
  --color-soft-cream: #f1f1f1;
  --color-walnut: #43392d;
  --color-cedar: #4f4538;
  --color-driftwood: #85796c;
  --color-burnt-edge: #181109;
  --color-amber-forge: #ffb442;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.12px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.05px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.21px;
  --text-display: 43px;
  --leading-display: 1.1;
  --tracking-display: -0.3px;
  --text-display-lg: 55px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: -0.44px;
  --text-hero: 73px;
  --leading-hero: 1;
  --tracking-hero: -0.8px;
  --text-hero-xl: 81px;
  --leading-hero-xl: 0.8;
  --tracking-hero-xl: -1.13px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-52: 52px;
  --spacing-72: 72px;
  --spacing-152: 152px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 1162.8px;
  --radius-full-2: 1296px;
}
```
