# FLORA — Style Reference
> Black velvet gallery — pure dark canvas, vivid images as the only color

**Theme:** dark

FLORA is a black-velvet gallery for AI-generated imagery: a pure #000000 canvas where the only color comes from the images themselves. The interface is austere and editorial — no chromatic brand accent, no decorative gradients, no icon color. Geist carries every functional surface with quiet efficiency while Redaction 10 and Redaction 50 Italic lend expressive typographic weight to the few moments that need to feel curated (the hero question, the section openers). Components float on #191919 cards with hairline #b4b4b4 borders and 24px radii, looking more like matted photographs than software panels. The entire system is designed to disappear so that the generated visual output — the actual product — becomes the only vivid thing on screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, primary borders, image frame edges |
| Carbon | `#191919` | `--color-carbon` | Card surfaces, elevated panels, input fields — one step above the canvas |
| Graphite | `#303030` | `--color-graphite` | Deeper elevated surfaces, input interiors, subtle panel separation |
| Slate | `#606060` | `--color-slate` | Muted headings, secondary borders, subdued labels |
| Ash | `#7b7b7b` | `--color-ash` | Body secondary text, link borders, metadata text |
| Fog | `#b4b4b4` | `--color-fog` | Primary borders, hairlines, dividers, muted body text |
| Mist | `#bfbfbf` | `--color-mist` | Light borders, subtle surface edges |
| Bone | `#eeeeee` | `--color-bone` | Primary text, high-contrast borders, heading strokes — the only near-white |
| Pitch | `#050505` | `--color-pitch` | Near-black for icon strokes, inverted button text, fine detail borders |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Geist — Primary UI and body font — used across all functional text, nav, buttons, inputs, labels, and standard headings. The weight range is tight (400 for body, 500 for emphasis, 600 for strong labels) creating a restrained typographic voice. Letter-spacing tightens at larger sizes (-0.0300em at 80px, -0.0170em at 20px) giving headings a compressed editorial feel. The cv03/cv04/cv09/cv11 alternates and blwf feature shape Geist's letterforms into a distinctly modern, slightly geometric sans. · `--font-geist`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 8, 11, 12, 14, 15, 16, 20, 22, 30, 60, 80px
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.0300em at 80px, -0.0250em at 60px, -0.0170em at 20px, -0.0100em at 16px, -0.0010em at 14px, normal at 12px and below
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Primary UI and body font — used across all functional text, nav, buttons, inputs, labels, and standard headings. The weight range is tight (400 for body, 500 for emphasis, 600 for strong labels) creating a restrained typographic voice. Letter-spacing tightens at larger sizes (-0.0300em at 80px, -0.0170em at 20px) giving headings a compressed editorial feel. The cv03/cv04/cv09/cv11 alternates and blwf feature shape Geist's letterforms into a distinctly modern, slightly geometric sans.

### Redaction 10 — Display heading font — used for editorial section titles where the word itself needs presence. Redaction is a high-contrast serif/transitional with extreme thin strokes; at 42px with -0.0360em tracking it reads as a magazine masthead, not UI. The signature choice is using a serif on a pure-black generative-AI product — it humanizes the machine. · `--font-redaction-10`
- **Substitute:** Playfair Display, EB Garamond
- **Weights:** 400
- **Sizes:** 42px
- **Line height:** 1.10
- **Letter spacing:** -0.0360em
- **Role:** Display heading font — used for editorial section titles where the word itself needs presence. Redaction is a high-contrast serif/transitional with extreme thin strokes; at 42px with -0.0360em tracking it reads as a magazine masthead, not UI. The signature choice is using a serif on a pure-black generative-AI product — it humanizes the machine.

### Redaction 50 Italic — Accent display variant — used for one or two words within an otherwise upright Redaction headline (e.g. 'What should we make?' with 'make' in italic). The italic is a loaded gesture: it signals the creative act, the human agency of prompting. Tracking at -0.0240em keeps the italic from sprawling. · `--font-redaction-50-italic`
- **Substitute:** Playfair Display Italic, Cormorant Italic
- **Weights:** 400
- **Sizes:** 42px
- **Line height:** 1.00
- **Letter spacing:** -0.0240em
- **Role:** Accent display variant — used for one or two words within an otherwise upright Redaction headline (e.g. 'What should we make?' with 'make' in italic). The italic is a loaded gesture: it signals the creative act, the human agency of prompting. Tracking at -0.0240em keeps the italic from sprawling.

