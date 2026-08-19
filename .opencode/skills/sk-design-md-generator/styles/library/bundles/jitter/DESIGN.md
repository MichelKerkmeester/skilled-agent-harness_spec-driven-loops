# Jitter — Style Reference
> kinetic playground in a Swiss design studio — soft white surfaces, pill-shaped cards, and a violet spark firing on near-black ink.

**Theme:** light

Jitter reads as a kinetic playground rendered in Swiss-design precision. The canvas is a soft off-white (#f2f1f3) with bright white cards floating on it via diffuse, multi-layer shadows that bleed across more than 150px of vertical space. A near-black ink (#19171c) carries the majority of the UI — headlines, nav, buttons, body — with a deeply saturated violet (#7a40ed) acting as a brand spark for hero CTAs, tags, and feature highlights. Secondary punctuation comes from a vivid cyan-blue (#00b2ff) and an electric yellow-green (#f5ff63). Typography splits the work: TWK Lausanne (a custom geometric grotesque) takes the stage at 48–200px with aggressive negative tracking, while Inter handles everything 26px and below with quiet competence. The geometry is rounded to the point of pill-shaped — cards and buttons share 40–50px radii, so every surface feels like a soft cushion rather than a hard tile.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Studio Off-White | `#f2f1f3` | `--color-studio-off-white` | Page canvas and recessed section backgrounds — the base layer on which every card and panel sits |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, elevated panels, text on dark fills, button labels on filled buttons |
| Hairline Gray | `#e5e4e7` | `--color-hairline-gray` | Subtle borders, divider lines, and muted card backgrounds |
| Soft Mist | `#97979b` | `--color-soft-mist` | Muted secondary text and placeholder labels |
| Slate | `#6e6e73` | `--color-slate` | Body copy in card contexts, secondary descriptive text |
| Ink | `#19171c` | `--color-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Pure Black | `#000000` | `--color-pure-black` | Icon fills, footer text, maximum-contrast dark surfaces |
| Eclipse Violet | `#7a40ed` | `--color-eclipse-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Plum | `#17082c` | `--color-deep-plum` | Dark violet, near-black with purple cast — headings on light surfaces where an extra brand warmth is needed |
| Lilac Wash | `#a981ff` | `--color-lilac-wash` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lavender Mist | `#cab3f8` | `--color-lavender-mist` | Pale violet — secondary link backgrounds and highlight washes |
| Electric Blue | `#00b2ff` | `--color-electric-blue` | Secondary accent — animated highlight rings, icon accents, card border highlights |
| Sky Tint | `#e6f4ff` | `--color-sky-tint` | Cool blue-tinted card backgrounds and soft highlight washes |
| Ice Blue | `#a9dbff` | `--color-ice-blue` | Mid-saturation blue — decorative fills inside illustration and animated graphics |
| Volt | `#f5ff63` | `--color-volt` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### TWK Lausanne — Display and heading typeface — handles everything from 16px subheads up to a 200px hero. The 750/800 weights carry the brand voice at large sizes; the condensed letter-spacing pulls characters tight so headlines feel engineered rather than set. Line-heights compress below 1.0 at display sizes (0.85–0.95), making the hero feel dense and architectural rather than airy. · `--font-twk-lausanne`
- **Substitute:** Inter Tight, Switzer, or General Sans
- **Weights:** 500, 600, 700, 750, 800
- **Sizes:** 16, 18, 20, 21, 24, 36, 40, 48, 72, 80, 200
- **Line height:** 0.85, 0.90, 0.95, 1.00, 1.20, 1.38, 1.50, 2.50
- **Letter spacing:** -0.044em at 200px display, -0.032em at 80px, -0.037em at 72px, -0.030em at 48px, -0.020em at 24px, -0.010em at 16px
- **Role:** Display and heading typeface — handles everything from 16px subheads up to a 200px hero. The 750/800 weights carry the brand voice at large sizes; the condensed letter-spacing pulls characters tight so headlines feel engineered rather than set. Line-heights compress below 1.0 at display sizes (0.85–0.95), making the hero feel dense and architectural rather than airy.

### Inter — UI and body typeface — nav labels, button text, card descriptions, badge copy, form inputs, and the 26px sub-heading tier. Inter carries the weight of small-to-medium text across the entire interface while TWK Lausanne does the display work above 36px. Negative tracking is modest (-0.017 to -0.023em) and only applied at 15px and above. · `--font-inter`
- **Substitute:** Inter (already on Google Fonts)
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 12, 13, 14, 15, 16, 17, 18, 26
- **Line height:** 1.10, 1.14, 1.15, 1.20, 1.25, 1.40, 1.41, 1.50, 1.60
- **Letter spacing:** -0.023em at 18px, -0.020em at 16–17px, -0.017em at 15px, 0 at 12–14px
- **Role:** UI and body typeface — nav labels, button text, card descriptions, badge copy, form inputs, and the 26px sub-heading tier. Inter carries the weight of small-to-medium text across the entire interface while TWK Lausanne does the display work above 36px. Negative tracking is modest (-0.017 to -0.023em) and only applied at 15px and above.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 21px | 1.38 | — | `--text-subheading` |
| heading-sm | 26px | 1.25 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.15 | — | `--text-heading-lg` |
| display | 80px | 0.95 | -2.56px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 60 | 60px | `--spacing-60` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 84 | 84px | `--spacing-84` |
| 100 | 100px | `--spacing-100` |
| 144 | 144px | `--spacing-144` |
| 180 | 180px | `--spacing-180` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 40px |
| badges | 40px |
| inputs | 26px |
| buttons | 50px |
| nav-elements | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(25, 23, 28, 0.01) 0px 152px 61px 0px, rgba(25, 23, 2...` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.01) 0px 63px 25px 0px, rgba(0, 0, 0, 0.05...` | `--shadow-xl-2` |
| subtle | `rgb(255, 255, 255) 1px 0px 0px 0px, rgb(255, 255, 255) -1...` | `--shadow-subtle` |
| xl-3 | `rgba(0, 0, 0, 0.01) 0px 119px 48px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-xl-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-40px
- **Element gap:** 8-12px

## Components

### Navigation Header
**Role:** Top-level site navigation

White background, 20px radius on grouped link containers, logo on the left in #19171c, nav links at 14–16px Inter weight 500 in #19171c, a ghost 'Log in' text link, and a dark filled CTA button on the right edge. Sticky on scroll. Height approximately 64px.

### Dark Filled Pill Button
**Role:** Primary navigation and high-emphasis action

50px border-radius (full pill), fill #19171c, text #ffffff at 14–16px Inter weight 500–600, horizontal padding 20–24px, vertical padding 10–12px. Used for the 'Try for free' nav CTA and 'Browse 300+ free templates' overlay button. The 50px radius forces a capsule shape regardless of label length.

### Violet Filled Pill Button
**Role:** Hero call-to-action and brand-forward action

50px border-radius, fill #7a40ed, text #ffffff at 16px Inter weight 600, padding 16px 32px. Larger scale than the dark button — sits alone in the hero as the singular brand-colored action on the page.

### Pill Badge / Tag
**Role:** Section label and category tag

40px border-radius, small padding 4–8px vertical, 12–16px horizontal. Background varies: lilac wash #cab3f8 for category tags, Volt #f5ff63 for attention/warning tags, lilac #a981ff for highlighted labels. Text at 12–14px Inter weight 500 in #17082c or #19171c. Always appears above a section heading as a kicker.

### Circular Menu Button
**Role:** Mobile/overlay menu toggle

Perfectly circular (375px radius equivalent), fill #19171c, white hamburger icon centered. Sits flush to the top-right of the header alongside the dark CTA.

### Animation Preview Card
**Role:** Animated content showcase tile

White #ffffff fill, 40px border-radius, padding 0 (edge-to-edge media). Rises off the canvas via the signature layered shadow: rgba(25,23,28,0.01) 0 152px 61px, rgba(25,23,28,0.05) 0 85px 51px, rgba(25,23,28,0.09) 0 38px 38px, rgba(25,23,28,0.10) 0 9px 21px. The shadow extends 150px+ vertically — cards feel like they hover far above the page.

### Logo Cloud Strip
**Role:** Social proof band of partner/customer logos

Sits on the page canvas (#f2f1f3), one-line intro text centered above in 14px Inter weight 500 #6e6e73. Logos in #19171c at roughly 20–24px height, evenly spaced with 40–60px gap. No dividers between logos — the row is one continuous line of trust signals.

### Hero Section
**Role:** Above-the-fold introduction

Centered layout on the off-white canvas. A small pill badge at the top, an 80px TWK Lausanne headline below in #19171c, a single violet CTA centered beneath, then the logo cloud. No hero image — the visual weight comes from the large display type alone.

### Two-Column Feature Section
**Role:** Text + media content blocks

Asymmetric split: left column holds a 40–48px TWK Lausanne heading and Inter body copy, right column holds an Animation Preview Card. On alternate sections the order flips. Gap between columns approximately 40–64px, section padding 80–120px vertical.

### Template Card Grid
**Role:** Browseable template gallery

Horizontal-scrolling row of Animation Preview Cards, 4–5 visible at once on desktop. Each card is 40px radius with the same hover-shadow elevation. Overlay dark pill button ('Browse 300+ free templates') floats above the row as a forward action.

### Inline Text Link
**Role:** Standalone text link with brand color

14–16px Inter weight 500 in #7a40ed, no underline by default, underline appears on hover. Used for 'Learn more' inline CTAs and footer links.

### Dark Input Field
**Role:** Text input on dark surface

26px border-radius, fill #2d2933, text #ffffff at 14–16px Inter weight 400, padding 12–16px. Placeholder text in a muted desaturated tone of the dark surface.

### Hamburger Overlay Panel
**Role:** Mobile/expanded navigation menu

Full-viewport overlay in #ffffff with 40px outer padding, list of nav items at 24–32px TWK Lausanne weight 600 in #19171c, stacked vertically with 16–24px gap. Closes via a circular dark button in the top-right corner.

## Do's and Don'ts

### Do
- Use #7a40ed for the singular hero CTA on a page — it should appear alone, not repeated across multiple action surfaces.
- Set border-radius to 50px on all buttons and 40px on all cards, badges, and preview tiles — the capsule/pillow geometry is the signature.
- Use TWK Lausanne (or Inter Tight as substitute) at 80px weight 750+ for hero display with letter-spacing -0.032em and line-height 0.95.
- Use the four-layer diffused shadow stack on all elevated cards — the 150px+ vertical spread is what makes elements feel like they float.
- Keep body and UI copy in Inter at 14–18px weight 400–500 in #19171c, reserving #6e6e73 for secondary descriptive text.
- Apply the lilac pill badge (#cab3f8) above section headings as a category kicker — one badge per section, never stacked.
- Limit accent color usage: one violet CTA per view, optional cyan-blue (#00b2ff) and Volt (#f5ff63) reserved for tag/status contexts only.

### Don't
- Do not use sharp corners or radii below 20px anywhere — the rounded geometry is non-negotiable.
- Do not place the violet CTA (#7a40ed) in the navigation bar; nav-level CTAs should be the dark #19171c fill.
- Do not use raw #000000 for body text or button fills — always use #19171c to keep the brand-violet undertone alive.
- Do not apply shadows with hard edges or single-layer low-blur values; the multi-layer diffuse stack at low opacity is the system.
- Do not use the Volt yellow (#f5ff63) on a dark background without confirming it has a dark text label — the contrast is so extreme it functions as a warning.
- Do not set display type above 26px in Inter — Inter is for UI, TWK Lausanne owns everything 36px and up.
- Do not introduce a fourth chromatic accent beyond violet, blue, and Volt — the system runs on chromatic scarcity.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Studio Off-White | `#f2f1f3` | Page canvas — the base layer everything else sits on |
| 1 | Pure White | `#ffffff` | Card surfaces and animation preview tiles |
| 2 | Hairline Gray | `#e5e4e7` | Muted recessed panels and subtle background shifts |
| 3 | Ink | `#19171c` | Dark surface — filled buttons, header on dark mode, high-contrast blocks |

## Elevation

- **Animation Preview Card (hovered):** `0px 152px 61px 0px rgba(25,23,28,0.01), 0px 85px 51px 0px rgba(25,23,28,0.05), 0px 38px 38px 0px rgba(25,23,28,0.09), 0px 9px 21px 0px rgba(25,23,28,0.10)`
- **Template Card (resting):** `0px 119px 48px 0px rgba(0,0,0,0.01), 0px 67px 40px 0px rgba(0,0,0,0.05), 0px 30px 30px 0px rgba(0,0,0,0.09), 0px 7px 16px 0px rgba(0,0,0,0.10)`
- **Floating overlay element:** `0px 63px 25px 0px rgba(0,0,0,0.01), 0px 35px 21px 0px rgba(0,0,0,0.05), 0px 16px 16px 0px rgba(0,0,0,0.09), 0px 4px 9px 0px rgba(0,0,0,0.10)`

## Imagery

Visuals are dominated by product-generated animation previews — short looping motion clips rendered as rounded-corner video tiles. No lifestyle photography, no human subjects, no environment shots. The motion previews are the imagery: abstract geometric loops, type animations, icon morphs, and UI mockups in motion. All sit on pure white with 40px radius. Supporting graphics include flat duotone illustrations in violet-to-plum gradient (#7a40ed → #17082c) and lilac-to-lavender gradient (#a981ff → #cab3f8) used for section backgrounds. No raster photography appears anywhere.

## Layout

Max-width 1200px centered, generous 80–120px vertical breathing room between sections. The page is a vertical stack of horizontal bands on the #f2f1f3 canvas. Each band is either: (1) a centered hero stack (badge → headline → CTA → logo cloud), (2) a two-column asymmetric block (text-left/media-right alternating), or (3) a horizontal-scrolling card row of animation previews. No sidebar, no persistent navigation rail — navigation is a single sticky top bar. The hero is typographic (no hero image); the visual interest escalates as the user scrolls into the animation preview cards. Sections flow seamlessly without dividers, separated only by whitespace.

## Agent Prompt Guide

## Quick Color Reference
- text: #19171c
- background: #f2f1f3
- card surface: #ffffff
- border: #e5e4e7
- accent: #7a40ed
- primary action: no distinct CTA color

## Example Component Prompts
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Animation preview card**: Pure white #ffffff fill, 40px border-radius, edge-to-edge video content. Hovered state applies the four-layer shadow: rgba(25,23,28,0.01) 0 152px 61px, rgba(25,23,28,0.05) 0 85px 51px, rgba(25,23,28,0.09) 0 38px 38px, rgba(25,23,28,0.10) 0 9px 21px. No visible border.


4. **Template card grid row**: Five Animation Preview Cards in a horizontal row with 20px gap, each 40px radius on the #f2f1f3 canvas. A dark filled pill button ('Browse 300+ free templates', #19171c fill, white text, 50px radius) floats centered over the row.

5. **Pill badge above section heading**: Background #a981ff, text #17082c, 12px Inter weight 600, 40px border-radius, padding 4px 14px. Sits 8–12px above a 40–48px TWK Lausanne heading in #19171c.

## Similar Brands

- **Figma** — Same white-canvas design-tool aesthetic with pill buttons, soft rounded cards, and tight geometric typography at display sizes
- **Framer** — Identical playfulness: off-white canvas, violet brand accent, oversized display headlines with aggressive negative tracking, and a focus on motion as the primary content
- **Linear** — Same near-black ink (#19171c variant) for primary surfaces, pill-shaped controls, and a strict approach to accent color as functional punctuation rather than decoration
- **Pitch** — Similar Swiss-design type treatment, generous vertical section gaps, and a violet-forward brand palette on a light canvas
- **Spline** — Same product-showcase-first approach where motion previews replace photography, on rounded white cards floating over soft off-white

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-studio-off-white: #f2f1f3;
  --color-pure-white: #ffffff;
  --color-hairline-gray: #e5e4e7;
  --color-soft-mist: #97979b;
  --color-slate: #6e6e73;
  --color-ink: #19171c;
  --color-pure-black: #000000;
  --color-eclipse-violet: #7a40ed;
  --color-deep-plum: #17082c;
  --color-lilac-wash: #a981ff;
  --color-lavender-mist: #cab3f8;
  --color-electric-blue: #00b2ff;
  --color-sky-tint: #e6f4ff;
  --color-ice-blue: #a9dbff;
  --color-volt: #f5ff63;

  /* Typography — Font Families */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -2.56px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-w750: 750;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-100: 100px;
  --spacing-144: 144px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-40px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 26px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 375px;

  /* Named Radii */
  --radius-cards: 40px;
  --radius-badges: 40px;
  --radius-inputs: 26px;
  --radius-buttons: 50px;
  --radius-nav-elements: 20px;

  /* Shadows */
  --shadow-xl: rgba(25, 23, 28, 0.01) 0px 152px 61px 0px, rgba(25, 23, 28, 0.05) 0px 85px 51px 0px, rgba(25, 23, 28, 0.09) 0px 38px 38px 0px, rgba(25, 23, 28, 0.1) 0px 9px 21px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.01) 0px 63px 25px 0px, rgba(0, 0, 0, 0.05) 0px 35px 21px 0px, rgba(0, 0, 0, 0.09) 0px 16px 16px 0px, rgba(0, 0, 0, 0.1) 0px 4px 9px 0px;
  --shadow-subtle: rgb(255, 255, 255) 1px 0px 0px 0px, rgb(255, 255, 255) -1px 0px 0px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.01) 0px 119px 48px 0px, rgba(0, 0, 0, 0.05) 0px 67px 40px 0px, rgba(0, 0, 0, 0.09) 0px 30px 30px 0px, rgba(0, 0, 0, 0.1) 0px 7px 16px 0px;

  /* Surfaces */
  --surface-studio-off-white: #f2f1f3;
  --surface-pure-white: #ffffff;
  --surface-hairline-gray: #e5e4e7;
  --surface-ink: #19171c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-studio-off-white: #f2f1f3;
  --color-pure-white: #ffffff;
  --color-hairline-gray: #e5e4e7;
  --color-soft-mist: #97979b;
  --color-slate: #6e6e73;
  --color-ink: #19171c;
  --color-pure-black: #000000;
  --color-eclipse-violet: #7a40ed;
  --color-deep-plum: #17082c;
  --color-lilac-wash: #a981ff;
  --color-lavender-mist: #cab3f8;
  --color-electric-blue: #00b2ff;
  --color-sky-tint: #e6f4ff;
  --color-ice-blue: #a9dbff;
  --color-volt: #f5ff63;

  /* Typography */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.38;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -2.56px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-100: 100px;
  --spacing-144: 144px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 26px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 375px;

  /* Shadows */
  --shadow-xl: rgba(25, 23, 28, 0.01) 0px 152px 61px 0px, rgba(25, 23, 28, 0.05) 0px 85px 51px 0px, rgba(25, 23, 28, 0.09) 0px 38px 38px 0px, rgba(25, 23, 28, 0.1) 0px 9px 21px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.01) 0px 63px 25px 0px, rgba(0, 0, 0, 0.05) 0px 35px 21px 0px, rgba(0, 0, 0, 0.09) 0px 16px 16px 0px, rgba(0, 0, 0, 0.1) 0px 4px 9px 0px;
  --shadow-subtle: rgb(255, 255, 255) 1px 0px 0px 0px, rgb(255, 255, 255) -1px 0px 0px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.01) 0px 119px 48px 0px, rgba(0, 0, 0, 0.05) 0px 67px 40px 0px, rgba(0, 0, 0, 0.09) 0px 30px 30px 0px, rgba(0, 0, 0, 0.1) 0px 7px 16px 0px;
}
```
