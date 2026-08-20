# Integrated Biosciences — Style Reference
> bioluminescent laboratory at midnight

**Theme:** mixed

Integrated Biosciences operates in a darkroom-laboratory visual language: a near-black canvas with cool green undertones, restrained white typography, and a single bioluminescent lime accent that activates only on small interactive elements like arrow buttons, tag dots, and progress indicators. The entire type system runs on a single weight of Aspekta — hierarchy is sculpted purely through size and aggressive negative letter-spacing, which makes 111px and 158px display lines feel architectural rather than decorative. Roboto Mono is reserved for technical labels, nav items, and metadata, reinforcing the instrumentation-bench character of the brand. Surfaces stay mostly flat — no shadows, no gradients — with thin hairline borders in #c9cbbe or #4d5757 doing all the delineation. Light sections flip to a warm off-white canvas (#f7f7f5) with white cards, but the green accent persists as a constant biological signal.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bioluminescent Lime | `#cef79e` | `--color-bioluminescent-lime` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Abyssal Ink | `#222f30` | `--color-abyssal-ink` | Primary text, borders, dark canvas sections, nav backgrounds. Near-black with a cool green undertone — it is not pure black, it carries the same green note as the accent. Darkest content surface |
| Bone White | `#f7f7f5` | `--color-bone-white` | Light-section page canvas, hero/section backgrounds when in light mode. Warm off-white with the faintest cream cast |
| Paper | `#ffffff` | `--color-paper` | Card surfaces on light sections, elevated containers, icon fills, body text on dark surfaces. The brightest surface in the system |
| Graphite | `#4d5757` | `--color-graphite` | Secondary body text, muted metadata, subdued borders, ghost button outlines. Mid-tone with a green undertone matching the system |
| Lichen | `#c9cbbe` | `--color-lichen` | Hairline borders, subtle dividers, placeholder metadata text. Warm desaturated green-beige that disappears on white but is visible on #f7f7f5 |
| Tissue | `#e7e8e1` | `--color-tissue` | Alternate card surface — warmer light gray used to differentiate secondary cards or muted content blocks from the white primary surface |
| Frost | `#eeeeee` | `--color-frost` | Neutral light card surface when a non-warm alternate is needed |
| Void | `#000000` | `--color-void` | Footer background, pure black anchors. Used sparingly as a true neutral when the Abyssal Ink is too colored |

## Tokens — Typography

### Aspekta — Sole display and body typeface. Every size from caption to display runs on a single 400 weight — hierarchy is carved by size and tightening tracking, never by weight. Negative letter-spacing scales linearly with size: -0.001em at body, -0.03em at the largest display, keeping the letterforms optically balanced as they grow. The flat single-weight treatment gives the brand its lab-instrument calm — no bold shouting, no italic emotion. · `--font-aspekta`
- **Substitute:** Inter Tight at weight 400, or Söhne Buch
- **Weights:** 400
- **Sizes:** 16px, 18px, 19px, 22px, 24px, 36px, 42px, 58px, 75px, 89px, 111px, 158px
- **Line height:** 1.00–1.30
- **Letter spacing:** -0.03em at 158px, -0.02em at 89–111px, -0.006em at 36–42px, -0.001em at 16–19px
- **Role:** Sole display and body typeface. Every size from caption to display runs on a single 400 weight — hierarchy is carved by size and tightening tracking, never by weight. Negative letter-spacing scales linearly with size: -0.001em at body, -0.03em at the largest display, keeping the letterforms optically balanced as they grow. The flat single-weight treatment gives the brand its lab-instrument calm — no bold shouting, no italic emotion.

### Roboto Mono — Technical labels, nav items, section markers (01/02 counters), tags, publication metadata, button text. Monospaced geometry signals instrumentation and scientific precision — it is the voice of the lab notebook, contrasted against Aspekta's editorial clarity. · `--font-roboto-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 13px, 14px, 15px
- **Line height:** 1.00–1.23
- **Letter spacing:** -0.02em at 13px, -0.008em at 14px, -0.007em at 15px
- **Role:** Technical labels, nav items, section markers (01/02 counters), tags, publication metadata, button text. Monospaced geometry signals instrumentation and scientific precision — it is the voice of the lab notebook, contrasted against Aspekta's editorial clarity.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.23 | -0.26px | `--text-caption` |
| body | 18px | 1.3 | -0.018px | `--text-body` |
| body-lg | 22px | 1.3 | -0.13px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.14px | `--text-subheading` |
| heading-sm | 36px | 1.2 | -0.22px | `--text-heading-sm` |
| heading-lg | 58px | 1.1 | -0.7px | `--text-heading-lg` |
| display | 75px | 1.1 | -1.5px | `--text-display` |
| display-lg | 89px | 1.1 | -1.78px | `--text-display-lg` |
| display-xl | 111px | 1 | -2.22px | `--text-display-xl` |
| hero | 158px | 1 | -4.74px | `--text-hero` |

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
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 60 | 60px | `--spacing-60` |
| 88 | 88px | `--spacing-88` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| tags | 9999px |
| cards | 16-20px |
| buttons | 8px |
| largeCards | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 40px
- **Element gap:** 8-20px

