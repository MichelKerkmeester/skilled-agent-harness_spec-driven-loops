# Function — Style Reference
> warm apothecary journal on parchment

**Theme:** light

Function reads like a premium editorial wellness journal printed on warm cream paper: a serif display voice (Financier) delivers headlines with quiet authority while a humanist sans (Ftbase) carries the body language of a calm clinician. The canvas is never sterile white — every surface sits in a warm parchment range from #fef9ef to #f5eee1, and a single terracotta accent (#b05a36) punctuates actions, badges, and icon strokes like a wax seal on an apothecary label. Components are rounded generously (24px cards, 40px buttons, 9999px pills) but never feel toy-like because shadows are used sparingly and only at two elevations. Italic serif words mixed with roman serif in the same headline create a typographic rhythm that's the system's strongest signature — health tech that trusts the reader to slow down.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Terracotta Seal | `linear-gradient(116deg, rgb(176, 90, 54), rgb(212, 166, 142))` | `--color-terracotta-seal` | Primary action buttons, eyebrow labels, active states, icon strokes, key badges — a single warm rust against cream paper, evokes clinical warmth without medical sterility; Subtle hero overlay gradient from terracotta to a lighter tan — used on hero photo treatment and decorative seals, not on UI surfaces |
| Parchment | `#fef9ef` | `--color-parchment` | Page canvas and primary surface — never use pure white; this warm off-white is the system's base tone |
| Aged Paper | `#f5eee1` | `--color-aged-paper` | Card and panel surfaces, subtle wash backgrounds — one step deeper than the canvas to create soft elevation without shadows |
| Warm Taupe | `#d1c9bf` | `--color-warm-taupe` | Hairline borders, divider lines, card outlines — replaces cold gray with a tone that belongs to the cream family |
| Ink | `#2a2b2f` | `--color-ink` | Primary text, heading fills, strong borders — near-black with a barely-warm cast to harmonize with parchment rather than fight it |
| Charcoal | `#333333` | `--color-charcoal` | Secondary text, body copy, default icon fills, structural borders — slightly softer than Ink for reading-length passages |
| Graphite | `#515151` | `--color-graphite` | Muted helper text, captions, secondary metadata — never below 14px without sufficient weight to maintain AAA contrast on parchment |
| Ash | `#808988` | `--color-ash` | Input borders, disabled state outlines, placeholder text — the only cool-leaning neutral, used only on form elements |
| Pure Black | `#000000` | `--color-pure-black` | SVG fill default, logo mark — reserve for vector illustration, never use as text or background |

## Tokens — Typography

### Financier Display — Display and editorial headlines — weight 400 for roman, weight 300 for italic accent words within the same headline (e.g. 'Testing is easy' pairs roman with italic). The mix of roman + italic serif in one line is the system's most distinctive typographic move. Substitute: GT Super, Domaine Display, Tiempos Headline · `--font-financier-display`
- **Substitute:** GT Super Display, Domaine Display, or Tiempos Headline
- **Weights:** 300, 400
- **Sizes:** 34, 45, 64, 80, 88px
- **Line height:** 0.90–1.15
- **Letter spacing:** normal
- **Role:** Display and editorial headlines — weight 400 for roman, weight 300 for italic accent words within the same headline (e.g. 'Testing is easy' pairs roman with italic). The mix of roman + italic serif in one line is the system's most distinctive typographic move. Substitute: GT Super, Domaine Display, Tiempos Headline

### Ftbase — Body, navigation, buttons, UI labels, and all interface text. Weight 300 is used for hero subhead and large descriptive passages; weight 400 for body; weight 600 for button labels and strong UI; weight 700 reserved for emphasis. The consistent -0.023em tracking pulls the type into a tight, confident block that contrasts the generous serif spacing. Substitute: Inter, Söhne, or Untitled Sans · `--font-ftbase`
- **Substitute:** Inter, Söhne, or Untitled Sans
- **Weights:** 300, 400, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 24px
- **Line height:** 1.20–1.50
- **Letter spacing:** -0.023em (≈ -0.28px at 12px, -0.37px at 16px, -0.55px at 24px)
- **Role:** Body, navigation, buttons, UI labels, and all interface text. Weight 300 is used for hero subhead and large descriptive passages; weight 400 for body; weight 600 for button labels and strong UI; weight 700 reserved for emphasis. The consistent -0.023em tracking pulls the type into a tight, confident block that contrasts the generous serif spacing. Substitute: Inter, Söhne, or Untitled Sans