### Satoshi — Occasional bold subhead — used sparingly for card titles or section labels where Geist at 600 would feel too neutral and Redaction would feel too editorial. Satoshi at 700 fills the middle ground. · `--font-satoshi`
- **Substitute:** Inter Bold, Geist Bold
- **Weights:** 700
- **Sizes:** 22px
- **Line height:** 1.15
- **Letter spacing:** -0.0300em
- **Role:** Occasional bold subhead — used sparingly for card titles or section labels where Geist at 600 would feel too neutral and Redaction would feel too editorial. Satoshi at 700 fills the middle ground.

### Geist Variable — Geist Variable — detected in extracted data but not described by AI · `--font-geist-variable`
- **Weights:** 400, 700
- **Sizes:** 14px
- **Line height:** 1
- **Letter spacing:** 0.029
- **Role:** Geist Variable — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.37 | -0.14px | `--text-body-sm` |
| body-lg | 16px | 1.4 | -0.16px | `--text-body-lg` |
| subheading | 20px | 1.2 | -0.34px | `--text-subheading` |
| heading-sm | 22px | 1.15 | -0.66px | `--text-heading-sm` |
| heading | 30px | 1.1 | — | `--text-heading` |
| display | 42px | 1.1 | -1.01px | `--text-display` |
| display-lg | 60px | 1 | -1.5px | `--text-display-lg` |
| display-xl | 80px | 1 | -2.4px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 10px |
| cards | 24px |
| pills | 9999px |
| inputs | 24px |
| buttons | 10px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Prompt Input
**Role:** Hero CTA — the primary interaction surface

