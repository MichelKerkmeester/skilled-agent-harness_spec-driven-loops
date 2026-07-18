# 2.AG — Style Reference
> Clinical apothecary under teal light — a measured, prescriptive wellness brand that treats the product shot like a specimen slide.

**Theme:** light

2.AG reads as a clinical apothecary crossed with a modern science brand: near-white canvas, deep teal structural surfaces, and one vivid mint accent that activates CTAs and data highlights. Inter Tight is tightened for a pharmaceutical voice — slightly negative tracking on display sizes, generous tracking on small caps for ingredient lists and badges. Components lean into large pill radii (30–50px) for buttons and soft 12–20px corners on cards, signaling a brand that is precise about dosage but warm on the body. Dark teal sections (Rapid Relief Cream header, stat blocks) ground the page in clinical authority, while bright green punctuation provides energetic, almost pharmacy-shelf accent. Layout is split, generous, and product-forward: hero pairs a dark editorial half with a bright product half, sections alternate white and teal, and reviews/stats form dense but airy card grids.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Teal | `#244d54` | `--color-deep-teal` | Primary structural color — dark hero background, stat block surfaces, icon strokes, navigation wordmark, secondary button borders. A near-gray teal that reads as ink rather than ocean, so it grounds the brand without going clinical-cold |
| Mint Pulse | `#2ecea0` | `--color-mint-pulse` | Primary action color — filled CTA backgrounds, badge fills, active dots, announcement bar, review star highlights. Bright green with cyan lean, makes every interactive element feel switched on and biological |
| Soft Teal | `#6dddbd` | `--color-soft-teal` | Teal text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Carbon | `#000000` | `--color-carbon` | Body text, hairline borders, icon strokes, input borders. The dominant structural neutral — most borders on the site are pure black, giving the UI a stark, editorial frame |
| Ink | `#151515` | `--color-ink` | Primary heading text and secondary borders. Softer than pure black for large headlines where Carbon reads as too heavy |
| Graphite | `#4d4d4d` | `--color-graphite` | Subhead text, button text on light surfaces, muted labels |
| Slate | `#858585` | `--color-slate` | Muted body text, helper copy, disabled labels, secondary icon strokes. The workhorse neutral for anything that needs to recede |
| Fog | `#999999` | `--color-fog` | Input borders, placeholder color, low-priority surface accents |
| Mist | `#e5e7eb` | `--color-mist` | Card and section dividers, subtle borders on white surfaces, separators between review cards |
| Bone | `#f0f1f2` | `--color-bone` | Lightest card and list surface — sits one step above pure white for subtle elevation on the page canvas |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text, input fills. The dominant light surface |

## Tokens — Typography

### Inter Tight — Primary brand typeface across headings, body, buttons, badges, and UI. The custom tighter cut tightens headline rhythm and gives small caps a pharmaceutical, prescription-label feel. · `--font-inter-tight`
- **Substitute:** Inter (variable), Manrope
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 24px, 30px, 36px, 45px, 62px
- **Line height:** 1.00–1.86 (tight 1.0 for caps, 1.21–1.25 for display, 1.5 for body, 1.86 for loose metadata)
- **Letter spacing:** -0.042em at display sizes, 0.005em default, 0.02–0.03em on body, 0.09–0.10em on small uppercase labels
- **OpenType features:** `"kern"`
- **Role:** Primary brand typeface across headings, body, buttons, badges, and UI. The custom tighter cut tightens headline rhythm and gives small caps a pharmaceutical, prescription-label feel.

### Inter — Secondary face used for stat block numerals and a few large product display sizes. Inter handles the very large gradient stats with clean digits that gradient-fill cleanly. · `--font-inter`
- **Substitute:** Inter Tight, system-ui
- **Weights:** 400, 500
- **Sizes:** 16px, 18px, 28px, 48px
- **Line height:** 1.10, 1.20
- **Letter spacing:** -0.042em
- **Role:** Secondary face used for stat block numerals and a few large product display sizes. Inter handles the very large gradient stats with clean digits that gradient-fill cleanly.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.86 | 1px | `--text-caption` |
| body | 16px | 1.5 | 0.08px | `--text-body` |
| subheading | 20px | 1.4 | 0.4px | `--text-subheading` |
| heading-sm | 30px | 1.3 | 0.6px | `--text-heading-sm` |
| heading | 36px | 1.25 | 0.72px | `--text-heading` |
| heading-lg | 45px | 1.21 | 0.9px | `--text-heading-lg` |
| stat-numeral | 48px | 1.1 | -2px | `--text-stat-numeral` |
| display | 62px | 1 | 1.24px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12-20px |
| badges | 50px (pill) |
| inputs | 5px |
| buttons | 30-50px (pill) |
| hero-cta | 250px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 8-16px

