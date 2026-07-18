# PostNew — Style Reference
> After-hours gallery with daylight spreads

**Theme:** dark

PostNew operates as an after-hours gallery: a near-black canvas (#1a1a1a) acts as a quiet vitrine frame, while full-bleed editorial spreads detonate with color, photography, and bold display type when content opens. The system is ruthlessly achromatic on the structural layer — only five near-grayscale tokens carry the entire UI — and delegates all chromatic expression to the content itself. Typography is intentionally scarce: ABC Diatype Medium at two sizes for editorial moments, system sans at 12px for chrome. The feeling is curated rather than designed: a portfolio shell that disappears so the work can perform.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Black | `#1a1a1a` | `--color-canvas-black` | Page background, gallery vitrine, frame around content — a near-black not-quite-pure-black that lets imagery breathe without the harshness of #000 |
| Bone White | `#fafafa` | `--color-bone-white` | Primary text, nav labels, icon strokes, light surface fill — the only light token, reserved for foreground against Canvas Black |
| Slate Surface | `#242424` | `--color-slate-surface` | Elevated cards, button backgrounds, secondary surface panels — one step lighter than canvas to create depth without contrast drama |
| Ash | `#5d5d5d` | `--color-ash` | Muted UI elements, inactive dots, decorative fills — the 6.3:1 ratio against white keeps it legible but clearly secondary |
| Absolute Black | `#000000` | `--color-absolute-black` | Hairline borders, high-contrast text, deepest shadow line — used sparingly where maximum definition is needed against the canvas |

## Tokens — Typography

### ABC Diatype Medium — Editorial display and body — the only display face, used at just two sizes (18px / 22px) with -0.025em tracking. The single weight (500) is deliberate: no bold, no light. The OpenType features (blwf, cv03-cv11, ss09-ss10) activate specific character alternates that give it a subtly editorial personality. Substitute with Inter Tight Medium or Söhne Medium if ABC Diatype is unavailable. · `--font-abc-diatype-medium`
- **Substitute:** Inter Tight
- **Weights:** 500
- **Sizes:** 18px, 22px
- **Line height:** 1.13, 1.15
- **Letter spacing:** -0.45px at 18px, -0.55px at 22px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11", "ss09", "ss10"`
- **Role:** Editorial display and body — the only display face, used at just two sizes (18px / 22px) with -0.025em tracking. The single weight (500) is deliberate: no bold, no light. The OpenType features (blwf, cv03-cv11, ss09-ss10) activate specific character alternates that give it a subtly editorial personality. Substitute with Inter Tight Medium or Söhne Medium if ABC Diatype is unavailable.

### System Sans-Serif — UI chrome only — nav labels (Index, Feed, Profile), view toggle icons, scroll dots. At 12px it is intentionally small and quiet, the typographic equivalent of architectural labeling. Do not promote to editorial content. · `--font-system-sans-serif`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** UI chrome only — nav labels (Index, Feed, Profile), view toggle icons, scroll dots. At 12px it is intentionally small and quiet, the typographic equivalent of architectural labeling. Do not promote to editorial content.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 18px | 1.13 | -0.45px | `--text-body` |
| heading | 22px | 1.15 | -0.55px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 50 | 50px | `--spacing-50` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 50px
- **Card padding:** 12px
- **Element gap:** 10px

## Components

### Top Nav Bar
**Role:** Minimalist site navigation — three labels centered on a dark canvas

Centered horizontal row of three text links (Index, Feed, Profile). System sans-serif at 12px, #fafafa color, letter-spacing normal. 10px row-gap between items. No background, no border — floats on the canvas with no visual weight. Active state not visually distinct in the data; treat as ghost navigation.

### Scroll Position Indicator
**Role:** Vertical dot column tracking scroll progress

Thin vertical strip of 10-12 small dots positioned at the left edge of the viewport, ~120px from the left. 5px row-gap between dots. Filled dots in #5d5d5d, active dot in #fafafa. This is the only persistent left-side UI element.

### View Toggle
**Role:** Switch between grid and list layout modes for content

Bottom-center floating control with two icon buttons side by side. Slate Surface (#242424) background, 12px horizontal padding, 8px vertical padding. Icons in #fafafa at 12px. 13px gap between the two toggle buttons.

### Vitrine Frame
**Role:** Dark container that presents a single work or art object in isolation

Full-viewport or large-centered dark panel with #1a1a1a background, 0px radius (sharp edges), no border. The object sits centered within, surrounded by generous negative space. This is the 'gallery wall' component — it frames content with the discipline of a museum vitrine.

### Editorial Spread
**Role:** Full-bleed two-page-style layout combining imagery and bold type

Edge-to-edge layout with no padding from viewport edges. Left half: photography or 3D render bleeding off all sides. Right half: oversized display type overlapping the image, often in #000000 with chromatic abstract shapes layered on top. The type uses ABC Diatype Medium at 22px but visually appears much larger due to the 100vh scale. No border, no radius — the spread IS the page.

### Abstract Shape Decoration
**Role:** Sculptural 3D blob/bead elements that punctuate editorial spreads

Glossy 3D-rendered organic shapes in saturated colors (magenta, lime, blue, yellow, pink) placed over the spread. Not part of the design system palette — they belong to the content layer. When recreating, generate them as content, not as tokens.

### Ghost Button
**Role:** Secondary interactive element — minimal, no fill

12px horizontal padding, 8px vertical padding, 0px radius. Background #242424 (Slate Surface). Text in #fafafa at 12px system sans. No border, no shadow. Used for the view toggle and any low-emphasis interaction.

### Brand Mark Lockup
**Role:** Logo + product name combination for sponsored or featured content

Centered or right-aligned lockup: brand wordmark (e.g. NIKE) in bold black sans, with product line label (e.g. AIR MAX) below in tracked-out caps at 12px. Appears within editorial spreads as a content element, not as persistent UI.

## Do's and Don'ts

### Do
- Keep the canvas at #1a1a1a — do not shift to pure #000 or lighter grays; the near-black is the gallery floor.
- Use ABC Diatype Medium at 18px or 22px only — these are the only two editorial sizes. Never scale beyond or interpolate.
- Set letter-spacing to -0.025em on all ABC Diatype text — tighter tracking at this weight is signature.
- Keep all UI radius at 0px — sharp corners are non-negotiable; this is a gallery, not a friendly SaaS app.
- Reserve #fafafa for text and light surface elements against the dark canvas — never use it as a page background.
- Let imagery carry all color — the five neutrals are the entire UI palette; do not introduce brand color tokens.
- Maintain 10px element gaps and 50px section gaps — the compact gallery rhythm depends on tight clustering with deliberate breathing room.

### Don't
- Do not introduce saturated brand colors, accent hues, or semantic states (success/error/warning) — they break the achromatic gallery frame.
- Do not round corners on cards, buttons, images, or frames — 0px radius is structural to the system.
- Do not add shadows or elevation effects — depth comes from #1a1a1a → #242424 → #5d5d5d surface steps, not from box-shadows.
- Do not use more than two type sizes from ABC Diatype — 18px and 22px are the complete editorial scale.
- Do not use the system sans above 12px — it is chrome-only typography, not editorial.
- Do not center-align editorial body text — the design uses flush-left or full-bleed compositions, not centered paragraphs.
- Do not add gradients — the system is flat; any gradient breaks the gallery wall metaphor.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#1a1a1a` | Full-page background, the gallery floor |
| 1 | Slate Surface | `#242424` | Elevated panels, button fills, toggle backgrounds |
| 2 | Ash | `#5d5d5d` | Muted indicators, inactive dots, decorative fills |
| 3 | Bone White | `#fafafa` | Highest-contrast foreground — light text, active indicators, content surfaces |

## Elevation

No shadows are used. Depth is achieved purely through the four-step surface stack (#1a1a1a → #242424 → #5d5d5d → #fafafa), where each step increases luminance rather than adding cast shadow. This creates the flat, lit-from-within quality of a gallery wall under spotlights.

## Imagery

The site alternates between two visual registers: the dark gallery vitrine (centered 3D render or sculpture on #1a1a1a, often a single object in an alcove with dramatic lighting) and the full-bleed editorial spread (split-screen with raw product photography of sneakers/legs on one side, oversized bold display type with 3D blob decorations on the other). Photography is product-focused, high-saturation, lifestyle-adjacent. The 3D elements are glossy, candy-colored, organic blobs — playful counterpoint to the severe type. Images bleed to all four edges with no rounding, no borders, no padding. The site is image-dominant in the editorial sections and image-singular in the gallery sections.

## Layout

Full-bleed layout with no max-width constraint. The page oscillates between two section types: (1) the vitrine — a centered content block (roughly 400px wide for the niche image, or full-viewport for the sculpture) suspended in the dark canvas with generous negative space on all sides; (2) the editorial spread — edge-to-edge two-column compositions where imagery and type compete for the full viewport. Navigation is a single centered text bar at the top. A left-edge scroll indicator provides orientation. A bottom-center view toggle switches between grid and list modes. Vertical rhythm uses 50px section gaps. The overall grid is implicit — content defines its own structure rather than conforming to a column system.

## Agent Prompt Guide

**Quick Color Reference**
- text: #fafafa
- background: #1a1a1a
- border: #000000
- muted: #5d5d5d
- surface: #242424
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Create a top nav bar:* Three centered text links (Index, Feed, Profile) on #1a1a1a canvas. System sans-serif 12px, weight 400, color #fafafa, letter-spacing normal. 10px gap between items. No background, no border, no shadow.

2. *Create a gallery vitrine:* Centered dark panel, full-viewport height, #1a1a1a background. A single hero object (rendered as an img) centered horizontally, occupying ~400px wide. No border, no radius, no shadow. The object floats in the dark with no frame or label.

3. *Create an editorial spread:* Full-bleed split layout. Left half: product photograph bleeding to left and bottom edges. Right half: oversized headline in ABC Diatype Medium, 22px, color #000000, letter-spacing -0.55px, set tight and overlapping the left image. 3D blob decorations in saturated colors layered on top. No padding from viewport edges.

4. *Create a view toggle:* Bottom-center floating control. Two ghost icon buttons side by side. Background #242424, 12px horizontal padding, 8px vertical padding, 0px radius. Icons in #fafafa at 12px. 13px gap between buttons. No border, no shadow.

5. *Create a scroll indicator:* Left edge of viewport, vertically centered. Column of 10 small dots, 4px diameter each, 5px row-gap. Filled dots in #5d5d5d, one active dot in #fafafa. No background container.

## OpenType Feature Set

ABC Diatype Medium is activated with these OpenType features: "blwf", "cv03", "cv04", "cv09", "cv11", "ss09", "ss10". These toggle specific character alternates and stylistic sets that give the face its editorial personality. When substituting with Inter Tight, enable similar alternates if available, but accept that the character-level design language will shift. The features are non-negotiable for brand fidelity when using ABC Diatype itself.

## Similar Brands

- **Are.na** — Same dark-canvas + image-centric + minimal text-chrome philosophy; both treat the page as a curated wall rather than a structured app
- **Cargo Portfolio** — Full-bleed editorial spreads with bold display type, dark gallery frames, and zero border-radius on all content
- **Aether Films** — Near-identical dark vitrine approach — a single object or image centered on near-black with zero chrome
- **Bureau Cool** — Same editorial portfolio DNA: achromatic UI shell, all color lives inside the content, ABC Diatype as display face
- **Manual Creative** — Monochrome UI with maximalist editorial spreads; the structural restraint makes the content feel louder by contrast

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-black: #1a1a1a;
  --color-bone-white: #fafafa;
  --color-slate-surface: #242424;
  --color-ash: #5d5d5d;
  --color-absolute-black: #000000;

  /* Typography — Font Families */
  --font-abc-diatype-medium: 'ABC Diatype Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.13;
  --tracking-body: -0.45px;
  --text-heading: 22px;
  --leading-heading: 1.15;
  --tracking-heading: -0.55px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-50: 50px;

  /* Layout */
  --section-gap: 50px;
  --card-padding: 12px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #1a1a1a;
  --surface-slate-surface: #242424;
  --surface-ash: #5d5d5d;
  --surface-bone-white: #fafafa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-black: #1a1a1a;
  --color-bone-white: #fafafa;
  --color-slate-surface: #242424;
  --color-ash: #5d5d5d;
  --color-absolute-black: #000000;

  /* Typography */
  --font-abc-diatype-medium: 'ABC Diatype Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.13;
  --tracking-body: -0.45px;
  --text-heading: 22px;
  --leading-heading: 1.15;
  --tracking-heading: -0.55px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-50: 50px;
}
```
