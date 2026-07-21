# Metaview — Style Reference
> Bioluminescent control room — a near-black instrument panel lit by a single living mint signal.

**Theme:** dark

Metaview is a dark-mode AI product surface — a near-black canvas tinted with the faintest green, typed in a geometric neo-grotesque at whisper-light weight, and punctuated by a single vivid mint that acts as a live signal for action and selection. The interface reads like an instrument panel for a recruiting agent: deep, controlled, and precise, with green used sparingly as a switch-on indicator for the primary CTA, active tabs, and a few brand glyphs. Components stay flat and low-elevation; the page gains its depth from a soft radial green bloom behind product mockups, not from drop shadows. Typography is airy and tight-tracked, and the only non-monochrome voice is that electric mint — it is the brand's heartbeat.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Forest | `#000a06` | `--color-deep-forest` | Page background, hero canvas, footer — near-black with a barely-perceptible green undertone that ties the surface to the mint accent |
| Pine Bark | `#0a1a14` | `--color-pine-bark` | Card and secondary surface background — sits one step above the canvas, used for product mockup containers, nested panels, and dark secondary buttons |
| Charcoal | `#161818` | `--color-charcoal` | Elevated card surface, modals, and overlaid containers — used when a component must visibly float above the Pine Bark layer |
| Abyssal Indigo | `#01051b` | `--color-abyssal-indigo` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text color on dark surfaces, inverted button text, icon strokes, and the dark-theme default for all reading copy |
| Ash Gray | `#5e6262` | `--color-ash-gray` | Muted body text, helper copy, and secondary descriptive text on dark surfaces |
| Smoke | `#828282` | `--color-smoke` | Tertiary text and subdued labels on dark surfaces |
| Silver | `#d9d9d9` | `--color-silver` | Light borders, dividers, and hairline rules on lighter or mid-tone surfaces |
| Pure Black | `#000000` | `--color-pure-black` | Maximum-contrast text, outline button borders, and the dark-side baseline that all neutrals are calibrated against |
| Electric Mint | `#7affb4` | `--color-electric-mint` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Mint Whisper | `#e3ffef` | `--color-mint-whisper` | Pale mint accent for decorative borders, outline strokes, and subtle highlight washes — the low-saturation companion to Electric Mint used when the full vivid tone would be too loud |
| Bioluminescent Bloom | `radial-gradient(circle, rgba(0, 100, 70, 0.4) 0%, rgba(0, 60, 40, 0.2) 30%, rgba(0, 30, 20, 0.08) 55%, rgba(0, 0, 0, 0) 75%)` | `--color-bioluminescent-bloom` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Pine-to-Abyss | `linear-gradient(rgb(15, 58, 43) 0%, rgb(0, 10, 7) 100%)` | `--color-pine-to-abyss` | Linear green-to-black wash used on secondary atmospheric blocks and footer transitions |

## Tokens — Typography

### Euclid Circular A — Sole UI typeface — used for headlines at 300 (the anti-convention whisper-weight that creates authority through restraint rather than volume), body at 400, nav and subheads at 500, and emphasis at 700. The geometric, open apertures feel engineered rather than literary, matching the agentic product voice. Tight negative tracking on display sizes and slight positive tracking on small text forms a clear two-zone rhythm: large text compresses, small text breathes. · `--font-euclid-circular-a`
- **Substitute:** Inter, DM Sans, or Space Grotesk
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12, 14, 15, 16, 18, 20, 22, 28, 36, 48, 68, 72
- **Line height:** 1.00, 1.04, 1.10, 1.12, 1.16, 1.20, 1.30, 1.34, 1.42, 1.48, 1.50, 1.60
- **Letter spacing:** −4.32px at 72px, −4.08px at 68px, −1.92px at 48px, −1.08px at 36px, −0.56px at 28px, −0.40px at 20px, −0.16px at 16px, 0.14px at 14px, 0.12px at 12px
- **Role:** Sole UI typeface — used for headlines at 300 (the anti-convention whisper-weight that creates authority through restraint rather than volume), body at 400, nav and subheads at 500, and emphasis at 700. The geometric, open apertures feel engineered rather than literary, matching the agentic product voice. Tight negative tracking on display sizes and slight positive tracking on small text forms a clear two-zone rhythm: large text compresses, small text breathes.

