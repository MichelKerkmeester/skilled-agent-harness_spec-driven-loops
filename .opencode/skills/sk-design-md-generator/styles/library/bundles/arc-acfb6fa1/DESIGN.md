# Arc — Style Reference
> industrial white gallery above midnight water

**Theme:** light

Arc operates as an industrial white gallery suspended above dark ocean. The page alternates between full-bleed aerial marine photography and monastic white space dominated by type, with a single deep teal-navy band used as a rhythmic counterpoint between sections. Components are deliberately skeletal: thin ghost buttons with hairline borders, 5px corner radii on controls, almost no shadow, and generous negative space that lets the imagery and oversized type do the storytelling. The Soehne family carries a weight-300 display voice at 48–140px that reads as confident and engineering-precise, while body text sits at 16–18px weight 400 with tight tracking. Color is used as restraint — the system is 99% achromatic plus two near-black teals (#031e25, #1d1d1e) for image-driven sections, with no chromatic accent at all. Photography is always contained within generously rounded 32px frames against the flat canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#e5e7eb` | `--color-bone` | Page canvas, card surfaces, hairline dividers between sections, ghost-button borders — the lightest structural gray carries borders, surface, and the dominant background in a near-white mode |
| Charcoal | `#0a0a0a` | `--color-charcoal` | Primary body and heading text, nav links, footer text, filled button text — near-black for maximum legibility without the harshness of pure black |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, filled button backgrounds, image overlays, reverse text on dark sections — the brightest structural white |
| Obsidian | `#000000` | `--color-obsidian` | Headings on light canvas where maximum contrast is required, nav background accents — used sparingly only where absolute black is needed |
| Deep Current | `#031e25` | `--color-deep-current` | Dark feature section backgrounds (alternating bands), large image containers — the navy-black that recedes like deep ocean water |
| Slate Depth | `#1d1d1e` | `--color-slate-depth` | Secondary dark section background, elevated panels over Deep Current — one step lighter to layer depth within dark bands |

## Tokens — Typography

### Soehne — All interface type: weight 300 reserved for display headings (48–140px) to create a quiet engineering voice, 400 for body and subheadings, 500 for nav and meta, 600 for button labels. Soehne's geometric neutrality with the extreme -0.043em tracking on display sizes is the signature — it makes headlines feel architectural rather than editorial. Substitute: Inter (closest free analog with matching weights and tracking) or Untitled Sans. · `--font-soehne`
- **Substitute:** Inter
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11px, 12px, 14px, 16px, 18px, 22px, 32px, 48px, 140px
- **Line height:** 1.00, 1.30, 1.33, 1.44, 1.95
- **Letter spacing:** -0.043em at 140px, -0.021em at 48px, -0.016em at 32px, -0.012em at 22px, -0.01em at 18px, normal at 16px and below, +0.15em–0.185em on uppercase labels at 11–12px
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** All interface type: weight 300 reserved for display headings (48–140px) to create a quiet engineering voice, 400 for body and subheadings, 500 for nav and meta, 600 for button labels. Soehne's geometric neutrality with the extreme -0.043em tracking on display sizes is the signature — it makes headlines feel architectural rather than editorial. Substitute: Inter (closest free analog with matching weights and tracking) or Untitled Sans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.3 | 0.185px | `--text-caption` |
| body-sm | 14px | 1.44 | — | `--text-body-sm` |
| body | 16px | 1.44 | — | `--text-body` |
| body-lg | 18px | 1.44 | -0.01px | `--text-body-lg` |
| subheading | 22px | 1.33 | -0.012px | `--text-subheading` |
| heading | 32px | 1.3 | -0.016px | `--text-heading` |
| heading-lg | 48px | 1.16 | -0.021px | `--text-heading-lg` |
| display | 140px | 1 | -0.043px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 45 | 45px | `--spacing-45` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 81 | 81px | `--spacing-81` |
| 100 | 100px | `--spacing-100` |
| 215 | 215px | `--spacing-215` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2.25px |
| cards | 0px |
| images | 32px |
| inputs | 5px |
| buttons | 5px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.05) 0px 10px 15px -3px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 36-64px
- **Card padding:** 20px
- **Element gap:** 18-20px

