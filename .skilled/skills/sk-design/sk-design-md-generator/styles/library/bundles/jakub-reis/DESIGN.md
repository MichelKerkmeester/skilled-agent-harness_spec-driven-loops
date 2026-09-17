# Jakub Reis — Style Reference
> gallery wall on bone paper — every screen is a quiet white room where only typography and photography exist

**Theme:** light

Jakub Reis is a type-driven portfolio: a bone-white canvas, a single custom sans-serif at whisper weights, and photographs that carry every drop of color the system refuses to supply. The site reads like a printed exhibition catalog — a name, a discipline, a grid of framed works, and nothing else. Hierarchy is built entirely from size, weight (300 vs 400 only), and the generous negative space between blocks; there are no buttons, no badges, no borders, no shadows, no gradients. The signature is restraint: even the separator between client names in the intro paragraph is a tilde (~) instead of a dot, pipe, or comma — a typographic personality choice that the entire UI leans into. Components are essentially text labels attached to full-bleed images; the design system exists to disappear so the work can speak.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#f8f8f8` | `--color-bone` | Page canvas, the only background tone — a warm off-white that keeps the page from feeling clinical |
| Carbon | `#000000` | `--color-carbon` | Primary text, project titles, navigation links, all body copy — the only ink the system ever uses |
| Ash | `#080808` | `--color-ash` | Secondary text, near-identical to Carbon for AAA contrast on Bone — exists for accessibility, not visual contrast |
| Stone | `#d8d8d8` | `--color-stone` | Muted UI surface for disabled controls, low-emphasis panels, and placeholder blocks. Do not promote it to the primary CTA color |

## Tokens — Typography

### Degular — Sole typeface for all text — display, body, navigation, and labels. Weight 300 carries display and project titles (the 'whisper' that makes a 50px headline feel editorial, not aggressive). Weight 400 is reserved for body copy, category labels, and nav. Only two weights in the entire system, which is itself a signature choice — there is no 'bold' to reach for. · `--font-degular`
- **Substitute:** Söhne or Inter at weights 300/400 — both share Degular's geometric, slightly humanist character and similar x-height proportions
- **Weights:** 300, 400
- **Sizes:** 16px, 18px, 24px, 30px, 50px
- **Line height:** 1.33, 1.25, 1.11, 1.00, 0.92
- **Letter spacing:** 0.033em at body sizes (16–18px), 0.056em at display sizes (30–50px) — positive tracking on large type is deliberately counter-trend; it widens the headline into a gallery-label rhythm rather than the tight, punchy -0.02em default most sites use
- **Role:** Sole typeface for all text — display, body, navigation, and labels. Weight 300 carries display and project titles (the 'whisper' that makes a 50px headline feel editorial, not aggressive). Weight 400 is reserved for body copy, category labels, and nav. Only two weights in the entire system, which is itself a signature choice — there is no 'bold' to reach for.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.33 | 0.528px | `--text-caption` |
| body | 18px | 1.25 | 0.594px | `--text-body` |
| subheading | 24px | 1.11 | 1.344px | `--text-subheading` |
| heading | 30px | 1 | 1.68px | `--text-heading` |
| display | 50px | 0.92 | 2.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Project Image Block
**Role:** Primary content unit — each portfolio piece

Full-bleed photograph with no padding, no border, no radius. The image is the component. Below the image sits a 20px gap, then the project title in Degular 400 at 24px in #000000, followed by a 5px gap, then category labels in Degular 400 at 16px in #000000. No card container, no background fill, no hover state on the image.

### Top Navigation Bar
**Role:** Site header — email left, social links right

Transparent background over the #f8f8f8 canvas. Email address at far left in Degular 400 at 16px, #000000, all lowercase, no decoration. Social platform names (Twitter, Instagram, LinkedIn, Dribbble) at far right in the same style, separated by 20px gaps. No logo, no hamburger, no sticky behavior implied. All caps would break the system — everything is uppercase or lowercase as written, never transformed.

### Headline Block
**Role:** Opening identity statement

Name on one line, discipline on the next, both left-aligned. Name at 30px Degular 300, #000000, letter-spacing 1.68px, line-height 1.0. Discipline line at 30px same specs. Optional tilde (~) appears after the name as a decorative terminator. The tilde is the system's only ornament.

### Intro Paragraph
**Role:** Client list and credibility statement

Degular 400 at 18px, #000000, line-height 1.25. Client names are separated by tilde characters (~) with a single space on each side — 'Nike ~ Louis Vuitton ~ Marvel ~ DNB Bank'. The tilde is not a bullet, not a pipe, not a slash; it is a typographic signature unique to this site.

### Category Label
**Role:** Discipline tag beneath project title

Degular 400 at 16px, #000000, line-height 1.33. Always a short phrase like 'Visual Identity, User Interface Design' separated by commas. No badge background, no border, no dot — just text.

### Project Grid
**Role:** Two-column portfolio layout

Two equal-width columns, left and right, with each project occupying one column. Vertical rhythm between projects is 80px. The two columns are not locked to a strict row grid — images can vary in height, creating a staggered editorial flow similar to a magazine spread.

### Footer Spacer
**Role:** End-of-page breathing room

A single 120px top padding at the bottom of the page — the largest spacing token in the system, used once, to let the last project breathe before the page ends. No footer content, no copyright, no links.

## Do's and Don'ts