### Onsite SemiMono — Monospace companion for inline code, candidate count badges, data labels, and any numeric or technical micro-copy where tabular alignment matters · `--font-onsite-semimono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Geist Mono
- **Weights:** 400
- **Sizes:** 12, 16
- **Line height:** 1.48, 1.60
- **Letter spacing:** 0.01em
- **Role:** Monospace companion for inline code, candidate count badges, data labels, and any numeric or technical micro-copy where tabular alignment matters

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.48 | 0.12px | `--text-caption` |
| body-sm | 14px | 1.42 | 0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.34 | -0.4px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.56px | `--text-heading-sm` |
| heading | 36px | 1.16 | -1.08px | `--text-heading` |
| heading-lg | 48px | 1.1 | -1.92px | `--text-heading-lg` |
| display | 68px | 1.04 | -4.08px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| icons | 4px |
| badges | 100px |
| inputs | 8px |
| nested | 8px |
| buttons | 999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.02) 0px 3px 3px 0px, rgba(0, 0, 0, 0.01) ...` | `--shadow-subtle` |
| subtle-2 | `rgba(1, 5, 27, 0.06) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Primary Button
**Role:** Hero CTA and key conversion actions

Electric Mint #7affb4 fill, Deep Forest #000a06 text, 999px radius, 8px vertical × 16px horizontal padding, 14px weight 500. This is the only filled chromatic button in the system and the sole use of the full vivid mint.

### Outlined Ghost Button
**Role:** Secondary CTA paired with the primary

Transparent fill, 1px Paper White #ffffff border, Paper White text, 999px radius, 8px × 16px padding, 14px weight 500. Sits beside the mint pill as the always-available alternative action.

### Dark Secondary Button
**Role:** Tertiary actions in card and nav contexts

Pine Bark #0a1a14 fill, 1px Abyssal Indigo #01051b border, Paper White text, 16px radius, 8px × 16px padding. Used for in-card actions where a pill would be too playful.

### Top Navigation Bar
**Role:** Primary site navigation

Deep Forest #000a06 background, full-width, 80px tall. Left: wordmark logo. Center: nav links at 14px weight 500 in Paper White with 4px row gap. Right: text 'Sign in', outlined ghost 'Book a demo' button, mint pill 'Start for free' button. No drop shadow — the bar is defined by contrast against the section beneath it.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width band above the nav, Deep Forest background, centered single-line text at 14px weight 400 in Paper White with a right-arrow chevron. 8px vertical padding, no border.

### Hero Section
**Role:** Above-the-fold headline and primary conversion

Deep Forest canvas, max-width 1200px centered. Display headline at 68px weight 300, Paper White, letter-spacing -4.08px. Supporting paragraph at 18px weight 400, Ash Gray #5e6262, max 60ch. Two-button row: mint pill primary + ghost outlined secondary, 8px gap between them. 120px top padding from nav.

### Product Showcase Card
**Role:** Interactive product mockup container with atmospheric backdrop

Sits on a Bioluminescent Bloom radial gradient background. The card itself is Pine Bark #0a1a14 with 1px Abyssal Indigo border, 16px radius, 24px padding. Contains a left-side icon nav rail (60px wide) and a right-side chat interface panel. The gradient does the heavy lifting for visual weight — the card itself stays flat.

### Side Icon Nav Rail
**Role:** Product feature tab selector inside the mockup

Vertical stack of 4 items at 16px font size, weight 500. Active item has a Mint Whisper #e3ffef pill background and Paper White text; inactive items are Ash Gray text. 8px vertical gap between items, 4px radius for the active pill indicator.

### Chat Interface Panel
**Role:** Product input and response area

Pine Bark background with subtle inner border. Input field: 8px radius, Abyssal Indigo 1px border, 16px padding, 16px body text. Submit arrow button: circular, Paper White icon on Abyssal Indigo background. Below the input: avatar + brand wordmark, then assistant response text at 14px with candidate count rendered in Onsite SemiMono for emphasis.

### Tab Pill Group
**Role:** Inline context switcher for chat modes

Horizontal row of pill-shaped tabs, 100px radius. Active tab: Mint Whisper background, Deep Forest text. Inactive: transparent, Paper White text at 60% opacity. 12px font weight 500, 4px vertical × 12px horizontal padding. 4px gap between pills.

### Filter Bar
**Role:** Candidate status and filter controls

Horizontal row of segmented filter chips: 'All 32', 'Liked 0', 'Disliked 0'. Each chip is 28px tall, 12px font weight 500, Abyssal Indigo 1px border, 4px radius. Active count number rendered in Onsite SemiMono for tabular alignment.

### Feature Card
**Role:** Reusable card for feature grids and capability lists

Pine Bark #0a1a14 background, 1px Abyssal Indigo border, 16px radius, 24px padding. Icon at 24px in Electric Mint or Paper White at top-left. Heading at 20px weight 500, Paper White. Body at 16px weight 400, Ash Gray.

## Do's and Don'ts

