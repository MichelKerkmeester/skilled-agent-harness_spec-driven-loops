# Windsurf — Style Reference
> Midnight aurora command center — a deep navy terminal where a single mint teal action glows and a chromatic ribbon is the only permitted spectacle.

**Theme:** dark

Windsurf's visual system is a midnight IDE that walked out into a marketing site: deep navy canvas (#011c42) with one bioluminescent teal accent (#34e8bb) that makes every action glow against the dark. Display headlines use tomatoGrotesk at weight 300 — size does the heavy lifting while weight stays whisper-thin, an anti-convention choice that creates authority through restraint. An aurora ribbon (blue→purple→pink gradient) sweeps across the hero as the sole moment of color spectacle; everywhere else the palette stays disciplined. Components lean pill-shaped (9999px) for actions and gently squared (6px) for cards, with shadows used sparingly because contrast on the dark canvas already creates depth.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Navy | `#011c42` | `--color-midnight-navy` | Page background, section canvas, footer — the dominant surface that gives the entire site its terminal-like confidence |
| Canvas White | `#ffffff` | `--color-canvas-white` | Primary text on dark surfaces, icon strokes, card text in light contexts |
| Obsidian | `#0b100f` | `--color-obsidian` | Near-black text for light-context sections, logo mark, high-contrast headings |
| Warm Sand | `#f8f1e5` | `--color-warm-sand` | Secondary text on dark surfaces, warm accent surface, card borders in light contexts — adds cream warmth that prevents the dark UI from feeling sterile |
| Silver Mist | `#c0c1c6` | `--color-silver-mist` | Hairline borders, dividers, subtle separator strokes — the dominant neutral structural line (5200+ occurrences) |
| Pewter | `#c5beb2` | `--color-pewter` | Box-shadow tone, muted accents on cream surfaces |
| Bioluminescent Teal | `#34e8bb` | `--color-bioluminescent-teal` | Primary action — filled CTA buttons (Download), in-text links, nav accent, active states. The single chromatic color permitted to carry interactive meaning; glows against midnight navy |
| Deep Teal | `#003326` | `--color-deep-teal` | Text on teal surfaces, dark-mode button color variant |
| Lavender Mist | `#a95af8` | `--color-lavender-mist` | Card backgrounds, feature card fills, decorative chip backgrounds — provides purple dimension in card grids |
| Bubblegum | `#fb9ce5` | `--color-bubblegum` | Outlined/ghost action borders, accent text, icon fills, pill button outlines — the secondary accent that complements teal in interactive components |
| Plum Wine | `#43045e` | `--color-plum-wine` | Deep purple card surface variant, layered card backgrounds |
| Soft Blush | `#ffccf3` | `--color-soft-blush` | Light pink card backgrounds, soft accent surface |
| Cosmic Blue | `#006aff` | `--color-cosmic-blue` | Card accent fills, decorative stroke accent |
| Plum Statement | `#5c0047` | `--color-plum-statement` | Magenta text and headings in accent contexts, feature highlight copy |

## Tokens — Typography

### tomatoGrotesk — Display headlines only. The weight 300 at 64-96px is the signature choice — most marketing sites use 600-700 for display; this system lets size carry authority and keeps weight whisper-thin. Used for hero ('Where developers are doing their best work'), section titles ('Cascade', 'Devin'), and feature headings. · `--font-tomatogrotesk`
- **Substitute:** Inter (weight 300) or Söhne Breit
- **Weights:** 300, 400, 500
- **Sizes:** 40px, 48px, 64px, 72px, 96px
- **Line height:** 1.00
- **Letter spacing:** -1.08px at 40px, -0.576px at 48px, -0.576px at 64px, -0.864px at 96px
- **Role:** Display headlines only. The weight 300 at 64-96px is the signature choice — most marketing sites use 600-700 for display; this system lets size carry authority and keeps weight whisper-thin. Used for hero ('Where developers are doing their best work'), section titles ('Cascade', 'Devin'), and feature headings.

