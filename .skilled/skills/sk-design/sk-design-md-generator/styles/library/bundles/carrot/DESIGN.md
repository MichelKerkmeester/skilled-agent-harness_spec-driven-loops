# Carrot — Style Reference
> Activist poster on a single sheet of acid-lime paper — confident, flat, and slightly loud.

**Theme:** light

Carrot commits to a radical single-color canvas — an electric chartreuse field that saturates the entire page and makes the brand impossible to misread. The rest of the system is deliberately stripped: black ink for type and structural elements, white for surfaces and button text, and a dark olive reserved for quiet secondary marks. Typography draws a sharp line between editorial and functional — a light-weight custom serif (Signifier at 300) carries the hero voice while DM Sans handles everything utilitarian at conversational weights. The result reads like a printed sustainability manifesto rendered as a web product: confident color, generous breathing room, zero ornament, and an almost rebellious refusal to use shadows, gradients, or rounded softness.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Citrus Field | `#d4e04a` | `--color-citrus-field` | Full-page canvas and dominant brand surface — the chartreuse wash that defines the entire product. Used as hero background, section backgrounds, and feature card backgrounds with no variation or gradient |
| Carbon Black | `#000000` | `--color-carbon-black` | Primary type, filled CTA buttons, icon strokes, borders, and graphic silhouettes (the bottle hero). The structural ink of the system |
| Paper White | `#ffffff` | `--color-paper-white` | Text on black buttons, product screenshot card backgrounds, and any inverted surfaces. Pure white — not off-white |
| Moss Shadow | `#535521` | `--color-moss-shadow` | Quiet secondary accent for subdued text or border moments where pure black would feel too heavy. Rarely used — the chartreuse does the color work |

## Tokens — Typography

### Signifier — Display and large headings only — the editorial voice of the brand. The 300 weight is deliberately anti-convention: at 72px it whispers authority rather than shouts. The old-style numerals (onum) add a printed-magazine quality to any data that appears. Used exclusively for hero and section-headline moments. · `--font-signifier`
- **Substitute:** Source Serif 4 (weight 300) or Cormorant Garamond (weight 300)
- **Weights:** 300
- **Sizes:** 50px, 72px
- **Line height:** 1.15
- **Letter spacing:** -0.01em (-0.72px at 72px, -0.50px at 50px)
- **OpenType features:** `"liga" on, "onum" on`
- **Role:** Display and large headings only — the editorial voice of the brand. The 300 weight is deliberately anti-convention: at 72px it whispers authority rather than shouts. The old-style numerals (onum) add a printed-magazine quality to any data that appears. Used exclusively for hero and section-headline moments.

### DM Sans — Body copy, subheadings, UI labels, buttons, card titles, navigation. 400 for running text and 500 for emphasis (card titles, button labels). Tight line-height (1.25) at heading sizes and loose (1.40) at body sizes creates a clear rhythm shift between scan and read modes. · `--font-dm-sans`
- **Substitute:** Inter or system-ui sans-serif
- **Weights:** 400, 500
- **Sizes:** 16px, 17px, 20px, 24px, 29px
- **Line height:** 1.25 (headings), 1.40 (body)
- **Letter spacing:** -0.01em (-0.16px at 16px, -0.29px at 29px)
- **OpenType features:** `"liga" on`
- **Role:** Body copy, subheadings, UI labels, buttons, card titles, navigation. 400 for running text and 500 for emphasis (card titles, button labels). Tight line-height (1.25) at heading sizes and loose (1.40) at body sizes creates a clear rhythm shift between scan and read modes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.4 | -0.16px | `--text-body-sm` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.24px | `--text-heading-sm` |
| heading | 29px | 1.25 | -0.29px | `--text-heading` |
| display-sm | 50px | 1.15 | -0.5px | `--text-display-sm` |
| display | 72px | 1.15 | -0.72px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 24px
- **Element gap:** 32px

## Components

### Primary Filled Button
**Role:** Main conversion action — Demo, Get in touch, Sign up

