# OPX Studio — Style Reference
> Dark gallery monolith — a near-black exhibition hall where monumental white type and full-bleed photography do all the talking, and borders whisper at #292a2c.

**Theme:** dark

OPX Studio operates as a black void gallery: a near-pure #020202 canvas where the only voices are stark white type and full-bleed project photography. The system is aggressively monochrome — zero brand color, zero accent, zero semantic hues — letting the project imagery provide all visual variation. Typography is the sole brand signature: a single-weight (400) custom display face (OPX-Medium) scales from 18px body text to 111px editorial statements with extremely tight leading, giving the page a typographic confidence that fills the dark space. Components are flat, borderless on canvas, and rely on hairline #292a2c dividers and white-stroke pill buttons (45px radius) rather than shadows or fills. Navigation reduces to two words ("Projects", "Studio") set as oversize display type — the page itself is the brand mark. Generous 100–200px vertical breathing room between sections reinforces a slow, editorial pace rather than a dense product feel.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#020202` | `--color-void-black` | Page canvas — the base background across all sections |
| Surface Black | `#000000` | `--color-surface-black` | Section surfaces and image containment backgrounds, barely distinguishable from canvas to keep elevation flat |
| Charcoal Hairline | `#292a2c` | `--color-charcoal-hairline` | Structural dividers and borders — the only mid-tone in the system, carrying 900 occurrences as the skeleton between sections and elements |
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, nav labels, project titles, and 1px pill-button borders — the sole signal of interactivity |
| Ash Gray | `#9b9b9b` | `--color-ash-gray` | Muted helper text and secondary metadata in footer and supporting copy — recedes against the void |

## Tokens — Typography

### OPX-Medium — Primary brand display and text face — a single weight (400) scaling across body, nav, subheadings, and monumental display. Custom face with a humanist-geometric tension; the anti-convention of using weight 400 (not bold) at 111px display size lets the headline dominate through scale alone rather than visual weight · `--font-opx-medium`
- **Substitute:** Söhne, Inter, or a custom neo-grotesque like ABC Diatype Mono
- **Weights:** 400
- **Sizes:** 18px, 20px, 26px, 35px, 50px, 80px, 111px
- **Line height:** 1.00–1.73 (tightens inversely with size: 1.00 at 111px, 1.73 at 18px)
- **Role:** Primary brand display and text face — a single weight (400) scaling across body, nav, subheadings, and monumental display. Custom face with a humanist-geometric tension; the anti-convention of using weight 400 (not bold) at 111px display size lets the headline dominate through scale alone rather than visual weight

### Open Sans — Secondary supporting copy — used in hero subtext and longer descriptive passages where a more relaxed, open-licensed humanist is desired · `--font-open-sans`
- **Substitute:** Source Sans 3, Noto Sans
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.67
- **Role:** Secondary supporting copy — used in hero subtext and longer descriptive passages where a more relaxed, open-licensed humanist is desired

### Untitled — Small label text for pill buttons and tag-like links (e.g. "View case study") — the only weight-500 usage in the system, giving micro-UI slightly more presence · `--font-untitled`
- **Substitute:** Inter, Söhne
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.67
- **Role:** Small label text for pill buttons and tag-like links (e.g. "View case study") — the only weight-500 usage in the system, giving micro-UI slightly more presence

### Helvetica — System fallback for incidental body text and metadata · `--font-helvetica`
- **Substitute:** system-ui, Arial
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.67
- **Role:** System fallback for incidental body text and metadata

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.67 | — | `--text-caption` |
| body | 18px | 1.67 | — | `--text-body` |
| subheading | 20px | 1.67 | — | `--text-subheading` |
| heading-sm | 26px | 1.42 | — | `--text-heading-sm` |
| heading | 35px | 1.4 | — | `--text-heading` |
| heading-lg | 50px | 1.38 | — | `--text-heading-lg` |
| display | 80px | 1.07 | — | `--text-display` |
| display-xl | 111px | 1 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 30 | 30px | `--spacing-30` |
| 50 | 50px | `--spacing-50` |
| 80 | 80px | `--spacing-80` |
| 99 | 99px | `--spacing-99` |
| 100 | 100px | `--spacing-100` |
| 150 | 150px | `--spacing-150` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 45px |
| images | 0px |
| buttons | 45px |

### Layout

- **Section gap:** 100-200px
- **Element gap:** 30px

## Components

### Display Navigation Link
**Role:** Primary top-bar nav item ("Projects", "Studio")

OPX-Medium 400 at ~26–35px in #ffffff, left-aligned in nav container, set with 50px vertical padding. No underline, no active state styling — navigation is a typographic gesture, not a control.

