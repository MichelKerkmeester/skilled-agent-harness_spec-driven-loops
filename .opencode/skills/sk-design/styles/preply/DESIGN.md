# Preply — Style Reference
> Pink billboard with human stickers

**Theme:** light

Preply projects a warm, confident energy built on saturated pink hero canvases, near-black typography, and white product surfaces. The visual system is deliberately loud in the top fold to express brand personality, then quiets down into a calm black-and-white catalog of tutors and content once the user moves into functional areas. Platform (a chunky, high-contrast display face) carries all headings at weight 700 with very tight tracking and line-heights, making 48–96px headlines read as solid blocks of voice rather than delicate type. Figtree handles all UI and body text at moderate weights with slightly looser tracking. Components are flat and rectangular — 4px and 8px corners are the only soft edge in the system, and shadows are nearly absent. Photography is integral: real tutor/learner portraits are cropped, slightly rotated, and layered with black text stickers, giving the brand a handmade, scrapbook-like quality that contrasts the structured grid below.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Preply Pink | `#ff7aac` | `--color-preply-pink` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Midnight Ink | `#121117` | `--color-midnight-ink` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Soft White | `#ffffff` | `--color-soft-white` | Page canvas above the pink hero, card surfaces, tutor catalog backgrounds, button text on dark fills |
| Mist Gray | `#f4f4f8` | `--color-mist-gray` | Subtle page background for content sections that need separation from pure white |
| Smoke | `#dcdce5` | `--color-smoke` | Card borders, input outlines, dividers — structural hairlines that define the catalog grid |
| Pewter | `#6a697c` | `--color-pewter` | Card border accent and tertiary text, slightly cooler than Midnight Ink for layered hierarchy |
| Graphite | `#4d4c5c` | `--color-graphite` | Body copy, icon strokes, secondary text — the readable neutral that lives between Midnight Ink headings and lighter helper text |
| Pure Black | `#000000` | `--color-pure-black` | Icon fills, decorative sticker text, and any place where the absolute black is needed for photographic overlay |
| Signal Yellow | `#ffdf3d` | `--color-signal-yellow` | Accent highlights, announcement bar background, decorative stickers — used sparingly as a callout color over pink |
| Sky Pop | `#99c5ff` | `--color-sky-pop` | Secondary accent, tag chips, and decorative illustration — the cool counterpoint to pink in multicolor compositions |

## Tokens — Typography

### Platform — All headlines, section titles, hero copy, and the largest display text. Weight 700 dominates from 32px upward, creating dense, confident type blocks. The 1.00–1.08 line-heights at 48–96px make headlines read as solid slabs. Tracking tightens with size: -0.005em at body, -0.017em at display. · `--font-platform`
- **Substitute:** Mulish, Inter, or Manrope at matching weights
- **Weights:** 400, 600, 700
- **Sizes:** 14, 16, 20, 24, 32, 48, 64, 96
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.07px at 14px, -0.08px at 16px, -0.20px at 20px, -0.24px at 24px, -0.16px at 32px, -0.24px at 48px, -0.32px at 64px, -0.48px at 96px (progression from -0.005em at small to -0.005em tightening; dominant -0.005em across stack)
- **Role:** All headlines, section titles, hero copy, and the largest display text. Weight 700 dominates from 32px upward, creating dense, confident type blocks. The 1.00–1.08 line-heights at 48–96px make headlines read as solid slabs. Tracking tightens with size: -0.005em at body, -0.017em at display.

