# Zoox — Style Reference
> serene sage showroom. A pale mint gallery space where one vivid teal accent and one dark forest panel interrupt the quiet — spacious, premium, and forward-looking.

**Theme:** light

Zoox presents a serene, gallery-like interface where a soft sage canvas (#d3e4df) carries the entire experience, broken only by a single dark forest-green section that acts as a dramatic contrast moment. The typography system is built on two weights of a custom neo-grotesque family — a compact sans for UI and body, and a display cut for oversized headlines that stretch to 120px with near-zero letter-spacing. A single vivid teal (#64d5b3) punctuates the system: it is the only chromatic color used as a filled surface, appearing on CTA buttons and key accent zones. Everything else stays desaturated — grays, near-blacks, and that signature sage. Components feel weightless: cards use large 36px radii, shadows are nearly absent, and borders are hairline. The mood is calm futurism — a showroom, not a dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sage Canvas | `#d3e4df` | `--color-sage-canvas` | Page background, hero bands, section dividers — the dominant ambient color that gives the system its calming gallery atmosphere |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, image masks, icon fills, high-contrast text on dark sections |
| Mint Frost | `#edf4f2` | `--color-mint-frost` | Badge backgrounds, subtle highlight washes, secondary card surfaces — a quieter sibling of the sage canvas |
| Carbon | `#0d1212` | `--color-carbon` | Primary text, dark section backgrounds, heavy borders — the deepest near-black, slightly cooler than true black |
| Graphite | `#34484a` | `--color-graphite` | Navigation borders, secondary headings, muted icon strokes — a dark desaturated teal that bridges neutrals and the accent; Dark borders and separators for elevated surfaces and inverted UI. |
| Slate | `#565959` | `--color-slate` | Body text secondary level, list dividers, footers, muted borders |
| Fog | `#9aa3a5` | `--color-fog` | Tertiary text, placeholder labels, disabled icon strokes |
| Mist | `#7b8889` | `--color-mist` | Eyebrow text and label color, small caps headers |
| Vivid Teal | `#64d5b3` | `--color-vivid-teal` | Primary action button fills, accent surfaces, interactive highlights — the single chromatic color in the system, used sparingly to signal action |
| Eucalyptus | `#5b8279` | `--color-eucalyptus` | Gray outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### GT Standard S — Primary UI and body typeface — used for navigation, buttons, body copy, badges, inputs, and headings up to 50px. The 'kern' 0 feature setting deliberately disables kerning for a monospaced-mechanical feel. The 0.0500em tracking on 12-13px text gives small labels a spacious, typeset quality. · `--font-gt-standard-s`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 13, 14, 15, 16, 20, 23, 30, 40, 50
- **Line height:** 1.15, 1.20, 1.25, 1.30, 1.40, 1.50, 1.88
- **Letter spacing:** -0.002em to -0.001em on body, +0.010em on 14-16px labels, +0.050em on 12-13px micro-labels
- **OpenType features:** `"kern" 0`
- **Role:** Primary UI and body typeface — used for navigation, buttons, body copy, badges, inputs, and headings up to 50px. The 'kern' 0 feature setting deliberately disables kerning for a monospaced-mechanical feel. The 0.0500em tracking on 12-13px text gives small labels a spacious, typeset quality.

### GT Standard L — Display-only typeface reserved for hero headlines and large section titles. Used at a single weight (400) to keep the voice calm and confident — no bold shouting. The 120px size with normal letter-spacing creates wide, architectural headlines that sit centered on the sage canvas. · `--font-gt-standard-l`
- **Substitute:** GT Walsheim, Söhne Breit, or a wide neo-grotesque
- **Weights:** 400
- **Sizes:** 28, 36, 56, 120
- **Line height:** 1.10, 1.15, 1.20, 1.30
- **OpenType features:** `"kern" 0`
- **Role:** Display-only typeface reserved for hero headlines and large section titles. Used at a single weight (400) to keep the voice calm and confident — no bold shouting. The 120px size with normal letter-spacing creates wide, architectural headlines that sit centered on the sage canvas.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.6px | `--text-caption` |
| body-sm | 14px | 1.4 | 0.14px | `--text-body-sm` |
| body | 16px | 1.5 | 0.16px | `--text-body` |
| subheading | 20px | 1.3 | -0.02px | `--text-subheading` |
| heading-sm | 23px | 1.28 | -0.023px | `--text-heading-sm` |
| heading | 30px | 1.25 | -0.03px | `--text-heading` |
| heading-lg | 40px | 1.2 | -0.04px | `--text-heading-lg` |
| display-sm | 56px | 1.1 | — | `--text-display-sm` |
| display | 120px | 1.1 | — | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 36px |
| badges | 20px |
| inputs | 16px |
| buttons | 12px |
| nav-pill | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.2) 0px 0px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Sage Hero Section
**Role:** Full-bleed hero band on the sage canvas

