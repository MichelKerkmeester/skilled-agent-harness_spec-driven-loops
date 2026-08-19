# Monzo — Style Reference
> Warm coral on cool mint paper — confident restraint with a single hot accent.

**Theme:** light

Monzo operates as a digital-first challenger bank with a light, warm, and unapologetically friendly visual language. The canvas is a whisper-soft mint off-white (#f2f8f3) that sits behind crisp white card surfaces, creating a layered paper-on-paper feel without relying on heavy shadows. A single vivid Hot Coral (#ff4f40) carries all chromatic energy — it stains the logo, links, headings, icons, and the physical card product itself, while the rest of the interface stays achromatic and quiet. Typography is custom sans-serif in two voices: a text family with a distinctive negative letter-spacing of -0.05em that tightens paragraphs, and a chunky display face at 600-800 weight for headings. Components are generously rounded (pills for actions, 64px for containers) and deliberately low-elevation — the brand trusts color, type weight, and whitespace to create hierarchy, not drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hot Coral | `#ff4f40` | `--color-hot-coral` | Brand signature — logo, links, headings, icons, card product. One vivid accent against the achromatic interface; every chromatic moment in the system draws from this single hue |
| Midnight Ink | `#091723` | `--color-midnight-ink` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Deep Navy | `#112231` | `--color-deep-navy` | Secondary surface tint and footer accents. Slightly lighter than Midnight Ink for layered dark elements |
| Page Mist | `#f2f8f3` | `--color-page-mist` | Page canvas — the dominant background behind all content sections. A barely-green off-white that gives the interface warmth without competing with white surfaces |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, elevated panels, button text on dark fills. Sits one layer above the mint canvas |
| Soft Mint | `#e3ebe4` | `--color-soft-mint` | Hover washes, subtle filled buttons, inset surface treatment. Sits between the page canvas and white cards |
| Fog | `#b5b9bd` | `--color-fog` | Tertiary text, placeholder, low-emphasis borders |
| Steel | `#6b747b` | `--color-steel` | Secondary body text, metadata, descriptive copy. The workhorse neutral for supporting information |
| Ash | `#75817e` | `--color-ash` | Icon strokes, decorative line work, subtle dividers |
| Slate Button | `#3b4c54` | `--color-slate-button` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Pure Black | `#000000` | `--color-pure-black` | Maximum-contrast text, the darkest token in the system. Used sparingly for the highest-emphasis text on light surfaces |

## Tokens — Typography

### MonzoSansText — Body and UI text — navigation labels, button copy, descriptive paragraphs, card content, footer text. The custom -0.05em letter-spacing tightens running text for a dense, modern feel; the 400/600/700 spread lets the same family handle everything from captions to subheadings. Substitute with Inter or DM Sans if unavailable. · `--font-monzosanstext`
- **Substitute:** Inter
- **Weights:** 400, 600, 700
- **Sizes:** 13px, 16px, 20px, 24px, 32px, 36px
- **Line height:** 1.15, 1.38, 1.40, 1.50
- **Letter spacing:** -0.05em
- **Role:** Body and UI text — navigation labels, button copy, descriptive paragraphs, card content, footer text. The custom -0.05em letter-spacing tightens running text for a dense, modern feel; the 400/600/700 spread lets the same family handle everything from captions to subheadings. Substitute with Inter or DM Sans if unavailable.

### MonzoSansDisplay — Headlines and display text — hero statements, section headings, large product titles. Bolder weights (up to 800) at large sizes (39-61px) create confident, blocky headlines that feel architectural. No custom letter-spacing, letting the weight do the work. Substitute with Inter or Manrope at heavy weights. · `--font-monzosansdisplay`
- **Substitute:** Manrope
- **Weights:** 600, 700, 800
- **Sizes:** 16px, 20px, 25px, 31px, 39px, 44px, 49px, 61px
- **Line height:** 1.00, 1.20, 1.40
- **Letter spacing:** normal
- **Role:** Headlines and display text — hero statements, section headings, large product titles. Bolder weights (up to 800) at large sizes (39-61px) create confident, blocky headlines that feel architectural. No custom letter-spacing, letting the weight do the work. Substitute with Inter or Manrope at heavy weights.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.38 | -0.65px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.8px | `--text-body-sm` |
| body | 20px | 1.4 | -1px | `--text-body` |
| subheading | 24px | 1.38 | -1.2px | `--text-subheading` |
| heading | 36px | 1.15 | -1.8px | `--text-heading` |
| heading-lg | 44px | 1.2 | — | `--text-heading-lg` |
| display | 61px | 1 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 64px |
| badges | 4px |
| inputs | 24px |
| buttons | 500px |
| nav-pills | 500px |
| containers | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 0px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 30-32px
- **Element gap:** 24px

## Components

### Pill Nav Toggle
**Role:** Segment-style personal/business selector in the top bar

Light mint fill (#f2f8f3) on the active segment, transparent on the inactive. 500px border-radius (fully pill-shaped). MonzoSansText 16px weight 600. 8px vertical / 12-16px horizontal padding. The icon sits left of the label with a small chevron-right.

### Sign Up CTA (Dark Pill)
**Role:** Primary dark action in the top-right navigation

500px border-radius. Midnight Ink (#091723) background with white text. MonzoSansText 16px weight 600. 12px vertical / 20-24px horizontal padding. No shadow, no border. The highest-emphasis action on every screen.

### White Pill CTA
**Role:** Light-on-image call-to-action over the hero carousel

500px border-radius. White background with Midnight Ink text. 14-16px vertical / 28-32px horizontal padding. Sits on top of photography without competing — the eye reads the image first, then the button.

### Category Link List
**Role:** Expandable topic links in the help/footer navigation panel

Large-format links rendered in Hot Coral (#ff4f40) at 32-36px MonzoSansDisplay weight 700. Separated by 1px hairline borders in Soft Mint (#e3ebe4). Each row is 60-72px tall. The coral text against the pale mint background is the system's loudest text moment — intentional, guiding the eye down the list.

### Carousel Card
**Role:** Full-width hero image slider

64px border-radius on the outer container. Contains a full-bleed photograph with overlaid text (MonzoSansDisplay 44-61px weight 700 white) and a CTA button. Navigation dots are small white circles at the bottom-center. Left/right arrow controls are 40px circles with thin white outlines.

### Product Card
**Role:** Showcase for a banking product (current account, savings, etc.)

64px border-radius, 30-32px padding. Sits on the mint canvas. Contains a coral product visual (card image) on the left, MonzoSansText description on the right. No shadow, no border — separation is achieved through whitespace on the warm background.

### Which? Badge
**Role:** Third-party endorsement / trust signal

Circular badge, approximately 100-120px diameter, white background with a thin Hot Coral border. MonzoSansText 11-13px. Floats in the top-right corner of the hero card.

### FSCS Badge
**Role:** Regulatory trust mark

Small white rounded rectangle (4px radius), FSCS Protected logo in coral and dark navy. Positioned at the bottom-right of hero imagery.

### Arrow Control (Circular)
**Role:** Carousel pagination buttons

40px diameter circle, transparent fill, 1.5px white or Midnight Ink stroke. Simple chevron icon centered. No fill state, no shadow.

### Fixed Bottom Search Bar
**Role:** Persistent help/search input docked at the viewport bottom

64px border-radius. White background with a 2px Hot Coral focus ring on the left edge. Full-width minus margins. MonzoSansText 16px placeholder in Steel (#6b747b). Hovers above content as a floating utility.

### Sticky Top Bar
**Role:** Global navigation header

Transparent or white background, 64-80px height. Monzo logo (Hot Coral wordmark) on the left, segment toggle centered-left, Sign Up button on the right. 1px bottom border in Soft Mint on scroll.

### Menu Label
**Role:** Bold category heading in the expandable navigation panel

MonzoSansText 24-32px weight 700 in Midnight Ink. Sits above the coral link list. Acts as a quiet table-of-contents header.

### Carousel Dot Indicator
**Role:** Position indicator for the hero slider

Three to five small circles (8px). Active dot is white at full opacity, inactive dots are white at 40% opacity. No labels, no text.

## Do's and Don'ts

### Do
- Use 500px border-radius for all interactive pills — buttons, nav toggles, tag chips, and the search bar. This is the system's defining shape.
- Keep the interface 95% achromatic. Let Hot Coral (#ff4f40) appear only on the logo, links, headings, icons, and the card product — never as a background fill for UI controls.
- Use MonzoSansDisplay 600-800 for all headings at 36px and above. The heavier weight range is non-negotiable for display type.
- Apply -0.05em letter-spacing to all MonzoSansText usage. This is a brand-defining typographic detail, not optional.
- Layer surfaces on the mint canvas (#f2f8f3 → #ffffff → #e3ebe4) instead of using shadows. Elevation is communicated by color stepping, not by drop shadows.
- Set body text at 20px with 1.4 line-height for descriptive paragraphs. Monzo's text size runs larger than typical SaaS — 16px is the floor, not the default.
- Use 64px border-radius on all large containers — hero cards, product showcases, section panels. This generous rounding is as recognizable as the coral.

### Don't
- Don't use Hot Coral as a button background fill. It is for text, icons, logos, and the card product only — never for a solid CTA surface.
- Don't add drop shadows to cards or buttons. The system uses a single rgba(0,0,0,0.1) 0px 0px 10px shadow sparingly; most separation comes from surface color stepping on the mint canvas.
- Don't use system fonts or non-brand sans-serifs. Always specify MonzoSansText for body and MonzoSansDisplay for headings.
- Don't use letter-spacing other than -0.05em on MonzoSansText or normal on MonzoSansDisplay. Deviating breaks the brand's typographic fingerprint.
- Don't mix red and dark navy as a gradient or color pair on the same element. Coral is the accent; navy is the ground. They alternate, they don't blend.
- Don't use square or 8px radii on primary buttons or large containers. 500px pills and 64px containers are the two shape languages — anything between looks generic.
- Don't set body text below 16px or headlines below 32px. The type scale is deliberately generous; small text breaks the warm, spacious feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f2f8f3` | Base background — the warm mint that fills the viewport and defines the system's light theme. |
| 1 | Card Surface | `#ffffff` | Elevated content surfaces — hero card, product cards, floating search bar. One step brighter than the canvas. |
| 2 | Soft Fill | `#e3ebe4` | Inset surfaces, hover washes, subtle filled states. Sits between canvas and card for intermediate layering. |
| 3 | Active Highlight | `#b5b9bd` | Low-emphasis borders, inactive state washes, placeholder surface tone. |

## Elevation

- **Floating Search Bar:** `rgba(0, 0, 0, 0.1) 0px 0px 10px 0px`

## Imagery

Monzo's visual language is built on real photography of people in everyday financial moments — hands paying for coffee, fingers tapping card readers, casual lifestyle scenes with warm natural lighting. Photos are always full-bleed within a 64px-rounded container, never cropped to sharp rectangles, and always carry a dark overlay or darken treatment so white text remains legible. The Hot Coral card product itself functions as a recurring graphic element — a flat, vivid red rectangle that anchors product showcases. Iconography is minimal: simple outlined arrows and chevrons in thin strokes, never filled. No illustration, no 3D, no abstract graphics. The brand's confidence comes from believing one good photograph and one good color can carry a whole screen.

## Layout

Monzo's page structure is centered and max-width contained at approximately 1200px. The hero is a full-viewport carousel — each slide is a 64px-rounded image card spanning the full content width, with overlaid headline, subtext, and a white pill CTA positioned bottom-left. Below the hero, content sections stack vertically with 64-80px gaps, alternating between white product cards on the mint canvas and full-width coral-themed feature blocks. The fixed bottom search bar creates a persistent utility layer across all pages. Navigation is a simple sticky top bar with a pill segment toggle (Personal/Business), the coral wordmark logo left, and a dark Sign Up pill right. The expandable help/navigation panel uses a single-column list of oversized coral links — no grids, no cards, just typography at scale doing the structural work.

## Agent Prompt Guide

**Quick Color Reference**
- text: #091723 (Midnight Ink)
- background: #f2f8f3 (Page Mist mint canvas)
- surface: #ffffff (white card)
- border: #e3ebe4 (Soft Mint hairline)
- accent: #ff4f40 (Hot Coral — links, headings, icons, logo only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Sticky Top Bar**: Transparent background, 72px height. Monzo wordmark logo in #ff4f40 on the left. Center-left: pill segment toggle with 500px radius, 8px/16px padding, #f2f8f3 active fill, MonzoSansText 16px weight 600 in #091723. Right: dark pill button — #091723 fill, white text, 500px radius, 12px/24px padding, MonzoSansText 16px weight 600.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Category Link List**: Full-width panel on #f2f8f3 background. Each row: MonzoSansDisplay 32px weight 700 in #ff4f40, 60-72px row height, 1px bottom border in #e3ebe4. No icons, no backgrounds — pure typographic navigation.

4. **Product Showcase Row**: Two-column layout on #f2f8f3 canvas. Left: Hot Coral card image (flat red rectangle, 200px wide, 64px radius). Right: 500px padding-left gap. MonzoSansDisplay 36px weight 700 in #091723 heading, MonzoSansText 20px weight 400 in #6b747b body text. Circular arrow controls (40px, 1.5px stroke #091723) above the heading.

5. **Floating Bottom Search Bar**: Fixed to viewport bottom, 56px height, full width minus 40px margins, 64px radius, #ffffff fill, rgba(0,0,0,0.1) 0px 0px 10px 0px shadow. Left edge: 2px #ff4f40 accent stripe. Placeholder: MonzoSansText 16px weight 400 in #6b747b.

## Similar Brands

- **Starling Bank** — Same UK challenger-bank aesthetic — light off-white canvas, minimal elevation, single bold accent color (Starling uses teal, Monzo uses coral) and generous rounded corners on all containers.
- **Revolut** — Flat light surfaces with a single saturated brand color, oversized pill buttons, and a reliance on custom sans-serif typography at heavy display weights.
- **Klarna** — Light canvas, pink/coral as the sole chromatic accent, oversized rounded containers (similar 64px+ radii), and a warm approachable typographic voice aimed at consumer finance.
- **N26** — Minimal fintech layout with generous whitespace, large display headlines, and a brand that trusts one accent color and typographic weight to create hierarchy without shadows or gradients.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hot-coral: #ff4f40;
  --color-midnight-ink: #091723;
  --color-deep-navy: #112231;
  --color-page-mist: #f2f8f3;
  --color-pure-white: #ffffff;
  --color-soft-mint: #e3ebe4;
  --color-fog: #b5b9bd;
  --color-steel: #6b747b;
  --color-ash: #75817e;
  --color-slate-button: #3b4c54;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-monzosanstext: 'MonzoSansText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monzosansdisplay: 'MonzoSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.38;
  --tracking-caption: -0.65px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.8px;
  --text-body: 20px;
  --leading-body: 1.4;
  --tracking-body: -1px;
  --text-subheading: 24px;
  --leading-subheading: 1.38;
  --tracking-subheading: -1.2px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -1.8px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.2;
  --text-display: 61px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 30-32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 64px;
  --radius-full-2: 100px;
  --radius-full-3: 500px;

  /* Named Radii */
  --radius-cards: 64px;
  --radius-badges: 4px;
  --radius-inputs: 24px;
  --radius-buttons: 500px;
  --radius-nav-pills: 500px;
  --radius-containers: 32px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;

  /* Surfaces */
  --surface-page-canvas: #f2f8f3;
  --surface-card-surface: #ffffff;
  --surface-soft-fill: #e3ebe4;
  --surface-active-highlight: #b5b9bd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hot-coral: #ff4f40;
  --color-midnight-ink: #091723;
  --color-deep-navy: #112231;
  --color-page-mist: #f2f8f3;
  --color-pure-white: #ffffff;
  --color-soft-mint: #e3ebe4;
  --color-fog: #b5b9bd;
  --color-steel: #6b747b;
  --color-ash: #75817e;
  --color-slate-button: #3b4c54;
  --color-pure-black: #000000;

  /* Typography */
  --font-monzosanstext: 'MonzoSansText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monzosansdisplay: 'MonzoSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.38;
  --tracking-caption: -0.65px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.8px;
  --text-body: 20px;
  --leading-body: 1.4;
  --tracking-body: -1px;
  --text-subheading: 24px;
  --leading-subheading: 1.38;
  --tracking-subheading: -1.2px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -1.8px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.2;
  --text-display: 61px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 64px;
  --radius-full-2: 100px;
  --radius-full-3: 500px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
}
```
