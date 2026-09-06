# Tracky — Style Reference
> doodled planner on warm paper

**Theme:** light

Tracky reads like a creative's bullet journal that became a product: a warm light canvas (#f2f2f2) carries a near-black navy (#151b31) workhorse for text, borders, and primary actions, while coral red (#ff5858) and mint green (#86e0c1) appear as small functional punctuation for emphasis and live states. GRIFTER supplies the brand's voice at display scale — chunky, hand-printed, slightly loosened tracking — while Inter handles all UI and body work at compact, tightly-tracked sizes. Components sit on soft 8px and 16px radii with whisper-light shadows, generous section breathing, and hand-drawn illustration accents (doodles, organic blobs, bunny mascot) that make project management feel like doodling in a notebook rather than filing a ticket.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Inkwell Navy | `#151b31` | `--color-inkwell-navy` | Primary buttons, dominant text and borders, dark feature card backgrounds — the workhorse near-black that reads as softer and warmer than pure #000 |
| Coral Emphasis | `#ff5858` | `--color-coral-emphasis` | Accent text for key words in headlines, emphasis highlights, and selective links — warm red against navy creates playful energy without corporate aggression |
| Mint Pulse | `#86e0c1` | `--color-mint-pulse` | Green state accent for badges, validation surfaces, and short status labels. |
| Butter Yellow | `#fedf89` | `--color-butter-yellow` | Top announcement banner, highlight washes — warm pastel yellow for friendly alerts that don't shout |
| Graphite | `#333333` | `--color-graphite` | Secondary text, hairline borders, icon strokes — sits between navy and pure black for less-load-bearing elements |
| Slate | `#6d6f75` | `--color-slate` | Muted helper text, subdued borders, caption-level content — the cool gray for de-emphasized UI |
| Ash Canvas | `#f2f2f2` | `--color-ash-canvas` | Page background — warm light gray that lifts white cards without the coldness of pure white |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, button labels, overlapping panels — the surface layer above the Ash Canvas |
| Pure Ink | `#000000` | `--color-pure-ink` | Maximum-emphasis icons, strongest borders, logo mark — used sparingly where absolute contrast is required |
| Warm Stone | `#e8e7e5` | `--color-warm-stone` | Card drop-shadow tint — warm desaturated beige replaces cold black shadows for a paper-like depth |

## Tokens — Typography

### GRIFTER — Display and brand-voice headings — hero, section openers, decorative labels. The chunky hand-printed character carries the notebook personality. Slightly loosened tracking (0.03em) keeps it readable at display scale. · `--font-grifter`
- **Substitute:** Bagel Fat One, Permanent Marker, or Bowlby One (Google Fonts)
- **Weights:** 400, 700
- **Sizes:** 12px, 24px, 36px, 48px, 64px
- **Line height:** 1.0, 1.1, 1.2, 1.41, 2.0
- **Letter spacing:** 0.03em — stays positive even at large sizes, the opposite of most display type which tightens at scale
- **Role:** Display and brand-voice headings — hero, section openers, decorative labels. The chunky hand-printed character carries the notebook personality. Slightly loosened tracking (0.03em) keeps it readable at display scale.

### Inter — All UI and body text — buttons, navigation, body copy, card content, badges, form labels. Tight tracking (-0.01em) at all sizes creates a compact, efficient reading rhythm. The 108px outlier likely powers a single oversized hero element. · `--font-inter`
- **Substitute:** Inter (already Google Fonts) or DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 16px, 18px, 20px, 22px, 24px, 36px, 108px
- **Line height:** 1.0, 1.1, 1.16, 1.18, 1.3, 1.4, 1.5, 1.55, 1.74
- **Letter spacing:** -0.01em — uniformly tight, no display-grade loosening
- **Role:** All UI and body text — buttons, navigation, body copy, card content, badges, form labels. Tight tracking (-0.01em) at all sizes creates a compact, efficient reading rhythm. The 108px outlier likely powers a single oversized hero element.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.55 | -0.14px | `--text-body-sm` |
| body | 16px | 1.55 | -0.16px | `--text-body` |
| body-lg | 18px | 1.5 | -0.18px | `--text-body-lg` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.24px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.36px | `--text-heading` |
| heading-lg | 48px | 1.16 | 1.44px | `--text-heading-lg` |
| display | 64px | 1.1 | 1.92px | `--text-display` |
| display-xl | 108px | 1 | -1.08px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 8px |
| inputs | 8px |
| buttons | 8px |
| featureCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0...` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) ...` | `--shadow-sm` |
| sm-2 | `rgba(138, 133, 125, 0.2) 0px 1px 4px 0px` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Filled Primary Button
**Role:** Main call-to-action (Get started, Sign up)

