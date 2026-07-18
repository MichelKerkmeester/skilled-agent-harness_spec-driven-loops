# Daniel Sun — Style Reference
> Solar monolith on a white gallery wall — one yellow beam, one obsidian name, all the breathing room in the world.

**Theme:** light

Daniel Sun's portfolio is a typographic monolith: an almost entirely achromatic canvas where a single yellow light beam cuts diagonally across the hero, and the designer's name is set at 246px in an ultra-condensed 900-weight display face that nearly spans the viewport. The system is a designer's gallery — white paper, concrete gray, obsidian type, with one solar accent that doubles as the only chromatic element. Reddit Sans Condensed 900 carries every load-bearing headline at a near-architectural scale, Inter Display 500 handles secondary headings and body, and Caveat 700 injects handwritten intimacy for personal asides like 'From 2020 til today.' Surfaces are flat, shadows are almost absent, and the navigation lives inside a single dark pill capsule that floats at the top of every page. Everything is generous, quiet, and typographically assertive — the page reads as a single confident statement rather than a grid of components.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Solar Beam | `#ffd500` | `--color-solar-beam` | The system's only chromatic color — hero gradient beam, handwritten underline accent, and the pill-shaped highlight button inside the dark nav capsule. This is the single note of warmth in an otherwise achromatic composition; its presence transforms monochrome blocks into a sunlit moment |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, display headlines, nav capsule background, and dominant typographic mass. Sets the highest-contrast tone for the condensed display name and grounds the floating nav pill |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, portfolio thumbnails, and the base of the white canvas. Provides the surface that the yellow beam and obsidian type play against |
| Concrete | `#f5f5f5` | `--color-concrete` | Page canvas and the lightest card/section background. Warmer than pure white, creates the gallery-wall feel beneath the hero |
| Graphite | `#808080` | `--color-graphite` | Body text, secondary metadata, and muted UI labels. The mid-neutral that bridges the obsidian headlines and the lighter ash tones |
| Ash | `#a6a6a6` | `--color-ash` | Muted helper text, tertiary body copy, and the soft end of the text scale. Sits beneath Graphite for non-essential information |
| Fog | `#999999` | `--color-fog` | Subdued heading and label color. Slightly cooler than Ash; used for section labels that need to recede behind the primary type |
| Silver | `#b8b8b8` | `--color-silver` | Subtle shadow tint and the softest hairline border. Carries the single shadow pattern that gives portfolio cards their barely-there lift |
| Soft Shadow | `#cfcfcf` | `--color-soft-shadow` | Drop shadow and elevation wash. The companion to Silver for the card shadow rgba(0,0,0,0.12) — never seen directly, only felt as depth |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Reddit Sans Condensed — Display headlines — the name 'DANIEL SUN' at 246px and section titles like 'MY LATEST WORK' at 88px. Ultra-condensed, ultra-black; the type is the architecture. Tracking tightens as size grows (-6.9px at 246px) to keep the massive letterforms visually unified. Substitute: Bebas Neue or Anton for the condensed impact, though no free font fully matches the geometry. · `--font-reddit-sans-condensed`
- **Substitute:** Bebas Neue, Anton, Oswald
- **Weights:** 900
- **Sizes:** 36px, 88px, 246px
- **Line height:** 0.90–1.00
- **Letter spacing:** -2.63px at 36px, -2.99px at 88px, -6.89px at 246px
- **OpenType features:** `"cpsp", "liga" 0`
- **Role:** Display headlines — the name 'DANIEL SUN' at 246px and section titles like 'MY LATEST WORK' at 88px. Ultra-condensed, ultra-black; the type is the architecture. Tracking tightens as size grows (-6.9px at 246px) to keep the massive letterforms visually unified. Substitute: Bebas Neue or Anton for the condensed impact, though no free font fully matches the geometry.

### Inter Display — Section headings and larger body text. The medium weight (not bold) is deliberate — Inter Display 500 sits between the whisper of system text and the shout of the display face, creating a quiet middle register. Used for the 26–30px subheadings and the 18–20px lead paragraphs. · `--font-inter-display`
- **Substitute:** Inter (Google Fonts), Söhne
- **Weights:** 500
- **Sizes:** 18px, 20px, 26px, 30px
- **Line height:** 1.10–1.35
- **Role:** Section headings and larger body text. The medium weight (not bold) is deliberate — Inter Display 500 sits between the whisper of system text and the shout of the display face, creating a quiet middle register. Used for the 26–30px subheadings and the 18–20px lead paragraphs.

