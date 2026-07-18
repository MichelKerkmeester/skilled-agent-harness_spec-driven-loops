# Swwim — Style Reference
> Cobalt wave with floating luxury objects.

A vivid blue ocean where oversized white type is pierced by editorial product still-lifes.

**Theme:** light

Swwim is a full-bleed, blue-saturated agency site where the hero IS the brand: a massive all-caps Baton Turbo display at 151px sits on a vivid cobalt field, scattered with floating product crops (a diamond ring, a Givenchy sandal, a megaphone) that overlap the letterforms. The rest of the system stays disciplined — white canvas pages, hairline #e5e7eb borders, pill-shaped controls with 9999px radius, Greycliff for everything readable. The color palette is nearly monochromatic: one hero blue (#1658b3) carries the page, with deeper #0d3c88 and darkest #01295f as gradient depth inside decorative graphics, and a single warm #eee1d9 flesh-tone accent peeking through illustration fills. Components are flat, borderless against the blue, and almost borderless against white — elevation comes from typography weight, not shadow stacks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cobalt Current | `#1658b3` | `--color-cobalt-current` | Hero background, primary surface flood, outlined-link borders — the single color that defines every full-bleed section |
| Deep Channel | `#0d3c88` | `--color-deep-channel` | Darker blue for gradient depth in decorative graphics, icon accents, footer bands |
| Electric Ripple | `#015fee` | `--color-electric-ripple` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Abyssal Ink | `#01295f` | `--color-abyssal-ink` | Darkest blue used inside SVG decoration and deep gradient stops — never as text or button |
| White Canvas | `#ffffff` | `--color-white-canvas` | Page background, body text on blue, primary pill button fill — the neutral that carries white sections and inverts on blue |
| Cloud Border | `#e5e7eb` | `--color-cloud-border` | Hairline dividers, card borders, separator rules across all white surfaces — the structural neutral of the system |
| Carbon | `#000000` | `--color-carbon` | Body text on white, icon fills in black-mode illustrations |
| Nude Clay | `#eee1d9` | `--color-nude-clay` | Warm flesh-tone accent inside decorative illustration fills and strokes — the only chromatic neutral, used to humanize blue compositions |

## Tokens — Typography

### Baton Turbo — Display and oversized headlines only — the 151px hero weight is the signature choice, a single weight (400) stretched across 14px to 151px to create the full editorial scale · `--font-baton-turbo`
- **Substitute:** Druk Wide, Tungsten, Antonio
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px, 29px, 36px, 48px, 151px
- **Line height:** 1.00–1.56
- **Role:** Display and oversized headlines only — the 151px hero weight is the signature choice, a single weight (400) stretched across 14px to 151px to create the full editorial scale

### Greycliff — Body, UI labels, nav, buttons, badges, footer — the working typeface at three weights, with 500/700 reserved for small headings and nav emphasis · `--font-greycliff`
- **Substitute:** Inter, Manrope, DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 16px, 18px, 20px, 24px, 30px
- **Line height:** 1.20–1.56
- **Letter spacing:** normal
- **Role:** Body, UI labels, nav, buttons, badges, footer — the working typeface at three weights, with 500/700 reserved for small headings and nav emphasis

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.56 | — | `--text-body-lg` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 30px | 1.25 | — | `--text-heading` |
| heading-lg | 36px | 1.2 | — | `--text-heading-lg` |
| display | 48px | 1.11 | — | `--text-display` |
| hero | 151px | 1 | — | `--text-hero` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### White Pill CTA
**Role:** Primary action button