### Editorial Hero Headline
**Role:** Opening statement on the home canvas

OPX-Medium 400 at 80–111px in #ffffff, line-height 1.00–1.07, left-aligned with 50–100px page padding. Uses weight 400 (not bold) — authority through scale and tightness, not weight. Sits in generous 200px top padding against the #020202 void.

### Featured Project Block
**Role:** Single full-bleed project case study (e.g. KB&Co)

Full-width photograph (no border, no radius) occupying the visual center, followed by 20px gap, then project title in OPX-Medium 400 at ~26–35px #ffffff, then 30px gap, then a 'View case study' pill button. Image bleeds to container edges.

### Project Card (Grid Item)
**Role:** Individual case study tile in the 3-column project grid

Full-bleed photograph (0px radius) filling the card width, 30px gap, then OPX-Medium 400 at ~20–26px #ffffff for the project title, 15px gap, then a pill 'View case study' button. Cards have no visible border or background — they are defined by the image and the void around them.

### Pill CTA Button ('View case study')
**Role:** Primary call-to-action linking to a case study

1px solid #ffffff border, transparent fill on #020202 canvas, 45px border-radius (pill-like), padding 7px vertical × 15px horizontal. Label in Untitled 500 at 14px #ffffff. The button is outline-only — no filled state exists in the system.

### Section Heading
**Role:** Mid-page editorial section titles

OPX-Medium 400 at 35–50px in #ffffff, line-height 1.38–1.40, left-aligned, with 30px gap to following content. No decorative elements — pure type.

### Footer Column Block
**Role:** Structured contact and meta information at page bottom

3-column grid of text blocks. Each column starts with a 18–20px OPX-Medium 400 #ffffff label (e.g. 'OPX Studio', 'Project enquiries', 'Social'), then 20px gap, then body lines in OPX-Medium 400 at 18px #9b9b9b (muted).

### Body Paragraph
**Role:** Supporting descriptive copy

Open Sans or OPX-Medium 400 at 18px, line-height 1.67, #ffffff. Relaxed leading for readability against the dark canvas — contrasts with the display text's tight leading.

### Social/External Link
**Role:** Footer or inline outbound link

OPX-Medium 400 at 18px in #9b9b9b, no underline by default. On hover or context: shifts to #ffffff. Sits inline within body text without a bullet or icon.

### Section Divider
**Role:** Horizontal separator between major content bands

1px solid #292a2c hairline spanning full width. The only structural separator in the system — replaces shadows, fills, and whitespace demarcation. Spans appear between the hero, featured project, project grid, and footer.

## Do's and Don'ts

### Do
- Use OPX-Medium 400 at 80–111px for display headlines with line-height locked at 1.00–1.07 — never bold the display
- Apply the #292a2c 1px hairline as the only divider between sections and around interactive elements
- Set all CTA buttons as 1px white-stroke pills at 45px radius with 7px/15px padding — no filled buttons
- Let photography fill its container edge-to-edge at 0px radius — never frame or round project imagery
- Maintain 100–200px vertical padding between major sections to preserve the editorial pacing
- Use #9b9b9b exclusively for muted metadata and helper text; reserve #ffffff for all primary content
- Keep the navigation to two-word labels set in OPX-Medium — the page is the navigation

### Don't
- Do not introduce a brand color, accent, or gradient — the system is monochrome by design
- Do not use box-shadows, glows, or any drop-shadow elevation
- Do not bold the display type — authority comes from size (80–111px), not weight
- Do not round the project imagery or apply a card background — images sit on the void directly
- Do not use #9b9b9b on a #ffffff surface — it fails contrast (2.8:1); it's only valid on the dark canvas
- Do not add icons, bullets, or decorative glyphs to the nav or links — type is the only ornament
- Do not tighten body line-height below 1.67 — the relaxed leading is the only counterpoint to the display text's compression

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void Canvas | `#020202` | Base page background — the entire site sits on this near-black |
| 2 | Surface Black | `#000000` | Section bands and image containers — nearly identical to canvas; elevation is implied by content rather than tonal shift |
| 3 | Hairline | `#292a2c` | 1px structural dividers between sections and around interactive elements — the only visual layering device |

## Elevation

- **All elements:** `none — the design system deliberately avoids box-shadows`

## Imagery

Photography and 3D-rendered product/device shots dominate the visual language. Project tiles are full-bleed editorial photography — hands holding devices, lifestyle objects, designed products in context. Treatments are diverse per project (moody dark product photography, saturated color brand campaigns, natural-light lifestyle) but always presented at full scale without overlay text or treatments. The images are the only source of color in the entire system. Icons are absent from the navigation and UI; the two-word nav labels ("Projects", "Studio") function as the icon system. Decorative graphics: none.