Solid black background (#000000), white text (#ffffff), DM Sans 500 at ~16px. Zero border-radius — completely sharp corners. Padding approximately 8px vertical, 14px horizontal. Tight, dense, utilitarian. Sits against the chartreuse field like a black stamp.

### Ghost Text Button
**Role:** Secondary actions or inline links

No background, black text, no border. Same DM Sans 500 weight and size as the primary button. The chartreuse shows through, so the button reads as text with a click target.

### Navigation Bar
**Role:** Top-level site navigation

Sits directly on the chartreuse with no separator. Brand wordmark (DM Sans 500) with a small carrot glyph on the left, text links in DM Sans 400, and two compact filled buttons (Demo, Log in) on the right. Height approximately 56-64px. No background fill — the chartreuse is the nav.

### Feature Card with Device Mockup
**Role:** Product capability explanations in the 3-column grid

White (#ffffff) background card with a product screenshot or device mockup at the top. Card padding ~24px, zero radius, no shadow. Title in DM Sans 500 at ~20px in black. Body copy in DM Sans 400 at 16px. The white surface against the chartreuse is the primary visual separator — no border needed.

### Hero Split Section
**Role:** Above-the-fold brand statement

Two-column layout: left side holds a Signifier 300 headline at 72px with negative tracking, right side holds a full-bleed product visual (the black bottle silhouette on dotted chartreuse). Below the headline, a short body paragraph in DM Sans 400 with a primary filled button. The dotted grid pattern behind the bottle is a subtle but signature texture.

### Section Headline Block
**Role:** Major section intros (e.g. 'Commercial Real Estate')

Signifier 300 at 50px, left-aligned, with generous 48px top margin separating it from the preceding section. No subheadline or eyebrow — the serif weight does all the structural work.

### Three-Column Feature Grid
**Role:** Product capability showcase

Three equal columns on the chartreuse field with 32px column gap. Each column stacks: white mockup card → title (DM Sans 500) → body (DM Sans 400). No card borders, no shadows — separation comes purely from the white-on-chartreuse contrast.

### Product Device Mockup
**Role:** Embedded product screenshots

Tablet, laptop, and phone frames containing actual app UI. Frames have a thin black or dark border, no shadow, zero radius. The device screens show the product in its native light theme (white UI with chartreuse accents), creating a meta-visual where the product echoes the marketing page.

### Dotted Grid Texture
**Role:** Background pattern behind hero visual

A uniform grid of small black dots on the chartreuse, creating a subtle technical/blueprint texture behind the bottle silhouette. Dot spacing approximately 24-32px. Not used everywhere — reserved for the hero area to add depth without breaking the flat aesthetic.

## Do's and Don'ts

### Do
- Use Citrus Field (#d4e04a) as the background for every section of every page — never break the field with a different canvas color.
- Set all border-radius to 0px across cards, buttons, inputs, and images. Sharp corners are the system.
- Reserve Signifier 300 for headlines at 50px and above. Never use it for body copy or UI labels.
- Use 120px vertical margins between major sections to let the chartreuse breathe.
- Default all action buttons to the black filled variant. Ghost buttons are only for secondary inline actions.
- Include "liga" and "onum" font features on Signifier headings — the old-style numerals are a signature detail.
- Keep type tracking at -0.01em (1%) across all sizes for consistent optical density.

### Don't
- Do not introduce shadows, gradients, or blur effects — the flat aesthetic is load-bearing.
- Do not use rounded corners on any element, even inputs or tags. The system is all sharp edges.
- Do not add a second brand color or a chromatic accent beyond the chartreuse, black, white, and olive.
- Do not set body copy in a serif — DM Sans handles everything below 50px.
- Do not place white cards on a white background or black buttons on a black background. The chartreuse must always be visible as a separator.
- Do not use weights above 500 in DM Sans or above 300 in Signifier — the type system is deliberately narrow.
- Do not darken or tint the chartreuse for hover states or section variants. The single color is the single color.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Citrus Canvas | `#d4e04a` | The entire page — no other base surface exists. Hero, sections, and gaps all share this single field. |
| 2 | White Card | `#ffffff` | Product screenshot cards and device mockup containers that need to lift off the chartreuse. |
| 3 | Black Inversion | `#000000` | CTA buttons and the hero bottle silhouette — solid black forms floating on the chartreuse. |

## Elevation

The system has zero shadows and zero rounded corners. Depth is created entirely through color contrast: the chartreuse field, white cards, and black forms stack visually without any softness. This is a deliberate flat-design conviction — elevation would dilute the poster-like impact of the single-color canvas.

## Imagery

The visual system is product-screenshot driven with a strong illustrative anchor. The hero features a large flat black silhouette of a bottle (the Carrot mascot/product metaphor) sitting on a dotted grid pattern — this is geometric, completely flat, and monochrome. Product showcases use realistic device mockups (tablet, laptop, phone) containing the actual app UI, which itself uses white surfaces and chartreuse accents that echo the marketing page. There is no lifestyle photography, no abstract gradients, no 3D renders. Photography, when it appears (like the Commercial Real Estate section), is real architectural imagery — modern glass buildings — treated at full saturation with no duotone or color grading. Icons are simple and appear to be thin-stroke or filled black glyphs at small sizes.

## Layout

The page operates on a max-width of approximately 1200px centered on the chartreuse field. The hero is a split layout: left column holds the serif headline + body + CTA (roughly 45% width), right column holds the product visual (roughly 55% width). Below the hero, the page flows into a 3-column equal-width feature grid with 32px gutters, then into single-column section intros with left-aligned Signifier headlines. Vertical rhythm is driven by 120px section gaps — the generous spacing is critical to letting the chartreuse breathe. Navigation is a simple top bar with no sticky behavior visible, no sidebar, and no mega-menu. The overall feel is editorial: wide margins, long line lengths for body, and unhurried vertical pacing.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000
- Background: #d4e04a (Citrus Field)
- Border: #000000
- Accent: #535521 (Moss Shadow, secondary only)
- primary action: #000000 (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Create a three-column feature grid**: Citrus Field background. Three equal columns with 32px gap. Each column: white (#ffffff) card with 24px padding, zero radius, no shadow, containing a device mockup image at the top. Below the card: title in DM Sans 500 at 20px, color #000000. Body in DM Sans 400 at 16px, color #000000. 120px margin above the grid.

3. **Create a section headline**: Citrus Field background. Signifier weight 300 at 50px, color #000000, letter-spacing -0.50px, line-height 1.15. Left-aligned. 48px top margin from preceding content. No subheadline, no eyebrow text.

4. **Create a navigation bar**: Sits directly on Citrus Field with no background fill or separator. Brand wordmark "Carrot" in DM Sans 500 with a small carrot glyph. Center: text links in DM Sans 400. Right: two filled black buttons (Demo, Log in) with white text, DM Sans 500, 8px/14px padding, zero radius. Height 64px. Page max-width 1200px centered.

5. **Create a product device mockup card**: White (#ffffff) card, zero radius, no shadow, no border. Contains a framed tablet/laptop/phone screenshot. Device frame is thin black border, zero radius. The app UI inside uses white backgrounds with chartreuse (#d4e04a) accent buttons to echo the marketing page.

## Color Philosophy

The system is built on a single, non-negotiable constraint: the page is chartreuse, full stop. This is not a brand that uses a color — it IS a color. Every design decision either supports the flatness (no shadows, no gradients, sharp corners) or creates the minimum contrast needed for legibility (black ink, white surfaces). The dark olive #535521 exists as a safety valve for moments where pure black feels too aggressive, but it is rarely the right answer. An AI agent should treat any impulse to add a new color, introduce a gradient, or soften an edge as a sign that the system is being broken.

## Similar Brands

- **Huel** — Same single-color full-bleed canvas approach with bold black type and zero ornament — a sustainability brand that commits to one loud background color as its entire visual identity.
- **Oatly** — Editorial sustainability voice using a light-weight serif for headlines paired with a clean sans for body, and a brand-defining flat background color used without apology.
- **Allbirds** — Minimalist sustainability brand with zero shadows, sharp corners, and a willingness to let a single color do the heavy lifting across the entire page.
- **Nothing (nothing.tech)** — Flat design conviction with hard edges, monochrome-on-color compositions, and product silhouettes as hero graphics — though Nothing is dark where Carrot is acid-bright.
- **World Economic Forum** — Editorial publishing layout with generous 120px section gaps, left-aligned serif headlines at light weights, and a calm three-column grid rhythm.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-citrus-field: #d4e04a;
  --color-carbon-black: #000000;
  --color-paper-white: #ffffff;
  --color-moss-shadow: #535521;

  /* Typography — Font Families */
  --font-signifier: 'Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.24px;
  --text-heading: 29px;
  --leading-heading: 1.25;
  --tracking-heading: -0.29px;
  --text-display-sm: 50px;
  --leading-display-sm: 1.15;
  --tracking-display-sm: -0.5px;
  --text-display: 72px;
  --leading-display: 1.15;
  --tracking-display: -0.72px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 24px;
  --element-gap: 32px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-citrus-canvas: #d4e04a;
  --surface-white-card: #ffffff;
  --surface-black-inversion: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-citrus-field: #d4e04a;
  --color-carbon-black: #000000;
  --color-paper-white: #ffffff;
  --color-moss-shadow: #535521;

  /* Typography */
  --font-signifier: 'Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.24px;
  --text-heading: 29px;
  --leading-heading: 1.25;
  --tracking-heading: -0.29px;
  --text-display-sm: 50px;
  --leading-display-sm: 1.15;
  --tracking-display-sm: -0.5px;
  --text-display: 72px;
  --leading-display: 1.15;
  --tracking-display: -0.72px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-120: 120px;
}
```
