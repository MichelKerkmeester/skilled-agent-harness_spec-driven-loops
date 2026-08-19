# Twingate — Style Reference
> Midnight control room with violet and chartreuse signal lights. The whole interface sits on a near-black void, with two accent colors pulsing like status LEDs across instrument-panel components — restrained, engineered, and slightly futuristic without being showy.

**Theme:** dark

Twingate operates as a midnight command center: an almost pure-black canvas layered with charcoal surfaces, where electric violet and chartreuse act as live-signal accents rather than decoration. The system speaks in quiet, light-weight typography — large headlines sit at TT Hoves Light with tight negative tracking, body text at TT Hoves Regular — letting the type architecture carry the weight while color is used as functional punctuation. Components feel instrument-panel: pill buttons, hairline-inset highlights replacing drop shadows, and rounded-but-not-soft 8–12px radii that read as engineered hardware rather than soft material. The result is a dark, security-grade interface that feels more like a control surface than a marketing page: every chromatic moment earns its screen real estate.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, hero backgrounds, full-bleed sections |
| Obsidian | `#0e0f11` | `--color-obsidian` | Card surfaces, elevated panels, content containers above the page |
| Carbon | `#141617` | `--color-carbon` | Secondary surface layer, input fields, nested containers |
| Graphite | `#1d2023` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Slate | `#21223a` | `--color-slate` | Subtle violet-tinted surface for spotlight/featured cards |
| Ash | `#303438` | `--color-ash` | Hairline borders and dividers, very low-contrast separation |
| Steel | `#3a3d40` | `--color-steel` | Slightly stronger borders, subtle outer shadow tint |
| Fog | `#61626b` | `--color-fog` | Muted helper text, disabled labels, low-priority metadata |
| Smoke | `#8d8d96` | `--color-smoke` | Secondary icons, inactive navigation items, tertiary text |
| Cloud | `#a1a1aa` | `--color-cloud` | Body text secondary, link text in resting state, icon strokes |
| Silver | `#cfcfd3` | `--color-silver` | Body text default, paragraph copy, description text |
| Bone | `#999999` | `--color-bone` | Captions, fine print, decorative text |
| Paper White | `#ffffff` | `--color-paper-white` | Primary headings, button text on dark fills, high-emphasis text |
| Signal Violet | `#b6abff` | `--color-signal-violet` | Brand accent — highlighted phrases, feature body text, link emphasis, inline brand moments |
| Live Wire | `#eef35f` | `--color-live-wire` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Circuit Teal | `#00cbaa` | `--color-circuit-teal` | Decorative icon and illustration accent — network node strokes, lock/connection diagrams, graphic highlights |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### TT Hoves Light — Display and headline — all large hero/section headlines (48–68px) use weight 300 with tight negative tracking (-0.018em to -0.007em). The whisper-weight at huge sizes is the brand's signature: confidence through restraint, not volume. · `--font-tt-hoves-light`
- **Substitute:** Söhne, Inter Light, Manrope Light
- **Weights:** 300, 400
- **Sizes:** 22px, 24px, 48px, 54px, 55px, 62px, 68px
- **Line height:** 1.10–1.50
- **Letter spacing:** -0.018em at 68px, -0.016em at 62px, -0.010em at 55px, -0.009em at 54px, -0.007em at 48px
- **Role:** Display and headline — all large hero/section headlines (48–68px) use weight 300 with tight negative tracking (-0.018em to -0.007em). The whisper-weight at huge sizes is the brand's signature: confidence through restraint, not volume.

### TT Hoves Medium — Subheadings, feature card titles, navigation, button labels — the workhorse of the system. 32px appears as a mid-tier section heading, 20px as card titles. · `--font-tt-hoves-medium`
- **Substitute:** Söhne, Inter, Manrope
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 17px, 20px, 32px
- **Line height:** 1.04–1.50
- **Letter spacing:** -0.020em to +0.023em (wider tracking on small caps-style labels like eyebrow text)
- **Role:** Subheadings, feature card titles, navigation, button labels — the workhorse of the system. 32px appears as a mid-tier section heading, 20px as card titles.

