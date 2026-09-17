# Heart Aerospace — Style Reference
> monumental type drifting through cloud-level gradient skies — the brand reads like an engineering manifesto printed on atmosphere.

**Theme:** light

Heart Aerospace uses a monumental-typography-over-atmospheric-sky language: the brand communicates through oversized type and full-bleed aviation photography, with almost no decorative UI chrome. The palette is nearly monochrome — a muted stratosphere purple-gray anchors atmospheric sections, a deep jetstream blue punctuates outlined actions, and black/white carry all structural weight. Every screen should feel like a single composition: type the subject, photography the environment, negative space the luxury. There are no cards, no shadows, no rounded surfaces, no gradients beyond the sky atmosphere — the design earns its restraint by letting a 156px display headline and a photograph do all the work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Stratosphere | `#716e85` | `--color-stratosphere` | Hero and section atmospheric backgrounds, sky gradient origin, the signature non-neutral surface that carries brand mood |
| Jetstream Blue | `#001489` | `--color-jetstream-blue` | Outlined/ghost action borders, link text, image accent borders — the only chromatic accent, used as outlined-link color and focused-frame treatment, never as a filled button background |
| Onyx | `#000000` | `--color-onyx` | Primary text, structural borders, footer background, partner logo fills |
| Cloud | `#ffffff` | `--color-cloud` | Inverse text on dark and gradient backgrounds, content section canvas, navigation text on hero, gradient endpoint |

## Tokens — Typography

### NeueHaasText — NeueHaasText — detected in extracted data but not described by AI · `--font-neuehaastext`
- **Weights:** 400, 600
- **Sizes:** 18px
- **Line height:** 1, 1.3
- **Letter spacing:** -0.01
- **Role:** NeueHaasText — detected in extracted data but not described by AI

### NeueHaasGroteskDisplay — Monumental display headlines (ES-30 wordmark, section showstoppers) — the weight 600 at 156px with -0.02em tracking is the brand's signature voice, engineered for aerospace-scale moments that fill the viewport · `--font-neuehaasgroteskdisplay`
- **Substitute:** Inter Display Bold, Helvetica Neue Bold, or Söhne Breit Bold
- **Weights:** 600
- **Sizes:** 
- **Line height:** 1.00
- **Letter spacing:** -0.02em
- **Role:** Monumental display headlines (ES-30 wordmark, section showstoppers) — the weight 600 at 156px with -0.02em tracking is the brand's signature voice, engineered for aerospace-scale moments that fill the viewport

### NeueHaasGroteskText — All UI and body text — navigation links, body copy, footer links, captions. Weight 400 is the default reading voice; weight 600 for subheadings and emphasized nav. The -0.01em tracking at 18px is subtle but consistent — tighter than browser default, which is the Ne Haas family hallmark · `--font-neuehaasgrotesktext`
- **Substitute:** Inter, Helvetica Neue, or Söhne
- **Weights:** 400, 600
- **Sizes:** 
- **Line height:** 1.30
- **Letter spacing:** -0.01em
- **Role:** All UI and body text — navigation links, body copy, footer links, captions. Weight 400 is the default reading voice; weight 600 for subheadings and emphasized nav. The -0.01em tracking at 18px is subtle but consistent — tighter than browser default, which is the Ne Haas family hallmark

### NeueHaasDisplay — NeueHaasDisplay — detected in extracted data but not described by AI · `--font-neuehaasdisplay`
- **Weights:** 600
- **Sizes:** 46px, 156px
- **Line height:** 1
- **Letter spacing:** -0.02
- **Role:** NeueHaasDisplay — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 18px | 1.3 | -0.18px | `--text-body` |
| heading-sm | 46px | 1 | -0.92px | `--text-heading-sm` |
| display | 156px | 1 | -3.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 46 | 46px | `--spacing-46` |
| 70 | 70px | `--spacing-70` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 70px
- **Element gap:** 18-20px

## Components

### Transparent Hero Navigation
**Role:** Primary site navigation overlaid on atmospheric hero

No background, no border, no fill. Heart Aerospace logo (aircraft icon + wordmark, ~120px wide) anchored left, text links right-aligned (Our mission, Company, ES-30™, Newsroom, Careers, Media bank, Contact). Links in Cloud #ffffff at 18px weight 400 with 28px left margins between items. Sits directly on the gradient/photograph with no visual separation.

### Full-Bleed Atmospheric Hero
**Role:** Brand introduction section with photography and overlay headline

