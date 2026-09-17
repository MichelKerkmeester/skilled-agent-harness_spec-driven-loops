# Kindsight — Style Reference
> Sunlit field journal at dusk — an earthy, editorial calm built from cream paper, olive ink, and a single flash of chartreuse highlight.

Kindsight feels like a sustainably-printed nonprofit annual report: warm cream backgrounds, near-black text with a green undertone, a deep olive hero panel, and terracotta as the only shout. The single chartreuse accent is used sparingly — as underline punctuation on italic display words, badge fills, and illustrative highlights — never as a functional color. Display type in Times Now at weights 200-300 with tight tracking reads like editorial cover typography, not SaaS headlines.

**Theme:** light

Kindsight operates in a warm, editorial register that reads more like a design magazine than a SaaS dashboard. A cream canvas (#faf5f1) holds the page, with a deep olive hero (#3d4128) creating an earthy, almost botanical atmosphere. Display type uses Times Now at whisper weights (200-300) with aggressive negative tracking, producing compressed, magazine-cover headlines. A single chartreuse accent (#e1f079) appears as decorative highlight — underlines beneath italic display words, badges, illustration fills — never as a utility color. Terracotta (#de7653) is the only CTA color, appearing as solid filled buttons or thick outlined pills. Components favor generous 24px card radii, thin hairline borders, and zero or very subtle elevation; the design relies on tonal contrast between cream, near-black with green undertones (#0e0f0a), and the dark olive hero block to create depth rather than shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#faf5f1` | `--color-cream-paper` | Page background, nav surface, warm canvas base |
| Soft Linen | `#fefffa` | `--color-soft-linen` | Card surface, slightly brighter than canvas for subtle elevation |
| Ink Black | `#0e0f0a` | `--color-ink-black` | Primary text, borders, icons — near-black with a subtle green undertone that warms the entire palette |
| Midnight Black | `#0a0a0a` | `--color-midnight-black` | Body text fallback, secondary borders |
| Pure White | `#ffffff` | `--color-pure-white` | Button text on filled terracotta, pure white highlights |
| Warm Sand | `#e5e1d6` | `--color-warm-sand` | Muted section dividers, secondary card backgrounds, beige illustration fills |
| Olive Grove | `#3d4128` | `--color-olive-grove` | Hero panel background, dark accent surface — earthy green-black anchors the brand and gives the chartreuse somewhere to glow |
| Chartreuse Spark | `#e1f079` | `--color-chartreuse-spark` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Terracotta CTA | `#de7653` | `--color-terracotta-cta` | Orange action color for filled buttons, selected navigation states, and focused conversion moments. |
| Coral Outline | `#e7573d` | `--color-coral-outline` | Outlined/ghost CTA variant, secondary action borders — a deeper, redder cousin of terracotta for outlined button treatment |
| Deep Olive | `#24280f` | `--color-deep-olive` | Input field text, deepest green-black for hairline borders on dark surfaces |

## Tokens — Typography

### Times Now — Display headlines, hero copy, section titles. The signature choice: weights 200-300 with extreme negative tracking (up to -7.7px at 120px) create compressed, editorial-cover typography. One italic word per headline is underlined in chartreuse — this handwritten-style emphasis is the brand's most recognizable typographic gesture. Use only for display and hero copy. · `--font-times-now`
- **Substitute:** Playfair Display (closest free match for the compressed serif-display feel)
- **Weights:** 200, 300
- **Sizes:** 30px, 40px, 50px, 60px, 80px, 120px
- **Line height:** 0.78 – 1.00
- **Letter spacing:** -0.064em at 120px, -0.050em at 80px, -0.049em at 60px, -0.040em at 50px, -0.034em at 40px, -0.017em at 30px
- **Role:** Display headlines, hero copy, section titles. The signature choice: weights 200-300 with extreme negative tracking (up to -7.7px at 120px) create compressed, editorial-cover typography. One italic word per headline is underlined in chartreuse — this handwritten-style emphasis is the brand's most recognizable typographic gesture. Use only for display and hero copy.

### Founders Grotesk — Body text, UI controls, navigation, buttons, captions, supporting headlines. The workhorse: 16px at weight 400 for body, 14px for nav and secondary text, 12px for micro-labels, 10px for fine print. The slight negative tracking even at small sizes (e.g. -0.13px at 16px) gives text a crisp, considered quality. Weight 500 reserved for emphasis within UI. · `--font-founders-grotesk`
- **Substitute:** Inter or Söhne (geometric grotesks with similar x-height and tracking behavior)
- **Weights:** 200, 300, 400, 500
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 24px, 32px, 40px
- **Line height:** 1.04 – 2.00
- **Letter spacing:** -0.025em at 40px, -0.017em at 24px, -0.010em at 18px, -0.008em at 16px, normal at 14px and below
- **Role:** Body text, UI controls, navigation, buttons, captions, supporting headlines. The workhorse: 16px at weight 400 for body, 14px for nav and secondary text, 12px for micro-labels, 10px for fine print. The slight negative tracking even at small sizes (e.g. -0.13px at 16px) gives text a crisp, considered quality. Weight 500 reserved for emphasis within UI.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| fine-print | 10px | 1.2 | — | `--text-fine-print` |
| micro | 12px | 1.2 | — | `--text-micro` |
| caption | 14px | 1.33 | — | `--text-caption` |
| body-sm | 16px | 1.4 | -0.13px | `--text-body-sm` |
| body | 18px | 1.36 | -0.18px | `--text-body` |
| subheading | 40px | 1 | -1px | `--text-subheading` |
| heading-sm | 50px | 0.9 | -2px | `--text-heading-sm` |
| heading | 60px | 0.86 | -2.94px | `--text-heading` |
| heading-lg | 80px | 0.84 | -4px | `--text-heading-lg` |
| display | 120px | 0.78 | -7.68px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 92 | 92px | `--spacing-92` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| other | 3px |
| badges | 18px |
| inputs | 10px |
| buttons | 10px |
| buttonPill | 50px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 40px
- **Element gap:** 12-24px

## Components

### Primary Filled CTA Button
**Role:** Highest-priority action — Get a Demo, Register Now, primary conversions

Solid #de7653 background, #ffffff text, 10px border-radius, Founders Grotesk weight 400 at 16px, padding 14px 24px. No border. Generous horizontal padding gives the button a confident, grounded weight. Used for the single most important action per page.

### Outline Ghost Button
**Role:** Secondary CTA — See Kindsight in Action, secondary navigation actions

Chartreuse #e1f079 background with #0e0f0a text, 10px border-radius, Founders Grotesk weight 400 at 16px, padding 14px 24px. The lime fill is the brand's playful secondary action — it only appears on the hero-level secondary CTA, not throughout the system.

### Outlined Coral Button
**Role:** Tertiary action, KindCon-style register buttons

2px solid #e7573d border, #e7573d text, transparent fill, 50px pill radius, Founders Grotesk weight 400 at 14-16px, padding 12px 24px. A deeper, redder outlined variant for festival/promotional CTAs — full pill shape distinguishes it from standard buttons.

### Navigation Link
**Role:** Top-level nav items — Products, Who We Serve, Pricing, Resources, Company

Founders Grotesk weight 400 at 16px, #0e0f0a text, no underline by default, 8-10px horizontal padding. The nav sits on the cream canvas with a subtle hairline bottom border (#0e0f0a at low opacity). Clean, unadorned, lets the display type do the talking.

### Login Outlined Button
**Role:** Low-priority nav action — Login

1px solid #0e0f0a border, transparent fill, #0e0f0a text, 10px border-radius, padding 8px 20px, Founders Grotesk weight 400 at 16px. Restrained: the filled terracotta 'Get a Demo' does the heavy lifting; login stays visually quiet beside it.

### Hero Display Headline
**Role:** Page-level headline with brand-italic emphasis

Times Now weight 200-300, #e1f079 color on dark olive background (or #0e0f0a on cream), sizes 80-120px, line-height 0.78-0.90, letter-spacing -0.05em to -0.064em. The signature move: one word per headline is set in italic and underlined with a hand-drawn chartreuse stroke — this is the brand's editorial flourish. Example pattern: 'Fundraising intelligence that unlocks opportunities' with 'opportunities' italicized and underlined.

### Feature Section Card
**Role:** Content card pairing image + headline + body text

No background fill (sits on cream canvas), no visible border, 0px radius on the card itself, but the product screenshot inside has 24px radius with a subtle shadow. Image sits left, text right, or stacked on narrow viewports. Headline at Times Now 50-60px, body at Founders Grotesk 16-18px #0e0f0a.

### Logo Trust Bar
**Role:** Social proof — partner/mission organization logos

Single horizontal row of 5-6 monochrome logos on cream canvas, centered, preceded by a Times Now weight 300 headline ('Driving these missions forward') at 40-50px. Logos are rendered in #0e0f0a at consistent visual weight — no brand-color logos, everything unified to the ink-black palette.

### Product Dashboard Mockup
**Role:** Hero product visualization — floating UI panels showing the product

Overlapping card panels with 24px radius, #fefffa background, subtle hairline #0e0f0a border (1px at ~10% opacity), inner content shows charts/badges in chartreuse and terracotta. Panels overlap slightly to create depth. Text within mockups uses Founders Grotesk at smaller sizes. The mockup floats on the olive hero background with the faintest shadow.

### Notification/Alert Badge
**Role:** In-product alerts, profile alerts overlaid on imagery

White (#fefffa) rounded card with 18px radius, subtle border, internal layout: small label in #0e0f0a weight 500 at 10-12px caps, bold name at 16px, detail text at 14px #0e0f0a. Accent dot in #e7573d (coral) for alert state. Pinned to corner of a photographic image with a subtle drop connection.

### Score Circle Component
**Role:** Data visualization — donor capacity scores, analytics gauges

Circular progress indicator with thick stroke (6-8px) in #e1f079 (chartreuse) on a #e5e1d6 (warm sand) track. Center number in Times Now weight 300 at 40-50px #0e0f0a. Used in profile cards and analytics overlays.

### Promotional Banner (Top Strip)
**Role:** Event announcement bar — KindCon registration

Full-width strip with #faf5f1 background (slightly different cream tone or subtle warm tint), centered single-line text in Founders Grotesk 14px #0e0f0a, with a chartreuse #e1f079 filled pill button at the right end. Minimal height (~48px), sits above the main nav.

### Section Title (Serif)
**Role:** Section-level headlines on cream/light sections

Times Now weight 300, 50-60px, #0e0f0a, line-height 0.86-0.90, letter-spacing -0.049em. Centered or left-aligned depending on section. Occasionally features the same italic + chartreuse-underline emphasis as hero headlines for continuity.

### Input Field
**Role:** Form inputs — search, email capture, data filters

1px solid #24280f border (the deep olive), transparent or #fefffa fill, 10px border-radius, padding 12px 16px, Founders Grotesk 16px #24280f text. Placeholder in #0e0f0a at 40% opacity. No focus ring shadow — focus state is a 2px #e1f079 outline or border color shift.

## Do's and Don'ts

### Do
- Use Times Now at weights 200-300 for all display and hero headlines — never go above weight 400 for serif type
- Set hero display headlines at 80-120px with line-height below 0.90 and letter-spacing between -0.034em and -0.064em to achieve the compressed editorial look
- Underline exactly one italicized word per hero headline with a hand-drawn chartreuse (#e1f079) stroke — this is the brand's most recognizable gesture
- Use terracotta (#de7653) filled buttons as the sole primary CTA — never substitute another color for the filled action button
- Let the cream canvas (#faf5f1) breathe — maintain 80-120px section gaps and avoid stacking more than two surface levels per viewport
- Use Founders Grotesk weight 400 at 16px as the default body text with line-height 1.40 and letter-spacing -0.008em
- Reserve chartreuse (#e1f079) for decorative emphasis — underlines, badges, illustration fills, ghost buttons — never as text color on cream or as a functional state indicator

### Don't
- Never use chartreuse (#e1f079) as a text color for body copy or paragraphs — it fails contrast on cream and is too loud for sustained reading
- Do not add drop shadows to content cards or section blocks — depth comes from tonal contrast between cream, linen, and olive surfaces only
- Never use a sans-serif font for display headlines or hero copy — Times Now or an equivalent editorial serif is non-negotiable for brand identity
- Do not exceed weight 400 in Times Now for any text — the whisper-weight aesthetic (200-300) is the signature; heavier weights break the editorial feel
- Avoid placing terracotta (#de7653) on the dark olive hero background — use the outline ghost button or chartreuse highlight there instead
- Do not use blue or any cool-toned accent — the entire palette is warm (cream, olive, terracotta, chartreuse); introducing cool colors breaks the earthy brand atmosphere
- Never center-align body paragraphs — only display headlines and the logo trust bar may be centered; body text and UI labels are always left-aligned

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#faf5f1` | Page canvas — the warm off-white base that all content sits on |
| 1 | Soft Linen | `#fefffa` | Card surface, elevated above the cream canvas by a barely-perceptible brightness shift |
| 2 | Warm Sand | `#e5e1d6` | Section dividers, secondary cards, muted content blocks — a step darker than the canvas |
| 3 | Olive Grove | `#3d4128` | Dark hero panel — the highest-elevation dramatic surface, used sparingly to anchor hero sections |

## Elevation

Kindsight avoids shadows almost entirely. Depth is created through tonal contrast between cream (#faf5f1), linen (#fefffa), and the occasional olive hero panel — not through drop shadows. Cards sit on the canvas with a subtle brightness shift rather than floating on shadow. The only acceptable shadow is the faintest possible: 0 1px 2px rgba(14,15,10,0.04) for product dashboard mockups overlaid on the hero, never on standard content cards.

## Imagery

Photography is warm-toned, candid portraiture — people of diverse backgrounds photographed in natural light, looking at screens or in conversation. No corporate headshots, no staged stock imagery. Photos are treated with warm color grading that matches the cream/olive palette. The hero product visualization is a layered UI mockup: overlapping dashboard cards with charts, profile cards with circular score gauges, and notification badges — all rendered in the brand's own chartreuse and terracotta palette. Illustration appears in promotional sections (KindFest banner) as flat, slightly retro graphic elements: acoustic guitars, cowboy boots, music notes, sun motifs in a limited palette of terracotta, olive, and cream. Icons are minimal and line-based, drawn in Founders Grotesk geometric style at thin weights.

## Layout

Kindsight uses a max-width 1200px centered content column with generous outer padding. The hero is full-bleed dark olive with a 2-column split: oversized Times Now headline left (40-50% width), layered product mockup right (50-60% width). Below the hero, sections alternate between cream canvas and occasional warm-sand (#e5e1d6) blocks. Feature sections follow a consistent 2-column pattern: photographic image or product screenshot left, headline + body text right, with the image slightly overlapping the section boundary to create visual flow. The logo trust bar is centered, single row, generous vertical padding. Navigation is a clean top bar with no sticky behavior evident — cream background, hairline bottom border, logo left, links center, two buttons right. The overall density is spacious: 80-120px between major sections, 40px card padding, 12-24px element gaps within cards.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0e0f0a
- background: #faf5f1
- border: #0e0f0a (at 10-15% opacity for hairlines)
- accent: #e1f079 (chartreuse — decorative only)
- primary action: #de7653 (filled action)
- dark surface: #3d4128 (olive hero)

**Example Component Prompts**

1. Create a Primary Action Button: #de7653 background, #0a0a0a text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Build a feature section: #faf5f1 background, 80px vertical padding. Two-column layout (50/50). Left: product screenshot or photograph with 24px radius. Right: Times Now weight 300 at 50px, #0e0f0a, letter-spacing -0.040em, line-height 0.90. Body text in Founders Grotesk 16px weight 400, #0e0f0a, line-height 1.40, max-width 480px. Underline one italic display word in chartreuse.

3. Build a logo trust bar: #faf5f1 background, centered, 60px vertical padding. Heading 'Driving these missions forward' in Times Now weight 300 at 40px, #0e0f0a, centered. Below: single row of 5-6 logos, all rendered in #0e0f0a monochrome, evenly spaced, 32px height each.

4. Build a profile alert badge: #fefffa background, 18px radius, 1px border #0e0f0a at 10% opacity, padding 16px 20px. Label 'PROFILE ALERT' in Founders Grotesk weight 500 at 10px uppercase, #0e0f0a at 60% opacity. Name 'Rachel Lyons:' in Founders Grotesk weight 500 at 16px, #0e0f0a. Detail '4 new records matched' in Founders Grotesk 14px, #0e0f0a. Small #e7573d dot (8px circle) at top-right corner for alert state.

5. Build a score circle: 120px diameter circle with 6px stroke. Track: #e5e1d6. Fill: #e1f079, 67% arc starting from top. Center number '67' in Times Now weight 300 at 40px, #0e0f0a. Below circle: label 'Potential prospects by capacity' in Founders Grotesk 14px, #0e0f0a.

## Italic Emphasis System

The single most distinctive typographic gesture in Kindsight's system is the italic + chartreuse-underline treatment applied to one word per display headline. Rules: exactly one word per headline receives this treatment, the word must be the conceptual climax of the sentence (not a random adjective), the underline should look hand-drawn rather than mechanical (slightly varying thickness, imperfect line), and the chartreuse (#e1f079) is used only for this decorative purpose — never for body text, links, or functional UI. On dark olive hero backgrounds, the same treatment uses chartreuse for both the text color and underline. On cream sections, the italic word is still #0e0f0a but the underline is chartreuse.

## Similar Brands

- **Substack** — Same warm cream canvas with dark near-black text, editorial serif display type, and generous whitespace — the 'sustainable print publication' feel
- **Mailchimp (rebrand era)** — Warm, friendly color palette with cream backgrounds, dark text, and a single vivid accent color used sparingly for personality rather than utility
- **Headspace** — Warm-toned palette, rounded generous card radii, and a design system that prioritizes atmosphere and warmth over cold utility
- **Notion (marketing site)** — Spacious layout, serif display headlines, cream/off-white canvas, and restrained use of a single accent color for brand personality

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #faf5f1;
  --color-soft-linen: #fefffa;
  --color-ink-black: #0e0f0a;
  --color-midnight-black: #0a0a0a;
  --color-pure-white: #ffffff;
  --color-warm-sand: #e5e1d6;
  --color-olive-grove: #3d4128;
  --color-chartreuse-spark: #e1f079;
  --color-terracotta-cta: #de7653;
  --color-coral-outline: #e7573d;
  --color-deep-olive: #24280f;

  /* Typography — Font Families */
  --font-times-now: 'Times Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-fine-print: 10px;
  --leading-fine-print: 1.2;
  --text-micro: 12px;
  --leading-micro: 1.2;
  --text-caption: 14px;
  --leading-caption: 1.33;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.13px;
  --text-body: 18px;
  --leading-body: 1.36;
  --tracking-body: -0.18px;
  --text-subheading: 40px;
  --leading-subheading: 1;
  --tracking-subheading: -1px;
  --text-heading-sm: 50px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -2px;
  --text-heading: 60px;
  --leading-heading: 0.86;
  --tracking-heading: -2.94px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 0.84;
  --tracking-heading-lg: -4px;
  --text-display: 120px;
  --leading-display: 0.78;
  --tracking-display: -7.68px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-92: 92px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 40px;
  --element-gap: 12-24px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-other: 3px;
  --radius-badges: 18px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;
  --radius-buttonpill: 50px;

  /* Surfaces */
  --surface-cream-paper: #faf5f1;
  --surface-soft-linen: #fefffa;
  --surface-warm-sand: #e5e1d6;
  --surface-olive-grove: #3d4128;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #faf5f1;
  --color-soft-linen: #fefffa;
  --color-ink-black: #0e0f0a;
  --color-midnight-black: #0a0a0a;
  --color-pure-white: #ffffff;
  --color-warm-sand: #e5e1d6;
  --color-olive-grove: #3d4128;
  --color-chartreuse-spark: #e1f079;
  --color-terracotta-cta: #de7653;
  --color-coral-outline: #e7573d;
  --color-deep-olive: #24280f;

  /* Typography */
  --font-times-now: 'Times Now', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-fine-print: 10px;
  --leading-fine-print: 1.2;
  --text-micro: 12px;
  --leading-micro: 1.2;
  --text-caption: 14px;
  --leading-caption: 1.33;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.13px;
  --text-body: 18px;
  --leading-body: 1.36;
  --tracking-body: -0.18px;
  --text-subheading: 40px;
  --leading-subheading: 1;
  --tracking-subheading: -1px;
  --text-heading-sm: 50px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -2px;
  --text-heading: 60px;
  --leading-heading: 0.86;
  --tracking-heading: -2.94px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 0.84;
  --tracking-heading-lg: -4px;
  --text-display: 120px;
  --leading-display: 0.78;
  --tracking-display: -7.68px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-92: 92px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 50px;
}
```