## Components

### Announcement Bar
**Role:** Top-of-page promo strip

Full-width band in #2ecea0 mint with 12–14px white Inter Tight text, often a truck icon + shipping promise. Height ~40px, single line, no border, sits flush above the nav.

### Top Navigation
**Role:** Primary site header

White bar, ~64px tall, with black 2.AG wordmark left, 3–5 text links (Shop, Science, Contact) in 16px Inter Tight 500 with 15–30px horizontal padding, search icon and bag icon (with 8px black dot showing item count) right-aligned. No drop shadow, hairline #e5e7eb bottom border.

### Hero Panel — Dark Half
**Role:** Left-side editorial hero

Full-height #244d54 background with 3D wireframe human figure showing glowing joints. Headline in Inter Tight 62px / 500, white, letter-spacing ~1.2px, left-aligned at 50–60% width. Pill CTA below in transparent fill with 1px #2ecea0 mint border, white text, 50px radius, 14px 48px padding.

### Hero Panel — Product Half
**Role:** Right-side product hero

Light gray/white background with circular bubble/bokeh photography behind a product tube. Product image ~60% of panel width, centered. No text overlay.

### Pill CTA — Outlined Mint
**Role:** Primary action button on dark surfaces

Transparent background, 1px #2ecea0 border, white text 16px Inter Tight 500, 50px border-radius, 14px 48px padding. Used for the hero 'Get Relief' call. Tracking is tight — almost no letter-spacing.

### Pill CTA — Filled Mint
**Role:** Primary action on light surfaces

Solid #2ecea0 background, white text, 30–50px radius, 12–16px vertical and 24–48px horizontal padding. Used for 'Add to bag' and review prompt CTAs.

### Pill Badge — Mint
**Role:** Dosage and feature tags

30–50px radius, 8px 16px padding, #2ecea0 fill, white 12–14px Inter Tight 600 text. Used for '10,000 MG', '1000 MG', and active filter chips.

### Product Card
**Role:** PDP product image and box presentation

White #f0f1f2 background panel, 20px border-radius, 20–24px internal padding, 1px #e5e7eb hairline border. Holds the cream tube + outer box on a light stage. No shadow — relies on border for edge.

### Ingredient Feature Row
**Role:** Highlighted property list inside PDP

Stacked rows with ~56px height each, separated by 1px #e5e7eb hairline. Large 18–20px Inter Tight 500 in Deep Teal #244d54 for the value ('2 cannabinoids', '5 key ingredients'), 12–13px muted text in #858585 for the descriptor below.

### Review Card
**Role:** Customer testimonial tile

White card on #f0f1f2 background, 12–20px radius, 1px #e5e7eb border, 20–24px padding. 5 mint stars top, 18–20px quote in Inter Tight 500 Ink #151515, reviewer name in 12–13px Slate #858585 with a small mint checkmark for verified buyers.

### Video Review Card
**Role:** Playable customer testimonial

Same dimensions and styling as Review Card but holds a 9:16 vertical video poster with a centered white circular play button outlined in 1px mint. Replaces quote text with thumbnail.

### Stat Block
**Role:** Large numerical proof point

Deep Teal #244d54 background, 20px radius, 40–60px padding. Headline numeral 48–62px in a vertical gradient from Soft Teal #6dddbd to Mint #2ecea0, applied as a CSS background-clip text fill. Percent sign 24–30px in white, sitting at top-right of the numeral.

### Input Field
**Role:** Form input

White fill, 1px #999999 border, 5px radius, 12–16px padding, 14–16px Inter Tight 400 text in Carbon #000000. Placeholder in #999999. No visible focus ring in extracted data — relies on border thickening or state change.

### Review Marquee Row
**Role:** Auto-scrolling verified review strip

