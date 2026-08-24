# Dyotanya — Style Reference
> Editorial sketchbook on warm paper — oversized serif confessions floating between hand-drawn squiggles

**Theme:** light

Dyotanya is an editorial sketchbook brought to life: a warm off-white paper canvas scattered with hand-drawn thin black lines, oversized serif headlines that mix roman and italic for emotional rhythm, and dusty blue accents that feel like risograph ink. The interface avoids conventional elevation in favor of offset hard-shadow borders (5px down-and-left solid #333333) that make every card and button feel pasted onto the page like a collage element. Typography does the heavy lifting — Simeiz serif at 80px whispers and shouts in the same paragraph, while Manrope handles everything functional at a much smaller scale. The single coral-orange link color and dusty-blue borders provide the only chromatic punctuation in an otherwise achromatic world.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Paper | `#f5f5f3` | `--color-warm-paper` | Page background, card surfaces, text on dark elements — the warm off-white that replaces pure white and gives the entire site its analog, paper-like quality |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hairline borders, decorative line illustrations, icon strokes — the dominant neutral that carries nearly all UI information |
| Charcoal | `#333333` | `--color-charcoal` | Offset hard-shadow borders on cards and buttons, secondary text, surface backgrounds for inverted elements |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surfaces, button text on dark fills, subtle highlights |
| Dusty Sky | `#81aed9` | `--color-dusty-sky` | Decorative card borders, input borders, link borders, blue brand stroke — muted and desaturated so it reads as ink wash rather than digital blue |
| Cobalt Wash | `#55a1ea` | `--color-cobalt-wash` | Brighter blue accent for interactive borders and link states when more chromatic presence is needed than the dusty default |
| Coral Link | `#ff8562` | `--color-coral-link` | Inline link text color — the single warm chromatic note in the entire system, used sparingly to mark navigable text |

## Tokens — Typography

### Times — System serif fallback at body size — appears as a safety net for Simeiz when custom font fails to load · `--font-times`
- **Substitute:** Times New Roman
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.20
- **Role:** System serif fallback at body size — appears as a safety net for Simeiz when custom font fails to load

### Simeiz — Display and heading serif — the signature typeface. Used at 80px for hero statements, 46–48px for section titles, 24–30px for sub-headings, 16–18px for emphasis in body. Weight 300 creates thin elegant strokes; weight 400 for italic emphasis on emotional words like 'unique' and 'they are'. Free substitute: Playfair Display or DM Serif Display for the italic play, though Simeiz's high contrast is distinctive. · `--font-simeiz`
- **Substitute:** Playfair Display
- **Weights:** 300, 400
- **Sizes:** 16, 18, 24, 30, 46, 48, 80
- **Line height:** 1.00–1.56
- **Letter spacing:** normal
- **Role:** Display and heading serif — the signature typeface. Used at 80px for hero statements, 46–48px for section titles, 24–30px for sub-headings, 16–18px for emphasis in body. Weight 300 creates thin elegant strokes; weight 400 for italic emphasis on emotional words like 'unique' and 'they are'. Free substitute: Playfair Display or DM Serif Display for the italic play, though Simeiz's high contrast is distinctive.

### Manrope — Body, UI labels, button text, captions — handles everything functional. Tighter letter-spacing at -0.036em is the only tracked value in the system and gives a contemporary geometric counterpoint to the editorial serif headlines. · `--font-manrope`
- **Substitute:** Inter or DM Sans
- **Weights:** 400, 500, 600
- **Sizes:** 12, 13, 14, 16, 18
- **Line height:** 1.20–1.58
- **Letter spacing:** -0.0360em
- **Role:** Body, UI labels, button text, captions — handles everything functional. Tighter letter-spacing at -0.036em is the only tracked value in the system and gives a contemporary geometric counterpoint to the editorial serif headlines.

### Suisse Intl — Suisse Intl — detected in extracted data but not described by AI · `--font-suisse-intl`
- **Weights:** 450
- **Sizes:** 14px
- **Line height:** 1.2
- **Role:** Suisse Intl — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.56 | — | `--text-body` |
| body-lg | 18px | 1.55 | — | `--text-body-lg` |
| subheading | 24px | 1.35 | — | `--text-subheading` |
| heading-sm | 30px | 1.33 | — | `--text-heading-sm` |
| heading | 48px | 1 | — | `--text-heading` |
| display | 80px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| body | 1.5px |
| cards | 20-30px |
| pills | 3000px |
| images | 120px |
| inputs | 30px |
| buttons | 30px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(51, 51, 51) 5px -5px 0px 0px` | `--shadow-subtle` |
| subtle-2 | `rgb(51, 51, 51) 4px -4px 0px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 48px
- **Element gap:** 10-20px

## Components

### Hero Serif Statement
**Role:** Landing page headline block

Full-width section with 80px Simeiz weight 300, line-height 1.0. Text flows across the page mixing roman and italic: 'Hey there! I'm Tanya. And I help brands to appear on the web as unique as they are.' Words like 'unique' and 'they are' switch to italic weight 400 for emotional emphasis. Thin 1.5px black curved lines weave between text fragments as hand-drawn doodles. A small circular portrait (120px radius) of the designer sits inline with the text.

### Pill CTA Button
**Role:** Primary call-to-action

Massive 3000px border-radius capsule with 1.5px black border, 48px vertical padding, full width of container or auto-width centered. Text in Manrope weight 500, 14px, uppercase letter-spaced, #000000. Hard offset shadow: 4px -4px 0px 0px #333333. Background #ffffff. The extreme radius makes buttons look like soft organic pills rather than geometric shapes.

### Client Showcase Card
**Role:** Portfolio item card

White (#ffffff) card with 30px border-radius, 1.5px dusty-sky (#81aed9) border, 48px padding. Hard offset shadow 5px -5px 0px 0px #333333 creates the pasted-paper effect. Contains a circular 120px-radius image at top, a trophy emoji badge floating bottom-right of image, a 01/02 numeric index in Simeiz, a heading in Simeiz 30px, and a short description in Manrope 14px. Cards overlap and stagger in layout rather than forming a rigid grid.

### Circular Portrait Avatar
**Role:** Designer headshot inline with hero text

Image cropped to 120px border-radius (perfect circle), 1.5px black border. Small enough to sit inside flowing headline text as an inline element, reinforcing the conversational, personal tone of the hero.

### Hamburger Menu Trigger
**Role:** Site navigation toggle

Top-right circular button, 1.5px black border, ~40px diameter. Contains three short horizontal lines forming a hamburger glyph in Manrope weight 500. Same hard offset shadow as buttons. Opens full-screen overlay navigation.

### Trophy Badge
**Role:** Project achievement indicator

Small white circle (30px) with 1.5px black border, positioned absolutely bottom-right of client card images. Contains a 🏆 emoji centered. Acts as a micro-credential signal for portfolio pieces.

### Hand-Drawn Line Decoration
**Role:** Atmospheric connective element

SVG paths at 1.5px stroke #000000, no fill, freely curving and looping across sections. These squiggles connect cards, underline text, and weave through layouts — the signature decorative motif that gives the site its hand-drawn sketchbook character. Renders as inline SVG, never rasterized.

### Section Index Marker
**Role:** Section number label

Small Simeiz weight 300 numeric (01, 02) in #000000, positioned at the left edge of section headers. Acts as an editorial table-of-contents marker, reinforcing the magazine-like structure.

### Parenthetical Caption
**Role:** Supporting descriptive text

Short Manrope 14px weight 400 text wrapped in typographic parentheses ( ), positioned adjacent to headlines. Used for sub-descriptions like '(Empathic web designer with a creative approach to work)'. The parentheses are literal characters, not decorative elements.

### Input Field
**Role:** Form input

30px border-radius, 1.5px dusty-sky (#81aed9) border, 20px horizontal padding, Manrope 16px placeholder text in #828282. No visible focus ring change — the dusty-blue border is already distinctive enough to signal interactivity.

## Do's and Don'ts

### Do
- Use Simeiz weight 300 for all display headlines at 46–80px with line-height 1.0 — the thin serif at large size is the site's identity.
- Apply 3000px border-radius to pill buttons and decorative elements to create the organic capsule silhouette.
- Add 5px -5px 0px 0px #333333 hard offset shadows to every card and 4px -4px 0px 0px to every button — this pasted-paper effect is the elevation system.
- Mix roman and italic Simeiz within the same headline to create emotional rhythm (e.g. 'as unique as they are' all italic).
- Use #ff8562 exclusively for inline link text and never for backgrounds or borders.
- Set 1.5px #81aed9 borders on cards and inputs — the dusty blue is the only decorative chromatic border in the system.
- Layer 1.5px #000000 hand-drawn SVG squiggles as connective tissue between text and card elements.

### Don't
- Never use soft drop-shadows, blur, or opacity-based elevation — the hard offset border is the only acceptable depth technique.
- Never use #ff8562 as a button background or border — it is link text only.
- Never use Manrope for headlines or large display text — Simeiz owns everything above 20px.
- Never set border-radius below 20px on interactive elements — the system requires soft, generous rounding.
- Never use pure white (#ffffff) as the page background — #f5f5f3 is the warm paper that grounds the entire system.
- Never use multiple chromatic colors on the same element — the palette is intentionally desaturated, so a dusty blue border with a coral link is already the maximum color load.
- Never align text in rigid left-justified blocks for hero content — the layout relies on mixed centering and scattered positioning for its editorial feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#f5f5f3` | Base page canvas — warm off-white that absorbs all content like a sketchbook page |
| 2 | Card | `#ffffff` | Elevated card surfaces for client showcases, appearing as white paper pasted onto the warm canvas |
| 3 | Inverted | `#333333` | Dark surface for high-contrast sections or inverted UI moments |

## Elevation

- **Cards:** `5px -5px 0px 0px #333333`
- **Buttons:** `4px -4px 0px 0px #333333`

## Imagery

Imagery is sparse and intentional: a single small circular portrait of the designer sits inline with the hero text, and client project images are cropped into perfect circles (120px radius) at the top of showcase cards. The project images are photographic (black-and-white tattoo artistry, warm interior design) but always desaturated or muted to match the paper-and-ink palette. There are no full-bleed hero images, no lifestyle photography, no product mockups — the only photographs are circular headshots and circular project thumbnails. The dominant visual element is actually the hand-drawn 1.5px black line illustrations (SVG squiggles) that weave across the layout like a designer's pen marks on tracing paper. Icons are minimal (hamburger, trophy emoji); the system relies on type and line work rather than iconography.

## Layout

The layout is editorial and asymmetric rather than grid-locked. The hero is a full-bleed warm-paper canvas with a large flowing serif headline that wraps around inline elements (portrait avatar, hand-drawn lines) — text and image share the same horizontal flow rather than splitting into a two-column grid. The portfolio section uses a staggered, overlapping card layout where client cards are positioned at varying heights and sizes (some large, some small) with connecting SVG lines between them, rather than a uniform 3-column grid. Section padding is generous (80px+) and section rhythm flows seamlessly — no hard dividers, no alternating dark/light bands. The page is contained to roughly 1200px max-width but the hand-drawn lines and oversized type frequently break containment. Navigation is minimal: a single circular hamburger trigger in the top-right corner. The overall density is low — lots of breathing room lets the oversized 80px Simeiz headlines and scattered decorative lines carry the visual weight.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f5f5f3
- card surface: #ffffff
- border (decorative): #81aed9
- border (functional): #000000
- link: #ff8562
- offset shadow: #333333
- primary action: #81aed9 (filled action)

**3 Example Component Prompts**

1. **Hero Section**: Warm paper #f5f5f3 background. Display headline 'I help brands appear as unique as they are' in Simeiz weight 300, 80px, line-height 1.0, #000000. Set 'unique' and 'they are' in italic Simeiz weight 400. A 120px-radius circular portrait sits inline with the text. Thin 1.5px #000000 SVG squiggle lines weave through the text blocks.

2. **Client Project Card**: White #ffffff background, 30px border-radius, 1.5px #81aed9 border, 48px padding. Hard offset shadow 5px -5px 0px 0px #333333. Circular 120px-radius grayscale project image at top. A 30px white trophy badge with 1.5px black border positioned bottom-right of the image. Simeiz 30px project name below image. Manrope 14px description in #333333. Simeiz 300 weight numeric '01' floating to the left of the card.

3. **Pill Navigation Button**: 3000px border-radius capsule, 1.5px #000000 border, #ffffff background, 48px vertical padding, 40px horizontal padding. Manrope 14px weight 500, uppercase, letter-spaced, #000000 text reading 'SEE PORTFOLIO'. Hard offset shadow 4px -4px 0px 0px #333333. Centered in its container, full width up to 600px.

## Signature Decorative Motif

The single most recognizable visual element is the hand-drawn 1.5px black SVG line that appears across all sections — looping, curving, and connecting text fragments, images, and card edges. These are not decorative afterthoughts; they are structural connective tissue. Render them as inline SVG with stroke #000000, stroke-width 1.5, fill none, using cubic-bezier curves for organic flow. They should appear to be drawn with a steady but human hand — slight imperfections in curvature are desirable, perfectly geometric arcs are not.

## Typography Voice Rules

Headlines in Simeiz are not simply large text — they are conversations. The system alternates roman and italic within the same headline to create natural speech rhythm: declarative statements in roman, emotional or emphasized words in italic. A headline like 'And I help brands to appear on the web as unique as they are' should set 'unique' and 'they are' in italic, leaving the rest in roman. This is not decoration — it is how the designer 'speaks' through type. Never set an entire headline in italic; never set an entire headline in roman. Always mix.

## Similar Brands

- **Locomotive (locomotive.ca)** — Same editorial-sketchbook approach: warm off-white canvas, oversized mixed-roman-and-italic serif headlines, hand-drawn SVG line illustrations weaving through layouts, and a desaturated dusty-blue accent.
- **Rauno Freiberg (raunofreiberg.com)** — Same oversized serif at display scale paired with hand-drawn squiggle decorations, and a similar reliance on a single warm accent color against an off-white paper background.
- **Studio Job (studiojob.be)** — Same editorial-meets-illustration sensibility with circular image crops, serif headlines, and a collage-like layout that breaks grid conventions.
- **Pentagram (pentagram.com)** — Same offset hard-shadow card treatment and editorial typography hierarchy where oversized serif headlines carry the page weight with minimal UI chrome.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-paper: #f5f5f3;
  --color-ink-black: #000000;
  --color-charcoal: #333333;
  --color-pure-white: #ffffff;
  --color-dusty-sky: #81aed9;
  --color-cobalt-wash: #55a1ea;
  --color-coral-link: #ff8562;

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-simeiz: 'Simeiz', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.55;
  --text-subheading: 24px;
  --leading-subheading: 1.35;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.33;
  --text-heading: 48px;
  --leading-heading: 1;
  --text-display: 80px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 48px;
  --element-gap: 10-20px;

  /* Border Radius */
  --radius-sm: 1.5px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 50px;
  --radius-full-2: 91px;
  --radius-full-3: 100px;
  --radius-full-4: 120px;
  --radius-full-5: 1000px;
  --radius-full-6: 3000px;
  --radius-full-7: 9999px;

  /* Named Radii */
  --radius-body: 1.5px;
  --radius-cards: 20-30px;
  --radius-pills: 3000px;
  --radius-images: 120px;
  --radius-inputs: 30px;
  --radius-buttons: 30px;

  /* Shadows */
  --shadow-subtle: rgb(51, 51, 51) 5px -5px 0px 0px;
  --shadow-subtle-2: rgb(51, 51, 51) 4px -4px 0px 0px;

  /* Surfaces */
  --surface-paper: #f5f5f3;
  --surface-card: #ffffff;
  --surface-inverted: #333333;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-paper: #f5f5f3;
  --color-ink-black: #000000;
  --color-charcoal: #333333;
  --color-pure-white: #ffffff;
  --color-dusty-sky: #81aed9;
  --color-cobalt-wash: #55a1ea;
  --color-coral-link: #ff8562;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-simeiz: 'Simeiz', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.55;
  --text-subheading: 24px;
  --leading-subheading: 1.35;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.33;
  --text-heading: 48px;
  --leading-heading: 1;
  --text-display: 80px;
  --leading-display: 1;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-sm: 1.5px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 50px;
  --radius-full-2: 91px;
  --radius-full-3: 100px;
  --radius-full-4: 120px;
  --radius-full-5: 1000px;
  --radius-full-6: 3000px;
  --radius-full-7: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(51, 51, 51) 5px -5px 0px 0px;
  --shadow-subtle-2: rgb(51, 51, 51) 4px -4px 0px 0px;
}
```