## Components

### Ghost Navigation Button
**Role:** Header nav links (SPORT, COAST, COMMERCIAL) and CTAs

Transparent background, #0a0a0a text at 12–14px weight 500, letter-spacing +0.15em uppercase. No border, no fill. Underline or weight shift on hover. 45px horizontal padding inside nav.

### Outlined CTA Button
**Role:** Primary action on hero (RECREATION, COMMERCIAL) and section CTAs

Transparent or #ffffff fill, 1px #0a0a0a or #ffffff border, 5px radius, 20px vertical × 20px horizontal padding, 11–12px Soehne weight 500 uppercase at +0.15em tracking. Text color matches border color (reversible on dark sections).

### Filled Reversed Button
**Role:** Dark-section actions

#ffffff fill on #031e25 background, #0a0a0a text, 5px radius, identical padding and tracking to outlined variant. Used sparingly — most actions remain outlined.

### Hero Image Container
**Role:** Full-bleed opening section with aerial marine photography

100vw width, 100vh height, image object-fit cover. Text overlay positioned bottom-left at ~40px from edges. The photograph is the only content — no decorative border, no radius.

### Feature Card
**Role:** Three-column grid in dark feature section (Advanced Software, Quiet power, etc.)

#031e25 background, 32px radius image at top filling 100% width, 20px padding, white Soehne weight 400 16px body text, white Soehne weight 400 22px heading. No border, no shadow — image and text sit directly on the dark panel.

### Centered Statement Block
**Role:** Section transition moments (e.g., 'Electric power built for everything the water demands.')

Full-width #ffffff or #e5e7eb band, max-width 720px, centered text, 32–48px Soehne weight 300 heading with tight tracking, 48–64px vertical padding. No supporting copy, no decoration — the statement alone.

### Hairline Divider
**Role:** Section separators and grid lines

1px #e5e7eb line, full width or column-width. No gradient, no shadow — just the bone-gray rule.

### Logo Mark
**Role:** Brand identity in nav

Lowercase 'a' or 'arc' wordmark in Soehne weight 300 at 32–48px, #ffffff on dark hero, #0a0a0a on light sections. Tracking -0.021em. The logo IS the display type — no separate logomark.

### Overlay Image Frame
**Role:** In-section photography (product crops, dashboard screenshots)

32px corner radius, contained within max-width column, no border, no shadow. Photographs are the surface — no card chrome around them.

### Footer Link Row
**Role:** Footer navigation

12px Soehne weight 400–500, #0a0a0a or #ffffff depending on section, +0.15em uppercase tracking, 20px horizontal gap between items. No dividers, no bullets.

### Hamburger Menu Trigger
**Role:** Mobile or secondary nav

Two stacked 1px #0a0a0a horizontal lines, 18px wide, 2.25px radius. No background, no animation chrome — the most minimal possible affordance.

### Meta Label
**Role:** Pre-headline tags (e.g., 'DESIGNED AND BUILT IN THE USA')

11px Soehne weight 500 uppercase, +0.185em tracking, #0a0a0a. Prefixed with a small flag or icon mark. Sets the industrial-engineering tone before the headline.

### Card Grid Container
**Role:** Three-column feature layout in dark section

Equal-width columns with 18–20px column gap, 36px row gap. No visible grid lines — separation comes from spacing and the dark panel background.

## Do's and Don'ts

### Do
- Use only Soehne (or Inter substitute) at the weights 300/400/500/600 — never introduce a second typeface family
- Set display headings at 48–140px weight 300 with tracking between -0.021em and -0.043em; the whisper-weight is the signature
- Use 5px radius for all controls (buttons, inputs) and 32px radius for all imagery — never mix or round to 8/12/16px
- Alternate between #e5e7eb / #ffffff light bands and #1d1d1 / #031e25 dark bands for section rhythm — no mid-gray bridges
- Reserve uppercase +0.15em–0.185em tracking for labels, meta, nav, and button text only — never for body or headings
- Let full-bleed aerial marine photography carry the visual weight of hero and feature sections; do not compete with overlaid illustrations or graphics
- Use #e5e7eb hairline 1px borders for all dividers and card edges; avoid colored borders