### TT Hoves Regular — Body text and long-form copy — paragraph text at 16px with generous 1.5–1.7 line-height, smaller annotations at 11–14px · `--font-tt-hoves-regular`
- **Substitute:** Söhne, Inter, Manrope
- **Weights:** 400
- **Sizes:** 11px, 12px, 14px, 15px, 16px, 17px
- **Line height:** 1.14–1.70
- **Letter spacing:** -0.010em to +0.014em
- **Role:** Body text and long-form copy — paragraph text at 16px with generous 1.5–1.7 line-height, smaller annotations at 11–14px

### Basis Grotesque Mono Pro — Code snippets, terminal-style text, and technical labels — used sparingly as a technical accent, never for body copy · `--font-basis-grotesque-mono-pro`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Berkeley Mono
- **Weights:** 400
- **Sizes:** 13px, 21px
- **Line height:** 1.20–1.60
- **Role:** Code snippets, terminal-style text, and technical labels — used sparingly as a technical accent, never for body copy

### Inter — Secondary body text and supporting UI labels (appears as a fallback/supplement to TT Hoves Regular in some contexts) · `--font-inter`
- **Substitute:** System sans-serif
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.010em to +0.010em
- **Role:** Secondary body text and supporting UI labels (appears as a fallback/supplement to TT Hoves Regular in some contexts)

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.31 | 0.014px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.01px | `--text-body-sm` |
| body | 16px | 1.7 | -0.01px | `--text-body` |
| subheading | 20px | 1.29 | -0.02px | `--text-subheading` |
| heading-sm | 32px | 1.27 | -0.02px | `--text-heading-sm` |
| heading | 48px | 1.2 | -0.007px | `--text-heading` |
| heading-lg | 55px | 1.2 | -0.009px | `--text-heading-lg` |
| display | 68px | 1.1 | -0.018px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 50px |
| images | 12px |
| inputs | 8px |
| buttons | 50px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.1) 0px 0px 0px 0.5px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.1) 0px 2.5px 0px -2px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(58, 61, 64) 0px 0px 0px 0.5px` | `--shadow-subtle-3` |
| subtle-4 | `rgb(48, 52, 56) 0px 0px 0px 0.5px` | `--shadow-subtle-4` |
| subtle-5 | `rgba(255, 255, 255, 0.15) 0px 2.5px 0px -2px inset, rgba(...` | `--shadow-subtle-5` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 20px

## Components

### Primary CTA Button (Pill)
**Role:** Main conversion action — 'Try Twingate for Free'

Filled chartreuse (#eef35f) background, black (#000000) text at 14px TT Hoves Medium weight 500, 50px border-radius (fully pill), padding 12px 24px. Inner highlight: inset 0 2.5px 0 -2px rgba(255,255,255,0.1). No border, no outer shadow. Trailing arrow icon.

### Secondary Text Link Button
**Role:** Low-emphasis action — 'Request a Demo'

Transparent background, white (#ffffff) text at 14px TT Hoves Medium, 50px pill radius, padding 12px 16px. Trailing arrow icon. Inset hairline highlight on hover: rgba(255,255,255,0.1).

### Nav Pill Button (Header)
**Role:** Header actions — 'Request Demo', 'Try for Free'

White (#ffffff) text on transparent resting, becomes a white-fill with black-text style on the 'Request Demo' button (pill, 50px radius, 12px 20px padding, 14px Medium). Sits inside a dark header with inset hairline highlight rgba(255,255,255,0.1) 0px 0px 0px 0.5px.

### Feature Card
**Role:** Mid-page feature/benefit block in 3-column grid

Obsidian (#0e0f11) or transparent background, no visible border. Bold subheading at 20px TT Hoves Medium, white. Body text at 16px TT Hoves Regular, Silver (#cfcfd3) or Signal Violet (#b6abff) for emphasized phrases, line-height 1.7. No card radius, no shadow — cards are typographic blocks, not containers.

### Eyebrow Pill Badge
**Role:** Small context label above headlines — 'New: Twingate MSP Portal'

Dark Graphite (#1d2023) background, white text at 12px TT Hoves Medium, 50px pill radius, padding 6px 12px, with a subtle border or inset highlight. Trailing chevron icon.

### Testimonial Card
**Role:** Customer quote in a grid layout

Obsidian (#0e0f11) surface, 12px radius, 32px padding. Quote text at 16px TT Hoves Regular in Silver (#cfcfd3), customer photo (circular, 40px), name at 14px Medium white, role/title at 12px regular in Smoke (#8d8d96). No visible card border.

### G2 Review Widget (Floating)
**Role:** Social proof callout — '4.9 ★★★★★'

Pill-shaped dark card with rounded ends, Obsidian background, 50px radius, inset white highlight. Large score '4.9' at 32px TT Hoves Medium white, five white stars, 'Based on 50+ G2 reviews' caption at 12px, G2 logo on the right.

### Customer Logo Strip
**Role:** Social proof band of customer logos

Transparent dark background, single row of monochrome white logos (hat, Confluent, Charlotte Tilbury, Blend, PayU, Windsurf, bitpando, Breeze, etc.) evenly spaced with generous gaps. Logos sit on the void canvas with no container or dividers.

### Product Showcase Card
**Role:** Product UI screenshot with branded surround

Chartreuse-tinted (#eef35f at low opacity) background panel with 12px radius, containing a product UI mockup (dark interface with email field, user avatar, URL). Category eyebrow text in green above the card title.

### Network Diagram (Hero Illustration)
**Role:** Decorative hero visual — privileged access network

Concentric circles on near-black background with Circuit Teal (#00cbaa) strokes and lock icons at nodes. Central hexagonal node filled with teal gear icon and a small green check badge. A laptop icon in the center. All line weights appear consistent at ~1.5px.

### Onboarding Banner (Top Bar)
**Role:** Persistent utility strip above navigation

Solid violet (#b6abff) background bar at ~40px height, black text reading 'Twingate Live Onboarding' with workshop/ongoing tags, and a 'Register >' link on the right. High-saturation violet against the dark page is the page's loudest chromatic moment.

### Header Navigation Bar
**Role:** Primary site navigation

Transparent or near-black background, logo left (white Twingate mark), nav links in center (white, 14px Medium), Sign in + Request Demo (white pill) + Try for Free (white pill, dark text) on right. 16px row padding, 10–12px column gap between nav items.

### Link with Arrow (Inline Action)
**Role:** Inline text link ending in a chevron — section footers

White or Signal Violet text at 14–16px TT Hoves Medium with letter-spacing ~0.012em, followed by a right-pointing chevron icon in the same color. No underline. Used to link to detailed pages.

## Do's and Don'ts

### Do
- Use weight 300 (TT Hoves Light) for all display headlines 48px and above — the whisper-weight is the signature
- Use #eef35f (Live Wire) for the single primary CTA on any given screen, and for one emphasis word in the largest headline
- Apply tight negative letter-spacing on all large text: -0.018em at 68px, scaling to 0 at 14px
- Use 50px (pill) border-radius for all buttons, badges, and pill-shaped chips
- Use 12px radius for product cards and image containers; 8px for inputs and smaller interactive elements
- Distinguish surfaces through tonal stacking (#000000 → #0e0f11 → #141617 → #1d2023) rather than drop shadows
- Reserve Signal Violet (#b6abff) for inline brand emphasis within body text and for the top onboarding utility bar

### Don't
- Never use drop shadows for elevation — the system communicates depth through inset hairline highlights and stacked dark surfaces
- Never use more than one filled chartreuse CTA per viewport — it is a single-action accent
- Never set body text below 14px or use weight 300 for body — light weights are reserved for large displays
- Never add decorative gradients — the system is flat dark with chromatic accents, not glossy
- Never use pure black (#000000) text on dark surfaces — text on dark should always be white or a silver tone (#cfcfd3 minimum)
- Never break the 50px pill convention for buttons — outlined or ghost variants must also use the full pill radius
- Never introduce photography with a warm or colorful treatment — all imagery is monochrome, vector, or UI-screenshot

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page canvas — hero, full-bleed sections, body background |
| 1 | Obsidian | `#0e0f11` | Primary card/panel surface above the page |
| 2 | Carbon | `#141617` | Nested containers, input fields, secondary cards |
| 3 | Graphite | `#1d2023` | Button resting fills, elevated chips, hover surfaces |
| 4 | Slate | `#21223a` | Spotlight/featured surface with violet undertone for hero product cards |

## Elevation

- **Buttons and links:** `inset 0 0 0 0.5px rgba(255, 255, 255, 0.1) — hairline inner highlight, no outer drop shadow`
- **Primary CTA fill:** `inset 0 2.5px 0 -2px rgba(255, 255, 255, 0.1) — subtle top inner highlight giving a subtle beveled-LED appearance`
- **Decorative borders:** `inset 0 2.5px 0 -2px rgba(255, 255, 255, 0.15), inset 0 0 0 0.5px rgba(255, 255, 255, 0.15)`

## Imagery

The site is primarily typographic and diagrammatic rather than photographic. The hero visual is a custom line-art network diagram (concentric circles, lock icons in teal, hexagonal node with gear, laptop) that communicates 'decentralized privileged access' through geometry rather than realism. The only product imagery is a small UI mockup (a dark login card) shown inside a chartreuse-tinted panel as a product showcase. The customer logo strip is monochrome white wordmarks — no lifestyle photography, no human faces outside tiny testimonial avatars. The visual language is instrument-panel/control-room: clean vector geometry, teal circuit accents, and a strict absence of photography. Iconography is consistently line-based with 1–1.5px stroke weights, monocolor (teal or white), and no fill decoration.

## Layout

Full-bleed dark layout with a max content width of ~1200px. The hero is a split composition: large left-aligned headline stack (4 lines, the last accented in chartreuse) with a right-aligned diagram visual. Below the hero, sections are full-width bands with 80px vertical padding and centered or left-aligned content stacks. Feature cards are arranged in a 3-column grid with equal-width columns and ~20px gaps, followed by a customer logo strip. The platform section introduces a 2-column layout (text-left, product-card-right). Testimonials use a responsive grid (3-column at desktop, wrapping on smaller viewports). A floating G2 review widget sits absolutely-positioned at center-screen, overlapping the testimonial grid. The overall rhythm is: bold hero → 3-column features → logo strip → 2-column product → testimonial grid. Navigation is a top bar with a persistent utility strip above it.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary) / #cfcfd3 (body) / #a1a1aa (secondary)
- background: #000000 (canvas) / #0e0f11 (card) / #1d2023 (elevated)
- border: #303438 (hairline) / #3a3d40 (stronger)
- accent: #b6abff (violet) / #00cbaa (teal)
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Feature card grid (3-column):* Transparent background. No card container. Subheading at 20px TT Hoves Medium weight 500 white. Body at 16px TT Hoves Regular #cfcfd3, line-height 1.7, with one emphasis phrase in #b6abff. 20px gap between cards.

