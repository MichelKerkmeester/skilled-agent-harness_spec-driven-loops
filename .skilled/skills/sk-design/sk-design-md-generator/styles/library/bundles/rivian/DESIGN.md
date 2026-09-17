# Rivian — Style Reference
> Electric monolith on a concrete gallery wall. Rivian stages each vehicle as a sculpture against vast white space, with typography so large it becomes architecture and one warm yellow that breaks the monochrome like sunlight on a matte surface.

**Theme:** light

Rivian presents its vehicles as monumental objects in a clean architectural gallery: white concrete canvases, full-bleed cinematic photography, and one signature Solar Yellow accent that electrifies the otherwise monochrome system. Typography does the heavy lifting — a custom Adventure typeface at near-black weights paired with Liga at 360px for product monograms makes each vehicle feel branded and indivisible. Components are minimal and confident: pill-shaped controls, hairline borders, flat surfaces, and generous negative space that lets photography breathe. Color is rationed to the single yellow CTA and a few paint-swatch accents; everything else is graphite, concrete, and white. The system rejects decoration in favor of scale, restraint, and theatrical product presentation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Solar Yellow | `#ffac00` | `--color-solar-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Canyon Orange | `#e84826` | `--color-canyon-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Forest Green | `#629b5c` | `--color-forest-green` | Secondary accent for vehicle color options and category tags |
| Sky Blue | `#77afd8` | `--color-sky-blue` | Secondary accent for vehicle color options and informational highlights |
| Slate Blue | `#9fa1b8` | `--color-slate-blue` | Cool-tinted shadow base and atmospheric wash — the only chromatic neutral, gives elevation a slightly overcast feel |
| Graphite | `#151515` | `--color-graphite` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Pure Black | `#000000` | `--color-pure-black` | High-contrast text, icon fills, and the heaviest display headings where maximum weight is needed |
| Concrete | `#e5e7eb` | `--color-concrete` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Ash | `#cfd0d0` | `--color-ash` | Mid-gray surface and shadow base for elevated cards and subtle depth |
| Fog | `#b8b8b8` | `--color-fog` | Muted helper text and tertiary metadata |
| Steel | `#616161` | `--color-steel` | Secondary nav text, subdued icon fills, inactive labels |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surface, reversed text on dark fills |
| Chalk | `#f2f2f2` | `--color-chalk` | Alternate page background for content sections — warmer than pure white, breaks the canvas rhythm |
| Charcoal | `#212121` | `--color-charcoal` | Input field backgrounds and dark UI surfaces — slightly lighter than Graphite to read as surface rather than text |

## Tokens — Typography

### Adventure — Primary brand typeface used across nav, body, headings, buttons, and cards. Custom geometric humanist sans with slightly squared terminals — chosen for its engineering feel that matches the vehicle aesthetic. Letter-spacing tightens aggressively at large sizes (-0.045em at 120px down to -0.01em at body). The weight 400 body is light for a technical brand; weight 500 is the working weight for UI; weight 600 is reserved for emphasis and key CTAs. Font features disable contextual alternates and standard ligatures for a clean modern feel. · `--font-adventure`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400, 500, 600
- **Sizes:** 10, 11, 12, 14, 16, 20, 24, 32, 36, 44, 56, 72, 120
- **Line height:** 1.0–1.55 (tight at large sizes, open at body)
- **Letter spacing:** -0.045em at 120px, -0.042em at 72px, -0.036em at 56px, -0.031em at 44px, -0.025em at 36px, -0.021em at 32px, -0.020em at 24px, -0.01em at 16-20px, normal at 12-14px
- **OpenType features:** `"clig" 0, "liga" 0, "ss01" 0`
- **Role:** Primary brand typeface used across nav, body, headings, buttons, and cards. Custom geometric humanist sans with slightly squared terminals — chosen for its engineering feel that matches the vehicle aesthetic. Letter-spacing tightens aggressively at large sizes (-0.045em at 120px down to -0.01em at body). The weight 400 body is light for a technical brand; weight 500 is the working weight for UI; weight 600 is reserved for emphasis and key CTAs. Font features disable contextual alternates and standard ligatures for a clean modern feel.

