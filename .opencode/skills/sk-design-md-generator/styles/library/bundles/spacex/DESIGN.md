# SpaceX — Style Reference
> Mission control viewport into deep space

**Theme:** dark

SpaceX operates in cinematic darkness. The entire interface is a single voice — off-white technical typography on absolute black — with no decorative color to compete with the full-bleed photography of spacecraft and celestial bodies. D-DIN, a geometric industrial sans, gives every label the feel of an instrument panel readout; uppercase tracking at 0.09-0.10em turns navigation into mission-control abbreviations. The page surrenders its visual real estate to imagery: text floats over rockets and planets rather than sitting in contained cards. Buttons are hairline outlines, never filled. Color appears only as a function of light — the page has no accent, no warm, no soft.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, all section backgrounds — the unbroken dark that makes the photography luminous |
| Star White | `#f0f0fa` | `--color-star-white` | All body text, headings, icons, nav labels, button text, button borders — the sole foreground color; the cool tint reads as artificial light against black, not paper |
| Dim Steel | `#545457` | `--color-dim-steel` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Dark Gunmetal | `#404040` | `--color-dark-gunmetal` | Subtle nav separators and low-emphasis dividers — barely visible against black, used only when structural separation is needed |

## Tokens — Typography

### D-DIN — Primary typeface for navigation, body, labels, buttons. The tracked-out uppercase (0.09–0.10em) at 10-13px turns every nav item and label into an instrument-panel abbreviation. D-DIN is an industrial geometric sans — its sharp terminals and even stroke weight read as engineered hardware typography, not editorial. · `--font-d-din`
- **Substitute:** Barlow (free, closest match in geometry and industrial feel), then DIN Next Condensed
- **Weights:** 400, 700
- **Sizes:** 10, 12, 13, 16
- **Line height:** 1.0–2.0
- **Letter spacing:** 0.09em at 10px, 0.10em at 12-16px
- **OpenType features:** `"tnum" on, "ss01" on`
- **Role:** Primary typeface for navigation, body, labels, buttons. The tracked-out uppercase (0.09–0.10em) at 10-13px turns every nav item and label into an instrument-panel abbreviation. D-DIN is an industrial geometric sans — its sharp terminals and even stroke weight read as engineered hardware typography, not editorial.

### D-DIN-Bold — Section headlines — set in ALL CAPS at 48px with 0.02em tracking. The bold weight is reserved exclusively for headlines; the minimal tracking (compared to the 0.10em on nav) tightens the headline mass and lets it feel solid, not scattered. This is the loudest element on any screen. · `--font-d-din-bold`
- **Substitute:** Barlow Bold (free), then DIN Next LT Pro Bold
- **Weights:** 400
- **Sizes:** 48
- **Line height:** 1.0–1.25
- **Letter spacing:** 0.02em at 48px
- **Role:** Section headlines — set in ALL CAPS at 48px with 0.02em tracking. The bold weight is reserved exclusively for headlines; the minimal tracking (compared to the 0.10em on nav) tightens the headline mass and lets it feel solid, not scattered. This is the loudest element on any screen.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body-sm | 12px | 1.5 | — | `--text-body-sm` |
| body | 13px | 1.5 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| pill | 32px |
| cards | 4px |
| buttons | 4px |

### Layout

- **Section gap:** 60px
- **Card padding:** 20px
- **Element gap:** 18px

## Components

### Ghost Outline Button
**Role:** Primary interactive element

1px solid border in #f0f0fa, transparent fill, 4px radius. Text in #f0f0fa at 12-13px, uppercase, 0.10em letter-spacing, 700 weight. Padding 10-20px horizontal, 12-18px vertical. No filled variant exists. The outlined form against black creates a control-panel switch aesthetic.

### Secondary Outline Button
**Role:** De-emphasized action

1px solid border in #545457, transparent fill, 4px radius. Same text specs as Ghost Outline Button but in #545457. Used for non-primary actions or disabled-adjacent states where the button should recede.

### Pill Button
**Role:** Pill-shaped action variant

