# Customer.io — Style Reference
> dark spruce forest meeting cream paper

**Theme:** mixed

Customer.io uses a deep forest palette anchored in near-black spruce greens, creating a page that feels like dark pine on warm paper. Typography is custom Saans at near-uniform weight 475 — an unusual medium-light voice that avoids the typical SaaS shout of bold headings, instead making 96px display text feel architectural and quietly authoritative. Color appears sparingly as functional punctuation: a vivid verdant green glow marks interactive elements, while warm cream surfaces and soft blue washes tint alternate sections. The system is built on thin 1px borders, minimal elevation, pill-shaped primary buttons, and 2px corner radii everywhere else — a flat, almost editorial product surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Spruce Abyss | `#00191c` | `--color-spruce-abyss` | Deepest background — footer canvas, dramatic section breaks |
| Spruce 900 | `#032125` | `--color-spruce-900` | Primary dark surface — headers, hero, main navigation background; dominant text color on light surfaces |
| Spruce 700 | `#0b363b` | `--color-spruce-700` | Primary CTA fill on dark backgrounds, elevated card surfaces, border accent |
| Spruce 500 | `#437278` | `--color-spruce-500` | Muted teal accent — illustration fills, secondary icon color |
| Spruce 200 | `#a1c2c6` | `--color-spruce-200` | Decorative stroke, muted link text, icon outlines on dark surfaces |
| Spruce Mist | `#354d51` | `--color-spruce-mist` | Body text on light surfaces, secondary heading color |
| Charcoal 100 | `#ebebeb` | `--color-charcoal-100` | Hairline borders, dividers, subtle separators across the interface |
| Charcoal Mist | `#fafafa` | `--color-charcoal-mist` | Alternate section background, subtle card backgrounds |
| Cream Warm | `#fffcf6` | `--color-cream-warm` | Primary light surface — content sections, card backgrounds |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surface, button text on dark fills, content blocks |
| Verdant 300 | `#abffae` | `--color-verdant-300` | Interactive glow — CTA button fill, focus ring halo, active state border; vivid green signals action without aggression |
| Verdant Whisper | `#eafde8` | `--color-verdant-whisper` | Primary page canvas and white card surfaces. Use as a supporting accent, not as a status color |
| Wave 700 | `#123a88` | `--color-wave-700` | Violet text accent for links, tags, and emphasized short phrases. |
| Wave 500 | `#0a6de6` | `--color-wave-500` | Heading accent color for keyword highlights in display text |
| Wave Frost | `#e2f4ff` | `--color-wave-frost` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Use as a supporting accent, not as a status color |
| Zest 700 | `#863d1c` | `--color-zest-700` | Orange text accent for links, tags, and emphasized short phrases. |
| Zest Blush | `#fdf0e9` | `--color-zest-blush` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Use as a supporting accent, not as a status color |
| Mustard 700 | `#83611c` | `--color-mustard-700` | Yellow text accent for links, tags, and emphasized short phrases. |

## Tokens — Typography

### Saans — Custom display + body typeface used for everything. Weight 475 dominates — a near-medium voice that feels calm and confident rather than aggressive. · `--font-saans`
- **Substitute:** Inter, Helvetica Neue, Arial
- **Weights:** 475, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px, 24px, 30px, 40px, 48px, 96px
- **Line height:** 1.00 (display), 1.13 (headings), 1.38 (body)
- **Letter spacing:** 0.0020em at 96px, 0.0040em at 48px, 0.0050em at 40px, 0.0070em at 30px, 0.0080em at 24px, 0.0100em at 20px, 0.0110em at 18px, 0.0130em at 16px, 0.0140em at 14px, 0.0170em at 12px, 0.0200em at 10px
- **Role:** Custom display + body typeface used for everything. Weight 475 dominates — a near-medium voice that feels calm and confident rather than aggressive.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.38 | 0.2px | `--text-caption` |
| body | 16px | 1.38 | 0.21px | `--text-body` |
| subheading | 20px | 1.13 | 0.2px | `--text-subheading` |
| heading-sm | 24px | 1.13 | 0.19px | `--text-heading-sm` |
| heading | 30px | 1.13 | 0.21px | `--text-heading` |
| heading-lg | 40px | 1.13 | 0.2px | `--text-heading-lg` |
| display | 96px | 1 | 0.19px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 2px |
| images | 6px |
| inputs | 2px |
| buttons | 9999px |
| default | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `oklch(0.9263 0.136 145.2) 0px 0px 0px 4px` | `--shadow-subtle` |
| subtle-2 | `oklch(0.97 0 0) 0px 0px 0px 4px` | `--shadow-subtle-2` |
| subtle-3 | `oklch(0.3068 0.046 206.34) 0px 0px 0px 4px` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Primary Pill Button
**Role:** Main CTA — 'Get started'

