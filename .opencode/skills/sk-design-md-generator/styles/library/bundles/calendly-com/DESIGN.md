# Calendly.com — Style Reference
> Navy ink on cool marble.

**Theme:** light

Calendly reads as a quiet, confident scheduling workspace: a near-white canvas with generous breathing room, crisp white product cards floating on cool stone-gray, and all typography rendered in deep navy ink rather than pure black. The defining move is the navy (#0b3558) used everywhere text appears — headings, buttons, icons, links — which softens the entire interface into something warmer and more editorial than a typical SaaS landing page. A single vivid blue (#006bff) carries every primary action, while decorative pink and cyan blobs bleed from behind product mockups to add warmth without clutter. Components stay restrained: thin 1px hairline borders, subtle blue-tinted shadows, generous 24px card radii, and 8px button corners that feel intentional rather than pill-soft.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Navy | `#0b3558` | `--color-ink-navy` | Primary text, headings, icons, dark CTA backgrounds, nav links |
| Signal Blue | `#006bff` | `--color-signal-blue` | Primary CTA fill, active nav, link accents, selected states |
| Slate Gray | `#476788` | `--color-slate-gray` | Secondary body copy, helper text, muted labels |
| Mist Gray | `#a6bbd1` | `--color-mist-gray` | Disabled text, inactive feature labels, light icon strokes |
| Cloud | `#f8f9fb` | `--color-cloud` | Page canvas, footer background, secondary surface |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, button text on dark fills |
| Pebble | `#f0f3f8` | `--color-pebble` | Badge backgrounds, input fills, subtle dividers, hover washes |
| Hairline | `#d4e0ed` | `--color-hairline` | Card and input borders, dividers, link underline defaults |
| Carbon | `#0a0a0a` | `--color-carbon` | Pure-black text fallback, logo glyph, icon fill |
| Coral Magenta | `#e55cff` | `--color-coral-magenta` | Decorative accent blob behind product cards — adds warmth without UI function |
| Sky Cyan | `#0099ff` | `--color-sky-cyan` | Decorative accent blob behind product cards — pairs with magenta for gradient washes |
| Deep Cobalt | `#004eba` | `--color-deep-cobalt` | Badge text on Pebble fills, info labels |

## Tokens — Typography

### Gilroy — All interface text. Gilroy is a geometric humanist sans with wide apertures and even stroke contrast; its bold weights (700) carry the display headlines, while 500–600 handles buttons and subheads. Substitute with Manrope or Inter. · `--font-gilroy`
- **Substitute:** Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 24, 28, 38, 50, 68, 80
- **Line height:** 1.0–1.71 by step
- **Letter spacing:** normal across all sizes
- **Role:** All interface text. Gilroy is a geometric humanist sans with wide apertures and even stroke contrast; its bold weights (700) carry the display headlines, while 500–600 handles buttons and subheads. Substitute with Manrope or Inter.

### Gilroy — Body text and universal UI labels — weight 400 keeps long copy readable without feeling heavy · `--font-gilroy`
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.0
- **Role:** Body text and universal UI labels — weight 400 keeps long copy readable without feeling heavy

### Gilroy — Secondary headings and emphasized body — the 14/500 is the workhorse for card titles and inline labels · `--font-gilroy`
- **Weights:** 500
- **Sizes:** 14, 20
- **Line height:** 1.4
- **Role:** Secondary headings and emphasized body — the 14/500 is the workhorse for card titles and inline labels

### Gilroy — Button labels and subheadings — 18/600 is the canonical button weight, 24–28/600 for section subheads · `--font-gilroy`
- **Weights:** 600
- **Sizes:** 18, 24, 28
- **Line height:** 1.4–1.6
- **Role:** Button labels and subheadings — 18/600 is the canonical button weight, 24–28/600 for section subheads

### Gilroy — Display and hero headlines — the 80px and 68px sizes are unusually large for a SaaS hero, giving the page editorial weight · `--font-gilroy`
- **Weights:** 700
- **Sizes:** 38, 50, 68, 80
- **Line height:** 1.2–1.21
- **Role:** Display and hero headlines — the 80px and 68px sizes are unusually large for a SaaS hero, giving the page editorial weight

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1 | — | `--text-body` |
| button | 18px | 1.6 | — | `--text-button` |
| body-lg | 20px | 1.4 | — | `--text-body-lg` |
| subheading | 28px | 1.4 | — | `--text-subheading` |
| heading-sm | 38px | 1.21 | — | `--text-heading-sm` |
| heading | 50px | 1.2 | — | `--text-heading` |
| heading-lg | 68px | 1.2 | — | `--text-heading-lg` |
| display | 80px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

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
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| small | 4px |
| badges | 9999px |
| inputs | 8px |
| buttons | 8px |
| productCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 1...` | `--shadow-sm` |
| sm-2 | `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 1...` | `--shadow-sm-2` |
| sm-3 | `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 1...` | `--shadow-sm-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-64px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** Filled button for the main action on a screen

Background #006bff, text #ffffff at 18px weight 600, border-radius 8px, padding 6px 16px (compact) or 10px 16px (comfortable). No border. Used for "Sign up for free", "Get started", "Sign up with Google".

### Dark CTA Button
**Role:** Secondary filled action, often paired with primary for contrast

Background #0b3558, text #ffffff at 18px weight 600, border-radius 8px. Used for "Sign up with Microsoft" and "Get started" in the header.

### Ghost Text Link
**Role:** In-flow text link with no background

Color #0b3558 at 14–18px weight 500–600, no background, no border, no padding. Underline optional on hover. Used for inline body links like "View all integrations", "Learn more".

### Outlined White Button
**Role:** Ghost button on dark or image backgrounds

Color #ffffff, border 1px solid #ffffff, border-radius 4px, no background fill. Used over hero imagery or dark sections.

### Social Sign-In Button
**Role:** OAuth entry point

Full-width pill with provider logo left, text right. Two variants: Google (white bg, #0b3558 text, 1px Hairline border) and Microsoft (Ink Navy bg, white text, no border). Padding 12px 16px, border-radius 8px.

### Elevated Product Card
**Role:** Showcases a product mockup or UI screenshot

Background #ffffff, border-radius 16px, padding 0px (image fills card). Three-layer blue-tinted shadow: rgba(71,103,136,0.04) 0 4px 5px, rgba(71,103,136,0.03) 0 8px 15px, rgba(71,103,136,0.08) 0 30px 50px. Often sits in front of a Coral Magenta or Sky Cyan decorative blob.

### Feature Accordion Item
**Role:** Expandable or highlighted feature row

Active item: heading #0b3558 at 18–20px weight 600 with #006bff icon; inactive items: heading #a6bbd1 at 16px weight 400. Left-aligned icon, right-aligned chevron. 1px Hairline divider below.

### Pill Badge
**Role:** Inline label for promotions, status, or tags

Background #e6f0ff (Pebble-tinted), text #004eba at 12px weight 500, border-radius 50px, padding 4px 8px. Examples: "Save 16%", "We're hiring!".

### Trust Logo Strip
**Role:** Social proof band below hero

Single row of monochrome partner logos (Compass, L'Oréal, Zendesk, Dropbox, Gong, Carnival, Indiana University) in #a6bbd1, evenly spaced, centered. No card, no border — logos float on the canvas.

### Booking Widget Card
**Role:** Embedded preview of Calendly's scheduling UI

Background #ffffff, border-radius 16px, internal padding 0px. Three columns: organizer info (avatar + name), date grid (calendar with selected date highlighted #006bff), time slots (pill buttons with active state in #006bff). Mimics the actual product.

### Section Header Block
**Role:** Centered intro for content sections

H2 heading at 50–68px weight 700 in #0b3558, centered. Subtext at 16px weight 400 in #476788, centered, max-width ~640px. Optional CTA button below.

### Footer
**Role:** Site-wide footer with link columns

Background #f8f9fb, padding 40px horizontal. Link columns in #0b3558 at 14px weight 500, headings at 12px weight 600 uppercase in #476788.

## Do's and Don'ts

### Do
- Use Ink Navy #0b3558 for all text — never pure #000000, which breaks the system's warmth
- Use Signal Blue #006bff exclusively for filled primary CTAs; reserve Ink Navy for secondary dark buttons
- Set all card border-radius to 16px for product cards and 24px for feature panels
- Apply the three-layer blue-tinted shadow stack to any elevated surface above the canvas
- Use Gilroy weight 700 at 50–80px for hero and section headlines — undersized headings lose the page's editorial confidence
- Place every product visual in front of a Coral Magenta or Sky Cyan decorative blob offset by 20–40px
- Set buttons at 8px border-radius — not 4px (too sharp) and not pill (too soft) for this system

### Don't
- Don't use #000000 as a text color — always reach for Ink Navy #0b3558 or Slate Gray #476788
- Don't apply shadows with neutral black (rgba(0,0,0,...)) — all elevation must use the blue-tinted shadow base
- Don't use the decorative magenta/cyan blobs as fills for UI elements — they are atmosphere only, not functional color
- Don't create buttons with border-radius above 12px or below 4px — 8px is the system's sharp-but-soft sweet spot
- Don't set heading sizes below 38px for H2 or below 24px for H3 — the type scale skips small headings on purpose
- Don't use the badge color #004eba for CTAs — it reads as informational, not actionable
- Don't add gradients to backgrounds — the system is flat surfaces with shadow-based elevation only
- Don't pair the Signal Blue and Ink Navy CTAs on the same surface without enough spacing — they compete at close range

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f8f9fb` | Page background, footer surface |
| 1 | Card | `#ffffff` | Elevated product cards, booking widget, feature panels |
| 2 | Input Fill | `#f0f3f8` | Form inputs, badge backgrounds, subtle hover washes |
| 3 | Dark Surface | `#0b3558` | Dark CTA buttons, inverse sections |
| 4 | Accent Surface | `#006bff` | Primary action fills, selected/active states |

## Elevation

- **Elevated Product Card:** `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px`
- **Link card with icon:** `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px`
- **Button:** `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px`

## Imagery

Product screenshots are the primary visual — clean UI mockups of the booking calendar rendered on pure white cards with generous rounded corners. Decorative treatment: each product card is backed by a soft blob shape in Coral Magenta (#e55cff) or Sky Cyan (#0099ff), slightly offset and blurred, creating an editorial collage effect rather than a flat screenshot. No photography, no lifestyle imagery — all visuals are product UI, abstract accent shapes, or monochrome partner logos in the trust strip. Icons are line-style with 1.5–2px stroke weight, mono-tone in Ink Navy or Signal Blue.

## Layout

Max-width 1200px centered, generous outer margins on desktop. Hero is a two-column split: left column holds the 80px headline + body copy + stacked sign-in buttons, right column holds the booking widget card backed by decorative blob shapes. Below the hero sits the trust logo strip as a single full-width band. Subsequent sections alternate between centered header blocks (H2 + subtext + optional CTA) followed by two-column feature blocks (text-left/product-right or product-left/text-right) with decorative accent blobs behind every product visual. Card grids are rare — the layout prefers side-by-side paired sections over multi-column grids. Section gaps are 48–64px. Navigation is a 64px sticky top bar with logo left, centered menu, and CTA cluster right.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #0b3558
- Text (secondary): #476788
- Background (canvas): #f8f9fb
- Surface (card): #ffffff
- Border (hairline): #d4e0ed
- Accent (decorative): #e55cff / #0099ff
- primary action: #006bff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #006bff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature block (text-left)*: Section gap 64px. H2 at 50px Gilroy weight 700, color #0b3558, centered above. Left column: feature list with Ink Navy icons (#006bff for active item, #a6bbd1 for inactive). Right column: 16px-radius white card with booking widget UI, backed by a #0099ff blob.

3. *Pill badge*: Background #e6f0ff, text #004eba at 12px Gilroy weight 500, border-radius 50px, padding 4px 8px.

4. *Footer*: Background #f8f9fb, padding 40px horizontal. Column headings at 12px Gilroy weight 600 uppercase, color #476788. Links at 14px Gilroy weight 500, color #0b3558.

5. *Social sign-in button*: Full-width, 12px 16px padding, 8px radius. Google variant: white bg, #0b3558 text, 1px #d4e0ed border. Microsoft variant: #0b3558 bg, white text, no border.

## Similar Brands

- **Linear** — Same Ink Navy text on near-white canvas, blue-tinted shadows, and single vivid blue primary action — both treat restraint as a feature
- **Notion** — Similar white-card-on-cool-gray layout, generous 16–24px radii, and navy/blue text palette that avoids pure black
- **Loom** — Same editorial heading sizes (50–80px bold), product-screenshot-in-front-of-colorful-blob hero treatment, and clean light-mode SaaS language
- **Webflow** — Shares the white canvas + navy text + single electric blue accent, with decorative gradient shapes behind product visuals

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-navy: #0b3558;
  --color-signal-blue: #006bff;
  --color-slate-gray: #476788;
  --color-mist-gray: #a6bbd1;
  --color-cloud: #f8f9fb;
  --color-paper: #ffffff;
  --color-pebble: #f0f3f8;
  --color-hairline: #d4e0ed;
  --color-carbon: #0a0a0a;
  --color-coral-magenta: #e55cff;
  --color-sky-cyan: #0099ff;
  --color-deep-cobalt: #004eba;

  /* Typography — Font Families */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1;
  --text-button: 18px;
  --leading-button: 1.6;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --text-subheading: 28px;
  --leading-subheading: 1.4;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.21;
  --text-heading: 50px;
  --leading-heading: 1.2;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Typography — Weights */
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
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-64px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-small: 4px;
  --radius-badges: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-productcards: 16px;

  /* Shadows */
  --shadow-sm: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px;
  --shadow-sm-2: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px;
  --shadow-sm-3: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px;

  /* Surfaces */
  --surface-canvas: #f8f9fb;
  --surface-card: #ffffff;
  --surface-input-fill: #f0f3f8;
  --surface-dark-surface: #0b3558;
  --surface-accent-surface: #006bff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-navy: #0b3558;
  --color-signal-blue: #006bff;
  --color-slate-gray: #476788;
  --color-mist-gray: #a6bbd1;
  --color-cloud: #f8f9fb;
  --color-paper: #ffffff;
  --color-pebble: #f0f3f8;
  --color-hairline: #d4e0ed;
  --color-carbon: #0a0a0a;
  --color-coral-magenta: #e55cff;
  --color-sky-cyan: #0099ff;
  --color-deep-cobalt: #004eba;

  /* Typography */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1;
  --text-button: 18px;
  --leading-button: 1.6;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --text-subheading: 28px;
  --leading-subheading: 1.4;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.21;
  --text-heading: 50px;
  --leading-heading: 1.2;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-sm: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px;
  --shadow-sm-2: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px;
  --shadow-sm-3: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px;
}
```
