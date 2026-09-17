# BitcoinOS — Style Reference
> Obsidian monolith with a burning yellow sigil — BitcoinOS is a crypto project whose interface looks like a declaration carved in stone, with cinematic 3D worlds bleeding in at the edges.

**Theme:** dark

BitcoinOS is a monochrome dark cinematic system where a 3D-rendered fantasy world carries all the color and emotion while the UI stays austere and terminal-like. Headlines shout in a custom ultra-condensed display face at 72–128px weight 900 with near-zero line-height, while body and nav copy use a wide-tracked monospace-adjacent face (Kalice) at 12–16px with 0.04–0.06em spacing — the combination reads as a manifesto printed on obsidian. The only UI accent is #fffafa (Snow), used for borders, text, and the single filled CTA; every other surface is a step of charcoal (#101010 → #1a1a1a → #272727). There are no shadows, no gradients, no chromatic brand color — elevation is communicated by lighter grays and 1px white-alpha borders. Imagery is full-bleed and filmic, with the UI elements floating as minimal white type and pill-shaped controls.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#101010` | `--color-obsidian` | Page canvas, primary dark surface |
| Void | `#000000` | `--color-void` | Maximum depth, nav borders, icon outlines, image masks |
| Carbon | `#1a1a1a` | `--color-carbon` | Card surfaces, elevated panels one step above canvas |
| Graphite | `#272727` | `--color-graphite` | Hover/active surface lift, tertiary borders, input fields |
| Smoke | `#403f3f` | `--color-smoke` | Dividers, secondary surface tier, muted container backgrounds |
| Ash | `#bababa` | `--color-ash` | Muted helper text, secondary nav labels, disabled copy |
| Snow | `#fffafa` | `--color-snow` | Primary text, headings, filled CTA background, hairline borders — the only non-structural color in the system |

## Tokens — Typography

### Review Condensed — Display headlines only — the 128px hero, 72px section openers. Ultra-condensed 900 weight with 0.8 line-height creates a compressed, manifesto-grade statement. The near-zero line-height at 128px is the signature: letters almost collide vertically, giving the type a carved-into-stone density. Free substitute: Anton or Bebas Neue at equivalent weight. · `--font-review-condensed`
- **Substitute:** Anton / Bebas Neue
- **Weights:** 900
- **Sizes:** 72px, 128px
- **Line height:** 0.80
- **Role:** Display headlines only — the 128px hero, 72px section openers. Ultra-condensed 900 weight with 0.8 line-height creates a compressed, manifesto-grade statement. The near-zero line-height at 128px is the signature: letters almost collide vertically, giving the type a carved-into-stone density. Free substitute: Anton or Bebas Neue at equivalent weight.

### Review — Buttons, nav labels, subheadings, card titles, emphasized body. At 14–18px it functions as UI text with weight 700; at 32px weight 900 it serves as in-section headings. Slight negative tracking at small sizes (-0.01em) tightens the UI, while +0.02em at 32px opens the heading. Free substitute: Archivo Black or Space Grotesk Bold. · `--font-review`
- **Substitute:** Archivo Black / Space Grotesk Bold
- **Weights:** 700, 900
- **Sizes:** 14px, 18px, 32px
- **Line height:** 0.75, 0.88, 1.00, 1.10
- **Letter spacing:** -0.0100em, 0.0100em, 0.0200em
- **Role:** Buttons, nav labels, subheadings, card titles, emphasized body. At 14–18px it functions as UI text with weight 700; at 32px weight 900 it serves as in-section headings. Slight negative tracking at small sizes (-0.01em) tightens the UI, while +0.02em at 32px opens the heading. Free substitute: Archivo Black or Space Grotesk Bold.

### Kalice — Body copy, nav items, and any all-caps micro-text. The 0.04–0.06em letter-spacing is the technical-fingerprint detail — at 12px it reads as terminal/monospace-adjacent labels (think captcha, ticker, or command line), and at 16px it becomes technical documentation prose. Free substitute: JetBrains Mono or IBM Plex Mono. · `--font-kalice`
- **Substitute:** JetBrains Mono / IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12px, 16px, 24px
- **Line height:** 1.00, 1.40, 1.60
- **Letter spacing:** 0.04em at 12px, 0.06em at 24px, 0.04–0.06em at 16px
- **Role:** Body copy, nav items, and any all-caps micro-text. The 0.04–0.06em letter-spacing is the technical-fingerprint detail — at 12px it reads as terminal/monospace-adjacent labels (think captcha, ticker, or command line), and at 16px it becomes technical documentation prose. Free substitute: JetBrains Mono or IBM Plex Mono.

