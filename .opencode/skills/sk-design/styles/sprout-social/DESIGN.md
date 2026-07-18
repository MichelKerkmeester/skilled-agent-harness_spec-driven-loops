# Sprout Social — Style Reference
> Green sprout on black slate. One vivid accent on a stark monochrome canvas, the color rationed to actions only, with confident geometric type that functions like wayfinding signage.

**Theme:** light

Sprout Social operates on a stark, high-contrast visual system: near-black ink on white canvas, with a single vivid green that punctuates every call to action. The typeface is Proxima Nova at bold weights (700–800), delivering confident, geometric headlines that feel like signage rather than prose. Surfaces are flat and borderless in feel — rounded corners (16px on cards, 6px on controls) do the structural work that shadows do elsewhere. Color is rationed: 99% of the page is achromatic; the green accent is reserved for primary actions and the brand leaf, never decoration. Product showcases break the monochrome with soft purple-to-white and green-to-blue gradient washes that frame UI screenshots without competing with them.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#040404` | `--color-ink-black` | Primary text, nav borders, heading strokes, footer dividers — the dominant non-white color across the entire system |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, nav surface, input fills, button text on dark fills |
| Ash Gray | `#d9d9d9` | `--color-ash-gray` | Nav dividers, link borders, subtle separators, muted UI chrome |
| Smoke Gray | `#cbcece` | `--color-smoke-gray` | Image borders, input borders, secondary button surface, faint dividers |
| Slate | `#162020` | `--color-slate` | Secondary text, nav border accent, card border emphasis |
| Pewter | `#6e797a` | `--color-pewter` | Body muted text, helper copy, meta information |
| Sprout Green | `#98e58e` | `--color-sprout-green` | Green action color for filled buttons, selected navigation states, and focused conversion moments |

## Tokens — Typography

### Proxima Nova — Single-family system. Display and headings lock to 700–800 — near-black weight gives headlines a poster-like authority. Body and nav use 400. The weight gap between body (400) and headline (800) is the hierarchy engine; no medium or semibold exists in between. Substitute: Montserrat, Gotham, or Nunito Sans. · `--font-proxima-nova`
- **Substitute:** Montserrat, Nunito Sans, Gotham
- **Weights:** 400, 700, 800
- **Sizes:** 13px, 16px, 18px, 21px, 24px, 32px, 43px, 57px, 76px
- **Line height:** 1.05–1.64 (tight on display, breathing on body)
- **Role:** Single-family system. Display and headings lock to 700–800 — near-black weight gives headlines a poster-like authority. Body and nav use 400. The weight gap between body (400) and headline (800) is the hierarchy engine; no medium or semibold exists in between. Substitute: Montserrat, Gotham, or Nunito Sans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.48 | — | `--text-caption` |
| body-sm | 16px | 1.64 | — | `--text-body-sm` |
| body | 18px | 1.48 | — | `--text-body` |
| subheading | 21px | 1.33 | — | `--text-subheading` |
| subheading-lg | 24px | 1.25 | — | `--text-subheading-lg` |
| heading-sm | 32px | 1.18 | — | `--text-heading-sm` |
| heading | 43px | 1.12 | — | `--text-heading` |
| heading-lg | 57px | 1.05 | — | `--text-heading-lg` |
| display | 76px | 1.05 | — | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 24px |
| inputs | 6px |
| buttons | 6px |
| hero-tiles | 64px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(39, 51, 51, 0.24) 0px 4px 8px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary CTA Button (Sprout Green)
**Role:** The sole chromatic action in the system — reserved for trial signup and core conversion moments

Filled #98e58 background, #040404 text, 6px radius, 16px vertical × 24px horizontal padding, Proxima Nova 700 at 16px. Appears on dark hero panels and on white above the fold. The green is the only place UI color is allowed — never decorate with it.

### Solid Dark Button
**Role:** Secondary high-emphasis action when green is not appropriate (login, demo, nav-level CTAs)

