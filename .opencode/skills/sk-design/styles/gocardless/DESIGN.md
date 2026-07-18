# Gocardless — Style Reference
> warm cream broadsheet with acid yellow highlighter

**Theme:** mixed

GoCardless uses a warm, editorial fintech language: a cream paper-white canvas punctuated by one electric acid-yellow accent that acts as functional highlighter rather than decoration. The system lives almost entirely in achromatic warm tones — deep charcoal text on cream surfaces — with bold sans-serif typography that carries the weight of the design. Type is oversized and confident (up to 84px display, weight 700) sitting alongside a single whisper-light serif at 48px for contrast. Surfaces are flat with hairline borders instead of shadows, and every interactive element rounds to a generous 32px pill, giving the interface a soft, button-like tactility. The result feels like a well-designed financial newspaper: serious, warm, and surprisingly playful when the yellow punctuates a dark hero.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Acid Highlight | `#f1f252` | `--color-acid-highlight` | Primary action buttons, decorative accent shapes, heading highlights, nav emphasis — the single chromatic color in an otherwise achromatic system, used sparingly to draw the eye to CTAs and break visual monotony |
| Charcoal Ink | `#1c1b18` | `--color-charcoal-ink` | Primary text, dark hero/section backgrounds, icon strokes, nav borders, high-contrast surfaces — the structural black of the system, warmer than pure black |
| Warm Graphite | `#545048` | `--color-warm-graphite` | Secondary body text, muted labels, image borders, card borders, icon outlines — the mid-tone that bridges ink and paper |
| Cream Paper | `#efece7` | `--color-cream-paper` | Dominant page canvas, card backgrounds on dark sections, nav borders, link borders — the warm off-white that defines the brand's lighter surfaces |
| Soft Stone | `#d4d1cd` | `--color-soft-stone` | Hairline dividers, subtle borders, image outlines, secondary structural lines — the lightest warm gray for quiet separation |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surfaces, modal backgrounds, light-theme cards, inset border glows — the brightest surface for content containers that sit on cream |
| Espresso | `#3c3428` | `--color-espresso` | Footer accents, deep warm browns for grounding the bottom of pages — a desaturated warm dark that complements charcoal without competing |

## Tokens — Typography

### Haffer — Primary interface and heading typeface — the workhorse sans-serif used for nav, body, buttons, links, and most headings. Weight 400 for body and nav, 600 for subheadings and button labels, 700 for primary headlines. Substitute: Inter or General Sans · `--font-haffer`
- **Substitute:** Inter
- **Weights:** 400, 600, 700
- **Sizes:** 14, 16, 18, 20, 24, 28, 36px
- **Line height:** 1.21–1.43
- **Role:** Primary interface and heading typeface — the workhorse sans-serif used for nav, body, buttons, links, and most headings. Weight 400 for body and nav, 600 for subheadings and button labels, 700 for primary headlines. Substitute: Inter or General Sans

### Para — Display serif for editorial-style headings — the weight-300 italic-feeling serif introduces contrast against the bold sans-serif headlines, giving select sections a magazine-cover quality. Used sparingly. Substitute: Source Serif Pro Light or Playfair Display Light · `--font-para`
- **Substitute:** Source Serif Pro
- **Weights:** 300
- **Sizes:** 48px
- **Line height:** 1.21
- **Role:** Display serif for editorial-style headings — the weight-300 italic-feeling serif introduces contrast against the bold sans-serif headlines, giving select sections a magazine-cover quality. Used sparingly. Substitute: Source Serif Pro Light or Playfair Display Light

### Nudge — Massive display sans for hero statements — ultra-bold, ultra-tight, single-line hero words that dominate the viewport. The weight-700 weight at 84px with 1.0 line-height makes headlines feel carved rather than written. Substitute: Haffer 700 at 84px or Druk Wide · `--font-nudge`
- **Substitute:** Druk Wide
- **Weights:** 700
- **Sizes:** 84px
- **Line height:** 1.00
- **Role:** Massive display sans for hero statements — ultra-bold, ultra-tight, single-line hero words that dominate the viewport. The weight-700 weight at 84px with 1.0 line-height makes headlines feel carved rather than written. Substitute: Haffer 700 at 84px or Druk Wide

