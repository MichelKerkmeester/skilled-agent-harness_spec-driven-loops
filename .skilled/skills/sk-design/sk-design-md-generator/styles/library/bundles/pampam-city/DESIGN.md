# pampam.city — Style Reference
> Old explorer's notebook on warm cream

**Theme:** light

PamPam reads as a warm editorial travel journal translated into a modern app: a soft parchment-cream canvas (#faf2ec) carries the interface, with a custom display serif ('Nineties') giving headlines a vintage-magazine voice against a clean, workhorse Inter body. The palette is nearly monochromatic, leaning on a single muted lavender-gray (#9894a8) for borders, links, and hairlines, and reserving one vivid periwinkle blue (#4b72f3) for the one action that must feel switched on. Surfaces stay flat and paper-like — white cards float on cream, never the other way around, and shadows are whisper-quiet so the maps and illustrations can do the emotional work. Components are compact and confident: pill-ish buttons with generous 16px radii, 12px-radius cards, and tight 12–16px internal padding. Color and weight, not elevation, carry hierarchy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Cream | `#faf2ec` | `--color-parchment-cream` | Page canvas — the warm, paper-like surface that everything sits on; cards and buttons float above it as white or charcoal |
| Warm Ink | `#1b1917` | `--color-warm-ink` | Primary text and headline color — a near-black with a brown undertone that harmonizes with the cream canvas instead of fighting it |
| Carbon | `#000000` | `--color-carbon` | Secondary text, icon strokes, and heavy dark surfaces (filled dark buttons, logo marks); used sparingly so Warm Ink remains the default reading color |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, input fields, and dark-on-light icon fills — the only true white in the system, reserved for elements that must lift off the cream |
| Mist Gray | `#e5e5e5` | `--color-mist-gray` | Section dividers, subtle background bands, and inactive surface washes |
| Ash | `#8f8f8f` | `--color-ash` | Muted helper text, tertiary metadata, and disabled labels |
| Slate Lavender | `#9894a8` | `--color-slate-lavender` | Default link color, hairline borders, tag outlines, and decorative strokes — the most-used chromatic neutral; soft enough to never compete with the blue accent |
| Iron | `#222222` | `--color-iron` | Input field text and dark-mode form borders on light surfaces |
| Periwinkle | `#4b72f3` | `--color-periwinkle` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Deep Violet | `#2b3ea7` | `--color-deep-violet` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### Nineties — Display and editorial headlines — a custom high-contrast serif with vintage-magazine DNA. Used at 80px for hero statements, 48px for section headlines, and 28px for sub-headlines. Its old-style serifs and tight 1.08 line-height create a printed-page rhythm that is the single most distinctive choice in the system. Substitute: DM Serif Display, Playfair Display, or Recoleta. · `--font-nineties`
- **Substitute:** DM Serif Display
- **Weights:** 400
- **Sizes:** 28px, 48px, 80px
- **Line height:** 1.08
- **Letter spacing:** 0
- **Role:** Display and editorial headlines — a custom high-contrast serif with vintage-magazine DNA. Used at 80px for hero statements, 48px for section headlines, and 28px for sub-headlines. Its old-style serifs and tight 1.08 line-height create a printed-page rhythm that is the single most distinctive choice in the system. Substitute: DM Serif Display, Playfair Display, or Recoleta.

### Inter — Body, UI controls, navigation, buttons, and small headings. Weight 550 (Inter's semibold) is used for emphasized text and button labels — heavier than typical body weight but lighter than a full 600, giving the UI a slightly lighter touch than standard Inter implementations. Always rendered with OpenType features cv02, cv03, cv04, cv06, cv11 for the alternate character set that gives the text its slightly geometric, brand-tuned feel. · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 550
- **Sizes:** 14px, 16px, 18px, 19px
- **Line height:** 1.43, 1.47, 1.50, 1.56
- **OpenType features:** `"cv02", "cv03", "cv04", "cv06", "cv11" on`
- **Role:** Body, UI controls, navigation, buttons, and small headings. Weight 550 (Inter's semibold) is used for emphasized text and button labels — heavier than typical body weight but lighter than a full 600, giving the UI a slightly lighter touch than standard Inter implementations. Always rendered with OpenType features cv02, cv03, cv04, cv06, cv11 for the alternate character set that gives the text its slightly geometric, brand-tuned feel.

### -apple-system / system-ui — Fallback and OS-native rendering for icons, system messages, and any element where a neutral sans is acceptable. Acts as the safety net so the system never breaks if Inter fails to load. · `--font-apple-system-system-ui`
- **Weights:** 400, 500, 600
- **Sizes:** 16px, 18px, 24px
- **Line height:** 1.00, 1.20, 1.56
- **Role:** Fallback and OS-native rendering for icons, system messages, and any element where a neutral sans is acceptable. Acts as the safety net so the system never breaks if Inter fails to load.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 19px | 1.56 | — | `--text-subheading` |
| heading-sm | 28px | 1.08 | — | `--text-heading-sm` |
| heading | 48px | 1.08 | — | `--text-heading` |
| display | 80px | 1.08 | — | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 12px |
| cards | 12px |
| inputs | 12px |
| buttons | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.3) 0px 1px 2px 0px, rgb(99, 135, 244) 0px...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Hero Display Headline
**Role:** Primary page-level statement that anchors the entire viewport

Nineties 400 at 80px, line-height 1.08, color #1b1917 (Warm Ink), centered alignment. No letter-spacing manipulation. Sits over the Parchment Cream canvas with generous 56px vertical padding above and below. The tight line-height and high-contrast serif is the signature move — it should always feel like a magazine pull-quote, never a SaaS headline.

### Section Headline
**Role:** Secondary heading introducing a new content band

Nineties 400 at 48px, line-height 1.08, color #1b1917. Left-aligned when beside body copy, centered when used as a standalone band title. Same serif treatment as the display — the scale drops, the voice stays identical.

### Sub-Headline
**Role:** Inline heading inside a card or sub-section

Nineties 400 at 28px, line-height 1.08, color #1b1917. The smallest size the custom serif is used at — below this, switch to Inter to preserve readability.

### Periwinkle Primary Button
**Role:** The single dominant action on a screen

Background #4b72f3 (Periwinkle), text #ffffff in Inter 550 at 16px, padding 12px 24px, border-radius 16px. No border, no shadow. The vivid blue against the warm cream is the highest-contrast moment on the page and must be reserved for one action per screen. Hover: deepen to 10% darker; active: inset shadow rgb(99, 135, 244) 0px 2px 0px 0px.

### Dark Filled Button
**Role:** Secondary dark action — the contrast twin of the Periwinkle button

Background #000000 (Carbon), text #ffffff in Inter 550 at 16px, padding 12px 24px, border-radius 16px. A '+' icon prefix is common. Use for primary in-page actions when the surrounding section already carries blue, or for the nav-level CTA.

### Ghost / Outlined Button
**Role:** Tertiary or paired alternative action

Background transparent, border 1px solid #9894a8 (Slate Lavender) or #000000, text #1b1917 or #000000 in Inter 550 at 16px, padding 11px 23px (1px less to compensate for border), border-radius 16px.

### White Surface Card
**Role:** General-purpose content card for features, integrations, and start-options

Background #ffffff, border-radius 12px, border 1px solid #e5e5e5 (Mist), padding 16px–24px. The 1px Mist border is the primary edge; a soft shadow (rgba(0,0,0,0.08) 0 0 0 1px, rgba(0,0,0,0.1) 0 1px 4px) is optional for cards on hero/illustration backgrounds. Contains a colored icon (Periwinkle, Deep Violet, or brand color) above an Inter 550 label.

### Cream Card (No-Border)
**Role:** Card variant for content that should blend into the page rather than lift off it

Background #faf2ec (same as canvas), border-radius 12px, padding 24px, no border or shadow. Use when the card is more of a grouping affordance than a discrete surface — the visual cue is spacing and radius, not color contrast.

### Input Field
**Role:** Text input for search, queries, and map prompts

Background #ffffff, border 1px solid #e5e5e5, border-radius 12px, padding 12px 16px, text in Inter 400 at 16px color #222222. Placeholder text in #8f8f8f. Focus ring: 2px inset rgb(99, 135, 244) — the same Periwinkle used for CTAs, confirming it as the interactive accent.

### Press / Logo Strip
**Role:** Horizontal row of grayscale partner logos for social proof

Logos rendered in #000000 at uniform 24–32px height, evenly spaced with 56px gaps. No background, no border — the strip floats on the cream canvas. Each logo is fully monochrome; the brand color treatment is suppressed to keep the row feeling editorial.

### Tag / Category Pill
**Role:** Small inline label for map categories, filters, or feature tags

Background transparent, border 1px solid #9894a8, border-radius 12px, padding 4px 12px, text Inter 400 at 14px color #1b1917. The Slate Lavender border is the visual identifier — it distinguishes tags from regular text without needing a fill.

### Google Sign-In Button
**Role:** Top-right authentication affordance

Background #ffffff, border 1px solid #e5e5e5, border-radius 8px–12px, padding 8px 16px, Google 'G' logo at full color (red/yellow/green/blue), text Inter 400 at 14px color #1b1917. A rare instance of multicolor on the site — only acceptable for the official Google mark.

### Navigation Bar
**Role:** Top-of-page global navigation

Transparent background that lets the Parchment Cream canvas show through. Logo (oval 'PAM' badge in #1b1917) at far left, nav links (Pricing, Solutions, Products, Inspiration) in Inter 400 at 16px color #1b1917, spaced with 32px gaps. Sign-in button pinned right. Padding 16px vertical, 32px horizontal.

### Feature Image Card (Browser Frame)
**Role:** Product showcase card showing the app inside a browser chrome

A 3D-tilted browser window mockup (rounded 12px corners, white surface, macOS-style traffic-light dots) containing a map screenshot. Background card has no border, uses the cream canvas. Tilt angle around -5° to -8° creates a 'pinned to a notebook' feel rather than a flat grid.

## Do's and Don'ts

### Do
- Use Nineties 400 at 80px for hero headlines and 48px for section headlines — the serif is the brand voice and should never be replaced by Inter at large sizes
- Use #faf2ec (Parchment Cream) as the page canvas and let white cards float above it, not the reverse
- Reserve #4b72f3 (Periwinkle) for exactly one primary action per screen; every other action should be Carbon, Ghost, or text-only
- Use 12px radius for cards and 16px radius for buttons — the two-step scale keeps surfaces consistent without rounding into pure pills
- Render Inter with OpenType features cv02, cv03, cv04, cv06, cv11 active to preserve the brand-tuned character set
- Let the Slate Lavender (#9894a8) carry all link and border chromatic work — it is the only chromatic neutral and should appear on every interactive hairline
- Keep shadows to the 1px-border + 4px-soft-drop pattern; never stack multiple drop shadows or add colored glows

### Don't
- Do not use Nineties below 28px — it becomes unreadable; switch to Inter for any small text
- Do not introduce additional saturated brand colors; the system is monochromatic plus one blue, and adding more will dilute the Periwinkle's impact
- Do not place dark cards on dark backgrounds or white cards on white — the cream/white/carbon triad depends on each surface having contrast against its parent
- Do not use pure #000000 for body text on cream — use #1b1917 (Warm Ink) so the text harmonizes with the parchment instead of punching through it
- Do not apply Periwinkle to large decorative fills, backgrounds, or illustration accents; it is a 40–200px button color, not a section color
- Do not add letter-spacing to Nineties — the tight 1.08 line-height and default tracking are part of the magazine feel
- Do not use heavy elevation (large blur, offset, or colored shadows) — the paper metaphor breaks the moment a card looks like it is floating in space

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#faf2ec` | Page background — the warm cream that defines the entire site mood |
| 1 | Paper White Card | `#ffffff` | Cards, modals, input fields — elements that need to lift off the cream |
| 2 | Mist Band | `#e5e5e5` | Subtle section backgrounds and dividers |
| 3 | Carbon Block | `#000000` | Dark inverted surfaces — dark CTA buttons, featured blocks |

## Elevation

- **Cards and elevated panels:** `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 4px 0px`
- **Focus rings and inset accents:** `rgba(0, 0, 0, 0.3) 0px 1px 2px 0px, rgb(99, 135, 244) 0px 2px 0px 0px inset`

## Imagery

Imagery is photographic and atmospheric rather than product-shot: full-bleed soft-focus backgrounds of clouds, skies, and natural landscapes (visible in the hero as a dreamy green-cloud wash) set an emotional travel mood before any product UI appears. Product imagery is contained inside tilted browser-frame mockups that sit on the cream canvas like pages pinned to a board. Icons are flat, geometric, and monochromatic — the colored app-source tiles (Periwinkle, Neutral Notion 'N', Green Sheets) are the only spots of multicolor in the functional UI. Photography is never lifestyle or human-focused; the map IS the hero, and supporting imagery only sets weather and light. Overall density is text-dominant with one large atmospheric image per major section.

## Layout

Full-bleed atmospheric hero (no max-width constraint on the background image) with a centered text stack: display headline, supporting paragraph, dark inline CTA, and a row of three white 'Start from' cards. Below the hero, a centered max-width 1200px content column takes over. Sections alternate between a press-logo strip on cream, then a two-column product showcase (tilted browser mockup left, heading + body + Periwinkle CTA right). Vertical rhythm is generous: 64px between major sections, 12–16px between elements, 56px gaps inside multi-column bands. Navigation is a minimal top bar floating on the cream canvas with a sign-in affordance pinned to the right. No sidebar, no mega-menu, no sticky elements beyond the nav.

## Agent Prompt Guide

**Quick Color Reference**
- canvas (page background): #faf2ec
- card surface: #ffffff
- primary text: #1b1917
- border / hairline: #9894a8 (Slate Lavender) or #e5e5e5 (Mist)
- accent: #2b3ea7 (Deep Violet, rare)
- primary action: no distinct CTA color

**3 Example Component Prompts**

1. **Hero section**: Parchment Cream (#faf2ec) canvas with a full-bleed soft-focus landscape photo behind. Headline 'Put your world on the map.' set in Nineties 400 at 80px, line-height 1.08, color #1b1917, centered. Supporting paragraph in Inter 400 at 18px, line-height 1.56, color #1b1917. A dark Carbon (#000000) button '+ Make map' at 12px 24px padding, 16px radius, white Inter 550 16px label. Below, a row of three white cards (12px radius, 1px Mist border, 16px padding) each containing a colored icon above an Inter 550 16px label.

2. **Feature showcase band**: Two-column layout at max-width 1200px, 56px column gap. Left: a browser-frame mockup (12px radius, white surface, macOS traffic-light dots) tilted -5°, containing a map screenshot. Right: Inter 550 16px uppercase label 'For business' in #8f8f8f, then Nineties 400 48px heading 'Make your own custom maps.' in #1b1917, then Inter 400 18px body in #1b1917, then a Periwinkle (#4b72f3) filled button 'Explore our map maker' at 12px 24px padding, 16px radius, white Inter 550 16px label.

3. **Press logo strip**: Centered row on Parchment Cream canvas, 56px gap between logos. Each logo rendered in #000000 at 28px height, uniformly scaled. No background, no border, no text labels — logos only, set in a single horizontal line with generous breathing room above and below (64px padding each side).

## Similar Brands

- **Notion** — Same warm-neutral canvas with dark Inter body and a single accent color reserved for primary actions; similar whisper-light card elevation.
- **Linear** — Same monochromatic interface with one vivid accent for the primary CTA, tight typographic rhythm, and minimal decorative chrome.
- **Arc browser** — Same editorial sensibility — custom display typography against a cream-toned canvas, with restrained color and a paper-like surface treatment.
- **Substack** — Same serif-headline-over-cream-canvas identity with Inter body, treating the product page like a long-form magazine spread.
- **Felt** — Same map-making category, same soft warm palette, and same approach of letting one colored tile per integration provide the only chromatic accent.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-cream: #faf2ec;
  --color-warm-ink: #1b1917;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #e5e5e5;
  --color-ash: #8f8f8f;
  --color-slate-lavender: #9894a8;
  --color-iron: #222222;
  --color-periwinkle: #4b72f3;
  --color-deep-violet: #2b3ea7;

  /* Typography — Font Families */
  --font-nineties: 'Nineties', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system-system-ui: '-apple-system / system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.56;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.08;
  --text-heading: 48px;
  --leading-heading: 1.08;
  --text-display: 80px;
  --leading-display: 1.08;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w550: 550;
  --font-weight-semibold: 600;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;

  /* Named Radii */
  --radius-tags: 12px;
  --radius-cards: 12px;
  --radius-inputs: 12px;
  --radius-buttons: 16px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 4px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.3) 0px 1px 2px 0px, rgb(99, 135, 244) 0px 2px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #faf2ec;
  --surface-paper-white-card: #ffffff;
  --surface-mist-band: #e5e5e5;
  --surface-carbon-block: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-cream: #faf2ec;
  --color-warm-ink: #1b1917;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #e5e5e5;
  --color-ash: #8f8f8f;
  --color-slate-lavender: #9894a8;
  --color-iron: #222222;
  --color-periwinkle: #4b72f3;
  --color-deep-violet: #2b3ea7;

  /* Typography */
  --font-nineties: 'Nineties', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system-system-ui: '-apple-system / system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.56;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.08;
  --text-heading: 48px;
  --leading-heading: 1.08;
  --text-display: 80px;
  --leading-display: 1.08;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 4px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.3) 0px 1px 2px 0px, rgb(99, 135, 244) 0px 2px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
}
```
