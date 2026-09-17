# Claude — Style Reference
> Warm parchment printed artifact — ink on bone paper, clay as the only chromatic breath.

**Theme:** light

Claude presents a warm-paper editorial interface: off-white parchment canvas (#f8f8f6) replaces the usual cold-white SaaS backdrop, paired with a near-black warm charcoal (#121212) for typography that reads as ink on paper rather than pixels on glass. The system is deliberately monochrome — the only chromatic accent is clay orange (#d97757), used sparingly as a signature mark rather than a call-to-action flood. Typography is the hero: Anthropic Serif sets the emotional headlines (the rare serif in tech), Anthropic Sans carries everything else at restrained weights (400-580), creating a hierarchy through size and weight contrast rather than color. Surfaces are flat with generous corner radii (16-24px on cards, 8px on controls), minimal shadow, and hairline borders — the aesthetic of a printed document rather than a digital product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Parchment | `#f8f8f6` | `--color-bone-parchment` | Page canvas, large background areas, nav bar, secondary cards |
| Paper White | `#ffffff` | `--color-paper-white` | Elevated card surfaces, primary content surfaces above the canvas |
| Soft Stone | `#efeeeb` | `--color-soft-stone` | Nested card surfaces, subtle background variation, alternate section bands |
| Carbon Ink | `#121212` | `--color-carbon-ink` | Primary text, headings, icon fills — warm near-black rather than pure black |
| Graphite | `#373734` | `--color-graphite` | Secondary headings, button text, nav text — softer than carbon |
| Ashen | `#7b7974` | `--color-ashen` | Muted helper text, captions, fine print, disclaimer copy |
| Pebble | `#9c9a92` | `--color-pebble` | Tertiary text, copyright, very low-priority labels |
| Mist | `#b7b7b5` | `--color-mist` | Hairline nav dividers, subtle border lines |
| Chalk | `#e7e6e1` | `--color-chalk` | Decorative illustration fills, soft background tints |
| Obsidian | `#000000` | `--color-obsidian` | Footer background — only true black on the page |
| Clay | `#d97757` | `--color-clay` | Orange decorative accent for icons, marks, and small graphic details. Do not promote it to the primary CTA color |

## Tokens — Typography

### Anthropic Serif — Display and editorial headlines (Explore plans, Think fast build faster). The serif is the brand signature — rare in AI/tech product UI; here it signals thoughtfulness and editorial confidence rather than software utility. · `--font-anthropic-serif`
- **Substitute:** Source Serif 4, Charter, Georgia
- **Weights:** 400
- **Sizes:** 24px, 30px
- **Line height:** 1.20-1.33
- **Letter spacing:** normal
- **Role:** Display and editorial headlines (Explore plans, Think fast build faster). The serif is the brand signature — rare in AI/tech product UI; here it signals thoughtfulness and editorial confidence rather than software utility.

### Anthropic Sans — All interface text: body copy, nav, buttons, cards, links, labels. Weight 580 is the heaviest; weight 400 dominates. The whisper-to-medium weight range creates hierarchy through contrast rather than heaviness — headlines don't shout at 800, they speak at 580. · `--font-anthropic-sans`
- **Substitute:** Inter, IBM Plex Sans, system-ui
- **Weights:** 400, 500, 550, 580, 600
- **Sizes:** 11px, 12px, 14px, 15px, 16px, 24px
- **Line height:** 1.33-1.63
- **Letter spacing:** normal
- **Role:** All interface text: body copy, nav, buttons, cards, links, labels. Weight 580 is the heaviest; weight 400 dominates. The whisper-to-medium weight range creates hierarchy through contrast rather than heaviness — headlines don't shout at 800, they speak at 580.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 30px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 16px |
| inputs | 8px |
| buttons | 8px |
| elevatedCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.04) 0px 4px 20px 0px` | `--shadow-lg` |
| lg-2 | `oklab(0.431435 -0.02915 -0.125723 / 0.1) 0px 4px 24px 0px` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 32px
- **Element gap:** 8-12px

## Components

### Filled Dark Button
**Role:** Primary call-to-action on light surfaces

Dark carbon fill (#121212 or near-black), warm white text (#f8f8f6 or #fff), 8px radius, 8px vertical / 20px horizontal padding, 15px Anthropic Sans weight 500. The warmth of the text color on dark fill (f8f8f6, not pure white) keeps the button from feeling like a generic dark UI element.

### Pill Navigation Button
**Role:** Top-level nav links in header bar

Transparent background, Graphite (#373734) text, no border, 8px radius, 15px sans weight 500. Sits on the Bone Parchment canvas (#f8f8f6) with generous horizontal padding. The nav bar is minimal — logo left, links centered or right, no heavy borders or fills.

### Pricing Tier Card
**Role:** Plan comparison card (Free, Pro, Max)

White (#ffffff) surface on Bone Parchment canvas, 24px radius, 32px padding all sides. Heading uses Anthropic Serif 24-30px. Price in Carbon Ink (#121212), description in Ashen (#7b7974). No shadow by default — a soft 4px 24px shadow at oklab warmth appears on hover or featured tiers. Hairline 1px border at #e7e6e1 optional.

### Feature Benefit Card
**Role:** Compact card for feature lists within a plan

Soft Stone (#efeeeb) or Paper White (#ffffff) surface, 16px radius, generous internal padding (24-32px). Checkmark icons in Carbon Ink, body text at 14px in Graphite. Flat — no shadow. Creates a layered paper effect against the canvas.

### Editorial Section Header
**Role:** Section title with the Anthropic Serif treatment

Anthropic Serif 30px weight 400, line-height 1.2, Carbon Ink (#121212). Followed immediately by a short Ashen (#7b7974) body sentence at 16px. Generous 64-80px margin-top from the previous section.

### Footer Band
**Role:** Dark site footer

Obsidian (#000000) background — the only true black on the page, creating a deliberate tonal break. Text in muted gray (#9c9a92), links in Pebble or lighter. Multi-column grid with product/resource/company groupings. Compact 14px sans throughout.

### Inline Link
**Role:** Text links within body copy

Color shifts between default (Graphite #373734) and hover (Carbon Ink #121212) with underline. No chromatic color — the system treats links as typography, not as colored emphasis. Transitions on color/background-color at 0.2s ease.

### Input Field
**Role:** Email input on sign-in and signup forms

Transparent or Paper White fill, 1px border at Pebble (#b7b7b5) or Mist, 8px radius, 14px sans. Focus ring uses the cds-focus-shadow pattern: inset page-color ring + outer accent ring + blue glow. No dramatic state color shift.

### FAQ Accordion Item
**Role:** Expandable question in FAQ section

Borderless or hairline divider between items, question text in Graphite (#373734) at 14-16px sans, body expands below in Carbon Ink (#121212). Anthropic Sans carries the entire interaction — no serif in the FAQ body. Generous 24px vertical padding per item.

### Clay Accent Mark
**Role:** Decorative brand flourish, not an interactive element

Small Clay orange (#d97757) marks — dots, ornaments, illustration accents — that serve as the single chromatic breath in an otherwise monochrome system. Never used for button fills or large backgrounds.

### Status Badge
**Role:** Small inline status indicators

8px radius, 11-12px sans weight 500, low-contrast background tint with Carbon Ink or Graphite text. Rarely chromatic — stays in the warm-gray family to match the editorial tone.

## Do's and Don'ts

### Do
- Use Bone Parchment (#f8f8f6) as the default page canvas — never pure white for large backgrounds.
- Set display headlines in Anthropic Serif weight 400 at 30px with line-height 1.2; let the serif do the work, not weight.
- Keep the palette monochrome — the only chromatic color is Clay (#d97757), reserved for decorative marks and editorial accents, never button fills.
- Use 24px radius for elevated cards and 16px for nested/secondary cards; 8px for all buttons, inputs, and nav controls.
- Maintain generous section spacing: 64-80px between major sections, 32px card padding, 8-12px between elements within a component.
- Pair Carbon Ink (#121212) text with Paper White (#ffffff) cards on Bone Parchment (#f8f8f6) for the layered paper effect.
- Reference warm grays (Graphite, Ashen, Pebble) for text hierarchy — never introduce a second chromatic for emphasis.

### Don't
- Don't introduce button fills in Clay orange or any chromatic color — actions stay dark on light or light on dark.
- Don't use pure black (#000000) for body text — Carbon Ink (#121212) is warmer and reads as ink, not void.
- Don't set headlines at weight 700+ — the system speaks at weight 580 max for sans and 400 for serif.
- Don't apply heavy shadows to cards — shadow appears only as a soft 4px 20-24px wash at low opacity, or not at all.
- Don't use cool blues or greens for accent or brand — the system is deliberately warm monochrome.
- Don't set large display headlines in Anthropic Sans — the serif is the signature, the sans is the utility.
- Don't add decorative gradients — the design rejects them in favor of flat, printed-paper surfaces.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#f8f8f6` | Base background for all pages — warm off-white parchment |
| 2 | Card Surface | `#ffffff` | Primary content cards elevated above the canvas |
| 3 | Nested Surface | `#efeeeb` | Secondary cards or sub-sections within a card |
| 4 | Dark Band | `#000000` | Footer — only dark surface, creates deliberate tonal break |

