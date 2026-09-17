# Reworkd — Style Reference
> Soft daylight over a product blueprint — the only color that speaks is the action button and the gradient headline above it.

**Theme:** light

Reworkd presents a quiet, AI-tool aesthetic built on a soft lavender-to-white canvas with a single vivid blue accent that powers CTAs, gradient text fills, and the product's blue-violet glow. The defining typographic move is pairing a custom high-contrast display serif (Selecta) at near-black against Suisse Intl for the entire UI chrome — the serif headline is the only decorative gesture on an otherwise utilitarian surface, creating a calm-product contrast. Layout is compact, centered, max-width contained, with thin 6px-radius cards floating on layered soft shadows and hairline 1px borders. Color discipline is strict: 95% achromatic plus one electric blue family, with green reserved for status badges and gradients used sparingly for atmosphere (hero glow) and emphasis (gradient headline text).

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris Blue | `radial-gradient(335.69% 99.21% at 57.77% 0px, rgb(0, 89, 255) 0px, rgba(129, 118, 255, 0.73) 36.5%, rgba(255, 225, 66, 0) 75.65%, rgba(72, 132, 239, 0) 100%)` | `--color-iris-blue` | Brand borders, gradient text fills, icon strokes, link accents — the dominant chromatic identifier across the entire site; Hero background radial glow — the atmospheric blue light at the top of the page |
| Cobalt | `linear-gradient(rgb(88, 151, 247) 0px, rgb(56, 114, 230) 100%)` | `--color-cobalt` | Primary action button fill, active states — the only solid color button in the system; Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Sky Glow | `#3e9ed0` | `--color-sky-glow` | Secondary blue accent for illustrations and decorative icon strokes |
| Mint Pulse | `#89ecb0` | `--color-mint-pulse` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Midnight Iris | `#2c65d3` | `--color-midnight-iris` | Link border accent, gradient text deep stop |
| Ink | `#272c30` | `--color-ink` | Primary text, dominant border color, nav text, heading text — the structural dark of the system |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text, inverted surfaces |
| Lavender Mist | `#f0f5fe` | `--color-lavender-mist` | Hero gradient origin, soft section backgrounds — gives the page its daylight wash |
| Pale Slate | `#e3e8ea` | `--color-pale-slate` | Secondary surface, input backgrounds, hairline border variant |
| Dove Gray | `#a6b4ba` | `--color-dove-gray` | Icon strokes, muted borders, secondary button borders — cool-toned mid-gray |
| Iron | `#526068` | `--color-iron` | Body text muted, secondary button text, supportive UI labels |
| Graphite | `#60737a` | `--color-graphite` | Tertiary text, helper copy, table row metadata |
| Slate Mist | `#7b8e95` | `--color-slate-mist` | Icon stroke variant, heading accent borders, decorative line work |

## Tokens — Typography

### Selecta — Display and headline serif — the only decorative typeface, used exclusively for hero/page-level headlines with tight negative tracking. The choice of a high-contrast serif for an AI devtool is the system's signature: it signals editorial confidence against an otherwise utilitarian sans-serif body. Tightest tracking at 86px (-0.025em ≈ -2.15px) tightens to -0.015em at 40px, loosening as size decreases. · `--font-selecta`
- **Substitute:** Fraunces, Tiempos Headline, or Playfair Display
- **Weights:** 400, 500
- **Sizes:** 18px, 40px, 56px, 80px, 86px
- **Line height:** 0.95, 1.00, 1.10, 1.17, 1.33
- **Letter spacing:** -2.15px at 86px, -2.0px at 80px, -1.12px at 56px, -0.60px at 40px, 0.36px at 18px
- **Role:** Display and headline serif — the only decorative typeface, used exclusively for hero/page-level headlines with tight negative tracking. The choice of a high-contrast serif for an AI devtool is the system's signature: it signals editorial confidence against an otherwise utilitarian sans-serif body. Tightest tracking at 86px (-0.025em ≈ -2.15px) tightens to -0.015em at 40px, loosening as size decreases.

