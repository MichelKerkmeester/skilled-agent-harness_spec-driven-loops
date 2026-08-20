# Twitch — Style Reference
> Stadium scoreboard on parchment

**Theme:** light

Twitch's design system reads as a dense, utilitarian broadcast console: a light gray canvas (#efeff1) hosts compact white cards (#ffffff) with near-black text (#0e0e10), letting a saturated deep purple (#5c16c5) and a sharp signal red (#eb0400) do all the semantic heavy lifting. The signature is the contrast between information density and visual softness — everything is pill-shaped (9000px radius) for buttons, avatars, tags, and thumbnails, while content cards stay sharp-cornered at 4px to feel like flat broadcast tiles. Typography stays small and quiet (Inter at 11–14px for the entire interface) so that streamer thumbnails and live video remain the visual heroes. The deep, near-violet brand purple is unusually dark for a consumer platform — it carries the weight of a logo, not a decoration — while the lighter Twitch purple (#9147ff) appears on action surfaces like the Sign Up button.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Iris | `#5c16c5` | `--color-deep-iris` | Primary brand color — logo wordmark, link text, active nav icons, decorative accent fills. Unusually dark violet gives the wordmark the weight of a jersey number rather than a SaaS accent |
| Twitch Purple | `#9147ff` | `--color-twitch-purple` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Broadcast Red | `#eb0400` | `--color-broadcast-red` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Dark Matter | `#0e0e10` | `--color-dark-matter` | Primary text, icon strokes, dark UI surfaces, featured stream overlays, footer text. Near-black with a faint warm cast |
| Charcoal | `#3b3b44` | `--color-charcoal` | Secondary text, muted nav items, helper labels, inactive controls. The readable-but-quiet middle ground between Dark Matter and the canvas |
| Soft Mist | `#efeff1` | `--color-soft-mist` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, thumbnail frames, button text, input fields, nav bar background. The elevated surface token |
| Hairline | `#dddde2` | `--color-hairline` | Dividers, card borders, input outlines, table separators. Visible but never structural |
| Steel Gray | `#b2b2b3` | `--color-steel-gray` | Subtle border accents, low-emphasis separators where Hairline would be too prominent |
| Shadow Smoke | `#c1c1c1` | `--color-shadow-smoke` | Box-shadow tint on elevated cards and popovers — a cool neutral gray rather than pure black |

## Tokens — Typography

### Inter — Primary UI typeface for the entire interface — nav labels, body text, buttons, badges, metadata, tags. Stays at 11–14px everywhere; the 600 weight is reserved for nav items, button text, and emphasis labels while 400 carries body and helper text. The narrow size range is intentional: Twitch compresses information rather than scaling type to create hierarchy. · `--font-inter`
- **Substitute:** Inter (Google Fonts) or system-ui as fallback
- **Weights:** 400, 600
- **Sizes:** 11px, 12px, 14px
- **Line height:** 1.00, 1.10, 1.20, 1.40, 1.50, 1.60
- **Role:** Primary UI typeface for the entire interface — nav labels, body text, buttons, badges, metadata, tags. Stays at 11–14px everywhere; the 600 weight is reserved for nav items, button text, and emphasis labels while 400 carries body and helper text. The narrow size range is intentional: Twitch compresses information rather than scaling type to create hierarchy.

### Roobert — Brand display font for the wordmark and section headings. The slight negative tracking (-0.01em) tightens the geometric forms into a custom-feeling logotype. Substituted by Inter when unavailable — the brand relies on the wordmark image for identity, not the typeface alone. · `--font-roobert`
- **Substitute:** Inter at 600 weight, or Roobert from Lyon Display if licensed
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 18px
- **Line height:** 1.10, 1.40
- **Letter spacing:** -0.0100em
- **Role:** Brand display font for the wordmark and section headings. The slight negative tracking (-0.01em) tightens the geometric forms into a custom-feeling logotype. Substituted by Inter when unavailable — the brand relies on the wordmark image for identity, not the typeface alone.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body-sm | 12px | 1.4 | — | `--text-body-sm` |
| body | 14px | 1.4 | — | `--text-body` |

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
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9000px |
| cards | 4px |
| pills | 9000px |
| inputs | 9000px |
| avatars | 9000px |
| buttons | 9000px |
| thumbnails | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.22) 0px 6px 16px 0px, rgba(0, 0, 0, 0.08)...` | `--shadow-md` |
| subtle | `rgba(0, 0, 0, 0.13) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) ...` | `--shadow-subtle` |
| subtle-2 | `rgba(50, 50, 57, 0.62) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Pill Primary Button
**Role:** Filled action button for sign-up, follow, subscribe, and submit actions

