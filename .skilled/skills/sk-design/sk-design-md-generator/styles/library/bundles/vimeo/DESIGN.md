# Vimeo — Style Reference
> Spotlight on matte white

**Theme:** mixed

Vimeo's visual language treats the page as a matte white gallery wall where one electric cyan accent acts as the only spotlight. The dominant canvas is near-white (#fafcfd) with a deep ink (#141a20) used sparingly for cinematic dark bands, and a single vivid #17d5ff cyan that appears exclusively on action elements — never on decoration, illustration, or background fills. Typography carries the brand's editorial weight: a custom neo-grotesque (ABCRepro) at 400/500/700 with aggressive negative tracking at display sizes (-0.05em at 72px), tight 1.20 leading on body, and 1.00 leading on oversized headlines that makes them feel architectural. The layout alternates between breathing light sections and dense dark platforms, creating a vertical rhythm that mirrors the site's own product (lightness for browsing, darkness for viewing). Components are flat, low-elevation, and slightly rounded — 8px on buttons and inputs, 16px on cards, 9999px on tags. Density is compact: 8px and 16px do the heavy lifting, with 24px marking section breaks rather than breathing room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cyan Signal | `#17d5ff` | `--color-cyan-signal` | Primary action background, active nav, the single brand chromatic — filled CTAs and selected states. Electric against matte white, cool enough to feel like light rather than pigment |
| Cyan Depth | `#13b1d4` | `--color-cyan-depth` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Ink Black | `#141a20` | `--color-ink-black` | Dark section backgrounds (platform showcase bands, footer), filled dark buttons. Near-black with a cool blue undertone that keeps it on-brand rather than neutral |
| Carbon | `#0a0e12` | `--color-carbon` | Primary text, heading color, strongest dark neutral for text on light surfaces and borders on dark surfaces |
| Slate | `#23313b` | `--color-slate` | Secondary text, footer borders, muted UI elements. Cool gray-blue that bridges between the dark ink and mid-grays |
| Graphite | `#3d4751` | `--color-graphite` | Tertiary text, outlined action borders, link colors. The mid-tone that carries most secondary information |
| Steel | `#4c5864` | `--color-steel` | Navigation borders, body text secondary level, card text. Lighter mid-gray for tertiary UI structure |
| Fog | `#a9b2bc` | `--color-fog` | Muted helper text, disabled states, low-emphasis borders. The softest mid-gray for de-emphasized content |
| Cloud | `#dfe4ea` | `--color-cloud` | Subtle background fills, nav hover states, light surface layer above the white canvas |
| Paper | `#fafcfd` | `--color-paper` | Page canvas, card surfaces, primary background. The near-white with a barely-perceptible cool tint — cleaner than pure white, warmer than #fff |
| Midnight | `#192028` | `--color-midnight` | Dark card surface, elevated dark panels above #141a20 backgrounds. Used for layered dark UI |

## Tokens — Typography

### ABCRepro — Primary typeface for all UI text. Weight 400 for body and descriptions, 500 for emphasized body and subheadings, 700 for headings and buttons. The custom neo-grotesque has tight apertures and mechanical terminals; at display sizes (40-72px) the tight tracking (-0.05em) and 1.00 leading make headlines feel architectural rather than decorative. At body sizes (16px) it reads as clean, slightly condensed, editorial — closer to a European tech product than a warm consumer brand. · `--font-abcrepro`
- **Substitute:** Inter, Untitled Sans, Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 10, 12, 13, 14, 16, 18, 19, 20, 24, 32, 40, 72
- **Line height:** 1.00, 1.10, 1.14, 1.20, 1.30, 1.35, 1.40, 1.58
- **Letter spacing:** -0.0500em at 72px display, -0.0400em at 40px, -0.0360em at 32px, -0.0300em at 19-20px subheadings, near-zero at body sizes
- **OpenType features:** `\"lnum\"`
- **Role:** Primary typeface for all UI text. Weight 400 for body and descriptions, 500 for emphasized body and subheadings, 700 for headings and buttons. The custom neo-grotesque has tight apertures and mechanical terminals; at display sizes (40-72px) the tight tracking (-0.05em) and 1.00 leading make headlines feel architectural rather than decorative. At body sizes (16px) it reads as clean, slightly condensed, editorial — closer to a European tech product than a warm consumer brand.

