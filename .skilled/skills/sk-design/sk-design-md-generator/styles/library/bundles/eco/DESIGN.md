# Eco — Style Reference
> skyline vault at dusk — a near-monochrome ledger where negative space and oversized display type carry the entire brand weight, interrupted only by tiny electric-blue marks.

**Theme:** mixed

Eco operates as a financial cathedral rendered in near-total monochrome: a white-and-bone canvas interrupted by near-black voids, with the entire brand voice carried by type rather than color. Display sizes stretch to 90–96px with aggressive negative tracking, making headlines feel architectural and authoritative without chromatic support. Surfaces transition sharply between light (#ffffff/#efefef) and deep ink (#0f111a/#141414/#000000), creating a vault-like rhythm where every dark band reads as a chamber of gravity. A single blue gradient (deep cobalt to electric sky) surfaces sparingly on small UI marks, never as a CTA fill — actions are ghost-bordered on dark, ghost-bordered on light, or monochrome text links. Components are flat, minimal-elevation, and rely on hairline contrast and generous whitespace rather than shadow or color to separate. The system feels less like a product UI and more like a bank lobby translated into the screen — restrained, confident, almost ceremonial in its avoidance of decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#ffffff` | `--color-bone` | Primary canvas, card surfaces, button text on dark bands — the dominant air of the system |
| Ash Mist | `#efefef` | `--color-ash-mist` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Vault Ink | `#0f111a` | `--color-vault-ink` | Primary heading text, dark band backgrounds, footer surface — the near-black that carries all authority and seals dark chambers |
| Absolute | `#000000` | `--color-absolute` | Deepest dark band background, high-contrast text on light surfaces — used where absolute weight is required |
| Carbon | `#141414` | `--color-carbon` | Secondary dark surface, border on dark sections — one shade lighter than Absolute for layered darkness |
| Charcoal | `#2a2a2a` | `--color-charcoal` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Graphite | `#222222` | `--color-graphite` | Dark border, secondary text on dark surfaces, image overlay tones |
| Silver Veil | `#aeaeae` | `--color-silver-veil` | Muted card text, disabled states, secondary metadata — the quietest readable neutral |
| Frost | `#a6b8d1` | `--color-frost` | Decorative border, link accent on dark, subtle cool-tinted hairline — the only chromatic whisper in the neutral stack |
| Cobalt Signal | `#1c53bd` | `--color-cobalt-signal` | Gradient origin — small icon accents, arrow markers, chromatic punctuation on otherwise monochrome controls |
| Electric Sky | `#53adfe` | `--color-electric-sky` | Gradient terminus — the bright terminal of the blue mark, always paired with Cobalt Signal as a gradient pair |

## Tokens — Typography

### Interdisplay — Primary workhorse — body copy, UI controls, nav, and most headings. Carries the system's voice at 400 weight only; variation comes from size and tracking, not weight. Single-weight usage is a signature choice: the system never bolds, only scales. · `--font-interdisplay`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 14px, 16px, 24px, 40px, 84px, 90px, 96px
- **Line height:** 0.90, 0.95, 1.06, 1.20, 1.43, 1.50
- **Letter spacing:** -0.04em at 84–96px display, -0.03em at 40–48px, -0.01em at 14–16px body
- **Role:** Primary workhorse — body copy, UI controls, nav, and most headings. Carries the system's voice at 400 weight only; variation comes from size and tracking, not weight. Single-weight usage is a signature choice: the system never bolds, only scales.

### Roobert — Display and feature headings, hero typography, emphasis text. Used at the top of the hierarchy where 90–96px sizes demand a typeface with more open counters and personality. Also appears in nav and inputs for tactile warmth against Interdisplay's neutrality. · `--font-roobert`
- **Substitute:** Manrope or Plus Jakarta Sans
- **Weights:** 400
- **Sizes:** 16px, 48px, 84px, 96px
- **Line height:** 0.95, 1.06, 1.20, 1.33
- **Letter spacing:** -0.0400em, -0.0300em, -0.0200em, -0.0100em
- **Role:** Display and feature headings, hero typography, emphasis text. Used at the top of the hierarchy where 90–96px sizes demand a typeface with more open counters and personality. Also appears in nav and inputs for tactile warmth against Interdisplay's neutrality.

### Inter 24 Pt — Secondary body, card copy, link text, image captions — a quieter Inter variant for less prominent content areas where Interdisplay would feel too dominant · `--font-inter-24-pt`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 14px, 16px, 22px
- **Line height:** 1.00, 1.20, 1.50
- **Letter spacing:** -0.0200em, -0.0100em
- **Role:** Secondary body, card copy, link text, image captions — a quieter Inter variant for less prominent content areas where Interdisplay would feel too dominant

### Fragmentmono — Monospaced accent for nav labels, link IDs, technical metadata, heading eyebrows — a typewriter whisper that signals precision and protocol · `--font-fragmentmono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.00, 1.50, 1.71
- **Letter spacing:** -0.01em
- **Role:** Monospaced accent for nav labels, link IDs, technical metadata, heading eyebrows — a typewriter whisper that signals precision and protocol

### Aeonik Mono — Rare monospaced flourish for signature inline moments — used as the tiniest typographic exclamation in the system · `--font-aeonik-mono`
- **Substitute:** Space Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.10
- **Letter spacing:** -0.04em
- **Role:** Rare monospaced flourish for signature inline moments — used as the tiniest typographic exclamation in the system

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | -0.14px | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 22px | 1.2 | -0.44px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 40px | 1.06 | -1.2px | `--text-heading` |
| heading-lg | 48px | 1.06 | -1.44px | `--text-heading-lg` |
| display | 84px | 0.95 | -3.36px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 12px |
| cards | 8px |
| pills | 128px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 40-80px
- **Card padding:** 40px
- **Element gap:** 20px

## Components

### Hero Display Headline
**Role:** Primary above-the-fold headline

Rendered at 84–96px, Roobert or Interdisplay weight 400, white on dark cityscape imagery. Tracking -0.04em compresses the line into an architectural mass. No drop shadow, no color, no gradient — the imagery behind does all the atmospheric work.

### Section Display Heading
**Role:** Mid-page feature headlines

48–96px Interdisplay or Roobert, used on dark (#0f111a / #141414) bands. Always white (#ffffff). Tracking tightens proportionally: -0.04em at display sizes, loosening to -0.01em by 24px subheadings.

### Ghost Nav Button
**Role:** Primary navigation action

Transparent background, 1px white border at #ffffff, 8px radius, padding 8px 16px. Text in Interdisplay 14px, uppercase, letter-spacing 0.018em. Used in header for 'Bridge with Eco' — outlined, never filled.

### Inline Arrow Button
**Role:** Compact action trigger on dark sections

Dark transparent background (#2a2a2a at ~60% opacity), 8px radius, text in Interdisplay 14px, trailing blue gradient square (8×8px) using #1c53bd → #53adfe gradient. The blue square is the only chromatic punctuation in the button. Padding 12px 16px.

### Light Ghost Link
**Role:** Inline text link on light backgrounds

No background, no border, Interdisplay 14px in #0f111a, with optional Frost (#a6b8d1) underline on hover. Underline 1px, offset 4px.

### Eyebrow Label
**Role:** Section pre-heading / category tag

Fragmentmono 14px, uppercase, letter-spacing 0.018em, color #aeaeae on light or #aeaeae on dark. Always sits 16–24px above the main heading it qualifies.

### Feature Card
**Role:** Content card on light sections

#ffffff background, no border, no shadow, 8px radius, 40px padding all sides. Heading at 24px Interdisplay, body at 16px Inter 24 Pt, #2a2a2a text. Rests on #efefef canvas for ambient separation.

### Input Field
**Role:** Form input

Transparent or #efefef background, 1px bottom border in #aeaeae (or #ffffff on dark), no side/top borders. Text in Roobert 16px, placeholder in #aeaeae. 8px radius only on bordered variants. Focus state: border becomes #0f111a, no glow ring.

### Monochrome Icon
**Role:** UI iconography

Stroke-based icons at 1.5px weight, #0f111a on light, #ffffff on dark, #a6b8d1 as decorative accent variant. No filled icons. 16px and 20px sizes only.

### Dark Band Section
**Role:** Full-bleed content section on near-black

Background #0f111a or #141414, full viewport width, 80–120px vertical padding. Contains white display headings, inline arrow buttons, and Frost (#a6b8d1) hairline dividers. Functions as the system's visual punctuation between light sections.

### Footer Surface
**Role:** Page footer

#000000 background, Fragmentmono 14px labels in #aeaeae, white link text, generous 40–56px padding. Minimal link columns, no social icon noise.

## Do's and Don'ts

### Do
- Use only #ffffff, #efefef, and the 5-step dark scale (#0f111a → #141414 → #2a2a2a → #222222 → #000000) for all surface and text work — never introduce a chromatic UI color.
- Render display headlines at 84–96px with tracking between -0.03em and -0.04em; the aggressive negative spacing is what makes the type feel architectural.
- Alternate light and dark full-bleed sections as the primary page rhythm; a page that stays entirely on white or entirely on dark breaks the vault cadence.
- Use the blue gradient (linear-gradient(90deg, #1c53bd, #53adfe)) only on small 8–16px accent marks inside or beside controls — never as a fill, never as a background.
- Set Interdisplay and Roobert at weight 400 only; the system signals emphasis by scaling up, never by going bold.
- Use 8px radius for cards, buttons, inputs, and nav — 128px only for pill-shaped elements like tags or the rare full-pill control.
- Place Fragmentmono eyebrows 16–24px above every display heading in uppercase with 0.018em tracking.

### Don't
- Do not use color to indicate state or hierarchy — the system relies on luminance, scale, and hairline borders for all differentiation.
- Do not use drop shadows, glow effects, or colored box-shadows for elevation; depth is tonal, not diffused.
- Do not introduce a second typeface family beyond the five listed; even minor additions dilute the vault's typographic discipline.
- Do not render body or UI text below 14px or above 22px — the type scale jumps directly from subheading (24px) to heading-sm territory.
- Do not apply the blue gradient to a button background, hero overlay, or section fill — it is a mark-scale accent only.
- Do not mix light-mode and dark-mode elements within the same band; a single section commits to one luminance.
- Do not use filled icons, colored icons, or iconography with gradients; all icons are 1.5px stroke monochrome.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#ffffff` | Primary page surface, card backgrounds, default content field |
| 2 | Ash Mist | `#efefef` | Subtle elevation on light sections, input field fill, button hover on light |
| 3 | Charcoal Lift | `#2a2a2a` | Dark-mode button surfaces, subtle lift on dark bands |
| 4 | Carbon | `#141414` | Dark band background, footer-adjacent surfaces |
| 5 | Vault Ink | `#0f111a` | Primary dark section background, maximum contrast against white text |
| 6 | Absolute | `#000000` | Deepest dark, footer, full-bleed void sections |

## Elevation

Elevation is expressed through tonal layering and hairline contrast, never through drop shadows. Dark sections are placed beside light sections to create depth through luminance jumps rather than shadow diffusion. Cards sit flush on the #efefef canvas with a 1-unit luminance gap, not a shadow.

## Imagery

Full-bleed photographic cityscapes at twilight/dusk carry the hero and section transitions — muted, high-altitude aerials of skylines in slate and steel tones that mirror the monochrome palette. Product UI is shown via small, tight device crops. No illustration, no 3D, no abstract graphics. Social proof and decorative imagery are suppressed entirely; the cityscape is the only atmospheric asset and it functions as architectural wallpaper for the typography. Icons are stroke-based monochrome line work at 1.5px — no filled, no multicolor.

## Layout

Full-bleed sections with no centered max-width container; the page breaks into alternating horizontal bands that span the full viewport. Hero is a full-bleed photographic band with centered display headline floating over the image. Subsequent sections alternate between white/light gray content bands and full-bleed dark bands (#0f111a / #141414), creating a vault-rhythm of light → dark → light → dark. Content within bands is centered with a ~1280px max-width for text blocks and 2-column feature layouts. Navigation is a minimal sticky top bar with logo left, three text links right, and one ghost-bordered action. No sidebar, no mega-menu, no breadcrumbs. Vertical rhythm is generous: 80–120px section padding, 40–56px between content blocks within a section.

## Agent Prompt Guide

Quick Color Reference:
• text primary: #0f111a
• text on dark: #ffffff
• page background: #ffffff or #efefef
• dark band background: #0f111a
• border / hairline: #aeaeae on light, #ffffff on dark
• accent mark: linear-gradient(90deg, #1c53bd, #53adfe)
• primary action: no distinct CTA color

3-5 Example Component Prompts:

1. Create a dark band section: background #0f111a, full-bleed, 100px vertical padding. Fragmentmono eyebrow in uppercase at 14px, #aeaeae, letter-spacing 0.018em. Display heading below at 84px Roobert weight 400, white, letter-spacing -3.36px, line-height 0.95. Two inline arrow buttons below: transparent dark background (#2a2a2a at 60%), 8px radius, 12px 16px padding, Interdisplay 14px white text, trailing 8×8px blue gradient square using linear-gradient(90deg, #1c53bd, #53adfe).

2. Create a ghost nav button: transparent background, 1px solid #ffffff border, 8px radius, 8px 16px padding. Text in Interdisplay 14px uppercase, white, letter-spacing 0.018em. No fill on hover, only border opacity shift to 0.7.

3. Create a feature card on light section: #ffffff background, no border, no shadow, 8px radius, 40px padding. Heading at 24px Interdisplay weight 400, #0f111a. Body at 16px Inter 24 Pt, #2a2a2a. Sits on a #efefef parent canvas for ambient separation. Optional 1px #aeaeae hairline divider 24px above the heading.

4. Create a hero band: full-bleed photographic cityscape at dusk (desaturated slate/steel tones) covering the entire viewport. Centered white display headline at 96px Interdisplay weight 400, letter-spacing -3.84px, line-height 0.90, max-width 900px. No button on the hero.

5. Create a footer: #000000 background, 56px padding all sides. Fragmentmono 14px section labels in #aeaeae uppercase. Link text in white, Interdisplay 14px. No icons, no social blocks, no newsletter field.

## Gradient System

Only one gradient exists in the system: linear-gradient(90deg, #1c53bd, #53adfe). It is used exclusively as a chromatic punctuation mark at icon scale (8–16px squares inside or beside controls). It is never used as a background fill, a hero overlay, a button surface, or a text gradient. The gradient's role is to be the system's single moment of color — a tiny electric-blue key in an otherwise locked monochrome vault. If more than one gradient appears on a single page, the system is being violated.

## Similar Brands

- **Stripe** — Same restrained near-monochrome palette with full-bleed dark section transitions, oversized display type, and a single gradient accent (Stripe's aurora) used sparingly for emphasis
- **Linear** — Same architectural display typography at 80–96px with aggressive negative tracking, and the same vault-like alternation between white canvases and deep ink sections
- **Vercel** — Same commitment to a single-weight typeface, a near-zero colorfulness ratio, and dark-band page rhythm where typography alone carries the brand
- **Bridge (Stripe's stablecoin API)** — Same crypto-financial gravity, same ghost-bordered primary actions, and the same near-monochrome vault aesthetic that lets a single accent color read as a signal rather than decoration

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #ffffff;
  --color-ash-mist: #efefef;
  --color-vault-ink: #0f111a;
  --color-absolute: #000000;
  --color-carbon: #141414;
  --color-charcoal: #2a2a2a;
  --color-graphite: #222222;
  --color-silver-veil: #aeaeae;
  --color-frost: #a6b8d1;
  --color-cobalt-signal: #1c53bd;
  --color-electric-sky: #53adfe;

  /* Typography — Font Families */
  --font-interdisplay: 'Interdisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-24-pt: 'Inter 24 Pt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fragmentmono: 'Fragmentmono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-aeonik-mono: 'Aeonik Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.06;
  --tracking-heading: -1.2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -1.44px;
  --text-display: 84px;
  --leading-display: 0.95;
  --tracking-display: -3.36px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-172: 172px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 40-80px;
  --card-padding: 40px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 128px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 12px;
  --radius-cards: 8px;
  --radius-pills: 128px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-bone-canvas: #ffffff;
  --surface-ash-mist: #efefef;
  --surface-charcoal-lift: #2a2a2a;
  --surface-carbon: #141414;
  --surface-vault-ink: #0f111a;
  --surface-absolute: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #ffffff;
  --color-ash-mist: #efefef;
  --color-vault-ink: #0f111a;
  --color-absolute: #000000;
  --color-carbon: #141414;
  --color-charcoal: #2a2a2a;
  --color-graphite: #222222;
  --color-silver-veil: #aeaeae;
  --color-frost: #a6b8d1;
  --color-cobalt-signal: #1c53bd;
  --color-electric-sky: #53adfe;

  /* Typography */
  --font-interdisplay: 'Interdisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-24-pt: 'Inter 24 Pt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fragmentmono: 'Fragmentmono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-aeonik-mono: 'Aeonik Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.06;
  --tracking-heading: -1.2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -1.44px;
  --text-display: 84px;
  --leading-display: 0.95;
  --tracking-display: -3.36px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 128px;
}
```
