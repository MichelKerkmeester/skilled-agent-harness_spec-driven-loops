# Home — Style Reference
> Warm editorial atelier. Cream paper, charcoal ink, and one ember-orange period of emphasis — a job platform that feels like an art-book spread photographed under amber light.

**Theme:** light

Parallel operates as a warm editorial atelier: a cream-paper canvas (#e4dfd9) hosts product surfaces in white, photography is presented in full-bleed cinematic crops with deep blacks and amber-warm lighting, and the only chromatic punctuation is a small ember-orange dot that marks emphasis. Typography carries a dual-register system — a weight-500 editorial display face (Rules Font) for headlines and a neutral system sans-serif for everything functional — letting headings feel hand-set while the UI stays quiet and utility-driven. Components are physically restrained: 20px card radii, 8-12px button radii, hairline #c7c7c7 dividers, a single soft shadow for elevation, and pill-shaped toggles. The design vocabulary is closer to a magazine layout than a SaaS dashboard — generous breathing room, aligned text blocks, and photography treated as the hero, not the accent.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#e4dfd9` | `--color-cream-paper` | Page background canvas, hero overlays, editorial section backdrops — the warm off-white that sets the entire system apart from generic SaaS grays |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, product UI mockups, input fields, text on dark photography |
| Charcoal Ink | `#000000` | `--color-charcoal-ink` | Primary text, strong borders, icon strokes, logo wordmark — the maximum-contrast voice |
| Near Black | `#050505` | `--color-near-black` | Body text and heading color for subtle warmth below pure black |
| Pressed Graphite | `#171717` | `--color-pressed-graphite` | Filled button backgrounds, dark UI surfaces, photo overlay scrims |
| Slate | `#737373` | `--color-slate` | Secondary text, subtle heading borders, metadata — the 60% voice |
| Iron | `#4b4b4b` | `--color-iron` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Stone | `#999694` | `--color-stone` | Muted body text, caption-level copy, placeholder text |
| Pewter | `#666666` | `--color-pewter` | Hairline borders on low-emphasis elements, dividers |
| Fog | `#c7c7c7` | `--color-fog` | Hairline borders, subtle dividers, ghost outlines — the most frequent border color in the system |

## Tokens — Typography

### Rules Font — Editorial display face for all headings — the weight-500 medium is deliberately non-bold, creating a literary, hand-set quality rather than a SaaS marketing shout. Tight -0.02em letter-spacing at 69px tightens the large headline to a single confident line. Substitute: 'Söhne Breit', 'GT America', or 'Inter' at weight 500 · `--font-rules-font`
- **Substitute:** Söhne Breit Medium or GT America Medium
- **Weights:** 500
- **Sizes:** 28px, 69px
- **Line height:** 1.10, 1.40
- **Letter spacing:** -0.02em at all sizes (≈ -0.56px at 28px, -1.38px at 69px)
- **Role:** Editorial display face for all headings — the weight-500 medium is deliberately non-bold, creating a literary, hand-set quality rather than a SaaS marketing shout. Tight -0.02em letter-spacing at 69px tightens the large headline to a single confident line. Substitute: 'Söhne Breit', 'GT America', or 'Inter' at weight 500

### ui-sans-serif — System sans-serif for all functional text — body copy at 400/16px, UI labels and button text at 500, emphasized sub-labels at 600. The neutral system face keeps the interface quiet so the Rules Font headlines carry all the personality. Substitute: 'Inter', 'Söhne', or 'Geist' · `--font-ui-sans-serif`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 19px, 23px
- **Line height:** 1.20, 1.40, 1.50
- **Letter spacing:** -0.02em at all sizes
- **Role:** System sans-serif for all functional text — body copy at 400/16px, UI labels and button text at 500, emphasized sub-labels at 600. The neutral system face keeps the interface quiet so the Rules Font headlines carry all the personality. Substitute: 'Inter', 'Söhne', or 'Geist'

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | -0.28px | `--text-caption` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 19px | 1.4 | -0.38px | `--text-subheading` |
| heading-sm | 23px | 1.4 | -0.46px | `--text-heading-sm` |
| heading | 28px | 1.4 | -0.56px | `--text-heading` |
| display | 69px | 1.1 | -1.38px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 54 | 54px | `--spacing-54` |
| 58 | 58px | `--spacing-58` |
| 72 | 72px | `--spacing-72` |
| 74 | 74px | `--spacing-74` |
| 100 | 100px | `--spacing-100` |
| 122 | 122px | `--spacing-122` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| icons | 8px |
| inputs | 12px |
| buttons | 8px |
| pillButtons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.07) 0px 6px 27px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 24-32px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Navigation Bar
**Role:** Top-level site navigation

