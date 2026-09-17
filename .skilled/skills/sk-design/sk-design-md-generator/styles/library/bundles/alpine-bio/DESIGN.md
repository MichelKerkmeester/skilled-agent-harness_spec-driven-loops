# Alpine Bio — Style Reference
> Sun-drenched botanical apothecary on cream parchment

**Theme:** light

Alpine Bio reads as a warm apothecary-editorial system: cream-parchment canvases, a single sky-blue pill accent, and Switzer display type sized like a botanical journal. The interface is deliberately chromatically silent — nearly every surface lives in the warm off-white family, with one soft blue for actions and one pollen-yellow for tiny typographic highlights. Components are flat, unshadowed, and pill-rounded; the design is defined as much by what it withholds (no gradients, no shadows, no dark mode) as by what it adds. Full-bleed close-up product photography carries all atmospheric warmth, letting the UI stay calm and lab-like while the imagery feels edible and alive.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#f5f5f5` | `--color-parchment` | Page canvas and base background — the neutral ground everything sits on |
| Warm Cream | `#f8f4e6` | `--color-warm-cream` | Section backgrounds, footer surface, and warm page rhythm — gives the system its apothecary warmth |
| Paper White | `#ffffff` | `--color-paper-white` | Text on dark imagery, elevated card surfaces, and bright contrast moments |
| Mist Gray | `#e9e9e9` | `--color-mist-gray` | Subtle surface fills — nav background, button hover rests, and quiet UI layers |
| Ink | `#1e1e1f` | `--color-ink` | Primary body text and structural borders — softer than pure black, warmer against the cream |
| Carbon | `#000000` | `--color-carbon` | Heading text, heavy borders, icon strokes — the highest-contrast neutral in the system |
| Sky Blue | `#8ec7e2` | `--color-sky-blue` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Pollen Yellow | `#f7ca50` | `--color-pollen-yellow` | Highlight labels, breadcrumb tags, scroll-indicator text — rare warm punctuation against the cream |

## Tokens — Typography

### Switzer — Display and heading type — geometric sans with consistent tight tracking, carries the editorial voice from 20px subheads up to 76px hero headlines · `--font-switzer`
- **Substitute:** Inter, General Sans, or DM Sans
- **Weights:** 400, 500
- **Sizes:** 20px, 32px, 48px, 76px
- **Line height:** 1.10, 1.20
- **Letter spacing:** -0.0500em at all sizes (-1px at 20, -1.6px at 32, -2.4px at 48, -3.8px at 76)
- **Role:** Display and heading type — geometric sans with consistent tight tracking, carries the editorial voice from 20px subheads up to 76px hero headlines

### Geist — Body and intermediate type — comfortable reading at 15–18px, scales up to 42px for feature sub-heads · `--font-geist`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 500
- **Sizes:** 13px, 15px, 18px, 22px, 42px
- **Line height:** 1.00, 1.20, 1.35
- **Letter spacing:** -0.0500em at 13–18px, -0.0300em at 22px, -0.0500em at 42px
- **Role:** Body and intermediate type — comfortable reading at 15–18px, scales up to 42px for feature sub-heads

### PT Mono — Nav items, category labels, and small uppercase tags — the only monospace, used to signal nav/system elements distinct from editorial body · `--font-pt-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Letter spacing:** -0.0400em (-0.52px)
- **Role:** Nav items, category labels, and small uppercase tags — the only monospace, used to signal nav/system elements distinct from editorial body

### system sans-serif — Micro-copy and fallback — only appears at 12px in utility positions · `--font-system-sans-serif`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Micro-copy and fallback — only appears at 12px in utility positions

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.35 | -0.75px | `--text-body` |
| subheading | 18px | 1.35 | -0.9px | `--text-subheading` |
| heading-sm | 22px | 1.2 | -0.66px | `--text-heading-sm` |
| heading | 32px | 1.1 | -1.6px | `--text-heading` |
| heading-lg | 48px | 1.1 | -2.4px | `--text-heading-lg` |
| display | 76px | 1.1 | -3.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 63 | 63px | `--spacing-63` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 110 | 110px | `--spacing-110` |
| 120 | 120px | `--spacing-120` |
| 150 | 150px | `--spacing-150` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 3px |
| cards | 22px |
| pills | 22px |
| buttons | 22px |

### Layout

- **Section gap:** 80px
- **Card padding:** 12px
- **Element gap:** 10px

## Components

### Primary Pill Button
**Role:** The sole action button variant — used for Contact Us, Request a Sample, Learn More, View All

