# Deno — Style Reference
> whitepaper schematic with mint highlighter — a developer reading desk under daylight

**Theme:** light

Deno's interface is a bright, editorial devtool surface — near-white canvas, dense information blocks, and a single electric mint accent that punctuates an otherwise monochrome layout. Typography is bold and utilitarian: Moranga at display sizes carries weight 700 with tight tracking, while Inter handles body and UI at comfortable sizes with slightly negative letter-spacing. Cards sit flat on the canvas with hairline borders and one soft shadow tier; the 6px radius is the geometric constant, with full-pill used sparingly for tags and install-pills. The install command is the brand's signature surface — a code bar wrapped in a conic mint gradient that makes the copy glow as if backlit.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Mist | `#f8f9fc` | `--color-canvas-mist` | Page background, hero canvas, alternating section bands |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, code-block backgrounds |
| Inkstone | `#0a0e1c` | `--color-inkstone` | Primary headings and body text — near-black with a faint cool tint that reads as black at any size |
| Graphite | `#25272b` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Charcoal | `#121417` | `--color-charcoal` | Deepest dark fill for primary CTAs and nav inversion |
| Slate | `#475269` | `--color-slate` | Secondary headings and muted emphasis |
| Pebble | `#56575a` | `--color-pebble` | Muted body text, helper labels, disabled copy |
| Fog | `#868789` | `--color-fog` | Tertiary text and nav idle state |
| Mist Gray | `#9ea0a5` | `--color-mist-gray` | De-emphasized labels and idle borders |
| Lavender Stone | `#a8b2c8` | `--color-lavender-stone` | Cool-tinted secondary text and icon fills |
| Frost | `#cbd1e1` | `--color-frost` | Cool dividers, section borders, subtle structural lines |
| Chalk Line | `#e5e7eb` | `--color-chalk-line` | Hairline borders, card edges, table separators — the dominant structural divider |
| Electric Mint | `#70ffaf` | `--color-electric-mint` | Brand accent — stat labels, badge fills, primary highlight surface, install-pill glow; the single chromatic note that makes the monochrome system feel switched on |
| Daffodil | `#ffdb1e` | `--color-daffodil` | Secondary highlight — small emphasis marks, version badges, accent dots |
| Sky Pop | `#66c2ff` | `--color-sky-pop` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Sky Wash | `#b3e0ff` | `--color-sky-wash` | Tinted background for blue-accented panels and muted blue surfaces |
| Moss | `#116329` | `--color-moss` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Crimson | `#cf222e` | `--color-crimson` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Iris | `#6639ba` | `--color-iris` | Violet supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Cobalt | `#0550ae` | `--color-cobalt` | Blue supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Moranga — Display and large headings — the weight-700 headlines at 72px and 44px carry the brand voice; tight tracking and a custom geometric construction give Moranga a technical-architectural stance that Inter cannot reproduce · `--font-moranga`
- **Substitute:** Space Grotesk Bold
- **Weights:** 400, 700
- **Sizes:** 14px, 18px, 44px, 72px
- **Line height:** 1.00, 1.10
- **Letter spacing:** -0.025em at display sizes
- **OpenType features:** `"liga"`
- **Role:** Display and large headings — the weight-700 headlines at 72px and 44px carry the brand voice; tight tracking and a custom geometric construction give Moranga a technical-architectural stance that Inter cannot reproduce

### Inter — Body text, nav, buttons, secondary headings, and most UI — the workhorse sans carries the system at every size below display, and the negative letter-spacing at large sizes mirrors the display tracking · `--font-inter`
- **Substitute:** Inter (already Google-hosted)
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 27px, 28px, 36px, 44px, 72px
- **Line height:** 1.00, 1.10, 1.25, 1.33, 1.43, 1.50, 1.56, 2.00
- **Letter spacing:** -0.033em at 72px, -0.025em at 44px, normal at body
- **OpenType features:** `"ss12"`
- **Role:** Body text, nav, buttons, secondary headings, and most UI — the workhorse sans carries the system at every size below display, and the negative letter-spacing at large sizes mirrors the display tracking

### Menlo — Code, terminal output, install commands — weight 650 for emphasis inside monospace blocks distinguishes commands from output without changing face · `--font-menlo`
- **Substitute:** JetBrains Mono
- **Weights:** 400, 650, 700
- **Sizes:** 14px, 16px, 20px
- **Line height:** 1.40, 1.45, 1.50
- **Letter spacing:** normal
- **OpenType features:** `"ss12"`
- **Role:** Code, terminal output, install commands — weight 650 for emphasis inside monospace blocks distinguishes commands from output without changing face

