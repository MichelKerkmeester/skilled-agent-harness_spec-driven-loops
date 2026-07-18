# Era — Style Reference
> Quiet ledger on warm paper

**Theme:** light

Era operates in a near-monochrome editorial register: a warm parchment canvas, ink-black typography, and just enough chromatic punctuation — a soft lavender wash, a teal panel, a black card — to make three product surfaces feel like distinct chapters in a printed financial document. The visual system privileges typographic confidence over decoration: a custom variable sans-serif at tight negative tracking carries all the weight, and the interface stays text-first, with components reduced to pill buttons, hairline borders, and flat cards with zero shadow. Every screen should feel like a well-typeset magazine spread — quiet authority, generous whitespace, and color appearing only when a surface needs to announce itself as a distinct product. Density is comfortable, not dense; the rhythm comes from large headlines and 16px padding breathing inside cards, not from packed information rows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#191a17` | `--color-ink` | Primary text, filled CTA buttons, nav links, icon strokes, card borders — the near-black that carries the entire typographic and action system. Used as filled pill background for primary actions (white text) and as hairline border on outlined buttons |
| Parchment | `#f3f3f1` | `--color-parchment` | Page canvas background — a warm off-white that replaces pure white as the base surface, giving the entire site a paper-like editorial warmth rather than a clinical SaaS feel |
| Ash | `#e6e6e4` | `--color-ash` | Hairline borders, divider lines, footer borders, subtle surface elevation — the structural gray that separates content without ever competing with it |
| Paper | `#ffffff` | `--color-paper` | Light neutral action fill for buttons on dark surfaces. |
| Smoke | `#868784` | `--color-smoke` | Secondary text, link underlines, icon fills, muted helper copy — the mid-gray that recedes so Ink can lead |
| Charcoal | `#3d3d3d` | `--color-charcoal` | Dark badge backgrounds where full Ink feels too heavy — used sparingly for tag fills that need to read as dark without the starkness of pure black |
| Sage Wash | `#add2d1` | `--color-sage-wash` | Product feature card background (Thesis panel) — a desaturated teal that introduces the only sustained chromatic presence in the UI without ever becoming loud |
| Slate Teal | `#9dbebe` | `--color-slate-teal` | Secondary product card background — a deeper desaturated teal for the Agency-adjacent surface, harmonizing with Sage Wash as a tonal pair |
| Dusk Gradient | `linear-gradient(90deg, rgb(201, 197, 225) 0%, rgb(234, 211, 221) 100%)` | `--color-dusk-gradient` | Supporting palette color for small decorative accents when the core palette needs contrast. |

## Tokens — Typography

### Saans VF — Exclusive typeface across all UI. Custom variable font with five weights; the 380 weight carries display and headlines (unusually light for a fintech — confidence through restraint, not volume). 400 for body. 500 for subheadings and button text. 600-670 for emphasized labels and nav. Negative letter-spacing tightens at larger sizes (-0.02em at 30px+), normalizes toward body. lnum + tnum features force lining and tabular numerals, critical for financial data alignment. · `--font-saans-vf`
- **Substitute:** Inter (closest free match in weight range and geometric humanism)
- **Weights:** 380, 400, 500, 600, 670
- **Sizes:** 12, 13, 15, 16, 20, 30, 35, 56
- **Line height:** 1.15, 1.20, 1.25, 1.30, 1.38, 1.40, 1.50
- **Letter spacing:** -0.02em at 30px+ sizes, -0.01em at 20px and below
- **OpenType features:** `"lnum" on, "tnum" on`
- **Role:** Exclusive typeface across all UI. Custom variable font with five weights; the 380 weight carries display and headlines (unusually light for a fintech — confidence through restraint, not volume). 400 for body. 500 for subheadings and button text. 600-670 for emphasized labels and nav. Negative letter-spacing tightens at larger sizes (-0.02em at 30px+), normalizes toward body. lnum + tnum features force lining and tabular numerals, critical for financial data alignment.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.12px | `--text-caption` |
| body-lg | 16px | 1.4 | -0.16px | `--text-body-lg` |
| subheading | 20px | 1.38 | -0.2px | `--text-subheading` |
| heading-sm | 30px | 1.25 | -0.6px | `--text-heading-sm` |
| heading | 35px | 1.2 | -0.7px | `--text-heading` |
| display | 56px | 1.15 | -1.12px | `--text-display` |

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

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 6px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main conversion action (Get started free, primary product CTAs)

