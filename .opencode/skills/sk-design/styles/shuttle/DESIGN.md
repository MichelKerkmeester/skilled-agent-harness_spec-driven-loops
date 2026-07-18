# Shuttle — Style Reference
> Floating pill in white void — one blue spark on infinite paper

**Theme:** light

Shuttle renders as a single floating pill bar adrift in near-total white space — the entire brand hinges on that one chrome-plated capsule at the top of every page, and a single electric blue that punctuates it. The interface below is deliberately sparse, relying on a tight monochrome spine of black text, gray hairlines, and white surfaces to create a laboratory-clean canvas. Components sit flat against the page with whisper-thin 1px shadows rather than elevation stacks; cards, buttons, and inputs all share an 8px radius, while decorative images and content cards use a softer 16px. Inter Variable carries the whole voice at a tightened -0.025em tracking, ranging from a 62px display whisper down to 10px micro-labels. The result reads like a tool that has been stripped to its chassis — every pixel earns its place, and the blue is the only sound in the room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#0077ff` | `--color-signal-blue` | Primary CTA fill, active nav state, single accent across the entire interface — the only saturated color permitted on chrome, everything else recedes to monochrome |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text on Signal Blue, pill navigation fill — the default surface at every level |
| Ink | `#000000` | `--color-ink` | Primary text, icon strokes, hairline borders, logo mark — the dominant typographic and structural color |
| Hairline | `#e5e7eb` | `--color-hairline` | Borders, dividers, card edges, input outlines, image frames — the structural skeleton running through the entire system |
| Smoke | `#b8b8b8` | `--color-smoke` | Shadow tint, secondary border accent, button box-shadow base — the only non-black/white value used in elevation |
| Graphite | `#525252` | `--color-graphite` | Secondary body text, muted link color, list items — readable but clearly secondary to Ink |
| Ash | `#737373` | `--color-ash` | Tertiary text, icon strokes at rest, placeholder content, button secondary labels |
| Mercury | `#a3a3a3` | `--color-mercury` | Decorative SVG strokes, disabled icon state, subtle ornamental linework |
| Slate | `#ababab` | `--color-slate` | Quiet border accent, nearly invisible dividers in dense layouts |
| Ember | `#f97316` | `--color-ember` | Decorative illustration accent, warm icon fill — permitted only in graphics, never on chrome |
| Amber | `#f59e0b` | `--color-amber` | Decorative illustration accent, warm icon fill — pairs with Ember in artwork |
| Crimson | `#ef4444` | `--color-crimson` | Red text accent for links, tags, and emphasized short phrases |
| Deep Signal | `#2563eb` | `--color-deep-signal` | Secondary blue used only in illustrations and icon sets — not an interface color |

## Tokens — Typography

