# Freelance frontend UI developer and designer, Rou Hun Fan — Style Reference
> Riso-printed zine on black construction paper

**Theme:** dark

A brutalist editorial portfolio for an independent frontend developer: near-black canvas, oversized condensed display type, and a single high-saturation accent block that detonates against the void. Layout behaves like a printed magazine spread — text breaks across asymmetric columns, type meets image at hard edges, and whitespace is used as a structural element rather than padding. The signature move is the cyan card with magenta display text that feels pasted onto the page like a sticker, breaking the monochrome discipline. Typography carries all the weight: a monospaced geometric for system voice, a heavy condensed sans for shouting, and a calligraphic script for editorial flourishes that humanize the machine aesthetic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon | `#0a0a0a` | `--color-carbon` | Page canvas and section backgrounds — near-true-black maximizes the contrast pop of white type and saturated accent blocks |
| Bone | `#ffffff` | `--color-bone` | Primary text, display headlines, borders, and link strokes — the only voice for the majority of the page |
| Voltage Cyan | `#1ef0e4` | `--color-voltage-cyan` | Accent card backgrounds, highlight panels — flat saturated cyan that screams against the dark canvas, reserved for project cards and editorial callout blocks |
| Plasma Magenta | `#e91e8c` | `--color-plasma-magenta` | Display text on cyan cards, decorative script flourishes — hot pink/magenta used only as ink-on-cyan contrast or as editorial accent |
| Ember | `#ff3a1a` | `--color-ember` | Supporting palette color for small decorative accents when the core palette needs contrast. |

## Tokens — Typography

### Azeret Mono — Monospace system voice — navigation, metadata, UI labels, footer text. Brings a developer-terminal identity that matches the frontend-developer positioning · `--font-azeret-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400, 700
- **Sizes:** 100px
- **Line height:** 1.4–1.5
- **OpenType features:** `"aalt" on`
- **Role:** Monospace system voice — navigation, metadata, UI labels, footer text. Brings a developer-terminal identity that matches the frontend-developer positioning

### AzeretMono (display variant) — Oversized condensed display headlines (ROU HUN FAN, UI DEV, DESIGN, MOTION & FRONTEND). The extreme scale and bold weight turn the page into a typographic poster — type IS the design · `--font-azeretmono-display-variant`
- **Substitute:** Bebas Neue, Anton, Tungsten Bold
- **Weights:** 700, 900
- **Sizes:** 
- **Line height:** 1.0–1.2
- **Role:** Oversized condensed display headlines (ROU HUN FAN, UI DEV, DESIGN, MOTION & FRONTEND). The extreme scale and bold weight turn the page into a typographic poster — type IS the design

### Ephidona — Calligraphic editorial script for section labels (PROJECTS). Counter-typography that breaks the geometric/mono discipline with human handwriting — the anti-machine flourish that signals personal craft over automated output · `--font-ephidona`
- **Substitute:** Pinyon Script, Allura, Tangerine
- **Weights:** 400
- **Sizes:** 100px, 108px
- **Line height:** 1.2
- **OpenType features:** `"aalt" on`
- **Role:** Calligraphic editorial script for section labels (PROJECTS). Counter-typography that breaks the geometric/mono discipline with human handwriting — the anti-machine flourish that signals personal craft over automated output

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading | 56px | 1.1 | — | `--text-heading` |
| heading-lg | 72px | 1.05 | — | `--text-heading-lg` |
| display | 100px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 9 | 9px | `--spacing-9` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 80-120px
- **Card padding:** 32-48px
- **Element gap:** 8-16px

## Components

### Display Headline
**Role:** Primary typographic element — sets the poster/magazine tone

