# Rox — Style Reference
> Editorial broadsheet meets product UI — black serif masthead on warm newsprint, hairline rules, one blue button

**Theme:** light

Rox uses a high-contrast editorial language on a warm stone canvas: a single massive serif display headline commands the hero while the product interface speaks in compact, hairline-bordered UI. The palette is near-monochrome — warm grays ranging from #ececea canvas to #1c1917 ink — with one electric blue used exclusively for the primary action button. Status states (Enriching, Engaging, Replying) are the only place where multiple chromatic colors appear, and they appear small, as pill badges, never as decorative washes. The system feels like a financial broadsheet redesigned as software: authoritative type, no rounding softness, minimal shadow, and information density where it counts.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Newsprint | `#ececea` | `--color-newsprint` | Page canvas — the warm off-white ground that all sections sit on |
| Bright White | `#ffffff` | `--color-bright-white` | Card surfaces, elevated panels, product mockup backgrounds |
| Bone | `#f5f5f4` | `--color-bone` | Subtle surface wash, alternating bands, input fills |
| Stone 200 | `#d4d2d1` | `--color-stone-200` | Hairline borders, dividers, stepper connectors, table row separators |
| Stone 400 | `#a6a09b` | `--color-stone-400` | Muted helper text, inactive labels, placeholder content |
| Stone 500 | `#87827d` | `--color-stone-500` | Secondary captions, footer text, icon strokes on light |
| Stone 600 | `#57534d` | `--color-stone-600` | Body text secondary, description copy below headlines |
| Stone 700 | `#44403b` | `--color-stone-700` | Body text, table data cells, form labels |
| Stone 800 | `#292524` | `--color-stone-800` | Emphasis body, active link text, nav links |
| Ink Black | `#1c1917` | `--color-ink-black` | Primary text, display headlines, the darkest reading color |
| Char | `#0c0a09` | `--color-char` | Logo mark, maximum-emphasis text, the deepest ink in the system |
| Volt Blue | `#0b64e9` | `--color-volt-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Amber Signal | `#f9b703` | `--color-amber-signal` | Yellow supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Alert Coral | `#f24149` | `--color-alert-coral` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Ember Orange | `#f97006` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Iris Violet | `#6b4aff` | `--color-iris-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### FH Total Display — Hero display headline — a high-contrast didone-style serif at 106–183px with 0.80 line-height creating dramatic overlapping lines. This typeface is the brand's signature: it carries editorial gravitas and makes the hero feel like a magazine cover, not a SaaS landing page. Substitute: 'Playfair Display' or 'DM Serif Display' for close serif proportions. · `--font-fh-total-display`
- **Substitute:** Playfair Display
- **Weights:** 400
- **Sizes:** 106px, 183px
- **Line height:** 0.80
- **Letter spacing:** normal
- **Role:** Hero display headline — a high-contrast didone-style serif at 106–183px with 0.80 line-height creating dramatic overlapping lines. This typeface is the brand's signature: it carries editorial gravitas and makes the hero feel like a magazine cover, not a SaaS landing page. Substitute: 'Playfair Display' or 'DM Serif Display' for close serif proportions.

### Geist — UI sans for headings, nav, button labels, card titles, and data labels — geometric and neutral so the serif hero remains the voice. Geist's slight technical character keeps the product UI feeling modern without competing with the display serif. The -0.02em tracking and character variants (cv03, cv04, cv09, cv11) give it a distinctive subtle optimization for screens. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 18px, 20px, 24px, 28px
- **Line height:** 1.20, 1.30, 1.40
- **Letter spacing:** -0.02em
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** UI sans for headings, nav, button labels, card titles, and data labels — geometric and neutral so the serif hero remains the voice. Geist's slight technical character keeps the product UI feeling modern without competing with the display serif. The -0.02em tracking and character variants (cv03, cv04, cv09, cv11) give it a distinctive subtle optimization for screens.

