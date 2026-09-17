# Increase — Style Reference
> institutional blueprint on vellum — one electric chartreuse stripe cuts the navy calm, mint data signals pulse beneath it.

**Theme:** light

Increase projects the quiet authority of institutional banking through a disciplined navy-and-paper palette, with chartreuse and mint used as deliberate voltage — the only colors bright enough to stop the eye. Typography is structurally mathematical: a custom grotesque (Untitled Sans) pulled tight with negative tracking pairs with a monospaced companion (Input Mono) for code, creating a typographic handshake between API documentation and product surface. Cards float on a warm off-white canvas with subtle tinted shadows rather than hard borders, while a gradient hero grounds the page in cool-to-warm motion. Buttons are nearly black ink on paper — the action language is gravitas, not energy, leaving the accent colors free to signal features, status, and data flow.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Inkwell Navy | `#1a2b3b` | `--color-inkwell-navy` | Primary text, nav text, icon strokes, hairline borders — the structural graphite of every screen. Used as filled button background for primary actions to project institutional weight rather than enthusiasm |
| Slate 600 | `#314352` | `--color-slate-600` | Secondary borders and supporting text where Inkwell Navy is too heavy — outlines on cards, tertiary headings, subdued dividers |
| Abyss | `#0d1726` | `--color-abyss` | Dark code-block and terminal surfaces — deeper than Inkwell Navy so syntax highlighting reads with high voltage against the near-black |
| Graphite | `#687887` | `--color-graphite` | Muted helper text, inactive nav links, secondary button outlines — recedes so the navy headlines and mint accents can carry the hierarchy |
| Steel | `#8995a1` | `--color-steel` | Tertiary text and disabled-state borders — the quietest navy in the scale, used where information is supplementary |
| Fog | `#edf0f2` | `--color-fog` | Page canvas — the warm off-white that holds all content; section bands alternate with pure white to create quiet vertical rhythm |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, form inputs, nav background — the elevated layer that floats above Fog with minimal shadow |
| Silver | `#caced2` | `--color-silver` | Hairline dividers, input borders at rest, table separators — the thread that separates without announcing itself |
| Mist | `#e1e5e9` | `--color-mist` | Card edges and subtle surface tints where a second neutral step is needed between white and Fog |
| Pewter | `#bdc2c8` | `--color-pewter` | Body-level borders, subtle rule lines, the quietest non-white neutral |
| Voltage | `#e4ff33` | `--color-voltage` | Announcement bar, high-attention data highlights, occasional feature accent — the single chromatic punctuation that earns the eye's attention by being used sparingly. Never decorates, always signals |
| Mint Signal | `#31f2bf` | `--color-mint-signal` | Green outline accent for tags, dividers, and focused UI edges |

## Tokens — Typography

### Untitled Sans — Primary interface and display typeface — custom geometric grotesque. Weight 400 runs the body and UI; weight 500 lifts subheadings; weight 700 anchors the wordmark. Negative letter-spacing (-0.04em at display sizes, -0.01em at body) tightens the grotesque into a dense, architectural feel — the closer the eye gets to a heading, the more the letters close ranks, producing a precise, financial-document quality. · `--font-untitled-sans`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 10px, 14px, 16px, 20px, 24px, 32px, 40px, 90px
- **Line height:** 1.00–1.50
- **Letter spacing:** -5.4px at 90px, -1.6px at 40px, -0.32px at 32px, -0.24px at 24px, -0.2px at 20px, -0.16px at 16px, -0.14px at 14px
- **Role:** Primary interface and display typeface — custom geometric grotesque. Weight 400 runs the body and UI; weight 500 lifts subheadings; weight 700 anchors the wordmark. Negative letter-spacing (-0.04em at display sizes, -0.01em at body) tightens the grotesque into a dense, architectural feel — the closer the eye gets to a heading, the more the letters close ranks, producing a precise, financial-document quality.

