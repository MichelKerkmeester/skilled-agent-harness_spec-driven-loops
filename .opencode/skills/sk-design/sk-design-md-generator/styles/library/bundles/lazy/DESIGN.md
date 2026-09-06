# Lazy — Style Reference
> Midnight typeset manuscript

**Theme:** dark

Lazy speaks in a whisper-dark, almost monastic register: deep charcoal canvas, near-achromatic borders, and headlines set in a refined serif that feels like editorial print transplanted into a productivity tool. The entire palette stays within three values of gray — no chromatic accents, no decorative gradients on text — letting structure and serif weight carry all hierarchy. Components float on the canvas with soft, low-opacity shadows rather than hard borders, evoking a darkroom where objects glow rather than reflect. Information density is intentionally sparse; one focal element per viewport, generous negative space, and serif type at 55-58px that anchors every section like a magazine pull quote.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Canvas | `#26272c` | `--color-carbon-canvas` | Page background, hero canvas, section grounds |
| Obsidian | `#0a0a0a` | `--color-obsidian` | Deepest borders, shadow cores, overlaid text on light surfaces |
| Inkwell | `#1a1b1f` | `--color-inkwell` | Secondary surface tint, input fills, subtle elevation step above canvas |
| Graphite Card | `#3b3c3e` | `--color-graphite-card` | Elevated card surfaces, modal panels, floating UI containers |
| Pewter | `#8a8c93` | `--color-pewter` | Primary hairline borders, structural dividers, most-used neutral |
| Slate | `#62646a` | `--color-slate` | Secondary borders, link underlines, subdued UI strokes |
| Ash | `#535355` | `--color-ash` | Badge borders, tertiary separators, muted structural lines |
| Bone | `#e0e0e0` | `--color-bone` | Light card borders, high-contrast dividers, icon strokes on dark surfaces |
| Chalk | `#b8b8b8` | `--color-chalk` | Muted body borders, low-emphasis separators |
| Paper | `#ffffff` | `--color-paper` | Primary heading text, high-contrast body text, emphasis borders |

## Tokens — Typography

### Migra — Display headlines and section labels — the only serif in the system, giving Lazy its editorial identity · `--font-migra`
- **Substitute:** Fraunces, Source Serif Pro, or Cormorant Garamond
- **Weights:** 500
- **Sizes:** 21px, 58px
- **Line height:** 1.09, 1.25
- **Letter spacing:** 0.026em at 21px, 0.048em at 58px — positive tracking is anti-convention for serif, making labels feel architectural and headlines feel set rather than typed
- **Role:** Display headlines and section labels — the only serif in the system, giving Lazy its editorial identity

### Inter — Ultra-light display weight for large UI headlines, pairing with Migra serif in hero · `--font-inter`
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 20px, 24px, 28px, 55px
- **Line height:** 1.09, 1.10, 1.20, 1.23, 1.25, 1.38, 1.43, 1.50, 1.57, 1.60, 1.83, 2.00
- **Letter spacing:** -0.045em at 55px — extreme negative tracking compensates for thin strokes
- **Role:** Ultra-light display weight for large UI headlines, pairing with Migra serif in hero

### Inter — Body text, descriptions, and subheads — comfortable reading at 16px with generous 1.5 line-height · `--font-inter`
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 20px, 24px, 28px, 55px
- **Line height:** 1.09, 1.10, 1.20, 1.23, 1.25, 1.38, 1.43, 1.50, 1.57, 1.60, 1.83, 2.00
- **Letter spacing:** -0.0450em, -0.0420em, -0.0360em, -0.0310em, -0.0250em, -0.0210em, -0.0170em, -0.0050em, -0.0040em, 0.1380em
- **Role:** Body text, descriptions, and subheads — comfortable reading at 16px with generous 1.5 line-height