### Liga — Monumental display font used exclusively for product monograms (R1S, R1T) at 360px. A geometric display face with characteristic sharp cuts — it functions as a logo, not running text. The tight -0.022em tracking at 360px creates a dense visual block that anchors the entire product page. · `--font-liga`
- **Substitute:** Druk Wide, GT America Compressed, or Title Condensed
- **Weights:** 500
- **Sizes:** 360
- **Line height:** 1.0
- **Letter spacing:** -0.0220em
- **OpenType features:** `"clig", "liga", "ss01"`
- **Role:** Monumental display font used exclusively for product monograms (R1S, R1T) at 360px. A geometric display face with characteristic sharp cuts — it functions as a logo, not running text. The tight -0.022em tracking at 360px creates a dense visual block that anchors the entire product page.

### Söhne — Used sparingly for fine print and legal micro-copy where a different voice signals regulatory content · `--font-shne`
- **Substitute:** Inter or system-ui
- **Weights:** 500
- **Sizes:** 12
- **Line height:** 1.33
- **Role:** Used sparingly for fine print and legal micro-copy where a different voice signals regulatory content

### Sohne — Sohne — detected in extracted data but not described by AI · `--font-sohne`
- **Weights:** 500
- **Sizes:** 12px
- **Line height:** 1.33
- **Role:** Sohne — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.43 | — | `--text-caption` |
| body | 14px | 1.55 | -0.14px | `--text-body` |
| body-lg | 16px | 1.5 | -0.16px | `--text-body-lg` |
| subheading | 20px | 1.33 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.48px | `--text-heading-sm` |
| heading-lg | 44px | 1.14 | -1.364px | `--text-heading-lg` |
| heading-xl | 56px | 1.13 | -2.016px | `--text-heading-xl` |
| display | 72px | 1.09 | -3.024px | `--text-display` |
| display-lg | 120px | 1 | -5.4px | `--text-display-lg` |
| hero | 360px | 1 | -7.92px | `--text-hero` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 20px |
| chips | 99px |
| icons | 8px |
| pills | 9999px |
| images | 20px |
| inputs | 4px |
| buttons | 40px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Solar Yellow CTA Button
**Role:** Primary action button (Demo drive, key conversions)

Pill shape at 40px radius, #ffac00 fill, #151515 text in Adventure weight 500 at 14px. Padding 12px 24px. The single chromatic button in the system — it exists to be the visual climax of any page. Never use a second yellow button on the same screen.

### Graphite Filled Button
**Role:** Primary action in sections without the yellow demo CTA (Explore vehicle)

Pill shape at 40px radius, #151515 fill, #ffffff text in Adventure weight 500 at 14px. Padding 12px 24px. The dark counterpart to Solar Yellow — used when the yellow is reserved for the demo conversion.

### Light Filled Button
**Role:** Tertiary action (Buy, secondary commerce flow)

Pill shape at 40px radius, #e5e7eb fill, #151515 text in Adventure weight 500 at 14px. Padding 12px 24px. Quiet alternative that doesn't compete with the dark or yellow primary buttons.

### Ghost Button — Light Outline
**Role:** Secondary action over photography (View all offers)

Pill shape at 40px radius, transparent fill, 1px #ffffff border, #ffffff text in Adventure weight 500 at 14px. Padding 12px 24px. Designed to sit on dark or photographic backgrounds without competing with the image.

### Ghost Button — Dark Outline
**Role:** Secondary action on light backgrounds (Shop)

Pill shape at 40px radius, transparent fill, 1px #151515 border, #151515 text in Adventure weight 500 at 14px. Padding 12px 24px. Mirrors the light ghost for use on white or chalk surfaces.