### DM Sans — Body text, subheadings, navigation, buttons, list items, card content. The workhorse font — comfortable geometric sans with moderate negative tracking that tightens the feel without sacrificing readability. · `--font-dm-sans`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px, 28px, 40px
- **Line height:** 1.00, 1.30, 1.33, 1.50, 1.56, 1.71, 2.40
- **Letter spacing:** -0.45px at 10px, -0.26px at 12px, -0.31px at 14px, -0.34px at 16px, -0.36px at 18px, -0.4px at 20px, -0.56px at 28px, -0.8px at 40px
- **Role:** Body text, subheadings, navigation, buttons, list items, card content. The workhorse font — comfortable geometric sans with moderate negative tracking that tightens the feel without sacrificing readability.

### DM Mono — Code-adjacent labels, BETA badges, nav micro-text, technical annotations. The monospace signals 'developer tool' — its 0.05em positive tracking on caps reads as technical/precise, a deliberate contrast to the whisper-thin display weight. · `--font-dm-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1.20, 1.43, 1.56, 1.71
- **Letter spacing:** 0.6px at 12px, 0.7px at 14px (0.05em positive tracking for uppercase usage)
- **Role:** Code-adjacent labels, BETA badges, nav micro-text, technical annotations. The monospace signals 'developer tool' — its 0.05em positive tracking on caps reads as technical/precise, a deliberate contrast to the whisper-thin display weight.

### ui-sans-serif — System fallback for browser-default rendering and any text not covered by the primary fonts. Sparse usage — the custom fonts carry the brand. · `--font-ui-sans-serif`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.43, 1.50
- **Role:** System fallback for browser-default rendering and any text not covered by the primary fonts. Sparse usage — the custom fonts carry the brand.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | 0.5px | `--text-caption` |
| body | 16px | 1.56 | -0.34px | `--text-body` |
| body-lg | 18px | 1.71 | -0.38px | `--text-body-lg` |
| subheading | 20px | 1.5 | -0.42px | `--text-subheading` |
| heading-sm | 28px | 1.33 | -0.56px | `--text-heading-sm` |
| heading | 40px | 1.3 | -0.8px | `--text-heading` |
| heading-lg | 48px | 1 | -0.58px | `--text-heading-lg` |
| display | 72px | 1 | -0.65px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 144 | 144px | `--spacing-144` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| badges | 9999px |
| inputs | 6px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.2) 0px 10px 15px -3px, rgba(0, 0, 0, 0.2)...` | `--shadow-md` |
| subtle | `rgba(52, 211, 153, 0.5) 0px 1px 2px 0px` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.2) 0px 4px 6px -1px, rgba(0, 0, 0, 0.2) 0...` | `--shadow-sm` |
| subtle-2 | `rgba(251, 191, 36, 0.5) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| md-2 | `rgba(0, 0, 0, 0.22) 0px 4px 16px 0px, rgba(0, 0, 0, 0.14)...` | `--shadow-md-2` |
| subtle-3 | `rgb(251, 156, 229) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary CTA Button (Pill)
**Role:** Main download / conversion action in hero and nav

