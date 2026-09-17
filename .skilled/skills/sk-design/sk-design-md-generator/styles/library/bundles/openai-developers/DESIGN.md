# OpenAI Developers — Style Reference
> stark white laboratory

**Theme:** light

OpenAI Developers is a stark, documentation-first interface built on pure white canvas with near-black text and zero chromatic accent. Visual hierarchy lives entirely in typographic weight, generous whitespace, and quiet surface shifts between #ffffff, #f9f9f9, and #f3f3f3 rather than color, shadow, or decoration. Components are flat, geometric, and small: 8px-radius cards with hair-thin borders, pill-shaped controls, and a single dark button that reads as the only significant mass on screen. The result feels like an engineering reference sheet — precise, unornamented, and confident that the content carries the weight. Color appears only as deliberate punctuation: a blue-purple gradient on the model-version badge and, below the fold, gradient product cards that break the monochrome to signal featured material.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, inverse text on dark buttons |
| Carbon | `#181818` | `--color-carbon` | Section backgrounds, dark surface containers, large heading text |
| Fog White | `#f9f9f9` | `--color-fog-white` | Card backgrounds, subtle elevated surfaces, ghost button hover fills |
| Ash Gray | `#5d5d5d` | `--color-ash-gray` | Secondary body text, muted icon strokes, helper labels |
| Graphite | `#282828` | `--color-graphite` | Navigation text, inline link color, icon fills — softer than pure black for repeated text contexts |
| Mist Gray | `#ededed` | `--color-mist-gray` | Hairline borders, nav separators, disabled state fills |
| Linen | `#f3f3f3` | `--color-linen` | Card hover state, second-tier surface tint |
| Ink | `#0d0d0d` | `--color-ink` | High-emphasis nav text, logo wordmark, near-black fallback |
| Smoke | `#8f8f8f` | `--color-smoke` | Tertiary text, placeholder copy, scrollbar tracks |
| Slate Whisper | `#64748b` | `--color-slate-whisper` | Muted metadata, caption text, minor UI labels |

## Tokens — Typography

### OpenAI Sans — Sole typeface across all surfaces. Weight 400 for body, 500 for nav and card titles, 600 for the page hero headline. The tight negative letter-spacing (-0.008em to -0.02em) pulls characters together for a dense, editorial feel at every size. · `--font-openai-sans`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 20, 30px
- **Line height:** 1.30–1.75 (body), 1.00–1.43 (headings)
- **Letter spacing:** -0.02em at 30px, -0.011em at 20px, -0.01em at 18px, -0.008em at 16px and below
- **Role:** Sole typeface across all surfaces. Weight 400 for body, 500 for nav and card titles, 600 for the page hero headline. The tight negative letter-spacing (-0.008em to -0.02em) pulls characters together for a dense, editorial feel at every size.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.008px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.008px | `--text-body-sm` |
| body | 16px | 1.5 | -0.008px | `--text-body` |
| subheading | 18px | 1.4 | -0.01px | `--text-subheading` |
| heading | 20px | 1.4 | -0.011px | `--text-heading` |
| display | 30px | 1.2 | -0.02px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| pills | 9999px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 2px -1px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Feature Card
**Role:** Three-column content tile for product areas (API Platform, Codex, Apps SDK)

White or #f9f9f9 background, 8px border-radius, 24px padding, no border or 1px #ededed border. Icon at top-left in 20px stroke weight #282828. Title in 16px weight 500 #181818 with 8px gap to description text in 14px weight 400 #5d5d5d. No shadow on rest state.

### Announcement Banner
**Role:** Highlighted model release card with gradient thumbnail

Full-width card with #f9f9f9 background, 8px radius, 24px vertical padding. Left: 48px gradient thumbnail (blue-to-purple) containing white '5.5' numerals. Right: title 16px weight 600 #181818, body 14px #5d5d5d, and a small 'Read the GPT-5.5 prompting guide' link with arrow icon.

### Dark Pill Button
**Role:** Primary header action (API Dashboard)

#000000 background, #ffffff text, 9999px border-radius, 10px vertical and 16px horizontal padding. Text at 14px weight 500. Sits in top-right of nav. No border, no shadow.