Full-width #d3e4df background, no borders. Centered display headline at 56-120px in GT Standard L weight 400, color #0d1212. Subtext at 20px weight 400, color #565959. Generous vertical padding 80-120px top and bottom. Optional small Vivid Teal CTA button below the headline.

### Filled Teal CTA Button
**Role:** Primary action — only filled chromatic button in the system

Background #64d5b3, text #0d1212 (or #ffffff on dark), font GT Standard S 14-15px weight 500-600, padding 12px 24px, border-radius 12px. No border. The vivid teal against the sage canvas creates the system's single color moment of urgency.

### Ghost Navigation Button
**Role:** In-text or link-style action

No background, text in #34484a or #0d1212, underlined or chevron-suffixed, font 14px weight 500, padding 5px 10px. Used in navigation rows and inline links.

### Dark Pill CTA
**Role:** Secondary action button in the header

Dark background #0d1212 or #34484a, white text, font 14px weight 600, padding 10px 20px, border-radius 16px (pill). Sits in the top-right of the navigation bar.

### Image Card (Rounded)
**Role:** Photo or illustration container

Background #ffffff, border-radius 36px, overflow hidden. Image fills the card with no internal padding. Used for lifestyle photography and product shots. No shadow — the radius and white surface are the only definition.

### Eyebrow Label
**Role:** Small caps section pre-title

GT Standard S 12px weight 600, color #7b8889 (Mist), letter-spacing +0.05em, text-transform uppercase. Sits above headings as a quiet categorical tag.

### Mint Badge
**Role:** Status or category tag

Background #edf4f2, text #0d1212, font 12-13px weight 500, padding 5px 12px, border-radius 20px. No border. Sits inline with text or floats above cards.

### Cookie Consent Dialog
**Role:** Fixed-bottom privacy notice

White card #ffffff, border-radius 16px, box-shadow rgba(0,0,0,0.2) 0px 0px 4px 0px, padding 24px. Title 'Privacy Policy' in 16px weight 600. Body in 13px #565959. Primary action: Vivid Teal filled button at full width with radius 12px, 12px vertical padding.

### Navigation Bar
**Role:** Top-level site navigation

Transparent or sage background, horizontally centered logo (Zoox stacked letter mark), nav links in GT Standard S 13-14px weight 500 in #0d1212, letter-spacing +0.01em. Links separated by 24-32px gaps. Dark Pill CTA pinned to the right. No bottom border on the sage canvas.

### Dark Forest Feature Section
**Role:** Dramatic contrast section

Full-bleed background #34484a (Deep Forest), white text #ffffff, generous padding 80-120px vertical. Centered display headline in GT Standard L 56px weight 400. Contains white image cards with 36px radius floating on the dark surface. The single chromatic departure from the sage/white/carbon palette.

### Play/Pause Toggle Button
**Role:** Media control

Small 40x40px circular button, background #0d1212, white icon, no label. Used for video autoplay toggles overlaid on hero media.