### InterVariable — Sole typeface across all contexts — body, headings, nav, buttons, inputs, cards. Tracking tightened globally to -0.025em which makes even 12px body text feel engineered rather than casual. The 62px display size is the only moment of typographic drama, used sparingly for hero statements; everything else lives at 16px or below, reinforcing the tool-like density. · `--font-intervariable`
- **Substitute:** Inter (variable) from rsms.me/inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 11px, 12px, 14px, 15px, 16px, 62px
- **Line height:** 1.00–1.67
- **Letter spacing:** -0.025em across all sizes
- **Role:** Sole typeface across all contexts — body, headings, nav, buttons, inputs, cards. Tracking tightened globally to -0.025em which makes even 12px body text feel engineered rather than casual. The 62px display size is the only moment of typographic drama, used sparingly for hero statements; everything else lives at 16px or below, reinforcing the tool-like density.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.4 | -0.25px | `--text-micro` |
| caption | 12px | 1.5 | -0.3px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.35px | `--text-body-sm` |
| body-lg | 16px | 1.5 | -0.4px | `--text-body-lg` |
| display | 62px | 1.16 | -1.55px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 9999px |
| images | 16px |
| inputs | 8px |
| buttons | 8px |
| nav-pill | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.25) 0px 0px 1px 0px` | `--shadow-subtle` |
| xl | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 128px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Floating Pill Navigation
**Role:** Primary site chrome — the signature element visible on every screen

Full pill shape (9999px radius), white fill (#ffffff), thin 1px black shadow (rgba(0,0,0,0.25) 0px 0px 1px 0px). Horizontally centered, sits ~16px from top. Contains logo (Ink-colored), text links at 12px weight 500 in Graphite (#525252), and a Signal Blue (#0077ff) 'Sign up' button with white text at 8px radius, 6px 12px padding, 12px text. The entire bar feels like a single floating object rather than a fixed header.

### Primary CTA Button (Filled)
**Role:** The only high-saturation action element in the system

Signal Blue (#0077ff) fill, white (#ffffff) text, 8px radius, 6px 12px padding, InterVariable 12px weight 500. Thin 1px black shadow. No hover state color shift in raw data — the blue IS the hover-state-equivalent. Arrow icon (→) in white at 12px right-aligned inside the button.

### Ghost Nav Link
**Role:** Secondary navigation items (Updates, Pricing)

No background, no border. Text only: 12px InterVariable weight 500, color Graphite (#525252). Sits inside the pill with ~12px horizontal padding. Relies entirely on typography weight for emphasis rather than color.

### Content Card
**Role:** Container for grouped information blocks

White (#ffffff) surface, 16px border-radius, 16px padding, 1px Hairline (#e5e7eb) border. No shadow or extremely subtle 1px black shadow. Flat against the page — the border does the structural work, not elevation.

### Elevated Feature Card
**Role:** Occasional card with visible elevation for emphasis

White surface, 16px radius, dramatic shadow: rgba(0,0,0,0.25) 0px 25px 50px -12px. Used sparingly — only 2 instances in extracted data. Reserved for hero-adjacent cards or key feature highlights that need to lift off the canvas.

### Text Input
**Role:** Form fields

White fill, 1px Hairline (#e5e7eb) border, 8px radius, 8px vertical / 12px horizontal padding. Text at 14px InterVariable weight 400, Ink (#000000). Placeholder in Ash (#737373). No focus ring color data extracted — default to Hairline darkening to Ink on focus.

### Framed Image
**Role:** Content images and illustrations

16px border-radius, 1px Hairline (#e5e7eb) border. Sits flush in card layouts. 13px horizontal margins when used in image grids.

### Hairline Divider
**Role:** Structural section separator

1px Hairline (#e5e7eb) horizontal line, full container width. No margin — sits flush between content blocks.

### Icon Set
**Role:** UI and decorative icons throughout the interface

1.5px stroke weight consistent across set. Icons in UI context: Ink (#000000) at rest, Ash (#737373) for secondary, white on Signal Blue fills. Decorative icons in illustrations use the full accent palette: Ember, Amber, Crimson, Deep Signal.

### Logo Mark
**Role:** Brand identification in pill nav

Small square icon in Signal Blue (#0077ff) at ~20px, followed by 'Shuttle' wordmark in Ink (#000000) at 12px weight 700. The blue icon is the only non-text blue element in the nav besides the CTA button.

### List Item
**Role:** Ordered or unordered lists in body content

Graphite (#525252) text, 12px InterVariable, tight vertical rhythm with 8px row spacing. No bullet color differentiation from text.

### Link
**Role:** Inline text links

Graphite (#525252) default — NOT blue. Shuttle deliberately avoids the default blue link convention. Links are distinguished by weight (500) rather than color, keeping the page's chromatic discipline intact.

## Do's and Don'ts

### Do
- Use Signal Blue (#0077ff) exclusively for the primary CTA fill and the logo icon — it is the only saturated color in the interface
- Apply the 9999px pill radius to the navigation bar, tag elements, and any floating UI capsules
- Use 8px radius for all interactive elements (buttons, inputs) and 16px for content containers (cards, images)
- Set letter-spacing to -0.025em on all InterVariable text regardless of size
- Pair every elevated surface with the thin 1px black shadow (rgba(0,0,0,0.25) 0px 0px 1px 0px); reserve the dramatic 25px 50px shadow for feature cards only
- Keep section gaps at 128px and element gaps at 8px to preserve the compact laboratory rhythm
- Use Ink (#000000) for text and Hairline (#e5e7eb) for borders as the structural backbone — the system is 98% monochrome

### Don't
- Do not use the accent palette (Ember, Amber, Crimson, Deep Signal) on any chrome element — they are illustration-only
- Do not apply rounded corners larger than 16px to content cards; oversized radii break the tool-like density
- Do not introduce gradients, colored shadows, or tinted elevations — shadows are always black at 0.25 opacity
- Do not color links blue — Shuttle uses Graphite (#525252) with weight 500 for inline links to preserve chromatic discipline
- Do not use display-size type (62px) more than once per page section; the whisper-light display is a punctuation mark, not a paragraph
- Do not add background color to the nav pill — its whiteness against the white canvas is established by the 1px black shadow alone
- Do not mix radius scales within a single component family; buttons stay at 8px, cards stay at 16px, no exceptions

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the infinite white background that defines Shuttle's minimalism |
| 1 | Card | `#ffffff` | Content containers and the nav pill — same white, distinguished by 1px Hairline border or thin shadow |
| 2 | Action | `#0077ff` | Primary CTA fill — the only elevated surface with chromatic identity |

## Elevation

- **Floating Pill Navigation:** `rgba(0, 0, 0, 0.25) 0px 0px 1px 0px`
- **Primary CTA Button:** `rgba(0, 0, 0, 0.25) 0px 0px 1px 0px`
- **Content Card:** `rgba(0, 0, 0, 0.25) 0px 0px 1px 0px`
- **Elevated Feature Card:** `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`

