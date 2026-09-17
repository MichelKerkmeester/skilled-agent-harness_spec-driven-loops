# Shortcut — Style Reference
> indigo ink on white paper — A whiteboard surface where one confident violet stroke does all the work.

**Theme:** light

Shortcut's visual language is an indigo-ink-on-white-paper system: a quiet, high-key canvas interrupted by a single vivid violet that does the talking. The product lives on flat white surfaces with near-invisible hairline borders; depth comes from generous whitespace and the occasional pale lavender card, never from drop shadows. Typography is a single geometric sans (Satoshi) set tight and confident at modest sizes — the interface never shouts, it narrates. Color is rationed like punctuation: deep midnight (#08093f) anchors dark sections and footers, vivid indigo (#494bcb) marks every primary action, and a single warm yellow badge appears as decorative accent. The mood is professional, restrained, and tool-like — a workhorse product UI dressed in just enough brand to feel deliberate without becoming decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vivid Indigo | `#494bcb` | `--color-vivid-indigo` | Primary action background, filled buttons, active nav, brand focal point — the one chromatic color that carries the entire brand |
| Midnight Ink | `#08093f` | `--color-midnight-ink` | Footer background, dark section canvases, heading accent on dark surfaces — near-black with violet undertone ties it to the brand |
| Soft Violet | `#8a8ac6` | `--color-soft-violet` | Icon strokes, decorative SVG borders, illustration outlines — the muted cousin of the brand color, used where saturated indigo would be too loud |
| Pale Lavender | `#9f7ad0` | `--color-pale-lavender` | Badge accent border, decorative illustration strokes — provides warmth without competing with the primary |
| Sunlit Yellow | `#ffde87` | `--color-sunlit-yellow` | Decorative badge fill, section eyebrow pills, highlight wash — a single warm note against the cool indigo system |
| Pale Lilac | `#eaeaf7` | `--color-pale-lilac` | Subtle button surface, card hover wash, ghost UI background — the lightest tint of the brand violet |
| Pure White | `#ffffff` | `--color-pure-white` | Primary page canvas, card surface, button text, image backgrounds |
| Frost Gray | `#f6f6fa` | `--color-frost-gray` | Alternate section background, subtle surface lift above white, badge surface |
| Slate | `#686878` | `--color-slate` | Body text borders, hairline dividers, card outlines — the structural neutral |
| Graphite | `#222222` | `--color-graphite` | Primary text on light surfaces, nav text, button text — high-contrast reading color |
| Ash | `#333333` | `--color-ash` | Secondary text, image borders, link text on white |
| Stone | `#6d737d` | `--color-stone` | Muted helper borders, inactive UI outlines |
| Fog | `#aaaab0` | `--color-fog` | Nav dividers, inactive nav text, subtle UI separators |

## Tokens — Typography

### Satoshi — Sole typeface across the entire system — Satoshi 700 for display and headings, Satoshi 500 for body, labels, and buttons. The geometric, slightly rounded letterforms feel modern but not trendy; the tight -0.02em tracking at all sizes gives everything a compact, engineered quality. Use Inter as a freely available substitute; Geist is also close. · `--font-satoshi`
- **Substitute:** Inter
- **Weights:** 500, 700
- **Sizes:** 10px, 13px, 14px, 15px, 17px, 19px, 21px, 46px, 61px
- **Line height:** 1.10–1.80
- **Letter spacing:** -0.02em consistently at all sizes
- **Role:** Sole typeface across the entire system — Satoshi 700 for display and headings, Satoshi 500 for body, labels, and buttons. The geometric, slightly rounded letterforms feel modern but not trendy; the tight -0.02em tracking at all sizes gives everything a compact, engineered quality. Use Inter as a freely available substitute; Geist is also close.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.26px | `--text-caption` |
| body | 15px | 1.5 | -0.3px | `--text-body` |
| heading-sm | 19px | 1.27 | -0.38px | `--text-heading-sm` |
| heading | 21px | 1.27 | -0.42px | `--text-heading` |
| heading-lg | 46px | 1.1 | -0.92px | `--text-heading-lg` |
| display | 61px | 1.1 | -1.22px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 76 | 76px | `--spacing-76` |
| 84 | 84px | `--spacing-84` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 7.6px |
| pills | 35.8px |
| badges | 7.6px |
| images | 7.6px |
| buttons | 7.6px |
| largeCards | 15.2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.04) 0px 20px 13px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 73px
- **Card padding:** 19px
- **Element gap:** 4-8px