### Text Input Field
**Role:** Form input

Border 1px #717f80 or #767676, border-radius 16px, padding 12px 16px, font 14px weight 400 #0d1212, placeholder #9aa3a5. No background fill — transparent on the sage canvas.

### Footer Link List
**Role:** Sitemap or secondary navigation

Vertical list of links, each separated by 1px #565959 hairline border, font 14px weight 400 #565959, line-height 1.88 (generous). No bullet markers.

## Do's and Don'ts

### Do
- Use #d3e4df (Sage Canvas) as the dominant page background across all full-bleed sections
- Reserve #64d5b3 (Vivid Teal) exclusively for filled CTA buttons and single accent surfaces — never as text color or decorative fill
- Set display headlines at 56px or 120px in GT Standard L weight 400 only — never bold, never at intermediate sizes
- Apply 36px border-radius to all image cards and feature containers
- Use 1px #565959 or #34484a hairline borders for separators and card edges, never thick rules
- Set font-feature-settings to "kern" 0 on all GT Standard text to maintain the mechanical spacing identity
- Space sections with 80-120px vertical padding to preserve the gallery-like breathing room

### Don't
- Do not introduce additional chromatic colors — the system is sage, white, carbon, and one teal accent
- Do not use bold weights for display headlines — GT Standard L is always weight 400
- Do not apply box-shadow to cards, buttons, or navigation — the system relies on radius and borders
- Do not use #34484a (Deep Forest) as a text color or border on light backgrounds — it is reserved for the dark section background
- Do not set body text below 13px or use letter-spacing tighter than -0.002em on UI text
- Do not use the Vivid Teal on text — it is a surface color only, paired with #0d1212 or #ffffff text
- Do not break the section rhythm with narrow max-width containers — let the sage canvas flow full-bleed

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sage Canvas | `#d3e4df` | Base page background, hero sections, full-bleed bands |
| 1 | Pure White | `#ffffff` | Card surfaces, image containers, contrast panels |
| 2 | Mint Frost | `#edf4f2` | Badge fills, subtle elevated chips, tinted overlays |
| 3 | Deep Forest | `#34484a` | Dark feature section background, dramatic contrast moment |

## Elevation

- **Cookie consent dialog:** `rgba(0, 0, 0, 0.2) 0px 0px 4px 0px`

## Imagery

Imagery is primarily high-quality lifestyle and product photography: candid interior shots of passengers in the robotaxi, exterior three-quarter vehicle angles against urban skylines, and environmental scenes with neon and warm street lighting. Photos are always contained within white cards with 36px border-radius, never full-bleed. Treatment is naturalistic with warm cinematic color grading — no duotone, no heavy filters. The product (the vehicle) is the hero; people appear in context, not as staged portraits. There are no illustrations, no 3D renders, and no abstract graphics on the main pages. The conic gradient (teal-violet-blue) appears only as a subtle brand mark or loading element, not as page decoration. Icons are minimal, outlined, and monochrome in #0d1212 or white on dark.

## Layout