Single horizontal row at the top of the reviews section, 5-star header left-aligned, then inline reviewer quotes in Inter Tight 14–15px, 500, Carbon — separated by bullets, all caps spaced ~0.05em.

### Nav Text Link
**Role:** Top-level navigation item

16px Inter Tight 500 Carbon #000000, no underline, 15–30px horizontal padding, 7px vertical padding. Active state would shift to Deep Teal #244d54.

## Do's and Don'ts

### Do
- Use Inter Tight at weight 500 for all headlines and CTAs; reserve weight 600 for badges and active filter chips
- Apply the Mint #2ecea0 only for filled actions, active dots, and dosage badges — never as body text on white
- Use Deep Teal #244d54 as the background for any section that introduces a proof point, statistic, or scientific claim
- Set all primary action buttons to pill radii between 30px and 50px — the roundness signals the body-care category
- Apply letter-spacing of 0.09–0.10em on all uppercase labels and ingredient callouts at 10–12px to get the prescription-label rhythm
- Use the #6dddbd-to-#2ecea0 vertical gradient via background-clip text only on large stat numerals (48px+); never on body copy
- Keep section backgrounds alternating between Paper #ffffff and Deep Teal #244d54 to maintain the clinical, rhythmic page scan

### Don't
- Do not introduce new chromatic colors — the system is deliberately two-tone (Deep Teal + Mint) on a neutral scale
- Do not use sharp 0–4px radii on buttons or badges; the brand's softness is carried by pill shapes
- Do not place Mint text on white at body sizes below 16px — the contrast drops below accessible thresholds
- Do not use heavy box shadows for elevation; the design system relies on hairline #e5e7eb or #000000 borders and surface color shifts
- Do not mix Inter and Inter Tight within the same line of text — pick one face per content block
- Do not use letter-spacing tighter than -0.05em at sizes below 24px — the small-size tight tracking will collide glyphs
- Do not add decoration outside the existing palette (no purples, reds, or warm neutrals); the cold teal system is the brand

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Default body background and main content area |
| 2 | Soft Card | `#f0f1f2` | Subtle elevation for review list rows and secondary card groups |
| 3 | Structural Dark | `#244d54` | Hero left panel, stat blocks, deep editorial sections |
| 4 | Highlight Wash | `#2ecea0` | Announcement bar and pill badge fills for active emphasis |

## Elevation