### Pill Nav Button
**Role:** Top-level navigation items and category chips

Full 9999px radius, 8px 16px padding, Adventure weight 500 at 12-14px. #151515 text. Used for primary nav links, tag chips, and filter pills. The fully rounded form contrasts with the 40px buttons to create a typology of roundness.

### Top Navigation Bar
**Role:** Global site navigation

White (#ffffff) background, 1px #e5e7eb bottom border, fixed position. Logo left (not extracted, assumed), centered nav links (Vehicles, Charging, Technology, Discover, Gear Shop) in Adventure 500 at 14px #151515, Solar Yellow Demo drive CTA right. Height approximately 60px. Minimal, airy, high-contrast.

### Hero Carousel Slide
**Role:** Full-bleed promotional hero with vehicle photography

Full viewport width, ~80vh height. Background is a full-bleed photographic image of a vehicle in an environmental context. Overlaid white headline (Adventure 500, 44-56px, -1.36 to -2.02px tracking) positioned bottom-left. Subtext at 16px weight 400. Two buttons side by side: ghost-light + filled-yellow or ghost-dark. Carousel pagination as small pill indicators centered below.

### Product Monogram Block
**Role:** R1S/R1T product identity page header

Chalk (#f2f2f2) background. Liga at 360px weight 500 in #000000, centered, with -7.92px tracking. Vehicle product photo centered below in full profile view, with no card or frame — the vehicle sits directly on the background. Tagline below at 20px weight 500 #151515, then price at 14px weight 400 #616161, then two buttons (Explore = Graphite, Buy = Light).

### Location Selector Dropdown
**Role:** Region/continent selection in nav

Dark surface (#151515) panel, white text, with +/– expand indicators. Expanded items show "North America" and "Europe" in Adventure 500 at 14px. Rounded at 12px. The dark surface in an otherwise light nav signals utility/configuration rather than marketing.

### Legal/Disclosure Text Block
**Role:** Fine print, terms, disclaimers

#e5e7eb background, full-width contained. Body text in Adventure 400 at 12px #151515 with normal tracking, line-height 1.55. Left-aligned, max-width container. Dense and utilitarian — a stark contrast to the theatrical hero above.

### Chip Tag (99px radius)
**Role:** Category labels, vehicle feature tags

Fully rounded at 99px, #e5e7eb background or #f2f2f2, #151515 text in Adventure 500 at 12px. Padding 6px 14px. Used for product categories, feature labels, and contextual tags.

## Do's and Don'ts

### Do
- Use Solar Yellow (#ffac00) for exactly one primary CTA per screen — never pair it with another yellow element.
- Use 40px border-radius for all action buttons and 9999px for nav links and tag chips — these two radii define the system.
- Let photography fill the viewport edge-to-edge in hero sections; never frame vehicle images in cards on landing pages.
- Scale typography aggressively: use 56px+ for page-level headings, 120px for display moments, and 360px Liga for product monograms only.
- Set letter-spacing to negative values at all sizes above 20px: -0.020em at 24px scaling to -0.045em at 120px.
- Keep most surfaces flat — use #e5e7eb hairline borders for definition rather than shadows.
- Use #f2f2f2 (Chalk) to alternate section backgrounds and break white-only monotony.

### Don't
- Do not use any chromatic color other than Solar Yellow for primary actions — the system is monochrome by design.
- Do not use shadows for elevation; use surface color shifts (#ffffff → #f2f2f2 → #e5e7eb) instead.
- Do not set body text below 12px or above 18px — the 14-16px body range is deliberate.
- Do not use rounded images above 20px radius on landing pages; the product should feel architectural, not soft.
- Do not use multiple typefaces in a single composition — Adventure handles 99% of the system; Liga is reserved for product monograms.
- Do not apply gradients to UI components; gradients in the data are atmospheric washes only, not interface decoration.
- Do not use color for hierarchy in monochrome sections — rely on weight (400 vs 500 vs 600) and size differences.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper Canvas | `#ffffff` | Default page background and primary card surface |
| 2 | Chalk Section | `#f2f2f2` | Alternate section background to create rhythm on long pages |
| 3 | Concrete Border | `#e5e7eb` | Hairline dividers, button base, fine print background |
| 4 | Ash Elevation | `#cfd0d0` | Subtle elevated surface and shadow base |
| 5 | Charcoal Utility | `#212121` | Input fields and dark utility surfaces |

## Elevation

- **Cards and elevated surfaces:** `0 4px 12px rgba(159, 161, 184, 0.15)`
- **Floating panels and dropdowns:** `0 8px 24px rgba(159, 161, 184, 0.2)`

## Imagery

Photography is the dominant visual asset: full-bleed, cinematic, environmental shots of vehicles in natural and urban settings (city streets, dirt roads, twilight landscapes). Treatment is naturalistic with no duotone or heavy color grading — the vehicles appear as they are, shot at golden hour or overcast light for drama. No lifestyle people-centric framing; the vehicle is always the hero, sometimes with a single human figure for scale. Images use 20px border-radius when contained. The visual language also includes the 360px Liga monogram as a graphic element — typography that functions as art. No illustrations, no abstract graphics, no 3D renders in marketing contexts.

## Layout

Page model is full-bleed with centered max-width content containers at ~1440px. Navigation is a minimal top bar (white, fixed) with centered links and a right-aligned yellow CTA. Hero sections are full-viewport-width photographic backgrounds with text overlays positioned bottom-left. Product monogram pages use centered symmetry: massive type → centered vehicle profile → centered text stack → centered button pair. Section rhythm alternates between full-bleed photo sections and centered narrow text blocks. Content arrangement favors centered stacks over asymmetric layouts. Card grids appear for vehicle comparisons and feature listings, typically 2-3 columns with generous gutters. Dense sections (legal, specs) use constrained max-width with justified text. Spacing is generous — 80px section gaps, 24px card padding, 8px element gaps — the system breathes.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffffff (primary canvas), #f2f2f2 (alternate section)
- text: #151515 (primary), #616161 (secondary), #b8b8b8 (tertiary)
- border: #e5e7eb (hairline), #cfd0d0 (emphasis)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero Carousel Slide**: Full-bleed 80vh, background image of vehicle in urban environment. White headline 'Choose your own savings' at 56px Adventure weight 500, -2.016px tracking, positioned bottom-left with 40px left padding. Subtext at 16px weight 400 #ffffff. Two buttons: ghost (1px #ffffff border, transparent fill, white text, 40px radius) and yellow filled (#ffac00, #151515 text, 40px radius). Both at 14px Adventure 500 with 12px 24px padding.

2. **Product Monogram Page**: Chalk #f2f2f2 background. Liga at 360px weight 500 #000000, centered, -7.92px tracking for the R1S mark. Vehicle profile image centered below at 80% width with no frame. Tagline at 20px weight 500 #151515 centered, then 'From $76,990' at 14px weight 400 #616161. Two centered buttons: Explore (#151515 fill, white text) and Buy (#e5e7eb fill, #151515 text), both 40px radius, 12px 24px padding.

3. **Top Navigation Bar**: White #ffffff background, 1px #e5e7eb bottom border, 60px height. Centered nav links (Vehicles, Charging, Technology, Discover, Gear Shop) in Adventure 500 at 14px #151515 with 32px horizontal gaps. Solar Yellow 'Demo drive' pill button right-aligned (40px radius, 12px 24px padding, Adventure 500 14px #151515 text).

4. **Feature Tag Chips**: 99px border-radius, #e5e7eb background, #151515 text in Adventure 500 at 12px, padding 6px 14px. Used inline to label vehicle capabilities and categories.

5. **Legal Disclaimer Block**: #e5e7eb full-width background, max-width 1200px container. Body text at 12px Adventure 400 #151515, line-height 1.55, normal tracking. Dense paragraph block with 4px row-gap between paragraphs.

## Similar Brands

- **Polestar** — Same monochrome gallery approach with single accent color, massive product monogram typography, and full-bleed environmental vehicle photography on clean white surfaces
- **Lucid Motors** — Minimalist automotive presentation with one-color accent system, generous white space, and large-format product name typography
- **Apple (product pages)** — Full-bleed product photography, centered narrow text blocks, oversized display typography, and near-monochrome palette with one accent
- **Tesla** — Restrained UI chrome, photography-first product presentation, and minimal use of decorative color
- **Arc'teryx** — Custom typeface, monochrome canvas, hairline borders, pill-shaped controls, and emphasis on letting product imagery dominate

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-solar-yellow: #ffac00;
  --color-canyon-orange: #e84826;
  --color-forest-green: #629b5c;
  --color-sky-blue: #77afd8;
  --color-slate-blue: #9fa1b8;
  --color-graphite: #151515;
  --color-pure-black: #000000;
  --color-concrete: #e5e7eb;
  --color-ash: #cfd0d0;
  --color-fog: #b8b8b8;
  --color-steel: #616161;
  --color-paper: #ffffff;
  --color-chalk: #f2f2f2;
  --color-charcoal: #212121;

  /* Typography — Font Families */
  --font-adventure: 'Adventure', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-liga: 'Liga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne: 'Sohne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.43;
  --text-body: 14px;
  --leading-body: 1.55;
  --tracking-body: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.48px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.364px;
  --text-heading-xl: 56px;
  --leading-heading-xl: 1.13;
  --tracking-heading-xl: -2.016px;
  --text-display: 72px;
  --leading-display: 1.09;
  --tracking-display: -3.024px;
  --text-display-lg: 120px;
  --leading-display-lg: 1;
  --tracking-display-lg: -5.4px;
  --text-hero: 360px;
  --leading-hero: 1;
  --tracking-hero: -7.92px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 56px;
  --radius-full-2: 80px;
  --radius-full-3: 99px;
  --radius-full-4: 9999px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 20px;
  --radius-chips: 99px;
  --radius-icons: 8px;
  --radius-pills: 9999px;
  --radius-images: 20px;
  --radius-inputs: 4px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-chalk-section: #f2f2f2;
  --surface-concrete-border: #e5e7eb;
  --surface-ash-elevation: #cfd0d0;
  --surface-charcoal-utility: #212121;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-solar-yellow: #ffac00;
  --color-canyon-orange: #e84826;
  --color-forest-green: #629b5c;
  --color-sky-blue: #77afd8;
  --color-slate-blue: #9fa1b8;
  --color-graphite: #151515;
  --color-pure-black: #000000;
  --color-concrete: #e5e7eb;
  --color-ash: #cfd0d0;
  --color-fog: #b8b8b8;
  --color-steel: #616161;
  --color-paper: #ffffff;
  --color-chalk: #f2f2f2;
  --color-charcoal: #212121;

  /* Typography */
  --font-adventure: 'Adventure', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-liga: 'Liga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne: 'Sohne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.43;
  --text-body: 14px;
  --leading-body: 1.55;
  --tracking-body: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.48px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.364px;
  --text-heading-xl: 56px;
  --leading-heading-xl: 1.13;
  --tracking-heading-xl: -2.016px;
  --text-display: 72px;
  --leading-display: 1.09;
  --tracking-display: -3.024px;
  --text-display-lg: 120px;
  --leading-display-lg: 1;
  --tracking-display-lg: -5.4px;
  --text-hero: 360px;
  --leading-hero: 1;
  --tracking-hero: -7.92px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 56px;
  --radius-full-2: 80px;
  --radius-full-3: 99px;
  --radius-full-4: 9999px;
}
```