### Suisse Intl — Primary UI typeface — body text, nav, buttons, cards, icons labels, badges. Carries the entire system except headlines. Weight 450 (the unusual mid-weight) is the signature body weight; 500 for emphasis and nav items. Tracking opens positive (0.04–0.05em) at the smallest sizes (8–10px) to keep tiny UI labels legible. · `--font-suisse-intl`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 450, 500, 600
- **Sizes:** 8px, 9px, 10px, 11px, 12px, 14px, 16px
- **Line height:** 1.00, 1.09, 1.20, 1.33, 1.40, 1.43, 1.45, 1.50, 1.57, 1.67
- **Letter spacing:** 0.05em at 8–9px, 0.04em at 10px, 0.02em at 12–14px, 0.01em at 16px
- **Role:** Primary UI typeface — body text, nav, buttons, cards, icons labels, badges. Carries the entire system except headlines. Weight 450 (the unusual mid-weight) is the signature body weight; 500 for emphasis and nav items. Tracking opens positive (0.04–0.05em) at the smallest sizes (8–10px) to keep tiny UI labels legible.

### Geist Mono — Code snippets, tab labels in the product mockup, file path labels, technical micro-copy. Most distinctive use: extreme 0.15em tracking on the smallest sizes (the "What's the problem?" eyebrow label style), creating an all-caps, wide-tracked technical eyebrow that contrasts the serif headline below it. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Geist Mono (open-source)
- **Weights:** 400, 450, 500, 600
- **Sizes:** 8px, 9px, 10px, 12px, 16px
- **Line height:** 1.20, 1.33, 1.50, 1.60, 1.67
- **Letter spacing:** 0.15em for eyebrow labels, 0.02em for code blocks, 0.01em for inline code
- **Role:** Code snippets, tab labels in the product mockup, file path labels, technical micro-copy. Most distinctive use: extreme 0.15em tracking on the smallest sizes (the "What's the problem?" eyebrow label style), creating an all-caps, wide-tracked technical eyebrow that contrasts the serif headline below it.