## Imagery

Imagery is minimal and white-backgrounded. Content images and illustrations are framed with 16px radius and 1px Hairline borders, sitting flush in card grids with 13px gutters. Decorative illustrations use a warm accent palette (Ember #f97316, Amber #f59e0b, Crimson #ef4444, Deep Signal #2563eb) that is strictly quarantined from the interface — these colors never appear on chrome. The overall visual weight is text-dominant with sparse, contained imagery.

## Layout

Max-width 1200px centered content. The hero pattern is a floating pill navigation centered at the top with 16px top margin, followed by expansive white space. Sections are separated by 128px vertical gaps with hairline dividers. Content arrangement favors centered stacks and 2-column text+image blocks. Card grids appear in 3-column configurations for feature blocks. The page breathes — sections are spacious and information-sparse, with each element given room to exist independently rather than packed into dense information clusters.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000 (primary), #525252 (secondary), #737373 (tertiary)
- Background: #ffffff (canvas and all surfaces)
- Border: #e5e7eb (structural), #b8b8b8 (accent)
- Accent: #0077ff (Signal Blue — logo icon, single CTA)
- primary action: #0077ff (filled action)

## Example Component Prompts
1. **Floating pill nav bar**: White (#ffffff) fill, 9999px border-radius, thin 1px black shadow (rgba(0,0,0,0.25) 0px 0px 1px 0px). Centered horizontally, 16px from top. Contents: Signal Blue (#0077ff) 20px square logo icon, 'Shuttle' wordmark in Ink (#000000) at 12px weight 700, 12px gap, nav links 'Updates' and 'Pricing' at 12px weight 500 in Graphite (#525252), 12px gap, then Signal Blue (#0077ff) 'Sign up →' button at 8px radius, 6px 12px padding, white 12px text, same 1px shadow.

2. **Content card**: White (#ffffff) surface, 16px border-radius, 16px padding, 1px Hairline (#e5e7eb) border, thin 1px black shadow. Body text at 14px InterVariable weight 400, Ink (#000000), line-height 1.43. No background color shift, no gradient.

3. **Hero display heading**: 'Shuttle' at 62px InterVariable weight 400, Ink (#000000), letter-spacing -0.025em (≈ -1.55px), line-height 1.16. Centered or left-aligned, no background, sits in pure white space.

4. **Secondary text link**: 'Read more' at 14px InterVariable weight 500, Graphite (#525252), no underline at rest, no color change on hover. Distinguishes itself from body text by weight 500 vs 400.

5. **Elevated feature card**: White surface, 16px border-radius, dramatic shadow rgba(0,0,0,0.25) 0px 25px 50px -12px, 24px padding. Contains a 14px caption label in Graphite (#525252) above a 16px heading in Ink, weight 600. Use sparingly — at most one or two per page.

## Similar Brands

- **Linear** — Same ultra-minimal monochrome interface with a single accent color (Linear's purple, Shuttle's blue) and near-zero colorfulness — the entire brand rests on one saturated CTA against infinite white
- **Vercel** — Floating centered nav, white-canvas minimalism, Inter typeface with tightened tracking, single chromatic accent on CTAs and nothing else
- **Cal.com** — Compact 4px-based spacing system, 8px button radii, hairline borders, and a disciplined single-accent approach to color across a dev-tool surface
- **Resend** — Dev-tool aesthetic with white-dominant pages, tight Inter typography, pill-shaped nav, and the philosophy that one blue should do all the work
- **Plausible Analytics** — Extreme whitespace discipline with minimal color palette, compact spacing tokens, and the visual feeling that the product itself is deliberately understated

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #0077ff;
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-hairline: #e5e7eb;
  --color-smoke: #b8b8b8;
  --color-graphite: #525252;
  --color-ash: #737373;
  --color-mercury: #a3a3a3;
  --color-slate: #ababab;
  --color-ember: #f97316;
  --color-amber: #f59e0b;
  --color-crimson: #ef4444;
  --color-deep-signal: #2563eb;

  /* Typography — Font Families */
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.4;
  --tracking-micro: -0.25px;
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.4px;
  --text-display: 62px;
  --leading-display: 1.16;
  --tracking-display: -1.55px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 128px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-images: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-nav-pill: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 0px 1px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-card: #ffffff;
  --surface-action: #0077ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #0077ff;
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-hairline: #e5e7eb;
  --color-smoke: #b8b8b8;
  --color-graphite: #525252;
  --color-ash: #737373;
  --color-mercury: #a3a3a3;
  --color-slate: #ababab;
  --color-ember: #f97316;
  --color-amber: #f59e0b;
  --color-crimson: #ef4444;
  --color-deep-signal: #2563eb;

  /* Typography */
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.4;
  --tracking-micro: -0.25px;
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.4px;
  --text-display: 62px;
  --leading-display: 1.16;
  --tracking-display: -1.55px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 0px 1px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
}
```
