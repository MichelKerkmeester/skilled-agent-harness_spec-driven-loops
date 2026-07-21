# Wonder — Style Reference
> Neon violet command center — deep plum darkness pierced by a single laser-purple light source.

**Theme:** mixed

Wonder operates as a dark-first design cosmos: a near-black violet canvas (#0f0217) creates the immersive backdrop for the brand, punctuated by a single vivid violet accent (#d262ff) that makes actions feel switched on and a muted purple-gray (#44374a) that does the quiet structural work of every border and divider. The system alternates between full-bleed dark atmosphere sections and bright white content panels, creating rhythm through contrast rather than ornament. Typography is led by Uncut Sans Variable — geometric, wide-tracked at small sizes, tight-tracked at display sizes — paired with Martian Mono for all technical metadata, dimensions, and annotation. Surfaces are flat with hairline borders instead of heavy shadows; the few elevated cards use a barely-there 1px border and large radius (14px) to feel like floating glass plates rather than solid panels. Components are sparse and confident: pill-shaped badges, 8px-radius buttons in either filled violet or ghost outline, and very few decorative flourishes beyond a hand-drawn squiggle motif.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Plum | `#0f0217` | `--color-void-plum` | Page canvas and primary dark surface — the near-black violet base that absorbs the whole immersive hero and footer bands |
| Eclipse Black | `#0b0211` | `--color-eclipse-black` | Elevated card and panel surface — one shade deeper than the canvas, used for floating UI elements against the dark backdrop |
| Carbon Ink | `#111111` | `--color-carbon-ink` | Badge fills, icon stroke accents, and dark section surfaces on lighter contexts |
| Lavender Mist | `#44374a` | `--color-lavender-mist` | Dominant border and divider color across the entire system — every hairline, card edge, and UI outline uses this muted purple-gray |
| Ghost Violet | `#4b4151` | `--color-ghost-violet` | Muted helper text and low-priority iconography — the quietest of the violet-tinged grays |
| Ash Wisp | `#6f6774` | `--color-ash-wisp` | Secondary body text and metadata labels against the dark canvas |
| Silver Smoke | `#b7b3b9` | `--color-silver-smoke` | Tertiary text, inactive nav items, and icon fills at low emphasis |
| Moonstone | `#999999` | `--color-moonstone` | Mid-priority text, generic icon strokes, and light-section muted copy |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text on dark surfaces, light section backgrounds, and the brightest highlight color |
| Bone | `#f7f6f5` | `--color-bone` | Warm off-white for light content section backgrounds — subtly cream against the pure white of inner cards |
| Frost | `#f0f0f0` | `--color-frost` | Surface fill for nested elements and subtle dividers in light sections |
| Laser Violet | `#d262ff` | `--color-laser-violet` | Primary action button fill, focus rings, and the brand's signature accent — vivid electric purple against the dark void creates urgency without aggression |
| Royal Plum | `#6a1791` | `--color-royal-plum` | Decorative stroke accent for gradient mesh backgrounds and atmospheric purple lighting |
| Merlot Shadow | `#2d063a` | `--color-merlot-shadow` | Deep heading color and surface tint for accent cards in light sections |
| Mulberry Deep | `#180321` | `--color-mulberry-deep` | Dark section heading color and dramatic text accent in light-mode areas |
| Coral Spark | `#d97757` | `--color-coral-spark` | Warm secondary accent for highlights, callout dots, and emphasis on light surfaces |

## Tokens — Typography

### Uncut Sans Variable — Primary brand typeface — geometric sans with wide optical width, used for all display headlines, body copy, nav, buttons, and card content. The tight negative letter-spacing at large sizes (-0.05em at 50px = -2.5px) gives display text a confident, compressed feel; the positive 0.08em at small caps creates wide-tracked eyebrow labels. · `--font-uncut-sans-variable`
- **Substitute:** Inter Variable, Geist, Satoshi
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 15px, 16px, 18px, 24px, 38px, 50px
- **Line height:** 1.10–1.56 (varies by size)
- **Letter spacing:** 50px: -2.5px (-0.05em) | 38px: -1.9px (-0.05em) | 24px: -0.96px (-0.04em) | 18px: -0.45px (-0.025em) | 16px: -0.4px (-0.025em) | 14–15px: -0.21 to -0.225px (-0.015em)
- **OpenType features:** `"ss01" on (if available), "cv11" on (alternate single-storey 'a')`
- **Role:** Primary brand typeface — geometric sans with wide optical width, used for all display headlines, body copy, nav, buttons, and card content. The tight negative letter-spacing at large sizes (-0.05em at 50px = -2.5px) gives display text a confident, compressed feel; the positive 0.08em at small caps creates wide-tracked eyebrow labels.

### Martian Mono — Technical metadata and dimensional annotations — dimension labels, coordinates, file names, and small UI labels that benefit from a monospaced signature. The 0.05em positive tracking gives it a delicate, architect-blueprint quality. · `--font-martian-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Geist Mono
- **Weights:** 400
- **Sizes:** 10px, 11px, 12px
- **Line height:** 1.50–1.63
- **Letter spacing:** 0.5–0.6px (0.05em) at all sizes
- **Role:** Technical metadata and dimensional annotations — dimension labels, coordinates, file names, and small UI labels that benefit from a monospaced signature. The 0.05em positive tracking gives it a delicate, architect-blueprint quality.

### Inter — Secondary system font used in tertiary UI elements, icons-adjacent labels, and fallback roles where Uncut Sans is not needed. Covers the smallest sizes (8–12px) with clean legibility. · `--font-inter`
- **Substitute:** System UI sans, Inter Variable
- **Weights:** 400, 500, 600, 700
- **Sizes:** 8px, 10px, 11px, 12px, 14px, 15px, 16px, 24px, 28px
- **Line height:** 1.20–1.63
- **Letter spacing:** -0.0400em, -0.0250em, -0.0150em, 0.0500em
- **Role:** Secondary system font used in tertiary UI elements, icons-adjacent labels, and fallback roles where Uncut Sans is not needed. Covers the smallest sizes (8–12px) with clean legibility.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.5px | `--text-caption` |
| body | 14px | 1.43 | -0.21px | `--text-body` |
| heading-sm | 24px | 1.33 | -0.96px | `--text-heading-sm` |
| heading | 38px | 1.1 | -1.9px | `--text-heading` |
| display | 50px | 1.12 | -2.5px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| badges | 9999px |
| images | 4px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `oklab(0 0 0 / 0.03) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `oklab(0 0 0 / 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-subtle-2` |
| subtle-3 | `oklab(0 0 0 / 0.08) 0px 0px 0px 1px` | `--shadow-subtle-3` |
| subtle-4 | `lab(60.9935 37.0253 35.2355 / 0.2) 0px 0px 0px 1px, rgba(...` | `--shadow-subtle-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Primary CTA Button
**Role:** Filled laser-violet action button — the system's only bold chromatic element

Filled background #d262ff, white text, Uncut Sans Variable 14px weight 500, 8px border-radius, padding 10px 20px. No border, no shadow. The vivid violet against the dark void creates immediate focal weight. Hover state: slight brightness increase or outer glow in #d262ff at 20% opacity.

### Ghost Navigation Button
**Role:** Secondary nav action — 'Open app' style button in the top bar

Transparent background, 1px border in #44374a, white text, Uncut Sans Variable 14px weight 500, 8px border-radius, padding 8px 16px. Reads as a quiet outline on the dark canvas.

### Text Link Button
**Role:** Low-emphasis nav link — 'Careers' style text-only action

No background, no border, white text at full opacity or #b7b3b9 at rest, Uncut Sans Variable 14px weight 400. Hover shifts to #d262ff to signal the brand accent.

### Pill Badge
**Role:** Status indicator, feature label, or attribution mark — 'Featured on Product Hunt' style

Fully rounded (9999px radius), dark background (#111111 or #0b0211), white or #b7b3b9 text, Inter or Martian Mono 10–12px, padding 4px 12px, 1px border in #44374a for definition against dark surfaces.

### Eyebrow Label
**Role:** Wide-tracked section label — 'Features', 'PROUDLY SUPPORTED BY' style

Uncut Sans Variable 12–14px weight 500, letter-spacing 0.08em (1.12–1.6px positive), color #d262ff for accents or #6f6774 for neutral eyebrows. The positive tracking at small sizes is a signature device.

### Product Card
**Role:** Floating UI showcase panel — the device mockups and file-tree panels seen in screenshots

14px border-radius, background #0b0211 or #ffffff depending on section, 1px border in #44374a (dark) or #e1e4e8 (light), no heavy shadow — a 1px hairline border and large radius create the floating-glass effect. Internal padding 12–16px. The 'Art App' chat panel is a variant with white background and the same 14px radius.

### Feature Card
**Role:** Three-column feature explanation card in light sections

Transparent or #ffffff background, no border, generous padding (24px), heading in Mulberry Deep (#180321) at 18px weight 500, body in #737373 at 14px. Spacing relies on whitespace, not containers.

### Dimension Annotation Tag
**Role:** Monospaced measurement label — '448 × 144' style coordinate indicator

Martian Mono 10–12px weight 400, letter-spacing 0.05em, centered text in a small dark pill (#111111 background, #b7b3b9 or white text, 9999px radius, 2px 8px padding). Sits with selection bounding boxes to convey precision.

### File Tree Row
**Role:** Sidebar navigation item in the design tool UI

Transparent background, 4px rowGap between items, Uncut Sans Variable 12–14px weight 400 in #b7b3b9 (inactive) or #ffffff (active). Folders shown with caret chevron in #999999. No hover background — purely text-based.

### Investor/Partner Logo Strip
**Role:** Horizontal logo wall for the 'PROUDLY SUPPORTED BY' section

Evenly spaced logos in a single row on the dark canvas, each rendered in white or #b7b3b9 at uniform height (~24px), gap 64–80px between logos. No container card — logos float directly on #0f0217.

### Gradient Mesh Backdrop
**Role:** Atmospheric purple lighting behind product showcases

Full-width section background using a multi-stop linear or radial gradient from #6a1791 through #d262ff at low opacity, fading into the void canvas. Diagonal light rays create the impression of a spotlight from above. No defined edges — bleeds into the page.

### Decorative Squiggle
**Role:** Hand-drawn pen-tool accent — the small pen icon and colorful blob illustration

Thin-line illustration in #111111 or #d262ff, no fill, 1.5–2px stroke. Used as informal decoration to break the geometric rigidity of the design tool context.

## Do's and Don'ts

### Do
- Use #d262ff as the only chromatic accent — never introduce additional saturated colors for UI elements
- Set all borders to 1px in #44374a on dark surfaces; use #e1e4e8 on light surfaces
- Apply 14px radius to all card-level surfaces and 8px radius to all interactive elements (buttons, inputs)
- Use Uncut Sans Variable at -0.05em letter-spacing for any display text 38px or larger
- Apply +0.08em positive letter-spacing to all eyebrow labels and small caps at 12–14px
- Pair every dimension label, coordinate, or file path with Martian Mono at 0.05em tracking
- Maintain 64px+ vertical rhythm between major sections to preserve the spacious, architectural feeling

### Don't
- Do not use heavy drop shadows — the 1px border system in #44374a is the elevation language
- Do not use 9999px radius on anything except badges and pill-shaped indicators
- Do not use #000000 pure black as a background — always use the violet-tinted #0f0217 to stay on-brand
- Do not apply Inter as a display headline — it is the secondary system font only
- Do not use letter-spacing values outside the established set: -0.05em, -0.04em, -0.025em, -0.015em, 0.05em, 0.08em
- Do not introduce additional accent colors beyond #d262ff, #6a1791, and #d97757 — the system is violet-only
- Do not stack cards on cards — the flat 1px border system requires open space, not nested surfaces

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Plum Canvas | `#0f0217` | Primary page background for dark sections — hero, footer, immersive bands |
| 1 | Eclipse Card | `#0b0211` | Elevated cards and floating panels sitting on the void canvas |
| 2 | Carbon Pill | `#111111` | Badge fills, nested UI elements, and the darkest micro-surface for icons |
| 3 | Bone Light Section | `#f7f6f5` | Light content section background — the warm off-white that breaks dark immersion |
| 4 | Paper Pure | `#ffffff` | Innermost card and surface for maximum contrast within light sections |

## Elevation

- **Product Card (light section):** `oklab(0 0 0 / 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`
- **Accent Card (violet-tinted):** `lab(60.99 37.03 -35.24 / 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`
- **Image Frame:** `oklab(0 0 0 / 0.03) 0px 0px 0px 1px`

## Imagery

Product screenshots dominate the visual language: realistic mockups of the design tool's own UI (file trees, canvas, chat panels, mobile device frames) presented as hero content rather than abstract illustration. A diagonal gradient mesh backdrop (violet to deep purple) creates atmospheric depth behind the product showcase. Hand-drawn squiggle decorations — a pen tool icon and a colorful organic blob — break the geometric precision of the rest of the system. No lifestyle photography, no stock imagery; the tool IS the visual content. Iconography is thin-stroke, mono-color, primarily in #999999 or #ffffff.

## Layout

Full-bleed dark hero section with centered headline stack, followed by a full-bleed gradient-mesh product showcase band (dark to light transition), then a light content section with left-aligned headline and right-aligned body text. The page uses a max-width of 1200px for contained content within full-bleed sections. Section rhythm alternates: dark void → light bone (#f7f6f5) → light bone with cards. The hero pattern is a centered headline over the void canvas with a single CTA below — no split-screen, no background video. Navigation is a minimal top bar with logo left, two actions right, and a thin 1px bottom border in #44374a. Content density is comfortable — generous vertical breathing room (64px+ section gaps) rather than information-packed blocks.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #ffffff
- text (secondary): #6f6774
- text (muted): #b7b3b9 / #999999
- background (dark): #0f0217
- background (light): #f7f6f5
- border: #44374a (dark) / #e1e4e8 (light)
- accent: #d262ff
- primary action: #d262ff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #d262ff background, #040106 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Product showcase card panel**: White (#ffffff) background, 14px border-radius, 1px border in #e1e4e8, padding 16px. Contains a simulated file tree sidebar (Uncut Sans Variable 12px weight 400 in #999999 for items, #111111 for active) and device mockup frames at 4px radius. Optional dimension annotation tag: Martian Mono 10px, letter-spacing 0.5px, white text on #111111 pill at 9999px radius.

3. **Light feature section**: Background #f7f6f5. Three-column grid, 1200px max-width, 24px gap. Each card has transparent background, heading at 18px Uncut Sans Variable weight 500 in #180321, body at 14px in #737373, line-height 1.5. No borders, no shadows — whitespace defines separation.

4. **Investor/partner logo strip**: Dark band on #0f0217, centered single row of 4 logos, 80px gap between, each logo at 24px height in #b7b3b9. Above: eyebrow label 'PROUDLY SUPPORTED BY' in Uncut Sans Variable 12px weight 500, letter-spacing 1.6px, color #6f6774.

5. **Decorative squiggle accent**: Thin-line illustration in #111111 on light sections or #d262ff on dark sections, 2px stroke, no fill, approximately 40–60px in size. Positioned as informal decoration near feature cards.

## Dark/Light Section Alternation

The page is structurally divided into dark immersive bands and light content bands. Dark bands (hero, gradient mesh, footer) use #0f0217 canvas with white text and #d262ff accents. Light bands (features, product detail) use #f7f6f5 or #ffffff canvas with #180321 or #111111 text. Never mix the two within a single section — the transition between dark and light is a deliberate structural device that creates rhythm and breathing room. The gradient mesh product showcase band acts as the bridge between dark and light, with a diagonal light ray fading from upper-left violet to lower-right transparency.

## Similar Brands

- **Linear** — Same dark-first void canvas with a single vivid accent color doing the work of every action — Linear uses indigo, Wonder uses violet, but both achieve the same one-accent-does-everything discipline
- **Vercel** — Identical hairline-border-over-shadow elevation philosophy and the same monospaced font paired with a geometric sans for technical annotations
- **Framer** — Same dark immersive hero with centered display headline and single CTA, transitioning to a light product showcase band with realistic UI mockups as primary visual content
- **Raycast** — Same Martian Mono / geometric sans pairing for technical UI labels, and the same pill-badge system at 9999px radius for status indicators

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-plum: #0f0217;
  --color-eclipse-black: #0b0211;
  --color-carbon-ink: #111111;
  --color-lavender-mist: #44374a;
  --color-ghost-violet: #4b4151;
  --color-ash-wisp: #6f6774;
  --color-silver-smoke: #b7b3b9;
  --color-moonstone: #999999;
  --color-paper-white: #ffffff;
  --color-bone: #f7f6f5;
  --color-frost: #f0f0f0;
  --color-laser-violet: #d262ff;
  --color-royal-plum: #6a1791;
  --color-merlot-shadow: #2d063a;
  --color-mulberry-deep: #180321;
  --color-coral-spark: #d97757;

  /* Typography — Font Families */
  --font-uncut-sans-variable: 'Uncut Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martian-mono: 'Martian Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -0.21px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.96px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -1.9px;
  --text-display: 50px;
  --leading-display: 1.12;
  --tracking-display: -2.5px;

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
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-badges: 9999px;
  --radius-images: 4px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: oklab(0 0 0 / 0.03) 0px 0px 0px 1px;
  --shadow-subtle-2: oklab(0 0 0 / 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-3: oklab(0 0 0 / 0.08) 0px 0px 0px 1px;
  --shadow-subtle-4: lab(60.9935 37.0253 35.2355 / 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;

  /* Surfaces */
  --surface-void-plum-canvas: #0f0217;
  --surface-eclipse-card: #0b0211;
  --surface-carbon-pill: #111111;
  --surface-bone-light-section: #f7f6f5;
  --surface-paper-pure: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-plum: #0f0217;
  --color-eclipse-black: #0b0211;
  --color-carbon-ink: #111111;
  --color-lavender-mist: #44374a;
  --color-ghost-violet: #4b4151;
  --color-ash-wisp: #6f6774;
  --color-silver-smoke: #b7b3b9;
  --color-moonstone: #999999;
  --color-paper-white: #ffffff;
  --color-bone: #f7f6f5;
  --color-frost: #f0f0f0;
  --color-laser-violet: #d262ff;
  --color-royal-plum: #6a1791;
  --color-merlot-shadow: #2d063a;
  --color-mulberry-deep: #180321;
  --color-coral-spark: #d97757;

  /* Typography */
  --font-uncut-sans-variable: 'Uncut Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martian-mono: 'Martian Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -0.21px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.96px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -1.9px;
  --text-display: 50px;
  --leading-display: 1.12;
  --tracking-display: -2.5px;

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
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: oklab(0 0 0 / 0.03) 0px 0px 0px 1px;
  --shadow-subtle-2: oklab(0 0 0 / 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-3: oklab(0 0 0 / 0.08) 0px 0px 0px 1px;
  --shadow-subtle-4: lab(60.9935 37.0253 35.2355 / 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
}
```
