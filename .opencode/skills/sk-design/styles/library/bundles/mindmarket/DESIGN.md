# MindMarket — Style Reference
> Warm storybook on cream paper — a friendly editorial canvas where oversized Inter headlines and paper-cut characters share a sunlit, sticker-soft surface.

**Theme:** light

MindMarket is a warm, illustrated editorial system built on a cream-paper canvas rather than stark white, with massive Inter display type that fills the frame and a single vivid green accent that anchors the brand across navigation strokes, borders, and hero fills. The visual language borrows from paper-cut storybook illustration — flat, vibrant character art sits directly on warm neutral backgrounds, never on photographic or gradient surfaces, and the UI chrome is deliberately minimal so the artwork leads. Components are generously rounded (50–64px radii on cards and nav), creating a soft, sticker-like quality. Color behaves decoratively rather than functionally: the green, blue, red, and yellow accents repeat across illustrations and are used sparingly in UI as borders, icon accents, and surface highlights rather than as a strict semantic state system. The overall density is breathable and confident — few elements per screen, enormous type, wide margins, and the cream canvas doing the structural work that shadow systems usually handle in product UIs.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fresh Grass | `#8ed462` | `--color-fresh-grass` | Primary brand accent — navigation strokes, card borders, decorative highlights. The single chromatic anchor that ties the cream canvas to the brand identity |
| Cream Paper | `#f5f1e4` | `--color-cream-paper` | Dominant page background and soft card surface. Warm off-white that replaces stark white as the structural canvas |
| Ink Black | `#2c2e2a` | `--color-ink-black` | Primary text, icons, nav borders, and the dominant hairline border color. Warm near-black that reads softer than pure black on cream |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surfaces, floating nav background, text on dark illustrations. The highest surface level in the stack |
| Sandstone | `#e0dbce` | `--color-sandstone` | Secondary surface tone for inset or recessed card states. Slightly deeper than the cream canvas |
| Stone Gray | `#80827f` | `--color-stone-gray` | Muted body text and secondary link borders. The only true mid-gray for de-emphasized content |
| Hairline Mist | `#d5d5d4` | `--color-hairline-mist` | Subtle nav dividers and low-contrast borders. Barely visible structural lines |
| Pure Ink | `#000000` | `--color-pure-ink` | Icon fills, body text on light surfaces, and high-contrast borders. Used where maximum contrast is needed against the cream |
| Sky Pop | `#2ba0ff` | `--color-sky-pop` | Decorative illustration accent and card border accent. Vivid blue used illustratively and as a small functional punctuation in icon dots |
| Coral Pop | `#ff705d` | `--color-coral-pop` | Red outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Sunshine Pop | `#f5e211` | `--color-sunshine-pop` | Footer highlight and decorative illustration accent. Bright yellow used sparingly for warmth and playfulness |

## Tokens — Typography

### Inter — Single-family system: Inter carries everything from 9px micro-labels to 144px display headlines. The use of Inter at display scale is a signature choice — most editorial systems reach for a serif or custom display face; MindMarket trusts Inter's geometric clarity at extreme sizes, relying on tight letter-spacing (-0.06em at 140px+) and aggressive line-height compression (0.95–1.15) to create visual weight without switching families. · `--font-inter`
- **Substitute:** Inter (Google Fonts) — no substitute needed
- **Weights:** 400, 500
- **Sizes:** 9px, 15px, 17px, 18px, 20px, 30px, 53px, 81px, 140px, 144px
- **Line height:** 0.95–2.00 (display 0.95–1.20, body 1.50)
- **Letter spacing:** -0.06em at 81px and above, -0.04em at 53px, normal at body sizes
- **Role:** Single-family system: Inter carries everything from 9px micro-labels to 144px display headlines. The use of Inter at display scale is a signature choice — most editorial systems reach for a serif or custom display face; MindMarket trusts Inter's geometric clarity at extreme sizes, relying on tight letter-spacing (-0.06em at 140px+) and aggressive line-height compression (0.95–1.15) to create visual weight without switching families.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 15px | 1.5 | — | `--text-body-sm` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| heading | 53px | 1.15 | -2.12px | `--text-heading` |
| heading-lg | 81px | 1.2 | -4.86px | `--text-heading-lg` |
| display | 140px | 0.95 | -8.4px | `--text-display` |
| display-lg | 144px | 0.95 | -8.64px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 20 | 20px | `--spacing-20` |
| 60 | 60px | `--spacing-60` |
| 136 | 136px | `--spacing-136` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 50px |
| cards | 50px |
| small | 10px |
| buttons | 50px |
| illustration-containers | 63.75px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20-21px
- **Element gap:** 17-21px

## Components

### Floating Pill Navigation Bar
**Role:** Primary site navigation container

