# Arcade — Style Reference
> Electric blue ripple on white paper. A clean editorial canvas where a single vivid blue flows like liquid from corner to corner, making every interactive element feel switched on.

**Theme:** light

Arcade's visual system is a white-canvas product surface accented by one saturated electric-blue (#2142e7) and a signature flowing blue gradient that anchors the hero. Typography is Inter across all sizes, with weight concentrated in the 400–700 band and tight negative tracking on display sizes that tightens the type optically as it scales. The interface reads as functional and quiet: gray-on-white content blocks, thin borders, compact 12–16px radii, and cool-tinted shadows built on rgba(17,24,39,...) that keep every elevated surface feeling on-brand. Color is rationed — one blue does the work of accent, CTA, and focus — while everything else is a neutral ramp. Density is comfortable but not airy: 8px and 12px gaps dominate micro-spacing, 32–48px separates sections.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Blue | `#2142e7` | `--color-voltage-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Voltage | `#182fa5` | `--color-deep-voltage` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Midnight Ink | `#111827` | `--color-midnight-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Slate 600 | `#4b5563` | `--color-slate-600` | Body text, nav links, icon fills, card secondary copy — the dominant text color across the page |
| Slate 700 | `#374151` | `--color-slate-700` | Nav link hover, emphasized body text, secondary headings |
| Slate 500 | `#70747d` | `--color-slate-500` | Muted helper text, placeholder copy, low-emphasis labels |
| Graphite | `#414652` | `--color-graphite` | Subheadings and section titles that sit between body and display weight |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, button text, input fields, nav bar background — the primary elevated surface |
| Fog 50 | `#f9fafb` | `--color-fog-50` | Page canvas, section backgrounds, the base layer everything sits on |
| Fog 100 | `#f3f4f6` | `--color-fog-100` | Alternate section background, subtle hover fills, tag backgrounds |
| Mist 200 | `#e5e7eb` | `--color-mist-200` | Hairline borders, input borders, card outlines, divider lines |
| Smoke 300 | `#d9dadc` | `--color-smoke-300` | Stronger borders, checkbox frames, visible structural edges |

## Tokens — Typography

### Inter — Sole typeface across the system. Display sizes (36–64px) use weight 700 with -0.020 to -0.025em tracking to optically tighten the geometric letterforms. Body and UI sizes (14–18px) sit at weight 400–500 with near-normal tracking. Weight 600 is reserved for section titles, weight 700 for the hero headline. The consistent geometric skeleton means no font-mood shift between headline and body — the system speaks in one voice at every size. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 28px, 30px, 36px, 40px, 48px, 64px
- **Line height:** 1.22–1.71
- **Letter spacing:** -0.025em at 64px, -0.020em at 48px, -0.015em at 30px, -0.010em at 24px, -0.007em at 20px, normal below 20px
- **OpenType features:** `'cv11', 'ss01' on (Inter stylistic alternates for cleaner geometric terminals)`
- **Role:** Sole typeface across the system. Display sizes (36–64px) use weight 700 with -0.020 to -0.025em tracking to optically tighten the geometric letterforms. Body and UI sizes (14–18px) sit at weight 400–500 with near-normal tracking. Weight 600 is reserved for section titles, weight 700 for the hero headline. The consistent geometric skeleton means no font-mood shift between headline and body — the system speaks in one voice at every size.

