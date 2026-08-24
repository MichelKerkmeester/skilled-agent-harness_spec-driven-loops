# Tally Forms — Style Reference
> Notebook doodles on warm paper — a gray-paper canvas scattered with magenta-pink hand-drawn marks and centered editorial headlines.

**Theme:** light

Tally's visual system reads as 'notebook doodles on warm paper' — a quiet, editorial interface where a warm gray canvas (#e0e0df) carries white card surfaces and almost everything else steps out of the way so that one vivid magenta-pink (#f81ce5) can do the emotional work. That pink is reserved for illustration strokes, icon outlines, and the occasional decorative border on a feature card — it never fills a button. Conversion is handled by a single classic blue (#0070d7), keeping brand expression and action expression separate. Typography is Inter in a wide weight range, tracked tight at -0.031em, with a 64px display headline that feels closer to a magazine masthead than a SaaS hero. Hand-drawn squiggles, underlines, and star/confetti motifs float around the margins, turning the page edges into a sketchbook rather than leaving them as dead space. Cards are flat white on warm gray with a subtle warm-tinted shadow stack, rounded at 10px, and the overall rhythm is comfortable — generous gaps, centered hero, then 2-up feature columns.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Tally Magenta | `radial-gradient(circle, rgba(248,28,229,0.36) 0%, rgba(248,28,229,0) 70%)` | `--color-tally-magenta` | Pink decorative accent for icons, marks, and small graphic details. Do not promote it to the primary CTA color; Decorative focus-ring and glow tint used to draw the eye to a highlighted feature card, applied as a soft 2–4px outer ring rather than a fill |
| Action Blue | `#0070d7` | `--color-action-blue` | Primary action buttons only — the lone chromatic fill in the system, used to mark conversion moments without competing with the magenta brand mark |
| Ink | `#37352f` | `--color-ink` | Primary text, heading fills, and the dominant dark border color across cards, body elements, and form chrome. A warm near-black rather than pure black |
| Paper | `#e0e0df` | `--color-paper` | Page canvas — the warm light-gray background that all white card surfaces sit on. The signature surface of the system |
| White | `#ffffff` | `--color-white` | Card surfaces, form previews, input fields, and icon fills on the canvas. Provides the only bright surface layer |
| Mist | `#f3f3f3` | `--color-mist` | Subtle elevated or muted surface for secondary panels, code blocks, and hover washes — a half-step darker than pure white |
| Graphite | `#898884` | `--color-graphite` | Secondary text, helper copy, and tertiary borders on icons and body elements |
| Ash | `#777672` | `--color-ash` | Muted borders, inactive dividers, and low-emphasis strokes for icons and form elements |
| Charcoal | `#45433e` | `--color-charcoal` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Black | `#000000` | `--color-black` | Heading borders, the dark header CTA button fill, and the highest-contrast button text — reserved for moments that need maximum weight |
| Purple-to-Pink | `linear-gradient(to right, rgb(138,70,255) 0%, rgb(248,28,224) 50%)` | `--color-purple-to-pink` | Underline and streak flourishes under display headlines — a short linear sweep from violet to magenta that replaces the traditional squiggle |

## Tokens — Typography

