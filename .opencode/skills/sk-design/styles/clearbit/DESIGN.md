# Clearbit — Style Reference
> data observatory on cloud paper — a room-bright, near-acromatic canvas where midnight ink and a single blue current do all the work.

**Theme:** light

Clearbit reads as a blueprint rendered on white linen: an almost purely achromatic canvas where a single midnight-navy ink carries every word, and one electric blue fires only on actions. The interface floats — product cards, data records, score badges — suspended on a barely-there lavender wash that whispers data-warehouse more than SaaS-template. Typography is InterVar at its most restrained: generous weight range but headlines carry the same navy as body, so hierarchy comes from size and tracking, not color. The product IS the hero: screenshots of company profiles, enrichment tables, and scoring chips do the talking that stock photography would in a less confident design. Components are flat, thin-bordered, and soft-cornered; the only shadow in the system is a deep-blue focus ring, not a drop shadow — elevation is expressed through layering on subtle background tints, not through depth.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#091135` | `--color-midnight-ink` | Primary text, headings, nav, body, link color — the dominant ink of the entire interface, set against white and pale-lavender surfaces |
| Electric Blue | `#0f77ff` | `--color-electric-blue` | Blue outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Cobalt Surface | `#127ee3` | `--color-cobalt-surface` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Slate | `#36394a` | `--color-slate` | Secondary muted text where Midnight Ink would be too heavy — metadata, timestamps, helper copy |
| Frost Border | `#e1e9f0` | `--color-frost-border` | Hairline borders on cards, inputs, dividers, and table edges — the structural line color of the entire system |
| Mist | `#b1bbcd` | `--color-mist` | Soft shadow tone and secondary neutral — used in focus glows and deeper dividers |
| Graphite | `#000000` | `--color-graphite` | Icon fills, deep dividers, and absolute-dark accents — used sparingly where Midnight Ink still feels too soft |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces on tinted sections, text on dark buttons |
| Lavender Wash | `#f5f3ff` | `--color-lavender-wash` | Section background tint that signals content zones — the softest product-surface elevation above the white canvas |

## Tokens — Typography

