# Affinity — Style Reference
> floating gallery in a black void — a dark editorial stage where one green accent is the only spot of light

**Theme:** dark

Affinity inhabits a black-void gallery: a single near-black canvas with editorial-scale serif headlines floating over it, surrounded by scattered design work as if pinned to an invisible wall. The visual grammar pairs a massive custom serif (reaching 112px at near-unity line-height) with a neutral sans for everything utilitarian, creating tension between gallery gravitas and interface clarity. A single electric spring-green — #a7f175 — is the only chromatic signal, used sparingly for the one action that matters. Images carry soft, directional drop shadows that suggest stage lighting on a dark backdrop. Surfaces stay nearly indistinguishable from the canvas; the system communicates through type scale, whitespace, and that one green pulse rather than elevation or color-coded regions.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Spring Pulse | `#a7f175` | `--color-spring-pulse` | Primary action buttons, active states, the single chromatic accent — a high-chroma lime-green that reads as switched-on against the black canvas |
| Void | `#000000` | `--color-void` | Page canvas, hero background, deepest surface — the negative space everything floats on |
| Obsidian | `#211d1d` | `--color-obsidian` | Elevated surface, button fills, subtle card backgrounds — one step off true black to distinguish interactive elements |
| Carbon | `#0f1015` | `--color-carbon` | Card surfaces, body text on light flips, icon fills — the workhorse dark for contained components |
| Bone | `#ffffff` | `--color-bone` | Headline text, body text on dark canvas, nav fill, button fills on dark — maximum-contrast white that never competes with the green accent |
| Ash | `#373434` | `--color-ash` | Card borders, hairline dividers on dark — barely visible structural lines |
| Smoke | `#707477` | `--color-smoke` | Muted body text, secondary copy, placeholder — readable but recedes |
| Fog | `#c4c4c4` | `--color-fog` | Subtle borders, disabled strokes, soft separators |
| Taupe | `#b0a79e` | `--color-taupe` | Footer dividers, warm-neutral hairline accents |
| Sand | `#e0dcd6` | `--color-sand` | Warm off-white for inverted button fills or light-section surfaces |
| Slate | `#505050` | `--color-slate` | Deep body text, pressed states |
| Iris | `#9e9eff` | `--color-iris` | Outlined-link borders, image accent strokes — the cool violet used for secondary chromatic borders |
| Amethyst | `#a370fc` | `--color-amethyst` | Outlined-link borders, body text accents — a warmer violet paired with Iris for link systems |
| Cobalt | `#3860be` | `--color-cobalt` | Link borders, hover-stroke accents — the deeper blue for interactive outlines |
| Tide | `#83d9e1` | `--color-tide` | Single-card background highlight, occasional surface wash — the teal that appears as a breathing accent |
| Saffron | `#fdbd68` | `--color-saffron` | Icon accents, body emphasis, warm stroke highlights — a yellow punctuation color used at micro scale |

## Tokens — Typography

### Times (system) — Captions, micro-meta text — the system serif fallback for fine print that should feel editorial, not utilitarian · `--font-times-system`
- **Substitute:** Times New Roman
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.20
- **Role:** Captions, micro-meta text — the system serif fallback for fine print that should feel editorial, not utilitarian

### Affinity Serif Variable — Display headlines only. The signature element — tight 0.96–1.10 line-height lets descenders nearly touch the line below, creating an editorial poster feel. The italic 'all' in headlines is the brand's voice. At 112px with weight 400 it whispers authority; the type is the artwork. · `--font-affinity-serif-variable`
- **Substitute:** Playfair Display
- **Weights:** 400, 700
- **Sizes:** 48px, 56px, 80px, 112px
- **Line height:** 0.96–1.10
- **Letter spacing:** 0
- **Role:** Display headlines only. The signature element — tight 0.96–1.10 line-height lets descenders nearly touch the line below, creating an editorial poster feel. The italic 'all' in headlines is the brand's voice. At 112px with weight 400 it whispers authority; the type is the artwork.

