# Adcker — Style Reference
> Giant brutalist poster on warm museum paper

**Theme:** light

Adcker operates as a typographic monolith: one warm cream canvas, one near-black ink, and display type so large it becomes architecture. The entire interface runs on the tension between oversized editorial headlines and whisper-quiet metadata, with no chromatic accents to soften the impact. Every visual decision is editorial — this reads like the opening spread of a print magazine, not a software product. The 0% colorfulness is deliberate: chromatic color would dilute the authority that sheer typographic scale already provides. The only non-text element that breaks the monochrome spell is a single candid photograph literally embedded inside the headline, treating the image as punctuation rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#191919` | `--color-ink-black` | All text, headlines, borders, link colors — the sole foreground color in the entire system. Near-black rather than pure black adds warmth that harmonizes with the cream canvas |
| Bone Canvas | `#efedea` | `--color-bone-canvas` | Page background, card surfaces, nav bar — the warm off-white ground that makes the near-black ink read with high contrast (15.1:1 AAA) without feeling harsh or clinical |
| Stone Veil | `#e3e1de` | `--color-stone-veil` | Subtle surface variation against Bone Canvas — used sparingly for secondary panels or section backgrounds to create depth without introducing color |

## Tokens — Typography

### nhm — Primary type system spanning body (16-21px) to extreme display (173-185px). Weight 400 carries both the whisper-quiet metadata and the 185px display headlines — the system trusts the scale to create hierarchy rather than reaching for bold weights. Letter-spacing tightens aggressively to -0.05em at display sizes to prevent the large counters from feeling airy. · `--font-nhm`
- **Substitute:** Neue Haas Grotesk, Inter, Helvetica Neue
- **Weights:** 400, 700
- **Sizes:** 16, 21, 173, 185
- **Line height:** 0.78, 1.00, 1.10, 1.20
- **Letter spacing:** -0.8px at 16px, -1.05px at 21px, -8.65px at 173px, -9.25px at 185px
- **Role:** Primary type system spanning body (16-21px) to extreme display (173-185px). Weight 400 carries both the whisper-quiet metadata and the 185px display headlines — the system trusts the scale to create hierarchy rather than reaching for bold weights. Letter-spacing tightens aggressively to -0.05em at display sizes to prevent the large counters from feeling airy.

### psl — Mid-scale display for subheadings and section titles. Sits between body text and the extreme display tier, carrying -0.015em tracking for controlled density at smaller display sizes. · `--font-psl`
- **Substitute:** Inter, Söhne
- **Weights:** 400
- **Sizes:** 34, 69
- **Line height:** 1.00, 1.20
- **Letter spacing:** -0.51px at 34px, -1.035px at 69px
- **Role:** Mid-scale display for subheadings and section titles. Sits between body text and the extreme display tier, carrying -0.015em tracking for controlled density at smaller display sizes.

### psr — Body text alternative at 21px with normal tracking — used for longer-form passages where the tighter nhm spacing would feel constrained. · `--font-psr`
- **Substitute:** Inter, system-ui
- **Weights:** 400
- **Sizes:** 21
- **Line height:** 1.00
- **Letter spacing:** normal
- **Role:** Body text alternative at 21px with normal tracking — used for longer-form passages where the tighter nhm spacing would feel constrained.

### Kumbh Sans — Alternate display family at extreme sizes, sharing the same -0.05em tracking and tight 0.78-0.80 line-height as nhm. Provides a geometric counterpoint to nhm's neo-grotesque character for typographic variation within display lockups. · `--font-kumbh-sans`
- **Substitute:** Kumbh Sans (Google Fonts)
- **Weights:** 400
- **Sizes:** 173, 185
- **Line height:** 0.78, 0.80
- **Letter spacing:** -8.65px at 173px, -9.25px at 185px
- **Role:** Alternate display family at extreme sizes, sharing the same -0.05em tracking and tight 0.78-0.80 line-height as nhm. Provides a geometric counterpoint to nhm's neo-grotesque character for typographic variation within display lockups.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.2 | -0.8px | `--text-caption` |
| body | 21px | 1 | -1.05px | `--text-body` |
| subheading | 34px | 1 | -0.51px | `--text-subheading` |
| heading | 69px | 1 | -1.035px | `--text-heading` |
| display | 173px | 0.78 | -8.65px | `--text-display` |
| display-lg | 185px | 0.8 | -9.25px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 112 | 112px | `--spacing-112` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 200px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Minimal site header

