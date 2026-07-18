# KeepGrading — Style Reference
> Polaroids scattered in a darkroom

**Theme:** dark

KeepGrading is a black-room editorial portfolio: a near-total monochrome canvas where photographs float as scattered frames in deep void. The UI is deliberately quiet so imagery does the talking — only the Cabinet Grotesk display type, white hairline borders, and one pill-shaped ghost control surface as interface elements. No chromatic accents, no gradients, no shadows; the entire visual hierarchy is carried by contrast, scale, and whitespace between photographs. Density is comfortable but vertical rhythm is loose, with 48px breathing room between bands and frames held in place by a single 1px white border. Components are skeletal — a circular nav toggle, a wordmark logo, floating image cards with soft 160px corners, and pill buttons with 9999px radius — letting the photography dominate the experience.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Studio White | `#f8f8f8` | `--color-studio-white` | Primary text, ghost-button borders, image-frame outlines, nav icon strokes — the single light voice in a dark room |
| Void Black | `#080808` | `--color-void-black` | Page canvas, behind-everything background, image frame fills between photographs |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills, deepest surface layer for inline graphics and decorative marks |
| Bone White | `#f0f0f0` | `--color-bone-white` | Soft secondary text and supporting hairline strokes when pure white feels too clinical |
| Pewter Border | `#2a2a2a` | `--color-pewter-border` | Low-contrast dividers and inactive frame edges that recede against the void |

## Tokens — Typography

### Cabinet Grotesk — Brand display and logo wordmark — the 96px headline weight 400 is anti-convention; no bold, no display tricks, just a single weight carried to monumental size that feels confident through restraint. Also used at 24px for short subheadings and 16px for nav labels. This custom typeface carries the entire brand identity. · `--font-cabinet-grotesk`
- **Substitute:** General Sans, Migra, Söhne
- **Weights:** 400
- **Sizes:** 16px, 20px, 24px, 96px
- **Line height:** 1.0–1.5
- **Role:** Brand display and logo wordmark — the 96px headline weight 400 is anti-convention; no bold, no display tricks, just a single weight carried to monumental size that feels confident through restraint. Also used at 24px for short subheadings and 16px for nav labels. This custom typeface carries the entire brand identity.

### Inter — Body text and supporting copy at 16px and 20px, both at weight 400 — no bold variant in use, the system keeps a single weight even for emphasis, letting size and color do the hierarchy work · `--font-inter`
- **Substitute:** system-ui, -apple-system, Helvetica Neue
- **Weights:** 400
- **Sizes:** 16px, 20px
- **Line height:** 1.4–1.5
- **Role:** Body text and supporting copy at 16px and 20px, both at weight 400 — no bold variant in use, the system keeps a single weight even for emphasis, letting size and color do the hierarchy work

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-lg | 24px | 1.33 | — | `--text-heading-lg` |
| display | 96px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| cards | 160px |
| buttons | 9999px |

### Layout

- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 15px

## Components

### Ghost Pill Button
**Role:** Primary navigation/action control

Outlined pill with 1px solid #f8f8f8 border, 9999px border-radius, transparent fill revealing the dark canvas behind. Label in Inter 16px weight 400, #f8f8f8. Internal padding 12px 24px. Trailing arrow icon in #f8f8f8 stroke 1px. No fill state, no hover glow — the button communicates interactivity purely through its outline.

### Circular Nav Toggle
**Role:** Menu trigger in top-right corner

160px diameter circle with 1px solid #f8f8f8 border, transparent fill. Centered minus or hamburger glyph in #f8f8f8 at 1px stroke. Sits flush with the canvas edge with no background or shadow.

### Wordmark Logo
**Role:** Brand identity in top-left

‘KEEPGRADING’ set in Cabinet Grotesk 96px / 1.0 line-height, weight 400, #f8f8f8. Tight horizontal kerning; the wordmark may visually crop or extend past the viewport edge to create editorial tension. No tagline, no symbol — type alone carries the brand.

### Floating Image Frame
**Role:** Photo card scattered across the canvas

Photograph wrapped in 1px solid #f8f8f8 border, border-radius 160px (very soft corners, not quite a circle). No fill, no shadow, no padding — the image sits directly inside the border edge. Multiple frames positioned at varying offsets and sizes across the viewport; the scattered placement is the layout pattern, not a grid.

### Canvas Layer
**Role:** Base surface for the entire page

Solid #080808 fill covering the full viewport. No texture, no gradient, no noise. All other elements — text, frames, controls — float on this surface with 48px vertical breathing room between bands.

### Section Spacer
**Role:** Vertical rhythm between content bands

Empty 48px vertical gap in #080808 canvas between content clusters. No visible divider line; separation is achieved through whitespace alone, maintaining the dark-room atmosphere.

### Nav Label
**Role:** Secondary navigation text

Cabinet Grotesk 16px weight 400, #f8f8f8, paired with the circular nav toggle. All-caps treatment with generous letter-spacing for editorial pacing.

## Do's and Don'ts

### Do
- Use #f8f8f8 for all text, borders, and icon strokes on the #080808 canvas — never introduce a chromatic accent for emphasis.
- Set display headlines in Cabinet Grotesk 96px weight 400, line-height 1.0; the single weight at monumental size is the signature.
- Use 9999px border-radius for all buttons, tags, and the nav toggle to maintain the pill/circle-only shape vocabulary.
- Use 160px border-radius for image frames to keep corners soft but distinct from the fully pill-shaped controls.
- Maintain 48px minimum vertical gap between content bands; let whitespace separate sections rather than dividers or shadows.
- Keep all UI chrome at weight 400 across both Cabinet Grotesk and Inter; hierarchy comes from size, not weight.
- Position image frames as scattered floating elements with varying offsets and sizes rather than aligning them to a strict grid.

