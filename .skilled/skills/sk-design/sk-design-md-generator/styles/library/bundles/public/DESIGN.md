# Public — Style Reference
> monochrome editorial on cold marble — a near-monochrome canvas, a serif at weight 300, one violet accent doing all the chromatic work.

**Theme:** light

Public reads like a financial broadsheet rendered in UI: a near-monochrome canvas of cool grays and bone white, with one vivid violet used sparingly as a linking accent. The signature is Denton, a custom serif held at an almost whispered weight 300 for display headlines — a deliberate inversion of fintech convention that swaps the usual bold sans for something editorial and considered. Inter carries every functional surface, keeping the interface legible and quiet. Surfaces are flat and unembellished, depth is earned through the occasional 16px-radius card or a soft 10px shadow rather than gradients or heavy elevation. The only true color is #0027b3 violet, reserved for links and the rare inline accent tag; everything else is ink, paper, and shadow. Buttons are long pill shapes (100px radius) — the primary action is a matte black fill, secondaries are ghost outlines. Generous vertical breathing room between sections and a centered editorial layout reinforce the sense that this is a place for reading, not scanning.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, inverted button fills |
| Marble Canvas | `#f3f6f9` | `--color-marble-canvas` | Page background — the dominant surface behind every section |
| Bone Mist | `#e9edf3` | `--color-bone-mist` | Hairline borders, subtle dividers, card outlines on canvas |
| Fog Line | `#dce2ea` | `--color-fog-line` | Secondary borders, input outlines, table dividers |
| Slate Pencil | `#a8b4bf` | `--color-slate-pencil` | Muted helper text, inactive tags, disabled labels |
| Steel | `#516880` | `--color-steel` | Body text on canvas, secondary borders, the workhorse neutral |
| Lampblack | `#1b2128` | `--color-lampblack` | Primary text, nav ink, strong borders — the deepest reading tone |
| Graphite | `#262626` | `--color-graphite` | Dark surfaces, nav bar fills, inverted card backgrounds |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary button fill, hardest borders, maximum-weight text |
| Violet Ink | `#0027b3` | `--color-violet-ink` | Inline text links, link borders, the sole chromatic accent — a deep electric violet that makes the rare colored element read as switched on |
| Sky Wash | `#95d0ff` | `--color-sky-wash` | Decorative illustration fills, subtle highlight washes, icon tints |

## Tokens — Typography

### Denton — Display headlines and hero text — the signature choice. Held at weight 300 (not 600-700), this custom serif trades fintech's usual shouting for an editorial whisper. Use at 80px for the primary hero, 48-52px for section openers. Substitute with a high-contrast light serif like 'GT Sectra Display' or 'Tiempos Headline Light'. · `--font-denton`
- **Substitute:** GT Sectra Display Light or Tiempos Headline Light
- **Weights:** 300
- **Sizes:** 48px, 52px, 80px
- **Line height:** 1.00, 1.11, 1.12, 1.13
- **Role:** Display headlines and hero text — the signature choice. Held at weight 300 (not 600-700), this custom serif trades fintech's usual shouting for an editorial whisper. Use at 80px for the primary hero, 48-52px for section openers. Substitute with a high-contrast light serif like 'GT Sectra Display' or 'Tiempos Headline Light'.

### Invest Pro — Mid-scale UI: subheadings, card titles, feature labels, button text, nav items. Weight 500 for emphasis, 400 for supporting copy. This custom sans bridges Denton's editorial headlines and Inter's functional body. · `--font-invest-pro`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 32px
- **Line height:** 1.00, 1.13, 1.14, 1.15, 1.17, 1.20, 1.28, 1.29, 1.31, 1.37, 1.38, 1.50
- **Role:** Mid-scale UI: subheadings, card titles, feature labels, button text, nav items. Weight 500 for emphasis, 400 for supporting copy. This custom sans bridges Denton's editorial headlines and Inter's functional body.

