# SoundCloud — Style Reference
> concert darkroom with neon blue signal — a near-black gallery where album art and one cool accent color do all the work, and the chrome around them stays invisible.

**Theme:** dark

SoundCloud is a dark-stage media environment: near-black canvas (#121212) sets the venue, album artwork and photography carry the color, and a single cool blue (#699fff) punctuates links and interactive moments. The interface stays flat and almost shadowless — definition comes from inset hairlines and gray scale shifts rather than elevation, which keeps the focus on the visuals (artists, track artwork, lifestyle photography). Typography is a custom geometric sans (Söhne) with an unusually wide weight range including a 100-weight for whisper-thin display moments, paired with comfortable 8–16px padding and squared 4px corners that feel utilitarian and unfussy. Components are rectangular and content-dense — buttons are flat fills, cards are bare containers for cover art, inputs are minimal — letting the music content be the visual hero.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#121212` | `--color-obsidian` | Page background, hero overlay base, primary dark surface |
| Graphite | `#303030` | `--color-graphite` | Elevated dark surfaces — input fields, card backgrounds over the dark canvas, nested panels |
| Mid Gray | `#666666` | `--color-mid-gray` | Mid-tone dividers, secondary surface tier above Graphite |
| Fog | `#999999` | `--color-fog` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Silver | `#cccccc` | `--color-silver` | Hairline borders, subtle dividers between dark surface tiers |
| Bone | `#f2f2f2` | `--color-bone` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| White | `#ffffff` | `--color-white` | Primary text, primary filled buttons, headings, input text on dark — the dominant high-contrast tone |
| Signal Blue | `#699fff` | `--color-signal-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Söhne (custom) — Söhne is the only typeface across the system. Weight 100 is used at display scale (60px) to make the hero whisper rather than shout — most brands push 700 at this size; Söhne 100 inverts the convention and creates editorial weight through restraint. Weight 400 handles body and UI text, 600 covers subheadings and emphasis, 700 reserves itself for button labels and strong CTAs. The wide 100–700 range means the same family can do both ethereal display and utilitarian UI without switching typefaces. · `--font-shne-custom`
- **Substitute:** Inter (closest free alternative with similar 100–900 range and geometric proportions); fallback DM Sans or Manrope
- **Weights:** 100, 400, 600, 700
- **Sizes:** 12, 14, 17, 18, 22, 28, 36, 60
- **Line height:** 1.00–1.71
- **Role:** Söhne is the only typeface across the system. Weight 100 is used at display scale (60px) to make the hero whisper rather than shout — most brands push 700 at this size; Söhne 100 inverts the convention and creates editorial weight through restraint. Weight 400 handles body and UI text, 600 covers subheadings and emphasis, 700 reserves itself for button labels and strong CTAs. The wide 100–700 range means the same family can do both ethereal display and utilitarian UI without switching typefaces.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.41 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 17px | 1.41 | — | `--text-body` |
| subheading | 22px | 1.27 | — | `--text-subheading` |
| heading-sm | 28px | 1.29 | — | `--text-heading-sm` |
| heading | 36px | 1.33 | — | `--text-heading` |
| display | 60px | 1 | — | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 4px |
| images | 4px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(18, 18, 18, 0.1) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Promotional Banner
**Role:** Top-of-page announcement strip

Full-width #121212 bar, 4px vertical padding, single-line message. Uses small orange dot icon (#ff5500 not in palette) as live indicator, inline text in white at 14px, inline link in #699fff. Close × icon on the right in #999999.

### Top Navigation Bar
**Role:** Global site navigation

Transparent over hero, switches to #121212 solid on scroll. Left: SoundCloud wordmark + waveform icon in white. Right cluster: 'Sign In' text link in #999999, 'Create account' filled white button (4px radius, #ffffff background, #121212 text, 600 weight, ~8px 16px padding), 'For Artists' text link in #999999.

### Hero Section
**Role:** Above-the-fold brand pitch

Full-bleed editorial photograph (artist portrait) with subtle dark gradient overlay. Left-aligned content column: display headline at 60px Söhne 100, white. Body subhead at 17px white. 'Get Started' filled white button (4px radius, #ffffff bg, #121212 text, 600 weight). Pagination dots in lower right (#999999 inactive, #ffffff active).

### Search Bar with Upload
**Role:** Primary discovery + contribution input

Horizontal row centered on page. Search input: #303030 background, 4px radius, no visible border, 16px left/right padding, placeholder text in #999999 at 14px, white magnifier icon right-aligned. Adjacent: 'or' divider in #999999. 'Upload your own' filled white button matching the Create account button style.

### Track / Album Card
**Role:** Trending content tile

Bare container — no card background, no border, no shadow. Square cover art thumbnail (1:1 aspect, 4px radius, no padding around image). Below image: track title at 14px white weight 600, artist name at 14px #999999 weight 400. Stacked vertically with 16px gap between image and text.

### Trending Grid Section
**Role:** Browse trending content

Section heading 'Hear what's trending for free in the SoundCloud community' at 22px white, centered. 6-column grid of Track Cards with 16px row gap and 16px column gap. Centered 'Explore trending playlists' white filled button below grid.

### Primary Filled Button
**Role:** Main call-to-action

#ffffff background, #121212 text, 4px radius, 700 weight, ~8px 16px padding, 14px font size. Used for 'Create account', 'Get Started', 'Upload your own', 'Explore trending playlists'. Square corners with confident weight give it a direct, unfussy feel.

### Ghost Text Button
**Role:** Tertiary or navigation action

No background, no border. Text in #999999 at 14px weight 400. Used for 'Sign In', 'For Artists', and similar low-emphasis navigation points. Hovers to white.

### Input Field (Dark)
**Role:** Search and form inputs

#303030 background, 4px radius, 1px inset hairline at rgba(18,18,18,0.1), 12–16px vertical padding, 16px horizontal padding. Placeholder and icon in #999999, typed text in #ffffff. No visible focus ring — focus state uses slightly lighter background.

### App Store Badge
**Role:** Download CTA on light promotional band

Standard Apple/Google download badges, black (#000000) with white text and icons, 4px radius. Appears on the light (#f2f2f2) mobile app promotion section.

### Device Mockup Section
**Role:** Cross-platform availability showcase

Light band (#f2f2f2 background) breaking from the dark page. Left side: phone and tablet mockups with orange device frames showing app UI screenshots. Right side: heading 'Never stop listening' at 36px Söhne weight 100, short body copy at 17px #121212, then App Store and Google Play badges side by side.

### Pagination Dot Indicator
**Role:** Carousel position indicator

Three small circles, 8px diameter. Active dot in #ffffff, inactive dots in #999999 with ~40% opacity. Inline horizontal with 8px gap.

## Do's and Don'ts

### Do
- Use #121212 as the default page background; reserve #303030 for inputs and elevated dark panels only
- Set border-radius to 4px on all buttons, inputs, and badges — never use pill shapes (9999px) or large radii
- Render buttons as flat fills with no drop shadow — use inset hairlines (rgba(18,18,18,0.1) 0 0 0 1px inset) for boundary definition
- Use Söhne weight 100 at display scale (60px) for hero headlines to create editorial restraint; switch to 600–700 for body and UI
- Let photography and album artwork supply all color in content sections; keep the surrounding chrome achromatic
- Use #699fff exclusively for inline links and accent strokes — never as a button fill
- Maintain a 6-column grid for content tiles with 16px row and column gaps on desktop

### Don't
- Do not introduce drop shadows on cards or buttons — the system is flat by design
- Do not use #699fff as a CTA background or button fill — the action color is white (#ffffff)
- Do not use border-radius larger than 4px on interactive elements; the squared corner is part of the identity
- Do not add gradients to buttons, cards, or background surfaces — the page is flat black
- Do not set body text below 14px or use weight 100 for anything smaller than display scale
- Do not use multiple saturated accent colors — the system is monochromatic with one blue signal
- Do not add elevation tiers beyond the gray scale shifts (#121212 → #303030 → #666666) — there is no shadow stack

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#121212` | Page background, hero stage |
| 1 | Graphite Surface | `#303030` | Input fields, nested dark panels, elevated cards on dark |
| 2 | Mid Gray Tier | `#666666` | Hover or secondary dark surfaces, dividers |
| 3 | Bone Light Band | `#f2f2f2` | Inverted promotional sections (mobile app, light-themed marketing blocks) |
| 4 | White Highlight | `#ffffff` | Primary filled buttons, highest-emphasis text, app store badges on light |

## Elevation

- **Card / surface boundary:** `inset 0 0 0 1px rgba(18, 18, 18, 0.1)`

## Imagery

Photography-driven: editorial artist portraits in the hero (full-bleed, tight crops, slightly desaturated, moody lighting), square 1:1 album/track artwork as the dominant tile imagery, and product screenshots of the mobile app inside device mockups for the promotional band. Imagery is treated as full-bleed content with no decorative framing or rounded overlays on the hero (only 4px radius on tiles). Color treatment is naturalistic — photography carries the warm and cool tones, while the surrounding chrome stays achromatic. No illustrations, no 3D renders, no abstract graphics. The visual hierarchy is: hero photo > album tiles > device mockups > text.

## Layout

Full-bleed dark canvas with a max-width ~1200px content column. The hero is a split layout: editorial photograph fills the right two-thirds, headline + subhead + CTA stack left-aligned in the left third. A 6-column card grid for trending content follows, centered with even gutters. The mid-page mobile app section is a light inverted band (#f2f2f2) with device mockups on the left and text + app store badges on the right — a single visual break from the dark theme. Navigation is a transparent top bar that sits over the hero and may solidify to #121212 on scroll. Section gaps are generous (48–64px) creating breathing room between bands. Content is image-dense in the discovery areas and text-sparse, letting the artwork carry each row.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #999999 (muted), #121212 (on light)
- background: #121212 (page), #303030 (elevated dark), #f2f2f2 (light band)
- border: rgba(18,18,18,0.1) inset 1px (dark surfaces), #cccccc (light surfaces)
- accent: #699fff (links only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a navigation bar: transparent over hero. Left — SoundCloud wordmark in #ffffff at 17px Söhne weight 600 with a small waveform icon. Right cluster — 'Sign In' as ghost text link in #999999 14px, then a white filled button labeled 'Create account' (#ffffff background, #121212 text, 4px radius, 8px 16px padding, weight 700), then 'For Artists' ghost link in #999999.

2. Create a hero section: full-bleed editorial photograph background with a subtle dark gradient overlay. Left-aligned content — display headline at 60px Söhne weight 100 in #ffffff, two lines. Below at 17px Söhne weight 400, a short white subhead. Below that, a white filled 'Get Started' button (#ffffff bg, #121212 text, 4px radius, 8px 24px padding, weight 700).

3. Create a track card grid: 6 columns, 16px row and column gap. Each card has no background or border — just a 1:1 cover art image with 4px radius, then 16px below it the track title in 14px Söhne weight 600 #ffffff, and the artist name in 14px weight 400 #999999.

4. Create a search input: #303030 background, 4px radius, 1px inset border at rgba(18,18,18,0.1), 16px horizontal padding and 12px vertical. Placeholder text 'Search for artists, bands, tracks, podcasts' in #999999 at 14px, white magnifier icon at the right end.

5. Create a light promotional band: #f2f2f2 full-width background section, 64px vertical padding. Left side shows two device mockups (phone in front, tablet behind) with orange device frames and app screenshots. Right side — heading 'Never stop listening' at 36px Söhne weight 100 in #121212, body copy at 17px in #121212, then black App Store and Google Play badges (4px radius) side by side.

## Similar Brands

- **Spotify (web)** — Same dark-stage layout philosophy — near-black canvas, white text hierarchy, squared components, album-art-driven content grids, minimal elevation, one chromatic accent for interactive moments
- **Bandcamp** — Same image-first discovery grid with 1:1 artwork tiles on a dark surface, flat button style with no shadows, and an editorial photography hero
- **Vimeo** — Same dark canvas with full-bleed editorial hero photography, near-monochrome interface, squared 4px corners on inputs, and content-led grids where the media itself supplies the color
- **Pinterest** — Same image-tile-first grid approach on a dark neutral background with compact metadata text and minimal chrome around the artwork
- **Apple Music (web)** — Same editorial hero with large display typography over a dark photographic background, content grid of 1:1 album tiles, and a flat button system without drop shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #121212;
  --color-graphite: #303030;
  --color-mid-gray: #666666;
  --color-fog: #999999;
  --color-silver: #cccccc;
  --color-bone: #f2f2f2;
  --color-white: #ffffff;
  --color-signal-blue: #699fff;

  /* Typography — Font Families */
  --font-shne-custom: 'Söhne (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.41;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 17px;
  --leading-body: 1.41;
  --text-subheading: 22px;
  --leading-subheading: 1.27;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.29;
  --text-heading: 36px;
  --leading-heading: 1.33;
  --text-display: 60px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-thin: 100;
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 4px;
  --radius-images: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(18, 18, 18, 0.1) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-obsidian-canvas: #121212;
  --surface-graphite-surface: #303030;
  --surface-mid-gray-tier: #666666;
  --surface-bone-light-band: #f2f2f2;
  --surface-white-highlight: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #121212;
  --color-graphite: #303030;
  --color-mid-gray: #666666;
  --color-fog: #999999;
  --color-silver: #cccccc;
  --color-bone: #f2f2f2;
  --color-white: #ffffff;
  --color-signal-blue: #699fff;

  /* Typography */
  --font-shne-custom: 'Söhne (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.41;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 17px;
  --leading-body: 1.41;
  --text-subheading: 22px;
  --leading-subheading: 1.27;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.29;
  --text-heading: 36px;
  --leading-heading: 1.33;
  --text-display: 60px;
  --leading-display: 1;

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
  --spacing-96: 96px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgba(18, 18, 18, 0.1) 0px 0px 0px 1px inset;
}
```