Filled white pill on blue or white surfaces, 9999px radius, 16px 24px padding, Greycliff 500 at 16px, text in Cobalt Current (#1658b3). The signature control — no shadows, no border, shape alone communicates the action.

### Ghost Nav Button
**Role:** Secondary header action

White text on blue header, no background, 16px Greycliff 500, sits inline with a Menu label and hamburger icon. Underline or icon pairing is the only affordance.

### Header Logo Lockup
**Role:** Brand mark in navigation

Wordmark 'swwim' in white Greycliff 500 lowercase, followed by a 1px vertical white divider, then the descriptor 'Social Media Marketing' in Greycliff 400. Left-aligned, no logo image.

### Hero Headline
**Role:** Primary page statement

Baton Turbo 400 at 151px, white on Cobalt Current (#1658b3), all-caps, line-height 1.0. Product images absolutely positioned to overlap letterforms — a deliberate collage effect, never centered-clean.

### Hero Body Caption
**Role:** Supporting hero copy

Greycliff 400 at 18px, white, line-height 1.56, placed in the negative space beside the headline. No quotation marks, no italics — plain prose that lets the display type carry the weight.

### Dive In Link
**Role:** Anchor for scroll

Small Greycliff 500 link with a circled down-arrow icon, white on blue, 14-16px. The site's only repeated micro-link style — used to invite the user below the fold.

### Service Marquee
**Role:** Horizontal service ticker

Full-bleed white-on-blue band, Baton Turbo 400 all-caps at 29-36px, separated by bullet dots, scrolling horizontally or static. Sits flush to the bottom of the hero as a visual footer for the section.

### Product Float Image
**Role:** Decorative product crop

Tightly cropped object photography (rings, shoes, packaging) absolutely positioned over the hero headline, no border-radius, no shadow, no caption. The objects overlap letterforms to create a collage system.

### White Surface Card
**Role:** Content container on white

24px padding, 1px #e5e7eb border, no radius, no shadow. The default card treatment — flat, hairline-bordered, relying on white-space rather than elevation.

### Icon
**Role:** UI iconography

Minimal stroked icons, 1.5-2px stroke weight, monochromatic white on blue or Carbon on white. Used sparingly — the megaphone and arrow-down are the only icon-shaped elements visible.

## Do's and Don'ts

### Do
- Use Baton Turbo only for display and oversized headlines — 29px and up; never set it below 20px
- Set the hero headline at 151px on the cobalt background, line-height 1.0, all-caps, with at least one product image overlapping the letterforms
- Use 9999px radius for every button, tag, and pill control — there are no rounded-corner cards or inputs in this system
- Keep surfaces flat: 1px #e5e7eb hairline borders separate content, never drop shadows
- Let #1658b3 carry full-bleed sections as the dominant surface; reserve white for content pages and #0d3c88 for footer/gradient depth
- Use Greycliff 500 for interactive labels and small headings, 400 for body, 700 sparingly for emphasis
- Place a 1px white vertical divider between the wordmark and the descriptor in the header lockup

### Don't
- Do not use Baton Turbo for body copy, nav labels, buttons, or anything below 20px — it loses its editorial voice at small sizes
- Do not introduce drop shadows, glows, or multi-layer elevation stacks — the system is intentionally flat
- Do not add chromatic colors outside the blue family plus the single #eee1d9 flesh tone accent
- Do not center the hero composition in a clean symmetrical layout — the scattered overlapping product crops are the signature
- Do not round card corners or input fields; the only radius in the system is the 9999px pill
- Do not use 151px type outside the hero; the display scale steps sharply down to 48px
- Do not break the blue monochrome with a contrasting CTA color — the white pill on blue IS the action pattern

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | White Canvas | `#ffffff` | Default page background for all content sections |
| 2 | Cobalt Field | `#1658b3` | Full-bleed hero and section floods — the dominant branded surface |
| 3 | Deep Channel | `#0d3c88` | Gradient depth and decorative fills |

## Imagery

Object photography is the signature: tightly cropped luxury product still-lifes (diamond ring, Givenchy sandal, beauty packaging) floating as overlapping elements over the hero typography. No lifestyle photography, no portraits, no environmental context — each object is hero on its own. The megaphone illustration is the only drawn graphic, rendered in flat brand colors with no outline. Imagery is full-bleed in spirit (objects escape their containers to overlap type) but the individual crops are unframed rectangles, not rounded or masked. Iconography is minimal and line-based, monochromatic.

## Layout

Full-bleed cobalt hero dominates the first viewport with a centered-but-asymmetric composition: oversized headline on the left, supporting body copy nested in the negative space right of center, product images absolutely positioned to break the type grid. Below the hero, a full-width white-on-blue service marquee ticker runs horizontally. Subsequent content sections are white-canvas with 1px hairline dividers, 24px card padding, and a 1440px max-width centered column. The header is a minimal top bar — wordmark left, single pill CTA + menu right — not sticky, not mega. Navigation is a single line, no dropdowns visible. Vertical rhythm is generous (64px section gaps) but the hero itself is deliberately dense through type-image overlap.

## Agent Prompt Guide

## Quick Color Reference
- text on white: Carbon (#000000)
- text on blue: White Canvas (#ffffff)
- page background: White Canvas (#ffffff)
- hero / section flood: Cobalt Current (#1658b3)
- border / divider: Cloud Border (#e5e7eb)
- decorative accent: Nude Clay (#eee1d9)
- primary action: #1658b3 (outlined action border)

## 3 Example Component Prompts

1. **Hero with floating product crops**: Full-bleed Cobalt Current (#1658b3) background. Headline at 151px Baton Turbo weight 400, all-caps, white, line-height 1.0, occupying the left two-thirds. One product image (tightly cropped, no border, no radius) absolutely positioned to overlap the lower-right letterforms. Supporting body copy in Greycliff 400, 18px, white, line-height 1.56, placed in the negative space right of center. 64px top and bottom padding.

2. **White Pill Button**: 9999px radius, 16px vertical / 24px horizontal padding, white fill, text in Greycliff 500 at 16px colored Cobalt Current (#1658b3). No border, no shadow. Sits inline with body content on white or on a blue surface.

3. **Service Marquee Band**: Full-bleed Cobalt Current (#1658b3), 64px vertical padding, horizontally scrolling or static line of services separated by white bullet dots. Text is Baton Turbo 400 all-caps at 36px, white. Tightly packed — services run edge-to-edge with 24px gaps between items.

4. **White Surface Card**: White background, 24px padding on all sides, 1px solid #e5e7eb border, 0px radius, no shadow. Body text in Greycliff 400, 16px, Carbon (#000000). Optional heading in Greycliff 500, 20px.

5. **Header Lockup**: White background section, 'swwim' wordmark in Greycliff 500 lowercase 24px white, followed by a 1px wide × 24px tall white vertical divider with 12px margin on each side, then 'Social Media Marketing' descriptor in Greycliff 400 14px white. Right-aligned: white pill 'Contact Us' button + 'Menu' label in Greycliff 500 16px + hamburger icon.

## Similar Brands

- **Gretel** — Editorial agency layouts with oversized display type overlapping small product or texture crops on a bold single-color field
- **Resn** — Full-bleed brand-color sections paired with playful scattered object imagery and confident oversized headlines
- **Locomotive** — Agency portfolio pattern of full-bleed saturated hero bands and restrained white content sections beneath
- **Gunner** — Monochromatic blue-dominant brand systems with pill-shaped controls and a single working neutral palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cobalt-current: #1658b3;
  --color-deep-channel: #0d3c88;
  --color-electric-ripple: #015fee;
  --color-abyssal-ink: #01295f;
  --color-white-canvas: #ffffff;
  --color-cloud-border: #e5e7eb;
  --color-carbon: #000000;
  --color-nude-clay: #eee1d9;

  /* Typography — Font Families */
  --font-baton-turbo: 'Baton Turbo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-greycliff: 'Greycliff', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.11;
  --text-hero: 151px;
  --leading-hero: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-white-canvas: #ffffff;
  --surface-cobalt-field: #1658b3;
  --surface-deep-channel: #0d3c88;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cobalt-current: #1658b3;
  --color-deep-channel: #0d3c88;
  --color-electric-ripple: #015fee;
  --color-abyssal-ink: #01295f;
  --color-white-canvas: #ffffff;
  --color-cloud-border: #e5e7eb;
  --color-carbon: #000000;
  --color-nude-clay: #eee1d9;

  /* Typography */
  --font-baton-turbo: 'Baton Turbo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-greycliff: 'Greycliff', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.11;
  --text-hero: 151px;
  --leading-hero: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-full: 9999px;
}
```
