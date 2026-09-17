# Daylit — Style Reference
> Burgundy ink on cream parchment — a modern ledger rewritten for the AI era.

**Theme:** light

Daylit operates in a warm, candlelit fintech vernacular — a parchment-ivory canvas (#fbf9f6) replaces the cold white norm, and a single deep burgundy (#4d1520) does all the heavy lifting as text, borders, and the primary action fill. Pale lemon (#faffa7) acts as a secondary highlight accent that appears in decorative illustration blocks, testimonial card borders, and badge fills, keeping the palette to roughly two chromatic anchors. Type is large, confident, and tightly tracked — display sizes push to 76–85px with aggressive negative letter-spacing, giving headlines a sculptural, almost editorial quality. Components are flat and low-elevation: hairline warm borders, a 6px default radius, and a single brand-tinted shadow reserved for hero-scale elevation. The overall rhythm is spacious and unhurried, with generous section padding and a centered max-width reading column that feels like a well-typeset annual report rather than a dense SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Wine Ink | `#4d1520` | `--color-wine-ink` | Primary text, primary filled button background, active states, heading color, card borders, and dominant brand stroke — the single chromatic anchor of the entire system |
| Midnight Wine | `#360912` | `--color-midnight-wine` | Darkest surface for footer bands and inverted panels |
| Lemon Whisper | `#faffa7` | `--color-lemon-whisper` | Decorative accent fill and border — used in illustration blocks, testimonial card outlines, icon highlights, and soft highlight washes |
| Blush Rust | `#662f3d` | `--color-blush-rust` | Softened brand fill for secondary surfaces and SVG illustration shading |
| Citrine Pop | `#e6b800` | `--color-citrine-pop` | Rare saturated accent for micro-detail and decorative strokes |
| Mauve Ash | `#825b63` | `--color-mauve-ash` | Muted body text and subtle borders when full brand ink would be too loud |
| Parchment | `#fbf9f6` | `--color-parchment` | Primary page canvas — the warm ivory that replaces cold white throughout |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, input fields, elevated panels — the brightest neutral layer above the parchment canvas |
| Linen Beige | `#f2eee7` | `--color-linen-beige` | Hairline borders, dividers, ghost button outlines, and subtle UI separators |
| Sandstone | `#d3cac3` | `--color-sandstone` | Muted borders and secondary divider lines on cards and links |
| Driftwood | `#aaa49f` | `--color-driftwood` | Lowest-contrast neutral for decorative borders and inactive link text |
| Slate Smoke | `#717182` | `--color-slate-smoke` | Body secondary text, icon strokes, and helper copy — the only cool-leaning neutral |
| Charcoal Ink | `#101828` | `--color-charcoal-ink` | Occasional dark text and info-toned badge borders when Wine Ink would be too warm |
| Butter Cream | `#feffe1` | `--color-butter-cream` | Ultra-soft warm fill for highlight zones and subtle surface washes |
| Dawn Glow | `#e9e3d8` | `--color-dawn-glow` | Warm card background tint used sparingly for warm-on-warm contrast |
| Rose Whisper | `#d7a0a0` | `--color-rose-whisper` | Soft card border accent for warm-toned testimonial and content cards |
| Plum Echo | `#906c7b` | `--color-plum-echo` | Badge and pill background for muted tag variants |

## Tokens — Typography

### Tt Commons Pro Variable — Primary typeface across all contexts — headings, body, nav, buttons, cards. The variable weight axis (400–600) and extreme size range (9px micro-labels to 85px display) make it the sole workhorse. Display sizes use aggressive negative tracking (-0.04em at 76–85px) for a sculptural editorial feel; body sizes stay near normal tracking. The 600 weight carries emphasis without ever feeling bold-shouty. · `--font-tt-commons-pro-variable`
- **Substitute:** Switzer, General Sans, or Inter as close geometric-grotesque alternatives
- **Weights:** 400, 500, 600
- **Sizes:** 9, 10, 12, 14, 15, 16, 18, 20, 22, 32, 44, 56, 64, 68, 76, 85
- **Line height:** 1.20–2.39 (tight for display, generous for body)
- **Letter spacing:** -0.0400em, -0.0210em, -0.0200em, -0.0150em, -0.0120em, 0.0200em
- **Role:** Primary typeface across all contexts — headings, body, nav, buttons, cards. The variable weight axis (400–600) and extreme size range (9px micro-labels to 85px display) make it the sole workhorse. Display sizes use aggressive negative tracking (-0.04em at 76–85px) for a sculptural editorial feel; body sizes stay near normal tracking. The 600 weight carries emphasis without ever feeling bold-shouty.

### Geist Mono — Monospace accent for badge labels, inline code, and small caps-style tags like '+ AI AGENTS FOR ACCOUNTS RECEIVABLE'. Normal letter-spacing — not tracked like the primary face. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400, 500
- **Sizes:** 14, 18
- **Line height:** 1.33–1.75
- **Role:** Monospace accent for badge labels, inline code, and small caps-style tags like '+ AI AGENTS FOR ACCOUNTS RECEIVABLE'. Normal letter-spacing — not tracked like the primary face.

### Open Sans — Open Sans — detected in extracted data but not described by AI · `--font-open-sans`
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.2
- **Letter spacing:** -0.02
- **Role:** Open Sans — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.5 | -0.012px | `--text-body-sm` |
| body | 16px | 1.5 | -0.012px | `--text-body` |
| subheading | 22px | 1.33 | -0.015px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.02px | `--text-heading-sm` |
| heading | 44px | 1.15 | -0.021px | `--text-heading` |
| heading-lg | 56px | 1 | -0.021px | `--text-heading-lg` |
| display | 76px | 0.95 | -0.04px | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 76 | 76px | `--spacing-76` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 92 | 92px | `--spacing-92` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| badges | 1440px |
| inputs | 6px |
| buttons | 6px |
| navLinks | 6px |
| largeButtons | 24px |
| illustrationCards | 13px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(77, 21, 32, 0.16) 19px 32px 73px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Main call-to-action — used for 'Book a Demo' and all conversion actions

Background #4d1520, text white (#ffffff) or #faffa7 accent, 6px radius, padding 10px 20px or 12px 20px, font Tt Commons Pro 500 at 16px. Often paired with a small yellow grid/dot icon trailing the label. The contrast between the deep wine fill and the warm canvas makes these feel like ink stamps.

### Ghost / Text Button
**Role:** Secondary action — 'Meet our AI agents', 'Learn more' links

No background or border. Text in #4d1520 or #717182 at 16px weight 500, optionally with a right-arrow chevron. Sits inline with body copy, never competing with the primary.

### Navigation Link
**Role:** Top nav menu items — Product, Capital, Industries, Resources, About

Text #4d1520 at 14–15px weight 500, no background. Caret/chevron icons in matching color for dropdowns. Items separated by 24–32px horizontal gap.

### Announcement Banner
**Role:** Top-of-page news strip

Full-bleed #faffa7 background, text #4d1520 at 14px, centered, with a right-side close (×) button. Thin bottom border or no border — sits flush against the page.

### Hero Headline
**Role:** Section-defining display text — 'Get paid on time. Every time.'

Tt Commons Pro at 56–68px, weight 400, color #4d1520, letter-spacing -0.021em to -0.04em, line-height 1.0–1.05. The restrained 400 weight at enormous size is a signature choice — it whispers rather than shouts.

### Testimonial Card
**Role:** Customer quote card in the social proof section

Warm tinted background (#faffa7 lemon or #feffe1 cream variants), 1px border in matching warmer tone, 6–13px radius, padding 20–24px. Company name in #4d1520 at 14px weight 600, quote text in #4d1520 at 15–16px weight 400, author line with avatar circle at bottom.

### Logo Bar Card
**Role:** Trusted-by logo row in a single horizontal band

Parchment canvas, logos in grayscale or muted brand colors at 40–48px height, evenly spaced with 8–10px gaps. A small 'Trusted by' label in #717182 sits to the left.

### Pill Badge / Tag
**Role:** Category labels — '+ AI AGENTS FOR ACCOUNTS RECEIVABLE'

Background #faffa7 or #906c7b, text #4d1520 or white, 1440px radius (full pill), padding 4px 12px or 6px 14px, font Geist Mono 500 at 12–14px, uppercase. The mono font in pill form is the system's signature micro-component.

### Illustration Panel
**Role:** Hero visual and decorative graphic blocks

Large rounded rectangles (#13px radius) with #faffa7 or #feffe1 fill containing flat geometric illustrations of products (invoice printers, calculators). Sits in a 2-column hero with text on the left. The only place the system allows large color blocks.

### Card Surface
**Role:** Generic content card base

White (#ffffff) background, 1px border in #f2eee7, 6px radius, padding 24px. Optional brand-tinted shadow: rgba(77,21,32,0.16) 19px 32px 73px — a deep wine-tinted shadow used sparingly for hero-scale elevation only.

### Body Text Block
**Role:** Paragraph and helper copy

Tt Commons Pro 400 at 18px, color #4d1520 for primary body or #717182 for secondary, line-height 1.5–1.6, letter-spacing -0.012em. Comfortable reading width within the 1200px max column.

### Top Navigation Bar
**Role:** Sticky or static header with brand and primary nav

Parchment (#fbf9f6) background, full-width, 64–80px height. Logo left (wordmark + icon), nav links center-right, Login + Capital + Book a Demo right. Thin bottom border in #f2eee7 optional.

## Do's and Don'ts

### Do
- Use #4d1520 as the default text color and primary button fill — it is the system's single chromatic anchor and should appear in every screen
- Set page canvas to #fbf9f6 parchment, not pure white — the warm ivory is what makes the burgundy sing
- Use 6px radius for all cards, buttons, and inputs as the default; reserve 1440px for pill badges only
- Use Tt Commons Pro at weight 400 for display headings 44px and above — the whisper-weight at large size is a signature
- Apply the wine-tinted shadow rgba(77,21,32,0.16) 19px 32px 73px only on hero-scale elevated cards, never on small UI elements
- Use #faffa7 lemon as a decorative accent fill in illustration blocks and badge backgrounds — never as a text color on dark surfaces
- Center content within a 1200px max-width column with 24–40px horizontal padding for comfortable reading rhythm

### Don't
- Do not introduce cold grays (#e5e7eb, #f3f4f6, #6b7280) — the entire system is warm-toned and cool neutrals will clash
- Do not use 8px or 12px border-radius on cards or buttons — the 6px radius is part of the system's distinctive geometry
- Do not set body or heading text to weight 600 or 700 — the system maxes out at 600 for emphasis and prefers 400–500
- Do not use pure black (#000000) for text — use #4d1520 wine ink instead, even for body copy
- Do not add drop shadows to buttons, nav items, or small interactive elements — shadows are reserved for hero-scale elevation
- Do not use blue, green, or standard semantic colors for status — the system communicates state through opacity, position, and the single brand hue
- Do not center-align body paragraphs longer than two lines — left-align for readability; center only for headlines and short CTAs

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#fbf9f6` | Base page background — warm ivory that sets the entire system's temperature |
| 1 | Card White | `#ffffff` | Elevated card and content surfaces above the canvas |
| 2 | Butter Cream | `#feffe1` | Soft warm fill for highlight zones and muted content cards |
| 3 | Lemon Whisper | `#faffa7` | Decorative accent fill for illustration blocks and accent cards |
| 4 | Midnight Wine | `#360912` | Inverted dark surface for footer and occasional dark-band sections |

## Elevation

- **Hero illustration panel:** `rgba(77, 21, 32, 0.16) 19px 32px 73px 0px`

## Imagery

Illustration-only, no photography. Visuals are flat geometric compositions — invoice printers, calculators, and product diagrams rendered as simplified vector shapes in the brand palette (wine outlines on lemon or cream fills). Illustrations sit in large rounded-rectangle panels (#13px radius) with generous internal padding. The style is intentionally retro-tech: chunky devices, flat shading, no gradients on objects (gradients are reserved for the gradient blobs behind the headline). No people, no lifestyle photography, no product screenshots — the abstract illustrations carry the entire visual load and reinforce the system's 'modern ledger' identity.

## Agent Prompt Guide

**Quick Color Reference**
- text/headings: #4d1520
- background: #fbf9f6
- card surface: #ffffff
- border/hairline: #f2eee7
- accent fill: #faffa7
- primary action: #4d1520 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #4d1520 background, #fbf9f6 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Testimonial card*: White background, 1px border in #f2eee7, 6px radius, 24px padding. Company name in Tt Commons Pro 600 at 14px, #4d1520. Quote body in Tt Commons Pro 400 at 15px, #4d1520, line-height 1.6. Author line at bottom: 32px circular avatar + name in weight 500 at 14px, #4d1520 + role in #717182.

3. *Pill badge*: Background #faffa7, text #4d1520, 1440px radius, padding 4px 12px, Geist Mono 500 at 12px, uppercase. Optional left '+' icon in #4d1520.

4. *Navigation bar*: Full-width, #fbf9f6 background, 72px height. Left: wordmark logo in #4d1520. Center-right: 5 nav links in Tt Commons Pro 500 at 15px, #4d1520, 32px gap between items, each with a small 12px caret. Far right: 'Login' text link, 'Capital' text link, then filled 'Book a Demo' button with #4d1520 background, white text, 6px radius, 10px 18px padding, plus a small yellow 2×2 grid icon trailing the label.

5. *Logo bar*: Full-width section on #fbf9f6. Left label 'Trusted by' in Tt Commons Pro 400 at 14px, #717182. Right: 6–8 grayscale logos at 40px height, evenly spaced with 8px gaps, flexbox row, center-aligned vertically.

## Gradient System

Three gradients are used, all subtle and decorative:
1. Pink-to-white wash: linear-gradient(51.57deg, rgb(238,143,162) 20%, rgb(255,255,255) 77%) — used as a soft background glow behind hero headlines, creating a warm bloom effect.
2. Wine deepening: linear-gradient(49deg, rgb(77,21,32) 20%, rgb(179,49,74) 162%) — a brand-on-brand gradient for the footer or inverted CTA, adding richness without changing hue family.
3. Lemon-to-amber: linear-gradient(120deg, rgba(250,255,167,0), rgba(255,187,117,0.4)) — a transparent warm wash used as a decorative light-source overlay in illustration panels.
Gradients should never appear on text, buttons, or small UI elements — they are atmospheric and large-scale only.

## Similar Brands

- **Mercury** — Same warm-ivory canvas (#fbf9f6-adjacent) replacing cold white, with a single deep chromatic anchor color doing all text and button duty. Both use generous spacing and whisper-weight display headlines.
- **Ramp** — Similar flat, editorial fintech aesthetic with muted warm palette, low elevation, and large confident type. Both avoid the typical SaaS blue/gray template and use a distinctive brand color throughout.
- **Pillpack (now part of Amazon Pharmacy)** — Shared warm-illustration visual language — flat geometric product illustrations in rounded panels with soft accent-color backgrounds, no photography, brand-colored type doing structural work.
- **Brex** — Both use a single dominant brand hue against a warm off-white canvas, with pill-shaped badges, tight-tracked large headlines, and a flat low-elevation component system that feels editorial rather than dashboard-y.
- **Kalshi** — Same restricted two-color chromatic palette (one deep brand + one bright accent) on warm neutrals, with sculptural display type and illustration-driven hero sections instead of product screenshots.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-wine-ink: #4d1520;
  --color-midnight-wine: #360912;
  --color-lemon-whisper: #faffa7;
  --color-blush-rust: #662f3d;
  --color-citrine-pop: #e6b800;
  --color-mauve-ash: #825b63;
  --color-parchment: #fbf9f6;
  --color-pure-white: #ffffff;
  --color-linen-beige: #f2eee7;
  --color-sandstone: #d3cac3;
  --color-driftwood: #aaa49f;
  --color-slate-smoke: #717182;
  --color-charcoal-ink: #101828;
  --color-butter-cream: #feffe1;
  --color-dawn-glow: #e9e3d8;
  --color-rose-whisper: #d7a0a0;
  --color-plum-echo: #906c7b;

  /* Typography — Font Families */
  --font-tt-commons-pro-variable: 'Tt Commons Pro Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.012px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.012px;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.015px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.02px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -0.021px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.021px;
  --text-display: 76px;
  --leading-display: 0.95;
  --tracking-display: -0.04px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-92: 92px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 1.85px;
  --radius-md: 6px;
  --radius-lg: 9.276px;
  --radius-xl: 13px;
  --radius-3xl: 24px;
  --radius-full: 1440px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-badges: 1440px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-navlinks: 6px;
  --radius-largebuttons: 24px;
  --radius-illustrationcards: 13px;

  /* Shadows */
  --shadow-xl: rgba(77, 21, 32, 0.16) 19px 32px 73px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #fbf9f6;
  --surface-card-white: #ffffff;
  --surface-butter-cream: #feffe1;
  --surface-lemon-whisper: #faffa7;
  --surface-midnight-wine: #360912;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-wine-ink: #4d1520;
  --color-midnight-wine: #360912;
  --color-lemon-whisper: #faffa7;
  --color-blush-rust: #662f3d;
  --color-citrine-pop: #e6b800;
  --color-mauve-ash: #825b63;
  --color-parchment: #fbf9f6;
  --color-pure-white: #ffffff;
  --color-linen-beige: #f2eee7;
  --color-sandstone: #d3cac3;
  --color-driftwood: #aaa49f;
  --color-slate-smoke: #717182;
  --color-charcoal-ink: #101828;
  --color-butter-cream: #feffe1;
  --color-dawn-glow: #e9e3d8;
  --color-rose-whisper: #d7a0a0;
  --color-plum-echo: #906c7b;

  /* Typography */
  --font-tt-commons-pro-variable: 'Tt Commons Pro Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.012px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.012px;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.015px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.02px;
  --text-heading: 44px;
  --leading-heading: 1.15;
  --tracking-heading: -0.021px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.021px;
  --text-display: 76px;
  --leading-display: 0.95;
  --tracking-display: -0.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-92: 92px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 1.85px;
  --radius-md: 6px;
  --radius-lg: 9.276px;
  --radius-xl: 13px;
  --radius-3xl: 24px;
  --radius-full: 1440px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-xl: rgba(77, 21, 32, 0.16) 19px 32px 73px 0px;
}
```