AzeretMono 700/900 at 72–100px, white (#ffffff) on Carbon (#0a0a0a), line-height 1.0–1.2, no letter-spacing. Text breaks across columns asymmetrically. This is the dominant UI element — larger than any other component on the page.

### Editorial Script Label
**Role:** Section divider and humanizing accent

Ephidona 400 at 72–108px, Ember (#ff3a1a) on Carbon, overlapping the edge of a Voltage Cyan card. Used as a diagonal/rotated overlay on project cards to add editorial energy. Only 1–2 instances per page.

### Voltage Project Card
**Role:** Featured project showcase block

Background Voltage Cyan (#1ef0e4), Plasma Magenta (#e91e8c) display text (PROBLEM STUDIO) at 48–72px AzeretMono bold, small Plasma Magenta body text below. Zero border-radius. Hard rectangular edge. Often contains a torn-paper or organic decorative shape in Plasma Magenta at the bottom edge.

### Monospace Navigation
**Role:** Top-of-page nav and section links

Azeret Mono 400 at 14–16px, white, uppercase, tracking slightly expanded. No background fill — text only, sitting directly on Carbon. Minimal: 3–5 items max. Separated by generous whitespace, not dividers.

### Photo Plate
**Role:** Personal photography and project imagery

Full-bleed or near-full-bleed images on Carbon, zero border-radius, no border. Images butt directly against display text — no padding gutters. Photography is warm-toned, candid, medium-format feel.

### Metadata Tag
**Role:** Small labels for project categories, years, skills

Azeret Mono 400 at 12–14px, white or dimmed white on Carbon. No background. Uppercase. Stacked vertically with 9px gaps (the detected elementGap token). No pill shape, no border.

### Footer
**Role:** Contact and social links

Azeret Mono 400 at 12–14px white on Carbon, full-width, left-aligned. Includes email, social handles, and copyright. No dividers. Maximum 3–4 lines.

### Decorative Organic Shape
**Role:** Graphic accent on Voltage cards

Plasma Magenta (#e91e8c) irregular blob/torn-paper shape at the base of Voltage Cyan cards. Flat fill, no gradient, no border. Creates visual friction between the geometric card and organic flourish.

## Do's and Don'ts

### Do
- Use AzeretMono 700/900 at 72–100px for all primary headlines — type scale should feel oversized, never comfortable
- Apply Voltage Cyan (#1ef0e4) as flat panel backgrounds only — never as gradients, never as semi-transparent overlays
- Keep all border-radius at 0px — cards, buttons, images, tags are all hard rectangles
- Use Ephidona script sparingly (1–2 instances per page) as editorial flourishes on Voltage cards, not for functional text
- Set elementGap to 8–16px and use whitespace as structural division between content blocks
- Let display text break across columns naturally — asymmetric, magazine-grid layout is intentional
- Pair Plasma Magenta text exclusively with Voltage Cyan backgrounds — never use magenta on dark or magenta as body text

### Don't
- Don't add box-shadows, drop-shadows, or any form of depth simulation — the design is ruthlessly flat
- Don't round corners on any element — hard edges define the brutalist editorial language
- Don't use the brand accent colors for buttons or CTAs — there are no traditional CTAs; navigation is text-only
- Don't introduce a third display weight between 56px and 100px — the scale jumps from readable to poster-sized, no comfortable middle ground
- Don't apply gradients to any surface — the palette is 100% flat fills
- Don't use the Ephidona script for body copy, navigation, or functional labels — it is decorative only
- Don't soften the white text with opacity below 80% for body content — if hierarchy is needed, drop the size and weight instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Carbon Canvas | `#0a0a0a` | Full-bleed page background, section bands |
| 1 | Voltage Card | `#1ef0e4` | Featured project cards, editorial callout panels |
| 2 | Image Plate | `#1a1a1a` | Photo containers, embedded media blocks |

## Elevation

No shadows, no depth, no glassmorphism. The design is deliberately flat — every element sits on the same plane. The impression of hierarchy comes from scale contrast (100px display vs 12px caption) and color contrast (white on black, magenta on cyan), not from elevation. This is a print-design, not a UI-design sensibility applied to the web.

## Imagery

Photography is warm-toned, candid, slightly desaturated — medium-format film aesthetic rather than polished commercial. Images are presented full-bleed or near-full-bleed with no rounded corners, no borders, and no decorative framing. A humanizing counterpoint to the machine typography: the photographer is shown mid-action, smiling, in a real space with natural light. The combination of a person + organic photo against the geometric type + flat cyan panels creates the core visual tension of the brand.

## Layout

Full-bleed dark canvas with no visible page margins constraining the content — elements break to the viewport edges. The hero is a typographic poster: oversized white text (ROU HUN FAN, UI DEV, DESIGN, MOTION & FRONTEND) wrapping asymmetrically across multiple columns, with a Voltage Cyan project card pasted on top at an offset position. Below, a full-width candid photo sits beside a large serif/script '10+ YEARS' stat block. The page rhythm alternates between text-dominant poster sections and image-dominant photo sections, separated by generous 80–120px vertical gaps. No sidebar, no sticky header, no max-width constraint — the layout is intentionally uncontained, like a zine spread.

## Agent Prompt Guide

## Quick Color Reference
- Background: #0a0a0a (Carbon)
- Text: #ffffff (Bone)
- Accent surface: #1ef0e4 (Voltage Cyan)
- Accent text: #e91e8c (Plasma Magenta)
- Decorative script: #ff3a1a (Ember)
- Border: #ffffff
- primary action: no distinct CTA color

## Example Component Prompts

1. **Display Headline Block**: Full-width section on #0a0a0a background. Three lines of text in AzeretMono weight 900 at 100px, line-height 1.0, color #ffffff, text-transform uppercase. Text wraps asymmetrically — first line left-aligned at 0px, second line offset 40px from left, third line full-width. Letter-spacing normal. No border, no padding, no margin around the block.

2. **Voltage Project Card**: Rectangular block 600px × 400px, background #1ef0e4, border-radius 0. Display text 'PROJECT TITLE' in AzeretMono weight 700 at 48px, color #e91e8c, centered horizontally, positioned 60px from top. Small body text 14px AzeretMono weight 400 #e91e8c below the title. An irregular organic shape in #e91e8c flat fill at the bottom edge, 200px wide, overlapping the card boundary by 20px.

3. **Script Overlay Label**: Ephidona weight 400 at 80px, color #ff3a1a, positioned absolutely over the bottom-left corner of a Voltage Cyan card, rotated -8 degrees. Single word or short phrase, no tracking adjustment.

4. **Full-Bleed Photo Section**: 100vw × 70vh image container, no border-radius, no border, no padding. Image object-fit cover. Immediately followed by a text block in AzeretMono weight 400 at 16px #ffffff, max-width 600px, on #0a0a0a background, with 80px margin-top from the photo.

5. **Monospace Navigation Bar**: Full-width strip on #0a0a0a, 60px height, padding 0 48px. Navigation items in AzeretMono weight 400 at 14px, #ffffff, uppercase, separated by 32px gap, left-aligned. No background fill on items, no borders, no hover background change — only color shift to #1ef0e4 on hover.

## Similar Brands

- **Locomotive** — Same editorial web-magazine layout with oversized display type, asymmetric column breaks, and a dark canvas punctuated by a single saturated accent color
- **Pentagram** — Brutalist typographic-poster hero treatments where type itself is the design, paired with full-bleed candid photography and zero decorative chrome
- **Rauno Freiberg** — Independent developer portfolio using monospaced system type at extreme scale against dark backgrounds, with flat saturated accent panels that feel pasted onto the page
- **Tobias van Schneider** — Personal portfolio using oversized condensed display type as the primary visual element, with accent color blocks and editorial spacing rhythm
- **Active Theory** — Dark-canvas creative studio site with flat saturated accent panels, oversized type, and a print-poster rather than app-UI sensibility

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon: #0a0a0a;
  --color-bone: #ffffff;
  --color-voltage-cyan: #1ef0e4;
  --color-plasma-magenta: #e91e8c;
  --color-ember: #ff3a1a;

  /* Typography — Font Families */
  --font-azeret-mono: 'Azeret Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-azeretmono-display-variant: 'AzeretMono (display variant)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ephidona: 'Ephidona', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.05;
  --text-display: 100px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-9: 9px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 80-120px;
  --card-padding: 32-48px;
  --element-gap: 8-16px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-carbon-canvas: #0a0a0a;
  --surface-voltage-card: #1ef0e4;
  --surface-image-plate: #1a1a1a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon: #0a0a0a;
  --color-bone: #ffffff;
  --color-voltage-cyan: #1ef0e4;
  --color-plasma-magenta: #e91e8c;
  --color-ember: #ff3a1a;

  /* Typography */
  --font-azeret-mono: 'Azeret Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-azeretmono-display-variant: 'AzeretMono (display variant)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ephidona: 'Ephidona', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.05;
  --text-display: 100px;
  --leading-display: 1;

  /* Spacing */
  --spacing-9: 9px;
}
```
