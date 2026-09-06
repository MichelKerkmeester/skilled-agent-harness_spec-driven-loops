# Moffitt.Moffitt. - — Style Reference
> curated gallery on bone-white linen

**Theme:** light

Moffitt.Moffitt. operates as a curated gallery on bone-white linen: every screen begins on a pure white canvas, then disappears into full-bleed photography and monoline serif type. The palette is deliberately chromatic-free — black, white, and three grays carry all interface weight, while color lives exclusively inside editorial artwork (the red gown, the cyan poster). Components are minimal to the point of invisibility: pill-shaped controls, hairline borders, no shadows, no gradients, no decoration. Typography is the brand — a whisper-weight display serif sets tone at headlines, a neo-grotesque sans does utility work. The effect reads as a printed annual report or museum wall text: confident, restrained, and confident in letting imagery do the heavy lifting.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, filled pill buttons, hairline borders on light surfaces, active icons |
| Bone | `#ffffff` | `--color-bone` | Page canvas, card surfaces, text on dark buttons, image overlays |
| Mist | `#f5f5f5` | `--color-mist` | Elevated surface wash, subtle card backgrounds, section dividers |
| Fog | `#ebecec` | `--color-fog` | Hairline dividers between feed cards, faint table borders |
| Ash | `#d8d8da` | `--color-ash` | Subtle structural borders, disabled state outlines |
| Graphite | `#595b60` | `--color-graphite` | Secondary text, supporting metadata, icon strokes |
| Steel | `#888888` | `--color-steel` | Muted helper text, timestamps, tertiary captions |

## Tokens — Typography

### Lyon — Whisper-weight display serif for editorial headlines, pull quotes, and section titles — the anti-convention weight 100 creates authority through restraint rather than volume, making the brand feel printed rather than web-native · `--font-lyon`
- **Substitute:** Lyon Display, Editorial New, Canela Thin, Playfair Display Hairline
- **Weights:** 100
- **Sizes:** 13px
- **Line height:** 1.00
- **Role:** Whisper-weight display serif for editorial headlines, pull quotes, and section titles — the anti-convention weight 100 creates authority through restraint rather than volume, making the brand feel printed rather than web-native

### Suisse — Neo-grotesque sans for body copy, navigation, button labels, tags, and utility UI — 400 reads body, 500 carries button labels and nav, 600 anchors subheadings; the wide weight range lets this one family run the entire interface without switching faces · `--font-suisse`
- **Substitute:** Suisse Int'l, Inter, Söhne, Neue Haas Grotesk
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 16px, 22px, 24px, 40px
- **Line height:** 1.00, 1.13, 1.17, 1.20, 1.25, 1.33, 1.39, 2.00
- **Role:** Neo-grotesque sans for body copy, navigation, button labels, tags, and utility UI — 400 reads body, 500 carries button labels and nav, 600 anchors subheadings; the wide weight range lets this one family run the entire interface without switching faces

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | — | `--text-caption` |
| body | 16px | 1.25 | — | `--text-body` |
| subheading | 22px | 1.2 | — | `--text-subheading` |
| heading-sm | 24px | 1.17 | — | `--text-heading-sm` |
| heading | 40px | 1.13 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 50px |
| cards | 5px |
| buttons | 50px |
| iconButtons | 50% |

### Layout

- **Section gap:** 40px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Filled Pill Button
**Role:** Primary action control

