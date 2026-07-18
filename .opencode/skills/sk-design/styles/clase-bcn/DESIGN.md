# Clase bcn — Style Reference
> editorial gallery on white wall

**Theme:** light

Clase bcn is an editorial gallery on a white wall: a branding agency whose portfolio reads like a museum catalogue. The interface is almost invisible — text, hairline dividers, and full-bleed project imagery do all the work. A single sans-serif (Suisse Int'l) at one weight (400) carries every element, from navigation labels to oversized project titles. Whitespace is generous and structural: project cards span the full viewport with titles and subtitles overlaid directly on photography. The only interactions are text links with arrow indicators; there are no buttons, no fills, no shadows, no decorative UI chrome. Color appears as content — individual project case studies bring their own palettes as background fills — while the chrome stays achromatic and quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surface base, text on dark cards |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hairline borders, nav labels — the structural anchor of every element |
| Carbon | `#0a0a0a` | `--color-carbon` | Secondary text and deep surfaces where pure black reads too harsh |
| Concrete | `#939393` | `--color-concrete` | Muted navigation labels, secondary link text, inactive nav state |
| Ash | `#aaaaaa` | `--color-ash` | Tertiary link borders and subdued annotation text |
| Plaster | `#e8e8e8` | `--color-plaster` | Subtle surface division, alternating card backgrounds |
| Sumi | `#0a0000` | `--color-sumi` | Near-black project card background — reads as deepest neutral |
| Slate Night | `#262a36` | `--color-slate-night` | Project card background — slightly cool dark, content-driven not UI |
| Terracotta Blush | `#efccbe` | `--color-terracotta-blush` | Project card background — warm content fill, not a UI accent |
| Verdant | `#43d491` | `--color-verdant` | Project card background — vivid content fill, not a UI accent |

## Tokens — Typography

### SuisseIntl-Regular — SuisseIntl-Regular — detected in extracted data but not described by AI · `--font-suisseintl-regular`
- **Weights:** 400
- **Sizes:** 24px, 28px, 45px
- **Line height:** 1.11, 1.17, 1.21, 1.25, 1.79, 2.01, 2.44
- **Role:** SuisseIntl-Regular — detected in extracted data but not described by AI

### Suisse Int'l — Single typeface at a single weight carries the entire interface — navigation, body, and display. The refusal to use a bold or italic weight forces hierarchy through size, line-height, and whitespace alone. The variable line-heights (1.11 for tight display stacks, 1.79–2.44 for body) show that this one weight is stretched across very different densities. · `--font-suisse-intl`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk, Helvetica Now
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.11, 1.17, 1.21, 1.25, 1.79, 2.01, 2.44
- **Role:** Single typeface at a single weight carries the entire interface — navigation, body, and display. The refusal to use a bold or italic weight forces hierarchy through size, line-height, and whitespace alone. The variable line-heights (1.11 for tight display stacks, 1.79–2.44 for body) show that this one weight is stretched across very different densities.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 24px | 1.17 | — | `--text-caption` |
| subheading | 28px | 1.21 | — | `--text-subheading` |
| heading | 45px | 1.11 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 100px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Minimal text-only site header

Transparent background sitting directly on the page canvas. No logo mark, no fill, no border-bottom. Left side: five text labels (Cl, Projects, Studio, Contact, Tips) separated by ~20px gaps, 24px Suisse Int'l, #000000 active and #939393 inactive. Right side: language selector ('English') in the same treatment. No sticky behavior, no shadow, no padding beyond vertical breathing room.

### Statement Headline
**Role:** Opening page declaration

A single block of body-length text set at the largest type size (45px), line-height 1.11, color #000000, left-aligned. No separate label, no eyebrow, no CTA below — the statement IS the hero. Occupies the top quarter of the page with generous margin below before the first project card.

### Full-Bleed Project Card
**Role:** Portfolio case study entry

Each project spans the full viewport width with zero border-radius. A background fill (project-specific: #43d491, #0a0000, #efccbe, #262a36, or a photograph) covers the card. Overlay text sits in the top-left corner with 20px padding from all edges: project name at 28px line-height 1.21 #000000, subtitle at 24px line-height 1.17 #000000, then a 'See the case →' text link. No hover state, no shadow, no border — the card edge is defined purely by where the next card begins.

### Photographic Project Card
**Role:** Image-led portfolio entry

Same structural treatment as the colored Project Card but the background is a full-bleed photograph. Text overlay uses the same 20px padding, 28px title, 24px subtitle, and text link. Typography remains #000000 on light imagery; white or near-black text on dark imagery. No gradient overlays or scrims — readability is expected from image choice.

### Text Link with Arrow
**Role:** The only interactive element in the system

Plain text label followed by a right arrow glyph (→). 24px Suisse Int'l weight 400, color #000000. No underline, no button fill, no border, no padding. Spacing between label and arrow is tight. This is the universal interaction pattern — it replaces every conventional button across the site.

### Footer
**Role:** Minimal page closer

Same 20px horizontal padding as project cards. Contains text links and copyright in 24px #000000. No social icons, no newsletter form, no decorative elements. The footer's job is to be quiet and invisible until you scroll there.

## Do's and Don'ts

### Do
- Use Suisse Int'l (or a neo-grotesque substitute like Inter) at weight 400 for every element — no bold, no italic, no second family
- Let project imagery and project color fills carry all visual variety; keep all UI chrome in #000000 and #ffffff
- Use 20px padding consistently for all text-block insets (navigation, card text, footer)
- Separate projects with 100px vertical breathing room — let each card exist in its own visual silence
- Mark every interaction as a plain text link with a → arrow, never as a filled or outlined button
- Scale hierarchy through font size and line-height only — 24px for body, 28px for subtitles, 45px for display
- Keep border-radius at 0 across all elements — corners are sharp, the page is a grid

### Don't
- Don't introduce buttons, pills, chips, or any filled interactive component — this system has no buttons
- Don't add shadows, gradients, or border effects to cards or images — surface depth comes from color contrast alone
- Don't use bold or semibold weights — weight 400 is the only voice; hierarchy is size-only
- Don't use #43d491, #efccbe, or #262a36 as UI accents — they belong only inside project card backgrounds
- Don't add a logo mark, wordmark treatment, or branded icon — the word 'Cl' in the nav is the entire identity mark
- Don't constrain the layout to a max-width container — project cards must be full-bleed
- Don't add hover animations, transitions, or micro-interactions — the site reads as static, like a printed catalogue

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background and card base for light projects |
| 1 | Plaster | `#e8e8e8` | Subtle off-white for content sections that need tonal contrast |
| 2 | Carbon | `#0a0a0a` | Deepest project card fill — white text sits on top |

## Elevation

The system has no shadows. Depth is communicated entirely through color contrast between adjacent surface fills (white canvas → photographic card → colored card → dark card) and through generous vertical whitespace between sections. A 1px black border is the strongest structural device in use, and even that is rare.

## Imagery

Photography is full-bleed and architectural — gallery interiors, product shots on neutral backgrounds, campaign artwork. Images are raw-edged with no rounded corners, no shadows, and no masks. The treatment is documentary, not stylized: subjects (museum spaces, furniture, concert halls) are presented at their natural aspect ratio, cropped only by the viewport. There are no people, no lifestyle scenes, no stock-style compositions. Illustration is absent; the only graphic element is the Kave Home chair sketch, which is hand-drawn line work on white — consistent with the editorial-print language. Icons are absent; navigation is text-only.

## Layout

Full-bleed layout with no max-width constraint. The page is a vertical stack of full-viewport-width project cards separated by whitespace, preceded by a minimal text-only navigation and a single oversized statement headline. The top nav is a single horizontal row: five left-aligned links, one right-aligned language label. The statement headline sits at the top of the content area, left-aligned, occupying roughly 15% of the page height. Below it, project cards stack vertically — each card fills the viewport width, contains its title/subtitle/link in the top-left corner with 20px inset, and flows directly into the next card with no gap or divider. There are no sidebar, no multi-column grids, no card-of-cards arrangements. The rhythm is: statement → project → project → project → footer, with each project given equal visual weight.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- border: #000000
- muted text: #939393
- project card surface: project-specific (no fixed UI accent)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Full-Bleed Project Card (Photographic)** — 100vw width, viewport-tall, no border-radius. Background is a full-bleed photograph. Top-left inset of 20px contains: project name at 28px line-height 1.21 #000000, subtitle at 24px line-height 1.17 #000000, then a 'See the case →' text link at 24px #000000. No overlay, no scrim, no border.

3. **Full-Bleed Project Card (Color Fill)** — 100vw width, ~60vh tall, no border-radius. Background fill is a single solid color (e.g. #43d491, #efccbe, #262a36, or #0a0000). Same 20px top-left text inset as photographic cards. Text color adjusts: #000000 on light fills, #ffffff on dark fills.

4. **Text Link with Arrow** — 24px Suisse Int'l weight 400, #000000, followed by a → arrow glyph at the same size. No underline, no button background, no border, no padding. The arrow has ~4px space between it and the label text. This is the system's only interaction component.

5. **Top Navigation** — Transparent row on #ffffff, no border-bottom, no background fill. Left group: 'Cl · Projects · Studio · Contact · Tips' at 24px #000000 separated by ~20px gaps, with 'Cl' as the active/brand label. Right group: 'English' at 24px #939393. No logo, no icons, no sticky behavior.

## Similar Brands

- **Pentagram** — Same editorial-portfolio language — full-bleed project imagery, minimal text-only navigation, no buttons or decorative UI chrome
- **Manual (manualcreative.com)** — Single-weight sans-serif at large display sizes, project cards as full-viewport images with overlaid text, zero interaction chrome
- **Hasselblad Foundation** — Museum-catalogue restraint — generous whitespace, single typeface, photography as the primary content, text links with arrows as the only affordance
- **Studio Dumbar** — Dutch-design agency portfolio discipline: monochrome UI, project case studies as full-bleed images, minimal nav, no decorative elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-carbon: #0a0a0a;
  --color-concrete: #939393;
  --color-ash: #aaaaaa;
  --color-plaster: #e8e8e8;
  --color-sumi: #0a0000;
  --color-slate-night: #262a36;
  --color-terracotta-blush: #efccbe;
  --color-verdant: #43d491;

  /* Typography — Font Families */
  --font-suisseintl-regular: 'SuisseIntl-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 24px;
  --leading-caption: 1.17;
  --text-subheading: 28px;
  --leading-subheading: 1.21;
  --text-heading: 45px;
  --leading-heading: 1.11;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-100: 100px;

  /* Layout */
  --section-gap: 100px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-plaster: #e8e8e8;
  --surface-carbon: #0a0a0a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-carbon: #0a0a0a;
  --color-concrete: #939393;
  --color-ash: #aaaaaa;
  --color-plaster: #e8e8e8;
  --color-sumi: #0a0000;
  --color-slate-night: #262a36;
  --color-terracotta-blush: #efccbe;
  --color-verdant: #43d491;

  /* Typography */
  --font-suisseintl-regular: 'SuisseIntl-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 24px;
  --leading-caption: 1.17;
  --text-subheading: 28px;
  --leading-subheading: 1.21;
  --text-heading: 45px;
  --leading-heading: 1.11;

  /* Spacing */
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-100: 100px;
}
```