### Figtree — Body copy, UI labels, button text, card content, nav, links, footer text, and form fields. Weight 400 for paragraphs, weight 600 for emphasis and button labels. Line-height 1.43–1.71 at 14–18px gives body copy comfortable air. Letter-spacing stays near zero to slightly positive (+0.01 to +0.012em) for legible small sizes. · `--font-figtree`
- **Substitute:** DM Sans, Plus Jakarta Sans, or Nunito Sans
- **Weights:** 400, 600
- **Sizes:** 12, 13, 14, 16, 18, 20
- **Line height:** 1.00–1.71
- **Letter spacing:** -0.06px at 12px, +0.065px at 13px, +0.14px at 14px, +0.16px at 16px, +0.18px at 18px, +0.20px at 20px
- **Role:** Body copy, UI labels, button text, card content, nav, links, footer text, and form fields. Weight 400 for paragraphs, weight 600 for emphasis and button labels. Line-height 1.43–1.71 at 14–18px gives body copy comfortable air. Letter-spacing stays near zero to slightly positive (+0.01 to +0.012em) for legible small sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.06px | `--text-caption` |
| body | 16px | 1.5 | 0.16px | `--text-body` |
| subheading | 20px | 1.4 | 0.2px | `--text-subheading` |
| heading-sm | 24px | 1.33 | 0.24px | `--text-heading-sm` |
| heading | 32px | 1.2 | 0.16px | `--text-heading` |
| heading-lg | 48px | 1.13 | 0.24px | `--text-heading-lg` |
| display | 64px | 1.08 | 0.32px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| inputs | 4px |
| buttons | 4px |
| stickers | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Filled Dark Action Button
**Role:** Primary conversion button (Find your tutor, Get started)

Background #121117, text #ffffff, Figtree 16px weight 600, border-radius 4px, padding 14px 24px, inline arrow icon (→) at 16px. No border, no shadow. Hover lightens to #2a2935 or lifts text color slightly.

### Outlined Ghost Button
**Role:** Secondary actions in the nav and inline CTAs

Transparent background, 1px border #121117, text #121117, Figtree 14px weight 600, border-radius 4px, padding 8px 16px. Becomes filled dark on hover.

### Language Tutor Card
**Role:** Catalog entry in the subject grid (English tutors, Spanish tutors, etc.)

White #ffffff background, 1px border #dcdce5, border-radius 8px, padding 16px 20px. Left-aligned icon at 32px (line illustration in #121117), Platform 20px weight 700 title, Figtree 13px weight 400 teacher count in #4d4c5c, right chevron (›) at 20px in #121117. Hover adds subtle background tint #f4f4f8.

### Sticker Text Label
**Role:** Decorative rotated text tags layered on hero photography

Background #121117, text #ffffff, Figtree 14px weight 600, border-radius 4px, padding 4px 10px. Sits at slight rotation (-5° to +5°) on top of photo tiles. Examples: 'Miki C. / Tutor', 'Roberto / Learner'.

### Top Utility Bar
**Role:** Announcement strip above the main nav

Background #121117, text #ffffff, Figtree 13px weight 400, centered content with optional inline flag emoji. 40px tall, single line, includes a right-side close (×) icon.

### Main Navigation
**Role:** Site-wide primary nav

White #ffffff background, 64px tall. Left: logo (Preply wordmark in #121117). Center: nav links in Figtree 14px weight 400 #121117, 24px horizontal spacing. Right: language/currency selector, help icon, and outlined 'Log in' button with 1px #121117 border, 4px radius.

### Stat Strip
**Role:** Social proof bar below the hero (100,000+ tutors, 4.8 stars, etc.)

White background, 5-column flex row, 48px vertical padding. Each stat: Platform 32px weight 700 #121117 for the number, Figtree 13px weight 400 #4d4c5c for the caption below. No dividers, generous horizontal spacing of ~57px between columns.

### Hero Headline Block
**Role:** Primary fold headline on pink background

Platform weight 700 at 64–96px, line-height 1.06–1.08, color #121117, max-width ~560px, left-aligned on the pink #ff7aac canvas. Subhead in Figtree 18px weight 400 #121117 at 24px top margin.

### Hero Photo Collage
**Role:** Right-side hero visual on pink background

Two overlapping portrait photos with 4px radius, slight rotation (-3° and +3°), black text stickers layered on top, large rotated black 'Progress Takes Two' wordmark with white text filling the middle. Photos extend off the right edge.