### system-ui — Small body text, captions, metadata, helper text — uses the system stack with tight -0.03em tracking for compact information density. The tighter tracking at small sizes keeps narrow columns (like table data) legible. · `--font-system-ui`
- **Substitute:** -apple-system, Segoe UI
- **Weights:** 400, 500
- **Sizes:** 8px, 10px, 12px, 14px
- **Line height:** 1.30
- **Letter spacing:** -0.03em
- **Role:** Small body text, captions, metadata, helper text — uses the system stack with tight -0.03em tracking for compact information density. The tighter tracking at small sizes keeps narrow columns (like table data) legible.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | -0.3px | `--text-caption` |
| body | 14px | 1.3 | -0.42px | `--text-body` |
| heading-sm | 18px | 1.3 | -0.36px | `--text-heading-sm` |
| heading | 20px | 1.2 | -0.4px | `--text-heading` |
| heading-lg | 24px | 1.2 | -0.48px | `--text-heading-lg` |
| display | 106px | 0.8 | — | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 4px |
| borders | 1px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.06) 0px 2px 4px 0px` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.08) 0px 2px 3px 0px` | `--shadow-subtle-3` |
| xl | `rgba(0, 0, 0, 0.25) 0px 14px 32px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Action Button
**Role:** The only filled chromatic button — commands the user to start the product

Fill: Volt Blue (#0b64e9). Text: #ffffff, Geist 14px weight 500, -0.02em tracking. Padding: 10px 20px. Radius: 6px. Subtle shadow: rgba(0,0,0,0.04) 0px 1px 2px. No border. The blue is the single saturated color allowed to fill space — every other action is neutral.

### Ghost Nav Button
**Role:** Secondary navigation actions in the header

Fill: transparent. Text: Ink Black (#1c1917), Geist 14px weight 400. No border or 1px #d4d2d1. Padding: 8px 16px. Radius: 6px. Hovers to Bone (#f5f5f4) fill.

### Launch Pill Badge
**Role:** Compact announcement tag above the hero headline

Fill: #ffffff. Border: 1px #d4d2d1. Text: Ink Black (#1c1917), Geist 12px weight 500. Padding: 6px 12px. Radius: 9999px. Contains a play icon and short label — sits as a single line of floating UI above the serif headline.

### Stepper Tab Strip
**Role:** Product flow navigation — shows pipeline stages

Horizontal row of 5 steps. Inactive: Stone 500 (#87827d) text on #ececea, no fill. Active: Ink Black (#1c1917) text on white card with 1px #d4d2d1 border and 6px radius, lifted with rgba(0,0,0,0.06) 0px 2px 4px shadow. Active step has a small icon prefix. Steps connect via subtle hairlines.

### Product UI Card
**Role:** Screenshot-style product preview container

Fill: #ffffff. Border: 1px #d4d2d1. Radius: 12px. Shadow: rgba(0,0,0,0.06) 0px 2px 4px. Internal padding: 24px. Contains a top header bar (agent name + toggle), a body with stat cards on the left and a data table on the right.

### Stat Card
**Role:** Compact metric display in the product UI

Fill: #ffffff. Border: 1px #d4d2d1. Radius: 6px. Padding: 16px. Label: Stone 500, 12px. Big number: Ink Black, 24px weight 500. Sublabel: Stone 400, 10px. Stacks vertically in a column inside the product card.

### Data Table Row
**Role:** Lead/contact rows in the product UI

Background: #ffffff (zebra-striping optional with #f5f5f4). Cell padding: 12px 16px. Border-bottom: 1px #d4d2d1. Name: Ink Black, 14px weight 500. Company: Stone 500, 12px. Status badge follows.

### Status Badge
**Role:** Pipeline stage indicators — the only place multiple chromatic colors appear

Pill shape, 4px radius. Padding: 2px 8px. Text: weight 500, 11px. Variants: Enriching (Amber Signal #f9b703 on #f9b70310 tint), Engaging (Alert Coral #f24149 on tint), Replying (Iris Violet #6b4aff on tint). These are the system's semantic colors and they appear only as small badges — never as backgrounds or decorative elements.

### Top Navigation Bar
**Role:** Site-wide header

Fill: #ececea (transparent over canvas). Height: ~64px. Logo left (ROX wordmark in Char #0c0a09 with small dark icon). Nav links: Ink Black, Geist 14px. Right cluster: 'Company' + flag emoji, 'Contact Sales' ghost link, 'Start now' outlined button. No bottom border — relies on whitespace.

### Logo Trust Bar
**Role:** Social proof — customer logos in a single row

Background: white card with 1px #d4d2d1 border, 12px radius. Logos: rendered in Stone 600 (#57534d) or black, evenly spaced in a single row. Padding: 24px vertical. No logos in color — all monochrome to keep the visual hierarchy to the hero.

### Hero Headline
**Role:** The signature moment — the editorial display serif

Two lines. Line 1: 'Revenue.' in FH Total Display 106px, Ink Black #1c1917, line-height 0.80. Line 2: 'On autopilot.' in same size, Stone 400 #a6a09b (lighter gray). The weight contrast between the two lines creates a visual echo — the statement lands in black, the qualifier recedes. This is the only place the display serif appears.

### Section Header
**Role:** Mid-page section titles

Geist 28px weight 500, Ink Black, -0.02em tracking. Optional description below in Geist 16px weight 400, Stone 600 #57534d. Left-aligned within the max-width container.

### Footer Link
**Role:** Inline links and navigation items

Geist 14px weight 400, Stone 700 #44403b. Hover: Ink Black. No underline by default — underline appears on hover at 1px offset 2px.

## Do's and Don'ts

### Do
- Use the display serif (FH Total Display / Playfair Display) only for the hero headline — it is a one-time-per-page signature, not a repeating style
- Keep all borders at 1px with #d4d2d1 — the system is built on hairlines, not shadows or filled containers
- Use Volt Blue #0b64e9 exclusively for the primary action button — never as a decorative accent, icon fill, or text color
- Maintain the 0.80 line-height on display serif to create dramatic line overlap in the hero
- Use status colors (#f9b703, #f24149, #f97006, #6b4aff) only as pill badges 11px or smaller — they are functional signals, not brand decoration
- Set card radius to 12px and button radius to 6px — this two-tier rounding hierarchy is what separates surface from control
- Keep the warm stone canvas #ececea as the page background for every section — do not introduce white or gray section backgrounds

### Don't
- Do not use the display serif for subheadings, card titles, or navigation — it loses impact when repeated
- Do not apply shadows heavier than rgba(0,0,0,0.06) 0px 2px 4px to cards — the system is flat with hairline borders, not elevated
- Do not round buttons or badges to 9999px — the 6px/4px radii are what keep the interface feeling sharp and editorial
- Do not use chromatic colors as section backgrounds, gradients, or large fills — the page should read as monochrome with a single blue button
- Do not add letter-spacing to the display serif — the tight 0.80 line-height and normal tracking create the masthead feel
- Do not use color logos in the trust bar — all logos must be rendered in Stone 600 or black to maintain the monochrome discipline
- Do not use #000000 for body text — use #1c1917 (Ink Black) for warmer, less harsh reading on the warm canvas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ececea` | Page background — warm stone, the ground on which everything floats |
| 1 | Subtle Wash | `#f5f5f4` | Alternate bands, table headers, muted zones |
| 2 | Card | `#ffffff` | Product UI panels, content cards, dropdowns |
| 3 | Elevated | `#ffffff` | Modals, overlays, tooltips — same white but lifted with shadow |

