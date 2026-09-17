# Programa — Style Reference
> Swiss design studio at high noon. A white gallery wall lit by a single yellow desk lamp — everything is grayscale until a button, badge, or highlight demands attention, and then that one yellow note carries the whole room.

**Theme:** light

Programa operates in a Swiss-design vocabulary: near-pure white canvas, architectural sans-serif type at tightly tracked small-to-medium sizes, hairline borders, and a single saturated yellow-green accent that functions as a highlighter pen across an otherwise austere page. The entire palette is essentially four grays plus one chromatic signal — chromatic real estate is rationed, not distributed, so when yellow appears it reads as a switch flipped on. Components are slim and confident: 10px radii, thin 1px borders, generous white space, and zero shadow noise. The aesthetic is editorial-portfolio meets productivity tool — restrained enough to feel serious, bold enough to feel like a designer's tool.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#1a1a1a` | `--color-ink-black` | Primary text, all borders, icon strokes, logo, divider lines, button outlines — the structural ink that defines every shape on the page |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, text on dark fills, input fields |
| Fog Gray | `#f4f4f4` | `--color-fog-gray` | Soft section background, alternate surface, and quiet card fill |
| Ash Gray | `#a3a3a3` | `--color-ash-gray` | Muted secondary text, inactive links, placeholder copy, tertiary metadata |
| Highlighter Yellow | `#fbff2b` | `--color-highlighter-yellow` | Primary action background, focus highlights, tag fills — the single chromatic accent that makes interactive elements feel switched on against the monochrome system |

## Tokens — Typography

### Neue Haas Grotesk Text — The single typeface carries every voice on the site — nav, body, headings, buttons, inputs. Weight 400 is the default for body and nav; weight 500 is reserved for emphasized inline labels (e.g. 'Last Updated:') and section opens. The choice of a neo-grotesque with consistent -0.03em tracking at every size creates optical tightness even at 42px, avoiding the airy looseness most sans-serifs default to. This is a Swiss-tool typeface, not a personality typeface — restraint is the signature. · `--font-neue-haas-grotesk-text`
- **Substitute:** Inter, Neue Haas Grotesk Display Pro (if available), or Helvetica Neue
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 17px, 20px, 24px, 42px
- **Line height:** 1.10 (display), 1.20 (headings), 1.40 (body)
- **Letter spacing:** -0.03em at all sizes (approximately -0.42px at 14px, -0.48px at 16px, -0.51px at 17px, -0.6px at 20px, -0.72px at 24px, -1.26px at 42px)
- **Role:** The single typeface carries every voice on the site — nav, body, headings, buttons, inputs. Weight 400 is the default for body and nav; weight 500 is reserved for emphasized inline labels (e.g. 'Last Updated:') and section opens. The choice of a neo-grotesque with consistent -0.03em tracking at every size creates optical tightness even at 42px, avoiding the airy looseness most sans-serifs default to. This is a Swiss-tool typeface, not a personality typeface — restraint is the signature.

### neue-haas-grotesk-text — neue-haas-grotesk-text — detected in extracted data but not described by AI · `--font-neue-haas-grotesk-text`
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.4
- **Role:** neue-haas-grotesk-text — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | -0.42px | `--text-caption` |
| body-sm | 16px | 1.4 | -0.48px | `--text-body-sm` |
| subheading | 20px | 1.4 | -0.6px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.72px | `--text-heading-sm` |
| heading | 42px | 1.1 | -1.26px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 10px |
| cards | 16px |
| inputs | 10px |
| buttons | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Top Navigation Bar
**Role:** Sticky-style header anchoring page identity and primary destinations

White background, no border-bottom. Left: geometric two-diamond logo (Ink Black) + 'Programa' wordmark at 16-20px weight 400. Center: nav links (Product, Customers, Pricing, Learn) at 16px weight 400, Ink Black, 24px horizontal spacing. Right: 'Log in' as a text link in Ink Black, then a Primary CTA Button. Height feels ~64px with generous horizontal padding.

### Primary CTA Button
**Role:** The single high-emphasis action on any screen

