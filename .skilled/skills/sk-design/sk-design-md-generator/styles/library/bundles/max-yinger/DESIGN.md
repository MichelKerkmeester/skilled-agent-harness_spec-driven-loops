# Max Yinger — Style Reference
> Midnight engineer's terminal with floating chrome artifacts. A single bone-white light source illuminates a dark workshop where text and 3D objects share the stage at maximum density.

**Theme:** dark

Yinger's personal site operates as a midnight engineer's terminal: a near-black canvas with warm bone-white type, a single hero 3D artifact floating in negative space, and text pushed aggressively to the edges of the viewport. The system is brutally compact — 4px gaps, 12px labels, 80px displays — creating a cockpit density where every pixel is load-bearing. Color is nearly absent: one warm off-white does all the work, with a whisper of pink-coral bleeding from the 3D rendering as the only chromatic punctuation. Typography is the personality: a chunky custom display face for the masthead and time, a monospaced technical face for telemetry-style labels, and a contrast face for readable prose.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Carbon | `#12130f` | `--color-midnight-carbon` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Bone Glow | `#e4dfda` | `--color-bone-glow` | Primary text, headings, button text, all body copy. Warm off-white used at every size from 12px telemetry to 80px displays. The only color that does real work |
| Charcoal Vein | `#3c3c38` | `--color-charcoal-vein` | Secondary borders, dividers, subdued UI chrome. Warm mid-gray that registers on the dark canvas without competing with bone-white text |
| Rose Quartz Bloom | `#f5c2c8` | `--color-rose-quartz-bloom` | Accent glow on 3D rendered objects, ambient lighting bleed from the hero artifact. Never used on UI chrome — appears only as the soft pink edge-light on cubes |

## Tokens — Typography

### Arbeit Technik — Telemetry and label text — timestamps, location, status indicators, small caps annotations. 12px only, monospaced, with aggressive -0.6px letter-spacing that makes each character feel stamped. The 'HUD font' for all meta-information. · `--font-arbeit-technik`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.25
- **Letter spacing:** -0.0500em
- **Role:** Telemetry and label text — timestamps, location, status indicators, small caps annotations. 12px only, monospaced, with aggressive -0.6px letter-spacing that makes each character feel stamped. The 'HUD font' for all meta-information.

### Inline VF — Hero display — the time readout and masthead block-letter wordmark. Ultra-condensed vertical metrics (0.70) compress the type into dense rectangular shapes. The signature voice: blocky, digital, unapologetic. · `--font-inline-vf`
- **Substitute:** Departure Mono, VT323
- **Weights:** 400
- **Sizes:** 80px
- **Line height:** 0.70
- **Role:** Hero display — the time readout and masthead block-letter wordmark. Ultra-condensed vertical metrics (0.70) compress the type into dense rectangular shapes. The signature voice: blocky, digital, unapologetic.

### Arbeit Contrast — Readable prose at 16px (body, links), section headings at 30px, and secondary display at 80px. Contrast cuts in the strokes give it authority at every size without increasing weight. The workhorse typeface. · `--font-arbeit-contrast`
- **Substitute:** Inter, Söhne, Untitled Sans
- **Weights:** 400
- **Sizes:** 16px, 30px, 80px
- **Line height:** 0.70, 1.13, 1.25
- **Role:** Readable prose at 16px (body, links), section headings at 30px, and secondary display at 80px. Contrast cuts in the strokes give it authority at every size without increasing weight. The workhorse typeface.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 15 | -0.6px | `--text-caption` |
| body | 16px | 20 | — | `--text-body` |
| subheading | 30px | 34 | — | `--text-subheading` |
| display | 80px | 56 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| links | 2px |
| buttons | 9999px |

### Layout

- **Section gap:** 64px
- **Card padding:** 12px
- **Element gap:** 4px

## Components

### Pill Link Button
**Role:** Social/external navigation buttons (Github, LinkedIn, Twitter/X, Email)

9999px border-radius (full pill). Transparent background with #e4dfda text. No border, no fill — ghost style. ~12px vertical padding, 16-20px horizontal padding. Text in Arbeit Technik at 12px, letter-spacing -0.6px. Sits flush against the edge of the viewport.

