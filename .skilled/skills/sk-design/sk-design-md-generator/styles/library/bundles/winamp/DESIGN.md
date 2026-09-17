# Winamp — Style Reference
> Tilted phone cards fanning across bone paper

**Theme:** light

Winamp's visual system is an exercise in near-total color restraint — a bone-white canvas, ink-black type, and thin neutral hairlines carry every screen. The Poppins geometric sans does the heavy lifting, scaling from a whisper-thin 12px caption up to a 69px display headline that anchors the hero. The only chromatic moment is a small ember-orange lightning bolt reserved for the logo, making the brand mark feel like a switch being thrown against an otherwise monochrome room. Form language is rectilinear and modest: 8px on controls, 16px on cards, no shadows, no gradients. The signature move is the layered, slightly tilted device mockups in the hero — flat rectangles rotated a few degrees to create depth without resorting to elevation, giving the page a playful, almost paper-craft dimensionality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#f7f7f7` | `--color-bone-white` | Page canvas and section backgrounds — warmer than pure white, makes the ink-black type feel printed rather than digital |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, raised panels, and inset blocks — the one step brighter than the canvas for subtle layering without shadows |
| Ink Black | `#09090b` | `--color-ink-black` | Primary text, headlines, and key borders — near-black with a faint cool cast that feels editorial rather than utilitarian |
| Carbon | `#18181b` | `--color-carbon` | Filled action buttons and dark accent surfaces — one step lighter than Ink Black, reads as solid graphite against the white canvas |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills, fine borders, and structural rules — the absolute dark for highest-contrast iconography |
| Slate | `#71717a` | `--color-slate` | Secondary nav text, helper text, and subtle UI marks — mid-gray that stays legible without competing with Ink Black headings |
| Ash | `#a1a1aa` | `--color-ash` | Muted body text, placeholder, and de-emphasized links — the quietest readable gray for tertiary information |
| Mist | `#d4d4d8` | `--color-mist` | Hairline nav borders and the lightest dividers — barely-there structural lines |
| Ember Orange | `#e95420` | `--color-ember-orange` | Logo lightning bolt and the single brand accent — appears almost exclusively as the Winamp mark, making it feel like a power indicator rather than a decoration |

## Tokens — Typography

### Rubik — Rubik — detected in extracted data but not described by AI · `--font-rubik`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.5
- **Role:** Rubik — detected in extracted data but not described by AI

### Poppins — Primary typeface across all UI — geometric humanist sans with rounded terminals. The 69px hero weight uses 500/600 to avoid feeling shouty; the 24px subhead at 700 is the heaviest moment in the system. Rounded geometry softens the strict monochrome grid. · `--font-poppins`
- **Substitute:** DM Sans or Nunito Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 15px, 19px, 24px, 34px, 69px
- **Line height:** 1.13, 1.18, 1.25, 1.33, 1.50, 1.60, 1.62
- **Letter spacing:** -0.022em applied across the scale, converting to roughly -0.26px at 12px up to -1.52px at the 69px display size
- **Role:** Primary typeface across all UI — geometric humanist sans with rounded terminals. The 69px hero weight uses 500/600 to avoid feeling shouty; the 24px subhead at 700 is the heaviest moment in the system. Rounded geometry softens the strict monochrome grid.

### system-ui sans-serif — Fallback for tiny utility labels and icon-adjacent microcopy where loading Poppins would be wasted weight · `--font-system-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Fallback for tiny utility labels and icon-adjacent microcopy where loading Poppins would be wasted weight

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 700
- **Sizes:** 24px
- **Line height:** 1.33
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.264px | `--text-caption` |
| body | 15px | 1.6 | -0.33px | `--text-body` |
| subheading | 19px | 1.5 | -0.418px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.528px | `--text-heading-sm` |
| heading | 34px | 1.25 | -0.748px | `--text-heading` |
| display | 69px | 1.13 | -1.518px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| buttons | 8px |
| navElements | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Horizontal bar on #f7f7f7 canvas, transparent background, ~64px tall. Logo at far left (24px tall, Ember Orange lightning bolt + Ink Black wordmark). Nav links in Poppins 15px/500, Ink Black with 24px horizontal spacing between items. Right side holds a text link ('Log in to Creators') with 1px Ink Black underline, a filled Carbon button ('Contact us'), and a ghost icon button for the language selector. No bottom border — spacing alone separates nav from content.

### Filled Dark Button
**Role:** Primary action — the single high-emphasis CTA

