# IFTTT — Style Reference
> Editorial darkroom with neon service tiles. A near-black gallery wall where each connected app brings its own paint.

**Theme:** dark

IFTTT reads as a dark editorial canvas punctuated by full-bleed brand-colored service tiles — the architecture is almost monochrome (#222222 canvas, white text, hairline borders) and then service tiles detonate in their native brand colors (Spotify green, YouTube red, Google blue). The visual system trusts geometric Avenir Next at confident sizes: 68px italic display heads with positive tracking, mid-weight body, and one-weight family across the whole stack. Primary action language is the pill: 100px radius, white fill, black text — repeated in inverse for the nav. Cards are flat, borderless, and color-as-surface rather than colored borders. The hero is a single dark band with centered display text and a solitary pill — no decoration, no gradient, no illustration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Charcoal | `#222222` | `--color-canvas-charcoal` | Page background, dark section bands, card surfaces on dark — the structural ground for 90% of the interface |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text on dark, light section backgrounds, pill button fill, card backgrounds in light sections |
| Border Stone | `#333333` | `--color-border-stone` | Hairline dividers, card borders on dark surfaces, subtle structural lines |
| Muted Graphite | `#666666` | `--color-muted-graphite` | Secondary text, helper copy, muted metadata on light backgrounds |
| Whisper Gray | `#999999` | `--color-whisper-gray` | Tertiary text, icon fills, disabled states, low-emphasis borders |
| Fog Line | `#eeeeee` | `--color-fog-line` | Light-mode section dividers, ghost button borders, soft borders on white surfaces |
| IFTTT Signal Blue | `#0099ff` | `--color-ifttt-signal-blue` | Brand accent — primary highlights, featured service tiles, active indicators |
| Applet Green | `#2cbe60` | `--color-applet-green` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Automate Violet | `#2c6efc` | `--color-automate-violet` | Brand accent — Google service tiles, link emphasis, interactive hover on dark |
| Deep Navy | `#23448b` | `--color-deep-navy` | Brand accent — secondary blue for service tile variants, subtle elevated surfaces |
| Alert Red | `#e44332` | `--color-alert-red` | Red action color for filled buttons, selected navigation states, and focused conversion moments |
| Forest Green | `#1d9a59` | `--color-forest-green` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Ember Orange | `#ec7505` | `--color-ember-orange` | Brand accent — RSS Feed tile, warm decorative accent |
| Pure Red | `#ff0000` | `--color-pure-red` | Brand accent — YouTube tile, high-saturation red service representation |
| Slack Plum | `#4a154b` | `--color-slack-plum` | Brand accent — Slack tile, purple-pink service representation |
| Lime Pulse | `#8cc251` | `--color-lime-pulse` | Brand accent — secondary green for Android Device-adjacent tiles |
| Coral Warning | `#e8655c` | `--color-coral-warning` | Red action color for filled buttons, selected navigation states, and focused conversion moments |
| Magenta Pop | `#e4405f` | `--color-magenta-pop` | Brand accent — Instagram tile, vivid pink-red service representation |

## Tokens — Typography

### Avenir Next — Sole typeface across all surfaces. Geometric humanist sans with strong weight range from 400 (body) to 900 (display). The italic display treatment at 68px is the signature moment — confident, slightly editorial. Body holds 400–500, UI controls jump to 600, headings claim 700–800, display goes 800–900. · `--font-avenir-next`
- **Substitute:** Nunito Sans, Mulish, or Avenir (standard) — match geometric humanist proportions
- **Weights:** 400, 500, 600, 700, 800, 900
- **Sizes:** 14, 15, 16, 18, 20, 24, 25, 28, 29, 32, 36, 38, 43, 48, 68
- **Line height:** 1.00–3.00 range; display 1.11–1.20, body 1.32–1.50, large block text 1.71–1.90
- **Letter spacing:** 0.0200em
- **Role:** Sole typeface across all surfaces. Geometric humanist sans with strong weight range from 400 (body) to 900 (display). The italic display treatment at 68px is the signature moment — confident, slightly editorial. Body holds 400–500, UI controls jump to 600, headings claim 700–800, display goes 800–900.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | 0.28px | `--text-caption` |
| body | 16px | 1.5 | 0.32px | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.32 | — | `--text-heading` |
| heading-lg | 48px | 1.19 | 0.96px | `--text-heading-lg` |
| display | 68px | 1.11 | 1.36px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 8px |
| inputs | 8px |
| buttons | 100px |
| filterPills | 100px |
| serviceTiles | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.24) 0px 1.5px 6px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Pill Primary Button
**Role:** Hero and nav primary action — the only button shape in the system

