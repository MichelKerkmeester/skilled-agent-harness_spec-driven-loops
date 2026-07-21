# Eat Real Food — Style Reference
> government health brief on cream parchment

**Theme:** light

Eat Real Food reads as a government health brief printed on aged parchment: warm cream canvas, near-black ink, and one alarm-red used only when the data needs to stop you in your tracks. The visual system is nearly monochromatic by design — color is treated as editorial punctuation, not decoration. Display type is enormous and tight (170px headlines at 0.84 line-height), making every hero statement feel like a front-page declaration. Components are rounded, pill-shaped, and float on flat surfaces with the faintest layered shadows. The aesthetic borrows from broadsheet newspaper design and government reports: confident, restrained, and data-driven.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Press Ink | `#110000` | `--color-press-ink` | Primary text, dark hero surfaces, filled pill buttons, navigation dots — near-black with a warm undertone replaces the cold #000000 to keep the palette feeling printed rather than digital |
| Aged Parchment | `#fdfbee` | `--color-aged-parchment` | Page canvas, body text on dark surfaces, filled button backgrounds — the warm off-white that gives the entire site its paper-like quality |
| Newsprint White | `#ffffff` | `--color-newsprint-white` | Card surfaces, elevated panels, button text on dark fills |
| Wheat Field | `#f3f0d6` | `--color-wheat-field` | Accent surface, secondary button fill, soft highlight wash — a desaturated straw tone that sits between parchment and olive |
| Fog | `#e5e5e5` | `--color-fog` | Hairline borders, dividers, card edges — the structural neutral that defines component boundaries at 1px weight |
| Dusty Brick | `#8d7d7d` | `--color-dusty-brick` | Muted secondary text, small labels — warm gray-brown that recedes without going cold |
| Ash | `#bebcb3` | `--color-ash` | Subtle image borders, soft shadow base — warm gray for non-critical structural lines |
| Stone | `#d2d0c6` | `--color-stone` | Card shadow base tone, subtle elevation warmth |
| Alert Red | `#d50000` | `--color-alert-red` | Data emphasis blocks, statistics backgrounds, alarm callouts — the only chromatic color in the system, reserved for moments when numbers must cut through the editorial calm |

## Tokens — Typography

### Die Grotesk D — Display and heading — weight 700 only, the single heaviest voice in the system. Used at enormous sizes (96–170px) with extremely tight line-heights (0.84–0.96) that make headlines stack into solid editorial blocks. This is the voice that shouts. · `--font-die-grotesk-d`
- **Substitute:** Inter (weight 700, tight tracking) or Söhne Breit
- **Weights:** 700
- **Sizes:** 32px, 44px, 48px, 96px, 115px, 144px, 155px, 170px
- **Line height:** 0.84–1.04
- **Role:** Display and heading — weight 700 only, the single heaviest voice in the system. Used at enormous sizes (96–170px) with extremely tight line-heights (0.84–0.96) that make headlines stack into solid editorial blocks. This is the voice that shouts.

### Die Grotesk B — Mid-scale headings and emphasized body — the bridge between display and text. Slight negative tracking (-0.019em) tightens medium sizes without making them feel clinical. · `--font-die-grotesk-b`
- **Substitute:** Inter (weight 500, 700)
- **Weights:** 500, 700
- **Sizes:** 14px, 16px, 19px, 21px, 24px, 26px, 31px
- **Line height:** 0.92–1.50
- **Letter spacing:** -0.0190em
- **Role:** Mid-scale headings and emphasized body — the bridge between display and text. Slight negative tracking (-0.019em) tightens medium sizes without making them feel clinical.

### Die Grotesk A — Body text, navigation, buttons, links, lists, cards — the workhorse. Negative tracking (-0.02em to -0.03em) at body sizes keeps the grotesque feeling sharp. Weight 600 is available for inline emphasis. · `--font-die-grotesk-a`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11px, 12px, 14px, 16px, 33px
- **Line height:** 0.98–1.50
- **Letter spacing:** -0.0300em, -0.0200em
- **Role:** Body text, navigation, buttons, links, lists, cards — the workhorse. Negative tracking (-0.02em to -0.03em) at body sizes keeps the grotesque feeling sharp. Weight 600 is available for inline emphasis.