### Times (system) — Fallback body — appears as default browser rendering where custom faces haven't loaded. Do not design against this; treat as graceful degradation only. · `--font-times-system`
- **Substitute:** Times New Roman
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Fallback body — appears as default browser rendering where custom faces haven't loaded. Do not design against this; treat as graceful degradation only.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.48px | `--text-caption` |
| body-sm | 14px | 0.88 | -0.14px | `--text-body-sm` |
| body | 16px | 1.6 | 0.96px | `--text-body` |
| subheading | 18px | 1.1 | 0.18px | `--text-subheading` |
| heading-sm | 24px | 1.4 | 1.44px | `--text-heading-sm` |
| heading | 32px | 1 | 0.64px | `--text-heading` |
| display | 72px | 0.8 | — | `--text-display` |
| display-lg | 128px | 0.8 | — | `--text-display-lg` |

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
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| links | 2px |
| images | 16px |
| buttons | 8px |
| navPills | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 128px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Display Headline (Hero Manifesto)
**Role:** 128px Review Condensed 900 white, line-height 0.80, tracking 0, centered. The defining component of the brand — three lines of compressed ultra-bold type that fill the viewport width.

Font: Review Condensed 900, 128px, line-height 0.80, color #fffafa, text-align center, letter-spacing 0. Sits directly over a full-bleed 3D-rendered background with no overlay or scrim — the type must hold its own against cinematic imagery.

### Section Heading
**Role:** 72px Review Condensed 900, white, used as section openers below the hero.

Font: Review Condensed 900, 72px, line-height 0.80, color #fffafa, letter-spacing 0. Same compression logic as the hero display, scaled to one section.

### Primary CTA Button (Filled Snow)
**Role:** The single filled action in the system — white background, black text, used once per page.

Background: #fffafa. Text: #000000. Font: Review 700, 14px, line-height 0.88, letter-spacing -0.01em, uppercase. Padding: 8px 24px. Border-radius: 8px. No shadow, no border. Text transforms to 'Join the Revolution' style — imperative, two to three words maximum.

### Pill Nav Button
**Role:** Top navigation items in the sticky header — Ecosystem, Token, Tech.

Background: #1a1a1a. Border: 1px solid #272727. Text: #fffafa, Kalice 400, 12px, letter-spacing 0.04em, uppercase. Padding: 8px 16px. Border-radius: 9999px. Hover: border becomes #fffafa, text remains white. Active state: background #272727.

### Ecosystem Chain Card
**Role:** Grid tile for a partner chain logo (Cardano, Litecoin, Arbitrum, etc.) in the ecosystem section.

Background: #1a1a1a. Border: 1px solid #272727. Border-radius: 16px. Padding: 24px. Content: chain logo (white SVG) + chain name in Review 700 14px white. Grid: 4 columns desktop, 2 columns mobile, gap 8px. Hover: border becomes #fffafa, subtle 1-step lift.

### Sticky Top Nav Bar
**Role:** Full-width dark bar with logo, centered brand mark, and right-aligned pill buttons plus hamburger.

Background: #000000 or transparent over hero. Height: ~64px. Logo: BitcoinOS cube icon, 32px square, left. Brand mark 'BOS' in Review 900 24px white, centered. Right cluster: three pill nav buttons + 40px square hamburger button with #272727 background and #fffafa icon.

### Side Dot Pagination
**Role:** Vertical page section indicator on the right edge of the viewport.

Fixed right margin, ~32px from edge. Stack of 5–6 small dots, 6px square, 8px vertical gap. Inactive: 1px solid #fffafa, fill transparent. Active: filled #fffafa. Always visible, serves as scroll-spy navigation.

### Hero Subtitle
**Role:** Two-line descriptive text below the display headline.

Font: Kalice 400, 16px, line-height 1.60, letter-spacing 0.04em. Color: #fffafa. Max-width: ~480px, centered. The wide tracking at body size gives it a 'manuscript footnote' feel against the compressed headline.

### Scroll Cue / Bottom Pill
**Role:** Small dark pill at the bottom of full-bleed visual sections.

Background: #000000. Border-radius: 9999px. Padding: 8px 16px. Text: Kalice 400, 12px, letter-spacing 0.04em, color #fffafa. Content: section context like 'Now • Buy $BOS Now • Buy $...' with dot separators.

### [ Vision ] Label
**Role:** Tiny section eyebrow tag in the top-left of content sections.

Font: Kalice 400, 12px, letter-spacing 0.04em. Color: #fffafa. Format: '[ Section Name ]' in square brackets — the brackets are part of the type, a terminal/CLI nod. Sits above section copy with 16px bottom margin.

### Full-Bleed Cinematic Section
**Role:** The page's signature background treatment — 3D-rendered fantasy or abstract scenes filling the viewport.

Width: 100vw, height: 100vh or content-driven. Background: 3D render (green mossy landscape with robed figure, or golden geometric shapes). No overlay. UI floats as centered white type and a single white CTA.

