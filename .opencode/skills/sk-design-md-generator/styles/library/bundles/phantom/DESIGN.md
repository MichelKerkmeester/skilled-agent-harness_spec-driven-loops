# Phantom — Style Reference
> lavender candy shop at dusk. A monochromatic violet world where everything is a soft pill on a near-white plane, interrupted by a mischievous ghost and pastel highlights.

**Theme:** mixed

Phantom is a soft, monochromatic crypto-wallet world bathed in aubergine and lavender. The interface lives in a near-white canvas but bleeds into deep violet sections, creating a mood that oscillates between airy and intimate. Typography is whisper-weight (350) with aggressive negative tracking, letting massive 80-96px hero lines float with grace. The defining signature is generous pill-shaped geometry — navigation, buttons, and cards all dissolve into capsule forms with 24-100px radii. A single ghost mascot replaces vowels in headlines, breaking the grid with playful subversion. The palette is deliberately narrow: one primary violet does all the structural work, while pastel button tints (lavender, butter, blush) create a candy-store rhythm against the restrained backdrop.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine | `#3c315b` | `--color-aubergine` | Primary brand — navigation borders, nav text, heading text, card surfaces in dark sections, icon strokes. The structural spine of the entire system |
| Ghost Lavender | `#e2dffe` | `--color-ghost-lavender` | Primary action — filled CTA button background, violet glow shadow on buttons. The light-on-light button that only reveals its presence through a soft 4px halo |
| Periwinkle | `#ab9ff2` | `--color-periwinkle` | Secondary action — brighter lavender for secondary CTAs, decorative fills, icon accents. Adds saturation to the pale-violet world |
| Cornflower Pop | `#4a87f2` | `--color-cornflower-pop` | Accent button — occasional vivid blue button for emphasis or differentiation. Use sparingly as a high-energy interruption |
| Buttercream | `#ffffc4` | `--color-buttercream` | Accent button — pale yellow button fill for variety in multi-action contexts. Pastel punctuation in the candy palette |
| Blush Mist | `#ffdadc` | `--color-blush-mist` | Accent button — near-gray pink button for warmth and tonal range. The softest of the pastel set |
| Mint Signal | `#2ec08b` | `--color-mint-signal` | Success badge — vivid green for status indicators, positive confirmations, live signals |
| Paper White | `#fdfcfe` | `--color-paper-white` | Canvas — page background, card surfaces, button borders, text on dark backgrounds. Near-white with the faintest cool tint |
| Obsidian | `#1c1c1c` | `--color-obsidian` | Body text, heading text on light backgrounds, button borders, card borders. The near-black ink for all foreground content |
| Fog | `#86848d` | `--color-fog` | Muted text, icon strokes, secondary nav borders. The quiet gray for non-emphasized elements |
| Ash | `#e9e8ea` | `--color-ash` | Button background, subtle surface fill. The neutral pale surface beneath lavender hero panels |
| Bone | `#f4f2f4` | `--color-bone` | Surface background — light section panels, button fills. The warmest of the near-white neutrals |

## Tokens — Typography

