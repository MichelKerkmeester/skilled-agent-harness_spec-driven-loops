# Midday — Style Reference
> Editorial broadsheet on parchment — a 72px serif headline over warm stone, spaced sans-serif body text, pill-shaped controls, zero shadows.

**Theme:** light

Midday reads like an editorial broadsheet translated to software: a warm parchment canvas, a spaced sans-serif body voice, and a serif display face that announces sections like magazine pull-quotes. The system is monochrome to the point of austerity — surfaces stack in warm off-whites, borders are hairline-thin, and chromatic color appears only as functional punctuation for financial data (a single moss green) and the dark filled CTA. Every interactive element is pill-shaped; nothing is squared off. The design is completely flat — no shadows, no gradients, no decorative depth. Spacing is compact and rhythmic on a 4px grid, keeping dense ledger data legible without breathing room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#dbdad7` | `--color-parchment` | Page canvas and hairline borders — the warm off-white that unifies every surface and defines every divider at 1px |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, input fields, pill button fills — pure white sits one level above the warm canvas |
| Sand | `#e6e4e0` | `--color-sand` | Secondary surface for table rows, inset panels, and tonal contrast between stacked cards |
| Ink | `#121212` | `--color-ink` | Primary text, icons, and logo — near-black for maximum contrast against parchment and paper |
| Smoke | `#616161` | `--color-smoke` | Secondary text, muted labels, chart axis lines, non-active icon strokes |
| Charcoal | `#18181b` | `--color-charcoal` | Primary action fill — dark filled buttons and active navigation state, white text reverses on top |
| Moss | `#4caf50` | `--color-moss` | Green text accent for links, tags, and emphasized short phrases |

## Tokens — Typography

### Hedvig Letters Sans — Body text, navigation, labels, buttons, and mid-weight headings. The positive letter-spacing (0.05em at small sizes, 0.025em at large) creates a distinctive editorial voice — most interfaces tighten spacing as size grows, this one widens it. Weight 400 for prose, 500 for labels and nav links. · `--font-hedvig-letters-sans`
- **Substitute:** Inter (400, 500) with letter-spacing overridden, or General Sans
- **Weights:** 400, 500
- **Sizes:** 10px, 11px, 12px, 14px, 16px, 18px, 20px, 24px, 48px, 508px
- **Line height:** 1.0–1.63
- **Letter spacing:** 0.05em at 10–14px (0.5–0.7px), 0.025em at 16–48px (0.4–1.2px)
- **Role:** Body text, navigation, labels, buttons, and mid-weight headings. The positive letter-spacing (0.05em at small sizes, 0.025em at large) creates a distinctive editorial voice — most interfaces tighten spacing as size grows, this one widens it. Weight 400 for prose, 500 for labels and nav links.

### Hedvig Letters Serif — Display headings and section titles. The serif/sans contrast is the signature editorial moment — 72px serif with -0.025em tracking sits above spaced sans-serif body. Weight stays at 400 even at display size; the font carries authority through form, not weight. · `--font-hedvig-letters-serif`
- **Substitute:** GT Sectra, Tobias, or Source Serif 4 (400)
- **Weights:** 400
- **Sizes:** 24px, 72px
- **Line height:** 1.0–1.33
- **Letter spacing:** -0.025em at all sizes (-0.6px at 24px, -1.8px at 72px)
- **Role:** Display headings and section titles. The serif/sans contrast is the signature editorial moment — 72px serif with -0.025em tracking sits above spaced sans-serif body. Weight stays at 400 even at display size; the font carries authority through form, not weight.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.56 | 0.5px | `--text-caption` |
| body | 14px | 1.43 | 0.7px | `--text-body` |
| heading-sm | 20px | 1.4 | 0.5px | `--text-heading-sm` |
| heading | 24px | 1.33 | -0.6px | `--text-heading` |
| heading-lg | 48px | 1 | 1.2px | `--text-heading-lg` |
| display | 72px | 1 | -1.8px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 224 | 224px | `--spacing-224` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 8px |
| pills | 9999px |
| badges | 9999px |
| inputs | 8px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Site-wide header

Transparent over parchment canvas. Logo (sun mark) at far left, 4–5 text links (Features, Pricing, Story, Download, Resources) right-aligned with dropdown carets, outlined pill button at far right. 16px vertical padding, no border, no background fill.

### Announcement Pill
**Role:** Marketing announcement badge

