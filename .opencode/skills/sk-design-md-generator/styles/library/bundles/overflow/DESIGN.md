# Overflow — Style Reference
> blueprint washed in indigo

**Theme:** light

Overflow speaks in a near-whisper designer vernacular: a paper-cream canvas, one deep midnight-navy brand ink, a single sky-blue accent, and the rest rendered in honest monochrome. The page breathes — generous 80–120px section gaps, 24px card radii, 12px button radii, and very low-opacity shadows that barely register. Product UI is always shown in a macOS chrome frame floating over a soft indigo-to-sky gradient wash, signalling "this is a designer's tool for design people". Type is Inter at its tightest tracking — headings pull -0.025em, creating dense, confident blocks that sit beside lots of white space rather than filling it. The dark filled button is the only moment of full contrast on the page; everything else is quietly layered neutrals.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#161637` | `--color-midnight-ink` | Headings, navigation wordmark, key emphasis — a desaturated indigo-black that reads as navy without screaming blue, anchoring the typographic system |
| Sky Accent | `#0085e4` | `--color-sky-accent` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Onyx | `#000000` | `--color-onyx` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#fafafc` | `--color-paper-white` | Page canvas, card surfaces, button text on dark — a barely-warm white that prevents the harsh clinical feel of pure #ffffff |
| Mist Gray | `#f0f0f2` | `--color-mist-gray` | Alternate section background, input fields, subtle inset surfaces — the secondary canvas that separates bands without hard dividers |
| Graphite | `#666666` | `--color-graphite` | Secondary body text, supporting copy, subdued metadata — readable but never competing with headings |
| Hairline | `#dadce0` | `--color-hairline` | Borders, dividers, card outlines — the thinnest structural line, only visible where it defines an edge |
| Indigo Wash | `linear-gradient(127deg, #7272fb 0%, #b8e1ff 99%)` | `--color-indigo-wash` | Hero gradient start — a soft periwinkle that sets the dawn-wash atmosphere of the first viewport |
| Signal Blue | `linear-gradient(90deg, #007bff 0%, #62aeff 100%)` | `--color-signal-blue` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### Inter — Single-family system. Headlines pull Inter's tightest tracking (-0.025em at display sizes) to feel dense and considered; body sits at standard tracking with 1.5–1.6 line height for comfortable reading. Weight 700 is the hero headline voice, weight 500–600 for section headings, weight 400 for body. · `--font-inter`
- **Substitute:** Inter (Google Fonts) or system-ui as fallback
- **Weights:** 400, 500, 550, 600, 700, 800
- **Sizes:** 12px, 14px, 15px, 16px, 20px, 24px, 26px, 32px, 48px, 56px
- **Line height:** 1.00, 1.07, 1.14, 1.25, 1.33, 1.42, 1.50, 1.57, 1.60
- **Letter spacing:** -1.4px at 56px, -1.0px at 48px, -0.6px at 32px, -0.4px at 24px, -0.24px at 20px, -0.16px at 16px, -0.12px at 15px, -0.08px at 14px, 0.71px (0.071em) for uppercase labels at 12px
- **Role:** Single-family system. Headlines pull Inter's tightest tracking (-0.025em at display sizes) to feel dense and considered; body sits at standard tracking with 1.5–1.6 line height for comfortable reading. Weight 700 is the hero headline voice, weight 500–600 for section headings, weight 400 for body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.071px | `--text-caption` |
| body-sm | 14px | 1.57 | -0.08px | `--text-body-sm` |
| subheading | 20px | 1.42 | -0.24px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.4px | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.6px | `--text-heading` |
| heading-lg | 48px | 1.14 | -1px | `--text-heading-lg` |
| display | 56px | 1.07 | -1.4px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 156 | 156px | `--spacing-156` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 24px |
| pills | 9999px |
| inputs | 8px |
| buttons | 12px |
| product-frame | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.08) 0px 4px 16px -8px` | `--shadow-md` |
| lg | `rgba(0, 0, 0, 0.08) 0px 8px 20px -7px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32px
- **Element gap:** 12-16px

