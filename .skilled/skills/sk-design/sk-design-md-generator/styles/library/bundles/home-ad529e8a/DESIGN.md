# Home — Style Reference
> Expressive creative studio on warm blush paper

**Theme:** mixed

Moderne operates as a creative-zine-meets-SaaS: a warm blush-paper canvas (#f3eae5) hosts large confident Mabry Pro headlines, while a single full-bleed deep-indigo hero band (#000647) acts as the dramatic opening spread before the page returns to cream. The color system is deliberately polychrome — a riot of coral, violet, magenta, teal, and orange accents painted across expressive hand-drawn illustrations and gradient headline fills, never reduced to a single brand hue. Typography is oversized and weight-500, giving every section an editorial poster feel rather than a dashboard feel. UI chrome stays light: 4px radii, thin dark borders, ghost buttons on the dark hero, filled coral buttons on the light sections, and illustrations do the heavy emotional lifting.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Cream | `#f3eae5` | `--color-blush-cream` | Primary page canvas — warm off-white with a rosy undertone that gives every section a paper-stock feel rather than a digital white |
| Deep Indigo | `#000647` | `--color-deep-indigo` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces on the dark hero, button text fills, and inverse typography on dark bands |
| Graphite | `#3e3c43` | `--color-graphite` | Primary body text and high-emphasis headings on light surfaces — a near-black with a hint of warmth rather than a cold #000 |
| Mid Stone | `#7a7780` | `--color-mid-stone` | Muted secondary text, badge labels, and input helper copy |
| Coral Pop | `#ff7e85` | `--color-coral-pop` | Primary filled CTA background on light sections — the single warm action color that punctuates the cream canvas |
| Electric Violet | `#0e1889` | `--color-electric-violet` | Headline gradient anchor and brand-defining deep accent — used at the start of gradient text fills (violet → magenta → coral) |
| Magenta | `#dd59cf` | `--color-magenta` | Mid-stop in headline gradient fills — the vivid pink bridge between violet and coral that gives gradient headlines their signature tri-color arc |
| Sunset Coral | `#ff7399` | `--color-sunset-coral` | Gradient headline end-stop and accent strokes in illustrations — a hotter pink than Coral Pop, reserved for type treatments |
| Deep Teal | `#206871` | `--color-deep-teal` | Secondary brand anchor — used for headings and icon strokes, providing the cool counterpoint to all the warm pinks and corals |
| Bright Teal | `#118391` | `--color-bright-teal` | Lighter teal companion for heading treatments and badge icons |
| Persimmon | `#ffa541` | `--color-persimmon` | Illustration accent — a warm orange that appears in brush-stroke artwork and icon details |
| Muted Lilac | `#7c80ad` | `--color-muted-lilac` | Outlined/ghost link and button border color — the soft violet used for secondary text-link treatments throughout the page |
| Fern Green | `#40ac76` | `--color-fern-green` | Green state accent for badges, validation surfaces, and short status labels. |
| Bubblegum Wash | `#fdd7f5` | `--color-bubblegum-wash` | Decorative pastel surface — soft pink fill for feature-card backgrounds and illustration halos |
| Mint Wash | `#bdedd5` | `--color-mint-wash` | Decorative pastel surface — mint green fill used in feature illustration backgrounds |
| Peach Wash | `#fdd5c3` | `--color-peach-wash` | Decorative pastel surface — peach fill for illustration backgrounds and soft card zones |

## Tokens — Typography

### Mabry Pro — Display and heading typeface — the brand-defining font. Used at 43–83px for section headlines (with tight 0.93–1.06 line-heights creating a poster-like density) and at 16–20px with positive 0.2em tracking for nav items, buttons, and labels. The 0.2em tracking on UI text is signature: it makes even small text feel intentional and editorial rather than utilitarian. · `--font-mabry-pro`
- **Substitute:** Inter, General Sans, or Suisse Int'l
- **Weights:** 500
- **Sizes:** 16, 19, 20, 27, 43, 52, 56, 69, 83
- **Line height:** 0.93, 0.95, 1.00, 1.02, 1.06, 1.20
- **Letter spacing:** 0.2em at 16-20px; tight/near-zero at display sizes 43-83px
- **Role:** Display and heading typeface — the brand-defining font. Used at 43–83px for section headlines (with tight 0.93–1.06 line-heights creating a poster-like density) and at 16–20px with positive 0.2em tracking for nav items, buttons, and labels. The 0.2em tracking on UI text is signature: it makes even small text feel intentional and editorial rather than utilitarian.

### Helvetica Neue — Body and UI text — paragraph copy at 16–18px/1.40–1.56, card descriptions at 14–15px, and supporting subheadings at 20–26px. The system fallback pairing keeps body text neutral so the Mabry Pro headlines can carry the brand voice. · `--font-helvetica-neue`
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 15, 16, 18, 20, 22, 26
- **Line height:** 1.07, 1.18, 1.19, 1.20, 1.33, 1.40, 1.56
- **Role:** Body and UI text — paragraph copy at 16–18px/1.40–1.56, card descriptions at 14–15px, and supporting subheadings at 20–26px. The system fallback pairing keeps body text neutral so the Mabry Pro headlines can carry the brand voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.56 | — | `--text-caption` |
| body | 16px | 1.56 | — | `--text-body` |
| body-lg | 18px | 1.33 | — | `--text-body-lg` |
| subheading | 22px | 1.2 | — | `--text-subheading` |
| heading-sm | 27px | 1.2 | — | `--text-heading-sm` |
| heading | 43px | 1.06 | — | `--text-heading` |
| heading-lg | 56px | 1.02 | — | `--text-heading-lg` |
| display | 83px | 0.95 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| badges | 4px |
| inputs | 4px |
| buttons | 4px |
| featuredCards | 15px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Hero CTA — Coral Filled Button
**Role:** Primary action on the light cream sections and gradient feature blocks

Filled button, background #ff7e85 (Coral Pop), white text, 4px radius, 18px vertical padding × 20px horizontal padding. Text is Mabry Pro weight 500 at 16–19px with the 0.2em tracking — the positive letter-spacing on button text is signature and must not be removed.

### Hero Ghost Button — On Indigo
**Role:** Secondary action on the dark indigo hero

Ghost/outlined button on the #000647 background. 1px white border, white text, 4px radius, 18×20px padding, Mabry Pro 16px weight 500 with 0.2em tracking. No fill — lets the dark background show through.

### Top Navigation Bar
**Role:** Persistent header on the indigo hero

Sits on the #000647 hero band. Logo (circular mascot mark) at far left, centered nav links (Overview, Solutions, Pricing, Insight of the Day, Login) in white Mabry Pro 16px weight 500 with 0.2em tracking, and the ghost 'Get a Demo' button at far right. Generous horizontal padding around all items.

### Gradient Headline
**Role:** Section-defining headlines on light sections

Mabry Pro weight 500 at 43–56px, line-height 1.02–1.06. Fill is a left-to-right CSS gradient running Electric Violet (#0e1889) → Magenta (#dd59cf) → Sunset Coral (#ff7399). This tri-color gradient is the brand's signature text treatment and should appear on at least one headline per page section.

### Hero Display Headline
**Role:** The opening headline on the indigo hero

Mabry Pro weight 500 at 69–83px, pure white (#ffffff), tight line-height 0.93–0.95. Sits on the left half of the hero split, with the subtext paragraph in a lighter blue-gray beneath it.

### Feature Card
**Role:** Three-column feature blocks on the light canvas

No card background — the cards are content-only blocks on the blush canvas. Each card has a small circular illustration (48–64px) at the top, a bold heading in Mabry Pro 20–22px weight 500, and body copy in Helvetica Neue 14–15px at 1.40 line-height. Generous vertical spacing between cards (40–60px). No visible border or shadow.

### Split Section — Text + Illustration
**Role:** Alternating content bands below the hero

Two-column layout (approximately 50/50). One column holds a large expressive hand-drawn illustration, the other holds a gradient headline (43–56px Mabry Pro) and a paragraph of body copy (16–18px Helvetica Neue, #3e3c43). Sections alternate illustration-left/text-right and vice versa for visual rhythm.

### Illustration Panel
**Role:** Decorative visual content in every section

Large hand-drawn illustrations occupying roughly half the viewport width. Style is expressive and surreal — characters with exaggerated features, brush-stroke fills, and saturated coral/pink/violet/teal palettes. Illustrations bleed to section edges with no border or frame.

### Success Badge
**Role:** Status indicators in cards and lists

Fern Green (#40ac76) border, Fern Green text or white-on-green fill, 4px radius, 12px vertical × 20px horizontal padding, Mabry Pro or Helvetica Neue 14px weight 500. Small and unobtrusive — acts as a status dot rather than a focal element.

### Text Link
**Role:** Inline and standalone link treatments

Muted Lilac (#7c80ad) underlined text in Helvetica Neue 16px. 1px border-bottom in the same lilac for the link underline. The lilac is deliberately desaturated — links should not compete with the gradient headlines for attention.

### Input Field
**Role:** Form inputs (email capture, search)

1px border in #cfc7c5 (light stone) or #7a7780, 4px radius, 1–2px vertical padding, white or cream background. Placeholder text in #7a7780. Minimal chrome — no focus ring color evidence, but should default to a subtle 1px shift to #0e1889 on focus.

## Do's and Don'ts

### Do
- Use the tri-color gradient (Electric Violet → Magenta → Sunset Coral) on at least one headline per page section — it is the single most recognizable brand treatment
- Set hero display headlines at 69–83px in Mabry Pro weight 500 with 0.93–0.95 line-height — the tight leading is what makes the type feel poster-like
- Apply 0.2em letter-spacing to all Mabry Pro UI text (nav, buttons, labels) at 16–20px — without it the type reads as generic instead of editorial
- Keep all UI radii at 4px — the sharp 4px corners are the system default and should not be inflated to 8px or rounded to pills
- Pair the blush cream canvas (#f3eae5) with pure white card surfaces only — never use white as the page background, it kills the paper-stock feel
- Use Coral Pop (#ff7e85) as the only filled-button background on light sections — reserve the ghost white treatment for the indigo hero
- Let illustrations bleed to section edges and occupy at least 50% of split-section width — decorative restraint is not the brand

### Don't
- Do not add drop shadows to cards, buttons, or sections — the system relies on color contrast and the cream canvas for separation, not elevation shadows
- Do not use the pastel washes (#fdd7f5, #bdedd5, #fdd5c3) as full page backgrounds — they are decorative illustration zones only
- Do not mix in a second body font — Helvetica Neue is the only body face; all display and UI type is Mabry Pro
- Do not round buttons to 9999px pill shapes — the 4px radius is signature and must be preserved
- Do not use #000000 for body text — always use Graphite (#3e3c43) on light surfaces for a warmer, less harsh read
- Do not introduce a cool blue or gray CTA — the only filled-button color is the warm coral, and the page temperature should stay warm overall
- Do not apply the gradient fill to body copy or small text — it is reserved for headlines 27px and above, where the color stops have room to breathe

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Blush Canvas | `#f3eae5` | Base page background — the warm cream that all light sections sit on |
| 1 | Pure White Card | `#ffffff` | Elevated card surface on the dark hero band and isolated feature blocks |
| 2 | Indigo Stage | `#000647` | Full-bleed hero background — the dramatic dark opening section |
| 3 | Pastel Decorative | `#fdd7f5` | Soft pink illustration backgrounds and feature-card accent zones |

## Elevation

Moderne deliberately avoids drop shadows. Depth and separation are achieved entirely through color contrast — the cream canvas vs white cards, the indigo hero band vs the light body, and the coral CTA against warm neutrals. This flat, poster-like treatment is what gives the system its zine/editorial feel rather than a Material/iOS dashboard feel.

## Imagery

Hand-drawn expressive illustrations are the visual backbone of the page — not stock photography, not flat iconography, not 3D renders. The style is painterly with visible brush-stroke fills, surreal subject matter (characters with spiky colored hair, hands with eyes on the fingers, anthropomorphic objects), and saturated coral/pink/violet/teal palettes. Illustrations are large, section-spanning, and left to bleed to the canvas edge without frames or rounded masks. Icons are minimal — small circular avatars or simple line marks accompany feature cards, but the visual weight comes from the full illustrations. Photography does not appear. The illustration style deliberately evokes a creative zine or hand-painted poster rather than a corporate SaaS site.

## Layout

Full-bleed sections that alternate between dark and light bands. The hero is a full-width indigo (#000647) band with a 50/50 split: headline + CTA on the left, large illustration on the right. Below the hero, the page returns to the blush cream canvas with centered max-width ~1200px content. Feature sections follow a repeating pattern: a three-column feature-card row (icon + heading + body), then a two-column split section alternating illustration-left/text-right and text-left/illustration-right. No sidebar, no sticky header beyond the hero nav. Vertical rhythm is generous — 120px between major sections, 40–60px between content blocks within a section. Navigation is a single horizontal bar on the hero, not repeated on light sections.

## Agent Prompt Guide

## Quick Color Reference
- Canvas/background: #f3eae5 (blush cream)
- Hero background: #000647 (deep indigo)
- Card surface: #ffffff
- Primary text: #3e3c43 (graphite)
- Muted text: #7a7780 (mid stone)
- primary action: #ff7e85 (filled action)
- Accent: #0e1889 (electric violet) → #dd59cf (magenta) → #ff7399 (sunset coral) for gradient headlines

## 3 Example Component Prompts

1. Create a Primary Action Button: #ff7e85 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Gradient Headline Feature Block** — On #f3eae5 canvas. Headline at 52px Mabry Pro weight 500 with CSS background-clip text gradient: linear-gradient(90deg, #0e1889 0%, #dd59cf 50%, #ff7399 100%). Body paragraph at 16px Helvetica Neue weight 400, color #3e3c43, line-height 1.56, max-width 560px. No card chrome — text sits directly on the cream canvas.

3. **Three-Column Feature Row** — On #f3eae5 canvas. Three equal columns with 40px gap. Each column: 56px circular illustration at top (use pastel wash #fdd7f5, #bdedd5, or #fdd5c3 as fill), heading 22px Mabry Pro weight 500 color #3e3c43, body 15px Helvetica Neue color #7a7780 line-height 1.40. No borders, no backgrounds, no shadows.

## Similar Brands

- **Krea AI** — Same polychrome illustration-forward approach with a cream/warm canvas and large expressive artwork carrying the visual weight
- **Notion AI marketing pages** — Same editorial poster-style headlines paired with a warm neutral body, though Moderne is more illustration-heavy and colorful
- **Pitch (pitch.com)** — Same flat surface treatment with no drop shadows, oversized display type, and a single warm accent color against a cream canvas
- **Framer** — Same dual-band hero pattern (dark opening section returning to light body) and oversized gradient-free display type on a warm canvas
- **Linear** — Same confident oversized type and refusal of shadows, though Linear is dark-mode dominant where Moderne splits dark hero + light body

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-cream: #f3eae5;
  --color-deep-indigo: #000647;
  --color-pure-white: #ffffff;
  --color-graphite: #3e3c43;
  --color-mid-stone: #7a7780;
  --color-coral-pop: #ff7e85;
  --color-electric-violet: #0e1889;
  --color-magenta: #dd59cf;
  --color-sunset-coral: #ff7399;
  --color-deep-teal: #206871;
  --color-bright-teal: #118391;
  --color-persimmon: #ffa541;
  --color-muted-lilac: #7c80ad;
  --color-fern-green: #40ac76;
  --color-bubblegum-wash: #fdd7f5;
  --color-mint-wash: #bdedd5;
  --color-peach-wash: #fdd5c3;

  /* Typography — Font Families */
  --font-mabry-pro: 'Mabry Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.56;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.2;
  --text-heading: 43px;
  --leading-heading: 1.06;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.02;
  --text-display: 83px;
  --leading-display: 0.95;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 15px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-badges: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-featuredcards: 15px;

  /* Surfaces */
  --surface-blush-canvas: #f3eae5;
  --surface-pure-white-card: #ffffff;
  --surface-indigo-stage: #000647;
  --surface-pastel-decorative: #fdd7f5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-cream: #f3eae5;
  --color-deep-indigo: #000647;
  --color-pure-white: #ffffff;
  --color-graphite: #3e3c43;
  --color-mid-stone: #7a7780;
  --color-coral-pop: #ff7e85;
  --color-electric-violet: #0e1889;
  --color-magenta: #dd59cf;
  --color-sunset-coral: #ff7399;
  --color-deep-teal: #206871;
  --color-bright-teal: #118391;
  --color-persimmon: #ffa541;
  --color-muted-lilac: #7c80ad;
  --color-fern-green: #40ac76;
  --color-bubblegum-wash: #fdd7f5;
  --color-mint-wash: #bdedd5;
  --color-peach-wash: #fdd5c3;

  /* Typography */
  --font-mabry-pro: 'Mabry Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.56;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.2;
  --text-heading: 43px;
  --leading-heading: 1.06;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.02;
  --text-display: 83px;
  --leading-display: 0.95;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 15px;
}
```
