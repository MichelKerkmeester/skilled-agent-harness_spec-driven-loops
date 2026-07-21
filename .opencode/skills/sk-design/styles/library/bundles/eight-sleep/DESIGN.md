# Eight Sleep — Style Reference
> midnight observatory with single neon pulse

**Theme:** mixed

Eight Sleep communicates through nocturnal luxury: a stark dark hero stage gives way to warm off-white surfaces and one electric blue accent that functions like a pulse of light in a quiet room. Typography carries the entire brand voice — NeueMontreal at weight 300 at near-display sizes creates whispered authority, with letter-spacing tightening as scale grows. The palette is almost deliberately starved of color: pure black, warm cream (#f9f8f7) instead of clinical white, and a single vivid blue that earns attention by being absent everywhere else. Components are flat and architectural — pill buttons, 12px cards, hairline borders, and a single whisper-soft shadow. Visual rhythm alternates between full-bleed dark bands and light editorial sections, creating a sleep-cycle cadence across the page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Headlines, body text, full-bleed dark hero stage, nav text on light surfaces — the structural anchor of the system |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Warm Cream | `#f9f8f7` | `--color-warm-cream` | Hero panels, soft section backgrounds, card surfaces on light pages — replaces clinical white with a linen warmth |
| Mist Gray | `#f1f2f4` | `--color-mist-gray` | Nested card containers, subtle elevated surfaces, input field backgrounds |
| Stone | `#8e8d92` | `--color-stone` | Muted helper text, secondary icon strokes, inactive button labels |
| Graphite | `#696765` | `--color-graphite` | Secondary body text, card subtext, dimmed nav items |
| Ash | `#a0a0a0` | `--color-ash` | Disabled button borders and text, tertiary iconography |
| Smoke | `#363636` | `--color-smoke` | Dark surface text, footer text, secondary dark-mode body copy |
| Fog Border | `#ececec` | `--color-fog-border` | Hairline dividers, selected option backgrounds in dropdowns |
| Steel Border | `#2e2e2e` | `--color-steel-border` | Card borders on dark sections, divider lines in dark hero areas |
| Pulse Blue | `#4158ee` | `--color-pulse-blue` | Links, selected/active states, quiz option highlights, focus rings — the only chromatic accent, used sparingly as functional punctuation |
| Midnight Blue | `#3f5975` | `--color-midnight-blue` | Secondary dark accent for hover states and subtle blue-tinted borders on dark sections |

## Tokens — Typography

### NeueMontreal — Single typeface powers the entire system. Weight 300 at 56–115px for hero display creates whispered authority — an anti-convention choice that earns scale through restraint rather than volume. Weight 400 handles body, 500 for subheadings, 700 reserved for micro-labels and nav. Line-height collapses to 0.94 at 115px display, opening to 1.5–1.7 at body sizes. · `--font-neuemontreal`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 10px, 12px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 28px, 36px, 44px, 56px, 64px, 115px
- **Line height:** 0.94–1.92 (tightest at display scale)
- **Letter spacing:** -0.020em at 115px, tightening to -0.009em at 56px, 0.001em at body, opening to 0.125em+ for uppercase labels and nav
- **OpenType features:** `"ss01" on, "tnum" on, "ss03" on`
- **Role:** Single typeface powers the entire system. Weight 300 at 56–115px for hero display creates whispered authority — an anti-convention choice that earns scale through restraint rather than volume. Weight 400 handles body, 500 for subheadings, 700 reserved for micro-labels and nav. Line-height collapses to 0.94 at 115px display, opening to 1.5–1.7 at body sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label | 10px | 12 | 1.25px | `--text-label` |
| caption | 12px | 16 | 0.05px | `--text-caption` |
| body-sm | 14px | 22 | — | `--text-body-sm` |
| body | 16px | 24 | — | `--text-body` |
| body-lg | 18px | 28 | — | `--text-body-lg` |
| subheading | 28px | 36 | -0.28px | `--text-subheading` |
| heading-sm | 44px | 48 | -0.66px | `--text-heading-sm` |
| heading | 56px | 56 | -0.96px | `--text-heading` |
| heading-lg | 64px | 64 | -1.28px | `--text-heading-lg` |
| display | 115px | 108 | -2.3px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 92 | 92px | `--spacing-92` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| images | 8px |
| inputs | 8px |
| buttons | 9999px |
| containers | 20px |
| smallElements | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.05) 2px 2px 12px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 16-20px

