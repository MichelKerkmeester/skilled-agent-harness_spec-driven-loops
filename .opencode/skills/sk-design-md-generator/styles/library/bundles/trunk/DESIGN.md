# Trunk — Style Reference
> monochrome control room with one green signal light. A dark, technical, near-grayscale interface where the only color that matters is a single dot of green confirming the pipeline is alive.

**Theme:** dark

Trunk is a near-monochrome command center for CI reliability: deep matte-black canvas, hairline dividers in cool gray, and a single, almost-restraint palette of black-to-white neutrals. The interface feels like an engineer's terminal that grew up into a product — flat, dense, confident, with type that whispers at display sizes (weight 300, tight tracking) and snaps to attention at body sizes. The lone chromatic accent is a single green signal that appears once in the hero illustration as a ball rolling through pipes; the rest of the system speaks in grayscale. Components sit on the canvas with minimal elevation — borders and contrast do the work, not shadows. The page alternates between a light illustrated hero and dark product sections, but the product surface is the source of truth: black ground, gray borders, white type, no decorative gradients, no noise.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, primary background — the ground everything sits on |
| Carbon | `#08090b` | `--color-carbon` | Elevated card surfaces, nav text, deep backgrounds one step above the canvas |
| Graphite | `#232323` | `--color-graphite` | Card and button borders — the hairline skeleton that defines structure |
| Slate Mist | `#89898d` | `--color-slate-mist` | Subtle background fills, muted surface overlays |
| Fog | `#b3b3b5` | `--color-fog` | Muted body text, secondary copy, icon fills — readable but recedes |
| Ash | `#c1c5c8` | `--color-ash` | Icon strokes, tertiary text, soft fills |
| Bone | `#dddddd` | `--color-bone` | Light body text variant on dark surfaces |
| Chalk | `#e2e8f0` | `--color-chalk` | Primary hairline border color — dividers, card edges, input borders; the most-used border in the system |
| Paper White | `#ffffff` | `--color-paper-white` | Light neutral action fill for buttons on dark surfaces. |
| Signal Green | `#22c550` | `--color-signal-green` | Supporting palette color for small decorative accents when the core palette needs contrast. |

## Tokens — Typography

### Neue — Sole typeface across all surfaces. Weight 300 for display and hero headlines — deliberately light, anti-convention for a technical product, creating authority through restraint. Weight 400 for body copy. Weight 500 for nav, labels, and emphasized UI text. Weight 700 reserved for high-emphasis callouts. Tight negative tracking scales with size: -0.028em at 60px tightens large headlines into a single visual mass; tracking relaxes to near-zero at body sizes. The full range from 11px captions to 60px display gives the system a wide, confident scale without ever feeling like two different typefaces. · `--font-neue`
- **Substitute:** Inter, Neue Haas Grotesk, DM Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 11, 12, 14, 15, 16, 17, 18, 24, 36, 45, 56, 60
- **Line height:** 0.94, 1.00, 1.18, 1.20, 1.25, 1.30, 1.40, 1.50, 1.60
- **Letter spacing:** -0.028em at 60px, -0.026em at 56px, -0.018em at 36px, -0.013em at 24px, -0.009em at 17-18px
- **Role:** Sole typeface across all surfaces. Weight 300 for display and hero headlines — deliberately light, anti-convention for a technical product, creating authority through restraint. Weight 400 for body copy. Weight 500 for nav, labels, and emphasized UI text. Weight 700 reserved for high-emphasis callouts. Tight negative tracking scales with size: -0.028em at 60px tightens large headlines into a single visual mass; tracking relaxes to near-zero at body sizes. The full range from 11px captions to 60px display gives the system a wide, confident scale without ever feeling like two different typefaces.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body | 15px | 1.5 | -0.009px | `--text-body` |
| subheading | 18px | 1.4 | -0.009px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.313px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.648px | `--text-heading` |
| heading-lg | 45px | 1.18 | -1.17px | `--text-heading-lg` |
| display | 56px | 1 | -1.456px | `--text-display` |
| display-lg | 60px | 0.94 | -1.68px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| pills | 999px |
| small | 3px |
| medium | 12px |
| buttons | 18px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary Navigation Bar
**Role:** Top-level site navigation

Transparent or canvas-colored bar with the Trunk wordmark on the left (logo + text), centered nav links (Platform, Customers, Docs, Pricing, Resources) at 14px weight 500, and a right-aligned 'Book a demo' filled button plus 'Sign in' text link. Height ~56px, full-bleed width, no visible bottom border — the nav floats on the dark canvas.

### Book a Demo Button (Filled)
**Role:** Primary CTA

Dark filled button, background #08090b with #232323 border, 18px border-radius, 9px 12px padding, text 14px weight 500 in #ffffff. The inverse: the light version (shown in hero) uses #08090b background with #ffffff text. This is the only filled button in the system.

### Documentation Button (Ghost/Outlined)
**Role:** Secondary action

Ghost button with transparent background, 18px border-radius, 9px 12px padding, text 14px weight 500 in #ffffff. No visible border — relies on contrast against the dark background.