Fixed-position bar with logo (Adcker) left-aligned and 'Menu' text right-aligned. No background fill or border — sits directly on Bone Canvas. All text at 16px nhm 400 in Ink Black. The absence of a visible container reinforces the editorial, borderless aesthetic.

### Editorial Display Headline
**Role:** Hero typographic lockup

Centered text at 173-185px nhm 400, line-height 0.78-0.80, letter-spacing -0.05em. Text fills the viewport width. Photographs and media elements are embedded inline within the text flow (not overlaid), cropped to the shape of the characters they replace. No background, no border, no shadow — pure typographic presence on Bone Canvas.

### Metadata Label
**Role:** Small editorial annotation

Tiny text annotations like 'Showreel' or 'We're built for' at 16-21px nhm 400 in Ink Black. Positioned with generous whitespace adjacent to the dominant display element. These act as quiet directional cues rather than interactive elements.

### Showreel Player
**Role:** Video showcase container

Full-bleed or large contained video frame on Bone Canvas, referenced by the 'Showreel' metadata label. No visible chrome, controls, or border — the video IS the component. 0px radius, no shadow.

### Case Study Card
**Role:** Project portfolio entry

Flat card on Bone Canvas with no border or shadow. Internal spacing: 32px padding. Contains a project title at heading size (69px) and metadata at caption size (16px). Images are flush, 0px radius, extending to card edges.

### Text Link
**Role:** Inline navigation

Underlined link with 2px padding-bottom and 20px padding-right spacing. Uses Ink Black color with a border-bottom in the same color. No fill, no background, no interactive state color change — the underline IS the interactive affordance.

### Section Divider
**Role:** Visual section break

No visible divider element — sections are separated by the 200px vertical gap alone. The cream canvas flows seamlessly between content blocks, with the massive scale of display type providing implicit section boundaries.

### Full-Bleed Image Block
**Role:** Photography showcase

Edge-to-edge images at 0px radius, no border, no shadow. Photography is candid and human — warm skin tones, natural expressions, no studio staging. Images may be embedded within text lockups or stand alone as full-viewport sections.

## Do's and Don'ts