### Recursive — Long-form prose and feature descriptions — a variable cousin to Inter used where reading rhythm matters more than UI density · `--font-recursive`
- **Substitute:** Source Sans 3
- **Weights:** 400
- **Sizes:** 16px, 18px
- **Line height:** 1.50, 1.56
- **Letter spacing:** normal
- **OpenType features:** `"ss12"`
- **Role:** Long-form prose and feature descriptions — a variable cousin to Inter used where reading rhythm matters more than UI density

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.45 | — | `--text-subheading` |
| heading-sm | 28px | 1.33 | — | `--text-heading-sm` |
| heading | 36px | 1.25 | — | `--text-heading` |
| heading-lg | 44px | 1.1 | -1.1px | `--text-heading-lg` |
| display | 72px | 1 | -2.376px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| tags | 6px |
| cards | 6px |
| buttons | 6px |
| statBadges | 6px |
| installPill | 9997px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |
| subtle-2 | `rgb(102, 194, 255) 2px 4px 0px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 128px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

White background, 1px solid #e5e7eb bottom border, 56px horizontal padding. Logo on the left, nav items in Inter 16px weight 400 #0a0e1c with 8px gap, dropdown chevrons, and a search field on the right with ⌘K shortcut badge in a 6px-radius pill.

### Search Field
**Role:** Site-wide command-palette trigger

White background, 1px solid #e5e7eb border, 6px radius, 8px 12px padding. Inter 14px placeholder #868789, with a ⌘K shortcut label on the right in 12px Monospace inside a #f8f9fc pill.

### Primary Mint Button
**Role:** Hero-level call to action

Background #70ffaf, text #0a0e1c, Inter 16px weight 700, 6px radius, 12px 20px padding, trailing chevron arrow. The bright mint fill is the only chromatic button on the page — its job is to be unmissable without feeling heavy.

### Dark GitHub Button
**Role:** Secondary action pairing with mint CTA

Background #0a0e1c, white text, 6px radius, 12px 20px padding. Icon-prefixed in Inter weight 700 with a trailing arrow. Sits beside the mint CTA to balance the hero.

### Outlined Blue Button
**Role:** Tertiary action

Transparent fill, 1px solid #66c2ff border, #0077cc text, 6px radius, 12px 20px padding. Pairs the sky-blue border with a 2px 4px 0 #66c2ff drop shadow for a flat-stack neo-brutalist lift.

### Install Command Bar
**Role:** Hero installation surface

White 6px-radius card, 16px 20px padding, full-pill or 6px geometry. Contains Menlo 14px weight 400 with the command in #0a0e1c. A conic gradient highlight (rgba(0,0,0,0) → #70ffaf → rgba(0,0,0,0)) sits at the top edge as a 2px strip — the signature brand moment that says 'this is where the magic happens'.

### Stat Card
**Role:** Social proof block

White surface, 1px solid #e5e7eb border, 6px radius, 24px padding, soft card shadow. Composed of: mint tag pill (background #70ffaf, text #0a0e1c, Inter 14px weight 700, 6px radius, 2px 8px padding), large number in Inter 36px weight 700 #0a0e1c, and a muted label in Inter 14px #56575a.

### Mint Label Tag
**Role:** Section category markers

Background #70ffaf, text #0a0e1c, Inter 14px weight 700, 6px radius, 2px 8px padding. Used above stat figures and as inline section markers — the mint tag is the system's most repeated brand element.

### Hero Section
**Role:** First-screen composition

Canvas #f8f9fc background, 128px top padding, two-column layout: left column holds the Moranga 72px weight 700 headline at -2.4px tracking in #0a0e1c, a 20px body line in #475269, and the CTA row; right column holds the dinosaur illustration at ~520px width with 6px radius and a soft card shadow.

### Code Block
**Role:** Code samples in documentation

Background #f8f9fc, 1px solid #e5e7eb, 6px radius, 16px 20px padding. Menlo 14px with syntax colors: keywords #6639ba, strings #116329, functions #0550ae, errors #cf222e. Often paired with a copy icon button in the top-right corner.

### Footer Dark Band
**Role:** Site footer

Background #25272b, white text, 24px padding per column, Inter 14px weight 400. Column headings in Inter 14px weight 700 #ffffff, links in #9ea0a5 with 8px row gap.

## Do's and Don'ts

### Do
- Use 6px border-radius on every card, button, tag, and nav surface — it is the geometric constant that ties the system together
- Reserve #70ffaf Electric Mint for the primary CTA, stat labels, and the install-bar highlight strip — letting it appear elsewhere dilutes its punch
- Set Moranga at 72px weight 700 with -2.376px tracking for the largest headlines; drop to Inter 36px at -0.9px for sub-headings so the display voice stays rare
- Pair the mint CTA with a dark Graphite secondary button — the contrast between #70ffaf and #0a0e1c is the hero's visual anchor
- Render code in Menlo 14px inside a #f8f9fc card with 1px #e5e7eb border, never inline against the canvas
- Use the conic-gradient highlight strip (#70ffaf sweep behind a transparent mask) on the install bar and any signature command surface
- Stack section rhythm at 128px gaps with alternating #f8f9fc canvas and #ffffff card surfaces — never let two card surfaces sit adjacent without the canvas breathing between them

### Don't
- Don't use full-pill radius on cards or buttons — 9997px is reserved for install pills, tag chips, and the search shortcut badge
- Don't introduce new chromatic colors for buttons — the only filled button colors are Electric Mint, Graphite/Charcoal, and transparent with Sky Pop border
- Don't apply heavy shadows to nav or footer — those are flat hairline-bordered surfaces, the card-shadow tier belongs on feature cards and stat panels only
- Don't mix Moranga into body copy — it is a display face only; body prose stays Inter or Recursive
- Don't use #0a0e1c for body text smaller than 14px — drop to #475269 or #56575a to preserve hierarchy and reduce contrast fatigue
- Don't place chromatic text on chromatic backgrounds — mint tags always carry ink text, and yellow accents stay on white or canvas only
- Don't use the conic gradient as a general accent — it belongs only on the install bar and command surfaces where it functions as a brand mark

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas Mist | `#f8f9fc` | Page-level background, hero band, section dividers |
| 1 | Paper White | `#ffffff` | Card surfaces, stat panels, code blocks, install bar |
| 2 | Graphite | `#25272b` | Dark CTA buttons and inverse surface blocks |
| 3 | Electric Mint | `#70ffaf` | Accent fill for labels, highlight strips, brand punctuation |

