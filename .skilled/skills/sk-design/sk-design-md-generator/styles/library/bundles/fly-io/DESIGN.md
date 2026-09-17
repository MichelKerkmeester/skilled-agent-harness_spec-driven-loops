# Fly.io — Style Reference
> surrealist cloud atlas in violet ink

**Theme:** light

Fly.io reads like a hand-drawn storybook for infrastructure: a near-white canvas washed in the faintest lavender, populated by surreal watercolor creatures and floating landscapes. The voice is two-part — a confident display serif (Mackinac) sets an editorial tone for headlines with aggressive negative tracking, while a humanist grotesque (Fricolage Grotesque) handles body and UI with subtle positive tracking that keeps the prose unhurried. Interactions live in a single vivid violet pill button that pops against the muted canvas, and a deep-violet ink carries all heading weight. Sections breathe between soft sky-to-pink gradient bands, trusting illustration to carry emotion while text and UI stay restrained.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#7c3aed` | `--color-electric-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Ink Violet | `#281950` | `--color-deep-ink-violet` | Headlines, high-emphasis text, logo mark — anchors the brand without feeling heavy |
| Heather Violet | `#5e537c` | `--color-heather-violet` | Body copy, paragraph text, subdued UI labels — the workhorse text color that keeps prose warm rather than cold |
| Mist Violet | `#a39ac1` | `--color-mist-violet` | Secondary text, footer labels, icon strokes, muted links — a washed violet that recedes gracefully |
| Midnight Plum | `#191034` | `--color-midnight-plum` | Footer background, deepest contrast surface — terminates the page with the same hue family as headings, just darker |
| Slate Dusk | `#202237` | `--color-slate-dusk` | Navigation text, dark-mode-leaning neutral — used where a neutral (not chromatic) dark is needed |
| Overcast | `#676b89` | `--color-overcast` | Muted secondary text, helper copy, timestamps — the cool counterpoint to the violet body text |
| Pure Paper | `#ffffff` | `--color-pure-paper` | Card surfaces, elevated panels, button text on violet fills |
| Lavender Mist | `#e7e6f4` | `--color-lavender-mist` | Hairline borders, card outlines, subtle dividers, inset focus rings — the dominant structural neutral, replacing what would normally be light gray |
| Iris Haze | `#f1f2f9` | `--color-iris-haze` | Page background, the canvas beneath all content — a barely-perceptible lavender tint rather than pure white |
| Dawn Wash | `linear-gradient(to right, #7dd3fc, #a5b4fc, #f9a8d4)` | `--color-dawn-wash` | Decorative gradient stop — sky-to-pink section bands |
| Plum Veil | `linear-gradient(to right bottom, #a02be4, rgba(0,0,0,0), #4f46e5)` | `--color-plum-veil` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### Fricolage Grotesque — Body copy, UI labels, button text, navigation, footer, captions. Used at 16–18px for body and 12–15px for meta. The weight 325 light is deliberate anti-convention — most devtools use 400 minimum, this whisper weight softens the dense infrastructure copy into something editorial. Positive tracking (0.025em–0.05em) at small sizes gives uppercase labels and button text a slightly spacious, unhurried feel. · `--font-fricolage-grotesque`
- **Substitute:** Inter, DM Sans, or General Sans
- **Weights:** 325, 450, 500, 575
- **Sizes:** 12px, 15px, 16px, 17px, 18px, 19px
- **Line height:** 1.50–1.66
- **Letter spacing:** 0.025em at body sizes, 0.05em at button/label sizes
- **Role:** Body copy, UI labels, button text, navigation, footer, captions. Used at 16–18px for body and 12–15px for meta. The weight 325 light is deliberate anti-convention — most devtools use 400 minimum, this whisper weight softens the dense infrastructure copy into something editorial. Positive tracking (0.025em–0.05em) at small sizes gives uppercase labels and button text a slightly spacious, unhurried feel.

