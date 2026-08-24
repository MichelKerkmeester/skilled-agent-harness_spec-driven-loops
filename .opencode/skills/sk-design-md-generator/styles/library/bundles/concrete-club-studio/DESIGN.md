# Concrete Club Studio — Style Reference
> sun-faded editorial zine on dusty rose paper — the layout is a printed page, not a screen

**Theme:** mixed

Concrete Club is a warm editorial zine on dusty rose: oversized serif wordmarks dominate generous pink and off-white fields, small uppercase sans-serif tags steer the eye, and single warm orange-red ink bleeds through the layout as the one chromatic accent. Sections alternate between dusty rose, off-white canvas, and deep charcoal — each acts as a separate printed page bound into one publication. Typography is the interface: a distinctive humanist serif (DaVinci) carries all display weight, while Helvetica Neue Light whispers at body and nav scale. Hand-drawn line illustrations interrupt the grid at the right margin of the wordmark, softening the bold typographic authority with lo-fi charm. Everything else is restrained — no buttons, no cards, no shadows — the page behaves like a printed art book, not a software product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Ink | `#d9462b` | `--color-ember-ink` | Hero wordmark color, accent strokes, and the only chromatic text — a warm orange-red that reads as hand-pressed ink against the pink field. Used on display headlines and select illustration details |
| Dusty Rose | `#e296bb` | `--color-dusty-rose` | Primary section background — a warm desaturated pink that carries the hero band and full-width content panels. Sets the editorial tone of the site |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, wordmark fill on light sections, illustration linework, and borders. The workhorse neutral |
| Charcoal | `#212121` | `--color-charcoal` | Dark section surface — used for full-bleed panels that invert the page to white-on-black editorial spreads |
| Bone White | `#f5f6f5` | `--color-bone-white` | Default page canvas and light section background — slightly warm off-white that pairs with the pink rather than competing against it |
| Paper White | `#ffffff` | `--color-paper-white` | Pure white reserved for maximum contrast moments and the lightest content panels |

## Tokens — Typography

### TRJN DaVinci — Display wordmark and editorial display type. This humanist serif at 300px is the signature — it carries the brand name and section titles. Its tall x-height, ball-terminal details, and slight contrast make it feel like wood-type rather than web type. Used at massive scale for the 'Concrete Club' wordmark and at 14–16px for editorial pull-quotes and chapter labels. Substitute: Playfair Display or DM Serif Display for a similar humanist editorial serif character. · `--font-trjn-davinci`
- **Substitute:** Playfair Display
- **Weights:** 400
- **Sizes:** 14px, 16px, 300px
- **Line height:** 0.73, 0.75, 1.14, 1.19
- **Letter spacing:** -0.0300em
- **Role:** Display wordmark and editorial display type. This humanist serif at 300px is the signature — it carries the brand name and section titles. Its tall x-height, ball-terminal details, and slight contrast make it feel like wood-type rather than web type. Used at massive scale for the 'Concrete Club' wordmark and at 14–16px for editorial pull-quotes and chapter labels. Substitute: Playfair Display or DM Serif Display for a similar humanist editorial serif character.

### HelveticaNeue-Light — Body text, navigation labels, and large all-caps section statements. The 300-weight thinness of this sans is deliberate — it sits quietly beneath the DaVinci wordmark rather than competing. At 48px and 112px it becomes statement type in its own right, used for large chapter intros and hero secondary text. Tight line-height (0.78) makes multi-line headers stack densely. Substitute: Helvetica Neue Light or Inter Light. · `--font-helveticaneue-light`
- **Weights:** 400
- **Sizes:** 26px, 48px, 112px
- **Line height:** 0.78, 1.15
- **Role:** Body text, navigation labels, and large all-caps section statements. The 300-weight thinness of this sans is deliberate — it sits quietly beneath the DaVinci wordmark rather than competing. At 48px and 112px it becomes statement type in its own right, used for large chapter intros and hero secondary text. Tight line-height (0.78) makes multi-line headers stack densely. Substitute: Helvetica Neue Light or Inter Light.

