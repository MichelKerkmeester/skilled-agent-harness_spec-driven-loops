# Unicorn Studio — Style Reference
> aurora behind smoked glass — a black velvet void pierced by prismatic violet light, with type that breathes quietly beside it

**Theme:** dark

Unicorn Studio lives in a near-black void where light itself becomes the product: the canvas is a matte charcoal, typography whispers in cool pearl grays, and the only chromatic voice is a violet WebGL aurora that bleeds through gradients, link borders, and hero atmospheres. Surfaces stack in barely-perceptible steps of darkness — #08080a → #0d0d12 → #17171c — so depth is communicated through value shifts rather than shadows, with a thin dark key-line (`#31313a`, -1px offset) doing the work of elevation on interactive elements. The display face is Overused Grotesk with aggressive negative tracking (up to -0.063em), pulling letters so close they almost touch, while body text stays in the system stack at a comfortable 16px with subtle -0.01em tightening. Interaction is restrained: light-filled cream buttons against the void, hairline violet underlines on links, and 3px micro-radii that keep the language architectural rather than friendly.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#08080a` | `--color-void` | Page canvas, deepest surface, card backgrounds — the base layer against which everything else floats |
| Charcoal | `#0d0d12` | `--color-charcoal` | Section backgrounds, elevated panels, modal surfaces — first step off the canvas |
| Graphite | `#17171c` | `--color-graphite` | Card surfaces, nested containers, secondary panels |
| Slate | `#25252d` | `--color-slate` | Elevated surface fill, subtle button hover states, dark interactive variant |
| Iron | `#31313a` | `--color-iron` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Ash | `#62626f` | `--color-ash` | Muted helper text, inactive icons, low-emphasis body |
| Fog | `#8b8e9c` | `--color-fog` | Secondary text, placeholder copy, subheadings, icon strokes |
| Pearl | `#aeaac0` | `--color-pearl` | Primary body text, card borders, heading borders — the dominant foreground voice |
| Chalk | `#dad7de` | `--color-chalk` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Lavender Beam | `#ab8ff1` | `--color-lavender-beam` | Link borders, accent strokes, chromatic highlight — the violet signal that breaks the monochrome |
| Iris Glow | `#8960f0` | `--color-iris-glow` | Deeper violet for link hover, gradient endpoint, chromatic emphasis on interactive accents |
| WebGL Aurora | `radial-gradient(circle, rgb(142, 108, 228), rgb(114, 79, 201))` | `--color-webgl-aurora` | Hero radial gradient — the signature prismatic light burst that defines the brand atmosphere |

## Tokens — Typography

### Overused Grotesk — Display and heading face — the signature voice. Aggressive negative tracking (up to -6.3%) pulls letters into near-contact, and near-1.0 line-height lets large sizes stack tight without descender collision. Weight stays at 400–500; the font does the shouting through size and tracking, not weight. · `--font-overused-grotesk`
- **Substitute:** Inter Tight, General Sans, Söhne Breit
- **Weights:** 400, 500
- **Sizes:** 26px, 32px, 48px, 64px, 215px
- **Line height:** 0.99–1.00
- **Letter spacing:** -0.0300em at 26px, -0.0400em at 32–48px, -0.0630em at 64px+
- **Role:** Display and heading face — the signature voice. Aggressive negative tracking (up to -6.3%) pulls letters into near-contact, and near-1.0 line-height lets large sizes stack tight without descender collision. Weight stays at 400–500; the font does the shouting through size and tracking, not weight.

### Sprat — Secondary display for select editorial moments. Same tight tracking philosophy as Overused Grotesk but with a different personality — more condensed, more fragile. Use sparingly for typographic variety, not as a workhorse. · `--font-sprat`
- **Substitute:** Migra, Editorial New, Tobias
- **Weights:** 500
- **Sizes:** 46px, 61px
- **Line height:** 1.00
- **Letter spacing:** -0.0420em
- **Role:** Secondary display for select editorial moments. Same tight tracking philosophy as Overused Grotesk but with a different personality — more condensed, more fragile. Use sparingly for typographic variety, not as a workhorse.

