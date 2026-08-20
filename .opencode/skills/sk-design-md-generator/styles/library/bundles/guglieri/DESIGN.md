# Guglieri — Style Reference
> monochrome typographic gallery. Every pixel is either ink-black, paper-white, or a gray between — hierarchy lives in the weight of Raveo Variable, never in color.

**Theme:** dark

Guglieri is a monochrome typographic gallery: pure obsidian canvas, one voice of custom variable display type at its heaviest weight, and zero chromatic noise. The entire system is achromatic — every interface element, border, and label lives on a grayscale between true black and pure white, with the only color in the experience coming from editorial imagery and artwork. Hierarchy is built through weight, size, and negative letter-spacing rather than color, with the custom Raveo Variable font pushing to weight 1000 to create visual mass without warmth. Components are stripped to their skeletons: pill buttons with hairline borders, generous section spacing, and text-driven navigation. The mood is a designer-critic's reading room — confident, editorial, anti-decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page background, card surfaces, primary canvas — the default stage for all content |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text, pill button fills, display headlines on dark, thin borders for reverse-contrast components |
| Carbon | `#111111` | `--color-carbon` | Input fields, secondary surface elevation, subtle dark borders — one shade above Obsidian for depth without contrast |
| Graphite | `#1c1c1c` | `--color-graphite` | Elevated surface layer above the canvas — for overlay cards, tooltips, and floating panels |
| Smoke | `#454545` | `--color-smoke` | Headline accent borders, secondary text, low-emphasis dividers |
| Ash | `#575757` | `--color-ash` | Body-level borders, inactive dividers, low-contrast separators between sections |
| Near Black | `#050505` | `--color-near-black` | Subtle hairlines and body borders that are nearly invisible against Obsidian |

## Tokens — Typography

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Raveo Variable Variable — Display and heading font at its heaviest weight (1000). The variable axis is not used — the system commits to maximum weight to create typographic mass without chromatic weight. Sizes scale from 64px display down to 12px micro-labels (e.g., nav items 'NEW', 'Feed'). Letter-spacing tightens aggressively at large sizes (-0.04em at 64px, -0.02em at 22px) to lock the glyphs into a single visual block. Font features 'blwf', 'cv03', 'cv04', 'cv09', 'cv11' activate specific stylistic alternates — a signature typographic fingerprint. No web-safe substitute captures this; 'Inter' at weight 900 is the closest match, but weight and openness will differ. · `--font-raveo-variable-variable`
- **Substitute:** Inter (weight 900) or Manrope (weight 800)
- **Weights:** 1000
- **Sizes:** 12px, 14px, 22px, 32px, 64px
- **Line height:** 1.00, 1.06, 1.18, 1.20, 1.60
- **Letter spacing:** -0.04em at 64px, -0.02em at 22px, normal at 12px
- **OpenType features:** `'blwf', 'cv03', 'cv04', 'cv09', 'cv11'`
- **Role:** Display and heading font at its heaviest weight (1000). The variable axis is not used — the system commits to maximum weight to create typographic mass without chromatic weight. Sizes scale from 64px display down to 12px micro-labels (e.g., nav items 'NEW', 'Feed'). Letter-spacing tightens aggressively at large sizes (-0.04em at 64px, -0.02em at 22px) to lock the glyphs into a single visual block. Font features 'blwf', 'cv03', 'cv04', 'cv09', 'cv11' activate specific stylistic alternates — a signature typographic fingerprint. No web-safe substitute captures this; 'Inter' at weight 900 is the closest match, but weight and openness will differ.

### System Sans-Serif — Secondary utility text — nav links, metadata, timestamps, captions. Weight 400 only; no bold variants. The system font acts as a quiet complement to Raveo's display voice. · `--font-system-sans-serif`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', Roboto
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Secondary utility text — nav links, metadata, timestamps, captions. Weight 400 only; no bold variants. The system font acts as a quiet complement to Raveo's display voice.

### Inter Display — One-off paragraph text at 22px — lighter weight than Raveo at the same size creates a body/heading tension within the same line height · `--font-inter-display`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 22px
- **Line height:** 1.18
- **Role:** One-off paragraph text at 22px — lighter weight than Raveo at the same size creates a body/heading tension within the same line height

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 22px | 1.18 | -0.44px | `--text-body` |
| heading-sm | 32px | 1.06 | — | `--text-heading-sm` |
| display | 64px | 1 | -2.56px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 116 | 116px | `--spacing-116` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| links | 8px |
| pills | 50px |
| buttons | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 116px
- **Card padding:** 40px
- **Element gap:** 10px

