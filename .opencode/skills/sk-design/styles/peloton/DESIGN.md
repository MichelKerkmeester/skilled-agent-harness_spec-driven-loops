# Peloton — Style Reference
> Red beacon on charcoal runway. A fitness showroom where one electric red CTA cuts through vast dark exhibition space into clean white product galleries.

**Theme:** mixed

Peloton runs a disciplined two-mode visual system: cinematic charcoal hero surfaces that make product photography glow, followed by bright white product grids that let the merchandise speak. The palette is almost entirely achromatic — gunmetal, white, and warm grays — with one vivid red accent that acts as the only chromatic punctuation on the page, reserved exclusively for primary actions, brand marks, and the persistent chat widget. Inter carries the entire typographic voice at a wide range of weights, from whisper-light 300 display headlines to confident 500 nav labels, creating a calm, premium fitness-retail atmosphere. Components are generous: 28px pill buttons, 6px inputs, 24px image corners, and minimal elevation — surfaces do the structural work, shadows stay absent or near-invisible.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Peloton Red | `#df1c2f` | `--color-peloton-red` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Carbon Black | `#181a1d` | `--color-carbon-black` | Primary text color, dark hero surfaces, navigation bar, footer backgrounds, heading color — the structural anchor of the entire system |
| Pure White | `#ffffff` | `--color-pure-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Mist Gray | `#f7f7f7` | `--color-mist-gray` | Page canvas, subtle section backgrounds behind product grids, alternate band separator |
| Silver Lining | `#e4e6e7` | `--color-silver-lining` | Hairline borders, dividers between sections, card outlines, disabled surface fills, icon background washes |
| Slate | `#65666a` | `--color-slate` | Secondary body text, nav link default state, helper text, metadata, breadcrumb separators |
| Graphite | `#000000` | `--color-graphite` | Headings on light surfaces, logo, strong emphasis text, icon strokes on light backgrounds |
| Fog | `#a8acb1` | `--color-fog` | Tertiary text, placeholder text, subtle icon fills, inactive form labels, decorative icon strokes |
| Steel | `#888b93` | `--color-steel` | Input borders in default state, secondary borders, subtle structural lines |
| Ash | `#a3a3a6` | `--color-ash` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |

## Tokens — Typography

### Inter — Sole typeface across the entire system. Weight 300 at 48px for hero headlines creates an editorial, gallery-like restraint — the opposite of the shouting-bold approach typical of fitness brands. Weight 500–600 for navigation and CTAs gives interaction labels confident authority. Weight 400 carries all body copy. Tighter tracking (-0.008em to -0.004em) at larger sizes sharpens the geometric Inter forms for display use, while the positive +0.025em at 12px opens up micro-labels for legibility. · `--font-inter`
- **Substitute:** Inter (Google Fonts), or system-ui / -apple-system fallback stack
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 12, 14, 15, 16, 18, 20, 26, 32, 36, 48
- **Line height:** 1.07, 1.20, 1.25, 1.30, 1.33, 1.38, 1.39, 1.50, 1.69, 1.71
- **Letter spacing:** -0.0080em, -0.0060em, -0.0040em, 0.0250em
- **Role:** Sole typeface across the entire system. Weight 300 at 48px for hero headlines creates an editorial, gallery-like restraint — the opposite of the shouting-bold approach typical of fitness brands. Weight 500–600 for navigation and CTAs gives interaction labels confident authority. Weight 400 carries all body copy. Tighter tracking (-0.008em to -0.004em) at larger sizes sharpens the geometric Inter forms for display use, while the positive +0.025em at 12px opens up micro-labels for legibility.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.69 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.38 | — | `--text-subheading` |
| heading-sm | 26px | 1.33 | -0.104px | `--text-heading-sm` |
| heading | 32px | 1.3 | -0.192px | `--text-heading` |
| heading-lg | 36px | 1.25 | -0.288px | `--text-heading-lg` |
| display | 48px | 1.2 | -0.384px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 84 | 84px | `--spacing-84` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 24px |
| pills | 204px |
| images | 6px |
| inputs | 6px |
| buttons | 28px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary Action Button
**Role:** Filled red CTA used for purchase paths, explore actions, and form submission

