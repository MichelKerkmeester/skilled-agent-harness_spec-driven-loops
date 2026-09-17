# Going™ — Style Reference
> Sun-bleached travel journal with electric ink

**Theme:** light

Going is a warm-paper travel companion: a parchment canvas (#fffef0, never pure white) carries deep lagoon teal body text and pill-shaped electric iris CTAs, with soft mint wash bands organizing content sections. PP Mori's slightly off-axis 475 weight gives paragraphs a friendlier gravity than standard 400, while display sizes push tracking outward (up to 0.10em at 80px) for an editorial-poster feel. Surfaces stack: parchment base → mint wash content bands → ink-bordered cards with a whisper shadow. The design refuses cold SaaS conventions — black is used sparingly as a hairline border accent, not as primary type, and the single violet CTA carries all interactive weight across the page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Lagoon | `#004449` | `--color-deep-lagoon` | Primary text, body copy, icon strokes, navigation — deep teal replaces black for all running text and primary iconography, lending a warm printed feel rather than digital harshness |
| Electric Iris | `#483cff` | `--color-electric-iris` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Parchment | `#fffef0` | `--color-parchment` | Page canvas, card surfaces on mint sections, inverted text on dark elements — warm off-white background replaces clinical #ffffff, reducing glare and adding editorial softness |
| Ink Black | `#000000` | `--color-ink-black` | Hairline borders, card outlines, structural dividers, footer strokes — used as 1px boundary lines rather than as primary type, creating crispness against the cream base |
| Mint Wash | `#d7ffc2` | `--color-mint-wash` | Section backgrounds, testimonial card surfaces, soft highlight bands — pale green wash separates content zones without the heaviness of gray or color blocks |
| Lime Pulse | `#0bff80` | `--color-lime-pulse` | Display headline emphasis, accent strokes on key words, decorative highlight — neon green appears in sparing two-to-five-word bursts to amplify specific display phrases |

## Tokens — Typography

### PP Mori — All text across the system. The signature 475 weight (a semi-normal sitting between Regular and SemiBold) is used for body and UI labels, giving paragraphs a subtly heavier gravity than 400 without the formality of 600. Display sizes (40-80px) use 600/700 with expanded tracking for editorial poster-style headlines. Smaller UI (14-18px) stays at 475 for friendly readable labels. · `--font-pp-mori`
- **Substitute:** Inter, General Sans, or Söhne — pick a geometric humanist with a similar warm 475-500 weight option
- **Weights:** 400, 475, 600, 700
- **Sizes:** 14px, 16px, 18px, 24px, 28px, 40px, 48px, 80px
- **Line height:** 1.10, 1.14, 1.15, 1.17, 1.33, 1.40, 1.50
- **Letter spacing:** 0.28px at 14px, 0.32px at 16px, 0.36px at 18px, 0.48px at 24px, 1.68px at 28px, 2.4px at 40px, 4.8px at 48px, 8.0px at 80px
- **OpenType features:** `"ss01" on`
- **Role:** All text across the system. The signature 475 weight (a semi-normal sitting between Regular and SemiBold) is used for body and UI labels, giving paragraphs a subtly heavier gravity than 400 without the formality of 600. Display sizes (40-80px) use 600/700 with expanded tracking for editorial poster-style headlines. Smaller UI (14-18px) stays at 475 for friendly readable labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 0.28px | `--text-caption` |
| body-sm | 16px | 1.4 | 0.32px | `--text-body-sm` |
| body | 18px | 1.33 | 0.36px | `--text-body` |
| subheading | 24px | 1.33 | 0.48px | `--text-subheading` |
| heading-sm | 28px | 1.17 | 1.68px | `--text-heading-sm` |
| heading | 40px | 1.15 | 2.4px | `--text-heading` |
| heading-lg | 48px | 1.14 | 4.8px | `--text-heading-lg` |
| display | 80px | 1.1 | 8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| badges | 900px |
| inputs | 16px |
| buttons | 900px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.04) 0px 2px 8px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Primary CTA Button (Electric Iris Pill)
**Role:** High-emphasis action — the only filled chromatic button in the system

Background #483cff, white text, 900px border-radius (full pill), 32px row-gap, padding 16px 28px. PP Mori 475 at 16px, white #fffef0 text. No shadow. Used for the singular 'Join for free' or 'Get App' action that appears once per viewport.

### Outlined Navigation Button
**Role:** Secondary action in the nav bar

Transparent background, 1.5px border #fffef0 (on dark teal nav) or #004449 (on parchment), 900px radius, 16px 24px padding. PP Mori 475 at 14-16px, text matches border color. Used for 'Sign Up' and 'Login' in the top bar.

### Mint Section Card
**Role:** Content card sitting on a mint wash band

Background #fffef0, 24px border-radius, 1px border #000 at ~40% opacity or #004449 at low opacity, padding 32px, shadow rgba(0,0,0,0.04) 0px 2px 8px 0px. Holds phone mockup + heading + body text in the 3-column feature grid.

