# Drive Capital — Style Reference
> Retro road-trip poster on warm paper

**Theme:** light

Drive Capital's Summer Drive is an editorial event-poster system built on a warm cream canvas and a single electric blue accent. The type pairing is the soul: a hairline didone serif (Editorial New at weight 100) delivers monumental headlines at 77–120px, while a low-weight grotesk (Founders Grotesk 300/400) handles everything else with quiet confidence. Tracking is uniformly tight at -0.02em, giving even body text a compressed, magazine-grade feel. Surfaces are flat — no shadows, no gradients — with hairline gray (#e2e8f0) dividers doing the structural work. Buttons are 60px-radius pills, always outlined in blue, never filled. The overall rhythm is generous: 144px page margins, 150px section padding, with body copy in a narrow column. The result reads like a printed invite dropped into a browser — warm, confident, and deliberately minimal.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream | `#fff8f1` | `--color-cream` | Page background, card surfaces, button text on filled variants |
| Ash | `#e2e8f0` | `--color-ash` | Hairline dividers, card borders, rule lines, neutral button outlines |
| Ink | `#000000` | `--color-ink` | Body text, fine illustration strokes, icon fills |
| Voltage Blue | `#006eff` | `--color-voltage-blue` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Editorial New — Display headlines only. Weight 100 ultra-hairline at 77–120px for monumental section openers; weight 300 at 62px for secondary display. The extreme thinness against the heavy blue sans creates a chiaroscuro contrast that defines the brand's editorial voice. · `--font-editorial-new`
- **Substitute:** Playfair Display, Cormorant, or DM Serif Display at weight 300
- **Weights:** 100, 300
- **Sizes:** 62px, 77px, 120px
- **Line height:** 0.95, 1.00
- **Letter spacing:** -0.02em
- **OpenType features:** `"clig", "liga"`
- **Role:** Display headlines only. Weight 100 ultra-hairline at 77–120px for monumental section openers; weight 300 at 62px for secondary display. The extreme thinness against the heavy blue sans creates a chiaroscuro contrast that defines the brand's editorial voice.

### Founders Grotesk — All non-display text. Weight 300 for headings up to 38px and nav labels; weight 400 for body and links. The 300-weight headings are an anti-convention choice — most systems use 600–700 here, but this whisper-weight lets the blue color do the shouting. · `--font-founders-grotesk`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk at matching weights
- **Weights:** 300, 400
- **Sizes:** 16px, 18px, 21px, 28px, 38px
- **Line height:** 1.20, 1.25, 1.50
- **Letter spacing:** -0.02em
- **OpenType features:** `"clig", "liga"`
- **Role:** All non-display text. Weight 300 for headings up to 38px and nav labels; weight 400 for body and links. The 300-weight headings are an anti-convention choice — most systems use 600–700 here, but this whisper-weight lets the blue color do the shouting.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.5 | -0.32px | `--text-body-sm` |
| body | 18px | 1.5 | -0.36px | `--text-body` |
| body-lg | 21px | 1.5 | -0.42px | `--text-body-lg` |
| subheading | 28px | 1.2 | -0.56px | `--text-subheading` |
| heading-sm | 38px | 1.2 | -0.76px | `--text-heading-sm` |
| heading | 62px | 1 | -1.24px | `--text-heading` |
| heading-lg | 77px | 0.95 | -1.54px | `--text-heading-lg` |
| display | 120px | 0.95 | -2.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 20 | 20px | `--spacing-20` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 43 | 43px | `--spacing-43` |
| 144 | 144px | `--spacing-144` |
| 150 | 150px | `--spacing-150` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| pills | 60px |
| buttons | 60px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-150px
- **Card padding:** 14px
- **Element gap:** 20-29px

## Components

### Outlined Pill Button
**Role:** Primary action

60px border-radius, 1.5px Voltage Blue border, transparent fill, 14px vertical / 43px horizontal padding. Label in Founders Grotesk weight 300, 16px, Voltage Blue. No fill state — the outline IS the button.

### Nav Rule Bar
**Role:** Section navigation

