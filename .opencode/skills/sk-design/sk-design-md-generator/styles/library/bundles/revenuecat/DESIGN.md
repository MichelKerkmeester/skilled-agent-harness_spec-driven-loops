# Revenuecat — Style Reference
> Periwinkle dashboard on a cloud-white canvas — generous, airy, and confidently understated.

**Theme:** light

RevenueCat speaks in a calm, developer-trusted visual register: cloud-white canvases, deep-navy ink, and a single periwinkle accent that carries every interactive moment. The headline voice is generous and oversized (up to 80px) but whispers through ultra-light weights and tight negative tracking, letting the typographic mass do the work that color and decoration normally would. Surfaces are flat and airy — soft cards on a near-white field with violet-tinted ambient shadows — and the whole system leans on shape (16px corners, 9999px pill buttons) rather than chrome to define hierarchy. Warm coral red and mint green appear as quiet decorative punctuation for category icons and chart highlights, never competing with the periwinkle for interactive priority.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Periwinkle Signal | `#576cdb` | `--color-periwinkle-signal` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Indigo | `#1f1f47` | `--color-deep-indigo` | Primary heading text, nav links, high-emphasis body — anchors the palette with near-black authority carrying a faint cool tint |
| Storm Violet | `#3d3d5c` | `--color-storm-violet` | Secondary text, input values, subdued body copy — sits between indigo and gray for medium-emphasis reading |
| Slate | `#575775` | `--color-slate` | Muted inline links, secondary metadata, caption-level annotations |
| Fog | `#6c7693` | `--color-fog` | Helper text, placeholder copy, low-emphasis labels in form and card contexts |
| Ash | `#84849a` | `--color-ash` | Disabled states, very low-emphasis metadata |
| Midnight Ink | `#171a1c` | `--color-midnight-ink` | Body text default, high-contrast copy — the achromatic black of the system |
| Cloud | `#f9f9fb` | `--color-cloud` | Page canvas, hero backdrop, outer sections — slightly cool off-white that softens the entire site |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, nav bar, input fills, elevated panels — true white against the off-white canvas creates a subtle lift |
| Mist | `#eaedf6` | `--color-mist` | Hairline borders, card edges, divider lines — the default 1px separator |
| Haze | `#d1d6e1` | `--color-haze` | Stronger borders, input outlines, shadow-tinted strokes |
| Bone | `#e3e6e8` | `--color-bone` | Alternate surface fill for secondary cards or muted backgrounds |
| Lilac Wash | `#d6dbf5` | `--color-lilac-wash` | Soft tinted borders, periwinkle-derived dividers, subtle hover backgrounds |
| Periwinkle Mist | `#c1c9f6` | `--color-periwinkle-mist` | Pill backgrounds, tag fills, light decorative wash — the pale sibling of the brand accent |
| Sky Tint | `#abb6ed` | `--color-sky-tint` | Secondary icon backgrounds, muted chart highlights |
| Coral Ember | `#f25a5a` | `--color-coral-ember` | Category icon fills, chart accents, decorative highlight markers — the warm counterweight to periwinkle |
| Coral Blush | `#f7d4d4` | `--color-coral-blush` | Soft coral background, pastel category tag fill |
| Mint Whisper | `#a6f2d2` | `--color-mint-whisper` | Decorative chart fill, pastel category tag — used sparingly for icon and illustration variety |
| Mint Veil | `#c1f6e0` | `--color-mint-veil` | Green supporting accent for decorative details and low-frequency emphasis |

## Tokens — Typography

### Object Sans — Display and heading typeface — used for all headlines, subheadings, nav items, and button labels. The ultra-thin 100/300 weights at large sizes (56–80px) create the system's signature whisper-of-authority voice; tight negative tracking (-0.07em at 80px) compresses the geometric forms for a confident, almost editorial feel. Reaches up to 80px for hero statements. · `--font-object-sans`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 100, 300, 400, 500, 700
- **Sizes:** 13, 14, 16, 18, 24, 28, 32, 40, 48, 54, 56, 64, 80
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.07em at 80px, -0.04em at 56px, -0.03em at 48px, -0.025em at 40px, -0.02em at 24–32px, normal at body sizes
- **Role:** Display and heading typeface — used for all headlines, subheadings, nav items, and button labels. The ultra-thin 100/300 weights at large sizes (56–80px) create the system's signature whisper-of-authority voice; tight negative tracking (-0.07em at 80px) compresses the geometric forms for a confident, almost editorial feel. Reaches up to 80px for hero statements.

