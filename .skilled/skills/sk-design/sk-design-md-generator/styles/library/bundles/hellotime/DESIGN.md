# Hellotime — Style Reference
> monochrome editorial command center

**Theme:** light

Hellotime is a near-monochrome productivity surface: white canvas, near-black type, and one electric blue accent that appears almost exclusively as a gradient highlight on hero headlines and key words. The visual system relies on typographic weight contrast rather than color variety — massive 700-weight headlines (64–80px) sit beside compact 400–500 body text, creating a clear hierarchy without decorative noise. Surfaces are flat with hairline borders (1px, #c8cad0) and 16px radii; elevation is avoided in favor of crisp edges and generous whitespace. The dark filled button (#25272d) is the only chromatic UI element besides the green logo mark and blue gradient accent, making every action feel deliberate rather than decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#151619` | `--color-ink` | Primary text, icon strokes, hairline borders, footer text — the dominant non-background color in the system |
| Smoke | `#7f8491` | `--color-smoke` | Secondary/muted text, link text, subdued borders, placeholder labels — recedes so body copy reads first |
| Fog | `#c8cad0` | `--color-fog` | Card and component borders, subtle dividers, icon outlines at rest — the default hairline |
| Ash | `#e1e2e5` | `--color-ash` | Dividers between sections, secondary surface tint, input borders in resting state |
| Mist | `#f3f3f5` | `--color-mist` | Card surfaces, subtle elevated panels, button hover wash, input backgrounds |
| Paper | `#ffffff` | `--color-paper` | Page canvas, nav background, inverted button text, heading reverse-color treatments |
| Charcoal | `#25272d` | `--color-charcoal` | Primary action button fill and border, nav top-strip emphasis — the only dark surface, reserved for CTAs |
| Graphite | `#363940` | `--color-graphite` | Nav link text color, slightly lifted from #151619 for a softer navigation feel |
| Pewter | `#b0b3bb` | `--color-pewter` | Outlined button border at rest, ghost control stroke |
| Signal Green | `#059669` | `--color-signal-green` | Brand logo accent stroke, brand identity marker — vivid green checkmark against monochrome |
| Electric Blue | `linear-gradient(90deg, #0560fd 0%, #3a8dff 50%, #c3d9ff 100%)` | `--color-electric-blue` | Brand accent — the gradient highlight on hero keywords; also product UI project bars and chart accents |

## Tokens — Typography

### SF Pro Display — Headlines and display — used at 80px/700 for the hero, 48–64px/600–700 for section titles, 24–40px/500–600 for subheadings. Weight 700 at extreme size is the signature: massive bold sans against empty white space carries all the visual weight that color would on other sites. · `--font-sf-pro-display`
- **Substitute:** Inter (free, closest match in weight range and grotesque geometry)
- **Weights:** 500, 600, 700
- **Sizes:** 24px, 40px, 48px, 64px, 80px
- **Line height:** 0.90, 1.00, 1.33, 1.50
- **Role:** Headlines and display — used at 80px/700 for the hero, 48–64px/600–700 for section titles, 24–40px/500–600 for subheadings. Weight 700 at extreme size is the signature: massive bold sans against empty white space carries all the visual weight that color would on other sites.

### SF Pro Text — Body, UI labels, buttons, nav links, card content, form fields — the workhorse at 16px/400 for paragraphs, 14px/500 for metadata and labels, 18–20px/600 for emphasized body. The 1.5 line-height at 16px is the default rhythm; tighter 1.2 only appears on compact UI rows. · `--font-sf-pro-text`
- **Substitute:** Inter (free substitute covering the full weight range with matching x-height)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14px, 16px, 18px, 20px
- **Line height:** 0.80, 1.00, 1.14, 1.20, 1.33, 1.50, 1.60
- **Role:** Body, UI labels, buttons, nav links, card content, form fields — the workhorse at 16px/400 for paragraphs, 14px/500 for metadata and labels, 18–20px/600 for emphasized body. The 1.5 line-height at 16px is the default rhythm; tighter 1.2 only appears on compact UI rows.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.6 | — | `--text-subheading` |
| heading-sm | 20px | 1.33 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.14 | -0.4px | `--text-heading-lg` |
| heading-xl | 48px | 1.14 | -0.8px | `--text-heading-xl` |
| display | 64px | 1 | -1.2px | `--text-display` |
| display-lg | 80px | 1 | -1.6px | `--text-display-lg` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 9999px |
| cards | 16px |
| inputs | 12px |
| buttons | 8px |
| timeline-bars | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 32px
- **Element gap:** 16-24px

## Components

### Top Navigation Bar
**Role:** Site-wide navigation

White background, 8px vertical padding, 1px Fog (#c8cad0) bottom border. Left: logo mark + wordmark in #151619 at 18px/600. Center: 4 nav links in #363940 at 14px/500 with 32px column gap. Right: ghost outlined 'Request access' button (Pewter border, 8px radius, 16px horizontal padding). Sticky on scroll.

### Primary CTA Button (Filled)
**Role:** Hero and section-level conversion action

Charcoal (#25272d) background, Paper (#ffffff) text at 14px/600, 8px border radius, 10px vertical × 20px horizontal padding. No shadow. Hover lifts to pure #151619. Used for the hero 'Request access' and any full-prominence conversion point.

### Ghost/Outlined Button
**Role:** Secondary action in nav or inline contexts

Transparent background, Pewter (#b0b3bb) 1px border, Ink (#151619) text at 14px/500, 8px radius, 10px × 20px padding. Hover fills Mist (#f3f3f5). Used for nav-level CTAs and lower-priority actions.

### Hero Gradient Highlight Text
**Role:** Inline keyword emphasis in headlines

Text filled with the Electric Blue gradient (linear-gradient 90deg, #0560fd → #3a8dff → #c3d9ff), displayed at 80px/700 with -1.6px letter-spacing. Gradient runs left-to-right so the keyword visually 'lights up' against the solid Ink (#151619) surrounding text. Reserved for 1–2 words per hero.

### Hero Section
**Role:** First-fold conversion block

Centered column on white canvas, 64–80px top padding. Eyebrow: small pill link 'A different kind of pricing →' with 1px Ink border, 9999px radius, 12px/500. Headline: 80px/700, centered, -1.6px tracking, with one gradient-highlighted phrase. Subtext: 18px/400 in Smoke (#7f8491), max-width ~640px. CTA: filled dark button centered below.

### Product Screenshot Frame
**Role:** Inline product proof below the hero

Full-width product capture on white canvas with no frame, no shadow, no border — the screenshot bleeds edge-to-edge within the 1200px page max-width. The product UI itself contains the only colorful elements on the page (timeline bars in blue, green, orange, magenta, teal).

### Testimonial Card
**Role:** Social proof block in 2-column grid

White background, 1px Fog (#c8cad0) border, 16px border radius, 32px padding. Layout: small partner logo top-left at 20px height, then quote body at 16px/400 in Ink, attribution block at 14px/500 (name) + 14px/400 Smoke (role). 2-column grid with 24px gap, responsive to 1-column under 768px.

### Logo Strip
**Role:** Agency/partner credibility band

Centered single row, grayscale wordmarks only (no color logos). 40px vertical section padding above and below. No card background — logos float on white with generous letter-spacing between them. Section caption 'Used by the most innovative agencies worldwide' at 14px/500 Smoke above the row.

### Timeline / Gantt Bar
**Role:** Project assignment visualization in product UI

Rounded rectangle, 4px radius, 24px height, solid fill per project (vivid hues: #0560fd blue, #059669 green, #f59e0b orange, #e11d48 magenta, #14b8a6 teal). White text at 12px/500 inset 8px from left. Bar is the sole carrier of color saturation in the product screenshot.

### Person Row Card
**Role:** Sidebar item in the product UI

Mist (#f3f3f5) background on the active row, transparent on rest, 8px horizontal padding, 4px vertical padding per row. Avatar circle 24×24, name at 14px/500 Ink, assigned project at 12px/400 Smoke.

### Pill Tag / Eyebrow Link
**Role:** Inline navigation or category label

9999px border radius, 1px Ink border, 12px vertical × 12px horizontal padding, 12px/500 Ink text, 4px gap before chevron/arrow. Appears above hero headlines as a contextual navigation cue.

### Dark Filled Card (Footer/CTA)
**Role:** High-emphasis dark section block

Charcoal (#25272d) background, Paper (#ffffff) text, 16px radius, 32px padding. Inverts the page's monochrome light system to draw the eye to a final conversion block.

## Do's and Don'ts

### Do
- Set body copy at 16px/400 with 1.5 line-height in Ink (#151619); use Smoke (#7f8491) for anything that is metadata, helper, or secondary
- Use 16px radius on all cards, sections, and image frames; use 8px radius on buttons, inputs, and nav elements
- Use the Electric Blue gradient only on inline keyword highlights inside headlines — never as a button fill, never as a large background
- Use Charcoal (#25272d) filled buttons as the single primary action per section; all other actions are ghost/outlined in Pewter
- Set headlines at 64–80px / weight 700 with letter-spacing between -1.2 and -1.6px; body stays 16px / weight 400 — the size gap is the hierarchy
- Maintain 64–80px vertical rhythm between sections and 32px padding inside cards
- Keep product UI timeline bars as the only source of saturated color in the page; everything else stays neutral

### Don't
- Do not use #0560fd or any blue tone as a flat button background, card fill, or large surface — the gradient highlight is the only sanctioned use of accent color
- Do not apply drop shadows, glows, or colored elevation to cards or buttons — this system is flat by design, hierarchy comes from borders and type weight
- Do not use multiple accent colors in a single section — the green logo and blue gradient are the only chromatic elements allowed outside the product screenshot
- Do not use rounded radii above 20px on any UI element — 16px is the ceiling for cards, everything tighter is 8–12px
- Do not center-align body paragraphs — center only headlines, CTAs, and short label text
- Do not use color for status or state — communicate state through weight, fill, or border changes (Mist wash, Charcoal fill, Pewter border)
- Do not introduce serif, display, or script faces; the system is grotesque-only and depends on weight contrast, not style contrast

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas, nav background, the base layer everything sits on |
| 1 | Mist | `#f3f3f5` | Card surfaces, sidebar rows, subtle wash for hovered/active items |
| 2 | Ash | `#e1e2e5` | Section dividers, input field backgrounds in resting state |
| 3 | Charcoal | `#25272d` | Inverse surface — primary action button and footer/CTA dark blocks |

## Imagery

Product screenshots dominate — full-bleed Gantt-style timeline captures at the top of the page, shown without frames or device chrome, so the interface is the hero. A single hand-drawn raccoon mascot illustration appears as a tonal break between the logo strip and the testimonial grid — line-art only, black ink on white, no color fills. Testimonial cards use partner wordmarks (grayscale) rather than portraits. No lifestyle photography, no abstract gradients, no 3D renders. The overall image diet is 'product-first, illustration-second, photography-absent.'

## Layout

Centered single-column hero on a 1200px max-width canvas with generous 64–80px vertical rhythm. Sections stack vertically with seamless white-to-white flow separated only by hairline borders or whitespace. Product screenshot sits full-bleed within the content max-width. Testimonial grid is a 2×2 (collapses to 1 column on mobile) with 24px gap. Logo strip is a single centered row. The layout never uses sidebars, never uses multi-column text, and never uses overlapping elements — everything stacks and breathes.

## Agent Prompt Guide

Quick Color Reference:
- text: #151619
- background: #ffffff
- card surface: #f3f3f5
- border: #c8cad0
- muted text: #7f8491
- primary action: #25272d (filled action)

Example Component Prompts:
1. Create a centered hero: white (#ffffff) background, eyebrow pill 'A different kind of pricing →' with 1px #151619 border, 9999px radius, 12px/500 text. Headline at 80px weight 700, #151619, letter-spacing -1.6px, with the phrase 'schedule teams' filled by a 90deg blue gradient (#0560fd → #3a8dff → #c3d9ff). Subtext 18px/400 in #7f8491, centered, max-width 640px. Filled dark button below: #25272d background, white text at 14px/600, 8px radius, 10px×20px padding.
2. Create a testimonial card: white background, 1px #c8cad0 border, 16px radius, 32px padding. Partner logo at 20px height top-left. Quote at 16px/400 in #151619. Name at 14px/500 in #151619, role at 14px/400 in #7f8491.
3. Create a top nav bar: white background, 8px vertical padding, 1px #c8cad0 bottom border. Left: logo + 'hellotime' wordmark at 18px/600 #151619. Center: 4 nav links at 14px/500 #363940, 32px column gap. Right: ghost button — transparent background, 1px #b0b3bb border, 8px radius, #151619 text.
4. Create a product timeline bar: solid #0560fd fill, 4px radius, 24px height, white text at 12px/500, 8px left inset. Sits inside a white canvas product screenshot with no frame or shadow.
5. Create a person sidebar row: transparent background (Mist #f3f3f5 on active), 24×24 avatar, name at 14px/500 #151619, project at 12px/400 #7f8491, 8px horizontal padding, 4px vertical padding.

## Elevation Philosophy

The system is deliberately shadowless. Card and section separation comes from 1px #c8cad0 borders and Mist (#f3f3f5) surface contrast against Paper (#ffffff) — not from box-shadow or blur. The only 'elevation' cue is the Charcoal (#25272d) filled button, which inverts the page's lightness rather than floating above it. This keeps the visual language flat, editorial, and print-like; drop shadows would feel like noise against the bold typographic hierarchy that already does the heavy lifting.

## Gradient System

A single gradient exists in the system: the Electric Blue text highlight (linear-gradient 90deg, #0560fd → #3a8dff → #c3d9ff). It is applied exclusively to inline keyword phrases within headlines, never to backgrounds, buttons, or large surfaces. The gradient runs left-to-right so the bright end aligns with the word's natural reading direction, creating a 'highlighted' effect similar to a marker pen stroke. This is the only place on the page where chromatic variation appears — treat it as punctuation, not decoration.

## Similar Brands

- **Linear** — Same near-monochrome light theme with massive bold sans-serif headlines and a single dark filled CTA as the only interactive emphasis
- **Vercel** — Identical approach: white canvas, minimal type-driven hierarchy, hairline borders on 16px-radius cards, and one accent moment per screen
- **Loom** — Large display headlines with inline accent treatment, centered single-column hero, flat cards with subtle borders and no shadows
- **Raycast** — Product-screenshot-first landing page where the app UI itself supplies all the color, leaving the marketing surface strictly neutral

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #151619;
  --color-smoke: #7f8491;
  --color-fog: #c8cad0;
  --color-ash: #e1e2e5;
  --color-mist: #f3f3f5;
  --color-paper: #ffffff;
  --color-charcoal: #25272d;
  --color-graphite: #363940;
  --color-pewter: #b0b3bb;
  --color-signal-green: #059669;
  --color-electric-blue: #0560fd;
  --gradient-electric-blue: linear-gradient(90deg, #0560fd 0%, #3a8dff 50%, #c3d9ff 100%);

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.4px;
  --text-heading-xl: 48px;
  --leading-heading-xl: 1.14;
  --tracking-heading-xl: -0.8px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.2px;
  --text-display-lg: 80px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-inputs: 12px;
  --radius-buttons: 8px;
  --radius-timeline-bars: 4px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-mist: #f3f3f5;
  --surface-ash: #e1e2e5;
  --surface-charcoal: #25272d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #151619;
  --color-smoke: #7f8491;
  --color-fog: #c8cad0;
  --color-ash: #e1e2e5;
  --color-mist: #f3f3f5;
  --color-paper: #ffffff;
  --color-charcoal: #25272d;
  --color-graphite: #363940;
  --color-pewter: #b0b3bb;
  --color-signal-green: #059669;
  --color-electric-blue: #0560fd;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.4px;
  --text-heading-xl: 48px;
  --leading-heading-xl: 1.14;
  --tracking-heading-xl: -0.8px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.2px;
  --text-display-lg: 80px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
}
```