### Do
- Use display sizes exclusively at 173px or 185px — anything between 70px and 170px breaks the typographic extremes the system is built on
- Maintain line-height 0.78-0.80 for display type to keep the massive headlines from drifting apart vertically
- Set letter-spacing to -0.05em on all display text (nhm and Kumbh Sans tiers) to compensate for the wide counters at extreme sizes
- Use the full 200px section gap between major content blocks — compact spacing here would undermine the editorial gravitas
- Embed photographs inline within display text lockups rather than placing them as separate elements beside the text
- Keep all text weight 400 unless explicitly calling for the nhm 700 weight — the system derives hierarchy from scale, not weight
- Let the Bone Canvas (#efedea) serve as both background and surface — the monochromatic discipline is the point

### Don't
- Never introduce chromatic colors, brand accents, or semantic state colors — the 0% colorfulness is the system
- Never apply border-radius to any element — all corners are sharp (0px) to preserve the brutalist editorial feel
- Never use shadows, glows, or elevation effects — the system is completely flat
- Never use body text larger than 21px or smaller than 16px — the gap between body and display is intentional and vast
- Never use a centered CTA button with a colored fill — interactive elements are text links with underlines, not buttons
- Never set display type at line-height above 0.85 — the tight leading is what makes 185px text feel like a single sculptural object
- Never overlay text on dark backgrounds to create contrast — invert by using Ink Black (#191919) as a full surface, not as a treatment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#efedea` | Primary page background and dominant surface |
| 2 | Stone Veil | `#e3e1de` | Secondary surface for subtle layering |
| 3 | Ink Black | `#191919` | Inverted surface for dark sections or contrast blocks |

## Imagery

Photography is used sparingly but with high impact — one candid human portrait visible, cropped tightly and embedded directly within a display headline as inline content. The treatment is raw: natural color, warm skin tones, no filter or grading that would clash with the cream canvas. Images carry no border, no radius, no shadow — they sit flush against the Bone Canvas. The role of imagery is punctuation, not decoration: a single photograph interrupting a wall of text creates more impact than a gallery grid. No illustrations, no icons visible, no abstract graphics. The system communicates through type alone, with photography as the sole non-textual element.

## Layout

The page model is full-bleed with centered content alignment. The hero is a massive centered typographic statement ('THE ART * ( ) OF HACKING SOCIAL') that fills the viewport vertically, with a small photograph embedded inline within the text. Navigation is a minimal top bar — logo left, 'Menu' right — sitting directly on the cream canvas with no container or border. The hero bleeds edge-to-edge with generous breathing room (200px) between sections. No visible grid structure, no card layouts, no sidebars. The content rhythm is: oversized editorial display → quiet metadata → embedded media → massive whitespace → repeat. The layout reads as a scrolling poster, not a traditional web page.

## Agent Prompt Guide

Quick Color Reference:
- Canvas/background: #efedea (Bone Canvas)
- Text/headlines: #191919 (Ink Black)
- Borders/dividers: #191919 (Ink Black)
- Accent: none (monochromatic system)
- primary action: no distinct CTA color
- Surface variation: #e3e1de (Stone Veil)

Example Component Prompts:

1. Editorial Display Headline: Center the text 'BUILD SOMETHING' at 185px using nhm 400, color #191919, letter-spacing -9.25px, line-height 0.80, on a #efedea background. Text fills the viewport width.

2. Top Navigation Bar: Place 'Adcker' in nhm 700 at 16px in the top-left corner and 'Menu' in nhm 400 at 16px in the top-right corner. Both in #191919. No background, no border, no padding beyond 4px vertical.

3. Metadata Label: Position a small text label 'Showreel' at 16px nhm 400 in #191919, with 15px padding from the nearest display text element. No background, no border.

4. Case Study Card: Create a section with a project title at 69px psl 400 in #191919 (letter-spacing -1.035px), 32px padding, on a #efedea background. Below it, a caption at 16px nhm 400 in #191919.

5. Full-Bleed Photography: Place a candid portrait photograph edge-to-edge at 0px radius with no border, no shadow, directly on the #efedea canvas. The image should feel warm-toned and natural, not filtered.

## Elevation Philosophy

This system has zero elevation. No shadows, no glows, no overlays, no z-axis depth. Depth is communicated exclusively through typographic scale, whitespace, and the contrast between the cream canvas and black ink. Elements that would traditionally be 'elevated' (cards, modals, popovers) sit flush on the same plane as everything else, distinguished only by content density and proximity. This flatness is not a constraint — it is the design language. Introducing even a single shadow would break the editorial poster metaphor that defines the entire visual identity.

## Similar Brands

- **Buck (buck.co)** — Same oversized editorial display type and monochromatic discipline with photography embedded in headlines
- **Gunner (gunnercooke.com style work)** — Extreme typographic scale, 0% colorfulness, and the same editorial poster-page treatment
- **Resn (resn.co.nz)** — Bold creative agency aesthetic with massive display headlines and near-zero chromatic color
- **Locomotive (locomotive.ca)** — Typography-as-architecture approach with flat surfaces and warm off-white canvases
- **Ueno (ueno.co)** — Brutalist creative agency layouts with extreme type sizes and embedded media in text lockups

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #191919;
  --color-bone-canvas: #efedea;
  --color-stone-veil: #e3e1de;

  /* Typography — Font Families */
  --font-nhm: 'nhm', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-psl: 'psl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-psr: 'psr', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kumbh-sans: 'Kumbh Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.2;
  --tracking-caption: -0.8px;
  --text-body: 21px;
  --leading-body: 1;
  --tracking-body: -1.05px;
  --text-subheading: 34px;
  --leading-subheading: 1;
  --tracking-subheading: -0.51px;
  --text-heading: 69px;
  --leading-heading: 1;
  --tracking-heading: -1.035px;
  --text-display: 173px;
  --leading-display: 0.78;
  --tracking-display: -8.65px;
  --text-display-lg: 185px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -9.25px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-112: 112px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 200px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #efedea;
  --surface-stone-veil: #e3e1de;
  --surface-ink-black: #191919;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #191919;
  --color-bone-canvas: #efedea;
  --color-stone-veil: #e3e1de;

  /* Typography */
  --font-nhm: 'nhm', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-psl: 'psl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-psr: 'psr', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kumbh-sans: 'Kumbh Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.2;
  --tracking-caption: -0.8px;
  --text-body: 21px;
  --leading-body: 1;
  --tracking-body: -1.05px;
  --text-subheading: 34px;
  --leading-subheading: 1;
  --tracking-subheading: -0.51px;
  --text-heading: 69px;
  --leading-heading: 1;
  --tracking-heading: -1.035px;
  --text-display: 173px;
  --leading-display: 0.78;
  --tracking-display: -8.65px;
  --text-display-lg: 185px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -9.25px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-112: 112px;
  --spacing-200: 200px;
}
```
