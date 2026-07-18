# Grammarly — Style Reference
> Thoughtful editor's desk — restrained, precise, one confident accent

**Theme:** light

Grammarly's design system reads like a considered editorial workspace: a near-white canvas, confident dark typography, and a single deep teal that signals action. The custom display face 'matter' (weight 670) carries a compressed, geometric authority at large sizes, while 'Glyph' handles body copy with a quieter, humanist warmth. Components are restrained — 8px corners, hairline borders, ghost controls, minimal elevation — letting the teal CTA and the occasional dark enterprise band do the emotional work. Surfaces are flat and paper-like; shadows are nearly absent. The palette is 90%+ achromatic, with teal appearing as functional punctuation for buttons, links, active states, and full-bleed brand sections.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Grammarly Teal | `#027e6f` | `--color-grammarly-teal` | Primary buttons, links, active nav, dark enterprise hero bands, decorative icon strokes — a deep botanical teal that reads as both professional and approachable against white and near-black surfaces |
| Midnight Navy | `#1f243c` | `--color-midnight-navy` | Headings, navigation text, body copy, card text, icon strokes, footer copy — the dominant dark color carrying nearly all prose |
| Ink Black | `#0e101a` | `--color-ink-black` | Display headings, high-emphasis body text, link text — slightly cooler/deeper than Midnight Navy, used for the heaviest type |
| Graphite | `#545454` | `--color-graphite` | Muted body text, secondary button labels, helper copy, icon strokes |
| Steel | `#707070` | `--color-steel` | Tertiary text, disabled labels, low-emphasis metadata |
| Silver | `#b7b7b7` | `--color-silver` | Disabled borders, placeholder icons, very low-emphasis strokes |
| Ash | `#d9d9d9` | `--color-ash` | Hairline borders, subtle dividers, input rest states |
| Fog | `#ebebeb` | `--color-fog` | Lighter hairline borders, checkbox outlines, secondary dividers |
| Cloud | `#f5f5f5` | `--color-cloud` | Subtle surface backgrounds, hover washes, secondary panels |
| Carbon | `#1c1c1c` | `--color-carbon` | Dark surface fills for footer or alternate bands — warmer than Ink Black |
| Slate | `#4d536e` | `--color-slate` | Button hover states, secondary icon tinting, muted UI chrome |
| Paper | `#ffffff` | `--color-paper` | Primary page background, card surfaces, button text on teal |

## Tokens — Typography

### Glyph — Primary UI and body typeface — a custom humanist sans with wider proportions and more open apertures than matter. Weight 400 for body, nav, buttons, labels; 700 for emphasis and subheadings. The 1.45 line-height is generous for reading comfort at 16px body size. · `--font-glyph`
- **Substitute:** Inter 400/700 (free) — close match in humanist warmth and screen legibility
- **Weights:** 400, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 22px
- **Line height:** 1.20, 1.25, 1.43, 1.44, 1.45, 1.50, 1.71, 2.29
- **Role:** Primary UI and body typeface — a custom humanist sans with wider proportions and more open apertures than matter. Weight 400 for body, nav, buttons, labels; 700 for emphasis and subheadings. The 1.45 line-height is generous for reading comfort at 16px body size.

### matter — Display and heading typeface — a custom geometric grotesque with a slight humanist warmth. Weight 670 (between bold and black) gives headlines visual weight without becoming heavy; the -0.0100em tracking and tight 1.09 line-height create a compressed, editorial feel. Used for h1–h3 and large stat numbers. · `--font-matter`
- **Substitute:** Söhne (paid) or Manrope 700/800 (free) — both share the geometric proportions and tight metrics
- **Weights:** 670
- **Sizes:** 20px, 36px, 46px, 52px
- **Line height:** 1.09, 1.11, 1.12, 1.20
- **Letter spacing:** -0.0100em
- **Role:** Display and heading typeface — a custom geometric grotesque with a slight humanist warmth. Weight 670 (between bold and black) gives headlines visual weight without becoming heavy; the -0.0100em tracking and tight 1.09 line-height create a compressed, editorial feel. Used for h1–h3 and large stat numbers.

### Inter — Secondary body in card contexts — appears in product UI cards and embedded components · `--font-inter`
- **Substitute:** Already free via Google Fonts
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **OpenType features:** `"cv08", "ss01"`
- **Role:** Secondary body in card contexts — appears in product UI cards and embedded components

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.45 | — | `--text-caption` |
| body-sm | 14px | 1.45 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | — | `--text-heading-sm` |
| heading | 36px | 1.12 | -0.36px | `--text-heading` |
| heading-lg | 46px | 1.11 | -0.46px | `--text-heading-lg` |
| display | 52px | 1.09 | -0.52px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 8px |
| cards | 8px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Primary Button (Teal Filled)
**Role:** Main conversion action — sign up, get started, subscribe

