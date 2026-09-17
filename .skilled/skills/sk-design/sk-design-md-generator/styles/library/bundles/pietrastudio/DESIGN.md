# Pietrastudio — Style Reference
> sunlit AI workshop on cream paper

**Theme:** light

Pietra is a warm-light productivity canvas where AI feels like a sunlit desk — cream-white surfaces, soft peach ambient washes, and one vivid coral action color that cuts through the warmth. The type system is paired and confident: a tall, tightly-tracked display face (Attila) shouts the headlines while a neutral grotesque (Labil Grotesk) handles everything else at near-tight tracking. Components sit on the page with soft, layered shadows — inset highlights and warm-tinted drop shadows give cards a paper-on-paper feel rather than digital elevation. Color is deployed as function: coral for the one true primary action, a palette of saturated gradient swatches (purple, blue, green, magenta, sunset) used as category tags on feature cards, and otherwise a near-monochrome system of grays. Density is comfortable with generous vertical breathing room between sections, max-width contained layouts, and 12-16px card padding inside 12-20px radii.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Coral | `#ff5c3c` | `--color-ember-coral` | Primary CTA fill, active nav, brand accent — a warm vermillion that sits forward against cream backgrounds without feeling aggressive |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark fills — the base everything else rests on |
| Ink Black | `#000000` | `--color-ink-black` | Primary heading text, body text, dominant borders — the workhorse contrast color used at 1750+ instances |
| Cream Paper | `#f8f6f2` | `--color-cream-paper` | Warm off-white surface layer for elevated cards and section bands — gives the page its sunlit warmth without leaving pure white |
| Soft Cream | `#fffbe7` | `--color-soft-cream` | Accent card surface, tinted feature panels — a warmer cream for highlight cards that need to stand apart from the base canvas |
| Charcoal | `#141414` | `--color-charcoal` | Secondary text, link text, heavy borders — softer than pure black for UI chrome and metadata |
| Iron Gray | `#1f2026` | `--color-iron-gray` | Body text, input borders, body chrome — near-black with a cool cast for dense informational UI |
| Mid Gray | `#6b6b6b` | `--color-mid-gray` | Muted body text, helper text, icon borders — the primary de-emphasized text tone |
| Silver | `#c4c4c4` | `--color-silver` | Hairline borders, dividers, placeholder text — light structural lines that recede |
| Slate | `#333333` | `--color-slate` | Deep body text, secondary headings — sits between charcoal and black for weighted text that isn't headline-level |
| Ash | `#e8e8ea` | `--color-ash` | Shadow tint, ultra-light dividers, ghost surfaces — the near-invisible layer |
| Goldenrod | `#f9e070` | `--color-goldenrod` | Category tag accent, feature card variant — warm yellow that pairs with coral gradients |
| Sage | `#57ad6a` | `--color-sage` | Category tag accent, feature card variant — natural green for growth/scale categories |
| Sunset Wash | `linear-gradient(43deg, rgb(249, 219, 219) 26.92%, rgb(253, 241, 223) 77.91%)` | `--color-sunset-wash` | Hero ambient background wash — a barely-there pink-to-peach atmospheric tint behind the headline |
| Category — Royal | `radial-gradient(127.58% 127.5% at 25.04% 20.84%, rgb(83, 90, 255) 0%, rgb(125, 51, 247) 100%)` | `--color-category-royal` | Feature card gradient pair — deep purple-to-violet category swatch for strategy/planning tags |
| Category — Sky | `radial-gradient(208.48% 182.32% at -0.04% -0.23%, rgb(65, 175, 255) 0%, rgb(72, 101, 255) 100%)` | `--color-category-sky` | Feature card gradient pair — cyan-to-blue category swatch for content/creation tags |
| Category — Verdant | `radial-gradient(213.37% 213.37% at 27.54% 0%, rgb(113, 206, 81) 0%, rgb(50, 203, 139) 100%)` | `--color-category-verdant` | Feature card gradient pair — lime-to-emerald category swatch for sales/growth tags |
| Category — Magenta | `radial-gradient(127.58% 127.5% at 25.04% 20.84%, rgb(200, 83, 255) 0%, rgb(247, 51, 239) 100%)` | `--color-category-magenta` | Feature card gradient pair — violet-to-magenta category swatch for analysis/insights tags |
| Category — Sunrise | `linear-gradient(43deg, rgb(255, 74, 74) 26.92%, rgb(233, 170, 75) 77.91%)` | `--color-category-sunrise` | Feature card gradient pair — red-to-gold category swatch for benchmarking/launch tags |