### DM Mono — Monospace accent for code snippets, technical labels, or numbered annotations. Rare but present for moments needing a technical voice. Substitute: JetBrains Mono or IBM Plex Mono · `--font-dm-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 18, 24px
- **Line height:** 1.33
- **Role:** Monospace accent for code snippets, technical labels, or numbered annotations. Rare but present for moments needing a technical voice. Substitute: JetBrains Mono or IBM Plex Mono

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.38 | — | `--text-caption` |
| body-sm | 16px | 1.43 | — | `--text-body-sm` |
| body | 18px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.33 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 28px | 1.22 | — | `--text-heading` |
| heading-lg | 36px | 1.21 | — | `--text-heading-lg` |
| display | 84px | 1 | — | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 32px |
| cards | 24px |
| links | 32px |
| small | 4px |
| images | 24px |
| buttons | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(28, 27, 24) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(250, 249, 247) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 16-24px

## Components

### Primary Pill Button
**Role:** Main CTA

Filled acid-yellow (#f1f252) button with charcoal (#1c1b18) text, 32px border-radius (full pill), 12px vertical / 24px horizontal padding, Haffer 600 at 16px. Sits high-contrast on any background.

### Secondary Ghost Button
**Role:** Secondary action

Transparent or cream-white fill with 1px charcoal border, 32px radius, Haffer 600 at 16px, charcoal text. Pairs beside the primary pill on dark and light backgrounds alike.

### Navigation Pill Link
**Role:** Nav items

Haffer 400 at 14-16px in charcoal, sitting inside a 32px-radius container with cream (#efece7) border on dark nav, transparent on light. No background fill by default; gains a subtle cream tint on hover.

### Dark Hero Section
**Role:** Above-the-fold headline block

Full-bleed charcoal (#1c1b18) background, oversized Nudge 700 at 84px headline in white with 1.0 line-height, body subtext in #d4d1cd at 18px, paired pill buttons (yellow primary + ghost secondary). Floating product mockup cards overlap the right side at 24px radius.

### Light Content Section
**Role:** Primary content band

Cream (#efece7) background, 64-96px vertical padding, 1200px max-width centered. Two-column text-plus-image or text-plus-mockup layouts, 48px column gap, heading at 36-48px Haffer 700 or Para 300.

### Feature Card
**Role:** Product feature tile

White (#ffffff) background, 24px border-radius, 24-32px internal padding, no shadow, optional 1px #efece7 border. Heading at 24px Haffer 700, body at 16px #545048. Sometimes sits on charcoal section with cream text inverted.

### Product Dashboard Mockup
**Role:** In-context product visual

White surface at 24px radius with 1px #efece7 or #1c1b18 inset border, containing a mock payment list with status dots (green/amber circles), monospaced or Haffer 400 row text at 14-16px, and a charcoal sidebar header. Floats with slight rotation in hero compositions.

### Customer Logo Strip
**Role:** Social proof band

Horizontal row of 5-6 client logos on cream or white background, 72px horizontal padding from edges, logos in #1c1b18 or #545048 monochrome, evenly spaced with 48-64px column gap.

### Status Badge
**Role:** Payment status indicator

Small pill or circle: 8-12px diameter dot in green (#22a06b range) for Pagado, amber (#f59e0b range) for Pendiente, paired with Haffer 400 label at 14-16px in charcoal.

### Cookie Consent Modal
**Role:** Privacy overlay

White surface, 24px radius, 24-32px padding, sits fixed bottom-center with subtle elevation via 1px #efece7 border. Heading at 18px Haffer 700, body at 14px #545048, two ghost buttons (Aceptar, Gestionar) at 32px radius.

### Feature Highlight Panel
**Role:** Acid-yellow section accent

Full-bleed #f1f252 background band, charcoal text and headings, used to break visual rhythm between cream sections. Same 64-96px vertical padding as standard sections.

### Avatar Tile
**Role:** Human/lifestyle imagery container

24px radius square frame containing a photograph, typically placed floating beside product mockups in hero compositions. No border; sits directly on the section background.

## Do's and Don'ts

### Do
- Use #f1f252 exclusively for primary action buttons, active states, and the occasional full-bleed accent section — never as a background for body text or decorative fills
- Set all interactive elements (buttons, nav links, tags) to 32px border-radius for a consistent pill geometry across the system
- Use 24px radius for all cards, images, and dashboard mockup surfaces to create a clear hierarchy below the 32px pill tier
- Maintain a base 8px spacing unit with 16-24px element gaps and 64-96px section gaps for comfortable editorial rhythm
- Pair Nudge/Haffer 700 at 84px for hero headlines with 1.0 line-height to achieve the carved display effect
- Use 1px inset borders in #efece7 or #1c1b18 instead of drop shadows to define cards and interactive surfaces
- Keep the accent color frequency low: one yellow CTA per view, one yellow section per page scroll

### Don't
- Don't introduce additional chromatic colors — the acid yellow is the system's only accent and adding blue, green, or red breaks the broadsheet identity
- Don't use box-shadow elevation; the system defines surfaces through flat color and hairline 1px borders only
- Don't set buttons or cards below 16px radius — the 4px value is reserved for very small inline elements, not primary actions
- Don't mix the weight-300 Para serif into body copy — it belongs only in display headings where it provides editorial contrast
- Don't use pure black (#000000) — always warm it to #1c1b18 to maintain the cream-paper warmth
- Don't stack more than two text colors in a single view; the system reads as ink (#1c1b18) + paper (#efece7) + occasional graphite (#545048)
- Don't place yellow text on the cream canvas — use charcoal text on yellow and yellow elements only on dark or white surfaces

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#efece7` | Default page background across most light sections; the warm paper that all content sits on |
| 1 | White Card | `#ffffff` | Elevated cards, modals, dashboard mockups — surfaces that need to lift off the cream canvas |
| 2 | Charcoal Section | `#1c1b18` | Dark hero panels, footer backgrounds, inverted sections — high-contrast bands that break the cream rhythm |
| 3 | Acid Highlight Panel | `#f1f252` | Full-bleed yellow sections used as feature highlight bands or visual punctuation in dark contexts |

## Elevation

- **Cards and dashboard mockups:** `0px 0px 0px 1px inset #efece7 (hairline border, no drop shadow)`
- **Nav and link containers on dark:** `0px 0px 0px 1px inset #faf9f7 (warm-white inner edge)`

## Imagery

Imagery is sparse and purposeful: tight portrait crops of people (head-and-shoulders, direct gaze) placed in 24px-radius tiles beside product mockups. No full-bleed lifestyle photography, no abstract gradients. Customer logos appear as flat monochrome marks. The product itself is shown through dashboard mockups — white panels with payment lists, status dots, and charcoal headers — not through screenshots of the live app. Illustrations are absent; the visual weight comes from typography and the yellow accent.

## Layout

The page model is max-width 1200px centered, with full-bleed dark and yellow bands breaking the cream rhythm. The hero is a split composition: oversized headline left, floating dashboard mockup cards right at slight rotation. Below the hero, the layout alternates between cream content sections (two-column text-plus-visual) and full-bleed accent bands. The logo strip sits as a single horizontal row with generous 72px edge padding. Navigation is a minimal top bar — logo left, 3-4 nav links center, auth buttons right (ghost + yellow pill). Sections are separated by 64-96px vertical padding, creating a slow scroll rhythm. Grid usage is restrained: mostly two-column text+image layouts, occasional three-column feature grids.

## Agent Prompt Guide

Quick Color Reference:
- text: #1c1b18 (Charcoal Ink)
- background: #efece7 (Cream Paper)
- surface/card: #ffffff (Pure White)
- border/hairline: #d4d1cd (Soft Stone)
- accent: #f1f252 (Acid Highlight)
- primary action: #f1f252 (filled action)

Example Component Prompts:

1. Create a dark hero section: #1c1b18 full-bleed background, 96px top padding. Headline in Nudge 700 (or Haffer 700) at 84px, white, 1.0 line-height. Subtext in Haffer 400 at 18px, #d4d1cd. Two buttons side by side: yellow pill (#f1f252 fill, #1c1b18 text, 32px radius, 12px 24px padding) and ghost pill (transparent, 1px white border, white text, 32px radius). On the right, a white dashboard mockup card (24px radius, 1px #efece7 inset border) floating with a slight rotation.

2. Create a two-column feature section on #efece7 cream background, 64px vertical padding, 1200px max-width, 48px column gap. Left: heading in Haffer 700 at 36px, #1c1b18, body in Haffer 400 at 18px, #545048. Right: a 24px-radius image tile containing a portrait photo.

3. Create a customer logo strip: full-width cream band, horizontal row of 6 monochrome logos in #1c1b18, evenly spaced with 64px column gap, 72px padding from left/right edges.

4. Create a feature card: white (#ffffff) background, 24px radius, 1px #efece7 border, 32px padding. Heading in Haffer 700 at 24px, #1c1b18. Body in Haffer 400 at 16px, #545048.

5. Create a status badge: 8px circle dot in green (#22a06b) with label text in Haffer 400 at 14px, #1c1b18, inside a transparent container with no border.

## Typography Attitude

The type system operates on contrast: Nudge 700 at 84px with 1.0 line-height creates carved display headlines that dominate the viewport, while Para 300 at 48px introduces an editorial whisper-weight serif for select section headings. Body copy stays in Haffer 400 at 18px with generous 1.40-1.43 line-height for comfortable reading. The mix of ultra-bold sans + ultra-light serif + steady sans body creates a three-voice system where the serif appears only in moments needing editorial gravitas, not in functional UI text.

## Accent Economy

The acid yellow (#f1f252) follows strict economy rules: one yellow primary button per view maximum, one full-bleed yellow section per page maximum, and zero yellow body text. The color's power comes from its scarcity — it functions as a highlighter on a page of ink and paper. If more than 15% of any viewport is yellow, the accent has lost its function.

## Similar Brands

- **Wise** — Same warm cream canvas with a single vibrant accent color and oversized confident sans-serif headlines
- **Monzo** — Flat editorial design with minimal shadows, pill-shaped buttons, and one bright accent against achromatic neutrals
- **Plaid** — Dark hero with floating product mockup cards, cream content sections below, and the same restrained color discipline
- **Linear** — Generous border-radius on interactive elements (32px pills), hairline borders instead of shadows, and oversized type as the primary visual device

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-acid-highlight: #f1f252;
  --color-charcoal-ink: #1c1b18;
  --color-warm-graphite: #545048;
  --color-cream-paper: #efece7;
  --color-soft-stone: #d4d1cd;
  --color-pure-white: #ffffff;
  --color-espresso: #3c3428;

  /* Typography — Font Families */
  --font-haffer: 'Haffer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-para: 'Para', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nudge: 'Nudge', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --text-body-sm: 16px;
  --leading-body-sm: 1.43;
  --text-body: 18px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 28px;
  --leading-heading: 1.22;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.21;
  --text-display: 84px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Named Radii */
  --radius-nav: 32px;
  --radius-cards: 24px;
  --radius-links: 32px;
  --radius-small: 4px;
  --radius-images: 24px;
  --radius-buttons: 32px;

  /* Shadows */
  --shadow-subtle: rgb(28, 27, 24) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(250, 249, 247) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-cream-canvas: #efece7;
  --surface-white-card: #ffffff;
  --surface-charcoal-section: #1c1b18;
  --surface-acid-highlight-panel: #f1f252;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-acid-highlight: #f1f252;
  --color-charcoal-ink: #1c1b18;
  --color-warm-graphite: #545048;
  --color-cream-paper: #efece7;
  --color-soft-stone: #d4d1cd;
  --color-pure-white: #ffffff;
  --color-espresso: #3c3428;

  /* Typography */
  --font-haffer: 'Haffer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-para: 'Para', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nudge: 'Nudge', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --text-body-sm: 16px;
  --leading-body-sm: 1.43;
  --text-body: 18px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 28px;
  --leading-heading: 1.22;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.21;
  --text-display: 84px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Shadows */
  --shadow-subtle: rgb(28, 27, 24) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(250, 249, 247) 0px 0px 0px 1px inset;
}
```
