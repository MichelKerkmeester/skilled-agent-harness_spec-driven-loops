# Genway — Style Reference
> Indigo observatory at lavender dawn — a research terminal floating above a violet mist.

**Theme:** light

Genway operates in a deep-indigo-and-lavender atmosphere: a near-white canvas that dissolves into a vivid violet gradient wash, then returns to paper-white further down the page. The visual language is built on three forces — a single dominant indigo (#0a0449) that owns every headline, a soft lavender gradient (#e2e0f9 → #cfccf5) that provides atmospheric depth, and generous white space that makes both elements feel premium rather than loud. Typography is massive and geometric (Geist Bold at 88px for display with -0.04em tracking), creating a research-terminal authority that contrasts with the dreamy purple wash beneath. Surfaces stay feather-light — white cards with 12-32px radii, hairline violet-tinted borders, and shadows that bleed the brand's own indigo into the canvas rather than using generic gray drops. The overall effect is an AI research workspace that feels both scientifically precise and softly inviting, like a observatory at violet dawn.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Indigo | `linear-gradient(0deg, rgb(10, 4, 73) 0%, rgb(107, 94, 224) 145%)` | `--color-deep-indigo` | Primary brand color, all display headlines, logo, dominant borders — the gravitational center of the system; Dark-to-light gradient — midnight indigo dissolving into vivid violet for dramatic panels |
| Vivid Violet | `linear-gradient(rgba(255, 255, 255) 0%, rgba(107, 94, 224, 0.12) 100%)` | `--color-vivid-violet` | Accent fills, gradient endpoints, decorative highlights, secondary text emphasis; Signature hero gradient — translucent violet dissolving into pure white |
| Midnight Iris | `#0a0163` | `--color-midnight-iris` | Darkest accent, gradient start, heavy emphasis text and fills in dark contexts |
| Slate Lavender | `#706e87` | `--color-slate-lavender` | Body text, muted UI labels, secondary navigation, link borders, ghost button strokes — near-gray with a violet cast |
| Soft Mauve | `#a89fc7` | `--color-soft-mauve` | Shadow tint, filled surface accents, decorative washes — bridges neutral and brand |
| Dusty Rose | `#a085a6` | `--color-dusty-rose` | Secondary muted text, subtle decorative strokes, soft border accents |
| Blush Petal | `#efb9fd` | `--color-blush-petal` | Decorative highlight, soft glow accents, illustration fills |
| Lavender Mist | `#f7f6fd` | `--color-lavender-mist` | Card and elevated surface backgrounds — the quietest off-white with a violet undertone |
| Pure White | `#ffffff` | `--color-pure-white` | Primary page canvas, card surfaces, inverse text on dark backgrounds |
| Ink Black | `#000000` | `--color-ink-black` | Hairline borders, high-frequency structural lines, icon strokes |
| Pale Wisteria | `linear-gradient(rgb(226, 224, 249) 0%, rgb(194, 187, 242) 40%)` | `--color-pale-wisteria` | Gradient surface tone, soft glow backgrounds; Atmospheric gradient — soft lilac into deeper morning-lilac for depth panels |
| Morning Lilac | `#cfccf5` | `--color-morning-lilac` | Gradient surface tone, atmospheric depth washes |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Geist — Primary typeface across the entire system. Geist Bold (weight 600) carries all display and heading sizes from 36-88px with aggressive -0.04em tracking; Geist SemiBold handles subheadings and card titles at 14-36px; Geist Regular flows body and caption text at 10-24px. The geometric precision of Geist pairs with the deep indigo to create a research-terminal feel — the letterforms feel measured and exact, which suits an AI research product. The extreme size range (10px to 88px) is a signature: display headlines at 88px are nearly 9x the smallest text, creating dramatic scale contrast. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 10, 12, 14, 16, 20, 24, 36, 56, 68, 88
- **Line height:** 0.90, 1.00, 1.20, 1.30, 1.50
- **Letter spacing:** -0.04em at 56-88px, -0.02em at 20-36px, -0.01em at 14-16px, -0.04em at 10-12px
- **Role:** Primary typeface across the entire system. Geist Bold (weight 600) carries all display and heading sizes from 36-88px with aggressive -0.04em tracking; Geist SemiBold handles subheadings and card titles at 14-36px; Geist Regular flows body and caption text at 10-24px. The geometric precision of Geist pairs with the deep indigo to create a research-terminal feel — the letterforms feel measured and exact, which suits an AI research product. The extreme size range (10px to 88px) is a signature: display headlines at 88px are nearly 9x the smallest text, creating dramatic scale contrast.

### Geist Regular — Geist Regular — detected in extracted data but not described by AI · `--font-geist-regular`
- **Weights:** 400
- **Sizes:** 10px, 12px, 14px, 16px, 20px, 24px
- **Line height:** 1.2, 1.3, 1.5
- **Letter spacing:** -0.04, -0.02
- **Role:** Geist Regular — detected in extracted data but not described by AI

### Geist SemiBold — Geist SemiBold — detected in extracted data but not described by AI · `--font-geist-semibold`
- **Weights:** 400
- **Sizes:** 14px, 16px, 24px, 36px
- **Line height:** 1.2, 1.3, 1.5
- **Letter spacing:** -0.02, -0.01
- **Role:** Geist SemiBold — detected in extracted data but not described by AI

### Geist Bold — Geist Bold — detected in extracted data but not described by AI · `--font-geist-bold`
- **Weights:** 400
- **Sizes:** 56px, 68px, 88px
- **Line height:** 0.9, 1
- **Letter spacing:** -0.04
- **Role:** Geist Bold — detected in extracted data but not described by AI

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| body-lg | 20px | 1.3 | -0.4px | `--text-body-lg` |
| subheading | 24px | 1.3 | -0.48px | `--text-subheading` |
| heading-sm | 36px | 1.2 | -0.72px | `--text-heading-sm` |
| heading | 56px | 1 | -2.24px | `--text-heading` |
| heading-lg | 68px | 1 | -2.72px | `--text-heading-lg` |
| display | 88px | 0.9 | -3.52px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 124 | 124px | `--spacing-124` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 200px |
| avatars | 9999px |
| buttons | 8px |
| largeCards | 32px |
| smallElements | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(10, 1, 99, 0.4) 0px 8px 16px -10px` | `--shadow-md` |
| subtle | `rgba(10, 1, 99, 0.08) 0px 0px 0px 4px` | `--shadow-subtle` |
| sm | `rgba(4, 0, 41, 0.1) 0px 1px 8px 0px inset` | `--shadow-sm` |
| sm-2 | `rgba(11, 1, 101, 0.14) 1px 0px 8px 0px inset` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Minimal header

White/transparent background, logo left in Deep Indigo (#0a0449) at 16px SemiBold, three text links right-aligned (About, Blog, Login) in Slate Lavender (#706e87) at 14px Regular. No background fill, no shadow, no border — the nav is invisible until you look for it, letting the hero own attention. Height ~64px, full-width with inner max-width 1200px.

### Display Headline
**Role:** Hero title

Geist Bold at 88px, line-height 0.90, letter-spacing -3.52px (-0.04em), color Deep Indigo (#0a0449). The extremely tight line-height (0.9) and aggressive tracking create a dense, commanding block of type. Maximum 2 lines. No gradient text — the indigo is solid and absolute.

### Hero Subheadline
**Role:** Supporting hero text

16-18px Geist Regular, line-height 1.5, color Slate Lavender (#706e87). Centered beneath the display headline, max-width ~600px. Quiet by design — the headline shouts, the subhead whispers.

### Gradient Wash Section
**Role:** Atmospheric section background

Full-width band with vertical gradient from Lavender Mist (#f7f6fd) at top through Pale Wisteria (#e2e0f9) to Morning Lilac (#cfccf5) at bottom, or a violet wash using rgba(105, 92, 224, 0.2) → #cfccf5. No border, no shadow — the gradient IS the visual element. Content sits on top with white or light text.

### Numbered Step Card
**Role:** Process step indicator

Three-column card on the gradient. Number badge (01/02/03) in a 200px-radius circle, 48-56px diameter, white text on translucent white/lavender fill. Title at 20-24px SemiBold in white. Description at 14px Regular in white at 80% opacity. No card border or background — the cards are text compositions floating on the gradient.

### Client Logo Strip
**Role:** Social proof band

Horizontal row of 6-7 grayscale logos on the gradient wash, evenly spaced, Slate Lavender (#706e87) or 40% white. Logos are rendered as simple wordmarks or icon+text marks. No borders, no cards — the logos breathe directly on the gradient.

### Two-Tone Section Heading
**Role:** Section title with hierarchy contrast

Two stacked lines: first line in Soft Mauve (#a89fc7) or Slate Lavender at 36-56px, second line in Deep Indigo (#0a0449) at 36-56px Geist Bold. The color shift between lines creates an emphasis pattern without changing weight. Example structure: 'Conducted by AI' (muted) / 'Loved by humans' (bold indigo).

### Product Preview Card
**Role:** Dashboard or UI screenshot frame

White (#ffffff) card with 16-32px radius, 1px border in rgba(10, 1, 99, 0.08), and the signature violet-tinted shadow: rgba(10, 1, 99, 0.4) 0px 8px 16px -10px. Internal content is a full product UI mockup (sidebar nav, project cards, avatars). 32px internal padding. The violet-tinted shadow is critical — it makes even the drop shadow feel on-brand.

### Chat Interface Card
**Role:** AI conversation mockup

White card with 12-16px radius, containing chat bubbles alternating left/right. User bubbles: Lavender Mist (#f7f6fd) background, Slate Lavender text. AI bubbles: white with Deep Indigo text, accompanied by small icon avatars at 9999px radius. Cards float on the gradient with subtle 4px violet-tinted ring shadow: rgba(10, 1, 99, 0.08) 0px 0px 0px 4px.

### Quote Chip
**Role:** Testimonial snippet

Pill-shaped container (200px radius), Lavender Mist (#f7f6fd) or white fill, 12-16px horizontal padding, 8-12px vertical padding. Text at 14px Regular in Slate Lavender (#706e87). No border, no shadow. Arranged in a horizontal row of 2-3 chips.

### Outline Action Button
**Role:** Secondary/ghost action

8px radius, 1px border in Slate Lavender (#706e87), transparent fill, text in Slate Lavender or Deep Indigo at 14px SemiBold. Padding 10px 20px. No shadow, no fill — a text-first action that feels light and non-committal. Used for navigation-like actions (Login, secondary CTAs).

### Feature Card
**Role:** Content card on light surface

White or Lavender Mist (#f7f6fd) background, 12px radius, 1px hairline border in rgba(10, 1, 99, 0.08) or transparent. 24-32px padding. Title at 16-20px SemiBold in Deep Indigo. Body at 14px Regular in Slate Lavender. No shadow on light surfaces — elevation comes from background contrast and hairline borders.

### Floating UI Element
**Role:** Decorative product mockup chip

Small white card (200x80px range) with 12px radius, positioned absolutely over the gradient as a floating accent. Contains simplified UI elements (text, icons, small avatars). Slight rotation (-2 to 2 degrees) for organic feel. Uses the same violet-tinted shadow.

## Do's and Don'ts

### Do
- Use Deep Indigo (#0a0449) for all display headlines and primary text — it is the only chromatic text color that matters at the heading level
- Apply the violet-tinted shadow rgba(10, 1, 99, 0.4) 0px 8px 16px -10px for all elevated cards; never use neutral gray shadows
- Set display headlines at 88px with -3.52px letter-spacing and 0.9 line-height — the extreme density is the signature
- Use the Lavender Mist (#f7f6fd) surface for cards that need to separate from pure white without adding visual weight
- Build atmospheric depth with the lavender gradient washes (#e2e0f9 → #cfccf5) rather than solid colored backgrounds
- Keep body text in Slate Lavender (#706e87), never pure gray — the violet cast ties text to the brand palette
- Use 8px and 32px as the two anchor card radii — 8px for compact elements, 32px for hero content cards

### Don't
- Don't use a separate blue or teal accent — indigo IS the brand color; introducing another hue dilutes the system
- Don't use neutral gray shadows like rgba(0, 0, 0, 0.1) — every shadow should bleed the brand's indigo
- Don't set display headlines below 56px or above 88px — the scale contrast is what creates impact
- Don't use line-height above 1.0 for display sizes — the tight leading (0.9) is essential to the type's density
- Don't fill backgrounds with solid vivid violet (#6b5ee0) — it should only appear as gradient endpoint, accent fill, or text
- Don't add borders thicker than 1px — the system relies on hairline violet-tinted lines, never heavy rules
- Don't use pure black (#000000) for text — Deep Indigo (#0a0449) reads as softer while maintaining maximum contrast

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas White | `#ffffff` | Primary page background — the starting surface for all content |
| 2 | Lavender Mist | `#f7f6fd` | Elevated card surface — the quietest off-white for separating content from the canvas |
| 3 | Gradient Wash | `#cfccf5` | Atmospheric section backgrounds — lavender gradient creating visual depth bands |
| 4 | Vivid Violet | `#6b5ee0` | Accent surface for highlights, gradient endpoints, and interactive emphasis |
| 5 | Deep Indigo | `#0a0449` | Dark surface for inverted panels and maximum-emphasis containers |

## Elevation

- **Product Preview Card:** `rgba(10, 1, 99, 0.4) 0px 8px 16px -10px`
- **Chat Interface Card:** `rgba(10, 1, 99, 0.08) 0px 0px 0px 4px`
- **Floating UI Element:** `rgba(10, 1, 99, 0.4) 0px 8px 16px -10px`

## Imagery

No photography — the visual language is entirely product-screenshot and UI-mockup based. Product cards show actual interface previews (dashboards, chat windows, project lists) with real data placeholders. Decorative floating UI elements (small cards, chips, avatars) are arranged at slight rotations over the gradient washes to create depth. Avatars are circular (9999px radius) with solid color fills or simple gradient backgrounds. Icons appear to be simple line-art or filled geometric shapes in Deep Indigo or Slate Lavender. The chat mockups show conversational AI exchanges with message bubbles, creating a sense of the product in action without needing screenshots of real users.

## Layout

Full-width sections with max-width 1200px inner content. The hero is a vertically split composition: top half is white space with a centered display headline and subhead, then the bottom half transitions into a violet gradient wash that fills the viewport. Content on the gradient is centered and white-on-violet. Below the hero, the page returns to white with a soft lavender radial glow behind section headings. Sections are separated by 96px gaps with generous vertical breathing room. Cards and product mockups are centered, typically in a 3-column grid for step indicators and single-column for hero product showcases. The navigation is minimal — just a logo and three text links, no mega-menu, no sticky header visible. The overall density is airy: 60% white space, compact only within card internals.

## Agent Prompt Guide

## Quick Color Reference
- Primary text: #0a0449 (Deep Indigo)
- Background: #ffffff (Canvas White)
- Surface (cards): #f7f6fd (Lavender Mist)
- Border: rgba(10, 1, 99, 0.08) or 1px solid #706e87
- Accent: #6b5ee0 (Vivid Violet)
- Muted text: #706e87 (Slate Lavender)
- primary action: no distinct CTA color

## 3-5 Example Component Prompts

1. **Display Headline Section**: White background. Headline: 88px Geist Bold, #0a0449, letter-spacing -3.52px, line-height 0.9. Subhead: 16px Geist Regular, #706e87, line-height 1.5, max-width 600px centered. 96px vertical padding above and below.

2. **Gradient Hero Band**: Full-width section with linear-gradient(#f7f6fd 0%, #e2e0f9 50%, #cfccf5 100%). Three step cards in a row: each with a 200px-radius circle badge (48px) showing '01'/'02'/'03' in white SemiBold, title 20px SemiBold in white, description 14px Regular in white at 80% opacity. 32px gap between cards, centered.

3. **Product Preview Card**: White card, 32px radius, 32px padding, border 1px solid rgba(10, 1, 99, 0.08), shadow rgba(10, 1, 99, 0.4) 0px 8px 16px -10px. Internal sidebar nav with Geist Regular 14px in #706e87. Main content area with project cards (white, 12px radius, Lavender Mist background #f7f6fd).

4. **Two-Tone Section Heading**: Centered stack. First line: 56px Geist Bold, #a89fc7 (Soft Mauve). Second line: 56px Geist Bold, #0a0449 (Deep Indigo). 8px gap between lines. Followed by quote chips in a row: 200px radius pills, #f7f6fd background, 14px Geist Regular in #706e87, 12px vertical and 16px horizontal padding.

5. **Outline Action Button**: 8px radius, 1px border #706e87, transparent fill, text 14px Geist SemiBold in #0a0449, padding 10px 20px. No shadow. Use for secondary navigation actions in the top bar.

## Similar Brands

- **Linear** — Same compact Geist-family typography with aggressive negative tracking on display sizes, hairline borders, and deep dark-on-light text hierarchy
- **Vercel** — Shares the Geist typeface origin and the minimalist approach where gradient washes replace solid colored sections as atmospheric depth
- **Resend** — Same light-canvas + single bold accent + oversized display type philosophy with tight letter-spacing and airy section spacing
- **Perplexity** — Similar AI-product feel with indigo/purple as the primary chromatic identity and product mockups floating on gradient backgrounds
- **Anthropic** — Same restrained color palette where a single deep hue carries all brand weight, with warm gradient washes providing the only atmospheric color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-indigo: #0a0449;
  --gradient-deep-indigo: linear-gradient(0deg, rgb(10, 4, 73) 0%, rgb(107, 94, 224) 145%);
  --color-vivid-violet: #6b5ee0;
  --gradient-vivid-violet: linear-gradient(rgba(255, 255, 255) 0%, rgba(107, 94, 224, 0.12) 100%);
  --color-midnight-iris: #0a0163;
  --color-slate-lavender: #706e87;
  --color-soft-mauve: #a89fc7;
  --color-dusty-rose: #a085a6;
  --color-blush-petal: #efb9fd;
  --color-lavender-mist: #f7f6fd;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-pale-wisteria: #e2e0f9;
  --gradient-pale-wisteria: linear-gradient(rgb(226, 224, 249) 0%, rgb(194, 187, 242) 40%);
  --color-morning-lilac: #cfccf5;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-regular: 'Geist Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-semibold: 'Geist SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-bold: 'Geist Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -2.24px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.72px;
  --text-display: 88px;
  --leading-display: 0.9;
  --tracking-display: -3.52px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-124: 124px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 50px;
  --radius-full-2: 120px;
  --radius-full-3: 200px;
  --radius-full-4: 2000px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 200px;
  --radius-avatars: 9999px;
  --radius-buttons: 8px;
  --radius-largecards: 32px;
  --radius-smallelements: 8px;

  /* Shadows */
  --shadow-md: rgba(10, 1, 99, 0.4) 0px 8px 16px -10px;
  --shadow-subtle: rgba(10, 1, 99, 0.08) 0px 0px 0px 4px;
  --shadow-sm: rgba(4, 0, 41, 0.1) 0px 1px 8px 0px inset;
  --shadow-sm-2: rgba(11, 1, 101, 0.14) 1px 0px 8px 0px inset;

  /* Surfaces */
  --surface-canvas-white: #ffffff;
  --surface-lavender-mist: #f7f6fd;
  --surface-gradient-wash: #cfccf5;
  --surface-vivid-violet: #6b5ee0;
  --surface-deep-indigo: #0a0449;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-indigo: #0a0449;
  --color-vivid-violet: #6b5ee0;
  --color-midnight-iris: #0a0163;
  --color-slate-lavender: #706e87;
  --color-soft-mauve: #a89fc7;
  --color-dusty-rose: #a085a6;
  --color-blush-petal: #efb9fd;
  --color-lavender-mist: #f7f6fd;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-pale-wisteria: #e2e0f9;
  --color-morning-lilac: #cfccf5;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-regular: 'Geist Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-semibold: 'Geist SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-bold: 'Geist Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.72px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -2.24px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.72px;
  --text-display: 88px;
  --leading-display: 0.9;
  --tracking-display: -3.52px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-124: 124px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 50px;
  --radius-full-2: 120px;
  --radius-full-3: 200px;
  --radius-full-4: 2000px;

  /* Shadows */
  --shadow-md: rgba(10, 1, 99, 0.4) 0px 8px 16px -10px;
  --shadow-subtle: rgba(10, 1, 99, 0.08) 0px 0px 0px 4px;
  --shadow-sm: rgba(4, 0, 41, 0.1) 0px 1px 8px 0px inset;
  --shadow-sm-2: rgba(11, 1, 101, 0.14) 1px 0px 8px 0px inset;
}
```