### Inter — Body copy, navigation labels, and inline text. The 14px body-sm and 20px subheading sizes are the everyday workhorses; the 128px outlier is a decorative/typographic moment. Consistent 500 weight keeps the text system cohesive without ever feeling bold. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 500
- **Sizes:** 14px, 20px, 128px
- **Line height:** 1.20
- **Letter spacing:** -0.50px at 14px, -0.32px at 20px
- **Role:** Body copy, navigation labels, and inline text. The 14px body-sm and 20px subheading sizes are the everyday workhorses; the 128px outlier is a decorative/typographic moment. Consistent 500 weight keeps the text system cohesive without ever feeling bold.

### Caveat — Handwritten personal asides — 'From 2020 til today,' date stamps, signature-style annotations. The only script in the system; its presence signals intimacy and breaks the architectural severity of the condensed display type. Use sparingly — one or two instances per section maximum. · `--font-caveat`
- **Substitute:** Caveat (Google Fonts), Patrick Hand
- **Weights:** 700
- **Sizes:** 18px, 28px
- **Line height:** 0.96–1.20
- **Letter spacing:** -0.65px at 18px, -1.01px at 28px
- **Role:** Handwritten personal asides — 'From 2020 til today,' date stamps, signature-style annotations. The only script in the system; its presence signals intimacy and breaks the architectural severity of the condensed display type. Use sparingly — one or two instances per section maximum.

### System Sans — Smallest UI text — copyright lines, micro-labels, and inline metadata. Stays quiet and never competes with the display system. · `--font-system-sans`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.20
- **Role:** Smallest UI text — copyright lines, micro-labels, and inline metadata. Stays quiet and never competes with the display system.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | -0.5px | `--text-body-sm` |
| body | 18px | 1.3 | — | `--text-body` |
| subheading | 20px | 1.2 | -0.32px | `--text-subheading` |
| heading-sm | 26px | 1.1 | — | `--text-heading-sm` |
| heading | 30px | 1.1 | — | `--text-heading` |
| heading-lg | 36px | 0.96 | -2.63px | `--text-heading-lg` |
| display | 88px | 0.9 | -2.99px | `--text-display` |
| display-xl | 246px | 1 | -6.89px | `--text-display-xl` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| images | 14px |
| buttons | 32px |
| navCapsule | 110px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.12) -2px 3px 3px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-40px
- **Element gap:** 8-16px

## Components

### Nav Capsule
**Role:** Primary navigation container

Floating pill at the top center of every page. Background #1f1f1f (near-black), radius 110px (fully rounded), padding roughly 8px vertical. Contains a small icon glyph, four text nav links (Work, Story, Process, Connect) in Inter 500 14px #ffffff, and a yellow highlight button on the right. Sits above content with no border and no shadow — its dark mass is enough to separate it from the white canvas.

### Nav Highlight Button
**Role:** Primary call-to-action within the nav capsule

Pill-shaped button embedded in the right side of the nav capsule. Background #ffd500 (Solar Beam), text in Obsidian (#000000), radius 32px, padding 8px 20px. Font is Inter 500 at 14px. The only yellow surface in the entire system — its job is to read as a switch turned on against the dark capsule.

### Display Name
**Role:** Hero identity — the designer's name as architecture