### Inter — Body copy, captions, table data, form fields, badges, all functional UI. Weight 400 for body, 600 for inline emphasis and small labels. Sized down to 10-11px for dense data contexts. · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 600
- **Sizes:** 10px, 11px, 12px, 14px, 16px
- **Line height:** 1.00, 1.15, 1.42, 1.43, 1.50, 1.54, 1.60, 2.00
- **Role:** Body copy, captions, table data, form fields, badges, all functional UI. Weight 400 for body, 600 for inline emphasis and small labels. Sized down to 10-11px for dense data contexts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body | 14px | 1.54 | — | `--text-body` |
| heading-sm | 20px | 1.2 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 32px | 1.15 | — | `--text-heading-lg` |
| display | 48px | 1.12 | — | `--text-display` |
| display-lg | 80px | 1.05 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 44 | 44px | `--spacing-44` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 76 | 76px | `--spacing-76` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 16px |
| small | 4px |
| inputs | 4px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.08) 0px 1px 10px 0px` | `--shadow-md` |
| lg | `rgba(255, 196, 250, 0.25) 8px -8px 20px 0px, rgba(56, 205...` | `--shadow-lg` |
| lg-2 | `rgba(0, 0, 0, 0.06) 0px 24px 24px 0px` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Header Nav Bar
**Role:** Top-level navigation

Full-width white bar on #f3f6f9 canvas. Logo (left), centered nav items with chevron dropdowns (Products, Agents, Tools & Resources, Company), auth buttons (right). Height ~64px. Nav text in Inter 14px weight 400 in #1b2128. No background fill — the nav sits directly on the canvas.

### Primary Filled Button
**Role:** Main call-to-action

Matte black pill (#000000 fill, #ffffff text). Border-radius 100px. Padding 12px 24px. Text in Inter 14px weight 600. Carries the dual-tone glow shadow: rgba(255,196,250,0.25) 8px -8px 20px and rgba(56,205,255,0.25) -8px 8px 30px. This is the only element with a colorful shadow in the system.

### Ghost Outlined Button
**Role:** Secondary action

White fill with #000000 1.5px border. Border-radius 100px. Text in #000000, Inter 14px weight 600. Same padding as primary. No shadow. Used for Log in, Sign up, and other non-primary actions.

### Inline Text Link
**Role:** Navigational link within body copy

Text in #0027b3 violet, Inter 14px weight 400. Underlined by default. This is the only chromatic text in the system — its rarity makes it instantly scannable.

### Yield Tag
**Role:** Inline data callout (e.g. "5.88% yield*")

Small pill or inline badge with #000000 text. Border-radius 4px. Appears inline within flowing text lists of asset categories. No background fill — just bold weight text that breaks from the surrounding regular weight.

### Feature Pill Row
**Role:** Highlight tags below hero headline

Horizontal row of small icon+text pairs (e.g. Multi-asset investing, AI Agents). Inter 14px weight 400 in #516880. Icons are small, 16px, monochromatic. Separated by even spacing. No background or border — just inline text with a leading icon.

### Product Showcase Card
**Role:** Hero visual: desktop and mobile app mockup

Product screenshots displayed at large scale. No card container — the screenshots sit directly on canvas. Desktop view is ~800px wide, mobile phone overlaps the right edge, angled slightly. The overlap creates depth without a shadow.

### Asset Category Flow List
**Role:** Navigational index of all available asset types

Centered text list with categories separated by bullet dots (·). Inter or Invest Pro at 20-24px weight 400 in #000000. Categories include Stocks, Bonds, Treasuries, Options, Crypto, ETFs, and accounts. Inline yield tags (5.88% yield*, 3.30% APY*, 1% MATCH) break the line with bold weight.

### Agent Feature Card
**Role:** Panel displaying agent configuration details

White card on canvas. Border-radius 16px. Padding 16-24px. Soft shadow rgba(0,0,0,0.08) 0px 1px 10px. Two-column layout: checkbox list of active agents on the left, agent detail panel on the right. Inter for all text, #000000 for active states, #a8b4bf for inactive.

### Feature Card
**Role:** Section content card (Market briefing, Key moments)

White card, border-radius 16px, padding 24px. Soft shadow. Title in Invest Pro 20-24px weight 500. Description in Inter 14px weight 400 in #516880. Learn more link in #0027b3 violet.

### Cookie Consent Modal
**Role:** GDPR/privacy notification

Small white card in bottom-left corner. Border-radius 4px. Thin shadow. Body text in Inter 12-14px. Blue 'Got it' button (#0027b3 fill, white text, 4px radius). Close X in top-right corner.

### Floating Promo Banner
**Role:** Bottom-right promotional notification

Dark card (#262626 fill) with white text. Product thumbnail on left side showing '0% commissions'. Inter 12-14px text. Small close X. Border-radius 4px. Sits fixed at viewport bottom-right.

## Do's and Don'ts

### Do
- Use Denton at weight 300 exclusively for display headlines 48px+ — the whisper-weight serif is the brand's most recognizable element
- Keep the palette 95% monochrome; #0027b3 violet appears only on text links and the rare inline accent
- Use 100px border-radius for all buttons — every interactive element should read as a pill
- Set section gaps at 64px minimum; the editorial spaciousness is non-negotiable
- Use 16px border-radius for cards and content panels, 4px for tags and small UI elements
- Apply the dual-tone glow shadow only to the primary CTA — it is the one place color may exist as elevation
- Use Invest Pro for mid-scale headings (20-32px) and Inter for everything 16px and below

### Don't
- Never use Denton at weight 400+ — the light whisper is the entire point
- Do not introduce additional accent colors; the system is monochrome plus one violet
- Do not use 8px or 12px radii on buttons — only 100px pills are buttons
- Avoid heavy shadows; depth comes from the canvas-to-card contrast, not from elevation
- Do not use sans-serif fonts for display text 48px+ — the serif is the signature
- Do not fill buttons with #0027b3 violet; the primary CTA is always matte black
- Do not center-align body paragraphs; only headlines and short labels get centered treatment
- Avoid decorative gradients — the system is flat, not dimensional

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Marble Canvas | `#f3f6f9` | Page background — the base plane behind all content |
| 1 | Paper White | `#ffffff` | Card surfaces, elevated content blocks, product screenshots |
| 2 | Graphite | `#262626` | Dark cards, nav fills, inverted sections |
| 3 | Carbon Black | `#000000` | Primary action buttons, maximum-contrast elements |

## Elevation

- **Card:** `rgba(0, 0, 0, 0.08) 0px 1px 10px 0px`
- **Elevated Card:** `rgba(0, 0, 0, 0.06) 0px 24px 24px 0px`
- **Primary Button:** `rgba(255, 196, 250, 0.25) 8px -8px 20px 0px, rgba(56, 205, 255, 0.25) -8px 8px 30px 0px`

## Imagery

Imagery is limited to product UI mockups: dashboard screenshots and mobile app views displayed on the hero. These are clean, light-themed interface renders shown at large scale with a slight overlap between desktop and mobile views to create depth. No photography, no lifestyle imagery, no illustrations beyond the product showcase. Icons are small, monochromatic line-style glyphs (16px) used inline within text. The only decorative color outside UI mockups is the subtle sky-blue (#95d0ff) used for occasional highlight washes. The visual approach is "show the product, don't decorate it."

## Layout

Max-width 1200px centered for content blocks, with the nav bar and hero extending full-bleed. The hero is a centered headline + subtext + CTA stacked vertically, followed by a large product showcase that breaks the centered column for visual impact. Below the hero, a flowing centered text list of asset categories acts as a navigational index. Further sections alternate between centered text blocks and two-column feature layouts (text left, visual right or centered card). Card grids use 2-3 columns with 24px gaps. Vertical rhythm is generous — 64px minimum between sections. Navigation is a minimal top bar with dropdown menus. Floating elements (cookie consent, promo banner) anchor to viewport corners.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 (primary), #1b2128 (body), #516880 (secondary), #a8b4bf (muted)
- background: #f3f6f9 (canvas), #ffffff (card), #262626 (dark surface)
- border: #000000 (strong), #dce2ea (secondary), #e9edf3 (hairline)
- accent: #0027b3 (links only)
- primary action: #0027b3 (outlined action border)

## Example Component Prompts
1. Create an Outlined Primary Action: Transparent background, #0027b3 border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

2. **Product Showcase Card:** White card on canvas, 16px border-radius, 16px padding, soft shadow rgba(0,0,0,0.08) 0px 1px 10px. Title in Invest Pro 20px weight 500 #000000. Body in Inter 14px #516880. Learn more link in #0027b3 violet.

3. **Ghost Outlined Button:** White fill, 1.5px #000000 border, 100px border-radius, Inter 14px weight 600, padding 12px 24px. No shadow.

4. **Yield Tag Inline:** Inter 14px weight 600 #000000, inline within a flow list, no background, no border — just bold weight breaking from surrounding regular text.

5. **Asset Category Flow List:** Centered, single column. Items in Invest Pro 24px weight 400 #000000, separated by middle-dot (·) characters with 24px horizontal spacing. Bold yield tags inline.

## Gradient System

No system-wide gradients. The only gradient-adjacent element is the primary button's dual-tone glow shadow: a pink-cyan offset glow that gives the black pill a subtle iridescent halo. This is elevation-as-color, not a background fill. Do not add gradients to cards, headers, or backgrounds.

## Typography Philosophy

The type system creates a deliberate tension: a light serif (Denton 300) for editorial authority meets a functional sans (Inter) for utility. Display text whispers; body text works. This inversion of fintech convention (where most competitors use bold sans-serif) signals confidence through restraint. The serif at 80px with 1.05 line-height creates a generous, readable hero that feels more like a magazine cover than a product page.

## Similar Brands

- **Robinhood** — Similar investing/brokerage domain with clean financial product UI, though Public is more editorial and monochrome while Robinhood is more colorful and app-focused
- **Wealthfront** — Clean monochrome financial product surface with strong typographic hierarchy and restrained color usage
- **Stripe** — Shares the monochrome-with-one-accent-color philosophy, generous whitespace, and pill-shaped buttons for primary actions
- **The New York Times (digital)** — The Denton serif at weight 300 for display headlines mirrors the editorial newspaper typography tradition — broadsheet DNA in a product interface
- **Linear** — Compact density, monochromatic palette, sharp typographic hierarchy, and the philosophy that restraint communicates quality

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-marble-canvas: #f3f6f9;
  --color-bone-mist: #e9edf3;
  --color-fog-line: #dce2ea;
  --color-slate-pencil: #a8b4bf;
  --color-steel: #516880;
  --color-lampblack: #1b2128;
  --color-graphite: #262626;
  --color-carbon-black: #000000;
  --color-violet-ink: #0027b3;
  --color-sky-wash: #95d0ff;

  /* Typography — Font Families */
  --font-denton: 'Denton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-invest-pro: 'Invest Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.54;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.15;
  --text-display: 48px;
  --leading-display: 1.12;
  --text-display-lg: 80px;
  --leading-display-lg: 1.05;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-44: 44px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 100px;
  --radius-full-2: 310px;
  --radius-full-3: 375px;
  --radius-full-4: 379px;
  --radius-full-5: 999px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 16px;
  --radius-small: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 1px 10px 0px;
  --shadow-lg: rgba(255, 196, 250, 0.25) 8px -8px 20px 0px, rgba(56, 205, 255, 0.25) -8px 8px 30px 0px;
  --shadow-lg-2: rgba(0, 0, 0, 0.06) 0px 24px 24px 0px;

  /* Surfaces */
  --surface-marble-canvas: #f3f6f9;
  --surface-paper-white: #ffffff;
  --surface-graphite: #262626;
  --surface-carbon-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-marble-canvas: #f3f6f9;
  --color-bone-mist: #e9edf3;
  --color-fog-line: #dce2ea;
  --color-slate-pencil: #a8b4bf;
  --color-steel: #516880;
  --color-lampblack: #1b2128;
  --color-graphite: #262626;
  --color-carbon-black: #000000;
  --color-violet-ink: #0027b3;
  --color-sky-wash: #95d0ff;

  /* Typography */
  --font-denton: 'Denton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-invest-pro: 'Invest Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.54;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.15;
  --text-display: 48px;
  --leading-display: 1.12;
  --text-display-lg: 80px;
  --leading-display-lg: 1.05;

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
  --spacing-44: 44px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 100px;
  --radius-full-2: 310px;
  --radius-full-3: 375px;
  --radius-full-4: 379px;
  --radius-full-5: 999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 1px 10px 0px;
  --shadow-lg: rgba(255, 196, 250, 0.25) 8px -8px 20px 0px, rgba(56, 205, 255, 0.25) -8px 8px 30px 0px;
  --shadow-lg-2: rgba(0, 0, 0, 0.06) 0px 24px 24px 0px;
}
```
