# Abel — Style Reference
> Cream paper, black ink, breathing room — an editorial lookbook that smells of perfume.

**Theme:** light

Abel operates as an editorial fragrance house: one warm cream note against a near-total monochrome canvas, with photography doing the chromatic work. The interface is deliberately quiet — near-black ink on white paper, whisper-light sans-serif headlines (weight 300), and a monospaced voice for all functional microcopy that gives every label, button, and link the cadence of a typeset colophon. Spacing is generous and sectional, letting full-bleed photographic plates alternate with white product cards; the result reads like a printed lookbook rather than a retail UI. The single non-neutral (#f6eada, a warm parchment cream) appears as a subtle surface tint and accent border — never as fill or decoration — so the visual system stays austere while the imagery carries all the color temperature.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#030303` | `--color-ink-black` | Primary text, hairlines, ghost button borders, product card outlines, icon strokes — the dominant structural color; sets all copy and dividers against white and cream surfaces |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, product card backgrounds, inverse text on black buttons and dark imagery |
| Parchment Cream | `#f6eada` | `--color-parchment-cream` | Warm accent surface, hairline borders, subtle highlight washes — the only chromatic note in the system; appears sparingly as tint, never as bold fill, to echo natural ingredient warmth without competing with photography |
| Ash Gray | `#cccccc` | `--color-ash-gray` | Disabled/placeholder surfaces, secondary background panels behind product imagery |
| Stone Gray | `#dad9d5` | `--color-stone-gray` | Soft secondary surface, muted card backgrounds for non-primary content blocks |
| Pencil Gray | `#807e81` | `--color-pencil-gray` | Medium-contrast borders, control outlines, and structural separators. Do not promote it to the primary CTA color |

## Tokens — Typography

### Founders Grotesk — Primary display and body family. Weight 300 carries all headlines and large editorial copy — the ultra-light cut is the signature voice: most fragrance sites use 600–700, this whisper-weight gives headlines a typeset, almost printed feel. Weight 500 handles body text, descriptions, and navigation labels where more presence is needed. Letter-spacing opens slightly (+0.01 to +0.02em) at display sizes for an airy editorial cadence. · `--font-founders-grotesk`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 300, 500
- **Sizes:** 13px, 15px, 16px, 18px, 20px, 32px
- **Line height:** 1.20–1.45
- **Letter spacing:** 0.0100em–0.0200em (positive tracking at larger sizes)
- **Role:** Primary display and body family. Weight 300 carries all headlines and large editorial copy — the ultra-light cut is the signature voice: most fragrance sites use 600–700, this whisper-weight gives headlines a typeset, almost printed feel. Weight 500 handles body text, descriptions, and navigation labels where more presence is needed. Letter-spacing opens slightly (+0.01 to +0.02em) at display sizes for an airy editorial cadence.

### Founders Grotesk Mono — Functional monospaced voice for every UI element: buttons, nav labels, announcement bar copy, tags, section titles, input fields, and link text. Always set uppercase with positive tracking (+0.03em) — this monospaced uppercase is what makes the interface read as a typeset label system rather than a typical web UI. At 28px it becomes a section heading style with tight line-height (0.92), creating a distinctive compressed mono display. · `--font-founders-grotesk-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Geist Mono
- **Weights:** 400
- **Sizes:** 12px, 13px, 14px, 16px, 28px
- **Line height:** 0.92–1.15
- **Letter spacing:** 0.0300em (uppercase functional text); -0.0200em (display 28px)
- **Role:** Functional monospaced voice for every UI element: buttons, nav labels, announcement bar copy, tags, section titles, input fields, and link text. Always set uppercase with positive tracking (+0.03em) — this monospaced uppercase is what makes the interface read as a typeset label system rather than a typical web UI. At 28px it becomes a section heading style with tight line-height (0.92), creating a distinctive compressed mono display.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.15 | 0.36px | `--text-caption` |
| body | 15px | 1.45 | 0.15px | `--text-body` |
| body-lg | 18px | 1.35 | — | `--text-body-lg` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| display | 28px | 0.92 | -0.56px | `--text-display` |
| heading | 32px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 72px
- **Card padding:** 40px
- **Element gap:** 12px

## Components

### Announcement Bar
**Role:** Top utility strip — new product launches, shipping notices, editorial callouts.

Full-width white bar, 38–40px vertical padding. Center-aligned copy in Founders Grotesk Mono 12px, weight 400, uppercase, letter-spacing 0.03em, #030303. Close (×) icon right-aligned. No background fill — sits flush against white canvas with no border.

### Site Header with Wordmark
**Role:** Primary navigation and brand identity on every page.

Transparent over imagery, white on solid sections. Wordmark 'Abel' centered in Founders Grotesk 500, 32px, #030303, letter-spacing 0.01em. Left: MENU in Mono 12px uppercase with hamburger icon, 12px gap. Right: search icon + CART label, Mono 12px uppercase, 20px gap between items. All elements vertically centered with 20px vertical padding.

### Hero Full-Bleed Plate
**Role:** Opening editorial spread — sets mood through photography with overlaid copy.

Edge-to-edge photography filling the viewport, no border, no radius. Caption block anchored bottom-left with 40px left padding: section title in Mono 13–14px uppercase (e.g. 'INTRODUCING, MIAMI SPLIT'), supporting body in Founders Grotesk 300 at 15–16px, and a underlined Mono ghost link 12px. Text color is #ffffff on dark imagery, #030303 on light imagery.

### Ghost Text Link
**Role:** Tertiary navigation, editorial cross-references, product page secondary actions.

Inline link in Founders Grotesk Mono 12–13px, weight 400, uppercase, letter-spacing 0.03em, #030303. 1px underline (text-decoration or bottom border) in same color. No background, no border, no padding — pure typographic link. 12px gap to surrounding elements.

### Solid CTA Button
**Role:** Primary commerce action — add to cart, shop product, checkout.

Solid #030303 fill, #ffffff text. Founders Grotesk Mono 12–13px, weight 400, uppercase, letter-spacing 0.03em. 10px vertical padding × 40px horizontal padding. Zero border-radius. No hover state changes fill — invert to #ffffff with #030303 text and 1px border. Width auto, left-aligned within its container.

### Product Detail Card
**Role:** Centered product showcase on PDP — bottle, notes, and purchase entry.

White #ffffff canvas. Product name 'MIAMI SPLIT' in Founders Grotesk 500, 20px, #030303, letter-spacing 0.02em, centered. Category line 'EAU DE PARFUM' in Mono 12px uppercase above it. Centered product image (transparent PNG, no background, no shadow). Below: scent note descriptor in Founders Grotesk 300, 15–16px, centered. CTA button beneath with 32px gap. No card border, no shadow — the product floats on white.

### Editorial Caption Block
**Role:** Body copy accompanying hero and section imagery.

Left-aligned, max-width ~360px. Section eyebrow in Mono 13px uppercase, 11–12px below it body copy in Founders Grotesk 300 at 15–16px, line-height 1.45. #030303 on light backgrounds, #ffffff on dark imagery.

### Footer
**Role:** Site map, legal, newsletter — quiet utility closing the page.

White or Stone Gray #dad9d5 background. 38px top/bottom padding. Mono 12px uppercase labels for column headers. Mono 12px for links. No heavy dividers — grouping is done through generous whitespace and column gap of 40px.

### Navigation Drawer Trigger
**Role:** Hamburger menu and cart flyout entry points.

Icon + label pair in Mono 12px uppercase, 12px gap between icon and text. #030303. No background, no border. Tapping reveals full-screen overlay menu on white with large Mono link stack.

### Section Label
**Role:** Small uppercase title introducing each content block.

Founders Grotesk Mono 13–14px, weight 400, uppercase, letter-spacing 0.03em, #030303. Leading uppercase, 20px top margin from preceding section.

### Text Input
**Role:** Newsletter signup, search field, contact forms.

Transparent background, 1px bottom border in #030303, no side borders, no radius. Placeholder and input text in Founders Grotesk 300 or Mono 12–14px, #030303. 10–12px vertical padding. No focus ring — the persistent bottom border is the only affordance.

## Do's and Don'ts

### Do
- Set every headline in Founders Grotesk weight 300 — the whisper-light cut is the brand's editorial signature, never use bold or semibold for display copy.
- Use Founders Grotesk Mono 12–14px uppercase with +0.03em letter-spacing for all buttons, links, navigation, and section labels — the monospaced voice is what makes the UI read as a typeset colophon.
- Let the system run on #030303 ink and #ffffff paper; introduce #f6eada Parchment Cream only as a subtle surface tint or hairline accent, never as a bold fill block.
- Give every section 72px of vertical breathing room; the spacious density is non-negotiable for the editorial register.
- Keep all corners sharp — zero border-radius on buttons, cards, images, and inputs preserves the printed/editorial feel.
- Alternate full-bleed photographic plates with white product surfaces to create the lookbook rhythm.
- Use the 28px compressed Mono display (line-height 0.92, letter-spacing -0.02em) for section-level mono headings, not a separate large sans-serif.

### Don't
- Don't use elevation, drop shadows, or any depth effect — the system is intentionally flat; a shadow would break the printed-paper illusion.
- Don't introduce saturated chromatic colors into the UI palette — all color temperature comes from photography, not from interface fills.
- Don't use Founders Grotesk weight 700 or 800 for headlines — the entire brand voice is built on weight 300 restraint.
- Don't set Mono text in sentence case; all functional monospaced copy is uppercase.
- Don't use icons larger than 16px in navigation or 20px in utility contexts — the system is text-led, icons are supporting marks only.
- Don't fill buttons with color — buttons are either solid #030303 (primary) or ghost underlined Mono text (secondary); there is no colored button state.
- Don't add borders or backgrounds to product imagery — perfume bottles and lifestyle photos float directly on the canvas with no framing.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base page canvas — product detail pages, editorial sections, and the dominant surface for all non-hero content. |
| 1 | Stone Gray | `#dad9d5` | Recessed background panels for product carousels and grouping blocks. |
| 2 | Parchment Cream | `#f6eada` | Warm accent surface — the only chromatic elevation tier, used for featured panels and hairline borders. |

## Imagery

Full-bleed editorial photography is the entire visual engine of the site. Lifestyle plates show models in saturated, almost ironic wardrobe (pale yellow puffer jacket, bananas clutched as still-life) — the styling is high-fashion, slightly surreal, and occupies the full viewport with no cropping or framing. Product photography shifts between dark moody macro shots (deep olive/green, shallow depth of field, bottle emerging from darkness) and clean white-bg product isolation on PDPs. There is no illustration, no 3D rendering, no icon system beyond minimal line marks. Image treatment is always photographic, never filtered or duotoned — color comes from the captured scene, not from post-processing. The ratio of image to text is roughly 70/30, with imagery functioning as atmosphere rather than product showcase in hero sections.

## Layout

Full-bleed editorial layout with no max-width constraint on the canvas itself — imagery stretches edge-to-edge while text blocks are constrained to ~360–480px columns anchored bottom-left or centered. The page reads top-to-bottom as alternating plates: full-bleed dark hero → full-bleed lifestyle product shot → white PDP with centered minimal product. Section rhythm is spacious with 72px gaps; content within sections breathes through 20–40px internal padding. Navigation is a minimal header bar (logo centered, menu left, cart right) over a thin announcement bar — no sticky behavior, no mega-menu visible at the top level. The PDP uses a centered single-column stack rather than the typical two-column product layout, reinforcing the lookbook-over-retail feel.

## Agent Prompt Guide

**Quick Color Reference**
- text: #030303
- background: #ffffff
- border: #030303
- accent: #f6eada (Parchment Cream)
- muted text: #807e81
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Build the hero plate:** Full-bleed photographic background filling 100vh. Bottom-left caption block with 40px left padding: eyebrow in Founders Grotesk Mono 13px uppercase, +0.03em tracking, #ffffff. Title in Founders Grotesk 300 at 32px, #ffffff. Body in Founders Grotesk 300 at 15–16px, line-height 1.45, #ffffff. Ghost link at 12px Mono uppercase underlined.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Build the ghost link:** Inline element, Founders Grotesk Mono 12px weight 400, uppercase, +0.03em tracking, #030303, 1px underline. No background, no border, no padding. 12px gap to adjacent elements.

4. **Build the announcement bar:** Full-width white strip, 38px top/bottom padding. Centered Mono 12px uppercase #030303 copy with 0.03em tracking. Close × icon right-aligned in #030303.

5. **Build the footer:** Stone Gray #dad9d5 background, 38px vertical padding, 40px column gap. Column headers in Mono 12px uppercase #030303. Links in Mono 12px #030303 with 12px vertical gap between items.

## Elevation Philosophy

The system is intentionally flat — no shadows, no blurs, no glows. Visual hierarchy is built entirely through typographic weight contrast (Founders Grotesk 300 vs 500), generous whitespace, and surface tint shifts (white → Stone Gray → Parchment Cream). Depth, when it exists, comes from photography, not from CSS elevation.

## Similar Brands

- **Aesop** — Same restrained monochrome UI with serif/sans editorial typography and product photography as the chromatic content; both use generous whitespace and zero border-radius.
- **Le Labo** — Shared ultra-minimal commerce layout with uppercase tracked labels, centered wordmark, and full-bleed lifestyle photography over near-empty pages.
- **Byredo** — Comparable editorial-fragrance aesthetic: light canvas, large light-weight headlines, monospaced or tracked uppercase micro-typography, and photographic plates carrying all color.
- **Diptyque** — Similar printed-lookbook rhythm with centered minimal PDPs, Mono-functional labels, and photography alternating with white space rather than card grids.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #030303;
  --color-paper-white: #ffffff;
  --color-parchment-cream: #f6eada;
  --color-ash-gray: #cccccc;
  --color-stone-gray: #dad9d5;
  --color-pencil-gray: #807e81;

  /* Typography — Font Families */
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk-mono: 'Founders Grotesk Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.15;
  --tracking-caption: 0.36px;
  --text-body: 15px;
  --leading-body: 1.45;
  --tracking-body: 0.15px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.35;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-display: 28px;
  --leading-display: 0.92;
  --tracking-display: -0.56px;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 72px;
  --card-padding: 40px;
  --element-gap: 12px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-stone-gray: #dad9d5;
  --surface-parchment-cream: #f6eada;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #030303;
  --color-paper-white: #ffffff;
  --color-parchment-cream: #f6eada;
  --color-ash-gray: #cccccc;
  --color-stone-gray: #dad9d5;
  --color-pencil-gray: #807e81;

  /* Typography */
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk-mono: 'Founders Grotesk Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.15;
  --tracking-caption: 0.36px;
  --text-body: 15px;
  --leading-body: 1.45;
  --tracking-body: 0.15px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.35;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-display: 28px;
  --leading-display: 0.92;
  --tracking-display: -0.56px;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
}
```