### Geist Sans — Fallback/secondary sans for specific UI clusters where Geist Mono's monospace character isn't needed but a lighter weight sans is. Used sparingly — Suisse Intl does the heavy lifting. · `--font-geist-sans`
- **Substitute:** Inter or system-ui
- **Weights:** 400, 500, 600, 700
- **Sizes:** 8px, 11px, 12px
- **Line height:** 1.45, 1.50, 1.67, 2.18
- **Letter spacing:** 0.0100em, 0.0200em
- **Role:** Fallback/secondary sans for specific UI clusters where Geist Mono's monospace character isn't needed but a lighter weight sans is. Used sparingly — Suisse Intl does the heavy lifting.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.4px | `--text-caption` |
| body | 14px | 1.43 | 0.14px | `--text-body` |
| heading-sm | 18px | 1.33 | 0.36px | `--text-heading-sm` |
| heading | 40px | 1.1 | -0.6px | `--text-heading` |
| heading-lg | 56px | 1 | -1.12px | `--text-heading-lg` |
| display | 80px | 0.95 | -2px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |
| 136 | 136px | `--spacing-136` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| tags | 9999px |
| cards | 6px |
| icons | 9999px |
| inputs | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(39, 44, 48, 0.1) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `rgba(63, 70, 75, 0.1) 0px 1px 3px 0px, rgba(63, 70, 75, 0...` | `--shadow-subtle-2` |
| xl | `rgba(63, 70, 75, 0.1) 0px 21px 44px -32px, rgba(39, 44, 4...` | `--shadow-xl` |
| subtle-3 | `rgb(255, 255, 255) 0px 0px 0px 2px, rgba(39, 44, 48, 0.13...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset, rgba(26,...` | `--shadow-subtle-4` |
| xl-2 | `rgba(63, 70, 75, 0.5) 0px 21px 44px -40px, rgba(39, 44, 4...` | `--shadow-xl-2` |
| sm | `rgba(63, 70, 75, 0.04) 0px 0px 8px 0px, rgba(63, 70, 75, ...` | `--shadow-sm` |
| subtle-5 | `rgba(63, 70, 75, 0.4) 0px 1px 3px 0px, rgb(70, 81, 88) 0p...` | `--shadow-subtle-5` |
| md | `rgba(63, 70, 75, 0.1) 0px 3px 12px 0px, rgba(63, 70, 75, ...` | `--shadow-md` |
| subtle-6 | `rgba(63, 70, 75, 0.2) 0px 1px 2px 0px` | `--shadow-subtle-6` |
| subtle-7 | `rgba(0, 0, 0, 0.25) 0px 1px 3px 0px, rgba(255, 255, 255, ...` | `--shadow-subtle-7` |
| subtle-8 | `rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset, rgba(33,...` | `--shadow-subtle-8` |
| xl-3 | `rgba(255, 255, 255, 0.04) 0px -4px 36px 1px inset, rgba(2...` | `--shadow-xl-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 12px
- **Element gap:** 12px

## Components

### Primary CTA Button
**Role:** Hero and section-level action button

Filled Cobalt (#3e79ea) background, white text, Suisse Intl 14px weight 500, 6px radius, 8px vertical / 14–16px horizontal padding. Subtle inset highlight (rgba(255,255,255,0.25) 0 1px 0 inset) plus soft outer drop shadow stack. The only fully chromatic button in the system — use it once per viewport.

### Secondary Outline Button
**Role:** Companion action next to primary CTA

White or transparent background, 1px Ink (#272c30) or Dove Gray (#a6b4ba) border, Ink text, 6px radius, same padding as primary. No fill on hover — just a subtle Pale Slate (#e3e8ea) wash.

### Ghost Nav Button
**Role:** Top navigation items (Features, Pricing, Blog, Docs)

No background, no border, Ink (#272c30) text at 14px weight 450, 6px hover state, transparent until hover. 8px vertical / 12px horizontal click target padding.

### Pill Badge
**Role:** Status indicators (Active, Beta, New), tag chips, count indicators

Full pill radius (9999px), 2–3px vertical / 8–10px horizontal padding. Mint Pulse (#89ecb0) fill with Ink text for status; neutral Pale Slate fill with Graphite text for neutral tags. Text at 10–11px weight 500, tracking 0.04em.

### Product Mockup Card
**Role:** Hero product showcase, screenshot containers

White surface, 6px radius, complex layered shadow: rgba(63,70,75,0.1) 0 21px 44px -32px, rgba(39,44,48,0.2) 0 26px 30px -23px, rgba(39,44,48,0.05) 0 14px 40px 0px, rgba(39,44,48,0.08) 0 0 0 1px, rgba(39,44,48,0.12) 0 4px 8px 0px. Contains a browser-chrome header (3 dot controls, tab bar) above a data table or app UI.

### Elevated Card
**Role:** Feature cards, pricing tiers, testimonial cards

White surface, 6px radius, 12px padding, 1px Pale Slate (#e3e8ea) hairline border. No shadow by default; on hover uses the same product mockup shadow stack at reduced opacity. The hairline border is the primary elevation cue, not shadow.

### Browser Tab Bar
**Role:** Product screenshot top chrome

Pale Slate (#e3e8ea) background, rounded tab pills with white fill and 1px Dove Gray border, 9–10px Geist Mono weight 500 with 0.02em tracking. Three-dot macOS controls on the left in Dove Gray.

### Data Table Row
**Role:** Table rows inside product mockup

White row, 1px bottom border in Pale Slate, 12px vertical / 16px horizontal padding. Geist Mono 12px for ID/codes, Suisse Intl 12px for descriptions. Active row shows Mint Pulse background tint at 10% opacity.

### Logo Strip Card
**Role:** Investor/partner logos row

White card, 1px Pale Slate border, 6px radius, generous vertical padding (32–48px). Logos rendered in Ink at 60% opacity. Separated from neighbors by vertical 1px Pale Slate dividers, not spacing gaps.

### Team Member Card
**Role:** Advisor/team listing

No background, centered. Circular avatar (40–48px) above name in Suisse Intl 14px weight 500 Ink, then role in Graphite 12px. 12px gap between elements. No border, no card — relies on whitespace alone.

### Search Input
**Role:** Filter/search fields in product UI

White background, 1px Dove Gray border, 6px radius, 8px vertical / 12px horizontal padding. Leading magnifier icon in Dove Gray stroke. Placeholder text in Graphite at 12px.

### Filter Select
**Role:** Dropdown selects in product UI

White background, 1px Dove Gray border, 6px radius, same vertical padding as search. Label/value text in Ink, chevron icon in Dove Gray. Active state: 1px Iris Blue border.

### Sunset Banner
**Role:** Top-of-page deprecation notice

Full-width Ink (#272c30) bar, 8–10px vertical padding, white text centered at 12px weight 450, 1.5 line-height. Underlined email link in Cobalt.

### Section Eyebrow Label
**Role:** Pre-headline section labels

Geist Mono 10–12px weight 500, 0.15em tracking, Graphite text, often with a trailing dot or bracket mark. Sits centered above serif headlines as a typographic signature transition.

## Do's and Don'ts

### Do
- Use Selecta serif exclusively for display headlines (40px+) and never for body copy — the sans/serif split is the system's signature.
- Use 6px radius for all rectangular surfaces (buttons, cards, inputs, nav) and 9999px only for pills, tags, and circular icons — never mix intermediate radii like 8px or 12px.
- Apply the blue gradient (88,151,247 → 56,114,230) to the second line of hero headlines to create the "data extraction" effect — keep the first line in solid Ink.
- Use the layered card shadow stack on hero product mockups and hover states only; for static feature cards, rely on a 1px Pale Slate hairline border with no shadow.
- Set the hero on a radial aurora glow over a Lavender Mist → white linear wash; never use a flat white hero.
- Use Mint Pulse (#89ecb0) exclusively for "Active" status and success states; do not introduce a separate green for decorative purposes.
- Apply tight negative tracking on Selecta at all sizes above 40px (down to -0.025em) and switch to positive tracking (0.01–0.05em) for Suisse Intl body text and labels.

### Don't
- Don't use Cobalt (#3e79ea) for any non-action element — it is reserved for the primary CTA button and is the only filled chromatic button allowed.
- Don't pair the serif headline with a serif body — Selecta must not appear below 18px; the transition to Suisse Intl at subheading level is mandatory.
- Don't use intermediate border radii (8px, 10px, 12px) — the system commits to 6px for rectangles and 9999px for pills.
- Don't add green decoration outside of status badges — Mint Pulse signals Active/success, nothing else.
- Don't use the blue gradient on body text, buttons, or subheadings — it is a display-headline treatment only.
- Don't use dark backgrounds for cards or sections — the palette is a daylight system; Ink is for text and borders, never large fills.
- Don't introduce additional blue or violet shades — the palette has exactly two blues (Iris Blue #3161df and Cobalt #3e79ea) plus Sky Glow #3e9ed0 for minor accents.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pure Canvas | `#ffffff` | Page base background, card surfaces, product mockup interior |
| 1 | Lavender Wash | `#f0f5fe` | Hero gradient origin, soft section tints beneath the aurora glow |
| 2 | Pale Slate | `#e3e8ea` | Browser tab bar backgrounds, secondary surfaces, input backgrounds |
| 3 | Dove Gray | `#a6b4ba` | Hairline border variant, icon strokes, button border in neutral contexts |
| 4 | Graphite Smoke | `#d4d5d6` | Card shadow inner stop, subtle elevated panel backgrounds |

