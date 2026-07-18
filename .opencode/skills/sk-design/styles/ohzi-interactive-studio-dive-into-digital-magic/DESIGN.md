# OHZI Interactive Studio / Dive into digital magic. — Style Reference
> A glowing cube suspended in a dark gallery

**Theme:** dark

OHZI is a dark immersive void-gallery: a near-black expanse with a single luminous 3D object suspended in the center, reflected on a wet floor. The interface is deliberately skeletal — a logo, a hamburger, a headline, a ghost button — so the 3D render carries all the visual energy. Typography is exclusively Unbounded set with generous positive tracking, giving every line of text a wide, monumental, almost cinematic feel that whispers rather than shouts. Color is absent by design: the palette is pure grayscale so the 3D scene provides the only chromatic moment, making it feel like looking through a portal. Controls are thin-bordered, sharp-cornered, and translucent — they frame the experience rather than intrude on it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, icon strokes, hairline borders, outlined button frame — the only foreground color on the dark canvas, used at full opacity for headlines and at 1px hairline weight for UI structure |
| Void Black | `#000000` | `--color-void-black` | Deep background fill, SVG icon bases — the absolute floor of the visual hierarchy, used for full-bleed canvas and asset fills |
| Carbon | `#111111` | `--color-carbon` | Heading text on light sections, deep surface layer — near-black with a whisper of warmth, used where #000000 would feel too flat |
| Fog | `#f5f5f7` | `--color-fog` | Secondary text, subtle panel surfaces, light-section borders — cool-tinted off-white that softens transitions on inverted sections |
| Ash | `#cfcfcf` | `--color-ash` | Muted helper text, disabled states, tertiary borders — the mid-gray for elements that should recede |

## Tokens — Typography

### Unbounded — Sole typeface for everything — headlines, body, buttons, nav. Its geometric, slightly squared character with wide-aperture letterforms reads as digital-native and architectural. Weight 100 for display text creates a near-wireframe quality that feels holographic against the dark background. · `--font-unbounded`
- **Substitute:** Space Grotesk, or Chakra Petch for a similar geometric-futurist feel
- **Weights:** 100, 400, 500, 600, 700
- **Sizes:** 14, 16, 17, 18, 19, 23, 24, 30, 32, 38
- **Line height:** 1.20
- **Letter spacing:** 0.067em at 38px → 0.188em at 14px; the scale widens tracking as size decreases, inverting the usual typographic instinct
- **Role:** Sole typeface for everything — headlines, body, buttons, nav. Its geometric, slightly squared character with wide-aperture letterforms reads as digital-native and architectural. Weight 100 for display text creates a near-wireframe quality that feels holographic against the dark background.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | 2.63px | `--text-caption` |
| body-sm | 16px | 1.2 | 3.01px | `--text-body-sm` |
| body | 18px | 1.2 | 2.38px | `--text-body` |
| subheading | 24px | 1.2 | 2.66px | `--text-subheading` |
| heading-sm | 30px | 1.2 | 2.61px | `--text-heading-sm` |
| heading | 32px | 1.2 | 2.27px | `--text-heading` |
| display | 38px | 1.2 | 2.55px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 24-40px
- **Element gap:** 20px

## Components

### Ghost CTA Button
**Role:** Primary action trigger

Transparent fill, 1px solid #ffffff border, 0px radius, ~15px vertical × 30px horizontal padding. Text in Unbounded weight 500, uppercase, ~15px, letter-spacing ~0.132em, color #ffffff. The button is a pure frame — no fill, no shadow, no hover fill change. Its geometry (sharp corners, thin stroke) echoes the 3D cube's edges.

### Brand Lockup
**Role:** Top-left identity mark

Geometric shield/hex icon in #ffffff stroke, followed by 'OHZI INTERACTIVE STUDIO' in Unbounded weight 600, ~14px, uppercase, letter-spacing ~0.188em, color #ffffff. The lockup sits at the top-left with ~25-30px padding from the viewport edge.

