# Employment Hero — Style Reference
> violet ink on white parchment

**Theme:** light

Employment Hero projects a confident, AI-forward HR platform identity built on extreme typographic weight contrast: Saiga at 800–1000 weight delivers near-black display headlines that dominate white canvases, while DM Sans at 400–500 keeps interface text light and approachable. The visual system is anchored by a single vivid violet (#7622d7) that appears as compact filled pills, thin borders, and icon strokes — never as broad color washes — creating a 'punctuation' effect where color marks intent rather than fills space. Surfaces layer in three violet-tinted steps (#ffffff → #f9f5ff → #f0e6fa) giving the impression of a very pale lavender atmosphere without ever feeling decorative. Components are deliberately geometric: 32px pill buttons, 8–12px card corners, generous 16–24px padding, and 1px hairline borders over soft backgrounds — the result feels like a precise technical document that learned to wear soft clothing.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hero Violet | `#7622d7` | `--color-hero-violet` | Primary action fills, active nav, link text, icon strokes, key borders — concentrated violet that signals interactivity and energy against the achromatic canvas |
| Lavender Wash | `#f9f5ff` | `--color-lavender-wash` | Soft section backgrounds, card fills, hover surfaces — barely-there violet tint that creates atmospheric depth without committing to color |
| Lilac Bloom | `#f0e6fa` | `--color-lilac-bloom` | Slightly stronger lavender for tagged surfaces, highlighted cards, badge backgrounds |
| Periwinkle Veil | `#e6d5fe` | `--color-periwinkle-veil` | Outlined action borders, soft decorative borders, glow/shadow tints — a mid-violet for quieter emphasis |
| Ink Black | `#000000` | `--color-ink-black` | Primary headings, dominant body text, high-contrast borders, footer surfaces — the load-bearing neutral |
| Carbon | `#121214` | `--color-carbon` | Secondary headings, dark UI blocks, badge text on light fills |
| Graphite | `#27272a` | `--color-graphite` | Input field text, subdued body text, card detail labels |
| Iron | `#5a5b5f` | `--color-iron` | Mid-tone icon strokes, secondary metadata, less prominent UI labels |
| Slate | `#71717a` | `--color-slate` | Muted body text, helper text, placeholder text, tertiary labels |
| Mist | `#a9a9b2` | `--color-mist` | Input borders, disabled states, de-emphasized dividers |
| Fog | `#e4e4e7` | `--color-fog` | Hairline dividers, card borders, structural separators |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text on violet fills, input fields |
| Highlight Gold | `#ffefa7` | `--color-highlight-gold` | Accent surface for special callouts, limited-use highlight wash (badge spotlight or feature emphasis) |
| Lime Pulse | `#94e022` | `--color-lime-pulse` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Aurora Violet | `linear-gradient(90deg, #9a58fc, #70ddff, #e6d5fe, #bafc58, #9a58fc)` | `--color-aurora-violet` | Gradient stops for hero washes and decorative banners |

## Tokens — Typography

### DM Sans — UI and body workhorse. Weight 400 for body copy, 500 for emphasized text, 600 for subheadings, 700 for compact button labels. Neutral letter-spacing (normal) keeps long-form readable. Handles everything Saiga leaves behind — navigation, form fields, cards, tables, footnotes. · `--font-dm-sans`
- **Substitute:** Inter (400, 500, 600, 700)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 24px, 28px, 36px
- **Line height:** 1.00–1.67
- **Role:** UI and body workhorse. Weight 400 for body copy, 500 for emphasized text, 600 for subheadings, 700 for compact button labels. Neutral letter-spacing (normal) keeps long-form readable. Handles everything Saiga leaves behind — navigation, form fields, cards, tables, footnotes.

### Saiga — Display and heading typeface. Custom geometric sans at extreme weights (800–1000) creates near-black slab headlines. Tight negative tracking (-0.002em to -0.008em) tightens letterforms at scale. Used only for marketing-facing headlines and the largest type moments — never for UI or body text. · `--font-saiga`
- **Substitute:** Plus Jakarta Sans (800, 900)
- **Weights:** 800, 900, 1000
- **Sizes:** 32px, 38px, 42px, 60px, 80px
- **Line height:** 1.06–1.14
- **Letter spacing:** -0.64px at 80px, -0.42px at 60px, -0.252px at 42px, -0.19px at 38px, -0.096px at 32px
- **Role:** Display and heading typeface. Custom geometric sans at extreme weights (800–1000) creates near-black slab headlines. Tight negative tracking (-0.002em to -0.008em) tightens letterforms at scale. Used only for marketing-facing headlines and the largest type moments — never for UI or body text.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400, 600
- **Sizes:** 13px, 16px
- **Line height:** 1, 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| tiny | 10px | 1 | — | `--text-tiny` |
| small | 12px | 1.67 | — | `--text-small` |
| caption | 14px | 1.55 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.43 | — | `--text-body` |
| subheading | 32px | 1.14 | -0.096px | `--text-subheading` |
| heading-sm | 38px | 1.1 | -0.19px | `--text-heading-sm` |
| heading | 42px | 1.1 | -0.25px | `--text-heading` |
| heading-lg | 60px | 1.08 | -0.42px | `--text-heading-lg` |
| display | 80px | 1.06 | -0.64px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| badges | 8px |
| inputs | 8px |
| buttons | 32px |
| listItems | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Pill Button
**Role:** Main call-to-action (Request a demo, Learn more)

Filled #7622d7 background, #ffffff text, 32px border-radius (full pill), 12px 16px padding, DM Sans 14–16px weight 700. Arrow icon in white at trailing edge. No shadow — depth comes from the saturated fill against the achromatic canvas.

### Outlined Ghost Button
**Role:** Secondary action on light surfaces

Transparent fill, 1px #e6d5fe border, #7622d7 text, 32px radius, 12px 16px padding, DM Sans 14px weight 600. Inherits a Periwinkle Veil border to keep the violet language even when the button doesn't commit to a fill.

### Dark Pill Button
**Role:** Inverse CTA (e.g. notification bar 'Learn more')

White fill, #000000 text, 32px radius, 6px 12px padding, DM Sans 13–14px weight 600. The notification bar's compact white pill is the smallest-scale button variant — it sits on a dark violet band and reads as a single bright spot.

### Hero Section
**Role:** Above-the-fold headline and CTA

White canvas, centered content stack. Eyebrow label in DM Sans 12–14px weight 500 with #7622d7 text inside a #f9f5ff rounded pill (1px border). Display headline in Saiga 80px weight 900, #000000, letter-spacing -0.64px, two-line stack. Subheadline in DM Sans 18px weight 400, #27272a, max-width ~640px. Primary CTA centered below.

### Audience Card
**Role:** Three-column persona cards (For Businesses / Employees / Job Seekers)

#f9f6ff or #f0e6fa background, 12–20px radius, 24px padding. Bold black title in Saiga 32px, primary violet 'Learn more' pill button. Product screenshot or illustration inset below. No shadow — separation is achieved through the lavender fill and 1px #e4e4e7 border at most.

### Notification Bar
**Role:** Top promotional strip

Dark violet background (~#2d0a5 or near-black violet), white DM Sans 13–14px text, 6–8px vertical padding, centered horizontally. Contains a compact white pill CTA at the right.

### Social Proof Strip
**Role:** Review platform logos beneath hero

White background, single row of platform marks (Capterra, Trustpilot, Google) with small star ratings in DM Sans 12px weight 400 #5a5b5f. No card wrapper — logos sit directly on the canvas with 32–48px horizontal gaps.

### Customer Logo Carousel
**Role:** Brand trust strip

Section with small uppercase eyebrow label 'TRUSTED BY 300K+ HAPPY CUSTOMERS' in DM Sans 12px weight 600 #71717a, letter-spacing +0.5px. Logos rendered in monochrome #27272a or #5a5b5f, evenly spaced in a single row with chevron navigation arrows on either end.

### Text Input
**Role:** Form fields

1px #e4e4e7 border, 8px radius, 12px 16px padding. Placeholder in #a9a9b2 DM Sans 14–16px. Active value in #27272a. Focus state shifts border to #7622d7 with optional subtle #e6d5fe ring.

### Tag / Pill Badge
**Role:** Inline labels, taxonomy tags

9999px radius, 4–8px vertical padding, 8–12px horizontal padding, DM Sans 10–12px weight 500. Filled variants: #f9f5ff bg with #7622d7 text. Outlined: 1px #e6d5fe border with #7622d7 text.

### Footer Link List
**Role:** Site map navigation

DM Sans 14–16px weight 400 #71717a link color, 8–12px row gap. Hover shifts to #7622d7. No underlines; weight contrast signals interactivity.

### Star Rating Cluster
**Role:** Review display (Capterra, Trustpilot)

5 stars in #ffefa7 gold with hollow-fill star for partial rating, followed by DM Sans 12px weight 400 #5a5b5f descriptor. Stars are typically 12–14px glyphs, no text between them.

### Region Switcher
**Role:** Country selector in header

Outlined button with 1px #e4e4e7 border, 8px radius, DM Sans 14px weight 400, #27272a text. Country name in bold, 'Change Region' label in normal weight inside a small dropdown container.

## Do's and Don'ts

### Do
- Use Saiga 800–1000 weight for any display headline above 32px; pair it with tight negative tracking per the type scale
- Apply #7622d7 as a concentrated accent — filled pills, link text, active icon strokes — not as broad surface fills
- Layer surfaces using the lavender stack: #ffffff → #f9f5ff → #f0e6fa, never introduce neutral grays for section backgrounds
- Use 32px border-radius for all primary interactive elements (buttons, tag-like links) to reinforce the pill language
- Set button padding to 12px 16px and maintain 700 weight DM Sans for filled CTAs to preserve the compact confident button
- Let headings and body copy sit directly on white with no card wrappers — only surround content in lavender cards when the content needs visual grouping
- Use 1px hairline borders in #e4e4e7 for structural separation; avoid box-shadows to maintain the flat precise feel

### Don't
- Don't use Saiga at weights below 700 or for body copy — its geometric character only works at scale
- Don't dilute #7622d7 with opacity washes, tints, or desaturated variants for backgrounds; the violet must remain a single committed hue
- Don't use square corners (0–4px) for any user-facing interactive element; the system is built on 8px minimum and 32px for actions
- Don't apply box-shadows to cards or buttons — separation comes from fill color and 1px borders only
- Don't mix #000000 and #121214 arbitrarily; reserve #000000 for the highest-emphasis headings and #121214 for secondary dark text and dark surfaces
- Don't introduce additional accent hues; lime green (#94e022) and gold (#ffefa7) are reserved for status/emphasis only, never for decoration
- Don't stretch DM Sans beyond 36px — display moments always belong to Saiga

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary page canvas and base reference surface |
| 1 | Lavender Mist | `#f9f5ff` | Soft section background that hints at violet without being explicit |
| 2 | Lilac Bloom | `#f0e6fa` | Highlighted cards, tagged surfaces, elevated callouts |
| 3 | Aurora Wash | `#e6d5fe` | Decorative gradient surface, hero ambient backgrounds |
| 4 | Highlight Gold | `#ffefa7` | Special accent surface for limited-use emphasis |

## Elevation

The system is essentially flat. Elevation is communicated through fill color shifts in the lavender surface stack (white → #f9f5ff → #f0e6fa) and 1px hairline borders in #e4e4e7. No drop shadows are used on cards, buttons, or any interactive element. The only shadow-like effect detected (#e6d5fe glow on certain hover states) is a soft violet tint, not a directional shadow. This flatness is deliberate: it keeps the heavy Saiga headlines as the sole focal point and prevents the interface from feeling layered or busy.

## Imagery

Imagery is product-led and illustration-augmented. The hero uses a wide cinematic photograph (person at desk with tablet) softened by a duotone-like overlay of violet and cyan — a stylized composite of floating app icons (calendar, job board, data, messaging) suggests a connected ecosystem. Below the hero, audience cards embed realistic product UI mockups (dashboard snippets, mobile screens, candidate profiles) rendered with soft drop-shadow or floating depth against lavender fills. A small green character mascot appears as a section accent between the hero and the audience cards. Iconography throughout is two-tone filled glyphs in app-icon style, used in the hero photograph and in product cards. Photography is warm-toned, slightly desaturated, and treated with colored overlay washes rather than raw edges.

## Layout

Page is a centered max-width container (~1200px) with full-width sections. The hero is a centered single-column stack: eyebrow pill, massive two-line Saiga headline, subheadline paragraph, single primary CTA. Below the hero sits a full-bleed cinematic image band, then a compact social proof row, then a mascot-led transition into a 3-column audience card grid (equal-width cards, 24px gutter, identical structure). The customer logo strip is a single full-width row with chevron controls. Section rhythm is consistent: 80px vertical gaps between major bands, alternating white and #f9f5ff/lavender backgrounds create gentle visual separation. Navigation is a minimal top bar: logo left, three or four text links center, search + login right. No sidebar, no sticky header complexity. Content is always centered on the page axis; asymmetric layouts are absent.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #000000
- text (secondary): #27272a
- text (muted): #71717a
- background: #ffffff
- surface (soft): #f9f5ff
- surface (accent): #f0e6fa
- border (hairline): #e4e4e7
- accent (brand): #7622d7
- primary action: #7622d7 (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #7622d7 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Audience Card**: #f0e6fa background, 12px radius, 24px padding. Title in Saiga 32px weight 800, #000000, letter-spacing -0.096px. Subtitle in DM Sans 16px weight 400, #27272a. Filled violet 'Learn more' pill button (#7622d7, 32px radius, white text, 700 weight). Product screenshot inset below the text block with soft natural integration.


4. **Social Proof Row**: White background, single horizontal row, 48px gaps between platform logos (Capterra, Trustpilot, Google). Stars in #ffefa7 gold, DM Sans 12px weight 400 #5a5b5f for rating labels.

5. **Customer Logo Strip**: Eyebrow label 'TRUSTED BY 300K+ HAPPY CUSTOMERS' — DM Sans 12px weight 600, #71717a, letter-spacing +0.5px, centered. Logo row in monochrome #27272a, evenly spaced, with light chevron nav controls on either end.

## Gradient System

Gradients are used sparingly and always in the brand-violet family. The primary multi-stop gradient runs #9a58fc → #70ddff → #e6d5fe → #bafc58 → #9a58fc, suitable for hero ambient backgrounds, decorative banners, or section transition washes. A radial variant pairs #9a58fc with #70ddff for circular spotlight effects. Soft linear washes transition from white (#ffffff) to #e6d5fe for upward-fading section backgrounds. Gradients are never applied to text, never used as button fills, and should occupy at most 10–15% of any given page's visual area.

## Similar Brands

- **Deel** — Same single-violet accent strategy with pill CTAs and centered SaaS hero patterns
- **Rippling** — Identical lavender surface layering and minimal-border card treatment
- **Gusto** — HR/people-ops space with light canvas, violet brand accent, and rounded pill buttons
- **BambooHR** — Clean white SaaS hero with single-color accent and flat component treatment
- **Linear** — Disciplined typographic hierarchy with weight contrast as the primary design move

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hero-violet: #7622d7;
  --color-lavender-wash: #f9f5ff;
  --color-lilac-bloom: #f0e6fa;
  --color-periwinkle-veil: #e6d5fe;
  --color-ink-black: #000000;
  --color-carbon: #121214;
  --color-graphite: #27272a;
  --color-iron: #5a5b5f;
  --color-slate: #71717a;
  --color-mist: #a9a9b2;
  --color-fog: #e4e4e7;
  --color-paper: #ffffff;
  --color-highlight-gold: #ffefa7;
  --color-lime-pulse: #94e022;
  --color-aurora-violet: #9a58fc;
  --gradient-aurora-violet: linear-gradient(90deg, #9a58fc, #70ddff, #e6d5fe, #bafc58, #9a58fc);

  /* Typography — Font Families */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saiga: 'Saiga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-tiny: 10px;
  --leading-tiny: 1;
  --text-small: 12px;
  --leading-small: 1.67;
  --text-caption: 14px;
  --leading-caption: 1.55;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.43;
  --text-subheading: 32px;
  --leading-subheading: 1.14;
  --tracking-subheading: -0.096px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.19px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -0.25px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -0.42px;
  --text-display: 80px;
  --leading-display: 1.06;
  --tracking-display: -0.64px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
  --font-weight-w1000: 1000;

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
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-full: 50px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-badges: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 32px;
  --radius-listitems: 8px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-lavender-mist: #f9f5ff;
  --surface-lilac-bloom: #f0e6fa;
  --surface-aurora-wash: #e6d5fe;
  --surface-highlight-gold: #ffefa7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hero-violet: #7622d7;
  --color-lavender-wash: #f9f5ff;
  --color-lilac-bloom: #f0e6fa;
  --color-periwinkle-veil: #e6d5fe;
  --color-ink-black: #000000;
  --color-carbon: #121214;
  --color-graphite: #27272a;
  --color-iron: #5a5b5f;
  --color-slate: #71717a;
  --color-mist: #a9a9b2;
  --color-fog: #e4e4e7;
  --color-paper: #ffffff;
  --color-highlight-gold: #ffefa7;
  --color-lime-pulse: #94e022;
  --color-aurora-violet: #9a58fc;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saiga: 'Saiga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-tiny: 10px;
  --leading-tiny: 1;
  --text-small: 12px;
  --leading-small: 1.67;
  --text-caption: 14px;
  --leading-caption: 1.55;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.43;
  --text-subheading: 32px;
  --leading-subheading: 1.14;
  --tracking-subheading: -0.096px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.19px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -0.25px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -0.42px;
  --text-display: 80px;
  --leading-display: 1.06;
  --tracking-display: -0.64px;

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
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-full: 50px;
  --radius-full-2: 9999px;
}
```
