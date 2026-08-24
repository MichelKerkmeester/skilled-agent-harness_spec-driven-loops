# Hex — Style Reference
> alchemy lab on cream parchment — literary serif headline over dense data notebook

**Theme:** light

Hex treats its marketing site like a research notebook: a warm cream canvas, a near-black violet ink, and a hand-drawn editorial headline floating above crisp sans-serif body copy. The hero pairs PP Editorial New italic at weight 200 with PP Formula's compressed 800-weight — a tension between literary softness and engineered density that recurs throughout. CTAs are intentionally quiet: thin dark outlines and dark text on white, no filled buttons, no drop-shadows that would shout over the product. Violet-tinted borders and shadows (rgba(71,57,130,0.1)) are the only chromatic warmth on the surface, while product screenshots and data visualizations carry the real color — viridis-style purples, teals, greens, and yellows blooming inside the notebook panels. The site reads as compact, technical, and confident: dense info blocks, 3px micro-radii on controls, and generous breathing room only between sections.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Violet | `#01011b` | `--color-ink-violet` | Primary text, body copy, heavy borders, data labels — the near-black ink with a violet undertone that makes charts and code blocks feel in-brand even at full contrast |
| Plum Charcoal | `#31263b` | `--color-plum-charcoal` | Heavy borders, icon strokes, secondary text — a warm dark that softens harsh black and gives outlines a violet cast |
| Storm Mauve | `#43394c` | `--color-storm-mauve` | Nav borders, tertiary text, muted headings — sits between Ink Violet and Plum Charcoal for intermediate contrast |
| Slate Iris | `#717a94` | `--color-slate-iris` | Muted body text, icon fills, table borders — cool blue-gray for de-emphasized UI elements |
| Ash Lavender | `#89828d` | `--color-ash-lavender` | Placeholder text, disabled labels, subtle icon tints |
| Parchment | `#fffcfc` | `--color-parchment` | Page background, card surfaces, input fills — the warm near-white canvas, never pure #fff |
| Bone Mist | `#ecedf2` | `--color-bone-mist` | Subtle dividers, zebra-striped table rows, hairline section separators |
| Fog Border | `#dbd7da` | `--color-fog-border` | Default 1px border, card outlines, nav separators |
| Twilight Plum | `#473982` | `--color-twilight-plum` | Brand-violet accent for focus rings (4px halo at 15% opacity), inset borders on elevated cards, decorative brand tints |
| Amethyst | `#6f63b7` | `--color-amethyst` | Mid-tone violet for chart series, illustration fills, and data visualization highlights |
| Wisteria | `#9e91d6` | `--color-wisteria` | Light violet for chart backgrounds, soft brand washes, and paired data fills |
| Indigo Plum | `linear-gradient(90deg, #31263b 0%, #01011b 100%)` | `--color-indigo-plum` | Deep accent violet for dark-mode callouts, gradient endpoints, and badge fills; Gradient start |

## Tokens — Typography

### PP Editorial New — Hero display headline — ultra-light italic serif floats above the page, an anti-convention whisper-voice where competitors use bold sans. The 200 weight at 78px with -0.024em tracking gives the italic terminals room to breathe. Substitute: Cormorant Garamond Italic 200, or Playfair Display Italic 300 as fallback. · `--font-pp-editorial-new`
- **Substitute:** Cormorant Garamond Italic 200
- **Weights:** 200
- **Sizes:** 78px
- **Line height:** 1.30
- **Letter spacing:** -1.87px
- **Role:** Hero display headline — ultra-light italic serif floats above the page, an anti-convention whisper-voice where competitors use bold sans. The 200 weight at 78px with -0.024em tracking gives the italic terminals room to breathe. Substitute: Cormorant Garamond Italic 200, or Playfair Display Italic 300 as fallback.

### PP Formula SemiExtended — Section display headings — semi-condensed industrial sans at 60px balances the editorial hero. Tight -0.031em tracking makes the letterforms lock together for a compressed, engineered read. · `--font-pp-formula-semiextended`
- **Substitute:** Archivo Narrow 700
- **Weights:** 700
- **Sizes:** 60px
- **Line height:** 1.30
- **Letter spacing:** -1.86px
- **Role:** Section display headings — semi-condensed industrial sans at 60px balances the editorial hero. Tight -0.031em tracking makes the letterforms lock together for a compressed, engineered read.

