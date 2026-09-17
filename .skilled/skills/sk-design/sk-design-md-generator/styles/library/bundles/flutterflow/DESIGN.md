# FlutterFlow — Style Reference
> violet control room at midnight

**Theme:** dark

FlutterFlow's design system is a midnight workspace for app builders: near-black canvas (#060311) with deep violet energy radiating from gradient orbs and glowing CTAs. Urbanist, an understated geometric sans, carries the brand voice with generous letter-spacing that makes even 100px headlines feel architectural rather than shouty. The interface follows a clear three-tier surface stack — Obsidian canvas, Onyx cards, and Electric Violet accents — creating a developer-tool density that still feels premium and approachable. Every interactive element whispers confidence: pill-shaped buttons, 24px card radii, hairline violet borders, and minimal elevation replaced by subtle glows and gradient washes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#5800fd` | `--color-electric-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Indigo | `#2415c6` | `--color-deep-indigo` | Saturated brand depth — testimonial card backgrounds, gradient mid-stops, and decorative fills that reinforce violet identity without competing with Electric Violet for attention |
| Periwinkle Glow | `#7066ed` | `--color-periwinkle-glow` | Soft brand highlight — icon tints, secondary accents, and gradient highlights that lighten the violet palette for hover states and decorative ornament |
| Halo Violet | `radial-gradient(circle farthest-side at 0px -30%, rgb(75, 57, 239), rgba(6, 3, 17, 0) 84%)` | `--color-halo-violet` | Radial gradient seed — the orb color that radiates from the hero top-left corner and bleeds into card backgrounds, creating atmosphere without flat fill |
| Obsidian | `#060311` | `--color-obsidian` | Page canvas — the deep near-black backdrop for the entire site. Carries a subtle violet undertone that keeps the darkness warm and on-brand rather than cold |
| Onyx | `#161320` | `--color-onyx` | Card surfaces and hairline borders — one step lighter than the canvas, creates soft layering without shadows. Used for widget tree panels, input fields, and elevated containers |
| Slate Mist | `#9ba1ae` | `--color-slate-mist` | Muted body and helper text — descriptions, metadata, secondary nav items. Sits clearly below white in hierarchy while maintaining AAA contrast on the dark canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| True Black | `#000000` | `--color-true-black` | Icon detail in light/banner contexts and SVG illustration fills where maximum contrast is required against white backgrounds |

## Tokens — Typography

### Urbanist — Primary brand typeface — headlines at 72–120px with wide tracking (0.038em–0.045em) create an architectural, restrained authority. Body and UI at 14–24px in weight 400. The geometric humanist forms are distinctive against the typical Inter/sans default of devtools. · `--font-urbanist`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px, 20px, 24px, 32px, 72px, 100px, 120px
- **Line height:** 1.00–1.60
- **Letter spacing:** 0.6em at 120px (display tracking), 0.045em at 72px, 0.038em at 32–20px, 0.030em at 24px, 0.045em at 16px, 0.030em at 14px
- **Role:** Primary brand typeface — headlines at 72–120px with wide tracking (0.038em–0.045em) create an architectural, restrained authority. Body and UI at 14–24px in weight 400. The geometric humanist forms are distinctive against the typical Inter/sans default of devtools.

### Inter — Secondary UI typeface — eyebrows, labels, nav items, and micro-copy where Inter's tighter rhythm supports dense interface text. Weight 300 brings an anti-convention lightness to small caps tracking. · `--font-inter`
- **Substitute:** system-ui or SF Pro
- **Weights:** 300, 400, 700
- **Sizes:** 13px, 14px, 16px, 18px, 20px, 24px
- **Line height:** 1.50–1.60
- **Letter spacing:** 0.270em at 24px (all-caps eyebrow tracking), 0.090em at 18px, 0.057em at 16px, 0.050em at 13–14px
- **Role:** Secondary UI typeface — eyebrows, labels, nav items, and micro-copy where Inter's tighter rhythm supports dense interface text. Weight 300 brings an anti-convention lightness to small caps tracking.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.65px | `--text-caption` |
| body | 16px | 1.6 | 0.72px | `--text-body` |
| subheading | 18px | 1.6 | 0.68px | `--text-subheading` |
| heading-sm | 20px | 1.5 | 0.76px | `--text-heading-sm` |
| heading | 32px | 1.3 | 1.22px | `--text-heading` |
| heading-lg | 72px | 1.2 | 3.24px | `--text-heading-lg` |
| display | 100px | 1 | 4.5px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| inputs | 16px |
| buttons | 9999px |
| nav-pill | 9999px |
| buttons-square | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.2) 0px 4px 24px 20px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 24px