### Balig Script — Balig Script — detected in extracted data but not described by AI · `--font-balig-script`
- **Weights:** 400
- **Sizes:** 40px
- **Line height:** 1
- **Role:** Balig Script — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 18px | 1.5 | -0.126px | `--text-subheading` |
| heading-sm | 20px | 1.4 | -0.14px | `--text-heading-sm` |
| heading | 24px | 1.33 | -0.24px | `--text-heading` |
| heading-lg | 30px | 1.29 | -0.45px | `--text-heading-lg` |
| display | 48px | 1.14 | -0.96px | `--text-display` |
| display-lg | 64px | 1.06 | -1.6px | `--text-display-lg` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 108 | 108px | `--spacing-108` |
| 112 | 112px | `--spacing-112` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 12px |
| cards | 16px |
| pills | 9999px |
| inputs | 16px |
| buttons | 12px |
| hero-frame | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(17, 24, 39, 0.2) 0px 8px 8px 0px, rgba(17, 24, 39, 0...` | `--shadow-sm` |
| subtle | `rgba(17, 24, 39, 0.12) 0px 0px 0px 1px, rgba(17, 24, 39, ...` | `--shadow-subtle` |
| xl | `rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgba(17, 24, 39...` | `--shadow-xl` |
| subtle-2 | `rgba(17, 24, 39, 0.12) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| xl-2 | `rgba(17, 24, 39, 0.05) 0px 32px 32px 0px, rgba(17, 24, 39...` | `--shadow-xl-2` |
| xl-3 | `rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgba(17, 24, 39...` | `--shadow-xl-3` |
| subtle-3 | `rgba(17, 24, 39, 0.1) 0px 0px 0px 1px, rgba(17, 24, 39, 0...` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Filled brand action — the system's main conversion trigger

Background #2142e7 (Voltage Blue), white text at 16px weight 600, 12px radius, horizontal padding 20px, vertical padding 10px. Six-layer soft shadow stack tinted with rgba(17,24,39,0.04) plus a 1px #182fa5 (Deep Voltage) inset ring that deepens the edge. The stacked low-opacity shadows create a diffused halo rather than a hard drop, making the button feel lit from within.

### Ghost Button
**Role:** Secondary action paired beside a primary CTA

White background, #111827 text at 16px weight 600, 12px radius, 20px/10px padding. Same six-layer shadow stack as the primary but with a 1px rgba(17,24,39,0.16) border ring instead of a chromatic inset. Creates parity with the primary button's elevation without competing for attention.

### Pill Tab
**Role:** Section switcher for grouped content

Active state: white background, #111827 text weight 600, 12px radius, 16px/10px padding, soft shadow ring. Inactive: transparent background, #4b5563 text weight 500, no shadow. The active tab visually lifts off the tab strip through shadow rather than color fill, keeping the group's overall tone neutral.

### URL Input with Submit Arrow
**Role:** Hero capture field — URL entry with integrated action

White background, 16px radius, full-width with max ~480px. Placeholder text in #70747d at 16px weight 400. 1px #e5e7eb border with no visible focus ring (the circular blue submit button inside acts as the focal point). Trailing circular #2142e7 submit button, 40px diameter, white arrow icon centered.

### Toggle Button Group
**Role:** Binary mode switcher (e.g., Demo vs Video)

Two adjacent pill buttons inside a #f3f4f6 track with 8px radius. Active button: white background, #111827 text, subtle shadow. Inactive: transparent, #4b5563 text. Each pill 14px weight 500 with a small leading icon. The track itself is rounded and unbordered — the group reads as one segmented control.

### Feature Checkmark List
**Role:** Compact bullet list of capabilities in a feature panel

Two-column grid of items, 8px row gap, 12px column gap. Each item: small circular #e5e7eb checkmark badge (20px) with a blue check inside, followed by 16px weight 400 #4b5563 text. The check badge acts as a quiet brand-color moment within an otherwise gray list.

### Metric Badge
**Role:** Floating proof-point callout beside a feature panel

White card, 12px radius, 16px/12px padding, text 14px weight 500 #4b2563 with a small up-arrow icon. Elevated with the floating-card shadow stack. Sits offset to the right of a feature block, breaking the grid to draw the eye.

### Trust Logo Strip
**Role:** Customer logo band for social proof

Single horizontal row, white canvas, logos rendered in #70747d muted gray at uniform height (~24px). No borders, no background, generous 48px vertical padding. The desaturation of brand logos is deliberate — it removes visual noise and lets the page's own brand color dominate.

### Top Navigation Bar
**Role:** Persistent site navigation

White background, 64px height, 1200px max-width centered, subtle 1px #e5e7eb bottom border. Logo left at 24px height, nav links center-left in 16px weight 500 #4b5563 with dropdown chevrons, right cluster has a ghost 'Talk to sales' button and a filled blue 'Sign up for free' CTA. The nav is quiet — it carries no gradient or shadow, only a hairline.

### Announcement Banner
**Role:** Pill-shaped event promotion above the hero

Pill shape (9999px radius), white background, 1px #e5e7eb border, 16px/8px padding. Mixed-weight text: event name 14px weight 600 #111827, CTA link 14px weight 500 #2142e7 separated by a thin vertical divider. Floats above the hero with no shadow, anchored to the page top with 16px margin.

### Hero Gradient Banner
**Role:** Full-bleed brand color field behind the hero headline

Flowing blue gradient from near-white upper-left through saturated mid-tones to deep #2142e7 lower-right, filling the full viewport width and ~600px height. Contains a radial highlight zone in the center that keeps the headline legible while edges pool into brand color. The gradient is the system's signature — it is the only place in the page where large-scale color lives.

### Product Mockup Frame
**Role:** Browser-style frame wrapping an interactive demo screenshot

White surface, 16px radius, subtle floating-card shadow. Top bar mimics a browser chrome with a #f9f4f6 background, 3 small circular window dots, and tab labels at 12px weight 500 #4b5563. Content area is the screenshot. The frame sells the product as a captured artifact, not a live embed.

### Section Heading Block
**Role:** Centered title + subtitle above any content section

Display-size heading 36–48px weight 700 #111827 with -0.020em tracking, centered, max-width 720px. Subtitle below at 18px weight 400 #4b5563, line-height 1.56, also centered. 32px gap between heading and subtitle, 48–64px gap below the block before content begins.

### Section Content Card
**Role:** White panel that groups a feature column or testimonial

White background, 1px #e5e7eb border, 16px radius, 32px padding. No drop shadow beyond the hairline ring — elevation comes from the border and the contrast against the #f9fafb page background. Content inside uses the standard type scale, with the section title at 24px weight 700 and body at 16px weight 400 #4b5563.

## Do's and Don'ts

### Do
- Use #2142e7 (Voltage Blue) for exactly one element per viewport: a primary CTA, an active tab, or a focused input — never two blue fills competing at the same visual weight.
- Apply the hero gradient only to the top-of-page brand field; repeat it at smaller scale only for feature hero panels.
- Set display sizes (36–64px) at weight 700 with tracking between -0.020em and -0.025em to optically tighten the type.
- Use 12px radius for buttons and tabs, 16px radius for inputs and cards, 9999px for tags and announcement pills — do not mix these scales on the same component type.
- Build elevation with the six-layer rgba(17,24,39,0.04) shadow stack and a 1px border ring rather than a single hard drop shadow.
- Keep body text at #4b5563 on white — reserve #111827 for headings and dark surfaces to maintain the quiet-to-loud hierarchy.
- Anchor any dark surface (#111827) with a 92–102deg linear gradient toward rgba(30,43,72,0.9) to avoid flat black.

### Don't
- Do not introduce a second saturated color — the system is monochrome plus one blue; adding green, red, or orange breaks the ration.
- Do not use a 1px or 2px hard drop shadow on cards — the design's elevation language is the diffused multi-layer stack.
- Do not round buttons above 12px or below 8px — the 12px radius is the system's signature softness, not a pill and not a sharp square.
- Do not use weight 500 for headings or weight 400 for display — the type weight ladder must move in steps of two (400, 600, 700).
- Do not apply the hero gradient to navigation, cards, or body sections — it belongs only in full-bleed brand moments.
- Do not place white text on white at any opacity below 0.9 — the system's contrast pairs are all AAA and should stay that way.
- Do not use #e5e7eb as a fill for interactive elements — it is a border token only, not a surface.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f9fafb` | Base page background, section bands |
| 1 | Card Surface | `#ffffff` | Content cards, nav bar, elevated panels |
| 2 | Nested Surface | `#f3f4f6` | Tab bodies, input wells, tag backgrounds |
| 3 | Ink Surface | `#111827` | Dark CTA buttons, dark gradient anchors, inverted panels |

## Elevation

- **Primary CTA button:** `rgba(17, 24, 39, 0.04) 0px 2px 2px -1px, rgba(17, 24, 39, 0.04) 0px 4px 4px -2px, rgba(17, 24, 39, 0.04) 0px 8px 8px 0px, rgba(17, 24, 39, 0.04) 0px 16px 16px 0px, rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgb(24, 47, 165) 0px 0px 0px 1px`
- **Ghost/outlined button:** `rgba(17, 24, 39, 0.04) 0px 2px 2px -1px, rgba(17, 24, 39, 0.04) 0px 4px 4px -2px, rgba(17, 24, 39, 0.04) 0px 8px 8px 0px, rgba(17, 24, 39, 0.04) 0px 16px 16px 0px, rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgba(17, 24, 39, 0.16) 0px 0px 0px 1px`
- **Floating card / metric badge:** `rgba(17, 24, 39, 0.2) 0px 8px 8px 0px, rgba(17, 24, 39, 0.1) 0px 4px 4px 0px, rgba(17, 24, 39, 0.1) 0px 2px 2px 0px, rgba(17, 24, 39, 0.1) 0px 0px 0px 1px, inset rgba(255, 255, 255, 0.06) 0px 1px 0px 0px`
- **Content section card:** `rgba(17, 24, 39, 0.12) 0px 0px 0px 1px, rgba(17, 24, 39, 0.03) 0px 2px 2px -2px, rgba(17, 24, 39, 0.03) 0px 4px 4px 0px, rgba(17, 24, 39, 0.03) 0px 8px 8px 0px, rgba(17, 24, 39, 0.03) 0px 16px 16px 0px`

## Imagery

Imagery is product-centric: the screenshots show browser-framed product captures rendered inside realistic mockup frames with faux window chrome and tab bars. The hero features a flowing blue gradient field with no photography or illustration — color itself does the atmospheric work. Customer logos in the trust strip are desaturated to #70747d gray, removing brand noise so the page's own blue dominates. Icons are minimal line-style at ~16px stroke, appearing as check marks in feature lists, chevrons in nav, and arrow glyphs in CTAs. There is no lifestyle photography, no abstract 3D, and no decorative illustration — the visual language is pure UI artifact (screenshots, gradients, icons, type).

## Layout

Page model is max-width 1200px centered, full-bleed at the hero and footer. The hero is a full-viewport-width gradient band (~600px tall) with a centered headline, subtitle, toggle group, and URL input stacked vertically. Below the hero, sections alternate between white and #f9fafb bands, separated by 64px gaps. Content sections use a centered section heading block (max 720px) followed by either a single product mockup frame or a two-column layout (text-left / visual-right or text-left / checklist-right). Tab navigation sits centered between heading and content. The nav is a 64px sticky top bar with a single hairline border — no shadow, no background blur. Density is comfortable: cards breathe inside 32px padding, section gaps are 48–64px, and micro-spacing stays at 8/12/16px increments.

## Gradient System

Two gradient families. (1) The hero brand gradient: a flowing blue field from near-white center to #2142e7 edges, used only at full-bleed scale. (2) The dark surface gradient: linear 92–102deg from #111827 to rgba(30,43,72,0.9), used for dark CTA buttons, dark cards, and inverted sections. A third accent gradient (linear 90deg, #111827 → #2142e7 → #03b5ed → #111827) appears as a thin animated border on premium CTAs — the cyan #03b5ed stop is the only place this second blue appears, so it reads as a special-event highlight, not a system token.

## Agent Prompt Guide

## Quick Color Reference
- text (primary heading): #111827
- text (body): #4b5563
- background (canvas): #f9fafb
- background (card): #ffffff
- border: #e5e7eb
- accent: #2142e7
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero section**: Full-bleed flowing blue gradient (white center → #2142e7 edges), 600px height. Headline 48px Inter weight 700 #111827, tracking -0.96px, centered. Subtitle 18px Inter weight 400 #4b5563. Ghost toggle group with Demo/Video pills. URL input: white, 16px radius, placeholder #70747d, trailing circular #2142e7 submit button 40px diameter.

2. **Feature column card**: White surface, 1px #e5e7eb border, 16px radius, 32px padding. Section title 24px Inter weight 700 #111827. Body 16px Inter weight 400 #4b5563. Two-column checkmark grid: 20px circular #e5e7eb badge with blue check, 16px #4b5563 text, 8px row gap, 12px column gap.

3. **Tab switcher group**: 8px-radius #f3f4f6 track, 16px/10px pill padding. Active pill: white background, #111827 text weight 600, soft shadow ring. Inactive pill: transparent, #4b5563 text weight 500. 16px Inter throughout.

4. **Product mockup frame**: 16px radius white card, floating-card shadow stack (rgba(17,24,39,0.2) 0px 8px 8px + inner highlight). Top bar #f9f4f6 with 3 circular window dots (8px, gray). Tab labels 12px Inter weight 500 #4b5563. Content area: product screenshot or video frame.

5. **Navigation bar**: White background, 64px height, 1200px max-width centered, 1px #e5e7eb bottom border. Logo 24px left. Nav links 16px Inter weight 500 #4b5563 with dropdown chevrons. Right cluster: ghost 'Talk to sales' (white, 1px border, 12px radius) beside filled blue 'Sign up for free' (#2142e7, white text, 12px radius, six-layer shadow with #182fa5 inset ring).

## Similar Brands

- **Linear** — Same monochrome-plus-one-saturated-accent discipline and Inter-typeface system, though Linear's accent is purple and uses sharper radii
- **Vercel** — Inter-only typography, hairline borders, 12px button radius, and a single brand color carrying all interactive weight
- **Attio** — Comfortable white-canvas product surface with a single vivid accent, soft floating shadows, and tight tracking on display sizes
- **Loom** — Friendly SaaS with rounded inputs, gradient hero treatments, and a rationed color palette where one hue does all the interactive work
- **Pitch** — Clean editorial layout rhythm with centered section headings, alternating neutral bands, and Inter at restrained weights

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-blue: #2142e7;
  --color-deep-voltage: #182fa5;
  --color-midnight-ink: #111827;
  --color-slate-600: #4b5563;
  --color-slate-700: #374151;
  --color-slate-500: #70747d;
  --color-graphite: #414652;
  --color-paper-white: #ffffff;
  --color-fog-50: #f9fafb;
  --color-fog-100: #f3f4f6;
  --color-mist-200: #e5e7eb;
  --color-smoke-300: #d9dadc;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-balig-script: 'Balig Script', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.126px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.14px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.24px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.29;
  --tracking-heading-lg: -0.45px;
  --text-display: 48px;
  --leading-display: 1.14;
  --tracking-display: -0.96px;
  --text-display-lg: 64px;
  --leading-display-lg: 1.06;
  --tracking-display-lg: -1.6px;

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
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-108: 108px;
  --spacing-112: 112px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 72px;

  /* Named Radii */
  --radius-tabs: 12px;
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-inputs: 16px;
  --radius-buttons: 12px;
  --radius-hero-frame: 24px;

  /* Shadows */
  --shadow-sm: rgba(17, 24, 39, 0.2) 0px 8px 8px 0px, rgba(17, 24, 39, 0.1) 0px 4px 4px 0px, rgba(17, 24, 39, 0.1) 0px 2px 2px 0px, rgba(17, 24, 39, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.06) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.06) 0px 1px 0px 0px inset;
  --shadow-subtle: rgba(17, 24, 39, 0.12) 0px 0px 0px 1px, rgba(17, 24, 39, 0.03) 0px 2px 2px -2px, rgba(17, 24, 39, 0.03) 0px 4px 4px 0px, rgba(17, 24, 39, 0.03) 0px 8px 8px 0px, rgba(17, 24, 39, 0.03) 0px 16px 16px 0px;
  --shadow-xl: rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgba(17, 24, 39, 0.04) 0px 16px 16px 0px, rgba(17, 24, 39, 0.04) 0px 8px 8px 0px, rgba(17, 24, 39, 0.04) 0px 4px 4px -2px, rgba(17, 24, 39, 0.04) 0px 2px 2px -1px, rgba(17, 24, 39, 0.16) 0px 0px 0px 1px;
  --shadow-subtle-2: rgba(17, 24, 39, 0.12) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(17, 24, 39, 0.05) 0px 32px 32px 0px, rgba(17, 24, 39, 0.05) 0px 16px 16px 0px, rgba(17, 24, 39, 0.05) 0px 8px 8px 0px, rgba(17, 24, 39, 0.05) 0px 4px 4px 0px, rgba(17, 24, 39, 0.05) 0px 2px 2px -2px, rgba(17, 24, 39, 0.1) 0px 0px 0px 1px;
  --shadow-xl-3: rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgba(17, 24, 39, 0.04) 0px 16px 16px 0px, rgba(17, 24, 39, 0.04) 0px 8px 8px 0px, rgba(17, 24, 39, 0.04) 0px 4px 4px -2px, rgba(17, 24, 39, 0.04) 0px 2px 2px -1px, rgb(24, 47, 165) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(17, 24, 39, 0.1) 0px 0px 0px 1px, rgba(17, 24, 39, 0.04) 0px 1px 1px -0.5px, rgba(17, 24, 39, 0.04) 0px 3px 3px -1.5px, rgba(17, 24, 39, 0.04) 0px 6px 6px -3px, rgba(17, 24, 39, 0.04) 0px 12px 12px -6px, rgba(17, 24, 39, 0.04) 0px 24px 24px -12px;

  /* Surfaces */
  --surface-page-canvas: #f9fafb;
  --surface-card-surface: #ffffff;
  --surface-nested-surface: #f3f4f6;
  --surface-ink-surface: #111827;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-blue: #2142e7;
  --color-deep-voltage: #182fa5;
  --color-midnight-ink: #111827;
  --color-slate-600: #4b5563;
  --color-slate-700: #374151;
  --color-slate-500: #70747d;
  --color-graphite: #414652;
  --color-paper-white: #ffffff;
  --color-fog-50: #f9fafb;
  --color-fog-100: #f3f4f6;
  --color-mist-200: #e5e7eb;
  --color-smoke-300: #d9dadc;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-balig-script: 'Balig Script', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.126px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.14px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.24px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.29;
  --tracking-heading-lg: -0.45px;
  --text-display: 48px;
  --leading-display: 1.14;
  --tracking-display: -0.96px;
  --text-display-lg: 64px;
  --leading-display-lg: 1.06;
  --tracking-display-lg: -1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-108: 108px;
  --spacing-112: 112px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 72px;

  /* Shadows */
  --shadow-sm: rgba(17, 24, 39, 0.2) 0px 8px 8px 0px, rgba(17, 24, 39, 0.1) 0px 4px 4px 0px, rgba(17, 24, 39, 0.1) 0px 2px 2px 0px, rgba(17, 24, 39, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.06) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.06) 0px 1px 0px 0px inset;
  --shadow-subtle: rgba(17, 24, 39, 0.12) 0px 0px 0px 1px, rgba(17, 24, 39, 0.03) 0px 2px 2px -2px, rgba(17, 24, 39, 0.03) 0px 4px 4px 0px, rgba(17, 24, 39, 0.03) 0px 8px 8px 0px, rgba(17, 24, 39, 0.03) 0px 16px 16px 0px;
  --shadow-xl: rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgba(17, 24, 39, 0.04) 0px 16px 16px 0px, rgba(17, 24, 39, 0.04) 0px 8px 8px 0px, rgba(17, 24, 39, 0.04) 0px 4px 4px -2px, rgba(17, 24, 39, 0.04) 0px 2px 2px -1px, rgba(17, 24, 39, 0.16) 0px 0px 0px 1px;
  --shadow-subtle-2: rgba(17, 24, 39, 0.12) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(17, 24, 39, 0.05) 0px 32px 32px 0px, rgba(17, 24, 39, 0.05) 0px 16px 16px 0px, rgba(17, 24, 39, 0.05) 0px 8px 8px 0px, rgba(17, 24, 39, 0.05) 0px 4px 4px 0px, rgba(17, 24, 39, 0.05) 0px 2px 2px -2px, rgba(17, 24, 39, 0.1) 0px 0px 0px 1px;
  --shadow-xl-3: rgba(17, 24, 39, 0.04) 0px 32px 32px 0px, rgba(17, 24, 39, 0.04) 0px 16px 16px 0px, rgba(17, 24, 39, 0.04) 0px 8px 8px 0px, rgba(17, 24, 39, 0.04) 0px 4px 4px -2px, rgba(17, 24, 39, 0.04) 0px 2px 2px -1px, rgb(24, 47, 165) 0px 0px 0px 1px;
  --shadow-subtle-3: rgba(17, 24, 39, 0.1) 0px 0px 0px 1px, rgba(17, 24, 39, 0.04) 0px 1px 1px -0.5px, rgba(17, 24, 39, 0.04) 0px 3px 3px -1.5px, rgba(17, 24, 39, 0.04) 0px 6px 6px -3px, rgba(17, 24, 39, 0.04) 0px 12px 12px -6px, rgba(17, 24, 39, 0.04) 0px 24px 24px -12px;
}
```