Filled #040404 background, #ffffff text, 6px radius, ~12px vertical × 24px horizontal padding, Proxima Nova 700 at 14–16px. Mirrors the green CTA's geometry but inverts the contrast.

### Outlined Ghost Button
**Role:** Tertiary actions, nav links, low-emphasis controls

Transparent fill, 1px #040404 or #d9d9d9 border, #040404 text, 6px radius, matches solid button padding. Used in nav bar for 'Log in' and in inline content for 'See all integrations'.

### Email Input
**Role:** Hero email capture and any form field

White fill, 1px #cbcece border, 6px radius, ~16px vertical padding, Proxima Nova 400 at 16px, placeholder text in #6e797a. No focus ring color change documented; the field sits flush against the green CTA as a compound control.

### Top Navigation Bar
**Role:** Global site navigation

White surface with subtle rgba(39,51,51,0.24) 0px 4px 8px 0px shadow, 16px radius at the outer container. Logo (green leaf + black wordmark) on the left, nav links in #040404 at 16px/400, solid dark 'Try for free' button on the far right. Dropdown indicators use small chevrons.

### Integration Tile
**Role:** Social platform logo grid (TikTok, Instagram, LinkedIn, etc.)

White surface, 1px #d9d9d9 border, 16px radius, center-aligned platform icon at 48–64px. Arranged in a 7-column grid with 8–12px gaps. The tile is a frame, not a card — it does not lift, it holds.

### Product Showcase Panel
**Role:** Hero product screenshot framing — calendar view, AI suggestions, analytics overlays

Rounded screenshot container, 16px radius, displayed on a full-bleed gradient background (prism wash or orchid mist). The screenshot is the hero; the gradient is the stage.

### Sentiment / Insights Card
**Role:** Floating data card overlaid on product screenshots

White surface, 16px radius, small internal padding (~8–12px), Proxima Nova 400 for metric labels at 13px and 700 for values. Includes mini-chart glyphs and star ratings in #98e58e.

### AI Assist Suggestion Card
**Role:** Contextual AI prompt floating beside product UI

White surface, 16px radius, contains a prompt label at 16px/700 and action rows. Sits adjacent to the calendar grid in the product section.

### Pricing Tier Card
**Role:** Plan comparison — Standard, Professional, Advanced

White card with 1px colored border per tier (blue tint visible in the data), ~24px padding, 16px radius, tier name at 24px/700, price at 43px/800. CTA at the bottom of each card in the matching tier color.

### Tag / Pill Badge
**Role:** Category tags, status labels, filtering chips

Filled with contextual color (green for positive, neutral for status), 24px radius (pill shape), ~4–8px vertical padding, 13px Proxima Nova 700.

### Text Link with Underline
**Role:** Inline body links, nav links, 'See all' CTAs

#040404 text with a 1px underline border, Proxima Nova 400 at 16–18px. Underline is always present — the system uses underline as the only link affordance, never color alone.

### Hero Reversed Panel
**Role:** Top-of-fold black canvas hosting the primary headline and email capture

Full-bleed #040404 background, #ffffff headline at 57px/800, email input + green CTA compound centered. This is the only dark section; everything below reverts to white.

### Social Media Icon Set
**Role:** Brand-recognized platform marks (Instagram, TikTok, LinkedIn, X, WhatsApp, Salesforce, etc.)

Each icon is rendered in its native brand colors at 40–48px, centered within an integration tile. The system does not recolor platform logos — it presents them in full chromatic identity.

## Do's and Don'ts

### Do
- Reserve #98e58 exclusively for primary action buttons and the brand leaf — never use it for decoration, illustration, or secondary controls
- Set all headlines to Proxima Nova 700 or 800 — the 400→800 weight jump is the hierarchy engine, and no body text should ever compete with it
- Use 16px radius on cards and 6px radius on buttons/inputs — this two-radius system is the structural language; do not introduce a third
- Underline every text link with a 1px stroke; never rely on color alone to signal interactivity
- Keep body copy on white at #040404 — the 20.5:1 contrast against #ffffff is the system's accessibility floor, not a ceiling
- Frame product screenshots on a full-bleed gradient (prism wash or orchid mist) at 16px radius — the gradient is the stage, the screenshot is the actor
- Use 4px as the base spacing unit and snap all padding/margin to the 4px grid (8, 12, 16, 24, 32, 40, 64)