### Don't
- Do not introduce any chromatic brand color, accent, or gradient — the monochrome void is the brand.
- Do not add drop shadows, glows, or any elevation effects — depth comes from layering and contrast alone.
- Do not use bold (600+) or semibold weights for emphasis; switch size or color instead.
- Do not use sharp corners (0–8px radius) on any visible element — all surfaces must be pill-rounded or softly curved.
- Do not apply background fills to buttons; the ghost outlined style is the only button treatment.
- Do not constrain the page to a max-width column; the full-bleed black canvas is essential to the darkroom feel.
- Do not add icons, badges, or decorative graphics to the UI chrome — type, borders, and photographs are the only visual elements.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#080808` | Full-bleed page background; the base layer everything floats on |
| 1 | Deep Surface | `#061c32` | Rarely surfaced dark-navy panel for content that needs slight lift from the void (detected in contrast pairs) |
| 2 | Mid Surface | `#1d2d44` | Elevated card or modal surface for layered content blocks |

## Elevation

No shadows. No glows. No drop-shadow effects on any element. Depth and separation are achieved exclusively through 1px #f8f8f8 borders, vertical whitespace (48px gaps), and z-ordering of scattered image frames. The darkroom metaphor demands that nothing cast a shadow — the void is flat and infinite.

## Imagery

Photography is the primary visual content. Large full-color photographs of people, vehicles, and lifestyle scenes are presented as floating frames scattered across a black canvas at varying scales and positions. Treatment is documentary/candid rather than staged commercial — poolside social moments, a blue sedan on a coastal road, interior lifestyle scenes. Frames are tightly cropped with 1px white borders and 160px corner radius; no captions or text overlays on the images themselves. The layout reads as a photo-editorial spread rather than a product gallery — images are positioned off-grid, partially overlapping the viewport edges, and at different sizes to create visual rhythm across the page.

## Layout

Full-bleed dark canvas with no max-width constraint; content extends to viewport edges. The hero is the page itself — there is no centered headline or CTA block. Instead, a large wordmark logo sits in the top-left corner (potentially cropping past the viewport), a circular nav toggle in the top-right, and the rest of the viewport is populated by scattered image frames at varying positions and sizes. A single ghost pill button (‘Show me more’) appears centered in the lower portion. Navigation is minimal — a top bar with logo and hamburger only, no horizontal menu. Content flows as a vertical scroll through more scattered image clusters separated by 48px gaps. There is no traditional section structure; the page reads as one continuous darkroom surface with photographs pinned to it at editorial offsets.

## Agent Prompt Guide

Quick Color Reference:
- text: #f8f8f8
- background: #080808
- border: #f8f8f8 (1px)
- muted border: #2a2a2a
- accent: none (monochrome system)
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a hero section: full-bleed #080808 canvas. Top-left wordmark ‘KEEPGRADING’ in Cabinet Grotesk 96px weight 400, #f8f8f8, line-height 1.0, allowed to crop at viewport edge. Top-right circular nav button: 160px diameter, 1px solid #f8f8f8 border, transparent fill, centered hamburger glyph in #f8f8f8 1px stroke.
2. Create a floating image card: photograph with 1px solid #f8f8f8 border, border-radius 160px, no fill, no shadow, no padding — image fills the frame edge to edge. Position at non-grid offset on the canvas.
3. Create a ghost pill button: transparent background, 1px solid #f8f8f8 border, 9999px border-radius, padding 12px 24px. Label in Inter 16px weight 400 #f8f8f8, followed by a right-arrow stroke icon in #f8f8f8 1px.
4. Create a scattered photo grid: 3–5 image frames at varying sizes (300px–600px wide), positioned with editorial offsets (not aligned to a grid), separated by at least 48px vertical gap, each with 160px corner radius and 1px #f8f8f8 border, on #080808 canvas.
5. Create a section spacer: 48px tall empty #080808 band between content clusters, no visible divider line, no shadow.

## Similar Brands

- **Vincent Moschetti portfolio sites** — Same darkroom full-bleed canvas with scattered image frames and minimal monochrome type treatment
- **Studio Bruch** — Editorial photo-first layout with floating frames on black void and single-weight display typography
- **Forma editorial** — Large-scale custom display type on near-black canvas with photography as the only chromatic content
- **Pentagram case studies** — Wordmark-dominant top-left branding with circular nav toggle and minimal chrome around showcased work
- **Locomotive Mtl** — Full-bleed dark surfaces with scattered editorial imagery and ghost pill controls

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-studio-white: #f8f8f8;
  --color-void-black: #080808;
  --color-pure-black: #000000;
  --color-bone-white: #f0f0f0;
  --color-pewter-border: #2a2a2a;

  /* Typography — Font Families */
  --font-cabinet-grotesk: 'Cabinet Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.33;
  --text-display: 96px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-24: 24px;
  --spacing-48: 48px;

  /* Layout */
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-full: 160px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-cards: 160px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-void-canvas: #080808;
  --surface-deep-surface: #061c32;
  --surface-mid-surface: #1d2d44;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-studio-white: #f8f8f8;
  --color-void-black: #080808;
  --color-pure-black: #000000;
  --color-bone-white: #f0f0f0;
  --color-pewter-border: #2a2a2a;

  /* Typography */
  --font-cabinet-grotesk: 'Cabinet Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.33;
  --text-display: 96px;
  --leading-display: 1;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-24: 24px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-full: 160px;
  --radius-full-2: 9999px;
}
```