### ABCReproMono — Monospace accent for code-like or technical labels. Used sparingly — only when mechanical/technical voice is needed. · `--font-abcrepromono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.00
- **Letter spacing:** -0.0300em
- **OpenType features:** `\"lnum\"`
- **Role:** Monospace accent for code-like or technical labels. Used sparingly — only when mechanical/technical voice is needed.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.58 | — | `--text-body` |
| subheading | 20px | 1.3 | -0.6px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.72px | `--text-heading-sm` |
| heading | 32px | 1.14 | -1.15px | `--text-heading` |
| heading-lg | 40px | 1.1 | -1.6px | `--text-heading-lg` |
| display | 72px | 1 | -3.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

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
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| badges | 8px |
| images | 8px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(85, 85, 85) 0px 0px 0px 10000px` | `--shadow-subtle` |
| subtle-2 | `rgb(34, 51, 34) 0px 0px 0px 10000px` | `--shadow-subtle-2` |
| subtle-3 | `rgb(17, 17, 17) 0px 0px 0px 10000px` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 20-24px
- **Element gap:** 8-16px

## Components

### Filled Cyan CTA
**Role:** Primary action button

Background #17d5ff, text #141a20 (dark on bright cyan), 8px radius, padding 8px 16px or 12px 20px, font ABCRepro 500 at 16px, includes arrow icon (→) at 16px. Used for 'Join', 'See plans', 'Request a demo'. This is the only chromatic button fill in the system.

### Ghost Text Link Button
**Role:** Secondary action with arrow

No background, no border, text #fafcfd (white) on dark sections or #0a0e12 on light, 8px radius, ABCRepro 500 at 16px, trailing arrow icon. Used for 'Start for free', 'Learn about video hosting'. Pure typography carries the action.

### Dark Pill Button
**Role:** Tertiary action on light backgrounds

Background #141a20, text #fafcfd, 9999px radius (pill), padding 8px 16px, ABCRepro 500 at 14px. Used for 'Learn about video collaboration', 'Learn about video player'. The dark pill on white creates a secondary CTA tier below the cyan primary.

### Outlined Cookie/Action Button
**Role:** Bordered neutral action

Transparent background, border 1px #fafcfd (or #0a0e12 on light), text matching border color, 9999px radius, padding 6px 16px, ABCRepro 500 at 14px. Used for 'Accept all', 'Reject all' in the cookie consent.

### Top Navigation Bar
**Role:** Global header navigation

Background #fafcfd, height ~64px, logo left, nav links center (ABCRepro 500 at 14px, #141a20), 'Contact sales' text link + 'Join' cyan CTA right. Subtle bottom border in #dfe4ea or transparent. Sticky behavior implied by the flat design language.

### Hero Section
**Role:** Full-bleed page header with overlay text

Full-width background image with dark gradient overlay, centered text stack. Overline label in ABCRepro 500 at 12px, letter-spacing wide, uppercase, white. Display headline at 72px weight 500, white, line-height 1.00, letter-spacing -3.6px. Subtext at 16px weight 400, white at ~80% opacity, max-width ~480px. Two-button row: Filled Cyan CTA + Ghost Text Link.

### Feature Card
**Role:** Three-column feature grid item

16px radius, internal padding 20px, contains a product screenshot/image at top (8px radius), heading at 19-20px weight 500 #fafcfd, body text at 14px weight 400 #a9b2bc, trailing Dark Pill Button. Used on dark sections with #141a20 background.

### Platform Showcase Section
**Role:** Dark band with content

Background #141a20, full-width, padding 80px vertical. Centered heading at 40px weight 500, #fafcfd. Content area below uses Feature Card grid (3 columns, 24px gap). The dark band creates the platform's signature light/dark/light rhythm.

### Decorative Blob Section
**Role:** Light section with soft background shape

White canvas with a large, very pale (#fafcfd or #dfe4ea at low opacity) organic blob shape behind centered content. Heading + body + single Filled Cyan CTA centered. The blob is barely visible — more felt than seen, giving depth without distraction.

### Cookie Consent Banner
**Role:** Overlay consent dialog

Fixed bottom-center, background #fafcfd, 16px radius, padding 20-24px, max-width ~600px. Heading at 16px weight 700 #0a0e12, body at 14px weight 400 #4c5864. Two Outlined Cookie Buttons right-aligned: 'Accept all', 'Reject all'. Footer row with 'More choices' and 'See our privacy policy' text links.

### Video Player Thumbnail
**Role:** Product preview with play overlay

16:9 or similar video aspect, 8px radius, background shows video frame. Bottom-right overlay: cyan #17d5ff play button circle (32px) + label text 'See why millions love Vimeo'. Represents the product surface within marketing.

### Navigation Dropdown
**Role:** Mega-menu for Features/Use cases/Enterprise

Triggered by chevron-down on top-level nav items. White background, 8-12px radius, subtle shadow or border, multi-column layout with section headings and link lists. Links in ABCRepro 400 at 14px #141a20, hover state in #17d5ff.

## Do's and Don'ts

### Do
- Use #17d5ff cyan exclusively for primary action backgrounds — filled CTAs, active states, the play button. Never use it as a decorative fill, illustration color, or large background area.
- Apply negative letter-spacing aggressively at display sizes: -3.6px at 72px, -1.6px at 40px, -1.15px at 32px. Body text (16px and below) should have near-zero tracking.
- Keep body text leading generous: 1.58 at 16px for descriptions, 1.20-1.30 for headings. The 1.00 leading on the 72px display is a signature choice — make it architectural, not crowded.
- Alternate between light (#fafcfd) and dark (#141a20) full-width sections to create vertical rhythm. The dark band is for content showcases; the light canvas is for browsing.
- Use 8px radius for all interactive elements (buttons, inputs, badges, images). Reserve 16px for cards and 9999px for pill shapes. Never mix 4px and 6px into the system.
- Set font-feature-settings: 'lnum' on all text using ABCRepro to ensure lining numerals throughout the interface.
- Maintain compact density: 8px and 16px for element gaps, 20-24px for card padding, 64-80px for section breaks. Do not add extra breathing room 'for elegance' — the density is the point.

### Don't
- Don't use #17d5ff for body text, backgrounds, or any non-action element. If you need a colored element, it's almost certainly wrong.
- Don't add shadows for elevation. Vimeo's UI is flat — use background color contrast (#fafcfd vs #dfe4ea) and borders for separation, not box-shadows.
- Don't use letter-spacing greater than 0 on headings. The tight tracking is signature; positive tracking would make headlines feel generic.
- Don't place content at full viewport width. Max content width is 1200px with comfortable margins. Hero images may be full-bleed, but text and cards are always contained.
- Don't introduce additional accent colors. The system is monochrome + one cyan. Adding a second brand color (green for success, red for error) breaks the editorial restraint.
- Don't use ABCRepro at weight 300 or 600 — only 400, 500, and 700 are defined. If a middle weight feels needed, use 500.
- Don't center-align body text. Descriptions and paragraphs are always left-aligned. Only headlines and short labels may be centered.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#fafcfd` | Primary page background for all light sections |
| 1 | Cloud Lift | `#dfe4ea` | Subtle background fills, nav hover states, soft surface layer |
| 2 | Ink Platform | `#141a20` | Dark section backgrounds for platform showcases |
| 3 | Midnight Card | `#192028` | Elevated dark panels layered above #141a20 |
| 4 | Cyan Action | `#17d5ff` | Interactive fill for primary CTAs — the only chromatic surface |

