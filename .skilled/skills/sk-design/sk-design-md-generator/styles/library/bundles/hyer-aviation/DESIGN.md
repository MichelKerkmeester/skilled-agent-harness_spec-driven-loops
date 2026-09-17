# Hyer Aviation — Style Reference
> Cockpit twilight over parchment. A pale dawn-sky meets a slab-serif logo the size of a fuselage, with one warm clay accent breaking the monochrome restraint.

**Theme:** mixed

Hyer Aviation reads as a luxury travel editorial: a pale sky-bluish hero with a sculptural jet floats over a bright white canvas, anchored by near-black typography so heavy it feels cast in metal. The palette is deliberately austere — one warm terracotta accent punctuates an otherwise monochromatic system, appearing only in featured solution cards while the rest of the interface stays in deep ink and parchment. Typography is the brand's loudest voice: a single display face at 187px and 131px with extreme tight tracking dominates hero sections, while body text settles at 18px with generous 1.61 line-height for a calm, breathable rhythm. Every interactive element is a full pill (1000px+ radius) or a hard-edged panel, creating a tension between soft, inviting buttons and the architectural boldness of the headlines.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Ink | `#000d10` | `--color-deep-ink` | Primary text, footer background, filled action buttons, icon strokes — the structural near-black carries the entire brand voice in type and CTAs |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark, nav backdrop — the quiet field against which everything else reads |
| Cool Ash | `#8e8e95` | `--color-cool-ash` | Secondary body text, nav items, muted helper labels — the only neutral that recedes deliberately behind primary copy |
| Pebble | `#d5d3d4` | `--color-pebble` | Hairline borders, dividers, subtle surface alternation between dark sections — visible only at edges |
| Midnight Hull | `#0f0f1c` | `--color-midnight-hull` | Dark section backgrounds (Travel Support area) — slightly bluer than Deep Ink to differentiate stacked dark bands |
| Charcoal Deck | `#151623` | `--color-charcoal-deck` | Elevated dark panels and deep section backgrounds — the top of the dark surface stack with a faint indigo cast |
| Clay Ember | `#bc7155` | `--color-clay-ember` | Featured solution card background, decorative fills — the single warm note in an otherwise cold system, used sparingly to make one offering feel chosen |

## Tokens — Typography

### HelveticaNowDisplay — Sole typeface across the system. The weight 700 at 187px with -0.02em tracking is the signature: it sets the wordmark and hero at near-architectural scale, turning headlines into physical objects. Weight 400 at 18px with 1.61 line-height handles all body copy, creating the most spacious text block in the type system. · `--font-helveticanowdisplay`
- **Substitute:** Neue Haas Grotesk Display, Inter, Helvetica Neue
- **Weights:** 400, 700
- **Sizes:** 17px, 18px, 20px, 23px, 30px, 37px, 52px, 60px, 63px, 131px, 187px
- **Line height:** 0.80 (display) → 1.00 (headings) → 1.61 (body)
- **Letter spacing:** -3.74px at 187px, -2.62px at 131px, -1.26px at 63px, -0.52px at 52px, -0.37px at 37px, -0.23px at 23px, 0 at 18-20px
- **OpenType features:** `normal`
- **Role:** Sole typeface across the system. The weight 700 at 187px with -0.02em tracking is the signature: it sets the wordmark and hero at near-architectural scale, turning headlines into physical objects. Weight 400 at 18px with 1.61 line-height handles all body copy, creating the most spacious text block in the type system.

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 700
- **Sizes:** 17px
- **Line height:** 1
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 17px | 17 | — | `--text-caption` |
| nav | 20px | 20 | — | `--text-nav` |
| subheading | 23px | 23 | -0.23px | `--text-subheading` |
| heading-sm | 30px | 30 | — | `--text-heading-sm` |
| heading | 37px | 37 | -0.37px | `--text-heading` |
| heading-lg | 52px | 52 | -0.52px | `--text-heading-lg` |
| display | 63px | 63 | -1.26px | `--text-display` |
| display-xl | 131px | 131 | -2.62px | `--text-display-xl` |
| hero | 187px | 150 | -3.74px | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 11 | 11px | `--spacing-11` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 21 | 21px | `--spacing-21` |
| 22 | 22px | `--spacing-22` |
| 23 | 23px | `--spacing-23` |
| 31 | 31px | `--spacing-31` |
| 34 | 34px | `--spacing-34` |
| 38 | 38px | `--spacing-38` |
| 52 | 52px | `--spacing-52` |
| 53 | 53px | `--spacing-53` |
| 59 | 59px | `--spacing-59` |
| 68 | 68px | `--spacing-68` |
| 119 | 119px | `--spacing-119` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 1000px |
| buttons | 1000px |
| decorative | 45px |
| heroPanels | 0px |
| iconButtons | 100% |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 22px
- **Element gap:** 16px

