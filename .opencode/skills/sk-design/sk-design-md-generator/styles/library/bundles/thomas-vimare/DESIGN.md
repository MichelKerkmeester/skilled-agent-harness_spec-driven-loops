# Thomas Vimare — Style Reference
> midnight monochrome atelier — a designer's darkroom where white type and saturated photography are the only light

**Theme:** dark

thms.works is a monochrome dark-mode portfolio built on absolute restraint. The entire interface is three colors: a near-black canvas, white type, and one muted gray for secondary information. A single custom typeface — HelveticaNowDisplay-Light — carries every word on the site, with tight negative tracking that tightens further at display sizes. The layout is spacious and editorial: large left-aligned headlines, generous 120px section gaps, and a two-column project grid where full-bleed photography is the only chromatic content. There are no buttons, no shadows, no accent colors, no border radii — just type, image, and negative space doing all the work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Canvas | `#171717` | `--color-obsidian-canvas` | Page background, all surface layers — the flat dark base every element sits on |
| Chalk | `#ffffff` | `--color-chalk` | Headlines, primary body text, active nav text, active nav underline border, project titles |
| Ash | `#9a9a9a` | `--color-ash` | Muted secondary text — project descriptions, section labels, inactive supporting copy |

## Tokens — Typography

### HelveticaNowDisplay-Light — Sole typeface for the entire site — headlines, body, navigation, descriptions. The single weight (400, marketed as 'Light') at tight negative tracking gives the site its quiet, editorial voice. Display sizes pull in to -0.010em while body sits at -0.003em, creating a compression gradient that intensifies at scale. · `--font-helveticanowdisplay-light`
- **Substitute:** Helvetica Neue, Inter, Söhne
- **Weights:** 400
- **Sizes:** 16px, 20px, 24px, 28px, 32px, 56px
- **Line height:** 1.00, 1.20, 1.40, 1.50
- **Letter spacing:** Scales from -0.05px at 16px to -0.56px at 56px; tighter as size grows
- **Role:** Sole typeface for the entire site — headlines, body, navigation, descriptions. The single weight (400, marketed as 'Light') at tight negative tracking gives the site its quiet, editorial voice. Display sizes pull in to -0.010em while body sits at -0.003em, creating a compression gradient that intensifies at scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.5 | -0.05px | `--text-body` |
| subheading | 20px | 1.4 | -0.1px | `--text-subheading` |
| heading-sm | 24px | 1.4 | -0.14px | `--text-heading-sm` |
| heading | 28px | 1.2 | -0.2px | `--text-heading` |
| heading-lg | 32px | 1.2 | -0.26px | `--text-heading-lg` |
| display | 56px | 1 | -0.56px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 120px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Site-wide navigation

Full-width transparent bar on #171717 canvas. Left side: text links (Work, Biography, Lab, Life) at 16px, weight 400, tracking -0.05px. Right side: name label in #9a9a9a muted gray. No background, no border, no shadow. Padding: 5px top, 10px bottom. Uses HelveticaNowDisplay-Light exclusively.

### Active Nav Link
**Role:** Current page indicator