## Elevation

Vimeo uses a flat design system with no drop-shadows for elevation. Surface separation is achieved through background color contrast (Paper → Cloud → Ink) and hairline borders in #dfe4ea or #23313b. The 10000px-spread shadows detected in the data are for overlay/lightbox scrims (cookie consent backdrop), not component elevation. Cards sit on the same plane as their parent background — distinguished by padding and internal structure, not shadow.

## Imagery

Vimeo's visual language is photography-first on the hero (full-bleed editorial imagery of creators and their work — hands on keyboards, workspaces, creative environments) and product-screenshot-first for feature sections (actual Vimeo player UI, dashboard previews, embed examples). Imagery is always contained with 8px radius corners, never raw-edged or full-bleed except for the hero. The product screenshots are presented in dark frames (#141a20) even on light backgrounds, creating a 'screen within a page' effect that reinforces the video platform identity. No illustration style is used — visuals are either real photography or actual product UI.

## Layout

The page uses a max-width 1200px content container centered on the Paper canvas. The hero is the only full-bleed element — a full-width background image with a centered text stack overlaid. Below the hero, sections alternate between light and dark bands: a light 'Built for how you work' section with a subtle decorative blob, then a dark 'The platform that powers your video strategy' platform showcase with a 3-column feature card grid, followed by additional light content sections. Navigation is a flat top bar (64px) with logo left, centered menu items, and a cyan CTA right. Section gaps are 64-80px creating clear vertical rhythm. Card grids are consistently 3-column at desktop with 24px gaps. Content density is compact: descriptions are 1-2 sentences max, and feature cards use minimal text with a clear 'Learn more' dark pill CTA.