### PP Formula — Mid-weight display subheadings — condensed 800 weight for tight, headline-grade labels · `--font-pp-formula`
- **Substitute:** Archivo Black
- **Weights:** 800
- **Sizes:** 28px
- **Line height:** 1.30
- **Letter spacing:** -0.70px
- **Role:** Mid-weight display subheadings — condensed 800 weight for tight, headline-grade labels

### IBM Plex Sans — Primary UI and body — the workhorse. 400 for body, 500/600 for nav and subheadings, 700 for emphasized labels. Tracking tightens with size: -0.70px at 20px, -0.65px at 26px. Letterforms stay technical and neutral so the violet ink color does the brand work. · `--font-ibm-plex-sans`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 16px, 20px, 24px, 26px
- **Line height:** 1.20–2.33
- **Letter spacing:** -0.0350em at 20px, -0.0250em at 26px
- **Role:** Primary UI and body — the workhorse. 400 for body, 500/600 for nav and subheadings, 700 for emphasized labels. Tracking tightens with size: -0.70px at 20px, -0.65px at 26px. Letterforms stay technical and neutral so the violet ink color does the brand work.

### Cinetype — Secondary UI — nav links, button text, badges, inline labels. A geometric companion to Plex Sans, used when slightly more character is needed in controls. · `--font-cinetype`
- **Substitute:** DM Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 20px, 24px
- **Line height:** 1.00–1.57
- **Role:** Secondary UI — nav links, button text, badges, inline labels. A geometric companion to Plex Sans, used when slightly more character is needed in controls.

### IBM Plex Mono — Code snippets, query cells, technical annotations — confined to 11px in product screenshots and embedded code blocks · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 11px
- **Line height:** 1.50
- **Role:** Code snippets, query cells, technical annotations — confined to 11px in product screenshots and embedded code blocks