### Ghost Nav Button
**Role:** Inactive navigation items (Home, API, Codex, ChatGPT, Resources)

Transparent background, 8px radius, 10px vertical and 12px horizontal padding. Text at 14px weight 500 in #282828. Active state uses #ededed background fill with #0d0d0d text.

### Search Input
**Role:** Site search field in header

Transparent or #ededed background, 8px radius, 10px vertical and 10px horizontal padding. Placeholder 'Start searching' in 14px #8f8f8f. Magnifying glass icon right-aligned in 16px #282828.

### Featured Gradient Card
**Role:** Below-fold product showcase tiles (Codex use cases, Showcase)

Full-bleed gradient fill (blue-to-violet, light to deep), 8px radius, content in white overlay. Headline 20px weight 500 white, no visible card chrome — the gradient IS the surface.

### Section Heading Stack
**Role:** Page hero title and supporting copy

Centered layout. Main headline 30px weight 600 #181818 with -0.6px letter-spacing. Subtitle 16px weight 400 #5d5d5d directly below with 12px gap. No eyebrow text, no decorative rule.

### Icon Glyph
**Role:** Functional icons on feature cards and nav

20px size, 1.5px stroke weight, #282828 stroke. Monoline outlined style. No filled variants detected — all icons use stroke-only geometry.

### Inline Arrow Link
**Role:** Text link with directional indicator (e.g., 'Read the GPT-5.5 prompting guide ↗')

14px weight 500 #282828 text, 1px #282828 arrow icon inline. No underline on rest; underline appears on hover. Gap of 4px between text and arrow.

## Do's and Don'ts

### Do
- Use 8px border-radius on all cards, inputs, and rectangular buttons
- Use 9999px border-radius exclusively for pill-shaped buttons and tag chips
- Set body text at 16px weight 400 with letter-spacing -0.008em
- Anchor all headlines at 30px weight 600 with letter-spacing -0.02em
- Keep page canvas pure #ffffff; reach for #f9f9f9 only for card surfaces that need quiet separation
- Use #000000 for the single dark CTA; never introduce a colored CTA background
- Maintain 4px base unit for all gaps and padding — avoid 5px, 7px, or other odd values

### Don't
- Do not add a chromatic accent to UI controls — color belongs only in decorative product cards and the model badge
- Do not use shadows beyond the single 1px 0,0,0,0.08 hairline; depth comes from surface shifts, not elevation
- Do not set border-radius above 8px on rectangular surfaces — the only exception is pill controls
- Do not mix font families — OpenAI Sans is the sole typeface, weight changes create hierarchy
- Do not use pure black for large body text — reserve #000000 for buttons and headings, use #181818 for heading and #282828 for repeated body contexts
- Do not add gradient fills to UI chrome; gradients are reserved for featured product tiles below the fold
- Do not exceed 30px for typography — the scale is deliberately compressed, hierarchy lives in weight and spacing

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background, full-bleed base |
| 2 | Card | `#f9f9f9` | Feature cards, announcement banner, subtle surface lift |
| 3 | Card Hover | `#f3f3f3` | Interactive card hover state, secondary tint |
| 4 | Divider | `#ededed` | Hairline borders, nav separators, search input background |
| 5 | Dark Surface | `#181818` | Inverted sections, dark heading text, contrast blocks |

## Elevation