### Don't
- Never introduce a chromatic accent color — the system is deliberately monochromatic plus dark teal-navy
- Never use weight 700 or higher — the heaviest weight in the system is 600, and display text stays at 300
- Never add drop shadows, glows, or blur effects to elements beyond the single detected hero shadow
- Never use a border-radius between 6px and 31px — controls stay at 5px, images at 32px, nothing in between
- Never place text directly on a photograph without a darkening overlay or contained card surface
- Never use centered body copy longer than two lines; long-form content goes left-aligned in contained columns
- Never use illustrations, icons-as-decoration, or 3D renders — photography and type are the only visual vocabulary
- Never set body text above 18px or below 14px — the 14–18px range is the readable band

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e5e7eb` | Default page background for light sections — a slightly warm light gray that feels industrial rather than clinical |
| 1 | Paper | `#ffffff` | Section backgrounds, card surfaces, button fills, image frames — the bright neutral that creates breathing room |
| 2 | Deep Section | `#1d1d1` | Dark band background for feature sections and image-forward blocks |
| 3 | Ocean Floor | `#031e25` | Deepest dark surface — the bottom of the elevation stack, used for hero overlays and full-bleed photographic sections |

## Elevation

Arc avoids shadow almost entirely. The single detected shadow (rgba(0,0,0,0.05) 0 10px 15px -3px) is an isolated instance on the hero — likely a subtle text-lift on the headline. Depth comes from tonal jumps between #e5e7eb, #ffffff, #1d1d1, and #031e25, not from cast shadows. This reinforces the flat, engineering-precise aesthetic: surfaces sit on top of each other through color contrast, not blur.

## Imagery

Photography is the primary visual medium and it is always marine and always aerial or high-angle. Shots are full-bleed or 32px-radius framed, never square, never with decoration. Color treatment is naturalistic — the deep teal-green of open water carries the only chromatic energy in the system. No illustration, no iconography beyond the smallest utility glyphs (hamburger, flag), no 3D renders, no abstract graphics. The product itself (boats) is always shown in motion from above, creating wake and speed lines. Screenshots of software interfaces appear as flat product evidence inside feature cards. Density is image-dominant in the hero and feature sections, text-dominant in transition and detail sections.

## Layout

Page model is full-bleed for all hero and feature imagery, with max-width 1200px contained for text and component grids. The hero is a 100vh full-bleed dark photograph with text overlaid in the bottom-left quadrant — no centered headline, no split layout. The first scroll section drops to a #ffffff band with a single centered statement (max-width ~720px), creating a moment of silence. The third section is a #031e25 dark band with a 3-column card grid of image-top / text-below cards. Section rhythm alternates: dark photo → white statement → dark feature grid → light detail blocks. Navigation is a minimal top bar with logo-left, links-center, hamburger-right, transparent background over the hero. Spacing is generous — 36–64px between sections, 18–20px between elements, 20px inside cards. No sidebar, no mega-menu, no sticky behavior visible in static frames.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0a0a
- background: #ffffff (cards/buttons) / #e5e7eb (canvas) / #031e25 (dark bands)
- border: #e5e7eb (hairline) / #0a0a0a (ghost button)
- accent: none — monochromatic system
- primary action: no distinct CTA color

**3 Example Component Prompts**

1. **Hero section with full-bleed photograph**: Full-viewport dark ocean aerial image as background, object-fit cover. Bottom-left overlay text: 11px Soehne weight 500 uppercase at +0.185em tracking in #ffffff with flag icon, reading 'DESIGNED AND BUILT IN THE USA'. Below it, 48px Soehne weight 300 in #ffffff at -0.021em tracking reading 'Electrifying the marine industry'. Two outlined ghost buttons below, each 5px radius, 1px #ffffff border, 11px Soehne weight 500 uppercase +0.15em, 20px padding, reading 'RECREATION' and 'COMMERCIAL'.

