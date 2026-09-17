# Sonos — Style Reference
> Gallery wall of warm light

**Theme:** light

Sonos operates in a deliberate visual void — pure achromatic black, white, and gray with zero chromatic accent. The interface is a frame for photography rather than a canvas of color; lifestyle imagery of people in warm-lit spaces does every emotional job that a brand color would normally carry. Typography is the only voice: aktiv-grotesk at dramatic scale, with display sizes reaching 96px and tight 1.0 line-height creating poster-like headlines that float over full-bleed photography. Components are reduced to their silhouettes — pill-shaped buttons (80px radius), minimal navigation, generous breathing room — letting product photography and large type carry the entire identity. The result is a luxury-electronics aesthetic where restraint signals premium, not austerity.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Concrete | `#f5f5f5` | `--color-concrete` | Dominant page canvas, section backgrounds, elevated surface wash |
| Graphite | `#2e2e2e` | `--color-graphite` | Dark surface panels, secondary dark fill, text on light cards |
| Mist | `#e0e0e0` | `--color-mist` | Hairline borders, subtle separators, box-shadow tint on cards |
| Ash | `#cdcdcd` | `--color-ash` | Visible borders, dividers between sections or card edges |
| Smoke | `#bfbfbf` | `--color-smoke` | Button hover borders, outline stroke, subtle elevation shadow base |
| Slate | `#737373` | `--color-slate` | Muted secondary text, icon strokes on light surfaces, metadata labels |
| Charcoal | `#5f5f5f` | `--color-charcoal` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |

## Tokens — Typography

### aktiv-grotesk — Sole typeface. Body text at 400 weight 16px with 1.5 line-height. Headlines scale dramatically to 64–96px at 400 weight with line-height 1.0 for poster-like impact. Nav and buttons use 500–700 at 14–16px. The dramatic size range and tight display leading are the signature — type is the only brand voice since color is absent. · `--font-aktiv-grotesk`
- **Substitute:** Inter, Söhne, or Suisse Int'l
- **Weights:** 400, 500, 700
- **Sizes:** 13px, 14px, 16px, 18px, 21px, 32px, 40px, 48px, 64px, 72px, 96px
- **Line height:** 1.00–1.50 (tighter as size increases: 1.50 for body, 1.00 for display)
- **Role:** Sole typeface. Body text at 400 weight 16px with 1.5 line-height. Headlines scale dramatically to 64–96px at 400 weight with line-height 1.0 for poster-like impact. Nav and buttons use 500–700 at 14–16px. The dramatic size range and tight display leading are the signature — type is the only brand voice since color is absent.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.3 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 21px | 1.3 | — | `--text-subheading` |
| heading-sm | 32px | 1.2 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.2 | — | `--text-heading-lg` |
| display | 64px | 1 | — | `--text-display` |
| display-lg | 96px | 1 | — | `--text-display-lg` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 160 | 160px | `--spacing-160` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 20px |
| cards | 20px |
| pills | 9999px |
| small | 10px |
| buttons | 80px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.627) 0px 0px 3px 0px inset, rgb(0, 0, 0) ...` | `--shadow-subtle` |
| lg | `rgba(0, 0, 0, 0.25) 0px 0px 24px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 48px
- **Element gap:** 16px

## Components

### Filled Dark Pill Button
**Role:** Primary call-to-action on light backgrounds

Background #000000, text #ffffff, 80px border-radius (full pill), aktiv-grotesk 16px weight 500, padding 16px 32px. Inset dark shadow gives subtle bevel. Used for "Explorar todo" in hero.

### Filled White Pill Button
**Role:** Primary call-to-action on dark/photographic backgrounds

Background #ffffff, text #000000, 80px border-radius, 16px weight 500, padding 16px 32px. Sits on top of hero photography for high contrast.

### Ghost Outlined Pill Button
**Role:** Secondary action, information request

Transparent background, 1px border #ffffff (on dark) or #000000 (on light), 9999px radius, text matches border color. 16px weight 500, padding 16px 32px.

### Hero Section
**Role:** Full-bleed landing visual

Edge-to-edge photographic background (no gradient overlay), centered text block with display headline 64–96px weight 400, line-height 1.0, white text, and two pill buttons stacked horizontally. Text sits at vertical center, no gradient or scrim — relies on photographic contrast.

### Product Image Card
**Role:** Showcase individual products or features

Full-width photographic card, 20px border-radius, white text overlay positioned bottom-left, 48px padding, white ghost pill button. Image bleeds to card edges with rounded clipping.

### Music Grid Section
**Role:** Content discovery — radio stations, playlists