## Elevation

- **Product UI Card:** `rgba(0, 0, 0, 0.06) 0px 2px 4px 0px`
- **Primary Action Button:** `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px`
- **Stepper Active Tab:** `rgba(0, 0, 0, 0.08) 0px 2px 3px 0px`
- **Link with Shadow:** `rgba(0, 0, 0, 0.25) 0px 14px 32px 0px`

## Imagery

No photography, illustration, or decorative graphics. The visual language is pure typography and UI: the hero is a massive serif headline on warm newsprint, the mid-page is a product UI screenshot (the Outbound Agent dashboard) rendered as a contained card, and the trust bar is monochrome text logos. Icons are thin-stroke monochrome glyphs (play, grid, settings, arrow). The only visual interest comes from typographic contrast — the serif display against the sans UI — and from the product UI card itself, which serves as both explanation and demonstration.

## Layout

Centered max-width container at 1200px. Top nav is a single horizontal bar with logo left, links center-left, actions right — no sticky behavior visible. Hero is a full-canvas vertical block: small pill badge, then two-line centered headline, then subtitle + primary CTA button, then a logo trust bar card. The second section breaks from marketing into product demonstration: a horizontal stepper of 5 pipeline stages, followed by a large product UI card that is left-aligned within the container, showing stat cards stacked left and a data table right. Section gaps are generous (~80px) but internal element gaps are compact (8px) — the page breathes between sections and packs information within them. The overall rhythm is: editorial hero → product proof → trust signals, with alternating tonal zones (canvas → white card → canvas) creating gentle visual separation without section dividers.

## Agent Prompt Guide

**Quick Color Reference**
- Text primary: #1c1917 (Ink Black)
- Text secondary: #57534d (Stone 600)
- Text muted: #a6a09b (Stone 400)
- Background: #ececea (Newsprint canvas)
- Card surface: #ffffff
- Border: #d4d2d1
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Product UI card*: White #ffffff fill, 1px #d4d2d1 border, 12px radius, shadow rgba(0,0,0,0.06) 0px 2px 4px. Internal padding 24px. Top bar: agent name in Geist 18px weight 500 #1c1917, right-aligned toggle/switch. Three stat cards stacked left: white fill, 1px border, 6px radius, 16px padding, big number 24px weight 500 #1c1917, label 12px #87827d. Data table right: rows with 12px 16px cell padding, 1px #d4d2d1 bottom border, name 14px weight 500 #1c1917, company 12px #87827d, status badge trailing.

