# Spotify — Style Reference
> Nocturnal jukebox control room

**Theme:** dark

Spotify's web interface is a dense, dark-mode media command center: a near-black canvas punctuated by vibrant album artwork, one signature green accent, and pill-shaped controls. Typography is compact and utilitarian — a custom geometric sans-serif at small sizes that lets album art and artist photography do the visual heavy lifting. The layout is a fixed two-column shell (sidebar + main feed) with card grids of square covers and circular avatars, creating a rhythmic alternation between geometry types. The interface avoids heavy elevation, relying on subtle surface differentiation (#121212 cards on #000000 canvas) and the one large gradient banner to inject energy. The result feels like a DJ's control room: information-dense, acoustically dark, and ready to play at a glance.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Spotify Green | `#1ed760` | `--color-spotify-green` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Signal Red | `#b85850` | `--color-signal-red` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Void Black | `#000000` | `--color-void-black` | Page canvas, top nav background, deepest surface layer |
| Carbon | `#121212` | `--color-carbon` | Card surfaces, sidebar panels, secondary surface layer above canvas |
| Graphite | `#1f1f1f` | `--color-graphite` | Elevated surface — hover states, input fields, selected nav items |
| Smoke | `#292929` | `--color-smoke` | Active navigation background, subtle highlight wash |
| Iron | `#333333` | `--color-iron` | Input borders, subtle dividers between surface layers |
| Steel | `#535353` | `--color-steel` | Muted UI elements, secondary borders |
| Fog | `#73777c` | `--color-fog` | Muted text, secondary icon fills, inactive nav icons |
| Mist | `#b3b3b3` | `--color-mist` | Secondary text, metadata, artist names, timestamps |
| Bone | `#c5c5c5` | `--color-bone` | Input placeholder text, subtle captions |
| Pure White | `#ffffff` | `--color-pure-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Promo Gradient | `linear-gradient(90deg, rgb(175, 40, 150), rgb(80, 155, 245))` | `--color-promo-gradient` | Sign-up banner gradient endpoint — energetic blue anchor |
| Magenta Glow | `linear-gradient(90deg, rgb(175, 40, 150), rgb(80, 155, 245))` | `--color-magenta-glow` | Promotional banner gradient start — vivid pink-to-blue sweep for marketing CTAs |

## Tokens — Typography

### SpotifyMixUI — Body, navigation, buttons, metadata, small labels — compact and information-dense, designed to disappear so artwork dominates · `--font-spotifymixui`
- **Substitute:** Inter, system-ui, -apple-system, sans-serif
- **Weights:** 400, 600, 700
- **Sizes:** 11, 12, 13, 14, 16
- **Line height:** 1.20, 1.33, 1.50
- **Role:** Body, navigation, buttons, metadata, small labels — compact and information-dense, designed to disappear so artwork dominates

### SpotifyMixUITitle — Section headings ('Trending songs', 'Popular artists') — heavy bold weight at modest size keeps headlines assertive without overwhelming card grids · `--font-spotifymixuititle`
- **Substitute:** Inter weight 700, system-ui bold
- **Weights:** 700
- **Sizes:** 24
- **Line height:** 1.20
- **Role:** Section headings ('Trending songs', 'Popular artists') — heavy bold weight at modest size keeps headlines assertive without overwhelming card grids

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | — | `--text-caption` |
| body-lg | 14px | 1.33 | — | `--text-body-lg` |
| link | 16px | 1.2 | — | `--text-link` |
| heading | 24px | 1.2 | — | `--text-heading` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| small | 2px |
| images | 6px |
| inputs | 500px |
| avatars | 500px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.5) 0px 8px 24px 0px` | `--shadow-lg` |
| subtle | `rgb(18, 18, 18) 0px 1px 0px 0px, rgb(124, 124, 124) 0px 0...` | `--shadow-subtle` |

### Layout

- **Section gap:** 32-48px
- **Card padding:** 12px
- **Element gap:** 8-12px

## Components

### Pill Button (Filled White)
**Role:** Primary conversion button — used for 'Create playlist', 'Browse podcasts', 'Sign up free'

