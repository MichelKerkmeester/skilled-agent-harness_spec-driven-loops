# Oura Ring — Style Reference
> Warm oatmeal atelier under soft daylight

**Theme:** light

Oura speaks in a warm, tactile language of skin and ceramic: a cream-oatmeal canvas (#f7f1e8), deep charcoal text, and photography that fills every viewport with human-scale detail. The type system pairs a precise grotesque (AkkuratLL) for everything functional with an editorial high-contrast serif (Editorial New) for emotional headlines — italic flourishes in the serif whisper rather than shout. Color is nearly absent by design: the entire palette lives in warm neutrals, with a single muted olive (#5b6550) used as the only chromatic accent. Components are quiet and rounded — pill buttons, 8px-radius cards, 12px-radius inputs, hairline 1px borders in #ececec. The feeling is luxury wellness: less technology product, more considered object you wear on your body.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream | `#f7f1e8` | `--color-cream` | Page canvas, hero backgrounds, card surfaces — the warm paper-white that makes every photograph feel tactile |
| Soft Charcoal | `#4a4741` | `--color-soft-charcoal` | Body copy, secondary headings, button borders, input borders — warm near-black that sits softer than pure #000 |
| Pure Black | `#000000` | `--color-pure-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Bone White | `#fefaef` | `--color-bone-white` | Secondary card surface, button border tint, subtle elevated panels |
| Stone Border | `#ececec` | `--color-stone-border` | Hairline dividers, image borders, card outlines, input borders — the structural 1px that holds the system together |
| Ash Mist | `#a8a5a0` | `--color-ash-mist` | Muted helper text, secondary metadata, inactive nav, sub-labels |
| Slate Stone | `#838280` | `--color-slate-stone` | Tertiary text, icon secondary states, disabled button text |
| Dusk | `#d3d1ce` | `--color-dusk` | Subtle background fills for alternating sections, muted surface layer |
| Pure White | `#ffffff` | `--color-pure-white` | Text on dark fills, inverted button text, clean card highlights |
| Onyx Pill | `#222428` | `--color-onyx-pill` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Sage Whisper | `#5b6550` | `--color-sage-whisper` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |

## Tokens — Typography

### AkkuratLL — Primary workhorse — body text, navigation, buttons, labels, UI chrome. Weight 400 for body, 500 for labels, 700 for emphasis. Light weights (200/300) appear in large display sizes for an airy editorial feel. Custom alternative: Inter, Neue Haas Grotesk, or Söhne. · `--font-akkuratll`
- **Substitute:** Inter
- **Weights:** 200, 300, 400, 500, 700
- **Sizes:** 12, 14, 16, 18, 24, 40, 48, 80, 96
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.05em at 96px, -0.025em at 48–80px, 0.025em at 12–14px, 0.05em at small caps
- **OpenType features:** `"kern" 1, "liga" 0, "dlig" 0, "onum" 0, "ss01" 0, "tnum" 0`
- **Role:** Primary workhorse — body text, navigation, buttons, labels, UI chrome. Weight 400 for body, 500 for labels, 700 for emphasis. Light weights (200/300) appear in large display sizes for an airy editorial feel. Custom alternative: Inter, Neue Haas Grotesk, or Söhne.

### Editorial New — Display serif reserved for hero headlines and emotional section titles. Light weight (100/300) with negative tracking creates high-contrast elegance. Italic cuts deliver the poetic 'Made for you.' moments. Custom alternative: GT Super, Canela, or Domaine Display. · `--font-editorial-new`
- **Substitute:** GT Super
- **Weights:** 100, 300, 500
- **Sizes:** 30, 40, 80, 96
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.025em across all sizes
- **OpenType features:** `"dlig" 0, "kern", "liga" 0, "onum" 0, "ss01" 0, "tnum" 0`
- **Role:** Display serif reserved for hero headlines and emotional section titles. Light weight (100/300) with negative tracking creates high-contrast elegance. Italic cuts deliver the poetic 'Made for you.' moments. Custom alternative: GT Super, Canela, or Domaine Display.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.5px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.35px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.38 | — | `--text-heading-sm` |
| heading | 40px | 1.25 | -1px | `--text-heading` |
| heading-lg | 48px | 1.25 | -1.2px | `--text-heading-lg` |
| display | 80px | 1 | -2px | `--text-display` |
| display-xl | 96px | 1 | -4.8px | `--text-display-xl` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| large | 24px |
| small | 4px |
| images | 8px |
| inputs | 12px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Dark Pill Button (Primary)
**Role:** Primary CTA — filled, rounded-full, near-black on cream backgrounds

Background #222428, text #ffffff, border-radius 9999px, padding 14px 28px, font AkkuratLL weight 500 size 16px, letter-spacing 0.025em. Used for 'Discover Oura Ring 4', 'Shop', 'How It Works'.

### Ghost Pill Button (Secondary)
**Role:** Secondary action — outlined pill with no fill

Background transparent, border 1px #4a4741, text #4a4741, border-radius 9999px, padding 14px 28px, font AkkuratLL weight 500 size 16px. Used for 'Explore' next to Shop on product cards.

### Product Card (Lifestyle)
**Role:** Product showcase card with full-bleed photography

Full-bleed photographic background, 8px border-radius, 1px #ececec border, product name overlay in white (#ffffff) at 30–40px Editorial New weight 300, price label in body-sm AkkuratLL. Dark scrim at bottom for text legibility. Explore + Shop ghost buttons positioned bottom-right.

### Navigation Bar (Top)
**Role:** Primary site navigation with centered links

Transparent or #f7f1e8 background, no border, logo (Oura wordmark) left, nav links center (Shop, Health Features, Experiences, For Organizations) in AkkuratLL weight 400 size 14px #4a4741, account icon right. Dropdown carets in #838280.

### Announcement Bar
**Role:** Top promotional strip above nav

Background #f7f1e8, text #4a4741 AkkuratLL weight 400 size 14px, centered single line. Minimal, no border.

### Section Heading (Editorial)
**Role:** Large display headline for content sections

Editorial New weight 300 size 80–96px, color #4a4741 or #000000, letter-spacing -0.025em. Centered or left-aligned. Italic variant (weight 300 italic) for poetic phrases.

### Body Paragraph
**Role:** Standard body copy block

AkkuratLL weight 400 size 16–18px, line-height 1.5, color #4a4741, max-width ~600px for readability in body contexts.

### Text Input
**Role:** Form input for newsletter, account creation

Background transparent or #ffffff, border 1px #4a4741 or #ececec, border-radius 12px, padding 14px 20px, font AkkuratLL weight 400 size 16px #000000. Focus state: border darkens to #000000.

### Membership CTA Pill
**Role:** Dark pill button for membership conversion

Background #222428, text #ffffff, border-radius 9999px, padding 14px 28px, font AkkuratLL weight 500 size 16px. Same as primary button but used in lower-priority conversion contexts.

### Hero Overlay Card
**Role:** Small product teaser card overlaid on hero photography

Dark background (#222428 or #1c1b1a), 8px border-radius, product thumbnail left, title + CTA right, white text, positioned bottom-right of hero. Compact 320px width.

### Tab Navigation
**Role:** Horizontal tab strip for product feature sections

Underline-style tabs in AkkuratLL weight 400 size 16px, color #a8a5a0 (inactive) and #000000 (active), 2px solid #000000 underline on active tab. Spacing: 40px between tabs.

### Footer
**Role:** Site footer with link columns

Background #f7f1e8 or #d3d1ce, multi-column link lists in AkkuratLL weight 400 size 14px #4a4741, section headings weight 500 size 14px, generous 80px vertical padding.

## Do's and Don'ts

### Do
- Use Editorial New only for display headlines 30px and above — never for body text or UI labels
- Set body line-height to 1.5 and display line-height to 1.0–1.25 — the contrast between airy display and breathable body is a signature
- Use 8px border-radius for all cards and images, 9999px for all buttons, 12px for inputs — these three radii define the system's geometry
- Pair negative letter-spacing (-0.025em to -0.05em) with sizes 40px and above; use 0.025–0.05em positive tracking on 12–14px small text for refined micro-labels
- Default to #f7f1e8 cream as background; reach for #ffffff only when you need inverted contrast on a dark surface
- Use #5b6550 sage as the sole chromatic accent — restrict it to icon strokes and decorative moments, never use it for text or buttons
- Maintain 80px section gaps in long-form layouts; collapse to 40px only in product card grids

### Don't
- Do not use Editorial New for body copy, nav items, button labels, or any text under 30px — the serif is display-only
- Do not use pure #ffffff as the page background — the warm cream #f7f1e8 is what gives the system its tactile character
- Do not apply drop shadows to cards or panels — use 1px #ececec borders and surface differentiation instead
- Do not use #5b6550 for CTA buttons, links, or body text — it is decorative accent only
- Do not mix more than two typefaces in a single view — Editorial New for the headline, AkkuratLL for everything else
- Do not use fully saturated colors or bright hues — the entire palette lives in desaturated warm territory
- Do not break the 9999px button radius convention for rectangular buttons — all buttons are pills
- Do not use tight letter-spacing on small text — 12–14px sizes need positive tracking (0.025–0.05em) to breathe

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#f7f1e8` | Base page background — warm paper-white that makes photography feel organic |
| 1 | Bone White | `#fefaef` | Secondary card or panel surface, subtle differentiation from canvas |
| 2 | Pure White | `#ffffff` | Inverted card surfaces, input fields, dark-on-light contrast zones |
| 3 | Dusk Layer | `#d3d1ce` | Alternating section bands, muted background fills for visual separation |
| 4 | Onyx | `#222428` | Dark surfaces — footer, hero overlay cards, filled buttons |

## Elevation

Elevation is achieved through contrast, not shadow. The system relies on warm surface differentiation (cream → bone → dusk → onyx) and 1px #ececec hairlines rather than drop shadows. When shadows do appear, they are extremely soft and warm-tinted, barely perceptible. This keeps the interface feeling like printed paper rather than digital material.

## Imagery

Photography is the dominant visual element — always full-bleed, always human-scale, always warm-toned. Lifestyle shots show hands wearing the ring, close-cropped skin texture, soft natural light. No product-on-white clinical shots. Color treatment is warm and slightly desaturated, with golden-hour undertones. Icons are line-drawn and minimal, rendered in #5b6550 olive or #4a4741 charcoal. No illustrations, no 3D renders, no abstract graphics — the product and the human body are the only visuals.

## Layout

Full-bleed hero with a large editorial headline left-aligned over a warm photograph filling the viewport. Navigation floats transparently over the hero. Below the fold: two-column product card grid with full-bleed photography and overlay text. Content sections alternate between cream canvas and subtle dusk bands. Section headings are centered or left-aligned at display size. Footer is a wide multi-column layout. Max content width approximately 1280px with generous 80px section gaps. The rhythm is slow, spacious, editorial — never information-dense.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #f7f1e8
- border: #ececec
- accent: #5b6550
- secondary text: #4a4741
- muted text: #a8a5a0
- primary action: no distinct CTA color

## Example Component Prompts

1. **Dark Pill Button**: Background #222428, text #ffffff, border-radius 9999px, padding 14px 28px, AkkuratLL weight 500 size 16px letter-spacing 0.025em. Label: 'Discover Oura Ring 4'.

2. **Product Lifestyle Card**: Full-bleed warm-toned photograph, 8px border-radius, 1px #ececec border. Overlay text bottom-left: 'Oura Ring 4' in Editorial New weight 300 size 40px #ffffff, 'From €399' in AkkuratLL weight 400 size 14px #ffffff at 80% opacity. Two ghost pill buttons bottom-right: 'Explore' (border 1px #ffffff, text #ffffff) and 'Shop' (background #ffffff, text #000000).

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Tab Strip**: Horizontal row of 5 tabs, AkkuratLL weight 400 size 16px. Inactive: #a8a5a0. Active: #000000 with 2px solid #000000 underline. 40px gap between tabs. Content area below shows feature image left, description right.

5. **Section Heading Block**: Centered, Editorial New weight 300 size 80px #4a4741, letter-spacing -0.025em. Two lines, second line optionally italic. 80px vertical padding above and below.

## Gradient System

Gradients are used sparingly as atmospheric warm glows — never as background fills. Two primary gradients: (1) a radial golden warmth rgba(255, 182, 72, 0.3) → transparent, positioned at 50% 85% to suggest candlelight or sunset on the page; (2) a diagonal dark-to-gold linear gradient rgb(30,36,39) → rgb(175,117,27) for premium moments like the charging case teaser. These are decorative warmth, not functional UI.

## Similar Brands

- **Aesop** — Same warm cream backgrounds, restrained near-monochrome palette, and serif-grotesque type pairing for luxury wellness positioning
- **Ganni** — Editorial serif display headlines over full-bleed warm lifestyle photography with pill-shaped ghost buttons
- **Mejuri** — Warm neutral canvas, pill buttons, lifestyle product cards with overlay text, and a single muted accent tone
- **M.Gemi** — Editorial New-style high-contrast serif for emotional headlines paired with clean grotesque body, warm paper-like backgrounds
- **By Far** — Warm cream canvas, oversized serif display type, ghost pill CTAs, and full-bleed warm-toned lifestyle photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream: #f7f1e8;
  --color-soft-charcoal: #4a4741;
  --color-pure-black: #000000;
  --color-bone-white: #fefaef;
  --color-stone-border: #ececec;
  --color-ash-mist: #a8a5a0;
  --color-slate-stone: #838280;
  --color-dusk: #d3d1ce;
  --color-pure-white: #ffffff;
  --color-onyx-pill: #222428;
  --color-sage-whisper: #5b6550;

  /* Typography — Font Families */
  --font-akkuratll: 'AkkuratLL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --text-heading: 40px;
  --leading-heading: 1.25;
  --tracking-heading: -1px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.2px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2px;
  --text-display-xl: 96px;
  --leading-display-xl: 1;
  --tracking-display-xl: -4.8px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-large: 24px;
  --radius-small: 4px;
  --radius-images: 8px;
  --radius-inputs: 12px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-cream-canvas: #f7f1e8;
  --surface-bone-white: #fefaef;
  --surface-pure-white: #ffffff;
  --surface-dusk-layer: #d3d1ce;
  --surface-onyx: #222428;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream: #f7f1e8;
  --color-soft-charcoal: #4a4741;
  --color-pure-black: #000000;
  --color-bone-white: #fefaef;
  --color-stone-border: #ececec;
  --color-ash-mist: #a8a5a0;
  --color-slate-stone: #838280;
  --color-dusk: #d3d1ce;
  --color-pure-white: #ffffff;
  --color-onyx-pill: #222428;
  --color-sage-whisper: #5b6550;

  /* Typography */
  --font-akkuratll: 'AkkuratLL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --text-heading: 40px;
  --leading-heading: 1.25;
  --tracking-heading: -1px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.2px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2px;
  --text-display-xl: 96px;
  --leading-display-xl: 1;
  --tracking-display-xl: -4.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
}
```