### Hero Section
**Role:** First-screen brand impression

Light illustrated background (grayscale line-art landscape of pipes, mountains, trees) with a single green ball rolling through the central pipe. Centered text stack: 'Keep CI Green' at 56-60px weight 300 with -1.68px tracking, subtitle at 18px weight 400, then two buttons (Book a demo filled + Documentation ghost) side by side. Below: a trust line in small muted text and a row of customer logos in grayscale. The hero is the one moment color appears — a single green dot in a sea of black-and-white line art.

### Customer Logo Bar
**Role:** Social proof strip

Horizontal row of 7-8 customer logos (Faire, Brex, Gusto, Zillow, Chick-fil-A, Google, Metabase) rendered in white on the dark canvas. Logos are flat, monochrome white, evenly spaced with ~40-60px gaps. No logos with color — all desaturated to match the system's grayscale discipline.

### Feature Card (Screenshot + Text)
**Role:** Product feature explanation

Two-column card on dark canvas. Left: product screenshot shown inside a card with 12-24px radius, 1px #e2e8f0 border, 1:1 or 4:3 aspect ratio. Right: heading at 24-36px weight 300 with tight tracking, subtext at 16-18px weight 400 in #b3b3b5. Cards have no shadow — the border alone defines the surface.

### Testimonial Card
**Role:** Customer quote display