The design rejects shadow-based elevation. Depth is communicated entirely through surface color shifts across a five-step stack (#ffffff → #f9f9f9 → #f3f3f3 → #ededed → #181818). The only shadow present is a barely-perceptible 1px hairline (rgba(0,0,0,0.08) 0 1px 2px -1px) that hints at containment without declaring it. This paper-like flatness keeps the interface feeling like a printed reference document.

## Imagery

Virtually no imagery on the primary view. Visual interest comes from a single gradient thumbnail (blue-to-violet) on the model-version badge and gradient-filled product cards below the fold. Icons are monoline outlined at 20px with 1.5px stroke in #282828 — no filled variants, no multicolor icons. The aesthetic is anti-illustrative: the page is text, whitespace, and geometry, with color appearing only where it carries product meaning.

## Layout

Max-width 1200px centered content with generous outer margins. Hero is a centered text stack (headline + subtitle) with no visual above the fold. Content flows in a single column at the top, then opens into a 3-column card grid for product areas (API Platform, Codex, Apps SDK). Below the fold, a 2-column band alternates text descriptions with gradient product cards. Navigation is a single horizontal bar at the top with logo left, center nav links, and search + dark CTA right. No sidebar, no sticky elements beyond the nav. Section gaps are 64px, creating strong vertical rhythm between discrete content blocks.

## Agent Prompt Guide

Quick Color Reference:
- text (primary): #181818
- text (secondary): #5d5d5d
- background: #ffffff
- card surface: #f9f9f9
- border: #ededed
- dark button fill: #000000
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero section: white #ffffff background, centered layout. Headline at 30px OpenAI Sans weight 600, #181818, letter-spacing -0.6px. Subtitle at 16px weight 400, #5d5d5d, 12px gap below headline. No eyebrow, no background image.

2. Create a feature card grid: 3 equal columns, 20px gap between cards. Each card has #f9f9f9 background, 8px border-radius, 24px padding. 20px monoline icon in #282828 at top-left, 16px space below to 16px weight 500 #181818 title, then 8px gap to 14px weight 400 #5d5d5d body text.

3. Create a dark pill button: #000000 background, #ffffff text at 14px weight 500, 9999px border-radius, 10px vertical padding, 16px horizontal padding, OpenAI Sans font.

4. Create a ghost navigation button: transparent background, 8px radius, 10px vertical and 12px horizontal padding, 14px weight 500 #282828 text, no border.

5. Create an announcement banner: #f9f9f9 background, 8px radius, 24px vertical padding, full-width within 1200px container. Left side: 48px square gradient thumbnail (blue #6366f1 to violet #8b5cf6) with white '5.5' text. Right side: 16px weight 600 #181818 title, 14px #5d5d5d body below, and a 14px #282828 arrow link after 8px gap.

## Similar Brands

- **Stripe Docs** — Same documentation-first philosophy with near-identical grayscale palette, 8px card radii, and zero-chromatic accent discipline
- **Linear** — Both rely on typographic weight and surface color shifts for hierarchy rather than color or shadow, with compressed type scales and pill-shaped controls
- **Vercel** — Stark monochrome interface, single dark button as the only dense mass, generous whitespace, and restrained border treatment
- **Anthropic Docs** — Direct competitor in AI developer docs — same editorial approach, white canvas, hairline borders, and content-forward layout
- **GitHub Primer** — Both use a near-exclusively neutral palette with subtle surface progressions and 8px as the default radius token

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #181818;
  --color-fog-white: #f9f9f9;
  --color-ash-gray: #5d5d5d;
  --color-graphite: #282828;
  --color-mist-gray: #ededed;
  --color-linen: #f3f3f3;
  --color-ink: #0d0d0d;
  --color-smoke: #8f8f8f;
  --color-slate-whisper: #64748b;

  /* Typography — Font Families */
  --font-openai-sans: 'OpenAI Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.008px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.008px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.008px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading: 20px;
  --leading-heading: 1.4;
  --tracking-heading: -0.011px;
  --text-display: 30px;
  --leading-display: 1.2;
  --tracking-display: -0.02px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #f9f9f9;
  --surface-card-hover: #f3f3f3;
  --surface-divider: #ededed;
  --surface-dark-surface: #181818;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #181818;
  --color-fog-white: #f9f9f9;
  --color-ash-gray: #5d5d5d;
  --color-graphite: #282828;
  --color-mist-gray: #ededed;
  --color-linen: #f3f3f3;
  --color-ink: #0d0d0d;
  --color-smoke: #8f8f8f;
  --color-slate-whisper: #64748b;

  /* Typography */
  --font-openai-sans: 'OpenAI Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.008px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.008px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.008px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading: 20px;
  --leading-heading: 1.4;
  --tracking-heading: -0.011px;
  --text-display: 30px;
  --leading-display: 1.2;
  --tracking-display: -0.02px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 2px -1px;
}
```