3. *Stepper tab strip*: Five horizontal steps. Inactive: text in #87827d on transparent, Geist 14px. Active: text in #1c1917, white #ffffff card background, 1px #d4d2d1 border, 6px radius, padding 8px 16px, shadow rgba(0,0,0,0.08) 0px 2px 3px, small icon prefix in Geist. Steps connect with 1px #d4d2d1 hairline lines.

4. *Status badge pill*: Each variant uses a chromatic color at 11px. Enriching: #f9b703 text on #f9b70310 tint. Engaging: #f24149 text on #f2414910 tint. Replying: #6b4aff text on #6b4aff10 tint. All: 4px radius, padding 2px 8px, Geist 11px weight 500.

5. *Logo trust bar*: Single white card, 1px #d4d2d1 border, 12px radius, 24px vertical padding. Five customer logos evenly spaced in a row, all rendered in #57534d (Stone 600) or #0c0a09, no color logos, Geist or similar sans wordmarks.

## Similar Brands

- **Linear** — Same compact UI density, hairline borders, and minimal-shadow card approach — though Linear skews darker, Rox shares the sharp 1px-6px radius hierarchy and monochrome-with-one-accent discipline
- **Vercel** — Similar editorial-meets-product tension: massive display headline, clean Geist-style sans, and a single product UI card as hero proof, with restrained color use
- **Stripe** — Both use serif display type for editorial gravitas paired with clean sans for UI, warm-toned canvas, and a trust bar of monochrome customer logos below the fold
- **Notion** — Shared warm off-white canvas, minimal-shadow cards with hairline borders, and compact information-dense product UI screenshots in the mid-page
- **Anthropic** — Both use a editorial display serif at hero scale against a muted warm canvas, with the product UI itself doing the heavy visual lifting in the second section

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-newsprint: #ececea;
  --color-bright-white: #ffffff;
  --color-bone: #f5f5f4;
  --color-stone-200: #d4d2d1;
  --color-stone-400: #a6a09b;
  --color-stone-500: #87827d;
  --color-stone-600: #57534d;
  --color-stone-700: #44403b;
  --color-stone-800: #292524;
  --color-ink-black: #1c1917;
  --color-char: #0c0a09;
  --color-volt-blue: #0b64e9;
  --color-amber-signal: #f9b703;
  --color-alert-coral: #f24149;
  --color-ember-orange: #f97006;
  --color-iris-violet: #6b4aff;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fh-total-display: 'FH Total Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: -0.3px;
  --text-body: 14px;
  --leading-body: 1.3;
  --tracking-body: -0.42px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.36px;
  --text-heading: 20px;
  --leading-heading: 1.2;
  --tracking-heading: -0.4px;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.48px;
  --text-display: 106px;
  --leading-display: 0.8;

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
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 36px;
  --radius-full: 100px;
  --radius-full-2: 220px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 4px;
  --radius-borders: 1px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.08) 0px 2px 3px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 14px 32px 0px;

  /* Surfaces */
  --surface-canvas: #ececea;
  --surface-subtle-wash: #f5f5f4;
  --surface-card: #ffffff;
  --surface-elevated: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-newsprint: #ececea;
  --color-bright-white: #ffffff;
  --color-bone: #f5f5f4;
  --color-stone-200: #d4d2d1;
  --color-stone-400: #a6a09b;
  --color-stone-500: #87827d;
  --color-stone-600: #57534d;
  --color-stone-700: #44403b;
  --color-stone-800: #292524;
  --color-ink-black: #1c1917;
  --color-char: #0c0a09;
  --color-volt-blue: #0b64e9;
  --color-amber-signal: #f9b703;
  --color-alert-coral: #f24149;
  --color-ember-orange: #f97006;
  --color-iris-violet: #6b4aff;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fh-total-display: 'FH Total Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: -0.3px;
  --text-body: 14px;
  --leading-body: 1.3;
  --tracking-body: -0.42px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.36px;
  --text-heading: 20px;
  --leading-heading: 1.2;
  --tracking-heading: -0.4px;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.48px;
  --text-display: 106px;
  --leading-display: 0.8;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 36px;
  --radius-full: 100px;
  --radius-full-2: 220px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.08) 0px 2px 3px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 14px 32px 0px;
}
```
