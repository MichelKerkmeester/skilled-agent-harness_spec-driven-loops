# FeedHive — Style Reference
> Lavender control room at dawn. One confident blue-violet accent breathing over a near-white workspace.

**Theme:** light

FeedHive uses an airy productivity-workspace language: a near-white lavender canvas (#f3f5ff), crisp white cards floating on top, and a single confident blue-violet accent (#4457ff) that makes actions feel switched on without ever dominating. Typography relies entirely on one custom geometric sans (Thicccboi) at generous sizes — 60px displays, 16px body — giving every screen a calm, modern cadence. Surfaces are flat and mostly shadowless; the one signature blue-tinted glow is reserved for the product mockup hero, never for ordinary cards. The system treats color as punctuation: pages stay 95% achromatic, and the brand violet appears only on filled CTAs, the gradient text accent, floating social-media decorations, and the AI chat orb.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lavender Canvas | `#f3f5ff` | `--color-lavender-canvas` | Page background — the entire site sits on this faint blue-lavender wash instead of pure white, which warms the space and lets white cards lift visibly |
| Card White | `#ffffff` | `--color-card-white` | Card surfaces, modal panels, nav bar, elevated UI blocks |
| Ink | `#181c31` | `--color-ink` | Primary text, headings, button labels — a near-black with a blue undertone, not pure #000 |
| Muted Iris | `#757693` | `--color-muted-iris` | Body text, nav links, secondary copy, helper text, footer links — a desaturated violet-gray that keeps the type hierarchy warm without competing with the brand accent |
| Border Mist | `#e5e7eb` | `--color-border-mist` | Hairline dividers, input borders, card outlines, table rules |
| Hover Iris | `#6b7280` | `--color-hover-iris` | Slightly deeper secondary text for hover/active metadata |
| Soft Blue Wash | `#dbeafe` | `--color-soft-blue-wash` | Highlighted surface tint, selected row state, subtle feature-panel background — the lightest visible blue in the palette |
| Brand Violet | `#4457ff` | `--color-brand-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Brand Violet Light | `#7583fd` | `--color-brand-violet-light` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Shadow Violet | `#c7c8e2` | `--color-shadow-violet` | Reference color for the signature blue-tinted product mockup glow — shadows are cast in violet, never gray |

## Tokens — Typography

### Thicccboi — The only typeface in the system. Display headlines at 60px weight 700, hero sublines at 44px weight 700, section headings at 34–36px weight 600, body at 16px weight 400, and labels at 12–14px weight 500. The geometric, slightly rounded sans gives the brand a friendly-but-technical voice — closer to a productivity tool than a marketing site. · `--font-thicccboi`
- **Substitute:** DM Sans, Manrope, or Inter (in that order of preference)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 24, 34, 36, 44, 60
- **Line height:** 1.00–1.63
- **Role:** The only typeface in the system. Display headlines at 60px weight 700, hero sublines at 44px weight 700, section headings at 34–36px weight 600, body at 16px weight 400, and labels at 12–14px weight 500. The geometric, slightly rounded sans gives the brand a friendly-but-technical voice — closer to a productivity tool than a marketing site.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.57 | — | `--text-body-sm` |
| body | 16px | 1.56 | — | `--text-body` |
| body-lg | 18px | 1.56 | — | `--text-body-lg` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 36px | 1.25 | — | `--text-heading` |
| heading-lg | 44px | 1.11 | — | `--text-heading-lg` |
| display | 60px | 1 | — | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| mid | 15px |
| tags | 9999px |
| cards | 24px |
| icons | 9999px |
| small | 8px |
| images | 12px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(32, 36, 138, 0.25) -19px 5px 60px 4px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Pill Button
**Role:** Main call-to-action across hero, nav, and section endings

Filled with the brand action gradient (#4457ff → #7583fd), white text in Thicccboi 16px weight 500, 9999px radius, padding 12px 24px, inline arrow icon. The gradient (not a solid fill) is what makes these buttons feel premium rather than utilitarian.

### Ghost Nav Button
**Role:** Secondary text-link in the nav (Log in)

Transparent background, Muted Iris (#757693) text weight 500, no border, no padding. Sits inline with the primary pill to its right.

### Gradient Text Accent
**Role:** Highlight a key phrase within an otherwise ink-colored headline

Apply linear-gradient(to right, #4457ff, #7583fd) as background-clip: text on a span inside the headline. Used once per major heading — overusing destroys its emphasis.

### Star Rating Badge
**Role:** Trust signal above hero and inside testimonial cards

Row of 5 small gold/yellow star icons (#fbbf24) with optional Muted Iris caption below, inline-aligned center.

### Social Platform Icon Strip
**Role:** Show supported platforms under the hero subheading

Horizontal row of 8–10 small (24px) brand-colored social icons (Instagram gradient, Facebook blue, YouTube red, TikTok, LinkedIn, X, Pinterest, Discord) at 16–20px gap, centered, no background container.

### Product Mockup Hero
**Role:** Primary hero visual on the landing page

Screenshot of the FeedHive dashboard UI, tilted at a slight perspective angle, surrounded by floating 3D-style social media icons (red heart, blue thumbs-up, red play button) at varied scales. The mockup sits on the signature blue-tinted glow (rgba(32,36,138,0.25) -19px 5px 60px 4px). Width roughly 90% of viewport, centered.

### Testimonial Card
**Role:** 4-column grid of customer quotes on social-proof sections

White #ffffff surface on the lavender canvas, 24px radius, 24px padding, no border, no shadow. Header row: 48px circular avatar (object-fit cover), name in Ink #181c31 weight 600, role/company in Muted Iris #757693 weight 400 below. Star row (#fbbf24) above the quote. Quote text in Ink #181c31, 16px weight 400, line-height 1.56.

### AI Chat Orb
**Role:** Persistent floating helper widget in bottom-right

56px circular button, solid Brand Violet #4457ff, white speech-bubble icon centered, fixed position bottom 24px right 24px, with an attached expandable panel above it that previews a greeting message.

### Trust Stats Bar
**Role:** Inline trust signal under hero sections

Single line, centered, Muted Iris #757693 weight 400 at 18px, with the numeric value highlighted in Brand Violet #4457ff weight 600. e.g. 'Trusted by +30,000 businesses, agencies and content creators.'

### Floating Social Decoration
**Role:** Atmospheric 3D-style icons scattered around the product mockup

Red heart, blue thumbs-up, red play triangle, drawn in flat solid colors with subtle inner shadow for depth. Sized 40–80px, rotated 10–25°, placed outside the mockup boundary to create a 'social buzz' feel.

### Avatar Stack
**Role:** Composite reviewer avatars shown in testimonial section header

Row of 4 overlapping 40px circular photos, each with a 2px white border, -8px horizontal overlap. Followed by star count and 'from +300 reviews' caption in Muted Iris.

## Do's and Don'ts

### Do
- Use 9999px radius for every button, tag, and icon container — pill is the default, not an option
- Set page background to Lavender Canvas #f3f5ff and use Card White #ffffff for any surface that needs to lift
- Use Thicccboi weight 700 at 60px for display headlines; never go above 60px
- Apply the brand action gradient (#4457ff → #7583fd) to exactly one CTA per screen
- Use the gradient-text treatment on a single phrase inside a headline, no more than once per section
- Cast the blue-tinted shadow only on the product mockup; keep all other UI flat
- Keep accent color usage below 5% of any screen — the violet is punctuation, not paint

### Don't
- Don't use pure white #ffffff as a page background — always use the lavender canvas so white cards have something to lift off
- Don't use pure black #000000 for text — use Ink #181c31, which carries a blue undertone matching the brand
- Don't add drop shadows to cards, buttons, or inputs — the system is flat by design
- Don't introduce a second accent color — green, red, and orange are not part of this palette
- Don't apply the gradient text effect to body copy or more than one phrase per heading
- Don't use sharp corners (0–4px) on interactive elements — pills only for buttons and tags
- Don't stack the brand violet on the lavender canvas without sufficient size or weight — it needs contrast to register

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f3f5ff` | Base background for every page — subtle lavender tint instead of white |
| 1 | Card Surface | `#ffffff` | Testimonial cards, pricing cards, feature blocks, nav bar |
| 2 | Highlighted Surface | `#dbeafe` | Selected states, highlighted info panels, gradient wash bottom stop |
| 3 | Brand Surface | `#4457ff` | Primary CTA fill, AI chat orb, gradient start |

## Elevation

- **Product Mockup / Hero Image:** `rgba(32, 36, 138, 0.25) -19px 5px 60px 4px`

## Imagery

Imagery is dominated by the in-app product screenshot, which appears once as a tilted hero mockup surrounded by floating 3D-style social media icons (red heart, blue thumbs-up, red play). Customer avatars in testimonial cards use real photography at 48px circular crops. No lifestyle photography, no illustrations, no abstract graphics beyond the floating decorations. The product UI itself is the brand's visual proof — the page sells the screen you see.

## Layout

Centered max-width container at 1200px, with the nav spanning full-bleed white above it. The hero is a single-column centered stack: star badges, large 60px headline with gradient phrase, 20px subheading, social-icon strip, CTA button, then the product mockup breaking below at near-full viewport width. Sections are separated by 80px vertical gaps with no dividers — the lavender canvas + white cards alone define the rhythm. Testimonial sections use a 4-column card grid. Floating elements (social icons, chat orb) break the container to add liveliness. No sidebar, no mega-menu — top bar only.

## Agent Prompt Guide

primary action: no distinct CTA color
Quick Color Reference:
- background: #f3f5ff (lavender canvas)
- surface: #ffffff (card white)
- text: #181c31 (ink)
- text-muted: #757693 (muted iris)
- border: #e5e7eb (border mist)
- accent: #4457ff (brand violet) — used for primary action fills, gradient text, AI orb

Example Component Prompts:
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Build a testimonial card grid: 4-column grid with 24px gap, 80px row gap. Each card is white #ffffff, 24px radius, 24px padding, no shadow, on the lavender canvas. Card header has a 48px circular avatar, name in Ink #181c31 weight 600, role in Muted Iris #757693 weight 400. Five gold #fbbf24 stars above a 16px Ink quote at line-height 1.56.

3. Build a product mockup hero: a screenshot container centered at 90% width, slightly perspective-rotated, with the signature blue-tinted shadow rgba(32,36,138,0.25) -19px 5px 60px 4px underneath. Scatter 4–6 floating 3D-style social icons (red heart, blue thumbs-up, red play) around the mockup at 40–80px sizes, rotated 10–25°.

4. Build the AI chat orb: a 56px circular button fixed bottom-right (24px inset), filled with Brand Violet #4457ff, white speech-bubble icon centered. On click, expand a 280px white panel above with 16px Ink greeting text and a 14px Muted Iris input field (1px Border Mist border, 8px radius, no focus shadow — the field's focus state uses a 2px Brand Violet ring).

5. Build a trust stats bar: a single centered line in 18px Thicccboi weight 400, Muted Iris #757693 base color, with the numeric value (e.g. '+30,000') highlighted in Brand Violet #4457ff weight 600. 80px top margin from the previous section.

## Gradient System

Only two gradients are allowed in the entire design system:

1. Brand Action Gradient — linear-gradient(to right, #4457ff, #7583fd). Used exclusively for primary CTA fills and gradient-text accents. Never applied to backgrounds, cards, or decorative shapes.

2. Lavender Surface Gradient — linear-gradient(to top, #f8f9ff, #dee7ff). Used for subtle feature-panel washes and section backgrounds. Always low-contrast — under 10% luminance shift between stops.

No diagonal brand gradients. No rainbow gradients. No mesh gradients. If a design needs more than two colors, it is not a gradient — it is an illustration and should be treated as imagery.

## Similar Brands

- **Buffer** — Same social-media-management product category with a near-white canvas and a single confident primary color
- **Typefully** — Same flat, generous-whitespace layout language with pill CTAs and a single accent hue
- **Framer** — Same flat-on-canvas approach with product screenshot as the hero visual, and a blue-violet accent
- **Linear** — Same custom geometric sans, large display headlines, and gradient text treatment on key phrases

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lavender-canvas: #f3f5ff;
  --color-card-white: #ffffff;
  --color-ink: #181c31;
  --color-muted-iris: #757693;
  --color-border-mist: #e5e7eb;
  --color-hover-iris: #6b7280;
  --color-soft-blue-wash: #dbeafe;
  --color-brand-violet: #4457ff;
  --color-brand-violet-light: #7583fd;
  --color-shadow-violet: #c7c8e2;

  /* Typography — Font Families */
  --font-thicccboi: 'Thicccboi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.11;
  --text-display: 60px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-xl-2: 15px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-mid: 15px;
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-icons: 9999px;
  --radius-small: 8px;
  --radius-images: 12px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(32, 36, 138, 0.25) -19px 5px 60px 4px;

  /* Surfaces */
  --surface-page-canvas: #f3f5ff;
  --surface-card-surface: #ffffff;
  --surface-highlighted-surface: #dbeafe;
  --surface-brand-surface: #4457ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lavender-canvas: #f3f5ff;
  --color-card-white: #ffffff;
  --color-ink: #181c31;
  --color-muted-iris: #757693;
  --color-border-mist: #e5e7eb;
  --color-hover-iris: #6b7280;
  --color-soft-blue-wash: #dbeafe;
  --color-brand-violet: #4457ff;
  --color-brand-violet-light: #7583fd;
  --color-shadow-violet: #c7c8e2;

  /* Typography */
  --font-thicccboi: 'Thicccboi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.11;
  --text-display: 60px;
  --leading-display: 1;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-xl-2: 15px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(32, 36, 138, 0.25) -19px 5px 60px 4px;
}
```
