# Ventriloc — Style Reference
> Editorial data observatory on warm paper — a single orange ember punctuating monochrome precision.

**Theme:** light

Ventriloc speaks in a quiet, editorial voice: warm paper-white canvas, monospaced-precision data cards, and a single orange ember that punctuates the monochrome like a highlighter on a printed report. The system pairs a custom neo-grotesque (PolySans) at weight 400 for headings — unusual restraint that trades authority-through-volume for authority-through-precision — against Inter for body and UI chrome. Surfaces are warm grays and ivory rather than cool tech-blue, cards wear asymmetric corner radii (sharp top-right, soft elsewhere), and interactive elements split into two clear dialects: sharp-cornered text-style buttons and pill-shaped navigation containers. Color is rationed: pages should read 95% achromatic with orange appearing only as functional punctuation for highlights, link underlines, and decorative data accents.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite | `#202020` | `--color-graphite` | Primary text, headings, nav links, icon strokes — the typographic anchor of every surface |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card elevation, icon fills — the brightest surface in the system |
| Ash | `#efefef` | `--color-ash` | Primary card and section background, nav pill container — the dominant warm-gray surface |
| Fog | `#f5f5f5` | `--color-fog` | Subtle background tone for nested surfaces and secondary containers |
| Ivory | `#ebe6dd` | `--color-ivory` | Warm accent background wash for featured blocks — the paper-stock feel |
| Steel | `#4d4d4d` | `--color-steel` | Secondary body text, long-form paragraph copy |
| Slate | `#828282` | `--color-slate` | Muted helper text, tertiary nav items, inactive controls |
| Mist | `#e8e8e8` | `--color-mist` | Hairline dividers, nav background fills |
| Ember Orange | `#ff682c` | `--color-ember-orange` | Orange text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Brass | `#816729` | `--color-brass` | Secondary accent for chart strokes, decorative SVG lines, and tag text — a muted warm counterpoint to Ember |

## Tokens — Typography

### PolySans — Headings and display text — custom neo-grotesque used exclusively at weight 400 with -0.02em tracking creates a whisper-weight editorial authority that no bold headline could replicate · `--font-polysans`
- **Substitute:** Inter Tight or Space Grotesk at weight 400
- **Weights:** 400
- **Sizes:** 12px, 13px, 16px, 32px, 40px, 66px
- **Line height:** 0.91–1.38
- **Letter spacing:** -0.0200em
- **Role:** Headings and display text — custom neo-grotesque used exclusively at weight 400 with -0.02em tracking creates a whisper-weight editorial authority that no bold headline could replicate

### Inter — Body copy, UI labels, button text, captions, metadata — the workhorse sans for everything that isn't a headline · `--font-inter`
- **Substitute:** system-ui or Roboto
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px
- **Line height:** 1.15–1.50
- **Role:** Body copy, UI labels, button text, captions, metadata — the workhorse sans for everything that isn't a headline

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| subheading | 18px | 1.25 | — | `--text-subheading` |
| heading | 32px | 1.19 | -0.64px | `--text-heading` |
| heading-lg | 40px | 1.2 | -0.8px | `--text-heading-lg` |
| display | 66px | 0.91 | -1.32px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 8px |
| buttons | 0px |
| nav-pills | 200px |
| asymmetric-card | 6px 0px 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 20px

## Components

### Primary CTA Button
**Role:** High-emphasis action button used for conversion and contact