## Components

### Primary Filled Button
**Role:** Main conversion action — the only chromatic button fill in the system

Background: #494bcb (Vivid Indigo). Text: #ffffff, Satoshi 500, 15px, -0.02em letter-spacing, 1.27 line-height. Padding: 11px 19px. Radius: 7.6px. No border. Appears on both light and dark backgrounds — on dark, the same indigo fill holds because the section is already midnight-toned.

### Ghost Outlined Button
**Role:** Secondary action paired with the primary

Transparent background, 1px border in #ffffff (on dark sections) or #222222 (on light sections). Text matches border color. Satoshi 500, 15px. Padding: 11px 19px. Radius: 7.6px. Never uses the brand color for the outline — ghost means neutral.

### Section Eyebrow Badge
**Role:** Tiny label above a section heading — names the topic without claiming hierarchy

Horizontal pill. Background: #f6f6fa on light sections, #eaeaf7 on dark sections. Text: Graphite (#222222) on light, #ffffff on dark. Satoshi 500, 13px. Padding: 4px 15px. Radius: 35.8px (full pill). Examples in data: "Product Development", "Product Planning", "Customizations".

### Decorative Yellow Badge
**Role:** Annotation badge with warm accent — sparingly used, never functional

Background: #ffde87. Text: Graphite (#222222). Satoshi 700, 10-13px. Border: 1px #ffde87. Radius: 7.6px or 35.8px. Appears as decorative callout annotation (like the "Add Health Updates" hand-drawn label in the dark hero).

### Feature Card (Light)
**Role:** Content card on the customizations/features grid

Background: #ffffff. Border: 1px #686878. Radius: 15.2px (larger than buttons). Padding: 19px. Contains an icon (muted violet #8a8ac6 stroke), heading-sm, body text, and a small UI preview. No shadow — the border does the lifting.

### Top Navigation Bar
**Role:** Persistent site navigation

Background: #ffffff (transparent over content). Height: ~56px. Logo left (Shortcut wordmark + icon mark in #494bcb). Nav links: Satoshi 500, 14px, Graphite (#222222) with #aaaab0 hover underline. Right side: primary filled CTA "Get started — it's free" + "Log In" text link in Ash (#333333). No drop shadow; uses 1px #aaaab0 bottom border.

### Dark Hero Section
**Role:** Full-bleed dark band with centered headline and product UI preview

Background: #08093f (Midnight Ink) or its gradient variant. Centered content stack: eyebrow badge → heading-lg in #ffffff → body text in Soft Violet (#8a8ac6) → two-button row (primary indigo + ghost white). Product UI card sits below with the single diffuse shadow, showing colored status badges (green/yellow/red) from the actual app.

### Status Pill (In-Product)
**Role:** Status indicators in the product UI preview — On Track / At Risk / Off Track