Background #027e6f, text #ffffff, border none, border-radius 8px, padding 12px 24px. Font: Glyph weight 700, 16px. Includes a right arrow (→) icon in white. No shadow. Hover deepens to ~#026058.

### Secondary Button (Outlined Dark)
**Role:** Alternative action — sign up with provider, secondary CTAs

Background #ffffff, text #0e101a, border 1px #0e101a, border-radius 8px, padding 12px 24px. Font: Glyph weight 700, 16px. Includes provider icon (Google G) to the left of label.

### Ghost Button (Outlined White on Dark)
**Role:** Secondary action on teal/dark enterprise bands

Background transparent, text #ffffff, border 1px #ffffff, border-radius 8px, padding 12px 24px. Font: Glyph weight 700, 16px. Used on dark enterprise hero alongside filled white or teal alternatives.

### Top Navigation Bar
**Role:** Primary site navigation

Background #ffffff, height ~64px, full-width with inner max-width 1200px. Left: Grammarly logo (teal circle + wordmark). Center: nav links (Product, Work, Education, Pricing, Resources) in Glyph 16px weight 400, #1f243c, with chevron-down indicators on items with dropdowns. Right: 'Contact Sales' text link, 'Log in' text link, 'Get Grammarly — it's free' teal filled button (8px radius, Glyph 700 14px).

### Hero Headline Block
**Role:** Above-the-fold headline + subtext + dual CTA

White background, centered layout. Headline: matter 670 at 52px, #0e101a, line-height 1.09, letter-spacing -0.52px. Subtext: Glyph 400 at 18px, #1f243c, max-width ~640px centered. CTAs stacked horizontally: teal filled 'Sign up — it's free →' and white outlined 'Sign up with Google'. Legal micro-copy below in Glyph 12px, #545454.

### Product Showcase Card (Triptych)
**Role:** Feature demonstration cards in a 3-column carousel

Background tinted gradient (teal-to-lavender, yellow-to-pink, etc.) with a white floating UI card on top. Each card has 8px radius, white background, and shows a sample Grammarly suggestion (underlined text, tone label, Accept/Dismiss buttons in teal). Carousel arrows on right edge.

### Logo Cloud (Trust Bar)
**Role:** Social proof — trusted by N organizations

White background, centered 'Trusted by 50,000 organizations and 40 million people' caption in Glyph 16px, #1f243c. Two rows of partner logos in monochrome (black or #1f243c), spaced with 48px row-gap. Logos are wordmarks with simple geometric marks.

### Enterprise Dark Hero Band
**Role:** Full-bleed teal section for enterprise messaging

Background #027e6f, full-width, padding 80px vertical. Eyebrow text 'For Enterprise' in Glyph 400 14px #ffffff, centered. Headline: matter 670 at 46px, #ffffff, centered. Body: Glyph 400 at 18px, #ffffff, max-width 720px centered. Two CTAs below: white outlined 'Explore Enterprise →' and white filled 'Contact Sales →'.

### Stat Card
**Role:** Quantified proof point within enterprise section

White background card with 1px #ebebeb border, 8px radius, padding 32px. Top: partner logo (grayscale). Middle: oversized stat number in matter 670 at 46px+, #027e6f. Bottom: descriptive label in Glyph 400 16px, #1f243c. Cards in horizontal row of 3-4.

### Inline Suggestion Tooltip
**Role:** Product demonstration of Grammarly suggestions

White card with 8px radius, 1px #ebebeb border, padding 16px. Header: small purple dot + 'Tone Suggestion' label in Glyph 12px, #545454. Suggestion word in matter 670, 20px, #0e101a. Context sentence in Glyph 400, 14px, #1f243c with underlined words in #027e6f. Footer: 'Accept' in #027e6f link, 'Dismiss' in #545454 link.

### Footer / Legal Microcopy
**Role:** Terms and privacy acknowledgment under CTAs

Centered text in Glyph 12px, #545454, line-height 1.45. Links in #027e6f (Terms, Privacy Policy, CA Notice). No background — sits directly on Paper white.

### Cookie Consent Banner
**Role:** Bottom-fixed cookie notice

White background, full-width bar with 1px top border in #ebebeb. Left: heading 'We use cookies' in Glyph 700 16px, #0e101a. Body in Glyph 400 14px, #1f243c. Right: two teal filled buttons 'Accept non-essential cookies' and 'Reject non-essential cookies', stacked, 8px radius. Bottom-center: 'Cookie Settings' and 'See our privacy policy' in #027e6f text links.

## Do's and Don'ts