Black fill (#000000), white text (#ffffff), 50px border-radius (full pill), 11px vertical × 20px horizontal padding, Suisse 500 at 13-16px. Used for 'Our Services', 'Our Profile', 'Our Projects' and CTAs.

### Ghost Pill Button
**Role:** Secondary or filter action

Transparent fill, 1px Obsidian border (#000000), Obsidian text, 50px border-radius, 11px × 20px padding, Suisse 500 at 13px. Used for 'See more' and category filters like 'Music'.

### Circular Icon Button
**Role:** Navigation and progress control

50% radius (true circle), Obsidian 1px border, Obsidian icon stroke inside. Examples: the arrow button (→) and the 01/05 counter with progress ring. ~44px diameter.

### Split Hero Frame
**Role:** Full-bleed editorial opener

50/50 two-column layout, each half contains one full-bleed photograph edge-to-edge with no padding or radius. Headline (Lyon 100, ~40px, white) overlaid bottom-left on dark imagery, absent on light imagery.

### Editorial Pull Quote
**Role:** Long-form manifesto text

Pure white background, Lyon 100 at ~13-16px, Obsidian text, ~20-30px right margin from edge, free-flowing paragraph without a visible card container. 40px column gap to the right of follow-up content.

### Feed Card
**Role:** Portfolio grid item

5px border-radius, no shadow, full-bleed image fills the card. Tag pill (50px radius, 5-7px padding, Suisse 500 at 12px) overlaid top-left — tag variants: 'New Work' on white, 'Coming soon' on white, 'Team News' on Obsidian with white text. Hairline 1px Fog (#ebecec) divider between cards in the grid.

### Category Tag
**Role:** Content classification

50px pill radius, small (~5-7px padding), Suisse 500 at 12px. White fill with Obsidian text for active filters, transparent with 1px Obsidian border for unselected.

### Top Nav Bar
**Role:** Global site navigation

Transparent overlay on hero, no background fill. Left: circular 'm' wordmark in 1px Obsidian border. Right: hamburger menu icon (three horizontal lines) in Obsidian. Sits at the very top with ~20px padding.

### Slide Counter
**Role:** Carousel position indicator

Bottom-right of hero, displays '01/05' in Suisse 400 with a small circular progress indicator next to it. Functions as a stepper — no progress bar fill, just a ring or dot.

## Do's and Don'ts

### Do
- Use 50px border-radius for all buttons, tags, and filter pills — the pill shape is the signature control geometry
- Set the page canvas to pure #ffffff and let images bleed to the edge with no margin or framing
- Reserve Lyon weight 100 exclusively for headlines and pull quotes — never use it for body or UI labels
- Separate surfaces using 1px #ebecec hairlines and value contrast, never box-shadow
- Keep the palette fully achromatic in all interface chrome — any color must live inside editorial artwork
- Set body copy at Suisse 400, 16px, with generous line-height (1.25-1.39) to match the editorial register
- Use 20px element gaps and 40px section gaps to maintain the magazine-spread rhythm

### Don't
- Do not introduce a chromatic brand color, gradient, or decorative fill anywhere in the UI chrome
- Do not apply box-shadow to cards, buttons, or images — the design is deliberately flat
- Do not use Lyon weight 100 for functional labels, buttons, or navigation — it is a display face only
- Do not round card corners beyond 5px — the contrast between 50px pill controls and 5px cards is structural
- Do not add borders, backgrounds, or containers to the editorial pull-quote block — let it float on canvas
- Do not use bold weights (600+) for body copy — Suisse 500 is the heaviest functional weight
- Do not add drop-shadows or glows to the circular icon buttons or the slide counter

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background, the dominant surface — sets the gallery-floor tone |
| 2 | Wash | `#f5f5f5` | Subtle elevation layer for cards, inputs, secondary panels |
| 3 | Ink | `#000000` | Inverted surface for filled buttons, dark hero moments, image overlays |

## Elevation

The design deliberately avoids shadows — surfaces separate through value contrast (white vs. #f5f5f5 vs. black) and 1px hairline borders, never elevation. This flatness keeps the interface reading as printed editorial rather than app UI.

## Imagery

Photography is the dominant visual content and occupies the majority of screen real estate. Treatment is full-bleed, edge-to-edge, with sharp corners and no masks or rounded overlays. Images are editorial in register — architectural exteriors, human subjects in dramatic monochrome environments, cultural/civic moments — never product shots or stock photography. The color lives inside the photographs (a red gown, a cyan poster) rather than in the UI frame around them. There is no illustration, no 3D, no abstract graphics. Icons are minimal monochrome line work, approximately 1-1.5px stroke weight, matching the typography's restraint. The overall image-to-text ratio is roughly 70/30, leaning heavily on visual storytelling.

## Layout

Full-bleed page model with no max-width container — content reaches the viewport edge. The hero is a 50/50 split-screen with two photographs meeting at the center seam. Below the hero, the manifesto quote flows as a single column with generous right margin (the left ~60% holds text, right ~40% is white space). The feed section is a horizontal card grid (4 cards visible per row, scrollable) with tight 1px dividers between them. Navigation is a single-line top bar: logo far left, hamburger far right, no center cluster. Section transitions are seamless — no colored bands, no alternating backgrounds, just white space and the occasional 1px hairline. The rhythm is spacious and unhurried, reading more like a gallery walkthrough than a product page.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Obsidian)
- background: #ffffff (Bone)
- border: #ebecec (Fog) for hairlines, #000000 for strong rules
- accent: no distinct accent color — the palette is fully achromatic
- primary action: #000000 (filled action)

**Example Component Prompts**

1. *Create a hero split-screen:* Two full-bleed photographs side by side, 50/50 width, edge-to-edge with no gutter. Left image: a bus-stop poster at night. Right image: a woman in a red dress holding a violin against a concrete wall. Bottom-left overlay on the left panel: Lyon weight 100 at 40px, white text reading 'ACO 2026. / Beyond the stage.' A Ghost Pill Button labeled 'Music' and a 'See more' text link sit above the headline at 12-13px Suisse 500.

2. *Create an editorial pull-quote section:* Pure white canvas, no card. Left column ~55% width, Lyon weight 100 at 16px, Obsidian text, line-height 1.39, ~120-160 characters per line. Right column ~45% width, empty white space. No background, no border, no shadow.

3. *Create a filled pill button:* 50px border-radius, 11px vertical × 20px horizontal padding, Obsidian (#000000) background, Bone (#ffffff) text, Suisse weight 500 at 13-14px, no border, no shadow. Example labels: 'Our Services', 'Our Profile', 'Our Projects'.

4. *Create a feed card grid:* Four cards in a single horizontal row, each card 5px border-radius, no shadow, image fills card edge-to-edge. A Category Tag pill (50px radius, 5-7px padding, white fill, Obsidian text, 12px Suisse 500) overlaid top-left of each card. 1px Fog (#ebecec) hairline separator between cards. Card images: editorial photography, mixed light/dark.

5. *Create a circular icon button:* 44px diameter, 50% border-radius, 1px Obsidian border, transparent fill, Obsidian icon (arrow →, hamburger ☰, or progress ring) centered inside at ~16px.

## Similar Brands

- **Pentagram** — Same editorial-gallery aesthetic, full-bleed photography, achromatic interface, whisper-weight serif headlines on white
- **Manual (manualcreative.com)** — Same pill-button geometry, monochrome palette, large-scale photography, serif display type
- **Locomotive (locomotive.ca)** — Same hairline-border minimalism, full-bleed imagery, black-and-white interface with color confined to editorial artwork
- **Bureau Cool** — Same anti-decoration flatness, generous spacing, serif-led typographic identity, museum-label restraint
- **Wieden+Kennedy portfolio** — Same split-hero composition, 50/50 image layout, white-canvas navigation, typographic confidence

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;
  --color-mist: #f5f5f5;
  --color-fog: #ebecec;
  --color-ash: #d8d8da;
  --color-graphite: #595b60;
  --color-steel: #888888;

  /* Typography — Font Families */
  --font-lyon: 'Lyon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse: 'Suisse', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --text-heading: 40px;
  --leading-heading: 1.13;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-full: 50px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-tags: 50px;
  --radius-cards: 5px;
  --radius-buttons: 50px;
  --radius-iconbuttons: 50%;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-wash: #f5f5f5;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-bone: #ffffff;
  --color-mist: #f5f5f5;
  --color-fog: #ebecec;
  --color-ash: #d8d8da;
  --color-graphite: #595b60;
  --color-steel: #888888;

  /* Typography */
  --font-lyon: 'Lyon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse: 'Suisse', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body: 16px;
  --leading-body: 1.25;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --text-heading: 40px;
  --leading-heading: 1.13;

  /* Spacing */
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-full: 50px;
  --radius-full-2: 100px;
}
```
