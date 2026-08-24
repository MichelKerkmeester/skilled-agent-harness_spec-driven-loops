# Aaru — Style Reference
> Particle-field observatory at midnight

**Theme:** dark

Aaru operates as a dark-mode scientific observatory: pure black canvas interrupted by one vivid electric-blue section and a single acid-yellow-green accent that reads like an instrument-panel indicator light. Typography is deliberately inverted from convention — weight 330 ultra-light runs through every role, body text carries positive letter-spacing (0.025–0.080em) for a data-label cadence, and only display headings tighten to negative tracking. Surfaces are flat and shadowless; hierarchy is built through thin 1px borders, generous whitespace, and numbered annotations rather than elevation. The visual language is terminal, measured, and anti-decorative — every element earns its place like a readout on a control panel.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, primary background — the dominant surface across all dark sections |
| Carbon | `#0a0a0a` | `--color-carbon` | Elevated surface for nav borders, button outlines, and secondary structural elements against the black canvas |
| Graphite | `#18181b` | `--color-graphite` | Subtle raised surface for cards or containers sitting on the black canvas — the lightest neutral step before chromatic sections |
| Frost | `#ffffff` | `--color-frost` | Primary text, hairline borders on dark sections, and inverted backgrounds — the most-used color after black |
| Ash | `#bababa` | `--color-ash` | Muted helper text, icon strokes, and secondary surface fills |
| Smoke | `#9d9d9d` | `--color-smoke` | Medium-contrast borders, control outlines, and structural separators. Do not promote it to the primary CTA color |
| Slate | `#858484` | `--color-slate` | Body text borders and the quietest readable gray — used where content recedes into the background |
| Reactor Lime | `#ebfb10` | `--color-reactor-lime` | Primary action fill (CTA buttons), announcement bar background, and the sole warm accent — acid yellow-green against black creates instant focal hierarchy |
| Plasma Blue | `#1019ec` | `--color-plasma-blue` | Section background and chromatic border accent — vivid electric violet-blue that shifts the entire page into instrument-mode for feature blocks |

## Tokens — Typography

### abcOracle — Primary UI and body typeface — used for navigation, body copy, labels, buttons, and medium-scale headings. Weight 330 ultra-light is the default; 400 is reserved for body paragraphs and readable text blocks. Positive letter-spacing on sizes ≤16px creates a data-label cadence. · `--font-abcoracle`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 330, 400
- **Sizes:** 12, 13, 14, 15, 16, 34, 50
- **Line height:** 1.25–1.50
- **Letter spacing:** -0.025em at 50px and 34px, 0.025–0.040em at 12–16px
- **OpenType features:** `"ss01" on, "tnum" on, "ss02" on`
- **Role:** Primary UI and body typeface — used for navigation, body copy, labels, buttons, and medium-scale headings. Weight 330 ultra-light is the default; 400 is reserved for body paragraphs and readable text blocks. Positive letter-spacing on sizes ≤16px creates a data-label cadence.

