# Solana — Style Reference
> neon aurora in a midnight void — flowing magenta and violet ribbons suspended against pure black

**Theme:** dark

Solana operates in a midnight void: a near-black canvas punctuated by flowing neon aurora graphics in violet, magenta, and green. The system is deliberately monochromatic — white and warm-gray typography carry all communication weight, while the only chromatic presence comes from the brand's signature flowing wave illustrations, never from interface chrome. Components are whisper-thin: 1px hairline borders, pill-shaped controls at 9999px radius, and cards that float on barely-distinguishable dark surfaces. The custom Diatype typeface, with its tightly negative letter-spacing that tightens further at display sizes, gives every headline a compressed, futuristic confidence. Buttons achieve a subtle 3D embossed effect through a layered shadow stack that pairs a soft drop shadow with inset white highlights — the chrome looks pressed into the surface rather than floating above it. Density is comfortable, never packed; the page breathes with generous section gaps and lets the aurora graphics do the visual heavy lifting.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, deepest background layer — the void against which everything else floats |
| Obsidian | `#0d0c11` | `--color-obsidian` | Card surfaces, elevated panels — a barely-perceptible warm purple-black lift from the canvas |
| Charcoal Press | `#121212` | `--color-charcoal-press` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Onyx | `#12151d` | `--color-onyx` | Navigation bar background, sticky header surface |
| Smoke | `#050505` | `--color-smoke` | Secondary canvas tone, gradient terminus — the deepest non-pure-black |
| Graphite | `#3e3c41` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Ash | `#848895` | `--color-ash` | Muted text, secondary navigation labels, icon strokes in resting state |
| Fog | `#ababba` | `--color-fog` | Body text, descriptions, secondary copy — warm gray that softens white's intensity |
| Bone White | `#ffffff` | `--color-bone-white` | Primary headings, high-emphasis text, icon fills, reversed button text |
| Hairline | `#eaecf0` | `--color-hairline` | Ultra-subtle borders at low opacity — defines card edges and input fields against the void |

## Tokens — Typography

### Diatype — Primary typeface for all UI — body text, headings, buttons, navigation. The geometric, slightly condensed forms paired with aggressively negative letter-spacing give every line a compressed, technical authority. Weight 300 for display headlines creates a whisper-confident tone; weight 400 for body; weight 500 for emphasis. Letter-spacing tightens proportionally: -0.04em at display sizes, -0.01em at body sizes. · `--font-diatype`
- **Substitute:** Inter, Geist, Satoshi
- **Weights:** 300, 400, 500
- **Sizes:** 16, 18, 20, 21, 24, 28, 36, 40, 64, 88
- **Line height:** 1.00–1.56
- **Letter spacing:** -0.04em at 88px, -0.03em at 40-64px, -0.02em at 24-36px, -0.01em at 16-21px
- **Role:** Primary typeface for all UI — body text, headings, buttons, navigation. The geometric, slightly condensed forms paired with aggressively negative letter-spacing give every line a compressed, technical authority. Weight 300 for display headlines creates a whisper-confident tone; weight 400 for body; weight 500 for emphasis. Letter-spacing tightens proportionally: -0.04em at display sizes, -0.01em at body sizes.

