# YouTube — Style Reference
> minimalist broadcast console

**Theme:** light

YouTube's interface is a content-first utility: a near-monochrome white canvas with a permanent left sidebar, minimal header chrome, and one blue accent that marks every interactive link. The design language is deliberately restrained — it doesn't compete with video thumbnails, it just gets out of the way. Typography is Roboto at compact functional sizes, with YouTube Sans reserved exclusively for the wordmark. Components are flat and utilitarian — pill-shaped buttons, hairline borders, and zero elevation. The signature black is #0f0f0f, not pure #000000, giving the entire interface a slightly softer, less aggressive feel while maintaining maximum contrast against white.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, sidebar background, card surfaces, input fills |
| YouTube Ink | `#0f0f0f` | `--color-youtube-ink` | Primary text, icon strokes, logo wordmark, button text — the near-black that defines the entire interface |
| Graphite | `#606060` | `--color-graphite` | Secondary text, metadata, timestamps, muted descriptions, nav secondary labels |
| Ash | `#909090` | `--color-ash` | Tertiary text, disabled states, inactive icon strokes, micro-copy |
| Mist | `#c6c6c6` | `--color-mist` | Hairline borders, inactive toggle tracks, subtle dividers |
| Silver | `#d3d3d3` | `--color-silver` | Button borders, input field outlines, card outlines — the structural divider |
| Signal Blue | `#065fd4` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Play Red | `#ff0000` | `--color-play-red` | Logo play triangle exclusively — the locked brand mark, never used as a functional UI color |

## Tokens — Typography

### Roboto — Primary interface font — nav labels, body copy, links, button text, metadata, timestamps. The 2.57 line-height on small sizes creates generous vertical breathing room for sidebar items. · `--font-roboto`
- **Substitute:** Inter, system-ui, -apple-system, sans-serif
- **Weights:** 400, 500, 700, 900
- **Sizes:** 10px, 12px, 13px, 14px, 16px
- **Line height:** 1.20, 1.38, 1.43, 1.50, 2.57
- **Role:** Primary interface font — nav labels, body copy, links, button text, metadata, timestamps. The 2.57 line-height on small sizes creates generous vertical breathing room for sidebar items.

### YouTube Sans — Wordmark only — the logo's custom typeface that makes 'YouTube' instantly recognizable. Never used for headings, body, or nav. · `--font-youtube-sans`
- **Weights:** 600
- **Sizes:** 20px
- **Line height:** 1.40
- **Role:** Wordmark only — the logo's custom typeface that makes 'YouTube' instantly recognizable. Never used for headings, body, or nav.

### Arial — System fallback for legacy components and button labels in older UI fragments · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** System fallback for legacy components and button labels in older UI fragments

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body-lg | 14px | 1.38 | — | `--text-body-lg` |
| heading | 20px | 1.4 | — | `--text-heading` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| icons | 10px |
| inputs | 18px |
| buttons | 18px |

### Layout

- **Section gap:** 24px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Sidebar Navigation
**Role:** Primary left-rail navigation with icon+label items

Fixed left column, 240px wide, #ffffff background. Items are 40px tall with 12px gap between groups. Active item uses #0f0f0f icon + text on a very light gray hover fill. Inactive items use #606060 for icon and text. Contains sections separated by 16px-24px vertical gaps: Main (Home, Shorts, Subscriptions, You, History), Explore (Music, Movies, Live, Show more), More from YouTube (channel links with 24px circular avatars), Footer (About, Press, Copyright).

### Outlined Sign In Button
**Role:** Outlined action button for account authentication

1px border in #065fd4, text in #065fd4, #ffffff fill, 18px border-radius (pill-shaped), padding 8px 16px. Font: Roboto 14px weight 500. An outlined chromatic action — not a filled CTA.

### Neutral Pill Button
**Role:** Secondary action button with no brand color

#ffffff fill with #d3d3d3 1px border, #0f0f0f text at Roboto 14px weight 500, 18px border-radius, padding 8px 16px. Used for 'Update setting' and other non-emphasis actions.

### Search Input
**Role:** Pill-shaped search field in the header

Border 1px #d3d3d3 on left side, 18px border-radius, height ~40px. Left section: 1px right border separator. Right section: search icon button with #f8f8f8 background, 0px left radius, 18px right radius. Placeholder text in #909090.

### Notification Alert Card
**Role:** Dismissable notification about user settings

#ffffff background, 1px border in #c6c6c6 or #d3d3d3, 10px-12px border-radius, padding 24px. Title: Roboto 16px weight 500, #0f0f0f, centered. Body: Roboto 14px weight 400, #606060, centered. Embedded pill button at bottom.

### Nav Item
**Role:** Individual sidebar navigation entry

24px icon + 16px text label, horizontal layout, 40px height, 12px horizontal padding. Icon stroke 2px in #606060 (inactive) or #0f0f0f (active). Text: Roboto 14px weight 400. Active state: #0f0f0f fill on text and icon, light gray hover background.

### Channel Link Item
**Role:** Sidebar link to a YouTube channel

24px circular avatar thumbnail (channel icon) + 14px channel name in #0f0f0f. 40px height, 12px gap. Part of 'More from YouTube' section.

### Expandable Section Toggle
**Role:** 'Show more' disclosure for sidebar section expansion

Down-chevron icon in #606060 + 'Show more' text in #606060, Roboto 14px weight 400. Same row height as nav items. No background change on hover.

### Icon Button
**Role:** Square tap target for utility actions (hamburger menu, more options)

