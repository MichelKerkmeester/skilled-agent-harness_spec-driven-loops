# Metamask — Style Reference
> Warm peach workshop with giant purple type — cozy, loud headlines, quiet controls.

**Theme:** light

MetaMask's visual system is a warm, maximalist-on-type language built on a single signature cream-peach canvas (#fff1eb) that makes every page feel like an editorial spread. Display type does the heavy lifting: an ultra-condensed geometric face at 75–158px in deep violet carries authority through sheer scale rather than weight, while the rest of the interface stays compact and quiet. CTAs are small black pill buttons that sit against the warm canvas as a precise, high-contrast anchor. Color is used functionally as wash — green, pink, blue, and orange swatches paint cards and illustrations rather than chrome — leaving the chrome itself nearly monochrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Peach Cream | `#fff1eb` | `--color-peach-cream` | Page canvas, hero backgrounds, dominant surface — the warm skin of the entire site |
| Ink Black | `#0a0a0a` | `--color-ink-black` | Primary text, pill CTA fill, nav icons, borders — near-black rather than pure #000 for slightly softer edges |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces on cream sections, button labels, inverted text on black CTAs |
| Cool Mist | `#e9edf6` | `--color-cool-mist` | Secondary surface, link/button hover washes, soft card backgrounds when a section needs visual cooling |
| Slate | `#393d46` | `--color-slate` | Muted body text, secondary headings, icon strokes — lifts information below the black primary |
| Hairline | `#c8ceda` | `--color-hairline` | Borders, dividers, list-item separators on neutral surfaces |
| Deep Violet | `#3d065f` | `--color-deep-violet` | Brand primary — display headlines, decorative strokes, key UI accents; saturated enough to dominate 158px type against the cream canvas |
| Midnight Plum | `#190066` | `--color-midnight-plum` | Headline emphasis, link text, dark card backgrounds — the second register of the violet system, used when Deep Violet needs a partner with more weight |
| Lime Wash | `#e5ffc3` | `--color-lime-wash` | Accent card surface, decorative wash — fresh, spring-green that lights up product/feature blocks |
| Acid Lime | `#baf24a` | `--color-acid-lime` | Saturated green highlight inside illustrations and graphic accents — punctuation color, never structural |
| Lilac Haze | `#eac2ff` | `--color-lilac-haze` | Soft pink-purple card wash, pastel type accent — gentle partner to Deep Violet |
| Orchid Pop | `#d075ff` | `--color-orchid-pop` | Saturated pink-purple for decorative shapes and graphic punctuation sitting over lilac or cream |
| Sky Wash | `#cce7ff` | `--color-sky-wash` | Cool blue card surface — the cool counterweight to the warm canvas in feature blocks |
| Periwinkle | `#89b0ff` | `--color-periwinkle` | Saturated blue highlight for icons and illustration fills |
| Apricot | `#ffa680` | `--color-apricot` | Warm accent card surface — echoes the cream canvas but steps up in saturation for energy |
| Burnt Sienna | `#661800` | `--color-burnt-sienna` | Dark warm accent for display text and decorative borders — the orange system's deep register |

## Tokens — Typography

### MMPolyVariable — Display headlines only — ultra-condensed geometric face that carries page-level authority at 75–158px. The narrow proportions let  · `--font-mmpolyvariable`
- **Substitute:** Bebas Neue
- **Weights:** 400
- **Sizes:** 32px, 48px, 75px, 127px, 158px
- **Line height:** 1.0–1.25
- **Letter spacing:** -0.006em
- **Role:** Display headlines only — ultra-condensed geometric face that carries page-level authority at 75–158px. The narrow proportions let 

### MMSansVariable — Secondary sans for sub-headlines and short labels that sit beneath the poly display — keeps the brand on one type system without competing with the hero. Substitute: Inter, Söhne, or General Sans. · `--font-mmsansvariable`
- **Substitute:** Inter
- **Weights:** 400–600
- **Sizes:** 16px, 24px
- **Line height:** 1.0
- **Role:** Secondary sans for sub-headlines and short labels that sit beneath the poly display — keeps the brand on one type system without competing with the hero. Substitute: Inter, Söhne, or General Sans.

