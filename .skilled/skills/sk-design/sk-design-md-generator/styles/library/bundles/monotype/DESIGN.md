# Monotype. — Style Reference
> Curated typography showcase on paper. Monotype's interface behaves like a gallery wall: white surfaces, hairline dividers, generous whitespace, and type itself as the only ornament.

**Theme:** light

Monotype's design is an editorial type museum on white: the type is the artifact, the chrome recedes. The interface is overwhelmingly monochrome — near-black ink (#1e242c) on paper-white, with hairline gray dividers and a single saturated blue reserved exclusively for conversion. Components are low-elevation and flat: thin 1px borders instead of shadows, modest 8px radii on controls, generous 16-24px internal padding. Typography is the hero: a custom HelveticaNow family handles body, nav, and display, with a -0.02em tracking on bold labels that signals the brand's typographic pedigree. Layout breathes — comfortable 8px base grid, 16px element gaps, wide section spacing — letting featured type specimens and photography carry visual weight without competition from the UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1e242c` | `--color-ink` | Primary text, nav borders, icon strokes, card borders — near-black with a barely-there cool tint reads as a refined alternative to pure black |
| Steel | `#576579` | `--color-steel` | Secondary text, muted nav links, subtle borders — the workhorse mid-gray for everything that must be quieter than body copy |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text on filled controls — the dominant surface |
| Mist | `#e7eaee` | `--color-mist` | Nav dividers, subtle section separators — the lightest functional border |
| Fog | `#dbdfe5` | `--color-fog` | Card borders, content block outlines — slightly darker than Mist for card-level separation |
| Ash | `#cfd5dd` | `--color-ash` | Button focus shadow, input hover rings — the mid-neutral for interaction feedback |
| Signal Blue | `#1a73e8` | `--color-signal-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Coal | `#000000` | `--color-coal` | Icon fills, SVG strokes — true black reserved for graphic assets only, not text |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### HelveticaNowMTDisplayMedium — Display headlines (page titles like 'Variable fonts') — the largest voice on the page, 57px with tight 1.12 line-height · `--font-helveticanowmtdisplaymedium`
- **Substitute:** Inter Tight, Helvetica Neue Display
- **Weights:** 500
- **Sizes:** 57px
- **Line height:** 1.12
- **Letter spacing:** normal
- **Role:** Display headlines (page titles like 'Variable fonts') — the largest voice on the page, 57px with tight 1.12 line-height

### HelveticaNowMTTextRegular — Body copy, nav items, buttons, article titles, card descriptions — the workhorse text family across 13/14/16px with line-heights that scale from tight nav (1.20) to generous article body (1.50) · `--font-helveticanowmttextregular`
- **Substitute:** Inter, Helvetica Neue
- **Weights:** 400
- **Sizes:** 13px, 14px, 16px
- **Line height:** 1.20-1.50
- **Role:** Body copy, nav items, buttons, article titles, card descriptions — the workhorse text family across 13/14/16px with line-heights that scale from tight nav (1.20) to generous article body (1.50)

### HelveticaNowMTTextBold — Bold labels, active nav states, emphasized article titles — the -0.02em tracking is a brand signature: tight enough to read as deliberate typographic craft · `--font-helveticanowmttextbold`
- **Substitute:** Inter Bold, Helvetica Neue Bold
- **Weights:** 700
- **Sizes:** 13px, 16px
- **Line height:** 1.23-1.50
- **Letter spacing:** -0.02em
- **Role:** Bold labels, active nav states, emphasized article titles — the -0.02em tracking is a brand signature: tight enough to read as deliberate typographic craft

### HelveticaNowMTMicroRegular — Micro-copy, metadata, breadcrumb text, tag labels — 11px with 2.55 line-height for very fine annotations; 14px version for small UI labels · `--font-helveticanowmtmicroregular`
- **Substitute:** Inter, system-ui
- **Weights:** 400
- **Sizes:** 11px, 14px
- **Line height:** 1.45-2.55
- **Role:** Micro-copy, metadata, breadcrumb text, tag labels — 11px with 2.55 line-height for very fine annotations; 14px version for small UI labels

### TypecaseVar — TypecaseVar — detected in extracted data but not described by AI · `--font-typecasevar`
- **Weights:** 400
- **Sizes:** 26px
- **Line height:** 1.2
- **Role:** TypecaseVar — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 1.45 | — | `--text-micro` |
| caption | 13px | 1.2 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 26px | 1.2 | — | `--text-subheading` |
| display | 57px | 1.12 | — | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 8px |
| images | 16px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.16) 0px 0px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-104px
- **Card padding:** 16-24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** High-emphasis conversion action

