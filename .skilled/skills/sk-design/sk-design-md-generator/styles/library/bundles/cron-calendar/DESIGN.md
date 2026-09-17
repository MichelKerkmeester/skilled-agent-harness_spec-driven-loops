# Cron Calendar — Style Reference
> Ember in an obsidian void — one warm orange spark burning against a near-black canvas.

**Theme:** dark

Cron uses a near-monochrome dark canvas with a single ember-orange accent — the visual logic of a luminous clock face in an unlit room. Almost every surface, border, and text element lives in a narrow band of near-black, warm-gray, and white, reserving #ff4700 exclusively for primary actions and brand moments. Type does the heavy lifting: a single 140px display headline at weight 700 with aggressive negative tracking commands the hero, while the rest of the system stays at 13–22px Helvetica Neue. Components are stripped to essentials — a pill-shaped nav chip, a glowing filled CTA, hairline borders, and product screenshots that float on the dark canvas. There are no gradients, no decorative illustrations, and no secondary hues: the design earns its identity through contrast, scale, and restraint.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember | `#ff4700` | `--color-ember` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember Glow | `#8b2e09` | `--color-ember-glow` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember Smoke | `#451e0e` | `--color-ember-smoke` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Obsidian | `#0f0d0a` | `--color-obsidian` | Page canvas and footer background — the base near-black with a faint warm bias that keeps the UI from feeling clinical |
| Graphite | `#161412` | `--color-graphite` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Ash | `#cccccc` | `--color-ash` | Body copy, secondary text, hairline borders, icon strokes, footer dividers — the warm neutral that carries the majority of UI content at 95 occurrences |
| Bone | `#ffffff` | `--color-bone` | Display headlines, primary headings, nav text, button text on dark fills, and image elements — the highest-contrast white reserved for moments that must shout |

## Tokens — Typography

### Helvetica Neue — Single system sans family carries the entire voice. The 140px weight-700 display with -0.0210em tracking and 0.90 line-height is the signature — a massive, tightly-set headline that functions almost as a logotype. Body copy sits at 15px/1.50, small meta and nav at 13px, and 22px serves as the subheading bridge between body and display. · `--font-helvetica-neue`
- **Substitute:** Inter, Neue Haas Grotesk, or system-ui as freely available alternatives
- **Weights:** 400, 500, 700
- **Sizes:** 13px, 15px, 22px, 140px
- **Line height:** 0.90 (display), 1.00, 1.50 (body), 1.70, 2.88
- **Letter spacing:** -0.0210em on display (140px), 0.0100em on small text (13px)
- **Role:** Single system sans family carries the entire voice. The 140px weight-700 display with -0.0210em tracking and 0.90 line-height is the signature — a massive, tightly-set headline that functions almost as a logotype. Body copy sits at 15px/1.50, small meta and nav at 13px, and 22px serves as the subheading bridge between body and display.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.7 | 0.13px | `--text-caption` |
| body | 15px | 1.5 | — | `--text-body` |
| subheading | 22px | 1 | — | `--text-subheading` |
| display | 140px | 0.9 | -2.94px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| buttons | 4px |
| navPills | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary CTA Button (Glowing)
**Role:** The sole filled action in the system — used for Sign up and any high-intent conversion moment

Filled with #ff4700, white text at 15px weight 500, 4px border-radius, horizontal padding ~16px, vertical padding ~12px. Surrounded by a dual-layer warm box-shadow: an inner 1px #451e0 ring and an outer 24px/4px #8b2e09 blur. The glow makes the button appear to emit light against the Obsidian void.

### Ghost Nav Pill
**Role:** Navigation items and announcement banner triggers