## Components

### Filled Dark Pill Button
**Role:** Primary action trigger on light backgrounds

Background #000d10, text #ffffff, 1000px border-radius, padding 15px 22px 16px 22px, font 17px weight 700. Used for CTAs like 'Hyer® Stays' and 'Hyer® Travel' that need to feel confident and terminal.

### Ghost White Pill Button
**Role:** Secondary action on dark surfaces

Transparent background, text #ffffff, 1px white border, 1000px border-radius, same 15px 22px padding. Inverts the dark button for use on dark hero or footer contexts.

### Circular Icon Button
**Role:** Menu toggle and compact icon affordance

100% border-radius, background #000d10, white icon, square hit area. Used for the hamburger nav toggle in the hero.

### Featured Clay Card
**Role:** Highlighted solution offering

Hard-edged 0px radius rectangle, background #bc7155, white text, generous padding 53px 59px. The only warm block in the system — reserved for one product card per page to create focal asymmetry.

### Standard White Card
**Role:** Default content container

White background on canvas, 0px radius, no border, no shadow. Relies on surrounding negative space and hairline #d5d3d4 dividers above titles to define its boundary.

### Hero Wordmark
**Role:** Brand mark at extreme scale

Hyer® set at 131px weight 700, letter-spacing -2.62px, #000d10, paired with a small ® superscript at ~30% scale. Sits flush-left of the hero viewport.

### Hero Headline
**Role:** Primary hero statement

60-63px weight 700, letter-spacing -1.26px, #000d10, line-height 1.0. Two-line blocks like 'Beyond / Travel.' with the period as a deliberate typographic stop.

### Section Headline
**Role:** Content section title

37-52px weight 700, letter-spacing -0.37 to -0.52px, #000d10, four-line blocks max with line-height 1.0. Anchors every white content band.

### Feature Block
**Role:** Sub-section with title and description

Title 23px weight 700 in #000d10, body 18px weight 400 in #8e8e95 with 1.61 line-height, separated from the next block by a 1px #d5d3d4 hairline rule. Arranged in 2-column grids.

### Dark Content Section
**Role:** Full-bleed dark band for contrast content

Background #0f0f1c or #151623, white heading at 30-37px, white body at 18px, content right-aligned in a single column. Language list with flag emoji is the only chromatic content within.

### Footer Terminal
**Role:** Page-end navigation and identity

Full-bleed #000d10 background, large white wordmark, nav links in #8e8e95 at 20px, multi-column layout with social and legal rows.

### Top Navigation
**Role:** Primary site navigation

Transparent over hero, sticky or absolute positioned. Items at 20px weight 400, #000d10 on light, with 13px vertical gap between stacked items in mobile.

## Do's and Don'ts

### Do
- Set display headlines at 60-187px weight 700 with letter-spacing between -1.26px and -3.74px — the tightness is what makes the type read as architectural, not decorative.
- Use #000d10 for all primary text, filled buttons, icon strokes, and footer — treat it as the single structural color of the system.
- Reserve #bc7155 clay for one featured card per page — the restraint is the point, not the warmth.
- Use 1000px border-radius on every button and nav pill — no square buttons, no partial rounding, the pill is the action shape.
- Set body copy at 18px with line-height 29 (1.61 ratio) — the generous leading is what makes the dense editorial layout breathe.
- Alternate between white canvas sections and #0f0f1c/#151623 dark bands to create vertical contrast — the page should oscillate, not stay flat.
- End every hero headline with a period — 'Beyond Travel.' is the signature punctuation pattern.