### Inter — The only typeface across the entire system. Used for display headlines at 64px weight 800, section headings at 30–36px weight 700, subheadings at 22–26px weight 600, body at 16–18px weight 400–500, and caption/label at 13–14px weight 500. The tight -0.031em tracking and high x-height make it read like a serif replacement at display sizes. · `--font-inter`
- **Substitute:** Inter (free) or DM Sans as a near-equivalent
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 13px, 14px, 15px, 16px, 18px, 22px, 26px, 30px, 36px, 64px
- **Line height:** 1.0–1.8
- **Letter spacing:** -0.031em across all sizes
- **Role:** The only typeface across the entire system. Used for display headlines at 64px weight 800, section headings at 30–36px weight 700, subheadings at 22–26px weight 600, body at 16–18px weight 400–500, and caption/label at 13–14px weight 500. The tight -0.031em tracking and high x-height make it read like a serif replacement at display sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.4px | `--text-caption` |
| body | 16px | 1.5 | -0.5px | `--text-body` |
| body-lg | 18px | 1.5 | -0.56px | `--text-body-lg` |
| subheading | 22px | 1.25 | -0.68px | `--text-subheading` |
| heading-sm | 26px | 1.25 | -0.81px | `--text-heading-sm` |
| heading | 30px | 1.25 | -0.93px | `--text-heading` |
| heading-lg | 36px | 1.15 | -1.12px | `--text-heading-lg` |
| display | 64px | 1 | -1.98px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 7px |
| cards | 10px |
| inputs | 7px |
| buttons | 7px |
| doodles | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(61, 59, 53, 0.1...` | `--shadow-subtle` |
| md | `rgba(0, 0, 0, 0.09) 0px 3px 12px 0px` | `--shadow-md` |
| subtle-2 | `rgb(248, 28, 229) 0px 0px 0px 2px, rgba(248, 28, 229, 0.3...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** The sole conversion button in the system, used for the hero and major signup moments.

Blue (#0070d7) filled, white text, Inter 15px weight 500, 7px radius, 6px vertical and 14px horizontal padding. No border. Often paired with a right-pointing arrow glyph in white.

### Dark Header Button
**Role:** The persistent 'Create form' action in the top-right navigation.

Black (#000000) filled, white text, Inter 15px weight 500, 7px radius, 6px vertical and 14px horizontal padding. Reads as a secondary action to the blue CTA but stays high-contrast against the Paper canvas.

### Submit Button (in-app)
**Role:** The dark form-submission control rendered inside the form preview.

Black (#000000) filled, white text, small size, 7px radius, paired with a white arrow glyph.

### Form Preview Card
**Role:** The hero visual — a chrome-windowed card showing a live form being edited.

White (#ffffff) surface, 10px radius, with the four-stack warm shadow: 1px hairline + 1px border + 3px/9px blur + 2px/5px blur. Includes macOS-style window dots and an inline editable title in Inter 30px weight 700.

### Standard Feature Card
**Role:** Two-column feature explanations in the lower page sections.

White surface, 10px radius, soft single-layer shadow (rgba(0,0,0,0.09) 0px 3px 12px 0px), 24px internal padding. Magenta-pink icon glyph (1.5px stroke) sits at the top-left in #f81ce5. Heading 22px weight 700 in Ink, body 16px weight 400 in Graphite.

### Highlighted Feature Card
**Role:** The occasional card that carries a pink accent border to draw the eye (e.g. 'Unlimited forms and submissions for free').

White surface, 10px radius, wrapped in a 2px solid #f81ce5 outer ring + 4px rgba(248,28,229,0.36) glow. Heading rendered in Magenta (#f81ce5) rather than Ink to reinforce the accent.

### Inline Text Link
**Role:** Mid-paragraph links inside body copy and footer text.

Charcoal (#45433e) text with a 1.5–2px underline in the same color. No box, no background — pure inline text. Often wraps a phrase like 'fair usage guidelines' or 'no-code conference'.

### Text Input Field
**Role:** The single-line input used inside form previews (e.g. 'Free placeholder text').

White fill, 1px Ash (#777672) border, 7px radius, 8–10px vertical padding, placeholder text in Graphite (#898884). No focus ring color observed in the hero, suggesting a subtle 1px border darkening on focus rather than a glow.

### Logo Bar Item
**Role:** Partner/customer logos arranged in a single row to signal social proof.

Logos rendered in Ink (#37352f) monochrome at 20–24px height, evenly spaced with 24–32px gaps. No cards, no borders — logos float directly on the Paper canvas.

### Product Hunt Badge
**Role:** The '2023 Product Hunt Golden Kitty Winner' award pill.

Black (#000000) filled, 7px radius, white text 13px weight 500, a small trophy icon at 14px in Magenta (#f81ce5) or yellow. Vertically centered in its own row.

### Doodle Illustration
**Role:** The hand-drawn squiggles, speech bubbles, stars, faces, and arrows scattered around page margins.

1.5–2px stroke in Ink (#37352f) for faces, speech bubbles, and arrows. 1.5px stroke in Magenta (#f81ce5) for confetti, stars, sparkles, and accent marks. Never filled, never colored — line art only. Some underline flourishes use the Purple-to-Pink linear gradient sweep.

### Underline Flourish
**Role:** A short hand-drawn underline that sits beneath a keyword in the display headline (e.g. under 'simplest').

Either a 2px Magenta squiggle stroke or a Purple-to-Pink linear-gradient sweep clipped to an underline shape, 40–60% the width of the underlined word, with a slight horizontal offset.

## Do's and Don'ts

### Do
- Use #0070d7 exclusively for primary action buttons — never repurpose the magenta or any other chromatic color for fills.
- Reserve #f81ce5 for line art, icon strokes, decorative card borders, and the occasional highlight-ring; it should never be a button fill or large background block.
- Set all headings in Inter weight 700–800 with letter-spacing -0.031em — the tight tracking is what makes the 64px display feel editorial rather than corporate.
- Pair a white 10px-radius card with the four-stack warm shadow when the card needs to feel like a product surface; use the single-layer 3px/12px shadow for simpler feature cards.
- Float hand-drawn doodles and underline flourishes in the page margins using 1.5–2px strokes in Ink and Magenta only — they should feel loose and off-center, not grid-aligned.
- Keep the page canvas at #e0e0df and let white cards do the lifting — avoid introducing additional gray surface levels beyond the Mist (#f3f3f3) tier.
- Use 7px radius for all buttons, inputs, and tags, and 10px radius for all cards — these two values define the system's corner language.

### Don't
- Do not use #f81ce5 as a button background, link color, or text color at body sizes — it is a decorative and illustrative color, not an interface fill.
- Do not introduce new chromatic accents (greens, oranges, purples) — the system is intentionally two-color (blue for action, magenta for expression) plus a warm neutral scale.
- Do not use pure black (#000000) for body text — Ink (#37352f) is the text color; reserve black for heading borders and the dark header button.
- Do not apply large heavy shadows or colored glows to standard cards — the warm 1px border + soft blur stack is the only elevation language.
- Do not center-align body copy in the lower feature sections — the cards and paragraphs should left-align to preserve the editorial reading rhythm.
- Do not stretch the doodle illustrations into full-bleed banners or hero backgrounds — they are margin ornaments, not primary imagery.
- Do not round cards to 16px or larger, and do not round buttons to pill (9999px) shapes — 10px and 7px are the system's radii vocabulary.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#e0e0df` | Page canvas — the warm gray background behind every section |
| 1 | White | `#ffffff` | Card and form-preview surfaces that sit on the paper canvas |
| 2 | Mist | `#f3f3f3` | Secondary elevated surfaces, code snippets, and quiet hover states |

## Elevation

- **Form preview card:** `rgba(0,0,0,0.12) 0px 1px 1px 0px, rgba(61,59,53,0.16) 0px 0px 0px 1px, rgba(61,59,53,0.08) 0px 3px 9px 0px, rgba(61,59,53,0.08) 0px 2px 5px 0px`
- **Standard feature card:** `rgba(0,0,0,0.09) 0px 3px 12px 0px`
- **Highlighted feature card:** `0px 0px 0px 2px #f81ce5, 0px 0px 0px 4px rgba(248,28,229,0.36)`

## Imagery

The visual language is illustration-led, not photography-led. The dominant graphics are hand-drawn line-art doodles — faces, speech bubbles, squiggles, stars, confetti, sparkles, and arrows — rendered at 1.5–2px stroke in Ink (#37352f) for the main outlines and Magenta (#f81ce5) for accent marks. Doodles float freely in the page margins around the hero and feature sections, never cropped or masked, giving the impression of a hand-sketched notebook. The only product imagery is a single in-browser form preview rendered as a chrome-windowed white card. There is no lifestyle photography, no 3D, no abstract gradients used as backgrounds. Icon style is consistent with the doodles — outlined, 1.5px stroke, mono, brand-colored in Magenta on feature cards. Imagery is decorative atmosphere first, explanatory content never — the real information is carried by typography and white card surfaces.

## Layout

The page is centered and max-width contained at ~1200px, with a full-bleed Paper (#e0e0df) canvas behind everything. The hero is a centered stack: a 64px display headline, a 2-line subhead at 18px, a single blue CTA, a micro-helper line, then a wide white form-preview card directly beneath. Below the hero the page drops into a centered logo bar, a Product Hunt badge row, and then a left-aligned 2-column feature section. Further down, a 2-up grid of feature cards (highlighted card on the left with a pink border, standard card on the right) appears, followed by another 2-up row of standard cards. Vertical rhythm is comfortable: roughly 64px between major sections, 24px between a card heading and its body, 8px between a body line and its supporting meta. Navigation is a minimal top bar — wordmark left, text links and a dark button right — with no sticky behavior, no mega-menu, and no sidebar.

## Agent Prompt Guide

## Quick Color Reference
- Text: #37352f (Ink)
- Background (page): #e0e0df (Paper)
- Background (card): #ffffff (White)
- Border (default): #777672 (Ash) / #37352f (Ink) for emphasized
- Accent (decorative/illustrative): #f81ce5 (Tally Magenta)
- primary action: #0070d7 (filled action)

## Example Component Prompts
1. **Hero with display headline** — Centered stack on #e0e0df canvas. Headline at 64px Inter weight 800 in #37352f, letter-spacing -1.98px, with a 2px #f81ce5 hand-drawn squiggle under one keyword. Subhead at 18px Inter weight 400 in #777672. Blue primary button (#0070d7 fill, white text, 7px radius, 6px 14px padding) with a right arrow glyph. Beneath: a white 10px-radius form-preview card with the four-stack warm shadow.

2. **Standard feature card** — White surface, 10px radius, 24px padding, single-layer shadow rgba(0,0,0,0.09) 0px 3px 12px 0px. Magenta #f81ce5 outlined icon (1.5px stroke) at the top-left. Heading 22px Inter weight 700 in #37352f. Body 16px Inter weight 400 in #777672. Optional inline links in #45433e with a 1.5px underline.

3. **Highlighted feature card** — Same base as a standard card but wrapped in a 2px #f81ce5 outer ring plus a 4px rgba(248,28,229,0.36) glow. Heading rendered in #f81ce5 instead of Ink. Reserved for the one card per row that needs to pull the eye.

4. **Logo bar row** — Centered single row on the Paper canvas, no card, no border. Five monochrome logos in #37352f at 20–24px height, evenly spaced with 24–32px gaps. Optional 'Powering 500,000+ teams' label at 13px Inter weight 500 in #777672 sits above the row.

5. **Dark header button** — Black #000000 fill, white text, 15px Inter weight 500, 7px radius, 6px 14px padding. Sits in the top-right of the nav bar next to ghost text links in #37352f.

## Two-Color Discipline

The system enforces a strict separation between brand expression and conversion: Magenta (#f81ce5) is the voice — it appears in illustrations, icon strokes, decorative borders, and the occasional highlight ring; Blue (#0070d7) is the action — it appears only on filled primary buttons. No screen should ever use Magenta as a button fill, link color, or large background. No screen should ever use Blue decoratively. This split is the core of the visual identity: the page feels playful and human because Magenta is free to be expressive, while conversion moments stay calm and unmistakably clickable because Blue is reserved and rare.

## Similar Brands

- **Typeform** — Same warm-paper canvas with a single chromatic brand color used illustratively, paired with a neutral button — though Typeform leans coral/purple rather than magenta.
- **Notion** — Same editorial Inter-on-warm-gray approach with minimal elevation, hand-feel doodles, and feature cards built on white surfaces with soft warm shadows.
- **Linear** — Same tight Inter tracking at display sizes, clean white-card-on-gray hierarchy, and a single chromatic accent reserved for brand expression rather than buttons.
- **Coda** — Same form-builder-adjacent product category with a minimal chromatic palette, flat white feature cards, and a clear separation between brand color and action color.
- **Pitch** — Same magazine-masthead headline treatment with 60px+ Inter display type, centered hero rhythm, and doodle-style accent marks in the margins.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-tally-magenta: #f81ce5;
  --gradient-tally-magenta: radial-gradient(circle, rgba(248,28,229,0.36) 0%, rgba(248,28,229,0) 70%);
  --color-action-blue: #0070d7;
  --color-ink: #37352f;
  --color-paper: #e0e0df;
  --color-white: #ffffff;
  --color-mist: #f3f3f3;
  --color-graphite: #898884;
  --color-ash: #777672;
  --color-charcoal: #45433e;
  --color-black: #000000;
  --color-purple-to-pink: #f81ce0;
  --gradient-purple-to-pink: linear-gradient(to right, rgb(138,70,255) 0%, rgb(248,28,224) 50%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.4px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.5px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.56px;
  --text-subheading: 22px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.68px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.81px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.93px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.12px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.98px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 7px;
  --radius-cards: 10px;
  --radius-inputs: 7px;
  --radius-buttons: 7px;
  --radius-doodles: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(61, 59, 53, 0.16) 0px 0px 0px 1px, rgba(61, 59, 53, 0.08) 0px 3px 9px 0px, rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;
  --shadow-md: rgba(0, 0, 0, 0.09) 0px 3px 12px 0px;
  --shadow-subtle-2: rgb(248, 28, 229) 0px 0px 0px 2px, rgba(248, 28, 229, 0.36) 0px 0px 0px 4px;

  /* Surfaces */
  --surface-paper: #e0e0df;
  --surface-white: #ffffff;
  --surface-mist: #f3f3f3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-tally-magenta: #f81ce5;
  --color-action-blue: #0070d7;
  --color-ink: #37352f;
  --color-paper: #e0e0df;
  --color-white: #ffffff;
  --color-mist: #f3f3f3;
  --color-graphite: #898884;
  --color-ash: #777672;
  --color-charcoal: #45433e;
  --color-black: #000000;
  --color-purple-to-pink: #f81ce0;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.4px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.5px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.56px;
  --text-subheading: 22px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.68px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.81px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.93px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.12px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.98px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(61, 59, 53, 0.16) 0px 0px 0px 1px, rgba(61, 59, 53, 0.08) 0px 3px 9px 0px, rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;
  --shadow-md: rgba(0, 0, 0, 0.09) 0px 3px 12px 0px;
  --shadow-subtle-2: rgb(248, 28, 229) 0px 0px 0px 2px, rgba(248, 28, 229, 0.36) 0px 0px 0px 4px;
}
```