### MMEuclidCircularB — Body, UI, nav, buttons, badges, inputs — the workhorse. Circular geometric forms keep a friendly counterpoint to the aggressive poly display. Weight 500 for nav, 700 for button labels, 400 for body. Tight line-height 0.80 used for badge micro-text. Substitute: DM Sans, Nunito, or Nunito Sans. · `--font-mmeuclidcircularb`
- **Substitute:** DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 8px, 12px, 13px, 14px, 15px, 16px, 24px
- **Line height:** 0.80–1.65
- **Role:** Body, UI, nav, buttons, badges, inputs — the workhorse. Circular geometric forms keep a friendly counterpoint to the aggressive poly display. Weight 500 for nav, 700 for button labels, 400 for body. Tight line-height 0.80 used for badge micro-text. Substitute: DM Sans, Nunito, or Nunito Sans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| heading-sm | 32px | 1.16 | -0.19px | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.29px | `--text-heading` |
| heading-lg | 75px | 1.1 | -0.45px | `--text-heading-lg` |
| display | 127px | 1.05 | -0.76px | `--text-display` |
| display-xl | 158px | 1 | -0.95px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 32 | 32px | `--spacing-32` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 12px |
| pills | 69px |
| small | 4px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill CTA Button
**Role:** Primary action — download/install entry points