## Elevation

- **Cards and feature panels:** `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`
- **Button resting state:** `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)`
- **Blue-accented CTA:** `2px 4px 0 0 #66c2ff`

## Imagery

Illustration-led hero with a single large mascot illustration (the dinosaur developer at a desk at night) as the right-column anchor. The illustration is contained in a soft-shadowed card with 6px radius, not full-bleed. Below the hero, the page is text- and code-dominant — photography and decorative imagery are absent from interior sections. Iconography is minimal: a few stroke-based glyphs in the nav, chevrons on buttons, and small pictograms in stat cards. The visual language trusts typography and color to do the heavy lifting; imagery appears once per major section as a punctuation mark rather than as a pattern.

## Layout

Full-width nav with contained 1200px content below. Hero is a 2-column split — text block left-aligned, illustration right-aligned — on a #f8f9fc canvas band. Sections alternate between #f8f9fc canvas and #ffffff card surfaces with 128px vertical gaps, creating a rhythmic breathing pattern. Interior content is a 2-column statement-plus-stats layout: a 60/40 split with a bold heading and supporting copy on the left, and a vertical stack of stat cards on the right. Code-heavy sections use a centered 800px command surface. The overall density is comfortable — large headlines (72px, 44px) anchor each section against generous whitespace.

## Agent Prompt Guide

Quick Color Reference:
- text: #0a0e1c (headings, body), #475269 (secondary), #56575a (muted), #9ea0a5 (tertiary)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- border: #e5e7eb (default), #cbd1e1 (cool structural), #e5e7eb on #ffffff
- accent: #70ffaf Electric Mint (brand), #ffdb1e Daffodil (secondary highlight), #66c2ff Sky Pop (blue action)
- code: #6639ba (keyword), #0550ae (function), #116329 (string), #cf222e (error)
- primary action: no distinct CTA color

Example Component Prompts:

2. Build a stat card grid: #ffffff card surface, 1px #e5e7eb border, 6px radius, 24px padding, card shadow. Inside: mint tag (#70ffaf bg, #0a0e1c text, Inter 14px weight 700, 6px radius, 2px 8px padding), then Inter 36px weight 700 number in #0a0e1c, then Inter 14px #56575a label. Stack three of these vertically with 32px row gap.