### Canva Sans — All UI, body, nav, buttons, subheads. The neutral workhorse with a subtle 0.01em tracking that gives it a slightly airy feel without feeling loose. Weight 500 for subheads, 600–700 for nav and button text. · `--font-canva-sans`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13px, 14px, 16px, 19px, 24px, 32px, 38px
- **Line height:** 1.20–1.57
- **Letter spacing:** 0.01em
- **Role:** All UI, body, nav, buttons, subheads. The neutral workhorse with a subtle 0.01em tracking that gives it a slightly airy feel without feeling loose. Weight 500 for subheads, 600–700 for nav and button text.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2, 1.8
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body-lg | 16px | 1.5 | 0.01px | `--text-body-lg` |
| subheading | 19px | 1.4 | 0.01px | `--text-subheading` |
| heading-sm | 24px | 1.3 | 0.01px | `--text-heading-sm` |
| heading | 32px | 1.25 | 0.01px | `--text-heading` |
| heading-lg | 38px | 1.2 | 0.01px | `--text-heading-lg` |
| display | 48px | 1.1 | — | `--text-display` |
| display-lg | 56px | 0.98 | — | `--text-display-lg` |
| display-xl | 80px | 0.96 | — | `--text-display-xl` |
| display-2xl | 112px | 0.96 | — | `--text-display-2xl` |

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
| 136 | 136px | `--spacing-136` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 8px |
| pills | 9999px |
| buttons | 8px |
| large-cards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.32) -20px 34px 64px 0px` | `--shadow-xl` |
| subtle | `rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 8...` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.07) 0px 0.5px 0px 0px inset, rgba(2...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(14, 19, 24, 0.07) 0px 0px 0px 1px, rgba(47, 64, 80, ...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset` | `--shadow-subtle-4` |
| subtle-5 | `rgb(255, 255, 255) 0px 0px 0px 1px inset` | `--shadow-subtle-5` |
| subtle-6 | `rgba(28, 39, 48, 0.5) 0px 0px 0px 1px inset` | `--shadow-subtle-6` |
| subtle-7 | `rgb(0, 0, 0) 0px 0px 0px 1px inset` | `--shadow-subtle-7` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 8-16px

## Components

### Top Navigation Bar
**Role:** Minimal site header with logo, nav items, and single CTA