Transparent fill, no border, Ash (#cccccc) or Bone (#ffffff) text at 15px weight 400, fully rounded at 9999px radius. The announcement chip ('Cron is now Notion Calendar →') uses a 1px Ash border with the same pill geometry and Graphite (#161412) background.

### Outlined Announcement Banner
**Role:** Contextual news or product update prompts above the hero

Graphite (#161412) background, 1px Ash (#cccccc) border, 9999px pill radius, centered text at 13–15px with an inline arrow glyph. Sits as a quiet dark chip with no fill color competing with the CTA.

### Display Headline Block
**Role:** Hero title — the visual anchor of every page

Single line of 140px Helvetica Neue weight 700, line-height 0.90, letter-spacing -2.94px (-0.021em). Bone (#ffffff) on Obsidian. No underline, no accent color — the scale and weight alone command the page.

### Subheadline
**Role:** Supporting sentence beneath the display headline

15px weight 400, line-height 1.50, Ash (#cccccc) color, centered. Intentionally small and quiet — the display headline does the work.

### Product Screenshot Card
**Role:** Desktop and mobile app previews in the hero and feature sections

Raw screenshots placed directly on the Obsidian canvas with no border, no card background, no shadow. The product UI (which is itself a dark-mode calendar) blends seamlessly with the page surface — a deliberate choice that makes the product feel native to the brand environment.

### Top Navigation Bar
**Role:** Site-wide header with logo, links, and CTA

Transparent background, no border or shadow. Cron logomark (orange circle + 'cron' wordmark in white) on the left. Nav links (Blog, Changelog, Docs, Login) as ghost pills in white at 15px. Sign up CTA pinned to the far right as the glowing filled button. Generous horizontal padding (~140px each side) with a max-width container.

### Footer
**Role:** Closing block with secondary links and legal

Obsidian (#0f0d0a) background, Ash (#cccccc) text and links at 13px, no dividers or cards. Stays as flat text on the canvas.

## Do's and Don'ts

### Do
- Use #ff4700 exclusively for the primary CTA and brand mark — no other UI element should carry a chromatic fill
- Set the display headline at exactly 140px weight 700 with -0.021em letter-spacing and 0.90 line-height to preserve the signature logotype-like scale
- Use 4px radius for all standard buttons and 9999px for nav pills, tags, and announcement chips — these two radii define the component geometry
- Let the primary CTA glow with the dual-layer warm shadow (inner #451e0 ring, outer #8b2e09 blur) — this is the only place in the system where elevation exists
- Place product screenshots directly on the #0f0d0a canvas without frames, borders, or device mockups
- Keep the chromatic palette to a single orange — resist adding secondary brand colors, status hues, or illustration palettes
- Use #cccccc for all body copy, meta text, borders, and icons; reserve #ffffff for headings, nav, and content that must read first

### Don't
- Do not add drop-shadow elevation to cards, nav, or secondary elements — separation comes from tonal contrast on the dark canvas only
- Do not use the display 140px scale for anything other than the hero headline — at body level it destroys the rhythm
- Do not introduce gradients, decorative illustrations, or background patterns — the Obsidian void must stay uninterrupted
- Do not use a chromatic color for non-action elements like tags, badges, or status indicators — the single orange is reserved for conversion
- Do not round cards with 8–16px radii — cards and product screenshots should be sharp-edged on the canvas
- Do not use light theme tokens or switch surfaces to white backgrounds — the design is dark-mode native and the product screenshots depend on it
- Do not add a second typeface — Helvetica Neue at four weights carries the entire voice; a second family would dilute the monolithic feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#0f0d0a` | Base page background and footer |
| 1 | Graphite Surface | `#161412` | Outlined announcement chips, subtle elevated surfaces |
| 2 | Ember Fill | `#ff4700` | Primary CTA button — the only chromatic surface in the stack |

## Elevation

- **Primary CTA button:** `0 0 0 1px #451e0, 0 0 24px 4px #8b2e09`

## Imagery

The site uses product screenshots as its primary visual content — desktop and mobile views of the Cron calendar app rendered in dark mode. These screenshots are placed directly on the Obsidian canvas without frames, borders, or device mockups, making the product UI appear to float on the page. There is no photography, no illustration, and no decorative graphics. Icons are minimal and use Ash (#cccccc) strokes. The visual density is text-and-screenshot dominant, with the display headline occupying the majority of above-the-fold visual weight.

## Layout

Full-bleed dark canvas with centered content constrained to a ~1200px max-width. The hero is a vertically stacked centered composition: announcement pill, then a massive 140px display headline, then a single quiet subheadline, then overlapping desktop and mobile product screenshots that bleed into the lower viewport. Navigation is a single transparent top bar. Sections flow seamlessly from the hero into product previews with generous 80px vertical gaps. Content below the hero uses centered stacks rather than multi-column grids — the entire visible page is single-column with the product screenshots as the only lateral elements.

## Agent Prompt Guide

**Quick Color Reference**
- background: #0f0d0a
- text: #ffffff
- secondary text: #cccccc
- border: #cccccc
- accent: #ff4700
- primary action: no distinct CTA color

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. **Hero display headline**: 140px Helvetica Neue weight 700, color #ffffff, line-height 0.90, letter-spacing -2.94px (-0.021em), centered, on a #0f0d0a canvas.
3. **Ghost nav pill**: Transparent background, 9999px radius, #cccccc text at 15px weight 400, no border, horizontal padding 16px.
4. **Outlined announcement chip**: Background #161412, 1px #cccccc border, 9999px radius, #cccccc text at 13px, centered with an inline arrow.
5. **Subheadline**: 15px Helvetica Neue weight 400, line-height 1.50, color #cccccc, centered beneath the display headline.

## Similar Brands

- **Notion** — Shares the near-black canvas, single warm-accent CTA, and massive ultra-tight display headlines; Cron is explicitly the Notion Calendar product
- **Linear** — Same dark-mode product UI language with chromatic accent used sparingly and product screenshots that blend into the dark canvas without framing
- **Vercel** — Minimalist dark surfaces with a single vivid brand color, oversized tight-tracked headlines, and product imagery presented as raw floating screenshots
- **Arc Browser** — Dark-mode-first interface with bold typographic hero treatments and a single warm accent color punctuating an otherwise monochrome palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember: #ff4700;
  --color-ember-glow: #8b2e09;
  --color-ember-smoke: #451e0e;
  --color-obsidian: #0f0d0a;
  --color-graphite: #161412;
  --color-ash: #cccccc;
  --color-bone: #ffffff;

  /* Typography — Font Families */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.7;
  --tracking-caption: 0.13px;
  --text-body: 15px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1;
  --text-display: 140px;
  --leading-display: 0.9;
  --tracking-display: -2.94px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-buttons: 4px;
  --radius-navpills: 9999px;

  /* Surfaces */
  --surface-obsidian-canvas: #0f0d0a;
  --surface-graphite-surface: #161412;
  --surface-ember-fill: #ff4700;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember: #ff4700;
  --color-ember-glow: #8b2e09;
  --color-ember-smoke: #451e0e;
  --color-obsidian: #0f0d0a;
  --color-graphite: #161412;
  --color-ash: #cccccc;
  --color-bone: #ffffff;

  /* Typography */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.7;
  --tracking-caption: 0.13px;
  --text-body: 15px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1;
  --text-display: 140px;
  --leading-display: 0.9;
  --tracking-display: -2.94px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 9999px;
}
```