### -apple-system — Body, UI, navigation, buttons, cards. The system stack keeps file weight at zero and provides a neutral voice for everything that isn't display. Subtle -1% tracking tightens the default rendering without distorting it. Weight 500 is the default emphasis level, not 600 or 700. · `--font-apple-system`
- **Substitute:** Inter, -apple-system, system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 13px, 14px, 16px, 18px
- **Line height:** 1.20–1.40
- **Letter spacing:** -0.0100em
- **Role:** Body, UI, navigation, buttons, cards. The system stack keeps file weight at zero and provides a neutral voice for everything that isn't display. Subtle -1% tracking tightens the default rendering without distorting it. Weight 500 is the default emphasis level, not 600 or 700.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.4 | -0.13px | `--text-caption` |
| body | 16px | 1.4 | -0.16px | `--text-body` |
| subheading | 18px | 1.4 | -0.18px | `--text-subheading` |
| heading-sm | 26px | 1 | -0.78px | `--text-heading-sm` |
| heading | 32px | 1 | -1.28px | `--text-heading` |
| heading-lg | 48px | 1 | -1.92px | `--text-heading-lg` |
| display | 64px | 0.99 | -4.03px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 118 | 118px | `--spacing-118` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 3px |
| cards | 10px |
| inputs | 3px |
| buttons | 3px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.25) 0px 1px 4px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.4) 0px 2px 4px -1.5px` | `--shadow-sm-2` |
| subtle | `rgb(49, 49, 58) 0px -1px 0px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 30px
- **Element gap:** 18-20px

## Components

### Primary Filled Button
**Role:** Main call-to-action (Sign up, Start creating)