### Neue Montreal — Micro-labels and small print — copyright lines, location markers, fine meta text. The cleanest, most neutral voice in the system. Substitute: Neue Haas Grotesk or Inter. · `--font-neue-montreal`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.17
- **Role:** Micro-labels and small print — copyright lines, location markers, fine meta text. The cleanest, most neutral voice in the system. Substitute: Neue Haas Grotesk or Inter.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.17 | — | `--text-caption` |
| body-sm | 14px | 1.14 | -0.42px | `--text-body-sm` |
| body | 16px | 1.19 | -0.48px | `--text-body` |
| subheading | 26px | 1.15 | — | `--text-subheading` |
| heading | 48px | 0.78 | — | `--text-heading` |
| heading-lg | 112px | 0.78 | — | `--text-heading-lg` |
| display | 300px | 0.73 | -9px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 30 | 30px | `--spacing-30` |
| 60 | 60px | `--spacing-60` |
| 230 | 230px | `--spacing-230` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Card padding:** 30px
- **Element gap:** 5-10px

## Components

### Display Wordmark
**Role:** The 'Concrete Club' brand name on hero and section openers

TRJN DaVinci at 300px, line-height 0.73, letter-spacing -0.03em. Color is Ember Ink (#d9462b) on the Dusty Rose surface, or Ink Black (#000000) on light surfaces. Fills the full viewport width on the hero. No padding above — the type bleeds from the top edge. The 'e' in 'Concrete' is replaced or overlapped by a hand-drawn lozenge/eye illustration at the baseline.

### Uppercase Nav Tag
**Role:** Small navigation and chapter labels at top of sections

HelveticaNeue-Light at 14px, uppercase, letter-spacing normal. Set in 3-line stack: category / location / chapter. Color is Ember Ink on pink, Ink Black on white, Paper White on charcoal. Stacks tightly with 5px line gap. Appears centered above the wordmark on the hero, and in the top-right corner as a site nav.

### Editorial Body Block
**Role:** Paragraph text in the intro and content sections

HelveticaNeue-Light at 16px, line-height 1.19, letter-spacing -0.03em. All caps, set in a narrow column (max ~400px wide). Color is Ink Black on light surfaces, Paper White on charcoal. No margins between paragraphs within a block — blocks are tightly stacked.

### Hand-Drawn Illustration Accent
**Role:** Decorative line-art that breaks the typographic grid

Monochrome line illustration in the brand's current chromatic color (Ember Ink on pink, Ink Black on white, Paper White on charcoal). 0px border-radius, no fill — pure outline stroke. Positioned at the right margin of the display wordmark, slightly overlapping the baseline. Acts as a signature mark, not a decorative flourish.

### Hero Band (Pink)
**Role:** The opening section that establishes the brand

Full-bleed Dusty Rose (#e296bb) background, 230px top padding to push the wordmark below the fold of the nav. Contains: top-left micro-description, top-right uppercase nav, centered chapter tag, and the massive 300px wordmark. No borders, no cards, no shadows — the surface IS the container.

### Light Editorial Section
**Role:** Content sections on off-white canvas

Bone White (#f5f6f5) background with the 112px display wordmark in Ink Black. Side-by-side layout: wordmark left, small illustration accent right. 60px horizontal padding, 60-100px vertical padding.

### Dark Inverted Section
**Role:** Full-bleed charcoal section for contrasting editorial content

Charcoal (#212121) background with Paper White text. Same typographic system inverts — HelveticaNeue-Light 16px all-caps body, large display wordmark in Paper White. Centered line illustration in Paper White outline. The dark spread is a deliberate page-turn moment, not a footer.

### Top-Right Site Nav
**Role:** Minimal navigation in the upper-right corner of every section

Three-line stack: location (e.g. 'Paris, France — 11:34') / menu links (Studio, Contact, Blog) / blank. HelveticaNeue-Light 12-14px, uppercase. Anchored top-right with 30px padding. No background, no border — sits directly on the section surface.

### Top-Left Identity Tag
**Role:** Persistent brand description in the upper-left corner

Two lines of small caps text: 'The Concrete Club is a collaboration-based creative freelance collective founded by Gaétan Pautler.' HelveticaNeue-Light 12px, Ink Black on light, Paper White on dark. Anchored top-left with 30px padding.

### Chapter Marker
**Role:** Small label indicating the current section/chapter

Three-line uppercase stack: 'CONCRETE CLUB' / 'PARIS, WORLDWIDE' / 'CHAPTER 2'. HelveticaNeue-Light 14px, centered horizontally, positioned in the upper third of the page above the wordmark. Color matches the current surface accent.

### Full-Bleed Surface Section
**Role:** Edge-to-edge colored band

No border-radius anywhere. Sections fill the viewport edge-to-edge with no max-width constraint. The layout is truly full-bleed — the wordmark and content are positioned with padding relative to viewport edges, not a centered container.

## Do's and Don'ts

### Do
- Use TRJN DaVinci exclusively for the wordmark and display type at 112px and above
- Let the wordmark fill the full viewport width on hero sections — no max-width container
- Set all body and nav text in uppercase HelveticaNeue-Light — no mixed case in the editorial voice
- Alternate between the three surface colors (Dusty Rose, Bone White, Charcoal) in full-bleed sections with no borders between them
- Use Ember Ink (#d9462b) as the only chromatic text color, and only on the Dusty Rose surface
- Position the hand-drawn illustration at the right margin of the display wordmark, overlapping the baseline
- Use 230px top padding on the hero to push the wordmark below the nav zone

### Don't
- Do not introduce buttons, cards, or any elevated UI components — the system has no interactive surfaces
- Do not apply border-radius to any element — keep all edges sharp and printed
- Do not use shadows or elevation — surfaces are defined by color alone
- Do not center content in a max-width container — layout is edge-to-edge full-bleed
- Do not use mixed-case typography — the entire system speaks in uppercase
- Do not use Ember Ink on light or dark surfaces — it belongs only on Dusty Rose
- Do not add gradient or photographic backgrounds — the system is flat printed color only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone White Canvas | `#f5f6f5` | Default page background and light editorial panels |
| 1 | Dusty Rose Field | `#e296bb` | Hero band and warm content sections — the brand's signature surface |
| 2 | Charcoal Spread | `#212121` | Full-bleed dark editorial section — inverts the page to white type |
| 3 | Ink Black | `#000000` | Maximum-contrast content surfaces |

## Elevation

The design uses zero shadows. Surface hierarchy is communicated entirely through color field alternation — Dusty Rose → Bone White → Charcoal act as distinct printed pages rather than stacked digital layers. Elevation is a print metaphor (paper on paper), not a digital metaphor (cards above canvas).

## Imagery

Illustration-only visual language. Hand-drawn line art in single-color outline — no fills, no gradients, no photography. Illustrations appear as small accents (roughly 80-120px) at the right margin of the display wordmark, suggesting objects like a lozenge/eye, a bag labeled 'DAMN', or loose linework. The style is lo-fi, pen-on-paper, slightly wobbly — the opposite of polished vector illustration. No product photography, no portraits, no abstract graphics beyond the illustrations themselves.

## Layout

Full-bleed editorial layout with no max-width container. The page reads top-to-bottom as a sequence of full-viewport color bands: Dusty Rose hero → Bone White section → Charcoal dark section. Within each band, content is positioned with generous padding (30-60px sides, 60-230px vertical) but never centered in a fixed container. The wordmark is the dominant element on hero and section openers, stretching nearly edge-to-edge at 300px. Small text elements (nav, chapter tags, body blocks) are narrow columns set in tight clusters. Navigation is minimal: top-left identity tag and top-right menu, both 12-14px uppercase. The grid is loose and asymmetric — text columns and illustration accents are placed by hand rather than snapping to a strict grid.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink Black)
- background: #f5f6f5 (Bone White)
- border: #000000 (Ink Black, 1px hairline)
- accent: #d9462b (Ember Ink)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Display Wordmark Block**: Full-bleed Dusty Rose (#e296bb) background, 230px top padding. Massive 'Concrete Club' set in TRJN DaVinci (substitute: Playfair Display) at 300px, line-height 0.73, letter-spacing -0.03em, color #d9462b. Place a small hand-drawn line illustration (~100px) at the right margin of the wordmark, slightly overlapping the final letter's baseline.

2. **Light Editorial Section**: Bone White (#f5f6f5) full-bleed background. Display wordmark in TRJN DaVinci at 112px, line-height 0.78, color #000000, left-aligned with 60px left padding. Narrow body column (max 400px) in HelveticaNeue-Light 16px all-caps, line-height 1.19, letter-spacing -0.03em, color #000000, positioned in the lower-left quadrant.

3. **Dark Inverted Spread**: Charcoal (#212121) full-bleed background. Centered line illustration in #ffffff outline (~150px). Body text in HelveticaNeue-Light 16px all-caps, line-height 1.19, color #ffffff, set in a narrow centered column (max 500px).

4. **Top-Right Nav Cluster**: Positioned absolute top-right with 30px padding. Three-line stack: 'Paris, France — 11:34' / 'Studio, Contact, Blog' / blank. HelveticaNeue-Light 12px, uppercase, color #000000 on light surfaces, #ffffff on dark. No background, no border.

5. **Chapter Marker**: Centered horizontally, positioned in the upper third of the page. Three-line uppercase stack in HelveticaNeue-Light 14px: 'CONCRETE CLUB' / 'PARIS, WORLDWIDE' / 'CHAPTER 2'. 5px line gap. Color #d9462b on pink surface, #000000 on light surface.

## Similar Brands

- **Werkplaats Typografie** — Same full-bleed editorial layout with oversized serif display type on warm paper-tone backgrounds and minimal sans-serif metadata
- **Pentagram portfolio pages** — Same approach of treating the web page as a printed editorial spread — large confident type, flat color fields, no UI chrome
- **Stefan Sagmeister studio site** — Same hand-drawn illustration accents and willingness to let a single warm chromatic color (pink/orange family) carry the entire visual identity
- **Locomotive MTL** — Same French-creative-agency sensibility: Dusty Rose + warm orange-red palette, large humanist serif wordmark, uppercase sans body, alternating light/dark editorial sections
- **Spin (studio site)** — Same edge-to-edge full-bleed color bands with massive display type and zero border-radius or shadow — the page is a zine, not an app

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-ink: #d9462b;
  --color-dusty-rose: #e296bb;
  --color-ink-black: #000000;
  --color-charcoal: #212121;
  --color-bone-white: #f5f6f5;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-trjn-davinci: 'TRJN DaVinci', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticaneue-light: 'HelveticaNeue-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.17;
  --text-body-sm: 14px;
  --leading-body-sm: 1.14;
  --tracking-body-sm: -0.42px;
  --text-body: 16px;
  --leading-body: 1.19;
  --tracking-body: -0.48px;
  --text-subheading: 26px;
  --leading-subheading: 1.15;
  --text-heading: 48px;
  --leading-heading: 0.78;
  --text-heading-lg: 112px;
  --leading-heading-lg: 0.78;
  --text-display: 300px;
  --leading-display: 0.73;
  --tracking-display: -9px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-230: 230px;

  /* Layout */
  --card-padding: 30px;
  --element-gap: 5-10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-white-canvas: #f5f6f5;
  --surface-dusty-rose-field: #e296bb;
  --surface-charcoal-spread: #212121;
  --surface-ink-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-ink: #d9462b;
  --color-dusty-rose: #e296bb;
  --color-ink-black: #000000;
  --color-charcoal: #212121;
  --color-bone-white: #f5f6f5;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-trjn-davinci: 'TRJN DaVinci', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticaneue-light: 'HelveticaNeue-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.17;
  --text-body-sm: 14px;
  --leading-body-sm: 1.14;
  --tracking-body-sm: -0.42px;
  --text-body: 16px;
  --leading-body: 1.19;
  --tracking-body: -0.48px;
  --text-subheading: 26px;
  --leading-subheading: 1.15;
  --text-heading: 48px;
  --leading-heading: 0.78;
  --text-heading-lg: 112px;
  --leading-heading-lg: 0.78;
  --text-display: 300px;
  --leading-display: 0.73;
  --tracking-display: -9px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-230: 230px;
}
```
