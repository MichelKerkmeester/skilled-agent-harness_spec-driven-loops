# Dub Links — Style Reference
> warm sunrise over monochrome architecture

**Theme:** light

Dub presents a warm, confident SaaS aesthetic: a near-monochrome interface anchored by soft cream-to-white gradients, with one vivid orange accent that makes every action feel activated. The system breathes through generous whitespace on a compact 4px grid, pairing Inter's utility precision with Satoshi's rounded display character for headlines. Surfaces stay matte and light with hairline borders and whisper-soft shadows — depth comes from subtle tonal shifts and elevation, never heavy panels. The primary CTA is always a black pill with orange-ember micro-accents nearby, creating a contrast between structural neutrality and brand warmth. Components should feel quick and utilitarian: 4px and 8px radii dominate, pill buttons carry CTAs, and cards are flat white rectangles on a faintly warm canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Cream | `#f5f5f5` | `--color-canvas-cream` | Page background base — the warm off-white that gives the interface its sunlit feel |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, input fields — pure white for content containers |
| Ink Black | `#0a0a0a` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Charcoal | `#171717` | `--color-charcoal` | Secondary text, button text on dark fills, heading weights |
| Graphite | `#404040` | `--color-graphite` | Tertiary text, muted descriptions, secondary button text |
| Steel | `#737373` | `--color-steel` | Placeholder text, disabled states, low-emphasis body copy |
| Ash | `#a3a3a3` | `--color-ash` | Icon fills at rest, muted helper text, tertiary icons |
| Fog | `#d4d4d4` | `--color-fog` | Input borders at rest, subtle dividers, inactive form controls |
| Mist | `#e5e5e5` | `--color-mist` | Hairline borders throughout — the workhorse divider color |
| Slate | `#6b7280` | `--color-slate` | Muted body text, secondary icon strokes, meta information |
| Ember Orange | `#ea580c` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember Glow | `#fb923c` | `--color-ember-glow` | Lighter orange for hover states on ember elements, soft accent fills |
| Ember Deep | `#7c2d12` | `--color-ember-deep` | Dark orange for icon strokes and decorative accents needing depth |
| Signal Blue | `#3b82f6` | `--color-signal-blue` | Decorative icon accent, link highlights, informational touches — the secondary chromatic note |
| Terminal Green | `#22863a` | `--color-terminal-green` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Alert Red | `#d32f2f` | `--color-alert-red` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Warm Sunrise | `linear-gradient(90deg, rgb(244, 149, 12), rgb(235, 92, 12))` | `--color-warm-sunrise` | Gradient endpoint for the hero's warm peach wash — the signature atmospheric gradient |

## Tokens — Typography

### Satoshi — Display headlines — the custom Satoshi at medium weight creates a rounded, friendly authority at hero scale; its geometric softness contrasts with Inter's utilitarian precision · `--font-satoshi`
- **Substitute:** General Sans, Switzer, Inter (weight 600)
- **Weights:** 500
- **Sizes:** 40px, 48px
- **Line height:** 1.00-1.15
- **Role:** Display headlines — the custom Satoshi at medium weight creates a rounded, friendly authority at hero scale; its geometric softness contrasts with Inter's utilitarian precision

### Inter — Primary UI font — handles body text, nav items, buttons, form labels, section headings; weight 500 for nav active states and subtle emphasis, 600-700 for subheadings; tight 1.25-1.43 line-height at body sizes keeps the compact density working · `--font-inter`
- **Weights:** 400, 500, 600, 700
- **Sizes:** 8px, 12px, 14px, 16px, 18px, 20px, 24px
- **Line height:** 1.25-1.56
- **Role:** Primary UI font — handles body text, nav items, buttons, form labels, section headings; weight 500 for nav active states and subtle emphasis, 600-700 for subheadings; tight 1.25-1.43 line-height at body sizes keeps the compact density working

### Geist Mono — Short URL display, code snippets, technical metadata — monospace where data precision matters (the shortened link, the click counter) · `--font-geist-mono`
- **Weights:** 400
- **Sizes:** 12px, 13px, 14px
- **Line height:** 1.33-1.50
- **Role:** Short URL display, code snippets, technical metadata — monospace where data precision matters (the shortened link, the click counter)

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.56 | — | `--text-body-lg` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.4 | — | `--text-heading-sm` |
| display | 48px | 1.15 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 236 | 236px | `--spacing-236` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| pills | 9999px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.2) 0px 2px 6px 0px inset` | `--shadow-sm-2` |
| subtle-2 | `rgba(0, 0, 0, 0.1) 0px 0px 0px 4px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.098) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Main conversion action — 'Start for free', 'Sign up'

