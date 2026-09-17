# Duna — Style Reference
> Sunset watercolor on warm marble — a single painted landscape over a quiet, editorial compliance document.

**Theme:** light

Duna is a monochromatic editorial canvas warmed by a single illustrated sunset landscape — the interface stays nearly 99% achromatic, with a deep aubergine-black as both text and primary action color, replacing the blue/green convention of fintech. Components are soft and pillowy: heavily rounded corners (24px on cards and images, 999px on buttons), generous breathing room, and almost no shadow — elevation is built from hairline borders and contrast alone. The hero watercolor is the only moment of color saturation in the system, a deliberate artistic peak that frames an otherwise quiet, confident, document-like surface. Typography is GT America at restrained weights with aggressive negative tracking on display sizes, giving headlines a compressed, editorial feel rather than the wide, friendly SaaS look.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine Ink | `#1b0624` | `--color-aubergine-ink` | Primary text, heading borders, and brand character — the slight warm-purple undertone replaces conventional near-black, giving Duna a distinctive almost-black that is neither pure black nor navy |
| Espresso | `#160f0c` | `--color-espresso` | Primary action fill — filled buttons (Get started, Schedule a demo). Slightly warmer and darker than Aubergine Ink, used exclusively for interactive surfaces that need to feel pressed-into the page |
| Warm Ash | `#766a7c` | `--color-warm-ash` | Muted secondary text and subtle borders — a desaturated warm gray that softens long-form copy without competing with the primary text |
| Graphite | `#444444` | `--color-graphite` | Body text variant, icon strokes, input borders — the workhorse neutral for non-heading content |
| Stone | `#898683` | `--color-stone` | Tertiary text and dividers — a lighter warm gray for labels, metadata, and less important copy |
| Onyx | `#0d0d0d` | `--color-onyx` | Icon fills and select text instances — the deepest near-black in the scale, reserved for graphic emphasis |
| Smoke | `#1a1816` | `--color-smoke` | Icon borders, card edge cases, and dark UI elements — a warm-tinted dark for graphical components |
| Charcoal | `#292421` | `--color-charcoal` | Heading borders and dark decorative fills — a warm brown-black for borders on headings and subtle structural elements |
| Paper White | `#ffffff` | `--color-paper-white` | Primary surface — cards, buttons, and the dominant page background |
| Linen | `#f7f7f5` | `--color-linen` | Warm canvas background — the off-white page tint that gives the entire system its warm, paper-like atmosphere instead of clinical pure white |
| Bone | `#edece7` | `--color-bone` | Card surfaces and subtle elevated panels — a barely-warm cream for cards sitting on the Linen canvas |
| Mist | `#eeeeee` | `--color-mist` | Input field background — the only functional surface tint that signals a fillable area |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### GT America — Primary typeface across all UI — body at 400, emphasis at 500, display at 400 with aggressive negative tracking. The compressed, geometric forms at large sizes give headlines an editorial, almost legal-document authority rather than the typical rounded SaaS friendliness. · `--font-gt-america`
- **Substitute:** Inter, Söhne, or Suisse Int'l
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 18, 20, 24, 32, 40, 44, 72, 80
- **Line height:** 1.00–1.76
- **Letter spacing:** -0.06em at 72-80px display, -0.05em at 44px, -0.03em at 32px, -0.02em at 24px, -0.01em at 20px, normal below 18px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11", "tnum", "zero"`
- **Role:** Primary typeface across all UI — body at 400, emphasis at 500, display at 400 with aggressive negative tracking. The compressed, geometric forms at large sizes give headlines an editorial, almost legal-document authority rather than the typical rounded SaaS friendliness.

### GT America Regular — GT America Regular — detected in extracted data but not described by AI · `--font-gt-america-regular`
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px, 44px, 72px
- **Line height:** 1, 1.1, 1.2, 1.3, 1.4, 1.5
- **Letter spacing:** -0.06, -0.05, -0.03, -0.02, -0.01, -0.006, 0.02
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** GT America Regular — detected in extracted data but not described by AI