### DSemi — Reserved for the Solana wordmark and select nav micro-labels at 12-14px. The heavy weight at micro sizes acts as a brand signature — a condensed monospaced bold that contrasts Diatype's lighter geometric forms. · `--font-dsemi`
- **Substitute:** JetBrains Mono Bold, Space Mono Bold
- **Weights:** 700
- **Sizes:** 12, 14
- **Line height:** 1.14, 1.33
- **Role:** Reserved for the Solana wordmark and select nav micro-labels at 12-14px. The heavy weight at micro sizes acts as a brand signature — a condensed monospaced bold that contrasts Diatype's lighter geometric forms.

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 21px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.14px | `--text-body-sm` |
| body | 16px | 1.56 | -0.16px | `--text-body` |
| body-lg | 18px | 1.5 | -0.18px | `--text-body-lg` |
| subheading | 21px | 1.4 | -0.21px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.48px | `--text-heading-sm` |
| heading | 36px | 1.22 | -1.08px | `--text-heading` |
| heading-lg | 64px | 1.13 | -2.56px | `--text-heading-lg` |
| display | 88px | 1 | -3.52px | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 12px |
| badges | 9999px |
| inputs | 12px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.17) 0px 2px 4px 1px, rgba(255, 255, 255, ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Primary Button
**Role:** Primary action trigger

9999px border-radius (full pill). Background #121212 with the signature embossed shadow stack. Text: Diatype 16px weight 500, #ffffff. Padding: 10px 20px. Includes a leading icon (arrow/triangle) before the label. The inset white highlights make the pill look like it catches light from above.

### Pill Ghost Button
**Role:** Secondary action, view-all links

9999px border-radius. Transparent or #0d0c11 background with #eaecf0 border at low opacity. Text: Diatype 14-16px weight 400, #ababba or #ffffff. Padding: 8px 20px. Used for less prominent actions like 'View all'.

### Carousel Arrow Button
**Role:** Horizontal scroll navigation

Circular button (9999px radius), ~40px diameter. #121212 background with #eaecf0 border. Contains a left/right chevron in #ababba. Shadow-less — sits flat on the surface.

### Navigation Bar
**Role:** Persistent site header

Full-width sticky bar at #12151d background. Left: Solana wordmark (DSemi 14px weight 700, #ffffff) with the triple-bar logo mark. Center: nav links (Diatype 14px weight 400, #ababba) with chevron dropdowns. Right: search input, language selector. Padding: 12px 24px. Height ~56px.

### Search Input
**Role:** Global search and AI prompt

Rounded input with 12px radius. Background: #0d0c11. Border: 1px #eaecf0 at low opacity. Placeholder: 'Search or ask AI' in Diatype 14px #848895. Includes a keyboard shortcut badge ('⌘K') in the right corner. Padding: 8px 16px.

### Event Card
**Role:** Promotional content tile for conferences and hackathons

12px border-radius. Full-bleed gradient or photographic background. Contains overlaid event branding text in large display type, date, and location. No visible border — the card edge is defined by the imagery. Dimensions vary; typically 1:1.2 aspect ratio in horizontal carousels.

### Content Card
**Role:** Article or feature card

12px border-radius. Background: #0d0c11. Border: 1px #eaecf0 at very low opacity. Padding: 24px. Contains a small icon mark, headline (Diatype 24-28px weight 400, #ffffff), and optional body text in #ababba. No drop shadow — the border alone defines the edge.

### Partner Logo Strip
**Role:** Social proof and trust signals

Horizontal row of 6-8 partner logos (Western Union, Visa, Worldpay, Circle, PayPal, Fiserv). Logos rendered in their native brand colors or in #ababba monochrome. Centered, no dividers, generous spacing between logos.

### Hero Section
**Role:** Above-the-fold brand statement

Full-width dark canvas with the aurora gradient (linear-gradient black to #14001d). Left-aligned headline at 64-88px Diatype weight 300, #ffffff. Sub-text at 18px Diatype weight 400, #ababba. Primary pill button below. Flowing wave SVG graphics occupy the right 60% of the viewport, extending beyond the fold.

### Floating Chat Bubble
**Role:** AI assistant entry point

Fixed bottom-right element. Dark pill shape with #eaecf0 border. Solana logo mark + 'Ask AI' label in Diatype 14px #ffffff. Sits independently from the page flow — always visible regardless of scroll position.

### Section Heading
**Role:** Subsection title anchor

Diatype 40-64px weight 300, #ffffff. Two-line structure common (e.g., 'Meet Solana IRL. / Build connections.'). Left-aligned. No accompanying decorative element — relies on size and weight contrast for hierarchy.

## Do's and Don'ts

### Do
- Use the void black (#000000) as the base canvas for all pages — never introduce a light background section
- Apply Diatype weight 300 for all display and hero headlines; reserve weight 500 only for button labels and short emphasis runs
- Set border-radius to 9999px for every button, tag, and pill-shaped element — the pill is a brand signature
- Use the embossed button shadow stack (inset white highlights + soft drop shadow) on all primary actions to maintain the pressed-glass feel
- Reference the aurora gradient (black to #14001d) as the only acceptable canvas gradient — it creates depth for the wave graphics
- Keep all body and description text in #ababba Fog; reserve pure white exclusively for headings and high-emphasis labels
- Use 12px radius for cards and content containers, 4px for small UI elements — never default to 8px

### Don't
- Do not introduce a chromatic CTA color — all primary actions use the dark embossed pill with white text
- Do not use drop-shadow elevation on cards or panels; the system defines surface layers through background luminance shifts, not shadows
- Do not break the negative letter-spacing pattern at any size — tracking loosens the brand's compressed authority
- Do not use decorative gradients on UI components (buttons, cards, inputs) — gradients belong only in the hero aurora and event imagery
- Do not set border-radius to 0 or to common defaults like 8px on interactive elements; the radius scale is 4/12/9999 only
- Do not place light or white surfaces in the interface — the entire system lives in the void
- Do not use saturated colors for icons, badges, or status indicators; all functional UI is monochrome

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Base page canvas — the absolute background |
| 2 | Obsidian | `#0d0c11` | Card surfaces, content containers |
| 3 | Charcoal | `#121212` | Elevated buttons, hover-state surfaces |
| 4 | Onyx | `#12151d` | Sticky navigation, persistent UI chrome |

## Elevation

- **Pill Button:** `rgba(0, 0, 0, 0.17) 0px 2px 4px 1px, rgba(255, 255, 255, 0.29) 0px -4px 12px 0px inset, rgba(255, 255, 255, 0.4) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.2) 0px -1px 0px 0px inset`

## Imagery

The signature visual element is the flowing aurora wave: smooth, ribbon-like 3D curves in violet, magenta, and electric green that sweep horizontally across the hero canvas. These are rendered as soft, semi-transparent gradient meshes — not sharp line art — giving them a nebulous, atmospheric quality. Event cards feature full-bleed photographic and graphic composites with heavy gradient overlays. Partner logos appear in their native brand colors but small and contained. Product and protocol imagery is absent from the homepage; the aurora and event photography carry all visual weight.

## Layout

Full-bleed dark canvas, no max-width constraint on background color — content containers are max-width 1280px centered. Hero is left-aligned text occupying the left 40% with aurora wave graphics filling the right 60% and bleeding off-screen. Sections stack vertically with 80px gaps, alternating between black canvas and slightly elevated obsidian surfaces. Content blocks are 2-column or 3-column grids: event cards in horizontal carousels (3 visible at once with edge bleed), content cards in 2-up splits, partner logos in single horizontal rows. Navigation is a single sticky top bar at 56px height. No sidebar, no footer columns visible above the fold — the page prioritizes generous vertical breathing room over information density.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (headings), #ababba (body), #848895 (muted)
- background: #000000 (canvas), #0d0c11 (cards), #121212 (buttons)
- border: #eaecf0 (hairline, use at low opacity)
- accent: no distinct UI accent color — brand presence comes from aurora graphics, not interface chrome
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Create a hero section.* Full-width #000000 canvas with the aurora gradient (linear-gradient(0deg, #000000, #14001d)). Headline left-aligned at 88px Diatype weight 300, #ffffff, letter-spacing -3.52px. Sub-text at 18px Diatype weight 400, #ababba. Below: pill button — 9999px radius, #121212 background, white text 'Get started' at 16px weight 500, with the signature embossed shadow stack and a leading arrow icon. Right side: flowing violet-magenta-green wave SVG graphics filling 60% width.

2. *Create a content card.* 12px border-radius, #0d0c11 background, 1px #eaecf0 border at 8% opacity, 24px padding. Small triple-bar icon at top-left in #ababba. Headline at 28px Diatype weight 400, #ffffff. No drop shadow — the border alone defines the edge.

3. *Create a search input.* 12px border-radius, #0d0c11 background, 1px #eaecf0 border at 12% opacity. Placeholder 'Search or ask AI' in Diatype 14px #848895. Right-side keyboard badge '⌘K' in a 4px-radius sub-pill with #3e3c41 background. Padding: 8px 16px. Width: 240px.

4. *Create a navigation bar.* Full-width sticky, #12151d background, 56px height, 24px horizontal padding. Left: Solana wordmark (DSemi 14px weight 700) with triple-bar logo. Center: 5 nav links (Learn, Developers, Products, Network, Community) in Diatype 14px weight 400, #ababba, with chevron icons. Right: search input + language selector.

5. *Create an event card for a carousel.* 12px border-radius, no visible border. Background: a gradient composite image (photo of a cityscape with a violet-to-green gradient overlay). Overlaid text: event name at 40px Diatype weight 700 in white, date and location at 16px Diatype weight 400 in #ffffff at 80% opacity. Card aspect ratio 1:1.2, displayed in a horizontal scrolling row with edge bleed.

## Similar Brands

- **Polygon Labs** — Same dark-void canvas with flowing neon-purple wave graphics in the hero, and similarly compressed geometric sans-serif headlines at display sizes
- **Ethereum.org** — Dark theme with minimal UI chrome, white-only typography hierarchy, and large display headlines that dominate the viewport
- **Vercel** — Pure black canvas with high-contrast white type, ultra-thin hairline borders, and pill-shaped controls — same anti-decorative philosophy
- **Linear** — Near-identical typographic restraint: custom geometric sans-serif, aggressively negative letter-spacing at display sizes, dark elevated surfaces defined by background shifts rather than shadows
- **Stripe** — Similar gradient-based hero illustrations that create atmospheric depth without UI noise, and the same compressed weight-300 headline treatment at hero scale

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-obsidian: #0d0c11;
  --color-charcoal-press: #121212;
  --color-onyx: #12151d;
  --color-smoke: #050505;
  --color-graphite: #3e3c41;
  --color-ash: #848895;
  --color-fog: #ababba;
  --color-bone-white: #ffffff;
  --color-hairline: #eaecf0;

  /* Typography — Font Families */
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dsemi: 'DSemi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.18px;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.21px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.22;
  --tracking-heading: -1.08px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -2.56px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -3.52px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 12px;
  --radius-badges: 9999px;
  --radius-inputs: 12px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.17) 0px 2px 4px 1px, rgba(255, 255, 255, 0.29) 0px -4px 12px 0px inset, rgba(255, 255, 255, 0.4) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.2) 0px -1px 0px 0px inset;

  /* Surfaces */
  --surface-void: #000000;
  --surface-obsidian: #0d0c11;
  --surface-charcoal: #121212;
  --surface-onyx: #12151d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-obsidian: #0d0c11;
  --color-charcoal-press: #121212;
  --color-onyx: #12151d;
  --color-smoke: #050505;
  --color-graphite: #3e3c41;
  --color-ash: #848895;
  --color-fog: #ababba;
  --color-bone-white: #ffffff;
  --color-hairline: #eaecf0;

  /* Typography */
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dsemi: 'DSemi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.18px;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.21px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.22;
  --tracking-heading: -1.08px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -2.56px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -3.52px;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.17) 0px 2px 4px 1px, rgba(255, 255, 255, 0.29) 0px -4px 12px 0px inset, rgba(255, 255, 255, 0.4) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.2) 0px -1px 0px 0px inset;
}
```