### Hamburger Menu Trigger
**Role:** Navigation toggle

Three horizontal lines in #ffffff, 0px radius, ~24px wide, positioned top-right. No background, no border — just raw stroke geometry against the void.

### Hero Headline
**Role:** Page title

Centered, Unbounded weight 600-700, ~38px, uppercase, letter-spacing ~0.067em, color #ffffff. The wide tracking makes it feel like a film title card — monumental but unhurried.

### Hero Subtext
**Role:** Supporting description

Centered, Unbounded weight 300-400, ~16-18px, letter-spacing ~0.132em, color #cfcfcf or #f5f5f7. Single sentence, sits directly beneath headline with ~20px gap.

### 3D Hero Object
**Role:** Central visual anchor

A rendered 3D cube or geometric form floating in the center of the viewport, with a reflective wet-floor effect beneath. This is the only source of color and light in the system — it can glow blue, cyan, violet, or warm white depending on the scene. The object occupies the visual center while text wraps around or overlays it.

### Cookie Consent Banner
**Role:** Compliance overlay

Fixed bottom bar, transparent or #000000 background, white text at ~14px Unbounded weight 400, letter-spacing ~0.188em. Dismiss icon (X) in top-right of banner, rendered as thin #ffffff stroke.

## Do's and Don'ts