Ink Black (#0a0a0a) fill, Paper White (#ffffff) text, 8px radius, Inter weight 500 at 14px, 8px 16px padding, subtle 0px 1px 2px shadow at 5% black. The near-black fill against the warm cream canvas is the strongest visual element on any page.

### Secondary Ghost Button
**Role:** Secondary action — 'Get a demo', 'Log in'

Transparent fill with Mist (#e5e5e5) 1px border, Charcoal (#171717) text, 8px radius, Inter weight 500 at 14px, 8px 16px padding. Sits beside the primary CTA as a quiet alternative.

### Sign Up Pill Button
**Role:** Navigation primary action

Ink Black (#0a0a0a) fill, white text, 9999px radius (full pill), Inter weight 500 at 14px, 6px 14px padding. Slightly tighter padding than card CTAs for the nav context.

### Ember Action Button
**Role:** Brand-emphasized action — 'Shorten link', key conversion in product context

Ember Orange (#ea580c) fill, white text, 8px radius, Inter weight 500 at 14px, 8px 16px padding. The single chromatic button in the system — use sparingly for the most important in-product action.

### Text Input
**Role:** URL destination, search, text fields

Paper White (#ffffff) fill, Fog (#d4d4d4) 1px border, Ash (#a3a3a3) placeholder text, Charcoal (#171717) input text, 8px radius, Inter at 14px, 10px 14px padding. Focus state: 4px black-at-10% outer ring.

### Link Shortener Card
**Role:** Hero product demonstration — the centerpiece of the homepage

Paper White surface, 12px radius, two-layer shadow (0px 4px 6px -1px / 0px 2px 4px -2px at 10% black). Contains: input row with Ember Action Button, and a result row with Geist Mono short URL + click count badge. This is the signature component.

### Brand Tag / Badge
**Role:** Category label above headlines — 'Dub Links', 'Branded Short Links'

Light tinted background, Charcoal text, 9999px radius, Inter weight 500 at 12px, 2px 10px padding. Features a small leading icon. Tints include #fef9c3 (warm yellow), #eff6ff (cool blue), #dcfce7 (mint).

### Navigation Bar
**Role:** Top-level site navigation

Transparent on canvas, Ink Black logo wordmark, Inter nav items at 14px weight 500 in Charcoal. Dropdown items have 8px radius. Active nav item has light background highlight.

### Trust Logo Grid
**Role:** Social proof — customer logos

2-row grid of 5 columns, 40px row gap, each logo rendered in Ash (#a3a3a3) or muted monochrome. 'CASE STUDY' link in Geist Mono appears beneath select logos. No borders, pure whitespace separation.

### Product UI Mockup
**Role:** Feature section visual — link creation interface

Paper White surface, 12px radius, layered shadow. Contains form fields, QR code preview, social link preview icons. Simulated browser chrome with traffic light dots at top. Rounded input fields at 8px.

### QR Code Preview Tile
**Role:** Embedded QR code in product mockup

Paper White fill with 8px radius, 1px Mist border, small external link icon. Centered QR code pattern in black.

### Section Heading
**Role:** Feature section titles

Satoshi weight 500 at 40-48px, Ink Black color, centered, line-height 1.15. Followed by 18px body text in Slate (#6b7280) at weight 400, max-width ~600px centered.

## Do's and Don'ts

### Do
- Use 8px radius for all rectangular buttons and inputs, 9999px for pill-shaped tags and nav CTAs
- Apply Inter weight 500 for navigation items, button text, and subtle emphasis; reserve 600-700 for subheadings
- Use Satoshi weight 500 at 40-48px for section display headlines — never drop below 40px
- Pair the Ink Black (#0a0a0a) primary CTA with an Ember Orange (#ea580c) in-product action for a clear primary/secondary distinction
- Use Geist Mono for shortened URLs, click counts, and any technical data display
- Keep section gaps at 80px+ to maintain the airy, spacious rhythm
- Use hairline 1px Mist (#e5e5e5) borders for all dividers and input resting states

### Don't
- Don't use Ember Orange (#ea580c) for more than one action per view — it loses impact when overused
- Don't apply heavy drop shadows — the system uses whisper-soft 1-6px lifts only
- Don't use Satoshi for body text or UI labels — it's display-only at 40px+
- Don't use filled colored backgrounds for cards — surfaces stay white or light-tinted only
- Don't use 4px radius for primary CTAs or feature cards — 8px and 12px are the system minimums for significant elements
- Don't introduce new chromatic colors — the palette is monochrome + orange + blue accent
- Don't use decorative gradients on product surfaces — the warm gradient is hero-only atmospheric

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f5` | Page background with warm cream tint — the base layer everything sits on |
| 1 | Paper | `#ffffff` | Card surfaces and product UI mockups — pure white containers |
| 2 | Elevated | `#ffffff` | Modals, popovers, floating panels with subtle shadow elevation |

## Elevation

- **Primary button:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Product card / link shortener:** `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px`
- **Input focus ring:** `rgba(0, 0, 0, 0.1) 0px 0px 0px 4px`

## Imagery

Visuals are product-first: the site uses UI mockups and product screenshots rather than lifestyle photography. The hero link-shortener card and the branded-links product mockup are the primary visual elements. Customer logos appear as small monochrome marks in a trust grid. The only decorative gradient is the warm peach-to-white wash behind the hero section — everything else sits on a clean neutral canvas. No stock photography, no illustrations, no 3D renders. Icons are minimal: small leading icons in section badges and inline link/chain icons in the shortener UI.

## Layout

The page uses a max-width ~1200px centered container with generous outer padding. The hero is centered text over a warm gradient wash that fades to white — full-bleed gradient with a constrained content stack. Below, sections alternate between centered headline + product visual patterns. The trust logo grid is a 2×5 layout with even spacing. The feature sections use a single-column centered heading followed by a wide product mockup card. Navigation is a simple top bar with horizontal links and right-aligned auth buttons. Content density is low — large vertical breathing room between sections (80px+).

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0a0a
- background: #f5f5f5 (canvas) / #ffffff (surfaces)
- border: #e5e5e5
- accent: #ea580c (Ember Orange)
- primary action: no distinct CTA color
- secondary text: #6b7280

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a link shortener product card: white surface, 12px radius, shadow 0px 4px 6px -1px rgba(0,0,0,0.1). Contains a row with an input field (white fill, 1px #d4d4d4 border, 8px radius, 10px 14px padding, Inter 14px) and an Ember Orange (#ea580c) action button at 8px radius with white text. Below it, a result row showing a shortened URL in Geist Mono 14px and a click count in a light pill badge.

3. Create a section with a brand badge: a pill-shaped tag (9999px radius) with #fef9c3 background and #171717 text, Inter weight 500 at 12px, 2px 10px padding, with a small leading icon. Below it, a Satoshi 40px headline in #0a0a0a, centered, followed by a 16px Inter body in #6b7280.

## Similar Brands

- **Vercel** — Same monochrome-first aesthetic with hairline borders, near-black primary CTAs, and minimal color usage; shared commitment to a compact 4px grid and utility-focused Inter typography
- **Linear** — Similar product-mockup-as-hero approach, pill-shaped CTAs, and the same 8px/12px radius hierarchy for buttons and cards
- **Cal.com** — Comparable warm gradient hero washes, orange brand accent against neutral canvas, and the same Satoshi-style rounded display headlines for hero copy
- **Raycast** — Shared product screenshot emphasis over lifestyle imagery, clean monochrome UI with single chromatic accent, and Geist Mono for technical data

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-cream: #f5f5f5;
  --color-paper-white: #ffffff;
  --color-ink-black: #0a0a0a;
  --color-charcoal: #171717;
  --color-graphite: #404040;
  --color-steel: #737373;
  --color-ash: #a3a3a3;
  --color-fog: #d4d4d4;
  --color-mist: #e5e5e5;
  --color-slate: #6b7280;
  --color-ember-orange: #ea580c;
  --color-ember-glow: #fb923c;
  --color-ember-deep: #7c2d12;
  --color-signal-blue: #3b82f6;
  --color-terminal-green: #22863a;
  --color-alert-red: #d32f2f;
  --color-warm-sunrise: #f97316;
  --gradient-warm-sunrise: linear-gradient(90deg, rgb(244, 149, 12), rgb(235, 92, 12));

  /* Typography — Font Families */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-display: 48px;
  --leading-display: 1.15;

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
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-236: 236px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-sm-2: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 0px 0px 4px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.098) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #f5f5f5;
  --surface-paper: #ffffff;
  --surface-elevated: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-cream: #f5f5f5;
  --color-paper-white: #ffffff;
  --color-ink-black: #0a0a0a;
  --color-charcoal: #171717;
  --color-graphite: #404040;
  --color-steel: #737373;
  --color-ash: #a3a3a3;
  --color-fog: #d4d4d4;
  --color-mist: #e5e5e5;
  --color-slate: #6b7280;
  --color-ember-orange: #ea580c;
  --color-ember-glow: #fb923c;
  --color-ember-deep: #7c2d12;
  --color-signal-blue: #3b82f6;
  --color-terminal-green: #22863a;
  --color-alert-red: #d32f2f;
  --color-warm-sunrise: #f97316;

  /* Typography */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-display: 48px;
  --leading-display: 1.15;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-236: 236px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-sm-2: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 0px 0px 4px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.098) 0px 0px 0px 1px inset;
}
```