White (#ffffff) pill-shaped bar with 50px border-radius, floating over the cream canvas with generous margins. Contains brand logo container (rounded square, ~40px), nav links at 15px Inter 500 in #2c2e2a with 17–20px horizontal padding, a circular green menu icon button, and a CTA. The entire bar reads as a single soft pill, not a rectangular header.

### Brand Logo Container
**Role:** Brand mark housing

Small rounded square (10–20px radius) containing the MindMarket mark, paired with the wordmark in 15–17px Inter 500 #2c2e2a. Sits at the left edge of the nav pill.

### Primary CTA Button
**Role:** Main action trigger (no distinct CTA background color)

Light/white pill button with 50px radius, ~11px vertical and 20px horizontal padding, 15px Inter 500 #2c2e2a text reading 'Get a quote'. Features a small circular icon accent (blue #2ba0ff or similar) embedded at the right edge as a visual action indicator. The button is a ghost/light style — not a filled chromatic action.

### Menu Toggle Button
**Role:** Navigation menu trigger

Circular button (~40px diameter) with #8ed462 green fill and a dark menu icon. Sits at the right edge of the nav pill, before the CTA.

### Content Card
**Role:** Feature/service content container

White (#ffffff) surface with 50–64px border-radius, 21px internal padding. Contains a heading, body text, and a CTA. Hairline border optional. Used for 'No more chaos' type messaging blocks and service descriptions.

### Service Card Link
**Role:** Navigable service entry

White card with a #ff705d coral filled button (pill shape, 50px radius) as the action trigger. The coral fill is the most prominent chromatic action surface on the site and is reserved for service-level CTAs rather than global actions.

### Hero Display Block
**Role:** Above-the-fold headline area

Full-bleed cream canvas section. Headline at 140–144px Inter weight 500, #2c2e2a, letter-spacing -0.06em, line-height 0.95. Subheadline at 17–20px weight 400. The headline is the dominant visual element — no competing imagery above the fold except the illustration bleeding from below.

### Illustration Hero Panel
**Role:** Decorative character art section

Paper-cut style character illustrations with flat color fills in green, blue, coral, yellow, purple, and white. Characters are dynamic, overlapping, and sit directly on the cream canvas. No frames, no rounded clipping — the art is the container. Used as hero and section dividers.

### Inline Text Link
**Role:** Navigable text link

#2c2e2a or #80827f text with an underline or hairline border in matching color. 15–18px Inter 400. Links carry a #80827f border-bottom as their visual affordance, not a chromatic color change.

### Footer Accent Block
**Role:** Footer highlight surface

#f5e211 yellow fill section at the page bottom. Solid vivid yellow as a warm closing band. Contrasts sharply with the cream canvas above.

## Do's and Don'ts

### Do
- Use #f5f1e4 cream as the page canvas — never #ffffff as the primary background. White is reserved for elevated cards and the floating nav.
- Set border-radius to 50px for all cards, buttons, and nav containers. Use 63.75px for illustration containers and 10px for inline micro-elements like tag chips.
- Set display headlines at 140–144px Inter weight 500 with letter-spacing -0.06em and line-height 0.95. This is the system's signature scale — shrinking to 53–81px for section headings.
- Use #8ed462 green as the only brand-structural accent in UI chrome (nav strokes, borders, toggle fills). Never use it for body text or large surface fills.
- Use #2c2e2a for all primary text, borders, and icons. Never use pure #000000 for large body text on cream — it creates harsh contrast against the warm canvas.
- Embed a small chromatic circle icon (blue, green, or coral) inside CTA buttons as the action affordance, rather than relying on background fill to signal interactivity.
- Float the navigation as a single white pill bar with 50px radius, centered or full-width with generous margin, rather than as a traditional rectangular header bar.

### Don't
- Don't introduce a second typeface for display headings — Inter at extreme sizes with tight tracking is the system's defining choice.
- Don't use the accent colors (blue, coral, yellow) as functional states for success/error/warning — they are decorative illustration accents only.
- Don't use sharp corners (0–4px radius) on cards or buttons — the system reads as sticker-soft and relies on generous rounding for its identity.
- Don't place white cards directly on white backgrounds — always separate card surfaces from the cream canvas with either the white-on-cream elevation contrast or a hairline border.
- Don't use shadows or gradients for elevation — the cream-to-white surface stack and generous radii handle depth without shadow.
- Don't use more than one chromatic accent per UI component — buttons are either green-structural, coral-action, or light-ghost with a single icon dot, never multicolor.
- Don't reduce display type below 53px for primary page headings — the system's authority comes from extreme scale, and shrinking it collapses the editorial feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f5f1e4` | Page canvas — the dominant warm background |
| 1 | Pure White | `#ffffff` | Elevated cards, floating navigation, inset content blocks |
| 2 | Sandstone | `#e0dbce` | Recessed or secondary surface tone |

## Elevation

MindMarket uses a cream-to-white surface stack and generous border-radii instead of box-shadows for elevation. The floating nav pill sits on the cream canvas without a shadow — its elevation is communicated by the white-on-cream color shift alone. Cards are differentiated from the canvas by surface color, not by drop shadow. This creates a flat, editorial, paper-like feel where everything feels printed rather than digitally raised.

## Imagery

Illustration-only visual language. No photography, no product screenshots, no 3D renders. All visuals are flat paper-cut style character illustrations with bold outlines and vivid flat color fills (green, blue, coral, yellow, purple, white). Characters are dynamic and overlapping, with limbs and props extending beyond implied boundaries. Illustrations sit directly on the cream canvas without frames, masks, or rounded clipping containers. The art style is editorial and storybook — human figures with exaggerated proportions, playful poses, and bright personality. Icons are minimal: simple geometric shapes (circles for menu toggles, small dots for CTA affordances) rather than a dedicated icon set. Imagery is decorative atmosphere rather than explanatory — it sets emotional tone for a market research brand that talks about 'real human insights.'

## Layout

Full-bleed sections on a cream canvas, with no fixed max-width grid constraining the illustrations. Content cards (white, 50–64px radius) float within sections and are constrained to ~600–700px width for readability. The hero is a centered headline stack at 140–144px with the illustration bleeding from the bottom edge into the next section. Navigation is a single floating white pill bar, horizontally centered or full-width, sitting above all content. Section rhythm alternates between illustration-led sections (art takes ~60% of the width) and text-card sections (white cards at ~50% width with generous surrounding cream). The page reads top-to-bottom as: floating nav → giant headline hero → illustration panel → text card section → illustration+card split. Vertical spacing between sections is generous (80–120px). No sidebar, no multi-column product grids, no pricing tables — the layout is editorial and single-column in its reading flow, with illustrations providing lateral visual interest.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2c2e2a
- background: #f5f1e4 (cream canvas)
- surface: #ffffff (elevated cards, floating nav)
- border: #2c2e2a or #80827f
- accent: #8ed462 (green — structural accent only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Create a hero headline section:* Cream background (#f5f1e4). Headline at 140px Inter weight 500, #2c2e2a, letter-spacing -8.4px, line-height 0.95. Subheadline at 20px weight 400, #2c2e2a, centered or left-aligned. No card wrapper — text sits directly on cream canvas.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. *Create a content card:* White (#ffffff) surface, 50px border-radius, 21px padding. Heading at 30px Inter weight 500 #2c2e2a, body text at 17px weight 400 #2c2e2a. No shadow, no border. The card sits on the cream (#f5f1e4) canvas.

4. *Create a service action card:* White card (50px radius, 21px padding) containing a coral (#ff705d) pill button (50px radius, 11px vertical and 20px horizontal padding, 15px Inter 500 white text, small white circle icon at right). This is the most prominent chromatic action on the site.

5. *Create a footer accent band:* Full-width #f5e211 yellow section at the page bottom, 50px+ padding, serving as a warm closing visual.

## Similar Brands

- **Duolingo** — Same playful illustrated character art on warm neutral backgrounds, with flat color fills and paper-cut aesthetic
- **Headspace** — Similar warm cream canvas, oversized friendly type, and generous rounded radii creating a soft approachable feel
- **Mailchimp** — Same editorial illustration-led approach with vivid accent colors used decoratively rather than as strict UI states
- **Figma Config** — Same floating pill navigation pattern and cream/warm-white surface treatment with oversized display type
- **Notion** — Similar light, breathable layout with minimal UI chrome letting content and illustration lead

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fresh-grass: #8ed462;
  --color-cream-paper: #f5f1e4;
  --color-ink-black: #2c2e2a;
  --color-pure-white: #ffffff;
  --color-sandstone: #e0dbce;
  --color-stone-gray: #80827f;
  --color-hairline-mist: #d5d5d4;
  --color-pure-ink: #000000;
  --color-sky-pop: #2ba0ff;
  --color-coral-pop: #ff705d;
  --color-sunshine-pop: #f5e211;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 53px;
  --leading-heading: 1.15;
  --tracking-heading: -2.12px;
  --text-heading-lg: 81px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -4.86px;
  --text-display: 140px;
  --leading-display: 0.95;
  --tracking-display: -8.4px;
  --text-display-lg: 144px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -8.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-136: 136px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20-21px;
  --element-gap: 17-21px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 25.5px;
  --radius-full: 50px;
  --radius-full-2: 63.75px;

  /* Named Radii */
  --radius-nav: 50px;
  --radius-cards: 50px;
  --radius-small: 10px;
  --radius-buttons: 50px;
  --radius-illustration-containers: 63.75px;

  /* Surfaces */
  --surface-cream-paper: #f5f1e4;
  --surface-pure-white: #ffffff;
  --surface-sandstone: #e0dbce;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fresh-grass: #8ed462;
  --color-cream-paper: #f5f1e4;
  --color-ink-black: #2c2e2a;
  --color-pure-white: #ffffff;
  --color-sandstone: #e0dbce;
  --color-stone-gray: #80827f;
  --color-hairline-mist: #d5d5d4;
  --color-pure-ink: #000000;
  --color-sky-pop: #2ba0ff;
  --color-coral-pop: #ff705d;
  --color-sunshine-pop: #f5e211;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 53px;
  --leading-heading: 1.15;
  --tracking-heading: -2.12px;
  --text-heading-lg: 81px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -4.86px;
  --text-display: 140px;
  --leading-display: 0.95;
  --tracking-display: -8.4px;
  --text-display-lg: 144px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -8.64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-136: 136px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 25.5px;
  --radius-full: 50px;
  --radius-full-2: 63.75px;
}
```