### Fragment mono — Tiny all-caps labels in badge and eyebrow contexts — monospace gives a clinical, data-precise feel for markers like 'HSA/FSA Eligible'. Use sparingly; Ftbase caps at 600+ serve most label needs · `--font-fragment-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 11px
- **Line height:** 1.00
- **Letter spacing:** normal
- **Role:** Tiny all-caps labels in badge and eyebrow contexts — monospace gives a clinical, data-precise feel for markers like 'HSA/FSA Eligible'. Use sparingly; Ftbase caps at 600+ serve most label needs

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 12px | 1.4 | -0.28px | `--text-eyebrow` |
| body-sm | 14px | 1.5 | -0.32px | `--text-body-sm` |
| body | 16px | 1.5 | -0.37px | `--text-body` |
| body-lg | 18px | 1.4 | -0.41px | `--text-body-lg` |
| subheading | 20px | 1.3 | -0.46px | `--text-subheading` |
| heading | 34px | 1.15 | — | `--text-heading` |
| heading-lg | 45px | 1.1 | — | `--text-heading-lg` |
| display | 64px | 1 | — | `--text-display` |
| hero | 80px | 0.95 | — | `--text-hero` |
| display-xl | 88px | 0.9 | — | `--text-display-xl` |

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
| 80 | 80px | `--spacing-80` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| tags | 9999px |
| cards | 24px |
| pills | 9999px |
| inputs | 9999px |
| buttons | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.15) 0px 0px 20px 0px` | `--shadow-lg` |
| xl | `rgba(42, 43, 47, 0.1) 12px 32px 80px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main conversion action — 'Start testing', 'Get started'

