# Aboard — Style Reference
> Editorial field journal under industrial light

**Theme:** mixed

Aboard reads as an editorial dossier drafted inside a working warehouse: Tobias serif headlines at weight 300 float over Atkinson Hyperlegible Mono body copy, a pairing that treats the page as a technical specification rather than a marketing surface. The system alternates full-bleed dark documentary bands with warm off-white reading sections, the rhythm controlled by a single vivid ember-orange that punctuates CTAs, icons, and active states against an otherwise achromatic palette. Components are deliberately thin: pill-shaped CTAs, translucent floating nav, hairline borders at 1px, almost no shadow or elevation — the interface recedes so the photography and the prose can carry the page. The warmth of the neutrals (bone white, linen, warm graphite) keeps the dark sections from feeling cold, while the orange never decorates — it always signals an action or a live status.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#de4c00` | `--color-ember-orange` | Primary CTAs, active nav items, icon fills, link accents — the only chromatic color in the UI, it acts as a power-switch indicator against the muted neutrals |
| Soft Ember | `#efa680` | `--color-soft-ember` | Hover-state borders, subdued accent outlines, tag strokes — a desaturated echo of Ember Orange for quieter accents |
| Bone White | `#fffefb` | `--color-bone-white` | Page canvas on light sections, text color on dark/image sections |
| Linen | `#f3f2ee` | `--color-linen` | Warm secondary surface, elevated card backgrounds, subtle shadow tint |
| Hairline Gray | `#e5e7eb` | `--color-hairline-gray` | Hairline borders across cards, images, dividers, and form fields |
| Stone Border | `#c1bdba` | `--color-stone-border` | Medium-strength borders where hairline is too faint |
| Warm Taupe | `#a49784` | `--color-warm-taupe` | Translucent nav background tint, muted UI surfaces |
| Graphite | `#333833` | `--color-graphite` | Strong dark borders, deep separators |
| Warm Graphite | `#271503` | `--color-warm-graphite` | Primary body and heading text on light surfaces — a warm near-black with brown undertone instead of pure black |
| Ink | `#000000` | `--color-ink` | Pure black for maximum-contrast text and image overlay scrims |
| Deep Forest | `#040c06` | `--color-deep-forest` | Dark section canvases — nearly black with a green-warm undertone that complements the orange |

## Tokens — Typography

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Tobias — Display and heading serif. Weight 300 across all sizes — the whisper-weight is anti-convention for 72px display, creating authority through restraint rather than volume. Used for hero headlines, section titles, and editorial pull-quotes. · `--font-tobias`
- **Substitute:** Cormorant Garamond, Playfair Display, or system serif
- **Weights:** 300
- **Sizes:** 24px, 32px, 72px
- **Line height:** 1.10–1.30
- **Letter spacing:** -0.48px at 24px, -0.64px at 32px, -1.44px at 72px
- **Role:** Display and heading serif. Weight 300 across all sizes — the whisper-weight is anti-convention for 72px display, creating authority through restraint rather than volume. Used for hero headlines, section titles, and editorial pull-quotes.

### Atkinson Hyperlegible Mono — Body copy, labels, and micro-text. The mono body choice is the system's signature: it treats the page as a technical manual or terminal readout, not a marketing brochure. The wider tracking at 0.05em on small sizes (10–14px) creates generous rhythm for sidebar labels and captions. · `--font-atkinson-hyperlegible-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or system monospace
- **Weights:** 300
- **Sizes:** 10px, 12px, 14px, 16px
- **Line height:** 1.57–1.83
- **Letter spacing:** -0.32px at 16px, +0.5px at 10px, +0.6px at 12px, +0.7px at 14px
- **Role:** Body copy, labels, and micro-text. The mono body choice is the system's signature: it treats the page as a technical manual or terminal readout, not a marketing brochure. The wider tracking at 0.05em on small sizes (10–14px) creates generous rhythm for sidebar labels and captions.

### Work Sans — Navigation links, button text, and small UI controls where a humanist sans is preferable to mono. Acts as the utility face between the editorial headlines and the technical body. · `--font-work-sans`
- **Substitute:** Inter, system-ui, or Helvetica Neue
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.63–1.83
- **Letter spacing:** -0.0200em, -0.0170em
- **Role:** Navigation links, button text, and small UI controls where a humanist sans is preferable to mono. Acts as the utility face between the editorial headlines and the technical body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.6 | 0.5px | `--text-micro` |
| caption | 12px | 1.63 | 0.6px | `--text-caption` |
| body-sm | 14px | 1.63 | 0.7px | `--text-body-sm` |
| body | 16px | 1.57 | -0.32px | `--text-body` |
| heading | 24px | 1.3 | -0.48px | `--text-heading` |
| heading-lg | 32px | 1.3 | -0.64px | `--text-heading-lg` |
| display | 72px | 1.1 | -1.44px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |
| 152 | 152px | `--spacing-152` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 30px |
| tags | 8px |
| cards | 12px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Ember Pill CTA
**Role:** Primary call-to-action button

