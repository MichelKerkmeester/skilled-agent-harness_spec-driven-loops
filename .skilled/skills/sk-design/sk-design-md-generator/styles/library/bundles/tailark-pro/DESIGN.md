# Tailark Pro — Style Reference
> white gallery wall with violet sparks — a curated component museum

**Theme:** light

Tailark Pro is a gallery-grade component library interface: near-pure white canvas, hairline-bordered cards, and compact system-sans typography that recedes to let illustrated UI snippets breathe. A single vivid violet (#615fff) anchors the brand across icons, links, and the logo mark, while illustration previews introduce controlled chromatic punctuation — greens, oranges, yellows, reds — as colored tags, icons, and accent fills within the mockups. Surfaces are distinguished by 1px oklab-tinted borders and very soft 3–4 step shadows rather than heavy elevation, producing a flat, architecturally precise rhythm. Components are lightweight, monoline, and unembellished — the aesthetic echoes shadcn/ui and Geist-era Tailwind documentation, treating the white page as a museum wall for the components themselves.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Violet | `#615fff` | `--color-signal-violet` | Logo mark, link text, icon accents, brand-colored borders and fills — the single chromatic anchor that signals the brand across an otherwise achromatic interface |
| Ink | `#09090b` | `--color-ink` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper | `#ffffff` | `--color-paper` | Page background, card surface, button surface — the dominant canvas |
| Hairline | `#e4e4e7` | `--color-hairline` | Dividers, card borders, input borders, subtle structural separation |
| Graphite | `#52525c` | `--color-graphite` | Secondary body text, descriptions, muted labels, caption text |
| Slate | `#848485` | `--color-slate` | Tertiary text, meta labels, inactive nav items, placeholder content |
| Charcoal | `#404040` | `--color-charcoal` | Dark surface for filled buttons and emphasis panels |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills, deepest contrast for illustration artwork |
| Mint | `#00bc7d` | `--color-mint` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Forest | `#0d542b` | `--color-forest` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Amber | `#fe9a00` | `--color-amber` | Yellow supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Sunburst | `#ffb900` | `--color-sunburst` | Yellow supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Rust | `#e17100` | `--color-rust` | Orange supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Crimson | `#ec003f` | `--color-crimson` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Maroon | `#82181a` | `--color-maroon` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Ultraviolet | `#8200db` | `--color-ultraviolet` | Illustration accent violet, tag variant |
| Iris | `#9810fa` | `--color-iris` | Illustration accent purple, tag variant |
| Cobalt | `#155dfc` | `--color-cobalt` | Illustration accent blue, tag variant |
| Midnight | `#1c398e` | `--color-midnight` | Illustration accent indigo, tag variant |
| Lilac Mist | `#dfdfff` | `--color-lilac-mist` | Soft violet surface wash, subtle card highlight |

## Tokens — Typography

### ui-sans-serif (system: Inter / Geist Sans / SF Pro) — All UI text — body at 14px/1.43, labels and tags at 12px/1.33, navigation at 13–14px, subheadings at 16–18px, and display headings at 30px. The 30px display step is notably restrained — this system does not shout at scale; it informs through compact hierarchy · `--font-ui-sans-serif-system-inter-geist-sans-sf-pro`
- **Substitute:** Inter, Geist Sans, system-ui
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 11px, 12px, 13px, 14px, 16px, 18px, 20px, 30px
- **Line height:** 1.20–1.71
- **Letter spacing:** normal throughout
- **Role:** All UI text — body at 14px/1.43, labels and tags at 12px/1.33, navigation at 13–14px, subheadings at 16–18px, and display headings at 30px. The 30px display step is notably restrained — this system does not shout at scale; it informs through compact hierarchy

### Geist Mono — Numeric data displays (invoice amounts, invoice numbers, code labels, metrics) — the monospace brings technical precision to data-heavy illustration cards. 10–12px for inline code/metric tags, 24–30px for prominent figures · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, ui-monospace
- **Weights:** 100, 400, 600
- **Sizes:** 10px, 12px, 24px, 30px
- **Line height:** 1.20–1.50
- **Role:** Numeric data displays (invoice amounts, invoice numbers, code labels, metrics) — the monospace brings technical precision to data-heavy illustration cards. 10–12px for inline code/metric tags, 24–30px for prominent figures

### Mulish — Mulish — detected in extracted data but not described by AI · `--font-mulish`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Role:** Mulish — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| heading-sm | 18px | 1.56 | — | `--text-heading-sm` |
| heading | 20px | 1.63 | — | `--text-heading` |
| display | 30px | 1.2 | — | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 84 | 84px | `--spacing-84` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 12px |
| inputs | 6px |
| buttons | 6px |
| featureCards | 32px |
| galleryCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `oklab(0.141 0.00136173 -0.00480696 / 0.075) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| subtle-3 | `oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065...` | `--shadow-subtle-3` |
| subtle-4 | `oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065...` | `--shadow-subtle-4` |
| subtle-5 | `oklab(0 0 0 / 0.075) 0px 0px 0px 1px` | `--shadow-subtle-5` |
| subtle-6 | `oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065...` | `--shadow-subtle-6` |
| subtle-7 | `oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 1px 3px 0p...` | `--shadow-subtle-7` |
| subtle-8 | `oklab(0 0 0 / 0.075) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) ...` | `--shadow-subtle-8` |
| subtle-9 | `oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065...` | `--shadow-subtle-9` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |
| subtle-10 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-10` |
| subtle-11 | `oklab(0.141 0.00136173 -0.00480696 / 0.1) 0px 0px 0px 1px...` | `--shadow-subtle-11` |
| subtle-12 | `rgb(0, 0, 0) 0px 0px 0px 1px, oklab(0 0 0 / 0.2) 0px 20px...` | `--shadow-subtle-12` |
| subtle-13 | `oklab(0.999994 0.0000455678 0.0000200868 / 0.05) 0px 0px ...` | `--shadow-subtle-13` |
| sm-2 | `oklab(0 0 0 / 0.065) 0px 4px 6px -1px, oklab(0 0 0 / 0.06...` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Global site header

