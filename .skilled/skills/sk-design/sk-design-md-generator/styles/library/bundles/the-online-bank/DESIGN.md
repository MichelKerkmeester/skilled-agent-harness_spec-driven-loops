# The online bank — Style Reference
> Digital vault in deep ocean teal — a bank that earns calm through quiet white space and a single confident color.

**Theme:** light

N26 presents a calm, confident digital banking sanctuary anchored by a single deep teal hero that commands the viewport while the rest of the interface recedes into warm off-white space. The visual hierarchy is built on contrast: dense dark ink (#1b1b1b) on near-white canvas (#faf8f5), with teal appearing as purposeful punctuation for primary actions and brand moments rather than decoration. Typography carries a distinctive tension between the compact, slightly tracked N26 sans-serif used for navigation and body content, and the wider N26-Extended display face that gives headlines room to breathe at 58–80px. Components feel architectural and minimal — thin borders, generous padding, small radii on controls, large radii on imagery — reflecting a European design-banking sensibility where trust is conveyed through restraint rather than ornament.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Teal | `#088177` | `--color-deep-teal` | Teal supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink | `#1b1b1b` | `--color-ink` | Primary body text, headings, icon strokes, link text, and nav labels — a near-black that softens to charcoal, avoiding the harshness of pure black on warm white |
| Canvas Warmth | `#faf8f5` | `--color-canvas-warmth` | Page background — a warm, paper-like off-white that gives the entire interface a human, editorial quality distinct from clinical SaaS whites |
| Surface White | `#ffffff` | `--color-surface-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Hairline | `#e9e9e9` | `--color-hairline` | Subtle borders, dividers between content blocks, and input field outlines — light enough to recede but present enough to structure information |
| Border Soft | `#d9d9d9` | `--color-border-soft` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Pure Black | `#000000` | `--color-pure-black` | Reserved for icon fills and the rare element requiring maximum contrast — used sparingly alongside the softer Ink |
| Teal Mist | `#d8edeb` | `--color-teal-mist` | Light teal-tinted surface for accent backgrounds, highlight panels, and soft washes that echo the brand color without dominating |
| Blush Neutral | `#f5e1e3` | `--color-blush-neutral` | Warm pink-tinted surface for category differentiation in editorial layouts — used as a subtle alternative to teal-tinted sections |

## Tokens — Typography

### N26 — The workhorse sans-serif for all navigation, body copy, buttons, labels, and UI micro-text. Weight 500 for emphasis, 700 for primary action labels and key headings. Slight positive tracking (0.008–0.019em) gives small sizes a controlled, legible quality — the custom feel comes from this restrained openness rather than display flourishes. · `--font-n26`
- **Substitute:** Inter, DM Sans, or system-ui
- **Weights:** 400, 500, 700
- **Sizes:** 11px, 14px, 16px, 18px, 20px, 24px
- **Line height:** 1.33, 1.38, 1.43, 1.50, 1.60
- **Letter spacing:** 0.0080em at 24px, 0.0100em at 18px, 0.0160em at 14px, 0.0190em at 11px — tracking widens as size decreases for optical balance
- **Role:** The workhorse sans-serif for all navigation, body copy, buttons, labels, and UI micro-text. Weight 500 for emphasis, 700 for primary action labels and key headings. Slight positive tracking (0.008–0.019em) gives small sizes a controlled, legible quality — the custom feel comes from this restrained openness rather than display flourishes.

### N26-Extended — Display face reserved for hero headlines, section titles, and large statement copy. The wider proportions at 58–80px create breathing room that contrasts the compact N26 body face — this duality (tight UI type + expansive display type) is the typographic signature. Normal letter-spacing lets the wide letterforms do the work. · `--font-n26-extended`
- **Substitute:** Inter Display, Söhne Breit, or a wide-proportion alternative
- **Weights:** 400, 500
- **Sizes:** 18px, 32px, 44px, 58px, 80px
- **Line height:** 1.10, 1.20, 1.25, 1.50
- **Role:** Display face reserved for hero headlines, section titles, and large statement copy. The wider proportions at 58–80px create breathing room that contrasts the compact N26 body face — this duality (tight UI type + expansive display type) is the typographic signature. Normal letter-spacing lets the wide letterforms do the work.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.38 | 0.21px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.22px | `--text-body-sm` |
| body | 16px | 1.5 | 0.16px | `--text-body` |
| subheading | 20px | 1.43 | 0.16px | `--text-subheading` |
| heading-sm | 24px | 1.38 | 0.19px | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| heading-lg | 44px | 1.2 | — | `--text-heading-lg` |
| display | 80px | 1.1 | — | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| images | 24px |
| inputs | 4px |
| buttons | 8px |
| small_elements | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 32-48px
- **Element gap:** 8-16px

## Components

### Primary Filled Button
**Role:** Top-of-page conversion actions, nav CTAs

Filled with #088177 Deep Teal, white text, N26 weight 500 at 14-16px, 8px border-radius, approximately 8px 20px padding. Sits in the top nav as the highest-prominence action on the page.

### Inverse Button
**Role:** CTAs placed on teal hero backgrounds

White background, #1b1b1b Ink text, 8px border-radius, 12px 24px padding. Used on the full-bleed teal hero to create inversion contrast while maintaining the same compact button shape.

### Text Link Nav Item
**Role:** Primary navigation items

N26 weight 500 at 16px, #1b1b1b text, no underline by default, 8px horizontal padding. Generous spacing between items creates the quiet, unhurried navigation rhythm.

### Hero Band
**Role:** Full-bleed opening section

#088177 Deep Teal background spanning the full viewport width, centered content with 80px vertical padding. N26-Extended display headline at 58-80px in white, body subtext at 18px in white, followed by the inverse button. The color band itself is the hero — no image, no gradient.

### Risk Disclosure Strip
**Role:** Regulatory/compliance information panels

White background, #e9e9e9 hairline borders, small N26 body text at 14px in #1b1b1b. Two-column layout with 1/6 and 6/6 risk indicators. Padding 16-24px, no rounded corners — utilitarian and informational.

### Brand Wordmark
**Role:** Logo and brand mark in nav

N26 in condensed form, weight 500, approximately 20-24px, #1b1b1b. The overline/tilde above the N is a distinctive brand mark. Links to homepage from any page.

### Card Surface
**Role:** Content cards on warm canvas

#ffffff background on the #faf8f5 canvas, no shadow, 24px border-radius for image-forward cards or 8px for compact info cards. 32-48px internal padding. Elevation comes from color contrast, not shadow.

### App Download QR
**Role:** Floating app acquisition element

Small white card with 8px radius, fixed-position bottom right, QR code image with 'Get the app' caption at 14px N26 weight 500. Stays accessible without disrupting the main content flow.

### Locale Selector
**Role:** Language/country switcher in nav

Inline element with #1b1b1b text at 14px, small flag indicator, minimal styling — appears as a simple text link rather than a dropdown chrome.

### Hairline Divider
**Role:** Section separators and content structure

1px solid #e9e9e9 horizontal rule. Used between risk disclosure rows and to separate content blocks without requiring additional spacing.

## Do's and Don'ts

### Do
- Use #088177 Deep Teal for filled primary action buttons and full-bleed brand sections — it is the only chromatic color with permission to dominate a screen.
- Set all page backgrounds to #faf8f5 Canvas Warmth; reserve #ffffff for card surfaces that need to lift off the canvas.
- Apply N26-Extended at 44-80px with line-height 1.10-1.25 for display headlines; the wide proportions need scale to read correctly.
- Use 8px border-radius for buttons and interactive controls; reserve 24px for image cards and large media.
- Maintain section gaps of 64-80px to preserve the spacious, unhurried rhythm visible in the hero-to-content transition.
- Use #e9e9e9 for all hairline borders and dividers — never heavier than 1px on the warm canvas.
- Apply slight positive tracking (0.008-0.019em) to all N26 text at 24px and below for optical balance at small sizes.

### Don't
- Never introduce additional accent colors — the entire system runs on Ink, white, and one teal. Adding a second hue breaks the brand discipline.
- Don't use #000000 for body text — always use #1b1b1b Ink for softer contrast on the warm canvas.
- Don't apply N26-Extended to body copy or UI micro-text — it is a display face only and loses legibility below 24px.
- Never use drop shadows for elevation — N26 achieves layering through background color contrast (#faf8f5 → #ffffff → tinted surfaces) alone.
- Don't set body text below 14px — the type scale starts at 11px for legal/caption text only.
- Never use border-radius larger than 8px on buttons or smaller than 24px on hero imagery — the radius scale is intentional and narrow.
- Don't place colored buttons on the teal hero — always use the white inverse button on brand-colored backgrounds to maintain the inversion relationship.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#faf8f5` | Base page background — warm off-white that gives the entire interface its editorial, paper-like quality |
| 2 | Surface | `#ffffff` | Cards, elevated panels, and content blocks that need visual lift from the canvas |
| 3 | Teal Mist | `#d8edeb` | Light teal-tinted accent surface for highlight panels and category sections |
| 4 | Blush | `#f5e1e3` | Warm pink-tinted surface for editorial category differentiation |
| 5 | Brand Band | `#088177` | Full-bleed brand hero sections and primary action fills — the highest-prominence surface |

## Elevation

N26 deliberately avoids drop shadows. Elevation is achieved entirely through background color layering: the warm canvas (#faf8f5) provides the base, white cards lift off it through tonal contrast alone, and the deep teal brand band sits as the highest visual layer. This shadow-free approach reinforces the editorial, paper-like quality and avoids the generic SaaS card-with-shadow pattern.

## Imagery

The homepage is text-dominant with minimal imagery. The teal hero band relies on typography alone — no background image, illustration, or photographic element. Photography, when present on deeper pages, is treated as tight, contained crops with 24px border-radius, no overlays or duotone treatments. The visual language is fundamentally typographic and color-driven, with the brand teal serving as the primary 'image' on the hero.

## Layout

The page model is centered and max-width contained at approximately 1200px, with the hero band breaking to full-bleed for the teal section. The hero pattern is a centered headline over a solid color field — no split layout, no media. Below the hero, content flows in centered stacks with generous 64-80px vertical breathing room between sections. Navigation is a minimal top bar with brand mark left, primary nav links center, and action buttons (login + primary CTA) right. The overall density is spacious and editorial rather than information-dense.

## Agent Prompt Guide

**Quick Color Reference**
- Primary text: #1b1b1b
- Background (canvas): #faf8f5
- Surface (cards): #ffffff
- Border/hairline: #e9e9e9
- Brand accent: #088177
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Nav Bar**: #faf8f5 background, 64px height, 48px horizontal padding. Brand mark left in N26 at 20px weight 500 #1b1b1b. Nav items center in N26 weight 500 at 16px #1b1b1b, 32px gap between items. Right side: 'Log in' text link in N26 weight 500 at 14px #1b1b1b, then 'Open free bank account' filled button with #088177 background, white text, N26 weight 500 at 14px, 8px border-radius, 8px 20px padding.

3. **Content Card**: #ffffff background on #faf8f5 canvas, 24px border-radius, 32-48px internal padding. No shadow. Heading in N26 weight 700 at 24px #1b1b1b, body text in N26 weight 400 at 16px #1b1b1b, line-height 1.50.

4. **Info Strip**: #ffffff background, 1px solid #e9e9e9 top and bottom borders, 16-24px vertical padding, two-column layout with 32px column gap. Left column: N26 weight 500 at 24px #1b1b1b. Right column: N26 weight 400 at 14px #1b1b1b.

5. **App Download Widget**: #ffffff background, 8px border-radius, 16px padding, fixed bottom-right position. QR code image 80x80px, caption 'Get the app' in N26 weight 500 at 14px #1b1b1b below.

## Similar Brands

- **Revolut** — Same teal-or-purple single-accent strategy on a light neutral canvas, with a hero band that dominates the viewport through color rather than imagery
- **Monzo** — Shared approach of using one vivid brand color as a full-bleed hero, with otherwise monochrome light interface and minimal ornamentation
- **Klarna** — Similar typographic-forward hero with a solid brand color band, clean light backgrounds, and compact button styling
- **Wise (TransferWise)** — Same financial-product minimalism: warm off-white canvas, single brand accent, generous spacing, and editorial typography-driven hero

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-teal: #088177;
  --color-ink: #1b1b1b;
  --color-canvas-warmth: #faf8f5;
  --color-surface-white: #ffffff;
  --color-hairline: #e9e9e9;
  --color-border-soft: #d9d9d9;
  --color-pure-black: #000000;
  --color-teal-mist: #d8edeb;
  --color-blush-neutral: #f5e1e3;

  /* Typography — Font Families */
  --font-n26: 'N26', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-n26-extended: 'N26-Extended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.38;
  --tracking-caption: 0.21px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.22px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: 0.16px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.19px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.1;

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
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 32-48px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-images: 24px;
  --radius-inputs: 4px;
  --radius-buttons: 8px;
  --radius-smallelements: 4px;

  /* Surfaces */
  --surface-canvas: #faf8f5;
  --surface-surface: #ffffff;
  --surface-teal-mist: #d8edeb;
  --surface-blush: #f5e1e3;
  --surface-brand-band: #088177;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-teal: #088177;
  --color-ink: #1b1b1b;
  --color-canvas-warmth: #faf8f5;
  --color-surface-white: #ffffff;
  --color-hairline: #e9e9e9;
  --color-border-soft: #d9d9d9;
  --color-pure-black: #000000;
  --color-teal-mist: #d8edeb;
  --color-blush-neutral: #f5e1e3;

  /* Typography */
  --font-n26: 'N26', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-n26-extended: 'N26-Extended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.38;
  --tracking-caption: 0.21px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.22px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: 0.16px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.19px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
}
```