Background #9147ff, text #ffffff in Inter 600 at 12px, padding 5px 10px, border-radius 9000px. No border. Hover deepens to ~#772ce8 (derived from Deep Iris). The 9000px radius is non-negotiable — it is the button shape, not a stylistic choice.

### Ghost Text Button
**Role:** Secondary actions like Log In, Cancel, and dismiss controls

Transparent background, text in Inter 600 at 12px, color #0e0e10 or #9147ff depending on context, padding 5px 10px, border-radius 9000px. No fill, no border — relies on text weight and color to register as actionable.

### LIVE Badge
**Role:** Status indicator on live stream thumbnails and featured streams

Background #eb0400, text #ffffff in Inter 600 at 11px uppercase, padding 2px 6px, border-radius 4px. Always paired with a small red dot. The sharp 4px corners distinguish it from all other pills on the site — the LIVE badge is a status stamp, not a tag.

### Channel Card
**Role:** Thumbnail tile in the Live on Twitch grid and search results

Background #ffffff, 4px border-radius, 16px internal padding. Thumbnail occupies the top with a 16:9 aspect ratio and a 4px radius (clipped to card). LIVE badge overlays the top-left of the thumbnail; viewer count overlays bottom-left in a #0e0e10 at 80% opacity rounded chip. Channel avatar (50% of card width, 9000px radius) overlaps the thumbnail/footer boundary.

### Featured Stream Hero
**Role:** Large hero card showcasing a single promoted stream on the homepage

16:9 video frame with #0e0e10 overlay at 40% opacity on the left third. Channel name, title, viewer count, and a 9000px-radius follow button sit in the overlay. Background of the card is #ffffff with 4px radius. The hero is the only element allowed to be visually loud — everything else defers to it.

### Sidebar Channel Item
**Role:** Compact list item in the Live Channels rail

Transparent background, 8px vertical padding, 5px horizontal padding. 36px circular avatar on the left (9000px radius), channel name and category stacked in Inter 400 at 12px, viewer count right-aligned in Inter 600 at 12px color #0e0e10. Red dot appears next to channels currently streaming. No hover background — the cursor changes instead.

### Pill Search Input
**Role:** Global search bar in the top nav

Background #efeff1, 1px border #dddde2, text Inter 400 at 14px #0e0e10, placeholder #3b3b44, border-radius 9000px, padding 5px 16px. Magnifying glass icon on the right in #0e0e10. Focus state deepens the border to #9147ff with a 1px ring.

### Top Navigation Bar
**Role:** Persistent header across all pages

Background #ffffff, 1px bottom border #dddde2, padding 0 20px, height ~50px. Contains the purple Twitch wordmark (left), centered pill search input, and Log In (ghost) + Sign Up (pill primary) actions on the right. The nav never changes shape — it is a fixed broadcast chyron.

### Category Tag
**Role:** Inline metadata tag for game/category labels on channel cards

Background #efeff1, text Inter 400 at 12px #0e0e10, padding 3px 8px, border-radius 9000px. Sits in the card footer next to language tags. Multiple tags wrap horizontally with 4px gaps.

### Viewer Count Chip
**Role:** Live viewer overlay on stream thumbnails

Background rgba(14, 14, 16, 0.8), text #ffffff in Inter 600 at 11px, padding 2px 6px, border-radius 4px. Bottom-left of every live thumbnail. The sharp corners echo the LIVE badge — both are video-chrome overlays, not UI tags.

### Community Banner
**Role:** Full-width promotional strip at page bottom for join/sign-up CTAs

Background #5c16c5 (Deep Iris), padding 16px 20px, full viewport width. White Twitch icon on the left, body text in Inter 400 at 14px #ffffff, and a Sign Up button on the right — white fill, #5c16c5 text, 9000px radius. The banner is the only element that runs edge-to-edge in the brand color.