### Do
- Use Unbounded exclusively — never substitute a secondary typeface, the single-family discipline is the identity
- Apply positive letter-spacing to all text; never collapse tracking below 0.067em even at display sizes
- Keep all UI elements at 0px border-radius — sharp corners are non-negotiable and echo the 3D geometry
- Let the 3D scene be the sole source of color and light; UI stays pure grayscale (#ffffff, #f5f5f7, #cfcfcf, #111111, #000000)
- Use 1px hairline borders for all structural elements — buttons, dividers, card frames
- Center-align hero content and maintain generous vertical breathing room (80-120px between sections)
- Pair weight 600-700 for headlines with weight 100-400 for body to create a weight-contrast hierarchy that replaces color contrast

### Don't
- Never introduce accent colors, gradients, or chromatic buttons — the system is deliberately achromatic
- Never use border-radius on buttons, cards, inputs, or images — the sharp geometry is load-bearing
- Never apply shadows, glows, or blur effects to UI elements — depth belongs to the 3D scene only
- Never use negative letter-spacing or tight tracking — the wide-open spacing is the typographic signature
- Never fill buttons with solid color — always use the transparent ghost-button treatment with a 1px stroke frame
- Never use more than one typeface or mix serif/sans — Unbounded is the sole voice
- Never crowd the central viewport with UI — the 3D object needs negative space to breathe

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void Canvas | `#000000` | Full-bleed page background — the dark gallery floor |
| 2 | Carbon Panel | `#111111` | Inverted-section surfaces, heading backgrounds where depth is needed |
| 3 | Fog Surface | `#f5f5f7` | Light-mode content sections that alternate with the dark hero |

## Elevation

No shadows, no glows, no blur. Depth is created entirely through the 3D scene's own lighting and the reflective floor effect. UI elements sit flat against the void — any elevation would compete with the central 3D object.

## Imagery

Imagery is exclusively 3D-rendered geometric objects (cubes, prisms, abstract forms) floating in a dark void with reflective floor effects. No photography, no illustration, no flat icons. The 3D renders provide all chromatic content — they glow, refract, and cast reflections. UI icons (hamburger, dismiss X, logo mark) are minimal thin-stroke line geometry in #ffffff. The visual density is extremely low: one hero object, lots of void. This is an imagery-light site where a single rendered artifact carries the entire visual weight.

## Layout

Full-bleed dark canvas with no max-width constraint. Hero is a single full-viewport section: the 3D object sits dead-center, headline and subtext are centered directly above or overlapping the object, and the CTA button sits below. Navigation is minimal — a brand lockup top-left and hamburger top-right, both floating over the void with no background or container. Vertical rhythm is spacious, with 80-120px between distinct content blocks. The page likely scrolls to reveal additional sections (about, work, contact) that may alternate to lighter surfaces, but the dominant impression is of a single dark room with one illuminated object.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #ffffff
- text (secondary): #f5f5f7
- text (muted): #cfcfcf
- background (canvas): #000000
- background (panel): #111111
- border (hairline): #ffffff
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero with floating 3D object**: Full-bleed #000000 background, viewport-height section. Centered 3D-rendered geometric object (cube or prism) at viewport center with reflective floor effect beneath. Headline "DIVE INTO DIGITAL MAGIC" in Unbounded weight 700, 38px, #ffffff, letter-spacing 0.067em, centered. Subtext in Unbounded weight 300, 18px, #cfcfcf, letter-spacing 0.132em, centered, 20px below headline.

2. **Ghost outlined button**: Transparent fill, 1px solid #ffffff border, 0px radius, 15px padding-top/bottom × 30px padding-left/right. Text "EXPLORE" in Unbounded weight 500, 15px, uppercase, #ffffff, letter-spacing 0.132em. No hover fill change — keep it as a pure frame.

3. **Brand lockup (top-left nav)**: Geometric hex/shield icon in 1px #ffffff stroke, 20px wide. Followed by "OHZI INTERACTIVE STUDIO" in Unbounded weight 600, 14px, uppercase, #ffffff, letter-spacing 0.188em. Positioned at top-left with 30px padding from viewport edges.

4. **Full-bleed dark section**: 100% width, #000000 background, 80-120px vertical padding. Centered content stack with element-gap of 20px. All text in Unbounded with positive letter-spacing per the type scale. No cards, no containers, no borders — content floats on the void.

5. **Cookie consent bar**: Fixed to bottom of viewport, full width, #000000 background. Single line of text in Unbounded weight 400, 14px, #f5f5f7, letter-spacing 0.188em. Dismiss X icon (thin #ffffff stroke) in the right side of the bar.

## Similar Brands

- **Activision (gaming/entertainment)** — Same dark-void hero with a single luminous 3D object as the visual centerpiece, wide-tracked uppercase headlines, minimal UI chrome
- **Apple Vision Pro** — Full-bleed dark canvases with a single floating product/object, zero accent color, ghost button controls, cinematic negative space
- **Unity Technologies** — 3D-rendered hero objects suspended in dark space, geometric sans-serif typography with wide tracking, agency/tech crossover aesthetic
- **Burberry (luxury fashion)** — Unbounded's wide positive tracking at all sizes mirrors luxury fashion's letter-spaced wordmarks — the same typographic restraint signals premium positioning
- **Spline (3D design tool)** — Dark immersive 3D-first landing pages with minimal UI, single hero object, grayscale interface that lets the 3D content provide all color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-void-black: #000000;
  --color-carbon: #111111;
  --color-fog: #f5f5f7;
  --color-ash: #cfcfcf;

  /* Typography — Font Families */
  --font-unbounded: 'Unbounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: 2.63px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 3.01px;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: 2.38px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 2.66px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 2.61px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 2.27px;
  --text-display: 38px;
  --leading-display: 1.2;
  --tracking-display: 2.55px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-25: 25px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 24-40px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-carbon-panel: #111111;
  --surface-fog-surface: #f5f5f7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-void-black: #000000;
  --color-carbon: #111111;
  --color-fog: #f5f5f7;
  --color-ash: #cfcfcf;

  /* Typography */
  --font-unbounded: 'Unbounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: 2.63px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 3.01px;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: 2.38px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 2.66px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 2.61px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 2.27px;
  --text-display: 38px;
  --leading-display: 1.2;
  --tracking-display: 2.55px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-25: 25px;
  --spacing-30: 30px;
}
```