## Components

### Dark Hero Section
**Role:** Full-bleed opening stage

Full-bleed #000000 background extending edge-to-edge. Display headline at 64–115px in NeueMontreal weight 300, #ffffff, line-height 0.94, letter-spacing -0.020em. Supporting body at 18px weight 400, #8e8d92 or #ffffff at 80% opacity. Radial gradient overlay (rgb(241,243,254) → rgb(27,38,59) → rgb(9,11,18)) for depth on product imagery. Generous vertical padding of 120–160px top and bottom.

### Top Announcement Bar
**Role:** Promotional strip above nav

Slim full-bleed bar, 36–40px height, #1a2433 background (very dark blue-tinted). Text in 12px NeueMontreal weight 500, #ffffff, letter-spacing 0.125em, uppercase. Centered layout with optional arrow link on the right.

### Primary Navigation
**Role:** Sticky top header

Light background #ffffff or transparent over dark hero. Logo centered (Eight Sleep wordmark). Nav links at 14px weight 500, #000000, letter-spacing 0.009em. Right cluster: user icon link, pill CTA button. Height 64–72px. Hairline 1px #ececec bottom border when scrolled.

### Pill CTA Button (Light)
**Role:** Primary action button on dark backgrounds

Background #ffffff, text #000000, border-radius 9999px, padding 14px 28px. Font: NeueMontreal 15px weight 500, letter-spacing 0.009em. No border, no shadow. Hover: background #f9f8f7 with 200ms transition.

### Pill CTA Button (Dark)
**Role:** Primary action on light backgrounds

Background #000000, text #ffffff, border-radius 9999px, padding 14px 28px. Hover: background #363636. Used for 'Compra el Pod' and similar conversion actions.

### Ghost Link Button
**Role:** Tertiary text action

No background, no border. Text in 14px NeueMontreal weight 500, #000000, underline on hover or with a right-arrow icon. Letter-spacing 0.009em. Used for 'Conoce el Pod' secondary CTAs.

### Region Selector Modal
**Role:** Language/region picker overlay

Centered card, ~560px wide, #ffffff background, 12px border-radius, box-shadow rgba(0,0,0,0.05) 2px 2px 12px. Header row with title 18px weight 500 and close icon. Two-column grid of region options at 16px weight 400, each with a 20px flag icon, country name, and em-dash language label. Selected row gets #f1f2f4 background and a #4158ee checkmark on the right.

### Quiz/Onboarding Panel
**Role:** Lead-capture split panel

50/50 split layout: left side is full-bleed lifestyle photography (warm bedroom interior with natural light), right side is white #ffffff panel. Right panel contains: small uppercase label 10px weight 700 #4158ee with 0.125em tracking, headline 36–44px weight 300, question 18px weight 400, then 4 stacked option buttons. Each option: #f1f2f4 background, 8px radius, 16px 20px padding, 15px weight 500 text, full-width, with hover darkening to #ececec.

### Feature Card
**Role:** Product or benefit showcase card

#f9f8f7 or #ffffff background, 12px border-radius, 24–32px internal padding, 1px #ececec border. Optional 8px image radius at top. Title 22–28px weight 500, body 16px weight 400 #696765. No drop shadow by default; subtle shadow only on hover.

### Product Card (Dark)
**Role:** Hero product showcase on dark backgrounds

#1a1a1a or #000000 background, 20px border-radius, no border. Product image centered with generous padding. White text overlays. Optional radial gradient backdrop to add depth.

### Input Field
**Role:** Form input for email/capture

Background #f1f2f4 or transparent, 1px #ececec bottom border, no top/left/right borders. Text 16px weight 400, placeholder #a0a0a0, focused text #000000. Focus ring: 2px #4158ee outline with 2px offset. Padding 16px 0.

### Badge Tag
**Role:** Category or status label

Inline-flex, 4px 10px padding, 4px border-radius, #f1f2f4 background, #696765 text at 12px weight 500, letter-spacing 0.05em. No border. Used for product tags and feature labels.

### Footer
**Role:** Site footer with links and newsletter

#000000 background, #ffffff text. Three-to-four column grid with link lists at 14px weight 400 #8e8d92. Logo in white, social icons 20px, hairline #2e2e2 dividers. Newsletter input with white-on-transparent styling.

## Do's and Don'ts