### GT America Trial Rg — GT America Trial Rg — detected in extracted data but not described by AI · `--font-gt-america-trial-rg`
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.5, 1.6, 1.71
- **Role:** GT America Trial Rg — detected in extracted data but not described by AI

### GT America Trial Md — GT America Trial Md — detected in extracted data but not described by AI · `--font-gt-america-trial-md`
- **Weights:** 400, 500
- **Sizes:** 17px, 80px
- **Line height:** 1, 1.76
- **Letter spacing:** -0.012
- **OpenType features:** `"tnum", "zero"`
- **Role:** GT America Trial Md — detected in extracted data but not described by AI

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 12px, 14px
- **Line height:** 1.2, 1.5
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 12px | 1.2 | — | `--text-micro` |
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.6 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| body-lg | 20px | 1.4 | -0.2px | `--text-body-lg` |
| subheading | 24px | 1.3 | -0.48px | `--text-subheading` |
| heading | 32px | 1.2 | -0.96px | `--text-heading` |
| heading-lg | 44px | 1.1 | -2.2px | `--text-heading-lg` |
| display | 72px | 1 | -4.32px | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 140 | 140px | `--spacing-140` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 999px |
| images | 24px |
| inputs | 8px |
| buttons | 999px |
| large-buttons | 60px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 16px

## Components

### Navigation Bar
**Role:** Top-level site navigation

White background, 64-72px tall, logo (asterisk mark + DUNA wordmark) on the left, centered text links (Product, Customers, Company, Resources) at 14-16px in Charcoal, and a dark filled pill CTA ('Schedule a demo') on the right. No border, no shadow — sits directly on the Linen canvas.

### Hero Illustrated Landscape
**Role:** Full-bleed hero artwork

A painted watercolor sunset scene (warm oranges, pinks, greens, distant mountains, water reflection) that fills the viewport and bleeds into the white section below. The illustration is the only color saturation in the system — it functions as the brand's emotional moment and should never be replicated as a UI accent.

### Hero Headline
**Role:** Primary page headline

72-80px GT America weight 400 in Aubergine Ink, centered, with letter-spacing -0.06em and line-height 1.00. The extreme negative tracking at this size is signature — the letters almost touch, creating a compressed, authoritative block of text.

### Announcement Pill
**Role:** Editorial tag above hero

Small dark pill (999px radius) with white text at 12-14px, sitting centered above the hero headline. Used for news, funding announcements, or feature launches.

### Primary Filled Button
**Role:** Main call-to-action

