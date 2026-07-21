# Cosmos — Style Reference
> Linen gallery wall with floating polaroids

**Theme:** light

Cosmos is a gallery-wrapped canvas for visual discovery: a warm cream background (#f7f5f3) that reads like unprimed linen, black ink typography, and a strict monochrome UI where color only intrudes through user-curated imagery. The product believes in restraint — the chrome is invisible so the images can shout. Type is a single custom serif-influenced face (cosmosOracle) pulled tight with negative tracking, using weight 350 for hero copy to create editorial softness rather than marketing aggression. Surfaces are flat with a single signature radius (16px) repeated across cards, inputs, and video containers. The hero scatters image tiles in a free-form collage that frames centered copy, and the rest of the page settles into a three-column grid of image-led feature cards. There are no gradients, no shadows beyond what the collage cards cast naturally, and no chromatic accents in the interface itself.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Linen Canvas | `#f7f5f3` | `--color-linen-canvas` | Page background — warm off-white, never pure #ffffff at the root, gives the interface a paper-like, gallery-wall base |
| Ink Black | `#0d0d0d` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color; Borders, dividers, outlined button strokes — used at low opacity to create subtle structural lines, always Ink Black rather than a separate gray |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Stone | `#6e6a69` | `--color-stone` | Body text, secondary icons, inactive UI — warm mid-gray for body copy and supporting metadata |
| Pebble | `#9a9796` | `--color-pebble` | Muted helper text, disabled states, tertiary icon strokes — lightest readable gray in the neutral ramp |

## Tokens — Typography

### cosmosOracle — Single custom face used for everything. Weight 350 is the signature — hero and display copy use this whisper-weight instead of the conventional 700, creating editorial calm. Weight 400 for body, weight 500 reserved for buttons and labels. Negative tracking scales with size: tightest (-0.05em) on the 74px display, opening to normal at 14px. The low line-heights on large sizes (0.80–1.10) hug the baseline tightly so headlines read as deliberate blocks, not airy paragraphs. · `--font-cosmosoracle`
- **Substitute:** GT Super, Fraunces, or any high-contrast didone-influenced serif with optical sizing; fall back to 'Georgia' if no serif is available
- **Weights:** 350, 400, 500
- **Sizes:** 14, 15, 16, 18, 24, 26, 33, 38, 58, 66, 74
- **Line height:** 0.80, 1.00, 1.06, 1.08, 1.10, 1.20, 1.25, 1.29, 1.50
- **Letter spacing:** -0.0500em at 74/66/58px, -0.0400em at 38/33px, -0.0200em at 24/26px, -0.0110em at 18/16px, 0 at 14/15px
- **OpenType features:** `Opt for old-style figures and discretionary ligatures if cosmosOracle exposes them; the typeface behaves like a didone-meets-grotesque hybrid`
- **Role:** Single custom face used for everything. Weight 350 is the signature — hero and display copy use this whisper-weight instead of the conventional 700, creating editorial calm. Weight 400 for body, weight 500 reserved for buttons and labels. Negative tracking scales with size: tightest (-0.05em) on the 74px display, opening to normal at 14px. The low line-heights on large sizes (0.80–1.10) hug the baseline tightly so headlines read as deliberate blocks, not airy paragraphs.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | -0.18px | `--text-body` |
| subheading | 18px | 1.29 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 33px | 1.1 | -1.32px | `--text-heading` |
| heading-lg | 38px | 1.08 | -1.52px | `--text-heading-lg` |
| display | 58px | 1.06 | -2.32px | `--text-display` |
| display-xl | 74px | 0.8 | -3.7px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| inputs | 16px |
| buttons | 16px |
| imageTiles | 12px |
| videoContainer | 16px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 24px

## Components

### Primary Filled Button
**Role:** Main conversion action (Sign up)

Ink Black (#0d0d0d) fill, Paper White (#ffffff) text, cosmosOracle weight 500, 16px font-size, 16px border-radius, 16px vertical / 24px horizontal padding. Tight, pill-like but squared at the radius. No shadow, no border.

### Secondary Outlined Button
**Role:** Secondary action (Get the app, Login)

Paper White (#ffffff) fill, 1px Ink Black border at ~15% opacity, Ink Black text, 16px radius, 16px/24px padding. Identical sizing to the primary button so they pair as a two-button row.

### Pill Navigation Bar
**Role:** Top-of-page floating navigation

A single horizontal pill containing the logo (8-dot cluster glyph), Explore / Careers links, centered search input, and Login / Sign up. Background is Paper White with subtle border, 9999px radius, hovers just below the top edge of the viewport with no shadow.

### Search Input
**Role:** Global search inside the nav pill

Borderless text input with a leading magnifier icon, placeholder 'Search Cosmos...' in Stone (#6e6a69). Transparent fill so it sits flush inside the nav pill. 16px text, weight 400.

### Floating Image Tile
**Role:** Scattered collage images in the hero

User-content image cropped to ~12px border-radius, floating at slight rotations or in a loose grid around the hero text. No caption, no border, no shadow — the image is the component. Sized 60–140px, positioned absolutely around the centered headline.

### Feature Image Card
**Role:** Three-up feature row showing product capabilities

Large image-first card with a 16px radius. The image fills the card edge-to-edge; below it sits a cosmosOracle weight 400 label at 18px (e.g. 'By color'). No visible border, no shadow, no background color — the image defines the card. Three cards sit in a 3-column grid with 24px gap.

### Video Container
**Role:** Full-bleed film/video embed

A 16px-radius container spanning the page max-width, holding a video poster with a 9-dot loading animation overlaid in white at center. Split text overlay: 'Watch' left-aligned and 'the film' right-aligned at 38px weight 350, with a play triangle between. Small caption 'featuring Odessa Azion' centered near the bottom.

### AI Content Detection Overlay
**Role:** AI-generated image warning card

Paper White surface with 12px radius, ~280px wide, positioned top-right inside a feature card. Title 'AI content' in Ink Black 16px weight 500, body 'Content detected as likely generated by AI' in Stone 14px. Below: three text buttons — 'Show' (Ink Black, 16px radius, white fill), 'Blur' (neutral), 'Hide' (neutral).

### Text Link with Play Icon
**Role:** Inline call-to-action link (Watch our new film)

Inline at 18px weight 400, Ink Black, preceded by a small triangle play icon. No underline by default; subtle color shift on hover. Used for tertiary navigation cues that should not compete with the button row.

### Theme Toggle
**Role:** Light/dark mode switch in the nav

A small icon-only button (sun/moon glyph) at the right edge of the nav pill, before the Login/Sign up cluster. 32×32px hit area, no visible border, 9999px radius on hover background.

### Eyebrow Label
**Role:** Small uppercase section pre-title

cosmosOracle weight 500, 15–16px, tracked at 0em, rendered as 'COSMOS' above the hero headline. Sets the editorial tone: small, all-caps, almost a stamp rather than a label.

### Dot Cluster Logo
**Role:** Brand mark in nav and favicon

Eight small black dots arranged in a 3×3 grid with the center dot removed, reading as a tiny flower or asterisk. Always Ink Black on Linen Canvas, always at ~18px in the nav, larger at marketing contexts.

## Do's and Don'ts

### Do
- Use only Linen Canvas (#f7f7f5f3) as the root background — never pure white at the page level; white is reserved for cards and inputs.
- Apply 16px border-radius to every container, button, and input — this is the single signature radius of the system.
- Set hero and display copy at weight 350 with letter-spacing between -0.04em and -0.05em; do not bold headlines above 400.
- Pair every primary filled button with an outlined secondary at identical padding and radius so they read as a set.
- Let user imagery carry all chromatic content; the UI palette stays at black/white/cream/gray.
- Use 24px gaps between grid cards and 16px padding inside cards as the default content rhythm.
- Position the nav as a single floating pill with 9999px radius at the top of every page.

### Don't
- Do not introduce accent colors (red, blue, green) into interface chrome — color belongs only in user content.
- Do not use weights above 500 in cosmosOracle; the face is not designed for bold display and will feel chunky.
- Do not apply shadows to cards or buttons; the system is deliberately flat and relies on radius and surface contrast.
- Do not set body text larger than 18px or below 14px; cosmosOracle was sized for a tight 14–18px body range.
- Do not mix border-radius values within a single page (avoid 8px or 24px radii) — 16px is the rule, 12px only for image tiles.
- Do not use pure #000000; always #0d0d0d so the black warms against the cream canvas.
- Do not place colored backgrounds behind text; all text sits on Linen Canvas, Paper White, or directly on imagery.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Linen Canvas | `#f7f5f3` | Root page background, the gallery wall |
| 1 | Paper White | `#ffffff` | Cards, inputs, outlined buttons — the only elevated surface in the system |

## Elevation

Cosmos is intentionally flat: no drop shadows on cards, buttons, or the navigation pill. Elevation is communicated exclusively through surface color contrast — Linen Canvas (#f7f5f3) at the base, Paper White (#ffffff) for cards and inputs sitting on top. The only depth in the interface comes from the scattered hero image tiles, which read as physical polaroids on the canvas. Resist adding shadows; the flatness is the point.

## Imagery

Imagery is the product, not decoration. The hero scatters small cropped image tiles (60–140px) at 12px radius around the centered text like polaroids pinned to a gallery wall. The three feature cards lead with edge-to-edge photography and collage — vivid red florals, warm beige bag silhouettes, and moody purple portraiture — each carrying the only chromatic color in the interface. The video container uses a cinematic still (green-tiled interior, soft focus) with a 9-dot loading animation overlaid in white. There are no illustrations, no abstract graphics, no 3D renders. Icons are minimal stroked linework in Ink Black, used sparingly (magnifier, play triangle, sun/moon, social glyphs). Photography style across the collage feels curated and editorial: high contrast, varied subjects, no unified color treatment — the variety is the point.

## Layout

Page is centered with a ~1280px max-width content well, though the hero uses full-bleed positioning for the scattered image tiles. The hero is a centered text stack: eyebrow ('COSMOS') → 74px headline → two-button row, all vertically and horizontally centered while image tiles float around the periphery at varied rotations. Below the hero, the video container spans the full content width at 16px radius. The feature row is a strict 3-column grid with 24px gap, each cell leading with an image and trailing with a 18px label. Navigation is a single floating pill bar that hovers near the top of the viewport on every page, containing logo, two text links, centered search, theme toggle, and Login/Sign up — it never duplicates into a secondary bar. Vertical rhythm between sections is generous (80px+), giving each band room to breathe like separate gallery rooms.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0d0d0d (Ink Black)
- background: #f7f5f3 (Linen Canvas)
- surface/card: #ffffff (Paper White)
- muted text: #6e6a69 (Stone)
- border: #0d0d0d at 10–15% opacity
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. *Hero headline*: Center a 74px cosmosOracle weight 350 headline in #0d0d0d with letter-spacing -3.7px and line-height 0.80. Above it place a 15px weight 500 'COSMOS' eyebrow in Ink Black, tracked at 0. Below place a two-button row: a filled Ink Black button with white 16px text at weight 500, 16px radius, 16px/24px padding, beside a white outlined button with 1px Ink Black border at 12% opacity, identical radius and padding. All on a #f7f5f3 canvas.

2. *Feature image card*: A 3-column grid card with 16px radius, edge-to-edge image filling the card (no padding around the image), and a 18px cosmosOracle weight 400 label in Ink Black below the image at 16px top spacing. No border, no shadow. Gap between cards: 24px.

3. *Floating image tile (hero collage)*: A 100px square user-content image with 12px border-radius, positioned absolutely with a slight 2–4° rotation, no border, no shadow, sitting on the Linen Canvas around the hero text. No caption.

4. *Video container*: A full-width (within 1280px max) 16:9 container with 16px radius, holding a photographic poster image. Overlay a 3×3 grid of 8 white dots (center removed) at 60% opacity in the center. Place 'Watch' left-aligned and 'the film' right-aligned at 38px weight 350 in white, with a small white play triangle between them. Small 14px caption 'featuring …' centered near the bottom in white at 70% opacity.

5. *AI content overlay*: A 280px wide Paper White (#ffffff) card with 12px radius, positioned top-right of a feature image. Title 'AI content' in 16px weight 500 Ink Black, body text 'Content detected as likely generated by AI' in 14px Stone. Three text buttons below: 'Show' as a small filled Ink Black button (16px radius, white text, 8px/16px padding), 'Blur' and 'Hide' as neutral text buttons in Stone.

## Typography Signature

The defining typographic choice is using a whisper-weight (350) serif at display sizes. Most modern product sites reach for 600–800 on hero copy; Cosmos goes the other way, letting the serif's high stroke contrast and tight tracking carry authority without volume. The negative letter-spacing scales aggressively with size (-0.05em at 74px, 0 at 14px), which is what makes the large headlines feel architectural rather than decorative. When recreating pages, never substitute a bold sans for the display — the soft serif is the entire brand voice.

## Image-First Component Rule

Cosmos is a visual product, so the component system intentionally limits UI chrome and lets images do the work. The rule: if a component is not navigation, input, or a button, it is probably an image card with a small text label. Resist building dashboards, tables, or data-dense UI; this system is for galleries, feeds, and discovery surfaces where the image is the unit of value.

## Similar Brands

- **Are.na** — Same warm cream canvas, monochrome UI that stays out of the way of user-curated imagery, and an editorial single-typeface approach to a visual bookmarking product
- **Pinterest** — Image-led grid systems and the philosophy that color belongs to user content, not the interface chrome
- **VSCO** — Gallery-wall aesthetic with floating image tiles, minimal text UI, and a single warm neutral background that frames rather than competes with photography
- **Cargo (cargo.site)** — Portfolio-first visual discovery tools that use restrained typography and generous whitespace to let creator imagery dominate

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-linen-canvas: #f7f5f3;
  --color-ink-black: #0d0d0d;
  --color-paper-white: #ffffff;
  --color-stone: #6e6a69;
  --color-pebble: #9a9796;

  /* Typography — Font Families */
  --font-cosmosoracle: 'cosmosOracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.18px;
  --text-subheading: 18px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 33px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -1.52px;
  --text-display: 58px;
  --leading-display: 1.06;
  --tracking-display: -2.32px;
  --text-display-xl: 74px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -3.7px;

  /* Typography — Weights */
  --font-weight-w350: 350;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 19px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-inputs: 16px;
  --radius-buttons: 16px;
  --radius-imagetiles: 12px;
  --radius-videocontainer: 16px;

  /* Surfaces */
  --surface-linen-canvas: #f7f5f3;
  --surface-paper-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-linen-canvas: #f7f5f3;
  --color-ink-black: #0d0d0d;
  --color-paper-white: #ffffff;
  --color-stone: #6e6a69;
  --color-pebble: #9a9796;

  /* Typography */
  --font-cosmosoracle: 'cosmosOracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.18px;
  --text-subheading: 18px;
  --leading-subheading: 1.29;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 33px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -1.52px;
  --text-display: 58px;
  --leading-display: 1.06;
  --tracking-display: -2.32px;
  --text-display-xl: 74px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -3.7px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 19px;
}
```
