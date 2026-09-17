# Figma — Style Reference
> monochrome chassis for chromatic chaos

**Theme:** light

The interface operates as a strict, high-contrast structural container that entirely defers visual dominance to user-generated content. A stark #000000 on #ffffff palette forms the baseline, eschewing subtle grays in favor of absolute maximum contrast for primary boundaries and text. Typographic hierarchy relies almost purely on size and aggressive negative tracking rather than color variation, turning large text strings into dense graphical blocks. The border-radius logic enforces a severe dichotomy: 50px extreme pills for global navigation elements clashing intentionally against completely sharp 0px corners on content containers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Absolute Canvas | `#ffffff` | `--color-absolute-canvas` | Page background, floating toolbars, elevated panel bases |
| Structural Ink | `#000000` | `--color-structural-ink` | Primary typography, global solid button backgrounds, outlined button strokes |
| Graphite Metadata | `#595959` | `--color-graphite-metadata` | Secondary author text, localized component subtext, placeholder values |
| Boundary Frame | `#e2e2e2` | `--color-boundary-frame` | Subtle hair-line dividers and inactive input field bounds |
| Context Action Violet | `#4d49fc` | `--color-context-action-violet` | Localized primary CTA within utility panels—a singular interruptive color defining the focal execution point |
| Angular Teal | `conic-gradient(rgb(51, 223, 223) 0deg, rgb(51, 223, 223) 18deg, rgba(0, 0, 0, 0) 18deg, rgba(0, 0, 0, 0) 30deg)` | `--color-angular-teal` | Decorative sweeps, loading indicators, and active cursor visuals |

## Tokens — Typography

### figmaSans — Universal workhorse driving everything from display headers to navigational labels. Defines personality through varying optical negative tracking. · `--font-figmasans`
- **Substitute:** Inter
- **Weights:** 320, 330, 340, 400, 450, 480, 520, 700
- **Sizes:** 16px, 18px, 24px, 56px, 72px
- **Line height:** 1.00 - 1.45
- **Letter spacing:** -0.0200em, -0.0150em, -0.0100em, -0.0090em, -0.0080em, -0.0070em, -0.0050em
- **OpenType features:** `"kern"`
- **Role:** Universal workhorse driving everything from display headers to navigational labels. Defines personality through varying optical negative tracking.

### figmaMono — Micro-labels, coordinate tracking, and technical subtext functioning as UI chrome rather than content. · `--font-figmamono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.00, 1.30
- **Letter spacing:** 0.0300em, 0.0500em
- **OpenType features:** `"kern"`
- **Role:** Micro-labels, coordinate tracking, and technical subtext functioning as UI chrome rather than content.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | 0.36px | `--text-caption` |
| body-sm | 16px | 1.4 | -0.08px | `--text-body-sm` |
| body | 18px | 1.4 | -0.13px | `--text-body` |
| subheading | 24px | 1.3 | -0.24px | `--text-subheading` |
| heading | 56px | 1.1 | -0.5px | `--text-heading` |
| display | 72px | 1 | -1.44px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| contentCards | 0px |
| floatingPanels | 16px |
| globalNavButtons | 50px |
| contextualButtons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 24px 70px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 96-120px
- **Card padding:** 16px
- **Element gap:** 24px

## Components

### Global Action Pill
**Role:** Page-level CTA and authentication boundaries

backgroundColor #000000, color #ffffff, extreme borderRadius 50px, padding 8px 18px. Typographically set in 16px weight 480.

### Navigation Utility Pill
**Role:** Secondary global actions structurally matched to primary pill

Transparent background with a 1.5px solid #000000 border, text #000000. borderRadius 50px, padding 8px 18px.

### Prompt Input Panel
**Role:** The central elevated workspace orchestrator

backgroundColor #ffffff, borderRadius 16px. Padding 16px all around, defined by an aggressive standalone shadow: rgba(0,0,0,0.1) 0px 24px 70px 0px.

### Panel Execution CTA
**Role:** The localized trigger within a Prompt Input Panel

backgroundColor #4d49fc, color #ffffff. Notably distinct borderRadius of 8px (differentiating it from 50px global pills), padding 8px 16px.

### Community Artifact Card
**Role:** Container framework for raw user-generated output

Strict 0px borderRadius grid cell. Image spans 100% full width to bleed at the top, bottom metadata stack uses 12px vertical gaps and no horizontal bounding padding against the grid frame.

## Do's and Don'ts

### Do
- Enforce absolute #000000 for primary typography matrices—rely on weight and harsh negative tracking (-1.44px at display sizes) for hierarchy instead of greys.
- Pair the 50px pill paradigm explicitly and exclusively with global navbar / page-level navigation elements.
- Maintain raw 0px corners on community and gallery containers to strip away UI artifacts from structural content layouts.
- Use #4d49fc strictly as an inner-panel interruptive signal, never for global headers or marketing backgrounds.
- Limit drop shadows strictly to workspace/prompt panels that float structurally above the canvas; do not apply baseline shadows to grid items.