## Tokens — Typography

### Attila-Bold — Display headlines — the tall, tightly-tracked serif/grotesque hybrid used for hero and section headings at 32-48px. The negative tracking (-0.02em) is signature: letters pull close at large sizes creating a dense, editorial block of text · `--font-attila-bold`
- **Substitute:** Druk Wide, Tiempos Headline, or GT Sectra
- **Weights:** 400
- **Sizes:** 32px, 40px, 48px
- **Line height:** 1.00, 1.10, 1.20
- **Letter spacing:** -0.02em at 48px, -0.013em at 40px, -0.02em at 32px
- **Role:** Display headlines — the tall, tightly-tracked serif/grotesque hybrid used for hero and section headings at 32-48px. The negative tracking (-0.02em) is signature: letters pull close at large sizes creating a dense, editorial block of text

### Attila Sans Uniform — Largest display moments — uniform-width variant for the biggest headlines where letterform consistency matters more than contrast · `--font-attila-sans-uniform`
- **Substitute:** Druk Wide Bold, Inter Black
- **Weights:** 700
- **Sizes:** 48px, 50px
- **Line height:** 1.20
- **Letter spacing:** -0.02em
- **Role:** Largest display moments — uniform-width variant for the biggest headlines where letterform consistency matters more than contrast

### Labil-Bold — Bold body emphasis and mid-weight headings — the weight-400 bold variant that gives inline emphasis and sub-headings without switching families · `--font-labil-bold`
- **Substitute:** Inter Bold, GT America Mono Bold
- **Weights:** 400
- **Sizes:** 14px, 16px, 20px, 48px
- **Line height:** 1.00, 1.13, 1.20
- **Letter spacing:** -0.02em at 48px, -0.01em at 16-20px
- **Role:** Bold body emphasis and mid-weight headings — the weight-400 bold variant that gives inline emphasis and sub-headings without switching families

### Labil Grotesk — Primary body and UI font — the workhorse grotesque used for body copy, buttons, inputs, cards, and navigation at 12-24px. Tracking sits at -0.01em throughout, a subtle but consistent tighten · `--font-labil-grotesk`
- **Substitute:** Inter, GT America, Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 15px, 16px, 20px, 24px
- **Line height:** 1.00, 1.20, 1.57
- **Letter spacing:** -0.01em
- **Role:** Primary body and UI font — the workhorse grotesque used for body copy, buttons, inputs, cards, and navigation at 12-24px. Tracking sits at -0.01em throughout, a subtle but consistent tighten