### Logo Lockup (Header Brand Mark)
**Role:** BitcoinOS cube icon + 'BOS' wordmark in the top nav center.

Icon: 3D-styled rounded square, ~40px, white fill or outlined white. Wordmark: Review 900, 24px, color #fffafa. Icon and wordmark are separate elements, horizontally aligned, ~16px gap.

## Do's and Don'ts

### Do
- Use Review Condensed 900 at 72–128px with line-height 0.80 for every hero and section display — this compression is the brand's visual signature.
- Set all small UI text (12–16px) in Kalice 400 with letter-spacing 0.04–0.06em to maintain the terminal/manifesto voice.
- Use #fffafa (Snow) as the only non-structural color — for the single filled CTA, all primary text, and active borders on dark surfaces.
- Apply 16px border-radius to all cards and images, 8px to all buttons, and 9999px to all nav pills and tag chips — never mix these tiers.
- Make every full-bleed section a viewport-height cinematic moment: 3D render or abstract artwork as background, centered white type floating on top with no scrim.
- Keep the surface stack to five neutrals only: #101010 (canvas) → #1a1a1a (card) → #272727 (hover/elevated) → #403f3f (divider) → #fffafa (foreground). Never introduce a sixth.
- Use the side dot pagination pattern (6px squares, 1px white border, filled white = active) on any scroll-driven page — it reinforces the page-as-narrative structure.

### Don't
- Never introduce a chromatic brand color to the UI — the only color in the system is the white/charcoal scale plus the gold that lives exclusively inside 3D-rendered imagery.
- Never apply a shadow, glow, or drop-shadow to any component — the system is deliberately flat; elevation comes from lighter grays and 1px white borders.
- Never use a sans-serif humanist body face (Inter, SF, Roboto) — Kalice with wide tracking is non-negotiable for body and nav copy.
- Never break the line-height 0.80 on Review Condensed displays — opening the line-height destroys the carved-stone compression that defines the hero.
- Never add gradients, color washes, or overlay scrims over imagery — the 3D renders carry full visual weight and UI floats on top, unprotected.
- Never use a border-radius below 8px on buttons or below 16px on cards — the 2px radius is reserved for inline link underlines only.
- Never place more than one filled #fffafa button on a single screen — the system treats the filled CTA as singular punctuation, not a pattern.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#101010` | Page background, default section fill |
| 1 | Carbon Card | `#1a1a1a` | Card surfaces, ecosystem tiles, nav pill background |
| 2 | Graphite Elevated | `#272727` | Hover state, active nav, input field background, secondary borders |
| 3 | Smoke Divider | `#403f3f` | Hairline dividers, tertiary container borders |
| 4 | Snow Foreground | `#fffafa` | Primary text, filled CTA, active borders — the system's only non-neutral foreground |

## Elevation