Full-width, transparent on dark canvas. Logo 'affinity' in Canva Sans 700, white, left-aligned. Center nav items in Canva Sans 400–500 white at 14–16px. Right CTA: 'Get Affinity' pill button with download icon, 8px radius, Spring Pulse (#a7f175) fill, #0f1015 text, 12px 16px padding. 4px border-radius on nav dividers.

### Primary CTA Button (Spring Pulse)
**Role:** The single most important action on any page

Spring Pulse #a7f175 background, #0f1015 text, Canva Sans 500 at 14px, 8px border-radius, 12px 24px padding. Subtle 1px outer ring at rgba(14,19,24,0.07) and soft 18px shadow at rgba(47,64,80,0.25) for lift against the void. Download icon optional, 4px gap from text.

### Secondary Ghost Button
**Role:** Secondary action with low visual weight

Transparent or #ffffff fill on dark, #000000 text, 8px radius, 12px 24px padding, Canva Sans 500 14px. No border or 1px hairline #373434. Sits quietly next to the primary without competing.

### Editorial Display Headline
**Role:** The signature hero/section headline

Affinity Serif Variable, weight 400, 80–112px on desktop, white #ffffff. Line-height 0.96–1.10 — descenders crowd the line below. Italic word ('all') in weight 400 italic. Tight letter-spacing 0. May break across two lines with generous vertical stacking.

### Subheadline / Lede
**Role:** Supporting copy beneath the display headline

Canva Sans 400, 16px, Smoke #707477 or white #ffffff at reduced opacity. Max-width ~520px centered. Line-height 1.5. Reads as quiet, factual context beneath the loud serif.

### Floating Artwork Card
**Role:** Scattered design showcase images around the hero

Full-color image content (no overlay), hard-edge crop, ~200–280px on desktop. Soft directional drop shadow: rgba(0,0,0,0.32) -20px 34px 64px 0 — the shadow does the gallery-lighting work. Scattered asymmetrically around the headline with rotation implied by placement. No border, no radius — the images sit raw against black.

### Cookie Consent Banner
**Role:** Bottom-pinned consent strip

White #ffffff background, full-width bar fixed to bottom. Left: bold 'Affinity Cookies' heading in Canva Sans 700, body copy in Canva Sans 400 13–14px. Right: three buttons — 'Manage Cookies' (text/ghost), 'Reject All' (outlined), 'Accept All' (filled Spring Pulse, same spec as primary CTA). 16–24px vertical padding.

### Image-Frame Card (Contained)
**Role:** Cards with visible boundaries on dark

8px radius, Carbon #0f1015 or Obsidian #211d1d background, 1px hairline #373434 border. 16px padding. Used for secondary content blocks where a floating image would lose definition. No shadow — the border is the definition.

### Outlined Link / Text Button
**Role:** Inline links and micro-actions

4px radius, transparent fill, 1px border in Iris #9e9eff, Amethyst #a370fc, or Cobalt #3860be. Canva Sans 400–500, 14–16px, text in matching hue or white. Sits inline with body copy as a clickable token.

### Footer Divider
**Role:** Hairline separator at page bottom

1px solid Taupe #b0a79 at 8–32% opacity, full-width, 24–48px vertical margin above and below. Defines the end of the dark stage.

### Icon (UI)
**Role:** Small functional icons in nav and controls

Outlined, 1.5–2px stroke, white or Saffron #fdbd68 fill, 16–20px. Canva Sans context — no fill background, no circle wrapper. Icons float inline with text.

## Do's and Don'ts

### Do
- Use Spring Pulse #a7f175 only for the one primary action on screen — never for decoration, tags, or secondary buttons
- Let the Affinity Serif Variable headline reach 80–112px with line-height 0.96–1.10 so descenders crowd the next line
- Pair every display headline with Canva Sans 400 body copy at 14–16px — the serif-sans tension is the brand voice
- Give every floating artwork image the directional shadow: rgba(0,0,0,0.32) -20px 34px 64px 0 — the shadow is what makes them look pinned to a dark wall
- Use 8px radius for buttons and cards, 4px for nav and links, 9999px for pill tags — do not mix these tiers
- Keep the canvas #000000 or #211d1d for all hero and section backgrounds — never introduce a light surface mid-page
- Set display headlines to weight 400, not 700 — the whisper weight is the editorial authority

### Don't
- Do not use Spring Pulse on more than one element per viewport — it loses meaning when it repeats
- Do not apply the floating-artwork shadow to UI cards or buttons — it is reserved for showcase images only
- Do not set the Affinity Serif at body sizes (14–16px) — it is a display face, not a text face
- Do not use colored backgrounds for cards on the dark canvas — rely on 1px #373434 borders instead
- Do not introduce gradients as decorative fills — the only gradient is the green-to-teal radial on accent moments
- Do not let the CTA button radius deviate from 8px — pill-shaped CTAs break the geometric discipline
- Do not center the nav or push the logo away from the left edge — the asymmetry is intentional

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Page background, hero stage — the base everything floats on |
| 1 | Obsidian Surface | `#211d1d` | Elevated panels, button fills, subtle containment |
| 2 | Carbon Card | `#0f1015` | Card surfaces, contained content blocks, icon fills |
| 3 | Bone Inversion | `#ffffff` | Inverted surfaces for light sections, primary button fill on dark |

## Elevation

- **Floating artwork image:** `rgba(0, 0, 0, 0.32) -20px 34px 64px 0px`
- **Primary CTA button:** `rgba(14, 19, 24, 0.07) 0px 0px 0px 1px, rgba(47, 64, 80, 0.25) 0px 2px 18px 0px`
- **Inset highlight (buttons on light):** `rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset`

## Imagery

Imagery is the product. The site surrounds its headlines with full-color design work — editorial layouts, album covers, motion stills, portrait photography — scattered asymmetrically around the type as if pinned to a gallery wall. Each image is a hard-edge crop with no rounded corners and no frame, floating on the black canvas with a heavy directional drop shadow. The images are the proof of the product's capability: a green figure, a floral explosion, a neon explosion, a fashion spread, a concert poster. No lifestyle photography, no abstract gradients, no product screenshots of the software itself. Photography style: high-saturation, high-contrast, editorial — the work of designers using the tools. Icons are outlined, 1.5–2px stroke, white or saffron-accent, no filled backgrounds.

## Layout

Full-bleed dark hero is the dominant page model — no max-width container on the hero, the black canvas extends edge to edge. The headline is centered horizontally and vertically within the viewport, surrounded by 5–7 scattered artwork images at varying scales, positioned asymmetrically above, below, left, and right of the type. Below the headline: centered CTA pair (primary + ghost), then a small 'affinity × Canva' co-brand mark. Section rhythm: dark canvas continues with generous vertical breathing room (80px section gaps), each section punctuated by either a centered editorial headline or a scattered image arrangement. Navigation is a thin transparent top bar with logo left, center nav, single CTA right — no shadow, no border, it floats on the canvas. The cookie banner is a white full-width strip pinned to the bottom, breaking the dark stage with a single bright bar.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (on dark canvas)
- background: #000000
- card surface: #0f1015
- border: #373434
- accent / primary action: #a7f175 (filled action)
- muted text: #707477

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #a7f175 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


3. **Floating artwork card**: Raw image, no border, no radius, no background. Apply shadow rgba(0,0,0,0.32) -20px 34px 64px 0. Position absolutely in hero, rotated 0–5deg for gallery feel.

4. **Card with hairline border**: #0f1015 background, 1px #373434 border, 8px radius, 16px padding. Canva Sans 400 14px white body. No shadow — the border is the definition.


## Similar Brands

- **Linear** — Same near-black canvas, single chromatic accent for primary action, and editorial display headlines that dominate the viewport — the dark-stage-with-one-spot-of-color grammar
- **Arc browser** — Same scattered-image-around-headline hero pattern, massive serif display type, and the black-canvas-as-gallery treatment
- **Figma marketing site** — Same dark hero with floating showcase work, minimal nav, and a single vivid green as the only chromatic signal
- **Framer** — Same display-scale serif headlines on a dark canvas, scattered product work around the type, and high-contrast minimal nav
- **Pitch** — Same dark editorial-poster language, tight serif line-heights, and the pattern of letting showcase content float asymmetrically around bold display headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-spring-pulse: #a7f175;
  --color-void: #000000;
  --color-obsidian: #211d1d;
  --color-carbon: #0f1015;
  --color-bone: #ffffff;
  --color-ash: #373434;
  --color-smoke: #707477;
  --color-fog: #c4c4c4;
  --color-taupe: #b0a79e;
  --color-sand: #e0dcd6;
  --color-slate: #505050;
  --color-iris: #9e9eff;
  --color-amethyst: #a370fc;
  --color-cobalt: #3860be;
  --color-tide: #83d9e1;
  --color-saffron: #fdbd68;

  /* Typography — Font Families */
  --font-times-system: 'Times (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-affinity-serif-variable: 'Affinity Serif Variable', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-canva-sans: 'Canva Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.01px;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.01px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.01px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: 0.01px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.01px;
  --text-display: 48px;
  --leading-display: 1.1;
  --text-display-lg: 56px;
  --leading-display-lg: 0.98;
  --text-display-xl: 80px;
  --leading-display-xl: 0.96;
  --text-display-2xl: 112px;
  --leading-display-2xl: 0.96;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w401: 401;
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
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-136: 136px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-buttons: 8px;
  --radius-large-cards: 16px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.32) -20px 34px 64px 0px;
  --shadow-subtle: rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.07) 0px 0.5px 0px 0px inset, rgba(255, 255, 255, 0.07) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.3) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;
  --shadow-subtle-3: rgba(14, 19, 24, 0.07) 0px 0px 0px 1px, rgba(47, 64, 80, 0.25) 0px 2px 18px 0px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-6: rgba(28, 39, 48, 0.5) 0px 0px 0px 1px inset;
  --shadow-subtle-7: rgb(0, 0, 0) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-obsidian-surface: #211d1d;
  --surface-carbon-card: #0f1015;
  --surface-bone-inversion: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-spring-pulse: #a7f175;
  --color-void: #000000;
  --color-obsidian: #211d1d;
  --color-carbon: #0f1015;
  --color-bone: #ffffff;
  --color-ash: #373434;
  --color-smoke: #707477;
  --color-fog: #c4c4c4;
  --color-taupe: #b0a79e;
  --color-sand: #e0dcd6;
  --color-slate: #505050;
  --color-iris: #9e9eff;
  --color-amethyst: #a370fc;
  --color-cobalt: #3860be;
  --color-tide: #83d9e1;
  --color-saffron: #fdbd68;

  /* Typography */
  --font-times-system: 'Times (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-affinity-serif-variable: 'Affinity Serif Variable', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-canva-sans: 'Canva Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.01px;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.01px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.01px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: 0.01px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.01px;
  --text-display: 48px;
  --leading-display: 1.1;
  --text-display-lg: 56px;
  --leading-display-lg: 0.98;
  --text-display-xl: 80px;
  --leading-display-xl: 0.96;
  --text-display-2xl: 112px;
  --leading-display-2xl: 0.96;

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
  --spacing-136: 136px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.32) -20px 34px 64px 0px;
  --shadow-subtle: rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.07) 0px 0.5px 0px 0px inset, rgba(255, 255, 255, 0.07) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.3) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;
  --shadow-subtle-3: rgba(14, 19, 24, 0.07) 0px 0px 0px 1px, rgba(47, 64, 80, 0.25) 0px 2px 18px 0px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-6: rgba(28, 39, 48, 0.5) 0px 0px 0px 1px inset;
  --shadow-subtle-7: rgb(0, 0, 0) 0px 0px 0px 1px inset;
}
```