### Helvetica Neue — Body and interface text — paragraph copy, form labels, helper text, list items. Neutral and legible; deliberately quieter than the display face so headlines own the visual hierarchy. Weight 300 for light body emphasis, 400 for default, 500 for inline emphasis. · `--font-helvetica-neue`
- **Weights:** 300, 400, 500
- **Sizes:** 16, 18, 20, 22
- **Line height:** 1.38–1.50
- **Role:** Body and interface text — paragraph copy, form labels, helper text, list items. Neutral and legible; deliberately quieter than the display face so headlines own the visual hierarchy. Weight 300 for light body emphasis, 400 for default, 500 for inline emphasis.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 18 | — | `--text-caption` |
| body | 16px | 24 | — | `--text-body` |
| body-lg | 18px | 27 | — | `--text-body-lg` |
| subheading | 20px | 28 | — | `--text-subheading` |
| heading-sm | 24px | 30 | -0.48px | `--text-heading-sm` |
| heading | 32px | 40 | -0.64px | `--text-heading` |
| heading-lg | 48px | 54 | -1.44px | `--text-heading-lg` |
| display | 64px | 64 | -2.56px | `--text-display` |
| display-xl | 80px | 80 | -5.6px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 120 | 120px | `--spacing-120` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| buttons | 9999px |
| small-chips | 9999px |
| large-panels | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(73, 46, 107, 0.14) 0px 3px 16px 0px` | `--shadow-md` |
| lg | `rgba(71, 92, 133, 0.25) 0px 4px 20px 0px, rgba(144, 138, ...` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-96px
- **Card padding:** 32px
- **Element gap:** 16-24px

## Components

### Primary Pill Button
**Role:** Main conversion action (Sign Up, Start for free)

Filled pill (9999px radius) with #576cdb background and white text. Object Sans at 16px weight 500, padding 12px 24px. No visible border; shadow optional. The only button in the system that carries a chromatic fill — all other actions defer to this one as the single interactive voice.

### Ghost Text Link
**Role:** Secondary actions and inline navigation (Talk to sales, For engineering teams)

No background, no border. Object Sans 14–16px weight 500 in #576cdb, followed by a chevron glyph in the same color. Underlines on hover only. The system's preferred secondary action pattern — used everywhere a clickable affordance is needed but primary weight is not warranted.

### Email Capture Field
**Role:** Hero lead-capture form (hero CTA unit)

White pill-shaped input (9999px radius) with a thin #eaedf6 border, 14–16px Object Sans placeholder text in #6c7693, and the Primary Pill Button nested flush inside the right edge. Field height ~48px, internal padding 12px 20px.

### Feature Card
**Role:** Team-segment card grid (Engineering, Marketing, Product, Support)

White (#ffffff) surface on the #f9f9fb canvas, 16px radius, padding 32px. Top-left holds a 40px circular icon container filled with a pastel category color (coral, mint, or periwinkle mist). Heading in Object Sans 24px weight 500, #1f1f47. Body in Helvetica Neue 16px weight 400, #3d3d5c. Footer is a ghost link in #576cdb. No shadow — separation comes from surface contrast and a 1px #eaedf6 border.

### Category Icon Badge
**Role:** Icon container inside feature cards

40px circle, fill varies by category (#f7d4d4 coral, #c1f6e0 mint, #c1c9f6 periwinkle, #d6dbf5 lavender). Icon glyph centered, 20px, drawn in the matching darker hue. Provides the only chromatic punctuation in an otherwise achromatic card.

### Testimonial Carousel Card
**Role:** Case study highlight (VSCO, Braze, etc.)

White surface, 16px radius, dual-section layout: left column holds app logo, name, and quote in Object Sans/Helvetica Neue, right column shows a large metric (e.g. '5%') in Object Sans 48px weight 300 in #576cdb, with a caption beneath in #6c7693. Floats above the page with the violet-tinted shadow rgba(73,46,107,0.14) 0px 3px 16px. Author avatar + name at the bottom in a thin row.

### Stat Block
**Role:** Trust metrics row in hero (91,000 apps, 4B+ API requests, $13B+ revenue)

Three-column row, no dividers. Large number in Object Sans 32–40px weight 500, #1f1f47, with the unit (+, B) in lighter weight. Caption below in Helvetica Neue 14px weight 400, #6c7693. Generous 64–80px column gap.

### Top Navigation Bar
**Role:** Persistent site navigation

White background, 1px #eaedf6 bottom border. Left: brand wordmark 'RevenueCat' in Object Sans with the final letters ('Cat') underlined in periwinkle. Center: nav links (Features, Solutions, Developers, Resources, Integrations, Blog, Pricing) in Object Sans 14–16px weight 400, #1f1f47, with a small dropdown chevron beside the ones that expand. Right: 'Log In' ghost text link + Primary Pill Button. Height ~64px, horizontal padding 24–40px.

### Logo Cloud
**Role:** Social proof — trusted-by brands

Single row of 5 monochrome brand logos (Notion, OpenAI, VSCO, LADDER, Runna) rendered in #575775 or #1f1f47, evenly distributed with ~80–120px gaps. Logos are desaturated to greyscale — the row never competes with the headline for attention.

### Hero Product Mockup
**Role:** Floating screenshot collage beside hero headline

Two overlapping white cards, each 16px radius, with the dual-layer ambient shadow rgba(71,92,133,0.25) 0px 4px 20px + rgba(144,138,208,0.1) 0px 30px 60px. Front card shows a code-snippet panel; back card shows a paywall/paywall config UI. Cards are rotated and stacked with a slight offset to create depth without 3D effect.

### Carousel Pagination Dots
**Role:** Section-level progress indicator

Horizontal row of thin horizontal lines (~40–60px wide, 2px height) in #d1d6e1, with the active dot filled in #1f1f47. Aligned center, sits beneath the carousel section.

### Section Heading
**Role:** Repeating section title pattern (e.g. 'Data and tools for every team')

Centered. Object Sans 48–56px weight 300 (the whisper weight), #1f1f47, letter-spacing ~-0.03em. Subhead below in Helvetica Neue 18px weight 400, #6c7693, max-width ~640px. 48–80px vertical gap between heading and the content block beneath.

## Do's and Don'ts

### Do
- Use #576cdb exclusively for primary action fills, active links, and the single periwinkle icon accent per card — never dilute it across multiple roles on the same surface
- Set all buttons to 9999px radius; set all feature and testimonial cards to 16px radius — the pill-vs-rounded-rect contrast is the system's primary shape language
- Set display headings at weight 300 in Object Sans with negative letter-spacing (-0.03em at 48px, -0.07em at 80px) — the whisper weight is the signature, not a fallback
- Use #f9f9fb as the page canvas and #ffffff only for card/nav surfaces — the two-value surface lift is how cards separate without shadows
- Apply the violet-tinted shadows (rgba(73,46,107,0.14) or rgba(71,92,133,0.25)) to any floating element; never use a neutral gray shadow on elevated surfaces
- Maintain 80–96px vertical gap between sections and 32px internal card padding as the default rhythm
- Render logo clouds in monochrome #575775 or #1f1f47 only — colored logos break the social-proof pattern

### Don't
- Do not use #576cdb as decorative background fills on cards or sections — it is reserved for interactive moments only
- Do not add borders to pill buttons; the fill alone defines the action
- Do not set body text in Object Sans — reserve the display face for headings, nav, and button labels; use Helvetica Neue for paragraphs and form copy
- Do not apply neutral gray shadows; every shadow in the system carries a violet or indigo tint
- Do not use #000000 — the system's black is the achromatic #171a1c
- Do not introduce additional saturated colors (greens, oranges) as functional states — coral and mint are decorative only, never used for success/error
- Do not use sharp corners (0–4px radius) on cards or containers; the minimum meaningful radius in this system is 16px

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f9f9fb` | Outer page background, hero field, footer |
| 1 | Card | `#ffffff` | Feature cards, testimonial cards, nav bar, input fields, elevated panels |
| 2 | Alternate Surface | `#e3e6e8` | Muted block backgrounds, secondary panels |

## Elevation

- **Hero floating UI mockup:** `rgba(71, 92, 133, 0.25) 0px 4px 20px 0px, rgba(144, 138, 208, 0.1) 0px 30px 60px 0px`
- **Testimonial card / floating panel:** `rgba(73, 46, 107, 0.14) 0px 3px 16px 0px`

## Imagery

Imagery is minimal and product-led. The hero relies on a composed screenshot collage (code snippet + paywall config UI) shown as floating white cards rather than a lifestyle photo or illustration. Category icons are flat geometric glyphs inside soft circular color washes — no skeuomorphism, no gradients within icons. Photography, when present, appears only in user-generated case study thumbnails (e.g. the mountain hiker photo in the VSCO testimonial). The visual language treats screenshots as primary content: they are given shadow, rotation, and stacking treatment to feel like physical artifacts hovering above the page.

## Layout

The page is max-width contained at ~1200px with generous outer margins. The hero is a two-column split — text (headline, subhead, email capture, stats, logo cloud) on the left at roughly 45% width, floating product mockup stacked on the right at 55%. Subsequent sections are centered single-column stacks: centered section heading, then a horizontal card row (4-up for team segments, 3-up for testimonials) with a carousel dot indicator beneath. Vertical rhythm is 80–96px between sections, with no alternating dark/light bands — the entire page stays on the same cloud-white canvas, using card-on-canvas contrast for visual separation. Navigation is a single white top bar, not sticky-shrunken, with brand left, links center, and account actions right.

## Agent Prompt Guide

**Quick Color Reference**
- primary action: no distinct CTA color
- Heading text: #1f1f47 (deep indigo)
- Body text: #171a1c (midnight ink) / #3d3d5c (storm violet) for secondary
- Background: #f9f9fb (cloud canvas), #ffffff (card surface)
- Border: #eaedf6 (mist)
- Muted text: #6c7693 (fog)

**Example Component Prompts**

1. *Feature Card*: Create a white (#ffffff) card on a #f9f9fb canvas, 16px radius, 32px padding. Top-left: a 40px circle filled with #f7d4d4 (coral blush) containing a 20px white icon. Below: Object Sans 24px weight 500 heading in #1f1f47, then a Helvetica Neue 16px body in #3d3d5c. Footer: a ghost link in #576cdb reading 'Learn more >'. 1px #eaedf6 border, no shadow.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. *Hero Headline*: Object Sans 80px weight 300 in #1f1f47, letter-spacing -5.6px, line-height 80px. Single line at desktop, wraps to two lines on tablet.

4. *Testimonial Carousel Card*: White card, 16px radius, two columns separated by 48px. Left: brand logo (24px), brand name in Object Sans 20px weight 500 #1f1f47, quote in Helvetica Neue 16px #3d3d5c, author row at bottom with 32px avatar. Right: large stat in Object Sans 48px weight 300 #576cdb, caption in Helvetica Neue 14px #6c7693 beneath. Apply shadow rgba(73, 46, 107, 0.14) 0px 3px 16px.

5. *Stat Block Row*: Three columns, 80px column gap. Each column: number in Object Sans 40px weight 500 #1f1f47, caption in Helvetica Neue 14px #6c7693 directly below. No dividers between columns.

## Similar Brands

- **Linear** — Same oversized whisper-weight headlines with tight negative tracking on a near-white canvas, single chromatic accent carrying every interactive moment, and pill-shaped primary buttons
- **Vercel** — Identical developer-trust posture — cloud-white canvas, generous section gaps, minimal card chrome relying on surface contrast, and a single saturated accent for actions
- **Cal.com** — Shared 9999px pill buttons, 16px card radius, periwinkle-tinted ambient shadows on floating elements, and the same flat-icon-in-pastel-circle category pattern
- **Plausible Analytics** — Matching restraint: no decorative gradients, no dark mode, no marketing-heavy sections — the system is just type, card, and one accent color doing all the work
- **Mercury** — Same violet-leaning brand accent and deep indigo heading color, with the same spacious 80–96px section rhythm and minimal card shadow approach

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-periwinkle-signal: #576cdb;
  --color-deep-indigo: #1f1f47;
  --color-storm-violet: #3d3d5c;
  --color-slate: #575775;
  --color-fog: #6c7693;
  --color-ash: #84849a;
  --color-midnight-ink: #171a1c;
  --color-cloud: #f9f9fb;
  --color-paper: #ffffff;
  --color-mist: #eaedf6;
  --color-haze: #d1d6e1;
  --color-bone: #e3e6e8;
  --color-lilac-wash: #d6dbf5;
  --color-periwinkle-mist: #c1c9f6;
  --color-sky-tint: #abb6ed;
  --color-coral-ember: #f25a5a;
  --color-coral-blush: #f7d4d4;
  --color-mint-whisper: #a6f2d2;
  --color-mint-veil: #c1f6e0;

  /* Typography — Font Families */
  --font-object-sans: 'Object Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 18;
  --text-body: 16px;
  --leading-body: 24;
  --text-body-lg: 18px;
  --leading-body-lg: 27;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --text-heading-sm: 24px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 40;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 54;
  --tracking-heading-lg: -1.44px;
  --text-display: 64px;
  --leading-display: 64;
  --tracking-display: -2.56px;
  --text-display-xl: 80px;
  --leading-display-xl: 80;
  --tracking-display-xl: -5.6px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-120: 120px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-96px;
  --card-padding: 32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-buttons: 9999px;
  --radius-small-chips: 9999px;
  --radius-large-panels: 32px;

  /* Shadows */
  --shadow-md: rgba(73, 46, 107, 0.14) 0px 3px 16px 0px;
  --shadow-lg: rgba(71, 92, 133, 0.25) 0px 4px 20px 0px, rgba(144, 138, 208, 0.1) 0px 30px 60px 0px;

  /* Surfaces */
  --surface-canvas: #f9f9fb;
  --surface-card: #ffffff;
  --surface-alternate-surface: #e3e6e8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-periwinkle-signal: #576cdb;
  --color-deep-indigo: #1f1f47;
  --color-storm-violet: #3d3d5c;
  --color-slate: #575775;
  --color-fog: #6c7693;
  --color-ash: #84849a;
  --color-midnight-ink: #171a1c;
  --color-cloud: #f9f9fb;
  --color-paper: #ffffff;
  --color-mist: #eaedf6;
  --color-haze: #d1d6e1;
  --color-bone: #e3e6e8;
  --color-lilac-wash: #d6dbf5;
  --color-periwinkle-mist: #c1c9f6;
  --color-sky-tint: #abb6ed;
  --color-coral-ember: #f25a5a;
  --color-coral-blush: #f7d4d4;
  --color-mint-whisper: #a6f2d2;
  --color-mint-veil: #c1f6e0;

  /* Typography */
  --font-object-sans: 'Object Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 18;
  --text-body: 16px;
  --leading-body: 24;
  --text-body-lg: 18px;
  --leading-body-lg: 27;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --text-heading-sm: 24px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 40;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 54;
  --tracking-heading-lg: -1.44px;
  --text-display: 64px;
  --leading-display: 64;
  --tracking-display: -2.56px;
  --text-display-xl: 80px;
  --leading-display-xl: 80;
  --tracking-display-xl: -5.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-120: 120px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-md: rgba(73, 46, 107, 0.14) 0px 3px 16px 0px;
  --shadow-lg: rgba(71, 92, 133, 0.25) 0px 4px 20px 0px, rgba(144, 138, 208, 0.1) 0px 30px 60px 0px;
}
```
