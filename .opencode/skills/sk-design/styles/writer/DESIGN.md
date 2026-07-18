# WRITER — Style Reference
> editorial AI atelier — a white marble newsroom where pill-shaped controls and a single violet accent turn enterprise software into confident editorial design

**Theme:** light

WRITER operates as an editorial AI atelier: a near-white canvas where confident display headlines in Poppins (64px, tight tracking) sit above pill-shaped controls with 60-82px radii, and a single vivid violet accent punctuates an otherwise monochrome system. The visual language alternates between bright editorial sections and near-black resource blocks, creating a magazine-meets-control-center rhythm where typography carries authority and color acts as functional punctuation. Custom serif CanelaDeck surfaces in body copy for an editorial undertone, while the geometric Poppins handles everything from eyebrow labels (0.14-0.30em tracking) to product UI. Components are lightweight and rounded: thin dividers, pill inputs, soft cards with 12px radii, and minimal elevation — the design trusts whitespace and type scale over chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Orchid Accent | `#a95ef8` | `--color-orchid-accent` | Highlighted word in display headlines, decorative emphasis — vivid violet that draws the eye to a single concept within a monochrome headline |
| Iris Brand | `#5551ff` | `--color-iris-brand` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lavender Wash | `#e4e9ff` | `--color-lavender-wash` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Cobalt Spark | `#007aff` | `--color-cobalt-spark` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink Black | `#000000` | `--color-ink-black` | Primary body text, heading text, strong borders, and iconography |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark fills, input backgrounds |
| Obsidian | `#27272b` | `--color-obsidian` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Graphite | `#2d2d2d` | `--color-graphite` | Dark surface level, input borders on dark mode, secondary dark fills |
| Mist | `#e4e7ed` | `--color-mist` | Hairline borders, dividers, subtle card edges — the lightest structural neutral |
| Fog | `#d2d4d7` | `--color-fog` | Muted text, secondary borders, disabled states — mid-gray for de-emphasis |
| Ash | `#bdbdbd` | `--color-ash` | Placeholder text, low-priority labels, trust-logo grayscale |
| Slate | `#666666` | `--color-slate` | Helper text, input placeholder, secondary metadata |
| Privacy Banner Gradient | `linear-gradient(50deg, rgb(247, 200, 237) 50px, rgb(229, 236, 255) 130px, rgb(229, 236, 255) 100%)` | `--color-privacy-banner-gradient` | Gradient wash for announcement bar — soft pink fading to lavender white |

## Tokens — Typography

### Poppins — Primary UI and display typeface — geometric sans handling everything from 64px display headlines (weight 500-600, tight tracking) down to 11px labels. Weight 600-700 for buttons and emphasis, 400 for body, 500 for subheadings. The 0.0770-0.3000em tracking on 11-12px sizes creates wide-tracked eyebrow labels ('ENTERPRISE AI PLATFORM', 'WRITER AGENT') that anchor section hierarchy. · `--font-poppins`
- **Substitute:** Inter, DM Sans, or Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 18px, 20px, 25px, 40px, 44px, 64px
- **Line height:** 1.00–1.75
- **Letter spacing:** -0.0310em at 64px (~-1.98px), -0.0200em at 40-44px, 0.0770em-0.3000em for 11-14px eyebrow/label text
- **OpenType features:** `"clig" 0, "liga" 0`
- **Role:** Primary UI and display typeface — geometric sans handling everything from 64px display headlines (weight 500-600, tight tracking) down to 11px labels. Weight 600-700 for buttons and emphasis, 400 for body, 500 for subheadings. The 0.0770-0.3000em tracking on 11-12px sizes creates wide-tracked eyebrow labels ('ENTERPRISE AI PLATFORM', 'WRITER AGENT') that anchor section hierarchy.

