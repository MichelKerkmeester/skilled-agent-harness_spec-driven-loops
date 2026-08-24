# SaveDay — Style Reference
> butter-highlighter poster typography — oversize black uppercase type on cream paper, with one band of yellow dragged across each section.

**Theme:** light

SaveDay reads as a sun-bleached editorial spread with a butter-yellow highlighter dragged across it: a near-monochrome paper-white canvas, oversized uppercase display type in Phudu, and one saturated #fbda5f yellow that paints full-width section bands and pill accents. The system is unapologetically poster-like — headlines fill the viewport at 112px, letter-spacing pulls tight to -0.04em, and text alignment is almost always centered, producing a print-poster cadence rather than a dashboard cadence. Information is delivered in horizontal color bands (light gray, yellow, black) that act as section dividers and surface treatments in one move, with no shadows mediating depth. Components are confidently chunky: 24px card radii, 160px pill radii on CTAs and tags, hairline-thick black borders, and flat fills — the geometry does the work that gradients and shadows usually do.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Butter Highlight | `#fbda5f` | `--color-butter-highlight` | Yellow accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Signal Blue | `#006aff` | `--color-signal-blue` | Link and icon accent for secondary navigation and store-badge fills — cool counterpoint to the warm yellow, never used for primary CTAs |
| Ink | `#0d0d0d` | `--color-ink` | Body text, heading text, card borders, hairline dividers — the dominant near-black that carries almost all typography and outlines |
| Pure Black | `#000000` | `--color-pure-black` | Hard-edge borders on feature band cards, icon fills, and the inverted footer band where it provides maximum contrast against yellow text |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card backgrounds, and the negative space inside inverted black bands — the surface everything else sits on |
| Fog | `#edeef0` | `--color-fog` | Soft feature-band surface (alternates with Butter Highlight and Pure Black), subtle card backgrounds, neutral pill borders and text |
| Stone | `#e5e4e3` | `--color-stone` | Warm-leaning neutral for card surfaces and background variation where Fog feels too cool |
| Charcoal | `#333333` | `--color-charcoal` | Deep surface fill used inside the dark footer band and as an elevated neutral surface |
| Mist | `#999999` | `--color-mist` | Muted helper text, list dividers, and secondary metadata where Ink would carry too much weight |
| Silver | `#cccccc` | `--color-silver` | Hairline borders, low-emphasis dividers, and the single drop shadow tint used on elevated cards |

## Tokens — Typography

### Phudu — Display and heading typeface — used for every oversized headline, feature-band title, and section header. The extreme weight contrast (400 vs 700) and ultra-tight 0.90 line-height give SaveDay its poster identity. Letterspacing runs from -0.04em at 112px down to -0.02em at 24px, pulling glyphs into a dense, almost monoline block. · `--font-phudu`
- **Substitute:** Archivo Black, Space Grotesk Bold, or any condensed geometric grotesque at heavy weight
- **Weights:** 400, 700
- **Sizes:** 24px, 32px, 56px, 64px, 112px
- **Line height:** 0.90-1.00
- **Letter spacing:** -4.48px at 112px, -1.92px at 64px, -1.12px at 56px, -0.64px at 32px, -0.48px at 24px
- **Role:** Display and heading typeface — used for every oversized headline, feature-band title, and section header. The extreme weight contrast (400 vs 700) and ultra-tight 0.90 line-height give SaveDay its poster identity. Letterspacing runs from -0.04em at 112px down to -0.02em at 24px, pulling glyphs into a dense, almost monoline block.