### Don't
- Don't apply shadows to cards or buttons — the system defines elevation through surface color shifts (white → clay → dark slate), not drop shadows.
- Don't introduce additional accent hues — the system is monochrome with one warm note; adding green, blue, or any secondary accent breaks the austere editorial voice.
- Don't use #000d10 in the page background role on white sections — it is the text and button color, not a surface color, on the light canvas.
- Don't round the featured clay card — it must remain 0px radius to contrast with every pill-shaped element around it.
- Don't set body type below 18px — the spaciousness of 18/29 is a signature; smaller sizes break the breathing rhythm.
- Don't use light or thin weights for headlines — weight 700 is non-negotiable from 23px upward; the weight IS the brand voice.
- Don't place two #bc7155 elements on the same page — the accent is single-use per viewport.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas White | `#ffffff` | Primary page background across all content sections |
| 1 | Card White | `#ffffff` | Feature cards and content blocks sitting on canvas |
| 2 | Featured Clay | `#bc7155` | Highlighted solution card that breaks the monochrome rhythm |
| 3 | Dark Slate | `#151623` | Full-bleed dark content sections (Travel Support) |
| 4 | Footer Ink | `#000d10` | Terminal dark band at the base of every page |

## Elevation

- **No elevation system detected:** `Cards and buttons rely on surface color contrast and hairline borders, not box-shadow`

## Imagery

Photography and 3D renders dominate the visual language, specifically a single hero 3D render of a white private jet with dark accent striping, photographed/rendered against a soft gradient sky transitioning from pale blue at top to warm cream at the horizon. The jet is shown in a three-quarter banking pose, positioned left-of-center to leave room for the wordmark and headline. The render is hyper-clean, product-showcase style — no lifestyle context, no passengers, no airports. The aircraft IS the hero. Additional imagery (when used in content sections) follows the same product-crop logic: tight, isolated, on pure white. Iconography is minimal and always stroke-based in #000d10.

## Layout

Full-bleed sections that alternate between pale sky-tinged hero, white content bands, and dark midnight sections. The hero is the only asymmetric composition: wordmark flush-left at extreme scale, a right-side two-line headline, and the 3D jet floating in the lower-center negative space. Content sections are right-aligned single-column (heading + 2×2 feature grid) on white, creating strong rightward gravity. Navigation is a single transparent row at the top with three text links and a circular menu button. Footer is a full-bleed dark terminal with large wordmark. Vertical rhythm is set by 80px section gaps with no visible dividers between most bands — the color shift itself separates them.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000d10
- background: #ffffff
- border: #d5d3d4
- accent: #bc7155 (featured card only)
- primary action: #bc7155 (filled action)
- dark surface: #0f0f1c / #151623
- muted text: #8e8e95

**Example Component Prompts**

1. Create a Primary Action Button: #bc7155 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a featured solution card: background #bc7155, text #ffffff, border-radius 0px, padding 53px 59px, title at 37px weight 700, description at 18px weight 400 line-height 29. This is the only warm block in the system — use it once per page for one highlighted offering.

3. Create a hero section: pale blue-to-cream gradient sky background, wordmark 'Hyer®' at 131px weight 700 letter-spacing -2.62px in #000d10 flush-left, headline 'Beyond Travel.' at 60px weight 700 in #000d10 right-aligned, 3D white jet render floating center-low, ghost pill button bottom-right with white border on transparent background.

4. Create a feature block grid: 2-column layout on white canvas, each block has a 1px solid #d5d3d4 hairline above the title, title at 23px weight 700 in #000d10, body at 18px weight 400 in #8e8e95 with line-height 29. Gap between columns 80px.

5. Create a dark content section: full-bleed background #0f0f1c, right-aligned content column at ~50% width, heading at 37px weight 700 in #ffffff, body at 18px weight 400 in #ffffff with line-height 29. Use this for support, contact, or contrast content that needs to feel terminal.