## Layout

Edge-to-edge dark canvas with no maximum content width — sections bleed to the viewport edges while internal type holds generous left padding (50–100px). Hero is a centered-or-left-aligned display headline over the void, no hero image. Featured project is a single full-width photographic block followed by a 3-column project grid (3 tiles per row, equal width, equal gap). Footer is a 3-column text block (address / enquiries / social + tagline). Section rhythm is monolithic: 100–200px vertical breathing room between bands, separated by #292a2c hairlines. Navigation is a minimal two-item top bar, not a full menu — the page itself does the navigation work. No sidebar, no mega-menu, no sticky behavior implied. Overall density is sparse and editorial, not product-dense.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #020202
- border: #292a2c
- accent: #ffffff (white stroke only, no fill)
- muted text: #9b9b9b
- primary action: no distinct CTA color

**Example Component Prompts**
1. Create a hero headline: #020202 canvas. Display type in OPX-Medium (substitute: Söhne) weight 400, 111px, #ffffff, line-height 1.00, left-aligned with 100px left padding and 200px top padding.
2. Create a project card: full-bleed photograph at 0px radius filling the card width. 30px gap below, then OPX-Medium weight 400, 20px, #ffffff for the project title. 15px gap, then a pill 'View case study' button: 1px solid #ffffff border, transparent fill, 45px border-radius, 7px/15px padding, label in Untitled weight 500, 14px, #ffffff.
3. Create a section divider: 1px solid #292a2c hairline spanning 100% width, with 150px vertical padding above and below the rule.
4. Create a footer column: OPX-Medium weight 400, 20px, #ffffff column label. 20px gap, then 2–3 lines of OPX-Medium weight 400, 18px, #9b9b9b body text. Arrange in a 3-column grid with 50px column gutters.
5. Create a body paragraph: Open Sans (substitute: Source Sans 3) weight 400, 18px, #ffffff, line-height 1.67, on #020202 canvas, with 30px margin-bottom.

## Similar Brands

- **Pentagram** — Same editorial-agency monochrome dark mode, oversize display type as the only ornament, and photography-led project tiles with no card chrome
- **Resn** — Edge-to-edge full-bleed project photography on near-black canvas with minimal typographic navigation
- **Manual (manual.tv)** — Two-word navigation, monumental display type, and project-grid layout that lets the photography carry all the color
- **Locomotive (locomotive.ca)** — Dark agency homepage with custom single-weight display face, hairline dividers, and pill-outline CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #020202;
  --color-surface-black: #000000;
  --color-charcoal-hairline: #292a2c;
  --color-bone-white: #ffffff;
  --color-ash-gray: #9b9b9b;

  /* Typography — Font Families */
  --font-opx-medium: 'OPX-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-untitled: 'Untitled', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.67;
  --text-body: 18px;
  --leading-body: 1.67;
  --text-subheading: 20px;
  --leading-subheading: 1.67;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.42;
  --text-heading: 35px;
  --leading-heading: 1.4;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.38;
  --text-display: 80px;
  --leading-display: 1.07;
  --text-display-xl: 111px;
  --leading-display-xl: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-30: 30px;
  --spacing-50: 50px;
  --spacing-80: 80px;
  --spacing-99: 99px;
  --spacing-100: 100px;
  --spacing-150: 150px;
  --spacing-200: 200px;

  /* Layout */
  --section-gap: 100-200px;
  --element-gap: 30px;

  /* Border Radius */
  --radius-3xl: 45px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 45px;
  --radius-images: 0px;
  --radius-buttons: 45px;

  /* Surfaces */
  --surface-void-canvas: #020202;
  --surface-surface-black: #000000;
  --surface-hairline: #292a2c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #020202;
  --color-surface-black: #000000;
  --color-charcoal-hairline: #292a2c;
  --color-bone-white: #ffffff;
  --color-ash-gray: #9b9b9b;

  /* Typography */
  --font-opx-medium: 'OPX-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-untitled: 'Untitled', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.67;
  --text-body: 18px;
  --leading-body: 1.67;
  --text-subheading: 20px;
  --leading-subheading: 1.67;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.42;
  --text-heading: 35px;
  --leading-heading: 1.4;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.38;
  --text-display: 80px;
  --leading-display: 1.07;
  --text-display-xl: 111px;
  --leading-display-xl: 1;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-30: 30px;
  --spacing-50: 50px;
  --spacing-80: 80px;
  --spacing-99: 99px;
  --spacing-100: 100px;
  --spacing-150: 150px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-3xl: 45px;
}
```