## Elevation

- **Product Mockup Card / Hero Screenshot:** `rgba(63, 70, 75, 0.1) 0px 21px 44px -32px, rgba(39, 44, 48, 0.2) 0px 26px 30px -23px, rgba(39, 44, 48, 0.05) 0px 14px 40px 0px, rgba(39, 44, 48, 0.08) 0px 0px 0px 1px, rgba(39, 44, 48, 0.12) 0px 4px 8px 0px`
- **Static Feature Card / Elevated Card:** `rgba(39, 44, 48, 0.1) 0px 0px 0px 1px`
- **Button (subtle elevation):** `rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset, rgba(26, 41, 61, 0.15) 0px 1px 3px 0px, rgba(26, 41, 61, 0.11) 0px 7px 11px -5px, rgba(26, 41, 61, 0.08) 0px 0px 0px 1px`
- **Icon Halo (on colored backgrounds):** `rgb(255, 255, 255) 0px 0px 0px 2px, rgba(39, 44, 48, 0.13) 0px 1px 2px 2px`

## Imagery

Imagery is minimal and product-centric: the dominant visual is a UI mockup of the data extraction dashboard (browser chrome with tabs, a filterable data table, status badges, and search inputs) presented as a large hero card with a layered soft shadow. The only other photographic element is circular team/advisor headshots at 40–48px with no border treatment. There is no lifestyle photography, no abstract illustration, and no 3D rendering — the product UI IS the hero. The lavender-to-white aurora gradient backdrop provides atmospheric depth without imagery. Logos in the partner strip are flat monochrome Ink, never colored.

## Layout

