# Endlesstools — Style Reference
> Black-box gallery wall for digital art

**Theme:** dark

Endlesstools uses a black-box gallery aesthetic: a near-black canvas recedes so chromatic artwork can dominate. The palette is almost entirely achromatic—whites and a narrow gray scale handle every structural role—punctuated by one Twitter-blue link accent and a single tri-color gradient (lime→amber→magenta) reserved for brand moments. Inter at compact sizes with consistent negative letter-spacing reads as a precision instrument rather than a marketing surface. Elevation is drawn, not dropped: every container edge is a 1px hairline border, never a shadow, giving the whole interface a wireframe-precise, blueprint-on-obsidian quality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Canvas | `#080808` | `--color-obsidian-canvas` | Page background, deepest surface |
| Onyx Card | `#181818` | `--color-onyx-card` | Card fills, elevated surfaces above the canvas |
| Graphite Layer | `#1e1e1e` | `--color-graphite-layer` | Input backgrounds, subtle surface lift from Obsidian |
| Slate Border | `#373737` | `--color-slate-border` | Primary 1px hairline borders on cards, inputs, containers |
| Iron Border | `#505050` | `--color-iron-border` | Stronger border weight for emphasis on key containers |
| Ash Mute | `#959595` | `--color-ash-mute` | Muted body text, secondary labels, placeholder text, weak borders |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text, primary CTA outline stroke, high-contrast borders on dark canvas |
| Signal Blue | `#1d9bf0` | `--color-signal-blue` | Outlined link/mention border and text — the only chromatic functional accent in the system |
| Prism Gradient | `linear-gradient(97.25deg, rgb(184, 255, 69) 3%, rgb(255, 203, 69) 22%, rgb(255, 0, 184) 100%)` | `--color-prism-gradient` | Brand gradient — lime through amber to magenta, applied to logo, wordmark, and hero brand moments |

## Tokens — Typography