Filled #1a73e8 background, white text, 8px border-radius, 12px vertical / 24px horizontal padding. Uses HelveticaNowMTTextRegular at 16px weight 400. Single shadow: rgba(0,0,0,0.16) 0px 0px 2px 0px. Exclusively for 'Speak to sales' and similar conversion actions.

### Secondary Nav Button
**Role:** Navigation link in top bar

Transparent background, #1e242c text at 16px weight 400, no border, 12px horizontal padding. Hover/active states shift to #576579. Dropdown items use 8px radius container.

### Article Card
**Role:** Content card in resource/article grids

White surface, no shadow, 1px border in #dbdfe5 (Fog), 8px border-radius. 16px internal padding. Image at top with 16px border-radius. Title in HelveticaNowMTTextRegular 16px weight 400, #1e242c. No elevation — flat and editorial.

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-width #1e242c background, white text at 14px, 8px vertical padding, centered. Used for Monotype Connect and similar announcements.

### Search Bar
**Role:** Global font/foundry search

White background, 1px border in #e7eaee, 8px radius, ~40px height. Placeholder text in #576579. No prominent focus ring — subtle interaction.

### Breadcrumb
**Role:** Page hierarchy indicator

11-14px HelveticaNowMTMicroRegular, #576579 text, separated by '/' delimiter. No background, sits above page title with minimal vertical padding.

### Tab Navigation
**Role:** Secondary navigation under page title

Horizontal row of text links in HelveticaNowMTTextRegular 16px, #576579 default, #1e242c active. No underline, no background — purely typographic state change. 8px vertical padding, 16-24px horizontal spacing.

### Tag Label
**Role:** Content categorization badge

Inline text label, 11-14px HelveticaNowMTMicroRegular, #576579. No background or border — just muted text reading 'Tag: Variable fonts' as a plain annotation.

### Footer
**Role:** Site-wide footer

Dark #1e242c background, white and #576579 text, 1px top border. Column-based link grid in HelveticaNowMTTextRegular at 14-16px.

### Hero Image
**Role:** Featured article or type specimen image

16px border-radius, no border, no shadow. Full-bleed within card padding. Images carry the visual weight — the UI around them stays invisible.

## Do's and Don'ts

### Do
- Use #1a73e8 (Signal Blue) only on primary conversion actions — never on links, icons, or decorative elements
- Set body text in HelveticaNowMTTextRegular at 16px with line-height 1.50 for article-level readability
- Use 8px border-radius for all controls (buttons, inputs, cards) and 16px for images
- Apply -0.02em letter-spacing on all bold-weight text (13px and 16px) — this tracking is a brand signature
- Use #1e242c (Ink) for all primary text and borders — avoid pure #000000 for text
- Maintain 16px as the standard element gap; jump to 24px only for major control padding
- Let images and type specimens carry visual weight — keep surrounding UI borderless or hairline-bordered

### Don't
- Never use Signal Blue for anything other than the primary CTA fill — it loses all impact if scattered across links and icons
- Don't apply shadows beyond the single subtle button shadow (rgba(0,0,0,0.16) 0px 0px 2px 0px) — the design is intentionally flat
- Don't use HelveticaNowMTDisplayMedium below 40px — the display family is calibrated for large sizes only
- Don't add backgrounds to tab or nav states — use only color/weight changes to indicate active
- Don't introduce additional border-radius values — the system is binary: 8px for UI, 16px for images
- Don't use chromatic colors for status indicators, badges, or tags — everything meta stays in the gray scale
- Don't compress section spacing below 80px — the editorial breathing room is part of the identity

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the dominant surface |
| 1 | Card | `#ffffff` | Content cards and article tiles — same white, delineated only by 1px #dbdfe5 border |
| 2 | Overlay | `#1a73e8` | Primary action button surface — the only filled control |
| 3 | Inverted | `#1e242c` | Announcement bar and footer — dark inverted band |

## Elevation

- **Primary CTA Button:** `0px 0px 2px 0px rgba(0, 0, 0, 0.16)`

## Imagery