2. **Centered statement block**: Full-width #ffffff band, 64px vertical padding. Centered text, max-width 720px: 32px Soehne weight 300 in #0a0a0a at -0.016em tracking, two lines: 'Electric power built for / everything the water demands.' No other elements — statement alone.

3. **Feature card in dark section**: 32px-radius image filling 100% column width at top (aerial boat shot). Below, 20px padding, #031e25 background extending. Heading: 22px Soehne weight 400 in #ffffff at -0.012em tracking. Body: 16px Soehne weight 400 in #ffffff at default tracking, max 2 lines. No border, no shadow, no card chrome beyond the dark surface.

## Animation Philosophy

Arc is a static, almost motionless site. The motion profile reads as 'none' — no detected transitions, no hover animations documented in the tokens. The one detected shadow is a static lift, not an animated effect. If animation is needed, it should be: instant or near-instant (0–150ms), no bounce or ease-out curves, no scroll-triggered reveals, no parallax. The stillness is part of the engineering aesthetic — the boats move, the interface does not.

## Similar Brands

- **Rivian** — Same full-bleed aerial photography of vehicles in natural environments, same monochrome-plus-single-accent restraint, same engineering-precise type voice
- **Polestar** — Minimalist type-driven layout with oversized headings, alternating light/dark section bands, and product photography as the sole chromatic content
- **Canoo** — Industrial white gallery aesthetic with skeletal ghost buttons, hairline borders, and near-zero shadow — product-forward without chrome
- **Brunswick (marine)** — Direct marine-industry peer using full-bleed ocean photography and minimal text overlays to let the product speak

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #e5e7eb;
  --color-charcoal: #0a0a0a;
  --color-paper: #ffffff;
  --color-obsidian: #000000;
  --color-deep-current: #031e25;
  --color-slate-depth: #1d1d1e;

  /* Typography — Font Families */
  --font-soehne: 'Soehne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --tracking-caption: 0.185px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.44;
  --text-body: 16px;
  --leading-body: 1.44;
  --text-body-lg: 18px;
  --leading-body-lg: 1.44;
  --tracking-body-lg: -0.01px;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.012px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.016px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: -0.021px;
  --text-display: 140px;
  --leading-display: 1;
  --tracking-display: -0.043px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-45: 45px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-81: 81px;
  --spacing-100: 100px;
  --spacing-215: 215px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 36-64px;
  --card-padding: 20px;
  --element-gap: 18-20px;

  /* Border Radius */
  --radius-sm: 2.25px;
  --radius-md: 5px;
  --radius-xl: 13.5px;
  --radius-2xl: 18px;
  --radius-3xl: 32px;

  /* Named Radii */
  --radius-nav: 2.25px;
  --radius-cards: 0px;
  --radius-images: 32px;
  --radius-inputs: 5px;
  --radius-buttons: 5px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 10px 15px -3px;

  /* Surfaces */
  --surface-canvas: #e5e7eb;
  --surface-paper: #ffffff;
  --surface-deep-section: #1d1d1;
  --surface-ocean-floor: #031e25;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #e5e7eb;
  --color-charcoal: #0a0a0a;
  --color-paper: #ffffff;
  --color-obsidian: #000000;
  --color-deep-current: #031e25;
  --color-slate-depth: #1d1d1e;

  /* Typography */
  --font-soehne: 'Soehne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --tracking-caption: 0.185px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.44;
  --text-body: 16px;
  --leading-body: 1.44;
  --text-body-lg: 18px;
  --leading-body-lg: 1.44;
  --tracking-body-lg: -0.01px;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.012px;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.016px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: -0.021px;
  --text-display: 140px;
  --leading-display: 1;
  --tracking-display: -0.043px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-45: 45px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-81: 81px;
  --spacing-100: 100px;
  --spacing-215: 215px;

  /* Border Radius */
  --radius-sm: 2.25px;
  --radius-md: 5px;
  --radius-xl: 13.5px;
  --radius-2xl: 18px;
  --radius-3xl: 32px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 10px 15px -3px;
}
```