### Lato — Tertiary small text — footers, fine print, logo-grid captions · `--font-lato`
- **Substitute:** Source Sans 3
- **Weights:** 400, 600, 700
- **Sizes:** 10px, 12px, 14px
- **Line height:** 1.20–2.20
- **Letter spacing:** -0.0140em
- **Role:** Tertiary small text — footers, fine print, logo-grid captions

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | -0.14px | `--text-caption` |
| body | 16px | 1.6 | — | `--text-body` |
| subheading | 20px | 1.3 | -0.7px | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 26px | 1.2 | -0.65px | `--text-heading` |
| heading-md | 28px | 1.3 | -0.7px | `--text-heading-md` |
| heading-lg | 60px | 1.3 | -1.86px | `--text-heading-lg` |
| display | 78px | 1.3 | -1.87px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 96 | 96px | `--spacing-96` |
| 108 | 108px | `--spacing-108` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| pills | 9999px |
| inputs | 6px |
| buttons | 3px |
| navItems | 3px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(71, 57, 130, 0.1) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(49, 38, 59, 0.22) 0px 0px 0px 1px, rgba(49, 38, 59, ...` | `--shadow-subtle-2` |
| subtle-3 | `rgb(255, 255, 255) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |
| subtle-4 | `rgba(71, 57, 130, 0.15) 0px 0px 0px 4px` | `--shadow-subtle-4` |
| subtle-5 | `rgba(49, 38, 59, 0.22) 0px 0px 0px 1px, rgba(49, 38, 59, ...` | `--shadow-subtle-5` |
| md | `rgba(0, 0, 0, 0.05) 0px 0px 11px 0px inset, rgba(0, 0, 0,...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Outlined CTA Button
**Role:** Primary action trigger (e.g. 'Get started for free')

White fill, 1px border in #31263b (Plum Charcoal), 3px border-radius, 10px vertical / 20px horizontal padding. Text in IBM Plex Sans 500, #01011b (Ink Violet), 14px. No fill on hover — border thickens to 2px or shifts to #01011b. The button's restraint is the point: it never competes with the product screenshot beside it.

### Ghost Text Button
**Role:** Secondary action (e.g. 'Request a demo')

No border, no fill. IBM Plex Sans 500 at 14px in #01011b, underline on hover. Sits to the right of the outlined CTA, creating a paired action pattern without visual weight competition.

### Pill Badge
**Role:** Section eyebrow labels (e.g. 'Agentic data notebooks', 'Conversational self-serve')

Pill shape (9999px radius), 4px 12px padding, 12px IBM Plex Sans 500 in #43394c. No fill — sits directly on the parchment canvas as a quiet typographic marker above section headings.

### Notebook Product Card
**Role:** Hero and mid-page product screenshot containers

White (#ffffff) fill, 6px border-radius, 1px inset border in rgba(71,57,130,0.1), and the signature three-layer shadow: rgba(49,38,59,0.22) 0 0 0 1px outline + rgba(49,38,59,0.1) 0 26px 57px close drop + rgba(49,38,59,0.09) 0 103px 103px ambient spread. The violet-tinted shadows (not pure black) are what make the panel feel in-brand. 20px internal padding, contains a notebook/app builder UI screenshot.

### Editorial Hero Block
**Role:** Above-the-fold headline and subhead

Centered stack on parchment canvas. Line 1: PP Editorial New 200 italic at 78px, #01011b, -1.87px tracking. Line 2: PP Formula SemiExtended 700 at 60px, #01011b, -1.86px tracking. Subhead in IBM Plex Sans 400 at 20px, #43394c, max-width ~640px. 48px gap between display lines, 24px to subhead, 32px to CTA row.

### Top Navigation Bar
**Role:** Sticky header with primary nav

Transparent parchment background, 1px bottom border in #dbd7da. Center-aligned HEX wordmark in PP Formula at 24px. Nav links in IBM Plex Sans 500 at 14px, #31263b. Right side: 'Log in' ghost link + outlined 'Get started' button (3px radius, Plum Charcoal border). No background blur, no shadow — the nav is a flat hairline above the canvas.

### Logo Trust Bar
**Role:** Social proof row below the hero

Two rows of customer logos in monochrome black or near-black, 24px column gap, centered. Small caps label 'TRUSTED BY LEADING DATA COMPANIES' in IBM Plex Sans 600 at 11px, #89828d, letter-spaced +0.08em. Logos are not recolored to brand — they sit in their native grays, treated as content rather than UI.

### Code Cell Block
**Role:** Embedded notebook cells within product cards

No background fill. IBM Plex Mono 400 at 11px, line-height 1.50. Syntax coloring uses a muted palette: keywords in #544692, strings in #22863a, function names in #005cc5, comments in #89828d. Python comment line '# Start from Q3 rows only' in #22863a. Cell border: none — code floats as a continuation of the notebook UI.

### AI Agent Chat Panel
**Role:** Conversational interface preview in product cards

White fill, 6px top-left radius, sits flush right inside the notebook card. Header: 'NexaCorp product line performance (Q3)' in IBM Plex Sans 600 at 14px, #01011b. Share / Continue in project link buttons in #717a94. Agent messages in IBM Plex Sans 400 at 13px, #31263b, with a small avatar circle (20px, Plum Charcoal fill) and 'Thought for 11 seconds' timestamp in #89828d. Input field at bottom: 1px border in #dbd7da, 6px radius, IBM Plex Sans 400 placeholder at 13px in #89828d.

### Data Visualization Panel
**Role:** Bar charts and scatter plots embedded in product cards

Chart titles in IBM Plex Sans 600 at 13px, #01011b. Bar fills use a viridis-style ramp: #472d7b → #21918c → #5ec962 → #fde725. Scatter plots use the same ramp across data points. Axis labels in IBM Plex Sans 400 at 10px, #89828d. No chart background — the chart sits on white inside the notebook card.

### Two-Column Feature Block
**Role:** Text-left / product-right feature sections

Max-width 1200px, 80px vertical gap between sections. Left column: 40% width, contains a pill eyebrow badge, 60px PP Formula SemiExtended heading, 20px IBM Plex Sans body in #43394c, and a ghost outlined button. Right column: 60% width, contains a Notebook Product Card. Alternates left/right by section.

### Section Divider
**Role:** Visual break between page sections

1px horizontal hairline in #ecedf2, full-width, no margin collapse. Alternatively, a 80px vertical gap with no rule — the parchment canvas itself acts as the separator. Decorative asterisk/sparkle motif (4-point star) in #cd5973 (rose accent) marks the end of the editorial hero headline.

## Do's and Don'ts

### Do
- Use the outlined button pattern: 1px #31263b border, 3px radius, white fill, IBM Plex Sans 500 14px #01011b. Never fill a CTA with brand color — the restraint is the brand.
- Pair PP Editorial New 200 italic (78px) with PP Formula SemiExtended 700 (60px) for hero display lines. The serif/sans contrast at extreme weight asymmetry is the signature.
- Apply the three-layer violet-tinted shadow stack to product cards: rgba(49,38,59,0.22) 1px outline + rgba(49,38,59,0.1) 26px close + rgba(49,38,59,0.09) 103px ambient. Never use pure black shadows.
- Use 3px border-radius for buttons, nav items, and links. Use 6px for cards and inputs. Use 9999px for pill badges only.
- Set the page background to #fffcfc (warm near-white), not #ffffff. The cream cast ties the canvas to the violet ink.
- Embed product screenshots as the primary visual content in every section — notebook panels, AI agent threads, data visualizations. Stock photography and abstract renders should not appear.
- Use IBM Plex Mono 400 at 11px for all code cells, with syntax colors in #544692 (keywords), #22863a (strings), #005cc5 (functions), and #89828d (comments).

### Don't
- Don't use filled CTA buttons with brand-color backgrounds. The outlined/dark-text pattern is intentional — filling the button breaks the design language.
- Don't use pure black (#000000) for body text or shadows. Use #01011b for text and rgba(49,38,59,*) for shadows. The violet undertone is what makes the system feel in-brand.
- Don't pair the PP Editorial New hero with a standard bold sans. The weight 200 italic at 78px is anti-convention; using 600+ weight on the serif kills the editorial whisper.
- Don't introduce a second serif or a third display font. The system is PP Editorial New (editorial) + PP Formula (display) + IBM Plex Sans (body) + IBM Plex Mono (code) + Cinetype (secondary UI). Adding more fragments the voice.
- Don't use large border-radii (12px+) on cards or buttons. 3px and 6px are the system — bigger radii feel consumer-app, not data-workbench.
- Don't alternate dark/light section bands. The page is one continuous parchment canvas. Section breaks are 80px gaps and hairlines, not color changes.
- Don't apply the viridis chart colors (#472d7b, #21918c, #5ec962, #fde725, etc.) to UI elements. They are content/visualization colors, not interface tokens.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#fffcfc` | Page background, the warm near-white that everything floats on |
| 1 | Bone Mist Card | `#ecedf2` | Alternate band backgrounds, table row striping, soft section breaks |
| 2 | Plum-Tinted Card | `#fffcfc` | Product screenshot cards with violet inset border (rgba(71,57,130,0.1) 0 0 0 1px inset) and layered dark shadows |
| 3 | Elevated Product Panel | `#ffffff` | Notebook/app builder previews with white fill, 6px radius, and the signature three-layer shadow stack (border + 26px close shadow + 103px ambient) |

## Elevation

- **Notebook Product Card:** `rgba(49,38,59,0.22) 0px 0px 0px 1px, rgba(49,38,59,0.09) 0px 103px 103px 0px, rgba(49,38,59,0.1) 0px 26px 57px 0px`
- **Elevated Card (lighter variant):** `rgba(49,38,59,0.22) 0px 0px 0px 1px, rgba(49,38,59,0.1) 0px 26px 57px 0px`
- **Inset Brand Border:** `rgba(71,57,130,0.1) 0px 0px 0px 1px inset`
- **Focus Ring:** `rgba(71,57,130,0.15) 0px 0px 0px 4px`
- **Input Field:** `rgb(255,255,255) 0px 0px 0px 1px inset`

## Imagery

Product UI screenshots dominate — notebook panels, AI agent chat threads, and data visualizations are the primary visual content, not stock photography. The embedded charts use a viridis color ramp (deep violet → teal → green → yellow) that is content-specific, not part of the UI palette. Decorative motifs are minimal: a small 4-point starburst in rose (#cd5973) marks the end of the editorial hero headline, and a subtle pink-to-plum gradient (rgb(205,160,165) → rgb(49,38,59) at 45deg) appears as an accent wash. No lifestyle photography, no abstract 3D renders. Customer logos in the trust bar are rendered in their native monochrome — treated as content, not branded into the system. The visual density is high: screenshots contain code, charts, chat threads, and UI chrome simultaneously, reinforcing the 'data workbench' identity.

## Layout

Max-width 1200px centered, with the nav bar full-bleed and content blocks constrained. The hero is a centered stack (not split): editorial serif headline above bold sans subhead, subhead above CTA pair, hero product card below — all vertically stacked and centered. Below the hero: a full-width logo trust band, then alternating two-column feature blocks (text-left / product-right, then text-right / product-left). Sections are separated by 80px vertical gaps on the continuous parchment canvas — no dark bands, no color alternation. The page is a single scroll with no sidebar; the rhythm is hero → trust → features stacked vertically, each section getting one product screenshot as its visual anchor. Navigation is a flat sticky top bar with center-aligned wordmark, no mega-menu, no sidebar.

## Agent Prompt Guide

Quick Color Reference:
- Background (canvas): #fffcfc
- Card surface: #ffffff with #ecedf2 dividers
- Border (default): #dbd7da
- Border (heavy/brand): #31263b
- Text (primary): #01011b
- Text (secondary/muted): #43394c
- Accent (brand violet): #473982
- primary action: #31263b (outlined action border)

Example Component Prompts:
1. Build a hero section on a #fffcfc canvas. Display headline: PP Editorial New 200 italic at 78px, #01011b, letter-spacing -1.87px, centered. Second line: PP Formula SemiExtended 700 at 60px, #01011b, letter-spacing -1.86px. Subhead: IBM Plex Sans 400 at 20px, #43394c, max-width 640px. CTA row centered: outlined button (1px #31263b border, 3px radius, 10px 20px padding, IBM Plex Sans 500 14px #01011b) reading 'Get started for free', then ghost text link 'Request a demo' in IBM Plex Sans 500 14px #01011b.
2. Build a notebook product card: white #ffffff fill, 6px radius, 1px inset border in rgba(71,57,130,0.1), 20px padding, and the three-layer shadow (rgba(49,38,59,0.22) 0 0 0 1px, rgba(49,38,59,0.1) 0 26px 57px 0px, rgba(49,38,59,0.09) 0 103px 103px 0px). Inside, embed a code cell with IBM Plex Mono 400 at 11px and a scatter plot using viridis-ramp points (#472d7b → #21918c → #5ec962 → #fde725).
3. Build a pill eyebrow badge: no fill, 9999px radius, 4px 12px padding, IBM Plex Sans 500 at 12px in #43394c. Place above a 60px PP Formula SemiExtended 700 heading in #01011b.
4. Build a two-column feature block: left column 40% width with a pill badge, 60px heading, 20px body text in #43394c, and a ghost outlined button. Right column 60% width with a notebook product card. 80px vertical gap to the next section.
5. Build a top navigation bar: transparent #fffcfc background, 1px bottom border in #dbd7da, 12px vertical padding. Center: HEX wordmark in PP Formula at 24px #01011b. Left: nav links in IBM Plex Sans 500 14px #31263b. Right: 'Log in' ghost link + outlined 'Get started' button (3px radius, #31263b 1px border, IBM Plex Sans 500 14px #01011b).

## Similar Brands

- **Linear** — Same outlined-button + monochrome dark-on-light approach, compact density, and product-screenshot-as-hero strategy
- **Vercel** — Same near-white canvas with dark text, minimal color, and geometric sans typography for body
- **Observable** — Same notebook/data-workbench visual identity with embedded code, charts, and AI panels in product screenshots
- **Retool** — Same technical/devtools audience with compact layouts, dark text on light canvas, and violet-tinted UI accents
- **Notion** — Same warm near-white parchment canvas (#fffcfc vs Notion's off-white) with editorial restraint and minimal elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-violet: #01011b;
  --color-plum-charcoal: #31263b;
  --color-storm-mauve: #43394c;
  --color-slate-iris: #717a94;
  --color-ash-lavender: #89828d;
  --color-parchment: #fffcfc;
  --color-bone-mist: #ecedf2;
  --color-fog-border: #dbd7da;
  --color-twilight-plum: #473982;
  --color-amethyst: #6f63b7;
  --color-wisteria: #9e91d6;
  --color-indigo-plum: #544692;
  --gradient-indigo-plum: linear-gradient(90deg, #31263b 0%, #01011b 100%);

  /* Typography — Font Families */
  --font-pp-editorial-new: 'PP Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-formula-semiextended: 'PP Formula SemiExtended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-formula: 'PP Formula', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cinetype: 'Cinetype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-lato: 'Lato', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.7px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: -0.65px;
  --text-heading-md: 28px;
  --leading-heading-md: 1.3;
  --tracking-heading-md: -0.7px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -1.86px;
  --text-display: 78px;
  --leading-display: 1.3;
  --tracking-display: -1.87px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-96: 96px;
  --spacing-108: 108px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 99px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-pills: 9999px;
  --radius-inputs: 6px;
  --radius-buttons: 3px;
  --radius-navitems: 3px;

  /* Shadows */
  --shadow-subtle: rgba(71, 57, 130, 0.1) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(49, 38, 59, 0.22) 0px 0px 0px 1px, rgba(49, 38, 59, 0.09) 0px 103px 103px 0px, rgba(49, 38, 59, 0.1) 0px 26px 57px 0px;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgba(71, 57, 130, 0.15) 0px 0px 0px 4px;
  --shadow-subtle-5: rgba(49, 38, 59, 0.22) 0px 0px 0px 1px, rgba(49, 38, 59, 0.1) 0px 26px 57px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 0px 11px 0px inset, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 16px 24px -8px, rgba(0, 0, 0, 0.05) 0px 8px 12px -4px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

  /* Surfaces */
  --surface-parchment-canvas: #fffcfc;
  --surface-bone-mist-card: #ecedf2;
  --surface-plum-tinted-card: #fffcfc;
  --surface-elevated-product-panel: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-violet: #01011b;
  --color-plum-charcoal: #31263b;
  --color-storm-mauve: #43394c;
  --color-slate-iris: #717a94;
  --color-ash-lavender: #89828d;
  --color-parchment: #fffcfc;
  --color-bone-mist: #ecedf2;
  --color-fog-border: #dbd7da;
  --color-twilight-plum: #473982;
  --color-amethyst: #6f63b7;
  --color-wisteria: #9e91d6;
  --color-indigo-plum: #544692;

  /* Typography */
  --font-pp-editorial-new: 'PP Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-formula-semiextended: 'PP Formula SemiExtended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-formula: 'PP Formula', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cinetype: 'Cinetype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-lato: 'Lato', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.7px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --tracking-heading: -0.65px;
  --text-heading-md: 28px;
  --leading-heading-md: 1.3;
  --tracking-heading-md: -0.7px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -1.86px;
  --text-display: 78px;
  --leading-display: 1.3;
  --tracking-display: -1.87px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-96: 96px;
  --spacing-108: 108px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 99px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(71, 57, 130, 0.1) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(49, 38, 59, 0.22) 0px 0px 0px 1px, rgba(49, 38, 59, 0.09) 0px 103px 103px 0px, rgba(49, 38, 59, 0.1) 0px 26px 57px 0px;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgba(71, 57, 130, 0.15) 0px 0px 0px 4px;
  --shadow-subtle-5: rgba(49, 38, 59, 0.22) 0px 0px 0px 1px, rgba(49, 38, 59, 0.1) 0px 26px 57px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 0px 11px 0px inset, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 16px 24px -8px, rgba(0, 0, 0, 0.05) 0px 8px 12px -4px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
}
```