### Do
- Use weight 300 for any headline above 44px — this whisper-weight is the brand's signature and separates Eight Sleep from every other tech site that defaults to bold
- Tighten letter-spacing to -0.020em at 115px display, opening to 0.125em only on uppercase 10–12px labels — tracking carries the voice
- Keep the palette monochromatic by default; introduce #4158ee only for links, focus rings, selected states, and quiz option highlights — never as a decorative fill
- Use #f9f8f7 warm cream as the default card and section surface instead of pure #ffffff to avoid clinical sterility
- Set all primary buttons to 9999px pill radius; never use rectangular buttons for conversion actions
- Alternate full-bleed dark (#000000) hero sections with light editorial bands to create the sleep-cycle page rhythm
- Use 12px radius for cards, 8px for images and inputs, 4px for small elements — the radius hierarchy is deliberate

### Don't
- Never set body or paragraph text above weight 400 — heavier weights kill the whispered-authority effect
- Don't apply #4158ee to large background fills, hero overlays, or decorative shapes — it loses its power when it covers more than ~5% of the visible area
- Avoid using box-shadows beyond rgba(0,0,0,0.05) 2px 2px 12px — anything heavier looks cheap against the flat dark hero treatment
- Don't use #000000 on #000000 in a contrast pair for body text — the hero already carries full black; always pair black text with warm cream or pure white
- Never set display headlines to weight 700 — the 300-weight display at 64–115px is non-negotiable brand signature
- Don't introduce additional accent colors (green, red, orange) even for status — Eight Sleep's restraint is the point; use opacity and weight variation instead
- Avoid borders thicker than 1px; the entire system runs on hairlines, not rules
- Don't use line-height above 1.7 for body text — the tight 1.2–1.5 line-height is part of the geometric precision

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background for light editorial sections |
| 1 | Warm Cream | `#f9f8f7` | Soft alternative surface for cards, hero panels, and body sections — avoids clinical white |
| 2 | Mist Gray | `#f1f2f4` | Subtle card and container background for nested content |
| 3 | Fog Border | `#ececec` | Hairline dividers and selected/hover container fills |
| 4 | Obsidian | `#000000` | Full-bleed dark hero stage and footer backgrounds |

## Elevation

- **Region Selector Modal:** `rgba(0, 0, 0, 0.05) 2px 2px 12px 0px`
- **Quiz Option Buttons (hover):** `rgba(0, 0, 0, 0.05) 2px 2px 12px 0px`
- **Product Card (elevated state):** `rgba(0, 0, 0, 0.08) 0px 8px 32px 0px`

## Imagery

Photography is editorial and aspirational, not product-spec: warm bedroom interiors with natural directional light, linen textures, hardwood nightstands, and lush greenery visible through windows. The product (the Pod) is always shown in situ — placed beside a bed in a real home, never on a white studio background. Lifestyle photography occupies roughly 40% of page real estate, concentrated in hero and split-panel layouts. No illustration or 3D rendering — the brand relies on the tactile reality of lived spaces. Flag icons in the region selector are flat, colorful, and unstyled — functional, not decorative.

## Layout

Full-bleed dark hero opens every page, followed by light editorial sections with max-width 1280px centered. Hero pattern is split or centered display headline over near-black background with radial gradient depth. Sections alternate between dark and light bands to create a sleep-wake rhythm. Content arrangement is predominantly centered stacks and 2-column text-plus-image alternations, occasionally breaking into 3-column feature grids. Navigation is a centered-logo top bar with left-aligned category links and right-aligned user + CTA cluster. Density is generous — 80–120px between major sections, with content breathing within a 1200–1280px max-width. Quiz and modal patterns use a 50/50 split with full-bleed photography on one side and a contained white form panel on the other.

## Agent Prompt Guide

Quick Color Reference:
- Background: #ffffff (canvas) / #f9f8f7 (warm cream surface) / #000000 (dark hero)
- Text: #000000 (primary) / #696765 (secondary) / #8e8d92 (muted/helper) / #ffffff (on dark)
- Border: #ececec (hairline) / #2e2e2e (dark mode divider)
- Accent: #4158ee (links, focus, selected states only)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a dark hero section: full-bleed #000000 background, 140px top/bottom padding. Headline at 96px NeueMontreal weight 300, #ffffff, letter-spacing -0.020em, line-height 0.94. Subtext at 18px weight 400, #8e8d92. Ghost link button with #ffffff text and underline.

2. Create a region selector modal: centered white card, 560px wide, 12px radius, shadow rgba(0,0,0,0.05) 2px 2px 12px. Title 18px weight 500 #000000, close icon top-right. Two-column grid of options, each 16px weight 400 with flag icon, em-dash separator, and language label. Selected option shows #f1f2f4 background and #4158ee checkmark.

3. Create a quiz split panel: 50/50 layout. Left half is a full-bleed warm bedroom photograph. Right half is #ffffff with 48px padding. Top label at 10px weight 700, #4158ee, uppercase, letter-spacing 0.125em. Headline at 36px weight 300, #000000. Question at 18px weight 400, #696765. Four stacked option buttons: #f1f2f4 background, 8px radius, 16px 20px padding, 15px weight 500 text, full-width, hover to #ececec.

4. Create a feature card: #f9f8f7 background, 12px border-radius, 32px padding, 1px #ececec border. Image at top with 8px radius. Title 28px weight 500, #000000. Body 16px weight 400, #696765, line-height 1.5.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Similar Brands

- **Apple** — Same whisper-weight display typography, full-bleed dark hero stages alternating with white editorial sections, and pill-shaped CTA buttons
- **Sonos** — Warm cream surfaces instead of clinical white, single accent color used sparingly, editorial product photography in domestic interiors
- **Oura** — Premium health-tech restraint — nearly monochromatic palette, massive light-weight headlines, and split-panel quiz/onboarding patterns
- **Dyson** — Dark hero sections with product-in-situ photography, generous vertical rhythm, and typographic confidence through weight contrast rather than color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-warm-cream: #f9f8f7;
  --color-mist-gray: #f1f2f4;
  --color-stone: #8e8d92;
  --color-graphite: #696765;
  --color-ash: #a0a0a0;
  --color-smoke: #363636;
  --color-fog-border: #ececec;
  --color-steel-border: #2e2e2e;
  --color-pulse-blue: #4158ee;
  --color-midnight-blue: #3f5975;

  /* Typography — Font Families */
  --font-neuemontreal: 'NeueMontreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 12;
  --tracking-label: 1.25px;
  --text-caption: 12px;
  --leading-caption: 16;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 22;
  --text-body: 16px;
  --leading-body: 24;
  --text-body-lg: 18px;
  --leading-body-lg: 28;
  --text-subheading: 28px;
  --leading-subheading: 36;
  --tracking-subheading: -0.28px;
  --text-heading-sm: 44px;
  --leading-heading-sm: 48;
  --tracking-heading-sm: -0.66px;
  --text-heading: 56px;
  --leading-heading: 56;
  --tracking-heading: -0.96px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 64;
  --tracking-heading-lg: -1.28px;
  --text-display: 115px;
  --leading-display: 108;
  --tracking-display: -2.3px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-92: 92px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-120px;
  --card-padding: 24-32px;
  --element-gap: 16-20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;
  --radius-containers: 20px;
  --radius-smallelements: 4px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 2px 2px 12px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-cream: #f9f8f7;
  --surface-mist-gray: #f1f2f4;
  --surface-fog-border: #ececec;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-warm-cream: #f9f8f7;
  --color-mist-gray: #f1f2f4;
  --color-stone: #8e8d92;
  --color-graphite: #696765;
  --color-ash: #a0a0a0;
  --color-smoke: #363636;
  --color-fog-border: #ececec;
  --color-steel-border: #2e2e2e;
  --color-pulse-blue: #4158ee;
  --color-midnight-blue: #3f5975;

  /* Typography */
  --font-neuemontreal: 'NeueMontreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 12;
  --tracking-label: 1.25px;
  --text-caption: 12px;
  --leading-caption: 16;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 22;
  --text-body: 16px;
  --leading-body: 24;
  --text-body-lg: 18px;
  --leading-body-lg: 28;
  --text-subheading: 28px;
  --leading-subheading: 36;
  --tracking-subheading: -0.28px;
  --text-heading-sm: 44px;
  --leading-heading-sm: 48;
  --tracking-heading-sm: -0.66px;
  --text-heading: 56px;
  --leading-heading: 56;
  --tracking-heading: -0.96px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 64;
  --tracking-heading-lg: -1.28px;
  --text-display: 115px;
  --leading-display: 108;
  --tracking-display: -2.3px;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-92: 92px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 2px 2px 12px 0px;
}
```