Background Peloton Red (#df1c2f), white text, Inter weight 500, 16px size, 28px border-radius, 16px vertical × 24px horizontal padding, 8px horizontal gap between text and optional icon. No border. Hover deepens the red slightly. The 28px radius gives the button a generous pill-like softness without being fully circular.

### Secondary Ghost Button
**Role:** Outlined action paired with the primary CTA for non-conversion exploration

Transparent background, 1.5px border in currentColor (white on dark surfaces, Carbon Black on light), 28px border-radius, same padding as primary (16px × 24px), Inter weight 500 16px. Inherits text color from its surface — appears white on dark heroes, black on light sections.

### Product Card
**Role:** Equipment tile in the product lineup grid and merchandising blocks

White (#ffffff) surface on Mist Gray (#f7f7f7) page background, 24px padding or product-image bleed with label strip below, 24px border-radius on image, no shadow. Product image fills upper area at 6px corner radius; label area below uses Carbon Black heading at 20px weight 500 and Slate subtext at 14px.

### Navigation Bar
**Role:** Sticky top-level site navigation

Full-width Carbon Black (#181a1d) bar, 16px vertical padding, PELOTON wordmark at left in white at 16px weight 600 with generous letter-spacing. Center nav links in white Inter 14px weight 500 with dropdown carets; right side holds account icon and cart icon. No visible border between nav and hero — dark surface continues.

### Hero Section
**Role:** Full-bleed dark band carrying the primary campaign message

Carbon Black background fills the full viewport width and substantial height. Centered text stack: display headline at 48px Inter weight 300 white with -0.384px tracking, supporting line at 18px weight 400 white at 70% opacity, micro-label at 14px weight 500 white. Product photography sits in low-key lighting beneath the text. Two CTAs sit side-by-side centered: one filled red primary, one ghost outline.

### Form Input
**Role:** Text entry fields in signup, checkout, and account flows

White background, 1px Steel (#888b93) border, 6px border-radius, 12px vertical × 16px horizontal padding, Inter 15px weight 400 Carbon Black text. Placeholder in Fog (#a8acb1). Focus state shifts border to Peloton Red with a subtle outer ring at rgba(223,28,47,0.15).

### Section Header
**Role:** Interstitial label introducing a product lineup or content block

Left-aligned Carbon Black Inter at 26px weight 500 with -0.104px tracking, optional Slate descriptor below at 14px. Sits above a horizontal product carousel or grid with 40px vertical space.

### Chat Widget
**Role:** Persistent customer-support entry point fixed to bottom-right

Pill-shaped (204px radius) Peloton Red button anchored to viewport bottom-right, white chat-bubble icon, white 'Chat' label in Inter 14px weight 500. On dark surfaces the red pops; on light surfaces it still dominates due to its saturation.

### Footer
**Role:** Site-wide link repository and legal/contact area

Carbon Black background, white text, 64px vertical padding. Link columns in 4-column grid at max-width 1200px centered. Column headings in Inter 14px weight 600 white, links in Inter 14px weight 400 Slate (#65666a). Social icons at top of footer in single-color white stroke.

### Nav Dropdown
**Role:** Expanding category menu from primary nav items

Carbon Black surface, white text, no visible border or shadow — appears as a flush extension of the nav bar. Sub-category links in Inter 14px weight 400, with a thumbnail grid of products on wider dropdowns. 24px padding inside.

### Promotional Tag
**Role:** Small inline label for deals, limited offers, or product status

Peloton Red background, white text, Inter 12px weight 600, 6px border-radius, 4px vertical × 8px horizontal padding, often paired with a tiny white dot or arrow icon.

### Icon Button
**Role:** Circular icon-only controls for cart, account, search

Transparent background, white icon stroke (1.5px) on dark nav, Carbon Black stroke on light surfaces. 40px × 40px hit area, icon centered at 20px.

## Do's and Don'ts

### Do
- Use #df1c2f exclusively for primary actions, the brand mark, and the persistent chat widget — no other color carries conversion weight
- Set display headlines at 48px Inter weight 300 with -0.384px letter-spacing; the whisper-weight is a signature choice
- Use 28px border-radius for all primary and secondary buttons to maintain the generous pill softness
- Alternate between #181a1d full-bleed hero bands and #f7f7f7 light content sections to establish the dark-stage / light-catalog rhythm
- Keep product card backgrounds pure #ffffff on #f7f7f7 canvas with a #e4e6e7 hairline border — no drop shadows on cards
- Use the 300deg shimmer gradient only for skeleton/loading states, never as a decorative surface treatment
- Set form input borders to 1px #888b93 with 6px radius; shift border to #df1c2f on focus with a subtle outer ring

### Don't
- Don't introduce any chromatic color beyond #df1c2f — the single-accent discipline is the system's defining trait
- Don't use drop shadows on cards or buttons; depth comes from surface-layer contrast, not elevation
- Don't use weight 700 or 800 for headlines — the system is built on weight 300 displays and weight 400-500 for body
- Don't place a white card or light content block on a dark hero band — the dark stage carries text and CTAs only
- Don't use fully square (0px) or fully circular (9999px) corners — the system lives at 6px, 24px, and 28px
- Don't use the 204px pill radius for anything other than the chat widget or true pill-shaped status indicators
- Don't apply colored gradients to hero backgrounds — heroes are flat #181a1d to keep focus on text and CTAs

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Charcoal Stage | `#181a1d` | Full-bleed hero bands, navigation bar, footer — the cinematic dark mode of the brand |
| 1 | Mist Canvas | `#f7f7f7` | Default page background for light content sections between dark heroes |
| 2 | White Card | `#ffffff` | Product cards, form inputs, elevated content blocks sitting on the Mist canvas |
| 3 | Silver Divider | `#e4e6e7` | Hairline borders, card outlines, structural separation between content zones |

## Elevation

The system deliberately avoids drop shadows. Depth is communicated through surface-layer contrast — dark hero bands sit beside white card surfaces, cards sit on gray canvases, and borders at #e4e6e7 provide hairline separation. This creates a flat, gallery-like presentation where the only 'elevation' is the contrast between Carbon Black (#181a1d) and Pure White (#ffffff), letting product photography carry all visual weight.

## Imagery

Product photography dominates — full equipment shots (bikes, treadmills, rowers) presented on clean backgrounds with no lifestyle context. In hero sections, equipment appears in low-key dramatic lighting against the charcoal backdrop, making the products glow. Product lineup tiles use clean white-background product crops at consistent aspect ratios. Iconography is line-based, 1.5px stroke, monocolor (white on dark, black on light) — no filled multicolor icons. No illustrations, no abstract graphics, no decorative photography outside of product shots.

## Layout

Full-bleed dark hero bands alternating with max-width 1200px centered light content sections. Heroes span the entire viewport width with centered text stacks and ambient product imagery. Light sections use a consistent grid: 2-column text+image blocks, 4–5 column product carousels, and 3-column feature blocks. Navigation is a fixed top bar that stays dark across the entire site regardless of the section below. Vertical rhythm is comfortable — 64px section gaps, 24px card padding, 12px element gaps. The product lineup section at the bottom of the visible page shows a horizontal scroll/grid of 5 product cards in a single row.

## Agent Prompt Guide

**Quick Color Reference**
- text: #181a1d (Carbon Black)
- background: #f7f7f7 (Mist Canvas) for light sections, #181a1d (Carbon Black) for hero bands
- border: #e4e6e7 (Silver Lining)
- accent: #df1c2f (Peloton Red) — single chromatic accent
- primary action: no distinct CTA color

**3 Example Component Prompts**

1. *Create a hero band:* Full-bleed #181a1d background, centered text stack. Display headline at 48px Inter weight 300, #ffffff, letter-spacing -0.384px, line-height 1.2. Subtitle at 18px Inter weight 400, #ffffff at 80% opacity. Two buttons side-by-side centered: a filled #df1c2f button with white text ('Explore Bikes') at 16px Inter weight 500, 28px radius, 16px 24px padding; beside it a ghost button with 1.5px white border, 28px radius, identical text style.

2. *Create a product card:* White (#ffffff) surface on a #f7f7f7 page background. Product image fills the top 60% at 6px corner radius. Below: product name at 20px Inter weight 500, #181a1d. Price or sub-label at 14px Inter weight 400, #65666a. Card has no shadow, 24px outer padding, sits on the gray canvas with a #e4e6e7 hairline border.

3. *Create a nav bar:* Full-width #181a1d bar, 16px vertical padding. 'PELOTON' wordmark at left in #ffffff at 16px Inter weight 600, 0.025em letter-spacing. Five center nav links in #ffffff at 14px Inter weight 500, each with a small chevron. Account icon and cart icon at right in white 1.5px stroke.

## Gradient System

One gradient in active use: a soft three-stop gray transition (rgb(168,172,177) → rgb(245,247,249) → rgb(168,172,177)) at 300deg. This is a skeleton/loading shimmer effect — it slides across placeholder content areas while product images load. Not used as a decorative brand element. The 300deg angle creates a diagonal sweep rather than a horizontal band, giving the loading state a subtle sense of motion without being aggressive.

## Dark-to-Light Section Strategy

The site alternates between Carbon Black hero bands and Mist Gray content sections. This is intentional: the dark hero is the brand's stage — it makes the red CTA and product photography pop. The light section that follows is the catalog — it makes product information scannable. Never place a white card on a dark hero (no floating product callouts over hero text). Dark sections carry text and CTAs; light sections carry product grids and information density.

## Similar Brands

- **Apple** — Same cinematic full-bleed dark hero → clean white product gallery rhythm, with a single restrained accent color reserved for primary actions
- **Garmin** — Disciplined achromatic product-retail palette (gunmetal, white, warm gray) with photography as the primary visual language and minimal chromatic decoration
- **Tesla** — Dark immersive product-showcase bands breaking into minimal white specification sections; near-zero color noise, extreme typographic restraint
- **Rothy's** — Premium product e-commerce with white product tiles on soft gray canvas, hairline borders, and a single bold accent color for CTAs
- **Bowers & Wilkins** — Dark exhibition-style product presentation where equipment photography carries visual weight against near-black surfaces, with minimal typographic flourish

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-peloton-red: #df1c2f;
  --color-carbon-black: #181a1d;
  --color-pure-white: #ffffff;
  --color-mist-gray: #f7f7f7;
  --color-silver-lining: #e4e6e7;
  --color-slate: #65666a;
  --color-graphite: #000000;
  --color-fog: #a8acb1;
  --color-steel: #888b93;
  --color-ash: #a3a3a6;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.69;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.104px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.192px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.288px;
  --text-display: 48px;
  --leading-display: 1.2;
  --tracking-display: -0.384px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 204px;

  /* Named Radii */
  --radius-tags: 6px;
  --radius-cards: 24px;
  --radius-pills: 204px;
  --radius-images: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 28px;

  /* Surfaces */
  --surface-charcoal-stage: #181a1d;
  --surface-mist-canvas: #f7f7f7;
  --surface-white-card: #ffffff;
  --surface-silver-divider: #e4e6e7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-peloton-red: #df1c2f;
  --color-carbon-black: #181a1d;
  --color-pure-white: #ffffff;
  --color-mist-gray: #f7f7f7;
  --color-silver-lining: #e4e6e7;
  --color-slate: #65666a;
  --color-graphite: #000000;
  --color-fog: #a8acb1;
  --color-steel: #888b93;
  --color-ash: #a3a3a6;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.69;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.104px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.192px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.288px;
  --text-display: 48px;
  --leading-display: 1.2;
  --tracking-display: -0.384px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 204px;
}
```
