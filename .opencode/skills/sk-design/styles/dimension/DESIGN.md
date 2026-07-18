# Dimension — Style Reference
> dusk-lit workspace with frosted glass panels

**Theme:** dark

Dimension operates as a dusk-lit AI workspace: deep matte-black canvases (#0a0a0a) carry frosted-glass panels, pill-shaped controls, and whisper-weight headlines that lean on medium weights (500) rather than bold statements. The system is almost entirely achromatic — white and warm grays do all the talking — punctuated by a signature gradient hero that transitions from warm amber through to cobalt blue, evoking a sunset bleeding into a product UI. Components are lightweight and round: 9999px pill buttons, 10px UI radii, 24px card radii, with hairline 1px borders rather than heavy shadows. The visual rhythm is quiet, controlled, and editorial — every element feels placed rather than dropped, with generous breathing room and a single violet glow (#6b62f2 at 0.565 alpha) as the only chromatic accent, used sparingly in linear gradient washes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Canvas | `#0a0a0a` | `--color-void-canvas` | Primary page background, base surface for the dark UI shell |
| Graphite | `#161616` | `--color-graphite` | Elevated surface for floating panels, pill nav bar, modal bodies — one step above canvas |
| Frosted Glass | `#d4d4d4` | `--color-frosted-glass` | Translucent panel fill at 10% opacity over dark surfaces — creates the frosted overlay look on the floating nav and feature cards |
| Ink Black | `#000000` | `--color-ink-black` | Icon strokes, SVG fill, deep contrast elements on light surfaces |
| Snow White | `#ffffff` | `--color-snow-white` | Primary CTA fill, headline text on dark surfaces, card backgrounds — the inverted counterweight to the dark canvas |
| Bone | `#ededed` | `--color-bone` | Primary readable text on dark surfaces — slightly warmer than pure white, reduces glare |
| Ash | `#c2c2c2` | `--color-ash` | Secondary body text, helper copy, de-emphasized labels |
| Slate | `#686868` | `--color-slate` | Muted text, link text, tertiary metadata, timestamp-style labels |
| Smoke | `#b2b2b2` | `--color-smoke` | Disabled or idle button text, integration label text in ghost controls |
| Hairline | `#e5e5e5` | `--color-hairline` | 1px borders on dark-surface controls — appears as a light edge against the dark canvas, creating definition without weight |
| Dusk Violet | `linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 40%, rgba(107, 98, 242, 0.565) 50%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0))` | `--color-dusk-violet` | The only chromatic accent — used at 0.565 alpha in a horizontal gradient wash to add a single pulse of color to the dark UI; Radial glow accent — concentrated violet center fading to white, used as spotlight or product reveal moment |

## Tokens — Typography

### DM Sans — Primary display and body face — used for the 72px hero headline (weight 500, -0.035em tracking) and all 16px body/UI text. The weight-500 display choice is anti-convention: most sites push 700+ for hero headlines, but DM Sans at 500 with tight tracking achieves authority through restraint and modernity through geometric clarity. · `--font-dm-sans`
- **Substitute:** Inter
- **Weights:** 500
- **Sizes:** 13px, 14px, 15px, 16px, 18px, 40px, 72px
- **Line height:** 1.00–1.56
- **Letter spacing:** -0.035em at 72px and 40px, +0.025em at 13–16px UI scale
- **Role:** Primary display and body face — used for the 72px hero headline (weight 500, -0.035em tracking) and all 16px body/UI text. The weight-500 display choice is anti-convention: most sites push 700+ for hero headlines, but DM Sans at 500 with tight tracking achieves authority through restraint and modernity through geometric clarity.

### Geist — Secondary face for feature headings and editorial body — Geist's mono-adjacent precision adds a technical, product-aware texture to section headings (32px/600, 36px/500, 48px/500). The 24px body usage in Geist creates a slightly more compressed, information-dense reading rhythm compared to DM Sans. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px, 24px, 32px, 36px, 48px
- **Line height:** 1.00–1.71
- **Role:** Secondary face for feature headings and editorial body — Geist's mono-adjacent precision adds a technical, product-aware texture to section headings (32px/600, 36px/500, 48px/500). The 24px body usage in Geist creates a slightly more compressed, information-dense reading rhythm compared to DM Sans.

### system-ui — system-ui — detected in extracted data but not described by AI · `--font-system-ui`
- **Weights:** 400, 500
- **Sizes:** 18px
- **Line height:** 1.5
- **Role:** system-ui — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.33px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 36px | 1.11 | — | `--text-heading` |
| heading-lg | 48px | 1 | — | `--text-heading-lg` |
| display | 72px | 1 | -2.52px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| ui | 10px |
| cards | 24px |
| icons | 4px |
| panels | 42px |
| buttons | 9999px |
| largeCards | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 28px
- **Element gap:** 8-16px

## Components

### White Pill CTA
**Role:** Primary action button

Filled white background, #161616 text, 9999px border-radius (full pill), 8px vertical × 12px horizontal padding. The only filled button in the system — inverts the dark canvas to draw the eye. Uses DM Sans 14–16px weight 400. Pair with the ghost nav button as a secondary.

### Ghost Nav Button
**Role:** Navigation link styled as button

Transparent background, #ffffff text at 85% opacity, 1px #e5e5e5 hairline border, 9999px border-radius, 6px vertical × 14px horizontal padding. Lives inside the floating dark nav bar. The reduced text opacity (0.85) creates a quieter rhythm than the full-white CTA.

### Floating Frosted Nav
**Role:** Site-wide navigation

Dark surface (#161616 with possible translucency), 19px asymmetric border-radius, 4px backdrop blur, 1px #e5e5e5 border, 6px × 14px padding for internal links. Sits as a floating pill at the bottom or top of the viewport. Contains logo + 2–3 nav links + white CTA. This is the signature component — it replaces the traditional flat nav bar with a detached, glass-like element.

### Hairline Ghost Button
**Role:** Secondary action or integration label

Transparent background, #ffffff or #b2b2b2 text, 1px #e5e5e5 border, 10px border-radius (not pill — distinguishes from nav), 8px × 8px tight padding. Used for integration labels (Google Drive, Notion, etc.) where the pill shape would be too prominent.

### Frosted Glass Feature Card
**Role:** Translucent content panel

rgba(212,212,212,0.1) background over the dark canvas, 24px border-radius, 0px padding (content is placed inside), no shadow — the translucency itself creates depth. Often paired with a 4px backdrop blur for the frosted effect. Used for feature groupings and section dividers.

### Gradient Hero Panel
**Role:** Full-bleed hero background

A warm-to-cool gradient (amber/coral left → cobalt blue right) fills the hero section. Contains the 72px DM Sans display headline in white, a left-aligned feature bullet list with icon + text rows at 16px, and the white pill CTA. A laptop mockup sits on the right half, creating a split text+visual hero pattern.

### Numbered Accordion Row
**Role:** Feature list item with index

Left-aligned feature name in #ededed, right-aligned two-digit number (01, 02, 03…) in #c2c2c2, 20px row-gap between rows, no visible borders or backgrounds. The numbered prefix creates editorial structure without chrome. Used for 'What Dimension handles for you' style capability lists.

### Bulleted Feature Row
**Role:** Compact feature highlight in hero

Small icon (4px radius, #ffffff fill) + 16px DM Sans text in #ededed, 12px gap between icon and text, 16px vertical spacing between rows. Four rows typical in the hero, each one line. No borders, no backgrounds — pure typographic density.

### Device Mockup Frame
**Role:** Product screenshot container

Large rounded-rectangle frame containing a product UI screenshot. The frame uses 40px 40px 0px 0px border-radius (top corners rounded, bottom flush), white background, 0px padding (screenshot bleeds to edges). Represents a laptop or monitor showing the product interface.

### Status Banner Pill
**Role:** Ephemeral announcement at page top

Pill-shaped bar at the very top of the page, dark or translucent background, 9999px radius, contains a sparkle/star icon + announcement text + arrow. Example: 'Dimension is winding down on May 20, 2026 →'. Centered or left-aligned, sits above the main hero.

### Section Header
**Role:** Section-level title

Geist 32px weight 600 or 36px weight 500, #ededed color, 1.5 line-height, often followed by a descriptive paragraph in 18px Geist weight 500. The 600-weight Geist creates a slightly heavier anchor than the DM Sans body text, marking section boundaries without a visible divider line.

### Icon Glyph
**Role:** Feature or UI icon

Monochrome #ffffff or #000000, 4px border-radius on the container, appears at 16–20px size. Icons are simple geometric shapes (plus, check, sparkle, chat bubble) rendered as filled or stroked SVGs. Stroke weight ~1.5px. The 4px container radius gives icons a subtle squircle softness without rounding the glyph itself.

## Do's and Don'ts

### Do
- Use 9999px border-radius for all primary buttons, nav links, and tag/pill elements — the pill shape is the system's defining silhouette
- Set display headlines to DM Sans 72px weight 500 with -2.52px letter-spacing — never go bolder than 500 for hero text
- Default to #ededed for body text on dark surfaces and #161616 for text on white surfaces — avoid pure #ffffff for body copy to reduce glare
- Use 1px solid #e5e5e5 hairlines for all borders on dark-surface elements — never use heavy 2px+ borders or box-shadows for definition
- Apply the warm-to-cool gradient (amber → cobalt) only to hero or spotlight sections — never to UI controls or cards
- Maintain 8–16px element gaps within components and 64–80px section gaps between major blocks — the rhythm is generous but not maximalist
- Use the Dusk Violet (#6b62f2) accent only in gradient washes, never as a solid fill on buttons, text, or backgrounds

### Don't
- Do not use box-shadow for elevation — the system relies on translucency, hairline borders, and surface contrast instead
- Do not introduce additional brand colors — the 2% colorfulness is intentional; any new hue breaks the monochromatic discipline
- Do not use border-radius below 4px or above 42px on cards — the 24px/40px/42px card radii are the system's sweet spot
- Do not set hero headlines to weight 700 or above — the weight-500 restraint is the signature, not a suggestion
- Do not use Geist for body text below 24px — DM Sans handles 13–18px UI text, Geist begins at the subheading level
- Do not place the floating nav bar flush against the viewport edge — it should always float with visible margin (16–24px from edges)
- Do not use solid #6b62f2 as a button fill or text color — the violet only appears as a gradient wash or radial glow

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#0a0a0a` | Page background — the base dark plane everything sits on |
| 1 | Graphite | `#161616` | Elevated panels — floating nav bar, dropdown bodies, dark cards |
| 2 | Frosted Glass | `#d4d4d4` | Translucent overlay panels at 10% opacity — frosted card surfaces with blur backdrop |
| 3 | Snow White | `#ffffff` | Inverted surfaces — white CTA buttons, white card panels in dark sections |

## Elevation

- **Floating Frosted Nav:** `rgba(255, 255, 255, 0.02) 0px 3px 4.5px, rgba(0, 0, 0, 0.04) 0px 10px 8px, rgba(0, 0, 0, 0.1) 0px 4px 3px`

## Imagery

The site uses minimal photography — instead, it relies on a signature gradient hero that transitions from warm amber/coral on the left to cobalt blue on the right, evoking a sunset bleeding into a product interface. Product screenshots appear inside device mockup frames (laptop/monitor shapes with 40px top-corner radius). Icons are monochrome geometric SVGs (sparkle, plus, check, chat bubble) in #ffffff or #000000, rendered at 16–20px with ~1.5px stroke weight. The visual language is editorial-product: no lifestyle photography, no abstract 3D renders, no illustration — just the gradient hero, product mockups, and tightly composed UI screenshots. A single radial violet glow (#6b62f2) appears as a spotlight accent. Overall image density is low — text and UI chrome dominate, with visual moments concentrated in the hero and product reveal sections.

## Layout

The page uses a max-width ~1200px centered content column with a floating dark pill nav bar that detaches from the viewport edge. The hero is a full-bleed warm-to-cool gradient background with a split layout: left column holds the 72px headline + bulleted feature list + white CTA, right column holds a laptop mockup showing a product screenshot. Below the hero, sections transition to the dark #0a0a0a canvas. The 'What Dimension handles for you' section uses a left-aligned numbered accordion list (01–07) with generous vertical spacing (20px row-gap). Section rhythm alternates between dark canvas sections and frosted-glass panel sections, separated by 64–80px vertical gaps. Content is generally left-aligned with no centered stacks except the status banner at the very top. Card grids are minimal — the design favors editorial single-column or two-column text+visual compositions over multi-column card walls.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ededed (body on dark), #161616 (body on white)
- background: #0a0a0a (canvas), #161616 (elevated)
- border: #e5e5e5 (1px hairline)
- accent: #6b62f2 (gradient wash only)
- primary action: #ffffff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #ffffff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Floating Nav Bar**: Dark surface #161616, 19px asymmetric border-radius, 1px #e5e5e5 border, 4px backdrop blur, 6px×14px internal padding. Contains logo mark + two nav links (#ffffff at 85% opacity, 9999px radius, 1px #e5e5e5 border) + white pill CTA. Floats 16–24px from viewport edge.

3. **Numbered Feature List**: Dark #0a0a0a canvas. Section header in Geist 32px weight 600 #ededed. Seven rows, each: feature name in 16px DM Sans #ededed left-aligned + two-digit number (01–07) in #c2c2c2 right-aligned, 20px vertical gap between rows. No borders, no backgrounds.

4. **Frosted Glass Card**: rgba(212,212,212,0.1) background, 24px border-radius, 4px backdrop blur, 28px internal padding. Content inside: Geist 18px weight 500 #ededed heading + DM Sans 16px weight 400 #c2c2c2 body text. No shadow, no border — translucency creates the depth.

5. **Status Banner**: Centered pill at page top, 9999px radius, dark or translucent background, 1px #e5e5e5 border. Contains: small sparkle icon (4px radius, #ffffff) + 14px DM Sans weight 500 #ededed text + right arrow. 6px×14px padding.

## Gradient System

The site uses gradients as a signature visual device, not as decoration. Three distinct gradient types serve separate purposes:

1. **Hero Horizon** — warm-to-cool full-bleed gradient on hero sections: amber/coral left → cobalt blue right. This is the only gradient applied to a full section background. It establishes the product's identity as a transition point between human work hours and AI off-hours.

2. **Dusk Violet Wash** — linear gradient at 90deg with the violet accent (#6b62f2 at 0.565 alpha) concentrated in a narrow 50% center band, fading to transparent at 40% and 60%. Used as a horizontal highlight strip on dark UI — never as a background fill.

3. **Radial Spotlight** — radial gradient from #6b62f2 center to #ffffff edge, used sparingly as a product reveal or feature highlight. Creates a soft glow that draws the eye to a specific point.

Rules: Gradients appear only on hero sections, accent strips, and spotlights. Never apply gradients to cards, buttons, or text. Never combine multiple gradients on the same element.

## Similar Brands

- **Linear** — Same dark-canvas + monochromatic discipline with a single gradient hero, pill-shaped controls, and hairline borders on dark surfaces. Both favor weight-500 restraint over bold headlines.
- **Vercel** — Identical Geist/DM Sans pairing, 9999px pill buttons, 1px hairline borders on #e5e5e5, and the floating glass nav bar concept. Both use warm-to-cool gradient heroes as signature moments.
- **Raycast** — Dark surface stack (#0a0a0a → #161616), pill nav controls, frosted glass panels with backdrop blur, and the same anti-bold weight-500 headline approach. Both treat 2% colorfulness as a design principle.
- **Arc Browser** — Shared language of frosted glass panels over dark canvases, pill-shaped floating controls, and generous editorial spacing. Both use gradient washes as accent rather than as primary fills.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-canvas: #0a0a0a;
  --color-graphite: #161616;
  --color-frosted-glass: #d4d4d4;
  --color-ink-black: #000000;
  --color-snow-white: #ffffff;
  --color-bone: #ededed;
  --color-ash: #c2c2c2;
  --color-slate: #686868;
  --color-smoke: #b2b2b2;
  --color-hairline: #e5e5e5;
  --color-dusk-violet: #6b62f2;
  --gradient-dusk-violet: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 40%, rgba(107, 98, 242, 0.565) 50%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0));

  /* Typography — Font Families */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.33px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.52px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 28px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 19px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-ui: 10px;
  --radius-cards: 24px;
  --radius-icons: 4px;
  --radius-panels: 42px;
  --radius-buttons: 9999px;
  --radius-largecards: 40px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-void-canvas: #0a0a0a;
  --surface-graphite: #161616;
  --surface-frosted-glass: #d4d4d4;
  --surface-snow-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-canvas: #0a0a0a;
  --color-graphite: #161616;
  --color-frosted-glass: #d4d4d4;
  --color-ink-black: #000000;
  --color-snow-white: #ffffff;
  --color-bone: #ededed;
  --color-ash: #c2c2c2;
  --color-slate: #686868;
  --color-smoke: #b2b2b2;
  --color-hairline: #e5e5e5;
  --color-dusk-violet: #6b62f2;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.33px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.52px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 19px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
}
```
