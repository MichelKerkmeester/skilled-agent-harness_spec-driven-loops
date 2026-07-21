# Heynds — Style Reference
> Ember on fresh snow. A single vivid orange flame burning against pristine white, radiating subtle warmth.

**Theme:** light

Heynds speaks in a high-contrast productivity language: a near-white canvas (#fffafa) lit by a single vivid orange ember (#f53900) that does all the work — CTAs, accent text, icons, decorative rays. Typography is modern and confident via Geist, with heavy display weights anchoring headlines and comfortable 16px reading sizes for body. The surface treatment stays almost flat: hairline #e5e5e5 dividers, tiny 4–8px corner radii, and one whisper-soft 0.05 shadow that barely registers. The single-color discipline means the orange reads as energy and urgency against the quiet monochrome chrome. Decorative radiating line patterns in faint orange wash warmth across hero and FAQ sections without breaking the clean surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#f53900` | `--color-ember-orange` | Primary brand accent — filled CTAs, outlined action borders, icon fills, decorative accents, sparkline highlights. The only chromatic color in the interface; its vividness against the achromatic canvas makes every action feel switched on |
| Peach Wash | `#ffe0d6` | `--color-peach-wash` | Soft tinted surface — pill-badge backgrounds, subtle highlight panels, secondary button fills where a quieter orange is needed |
| Snow Canvas | `#fffafa` | `--color-snow-canvas` | Primary page background and elevated surface — the base on which all other elements sit |
| Ink Black | `#040101` | `--color-ink-black` | Primary text color for headings, body, and nav. Used for icon strokes and form input values |
| Fog Gray | `#827e7e` | `--color-fog-gray` | Secondary and helper text — muted descriptions, captions, placeholder strings |
| Smoke Gray | `#4d4b4b` | `--color-smoke-gray` | Tertiary text — timestamps, micro-labels, fine print beneath primary content |
| Ash Border | `#e5e5e5` | `--color-ash-border` | Hairline dividers, card borders, FAQ separators, input field borders, icon outline strokes |
| Pebble Gray | `#c0bcbc` | `--color-pebble-gray` | Subtle alternating section backgrounds and disabled state fills |

## Tokens — Typography

### Geist — Universal type family — all headings, body, nav, buttons, cards, footer. The tight line-height (1.0–1.11) on display sizes and 700 weight creates a dense, confident display voice; 400 at 1.4 keeps body readable without feeling loose. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 20, 24, 32, 36, 40, 48, 64, 80
- **Line height:** 1.0, 1.11, 1.25, 1.33, 1.4
- **Role:** Universal type family — all headings, body, nav, buttons, cards, footer. The tight line-height (1.0–1.11) on display sizes and 700 weight creates a dense, confident display voice; 400 at 1.4 keeps body readable without feeling loose.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.33 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| heading-lg | 40px | 1.11 | — | `--text-heading-lg` |
| display | 64px | 1 | — | `--text-display` |

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
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 9999px |
| badges | 9999px |
| panels | 12px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 24px

## Components

### Primary CTA Button (filled)
**Role:** Main conversion action — purchase, sign up, primary download

Filled #f53900 background, #fffafa text, Geist 500 at 16px, 4px radius, 16px vertical × 24px horizontal padding, optional right-arrow icon. Sits at top-right of nav and as the hero's primary action.

### Secondary Ghost Button
**Role:** Secondary action — free trial, try without commitment

Transparent fill, 1px #f53900 border, #f53900 text, 4px radius, 16/24px padding, optional sparkle icon. Pairs directly with the primary filled button in the hero.

### Pill Announcement Badge
**Role:** Hero micro-eyebrow above main headline

#ffe0d6 background, #f53900 text, Geist 500 at 14px, 9999px radius, 8px vertical × 16px horizontal padding, leading sparkle/star icon in #f53900. Full-pill form with a small leading ornament.

### Hero Headline Stack
**Role:** Above-the-fold headline and subheadline

Two-line display: line 1 in #f53900 at 64–80px Geist 600, line 2 in #040101 at same size. Subheadline beneath in #040101 Geist 400 at 16–18px, max-width ~640px centered.

### Language Selector
**Role:** Locale switcher in top nav

Transparent fill, #040101 text, 14px Geist 500, trailing chevron-down icon, no border. Sits left of the primary CTA in the nav bar.

### Avatar Social Proof Stack
**Role:** Trust signal beneath hero CTAs

Row of 4–5 overlapping 32px circular user avatars, followed by a bold #040101 line ('+158 Professionals…') at 14px and a muted #827e7 subline at 14px. Centered, compact.

### Feature Card
**Role:** 3-column grid item under 'Instant AI' section

Transparent or #fffafa surface, no shadow, no border. Leading #f53900 icon (16–20px) inside a 9999px-radius tinted background, title in #f53900 Geist 500 at 16–18px, description in #040101 Geist 400 at 14–16px. Cards sit in a 3-column row with 24–32px gaps.

### Embedded Product Video
**Role:** Demonstration of the product in use

Wide 16:9 frame with subtle #e5e5e5 1px border, 8px radius, the 0.05/1px/2px shadow for separation. Shows a real person's face in picture-in-picture plus Mac app UI screenshot.

### FAQ Accordion Row
**Role:** Expandable question in the FAQ list

Full-width row, 1px #e5e5e5 bottom border, Geist 500 16–18px #040101 question text, trailing chevron icon that rotates on open. Generous vertical padding (~24–32px). No background fill.

### Availability Badge
**Role:** Platform availability indicator beneath social proof

Small Apple logo icon (16px) in #040101 above centered 'Available on:' label in #827e7 14px. Center-aligned, sits between social proof and the video.

### Section Headline with Accent Line
**Role:** Mid-page section header ('The Interface / Instant AI')

Two stacked lines centered: first in #040101 Geist 500 at 40–48px, second in #f53900 Geist 500 at 40–48px with a trailing sparkle icon. Subheadline beneath in #040101 16px.

### Decorative Radiating Line Pattern
**Role:** Background ornament in hero and FAQ

Thin #ffe0d6 or pale-orange lines radiating from a central point, filling the section background. Static, not animated. Adds subtle warmth without visual noise.

## Do's and Don'ts

### Do
- Use #f53900 Ember Orange only for the single primary CTA, outlined action borders, and icon accents — never as a surface fill for non-action content.
- Apply 4px radius to all buttons and form controls, 9999px to badges and icon containers, 8px to cards — do not mix these radius families.
- Use Geist 600–700 at 40–80px for display headlines, 1.0–1.11 line-height, centered above content.
- Separate content rows with 1px #e5e5e5 hairline borders instead of background color changes or heavy dividers.
- Use #ffe0d6 Peach Wash as a soft surface tint for badges, not for full sections or large containers.
- Keep all body text in #040101 Ink Black at 14–16px / 1.4 line-height; reserve #827e7 Fog Gray for helper and muted text only.
- Maintain 80–112px vertical gaps between major sections and 24px between elements within a section.

### Don't
- Don't introduce additional chromatic colors — the single-orange discipline is the brand's signature.
- Don't use large drop shadows, glowing effects, or 3D elevation on cards, buttons, or modals — the design stays flat.
- Don't use #fffafa Snow Canvas as a card surface when the page is already on Snow Canvas — go borderless or add a 1px #e5e5e5 hairline instead.
- Don't apply #f53900 to body paragraphs or long-form text — it should appear only on accent words, icons, and CTAs.
- Don't use sharp 0px corners — the smallest radius in this system is 4px, and most surface elements use 8px or 9999px.
- Don't place secondary text in #040101 when it could be #827e7 — reserve Ink Black for content that must be read first.
- Don't use gradients — the system is purely flat color with one shadow layer.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Snow Canvas | `#fffafa` | Base page background |
| 1 | Peach Wash | `#ffe0d6` | Tinted highlight surfaces, badge backgrounds |
| 2 | Pebble Gray | `#c0bcbc` | Subtle alternating section bands |

## Elevation

- **Floating Video Player Frame:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`

## Imagery

The site relies on a single embedded product video showing the Mac app in use, with a real presenter visible in picture-in-picture — this is the only photographic content. The rest of the visual language is iconography and ornament: small line-art icons (microphone, pen, sparkle) rendered in #f53900, and a decorative radiating-line pattern in faint orange that fills the hero and FAQ backgrounds. No illustration, no lifestyle photography, no abstract graphics. Visual density is low — large swaths of Snow Canvas dominate, and the orange accent plus the video do the heavy lifting.

## Layout

Centered, max-width ~1200px page container with generous breathing room. The hero is a centered text stack (eyebrow badge → two-tone display headline → subheadline → button pair → social proof → availability badge → embedded video), all vertically stacked and centered. The mid-page 'Instant AI' section uses a 3-column feature card grid with 24–32px gaps. The FAQ section is a single-column list of full-width accordion rows separated by hairline borders. Navigation is a single top bar: logo left, language selector + filled CTA right, 40px vertical padding. The overall rhythm is spacious — 80–112px between major sections, no alternating dark/light bands (the entire page stays on Snow Canvas with the peach radiating-line pattern as the only background variation).

## Agent Prompt Guide

**Quick Color Reference**
- text: #040101
- background: #fffafa
- border: #e5e5e5
- accent / brand: #f53900
- tinted surface: #ffe0d6
- muted text: #827e7e
- primary action: #f53900 (filled action)

**Example Component Prompts**

1. *Hero headline block:* Snow Canvas (#fffafa) background. Eyebrow pill badge at the top: #ffe0d6 fill, #f53900 text, Geist 500 14px, 9999px radius, 8px/16px padding, leading sparkle icon in #f53900. Main headline in two lines: line 1 in #f53900 Geist 600 64px line-height 1.0, line 2 in #040101 Geist 600 64px. Subheadline in #040101 Geist 400 16px, max-width 640px, centered.

2. Create a Primary Action Button: #f53900 background, #fffafa text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. *Feature card grid row:* 3-column grid, 24px gap. Each card is borderless on #fffafa. Leading icon in #f53900 inside a 9999px-radius #ffe0d6 circle (40px). Title in #f53900 Geist 500 18px. Description in #040101 Geist 400 16px line-height 1.4.

4. *FAQ accordion item:* Full-width row, 1px #e5e5e5 bottom border, 24px vertical padding. Question text in #040101 Geist 500 18px. Trailing chevron-down icon in #827e7e 20px that rotates 180° on open. No background fill change on open.

5. *Embedded product video frame:* 16:9 container, 8px radius, 1px #e5e5e5 border, subtle shadow `rgba(0,0,0,0.05) 0px 1px 2px 0px`. Contains video with picture-in-picture presenter overlay in the bottom-right.

## Similar Brands

- **Raycast** — Same single-accent (red/orange) against clean white, Geist-adjacent modern type, small 4–6px button radii, and flat-surface design language
- **Linear** — Identical discipline of one vivid accent color over achromatic surfaces, hairline borders, no drop shadows, and tight modern sans-serif display type
- **Wispr Flow** — Closest peer in the voice-to-text AI category — same warm-orange brand accent, similar clean product marketing layout, comparable video-led hero
- **Notion** — Snow-white canvas with a single warm accent reserved for active states and CTAs, calm flat cards, generous spacing
- **Arc Browser** — Bold display type, one signature chromatic accent, decorative background ornaments, and a flat playful product marketing aesthetic

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #f53900;
  --color-peach-wash: #ffe0d6;
  --color-snow-canvas: #fffafa;
  --color-ink-black: #040101;
  --color-fog-gray: #827e7e;
  --color-smoke-gray: #4d4b4b;
  --color-ash-border: #e5e5e5;
  --color-pebble-gray: #c0bcbc;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.11;
  --text-display: 64px;
  --leading-display: 1;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 9999px;
  --radius-badges: 9999px;
  --radius-panels: 12px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-snow-canvas: #fffafa;
  --surface-peach-wash: #ffe0d6;
  --surface-pebble-gray: #c0bcbc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #f53900;
  --color-peach-wash: #ffe0d6;
  --color-snow-canvas: #fffafa;
  --color-ink-black: #040101;
  --color-fog-gray: #827e7e;
  --color-smoke-gray: #4d4b4b;
  --color-ash-border: #e5e5e5;
  --color-pebble-gray: #c0bcbc;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.11;
  --text-display: 64px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
```