Sky Blue (#8ec7e2) fill, Carbon (#000000) text at 13px Geist weight 400, 22px pill radius, 12px vertical / ~16px horizontal padding. Always paired with a circular arrow icon to the right of the label. No border, no shadow.

### Ghost Nav Button
**Role:** The 'Contact Us' control in the top-right of the navigation

Identical visual treatment to the Primary Pill Button — Sky Blue fill, Carbon text, 22px radius — but lives in the nav rather than page content.

### Navigation Bar
**Role:** Sticky top header carrying brand + section links

Mist Gray (#e9e9e9) background, 3px corner radius, logo left (Alpine ❋ Bio), PT Mono 13px nav items center-left (INGREDIENTS ▾, APPLICATIONS, COMPANY, INTEL), pill Contact Us right. No border, no shadow.

### Hero Section
**Role:** Full-viewport opening with product imagery and overlay headline

Full-bleed background photograph (close-up of liquid being poured), centered overlay text block: 76px Switzer weight 400 white headline, 18px Geist body copy, Primary Pill Button below. 'SCROLL DOWN' indicator in Pollen Yellow at bottom.

### Editorial Body Block
**Role:** Long-form introductory paragraph below the hero

Left-aligned to canvas edge (no max-width centering), Pollen Yellow (#f7ca50) pill label 'Introduction' sits above, large Switzer paragraph in Ink (#1e1e1f) at ~18px, Primary Pill Button below.

### Application Showcase Card
**Role:** Large product photograph cards in a 3-column carousel

Full-bleed image filling the card, 22px radius, PT Mono 13px category label ('RTD Protein Shakes', 'Protein Bars', 'Coffee Cream') in white at bottom-left of the image. No internal padding, no border, no shadow.

### Section Heading
**Role:** Large editorial headings like 'Applications Showcase'

Switzer 32–48px weight 400, Ink color, left-aligned to canvas, with carousel arrow controls right-aligned. Tight -0.0500em tracking.

### Pollen Label
**Role:** Small warm-amber tag for breadcrumb and category markers

Pollen Yellow (#f7ca50) background, Carbon text, PT Mono 13px, pill-shaped 22px radius, tight horizontal padding. Used for 'Introduction' breadcrumb and 'SCROLL DOWN' indicator.

### Carousel Arrow Control
**Role:** Navigation for the Application Showcase carousel

Circular icon button, Mist Gray or white background, Carbon arrow icon, sits to the right of the section heading.

### Carousel Dot Indicator
**Role:** Position indicator beneath the Application Showcase

Row of small dots centered below the card grid, active dot in Carbon, inactive in light gray. Minimal, no labels.

### Scroll Indicator
**Role:** 'SCROLL DOWN' text at the very bottom of the hero

PT Mono 13px, Pollen Yellow, centered, no icon — just a typographic cue.

### Footer Surface
**Role:** Closing section with warm cream background

Warm Cream (#f8f4e6) full-bleed background, likely contains Pollen Yellow accent and standard link/contact information in PT Mono or Geist.

## Do's and Don'ts

### Do
- Use #8ec7e2 fill with #000000 text and 22px radius for every action — this is the only button style in the system
- Apply -0.0500em letter-spacing to every Switzer and Geist heading — the tight tracking is what makes the type feel editorial
- Use Pollen Yellow (#f7ca50) only for small typographic accents: breadcrumb labels, scroll cues, and footer highlights — never as a button fill or large background
- Pair every pill button with a right-side circular arrow icon — the arrow is part of the button's identity, not decoration
- Default to full-bleed left-aligned layouts — content starts from the left edge rather than centering in a max-width container
- Use Warm Cream (#f8f4e6) for alternating section backgrounds to create warm/cool rhythm against the gray canvas
- Choose Switzer for all display and heading sizes 20px and above; reserve Geist for body and PT Mono for nav/labels

### Don't
- Don't add drop shadows to cards, buttons, or modals — the system is intentionally flat, depth comes from surface color only
- Don't introduce new chromatic colors — the palette is sky blue + pollen yellow + warm neutrals, nothing else
- Don't use the pollen yellow as a CTA or button background — it's a typographic accent only
- Don't center content in a max-width container for body sections — the editorial feel depends on left-aligned, edge-to-edge composition
- Don't use type weights above 500 — Switzer and Geist at 400–500 carry the whole system, bolder weights would break the quiet tone
- Don't apply borders to the Primary Pill Button — it relies on the sky-blue fill alone for its identity
- Don't use dark mode — the entire system is calibrated around the cream canvas; inverting it would destroy the apothecary warmth

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f5f5f5` | Base page background, the default resting surface |
| 2 | Warm Cream Section | `#f8f4e6` | Alternating section background — adds apothecary warmth and section rhythm |
| 3 | Mist | `#e9e9e9` | Nav bar fill, quiet button-hover surface |
| 4 | Paper White | `#ffffff` | Elevated cards, light text on dark imagery |

## Elevation

The system uses zero drop shadows. Depth is communicated entirely through surface color shifts (canvas → warm cream → mist) and the 22px pill rounding. Every component is flat against its surface — no hover lifts, no modal shadows, no card elevation. The result is an interface that reads like printed matter, not software.

## Imagery

Photography carries all atmospheric weight. The site uses full-bleed, high-resolution product close-ups: a glass being filled with amber liquid in the hero, overhead shots of RTD shakes, protein bars on a light surface, and coffee cream pours. Style is natural-light, warm-toned, intimate, and product-focused — no lifestyle context, no people, no props beyond the food itself. All images sit on the cream/neutral palette, so photography is the only place saturated color appears in the system. No illustrations, no abstract graphics, no 3D renders, no icons beyond a thin arrow chevron used in buttons.

## Layout

Full-bleed, left-aligned layout with no centered max-width container. The hero is a full-viewport image with centered overlay text. Below, editorial body sections start from the left edge with content extending to roughly half the viewport width, creating a strong asymmetric left-weighted reading flow. The Applications Showcase uses a 3-column card grid where each card is a large image filling its column, arranged in a horizontal carousel. Vertical rhythm is generous — 80px section gaps separate major blocks. Navigation is a sticky top bar with the logo left, section links center-left in monospace, and a pill Contact Us button right. The overall feel is closer to a printed editorial than a typical SaaS product page.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1e1e1f (body), #000000 (headings)
- background: #f5f5f5 (canvas), #f8f4e6 (warm sections)
- border: #000000 (structural), #e9e9e9 (subtle)
- accent: #f7ca50 (Pollen Yellow — labels only)
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.


3. *Application Showcase card*: Full-bleed product photograph (RTD shake, protein bars, or coffee cream) filling the card with 22px border-radius. White PT Mono 13px label at bottom-left of image. No border, no shadow, no internal padding.

4. *Section heading + carousel*: 'Applications Showcase' in Switzer 48px weight 400, #1e1e1f, left-aligned. Two circular carousel arrow controls (Mist Gray fill, Carbon arrow) right-aligned. Row of small Carbon/light-gray dots centered below the card grid.

5. *Navigation bar*: Sticky top, Mist Gray (#e9e9e9) background, 3px radius. Logo 'Alpine ❋ Bio' left, nav items (INGREDIENTS, APPLICATIONS, COMPANY, INTEL) in PT Mono 13px weight 400, #000000 center-left. Sky Blue (#8ec7e2) pill Contact Us button with arrow icon, right-aligned.

## Photography Direction

All photography must feel edible, warm, and intimate. Shoot overhead or at 3/4 angle, in natural or warm artificial light, on light neutral surfaces. Subjects are the finished food applications — poured liquids, stacked bars, frothy shakes — never the raw ingredient, never the facility, never people. Color grading leans warm and slightly desaturated so imagery harmonizes with the cream canvas. Treat each image as the only saturated moment on its page; surround it with calm cream and let the food do the talking.

## Border Radius Philosophy

The system is defined by 22px. Buttons are 22px pills, labels are 22px pills, image cards are 22px corners. The 3px nav radius is the only deviation and exists only because the nav bar itself has a subtle 3px corner — it does not apply to anything inside the nav. There are no sharp corners on user-facing controls anywhere in the system. The 22px number was chosen as a soft pill: rounded enough to feel friendly and organic, tight enough to still read as a button rather than a tag.

## Similar Brands

- **Perfect Day** — Same alt-protein ingredient B2B context with warm cream backgrounds, full-bleed product photography, and a single restrained chromatic accent color for actions
- **Oatly** — Shares the warm off-white canvas, playful yellow label accents, large editorial sans-serif type, and the food-photography-does-the-atmosphere approach
- **NotCo** — Same food-tech ingredient brand feel with sky-blue action buttons, cream surfaces, and close-up product imagery as the primary visual driver
- **Clariant (ingredients division)** — Similar B2B ingredient company restraint — monochrome cream palette, pill-shaped action buttons, monospace nav labels, and editorial body type
- **Public Goods** — Same flat, unshadowed, pill-rounded component language on warm neutral surfaces with full-bleed product photography and a single soft accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #f5f5f5;
  --color-warm-cream: #f8f4e6;
  --color-paper-white: #ffffff;
  --color-mist-gray: #e9e9e9;
  --color-ink: #1e1e1f;
  --color-carbon: #000000;
  --color-sky-blue: #8ec7e2;
  --color-pollen-yellow: #f7ca50;

  /* Typography — Font Families */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pt-mono: 'PT Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.35;
  --tracking-body: -0.75px;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.9px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.66px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -1.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.4px;
  --text-display: 76px;
  --leading-display: 1.1;
  --tracking-display: -3.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-63: 63px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-110: 110px;
  --spacing-120: 120px;
  --spacing-150: 150px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 12px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-nav: 3px;
  --radius-cards: 22px;
  --radius-pills: 22px;
  --radius-buttons: 22px;

  /* Surfaces */
  --surface-canvas: #f5f5f5;
  --surface-warm-cream-section: #f8f4e6;
  --surface-mist: #e9e9e9;
  --surface-paper-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #f5f5f5;
  --color-warm-cream: #f8f4e6;
  --color-paper-white: #ffffff;
  --color-mist-gray: #e9e9e9;
  --color-ink: #1e1e1f;
  --color-carbon: #000000;
  --color-sky-blue: #8ec7e2;
  --color-pollen-yellow: #f7ca50;

  /* Typography */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pt-mono: 'PT Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.35;
  --tracking-body: -0.75px;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.9px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.66px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -1.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.4px;
  --text-display: 76px;
  --leading-display: 1.1;
  --tracking-display: -3.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-63: 63px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-110: 110px;
  --spacing-120: 120px;
  --spacing-150: 150px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-full: 50px;
}
```