Black fill (#0a0a0a), white text, 9999px radius (full pill), MMEuclidCircularB 14–15px weight 700, 11px vertical / 20px horizontal padding. Always uppercase or title-case short label. Acts as the single dark anchor on the warm cream canvas.

### Ghost Nav Button
**Role:** Secondary header control (menu toggle)

Transparent fill, #0a0a0a 1px border, 9999px radius, 40–48px square proportions. Hamburger icon centered. Sits to the right of the primary CTA in the header.

### Top Navigation Bar
**Role:** Global site navigation

Transparent over the cream canvas — no background fill, no border. Wordmark logo at left (

### Hero Display Block
**Role:** Above-the-fold page headline

Full-bleed cream (#fff1eb) section, centered text stack. MMPolyVariable at 127–158px weight 400, color #3d065f, line-height 1.0, three lines stacked tight. Subtext and pill CTA centered below with 24–32px gap.

### Feature Card (Accent Wash)
**Role:** Product/feature illustration container

Square or near-square card on cream canvas, filled with one accent color (Lime Wash, Lilac Haze, Apricot, or Sky Wash). 12px radius, 24px internal padding, 3D illustration or product mock centered. Deep Violet (#3d065f) display text overlays as 32–48px type that breaks the card edges.

### Phone Product Mockup Card
**Role:** In-context product showcase

Tall portrait card with a dark (#1a1a1a) phone-frame surface containing the wallet UI screenshot. Decorative purple/lilac shape fragments break out horizontally past the card edges, creating the signature \"shapes that escape their container\" effect.

### Side Floating Widget
**Role:** Persistent secondary nav/menu

Small vertical pill, #0a0a0a fill, fixed to the right edge of the viewport, ~12px wide × 80px tall, 9999px radius, 3 white dot indicators stacked vertically.

### Update Toast
**Role:** Dismissible system notification

Fixed bottom-left card, white (#ffffff) surface, #e9edf6 border, 12px radius, 16px padding. 

### Footer/Subnav
**Role:** Page-bottom navigation

Sits directly on the cream canvas — no background plate, no border-top divider. Horizontal list of text links at 14px weight 500 #393d46, 12–16px row-gap, left-aligned or centered.

### Link (Inline)
**Role:** Hyperlinks within body text

#190066 or #0a0a0a text, 1px underline offset 2px, MMEuclidCircularB 16px weight 500. No background change on hover — underline thickens or color shifts to Deep Violet.

### Badge/Pill Label
**Role:** Tag, status, small label

3px or 4px vertical padding, 8–10px horizontal padding, MMEuclidCircularB 12px weight 700, line-height 0.80, 9999px radius. Background is one of the accent washes (#eac2ff, #cce7ff, #baf24a), text is #0a0a0a.

## Do's and Don'ts

### Do
- Use MMPolyVariable at 75–158px weight 400 for display headlines, always in #3d065f or #190066 on the #fff1eb canvas
- Build CTAs as #0a0a0a pills with 9999px radius, 14px MMEuclidCircularB weight 700 white label, 11px/20px padding
- Set the page canvas to #fff1eb — never use pure white as a full-page background
- Rotate one accent wash per feature card (Lime Wash, Lilac Haze, Apricot, or Sky Wash) — pick one, not two
- Let decorative shapes break the card boundary — purple fragments extending past the card edge are a signature, not a bug
- Keep body text compact: MMEuclidCircularB 14–16px, line-height 1.5, #0a0a0a primary, #393d46 secondary
- Stack display type on 3 lines max with line-height 1.0–1.16; the headline IS the hero

### Don't
- Don't use MMPolyVariable below 32px — it becomes illegible and loses its identity
- Don't put the pill CTA in a chromatic color (no purple, no green pills) — the black pill IS the brand
- Don't add box-shadows to cards — the design relies on flat colored surfaces, not elevation
- Don't use pure #000000 for text or buttons — use #0a0a0a throughout
- Don't alternate between dark and light page sections — the entire site lives on the single #fff1eb canvas
- Don't mix more than two accent colors on one card surface — the rotation is one wash per block
- Don't center body paragraphs wider than 65ch or add a top border/drop-shadow to the navigation bar

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Peach Canvas | `#fff1eb` | Page-wide base — the signature warm cream that defines the entire site |
| 1 | White Card | `#ffffff` | Elevated cards and product surfaces that need to step off the warm canvas |
| 2 | Cool Mist | `#e9edf6` | Cooling secondary surface for links, chips, and hover states |
| 3 | Accent Wash | `#e5ffc3` | Vibrant card surface for feature/illustration blocks — one of several color washes rotated through |

## Elevation

The system intentionally avoids box-shadows. Elevation is communicated through the warm cream canvas (#fff1eb) receding behind white cards (#ffffff), which in turn sit behind accent-wash feature cards. Depth comes from color layering and scale, never from drop shadows. The single exception is the floating right-edge pill widget, which uses position alone (not shadow) to read as 'on top'.

## Imagery

Imagery is treated as 3D rendered illustrations and stylized product mockups rather than photography. Character illustrations are soft, rounded, almost toy-like figures in pastel jackets set against vivid orange or cream backgrounds. Product surfaces (the phone mockup) are shown at life-size with deep black UI inside, dramatized by the contrast against the cream page. Decorative purple shape fragments frequently break out of their card boundaries, creating a collage/poster feel. The role is editorial-heroic — imagery IS the page, not supporting content. Photography is essentially absent; the brand speaks in illustration and display type.

## Layout

Full-bleed sections all sitting on the single #fff1eb cream canvas — no banded dark/light alternation. The hero is a centered display-type stack with a single CTA below; subsequent sections use an asymmetric collage of accent-colored cards and product mockups, not a regular grid. Decorative elements consistently break the grid (purple shapes extend past card edges, display type overlaps illustrations). The floating right-edge pill widget persists across sections. Navigation is a flat transparent top bar — no sticky backdrop, no shadow, no border. Content density is compact: small body text and tight paddings, but the massive display type at 127–158px makes individual sections feel enormous.

## Agent Prompt Guide

primary action: #3d065f (filled action)
Create a Primary Action Button: #3d065f background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Display Type Philosophy

MMPolyVariable is used at 75–158px, almost always weight 400, in Deep Violet (#3d065f) or Midnight Plum (#190066). The ultra-condensed proportions mean a short phrase fills the viewport width; the type never wraps beyond 3 lines. Letter-spacing stays at -0.006em (tight, never loose). Line-height is tight at 1.0–1.16 to let lines stack as a single visual block. Never use this face below 32px — it loses its identity. Never set it in a color other than the violet system or pure black on the cream canvas.

## Accent Color Rotation

Four accent washes rotate through feature cards and illustrations: Lime Wash (#e5ffc3), Lilac Haze (#eac2ff), Apricot (#ffa680), Sky Wash (#cce7ff). Each section picks ONE wash; never mix more than two on a single card. The saturated partners (Acid Lime, Orchid Pop, Periwinkle, Burnt Sienna) are reserved for illustration fills and decorative shapes, never for full surfaces or text.

## Similar Brands

- **Linear** — Same single-canvas approach with one dominant neutral surface, compact type, and pill-shaped dark CTAs
- **Stripe** — Same custom geometric type system, warm off-white canvas, and accent-color washes behind feature content
- **Arc Browser** — Same maximalist display type at 100+ px, warm pastel canvas, and editorial poster-like page compositions
- **Figma Config** — Same playful 3D-illustration-on-pastel-wash approach with display type that breaks out of containers
- **Notion** — Same compact spacing, minimal chrome, and reliance on one or two accent colors to bring energy to an otherwise quiet interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-peach-cream: #fff1eb;
  --color-ink-black: #0a0a0a;
  --color-pure-white: #ffffff;
  --color-cool-mist: #e9edf6;
  --color-slate: #393d46;
  --color-hairline: #c8ceda;
  --color-deep-violet: #3d065f;
  --color-midnight-plum: #190066;
  --color-lime-wash: #e5ffc3;
  --color-acid-lime: #baf24a;
  --color-lilac-haze: #eac2ff;
  --color-orchid-pop: #d075ff;
  --color-sky-wash: #cce7ff;
  --color-periwinkle: #89b0ff;
  --color-apricot: #ffa680;
  --color-burnt-sienna: #661800;

  /* Typography — Font Families */
  --font-mmpolyvariable: 'MMPolyVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mmsansvariable: 'MMSansVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mmeuclidcircularb: 'MMEuclidCircularB', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.19px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.29px;
  --text-heading-lg: 75px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.45px;
  --text-display: 127px;
  --leading-display: 1.05;
  --tracking-display: -0.76px;
  --text-display-xl: 158px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.95px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-32: 32px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 0.989583px;
  --radius-md: 3.95833px;
  --radius-lg: 7.91667px;
  --radius-xl: 11.875px;
  --radius-2xl: 15.8333px;
  --radius-2xl-2: 19.7917px;
  --radius-3xl: 33.151px;
  --radius-3xl-2: 39.5833px;
  --radius-3xl-3: 44.5312px;
  --radius-full: 49.4792px;
  --radius-full-2: 69.2708px;
  --radius-full-3: 98.9583px;
  --radius-full-4: 999px;
  --radius-full-5: 9895.83px;
  --radius-full-6: 9999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 12px;
  --radius-pills: 69px;
  --radius-small: 4px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-peach-canvas: #fff1eb;
  --surface-white-card: #ffffff;
  --surface-cool-mist: #e9edf6;
  --surface-accent-wash: #e5ffc3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-peach-cream: #fff1eb;
  --color-ink-black: #0a0a0a;
  --color-pure-white: #ffffff;
  --color-cool-mist: #e9edf6;
  --color-slate: #393d46;
  --color-hairline: #c8ceda;
  --color-deep-violet: #3d065f;
  --color-midnight-plum: #190066;
  --color-lime-wash: #e5ffc3;
  --color-acid-lime: #baf24a;
  --color-lilac-haze: #eac2ff;
  --color-orchid-pop: #d075ff;
  --color-sky-wash: #cce7ff;
  --color-periwinkle: #89b0ff;
  --color-apricot: #ffa680;
  --color-burnt-sienna: #661800;

  /* Typography */
  --font-mmpolyvariable: 'MMPolyVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mmsansvariable: 'MMSansVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mmeuclidcircularb: 'MMEuclidCircularB', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.19px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.29px;
  --text-heading-lg: 75px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.45px;
  --text-display: 127px;
  --leading-display: 1.05;
  --tracking-display: -0.76px;
  --text-display-xl: 158px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.95px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-32: 32px;

  /* Border Radius */
  --radius-sm: 0.989583px;
  --radius-md: 3.95833px;
  --radius-lg: 7.91667px;
  --radius-xl: 11.875px;
  --radius-2xl: 15.8333px;
  --radius-2xl-2: 19.7917px;
  --radius-3xl: 33.151px;
  --radius-3xl-2: 39.5833px;
  --radius-3xl-3: 44.5312px;
  --radius-full: 49.4792px;
  --radius-full-2: 69.2708px;
  --radius-full-3: 98.9583px;
  --radius-full-4: 999px;
  --radius-full-5: 9895.83px;
  --radius-full-6: 9999px;
}
```