Photography and type specimens dominate visual space. Article cards feature bold, full-bleed images — close-up product shots, bold typographic compositions, video stills, and type specimens at large scale. Images are tightly cropped with no decorative framing, using 16px border-radius to soften without ornament. No illustrations, no abstract graphics, no icons-as-decoration. The imagery is documentary: it shows the work (fonts, branding projects, type in use) rather than illustrating concepts. Color within images is unrestricted — bright greens, bold yellows, dramatic blacks — but the UI chrome around them stays completely neutral, making the images feel like editorial photography in a design magazine.

## Layout

Max-width contained at ~1280px, centered. Top: full-width dark announcement bar, then white nav bar with logo left, search center, nav items and blue CTA right. Hero zone: large left-aligned display headline with breadcrumb above and horizontal tab navigation below — no full-bleed image hero. Content flows as a 3-column card grid for articles, with each card stacking image over title. Generous vertical rhythm: 80-104px between major sections. Navigation is a single top bar with dropdown menus, no sticky behavior visible. The page is text-and-image dominant, not dashboard-dense — the layout follows editorial magazine conventions, not product UI conventions.

## Agent Prompt Guide

## Quick Color Reference
- text: #1e242c (Ink)
- background: #ffffff (Paper)
- border: #dbdfe5 (Fog) for cards, #e7eaee (Mist) for dividers
- muted text: #576579 (Steel)
- accent: N/A (no decorative accent color in the system)
- primary action: #1a73e8 (filled action)

## Example Component Prompts
1. **Create a primary CTA button**: Filled #1a73e8 background, white text, HelveticaNowMTTextRegular 16px, 8px border-radius, 12px vertical / 24px horizontal padding, shadow 0px 0px 2px 0px rgba(0,0,0,0.16). Label: 'Speak to sales'.

2. **Create an article card**: White background, 1px border #dbdfe5, 8px border-radius, 16px internal padding. Top: image at 16px border-radius, no border. Below: title in HelveticaNowMTTextRegular 16px #1e242c, line-height 1.50.

3. **Create a page hero zone**: White background. Breadcrumb in HelveticaNowMTMicroRegular 11px #576579 above. Display headline 'Variable fonts' in HelveticaNowMTDisplayMedium 57px #1e242c, line-height 1.12, no letter-spacing. Tab row below in HelveticaNowMTTextRegular 16px, #576579 default, #1e242c active, 16-24px gap.

4. **Create a tab nav row**: Transparent background, no borders. Items in HelveticaNowMTTextRegular 16px #576579, active item in #1e242c. 8px vertical padding, 20-24px horizontal gap. No underline, no background change.

5. **Create an announcement bar**: Full-width #1e242c background, white text in HelveticaNowMTTextRegular 14px, centered, 8px vertical padding.

## Similar Brands

- **Google Fonts** — Same white-canvas editorial approach with a single blue accent for conversion; both treat type as the primary content
- **Type foundry sites (Hoefler & Co, Commercial Type)** — Same flat, image-forward editorial layout where type specimens and project photography dominate over UI chrome
- **It's Nice That** — Same magazine-style grid of editorial cards with generous whitespace and minimal UI ornamentation
- **Framer** — Same clean white canvas with a single chromatic action color and low-elevation flat components

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1e242c;
  --color-steel: #576579;
  --color-paper: #ffffff;
  --color-mist: #e7eaee;
  --color-fog: #dbdfe5;
  --color-ash: #cfd5dd;
  --color-signal-blue: #1a73e8;
  --color-coal: #000000;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmtdisplaymedium: 'HelveticaNowMTDisplayMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmttextregular: 'HelveticaNowMTTextRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmttextbold: 'HelveticaNowMTTextBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmtmicroregular: 'HelveticaNowMTMicroRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-typecasevar: 'TypecaseVar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.45;
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-display: 57px;
  --leading-display: 1.12;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-104px;
  --card-padding: 16-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 8px;
  --radius-images: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.16) 0px 0px 2px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-overlay: #1a73e8;
  --surface-inverted: #1e242c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1e242c;
  --color-steel: #576579;
  --color-paper: #ffffff;
  --color-mist: #e7eaee;
  --color-fog: #dbdfe5;
  --color-ash: #cfd5dd;
  --color-signal-blue: #1a73e8;
  --color-coal: #000000;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmtdisplaymedium: 'HelveticaNowMTDisplayMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmttextregular: 'HelveticaNowMTTextRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmttextbold: 'HelveticaNowMTTextBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticanowmtmicroregular: 'HelveticaNowMTMicroRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-typecasevar: 'TypecaseVar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.45;
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-display: 57px;
  --leading-display: 1.12;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.16) 0px 0px 2px 0px;
}
```