Dark background #000000, dense grid of square thumbnail tiles (6–8 columns), each tile is a colorful album/playlist cover. Section headline 48px weight 400 in white, positioned left-aligned with ghost button below.

### Display Heading
**Role:** Section-defining statement

aktiv-grotesk 64–96px weight 400, line-height 1.0, #000000 on light sections, #ffffff on dark. No font-weight bolding — the sheer size carries authority. Centered or left-aligned depending on context.

### Top Announcement Bar
**Role:** Promotional message strip

Full-width #000000 bar, 40–48px height, white text 14px weight 400 centered, dismiss X icon left, text link right. Sits above navigation.

### Primary Navigation
**Role:** Site-wide navigation

White #ffffff background, horizontal layout. SONOS wordmark left (16px weight 700, letter-spacing wide). Center: text links 14px weight 400 (#000000). Right: icon trio — account, search, cart — 24px outlined icons, #000000 stroke. No background fill on nav items.

### Body Text Block
**Role:** Standard paragraph content

16–18px weight 400, line-height 1.5, #000000. Maximum width 640px for readability. No decorative treatment — pure clean paragraph.

### Footer Link Group
**Role:** Site footer navigation columns

Multiple columns of 14px text links, #000000, 16px row-gap. Section headers in 14px weight 700 uppercase or weight 500.

### Scroll Indicator
**Role:** Audio/video playback control

Small circular button 32px, 1px border #ffffff or #000000, contains play/pause icon. Sits fixed in corner of media sections.

## Do's and Don'ts

### Do
- Use 80px or 9999px border-radius on all buttons and interactive pills — pill shapes are the signature component geometry
- Set display headlines at 64–96px weight 400 with line-height 1.0 — let scale, not weight, carry authority
- Fill the viewport with photography at full bleed with no gradient overlay or scrim — contrast is created by the image itself
- Build the entire palette from #000000, #ffffff, #f5f5f5, and #2e2e2 — no chromatic accents in the UI system
- Use #ffffff for card surfaces on the #f5f5f5 canvas — the subtle off-white separation creates the surface hierarchy without borders
- Pad section content with 48–80px vertical gaps and 48px horizontal card padding — generous whitespace is structural, not decorative
- Use 14px weight 500 at 9999px radius for inline tags, status pills, and category labels

### Don't
- Never introduce a chromatic color — the 0% colorfulness is deliberate; photography carries all emotional color
- Don't bold headlines at 600–700 weight — the system uses 400 at massive size instead; bolding flattens the dramatic scale
- Don't add visible borders between most sections — use background color shifts from #f5f5f5 to #ffffff to #000000 to create separation
- Don't apply line-height above 1.2 to display sizes — the tight 1.0 leading is what makes 96px feel like a poster, not a paragraph
- Don't use box-shadow on cards for elevation — if depth is needed, use surface color layering (gray 50 → white → dark 900), not shadows
- Don't use sharp corners (0–4px radius) on primary UI elements — only on small utility elements or data tables; the system is built on soft curves
- Don't center-align body text or long-form copy — only display headlines center; body stays left-aligned with a 640px max-width

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f5` | Dominant page background across all sections |
| 1 | Card | `#ffffff` | Elevated white surfaces — product cards, button fills, nav background |
| 2 | Border | `#e0e0e0` | Hairline separators and card edges |
| 3 | Dark Surface | `#2e2e2` | Dark panels and inverted section backgrounds |
| 4 | Void | `#000000` | Deepest surface — navigation, primary button fills, full-bleed dark sections |

## Elevation

- **Filled Button:** `rgba(0, 0, 0, 0.627) 0px 0px 3px 0px inset, rgb(0, 0, 0) 0px 0px 3px 0px`
- **Elevated Button:** `rgba(0, 0, 0, 0.25) 0px 0px 24px 0px`

## Imagery

Photography is the only color in the system. Lifestyle imagery dominates: warm-lit domestic interiors, people interacting with speakers in living rooms and on patios, golden-hour and ambient natural light. Shots are candid rather than staged, mid-action (hands placing a speaker, someone walking through a sunlit room). No studio product shots against white — products are always shown in context within lived-in spaces. The second layer is content imagery: colorful album artwork and playlist cover tiles in dense grids, which provide the only chromatic color on the entire site. No illustrations, no abstract graphics, no 3D renders. Iconography is minimal and outlined: 1px stroke, 24px size, monochrome black or white depending on surface.

## Layout