### Don't
- Do not add a third border-radius — the 6px/16px pair is deliberate; 8px or 12px breaks the system's geometric language
- Do not introduce semibold (600) weights — Proxima Nova only ships at 400/700/800 in this system, and adding 600 collapses the hierarchy
- Do not use #98e58 for body text, icons, or backgrounds other than buttons — diluting the green destroys the rationed-accent pattern
- Do not apply drop shadows to cards, tiles, or content blocks — shadow belongs to the nav only; everything else is border-defined
- Do not use color alone for interactive affordance — every link, button, and tile must include border, weight change, or underline
- Do not mix the prism wash and orchid mist gradients within the same section — pick one wash per product showcase and commit
- Do not set headlines below 32px or above 76px — the scale is hand-tuned; random sizes break the display rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Default page background, hero reverse panels |
| 2 | Card Surface | `#ffffff` | Integration tiles, feature cards — same white as canvas, defined by border and radius rather than tonal lift |
| 3 | Input Surface | `#ffffff` | Form fields, email capture — sits on canvas with a 1px border for definition |

## Elevation

- **Navigation bar:** `rgba(39, 51, 51, 0.24) 0px 4px 8px 0px`

## Imagery

Photography is full-bleed lifestyle — warm, naturally lit, candid mid-action shots of people using phones and laptops in real environments. Product UI screenshots dominate mid-page, framed on soft gradient washes (prism green-to-blue, orchid purple-to-white) that act as stages rather than decoration. Illustrations are absent. Iconography is platform-native brand color (TikTok cyan-pink, Instagram gradient, LinkedIn blue, X black) — logos are never recolored to match the monochrome system. Visual density is image-heavy in hero and product sections, text-dominant in integrations and pricing.

## Layout

Max-width 1200px centered on white canvas, opening with a full-bleed dark hero that breaks the container. The hero reverses contrast: #040404 background, #ffffff headline at 57px, centered email-capture compound. Below the fold, sections alternate between text-dominant bands (integrations 7-column tile grid, pricing tier row) and image-dominant bands (product UI screenshots on gradient washes). Vertical rhythm: 64px section gaps, 32px block gaps, 16px element gaps. Navigation is a sticky top bar with a soft 4px shadow lift. The page reads: dark hero → white product showcase on gradient → white integrations grid → white pricing row.

## Agent Prompt Guide

**Quick Color Reference**
- text: #040404
- background: #ffffff
- border: #d9d9d9 (subtle) / #040404 (emphatic)
- accent: #98e58e (brand leaf, success highlights)
- primary action: #98e58e (filled action)
- muted text: #6e797a

**Example Component Prompts**
1. Create a Primary Action Button: #98e58e background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. *Integration tile grid*: White card, 1px #d9d9d9 border, 16px radius, center-aligned 48px platform icon. Arrange in a 7-column grid with 12px gaps on white canvas.
3. *Product showcase section*: White canvas, 43px/800 #040404 headline left-aligned, then a full-bleed prism-wash gradient panel (green→teal→periwinkle→blue) containing a 16px-radius rounded product screenshot floating centered.
4. *Pricing tier card*: White surface, 1px #d9d9d9 border, 16px radius, 24px padding. Tier name at 24px/700 #040404, price at 43px/800 #040404, feature list at 16px/400, solid dark CTA at the bottom.
5. *Floating insights card on product screenshot*: White surface, 16px radius, 8–12px internal padding, metric label at 13px/400 #6e797a, value at 16px/700 #040404, optional 4px green star or sparkline glyph.

## Visual Language