### Input Mono — Code, API identifiers, numerical data, and inline technical labels. Alternates and stylistic sets ss01/ss02/ss12 are active — these micro-detailed glyph variants give the monospace a humanist, designed quality rather than a default-terminal feel, reinforcing that the product is engineered with intention. · `--font-input-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 10px, 13px, 14px, 20px
- **Line height:** 1.43–1.60
- **Letter spacing:** -0.14px at 14px, -0.13px at 13px, -0.1px at 10px, -0.2px at 20px
- **OpenType features:** `"ss01" on, "ss02" on, "ss12" on`
- **Role:** Code, API identifiers, numerical data, and inline technical labels. Alternates and stylistic sets ss01/ss02/ss12 are active — these micro-detailed glyph variants give the monospace a humanist, designed quality rather than a default-terminal feel, reinforcing that the product is engineered with intention.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.6 | -0.1px | `--text-micro` |
| caption | 13px | 1.54 | -0.13px | `--text-caption` |
| body | 16px | 1.43 | -0.16px | `--text-body` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.17 | -0.96px | `--text-heading-sm` |
| heading | 32px | 1.13 | -1.28px | `--text-heading` |
| heading-lg | 40px | 1.1 | -1.6px | `--text-heading-lg` |
| display | 90px | 1 | -5.4px | `--text-display` |

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
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 12px |
| pills | 999px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |
| sm | `rgba(12, 25, 39, 0.05) 0px 6px 8px 0px, rgba(12, 25, 39, ...` | `--shadow-sm` |
| sm-2 | `rgba(12, 25, 39, 0.03) 0px 6px 8px 0px, rgba(12, 25, 39, ...` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20-24px
- **Element gap:** 8-12px

## Components

### Announcement Bar
**Role:** Full-bleed top-of-page strip for time-bound news, awards, and feature launches.

Background #e4ff33 (Voltage), Inkwell Navy (#1a2b3b) text at 14px weight 500, 4px vertical padding, centered content with an inline chevron. The only place chartreuse earns full-bleed real estate — treat as rare, never decorative.

### Top Navigation
**Role:** Primary header carrying brand, product taxonomy, account actions.