## Similar Brands

- **VistaJet** — Same private aviation editorial language: full-bleed dark sections, enormous serif-adjacent display type, and a near-monochrome palette with a single warm accent for featured offerings
- **NetJets** — Luxury aviation brand using 3D aircraft renders on gradient sky backgrounds with ultra-tight letter-spacing on display headlines and pill-shaped CTAs
- **Blade** — Urban aviation startup sharing the same editorial-meets-product tension: stark white canvas, massive bold display headlines, and a single accent color for featured service cards
- **Rimowa** — Premium travel brand with the same typographic confidence — oversized bold headlines, monochrome body sections, and the discipline to use accent color only once per page
- **Sonos** — Product-hero photography on pale atmospheric backgrounds, 100% pill buttons, and the same editorial restraint of letting one object carry the visual weight of a page

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-ink: #000d10;
  --color-pure-white: #ffffff;
  --color-cool-ash: #8e8e95;
  --color-pebble: #d5d3d4;
  --color-midnight-hull: #0f0f1c;
  --color-charcoal-deck: #151623;
  --color-clay-ember: #bc7155;

  /* Typography — Font Families */
  --font-helveticanowdisplay: 'HelveticaNowDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 17px;
  --leading-caption: 17;
  --text-nav: 20px;
  --leading-nav: 20;
  --text-subheading: 23px;
  --leading-subheading: 23;
  --tracking-subheading: -0.23px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 30;
  --text-heading: 37px;
  --leading-heading: 37;
  --tracking-heading: -0.37px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 52;
  --tracking-heading-lg: -0.52px;
  --text-display: 63px;
  --leading-display: 63;
  --tracking-display: -1.26px;
  --text-display-xl: 131px;
  --leading-display-xl: 131;
  --tracking-display-xl: -2.62px;
  --text-hero: 187px;
  --leading-hero: 150;
  --tracking-hero: -3.74px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-31: 31px;
  --spacing-34: 34px;
  --spacing-38: 38px;
  --spacing-52: 52px;
  --spacing-53: 53px;
  --spacing-59: 59px;
  --spacing-68: 68px;
  --spacing-119: 119px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 22px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-3xl: 45px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 1000px;
  --radius-buttons: 1000px;
  --radius-decorative: 45px;
  --radius-heropanels: 0px;
  --radius-iconbuttons: 100%;

  /* Surfaces */
  --surface-canvas-white: #ffffff;
  --surface-card-white: #ffffff;
  --surface-featured-clay: #bc7155;
  --surface-dark-slate: #151623;
  --surface-footer-ink: #000d10;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-ink: #000d10;
  --color-pure-white: #ffffff;
  --color-cool-ash: #8e8e95;
  --color-pebble: #d5d3d4;
  --color-midnight-hull: #0f0f1c;
  --color-charcoal-deck: #151623;
  --color-clay-ember: #bc7155;

  /* Typography */
  --font-helveticanowdisplay: 'HelveticaNowDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 17px;
  --leading-caption: 17;
  --text-nav: 20px;
  --leading-nav: 20;
  --text-subheading: 23px;
  --leading-subheading: 23;
  --tracking-subheading: -0.23px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 30;
  --text-heading: 37px;
  --leading-heading: 37;
  --tracking-heading: -0.37px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 52;
  --tracking-heading-lg: -0.52px;
  --text-display: 63px;
  --leading-display: 63;
  --tracking-display: -1.26px;
  --text-display-xl: 131px;
  --leading-display-xl: 131;
  --tracking-display-xl: -2.62px;
  --text-hero: 187px;
  --leading-hero: 150;
  --tracking-hero: -3.74px;

  /* Spacing */
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-31: 31px;
  --spacing-34: 34px;
  --spacing-38: 38px;
  --spacing-52: 52px;
  --spacing-53: 53px;
  --spacing-59: 59px;
  --spacing-68: 68px;
  --spacing-119: 119px;

  /* Border Radius */
  --radius-3xl: 45px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;
}
```