Filled teal (#34e8bb) background, deep teal (#003326) text, 9999px border-radius, 12px 24px padding, DM Sans weight 600 at 16px. Carries a 0px 4px 16px rgba(0,0,0,0.22) box-shadow for lift. The only filled chromatic button — instantly identifiable as the primary action across the entire site.

### Secondary Ghost Button (Pill)
**Role:** Secondary action paired with primary CTA

Transparent or near-transparent background with #ffffff text and a subtle white-on-navy border, 9999px radius, 12px 24px padding, DM Sans weight 500. Sits beside the teal Download button as a lower-commitment option.

### In-Text Action Link
**Role:** Inline section links like 'EXPLORE THE FEATURES →' and 'LEARN ABOUT DEVIN →'

Bioluminescent teal (#34e8bb) color, DM Sans weight 500 at 12-14px, uppercase, 0.05em letter-spacing, trailing arrow glyph. The wide tracking + teal is the signature pattern for scroll/navigation cues in body copy.

### Feature Badge (BETA Tag)
**Role:** Release announcement badge above hero headline

Subtle surface background with a small dot icon and text. DM Mono at 12px, uppercase, 0.05em tracking. Pill-shaped at 9999px radius. Sits as a compact pre-headline annotation, not a call-to-action.

### Top Navigation Bar
**Role:** Primary site navigation with logo, menu items, user icon, and persistent download CTA

Transparent or matching midnight navy background. Logo left, center menu with dropdown indicators, user icon in a thin circle outline (32px), and a teal Download pill button right. 12px DM Sans menu items, 6px gap between items.

### Hero Headline Block
**Role:** Primary page headline with supporting badge and dual CTAs

BETA badge → tomatoGrotesk weight 300 at 64-72px, white (#ffffff), letter-spacing -0.65px. Two-line layout, left-aligned. Subtitle in DM Sans 18px weight 400 at 1.71 line-height in #ffffff or warm sand. Paired CTA row: teal primary + ghost secondary, 12px gap between them.

### Section Heading Block
**Role:** Feature section titles like 'Cascade' and 'Devin'

Centered layout. Eyebrow link in teal DM Sans 12px uppercase (0.05em tracking). tomatoGrotesk weight 300 at 48-64px, white, centered. Description paragraph in DM Sans 16px at 1.56 line-height, max-width ~640px.

### Two-Column Feature Row
**Role:** Below-section content layout (left heading / right description + link)

Thin silver (#c0c1c6) horizontal divider on top at 1px. Two columns at roughly 1:1 ratio with 32px gap. Left: tomatoGrotesk weight 400 at 28-40px heading. Right: DM Sans body copy with teal in-text action link below.

### Client Logo Strip
**Role:** Social proof band of trusted-by logos

Horizontal row of grayscale corporate logos (Cisco, Mercado Libre, Dell, VMware, etc.), evenly spaced, white or light gray on midnight navy. Logos sit at uniform height (~28-32px) with consistent vertical alignment. No card backgrounds or dividers between them.

### Aurora Ribbon Decoration
**Role:** Hero decorative element — the signature visual spectacle

Flowing wave/ribbon SVG on the right side of the hero. Gradient transitions through blue → purple → pink (#006aff → #a95af8 → #fb9ce5). Partial opacity where it exits the frame. Anchored right, extends beyond viewport.

### Product Preview Surface
**Role:** Placeholder for product screenshots/visuals in feature sections

Rounded rectangle (6px) in a slightly lighter navy than the canvas, containing product imagery. Functions as a 'window' into the IDE. Should feel embedded in the page, not floating.

## Do's and Don'ts

### Do
- Set every page and section background to #011c42 (Midnight Navy) — the dark canvas is the brand identity
- Use #34e8bb (Bioluminescent Teal) exclusively for primary actions and in-text navigation links — it is the only chromatic color permitted to carry interactive meaning
- Set all display headlines to tomatoGrotesk at weight 300 — let the size (48-96px) carry authority, never the weight
- Use 9999px border-radius for all buttons, badges, and tags — the pill shape is the signature button form
- Use 6px border-radius for cards, inputs, and product preview surfaces
- Apply the aurora ribbon (blue→purple→pink gradient flow) as the sole moment of color spectacle in hero/feature sections
- Set body text to DM Sans at 16px / 1.56 line-height with -0.34px letter-spacing for comfortable reading density

### Don't
- Never use weight 600+ for display headlines — the whisper-thin 300 is the signature choice; bold display would betray the system
- Never add multiple chromatic accent colors to a single component — the palette is disciplined: teal for action, everything else is neutral or surface
- Never use a white or light-gray page background — the dark canvas is the brand; light sections would feel like a different site
- Never apply heavy drop shadows (opacity > 0.25) to most elements — depth comes from contrast on dark, not from elevation stacks
- Never use square (0px) or large (>12px) border-radius on buttons — pill (9999px) is the only correct button radius
- Never use system fonts for display — tomatoGrotesk (or its substitute) is required for headlines; the geometric character is load-bearing
- Never put the aurora gradient on buttons, text, or interactive elements — it is decorative-only, confined to hero ribbons and large background art

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#011c42` | Full-bleed page background — every section sits on this navy |
| 1 | Lifted Navy | `#14376` | Gradient endpoint for elevated sections and hero background transition |
| 2 | Cream Surface | `#f8f1e5` | Warm card surface, light-context section alternative |
| 3 | Accent Card | `#a95af8` | Colored card backgrounds for feature highlights |

## Elevation

- **Primary CTA Button:** `rgba(0, 0, 0, 0.22) 0px 4px 16px 0px, rgba(0, 0, 0, 0.14) 0px 1px 3px 0px`
- **Elevated Card / Overlay:** `rgba(0, 0, 0, 0.2) 0px 10px 15px -3px, rgba(0, 0, 0, 0.2) 0px 4px 6px -4px`
- **Standard Card:** `rgba(0, 0, 0, 0.2) 0px 4px 6px -1px, rgba(0, 0, 0, 0.2) 0px 2px 4px -2px`

## Imagery

The site uses no photography. Visual language is built from three sources: (1) a flowing aurora ribbon — an SVG gradient wave transitioning blue → purple → pink that sweeps across the hero and lower sections, the sole moment of color spectacle; (2) a grayscale client logo strip (Cisco, Dell, VMware, etc.) for social proof, rendered flat at uniform height with no card backgrounds; (3) product preview surfaces — rounded rectangles in slightly lifted navy that act as windows into the IDE, to be filled with actual product screenshots. The brand mark ('W' for Windsurf) is a simple geometric wind/leaf glyph in white. Icons throughout are line-based, thin-stroke (1-1.5px), monochrome white or teal. The visual density is text-dominant: imagery occupies <15% of any screen, with the aurora ribbon doing the heavy atmospheric lifting.

## Layout

Full-bleed dark sections, max-width 1280px for content containers. The hero is a split composition: large left-aligned headline (tomatoGrotesk 72px weight 300) with badge → headline → dual CTAs → micro-bullet text, balanced against a decorative aurora ribbon anchored to the right edge that extends beyond the viewport. Navigation is a transparent top bar with logo left, centered menu, user-icon + teal Download pill right. A grayscale client logo strip sits as a horizontal band between the hero and first feature. Feature sections follow a consistent vertical rhythm: eyebrow teal link → centered tomatoGrotesk heading → centered description → thin silver divider → 2-column row (heading left, body+action link right) → product preview surface. Section gaps are generous (80px) to let the dark canvas breathe. The page reads as a single continuous dark environment rather than discrete cards stacked on a light background.

## Agent Prompt Guide

## Quick Color Reference
- background: #011c42 (Midnight Navy)
- text: #ffffff (Canvas White)
- border: #c0c1c6 (Silver Mist)
- accent: #34e8bb (Bioluminescent Teal)
- surface accent: #a95af8 (Lavender Mist)
- primary action: #34e8bb (filled action)

## Example Component Prompts

**1. Hero Headline Block**
Create a Primary Action Button: #34e8bb background, #0b100f text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

**2. Section Heading + Two-Column Row**
Create a feature section on #011c42. Eyebrow: DM Sans 12px uppercase, 0.05em tracking, #34e8bb, centered. Heading: tomatoGrotesk weight 300, 64px, #ffffff, centered, letter-spacing -0.58px. Description: DM Sans 16px weight 400, line-height 1.56, #ffffff, max-width 640px, centered. Thin 1px #c0c1c6 divider below. Two-column row with 32px gap: left column has tomatoGrotesk weight 400, 40px, #ffffff heading; right column has DM Sans 16px body text with a teal in-text action link below reading 'EXPLORE FEATURES →' in DM Sans 12px uppercase, 0.05em tracking, #34e8bb.

**3. Primary CTA Pill Button**
Filled teal pill button: background #34e8bb, text #003326, font DM Sans weight 600 size 16px, padding 12px 24px, border-radius 9999px, box-shadow rgba(0,0,0,0.22) 0px 4px 16px, rgba(0,0,0,0.14) 0px 1px 3px. No border. This is the only filled chromatic button pattern on the site.

**4. Ghost Secondary Button**

**5. Client Logo Strip**
Horizontal row of 8-10 grayscale client logos (32px height) on #011c42 background. Logos rendered in #ffffff or #c0c1c6 (no color), evenly distributed with flexbox justify-content: space-between, max-width 1280px, vertically centered, 40px vertical padding above and below. No card backgrounds, no dividers between logos.

## Rainbow Accent Palette (Decorative Only)

The site also includes a set of vivid decorative stroke colors that appear in SVG illustrations and icon accents: #ff0000 (red), #9500ff (violet), #ff5d00 (orange), #fffb00 (yellow), #00f70c (green), #ff00d5 (pink). These are NEVER to be used for text, buttons, or functional UI — they exist only as decorative SVG strokes for illustrations and graphical accents. If an illustration calls for a rainbow effect, pull from this set. If the design needs a functional color, use the disciplined teal/pink/lavender system from the core palette.

## Similar Brands

- **Linear** — Same midnight dark canvas with a single vivid accent for primary actions, and the same whisper-thin large display headlines that use size over weight for authority
- **Cursor** — Direct AI-coding-tool peer with the same dark IDE-derived palette, teal/green interactive accent, and developer-centric typographic confidence
- **Vercel** — Shares the full-bleed dark section model with gradient depth, generous vertical spacing between sections, and a disciplined single-accent-color system
- **Arc Browser** — Same dark-canvas product aesthetic with aurora-like gradient ribbons as decorative spectacle against otherwise disciplined chromatic restraint

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-navy: #011c42;
  --color-canvas-white: #ffffff;
  --color-obsidian: #0b100f;
  --color-warm-sand: #f8f1e5;
  --color-silver-mist: #c0c1c6;
  --color-pewter: #c5beb2;
  --color-bioluminescent-teal: #34e8bb;
  --color-deep-teal: #003326;
  --color-lavender-mist: #a95af8;
  --color-bubblegum: #fb9ce5;
  --color-plum-wine: #43045e;
  --color-soft-blush: #ffccf3;
  --color-cosmic-blue: #006aff;
  --color-plum-statement: #5c0047;

  /* Typography — Font Families */
  --font-tomatogrotesk: 'tomatoGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.34px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.71;
  --tracking-body-lg: -0.38px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.42px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.56px;
  --text-heading: 40px;
  --leading-heading: 1.3;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.58px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.65px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-144: 144px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-badges: 9999px;
  --radius-inputs: 6px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.2) 0px 10px 15px -3px, rgba(0, 0, 0, 0.2) 0px 4px 6px -4px;
  --shadow-subtle: rgba(52, 211, 153, 0.5) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 4px 6px -1px, rgba(0, 0, 0, 0.2) 0px 2px 4px -2px;
  --shadow-subtle-2: rgba(251, 191, 36, 0.5) 0px 1px 2px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.22) 0px 4px 16px 0px, rgba(0, 0, 0, 0.14) 0px 1px 3px 0px;
  --shadow-subtle-3: rgb(251, 156, 229) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-midnight-canvas: #011c42;
  --surface-lifted-navy: #14376;
  --surface-cream-surface: #f8f1e5;
  --surface-accent-card: #a95af8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-navy: #011c42;
  --color-canvas-white: #ffffff;
  --color-obsidian: #0b100f;
  --color-warm-sand: #f8f1e5;
  --color-silver-mist: #c0c1c6;
  --color-pewter: #c5beb2;
  --color-bioluminescent-teal: #34e8bb;
  --color-deep-teal: #003326;
  --color-lavender-mist: #a95af8;
  --color-bubblegum: #fb9ce5;
  --color-plum-wine: #43045e;
  --color-soft-blush: #ffccf3;
  --color-cosmic-blue: #006aff;
  --color-plum-statement: #5c0047;

  /* Typography */
  --font-tomatogrotesk: 'tomatoGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.34px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.71;
  --tracking-body-lg: -0.38px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.42px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.56px;
  --text-heading: 40px;
  --leading-heading: 1.3;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.58px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.65px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-144: 144px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.2) 0px 10px 15px -3px, rgba(0, 0, 0, 0.2) 0px 4px 6px -4px;
  --shadow-subtle: rgba(52, 211, 153, 0.5) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 4px 6px -1px, rgba(0, 0, 0, 0.2) 0px 2px 4px -2px;
  --shadow-subtle-2: rgba(251, 191, 36, 0.5) 0px 1px 2px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.22) 0px 4px 16px 0px, rgba(0, 0, 0, 0.14) 0px 1px 3px 0px;
  --shadow-subtle-3: rgb(251, 156, 229) 0px 0px 0px 1px inset;
}
```
