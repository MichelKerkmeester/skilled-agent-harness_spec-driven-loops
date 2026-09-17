# Rainbow — Style Reference
> rainbow candy floating on cotton-candy sky

**Theme:** light

Rainbow uses a sky-bright, toy-store visual language: pillowy rounded letterforms, candy-saturated accents, and 3D rainbow mascots floating against pastel sky backgrounds. The system is light-mode with a near-black (#0f101a) for all type and iconography, keeping a single high-contrast ink against airy white and lavender surfaces. Two chromatic CTAs — tangerine orange (#ff8a00) and hot pink (#ff54bb) — carry every primary action, paired with full-bleed multi-hue gradients in feature sections that dissolve mint, coral, lavender, and sky-blue into white. Components lean playful and chunky: 40-50px pill radii on buttons, 32px corner radii on device frames, heavy rounded display type at 80-100px with tight -0.03em tracking. The rule is bold-but-soft: large confident shapes, rounded edges everywhere, no harsh shadows or fine borders — depth comes from inset highlights and pastel washes rather than elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#0f101a` | `--color-ink-black` | Primary text, headings, iconography, dark surface anchors — the single high-contrast ink that drives every readable element |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on chromatic fills, inset highlight wash |
| Cloud Gray | `#f1f3f6` | `--color-cloud-gray` | Soft surface wash for alternating bands and section backgrounds, secondary card fills |
| Mist Gray | `#c7c7c7` | `--color-mist-gray` | Inset shadow color for glassy device-frame depth |
| Pebble Gray | `#b8b8b8` | `--color-pebble-gray` | Muted surface for neutral feature phone frames and de-emphasized panels |
| Stone | `#777885` | `--color-stone` | Secondary body text, helper labels, quiet UI annotations — a near-gray that recedes without vanishing |
| True Black | `#000000` | `--color-true-black` | Deepest dark fill for illustration cores, icon glyphs, and shadow bases on device renders |
| Tangerine | `#ff8a00` | `--color-tangerine` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Hot Pink | `#ff54bb` | `--color-hot-pink` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Sky Tint | `#99eeff` | `--color-sky-tint` | Decorative accent wash, soft highlight blocks in feature sections, illustration glow companion |
| Coral Edge | `linear-gradient(270deg, #ff8465 0%, #ff62a3 100%)` | `--color-coral-edge` | Warm accent stroke and text highlight — used sparingly as a coral border or inline emphasis; Orange-to-pink gradient for diagonal brand ribbons, feature section backdrops, and decorative dividers |
| Cotton Sky | `radial-gradient(94.9% 94.9% at 50% 100%, #94ffe8 0%, #e9e2f6 35%, #f1f3f6 100%)` | `--color-cotton-sky` | Radial mint-to-lavender gradient anchoring product showcase sections — dissolves into Cloud Gray at the edges |
| Lavender Mist | `radial-gradient(100% 100% at 50% 100%, #a1cbfd 0%, #e0e5ff 33%, #f1f3f6 100%)` | `--color-lavender-mist` | Radial blue-to-lavender gradient for hero atmosphere and soft section transitions |
| Prism Wash | `linear-gradient(180deg, #75e6ff 0%, #fff0f0 8%, #fef0ff 14%, #fff7f0 21%, #eeebff 29%, #f6ebff 37%, #ffffff 47%, #e5f1ff 67%, #ffffff 100%)` | `--color-prism-wash` | Full multi-stop rainbow linear gradient — the signature 9-stop sweep used in feature bands and illustration environments |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### SF Pro Rounded — Display headlines — the chunky, ultra-rounded Black weight at 80-100px is the signature; tight -0.03em tracking compresses the letterforms into a friendly wall of candy · `--font-sf-pro-rounded`
- **Substitute:** Nunito (900) or Quicksand (700) rounded display substitute
- **Weights:** 900 (Black)
- **Sizes:** 16px, 20px, 24px, 32px, 36px, 42px, 56px, 80px, 96px, 100px
- **Line height:** 1.00, 1.10, 1.20
- **Letter spacing:** -0.03em to -0.02em
- **Role:** Display headlines — the chunky, ultra-rounded Black weight at 80-100px is the signature; tight -0.03em tracking compresses the letterforms into a friendly wall of candy

### SF Pro Rounded — Hero-level headings and large buttons — the 56px tier carries section openers, the 36px tier carries card titles · `--font-sf-pro-rounded`
- **Substitute:** Nunito (800) or Quicksand (700)
- **Weights:** 800 (Heavy)
- **Sizes:** 
- **Line height:** 1.10–1.20
- **Letter spacing:** -0.028em at 56px, -0.018em at 36px
- **Role:** Hero-level headings and large buttons — the 56px tier carries section openers, the 36px tier carries card titles

### SF Pro Rounded — Subheadings, navigation, and emphasized body — the 42px tier carries panel headings, 20-24px carries inline emphasis · `--font-sf-pro-rounded`
- **Substitute:** Nunito (600) or Quicksand (500)
- **Weights:** 600 (Semibold)
- **Sizes:** 
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.031em
- **Role:** Subheadings, navigation, and emphasized body — the 42px tier carries panel headings, 20-24px carries inline emphasis

### SF Pro Rounded — Body text at standard reading sizes — the everyday voice, used in paragraph copy and list items · `--font-sf-pro-rounded`
- **Substitute:** Nunito (500) or Quicksand (500)
- **Weights:** 500 (Medium)
- **Sizes:** 
- **Line height:** 
- **Role:** Body text at standard reading sizes — the everyday voice, used in paragraph copy and list items

### SF Pro Rounded — Button labels and emphasized inline links — 16px is the standard action-label size, tight -0.01em tracking · `--font-sf-pro-rounded`
- **Substitute:** Nunito (700) or Quicksand (600)
- **Weights:** 700 (Bold)
- **Sizes:** 
- **Line height:** 
- **Letter spacing:** -0.01em
- **Role:** Button labels and emphasized inline links — 16px is the standard action-label size, tight -0.01em tracking

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 16px | 1.2 | -0.01px | `--text-body` |
| body-lg | 20px | 1.2 | -0.031px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.031px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.031px | `--text-heading-sm` |
| heading | 42px | 1.1 | -0.031px | `--text-heading` |
| heading-lg | 56px | 1.1 | -0.028px | `--text-heading-lg` |
| display | 100px | 1 | -0.03px | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 32px |
| icons | 10px |
| pills | 50px |
| buttons | 40px |
| maxRadius | 100px |
| deviceFrames | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(255, 255, 255, 0.32) 0px 5px 32px 12px inset, rgba(2...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Tangerine CTA Button
**Role:** Primary action on light backgrounds

Filled #ff8a00 with white SF Pro Rounded Bold 16px text (-0.01em tracking). 40-50px pill radius, ~16px 24px padding. Pairs with a small white-tile icon containing a rainbow illustration on the right.

### Hot Pink CTA Button
**Role:** Companion primary action — download prompts, paired with tangerine

Filled #ff54bb with white SF Pro Rounded Bold 16px text. Same 40-50px pill radius and 16px 24px padding as tangerine. Always appears as a duo with the tangerine button for the two download paths.

### Navigation Bar
**Role:** Top-of-page sticky header

Transparent over hero sky background. Logo (rainbow icon tile) left, nav links (Get Support, Updates, Learn, Twitter icon) center-right, white pill Download button far right with 9999px radius and 12px 20px padding.

### Ghost Download Button (Nav)
**Role:** Secondary nav action — contrast to flat nav links

White fill, Ink Black text, fully rounded pill, SF Pro Rounded Bold 14-16px. The only filled button in the nav, drawing the eye to the download entry point.

### Device Frame Card
**Role:** Feature illustration container — phone and extension mockups

32px corner radius, Cloud Gray (#f1f3f6) or feature-specific solid fill, no border. Inset white highlight via rgba(255,255,255,0.32) 0px 5px 32px 12px inset shadow for glassy depth. Phone frames use a darker outline (#0f101a or #000000) for silhouette.

### Feature Phone Card (Color Variant)
**Role:** Product showcase card in feature grid

Each card uses a unique solid color fill — Cloud Gray, Stone, Pebble, Tangerine, Ink Black — with a phone mockup floating on top. 24-32px radius, no border, 48-60px internal padding. The card color is the identity signal; the phone is the content.

### Rainbow Icon Tile
**Role:** Brand mark and inline CTA companion

White rounded square (16-20px radius) containing a small multi-color rainbow illustration. Appears inside CTA buttons and as the nav logo. The rainbow illustration is always the same 5-band arc: red, orange, yellow, green, blue/purple.

### 3D Rainbow Illustration
**Role:** Hero mascot and decorative atmosphere

Dimensional 5-band rainbow arc with glossy 3D shading — magenta, orange, yellow, green, blue bands rendered with specular highlights. Appears as a large floating element in the hero (60-80% screen height) and as smaller inline companions. One variant includes a planet ring (Saturn-like orb).

### Network Status Toast
**Role:** Inline notification — network switch confirmation

White pill with 16px radius, 12-16px padding. Contains a small colored circle icon (Optimism = #ff5050 red), Ink Black bold label, and gray subtext. Floats with soft drop shadow, not a sharp border.

### Sparkle Accent
**Role:** Decorative illustration element in hero

Yellow 4-pointed star with soft outer glow, ~32-48px. Appears as 2-3 scattered elements around hero illustrations to add sparkle atmosphere. Solid #fae300 fill with no stroke.

### Gradient Section Backdrop
**Role:** Full-bleed atmospheric divider between content sections

Radial gradient anchored at bottom center — typically mint or sky-blue dissolving through lavender into Cloud Gray at the top edge. No hard edges; the gradient carries the section transition. Width = 100vw, height = 80-120% of viewport.

## Do's and Don'ts

### Do
- Use SF Pro Rounded at weights 600-900 for all visible type; the rounded letterforms are the brand voice and a sharp sans-serif breaks the personality
- Set display headlines at 56px or larger with -0.028em to -0.03em tracking — anything smaller loses the candy-wall effect
- Use only Tangerine (#ff8a00) and Hot Pink (#ff54bb) as filled button backgrounds; never use the near-black or gray as a button fill
- Apply 40-50px pill radius to all interactive elements — buttons, nav links, toasts, and download CTAs should all read as pebbles
- Let the multi-stop Prism Wash gradient breathe as a full-bleed section background at 100% viewport width; never crop it into a contained box
- Pair every CTA with a white-tile rainbow icon on the right side — the icon is a brand mark, not decoration
- Use 32px corner radii for all device frames, cards, and large illustration containers — this radius is the visual signature separating Rainbow from typical 8-12px rounded SaaS

### Don't
- Do not introduce a new accent color outside the tangerine/pink/coral/sky-tint system — the palette is intentionally narrow
- Do not use flat drop shadows on cards; depth must come from inset white highlights or pastel gradient washes, not outer shadows
- Do not set body text below 16px or above 20px in the rounded family — the type scale jumps from 20px straight to 32px+ for emphasis
- Do not use sharp corners on anything user-facing — minimum 10px radius on icons, 32px on all frames
- Do not place the rainbow logo on a chromatic background without a white container tile — the logo needs a white stage
- Do not stack more than two filled CTA buttons in a row; Tangerine and Hot Pink are the only allowed duo
- Do not use thin 1px borders for separation — prefer Cloud Gray surface shifts or generous whitespace gaps of 48px+
- Do not let gradients resolve to hard color blocks; every gradient should dissolve to white or Cloud Gray at one edge

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sky Canvas | `#ffffff` | Base page background — pure white anchors every section |
| 1 | Cloud Surface | `#f1f3f6` | Alternating section wash, secondary card fill, card on light backgrounds |
| 2 | Pastel Gradient Atmosphere | `#e9e2f6` | Full-bleed section backdrop — radial lavender/mint dissolving into white |
| 3 | Feature Color Block | `#ff8a00` | Feature card fill when a specific feature must pop — used on tangerine and pink accent cards |

## Elevation

Rainbow deliberately avoids outer drop shadows. Depth is created three ways: (1) inset white highlight rgba(255,255,255,0.32) 0px 5px 32px 12px on glassy device frames to simulate internal light, (2) pastel gradient washes that make a surface feel atmospheric rather than flat, and (3) 32-50px corner radii that make shapes read as inflated pillows rather than rigid boxes. The system trusts soft edges and color over shadow to communicate hierarchy.

## Imagery

Rainbow's visual language is dominated by 3D-rendered rainbow illustrations — glossy dimensional arc shapes with five smooth color bands (magenta, orange, yellow, green, blue) lit with specular highlights. These appear as hero mascots at 60-80% screen height and as small companion icons inside white rounded tiles on CTA buttons. Supplementary 3D elements include a Saturn-style ringed orb and a few yellow 4-point sparkle stars scattered as atmosphere. Product screenshots appear inside phone and browser-extension device frames with 32px corner radii. No photography, no flat illustration, no real human imagery — the entire visual system is synthetic 3D candy and product UI mockups floating on pastel gradient skies.

## Layout

Full-bleed page with no persistent sidebar. The hero is a centered headline-over-gradient layout with floating 3D illustrations on the left and a product mockup on the right, against a sky-blue atmosphere with cloud shapes. The Download CTA pair (Tangerine + Hot Pink) sits centered below the headline. The second section flips to a split layout: extension window mockup left, mobile phone mockup right, both anchored on a soft lavender-to-white radial gradient, with a small floating network-switch toast on the far left. The third section is a horizontal row of 5 feature phone cards, each in a different solid color (Cloud Gray, Stone, Pebble, Tangerine, Ink Black), 32px radii, evenly spaced. Navigation is a minimal transparent top bar with a right-aligned white pill Download button. Section rhythm is: hero (sky blue) → product showcase (lavender gradient) → feature cards (Cloud Gray) → likely text sections below at 80px vertical gaps.

## Agent Prompt Guide

Quick Color Reference:
- text: #0f101a
- background: #ffffff
- surface: #f1f3f6
- border: #777885
- accent: #ff54bb
- primary action: no distinct CTA color

3 Example Component Prompts:
1. Create a hero section: white (#ffffff) base with a sky-blue (#a1cbfd) to lavender (#e0e5ff) radial gradient backdrop fading into Cloud Gray. Centered headline at 100px SF Pro Rounded weight 900, #0f101a, letter-spacing -0.03em, line-height 1.0. Subheadline at 20px weight 500 #0f101a. Below, two side-by-side filled pill buttons: Tangerine #ff8a00 and Hot Pink #ff54bb, both 40px radius, white text 16px weight 700, 16px 24px padding, each with a white rounded tile containing a rainbow icon on the right side.
2. Create a feature phone card: 32px corner radius, Tangerine #ff8a00 solid fill, 60px internal padding. Inside, a phone mockup at 50% card width with a 32px corner radius, no border, floating centered. Below the phone, a label in 16px SF Pro Rounded weight 600, white text, centered.
3. Create a network-switch toast: white (#ffffff) pill, 16px radius, 12px 20px padding, soft drop shadow rgba(0,0,0,0.08). Contains a small 24px circle in #ff5050 (Optimism red), then 16px bold #0f101a label, then 14px medium #777885 subtext. Floats above content with 16px gap from edges.

## Gradient System

Rainbow's gradients are signature atmosphere, not decoration. Three gradient families are at work:

1. Section Atmosphere — radial gradients anchored at bottom-center, starting from a pastel hue (mint #94ffe8, sky #a1cbfd) and dissolving through lavender into Cloud Gray. These carry section transitions and are always full-bleed.

2. The Prism Sweep — a 9-stop linear gradient from sky-blue through warm pinks, yellows, and lavenders back to white. Used as full-bleed feature-section backgrounds. The hue journey is the brand identity in gradient form.

3. Brand Ribbon — the 270deg coral-to-pink (#ff8465 → #ff62a3) diagonal gradient, used for accent strips, decorative borders, and warm emphasis surfaces.

Rules: gradients always resolve to white or Cloud Gray at one edge — never to a hard color stop. Never tile or contain a gradient in a box; always full-bleed or in large 32px+ radius shapes.

## Similar Brands

- **Magic Eden** — Same crypto-wallet palette of pastel gradient skies and candy-saturated accent buttons, though Magic Eden leans more purple
- **Phantom Wallet** — Similar playful rounded typography and bright chromatic CTA buttons against clean white surfaces
- **LottieFiles** — Same multi-hue pastel gradient section transitions and rounded display-type attitude
- **Uniswap** — Shared visual DNA of candy-bright accent colors on white surfaces, though Uniswap uses a more restrained pink-only system
- **Coinbase** — Both treat crypto as approachable and colorful rather than dark-and-technical, with large rounded display type and pill-shaped CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #0f101a;
  --color-pure-white: #ffffff;
  --color-cloud-gray: #f1f3f6;
  --color-mist-gray: #c7c7c7;
  --color-pebble-gray: #b8b8b8;
  --color-stone: #777885;
  --color-true-black: #000000;
  --color-tangerine: #ff8a00;
  --color-hot-pink: #ff54bb;
  --color-sky-tint: #99eeff;
  --color-coral-edge: #ff8465;
  --gradient-coral-edge: linear-gradient(270deg, #ff8465 0%, #ff62a3 100%);
  --color-cotton-sky: #94ffe8;
  --gradient-cotton-sky: radial-gradient(94.9% 94.9% at 50% 100%, #94ffe8 0%, #e9e2f6 35%, #f1f3f6 100%);
  --color-lavender-mist: #a1cbfd;
  --gradient-lavender-mist: radial-gradient(100% 100% at 50% 100%, #a1cbfd 0%, #e0e5ff 33%, #f1f3f6 100%);
  --color-prism-wash: #75e6ff;
  --gradient-prism-wash: linear-gradient(180deg, #75e6ff 0%, #fff0f0 8%, #fef0ff 14%, #fff7f0 21%, #eeebff 29%, #f6ebff 37%, #ffffff 47%, #e5f1ff 67%, #ffffff 100%);

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-rounded: 'SF Pro Rounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -0.01px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.031px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.031px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.031px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -0.031px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.028px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -0.03px;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-3xl-4: 43px;
  --radius-full: 50px;
  --radius-full-2: 64px;
  --radius-full-3: 100px;

  /* Named Radii */
  --radius-cards: 32px;
  --radius-icons: 10px;
  --radius-pills: 50px;
  --radius-buttons: 40px;
  --radius-maxradius: 100px;
  --radius-deviceframes: 32px;

  /* Shadows */
  --shadow-xl: rgba(255, 255, 255, 0.32) 0px 5px 32px 12px inset, rgba(255, 255, 255, 0.44) 0px 1px 4px 0px inset;

  /* Surfaces */
  --surface-sky-canvas: #ffffff;
  --surface-cloud-surface: #f1f3f6;
  --surface-pastel-gradient-atmosphere: #e9e2f6;
  --surface-feature-color-block: #ff8a00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #0f101a;
  --color-pure-white: #ffffff;
  --color-cloud-gray: #f1f3f6;
  --color-mist-gray: #c7c7c7;
  --color-pebble-gray: #b8b8b8;
  --color-stone: #777885;
  --color-true-black: #000000;
  --color-tangerine: #ff8a00;
  --color-hot-pink: #ff54bb;
  --color-sky-tint: #99eeff;
  --color-coral-edge: #ff8465;
  --color-cotton-sky: #94ffe8;
  --color-lavender-mist: #a1cbfd;
  --color-prism-wash: #75e6ff;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-rounded: 'SF Pro Rounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -0.01px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.031px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.031px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.031px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -0.031px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.028px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -0.03px;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-3xl-4: 43px;
  --radius-full: 50px;
  --radius-full-2: 64px;
  --radius-full-3: 100px;

  /* Shadows */
  --shadow-xl: rgba(255, 255, 255, 0.32) 0px 5px 32px 12px inset, rgba(255, 255, 255, 0.44) 0px 1px 4px 0px inset;
}
```