## Components

### Hero Display Headline
**Role:** Primary page-level headline

Set in Aspekta 400 at 111–158px, line-height 1.0, letter-spacing -0.03em. White (#ffffff) on Abyssal Ink (#222f30). Left-aligned, no max-width constraint — the line breaks are generous. Period-terminated. This is the single largest typographic element in the system and sets the brand's architectural tone.

### Section Sub-Headline
**Role:** Section-level statement

Aspekta 400 at 36–42px, line-height 1.2, letter-spacing -0.006em. Rendered in muted Graphite (#4d5757) on dark backgrounds, or Abyssal Ink on light. Reads as a quiet, reflective counterpoint to the hero — the voice of the researcher explaining, not announcing.

### Pill Navigation Button
**Role:** Active/highlighted nav item

Outlined pill shape, border 1px in #c9cbbe on dark surfaces or #4d5757 on light, radius 12px. Roboto Mono 13–14px at 400, letter-spacing -0.02em. Text in matching border color. When active, fills with Bioluminescent Lime (#cef79e) and text flips to Abyssal Ink.

### Filled Action Button (Work With Us)
**Role:** Primary site-level CTA

Filled rectangle, background #222f30 (dark) or #ffffff (light), text in opposite surface color. No border. Radius 8px. Roboto Mono 13–14px uppercase tracking -0.02em. Compact horizontal padding ~12-16px, vertical 8px. Restrained size — this system does not shout with button scale.

### Arrow CTA Button
**Role:** Secondary directional action

40×40px square, radius 8px, filled Bioluminescent Lime (#cef79e) with Abyssal Ink arrow icon. Used at the end of card titles, section footers, and inline links. This is the only place the green accent fills a shape — it functions as a green traffic light pointing forward.

### Outlined Ghost Button (Discover Our Platform)
**Role:** Low-emphasis CTA

Transparent background, border 1px in #4d5757, text in #ffffff or #222f30. Radius 8px. Roboto Mono 14px. Pairs with the Arrow CTA button when two actions sit side by side.

### Section Counter (01/02)
**Role:** Section numbering marker

Small pill containing a section number, border 1px in #4d5757, radius 9999px. Roboto Mono 13px. Sits above or beside the section headline as a navigational anchor — the table-of-contents voice of the page.

### News Article Card
**Role:** Editorial content block

White (#ffffff) surface on Bone White (#f7f7f5) canvas, radius 20–40px, no shadow. 40px internal padding. Two-column layout: left half is a dark full-bleed scientific image (radius 12-16px on the image itself), right half is title + meta + excerpt + 'READ ARTICLE' link. Generous breathing room — this card occupies a full viewport-width band.

### Publication Tag
**Role:** Category indicator

Small green-dot prefix + Roboto Mono uppercase label. Dot is 6px Bioluminescent Lime circle. Label in Roboto Mono 13px in #4d5757 or #c9cbbe. Functions as the system's only color-coded classification marker.

### Hero Section Background
**Role:** Dark canvas surface

Full-bleed Abyssal Ink (#222f30). No gradient, no texture. Headline left-aligned in upper third, supporting text left-aligned in lower third. Massive vertical breathing room — minimum 400px of negative space between headline and copy.

### Light Section Background
**Role:** Light canvas surface

Full-bleed Bone White (#f7f7f5) with white cards. Used for editorial/newsroom sections, creating a flip from the dark content sections. The transition itself is the visual signal — no divider line is needed.

### Hairline Divider
**Role:** Section/content separator

1px line in #c9cbbe (on light) or #4d5757 (on dark). Full width or column-width. The system uses only horizontal dividers — never vertical, never double, never dashed.

### Footer
**Role:** Site closure

Pure black (#000000) background — a deeper note than the Abyssal Ink used in content sections. White text, Roboto Mono for links, Aspekta for any larger text. Signals the absolute end of the site.

## Do's and Don'ts

### Do
- Use Aspekta at weight 400 for all display and body text — never bold, never semibold, never italic. Hierarchy is size and tracking only.
- Set Bioluminescent Lime (#cef79e) fills at exactly 40×40px for arrow buttons and 6px diameter for tag dots. Never scale the accent larger than a micro-surface.
- Apply letter-spacing proportionally: -0.03em at 158px, -0.02em at 89–111px, -0.006em at 36–42px, -0.001em at 16–19px. The tracking is what keeps the flat weight readable at extreme sizes.
- Use 1px hairlines in #c9cbbe (on light) or #4d5757 (on dark) for all dividers and card borders. Never use thicker borders, never use shadows for depth.
- Reserve Roboto Mono for nav items, section counters (01/02), publication tags, dates, and button text. Never use it for headlines or body copy longer than a label.
- Maintain 80–120px vertical section gaps. The system breathes — compression destroys the lab-instrument calm.
- Pair every action with its opposite surface: dark button (#222f30 fill) on light canvas, light button (#ffffff fill) on dark canvas. Never use Bioluminescent Lime as a primary button background.

### Don't
- Do not introduce a second weight of Aspekta or any other sans-serif for headings. The single-weight system is the brand's identity — adding bold breaks it.
- Do not use #cef79 as a background for body text, large surfaces, gradients, or hero overlays. The accent is rationed at micro-scale for a reason.
- Do not apply box-shadows, drop-shadows, or any elevation effect. Depth comes from color contrast and borders only.
- Do not use pure #000000 for content sections — reserve it for the footer. Content dark surfaces are #222f30 with its green undertone.
- Do not use the warm neutrals (#e7e8e1, #c9cbbe) on dark sections. They disappear against Abyssal Ink and break the surface hierarchy.
- Do not place images outside of rounded containers (minimum radius 12px) or without the dark scientific treatment. Lifestyle photography breaks the lab-instrument language.
- Do not use multiple accent colors. The system's power is in monochrome discipline plus one signal. Adding a second chromatic role dilutes the brand's visual tension.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas — Light | `#f7f7f5` | Base background for light sections (Newsroom, editorial) |
| 1 | Page Canvas — Dark | `#222f30` | Base background for dark sections (Hero, What We Do, content) |
| 2 | Card Surface — Light | `#ffffff` | Elevated cards on light canvas, icon fills on dark |
| 3 | Card Surface — Warm Alternate | `#e7e8e1` | Secondary card tone on light sections |
| 4 | Accent Fill | `#cef79` | Interactive micro-surfaces — arrow buttons, active tags, accent dots |
| 5 | Footer Ground | `#000000` | Absolute-dark closure surface |

## Elevation

This system is deliberately flat. No box-shadows appear anywhere. Depth is communicated exclusively through surface color contrast (Abyssal Ink vs Paper vs Bone White) and border hairlines. The visual philosophy treats the interface as a printed scientific poster — every element is a flat ink shape on a flat surface, and the hierarchy comes from size, color, and spacing rather than from any sense of floating or lifting.

## Imagery

Scientific microscopy and 3D molecular renders dominate — cell clusters, protein structures, and neural networks rendered in a single dark-green-to-black palette so they integrate with the Abyssal Ink canvas. Photography is not used; all imagery is generated or illustrated. Imagery is always contained within rounded rectangles (radius 12–16px) and paired with white cards. The green Bioluminescent Lime is echoed in the imagery's highlights, creating visual continuity between the interface accent and the scientific subject matter. The Newsroom section's lead image is a tight crop of glowing cell structures on black — full-bleed within the card, with no text overlay, letting the subject speak.

## Layout

Max-width 1200px centered for all content. Dark sections (hero, 'What We Do', platform) are full-bleed in Abyssal Ink with content constrained to the 1200px column and generous left-padding for text. Light sections (Newsroom) are full-bleed in Bone White with the same 1200px content column. Hero is asymmetric: headline occupies the left two-thirds, large amounts of right-side and bottom negative space. Section rhythm alternates: dark band → dark band → light band, with no dividers between same-mode sections. Card layouts are two-column (image-left, text-right) for editorial blocks, and single-column stacked for text-heavy content. Navigation is a single horizontal bar — logo left, nav links right, with a pill-shaped active indicator. No sticky header, no sidebar, no mega-menu — the navigation is intentionally minimal so the content commands attention.

## Agent Prompt Guide

**Quick Color Reference**
- text: #222f30 (dark) / #ffffff (on dark)
- background: #f7f7f5 (light) / #222f30 (dark)
- border: #c9cbbe (light) / #4d5757 (dark)
- accent: #cef79e
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero Headline**: Full-bleed #222f30 background. Headline at 158px Aspekta weight 400, color #ffffff, line-height 1.0, letter-spacing -4.74px. Period-terminated, left-aligned, 80px from nav.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **News Article Card**: White (#ffffff) card on #f7f7f5 canvas, radius 20px, 40px padding. Two-column: left = dark scientific image with 16px radius, right = publication tag (6px #cef79e dot + Roboto Mono 13px 'PUBLICATIONS'), date in Roboto Mono 13px #c9cbbe, headline at 36px Aspekta 400 #222f30 letter-spacing -0.22px, excerpt at 18px #4d5757, 'READ ARTICLE' link in Roboto Mono 13px.

4. **Section with Counter**: Dark #222f30 band. Pill counter '01 / 02' with 1px #4d5757 border, 9999px radius, Roboto Mono 13px #4d5757. Headline at 42px Aspekta 400 #4d5757, letter-spacing -0.5px, line-height 1.2, max-width 600px, left-aligned 50% from left edge.

5. **Ghost Navigation Button**: Transparent fill, 1px border in #c9cbbe, radius 12px, padding 8px 16px, Roboto Mono 13px #c9cbbe, letter-spacing -0.26px. When active, fill flips to #cef79e and text to #222f30.

## Type System Philosophy

The entire system runs on a single weight (400) of Aspekta. This is not a limitation — it is the brand's defining choice. Weight variation is deliberately absent; hierarchy is sculpted by three tools: size (16px to 158px), line-height compression (1.3 at body, 1.0 at display), and letter-spacing tightening (-0.001em at body, -0.03em at hero). The result reads as a scientific monograph — flat, precise, and unornamented. Roboto Mono enters only for technical metadata: nav labels, section counters, publication tags, dates, and button text. The mono's geometric rigidity against Aspekta's humanist curves creates the system's only typographic contrast.

## Accent Discipline

The Bioluminescent Lime (#cef79e) is rationed. It appears on: 40×40 arrow buttons, 6px tag dots, active nav pills, and progress indicators. It never fills a large surface, never sits behind body text, never appears in gradients. The discipline is the point — when green appears, the eye locks onto it because the rest of the interface is monochrome. Treat it as a signal lamp: on = active, forward, or biological.

## Similar Brands

- **Arc Institute** — Dark green-black canvas with single vivid accent, oversized single-weight display type, biotech/scientific instrumentation aesthetic
- **Chai Discovery** — Near-black backgrounds, bioluminescent accent color, flat minimal surfaces, single-weight large display typography in a bio/AI context
- **EvolutionaryScale** — Dark-mode biotech interface, extreme type-size contrast between tiny mono labels and massive sans-serif display lines, hairline borders, single accent color
- **Notion AI landing pages** — Oversized single-weight display headlines, generous negative space, muted secondary text color, minimal surface decoration
- **Linear** — Dark canvas with hairline borders, single accent color used sparingly on interactive elements, mono labels for technical metadata

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bioluminescent-lime: #cef79e;
  --color-abyssal-ink: #222f30;
  --color-bone-white: #f7f7f5;
  --color-paper: #ffffff;
  --color-graphite: #4d5757;
  --color-lichen: #c9cbbe;
  --color-tissue: #e7e8e1;
  --color-frost: #eeeeee;
  --color-void: #000000;

  /* Typography — Font Families */
  --font-aspekta: 'Aspekta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.23;
  --tracking-caption: -0.26px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.018px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.13px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.14px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.22px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.7px;
  --text-display: 75px;
  --leading-display: 1.1;
  --tracking-display: -1.5px;
  --text-display-lg: 89px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: -1.78px;
  --text-display-xl: 111px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.22px;
  --text-hero: 158px;
  --leading-hero: 1;
  --tracking-hero: -4.74px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 40px;
  --element-gap: 8-20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-tags: 9999px;
  --radius-cards: 16-20px;
  --radius-buttons: 8px;
  --radius-largecards: 40px;

  /* Surfaces */
  --surface-page-canvas-light: #f7f7f5;
  --surface-page-canvas-dark: #222f30;
  --surface-card-surface-light: #ffffff;
  --surface-card-surface-warm-alternate: #e7e8e1;
  --surface-accent-fill: #cef79;
  --surface-footer-ground: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bioluminescent-lime: #cef79e;
  --color-abyssal-ink: #222f30;
  --color-bone-white: #f7f7f5;
  --color-paper: #ffffff;
  --color-graphite: #4d5757;
  --color-lichen: #c9cbbe;
  --color-tissue: #e7e8e1;
  --color-frost: #eeeeee;
  --color-void: #000000;

  /* Typography */
  --font-aspekta: 'Aspekta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.23;
  --tracking-caption: -0.26px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.018px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.13px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.14px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.22px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.7px;
  --text-display: 75px;
  --leading-display: 1.1;
  --tracking-display: -1.5px;
  --text-display-lg: 89px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: -1.78px;
  --text-display-xl: 111px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.22px;
  --text-hero: 158px;
  --leading-hero: 1;
  --tracking-hero: -4.74px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 40px;
}
```