### Geist Mono — Monospaced labels, section markers, micro-copy — the only monospace voice. Wide tracking (+0.06em) gives it a typewriter/telegraph quality that signals 'official data' or 'system label'. · `--font-geist-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400, 700
- **Sizes:** 12px, 16px
- **Line height:** 1.18–1.40
- **Letter spacing:** 0.0600em
- **Role:** Monospaced labels, section markers, micro-copy — the only monospace voice. Wide tracking (+0.06em) gives it a typewriter/telegraph quality that signals 'official data' or 'system label'.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.72px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.28px | `--text-body-sm` |
| body | 16px | 1.4 | -0.48px | `--text-body` |
| body-lg | 21px | 1.2 | -0.42px | `--text-body-lg` |
| subheading | 33px | 1.04 | -0.66px | `--text-subheading` |
| heading | 48px | 0.96 | — | `--text-heading` |
| heading-lg | 96px | 0.96 | — | `--text-heading-lg` |
| display | 170px | 0.84 | — | `--text-display` |

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
| 52 | 52px | `--spacing-52` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 999px |
| tags | 100px |
| cards | 16px |
| images | 12px |
| buttons | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.1) 0px 12px 24px 0px` | `--shadow-lg` |
| xl | `rgba(0, 0, 0, 0.1) 0px 10px 40px 0px, rgba(0, 0, 0, 0.1) ...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Dark Hero Band
**Role:** Opening section with massive headline

Full-width #110000 background, centered cream text. Headline at 170px Die Grotesk D weight 700, line-height 0.84. Subtitle at 21px Die Grotesk A weight 400 in #fdfbee. The dark band creates a cinematic opening that contrasts the parchment canvas below.

### Filled Pill Button
**Role:** Primary action

#fdfbee background, #110000 text at 14–16px Die Grotesk A weight 500. Border-radius 40px. Padding 18px 24px or 20px 24px. No shadow. The cream-on-near-black combination is warm rather than clinical.

### Outlined Pill Button
**Role:** Secondary action

Transparent background, 1.5px #110000 border, #110000 text. Border-radius 40px. Padding 18px 24px. Matches filled variant in size and radius — the only difference is fill state.

### Video Play Trigger
**Role:** Embedded video launch