### Do
- Use Electric Mint #7affb4 exclusively for the primary CTA pill, the active tab state, and live status indicators — never as a decorative fill, never as body text color.
- Set all headlines at weight 300 with tight negative tracking: -4.08px at 68px, -1.92px at 48px, -1.08px at 36px. The whisper-weight is the signature.
- Use 999px radius for all buttons and tab pills; 16px for all cards and containers; 8px for inputs and nested elements. Never mix radii within the same component family.
- Apply the Bioluminescent Bloom radial gradient as a full-bleed backdrop behind product mockup sections only — it is the page's breathing moment, not a general background.
- Render numeric data — candidate counts, metrics, IDs — in Onsite SemiMono at 12-16px for tabular alignment and technical credibility.
- Use Deep Forest #000a06 as the universal page background, stepping up to Pine Bark #0a1a14 for cards and Charcoal #161818 only for true overlays.
- Pair every mint pill CTA with a ghost outlined secondary button in the same row, separated by 8px gap — two-button rhythm is the default hero pattern.

### Don't
- Don't use weight 600 or 700 for display headlines — weight 300 is the anti-convention choice that defines the brand's quiet authority.
- Don't apply Electric Mint to large surfaces, section backgrounds, or body text — the vivid value loses its signaling power if it covers more than 5% of any screen.
- Don't use drop shadows for card elevation — use surface color stepping instead. The only acceptable shadow is the 1px inset hairline on the primary button.
- Don't introduce new accent colors or gradients. The system is bichromatic: dark neutrals plus mint. Any additional hue breaks the bioluminescent signal language.
- Don't use the mid-gray #5e6262 for anything above 16px — it is a body/muted text color, not a heading or label color.
- Don't round buttons to 16px or 8px — pill shapes at 999px are mandatory for all interactive elements. Sharp or soft-cornered buttons break the visual identity.
- Don't use light or white card surfaces on the dark canvas. All cards and panels must be Pine Bark #0a1a14 or Charcoal #161818 to maintain the dark-mode consistency.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000a06` | Page-level background for hero, sections, and footer |
| 1 | Card | `#0a1a14` | Product mockup containers, feature cards, nested panels |
| 2 | Elevated | `#161818` | Floating modals, overlaid containers, and popovers that must sit above the card layer |

## Elevation

- **Product Showcase Card:** `rgba(0, 0, 0, 0.02) 0px 3px 3px 0px, rgba(0, 0, 0, 0.01) 0px 7px 7px 0px, rgba(0, 0, 0, 0.01) 0px 14px 14px 0px, rgba(0, 0, 0, 0.01) 0px 25px 24px 0px`
- **Pill Primary Button:** `rgba(1, 5, 27, 0.06) 0px 0px 0px 1px inset`

## Imagery

The site is UI-dominant with product screenshots as the primary visual element — tight, full-bleed crops of the actual Metaview interface rendered inside Pine Bark containers. The signature decorative element is the Bioluminescent Bloom radial gradient: a green glow that fades to black, used exclusively behind product showcase sections to create depth without imagery. There is no lifestyle photography, no stock illustration, no 3D renders. Icons are line-style, 1.5-2px stroke, monocolor (Paper White or Electric Mint), geometric and utilitarian. The visual density is heavily product-first: text and interface mockups occupy roughly 80% of visible space, with the remaining 20% given to the green atmospheric gradient and generous negative space.

## Layout

Max-width 1200px centered content with full-bleed atmospheric sections. The page rhythm is: announcement bar → nav → dark hero (centered text, max-width headline, two-button row) → product showcase (green gradient backdrop spanning full viewport width, centered card at 1200px) → alternating content sections. Sections are separated by 80px vertical gaps with no visible dividers — the dark canvas flows seamlessly. The hero uses a centered single-column text stack rather than a split layout. Product mockup sections use a two-part internal grid: a narrow left rail (60px) for icon navigation and a wide right panel (fluid) for the main interface. No sidebar navigation, no mega-menus, no sticky behavior beyond the top nav.

## Agent Prompt Guide

Quick Color Reference:
- Background: #000a06 (Deep Forest)
- Card surface: #0a1a14 (Pine Bark)
- Text: #ffffff (Paper White)
- Muted text: #5e6262 (Ash Gray)
- Border: #01051b (Abyssal Indigo)
- primary action: #7affb4 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #7affb4 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a product showcase card on a Bioluminescent Bloom radial gradient backdrop: card has Pine Bark #0a1a14 background, 1px Abyssal Indigo #01051b border, 16px radius, 24px padding. Inside: left rail with 4 vertical icon-tab items (active item has Mint Whisper #e3ffef pill background, 4px radius), right panel with a chat input (8px radius, Abyssal border, 16px padding) and a circular submit button (Abyssal background, Paper White arrow icon).