### InterDisplay — UI, body, and small-heading workhorse — paragraphs, button labels, nav links, FAQ text, badge text, card subtext. The slight negative tracking (-0.018em to -0.024em) keeps the grotesque crisp at small sizes without feeling mechanical. Always paired with a relaxed 1.50 line-height for body and 1.20 for UI labels. · `--font-interdisplay`
- **Substitute:** Inter, Manrope, or any humanist sans at the same weights
- **Weights:** 400, 500, 600, 700
- **Sizes:** 16px, 18px, 20px, 24px
- **Line height:** 1.20-1.50
- **Letter spacing:** -0.96px at 24px, -0.48px at 20px, -0.36px at 18px, -0.288px at 16px
- **Role:** UI, body, and small-heading workhorse — paragraphs, button labels, nav links, FAQ text, badge text, card subtext. The slight negative tracking (-0.018em to -0.024em) keeps the grotesque crisp at small sizes without feeling mechanical. Always paired with a relaxed 1.50 line-height for body and 1.20 for UI labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.5 | -0.288px | `--text-body` |
| body-lg | 18px | 1.5 | -0.36px | `--text-body-lg` |
| subheading | 20px | 1.3 | -0.48px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.96px | `--text-heading-sm` |
| heading | 32px | 1 | -0.64px | `--text-heading` |
| heading-lg | 56px | 0.9 | -1.12px | `--text-heading-lg` |
| display | 64px | 0.9 | -1.92px | `--text-display` |
| display-xl | 112px | 0.9 | -4.48px | `--text-display-xl` |

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
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| badges | 160px |
| buttons | 160px |
| smallChips | 12px |
| featureBands | 30px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.2) 0px 0px 20px -16px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Pill CTA Button (Butter)
**Role:** Primary call-to-action in the nav and hero — bordered, butter-yellow filled, fully rounded

160px border-radius, 8px vertical / 16px horizontal padding, InterDisplay 16px weight 600 in #0d0d0d, 1.5px #0d0d0d border, #fbda5f fill. Sits inline in the top nav and as the download store CTA in the hero.

### Ghost Nav Link
**Role:** Secondary navigation items in the top bar

No fill, no border, InterDisplay 16px weight 500 in #0d0d0d, generous horizontal padding (16-24px). Hover raises text contrast; no underline by default.

### Display Headline
**Role:** Hero and feature-band titles — the system's signature element

Phudu 700 at 56-112px, line-height 0.90, letter-spacing -1.12px to -4.48px, color #0d0d0d on light bands and #fbda5f on the black band. Always uppercase, always centered, never wraps under three lines.

### Download Store Button
**Role:** Store badge CTA used in the hero and footer to push installs

Pill shape with 160px radius, 10-12px vertical / 19px horizontal padding, 1.5px #0d0d0d border, #ffffff fill, InterDisplay 16px weight 600 label in #0d0d0d. Left-side icon (Chrome/Apple/Play/Edge) at 20-24px, then two-line label (store name bold, 'Store' on a second line lighter).

### Product Hunt Badge
**Role:** Social proof ribbon placed above the hero headline

Rounded chip with 12px radius, white fill, 1px #edeef0 border, Phudu/InterDisplay mix: small uppercase 'PRODUCT HUNT' in #0d0d0d above '#1 Product of the Day' in #0d0d0d weight 700. Yellow icon dot at the leading edge.

### Feature Band Card — Light
**Role:** First content band in the 'With SaveDay, You Can' section

Full-width container with 30px radius, 16-24px padding, #edeef0 fill, no border. Phudu 700 32px heading in #0d0d0d sits above InterDisplay 16px body in #0d0d0d. Acts as the quiet counterpart to the yellow and black bands below.

### Feature Band Card — Yellow
**Role:** Second content band — the brand-colored middle section

Same geometry as the light band (30px radius, 24px padding) but filled with #fbda5f. The yellow fill does the work of an accent border; no additional border is needed. Phudu heading in #0d0d0d reads as a highlighter mark on a printed page.

### Feature Band Card — Inverted
**Role:** Third content band — the closing pitch before the footer

30px radius, 24px padding, #000000 fill, Phudu heading in #fbda5f. The contrast flip (yellow on black) signals urgency and ends the section with a typographic exclamation.

### Trust Logo Bar
**Role:** Social proof row showing enterprise customer logos

Centered single row, InterDisplay 16px weight 500 in #0d0d0d for the caption 'Trusted by the highest performance teams at', then a horizontal flex of monochrome logo lockups (Meta, AWS, BCG, Google, Deloitte, McKinsey) rendered in #0d0d0d on #ffffff, evenly spaced with 24-40px column gaps.

### FAQ Accordion Item
**Role:** Expandable question row in the FAQ section

