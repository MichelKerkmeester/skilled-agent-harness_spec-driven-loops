# Zora — Style Reference
> Neon gallery on graphite glass.\n\n{

**Theme:** light

Zora operates as a stark digital gallery: a near-monochrome canvas where only neon-grade color earns screen space. The interface is ruthlessly compact — 11–17px type, 4–8px gaps, pill-shaped controls — letting the artwork carry visual weight while the chrome recedes. MonumentGrotesk's geometric neutrality, set tight at -0.015em, reads more like UI labels than prose, reinforcing a tool-like, transactional posture. Color appears as deliberate shock: one radioactive green for purchase actions, one hot pink for secondary emphasis, and otherwise pure grayscale. Elevation is suppressed; cards sit flat with hairline edges rather than shadow stacks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#121212` | `--color-void-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Graphite | `#4d4d4d` | `--color-graphite` | Secondary text, body copy, icons, nav labels, metadata |
| Fog Gray | `#878787` | `--color-fog-gray` | Muted helper text, tertiary metadata, inactive icon strokes |
| Ash | `#cacaca` | `--color-ash` | Placeholder text, light borders, disabled strokes |
| Hairline | `#e6e6e6` | `--color-hairline` | Input borders, dividers, subtle separators |
| Pure White | `#ffffff` | `--color-pure-white` | Canvas background, card surfaces, button text on dark fills |
| Reactor Green | `#00df00` | `--color-reactor-green` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Voltage Pink | `#ff00f0` | `--color-voltage-pink` | Secondary accent for live indicators, countdown timers, hot tags, creator highlights |
| Onyx | `#000000` | `--color-onyx` | Icon fills, logo mark, maximum-contrast text on light backgrounds |

## Tokens — Typography

### MonumentGrotesk — Sole typeface across all UI: nav labels, body text, button text, metadata, card titles. The custom geometric grotesque's compressed forms and uniform 410–500 weights create a label-density voice rather than a reading voice; it treats copy as UI chrome, not as prose. No display-weight contrast is used — hierarchy is achieved through size and color, not weight amplitude. · `--font-monumentgrotesk`
- **Substitute:** Inter, Geist, or Space Grotesk at 400/500/600
- **Weights:** 410, 450, 500, 600
- **Sizes:** 11px, 13px, 15px, 16px, 17px
- **Line height:** 1.09–1.41
- **Letter spacing:** -0.015em (consistent across all sizes — tight tracking reinforces the compact, utility-driven rhythm)
- **OpenType features:** `\"ss01\" on, \"cv11\" on (if available in substitute)`
- **Role:** Sole typeface across all UI: nav labels, body text, button text, metadata, card titles. The custom geometric grotesque's compressed forms and uniform 410–500 weights create a label-density voice rather than a reading voice; it treats copy as UI chrome, not as prose. No display-weight contrast is used — hierarchy is achieved through size and color, not weight amplitude.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.25 | — | `--text-caption` |
| body-sm | 13px | 1.25 | — | `--text-body-sm` |
| body | 15px | 1.25 | — | `--text-body` |
| body-lg | 16px | 1.25 | — | `--text-body-lg` |
| heading-sm | 17px | 1.25 | — | `--text-heading-sm` |

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

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| badges | 999px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `oklch(0.880331 0.276486 138.811 / 0.75) -4px 0px 8px 0px,...` | `--shadow-sm` |
| md | `rgba(0, 0, 0, 0.05) 0px 5px 10px 0px, rgba(0, 0, 0, 0.07)...` | `--shadow-md` |

### Layout

- **Section gap:** 24px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Buy Button (Primary Action)
**Role:** Purchase CTA on every collectible card

Background #00df00, text #121212 at 15px MonumentGrotesk weight 500, padding 10px 16px, border-radius 8px. No shadow. The radioactive green is the only fill color in the system that isn't grayscale; it makes the transaction unmistakable against the monochrome feed. Letter-spacing -0.015em.

### Sign Up Button (Dark Fill)
**Role:** Account creation in top-right header

Background #121212, text #ffffff at 13px MonumentGrotesk weight 500, padding 8px 16px, border-radius 8px. The dark inverted counterpart to the green Buy button; serves the secondary auth action.

### Log In Button (Ghost)
**Role:** Returning-user entry in top-right header

Transparent background, text #121212 at 13px MonumentGrotesk weight 500, padding 8px 16px, no border, border-radius 8px. Sits to the left of the Sign Up button with minimal visual weight.

### Follow Button (Pill Outline)
**Role:** Subscribe to a creator in the right rail

Background #121212, text #ffffff at 13px MonumentGrotesk weight 500, padding 8px 16px, border-radius 9999px. Fully pill-shaped. Inverted dark fill against the white card.

### Collectible Card (Feed Post)
**Role:** Primary content unit in the center feed

Flat white surface, no shadow, border-radius 12px. Contains: creator header row (avatar 32px circular + name + timestamp), 1:1 or 4:5 media fill, action bar (heart, comment, share icons in #4d4d4d), title at 15px weight 500 #121212, Buy button right-aligned. Cards stack vertically with 12–16px gap; separated by #e6e6e6 hairlines.

### Left Navigation Rail
**Role:** Persistent icon-based navigation column

Fixed 56px-wide left column, icons only (no labels), vertically centered, 24px vertical gap between icons. Icon color #4d4d4d default, #121212 active. A circular avatar sits at the top; a hamburger menu at the bottom. Background white, no border.

### Top Search Bar
**Role:** Global search/command input

Centered in the top bar, ~480px wide, 8px border-radius, background #ffffff, border #e6e6e6 1px. Placeholder 'Search' in #cacaca. Left-aligned search icon in #878787. No visible focus ring — relies on border color shift.

### Suggested Follows Panel
**Role:** Right-rail discovery unit

Header 'Suggested follows' at 13px weight 600 #121212, three rows of avatar + username + Follow button. Avatars 40px circular. Buttons are dark pill (#121212 bg, white text, 9999px radius). No card container — sits directly on canvas with internal spacing.

### Price/Timer Bar
**Role:** Live auction status on collectible cards

Horizontal bar beneath media showing current bid in #121212 at 15px weight 500, countdown timer in #ff00f0 at 15px weight 500 (right-aligned). Thin #e6e6e6 top border separates from media.

### QR Code CTA Widget
**Role:** App-download prompt overlay bottom-right

Fixed position card, white background, 12px border-radius, 1px #e6e6e6 border. Contains a QR code, 'Get the App' header at 13px weight 600, 'Learn More' link in #4d4d4d. No shadow.

### Comment Input Field
**Role:** Inline comment composer on each card

Borderless or #e6e6e6 1px border, 8px border-radius, placeholder 'Add a comment...' in #cacaca at 15px. No visible label. Sits below the action bar with 8px gap.

### Zora Logo Mark
**Role:** Brand identifier in bottom-left corner

Wordmark 'Zora' in MonumentGrotesk weight 500 at 15px #4d4d4d. Unobtrusive, anchored to the page corner. No logo symbol — pure typographic mark.

## Do's and Don'ts

### Do
- Use #00df00 exclusively for purchase/buy actions — never for decoration, tags, or non-transactional UI
- Set all text at -0.015em letter-spacing; the tight tracking is part of the system's visual identity, not optional
- Keep card padding at 12px and element gaps at 8px or 4px — the compact density is intentional, not cramped
- Use 9999px border-radius for all social actions (Follow) and 8px for transactional actions (Buy, Log In) — the radius difference signals intent
- Reserve #ff00f0 for time-sensitive or live-status indicators (countdown timers, live auctions, real-time pulses)
- Place all navigation icons in a persistent 56px left rail with no labels — icon-only navigation is part of the gallery-tool language
- Use MonumentGrotesk weight 500 for all interactive elements and weight 410/450 for body metadata to create subtle hierarchy without weight contrast

### Don't
- Don't add shadows to cards — surfaces sit flat against the canvas, elevation is expressed by background contrast only
- Don't introduce additional accent colors beyond #00df00 and #ff00f0 — the two-color neon system is deliberately limited
- Don't use weights above 600 — the type system is calibrated for label density, not editorial display
- Don't center-align body text or card titles — left-align everything except hero headlines
- Don't use border-radius values other than 8px (buttons/inputs), 12px (cards), or 9999px (pills) — mixing radii breaks the system
- Don't add gradients to UI chrome — the gray gradient is reserved for skeleton/loading states only
- Don't use color to indicate state on form inputs — use border color shift (#cacaca → #121212) instead of fills

## Elevation

- **QR Code Download Widget:** `rgba(0, 0, 0, 0.05) 0px 5px 10px 0px, rgba(0, 0, 0, 0.07) 0px 15px 25px 0px`
- **Featured Element Glow (rare):** `oklch(0.880331 0.276486 138.811 / 0.75) -4px 0px 8px 0px, oklch(0.880331 0.276486 138.811 / 0.97) 4px 0px 8px 0px`

## Imagery

The visual language is image-first: the product IS imagery. Collectible media (photography, 3D renders, digital art, fashion editorials) fills square or portrait cards at full bleed with no frame or padding. Images are presented raw and uncropped, treated as gallery objects rather than marketing content. The surrounding UI recedes into near-invisibility — grayscale chrome, no decorative graphics, no lifestyle photography, no illustration. The only non-photographic visuals are UI icons (thin-line, monochrome, ~20px) and a single sphere logo at top-left. The aesthetic borrows from contemporary art platforms: the object is the content, the frame is invisible.

## Layout

Three-column desktop layout with a fixed 56px left icon rail, a fluid-width center feed (~600px content width), and a ~280px right discovery panel. The top bar is minimal: logo or search centered, auth actions right-aligned, no traditional nav links. The center feed is a single vertical column of full-width collectible cards stacking at 12–16px intervals. No hero section, no banner, no carousel — the feed IS the homepage. Navigation is icon-only and persistent. On mobile, the left rail and right panel collapse; the feed becomes the sole column. The overall density is gallery-tight: every pixel earns its place, breathing room is minimal, and visual hierarchy comes from image size and accent color rather than whitespace.

## Agent Prompt Guide

## Quick Color Reference\n- text: #121212\n- background: #ffffff\n- border: #e6e6e6\n- accent: #ff00f0 (secondary, for live/timer states)\n- primary action: no distinct CTA color

## Elevation Philosophy

Zora deliberately suppresses elevation. Cards sit flush against the white canvas with zero shadow or border definition — their boundaries are implied by the media content and action bar, not by visual framing. The only shadows in the system appear on the QR download widget and on a rare green-glow effect (oklch green tinted shadow) on featured elements, both at extremely low frequency. This is a gallery-influenced choice: the artwork should feel mounted on a wall, not floating in a UI. Depth is communicated through z-index stacking and the fixed left rail's implied permanence, not through drop shadows.

## Similar Brands

- **Foundation** — Same ultra-minimalist NFT marketplace aesthetic: flat cards, grayscale chrome, single vivid accent for buy actions, icon-only navigation
- **Sound.xyz** — Compact label-density typography, pill-shaped action buttons, near-monochrome palette with one neon accent for the primary transaction
- **Farcaster / Warpcast** — Three-column social feed layout (nav rail + center feed + right discovery), tight typographic rhythm, and the deliberate use of one bright accent color against a grayscale field
- **Are.na** — Gallery-first content presentation: imagery fills frames edge-to-edge, UI chrome is nearly invisible, no decorative graphics or marketing visuals compete with the content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #121212;
  --color-graphite: #4d4d4d;
  --color-fog-gray: #878787;
  --color-ash: #cacaca;
  --color-hairline: #e6e6e6;
  --color-pure-white: #ffffff;
  --color-reactor-green: #00df00;
  --color-voltage-pink: #ff00f0;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-monumentgrotesk: 'MonumentGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --text-body-sm: 13px;
  --leading-body-sm: 1.25;
  --text-body: 15px;
  --leading-body: 1.25;
  --text-body-lg: 16px;
  --leading-body-lg: 1.25;
  --text-heading-sm: 17px;
  --leading-heading-sm: 1.25;

  /* Typography — Weights */
  --font-weight-w410: 410;
  --font-weight-w450: 450;
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
  --spacing-36: 36px;

  /* Layout */
  --section-gap: 24px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-badges: 999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-sm: oklch(0.880331 0.276486 138.811 / 0.75) -4px 0px 8px 0px, oklch(0.880331 0.276486 138.811 / 0.97) 4px 0px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 5px 10px 0px, rgba(0, 0, 0, 0.07) 0px 15px 25px 0px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #121212;
  --color-graphite: #4d4d4d;
  --color-fog-gray: #878787;
  --color-ash: #cacaca;
  --color-hairline: #e6e6e6;
  --color-pure-white: #ffffff;
  --color-reactor-green: #00df00;
  --color-voltage-pink: #ff00f0;
  --color-onyx: #000000;

  /* Typography */
  --font-monumentgrotesk: 'MonumentGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --text-body-sm: 13px;
  --leading-body-sm: 1.25;
  --text-body: 15px;
  --leading-body: 1.25;
  --text-body-lg: 16px;
  --leading-body-lg: 1.25;
  --text-heading-sm: 17px;
  --leading-heading-sm: 1.25;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-sm: oklch(0.880331 0.276486 138.811 / 0.75) -4px 0px 8px 0px, oklch(0.880331 0.276486 138.811 / 0.97) 4px 0px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 5px 10px 0px, rgba(0, 0, 0, 0.07) 0px 15px 25px 0px;
}
```