Max-width 1440px centered content with full-bleed photographic sections that break the container. The page model alternates between cinematic full-viewport moments and tight content sections: hero is full-bleed image with centered overlay text, followed by a white product image card section, then a dark music grid section. Section rhythm uses background color alternation (light → white → dark) rather than dividers or borders. Content is predominantly left-aligned in text blocks; product cards and hero text center. Grid usage is limited — single-column text stacks and 2-column image+text splits dominate, with a dense 6–8 column thumbnail grid only for content discovery (music/playlists). Navigation is a single white bar with no sticky behavior and no mega-menu — minimal horizontal text links. Vertical spacing between sections is generous (80px+) creating breathing room between photographic moments.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (on light) / #ffffff (on dark)
- background: #f5f5f5 (page canvas) / #ffffff (cards)
- border: #e0e0e0 (hairline) / #cdcdcd (visible)
- primary action: no distinct CTA color
- dark surface: #2e2e2e

Example Component Prompts:
1. Create a hero section: full-bleed photographic background (no overlay/scrim). Centered headline at 72px aktiv-grotesk weight 400, line-height 1.0, color #ffffff. Below: a row of two pill buttons (80px radius, 16px weight 500, padding 16px 32px) — one filled #ffffff with #000000 text, one filled #000000 with #ffffff text.
2. Create a product feature card: full-width container, 20px border-radius, photographic background filling the card. Bottom-left overlay with a 32px subheading in #ffffff, a 48px heading in #ffffff, and a ghost pill button (1px border #ffffff, transparent fill, 9999px radius, #ffffff text).
3. Create a music discovery section: background #000000, full viewport. Left-aligned headline at 48px aktiv-grotesk weight 400 in #ffffff, a 16px body paragraph in #ffffff, and a ghost pill button (1px #ffffff border, 9999px radius). Right side: 6-column grid of 1:1 thumbnail tiles with 8px gaps.
4. Create a content section: #f5f5f5 background, centered display heading at 64px weight 400 line-height 1.0 in #000000, followed by a 2-column row of white #ffffff cards (20px radius, 48px padding) each containing a 21px subheading and 16px body text.
5. Create a top announcement bar: #000000 background, 44px height, full-width. Centered 14px text in #ffffff. Left: X dismiss icon in #ffffff. Right: text link in #ffffff.

## Similar Brands

- **Apple** — Full-bleed lifestyle photography, massive-weight-400 display type, and a pure black/white/gray product UI with no chromatic accents
- **Bang & Olufsen** — Premium audio with pure monochromatic palette, large minimal type, and product photography carrying all warmth and color
- **Teenage Engineering** — Black/white/gray-only product design language with geometric sans-serif type and generous negative space
- **Nothing (tech)** — Achromatic dot-matrix aesthetic with pill-shaped UI elements and high-contrast type-only hierarchy
- **Bose** — Audio brand using full-bleed lifestyle imagery over near-white canvases with minimal type and pill-shaped CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-concrete: #f5f5f5;
  --color-graphite: #2e2e2e;
  --color-mist: #e0e0e0;
  --color-ash: #cdcdcd;
  --color-smoke: #bfbfbf;
  --color-slate: #737373;
  --color-charcoal: #5f5f5f;

  /* Typography — Font Families */
  --font-aktiv-grotesk: 'aktiv-grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.3;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 64px;
  --leading-display: 1;
  --text-display-lg: 96px;
  --leading-display-lg: 1;

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
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-160: 160px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 48px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-full: 60px;
  --radius-full-2: 80px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-nav: 20px;
  --radius-cards: 20px;
  --radius-pills: 9999px;
  --radius-small: 10px;
  --radius-buttons: 80px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.627) 0px 0px 3px 0px inset, rgb(0, 0, 0) 0px 0px 3px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.25) 0px 0px 24px 0px;

  /* Surfaces */
  --surface-canvas: #f5f5f5;
  --surface-card: #ffffff;
  --surface-border: #e0e0e0;
  --surface-dark-surface: #2e2e2;
  --surface-void: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-concrete: #f5f5f5;
  --color-graphite: #2e2e2e;
  --color-mist: #e0e0e0;
  --color-ash: #cdcdcd;
  --color-smoke: #bfbfbf;
  --color-slate: #737373;
  --color-charcoal: #5f5f5f;

  /* Typography */
  --font-aktiv-grotesk: 'aktiv-grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.3;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --text-display: 64px;
  --leading-display: 1;
  --text-display-lg: 96px;
  --leading-display-lg: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-160: 160px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-full: 60px;
  --radius-full-2: 80px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.627) 0px 0px 3px 0px inset, rgb(0, 0, 0) 0px 0px 3px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.25) 0px 0px 24px 0px;
}
```