### Inter — Navigation, labels, button text, micro-copy — the workhorse UI weight · `--font-inter`
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 20px, 24px, 28px, 55px
- **Line height:** 1.09, 1.10, 1.20, 1.23, 1.25, 1.38, 1.43, 1.50, 1.57, 1.60, 1.83, 2.00
- **Letter spacing:** -0.0450em, -0.0420em, -0.0360em, -0.0310em, -0.0250em, -0.0210em, -0.0170em, -0.0050em, -0.0040em, 0.1380em
- **Role:** Navigation, labels, button text, micro-copy — the workhorse UI weight

### Inter — Emphasis in body copy, strong button text, active state indicators · `--font-inter`
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 20px, 24px, 28px, 55px
- **Line height:** 1.09, 1.10, 1.20, 1.23, 1.25, 1.38, 1.43, 1.50, 1.57, 1.60, 1.83, 2.00
- **Letter spacing:** -0.0450em, -0.0420em, -0.0360em, -0.0310em, -0.0250em, -0.0210em, -0.0170em, -0.0050em, -0.0040em, 0.1380em
- **Role:** Emphasis in body copy, strong button text, active state indicators

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.45 | 0.138px | `--text-caption` |
| body | 16px | 1.5 | -0.08px | `--text-body` |
| serif-label | 21px | 1.25 | 0.546px | `--text-serif-label` |
| heading-sm | 24px | 1.25 | -0.504px | `--text-heading-sm` |
| heading | 28px | 1.23 | -0.756px | `--text-heading` |
| display | 55px | 1.09 | -2.475px | `--text-display` |
| serif-display | 58px | 1.09 | 2.784px | `--text-serif-display` |

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
| 120 | 120px | `--spacing-120` |
| 168 | 168px | `--spacing-168` |
| 184 | 184px | `--spacing-184` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| input | 8px |
| pills | 100px |
| modals | 12px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.12) 0px 12px 12px 0px` | `--shadow-md` |
| sm | `rgba(4, 4, 7, 0.25) 0px 2px 4px 0px, rgba(4, 4, 7, 0.4) 0...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 14px

## Components

### Top Navigation
**Role:** Persistent header bar with brand, nav links, auth actions