The design system deliberately avoids box shadows. All depth is communicated through hairline 1px borders (#e5e7eb on white surfaces, #000000 on neutral fills) and tonal surface steps from Paper #ffffff to Bone #f0f1f2 to Deep Teal #244d54. This is a clinical, flat aesthetic — the product does the heavy lifting, the chrome stays out of the way.

## Imagery

Imagery is sparse and product-led. Hero combines a 3D wireframe human figure with glowing pain-point nodes (deep teal stage, mint glow accents) against a product photograph with bubble/serum bokeh on white. PDP uses clean product-on-white photography of the cream tube and outer carton with no lifestyle context. No human lifestyle photography appears; the science diagram and the object shot are the only visual languages. Icon style is thin-line 1px stroke monochrome, mostly white on teal or black on white. Decorative star fields in the stat blocks carry no extra imagery — the large gradient numerals do the visual work.

## Layout

Max-width 1280px centered container, with full-bleed dark/light split hero as the only section that breaks out. Hero is a 50/50 split: dark teal editorial panel left, bright product panel right. Subsequent sections alternate Paper #ffffff and Deep Teal #244d54 in horizontal bands. Content blocks use 2-column asymmetric (image left, copy right) for product, and 4–5 column card grids for reviews, with one slot swapped for a vertical video card. Stats section is a 3-column grid of large gradient numerals on deep teal. Vertical rhythm is generous — ~64px between major sections, ~24px within cards. No sidebar; navigation is a single top bar. Bottom review marquee scrolls horizontally above the card grid.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (body) / #151515 (headings) / #858585 (muted)
- background: #ffffff (canvas) / #f0f1f2 (soft card) / #244d54 (structural dark)
- border: #e5e7eb (hairline on light) / #000000 (structural) / #999999 (input)
- accent: #2ecea0 Mint Pulse
- primary action: #2ecea0 (filled action)
- gradient text: linear-gradient #6dddbd → #2ecea0 for stat numerals

**Example Component Prompts**

1. Build a hero section. Split 50/50: left half #244d54 with a 3D wireframe human figure; headline 'A breakthrough in topical cannabinoids' in Inter Tight 500, 62px, white, letter-spacing 1.2px. Below it a pill CTA with transparent background, 1px #2ecea0 border, white 16px text, 50px radius, 14px 48px padding. Right half white with circular bubble bokeh and the product tube centered at 60% panel width.

2. Build a stat row. 3 columns of stat blocks on #244d54 background, 20px radius, 48px padding. Each shows a numeral (93%, 99%, 0%) at 62px Inter weight 500 with a #6dddbd→#2ecea0 vertical gradient via background-clip text, percent sign 24px white at top-right, white caption 12px below in 0.09em tracked caps.

3. Build a review card. White #ffffff background, 12px radius, 1px #e5e7eb border, 20px padding. Five #2ecea0 stars at 14px, then 18px Inter Tight 500 quote in #151515, then 12px #858585 reviewer name with a small mint checkmark icon to indicate verified.

4. Build a dosage badge. #2ecea0 background, 50px radius, 8px 16px padding, white text '10,000 MG' at 12px Inter Tight 600 with 0.05em tracking.

5. Build a product PDP section. Left column: white #f0f1f2 panel, 20px radius, 24px padding, holds the cream tube image centered. Right column: 36px Inter Tight 500 product name in #151515, 5 mint stars + review count, a Mint Pulse dosage badge, 16px body in #000000, then a stacked feature list with 1px #e5e7eb row dividers and 20px Inter Tight 500 feature text in #244d54.

## Similar Brands

- **Athletic Greens / AG1** — Same clinical wellness language: white canvas, deep teal-green structural surfaces, bright green CTA, pill-shaped buttons, and ingredient-badge hierarchy
- **Hilma** — Pharmaceutical-adjacent branding with uppercase tracked labels, deep teal accents, and split editorial hero
- **Care/of** — Direct-to-consumer wellness with clean sans-serif, soft card surfaces, and a single bright accent for dosage and CTA
- **Cuup** — Minimalist product-led hero with oversized pill CTA, editorial split panels, and editorial uppercase tracked labels
- **Recess** — Modern apothecary feel with deep cool brand color, generous white space, and small uppercase tracked metadata

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-teal: #244d54;
  --color-mint-pulse: #2ecea0;
  --color-soft-teal: #6dddbd;
  --color-carbon: #000000;
  --color-ink: #151515;
  --color-graphite: #4d4d4d;
  --color-slate: #858585;
  --color-fog: #999999;
  --color-mist: #e5e7eb;
  --color-bone: #f0f1f2;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-inter-tight: 'Inter Tight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.86;
  --tracking-caption: 1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.08px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.6px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: 0.72px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.21;
  --tracking-heading-lg: 0.9px;
  --text-stat-numeral: 48px;
  --leading-stat-numeral: 1.1;
  --tracking-stat-numeral: -2px;
  --text-display: 62px;
  --leading-display: 1;
  --tracking-display: 1.24px;

  /* Typography — Weights */
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
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 50px;
  --radius-full-2: 250px;

  /* Named Radii */
  --radius-cards: 12-20px;
  --radius-badges: 50px (pill);
  --radius-inputs: 5px;
  --radius-buttons: 30-50px (pill);
  --radius-hero-cta: 250px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-soft-card: #f0f1f2;
  --surface-structural-dark: #244d54;
  --surface-highlight-wash: #2ecea0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-teal: #244d54;
  --color-mint-pulse: #2ecea0;
  --color-soft-teal: #6dddbd;
  --color-carbon: #000000;
  --color-ink: #151515;
  --color-graphite: #4d4d4d;
  --color-slate: #858585;
  --color-fog: #999999;
  --color-mist: #e5e7eb;
  --color-bone: #f0f1f2;
  --color-paper: #ffffff;

  /* Typography */
  --font-inter-tight: 'Inter Tight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.86;
  --tracking-caption: 1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.08px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.6px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: 0.72px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.21;
  --tracking-heading-lg: 0.9px;
  --text-stat-numeral: 48px;
  --leading-stat-numeral: 1.1;
  --tracking-stat-numeral: -2px;
  --text-display: 62px;
  --leading-display: 1;
  --tracking-display: 1.24px;

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
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 50px;
  --radius-full-2: 250px;
}
```
