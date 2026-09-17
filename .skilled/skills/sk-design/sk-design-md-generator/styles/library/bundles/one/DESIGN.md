# ONE — Style Reference
> art monograph on warm paper

**Theme:** light

ONE is an editorial gallery: warm paper-white canvas, hairline-thin type, and black ink that does all the work. The interface disappears so that dark cinematic video plates and a slowly cycling manifesto can carry the page. Almost everything is monochrome — a single warm off-white background, true black for text and rules, and one soft gray for muted states. Pill-shaped ghost controls float at the edges, the wordmark sits top-left as a quiet signature, and the right edge holds a single contact affordance. Components are thin: 1px borders, generous padding, 999px buttons, and no shadows or gradients. The mood is curated, unhurried, book-like — the type does not shout, it annotates.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, hairline borders, video frame outlines, pill button stroke — the only chromatic event in the UI |
| Paper | `#fbfbfa` | `--color-paper` | Soft icon strokes, subtle dividers, and low-emphasis decorative details. Do not promote it to the primary CTA color |
| Ash | `#bec0c5` | `--color-ash` | Muted text in the cycling manifesto, list dividers, inactive link tone — desaturated gray stays quiet next to ink |

## Tokens — Typography

### MagicUiPro — Single-family system: body text and micro-headlines both sit in the 18–24px range at medium weight, with weight 600 reserved for the active manifesto item and button labels. The tight -0.01em tracking and modest size range mean type never breaks 24px — the page treats every word as a label, not a headline. · `--font-magicuipro`
- **Substitute:** Söhne, Inter, General Sans
- **Weights:** 500, 600
- **Sizes:** 18px, 20px, 24px
- **Line height:** 1.0–1.4
- **Letter spacing:** -0.01em across all sizes
- **Role:** Single-family system: body text and micro-headlines both sit in the 18–24px range at medium weight, with weight 600 reserved for the active manifesto item and button labels. The tight -0.01em tracking and modest size range mean type never breaks 24px — the page treats every word as a label, not a headline.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 18px | 1.4 | -0.18px | `--text-body` |
| subheading | 20px | 1.2 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1 | -0.24px | `--text-heading-sm` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 19 | 19px | `--spacing-19` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| buttons | 999px |
| videoFrames | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Ghost Pill Button
**Role:** Primary navigation CTA (Contact)

999px radius, 1px Ink border on Paper fill, horizontal padding 19px, height ~36–40px. Text 18px weight 500 in Ink. The only button variant on the site — no filled, no link-style alternatives. Rests top-right of every screen.

### Wordmark
**Role:** Brand identity, top-left anchor

Plain text 'ONE' at 20px, weight 600, Ink on Paper. No logo glyph, no lockup — the brand name alone is the mark. Sits flush with the page edge with ~16px outer padding.

### Cinematic Video Plate
**Role:** Primary content surface

Full-bleed dark video embedded in a Paper canvas, 12px corner radius, ~720px max width centered, 16:9 aspect. Carries its own internal color (deep teal, amber sun) but lives inside the monochrome frame system. A circular play/pause control floats at center on a semi-transparent dark surface.

### Caption Block
**Role:** Annotation under video plates

Single short sentence at 18px weight 500, Ink on Paper, centered beneath the video. Generous 96px margin separates it from the video above — caption is treated as its own paragraph, not a subtitle.

### Cycling Manifesto List
**Role:** Repetitive, rhythmic brand expression

