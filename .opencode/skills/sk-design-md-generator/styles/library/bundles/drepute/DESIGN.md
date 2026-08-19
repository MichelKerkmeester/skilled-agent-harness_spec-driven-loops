# Drepute — Style Reference
> midnight observatory over still water — a single sentence floats beneath a field of stars

**Theme:** dark

Drepute is a cinematic black-canvas teaser built around a single full-bleed photograph: a still alpine lake mirroring a starfield at midnight. The UI is deliberately invisible — no cards, no shadows, no panels. A single Playfair Display headline floats over the image while everything else is Source Sans Pro at 14–16px. The wordmark uses Montserrat 700 with extreme letter-spacing (0.154em), turning the brand name into a constellation of letters across the top. Color is almost entirely absent: pure black, white, and three grays form a five-step achromatic scale, with one deep teal (#00a4a6) appearing only as a link border. Radii are locked at 4px everywhere — no pills, no soft corners, just sharp rectangular edges. The whole site feels like a movie title card: a single image, a single sentence, and a brand name hovering above it all.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Primary text on dark hero, input fills, light surfaces |
| Deep Ink | `#000000` | `--color-deep-ink` | Dominant text and border color across body, nav, and dividers |
| Obsidian | `#161616` | `--color-obsidian` | Dark canvas and hero surface — the page's atmospheric base |
| Ash Gray | `#bfbfbf` | `--color-ash-gray` | Subtle input borders, ghost box-shadows, disabled hairlines |
| Fog | `#a9a9a9` | `--color-fog` | Secondary body text, muted borders, low-emphasis dividers |
| Steel | `#7f8080` | `--color-steel` | Navigation and link borders, tertiary text on light surfaces |
| Slate Blue | `#8995a9` | `--color-slate-blue` | Outlined ghost-button border — the only chromatic interactive treatment |
| Lagoon Teal | `#00a4a6` | `--color-lagoon-teal` | Sole accent — link border, indicating the single interactive edge in the system |

## Tokens — Typography

### Source Sans Pro — Workhorse sans for body, buttons, nav, inputs, and all UI microcopy; weight 700 reserved for emphasis · `--font-source-sans-pro`
- **Substitute:** Inter, IBM Plex Sans, system-ui
- **Weights:** 400, 700
- **Sizes:** 14px, 16px
- **Line height:** 1.20–1.50
- **Letter spacing:** 0.071em
- **Role:** Workhorse sans for body, buttons, nav, inputs, and all UI microcopy; weight 700 reserved for emphasis

### Playfair Display — Display serif for hero headlines ('Launching Soon') — the single expressive type voice; weight 400 italic-leaning elegance rather than bold · `--font-playfair-display`
- **Substitute:** Cormorant Garamond, Libre Baskerville, DM Serif Display
- **Weights:** 400
- **Sizes:** 16px, 44px, 62px
- **Line height:** 1.20–1.25
- **Letter spacing:** normal
- **Role:** Display serif for hero headlines ('Launching Soon') — the single expressive type voice; weight 400 italic-leaning elegance rather than bold

### Montserrat — Wordmark only — 'DREPUTE' set wide at 0.154em to function as a typographic constellation above the hero · `--font-montserrat`
- **Substitute:** Oswald, Bebas Neue, Archivo Black
- **Weights:** 700
- **Sizes:** 26px
- **Line height:** 1.20
- **Letter spacing:** 0.154em
- **Role:** Wordmark only — 'DREPUTE' set wide at 0.154em to function as a typographic constellation above the hero

### GD Sherpa — Custom brand secondary; deployed alongside Source Sans Pro for select links and image overlays · `--font-gd-sherpa`
- **Substitute:** Source Sans Pro (fallback for system use)
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.20
- **Role:** Custom brand secondary; deployed alongside Source Sans Pro for select links and image overlays

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 1px | `--text-caption` |
| body | 16px | 1.5 | 0.07px | `--text-body` |
| heading-sm | 26px | 1.2 | 4px | `--text-heading-sm` |
| heading | 44px | 1.25 | — | `--text-heading` |
| display | 62px | 1.2 | — | `--text-display` |

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
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 56px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Full-Bleed Hero
**Role:** Atmospheric landing surface

#161616 base with a photographic image filling 100vw/100vh. Headline centered vertically in Playfair Display 62px #ffffff, weight 400, normal tracking. Wordmark 'DREPUTE' pinned to top in Montserrat 700 26px #ffffff with 0.154em tracking — floats above the image as a typographic anchor.

### Wordmark Lockup
**Role:** Brand identity element

Montserrat 700, 26px, uppercase, #ffffff on dark or #000000 on light, letter-spacing 0.154em (4px). Centered horizontally. No accompanying logo mark — type is the mark.

### Ghost Outlined Button
**Role:** Outlined call-to-action

Transparent fill, 1px border in #8995a9 (slate blue) or #000000, Source Sans Pro 14px weight 700, text color matching border, 4px radius, 8px vertical / 24px horizontal padding. 2px inner border offset on focus. This is the system's only filled-like interactive treatment.

### Minimal Link
**Role:** Inline navigation link

Source Sans Pro 14px, no underline by default, border-bottom 1px in #7f8080 (steel) or #00a4a6 (lagoon teal) on hover. Teal border is the single chromatic moment in the entire system.

### Top Notification Bar
**Role:** Slim promotional strip

Full-width bar with 56px vertical padding. White background, Source Sans Pro 14px #000000 text, centered layout. Inline link and ghost button sit on the same horizontal axis.

### Text Input Field
**Role:** Form input for email/name capture

#ffffff fill, 1px #bfbfbf border, 4px radius, Source Sans Pro 16px #000000 text. No label — placeholder text in #a9a9a9. Focus state darkens border to #000000.

### Subscribe Form Block
**Role:** Email capture below the hero

Centered stack on #161616 surface. 'Subscribe' heading in Playfair Display 44px #ffffff, then a single-row input + ghost button composition. 32px gap between heading and form row.

### Section Divider
**Role:** Visual break between dark hero and light content

Pure 1px #a9a9a9 horizontal line, full-width or 133px margins, no shadow or ornament. Divides the cinematic dark surface from functional light sections.

### Chat Widget Bubble
**Role:** Floating support affordance

Circular 48px dark surface pinned to bottom-right corner. Single light icon, no label. Floats above all content.

## Do's and Don'ts

### Do
- Use Playfair Display weight 400 exclusively for display text — never go above weight 400; the lightness is the luxury.
- Set the wordmark in Montserrat 700 with 0.154em letter-spacing — this tracking is the brand's signature and must not be reduced.
- Keep the canvas at #161616 for all dark surfaces and reserve #ffffff for light sections below the fold.
- Use 4px radius on every rounded element — buttons, inputs, cards. The system has no soft corners.
- Anchor headlines at 56px+ on Playfair Display and pair with Source Sans Pro 14–16px for all supporting text.
- Use 24px column gaps and 24px element padding as the default rhythm; 56px vertical section padding for hero-style blocks.
- Let the teal #00a4a6 appear only as a single link border — never as a fill, button background, or large surface.

### Don't
- Do not add shadows, gradients, or glows to any component — the system is flat and photographic.
- Do not introduce pills, circles, or any radius above 4px.
- Do not use color fills on buttons — all actions are ghost/outlined with border-only treatment.
- Do not use Playfair Display below 44px — it is a display face, not a body face.
- Do not place body text directly over the hero photograph without a #161616 backing layer — contrast must remain AAA.
- Do not add more than one chromatic accent — the teal is singular; adding another color breaks the cinematic restraint.
- Do not use bold (600+) on the wordmark — weight 700 is the ceiling, and it only applies to Montserrat.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Hero Canvas | `#161616` | Full-bleed dark surface hosting the photographic hero and headline |
| 1 | Page Canvas | `#ffffff` | Light surface below the fold for form sections and footer |
| 2 | Input Surface | `#ffffff` | Form field fills against the dark background |

## Elevation

- **Chat Widget:** `0 0 0 1px rgba(191,191,191,0.3)`

## Imagery

Imagery is singular and cinematic: one full-bleed photographic hero dominates the page. The photograph — a night-sky alpine landscape with mountain silhouettes and a glass-still lake reflection — is high-contrast, dark/moody, and occupies 100% of the viewport. There is no other photography, no illustrations, no product shots, no decorative graphics. The image is the entire visual identity. Icon style is minimal and line-based (single chat bubble). The site is overwhelmingly text-dominant everywhere except the hero, where text is reduced to a single sentence beneath a constellation of stars.

## Layout

The page model is a full-bleed vertical stack with no max-width container. The hero is a single full-viewport-height section: photographic background, centered wordmark at top, centered headline in the vertical middle. Below the hero, the layout collapses to centered single-column content — a subscribe form, a divider, and footer text — all stacked with 56px vertical breathing room. Navigation is minimal: the top bar is a single notification strip, and the wordmark serves as the only persistent brand element. No sidebar, no grid, no card layouts. The chat widget floats absolutely in the bottom-right corner. The overall rhythm is: one overwhelming image, then silence.

## Agent Prompt Guide

**Quick Color Reference**
- background: #161616 (dark) / #ffffff (light)
- text: #ffffff (on dark) / #000000 (on light)
- border: #a9a9a9 (body) / #8995a9 (button)
- accent: #00a4a6 (teal link border only)
- muted text: #7f8080
- primary action: #00a4a6 (outlined action border)

**Example Component Prompts**
1. Build the hero: full-viewport #161616 background with a full-bleed landscape photograph. Center 'Launching Soon' in Playfair Display 62px weight 400, #ffffff, normal tracking, vertically centered. Top-center wordmark 'DREPUTE' in Montserrat 700, 26px, #ffffff, letter-spacing 0.154em (4px), uppercase, 56px from top edge.
2. Build the ghost outlined button: transparent fill, 1px #8995a9 border, 4px radius, 8px vertical and 24px horizontal padding. Text: Source Sans Pro 14px weight 700, color #8995a9, uppercase. On hover, border darkens to #000000.
3. Build the subscribe form section: #161616 background, 56px vertical padding. Heading 'Subscribe' in Playfair Display 44px weight 400, #ffffff, centered. 32px gap below. Single horizontal row: email input (#ffffff fill, 1px #bfbfbf border, 4px radius, Source Sans Pro 16px) + ghost button (1px #8995a9 border, Source Sans Pro 14px 700, 4px radius), 24px gap between them.
4. Build the top notification bar: full-width #ffffff strip, 56px vertical padding, centered single-line content in Source Sans Pro 14px #000000. Include an inline link with 1px #00a4a6 border-bottom on hover, and a ghost button (1px #000000 border, 4px radius, Source Sans Pro 14px 700) to the right.
5. Build the chat widget: 48px circle, #161616 fill, 1px rgba(191,191,191,0.3) ring, fixed bottom-right with 24px margins, single white line-icon centered inside.

## Type Pairing Logic

The system uses a three-font hierarchy that must not be crossed: Playfair Display owns the emotional/editorial layer (display only, 44px+, weight 400). Source Sans Pro owns the functional layer (14–16px, weights 400/700, letter-spacing 0.071em). Montserrat owns the identity layer (wordmark only, 26px, weight 700, letter-spacing 0.154em). GD Sherpa is a custom brand face that may substitute into body contexts where Source Sans Pro is specified. Never use Montserrat for body text and never use Source Sans Pro for display.

## Radius Discipline

All corners are 4px. This is non-negotiable. No 8px, no 12px, no 9999px pills, no 0px hard edges. The 4px is the system's only concession to softness and it appears uniformly across buttons, inputs, and any future card surfaces. A new component that breaks this radius will read as foreign to the system.

## Similar Brands

- **Apple (product launch teasers)** — Same full-bleed photographic hero with a single headline floating over a dark image, wordmark as the only persistent UI element, and near-zero color saturation
- **Aesop** — Serif display headlines paired with restrained sans body, deep neutral palette, and a sense of editorial calm
- **Mubi** — Cinema-grade dark hero with white serif typography, monospace-feel restraint, and an almost entirely achromatic interface
- **Squarespace (pre-launch states)** — Launching-soon pattern with centered serif headline over atmospheric photography, minimal UI, and a single subscribe form

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-deep-ink: #000000;
  --color-obsidian: #161616;
  --color-ash-gray: #bfbfbf;
  --color-fog: #a9a9a9;
  --color-steel: #7f8080;
  --color-slate-blue: #8995a9;
  --color-lagoon-teal: #00a4a6;

  /* Typography — Font Families */
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-playfair-display: 'Playfair Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gd-sherpa: 'GD Sherpa', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.07px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 4px;
  --text-heading: 44px;
  --leading-heading: 1.25;
  --text-display: 62px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-56: 56px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 56px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-hero-canvas: #161616;
  --surface-page-canvas: #ffffff;
  --surface-input-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-deep-ink: #000000;
  --color-obsidian: #161616;
  --color-ash-gray: #bfbfbf;
  --color-fog: #a9a9a9;
  --color-steel: #7f8080;
  --color-slate-blue: #8995a9;
  --color-lagoon-teal: #00a4a6;

  /* Typography */
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-playfair-display: 'Playfair Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gd-sherpa: 'GD Sherpa', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.07px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 4px;
  --text-heading: 44px;
  --leading-heading: 1.25;
  --text-display: 62px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-56: 56px;

  /* Border Radius */
  --radius-md: 4px;
}
```