3. *Pill badge:* #1d2023 background, 50px radius, 6px 12px padding, white text at 12px TT Hoves Medium, 0.012em letter-spacing, trailing chevron icon in white.

4. *Testimonial card:* #0e0f11 surface, 12px radius, 32px padding. Quote at 16px TT Hoves Regular #cfcfd3. 40px circular avatar, name at 14px Medium white, role at 12px Regular #8d8d96. No border, no shadow.

5. *Product showcase card:* #eef35f at 15–20% opacity as panel background, 12px radius, containing a dark UI mockup (carbon #141617 fill, 8px radius input fields, white text, small avatar circle). Eyebrow label above in #eef35f at 12px Medium.

## Color Pairing Logic

The system uses a strict three-color logic: black/charcoal structural tones for everything that recedes, Signal Violet for inline brand warmth and the top utility bar, and Live Wire chartreuse exclusively for the primary action and one headline emphasis word. Circuit Teal is the fourth color but is reserved for illustrative/diagrammatic moments — it should never appear as a button or text color. This creates a clear visual hierarchy: action > emphasis > brand warmth > structural.

## Similar Brands

- **Linear** — Same dark-canvas instrument-panel feel with subtle inset highlights replacing shadows, tight geometric typography, and a single vivid accent color used sparingly
- **Vercel** — Near-black surface stack, light-weight display headlines with negative tracking, and a preference for pill buttons with subtle inner highlights over drop shadows
- **Tailscale** — Same zero-trust/security-tools audience producing dark, technical interfaces with diagram-heavy hero illustrations and monochrome logo strips
- **Cloudflare** — Dark product UI language with layered charcoal surfaces, violet/orange accent pair, and engineering-forward typographic restraint
- **Cursor** — Premium dark developer-tool aesthetic with stacked surface levels, tight letter-spacing on displays, and a single saturated accent that reads as a status LED

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-obsidian: #0e0f11;
  --color-carbon: #141617;
  --color-graphite: #1d2023;
  --color-slate: #21223a;
  --color-ash: #303438;
  --color-steel: #3a3d40;
  --color-fog: #61626b;
  --color-smoke: #8d8d96;
  --color-cloud: #a1a1aa;
  --color-silver: #cfcfd3;
  --color-bone: #999999;
  --color-paper-white: #ffffff;
  --color-signal-violet: #b6abff;
  --color-live-wire: #eef35f;
  --color-circuit-teal: #00cbaa;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-hoves-light: 'TT Hoves Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-hoves-medium: 'TT Hoves Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-hoves-regular: 'TT Hoves Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-mono-pro: 'Basis Grotesque Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.31;
  --tracking-caption: 0.014px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.7;
  --tracking-body: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.27;
  --tracking-heading-sm: -0.02px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.007px;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.009px;
  --text-display: 68px;
  --leading-display: 1.1;
  --tracking-display: -0.018px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 91.06px;
  --radius-full-3: 100px;
  --radius-full-4: 133.33px;
  --radius-full-5: 136.27px;
  --radius-full-6: 500px;
  --radius-full-7: 1000px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 50px;
  --radius-images: 12px;
  --radius-inputs: 8px;
  --radius-buttons: 50px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 0.5px inset;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 2.5px 0px -2px inset;
  --shadow-subtle-3: rgb(58, 61, 64) 0px 0px 0px 0.5px;
  --shadow-subtle-4: rgb(48, 52, 56) 0px 0px 0px 0.5px;
  --shadow-subtle-5: rgba(255, 255, 255, 0.15) 0px 2.5px 0px -2px inset, rgba(255, 255, 255, 0.15) 0px 0px 0px 0.5px inset;

  /* Surfaces */
  --surface-void: #000000;
  --surface-obsidian: #0e0f11;
  --surface-carbon: #141617;
  --surface-graphite: #1d2023;
  --surface-slate: #21223a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-obsidian: #0e0f11;
  --color-carbon: #141617;
  --color-graphite: #1d2023;
  --color-slate: #21223a;
  --color-ash: #303438;
  --color-steel: #3a3d40;
  --color-fog: #61626b;
  --color-smoke: #8d8d96;
  --color-cloud: #a1a1aa;
  --color-silver: #cfcfd3;
  --color-bone: #999999;
  --color-paper-white: #ffffff;
  --color-signal-violet: #b6abff;
  --color-live-wire: #eef35f;
  --color-circuit-teal: #00cbaa;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-hoves-light: 'TT Hoves Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-hoves-medium: 'TT Hoves Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-hoves-regular: 'TT Hoves Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-mono-pro: 'Basis Grotesque Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.31;
  --tracking-caption: 0.014px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.7;
  --tracking-body: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.27;
  --tracking-heading-sm: -0.02px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.007px;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.009px;
  --text-display: 68px;
  --leading-display: 1.1;
  --tracking-display: -0.018px;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 91.06px;
  --radius-full-3: 100px;
  --radius-full-4: 133.33px;
  --radius-full-5: 136.27px;
  --radius-full-6: 500px;
  --radius-full-7: 1000px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 0.5px inset;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 2.5px 0px -2px inset;
  --shadow-subtle-3: rgb(58, 61, 64) 0px 0px 0px 0.5px;
  --shadow-subtle-4: rgb(48, 52, 56) 0px 0px 0px 0.5px;
  --shadow-subtle-5: rgba(255, 255, 255, 0.15) 0px 2.5px 0px -2px inset, rgba(255, 255, 255, 0.15) 0px 0px 0px 0.5px inset;
}
```
