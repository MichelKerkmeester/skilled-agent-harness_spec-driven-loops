# Home — Style Reference
> Neon-lit gaming arena at midnight — black floor, one electric lime, and tournament-scale typography screaming from the walls.

**Theme:** dark

Swoosh operates as a midnight arena console: nearly all-black canvas (#111111), a single electric lime accent (#b7ff2c) that carries every interaction, and oversized compressed display type (110px at 0.85 line-height) that functions like tournament signage rather than web copy. The system is intentionally austere — only one chromatic hue exists, and it appears exclusively on filled CTA buttons and as thin chromatic action borders, so lime reads as 'switched on' against the dark. Photography is full-bleed and moody, often overlaid with white or near-white cards that float on the image, creating a poster-like layering where editorial typography and photography alternate. The custom Font Roobert carries the voice at every scale — its compressed display weights are signature, while a 6px radius across buttons, cards, nav, and image containers gives the system a uniform sharpness that feels engineered, not soft.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lime Pulse | `#b7ff2c` | `--color-lime-pulse` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Midnight Canvas | `#111111` | `--color-midnight-canvas` | Page background, hero canvas, nav surface, body base — the structural floor everything else sits on |
| Card Charcoal | `#1f1f21` | `--color-card-charcoal` | Elevated card surface, modal background, panel base — one step above Midnight Canvas for layered containers |
| Card Border Ink | `#28282a` | `--color-card-border-ink` | Card perimeter borders — a barely-visible outline that defines containers without breaking the monochrome |
| Footer Rule | `#39393b` | `--color-footer-rule` | Footer top border, structural dividers between page regions |
| Steel Border | `#707072` | `--color-steel-border` | Card outline borders, image frame edges — medium-contrast neutral for visible-but-quiet separation |
| Fog Border | `#e5e5e5` | `--color-fog-border` | Light-mode hairline borders, text/heading underline rules, icon strokes — appears in inverted contexts (white cards, light surfaces) |
| Pure White | `#ffffff` | `--color-pure-white` | Light text on dark surfaces, inverse labels, and high-contrast captions. Do not promote it to the primary CTA color |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary headings, body text, and icon fills on light surfaces. Do not promote it to the primary CTA color |

## Tokens — Typography

### Font Roobert — Primary brand typeface across all contexts — nav, body, headings, display. The custom font's compressed, geometric construction at 110px / 0.85 line-height creates the poster-scale headlines; its 400/500/700 range covers body through display without needing a second family. The extreme compression in display weights is signature — line-height under 1.0 makes headlines overlap slightly, producing a stacked, aggressive tournament-poster feel that system sans-serifs cannot replicate. · `--font-font-roobert`
- **Substitute:** Inter (close), Satoshi, General Sans, Neue Haas Grotesk Display
- **Weights:** 400, 500, 700
- **Sizes:** 14, 16, 20, 24, 64, 110
- **Line height:** 0.85 (display), 1.00 (heading-lg), 1.20 (heading-sm), 1.40 (subheading), 1.50 (body, body-sm)
- **Role:** Primary brand typeface across all contexts — nav, body, headings, display. The custom font's compressed, geometric construction at 110px / 0.85 line-height creates the poster-scale headlines; its 400/500/700 range covers body through display without needing a second family. The extreme compression in display weights is signature — line-height under 1.0 makes headlines overlap slightly, producing a stacked, aggressive tournament-poster feel that system sans-serifs cannot replicate.

### ui-sans-serif — System fallback for generic UI elements where custom font loading isn't needed — secondary links, inline labels, small helper copy. Same weight range as Roobert to ensure graceful degradation. · `--font-ui-sans-serif`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto
- **Weights:** 400, 500, 700
- **Sizes:** 14, 16
- **Line height:** 1.20, 1.50
- **Role:** System fallback for generic UI elements where custom font loading isn't needed — secondary links, inline labels, small helper copy. Same weight range as Roobert to ensure graceful degradation.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading-lg | 64px | 1 | — | `--text-heading-lg` |
| display | 110px | 0.85 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 6px |
| images | 6px |
| modals | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(17, 17, 17, 0.125) 0px 2px 6px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 48-64px
- **Card padding:** 20-24px
- **Element gap:** 16-20px

## Components

### Primary CTA Button
**Role:** Filled action trigger

Lime Pulse (#b7ff2c) background, Carbon Black (#000000) text, 6px border-radius, 16px vertical / 20px horizontal padding, Font Roobert 500 at 16px, line-height 1.20. Border 1px solid #b7ff2c matching the fill. The single most saturated element on any page — it must feel electrically switched on.

### Ghost Navigation Button
**Role:** Outlined action in nav

1px Lime Pulse border, #b7ff2c text, 6px radius, compact 8px vertical / 20px horizontal padding, Font Roobert 500 at 14px. Used for SIGN IN — the border-only treatment lets it coexist with filled CTAs in the same nav without competing.

### Navigation Bar
**Role:** Top-level site navigation

Full-width Midnight Canvas (#111111) bar, 6px container radius, 6px/24px padding, contains swoosh logo mark, text nav links in Pure White (16px Roobert 500), and the Ghost Navigation Button on the right. Subtle 0px 2px 6px rgba(17,17,17,0.125) shadow anchors it without a hard divider.

### Hero Headline
**Role:** Full-bleed opening display

Font Roobert 700 at 110px, line-height 0.85, Pure White (#ffffff), left-aligned, overlaid on a full-bleed dark photograph. The extreme compression stacks the type into a block of visual mass that reads as event signage. A 20px subhead in Roobert 400 at 20px line-height 1.40 follows below.

### White Floating Card
**Role:** Inverted text container over imagery

Pure White (#ffffff) background, 6px radius, 20-24px padding, contains a heading-sm (24px / 1.20) in Carbon Black and body (16px / 1.50) in Carbon Black. Floats over full-bleed dark photography to create a magazine-cover layering effect.

### Dark Card
**Role:** Elevated content panel

Card Charcoal (#1f1f21) background, 1px Card Border Ink (#28282a) border, 6px radius, 20px padding. Sits one step above the Midnight Canvas — subtle enough to feel like the same surface, defined enough to contain content blocks.

### Cookie Settings Modal
**Role:** Overlay preference panel

Card Charcoal (#1f1f21) background, 6px radius, 24px padding, 1px Card Border Ink border. Heading in Pure White, body copy in Pure White at 16px / 1.50, checkbox controls with Lime Pulse check state, and a Primary CTA Button anchored at the bottom.

### Marquee Display Section
**Role:** Scrolling oversized headline

Center-aligned Font Roobert 700 at 64-110px, line-height 1.00-0.85, Pure White on Midnight Canvas. Used for statements like '.SWOOSH IS NIKE'S HOME FOR GAMING' — the massive scale and compressed leading create a billboard rhythm as the text moves.

### Section Heading Pair
**Role:** Scrolling editorial headline + caption

Large Pure White display line (64-110px Roobert 700) centered, with a small uppercase or sentence-case caption above or below at 14-16px Roobert 500. Creates a tournament-announcement rhythm across the page.

### Image Card
**Role:** Photo or render container

6px radius, full-bleed within its container, 1px Steel Border (#707072) or no border depending on context. Frequently overlapped by White Floating Cards or paired with overlay text. Photography is moody, high-contrast, and cropped tight — the object or person IS the content.

### Footer
**Role:** Bottom structural region

Midnight Canvas background, 1px Footer Rule (#39393b) top border, small-text links in Pure White at 14px / 1.50, generous vertical padding (48-64px). Minimal — no heavy card treatments or imagery.

## Do's and Don'ts

### Do
- Use #b7ff2c only for filled CTA buttons, ghost action borders, and active/checked states — never for body text, decorative backgrounds, or large surfaces
- Apply 6px border-radius to every container — buttons, cards, nav, modals, images — for uniform sharpness
- Set display headlines to 110px Roobert 700 with line-height 0.85; the sub-1.0 leading is the signature compression
- Use #111111 as the default page background and #1f1f21 as a one-step elevation for cards and modals
- Pair full-bleed dark photography with Pure White (#ffffff) floating cards to create poster-style layering
- Use #e5e5e5 borders only in inverted (white surface) contexts; on dark surfaces, use #28282a or #707072 instead
- Set body text to 16px Roobert 400, line-height 1.50, Pure White on dark surfaces

### Don't
- Don't introduce any second chromatic color — the system is monochrome plus one lime; adding blue, red, or any hue breaks the signal
- Don't use 0px or 12px+ border-radius — the 6px radius is the system's sharp-but-not-harsh identity
- Don't set display headlines to line-height 1.2 or higher — the 0.85-1.00 compression is what makes the type feel like signage
- Don't use drop shadows beyond the nav bar's 2px blur — the flatness is intentional
- Don't apply lime (#b7ff2c) to headings, subheadings, or body text — it is action-only
- Don't use #e5e5e5 for borders on dark surfaces — it's too bright; reserve it for white-card contexts
- Don't place buttons or cards directly on photography without a surface container — floating cards need their white or charcoal background to read

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#111111` | Page base, hero backgrounds, full-bleed sections |
| 1 | Card Charcoal | `#1f1f21` | Elevated cards, modals, content panels sitting on the canvas |
| 2 | Inverted White | `#ffffff` | Floating white cards on dark photography, inverted text panels |

## Elevation

- **Navigation bar:** `0px 2px 6px 0px rgba(17, 17, 17, 0.125)`

## Imagery

Photography is full-bleed, high-contrast, and moody — hands gripping game controllers, people in motion, arena environments, close crops of sneakers and game gear. Treatment is dark, slightly desaturated, with deep blacks that merge into the #111111 canvas. No lifestyle softness; subjects are staged with editorial intent, cropped tight so the object or gesture fills the frame. White text and white floating cards overlay directly on the photography without scrims, creating a magazine-cover or arena-poster layering. Iconography is minimal — the swoosh logo and small UI icons in Pure White. No illustrations, no 3D renders, no decorative graphics; the photography does all the atmospheric work.

## Layout

Full-bleed dark layout with no persistent max-width container — sections span edge to edge at 1440px viewport reference. Hero opens with a full-bleed photographic image and a left-aligned display headline overlaid at the bottom-left, with a lime CTA below it. Navigation is a fixed top bar with logo left, text links center, ghost CTA right. The page rhythm alternates between full-bleed dark image sections, centered marquee text sections (massive headlines on pure black), and split layouts where a White Floating Card sits on a dark photograph. Section gaps are generous (48-64px) to let the display type breathe. Content is predominantly centered or left-aligned — no asymmetric or grid-heavy compositions. A modal (cookie settings) anchors top-right and is the only non-full-width overlay.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #111111
- border (on dark): #28282a / #707072
- border (on white): #e5e5e5
- accent: #b7ff2c
- primary action: #b7ff2c (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #b7ff2c background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Primary CTA button*: 6px border-radius, 16px vertical padding, 20px horizontal padding, background #b7ff2c, 1px solid #b7ff2c border, text #000000 in Font Roobert 500 at 16px, line-height 1.20. No shadow. Single saturated element on the page — it must be the visual focal point.

3. *White floating card on dark photo*: Background #ffffff, 6px border-radius, 24px padding. Heading in Font Roobert 700 at 24px, line-height 1.20, color #000000. Body in Roobert 400 at 16px, line-height 1.50, color #000000. Floats over a full-bleed dark image with no scrim.

4. *Marquee display section*: Background #111111, centered headline in Font Roobert 700 at 110px, line-height 0.85, color #ffffff. No buttons, no images — just the type filling the viewport height.

5. *Navigation bar*: Full-width background #111111, 6px container radius, 16px/24px padding, subtle 0px 2px 6px rgba(17,17,17,0.125) shadow. Swoosh logo left, nav links in Roobert 500 at 16px color #ffffff, ghost SIGN IN button right (1px #b7ff2c border, #b7ff2c text, 6px radius, 8px/20px padding).

## Gradient System

No gradients are used in the system. All color transitions are flat — surface value shifts (#111111 → #1f1f21 → #ffffff) and the single chromatic accent (#b7ff2c) provide all visual variation. Do not introduce linear or radial gradients; they would break the poster-flat aesthetic.

## Similar Brands

- **Adidas Confirmed** — Same dark-mode + single neon accent pattern; both use drop announcements and full-bleed product photography with overlaid type
- **PlayStation Store** — Dark gaming-platform aesthetic with bold compressed display type and full-bleed hero photography, though Swoosh is more restrained with a single lime vs PlayStation's blue gradients
- **Gucci Garden / Vault** — Editorial poster layout with massive compressed headlines floating over full-bleed photography on dark backgrounds
- **Off-White / Virgil Abloh archive** — Oversized compressed sans-serif headlines, quotation-mark typographic motifs, and high-contrast black-white-lime color logic in fashion/gaming crossover
- **Apple Arcade** — Dark gaming-platform UI with prominent full-bleed imagery and display-scale typography, though Swoosh is more monochromatic with one accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lime-pulse: #b7ff2c;
  --color-midnight-canvas: #111111;
  --color-card-charcoal: #1f1f21;
  --color-card-border-ink: #28282a;
  --color-footer-rule: #39393b;
  --color-steel-border: #707072;
  --color-fog-border: #e5e5e5;
  --color-pure-white: #ffffff;
  --color-carbon-black: #000000;

  /* Typography — Font Families */
  --font-font-roobert: 'Font Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --text-display: 110px;
  --leading-display: 0.85;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

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
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 48-64px;
  --card-padding: 20-24px;
  --element-gap: 16-20px;

  /* Border Radius */
  --radius-md: 6px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 6px;
  --radius-images: 6px;
  --radius-modals: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-sm: rgba(17, 17, 17, 0.125) 0px 2px 6px 0px;

  /* Surfaces */
  --surface-midnight-canvas: #111111;
  --surface-card-charcoal: #1f1f21;
  --surface-inverted-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lime-pulse: #b7ff2c;
  --color-midnight-canvas: #111111;
  --color-card-charcoal: #1f1f21;
  --color-card-border-ink: #28282a;
  --color-footer-rule: #39393b;
  --color-steel-border: #707072;
  --color-fog-border: #e5e5e5;
  --color-pure-white: #ffffff;
  --color-carbon-black: #000000;

  /* Typography */
  --font-font-roobert: 'Font Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --text-display: 110px;
  --leading-display: 0.85;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 6px;

  /* Shadows */
  --shadow-sm: rgba(17, 17, 17, 0.125) 0px 2px 6px 0px;
}
```