Carbon (#18181b) background, Paper White (#ffffff) text in Poppins 15px/500. 8px border-radius. Horizontal padding 20px, vertical padding ~10px. No border, no shadow. The dark fill against the bone canvas creates the system's only true visual anchor — it reads as a solid slab, not a soft pill.

### Ghost Icon Button
**Role:** Utility controls like the language/region selector

8px radius, transparent background on the bone canvas, 1px Slate or Mist border at low contrast. Contains a single monochrome icon (flag glyph) in Pure Black or Ink Black at ~20px. No hover fill — the border darkens from Mist to Ink Black on interaction.

### Underlined Text Link
**Role:** Secondary actions and nav-adjacent links

Poppins 15px/500 in Ink Black with a 1px Ink Black underline offset ~2px below the baseline. No background, no padding. The underline is structural, not decorative — it's the link affordance.

### Hero Display Headline
**Role:** Page-level title — the largest type in the system

Poppins 69px/500, Ink Black, letter-spacing -1.52px, line-height 1.13. Left-aligned. No gradient, no accent color. The weight 500 (not 700) is a deliberate choice: it lets the sheer size carry authority rather than the stroke weight, keeping the hero calm rather than aggressive.

### Hero Body Text
**Role:** Supporting paragraph under the display headline

Poppins 19px/400, Slate (#71717a), line-height 1.5. Max-width ~480px to keep paragraph measure readable. No link styling within hero body.

### Tilted Device Card
**Role:** Hero visual element — phone mockup with photographic content

Portrait-oriented card, ~280×560px, Paper White (#ffffff) surface with a 16px border-radius. Contains a full-bleed photo (warm-toned portrait) inside. Multiple cards are stacked with slight rotation (±8 to ±12 degrees) and horizontal offset, creating a fanned cascade. The tilt is the depth — no shadows, no gradients, no z-axis blur. Images maintain rounded corners clipped to the card radius.

### Scroll Indicator
**Role:** Bottom-of-hero prompt to continue scrolling

Centered micro-component: 'Scroll' in Poppins 12px/500 Ash, a small downward chevron icon in Ink Black, then 'down' in 12px/500 Ash. 8px gap between elements. Sits ~40px below the hero content. The most delicate UI element — it disappears as you scroll.

### Subtle Card Surface
**Role:** Content cards used in secondary sections

Paper White (#ffffff) background on the bone canvas, 16px radius, 24px internal padding, no border, no shadow. The contrast between #ffffff and #f7f7f7 is the only elevation signal. Content uses Ink Black headings (19px/600) and Slate body (15px/400).

## Do's and Don'ts

### Do
- Use Poppins for all text — system-ui fallback is only for 12px utility labels
- Set the hero headline to exactly 69px weight 500 with letter-spacing -1.52px; never bold the display
- Use Carbon (#18181b) fills with white text for the only filled button variant; every other interactive element should be ghost or text-only
- Apply 16px radius to cards and device mockups, 8px to buttons and nav controls — never use pill (9999px) shapes
- Maintain the bone canvas (#f7f7f7) as the page background and use #ffffff only for raised cards
- Limit Ember Orange to the logo and brand mark; do not use it for buttons, links, or decorative accents
- Keep section gaps at 40px and element gaps at 10px to preserve the comfortable, breathing rhythm

### Don't
- Do not introduce chromatic colors outside the Ember Orange logo accent — the system is monochrome
- Do not add box-shadows or drop-shadows to cards, buttons, or mockups — use surface lightness or rotation instead
- Do not use gradient fills — none exist in the current system and the bone-and-ink aesthetic would collapse under them
- Do not set the display headline above 69px or below 34px — those are the system's floor and ceiling
- Do not apply border-radius above 16px — anything rounder breaks the rectilinear, paper-craft feel
- Do not use Slate (#71717a) for primary headings or body emphasis; reserve it for secondary and helper text
- Do not place text directly on photographic backgrounds without a Paper White card surface behind it

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f7f7f7` | Page-wide background, never painted over — cards float on this |
| 1 | Card | `#ffffff` | Raised content blocks and device mockup frames |
| 2 | Ink Surface | `#18181b` | Dark CTA buttons and inverse accent blocks |

## Elevation

The system deliberately avoids box-shadows and drop-shadows. Depth is communicated through three mechanisms only: (1) surface lightness contrast between #f7f7f7 canvas and #ffffff cards, (2) rotation/tilt on hero imagery, and (3) the dark fill of the Carbon button acting as a visual weight. This keeps the interface feeling flat, printed, and editorial — closer to a magazine spread than a glass-morphism app.

## Imagery

Imagery is warm-toned, human-centered photography presented exclusively inside tilted device mockups. Photos feature young adults in candid, joyful moments (smiling, embracing) with golden-hour lighting and amber-orange color grading that visually rhymes with the Ember Orange logo accent. Treatment is contained — never full-bleed — always clipped to a 16px-rounded card frame and rotated 8–12 degrees. No illustrations, no abstract graphics, no 3D renders. Iconography is monochrome outlined, ~1.5px stroke weight, Pure Black on light surfaces. The visual density is low: one hero composite per page, no decorative imagery elsewhere.

## Layout

Page model is max-width 1200px centered with generous lateral padding. The hero is a 50/50 split: text stack left-aligned in the left half (max-width ~480px), layered tilted device cards occupying the right half. No full-bleed sections, no dark bands. Vertical rhythm is uniform — every section separated by 40px of bone canvas. Content arrangement is single-column or two-column alternating (text-left/image-right or text-right/image-left). No card grids in the hero, but secondary sections can use a 3-column card grid with 24px gutters. Navigation is a single top bar, non-sticky. The scroll indicator at the foot of the hero is the only dynamic UI element visible at rest.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #09090b
- text (secondary): #71717a
- background (canvas): #f7f7f7
- background (card): #ffffff
- border: #09090b or #d4d4d8
- primary action: no distinct CTA color
- brand accent: #e95420 (Ember Orange — logo only)

**Example Component Prompts**
1. Hero headline: 'Winamp' at 69px Poppins weight 500, #09090b, letter-spacing -1.52px, line-height 1.13, left-aligned on #f7f7f7 canvas. No background, no accent color.
2. Filled action button: Carbon (#18181b) background, #ffffff text in Poppins 15px/500, 8px border-radius, 20px horizontal padding, 10px vertical padding. No border, no shadow. White-space above and below the text is the button's total height.
3. Tilted device card: 280×560px #ffffff surface with 16px radius, containing a full-bleed warm-toned photograph clipped to the same radius. Rotate -10 degrees, offset 40px from the next card in the stack.
4. Content card (secondary section): #ffffff background, 16px radius, 24px padding, no border. Heading in Poppins 19px/600 #09090b, body in Poppins 15px/400 #71717a. The 1-step lightness difference from the #f7f7f7 canvas is the only elevation.
5. Ghost nav icon button: 8px radius, transparent background, 1px #d4d4d8 border, 20px Pure Black icon centered inside, 32×32px total size.

## Similar Brands

- **Linear** — Shares the monochrome-first approach with one chromatic accent reserved for the brand mark, plus generous whitespace and rectilinear cards with modest rounding
- **Notion** — Same bone-canvas-plus-paper-white surface stacking without shadows, comfortable density, and a geometric sans (Poppins-adjacent) carrying all typographic weight
- **Vercel** — Extreme color restraint with near-black text on warm off-white, tight letter-spacing on large display type, and 8–16px radius discipline
- **Things 3 (Cultured Code)** — Soft grayscale palette with photographic imagery contained in rounded device frames, and a signature accent color used almost exclusively as a brand mark

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #f7f7f7;
  --color-paper-white: #ffffff;
  --color-ink-black: #09090b;
  --color-carbon: #18181b;
  --color-pure-black: #000000;
  --color-slate: #71717a;
  --color-ash: #a1a1aa;
  --color-mist: #d4d4d8;
  --color-ember-orange: #e95420;

  /* Typography — Font Families */
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.264px;
  --text-body: 15px;
  --leading-body: 1.6;
  --tracking-body: -0.33px;
  --text-subheading: 19px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.418px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.528px;
  --text-heading: 34px;
  --leading-heading: 1.25;
  --tracking-heading: -0.748px;
  --text-display: 69px;
  --leading-display: 1.13;
  --tracking-display: -1.518px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-buttons: 8px;
  --radius-navelements: 8px;

  /* Surfaces */
  --surface-canvas: #f7f7f7;
  --surface-card: #ffffff;
  --surface-ink-surface: #18181b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #f7f7f7;
  --color-paper-white: #ffffff;
  --color-ink-black: #09090b;
  --color-carbon: #18181b;
  --color-pure-black: #000000;
  --color-slate: #71717a;
  --color-ash: #a1a1aa;
  --color-mist: #d4d4d8;
  --color-ember-orange: #e95420;

  /* Typography */
  --font-rubik: 'Rubik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui-sans-serif: 'system-ui sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.264px;
  --text-body: 15px;
  --leading-body: 1.6;
  --tracking-body: -0.33px;
  --text-subheading: 19px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.418px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.528px;
  --text-heading: 34px;
  --leading-heading: 1.25;
  --tracking-heading: -0.748px;
  --text-display: 69px;
  --leading-display: 1.13;
  --tracking-display: -1.518px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
}
```