Transparent or cream background, logo 'parallel' in Rules Font weight 500 at 28px in Charcoal Ink on the left, pill-shaped Talent/Employers toggle in center (12px radius, 18px horizontal padding, weight 500), ghost 'Sign in' text link and filled 'Find work' button (Pressed Graphite background, white text, 12px radius) on the right. Height auto with comfortable vertical padding.

### Pill Toggle (Talent/Employers)
**Role:** Audience switcher

Segmented control with 12px radius, active tab has white background with subtle shadow rgba(0,0,0,0.07) 0px 6px 27px, inactive tab is transparent on cream. Text at 14px weight 500 in Charcoal Ink. 8px gap between segments, 18px horizontal padding per segment.

### Ghost Button (Sign in)
**Role:** Low-emphasis action

No background, no border, text only in Charcoal Ink or Iron at 14-16px weight 500. 8px horizontal padding, 8px vertical padding.

### Filled Dark Button (Find work / Read more)
**Role:** Primary action

Pressed Graphite (#171717) background, white text at 14-16px weight 500, 8px border-radius, 18px horizontal padding, 10px vertical padding. Optional subtle shadow rgba(0,0,0,0.07) 0px 6px 27px for elevation.

### Hero Search Input
**Role:** Primary discovery input

Full-width white surface with 12px border-radius, subtle border in Fog (#c7c7c7), 16-24px horizontal padding, placeholder text 'What are you looking for?' in Stone (#999694) at 16px. Circular arrow button on the right side, 40px diameter, Charcoal Ink background, white arrow icon.

### Secondary Text Link (I'm not sure)
**Role:** Tertiary action

No background, text only in Charcoal Ink at 14px weight 500, underline on hover. Sits centered below the search input with 8-12px gap.

### Hero Display Headline
**Role:** Page-level headline

Rules Font weight 500 at 69px, white text, line-height 1.10, letter-spacing -1.38px. Followed by an Ember Dot (#ff6a1f) as a period/accent — the single chromatic moment. Centered over full-bleed photography.

### Feature Card
**Role:** Product capability showcase

White surface (#ffffff) on cream canvas, 20px border-radius, 32px internal padding, subtle drop shadow for separation. Contains a product UI mockup (mini search, chat input, or profile card) at top and a heading + body text stack at bottom. Heading in Rules Font weight 500 at 23px, body in system sans-serif at 16px weight 400 in Slate.

### Product UI Mockup (embedded in cards)
**Role:** In-context product preview

Small-scale white card components nested inside feature cards — search bars, chat inputs, profile badges. Use 8-12px radii, 91% match-score badge in ember-orange or green, small profile avatars with work-experience metadata.

### Full-Bleed Image Card
**Role:** Cinematic content section

Edge-to-edge photograph with 16-20px border-radius, dark scrim overlay in Pressed Graphite at ~40% opacity, centered CTA button floating at bottom. Image fills the card entirely — no padding inside.

### 3D Brand Mark (Large P Logo)
**Role:** Brand identity element

Large metallic/silver 3D rendered 'P' logo, centered in cream section space. Functions as a visual anchor between text blocks — not a UI component but a signature brand artifact.

### Live Status Indicator (23,237 new jobs)
**Role:** Real-time data signal

Small Ember Dot (#ff6a1f) bullet followed by text in system sans-serif at 14px weight 500 in Charcoal Ink. Indicates liveness and scale without being aggressive.

### Section Heading Block
**Role:** Editorial section title

Rules Font weight 500 at 28px, Charcoal Ink, left-aligned, followed by body text block in system sans-serif at 16px in Slate. Max-width ~500px for comfortable reading measure.

### Job Tag Chips
**Role:** Categorical filters or suggested roles

Small pill-shaped tags with 9999px radius, white or cream background, 10-12px vertical padding, 14-18px horizontal padding, text at 14px weight 500. Border in Fog (#c7c7c7) at 1px.

## Do's and Don'ts

### Do
- Use Cream Paper (#e4dfd9) as the default page background for all non-photography sections — never switch to pure gray or pure white canvas
- Apply Rules Font weight 500 at 28px or 69px for all headlines, with -0.02em letter-spacing — never use weight 600+ or bold variants
- Set card border-radius to 20px for all card surfaces, and 8px for standard buttons, 12px for inputs, 9999px for pill toggles and tag chips
- Use the single Ember Dot (#ff6a1f) accent for live-status indicators, the period after hero headlines, and match-score badges — never apply it to large fills, backgrounds, or button states
- Set card padding to 32px on all feature cards and product surfaces
- Use Pressed Graphite (#171717) as the filled button background with white text for primary actions
- Maintain section gaps of 24-32px and element gaps of 8px to preserve the comfortable, editorial breathing rhythm

### Don't
- Don't introduce additional chromatic colors — the system is intentionally monochrome with one ember accent; adding blues, greens, or other hues breaks the editorial discipline
- Don't use bold (700+) or heavy weights for headlines — the Rules Font at weight 500 is the signature restraint
- Don't apply drop shadows beyond the single soft pattern rgba(0,0,0,0.07) 0px 6px 27px — avoid colored, multi-layer, or hard shadows
- Don't use pure black (#000000) as a filled button background when Pressed Graphite (#171717) is available — the slight warmth matters
- Don't set border-radius to 4px or 0px on cards or buttons — the 8-20px range is the system's tactile signature
- Don't use more than one chromatic element per viewport — the Ember Dot should feel like punctuation, not decoration
- Don't apply the 69px display size to subheadings or body text — reserve it for hero-level headlines only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#e4dfd9` | Base page canvas — the warm off-white that defines the entire system's atmosphere |
| 1 | Pure White | `#ffffff` | Card surfaces, product mockup containers, input fields — sits one step above the cream canvas |
| 2 | Pressed Graphite | `#171717` | Dark UI surfaces, photo scrims, filled button backgrounds |
| 3 | Charcoal Ink | `#000000` | Maximum-contrast overlay surfaces, deep photography zones |

## Imagery

Photography is the dominant visual element, presented in full-bleed cinematic crops with deep blacks and warm amber/incandescent lighting. Subjects are people in motion or candid states — dancers, workers, professionals — shot with shallow depth-of-field and warm color grading. Images are used as hero backgrounds (edge-to-edge, with text overlay in white), as content cards (with dark scrim overlays and floating CTAs), and as section dividers. No illustrations, no 3D product renders, no abstract graphics — the photography IS the visual identity. The 3D metallic P logo is the only non-photographic visual element, functioning as a brand artifact rather than a UI component. Icons throughout the UI are line-based, minimal stroke weight, monochrome in Charcoal Ink.

## Layout

Full-bleed hero with centered headline and search input overlaid on dark photography, transitioning to cream-paper editorial sections with generous max-width 1200px contained layouts. Feature cards arranged in 3-column grid on cream background. Section rhythm alternates between photographic full-bleed bands and quiet text-and-card blocks. Navigation is a top bar with transparent-to-cream behavior. Content blocks are consistently left-aligned with comfortable reading measure (~500-600px). The overall page reads top-to-bottom as: cinematic hero → editorial manifesto → product feature grid → photographic CTA section.

## Agent Prompt Guide

**Quick Color Reference:**
- Text: #000000 (primary) / #737373 (secondary) / #999694 (muted)
- Background: #e4dfd9 (cream canvas) / #ffffff (card surfaces)
- Border: #c7c7c7 (hairline) / #737373 (visible)
- Accent: #ff6a1f (ember dot — status indicators only)
- primary action: no distinct CTA color

**Example Component Prompts:**

1. Create a feature card: white background (#ffffff), 20px border-radius, 32px padding, subtle shadow rgba(0,0,0,0.07) 0px 6px 27px. Top section contains a mini product UI mockup (mini search bar with white surface, 12px radius). Heading 'Hyper personal matches' in Rules Font weight 500 at 23px, #000000, letter-spacing -0.46px. Body text 'No fake jobs, just fresh direct roles from company sites, tailored to you.' in system sans-serif at 16px weight 400, #737373.

2. Create a hero section: full-bleed dark photography background with warm amber lighting, text centered. Headline 'Find your life's work' in Rules Font weight 500 at 69px, white (#ffffff), letter-spacing -1.38px, followed by an Ember Dot (#ff6a1f) as a period. Subtext in system sans-serif at 19px weight 400, white at 90% opacity. Search input: white background, 12px radius, 24px padding, placeholder 'What are you looking for?' in #999694, with a 40px circular dark arrow button on the right.

3. Create a pill toggle: segmented control with 12px border-radius, cream background (#e4dfd9), active tab is white with shadow rgba(0,0,0,0.07) 0px 6px 27px. Labels 'Talent' and 'Employers' in system sans-serif at 14px weight 500, #000000. 18px horizontal padding, 10px vertical padding per segment, 2px gap between segments.

4. Create a full-bleed image card: edge-to-edge photograph with 20px border-radius, dark scrim overlay (#171717 at 40% opacity), centered button at bottom — 'Start Matching' in Pressed Graphite (#171717) background, white text, 8px radius, 18px horizontal padding.

5. Create a job tag chip: pill shape with 9999px radius, white background, 1px border in #c7c7c7, 10px vertical padding, 16px horizontal padding, text in system sans-serif at 14px weight 500, #000000.

## Similar Brands

- **Substack** — Same warm cream-paper aesthetic, editorial Rules-Font-equivalent headlines, and full-bleed photographic heroes with centered text overlay
- **Are.na** — Monochrome editorial platform with generous breathing room, weight-500 display headings, and photography treated as first-class content
- **Linear** — Restrained monochrome palette, single soft shadow pattern, and 8-20px border-radius system for cards and inputs
- **Notion** — Comfortable spacing rhythm, system sans-serif for body with a distinct display face for headings, and minimal elevation philosophy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #e4dfd9;
  --color-pure-white: #ffffff;
  --color-charcoal-ink: #000000;
  --color-near-black: #050505;
  --color-pressed-graphite: #171717;
  --color-slate: #737373;
  --color-iron: #4b4b4b;
  --color-stone: #999694;
  --color-pewter: #666666;
  --color-fog: #c7c7c7;

  /* Typography — Font Families */
  --font-rules-font: 'Rules Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.46px;
  --text-heading: 28px;
  --leading-heading: 1.4;
  --tracking-heading: -0.56px;
  --text-display: 69px;
  --leading-display: 1.1;
  --tracking-display: -1.38px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-54: 54px;
  --spacing-58: 58px;
  --spacing-72: 72px;
  --spacing-74: 74px;
  --spacing-100: 100px;
  --spacing-122: 122px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 24-32px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-icons: 8px;
  --radius-inputs: 12px;
  --radius-buttons: 8px;
  --radius-pillbuttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.07) 0px 6px 27px 0px;

  /* Surfaces */
  --surface-cream-paper: #e4dfd9;
  --surface-pure-white: #ffffff;
  --surface-pressed-graphite: #171717;
  --surface-charcoal-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #e4dfd9;
  --color-pure-white: #ffffff;
  --color-charcoal-ink: #000000;
  --color-near-black: #050505;
  --color-pressed-graphite: #171717;
  --color-slate: #737373;
  --color-iron: #4b4b4b;
  --color-stone: #999694;
  --color-pewter: #666666;
  --color-fog: #c7c7c7;

  /* Typography */
  --font-rules-font: 'Rules Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.46px;
  --text-heading: 28px;
  --leading-heading: 1.4;
  --tracking-heading: -0.56px;
  --text-display: 69px;
  --leading-display: 1.1;
  --tracking-display: -1.38px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-54: 54px;
  --spacing-58: 58px;
  --spacing-72: 72px;
  --spacing-74: 74px;
  --spacing-100: 100px;
  --spacing-122: 122px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.07) 0px 6px 27px 0px;
}
```