### Do
- Use Degular exclusively at weights 300 and 400 only — never introduce 500, 600, or 700
- Set tracking to 0.033em on body sizes (16–18px) and 0.056em on display sizes (30–50px) — positive tracking on large type is non-negotiable
- Use #f8f8f8 as the sole background and #000000 as the sole text color — no additional neutrals, no grays for text
- Use the tilde (~) with single spaces as the separator character in any list of names, skills, or categories
- Use 80px between portfolio items and 20px between an image and its caption — these two values are the entire vertical rhythm
- Let images be the only source of color, texture, and visual weight — the UI must stay typographically monochrome
- Keep the project title in Degular 400 at 24px and category labels in Degular 400 at 16px — these sizes are the only ones used in content blocks

### Don't
- Do not add buttons, badges, tags with backgrounds, or any container with a fill color
- Do not use shadows, borders, or rounded corners on any element — flatness is the system
- Do not introduce a second typeface, a monospace font, or a serif fallback
- Do not use color for interactive states — hover, focus, and active are expressed through opacity (e.g. 0.6) or underline only
- Do not add gradients, background images to UI elements, or decorative SVG patterns
- Do not use font-weight 500 or above — the maximum weight in the system is 400
- Do not tighten tracking on display sizes to match conventional headline practice — 0.056em at 50px is the signature, not a mistake

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone | `#f8f8f8` | Page canvas — the single, flat background that runs edge to edge |

## Elevation

No shadows, no z-axis. Depth is implied only through vertical spacing between image blocks and the generous gap between sections. The system actively refuses elevation as a visual language — flatness IS the brand.

## Imagery

The site is image-dominant: full-bleed editorial photography fills the entire content area of each project block, and the UI deliberately steps back to let these photographs carry the visual system. Images are tight crops of fashion editorials, product photography, and studio portraits — high-production, bold color, often with dramatic lighting (deep blues, saturated yellows, neon pinks). They are presented raw: no overlays, no duotone treatment, no rounded corners, no contained framing. The contrast is intentional — the UI is bone-white and typographically austere while the portfolio images are vivid and sensory-rich, so the work itself becomes the burst of color the page otherwise refuses.

## Layout

Two-column asymmetric grid for the project showcase, with images of varying heights creating a staggered, magazine-like vertical flow. The top of the page splits into two halves: left column holds the headline (name + discipline), right column holds the intro paragraph — both top-aligned, no visual divider between them. Navigation is a single thin top bar with email far-left and social links far-right, no logo, no border beneath it. Section transitions are marked only by vertical whitespace (80px gaps), never by background color changes or dividers. The overall rhythm is: sparse top → dense image grid → sparse bottom with a 120px footer spacer. Content is contained within a ~1200px max-width and centered, but images within that container are edge-to-edge of their column.

## Tilde Convention

The tilde character (~) is the system's only typographic ornament and is used in three places: (1) as a trailing character after the name in the headline block, (2) as the separator between client names in the intro paragraph, and (3) as the separator between disciplines and project names wherever a list is needed. Always rendered with a single space on each side. Never replace with a bullet, pipe, slash, em-dash, or comma — the tilde is what makes the site's voice distinguishable from a generic portfolio template.

## Weight Restraint

The entire system uses only two font weights: 300 for display/headline elements and 400 for everything else. This binary creates a distinctive editorial tone where 400 already carries enough presence to serve as 'bold' in context. Introducing a medium or semibold weight would immediately flatten the hierarchy and make the design feel like a standard SaaS template. If a design needs more emphasis, increase size or letter-spacing — never weight.

## Agent Prompt Guide

primary action: no distinct CTA color

## Similar Brands

- **Aman Resorts (aman.com)** — Same bone-white canvas, single-weight type, and editorial restraint — visual identity communicated entirely through generous whitespace and high-production imagery
- **COS (cosstores.com)** — Same two-column project/lookbook grid, same positive tracking on display type, same refusal of color in the UI in favor of letting photography carry the brand
- **Studio Dumbar portfolio projects** — Same whisper-weight display type (300/400 only), same typographic personality as the only system component, same flatness with no shadows or rounded corners
- **Manual (manual.co)** — Same gallery-wall layout with image-led portfolio blocks, same typographic discipline where the UI almost disappears to let work dominate

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #f8f8f8;
  --color-carbon: #000000;
  --color-ash: #080808;
  --color-stone: #d8d8d8;

  /* Typography — Font Families */
  --font-degular: 'Degular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.33;
  --tracking-caption: 0.528px;
  --text-body: 18px;
  --leading-body: 1.25;
  --tracking-body: 0.594px;
  --text-subheading: 24px;
  --leading-subheading: 1.11;
  --tracking-subheading: 1.344px;
  --text-heading: 30px;
  --leading-heading: 1;
  --tracking-heading: 1.68px;
  --text-display: 50px;
  --leading-display: 0.92;
  --tracking-display: 2.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone: #f8f8f8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #f8f8f8;
  --color-carbon: #000000;
  --color-ash: #080808;
  --color-stone: #d8d8d8;

  /* Typography */
  --font-degular: 'Degular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.33;
  --tracking-caption: 0.528px;
  --text-body: 18px;
  --leading-body: 1.25;
  --tracking-body: 0.594px;
  --text-subheading: 24px;
  --leading-subheading: 1.11;
  --tracking-subheading: 1.344px;
  --text-heading: 30px;
  --leading-heading: 1;
  --tracking-heading: 1.68px;
  --text-display: 50px;
  --leading-display: 0.92;
  --tracking-display: 2.8px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-80: 80px;
}
```
