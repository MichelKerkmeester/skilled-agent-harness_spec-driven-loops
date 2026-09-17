# Wealthsimple — Style Reference
> Cashmere-lined vault with gallery lighting

**Theme:** mixed

Wealthsimple operates as an editorial boutique masquerading as a fintech: a warm, near-monochrome canvas of paper-cream and graphite, where large Tiempos serif display type shares the page with a quiet geometric sans for body and UI. The signature is the juxtaposition — a fashion-magazine serif headline sitting beside pill-shaped dark buttons, a hero that swaps to a warm bronze-dark field to stage a sculptural 3D form, and illustrations that read as gallery objects rather than product screenshots. Color is almost entirely suppressed in chrome; warmth comes from the off-white stack (#fcfcfc → #faf8f5 → #e4e2e1) rather than from accents. Components stay low and weightless: hairline dividers, 100px-soft-rounded cards, pill buttons, no drop shadows, no gradients. Density is comfortable with long reading lines and generous 48px section gaps — the design trusts typography and whitespace to do the persuading.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite Ink | `#32302f` | `--color-graphite-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Paper White | `#fcfcfc` | `--color-paper-white` | Default page canvas, card surfaces, button text on dark fills — the brightest neutral, used for main reading surfaces |
| Linen Cream | `#faf8f5` | `--color-linen-cream` | Warm alternate section background, hero warm-tones, subtle washes — gives the page its boutique warmth and distinguishes sections from flat white |
| Fog Veil | `#f1f0f0` | `--color-fog-veil` | Quiet elevated surfaces, subtle hover washes, soft surface tints for inset regions |
| Stone | `#e4e2e1` | `--color-stone` | Hairline borders, input outlines, section dividers, nav-rule lines — the workhorse neutral for structural separation |
| Pebble | `#686664` | `--color-pebble` | Secondary/captive text, link body, helper copy — keeps muted text inside the warm-grey family instead of dipping into cool slate |
| Onyx | `#000000` | `--color-onyx` | Reserved for SVG icon fills and a few crisp borders where true black is needed for contrast on warm-cream surfaces |
| Charcoal | `#09090a` | `--color-charcoal` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Bronze Field | `#3a3525` | `--color-bronze-field` | Hero/feature-block full-bleed background — a warm dark khaki that stages sculptural 3D illustrations without going full-black, maintaining the boutique-warm axis even in dark sections |

## Tokens — Typography

### Tiempos — Display and editorial heading serif — used at 56–84px for hero and section titles, 36px for sub-section heads, and 14–18px for emphasis lead-ins. Tiempos is the soul of the brand: a contemporary text serif with strong terminals that brings a Kinfolk-magazine / art-book quality to a fintech. The 500 weight is reserved for the largest display sizes where extra weight balances the tight tracking. · `--font-tiempos`
- **Substitute:** Source Serif 4, Lora, or PT Serif
- **Weights:** 400, 500
- **Sizes:** 14, 16, 18, 36, 56, 64, 72, 84
- **Line height:** 1.08, 1.16, 1.24
- **Letter spacing:** -0.01em (slightly negative on display; reads as composed and editorial, not loose)
- **Role:** Display and editorial heading serif — used at 56–84px for hero and section titles, 36px for sub-section heads, and 14–18px for emphasis lead-ins. Tiempos is the soul of the brand: a contemporary text serif with strong terminals that brings a Kinfolk-magazine / art-book quality to a fintech. The 500 weight is reserved for the largest display sizes where extra weight balances the tight tracking.

### The Future — Primary UI and body sans — a clean geometric workhorse used for paragraph copy, nav links, card titles, input fields, and small UI labels at 14–20px. The 500 weight appears in nav and a few mid-size emphasis lines. The near-zero letter-spacing (0.005em) keeps running text tight and un-fussy. It is the calm counterpart to Tiempos's editorial display. · `--font-the-future`
- **Substitute:** Inter, Söhne, or GT America
- **Weights:** 400, 500
- **Sizes:** 14, 16, 18, 20, 56, 58
- **Line height:** 1.00, 1.16, 1.40
- **Letter spacing:** 0.0050em
- **Role:** Primary UI and body sans — a clean geometric workhorse used for paragraph copy, nav links, card titles, input fields, and small UI labels at 14–20px. The 500 weight appears in nav and a few mid-size emphasis lines. The near-zero letter-spacing (0.005em) keeps running text tight and un-fussy. It is the calm counterpart to Tiempos's editorial display.

### Wealthsimple Sans — Tracked-out utility face for buttons, nav controls, and selected UI labels — used at 16px with 0.025em letter-spacing so that interactive elements read as distinct, almost stamp-like marks. The wide tracking pushes these elements forward visually without needing weight, reinforcing the pill-button rhythm across the system. · `--font-wealthsimple-sans`
- **Substitute:** Inter with letter-spacing 0.025em, or Söhne Buch
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.20
- **Letter spacing:** 0.025em (wide-tracked, the brand's interactive-element signature)
- **Role:** Tracked-out utility face for buttons, nav controls, and selected UI labels — used at 16px with 0.025em letter-spacing so that interactive elements read as distinct, almost stamp-like marks. The wide tracking pushes these elements forward visually without needing weight, reinforcing the pill-button rhythm across the system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | 0.07px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 20px | 1.3 | — | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.36px | `--text-heading` |
| heading-lg | 56px | 1.1 | -0.56px | `--text-heading-lg` |
| display | 84px | 1.08 | -0.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 73 | 73px | `--spacing-73` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 100px |
| badges | 1600px |
| inputs | 100px |
| buttons | 1600px |
| smallElements | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Site header with segmented product switcher, primary nav, and auth CTAs

Sits on Paper White (#fcfcfc). A thin 12px-tall row at the very top carries small 12–14px The Future text reading 'Personal | Business' (segmented, left-aligned). Below it the main bar holds the Wealthsimple wordmark (Graphite Ink #32302f, The Future 500), a horizontal nav of links (What we offer, Benefits, Learn, Support — each in The Future 400, 16px), and on the right two pill buttons: 'Log in' as an outlined pill (Graphite border, transparent fill) and 'Get started' as a filled pill (Charcoal #09090a fill, Paper White text, 1600px radius). No drop shadow; a hairline Stone (#e4e2e1) rule may sit at the bottom of the bar.

### Filled Dark Pill Button (Primary)
**Role:** Primary CTA — 'Get started', 'Start my return', 'Start trading'

Pill-shaped (1600px radius), Charcoal #09090a or Graphite #32302f fill, Paper White #fcfcfc text. Label set in Wealthsimple Sans 400, 16px, 0.025em letter-spacing. Vertical padding ~12px, horizontal padding 24–32px. No shadow. The dark pill is the dominant interactive mark across the system; it should always be the loudest button on its surface.

### Outlined Pill Button (Secondary)
**Role:** Secondary CTA — 'Learn more', 'Log in'

Pill-shaped (1600px radius), transparent fill, 1px Graphite Ink #32302f border, Graphite text. Same Wealthsimple Sans 16px label and padding as the filled variant. Lives next to the filled button on dark heroes and in the nav bar; never the sole CTA on a section.

### Ghost Pill Button
**Role:** Low-emphasis CTA used on light surfaces, e.g. 'Start trading' in the trading section

Pill-shaped (1600px radius), no visible border, Linen Cream #faf8f5 fill, Graphite Ink #32302f text. Same label sizing. Used when the design wants a single quiet CTA on a light field without competing with the headline serif.

### Editorial Section Heading (Tiempos Display)
**Role:** Hero and section titles

Set in Tiempos 500 at 56–84px, line-height 1.08–1.16, letter-spacing -0.01em, color Graphite Ink #32302f on light surfaces or Paper White on the Bronze Field hero. Often paired with a small The Future eyebrow above (e.g. 'Self-directed Investing', 'Trusted by more than 2M Canadians') in 14–16px, 0.005em tracking, Pebble #686664.

### Bronze Hero Panel
**Role:** Full-bleed dark feature block hosting 3D sculptural artwork

Full-viewport-width section, Bronze Field #3a3525 background, with the editorial heading and supporting paragraph aligned to the left at ~40% width, and a sculptural 3D illustration (twisted paper, draped forms, card stack) floating on the right with soft ambient shadow into a warm-cream floor. The transition from the dark field to a lighter warm wash is handled by a radial fade — no hard edge. Two CTAs sit beneath the headline: filled dark pill primary + outlined pill secondary.

### Light Editorial Section
**Role:** Standard content section below the hero

Paper White #fcfcfc or Linen Cream #faf8f5 background, max-width 1200px centered. Two-column layout: Tiempos heading + The Future paragraph + single dark-pill CTA on the left (~45% width), 3D illustration or isometric scene on the right. Section vertical padding ~80px. No background, no card chrome — the whitespace and serif type do the work.

### Feature Column with Top Divider
**Role:** Three-column under-section describing product pillars

Three equal columns separated by ~48px gaps. Each column starts with a 1px Stone #e4e2e1 hairline rule at the top, followed by a The Future 500 18–20px headline, then a 14–16px The Future 400 paragraph in Graphite Ink. No background fill, no card — the hairline at the top is the only chrome.

### Eyebrow Tag
**Role:** Small label above display headings, e.g. 'Self-directed Investing'

The Future 400, 14–16px, 0.005em letter-spacing, Pebble #686664 color. Sits 12–16px above the Tiempos heading. Never bold, never uppercase — the muted warmth of the color and tight tracking are the styling.

### Sculptural 3D Illustration
**Role:** Decorative hero and section imagery

Abstract sculptural renders: twisted paper ribbons, draped fabric forms, geometric block compositions in sage green, cream, terracotta, and off-white. Always sit on a warm cream floor with a soft ambient shadow. Rounded, no hard cropping; the illustration reads as a single art object centered in the right half of the layout. Not product UI screenshots.

### Soft Card Surface
**Role:** Optional container for grouped content (e.g. pricing cards, dashboard panels)

Linen Cream #faf8f5 or Paper White #fcfcfc fill, 100px corner radius, 32px padding on all sides, no border, no shadow. The extreme roundness (100px on a small card) is the design's signature softness — it makes even dense product UI feel boutique.

### Text Input
**Role:** Form fields for email, amount, etc.

Transparent or Paper White fill, 1px Stone #e4e2e1 border, 100px radius, The Future 400 16px. Focus state: 1px Graphite Ink #32302f border, no glow. Placeholder text in Pebble #686664. 16px vertical padding.

### Chat Bubble (Bottom-Round)
**Role:** Floating support chat launcher in lower-right corner

A 48px circular Charcoal #09090a button with a Paper White chat-icon glyph inside. No label. Floats 24px from the bottom-right of the viewport. Sits outside the main content flow.

## Do's and Don'ts

### Do
- Use Tiempos at 56–84px for all display and section titles with letter-spacing -0.01em — the serif is the brand's editorial signature
- Use 1600px border-radius on every button, tag, and pill-shaped control — the pill is non-negotiable
- Use warm neutrals (#fcfcfc, #faf8f5, #e4e2e1, #32302f) and reserve Bronze Field #3a3525 for full-bleed dark feature blocks
- Pair Tiempos serif headlines with The Future sans body — never set body copy in Tiempos, never set display in The Future
- Apply 0.025em letter-spacing to every Wealthsimple Sans label inside buttons and nav controls
- Maintain ~80px section gaps and 32px card padding; let whitespace carry hierarchy instead of borders or shadows
- Use sculptural 3D illustrations as the only imagery — never stock photography, never product UI screenshots, never flat icons as heroes

### Don't
- Don't use pure #000000 as primary text — use Graphite Ink #32302f so the dark tones stay warm
- Don't introduce accent colors, gradients, or brand hues — the system is monochrome by design; color only appears inside 3D illustrations
- Don't use square or moderately rounded buttons — every interactive element must be a 1600px pill
- Don't apply CSS drop shadows to cards, modals, or buttons — rely on the warm surface stack and hairlines instead
- Don't set display type in The Future or body in Tiempos — the serif/sans split is the system's core rhythm
- Don't use bright or cool grays, blues, or cool whites — the palette is warm and stays within the cream-graphite axis
- Don't crowd the page with cards, borders, or grid lines — the editorial feel depends on generous, un-divided whitespace

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#fcfcfc` | Default body background for all editorial content sections |
| 2 | Warm Section | `#faf8f5` | Alternate cream sections, hero right-side wash, and card backgrounds needing warmth |
| 3 | Soft Surface | `#f1f0f0` | Subtle elevated regions, hover states, divider fills |
| 4 | Hero Bronze | `#3a3525` | Full-bleed dark feature blocks for the taxes, investing, and 3D-led hero panels |

## Elevation

- **Sculptural 3D illustrations:** `Soft ambient occlusion shadow on a warm-cream floor — no hard drop shadow, just a low-spread warm-grey falloff simulating gallery lighting`

## Imagery

Wealthsimple uses sculptural 3D renders as its only imagery language: twisted paper ribbons, draped fabric forms, geometric block compositions, and isometric card stacks in muted sage, cream, terracotta, and off-white. The renders are treated as gallery objects — placed on the right half of a section on a warm cream floor with soft ambient-occlusion shadow, never cropped, never overlapped with text. There is no photography, no flat illustration, no product UI screenshots, no chart art. Icons are minimal outlined glyphs in Graphite Ink. The overall feel is closer to a Kinfolk spread or a Bottega Veneta product page than a typical fintech — imagery carries atmosphere, not information.

## Layout

The page model is max-width 1200px centered with full-bleed dark feature bands breaking the rhythm. The header is a thin two-row top bar (segmented 'Personal | Business' switcher over a main bar with logo, horizontal nav, and two pill CTAs) that sits directly on the page background with no shadow. The first screen is a full-bleed Bronze Field hero with left-aligned Tiempos display headline (~40% width), supporting paragraph, two pill CTAs, and a large sculptural 3D form floating on the right. Below the hero, sections alternate Paper White and Linen Cream with 80px vertical padding, each in a 2-column 'text-left, illustration-right' composition. Feature lists use a 3-column grid where each column starts with a hairline Stone rule at the top, no card backgrounds. Section transitions are seamless — no dividers between sections, just whitespace and a possible background swap. The chat launcher is the only fixed-position element, floating 24px from the bottom-right.

## Agent Prompt Guide

**Quick Color Reference**
- text: #32302f (Graphite Ink)
- background: #fcfcfc (Paper White)
- secondary background: #faf8f5 (Linen Cream)
- border: #e4e2e1 (Stone)
- muted text: #686664 (Pebble)
- filled button background: #09090a (Charcoal)
- dark hero field: #3a3525 (Bronze Field)
- primary action: no distinct CTA color

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Build a light editorial section:* Paper White #fcfcfc background, max-width 1200px centered, 80px vertical padding. Left column (~45% width): a 14px The Future eyebrow in Pebble #686664, then a Tiempos 500 56px heading in Graphite Ink #32302f with -0.56px letter-spacing, then a 18px The Future 400 paragraph in Graphite, then a single Charcoal filled pill button. Right column: a sculptural 3D render of draped paper or geometric blocks on a warm cream floor with soft ambient shadow.

3. *Build a three-column feature row with hairline dividers:* three equal columns at max-width 1200px with 48px column gaps. Each column begins with a 1px Stone #e4e2e1 horizontal rule at the top, then a The Future 500 20px headline in Graphite Ink, then a 16px The Future 400 paragraph. No card backgrounds, no shadows — the hairline rule is the only chrome.

4. *Build a Bronze Field hero:* full-bleed background in Bronze Field #3a3525, 80–120px vertical padding. Left-aligned at ~40% width: a 14px The Future eyebrow in Paper White at 70% opacity, a Tiempos 500 84px headline in Paper White with -0.84px letter-spacing, a 18px The Future 400 paragraph in Paper White at 80% opacity, and two pill CTAs — a Charcoal filled pill primary next to an outlined pill secondary (1px Paper White border, transparent fill). Right side: a large sculptural 3D form (twisted paper or draped fabric) floating on the right with soft warm ambient shadow.

## Similar Brands

- **Apple (product pages)** — Same editorial display-serif-over-clean-sans hierarchy with full-bleed image-led hero bands and pill-shaped CTAs
- **Bottega Veneta / Mr Porter** — Same warm-paper palette, sculptural 3D-led imagery, and serif display type that reads as fashion/luxury rather than tech
- **Kinfolk Magazine online** — Same generous whitespace, Tiempos-style serif at large sizes, warm off-white canvas, and restrained monochrome palette
- **Stripe (Press/brand sections)** — Same pill-button system and serif+sans type pairing used in editorial features, though Stripe uses cooler neutrals
- **Notion** — Same soft-rounded card surfaces (100px radius) and warm off-white canvas with hairline dividers in place of heavy borders

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite-ink: #32302f;
  --color-paper-white: #fcfcfc;
  --color-linen-cream: #faf8f5;
  --color-fog-veil: #f1f0f0;
  --color-stone: #e4e2e1;
  --color-pebble: #686664;
  --color-onyx: #000000;
  --color-charcoal: #09090a;
  --color-bronze-field: #3a3525;

  /* Typography — Font Families */
  --font-tiempos: 'Tiempos', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-the-future: 'The Future', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wealthsimple-sans: 'Wealthsimple Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: 0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.36px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.56px;
  --text-display: 84px;
  --leading-display: 1.08;
  --tracking-display: -0.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-73: 73px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 1600px;

  /* Named Radii */
  --radius-cards: 100px;
  --radius-badges: 1600px;
  --radius-inputs: 100px;
  --radius-buttons: 1600px;
  --radius-smallelements: 12px;

  /* Surfaces */
  --surface-page-canvas: #fcfcfc;
  --surface-warm-section: #faf8f5;
  --surface-soft-surface: #f1f0f0;
  --surface-hero-bronze: #3a3525;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite-ink: #32302f;
  --color-paper-white: #fcfcfc;
  --color-linen-cream: #faf8f5;
  --color-fog-veil: #f1f0f0;
  --color-stone: #e4e2e1;
  --color-pebble: #686664;
  --color-onyx: #000000;
  --color-charcoal: #09090a;
  --color-bronze-field: #3a3525;

  /* Typography */
  --font-tiempos: 'Tiempos', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-the-future: 'The Future', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wealthsimple-sans: 'Wealthsimple Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: 0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.36px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.56px;
  --text-display: 84px;
  --leading-display: 1.08;
  --tracking-display: -0.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-73: 73px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-full: 100px;
  --radius-full-2: 1600px;
}
```