Espresso (#160f0c) background, white text at 14-16px GT America weight 400, 999px pill radius, 10-12px vertical padding with 18-24px horizontal padding. No shadow, no border. Used for 'Get started' and 'Schedule a demo'.

### Large Pill Button
**Role:** Hero-scale primary action

Variant of the primary button with 60px border-radius (deeply rounded rectangle rather than full pill), 20-24px vertical padding. Used for the most prominent hero CTA where a full pill would feel too small.

### Ghost/Outlined Button
**Role:** Secondary action or dismiss

White or transparent background, 1px border in Graphite or Stone, dark text, 999px radius, matching padding to filled variant. Used for the cookie 'Okay' button and other low-emphasis dismissals.

### Customer Logo Bar
**Role:** Social proof strip

Horizontal row of 6-7 grayscale customer logos (Plaid, Svea, Mews, Moss, CCV, Fiserv) at uniform height, evenly spaced, rendered in Stone or Graphite monochrome — never in their original brand colors.

### Stat Display
**Role:** Large metric with label

Oversized number (6.2x, 22%, 2.8x) at 72-80px GT America weight 400 in Aubergine Ink with tight tracking, paired with a small caption label (14px, Stone) below. Three-up layout in a row.

### Feature Card
**Role:** Product capability block

White card on Linen canvas, 16px radius, 24-32px internal padding, small line-icon at top, bold heading, description text. Separated from neighboring cards by white space alone — no shadow, no visible border.

### Cookie Banner
**Role:** Compliance/consent notice

Small floating panel, bottom-right, white background, subtle border, 12-16px radius, short text + ghost 'Okay' button. Minimal footprint — never full-width or modal.

### Input Field
**Role:** Form input

Mist (#eeeeee) background, 8px radius, 1px border in Graphite or Stone, 16px text in Aubergine Ink. No focus glow — focus state is a border color shift to Espresso. No shadow at any state.

### Logo Mark
**Role:** Brand identifier

Asterisk/star glyph (✱) followed by 'DUNA' wordmark in GT America weight 500, Aubergine Ink. The asterisk is the distinctive brand mark — simple, geometric, non-decorative.

## Do's and Don'ts

### Do
- Use Espresso (#160f0c) as the only filled button color — never introduce blue, green, or saturated brand colors for actions
- Set display headlines at 72-80px with letter-spacing -0.06em — the compressed tracking at scale is the system's editorial signature
- Use Linen (#f7f7f5) as the page canvas, not pure white — the warm off-white atmosphere is load-bearing for the system's mood
- Apply 999px radius to all interactive buttons and tags — pill-shaped controls are non-negotiable
- Enable GT America font features ("blwf", "cv03", "cv04", "cv09", "cv11") when the custom font is available — they define the typeface's character
- Keep the entire interface 99% achromatic — let the hero illustration be the single moment of color saturation
- Use 16-24px radius on all cards and images — soft, generous rounding is structural, not decorative

### Don't
- Don't introduce a blue or green accent — the warm aubergine-black replaces conventional fintech blue
- Don't add drop shadows beyond the 1px inset ring — elevation is built from borders and background tint, not shadows
- Don't use sharp corners on buttons or cards — anything below 8px radius breaks the system's softness
- Don't use the hero illustration's sunset colors as UI accent colors — those colors belong only to the artwork
- Don't use display-size tracking on body text — letter-spacing -0.06em only works at 44px+
- Don't fill the page with multiple colored sections — Duna is monochromatic with warm neutrals, not multi-colored
- Don't use icon libraries with rounded, friendly iconography — use thin-stroke, geometric line icons that match GT America's tone

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Linen Canvas | `#f7f7f5` | Primary page background — the warm off-white that gives the entire system its paper-like atmosphere |
| 2 | Paper Card | `#ffffff` | Card surfaces, elevated panels, and button fills |
| 3 | Bone Panel | `#edece7` | Subtle surface variation for nested cards or sectioned panels |

## Elevation

Duna uses almost no shadow. The single detected elevation is a 1px inset ring at rgba(0,0,0,0.05) on cards — this hairline border IS the elevation system. Components are separated by white space, borders, and background tint shifts rather than drop shadows. This keeps the interface feeling flat, editorial, and document-like.

## Imagery

Imagery is dominated by a single full-bleed watercolor illustration in the hero: a warm sunset landscape with distant mountains, a reflective water body, green meadow foreground, and pink-orange sky. This is the only color in the system and should never be repeated as UI accents. Below the hero, imagery is product-screenshot-free and icon-driven — thin-stroke geometric line icons in Charcoal sit atop white cards. Customer logos appear as grayscale monochrome strips. There is no photography, no 3D renders, no stock imagery. The visual language is: one painted landscape moment, then pure editorial UI.

## Layout

The page uses a max-width 1200px centered column on a full-bleed Linen canvas. The hero breaks the container entirely with a full-viewport illustrated landscape that fades to white, containing a centered headline stack (announcement pill, 72px headline, subtext, CTA). Below the fold, sections alternate between white card surfaces on the Linen canvas and pure Linen sections with no container. A customer logo bar sits as a horizontal strip. A stats section uses a three-column row of oversized metrics. Feature cards appear in a three-column grid. Navigation is a flat top bar (not sticky in the data shown). Vertical rhythm is generous: 80-120px between major sections, creating a document-like, unhurried reading pace. No sidebar, no mega-menu, no dark sections.

## Agent Prompt Guide

**Quick Color Reference**
- Text/heading: #1b0624 (Aubergine Ink)
- Background canvas: #f7f7f5 (Linen)
- Card surface: #ffffff (Paper White)
- Border: #444444 (Graphite) or #898683 (Stone)
- primary action: #160f0c (filled action)
- Create a Primary Action Button: #160f0c background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

**Example Component Prompts**

1. *Hero Section*: Full-bleed watercolor sunset illustration as background. Centered stack: announcement pill (Espresso #160f0c bg, white 12px text, 999px radius, 6px 12px padding), then 72px GT America weight 400 headline in Aubergine Ink with letter-spacing -4.32px, then 18px body subtext in Stone, then a 60px-radius Espresso filled button ('Get started', white text, 20px 28px padding).

2. *Stat Block*: Three-column row on Linen canvas. Each stat: 72px GT America weight 400 number in Aubergine Ink with -4.32px tracking, 14px caption in Stone below. No dividers, no card containers.

3. *Feature Card*: White (#ffffff) card on Linen canvas, 16px radius, 32px internal padding. 24px thin-stroke line icon in Charcoal at top-left. 24px GT America weight 500 heading in Aubergine Ink. 16px body text in Graphite below. No shadow, no border.

4. *Navigation Bar*: White background, 72px tall. Asterisk mark + 'DUNA' wordmark (GT America 500, Aubergine Ink) on the left. Centered nav links at 14px GT America 400 in Charcoal. Right-aligned: Espresso filled pill button ('Schedule a demo', 999px radius, 10px 18px padding, white text).

5. *Cookie Banner*: Fixed bottom-right, white background, 12px radius, 1px Graphite border, 16px text in Graphite, ghost 'Okay' button (1px Graphite border, 999px radius, 10px 16px padding, dark text).

## Similar Brands

- **Linear** — Same near-black text on warm off-white canvas with pill-shaped buttons and aggressively tight letter-spacing on large display headlines
- **Mercury** — Same warm-cream canvas, pill buttons, and absence of saturated accent colors — both fintech brands that use nearly-monochromatic editorial systems
- **Vercel** — Same document-like restraint, 24px+ card radii, and the confidence to leave the interface nearly colorless with one illustration moment
- **Stripe** — Same GT America-adjacent geometric sans-serif and the convention of using near-black with a warm cast rather than navy or blue for a fintech brand
- **Plaid** — Same compliance/fintech space, same editorial confidence, and similar restraint in avoiding decorative color on core UI surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine-ink: #1b0624;
  --color-espresso: #160f0c;
  --color-warm-ash: #766a7c;
  --color-graphite: #444444;
  --color-stone: #898683;
  --color-onyx: #0d0d0d;
  --color-smoke: #1a1816;
  --color-charcoal: #292421;
  --color-paper-white: #ffffff;
  --color-linen: #f7f7f5;
  --color-bone: #edece7;
  --color-mist: #eeeeee;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-regular: 'GT America Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-trial-rg: 'GT America Trial Rg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-trial-md: 'GT America Trial Md', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.2;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.2px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.96px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -4.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-140: 140px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 60px;
  --radius-full-2: 99px;
  --radius-full-3: 799px;
  --radius-full-4: 959px;
  --radius-full-5: 999px;
  --radius-full-6: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 999px;
  --radius-images: 24px;
  --radius-inputs: 8px;
  --radius-buttons: 999px;
  --radius-large-buttons: 60px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-linen-canvas: #f7f7f5;
  --surface-paper-card: #ffffff;
  --surface-bone-panel: #edece7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine-ink: #1b0624;
  --color-espresso: #160f0c;
  --color-warm-ash: #766a7c;
  --color-graphite: #444444;
  --color-stone: #898683;
  --color-onyx: #0d0d0d;
  --color-smoke: #1a1816;
  --color-charcoal: #292421;
  --color-paper-white: #ffffff;
  --color-linen: #f7f7f5;
  --color-bone: #edece7;
  --color-mist: #eeeeee;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-regular: 'GT America Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-trial-rg: 'GT America Trial Rg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-trial-md: 'GT America Trial Md', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.2;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.2px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.96px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -4.32px;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-140: 140px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 60px;
  --radius-full-2: 99px;
  --radius-full-3: 799px;
  --radius-full-4: 959px;
  --radius-full-5: 999px;
  --radius-full-6: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;
}
```