Dark card (#08090b background or transparent on canvas) with 24px radius, 1px #e2e8f0 border, 24px padding. Customer logo at top-left (monochrome white), quote text at 15-16px weight 400 in #ffffff, author name at 12-14px weight 500 and role/company at 12-14px weight 400 in #b3b3b5. Cards are horizontally scrollable in a carousel with left/right navigation buttons.

### Carousel Navigation Buttons
**Role:** Scrollable list controls

Circular buttons (24px radius) with 1px #e2e8f0 border, transparent background, containing a left/right chevron icon in #ffffff. 32x32px size, sit centered below the testimonial row.

### Section Heading
**Role:** Section-level title

Centered heading at 36-45px weight 300 with -0.018em to -0.026em tracking in #ffffff. No subheading decoration. Tight letter-spacing on large light-weight type creates a condensed, editorial feel — the headline reads as a single confident mark rather than loose words.

### Dashboard Screenshot Frame
**Role:** Product UI showcase

Large product screenshot (CI dashboard with test history, flaky test detection, repository settings) displayed inside a card with 12-24px radius and 1px #e2e8f0 border. The screenshot itself contains color (test pass/fail bars, status indicators) but is framed within the achromatic system. Sits on #000000 canvas.

### Pill Button
**Role:** Tag or filter element

Fully rounded button (999px radius) with 1px #e2e8f0 border, 3-5px vertical padding, 9-12px horizontal padding, text 12-14px weight 500 in #ffffff. Used for tags, status filters, or compact interactive labels.

## Do's and Don'ts

### Do
- Use weight 300 for all display and hero headlines — this is the signature anti-loud choice that makes the type feel editorial and confident
- Use #e2e8f0 for all hairline borders and dividers — it is the structural backbone of the system at 444+ uses
- Maintain a 24px border-radius for all cards and 18px for all buttons — never use sharp corners on interactive elements
- Keep the palette to 9 neutrals + 1 green — if a new color feels necessary, reach for a different shade of gray first
- Reserve the green accent for confirmation/success signals only — never use it decoratively or for multiple purposes
- Use tight negative letter-spacing that scales with size: -0.028em at 60px down to -0.009em at 18px
- Place product screenshots and cards on the black canvas with 1px #e2e8f0 borders — let borders define surfaces, not shadows

### Don't
- Never add chromatic colors beyond the single green signal — the system is 97% grayscale for a reason
- Never use weight 600+ for headlines — the light weights are the brand voice, heavier weights break the restraint
- Never use box-shadows to create depth — this system uses flat surfaces and border contrast instead
- Never add gradients — the system is deliberately flat and matte
- Never use the green accent on UI controls, buttons, or links — it belongs only in the 'passing signal' context
- Never use letter-spacing of 0 or positive values on display sizes — the tight tracking is part of the type identity
- Never use borders thinner than 1px or colors outside the defined 9-step neutral scale — structural consistency requires discipline

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000000` | Base page background — the ground plane |
| 1 | Elevated Card | `#08090b` | Card and panel surfaces one step above canvas |
| 2 | Subtle Fill | `#89898d` | Rarely used muted surface for overlays or secondary fills |
| 3 | Inverse Surface | `#ffffff` | Light surfaces when inversion is needed (rare — hero, filled buttons) |

## Elevation

This system deliberately avoids drop shadows. Depth and surface hierarchy are communicated through three mechanisms: (1) background-color stepping from #000000 → #08090b → #232323, (2) 1px #e2e8f0 hairline borders that define card edges against the canvas, and (3) contrast between text weight and size against the flat background. The result is a flat, technical, terminal-like aesthetic where every pixel is either text, border, or content — no decorative depth.

## Imagery

The visual language is split between two distinct modes: (1) Hero illustration: hand-drawn line-art landscape in grayscale — pipes snaking through mountains, trees, geometric terrain — with a single green ball as the only color. The illustration is flat, architectural, and slightly playful, evoking a blueprint or technical diagram. (2) Product screenshots: real UI captures of the Trunk dashboard (test history charts, flaky test detection panels, repository settings) shown at large scale with 1px gray borders. The screenshots contain their own internal color (status indicators, charts) but are framed within the achromatic system. Photography: none. The brand relies on illustration and product UI as its visual content — no stock photos, no lifestyle imagery.

## Layout

Page model: max-width ~1200px centered, with content centered within. The hero is the one full-bleed section (light illustrated background extending edge-to-edge), while all product content lives in contained max-width bands on the dark canvas. Section rhythm: the page begins with a light hero, then transitions to dark product sections that continue to the footer. Content arrangement: centered text stacks for section headings, then two-column text+screenshot pairs for features, then a single-row horizontally-scrollable testimonial carousel. Grid usage: testimonial cards in a horizontal scroll (not a grid), feature sections as two-column pairs, no multi-column card grids. Density: spacious — generous 80px section gaps, breathing room around each element. Navigation: minimal top bar, no sidebar, no mega-menu.

## Agent Prompt Guide

## Quick Color Reference
- text: #ffffff
- background: #000000
- border: #e2e8f0
- accent: #22c550 (single signal green — hero illustration only)
- surface elevated: #08090b
- surface border: #232323
- muted text: #b3b3b5
- primary action: #08090b (filled action)

## Example Component Prompts

1. **Hero Section**: Light illustrated background. Headline 'Keep CI Green' at 56px neue weight 300, #08090b color, letter-spacing -0.026em. Subtitle at 18px weight 400, #08090b. Two buttons side by side: a filled 'Book a demo' (#08090b background, #ffffff text, 18px radius, 9px 12px padding) and a ghost 'Documentation' (transparent background, #08090b text, no border, same radius/padding). Trust line at 14px weight 400 in #b3b3b5. Row of 7 customer logos in monochrome below.

2. **Feature Card**: Dark canvas (#000000). Card with #08090b background, 1px #e2e8f0 border, 24px radius, 24px padding. Product screenshot inside the card with 12px radius. Heading 'Quarantine flaky tests automatically' at 36px neue weight 300, #ffffff, letter-spacing -0.018em. Body text at 16px weight 400, #b3b3b5.

3. **Testimonial Card**: Transparent background on dark canvas. 1px #e2e8f0 border, 24px radius, 24px padding. Customer logo (monochrome white) at top-left. Quote text at 15px weight 400, #ffffff. Author name at 12px weight 500, #ffffff. Role/company at 12px weight 400, #b3b3b5.

4. **Pill Button**: 999px border-radius, 1px #e2e8f0 border, transparent background, 4px 9px padding, 12px neue weight 500, #ffffff text. Used for tags and status labels.

5. **Section Heading**: Centered on dark canvas. 45px neue weight 300, #ffffff, letter-spacing -0.026em. No subtitle or decoration. Followed by 80px vertical gap to content.

## Similar Brands

- **Linear** — Same dark canvas, monochrome interface, hairline borders for structure, tight letter-spacing on light-weight display headlines, and zero decorative gradients or shadows
- **Vercel** — Black-and-white minimalism with technical precision, flat surfaces, and a confidence that comes from typographic restraint rather than visual ornamentation
- **Render** — Dark-mode developer tool with a single accent moment, generous spacing, and a product-forward layout that lets screenshots and code do the talking
- **Plausible Analytics** — Near-grayscale palette with minimal color, flat card surfaces with thin borders, and a focus on typography as the primary visual language
- **Resend** — Dark devtool aesthetic with one distinctive brand color moment, clean type hierarchy, and illustration-as-hero instead of photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #08090b;
  --color-graphite: #232323;
  --color-slate-mist: #89898d;
  --color-fog: #b3b3b5;
  --color-ash: #c1c5c8;
  --color-bone: #dddddd;
  --color-chalk: #e2e8f0;
  --color-paper-white: #ffffff;
  --color-signal-green: #22c550;

  /* Typography — Font Families */
  --font-neue: 'Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.009px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.009px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.313px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.648px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -1.17px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.456px;
  --text-display-lg: 60px;
  --leading-display-lg: 0.94;
  --tracking-display-lg: -1.68px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-pills: 999px;
  --radius-small: 3px;
  --radius-medium: 12px;
  --radius-buttons: 18px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-elevated-card: #08090b;
  --surface-subtle-fill: #89898d;
  --surface-inverse-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #08090b;
  --color-graphite: #232323;
  --color-slate-mist: #89898d;
  --color-fog: #b3b3b5;
  --color-ash: #c1c5c8;
  --color-bone: #dddddd;
  --color-chalk: #e2e8f0;
  --color-paper-white: #ffffff;
  --color-signal-green: #22c550;

  /* Typography */
  --font-neue: 'Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.009px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.009px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.313px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.648px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -1.17px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.456px;
  --text-display-lg: 60px;
  --leading-display-lg: 0.94;
  --tracking-display-lg: -1.68px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;
}
```