## Elevation

- **Feature Card (hover state):** `rgba(0, 0, 0, 0.04) 0px 4px 20px 0px`
- **Pricing Tier Card (featured/hover):** `oklab(0.431435 -0.02915 -0.125723 / 0.1) 0px 4px 24px 0px`

## Imagery

Imagery is sparse and editorial in tone. Product photography and illustrations appear full-bleed within hero or feature sections, treated with generous corner radii (16-24px) and no decorative borders. The Clay orange accent (#d97757) appears in select illustration details — hands, objects, ornamental marks — reinforcing the warm paper aesthetic. Icons are mono Carbon Ink, outlined or filled at consistent weight, never multicolor. The overall density is low: most sections are text-dominant with imagery appearing as punctuation rather than spectacle. No gradients, no glow effects, no 3D renders.

## Layout

Claude uses a max-width contained layout centered around 1200px on the Bone Parchment canvas. The hero pattern is a centered editorial headline in Anthropic Serif over generous whitespace, often paired with a full-bleed product image below the fold. Sections flow as alternating light bands — Bone Parchment canvas with white cards floating on it, occasional Soft Stone (#efeeeb) bands for visual rhythm. Content arrangement alternates between centered stacks (headlines, FAQs, CTAs) and asymmetric 2-column layouts (text-left/image-right feature blocks). Pricing uses a 3-column card grid (Free, Pro, Max) with elevated featured tier. Navigation is a minimal top bar: logo left, link cluster right, no heavy borders or fills. Vertical spacing is generous — 64-80px between sections, 32px within cards — creating a printed-page cadence rather than a dense product UI.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #121212
- Text (secondary): #373734
- Text (muted): #7b7974
- Background (canvas): #f8f8f6
- Background (card): #ffffff
- Border (hairline): #b7b7b5 or #e7e6e1
- Accent (decorative only): #d97757
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Pricing tier card*: White surface (#ffffff) on Bone Parchment canvas (#f8f8f6). 24px radius, 32px padding. Plan name in Anthropic Serif 24px weight 400 (#121212). Price in Anthropic Sans 24px weight 580 (#121212). Description in 14px sans (#7b7974). Filled dark button at bottom: #121212 background, #f8f8f6 text, 8px radius, 8px/20px padding, 15px sans weight 500.

2. *Editorial hero section*: Bone Parchment (#f8f8f6) background, no border. Headline in Anthropic Serif 30px weight 400 (#121212), line-height 1.2. Subtext in Anthropic Sans 16px weight 400 (#373734). 64-80px vertical padding above and below. Optional Clay (#d97757) accent dot or mark beside the headline.

3. *FAQ accordion item*: Transparent background, no card. Question in Anthropic Sans 16px weight 500 (#373734). Body answer in 14px weight 400 (#121212). Hairline 1px bottom border at #e7e6e1. 24px vertical padding. No chevron icon color — use Carbon Ink (#121212).

4. *Footer band*: Obsidian (#000000) full-width background. Three or four columns of links. Link text in Pebble (#9c9a92), 14px sans. Copyright in 12px sans (#9c9a92). 64px vertical padding. No icons in footer link rows.

5. *Dark navigation button*: Transparent fill, Graphite (#373734) text, 8px radius, 15px Anthropic Sans weight 500, 20px horizontal padding. Hover transitions to Carbon Ink (#121212) at 0.2s ease. No border, no background fill.

## Editorial Typography System

The defining signature of this design system is the deliberate pairing of Anthropic Serif (headlines only, weight 400) with Anthropic Sans (everything else, weight 400-580). The serif appears at exactly two sizes: 24px and 30px, used exclusively for section titles, plan names, and editorial hero copy. The sans carries 11px through 24px across all UI roles — body, nav, buttons, labels, captions. Weight 580 is the heaviest weight in use; the system never reaches 600+. This creates a visual language where the serif whispers authority through typographic contrast alone, and the sans does all the functional heavy lifting. When rebuilding pages, resist the urge to bold up — let size and weight differential create hierarchy.

## Warm Monochrome Philosophy

Claude's palette is deliberately restricted to warm neutrals plus one chromatic accent. The near-black text colors (#121212, #373734) carry a subtle warmth that distinguishes them from clinical SaaS blacks. The canvas (#f8f8f6) and card surfaces (#ffffff, #efeeeb) form a paper-like progression: parchment → paper → vellum. The single accent — Clay (#d97757) — appears only in decorative contexts: small marks, illustration details, editorial flourishes. It is never used to fill buttons, highlight links, or draw attention to data. This restraint is the brand. Adding additional chromatic colors (blues for links, greens for success, reds for error) would break the system's editorial integrity.

## Similar Brands

- **Stripe** — Same warm off-white canvas (#fbf9f6 territory), generous whitespace, flat card surfaces with soft radii, and restraint in using color — Stripe also keeps its palette nearly monochrome in marketing surfaces.
- **Linear** — Dark and light mode mastery with minimal chromatic accents, generous card radii (16-24px), and tight typographic hierarchy — though Linear skews darker while Claude skews warm-paper.
- **Notion** — Editorial restraint: monochrome palette, generous spacing, serif-optional typography that prioritizes readability over visual spectacle.
- **Arc Browser** — Warm-paper aesthetic with clay-adjacent accent palette, editorial typographic confidence, and a refusal to use typical SaaS blue as a brand color.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-parchment: #f8f8f6;
  --color-paper-white: #ffffff;
  --color-soft-stone: #efeeeb;
  --color-carbon-ink: #121212;
  --color-graphite: #373734;
  --color-ashen: #7b7974;
  --color-pebble: #9c9a92;
  --color-mist: #b7b7b5;
  --color-chalk: #e7e6e1;
  --color-obsidian: #000000;
  --color-clay: #d97757;

  /* Typography — Font Families */
  --font-anthropic-serif: 'Anthropic Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-anthropic-sans: 'Anthropic Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 30px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w550: 550;
  --font-weight-w580: 580;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 32px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-elevatedcards: 24px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.04) 0px 4px 20px 0px;
  --shadow-lg-2: oklab(0.431435 -0.02915 -0.125723 / 0.1) 0px 4px 24px 0px;

  /* Surfaces */
  --surface-page-canvas: #f8f8f6;
  --surface-card-surface: #ffffff;
  --surface-nested-surface: #efeeeb;
  --surface-dark-band: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-parchment: #f8f8f6;
  --color-paper-white: #ffffff;
  --color-soft-stone: #efeeeb;
  --color-carbon-ink: #121212;
  --color-graphite: #373734;
  --color-ashen: #7b7974;
  --color-pebble: #9c9a92;
  --color-mist: #b7b7b5;
  --color-chalk: #e7e6e1;
  --color-obsidian: #000000;
  --color-clay: #d97757;

  /* Typography */
  --font-anthropic-serif: 'Anthropic Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-anthropic-sans: 'Anthropic Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 30px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.04) 0px 4px 20px 0px;
  --shadow-lg-2: oklab(0.431435 -0.02915 -0.125723 / 0.1) 0px 4px 24px 0px;
}
```