Full-width Carbon (#191919) surface, 24px radius, hairline Fog (#b4b4b4) border, 24px internal padding. Placeholder text in Ash (#7b7b7b) at 15px Geist 400. Contains a circular submit button (24px, #eeeeee fill, dark icon) at the right edge. This is the largest functional element on the page — it must feel inviting and centered.

### Feature Card (Ideate/Iterate/Scale)
**Role:** Three-column capability showcase

Carbon (#191919) surface, 24px radius, 1px Fog (#b4b4b4) border. Internal padding 24px. Large numeral (01/02/03) at 30px Geist 600 in Ash, paired with a heading at 30px Geist 600 in Bone. Contains a screenshot/UI preview image filling the card body, followed by a short descriptor in Body text and a bullet subhead in Geist 600.

### Ghost Navigation Button
**Role:** Top-right secondary action

Transparent fill, 1px Fog (#b4b4b4) border, 10px radius, padding 9px 13px. Text in Bone at 14px Geist 500. On hover, background lifts to #191919.

### Primary Pill Button
**Role:** Top-right primary action ('Get started for free')

Bone (#eeeeee) fill, Pitch (#050505) text, 9999px radius (fully pill), padding 9px 14px. Text at 14px Geist 500. This is the only light element in the nav — it functions as the bright dot in a dark field.

### Pill Suggestion Chip
**Role:** Quick-prompt buttons under the main input

Transparent fill, 1px Fog (#b4b4b4) border, 9999px radius, padding 6px 14px. Text at 14px Geist 400 in Bone, with a small leading icon. Three chips sit in a row: 'On-brand variations', 'Editorial shoot', 'Campaign moodboard'.

### Top Navigation Bar
**Role:** Site-wide navigation

Sticky, transparent (canvas #000000 shows through), no border. Logo (FLORA wordmark with monogram) on the left, nav links centered, two action buttons on the right. Links at 14px Geist 400 in Bone, with dropdown chevrons. The wordmark uses a serif treatment distinguishing it from the sans-serif UI.

### Image Preview Thumbnail
**Role:** Floating gallery of generated outputs

Aspect-ratio-locked image tile with 10px or 24px radius, no border, 2–3px gap between tiles. Images are the only chromatic content — they sit on the black canvas like prints hung on a gallery wall, slightly overlapping in parallax positions.

### Tag Pill ('New')
**Role:** Feature freshness indicator

Small pill: Carbon (#191919) fill, 10px radius, padding 1px 8px. Text at 11px Geist 500 in Bone, often paired with a parent nav link (e.g., 'Techniques New').

### Workflow Diagram Card
**Role:** Node-graph visualization in the 'Scale' section

Carbon (#191919) panel, 24px radius, containing 3–4 image nodes connected by thin Fog (#b4b4b4) curved lines. Nodes have 10px radius, show a small image preview and a label in caption-size Geist.

### Section Heading (Redaction)
**Role:** Editorial section titles

Redaction 10 at 42px, tracking -0.0360em, color Bone (#eeeeee), with one word in Redaction 50 Italic for emphasis. Line-height 1.10. Appears above or beside a short descriptive paragraph in body Geist.

### Text-Left Large Display
**Role:** Full-bleed section headers ('Visual Effects', 'Fashion', 'Advertising')

Display at 60–80px Geist, tracking -0.0250em to -0.0300em, in Bone. Large section labels stack vertically with generous 48px+ vertical rhythm. Sits on the black canvas — no card, no border.

### Footer Link
**Role:** Bottom-of-page navigation

Text-only, no background. Ash (#7b7b7b) at 14px Geist 400, 4–8px gap between items. On hover, color shifts to Bone.

## Do's and Don'ts

### Do
- Use Carbon (#191919) for every elevated surface — cards, inputs, modals — so they read as one step above the black canvas
- Set primary text and key headings in Bone (#eeeeee); use Ash (#7b7b7b) for secondary metadata and Fog (#b4b4b4) for body text and borders
- Use Redaction 10/50 Italic for editorial section titles and the hero question; reserve Geist for all functional UI text
- Apply 24px radius to cards, inputs, and large surfaces; 10px to buttons and tags; 9999px only to the primary pill CTA and quick-prompt chips
- Apply -0.0300em letter-spacing at 60–80px display sizes and -0.0170em at 20–22px subheadings to maintain the compressed editorial voice
- Keep the interface fully monochrome — let the generated images be the only source of color in any composition
- Use 1px Fog (#b4b4b4) borders on cards and inputs; never use shadows to denote elevation

### Don't
- Do not introduce a chromatic brand accent color — the zero-colorfulness palette is the signature
- Do not use Redaction for body text, buttons, or functional UI; it is display-only
- Do not apply box-shadows to cards or panels — the system relies on #191919 surface contrast against #000000 canvas, not elevation shadows
- Do not use Satoshi at 700 for long headlines; it is a subhead accent, not a display face
- Do not center-align body paragraphs or card descriptions — use left-align to match the editorial left-edge rhythm
- Do not use 4px or 5px radii for cards or inputs; stay on the 10/24/9999px system
- Do not use color-coded status indicators (green/yellow/red) — if feedback is needed, use weight, size, or position changes within the gray scale

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000000` | Page background — pure black absorbs all attention toward the generated imagery |
| 1 | Card | `#191919` | Elevated panels, prompt input, feature cards — one stop above the canvas |
| 2 | Deep Surface | `#303030` | Input interiors, nested panels, subtle layering |

## Elevation

FLORA uses no box-shadows. Elevation is communicated entirely through surface tone: the canvas is #000000, elevated panels are #191919, and deeper nested surfaces are #303030. This eliminates the visual noise of cast shadows and keeps the black-velvet-gallery feel intact. Hairline 1px borders in Fog (#b4b4b4) define card edges instead.

## Imagery

Imagery is the product — generated photographs, editorial compositions, and creative outputs are the dominant visual content. Images appear as floating tiles on the pure black canvas, often with parallax overlap, no captions, and slight rotation. They are full-color, high-contrast, and editorial in quality (fashion-editorial lighting, cinematic compositions). In UI mockups embedded within cards, screenshots show the FAUNA agent interface with mock generation results. No illustrations, no 3D renders, no abstract graphics — the generated photographic output carries all visual weight.

## Layout

Full-bleed sections on a 1280px max-width centered track. The hero is a centered prompt input with floating image previews above and beside it, arranged in a loose asymmetric collage on the black canvas. Below the hero, a three-column feature grid (Ideate/Iterate/Scale) with equal-width cards. Further down, a two-column split with a large left-aligned display heading stacked vertically (Visual Effects / Fashion / Advertising) and a workflow diagram card on the right. Section rhythm uses 48px vertical gaps with no dividers — sections flow seamlessly on the black canvas. Navigation is a single transparent sticky bar at the top.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas/background: #000000
- Card/elevated surface: #191919
- Deep surface: #303030
- Primary text: #eeeeee
- Secondary text/borders: #b4b4b4
- Muted text: #7b7b7b
- primary action: #000000 (filled action)

**Example Component Prompts**
1. *Hero prompt input*: Full-width Carbon (#191919) surface, 24px radius, 1px Fog (#b4b4b4) border, 24px padding. Placeholder 'Shoot an on-figure editorial in a Tokyo alley…' in Ash (#7b7b7b) at 15px Geist 400. Circular 24px submit button with Bone fill at right edge.

2. *Three-column feature card*: Carbon (#191919) fill, 24px radius, 1px Fog border, 24px padding. Numeral '01' in Ash at 30px Geist 600, heading 'Ideate' in Bone at 30px Geist 600. Body text in Fog at 15px Geist 400. Contains a UI mockup image filling the card width.

3. Create a Primary Action Button: #000000 background, #eeeeee text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. *Editorial section heading*: Redaction 10 at 42px, tracking -0.0360em, color Bone, line-height 1.10. One word swapped to Redaction 50 Italic for emphasis.

5. *Ghost nav button*: Transparent fill, 1px Fog (#b4b4b4) border, 10px radius, padding 9px 13px. Text 'Contact sales' at 14px Geist 500 in Bone.

## Monochrome Discipline

The palette has zero colorfulness. This is not a constraint — it is the core identity. Every chromatic pixel in the system comes from user-generated imagery, never from UI chrome. When adding any new component, audit it for color: fills, borders, icons, and text must all be drawn from the 9-step achromatic scale (#000000 → #050505 → #191919 → #303030 → #606060 → #7b7b7b → #b4b4b4 → #bfbfbf → #eeeeee). The only permitted color in chrome is the gradient highlight on the submit arrow and the green 'New' badge dot — and even these are used minimally.

## Similar Brands

- **Midjourney** — Same monochrome dark gallery aesthetic where the generated images are the only color; floating image grid on pure black canvas
- **Krea AI** — Same zero-chrome dark interface with prompt-centric hero and image-preview gallery arranged asymmetrically on black
- **Ideogram** — Same editorial dark-mode product UI with serif display accents on a pure black canvas and compact card grids
- **Runway** — Same black-canvas generative-AI landing page pattern with floating creative output tiles and minimal UI chrome
- **Linear** — Same hairline-border-on-dark-surface component language (1px borders, subtle #191919 card elevation, no shadows) and Geist-family typography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #191919;
  --color-graphite: #303030;
  --color-slate: #606060;
  --color-ash: #7b7b7b;
  --color-fog: #b4b4b4;
  --color-mist: #bfbfbf;
  --color-bone: #eeeeee;
  --color-pitch: #050505;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-redaction-10: 'Redaction 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-redaction-50-italic: 'Redaction 50 Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-variable: 'Geist Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.37;
  --tracking-body-sm: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.34px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.66px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: -1.01px;
  --text-display-lg: 60px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.5px;
  --text-display-xl: 80px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.4px;

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
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-3xl: 24px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 10px;
  --radius-cards: 24px;
  --radius-pills: 9999px;
  --radius-inputs: 24px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-card: #191919;
  --surface-deep-surface: #303030;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #191919;
  --color-graphite: #303030;
  --color-slate: #606060;
  --color-ash: #7b7b7b;
  --color-fog: #b4b4b4;
  --color-mist: #bfbfbf;
  --color-bone: #eeeeee;
  --color-pitch: #050505;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-redaction-10: 'Redaction 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-redaction-50-italic: 'Redaction 50 Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-variable: 'Geist Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.37;
  --tracking-body-sm: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.34px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.66px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: -1.01px;
  --text-display-lg: 60px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.5px;
  --text-display-xl: 80px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.4px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-3xl: 24px;
  --radius-full: 999px;
  --radius-full-2: 9999px;
}
```