Full-width row with 144px horizontal page padding. Hairline Ash (#e2e2f0) top border, 1.5px. Labels in Founders Grotesk weight 300, 16px, Voltage Blue, uppercase. Evenly spaced across the row.

### Display Serif Headline
**Role:** Section opener

Editorial New weight 100, 77–120px, line-height 0.95, letter-spacing -0.02em, Voltage Blue. Centered. No supporting subtitle — the headline stands alone with massive vertical breathing room (150px above/below).

### Hero Display Headline
**Role:** Event title

Extremely bold compressed sans, ~120px+, Voltage Blue, tight tracking. Spans full page width with no max-width constraint. Date/time metadata in Founders Grotesk 300, 21px, flanking the title.

### Metadata Label
**Role:** Date/time/category annotations

Uppercase Founders Grotesk weight 300, 14px, Voltage Blue. Paired with a larger value in same font at 21px. The 'label over value' pattern creates editorial caption structure.

### Body Copy Block
**Role:** Long-form text

Founders Grotesk weight 400, 18px, line-height 1.5, #000000. Centered column, max ~600px wide. 29px margin-bottom between paragraphs. No drop caps, no pull quotes — pure flowing text.

### Hero Illustration Block
**Role:** Central visual anchor

Flat vector illustration on cream background. Light blue (#006eff at ~40% opacity) fill for primary form, black for shadows/accents. No gradients, no drop shadows. Centered with flanking text columns.

### Flanking CTA Pair
**Role:** Dual action layout

Two text+button columns left and right of a central illustration. Each column: uppercase label (16px, Founders Grotesk 300, Voltage Blue), display value (28–38px, same font/weight, Voltage Blue), then 60px-pill outlined button. 30–43px horizontal padding within each column.

## Do's and Don'ts

### Do
- Use Voltage Blue (#006eff) for all text, borders, and illustration fills — it is the only chromatic voice
- Set all type with -0.02em letter-spacing and enable "clig", "liga" font features
- Use 60px border-radius for every button, tag, and pill — never mix with 4px or 8px radii
- Reserve Editorial New weight 100 for section openers at 77px or larger; never use it below 62px
- Maintain 144px horizontal page padding for top-level layouts; 30–43px for inner component padding
- Use Founders Grotesk weight 300 for headings and labels — the whisper-weight is the signature, not a fallback
- Keep the cream canvas visible — cards are flat on cream, distinguished only by Ash (#e2e8f0) hairline borders

### Don't
- Don't introduce a second chromatic color — the entire system is monochrome blue on cream
- Don't use filled buttons — actions are always outlined pills with transparent fill
- Don't add drop shadows, gradients, or elevation effects — surfaces are strictly flat
- Don't set body text below 16px or above 21px — the body range is deliberately narrow
- Don't use Editorial New for body copy or UI labels — it is display-only
- Don't use weight 600+ for any text — the system's authority comes from restraint at 300
- Don't center body paragraphs beyond 600px wide — narrow columns preserve the editorial reading rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#fff8f1` | Warm off-white base for all content |
| 2 | Card Surface | `#fff8f1` | Inset panels — same cream, distinguished only by hairline border |

## Elevation

The system is strictly shadowless. All visual separation comes from Ash (#e2e8f0) hairline borders and generous whitespace. Elevation is achieved through typographic scale and spacing, not z-depth.

## Imagery

Illustrations are flat vector graphics with a two-color treatment: Voltage Blue (#006eff) at reduced opacity for primary forms, true black for shadows, wheels, and accent details. No gradients, no textures, no photographic content. Icons are absent — the car illustration and type are the only graphics. The illustration style is mid-century editorial: simplified automotive silhouette with hard-edged shadow shapes.

## Layout

Full-width sections with 144px horizontal page padding. The page is a vertical stack of full-bleed bands, each centered. The hero is a single monumental display headline with flanking metadata; the second section is a centered serif headline with a narrow body column below. Navigation sits as a top rule bar spanning full width. No sidebar, no multi-column grids — everything is a single centered column. Vertical rhythm uses 150px section padding for major breaks and 29px for paragraph gaps within text blocks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #fff8f1
- border: #e2e8f0
- accent: #006eff
- primary action: #006eff (outlined action border)

**Example Component Prompts**

1. Create a hero section: cream (#fff8f1) background. Massive display headline in a bold compressed sans, ~120px, #006eff, letter-spacing -0.02em. Flanking date/time labels in Founders Grotesk weight 300, 21px, #006eff. 150px vertical padding.

2. Create a section opener: cream background. Headline in Editorial New weight 100, 77px, line-height 0.95, #006eff, centered. 150px padding above and below. No subtitle.

3. Create a body text block: cream background. Centered column, max 600px wide. Text in Founders Grotesk weight 400, 18px, line-height 1.5, #000000. 29px margin between paragraphs.

4. Create an outlined pill button: 60px border-radius, 1.5px #006eff border, transparent fill, 14px/43px padding. Label in Founders Grotesk weight 300, 16px, #006eff, uppercase.

5. Create a top navigation bar: full-width with 144px horizontal padding. 1.5px #e2e8f0 top border. Labels in Founders Grotesk weight 300, 16px, #006eff, uppercase, evenly spaced.

## Similar Brands

- **Knotel** — Same cream-on-blue editorial palette with generous whitespace and hairline dividers
- **Carta** — Similar pill-shaped outlined buttons and flat cream surfaces with single accent color
- **Notion Events** — Same event-poster aesthetic with monumental display type and minimal UI chrome
- **Lenny's Newsletter** — Editorial magazine layout with serif/grotesk type pairing and warm off-white background

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream: #fff8f1;
  --color-ash: #e2e8f0;
  --color-ink: #000000;
  --color-voltage-blue: #006eff;

  /* Typography — Font Families */
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-body-lg: 21px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.42px;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.56px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.76px;
  --text-heading: 62px;
  --leading-heading: 1;
  --tracking-heading: -1.24px;
  --text-heading-lg: 77px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -1.54px;
  --text-display: 120px;
  --leading-display: 0.95;
  --tracking-display: -2.4px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-7: 7px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-43: 43px;
  --spacing-144: 144px;
  --spacing-150: 150px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-150px;
  --card-padding: 14px;
  --element-gap: 20-29px;

  /* Border Radius */
  --radius-full: 60.0048px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-pills: 60px;
  --radius-buttons: 60px;

  /* Surfaces */
  --surface-page-canvas: #fff8f1;
  --surface-card-surface: #fff8f1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream: #fff8f1;
  --color-ash: #e2e8f0;
  --color-ink: #000000;
  --color-voltage-blue: #006eff;

  /* Typography */
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-body-lg: 21px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.42px;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.56px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.76px;
  --text-heading: 62px;
  --leading-heading: 1;
  --tracking-heading: -1.24px;
  --text-heading-lg: 77px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -1.54px;
  --text-display: 120px;
  --leading-display: 0.95;
  --tracking-display: -2.4px;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-43: 43px;
  --spacing-144: 144px;
  --spacing-150: 150px;

  /* Border Radius */
  --radius-full: 60.0048px;
}
```
