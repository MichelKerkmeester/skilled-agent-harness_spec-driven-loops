# Planpoint — Style Reference
> Blueprint on white drafting table — an interactive property plan rendered on pristine paper, with one blue pen and one yellow highlighter for emphasis.

**Theme:** light

Planpoint uses a clean, white-canvas real estate blueprint aesthetic: generous whitespace, pill-shaped components, and bold confident display type that reads like a property floor plan drafted on quality paper. The interface is nearly monochromatic — near-black text (#1d1d1f) and white surfaces carry the entire structural weight — with a single vivid blue (#0f68ea) reserved exclusively for the primary action and a warm yellow (#ffcb00) that appears only as novelty punctuation. Components stay light and soft: large pill radii, one barely-there drop shadow at 6% opacity, and no decorative gradients or skeuomorphism. Typography is the dominant design element: Inter at extreme sizes (50–72px headlines, 144px display) with tight negative tracking gives the page architectural authority, while body text sits at a comfortable 16–18px with generous line height.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1d1d1f` | `--color-ink` | Primary text, icon strokes, dark button fills — a slightly warm near-black chosen over pure black to feel printed rather than digital |
| White | `#ffffff` | `--color-white` | Page background, card surfaces, button text on dark fills, all input fields |
| Mist | `#f0f2f4` | `--color-mist` | Subtle surface elevation, inactive button fills, secondary card backgrounds |
| Fog | `#e5e6e8` | `--color-fog` | Hairline borders, subtle dividers, section separators |
| Carbon | `#000000` | `--color-carbon` | Navigation borders, pure-black accents where maximum contrast is needed |
| Slate | `#333333` | `--color-slate` | Muted helper text, secondary image borders |
| Midnight | `#00051a` | `--color-midnight` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Signal Blue | `#0f68ea` | `--color-signal-blue` | Primary CTA fill and outline, active nav accent, the single chromatic action color in the system |
| Link Blue | `#007aff` | `--color-link-blue` | Hyperlink color, icon stroke accent — Apple-system blue used for inline text links and interactive iconography |
| Highlight | `#ffcb00` | `--color-highlight` | Yellow action color for filled buttons, selected navigation states, and focused conversion moments. |
| Deep Navy | `#000a3b` | `--color-deep-navy` | Rare dark surface for featured cards or hero blocks — a near-black with depth |

## Tokens — Typography

### Inter — Universal typeface for everything — nav, body, headings, display. Inter's geometric neutrality and broad weight range let the system scale from 14px captions to 144px display numbers without switching families. Display sizes at weight 600–700 with tight negative tracking create the site's architectural authority — headlines feel engraved, not styled. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto, sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 16, 18, 22, 23, 29, 32, 43, 50, 72, 144
- **Line height:** 1.50, 1.55, 1.60 for body; 1.10–1.30 for headings; 0.90–1.00 for display
- **Letter spacing:** -0.07em at 14px, -0.06em at 22px, -0.044em at 29px, -0.036em at 43px, -0.031em at 72px, -0.027em at 144px — aggressive negative tracking at all sizes, compressing the geometric forms for density and modernity
- **OpenType features:** `"cv11", "ss01"`
- **Role:** Universal typeface for everything — nav, body, headings, display. Inter's geometric neutrality and broad weight range let the system scale from 14px captions to 144px display numbers without switching families. Display sizes at weight 600–700 with tight negative tracking create the site's architectural authority — headlines feel engraved, not styled.

### system-ui — Minor fallback for badge and link rendering where system speed matters over Inter's polish · `--font-system-ui`
- **Substitute:** -apple-system, BlinkMacSystemFont, Segoe UI
- **Weights:** 500
- **Sizes:** 14
- **Line height:** 1.50
- **Letter spacing:** -0.0410em
- **Role:** Minor fallback for badge and link rendering where system speed matters over Inter's polish

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | -0.98px | `--text-caption` |
| body-sm | 16px | 1.6 | -1.07px | `--text-body-sm` |
| body | 18px | 1.55 | -1.17px | `--text-body` |
| subheading | 22px | 1.3 | -1.32px | `--text-subheading` |
| heading-sm | 29px | 1.25 | -1.28px | `--text-heading-sm` |
| heading | 43px | 1.15 | -1.55px | `--text-heading` |
| heading-lg | 50px | 1.1 | -1.65px | `--text-heading-lg` |
| display | 72px | 1 | -2.23px | `--text-display` |
| display-xl | 144px | 0.9 | -3.89px | `--text-display-xl` |

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
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 108 | 108px | `--spacing-108` |
| 140 | 140px | `--spacing-140` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 46.8px |
| cards | 28.8px |
| badges | 100px |
| inputs | 18px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.06) 0px 8px 48px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 14px

