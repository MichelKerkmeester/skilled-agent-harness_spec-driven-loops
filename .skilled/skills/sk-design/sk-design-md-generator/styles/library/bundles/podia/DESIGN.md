# Podia — Style Reference
> Warm papercraft afternoon. Organic blob shapes float across a matte white canvas in terracotta, lavender, and dusty blue, framing compressed geometric headlines and generous colored product cards.

**Theme:** light

Podia is a warm papercraft afternoon: a light canvas scattered with organic blob shapes in terracotta, lavender, and dusty blue, framing a creator-friendly marketplace interface. The custom StabilGrotesk pulls tight with negative tracking at display sizes, giving headlines a compressed, almost hand-cut quality that reinforces the studio-workshop metaphor. Color is deployed as functional territory: three chromatic product zones (sky blue, terracotta, lavender) signal distinct platform capabilities, while a near-black with violet undertown carries every primary action. Surfaces are matte and flat — no gradients, no glow, no glass — letting the muted chromatic palette do the emotional work. Components are generous and rounded: 24–56px radii, pill buttons, colored cards, and ample 36–80px section breathing room. The system reads as a quiet craftsperson's table, not a corporate dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#06040e` | `--color-ink` | Primary text, primary CTA fill, nav background, heading copy — near-black with a violet undertone that ties dark elements back to the brand palette |
| Deep Teal | `#10242f` | `--color-deep-teal` | Secondary headings, body emphasis, dark surface variation — co-leads with Ink for high-contrast typographic hierarchy |
| Graphite | `#452623` | `--color-graphite` | Tertiary text and dark surface variant — warm brown-black that softens the typographic scale below the primary two |
| Fog | `#f5f5f5` | `--color-fog` | Page canvas, section background — the warm off-white that gives the entire interface its sunlit, paper-like quality |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, button text on dark fills — pure white reserved for content surfaces that sit above the Fog canvas |
| Mist | `#e1edf2` | `--color-mist` | Soft dividers, input borders, ghost button borders, secondary surface tint — cool pale blue-gray that whispers separation without weight |
| Terracotta | `#e39a4d` | `--color-terracotta` | Brand accent, feature card fill, decorative blob shape, warm highlight — the most saturated color in the system, used sparingly as energetic punctuation |
| Lavender | `#cbb0eb` | `--color-lavender` | Brand accent, feature card fill, decorative blob shape, soft highlight wash — dusty pastel violet that softens the palette |
| Plum | `#1f1738` | `--color-plum` | Dark accent surface, deep feature card variant, outlined action border — the saturated dark violet that anchors the lavender to something readable |
| Sky | `#a5c8d8` | `--color-sky` | Gray action color for filled buttons, selected navigation states, and focused conversion moments |
| Cream | `#f6ddc4` | `--color-cream` | Soft warm tint, outlined action border, decorative wash — peachy off-white that warms the palette without adding saturation |

## Tokens — Typography

### StabilGrotesk — Single-family type system carrying everything from micro-labels to display headlines. The custom geometric grotesque's tight apertures and compressed letterforms at 700 give the display sizes a hand-cut quality; 400 body weight is unusually readable for a display-origin face. Negative tracking (-0.03em at display, -0.02em at heading) is signature — the headlines feel cut from a single strip. Uppercase labels at 0.1em tracking create quiet eyebrow rhythm. · `--font-stabilgrotesk`
- **Substitute:** Manrope or Plus Jakarta Sans
- **Weights:** 400, 500, 700
- **Sizes:** 11px, 12px, 16px, 18px, 20px, 22px, 24px, 36px, 40px, 60px
- **Line height:** 1.0, 1.09, 1.1, 1.4, 1.5
- **Letter spacing:** -0.03em at 60px, -0.02em at 24px+, +0.1em at uppercase labels (11–12px)
- **Role:** Single-family type system carrying everything from micro-labels to display headlines. The custom geometric grotesque's tight apertures and compressed letterforms at 700 give the display sizes a hand-cut quality; 400 body weight is unusually readable for a display-origin face. Negative tracking (-0.03em at display, -0.02em at heading) is signature — the headlines feel cut from a single strip. Uppercase labels at 0.1em tracking create quiet eyebrow rhythm.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading-sm | 20px | 1.4 | — | `--text-subheading-sm` |
| subheading | 22px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.1 | -0.48px | `--text-heading-sm` |
| heading | 36px | 1.1 | — | `--text-heading` |
| heading-lg | 40px | 1.09 | — | `--text-heading-lg` |
| display | 60px | 1 | -1.8px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| badges | 16px |
| inputs | 8px |
| buttons | 8px |
| general | 24px |
| featureCards | 56px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 36px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Hero and section conversion actions