Inkwell Navy (#151b31) background, Paper White (#ffffff) text, Inter 16px weight 500-600, 8px radius, 13px vertical / 20px horizontal padding, subtle 0 1px 3px shadow. Tight tracking and compact sizing keep it functional rather than celebratory.

### Outlined Ghost Button
**Role:** Secondary action on light backgrounds (Login / Sign up)

White or transparent background, 1px border in #e8e7e5 or Slate (#6d6f75), Inter 16px weight 500 in Inkwell Navy. 8px radius, 8px vertical / 16px horizontal padding. No shadow.

### Inverse Button
**Role:** Action on dark feature cards (Try me)

White background or white text on Inkwell Navy card, 8px radius, 13px-16px vertical padding. Same compact Inter treatment as primary button, inverted for dark surfaces.

### Top Announcement Banner
**Role:** Full-width site-wide message bar

Butter Yellow (#fedf89) background spanning full viewport width, Inter 14-16px centered, Inkwell Navy text with a 'Let's Talk' link in Coral Emphasis. Close (×) button at right edge.

### Navigation Header
**Role:** Site header with logo and auth

Minimal: logo mark (Inkwell Navy circle with white play-shape) + 'Tracky' wordmark in Inter 600 on left, Outlined Ghost Button on right. Transparent or Ash Canvas background, no shadow.

### Hero Display Headline
**Role:** Page-opening headline

GRIFTER 64px-108px weight 700 in Inkwell Navy, with one phrase swapped to Coral Emphasis for energy. Centered or left-aligned, 1.0-1.1 line-height, 1.92px tracking. Often mixed with inline hand-drawn SVG illustration between phrases.

### Dark Feature Card
**Role:** Inverted content section (Note your thoughts, etc.)

Inkwell Navy (#151b31) background, 16-24px radius, generous 40-48px internal padding. GRIFTER or Inter display heading in white, body text in Paper White at 70% opacity, Inverse Button for action. Warm stone shadow: 0 1px 4px rgba(138,133,125,0.2).

### Overlap White Card
**Role:** Product preview element overlapping the dark feature card

Paper White (#ffffff) surface, 16px radius, slight rotation (-3 to -8 degrees), positioned to overlap the right edge of the dark card. No visible border, relies on contrast against dark surface.

### Timer Widget
**Role:** Inline product demo element showing the timer feature

White pill-shaped card, Inkwell Navy text showing '0:00:00', circular Mint Pulse (#86e0c1) play button icon, small icon button to the right. Sits inline within hero text to demonstrate product contextually.

### Annotation Label
**Role:** Handwritten tutorial-style callout (start → stop → continue, click me)

GRIFTER or similar hand-printed font at 24-36px, typically in a blue or Inkwell Navy stroke, with a curved hand-drawn arrow. Positioned above or beside interactive elements to suggest 'try this'. Underlines are hand-drawn squiggles in Coral Emphasis.

### Text Link
**Role:** Inline text links and 'Let's Talk' style CTAs

Inter 16-18px weight 500-600, Coral Emphasis (#ff5858) for emphasis links or Inkwell Navy for utility links. No underline by default; underline appears on hover in the same color or in Graphite.

### Badge / Tag
**Role:** Small status indicators and category labels

8px radius, 8-10px vertical / 12-16px horizontal padding, Inter 12px weight 500. Backgrounds: Mint Pulse for success, Butter Yellow for highlight, Ash Canvas for neutral. Text in Inkwell Navy.

## Do's and Don'ts

### Do
- Use GRIFTER 64px+ weight 700 for hero and section openers — its hand-printed character is the brand voice, not decoration
- Apply Coral Emphasis (#ff5858) to exactly one word or phrase per headline for energy — never entire headings
- Pair Inkwell Navy (#151b31) fills with Paper White (#ffffff) text on primary buttons at 8px radius — this is the canonical CTA
- Use Ash Canvas (#f2f2f2) as the universal page background — it lifts white cards with a warm paper feel
- Apply the warm stone shadow rgba(138,133,125,0.2) 0 1px 4px on feature cards instead of cold black shadows
- Use Inter at -0.01em tracking for all UI text — let GRIFTER carry the personality at display scale
- Overlap a tilted Paper White card onto a dark Inkwell Navy feature card to create visual product demo moments

### Don't
- Don't use GRIFTER for body text, buttons, navigation, or form labels — it loses readability below 24px and dilutes the brand voice
- Don't apply Coral Emphasis (#ff5858) to more than one element per visual zone — it loses emphasis when overused
- Don't use pure #000000 as a background or large fill — Inkwell Navy (#151b31) is the system black, pure black is reserved for icon strokes
- Don't stack multiple bold shadows on elevated components — the system relies on 1-4px blurs with under 25% opacity
- Don't use radius below 8px on interactive elements — the softness is part of the friendly personality
- Don't use cold gray drop-shadows (rgba(0,0,0,*)) on cards — the warm stone shadow is the signature depth treatment
- Don't introduce new accent colors — the system speaks through navy, coral, mint, and butter yellow; adding more breaks the notebook palette

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Ash Canvas | `#f2f2f2` | Page background — the warm paper base |
| 1 | Paper White | `#ffffff` | Card surfaces, elevated panels, button labels |
| 2 | Butter Yellow | `#fedf89` | Announcement banner — temporary high-attention surface |
| 3 | Inkwell Navy | `#151b31` | Dark feature card — inverted surface for contrast sections |

## Elevation

- **Primary buttons:** `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- **Feature cards:** `0 1px 4px rgba(138,133,125,0.2) — warm stone shadow replaces cold black`

## Imagery

Illustration-first visual language with zero photography. Hand-drawn SVG characters (a bunny mascot), organic blob shapes in Mint Pulse and a soft blue scattered as decorative atmosphere, and inline doodled annotations with curved arrows and handwritten labels ('start → stop → continue', 'click me'). Illustrations are outlined and lightly filled in brand colors, positioned to overlap text and cards rather than sit in dedicated image containers. The bunny character and organic shapes are decorative atmosphere, not explanatory content — they signal creativity and approachability. No product screenshots in the traditional sense; instead, live product elements (timer widget) appear inline within headlines as contextual demos. Overall density is text-dominant with illustration as accent punctuation, never as hero imagery.

## Layout

Single-column max-width contained flow at 1200px. Hero is full-width on Ash Canvas with a centered display headline mixed with inline hand-drawn illustration and a centered Filled Primary Button. Below the hero, content flows in vertical sections of 80px gap, alternating between light sections (Ash Canvas with Paper White cards) and dark sections (Inkwell Navy feature cards with overlapping white product-preview cards rotated -3 to -8 degrees). No multi-column grids in the main flow — the system stays single-column, letting the dark feature cards provide visual variety through inversion rather than through column complexity. Navigation is a minimal sticky-or-static top bar with logo left and a single auth button right, no mega-menu. A full-width Butter Yellow announcement banner sits above the header. Sections feel spacious and breathing, with each dark card acting as a full-bleed moment of inversion before returning to the light canvas.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #151b31 (Inkwell Navy)
- text (muted): #6d6f75 (Slate)
- background: #f2f2f2 (Ash Canvas)
- surface (card): #ffffff (Paper White)
- border: #333333 (Graphite) / #6d6f75 (Slate)
- accent: #ff5858 (Coral Emphasis)
- primary action: #151b31 (filled action)

**Example Component Prompts**

1. *Create a hero section:* Ash Canvas (#f2f2f2) full-width background. Centered headline at 64px GRIFTER weight 700, #151b31, letter-spacing 1.92px. The phrase 'actually love' set in #ff5858. Subtext at 18px Inter weight 400, #6d6f75. Primary button: #151b31 background, #ffffff text, Inter 16px weight 500, 8px radius, 13px vertical / 20px horizontal padding.

2. *Create a dark feature card:* #151b31 background, 16px radius, 48px padding. GRIFTER 36px weight 700 heading in #ffffff. Body at 16px Inter weight 400, #ffffff at 80% opacity. White Inverse Button: #ffffff background, #151b31 text, 8px radius, 16px / 24px padding. Overlap a Paper White card rotated -5 degrees, 16px radius, no border, positioned to bleed off the right edge.

3. *Create a top announcement banner:* Full-width #fedf89 background, 40px vertical padding. Centered Inter 14px weight 500 in #151b31, with 'Let's Talk' as a #ff5858 link. × close button at right in #151b31.

4. *Create a timer widget demo element:* #ffffff background pill, 8px radius, 12px vertical / 16px horizontal padding. '0:00:00' in Inter 16px weight 600, #151b31. Circular play button: 32px diameter, #86e0c1 background, #151b31 triangle icon.

5. *Create a feature badge:* #86e0c1 background, 8px radius, 8px vertical / 12px horizontal padding. Inter 12px weight 500, #151b31 text.

## Similar Brands

- **Notion** — Same hand-crafted personality with display type, muted canvas, and single-color accent punctuation in headlines
- **Trello** — Same project management space with playful illustration accents and a warm light canvas, though Trello leans more on saturated brand blue
- **Pitch** — Same bold display typography paired with Inter UI, generous spacing, and personality-forward micro-illustrations
- **Height** — Same product management space with a single dominant dark color as workhorse, compact UI, and inverted dark feature cards
- **Linear** — Same tight Inter tracking, compact 8px-radius components, and a near-black navy as the primary workhorse color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-inkwell-navy: #151b31;
  --color-coral-emphasis: #ff5858;
  --color-mint-pulse: #86e0c1;
  --color-butter-yellow: #fedf89;
  --color-graphite: #333333;
  --color-slate: #6d6f75;
  --color-ash-canvas: #f2f2f2;
  --color-paper-white: #ffffff;
  --color-pure-ink: #000000;
  --color-warm-stone: #e8e7e5;

  /* Typography — Font Families */
  --font-grifter: 'GRIFTER', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.55;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.36px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: 1.44px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: 1.92px;
  --text-display-xl: 108px;
  --leading-display-xl: 1;
  --tracking-display-xl: -1.08px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-featurecards: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  --shadow-sm-2: rgba(138, 133, 125, 0.2) 0px 1px 4px 0px;

  /* Surfaces */
  --surface-ash-canvas: #f2f2f2;
  --surface-paper-white: #ffffff;
  --surface-butter-yellow: #fedf89;
  --surface-inkwell-navy: #151b31;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-inkwell-navy: #151b31;
  --color-coral-emphasis: #ff5858;
  --color-mint-pulse: #86e0c1;
  --color-butter-yellow: #fedf89;
  --color-graphite: #333333;
  --color-slate: #6d6f75;
  --color-ash-canvas: #f2f2f2;
  --color-paper-white: #ffffff;
  --color-pure-ink: #000000;
  --color-warm-stone: #e8e7e5;

  /* Typography */
  --font-grifter: 'GRIFTER', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.55;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.18px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.36px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.16;
  --tracking-heading-lg: 1.44px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: 1.92px;
  --text-display-xl: 108px;
  --leading-display-xl: 1;
  --tracking-display-xl: -1.08px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  --shadow-sm-2: rgba(138, 133, 125, 0.2) 0px 1px 4px 0px;
}
```