### Underlined Inline Link
**Role:** Inline links within body prose

2px border-radius (near-square). No background. Text inherits bone-white color with a 2px underline in #e4dfda. Arbeit Contrast 16px. The underline is the only interactive signifier — no color change on hover.

### Telemetry Label
**Role:** Status/section labels (LOCAL TIME, FORT COLLINS COLORADO, UI Engineer bio)

Arbeit Technik 12px, letter-spacing -0.6px, line-height 1.25, all-caps. Bone-white (#e4dfda). Sits at the top of content clusters like a HUD annotation.

### Digital Time Readout
**Role:** Hero time display showing local time

Inline VF at 80px, line-height 0.70, weight 400. Bone-white (#e4dfda). Paired with a smaller 'AM' suffix at ~30px. The most visually dominant element after the 3D hero — communicates 'live, real-time, running'.

### Masthead Wordmark
**Role:** Brand name in top-left corner

Inline VF or custom display face at ~30-40px, bone-white. Tight letter-spacing, blocky letterforms. Functions as a compact brand stamp, not a decorative logo.

### 3D Hero Artifact
**Role:** Central visual element — isometric rendered cubes

Isometric cube cluster rendered in #e4dfda with soft #f5c2c8 (Rose Quartz Bloom) edge-lighting. Floats centered in negative space, viewport-sized. No container, no border, no shadow — the geometry is the component.

### Cluster Card
**Role:** Tight content groupings (bio block, social links cluster)

No background, no border, no padding other than 4-8px gaps between lines. Content is a stack of labels and text. The card is defined by the 4px gap rhythm, not a visual container.

### Performance Annotation
**Role:** Small technical data callouts (resolution '1440 x 900', FPS '~1210 FPS')

Arbeit Technik 12px, bone-white, monospaced alignment with the time readout. Appears as inline-data tags adjacent to the main display — reads like engine telemetry.

## Do's and Don'ts

### Do
- Use #e4dfda for all text and #12130f for all backgrounds — the two-color system is the system.
- Use 9999px border-radius on all interactive elements (buttons, tags, status indicators).
- Use 2px border-radius on underlined inline links only.
- Set element gaps to 4px and card padding to 12px. Compactness is the aesthetic.
- Use Inline VF at 80px with line-height 0.70 for all hero-scale displays.
- Use Arbeit Technik at 12px with letter-spacing -0.6px for all labels and annotations.
- Push content to the viewport edges — top-left for brand, bottom-left for bio, bottom-right for socials, center for hero.

### Don't
- Don't introduce new accent colors. Rose Quartz Bloom exists only as 3D rendering bleed, never on UI chrome.
- Don't use box-shadows or drop-shadows. Depth comes from the 3D artifact, not from CSS elevation.
- Don't use line-height above 1.25 for any text size. The compressed vertical metrics are signature.
- Don't center content or add max-width containers. Full-bleed edge-to-edge layout only.
- Don't use borders on cards or content blocks. Spatial separation comes from 4-8px gaps alone.
- Don't introduce secondary weights (bold, semibold). Weight 400 at every size — contrast comes from typeface, not weight.
- Don't use pure white (#ffffff) or pure black (#000000). The warm off-white and warm carbon are the palette.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#12130f` | Full-bleed page background, all sections |
| 2 | Recessed | `#12130f` | Cards and content blocks sit flush with the canvas — no elevation differentiation, only spacing and border treatment separate regions |

## Elevation

Flat by design. No box-shadows, no drop-shadows, no blur effects. Depth is communicated exclusively through the 3D rendered hero artifact. The page surface is a single dark plane; all UI elements sit flush with zero elevation. The only visual depth signal is the 4-12px gap rhythm separating content clusters.

## Imagery

Single hero element: isometric 3D-rendered cube cluster floating in negative space, treated in bone-white with soft rose-pink edge-lighting. No photography, no illustration, no product screenshots. The 3D artifact IS the imagery — it occupies the visual center while all text clusters to the edges. Icons are absent; social links are text-only pill buttons. The visual language is one of restraint: a single rendered object, one warm light source, and everything else is type.

## Layout

Full-bleed edge-to-edge layout with no max-width container. Content is distributed to viewport corners: top-left holds the wordmark, bottom-left holds the time readout and bio cluster, bottom-right holds social pill links, and center holds the 3D hero artifact. Sections are not separated by visual dividers — they flow with 64px vertical padding between groups. Navigation is minimal: no traditional menu, just the four social pills and the wordmark functioning as home link. The grid is a corner-anchored z-pattern, not a centered column layout.

## Agent Prompt Guide

**Quick Color Reference**
- text: #e4dfda (Bone Glow)
- background: #12130f (Midnight Carbon)
- border: #3c3c38 (Charcoal Vein)
- accent: #f5c2c8 (Rose Quartz Bloom — 3D rendering only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a full-bleed dark hero: #12130f canvas. A centered 3D isometric cube cluster in #e4dfda with soft #f5c2c8 edge-lighting floats in the middle. A digital time display '10:40' in Inline VF (or Departure Mono substitute) at 80px, line-height 0.70, weight 400, #e4dfda, sits bottom-left.

2. Create a social link cluster (bottom-right): four pill buttons stacked vertically. Each: 9999px border-radius, transparent background, 12px 20px padding, text in Arbeit Technik (or JetBrains Mono substitute) at 12px, letter-spacing -0.6px, #e4dfda. Labels: Github, LinkedIn, Twitter / X, Email.

3. Create a bio block (bottom-left): a telemetry label 'UI Engineer who dips his toes in Realtime 3D' in Arbeit Contrast (or Inter substitute) at 16px, line-height 1.25, #e4dfda. Above it, a 12px all-caps label 'LOCAL TIME (UTC-6:00)' in Arbeit Technik. Below, a 12px location line 'FORT COLLINS, COLORADO — US OF A / DESIGN ENGINEER #CLNRK'. 4px gaps between lines.

4. Create a performance annotation: monospaced text in Arbeit Technik at 12px, #e4dfda, positioned inline adjacent to the time display. Content reads '1440 x 900' and '~1210 FPS' as small technical callouts.

5. Create a wordmark: 'YINGER' in Inline VF (or Departure Mono) at 30-40px, weight 400, #e4dfda, positioned top-left with 12px viewport padding. Blocky, compressed, functions as a brand stamp.

## Similar Brands

- **Bruno Simon** — Same dark-canvas 3D-hero-as-identity approach, single rendered artifact as visual centerpiece, minimal text pushed to viewport edges
- **Vercel Portfolio Templates** — Same full-bleed no-container layout, corner-anchored content distribution, and ulta-compact spacing
- **Active Theory** — Same dark terminal aesthetic with real-time 3D artifacts and monospaced telemetry-style labels
- **Robin Mastromarino** — Same bone-white-on-near-black monochrome palette with 3D rendered hero and compressed technical typography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-carbon: #12130f;
  --color-bone-glow: #e4dfda;
  --color-charcoal-vein: #3c3c38;
  --color-rose-quartz-bloom: #f5c2c8;

  /* Typography — Font Families */
  --font-arbeit-technik: 'Arbeit Technik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inline-vf: 'Inline VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arbeit-contrast: 'Arbeit Contrast', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 15;
  --tracking-caption: -0.6px;
  --text-body: 16px;
  --leading-body: 20;
  --text-subheading: 30px;
  --leading-subheading: 34;
  --text-display: 80px;
  --leading-display: 56;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-64: 64px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 12px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-links: 2px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #12130f;
  --surface-recessed: #12130f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-carbon: #12130f;
  --color-bone-glow: #e4dfda;
  --color-charcoal-vein: #3c3c38;
  --color-rose-quartz-bloom: #f5c2c8;

  /* Typography */
  --font-arbeit-technik: 'Arbeit Technik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inline-vf: 'Inline VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arbeit-contrast: 'Arbeit Contrast', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 15;
  --tracking-caption: -0.6px;
  --text-body: 16px;
  --leading-body: 20;
  --text-subheading: 30px;
  --leading-subheading: 34;
  --text-display: 80px;
  --leading-display: 56;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-full: 9999px;
}
```