### Phantom — Custom typeface used for everything. Weight 350 is the default body and display weight — unconventional lightness creates an airy, anti-bold personality. Weight 400 reserved for body copy that needs slightly more presence. Sizes scale dramatically from 13px caption to 96px display. Tight -0.025em letter-spacing at all sizes creates compressed, high-density headlines. Line-height collapses to 1.0-1.1 at display sizes for sculptural headline forms. · `--font-phantom`
- **Substitute:** Inter, Söhne, or DM Sans at matching weight 300/400 with -0.025em tracking
- **Weights:** 350, 400
- **Sizes:** 13, 15, 16, 20, 24, 30, 64, 80, 96
- **Line height:** 1.00, 1.10, 1.20, 1.21, 1.25, 1.35, 1.40
- **Letter spacing:** -0.025em at all sizes (converts to -2.4px at 96px, -1.6px at 64px, -0.4px at 16px, -0.325px at 13px)
- **Role:** Custom typeface used for everything. Weight 350 is the default body and display weight — unconventional lightness creates an airy, anti-bold personality. Weight 400 reserved for body copy that needs slightly more presence. Sizes scale dramatically from 13px caption to 96px display. Tight -0.025em letter-spacing at all sizes creates compressed, high-density headlines. Line-height collapses to 1.0-1.1 at display sizes for sculptural headline forms.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.35 | — | `--text-caption` |
| body-sm | 15px | 1.4 | -0.375px | `--text-body-sm` |
| subheading | 20px | 1.35 | -0.5px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.6px | `--text-heading-sm` |
| heading | 30px | 1.21 | -0.75px | `--text-heading` |
| heading-lg | 64px | 1.1 | -1.6px | `--text-heading-lg` |
| display | 96px | 1 | -2.4px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px |
| tags | 100px |
| cards | 24px |
| links | 32px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgb(226, 223, 254) 0px 0px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 48px
- **Element gap:** 8-16px

## Components

### Pill Navigation Bar
**Role:** Primary site navigation