Light cream fill (#dad7de) on dark canvas, with near-black text (#08080a). 3px border-radius keeps the silhouette sharp and architectural. Padding approximately 8px vertical, 14px horizontal. A thin dark key-line at the bottom (`box-shadow: #31313a 0 -1px 0 0`) gives a subtle cap-edge effect. System font, weight 500, 14px.

### Ghost / Outlined Button
**Role:** Secondary navigation action (Login)

Transparent fill, 1px border in #8b8e9c or #aeaac0, text in matching Pearl. Same 3px radius. Used for lower-emphasis actions in the nav bar where the filled button already claims the primary slot.

### Chromatic Link
**Role:** Inline text links with violet underline

Pearl text (#aeaac0) with a 1px bottom border in Lavender Beam (#ab8ff1) or Iris Glow (#8960f0). The violet underline is the only chromatic signal in the body content area — it acts as a path through an otherwise monochrome text field. 3px radius on interactive containers.

### New Badge / Announcement Pill
**Role:** Eyebrow tag above hero or on feature cards

Small pill (3px radius) with thin border (#aeaac0 at low opacity), dark fill, system font at 13px. Contains a small dot or star glyph in Lavender Beam followed by label text. Sits centered above hero headlines as a quiet announcement mechanism.

### Hero Gradient Banner
**Role:** Full-bleed hero with WebGL aurora background

Canvas (#08080a) base with a centered radial gradient (`radial-gradient(circle, rgb(142, 108, 228), rgb(114, 79, 201))`) bleeding violet prismatic light from the lower-center. Eyebrow pill, then 64px Overused Grotesk headline in Chalk, then 18px subheading in Pearl/Fog, then primary filled button. Generous vertical breathing room before and after.

### Card Surface
**Role:** Content cards, feature blocks, gallery items

Graphite (#17171c) fill or transparent on Panel (#0d0d12). 10px border-radius — the only large radius in the system, reserved for cards to distinguish them from the sharp-edged buttons. Thin 1px border in Pearl (#aeaac0) at low opacity for definition. Internal padding 30px.

### Social Proof Logo Strip
**Role:** Brand logos below hero

Horizontal row of monochrome logos in Ash (#62626f) or Fog (#8b8e9c) on the canvas. Centered, with small 'Loved by designers at' label in muted Ash above. Logos are grayscaled — no brand color bleed into the monochrome system.

### Navigation Bar
**Role:** Top-level site navigation

Transparent on canvas (#08080a). Left: logo glyph + 'Unicorn' wordmark in Pearl. Right: text links (Inspiration, Resources, Pricing) in Pearl, then filled Sign up button, then ghost Login button. Vertical padding ~16px, items baseline-aligned with 19px gaps between nav items.

### Text Input / Form Field
**Role:** Form inputs, search fields

Dark surface (#17171c) with 1px border in Fog (#8b8e9c). 3px radius. System font 14px, placeholder in Ash (#62626f). Focus state tightens border to Lavender Beam (#ab8ff1) — the only chromatic input signal in the system.

### Icon
**Role:** UI icons, feature glyphs, nav indicators

Stroke-based, 1–1.5px stroke weight, Fog (#8b8e9c) default, Pearl (#aeaac0) on active/hover. Outlined style, never filled. No multicolor icons — all mono. The small 3px radius on icon containers keeps them architectural.

### Section Header Stack
**Role:** Headline + subhead + optional CTA above any content block

Centered stack: Overused Grotesk heading at 48–64px in Chalk, then 18px subheading in Fog below, then optional action below. Generous spacing (40–60px between elements). The heading does the work; the subhead recedes.

## Do's and Don'ts

### Do
- Use the neutral surface stack (#08080a → #0d0d12 → #17171c → #25252d) for all depth communication — never rely on heavy drop shadows
- Set headline letter-spacing to -0.063em at 64px+ and -0.040em at 32–48px to match the Overused Grotesk display voice
- Use the 10px radius exclusively for cards; use 3px for all buttons, tags, and inputs
- Reserve Lavender Beam (#ab8ff1) for link underlines, focus states, and the WebGL aurora gradient — it is the only chromatic signal in the system
- Keep body text in the system stack (-apple-system) at 16px / 1.4 line-height / -0.01em tracking
- Apply the dark key-line `box-shadow: #31313a 0 -1px 0 0` to all primary filled buttons for the signature cap-edge effect
- Default to filled cream buttons (#dad7de bg, #08080a text) for all primary actions; use ghost/outlined only for secondary nav actions

### Don't
- Don't introduce filled colored buttons — the primary action is always light-on-dark, never violet-on-dark
- Don't use radii larger than 10px — anything rounder breaks the architectural language
- Don't use font-weight above 600 — the system communicates emphasis through size and tracking, not weight
- Don't add chromatic colors beyond the violet family — the monochrome + violet discipline IS the brand
- Don't use line-height above 1.4 on body text or below 1.0 on display text
- Don't apply drop shadows to static elements — shadows are reserved for interactive feedback and floating overlays
- Don't use color for state communication (hover, active, disabled) — use border opacity, text opacity, or surface value shifts instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#08080a` | Page background, the void — the darkest layer, used for full-page surface and most section backgrounds |
| 1 | Panel | `#0d0d12` | First surface elevation — section-level containers, hero overlays, contained content blocks |
| 2 | Card | `#17171c` | Nested cards, feature blocks, content surfaces that need to sit above the section |
| 3 | Elevated | `#25252d` | Highest interactive surface — hover states, selected items, popover backgrounds |

## Elevation

- **Primary Filled Button:** `rgb(49, 49, 58) 0px -1px 0px 0px`
- **Interactive links and cards:** `rgba(0, 0, 0, 0.25) 0px 1px 4px 0px`
- **Floating panels, popovers:** `rgba(0, 0, 0, 0.4) 0px 2px 4px -1.5px`

## Imagery

Imagery is dominated by the WebGL aurora — a prismatic radial gradient of violet-to-iris light that bleeds from the lower-center of the hero, creating an atmospheric light burst on the dark canvas. This is not photography or illustration; it is generated motion graphics that makes the product's capability (WebGL interactivity) the visual identity itself. Social proof uses flat monochrome logo strips in muted Ash. The rest of the site is almost entirely text-dominant with no decorative imagery — the void IS the canvas, and any visual energy comes from the single hero gradient and content screenshots if present.

## Layout

Centered, max-width ~1200px contained layout with full-bleed dark canvas. The hero is the visual anchor: full-width, 80+vh, with the WebGL aurora gradient occupying the lower-center and the headline+subhead+CTA stack centered vertically and horizontally. Below the hero, content flows in single full-width bands with generous 96px section gaps, each band internally max-width contained. Feature blocks alternate between left-aligned text+visual grids and centered stacks. The social proof logo strip sits as a thin band between hero and first content section. Navigation is a minimal transparent top bar, not sticky. The entire layout is centered symmetric — no asymmetric or sidebar layouts — which keeps focus on the atmospheric hero and the centered typographic moments.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #aeaac0
- text (muted): #62626f
- text (bright): #dad7de
- background (canvas): #08080a
- background (card): #17171c
- border: #aeaac0
- accent (links, focus): #ab8ff1
- primary action: #25252d (filled action)

**Example Component Prompts**

1. *Hero with WebGL aurora*: Full-bleed #08080a canvas with a centered radial gradient (`radial-gradient(circle, #8e6ce4, #724fc9)`) bleeding from the lower-center. Centered eyebrow pill (3px radius, thin #aeaac0 border, dark fill, 13px system font, Lavender Beam dot). Headline at 64px Overused Grotesk weight 400, color #dad7de, letter-spacing -4.03px, line-height 0.99. Subheadline at 18px system font weight 400, color #aeaac0, line-height 1.4. Light filled button: #dad7de background, #08080a text, 3px radius, 8px 14px padding, system font 14px weight 500, with `box-shadow: #31313a 0 -1px 0 0`.

2. *Content card*: #17171c fill, 1px border in #aeaac0 at 0.3 opacity, 10px radius, 30px padding. Heading at 32px Overused Grotesk weight 400 in #dad7de, letter-spacing -1.28px. Body at 16px system font in #aeaac0, line-height 1.4. Optional 1px Lavender Beam (#ab8ff1) underline on any inline link.

3. *Outlined ghost nav button*: Transparent fill, 1px border in #8b8e9c, text in #aeaac0, 3px radius, 6px 12px padding, 14px system font weight 500. No box-shadow.

4. *New announcement pill*: #08080a fill, 1px border in #aeaac0 at 0.4 opacity, 3px radius, 5px 10px padding, 13px system font weight 500, #aeaac0 text. Leading 4px dot in #ab8ff1.

5. *Social proof logo strip*: Full-width band on #08080a, centered 'Loved by designers at' label in 13px #62626f, followed by horizontal row of logos in #62626f, 19px gaps between logos. No colored logos — all monochrome gray.

## Similar Brands

- **Linear** — Same dark-mode discipline with a near-black canvas, minimal accent color, and a custom display typeface with tight negative tracking on large headlines
- **Vercel** — Monochrome dark UI with a single chromatic accent and ultra-tight display tracking — the light-on-dark inverted contrast philosophy
- **Resend** — Dark canvas, system font body, tight display headings, and restrained use of a single chromatic accent for interactive elements
- **Spline** — Direct peer in the WebGL/3D design tool space — same dark void aesthetic with prismatic gradient hero and light-filled primary buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #08080a;
  --color-charcoal: #0d0d12;
  --color-graphite: #17171c;
  --color-slate: #25252d;
  --color-iron: #31313a;
  --color-ash: #62626f;
  --color-fog: #8b8e9c;
  --color-pearl: #aeaac0;
  --color-chalk: #dad7de;
  --color-lavender-beam: #ab8ff1;
  --color-iris-glow: #8960f0;
  --color-webgl-aurora: #8e6ce4;
  --gradient-webgl-aurora: radial-gradient(circle, rgb(142, 108, 228), rgb(114, 79, 201));

  /* Typography — Font Families */
  --font-overused-grotesk: 'Overused Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sprat: 'Sprat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.78px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -1.28px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.92px;
  --text-display: 64px;
  --leading-display: 0.99;
  --tracking-display: -4.03px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-118: 118px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 30px;
  --element-gap: 18-20px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 3px;
  --radius-cards: 10px;
  --radius-inputs: 3px;
  --radius-buttons: 3px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.25) 0px 1px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.4) 0px 2px 4px -1.5px;
  --shadow-subtle: rgb(49, 49, 58) 0px -1px 0px 0px;

  /* Surfaces */
  --surface-canvas: #08080a;
  --surface-panel: #0d0d12;
  --surface-card: #17171c;
  --surface-elevated: #25252d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #08080a;
  --color-charcoal: #0d0d12;
  --color-graphite: #17171c;
  --color-slate: #25252d;
  --color-iron: #31313a;
  --color-ash: #62626f;
  --color-fog: #8b8e9c;
  --color-pearl: #aeaac0;
  --color-chalk: #dad7de;
  --color-lavender-beam: #ab8ff1;
  --color-iris-glow: #8960f0;
  --color-webgl-aurora: #8e6ce4;

  /* Typography */
  --font-overused-grotesk: 'Overused Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sprat: 'Sprat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.78px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -1.28px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.92px;
  --text-display: 64px;
  --leading-display: 0.99;
  --tracking-display: -4.03px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-118: 118px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.25) 0px 1px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.4) 0px 2px 4px -1.5px;
  --shadow-subtle: rgb(49, 49, 58) 0px -1px 0px 0px;
}
```
