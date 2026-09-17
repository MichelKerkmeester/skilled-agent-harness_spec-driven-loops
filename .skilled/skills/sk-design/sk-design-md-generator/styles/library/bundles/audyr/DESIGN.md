# Audyr — Style Reference
> Ink on cold-pressed paper. The interface reads as a meticulously typeset monograph — black ink, white stock, hairline rules, and the softest possible shadows to suggest depth.

**Theme:** light

Audyr uses a typeset-document language: white paper canvas, black ink text, and the faintest gray rules separating content blocks. The entire interface is intentionally near-monochrome — no brand color accent, no decorative gradients, no illustrated atmosphere — so the product's promise of clarity becomes the page's visual promise too. Typography carries all hierarchy through a single sans-serif (Inter) at three weights and tight -0.025em tracking that compresses letterforms into confident, compact blocks at every scale. Components are quietly constructed with hairline borders in #ededed, 4–8px radii on interactive elements, and shadows so subtle they read as paper grain rather than elevation. The system feels editorial — closer to a beautifully set technical brief than a typical SaaS landing page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#262626` | `--color-ink` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Pure Paper | `#ffffff` | `--color-pure-paper` | Card surfaces, elevated panels, content backgrounds — the base canvas color sits one step brighter than the page |
| Soft Mist | `#ededed` | `--color-soft-mist` | Hairline borders, input outlines, dividers, subtle panel fills — the structural glue that separates regions without lines shouting |
| Charcoal | `#171717` | `--color-charcoal` | Secondary dark surface (pricing card, alternate hero), occasional dark fills where deeper weight is needed than Ink |
| Ash | `#686868` | `--color-ash` | Secondary body text, nav links, supporting copy — the first step down from primary text |
| Slate | `#515151` | `--color-slate` | Tertiary text, icon strokes on light backgrounds, muted metadata |
| Muted | `#737373` | `--color-muted` | Helper text, caption-level copy, secondary icon strokes |
| Fog | `#929292` | `--color-fog` | Placeholder text, disabled labels, very low-emphasis text |
| Chalk | `#cbcbcb` | `--color-chalk` | Shadow residue on dark buttons, ultra-low-contrast surface markers |
| Mint Whisper | `#ecfdf5` | `--color-mint-whisper` | Primary page canvas and white card surfaces. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Inter — The sole typeface. Weight 600 reserved for section labels and small UI controls; weight 500 for nav and secondary buttons; weight 400 for body and most copy. The system commits to one family rather than pairing a display serif — a deliberate editorial choice that keeps the visual signal monochrome. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px
- **Line height:** 1.20–1.63
- **Letter spacing:** -0.025em applied at every size (≈-0.3px at 12px up to -1.2px at 48px)
- **OpenType features:** `"cv11", "ss01"`
- **Role:** The sole typeface. Weight 600 reserved for section labels and small UI controls; weight 500 for nav and secondary buttons; weight 400 for body and most copy. The system commits to one family rather than pairing a display serif — a deliberate editorial choice that keeps the visual signal monochrome.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.3px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.35px | `--text-body-sm` |
| body | 16px | 1.56 | -0.4px | `--text-body` |
| subheading | 18px | 1.63 | -0.45px | `--text-subheading` |
| heading-sm | 20px | 1.5 | -0.5px | `--text-heading-sm` |
| heading | 24px | 1.4 | -0.6px | `--text-heading` |
| heading-lg | 30px | 1.38 | -0.75px | `--text-heading-lg` |
| display | 48px | 1.11 | -1.2px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| badges | 9999px |
| images | 8px |
| inputs | 4px |
| buttons | 4px |
| largePanels | 18px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.04) 0px 1px 3px 0px` | `--shadow-subtle` |
| subtle-2 | `lab(0 0 0 / 0.05) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| subtle-3 | `oklab(0.999994 0.0000455678 0.0000200868 / 0.16) 0px 1px ...` | `--shadow-subtle-3` |
| subtle-4 | `lab(0 0 0 / 0.05) 0px 1px 3px 0px, lab(0 0 0 / 0.05) 0px ...` | `--shadow-subtle-4` |
| xl | `lab(0 0 0 / 0.1) 0px 25px 50px -12px` | `--shadow-xl` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120-160px
- **Card padding:** 32px
- **Element gap:** 16-20px

## Components

### Top Navigation Bar
**Role:** Site-wide header

Full-width white bar, 64px tall, 1px bottom border in #ededed. Logo left (24px square X-mark), center nav links at 14px Inter 500 in #686868 with #262626 on hover, right cluster holds a ghost 'Sign In' link and a dark filled 'Get Started' button. No drop shadow — just the border.

### Dark Filled Action Button
**Role:** Primary CTA

Background #262626, text #ffffff, 14px Inter 500. Padding 10px 20px. Radius 4px. Subtle inset highlight (oklab 0.16 inset 1px) plus a soft 0.05 alpha 1px drop shadow to register the surface. This is the only button style that carries visual weight on the page.

### Ghost Outline Action Button
**Role:** Secondary action