3. Create a top navigation bar: Deep Forest #000a06 background, full-width, 80px height. Left: wordmark logo. Center: 5 nav links at 14px weight 500, Paper White, with 32px horizontal gap. Right: 'Sign in' text link, ghost outlined 'Book a demo' button (1px Paper White border, 999px radius), and Electric Mint pill 'Start for free' button (999px radius, Deep Forest text).

4. Create a feature card grid: 3-column grid with 24px gap. Each card: Pine Bark #0a1a14 background, 1px Abyssal Indigo border, 16px radius, 24px padding. 24px icon in Electric Mint at top. Heading at 20px weight 500, Paper White. Body at 16px weight 400, Ash Gray.

5. Create a filter bar: horizontal row of 3 segmented chips at 28px height, 4px radius, 1px Abyssal Indigo border, 12px font weight 500. Active chip has Mint Whisper #e3ffef background. Numeric counts rendered in Onsite SemiMono at 12px for alignment.

## Similar Brands

- **Linear** — Same dark-canvas + single vivid accent discipline, same whisper-weight geometric headline at large sizes, same flush component treatment with no decorative elevation
- **Vercel** — Near-black surface, tight negative tracking on display text, and a product-mockup-as-hero pattern where the UI screenshot carries the visual weight
- **Runway** — Dark-mode AI product surface with a single saturated accent used only for primary actions and live states, and product mockups as the dominant imagery
- **Anthropic** — Near-black backgrounds with restrained bichromatic accent system, geometric neo-grotesque at light weight, and a preference for atmosphere-through-gradient over photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-forest: #000a06;
  --color-pine-bark: #0a1a14;
  --color-charcoal: #161818;
  --color-abyssal-indigo: #01051b;
  --color-paper-white: #ffffff;
  --color-ash-gray: #5e6262;
  --color-smoke: #828282;
  --color-silver: #d9d9d9;
  --color-pure-black: #000000;
  --color-electric-mint: #7affb4;
  --color-mint-whisper: #e3ffef;
  --color-bioluminescent-bloom: #0a3a2b;
  --gradient-bioluminescent-bloom: radial-gradient(circle, rgba(0, 100, 70, 0.4) 0%, rgba(0, 60, 40, 0.2) 30%, rgba(0, 30, 20, 0.08) 55%, rgba(0, 0, 0, 0) 75%);
  --color-pine-to-abyss: #0f3a2b;
  --gradient-pine-to-abyss: linear-gradient(rgb(15, 58, 43) 0%, rgb(0, 10, 7) 100%);

  /* Typography — Font Families */
  --font-euclid-circular-a: 'Euclid Circular A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-onsite-semimono: 'Onsite SemiMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.48;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.42;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.34;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 36px;
  --leading-heading: 1.16;
  --tracking-heading: -1.08px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.92px;
  --text-display: 68px;
  --leading-display: 1.04;
  --tracking-display: -4.08px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;

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
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 100px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-icons: 4px;
  --radius-badges: 100px;
  --radius-inputs: 8px;
  --radius-nested: 8px;
  --radius-buttons: 999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.02) 0px 3px 3px 0px, rgba(0, 0, 0, 0.01) 0px 7px 7px 0px, rgba(0, 0, 0, 0.01) 0px 14px 14px 0px, rgba(0, 0, 0, 0.01) 0px 25px 24px 0px;
  --shadow-subtle-2: rgba(1, 5, 27, 0.06) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #000a06;
  --surface-card: #0a1a14;
  --surface-elevated: #161818;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-forest: #000a06;
  --color-pine-bark: #0a1a14;
  --color-charcoal: #161818;
  --color-abyssal-indigo: #01051b;
  --color-paper-white: #ffffff;
  --color-ash-gray: #5e6262;
  --color-smoke: #828282;
  --color-silver: #d9d9d9;
  --color-pure-black: #000000;
  --color-electric-mint: #7affb4;
  --color-mint-whisper: #e3ffef;
  --color-bioluminescent-bloom: #0a3a2b;
  --color-pine-to-abyss: #0f3a2b;

  /* Typography */
  --font-euclid-circular-a: 'Euclid Circular A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-onsite-semimono: 'Onsite SemiMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.48;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.42;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.34;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 36px;
  --leading-heading: 1.16;
  --tracking-heading: -1.08px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.92px;
  --text-display: 68px;
  --leading-display: 1.04;
  --tracking-display: -4.08px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 100px;
  --radius-full-2: 999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.02) 0px 3px 3px 0px, rgba(0, 0, 0, 0.01) 0px 7px 7px 0px, rgba(0, 0, 0, 0.01) 0px 14px 14px 0px, rgba(0, 0, 0, 0.01) 0px 25px 24px 0px;
  --shadow-subtle-2: rgba(1, 5, 27, 0.06) 0px 0px 0px 1px inset;
}
```
