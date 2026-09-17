# Altitude Beverages — Style Reference
> Monochrome editorial spread. Imagine a fashion magazine spread stripped of all color except the product photography — the type and whitespace do all the storytelling.

**Theme:** mixed

Altitude Beverages reads as a monochrome editorial spread: a near-white canvas (#fafafa) carrying oversized typographic statements while saturated product photography provides the only chromatic energy. The system oscillates between two extremes — an airy, gallery-like light surface with a massive 160px display headline and pill-shaped monospace navigation, and a dense charcoal-to-slate gradient section that functions as a cinematic counterpoint. Every UI element is reduced to its bare geometry: pill buttons, hairline borders, no shadows, no decorative ornamentation. The typographic cast — light-weight serif (EditorialNew) for editorial flourishes, ultra-bold display sans (HelveticaNowDisplay) for hero impact, and a monospaced label face (DepartureMono) for navigation — is the actual identity system; color and components deliberately recede so the type and photography can perform.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#fafafa` | `--color-canvas-white` | Page background, card surfaces, primary canvas — the dominant near-white that lets photography and type carry all visual weight |
| Warm Ash | `#d9d9d9` | `--color-warm-ash` | Elevated surface backgrounds for cards, buttons, and nav pill container — a warm gray one step darker than canvas for subtle layering without shadows |
| Mid Gray | `#cdcdce` | `--color-mid-gray` | Hairline borders, link underlines, and divider lines — sits between canvas and text to create structure without weight |
| Ink Black | `#07060b` | `--color-ink-black` | Primary text, button labels, heading copy — a near-pure black with a faint blue undertone for maximum contrast against the warm canvas |
| Pure Black | `#000000` | `--color-pure-black` | Navigation borders and secondary text accents — used sparingly where a slightly harder edge is needed |
| Glacial Mist | `#ddfcff` | `--color-glacial-mist` | Faint cool-tinted accent on borders and fills — a barely-perceptible icy wash that adds micro-contrast without breaking the monochrome discipline |

## Tokens — Typography

### HelveticaNowDisplay — Display and hero headlines — weight 800 at 160px with -0.05em tracking is the signature: massively compressed, ultra-bold statement type that dominates the viewport. Also used at 18px/500 for emphasized inline labels and 11px for caption-level brand marks · `--font-helveticanowdisplay`
- **Substitute:** Inter Tight, Archivo Black, or Manrope ExtraBold
- **Weights:** 400, 500, 800
- **Sizes:** 11px, 18px, 160px
- **Line height:** 0.90, 1.00
- **Letter spacing:** -0.05em
- **Role:** Display and hero headlines — weight 800 at 160px with -0.05em tracking is the signature: massively compressed, ultra-bold statement type that dominates the viewport. Also used at 18px/500 for emphasized inline labels and 11px for caption-level brand marks

### EditorialNew — Editorial body and subheadings — the light-weight serif (weight 200) at 40-60px creates the 'fashion magazine pull-quote' feeling. The extreme thinness against the massive Helvetica display generates typographic tension. Also flows at 14-16px for editorial paragraph text · `--font-editorialnew`
- **Substitute:** PP Editorial New, Cormorant Garamond Light, or Playfair Display
- **Weights:** 200
- **Sizes:** 14px, 16px, 40px, 60px
- **Line height:** 1.06
- **Letter spacing:** -0.025em
- **Role:** Editorial body and subheadings — the light-weight serif (weight 200) at 40-60px creates the 'fashion magazine pull-quote' feeling. The extreme thinness against the massive Helvetica display generates typographic tension. Also flows at 14-16px for editorial paragraph text

### DepartureMono — Monospaced utility face for navigation labels, button text, form inputs, and small data — uppercase tracked monospace signals 'technical/informational' against the display serif and sans · `--font-departuremono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 11px, 12px, 14px, 16px
- **Line height:** 1.00, 1.06, 1.43, 1.50, 1.79, 2.33
- **Letter spacing:** -0.071em
- **Role:** Monospaced utility face for navigation labels, button text, form inputs, and small data — uppercase tracked monospace signals 'technical/informational' against the display serif and sans

### ui-sans-serif — Fallback body text and generic UI copy — system sans at 16px handles the long tail of small interface labels that don't warrant the custom faces · `--font-ui-sans-serif`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Role:** Fallback body text and generic UI copy — system sans at 16px handles the long tail of small interface labels that don't warrant the custom faces

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.79 | -0.78px | `--text-caption` |
| body | 16px | 1.5 | -1.14px | `--text-body` |
| subheading | 18px | 1.43 | -0.9px | `--text-subheading` |
| heading-sm | 40px | 1.06 | -1px | `--text-heading-sm` |
| heading | 60px | 1.06 | -1.5px | `--text-heading` |
| display | 160px | 0.9 | -8px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px |
| cards | 44px |
| inputs | 44px |
| buttons | 100px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 36-80px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Pill Navigation Bar
**Role:** Primary site navigation

Floating pill container with 100px border-radius, #d9d9d9 background, positioned absolute at top center. Contains 4 monospace links (SHOP, ABOUT, FIND US, CART (0)) in 11-12px DepartureMono uppercase, #07060b text. Logo sits independently top-left, a 40px circular icon button top-right. The nav floats over whatever section is beneath it with no background blur or border.

### Pill Text Button
**Role:** Outlined/ghost action trigger

Fully rounded 100px radius button with #fafafa background, 1px #cdcdce border, 16-20px horizontal padding × 17px vertical. Label in DepartureMono at 11-12px, #07060b, uppercase, -0.071em letter-spacing. The pill shape and monospaced label read as a technical/functional action, not a marketing CTA.

### Display Hero Headline
**Role:** Primary page statement

HelveticaNowDisplay weight 800 at 160px, line-height 0.90, letter-spacing -0.05em (-8px). Color #07060b. One single line or two lines maximum. This is the typographic anchor of the entire system — it must be massive, compressed, and singular.

### Editorial Subheadline
**Role:** Supporting editorial text below display

EditorialNew weight 200 at 40-60px, line-height 1.06, letter-spacing -0.025em. Color #07060b. The extreme light weight against the heavy display creates the system's signature tension. Used for pull-quotes, flavor descriptions, and section openers.

### Product Feature Card
**Role:** Large hero product showcase

Rounded container at 44px border-radius with full-bleed product photography as the visual. Contains a floating smaller product card anchored to bottom-right corner (overlapping the larger card). Overlay text in DepartureMono at 11px for category labels and EditorialNew for product names.

### Floating Product Card
**Role:** Compact product preview with details

44px radius card with warm gray (#d9d9d9) background or photographic fill. Contains a small can product shot, product name in EditorialNew, and a DepartureMono category line at 11px. Overlaps the main feature card to create depth without shadows.

### Dark Gradient Section
**Role:** Full-bleed tonal reset between light sections

Full-width background using the multi-stop linear gradient from #06050a to #f5f6f1 (dark to light, top to bottom). Faintly visible watermark wordmark ('altitude') centered in the gradient. No other UI content — this section is purely atmospheric and cinematic.

### Monospace Label Tag
**Role:** Small category or metadata indicator

DepartureMono at 11-12px, uppercase, -0.071em letter-spacing, #07060b. No background, no border — pure typographic label. Used for 'NON-ALCOHOLIC', 'CHIN | CHIP | LIMEGRASS', ingredient lists, and metadata.

### Circular Icon Button
**Role:** Standalone utility action (profile, account)

40-44px diameter circle (100px radius), #d9d9d9 background, containing a minimal glyph or monogram. Sits in the top-right of the navigation as a floating utility anchor.

### Hairline Divider
**Role:** Structural separation between elements

1px line at #cdcdce color. No padding, no margin logic — just a minimal line. Rarely used; the system prefers whitespace to explicit dividers.

## Do's and Don'ts

### Do
- Use HelveticaNowDisplay weight 800 at 160px for the primary hero headline — it must feel oversized and compressed, never comfortable or safe
- Pair the ultra-bold display with EditorialNew weight 200 for subheadings — the 200-vs-800 contrast is the typographic identity
- Keep all UI chrome to the monochrome palette (#fafafa, #d9d9d9, #07060b, #cdcdce) — color belongs only in product photography
- Use 100px border-radius for navigation pills and primary buttons; 44px for product cards and content containers
- Set all navigation, button labels, and metadata in DepartureMono uppercase at 11-12px with -0.071em tracking
- Maintain a section gap of 36-80px between major content blocks to let the editorial whitespace breathe
- Let product photography be the only chromatic element — never introduce a brand accent color into UI components

### Don't
- Do not add shadows to any component — use surface color steps (#fafafa → #d9d9d9) and gradient transitions for all depth
- Do not use rounded corners below 44px for cards or 100px for buttons — the system is defined by its pill/lozenge geometry
- Do not set body text in HelveticaNowDisplay — reserve that face for display headlines at 60px+ only
- Do not use color for buttons, badges, or interactive elements — all actions are black text on warm gray or white surfaces
- Do not break the light/dark alternation with a chromatic section — the dark gradient is the only non-monochrome surface
- Do not use line-heights above 1.06 for headlines — the tight leading is part of the compressed, editorial feel
- Do not add icons or illustrations to the UI — the system relies on photography, monogram marks, and pure typography

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` | Page background — the light gallery wall |
| 1 | Pill Surface | `#d9d9d9` | Navigation pill container, button fills, card backgrounds — one step up from canvas |
| 2 | Dark Gradient | `#0c0c14` | Full-bleed dark section transition — cinematic counterpoint to the light canvas |

## Elevation

No shadows. Depth is created exclusively through surface color steps (#fafafa → #d9d9d9) and dramatic gradient transitions between light and dark sections. The design treats shadow as unnecessary noise — separation comes from tone, not blur.

## Imagery

Photography is the sole source of color in this system. Product shots are tightly cropped on cans against saturated gradient backgrounds (orange, warm red, amber) — the cans themselves carry gradient wraps from dark to light. Lifestyle elements appear as floating garnishes (lime slice, rosemary sprig, flower) that add organic texture. No illustrations, no icons beyond minimal monogram marks. Imagery is always full-bleed or tightly contained within rounded frames — never small thumbnails. The visual rhythm alternates between this dense photographic energy and empty monochrome whitespace.

## Layout

Full-bleed horizontal sections that alternate between light (#fafafa) and dark (gradient to near-black). The navigation is a floating pill centered at the top, absolutely positioned with the logo top-left and a small circular icon top-right. The hero is a single massive display headline (160px) with one sentence of editorial serif subtext and a single text button. Below the hero, product sections use a card-slot layout: one large feature card and one smaller floating product card overlapping it. The dark section spans full width as a tonal reset — a single near-black canvas with a faintly visible watermark wordmark. Vertical rhythm is generous (36-80px section gaps) with content centered on a max-width ~1200px. No sidebar, no grid-heavy information density — every section is a single statement.

## Agent Prompt Guide

Quick Color Reference:
- background: #fafafa
- surface (cards, nav pill, buttons): #d9d9d9
- border (hairlines, dividers): #cdcdce
- text: #07060b
- accent (micro-contrast only): #ddfcff
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a hero section: #fafafa background. Headline 'Low-Key Sophisticated Rosemary Spritz' at 160px HelveticaNowDisplay weight 800, #07060b, letter-spacing -0.05em, line-height 0.90. Subtext 'Non-Alcoholic Pairings for Perfect Vibes' at 18px EditorialNew weight 200, #07060b. Below, a pill text button with #fafafa fill, 1px #cdcdce border, 100px radius, 16px 20px padding, label 'SHOP' in DepartureMono 12px uppercase #07060b.
2. Create a product feature card: 44px border-radius, full-bleed warm orange product photograph of a beverage can. In the bottom-right corner, overlap a 44px-radius secondary card with #d9d9d9 background, 16px padding, containing a small product image, product name in EditorialNew 16px #07060b, and a DepartureMono 11px uppercase label 'Herbal | Bittersweet | Refreshing' in #07060b.
3. Create the pill navigation: a 100px-radius floating container with #d9d9d9 background, horizontally centered at the top of the page. Inside, four monospace links — 'SHOP', 'ABOUT', 'FIND US', 'CART (0)' — in DepartureMono 12px uppercase #07060b with 24px horizontal padding each. To the top-left, the wordmark 'altitude' in HelveticaNowDisplay 18px weight 500 #07060b. To the top-right, a 40px circular icon button with #d9d9d9 background containing a small 'A' monogram in HelveticaNowDisplay 11px weight 800.

## Type Pairing Rules

The system runs on a strict type hierarchy: HelveticaNowDisplay owns the mega-scale (160px/800) and caption marks (11px/800). EditorialNew owns all mid-scale editorial copy (40-60px/200). DepartureMono owns everything functional (11-12px/400). Never use EditorialNew below 14px — the thin weight loses readability. Never use HelveticaNowDisplay display sizes for body content. The monospace face is the only one permitted in buttons, nav, inputs, and metadata — it signals 'system/utility' against the editorial and display faces.

## Similar Brands

- **Aesop** — Same ultra-minimal monochrome product aesthetic with a single serif/sans type pairing and pill-shaped navigation, where photography carries all color
- **Glossier** — Similar restrained neutral palette with a single bold display headline and product photography as the chromatic anchor
- **Aarke** — Premium product brand using near-white canvas, massive compressed display type, and no decorative UI chrome beyond pill buttons
- **Maison Margiela (fragrance)** — Editorial fashion-house treatment of a product page — light serif + bold sans typographic tension, generous whitespace, photography as the only color
- **Skims** — Full-bleed sectional layout with dramatic light/dark tonal alternation, oversized display headlines, and minimal UI ornamentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #fafafa;
  --color-warm-ash: #d9d9d9;
  --color-mid-gray: #cdcdce;
  --color-ink-black: #07060b;
  --color-pure-black: #000000;
  --color-glacial-mist: #ddfcff;

  /* Typography — Font Families */
  --font-helveticanowdisplay: 'HelveticaNowDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorialnew: 'EditorialNew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-departuremono: 'DepartureMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.79;
  --tracking-caption: -0.78px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -1.14px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.9px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.06;
  --tracking-heading-sm: -1px;
  --text-heading: 60px;
  --leading-heading: 1.06;
  --tracking-heading: -1.5px;
  --text-display: 160px;
  --leading-display: 0.9;
  --tracking-display: -8px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 36-80px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-3xl: 44px;
  --radius-full: 100px;
  --radius-full-2: 110.016px;

  /* Named Radii */
  --radius-nav: 100px;
  --radius-cards: 44px;
  --radius-inputs: 44px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-canvas: #fafafa;
  --surface-pill-surface: #d9d9d9;
  --surface-dark-gradient: #0c0c14;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #fafafa;
  --color-warm-ash: #d9d9d9;
  --color-mid-gray: #cdcdce;
  --color-ink-black: #07060b;
  --color-pure-black: #000000;
  --color-glacial-mist: #ddfcff;

  /* Typography */
  --font-helveticanowdisplay: 'HelveticaNowDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorialnew: 'EditorialNew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-departuremono: 'DepartureMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.79;
  --tracking-caption: -0.78px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -1.14px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.9px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.06;
  --tracking-heading-sm: -1px;
  --text-heading: 60px;
  --leading-heading: 1.06;
  --tracking-heading: -1.5px;
  --text-display: 160px;
  --leading-display: 0.9;
  --tracking-display: -8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-3xl: 44px;
  --radius-full: 100px;
  --radius-full-2: 110.016px;
}
```