Satoshi 500, 13px. Pill shape (35.8px radius). Green variants for "On Track" / "Complete", yellow (#ffde87) for "At Risk", red/muted for "Off Track". These are product-internal, not marketing-page tokens, but appear in the hero product preview.

### Hand-Drawn Annotation
**Role:** Doodle-style callout pointing to product UI features

Yellow (#ffde87) text in Satoshi 500, 13px, with curved Soft Violet (#8a8ac6) arrow strokes. Radius on text: none. Decorative only — sells the product by showing real UI being annotated, not polished marketing renders.

### Footer
**Role:** Site footer with links and brand signoff

Background: #08093f (Midnight Ink). Text: #ffffff headings, Soft Violet (#8a8ac6) body. 4-5 column link grid. Logo mark in Vivid Indigo (#494bcb) repeated from nav.

### Dot Grid Background
**Role:** Decorative texture on the top white hero section

Repeating dot pattern in #f6f6fa on #ffffff canvas. Fills the hero as atmosphere — no information content, just a subtle signal that this is the "above the fold" surface.

## Do's and Don'ts

### Do
- Use #494bcb exclusively as the filled action color — it is the only chromatic button background in the system.
- Set every text style in Satoshi with -0.02em letter-spacing, including buttons and badges — the tight tracking is signature.
- Use 7.6px radius for buttons, badges, and images; reserve 15.2px for larger feature cards and 35.8px only for full pill shapes.
- Reach for the eyebrow badge pattern (small label → heading → body → two-button row) as the default section opener.
- Alternate between #ffffff and #f6f6fa for section backgrounds to create rhythm without shadows.
- Keep the dark Midnight Ink (#08093f) reserved for the footer and one or two feature sections — it should feel like a destination, not a default.
- Let Soft Violet (#8a8ac6) carry all decorative SVG strokes and muted body text on dark backgrounds — it ties back to the brand without competing with the primary indigo.

### Don't
- Do not introduce a second chromatic button color — the system is monochromatic-by-default with one action hue.
- Do not use drop shadows for card elevation — use 1px #686878 borders or surface color shifts instead.
- Do not apply the brand yellow (#ffde87) to functional UI like warnings or alerts — it is decorative only.
- Do not set body text in anything heavier than Satoshi 500 — 700 is reserved for display and headings.
- Do not use large border radii (>16px) on standard cards or buttons — only pill badges earn the 35.8px radius.
- Do not let letter-spacing drift to 0 or positive values — the -0.02em tracking is part of the visual identity.
- Do not use vivid #494bcb for body text or headings on light backgrounds — its job is action and brand focal points, not reading copy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas White | `#ffffff` | Primary page background, default surface |
| 2 | Frost Gray | `#f6f6fa` | Alternate section bands, subtle card lift |
| 3 | Pale Lilac | `#eaeaf7` | Ghost button fill, hover wash |
| 4 | Sunlit Yellow | `#ffde87` | Decorative badge surface, highlight wash |
| 5 | Midnight Ink | `#08093f` | Dark section canvas, footer background |

## Elevation

- **Product UI card:** `rgba(0, 0, 0, 0.04) 0px 20px 13px 0px`

## Imagery

Imagery is product-first, not lifestyle: the hero shows real app UI (a project tracking table with colored status pills) rather than stock photography. The product UI is annotated with hand-drawn yellow labels and violet arrows — a 'see what we mean' device, not a marketing render. Decorative dot grids and dotted halftone patterns provide atmosphere on white sections. No photography of people or environments appears; the brand is represented entirely through the product interface itself, UI mockups, and geometric SVG icons (outlined, 1.5px stroke weight, muted violet).

## Layout

Max-width 1200px centered container with generous outer margins. The page reads as alternating full-bleed bands: a white hero with dot grid texture, a midnight-navy section centered around a product UI preview, a frost-gray section with a 3-column feature card grid, then another dark section. Hero pattern is centered headline-over-background (no split image+text). Content stacks vertically with eyebrow badge → heading-lg → body → two-button row → product preview as the repeating section unit. Navigation is a single flat top bar with no mega-menu, no sidebar, no sticky behavior beyond standard scroll. The grid system is implicit — feature cards auto-arrange into 2- or 3-up layouts depending on card count, with consistent 19px padding and 15.2px radius.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #222222
- text (secondary): #686878
- background (canvas): #ffffff
- background (alternate): #f6f6fa
- border (hairline): #686878
- accent (brand): #494bcb
- primary action: #494bcb (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #494bcb background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


3. *Feature Card (Light Grid):* #ffffff background, 1px #686878 border, 15.2px radius, 19px padding. Icon at top: outlined SVG in #8a8ac6 stroke. Title: Satoshi 700, 19px, #222222. Description: Satoshi 500, 15px, #686878. Optional mini-UI preview at bottom with 7.6px radius on any embedded images.


5. *Eyebrow Badge:* Horizontal pill, #f6f6fa fill, Satoshi 500 13px, #222222 text, 4px 15px padding, 35.8px radius. Centered above section heading. On dark sections, swap to #eaeaf7 fill with #ffffff text.

## Color Rationing Philosophy

Shortcut treats color like currency: #494bcb is the only chromatic action color in the entire system, and it's spent deliberately on primary CTAs, the logo mark, and the darkest brand moments. The midnight navy (#08093f) is reserved for the footer and one or two destination sections. The sunlit yellow (#ffde87) appears only as decorative annotation — never as a functional warning. The result: when an indigo button or yellow callout does appear, it earns attention because everything around it is white, gray, or pale lavender. The system is built on restraint, not saturation.

## Radius & Shape Language

Three discrete radii create the entire shape system: 7.6px for buttons, badges, images, and small cards (the workhorse); 15.2px for larger feature cards that need more softness; 35.8px exclusively for full-pill shapes (section eyebrows, status pills). No element should use a radius outside this set — the discipline of only three values is what makes the system feel cohesive rather than arbitrary.

## Similar Brands

- **Linear** — Same compact geometric sans typography approach, single vivid chromatic accent (Linear's purple vs Shortcut's indigo) against a near-white canvas, minimal shadows, and tight letter-spacing on all text.
- **Notion** — Light, restrained product UI with hairline borders instead of shadows, small pill-shaped section eyebrows, and a calm monochromatic default that lets a single accent color carry the brand.
- **Height** — Project management tool with the same dark-and-light alternating section rhythm, vivid single-accent CTA buttons, and product-UI-as-marketing-asset hero approach.
- **Pitch** — Geometric sans throughout, tight tracking, flat white surfaces with minimal elevation, and a single saturated brand color used only for actions — same editorial restraint.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vivid-indigo: #494bcb;
  --color-midnight-ink: #08093f;
  --color-soft-violet: #8a8ac6;
  --color-pale-lavender: #9f7ad0;
  --color-sunlit-yellow: #ffde87;
  --color-pale-lilac: #eaeaf7;
  --color-pure-white: #ffffff;
  --color-frost-gray: #f6f6fa;
  --color-slate: #686878;
  --color-graphite: #222222;
  --color-ash: #333333;
  --color-stone: #6d737d;
  --color-fog: #aaaab0;

  /* Typography — Font Families */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.26px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.3px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.27;
  --tracking-heading-sm: -0.38px;
  --text-heading: 21px;
  --leading-heading: 1.27;
  --tracking-heading: -0.42px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.92px;
  --text-display: 61px;
  --leading-display: 1.1;
  --tracking-display: -1.22px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-76: 76px;
  --spacing-84: 84px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 73px;
  --card-padding: 19px;
  --element-gap: 4-8px;

  /* Border Radius */
  --radius-lg: 7.61927px;
  --radius-xl: 11.4289px;
  --radius-2xl: 15.2385px;
  --radius-3xl: 35.8106px;

  /* Named Radii */
  --radius-cards: 7.6px;
  --radius-pills: 35.8px;
  --radius-badges: 7.6px;
  --radius-images: 7.6px;
  --radius-buttons: 7.6px;
  --radius-largecards: 15.2px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 0px 20px 13px 0px;

  /* Surfaces */
  --surface-canvas-white: #ffffff;
  --surface-frost-gray: #f6f6fa;
  --surface-pale-lilac: #eaeaf7;
  --surface-sunlit-yellow: #ffde87;
  --surface-midnight-ink: #08093f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vivid-indigo: #494bcb;
  --color-midnight-ink: #08093f;
  --color-soft-violet: #8a8ac6;
  --color-pale-lavender: #9f7ad0;
  --color-sunlit-yellow: #ffde87;
  --color-pale-lilac: #eaeaf7;
  --color-pure-white: #ffffff;
  --color-frost-gray: #f6f6fa;
  --color-slate: #686878;
  --color-graphite: #222222;
  --color-ash: #333333;
  --color-stone: #6d737d;
  --color-fog: #aaaab0;

  /* Typography */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.26px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.3px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.27;
  --tracking-heading-sm: -0.38px;
  --text-heading: 21px;
  --leading-heading: 1.27;
  --tracking-heading: -0.42px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.92px;
  --text-display: 61px;
  --leading-display: 1.1;
  --tracking-display: -1.22px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-76: 76px;
  --spacing-84: 84px;

  /* Border Radius */
  --radius-lg: 7.61927px;
  --radius-xl: 11.4289px;
  --radius-2xl: 15.2385px;
  --radius-3xl: 35.8106px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 0px 20px 13px 0px;
}
```
