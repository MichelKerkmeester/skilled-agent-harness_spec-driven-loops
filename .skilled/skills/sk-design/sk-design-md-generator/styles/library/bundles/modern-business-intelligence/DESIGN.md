# Modern Business Intelligence — Style Reference
> Sunlit greenhouse editorial

**Theme:** light

Mode uses a botanical-editorial language: a pale sage canvas (#eef2e3) replaces the usual sterile SaaS white, and a single chartreuse accent (#c8f169) punctuates actions with a sharp, almost fluorescent pop. The headline font is a custom serif (Grenette) at 56–96px with aggressive negative tracking — the words feel pulled tight, almost condensed, and they read like a magazine cover rather than a dashboard. Depth comes from a three-layer color stack (sage → forest green → chartreuse) rather than shadows; surfaces sit flat against each other and rely on hue contrast for hierarchy. Interactive elements use small 4px corner radii while cards and large surfaces use 16px, creating a consistent geometric vocabulary. The mood is confident, warm, and intellectual — BI without the corporate coldness.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pale Sage | `#eef2e3` | `--color-pale-sage` | Page canvas, light card surfaces, eyebrow backgrounds, hero photo mats |
| Paper White | `#fcfcfc` | `--color-paper-white` | Elevated card surfaces, nav background, modals, footer |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, icon strokes, hairline borders, ghost button outlines |
| Charcoal | `#242423` | `--color-charcoal` | Secondary text and icon fills — softer than pure black for muted UI elements |
| Deep Forest | `#043f2e` | `--color-deep-forest` | Brand primary — dark section backgrounds, stat cards, nav text, primary text on light surfaces, dominant illustration color |
| Chartreuse Lime | `#c8f169` | `--color-chartreuse-lime` | Primary action button fill, accent highlights, tag/badge backgrounds, the singular chromatic punctuation across the UI |
| Forest Mid | `#2a6f2b` | `--color-forest-mid` | Hover/active state for forest surfaces, secondary green used in chart highlights and stat card accents |
| Vivid Green | `#78c51c` | `--color-vivid-green` | Tertiary accent — decorative chart strokes, data visualization secondary color, support to chartreuse |

## Tokens — Typography

### Times (system serif fallback) — System fallback only — not a design choice. Appears in icon labels and tertiary link contexts where Graphik failed to load · `--font-times-system-serif-fallback`
- **Substitute:** Times New Roman
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** System fallback only — not a design choice. Appears in icon labels and tertiary link contexts where Graphik failed to load

### Grenette — Display and section headlines — a custom serif used only at large sizes (36px+). The tight letter-spacing (-0.02em to -0.031em) and single weight (400) force hierarchy through size alone, creating an editorial authority that a bold sans-serif headline would destroy · `--font-grenette`
- **Substitute:** Fraunces, Source Serif 4, Tiempos Headline
- **Weights:** 400
- **Sizes:** 16px, 36px, 56px, 70px, 72px, 96px
- **Line height:** 0.90, 1.10, 1.20, 1.31
- **Letter spacing:** -0.72px at 36px, -1.68px at 56px, -2.1px at 70px, -2.98px at 96px
- **Role:** Display and section headlines — a custom serif used only at large sizes (36px+). The tight letter-spacing (-0.02em to -0.031em) and single weight (400) force hierarchy through size alone, creating an editorial authority that a bold sans-serif headline would destroy

### Graphik — Body, UI, buttons, navigation — the workhorse sans-serif. The 0.06em positive tracking at 12–18px creates uppercase eyebrow labels and small caps; the -0.01em at 36px tightens subheadings slightly. Weight 600 is reserved for nav and button labels, never body · `--font-graphik`
- **Substitute:** Inter, Söhne, Untitled Sans
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 18px, 22px, 36px
- **Line height:** 1.00, 1.03, 1.10, 1.18, 1.20, 1.30, 1.44
- **Letter spacing:** 0.72–1.08px at 12–18px (eyebrow/uppercase), -0.36px at 36px (subheading)
- **Role:** Body, UI, buttons, navigation — the workhorse sans-serif. The 0.06em positive tracking at 12–18px creates uppercase eyebrow labels and small caps; the -0.01em at 36px tightens subheadings slightly. Weight 600 is reserved for nav and button labels, never body

### --fonts-sans — --fonts-sans — detected in extracted data but not described by AI · `--font-fonts-sans`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** --fonts-sans — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.72px | `--text-caption` |
| body-sm | 14px | 1.3 | — | `--text-body-sm` |
| body | 16px | 1.3 | — | `--text-body` |
| subheading | 18px | 1.44 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | — | `--text-heading-sm` |
| heading | 36px | 1.1 | -0.72px | `--text-heading` |
| heading-lg | 56px | 1.1 | -1.68px | `--text-heading-lg` |
| display | 96px | 0.9 | -2.98px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 88 | 88px | `--spacing-88` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| inputs | 4px |
| buttons | 4px |
| largeSurfaces | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 56-80px
- **Card padding:** 16-24px
- **Element gap:** 12-20px

## Components

### Display Headline (Grenette Serif)
**Role:** Hero and section-spanning headlines

Grenette at 56–96px, weight 400, letter-spacing -0.031em to -0.02em, line-height 0.90–1.10. Color is always Deep Forest (#043f2e) on sage, or black on white. Never bold, never italic — the serif shape and tight tracking carry the weight.

### Section Heading (Grenette Serif)
**Role:** Mid-page section titles, card titles within forest-green sections

Grenette at 36px, weight 400, letter-spacing -0.02em (-0.72px), line-height 1.10. Inverts to Paper White (#fcfcfc) when sitting on Deep Forest background.

### Filled CTA Button (Chartreuse)
**Role:** Primary action — 'Try for free'

Background Chartreuse Lime (#c8f169), text Ink Black (#000000), 4px radius, 12px 20px padding, Graphik 16px weight 500. No border. Hover darkens toward Forest Mid (#2a6f2b). This is the only filled chromatic button in the system.

### Ghost CTA Button
**Role:** Secondary action — 'Request demo'

Transparent background, 1px Ink Black border, 4px radius, 12px 20px padding, Graphik 16px weight 500, Ink Black text. Inverts to white border/text on dark forest sections.

### Navigation Pill Button
**Role:** Top nav items, footer links

Transparent background, no border, Graphik 16px weight 500, 16px horizontal padding, 2px vertical padding. Active state shows a subtle underline or weight shift to 600.

### Pale Sage Card
**Role:** Feature cards, content blocks, image mats

Background Pale Sage (#eef2e3), 16px radius, 24px padding, no border, no shadow. The sage-on-sage disappears at the page level — cards are defined by content, not by elevation. Often wraps a photo with no inner padding on the image.

### Forest Stat Card
**Role:** Hero metric display, featured statistics

Background Deep Forest (#043f2e), 16px radius, 24px padding, Paper White (#fcfcfc) text. Used for the '8.2K' hero stat. Graphik weight 400 at large sizes, tight tracking. The card is dense — content sits close to edges.

### Paper White Elevated Card
**Role:** Pricing tiers, feature comparisons, modal content

Background Paper White (#fcfcfc), 16px radius, 24px padding, optional 1px hairline border. Used when the card needs to lift off the sage canvas without using shadow.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width bar at the very top of the page. Pale Sage or white background, centered Graphik 14px text, 'Learn More' as a Chartreuse-filled pill link (4px radius) or inline bold link.

### Eyebrow Label
**Role:** Section pre-headlines, category tags

Graphik 12–14px weight 500, letter-spacing 0.06em (positive tracking), uppercase, Ink Black or Deep Forest. Sits above section headlines as a small all-caps category marker.

### Tag / Badge
**Role:** Feature tags, plan indicators

Chartreuse Lime (#c8f169) or Pale Sage (#eef2e3) background, Ink Black text, 4px radius (or 9999px for pill variant), 2px 8–12px padding, Graphik 12–14px weight 500.

### Hero Image Block
**Role:** Photography in hero and feature sections

Full-bleed or contained within a sage card, 16px radius when contained. Photos are warm, human, documentary-style — people at desks, teams collaborating — never staged stock. No overlay or duotone treatment.

### Icon
**Role:** UI icons, feature bullets, nav indicators

Stroke-based, 1.5–2px weight, Ink Black or Deep Forest stroke, no fill. Inverts to Paper White on dark sections. Simple geometric forms — no decorative flourishes.

## Do's and Don'ts

### Do
- Use Deep Forest (#043f2e) for all body text on Pale Sage or Paper White surfaces — the 18.4:1 contrast is intentional, not a fallback
- Use Grenette serif for all display and section headings at 36px+; never use Graphik for sizes above 36px
- Use Chartreuse Lime (#c8f169) as the filled CTA background with Ink Black text; this is the only filled button color in the system
- Apply 16px radius to all cards, image blocks, and large surfaces; 4px radius to all buttons, inputs, and tags
- Layer surfaces using the sage → forest → chartreuse stack (light to dark, neutral to chromatic) rather than shadows for depth
- Use uppercase Graphik 12–14px with 0.06em letter-spacing for all eyebrow labels above section headings
- Keep photography warm, documentary, human; never use staged stock, duotone, or color overlays on images

### Don't
- Do not use Graphik for display headlines — the serif/sans contrast at large sizes is the signature and must not be broken
- Do not add box-shadows to cards or buttons — depth comes from the sage/forest/chartreuse color stack, not elevation
- Do not use pure white (#ffffff) as a page background — always use Pale Sage (#eef2e3) for canvas, Paper White (#fcfcfc) only for elevated cards
- Do not apply bold (600+) to body or display text — weight stays at 400 in serif headlines, max 500 in Graphik UI
- Do not use more than one chromatic accent per viewport — Chartreuse Lime is the only accent, Forest Mid is its hover, Vivid Green is data-viz only
- Do not mix radii: never use 8px, 12px, or 20px — the system only uses 4px (small/buttons) and 16px (large/cards)
- Do not apply the serif to sizes below 36px — it loses its editorial impact and becomes hard to read at body sizes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sage Canvas | `#eef2e3` | Page background — the warm off-white that defines the entire system |
| 1 | Paper White | `#fcfcfc` | Elevated cards, navigation bar, footer, modals — the only true white |
| 2 | Chartreuse Highlight | `#c8f169` | Accent surface for tags, filled CTAs, and stat highlights |
| 3 | Forest Dark | `#043f2` | Dark section backgrounds, hero stat cards, inverted text containers |

## Elevation

This design intentionally avoids box-shadows entirely. Depth and hierarchy are achieved through a three-layer color system: Pale Sage canvas → Paper White elevated cards → Deep Forest dark sections. The Chartreuse Lime accent sits on top of all layers as the singular chromatic punctuation. Adding shadows would break the flat, editorial, magazine-like quality of the system.

## Imagery

Photography is documentary and human — people collaborating at desks, teams reviewing screens, candid workspace moments. Images are warm-toned, naturally lit, never staged stock or overly polished. They sit inside Pale Sage cards with 16px radius, often extending to the card edge with no internal padding. No duotone, no color overlays, no decorative filters. The sage background acts as a warm mat that makes the photos feel grounded and editorial rather than corporate.

## Layout

Max-width 1200px centered content within a full-bleed sage canvas. The hero is a two-column asymmetric split: large serif headline and stat card on the right, human photo on the left, both contained within sage-tinted cards. Section rhythm alternates between white and sage bands with generous 56–80px vertical gaps. Feature sections use 2-column text+image alternating layouts. Navigation is a minimal top bar with centered links, a left-aligned logo, and right-aligned CTA pair. The overall density is comfortable and spacious — this reads more like a brand site than a product dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- text: #043f2e (Deep Forest) on sage, #fcfcfc on forest
- background: #eef2e3 (Pale Sage canvas), #fcfcfc (elevated cards)
- border: #000000 (1px hairline)
- accent: #c8f169 (Chartreuse Lime)
- primary action: #c8f169 (filled action)

**Example Component Prompts**

1. **Hero Headline**: Render a display headline in Grenette serif (substitute: Fraunces), 96px, weight 400, letter-spacing -2.98px, line-height 0.90, color Deep Forest #043f2e, on Pale Sage #eef2e3 background.

2. **Primary CTA Button**: Filled button, Chartreuse Lime #c8f169 background, Ink Black #000000 text, 4px radius, 12px 20px padding, Graphik (substitute: Inter) 16px weight 500. Text label centered, no icon.

3. **Feature Card**: Pale Sage #eef2e3 background, 16px radius, 24px padding, no shadow. Contains a Grenette serif heading at 36px, weight 400, letter-spacing -0.72px, Deep Forest color, and a body paragraph in Graphik 16px weight 400, line-height 1.30.

4. **Forest Stat Card**: Deep Forest #043f2e background, 16px radius, 24px padding. Large metric number in Graphik 36px weight 400, Paper White #fcfcfc color, with a small label above in uppercase Graphik 12px weight 500, letter-spacing 0.72px, color #c8f169.

5. **Eyebrow + Heading Pair**: Stack an uppercase Graphik 14px weight 500 eyebrow with 0.72px letter-spacing in Deep Forest, sitting 12px above a Grenette serif 56px heading in Deep Forest with -1.68px letter-spacing and line-height 1.10.

## Similar Brands

- **Notion** — Same warm off-white canvas replacing sterile SaaS white, and a single chromatic accent used sparingly for primary actions
- **Linear** — Similar use of a custom serif/grotesque pairing for display headlines, with tight negative tracking at large sizes creating editorial authority
- **Pitch** — Same botanical-editorial mood — pale neutral canvas, confident serif display type, and a single vivid accent color that punctuates rather than dominates
- **Mercury** — Same flat-surface philosophy with no shadows, depth achieved through color layering and a distinctive warm off-white background
- **Stripe** — Same use of a custom serif at display sizes with aggressive negative tracking, paired with a geometric sans for UI — the serif/sans contrast is the signature

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pale-sage: #eef2e3;
  --color-paper-white: #fcfcfc;
  --color-ink-black: #000000;
  --color-charcoal: #242423;
  --color-deep-forest: #043f2e;
  --color-chartreuse-lime: #c8f169;
  --color-forest-mid: #2a6f2b;
  --color-vivid-green: #78c51c;

  /* Typography — Font Families */
  --font-times-system-serif-fallback: 'Times (system serif fallback)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-grenette: 'Grenette', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fonts-sans: '--fonts-sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.3;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -0.72px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.68px;
  --text-display: 96px;
  --leading-display: 0.9;
  --tracking-display: -2.98px;

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
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 56-80px;
  --card-padding: 16-24px;
  --element-gap: 12-20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-largesurfaces: 16px;

  /* Surfaces */
  --surface-sage-canvas: #eef2e3;
  --surface-paper-white: #fcfcfc;
  --surface-chartreuse-highlight: #c8f169;
  --surface-forest-dark: #043f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pale-sage: #eef2e3;
  --color-paper-white: #fcfcfc;
  --color-ink-black: #000000;
  --color-charcoal: #242423;
  --color-deep-forest: #043f2e;
  --color-chartreuse-lime: #c8f169;
  --color-forest-mid: #2a6f2b;
  --color-vivid-green: #78c51c;

  /* Typography */
  --font-times-system-serif-fallback: 'Times (system serif fallback)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-grenette: 'Grenette', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fonts-sans: '--fonts-sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --text-body: 16px;
  --leading-body: 1.3;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -0.72px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.68px;
  --text-display: 96px;
  --leading-display: 0.9;
  --tracking-display: -2.98px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
}
```
