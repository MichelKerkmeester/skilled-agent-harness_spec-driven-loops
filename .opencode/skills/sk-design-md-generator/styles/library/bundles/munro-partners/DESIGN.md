# Munro Partners — Style Reference
> Editorial parchment under alpine light — a warm cream canvas holding generous whitespace, a whisper-weight grotesque, and full-bleed mountain photography where the landscape does the talking and the interface stays nearly invisible.

**Theme:** light

Munro Partners operates in a quiet, editorial register: a warm cream canvas (#fff9ee) holds generous whitespace, with every interface element trimmed in a single warm dark brown (#3f322a) that reads as ink rather than black. The Neue Haas Grotesk typography is set tight and small, with a 68px display headline at weight 400 that whispers against full-bleed mountain photography rather than shouting. A single deep teal (#004e4e) is reserved for the most important interactive moments, while muted violets, aubergine, and ice blue appear as thin accent borders on cards and data treatments. The system feels less like a financial product and more like a printed annual report — calm, spacious, and confident enough to let landscape imagery carry the emotional weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Parchment | `#fff9ee` | `--color-cream-parchment` | Page canvas, section backgrounds, card surfaces, nav bar fill — the warm off-white that defines the entire mood and replaces what would normally be pure white |
| Paper White | `#ffffff` | `--color-paper-white` | Elevated card surfaces, video embed containers, contrast panels against the cream canvas |
| Bark Brown | `#3f322a` | `--color-bark-brown` | Primary text, all borders, nav links, body copy, headings — replaces black throughout the system, giving every line a warm ink-like quality |
| Warm Gray | `#9f968c` | `--color-warm-gray` | Secondary text, subtle borders, nav dividers — the mid-tone that bridges Bark Brown headings and lighter dividers |
| Stone | `#c5bdb3` | `--color-stone` | Hairline dividers, image borders, subtle separators between sections |
| Driftwood | `#b3aea7` | `--color-driftwood` | Input field borders, form element outlines |
| Earth | `#796e65` | `--color-earth` | Secondary headings, muted label text |
| Light Stone | `#e5e5e5` | `--color-light-stone` | Lightest border tone, disabled states, subtle structure lines |
| Ink | `#000000` | `--color-ink` | Input text color, high-contrast form text — the only context where true black appears |
| Deep Teal | `#004e4e` | `--color-deep-teal` | Primary action buttons, filled CTAs — the single chromatic fill color permitted for interactive moments, creating quiet authority against the cream |
| Aubergine | `#560e4b` | `--color-aubergine` | Decorative card borders, heading accent strokes, editorial highlight containers |
| Iris | `#a56eff` | `--color-iris` | Decorative card borders, accent strokes on data containers |
| Cobalt | `#3074f9` | `--color-cobalt` | Link accents, decorative borders on blue-themed content blocks |
| Ice Blue | `#bfebfe` | `--color-ice-blue` | Input field backgrounds, soft highlight washes on data rows, subtle surface tint |
| Saffron | `#feed5a` | `--color-saffron` | Occasional button accent for editorial highlight CTAs |
| Amber | `#c67700` | `--color-amber` | Occasional button accent for warm-themed CTAs |

## Tokens — Typography

### Neue Haas Grotesk Display — Primary typeface for all headings, body copy, nav, and UI text — the premium editorial grotesque that carries the entire interface. Weight 400 for display headlines creates a whisper rather than a shout; weight 600 for subheadings and emphasis; weight 700 reserved for section labels and small-caps headers · `--font-neue-haas-grotesk-display`
- **Substitute:** Inter, Helvetica Neue, Neue Haas Grotesk Text Pro (closest free alternative: Inter at matched tracking)
- **Weights:** 400, 600, 700
- **Sizes:** 12, 13, 14, 16, 22, 24, 30, 43, 68
- **Line height:** 0.75, 0.81, 1.00, 1.05, 1.09, 1.10, 1.13, 1.17, 1.20, 1.30, 1.41, 1.43, 1.50
- **Letter spacing:** 0.008em at 68px (0.54px), 0.009em at 43px (0.39px), 0.013em at 30px (0.39px), 0.015em at 22px (0.33px), 0.017em at 16px (0.27px)
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** Primary typeface for all headings, body copy, nav, and UI text — the premium editorial grotesque that carries the entire interface. Weight 400 for display headlines creates a whisper rather than a shout; weight 600 for subheadings and emphasis; weight 700 reserved for section labels and small-caps headers

### Neue Haas Grotesk Text — Secondary typeface for small utility text, nav micro-copy, fine print — slightly more compact than the Display variant for 10–12px sizes · `--font-neue-haas-grotesk-text`
- **Substitute:** Inter, Helvetica Neue
- **Weights:** 400, 500
- **Sizes:** 10, 11, 12
- **Line height:** 1.00, 1.50, 1.80
- **Letter spacing:** 0.018em at 12px (0.22px)
- **OpenType features:** `"tnum" on`
- **Role:** Secondary typeface for small utility text, nav micro-copy, fine print — slightly more compact than the Display variant for 10–12px sizes

### Font Awesome 5 Brands — Font Awesome 5 Brands — detected in extracted data but not described by AI · `--font-font-awesome-5-brands`
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1
- **Role:** Font Awesome 5 Brands — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.8 | 0.18px | `--text-caption` |
| body | 14px | 1.43 | 0.24px | `--text-body` |
| heading-sm | 22px | 1.2 | 0.33px | `--text-heading-sm` |
| heading | 30px | 1.13 | 0.39px | `--text-heading` |
| heading-lg | 43px | 1.09 | 0.39px | `--text-heading-lg` |
| display | 68px | 1.05 | 0.54px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 2px |
| links | 15px |
| badges | 2px |
| images | 15px |
| inputs | 2px |
| buttons | 2px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Full-Bleed Hero Image
**Role:** Section opening visual that fills the entire viewport width

Full-bleed landscape photograph (mountains, winding roads, open terrain) spanning 100% viewport width and 60–80vh height. No border-radius. Text overlay sits at bottom-left in white (#ffffff) using display weight 400 at 68px. A large vertical wordmark in white at 100–200px weight 700 anchors the right edge.

### Editorial Wordmark
**Role:** Brand identity mark used as both logo and decorative element

The text 'MUNRO' set in Neue Haas Grotesk Display weight 700, all uppercase, letter-spacing 0.09em. Functions as nav logo at 16px (top-right) and as oversized decorative element at 100–200px (right edge of hero). White on dark photography, Bark Brown (#3f322a) on cream.

### Slim Navigation Bar
**Role:** Persistent top header

Full-width bar on Cream Parchment (#fff9ee) background, 48–56px height. Left: hamburger menu icon + 'MENU' label in Neue Haas Grotesk Text 12px weight 500, letter-spacing 0.018em, color Bark Brown. Right: 'MUNRO' wordmark. No background fill change on scroll, no shadow — the bar is flat and barely visible.

### Filled Teal CTA Button
**Role:** Primary action trigger — the only filled chromatic button in the system

Background Deep Teal (#004e4e), text white, Neue Haas Grotesk Display 12px weight 600, letter-spacing 0.018em, uppercase. Padding 10px vertical, 20px horizontal. Border-radius 2px. No shadow. This is the system sole filled action color — use it for exactly one primary action per view.

### Ghost Text Button
**Role:** Secondary action or link-style trigger

No background, no border. Text only in Bark Brown (#3f322a), Neue Haas Grotesk Display 12px weight 600, uppercase, letter-spacing 0.018em. Padding 10px vertical, 12px horizontal. Underline on hover.

### Section Label
**Role:** Small-caps heading introducing a content block

Neue Haas Grotesk Display 12px weight 700, uppercase, letter-spacing 0.017em, color Bark Brown (#3f322a). No accent line or decorative element — the typography weight and casing does all the work. Examples: 'OUR GLOBAL GROWTH FUNDS'.

### Display Headline
**Role:** Hero or section-opening statement

Neue Haas Grotesk Display 68px weight 400, line-height 1.05, letter-spacing 0.54px. White when overlaid on photography, Bark Brown (#3f322a) on cream. The weight-400 choice is the signature — it whispers rather than shouts, creating authority through restraint.

### Video Embed Card
**Role:** Embedded media container (YouTube, etc.)

16:9 aspect ratio container with Paper White (#ffffff) background, 2px border-radius. Video thumbnail fills the container. Title overlaid top-left in white Neue Haas Grotesk Display 22px weight 400 with a subtitle at 12px. Play button centered.

### Financial Data Table
**Role:** Stacked data rows showing metrics with right-aligned values

Full-width rows separated by 1px Stone (#c5bdb3) hairline borders. Left column: label in Neue Haas Grotesk Display 14px weight 400, color Earth (#796e65). Right column: value in same size, color Bark Brown (#3f322a), right-aligned. No table header, no alternating row colors — pure hairlines and typography do the work.

### Editorial Body Paragraph
**Role:** Long-form descriptive text

Neue Haas Grotesk Display 16px weight 400, line-height 1.41, color Bark Brown (#3f322a) on Cream Parchment (#fff9ee). Max-width 680px for readability. Generous margin-bottom (24–32px) between paragraphs.

### Underlined Input Field
**Role:** Form input — text entry

No visible box, no background fill. Bottom border 1px in Ink (#000000) or Driftwood (#b3aea7). Placeholder text in Warm Gray (#9f968c) at 14px. On focus: bottom border thickens to 2px in Deep Teal (#004e4e). No border-radius — sharp bottom edge only.

### Accent Border Card
**Role:** Content card with thin chromatic border

Cream Parchment (#fff9ee) background, 1px border in a chromatic accent (Aubergine #560e4b, Iris #a56eff, Cobalt #3074f9, or Ice Blue #bfebfe). Border-radius 2px. Padding 20px. No shadow, no fill change. The colored border is the differentiator — multiple cards on a page may use different accent colors.

### Hairline Divider
**Role:** Section separator

1px horizontal line in Stone (#c5bdb3), full container width, 1px height. No margin — sits flush within section spacing rhythm.

### Image Container
**Role:** Photograph or illustration frame

Images sit in containers with 15px border-radius. No border. Full-bleed within container. Used for editorial photography, team portraits, and landscape shots.

## Do's and Don'ts

### Do
- Set body text in Neue Haas Grotesk Display 14px/1.43 in Bark Brown (#3f322a) on Cream Parchment (#fff9ee) — never invert this pairing
- Use 2px border-radius for all buttons, badges, inputs, and accent-border cards — the near-square edge is a signature
- Use 15px border-radius exclusively for image containers and decorative links
- Reserve Deep Teal (#004e4e) for the single primary action per view — filled buttons in any other chromatic color are forbidden
- Set display headlines at 68px weight 400 with letter-spacing 0.54px — the whisper-weight is the defining typographic choice
- Separate content blocks with 1px Stone (#c5bdb3) hairlines, not card containers or background fills
- Use full-bleed landscape photography as section heroes with white text overlays — let imagery carry emotional weight
- Set section labels in 12px weight 700 uppercase with letter-spacing 0.017em — the casing and weight do the hierarchy work

### Don't
- Never use #000000 for body text, headings, or borders — Bark Brown (#3f322a) replaces black throughout the system
- Never use pure white (#ffffff) as the page canvas — Cream Parchment (#fff9ee) is the only acceptable base
- Never use border-radius greater than 2px on buttons, badges, or inputs — large radii break the editorial register
- Never stack multiple chromatic accent colors within a single component — one accent per container
- Never use weight 700 for editorial body copy or long-form text — reserve 700 for labels and wordmarks
- Never apply box-shadows or drop-shadows to cards or surfaces — the system is flat, separated only by hairlines
- Never use gradients of any kind — the system is entirely flat color
- Never use #feed5a or #c67700 for primary CTAs — these are one-off editorial accents, not system action colors
- Never set body text larger than 16px or smaller than 14px — the editorial scale stays tight

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Parchment | `#fff9ee` | Page canvas and section backgrounds — the base warm tone |
| 1 | Paper White | `#ffffff` | Elevated card and video embed surfaces sitting above the cream |
| 2 | Ice Blue Wash | `#bfebfe` | Tinted surface for input fields and data row highlights |

## Imagery

Full-bleed landscape photography dominates the visual language — Scottish Highland mountains, winding single-lane roads through green valleys, open terrain under overcast skies. Treatment is naturalistic, high-resolution, and unfiltered; no duotone, no color grading overlays, no vignettes. Images are always full-bleed (no rounded corners when used as heroes) but use 15px radius when inset as content images. Photography is the primary visual content; illustration and abstract graphics are absent. Icon style is minimal line icons (hamburger menu visible in nav) with thin strokes. Density is image-heavy at section openings, text-dominant in body sections. The imagery role is emotional atmosphere and brand storytelling — nature as metaphor for long-term investing.

## Layout

Full-bleed hero photography at the top of the page, then a transition to a max-width 1280px centered content area on Cream Parchment. The hero is a full-viewport-width image with overlaid text at bottom-left and a large vertical wordmark at the right edge. Below the hero, content flows in a single editorial column or a two-column split (video left, data table right) with generous vertical spacing (64px between sections). Section rhythm is consistent: hairline divider, then a section label in small-caps, then content. No alternating dark/light bands — the entire body is cream. Navigation is a minimal slim bar at the top with hamburger menu left and wordmark right. Grid usage is minimal — mostly single-column editorial flow with occasional 2-column splits. The overall density is spacious, magazine-like, and unhurried.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #3f322a (Bark Brown)
- Background: #fff9ee (Cream Parchment)
- Border: #c5bdb3 (Stone) for hairlines, #3f322a for structure
- Accent: #004e4e (Deep Teal) for primary action
- primary action: #a56eff (filled action)

**Example Component Prompts**

1. **Hero section**: Full-bleed landscape photograph filling 100vw × 70vh. Headline 'Invest in the journey' overlaid bottom-left in white, Neue Haas Grotesk Display 68px weight 400, letter-spacing 0.54px. Vertical 'MUNRO' wordmark on right edge in white, weight 700, 120px size, letter-spacing 0.09em. No border-radius on the image.

2. **Section label + body**: Section label 'OUR GLOBAL GROWTH FUNDS' in Neue Haas Grotesk Display 12px weight 700, uppercase, letter-spacing 0.017em, color #3f322a. Below it, body paragraph in 16px weight 400, line-height 1.41, color #3f322a, max-width 680px. 1px #c5bdb3 hairline divider above the label.

3. **Data table**: Stacked rows, each separated by 1px #c5bdb3 border. Left column label in 14px weight 400, color #796e65. Right column value in 14px weight 400, color #3f322a, right-aligned. No header row, no alternating fills.

4. Create a Primary Action Button: #a56eff background, #3f322a text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. **Accent border card**: Background #fff9ee, 1px border in #560e4b (Aubergine), border-radius 2px, padding 20px. Content inside in 14px weight 400, color #3f322a. No fill change, no shadow.

## Elevation Philosophy

This system intentionally avoids shadows as a design principle. All surface separation is achieved through three mechanisms: (1) hairline 1px borders in Stone (#c5bdb3) or Bark Brown (#3f322a), (2) contrast between Cream Parchment (#fff9ee) and Paper White (#ffffff) surfaces, and (3) the visual edge where full-bleed photography meets the cream canvas. Never apply box-shadow, drop-shadow, or any blur-based elevation — it would break the flat editorial register.

## Border-Radius System

The system uses exactly two border-radius values to create a deliberate tension: 2px for all interactive and structural elements (buttons, badges, inputs, accent-border cards) — this near-square edge reads as editorial, typeset, printed. 15px for all image containers and decorative links — this generous rounding softens photography and gives visual assets warmth. Never mix these radii on the same element type. The contrast between the two is part of the identity: the page feels both sharply editorial and warmly human.

## Similar Brands

- **Stewart Investors** — Same warm cream canvas and restrained editorial typography approach to investment management branding
- **Orbis** — Same full-bleed landscape photography + whisper-weight grotesque headline pattern, treating investing as a long journey
- **Walter Scott Investment Partners** — Same cream parchment background, minimal chrome, and editorial restraint in financial communications
- **First Sentier Investors** — Same warm off-white palette and premium grotesque typography in Australian investment management context
- **Magellan Asset Management** — Same editorial publication feel with landscape photography and generous whitespace as brand differentiator

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-parchment: #fff9ee;
  --color-paper-white: #ffffff;
  --color-bark-brown: #3f322a;
  --color-warm-gray: #9f968c;
  --color-stone: #c5bdb3;
  --color-driftwood: #b3aea7;
  --color-earth: #796e65;
  --color-light-stone: #e5e5e5;
  --color-ink: #000000;
  --color-deep-teal: #004e4e;
  --color-aubergine: #560e4b;
  --color-iris: #a56eff;
  --color-cobalt: #3074f9;
  --color-ice-blue: #bfebfe;
  --color-saffron: #feed5a;
  --color-amber: #c67700;

  /* Typography — Font Families */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-5-brands: 'Font Awesome 5 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.8;
  --tracking-caption: 0.18px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.24px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.33px;
  --text-heading: 30px;
  --leading-heading: 1.13;
  --tracking-heading: 0.39px;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.09;
  --tracking-heading-lg: 0.39px;
  --text-display: 68px;
  --leading-display: 1.05;
  --tracking-display: 0.54px;

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
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 15px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-cards: 2px;
  --radius-links: 15px;
  --radius-badges: 2px;
  --radius-images: 15px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-cream-parchment: #fff9ee;
  --surface-paper-white: #ffffff;
  --surface-ice-blue-wash: #bfebfe;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-parchment: #fff9ee;
  --color-paper-white: #ffffff;
  --color-bark-brown: #3f322a;
  --color-warm-gray: #9f968c;
  --color-stone: #c5bdb3;
  --color-driftwood: #b3aea7;
  --color-earth: #796e65;
  --color-light-stone: #e5e5e5;
  --color-ink: #000000;
  --color-deep-teal: #004e4e;
  --color-aubergine: #560e4b;
  --color-iris: #a56eff;
  --color-cobalt: #3074f9;
  --color-ice-blue: #bfebfe;
  --color-saffron: #feed5a;
  --color-amber: #c67700;

  /* Typography */
  --font-neue-haas-grotesk-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-5-brands: 'Font Awesome 5 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.8;
  --tracking-caption: 0.18px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.24px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.33px;
  --text-heading: 30px;
  --leading-heading: 1.13;
  --tracking-heading: 0.39px;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.09;
  --tracking-heading-lg: 0.39px;
  --text-display: 68px;
  --leading-display: 1.05;
  --tracking-display: 0.54px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
}
```