### Don't
- Do not dilute body content with #595959 text; force high contrast #000000 on #ffffff for all core structural strings.
- Do not mix button border geometries—never use an 8px radius in the header, and never use 50px pills within an elevated prompt panel.
- Do not frame or stroke image artwork thumbnails; let the unstyled edge define the visual rectangle inside the card space.
- Never apply hover elevation—use pure background-color offsets or opacity changes, reserving box-shadow for persistent Z-index tiers.
- Avoid decorative colored blocks in the UI system—constrain #24cb71, #00b6ff, #ff7237 exclusively to actual artwork or avatar renders.

## Elevation

Z-axis hierarchy relies on a binary absolute threshold. 99% of the UI (buttons, cards, inputs) exists entirely flush with the background, utilizing zero shadow. Elevation is summoned centrally as a single, massive volumetric throw (0 24px 70px 10% opacity) beneath core interactive 'prompt modules'—physically disconnecting the active toolset layer from the flat, passive content layer underneath.

## Imagery

User-centric outputs completely govern the image domain. Assets appear as flat, unbordered 0px squares or scattered, overlapping physical-like cuts set against a stark void. The imagery operates as the only source of chroma on the site. There are zero lifestyle photography elements or generic corporate illustrations—every graphic is an exact, literal snapshot of a digital canvas creation, functioning both as proof of product and primary aesthetic payload.

## Layout

Compositions rely on extreme maximum-width boundaries (1440px max) centering the viewport, utilizing tight clusters of content separated by massive macro-whitespace (96-120px section gaps). The hero archetype frequently stacks an asymmetric gallery-wall of images pinned dynamically beneath a floating, perfectly-centered UI block. Below the fold, information conforms immediately to strict 4-column unpadded grid architecture framing repeated card clusters, maximizing object density while eliminating frame padding.

## Agent Prompt Guide

### Quick Color Reference
- Canvas Background: `#ffffff`
- Structural Text & Actions: `#000000`
- Contextual Brand CTA: `#4d49fc`
- Subtext Metadata: `#595959`
- Field Bounds: `#e2e2e2`

### Example Component Prompts
1. **Build a Global Navigation Action:** Create a solid black (#000000) pill button with white (#ffffff) text 'Get started for free' set in figmaSans 16px lock-up. Assign a 50px border-radius and use 8px top/bottom, 18px left/right padding.
2. **Generate the Floating Prompt Box:** Layout an absolute white (#ffffff) container with 16px padding and an exact 16px border-radius. Apply the mandatory focal box-shadow of `rgba(0,0,0,0.1) 0px 24px 70px 0px`. Inside, set a large prompt text 'Make anything possible' at size 56px, tracking at -0.5px. Add an internal 'Get started' button using #4d49fc background, white text, and a rigid 8px border-radius.
3. **Assemble a Community Card Array:** Create a 4-column grid using a 24px element gap. Each card must have exactly a 0px border-radius and background transparent. The top half is an image bleeding literally to all boundary edges. Below, write a bold structural title in #000000 at 16px, immediately followed underneath by an author string in #595959 at 12px figmaMono.

## Similar Brands

- **Apple** — Typographic aggression via exact, tracked-in varying weights driving hierarchy entirely without structural color.
- **Notion** — Tools-as-infrastructure layout mindset, relying entirely on monochrome wireframes that recede to let user components inject visual flair.
- **Vercel** — High-contrast monochromatic structural scaffolding that defines interaction surfaces with stark geometry and singular vivid accent highlights.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-absolute-canvas: #ffffff;
  --color-structural-ink: #000000;
  --color-graphite-metadata: #595959;
  --color-boundary-frame: #e2e2e2;
  --color-context-action-violet: #4d49fc;
  --color-angular-teal: #33dfdf;
  --gradient-angular-teal: conic-gradient(rgb(51, 223, 223) 0deg, rgb(51, 223, 223) 18deg, rgba(0, 0, 0, 0) 18deg, rgba(0, 0, 0, 0) 30deg);

  /* Typography — Font Families */
  --font-figmasans: 'figmaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figmamono: 'figmaMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: 0.36px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.08px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.13px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.24px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -0.5px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;

  /* Typography — Weights */
  --font-weight-w320: 320;
  --font-weight-w330: 330;
  --font-weight-w340: 340;
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-w480: 480;
  --font-weight-w520: 520;
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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 96-120px;
  --card-padding: 16px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-contentcards: 0px;
  --radius-floatingpanels: 16px;
  --radius-globalnavbuttons: 50px;
  --radius-contextualbuttons: 8px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 24px 70px 0px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-absolute-canvas: #ffffff;
  --color-structural-ink: #000000;
  --color-graphite-metadata: #595959;
  --color-boundary-frame: #e2e2e2;
  --color-context-action-violet: #4d49fc;
  --color-angular-teal: #33dfdf;

  /* Typography */
  --font-figmasans: 'figmaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figmamono: 'figmaMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: 0.36px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.08px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.13px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.24px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -0.5px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 24px 70px 0px;
}
```