### Inter — Single-family system. Weight 400 for body, labels, and buttons; weight 500 reserved for headings, emphasized labels, and nav. Negative tracking tightened with size: -0.033em at 8–12px caption scale, -0.030em at 14–18px body, -0.025em at 24–42px display. This monotone weight palette (only 400 and 500 exist) is a signature choice — the interface whispers hierarchy through size and tracking, not through bold/regular contrast. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto
- **Weights:** 400, 500
- **Sizes:** 8px, 12px, 14px, 16px, 18px, 24px, 42px
- **Line height:** 0.83, 1.08, 1.10, 1.11, 1.17, 1.25, 1.29, 1.50, 2.08, 2.19, 2.50
- **Letter spacing:** -0.0330em at 8–12px, -0.0300em at 14–18px, -0.0250em at 24–42px
- **Role:** Single-family system. Weight 400 for body, labels, and buttons; weight 500 reserved for headings, emphasized labels, and nav. Negative tracking tightened with size: -0.033em at 8–12px caption scale, -0.030em at 14–18px body, -0.025em at 24–42px display. This monotone weight palette (only 400 and 500 exist) is a signature choice — the interface whispers hierarchy through size and tracking, not through bold/regular contrast.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.17 | -0.033px | `--text-caption` |
| body-sm | 14px | 1.25 | -0.03px | `--text-body-sm` |
| body | 16px | 1.29 | -0.03px | `--text-body` |
| subheading | 18px | 1.5 | -0.03px | `--text-subheading` |
| heading-sm | 24px | 1.08 | -0.025px | `--text-heading-sm` |
| display | 42px | 1.1 | -0.025px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 100 | 100px | `--spacing-100` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 7px |
| cards | 10px |
| links | 7px |
| inputs | 10px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(55, 55, 55) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `rgb(55, 55, 55) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(80, 80, 80) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |
| subtle-4 | `rgb(149, 149, 149) 0px 0px 0px 1px inset` | `--shadow-subtle-4` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-100px
- **Card padding:** 15-20px
- **Element gap:** 5-10px

## Components

### Outlined Primary Button
**Role:** Top-of-page conversion CTA ("Start for free")

Transparent fill, 1px white border (#ffffff), white text, 10px radius, ~20px vertical padding, Inter 16/500. The inverted-on-dark outline approach is the system's only filled-style action; the filled equivalent does not exist. The hairline border IS the brand statement.

### Ghost Text Button
**Role:** Secondary nav action ("Sign in")

No background, no border, white text at 14/500, sits inline with the outlined button. Reinforces the hierarchy: one outlined CTA + one text ghost per header.

### Template Card
**Role:** Showcase tile for 3D / motion / visual templates in the gallery grid

Full-bleed chromatic artwork fills the card body; the template title ("Liquid Metal", "System Error", "Smileyc") sits in white 16/500 at bottom-left; category tags (e.g. "ABSTRACT", "3D", "COLLECTIBLE") stack as small outlined chips at 12/400. 10px radius on the card; the artwork itself is masked to the radius. No drop shadow — the card floats only via the artwork's own brightness against the obsidian canvas.

### Category Tag Chip
**Role:** Inline filter/category label on template cards

Pill-shaped with 7px radius, transparent fill, 1px white border at 30–40% opacity, 12/400 white text, 5–8px horizontal padding. Stacks horizontally with 5px gap. Tags carry no fill — they are read as engraved labels on the artwork.

### Social Proof Card
**Role:** User testimonial card in the "Created with Endless Tools" section

1px #373737 border on transparent fill, 10px radius, ~20px padding. Avatar (circular, 32px) + display name 14/500 + handle 12/400 in Ash Mute, then body quote 14/400 in Paper White, then optional artwork embed. Footer pagination dots below the row.

### Text Input
**Role:** Form field (email, search, etc.)

1px Slate Border (#373737) outline, Graphite Layer (#1e1e1e) fill, 10px radius, ~20px vertical padding, 14/400 Paper White text, Ash Mute placeholder. No focus ring color change beyond the standard border — elevation-by-border principle means focus is signaled by border weight, not glow.

### Brand Wordmark
**Role:** Logo lockup in the top-left nav

8×8 grid glyph followed by "Endless" on one line, "Tools" directly below, both in Paper White at ~16/500. The wordmark carries no gradient — the Prism Gradient is reserved for the gallery hero mark, not the logotype.

### Gallery Grid Section
**Role:** Primary content surface — the template showcase

Full-bleed obsidian background, multi-column masonry-style card layout (6+ visible columns at desktop, each card ~200–240px wide, 260–320px tall, 10px radius). Cards vary in height to create a Pinterest-like rhythm. This is the visual heart of the product; the grid is dense, confident, and undecorated by gutters or dividers beyond the cards' own edges.

### Section Headline Block
**Role:** Reusable centered intro block ("A new way to create pro-level design content.")

Centered on the canvas, 100px top margin, ~80px bottom margin. Headline at 42/500, tracking -0.025em, Paper White. Subtitle at 18/400, Ash Mute, max-width ~560px. No decorative element, no border — the type alone defines the section.

### Top Navigation Bar
**Role:** Persistent global header

Sits on Obsidian (#080808) with no border, no shadow. Left: Brand Wordmark. Right: Ghost Text Button + Outlined Primary Button. ~40px vertical padding, content constrained to ~1280px max-width. The bar is intentionally minimal — the gallery IS the brand statement, not the chrome.

### Card Carousel Controls
**Role:** Left/right chevrons + dot indicator for the social proof section

12px Ash Mute chevrons flanking a centered row of 4px dots (active dot = Paper White, inactive = Ash Mute at 30% opacity). 40px below the card row, centered horizontally. No background, no border — pure typographic control.

## Do's and Don'ts

### Do
- Use Obsidian (#080808) as the base canvas for every full-page surface; never introduce a non-dark background.
- Reach for 10px radius on buttons, cards, and inputs; reserve 7px exclusively for tag chips and inline links.
- Express elevation as 1px hairlines (#373737, #505050, or #ffffff) — never as drop shadows. A border is the only valid container edge.
- Restrict chromatic color to two roles: Signal Blue (#1d9bf0) for outlined link borders/text, and the Prism Gradient for brand-mark moments. Everything else stays Paper White or Ash Mute.
- Use Inter at weight 400 for body, labels, and buttons; reserve weight 500 for headings and emphasized labels. Do not introduce a third weight.
- Pull tracking tighter as size decreases: -0.025em at display, -0.030em at body, -0.033em at caption. This is the system's optical-precision signature.
- Let template artwork fill its card edge-to-edge with no padding overlay. The image IS the card; the title sits over it.

### Don't
- Do not use drop shadows for elevation — the system is deliberately border-defined; adding blur will break the wireframe feel.
- Do not introduce a second chromatic brand color. Signal Blue and the Prism Gradient are the only chromatic tools in the palette.
- Do not fill a CTA button. The Outlined Primary Button is the only action style; a filled solid-color button would clash with the hairline-first language.
- Do not use typography weights outside 400 and 500. Bold (700) headings would shout against the whisper-tight 500 display size.
- Do not add borders, dividers, or separators to the top navigation. The nav floats on the obsidian canvas edge-to-edge.
- Do not place body text below 14/400 or labels below 12/400 — the 8–12px range is reserved for micro-labels and tag chips, never paragraphs.
- Do not color template cards with solid backgrounds. Each card is a window onto a chromatic artwork; painting over it kills the gallery effect.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#080808` | Full-page background, base layer for all sections |
| 1 | Onyx Card | `#181818` | Card fills that need to sit visibly above the canvas |
| 2 | Graphite Layer | `#1e1e1` | Input fields, subtle surface lift for interactive elements |
| 3 | Slate Edge | `#373737` | Border-only elevation — drawn container edges that define hierarchy without fill |

