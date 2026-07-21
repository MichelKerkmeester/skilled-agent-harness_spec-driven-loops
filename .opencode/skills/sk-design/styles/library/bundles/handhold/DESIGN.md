# Handhold — Style Reference
> warm parchment under whispered serifs — a hand-set editorial spread with zero chromatic noise, where a hairline serif at weight 200 carries all the voice.

**Theme:** light

Handhold operates in an almost purely editorial register: a warm cream canvas (#f2f1ed) replaces the SaaS-standard pure white, and a custom serif at weight 200 does all the headline work while Inter at a single weight (400) handles everything else. The palette is strictly monochrome — 0% colorfulness detected — so hierarchy is built entirely through scale, tracking, and the serif/sans contrast rather than color. Surfaces are flat with no shadows; structure comes from generous border-radius (24-32px on cards, fully pill-shaped buttons) and tight tracking on the serif. The result reads like a design studio monograph or a luxury print catalog, not a typical B2B SaaS landing page. Density stays comfortable — 4px base, 48px section gaps, 28-32px card padding — with one centered column hero that breathes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, heading strokes, card borders, filled CTA backgrounds — the sole carrier of visual weight in an otherwise empty palette |
| Paper Cream | `#f2f1ed` | `--color-paper-cream` | Page canvas, card surfaces, and the default background — warm off-white that distinguishes the brand from clinical SaaS whites |
| Warm Border | `#dbd7cd` | `--color-warm-border` | Elevated surface, hairline dividers, and card-on-card separation — one shade deeper than the canvas to create structure without contrast |
| Stone Gray | `#737373` | `--color-stone-gray` | Secondary body text, muted labels, subtle borders — never used for primary copy |
| Ash Gray | `#999999` | `--color-ash-gray` | Tertiary text, helper copy, disabled states — the quietest voice in the type stack |
| Pure White | `#ffffff` | `--color-pure-white` | Text on dark filled CTAs, occasional card surface where higher contrast is needed against the cream canvas |

## Tokens — Typography

### bureauSerif — All headlines and display text. Weight 200 is anti-convention — most editorial sites use 300-400 for serif headlines; the extra-light whisper forces the serif to feel like quiet authority rather than declaration. Line-height pinned to 1.0 creates tight, overlapping baselines that read as deliberately set rather than browser-default. Tracking locked at -0.03em across every size, tightening the letterforms into a cohesive display voice. · `--font-bureauserif`
- **Substitute:** Cormorant Garamond (weight 300) or EB Garamond (weight 400) — no Google Font matches weight 200 exactly; Cormorant at 300 is the closest whisper-weight serif
- **Weights:** 200
- **Sizes:** 20px, 28px, 40px, 72px
- **Line height:** 1.00
- **Letter spacing:** -0.03em uniformly across all sizes
- **OpenType features:** `"liga" on, "kern" on`
- **Role:** All headlines and display text. Weight 200 is anti-convention — most editorial sites use 300-400 for serif headlines; the extra-light whisper forces the serif to feel like quiet authority rather than declaration. Line-height pinned to 1.0 creates tight, overlapping baselines that read as deliberately set rather than browser-default. Tracking locked at -0.03em across every size, tightening the letterforms into a cohesive display voice.

### Inter — Body text, nav items, buttons, labels, metadata — the entire non-display UI. A single weight (400) with no bold variant keeps the sans side neutral so the serif can dominate. Tracking is slightly negative on body (-0.011em at 16px) and near-zero on small text, giving Inter a set, editorial feel rather than a default web feel. · `--font-inter`
- **Substitute:** Inter (Google Font exact match)
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.33, 1.43, 1.50
- **Letter spacing:** -0.013em at 12px, -0.011em at 14px, -0.009em at 16px, 0em at 16px+
- **Role:** Body text, nav items, buttons, labels, metadata — the entire non-display UI. A single weight (400) with no bold variant keeps the sans side neutral so the serif can dominate. Tracking is slightly negative on body (-0.011em at 16px) and near-zero on small text, giving Inter a set, editorial feel rather than a default web feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 16 | -0.01px | `--text-caption` |
| body-sm | 14px | 20 | -0.11px | `--text-body-sm` |
| body | 16px | 24 | -0.18px | `--text-body` |
| subheading | 20px | 20 | -0.6px | `--text-subheading` |
| heading-sm | 28px | 28 | -0.84px | `--text-heading-sm` |
| heading | 40px | 40 | -1.2px | `--text-heading` |
| display | 72px | 72 | -2.16px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24-32px |
| inputs | 8px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 28-32px
- **Element gap:** 16px

## Components

### Primary Filled CTA Button
**Role:** The only high-contrast action element in the system

Black (#000000) background, white (#ffffff) text in Inter 14px weight 400, fully pill-shaped radius (9999px), padding 10px 18px. No border, no shadow. The rounded-pill geometry on a monochrome button is the signature action style — it feels like a physical stamp pressed onto the cream page.

### Ghost Navigation Link
**Role:** Top-level nav items and inline links

Inter 14px weight 400, text color #000000, no underline by default. The 8px radius from the border-radius data applies to any underline or indicator treatment. Sits directly on the cream canvas with no background.

### Top Announcement Bar
**Role:** Slim system message across the page top

Full-width strip, Inter 12-14px weight 400, #000000 text, no background fill (transparent over canvas). Tight vertical padding (~8px). The bar is flush with the page edges — no inset, no separation from the cream canvas.

### Editorial Display Headline
**Role:** Hero and section titles

bureauSerif weight 200, sizes 40-72px, line-height 1.0, letter-spacing -0.03em. Centered alignment. The extra-light weight at large sizes with tight tracking creates a whisper-quiet, hand-set feel that is the system's defining visual choice.

### Body Subtitle
**Role:** Supporting copy under headlines

Inter 16px weight 400, color #000000, line-height 1.5, letter-spacing -0.009em. Centered beneath display headlines. No muted color — even subtitle copy stays full black, letting the serif/sans contrast and size do the hierarchy work.

### Partner Logo Strip
**Role:** Social proof row beneath hero

Horizontal row of monochrome brand logos (aikido, Parim, LIVEFORCE, finbite, ParcelTracker), Inter 16px wordmarks or grayscale SVG marks. Even spacing (~32-40px column gap), centered on the cream canvas. Logos are rendered in #000000 — no color treatment.

### Card Surface
**Role:** Content cards and feature blocks

Background #ffffff (one step up from the cream canvas), border-radius 24-32px, padding 28-32px. No shadow, no border. The large radius is a signature choice — cards read as soft, rounded slabs rather than sharp panels.

### Navigation Bar
**Role:** Persistent top navigation

Transparent background over the cream canvas. Logo left, nav links and sign-in right. Inter 14px weight 400, #000000. Minimal height (~56-64px), no bottom border, no background fill — it floats on the canvas.

### Sign In Link
**Role:** Secondary nav action

Inter 14px weight 400, #000000 text, no background, no border. Positioned right-aligned in the nav bar. Visual weight equal to a nav link — there is no separate 'button' treatment for sign-in.

## Do's and Don'ts

### Do
- Use bureauSerif weight 200 for all headlines — never substitute a heavier serif weight; the whisper is the identity
- Use Inter weight 400 exclusively for all non-display text — do not introduce bold, medium, or semibold variants
- Set serif headline line-height to exactly 1.0 — this creates the tight, overlapping editorial baseline that defines the display voice
- Apply -0.03em letter-spacing to all serif text regardless of size — the uniform tracking is what makes the serif feel cohesive across the scale
- Use #f2f1ed as the page canvas — never pure white #ffffff for page backgrounds; the warm cream is the brand's foundation
- Build component separation through radius (24-32px) and whitespace, not shadows or borders — the system is deliberately shadow-free
- Use pill-shaped (9999px radius) buttons for all actions — no sharp or subtly-rounded buttons exist in this system

### Don't
- Do not introduce any chromatic color — the palette is 0% colorful by design; adding blue, red, or green breaks the editorial register
- Do not use bold or semibold weights in either font family — the system speaks at exactly one weight per family
- Do not set serif line-height above 1.0 — relaxed leading destroys the tight editorial feel
- Do not use #ffffff as a page or section background — the warm cream is non-negotiable; white is reserved for card surfaces and button text
- Do not add drop shadows, glows, or any elevation effects — the flat surface treatment is a core principle
- Do not use borders thinner than 1px or lighter than #dbd7cd for structural separation — rely on radius and whitespace instead
- Do not mix serif and sans within a single text block — headings are serif, body is sans, and the boundary between them should be absolute

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f2f1ed` | Full page background — warm cream base |
| 1 | Card | `#ffffff` | Cards and elevated panels that need a clean white against the cream |
| 2 | Ink Surface | `#000000` | Filled CTA buttons and dark UI blocks |

## Elevation

No shadows anywhere. Structure is built entirely through color contrast between the cream canvas, white card surfaces, and black ink. Borders are used sparingly — the design relies on generous radius (24-32px) and whitespace to define component boundaries rather than elevation or drop shadows.

## Imagery

Visuals are minimal and decorative rather than informational. The hero is anchored by a flowing blue-and-gold ribbon/wave illustration that spans the full width — it is the only chromatic element on the page and reads as a brand signature rather than a product screenshot. Below the hero, a single row of monochrome partner logos provides social proof. There is no product photography, no UI screenshots, and no lifestyle imagery on the visible page. The system defaults to pure typography on a cream canvas, with the wave illustration serving as the single expressive accent.

## Layout

Centered single-column hero with a serif display headline, Inter subtitle, and a single filled CTA button — all stacked and center-aligned with generous vertical breathing room. The hero sits on a full-width cream canvas with no visual frame. Below, a decorative blue/gold wave illustration spans edge-to-edge as a section divider. Content then flows in alternating centered bands: a partner logo strip, likely followed by feature sections in stacked or two-column layouts. The overall rhythm is spacious and editorial — wide section gaps (48px+), no sidebars, no multi-column grids in the visible region. Navigation is a minimal top bar with logo left, links right, transparent over the cream canvas.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000
- Background: #f2f1ed
- Card surface: #ffffff
- Border: #dbd7cd
- Muted text: #737373
- primary action: #000000 (filled action)

**3 Example Component Prompts**

1. Create a hero section: #f2f1ed canvas, centered layout. Display headline at 72px bureauSerif weight 200, #000000, line-height 1.0, letter-spacing -2.16px. Subtitle at 16px Inter weight 400, #000000, centered. Primary CTA button: #000000 background, #ffffff text at 14px Inter weight 400, 9999px radius, 10px 18px padding, no shadow.

2. Create a feature card: #ffffff background, 32px border-radius, 32px padding. No shadow, no border. Headline at 28px bureauSerif weight 200, #000000, line-height 1.0, letter-spacing -0.84px. Body text at 16px Inter weight 400, #000000, line-height 1.5. A 24px gap between the headline and body.

3. Create a partner logo strip: full-width row on #f2f1ed canvas, 5 monochrome #000000 logos, centered with 40px gap between each, no labels, 48px vertical padding above and below.

## Typographic Philosophy

The system enforces a strict two-font, two-weight contract: bureauSerif at 200 for display, Inter at 400 for everything else. This is not a limitation — it is a design statement. By refusing to add weight variants, the serif's whisper-weight becomes the loudest thing on the page, and the sans's neutrality becomes invisible. An AI agent building new pages must not introduce 500/600/700 weights to create emphasis — emphasis comes from font family switching, size stepping, and tracking adjustment only.

## Similar Brands

- **Linear** — Same monochrome restraint with a single warm-tinted surface and serif/sans typographic contrast — though Linear leans darker
- **Pitch** — Editorial typography with custom serif headlines over a neutral canvas, comfortable density, and rounded card geometry
- **Vercel** — Extreme minimalism with near-zero color palette, generous whitespace, and large display typography as the primary visual element
- **Stripe** — Comfortable spacing rhythm, centered hero patterns, and the use of subtle warm neutrals instead of pure black/white

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-cream: #f2f1ed;
  --color-warm-border: #dbd7cd;
  --color-stone-gray: #737373;
  --color-ash-gray: #999999;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-bureauserif: 'bureauSerif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 16;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.11px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 20;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 28;
  --tracking-heading-sm: -0.84px;
  --text-heading: 40px;
  --leading-heading: 40;
  --tracking-heading: -1.2px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: -2.16px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;

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
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 28-32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24-32px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #f2f1ed;
  --surface-card: #ffffff;
  --surface-ink-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-cream: #f2f1ed;
  --color-warm-border: #dbd7cd;
  --color-stone-gray: #737373;
  --color-ash-gray: #999999;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-bureauserif: 'bureauSerif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 16;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.11px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 20;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 28;
  --tracking-heading-sm: -0.84px;
  --text-heading: 40px;
  --leading-heading: 40;
  --tracking-heading: -1.2px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: -2.16px;

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
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
}
```