## Agent Prompt Guide

primary action: #17d5ff (filled action)
Create a Primary Action Button: #17d5ff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Linear** — Same dark-and-light section alternation with one vivid accent color (purple vs Vimeo's cyan), tight neo-grotesque typography with negative tracking at display sizes, and flat components with small radii.
- **Descript** — Creator-focused media platform with the same compact density, near-white canvas, single brand accent, and editorial typography attitude. Both treat body text as tight and functional.
- **Webflow** — Same light-page-with-dark-bands rhythm, custom neo-grotesque typography with aggressive negative tracking, and a single chromatic accent used exclusively for primary actions.
- **Pitch** — Shared visual DNA: matte white canvas, one electric accent color, compact 8px-radius buttons, tight 1.0 leading on display headlines, and the same flat-component-no-shadow philosophy.
- **Frame.io** — Direct competitor in video collaboration with the same near-white canvas, dark platform sections, and single-accent action language — both are media tools that let the work be the visual hero.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cyan-signal: #17d5ff;
  --color-cyan-depth: #13b1d4;
  --color-ink-black: #141a20;
  --color-carbon: #0a0e12;
  --color-slate: #23313b;
  --color-graphite: #3d4751;
  --color-steel: #4c5864;
  --color-fog: #a9b2bc;
  --color-cloud: #dfe4ea;
  --color-paper: #fafcfd;
  --color-midnight: #192028;

  /* Typography — Font Families */
  --font-abcrepro: 'ABCRepro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcrepromono: 'ABCReproMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.58;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 32px;
  --leading-heading: 1.14;
  --tracking-heading: -1.15px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Typography — Weights */
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
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 20-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-badges: 8px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgb(85, 85, 85) 0px 0px 0px 10000px;
  --shadow-subtle-2: rgb(34, 51, 34) 0px 0px 0px 10000px;
  --shadow-subtle-3: rgb(17, 17, 17) 0px 0px 0px 10000px;

  /* Surfaces */
  --surface-paper-canvas: #fafcfd;
  --surface-cloud-lift: #dfe4ea;
  --surface-ink-platform: #141a20;
  --surface-midnight-card: #192028;
  --surface-cyan-action: #17d5ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cyan-signal: #17d5ff;
  --color-cyan-depth: #13b1d4;
  --color-ink-black: #141a20;
  --color-carbon: #0a0e12;
  --color-slate: #23313b;
  --color-graphite: #3d4751;
  --color-steel: #4c5864;
  --color-fog: #a9b2bc;
  --color-cloud: #dfe4ea;
  --color-paper: #fafcfd;
  --color-midnight: #192028;

  /* Typography */
  --font-abcrepro: 'ABCRepro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcrepromono: 'ABCReproMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.58;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 32px;
  --leading-heading: 1.14;
  --tracking-heading: -1.15px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.6px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(85, 85, 85) 0px 0px 0px 10000px;
  --shadow-subtle-2: rgb(34, 51, 34) 0px 0px 0px 10000px;
  --shadow-subtle-3: rgb(17, 17, 17) 0px 0px 0px 10000px;
}
```