32px border-radius with same 1px outline and text treatment as the Ghost Outline Button. Reserved for compact selectors or tag-like actions where the rounded form signals a toggle rather than a navigation.

### Top Navigation Bar
**Role:** Primary site navigation

Horizontal bar, transparent background over black, full viewport width. Logo left (SpaceX wordmark, white), nav links centered or right-aligned in D-DIN 10-12px, 700 weight, 0.09-0.10em tracking, uppercase. A secondary selector widget (launch countdown) sits at the far right with a 4px outlined border. No background fill, no shadow, no sticky backdrop blur — it sits naked on the void.

### Full-Bleed Hero Section
**Role:** Cinematic opening or section divider

Viewport-width photograph (Mars, rocket launches, Earth from orbit) with no border-radius. Text block anchored in the left third of the viewport, vertically centered, with the 48px all-caps headline and 13px body paragraph floating directly over the image. No card, no panel, no background tint behind the text — only the contrast of white type on the dark portions of the photograph.

### Text-Over-Image Block
**Role:** Standard content section

Same full-bleed image with text overlay pattern as the hero. The text block occupies roughly 30-35% of the viewport width on the left. No divider or border separates sections; they flow sequentially, each governed by its photograph.

### Section Headline
**Role:** Title element

D-DIN-Bold, 48px, uppercase, 0.02em tracking, #f0f0fa. Line-height 1.0-1.25. Tight, solid mass. The headline is always the largest element on the page; nothing competes with it for scale.

### Body Paragraph
**Role:** Descriptive text

D-DIN 13px, weight 400, 0.10em letter-spacing, #f0f0fa. Line-height 1.7. The wide tracking on body text is unusual — it reads as a label, not prose. Max width constrained to ~400-500px to keep line length readable.

### Launch Selector Widget
**Role:** Persistent utility in nav

Outlined selector in the top-right navigation. 1px border in #f0f0fa, 4px radius, contains a small caret/chevron. Displays an uppercase tracked label. Functions as a dropdown anchor for upcoming launch information.

## Do's and Don'ts

### Do
- Use #000000 as the canvas for every section; the page has no other background surface
- Set all headlines at 48px in D-DIN-Bold uppercase with 0.02em tracking
- Use uppercase D-DIN with 0.09-0.10em letter-spacing for every nav item, label, and button — tracking is non-negotiable
- Build buttons as 1px outlined ghosts in #f0f0fa with 4px radius; never fill them
- Let full-bleed photography carry the page; constrain text blocks to the left third of the viewport
- Use 18px for element gaps and 60px for section vertical rhythm
- Set body text at 13px with 1.7 line-height and 0.10em tracking — the wide tracking is the signature

### Don't
- Never introduce a chromatic accent color — the system is monochrome by design
- Never use a filled button background; all actions are outlined
- Never place text in a card, panel, or tinted container — type floats directly on photography or on black
- Never use a border-radius above 4px for structural elements (32px is reserved for pill toggles only)
- Never use a font with humanist or editorial warmth; the system demands industrial geometric type
- Never add shadows, gradients, or glow effects — the page has zero elevation vocabulary
- Never use a layout grid that fragments imagery; sections are always full-bleed and single-column

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Base canvas — every section sits directly on black; there is no elevated card layer above the page |
| 2 | Image Bleed | `#000000` | Full-bleed photography composites with black letterboxing or fades; the image edge dissolves back into Void Black |

## Elevation

The design has no elevation system. There are no shadows, no drop shadows, no glows, no blur effects. Depth is created entirely through full-bleed photography rather than through z-axis layering. Interactive states (button hover) are communicated through border opacity or a subtle background fill, never through shadows.

## Imagery

Full-bleed cinematic photography is the design system. Every section is governed by a single high-resolution image: Mars at planetary scale, Starship on the launch pad at golden hour, the Falcon 9 booster descending through a sunset sky. Images are always raw-edged and full-viewport-width — no rounded corners, no contained cards, no overlaid frames. Photography is high-production, dramatic, and often shot at the warm-cool boundary of sunset or in the absolute black of space, which makes the off-white typography read as artificial instrument light against natural darkness. No illustrations, no product mockups, no icon systems — the rockets and planets ARE the icons. Density is image-dominant: each section devotes 80-100% of its visual real estate to a single photograph.