Filled pill button. Background #191a17 (Ink), text #ffffff (Paper), 9999px radius, 16px horizontal padding, 8px vertical padding. Saans VF 500 at 15px, -0.01em tracking. No border, no shadow. Hover state not extracted — assume slight lightness shift.

### Outlined Action Button
**Role:** Secondary actions and OAuth providers (Continue with Google, Add to Claude)

Ghost pill button. Background #ffffff (Paper), 1px border #191a17 (Ink) at 92+ evidence occurrences, 9999px radius, 16px horizontal padding, 8px vertical padding. Saans VF 500 at 15px. Optional leading icon (Google logo, sparkle icon).

### Inline Text Link
**Role:** Nav links, inline text links

Smoke (#868784) or Ink (#191a17) Saans VF 400 at 15px, with 1px underline border at 52+ occurrences in the same color. No box, no padding — sits inline with text flow.

### Product Feature Card — Context
**Role:** Hero product card with gradient background

12px radius, Dusk Gradient fill (linear-gradient(90deg, #c9c5e1, #ead3dd)), 24px padding. Badge 'Personal MCP' (6px radius, light fill, Ink text) top-right. Saans VF 380 at 30px heading, 15px body in Ink. Product screenshot (phone mockup) anchored bottom-right, partially overflowing the card edge.

### Product Feature Card — Agency
**Role:** Dark inverted product card

12px radius, #191a17 (Ink) fill, 24px padding. Badge 'Native app' (6px radius, Ash or white fill, Ink text) top-right. Saans VF 380 at 30px heading, 15px body in #ffffff (Paper). Full-bleed dark surface creates the strongest contrast moment in the product grid.

### Product Feature Card — Thesis
**Role:** Sage-colored product card

12px radius, #add2d1 (Sage Wash) fill, 24px padding. All text in Ink (#191a17). The softest of the three product surfaces — reads as a tonal variation rather than a separate visual world.

### FAQ Accordion Item
**Role:** Expandable question in the FAQ section

Full-width row, 1px bottom border in #e6e6e4 (Ash). Question text: Saans VF 500 at 15px, Ink. Plus/minus toggle icon (Ink) right-aligned, 16px. Expanded answer: Saans VF 400 at 15px, Smoke (#868784), 16px top padding, 16px bottom padding before the next border.

### Product Badge / Tag
**Role:** Small label on product cards and feature highlights

6px radius, light Ash (#e6e6e4) or Paper (#ffffff) background, Ink text, ~8px horizontal padding, ~4px vertical padding. Saans VF 500 at 12px. Sometimes prefixed with a decorative diamond icon (✦) in Ink.

### Partner Logo Strip
**Role:** Horizontal row of AI platform logos (Cursor, Gemini, Perplexity, Cline, OpenAI, etc.)

Single horizontal row, centered, ~48px gap between logos. All logos rendered in Smoke (#868784) — desaturated to harmonize with the monochrome system. No logos in full color.

### Section Heading
**Role:** Section-level titles (e.g., 'Frequently asked questions')

Saans VF 380 at 35px, Ink (#191a17), -0.02em letter-spacing, 1.20 line-height. Left-aligned. No underline, no decorative element — the size and weight do the work.

### Hero Headline
**Role:** Primary page headline ('Make Claude manage your money.')

Saans VF 380 at 56px, Ink (#191a17), -0.02em letter-spacing, 1.15 line-height. Light weight at display size is the signature: most fintechs shout at 56px with weight 700; Era whispers at weight 380 and lets the sentence structure do the work.

### Footer
**Role:** Site footer with links and border

1px top border in #e6e6e4 (Ash), 48px vertical padding. Saans VF 400 at 13px, Smoke links. No logo color treatment, no social icons in color — the footer stays in the monochrome register.

### Decorative Diamond Icon
**Role:** Brand symbol and section marker (✦)

Simple four-point diamond in Ink (#191a17), ~12px, used as a visual bullet before section labels and inside badges. The only custom mark in the system.

## Do's and Don'ts

### Do
- Use Saans VF at weight 380 for any headline 30px or larger — the whisper-weight is the signature
- Set card radius to 12px and button radius to 9999px — these two values define the surface vocabulary
- Keep the page canvas at #f3f3f1 (Parchment), not pure white — the warm off-white is what makes the editorial metaphor hold
- Use Ink (#191a17) as the filled button background with Paper (#ffffff) text for primary actions
- Apply -0.02em letter-spacing at 30px+ sizes and -0.01em at 20px and below
- Use tnum and lnum font features on all numeric content — financial alignment depends on tabular figures
- Communicate elevation through surface color (Sage, Slate, Dusk, Ink panels) rather than shadows

### Don't
- Do not use weight 600+ for headlines — the light-weight display is the brand's anti-convention signature
- Do not add drop shadows to cards, buttons, or modals — the system is intentionally flat
- Do not introduce saturated brand colors (red, blue, green) — the palette is near-monochrome by design
- Do not render partner logos in their full brand colors — all must be desaturated to Smoke (#868784)
- Do not use pure white (#ffffff) as the page background — always Parchment (#f3f3f1)
- Do not use radius values other than 9999px (buttons), 12px (cards), 6px (badges) — these three values carry the shape system
- Do not skip letter-spacing on large text — the tight tracking at -0.02em is what makes the 56px headlines feel typeset rather than default

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#f3f3f1` | Page background — warm off-white base |
| 1 | Paper Card | `#ffffff` | Standard card surface on parchment |
| 2 | Ash Divider | `#e6e6e4` | Hairline borders, footer rules, subtle structural lines |
| 3 | Sage Product Card | `#add2d1` | Thesis product feature card background |
| 4 | Slate Product Card | `#9dbebe` | Secondary product card background |
| 5 | Dusk Product Card | `#c9c5e1` | Context product card — lavender gradient surface |
| 6 | Ink Product Card | `#191a17` | Agency product card — near-black full-bleed panel |

## Elevation

Era uses zero shadows. Elevation is communicated through color contrast and surface fills alone — dark cards on parchment, white cards on parchment, and colored product panels. This flatness is deliberate: it keeps the editorial magazine metaphor intact and avoids the soft-shadow vocabulary of conventional SaaS.

## Imagery

Era uses almost no imagery. The visual world is built from typography, surface color, and product mockups. The only images present are: (1) a phone screenshot of a ChatGPT conversation inside the Context card, (2) a chart mockup in the Context card, and (3) grayscale partner logos (Cursor, Gemini, Perplexity, Cline, OpenAI) in the trust strip. The three product cards carry color as their primary visual identity: lavender gradient, near-black, and sage teal. No photography, no illustration, no 3D renders — the interface is pure editorial design language with product artifacts embedded as evidence.

## Layout

Max-width ~1200px centered container, with the hero and major sections contained within it. Hero is a two-column split: left column holds the 56px headline, right column holds the subtext and two stacked pill buttons (Google OAuth + Add to Claude). Below the hero, a centered single-row partner logo strip acts as a trust band. The product section is a 3-column card grid (Context / Agency / Thesis) with equal-width cards, each ~12px radius and 24px internal padding, with product screenshots partially overflowing the card boundaries to create visual depth without shadows. The FAQ section is a full-width single-column list with hairline bottom borders, no background card. Navigation is a minimal top bar: wordmark left ('era'), nav links (Pricing, Company, Articles) + Sign in + filled CTA button right. Section gaps are generous (~80px), card padding is 24px, element gaps are 16px — the rhythm is spacious and editorial, not dense.

## Agent Prompt Guide

**Quick Color Reference**
- text: #191a17 (Ink)
- background: #f3f3f1 (Parchment)
- card surface: #ffffff (Paper)
- border / divider: #e6e6e4 (Ash)
- muted text / secondary: #868784 (Smoke)
- primary action: #191a17 (filled action)

**3-5 Example Component Prompts**

1. **Hero Headline**: 56px Saans VF weight 380, color #191a17, letter-spacing -1.12px, line-height 1.15. Set on a #f3f3f1 page canvas. No underline, no decoration.

2. **Primary CTA Button**: Pill shape (border-radius 9999px), background #191a17, color #ffffff, padding 8px 16px, font Saans VF weight 500 at 15px, letter-spacing -0.15px. No border, no shadow. Text: 'Get started free'.

3. **Outlined OAuth Button**: Pill shape (border-radius 9999px), background #ffffff, 1px solid border #191a17, padding 8px 16px, font Saans VF weight 500 at 15px, color #191a17. Leading icon slot 16px left, 8px gap to label.

4. **Product Feature Card (Agency variant)**: 12px border-radius, background #191a17, padding 24px. Top-right badge: 6px radius, background #e6e6e4, padding 4px 8px, font Saans VF weight 500 at 12px, color #191a17, text 'Native app'. Heading: Saans VF weight 380 at 30px, color #ffffff, letter-spacing -0.6px. Body: Saans VF weight 400 at 15px, color #ffffff.

5. **FAQ Accordion Row**: Full width, 1px bottom border in #e6e6e4, no other borders. Question: Saans VF weight 500 at 15px, color #191a17. Plus/minus icon right-aligned in #191a17, 16px. Row padding: 16px vertical.

## Similar Brands

- **Mercury** — Same fintech-meets-editorial approach: warm off-white canvas, near-monochrome palette with Ink as the dominant text and action color, and pill-shaped buttons.
- **Linear** — Shared monochrome restraint and confidence in typography — both systems use a custom or premium sans-serif at light display weights and let negative letter-spacing do the typographic work.
- **Ramp** — Similar editorial fintech layout: max-width contained hero with split text+CTAs, generous spacing, and a quiet neutral palette that lets product surfaces carry the color.
- **Arc Browser** — Both use warm off-white canvases (not pure white) as a deliberate departure from clinical SaaS, paired with near-monochrome interfaces and pill-shaped controls.
- **Stripe** — Shared commitment to editorial-grade typography and gradient accent panels for product showcases — Era's lavender-to-pink gradient card echoes Stripe's soft product hero treatments.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #191a17;
  --color-parchment: #f3f3f1;
  --color-ash: #e6e6e4;
  --color-paper: #ffffff;
  --color-smoke: #868784;
  --color-charcoal: #3d3d3d;
  --color-sage-wash: #add2d1;
  --color-slate-teal: #9dbebe;
  --color-dusk-gradient: #c9c5e1;
  --gradient-dusk-gradient: linear-gradient(90deg, rgb(201, 197, 225) 0%, rgb(234, 211, 221) 100%);

  /* Typography — Font Families */
  --font-saans-vf: 'Saans VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.12px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.6px;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --tracking-heading: -0.7px;
  --text-display: 56px;
  --leading-display: 1.15;
  --tracking-display: -1.12px;

  /* Typography — Weights */
  --font-weight-w380: 380;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-w670: 670;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 6px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-parchment-canvas: #f3f3f1;
  --surface-paper-card: #ffffff;
  --surface-ash-divider: #e6e6e4;
  --surface-sage-product-card: #add2d1;
  --surface-slate-product-card: #9dbebe;
  --surface-dusk-product-card: #c9c5e1;
  --surface-ink-product-card: #191a17;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #191a17;
  --color-parchment: #f3f3f1;
  --color-ash: #e6e6e4;
  --color-paper: #ffffff;
  --color-smoke: #868784;
  --color-charcoal: #3d3d3d;
  --color-sage-wash: #add2d1;
  --color-slate-teal: #9dbebe;
  --color-dusk-gradient: #c9c5e1;

  /* Typography */
  --font-saans-vf: 'Saans VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.12px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.6px;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --tracking-heading: -0.7px;
  --text-display: 56px;
  --leading-display: 1.15;
  --tracking-display: -1.12px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```