### Testimonial Card
**Role:** Social proof card in horizontal scroll

Mint wash background #d7ffc2, 24px border-radius, no border, padding 32px. Contains user photo (circular, ~56px) at top, name and trip metadata, quote body in PP Mori 400/475 at 16px. Cards extend taller than wide for portrait orientation.

### Phone Mockup Frame
**Role:** Device chrome for app screenshots

Rounded rectangle, ~24px radius, containing a 9:19.5 aspect iOS screenshot. No device shadow — the screenshot bleeds edge-to-edge. Overlapping or isolated placement, sometimes paired with a circular masked travel photo behind it.

### Social Proof Pill Badge
**Role:** Trust signal in the hero

Mint wash #d7ffc2 background, 900px radius, padding 8px 16px. Contains small avatar stack (24px circles, 2-3 overlapping) + PP Mori 475 at 14px in #004449. Example: avatar group + 'Loved by 2M+ ★★★★★ rating'.

### Top Navigation Bar
**Role:** Persistent site navigation

In dark teal section: background #004449, full-width, padding 20px 0. Logo 'Going™' left in white PP Mori 600 at 24px. Center: text links in PP Mori 475 at 14px, uppercase, 0.06em letter-spacing, white. Right: outlined 'Sign Up' pill + filled 'Get App' violet pill.

### Press Logo Strip
**Role:** Editorial credibility bar

Row of 4-5 muted publication logos (Travel+Leisure, Good Morning America, etc.) at ~40% opacity in #004449. No background, no borders, sits below the hero CTA with 40px vertical breathing room.

### Hero Headline Pair
**Role:** Primary marketing headline

Two-line display headline. First line in Deep Lagoon #004449, second line with a 2-3 word phrase swapped to Electric Iris #483cff. PP Mori 700 at 80px desktop (48px tablet, 40px mobile), 0.10em letter-spacing, 1.1 line-height. Lines broken at the value proposition.

### Feature Section Heading
**Role:** Section opener above a 3-column grid

Centered PP Mori 600 at 40-48px, Deep Lagoon #004449. Single line when possible. Optional inline violet word for emphasis. 80px padding-top above the heading, 48px below before the grid begins.

### Press/Media Pill Link
**Role:** Standalone editorial link in dark sections

Deep Lagoon #004449 background, PP Mori 475 at 16px in #fffef0, 900px radius, 16px 32px padding. Centered, often appears in footer or as a 'Read the article' callout.

### Footer Block
**Role:** Site footer with link columns

Deep Lagoon #004449 background, full-bleed. Multi-column link grid in PP Mori 400 at 14px, white text with 0.02em tracking. Logo top-left in white. Padding 80px top/bottom, 1200px max-width.

## Do's and Don'ts

### Do
- Use Deep Lagoon #004449 for all body text and primary icons — never fall back to #000000 for running copy
- Reserve Electric Iris #483cff for one filled CTA per viewport — duplicate CTAs dilute the signal
- Use 900px border-radius on every button, badge, and pill-shaped link — sharp corners break the pill-button language
- Pair mint wash #d7ffc2 section bands with parchment #fffef0 cards inside them — the two-tone stack is the signature content rhythm
- Apply the 475 weight of PP Mori for UI labels (14-16px) — it carries the warm humanist feel that 400 alone cannot reach
- Use 0.10em letter-spacing at display sizes 48px+ — the expanded tracking is what makes headlines feel editorial rather than SaaS
- Set section padding to 80px top/bottom for vertical breathing room — denser spacing collapses the spacious rhythm

### Don't
- Don't use pure #ffffff backgrounds — the warmth of #fffef0 is core to the brand and a clinical white breaks the system
- Don't apply shadows heavier than rgba(0,0,0,0.04) 0px 2px 8px 0px — heavy elevation destroys the flat, paper-like quality
- Don't use black #000000 for body text — it reads as harsh digital where Deep Lagoon teal reads as warm print
- Don't introduce card radii other than 24px — the 24px card + 900px button pairing is the rounded-but-not-floaty signature
- Don't use the neon Lime Pulse #0bff80 for body text or buttons — it only works as 2-5 word display emphasis in headlines
- Don't stack multiple saturated backgrounds — the palette relies on parchment→mint→parchment alternation, not rainbow layering
- Don't reduce the 80px section gap — compressing it removes the editorial pacing that distinguishes the page from standard SaaS layouts

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#fffef0` | Base page background — warm off-white replacing clinical white |
| 1 | Mint Wash Band | `#d7ffc2` | Full-bleed content section background, testimonial zone, feature highlight band |
| 2 | Parchment Card | `#fffef0` | Card surface on mint sections — parchment returns as a lifted layer |
| 3 | Ink Card | `#004449` | Dark teal inverted surface for navigation, footer, or accent blocks — teal carries surface weight, not just text |

## Elevation