The page follows a single full-bleed rhythm: each section is edge-to-edge with no side margins, and the sage canvas (#d3e4df) flows continuously between sections. The hero is a centered text-only composition — no hero image, just a large display headline over the sage background. Below the hero, a split layout appears: image card on the left (rounded white, 36px), eyebrow + heading + body text on the right. The page then transitions to a full-bleed dark forest (#34484a) section with centered display text and two side-by-side image cards floating on the dark surface. Navigation is a minimal top bar with centered logo and right-aligned dark pill CTA. Content density is spacious — sections are separated by 80-120px of breathing room. The grid is a simple two-column or single-column centered stack; no multi-column card grids or complex masonry.

## Agent Prompt Guide

## Quick Color Reference
- Canvas: #d3e4df
- Card/surface: #ffffff
- Badge: #edf4f2
- Primary text: #0d1212
- Secondary text: #565959
- Accent surface (dark section): #34484a
- primary action: #64d5b3 (filled action)

## Example Component Prompts
1. **Sage Hero Section**: Full-bleed #d3e4df background, 120px top/bottom padding. Centered headline 'Ready, set, Zoox!' at 120px GT Standard L weight 400, color #0d1212. Small eyebrow 'TAKE YOUR FIRST RIDE' at 12px weight 600, color #7b8889, letter-spacing 0.6px, uppercase.
2. Create a Primary Action Button: #64d5b3 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
3. **Image Card**: White #ffffff background, border-radius 36px, overflow hidden, no shadow. Contains a 4:3 photograph of the robotaxi. No internal padding around the image.
4. **Dark Forest Feature Section**: Full-bleed background #34484a, padding 80px top/bottom. Centered headline at 56px GT Standard L weight 400, color #ffffff. Two white image cards with 36px radius positioned side by side, each containing a lifestyle photo.
5. **Mint Badge**: Background #edf4f2, text 'NEW' at 12px weight 600, color #0d1212, padding 5px 12px, border-radius 20px, no border. Font-feature-settings: "kern" 0.

## Gradient System

The conic gradient (rgb(52, 255, 197) → rgb(199, 198, 255) → rgb(167, 207, 255) → transparent) is a signature brand mark used only in the Zoox logo treatment and select loading or brand-accent moments. It should not be applied to buttons, cards, or page backgrounds. The system's primary gradient is between the sage canvas and the dark forest panel — achieved through a hard color break, not a CSS gradient.

## Similar Brands

- **Waymo** — Same spacious gallery layout with single full-bleed sections, centered display headlines, and large-radius image cards on neutral backgrounds
- **Rivian** — Same premium automotive calm aesthetic with sage/muted color palettes, oversized display type, and minimal UI chrome
- **Arc Browser** — Same minimal top-nav with centered logo, single accent color, and gallery-like breathing room between content bands
- **Aston Martin** — Same neo-grotesque display type at oversized weights, generous whitespace, and sage/desaturated luxury palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sage-canvas: #d3e4df;
  --color-pure-white: #ffffff;
  --color-mint-frost: #edf4f2;
  --color-carbon: #0d1212;
  --color-graphite: #34484a;
  --color-slate: #565959;
  --color-fog: #9aa3a5;
  --color-mist: #7b8889;
  --color-vivid-teal: #64d5b3;
  --color-eucalyptus: #5b8279;

  /* Typography — Font Families */
  --font-gt-standard-s: 'GT Standard S', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-standard-l: 'GT Standard L', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.28;
  --tracking-heading-sm: -0.023px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.03px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.04px;
  --text-display-sm: 56px;
  --leading-display-sm: 1.1;
  --text-display: 120px;
  --leading-display: 1.1;

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
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;

  /* Named Radii */
  --radius-cards: 36px;
  --radius-badges: 20px;
  --radius-inputs: 16px;
  --radius-buttons: 12px;
  --radius-nav-pill: 16px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 0px 4px 0px;

  /* Surfaces */
  --surface-sage-canvas: #d3e4df;
  --surface-pure-white: #ffffff;
  --surface-mint-frost: #edf4f2;
  --surface-deep-forest: #34484a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sage-canvas: #d3e4df;
  --color-pure-white: #ffffff;
  --color-mint-frost: #edf4f2;
  --color-carbon: #0d1212;
  --color-graphite: #34484a;
  --color-slate: #565959;
  --color-fog: #9aa3a5;
  --color-mist: #7b8889;
  --color-vivid-teal: #64d5b3;
  --color-eucalyptus: #5b8279;

  /* Typography */
  --font-gt-standard-s: 'GT Standard S', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-standard-l: 'GT Standard L', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.28;
  --tracking-heading-sm: -0.023px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.03px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.04px;
  --text-display-sm: 56px;
  --leading-display-sm: 1.1;
  --text-display: 120px;
  --leading-display: 1.1;

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
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 0px 4px 0px;
}
```