### gtPantheon — Display and subheading typeface — weight 330 only, paired with tight negative tracking. Used for section openers and mid-scale titles. The contrast between its lighter cut and abcOracle's 330 creates two distinct text registers without using bold. · `--font-gtpantheon`
- **Substitute:** GT Pantheon (closest free alternative: Söhne Schmal, or Suisse Int'l Light)
- **Weights:** 330
- **Sizes:** 20, 30, 40
- **Line height:** 1.20–1.25
- **Letter spacing:** -0.050em at 40px, -0.025em at 20–30px
- **Role:** Display and subheading typeface — weight 330 only, paired with tight negative tracking. Used for section openers and mid-scale titles. The contrast between its lighter cut and abcOracle's 330 creates two distinct text registers without using bold.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.96px | `--text-caption` |
| body | 15px | 1.5 | 0.6px | `--text-body` |
| subheading | 20px | 1.25 | -0.5px | `--text-subheading` |
| heading-sm | 30px | 1.25 | -0.75px | `--text-heading-sm` |
| heading | 34px | 1.25 | -0.85px | `--text-heading` |
| heading-lg | 40px | 1.2 | -2px | `--text-heading-lg` |
| display | 50px | 1.2 | -1.25px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 6px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 30px
- **Element gap:** 8px

## Components

### Announcement Bar
**Role:** Top-of-page alert bar

Full-bleed #ebfb10 background, 12–14px abcOracle weight 330, uppercase, letter-spacing 0.040–0.080em, color #000000. Height ~40px. Contains a short label and a 'READ MORE →' link. Padding 10px top/bottom.

### Ghost Navigation Button
**Role:** Secondary nav action (LOG IN)

Transparent background, 1px white border, white text, abcOracle 330 at 12–14px, uppercase, letter-spacing 0.040em. Padding 12px 32px. No radius.

### Filled Navigation Button
**Role:** Primary nav action (CONTACT)

White background (#ffffff), black text, abcOracle 330 at 12–14px, uppercase, letter-spacing 0.040em. Padding 12px 32px. No radius. Inverted from the ghost variant to create a clear two-step nav hierarchy.

### Hero Headline
**Role:** Primary page headline

abcOracle weight 330 at 50px, line-height 1.20, letter-spacing -0.025em, white on #000000. Sentence-case, not uppercase — the whisper-weight does the typographic work. Left-aligned, max-width ~600px.

### Section Statement
**Role:** Mid-page section opener

White text on #1019ec background, abcOracle 330 at ~34–40px, tight tracking. Max-width ~480px, left-aligned. Sets the tone for each feature block.

### Numbered Annotation Row
**Role:** Labeled section header with index

Two-part label: a small numeric prefix (01–04) in abcOracle 330 at 13px, #ffffff, paired with an uppercase label at 12–13px, letter-spacing 0.040em. A thin 1px white horizontal rule sits above the row. Used as section markers inside the blue block.

### Accordion Body Text
**Role:** Expandable content under a numbered row

White text on #1019ec, abcOracle 400 at 15px, line-height 1.50, normal tracking. Indented to align with the label, not the number. Max-width ~560px for comfortable reading width.

### Filled CTA Button
**Role:** Primary action button

#ebfb10 background, #000000 text, abcOracle 330 at 14px, uppercase, letter-spacing 0.040em. Padding 14px 30px. No radius. The acid green-on-black pairing is the highest-contrast action in the system.

### Hairline Divider
**Role:** Section separator

1px solid line, color shifts by section: #ffffff on dark, #000000 on blue. Full-width within the content column, used above numbered rows and below group labels.

### Particle Scatter Visualization
**Role:** Decorative data graphic in hero

Hundreds of small white/gray dashes and dots scattered across a vertical field on the right side of the hero. Functions as abstract brand mark — suggests population granularity. No fixed grid; reads as a scatter plot of human data points.

### Muted Link
**Role:** Inline or footer text link

abcOracle 330 at 13–14px, color #9d9d9d, no underline by default. Hover state lightens to #ffffff. Letter-spacing inherits the body cadence at 0.025–0.040em.

### Logo Lockup
**Role:** Brand mark in navigation

Small geometric icon (4-dot cluster) + lowercase wordmark 'aaru' in abcOracle 330 white, 16px. Sits left-aligned in the nav bar.

## Do's and Don'ts

### Do
- Use weight 330 as the default text weight for all UI elements; reserve weight 400 only for body paragraphs longer than two lines
- Apply positive letter-spacing (0.025–0.080em) to all text at 16px and below; apply negative tracking (-0.025 to -0.050em) at 20px and above
- Use #ebfb10 only for the single most important action per view — announcement bars and primary CTAs only
- Use #1019ec as a full-bleed section background to signal a tonal shift; never use it as a small accent fill
- Use 1px borders in inverted colors (white on dark, black on blue) instead of shadows to separate layers
- Maintain an 8px base-unit rhythm: all padding and gaps should resolve to 8, 10, 12, 16, 20, 24, 30, 32, or 40px
- Keep corner radii at 0px for buttons, inputs, and tags; the only permitted radius is 6px for card surfaces

### Don't
- Do not use bold (600+) or semibold (500+) weights — the system reads through weight contrast between 330 and 400 only
- Do not apply drop shadows, box-shadows, or glow effects to any element
- Do not introduce additional chromatic colors — the palette is exactly black, white, three grays, lime, and electric blue
- Do not use the blue or lime as text color on light backgrounds; both are background or button-fill colors only
- Do not center-align body text — the system reads left-aligned throughout, with asymmetric compositions
- Do not use border-radius above 6px on any component — the system is angular and terminal
- Do not use uppercase letter-spacing on text below 12px; the smallest sizes already carry enough cadence

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Base page background — the dominant surface |
| 1 | Carbon | `#0a0a0a` | Subtle elevation for borders and outlines on the dark canvas |
| 2 | Graphite | `#18181b` | Container surface for cards or callouts sitting on black |
| 3 | Plasma Blue | `#1019ec` | Chromatic section break — full-bleed feature background |

## Elevation

The design intentionally avoids shadows and drop-shadow elevation. Hierarchy is created through three mechanisms only: surface color shifts (black → graphite → blue), 1px hairline borders in contrasting colors, and generous whitespace. This flat approach reinforces the instrument-panel metaphor — real data readouts don't cast shadows.

## Imagery

Imagery is abstract and data-driven, not photographic. The hero features a particle-scatter visualization — hundreds of small dashes and dots forming a vertical cloud that suggests population data points or agent trajectories. The visual treatment is monochromatic (white/gray marks on black) with no photographic subjects, no people, no lifestyle shots. The overall image role is atmospheric and brand-defining rather than explanatory — it signals the product's domain (simulation, agents, data) without illustrating a specific use case. Decorative graphics are flat, sharp-edged, and terminal in feel — no gradients, no blurs, no organic shapes.

## Layout

The page alternates between two full-bleed tonal zones: a dominant black canvas and a single vivid blue section. The hero is dark with a left-aligned headline and a right-side particle visualization; the body shifts to #1019ec for the feature manifesto, then returns to black. Content within each zone is constrained to a max-width of ~1280px and left-aligned. The blue section uses a numbered accordion pattern: four labeled rows (01–04) stacked vertically, with thin dividers between them and expandable body text under the first row. Vertical rhythm is generous — 80px section gaps, 30px card padding, 8px element gaps — creating a spacious, slow-reading cadence. Navigation is a minimal top bar: logo left, three text links + two buttons right, sitting over a yellow-green announcement strip.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff (primary), #9d9d9d (muted), #000000 (on light/blue surfaces)
- background: #000000 (canvas), #1019ec (feature section), #ebfb10 (announcement/CTA)
- border: #ffffff (on dark), #000000 (on blue), #9d9d9d (muted)
- accent: #ebfb10 (lime — CTA fill)
- primary action: #ebfb10 (filled action)

Example Component Prompts:

1. Build a hero section on #000000 canvas. Headline at 50px abcOracle weight 330, #ffffff, letter-spacing -1.25px, line-height 1.20, left-aligned, max-width 600px. Subtext at 15px abcOracle weight 400, #9d9d9d, letter-spacing 0.375px. A filled CTA button: #ebfb10 background, #000000 text, 14px abcOracle 330 uppercase, letter-spacing 0.56px, padding 14px 30px, 0px radius. To the right, a particle-scatter graphic: ~200 small white and #bababa dashes/dots distributed across a vertical 400×600px field.

2. Build a numbered accordion row on #1019ec background. A 1px white hairline divider sits above. The row shows '01' in abcOracle 330 at 13px #ffffff, followed by an uppercase label at 12px abcOracle 330, letter-spacing 0.48px, #ffffff. Body text below at 15px abcOracle 400, #ffffff, line-height 1.50, max-width 560px. Vertical spacing between rows: 40px.

3. Build a navigation bar on #000000. Left: a 4-dot cluster icon + 'aaru' wordmark in abcOracle 330 at 16px #ffffff. Right: three text links (HOME, PRODUCTS, ABOUT) in abcOracle 330 at 13px #ffffff, letter-spacing 0.52px, with 32px column gap. Then a ghost button: 1px #ffffff border, transparent fill, 12px abcOracle 330 uppercase white, padding 12px 32px, 0px radius. Then a filled button: #ffffff background, #000000 text, same type spec, same padding and radius.

4. Build an announcement bar at the very top. Full-bleed #ebfb10 background, 40px tall. Centered text in abcOracle 330 at 12px #000000, uppercase, letter-spacing 0.96px, with a 'READ MORE →' link inline.

5. Build a muted footer link list on #000000. Items in abcOracle 330 at 13px, color #9d9d9d, letter-spacing 0.325px, stacked vertically with 10px row gap. A 1px #0a0a0a hairline sits above the list. No icons, no underlines.

## Similar Brands

- **Linear** — Same dark-mode scientific aesthetic with ultra-light typography, generous whitespace, and flat borderless surfaces
- **Vercel** — Same minimal terminal-style navigation, weight 300 display type, and reliance on color contrast over shadows for hierarchy
- **Anthropic** — Same observatory-like dark canvas with a single chromatic accent color used for primary actions and announcement bars
- **Runway** — Same data-visualization-forward hero treatment and dark-canvas + single-vivid-accent color logic
- **Weights & Biases** — Same instrument-panel feel with numbered annotations, tracked uppercase labels, and flat hairlines instead of cards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-carbon: #0a0a0a;
  --color-graphite: #18181b;
  --color-frost: #ffffff;
  --color-ash: #bababa;
  --color-smoke: #9d9d9d;
  --color-slate: #858484;
  --color-reactor-lime: #ebfb10;
  --color-plasma-blue: #1019ec;

  /* Typography — Font Families */
  --font-abcoracle: 'abcOracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtpantheon: 'gtPantheon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.96px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: 0.6px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.75px;
  --text-heading: 34px;
  --leading-heading: 1.25;
  --tracking-heading: -0.85px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -2px;
  --text-display: 50px;
  --leading-display: 1.2;
  --tracking-display: -1.25px;

  /* Typography — Weights */
  --font-weight-w330: 330;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 30px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 6px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-carbon: #0a0a0a;
  --surface-graphite: #18181b;
  --surface-plasma-blue: #1019ec;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-carbon: #0a0a0a;
  --color-graphite: #18181b;
  --color-frost: #ffffff;
  --color-ash: #bababa;
  --color-smoke: #9d9d9d;
  --color-slate: #858484;
  --color-reactor-lime: #ebfb10;
  --color-plasma-blue: #1019ec;

  /* Typography */
  --font-abcoracle: 'abcOracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtpantheon: 'gtPantheon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.96px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: 0.6px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.75px;
  --text-heading: 34px;
  --leading-heading: 1.25;
  --tracking-heading: -0.85px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -2px;
  --text-display: 50px;
  --leading-display: 1.2;
  --tracking-display: -1.25px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
}
```