Fixed white bar with 1px Hairline (#e4e4e7) bottom border. Left: violet logo mark + 'Tailark Pro' wordmark. Center-right: search icon, theme toggle, nav links (Illustrations, Blocks, Pages, Pricing, Docs) at 13–14px weight 500 in Graphite (#52525c), active link in Ink. Right: 'Login' text link + 'Get Tailark Pro' filled black CTA at 6px radius, 12px padding vertical, 16px horizontal, white text weight 500.

### Page Header
**Role:** Section title block

Centered single-line title at 30px weight 600 in Ink, with a large muted count number ('123') at 30px weight 300 in Slate (#848485) appended inline. Generous vertical padding (~48–64px) above and below.

### Illustration Gallery Card
**Role:** Showcase tile for a component illustration

White card, 12px radius, 1px Hairline border + soft 4px shadow. No explicit padding — the illustration mockup fills the card edge-to-edge with internal whitespace. The illustration mockup is a white mini-canvas (~160–200px square) with its own internal layout, topped or bottomed by a colored tag.

### Color Tag Badge
**Role:** Label overlay on illustration cards

Small pill or rectangle at 6px radius, positioned at bottom-right or bottom-left of the illustration card. Variants include: Mint (#00bc7d) solid fill white text, Amber (#fe9a00) solid fill white text, Crimson (#ec003f) solid fill white text, Sunburst (#ffb900) solid fill Ink text, Ultraviolet (#8200db) solid fill white text, and a '123' count tag in a light gray. ~6px vertical, 8–10px horizontal padding, 11–12px text weight 500.

### Filled Dark CTA Button
**Role:** Primary action button (Get Tailark Pro)

Ink (#09090b) background, white text, 6px radius, 12px vertical × 16px horizontal padding, 13–14px weight 500. No visible border — relies on contrast alone. Inner 1px oklab-tinted inset shadow at 5% opacity adds subtle definition.

### Ghost Text Button
**Role:** Secondary navigation action (Login)

Transparent background, Graphite (#52525c) text, no border, 13–14px weight 500. Sits inline beside the filled CTA without competing.

### Outline Tag / Pill
**Role:** Selectable filter or label tag

White background, 1px Hairline border, 6px radius, 12px text weight 500 in Ink. Used for category filters or metadata pills.

### Search Input
**Role:** Command/search field in nav

Transparent or subtle background, 6px radius, 13–14px text. Magnifying glass icon left-aligned. Borderless or with 1px Hairline at 5% opacity inset shadow.

### Illustration Mini-Mockup — Invoice Card
**Role:** Component preview artwork (finance domain)

White inner card, 12px radius, soft shadow, containing invoice number at 10–12px Geist Mono weight 400, large amount in 30px Geist Mono weight 600 in Ink, and form fields (To, From, Address) with Hairline underlines. Demonstrates a data-heavy finance component.

### Illustration Mini-Mockup — Invoice Tag Trio
**Role:** Component preview artwork (currency tags)

Three overlapping currency tags (BTC, USD, EURO) fanned at slight rotation. Each tag is white with 12px radius, 1px Hairline border, 2–4px gap between tags, with monospace text in Mint/Forest or Cobalt.

### Illustration Mini-Mockup — Loyalty Program Card
**Role:** Component preview artwork (promotional)

White card with 'Loyalty program' text, two 'Start Date' mini-cards side by side each with a colored top accent bar (Cobalt, Ultraviolet), 8px radius, 12px padding.

### Illustration Mini-Mockup — Chat Notification
**Role:** Component preview artwork (social/notification)

White card with avatar circle, name in 14px weight 600 Ink, message body at 12–13px weight 400 Graphite. Mint dot indicator for unread. 12px radius card, 16px padding.

### Illustration Mini-Mockup — Spending Limit Banner
**Role:** Component preview artwork (alert/warning)

White card with 'Spending Limit' title weight 600, supporting text at 12–13px Graphite, and a progress bar in Cobalt at ~40% fill on a Hairline track. 16px radius.

### Stat Row
**Role:** Metadata display row

Inline label-value pair: label at 12px Graphite weight 400, value at 12–13px Ink weight 600, separated by ~8px gap. Used in footer/status contexts.

## Do's and Don'ts

### Do
- Use 6px radius for all buttons, inputs, and tags — the small radius is the system's structural signature
- Pair #615fff Violet with white for the logo mark, link text, and active nav states — let it be the only chromatic element on chrome
- Use Geist Mono at 30px weight 600 for any prominent numeric figure in illustrations — this is the hero data treatment
- Build cards with a 1px Hairline (#e4e4e7) border plus the 3-step shadow stack (border + 4px/2px soft drop) — borders carry the weight, shadows whisper
- Keep the page canvas #ffffff; let illustration mockups introduce color internally rather than using colored section backgrounds
- Use the chromatic tag palette (Mint, Amber, Crimson, Sunburst, Ultraviolet, Iris) as small 24–32px badge overlays on cards — never as full-width elements
- Set page max-width to 1280px and maintain 4-column to 2-column gallery grids with 8–12px gaps between cards

### Don't
- Do not use colored section backgrounds — the canvas must stay white; color lives inside component cards only
- Do not use heavy drop shadows or glow effects — elevation is a 3-step whisper, not a 10–20px drop
- Do not exceed 30px for headings — this system communicates through compact hierarchy, not scale
- Do not use large radii (32px+) on buttons, inputs, or tags — reserve them for feature-level cards only
- Do not introduce more than one chromatic accent on any single chrome element — the violet is solo, tags are solo
- Do not use #ec003f Crimson, #fe9a00 Amber, or #ffb900 Sunburst for body text or large fills — they are tag/badge-only
- Do not center-align body copy or long descriptions — use left-align with max-width to preserve the gallery rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Dominant page background |
| 1 | Card Surface | `#ffffff` | Component illustration cards on the gallery — same white as canvas, distinguished only by hairline border and shadow |
| 2 | Soft Wash | `#fef3c6` | Subtle colored backgrounds within illustration mockups |
| 3 | Mint Wash | `#b1eede` | Illustration highlight surface |
| 4 | Charcoal Button | `#09090b` | Filled CTA button surface — only dark surface in the system |

## Elevation

- **Buttons:** `oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 0px 0px 1px`
- **Cards (resting):** `oklab(0 0 0 / 0.075) 0px 0px 0px 1px`
- **Cards (elevated):** `oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 4px 6px -1px, oklab(0 0 0 / 0.065) 0px 2px 4px -2px`
- **Cards (hover/lifted):** `oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 10px 15px -3px, oklab(0 0 0 / 0.065) 0px 4px 6px -4px`

## Imagery

The site is a gallery of illustrated UI component mockups — the imagery IS the product. Each card contains a miniature, self-contained UI scene: invoice cards, currency tags, loyalty program cards, chat notifications, spending limit banners. Mockups are rendered in flat 2D with soft shadows, monoline structure, and restrained color washes (soft yellows, mints, lavenders as background fills within mockups). Icons are outlined or filled in Ink at 16–20px. There is no photography, no 3D, no human imagery — the visual language is pure product UI rendered at miniature scale, presented like specimens in a museum case.

## Layout

Full-bleed white page with a centered 1280px max-width content area. Top navigation is a fixed white bar with logo left, nav links center-right, CTA far right. The page header is a single centered line ('Tailark Pro Illustrations' + muted count) with generous vertical breathing room above and below. The gallery is a responsive grid: 4 columns on wide screens, collapsing to 2–3 columns on narrower viewports, with 8–12px gaps and tall card aspect ratios. Cards are uniform in size creating a strict modular rhythm. No alternating section bands, no hero image, no testimonials — the layout is gallery-grid purity, letting the component mockups be the only visual content. The page reads as a museum wall: white, flat, precise, with the objects (illustration cards) arranged in perfect columns.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #09090b
- text (secondary): #52525c
- text (tertiary/muted): #848485
- background: #ffffff
- border (hairline): #e4e4e7
- accent (brand): #615fff
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Illustration Gallery Card**: 12px radius, 1px #e4e4e7 border, soft 3-step shadow stack (border + 4px/-1px + 2px/-2px at 6.5% black). White background. 160–200px square inner canvas. No padding — the inner UI mockup fills the card. A colored tag (e.g. Mint #00bc7d fill, white text, 6px radius, 6px/10px padding) sits at bottom-right.

2. **Filled Dark Button**: #09090b background, white text, 6px radius, 12px vertical × 16px horizontal padding, 13px weight 500. No visible border — 1px oklab inset shadow at 5% opacity for subtle definition.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Page Header**: centered single line, 30px weight 600 #09090b with a large muted count number appended inline at 30px weight 300 #848485. 48–64px vertical padding above and below.

5. **Stat Row**: label at 12px #52525c weight 400, value at 13px #09090b weight 600, separated by 8px gap. Used in footer/status metadata contexts.


## Similar Brands

- **shadcn/ui** — Same ultra-clean white canvas, 1px hairline borders, near-black filled CTAs, and system-sans typography — the documentation site aesthetic applied to a component gallery
- **Vercel Geist** — Shared Geist Mono for numeric data, minimal radius (6px), and the same white-on-black CTA pattern with hairline separators in navigation
- **Untitled UI** — Both present component illustrations in a strict grid gallery with 12–16px card radii, hairline borders, and compact system-sans labels
- **Magic UI** — Component-library marketplace layout with centered page titles, 4-column gallery grids, and colored tag overlays on white illustration cards
- **Aceternity UI** — Same museum-wall approach to showcasing UI components — white canvas, generous vertical rhythm, illustration mockups as the sole visual content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-violet: #615fff;
  --color-ink: #09090b;
  --color-paper: #ffffff;
  --color-hairline: #e4e4e7;
  --color-graphite: #52525c;
  --color-slate: #848485;
  --color-charcoal: #404040;
  --color-pure-black: #000000;
  --color-mint: #00bc7d;
  --color-forest: #0d542b;
  --color-amber: #fe9a00;
  --color-sunburst: #ffb900;
  --color-rust: #e17100;
  --color-crimson: #ec003f;
  --color-maroon: #82181a;
  --color-ultraviolet: #8200db;
  --color-iris: #9810fa;
  --color-cobalt: #155dfc;
  --color-midnight: #1c398e;
  --color-lilac-mist: #dfdfff;

  /* Typography — Font Families */
  --font-ui-sans-serif-system-inter-geist-sans-sf-pro: 'ui-sans-serif (system: Inter / Geist Sans / SF Pro)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-mulish: 'Mulish', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.56;
  --text-heading: 20px;
  --leading-heading: 1.63;
  --text-display: 30px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-thin: 100;
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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;

  /* Named Radii */
  --radius-tags: 6px;
  --radius-cards: 12px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-featurecards: 32px;
  --radius-gallerycards: 16px;

  /* Shadows */
  --shadow-subtle: oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 0px 0px 1px;
  --shadow-subtle-2: oklab(0.141 0.00136173 -0.00480696 / 0.075) 0px 0px 0px 1px;
  --shadow-subtle-3: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 4px 6px -1px, oklab(0 0 0 / 0.065) 0px 2px 4px -2px;
  --shadow-subtle-4: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 1px 3px 0px, oklab(0 0 0 / 0.065) 0px 1px 2px -1px;
  --shadow-subtle-5: oklab(0 0 0 / 0.075) 0px 0px 0px 1px;
  --shadow-subtle-6: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 10px 15px -3px, oklab(0 0 0 / 0.065) 0px 4px 6px -4px;
  --shadow-subtle-7: oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 1px 3px 0px, oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 1px 2px -1px;
  --shadow-subtle-8: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-9: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 20px 25px -5px, oklab(0 0 0 / 0.065) 0px 8px 10px -6px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle-10: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-11: oklab(0.141 0.00136173 -0.00480696 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-12: rgb(0, 0, 0) 0px 0px 0px 1px, oklab(0 0 0 / 0.2) 0px 20px 25px -5px, oklab(0 0 0 / 0.2) 0px 8px 10px -6px;
  --shadow-subtle-13: oklab(0.999994 0.0000455678 0.0000200868 / 0.05) 0px 0px 0px 1px;
  --shadow-sm-2: oklab(0 0 0 / 0.065) 0px 4px 6px -1px, oklab(0 0 0 / 0.065) 0px 2px 4px -2px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-soft-wash: #fef3c6;
  --surface-mint-wash: #b1eede;
  --surface-charcoal-button: #09090b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-violet: #615fff;
  --color-ink: #09090b;
  --color-paper: #ffffff;
  --color-hairline: #e4e4e7;
  --color-graphite: #52525c;
  --color-slate: #848485;
  --color-charcoal: #404040;
  --color-pure-black: #000000;
  --color-mint: #00bc7d;
  --color-forest: #0d542b;
  --color-amber: #fe9a00;
  --color-sunburst: #ffb900;
  --color-rust: #e17100;
  --color-crimson: #ec003f;
  --color-maroon: #82181a;
  --color-ultraviolet: #8200db;
  --color-iris: #9810fa;
  --color-cobalt: #155dfc;
  --color-midnight: #1c398e;
  --color-lilac-mist: #dfdfff;

  /* Typography */
  --font-ui-sans-serif-system-inter-geist-sans-sf-pro: 'ui-sans-serif (system: Inter / Geist Sans / SF Pro)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-mulish: 'Mulish', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.56;
  --text-heading: 20px;
  --leading-heading: 1.63;
  --text-display: 30px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-84: 84px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;

  /* Shadows */
  --shadow-subtle: oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 0px 0px 1px;
  --shadow-subtle-2: oklab(0.141 0.00136173 -0.00480696 / 0.075) 0px 0px 0px 1px;
  --shadow-subtle-3: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 4px 6px -1px, oklab(0 0 0 / 0.065) 0px 2px 4px -2px;
  --shadow-subtle-4: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 1px 3px 0px, oklab(0 0 0 / 0.065) 0px 1px 2px -1px;
  --shadow-subtle-5: oklab(0 0 0 / 0.075) 0px 0px 0px 1px;
  --shadow-subtle-6: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 10px 15px -3px, oklab(0 0 0 / 0.065) 0px 4px 6px -4px;
  --shadow-subtle-7: oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 1px 3px 0px, oklab(0.141 0.00136173 -0.00480696 / 0.05) 0px 1px 2px -1px;
  --shadow-subtle-8: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-9: oklab(0 0 0 / 0.075) 0px 0px 0px 1px, oklab(0 0 0 / 0.065) 0px 20px 25px -5px, oklab(0 0 0 / 0.065) 0px 8px 10px -6px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle-10: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-11: oklab(0.141 0.00136173 -0.00480696 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-12: rgb(0, 0, 0) 0px 0px 0px 1px, oklab(0 0 0 / 0.2) 0px 20px 25px -5px, oklab(0 0 0 / 0.2) 0px 8px 10px -6px;
  --shadow-subtle-13: oklab(0.999994 0.0000455678 0.0000200868 / 0.05) 0px 0px 0px 1px;
  --shadow-sm-2: oklab(0 0 0 / 0.065) 0px 4px 6px -1px, oklab(0 0 0 / 0.065) 0px 2px 4px -2px;
}
```