Filled terracotta (#b05a36) background, white text in Ftbase 600 at 16px, padding 12px 24px, border-radius 40px. No border, no shadow. The pill-rounded shape is a signature — buttons are never rectangular.

### Outlined Secondary Button
**Role:** Supporting action — 'See how it works', 'Learn more'

Transparent background, 1.5px terracotta (#b05a36) border, terracotta text in Ftbase 600 at 16px, padding 12px 24px, border-radius 40px. Sits at the same height as the primary CTA, never subordinate in size.

### Ghost Text Button
**Role:** Nav links, low-priority actions, 'Log in'

No background, no border, Ink (#2a2b2f) text in Ftbase 400-600 at 14-16px, padding 8px 12px. Hover state may add a subtle aged-paper (#f5eee1) background wash.

### Announcement Bar
**Role:** Top-of-page promotional message — 'Use your HSA/FSA funds'

Full-width terracotta (#b05a36) background, white text centered in Ftbase 400 at 14px, padding 8px 16px. Underlined link in white sits inline with the message. Sticky to the top of the viewport.

### Primary Navigation Bar
**Role:** Site-wide navigation

White or parchment (#fef9ef) background, 64-72px tall, logo mark left (terracotta swatch + 'Function' wordmark in Ink), center nav links in Ftbase 400 at 14-16px separated by 24-32px gaps, right side holds Ghost 'Log in' + Primary CTA + search icon + hamburger. Sticky on scroll with a subtle bottom hairline in Warm Taupe (#d1c9bf).

### Numbered Step Card
**Role:** How-it-works feature step ('01', '02', '03')

Aged Paper (#f5eee1) background, 24px border-radius, padding 40px 32px, no border. Step number ('01') in terracotta at 14px Ftbase 600 eyebrow style. Title in Financier Display 34px, descriptive subtext in Ftbase 400 at 16px in Charcoal. May include an inline illustration or micro-UI preview (calendar, chart) in the lower half.

### Doctor Testimonial Card
**Role:** Social proof with credentialed endorsement

Inline horizontal layout on parchment canvas, no card chrome. Circular avatar 48-56px, quote in Financier Display 20-24px italic in Ink, attribution in Ftbase 600 at 14px in Ink, credential line in Ftbase 400 at 14px in Graphite.

### Hero Stat Block
**Role:** Key metric in hero or feature sections — '160+ lab tests', '$1 per day'

Vertical stack: large metric in Financier Display 34-45px in Ink, sub-label in Ftbase 400 at 14px in Graphite below. Separated from adjacent stats by 1px vertical Warm Taupe divider.

### Eyebrow Label
**Role:** Section pre-title — 'HSA/FSA Eligible', 'Step 01'

All caps Ftbase 600 at 12px in Charcoal or terracotta, letter-spacing tight at -0.28px. Sits 8-12px above the section heading.

### Disease Tag
**Role:** Inline condition marker — 'Prostate cancer', 'Anemia'

No background, no border. Text in Ftbase 400 at 14px in Charcoal, separated from siblings by a terracotta bullet '·' with 16px horizontal padding. Wraps in a horizontal flow with 8px row gap.

### Bar Chart Widget
**Role:** Data visualization in feature cards and results previews

Terracotta (#b05a36) bars on parchment background, 1px Warm Taupe axis lines, values labeled in Ftbase 400 at 12px in Graphite. No grid background. Bar corners are square (2px radius) — deliberately not rounded to contrast with the pill-shaped UI.

### Input Field
**Role:** Form input — search, email, date

Parchment background, 1px Ash (#808988) border, 9999px border-radius (fully pill-shaped), padding 12px 20px, Ftbase 400 at 16px in Ink. Focus ring: 0 0 0 3px rgba(176, 90, 54, 0.2). Placeholder in Graphite.

### Search Icon Button
**Role:** Toggle search overlay

40px circular, no background, Ink stroke icon at 20px. Hover: Aged Paper (#f5eee1) background fill. Subtle outer glow shadow when active.

### Calendar Picker Widget
**Role:** Date selection inside step cards

Parchment background with very faint Warm Taupe dividers, day labels (TUE, WED…) in Ftbase 400 at 10-11px in Graphite, day numbers in Ftbase 400 at 14px in Ink. Active day: terracotta text with a subtle terracotta underline. No card chrome — sits flat within the step card.

## Do's and Don'ts

### Do
- Use Financier Display for all editorial headlines, always pairing roman and italic weights within the same line to create the signature typographic rhythm
- Set body and UI text in Ftbase with the global -0.023em tracking, never override it per element
- Default to the cream surface stack (Parchment → Aged Paper → Taupe Outline) for elevation before reaching for shadows
- Apply the 40px border-radius to all buttons and the 24px radius to all cards — rectangular shapes break the system's identity
- Reserve #b05a36 for exactly three uses: primary CTAs, eyebrow labels, and active/selected states — never as body text or large surface fills
- Use the terracotta bullet '·' with 16px horizontal spacing when listing inline items like diseases or categories
- Keep hero photography warm-toned with a dark overlay so headlines in white or parchment remain legible

### Don't
- Never use pure white (#ffffff) as a background — it kills the parchment warmth that defines the brand
- Don't set body text in anything other than Ftbase; the serif is for editorial headlines only
- Don't use small sharp drop shadows; elevation must come from color stepping or the two approved shadow recipes
- Don't apply the terracotta to large background areas, decorative blocks, or text over 24px — it overwhelms when undiluted
- Avoid rectangular buttons or square card corners; the rounded shape family (40px / 24px / 9999px) is non-negotiable
- Don't introduce a second accent color — the system is monochromatic warm with one rust accent, and a second hue breaks the apothecary mood
- Don't use the -0.023em tracking on the serif Financier Display — it belongs only to Ftbase

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#fef9ef` | Page background — warm cream replaces pure white |
| 1 | Aged Paper | `#f5eee1` | Card and panel surfaces — soft step up from canvas |
| 2 | Taupe Outline | `#d1c9bf` | Bordered containers and dividers — never use shadow for primary elevation |
| 3 | Terracotta Seal | `#b05a36` | Active/elevated interactive states and hero overlays |

## Elevation

- **Floating card / modal:** `rgba(42, 43, 47, 0.1) 12px 32px 80px 0px`
- **Subtle UI glow (search, inputs):** `rgba(0, 0, 0, 0.15) 0px 0px 20px 0px`

## Imagery

Photography is warm-toned, cinematic, and human: golden-hour running silhouettes, organic outdoor movement, moody earth-and-sky palettes. Images are full-bleed in the hero with a dark warm overlay (~60% opacity) to keep headline text legible; in lower sections they are contained with 24px radius. Illustrations are minimal — the system favors real photography and small inline UI previews (calendars, bar charts) over decorative illustration. Icons are outlined with a 1.5-2px stroke in Ink or terracotta, never filled, never multicolor. No product screenshots; the 'product' is implied through micro-UI vignettes inside cards.

## Layout

Max-width 1280px centered with 24-40px outer page padding. The hero is full-bleed photography with centered or left-aligned serif headline at 80-88px. Below the hero, sections alternate between Parchment (#fef9ef) and Aged Paper (#f5eee1) in a slow rhythm separated by 64-96px vertical gaps — not a strict checkerboard, but a gentle tonal cadence. Content is typically 3-column card grids for features, centered stacks for testimonials, and inline horizontal flows for disease/category lists. Navigation is a single sticky top bar; no sidebar, no mega-menu. Density is comfortable — cards breathe with 40px internal padding, and whitespace is treated as a design material rather than a gap filler.

## Agent Prompt Guide

## Quick Color Reference
- text: #2a2b2f (Ink)
- background: #fef9ef (Parchment)
- border: #d1c9bf (Warm Taupe)
- accent: #b05a36 (Terracotta Seal)
- card surface: #f5eee1 (Aged Paper)
- primary action: #b05a36 (filled action)

## Example Component Prompts

**1. Hero with editorial headline:** Full-bleed dark warm-toned photo background with 60% dark overlay. Parchment (#fef9ef) eyebrow at 12px Ftbase 600 weight, letter-spacing -0.28px. Headline at 80px Financier Display weight 400, color #fef9ef, with the last word in weight 300 italic. Subtext at 18px Ftbase 300 weight, #fef9ef at 80% opacity. Primary CTA: #b05a36 background, white text at 16px Ftbase 600, padding 12px 24px, 40px radius.

**2. Numbered step card:** Aged Paper (#f5eee1) background, 24px border-radius, 40px padding. Step number '01' in 14px Ftbase 600, color #b05a36. Title in 34px Financier Display weight 400, color #2a2b2f. Body text in 16px Ftbase 400, color #333333, line-height 1.5. Optional inline calendar or chart in the lower half.

**3. Doctor testimonial row:** No card chrome, sits directly on Parchment. Circular avatar 48px. Quote in 20px Financier Display weight 300 italic, color #2a2b2f. Name in 14px Ftbase 600, color #2a2b2f. Credential in 14px Ftbase 400, color #515151. Max-width 720px, left-aligned.

**4. Disease tag list:** Horizontal flow with 16px column gap. Each item: 14px Ftbase 400, color #333333. Separator between items is a terracotta (#b05a36) bullet '·' with 16px space on each side. Wraps to multiple lines with 8px row gap.

*Create a Primary Action Button: #b05a36 background, #fef9ef text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Typographic Rhythm

The single most distinctive move in this system is the roman + italic pairing within Financier Display headlines. 'Testing is easy' uses roman 'Testing is' and italic 'easy' in the same line. '1000s of diseases' is entirely italic. '160+ lab tests chosen by top doctors' pairs roman with italic. This pattern is not decorative — it signals the editorial, almost personal voice of the brand, distinguishing Function from typical health-tech clinical copy. The italic word is always the emotional or surprising word; the roman words set up the structure. Never italicize whole sentences; never italicize UI labels or body text. Italic is reserved for Financier Display at 34px and above.

## Similar Brands

- **Goop** — Same warm cream canvas with a single rust accent and serif editorial headlines — wellness content styled like a premium magazine
- **Athletic Greens / AG1** — Earth-toned brand palette with generous pill-shaped buttons and a premium, slow-paced editorial layout rhythm
- **Whoop** — Health-tech brand that uses warm photography and muted off-white surfaces instead of typical medical white-and-blue
- **Parsley Health** — Direct-to-consumer health platform with a warm neutral palette, pill buttons, and a single botanical accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-terracotta-seal: #b05a36;
  --gradient-terracotta-seal: linear-gradient(116deg, rgb(176, 90, 54), rgb(212, 166, 142));
  --color-parchment: #fef9ef;
  --color-aged-paper: #f5eee1;
  --color-warm-taupe: #d1c9bf;
  --color-ink: #2a2b2f;
  --color-charcoal: #333333;
  --color-graphite: #515151;
  --color-ash: #808988;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-financier-display: 'Financier Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ftbase: 'Ftbase', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fragment-mono: 'Fragment mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: -0.28px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.37px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.41px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.46px;
  --text-heading: 34px;
  --leading-heading: 1.15;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.1;
  --text-display: 64px;
  --leading-display: 1;
  --text-hero: 80px;
  --leading-hero: 0.95;
  --text-display-xl: 88px;
  --leading-display-xl: 0.9;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
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
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-pills: 9999px;
  --radius-inputs: 9999px;
  --radius-buttons: 40px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 0px 20px 0px;
  --shadow-xl: rgba(42, 43, 47, 0.1) 12px 32px 80px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #fef9ef;
  --surface-aged-paper: #f5eee1;
  --surface-taupe-outline: #d1c9bf;
  --surface-terracotta-seal: #b05a36;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-terracotta-seal: #b05a36;
  --color-parchment: #fef9ef;
  --color-aged-paper: #f5eee1;
  --color-warm-taupe: #d1c9bf;
  --color-ink: #2a2b2f;
  --color-charcoal: #333333;
  --color-graphite: #515151;
  --color-ash: #808988;
  --color-pure-black: #000000;

  /* Typography */
  --font-financier-display: 'Financier Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ftbase: 'Ftbase', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fragment-mono: 'Fragment mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: -0.28px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.37px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.41px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.46px;
  --text-heading: 34px;
  --leading-heading: 1.15;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.1;
  --text-display: 64px;
  --leading-display: 1;
  --text-hero: 80px;
  --leading-hero: 0.95;
  --text-display-xl: 88px;
  --leading-display-xl: 0.9;

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
  --spacing-240: 240px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 1440px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 0px 20px 0px;
  --shadow-xl: rgba(42, 43, 47, 0.1) 12px 32px 80px 0px;
}
```