Filled with #de4c00, white text in Work Sans 400 16px, 9999px border-radius, 10px vertical / 24px horizontal padding. Single-line label. No shadow. The pill shape is the only rounded element at full curvature — it makes the CTA unmistakable as the page's power switch.

### Translucent Floating Nav
**Role:** Top-of-page navigation

Pill-shaped container at 30px border-radius, warm taupe (#a49784) at low opacity over the page, containing the 

### Serif Display Heading
**Role:** Hero and section headlines

Tobias weight 300, 72px on hero, 32–24px on section titles. Line-height 1.10–1.30. Letter-spacing -0.02em. Color Bone White (#fffefb) on dark sections, Warm Graphite (#271503) on light sections. The light weight is non-negotiable — bolding it kills the editorial feel.

### Mono Body Block
**Role:** Paragraph copy in content sections

Atkinson Hyperlegible Mono weight 300, 14–16px, line-height 1.63–1.83, letter-spacing -0.32px at 16px. Color Warm Graphite (#271503) on light surfaces, Bone White (#fffefb) on dark. Max-width ~480px to preserve the terminal-readout measure.

### Two-Column Editorial Section
**Role:** Content layout: heading left, body right

Side-by-side grid with 48–64px gap. Left column holds the Serif Display Heading at 32px. Right column holds Mono Body Block at 14–16px. Both vertically top-aligned. Background: Bone White or Linen. Section padding: 64px horizontal, 64px vertical.

### Full-Bleed Documentary Image
**Role:** Atmospheric image band between content sections

Edge-to-edge photograph on Deep Forest (#040c06) background. Optional dark scrim (rgba(0,0,0,0.3–0.5)) for text contrast. White or Bone White overlay text in Tobias 300. Images are documentary/candid, not stock-polished.

### Vertical Sidebar Label
**Role:** Section indicator on page edge

Rotated 90° text on the left page margin, positioned 24–49px from the edge. Atkinson Hyperlegible Mono 10–12px, letter-spacing 0.05em, uppercase or as-is. Color: Warm Graphite on light sections, Hairline Gray (#c1bdba) or Bone White on dark. Functions as a section marker, not navigation.

### Ghost Text Link
**Role:** Inline links in body copy

No background, 1px underline in #de4c00 or Warm Graphite depending on context. Work Sans or mono at 14–16px. Hover increases opacity or shifts to Ember Orange.

### Hairline Divider
**Role:** Section separator

1px solid #e5e7eb or #c1bdba, full-width or contained. No ornamentation, no gradient fade. The division between sections is implied by spacing, not visual lines — this is a fallback.

### Image Frame Card
**Role:** Content card with image

1px solid #e5e7eb border, 12px border-radius, Linen (#f3f2ee) interior, 24px padding. Image at top with 1px border in #e5e7eb. Body text in mono 14px below. Minimal elevation — no drop shadow.

### Compact Pill Tag
**Role:** Category or status badge

8px border-radius (subtle pill, not full curvature), 4–8px vertical / 8–12px horizontal padding, Work Sans 12px or mono 10–12px. Border 1px in #e5e7eb or #efa680. Background: Bone White or transparent. Color: Warm Graphite or Ember Orange.

## Do's and Don'ts

### Do
- Set all primary CTAs to 9999px border-radius with #de4c00 fill and Bone White text in Work Sans 400 16px.
- Use Tobias weight 300 for every heading at 24px, 32px, and 72px — never bold the serif.
- Write body copy in Atkinson Hyperlegible Mono weight 300 at 14–16px with line-height 1.63–1.83.
- Separate sections with 64px vertical padding, not dividers or background color changes alone.
- Apply 1px solid #e5e7eb borders to all cards and images — never use drop shadows for elevation.
- Use #fffefb for light canvases and #040c06 for dark bands; let photography fill the dark bands edge-to-edge.
- Limit color usage: Ember Orange (#de4c00) appears only on CTAs, active states, and icon fills — nowhere decorative.

### Don't
- Do not use bold (600–700) weights on Tobias headings — the whisper-weight 300 is the signature.
- Do not introduce drop shadows for card elevation; use Linen (#f3f2ee) surface color and hairline borders instead.
- Do not use a proportional sans-serif for body copy — the mono body is the system's defining choice.
- Do not apply Ember Orange to backgrounds, section bands, or decorative elements — it is action-only.
- Do not use radius values outside the four tokens: 8px (tags), 12px (cards), 30px (nav), 9999px (buttons).
- Do not break the two-tone canvas rhythm — do not insert a third surface color (e.g. blue or purple) into light or dark sections.
- Do not use stock photography, illustrations, or 3D renders — imagery must be documentary and candid.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#fffefb` | Light reading sections, default page background |
| 2 | Linen Card | `#f3f2ee` | Elevated content blocks, secondary panels |
| 3 | Taupe Nav | `#a49784` | Translucent floating navigation surface |
| 4 | Deep Forest | `#040c06` | Dark documentary sections, image band canvases |

## Elevation

The system deliberately avoids drop shadows. Elevation is expressed through surface color shifts (Bone White → Linen) and hairline borders (#e5e7eb at 1px). The only shadow-adjacent value is a faint box-shadow tinted with #f3f2ee on buttons — and even that is barely perceptible. The interface should feel printed, not floating.

## Imagery

Photography is documentary and candid: warehouse floors with workers in hi-vis vests, open-plan offices with natural light, real human activity rather than staged corporate stock. Images run full-bleed as section bands, often with a dark scrim for text overlay. They carry a muted, slightly desaturated color grade that matches the warm-neutral palette. No illustrations, no 3D renders, no product screenshots — the photography IS the visual content. Iconography is minimal: small mono-weight line icons in Warm Graphite or Ember Orange, never decorative.

## Layout

The page alternates between two canvas states: full-bleed dark documentary bands (Deep Forest #040c06 with photo) and warm light reading sections (Bone White #fffefb). Content is center-constrained at 1200px max-width. The hero is a full-viewport dark image with centered Tobias headline and orange CTA. Subsequent content sections use a two-column editorial split — serif heading left, mono body right — with generous 64px vertical gaps. Vertical sidebar labels sit on the left page edge as section markers. Navigation is a floating pill capsule, not a full-width bar. The overall density is spacious and breathing; the page is text-and-photography dominant, not grid-of-cards dominant.

## Agent Prompt Guide

Quick Color Reference:\n- text: #271503 (light) / #fffefb (dark)\n- background: #fffefb (light) / #040c06 (dark)\n- border: #e5e7eb (hairline) / #c1bdba (medium)\n- accent: #de4c00 (Ember Orange — icons, links, active states)\n- primary action: #de4c00 (filled action)

## Similar Brands

- **Linear** — Shared dark editorial band + light reading section alternation, restrained color palette with a single vivid accent for actions
- **Vercel** — Monospace micro-text for labels and metadata, generous whitespace, minimal border-radius tokens
- **Ramp** — Full-bleed documentary photography sections, warm off-white reading surfaces, single warm accent color for CTAs
- **Pitch** — Editorial serif-meets-mono typography pairing, spacious two-column content layouts, pill-shaped navigation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #de4c00;
  --color-soft-ember: #efa680;
  --color-bone-white: #fffefb;
  --color-linen: #f3f2ee;
  --color-hairline-gray: #e5e7eb;
  --color-stone-border: #c1bdba;
  --color-warm-taupe: #a49784;
  --color-graphite: #333833;
  --color-warm-graphite: #271503;
  --color-ink: #000000;
  --color-deep-forest: #040c06;

  /* Typography — Font Families */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias: 'Tobias', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atkinson-hyperlegible-mono: 'Atkinson Hyperlegible Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.6;
  --tracking-micro: 0.5px;
  --text-caption: 12px;
  --leading-caption: 1.63;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.63;
  --tracking-body-sm: 0.7px;
  --text-body: 16px;
  --leading-body: 1.57;
  --tracking-body: -0.32px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: -0.48px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -0.64px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-152: 152px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 30px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 30px;
  --radius-tags: 8px;
  --radius-cards: 12px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-bone-canvas: #fffefb;
  --surface-linen-card: #f3f2ee;
  --surface-taupe-nav: #a49784;
  --surface-deep-forest: #040c06;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #de4c00;
  --color-soft-ember: #efa680;
  --color-bone-white: #fffefb;
  --color-linen: #f3f2ee;
  --color-hairline-gray: #e5e7eb;
  --color-stone-border: #c1bdba;
  --color-warm-taupe: #a49784;
  --color-graphite: #333833;
  --color-warm-graphite: #271503;
  --color-ink: #000000;
  --color-deep-forest: #040c06;

  /* Typography */
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias: 'Tobias', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atkinson-hyperlegible-mono: 'Atkinson Hyperlegible Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.6;
  --tracking-micro: 0.5px;
  --text-caption: 12px;
  --leading-caption: 1.63;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.63;
  --tracking-body-sm: 0.7px;
  --text-body: 16px;
  --leading-body: 1.57;
  --tracking-body: -0.32px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: -0.48px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -0.64px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-152: 152px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 30px;
  --radius-full: 9999px;
}
```