Vertical stack of 'ONE is X' statements, 18–20px weight 500, ~4px line spacing between items. Default items in Ash (#bec0c5); the active item flips to Ink at weight 600. No bullets, no numbers, no dividers — the type change is the only indicator. One item visible at a time emphasizes the active state, the rest dissolve into the background.

### Project Thumbnail
**Role:** Companion still alongside the manifesto

Small landscape image (~140×80px), 8–12px radius, Ink or soft color from the video plate. Sits to the left of the manifesto text, vertically aligned to the active item. Acts as visual ear to the text column.

### Top Navigation Bar
**Role:** Persistent page chrome

Full-bleed Paper background, transparent to the page, ~60–72px tall. Wordmark left, Ghost Pill Button right, both vertically centered. No center nav, no menu icon, no secondary links.

### Centered Play Control
**Role:** Video interaction state

48px circular surface, dark semi-transparent fill, white triangle glyph centered. Overlaid on the video plate at exact center — the only icon-sized element that breaks the Paper canvas.

## Do's and Don'ts

### Do
- Use only #000000 for text, borders, and outline strokes; #fbfbfa for any filled surface; #bec0c5 only for muted/secondary text and list dividers
- Set every button radius to 999px and every card/video frame radius to 12px
- Restrict type to 18px, 20px, and 24px at weight 500 or 600 with -0.01em letter-spacing
- Give video plates and section breaks at least 96px vertical breathing room
- Let the wordmark and Ghost Pill Button sit at the page edges with no centered nav or breadcrumbs
- Carry dark video content inside a 12px-radius frame rather than bleeding full-bleed against the Paper canvas
- Treat the manifesto list as a single column with weight/color as the only state indicator — no checkmarks, arrows, or icons

### Don't
- Do not introduce accent colors, brand hues, or saturated fills — the palette is strictly ink/paper/ash
- Do not add box-shadows, gradients, or background blurs to any surface
- Do not scale type above 24px or below 18px — both would break the label-scale system
- Do not use weight 400 or 700; the system is bound to 500 and 600 only
- Do not use square or 4px radii on buttons; pill is the only allowed control shape
- Do not add a filled/solid button variant; the Ghost Pill Button is the sole interactive pattern
- Do not add icons, badges, or secondary navigation in the header — the chrome is exactly two elements

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#fbfbfa` | Page canvas — warm off-white reads as physical paper |
| 2 | Video Frame | `#000000` | Interior of the cinematic video plate — true black holds the dark footage |
| 3 | Play Overlay | `#000000` | Semi-transparent dark circle that hosts the play glyph over video |

## Elevation

The system has no elevation. All depth comes from inset video plates against the flat Paper canvas and from the weight/saturation change between Ink and Ash in the manifesto list. Shadows would break the printed-page metaphor.

## Imagery

Imagery is exclusively dark, cinematic video: handheld natural-light footage of forests, water, and sunlit interiors, with deep teal, cyan, and warm amber color grades. Videos are contained inside 12px-radius frames on the Paper canvas — they never bleed full-bleed. No photography, no illustration, no 3D renders, no abstract graphics outside the video content. Icons are absent except for a single play triangle on a dark circular overlay. The visual density is extremely low — one video plate and one caption per section.

## Layout

Page is max-width ~1200px centered on a Paper canvas, but content within each section is independently centered rather than grid-aligned. The hero is a full-bleed dark video plate with no headline overlay. Sections alternate between single video+caption blocks and a three-column layout: small project thumbnail on the left, centered manifesto text stack in the middle column. Section gaps are 96px, section padding is 32px horizontal. Navigation is a single thin top bar — wordmark left, ghost pill right — with no center nav and no menu icon. The rhythm is vertical and reading-oriented: scroll down to encounter one video, one caption, one manifesto block, repeat.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #fbfbfa
- border: #000000
- muted: #bec0c5
- primary action: no distinct CTA color

## Example Component Prompts

1. **Ghost Pill Button**: 999px radius, 1px #000000 border, #fbfbfa fill, 19px horizontal padding, height ~36px. Label at 18px, weight 500, color #000000, letter-spacing -0.18px. The only button on the page — do not introduce a filled variant.

2. **Wordmark**: Plain text 'ONE' at 20px, weight 600, color #000000, sitting flush left at the page edge. No icon, no logo glyph, no background.

3. **Cinematic Video Plate**: 12px radius, ~720px max width centered, 16:9 aspect, #000000 interior to hold dark video. A 48px circular dark overlay at exact center holds a white play triangle.

4. **Cycling Manifesto List**: Vertical stack of single short lines at 18px weight 500, color #bec0c5, ~4px line gap. The active line flips to #000000 at weight 600 — color and weight together mark state. No bullets, no arrows, no dividers.

5. **Section Layout**: Center the video plate, then 96px of space, then a single 18px caption sentence centered below. No side-by-side hero, no grid, no images flanking the text — every section reads top-to-bottom like a printed page.

## Similar Brands

- **Bureau Cool** — Same single-column Paper-canvas rhythm with a tiny wordmark, ghost contact button top-right, and full-bleed cinematic video as the primary content type
- **Active Theory** — Dark immersive video plates framed inside a minimal, type-only interface with no navigation chrome beyond a wordmark and a single CTA
- **Resn** — Creative-studio site that lets a cycling manifesto / 'is' list function as the main content block, with monochrome type and a paper-warm background
- **Manual** — Same restrained approach — warm off-white canvas, hairline type, pill button, and dark editorial photography/video as the only color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #fbfbfa;
  --color-ash: #bec0c5;

  /* Typography — Font Families */
  --font-magicuipro: 'MagicUiPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.24px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-buttons: 999px;
  --radius-videoframes: 12px;

  /* Surfaces */
  --surface-paper: #fbfbfa;
  --surface-video-frame: #000000;
  --surface-play-overlay: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #fbfbfa;
  --color-ash: #bec0c5;

  /* Typography */
  --font-magicuipro: 'MagicUiPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.24px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 999px;
}
```