Fully rounded (9999px radius) pill shape, white background (#ffffff), black text in SpotifyMixUI 14px weight 700, 8px vertical / 12px horizontal padding. The only filled button style — stands out as the unambiguous action on a dark surface.

### Ghost Text Button
**Role:** Secondary action — 'Log in', 'Sign up' in the top nav

No background, no border. White (#ffffff) or mist (#b3b3b3) text in SpotifyMixUI 14px weight 700, horizontal padding of 12-16px. Hover state shifts text to pure white.

### Square Album Card
**Role:** Song/trending content tile in horizontal scrollable grids

6px border-radius on the cover image. Below the image: song title in white SpotifyMixUI 14px weight 600, artist name in #b3b3b3 weight 400. Card padding 12px. Entire card sits on #121212 canvas; hover lifts to #1f1f1f background.

### Circular Artist Card
**Role:** Artist profile tile in 'Popular artists' section

Artist photo clipped to full circle (500px radius). Artist name below in white 14px weight 600, 'Artist' label in #b3b3b3 12px. No background fill on the card itself — the circle IS the visual.

### Sidebar Panel
**Role:** Left-column 'Your Library' container

#121212 background, 6px top-left and top-right radius. Internal cards (playlist/podcast prompts) at #1f1f1f with 6px radius, 12px padding. Full-height fixed left column.

### Top Navigation Bar
**Role:** Global header with search, nav arrows, and account actions

#000000 background, 8px vertical padding. Search input is 36px tall, #1f1f1f fill, 500px radius, white placeholder text. Nav arrows are circular icon buttons. Right side: text links + filled white pill for primary action.

### Section Header
**Role:** Horizontal title row above content grids ('Trending songs', 'Popular artists')

SpotifyMixUITitle 24px weight 700 white text on left, 'Show all' link in #b3b3b3 12px on right. 24px row gap to content below.

### Promotional Banner
**Role:** Sticky bottom CTA for free tier sign-up

Full-width, linear-gradient(90deg, #af2896, #509bf5) background. White headline and body text on the left, white pill button on the right. Sits at the viewport floor, always visible.

### Search Input
**Role:** Top-bar search field

#1f1f1f background, 500px border-radius (nearly circular pill). White search icon on the left, white placeholder text. 12px horizontal padding, 8px vertical.

### Navigation Arrow Button
**Role:** Browser-style back/forward controls in top bar

#000000 or transparent background, 9999px radius circular hit area, white chevron icon. 32px diameter.

### Language Selector
**Role:** Footer-level globe icon + language dropdown in sidebar

White globe icon, white 'English' text, 9999px pill border on hover. SpotifyMixUI 14px weight 400.

## Do's and Don'ts

### Do
- Use #121212 as the default card/sidebar surface and #000000 as the page canvas
- Use 6px border-radius for all content cards and image containers
- Use 9999px border-radius for all interactive buttons and tags
- Use 500px border-radius for input fields to create a soft pill shape
- Use #1ed760 exclusively for play buttons, active states, and brand accents
- Use SpotifyMixUI 14px weight 700 for all section headings and button labels
- Use #b3b3b3 for all secondary text (artist names, metadata, timestamps)

### Don't
- Do not use heavy drop shadows — Spotify's elevation comes from surface color shifts, not shadow blur
- Do not use accent colors outside of #1ed760 and the promo gradient — the interface is intentionally monochrome
- Do not mix border-radius families — choose 6px for content, 9999px for actions, and stay consistent
- Do not use light backgrounds or white surfaces in the core interface — the dark canvas is signature
- Do not use typography larger than 24px for headings — Spotify's hierarchy is compact
- Do not place colored buttons on the dark surface — the primary action is always a white pill
- Do not add decorative borders or outlines to cards — surface color alone defines boundaries

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#000000` | Page background, top navigation bar |
| 2 | Sidebar | `#121212` | Left library panel, main content wrapper |
| 3 | Card | `#1f1f1f` | Individual content cards, input fields, elevated tiles |
| 4 | Card Hover | `#292929` | Interactive card hover state |

## Elevation

- **Promotional Banner / Overlay Cards:** `rgba(0, 0, 0, 0.5) 0px 8px 24px 0px`
- **Input Fields:** `rgb(18, 18, 18) 0px 1px 0px 0px, rgb(124, 124, 124) 0px 0px 0px 1px inset`

## Imagery

Album artwork and artist photography are the primary visual content. Covers are presented as tight square crops (1:1 aspect ratio) at 6px radius — sharp enough to feel editorial, soft enough to feel modern. Artist photos are circular crops, emphasizing the face as identifier. No decorative photography, no lifestyle imagery, no abstract graphics in the core interface. The only non-photographic visual is the magenta-to-blue promotional gradient banner at the bottom, which functions as the sole brand-colored energy injection. Icons are minimal, monoline, white on dark — small and functional, never decorative.

## Layout

Fixed two-column shell: a 340px left sidebar ('Your Library') and a fluid main content area. The top bar is a full-width 64px black strip with left-anchored search and right-anchored account actions. Main content scrolls vertically with horizontal card carousels — trending songs in 5-column square grid, popular artists in 5-column circular grid, popular albums/singles continuing the pattern. Section spacing is compact (32-48px between sections). The bottom promotional banner is sticky/fixed at viewport floor. Navigation is purely top-bar + sidebar — no mega-menu, no breadcrumbs. The rhythm alternates: square cards → circular cards → square cards, creating geometric contrast between sections.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000000 (canvas), #121212 (sidebar/cards), #1f1f1f (elevated)
- text: #ffffff (primary), #b3b3b3 (secondary/metadata)
- border: #333333 (subtle), #73777c (muted)
- accent: #1ed760 (Spotify green — play/active states)
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Top Navigation Bar*: Full-width #000000 bar, 64px height, 8px vertical padding. Left: circular back/forward arrow buttons (32px, white chevron). Center-left: search input — #1f1f1f fill, 500px radius, white search icon, white placeholder 'What do you want to play?'. Right: ghost text links 'Premium' 'Support' 'Download' in #ffffff SpotifyMixUI 14px weight 700, divider, 'Install App' with icon, pipe divider, 'Sign up' ghost link, 'Log in' white pill button (9999px radius, #ffffff bg, #000000 text, 8px 12px padding).

2. *Square Album Card*: 6px border-radius cover image filling card width. Below: song title in #ffffff SpotifyMixUI 14px weight 600, artist name in #b3b3b3 SpotifyMixUI 14px weight 400. Card background #121212, 12px padding. Hover: card background shifts to #1f1f1f.

3. *Circular Artist Card*: Artist photo clipped to full circle (500px radius), no card background. Below circle: artist name #ffffff 14px weight 600, 'Artist' label in #b3b3b3 12px weight 400. 12px gap between circle and text.

4. *Promotional Banner*: Full-width sticky bottom bar, linear-gradient(90deg, #af2896, #509bf5) background, 16px padding. Left: white headline SpotifyMixUI 14px weight 700 'Preview of Spotify', white body text 'Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.' Right: white pill button 'Sign up free' (9999px radius, #ffffff, #000000 text, 8px 12px padding).

5. *Sidebar Library Panel*: Fixed left column, 340px wide, #121212 background, full viewport height. Top: 'Your Library' heading #ffffff 16px weight 700, '+' add button on right. Two internal cards stacked vertically: #1f1f1f background, 6px radius, 12px padding. Each card has a white bold heading, #b3b3b3 description text, and a white pill button at the bottom.

## Geometry Rhythm

Spotify's visual identity relies on a deliberate alternation of geometric shapes across horizontal sections: square album covers (1:1, 6px radius) give way to circular artist avatars (1:1, 500px radius) give way to square album/single tiles again. This rhythm prevents visual fatigue in long-scroll feeds and signals content-type changes without needing dividers or section backgrounds. Maintain this alternation — never place two circular sections or two square sections adjacent.

## Similar Brands

- **Apple Music** — Same dark-mode media browser with sidebar + horizontal card carousels, square album art tiles, and dense compact typography
- **YouTube Music** — Dark canvas with image-heavy card grids, similar compact sans-serif UI type, and pill-shaped playback controls
- **Tidal** — Near-identical layout structure: fixed sidebar library, horizontal content rails, square covers, dark monochrome interface
- **SoundCloud** — Dark-mode streaming interface with dense card grids, small utilitarian typography, and one brand accent color punctuating a monochrome shell
- **Netflix** — Content-first dark interface with horizontal card carousels, image-dominant tiles, and minimal chrome around the content grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-spotify-green: #1ed760;
  --color-signal-red: #b85850;
  --color-void-black: #000000;
  --color-carbon: #121212;
  --color-graphite: #1f1f1f;
  --color-smoke: #292929;
  --color-iron: #333333;
  --color-steel: #535353;
  --color-fog: #73777c;
  --color-mist: #b3b3b3;
  --color-bone: #c5c5c5;
  --color-pure-white: #ffffff;
  --color-promo-gradient: #509bf5;
  --gradient-promo-gradient: linear-gradient(90deg, rgb(175, 40, 150), rgb(80, 155, 245));
  --color-magenta-glow: #af2896;
  --gradient-magenta-glow: linear-gradient(90deg, rgb(175, 40, 150), rgb(80, 155, 245));

  /* Typography — Font Families */
  --font-spotifymixui: 'SpotifyMixUI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-spotifymixuititle: 'SpotifyMixUITitle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body-lg: 14px;
  --leading-body-lg: 1.33;
  --text-link: 16px;
  --leading-link: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-172: 172px;

  /* Layout */
  --section-gap: 32-48px;
  --card-padding: 12px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-2xl: 16px;
  --radius-full: 500px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-small: 2px;
  --radius-images: 6px;
  --radius-inputs: 500px;
  --radius-avatars: 500px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.5) 0px 8px 24px 0px;
  --shadow-subtle: rgb(18, 18, 18) 0px 1px 0px 0px, rgb(124, 124, 124) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-sidebar: #121212;
  --surface-card: #1f1f1f;
  --surface-card-hover: #292929;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-spotify-green: #1ed760;
  --color-signal-red: #b85850;
  --color-void-black: #000000;
  --color-carbon: #121212;
  --color-graphite: #1f1f1f;
  --color-smoke: #292929;
  --color-iron: #333333;
  --color-steel: #535353;
  --color-fog: #73777c;
  --color-mist: #b3b3b3;
  --color-bone: #c5c5c5;
  --color-pure-white: #ffffff;
  --color-promo-gradient: #509bf5;
  --color-magenta-glow: #af2896;

  /* Typography */
  --font-spotifymixui: 'SpotifyMixUI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-spotifymixuititle: 'SpotifyMixUITitle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body-lg: 14px;
  --leading-body-lg: 1.33;
  --text-link: 16px;
  --leading-link: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-2xl: 16px;
  --radius-full: 500px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.5) 0px 8px 24px 0px;
  --shadow-subtle: rgb(18, 18, 18) 0px 1px 0px 0px, rgb(124, 124, 124) 0px 0px 0px 1px inset;
}
```
