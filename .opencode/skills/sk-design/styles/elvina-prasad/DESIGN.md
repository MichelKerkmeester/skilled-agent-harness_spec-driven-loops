# Elvina Prasad — Style Reference
> Editorial monolith of light and shadow — enormous type carved into a binary canvas, with project imagery crashing into the letters.

**Theme:** mixed

A portfolio language built on typographic monumentality: massive Neue Montreal headlines that occupy the full width of the viewport, set against a binary canvas that flips between pure white and pure black across scrolling sections. The system is entirely achromatic — no brand color, no accent, no gradient — and lets scale, weight, and light/dark inversion do all the expressive work. Project imagery overlaps the type rather than sitting beside it, breaking the grid and making the text itself a compositional surface. Everything else is quiet: a two-letter monogram, a single nav word, a hairline scroll cue.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#ffffff` | `--color-paper` | Page background, light-section canvas, inverse-mode text on dark sections |
| Ink | `#000000` | `--color-ink` | Dark-section canvas, headline type on light sections, full-bleed background blocks |
| Graphite | `#333333` | `--color-graphite` | Body copy, secondary text, hairlines and card borders — the working neutral for content |
| Bone | `#f7f7f7` | `--color-bone` | Tinted surface for subtle elevation against the white canvas, used for off-white blocks and muted framing |
| Steel | `#525252` | `--color-steel` | Muted helper text, caption weight, secondary metadata where Graphite reads too heavy |

## Tokens — Typography

### Neue Montreal — Signature display and heading face — weight 300 for monumental headlines at 178px, weight 400 for subhead and body, weight 500 for emphasized labels. The 178px display line-height of 1.00 lets letterforms stack into a typographic block; 0.05em positive tracking prevents the hairline weights from collapsing at small sizes and adds the wide, airy grotesk character that defines the brand. · `--font-neue-montreal`
- **Substitute:** Inter, Manrope, or Space Grotesk
- **Weights:** 300, 400, 500
- **Sizes:** 11px, 18px, 27px, 178px
- **Line height:** 1.00–1.40
- **Letter spacing:** 0.05em positive across all sizes
- **Role:** Signature display and heading face — weight 300 for monumental headlines at 178px, weight 400 for subhead and body, weight 500 for emphasized labels. The 178px display line-height of 1.00 lets letterforms stack into a typographic block; 0.05em positive tracking prevents the hairline weights from collapsing at small sizes and adds the wide, airy grotesk character that defines the brand.

### Neue Montreal Variable — Variable-axis instance used for interactive and mid-scale elements — links, icons, navigation, and mid-weight display blocks. The variable axis lets weight, optical size, and slant interpolate smoothly for hover and active states without swapping fonts. · `--font-neue-montreal-variable`
- **Substitute:** Inter variable, Manrope variable
- **Weights:** 400 (variable axis)
- **Sizes:** 14px, 32px, 38px, 40px
- **Line height:** 1.00–1.43
- **Letter spacing:** 0.05em positive
- **Role:** Variable-axis instance used for interactive and mid-scale elements — links, icons, navigation, and mid-weight display blocks. The variable axis lets weight, optical size, and slant interpolate smoothly for hover and active states without swapping fonts.

### Arial — System fallback only — appears in non-brand utility contexts where a system font is acceptable · `--font-arial`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Role:** System fallback only — appears in non-brand utility contexts where a system font is acceptable

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.3 | 0.55px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.7px | `--text-body-sm` |
| body | 18px | 1.4 | 0.9px | `--text-body` |
| subheading | 27px | 1.3 | 1.35px | `--text-subheading` |
| heading-sm | 32px | 1.1 | 1.6px | `--text-heading-sm` |
| heading | 38px | 1.1 | 1.9px | `--text-heading` |
| heading-lg | 40px | 1.1 | 2px | `--text-heading-lg` |
| display | 178px | 1 | 8.9px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 21 | 21px | `--spacing-21` |
| 29 | 29px | `--spacing-29` |
| 32 | 32px | `--spacing-32` |
| 50 | 50px | `--spacing-50` |
| 72 | 72px | `--spacing-72` |
| 85 | 85px | `--spacing-85` |
| 89 | 89px | `--spacing-89` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 85px
- **Card padding:** 21px
- **Element gap:** 16px

## Components

### Monogram Mark
**Role:** Brand identity anchor

