# WHOOP — Style Reference
> Performance laboratory at midnight — clinical white lab benches beneath a black theatrical void, one violet pulse of electricity.

**Theme:** mixed

WHOOP operates on a high-contrast split-canvas system: full-bleed black theatrical heroes alternate with clinical white content sections, creating a rhythm that mimics the alternation between effort and recovery. Typography is the dominant voice — oversized Proxima Nova display type at 120px with aggressive negative tracking carries the brand, while body copy stays compact and neutral. A single vivid violet (#4a53ff) acts as the lone chromatic accent against an otherwise achromatic palette, appearing only on primary actions and the announcement bar. Components are large, confident, and rounded: 24px-radius cards, fully pill-shaped buttons, and photographic overlays with heavy text treatment replace the typical SaaS card grid. The result feels less like a product page and more like a premium performance lab at night — scientific, dramatic, and focused on data over decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pulse Violet | `#4a53ff` | `--color-pulse-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Obsidian | `#000000` | `--color-obsidian` | Primary text on light surfaces, dark hero/section backgrounds, filled neutral buttons, icon strokes |
| Carbon | `#191919` | `--color-carbon` | Secondary dark surface (footer band, alternating black sections), heading text on light surfaces |
| Paper White | `#ffffff` | `--color-paper-white` | Primary page canvas, card surfaces on dark sections, text on dark backgrounds, filled white pill buttons |
| Lab Mist | `#f3f5f9` | `--color-lab-mist` | Soft elevated surface for light cards and feature panels — a cool off-white that distinguishes cards from the page without using shadow |
| Hairline | `#e5e7eb` | `--color-hairline` | Borders, dividers, outlined button strokes, input frames — the most-used neutral in the system (2560 occurrences) |
| Fog Gray | `#808080` | `--color-fog-gray` | Muted body text, secondary descriptions, placeholder copy on light surfaces |
| Ash | `#999999` | `--color-ash` | Tertiary text, inactive button labels, disabled icon strokes — sits one step below Fog Gray for de-emphasized metadata |

## Tokens — Typography

### Proxima Nova — Single-family system covering everything from 14px captions to 120px display headlines. The aggressive letter-spacing compression at display sizes (-4.8px at 120px) is signature — it makes oversized headlines feel carved rather than stacked. Proxima Nova's geometric warmth keeps the clinical data aesthetic from feeling cold. · `--font-proxima-nova`
- **Substitute:** Montserrat, Nunito Sans, or DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 15, 16, 19, 20, 24, 32, 35, 50, 120
- **Line height:** 0.71 (120px) → 0.80 (50px) → 1.00 (35px) → 1.09 (32px) → 1.13 (24px) → 1.29–1.30 (20–19px) → 1.33 (16px) → 1.50 (15px) → 1.59 (14px)
- **Letter spacing:** Negative tracking tightens with size: 0.1em on 15px uppercase nav, 0 on body (14–16px), -0.03em at 19–24px (-0.48 to -0.72px), -0.04em at 32–120px (-1.05 to -4.8px)
- **Role:** Single-family system covering everything from 14px captions to 120px display headlines. The aggressive letter-spacing compression at display sizes (-4.8px at 120px) is signature — it makes oversized headlines feel carved rather than stacked. Proxima Nova's geometric warmth keeps the clinical data aesthetic from feeling cold.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.59 | — | `--text-caption` |
| body-sm | 16px | 1.33 | -0.48px | `--text-body-sm` |
| body-lg | 20px | 1.29 | -0.6px | `--text-body-lg` |
| subheading | 24px | 1.13 | -0.72px | `--text-subheading` |
| heading-sm | 32px | 1.09 | -0.96px | `--text-heading-sm` |
| heading | 35px | 1 | -1.05px | `--text-heading` |
| heading-lg | 50px | 0.8 | -2px | `--text-heading-lg` |
| display | 120px | 0.71 | -4.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 33 | 33px | `--spacing-33` |
| 36 | 36px | `--spacing-36` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 92 | 92px | `--spacing-92` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| pills | 300px |
| images | 24px |
| buttons | 300px |
| mediumRounded | 30px |
| smallElements | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(199, 199, 199, 0.25) 0px 4px 15px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 15-24px

## Components

### Announcement Bar
**Role:** Top-of-page thin promotional strip

Full-width, 40-48px tall, Pulse Violet (#4a53ff) background, white Proxima Nova 14px text centered, with an underlined white text link aligned right. Sits flush above the nav bar with no gap.

### Primary Navigation
**Role:** Top navigation bar on dark hero

Full-bleed black background, 80-100px tall. WHOOP wordmark left in white 24px weight 700. Nav links in white 15px weight 500 with 0.1em tracking, spaced ~32px apart. Right-aligned Pulse Violet pill button (#4a53ff, white text, 300px radius, 12px 24px padding).

### Full-Bleed Dark Hero
**Role:** Opening theatrical section

100% width, 100vh height, pure #000000 background. Display headline at 120px Proxima Nova weight 400, white, line-height 0.71, letter-spacing -4.8px, occupying 2 lines and left-aligned with ~8% page padding. Subtext at 19px weight 400, white or Fog Gray, max-width 520px. White pill CTA centered below (300px radius, 16px 32px padding, black 15px weight 600 uppercase text with 0.1em tracking).

### Pulse Violet Pill Button
**Role:** Primary brand action

#4a53ff background, white text, 300px border-radius, 12px 24px padding, Proxima Nova 15px weight 600 uppercase with 0.1em letter-spacing. Used in nav and promotional contexts. No shadow.

### White Pill Button
**Role:** Secondary action on dark backgrounds

White (#ffffff) background, black (#000000) text, 300px border-radius, 16px 32px padding, 15px weight 600 uppercase with 0.1em tracking. Centered in hero sections and dark bands.

### Outlined Pill Button
**Role:** Tertiary action on light surfaces

Transparent background, 1.5px Hairline (#e5e7eb) border, black text, 300px border-radius, 12px 28px padding, 14px weight 500. Used in feature cards for trial and secondary offers.

### Lab Mist Feature Card
**Role:** Inline promotional card on light sections

Lab Mist (#f3f5f9) background, 24px border-radius, no shadow, 24px padding. Contains a 24px-radius square image left (~200×140px), bold heading and body text middle, outlined pill button right. Total height ~200px, full content-width.

### Carousel Story Card
**Role:** Full-bleed photographic feature card

Tall card (aspect ratio ~3:4 or 4:5), photographic background filling the entire card, 24px border-radius. Overlay heading top-left at 24px weight 600, white. Small white circular expand button (40px, 1px white border) bottom-right. Pagination dots centered below carousel.

### Dark CTA Band
**Role:** Closing full-bleed black section

Full-width #000000 background, 400-600px height, large display heading in white (50px weight 400, -2px tracking), centered or left-aligned with generous padding (80-120px vertical).

### Membership Pricing Card
**Role:** Tier comparison card

White background, 24px border-radius, 1px Hairline (#e5e7eb) border, 32px padding. Black tier name at 24px weight 700, price at 50px weight 400 with -2px tracking, feature list at 16px with 15px row gap. Pulse Violet pill button at bottom for selected tier.

### Metric Overlay Stat
**Role:** Data point on photographic backgrounds

Small white number (32px weight 400) with thin white label (12px weight 500, 0.1em tracking, uppercase). Used as floating data callouts over carousel images — e.g. '98%' '82%' on a forest scene, '45.8%' inside a green radial glow.

## Do's and Don'ts

### Do
- Use 300px border-radius for every button — pill shape is non-negotiable, even on small utility buttons
- Set display headlines at 120px with line-height 0.71 and letter-spacing -4.8px; this tight tracking is the brand's visual signature
- Alternate full-bleed black sections with full-bleed white sections at 80-120px gaps; never blend the two with a gray transition
- Use #4a53ff exclusively for primary actions and the announcement bar — no other element should carry chromatic color
- Render cards at 24px radius with no drop shadow; elevation comes from #f3f5f9 fills, not blur
- Apply 0.1em letter-spacing with uppercase to all 14-15px labels in nav, buttons, and metric captions
- Keep body text at 19-20px with -0.57 to -0.6px tracking; anything smaller loses the brand's confident scale

### Don't
- Don't add drop shadows to cards or buttons — WHOOP uses flat color elevation only; the single rgba(199,199,199,0.25) shadow is reserved for floating overlays
- Don't introduce a second accent color — the system is monochromatic + one violet, anything else breaks the lab aesthetic
- Don't use line-height above 1.0 on display sizes (50px+) — the tight 0.71-0.80 ratio is what makes headlines feel carved
- Don't center body paragraphs — text in feature cards and descriptions left-aligns with max-width 520px
- Don't use square or 8px-radius buttons — every action is a pill, including icon buttons and tags
- Don't place colored gradients on UI surfaces; the three detected gradients are decorative background washes only, not component fills
- Don't set body text below 16px — 14px is reserved for uppercase labels with tracking, never running prose

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default light section background |
| 1 | Lab Mist Card | `#f3f5f9` | Elevated feature card on light sections — flat elevation via color, not shadow |
| 2 | Dark Section | `#000000` | Full-bleed theatrical hero and closing CTA band |
| 3 | Carbon Band | `#191919` | Secondary dark surface for transitional bands between black and white |

## Imagery

Photography is the dominant visual asset: tight, full-bleed lifestyle crops of athletes and bodies in motion — swimming, running, sleeping on textured bedding. Images are warm-toned and natural-light, never staged studio shots. Treatment is raw: no duotone, no color grading overlays, no masks. They sit inside 24px-radius carousel cards with white text overlaid directly on the photo (no scrim). UI graphics are minimal — small white circular expand buttons, thin pagination dots, and one green radial-glow metric on the longevity card. No illustrations, no 3D renders, no abstract graphics. Icons (where present) are thin-stroke monoline, white on dark, black on light.

## Layout

Page model alternates between full-bleed edge-to-edge sections (no max-width constraint on the outer container) and a 1200px max-width content well for text and card grids. Hero is a full-viewport black theater with a 120px display headline left-aligned in the first 60% of the screen. Below the hero, content sections stack as white bands containing a single max-width column or a 3-up carousel of photographic cards. Closing section returns to full-bleed black. Navigation is a fixed top bar on the dark hero only; content sections rely on the page scrolling naturally without sticky chrome. Card grids use 3 equal columns with 24px gutters. Density is comfortable: 80-120px between sections, 15-24px between elements. No sidebar, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (light surfaces) / #ffffff (dark surfaces)
- background: #ffffff (light sections) / #000000 (dark sections)
- card surface: #f3f5f9
- border: #e5e7eb
- muted text: #808080 / #999999
- accent: #4a53ff (brand action, announcement bar)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Build a full-bleed dark hero: #000000 background, 100vh. Headline at 120px Proxima Nova weight 400, #ffffff, line-height 0.71, letter-spacing -4.8px, left-aligned with 8% page padding. Subtext at 19px weight 400, #808080, max-width 520px. White pill button centered below: #ffffff background, #000000 text, 300px radius, 16px 32px padding, 15px weight 600 uppercase with 0.1em tracking.

2. Build a Lab Mist feature card: #f3f5f9 background, 24px radius, 24px padding, full content-width. 200×140px image left at 24px radius. Bold heading 24px weight 700, #000000. Body 16px weight 400, #808080. Outlined pill button right: transparent fill, 1.5px #e5e7eb border, 300px radius, 12px 28px padding, 14px weight 500 black text.

3. Build a carousel story card: photographic background filling the entire card, 24px radius, aspect ratio 3:4. White heading 24px weight 600 top-left with 24px padding. Small white circular button 40px diameter, 1px white border, positioned bottom-right at 16px offset.

4. Build a Pulse Violet pill action button: #4a53ff background, #ffffff text, 300px radius, 12px 24px padding, Proxima Nova 15px weight 600 uppercase with 0.1em letter-spacing. No shadow, no border.

5. Build a metric overlay stat: white number at 32px weight 400, white uppercase label at 12px weight 500 with 0.1em letter-spacing, positioned over a photographic background. Example: '45.8' with 'STRESS' below.

## Elevation Philosophy

WHOOP avoids drop shadows almost entirely. The single detected shadow (rgba(199,199,199,0.25) 0px 4px 15px 0px) is used sparingly on floating overlays only. Elevation is communicated through flat color contrast: Lab Mist (#f3f5f9) cards sit on Paper White (#ffffff) canvases; black sections sit on white sections; the Pulse Violet button sits on black. This keeps the system feeling clinical and flat — closer to print editorial than interactive app.

## Similar Brands

- **Oura** — Same split-canvas black/white alternation, oversized display headlines with tight tracking, and single-accent restrained palette in the health-wearable space
- **Peloton** — Full-bleed photographic hero cards with 24px radius, pill-shaped CTAs, and a dark theatrical opening that transitions to white content sections
- **Garmin** — Performance-data aesthetic with uppercase tracking labels, flat card elevation, and Proxima-Nova-adjacent geometric sans typography
- **Notion** — Minimalist monochrome palette with a single violet brand accent, tight letter-spacing on large headlines, and pill-shaped primary buttons
- **Whoop Coach / Apple Fitness+** — Athletic-performance category peers using photographic carousel cards as the primary content unit with direct text overlay

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pulse-violet: #4a53ff;
  --color-obsidian: #000000;
  --color-carbon: #191919;
  --color-paper-white: #ffffff;
  --color-lab-mist: #f3f5f9;
  --color-hairline: #e5e7eb;
  --color-fog-gray: #808080;
  --color-ash: #999999;

  /* Typography — Font Families */
  --font-proxima-nova: 'Proxima Nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.59;
  --text-body-sm: 16px;
  --leading-body-sm: 1.33;
  --tracking-body-sm: -0.48px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.29;
  --tracking-body-lg: -0.6px;
  --text-subheading: 24px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.09;
  --tracking-heading-sm: -0.96px;
  --text-heading: 35px;
  --leading-heading: 1;
  --tracking-heading: -1.05px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -2px;
  --text-display: 120px;
  --leading-display: 0.71;
  --tracking-display: -4.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-92: 92px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-32px;
  --element-gap: 15-24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 60px;
  --radius-full-2: 300px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-pills: 300px;
  --radius-images: 24px;
  --radius-buttons: 300px;
  --radius-mediumrounded: 30px;
  --radius-smallelements: 8px;

  /* Shadows */
  --shadow-md: rgba(199, 199, 199, 0.25) 0px 4px 15px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-lab-mist-card: #f3f5f9;
  --surface-dark-section: #000000;
  --surface-carbon-band: #191919;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pulse-violet: #4a53ff;
  --color-obsidian: #000000;
  --color-carbon: #191919;
  --color-paper-white: #ffffff;
  --color-lab-mist: #f3f5f9;
  --color-hairline: #e5e7eb;
  --color-fog-gray: #808080;
  --color-ash: #999999;

  /* Typography */
  --font-proxima-nova: 'Proxima Nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.59;
  --text-body-sm: 16px;
  --leading-body-sm: 1.33;
  --tracking-body-sm: -0.48px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.29;
  --tracking-body-lg: -0.6px;
  --text-subheading: 24px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.09;
  --tracking-heading-sm: -0.96px;
  --text-heading: 35px;
  --leading-heading: 1;
  --tracking-heading: -1.05px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -2px;
  --text-display: 120px;
  --leading-display: 0.71;
  --tracking-display: -4.8px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-92: 92px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 60px;
  --radius-full-2: 300px;

  /* Shadows */
  --shadow-md: rgba(199, 199, 199, 0.25) 0px 4px 15px 0px;
}
```