### InterVar — Sole typeface — used for nav, body, buttons, headings, everything. The signature is its tracking behavior: positive letter-spacing that widens with size (0.004em body → 0.018em display), giving large headlines a slightly diffused, architectural feel rather than the dense negative-tracked look of typical SaaS displays. · `--font-intervar`
- **Substitute:** Inter (variable), or system-ui as fallback
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 16, 18, 32, 56, 64
- **Line height:** 1.25, 1.43, 1.50
- **Letter spacing:** 0.0040em at 14px → 0.0180em at 64px (tracking opens with size, opposite of most display type)
- **Role:** Sole typeface — used for nav, body, buttons, headings, everything. The signature is its tracking behavior: positive letter-spacing that widens with size (0.004em body → 0.018em display), giving large headlines a slightly diffused, architectural feel rather than the dense negative-tracked look of typical SaaS displays.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | 0.056px | `--text-caption` |
| body | 16px | 1.5 | 0.128px | `--text-body` |
| subheading | 18px | 1.5 | 0.252px | `--text-subheading` |
| heading-sm | 32px | 1.25 | 0.512px | `--text-heading-sm` |
| heading | 56px | 1.25 | 1.008px | `--text-heading` |
| display | 64px | 1.25 | 1.152px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(15, 119, 255) 0px 0px 0px 1px, rgba(12, 43, 100, 0.32...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8-20px

## Components

### Top Navigation Bar
**Role:** Site header with brand mark and primary action

Full-width white bar, 8px vertical padding, logo left in Midnight Ink with a pale-blue logomark, CTA right. No visible border-bottom — floats on white canvas.

### Primary Action Button (Filled)
**Role:** The sole chromatic button — login, CTA, submit

Cobalt Surface (#127ee3) background, white text, 8px radius, InterVar 500 at 16px, 12px vertical / 20px horizontal padding, white text color. On focus: Electric Blue 1px ring with deep-blue shadow stack.

### Outlined Ghost Button
**Role:** Secondary action in nav or inline

Transparent fill, Frost Border (#e1e9f0) 1px stroke, 8px radius, Midnight Ink text, same padding as filled button. Restrained — the eye should land on the filled blue first.

### Hero Headline Block
**Role:** Centered opening statement on the page

Display weight (64px) or Heading (56px) InterVar, Midnight Ink, letter-spacing 0.018em, centered alignment. Subhead in body 18px Slate. No background, floats on white.

### Product Showcase Card
**Role:** Floating product UI mockup (PayPay card, Slack record)

White card, 12px radius, Frost Border 1px, 24px padding, no shadow. Contains tabular data, attribute rows, or brand logos. The card IS the visual — minimal chrome around it.

### Data Record Row
**Role:** Enrichment attribute rows inside product cards (Employees, Role, Revenue, Industry)

16px InterVar, Slate (#36394a) label left-aligned, Midnight Ink value right-aligned, 12px vertical row gap, Electric Blue checkmark icons in the leading column. No dividers between rows.

### Section Tag / Eyebrow
**Role:** Small uppercase label above section headings (e.g. 'Focus on what matters')

InterVar 14px weight 500, Midnight Ink, letter-spacing 0.004em. Often sits as plain text rather than a pill, directly above the section heading.

### Pill Badge (Lavender)
**Role:** Inline section identifier (e.g. 'Data for leads, contacts, and accounts')

Lavender Wash (#f5f3ff) background, Midnight Ink text at 14px weight 500, 9999px radius, 8px vertical / 16px horizontal padding. Soft, non-urgent.

### Score Indicator Badge
**Role:** Circular score chip (e.g. 96) attached to product cards

White circle ~40px diameter, Frost Border 1px, Electric Blue numeric text at 18px weight 600, slight shadow. Sits as a corner anchor on the parent card.

### Brand Logo Lockup Card
**Role:** Customer/partner brand tile inside product cards

White surface, brand logo left, attribute table right, no border around the brand mark itself. The Slack card uses a 4-color Slack mark; the PayPay card uses a red square mark — brand color is allowed only inside these mockups.

### Data Table / Record Card (PayPay style)
**Role:** Structured company data display (Type, Industry, Parent, Ultimate Parent, Tech)

White card, 12px radius, 24px padding, two-column attribute grid with Slate labels and Midnight Ink values, red brand mark anchored top-left, soft red CTA button bottom-left.

### Lavender Section Background
**Role:** Full-bleed tinted zone that frames product showcase areas

Lavender Wash (#f5f3ff) fills the section, product cards float white on top. Soft top/bottom transition into white — no hard borders between sections.

### Logo Mark (Clearbit)
**Role:** Brand logomark in nav

Pale-blue rounded square containing a white 'C' notch, paired with Midnight Ink wordmark 'Clearbit' at 18px weight 600 and a smaller 'by HubSpot' subtitle in Slate.

## Do's and Don'ts

### Do
- Use Midnight Ink (#091135) for all primary text and headings — never let body color drift to true black for long passages
- Reserve Electric Blue (#0f77ff / #127ee3) exclusively for primary actions, focus rings, and check icons — one signal per screen
- Express section separation through Lavender Wash (#f5f3ff) backgrounds and Frost Border (#e1e9f0) hairlines, never through drop shadows
- Set headings in InterVar weight 500–600 at 32/56/64px with 0.016–0.018em tracking — the widened tracking is the signature, don't tighten it
- Use 12px radius for all cards and 8px for buttons, inputs, and nav elements — the 4px gap between these two radii is deliberate
- Show the product in hero zones: float real UI mockups (data tables, score chips, enrichment rows) on Lavender Wash instead of abstract illustrations
- Keep section vertical rhythm at 64px between major zones, 20–24px between headline and subhead, 8px between metadata lines

### Don't
- Don't add drop shadows to resting cards or panels — the system uses surface tinting and hairline borders for depth, not shadow stacks
- Don't introduce a second accent color — the entire chromatic budget is one blue, applied sparingly
- Don't use negative letter-spacing on display type — the system intentionally opens tracking as size increases
- Don't set body text below 14px or use weight 700 for anything longer than a single word — weight 400–500 carries the voice
- Don't use pure black (#000000) for long-form text — Midnight Ink (#091135) is the ink, black is reserved for icon fills
- Don't break the radius scale — cards at 12px, buttons/inputs at 8px, tags at 9999px; no intermediate values like 10px or 16px
- Don't use heavy gradients or decorative backgrounds — the system is flat; the only gradient language is the subtle Lavender Wash zone transitions

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas, default body background |
| 1 | Lavender Wash | `#f5f3ff` | Section background tint for product showcase zones |
| 2 | Card | `#ffffff` | Product cards and data record surfaces floating over the lavender wash |
| 3 | Cobalt Surface | `#127ee3` | Primary action button fill |

## Elevation

- **Focused/active input or button:** `0px 0px 0px 1px rgb(15, 119, 255), 0px 1px 2px 0px rgba(12, 43, 100, 0.32), 0px 6px 16px 0px rgba(12, 43, 100, 0.32)`

## Imagery

Imagery is product-screenshot-as-hero — the page shows the actual product UI (enrichment tables with Type/Industry/Parent columns, Slack data records with 4 attribute rows, PayPay company cards with red brand marks) floating on soft Lavender Wash backgrounds. No stock photography, no abstract 3D renders, no lifestyle imagery. The visual language is documentary: the product proves itself by being visible. Brand logos inside mockups retain their original colors (Slack's 4-color mark, PayPay's red), which is the one place the system permits chromatic freedom — but only inside the product's own frame. Iconography is minimal and geometric: Electric Blue checkmarks, simple outline arrows, a 'C' notch logomark.

## Layout

Max-width ~1200px centered container, full-bleed sections that alternate between pure white and Lavender Wash. The hero is a centered text stack (display headline → body subhead → centered logo row) with no image. Below the fold, the rhythm shifts to alternating two-column sections: text-left / floating-product-card-right, then text-right / floating-product-card-left, creating a Z-pattern. Each product card is tilted slightly or offset to feel suspended, not gridded. The nav is a minimal top bar (logo left, single filled blue CTA right, no menu items visible). Section gaps are generous (64px), intra-section element gaps tight (8–20px). No sidebar, no mega-menu, no footer visible in the data — the page is deliberately front-loaded.

## Agent Prompt Guide

Quick Color Reference:
- text (primary): #091135 Midnight Ink
- text (secondary): #36394a Slate
- background (canvas): #ffffff Paper
- background (section): #f5f3ff Lavender Wash
- border: #e1e9f0 Frost Border
- accent: #0f77ff Electric Blue
- primary action: no distinct CTA color

Example Component Prompts:
1. Build a hero section: #ffffff background, centered 56px InterVar weight 600 #091135 headline with 0.018em letter-spacing, 18px InterVar weight 400 #36394a subhead at 1.5 line-height, 20px gap between headline and subhead.
2. Create a product showcase card: 12px radius, 24px padding, white surface on a #f5f3ff section background, 1px #e1e9f0 border, no shadow. Inside: a two-column data table with 14px #36394a labels left and 14px #091135 values right, 12px row gap, Electric Blue #0f77ff checkmark icons in the leading column.
3. Add a pill section tag: #f5f3ff background, 9999px radius, 8px 16px padding, 14px InterVar weight 500 #091135 text. Sits directly above the section heading with 8px gap.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
5. Compose a two-column feature section: text left (32px InterVar weight 600 #091135 heading, 16px #36394a body, 24px gap between), floating white product card right with 12px radius, 1px #e1e9f0 border, slightly offset from the baseline to feel suspended on the #f5f3ff section wash.

## Similar Brands

- **Stripe** — Same near-achromatic light canvas with deep-navy text, generous Inter-style typography, and product UI screenshots as hero visuals — the blueprint-on-white feel
- **Linear** — Equally flat, shadowless interface with a single vivid accent and hairline borders — though Linear is dark-mode, the surface logic and restraint match
- **Segment** — Fellow data-infrastructure B2B with a white canvas, single blue accent, and product-screenshot-as-marketing — the data-terminal vocabulary is shared
- **Vercel** — Light airy product page with centered hero, generous 64px section gaps, and product UI floating on subtle tinted backgrounds
- **Plaid** — Data-platform B2B with a similarly restrained achromatic palette, single accent color, and documentary product imagery rather than abstract graphics

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #091135;
  --color-electric-blue: #0f77ff;
  --color-cobalt-surface: #127ee3;
  --color-slate: #36394a;
  --color-frost-border: #e1e9f0;
  --color-mist: #b1bbcd;
  --color-graphite: #000000;
  --color-paper: #ffffff;
  --color-lavender-wash: #f5f3ff;

  /* Typography — Font Families */
  --font-intervar: 'InterVar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.056px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.128px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.252px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.512px;
  --text-heading: 56px;
  --leading-heading: 1.25;
  --tracking-heading: 1.008px;
  --text-display: 64px;
  --leading-display: 1.25;
  --tracking-display: 1.152px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8-20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgb(15, 119, 255) 0px 0px 0px 1px, rgba(12, 43, 100, 0.32) 0px 1px 2px 0px, rgba(12, 43, 100, 0.32) 0px 6px 16px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-lavender-wash: #f5f3ff;
  --surface-card: #ffffff;
  --surface-cobalt-surface: #127ee3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #091135;
  --color-electric-blue: #0f77ff;
  --color-cobalt-surface: #127ee3;
  --color-slate: #36394a;
  --color-frost-border: #e1e9f0;
  --color-mist: #b1bbcd;
  --color-graphite: #000000;
  --color-paper: #ffffff;
  --color-lavender-wash: #f5f3ff;

  /* Typography */
  --font-intervar: 'InterVar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.056px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.128px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.252px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.512px;
  --text-heading: 56px;
  --leading-heading: 1.25;
  --tracking-heading: 1.008px;
  --text-display: 64px;
  --leading-display: 1.25;
  --tracking-display: 1.152px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-subtle: rgb(15, 119, 255) 0px 0px 0px 1px, rgba(12, 43, 100, 0.32) 0px 1px 2px 0px, rgba(12, 43, 100, 0.32) 0px 6px 16px 0px;
}
```
