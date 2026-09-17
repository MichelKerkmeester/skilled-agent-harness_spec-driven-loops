# Flighty — Style Reference
> Control tower at midnight — a luminous control room with glowing screens floating around a single device

**Theme:** mixed

Flighty is a departure-board-meets-control-tower: the upper page reads as a crisp white airport information panel, then the page drops into a deep midnight-violet control room with glowing screens in the dark. The palette is overwhelmingly achromatic, with one vivid blue (#007bff) reserved for actions and one amber-yellow (#f7be00) for the download conversion — a signal-light system against the dark and light surfaces. Typography is confident and heavy: a 56px display headline with tight -0.025em tracking that lands like a gate-change announcement, supported by compact system-ui body text. The signature element is the phone mockup surrounded by floating notification cards — soft, shadowed, slightly tilted cards showing real-time flight data (delays, gate changes, check-in opens) that orbit the device and make the product feel alive rather than static. Surfaces are nearly flat with ultra-low-opacity shadows (0.02–0.04) and hairline borders, so depth comes from layering and the page's light-to-dark transition, not from heavy drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#007bff` | `--color-signal-blue` | Primary action button fill, active link states, focus indicators — the single chromatic action color in an otherwise achromatic system |
| Amber Alert | `#f7be00` | `--color-amber-alert` | Download CTA, high-priority callouts, notification accents — warm yellow against dark surfaces for the conversion moment |
| Deep Indigo | `#0d0021` | `--color-deep-indigo` | Dark section backgrounds, announcement bar, hero gradient base — the midnight-violet that makes screens glow |
| Midnight Ink | `#05010d` | `--color-midnight-ink` | Dark card surfaces, deepest background layer — near-black with a violet undertone |
| Pure White | `#ffffff` | `--color-pure-white` | Light canvas, notification card surfaces, text on dark — the dominant surface color in the upper page |
| Pure Black | `#000000` | `--color-pure-black` | Primary text, icon strokes, hairline borders, ghost button fills — the structural ink of the system |
| Carbon | `#333333` | `--color-carbon` | Secondary text, subdued body copy — reads softer than pure black for paragraph-length content |
| Slate | `#595959` | `--color-slate` | Tertiary text, metadata, timestamps in notification cards |
| Steel | `#737373` | `--color-steel` | Muted body text, disabled states, inactive nav items |
| Fog | `#808080` | `--color-fog` | Placeholder text, dimmed labels, low-priority metadata |
| Silver | `#cfcfcf` | `--color-silver` | Hairline borders, card outlines, subtle dividers, very light surface tint |
| Linen | `#faf8f7` | `--color-linen` | Warm off-white surface — alternate card background, subtle tonal shift from pure white |
| Ash | `#89898e` | `--color-ash` | Cool gray for pressed states and slightly cooler text — the only neutral with a slight blue cast |
| Alert Red | `#d92d20` | `--color-alert-red` | Red outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### system-ui — Primary typeface for the entire system — covers display headlines, navigation, body copy, and UI labels. Weight 700 dominates display sizes (56px, 32px) for the bold announcement-board voice; 500–600 for nav and emphasis; 400 for body. The choice of system-ui over a custom typeface is itself a signature: it reads native on every device and inherits the platform's voice rather than imposing a foreign one. · `--font-system-ui`
- **Substitute:** Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13px, 15px, 16px, 17px, 22px, 32px, 56px
- **Line height:** 1.00–2.00 (display headlines 1.00, body 1.38, loose body 1.50–2.00)
- **Letter spacing:** -0.025em at 56px, -0.025em at 32px, -0.010em at 17px, -0.006em at 16px, -0.005em at 15px
- **Role:** Primary typeface for the entire system — covers display headlines, navigation, body copy, and UI labels. Weight 700 dominates display sizes (56px, 32px) for the bold announcement-board voice; 500–600 for nav and emphasis; 400 for body. The choice of system-ui over a custom typeface is itself a signature: it reads native on every device and inherits the platform's voice rather than imposing a foreign one.

### EB Garamond — Editorial serif accent for emphasis moments — tight line-height (0.90) and 700 weight give it a display-poster quality. Used sparingly, probably for tagline or feature emphasis where the sans-serif would feel too uniform. · `--font-eb-garamond`
- **Substitute:** Playfair Display, Cormorant Garamond
- **Weights:** 700
- **Sizes:** 24px
- **Line height:** 0.90
- **Letter spacing:** -0.020em
- **Role:** Editorial serif accent for emphasis moments — tight line-height (0.90) and 700 weight give it a display-poster quality. Used sparingly, probably for tagline or feature emphasis where the sans-serif would feel too uniform.

### SF Pro Text Regular — SF Pro Text Regular — detected in extracted data but not described by AI · `--font-sf-pro-text-regular`
- **Weights:** 400
- **Sizes:** 13px, 15px
- **Line height:** 1.2, 1.5
- **Role:** SF Pro Text Regular — detected in extracted data but not described by AI

### SF Pro Text Semibold — SF Pro Text Semibold — detected in extracted data but not described by AI · `--font-sf-pro-text-semibold`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** SF Pro Text Semibold — detected in extracted data but not described by AI

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Inter — detected in extracted data but not described by AI

### Indie Flower — Indie Flower — detected in extracted data but not described by AI · `--font-indie-flower`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Indie Flower — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| heading-sm | 22px | 1.38 | -0.55px | `--text-heading-sm` |
| heading | 32px | 1.1 | -0.8px | `--text-heading` |
| display | 56px | 1 | -1.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 999px |
| tags | 999px |
| cards | 16px |
| icons | 999px |
| inputs | 12px |
| buttons | 999px |
| floatingCards | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) ...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) ...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.03) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.03...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(0, 0, 0, 0.19) 0px 1px 2px 0px` | `--shadow-subtle-4` |
| subtle-5 | `rgba(0, 0, 0, 0.03) 0px 159px 3px 10px, rgba(0, 0, 0, 0.1...` | `--shadow-subtle-5` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-width bar with #0d0021 (Deep Indigo) background, white text at 13px system-ui 500, centered content with a small icon (lightbulb) and a 'View Live →' link. Padding approximately 8px vertical. Optional close button on the right. This bar announces live features or news and uses the dark-indigo to set the control-room tone before the white page begins.

### Floating Navigation Pill
**Role:** Primary site navigation

Single rounded pill (999px radius) floating on the page with subtle shadow stack. Contains the ✈ logo mark, menu items (Pricing, Gift Cards, Passport, Airports, Help Center) in 15px system-ui 500 #000, and a 'Get the app' ghost button on the right. The pill itself has a white or very-light background with 1px border. Padding 8px vertical, 12-16px horizontal inside the pill. The pill form — rather than a full-width bar — is the signature: the nav sits on the page like a control device, not a structural element.

### Ghost App Button (nav)
**Role:** Secondary conversion in nav

Inside the nav pill: transparent background, #000 text, 1px border in #000 at 50% opacity, 999px radius, 8px 16px padding. Includes a small phone icon. This is the quiet 'get the app' prompt that lives inside the nav.

### Primary Blue Button
**Role:** Main call-to-action

Filled #007bff background, white text, 999px radius, 12px 24px padding, 15px system-ui 600. No border. The only chromatic filled button in the system — used sparingly for the most important action on a given page.

### Amber Download Button
**Role:** High-priority download conversion

Filled #f7be00 background, #000 text, 999px radius, 12px 24px padding, 15px system-ui 600 with a download icon. Appears at key conversion moments (hero floating, dark section). The yellow-against-dark contrast makes it the most attention-grabbing element on dark backgrounds.

### Dark Ghost Button
**Role:** Secondary action on dark backgrounds

Transparent or #05010d background, white text, 1px white-at-low-opacity border, 999px radius, 12px 24px padding, 15px system-ui 500 with a phone icon. Used alongside the Amber Download button in the dark section as the quieter companion action.

### Display Headline
**Role:** Hero and section headlines

56px system-ui 700, -1.4px letter-spacing, line-height 1.00, color #000 on light surfaces or #fff on dark. Sentence-case or title-case. The tight tracking and full line-height-to-font-size ratio make the headline feel like one block of type rather than wrapped text — like a gate-change announcement.

### Section Subheadline
**Role:** Supporting paragraph text

17px system-ui 400, -0.17px tracking, line-height 1.50, color #333 (Carbon) on light or #cfcfcf on dark. Centered or left-aligned. Generous line-height gives it a reading-optimized feel despite the compact density of surrounding UI.

### Award Badge Pair
**Role:** Social proof indicator

Horizontal pair of small pill-shaped badges, each ~40px tall with 999px radius. Left badge: white background, black text 'Apple Design Award · Winner 2023' with a small Apple logo icon. Right badge: blue gradient or solid blue background, white text 'App of the Year · Finalist 2023' with a small App Store icon. Sized as supporting evidence, not as primary content.

### Phone Mockup Frame
**Role:** Product showcase container

Large central element holding a realistic phone render showing the Flighty app interface. The phone sits in a realistic hand photograph with natural skin tones. The frame itself has no border or shadow — the photographic context provides all the depth. Sized at roughly 350-400px wide on desktop.

### Floating Notification Card
**Role:** Live-data product demonstration

The signature component. White (#ffffff) background, 20px border-radius, subtle multi-layer shadow at 0.02-0.04 opacity, 16px padding. Contains: a small icon or avatar (24-32px), a bold 15px headline in #000 ('Mom landed in New York', 'Check in is now open'), and muted 13px metadata in #737373 ('6:32am (22m early) and ↓ 88°', 'You can check-in at delta.com'). Cards are positioned around the phone at slight rotations (-3° to +3°) to feel scattered, not gridded. Some cards use a left border accent in #007bff, #d92d20, or #f7be00 to indicate status.

### Press Logo Card
**Role:** Media credibility grid

Each press logo sits in a #05010d or near-black card with 1px white-at-8% border, 12px or 16px border-radius, generous internal padding (40-60px vertical). Logo marks are rendered in white or light gray at ~60% opacity. Arranged in a 4-column grid (4×2) with 10-16px gaps. The cards are flat — no shadows — so they read as tiles on the dark surface, not as floating elements.

### Section Divider Band
**Role:** Light-to-dark page transition

Full-width bands that shift the page from white canvas to #0d0021 Deep Indigo. No hard border — the transition is seamless, using the deep-indigo background to envelop the next section. Headlines within these bands switch to white at the same 56px / 32px scale, maintaining typographic continuity across the theme change.

## Do's and Don'ts

### Do
- Use system-ui at 400-700 weights — never introduce a custom sans-serif for body or UI text
- Set display headlines at 56px system-ui 700 with -1.4px letter-spacing and line-height 1.00 — the tight tracking and full line-height are the announcement-board voice
- Use #007bff only for the single most important action on any given surface — never for decoration, tags, or secondary buttons
- Use #f7be00 exclusively for the download conversion moment — pair it with a download icon and dark surroundings for maximum signal
- Apply 999px radius to all buttons, tags, nav elements, and icon containers — the pill shape is the system default, not an option
- Position notification cards at slight rotations (-3° to +3°) around product mockups with 20px radius and whisper-thin shadows to create the scattered, real-time feel
- Transition between light and dark sections seamlessly — use #0d0021 as the dark canvas and keep the same type scale; only swap the color token

### Don't
- Don't add drop shadows heavier than the 0.02-0.04 opacity system — heavy shadows break the flat, departure-board aesthetic
- Don't use #007bff or #f7be00 for text, borders, or backgrounds other than their specific action roles — these are signal colors, not brand washes
- Don't introduce a second sans-serif typeface — system-ui covers the full range from caption to display
- Don't use sharp corners (0-4px radius) on cards, buttons, or containers — the minimum card radius in this system is 8px, the default is 16-20px
- Don't place colored borders or backgrounds on body text — keep #000 or #333 for text on light, #fff or #cfcfcf on dark
- Don't crowd sections — even with compact density, maintain 64-80px section gaps to let the large headlines breathe
- Don't use the #d92d20 red decoratively — it is a functional alert color for cancellations and critical delays, nothing else

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Light Canvas | `#ffffff` | Page background in light sections — the departure-board white |
| 1 | Linen Card | `#faf8f7` | Alternate light surface — subtle warm shift for nested cards |
| 2 | Silver Divider | `#cfcfcf` | Hairline borders and very light tonal bands |
| 3 | Deep Indigo | `#0d0021` | Dark section canvas — the control-room background |
| 4 | Midnight Ink | `#05010d` | Darkest surface — card backgrounds floating on the indigo |

## Elevation

- **Floating notification card:** `0px 0px 0px 1px rgba(0,0,0,0.04), 0px 1px 1px 0.5px rgba(0,0,0,0.02), 0px 3px 3px 1.5px rgba(0,0,0,0.02), 0px 6px 6px -3px rgba(0,0,0,0.02), 0px 12px 12px -6px rgba(0,0,0,0.02), 0px 24px 24px -12px rgba(0,0,0,0.02)`
- **Standard card:** `0px 0px 0px 1px rgba(0,0,0,0.04), 0px 1px 1px 0.5px rgba(0,0,0,0.02), 0px 3px 3px 1.5px rgba(0,0,0,0.02), 0px 6px 6px -3px rgba(0,0,0,0.02), 0px 12px 12px -6px rgba(0,0,0,0.02), 0px 24px 24px -12px rgba(0,0,0,0.02)`
- **Navigation pill:** `0px 1px 1px 0.5px rgba(0,0,0,0.03), 0px 3px 3px 1.5px rgba(0,0,0,0.03), 0px 6px 6px -3px rgba(0,0,0,0.03), 0px 12px 12px -6px rgba(0,0,0,0.03), 0px 24px 24px -12px rgba(0,0,0,0.03)`
- **Press logo card:** `1px solid rgba(255,255,255,0.08), no shadow — flat with hairline border`

## Imagery

Product photography dominates: a large realistic phone render held in a human hand, photographed in natural light with visible skin texture and finger positioning — the hand is not staged flat, it has grip and dimensionality. Around the phone, floating UI notification cards (rendered, not photographed) orbit the device at slight angles, showing real flight data: gate changes, check-in openings, delay alerts, landing confirmations. No lifestyle photography of airports, planes, or travelers. The press section uses monochrome logo marks (CNBC, CNN, Fox News, WSJ, Inc., Business Insider, TechCrunch, The Verge) rendered in white/light gray on dark cards — no brand-color treatment. The visual language is product-first: the app and its data ARE the imagery, not supplementary decoration.

## Layout

The page is a scrolling narrative that alternates between two surface modes: a light departure-board mode (white canvas, centered content) and a dark control-room mode (#0d0021 canvas, centered content). The hero is full-width white with a centered headline stack, centered subtext, centered award badges, and a large phone mockup flanked by scattered notification cards. Sections are separated by seamless background-color transitions rather than visible dividers. Content is consistently center-aligned on a max-width ~1200px column. The dark section features a phone-in-hand at scale, then transitions to a press-logo grid (4 columns × 2 rows) followed by a left-aligned text block. Navigation is a floating pill at the top, not a full-width bar. The rhythm is: white hero → dark product showcase → dark press credibility → dark text closer. There are no sidebar or multi-column layouts — everything is single-column, centered, with the product imagery providing the only lateral content.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #000000
- text (secondary): #333333
- background (light): #ffffff
- background (dark): #0d0021
- border: #cfcfcf (light) / rgba(255,255,255,0.08) (dark)
- accent: #f7be00
- primary action: #007bff (filled action)

**Example Component Prompts**
1. Create a hero section: #ffffff background. Headline at 56px system-ui weight 700, #000000, letter-spacing -1.4px, line-height 1.00. Subtext at 17px system-ui weight 400, #333333, letter-spacing -0.17px, line-height 1.50, centered. Amber Download button (#f7be00 fill, #000 text, 999px radius, 12px 24px padding, 15px system-ui weight 600) with a download icon.
2. Create a floating notification card: #ffffff background, 20px border-radius, 16px padding, whisper-thin shadow stack (0.02-0.04 opacity layers). Bold 15px system-ui weight 600 #000000 headline, muted 13px system-ui weight 400 #737373 metadata below, optional 3px left border in #007bff or #d92d20 for status.
3. Create a press logo grid: 4-column grid on #0d0021 background, 10-16px gaps. Each logo sits in a #05010d card with 1px rgba(255,255,255,0.08) border, 16px border-radius, 40-60px vertical padding, logo rendered in white at ~60% opacity.
4. Create a dark section headline: 56px system-ui weight 700 #ffffff on #0d0021 background, letter-spacing -1.4px, line-height 1.00, centered. Subtext at 17px system-ui weight 400 #cfcfcf, line-height 1.50, centered.
5. Create a floating navigation pill: #ffffff background, 999px radius, 8px 16px internal padding, subtle shadow stack. Logo mark on left, menu items (15px system-ui weight 500 #000) in the center, ghost 'Get the app' button (transparent fill, 1px #000-at-50% border, 999px radius, phone icon) on the right.

## Gradient System

Two gradients define the dark-mode atmosphere: a diagonal indigo-to-near-black wash (linear-gradient(171deg, rgb(97,97,112) -45%, rgb(18,18,140) 69%)) for subtle surface modulation, and a radial deep-violet pulse (linear-gradient(180deg, rgb(18,0,54) 0%, rgb(37,1,96) 51%, rgb(18,0,54) 100%)) that creates a glowing centerpoint behind the phone mockup in dark sections. Gradients are atmospheric, not decorative — they should suggest light emanating from a screen, not be visible as gradient patterns.

## Similar Brands

- **Apple Product Pages** — Same hero-with-headline-over-product pattern, same light-to-product-showcase rhythm, same heavy display typography with tight tracking
- **Things 3 (Cultured Code)** — Same app-in-hand photography style with product UI rendered around the device, same restrained color palette with one accent for action
- **Linear** — Same compact density, same preference for hairline borders over heavy shadows, same system-font typography approach with tight letter-spacing on display sizes
- **Arc Browser** — Same floating UI elements orbiting a central product, same playful scattering of notification-like cards, same dark-mode depth with glowing accent colors
- **Vercel** — Same minimal navigation (floating pill rather than full bar), same transition from light marketing surface to dark product surface, same ultra-subtle shadow approach

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #007bff;
  --color-amber-alert: #f7be00;
  --color-deep-indigo: #0d0021;
  --color-midnight-ink: #05010d;
  --color-pure-white: #ffffff;
  --color-pure-black: #000000;
  --color-carbon: #333333;
  --color-slate: #595959;
  --color-steel: #737373;
  --color-fog: #808080;
  --color-silver: #cfcfcf;
  --color-linen: #faf8f7;
  --color-ash: #89898e;
  --color-alert-red: #d92d20;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text-regular: 'SF Pro Text Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text-semibold: 'SF Pro Text Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-indie-flower: 'Indie Flower', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.55px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.8px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 35.1px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 70px;
  --radius-full-3: 99px;
  --radius-full-4: 999px;
  --radius-full-5: 9999px;

  /* Named Radii */
  --radius-nav: 999px;
  --radius-tags: 999px;
  --radius-cards: 16px;
  --radius-icons: 999px;
  --radius-inputs: 12px;
  --radius-buttons: 999px;
  --radius-floatingcards: 20px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.03) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.03) 0px 6px 6px -3px, rgba(0, 0, 0, 0.03) 0px 12px 12px -6px, rgba(0, 0, 0, 0.03) 0px 24px 24px -12px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.19) 0px 1px 2px 0px;
  --shadow-subtle-5: rgba(0, 0, 0, 0.03) 0px 159px 3px 10px, rgba(0, 0, 0, 0.1) 0px 89px 54px 5px, rgba(0, 0, 0, 0.17) 0px 40px 40px 0px, rgba(0, 0, 0, 0.19) 0px 10px 22px 0px;

  /* Surfaces */
  --surface-light-canvas: #ffffff;
  --surface-linen-card: #faf8f7;
  --surface-silver-divider: #cfcfcf;
  --surface-deep-indigo: #0d0021;
  --surface-midnight-ink: #05010d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #007bff;
  --color-amber-alert: #f7be00;
  --color-deep-indigo: #0d0021;
  --color-midnight-ink: #05010d;
  --color-pure-white: #ffffff;
  --color-pure-black: #000000;
  --color-carbon: #333333;
  --color-slate: #595959;
  --color-steel: #737373;
  --color-fog: #808080;
  --color-silver: #cfcfcf;
  --color-linen: #faf8f7;
  --color-ash: #89898e;
  --color-alert-red: #d92d20;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text-regular: 'SF Pro Text Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text-semibold: 'SF Pro Text Semibold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-indie-flower: 'Indie Flower', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.55px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.8px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 35.1px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 70px;
  --radius-full-3: 99px;
  --radius-full-4: 999px;
  --radius-full-5: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.03) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.03) 0px 6px 6px -3px, rgba(0, 0, 0, 0.03) 0px 12px 12px -6px, rgba(0, 0, 0, 0.03) 0px 24px 24px -12px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.19) 0px 1px 2px 0px;
  --shadow-subtle-5: rgba(0, 0, 0, 0.03) 0px 159px 3px 10px, rgba(0, 0, 0, 0.1) 0px 89px 54px 5px, rgba(0, 0, 0, 0.17) 0px 40px 40px 0px, rgba(0, 0, 0, 0.19) 0px 10px 22px 0px;
}
```