## Elevation

Elevation is drawn, not dropped. The system uses 1px hairlines (rgb(55,55,55) at #373737, or rgb(80,80,80) at #505050 for emphasis) as the sole container separator. Card lift comes from a slightly lighter fill (#181818) plus its border, not from box-shadow. This creates a blueprint-on-obsidian feel — every surface boundary is a deliberate line, never a diffuse gradient. The approach is consistent with the product's positioning as a precision design tool: borders read as engineered, shadows read as decorative.

## Imagery

The visual language is overwhelmingly driven by user-generated chromatic 3D / motion / illustration content showcased in the gallery grid. The site's own chrome is monochrome, so the artwork provides all color: vivid magentas, electric blues, neon greens, metallic golds, candy pinks. Artwork treatment is full-bleed inside each card, masked to a 10px radius, with title text overlaid in white at the card's lower-left corner. There is no site photography, no lifestyle imagery, no human portraits beyond small circular avatars in the social proof cards. The interface itself is pure UI — the imagery that matters is the user's work, presented gallery-style. Icons are minimal: a single 8×8 dotted-grid glyph serves as the brand mark, and chevron arrows for carousel controls.

## Layout

Full-bleed dark canvas, content constrained to a ~1280px max-width and centered. The hero is a single centered headline + subhead + outlined CTA, then an immediate drop into a dense multi-column masonry gallery (6+ columns of ~200–240px-wide template cards, each 260–320px tall, 10px radius, no gutters beyond card spacing). Below the gallery: a section-break headline centered with ~100px vertical padding, then a 3-column social proof card row with carousel controls, then dark continuation. Navigation is a single floating top bar with no border, no shadow. The rhythm is gallery-first: the majority of the first viewport and all subsequent scroll is the artwork grid. Content density is intentionally compact — the gallery is packed to feel like a working library, not a curated showcase.

## Agent Prompt Guide

## Quick Color Reference

- text: #ffffff (primary), #959595 (muted)
- background: #080808 (page), #181818 (card), #1e1e1e (input)
- Create a Primary Action Button: #ffffff background, #080808 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
- link accent: #1d9bf0 (outlined link border + text)
- brand: Prism Gradient (linear-gradient(97.25deg, rgb(184,255,69) 3%, rgb(255,203,69) 22%, rgb(255,0,184) 100%))
- primary action: #ffffff (filled action)

## 3-5 Example Component Prompts


2. **Template gallery card**: 220px wide, 280px tall, 10px radius. Card body is filled entirely with a chromatic 3D artwork image (masked to the 10px radius). At the card's bottom-left corner, 20px padding, overlay the title "Liquid Metal" in #ffffff at 16/500. Below the title, stack three category tag chips: pill-shaped, 7px radius, transparent fill, 1px #ffffff border at 40% opacity, text in #ffffff at 12/400, 5px horizontal / 3px vertical padding, 5px gap between chips.

3. **Social proof testimonial card**: 1px solid #373737 border, transparent fill, 10px radius, 20px padding. Header row: 32px circular avatar, then display name at 14/500 #ffffff and @handle at 12/400 #959595 stacked beside the avatar. Body quote at 14/400 #ffffff, max 3 lines. Optional artwork embed at 200px tall, 10px radius, 10px top margin. 40px below the card row, centered carousel dots: active = 4px circle in #ffffff, inactive = 4px circle in #959595 at 30% opacity, 8px gap.


5. **Text input field**: 1px solid #373737 border, #1e1e1e background, 10px radius, 20px vertical / 15px horizontal padding, text at 14/400 in #ffffff, placeholder at 14/400 in #959595. No focus ring — focus is signaled by border color shifting to #505050.

## Similar Brands

- **Framer** — Same dark-canvas-first approach with hairline-bordered containers and a single-color outline-button CTA pattern
- **Linear** — Identical philosophy of monochrome dark UI with near-zero chromatic content — color arrives only through user content, never through chrome
- **Vercel** — Same border-as-elevation discipline (1px hairlines on transparent or near-black fills) and Inter-at-400/500 typographic restraint
- **Rive** — Both are creative tooling surfaces that suppress their own chrome so user-generated animated/3D content dominates the viewport
- **Spline** — Same gallery-grid-first page model where chromatic 3D artwork IS the product showcase against a near-black canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-canvas: #080808;
  --color-onyx-card: #181818;
  --color-graphite-layer: #1e1e1e;
  --color-slate-border: #373737;
  --color-iron-border: #505050;
  --color-ash-mute: #959595;
  --color-paper-white: #ffffff;
  --color-signal-blue: #1d9bf0;
  --color-prism-gradient: #ff00b8;
  --gradient-prism-gradient: linear-gradient(97.25deg, rgb(184, 255, 69) 3%, rgb(255, 203, 69) 22%, rgb(255, 0, 184) 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.17;
  --tracking-caption: -0.033px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.03px;
  --text-body: 16px;
  --leading-body: 1.29;
  --tracking-body: -0.03px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.03px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.08;
  --tracking-heading-sm: -0.025px;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: -0.025px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-100: 100px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-100px;
  --card-padding: 15-20px;
  --element-gap: 5-10px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 7px;
  --radius-cards: 10px;
  --radius-links: 7px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-subtle: rgb(55, 55, 55) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(55, 55, 55) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(80, 80, 80) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgb(149, 149, 149) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-obsidian-canvas: #080808;
  --surface-onyx-card: #181818;
  --surface-graphite-layer: #1e1e1;
  --surface-slate-edge: #373737;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-canvas: #080808;
  --color-onyx-card: #181818;
  --color-graphite-layer: #1e1e1e;
  --color-slate-border: #373737;
  --color-iron-border: #505050;
  --color-ash-mute: #959595;
  --color-paper-white: #ffffff;
  --color-signal-blue: #1d9bf0;
  --color-prism-gradient: #ff00b8;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.17;
  --tracking-caption: -0.033px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.03px;
  --text-body: 16px;
  --leading-body: 1.29;
  --tracking-body: -0.03px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.03px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.08;
  --tracking-heading-sm: -0.025px;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: -0.025px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-100: 100px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;

  /* Shadows */
  --shadow-subtle: rgb(55, 55, 55) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(55, 55, 55) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(80, 80, 80) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgb(149, 149, 149) 0px 0px 0px 1px inset;
}
```