Pill-shaped button with dark semi-transparent background (#110000 at ~80% opacity), white text, circular white play icon on the right. Sits centered over a blurred organic/green hero image. Radius 40px. Functions as a secondary CTA.

### Statistics Data Block
**Role:** Health data emphasis

Solid #d50000 background block, large white percentage (Die Grotesk D weight 700, ~155px) top-left, supporting white body text (16px Die Grotesk A weight 400) below. No border, no radius on the block itself — the block is a solid editorial panel. The red is the only color in the system that breaks the monochrome discipline.

### Section Label Tag
**Role:** Category or section identifier

Pill-shaped tag with #110000 background, white text (Geist Mono weight 400, 12px, +0.06em tracking). Padding 6px 16px. Radius 100px. Sits above section headlines as a machine-stamped label.

### Government Banner
**Role:** Official site identifier

Full-width top bar with #fdfbee background. Contains a small US flag icon, text 'AN OFFICIAL WEBSITE OF THE UNITED STATES GOVERNMENT' in #110000 Geist Mono 12px weight 400 with +0.06em tracking. Thin #e5e5e5 bottom border.

### Navigation Pill
**Role:** Top navigation item

Rounded nav link with #fdfbee or #110000 background, 999px radius. Text in Die Grotesk A weight 500 at 14px. Active state indicated by filled #110000 background with white text.

### Card with Soft Shadow
**Role:** Content grouping panel

White (#ffffff) surface, border-radius 16px, padding 24px. Box-shadow: rgba(0,0,0,0.1) 0px 10px 40px, rgba(0,0,0,0.1) 0px 20px 60px -10px — a double-layer shadow that creates gentle lift without drama. No border.

### Section Progress Dots
**Role:** Page-level section indicator

Horizontal row of small circles, one active (#110000 filled), others #e5e5e5 outlined. Fixed position at top of content area, used to show scroll progress through multi-section pages.

### Image Container
**Role:** Media wrapper

Border-radius 12px for photos, 24px for hero/feature images. No border by default. When a border is needed, use 1px #bebcb3. Box-shadow rgba(0,0,0,0.1) 0px 12px 24px for elevated media.

## Do's and Don'ts

### Do
- Use the cream canvas #fdfbee as the default page background for all body content
- Reserve #d50000 exclusively for statistics, data emphasis, and alarm-level callouts — never for decoration or branding
- Use Die Grotesk D weight 700 at 96px or larger for hero and section-opening headlines with line-height at or below 0.96
- Apply 40px border-radius to all buttons and interactive pills to maintain the soft, rounded system voice
- Use Geist Mono with +0.06em tracking for labels, tags, and machine-stamped metadata
- Apply the double-layer card shadow (10px/40px + 20px/60px) to any elevated white surface that needs to separate from the cream canvas
- Keep body text at 16–21px Die Grotesk A weight 400 with -0.02em to -0.03em tracking

### Don't
- Don't introduce additional chromatic colors — the palette is Press Ink, parchment neutrals, and one Alarm Red
- Don't use #000000 for body text or backgrounds — always use the warmer #110000
- Don't apply Alert Red (#d50000) to buttons, links, or navigation — it is for data blocks only
- Don't use sharp corners (0–4px radius) on buttons or cards — the system is defined by its pill and rounded softness
- Don't set display headlines at standard line-height (1.2+) — tight stacking (0.84–0.96) is the signature
- Don't use heavy drop shadows on dark sections — the near-black surfaces should feel flat and printed, not elevated
- Don't use photography for decorative atmosphere — imagery should be content-bearing (data, video, diagrams) or absent

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Aged Parchment | `#fdfbee` | Page canvas |
| 1 | Newsprint White | `#ffffff` | Card and elevated panel surfaces |
| 2 | Wheat Field | `#f3f0d6` | Accent surface for secondary buttons and soft highlights |
| 3 | Press Ink | `#110000` | Dark hero bands, inverted sections, navigation dots |
| 4 | Alert Red | `#d50000` | Data emphasis blocks — statistics only |

## Elevation

- **Card:** `rgba(0, 0, 0, 0.1) 0px 10px 40px 0px, rgba(0, 0, 0, 0.1) 0px 20px 60px -10px`
- **Link/Image:** `rgba(0, 0, 0, 0.1) 0px 12px 24px 0px`

## Imagery

Imagery is sparse and content-bearing rather than decorative. The hero uses a single large video embed with a heavily blurred organic background (greens, dark foliage) — the blur eliminates detail so the video trigger becomes a textured surface, not a photograph. Statistics sections rely on solid color blocks rather than charts. No lifestyle photography, no stock imagery, no illustration. SVG icons appear in small, functional contexts (government flag, play button) and use #000000 fills. The overall image strategy is editorial: when visuals appear, they carry data or video, never atmosphere.

## Layout

Centered, max-width ~1200px contained layout with a strong vertical rhythm. The page opens with a full-bleed dark hero band (centered headline, no navigation clutter) that contrasts the cream canvas below. Subsequent sections alternate between light parchment bands and occasional dark inverted bands, separated by 80px section gaps. A fixed pill-shaped progress dot indicator sits at the top of the content area. Content arrangements are mostly centered stacks for headlines and 2–3 column grids for data (the statistics section uses 3 columns of red blocks). Cards sit at 16–24px radius with soft layered shadows. Navigation is a minimal top bar with a government banner above it. The layout reads top-to-bottom as a long-form editorial scroll, not a multi-page application.

## Agent Prompt Guide

primary action: #110000 (filled action)
Create a Primary Action Button: #110000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
**Quick Color Reference**
- Canvas: #fdfbee
- Card surface: #ffffff
- Primary text / dark surface: #110000
- Accent surface: #f3f0d6
- Hairline border: #e5e5e5
- Data emphasis: #d50000

**3-5 Example Component Prompts**
1. Create a dark hero section: #110000 full-width background. Headline 'Real Food Wins' at 170px Die Grotesk D weight 700, #fdfbee color, line-height 0.84, centered. Subtitle at 21px Die Grotesk A weight 400, #fdfbee, max-width 600px, centered below.
2. Create a statistics grid: 3-column layout, 80px section gap above. Each block is solid #d50000 with no border or radius. Percentage at 155px Die Grotesk D weight 700, #ffffff, top-left. Description at 16px Die Grotesk A weight 400, #ffffff, below the percentage.
3. Create a filled pill button: #fdfbee background, #110000 text, 40px border-radius, 18px 24px padding, 14px Die Grotesk A weight 500, no shadow, no border.
4. Create a section label tag: #110000 background, #ffffff text in Geist Mono 12px weight 400 with 0.72px letter-spacing, 6px 16px padding, 100px border-radius.
5. Create an elevated content card: #ffffff background, 16px border-radius, 24px padding, box-shadow rgba(0,0,0,0.1) 0px 10px 40px, rgba(0,0,0,0.1) 0px 20px 60px -10px. Heading at 33px Die Grotesk B weight 700 #110000. Body at 16px Die Grotesk A weight 400 #110000.

## Monochrome Discipline

The system is built on a single rule: chromatic color is evidence, not decoration. #d50000 appears only when a number must stop the reader. The cream-to-near-black scale (#fdfbee → #f3f0d6 → #e5e5e5 → #bebcb3 → #8d7d7d → #110000) does all the structural work — hierarchy, separation, emphasis. An agent building new pages should default to monochrome and earn every red.

## Display Voice

The headline weight is deliberately extreme: 170px at 0.84 line-height. This is not a UI choice — it is an editorial voice. The system should feel like a government health manifesto printed in a broadsheet, not a SaaS dashboard. When in doubt, go larger and tighter on display type. The rest of the system can be quiet because the headlines are loud.

## Similar Brands

- **The White House (whitehouse.gov)** — Same government editorial restraint — cream/off-white canvas, massive serif-adjacent sans headlines, monochromatic palette with one chromatic accent reserved for data or alerts
- **The New York Times Cooking** — Same broadsheet-inspired layout with enormous display headlines, warm parchment tones, and pill-shaped interactive elements
- **Stripe Press** — Same editorial-meets-digital aesthetic with oversized display type, warm neutrals, pill buttons, and minimal chromatic color used only for data emphasis
- **GOV.UK Design System** — Same government-document DNA — high-contrast text, generous spacing, pill navigation, and an almost militant avoidance of decorative color
- **The Markup** — Same data-journalism visual language: cream canvas, red as alarm color for statistics, oversized display headlines, monospace for system labels

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-press-ink: #110000;
  --color-aged-parchment: #fdfbee;
  --color-newsprint-white: #ffffff;
  --color-wheat-field: #f3f0d6;
  --color-fog: #e5e5e5;
  --color-dusty-brick: #8d7d7d;
  --color-ash: #bebcb3;
  --color-stone: #d2d0c6;
  --color-alert-red: #d50000;

  /* Typography — Font Families */
  --font-die-grotesk-d: 'Die Grotesk D', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-die-grotesk-b: 'Die Grotesk B', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-die-grotesk-a: 'Die Grotesk A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.48px;
  --text-body-lg: 21px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.42px;
  --text-subheading: 33px;
  --leading-subheading: 1.04;
  --tracking-subheading: -0.66px;
  --text-heading: 48px;
  --leading-heading: 0.96;
  --text-heading-lg: 96px;
  --leading-heading-lg: 0.96;
  --text-display: 170px;
  --leading-display: 0.84;

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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 48px;
  --radius-full-2: 100px;
  --radius-full-3: 999px;
  --radius-full-4: 14385.6px;

  /* Named Radii */
  --radius-nav: 999px;
  --radius-tags: 100px;
  --radius-cards: 16px;
  --radius-images: 12px;
  --radius-buttons: 40px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 12px 24px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 10px 40px 0px, rgba(0, 0, 0, 0.1) 0px 20px 60px -10px;

  /* Surfaces */
  --surface-aged-parchment: #fdfbee;
  --surface-newsprint-white: #ffffff;
  --surface-wheat-field: #f3f0d6;
  --surface-press-ink: #110000;
  --surface-alert-red: #d50000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-press-ink: #110000;
  --color-aged-parchment: #fdfbee;
  --color-newsprint-white: #ffffff;
  --color-wheat-field: #f3f0d6;
  --color-fog: #e5e5e5;
  --color-dusty-brick: #8d7d7d;
  --color-ash: #bebcb3;
  --color-stone: #d2d0c6;
  --color-alert-red: #d50000;

  /* Typography */
  --font-die-grotesk-d: 'Die Grotesk D', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-die-grotesk-b: 'Die Grotesk B', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-die-grotesk-a: 'Die Grotesk A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.48px;
  --text-body-lg: 21px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.42px;
  --text-subheading: 33px;
  --leading-subheading: 1.04;
  --tracking-subheading: -0.66px;
  --text-heading: 48px;
  --leading-heading: 0.96;
  --text-heading-lg: 96px;
  --leading-heading-lg: 0.96;
  --text-display: 170px;
  --leading-display: 0.84;

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
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 48px;
  --radius-full-2: 100px;
  --radius-full-3: 999px;
  --radius-full-4: 14385.6px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 12px 24px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 10px 40px 0px, rgba(0, 0, 0, 0.1) 0px 20px 60px -10px;
}
```