### Labil-Regular — Lighter body weight for body copy and descriptions — weight 300 for long-form paragraphs creates breathing space; weight 400 for compact UI. The 0.143em tracking on some instances suggests uppercase labels or tag text · `--font-labil-regular`
- **Substitute:** Inter, GT America
- **Weights:** 300, 400
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px
- **Line height:** 1.00, 1.13, 1.20, 1.50
- **Letter spacing:** -0.01em body, 0.143em uppercase labels
- **Role:** Lighter body weight for body copy and descriptions — weight 300 for long-form paragraphs creates breathing space; weight 400 for compact UI. The 0.143em tracking on some instances suggests uppercase labels or tag text

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.2 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.24px | `--text-heading-sm` |
| heading | 32px | 1.1 | -0.64px | `--text-heading` |
| heading-lg | 40px | 1.1 | -0.52px | `--text-heading-lg` |
| display | 48px | 1.1 | -0.96px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 124 | 124px | `--spacing-124` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| images | 16-20px |
| inputs | 8px |
| buttons | 8px |
| featureCards | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(193, 194, 222, 0.2) 1px 1px 1px 0px inset, rgba(255,...` | `--shadow-subtle` |
| xl | `rgba(134, 137, 141, 0.2) 0px 0px 40px 0px` | `--shadow-xl` |
| lg | `rgba(239, 227, 225, 0.3) 5px 5px 24px 0px` | `--shadow-lg` |
| xl-2 | `rgba(133, 136, 140, 0.2) 0px 0px 40px 0px` | `--shadow-xl-2` |
| subtle-2 | `rgba(0, 0, 0, 0.02) 0px 2px 0px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 16-24px
- **Element gap:** 8-12px

## Components

### Coral Primary Button
**Role:** Main call-to-action across the site

Filled coral (#ff5c3c) background, white text, 8px radius, 12px 20px padding. Labil-Bold at 16px weight 400, tracking -0.01em. The single high-contrast action element on any page — appears as 'Start for free', 'Get started for free', and 'Book demo'. Subtle 0px 2px 0px rgba(0,0,0,0.02) shadow adds a faint pressed feel

### Outlined Ghost Button
**Role:** Secondary action paired with the primary

Transparent background, 1px charcoal (#141414) border, charcoal text, 8px radius, 12px 20px padding. Labil-Bold 16px. Used for 'Book demo' when it sits alongside a coral CTA

### Navigation Link Button
**Role:** Top-bar utility actions

Transparent background with no border, dark text. 'Book demo' and 'Sign in' sit as plain text links, while 'Start for free' is the filled coral button. 8px padding around text

### Hero Search/Input Field
**Role:** The central prompt input on the hero

Large white surface, 12px radius, 20-24px padding, subtle inset highlight shadow giving a paper-embedded feel. Placeholder text in mid-gray (#6b6b6b). A coral circular submit arrow sits right-aligned

### Feature Card — Gradient Category
**Role:** Product capability cards with colored category tags

White card surface, 12-16px radius, warm-tinted soft shadow (rgba(239,227,225,0.3) 5px 5px 24px). The category tag at the top-left is a rounded gradient swatch (Royal/Sky/Verdant/Magenta/Sunrise) with white text. Card contains a bold heading, description, and a small coral 'Learn more' link with arrow icon

### Logo Bar Section
**Role:** Social proof band

Full-width cream section (#f8f6f2 or similar warm tint) with centered 'Trusted by leading commerce teams' label in mid-gray, followed by a grid of grayscale brand logos. Logos sit at uniform height on the warm background — no card containers, just whitespace separation

### Integration Card
**Role:** Shows platform integrations

Cream-tinted card (#fffbe7) with 12px radius, containing 'The only AI that connects to your real time data' heading and a grid of small brand icons (Shopify, Klaviyo, Google, etc.) below. Soft warm shadow

### Model Selection Card
**Role:** Demonstrates AI model routing

White card with 12-16px radius, heading 'Picks the best model for the task', containing a list of model names (Gemini, Claude) with small colored icons and descriptive text. Clean list layout with subtle dividers

### Agent Card (Horizontal)
**Role:** Feature row showing AI agent capabilities

White surface card with warm-tinted soft shadow, 12-20px radius. Left side has a small colored category tag (coral/yellow/green), bold heading, description paragraph, and a coral 'Learn more' pill button. Right side shows a preview image or screenshot. Cards are arranged in a 3-column grid

### Navigation Bar
**Role:** Top site navigation

White or transparent bar, 60-72px height, Pietra wordmark left in Labil-Bold, center nav links (Products, Solutions, Resources, Help Videos, Pricing) in Labil Grotesk 14-15px, right-side actions (Book demo, Sign in text links, Start for free coral button). Sticky on scroll

### Tag / Category Label
**Role:** Small functional labels on cards

Pill-shaped (9999px radius), 4-6px vertical padding, 8-10px horizontal padding. Bold text at 12-14px. Appears in white-on-gradient for category tags, or in coral/yellow/green fills for status indicators

### Hero Gradient Background
**Role:** Atmospheric warm wash behind the hero headline

Full-bleed radial or linear gradient from soft pink (#f9dbdb) to warm cream (#fdf1df), creating a sunrise-like ambient glow. Sits behind the centered headline and input field. The warmth fades to white at the edges

### Decorative Floating Cards
**Role:** Overlapping capability preview cards in the hero

A fanned arrangement of 4-5 gradient-filled cards with white text, slightly rotated and overlapping behind/above the search input. Each card shows a different capability (strategy, benchmarking, GTM, market research, analysis) and uses one of the category gradients. This fanned cluster is the visual signature of the hero

## Do's and Don'ts

### Do
- Use the coral #ff5c3c for exactly one primary action per screen — never two coral CTAs competing
- Set display headlines in Attila-Bold at 40-48px with tracking -0.02em; the tight tracking is the editorial signature
- Apply the warm gradient swatch system (Royal, Sky, Verdant, Magenta, Sunrise) only to category tags and decorative cards — not to body text or backgrounds
- Layer shadows as inset highlights + warm-tinted drops: the cream-on-cream shadow is what separates cards from the canvas
- Use 12px radius as the default card radius, 8px for buttons and inputs, 9999px for tags — this three-tier radius system is the structural rhythm
- Keep body copy in Labil Grotesk at 16px with 1.5 line-height; the 0.143em uppercase tracking is reserved for small all-caps labels only
- Maintain a warm white palette: #ffffff for the page canvas, #f8f6f2 for elevated surfaces, #fffbe7 for accent cards — never introduce cool grays

### Don't
- Do not use coral for secondary actions, links, or decorative elements — it loses its action weight if scattered
- Do not use Attila for body copy or UI text — it is display-only and overwhelms at small sizes
- Do not apply the category gradient swatches as full card backgrounds or page sections — they are tag-sized accents
- Do not introduce drop shadows in cool gray tones; all shadows should carry the warm pink/cream tint to match the surface palette
- Do not use sharp 0px radii on cards or images — the rounded geometry is essential to the soft, paper-like feel
- Do not stack multiple saturated colors in a single component — one chromatic accent per element, with grayscale for everything else
- Do not use letter-spacing wider than -0.01em on body text; the system is consistently tight-tracked and loosening it breaks the type voice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background — the white paper everything sits on |
| 1 | Warm Wash | `#f8f6f2` | Section bands and elevated card backgrounds — a barely-warm off-white that adds atmosphere without leaving the light palette |
| 2 | Accent Cream | `#fffbe7` | Highlighted cards and feature panels — a warmer cream tint for elements that need to stand apart from the base canvas |
| 3 | Hero Atmosphere | `#fbeaf6` | Hero background ambient wash — soft pink-to-peach gradient for the top of the page |

## Elevation

- **Feature cards:** `rgba(239, 227, 225, 0.3) 5px 5px 24px 0px`
- **Primary buttons:** `rgba(0, 0, 0, 0.02) 0px 2px 0px 0px`
- **Inset surface input:** `rgba(193, 194, 222, 0.2) 1px 1px 1px 0px inset, rgba(255, 255, 255, 0.8) -1px -1px 1px 0px inset, rgb(255, 255, 255) 1px 1px 1px 0px inset, rgba(221, 223, 228, 0.5) 5px 5px 24px 0px`

## Imagery

Imagery is minimal and product-focused. The hero relies on a fanned cluster of gradient-filled capability cards overlapping the search input — no photography, no illustrations, just typographic cards as visual content. Brand logos in the social proof band are rendered grayscale on the warm cream background. Integration icons appear as small, clean monochrome marks in a grid. Product screenshots (when present) are cropped tightly to show the interface, not the full app. The visual language is essentially 'no imagery' in the traditional sense — the design IS the visual, built from type, gradient swatches, and warm surface washes.

## Layout

Max-width contained at ~1200px with centered content. The hero is a full-bleed warm gradient with a centered headline, supporting subtext, fanned gradient card cluster, large prompt input, and stacked CTAs. Below the fold, sections alternate between white and warm-cream bands with generous 80-120px vertical gaps. Feature sections use a 3-column card grid for agent cards, with a 2-column text-plus-visual layout for platform sections. The logo bar is a full-width warm-tinted band. Navigation is a centered top bar with left-aligned wordmark, center links, and right-aligned actions. No sidebar, no mega-menu — the nav stays compact and horizontal.

## Agent Prompt Guide

primary action: #ff5c3c (filled action)
Create a Primary Action Button: #ff5c3c background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
Quick Color Reference:
- text: #000000 (headlines, body)
- background: #ffffff (canvas), #f8f6f2 (elevated surface), #fffbe7 (accent card)
- border: #c4c4c4 (hairline), #141414 (strong)
- accent: #ff5c3c (coral, primary action only)
- category tag gradients: Royal #5b3af7, Sky #4160ff, Verdant #38c585, Magenta #c83ad6, Sunrise #ff4a4a

Example Component Prompts:


2. Create a feature agent card grid: 3 columns of white cards on #f8f6f2 section background, 80px section padding. Each card: white surface, 16px radius, warm-tinted shadow (rgba(239,227,225,0.3) 5px 5px 24px), 20px padding. Top-left: a gradient pill tag (e.g., Royal gradient, 9999px radius, white 12px bold text). Heading at 20px Labil-Bold weight 400, #000000. Description at 14px Labil-Regular weight 300, #6b6b6b. Bottom: a coral text link 'Learn more →' in 14px Labil-Bold, #ff5c3c. Cards separated by 24px gap.

3. Create a logo bar section: full-width #fffbe7 background, 60px vertical padding. Centered label 'Trusted by leading commerce teams' at 14px Labil-Regular weight 400, #6b6b6b, 0.143em tracking. Below: a responsive grid of 12 grayscale brand logos at uniform 24px height, evenly spaced with 40px gaps, arranged in 2 rows.

4. Create a navigation bar: 64px height, white background, subtle 1px bottom border #e8e8ea. Left: 'Pietra' wordmark in Labil-Bold 20px #000000. Center: nav links (Products, Solutions, Resources, Help Videos, Pricing) at 14px Labil Grotesk weight 500, #000000, with 32px horizontal gaps. Right: 'Book demo' and 'Sign in' as plain text links, then a coral filled button 'Start for free' with 8px radius, #ff5c3c fill, white 14px Labil-Bold text, 10px 16px padding.

5. Create an integration showcase card: #fffbe7 background, 20px radius, 24px padding, warm soft shadow. Heading at 24px Attila-Bold weight 400, #000000, letter-spacing -0.24px, reading 'The only AI that connects to your real time data'. Below: a 4×2 grid of small monochrome brand icons (32px) with 24px gaps, each on a subtle white circular background (40px diameter, #ffffff, 1px #e8e8ea border).

## Similar Brands

- **Linear** — Same max-width contained layout, tight-tracked display headlines, generous vertical rhythm, and a single high-contrast accent color against a near-monochrome system
- **Frame.io** — Warm cream surfaces, soft layered shadows, gradient category tags, and a editorial type pairing with bold display + clean grotesque body
- **Notion AI** — Light productivity-canvas feel with one warm action accent, comfortable density, and a focus on product cards rather than hero photography
- **Vercel** — Tight letter-spacing on large headlines, minimal color palette with a single bold action color, and a preference for showing product UI rather than illustrative imagery

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-coral: #ff5c3c;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-cream-paper: #f8f6f2;
  --color-soft-cream: #fffbe7;
  --color-charcoal: #141414;
  --color-iron-gray: #1f2026;
  --color-mid-gray: #6b6b6b;
  --color-silver: #c4c4c4;
  --color-slate: #333333;
  --color-ash: #e8e8ea;
  --color-goldenrod: #f9e070;
  --color-sage: #57ad6a;
  --color-sunset-wash: #fbeaf6;
  --gradient-sunset-wash: linear-gradient(43deg, rgb(249, 219, 219) 26.92%, rgb(253, 241, 223) 77.91%);
  --color-category-royal: #5b3af7;
  --gradient-category-royal: radial-gradient(127.58% 127.5% at 25.04% 20.84%, rgb(83, 90, 255) 0%, rgb(125, 51, 247) 100%);
  --color-category-sky: #4160ff;
  --gradient-category-sky: radial-gradient(208.48% 182.32% at -0.04% -0.23%, rgb(65, 175, 255) 0%, rgb(72, 101, 255) 100%);
  --color-category-verdant: #38c585;
  --gradient-category-verdant: radial-gradient(213.37% 213.37% at 27.54% 0%, rgb(113, 206, 81) 0%, rgb(50, 203, 139) 100%);
  --color-category-magenta: #c83ad6;
  --gradient-category-magenta: radial-gradient(127.58% 127.5% at 25.04% 20.84%, rgb(200, 83, 255) 0%, rgb(247, 51, 239) 100%);
  --color-category-sunrise: #ff4a4a;
  --gradient-category-sunrise: linear-gradient(43deg, rgb(255, 74, 74) 26.92%, rgb(233, 170, 75) 77.91%);

  /* Typography — Font Families */
  --font-attila-bold: 'Attila-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-attila-sans-uniform: 'Attila Sans Uniform', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil-bold: 'Labil-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil-grotesk: 'Labil Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil-regular: 'Labil-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.52px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -0.96px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-124: 124px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 16-24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-images: 16-20px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-featurecards: 20px;

  /* Shadows */
  --shadow-subtle: rgba(193, 194, 222, 0.2) 1px 1px 1px 0px inset, rgba(255, 255, 255, 0.8) -1px -1px 1px 0px inset, rgb(255, 255, 255) 1px 1px 1px 0px inset, rgba(221, 223, 228, 0.5) 5px 5px 24px 0px;
  --shadow-xl: rgba(134, 137, 141, 0.2) 0px 0px 40px 0px;
  --shadow-lg: rgba(239, 227, 225, 0.3) 5px 5px 24px 0px;
  --shadow-xl-2: rgba(133, 136, 140, 0.2) 0px 0px 40px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.02) 0px 2px 0px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-wash: #f8f6f2;
  --surface-accent-cream: #fffbe7;
  --surface-hero-atmosphere: #fbeaf6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-coral: #ff5c3c;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-cream-paper: #f8f6f2;
  --color-soft-cream: #fffbe7;
  --color-charcoal: #141414;
  --color-iron-gray: #1f2026;
  --color-mid-gray: #6b6b6b;
  --color-silver: #c4c4c4;
  --color-slate: #333333;
  --color-ash: #e8e8ea;
  --color-goldenrod: #f9e070;
  --color-sage: #57ad6a;
  --color-sunset-wash: #fbeaf6;
  --color-category-royal: #5b3af7;
  --color-category-sky: #4160ff;
  --color-category-verdant: #38c585;
  --color-category-magenta: #c83ad6;
  --color-category-sunrise: #ff4a4a;

  /* Typography */
  --font-attila-bold: 'Attila-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-attila-sans-uniform: 'Attila Sans Uniform', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil-bold: 'Labil-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil-grotesk: 'Labil Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil-regular: 'Labil-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.52px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-124: 124px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Shadows */
  --shadow-subtle: rgba(193, 194, 222, 0.2) 1px 1px 1px 0px inset, rgba(255, 255, 255, 0.8) -1px -1px 1px 0px inset, rgb(255, 255, 255) 1px 1px 1px 0px inset, rgba(221, 223, 228, 0.5) 5px 5px 24px 0px;
  --shadow-xl: rgba(134, 137, 141, 0.2) 0px 0px 40px 0px;
  --shadow-lg: rgba(239, 227, 225, 0.3) 5px 5px 24px 0px;
  --shadow-xl-2: rgba(133, 136, 140, 0.2) 0px 0px 40px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.02) 0px 2px 0px 0px;
}
```