Photography is full-bleed lifestyle — real people in real environments using phones and laptops, warm natural lighting, candid rather than staged. The subject is always mid-action (typing, smiling, holding a device), never posed. Product screenshots dominate over photography in mid-page sections: the UI is the hero, framed by soft gradient washes. Illustrations are absent; the brand uses its own product UI as the visual content. Iconography is platform-native — TikTok, Instagram, LinkedIn, X, WhatsApp, Salesforce, Pinterest, etc. appear in their full brand colors, never recolored to match the monochrome system. Integration tiles act as a social-proof mosaic of partner logos. The overall density is image-rich in the hero and product sections, text-dominant in the integrations and pricing zones.

## Layout

The page model is max-width 1200px centered on white canvas, with a full-bleed dark hero that breaks the container on the first screen. The hero reverses the system: black background, white headline, centered email capture compound. Below the fold, the layout shifts to left-aligned headlines with full-width product showcases on gradient backgrounds. Sections alternate between text-dominant bands (integrations grid, pricing tiers) and image-dominant bands (product UI screenshots). The integrations section uses a 7-column grid of white tiles on white canvas — the tiles are defined entirely by 1px borders and 16px radius, not by tonal lift. Navigation is a sticky top bar with a soft shadow lift and rounded outer container. Vertical rhythm is generous: 64px section gaps, 32px between content blocks, 16px between elements within a block. The page reads top-to-bottom as: dark hero → white product showcase → white integrations → white pricing.

## Similar Brands

- **Buffer** — Same social-media-management category and same minimal monochrome canvas with a single green brand accent; both use a hero email-capture pattern on a reversed dark panel
- **Hootsuite** — Same product category and similar high-contrast black-on-white headline system with a single chromatic CTA accent; both lean on product UI screenshots as hero visuals
- **Linear** — Same ultra-confident geometric display type at near-black weight on white, same border-defined cards with no shadow, same rationed single-accent color philosophy
- **Webflow** — Same max-width centered container with a reversed dark hero opening, same product-screenshot-on-gradient-wash showcase pattern, same weight-700+ headline confidence
- **Notion** — Same single-color-accent-on-monochrome-canvas philosophy and same flat-surface-no-shadow card treatment; both make one color do all the emotional work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #040404;
  --color-paper-white: #ffffff;
  --color-ash-gray: #d9d9d9;
  --color-smoke-gray: #cbcece;
  --color-slate: #162020;
  --color-pewter: #6e797a;
  --color-sprout-green: #98e58e;

  /* Typography — Font Families */
  --font-proxima-nova: 'Proxima Nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.48;
  --text-body-sm: 16px;
  --leading-body-sm: 1.64;
  --text-body: 18px;
  --leading-body: 1.48;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --text-subheading-lg: 24px;
  --leading-subheading-lg: 1.25;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.18;
  --text-heading: 43px;
  --leading-heading: 1.12;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1.05;
  --text-display: 76px;
  --leading-display: 1.05;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 64px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 24px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-hero-tiles: 64px;

  /* Shadows */
  --shadow-sm: rgba(39, 51, 51, 0.24) 0px 4px 8px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-input-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #040404;
  --color-paper-white: #ffffff;
  --color-ash-gray: #d9d9d9;
  --color-smoke-gray: #cbcece;
  --color-slate: #162020;
  --color-pewter: #6e797a;
  --color-sprout-green: #98e58e;

  /* Typography */
  --font-proxima-nova: 'Proxima Nova', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.48;
  --text-body-sm: 16px;
  --leading-body-sm: 1.64;
  --text-body: 18px;
  --leading-body: 1.48;
  --text-subheading: 21px;
  --leading-subheading: 1.33;
  --text-subheading-lg: 24px;
  --leading-subheading-lg: 1.25;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.18;
  --text-heading: 43px;
  --leading-heading: 1.12;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1.05;
  --text-display: 76px;
  --leading-display: 1.05;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 64px;

  /* Shadows */
  --shadow-sm: rgba(39, 51, 51, 0.24) 0px 4px 8px 0px;
}
```