## Components

### Top Navigation Bar
**Role:** Persistent header with brand identity and primary entry point

Full-width bar with Paper White background (#fafafc), logo left (Overflow wordmark in Midnight Ink #161637), centered link group (Product, Examples, Blog, Pricing) in Graphite (#666666) weight 500 at 15px, and a dark filled button on the right. 12px radius on the CTA. ~64px tall, sits directly on the canvas with no border or shadow.

### Dark Filled Button
**Role:** Primary filled button — the only maximum-contrast interactive in the system

Onyx (#000000) background, Paper White (#fafafc) text, weight 600 at 15px, 12px radius, 16px vertical × 24px horizontal padding. 13px internal spacing. Used for the main conversion path (Download, Sign up). No shadow; the solid black fill provides all the visual weight needed.

### Ghost / Outlined Button
**Role:** Secondary interactive — steps back from the dark filled button

Paper White background, Hairline (#dadce0) border 1px, Onyx text, 12px radius, 8–12px vertical × 16–20px horizontal padding. Lower visual weight makes the dark filled button win on the same screen.

### Hero Gradient Banner
**Role:** First-viewport atmospheric container with centered headline and product shot

Full-bleed linear-gradient(127deg, #7272fb 0%, #b8e1ff 99%) background. Centered stack: display headline (56px, weight 700, white, -1.4px tracking), subheading (20px, weight 400, white at 90% opacity, -0.24px tracking), then dark filled button. Product screenshot floats below, partially cropped at the viewport edge, contained in a macOS-style window frame.

### Product Window Frame
**Role:** macOS-chrome container wrapping app screenshots throughout the page

Rounded 24px outer radius, white background, subtle shadow rgba(0,0,0,0.08) 0px 8px 20px -7px. Top bar has three traffic-light dots (red, yellow, green) on the left and a centered file label in Graphite. Sits at full opacity over gradient washes in the hero, and over flat sections elsewhere.

### Feature Card
**Role:** 3-column grid card in the "Discover your new superpowers" section

24px radius, white (#fafafc or #ffffff) background, 1px Hairline (#dadce0) border or very low-opacity shadow rgba(0,0,0,0.08) 0px 4px 16px -8px. 32px internal padding. Heading at 24px weight 700 in Onyx, illustration block above. Some cards swap to a vivid blue gradient fill (linear-gradient(90deg, #007bff, #62aeff)) with white text as visual punctuation in the grid.

### Logo Bar
**Role:** Trust strip of well-known brand wordmarks

Single horizontal row, evenly spaced, all logos rendered in Onyx (#000000) at 60–70% opacity. No color logos. Sits centered on the canvas with generous 40–60px vertical padding above and below. Caption above the row at 14px Graphite centered.

### Text Input
**Role:** Form fields in pricing, signup, and inline flows

8px radius, Mist Gray (#f0f0f2) background, 1px transparent border that becomes Midnight Ink on focus, Graphite placeholder, 12px vertical × 16px horizontal padding. No label — placeholder-only convention.

### Color Accent Card
**Role:** Punctuation card that breaks the monochrome feature grid

Same 24px radius and 32px padding as the regular feature card, but the entire surface is a Signal Blue gradient (linear-gradient(90deg, #007bff 0%, #62aeff 100%)) with white heading and a small product preview composite. Used once per 3-card row to break the rhythm and direct the eye.

### Speech / Comment Bubble
**Role:** In-card illustration element showing team feedback

White background, 12px radius, subtle 1px Hairline border, small circular avatar at 40px, Graphite text at 14px. No tail, no shadow — the geometry does the work.

### Progress / Check Dial
**Role:** Circular confirmation element in the "Share only when ready" card

Circular ring with 75% arc in Sky Accent (#0085e4) and 25% in Hairline (#dadce0), check mark centered in Onyx. No surrounding card chrome — sits directly in the card canvas.

### Section Heading Block
**Role:** Left-aligned section opener used for feature bands

Heading-lg (48px) or heading (32px) at weight 700 in Onyx, tight tracking (-1.0px or -0.6px). No subtitle or eyebrow in the data — the heading stands alone. Sits flush left, not centered.

## Do's and Don'ts

### Do
- Use 24px radius for all cards and 12px for all buttons — the two-radius system is the signature
- Apply Inter tracking of -0.025em on any text 40px or larger; never let headlines breathe with positive spacing
- Place the dark filled button (#000 background, #fafafc text, 12px radius) as the single conversion path on any screen
- Wrap every product screenshot in a macOS window frame with three traffic-light dots and 24px outer radius
- Reserve the Signal Blue gradient (linear-gradient(90deg, #007bff, #62aeff)) for at most one card per 3-card grid row to create rhythm
- Keep section vertical gaps at 80–120px; the page should feel like it has air between thoughts
- Use Midnight Ink (#161637) for any heading that needs to carry weight without becoming a button

### Don't
- Do not introduce a new chromatic accent — Sky Accent (#0085e4) is the only blue in the system
- Do not use 9999px pill radius on feature buttons; pills are reserved for tags and status indicators
- Do not apply shadows darker than rgba(0,0,0,0.08) or larger blur than 20px — the elevation is meant to barely register
- Do not center-align section headings; Overflow keeps them flush left
- Do not use Inter weight 300 or 200 — the thinnest weight in the system is 400
- Do not use pure #ffffff for card surfaces; the slight warmth of #fafafc prevents clinical flatness
- Do not stack more than two shadows on a single element; the design relies on a single low-opacity elevation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fafafc` | Default page background and base layer for all content |
| 1 | Alt Section | `#f0f0f2` | Secondary band background for visual separation without hard dividers |
| 2 | Card Surface | `#fafafc` | Feature cards and product frames sit on this same near-white, distinguished only by border or shadow |
| 3 | Dark Surface | `#000000` | Filled button background — the only dark surface, used for the singular conversion path |

## Elevation

- **Feature Card:** `rgba(0, 0, 0, 0.08) 0px 4px 16px -8px`
- **Product Window Frame:** `rgba(0, 0, 0, 0.08) 0px 8px 20px -7px`

## Imagery

Overflow's visual language is product-screenshot-first, never photography. Every product image appears inside a macOS chrome frame with three traffic-light dots (red/yellow/green) and a centered file label, sitting over either a soft indigo-to-sky gradient wash (hero) or the flat Paper White canvas (later sections). The hero gradient is a true atmospheric backdrop — lavender fading to pale blue at 127 degrees. Feature cards use flat geometric illustration: speech bubbles with circular avatars, circular progress dials, simplified device frames, and small UI mocks. No stock photography, no people in lifestyle contexts, no 3D renders. The only "warm" visual is the gradient; everything else is clean line and flat fill.

## Layout

Max-width 1200px centered container with full-bleed gradient sections that break out. Hero is a single full-viewport gradient band with centered headline stack and a product window frame that extends below the fold. Feature sections follow as 3-column card grids with flush-left section headings above. Logo bar is a single centered horizontal row with generous vertical padding. The page rhythm alternates between the full-bleed indigo hero, flat Paper White product demo sections, and the white 3-card feature grid — no sidebar, no asymmetric layouts, no sticky elements beyond the top nav. Vertical spacing between bands is 80–120px, creating the sense of a scrollable designer's presentation deck rather than a dense product page.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Onyx) for body and strong type, #161637 (Midnight Ink) for headings
- background: #fafafc (Paper White) for canvas, #f0f0f2 (Mist Gray) for alt bands
- border: #dadce0 (Hairline) at 1px
- accent: #0085e4 (Sky Accent) for links and small interactive highlights
- primary action: no distinct CTA color

Example Component Prompts:

1. Hero section: Full-bleed background linear-gradient(127deg, #7272fb 0%, #b8e1ff 99%). Centered display headline at 56px Inter weight 700, white, letter-spacing -1.4px. Subhead at 20px Inter weight 400, white, letter-spacing -0.24px, max-width 640px. Filled dark button below: #000000 background, #fafafc text, 12px radius, 16px 24px padding, 15px Inter weight 600. Product window frame below at 90% page width, 24px outer radius, white background, traffic-light dots top-left, shadow rgba(0,0,0,0.08) 0px 8px 20px -7px.

2. Feature card grid: 3-column grid with 24px gap. Each card: #fafafc background, 24px radius, 1px #dadce0 border or shadow rgba(0,0,0,0.08) 0px 4px 16px -8px, 32px padding. Heading at 24px Inter weight 700 #000000, letter-spacing -0.4px. Illustration block 120–180px tall above the heading. The middle card of each row may use a Signal Blue gradient background (linear-gradient(90deg, #007bff, #62aeff)) with white heading text instead.

3. Filled dark button: #000000 background, #fafafc text, 12px radius, 16px vertical × 24px horizontal padding, 15px Inter weight 600, letter-spacing -0.12px. No shadow. Use for the single primary action on any screen.

4. Logo bar: Centered horizontal row of grayscale brand wordmarks, all in #000000 at 65% opacity, 24px gap between logos, 40–60px vertical padding above and below. Optional caption above at 14px Inter weight 400 #666666.

5. Input field: 8px radius, #f0f0f2 background, 1px transparent border (becomes #161637 on focus), Graphite #666666 placeholder text, 15px Inter weight 400, 12px vertical × 16px horizontal padding. Placeholder-only, no visible label.

## Similar Brands

- **Figma** — Same near-white canvas, Inter-family type at tight tracking, rounded cards with low-opacity shadows, and product screenshots presented as the hero — designer-tool aesthetic with monochrome restraint
- **Framer** — Shares the cream-white surface, bold display headlines with negative tracking, generous section breathing room, and the macOS-chrome product frame convention
- **Webflow** — Light minimalism with one deep-navy brand ink, Inter typography, flat illustration inside feature cards, and a single dark filled button as the only maximum-contrast element
- **InVision** — Same era and category of design collaboration tool, light cream canvas, soft gradient hero washes behind product UI, and the trust-logo bar pattern

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #161637;
  --color-sky-accent: #0085e4;
  --color-onyx: #000000;
  --color-paper-white: #fafafc;
  --color-mist-gray: #f0f0f2;
  --color-graphite: #666666;
  --color-hairline: #dadce0;
  --color-indigo-wash: #7272fb;
  --gradient-indigo-wash: linear-gradient(127deg, #7272fb 0%, #b8e1ff 99%);
  --color-signal-blue: #007bff;
  --gradient-signal-blue: linear-gradient(90deg, #007bff 0%, #62aeff 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.071px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.08px;
  --text-subheading: 20px;
  --leading-subheading: 1.42;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.4px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1px;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: -1.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w550: 550;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-156: 156px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-full: 139px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 24px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;
  --radius-product-frame: 24px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 4px 16px -8px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 8px 20px -7px;

  /* Surfaces */
  --surface-page-canvas: #fafafc;
  --surface-alt-section: #f0f0f2;
  --surface-card-surface: #fafafc;
  --surface-dark-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #161637;
  --color-sky-accent: #0085e4;
  --color-onyx: #000000;
  --color-paper-white: #fafafc;
  --color-mist-gray: #f0f0f2;
  --color-graphite: #666666;
  --color-hairline: #dadce0;
  --color-indigo-wash: #7272fb;
  --color-signal-blue: #007bff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.071px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.08px;
  --text-subheading: 20px;
  --leading-subheading: 1.42;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.4px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1px;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: -1.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-156: 156px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-full: 139px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 4px 16px -8px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 8px 20px -7px;
}
```
