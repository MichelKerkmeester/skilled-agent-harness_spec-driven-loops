# Allbirds — Style Reference
> Natural materials on white linen

**Theme:** light

Allbirds runs on quiet, natural confidence — a near-totally achromatic canvas punctuated by warm sand (#e0dacf) and muted earth tones lifted directly from the product photography. The UI stays out of the product's way: white surfaces, hairline borders, uppercase tracking-heavy nav, and pill-shaped controls that feel like physical buttons rather than web elements. Self Modern (a custom serif) is reserved for the few moments of editorial weight — hero headlines and collection names — while Geograph carries every label, body line, and button at three disciplined weights. Category cards become the color system: each one takes its background swatch from the product it features, turning the navigation into a living Pantone deck.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page backgrounds, card surfaces, product card backgrounds |
| Charcoal | `#212121` | `--color-charcoal` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| True Black | `#000000` | `--color-true-black` | Headlines, icons, high-contrast borders, nav text |
| Warm Sand | `#e0dacf` | `--color-warm-sand` | Hero section background, secondary surface tone, large editorial panels |
| Olive Char | `#222519` | `--color-olive-char` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Iron Gray | `#525252` | `--color-iron-gray` | Secondary text, helper copy, subtle borders |
| Stone | `#737373` | `--color-stone` | Muted borders, disabled dividers, footer separators |
| Slate Border | `#6a6767` | `--color-slate-border` | Outlined button border color |
| Oat Milk | `#ece9e2` | `--color-oat-milk` | Tertiary surface, subtle nav tint, warm off-white alt background |
| Mist | `#bdbab5` | `--color-mist` | Soft shadow tone for elevated elements |

## Tokens — Typography

### Self Modern — Display headlines and editorial copy — used sparingly for hero statements and collection titles. The serif italic-leaning forms break the sans-serif monotony and signal 'this is the story'. · `--font-self-modern`
- **Substitute:** Playfair Display, DM Serif Display, Cormorant Garamond
- **Weights:** 400
- **Sizes:** 18px, 40px
- **Line height:** 1.00, 1.20, 1.50, 1.78
- **Letter spacing:** normal
- **Role:** Display headlines and editorial copy — used sparingly for hero statements and collection titles. The serif italic-leaning forms break the sans-serif monotony and signal 'this is the story'.

### Geograph — The workhorse UI typeface — body copy, nav labels, buttons, product titles, footers, inputs, badges. 500 for emphasized labels, 700 for product names. Wide letter-spacing (0.025em–0.10em) on uppercase nav and category labels gives the brand its editorial cadence. · `--font-geograph`
- **Substitute:** Inter, Söhne, GT America, Neue Haas Grotesk
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 20px, 24px
- **Line height:** 1.00, 1.25, 1.33, 1.40, 1.43, 1.50, 1.67
- **Letter spacing:** 0.025em at 12–14px, 0.05em at 16px, 0.10em on uppercase nav labels
- **Role:** The workhorse UI typeface — body copy, nav labels, buttons, product titles, footers, inputs, badges. 500 for emphasized labels, 700 for product names. Wide letter-spacing (0.025em–0.10em) on uppercase nav and category labels gives the brand its editorial cadence.

### HurmeGeometricSans3 — Rarely used — a fallback or specialized button label variant. Geograph carries the system day-to-day. · `--font-hurmegeometricsans3`
- **Substitute:** Inter, Söhne
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.14
- **Role:** Rarely used — a fallback or specialized button label variant. Geograph carries the system day-to-day.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.25 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.35px | `--text-body-sm` |
| body | 16px | 1.5 | 0.8px | `--text-body` |
| subheading | 20px | 1.4 | 1px | `--text-subheading` |
| heading-sm | 24px | 1.33 | 1.2px | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 108 | 108px | `--spacing-108` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 16px |
| inputs | 4px |
| buttons | 9999px (pill) |
| large-surfaces | 20-24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(87, 87, 87) 0px 0px 0px 1px inset, rgb(0, 0, 0) 0px 0...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-56px
- **Card padding:** 32-40px
- **Element gap:** 8-16px

## Components

### Pill Button (Primary)
**Role:** Primary action trigger — Shop Men, Shop Women, Shop Now

Fully rounded pill (9999px radius), 14px Geograph 500, uppercase, letter-spacing 0.10em, 12px vertical / 24px horizontal padding, background #ffffff on hero or #212121 on dark contexts, text in opposite tone. No shadow, no border.

### Pill Button (Dark Surface)
**Role:** CTA on light or sand backgrounds

Same pill geometry, fill #212121 or #222519, text #ffffff. Used on warm sand hero where the dark pill creates the only strong contrast point on the page.

### Category Color Card
**Role:** Navigation entry for a product collection

4-column grid, each card is a full-bleed image of one shoe centered on a solid muted color swatch (dusty blue, warm brown, dusty rose, sage). Category label sits in a small white pill with black text and 0.10em tracking at the upper-left of the shoe. No card shadow — the swatch IS the card.

### Product Detail Card
**Role:** PDP or collection grid entry

White (#ffffff) surface, shoe image centered, no visible border. Product name in Geograph 700 at 16px, price below in Geograph 400 at 14px in #525252. 16px radius on the image container or card edge.

### Editorial Hero Panel
**Role:** Top-of-page story section

Full-width band on #e0dacf warm sand. Headline in Self Modern 400 at 40px, white. Eyebrow text in Geograph 500 uppercase at 12px with 0.10em tracking above headline. No gradient, no shadow — flat editorial block.

### Split Lifestyle + Product Block
**Role:** Brand storytelling section below hero

Two-column: left = full-bleed lifestyle photo with overlaid Self Modern headline and a Shop Now pill; right = large square product swatch panel showing the shoe on a matching muted color background with a small PANTONE swatch card overlay. The color-on-color pairing is the signature move.

### Top Navigation Bar
**Role:** Primary site navigation

White #ffffff, 12px bottom padding, logo left (Geograph 700 20px), nav center (MEN / WOMEN / SALE in Geograph 500 uppercase 12px, 0.10em tracking, 32px horizontal padding between items), utility icons + account/return links right in Geograph 400 14px. Hairline #e0dacf or transparent border at bottom.

### Free Shipping Announcement Bar
**Role:** Top-most utility strip

Full-bleed #212121 black bar, white text Geograph 400 12px, centered, 8px vertical padding. Always-on, never styled — functional, not decorative.

### Badge / Tag (NEW COLOR, PANTONE COLOR)
**Role:** Product annotation chip

Inline label, Geograph 500 12px uppercase with 0.10em tracking, no fill, no border, just text on the product card. Sits in the upper-left of the card in #212121. Zero chrome.

### Inset-Border Input
**Role:** Newsletter or search field

4px radius, white fill, 1px inset border via box-shadow stack: inset rgb(87,87,87) 0 0 0 1px + rgb(0,0,0) 0 0 0 1px. Placeholder in #525252, 14px Geograph 400. Flat, tactile, no floating label.

### Carousel Arrow Button
**Role:** Navigation for product carousels

Circular outline button (~32px), 1px border in #212121, chevron icon centered, white fill. Used for the New Arrivals carousel arrows.

### Section Title with Underline
**Role:** Centered Geograph 700 16px uppercase, 0.10em tracking, with a short 1px black underline beneath the text (24-40px wide). Minimal period punctuation or dot separator.

Centered Geograph 700 16px uppercase, 0.10em tracking, with a short 1px black underline beneath the text (24-40px wide). Minimal period punctuation or dot separator.

### Footer
**Role:** Site footer

White or off-white #ece9e2 surface, multi-column link grid in Geograph 400 14px #525252, headings in Geograph 500 14px #212121, country/region selector and legal copy at the bottom in 12px. No social icons colored — all monochrome.

## Do's and Don'ts

### Do
- Use 9999px pill radius for every button, tag, and icon button — pill is the brand's signature control shape
- Pull hero and section backgrounds from the warm sand family (#e0dacf, #ece9e2) rather than neutral gray to keep the palette earth-toned
- Apply 0.10em letter-spacing on all uppercase labels (nav, badges, category pills) — tracking is the brand's typographic signature
- Reserve Self Modern for the one or two largest headlines per screen; let Geograph do everything else
- Use solid color swatches as full-bleed card backgrounds for category navigation — each category card IS its color story
- Maintain a 4px spacing base; prefer 8/16/32 increments for element gaps, 40-56px for section gaps
- Keep shadows to zero or near-zero — separation comes from color blocks and 1px borders, not elevation

### Don't
- Don't introduce saturated or chromatic brand colors — the system is intentionally near-achromatic, with color coming from product photography
- Don't use drop shadows on cards or buttons — Allbirds separates surfaces with flat color and hairline borders
- Don't mix multiple display fonts — Self Modern appears once or twice per page maximum, always at 40px+
- Don't use low-contrast grays for body text — body copy stays at #212121 or #525252 on white, never lighter
- Don't break the pill rule with square or rounded-rect buttons — every interactive control is fully rounded
- Don't use gradients on UI surfaces — the brand is flat color blocks, no gradient fills anywhere
- Don't add decorative icon colors or multicolor icon sets — icons stay mono in #212121 or #000000

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background, footer, card surfaces, product card background |
| 2 | Warm Sand | `#e0dacf` | Hero section background, editorial full-bleed bands, product swatch panels |
| 3 | Oat Milk | `#ece9e2` | Tertiary surface, subtle nav tint, warm off-white alt background |
| 4 | Charcoal Surface | `#212121` | Dark mode-adjacent surface for announcement bar, dark CTA buttons, footer dark areas |
| 5 | Category Swatch | `#d1b0a4` | Category card background (warm rose tone for Women's etc.) |

## Elevation

Elevation is essentially absent. Surfaces are separated by flat color blocks, hairline 1px borders, or solid background swatch changes. The only shadow detected is an inset border stack on input fields — a tactile, not elevated, effect. Cards, buttons, and panels rest on the canvas with no shadow lift, reinforcing the brand's material-natural aesthetic where things sit flat like paper on a table.

## Imagery

Photography is the entire visual system. All product shots are tightly cropped on the shoe at a slight angle, isolated on a solid color background that matches or complements the shoe's accent color — effectively turning each photo into a color study. Lifestyle photography is warm, sunlit, outdoor-natural (agave fields, wooden boardwalks, earthy terrain), slightly desaturated to match the muted palette. No illustrations, no 3D renders, no abstract graphics. The Pantone collaboration introduces a literal color swatch card as a graphic device. Iconography is minimal and monochrome (outlined stroke icons in nav and utility positions).

## Layout

Max-width ~1200px centered with generous side padding. The hero is a full-bleed editorial band on warm sand with a large product carousel fanning outward from center. Category navigation is a 4-column equal grid of solid color cards, each containing a single centered shoe. Below the fold, the layout alternates between full-bleed split panels (lifestyle photo left + product swatch right) and centered product carousels under a small underlined section title. The overall rhythm is: full-bleed editorial → 4-column grid → centered product carousel → 2-column split → centered product carousel. Spacing between sections is 40-56px, creating airy but not cavernous transitions. Navigation is a minimal sticky top bar with centered primary links.

## Agent Prompt Guide

**Quick Color Reference**
- text: #212121 (primary), #525252 (secondary)
- background: #ffffff (page), #e0dacf (hero/section bands)
- border: #737373 (subtle), #212121 (strong)
- accent: no chromatic accent — color comes from product imagery
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero editorial band**: Full-bleed #e0dacf background, no max-width. Eyebrow text in Geograph 500, 12px, uppercase, letter-spacing 0.10em, #212121. Headline in Self Modern 400, 40px, #212121, line-height 1.20. Two pill buttons below: #ffffff fill with #212121 text, and #212121 fill with #ffffff text. Both 9999px radius, 12px vertical / 24px horizontal padding, Geograph 500 14px uppercase 0.10em tracking.

2. **Category color card**: 4-column grid, each cell is a solid muted color block (#8b9aa4 dusty blue, #8a7466 warm brown, #c4a4a4 dusty rose, #8a9a8c sage). A single shoe photo centered inside. Category label in a white pill, Geograph 500 12px uppercase 0.10em tracking, positioned upper-left. 16px radius on the card corners.

3. **Product carousel card**: White #ffffff surface, no border, no shadow. Shoe photo centered in the upper 70%. Product name in Geograph 700, 16px, #212121. Price in Geograph 400, 14px, #525252. Optional 'NEW COLOR' or 'PANTONE COLOR' label in Geograph 500, 12px, uppercase, 0.10em tracking, #212121, positioned upper-left of the card with no background or border.

4. **Top navigation**: White #ffffff, 12px bottom padding. Logo 'allbirds' in Geograph 700, 20px, lowercase, #212121, left-aligned. Center nav: MEN / WOMEN / SALE in Geograph 500, 12px, uppercase, 0.10em tracking, #212121, 32px gap between items. Right side: account links in Geograph 400, 14px, #525252, plus outlined monochrome icons for search, account, cart.

5. **Split lifestyle + product block**: Two equal columns. Left: full-bleed lifestyle photo (outdoor, warm sunlight, natural setting). Overlaid in the lower-left: Self Modern 400 40px headline #ffffff with a 0.10em-tracked Geograph 500 12px eyebrow above and a white pill 'Shop Now' button below. Right: solid color swatch panel (#4a4a6a deep indigo) with the product shoe centered and a small white Pantone swatch card (white rectangle with border + label) in the lower-left corner.

## Color Philosophy

The Allbirds color system is deliberately void — chromatic identity comes from the product itself, not from UI chrome. The interface is a white-and-sand frame for the shoes. The only deviations are the muted earth tones used as full-bleed backgrounds behind product photos in category cards and editorial sections. These tones are pulled directly from the product palette (dusty blue, warm taupe, dusty rose, sage, deep indigo) rather than declared as brand tokens. The result: the UI is interchangeable with any collection, and the product always carries the color story.

## Typography Voice

Geograph is the voice — it speaks in a calm, slightly tracked monotone that feels like museum wall text. Self Modern is the exclamation — reserved for the two or three moments per page where a headline needs to feel like a magazine pull quote rather than a UI label. The 0.10em letter-spacing on every uppercase element is what gives the brand its editorial cadence: not the font choice, but the breathing room between letters. A page without that tracking would look like a different brand entirely.

## Similar Brands

- **Everlane** — Same near-achromatic UI with warm off-white backgrounds, editorial serif display headlines paired with clean sans-serif body, and pill-shaped minimal buttons that let the product photography carry all the color
- **Aesop** — Same restraint — warm sand and oat-milk neutrals, wide-tracked uppercase labels, serif display type used sparingly, zero shadows, and the product itself as the only source of color
- **Glossier** — Similar editorial confidence — white canvas, thin uppercase nav, serif display accents on otherwise sans-serif pages, and the product photography doing all chromatic heavy lifting
- **M.Gemi** — Same product-card-as-color-swatch approach — category cards use solid muted color blocks that extend the palette pulled from the shoes themselves
- **Cuyana** — Same warm-sand hero backgrounds, pill buttons, wide-tracked uppercase category labels, and the philosophy that the UI should disappear so the materials speak

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-charcoal: #212121;
  --color-true-black: #000000;
  --color-warm-sand: #e0dacf;
  --color-olive-char: #222519;
  --color-iron-gray: #525252;
  --color-stone: #737373;
  --color-slate-border: #6a6767;
  --color-oat-milk: #ece9e2;
  --color-mist: #bdbab5;

  /* Typography — Font Families */
  --font-self-modern: 'Self Modern', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geograph: 'Geograph', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hurmegeometricsans3: 'HurmeGeometricSans3', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.8px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.2px;
  --text-heading: 40px;
  --leading-heading: 1.2;

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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-108: 108px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-56px;
  --card-padding: 32-40px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 16px;
  --radius-inputs: 4px;
  --radius-buttons: 9999px (pill);
  --radius-large-surfaces: 20-24px;

  /* Shadows */
  --shadow-subtle: rgb(87, 87, 87) 0px 0px 0px 1px inset, rgb(0, 0, 0) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-sand: #e0dacf;
  --surface-oat-milk: #ece9e2;
  --surface-charcoal-surface: #212121;
  --surface-category-swatch: #d1b0a4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-charcoal: #212121;
  --color-true-black: #000000;
  --color-warm-sand: #e0dacf;
  --color-olive-char: #222519;
  --color-iron-gray: #525252;
  --color-stone: #737373;
  --color-slate-border: #6a6767;
  --color-oat-milk: #ece9e2;
  --color-mist: #bdbab5;

  /* Typography */
  --font-self-modern: 'Self Modern', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geograph: 'Geograph', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hurmegeometricsans3: 'HurmeGeometricSans3', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.8px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.2px;
  --text-heading: 40px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-108: 108px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-subtle: rgb(87, 87, 87) 0px 0px 0px 1px inset, rgb(0, 0, 0) 0px 0px 0px 1px;
}
```