### CanelaDeck — Editorial body accent — a custom serif used sparingly at body size to add an editorial undertone to the otherwise sans-serif system. Its presence at 16px is signature: the serif detail in body copy signals premium editorial design rather than pure SaaS utility. · `--font-caneladeck`
- **Substitute:** Playfair Display, DM Serif Display, or Lora
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Editorial body accent — a custom serif used sparingly at body size to add an editorial undertone to the otherwise sans-serif system. Its presence at 16px is signature: the serif detail in body copy signals premium editorial design rather than pure SaaS utility.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | 0.143px | `--text-caption` |
| body-sm | 14px | 1.55 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 25px | 1.25 | -0.4px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.8px | `--text-heading` |
| heading-lg | 44px | 1.15 | -0.88px | `--text-heading-lg` |
| display | 64px | 1 | -1.98px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| icons | 12px |
| inputs | 72px |
| buttons | 60px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 12-16px

## Components

### Primary Pill Button
**Role:** Main conversion action (Request a demo, Sign in)

Filled button with Obsidian (#27272b) background, Pure White (#ffffff) text, Poppins 14-16px weight 500-600, padding 16px 32px, border-radius 60px. No shadow. The pill shape (60px radius on a ~48px tall control) makes the button read as soft and approachable rather than corporate.

### Accent Pill Button
**Role:** Secondary action highlighted with brand color (Try for free)

Filled button with Iris Brand (#5551ff) background, Pure White (#ffffff) text, Poppins 14px weight 500, padding 12px 24px, border-radius 60px. The vivid violet fill is the most chromatically bold element in the UI — used sparingly to mark the most important entry points.

### Ghost Outlined Button
**Role:** Tertiary action or navigation link with visual weight

Transparent background with Iris Brand (#5551ff) border (1-1.5px), Iris Brand text, Poppins 14px weight 500, padding 12px 24px, border-radius 60px. The violet stroke matches the accent fill button, creating a visual pair.

### Pill Email Input
**Role:** Email capture in hero sections

Pure White (#ffffff) background, Ash (#bdbdbd) border (1px), Slate (#666666) placeholder text, Poppins 14-16px weight 400, padding 16px 20px, border-radius 72px. Sits inline with a primary pill button to form a composite capture unit.

### Hero Display Headline
**Role:** Primary page heading with brand-color word highlight

Poppins 64px weight 500, Ink Black (#000000) with one word in Orchid Accent (#a95ef8), line-height 1.00, letter-spacing -1.98px. Center-aligned, max-width ~800px. The single violet word within a black headline is the signature typographic move.

### Eyebrow Label
**Role:** Section category indicator above headlines

Poppins 11-12px weight 500, Ink Black, letter-spacing 0.077-0.300em, uppercase. Wide tracking on small size creates a label-like voice that sits above display headlines.

### Feature Card
**Role:** Content card with image and descriptive text

Pure White (#ffffff) background, no visible border or shadow, border-radius 12px on image, 24px internal padding. Contains a 12px-radius image on top, heading in Poppins 20-25px weight 600, body text in Poppins 14-16px weight 400. Cards float on the canvas without chrome.

### Agent Output Card
**Role:** Card showing AI agent task results with checklist

Pure White background with subtle Mist (#e4e7ed) border, border-radius 12px, padding 20-24px. Contains a task title in Poppins 14-16px weight 600, a checklist with circular icons, and small status indicators. Clean and functional.

### Trust Logo Bar
**Role:** Enterprise social proof row

Horizontal row of grayscale (Ash #bdbdbd) brand logos on Pure White background, centered, with equal spacing. Logos are rendered in monochrome to maintain visual quietness — color would compete with the page hierarchy.

### Dark Resource Section
**Role:** Alternating dark band for resource/content modules

Obsidian (#27272b) or near-black background, Pure White text, display headline in Poppins 40-44px weight 500 white, resource cards as Pure White surfaces on dark. The inversion creates visual rhythm and separates content categories.

### Floating Action Card
**Role:** Promotional overlay card (e.g., report download)

Dark gradient background with subtle color noise, Pure White text, Iris Brand (#5551ff) pill button inside, border-radius 16-20px, positioned with slight rotation or offset. Combines dark surface with brand accent for high-attention placement.

### Navigation Bar
**Role:** Top-level site navigation

Pure White (#ffffff) background, transparent or no border, WRITER wordmark logo left, nav links in Poppins 14px weight 500 Ink Black, with dropdown carets. Right side has Accent Pill Button (Try for free) and Primary Pill Button (Sign in). Sticky on scroll.

### Announcement Banner
**Role:** Site-wide privacy/policy notice at very top

Soft gradient background (Privacy Banner Gradient: pink #f7c8ed to lavender #e4e9ff), Ink Black text in Poppins 12-13px, full-width strip with dismiss X on the right. Minimal padding, sits above the main navigation.

### Back-to-Top Control
**Role:** Scroll restoration floating button

Obsidian (#27272b) square button with white up-arrow icon, fixed bottom-right, appears on scroll. Minimal — provides utility without visual weight.

## Do's and Don'ts

### Do
- Use Poppins 64px weight 500 with -1.98px letter-spacing for display headlines; keep them centered and max-width ~800px.
- Highlight exactly one word per display headline in Orchid Accent (#a95ef8) to create the signature editorial emphasis.
- Use border-radius 60px on all buttons and 72px on email inputs to maintain the pill-shaped control language.
- Set eyebrow labels in Poppins 11-12px with 0.077-0.300em letter-spacing, uppercase, centered above headlines.
- Apply 12px border-radius to all card images and icons — this is the only radius used on non-pill elements.
- Alternate between Pure White and Obsidian (#27272b) section backgrounds to create the editorial light/dark rhythm.
- Use Iris Brand (#5551ff) for at most 1-2 high-attention elements per viewport; let monochrome carry the rest.

### Don't
- Do not use Orchid Accent (#a95ef8) outside of display headline word highlights — it loses impact if overused.
- Do not apply sharp corners (< 12px) to images, icons, or cards — the rounded-square is the only non-pill radius allowed.
- Do not set body text below 14px or above 18px — CanelaDeck and Poppins both read best in this range.
- Do not add drop shadows to cards or buttons; rely on background color contrast and border-radius for separation.
- Do not use letter-spacing above 0.05em on any text larger than 14px — wide tracking only works at label/caption scale.
- Do not introduce new accent colors beyond Iris Brand, Orchid Accent, Cobalt Spark, and Lavender Wash.
- Do not use full-opacity black (#000000) for large background fills — use Obsidian (#27272b) for warmth and depth.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary background for all editorial sections |
| 1 | Lavender Wash | `#e4e9ff` | Accent card surfaces and highlighted content blocks |
| 2 | Mist Edge | `#e4e7ed` | Hairline borders and subtle card edges |
| 3 | Iris Brand | `#5551ff` | Brand accent fills for highlighted actions |
| 4 | Graphite | `#2d2d2d` | Dark section backgrounds and secondary dark surfaces |
| 5 | Obsidian | `#27272b` | Primary dark section canvas and filled button background |

## Elevation

WRITER avoids drop shadows entirely. Visual hierarchy is achieved through background color contrast (white → lavender → obsidian), border-radius differentiation (12px cards vs 60px pills), and border lines (1px Mist #e4e7ed). This flat approach reinforces the editorial confidence — the typography and color do the heavy lifting, not chrome.

## Imagery

Imagery is minimal and functional: the hero uses a person (woman with glasses) as a trust signal, cropped to upper body with a soft gradient/blur treatment. Product UI screenshots appear inside cards (Writer Academy course preview, agent output mockups) with rounded corners and no device frames. Trust logos are rendered in grayscale. Decorative elements include subtle color noise/grain on dark sections and soft pink-to-lavender gradients on announcement bars. Photography is high-key with soft natural lighting, never dark or moody. The visual density is text-dominant — imagery serves as punctuation, not atmosphere.

## Layout

WRITER uses a max-width 1200px centered container with generous horizontal padding. The hero is a centered text stack: eyebrow label, 64px display headline, email input + pill button inline, then a composite card image below showing agent output. Sections alternate between light editorial blocks and dark resource bands, separated by 80-120px vertical gaps. Trust logos sit in a centered single row. Feature sections use 2-column or 3-column card grids with consistent gutters. The Resources section inverts to dark background with white text and white cards floating on it. Navigation is a sticky white top bar with logo left, links center, and dual pill buttons (accent + dark) right. A thin gradient announcement bar sits above the nav. The overall rhythm is spacious and magazine-like — each section breathes rather than competes.

## Agent Prompt Guide

**Quick Color Reference:**
- Text primary: #000000
- Text on dark: #ffffff
- Page background: #ffffff
- Accent surface: #e4e9ff
- Brand accent: #5551ff
- Display highlight word: #a95ef8
- primary action: no distinct CTA color

**Example Component Prompts:**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Feature Card Grid**: 3-column layout on max-width 1200px container. Each card: #ffffff background, 12px border-radius on image, 24px padding. Image (12px radius) on top, Poppins 20px weight 600 heading, Poppins 14px weight 400 body text in #2d2d2d. 16px gap between cards.

3. **Dark Resource Section**: #27272b background, full-width. White display headline in Poppins 44px weight 500, letter-spacing -0.88px, centered. 2-column card grid below with #ffffff cards (12px radius, 24px padding) containing thumbnail image and title.


5. **Announcement Banner**: Full-width strip with gradient background (linear-gradient(50deg, #f7c8ed 50px, #e4e9ff 130px, #e4e9ff 100%)). Poppins 12px weight 400 #000000 text, centered, with dismiss X on the right. 8-10px vertical padding.

## Similar Brands

- **Linear** — Same pill-shaped button language (high border-radius), monochrome-with-single-accent palette, and confidence in large display type with tight tracking
- **Anthropic** — Similar editorial-meets-tech feel with serif body accents, generous whitespace, and a single warm accent color punctuating a near-white canvas
- **Notion** — Same lightweight card aesthetic, minimal elevation, grayscale trust logos, and the alternation between light editorial sections and product-heavy content blocks
- **Vercel** — Same dark-section-alternating rhythm, geometric sans-serif at scale, and pill-shaped controls with minimal chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-orchid-accent: #a95ef8;
  --color-iris-brand: #5551ff;
  --color-lavender-wash: #e4e9ff;
  --color-cobalt-spark: #007aff;
  --color-ink-black: #000000;
  --color-pure-white: #ffffff;
  --color-obsidian: #27272b;
  --color-graphite: #2d2d2d;
  --color-mist: #e4e7ed;
  --color-fog: #d2d4d7;
  --color-ash: #bdbdbd;
  --color-slate: #666666;
  --color-privacy-banner-gradient: #f7c8ed;
  --gradient-privacy-banner-gradient: linear-gradient(50deg, rgb(247, 200, 237) 50px, rgb(229, 236, 255) 130px, rgb(229, 236, 255) 100%);

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caneladeck: 'CanelaDeck', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.143px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.4px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.88px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.98px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 72px;
  --radius-full-4: 82px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-icons: 12px;
  --radius-inputs: 72px;
  --radius-buttons: 60px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-lavender-wash: #e4e9ff;
  --surface-mist-edge: #e4e7ed;
  --surface-iris-brand: #5551ff;
  --surface-graphite: #2d2d2d;
  --surface-obsidian: #27272b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-orchid-accent: #a95ef8;
  --color-iris-brand: #5551ff;
  --color-lavender-wash: #e4e9ff;
  --color-cobalt-spark: #007aff;
  --color-ink-black: #000000;
  --color-pure-white: #ffffff;
  --color-obsidian: #27272b;
  --color-graphite: #2d2d2d;
  --color-mist: #e4e7ed;
  --color-fog: #d2d4d7;
  --color-ash: #bdbdbd;
  --color-slate: #666666;
  --color-privacy-banner-gradient: #f7c8ed;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caneladeck: 'CanelaDeck', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.143px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.4px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.88px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.98px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 72px;
  --radius-full-4: 82px;
}
```