## Do's and Don'ts

### Do
- Use 9000px border-radius for all buttons, tags, avatars, and inputs — the pill shape is the site's default, not an alternative to square corners
- Keep body type in the 11–14px Inter range; use 18px Roobert only for the wordmark and section headings
- Reserve #eb0400 exclusively for LIVE status — never use it for errors, destructive actions, or decoration
- Apply #efeff1 as the page canvas and #ffffff as the card surface — never invert to a white page with gray cards
- Use Deep Iris (#5c16c5) for the wordmark, links, and the bottom community banner; use Twitch Purple (#9147ff) for filled action buttons
- Apply 4px border-radius to all stream thumbnails and video frames to distinguish broadcast chrome from UI pills
- Pair every live stream thumbnail with a LIVE badge (top-left, red) and a viewer count chip (bottom-left, dark) as a mandatory visual contract

### Don't
- Do not use 8px or 12px border-radius on buttons or tags — the only radii in the system are 4px (cards/thumbnails) and 9000px (everything interactive)
- Do not introduce a second red — #eb0400 is the only red, and it means 'live'
- Do not use a light purple (#9147ff) for the wordmark or large brand surfaces — Deep Iris (#5c16c5) carries logo-level weight, Twitch Purple carries tap-level weight
- Do not set body text below 11px or above 14px outside of the Roobert display font — the compact type range is the design's density signature
- Do not add drop shadows to cards or nav elements — the system uses flat surfaces with 1px hairline borders, not elevation
- Do not place LIVE badges with 9000px radius or pills with 4px radius — the two radii never cross purposes
- Do not use gradients — the system is entirely flat fills; depth comes from surface stacking, not color transitions

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#efeff1` | Page background, sidebar rail, outer page chrome |
| 1 | Card | `#ffffff` | Channel cards, content tiles, nav bar, featured stream frame |
| 2 | Overlay | `#0e0e10` | Featured stream video frame, dark mode popovers, video player chrome |
| 3 | Brand Wash | `#5c16c5` | Bottom promotional banner, branded link accents |

## Elevation

- **Featured Stream Card:** `0 0 0 1px inset rgba(50, 50, 57, 0.62)`
- **Popover / Tooltip:** `0 6px 16px rgba(0, 0, 0, 0.22), 0 0 4px rgba(0, 0, 0, 0.08)`
- **Nav Card Hover:** `0 1px 2px rgba(0, 0, 0, 0.13), 0 0 2px rgba(0, 0, 0, 0.08)`

## Imagery

The site's visual content is entirely stream thumbnails and live video frames — 16:9 aspect ratio, always clipped to 4px corners. Avatar images are 9000px-radius circles (50% of card width), overlapping the thumbnail-to-footer boundary to create a stacked card effect. No photography, no illustration, no decorative graphics — the only imagery is user-generated stream content. Streamer brand identity comes from their avatar + thumbnail art, never from site-level illustration. Iconography is filled single-color (Inter-style geometric icons) in #0e0e10 for nav and #9147ff for active/brand states.

## Layout

Fixed top nav (50px, white, full-width) sits above a two-column body: a 240px left sidebar rail with Live Channels list on #efeff1, and a fluid main content area. The homepage hero is a single large featured stream card (full main-column width, 16:9 video), followed by horizontal section bands — 'Live on Twitch' is a 3-column card grid with 16px gaps. Cards within grids are equal-width and aligned to a strict left grid edge. Content density is compact: vertical rhythm between sections is 40px, between cards 16px, between metadata items 4–8px. The page never uses centered text stacks — everything is left-aligned with the wordmark as the visual anchor. Bottom-of-page is a full-width Deep Iris community banner. The layout reads as a broadcast dashboard: rail on the left, featured tile in the center, supporting tiles below, brand strip at the bottom.

## Agent Prompt Guide

Quick Color Reference:
- text: #0e0e10
- background: #efeff1 (canvas), #ffffff (cards)
- border: #dddde2
- accent: #5c16c5 (Deep Iris — wordmark, links, banners)
- primary action: no distinct CTA color
- live status: #eb0400

Example Component Prompts:
1. Build a channel card: 4px-radius white card, 16px padding, 16:9 thumbnail with a red #eb0400 LIVE badge (4px radius, 11px Inter 600 white) at top-left and a dark #0e0e10 80%-opacity viewer chip at bottom-left. Below the thumbnail, a 9000px-radius 24px avatar overlapping the boundary, channel name in Inter 600 14px #0e0e10, category in Inter 400 12px #3b3b44.
2. Build the top nav: white background, 1px #dddde2 bottom border, purple #5c16c5 Twitch wordmark on the left, centered pill search input (9000px radius, #efeff1 fill, #dddde2 border, 14px Inter placeholder), and a ghost Log In text button + filled Sign Up pill button (9000px radius, #9147ff fill, white 12px Inter 600) on the right.
3. Build the community banner: full-width #5c16c5 strip, 16px 20px padding, white Twitch icon left, Inter 400 14px white body text, and a white-fill Sign Up button (9000px radius, #5c16c5 text) right-aligned.
4. Build a sidebar channel item: no background, 36px 9000px-radius avatar left, channel name in Inter 400 12px #0e0e10 and category in Inter 400 11px #3b3b44 stacked beside it, viewer count right-aligned in Inter 600 12px #0e0e10, red dot next to live channels.
5. Build the featured stream hero: full-width white card with 4px radius, 16:9 #0e0e10 video frame inside, a 40%-opacity dark overlay on the left third containing channel name (Inter 600 18px white), title (Inter 400 14px white), viewer count (Inter 600 12px white), and a white-outline 9000px-radius follow button.

## Similar Brands

- **YouTube Gaming** — Same light canvas + white card grid + compact 12–14px type + small red LIVE badge convention over 16:9 thumbnails
- **Kick** — Same dark-on-light broadcast dashboard layout with a left rail of live channels and a centered featured stream hero
- **Steam store homepage** — Same flat light-gray canvas, 4px-radius white game tiles, and pill-shaped action buttons in a single brand color
- **Discord server directory** — Same compact 11–14px Inter density, pill avatars, and neutral canvas with one chromatic brand accent
- **Crunchyroll** — Same media-tile grid pattern with 4px-radius thumbnail cards, red status badges, and a flat light background

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-iris: #5c16c5;
  --color-twitch-purple: #9147ff;
  --color-broadcast-red: #eb0400;
  --color-dark-matter: #0e0e10;
  --color-charcoal: #3b3b44;
  --color-soft-mist: #efeff1;
  --color-pure-white: #ffffff;
  --color-hairline: #dddde2;
  --color-steel-gray: #b2b2b3;
  --color-shadow-smoke: #c1c1c1;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body-sm: 12px;
  --leading-body-sm: 1.4;
  --text-body: 14px;
  --leading-body: 1.4;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9000px;

  /* Named Radii */
  --radius-tags: 9000px;
  --radius-cards: 4px;
  --radius-pills: 9000px;
  --radius-inputs: 9000px;
  --radius-avatars: 9000px;
  --radius-buttons: 9000px;
  --radius-thumbnails: 4px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.22) 0px 6px 16px 0px, rgba(0, 0, 0, 0.08) 0px 0px 4px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.13) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 0px 2px 0px;
  --shadow-subtle-2: rgba(50, 50, 57, 0.62) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #efeff1;
  --surface-card: #ffffff;
  --surface-overlay: #0e0e10;
  --surface-brand-wash: #5c16c5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-iris: #5c16c5;
  --color-twitch-purple: #9147ff;
  --color-broadcast-red: #eb0400;
  --color-dark-matter: #0e0e10;
  --color-charcoal: #3b3b44;
  --color-soft-mist: #efeff1;
  --color-pure-white: #ffffff;
  --color-hairline: #dddde2;
  --color-steel-gray: #b2b2b3;
  --color-shadow-smoke: #c1c1c1;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body-sm: 12px;
  --leading-body-sm: 1.4;
  --text-body: 14px;
  --leading-body: 1.4;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9000px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.22) 0px 6px 16px 0px, rgba(0, 0, 0, 0.08) 0px 0px 4px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.13) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 0px 2px 0px;
  --shadow-subtle-2: rgba(50, 50, 57, 0.62) 0px 0px 0px 1px inset;
}
```
