# Mercury — Style Reference
> Alpine banking at blue hour

**Theme:** dark

Mercury operates in an alpine banking aesthetic: a near-black canvas (#171721) sets a cinematic, observatory-like atmosphere where content surfaces float as subtly lighter graphite cards. The interface is overwhelmingly monochromatic — ivory text on onyx, with a single vivid cobalt (#5266eb) acting as the only chromatic punctuation, reserved exclusively for the primary 'Open account' action. Typography carries the weight of expression: a custom display face at intermediate weight 480 (neither bold nor light) paired with a refined body face at weight 400, creating a voice that is confident but never loud. Components are flat and borderless, relying on the 12px-radius graphite card lift and pill-shaped controls to define structure rather than shadows. The full-bleed photographic hero — misty mountains with a solitary desk — establishes aspiration before the product UI takes over, and every subsequent surface maintains that hushed, premium darkness.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Onyx Canvas | `#171721` | `--color-onyx-canvas` | Dominant page background, hero overlay base, footer and section canvases |
| Graphite Card | `#1e1e2a` | `--color-graphite-card` | Elevated card and section surfaces — one step lighter than the canvas to create quiet separation |
| Obsidian Button | `#272735` | `--color-obsidian-button` | Secondary button fills, inline form backgrounds, subtle interactive surfaces |
| Slate Border | `#70707d` | `--color-slate-border` | Medium-weight dividers and structural borders between content blocks |
| Mist Border | `#e2e3ed` | `--color-mist-border` | Light hairline borders, ghost-button outlines, input edges — light-on-dark border |
| Ash Text | `#c3c3cc` | `--color-ash-text` | Muted body copy, helper text, secondary labels — reduced hierarchy without losing legibility |
| Ivory Text | `#ededf3` | `--color-ivory-text` | Primary text, icons, nav items, ghost-button strokes and text — the dominant foreground color across the system |
| Cobalt | `#5266eb` | `--color-cobalt` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Pure White | `#ffffff` | `--color-pure-white` | Text and icon fills on cobalt primary buttons for maximum contrast |

## Tokens — Typography

### arcadia — Body and UI typeface — handles navigation, body copy, buttons, inputs, labels, and supporting text at weight 400 for body and 480 for emphasis. The intermediate weight scale (360, 420, 480) instead of standard (300/400/600) gives Mercury's text a distinctly calibrated feel — never bold, never thin, always measured · `--font-arcadia`
- **Substitute:** Inter
- **Weights:** 360, 400, 420, 480
- **Sizes:** 12px, 14px, 16px, 18px, 21px
- **Line height:** 1.00–1.50
- **Letter spacing:** 0.005em at 14px, 0.01em at 12px
- **Role:** Body and UI typeface — handles navigation, body copy, buttons, inputs, labels, and supporting text at weight 400 for body and 480 for emphasis. The intermediate weight scale (360, 420, 480) instead of standard (300/400/600) gives Mercury's text a distinctly calibrated feel — never bold, never thin, always measured

### arcadiaDisplay — Headline and display typeface — used at weight 480 for all heading sizes from 28px through 65px, with 530 reserved for the largest display moments. Tight line-heights (1.1–1.2) and positive letter-spacing (0.01–0.02em) give display copy a wide-set, architectural quality rather than compressed editorial tightness · `--font-arcadiadisplay`
- **Substitute:** Söhne Breit
- **Weights:** 360, 480, 530
- **Sizes:** 21px, 24px, 28px, 32px, 42px, 49px, 65px
- **Line height:** 1.10–1.20
- **Letter spacing:** 0.01em at 42px, 0.015em at 32px, 0.02em at 24px
- **Role:** Headline and display typeface — used at weight 480 for all heading sizes from 28px through 65px, with 530 reserved for the largest display moments. Tight line-heights (1.1–1.2) and positive letter-spacing (0.01–0.02em) give display copy a wide-set, architectural quality rather than compressed editorial tightness

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | 0.12px | `--text-caption` |
| body-sm | 14px | 1 | 0.07px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.35 | — | `--text-body-lg` |
| subheading | 21px | 1.35 | — | `--text-subheading` |
| heading-sm | 28px | 1.2 | 0.42px | `--text-heading-sm` |
| heading | 32px | 1.15 | 0.48px | `--text-heading` |
| heading-lg | 42px | 1.15 | 0.42px | `--text-heading-lg` |
| display | 65px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

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
| 56 | 56px | `--spacing-56` |
| 72 | 72px | `--spacing-72` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 40px |
| tags | 40px |
| cards | 12px |
| inputs | 32px |
| buttons | 32px |
| default | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 72px
- **Card padding:** 32px
- **Element gap:** 12px

## Components

### Primary CTA Button (Cobalt)
**Role:** The sole chromatic action in the system — reserved for the most important conversion

Filled with #5266eb Cobalt, white text at 16px arcadia weight 400, 32px border-radius (pill), 0px vertical padding with 20px horizontal padding for inline contexts, 40px vertical padding when standalone. No border, no shadow. The vivid blue against the dark canvas makes this button the gravitational center of any page.

### Ghost Outline Button
**Role:** Secondary or tertiary action on dark backgrounds

Transparent background, 1px solid #ededf3 Ivory border, Ivory text at 16px arcadia weight 400, 40px border-radius (pill). Zero padding top/bottom with 20px horizontal padding. Used for navigation links and secondary CTAs where a filled button would overpower the layout.

### Navigation Pill Link
**Role:** Top-bar navigation items with optional dropdown caret

Transparent background, no border, Ivory text at 16px arcadia weight 400, 40px border-radius, 0px vertical / 20px horizontal padding. Floats over the hero image and transitions to a solid dark fill on scroll via backdrop-blur.

### Graphite Card
**Role:** Content grouping surface — product features, feature blocks, and section containers

Background #1e1e2a, 12px border-radius, 32px padding on all sides, no shadow, no border. The one-step lift from the #171721 canvas creates separation through subtle value contrast rather than elevation. Cards sit flat on the dark plane.

### Email Capture Input (Pill, Left-Half)
**Role:** Hero email input with attached submit button

Transparent background, 1px solid #ededf3 Ivory border on left side only, Ivory text at 16px arcadia weight 400, border-radius 32px 0px 0px 32px (left-side pill, flat right edge where it meets the button), 20px left padding. Placeholder text in #c3c3cc Ash.

### Full-Bleed Hero Section
**Role:** Above-the-fold brand statement with photographic atmosphere

100vw × ~100vh, no padding constraints, centered content stack. Headline in arcadiaDisplay at 65px weight 480, subtext in arcadia at 18px weight 480. A full-bleed photographic background (atmospheric landscape) sits behind a subtle dark overlay. Content max-width ~640px centered vertically and horizontally.

### Transparent Top Navigation Bar
**Role:** Primary site navigation overlaid on hero

Full-width, fixed or sticky, transparent background over the hero image. Brand mark (Mercury logo with concentric-circle icon) on the left, nav links centered (Products, Solutions, Resources, About, Pricing), Log in text link and Cobalt 'Open account' pill button on the right. Uses backdrop-blur(8px or 20px) on scroll to create frosted-glass separation.

### Disclaimer Banner
**Role:** Legal/regulatory footnote strip at page bottom

Dark background (matches canvas or slightly lighter), small text at 12px arcadia weight 480 with 0.01em letter-spacing, centered or left-aligned, subtle Ivory or Ash text color. Minimal visual weight — present but never distracting.

### Section Container
**Role:** Horizontal content wrapper between hero and footer

Full-width dark canvas (#171721) with inner content constrained to 1200px max-width, 72px vertical padding. Contains 2- or 3-column grids of Graphite Cards or text+image splits.

## Do's and Don'ts

### Do
- Use Cobalt #5266eb exclusively for the single primary action per page — never as a decorative accent, icon fill, or secondary button
- Set all cards to #1e1e2a with 12px radius and 32px padding — rely on the one-step value lift from the canvas, not shadows, for separation
- Apply arcadiaDisplay weight 480 (not 600/700) for all headings — the intermediate weight is Mercury's signature restraint
- Use 32px or 40px pill radius for all interactive controls (buttons, inputs, nav items) — sharp 4px corners are reserved for structural elements only
- Set body text at 16px arcadia weight 400 with 1.5 line-height — this is the density baseline for all content
- Maintain 72px vertical rhythm between major sections — spacious density is part of the premium feel
- Use ivory #ededf3 on ghost/outline buttons for both border and text — never use a chromatic color for secondary actions

### Don't
- Do not use multiple bright accent colors — Cobalt is the only chromatic note; introducing greens, reds, or oranges breaks the monochrome discipline
- Do not add drop shadows to cards or components — separation comes from the graphite-on-onyx value difference alone
- Do not use bold weights (700+) for headings — arcadiaDisplay at 480 is the ceiling
- Do not use sharp corners (0–4px) on buttons, inputs, or nav items — the pill shape is non-negotiable
- Do not use #ffffff for body text — always #ededf3 Ivory; pure white on dark creates harsh, cold contrast
- Do not place Cobalt-filled elements next to each other without at least 32px gap — the vivid color creates visual competition when clustered
- Do not use bright or saturated backgrounds for sections — every surface is either #171721 (canvas) or #1e1e2a (card); no mid-gray or colored bands

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Onyx Canvas | `#171721` | Base page background — hero overlay, section canvases, footer |
| 1 | Graphite Card | `#1e1e2a` | Elevated content surface — product cards, feature blocks, form containers |
| 2 | Obsidian Button | `#272735` | Interactive surface — secondary button fills, inline form attachments |

## Elevation

Mercury deliberately avoids shadows. All elevation is communicated through value contrast alone — the graphite card (#1e1e2a) sits one step lighter than the onyx canvas (#171721), creating perceptible separation without any drop shadow. This flat aesthetic keeps the interface feeling modern, digital, and weightless, letting the photographic hero imagery and cobalt accent do the emotional work.

## Imagery

Cinematic full-bleed photography dominates the hero — atmospheric, aspirational landscapes (misty mountains, isolated desks in nature) that position banking as a contemplative, elevated experience. Photography is high-quality, slightly desaturated with cool tones, and treated with a subtle dark overlay to maintain text legibility. Below the hero, imagery shifts to product UI screenshots and abstract atmospheric backgrounds. No illustrations, no icons-as-art — visuals are photographic or purely functional. Icon style throughout the UI is minimal line/glyph style in Ivory, appearing in nav, buttons, and form elements.

## Layout

Full-bleed dark canvas throughout. Hero is 100vw full-bleed photographic with centered headline + subtext + email-capture form stack (max-width ~640px). Below hero, content flows in 1200px max-width sections with 72px vertical padding, alternating between text-left/image-right 2-column splits and 3-column card grids for product features. Navigation is a transparent top bar overlaid on the hero, transitioning to a frosted-glass (backdrop-blur) solid dark fill on scroll. Footer is dark with disclaimer text. Vertical rhythm is generous — spacious density with large breathing room between sections. No sidebar navigation; all navigation lives in the top bar.

## Agent Prompt Guide

**Quick Color Reference**
- Background (canvas): #171721 Onyx
- Card surface: #1e1e2a Graphite
- Primary text: #ededf3 Ivory
- Muted text: #c3c3cc Ash
- Border: #e2e3ed Mist
- primary action: #5266eb (filled action)

**Example Component Prompts**

1. Create a product feature card: background #1e1e2a Graphite, 12px border-radius, 32px padding all sides, no shadow. Heading at 28px arcadiaDisplay weight 480, letter-spacing 0.015em, color #ededf3 Ivory. Body text at 16px arcadia weight 400, line-height 1.5, color #ededf3 Ivory.

2. Create a primary CTA button: background #5266eb Cobalt, white text at 16px arcadia weight 400, 32px border-radius (pill), no border, no shadow, 12px vertical / 24px horizontal padding. Text is 'Open account' or equivalent action label.

3. Create a ghost/outline button: transparent background, 1px solid #ededf3 Ivory border, #ededf3 text at 16px arcadia weight 400, 40px border-radius, 10px vertical / 20px horizontal padding.

4. Create a hero section: full-bleed (100vw), full-viewport height, photographic landscape background with dark overlay. Headline at 65px arcadiaDisplay weight 480, line-height 1.1, color #ffffff, centered. Subtext at 18px arcadia weight 480, color #ededf3 Ivory, centered, max-width 520px.

5. Create an inline email capture form: flex row, no gap. Input — transparent background, 1px solid #ededf3 Ivory border (left + top + bottom only), #ededf3 text at 16px arcadia weight 400, placeholder in #c3c3cc Ash, border-radius 32px 0 0 32px, 14px vertical / 20px horizontal padding. Button — #5266eb Cobalt fill, white text at 16px arcadia weight 400, border-radius 0 32px 32px 0, 14px vertical / 24px horizontal padding, no border.

## Typography Philosophy

Mercury's type system uses two custom faces — arcadia for UI/body and arcadiaDisplay for headlines — both built on an intermediate weight axis (360, 420, 480, 530) that avoids the conventional bold/light binary. Heading weight 480 is the signature: it is heavier than regular but distinctly lighter than semibold, creating a voice that asserts without shouting. Display sizes use tight line-heights (1.1–1.15) with positive letter-spacing (0.01–0.02em), giving large text an architectural, wide-set quality. Body text stays at 16px weight 400 with generous 1.5 line-height. The overall effect is a voice that is measured, premium, and digitally native — never editorial, never corporate.

## Similar Brands

- **Wise** — Same dark-canvas + single-accent-color approach to fintech, with pill-shaped controls and flat card surfaces
- **Ramp** — Similar graphite-on-dark card system with minimalist borderless components and a restrained primary accent
- **Brex** — Dark-mode fintech aesthetic with comparable flat card elevation and confident intermediate-weight typography
- **Linear** — Same whisper-weight typography philosophy and dark monochrome canvas with a single chromatic action color
- **Stripe** — Shared approach to generous spacing, intermediate-weight display type, and letting one accent color carry the brand

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-onyx-canvas: #171721;
  --color-graphite-card: #1e1e2a;
  --color-obsidian-button: #272735;
  --color-slate-border: #70707d;
  --color-mist-border: #e2e3ed;
  --color-ash-text: #c3c3cc;
  --color-ivory-text: #ededf3;
  --color-cobalt: #5266eb;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-arcadia: 'arcadia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arcadiadisplay: 'arcadiaDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1;
  --tracking-body-sm: 0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.35;
  --text-subheading: 21px;
  --leading-subheading: 1.35;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.42px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: 0.48px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.42px;
  --text-display: 65px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-w360: 360;
  --font-weight-regular: 400;
  --font-weight-w420: 420;
  --font-weight-w480: 480;
  --font-weight-w530: 530;

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
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-112: 112px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 72px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;

  /* Named Radii */
  --radius-nav: 40px;
  --radius-tags: 40px;
  --radius-cards: 12px;
  --radius-inputs: 32px;
  --radius-buttons: 32px;
  --radius-default: 4px;

  /* Surfaces */
  --surface-onyx-canvas: #171721;
  --surface-graphite-card: #1e1e2a;
  --surface-obsidian-button: #272735;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-onyx-canvas: #171721;
  --color-graphite-card: #1e1e2a;
  --color-obsidian-button: #272735;
  --color-slate-border: #70707d;
  --color-mist-border: #e2e3ed;
  --color-ash-text: #c3c3cc;
  --color-ivory-text: #ededf3;
  --color-cobalt: #5266eb;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-arcadia: 'arcadia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arcadiadisplay: 'arcadiaDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1;
  --tracking-body-sm: 0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.35;
  --text-subheading: 21px;
  --leading-subheading: 1.35;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.42px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: 0.48px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.42px;
  --text-display: 65px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-112: 112px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
}
```