### Footer Column
**Role:** Site link directory in dark footer

Background #121117, 4-column grid. Column headings in Figtree 14px weight 600 uppercase #ffffff. Links in Figtree 14px weight 400 #dcdce5, 8px row gap, 32px top gap between heading and first link.

### Subject Grid Section
**Role:** 3×3 catalog of language subjects

3-column grid, 16px row and column gap, white background. Each cell is a Language Tutor Card. Section has 64px vertical padding.

### Section Heading
**Role:** Mid-page section titles (Progress starts with the right tutor)

Center-aligned, Platform 48px weight 700 #121117, line-height 1.13, max-width ~800px. Subhead below in Figtree 18px weight 400 #4d4c5c, 16px top margin.

## Do's and Don'ts

### Do
- Use Platform weight 700 for every heading from 32px upward; never go below weight 600 for headlines.
- Reserve #ff7aac for full-bleed section backgrounds and brand moments — never paint a single component pink.
- Set filled action buttons to #121117 with white text, 4px radius, 14px 24px padding, and a trailing → icon.
- Layer real, slightly rotated photos with black text stickers on pink backgrounds; keep the collage energy in hero zones.
- Keep borders at 1px #dcdce5 or 1px #6a697c — the catalog grid is defined by hairlines, not shadows.
- Anchor all body copy in Figtree weight 400 with line-height 1.43–1.71; let the comfortable air do the work.
- Use 4px and 8px as the only two corner radii in the system; 16px is reserved for one-off decorative surfaces.

### Don't
- Don't apply #ff7aac to buttons, links, or interactive surfaces — it is a canvas, not a control.
- Don't introduce drop shadows or multi-layer elevations; the system is flat and hairline-driven.
- Don't use rounded radii above 8px on functional components (cards, inputs, buttons).
- Don't set headline line-height above 1.2 — Platform is designed to sit tight at scale.
- Don't mix the pink with heavy gradients or filters; the pink is always solid and unmodulated.
- Don't use Figtree for display sizes above 32px — let Platform carry anything that big.
- Don't crowd the white catalog with color; keep tutor cards monochrome and let the pink sections do the talking.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pink Hero Canvas | `#ff7aac` | Full-bleed top fold and occasional brand sections |
| 1 | Mist Page | `#f4f4f8` | Default body section background |
| 2 | Pure White | `#ffffff` | Cards, tutor catalog rows, elevated content surfaces |
| 3 | Midnight Footer | `#121117` | Inverted footer and rare dark UI zones |

## Elevation

- **Language Tutor Card:** `none — defined only by 1px #dcdce5 border on #ffffff`
- **Sticker Label:** `none — flat, relies on rotation to read as layered`

## Imagery

Photography is the signature visual asset. Real tutor and learner portraits are cropped to head-and-shoulders, placed on the pink hero, and slightly rotated (±3°) to create a scrapbook composition. Black rectangular text stickers are layered directly on the photos. On content sections below the fold, photography is largely absent — the catalog relies on simple black line illustrations of landmarks (Eiffel Tower, Brandenburg Gate, torii gates) at 32px next to tutor subject titles. No lifestyle or stock photography appears; every portrait is specific, present, and personal.

## Agent Prompt Guide