Set in Reddit Sans Condensed 900 at 246px, line-height 1.0, letter-spacing -6.89px. Color Obsidian (#000000). Stretches nearly edge-to-edge of the viewport. This is not a headline — it is a typographic mass that functions as the page's structural element. The extreme tracking (-6.89px) is essential: at 246px, default spacing would make the letterforms feel disconnected.

### Hero Gradient Beam
**Role:** Signature visual element — the single chromatic accent

A diagonal yellow gradient beam that cuts from upper-right to lower-left across the hero. Background uses a soft yellow-to-transparent gradient anchored on #ffd500. It is not a shape but a wash of light — edges feather into the white canvas with no hard border. Only one such beam exists per page; it is the solar metaphor that gives the monochrome system its warmth.

### Section Title
**Role:** Section-level display heading

Set in Reddit Sans Condensed 900 at 88px, line-height 0.90, letter-spacing -2.99px. Centered horizontally. Color Obsidian. Used for major section openers like 'MY LATEST WORK.' The same condensed display face as the hero name, scaled down — maintains typographic continuity from page-level to section-level.

### Handwritten Annotation
**Role:** Personal timestamp or intimate label

Set in Caveat 700 at 28px, line-height 0.96, letter-spacing -1.01px. Color Graphite (#808080) or Ash (#a6a6a6). Sits above section titles as a date range or personal note ('From 2020 til today'). The script weight and grey color make it feel like a handwritten margin note — it humanizes the architectural type system.

### Portfolio Card
**Role:** Project/work showcase container

White surface (#ffffff) on the Concrete canvas (#f5f5f5). Radius 14px. Subtle shadow: rgba(0, 0, 0, 0.12) -2px 3px 3px 0px — the only shadow in the system. Padding 32-40px inside. Contains a large preview image (border-radius 14px to match), a project label, and metadata. The 14px radius is the signature curve — softer than sharp, sharper than a pill.

### Lead Paragraph
**Role:** Introductory body text below display headlines

Set in Inter Display 500 at 18-20px, line-height 1.30. Color Graphite (#808080). Two lines maximum — functions as a subtitle to the display headline, not a paragraph. The medium weight (not regular) gives the intro enough presence to sit beneath a 246px headline without disappearing.

### Portfolio Preview Frame
**Role:** Image container within a portfolio card

Screenshot or product image, radius 14px, displayed edge-to-edge within the card padding. Images are not cropped to square — they maintain their natural aspect ratio. The 14px radius mirrors the card, creating visual harmony between the frame and its contents.

## Do's and Don'ts

### Do
- Use Reddit Sans Condensed 900 at 88-246px for every display-level headline; the condensed geometry is the brand.
- Set the name/hero display at exactly 246px with letter-spacing -6.89px — this scale is the signature, not optional.
- Place exactly one yellow gradient beam per hero; it is the only chromatic element in the system.
- Use Caveat 700 at 28px for personal timestamps above section titles, colored Graphite (#808080) so it recedes behind the display face.
- Use the nav capsule (110px radius, #1f1f1f background) for all top-level navigation — never replace it with a flat horizontal bar.
- Round portfolio cards and images at 14px; round buttons at 32px (pill); round the nav at 110px (fully rounded). These three radii are the system's geometry.
- Keep body text in Inter 500 at 18-20px with line-height 1.30; never use weight 400 — the medium weight is non-negotiable for readability against the massive display type.

### Don't
- Do not add chromatic colors beyond #ffd500 — the system is monochrome with one solar accent; introducing a second hue breaks the gallery metaphor.
- Do not set the display name below 88px or above 246px — the extreme scale is the point; intermediate sizes lose impact.
- Do not use shadows on buttons, nav elements, or text blocks; the single shadow pattern is reserved for portfolio cards only.
- Do not replace Reddit Sans Condensed with a non-condensed display face; the compressed letterforms are what make the 246px headline read as a single mass.
- Do not use Caveat for anything longer than a date range or one-line aside; the script loses intimacy when it carries real content.
- Do not add gradients other than the single yellow beam; the system is flat surfaces and one light source — multi-color gradients destroy the restraint.
- Do not use weight 700+ for body or subheading text; the 500 weight is the system's voice — bolding it creates visual noise against the 900-weight display face.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Gallery Canvas | `#f5f5f5` | The base page background — a warm near-white that reads as concrete or gallery wall beneath the hero. |
| 1 | Paper Surface | `#ffffff` | Cards, portfolio thumbnails, and elevated content blocks. Pure white creates the strongest contrast against the canvas. |
| 2 | Nav Capsule | `#1f1f1f` | The floating pill navigation — a near-black that anchors the top of every page and frames the yellow highlight button. |
| 3 | Obsidian Mass | `#000000` | The display headline color — reads as a solid mass at 246px, not merely text. The typographic surface. |

## Elevation

- **Portfolio Card:** `rgba(0, 0, 0, 0.12) -2px 3px 3px 0px`

## Imagery

Imagery is sparse and intentional. The hero features no photography — only a diagonal yellow gradient beam as an abstract light effect. Portfolio sections display product screenshots inside 14px-radius frames, presented as evidence of work rather than lifestyle context. The visual language is: no people, no environments, no mood photography. When images appear, they are tight product crops on pure surfaces — the work itself is the hero, not the designer. Icons are minimal and outline-style (the small glyph in the nav capsule). The overall density is text-dominant: typography occupies more visual space than any image.

## Layout

Full-bleed layout with a floating centered nav capsule at the top. The hero is unconstrained — the 246px display name stretches to the viewport edges, with no max-width container. Content sections below use a 1200px max-width and center their text. Section rhythm is spacious: 80-120px vertical gaps between major sections, alternating between centered text blocks and full-width portfolio cards. The portfolio section breaks the centered text pattern by introducing a wide card that spans the full content width. Navigation is a single floating pill — no sidebar, no sticky header banner, no mega-menu. The page reads top-to-bottom as: nav → hero (name + beam) → work intro → portfolio grid → next section. The composition is asymmetric in the hero (text-left, beam-right) and centered in all subsequent sections.

## Agent Prompt Guide

## Quick Color Reference

- Text (primary): #000000 (Obsidian)
- Text (body/muted): #808080 (Graphite)
- Background (canvas): #f5f5f5 (Concrete)
- Surface (cards): #ffffff (Paper White)
- Border/shadow: #b8b8b8 (Silver)
- Accent: #ffd500 (Solar Beam)
- primary action: no distinct CTA color

## Example Component Prompts

**1. Hero Section:** White canvas (#f5f5f5). Diagonal yellow gradient beam (anchored on #ffd500) cutting from upper-right to lower-left. Lead paragraph: Inter Display 500, 18px, #808080, two lines max. Display name below: Reddit Sans Condensed 900 at 246px, #000000, letter-spacing -6.89px, line-height 1.0. Name stretches nearly full viewport width.

**2. Section Title Block:** Centered on canvas. Handwritten timestamp above in Caveat 700, 28px, #808080, letter-spacing -1.01px. Section title below in Reddit Sans Condensed 900, 88px, #000000, letter-spacing -2.99px, line-height 0.90. Minimum 80px vertical gap above and below.

**3. Portfolio Card:** White surface (#ffffff) on canvas (#f5f5f5). Border-radius 14px. Shadow: rgba(0,0,0,0.12) -2px 3px 3px 0px. Internal padding 32-40px. Preview image at top with border-radius 14px, natural aspect ratio. Project label in Inter 500, 14px, #000000. Metadata in Inter 500, 12px, #a6a6a6.

**4. Floating Nav Capsule:** Horizontal pill, background #1f1f1f, border-radius 110px. Padding 8px vertical, ~40px horizontal. Contains: small outline icon (12px, #ffffff) + four nav links (Inter 500, 14px, #ffffff) + yellow highlight button on the right (#ffd500 background, #000000 text, border-radius 32px, padding 8px 20px). Positioned centered at top of page, floating above content with no shadow.

**5. Body Text Block:** Max-width 1200px, centered. Inter Display 500, 20px, #808080, line-height 1.30. Two to three lines maximum. Functions as a subtitle to a display headline, not as standalone content.

## Typographic Scale Philosophy

The type system operates on extreme contrast: 246px condensed display against 14px Inter body. There is no middle ground at 60-80px — the jump from heading (30px) to display (88px) to display-xl (246px) is deliberately discontinuous. This is a portfolio system, not a content system: the name and section titles are the page, and everything else is footnote. Inter Display 500 is the quiet voice between the display shout and the system text whisper. Caveat 700 is the human signature — its presence signals that the designer is speaking personally, not presenting work. Never use more than two typefaces per page section: the condensed display + the handwritten annotation, or the condensed display + Inter body.

## Similar Brands

- **Tobias van Schneider** — Same designer-portfolio structure: oversized condensed display type, monochrome canvas, single accent moment, and generous negative space that lets the name function as architecture.
- **Pentagram** — Same flat-surface gallery aesthetic — white canvas, bold display headings at extreme scale, minimal shadows, and a single chromatic element used as punctuation rather than decoration.
- **Rauno Freiberg** — Same typographic-first philosophy where a condensed display face carries the visual weight and the rest of the page is quiet monochrome; the designer's name IS the hero.
- **Locomotive (locomotive.ca)** — Same dark-pill navigation capsule floating over a light canvas, with a single colored highlight button embedded inside — the nav-as-object approach is a shared signature.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-solar-beam: #ffd500;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-concrete: #f5f5f5;
  --color-graphite: #808080;
  --color-ash: #a6a6a6;
  --color-fog: #999999;
  --color-silver: #b8b8b8;
  --color-soft-shadow: #cfcfcf;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reddit-sans-condensed: 'Reddit Sans Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caveat: 'Caveat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.5px;
  --text-body: 18px;
  --leading-body: 1.3;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.32px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.1;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --text-heading-lg: 36px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -2.63px;
  --text-display: 88px;
  --leading-display: 0.9;
  --tracking-display: -2.99px;
  --text-display-xl: 246px;
  --leading-display-xl: 1;
  --tracking-display-xl: -6.89px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32-40px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 80px;
  --radius-full-2: 110px;
  --radius-full-3: 128px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-images: 14px;
  --radius-buttons: 32px;
  --radius-navcapsule: 110px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.12) -2px 3px 3px 0px;

  /* Surfaces */
  --surface-gallery-canvas: #f5f5f5;
  --surface-paper-surface: #ffffff;
  --surface-nav-capsule: #1f1f1f;
  --surface-obsidian-mass: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-solar-beam: #ffd500;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-concrete: #f5f5f5;
  --color-graphite: #808080;
  --color-ash: #a6a6a6;
  --color-fog: #999999;
  --color-silver: #b8b8b8;
  --color-soft-shadow: #cfcfcf;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reddit-sans-condensed: 'Reddit Sans Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caveat: 'Caveat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.5px;
  --text-body: 18px;
  --leading-body: 1.3;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.32px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.1;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --text-heading-lg: 36px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -2.63px;
  --text-display: 88px;
  --leading-display: 0.9;
  --tracking-display: -2.99px;
  --text-display-xl: 246px;
  --leading-display-xl: 1;
  --tracking-display-xl: -6.89px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 80px;
  --radius-full-2: 110px;
  --radius-full-3: 128px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.12) -2px 3px 3px 0px;
}
```