3. Build an install command bar: #ffffff surface, 1px #e5e7eb border, 6px radius, 16px 20px padding. Content in Menlo 14px weight 400 in #0a0e1c. Add a 2px conic gradient highlight strip at the top edge using #70ffaf sweeping from transparent. Include a copy icon button on the right in a 6px-radius square.

4. Build a top nav bar: #ffffff background, 1px bottom border #e5e7eb, 56px horizontal padding, height ~64px. Logo on the left, then Inter 16px weight 400 nav items in #0a0e1c with 8px gaps and dropdown chevrons, then a search field on the right — #ffffff bg, 1px #e5e7eb border, 6px radius, 8px 12px padding, Inter 14px placeholder #868789, with a ⌘K shortcut label in a 6px-radius #f8f9fc pill.

5. Build a code block: #f8f9fc background, 1px #e5e7eb border, 6px radius, 16px 20px padding. Render in Menlo 14px with syntax colors — keywords in #6639ba, function names in #0550ae, strings in #116329, error markers in #cf222e, default text in #0a0e1c.

## Similar Brands

- **Bun** — Same devtool landing-page language — near-white canvas, oversized confident headline, and a single chromatic accent (Bun uses coral) punctuating monochrome UI
- **Vercel** — Same light-canvas + flat-shadow card stack + 6px-radius geometry, with the same strategy of letting negative letter-spacing on large headlines do the brand work
- **Astro** — Same hairline-border + soft-shadow card system on a near-white canvas, with a single vivid accent color used only for emphasis marks and tag pills
- **Tailscale** — Same flat, borderless-but-not-quite approach with a light canvas and strong typographic hierarchy, using one signature accent (mint-leaning) for highlights
- **Linear** — Same disciplined light-mode product surface with a single bright accent and hairline-bordered components, though Linear skews darker and Deno stays white-paper bright

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-mist: #f8f9fc;
  --color-paper-white: #ffffff;
  --color-inkstone: #0a0e1c;
  --color-graphite: #25272b;
  --color-charcoal: #121417;
  --color-slate: #475269;
  --color-pebble: #56575a;
  --color-fog: #868789;
  --color-mist-gray: #9ea0a5;
  --color-lavender-stone: #a8b2c8;
  --color-frost: #cbd1e1;
  --color-chalk-line: #e5e7eb;
  --color-electric-mint: #70ffaf;
  --color-daffodil: #ffdb1e;
  --color-sky-pop: #66c2ff;
  --color-sky-wash: #b3e0ff;
  --color-moss: #116329;
  --color-crimson: #cf222e;
  --color-iris: #6639ba;
  --color-cobalt: #0550ae;

  /* Typography — Font Families */
  --font-moranga: 'Moranga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-menlo: 'Menlo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recursive: 'Recursive', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.1px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.376px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w650: 650;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 128px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9997px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-tags: 6px;
  --radius-cards: 6px;
  --radius-buttons: 6px;
  --radius-statbadges: 6px;
  --radius-installpill: 9997px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgb(102, 194, 255) 2px 4px 0px 0px;

  /* Surfaces */
  --surface-canvas-mist: #f8f9fc;
  --surface-paper-white: #ffffff;
  --surface-graphite: #25272b;
  --surface-electric-mint: #70ffaf;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-mist: #f8f9fc;
  --color-paper-white: #ffffff;
  --color-inkstone: #0a0e1c;
  --color-graphite: #25272b;
  --color-charcoal: #121417;
  --color-slate: #475269;
  --color-pebble: #56575a;
  --color-fog: #868789;
  --color-mist-gray: #9ea0a5;
  --color-lavender-stone: #a8b2c8;
  --color-frost: #cbd1e1;
  --color-chalk-line: #e5e7eb;
  --color-electric-mint: #70ffaf;
  --color-daffodil: #ffdb1e;
  --color-sky-pop: #66c2ff;
  --color-sky-wash: #b3e0ff;
  --color-moss: #116329;
  --color-crimson: #cf222e;
  --color-iris: #6639ba;
  --color-cobalt: #0550ae;

  /* Typography */
  --font-moranga: 'Moranga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-menlo: 'Menlo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recursive: 'Recursive', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.1px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.376px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9997px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgb(102, 194, 255) 2px 4px 0px 0px;
}
```