**Quick Color Reference**
- text: #121117
- background: #ffffff (content) / #ff7aac (hero canvas)
- border: #dcdce5
- accent: #ff7aac (brand canvas only), #ffdf3d (highlight)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a hero section: #ff7aac full-bleed background, left-aligned headline in Platform 64px weight 700 #121117 with line-height 1.08, subhead in Figtree 18px weight 400 #121117, filled action button #121117 with #ffffff text, 4px radius, 14px 24px padding, trailing → icon. On the right, two overlapping portrait photos with 4px radius and ±3° rotation, each with a black #121117 text sticker (4px radius, Figtree 14px weight 600 #ffffff).
2. Build a language subject card: #ffffff background, 1px #dcdce5 border, 8px radius, 16px 20px padding. Left-aligned line icon at 32px in #121117, title in Platform 20px weight 700 #121117, caption in Figtree 13px weight 400 #4d4c5c, right chevron › at 20px in #121117.
3. Build the main navigation: #ffffff background, 64px tall. Left wordmark 'Preply' in Figtree 18px weight 600 #121117. Center links in Figtree 14px weight 400 #121117 with 24px horizontal gap. Right outlined 'Log in' button — transparent background, 1px #121117 border, 4px radius, 8px 16px padding, Figtree 14px weight 600 #121117.
4. Build the stat strip: #ffffff background, 48px vertical padding, 5-column row with ~57px horizontal gap. Each stat uses Platform 32px weight 700 #121117 for the number and Figtree 13px weight 400 #4d4c5c for the caption directly below.
5. Build the footer column block: #121117 background, 4-column grid with 32px column gap. Column heading in Figtree 14px weight 600 uppercase #ffffff, links in Figtree 14px weight 400 #dcdce5 with 8px row gap, 32px top gap before first link.

## Layout

Page model: max-width 1200px centered for content sections, with the hero going full-bleed on pink. Hero pattern: left-aligned headline + subhead + single dark filled CTA on the left half, photo collage with stickers on the right half. Below the hero, a white stat strip spans the full content width with 5 evenly spaced columns. Content sections alternate between white and mist backgrounds separated by 64px vertical padding. The language catalog is a 3-column grid of hairline-bordered cards with 16px gaps. Headings center-align from 48px and up; body content left-aligns. Navigation is a flat white bar, not sticky. The footer is dark, full-bleed #121117, with 4 equal columns of links plus a second tier of SEO-style link blocks. No sidebar, no mega-menu.

## Similar Brands

- **Duolingo** — Equally loud brand color treatment and bold display typography, though Duolingo leans more illustrative where Preply uses real photography.
- **Cambly** — Same language-learning market and similar use of real tutor portraits as the emotional center of the hero.
- **Headspace** — Confident display-type-at-scale paired with a single saturated brand color and flat, shadow-free components.
- **Italki** — Catalog of tutor subjects rendered in a clean white grid with hairline borders, sitting below a personality-driven hero.
- **Babbel** — Black-and-white product UI that lets a single brand color carry the entire top-fold personality.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-preply-pink: #ff7aac;
  --color-midnight-ink: #121117;
  --color-soft-white: #ffffff;
  --color-mist-gray: #f4f4f8;
  --color-smoke: #dcdce5;
  --color-pewter: #6a697c;
  --color-graphite: #4d4c5c;
  --color-pure-black: #000000;
  --color-signal-yellow: #ffdf3d;
  --color-sky-pop: #99c5ff;

  /* Typography — Font Families */
  --font-platform: 'Platform', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.06px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.24px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.16px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: 0.24px;
  --text-display: 64px;
  --leading-display: 1.08;
  --tracking-display: 0.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-stickers: 4px;

  /* Surfaces */
  --surface-pink-hero-canvas: #ff7aac;
  --surface-mist-page: #f4f4f8;
  --surface-pure-white: #ffffff;
  --surface-midnight-footer: #121117;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-preply-pink: #ff7aac;
  --color-midnight-ink: #121117;
  --color-soft-white: #ffffff;
  --color-mist-gray: #f4f4f8;
  --color-smoke: #dcdce5;
  --color-pewter: #6a697c;
  --color-graphite: #4d4c5c;
  --color-pure-black: #000000;
  --color-signal-yellow: #ffdf3d;
  --color-sky-pop: #99c5ff;

  /* Typography */
  --font-platform: 'Platform', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.06px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.24px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.16px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: 0.24px;
  --text-display: 64px;
  --leading-display: 1.08;
  --tracking-display: 0.32px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
}
```