## Components

### Primary Pill Button
**Role:** Main call-to-action — the single filled blue button

Filled with #0f68ea (Signal Blue), white text at 16px Inter weight 500–600, fully rounded at 100px radius, padding 20px 22px. Sits prominently in nav and hero. One soft shadow at rgba(0,0,0,0.06) 0px 8px 48px 0px gives it lift without heaviness.

### Dark Pill Button
**Role:** Secondary navigation CTA in header

Dark fill (#1d1d1f Ink), white text, 100px radius, 22px padding horizontal, 20px vertical. Used for nav-level actions like "Free trial" where the blue would compete with primary content CTAs.

### Outline Pill Button
**Role:** Tertiary or paired action

Transparent fill, 1px border in #1d1d1f or #ffffff, matching text color, 100px radius, 22px padding. Used for "See what's new" and "Book a demo" paired beneath hero video.

### New Badge
**Role:** Novelty indicator on features or announcements

Yellow fill (#ffcb00 Highlight), dark text (#1d1d1f) at 14px Inter weight 500, fully rounded pill (100px), padding 2px 10px. Appears as warm punctuation next to feature names like "Redesigned Editor".

### Hero Section
**Role:** First-screen value proposition

White canvas, centered headline at 72px Inter weight 700 with -2.23px tracking, #1d1d1f color. Subhead at 18px in #1d1d1f or muted gray. Below: a 16:9 video embed with a solid blue (#0f68ea) background frame and white play button.

### Video Embed Frame
**Role:** Product demonstration container

Full-bleed #0f68ea blue background panel containing the video player. The blue frame makes the video the page's visual anchor and reinforces the brand color as action-driven.

### Trust Headline
**Role:** Social proof section title

Centered at 43px Inter weight 600, #1d1d1f, -1.55px tracking, with two lines: "Trusted by successful developers, property owners & marketing teams alike."

### Logo Cloud
**Role:** Client/partner logos grid

Logos displayed in 3-row grids of 6–7 columns, each logo in a #f0f2f4 (Mist) pill-shaped container with 18px radius. Logos rendered in their native brand colors to add visual variety while the neutral containers keep rhythm consistent.

### Top Navigation Bar
**Role:** Site-wide header

White background, 64–80px tall. Left: blue diamond logo + "Planpoint" wordmark in #1d1d1f. Center-left: text nav links in 16px Inter weight 500, #1d1d1f. Right: language flag icon, "Support", "Login" text links, then dark pill CTA "Free trial" with right-arrow icon.

### Card Surface
**Role:** Content containers, logo tiles, feature blocks

White (#ffffff) or Mist (#f0f2f4) background, 28.8px border radius, 24px padding. Optional 1px border in #f0f2f4 or #e5e6e8. Soft shadow at rgba(0,0,0,0.06) 0px 8px 48px 0px for elevation when needed.

### Input Field
**Role:** Form text inputs (not visible in screenshots but implied by system)

White fill, 1px border in #e5e6e8 (Fog), 18px radius, 16px Inter placeholder text in #333333. Focus state: border shifts to #0f68ea Signal Blue.

## Do's and Don'ts

### Do
- Use Inter weight 700 at 50–72px for all page-level headlines with tracking between -1.65px and -2.23px — the tight negative tracking is what makes display type feel engraved.
- Use #0f68ea Signal Blue exclusively for the primary action button and active nav states; never as a background fill for cards or decorative blocks.
- Apply 100px border-radius to all buttons and tags — pill geometry is a signature element, not optional rounding.
- Use #ffcb00 Highlight only for novelty or status badges (≤1% of screen area); warm punctuation, not surface fill.
- Stack surfaces as #ffffff (base) → #f0f2f4 (elevated) → #0f68ea (brand) to maintain a clear elevation hierarchy without relying on heavy shadows.
- Maintain generous section gaps of 80px between major page sections; the spacious density is what gives the white canvas room to breathe.
- Use #1d1d1f Ink for all text and icon strokes — never #000000, the slight warmth reads as printed rather than digital.

### Don't
- Do not use #0f68ea as a text color for body copy or headings; it is an action color, not a typographic color.
- Do not apply gradients anywhere in the system — the blueprint aesthetic depends on flat, matte surfaces.
- Do not add decorative shadows beyond rgba(0,0,0,0.06) 0px 8px 48px 0px; heavier shadows break the lightweight feel.
- Do not use square or low-radius buttons (under 50px); the pill shape is non-negotiable.
- Do not introduce additional accent hues (greens, purples, reds) — the system is bichromatic plus yellow, and adding colors dilutes the brand.
- Do not use #ffffff borders on white surfaces; borders must be at least #f0f2f4 to remain visible.
- Do not set display type below weight 600 or above 72px without a specific reason — the 700/72px combination is the signature lockup.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background — the white drafting paper |
| 1 | Surface | `#f0f2f4` | Card backgrounds, logo containers, inactive button fills — subtle elevation above canvas |
| 2 | Brand Surface | `#0f68ea` | Video frame, hero accent panel — the only chromatic surface |
| 3 | Dark Surface | `#000a3b` | Rare deep accent for featured cards or contrast sections |
| 4 | Accent Surface | `#ffcb00` | Novelty badges, status indicators — warm highlight puncturing the cool palette |

## Elevation

- **Primary CTA Button:** `rgba(0, 0, 0, 0.06) 0px 8px 48px 0px`
- **Elevated Card:** `rgba(0, 0, 0, 0.06) 0px 8px 48px 0px`
- **Hero Video Frame:** `rgba(0, 0, 0, 0.06) 0px 8px 48px 0px`

## Imagery

Photography is minimal — the design relies on product UI screenshots embedded in a video demo rather than lifestyle or property photography. The video player and product interface captures do the visual storytelling. The logo cloud uses brand-colored wordmarks in muted neutral pill containers, letting each partner's identity contribute a small chromatic moment without overwhelming the page. Icons are stroke-based, minimal, and rendered in #1d1d1f — small, functional, never decorative. The overall visual language is UI-first: screens, dashboards, and plan viewers, not photography.

## Layout

Max-width 1200px centered container, generous 80px section gaps. The hero is a centered text stack (badge → headline → subhead → video) on a white canvas, with the video framed in a full-width #0f68ea blue band that breaks out of the max-width constraint. Below the hero: a centered button pair (outline pills) on white space, followed by a social proof section with a centered 43px headline and a 3-row logo cloud grid. Navigation is a top-fixed bar with horizontal text links and a right-aligned dark pill CTA. The rhythm is vertical and stack-based — no sidebar, no asymmetric split layouts, just centered blocks with breathing room.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffffff
- surface: #f0f2f4
- text: #1d1d1f
- border: #e5e6e8
- accent: #0f68ea (Signal Blue)
- badge: #ffcb00 (Highlight)
- primary action: #0f68ea (filled action)

**Example Component Prompts**

1. Create a hero section: white (#ffffff) background. Centered "New" badge — yellow (#ffcb00) pill fill, #1d1d1f text at 14px Inter weight 500, 100px radius, 2px 10px padding. Headline at 72px Inter weight 700, #1d1d1f, letter-spacing -2.23px. Subhead at 18px Inter weight 400, #1d1d1f, line-height 1.55. Below: a full-width blue (#0f68ea) band containing a 16:9 video player with a centered white play button.

2. Create a primary CTA button: #0f68ea fill, white text, 16px Inter weight 600, 100px border-radius, 20px 22px padding, soft shadow rgba(0,0,0,0.06) 0px 8px 48px 0px.

3. Create a logo cloud row: 6–7 items in a horizontal grid, each logo inside a #f0f2f4 pill container with 18px border-radius and 14px padding. Logos centered, rendered at native colors.

4. Create a top navigation bar: white background, 72px height. Left: blue diamond logo glyph + "Planpoint" wordmark in #1d1d1f. Center: 16px Inter weight 500 nav links in #1d1d1f. Right: "Support" and "Login" text links, then a dark (#1d1d1f) pill button "Free trial" with white text, 100px radius, 20px 22px padding, and a right-arrow icon.

5. Create a trust headline section: centered 43px Inter weight 600, #1d1d1f, letter-spacing -1.55px, line-height 1.15. Two lines of text on white background with 80px vertical padding above and below.

## Similar Brands

- **Mapbox** — Same white-canvas approach with a single vivid blue accent and bold display type for a map/data product
- **Figma** — Pill-shaped buttons, clean white surface stack, and aggressive negative tracking on display type
- **Linear** — Spacious layout, Inter typeface, near-black text (#1d1d1f family), and minimal shadow usage for a product UI feel
- **Arc browser** — Near-monochrome palette with one chromatic action color and pill geometry on all interactive elements
- **Vercel** — Centered hero stacks, generous section gaps, Inter at extreme sizes with tight tracking, and flat matte surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1d1d1f;
  --color-white: #ffffff;
  --color-mist: #f0f2f4;
  --color-fog: #e5e6e8;
  --color-carbon: #000000;
  --color-slate: #333333;
  --color-midnight: #00051a;
  --color-signal-blue: #0f68ea;
  --color-link-blue: #007aff;
  --color-highlight: #ffcb00;
  --color-deep-navy: #000a3b;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.98px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -1.07px;
  --text-body: 18px;
  --leading-body: 1.55;
  --tracking-body: -1.17px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: -1.32px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -1.28px;
  --text-heading: 43px;
  --leading-heading: 1.15;
  --tracking-heading: -1.55px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.65px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.23px;
  --text-display-xl: 144px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -3.89px;

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
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-108: 108px;
  --spacing-140: 140px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-2xl: 18px;
  --radius-3xl: 28.8px;
  --radius-3xl-2: 46.8px;
  --radius-full: 57.6px;
  --radius-full-2: 100px;
  --radius-full-3: 160px;

  /* Named Radii */
  --radius-tags: 46.8px;
  --radius-cards: 28.8px;
  --radius-badges: 100px;
  --radius-inputs: 18px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.06) 0px 8px 48px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-surface: #f0f2f4;
  --surface-brand-surface: #0f68ea;
  --surface-dark-surface: #000a3b;
  --surface-accent-surface: #ffcb00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1d1d1f;
  --color-white: #ffffff;
  --color-mist: #f0f2f4;
  --color-fog: #e5e6e8;
  --color-carbon: #000000;
  --color-slate: #333333;
  --color-midnight: #00051a;
  --color-signal-blue: #0f68ea;
  --color-link-blue: #007aff;
  --color-highlight: #ffcb00;
  --color-deep-navy: #000a3b;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.98px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -1.07px;
  --text-body: 18px;
  --leading-body: 1.55;
  --tracking-body: -1.17px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: -1.32px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -1.28px;
  --text-heading: 43px;
  --leading-heading: 1.15;
  --tracking-heading: -1.55px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.65px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.23px;
  --text-display-xl: 144px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -3.89px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-108: 108px;
  --spacing-140: 140px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-2xl: 18px;
  --radius-3xl: 28.8px;
  --radius-3xl-2: 46.8px;
  --radius-full: 57.6px;
  --radius-full-2: 100px;
  --radius-full-3: 160px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.06) 0px 8px 48px 0px;
}
```