White (#ffffff) fill, #dbdad7 1px border, 9999px radius. Padding 6px 12px. Text: 12px Hedvig Letters Sans weight 500, #121212, letter-spacing 0.6px. Optional trailing arrow icon in #121212.

### Primary CTA Button
**Role:** Dark filled pill button

#18181b fill, white text, 9999px radius. Padding 6px 16px. Text: 14px Hedvig Letters Sans weight 500, #ffffff, letter-spacing 0.7px. No border, no shadow.

### Ghost/Outline Button
**Role:** Secondary action (e.g. Sign in)

Transparent fill, #dbdad7 1px border, 9999px radius. Padding 6px 12px. Text: 14px Hedvig Letters Sans weight 500, #121212, letter-spacing 0.7px.

### Product Screenshot Frame
**Role:** Hero product showcase

Full-bleed section with #121212 or dark gradient background. Centered laptop/screen frame containing the live product UI (dashboard with sidebar nav, data cards, bar charts, tables). The dark frame is the only visual depth in the entire system.

### Integration Pill
**Role:** Third-party tool marker

White (#ffffff) fill, #dbdad7 1px border, 9999px radius. Padding 6px 10px. Contains a small grayscale tool logo (16px) + 12px sans-serif label. Arranged in a wrapping row with 8px gaps.

### Pricing Toggle
**Role:** Monthly/Yearly selector

Pill-shaped container with #e6e4e0 fill, 9999px radius. Two segments: inactive segment is transparent text, active segment has white (#ffffff) fill with 9999px radius. Text: 12px sans-serif weight 500.

### Pricing Card
**Role:** Plan tier display

White (#ffffff) fill, #dbdad7 1px border, 8px radius. Padding 24px. Tier name: 18px sans-serif weight 500, #121212. Price: 48px sans-serif weight 500, #121212, with /month suffix at 14px. Description and features in 14px body text, #616161. The 'Most popular' card adds a badge.

### Most Popular Badge
**Role:** Pricing card emphasis

White fill, #dbdad7 1px border, 9999px radius. Positioned at top-right of card, overlapping the border. Text: 12px sans-serif weight 500, #121212.

### Dashboard Data Card
**Role:** In-product stat tile

White (#ffffff) fill, #dbdad7 1px border, 8px radius. Padding 20px. Contains a category label (12px sans-serif, #616161), a primary value (24px sans-serif weight 500, #121212), and an optional mini-chart (bar or line, #dbdad7 strokes with #4caf50 or #121212 fills).

### Sidebar Navigation
**Role:** In-product left rail

Transparent or #ffffff fill, no border. Icons: 20px outlined style, #616161 default / #121212 active, 8px radius. Vertical stack with 8px gaps. Active item may show a subtle #e6e4e0 pill background.

### Data Table Row
**Role:** Financial data display

Transparent fill, #dbdad7 1px bottom border. Padding 12px 16px. Text: 14px sans-serif weight 400, #121212. Alternating rows use #e6e4e0 fill. Positive values shown in #4caf50.

## Do's and Don'ts

### Do
- Set body sans-serif text to 0.05em letter-spacing at 10–14px and 0.025em at 16px+ — the positive tracking is the system's editorial signature
- Use Hedvig Letters Serif at 72px with -0.025em tracking for display headlines; pair it with spaced sans-serif body below
- Set all buttons, badges, and pills to 9999px border-radius — no element in the interface is squared off
- Fill primary CTAs with #18181b and reverse to white text; keep all secondary actions as transparent ghost or outlined pills
- Use 1px #dbdad7 hairline borders for cards, inputs, and table rows — the same color as the canvas, so borders feel engraved not stamped
- Keep the canvas at #dbdad7 — never switch to cool grays, pure white page backgrounds, or off-brand cream tones
- Use #4caf50 only inside data contexts (chart bars, positive table values, status pills) — never as a button fill or decorative accent

### Don't
- Don't add box-shadows to any component — depth comes from surface tone shifts and hairline borders only
- Don't use #4caf50 for CTAs, links, or brand decoration — it's a data color, not an action color
- Don't apply negative letter-spacing to sans-serif body text — the positive tracking is the voice, not a bug to fix
- Don't use square corners on buttons, inputs, badges, or tags — everything interactive is pill-shaped
- Don't introduce blue, purple, or any second chromatic accent — the system is monochrome by design
- Don't use Hedvig Letters Serif for body copy, labels, or navigation — it's reserved for display headings at 24px and above
- Don't use cool gray borders or backgrounds — the warm stone palette (#dbdad7, #e6e4e0) is non-negotiable

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment | `#dbdad7` | Page canvas — the warm stone that fills every background |
| 1 | Sand | `#e6e4e0` | Tonal shift for table bands and inset panels |
| 2 | Paper | `#ffffff` | Elevated cards, inputs, and product surfaces |

## Elevation

Flat by design. Zero box-shadows, zero gradients, zero decorative depth. Hierarchy is communicated through surface tone shifts (parchment → sand → paper) and 1px hairline borders in the same warm stone color. The only depth cue is a dark device frame around the product screenshot — and even that is a photographic edge, not a CSS shadow.

## Imagery

Photography-free. The visual centerpiece is a single product screenshot presented in a dark laptop frame, showing a full dashboard with bar charts, line graphs, and data tables rendered in the same monochrome palette with moss-green data accents. Secondary imagery is limited to grayscale third-party tool logos (Slack, Stripe, Xero, etc.) used as integration markers. No decorative illustrations, no abstract graphics, no stock photography — the product UI itself is the hero visual.

## Layout

Max-width 1200px centered, generous 64px vertical gaps between sections. Hero is a centered text stack (announcement pill → serif display → sans subtext → CTA → trust line → tool logos) on the warm parchment canvas. The product screenshot breaks full-bleed with a dark device frame. Mid-page sections use centered text headings above wide grids (integration pills in a single flowing row, pricing cards in a 2-column grid). Navigation is a minimal top bar: logo left, right-aligned text links, outlined sign-in button. Content density is compact within cards and data tables, spacious between marketing sections.

## Agent Prompt Guide

**Quick Color Reference**
- text: #121212
- background: #dbdad7
- card surface: #ffffff
- border: #dbdad7 (1px hairline)
- secondary text: #616161
- primary action: #18181b (filled action)

**Example Component Prompts**
1. *Hero section*: Parchment (#dbdad7) canvas. Display headline: 72px Hedvig Letters Serif weight 400, #121212, letter-spacing -1.8px. Subtext: 16px Hedvig Letters Sans weight 400, #616161, letter-spacing 0.4px. Primary CTA: #18181b fill, white text, 9999px radius, 6px 16px padding, 14px sans weight 500, letter-spacing 0.7px. Trust line: 12px sans weight 400, #616161, letter-spacing 0.6px.

2. *Pricing card*: White (#ffffff) background, #dbdad7 1px border, 8px radius, 24px padding. Tier name: 18px Hedvig Letters Sans weight 500, #121212, letter-spacing 0.45px. Price: 48px sans weight 500, #121212, letter-spacing 1.2px. Description: 14px sans weight 400, #616161, letter-spacing 0.7px. Features list: 14px sans weight 400, #121212, 8px row gap.

3. *Integration pill*: White (#ffffff) fill, #dbdad7 1px border, 9999px radius, 6px 10px padding. Contains a 16px grayscale tool logo + 12px Hedvig Letters Sans weight 500 label, #121212, letter-spacing 0.6px. Arranged in a wrapping row with 8px gaps.

4. *Announcement badge*: White (#ffffff) fill, #dbdad7 1px border, 9999px radius, 6px 12px padding. Text: 12px Hedvig Letters Sans weight 500, #121212, letter-spacing 0.6px. Trailing arrow icon: 12px, #121212.

5. Create a Primary Action Button: #18181b background, #616161 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Linear** — Same flat monochrome system with pill-shaped controls, hairline borders, and a single dark filled CTA — both treat shadow as a design failure
- **Mercury** — Same editorial typography approach for a financial product — warm canvas, serif/sans contrast, spaced sans-serif body, austere color palette
- **Arc Browser** — Same serif display + spaced sans-serif body pairing and pill-shaped UI elements that treat the browser/app as an editorial object
- **Stripe** — Same editorial typography discipline on marketing pages — large serif headlines above clean sans-serif body, generous whitespace, restrained color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #dbdad7;
  --color-paper: #ffffff;
  --color-sand: #e6e4e0;
  --color-ink: #121212;
  --color-smoke: #616161;
  --color-charcoal: #18181b;
  --color-moss: #4caf50;

  /* Typography — Font Families */
  --font-hedvig-letters-sans: 'Hedvig Letters Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hedvig-letters-serif: 'Hedvig Letters Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.56;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.7px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.5px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-224: 224px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 8px;
  --radius-pills: 9999px;
  --radius-badges: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-parchment: #dbdad7;
  --surface-sand: #e6e4e0;
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #dbdad7;
  --color-paper: #ffffff;
  --color-sand: #e6e4e0;
  --color-ink: #121212;
  --color-smoke: #616161;
  --color-charcoal: #18181b;
  --color-moss: #4caf50;

  /* Typography */
  --font-hedvig-letters-sans: 'Hedvig Letters Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hedvig-letters-serif: 'Hedvig Letters Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.56;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.7px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.5px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-224: 224px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 9999px;
}
```