White fill (#ffffff), black text (#222222), 100px border-radius, 18px horizontal × 12px vertical padding, Avenir Next weight 600 at 18px. No border, no shadow. Text centered, single line. The 'Start today' and 'Get started' buttons. Inverted variant swaps to #222222 fill with #ffffff text.

### Pill Dark Button
**Role:** Dark-mode primary action on light sections

#222222 fill, #ffffff text, 100px radius, 18px×12px padding, Avenir Next 600 at 18px. The 'Join today' button. Functions as the inverse of the white pill.

### Service Brand Tile
**Role:** Grid cell representing a connected service in the '1000+ services' section

Flat brand-color fill (e.g. #1d9a59 for Spotify, #e44332 for YouTube), 8px border-radius, ~24px padding, white icon (32–48px) top-left, white service name (Avenir Next 600, 16–18px) bottom-left. No border, no shadow, no gradient. Color IS the surface — the tile's identity comes entirely from its fill color.

### Applet Card
**Role:** Showcase card for a ready-made automation in the 'Connect an automation' grid

Brand-color fill matching the triggering service (green for Spotify, blue for Google, etc.), 8px radius, ~24px padding, white service icon at top, bold white headline (Avenir Next 700, 24px), small service-name attribution, user-count badge (white pill with brand-color text or inverse) at bottom. Pro badges appear as small white pills bottom-right.

### Category Filter Pill
**Role:** Tab-like filter for browsing Applets

8px radius for non-active, 100px radius for active. Inactive: transparent fill, #222222 text, 1px #eeeeee border. Active: #222222 fill, #ffffff text. Avenir Next 500–600 at 16px. Padding ~12px×16px.

### Search Bar
**Role:** Global service/applet search in nav

Dark surface (#222222 or transparent on dark), 1px white/gray border (#666666 or #ffffff), 8px radius, 40–48px height, white placeholder text at 16px Avenir Next 400, search icon prefix in white.

### Navigation Bar
**Role:** Top-level site navigation

Dark background (#222222) spanning full width, 64–72px height. IFTTT wordmark left (Avenir Next 800–900 italic, white), search bar center-left, nav links (Explore, Plans, Log In — Avenir Next 500, white), white pill button right.

### Usage Count Badge
**Role:** Social proof indicator on Applet cards

Small white pill or text, Avenir Next 500 at 12–14px, white on brand-color card surface. Shows install count (e.g. '124K'). No background, just white text with subtle icon.

### Section Header Block
**Role:** Title + subtitle for content bands

Centered on dark bands, left-aligned on light bands. Avenir Next 700 at 32–36px for title, 400 at 16–18px for subtitle. White on dark, #222222 on light.

### Wordmark Logo
**Role:** Brand identity in nav

'IFTTT' in Avenir Next 800–900 italic, white, ~28–32px. The italic treatment at this weight is distinctive — it reads as a masthead, not a tech logo.

### Pro Badge
**Role:** Premium feature indicator on Applet cards

Small white pill, ~6px×10px padding, Avenir Next 700 at 10–12px in #222222. 4px radius. Sits at bottom-right of Applet cards.

## Do's and Don'ts

### Do
- Use 100px border-radius for every button and active filter pill — the pill shape is the system's signature action geometry
- Alternate between #222222 dark bands and #ffffff light bands to create section rhythm; never stack two dark bands or two light bands consecutively
- Let brand colors serve as full card surfaces (fill, not accent) — a Spotify card should be entirely green, not white with a green border
- Set display headlines at 68px Avenir Next 800–900 italic on dark — this is the one moment typography goes expressive
- Use 8px radius for all cards, inputs, badges, and non-pill buttons consistently
- Keep the page 1% chromatic globally — chromatic color earns its space by representing a specific service brand
- Use #222222 as the dark canvas; never substitute pure #000000 — the slight warmth is intentional

### Don't
- Don't add drop shadows to cards or service tiles — depth is communicated by section banding and color contrast alone
- Don't use #000000 for any surface or text — always use #222222 or a warm near-black
- Don't mix two pill and non-pill button styles on the same page — if a button isn't a pill, rethink the affordance
- Don't apply chromatic colors as borders, text accents, or hover tints on neutral surfaces — they belong on full service tiles only
- Don't use system sans-serifs (Inter, Helvetica, Arial) — Avenir Next's italic display and geometric body are the voice
- Don't add gradients, glassmorphism, or blur effects to any surface — the system is intentionally flat
- Don't place colored cards on white backgrounds without a 8px radius and brand-color edge definition — flat color needs geometric containment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas Charcoal | `#222222` | Base page background, hero band, dark service-grid section |
| 2 | Border Stone | `#333333` | Hairline card edges and structural dividers on dark canvas |
| 3 | Paper White | `#ffffff` | Light content sections, light-mode card surfaces, pill button fill |
| 4 | Fog Line | `#eeeeee` | Subtle elevated card background within white sections |

## Elevation

- **Interactive links/buttons on dark:** `rgba(0, 0, 0, 0.24) 0px 1.5px 6px 0px`

## Imagery

Photography and illustration are essentially absent. The visual system is built from typography, color tiles, and iconography only. Service brand tiles use simple monochrome white service icons (Spotify, WU, Google Calendar, YouTube, etc.) rendered as flat glyphs — no photography, no 3D renders, no illustrations. The only 'imagery' is the service icon set, which is always white on brand-color fill. No lifestyle photography, no product shots, no people.

## Layout

Full-width dark hero band (100% width, ~500–600px height) with centered headline + subtext + single pill CTA. Transitions to a white content section with left-aligned headings. The 'Connect an automation' section is a 4-column card grid on white, preceded by a centered row of category filter pills. The '1000+ services' section flips back to a full-width dark band containing a 6-column grid of colorful service tiles, capped with a centered pill CTA. Navigation is a fixed top bar spanning full width. The pattern: dark band → light content → dark service grid → light content, with the dark bands acting as visual punctuation. Max content width ~1200px centered within full-bleed dark/light bands. Section gaps of ~64px create breathing room between bands.

## Agent Prompt Guide

## Quick Color Reference
- text (on dark): #ffffff
- text (on light): #222222
- muted text: #666666
- background dark: #222222
- background light: #ffffff
- border: #333333 (on dark), #eeeeee (on light)
- accent: #0099ff
- primary action: #ffffff (filled action)

## Example Component Prompts

1. **Dark hero band**: Full-width #222222 background, 500px height, centered content. Display headline: Avenir Next 900 italic, 68px, #ffffff, letter-spacing 1.36px, line-height 1.11. Subtext: Avenir Next 400, 18px, #ffffff, centered. White pill button below: #ffffff fill, #222222 text, 100px radius, 18px×12px padding, Avenir Next 600.

2. **Service brand tile**: Brand-color fill (e.g. #1d9a59 for Spotify), 8px radius, 24px padding, white service icon 40px top-left, service name in Avenir Next 600, 16px, #ffffff, bottom-left. No border, no shadow.

3. **Applet card**: Full brand-color fill (e.g. #0099ff for Google Calendar), 8px radius, 24px padding. White service icon 32px top, bold headline Avenir Next 700, 24px, #ffffff. Service attribution Avenir Next 400, 14px, #ffffff at 60% opacity. User count Avenir Next 500, 14px, #ffffff bottom-left. Small white Pro pill bottom-right: 4px radius, #ffffff fill, #222222 text at 10px Avenir Next 700.

4. **Category filter pill row**: Centered horizontal row of pills, 12px gap. Active: #222222 fill, #ffffff text, 100px radius, 12px×16px padding, Avenir Next 600, 16px. Inactive: transparent fill, #222222 text, 1px #eeeeee border, 8px radius, 12px×16px padding, Avenir Next 500, 16px.

5. **Light content section**: #ffffff background, max-width 1200px centered, 64px vertical padding. Left-aligned heading: Avenir Next 700, 32px, #222222. Body text: Avenir Next 400, 16px, #666666. Content below at 24px element gap.

## Radius System

The system uses exactly two radii: 8px for everything flat (cards, inputs, badges, service tiles, inactive filters) and 100px for everything pill-shaped (all buttons, active filter state). There is no 4px, no 12px, no 16px border-radius in active use — the 8px/100px binary is a defining structural choice. Resist adding intermediate radii; if something needs to feel different, change its fill or weight, not its corner radius.

## Similar Brands

- **Zapier** — Same dark-canvas + colorful service-tile grid approach for showcasing connected apps, with the service's native brand color filling each card
- **Make (Integromat)** — Dark interface with scattered brand-color module tiles and a geometric sans-serif typeface carrying the same editorial confidence
- **Notion** — Alternating dark/white section bands with centered display headlines, near-flat surfaces, and a single weight-family geometric sans
- **Linear** — Dark canvas dominance with 1% chromatic restraint, 8px radius as the universal card radius, and bold italic display moments

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-charcoal: #222222;
  --color-paper-white: #ffffff;
  --color-border-stone: #333333;
  --color-muted-graphite: #666666;
  --color-whisper-gray: #999999;
  --color-fog-line: #eeeeee;
  --color-ifttt-signal-blue: #0099ff;
  --color-applet-green: #2cbe60;
  --color-automate-violet: #2c6efc;
  --color-deep-navy: #23448b;
  --color-alert-red: #e44332;
  --color-forest-green: #1d9a59;
  --color-ember-orange: #ec7505;
  --color-pure-red: #ff0000;
  --color-slack-plum: #4a154b;
  --color-lime-pulse: #8cc251;
  --color-coral-warning: #e8655c;
  --color-magenta-pop: #e4405f;

  /* Typography — Font Families */
  --font-avenir-next: 'Avenir Next', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.32;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.19;
  --tracking-heading-lg: 0.96px;
  --text-display: 68px;
  --leading-display: 1.11;
  --tracking-display: 1.36px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 90px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 100px;
  --radius-filterpills: 100px;
  --radius-servicetiles: 8px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.24) 0px 1.5px 6px 0px;

  /* Surfaces */
  --surface-canvas-charcoal: #222222;
  --surface-border-stone: #333333;
  --surface-paper-white: #ffffff;
  --surface-fog-line: #eeeeee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-charcoal: #222222;
  --color-paper-white: #ffffff;
  --color-border-stone: #333333;
  --color-muted-graphite: #666666;
  --color-whisper-gray: #999999;
  --color-fog-line: #eeeeee;
  --color-ifttt-signal-blue: #0099ff;
  --color-applet-green: #2cbe60;
  --color-automate-violet: #2c6efc;
  --color-deep-navy: #23448b;
  --color-alert-red: #e44332;
  --color-forest-green: #1d9a59;
  --color-ember-orange: #ec7505;
  --color-pure-red: #ff0000;
  --color-slack-plum: #4a154b;
  --color-lime-pulse: #8cc251;
  --color-coral-warning: #e8655c;
  --color-magenta-pop: #e4405f;

  /* Typography */
  --font-avenir-next: 'Avenir Next', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.32;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.19;
  --tracking-heading-lg: 0.96px;
  --text-display: 68px;
  --leading-display: 1.11;
  --tracking-display: 1.36px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 90px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.24) 0px 1.5px 6px 0px;
}
```