Transparent background, 1px border in #ededed, text #262626, 14px Inter 500. Same 10px 20px padding and 4px radius as the filled variant. Used for 'Watch Demo' and similar non-primary actions.

### Pricing Tier Card
**Role:** Pricing display (Free, Hobby, Pro)

White surface, 1px border in #ededed, radius 14px, padding 32px. Tier name at 24px Inter 600 #262626, price at 36px Inter 600 #262626 with '/ month' in 14px #686868. Feature list uses 14px body text with 8px row gap and small dark check icons.

### Highlighted Pricing Card (Hobby)
**Role:** Featured/Recommended tier

Same structure as standard pricing card but with a dark surface (background #171717, text #ffffff, subtext #cbcbcb) and a 'Popular Option' pill badge floating above the card. The dark surface breaks the all-white field to draw the eye.

### Pill Badge
**Role:** Status / label / tag

Fully rounded (9999px), padding 4px 12px, 12px Inter 500. Default variant: light gray fill (#ededed) with #262626 text. Highlight variant for 'Popular Option' or 'Save 20%': #ecfdf5 fill with green-tinted text.

### Pricing Toggle
**Role:** Billing period switcher

Segmented control, 40px tall, radius 4px, 1px border in #ededed. Active segment filled #262626 with #ffffff text; inactive segment is transparent with #686868 text. A small 'Save 20%' pill in green floats above the active option.

### Hero Section
**Role:** Above-the-fold introduction

Centered single-column, max-width 720px, 80–120px vertical padding. Headline at 48px Inter 600 in #262626 with -1.2px tracking, line-height 1.11. Subtext at 18px Inter 400 in #686868. Two-button row: filled primary + ghost secondary. 'No credit card required' microcopy at 12px below.

### Product Mockup Frame
**Role:** Embedded dashboard screenshot

White surface, 1px border in #ededed, radius 18px, large diffuse shadow (lab 0.1 0px 25px 50px -12px). Mockup fills the inner area with 8px corner rounding on the UI chrome. Floats below the hero as the visual proof point.

### Tab Group
**Role:** Section switcher (used in product mockup)

Horizontal pill cluster, 36px tall, radius 4px, 1px border #ededed. Active tab: #ededed fill, #262626 text. Inactive: transparent, #686868 text. Items separated by 4px gaps.

### Logo Bar
**Role:** Social proof / 'teams switching from'

Single horizontal row, centered, with competitor wordmarks rendered in #929292 (desaturated) to integrate with the monochrome system. 80–100px vertical padding above and below.

### Two-Column Feature Section
**Role:** Asymmetric content layout

Left column: large headline at 30–36px Inter 600 #262626. Right column: 18px Inter 400 body text in #686868. Column gap 80–120px. No card, no background — just two text columns on the white canvas.

### Feature Checklist Item
**Role:** Bullet item in pricing cards

14px Inter 400 in #262626, preceded by a 16px circular check icon in #262626. 8px row gap between items.

### Chat Bubble (bottom-right)
**Role:** Floating support widget

32px circle, #262626 background, white speech-bubble icon. Fixed position, sits above all content with a small bottom-right offset.

## Do's and Don'ts

### Do
- Use #262626 as the only filled button background — it is the single visual anchor in the monochrome system
- Apply -0.025em letter-spacing to every text element at every size, from 12px captions up to 48px displays
- Use #ededed for all structural dividers, card borders, and input outlines at 1px
- Set card radii to 14px, button radii to 4px, and badge radii to 9999px — these three radii define the visual language
- Limit the chromatic surface tint (#ecfdf5) to success/popular badges only; never apply it to large surfaces
- Keep shadows to the two soft levels: the diffuse card shadow (lab 0.1 25px 50px -12px) and the button micro-shadow (oklab 0.05 1px 2px)
- Maintain 80–160px section padding to preserve the editorial breathing room

### Don't
- Don't introduce a brand color accent — the absence of color IS the brand
- Don't use radii outside the 4 / 8 / 14 / 18 / 9999px scale; no 6px or 12px intermediate values
- Don't add drop shadows heavier than the documented card shadow — anything more theatrical breaks the paper-grain feel
- Don't pair Inter with a second typeface for display use — the single-family commitment is structural
- Don't use #ffffff for text on white surfaces, and don't use #ededed for body text — both will fail contrast
- Don't apply gradients — the system is committed to flat, unshaded fills
- Don't use colored status indicators on the marketing site; restrict color to badges and the pricing 'Popular' highlight

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | The base background; everything else sits on this white field |
| 1 | Card Surface | `#ffffff` | Same hex as canvas but lifted by a 1px #ededed border and a 14–18px radius |
| 2 | Highlighted Surface | `#171717` | Dark inverse used for the 'Popular' pricing tier to break the white field |
| 3 | Accent Wash | `#ecfdf5` | Mint tint applied only to small badge fills (Save 20%, Popular Option) |

## Elevation

- **Dark filled button:** `inset 0 0 0 1px oklab(0.999 0 0 / 0.16), 0 1px 2px oklab(0.269 0 0 / 0.24)`
- **Product mockup frame:** `0 25px 50px -12px lab(0 0 0 / 0.1)`
- **Generic card / elevated panel:** `0 1px 3px lab(0 0 0 / 0.05), 0 1px 2px -1px lab(0 0 0 / 0.05)`

## Imagery

Imagery is almost entirely absent from the marketing surface. The hero relies on typography alone, and the single visual asset is a full product screenshot of the dashboard embedded in a framed card. No photography, no illustration, no decorative graphics, no icon system beyond simple monoline check marks and the X-mark wordmark. When competitor logos appear, they are rendered in #929292 to dissolve into the monochrome field rather than stand out as colorful brand marks.

## Monochrome Brand Discipline

Audyr's defining design choice is the absence of color. There is no primary brand color, no accent hue, no logo tint beyond near-black. This is unusual for a SaaS product and is the visual manifestation of the product's positioning ('know exactly what to build next' = clarity, signal-to-noise). When a designer must add color, the only sanctioned uses are: the dark filled button (#262626), the dark pricing card (#171717), and the mint accent (#ecfdf5) on small positive badges. Every other surface and text element stays in the gray scale.

## Type as the Only Ornament

Because there is no color or imagery to carry visual interest, Inter typography is doing the work of decoration. Three observations a designer should internalize: (1) the uniform -0.025em tracking is applied at every size, so a caption and a display heading share the same optical compression ratio — this is what makes the system feel cohesive, not just consistent. (2) Line-height tightens as size increases (1.56 at 16px body → 1.11 at 48px display), so large headlines sit dense and confident. (3) Weight 600 is used sparingly — only for headlines, section labels, and the tier price — which makes every bold element feel intentional.

## Agent Prompt Guide

primary action: #262626 (filled action)
Create a Primary Action Button: #262626 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Linear** — Same commitment to a single sans-serif at tight tracking, hairline borders, and a near-absence of decorative color — Linear's UI is also a typographic system with grayscale as its base
- **Canny** — Direct competitor in the same product category; shares the feature-feedback dashboard chrome, the pill-shaped badges, and the monochrome data-table aesthetic
- **Vercel** — Same editorial-product sensibility: black-and-white marketing pages, large display headlines, generous section padding, and a single typeface carrying all hierarchy
- **Read.cv** — Same typeset-document philosophy — Inter throughout, tight tracking, no illustrative atmosphere, hairline rules separating content blocks, and an almost total commitment to grayscale

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #262626;
  --color-pure-paper: #ffffff;
  --color-soft-mist: #ededed;
  --color-charcoal: #171717;
  --color-ash: #686868;
  --color-slate: #515151;
  --color-muted: #737373;
  --color-fog: #929292;
  --color-chalk: #cbcbcb;
  --color-mint-whisper: #ecfdf5;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.63;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: -0.5px;
  --text-heading: 24px;
  --leading-heading: 1.4;
  --tracking-heading: -0.6px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.38;
  --tracking-heading-lg: -0.75px;
  --text-display: 48px;
  --leading-display: 1.11;
  --tracking-display: -1.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120-160px;
  --card-padding: 32px;
  --element-gap: 16-20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 18px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-badges: 9999px;
  --radius-images: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-largepanels: 18px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
  --shadow-subtle-2: lab(0 0 0 / 0.05) 0px 1px 2px 0px;
  --shadow-subtle-3: oklab(0.999994 0.0000455678 0.0000200868 / 0.16) 0px 1px 0px 0px inset, oklab(0.268999 -0.00000260025 0.00000627339 / 0.24) 0px 1px 2px 0px;
  --shadow-subtle-4: lab(0 0 0 / 0.05) 0px 1px 3px 0px, lab(0 0 0 / 0.05) 0px 1px 2px -1px;
  --shadow-xl: lab(0 0 0 / 0.1) 0px 25px 50px -12px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-highlighted-surface: #171717;
  --surface-accent-wash: #ecfdf5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #262626;
  --color-pure-paper: #ffffff;
  --color-soft-mist: #ededed;
  --color-charcoal: #171717;
  --color-ash: #686868;
  --color-slate: #515151;
  --color-muted: #737373;
  --color-fog: #929292;
  --color-chalk: #cbcbcb;
  --color-mint-whisper: #ecfdf5;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.63;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: -0.5px;
  --text-heading: 24px;
  --leading-heading: 1.4;
  --tracking-heading: -0.6px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.38;
  --tracking-heading-lg: -0.75px;
  --text-display: 48px;
  --leading-display: 1.11;
  --tracking-display: -1.2px;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 18px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
  --shadow-subtle-2: lab(0 0 0 / 0.05) 0px 1px 2px 0px;
  --shadow-subtle-3: oklab(0.999994 0.0000455678 0.0000200868 / 0.16) 0px 1px 0px 0px inset, oklab(0.268999 -0.00000260025 0.00000627339 / 0.24) 0px 1px 2px 0px;
  --shadow-subtle-4: lab(0 0 0 / 0.05) 0px 1px 3px 0px, lab(0 0 0 / 0.05) 0px 1px 2px -1px;
  --shadow-xl: lab(0 0 0 / 0.1) 0px 25px 50px -12px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
