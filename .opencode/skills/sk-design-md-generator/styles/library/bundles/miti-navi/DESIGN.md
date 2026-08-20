# Miti Navi — Style Reference
> Tuscan sea-view chapbook on raw linen

**Theme:** light

Miti Navi operates as a warm, paper-toned editorial canvas — think a luxury yachting magazine spread printed on unbleached craft stock. The entire interface is built on a sand-beige field (#e6dece) with deep ink-black typography, giving the site a tactile, hand-printed quality. Monospaced type (GT Pressura Mono) carries all functional UI — nav, buttons, body — lending technical precision that contrasts with the swooping, romantic serif (Voyage) reserved for editorial display lines. A single warm peach underline (#ffdead) is the only chromatic accent, used sparingly to mark interactive moments. The hero photograph is masked by a dramatic arch, the navigation splits into three balanced clusters around a centered wordmark, and a vertical sticky side tab interrupts the right edge with rotated text — all choices that read more like an art book than a product page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Linen | `#e6dece` | `--color-linen` | Page canvas, card surfaces, section backgrounds — the warm unbleached-paper field that carries all content |
| Deep Ink | `#000e13` | `--color-deep-ink` | Primary text, navigation, structural borders, logo lockup — near-black with the faintest cool undertone |
| Carbon | `#232323` | `--color-carbon` | Body text, icon strokes, secondary headings, hairline rules, card borders — workhorse dark for dense UI elements |
| Soft Ash | `#999999` | `--color-soft-ash` | Muted helper text, inactive nav items, subtle dividers, secondary metadata |
| Warm Apricot | `#ffdead` | `--color-warm-apricot` | Interactive link underlines, outlined action borders, the sole chromatic accent — used as a 1px rule beneath active elements to signal affordance without weight |
| Obsidian | `#000000` | `--color-obsidian` | Pure black for maximum-contrast headings and icon fills where Carbon reads as warm |

## Tokens — Typography

### GT Pressura Mono — All functional UI: top navigation, body copy, buttons, links, cards, breadcrumbs, icon labels. The monospaced engine runs the entire interface. Tracking opens up at larger sizes: 0.71px at 10px, 1.0px at 12px, 1.4px at 14px, 1.6px at 16px — the wider letterspacing as size grows gives the type a deliberate, spaced-out breath that suits the editorial register. · `--font-gt-pressura-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400
- **Sizes:** 10px, 12px, 14px, 16px
- **Line height:** 1.40
- **Letter spacing:** 0.71px at 10px, 1.0px at 12px, 1.4px at 14px, 1.6px at 16px
- **Role:** All functional UI: top navigation, body copy, buttons, links, cards, breadcrumbs, icon labels. The monospaced engine runs the entire interface. Tracking opens up at larger sizes: 0.71px at 10px, 1.0px at 12px, 1.4px at 14px, 1.6px at 16px — the wider letterspacing as size grows gives the type a deliberate, spaced-out breath that suits the editorial register.

### Voyage — Hero and section display lines. The extreme sizes (130px, 180px) paired with tight 0.90–0.94 leading create oversized, airy editorial headlines that dominate the page. Only the wordmark-adjacent and 16px use normal leading. This is a custom high-contrast display serif with theatrical curves — it carries the romantic brand voice. · `--font-voyage`
- **Substitute:** Playfair Display, Cormorant Garamond, DM Serif Display
- **Weights:** 400
- **Sizes:** 16px, 46px, 72px, 130px, 180px
- **Line height:** 0.90–0.94
- **Role:** Hero and section display lines. The extreme sizes (130px, 180px) paired with tight 0.90–0.94 leading create oversized, airy editorial headlines that dominate the page. Only the wordmark-adjacent and 16px use normal leading. This is a custom high-contrast display serif with theatrical curves — it carries the romantic brand voice.

### GTSectraDisplay — Mid-weight editorial subheadings that bridge the monospaced UI type and the huge Voyage display. A transitional serif with old-style warmth, used sparingly for paragraph-level headings inside content blocks. · `--font-gtsectradisplay`
- **Substitute:** Cormorant Garamond, EB Garamond, Lora
- **Weights:** 400
- **Sizes:** 26px
- **Line height:** 1.20
- **Role:** Mid-weight editorial subheadings that bridge the monospaced UI type and the huge Voyage display. A transitional serif with old-style warmth, used sparingly for paragraph-level headings inside content blocks.

### Times — Tiny uppercase eyebrow labels (0.2860em letterspacing = 4px) — the 0.28em tracking is a system default; used only for short all-caps tags above headlines. Substitute with a real serif when available. · `--font-times`
- **Substitute:** Times New Roman, EB Garamond
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.40
- **Letter spacing:** 4.0px at 14px
- **Role:** Tiny uppercase eyebrow labels (0.2860em letterspacing = 4px) — the 0.28em tracking is a system default; used only for short all-caps tags above headlines. Substitute with a real serif when available.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 0.71px | `--text-caption` |
| eyebrow | 14px | 1.4 | 4px | `--text-eyebrow` |
| body-lg | 16px | 1.4 | 1.6px | `--text-body-lg` |
| subheading | 26px | 1.2 | — | `--text-subheading` |
| heading | 46px | 0.94 | — | `--text-heading` |
| heading-lg | 72px | 0.92 | — | `--text-heading-lg` |
| display | 130px | 0.9 | — | `--text-display` |
| display-xl | 180px | 0.9 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Arched Hero Image
**Role:** Full-bleed yacht photography with signature curved mask

Photograph masked by a large arch/dome shape on the top edge, creating a cathedral-window silhouette against the linen canvas. No border-radius on the image itself — the arch is a custom SVG/clip-path. Image fills the viewport width minus side gutters, with the lower edge running straight.

### Split Top Navigation
**Role:** Three-cluster header with centered wordmark

Fixed at top of viewport. Left cluster: 2–3 monospaced links in 12px GT Pressura Mono, #000e13, tracking 1.0px, 10px horizontal gap. Center: stylized "MITI NAVI" wordmark in custom display, ~32px. Right cluster: 3–4 monospaced links matching left cluster. No background fill — nav sits directly on linen. Active link has a 1px #ffdead bottom border.

### Vertical Side Tab
**Role:** Persistent right-edge page marker

A narrow vertical strip (roughly 24px wide) running down the right viewport edge. Contains short uppercase text (GT Pressura Mono, 10px, tracking 0.71px) rotated 90° — reads bottom-to-top. Filled with #000e13, text in #e6dece. Functions as both navigation and a printed-page margin marker.

### Underlined Interactive Link
**Role:** Primary action / link / CTA

The only CTA style on the site. Text in GT Pressura Mono, 12–14px, #000e13, tracking 1.0–1.4px, all-caps. A 1px #ffdead (Warm Apricot) bottom border sits 4px below the text baseline. No background fill, no padding beyond the underline gap. Hover deepens text to #000000. No filled buttons exist — every action is this underlined link.

### Section Header (Centered)
**Role:** Editorial section opener

Centered stack: small all-caps eyebrow (Times 14px, 4.0px tracking) at top, then a 26px GTSectraDisplay or 46px Voyage heading beneath. Generous vertical breathing room (30–60px above and below). Optional 1px #232323 horizontal rule beneath the heading, spanning 40–60px.

### Display Headline (Voyage Oversize)
**Role:** Hero and page-introduction typography

Voyage at 130–180px, line-height 0.90, tracking 0, color #000e13. Always left-aligned within its column. The tight leading lets ascenders and descenders of multiple lines nearly touch, creating a dense typographic block that reads as a printed broadside. Used once per major section.

### Flat Content Card
**Role:** Yacht listings, feature blocks

No fill, no border, no shadow. Content sits directly on the linen canvas. Internal padding: 24px on sides, 15–24px vertical. A 1px #232323 hairline may separate cards in a grid. Image at top (if present) is flush-edged, no radius.

### Monospaced Body Block
**Role:** Standard paragraph content

GT Pressura Mono 14px, tracking 1.4px, line-height 1.4, color #232323. Justified or left-aligned. Paragraph spacing: 15–20px. No drop caps, no first-line indents — the monospaced engine already gives the text a distinctive rhythm.

### Logo Wordmark
**Role:** Brand identity mark

Custom 'MITI NAVI' lockup in a custom display face, approximately 32–40px, with a thin hairline rule beneath and a small 'NAVI' sub-label in GT Pressura Mono 10px, tracking 1.0px, #999999. Centered in the header.

### Eyebrow Tag
**Role:** Pre-heading category label

Times 14px, uppercase, tracking 4.0px, color #999999, centered above a section heading. No border, no background. Functions as a printed page caption.

### Image Window (Dark Mask)
**Role:** Photographic content block with dark frame

Full-width or large-block photographs placed inside a #000e13 filled container, giving the image a dark surround that frames it like a print behind glass. No border-radius. Used for editorial photography that needs weight against the linen field.

### Hairline Divider
**Role:** Section break

1px line in #232323, spanning 40–120px (short rule) or full container width. Centered or left-aligned. Replaces whitespace as a structural divider. No background, no icon, no label.

## Do's and Don'ts

### Do
- Use GT Pressura Mono at 14px with 1.4px tracking for every UI label, button, nav item, and body paragraph
- Apply Voyage at 130–180px, line-height 0.90, for hero and major editorial headlines — never at sizes below 46px
- Mark every interactive link with a 1px #ffdead bottom border offset 4px below the text — no filled buttons exist in this system
- Let the linen #e6dece canvas carry through the entire page; do not introduce white or light-gray surfaces
- Anchor all secondary metadata in #999999 Soft Ash rather than the primary #000e13
- Place hairline rules (1px #232323) at 40–60px width as printed-style section markers instead of relying on whitespace alone
- Set all uppercase micro-text at GT Pressura Mono 10–12px with tracking ≥0.7px to maintain the spaced, monospaced cadence

### Don't
- Do not use filled, rounded, or shadowed buttons — this system has no filled CTA component
- Do not introduce new chromatic colors beyond #ffdead; the interface must read monochrome except for the apricot underline accent
- Do not apply border-radius to cards, images, or buttons — the design is rigorously square-edged
- Do not use box-shadows or elevation effects; separation comes from color contrast, hairline rules, and dark image insets
- Do not use sans-serif system fonts for UI text — GT Pressura Mono's monospaced cadence is the system's signature
- Do not use Voyage at small sizes; it only works at 46px and above where its curves can breathe
- Do not place white, light-gray, or off-canvas tints anywhere — every surface is linen or deep ink

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Linen Canvas | `#e6dece` | Page background, primary field |
| 2 | Card Surface | `#e6dece` | Same as canvas — content blocks float on the linen without raised panels |
| 3 | Image Inset | `#000e13` | Dark photographic insets, hero arches, and image masks that read as windows into deeper space |

## Elevation

This design deliberately avoids box-shadows and elevation. Separation is achieved through color contrast (linen canvas vs #000e13 image insets), 1px hairline rules in #232323, and generous whitespace. The flat, unshadowed treatment is core to the printed/editorial language — shadows would break the paper metaphor.

## Imagery

Photography is the dominant visual element. The hero is a single, large-format full-bleed image of a sailing yacht photographed from astern on open Mediterranean water, with mountainous coastline in the background. The treatment is documentary-naturalistic — high-key daylight, no color grading beyond natural blue water and sky, no studio staging. A signature arched clip-path masks the top edge of the hero image, creating a cathedral/window silhouette. Secondary images appear inside dark #000e13 frames that function like prints mounted behind glass, making warm linen content blocks read as the surrounding paper. No illustrations, no abstract graphics, no product renders. Iconography is minimal: a few thin line icons drawn at 1px stroke weight in #232323, used sparingly for functional affordances. Imagery density is low — large editorial photographs are given maximum breathing room rather than tiled.

## Layout

Full-bleed page model with the linen #e6dece canvas extending to all edges. Content is constrained to an approximately 1200px max-width centered column, with generous outer gutters of 30–60px. The hero is the visual exception — the arched photograph spans the full viewport width. The header is split into three balanced clusters (left nav, center wordmark, right nav) with no background fill. Section rhythm is editorial: each section opens with a centered display headline (Voyage) over generous whitespace, followed by a monospaced body block, with hairline rules as transitions rather than background color bands. Content arrangement alternates between centered stacks (for section openers and editorial quotes) and asymmetric text+image compositions (for yacht features). Navigation is a single fixed top bar with a persistent vertical side tab on the right edge. No sidebar, no mega-menu. The overall density is low — sections breathe with 60px+ vertical gaps, and the site feels like flipping through a printed catalog rather than scrolling a dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #e6dece (Linen)
- text: #232323 (Carbon)
- border: #000e13 (Deep Ink)
- accent: #ffdead (Warm Apricot, underline only)
- muted: #999999 (Soft Ash)
- primary action: #ffdead (outlined action border)

**3-5 Example Component Prompts**
1. Build a split top navigation: linen #e6dece canvas, no background. Left cluster with two links ('MITI NAVI', 'LOCATION') in GT Pressura Mono 12px, #000e13, tracking 1.0px, uppercase, with 10px gap between items. Center: 'MITI NAVI' wordmark in Voyage 40px, #000e13, with a 1px #232323 hairline beneath and a 10px 'NAVI' sublabel in GT Pressura Mono, #999999. Right cluster: 'RÉPARATION', 'CHANTIER NAVAL', 'CONTACT' in same monospaced style as left.

2. Build an arched hero section: full-viewport-width image of a sailing yacht on open water, masked at the top by a tall arch (clip-path or SVG) creating a cathedral-window silhouette against the linen canvas. Image fills 100% width, height approximately 70vh. Below the arch, a left-aligned display headline in Voyage 130px, line-height 0.90, #000e13 reading 'Les voiliers de nos rêves'. An underlined link in GT Pressura Mono 12px, #000e13, with a 1px #ffdead bottom border offset 4px below, labeled 'DÉCOUVRIR MITI NAVI'.

3. Build a centered editorial section opener: 60px top padding on linen #e6dece. Centered Times 14px eyebrow in #999999, tracking 4.0px, uppercase, reading 'MITI NAVI'. Below it, a Voyage 46px heading in #000e13, line-height 0.94, reading 'Un voilier selon vos envies'. A 60px-wide 1px #232323 hairline centered 30px below the heading.

4. Build a dark image window: #000e13 filled container, 100% container width, with a full-bleed photograph of a yacht interior. No border-radius, no shadow. A 24px internal padding frame separates the image from the container edges. Below the dark block, a GT Pressura Mono 14px caption in #232323, tracking 1.4px, reading 'Le pont principal — 38m² de teck massif'.

5. Build a vertical side tab: 24px-wide, 200px-tall strip pinned to the right viewport edge, vertically centered. Fill #000e13. Contains 'UN LIEU REMARQUABLE' in GT Pressura Mono 10px, #e6dece, tracking 0.71px, uppercase, rotated -90° (reads bottom-to-top).

## Similar Brands

- **Aesop** — Same warm, paper-toned canvas (off-white/cream) with monochrome typography and a single restrained accent, treating the website as an editorial object rather than a product catalog
- **Hermès (editions section)** — Large-format serif display headlines paired with monospaced functional type, hairline rules, and a luxury print-magazine cadence across a warm neutral field
- **Riva (riva-yachts.com)** — Marine luxury brand using oversized serif display type, warm neutral backgrounds, and editorial photography with generous whitespace over interactive density
- **Toast (toa.st)** — Same single-accent-color discipline on a warm linen-like canvas with monospaced micro-type and a print-catalogue rhythm
- **Le Labo** — Restrained monochrome interface with editorial serif headlines, a single warm chromatic accent, and a deliberate hand-set, typeset-in-metal feel

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-linen: #e6dece;
  --color-deep-ink: #000e13;
  --color-carbon: #232323;
  --color-soft-ash: #999999;
  --color-warm-apricot: #ffdead;
  --color-obsidian: #000000;

  /* Typography — Font Families */
  --font-gt-pressura-mono: 'GT Pressura Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-voyage: 'Voyage', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtsectradisplay: 'GTSectraDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.71px;
  --text-eyebrow: 14px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 4px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: 1.6px;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-heading: 46px;
  --leading-heading: 0.94;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.92;
  --text-display: 130px;
  --leading-display: 0.9;
  --text-display-xl: 180px;
  --leading-display-xl: 0.9;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-linen-canvas: #e6dece;
  --surface-card-surface: #e6dece;
  --surface-image-inset: #000e13;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-linen: #e6dece;
  --color-deep-ink: #000e13;
  --color-carbon: #232323;
  --color-soft-ash: #999999;
  --color-warm-apricot: #ffdead;
  --color-obsidian: #000000;

  /* Typography */
  --font-gt-pressura-mono: 'GT Pressura Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-voyage: 'Voyage', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtsectradisplay: 'GTSectraDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.71px;
  --text-eyebrow: 14px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 4px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: 1.6px;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-heading: 46px;
  --leading-heading: 0.94;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.92;
  --text-display: 130px;
  --leading-display: 0.9;
  --text-display-xl: 180px;
  --leading-display-xl: 0.9;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-60: 60px;
}
```