- **Feature cards on mint bands:** `rgba(0, 0, 0, 0.04) 0px 2px 8px 0px`
- **Testimonial cards:** `rgba(0, 0, 0, 0.04) 0px 2px 8px 0px`

## Imagery

Photography is warm-toned travel content: mountain landscapes, coastal towns, city skylines — cropped into circles or organic blob masks behind phone mockups. User testimonial photos are small circular headshots (56px) stacked with overlap. Phone mockups dominate the visual space, always showing iOS app screens with real UI (price alerts, trip lists, booking confirmations). No illustrations, no abstract graphics — the visual hierarchy is phone-mockup-as-hero, photograph-as-context, avatar-as-social-proof. Color treatment on photos is natural, slightly warm, no duotone.

## Layout

Max-width 1200px centered content with full-bleed colored bands. Hero is split: headline + CTA left (60% width), phone mockup overlapping a circular masked travel photo right (40%). Feature sections are 3-column equal grids with phone mockup + caption + body text in each cell, set on a mint wash band. Testimonials scroll horizontally as wide portrait cards on a mint band. Navigation is a full-bleed dark teal bar with centered nav links. Section rhythm alternates: parchment hero → mint features → parchment testimonials on mint → dark teal footer. Vertical spacing is generous (80px section gaps, 32px card padding). The overall page reads as a single continuous scroll with color bands doing the section division rather than hard borders or dividers.

## Agent Prompt Guide

Quick Color Reference:
- text: #004449 (Deep Lagoon)
- background: #fffef0 (Parchment)
- border: #000000 (Ink Black) or #004449
- accent: #0bff80 (Lime Pulse) — display only
- primary action: #483cff (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #483cff background, #fffef0 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Build a 3-column feature grid on a mint band: full-width #d7ffc2 background, 80px vertical padding. Three equal columns, each with a phone mockup image, a 28px PP Mori 600 subheading in #004449, and 16px body text in #004449 at 475 weight. 32px gap between columns, cards sit on the mint band directly (no card containers), or use #fffef0 card containers with 24px radius and 32px padding.

3. Build a testimonial card: 320px wide, auto height, background #d7ffc2, 24px radius, 32px padding. 56px circular avatar top-left. Name + trip metadata at 14px PP Mori 475 in #004449. Quote body at 16px PP Mori 400 in #004449. No border, no shadow. Cards arranged in a horizontal scroll row.

4. Build the top navigation: full-width #004449 background, 20px vertical padding. Logo 'Going™' left at 24px PP Mori 600 white. Center nav links uppercase at 14px PP Mori 475, white, 0.06em tracking. Right: outlined 'Sign Up' button (1.5px white border, 900px radius, 16px 24px padding) + filled 'Get App' button (background #483cff, white text, 900px radius, 16px 24px padding).

5. Build a social proof pill badge: #d7ffc2 background, 900px radius, 8px 16px padding. Contains 2-3 overlapping 24px circular avatars on the left, then 'Loved by 2M+ ★★★★★' at 14px PP Mori 475 in #004449. Sits above the hero headline with 16px gap below.

## Similar Brands

- **Hopper** — Same travel-deal app category, same warm-off-white editorial landing page feel with single vivid accent for CTAs
- **Notion** — Similar warm humanist typography and generous spacing, though Going pushes the cream canvas and pill-button language further
- **Airbnb** — Warm parchment-like background tone, friendly humanist type, and photography of real places used as soft circular accents behind product imagery
- **Wise (TransferWise)** — Same approach of using a single vivid color (violet/iris in both cases) for the primary CTA against a neutral canvas, with pill buttons and generous vertical rhythm
- **Koodo Mobile** — Pastel mint accent sections and a warm cream paper-feel canvas — same colored-band approach to section division

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-lagoon: #004449;
  --color-electric-iris: #483cff;
  --color-parchment: #fffef0;
  --color-ink-black: #000000;
  --color-mint-wash: #d7ffc2;
  --color-lime-pulse: #0bff80;

  /* Typography — Font Families */
  --font-pp-mori: 'PP Mori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.32px;
  --text-body: 18px;
  --leading-body: 1.33;
  --tracking-body: 0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: 1.68px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: 2.4px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: 4.8px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: 8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w475: 475;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 900px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-badges: 900px;
  --radius-inputs: 16px;
  --radius-buttons: 900px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 8px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #fffef0;
  --surface-mint-wash-band: #d7ffc2;
  --surface-parchment-card: #fffef0;
  --surface-ink-card: #004449;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-lagoon: #004449;
  --color-electric-iris: #483cff;
  --color-parchment: #fffef0;
  --color-ink-black: #000000;
  --color-mint-wash: #d7ffc2;
  --color-lime-pulse: #0bff80;

  /* Typography */
  --font-pp-mori: 'PP Mori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.32px;
  --text-body: 18px;
  --leading-body: 1.33;
  --tracking-body: 0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: 1.68px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: 2.4px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: 4.8px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: 8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 900px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 8px 0px;
}
```