### Mackinac — Display headlines and section titles. A high-contrast serif used at weight 500 only — the medium weight gives authority without feeling editorial-stiff. Aggressive negative tracking (-0.045em at 64px, -0.025em at 22–36px) tightens the letterspacing so the serif feels modern rather than traditional. Single most distinctive type choice on the site: pairs a humanist grotesque body with an editorial serif display to create a storybook voice. · `--font-mackinac`
- **Substitute:** Source Serif Pro, Tiempos Headline, or GT Super
- **Weights:** 500
- **Sizes:** 22px, 36px, 64px
- **Line height:** 1.15–1.33
- **Letter spacing:** -0.045em at 64px display, -0.025em at 22–36px headings
- **OpenType features:** `"liga" on, "kern" on`
- **Role:** Display headlines and section titles. A high-contrast serif used at weight 500 only — the medium weight gives authority without feeling editorial-stiff. Aggressive negative tracking (-0.045em at 64px, -0.025em at 22–36px) tightens the letterspacing so the serif feels modern rather than traditional. Single most distinctive type choice on the site: pairs a humanist grotesque body with an editorial serif display to create a storybook voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 18 | 0.6px | `--text-caption` |
| body-sm | 15px | 25 | 0.38px | `--text-body-sm` |
| body-lg | 18px | 30 | — | `--text-body-lg` |
| subheading | 22px | 25 | -0.55px | `--text-subheading` |
| heading | 36px | 48 | -0.9px | `--text-heading` |
| display | 64px | 74 | -2.88px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 116 | 116px | `--spacing-116` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| cards | 16px |
| small | 4px |
| inputs | 10px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(91, 33, 182, 0.1) 0px 5px 5px -2px, rgba(91, 33, 182...` | `--shadow-sm` |
| subtle | `rgba(67, 56, 202, 0.25) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(32, 34, 55, 0.075) 0px 0px 0px 1px, rgba(32, 34, 55,...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96-120px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Pill Navigation Bar
**Role:** Top-level site navigation

Floating pill container at 9999px radius, white (#ffffff) fill, hairline border at #e7e6f4, subtle drop shadow. Holds logo on left, nav links centered, Sign In ghost link and 'Get Started' violet CTA on right. Padding 10px vertical, 12px horizontal inside the pill.

### Primary CTA Button
**Role:** Primary conversion action (Deploy, Get Started, Sign Up)

Vivid violet (#7c3aed) fill, white text in Fricolage Grotesque 16px weight 500, 9999px radius, 10px 20px padding. Soft violet-tinted shadow (rgba(91,33,182,0.1) two-layer) lifts it off the page. Optional right-arrow glyph in white at 14px.

### Outlined Action Button
**Role:** Secondary action (Enterprise Features, Fly.io Security)

Transparent fill, 1.5px solid #7c3aed border, 9999px radius, violet text in Fricolage 16px weight 500, 10px 20px padding. Right-arrow chevron in violet. Used for lower-emphasis but still conversion-oriented actions.

### Ghost Text Link
**Role:** Inline navigation and tertiary actions

No background or border, text in #281950 or #5e537c, underline on hover only. Fricolage 16px weight 450. Used for 'Sign In', 'Learn more', and inline editorial links.

### Display Headline
**Role:** Hero and section titles

Mackinac 64px weight 500, color #281950, letter-spacing -2.88px, line-height 1.15. Two-line structure common; italic word accent (e.g. 'fearlessly') set in the same Mackinac italic if available, otherwise Fricolage italic 500. Sits centered or left-aligned above a 16–18px body paragraph in #5e537c.

### Hero Section
**Role:** Above-the-fold introduction

Full-bleed Iris Haze (#f1f2f9) canvas. Centered display headline stack (max-width 720px) floats over a wide hand-drawn watercolor illustration that extends edge-to-edge. Body paragraph 18px #5e537c, centered, max-width 560px. Single violet CTA below paragraph. Illustration occupies top 40% of viewport behind the text.

### Gradient Feature Band
**Role:** Section transition with illustration

Full-bleed band with linear-gradient background: #7dd3fc → #a5b4fc → #f9a8d4 (left to right). Contains a two-column layout: text block left (60%), illustration right (40%). Headline 36px Mackinac #281950, body 18px #5e537c, single horizontal hairline divider at #e7e6f4.

### Trusted By Logo Strip
**Role:** Social proof

Centered uppercase label 'TRUSTED BY TEAMS AT' in Fricolage 12px weight 500, letter-spacing 0.05em, color #7c3aed. Single horizontal row of 6–8 partner logos below, evenly spaced, each in monochrome dark (#281950) at consistent height ~24px.

### Checkmark Feature List
**Role:** Feature checklist (Enterprise, Pricing)

Vertical stack of 5–7 items. Each row: small violet checkmark glyph (16px, #7c3aed) on left, label text in Fricolage 17px weight 450 #281950 on right. Row gap 16px, no dividers between items.

### Two-Column Feature Section
**Role:** Product/feature explanation with illustration

Max-width 1200px centered. Alternating left-text/right-illustration and right-text/left-illustration columns. Text column: 36px Mackinac headline, 18px body paragraph, 10px hairline divider (#e7e6f4), optional outlined CTA. Illustration column: contained watercolor character scene, max-width 480px.

### Enterprise Feature Card
**Role:** Grouped feature highlight

White (#ffffff) surface, 16px radius, no visible border, sits on Iris Haze canvas. Internal padding 32px. Contains a headline in Mackinac 36px #281950, a 2–3 sentence body, and a row of two outlined action buttons.

### Footer
**Role:** Site-wide footer

Full-bleed #191034 (Midnight Plum) background. White and Mist Violet (#a39ac1) text. Multi-column link grid with column headers in Fricolage 12px uppercase weight 500 letter-spacing 0.05em. Logo mark and copyright row at bottom.

## Do's and Don'ts

### Do
- Use Mackinac at 64px / -2.88px tracking for any hero or section display headline — the serif is the brand's editorial signature, do not substitute it.
- Use #7c3aed Electric Violet exclusively for filled CTA buttons and active nav states; no other saturated color should appear as a button background.
- Apply 9999px radius to all primary buttons and the top navigation container; the pill shape is a defining silhouette.
- Use #5e537c Heather Violet for body copy rather than pure gray — the warm violet tint keeps the page on-brand.
- Use #e7e6f4 Lavender Mist for all hairline borders and dividers instead of neutral gray; the structural neutral should carry the same hue family as the text.
- Space sections with 96–120px vertical gap; the generous breathing room is what makes the whimsical illustrations feel intentional rather than crowded.
- Use the sky→indigo→pink gradient (#7dd3fc → #a5b4fc → #f9a8d4) for full-bleed section bands that introduce illustrated content.

### Don't
- Do not use a display sans-serif for headlines — the Mackinac serif is the single most distinctive type choice and removing it collapses the brand voice.
- Do not use bright or saturated colors other than #7c3aed for any UI element; the system runs on one accent.
- Do not use square or 4px-radius buttons for primary actions — pill shape is mandatory for CTAs and nav.
- Do not use pure black (#000000) for body text; use #281950 Deep Ink Violet or #5e537c Heather Violet.
- Do not apply heavy drop shadows to cards or panels; the design relies on hairline borders and tonal contrast for separation, not depth.
- Do not use tight tracking on body copy or button text; the positive letter-spacing (0.025–0.05em) at small sizes is part of the editorial voice.
- Do not use real photography in place of illustrations — the hand-drawn watercolor style is load-bearing for the brand atmosphere.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Iris Haze Canvas | `#f1f2f9` | Page background — the lavender-tinted base beneath all content |
| 1 | Pure Paper | `#ffffff` | Card surfaces, elevated panels, nav pill background |
| 2 | Lavender Mist | `#e7e6f4` | Subtle elevated washes, gradient band bases, decorative overlays |
| 3 | Midnight Plum | `#191034` | Footer terminal surface |

## Elevation

- **Primary CTA Button:** `rgba(91, 33, 182, 0.1) 0px 5px 5px -2px, rgba(91, 33, 182, 0.1) 0px 2px 4px -2px`
- **Focused Input/Nav:** `rgba(67, 56, 202, 0.25) 0px 0px 0px 1px inset`
- **Navigation Bar:** `rgba(32, 34, 55, 0.075) 0px 0px 0px 1px, rgba(32, 34, 55, 0.05) 0px 10px 15px -3px, rgba(32, 34, 55, 0.05) 0px 4px 6px -4px`

## Imagery

Imagery is exclusively hand-drawn watercolor illustration with fine ink outlines. Surreal, dreamlike, populated by anthropomorphic characters (fox-like creatures, geometric beings, bird forms) and floating landscape elements — stars, moons, leaves, architectural fragments, abstract organic shapes. Color treatment is pastel: lavender, peach, teal, mint, cream, soft yellow. Illustrations are contained within sections (not full-bleed except as decorative backdrops in the hero) and always sit on the right or behind text. No photography, no 3D renders, no product screenshots. The illustration carries emotional weight while the UI stays restrained.

## Layout

Max-width 1200px centered content. Full-bleed section bands with Iris Haze (#f1f2f9) canvas and occasional sky-to-pink gradient washes. Hero is full-bleed illustration behind a centered headline stack. Below the fold, sections alternate between two-column text+illustration layouts and centered text blocks. Trusted-by logo strip is a full-width centered row. Generous 96–120px vertical section gaps create a quiet, gallery-like rhythm. Navigation is a floating pill at the top center-left, not a full-width bar.

## Agent Prompt Guide

**Quick Color Reference**
- text (headings): #281950
- text (body): #5e537c
- background (canvas): #f1f2f9
- background (card): #ffffff
- border (hairline): #e7e6f4
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Gradient feature band*: Full-bleed band with background linear-gradient(to right, #7dd3fc, #a5b4fc, #f9a8d4). Two-column layout inside max-width 1200px. Left column: Mackinac 36px weight 500, color #281950, letter-spacing -0.9px. Body 18px Fricolage, color #5e537c. Hairline divider 1px #e7e6f4, max-width 80px. Right column: contained illustration, max-width 480px.

3. *Outlined action button*: Transparent fill, 1.5px solid #7c3aed border, 9999px radius, Fricolage 16px weight 500, color #7c3aed, 10px 20px padding, optional right-arrow chevron in #7c3aed at 14px.

4. *Trusted-by logo strip*: Centered uppercase label 'TRUSTED BY TEAMS AT' in Fricolage 12px weight 500, letter-spacing 0.6px, color #7c3aed. Below: single horizontal row of 6 partner logos, monochrome #281950, height 24px, evenly spaced with 48px gaps.

5. *Checkmark feature list*: Vertical stack with 16px row gap. Each row: 16px #7c3aed checkmark glyph, then label in Fricolage 17px weight 450 color #281950. Five to seven items, no dividers between.

## Typography Pairing Philosophy

The defining type move is grotesque body + serif display: Fricolage Grotesque (weights 325–575, positive tracking 0.025–0.05em) carries all UI and prose, while Mackinac (weight 500 only, aggressive negative tracking -0.025 to -0.045em) appears only on display headlines. The contrast in family, weight range, and tracking direction creates the storybook voice — neither font alone would produce the same effect. Do not attempt to pair Mackinac with a different sans, and do not attempt to replace Fricolage with a more neutral grotesk like Inter; the warmth and slight looseness of Fricolage is what makes the body copy feel editorial rather than corporate.

## Gradient System

Two distinct gradient families:

1. **Section bands** — linear-gradient(to right, #7dd3fc, #a5b4fc, #f9a8d4) at full opacity. Used as full-bleed backgrounds for feature sections that introduce illustrations. The sky-to-pink wash frames the watercolor artwork without competing with it.

2. **Subtle washes** — same hues at 0.1 alpha: linear-gradient(100deg, rgba(125,211,252,0.1), rgba(165,180,252,0.1), rgba(249,168,212,0.1)). Used on inner sections that need a hint of color without committing to a full band.

3. **Plum-to-indigo glow** — linear-gradient(to right bottom, #a02be4, rgba(0,0,0,0), #4f46e5). Used as an accent on hero overlays or behind the primary CTA to create depth on the violet fill.

## Similar Brands

- **Linear** — Same violet-tinted dark/light contrast, pill navigation, single saturated accent for CTAs, and confident display typography
- **Vercel** — Similar ultra-clean light canvas with generous spacing, pill buttons, and a single dark text color for hierarchy
- **Stripe** — Same editorial body type treatment with humanist grotesk, soft neutral canvas, and restrained use of a single brand color
- **Railway** — Same devtools audience and pill-shaped navigation, though Fly distinguishes itself with hand-drawn illustration vs Railway's terminal aesthetic
- **Notion** — Similar warm-neutral canvas, light hairline borders instead of heavy shadows, and playful illustrated personality

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #7c3aed;
  --color-deep-ink-violet: #281950;
  --color-heather-violet: #5e537c;
  --color-mist-violet: #a39ac1;
  --color-midnight-plum: #191034;
  --color-slate-dusk: #202237;
  --color-overcast: #676b89;
  --color-pure-paper: #ffffff;
  --color-lavender-mist: #e7e6f4;
  --color-iris-haze: #f1f2f9;
  --color-dawn-wash: #a5b4fc;
  --gradient-dawn-wash: linear-gradient(to right, #7dd3fc, #a5b4fc, #f9a8d4);
  --color-plum-veil: #a02be4;
  --gradient-plum-veil: linear-gradient(to right bottom, #a02be4, rgba(0,0,0,0), #4f46e5);

  /* Typography — Font Families */
  --font-fricolage-grotesque: 'Fricolage Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mackinac: 'Mackinac', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: 0.6px;
  --text-body-sm: 15px;
  --leading-body-sm: 25;
  --tracking-body-sm: 0.38px;
  --text-body-lg: 18px;
  --leading-body-lg: 30;
  --text-subheading: 22px;
  --leading-subheading: 25;
  --tracking-subheading: -0.55px;
  --text-heading: 36px;
  --leading-heading: 48;
  --tracking-heading: -0.9px;
  --text-display: 64px;
  --leading-display: 74;
  --tracking-display: -2.88px;

  /* Typography — Weights */
  --font-weight-w325: 325;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-w575: 575;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-116: 116px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96-120px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-cards: 16px;
  --radius-small: 4px;
  --radius-inputs: 10px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(91, 33, 182, 0.1) 0px 5px 5px -2px, rgba(91, 33, 182, 0.1) 0px 2px 4px -2px;
  --shadow-subtle: rgba(67, 56, 202, 0.25) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(32, 34, 55, 0.075) 0px 0px 0px 1px, rgba(32, 34, 55, 0.05) 0px 10px 15px -3px, rgba(32, 34, 55, 0.05) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-iris-haze-canvas: #f1f2f9;
  --surface-pure-paper: #ffffff;
  --surface-lavender-mist: #e7e6f4;
  --surface-midnight-plum: #191034;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #7c3aed;
  --color-deep-ink-violet: #281950;
  --color-heather-violet: #5e537c;
  --color-mist-violet: #a39ac1;
  --color-midnight-plum: #191034;
  --color-slate-dusk: #202237;
  --color-overcast: #676b89;
  --color-pure-paper: #ffffff;
  --color-lavender-mist: #e7e6f4;
  --color-iris-haze: #f1f2f9;
  --color-dawn-wash: #a5b4fc;
  --color-plum-veil: #a02be4;

  /* Typography */
  --font-fricolage-grotesque: 'Fricolage Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mackinac: 'Mackinac', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: 0.6px;
  --text-body-sm: 15px;
  --leading-body-sm: 25;
  --tracking-body-sm: 0.38px;
  --text-body-lg: 18px;
  --leading-body-lg: 30;
  --text-subheading: 22px;
  --leading-subheading: 25;
  --tracking-subheading: -0.55px;
  --text-heading: 36px;
  --leading-heading: 48;
  --tracking-heading: -0.9px;
  --text-display: 64px;
  --leading-display: 74;
  --tracking-display: -2.88px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-116: 116px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(91, 33, 182, 0.1) 0px 5px 5px -2px, rgba(91, 33, 182, 0.1) 0px 2px 4px -2px;
  --shadow-subtle: rgba(67, 56, 202, 0.25) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(32, 34, 55, 0.075) 0px 0px 0px 1px, rgba(32, 34, 55, 0.05) 0px 10px 15px -3px, rgba(32, 34, 55, 0.05) 0px 4px 6px -4px;
}
```