Edge-to-edge aviation photograph (aircraft above clouds) with a linear gradient overlay from Stratosphere #716e85 at top fading to lighter tones. No padding constraint — image fills viewport. Headline anchored to bottom-left in Cloud #ffffff, NeueHaasGroteskDisplay at ~120-156px, -0.02em tracking, line-height 1.0. 40px left padding from viewport edge.

### Monumental Display Section
**Role:** Product naming or section showstopper (e.g. 'ES-30')

Full-bleed gradient background (Stratosphere #716e85 to Cloud #ffffff, linear, top to bottom). Single NeueHaasGroteskDisplay word in Cloud #ffffff at 156px, weight 600, -0.02em tracking, filling 80%+ of viewport width. No supporting copy in the same viewport — the type IS the content. Product imagery enters from the bottom edge as a subtle reveal.

### Outlined Ghost Link
**Role:** Primary interactive accent — navigation CTA, external links, focused treatments

1-2px border in Jetstream Blue #001489, no background fill, Cloud or Onyx text inside. Text in NeueHaasGroteskText 18px weight 400. Zero radius. Used for link borders (48 occurrences in data) and image frames (44 occurrences) — this is a bordered/outlined action style, never a filled button.

### Partner Logo Grid
**Role:** Social proof — investors, airline partners, institutional backers

Cloud #ffffff background section. 5-column grid wrapping to 3 rows, generous 40px+ vertical gap between rows. All logos rendered in Onyx #000000 monochrome (original brand colors stripped). Logos centered within their grid cells at uniform optical size. No borders, no cards, no background tiles.

### Onyx Footer
**Role:** Terminal site navigation, social links, and corporate address

Solid Onyx #000000 background, full-bleed. Three-column layout: Navigation (internal links), Follow (social platforms), Address (201 Nevada St Suite B, El Segundo, CA 90245). Column headers in Cloud #ffffff weight 600, list items weight 400. 20px vertical padding per link. 40px horizontal section padding. Small bottom-left logo mark in Cloud as a closing signature.

### Section Headline (Cloud Canvas)
**Role:** Content section titles on white background pages

NeueHaasGroteskDisplay 46px weight 600, -0.02em tracking, Onyx #000000 color, line-height 1.0. Sits with 46px margin-bottom from body content. Left-aligned, 40px from container edge.

## Do's and Don'ts

### Do
- Set display headlines at 156px in NeueHaasGroteskDisplay weight 600 with -0.02em tracking — this scale is the brand's signature and should not be reduced for non-product pages
- Use the linear gradient from Stratosphere #716e85 to Cloud #ffffff for all atmospheric/hero section backgrounds
- Render all partner and third-party logos in monochrome Onyx #000000 on light surfaces — never preserve original logo colors
- Keep all interactive elements as outlined/ghost (Jetstream Blue #001489 border, no fill) — never introduce filled buttons with backgrounds
- Set all border-radius to 0 — this system has no rounded surfaces anywhere
- Use Cloud #ffffff text on Stratosphere/Onyx surfaces; use Onyx #000000 text only on Cloud surfaces
- Anchor headlines to the left edge with 40px padding from viewport — never center display type

### Don't
- Do not use Jetstream Blue #001489 as a filled button background — it is an outlined-action color only (ACTION_BACKGROUND=0 in the data)
- Do not introduce card components with padding, borders, or shadows — the system is flat and full-bleed
- Do not add border-radius to buttons, inputs, tags, or images — every corner is sharp
- Do not use color for section differentiation — the palette is intentionally three colors plus white, repetition is the point
- Do not place body copy directly on the Stratosphere #716e85 background — it fails contrast (2.9:1 with Jetstream Blue, 4.3:1 with Onyx); only Cloud #ffffff text survives on atmospheric surfaces
- Do not add drop shadows or elevation effects — the design language is flat, depth comes from photography and gradient not from CSS shadows
- Do not use decorative icons or illustrations — the only mark is the Heart Aerospace aircraft logo

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Atmospheric Canvas | `#716e85` | Full-bleed hero and feature sections — the gradient origin for sky photography overlays |
| 1 | Cloud Canvas | `#ffffff` | Content sections below the fold — partner grids, article bodies, secondary pages |
| 2 | Onyx Footer | `#000000` | Terminal footer surface for navigation, social, and address columns |

## Imagery

Photography is the primary visual medium — full-bleed aviation photography dominates the hero, showing the ES-30 aircraft in flight above clouds at golden-hour sunset. Treatment is atmospheric and aspirational: high-altitude perspective, soft natural light, the aircraft positioned small within vast sky to emphasize scale and environment over product detail. No lifestyle photography, no people, no ground-level shots. Logos in the partner grid are stripped to monochrome Onyx — original brand color is always removed. There are no illustrations, no icons beyond the minimal logo mark, no 3D renders, no decorative graphics. When photography ends, white space and type take over.

## Layout

Full-bleed edge-to-edge design with no max-width container — every section fills the viewport. The page is a vertical sequence of atmospheric bands: full-bleed gradient/photography hero → gradient display section (ES-30) → white content sections with partner grid → Onyx terminal footer. There is no centered narrow column, no asymmetric split layouts, no card grids with padding — the layout grammar is 'band, headline, photograph, repeat.' Navigation is a transparent overlay on the hero only. Content alignment is left-edge anchored (40px from viewport) for headlines, centered for logo grids. Vertical rhythm is generous: 70px section gaps, 40px content padding, plenty of empty atmosphere between type moments. The layout is architectural — each screen is a single composition, not a collection of components.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Onyx)
- background: #ffffff (Cloud)
- atmospheric hero/section: #716e85 (Stratosphere)
- border/footer: #000000 (Onyx)
- accent (outlined actions, link borders, image frames): #001489 (Jetstream Blue)
- primary action: #001489 (outlined action border)

**Example Component Prompts**

1. *Atmospheric hero section:* Full-bleed section, no max-width. Linear gradient background from #716e85 at top fading to #ffffff at 65%. Headline 'Electrifying regional air travel' in NeueHaasGroteskDisplay, 120px, weight 600, color #ffffff, letter-spacing -0.02em, line-height 1.0, anchored 40px from left edge and bottom of viewport. No card, no shadow, no border.

2. *Monumental product display:* Full-viewport section, gradient background #716e85 → #ffffff (top to bottom). Single word 'ES-30' in NeueHaasGroteskDisplay, 156px, weight 600, #ffffff, letter-spacing -0.02em, line-height 1.0, filling ~80% of viewport width. No body copy in the same viewport.

3. *Outlined ghost link button:* Transparent background, 1.5px solid border in #001489 (Jetstream Blue). Text in NeueHaasGroteskText, 18px, weight 400, color #000000. Zero border-radius. Padding 12px 24px. No hover fill — color shifts to #001489 text on white background only.

4. *Partner logo grid:* White #ffffff background. 5-column grid, 40px row gap, logos centered in each cell. All logos rendered in monochrome #000000. No borders, no card backgrounds, no shadows.

5. *Onyx footer:* Solid #000000 background, full-bleed. Three columns: Navigation (internal links), Follow (social), Address. Column headers in NeueHaasGroteskText 18px weight 600 #ffffff. List items weight 400 #ffffff, 20px vertical spacing. 40px section padding all sides.

## Similar Brands

- **Boom Supersonic** — Same aerospace-scale display type (200px+ headlines) over full-bleed photography with a nearly monochrome palette — both treat type and photography as the only two design elements
- **Joby Aviation** — eVTOL competitor with the same restrained palette, oversized product-name typography, and edge-to-edge atmospheric hero sections
- **Northvolt** — Nordic industrial brand sharing the NeueHaasGrotesk type system, zero-radius flat surfaces, and a single deep-blue accent against monochrome — same engineering-manifesto restraint
- **Rivian** — Clean industrial branding with monumental type, full-bleed environmental photography, and a near-monochrome palette punctuated by a single deep accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-stratosphere: #716e85;
  --color-jetstream-blue: #001489;
  --color-onyx: #000000;
  --color-cloud: #ffffff;

  /* Typography — Font Families */
  --font-neuehaastext: 'NeueHaasText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaasgroteskdisplay: 'NeueHaasGroteskDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaasgrotesktext: 'NeueHaasGroteskText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaasdisplay: 'NeueHaasDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-heading-sm: 46px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.92px;
  --text-display: 156px;
  --leading-display: 1;
  --tracking-display: -3.12px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-70: 70px;

  /* Layout */
  --section-gap: 70px;
  --element-gap: 18-20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-atmospheric-canvas: #716e85;
  --surface-cloud-canvas: #ffffff;
  --surface-onyx-footer: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-stratosphere: #716e85;
  --color-jetstream-blue: #001489;
  --color-onyx: #000000;
  --color-cloud: #ffffff;

  /* Typography */
  --font-neuehaastext: 'NeueHaasText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaasgroteskdisplay: 'NeueHaasGroteskDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaasgrotesktext: 'NeueHaasGroteskText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaasdisplay: 'NeueHaasDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-heading-sm: 46px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.92px;
  --text-display: 156px;
  --leading-display: 1;
  --tracking-display: -3.12px;

  /* Spacing */
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-70: 70px;
}
```