Highlighter Yellow (#fbff2b) fill, 1px Ink Black (#1a1a1a) border, 10px border-radius, 8px vertical / 12px horizontal padding. Label in Neue Haas Grotesk Text 16px weight 400, Ink Black. 12px gap between sibling buttons. The 1px black outline around a yellow fill gives the button a hand-stamped, sticker-like quality — it's the only place a border reinforces rather than contains.

### Ghost Text Button
**Role:** Secondary, low-emphasis action paired with the primary CTA

No fill, no border. Label in Neue Haas Grotesk Text 16px weight 400, Ink Black. Sits to the left of the Primary CTA. Vertically aligned to the same baseline as the CTA.

### Page Heading
**Role:** Hero heading for content pages

Neue Haas Grotesk Text 42px weight 500, Ink Black, line-height 1.10, letter-spacing -1.26px. Left-aligned with 111px left margin. No subtitle, no eyebrow — the heading stands alone.

### Info Banner
**Role:** Metadata callout (e.g. 'Last Updated') below the page heading

Fog Gray (#f4f4f4) fill, no border, 16px border-radius. Padding ~12px vertical / 16px horizontal. Content is a label-value pair: bold label ('Last Updated:') in Ink Black weight 500, followed by value in Ink Black weight 400, both at 16px.

### Numbered Section Block
**Role:** Ordered content list with bold lead-in label

Decimal number (1., 2., …) flush left at 16px Ink Black weight 400. Indented label (e.g. 'Purpose and Scope') in 16px weight 500 Ink Black. Body paragraphs in 16-17px weight 400 Ink Black at line-height 1.4. Vertical gap between sections: 8px. The bold label + paragraph pattern is a signature — it's the page's only typographic hierarchy device.

### Logo Lockup
**Role:** Brand mark + wordmark for header and footer

Two stacked diamond/parallelogram shapes in Ink Black, approximately 24x24px, followed by 'Programa' wordmark in Neue Haas Grotesk Text 20px weight 400, Ink Black, letter-spacing -0.6px. 8px gap between icon and wordmark.

### Form Input
**Role:** Text entry field

1px Ink Black border, 10px border-radius, 6px vertical / 12px horizontal padding. Placeholder text in Ash Gray (#a3a3a3) at 16px. White fill. On focus: border remains Ink Black (no color shift) — the focus state is communicated through weight or ring, not hue.

### Nav Link
**Role:** Top-level navigation destination

Neue Haas Grotesk Text 16px weight 400, Ink Black, no underline, no color shift on hover visible in data. 24px horizontal spacing between links. 4px column gap from the wordmark.

### Footer Link
**Role:** Secondary navigation in footer

Neue Haas Grotesk Text 14-16px weight 400, Ink Black, muted compared to nav. Typically arranged in columns with 8-12px vertical gap between links.

## Do's and Don'ts

### Do
- Use #fbff2b fill with 1px #1a1a1a border exclusively for the single primary action per screen — never use the yellow as a background for large surfaces or decorative blocks.
- Set all text at -0.03em letter-spacing using the Neue Haas Grotesk Text scale (14/16/17/20/24/42px) — do not introduce a second typeface or loosen tracking at display sizes.
- Apply 10px border-radius to buttons, nav elements, and inputs; reserve 16px for larger card surfaces and info banners.
- Build vertical rhythm on the 6px base unit: 8px between list items, 12px for element gaps, 16px for card padding, 48-96px for section separation.
- Use #f4f4f4 as the only mid-surface between white and the yellow accent — never introduce additional gray tints or gradient washes.
- Keep page layout centered with a 1200px max-width and 111px left margin for content blocks; let white space carry the visual weight.
- Communicate hierarchy through weight (400 vs 500), not color or size variation — the system has exactly two weights and a tight type scale.

### Don't
- Don't introduce drop shadows, glow effects, or blur — elevation is flat and border-defined.
- Don't use #fbff2b on more than one element per viewport — its power comes from scarcity.
- Don't add a second accent color; the palette is monochrome + one yellow-green signal.
- Don't use Ash Gray (#a3a3a3) for body copy — it's a 2.5:1 contrast fail on white; reserve it for placeholders and inactive metadata only.
- Don't increase border-radius above 16px — the slightly squared geometry is part of the identity.
- Don't break the 6px spacing grid with arbitrary pixel values; every gap should be a multiple of 6.
- Don't add a subtitle or eyebrow text above page headings — the 42px heading stands alone.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the dominant surface |
| 1 | Fog Card | `#f4f4f4` | Soft info banners and elevated callouts that recede without a border |
| 2 | Accent Fill | `#fbff2b` | Highlight wash on primary action surfaces |

## Elevation

Programa deliberately avoids box-shadows. Elevation is communicated through surface color shifts (white → fog gray) and the 1px ink-black border, not through drop shadows. This keeps the system flat and architectural — the Swiss-design tradition where lines define form, not light.

## Imagery

Pure UI with no photography or illustration on this page — the visual language is typographic and structural. Logo is the only graphic mark, rendered as two solid Ink Black geometric shapes (diamond/parallelogram forms). The highlighter-yellow CTA is itself a visual element: a stamped sticker on the white canvas. No icons, no avatars, no product screenshots on the Acceptable Use Policy page. When imagery does appear elsewhere, expect it to be contained within sharp or slightly rounded crops, full-bleed product photography on pure white, and monochromatic or single-accent treatment consistent with the palette.

## Layout

Centered max-width layout (~1200px) with generous side margins (111px+). The header is a flat white bar with no border, logo left, centered nav cluster, auth actions right. Content pages lead with a single large 42px left-aligned heading, followed by a full-width Fog Gray info banner, then a vertically stacked numbered content list that uses bold lead-in labels + paragraphs. Section separation is 48-96px vertical padding. No alternating bands, no sidebar, no grid cards on content pages — the rhythm is a single column of breathing white space punctuated by sparse structural elements.

## Agent Prompt Guide

Quick Color Reference:
- text: #1a1a1a
- background: #ffffff
- surface: #f4f4f4
- border: #1a1a1a
- muted text: #a3a3a3
- primary action: #fbff2b (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #fbff2b background, #1a1a1a text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a page heading block: 42px Neue Haas Grotesk Text weight 500 #1a1a1a, line-height 1.10, letter-spacing -1.26px, left-aligned with 111px left margin. Below it, an info banner: #f4f4f4 fill, 16px radius, 12px 16px padding, containing 'Last Updated:' in 16px weight 500 #1a1a1a followed by 'January 1, 2026' in 16px weight 400 #1a1a1a.

3. Create a numbered content section: decimal number '1.' in 16px weight 400 #1a1a1a flush left, then a bold lead-in label in 16px weight 500 #1a1a1a, then a body paragraph in 17px weight 400 #1a1a1a at line-height 1.40. 8px vertical gap to the next section.

4. Create a form input: 1px #1a1a1a border, 10px radius, #ffffff fill, 6px 12px padding. Placeholder 'Enter your email' in 16px #a3a3a3. Label above in 14px weight 500 #1a1a1a with 8px bottom margin.

5. Create a secondary card surface: #f4f4f4 fill, 16px border-radius, 24px padding, no border, no shadow. Heading inside in 20px weight 500 #1a1a1a, body in 16px weight 400 #1a1a1a, 12px gap between heading and body.

## Similar Brands

- **Linear** — Same near-monochrome palette with a single saturated accent (Linear's purple), tight typographic system, and minimal-border component geometry
- **Figma Config** — Same Swiss-design restraint with hairline borders, generous white space, and a single chromatic accent used sparingly for primary actions
- **Notion** — Similar flat-no-shadow component language, 10px-ish radii, and a neutral-first palette where one accent color carries the brand
- **Vercel** — Same editorial minimalism with monochrome canvas, tight tracking on a neo-grotesque typeface, and accent color rationed to CTAs only
- **Are.na** — Same white-canvas-plus-muted-neutral aesthetic with type-driven hierarchy and zero decorative chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-fog-gray: #f4f4f4;
  --color-ash-gray: #a3a3a3;
  --color-highlighter-yellow: #fbff2b;

  /* Typography — Font Families */
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.42px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -1.26px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 10px;
  --radius-cards: 16px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-fog-card: #f4f4f4;
  --surface-accent-fill: #fbff2b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-fog-gray: #f4f4f4;
  --color-ash-gray: #a3a3a3;
  --color-highlighter-yellow: #fbff2b;

  /* Typography */
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.42px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -1.26px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
}
```