Page is centered and max-width contained (1200px) with generous outer padding. The hero is a centered text block (headline + subhead + single CTA) sitting above a wide product mockup card that nearly touches the viewport edges. Below the hero, sections alternate between centered text blocks and full-bleed dividers (no colored bands). A "Backed by the best" section uses a 3-column team grid followed by a 4-column logo strip with vertical hairline dividers. The "Web data is difficult" section repeats the centered hero pattern: eyebrow label → serif headline → body → visual. Navigation is a minimal top bar (logo left, 4–5 ghost nav items centered/right, outlined Sign Up button far right) plus a full-width dark sunset announcement bar above it. Section gaps are large (64px+) creating spacious vertical rhythm; card grids are 3-column at desktop collapsing to 1-column on mobile. Information density is compact inside cards but breathing room between sections is generous.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #272c30 (Ink)
- Text (muted/helper): #526068 (Iron) / #60737a (Graphite)
- Background (canvas): #ffffff
- Border (hairline): #e3e8ea (Pale Slate) / #a6b4ba (Dove Gray)
- Accent (brand/links): #3161df (Iris Blue)
- primary action: #3e79ea (filled action)
- Status (Active/success): #89ecb0 (Mint Pulse)
- Hero atmosphere: radial aurora from #3161df fading to transparent over #f0f5fe → #ffffff

**3-5 Example Component Prompts**