White (#ffffff) background, 64–72px tall, brand wordmark left at 20px weight 700, nav links at 16px weight 500 Inkwell Navy with 8px gap. Right cluster: text-link 'Sign in' (Graphite #687887) and filled primary 'Sign up' (Inkwell Navy bg, white text, 8px radius, 10px 20px padding). Hairline 1px Silver (#caced2) bottom border.

### Primary Filled Button
**Role:** The default action affordance — sign-up, create, submit.

Inkwell Navy (#1a2b3b) background, white text at 16px weight 500, 8px radius, 10px vertical / 20px horizontal padding, subtle two-layer black shadow (0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)). Trailing chevron is part of the variant grammar. Letter-spacing -0.16px.

### Ghost / Outlined Button
**Role:** Secondary actions — 'Contact sales', 'Sign in', 'Learn more'.

Transparent background, 1px Inkwell Navy border, Inkwell Navy text, 8px radius, 10px 20px padding, trailing chevron at right. When on white cards, the border is the only visual weight.

### Hero Headline
**Role:** Page-opening display line establishing product category.

Untitled Sans 90px / line-height 1.0, weight 500, Inkwell Navy, letter-spacing -5.4px (-0.06em). Set tight on two lines; the extreme negative tracking is the signature — the headline reads as a single dense block of type rather than airy display copy.

### Hero Subtext
**Role:** Supporting paragraph under the headline.

Untitled Sans 20px / line-height 1.4, weight 400, Graphite (#687887), letter-spacing -0.2px. Max width ~540px, two to three lines, left-aligned.

### Code Block Card
**Role:** Live API demonstration embedded in hero and feature sections.

Abyss (#0d1726) background, 12px radius, 20–24px padding, soft navy-tinted shadow. Syntax uses Input Mono 14px: keywords in Voltage (#e4ff33), strings in Mint Signal (#31f2bf), identifiers in light blue (#33bbff — content-only, not a UI token), numbers in white. Line numbers and line-height 1.54. The dark card sits as the visual counterweight to the white form card beside it.

### Product Feature Card
**Role:** Feature highlight in a 4-column grid (ACH, Cards, Bank accounts, Wires, etc.).

White (#ffffff) background, 12px radius, 1px Mist (#e1e5e9) border, 20–24px padding, faint tinted shadow. Mint Signal (#31f2bf) icon container at top-left — a 40–48px square with 1.5px stroke icon on a subtle mint-tinted surface. Title at 16px weight 500 Inkwell Navy, description at 13px Graphite, 8px vertical gap between.

### Icon Badge
**Role:** Reusable icon container for feature cards and inline labels.

40×40px (or 48×48px) square, 8px radius, Mint Signal (#31f2bf) 1.5px stroke icon centered on a near-white mint-tinted fill (rgba(49,242,191,0.08) effect). The mint-on-mint treatment is the visual signature of an 'active system feature'.

### Trust Logo Bar
**Role:** Social proof band beneath the hero.

Fog (#edf0f2) full-bleed band, centered row of monochrome navy wordmarks (gusto, stripe, ramp, check, AtoB, vantaca, coast) at 24–28px, all rendered in Inkwell Navy or Graphite, 48–64px gap between logos. No logos are colored — uniformity signals impartiality.

### Gradient Accent Visual
**Role:** Decorative hero backdrop and feature-section color washes.

Series of left-to-right linear gradients cycling through Voltage → mint → cyan → blue (linear-gradient(90deg, #deff34, #8cf97c), → linear-gradient(90deg, #65f75f, #12f0aa), → linear-gradient(90deg, #45f4bc, #33dfdf), → linear-gradient(90deg, #01d3d8, #02b7f1)). Used as 3D geometric blocks floating behind hero content, clipped with sharp angular edges — never soft-blurred.

### Form Input
**Role:** Text input in the hero demo card ('Send an ACH transfer').

White background, 1px Silver (#caced2) border, 8px radius, 12–16px padding, 16px body text Inkwell Navy. Label above at 13px weight 500 Graphite. Focus state: 2px Mint Signal border. Active/highlighted input shows a mint-tinted fill.

### Step Progress Indicator
**Role:** Multi-step flow visualization inside product cards.

Horizontal line with two filled mint nodes connected by a 2px Mint Signal stroke. A third node appears as a hollow mint circle indicating pending step. Label set in 14px Input Mono for numerical precision feel.

## Do's and Don'ts

### Do
- Use Inkwell Navy (#1a2b3b) as the only filled-button background — never a chromatic fill for a primary action.
- Set display type at 90px with -5.4px letter-spacing to preserve the dense, financial-document quality of headlines.
- Apply the Voltage (#e4ff33) announcement-bar color only on full-bleed strips or single token highlights — never on cards, buttons, or text.
- Use 12px radius for cards and 8px radius for buttons, inputs, and nav; reserve 999px exclusively for pill tags.
- Pair Untitled Sans for prose and UI with Input Mono (with ss01/ss02/ss12 active) for all code, numbers, and API identifiers.
- Let cards float on Fog (#edf0f2) canvas with the navy-tinted three-layer shadow stack rather than hard borders.
- Render the four-step gradient (chartreuse → mint → cyan → blue) only as angular geometric blocks behind hero copy — never as soft glows or button backgrounds.

### Don't
- Don't use Mint Signal (#31f2bf) or Voltage (#e4ff33) as a primary button fill — they are signal colors, not action colors.
- Don't add a second saturated accent — the system runs on navy + chartreuse + mint only; introducing a fourth chromatic breaks the institutional register.
- Don't use straight #000000 for text on white surfaces — Inkwell Navy reads as authoritative while pure black reads as unfinished.
- Don't soften the hero gradients with blur or rounded edges — the angular, faceted geometry is what makes them read as financial infrastructure rather than marketing artwork.
- Don't use letter-spacing greater than -0.01em at body sizes — the negative tracking is what makes Untitled Sans feel architectural; loosening it dissolves the brand.
- Don't promote the code-syntax blue (#33bbff) into the UI palette — it exists only inside the code-block context.
- Don't add a dark mode variant without rebuilding the canvas as a warmer near-black (#0d1726-family) — the cool gray-navy scale does not invert cleanly to a black scale.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#edf0f2` | Warm off-white field that holds all content sections; provides the neutral backdrop against which white cards and the chartreuse announcement bar gain their contrast. |
| 1 | Card Surface | `#ffffff` | Pure white for product cards, feature panels, nav, and inputs — the layer that floats above canvas with subtle tinted shadow. |
| 2 | Code Surface | `#0d1726` | Deepest surface in the system, used exclusively for code blocks and terminal demos; syntax colors (mint, blue, chartreuse) pop against it. |
| 3 | Announcement Surface | `#e4ff33` | Single-purpose full-bleed strip for time-sensitive messaging; the only surface in the system with native chromatic energy. |

## Elevation

- **Cards (standard):** `0px 6px 8px 0px rgba(12, 25, 39, 0.03), 0px 18px 22px 0px rgba(12, 25, 39, 0.09)`
- **Cards (elevated/feature):** `0px 6px 8px 0px rgba(12, 25, 39, 0.05), 0px 16px 20px 0px rgba(12, 25, 39, 0.06), 0px 50px 60px 0px rgba(12, 25, 39, 0.1)`
- **Buttons:** `0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)`

## Imagery

Imagery is sparse and product-driven. The hero is dominated by two UI cards (dark code block, light form) rather than photography, with a single 3D geometric gradient block floating behind — angular, faceted, no rounded edges or soft glows. Feature sections use iconography (mint-stroke line icons in tinted squares) rather than screenshots or photos. The trust band is a row of monochrome navy wordmarks. No lifestyle photography appears anywhere — the visual language is deliberately diagrammatic, closer to a financial terminal than a consumer fintech.

## Layout

Max-width 1200px centered container with a 80–96px section gap between major bands. The hero is a split composition: left half holds the 90px headline, subtext, and two-button cluster; right half holds the dual-card visual stack (dark code card below, white form card above, both with a subtle 12px offset). Below the hero sits a centered trust-logo band, then a centered heading plus 4×2 product feature grid on Fog canvas, then alternating white/Fog content bands. Navigation is a single sticky top bar with a separate chartreuse announcement strip above it. Sections are separated by background-color alternation rather than dividers — vertical rhythm comes from canvas color, not rules.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1a2b3b (Inkwell Navy)
- background: #edf0f2 (Fog canvas), #ffffff (cards)
- border: #caced2 (Silver hairline), #1a2b3b (Inkwell structural)
- accent: #31f2bf (Mint Signal) for icons/data flow
- voltage: #e4ff33 (announcement bar only)
- primary action: #1a2b3b (filled action)

**3 Example Component Prompts**

1. *Build the hero block*: 1200px max-width container on Fog (#edf0f2) canvas. Left column: 90px Untitled Sans weight 500 headline in Inkwell Navy (#1a2b3b) with -5.4px letter-spacing, line-height 1.0. Below: 20px weight 400 Graphite (#687887) subtext at line-height 1.4, max-width 540px. Two buttons side by side with 12px gap: a filled Inkwell Navy button (8px radius, 10px 20px padding, white text, trailing chevron) and a ghost button (transparent, 1px Inkwell Navy border, 8px radius, same padding). Right column: dark code card (Abyss #0d1726, 12px radius, 24px padding) stacked behind a white form card (12px radius, Mist #e1e5e9 1px border, subtle tinted shadow), with a floating angular gradient block (chartreuse-to-blue linear gradient) behind both.

2. *Build a product feature card*: White (#ffffff) background, 12px radius, 1px Mist (#e1e5e9) border, 20px padding, navy-tinted three-layer shadow. Top-left: 48×48px mint icon badge — 8px radius, near-white mint fill, Mint Signal (#31f2bf) 1.5px stroke icon centered. Below: 16px weight 500 Inkwell Navy title, 8px gap, 13px Graphite (#687887) description, max two lines. 4-column grid, 24px gap between cards.

3. *Build the announcement bar*: Full-bleed Voltage (#e4ff33) background strip, 4px vertical padding, centered Inkwell Navy (#1a2b3b) text at 14px weight 500 with -0.14px letter-spacing, trailing inline chevron. No border, no shadow, no radius — the bar must read as a flat, urgent message.

## Similar Brands

- **Modern Treasury** — Same institutional-navy-on-warm-canvas fintech-API visual register with tight grotesque typography and dark code surfaces as the product hero.
- **Plaid** — Banking-infrastructure brand language: restrained near-black text, white cards, single bright accent for data flow, monospaced type for API credibility.
- **Mercury** — Premium fintech with a muted navy/paper palette and minimal use of color — confidence through typographic discipline rather than chromatic energy.
- **Linear** — Geometric grotesque at display sizes with extreme negative tracking, paper-canvas surface, and accent color used as rare data signal rather than decoration.
- **Stripe** — Developer-facing financial product with the same code-block-into-product-surface integration and institutional restraint in the primary palette.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-inkwell-navy: #1a2b3b;
  --color-slate-600: #314352;
  --color-abyss: #0d1726;
  --color-graphite: #687887;
  --color-steel: #8995a1;
  --color-fog: #edf0f2;
  --color-pure-white: #ffffff;
  --color-silver: #caced2;
  --color-mist: #e1e5e9;
  --color-pewter: #bdc2c8;
  --color-voltage: #e4ff33;
  --color-mint-signal: #31f2bf;

  /* Typography — Font Families */
  --font-untitled-sans: 'Untitled Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-input-mono: 'Input Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.6;
  --tracking-micro: -0.1px;
  --text-caption: 13px;
  --leading-caption: 1.54;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.96px;
  --text-heading: 32px;
  --leading-heading: 1.13;
  --tracking-heading: -1.28px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -5.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20-24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 12px;
  --radius-pills: 999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-sm: rgba(12, 25, 39, 0.05) 0px 6px 8px 0px, rgba(12, 25, 39, 0.06) 0px 16px 20px 0px, rgba(12, 25, 39, 0.1) 0px 50px 60px 0px;
  --shadow-sm-2: rgba(12, 25, 39, 0.03) 0px 6px 8px 0px, rgba(12, 25, 39, 0.09) 0px 18px 22px 0px;

  /* Surfaces */
  --surface-page-canvas: #edf0f2;
  --surface-card-surface: #ffffff;
  --surface-code-surface: #0d1726;
  --surface-announcement-surface: #e4ff33;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-inkwell-navy: #1a2b3b;
  --color-slate-600: #314352;
  --color-abyss: #0d1726;
  --color-graphite: #687887;
  --color-steel: #8995a1;
  --color-fog: #edf0f2;
  --color-pure-white: #ffffff;
  --color-silver: #caced2;
  --color-mist: #e1e5e9;
  --color-pewter: #bdc2c8;
  --color-voltage: #e4ff33;
  --color-mint-signal: #31f2bf;

  /* Typography */
  --font-untitled-sans: 'Untitled Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-input-mono: 'Input Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.6;
  --tracking-micro: -0.1px;
  --text-caption: 13px;
  --leading-caption: 1.54;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -0.96px;
  --text-heading: 32px;
  --leading-heading: 1.13;
  --tracking-heading: -1.28px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -5.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-sm: rgba(12, 25, 39, 0.05) 0px 6px 8px 0px, rgba(12, 25, 39, 0.06) 0px 16px 20px 0px, rgba(12, 25, 39, 0.1) 0px 50px 60px 0px;
  --shadow-sm-2: rgba(12, 25, 39, 0.03) 0px 6px 8px 0px, rgba(12, 25, 39, 0.09) 0px 18px 22px 0px;
}
```