## Components

### Ghost Navigation Button
**Role:** Outlined CTA in top nav for low-emphasis primary action

Pure white fill (#ffffff), Obsidian text (#060311), Urbanist 16px weight 500, 9999px radius (pill), 12px vertical / 24px horizontal padding, 1px transparent border. Used for 'Start for Free' in the nav bar — invites action without competing with the hero CTA.

### Filled Hero CTA
**Role:** High-emphasis primary action on dark hero

Electric Violet fill (#5800fd), white text, Urbanist 18px weight 500, 9999px radius, 16px vertical / 32px horizontal padding. Single bold chromatic moment against the dark canvas — carries the entire color story of the hero.

### Testimonial Card
**Role:** Customer quote card in social proof grid

Deep Indigo fill (#2415c6) or Periwinkle-to-Indigo gradient, 24px radius, 40px padding all sides. White company name (Urbanist 18px weight 600), Slate Mist body text, white author name + role at bottom. Cards arranged in 3-column grid on dark canvas.

### Widget Tree Panel
**Role:** Left sidebar in product UI showing component hierarchy

Onyx fill (#161320), 0px radius (flush to panel), 24px internal padding. Row items are 40px tall with Icon + Label layout. Active/hover row uses a teal-green or violet highlight fill at low opacity. Vertical scroll with 8px row gap.

### Search Input
**Role:** Widget search field inside product tree

Transparent or Onyx fill (#161320), 1px Onyx border, 16px radius, 11px vertical / 16px horizontal padding. Slate Mist placeholder text (14px), search icon at left, no visible focus ring — relies on container context.

### Trust Logo Strip
**Role:** Horizontal row of customer/partner logos

Section header eyebrow 'TRUSTED BY DEVELOPERS AT' in Urbanist 24px, 0.27em tracking, white at 60% opacity. Logos rendered in white or grayscale, 80–120px wide, 40px row gap between items, 80px section padding above and below.

### Top Promo Banner
**Role:** Slim announcement bar above the nav

Pure white fill (#ffffff), Obsidian text (#060311) and link text, Urbanist 14px weight 500, 0.045em tracking. Inline layout with logo + text + 'Try Now!' link. 11px vertical padding. Separates the marketing layer from the app nav.

### Primary Navigation Bar
**Role:** Top-level site navigation

Obsidian fill (#060311) with subtle transparency, transparent background, 9999px logo lockup, nav links in Urbanist 16px weight 500 white, dropdown items with Periwinkle (#7066ed) chevron. Sticky to top, 56px height, 32px horizontal padding.

### Hero Section Block
**Role:** First-screen marketing surface

Obsidian canvas with radial Halo Violet gradient bleeding from top-left corner. Centered text stack: Urbanist 100px weight 500 white headline with 4.5px tracking, 18px Slate Mist subtext, 40px vertical gap between elements, 80px top padding to clear the nav.

### Product Showcase Frame
**Role:** Large product UI screenshot below hero

Screenshot of the FlutterFlow builder with rounded container treatment, 24px radius, 20px black drop shadow. Optional 1px Onyx border. Floats over the dark canvas to demonstrate the product in context.

### Eyebrow Label
**Role:** All-caps section heading above content blocks

Inter 24px weight 300, 0.27em letter-spacing, white at 70% opacity. Sits 16–24px above the headline it introduces. Spaced-out and whisper-light to create anticipation without competing with the primary headline.

### Footer Link Group
**Role:** Categorized link lists in site footer

White column headers (Urbanist 16px weight 600), Slate Mist link items (14px weight 400) with 16px vertical gap, 32px padding. No dividers between groups — whitespace and alignment do the work.

## Do's and Don'ts

### Do
- Use Urbanist at 72–100px weight 500 for hero headlines with 3–4.5px letter-spacing — the wide tracking is the brand's signature restraint
- Set all CTAs to 9999px pill radius, never square buttons — the pill shape carries the friendly developer-tool personality
- Apply the radial Halo Violet gradient from the top-left of hero sections to create atmospheric depth without flat color fills
- Use the three-tier surface stack (Obsidian #060311 → Onyx #161320 → gradient wash) for layering — never add drop shadows for elevation
- Pair Electric Violet #5800fd with Pure White text only on dark surfaces — the contrast must be 7:1 or higher for accessibility
- Set all cards to 24px radius with 40px padding — the generous interior space is part of the spacious devtools feel
- Use Inter 24px weight 300 with 0.27em tracking for all-caps eyebrow labels above section headlines

### Don't
- Don't introduce new colors outside the violet spectrum — the brand is monochromatic dark with a single chromatic accent
- Don't use letter-spacing tighter than 0.03em on headlines — the wide tracking is intentional, not a mistake
- Don't add multi-layered drop shadows — the system uses one shadow token and prefers gradient glows for depth
- Don't use square or 8px-radius buttons — pill shapes (9999px) are the only button geometry
- Don't place white text directly on Electric Violet without checking contrast — use the 7:1 minimum rule
- Don't break the dark theme with white content cards — keep cards as Onyx #161320 with violet gradient highlights
- Don't use font weights above 600 for Urbanist — the typeface loses its geometric balance at bold weights

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#060311` | Base page background — everything floats on this near-black with violet undertone |
| 1 | Onyx Card | `#161320` | Card surfaces, input fields, and widget tree panels |
| 2 | Halo Gradient | `#4b39ef` | Atmospheric gradient wash on hero, testimonial cards, and feature sections |
| 3 | Pure White | `#ffffff` | Inverted surfaces — top banner, ghost buttons, and logo lockup on dark backgrounds |

## Elevation

- **Hero product screenshot card:** `rgba(0, 0, 0, 0.2) 0px 4px 24px 20px`

## Imagery

The visual language is dominated by product UI screenshots — the FlutterFlow builder interface is the hero image, shown floating with a soft shadow and rounded corners. No lifestyle photography appears; the product IS the hero. Decorative visuals are limited to the radial violet gradient orb that bleeds from the top-left of dark sections, creating atmospheric depth. Customer logos in the trust strip are rendered in pure white or grayscale, never in original brand colors, to maintain visual coherence on the dark canvas. Iconography throughout the product UI is monochromatic white or Slate Mist, using thin 1.5–2px stroke weights with rounded line caps. Illustration is absent — the brand relies on real product screenshots and gradient washes rather than drawn graphics.

## Layout

The site uses a max-width 1200px centered container for content blocks, but hero and product showcase sections are full-bleed. The hero is a centered text stack (headline → subtext → CTA) over a dark canvas with a radial violet gradient bleeding from the top-left. Below the hero, a product screenshot floats at full container width. The page rhythm alternates between dark bands (hero, testimonials) and the product showcase. The trust logo strip is a single horizontal row of 4–5 logos with generous breathing room. Testimonial cards are arranged in a 3-column grid with 24px gaps, wrapping to 2 or 1 column responsively. Section padding is consistently 80px top and bottom, creating spacious vertical rhythm. Navigation is a sticky top bar with logo left, center nav, and CTA right, sitting above a slim white promo banner.

## Agent Prompt Guide

primary action: no distinct CTA color
**Quick Color Reference**
- Page background: #060311 (Obsidian)
- Card surface: #161320 (Onyx)
- Primary text: #ffffff (Pure White)
- Muted text: #9ba1ae (Slate Mist)
- Brand accent: #5800fd (Electric Violet)
- Gradient orb: #4b39ef → transparent

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Build a testimonial card**: Background #2415c6 with gradient to #4b39ef at top-right, 24px radius, 40px padding. Company name in Urbanist 18px weight 600, white, top of card. Quote body in Urbanist 16px weight 400, white at 85% opacity, 24px gap below company name. Author name in Urbanist 14px weight 600, white; role in Urbanist 14px weight 400, #9ba1ae — both bottom of card with 40px gap above.

3. **Build a ghost navigation button**: Transparent background, 1px white border, white text, Urbanist 16px weight 500, 9999px radius, 12px/24px padding. Hover state: background #ffffff, text #060311.

4. **Build a widget tree row**: Background #161320, 40px height, 16px horizontal padding, icon at left (16px, white at 60% opacity), label in Urbanist 14px weight 400, white. Active state: background #5800fd at 15% opacity, white text at 100%.

5. **Build an eyebrow label**: Inter 24px weight 300, white at 70% opacity, 0.27em letter-spacing, all-caps. Sits 16px above the heading it introduces, centered or left-aligned to match the section.

## Gradient System

Gradients are the primary atmospheric tool — used in place of shadows, background colors, and decorative graphics. Three gradient recipes:

1. **Hero Halo** (most prominent, freq 24): radial-gradient(circle farthest-side at 0px -30%, rgb(75,57,239), rgba(6,3,17,0) 84%) — bleeds from top-left, creates the violet glow that defines the hero.

2. **Card Wash** (freq 2): linear-gradient(rgb(75,57,239), rgb(75,57,239) 50%, rgb(43,33,137)) — used on testimonial and feature cards for a subtle violet depth.

3. **Surface Lift** (freq 1): linear-gradient(rgb(22,19,32), rgb(6,3,17)) — barely-perceptible gradient that lifts Onyx surfaces from the canvas without adding a new color.

Rule: always start gradients from the top-left or top edge; never from the center or bottom — this creates the impression of a light source above the page.

## Type Tracking Philosophy

Letter-spacing scales with size — small text (13–14px) uses 0.05em (0.65–0.7px), body (16–18px) uses 0.03–0.045em (0.48–0.81px), and display (72–120px) uses 0.038–0.6em (2.7–72px). The 0.6em value at 120px is reserved for logo-style lockups only — not body display headlines. This tracking gradient is what makes Urbanist feel architectural rather than dense: the wider the size, the wider the tracking, creating a visual expansion that mirrors the physical size of the letters.

## Similar Brands

- **Figma** — Same dark canvas with selective chromatic accent, pill-shaped buttons, and floating product UI as the hero — though Figma uses red/orange accents where FlutterFlow uses violet
- **Webflow** — Identical developer-tool dark aesthetic with full-bleed product screenshots below a centered headline hero, and generous section padding
- **Framer** — Same midnight-canvas approach with a single bright accent color (Framer uses blue) and large display headlines with wide tracking
- **Bubble** — Same no-code tool category with dark hero, centered text stack, and product showcase pattern — though Bubble's palette is more neutral and less violet-driven
- **Vercel** — Same monochromatic dark canvas with high-contrast white type and a single bold chromatic moment (Vercel black/white, FlutterFlow violet) for key actions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #5800fd;
  --color-deep-indigo: #2415c6;
  --color-periwinkle-glow: #7066ed;
  --color-halo-violet: #4b39ef;
  --gradient-halo-violet: radial-gradient(circle farthest-side at 0px -30%, rgb(75, 57, 239), rgba(6, 3, 17, 0) 84%);
  --color-obsidian: #060311;
  --color-onyx: #161320;
  --color-slate-mist: #9ba1ae;
  --color-pure-white: #ffffff;
  --color-true-black: #000000;

  /* Typography — Font Families */
  --font-urbanist: 'Urbanist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.65px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.72px;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: 0.68px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: 0.76px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: 1.22px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 3.24px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: 4.5px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-inputs: 16px;
  --radius-buttons: 9999px;
  --radius-nav-pill: 9999px;
  --radius-buttons-square: 12px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 4px 24px 20px;

  /* Surfaces */
  --surface-obsidian-canvas: #060311;
  --surface-onyx-card: #161320;
  --surface-halo-gradient: #4b39ef;
  --surface-pure-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #5800fd;
  --color-deep-indigo: #2415c6;
  --color-periwinkle-glow: #7066ed;
  --color-halo-violet: #4b39ef;
  --color-obsidian: #060311;
  --color-onyx: #161320;
  --color-slate-mist: #9ba1ae;
  --color-pure-white: #ffffff;
  --color-true-black: #000000;

  /* Typography */
  --font-urbanist: 'Urbanist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.65px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.72px;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: 0.68px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: 0.76px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: 1.22px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 3.24px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: 4.5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 1440px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 4px 24px 20px;
}
```