16px white text (#ffffff) with a 1-2px white bottom border acting as underline. The only use of a visible border in the system — it replaces the convention of bolding or coloring the active state. Padding-bottom: 10px to create space for the underline.

### Inactive Nav Link
**Role:** Secondary navigation items

16px white text (#ffffff), no underline, no styling. Hover state not defined — the design relies on the persistent active indicator rather than hover affordance.

### Hero Headline Block
**Role:** Opening statement / page introduction

Left-aligned display text at 56px, weight 400, line-height 1.0, letter-spacing -0.56px in #ffffff. Multi-line, wraps naturally. Sits directly on the #171717 canvas with generous breathing room above and below. No background treatment, no border, no max-width constraint — text fills its column naturally.

### Section Indicator
**Role:** Section label with scroll cue

Small uppercase or sentence-case label like '↓ Selected projects' at 16px in #9a9a9a. Includes a downward arrow character (↓) as a scroll affordance. Positioned below the hero headline, left-aligned, with 20-40px gap above. Functions as both label and directional cue.

### Project Card
**Role:** Portfolio entry — image with title and description

Two-column grid card with no background, no border, no shadow, no padding. Structure: full-bleed project image (0px border-radius, sharp corners) on top, then 20px gap, then project title in #ffffff at 20px, then 5px gap, then one-line description in #9a9a9a at 16px. The image IS the card — there is no container styling.

### Project Card Image
**Role:** Visual entry point for each project

Full-bleed, edge-to-edge photography with 0px border-radius. Images maintain natural aspect ratios (roughly 3:2 or 4:3). High-contrast, saturated photography — the only source of color on the entire site. No overlay, no tint, no caption baked in.

### Project Card Title
**Role:** Project name label

20px, weight 400, #ffffff, letter-spacing -0.1px, line-height 1.4. Appears directly below the project image with 20px gap. Sentence case. Functions as the primary identifier for each portfolio entry.

### Project Card Description
**Role:** One-line project summary

16px, weight 400, #9a9a9a, letter-spacing -0.05px, line-height 1.5. Sits 5px below the project title. Single line, truncated by column width. Muted gray deliberately recedes so the title and image carry the weight.

## Do's and Don'ts

### Do
- Use only three colors: #171717 for canvas, #ffffff for primary text, #9a9a9a for muted text. No accent colors, no brand color, no semantic states.
- Set all type in HelveticaNowDisplay-Light at weight 400. Never introduce a second typeface or weight variation.
- Apply border-radius: 0 to all elements. Images, cards, buttons, tags — all sharp corners.
- Use 120px vertical gaps between major page sections and 20px gaps between text elements. Spaciousness is structural.
- Set letter-spacing to -0.010em at 56px, -0.008em at 32px, -0.007em at 28px, -0.006em at 24px, -0.005em at 20px, and -0.003em at 16px. Tracking compresses as size increases.
- Let full-bleed photography provide all chromatic content. Images are edge-to-edge with no frame, padding, or border.
- Left-align all text. The layout is strictly left-justified — no centered headings, no justified blocks.

### Don't
- Do not add a CTA button, filled action, or accent color. The system has no interactive controls beyond text links.
- Do not use shadows, glows, or any elevation effect. The surface is flat by design.
- Do not add border-radius to images, cards, or containers. All corners stay sharp at 0px.
- Do not introduce a second font weight, a bold variant, or italic. The system runs on a single weight (400).
- Do not use color to signal state. Active navigation is indicated by a white underline, not a color shift.
- Do not center-align headings or body text. Everything is left-aligned to the same edge.
- Do not add card backgrounds, borders, or containers around content blocks. Elements sit directly on the canvas.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#171717` | Single flat surface — the entire page is one plane, no card elevations |

## Elevation

No shadows, no elevations, no border-radius anywhere. The design rejects depth cues entirely. Visual hierarchy is built through type scale, generous whitespace, and the full-bleed photography that breaks the monochrome plane with saturated color. The flatness is the point — the designer trusts type and image to do all spatial work.

## Imagery

Photography is the sole source of color and visual energy. Project images are full-bleed with sharp 0px corners, sitting edge-to-edge in the grid. The photography style varies by project — editorial fashion (KAEMA), lifestyle/portraiture (Airbuds), product/technology (Samsung Serif TV, Kard) — but all images are high-contrast, saturated, and unframed. No illustrations, no icons, no abstract graphics, no product screenshots with chrome. The images do not overlap text or each other; they are isolated tiles in a clean grid. Photography functions as both content and decoration — the chromatic counterpoint to the otherwise monochrome interface.

## Layout

Full-bleed single-page layout with no max-width constraint. Navigation is a minimal top bar (text links left, name right) with no background fill. The hero is a left-aligned multi-line headline at display size (56px) with a section label below it, both flush to the left edge. Below the hero, a two-column project grid displays portfolio entries — each entry is a full-bleed image stacked with a title and one-line description, with no card chrome. Vertical rhythm is built on 120px section gaps between the hero and the grid, and 60px padding around the grid container. The layout is strictly left-justified with a consistent left margin; no centered compositions, no asymmetric splits, no overlapping layers. Navigation stays at the top, no sticky behavior, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #ffffff
- Text (muted/secondary): #9a9a9a
- Background (canvas): #171717
- Border (active nav indicator): #ffffff
- Accent: none — system is strictly monochrome
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Create a navigation bar:* Transparent background over #171717. Left-aligned text links at 16px, weight 400, color #ffffff, letter-spacing -0.05px, padding-bottom 10px. The active link has a 1px white bottom border. Right-aligned name label in #9a9a9a at 16px. No background, no shadow, no border-radius.

2. *Create a hero headline:* Left-aligned display text at 56px, weight 400, line-height 1.0, letter-spacing -0.56px, color #ffffff on #171717 canvas. Multi-line, no max-width. 120px vertical padding above and below.

3. *Create a project card:* No background, no border, no shadow, 0px border-radius. Full-bleed image (0px radius, sharp corners) on top. 20px gap, then project title at 20px weight 400 #ffffff letter-spacing -0.1px. 5px gap, then description at 16px weight 400 #9a9a9a letter-spacing -0.05px. Images sit edge-to-edge in a two-column grid.

4. *Create a section indicator:* Left-aligned text at 16px in #9a9a9a, prefixed with a ↓ arrow character. Sits 20px below the preceding heading. No styling, no background — just muted gray text on the dark canvas.

5. *Create the page canvas:* Solid #171717 background, full-bleed, no gradients, no textures. All content sits directly on this single flat surface with no card or panel containers.

## Similar Brands

- **rauno.me** — Same extreme monochrome dark-mode approach with a single typeface and zero accent colors — type and whitespace do all the work
- **cobeisfresh.com** — Similar minimal dark portfolio structure with left-aligned type and project grid, no UI chrome beyond text
- **philippebarriere.com** — Dark editorial portfolio aesthetic with full-bleed photography and restrained typography in a tight two-column grid
- **linear.app** — Shared commitment to a near-black canvas (#171717-family) and single-weight display type at tight tracking, though Linear adds accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-canvas: #171717;
  --color-chalk: #ffffff;
  --color-ash: #9a9a9a;

  /* Typography — Font Families */
  --font-helveticanowdisplay-light: 'HelveticaNowDisplay-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.05px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.14px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.2px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.26px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -0.56px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Layout */
  --section-gap: 120px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-obsidian-canvas: #171717;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-canvas: #171717;
  --color-chalk: #ffffff;
  --color-ash: #9a9a9a;

  /* Typography */
  --font-helveticanowdisplay-light: 'HelveticaNowDisplay-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.05px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.14px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.2px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.26px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -0.56px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;
}
```
