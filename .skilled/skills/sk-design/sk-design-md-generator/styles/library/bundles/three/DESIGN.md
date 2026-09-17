# Three — Style Reference
> Molten ember on gunmetal — a single hot-orange spark cutting through near-total darkness, with every surface stripped of color until the moment something matters.

**Theme:** dark

ThreeTools is a matte-black developer canvas lit by a single molten-orange spark. The interface is overwhelmingly achromatic — near-black surfaces, white text, gray hairline borders — and the only chromatic element is a vivid #ff4300 reserved exclusively for primary action surfaces and decorative emphasis. Typography is aggressively bold: the system font is set at weight 700 across every size from 9px badges to 68px display headlines, with tight negative tracking that intensifies as type grows. Components are softly rounded with 15–25px radii on controls and cards, 50–999px on inputs and pills, giving a friendly counterweight to the otherwise austere dark background. The design system is minimal, monochromatic, and lets the brand-orange carry 100% of the chromatic narrative — a single warm point in a sea of graphite.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff4300` | `--color-ember-orange` | Orange action color for filled buttons, selected navigation states, and focused conversion moments |
| Void Black | `#111111` | `--color-void-black` | Page canvas, deepest background layer |
| Obsidian | `#181818` | `--color-obsidian` | Elevated card surface, section backgrounds |
| Charcoal | `#2b2a2a` | `--color-charcoal` | Footer surface, tertiary elevated panel |
| Graphite | `#343434` | `--color-graphite` | Card borders, secondary button fills, hairline dividers |
| Steel | `#666666` | `--color-steel` | Muted secondary headings, sub-label text |
| Fog | `#8d8d8d` | `--color-fog` | Tertiary heading text, less-prominent labels |
| Ash | `#999999` | `--color-ash` | Muted body text, secondary borders, icon strokes |
| Silver | `#cacaca` | `--color-silver` | Primary text on dark surfaces, dominant hairline borders, icon strokes |
| Pure White | `#ffffff` | `--color-pure-white` | Headlines, badge fills, input text, emphasis text, subtle border highlights |
| Bone | `#e9e6e6` | `--color-bone` | Off-white button fill, soft surface highlight |

## Tokens — Typography

### -apple-system, system-ui, sans-serif — The system font stack is used at weight 700 only — this exclusive boldness is a signature choice. No 300/400/500/600 weights appear. At 68px the tracking tightens to -0.056em, creating dense display headlines that feel machined rather than airy. At 14–16px the tracking relaxes to -0.008em to -0.015em, keeping body text legible without losing the assertive feel. The single-weight discipline means hierarchy comes purely from size and color, not weight variation. · `--font-apple-system-system-ui-sans-serif`
- **Substitute:** Inter (700 only), or any geometric sans with a strong 700 cut
- **Weights:** 700
- **Sizes:** 9px, 10px, 12px, 14px, 16px, 18px, 20px, 22px, 24px, 46px, 48px, 68px
- **Line height:** 1.00–1.25
- **Letter spacing:** -0.0560em, -0.0300em, -0.0250em, -0.0160em, -0.0150em, -0.0110em, -0.0080em
- **Role:** The system font stack is used at weight 700 only — this exclusive boldness is a signature choice. No 300/400/500/600 weights appear. At 68px the tracking tightens to -0.056em, creating dense display headlines that feel machined rather than airy. At 14–16px the tracking relaxes to -0.008em to -0.015em, keeping body text legible without losing the assertive feel. The single-weight discipline means hierarchy comes purely from size and color, not weight variation.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 14px | 1.25 | -0.14px | `--text-body` |
| body-lg | 16px | 1.25 | -0.24px | `--text-body-lg` |
| subheading | 20px | 1.25 | -0.3px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.36px | `--text-heading-sm` |
| heading | 46px | 1 | -1.15px | `--text-heading` |
| display | 68px | 1 | -3.8px | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 76 | 76px | `--spacing-76` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20-25px |
| pills | 999px |
| badges | 7px |
| inputs | 50px |
| buttons | 15px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary Action Button (Ember)
**Role:** Filled orange CTA — the only chromatic button in the system

Background #ff4300, text in white at weight 700, border-radius 15px, padding 8px 20px. Used for 'Get access', 'Get Notified' — every primary action in the product. No hover state variation in the data; the orange carries the entire interactive signal.

### Email Capture Input (Pill)
**Role:** Rounded email signup field paired with the primary CTA