Ink (#06040e) background, Paper (#ffffff) text at 16px weight 500, 8px radius, 16px vertical / 24px horizontal padding. No border, no shadow. Uppercase not used — sits as a calm dark pill against the Fog canvas. The contrast between the violet-tinted near-black fill and the warm off-white background gives these buttons a grounded, ink-on-paper feel.

### Outlined Accent Button
**Role:** Secondary actions tied to a product color

Transparent background with a 2px border in a product accent (Terracotta, Lavender, or Sky), text in the matching dark variant (Plum, Deep Teal) at 16px weight 500, 8px radius, 16px/24px padding. Used when an action belongs to a specific product zone.

### Ghost Text Button
**Role:** Navigation links, inline actions, 'Learn more' patterns

No background, no border. Text in Ink (#06040e) or Deep Teal (#10242f) at 16px weight 500, often with a trailing arrow glyph. 8px vertical padding, 0 horizontal padding. Minimum-touch target maintained through generous line-height.

### Product Feature Card
**Role:** Three-up grid showcasing platform capabilities (Online Store, Website, Email Marketing)

Large rounded card at 56px radius, 36px internal padding, filled with a chromatic product color (Sky, Terracotta, or Lavender). Headline at 24px weight 700 in Ink, body at 16px weight 400 in Graphite. No border, no shadow — the color fill IS the elevation. Cards have generous height and a slight overlap/tilt in the hero composition, breaking the grid for visual energy.

### Creator Story Card
**Role:** Social proof — testimonials from solo creators

Paper (#ffffff) background, 24px radius, no shadow. Top portion is a square portrait photo at 24px top radius. Eyebrow label 'CREATOR STORIES' in 11px weight 500 uppercase with 0.1em tracking, in Ink. Name link at 18px weight 700 in Ink with trailing arrow. Body at 14–16px weight 400 in Deep Teal. 24px internal padding below the image.

### Feature Split Section
**Role:** Product detail blocks — large illustration on one side, copy on the other

Two-column layout: illustration panel left (or right) with a large chromatic background (Terracotta, Sky, Lavender) and floating geometric shapes, copy column right. Section eyebrow at 11px uppercase + 0.1em tracking in Ink, heading at 36px weight 700 in Ink, body at 18px weight 400 in Deep Teal, CTA button below. 80px vertical section padding, max-width 1200px container.

### Decorative Organic Shape
**Role:** Atmospheric floating blobs in the background of hero and feature sections

Irregular rounded shapes in Terracotta (#e39a4d), Sky (#a5c8d8), Lavender (#cbb0eb), and Cream (#f6ddc4). No border, no shadow. Sizes range from ~60px to ~200px. Positioned absolutely behind content at 0.6–0.9 opacity. This is the signature visual element — it transforms a clean SaaS layout into something that feels hand-cut and warm.

### Top Navigation Bar
**Role:** Primary site navigation

Fog (#f5f5f5) or transparent background, no border. Logo 'podia' wordmark left at 22px weight 700 in Ink. Center nav links at 16px weight 500 in Ink, 40px horizontal gap, 10px vertical padding. Right side: 'Login' text link + Primary CTA Button ('Sign up free'). Logo-link-button total spans ~1200px max-width.

### Eyebrow Label
**Role:** Section category marker above headings

11–12px weight 500 uppercase text, 0.1em letter-spacing, in Ink (#06040e). No background, no border, no punctuation. Acts as quiet signposting for the heading below. Examples: 'CREATOR STORIES', 'WEBSITE', 'ONLINE STORE'.

### Hero Headline Block
**Role:** Above-the-fold primary message

Centered layout. H1 at 60px weight 700, line-height 1.0, letter-spacing -0.03em, in Ink. Subhead at 18px weight 400, line-height 1.5, in Deep Teal (#10242f), max-width ~600px centered. Primary CTA button centered below. Floating organic shapes positioned at the four corners of the section for visual frame.

### Pill Badge / Tag
**Role:** Product category tags, small interactive chips

16px radius (almost pill), 8px vertical / 16px horizontal padding. Background in Mist (#e1edf2) or a tinted accent. Text at 12px weight 500 in Ink or Deep Teal. No border.

## Do's and Don'ts

### Do
- Use #06040 (Ink) as the single dark fill for every primary CTA — consistency is the point; the near-black with violet undertone is itself a brand signal
- Apply the three product colors (Sky, Terracotta, Lavender) as full card fills when representing Online Store, Website, and Email Marketing — they form a fixed associative triad
- Set display headlines at 60px/700 with -0.03em letter-spacing — the tight tracking on a geometric grotesque is the signature
- Use uppercase eyebrow labels at 11px with 0.1em tracking before any section heading — they create consistent section rhythm
- Apply 56px radius to the three product feature cards and 24px to standard content cards — the dramatic radius gap is intentional and creates visual hierarchy
- Float organic blob shapes in Terracotta, Sky, Lavender, and Cream behind hero and feature sections at 0.6–0.9 opacity — the shapes are the system's most distinctive element
- Use 80px vertical padding for all major sections and 36px internal padding for cards — generous breathing room is core to the warm, unhurried feel

### Don't
- Don't introduce gradients, glow effects, or glassmorphism — the system is deliberately matte and flat; the chromatic palette does the emotional work that gradients usually do
- Don't use blue (#a5c8d8) as an info/semantic color — it's a brand accent, not a status indicator. Reserve semantic colors for actual status states
- Don't use pure #000000 for text or buttons — the violet undertone in #06040 is what ties the dark elements to the brand palette
- Don't set body text larger than 18px or smaller than 16px — the type scale jumps directly from 18 to 24 for subheadings; the 16–18 body range is deliberate
- Don't apply shadows to cards — elevation comes from color fills and radius, not from drop shadows. Adding shadows will fight the papercraft metaphor
- Don't use the organic blob shapes at full opacity or as foreground elements — they are background atmosphere at 0.6–0.9 opacity, never interactive
- Don't mix the three product colors on a single card or button — each product zone owns one color exclusively

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f5` | Page background, outer section field |
| 1 | Card | `#ffffff` | Content cards, elevated panels, form surfaces |
| 2 | Accent Surface | `#e1edf2` | Soft tinted panels, alternating band backgrounds, ghost button fills |
| 3 | Product Card Sky | `#a5c8d8` | Colored feature card representing the Online Store product |
| 4 | Product Card Terracotta | `#e39a4d` | Colored feature card representing the Website product |
| 5 | Product Card Lavender | `#cbb0eb` | Colored feature card representing the Email Marketing product |

## Elevation

Podia uses no shadows. Elevation is expressed through chromatic surface fills (Sky/Terracotta/Lavender product cards sit visually above white cards, which sit above the Fog canvas) and through generous border-radius. A single hairline border in Mist (#e1edf2) at 1px is the only structural separator used.

## Imagery

Photography is used sparingly and only in social-proof contexts — portrait headshots of creators in Creator Story cards, tightly cropped as squares with no lifestyle context or environmental staging. The visual atmosphere is carried by flat geometric illustration: large rounded rectangles representing product surfaces, small organic blob shapes scattered as floating decoration, and triangular accent marks near CTA arrows. There are no 3D renders, no product screenshots in the hero, and no stock photography. The interface is essentially icon-and-illustration driven, with a papercut/craft-table aesthetic where shapes feel cut from colored paper.

## Layout

Full-width page model on a Fog (#f5f5f5) canvas, with content constrained to ~1200px max-width containers. Hero is a centered single-column stack: headline, subhead, CTA, then a three-column overlapping product card composition. Sections flow as alternating Fog and white bands with 80px vertical padding between them. Feature details use a 2-column split (illustration-left, copy-right) that alternates sides down the page. Creator stories use a 3-column equal grid. Navigation is a single horizontal bar — no sticky behavior, no sidebar, no mega-menu. The overall rhythm is spacious and unhurried: each section is its own world with generous breathing room, never information-dense.

## Color System: Product Triad

The three product colors (Sky #a5c8d8, Terracotta #e39a4d, Lavender #cbb0eb) are not a general accent palette — they are a fixed associative triad tied to Podia's three core products: Online Store, Website, and Email Marketing. When illustrating or representing these products anywhere in the product, use only the assigned color. Each color also has a dark variant: Plum (#1f1738) for Lavender, Graphite (#452623) for Terracotta, and Deep Teal (#10242f) for Sky. The dark variants carry text and outlined buttons when the product card is in its light fill.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #06040e (primary), #10242f (secondary)
- Background: #f5f5f5 (canvas), #ffffff (card)
- Border: #e1edf2 (hairline), #1f1738 (outlined action)
- Accent: #e39a4d (terracotta), #cbb0eb (lavender), #a5c8d8 (sky)
- primary action: #10242f (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #10242f background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a product feature card: Full fill in #e39a4d (Terracotta), 56px border-radius, 36px internal padding. Headline at 24px weight 700 in #06040e, body at 16px weight 400 in #452623. No border, no shadow. Include a small geometric illustration (rounded rectangle + triangle accent) in the lower portion.

3. Create a creator story card: #ffffff background, 24px radius, no shadow. Top half is a square portrait image area (placeholder, 24px top radius only). Below: 11px uppercase eyebrow 'CREATOR STORIES' in #06040e with 0.1em tracking, 18px name link in #06040e weight 700 with trailing arrow, 16px body in #10242f. 24px padding below image.



## Similar Brands

- **Gumroad** — Same creator-economy audience and warm minimal aesthetic, though Podia uses more chromatic product zones where Gumroad stays mostly monochrome pink
- **Teachable** — Same course-platform market and light-mode layout with centered hero, but Podia's papercraft blob decorations and tighter type tracking are distinctively more craft-driven
- **Kajabi** — Same all-in-one creator platform positioning and light canvas, but Kajabi leans more corporate-blue while Podia's terracotta-lavender-sky triad is markedly warmer and more handmade
- **Carrd** — Same light, single-page-builder aesthetic with generous radius and pill buttons, though Carrd is strictly monochrome while Podia deploys the three-color product triad
- **ConvertKit** — Same solo-creator target with light-mode interface, but Podia's organic blob shapes and warmer palette feel more like a craft studio than ConvertKit's cleaner editorial feel

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #06040e;
  --color-deep-teal: #10242f;
  --color-graphite: #452623;
  --color-fog: #f5f5f5;
  --color-paper: #ffffff;
  --color-mist: #e1edf2;
  --color-terracotta: #e39a4d;
  --color-lavender: #cbb0eb;
  --color-plum: #1f1738;
  --color-sky: #a5c8d8;
  --color-cream: #f6ddc4;

  /* Typography — Font Families */
  --font-stabilgrotesk: 'StabilGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading-sm: 20px;
  --leading-subheading-sm: 1.4;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.09;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 36px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 56px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-badges: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-general: 24px;
  --radius-featurecards: 56px;

  /* Surfaces */
  --surface-canvas: #f5f5f5;
  --surface-card: #ffffff;
  --surface-accent-surface: #e1edf2;
  --surface-product-card-sky: #a5c8d8;
  --surface-product-card-terracotta: #e39a4d;
  --surface-product-card-lavender: #cbb0eb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #06040e;
  --color-deep-teal: #10242f;
  --color-graphite: #452623;
  --color-fog: #f5f5f5;
  --color-paper: #ffffff;
  --color-mist: #e1edf2;
  --color-terracotta: #e39a4d;
  --color-lavender: #cbb0eb;
  --color-plum: #1f1738;
  --color-sky: #a5c8d8;
  --color-cream: #f6ddc4;

  /* Typography */
  --font-stabilgrotesk: 'StabilGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading-sm: 20px;
  --leading-subheading-sm: 1.4;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.48px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.09;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 56px;
}
```
