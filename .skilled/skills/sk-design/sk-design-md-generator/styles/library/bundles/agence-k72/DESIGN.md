# Agence K72 — Style Reference
> theater marquee at midnight — a single electric spark cutting through cinematic black

**Theme:** dark

Agence K72 runs on radical binary minimalism: a near-black photographic void overlaid with white display type, and exactly one chartreuse spark used as precision mark — never decoration. The system is essentially a two-color engine (white-on-black, black-on-white) with #d3fd50 appearing only as stroke or ring, turning that single hue into a loaded gesture. Typography carries the entire identity: a single custom sans-serif stretched to 137px headlines with line-heights compressed to 0.70, making letterforms behave like architecture rather than reading material. Every interactive surface is a fully pill-shaped stadium form, and the French-first voice signals a confident creative agency that treats restraint as posture.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Black | `#000000` | `--color-pure-black` | Page canvas, full-bleed photography backgrounds, nav bar surface |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text, navigation borders, pill button borders and labels, icon strokes |
| Iron Gray | `#4d4d4d` | `--color-iron-gray` | Muted secondary text and low-emphasis nav borders — the only intermediate neutral permitted in the scale |
| Spark Lime | `#d3fd50` | `--color-spark-lime` | Sole accent — appears exclusively as a hand-drawn stroke or ring marking a single word in a headline; never as fill, never as background |

## Tokens — Typography

### Lausanne — Exclusive typeface for all UI. Weight 300 for display and large headings to create a whisper-light monumental effect against dark photography; weight 400 for body, buttons, and small UI. The dramatic size range (11px meta text up to 137px display) with matching line-height compression (0.70 at 137px) turns the single family into both signage and paragraph text. Substitute: Inter or Neue Haas Grotesk for closest geometric neutrality. · `--font-lausanne`
- **Substitute:** Inter, Neue Haas Grotesk, or Suisse Int'l
- **Weights:** 300, 400
- **Sizes:** 11, 14, 16, 20, 35, 94, 115, 137
- **Line height:** 0.70, 0.75, 0.87, 1.20, 1.30, 1.50
- **Letter spacing:** normal at all sizes — the tight tracking is achieved through compressed line-height, not letter-spacing
- **OpenType features:** `Disabled — no ligatures or tabular numerals in evidence; the type speaks through weight contrast and size jumps alone`
- **Role:** Exclusive typeface for all UI. Weight 300 for display and large headings to create a whisper-light monumental effect against dark photography; weight 400 for body, buttons, and small UI. The dramatic size range (11px meta text up to 137px display) with matching line-height compression (0.70 at 137px) turns the single family into both signage and paragraph text. Substitute: Inter or Neue Haas Grotesk for closest geometric neutrality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.3 | — | `--text-caption` |
| body-sm | 14px | 1.3 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading | 35px | 1.2 | — | `--text-heading` |
| heading-lg | 94px | 0.87 | — | `--text-heading-lg` |
| display | 137px | 0.7 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 23 | 23px | `--spacing-23` |
| 27 | 27px | `--spacing-27` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px (no cards in this system — surfaces are full-bleed) |
| buttons | 9999px (fully pill-shaped stadium) |
| nav-items | 9999px (fully pill-shaped stadium) |

### Layout

- **Section gap:** 40px
- **Card padding:** 28px
- **Element gap:** 10px

## Components

### Pill Navigation Button
**Role:** Primary navigation link for section entry (e.g. PROJETS, AGENCE)

Fully pill-shaped stadium form with 9999px border-radius, transparent fill, 1px Paper White border, white text in Lausanne 400 at ~20px, ~10px vertical padding and ~28px horizontal padding. Sits in a row at the page bottom with ~3px gap between pills.

### Stadium Hamburger Trigger
**Role:** Menu toggle in the top-right corner

Two short horizontal white lines forming a hamburger glyph, enclosed in the same fully pill-shaped stadium form as nav buttons but smaller, ~20px tall. Paper White stroke on transparent fill.

### Wordmark Logo Lockup
**Role:** Brand identifier in the top-left nav position

"K72" set in Lausanne 400 at ~20px in Paper White. No container, no border — sits flush left with 3px left padding. Minimal, almost vestigial.