1600px radius pill (essentially a full pill), 12-16px vertical padding, 24px horizontal padding, #edeef0 fill, no border. InterDisplay 16px weight 500 question text in #0d0d0d on the left, square 32px expand button on the right with #999999 fill and a #ffffff down-arrow icon.

### FAQ Expand Button
**Role:** Square icon button at the right end of each FAQ row

32x32px square, 8px radius, #999999 fill, centered 16px chevron icon in #ffffff. Static (non-rotating) in the collapsed state; the row opens to reveal InterDisplay 16px body text below.

### Section Header (Sub-display)
**Role:** Smaller-scale heading used for section openers like 'With SaveDay, You Can'

Phudu 700 at 24-32px, line-height 1.0, letter-spacing -0.48 to -0.64px, #0d0d0d on white, centered. Sometimes paired with a 24px line-icon above (chat bubble for FAQ, flag for logo).

### Inverted Footer Band
**Role:** Closing CTA block before the actual footer

Full-width #000000 surface with 30px radius, 48-64px vertical padding. Phudu 700 56-64px headline in #fbda5f sits above an outlined butter-yellow pill CTA. The black-to-yellow flip is the system's signature close.

### Top Navigation Bar
**Role:** Global header across all pages

Centered, max-width 1200px, horizontal flex with 24px column gap. Left: brand logo (flag icon + 'SaveDay' wordmark in InterDisplay 20px weight 700, #0d0d0d). Center: Pricing / Blog / Help Center ghost links. Right: 'Add to Chrome' ghost button + 'Try now' butter pill CTA. Sticky, white background, 1px #edeef0 bottom border.

## Do's and Don'ts

### Do
- Set headlines in Phudu 700 at 56px or above for any hero or section opener, with line-height 0.90 and letter-spacing no looser than -0.02em
- Paint full-width feature bands in #fbda5f, #edeef0, or #000000, with 30px radius and 24-48px padding — let the band do the work of a border
- Use 160px border-radius for every pill (CTAs, store buttons, tags) and 24-30px for every rectangular card — never mix pills with square buttons
- Center-align all display text; left-align only body copy inside cards and FAQ rows
- Pull body type tight to -0.018em to -0.024em at 16-18px — the negative tracking is what makes the grotesque feel intentional rather than default
- Reserve #006aff exclusively for store-badge icons and secondary links; never use it as a section fill or primary CTA
- Alternate section bands light → yellow → black to create rhythm; the eye should always know where it is in the page

### Don't
- Don't apply drop shadows to feature bands or nav elements — the system has one shadow, used only on occasional elevated cards
- Don't use #006aff as a filled button background or as a section band fill
- Don't set body copy in Phudu — reserve Phudu strictly for display/heading sizes (24px+)
- Don't break the poster cadence with multi-column body layouts; keep text blocks centered and narrow
- Don't add a third accent color — the system is built on one yellow, one blue, and grayscale; extra hues dilute the highlighter metaphor
- Don't use fully rounded buttons (1600px) for rectangular content cards, and don't use 24px radius on pills — the radius scale is role-specific
- Don't lower contrast for 'subtle' text — Mist (#999999) is the floor; anything lighter fails accessibility against the paper background

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the baseline every section sits on |
| 1 | Fog | `#edeef0` | Soft feature band for the first content section |
| 2 | Butter Highlight | `#fbda5f` | Brand-painted section band — the chromatic punctuation between neutral bands |
| 3 | Pure Black | `#000000` | Inverted band for the closing CTA — yellow text on black delivers the final pitch |
| 4 | Charcoal | `#333333` | Deep footer surface layered above Pure Black |

## Elevation

Elevation is intentionally minimal and almost decorative — only one shadow appears in the system (rgba(0,0,0,0.2) 0px 0px 20px -16px) and it is used sparingly on cards. The design language relies on filled color bands, hard 1-2px black borders, and 24px radii to express hierarchy rather than soft drop shadows. When a surface needs to feel 'on top', it gets a band of Butter Highlight or Pure Black — not a shadow.

## Imagery

SaveDay carries no photography, no product screenshots, and no decorative illustration. The visual language is pure typographic and geometric: oversized black uppercase type, flat color bands, and a small cast of functional icons (flag for logo, chat bubble for FAQ, store logos for download CTAs, monochrome enterprise logos for the trust bar). Icons are filled, mono-weight, and rendered in #0d0d0d or #ffffff depending on surface. The poster aesthetic is the imagery — the yellow band IS the photograph, the headline IS the illustration.

## Layout

Centered, max-width 1200px page model with generous vertical breathing room (64-80px between sections). The hero is a centered stack: nav bar, small Product Hunt badge, two-line 112px Phudu headline, single-line subtext, then a horizontal flex of four download store pill buttons. The body uses full-width color bands (light gray → yellow → black) that bleed edge-to-edge with 30px inner radius, each containing a single centered heading + paragraph block. The logo trust bar is a single centered row. The FAQ section is a centered narrow column (max ~720px) of pill-shaped accordion rows. The closing footer band flips to black with a centered yellow headline and pill CTA. No sidebars, no multi-column feature grids, no asymmetry — every section is a centered horizontal slab.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0d0d0d
- background: #ffffff
- surface (light band): #edeef0
- surface (brand band): #fbda5f
- surface (inverted band): #000000
- border / hairline: #0d0d0d (1-2px)
- primary action: #fbda5f (outlined action border)

**Example Component Prompts**
1. Create an Outlined Primary Action: Transparent background, #fbda5f border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.
2. **Yellow feature band** — Full-width #fbda5f band, 30px radius, 48px vertical padding, centered content. Phudu 700 32px heading in #0d0d0d, line-height 1.0, letter-spacing -0.64px. Body in InterDisplay 16px weight 400 #0d0d0d below, max-width 520px.
3. **FAQ accordion item** — 1600px radius, 12px vertical / 24px horizontal padding, #edeef0 fill, no border. InterDisplay 16px weight 500 question text in #0d0d0d on the left, 32x32px #999999 square button on the right with a 16px white down-chevron.

## Similar Brands

- **Arc Browser** — Same poster-typography, single-accent-color discipline and oversized display headlines centered on a clean white canvas
- **Pitch (pitch.com)** — Shares the 'one saturated color band per section' rhythm and the generous pill-radius CTAs, with bold geometric type
- **Reflect Notes** — Minimal, typography-led product page with tight letter-spaced headings and a single warm accent color
- **Framer** — Near-monochrome canvas, oversized sans-serif display type, and pill-shaped CTAs in a single accent color
- **Read.cv** — Editorial, print-poster sensibility with near-black text on white and one bold accent used sparingly

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-butter-highlight: #fbda5f;
  --color-signal-blue: #006aff;
  --color-ink: #0d0d0d;
  --color-pure-black: #000000;
  --color-paper: #ffffff;
  --color-fog: #edeef0;
  --color-stone: #e5e4e3;
  --color-charcoal: #333333;
  --color-mist: #999999;
  --color-silver: #cccccc;

  /* Typography — Font Families */
  --font-phudu: 'Phudu', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-interdisplay: 'InterDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.288px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -0.64px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.12px;
  --text-display: 64px;
  --leading-display: 0.9;
  --tracking-display: -1.92px;
  --text-display-xl: 112px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -4.48px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
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
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 160px;
  --radius-full-2: 1600px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-badges: 160px;
  --radius-buttons: 160px;
  --radius-smallchips: 12px;
  --radius-featurebands: 30px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 0px 20px -16px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #edeef0;
  --surface-butter-highlight: #fbda5f;
  --surface-pure-black: #000000;
  --surface-charcoal: #333333;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-butter-highlight: #fbda5f;
  --color-signal-blue: #006aff;
  --color-ink: #0d0d0d;
  --color-pure-black: #000000;
  --color-paper: #ffffff;
  --color-fog: #edeef0;
  --color-stone: #e5e4e3;
  --color-charcoal: #333333;
  --color-mist: #999999;
  --color-silver: #cccccc;

  /* Typography */
  --font-phudu: 'Phudu', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-interdisplay: 'InterDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.288px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.96px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -0.64px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.12px;
  --text-display: 64px;
  --leading-display: 0.9;
  --tracking-display: -1.92px;
  --text-display-xl: 112px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -4.48px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 160px;
  --radius-full-2: 1600px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 0px 20px -16px;
}
```