Dark surface (#111 or #181818), white placeholder text, border-radius 50px, padding 8–10px vertical, ~20px horizontal. The pill shape is the visual signature of the form — soft, inviting, and the only place where 50px radius is used.

### Logo Lockup
**Role:** Brand mark in the top-left header

Small geometric Y-icon (the Three.js mark) at ~24px next to the wordmark 'ThreeTools' in white weight 700 ~14-16px. Followed by a 'Beta' badge. Logo sits on the void canvas with no background container.

### Beta Badge
**Role:** Status indicator next to the product name

Small pill or rounded rectangle, white text on dark fill, border-radius 7px, padding ~1-3px vertical / 5px horizontal, font size 9-10px weight 700. Marks pre-release status.

### Header Ghost Button
**Role:** Secondary action in the top-right

Transparent background with subtle border, white text, border-radius 15px, weight 700. Provides the visual counterweight to the filled CTA when both appear.

### Status Pill (Registration Closed)
**Role:** Inline status message with icon

Small horizontal cluster: Ember orange icon/badge + dark text. The orange dot/icon appears at ~12px, followed by 'Registration closed' in white and helper text in gray. Communicates system state without modal interruption.

### 3D Hero Showcase
**Role:** Full-bleed visual centerpiece

A matte Y-shaped 3D object rendered in deep red-orange tones with a wireframe grid overlay (white lines at low opacity). Sits centered on void black, no border, no container — the object IS the hero, framed only by negative space.

### Card Surface
**Role:** Elevated content container

Background #181818 or #343434, border 1px in #343434 or #cacaca at low opacity, border-radius 20-25px, padding 20px. Used for product screenshots, feature blocks, testimonials. No drop shadow — elevation is communicated purely through surface tone shift.

### Headline Block
**Role:** Hero or section title

White text at 46-68px weight 700, letter-spacing -0.025em to -0.056em, line-height 1.00-1.25, centered alignment. The extreme tracking at display sizes makes headlines feel compressed and confident rather than spacious.

### Subtext Block
**Role:** Supporting paragraph below a headline

Ash-gray (#999999) or Silver (#cacaca) text at 14-16px weight 700, centered, line-height ~1.25. Minimal — one to two lines max. The same weight 700 discipline applies even at body sizes.

## Do's and Don'ts

### Do
- Use #ff4300 exclusively for primary action fills and brand-critical decorative accents — never for body text, borders, or secondary surfaces.
- Set all text at weight 700 in the system font stack; rely on size and color for hierarchy, not weight variation.
- Apply border-radius 15px to buttons, 20-25px to cards, 50px to pill inputs, and 999px to fully rounded tags.
- Use the surface stack #111111 → #181818 → #343434 to communicate elevation through tone, never through drop shadows.
- Apply tight negative letter-spacing at display sizes: -0.056em at 68px, -0.025em at 46-48px, -0.015em at 16-18px.
- Keep the canvas at #111111 and let content cards sit one step lighter at #181818 — the contrast delta is the entire elevation system.
- Use #cacaca as the default hairline border and icon stroke color — it reads as 'neutral structure' against the dark surface.

### Don't
- Never introduce a second chromatic color — the monochromatic discipline is what makes the orange Ember feel like a spark.
- Never use weight 300/400/500/600 in the system font; the exclusive 700 is the signature.
- Never use heavy drop shadows or glow effects; elevation is achieved through surface tone shifts only.
- Never apply loose or positive letter-spacing to headlines — the compressed tracking is essential to the feel.
- Never use #000000 as a fill for text or surfaces; the canvas is #111111, one step off pure black, to avoid harsh edges.
- Never add gradients as a background decoration — if a gradient is used, it should be on a 3D artwork, not a UI surface.
- Never place a filled Ember button on top of another Ember-tinted element; the orange needs the dark void around it to register.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#111111` | Base page background, full-bleed |
| 1 | Obsidian Card | `#181818` | Elevated card and section backgrounds |
| 2 | Charcoal Panel | `#2b2a2a` | Footer, tertiary elevated panels |
| 3 | Graphite Border | `#343434` | Card and button borders, subtle dividers |

## Elevation

Elevation is communicated exclusively through surface tone shifts in a dark monochrome stack (#111 → #181 → #343). No drop shadows are used anywhere — the matte-black aesthetic would be broken by any light bloom or shadow cast. Components feel layered because each tier is a measurable step lighter, not because they float.

## Imagery

Imagery is 3D-first: a matte Y-shaped geometric object rendered in deep red-orange with a white wireframe grid overlay, sitting in pure negative space. There is no photography, no lifestyle imagery, no illustration. The 3D render IS the brand expression — the product is a 3D editor, so the hero is a 3D object. Below the fold, a browser-frame screenshot of the product appears, contained within a dark rounded card. All visual content is either product artifacts or 3D renders — never decorative stock or abstract graphics.

## Layout

Max-width ~1200px centered on a full-bleed dark canvas. The hero is a centered vertical stack: 3D visual on top, then a two-line bold headline, then a two-line subtext — all center-aligned with generous vertical breathing room. The header is a minimal horizontal bar with logo left, single CTA right, no nav links. Below the hero, a pill-shaped email capture form sits centered, followed by a large section gap and a product screenshot card. Sections are separated by pure vertical space, never by dividers or alternating background bands — the entire page shares one continuous dark canvas.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary) / #cacaca (secondary) / #999999 (muted)
- background: #111111 (canvas) / #181818 (card)
- border: #cacaca (hairline) / #343434 (structural)
- accent / primary action: #ff4300 (filled action)

**Example Component Prompts**
1. *Hero headline*: 68px system font weight 700, color #ffffff, letter-spacing -0.056em, line-height 1.00, centered. Set against #111111 void canvas with 100px vertical padding above and below.

2. Create a Primary Action Button: #ff4300 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. *Email capture pill*: A single rounded container at border-radius 50px, background #181818, containing a dark input field (white placeholder text, 14px weight 700) on the left and a #ff4300 filled button (white text, 15px radius, 8px 20px padding) on the right. Total height ~44px.

4. *Elevated card*: Background #181818, border 1px #343434, border-radius 20px, padding 20px. Contains a product screenshot or feature block. No shadow — elevation comes from the tone shift only.

5. *Status indicator*: A small inline cluster: a 12px #ff4300 filled circle or icon, followed by 'Closed' in #ffffff weight 700 at 12px, then a muted helper phrase in #999999 at 12px. All on the #111111 canvas.

## Similar Brands

- **Linear** — Same dark matte canvas with a single vivid accent color, tight system font at heavy weight, minimal component palette, and 3D object as hero visual.
- **Vercel** — Black-canvas aesthetic with one warm chromatic accent, exclusive use of bold weight, generous negative space, and a product screenshot as the hero rather than lifestyle imagery.
- **Railway** — Dark monochromatic interface where a single warm accent (purple/orange) carries all interactive energy, with pill-shaped inputs and rounded card surfaces.
- **Replit** — Developer-tool dark UI with a 3D-illustration hero, bold system font, and a single orange accent for CTAs against near-black surfaces.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff4300;
  --color-void-black: #111111;
  --color-obsidian: #181818;
  --color-charcoal: #2b2a2a;
  --color-graphite: #343434;
  --color-steel: #666666;
  --color-fog: #8d8d8d;
  --color-ash: #999999;
  --color-silver: #cacaca;
  --color-pure-white: #ffffff;
  --color-bone: #e9e6e6;

  /* Typography — Font Families */
  --font-apple-system-system-ui-sans-serif: '-apple-system, system-ui, sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.25;
  --tracking-body: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.25;
  --tracking-body-lg: -0.24px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.3px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.36px;
  --text-heading: 46px;
  --leading-heading: 1;
  --tracking-heading: -1.15px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: -3.8px;

  /* Typography — Weights */
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
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-76: 76px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 7px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-full: 50px;
  --radius-full-2: 99px;
  --radius-full-3: 999px;

  /* Named Radii */
  --radius-cards: 20-25px;
  --radius-pills: 999px;
  --radius-badges: 7px;
  --radius-inputs: 50px;
  --radius-buttons: 15px;

  /* Surfaces */
  --surface-void-canvas: #111111;
  --surface-obsidian-card: #181818;
  --surface-charcoal-panel: #2b2a2a;
  --surface-graphite-border: #343434;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff4300;
  --color-void-black: #111111;
  --color-obsidian: #181818;
  --color-charcoal: #2b2a2a;
  --color-graphite: #343434;
  --color-steel: #666666;
  --color-fog: #8d8d8d;
  --color-ash: #999999;
  --color-silver: #cacaca;
  --color-pure-white: #ffffff;
  --color-bone: #e9e6e6;

  /* Typography */
  --font-apple-system-system-ui-sans-serif: '-apple-system, system-ui, sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.25;
  --tracking-body: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.25;
  --tracking-body-lg: -0.24px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.3px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.36px;
  --text-heading: 46px;
  --leading-heading: 1;
  --tracking-heading: -1.15px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: -3.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-76: 76px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 7px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-full: 50px;
  --radius-full-2: 99px;
  --radius-full-3: 999px;
}
```