Dark filled (Graphite #202020 background, white text), sharp 0px corners, PolySans 16px weight 400, padding 10px 20px, letter-spacing -0.02em. No shadow, no border-radius — the square edge is deliberate contrast to the rounded cards

### Ghost Outlined Button
**Role:** Secondary action with minimal visual weight

Transparent background, 1px Graphite border, Graphite text, 0px radius, padding 10px 20px, PolySans 16px weight 400. Sits beside the primary CTA as a quieter alternative

### Navigation Pill Container
**Role:** Houses dropdown nav items in a floating capsule

Ash (#efefef) background, 200px border-radius (fully pill-shaped), 8px vertical padding, 18px horizontal padding, wraps dropdown-trigger links. PolySans 16px for items inside

### Language Toggle Link
**Role:** Locale switcher in header

Plain text link in Slate (#828282), PolySans 16px, no background or border. Sits inline with nav items

### Asymmetric Radius Card
**Role:** Featured content panel with a distinctive cut corner

Ash (#efefef) background, border-radius 6px 0px 0px (soft top-left, sharp everywhere else), generous internal padding (70px top, 60px left). This asymmetric radius is the signature card shape — no shadow, surface color does the lifting

### Data Dashboard Card
**Role:** Chart widget for analytics visualization

White (#ffffff) surface, 20px border-radius, thin border or no border, contains revenue/profitability charts with Ember Orange and Brass accent strokes. No shadow — floats on the Ash page background

### Hero Headline Block
**Role:** Above-the-fold typographic statement

PolySans 66px weight 400, line-height 0.91, letter-spacing -1.32px, Graphite color. Followed by 18px Inter body text in Steel (#4d4d4d). No background — sits directly on white canvas

### Partner Logo Strip
**Role:** Social proof bar showing client/partner logos

Row of monochrome (Graphite) partner logos on white canvas, separated by generous horizontal spacing (~20px gap), with a "Trusted by 80+ partners" caption in PolySans 13px Brass color above

### Text-Style Nav Link
**Role:** Dropdown trigger in the pill nav container

Graphite (#202020) text, PolySans 16px weight 400, with a small chevron icon. No underline by default, no background — active state may show a subtle color shift

### Link with Orange Underline
**Role:** Inline text link with the accent color

Text in base color with a 1px Ember Orange (#ff682c) underline offset 2-3px below baseline. Used sparingly for the one or two most important links per page

### Section Divider
**Role:** Horizontal break between content sections

No visible line — sections are separated purely by 80px vertical whitespace and alternating surface colors (white → ash → white)

### Cookie Preferences Link
**Role:** Footer utility link

Small text in Slate (#828282), PolySans 13px, no decoration. Bottom-of-page placement

## Do's and Don'ts

### Do
- Use PolySans exclusively at weight 400 for all headings — never bold the display type; the whisper-weight is the signature
- Apply the asymmetric border-radius 6px 0px 0px to featured content cards; reserve 20px radius for data widgets and 0px for buttons
- Keep pages 95% achromatic; let Ember Orange (#ff682c) appear only as link underlines, chart highlights, and small icon accents
- Use 20px for element gaps and 80px between sections — the generous whitespace is what makes the editorial voice work
- Pair Inter for all body and UI text; PolySans for headings, nav items, and button labels only
- Separate sections by alternating white canvas and Ash (#efefef) surface bands rather than dividers or shadows
- Use letter-spacing -0.02em on every PolySans text element — it's baked into the font's identity

### Don't
- Do not bold PolySans headings — weight 400 at large size is the whole point; bolding destroys the editorial restraint
- Do not use Ember Orange as a filled button background — it is an accent for highlights and links, not a CTA fill
- Do not add box-shadows to cards or buttons — depth comes from surface color contrast, not elevation
- Do not use symmetric border-radius on all elements; the asymmetric 6px 0px 0px and the 0px button radius are deliberate contrast
- Do not introduce blue, green, or other chromatic colors — the two-warm-accent system (Ember + Brass) is the limit
- Do not set line-height above 1.25 on display headings; the 0.91 leading on 66px creates the tight, poster-like headline
- Do not crowd the layout — if you need to add decoration, increase whitespace instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background — the brightest base layer |
| 1 | Ash Surface | `#efefef` | Card and section panels — dominant warm-gray surface |
| 2 | Fog Surface | `#f5f5f5` | Nested containers and secondary backgrounds |
| 3 | Ivory Surface | `#ebe6dd` | Warm accent wash for featured or editorial blocks |

## Elevation

- **Data Card (chart widget):** `0px 0px 0px 0px (no shadow — cards float on warm-gray surfaces without elevation)`
- **Nav Pill:** `0px 0px 0px 0px (flat — no shadow)`

## Imagery

Visuals are almost entirely data-driven: chart widgets (line graphs, circular progress indicators, stat cards) rendered in a flat, minimal style with thin strokes in Ember Orange and Brass against white card surfaces. No lifestyle photography, no stock imagery, no hero illustrations. The only photographic content is partner/client logos presented in monochrome Graphite. The visual language is closer to a printed annual report than a typical SaaS site — the charts ARE the imagery. Icons are thin-stroke, monoline, and Graphite-colored, appearing sparingly in nav and card headers.

## Layout

Max-width 1200px centered container with generous 80px section gaps. The hero is a two-column split: left side holds the headline, subtext, and dual-button CTA stack; right side shows a cluster of three overlapping data dashboard cards (finance chart, revenue stat, profitability ring) floating on the white canvas. Below the hero, a full-width partner logo strip on white. Subsequent sections alternate between Ash (#efefef) and white bands. Navigation is a floating pill container centered in the header, with the brand wordmark left-aligned and a dark Contact-us button right-aligned. The overall rhythm is spacious and editorial — wide margins, tall sections, and the data cards as the only visual punctuation beyond typography.

## Agent Prompt Guide

Quick Color Reference:
- text: #202020 (Graphite)
- background: #ffffff (Canvas White)
- surface/card: #efefef (Ash)
- border/divider: #e8e8e8 (Mist)
- accent: #ff682c (Ember Orange)
- secondary text: #4d4d4d (Steel)
- primary action: no distinct CTA color

Example Component Prompts:

1. Hero Section: White canvas background. Headline "Your Headline Here" at 66px PolySans weight 400, #202020, line-height 0.91, letter-spacing -1.32px. Subtext at 18px Inter weight 400, #4d4d4d, line-height 1.25. Two buttons side by side: filled Graphite button "Contact us" (#202020 bg, white text, 0px radius, 10px 20px padding, PolySans 16px) and ghost outlined button "About us" (transparent bg, 1px #202020 border, #202020 text, 0px radius).

2. Asymmetric Card: Ash (#efefef) background, border-radius 6px 0px 0px, padding 70px top and 60px left. Contains an 18px Inter body paragraph in #4d4d4d. No shadow, no border.

3. Data Dashboard Card: White (#ffffff) background, 20px border-radius, 40px padding. Contains a chart with Ember Orange (#ff682c) data line and Brass (#816729) secondary line. Card title in PolySans 18px weight 400, #202020.

4. Navigation Bar: Floating pill container with Ash (#efefef) background and 200px border-radius, wrapping nav items. Items are PolySans 16px weight 400, #202020, separated by 20px gaps. Language toggle "FR" in Slate (#828282) sits to the right.

5. Partner Logo Strip: White background. Caption "Trusted by 80+ partners" in PolySans 13px weight 400, #816729. Row of 7 partner logos in #202020, 20px gap between each, no borders or containers.

## Typography Philosophy

PolySans is the voice; Inter is the grammar. Every heading, nav item, and button label uses PolySans at weight 400 — never 500 or 600. This is counterintuitive (most sites bold their headlines) but it's what makes Ventriloc feel editorial rather than corporate. The tight letter-spacing (-0.02em) compensates for the light weight at display sizes. Inter handles all body copy, captions, and metadata at 500 weight for UI labels and 400 for paragraphs. The 16px PolySans with line-height 1.0 is used for buttons — the tight leading makes labels feel precise and architectural.

## Asymmetric Radius System

The most distinctive structural choice in this system is the asymmetric border-radius 6px 0px 0px on featured cards. This single design decision signals: this is not a standard card grid, this is editorial layout. The soft top-left corner draws the eye downward and rightward, creating visual flow. Pair it with 0px radius on buttons and 200px on nav pills, and you get a three-radius system that creates rhythm: sharp (buttons) → asymmetric (cards) → fully round (navigation). Do not apply symmetric radius to feature cards — the asymmetry is the signature.

## Similar Brands

- **Stripe** — Same editorial restraint with monochrome palette and generous whitespace; both use a single warm accent color for highlights rather than a dominant brand fill
- **Linear** — Shared taste for sharp 0px-radius buttons against soft rounded surfaces, and a near-monochrome interface that lets typography do the heavy lifting
- **Plaid** — Similar data-product aesthetic with dashboard-card imagery and warm-gray surfaces; both treat charts as editorial content rather than decoration
- **Figma Config** — Matching sparse, poster-like typographic headlines at extreme sizes with tight tracking, and a commitment to letting negative space carry the design

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite: #202020;
  --color-canvas-white: #ffffff;
  --color-ash: #efefef;
  --color-fog: #f5f5f5;
  --color-ivory: #ebe6dd;
  --color-steel: #4d4d4d;
  --color-slate: #828282;
  --color-mist: #e8e8e8;
  --color-ember-orange: #ff682c;
  --color-brass: #816729;

  /* Typography — Font Families */
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --text-heading: 32px;
  --leading-heading: 1.19;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.8px;
  --text-display: 66px;
  --leading-display: 0.91;
  --tracking-display: -1.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 200px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 8px;
  --radius-buttons: 0px;
  --radius-nav-pills: 200px;
  --radius-asymmetric-card: 6px 0px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-ash-surface: #efefef;
  --surface-fog-surface: #f5f5f5;
  --surface-ivory-surface: #ebe6dd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite: #202020;
  --color-canvas-white: #ffffff;
  --color-ash: #efefef;
  --color-fog: #f5f5f5;
  --color-ivory: #ebe6dd;
  --color-steel: #4d4d4d;
  --color-slate: #828282;
  --color-mist: #e8e8e8;
  --color-ember-orange: #ff682c;
  --color-brass: #816729;

  /* Typography */
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --text-heading: 32px;
  --leading-heading: 1.19;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.8px;
  --text-display: 66px;
  --leading-display: 0.91;
  --tracking-display: -1.32px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 200px;
}
```