### Display Headline Block
**Role:** Hero text dominating the first viewport

Lausanne 300 at 94-137px, Paper White, line-height 0.70-0.87, all caps, no letter-spacing adjustment. The text bleeds across nearly the full viewport width. One word in the block is encircled by a hand-drawn Spark Lime (#d3fd50) stroke ring — this ring is the only accent moment in the entire system.

### Spark Lime Accent Ring
**Role:** Precision mark highlighting a single word within a display headline

An imperfect oval or ring shape drawn in Spark Lime (#d3fd50) at ~2-3px stroke weight, encircling one word. Functions as a visual lasso — it says 'this word is the point' without any other annotation. Never appears as a fill, never on a background, never on body text.

### Body Description Block
**Role:** Small contextual paragraph on the hero and section openers

Right-aligned or bottom-right placement, Lausanne 300-400 at 14-16px, Paper White, line-height 1.30-1.50. The text is unadorned — no background, no border. It floats over the dark photographic canvas. Functions as a quiet counterweight to the massive display headline.

### Location Time Stamp
**Role:** Persistent meta-information showing the agency's local time and city

Bottom-left of the viewport. A small globe icon (Paper White stroke) followed by "MONTREAL_" and a live-updating time in Lausanne 300 at ~11px, Paper White. This component signals 'we are a real studio, right now, in this city' — a humanizing live-data detail.

### Full-Bleed Hero Surface
**Role:** The first viewport and section backgrounds

Edge-to-edge dark photography or video at full viewport size, Pure Black (#000000) as fallback. No overlay, no gradient — the photography carries its own light and the white type sits directly on it.

### Thin Nav Hairline
**Role:** Border separating the nav strip from the content below

1px Paper White (#ffffff) bottom border on the nav element. Not a shadow, not a fill — a single hairline that defines the nav's lower edge against the photographic void below.

## Do's and Don'ts

### Do
- Use #d3fd50 exclusively as a hand-drawn stroke or ring encircling exactly one word in a display headline — never as a fill, background, or border on any element
- Set display headlines in Lausanne 300 at 94-137px with line-height compressed to 0.70-0.87 so letterforms stack and nearly touch across lines
- Render every interactive element (nav links, buttons, menu triggers) as a fully pill-shaped stadium form using 9999px border-radius with a 1px Paper White border and transparent fill
- Let the page background be Pure Black or full-bleed dark photography — never use a card, panel, or elevated surface to group content
- Maintain a binary palette: Paper White text on Pure Black, or Pure Black text on Paper White — #4d4d4d is the only permitted intermediate neutral, used sparingly for muted meta
- Use the single Lausanne family across all sizes from 11px to 137px; let the weight jump (300 vs 400) and the size jump carry all hierarchy
- Place small body copy (14-16px) as a quiet counterweight in the lower-right of a viewport dominated by massive type — the asymmetry is the composition

### Don't
- Do not introduce a second accent color, a gradient, or any chromatic fill — the system is binary plus one spark
- Do not use shadows, glows, blurs, or any multi-layer box-shadow stacks — depth is typographic, not spatial
- Do not use rounded but non-pill radii (8px, 12px, 16px) on any element — either fully pill (9999px) or sharp (0px), nothing between
- Do not set body or button text at 400 weight where a 300 option would be legible — the whisper-light weight at small sizes is the signature
- Do not place display type over a light background — all monumental type lives on Pure Black or dark photography
- Do not add letter-spacing, text-transform justification, or font-feature-settings — the type is raw, all caps where used, tracked normally
- Do not create contained cards, panels, or boxed content groups — content either spans the full viewport or floats freely on the dark surface

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Full-bleed canvas — either solid black or dark photographic imagery covering the entire viewport |
| 2 | Nav Bar | `#000000` | Transparent-to-black nav strip at the top of the page, sitting over photography with thin white hairline border |

## Elevation

Elevation is rejected. The system has no shadows, no glows, no blur stacks. Depth is created exclusively through the contrast between full-bleed dark photography and flat white type, and through the weight contrast of type at different sizes. Elements sit on the same Z-plane — differentiation is typographic and chromatic, not spatial.

## Imagery

Full-bleed cinematic photography, typically dark and moody, covering the entire viewport as the background for type. Imagery is not illustrated — it is photographed, often showing hands at work, studio environments, or close-cropped production moments. No icons beyond minimal white-stroke glyphs (globe, hamburger lines). No product screenshots, no 3D renders, no abstract graphics. The photography carries its own lighting and the white type sits directly on it without overlays or scrims.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (Paper White)
- background: #000000 (Pure Black)
- border: #ffffff (Paper White, 1px hairlines and pill outlines)
- muted: #4d4d4d (Iron Gray — secondary text and low-emphasis borders only)
- accent: #d3fd50 (Spark Lime — stroke/ring only, never fill)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Display Headline with Spark Ring*: Create a hero headline in Lausanne 300 at 115px, Paper White (#ffffff), line-height 0.75, all caps, spanning nearly the full viewport width on a Pure Black (#000000) background. Draw an imperfect oval ring in Spark Lime (#d3fd50) at 3px stroke, encircling exactly one word in the headline. No other accent elements.

2. *Pill Navigation Row*: Create a horizontal row of two pill-shaped navigation buttons at the bottom of the viewport. Each button: 9999px border-radius, 1px Paper White (#ffffff) border, transparent fill, Lausanne 400 at 20px Paper White text, 10px vertical padding, 28px horizontal padding. 3px gap between pills.

3. *Location Time Stamp*: Bottom-left of the viewport. A small Paper White (#ffffff) globe icon (simple line drawing), followed by "MONTREAL_" and a time string, all in Lausanne 300 at 11px Paper White, separated by underscores. No background, no border.

4. *Body Description Block*: A 4-line paragraph in Lausanne 300 at 14px Paper White, line-height 1.30, right-aligned, floating in the lower-right quadrant of the viewport over full-bleed dark photography. No background, no card, no border.

5. *Top Nav Strip*: Full-width bar at top, Pure Black (#000000) or transparent over photography, with a 1px Paper White (#ffffff) bottom border. Left: "K72" wordmark in Lausanne 400 at 20px Paper White. Right: a pill-shaped hamburger trigger, 9999px radius, 1px Paper White border, two short white horizontal lines inside.

## The One Accent Rule

The Spark Lime (#d3fd50) is the most loaded pixel in the system. It appears at most once per viewport, always as a stroke or ring, always circling a single word. This restraint is what gives the accent its power — it is a visual lasso, not a brand color. If you use it as a fill, a background, a button color, or on more than one element per screen, you break the system. The lime exists to say: 'this word, right here, is the point.' Everything else stays in the black-and-white binary.

## Similar Brands

- **Locomotive Mtl** — Montreal creative agency with full-bleed dark photography, massive type, and pill-shaped navigation — shares the cinematic-black-canvas + bold-display-type approach
- **Ueno** — Agency site using full-bleed dark imagery with oversized type and minimal color palette — same commitment to one font family stretched across extreme sizes
- **Bureau Cool** — Design studio with near-monochrome palette, single accent mark, and pill-shaped interactive elements on dark photographic backgrounds
- **Pentagram** — Agency portfolio using massive display type on dark imagery with near-zero chromatic palette and precision accent marks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-iron-gray: #4d4d4d;
  --color-spark-lime: #d3fd50;

  /* Typography — Font Families */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --text-heading-lg: 94px;
  --leading-heading-lg: 0.87;
  --text-display: 137px;
  --leading-display: 0.7;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-23: 23px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-144: 144px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 28px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-full: 34965px;
  --radius-full-2: 93506.4px;

  /* Named Radii */
  --radius-cards: 0px (no cards in this system — surfaces are full-bleed);
  --radius-buttons: 9999px (fully pill-shaped stadium);
  --radius-nav-items: 9999px (fully pill-shaped stadium);

  /* Surfaces */
  --surface-void: #000000;
  --surface-nav-bar: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-iron-gray: #4d4d4d;
  --color-spark-lime: #d3fd50;

  /* Typography */
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --text-heading-lg: 94px;
  --leading-heading-lg: 0.87;
  --text-display: 137px;
  --leading-display: 0.7;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-23: 23px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-full: 34965px;
  --radius-full-2: 93506.4px;
}
```