The system is intentionally flat. No shadows are used anywhere. Elevation is communicated exclusively through a five-step neutral surface stack (#101010 → #1a1a1a → #272727 → #403f3f → #fffafa) and 1px borders that brighten as state becomes more active. The only exception is filled #fffafa on the primary CTA, which functions as foreground contrast rather than true elevation.

## Imagery

Imagery is the only chromatic element of the brand and it lives exclusively in full-bleed 3D-rendered cinematic scenes. The first scene is a fantasy landscape: a robed figure holding a glowing golden cube in a mossy green valley with floating landmasses and a bright sky. The second is abstract architecture: faceted golden geometric volumes against deep navy-black void. Both scenes fill the viewport edge-to-edge, contain no UI overlays, and the white type and CTA float directly on top. Photography is absent; illustration is absent; the visual identity is carried entirely by cinematic 3D renders. Icons are minimal: a BitcoinOS cube logo in the nav, white chain-partner logos in the ecosystem grid, and simple line icons in the hamburger. Imagery density is extreme — at least two full-viewport renders per page — and they alternate with text-only dark sections for breathing room.

## Layout

Pages are full-bleed with no outer container width limit; content aligns to viewport edges. The hero is a full-viewport 3D render with centered display headline and single CTA floating over it. Sections alternate between cinematic full-bleed imagery and pure text-on-#101010 bands, separated by 128px vertical gaps. The ecosystem section uses a 4-column grid of 16px-radius cards with 8px gaps on desktop (2-column on mobile). The sticky top nav is a single dark bar with logo left, brand mark centered, and right-aligned pill nav plus hamburger. Section eyebrow labels sit flush left with bracket formatting '[ Vision ]'. The layout rhythm is intentionally sparse between sections (96–128px gaps) to let the 3D imagery breathe. A right-edge vertical dot pagination is always present on scroll-driven pages, providing a persistent navigation cue alongside the main header.

## Agent Prompt Guide

**Quick Color Reference**
- text: #fffafa
- background: #101010
- border: #272727
- accent: #bababa (muted helper text only)
- surface (card): #1a1a1a
- primary action: #fffafa (filled action)

**Example Component Prompts**
1. *Hero display headline*: 128px Review Condensed weight 900, color #fffafa, line-height 0.80, text-align center, letter-spacing 0, floating directly over a full-bleed 3D-rendered background with no scrim.
2. *Ecosystem chain card*: background #1a1a1a, 1px border #272727, border-radius 16px, padding 24px. Content is a white chain logo (32px) left-aligned above a 14px Review 700 #fffafa chain name. 4-column grid, 8px gap.
3. *Top nav pill button*: background #1a1a1a, 1px border #272727, border-radius 9999px, padding 8px 16px. Text: Kalice 400 12px #fffafa, letter-spacing 0.04em, uppercase. Hover: border becomes #fffafa.
4. *Section eyebrow label*: Kalice 400 12px #fffafa, letter-spacing 0.04em, format '[ Section Name ]' with literal square brackets, flush left, 16px bottom margin to body copy.
5. *Filled primary action button*: background #fffafa, text #000000, font Review 700 14px, letter-spacing -0.01em, uppercase, padding 8px 24px, border-radius 8px, no border, no shadow. Use at most once per screen.

## Type Voice Rules

The system operates on a strict two-voice type pairing: **Review Condensed 900** for displays (the 'shout' voice) and **Kalice 400** for everything else (the 'whisper' voice). Review Condensed only ever appears at 72px or 128px with line-height 0.80 — it is never used for body, buttons, or cards. Kalice only ever appears at 12–24px with letter-spacing ≥ 0.04em — the wide tracking is what makes UI text feel technical and terminal-grade. Review at 14–32px bridges the two voices for buttons, subheadings, and emphasized text. Do not introduce a third body face.

## Imagery Rules

All imagery must be full-bleed 3D-rendered cinematic scenes or pure 3D abstract geometry. No photography, no flat illustration, no 2D vector graphics. Backgrounds must reach viewport edges with no padding or border. White UI type floats on the renders with no overlay, scrim, or text-shadow. At least one full-viewport render must anchor the top of every page; additional renders may appear at section breaks. The only color allowed inside renders is the golden/yellow geometric family — the green-moss palette is reserved for the hero scene.

## Similar Brands

- **Aptos** — Same dark monochrome UI with a single ultra-bold condensed display face (Aptos uses heavyweight serif) over cinematic 3D-rendered backgrounds; both treat the rendered scene as the page's color source.
- **Sui** — Dark-mode crypto landing with massive compressed display headlines, wide-tracked mono labels for nav and body, and 3D-rendered hero scenes with floating white type.
- **Celestia** — Shares the manifesto-grade display typography, near-zero chromatic UI palette, and full-bleed atmospheric imagery as the primary brand vehicle.
- **Monad** — Dark crypto brand with a single filled white CTA, pill-shaped nav buttons, ultra-bold condensed headlines, and cinematic 3D renders that carry the color story.
- **Berachain** — Same 3D-rendered fantasy/mythological hero scenes over a flat dark monochrome interface, with white type and minimal UI chrome.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #101010;
  --color-void: #000000;
  --color-carbon: #1a1a1a;
  --color-graphite: #272727;
  --color-smoke: #403f3f;
  --color-ash: #bababa;
  --color-snow: #fffafa;

  /* Typography — Font Families */
  --font-review-condensed: 'Review Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-review: 'Review', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kalice: 'Kalice', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-system: 'Times (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 0.88;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.96px;
  --text-subheading: 18px;
  --leading-subheading: 1.1;
  --tracking-subheading: 0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 1.44px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: 0.64px;
  --text-display: 72px;
  --leading-display: 0.8;
  --text-display-lg: 128px;
  --leading-display-lg: 0.8;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 128px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 48px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-links: 2px;
  --radius-images: 16px;
  --radius-buttons: 8px;
  --radius-navpills: 9999px;

  /* Surfaces */
  --surface-obsidian-canvas: #101010;
  --surface-carbon-card: #1a1a1a;
  --surface-graphite-elevated: #272727;
  --surface-smoke-divider: #403f3f;
  --surface-snow-foreground: #fffafa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #101010;
  --color-void: #000000;
  --color-carbon: #1a1a1a;
  --color-graphite: #272727;
  --color-smoke: #403f3f;
  --color-ash: #bababa;
  --color-snow: #fffafa;

  /* Typography */
  --font-review-condensed: 'Review Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-review: 'Review', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kalice: 'Kalice', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-system: 'Times (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 0.88;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.96px;
  --text-subheading: 18px;
  --leading-subheading: 1.1;
  --tracking-subheading: 0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 1.44px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: 0.64px;
  --text-display: 72px;
  --leading-display: 0.8;
  --text-display-lg: 128px;
  --leading-display-lg: 0.8;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 48px;
}
```
