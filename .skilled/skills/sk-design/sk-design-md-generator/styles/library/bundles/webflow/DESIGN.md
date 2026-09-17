# Webflow — Style Reference
> white studio, black ink, one blue mark — a designer's drafting table rendered as a web page.

**Theme:** light

Webflow presents a studio-grade design platform language: a stark white canvas, near-black type, and a single saturated blue that punctuates the interface with quiet authority. Headlines speak at monumental sizes (56–80px) in a custom geometric variable sans, carrying tight negative tracking that makes each character feel chiseled rather than typeset. The visual rhythm is generous — large vertical breathing room between sections, cards floating on soft 8px radii with barely-there shadows, and product imagery embedded in realistic browser chrome to demonstrate capability rather than describe it. Color discipline is extreme: the palette is almost entirely achromatic, with the brand blue (#146ef5) reserved for primary actions, active states, and link emphasis, and the entire chromatic spectrum compressed to just two more hues (a soft green and warm orange) that appear only in micro-illustration contexts.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Webflow Blue | `#146ef5` | `--color-webflow-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Indigo Ink | `#1366e2` | `--color-indigo-ink` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Mercury Tint | `#6ca7ff` | `--color-mercury-tint` | Soft blue for icon decorations, gradient transitions, and muted highlight washes within illustrations |
| Mint Pulse | `#60ed76` | `--color-mint-pulse` | Green supporting accent for decorative details and low-frequency emphasis |
| Apricot Glow | `#ffa666` | `--color-apricot-glow` | Decorative warm accent in inline illustrations and product mockup contexts |
| Obsidian | `#080808` | `--color-obsidian` | Primary text, headings, icon strokes, dark surface fills — the near-black that carries the typographic voice |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark fills, inverted text |
| Slate | `#5a5a5a` | `--color-slate` | Secondary body text, icon secondary state, muted descriptions, footer copy |
| Ash Border | `#d8d8d8` | `--color-ash-border` | Hairline borders on cards, dividers, input outlines, button strokes |
| Smoke | `#bdbdbd` | `--color-smoke` | Subtle shadow base and disabled control fills |
| Graphite | `#222222` | `--color-graphite` | Dark surface for inverted sections and modal overlays |
| Onyx | `#171717` | `--color-onyx` | Deepest dark surface — footer bands and full-bleed dark sections |
| Mist | `#f0f0f0` | `--color-mist` | Subtle background tint for alternating sections, card hover, and input fills |
| Charcoal | `#292929` | `--color-charcoal` | Near-black accent surface, slightly lighter than Onyx for layered dark contexts |

## Tokens — Typography

### WF Visual Sans Variable — The sole sans family for the entire interface — navigation, body, headings, buttons, cards. A custom geometric variable typeface with widths that compress at display sizes. Weight 400 covers body and UI; 500–550 for subheads and labels; 600 reserved for the boldest display headlines. The variable axis enables optical sizing so display weights (56–80px) feel chiseled with tight tracking while body weights (14–16px) remain open and readable. · `--font-wf-visual-sans-variable`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400, 500, 550, 600
- **Sizes:** 10, 13, 14, 16, 20, 24, 32, 40, 56, 80
- **Line height:** 1.0, 1.04, 1.2, 1.3, 1.4, 1.5, 1.6
- **Letter spacing:** -0.01em at display sizes, +0.1em for uppercase eyebrow labels
- **Role:** The sole sans family for the entire interface — navigation, body, headings, buttons, cards. A custom geometric variable typeface with widths that compress at display sizes. Weight 400 covers body and UI; 500–550 for subheads and labels; 600 reserved for the boldest display headlines. The variable axis enables optical sizing so display weights (56–80px) feel chiseled with tight tracking while body weights (14–16px) remain open and readable.

### WF Visual Sans Mono — Monospaced companion for code snippets, terminal outputs, keyboard shortcuts, and developer-facing micro-copy. Rare on the marketing site but present in product demos. · `--font-wf-visual-sans-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12, 16
- **Line height:** 1.5, 1.6
- **OpenType features:** `"ss02", "ss10", "zero"`
- **Role:** Monospaced companion for code snippets, terminal outputs, keyboard shortcuts, and developer-facing micro-copy. Rare on the marketing site but present in product demos.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | — | `--text-caption` |
| body-lg | 16px | 1.6 | — | `--text-body-lg` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.04 | -0.4px | `--text-heading-lg` |
| display | 56px | 1.04 | -0.56px | `--text-display` |
| display-xl | 80px | 1 | -0.8px | `--text-display-xl` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| images | 8px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.01) 0px 54px 22px 0px, rgba(0, 0, 0, 0.04...` | `--shadow-lg` |
| xl | `rgba(0, 0, 0, 0.02) 0px 67px 27px 0px, rgba(0, 0, 0, 0.06...` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.01) 0px 148px 42px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Highest-emphasis action — used for free trial, demo requests, and sign-up flows

Background: #146ef5. Text: #ffffff, WF Visual Sans Variable 14px weight 500, letter-spacing normal. Padding: 12px 16px. Border-radius: 4px. No border. No shadow. The sharp 4px radius (not pill-shaped) is deliberate — it signals professional tool over consumer app. On hover, background deepens to #1366e2.

### Ghost/Text Button
**Role:** Secondary action — 'Log in', 'Contact Sales', inline text links

No background. Text: #080808, 14px weight 500. No border. No padding override. Underline appears on hover. For nav items, text color shifts to #146ef5 on active state.

### Announcement Banner
**Role:** Top-of-page promotional strip for events, product launches, or campaigns

Full-width band with background: #146ef5. Text: #ffffff, 13px weight 500, centered. Padding: 8px 16px. No border, no shadow. Closes via X icon on the right. Creates the first visual note of the page — blue ribbon on white.

### Top Navigation Bar
**Role:** Persistent site navigation with logo, primary nav, auth, and CTA

Background: #ffffff. Height: ~56px. Left: Webflow wordmark in #146ef5. Center: nav links (Platform, Solutions, Resources, Enterprise, Pricing) in #080808, 14px weight 400, with a small chevron on items with sub-menus. Right: 'Log in' ghost link, 'Contact Sales' ghost link, 'Start for free' primary button. Sticky to top with no border on rest state; gains a 1px #d8d8d8 bottom border on scroll.

### Feature Card (Light)
**Role:** Content cards in feature grids — 'AI site builder', 'Template', 'Blank site'

Background: #ffffff. Border: 1px solid #d8d8d8. Border-radius: 8px. Padding: 24px. No shadow. Contains a title (16px weight 600), description (14px weight 400 #5a5a5a), and a small product preview thumbnail (border-radius 8px) in the top-right corner. Cards align in a 3-column grid with 16px gap.

### Split Feature Section
**Role:** Two-column layout pairing descriptive text with a product visual

Max-width 1200px container. Left column: eyebrow label (13px uppercase +0.1em tracking #5a5a5a), heading (32–40px weight 600 #080808), bullet list with arrow links. Right column: product screenshot or browser-frame mockup at full column width, 8px border-radius. Section gap: 80px vertical.

### Feature List Item
**Role:** Expandable or linked feature descriptions with arrow affordance

Horizontal flex row. Left: body text (16px weight 400 #080808). Right: right-arrow icon (→) in #5a5a5a. Bottom border: 1px solid #d8d8d8. Padding: 16px 0. On hover, arrow shifts right 4px and text color remains stable. Used in the 'Everything marketing teams love' section.

### Hero Section
**Role:** Above-the-fold brand statement and primary conversion path

Full-bleed #ffffff background. Centered stack: eyebrow tag (optional), headline (56–80px weight 600 #080808, line-height 1.0, letter-spacing -0.01em), subtext (20px weight 400 #5a5a5a, max-width 560px). Below: a 3-card choice row ('How do you want to build?') with 16px gap. No background image; the hero is pure typography on white.

### Browser-Frame Mockup
**Role:** Realistic product screenshot wrapper — demonstrates the editor UI

Outer container: 8px border-radius, multi-layer soft shadow (rgba 0,0,0,0.02 → 0.12 across 4 stops). Top bar: 28px tall, #f0f0f0 background, with three traffic-light dots (red/yellow/green) and a URL field. Content area: full product UI captured at 2x resolution. Used to show the Webflow editor wrapping the actual webflow.com page — a self-referential product demonstration.

### Cookie Consent Banner
**Role:** Fixed-bottom GDPR compliance overlay

Fixed to bottom-left, max-width 380px. Background: #ffffff. Border: 1px solid #d8d8d8. Border-radius: 8px. Padding: 16px. Body text: 13px #080808. Two buttons stacked: 'Reject all' (ghost, #080808 text, 1px #d8d8d8 border) and 'Accept all' (filled #146ef5, white text). 'Manage Preferences' link in #146ef5 above buttons.

### Logo Strip
**Role:** Social proof band showing enterprise customer logos

Horizontal row of monochrome (grayscale) customer logos on #ffffff or #f0f0f0 background. Logos at consistent height (~24px), even spacing via flex justify-content: space-between. No logos are colored — all rendered in #5a5a5a or #080808 for uniform tonal weight.

### Eyebrow Label
**Role:** Small uppercase category label above section headings

WF Visual Sans Variable, 13px, weight 500, letter-spacing +0.1em, text-transform uppercase, color #5a5a5a. Sits 16px above the heading it introduces. Functions as a quiet section marker.

### New Tag Badge
**Role:** Inline indicator marking a feature or option as recently released

Background: #146ef5. Text: 'NEW' in #ffffff, 10px weight 600, uppercase, letter-spacing +0.1em. Padding: 2px 6px. Border-radius: 4px. Displayed inline next to the card or feature title it qualifies.

## Do's and Don'ts

### Do
- Use #146ef5 exclusively for filled primary actions, active nav states, and link emphasis — it is the only color that should carry interactive weight.
- Set headlines at 56–80px in WF Visual Sans Variable weight 600 with letter-spacing -0.01em; the tight tracking is what makes display type feel architectural rather than decorative.
- Use 8px border-radius for cards, images, and large containers; reserve 4px for buttons, inputs, and tags. Never use fully rounded pill buttons (1440px appears only once and is anomalous).
- Pair #080808 text on #ffffff for a 20:1 contrast ratio — the system is built for maximum legibility, not warmth.
- Use 1px #d8d8d8 borders to define structure at rest; reach for shadow only on hover or for browser-frame mockups.
- Set section vertical gaps at 80px and card padding at 24px; the 4px base unit compounds to create generous breathing room without empty waste.
- Show the product through realistic browser chrome rather than abstract illustrations — the self-referential 'Webflow inside Webflow' demo is a signature device.

### Don't
- Don't introduce additional chromatic colors into the UI — green (#60ed76) and orange (#ffa666) are decorative only, confined to inline illustrations.
- Don't use fully rounded pill buttons for primary actions; the 4px radius signals professional tool and must not soften to 9999px.
- Don't apply shadows to resting cards; the system defines structure with borders and uses shadow only as interactive feedback.
- Don't set display headlines below 40px or use weight 400 for hero copy; the monumentality of 56–80px weight 600 is the brand's typographic signature.
- Don't mix serif or display fonts into the system — WF Visual Sans Variable is the only typeface allowed for interface copy.
- Don't use more than one font size in a single heading block; the scale steps cleanly and breaks in hierarchy should follow the type scale, not arbitrary sizes.
- Don't place the brand blue on dark surfaces for hover or active states; use #146ef5 on light surfaces only, and use white or #146ef2 for emphasis on dark backgrounds.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background for all light sections |
| 1 | Tinted | `#f0f0f0` | Alternating section bands and subtle card differentiation |
| 2 | Card | `#ffffff` | Elevated content cards on tinted or canvas backgrounds |
| 3 | Inverted | `#080808` | Dark mode callouts, footer, or feature sections |

## Elevation

- **Card hover state:** `rgba(0, 0, 0, 0.01) 0px 54px 22px 0px, rgba(0, 0, 0, 0.04) 0px 30px 18px 0px, rgba(0, 0, 0, 0.08) 0px 13px 13px 0px, rgba(0, 0, 0, 0.09) 0px 3px 7px 0px`
- **Browser-frame mockup:** `rgba(0, 0, 0, 0.02) 0px 67px 27px 0px, rgba(0, 0, 0, 0.06) 0px 38px 23px 0px, rgba(0, 0, 0, 0.1) 0px 17px 17px 0px, rgba(0, 0, 0, 0.12) 0px 4px 9px 0px`
- **Floating CTA / sticky element:** `rgba(0, 0, 0, 0.01) 0px 148px 42px 0px, rgba(0, 0, 0, 0.04) 0px 95px 38px 0px, rgba(0, 0, 0, 0.15) 0px 53px 32px 0px, rgba(0, 0, 0, 0.26) 0px 24px 24px 0px, rgba(0, 0, 0, 0.29) 0px 6px 13px 0px`

## Imagery

Photography and abstract imagery are largely absent from the core pages. Instead, Webflow leads with realistic product mockups wrapped in browser chrome (the 'Webflow inside Webflow' self-demo is the most distinctive visual device). Inline illustrations use a flat, geometric style with a constrained palette of #146ef5, #6ca7ff, #60ed76, and #ffa666 — never photographic, never 3D. Customer logos appear as monochrome grayscale strips. Icons are stroke-based, 1.5–2px weight, and rendered in #080808 or contextual color. The visual space is overwhelmingly text-and-UI dominant; imagery serves to demonstrate product capability rather than create atmosphere.

## Layout

Page model is max-width 1200px centered, with full-bleed bands for the announcement bar and alternating section backgrounds. The hero is a centered text stack on pure white with no background image, followed by a 3-column card row. Below the fold, the layout alternates between 2-column split sections (text-left, product-visual-right) and full-width centered text blocks. Section transitions use 80px vertical gaps with no dividers — the rhythm is carried by whitespace alone. Navigation is a single sticky top bar; no sidebar or mega-menu structures. The grid system is 12-column at desktop, collapsing to single-column stacks on mobile.

## Agent Prompt Guide

Quick Color Reference:
- text: #080808
- background: #ffffff
- border: #d8d8d8
- accent: #146ef5
- muted text: #5a5a5a
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero section: white (#ffffff) background, centered max-width 1200px. Headline 'Build your website' at 56px WF Visual Sans Variable weight 600, #080808, line-height 1.04, letter-spacing -0.56px. Subtext at 20px weight 400, #5a5a5a, max-width 560px. Below: 3-column card row with 16px gap, each card 8px radius, 1px #d8d8d8 border, 24px padding.

2. Create a navigation bar: white background, 56px height, flex row. Left: logo wordmark in #146ef5. Center: nav links in #080808 14px weight 400 with 16px gap. Right: 'Log in' ghost link, 'Start free' filled button (#146ef5 background, white text, 4px radius, 12px 16px padding). Sticky to top.

3. Create a feature card: white background, 1px #d8d8d8 border, 8px radius, 24px padding. Title at 16px weight 600 #080808. Description at 14px weight 400 #5a5a5a. Top-right: thumbnail image at 8px radius. No shadow at rest.

4. Create a split feature section: max-width 1200px, two columns 50/50 with 48px gap. Left column: eyebrow label (13px uppercase +0.1em tracking #5a5a5a), heading (32px weight 600 #080808), bullet list with right-arrow icons in #5a5a5a. Right column: browser-frame mockup with soft multi-layer shadow, 8px radius.

5. Create a browser-frame mockup: outer container 8px radius, multi-layer soft shadow. Top bar 28px tall #f0f0f0 background with three colored dots (red/yellow/green circles 8px each) and a centered URL field at 12px WF Visual Sans Mono. Content area fills remaining height with the product UI screenshot.

## Similar Brands

- **Linear** — Same near-monochrome palette with a single vivid accent, monumental display headlines with tight tracking, and borderless cards that trust whitespace and hairline borders for structure
- **Vercel** — Shared commitment to pure white canvases, display-weight geometric sans headings, and the use of realistic product/browser mockups as the primary visual device instead of stock photography
- **Framer** — Same designer-tool sensibility — flat surfaces, minimal elevation, 8px card radii, and a single blue accent for interactive states
- **Notion** — Comparable restrained typographic system with generous section gaps, achromatic backgrounds, and color used as functional punctuation rather than decoration
- **Stripe** — Identical 1200px max-width centered layout model, dramatic display sizes (56–80px), and the philosophy that one saturated accent against a monochrome system creates stronger brand recognition than multi-color palettes

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-webflow-blue: #146ef5;
  --color-indigo-ink: #1366e2;
  --color-mercury-tint: #6ca7ff;
  --color-mint-pulse: #60ed76;
  --color-apricot-glow: #ffa666;
  --color-obsidian: #080808;
  --color-pure-white: #ffffff;
  --color-slate: #5a5a5a;
  --color-ash-border: #d8d8d8;
  --color-smoke: #bdbdbd;
  --color-graphite: #222222;
  --color-onyx: #171717;
  --color-mist: #f0f0f0;
  --color-charcoal: #292929;

  /* Typography — Font Families */
  --font-wf-visual-sans-variable: 'WF Visual Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wf-visual-sans-mono: 'WF Visual Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -0.4px;
  --text-display: 56px;
  --leading-display: 1.04;
  --tracking-display: -0.56px;
  --text-display-xl: 80px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w550: 550;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-88: 88px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-images: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.01) 0px 54px 22px 0px, rgba(0, 0, 0, 0.04) 0px 30px 18px 0px, rgba(0, 0, 0, 0.08) 0px 13px 13px 0px, rgba(0, 0, 0, 0.09) 0px 3px 7px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.02) 0px 67px 27px 0px, rgba(0, 0, 0, 0.06) 0px 38px 23px 0px, rgba(0, 0, 0, 0.1) 0px 17px 17px 0px, rgba(0, 0, 0, 0.12) 0px 4px 9px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.01) 0px 148px 42px 0px, rgba(0, 0, 0, 0.04) 0px 95px 38px 0px, rgba(0, 0, 0, 0.15) 0px 53px 32px 0px, rgba(0, 0, 0, 0.26) 0px 24px 24px 0px, rgba(0, 0, 0, 0.29) 0px 6px 13px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-tinted: #f0f0f0;
  --surface-card: #ffffff;
  --surface-inverted: #080808;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-webflow-blue: #146ef5;
  --color-indigo-ink: #1366e2;
  --color-mercury-tint: #6ca7ff;
  --color-mint-pulse: #60ed76;
  --color-apricot-glow: #ffa666;
  --color-obsidian: #080808;
  --color-pure-white: #ffffff;
  --color-slate: #5a5a5a;
  --color-ash-border: #d8d8d8;
  --color-smoke: #bdbdbd;
  --color-graphite: #222222;
  --color-onyx: #171717;
  --color-mist: #f0f0f0;
  --color-charcoal: #292929;

  /* Typography */
  --font-wf-visual-sans-variable: 'WF Visual Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wf-visual-sans-mono: 'WF Visual Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -0.4px;
  --text-display: 56px;
  --leading-display: 1.04;
  --tracking-display: -0.56px;
  --text-display-xl: 80px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-88: 88px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 1440px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.01) 0px 54px 22px 0px, rgba(0, 0, 0, 0.04) 0px 30px 18px 0px, rgba(0, 0, 0, 0.08) 0px 13px 13px 0px, rgba(0, 0, 0, 0.09) 0px 3px 7px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.02) 0px 67px 27px 0px, rgba(0, 0, 0, 0.06) 0px 38px 23px 0px, rgba(0, 0, 0, 0.1) 0px 17px 17px 0px, rgba(0, 0, 0, 0.12) 0px 4px 9px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.01) 0px 148px 42px 0px, rgba(0, 0, 0, 0.04) 0px 95px 38px 0px, rgba(0, 0, 0, 0.15) 0px 53px 32px 0px, rgba(0, 0, 0, 0.26) 0px 24px 24px 0px, rgba(0, 0, 0, 0.29) 0px 6px 13px 0px;
}
```
