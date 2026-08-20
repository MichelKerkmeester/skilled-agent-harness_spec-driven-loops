# Waabi — Style Reference
> Concrete monolith with molten-pink ignition. Warm gray editorial canvas where a single chromatic accent cuts through like a signal flare.

**Theme:** light

Waabi reads as an editorial-tech manifesto: warm concrete canvas, oversized custom display type set in tight blocks, and a single molten-pink accent that makes every interactive surface unmistakable. The page breathes — most of the canvas is empty warm gray, then content lands as confident white panels or dramatic type. Everything monochrome until you need action, at which point #ff2c6b does the entire job. Components are sparse, pill-shaped, and prefer thin borders and flat surfaces over shadows or gradients. The rhythm is large-to-larger: hero headlines at 130–150px with 0.85 line-height, then a drop to 24–40px for body, creating a magazine-scale hierarchy rather than a UI scale.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hot Signal | `#ff2c6b` | `--color-hot-signal` | Red action color for filled buttons, selected navigation states, and focused conversion moments. |
| Carbon | `#191818` | `--color-carbon` | Primary text, heading text, border lines, icon strokes — near-black with a faint warm cast; the dominant neutral carrying all structural information |
| Paper White | `#ffffff` | `--color-paper-white` | Light neutral action fill for buttons on dark surfaces. |
| Concrete | `#e8e6e3` | `--color-concrete` | Page background, hero canvas, section bands — the warm neutral that defines the site's atmosphere; slightly desaturated and warm-toned, not cool gray |
| Ash | `#8c8b8b` | `--color-ash` | Muted helper text, secondary borders, caption labels — warm mid-gray for non-load-bearing information |
| Smoke | `#808080` | `--color-smoke` | Tertiary text, disabled states, inactive borders — sits between Ash and Carbon in the warm-gray scale |
| Slate | `#d1d5dc` | `--color-slate` | Cooler secondary card surface, placeholder or empty-state panels — the only cool-tinted neutral, used sparingly to separate distinct UI layers |
| Ink | `#000000` | `--color-ink` | Pure black for icons and link borders where maximum contrast is required — used selectively, not as a general text color |

## Tokens — Typography

### Zagma — Display and heading typeface — all hero headlines, section titles, and large editorial copy. The 0.85 line-height at 150px is the signature: type stacks into tight, sculptural blocks rather than airy paragraphs. Negative tracking tightens with scale (from -0.020em at 40px to -0.048em at 150px) to keep large glyphs from feeling spaced-out. · `--font-zagma`
- **Substitute:** GT Sectra Display, Saol Display, or PP Editorial New
- **Weights:** 400
- **Sizes:** 10px, 16px, 20px, 24px, 40px, 60px, 80px, 130px, 150px
- **Line height:** 0.85, 0.90, 1.10, 1.20, 1.25, 1.40, 1.50
- **Letter spacing:** -0.048em at 150px, -0.040em at 80px, -0.030em at 60px, -0.020em at 40px
- **OpenType features:** `"liga" on`
- **Role:** Display and heading typeface — all hero headlines, section titles, and large editorial copy. The 0.85 line-height at 150px is the signature: type stacks into tight, sculptural blocks rather than airy paragraphs. Negative tracking tightens with scale (from -0.020em at 40px to -0.048em at 150px) to keep large glyphs from feeling spaced-out.

### NeueHaas — UI and body text — nav items, button labels, captions, helper text, link text. Set at micro sizes (10–15px) with slightly open tracking (+0.010em to +0.020em) to stay legible at small scale. Weight 500 reserved for nav and button emphasis; 400 for everything else. · `--font-neuehaas`
- **Substitute:** Neue Haas Grotesk, Inter, or Söhne
- **Weights:** 400, 500
- **Sizes:** 10px, 11px, 12px, 15px
- **Line height:** 1.40, 1.60
- **Letter spacing:** 0.0100em, 0.0200em
- **Role:** UI and body text — nav items, button labels, captions, helper text, link text. Set at micro sizes (10–15px) with slightly open tracking (+0.010em to +0.020em) to stay legible at small scale. Weight 500 reserved for nav and button emphasis; 400 for everything else.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 0.1px | `--text-caption` |
| heading-sm | 24px | 1.25 | -0.48px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.8px | `--text-heading` |
| heading-lg | 60px | 1.1 | -1.8px | `--text-heading-lg` |
| display | 80px | 0.9 | -3.2px | `--text-display` |
| display-xl | 150px | 0.85 | -7.2px | `--text-display-xl` |

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
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| pill | 9999px |
| cards | 12px |
| panels | 40px |
| buttons | 50px |
| thumbnails | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Navigation Bar
**Role:** Top-level site navigation