Two lowercase letters 'ep' set in Neue Montreal 400, ~40px, 0.05em tracking, color flips between Paper (#ffffff) and Ink (#000000) to match the current section. Fixed top-left, 32px–40px margin from the edge. The only persistent brand mark — no wordmark, no logotype.

### Menu Trigger
**Role:** Primary navigation

Single word 'MENU' in uppercase Neue Montreal 400, ~14px, 0.05em tracking, color flips Paper/Ink by section. Fixed top-right, 32px–40px margin. No visible affordance beyond the word — no hamburger icon, no border.

### Display Headline
**Role:** Section-defining typography

Set in Neue Montreal weight 300 at 178px, line-height 1.00, letter-spacing 0.05em (8.9px). Occupies nearly the full viewport width and bleeds past margins; may overlap with project imagery. Color inverts per section: Paper on Ink canvas, Ink on Paper canvas. The display is the hero — no accompanying eyebrow or kicker.

### Scroll Cue
**Role:** Scroll affordance and section transition

Label 'KEEP SCROLLING' in Neue Montreal 400 uppercase, ~14px, 0.05em tracking, paired with a circular icon button (24–32px diameter, 1px border, downward chevron, no fill). Sits bottom-right of the viewport, fixed or section-anchored. The circle is the only geometric form in the system.

### Project Mockup
**Role:** Portfolio artifact

Full-bleed project screenshot, 0px radius, no border, no shadow, no background card. Positioned absolutely or in flow, intentionally overlapping the display headline by 40–80px. Images are raw edges — no mask, no tilt, no parallax wrapper.

### Light Section Block
**Role:** Section surface — light mode

Full-bleed #ffffff background, no internal max-width constraint. Content aligns to viewport edges with 72px left/right gutter on content bands. Headlines and body in Ink (#000000) and Graphite (#333333).

### Dark Section Block
**Role:** Section surface — dark mode

Full-bleed #000000 background, viewport-spanning. All type and icons in Paper (#ffffff). Used to invert the reading rhythm — the page alternates between these two states at major breakpoints rather than using subtle tints.

### Hairline Divider
**Role:** Section separation

1px line in Graphite (#333333) spanning the full viewport width. No padding above or below — the line IS the spacing. Used sparingly between light and dark sections to reinforce the break.

### Icon (Utility)
**Role:** Interface icons and affordances

1px stroke, geometric, monoline, no fill. Color matches the current section's text color (Paper or Ink). Sized 16–24px. Only the scroll-arrow circle and a few inline icons appear — no icon system, no grid.

## Do's and Don'ts

### Do
- Use Neue Montreal weight 300 for all display headlines — the hairline weight is the signature; never substitute 600 or 700 here.
- Set display type at 178px with line-height 1.00 so letterforms stack into a typographic block — do not increase line-height to 'improve readability'.
- Apply 0.05em positive letter-spacing to every Neue Montreal size — the tracking is non-negotiable and defines the voice.
- Alternate full-bleed #ffffff and #000000 sections at major breakpoints to create the light/shadow rhythm — never use tints, never use gradients.
- Let project images overlap display headlines by 40–80px — the collision is compositional, not an accident to fix.
- Invert all text and icon color to match the current section's canvas — Paper type on Ink backgrounds, Ink type on Paper backgrounds.
- Keep navigation to the monogram and a single 'MENU' label — no secondary nav, no breadcrumb, no utility links.

### Don't
- Do not introduce any chromatic color — the palette is binary; adding a brand hue breaks the editorial system.
- Do not add box-shadows, drop-shadows, or any elevation effects — the design uses color inversion instead of depth.
- Do not use border-radius on cards, buttons, images, or any surface — every corner is 0px and sharp.
- Do not set display type below 100px or use a different weight for hero headlines — 178px / 300 is the only correct scale step.
- Do not use Arial or system fonts for display, headings, or navigation — Arial is utility-only.
- Do not wrap content in a max-width container with auto margins — sections are full-bleed by design.
- Do not place project images beside or below the headline in a clean grid — they must overlap or bleed into the type.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Light section canvas — the default reading surface |
| 2 | Bone | `#f7f7f7` | Tinted off-white block for subtle contrast against Paper, used for nested surfaces within light sections |
| 3 | Ink | `#000000` | Dark section canvas — the inverted reading surface that resets visual rhythm |

## Elevation

Elevation is expressed through color inversion (Paper ↔ Ink) and full-bleed section blocks, never through box-shadow. The system has no shadow tokens because depth is unnecessary — the binary canvas does the structural work that soft shadows do in conventional UIs.

## Imagery

Imagery is product-focused and raw: full-bleed project screenshots and device mockups with no border, radius, or shadow. Images sit on the canvas with sharp edges and intentionally overlap display headlines, breaking the typographic block. No photography, no illustration, no decorative graphics — the project artifacts ARE the imagery. Density is low: one or two images per section, each given room to collide with the type.

## Layout

Full-bleed page model with no max-width container — content reaches the viewport edges with 72px left/right gutter on text bands. The page alternates between full-viewport-height black sections and full-viewport-height white sections at major breakpoints, creating a binary light/dark rhythm. Each section is anchored by a single 178px display headline that occupies the upper half of the viewport; project imagery appears in the lower half and overlaps the headline. Navigation is minimal: a two-letter monogram fixed top-left, a 'MENU' label fixed top-right, a 'KEEP SCROLLING' cue fixed bottom-right. No sidebar, no mega-menu, no sticky header beyond the three corner anchors.

## Agent Prompt Guide

**Quick Color Reference**
- text (light section): #000000 Ink
- text (dark section): #ffffff Paper
- background (light): #ffffff Paper
- background (dark): #000000 Ink
- border: #333333 Graphite
- muted text: #525252 Steel
- primary action: no distinct CTA color

**3–5 Example Component Prompts**

1. *Full-viewport dark hero section.* Background #000000 Ink. Headline 'Human centred designs' in Neue Montreal weight 300, 178px, line-height 1.00, letter-spacing 0.05em (8.9px), color #ffffff Paper. Monogram 'ep' top-left at 40px, #ffffff. Label 'MENU' top-right at 14px uppercase, #ffffff. No other content.

2. *Light portfolio section with overlapping imagery.* Background #ffffff Paper. Display headline in Neue Montreal weight 300, 178px, color #000000 Ink, anchored top-left. Two project mockup images (phone screenshot and packaging) positioned to overlap the headline by ~60px from below, 0px radius, no border, no shadow. Scroll cue 'KEEP SCROLLING' at 14px uppercase + 32px circle border button with 1px #000000 stroke and a downward chevron, fixed bottom-right.

3. *Hairline section divider.* Full-viewport-width 1px line in #333333 Graphite, no padding above or below, sits between a light and dark section block to mark the transition.

4. *Footer link row.* Background #f7f7f7 Bone. Three text links in Neue Montreal 400, 14px, 0.05em tracking, color #333333 Graphite, separated by 32px gaps. No underlines, no icons.

5. *Caption block.* Single line at 11px Neue Montreal 400, 0.05em tracking, color #525252 Steel, 50px top/bottom padding. Used for project metadata and date stamps.

## Similar Brands

- **Locomotive** — Agency portfolio with massive display type on a binary light/dark canvas, no accent color, and project imagery that bleeds into the layout rather than sitting in cards
- **Rauno Freiberg** — Single-creator portfolio using Neue Montreal–weight grotesk type at extreme display sizes, alternating full-bleed black and white sections with no decorative chrome
- **Pentagram** — Editorial typography as the primary visual element, sharp 0px corners throughout, no shadows, and a strictly achromatic palette that lets the work speak
- **Ruslan Yevchuk** — Designer portfolio with oversized 100–200px headlines, 0px radius, full-bleed sections, and project artifacts overlapping the type instead of living in a grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-graphite: #333333;
  --color-bone: #f7f7f7;
  --color-steel: #525252;

  /* Typography — Font Families */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-montreal-variable: 'Neue Montreal Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --tracking-caption: 0.55px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.7px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: 0.9px;
  --text-subheading: 27px;
  --leading-subheading: 1.3;
  --tracking-subheading: 1.35px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 1.6px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: 1.9px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 2px;
  --text-display: 178px;
  --leading-display: 1;
  --tracking-display: 8.9px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-29: 29px;
  --spacing-32: 32px;
  --spacing-50: 50px;
  --spacing-72: 72px;
  --spacing-85: 85px;
  --spacing-89: 89px;
  --spacing-180: 180px;

  /* Layout */
  --section-gap: 85px;
  --card-padding: 21px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-bone: #f7f7f7;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-graphite: #333333;
  --color-bone: #f7f7f7;
  --color-steel: #525252;

  /* Typography */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-montreal-variable: 'Neue Montreal Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --tracking-caption: 0.55px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.7px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: 0.9px;
  --text-subheading: 27px;
  --leading-subheading: 1.3;
  --tracking-subheading: 1.35px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 1.6px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: 1.9px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 2px;
  --text-display: 178px;
  --leading-display: 1;
  --tracking-display: 8.9px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-29: 29px;
  --spacing-32: 32px;
  --spacing-50: 50px;
  --spacing-72: 72px;
  --spacing-85: 85px;
  --spacing-89: 89px;
  --spacing-180: 180px;
}
```