40px × 40px, #ffffff background, 24px icon centered. Icons drawn in #0f0f0f at 2px stroke. No border, no fill change on default state.

### Header Bar
**Role:** Top-level persistent navigation

56px height, #ffffff background, full viewport width. Three regions: left (hamburger + logo, 16px gap), center (search input, max-width ~640px), right (icon buttons + Sign in button, 12px gap). Bottom border: none — separated by whitespace.

### Footer Link Row
**Role:** Bottom-of-sidebar text links

Inline list: 'About', 'Press', 'Copyright' in Roboto 13px weight 400, #606060. 24px horizontal padding. No separators between items — whitespace only.

## Do's and Don'ts

### Do
- Use #0f0f0f for all primary text and icon strokes — never pure #000000, the slight warmth defines the brand
- Use #065fd4 exclusively for links, outlined-button borders/text, and active nav states
- Use 18px border-radius for all buttons and search inputs (pill shape)
- Use Roboto at 14px for nav items and 13px for body copy — never exceed 16px outside the wordmark
- Separate content sections with whitespace, not dividers — let the grid breathe
- Keep the sidebar at exactly 240px wide and fixed-position
- Use 1px borders in #c6c6c6 or #d3d3d3 for card definition, never shadows

### Don't
- Never use #000000 — YouTube's text black is #0f0f0f
- Never apply drop shadows to cards, modals, or buttons — the system is intentionally flat
- Never use #065fd4 as a filled button background — it is an outlined-action and link color only
- Never use YouTube Sans outside the wordmark — it is not a heading face
- Never use #ff0000 outside the logo play triangle — it is a locked brand mark, not a functional accent
- Never add gradients — the system is flat by design
- Never exceed 20px font size outside the wordmark — the type scale tops out small

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Entire page background including sidebar and main content area — single flat layer |
| 2 | Notification Card | `#ffffff` | Alert/notification surfaces distinguished only by a hairline border, never by fill or shadow |

## Elevation

- **Search input right section:** `No shadow — the #f8f8f8 fill creates visual separation from the left input section`

## Imagery

The interface itself contains no decorative imagery. The brand mark is a flat red triangle paired with 'YouTube' in YouTube Sans. Icons are monochromatic line drawings (2px stroke) in #0f0f0f or #606060. Channel thumbnails in the sidebar are 24px circular crops. The system is designed to frame video content — all visual real estate is reserved for thumbnails, not interface decoration.

## Layout

Fixed left sidebar at 240px contains all navigation and never scrolls. Header is a 56px sticky top bar spanning the full viewport width. Main content area fills the remaining width with no max-width constraint. Content is arranged in a single vertical flow: notification cards, then future video grid. The sidebar+header chrome is permanent; the content area is the only region that changes. Vertical rhythm uses 24px section gaps and 12px element gaps. No centering tricks, no asymmetric layouts — everything is left-aligned and utilitarian.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #ffffff
- Primary text: #0f0f0f
- Secondary text: #606060
- Border: #d3d3d3
- Link/outlined action: #065fd4
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Sidebar nav item:* 240px-wide left rail item, 40px height, 24px line icon in #606060 + 14px Roboto label in #0f0f0f, 12px horizontal padding, 12px gap between items. No fill by default; hover adds #f2f2f2 background.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. *Search input:* pill-shaped (18px radius), 1px #d3d3d3 border, 40px height, split into left input area and right #f8f8f8 search button. Placeholder in #909090.

4. *Notification card:* #ffffff background, 1px #c6c6c6 border, 12px radius, 24px padding. Centered title in Roboto 16px weight 500 #0f0f0f, body in Roboto 14px weight 400 #606060, embedded neutral pill button at bottom.

5. *Header bar:* 56px tall, full-width #ffffff, three regions — left (hamburger icon 24px in #0f0f0f + YouTube logo with red #ff0000 play triangle and 'YouTube' in YouTube Sans 20px weight 600 #0f0f0f, 16px gap), center (search input ~640px max), right (icon buttons + outlined Sign in button with 12px gap).

## Similar Brands

- **Gmail** — Same flat white-canvas utility aesthetic with permanent left sidebar, minimal header, and zero elevation
- **Wikipedia** — Same content-first philosophy — near-monochrome interface that refuses to compete with the content it presents
- **Google Search** — Same restrained palette, Roboto-based type system, and bordered pill-shaped search input
- **Notion** — Same flat-surfaces-with-hairline-borders approach and single-color interactive accent philosophy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-youtube-ink: #0f0f0f;
  --color-graphite: #606060;
  --color-ash: #909090;
  --color-mist: #c6c6c6;
  --color-silver: #d3d3d3;
  --color-signal-blue: #065fd4;
  --color-play-red: #ff0000;

  /* Typography — Font Families */
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-youtube-sans: 'YouTube Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-lg: 14px;
  --leading-body-lg: 1.38;
  --text-heading: 20px;
  --leading-heading: 1.4;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-240: 240px;

  /* Layout */
  --section-gap: 24px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-icons: 10px;
  --radius-inputs: 18px;
  --radius-buttons: 18px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-notification-card: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-youtube-ink: #0f0f0f;
  --color-graphite: #606060;
  --color-ash: #909090;
  --color-mist: #c6c6c6;
  --color-silver: #d3d3d3;
  --color-signal-blue: #065fd4;
  --color-play-red: #ff0000;

  /* Typography */
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-youtube-sans: 'YouTube Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-lg: 14px;
  --leading-body-lg: 1.38;
  --text-heading: 20px;
  --leading-heading: 1.4;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 40px;
}
```
