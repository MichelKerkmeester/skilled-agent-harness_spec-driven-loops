# Slingshot — Style Reference
> Editorial catalog on white

**Theme:** light

Slingshot runs on a confident B2B SaaS language: a near-white canvas, one saturated cobalt blue doing all the talking, and a display serif-like sans (Gopher) that hits hard at large sizes with 1.0 line-height. The interface is sparse and editorial — lots of breathing room, thin hairline borders, pill-shaped CTAs, and a single cool-blue wash (#ecf2ff) that gently segregates surface layers. Color is rationed: 95%+ of the page is neutral, and the blue appears as functional punctuation on buttons, announcement bars, and feature blocks. Product photography (swag items on white) carries the visual weight that illustration or gradients don't, so the system feels like a catalog more than a marketing page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cobalt Command | `#1a5fff` | `--color-cobalt-command` | Primary CTAs, announcement bar, active states, feature panel backgrounds — the single saturated voice of the brand against an otherwise monochrome canvas |
| Cobalt Mist | `#ecf2ff` | `--color-cobalt-mist` | Tinted card surfaces, soft section washes, subtle button hovers — a diluted echo of the primary used to create surface depth without breaking the light theme |
| Apricot Whisper | `#fff4ec` | `--color-apricot-whisper` | Warm alternating section background, feature callout panels — breaks the cool palette rhythm on select bands to draw the eye |
| Ink | `#000000` | `--color-ink` | Primary text, hairline borders, icon strokes, logo mark |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text on cobalt fill, image backgrounds |
| Cool Tint | `#edf9f5` | `--color-cool-tint` | Faint greenish surface wash on alternating sections — the third surface layer, used sparingly for editorial band variation |
| Silver | `#c8c7cd` | `--color-silver` | Muted borders, dividers, secondary icon strokes — lifts above pure white for subtle separation without darkening the page |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Gopher Medium — Display and heading typeface. The signature choice — a geometric sans with editorial weight, set tight at line-height 1.0 so headlines stack into dense blocks. The 56px size is reserved for hero statements; 32px for section headings; 24px for sub-section headings. Substitute: 'Manrope' or 'Plus Jakarta Sans' (Google) for open-source parity, or 'GT America' for closer brand match. · `--font-gopher-medium`
- **Substitute:** Manrope
- **Weights:** 400, 500
- **Sizes:** 24px, 32px, 56px
- **Line height:** 1.00
- **Letter spacing:** normal
- **Role:** Display and heading typeface. The signature choice — a geometric sans with editorial weight, set tight at line-height 1.0 so headlines stack into dense blocks. The 56px size is reserved for hero statements; 32px for section headings; 24px for sub-section headings. Substitute: 'Manrope' or 'Plus Jakarta Sans' (Google) for open-source parity, or 'GT America' for closer brand match.

### Inter — Body and interface text. The utilitarian counterpart to Gopher — neutral, highly legible, used for paragraphs, descriptions, and UI labels. 16px is the default body size; 14px for secondary copy; 12px for fine print and metadata. · `--font-inter`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.20–1.60
- **Letter spacing:** normal
- **Role:** Body and interface text. The utilitarian counterpart to Gopher — neutral, highly legible, used for paragraphs, descriptions, and UI labels. 16px is the default body size; 14px for secondary copy; 12px for fine print and metadata.

### Inter — Bold emphasis on inline text and button labels — packed with weight to counter the whisper-light Gopher headlines, creating a light/bold contrast pair. · `--font-inter`
- **Substitute:** system-ui
- **Weights:** 700
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.14–1.60
- **Role:** Bold emphasis on inline text and button labels — packed with weight to counter the whisper-light Gopher headlines, creating a light/bold contrast pair.

### Inter — Small uppercase/tracked labels (eyebrows, badge text) at 12px with 0.083em letter-spacing — the only letter-spaced tier in the system, reserved for categorical tags above headings. · `--font-inter`
- **Substitute:** system-ui
- **Weights:** 600
- **Sizes:** 12px, 14px, 16px
- **Line height:** 2.00
- **Letter spacing:** 0.083em
- **Role:** Small uppercase/tracked labels (eyebrows, badge text) at 12px with 0.083em letter-spacing — the only letter-spaced tier in the system, reserved for categorical tags above headings.

### Inter-Bold — Inter-Bold — detected in extracted data but not described by AI · `--font-inter-bold`
- **Weights:** 700
- **Sizes:** 14px, 16px
- **Line height:** 1.14, 1.6
- **Role:** Inter-Bold — detected in extracted data but not described by AI

### Inter-SemiBold — Inter-SemiBold — detected in extracted data but not described by AI · `--font-inter-semibold`
- **Weights:** 600
- **Sizes:** 12px
- **Line height:** 2
- **Letter spacing:** 0.083
- **Role:** Inter-SemiBold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.6 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 24px | 1 | — | `--text-subheading` |
| heading-sm | 32px | 1 | — | `--text-heading-sm` |
| display | 56px | 1 | — | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 168 | 168px | `--spacing-168` |
| 184 | 184px | `--spacing-184` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| buttons | 6px |
| heroPanels | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Cobalt CTA Button
**Role:** Primary call-to-action

Filled cobalt (#1a5fff) button with white text, Inter 16px weight 700, 6px border-radius, padding 12px 24px. Used for 'Schedule Live Demo' and the schedule demo nav CTA.

### Ghost Outline Button
**Role:** Secondary CTA

Transparent background with 1px black border, black Inter 16px weight 700 text, 6px radius, 12px 24px padding. Used in nav for 'Schedule Demo' alternative entry points.

### Pill Nav Link
**Role:** Navigation item or tag

43px border-radius (effectively pill-shaped), thin border, small text padding 8px 16px, Inter weight 400. Used for outlined nav actions and tag-style links.

### Announcement Bar
**Role:** Top-of-page promo strip

Full-width cobalt (#1a5fff) band, 4px+ padding vertical, white Inter 14px text centered, often paired with a small white pill CTA (white bg, cobalt text, 43px radius).

### Product Image Card
**Role:** Swag/product visual tile

Rounded rectangle (12px radius) with white or light gray background, containing product photography of swag items (hats, stickers, packaging). Used in the hero image grid and catalog previews.

### Floating Testimonial Card
**Role:** Social proof overlay

White card with 12px radius, 16px padding, subtle shadow, containing avatar (32px circle), Inter 14px body text in black, Inter 12px weight 600 uppercase name, and a brand link in cobalt. Overlays a large hero image.

### Feature Callout Panel
**Role:** Highlighting a product capability

Rounded 12px panel, warm apricot (#fff4ec) or cool cobalt (#ecf2ff) background, containing Gopher 24px subheading, Inter 14px body, and optional illustration. Padding 24px.

### Blue Feature Section
**Role:** Full-bleed cobalt section

Full-width cobalt (#1a5fff) background band, often paired with white line-art illustration (e.g., globe) and white text. Used to break the white-on-white rhythm mid-page.

### Trust Logo Strip
**Role:** Social proof row

Centered horizontal row of 6–8 brand logos (Stellar, Stripe, Beehiv, Google, Adobe, etc.) in black, evenly spaced with ~40px gaps, separated from preceding section by a small Gopher 16px caption line.

### Hairline Divider
**Role:** Section separator

1px solid #000000 line used to separate trust logos from content blocks. No fill, no shadow — just a thread-thin structural mark.

## Do's and Don'ts

### Do
- Use Gopher Medium at 56px/1.0 for hero headlines; stack multi-line copy tightly with no extra leading.
- Use #1a5fff only for the filled CTA, announcement bar, and full-bleed feature sections — never as a text color on white.
- Set all cards, image tiles, and product visuals to 12px border-radius; reserve 24px for hero-scale panels and 6px for buttons.
- Use the eyebrow pattern: Inter 12px weight 600 with 0.083em tracking above Gopher subheadings to label sections.
- Keep body text at Inter 16px weight 400 with #000000; the system reads at 21:1 contrast — do not soften to gray below #4a4a4a.
- Alternate surface layers with #ecf2ff, #fff4ec, and #edf9f5 on different sections to create editorial band variation without introducing new hues.
- Use Inter weight 700 inline for emphasis — the light/bold contrast with Gopher weight 400 headings is a signature rhythm.

### Don't
- Don't introduce additional brand colors — the system is monochrome + one cobalt. Any second saturated hue breaks the editorial discipline.
- Don't set Gopher headings with generous line-height; the 1.0 tightness is the signature, not a bug.
- Don't use the cobalt for body text links on white — use #000000 with underline, or a Ghost Outline button for the action.
- Don't apply shadows to cards or product tiles; the system uses hairline borders and surface tints for separation, not elevation.
- Don't round buttons to match cards (12px) — the 6px button radius is sharper than its containers, creating intentional visual hierarchy.
- Don't add gradients — the system is intentionally flat; the closest thing to color depth is a full-bleed cobalt band.
- Don't set headlines in Inter; Gopher is the display voice and the contrast with Inter body is what makes the type system recognizable.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Primary page canvas |
| 1 | Cool Tint | `#edf9f5` | Faint alternating section wash |
| 2 | Apricot Whisper | `#fff4ec` | Warm feature callout band |
| 3 | Cobalt Mist | `#ecf2ff` | Tinted card surface and soft hover |
| 4 | Cobalt Command | `#1a5fff` | Full-bleed feature section, announcement bar |

## Elevation

The system intentionally avoids drop shadows. Depth is created through surface color shifts (white → #ecf2ff → #1a5fff) and hairline 1px borders rather than shadow elevation. The one exception is the floating testimonial card, which uses a faint shadow to separate it from the underlying hero image.

## Imagery

Product photography is the dominant visual element — tightly cropped swag items (baseball caps, stickers, notebooks, packaging) on pure white backgrounds, presented as a grid of 12px-radius tiles. No lifestyle or staged photography. The images feel catalog-like: each object is isolated, well-lit, and treated as a product specimen. Line-art illustrations (white globe on cobalt) appear sparingly as decorative section anchors. The hero image grid is asymmetric and offset, creating a curated shelf aesthetic rather than a uniform gallery.

## Layout

Max-width 1200px centered content, full-bleed announcement bar and section bands. The hero is a 2-column split: left-aligned Gopher headline and Inter body with the cobalt CTA, right side a staggered 3×3-ish image grid of product tiles. Below the hero sits a centered trust logo strip, then alternating white/tinted/cobalt full-bleed sections. Feature callouts use a 2-column layout (text panel left, illustration right) with 24px-radius cards. Section gaps are ~80px; the overall rhythm is spacious and editorial rather than dense.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000
- Background: #ffffff
- Border: #000000 (1px hairlines)
- Accent surface: #ecf2ff
- primary action: #1a5fff (filled action)

**Example Component Prompts**

1. **Hero Section**: White (#ffffff) background. Headline at 56px Gopher Medium weight 400, #000000, line-height 1.0. Body text at 16px Inter weight 400, #000000. Cobalt CTA button: #1a5fff background, white text, Inter 16px weight 700, 6px radius, 12px 24px padding. Right side: 3-column grid of product image tiles, each with #ffffff background, 12px radius.

2. **Floating Testimonial Card**: White (#ffffff) card with 12px radius, 16px padding, faint shadow. 32px circular avatar at top, Inter 14px body text in #000000, Inter 12px weight 600 name label, and 'Stellar' link in #1a5fff. Positioned overlapping a large hero image.

3. **Cobalt Feature Band**: Full-width #1a5fff background, 80px vertical padding. White line-art globe illustration on the right. Left: Gopher 32px subheading in white, Inter 16px body in white.

4. **Feature Callout Card**: 12px radius, #fff4ec background, 24px padding. Gopher 24px subheading in #000000, Inter 14px body in #000000, 16px gap between elements.

5. **Announcement Bar**: Full-width #1a5fff band, centered white Inter 14px text 'Check out our newest lookbook' with a small white pill CTA (43px radius, 8px 16px padding, #1a5fff text).

## Similar Brands

- **Stellar (Stellar Development Foundation)** — Shares the same cobalt-blue-as-only-accent strategy and the light, editorial product-catalog aesthetic with product photography on white.
- **Linear** — Same hairline-border + monochrome-canvas approach with one saturated action color; similar restraint in letting product UI breathe.
- **Beehiv** — Comfortable B2B SaaS rhythm, sparse hero layouts, and single-accent color systems that read as editorial rather than corporate.
- **Framer** — Bold display headlines at 1.0 line-height paired with quiet Inter body, large product imagery, and generous section gaps.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cobalt-command: #1a5fff;
  --color-cobalt-mist: #ecf2ff;
  --color-apricot-whisper: #fff4ec;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-cool-tint: #edf9f5;
  --color-silver: #c8c7cd;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gopher-medium: 'Gopher Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-bold: 'Inter-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-semibold: 'Inter-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.6;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --text-display: 56px;
  --leading-display: 1;

  /* Typography — Weights */
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
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-168: 168px;
  --spacing-184: 184px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 43px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-buttons: 6px;
  --radius-heropanels: 24px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-cool-tint: #edf9f5;
  --surface-apricot-whisper: #fff4ec;
  --surface-cobalt-mist: #ecf2ff;
  --surface-cobalt-command: #1a5fff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cobalt-command: #1a5fff;
  --color-cobalt-mist: #ecf2ff;
  --color-apricot-whisper: #fff4ec;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-cool-tint: #edf9f5;
  --color-silver: #c8c7cd;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gopher-medium: 'Gopher Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-bold: 'Inter-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-semibold: 'Inter-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.6;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --text-display: 56px;
  --leading-display: 1;

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
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-168: 168px;
  --spacing-184: 184px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 43px;
}
```