Full-width transparent bar over canvas. Logo (icon + 

### Outlined CTA Button
**Role:** Primary call-to-action in header and inline contexts

Ghost button: transparent background, 1px border in #62646a, 4px radius, padding 6px 14px. Text Inter 13px weight 500, #ffffff. The border is the affordance, not a fill — this button never uses solid color, maintaining the monochrome discipline.

### Command Bar
**Role:** Central hero element — the product's capture interface demonstrated inline

Floating card on canvas: 8px radius, background #3b3c3 with 40% black shadow stack. Internal input area with placeholder 

### Serif Section Label
**Role:** Small uppercase tagline above section headlines

Migra 21px weight 500, letter-spacing 0.026em, color #8a8c93. Centered above display headline. The positive tracking on serif gives it a printed-typeset quality, contrasting the sans-serif body. Used as section markers like 

### Serif Display Headline
**Role:** Primary section headline in editorial serif

Migra 58px weight 500, letter-spacing 0.048em, line-height 1.09, color #ffffff. Centered, max-width 800px. The headline reads like a book chapter title — this is Lazy's signature type choice. Below it sits a lighter-weight subhead in the same serif.

### Sans Display Headline
**Role:** Hero headline that pairs with the serif subhead

Inter 55px weight 300, letter-spacing -0.045em, line-height 1.10, color #ffffff. The whisper-weight (300) is deliberate — Lazy doesn't shout. Pairs with a subhead at 16-20px Inter 400 in #8a8c93.

### Note Preview Card
**Role:** Embedded article/note preview in interactive sections

Light-toned card (simulating a note app): background #ffffff or very light gray, 8px radius, padding 14-24px, subtle shadow. Content includes bold title 

### Inline Tag
**Role:** Small contextual label or category marker

Inter 12px weight 500, padding 2px 8px, 4px radius, border 1px solid #535355, color #8a8c93. Outlined only — no fill. Functions as a quiet metadata marker.

### Demo Link
**Role:** Inline text link to interactive product demo

Inter 14px weight 500, color #ffffff, underline on hover. Preceded by descriptive text in #8a8c93. Example: 

### Floating Orb / Cursor Indicator
**Role:** Interactive cursor or loading indicator overlay

Circular dark element (#0a0a0a) approximately 120-160px diameter, positioned absolutely over content during interaction states. Casts no shadow itself but sits above cards to suggest a cursor following a user's attention. Unique to Lazy's interaction model.

### Radial Light Wash
**Role:** Hero section background glow effect

Concentric circular gradient emanating from center of hero — brightest at core fading to canvas. Creates a 

## Do's and Don'ts

### Do
- Use Migra 58px weight 500 with 0.048em tracking for all section-level display headlines — this is the brand's voice
- Set body text at Inter 16px weight 400 with line-height 1.5 for comfortable reading rhythm
- Apply the dual-layer shadow stack (rgba(4,4,7,0.25) 0 2px 4px + rgba(4,4,7,0.4) 0 8px 24px) to all floating UI elements like command bars and modals
- Maintain 8px radius for cards and 4px radius for buttons — this 2:1 ratio is consistent across the system
- Use #8a8c93 as the default border color at 1px width — it is the most-used token in the system (1357 occurrences) and defines visual structure
- Center all hero and section content; Lazy is a symmetrical, meditative layout — never left-align primary headlines
- Pair every serif headline with a sans-serif subhead in #8a8c93 — the contrast between Migra and Inter creates Lazy's editorial-meets-UI identity

### Don't
- Never introduce chromatic colors — the entire system is achromatic by design; adding a blue or green would break the editorial register
- Never use solid-fill CTA buttons; all action buttons are ghost/outlined with #62646a borders to maintain the quiet aesthetic
- Never set body text tighter than -0.005em letter-spacing or display text looser than 0.138em — the tracking curve is the system
- Never use Migra below 21px — at smaller sizes the serif loses its editorial character and becomes noise
- Never add drop shadows stronger than the documented two values — Lazy floats softly, never projects hard edges
- Never left-align serif display headlines — they must be centered to maintain the typeset manuscript metaphor
- Never use white (#ffffff) as a background; white is reserved for primary text and the note-preview card contrast moment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Carbon Canvas | `#26272c` | Base page background for all sections |
| 1 | Inkwell | `#1a1b1f` | Recessed inputs, subtle inset surfaces, secondary canvas tint |
| 2 | Obsidian | `#0a0a0a` | Deepest border, shadow anchor, maximum contrast for text |
| 3 | Graphite Card | `#3b3c3` | Elevated card surfaces, floating command bars, modal panels |

## Elevation

- **Command Bar / Floating Input:** `rgba(4, 4, 7, 0.25) 0px 2px 4px 0px, rgba(4, 4, 7, 0.4) 0px 8px 24px 0px`
- **Card with soft drop:** `rgba(0, 0, 0, 0.12) 0px 12px 12px 0px`

## Imagery

Lazy uses almost no traditional imagery — the visual system is type-driven and UI-driven. The only 

## Layout

Lazy follows a full-bleed dark canvas with centered content blocks. The page reads as vertical scroll through typographic acts: each section is a centered composition with a serif label, serif headline, sans subhead, and one focal UI element. Max-width is 1200px for the content column, but the canvas extends edge-to-edge. The hero occupies a full viewport with the command bar centered and a radial light effect drawing the eye. Subsequent sections are 80px vertical gaps with the same centered axis. There is no left/right alternation, no sidebar, no grid of cards — each section is a single editorial spread. Navigation is a minimal top bar with no background fill.

## Agent Prompt Guide

## Quick Color Reference\n- text (primary): #ffffff\n- text (muted): #8a8c93\n- background: #26272c\n- card surface: #3b3c3e\n- border: #8a8c93 (1px)\n- primary action: no distinct CTA color

## Typography Philosophy

Lazy runs a two-font system: Migra (serif) for editorial moments, Inter (sans) for everything else. The serif is never used for body text, navigation, or UI labels — it appears only in display headlines and section labels. This separation creates a clear register shift: when the user sees serif, they are reading a statement; when they see Inter, they are using the product. Inter operates across four weights (300/400/500/600) with weight 300 reserved exclusively for the hero display headline — the lightest weight says 

## Shadow & Elevation Philosophy

Lazy uses exactly two shadow patterns and nothing else. The soft card shadow (rgba(0,0,0,0.12) 0 12px 12px) is a single-layer ambient lift for content cards. The floating UI shadow (rgba(4,4,7,0.25) 0 2px 4px + rgba(4,4,7,0.4) 0 8px 24px) is a two-layer stack for elements that float above the canvas — command bars, modals, interactive overlays. The 0.4 opacity in the second layer is high for a shadow, but it works because the canvas is already dark; the shadow reads as depth, not darkness. There are no colored shadows, no glows, no inner shadows. Elevation is communicated by lift, not by border emphasis.

## Similar Brands

- **Notion** — Same centered, single-focal-element-per-section hero pattern with a command bar as the hero UI
- **Linear** — Dark-mode productivity tool with extreme typographic restraint and Inter as the UI workhorse font
- **Vercel** — Full-bleed dark canvas with centered editorial compositions and generous vertical rhythm between sections
- **Read.cv** — Serif-and-sans typography pairing on a dark canvas that reads as editorial rather than SaaS
- **Are.na** — Monochrome, type-driven visual system where structure and whitespace carry all hierarchy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-canvas: #26272c;
  --color-obsidian: #0a0a0a;
  --color-inkwell: #1a1b1f;
  --color-graphite-card: #3b3c3e;
  --color-pewter: #8a8c93;
  --color-slate: #62646a;
  --color-ash: #535355;
  --color-bone: #e0e0e0;
  --color-chalk: #b8b8b8;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-migra: 'Migra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: 0.138px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-serif-label: 21px;
  --leading-serif-label: 1.25;
  --tracking-serif-label: 0.546px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.504px;
  --text-heading: 28px;
  --leading-heading: 1.23;
  --tracking-heading: -0.756px;
  --text-display: 55px;
  --leading-display: 1.09;
  --tracking-display: -2.475px;
  --text-serif-display: 58px;
  --leading-serif-display: 1.09;
  --tracking-serif-display: 2.784px;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-168: 168px;
  --spacing-184: 184px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 22px;
  --radius-3xl: 26px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-input: 8px;
  --radius-pills: 100px;
  --radius-modals: 12px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 12px 12px 0px;
  --shadow-sm: rgba(4, 4, 7, 0.25) 0px 2px 4px 0px, rgba(4, 4, 7, 0.4) 0px 8px 24px 0px;

  /* Surfaces */
  --surface-carbon-canvas: #26272c;
  --surface-inkwell: #1a1b1f;
  --surface-obsidian: #0a0a0a;
  --surface-graphite-card: #3b3c3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-canvas: #26272c;
  --color-obsidian: #0a0a0a;
  --color-inkwell: #1a1b1f;
  --color-graphite-card: #3b3c3e;
  --color-pewter: #8a8c93;
  --color-slate: #62646a;
  --color-ash: #535355;
  --color-bone: #e0e0e0;
  --color-chalk: #b8b8b8;
  --color-paper: #ffffff;

  /* Typography */
  --font-migra: 'Migra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: 0.138px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-serif-label: 21px;
  --leading-serif-label: 1.25;
  --tracking-serif-label: 0.546px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.504px;
  --text-heading: 28px;
  --leading-heading: 1.23;
  --tracking-heading: -0.756px;
  --text-display: 55px;
  --leading-display: 1.09;
  --tracking-display: -2.475px;
  --text-serif-display: 58px;
  --leading-serif-display: 1.09;
  --tracking-serif-display: 2.784px;

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
  --spacing-120: 120px;
  --spacing-168: 168px;
  --spacing-184: 184px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 22px;
  --radius-3xl: 26px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 12px 12px 0px;
  --shadow-sm: rgba(4, 4, 7, 0.25) 0px 2px 4px 0px, rgba(4, 4, 7, 0.4) 0px 8px 24px 0px;
}
```