## Components

### Pill CTA Button
**Role:** Primary action trigger — the only filled button in the system

40px border-radius (full pill), 40px horizontal padding, ~28px vertical padding. White background (#ffffff) with a black arrow icon. No text label — the arrow IS the affordance. Hairline 1px border optional. Used for carousel next, send, go.

### Outline Pill Button
**Role:** Secondary action with ghost treatment

40-50px border-radius, white 1px border on Obsidian background, transparent fill. Arrow or dot inside. Inverts the primary pill: same shape, no fill.

### Top Navigation Bar
**Role:** Primary site navigation

Horizontal row, 8px element gap, 12px vertical padding. Brand block (name + local time) left, nav links right. Nav items in Raveo Variable at 12px weight 1000, tracking normal. Active item ('NEW') uses Paper White; inactive items use Ash (#575757) with 1px borders forming underline-style separators.

### Display Headline
**Role:** Section and page titles

Raveo Variable at 64px, weight 1000, line-height 1.0, letter-spacing -0.04em. Always Paper White on Obsidian. Two-line max. This is the loudest element on every page — it carries the brand voice alone.

### Carousel Pagination Dots
**Role:** Indicates position within a horizontal scroll gallery

Sequence of short horizontal lines (16-20px wide, 2-3px tall), Ash (#575757) inactive, Paper White active. Right-aligned under display headline. Spacing 10px between dots.

### Section Transition Label
**Role:** Bridge between content blocks ('Next — About')

Raveo Variable at 64px, weight 1000. Word 'Next' in Ash (#575757) at reduced opacity, dash separator, section name in Paper White. Sits at the leading edge of a full-bleed image or new section.

### Footer Link Block
**Role:** Social and contact links in the page footer

Two-column layout. Left column: intro text + email address in Raveo at 14-22px, weight 1000, Paper White. Right column: stacked social links (Twitter, Instagram, LinkedIn) at 32px Raveo weight 1000, no underlines, no bullets — just stacked heavy type.

### Brand Header
**Role:** Identity lockup in the top-left corner

Two lines: 'Claudio Guglieri' in Raveo Variable 14px weight 1000 Paper White, with 'Local time — HH:MM City' beneath in system sans-serif 12px weight 400 Ash. No logo mark — the name IS the mark.

### Bordered Link
**Role:** Inline text links with border underlines

8px border-radius on hover or focus. Text in Paper White, 1px Ash border as underline. 8px padding on tap target.

### Image Gallery Card
**Role:** Container for editorial imagery in carousel or grid

No card surface — images float on Obsidian with 40px between cards. Optional 4px radius on individual images. Images are the content; no shadow, no border, no background plate.

## Do's and Don'ts

### Do
- Use Raveo Variable at weight 1000 for all headings and display text — never reduce to 700 or below; the heaviness is the signature
- Set letter-spacing to -0.04em on 64px display text and -0.02em on 22-32px headings; let it breathe to 0 at 12px micro-labels
- Maintain 0% colorfulness: every UI color must be achromatic. Never introduce a brand hue, accent, or state color
- Use the 116px section gap between major content blocks; this generosity is what makes the page feel like a gallery, not a feed
- Set pill buttons to 40-50px border-radius so they read as fully rounded, not as rounded rectangles
- Place carousel pagination dots right-aligned directly under the display headline, spaced 10px apart
- Activate the font features 'blwf', 'cv03', 'cv04', 'cv09', 'cv11' on every Raveo Variable instance — they are part of the typographic identity

### Don't
- Never introduce color — no blues, no greens, no warm tones. The only color allowed is grayscale and the hues within editorial imagery
- Never set Raveo Variable below weight 1000; lighter weights break the heavy typographic voice
- Never use a standard sans-serif for display text; Raveo's compressed, heavy form factor is the entire brand
- Never add drop shadows, glows, or gradients — the system is flat by intent; depth comes from grayscale layering only
- Never center body text — left-align everything except display headlines; the asymmetric grid is the layout voice
- Never pad buttons less than 40px horizontally; pill shapes need space to read as pills, not chips
- Never use icons in the nav row; nav items are heavy type only. The icon language is reserved for buttons and cursors

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian | `#000000` | Page canvas — the base floor for all content |
| 1 | Carbon | `#111111` | Input fields and subtle elevation — one shade above the canvas for form surfaces |
| 2 | Graphite | `#1c1c1c` | Floating panels, overlay cards, tooltips — two shades above the canvas |
| 3 | Paper White | `#ffffff` | Inverted surface for filled pill buttons and the rare reverse-contrast element |

## Elevation

The system is intentionally flat. No drop shadows, no glows, no gradients. Depth is implied by grayscale layering (Obsidian canvas → Carbon form surface → Graphite overlay) and by spacing alone. This flatness is the signature: every pixel of visual weight goes into typography, not into chrome.

## Imagery

Imagery is editorial and high-contrast: black-and-white photography of working environments (desks, monitors, rooms) anchors content sections, while colorful 3D cursor renderings and graphic illustrations punctuate the hero — these are the only chromatic elements on the page, and they function as artwork within an otherwise monochrome frame. Images float on Obsidian with no borders or shadows; they are edge-to-edge or generous-margined, never thumbnail-sized. No icons in the UI itself — interaction symbols are reserved for buttons. Icon style in any UI context: none; the system relies on type and arrows. Photography treatment is documentary and candid (B&W, no color grading, no vignettes). The visual density is low: a few large images per page, each given room to breathe.

## Layout

Full-bleed dark page with max-width 1200px content container. Hero is a single display headline right-aligned beside a left-aligned image gallery, with carousel controls beneath the headline. Sections are separated by 116px vertical gaps with no dividers or alternating bands — the rhythm comes from spacing alone. The footer is a two-column block: left column is contact text, right column is stacked social links in heavy type, both on the same Obsidian surface. Navigation is a sticky top bar with brand left and nav right. Content sections use asymmetric compositions (text-right/image-left, or full-bleed image with overlay type) rather than centered stacks. The 'Next — Section' transition pattern is a recurring device: a large display label in mixed gray and white at the leading edge of the next section.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000000
- surface: #111111
- elevated surface: #1c1c1c
- text: #ffffff
- border: #575757
- accent: none
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Display headline block**: 64px Raveo Variable weight 1000, color #ffffff, line-height 1.0, letter-spacing -2.56px. Right-aligned within a 1200px max-width container. Sits on #000000 canvas with 116px space above and below.

2. **Pill navigation button**: 12px Raveo Variable weight 1000, text #ffffff (active) or #575757 (inactive). No background, no border. 8px gap between items, 12px vertical padding. Horizontal row, left-aligned brand / right-aligned nav.

3. **Footer social link stack**: 32px Raveo Variable weight 1000, color #ffffff, line-height 1.06, letter-spacing -0.64px. Three items stacked vertically with 0px gap between them. No bullets, no underlines, no icons. Left-aligned in a two-column footer layout.

4. **Section transition label**: 64px Raveo Variable weight 1000. First word in #575757, em-dash, second word in #ffffff. Left-aligned, 1200px max-width, sitting at the top edge of a full-bleed B&W image section.

5. **Carousel pagination**: Five short horizontal bars (18px wide, 2px tall), spaced 10px apart, right-aligned. Bars 1-4 in #575757, bar 5 (current) in #ffffff. Sits 24px below the display headline.

## Similar Brands

- **Are.na** — Same ultra-minimal dark canvas with no chrome, left-aligned typographic navigation, and editorial image blocks floating on a near-black surface
- **Rauno Freiberg** — Personal portfolio with monochrome palette, custom variable display type, and large negative-tracked headlines as the primary brand element
- **Vercel Design** — Pure black background, system sans-serif body, and one display weight carrying all hierarchy — minimal UI lets the type do the work
- **Minimal Gallery (independent designers)** — Treats the personal site as a gallery wall — generous spacing, B&W editorial photography, and no decorative UI elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #111111;
  --color-graphite: #1c1c1c;
  --color-smoke: #454545;
  --color-ash: #575757;
  --color-near-black: #050505;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-raveo-variable-variable: 'Raveo Variable Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 22px;
  --leading-body: 1.18;
  --tracking-body: -0.44px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.06;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -2.56px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w1000: 1000;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-116: 116px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 116px;
  --card-padding: 40px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 28px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-links: 8px;
  --radius-pills: 50px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-obsidian: #000000;
  --surface-carbon: #111111;
  --surface-graphite: #1c1c1c;
  --surface-paper-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #111111;
  --color-graphite: #1c1c1c;
  --color-smoke: #454545;
  --color-ash: #575757;
  --color-near-black: #050505;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-raveo-variable-variable: 'Raveo Variable Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 22px;
  --leading-body: 1.18;
  --tracking-body: -0.44px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.06;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -2.56px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-116: 116px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 28px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
}
```