Pill shape (9999px radius), Verdant 300 (#abffae) background, Spruce 900 (#032125) text at 16px weight 475, padding 8px 20px, 4px Verdant glow shadow ring on hover/focus

### Secondary Outline Button
**Role:** Secondary CTA — 'Book a demo'

Pill shape (9999px radius), transparent background, Spruce 900 (#032125) text at 16px weight 475, 1px Spruce 700 (#0b363b) border, padding 8px 20px

### Ghost Navigation Button
**Role:** Nav item with dropdown

Transparent background, Spruce 900 text at 16px weight 475, no border, padding 0 16px, chevron indicator

### Small Tag Button
**Role:** 'New' badge, 'case study' link

2px radius, subtle background tint, Mustard 700 (#83611c) text at 12-14px weight 475, padding 4px 8px

### Content Card
**Role:** Feature card, platform overview tile

32px padding all sides, Pure White (#ffffff) background, 1px Charcoal 100 (#ebebeb) hairline border, 2px corner radius, no shadow

### Dark Section Card
**Role:** Card on dark spruce background

32px padding, Spruce 700 (#0b363b) background, 1px Spruce 700 border, 2px radius, Spruce 200 (#a1c2c6) body text

### Tinted Feature Surface
**Role:** Section background with soft color wash

Full-bleed tinted background — Wave Frost (#e2f4ff), Zest Blush (#fdf0e9), or Verdant Whisper (#eafde8), 2px radius containers inside, generous 96px vertical padding

### Footer Column
**Role:** Footer link column

4-column grid on Spruce Abyss (#00191c) background, white heading text at 16px weight 600, Spruce 200 (#a1c2c6) link text at 14px, 24px row gap

### Logo Strip Card
**Role:** Customer logo in trust strip

Pure White background, 1px Charcoal 100 border, 2px radius, logo centered, no padding variation; arranged in horizontal marquee

### Heading with Keyword Accent
**Role:** Display headline with colored words

96px Saans weight 475, Spruce 900 base text with individual words in Zest 700 ('messaging'), Wave 700 ('AI'), Wave 500 ('AI'), Verdant 600 ('data'), Nova 500 ('customers') — words stay inline, color creates semantic meaning

### Trust Indicator Row
**Role:** Social proof list — '14-day free trial'

Inline list with checkmark icon (Verdant 300), Spruce 900 text at 14px, separated by 16px gaps, no bullet markers

### Interactive Product Preview
**Role:** Hero product screenshot

Large product UI screenshot with browser chrome, set against a warm interior photography background with green plant, no border or shadow — raw edges blending into scene

### Status Badge
**Role:** 'All Systems Operational' indicator

Small green dot (2px radius circle, Verdant 300 fill) beside white text at 12px weight 500

## Do's and Don'ts

### Do
- Use 2px border-radius on all cards, inputs, images, and containers — pill shapes (9999px) are reserved exclusively for buttons
- Use weight 475 for all text including 96px display headlines — never bold above 600 except for 20px subheadings
- Use 1px solid #ebebeb hairline borders for card edges and dividers — never thicker
- Color individual words in display headlines using #863d1c (orange), #123a88 (blue), #41a251 (green), #b52473 (pink) — words stay inline, never separate blocks
- Use #abffae exclusively for primary CTA fills and focus glow rings — never as body text or background tint
- Use 24px for element gaps, 32px for card padding, 96px for section vertical gaps — the 4px base unit scales through these three tiers
- Use #fffcf6 as the default light surface; alternate to #032125 for dark sections; tint with #e2f4ff, #fdf0e9, or #eafde8 for semantic accent bands
- Use 4px colored focus glow rings (0px 0px 0px 4px) for interactive focus states instead of outline or shadow changes

### Don't
- Never use drop shadows for elevation — depth comes from colored 4px glow rings only
- Never use bold weights above 600 for display or heading text — the signature is the calm 475 voice
- Never use corner radius above 2px on non-button elements — sharp-cornered cards define this system
- Never use #0000ee or default browser blue for links — links use #032125 or #a1c2c6
- Never place #abffae on white or light backgrounds without sufficient contrast — it is a glow color, not a fill
- Never use more than 4 columns in content grids — the system favors generous spacing over density
- Never use the heading accent colors (#863d1c, #123a88, etc.) for UI chrome — they exist only for inline keyword coloring in display text

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Spruce Abyss | `#00191c` | Deepest canvas — footer and dramatic section breaks |
| 1 | Spruce Dark | `#032125` | Primary background for headers, hero, and major sections |
| 2 | Spruce Mid | `#0b363b` | Card surfaces, elevated panels, button fills on dark backgrounds |
| 3 | Cream Warm | `#fffcf6` | Primary light surface for content sections, card backgrounds |
| 4 | Charcoal Mist | `#fafafa` | Subtle alternating background tint |
| 5 | Zest Blush | `#fdf0e9` | Warm accent wash for feature callouts |
| 6 | Verdant Whisper | `#eafde8` | Soft green tint for success-related surfaces |
| 7 | Wave Frost | `#e2f4ff` | Soft blue tint for info-related surfaces |
| 8 | Pure White | `#ffffff` | Topmost surface — elevated cards, content blocks |

## Elevation

- **Primary Pill Button (focus):** `0px 0px 0px 4px oklch(0.9263 0.136 145.2) — 4px Verdant glow ring`
- **Secondary Button (focus):** `0px 0px 0px 4px oklch(0.97 0 0) — 4px white glow ring`
- **Dark Section Button (focus):** `0px 0px 0px 4px oklch(0.3068 0.046 206.34) — 4px Spruce glow ring`

## Imagery

Warm interior photography with greenery as the backdrop for the hero product preview — a person working at a desk with potted plants, soft natural light, slightly desaturated warm tones. Product screenshots are presented raw without device frames or shadows, blending directly into the photographic background. The brand mark uses a geometric double-chevron arrow symbol in Spruce 900. No illustrations — the visual language is photography + product UI + typography-driven keyword coloring in headings. Logo strip is monochrome black marks on white. The overall density is moderate: generous whitespace in hero, information-dense footer with 4-column link structure.

## Layout

Full-bleed sections that alternate between dark Spruce 900 (#032125) and warm cream (#fffcf6) backgrounds. Hero is left-aligned text block occupying ~40% width with product screenshot occupying right ~60%, set against photographic backdrop. Content sections use centered 1200px max-width containers with 96px vertical section gaps. Trust strip uses horizontal marquee of monochrome logos. Footer is full-bleed dark with 4-column grid of links. Navigation is a 64px-tall sticky top bar with logo left, centered nav items, and sign-in + CTA cluster right. Key sections are full-viewport-width colored bands rather than card grids.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #032125
- text (secondary): #354d51
- text (muted/link): #a1c2c6
- background (light): #fffcf6
- background (dark): #032125
- border (hairline): #ebebeb
- accent (highlight keywords in headings): #863d1c
- primary action: #0b363b (filled action)

**Example Component Prompts**

1. **Hero headline**: Render at 96px Saans weight 475, line-height 1.0, color #032125, letter-spacing 0.0020em. Use the word 'messaging' in #863d1c and 'AI' in #123a88 as inline accent colors within the same line.

2. Create a Primary Action Button: #0b363b background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Dark section card**: Background #0b363b, 32px padding all sides, 2px corner radius, 1px #0b363b border, body text #a1c2c6 at 16px weight 475, heading in white at 24px weight 475.

4. **Trust indicator row**: Three inline items at 14px weight 475 in #032125, each preceded by a small #abffae checkmark icon, separated by 24px gap, no dividers.

5. **Tinted feature section**: Full-bleed #e2f4ff background, 96px vertical padding, centered 1200px content container, heading at 40px weight 475 in #032125, 3-column grid of feature items below with 2px-radius white cards inside.

## Similar Brands

- **Linear** — Same near-uniform medium weight custom typeface, dark primary surface with cream/warm light alternation, hairline 1px borders, minimal corner radii, generous vertical rhythm
- **Vercel** — Dark hero-to-light-section alternation with full-bleed bands, pill-shaped CTAs, subdued typography that lets color accents do the emotional work
- **Attio** — Warm cream surfaces paired with deep saturated dark sections, thin borders, near-flat elevation, editorial product photography in hero
- **Resend** — Custom geometric sans at restrained weight, dark spruce-toned palette, glow-ring focus states instead of traditional shadows, monochrome logo strip trust section

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-spruce-abyss: #00191c;
  --color-spruce-900: #032125;
  --color-spruce-700: #0b363b;
  --color-spruce-500: #437278;
  --color-spruce-200: #a1c2c6;
  --color-spruce-mist: #354d51;
  --color-charcoal-100: #ebebeb;
  --color-charcoal-mist: #fafafa;
  --color-cream-warm: #fffcf6;
  --color-pure-white: #ffffff;
  --color-verdant-300: #abffae;
  --color-verdant-whisper: #eafde8;
  --color-wave-700: #123a88;
  --color-wave-500: #0a6de6;
  --color-wave-frost: #e2f4ff;
  --color-zest-700: #863d1c;
  --color-zest-blush: #fdf0e9;
  --color-mustard-700: #83611c;

  /* Typography — Font Families */
  --font-saans: 'Saans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.38;
  --tracking-caption: 0.2px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: 0.21px;
  --text-subheading: 20px;
  --leading-subheading: 1.13;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: 0.19px;
  --text-heading: 30px;
  --leading-heading: 1.13;
  --tracking-heading: 0.21px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: 0.2px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: 0.19px;

  /* Typography — Weights */
  --font-weight-w475: 475;
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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 2px;
  --radius-images: 6px;
  --radius-inputs: 2px;
  --radius-buttons: 9999px;
  --radius-default: 2px;

  /* Shadows */
  --shadow-subtle: oklch(0.9263 0.136 145.2) 0px 0px 0px 4px;
  --shadow-subtle-2: oklch(0.97 0 0) 0px 0px 0px 4px;
  --shadow-subtle-3: oklch(0.3068 0.046 206.34) 0px 0px 0px 4px;

  /* Surfaces */
  --surface-spruce-abyss: #00191c;
  --surface-spruce-dark: #032125;
  --surface-spruce-mid: #0b363b;
  --surface-cream-warm: #fffcf6;
  --surface-charcoal-mist: #fafafa;
  --surface-zest-blush: #fdf0e9;
  --surface-verdant-whisper: #eafde8;
  --surface-wave-frost: #e2f4ff;
  --surface-pure-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-spruce-abyss: #00191c;
  --color-spruce-900: #032125;
  --color-spruce-700: #0b363b;
  --color-spruce-500: #437278;
  --color-spruce-200: #a1c2c6;
  --color-spruce-mist: #354d51;
  --color-charcoal-100: #ebebeb;
  --color-charcoal-mist: #fafafa;
  --color-cream-warm: #fffcf6;
  --color-pure-white: #ffffff;
  --color-verdant-300: #abffae;
  --color-verdant-whisper: #eafde8;
  --color-wave-700: #123a88;
  --color-wave-500: #0a6de6;
  --color-wave-frost: #e2f4ff;
  --color-zest-700: #863d1c;
  --color-zest-blush: #fdf0e9;
  --color-mustard-700: #83611c;

  /* Typography */
  --font-saans: 'Saans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.38;
  --tracking-caption: 0.2px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: 0.21px;
  --text-subheading: 20px;
  --leading-subheading: 1.13;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: 0.19px;
  --text-heading: 30px;
  --leading-heading: 1.13;
  --tracking-heading: 0.21px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: 0.2px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: 0.19px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;

  /* Shadows */
  --shadow-subtle: oklch(0.9263 0.136 145.2) 0px 0px 0px 4px;
  --shadow-subtle-2: oklch(0.97 0 0) 0px 0px 0px 4px;
  --shadow-subtle-3: oklch(0.3068 0.046 206.34) 0px 0px 0px 4px;
}
```