## Layout

Single-column full-bleed flow. There is no grid system, no card layout, no sidebar. The page stacks sections vertically, each section anchored by a viewport-width photograph with a text block floating in the left third. Navigation is a minimal horizontal bar at the top — logo left, nav links right, utility selector far right. Content blocks are left-aligned, never centered, and constrained to ~400-500px width. There are no alternating light/dark bands because the page is always dark. Section transitions are governed by the imagery itself: a Mars section dissolves into a rocket section dissolves into an Earth section, each separated by the full height of the viewport. Sticky behavior is minimal — the nav does not change appearance on scroll.

## Agent Prompt Guide

**Quick Color Reference**
- text: #f0f0fa
- background: #000000
- border: #f0f0fa (primary) / #545457 (secondary)
- accent: none
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Full-bleed hero with text overlay:* Black canvas (#000000) with a viewport-width photograph. Headline: D-DIN-Bold, 48px, uppercase, #f0f0fa, letter-spacing 0.02em, line-height 1.0. Body text: D-DIN, 13px, weight 400, #f0f0fa, letter-spacing 0.10em, line-height 1.7, max-width 450px. Text block positioned in the left third of the viewport, vertically centered. No background panel behind text.

2. *Ghost outline button:* 1px solid border in #f0f0fa, transparent background, 4px border-radius. Text: D-DIN, 12px, 700 weight, uppercase, #f0f0fa, letter-spacing 0.10em. Padding: 10px 20px. Optional right-arrow icon in same color and weight.

3. *Top navigation bar:* Full viewport width, transparent background, no shadow. Logo (white wordmark) at far left. Nav links: D-DIN, 10-12px, 700 weight, uppercase, #f0f0fa, letter-spacing 0.09-0.10em, 18px column-gap. Launch selector widget at far right: 1px #f0f0fa border, 4px radius, same text treatment.

4. *Body paragraph block:* D-DIN, 13px, weight 400, #f0f0fa, letter-spacing 0.10em, line-height 1.7. No paragraph indentation. Max-width 500px. Place directly on black or on the dark portion of a photograph.

## Typography as Instrument Panel

The 0.09-0.10em letter-spacing on all non-headline text is the system's most opinionated choice. It transforms every label, nav item, and button from prose into an instrument readout — a design vocabulary borrowed from aerospace HUD displays and engineering schematics, not from editorial or marketing typography. The tracking must never be reduced; it IS the brand voice at small sizes. Headlines at 48px drop to 0.02em because at display scale the tracking would feel decorative rather than functional.

## Similar Brands

- **NASA** — Same cinematic dark-canvas approach with full-bleed spacecraft photography and minimal white technical typography
- **Tesla** — Same parent-company restraint — monochrome dark interface, uppercase tracked nav, zero decorative color, photography as the primary visual element
- **Blue Origin** — Aerospace competitor with matching dark-mode cinematic photography aesthetic and minimal industrial typography
- **Virgin Galactic** — Same dark canvas + full-bleed rocket/space photography + minimal sans-serif overlay typography approach
- **Rivian** — Same monochrome dark-mode product storytelling with large uppercase headlines and ghost-outlined interactive elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-star-white: #f0f0fa;
  --color-dim-steel: #545457;
  --color-dark-gunmetal: #404040;

  /* Typography — Font Families */
  --font-d-din: 'D-DIN', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-d-din-bold: 'D-DIN-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 12px;
  --leading-body-sm: 1.5;
  --text-body: 13px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Layout */
  --section-gap: 60px;
  --card-padding: 20px;
  --element-gap: 18px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-3xl: 32px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-pill: 32px;
  --radius-cards: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-image-bleed: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-star-white: #f0f0fa;
  --color-dim-steel: #545457;
  --color-dark-gunmetal: #404040;

  /* Typography */
  --font-d-din: 'D-DIN', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-d-din-bold: 'D-DIN-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 12px;
  --leading-body-sm: 1.5;
  --text-body: 13px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-3xl: 32px;
}
```