White pill container (#fdfcfe) with full 100px border-radius, containing nav links (Features, Learn, Explore, Company, Developers, Support) at 15px weight 350 in #3c315b. Each link has a 4px chevron indicator. Separated from the logo and Download CTA by 24-48px gap. The pill geometry is signature-defining — no flat nav bars allowed.

### Download Button (Header)
**Role:** Primary CTA in navigation

Ghost Lavender (#e2dffe) fill with #3c315b text, 100px border-radius, 16px 32px padding, 16px font size weight 350. Gains a subtle rgb(226,223,254) 0px 0px 4px 0px glow. Sits at the far right of the header.

### Hero Section (Dark)
**Role:** Full-bleed hero with inverted color treatment

Aubergine (#3c315b) background, white (#fdfcfe) text at 64-80px weight 350 with -1.6px letter-spacing. Centered headline stacked on 2-3 lines. A pill-shaped CTA sits centered below. This is the dramatic, intimate mode of the system.

### Hero Section (Light)
**Role:** Full-bleed hero on light background

Paper White or Bone (#f4f2f4) background, Aubergine (#3c315b) text at 64-80px weight 350. The ghost mascot character replaces a vowel in the headline as a brand signature. Ghost is rendered in Periwinkle (#ab9ff2).

### Muted Purple Hero Panel
**Role:** Intermediate hero — soft violet wash

Desaturated violet panel (appears as muted gray-violet) with white text and a centered Download CTA. Sits between the light and dark hero modes as a tonal bridge.

### See More Link Button
**Role:** Inline section navigation

Ghost Lavender (#e2dffe) fill, #3c315b text, 100px border-radius, 12px 24px padding, 15px weight 350. Includes a small diagonal arrow icon after the text. The secondary action pattern.

### Ghost Character Accent
**Role:** Decorative brand element within headlines

The Phantom ghost mascot rendered in Periwinkle (#ab9ff2), substituted inline for a vowel in display headlines. Creates a moment of play and brand recognition in otherwise austere typographic compositions.

### Pastel Accent Button Set
**Role:** Multi-variant action buttons for variety

Includes Buttercream (#ffffc4), Blush Mist (#ffdadc), and Cornflower Pop (#4a87f2) fills. Same 100px radius and padding as other buttons. Used in groups to create a candy-palette rhythm when multiple actions are needed.

### Logo Lockup
**Role:** Brand mark

The Phantom wordmark with ghost icon in Aubergine (#3c315b) on light backgrounds, Paper White (#fdfcfe) on dark backgrounds. 100px container radius around the icon. Sits at the far left of the header.

### Search Icon Button
**Role:** Header utility action

32px square button with a search/magnifying-glass icon stroke in Aubergine (#3c315b). No background, no border — pure icon. Sits between nav and Download CTA.

### Success Badge
**Role:** Status indicator

Mint Signal (#2ec08b) background, white text, 100px radius, 8px 16px padding, 13px weight 350. Used sparingly for live status, confirmations, or positive states.

### Card Surface
**Role:** Content container

Paper White (#fdfcfe) background, 24px border-radius, 48px padding, 1px border in #e9e8ea or #f4f2f4. No shadow — relies on border and generous padding for separation. Weight feels light, not chunky.

## Do's and Don'ts

### Do
- Use 100px border-radius for all navigation containers, buttons, and tags — the pill geometry is the system's defining silhouette
- Set all text at weight 350 by default; reserve weight 400 for body copy that needs extra legibility
- Apply -0.025em letter-spacing at every type size — the tight tracking is non-negotiable for brand fidelity
- Use Ghost Lavender (#e2dffe) as the primary CTA fill, paired with the rgb(226,223,254) 0px 0px 4px 0px glow shadow
- Alternate between light and Aubergine dark sections to create rhythm — both modes are equally native to the system
- Collapse line-height to 1.0-1.1 for display sizes 64px and above; let the massive type breathe vertically without gaps
- Replace a vowel in display headlines with the ghost mascot rendered in Periwinkle (#ab9ff2) for brand playfulness

### Don't
- Don't use drop shadows beyond the single 4px violet glow on primary CTAs — the system stays flat
- Don't set text at weight 600+ — the 350 whisper-weight is the brand's voice, not a choice for emphasis
- Don't use sharp corners under 16px — the world is pills and soft capsules
- Don't introduce saturated colors outside the pastel accent set (#4a87f2, #ffffc4, #ffdadc) — the palette is intentionally narrow
- Don't set body text larger than 16px weight 400 or use line-height above 1.4 — readability rules apply but stay restrained
- Don't use high-contrast decorative elements like gradients, patterns, or backgrounds images — surface is always flat color
- Don't add border-radius values below 24px on cards or 16px on smaller elements — every container should feel soft

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#fdfcfe` | Base canvas — the default page background, the lightest possible near-white |
| 2 | Bone | `#f4f2f4` | Light section panels — subtle warm shift for content blocks on white |
| 3 | Ash | `#e9e8ea` | Neutral button surface — used for secondary buttons and quiet containers |
| 4 | Ghost Lavender | `#e2dffe` | Primary CTA surface — lavender fill with violet halo for the system's main action |
| 5 | Aubergine | `#3c315b` | Dark section background — the deep-violet surface for inverted hero panels |

## Elevation

- **Primary button (Ghost Lavender fill):** `rgb(226, 223, 254) 0px 0px 4px 0px`

## Imagery

No photography, no product screenshots, no abstract graphics. The visual language is pure typography and brand mascot (the ghost character). The ghost is the only recurring illustrated element, rendered flat in Periwinkle (#ab9ff2) and always inline within text. There is no image-heavy content — text dominates the visual hierarchy completely, with the ghost providing occasional personality interruptions.

## Agent Prompt Guide

## Quick Color Reference
- Text: #1c1c1c (body) / #3c315b (headings/nav) / #fdfcfe (on dark)
- Background: #fdfcfe (canvas) / #3c315b (dark sections) / #f4f2f4 (light panels)
- Border: #e9e8ea (subtle) / #3c315b (strong)
- Accent: #ab9ff2 (Periwinkle — ghost, secondary CTA)
- primary action: #e2dffe (filled action)

## Example Component Prompts
1. **Hero Section (Dark)**: Aubergine (#3c315b) full-bleed background. Display headline at 80px Phantom weight 350 in Paper White (#fdfcfe), letter-spacing -2.0px, line-height 1.1. Centered. Below: a Ghost Lavender (#e2dffe) pill button, 100px radius, 16px 48px padding, 16px weight 350 in #3c315b with rgb(226,223,254) 0px 0px 4px 0px shadow.

2. **Hero Section (Light)**: Paper White (#fdfcfe) background. Display headline at 64px Phantom weight 350 in Aubergine (#3c315b), letter-spacing -1.6px. The second word's first vowel replaced by the Periwinkle (#ab9ff2) ghost mascot. Below: a See More pill link (#e2dffe fill, 100px radius, #3c315b text at 15px) with a small arrow icon.

3. **Navigation Bar**: White (#fdfcfe) pill container, 100px border-radius, 48px vertical padding, 16px 24px horizontal padding. Contains 5 nav items at 15px weight 350 in #3c315b, each with a 4px chevron. Sits between the Phantom logo (left) and a Download button (right).

4. **Content Card**: Paper White (#fdfcfe) background, 24px border-radius, 1px border in #e9e8ea, 48px padding. No shadow. Heading at 30px weight 350 in #1c1c1c, body at 16px weight 400 in #1c1c1c with 1.4 line-height.

5. **Pastel Accent Button Group**: Three pill buttons in a row, each 100px radius, 16px 32px padding, 15px weight 350. Fills: Buttercream (#ffffc4), Blush Mist (#ffdadc), Cornflower Pop (#4a87f2). All with #1c1c1c text. 8px gap between buttons.

## Similar Brands

- **Linear** — Same ultra-rounded pill navigation and monochromatic restraint; both use aggressive letter-spacing tightening and weight-light display type
- **Rainbow Wallet** — Same crypto-wallet audience with pastel button palettes and soft capsule geometry
- **Belka** — Same playful mascot-in-headline pattern and candy-pastel button set within a monochromatic framework
- **Stripe** — Same generous pill radii and minimal-elevation approach; both let typography and color do the heavy lifting

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine: #3c315b;
  --color-ghost-lavender: #e2dffe;
  --color-periwinkle: #ab9ff2;
  --color-cornflower-pop: #4a87f2;
  --color-buttercream: #ffffc4;
  --color-blush-mist: #ffdadc;
  --color-mint-signal: #2ec08b;
  --color-paper-white: #fdfcfe;
  --color-obsidian: #1c1c1c;
  --color-fog: #86848d;
  --color-ash: #e9e8ea;
  --color-bone: #f4f2f4;

  /* Typography — Font Families */
  --font-phantom: 'Phantom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.35;
  --text-body-sm: 15px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.375px;
  --text-subheading: 20px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.21;
  --tracking-heading: -0.75px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Typography — Weights */
  --font-weight-w350: 350;
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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 48px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 96px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-nav: 100px;
  --radius-tags: 100px;
  --radius-cards: 24px;
  --radius-links: 32px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-sm: rgb(226, 223, 254) 0px 0px 4px 0px;

  /* Surfaces */
  --surface-paper-white: #fdfcfe;
  --surface-bone: #f4f2f4;
  --surface-ash: #e9e8ea;
  --surface-ghost-lavender: #e2dffe;
  --surface-aubergine: #3c315b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine: #3c315b;
  --color-ghost-lavender: #e2dffe;
  --color-periwinkle: #ab9ff2;
  --color-cornflower-pop: #4a87f2;
  --color-buttercream: #ffffc4;
  --color-blush-mist: #ffdadc;
  --color-mint-signal: #2ec08b;
  --color-paper-white: #fdfcfe;
  --color-obsidian: #1c1c1c;
  --color-fog: #86848d;
  --color-ash: #e9e8ea;
  --color-bone: #f4f2f4;

  /* Typography */
  --font-phantom: 'Phantom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.35;
  --text-body-sm: 15px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.375px;
  --text-subheading: 20px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.21;
  --tracking-heading: -0.75px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 96px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-sm: rgb(226, 223, 254) 0px 0px 4px 0px;
}
```