White (#ffffff) pill-shaped bar with 50px border-radius, floating on the warm concrete canvas. Contains wordmark 'waabi' in Zagma 16px weight 400, nav links in NeueHaas 12–15px weight 500 at +0.02em tracking, and a hamburger icon. No drop shadow — the pill shape and white surface do the lifting. Padding approximately 10px vertical, 24px horizontal.

### Hero Display Headline
**Role:** Primary page headline

Set in Zagma weight 400 at 130–150px with line-height 0.85 and letter-spacing -0.048em. Two-line stacks are the norm (e.g. 'Built to think. / Born to haul.'). Color #191818 on the warm concrete canvas. The tight line-height makes each line pair read as a single sculptural block.

### Section Headline
**Role:** In-content section titles

Zagma weight 400 at 40–60px, line-height 1.1–1.2, letter-spacing -0.030em to -0.020em. Ends with a period as a recurring typographic device ('Insights.', 'Technology.'). Color #191818 on concrete or white surface.

### Primary Action Button (Filled Pink)
**Role:** Main CTA

Pill shape with 50px border-radius. Fill #ff2c6b. Text in NeueHaas 12px weight 500, color #ffffff, tracking +0.02em. Padding 10px vertical, 24px horizontal. No shadow. The pink fill is the loudest element on the page; never use it for anything decorative.

### Outlined Action Button
**Role:** Secondary CTA

Pill shape with 50px border-radius. Transparent fill, 1px border in #191818. Text NeueHaus 12px weight 500, #191818. Same padding as filled variant (10px / 24px). Used when a secondary action shares space with the primary pink button.

### Ghost/Text Button
**Role:** Tertiary link-style action

No border, no background. NeueHaas 12–15px weight 500, color #191818, with an arrow or chevron. Used for 'View all', navigation, and low-emphasis actions within content blocks.

### Content Card
**Role:** Article or insight thumbnail

White (#ffffff) surface on the concrete canvas, 12px border-radius. Internal padding 16–24px. Image fills the top portion at the same 12px radius (top corners only). No drop shadow — the white-on-warm-gray contrast provides the separation. Border 1px #191818 in some variants.

### Image Thumbnail
**Role:** Small visual content blocks

12px border-radius square crops, approximately 80–120px, used as inline visual accents within content sections (truck images, technology shots). Sit directly on the concrete canvas with no frame or border.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width white bar at the very top of the page. NeueHaas 11–12px weight 400–500 text in #191818, centered. Contains an inline text link with underline in #191818. Dismissible via × icon at right edge. Height ~32px.

### Dark Info Panel
**Role:** Hero-adjacent content block

Dark #191818 surface, rounded 12px corners. Contains a circular progress indicator (ring chart) and a filled pink CTA button. Used to pair supplementary information with the hero image or headline.

### Carousel Navigation Controls
**Role:** Card carousel pagination

Circular 40px controls with 1px #191818 border, containing left/right chevron arrows. Filled variant (pink #ff2c6b) for the 'View all' or primary navigation target; outlined for directional arrows.

### Link
**Role:** Inline text links

NeueHaas 12–15px weight 400–500, color #191818, underlined. No color change on hover — the system communicates interactivity through weight or arrow appendage rather than color shift.

## Do's and Don'ts

### Do
- Use Zagma only for display and heading roles — never for body copy, captions, or UI labels. Below 24px it becomes illegible and loses its sculptural character.
- Set the hero headline at 130–150px with line-height 0.85 and letter-spacing -0.048em. This tight, stack-like block is the system's most recognizable typographic gesture.
- Use #ff2c6b exclusively for primary actions and active states. Never use it for decorative accents, illustrations, or informational UI.
- Keep the concrete canvas (#e8e6e3) dominant. White cards and panels should feel like placed objects, not the default surface.
- Use pill-shaped buttons (50px radius) for all interactive elements. The pill is non-negotiable and defines the system's interaction language.
- End section headlines with a period ('Insights.', 'Technology.') — this is a recurring typographic signature in the Zagma display style.
- Set body and UI text in NeueHaas at 10–15px with +0.01em to +0.02em letter-spacing. Never tighten tracking on text below 20px.

### Don't
- Do not use drop shadows, gradients, or blur effects. The system relies on flat color contrast and shape for depth, not elevation effects.
- Do not introduce additional chromatic colors. The palette is concrete, white, carbon, and one pink signal. Adding any other hue breaks the editorial restraint.
- Do not set body copy in Zagma. Zagma at small sizes is a legibility failure; reserve it for 24px and above.
- Do not use line-height above 1.0 for display headlines above 60px. The tight 0.85–0.90 stacking is what makes the large type feel sculptural rather than airy.
- Do not apply #ff2c6b to backgrounds, cards, or large surfaces. The pink works only at button-scale and small accent scale — it is a spark, not a paint.
- Do not use square or small-radius corners on buttons or major containers. The pill (50px) and the 12px card radius are the only two shape signatures.
- Do not use cool grays or blue-tinted neutrals. The entire neutral scale is warm-toned (#e8e6e3, #8c8b8b, #191818) — introducing cool tones shifts the atmosphere immediately.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Concrete Canvas | `#e8e6e3` | Page background, hero backdrop, section bands — the warm gray that defines the site's atmosphere |
| 2 | Paper White | `#ffffff` | Card surfaces, content panels, navigation pill, button fills — the 'lifted' surface sitting on the canvas |
| 3 | Slate Panel | `#d1d5dc` | Secondary or empty-state card surface, slightly cooler tone to differentiate from primary white cards |
| 4 | Carbon Block | `#191818` | Dark info panels, inverse surfaces for high-contrast content blocks paired with hero imagery |

## Elevation

The system deliberately avoids drop shadows. Depth is achieved entirely through surface contrast: warm concrete canvas, white cards, and dark carbon blocks stacked by tone, not by blur. This keeps the aesthetic flat, editorial, and fast.

## Imagery

Photography is real, gritty, and product-focused: autonomous trucks on highways, highway infrastructure, industrial environments. Images are tightly cropped into square or rectangular thumbnails at 12px radius, presented without lifestyle staging or decorative framing. The trucks ARE the hero — no models, no city skylines, no abstract overlays. Hero images get full-bleed treatment on white background sections; supporting imagery appears in card grids at consistent 12px radius. The visual language is documentary-industrial, not aspirational-lifestyle.

## Layout

Max-width 1200px centered content within a full-bleed warm concrete canvas. Navigation is a floating white pill, not a full-width bar. Hero sections are asymmetric: oversized display type left-aligned in the lower portion of the viewport, with content (images, dark info panels) filling the upper-right quadrant. Section rhythm alternates between the warm concrete canvas and white card sections, separated by 96px vertical gaps. Content grids use 3-column card layouts for article/insight blocks, with consistent 16px gaps. Carousels appear for content collections with circular pill controls at the right edge. The overall density is spacious — large empty regions of concrete canvas are a feature, not a waste.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #191818
- Background: #e8e6e3
- Border: #191818
- Accent: #ff2c6b
- Surface (card): #ffffff
- primary action: #ff2c6b (filled action)

**Example Component Prompts**

1. *Hero section*: Warm concrete (#e8e6e3) full-bleed background. Two-line headline in Zagma weight 400 at 150px, line-height 0.85, letter-spacing -7.2px, color #191818. Example: 'Built to think. / Born to haul.' Position text left-aligned in the lower half of the viewport. No image in this variant — let the type carry the weight.

2. Create a Primary Action Button: #ff2c6b background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. *Insight card*: White (#ffffff) surface, 12px border-radius, 24px internal padding. Image fills the top at 12px radius (clipped). Heading in Zagma 24px weight 400, line-height 1.25, letter-spacing -0.48px, color #191818. Body text in NeueHaas 12px weight 400, color #8c8b8b.

4. *Navigation pill*: White (#ffffff) floating bar, 50px border-radius. Wordmark 'waabi' in Zagma 16px weight 400, color #191818. Nav links in NeueHaas 12px weight 500, color #191818, letter-spacing +0.24px. Hamburger icon at right. No drop shadow.

5. *Section headline block*: On concrete (#e8e6e3) canvas, left-aligned Zagma 60px weight 400, line-height 1.1, letter-spacing -1.8px, color #191818. End the headline with a period. Place a short descriptive paragraph in NeueHaas 12px weight 400, color #8c8b8b, max-width ~400px, directly below.

## Similar Brands

- **Figure AI** — Same warm-neutral canvas with oversized display type and a single high-saturation accent color for CTAs; both feel editorial rather than typical SaaS
- **Einride** — Shared industrial/documentary photography approach for autonomous vehicles, warm-toned neutral palette, and minimalist card-based content layouts
- **Wayve** — Similar oversized headline treatment on muted background, single-accent interactive system, and typographic-first page hierarchy that lets type do the branding
- **Sanctuary AI** — Warm gray canvas with dramatic display serif/sans headlines, pill-shaped CTAs, and flat surfaces without shadows or gradients

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hot-signal: #ff2c6b;
  --color-carbon: #191818;
  --color-paper-white: #ffffff;
  --color-concrete: #e8e6e3;
  --color-ash: #8c8b8b;
  --color-smoke: #808080;
  --color-slate: #d1d5dc;
  --color-ink: #000000;

  /* Typography — Font Families */
  --font-zagma: 'Zagma', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaas: 'NeueHaas', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.8px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -3.2px;
  --text-display-xl: 150px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -7.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 40px;
  --radius-full: 50px;
  --radius-full-2: 63.4059px;

  /* Named Radii */
  --radius-pill: 9999px;
  --radius-cards: 12px;
  --radius-panels: 40px;
  --radius-buttons: 50px;
  --radius-thumbnails: 12px;

  /* Surfaces */
  --surface-concrete-canvas: #e8e6e3;
  --surface-paper-white: #ffffff;
  --surface-slate-panel: #d1d5dc;
  --surface-carbon-block: #191818;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hot-signal: #ff2c6b;
  --color-carbon: #191818;
  --color-paper-white: #ffffff;
  --color-concrete: #e8e6e3;
  --color-ash: #8c8b8b;
  --color-smoke: #808080;
  --color-slate: #d1d5dc;
  --color-ink: #000000;

  /* Typography */
  --font-zagma: 'Zagma', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuehaas: 'NeueHaas', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.48px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.8px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -3.2px;
  --text-display-xl: 150px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -7.2px;

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
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-3xl: 40px;
  --radius-full: 50px;
  --radius-full-2: 63.4059px;
}
```