1. **Hero Section**: Centered, max-width 1200px. Radial aurora background (Iris Blue #3161df at 57% horizontal / 0% vertical, fading to transparent at 100%) over a linear Lavender Mist (#f0f5fe) → white wash. Headline in Selecta 80px weight 400, Ink (#272c30), letter-spacing -2.0px, line-height 0.95, two lines: first line solid Ink, second line filled with the blue gradient (linear #5897f7 → #3872e6). Subtext in Suisse Intl 16px weight 450, Iron (#526068). One filled CTA: Cobalt (#3e79ea) background, white text, Suisse Intl 14px weight 500, 6px radius, 8px × 14px padding.

2. **Product Mockup Card**: White surface, 6px radius, complex shadow stack (see elevation). Browser chrome header: Pale Slate (#e3e8ea) background, 3 macOS dots left in Dove Gray, 3 Geist Mono tab labels (9–10px, weight 500, 0.02em tracking) on white pills with 1px Dove Gray border. Body: a data table with Geist Mono 12px IDs, Suisse Intl 12px descriptions, 1px Pale Slate row dividers, 12px vertical / 16px horizontal padding, an "Active" pill badge in Mint Pulse (#89ecb0) with Ink text, full 9999px radius.

3. **Logo Strip**: 4 equal columns, 1px Pale Slate vertical dividers between them, no outer border. White background, 32–48px vertical padding. Logos rendered as flat monochrome Ink (#272c30) at 60% opacity, vertically and horizontally centered in each cell.

4. **Feature Section (centered)**: Eyebrow label in Geist Mono 12px weight 500, 0.15em tracking, Graphite (#60737a) text, centered. Headline in Selecta 56px weight 400, Ink, letter-spacing -1.12px, line-height 1.0, centered. Body in Suisse Intl 16px weight 450, Iron, centered, max-width 640px.

5. Create a Primary Action Button: #3e79ea background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Gradient System

Three distinct gradient treatments, each with a specific job:

1. **Display Headline Fill** — linear top-to-bottom from #5897f7 to #3872e6, applied as a CSS background-clip: text fill on the second line of hero/section headlines. Never on body text or subheadings.

2. **Hero Aurora Background** — radial gradient anchored at 57% horizontal / 0% vertical, starting at rgb(0, 89, 255), transitioning through rgba(129, 118, 255, 0.73) at 36.5%, then fading to transparent via warm yellow and cool blue stops. Sits on top of a soft linear Lavender Mist (#f0f5fe) → white base. Creates the impression of a light source above the page.

3. **Section Wash** — linear Lavender Mist (#f0f5fe) → light blue-gray (rgb(195, 217, 250)) for subtle background differentiation on body sections when needed. Use sparingly — most sections are pure white.

Do not stack gradients. Do not apply the aurora radial to cards or non-hero sections. Do not create new gradient stops — the palette is closed.

## Similar Brands

- **Linear** — Same compact UI density, single-accent color discipline, and serif-free system with one chromatic brand color against a near-white canvas
- **Perplexity** — Same daylight lavender-to-white hero treatment and a single blue accent driving all interactive elements, with product UI screenshots as the hero visual
- **Vercel** — Same minimal top nav with ghost items + outlined CTA, hairline 1px borders as the primary elevation cue, and 6px-radius surfaces throughout
- **Anthropic** — Same restraint of color to a single brand hue plus warm neutrals, with serif-free sans body and centered max-width content blocks
- **Raycast** — Same browser-chrome product mockup with macOS dots and tab bar above a data UI, Geist-family typography, and compact 6px-radius surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris-blue: #3161df;
  --gradient-iris-blue: radial-gradient(335.69% 99.21% at 57.77% 0px, rgb(0, 89, 255) 0px, rgba(129, 118, 255, 0.73) 36.5%, rgba(255, 225, 66, 0) 75.65%, rgba(72, 132, 239, 0) 100%);
  --color-cobalt: #3e79ea;
  --gradient-cobalt: linear-gradient(rgb(88, 151, 247) 0px, rgb(56, 114, 230) 100%);
  --color-sky-glow: #3e9ed0;
  --color-mint-pulse: #89ecb0;
  --color-midnight-iris: #2c65d3;
  --color-ink: #272c30;
  --color-pure-white: #ffffff;
  --color-lavender-mist: #f0f5fe;
  --color-pale-slate: #e3e8ea;
  --color-dove-gray: #a6b4ba;
  --color-iron: #526068;
  --color-graphite: #60737a;
  --color-slate-mist: #7b8e95;

  /* Typography — Font Families */
  --font-selecta: 'Selecta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-geist-sans: 'Geist Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.4px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.14px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.36px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.12px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-136: 136px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 12px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-3xl: 26px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-tags: 9999px;
  --radius-cards: 6px;
  --radius-icons: 9999px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-subtle: rgba(39, 44, 48, 0.1) 0px 0px 0px 1px;
  --shadow-subtle-2: rgba(63, 70, 75, 0.1) 0px 1px 3px 0px, rgba(63, 70, 75, 0.1) 0px 0px 0px 1px;
  --shadow-xl: rgba(63, 70, 75, 0.1) 0px 21px 44px -32px, rgba(39, 44, 48, 0.2) 0px 26px 30px -23px, rgba(39, 44, 48, 0.05) 0px 14px 40px 0px, rgba(39, 44, 48, 0.08) 0px 0px 0px 1px, rgba(39, 44, 48, 0.12) 0px 4px 8px 0px;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 0px 0px 2px, rgba(39, 44, 48, 0.13) 0px 1px 2px 2px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset, rgba(26, 41, 61, 0.15) 0px 1px 3px 0px, rgba(26, 41, 61, 0.11) 0px 7px 11px -5px, rgba(26, 41, 61, 0.08) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(63, 70, 75, 0.5) 0px 21px 44px -40px, rgba(39, 44, 48, 0.1) 0px 26px 30px -23px, rgba(39, 44, 48, 0.05) 0px 14px 40px 0px, rgba(39, 44, 48, 0.1) 0px 0px 0px 1px, rgba(39, 44, 48, 0.07) 0px 4px 9px 0px;
  --shadow-sm: rgba(63, 70, 75, 0.04) 0px 0px 8px 0px, rgba(63, 70, 75, 0.03) 0px 1px 5px 0px, rgba(55, 61, 66, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-5: rgba(63, 70, 75, 0.4) 0px 1px 3px 0px, rgb(70, 81, 88) 0px 0px 0px 1px;
  --shadow-md: rgba(63, 70, 75, 0.1) 0px 3px 12px 0px, rgba(63, 70, 75, 0.55) 0px 1px 5px 0px, rgb(63, 70, 75) 0px 0px 0px 1px;
  --shadow-subtle-6: rgba(63, 70, 75, 0.2) 0px 1px 2px 0px;
  --shadow-subtle-7: rgba(0, 0, 0, 0.25) 0px 1px 3px 0px, rgba(255, 255, 255, 0.1) 0px 0px 2px 1px inset, rgba(255, 255, 255, 0.25) 0px 1px 1px 0px inset;
  --shadow-subtle-8: rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset, rgba(33, 38, 41, 0.1) 0px 3px 12px 0px, rgba(33, 38, 41, 0.2) 0px 1px 5px 0px, rgba(33, 38, 41, 0.9) 0px 0px 0px 1px;
  --shadow-xl-3: rgba(255, 255, 255, 0.04) 0px -4px 36px 1px inset, rgba(255, 255, 255, 0.13) 0px 0px 8px 2px inset, rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.5) 0px 21px 44px -40px, rgba(0, 0, 0, 0.1) 0px 26px 30px -23px, rgba(0, 0, 0, 0.05) 0px 14px 40px 0px, rgba(0, 0, 0, 0.07) 0px 4px 9px 0px;

  /* Surfaces */
  --surface-pure-canvas: #ffffff;
  --surface-lavender-wash: #f0f5fe;
  --surface-pale-slate: #e3e8ea;
  --surface-dove-gray: #a6b4ba;
  --surface-graphite-smoke: #d4d5d6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris-blue: #3161df;
  --color-cobalt: #3e79ea;
  --color-sky-glow: #3e9ed0;
  --color-mint-pulse: #89ecb0;
  --color-midnight-iris: #2c65d3;
  --color-ink: #272c30;
  --color-pure-white: #ffffff;
  --color-lavender-mist: #f0f5fe;
  --color-pale-slate: #e3e8ea;
  --color-dove-gray: #a6b4ba;
  --color-iron: #526068;
  --color-graphite: #60737a;
  --color-slate-mist: #7b8e95;

  /* Typography */
  --font-selecta: 'Selecta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-geist-sans: 'Geist Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.4px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.14px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.36px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.12px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-136: 136px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-3xl: 26px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(39, 44, 48, 0.1) 0px 0px 0px 1px;
  --shadow-subtle-2: rgba(63, 70, 75, 0.1) 0px 1px 3px 0px, rgba(63, 70, 75, 0.1) 0px 0px 0px 1px;
  --shadow-xl: rgba(63, 70, 75, 0.1) 0px 21px 44px -32px, rgba(39, 44, 48, 0.2) 0px 26px 30px -23px, rgba(39, 44, 48, 0.05) 0px 14px 40px 0px, rgba(39, 44, 48, 0.08) 0px 0px 0px 1px, rgba(39, 44, 48, 0.12) 0px 4px 8px 0px;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 0px 0px 2px, rgba(39, 44, 48, 0.13) 0px 1px 2px 2px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset, rgba(26, 41, 61, 0.15) 0px 1px 3px 0px, rgba(26, 41, 61, 0.11) 0px 7px 11px -5px, rgba(26, 41, 61, 0.08) 0px 0px 0px 1px;
  --shadow-xl-2: rgba(63, 70, 75, 0.5) 0px 21px 44px -40px, rgba(39, 44, 48, 0.1) 0px 26px 30px -23px, rgba(39, 44, 48, 0.05) 0px 14px 40px 0px, rgba(39, 44, 48, 0.1) 0px 0px 0px 1px, rgba(39, 44, 48, 0.07) 0px 4px 9px 0px;
  --shadow-sm: rgba(63, 70, 75, 0.04) 0px 0px 8px 0px, rgba(63, 70, 75, 0.03) 0px 1px 5px 0px, rgba(55, 61, 66, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-5: rgba(63, 70, 75, 0.4) 0px 1px 3px 0px, rgb(70, 81, 88) 0px 0px 0px 1px;
  --shadow-md: rgba(63, 70, 75, 0.1) 0px 3px 12px 0px, rgba(63, 70, 75, 0.55) 0px 1px 5px 0px, rgb(63, 70, 75) 0px 0px 0px 1px;
  --shadow-subtle-6: rgba(63, 70, 75, 0.2) 0px 1px 2px 0px;
  --shadow-subtle-7: rgba(0, 0, 0, 0.25) 0px 1px 3px 0px, rgba(255, 255, 255, 0.1) 0px 0px 2px 1px inset, rgba(255, 255, 255, 0.25) 0px 1px 1px 0px inset;
  --shadow-subtle-8: rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset, rgba(33, 38, 41, 0.1) 0px 3px 12px 0px, rgba(33, 38, 41, 0.2) 0px 1px 5px 0px, rgba(33, 38, 41, 0.9) 0px 0px 0px 1px;
  --shadow-xl-3: rgba(255, 255, 255, 0.04) 0px -4px 36px 1px inset, rgba(255, 255, 255, 0.13) 0px 0px 8px 2px inset, rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.5) 0px 21px 44px -40px, rgba(0, 0, 0, 0.1) 0px 26px 30px -23px, rgba(0, 0, 0, 0.05) 0px 14px 40px 0px, rgba(0, 0, 0, 0.07) 0px 4px 9px 0px;
}
```