### Do
- Use Grammarly Teal (#027e6f) exclusively for primary buttons, links, active nav states, and full-bleed brand bands — never as a decorative fill on cards or illustrations
- Set border-radius to 8px on all interactive surfaces (buttons, nav items, tags, inputs, cards) — this is the single shape value that defines the system's personality
- Use matter weight 670 for all headings 20px and above; Glyph weight 700 for subheadings 22px and below — never mix these roles
- Apply -0.0100em letter-spacing to all matter headings and scale it proportionally (e.g. -0.52px at 52px, -0.36px at 36px) to maintain the compressed editorial feel
- Separate layers with 1px borders in #ebebeb or #d9d9d9 instead of box-shadows — Cloud (#f5f5f5) backgrounds work for subtle section alternation
- Keep body copy at 16px with 1.5 line-height in Glyph 400; never go below 14px for any user-facing text
- Use white outlined buttons (1px #ffffff border) as the secondary action on teal enterprise bands — never use a second teal shade

### Don't
- Don't use drop shadows or elevation effects — the system is deliberately flat; use color contrast and hairline borders instead
- Don't introduce additional accent colors beyond Grammarly Teal — the 90%+ achromatic palette is the system's defining trait
- Don't use matter at body sizes (16px or below) — it's a display face with tight metrics that become illegible at small sizes; switch to Glyph
- Don't use fully rounded (9999px) or large radii (20px+) on standard components — 8px is the only correct radius for buttons, cards, and tags
- Don't place teal text on teal backgrounds, or Midnight Navy text on Ink Black — maintain the high-contrast pairings the contrast data confirms
- Don't use centered layouts for anything other than hero blocks and modals — feature sections and card grids should be left-aligned or grid-based
- Don't add gradients, illustrations, or decorative imagery to standard component surfaces — product screenshots and the teal band carry the only visual color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Primary page background |
| 1 | Cloud | `#f5f5f5` | Subtle alternating section backgrounds, hover washes |
| 2 | Card White | `#ffffff` | Elevated card surfaces with hairline borders |
| 3 | Grammarly Teal Band | `#027e6f` | Dark enterprise hero sections, full-bleed brand bands |

## Elevation

- **Cards:** `none — use 1px #ebebeb border and 8px radius instead of shadows`
- **Stat Cards (on dark bands):** `none — white card on teal background achieves separation through color contrast alone`

## Imagery

Photography and illustration are minimal. The primary visual device is pastel-tinted gradient backgrounds (soft teal-to-lavender, yellow-to-pink) behind floating white product UI cards in the hero carousel — these feel like editorial spreads rather than SaaS dashboards. Partner logos in the trust bar are monochrome wordmarks, never in brand colors. Product screenshots are tightly cropped UI mockups with no surrounding context, letting the suggestion tooltips (underline, tone labels, Accept/Dismiss) tell the story. Icons in the interface are simple geometric shapes — the Grammarly G mark, chevrons, arrows, and circle indicators — all in Midnight Navy or Teal, no multicolor iconography. The overall density is text-dominant: the system trusts typography and whitespace to create hierarchy over visual decoration.

## Layout

Page model is max-width 1200px centered with full-bleed bands. The hero is a centered headline stack on white Paper, followed by a 3-column product showcase carousel. Sections alternate: white Paper → logo cloud (white) → white feature section with right-aligned product card → full-bleed Grammarly Teal enterprise band with centered text and a row of stat cards. Navigation is a minimal top bar with logo left, centered links with chevron dropdowns, and a teal CTA anchored right. Section vertical rhythm is generous: 80px gaps between major sections, 32px card padding, 16px element gaps inside cards. The layout reads as a long-form editorial page — scrolling reveals alternating quiet white bands and one confident teal declaration, with stat cards providing quantitative punctuation.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0e101a (headings) / #1f243c (body)
- background: #ffffff (primary), #f5f5f5 (subtle), #027e6f (brand bands)
- border: #ebebeb (hairline), #d9d9d9 (dividers)
- accent: #027e6f (Grammarly Teal)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. *Hero headline block*: White Paper background. Headline 'Transform your writing' in matter weight 670, 52px, #0e101a, letter-spacing -0.52px, line-height 1.09. Subtext in Glyph 400, 18px, #1f243c, max-width 640px centered. Two CTAs side by side: teal filled 'Get started — it's free →' (#027e6f bg, #ffffff text, 8px radius, 12px 24px padding, Glyph 700 16px) and white outlined 'Sign up with Google' (#ffffff bg, 1px #0e101a border, #0e101a text, 8px radius).
2. *Enterprise dark band*: Full-bleed #027e6f background, 80px vertical padding. Eyebrow 'For Enterprise' in Glyph 400 14px #ffffff. Headline in matter 670, 46px, #ffffff, centered. Body in Glyph 400 18px #ffffff, max-width 720px. Two CTAs: white outlined 'Explore Enterprise →' and white filled 'Contact Sales →', both 8px radius, 12px 24px padding.
3. *Stat card*: White background, 1px #ebebeb border, 8px radius, 32px padding. Partner logo top-left in grayscale. Stat number '20 days' in matter 670, 46px, #027e6f. Label 'saved annually per user' in Glyph 400 16px #1f243c.
4. *Suggestion tooltip card*: White background, 1px #ebebeb border, 8px radius, 16px padding. Purple dot + 'Tone Suggestion' label in Glyph 12px #545454. Suggestion word 'Confident' in matter 670, 20px, #0e101a. Context sentence in Glyph 400 14px #1f243c with key phrase underlined in #027e6f. Footer: 'Accept' in #027e6f and 'Dismiss' in #545454.
5. *Top navigation*: White background, 64px height, max-width 1200px inner. Grammarly logo (teal circle + wordmark) left. Nav links (Product, Work, Education, Pricing, Resources) in Glyph 400 16px #1f243c, with chevron-down icons. Right: 'Contact Sales' and 'Log in' text links in #1f243c, then teal filled 'Get Grammarly — it's free' button (8px radius, Glyph 700 14px, #027e6f bg, #ffffff text).

## Shape Philosophy

The system uses 8px as its single shape constant — applied to buttons, nav items, tags, inputs, and cards. This 8px radius is deliberately moderate: not sharp enough to feel corporate/utilitarian, not rounded enough to feel playful/consumer. It signals 'considered professional tool' — closer to Linear or Notion than to a consumer app. The rare exceptions are product demo cards (8px) and the triptych showcase cards (8px with floating offset). Never use pill shapes (9999px) or large radii (20px+) — those would break the editorial restraint.

## Type Pairing Logic

The matter + Glyph pairing is the system's most distinctive choice. matter (weight 670 only) is reserved for display sizes 20px+ and carries the visual weight of headlines, stat numbers, and hero statements. Glyph (400/700) handles everything from 22px subheadings down to 12px captions. The contrast between matter's compressed geometric authority and Glyph's humanist warmth creates a two-register system: matter announces, Glyph explains. This is why the enterprise band uses matter at 46px for the headline but Glyph at 18px for the body — the same teal-on-teal hierarchy works because the typefaces themselves create the rhythm.

## Similar Brands

- **Notion** — Same restrained near-white canvas, minimal shadows, hairline 1px borders, and a single restrained accent color applied to CTAs and key surfaces
- **Linear** — Same editorial restraint — 8px radii, flat surfaces, tight geometric display typography paired with a humanist UI sans, and a confident single brand color
- **Figma** — Same pattern of one vivid brand accent against a near-white canvas, with a custom geometric display face for headings and a neutral sans for body
- **Webflow** — Same hairline-border card system with no shadows, generous 80px section gaps, and dark full-bleed enterprise bands breaking up light editorial sections
- **Mercury (banking)** — Same deep botanical color as a brand accent on white surfaces, with the same flat, paper-like component treatment and minimal elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-grammarly-teal: #027e6f;
  --color-midnight-navy: #1f243c;
  --color-ink-black: #0e101a;
  --color-graphite: #545454;
  --color-steel: #707070;
  --color-silver: #b7b7b7;
  --color-ash: #d9d9d9;
  --color-fog: #ebebeb;
  --color-cloud: #f5f5f5;
  --color-carbon: #1c1c1c;
  --color-slate: #4d536e;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-glyph: 'Glyph', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter: 'matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.45;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.12;
  --tracking-heading: -0.36px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.46px;
  --text-display: 52px;
  --leading-display: 1.09;
  --tracking-display: -0.52px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-w670: 670;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-3xl: 38px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 8px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-cloud: #f5f5f5;
  --surface-card-white: #ffffff;
  --surface-grammarly-teal-band: #027e6f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-grammarly-teal: #027e6f;
  --color-midnight-navy: #1f243c;
  --color-ink-black: #0e101a;
  --color-graphite: #545454;
  --color-steel: #707070;
  --color-silver: #b7b7b7;
  --color-ash: #d9d9d9;
  --color-fog: #ebebeb;
  --color-cloud: #f5f5f5;
  --color-carbon: #1c1c1c;
  --color-slate: #4d536e;
  --color-paper: #ffffff;

  /* Typography */
  --font-glyph: 'Glyph', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter: 'matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.45;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.12;
  --tracking-heading: -0.36px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.46px;
  --text-display: 52px;
  --leading-display: 1.09;
  --tracking-display: -0.52px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-3xl: 38px;
}
```
