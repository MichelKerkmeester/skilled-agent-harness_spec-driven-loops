# (dot)connect — Style Reference
> Swiss engineering blueprint with a single ember

**Theme:** light

(dot)connect operates as a Swiss-engineering canvas: a warm off-white stage (#fcfbf8) where a single near-black ink (#001011) does almost all the work, and a vivid orange (#fd5321) appears only as deliberate punctuation — never decoration. The typographic signature is extreme: headlines balloon to 72-101px with aggressive negative tracking (-0.025em), creating a display voice that feels architectural rather than marketing-soft. Components are softly rounded (20-24px radii on cards and buttons), never sharp, never heavy — elevation is implied through hairline borders and tonal surface shifts, not shadows. The system reads as 'engineering blueprint with a pulse of fire': monochromatic discipline broken by one warm chromatic gesture per viewport.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Canvas | `#fcfbf8` | `--color-bone-canvas` | Primary page background, card surfaces, light text on dark — warm off-white reads as paper, not screen |
| Charcoal Ink | `#001011` | `--color-charcoal-ink` | Primary text, headings, primary action fill, dominant borders — near-black with a barely-perceptible cool tint that distinguishes it from pure #000 |
| Smoke Veil | `#0f1e1f` | `--color-smoke-veil` | Secondary text and borders for body-level elements — a half-step lighter than Charcoal for visual hierarchy without contrast loss |
| Ash Layer | `#ededea` | `--color-ash-layer` | Elevated card backgrounds, subtle surface differentiation, hover states — a warm gray that complements the bone canvas without going cold |
| Mist Border | `#c1c4c2` | `--color-mist-border` | Hairline borders, dividers, section separators — barely visible structural lines |
| Ember | `#fd5321` | `--color-ember` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Signal Blue | `#007aff` | `--color-signal-blue` | Outlined action border for secondary interactive elements — ghost-button strokes only, never filled |

## Tokens — Typography

### AeonikPro — Primary typeface across all UI: body (16-18px/400), navigation (16px/500), card titles (24-32px/500), section headings (36px/500), hero display (72-101px/400-500). The custom font's geometric proportions and the 'dlig', 'ss02', 'ss08' stylistic alternates give the system its engineering-precise voice — ss08 likely enables a more open 'a' and 'e', ss02 a distinctive 'g' · `--font-aeonikpro`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400, 500
- **Sizes:** 16, 18, 21, 24, 32, 36, 72, 101
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.025em at 72-101px, -0.012em at 32-36px, +0.010em at 16-18px body
- **OpenType features:** `"dlig" on, "ss02" on, "ss08" on`
- **Role:** Primary typeface across all UI: body (16-18px/400), navigation (16px/500), card titles (24-32px/500), section headings (36px/500), hero display (72-101px/400-500). The custom font's geometric proportions and the 'dlig', 'ss02', 'ss08' stylistic alternates give the system its engineering-precise voice — ss08 likely enables a more open 'a' and 'e', ss02 a distinctive 'g'

### DotConnect — Branded display variant for hero and section headings — used selectively where the brand name or signature statements appear, giving those moments a distinct voice from the general AeonikPro headlines · `--font-dotconnect`
- **Substitute:** AeonikPro with same tracking values
- **Weights:** 500
- **Sizes:** 19, 24, 36, 73
- **Line height:** 1.0–1.67
- **Letter spacing:** -0.012em at 36-73px, +0.010em at 19px
- **OpenType features:** `"dlig" on, "ss02" on, "ss08" on`
- **Role:** Branded display variant for hero and section headings — used selectively where the brand name or signature statements appear, giving those moments a distinct voice from the general AeonikPro headlines

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.5 | 0.16px | `--text-caption` |
| body | 18px | 1.4 | 0.18px | `--text-body` |
| subheading | 24px | 1.4 | -0.29px | `--text-subheading` |
| heading-sm | 32px | 1.1 | -0.38px | `--text-heading-sm` |
| heading | 36px | 1.1 | -0.72px | `--text-heading` |
| heading-lg | 72px | 0.9 | -1.8px | `--text-heading-lg` |
| display | 101px | 0.8 | -2.53px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| links | 44px |
| pills | 48px |
| badges | 8px |
| images | 20px |
| buttons | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Filled CTA Button (Ember)
**Role:** Primary action — 'let's connect' in header, key conversion points

Pill-shaped (24px radius) filled button. Background: #fd5321. Text: #fcfbf8 at 16px, AeonikPro 500, letter-spacing +0.010em. Padding: 8px 24px. Optional leading icon slot. No border, no shadow — the orange does all the work against the bone canvas.

### Arrow Pill Button
**Role:** Secondary action — 'more' CTAs, inline navigation triggers

Pill-shaped (44px radius) button with circular arrow icon on left and label on right. Background: #001011. Icon circle: #fcfbf8 with #001011 arrow glyph. Text: #fcfbf8 at 16px AeonikPro 500. Padding: 6px 20px 6px 6px. Icon circle is 32px diameter.

### Ghost/Outlined Action
**Role:** Tertiary interactive — secondary CTAs that should not compete with Ember

Transparent fill with #007aff border (1px). Text: #007aff at 16px AeonikPro 500. Radius: 24px. Padding: 12px 24px. Used when an action exists but is subordinate to the primary Ember CTA.

### Offer Card
**Role:** Two-column service offering cards ('corporates', 'investors')

Background: #fcfbf8. Border: 1px #c1c4c2. Border-radius: 20px. Padding: 32px. Title: AeonikPro 500 at 24px, #001011. Body: AeonikPro 400 at 18px, #0f1e1f. Arrow icon prefix on title in a 24px circle. No shadow — borders carry the structure.

### Case Study Card
**Role:** Stories carousel cards (e.g. 'skillchain')

Vertical card with image container on top, text below. Image container: aspect ratio ~4:3, 20px top radius, overflow hidden. Text block: padding 16px on bone canvas. Project name: AeonikPro 500 at 18px, #001011. Description: AeonikPro 400 at 16px, #0f1e1f. Subtle border or no border — image is the visual anchor.

### Section Header
**Role:** Section openers — 'offer', 'stories', etc.

Two-part header: left side has a numbered arrow icon + section name in AeonikPro 500 at 18px, #001011. Right side has parenthetical section number (e.g. '(02)', '(04)') in same style. Below, optional centered headline at 32-36px. Horizontal hairline (#c1c4c2) separates header from content.

### Top Navigation
**Role:** Primary site navigation

Fixed/sticky top bar. Logo '(dot)connect' on far left at 19px AeonikPro 500. Center: nav links (about, offer, brainpower, stories, team, philosophy) at 16px AeonikPro 400, #0f1e1f, 24px gap. Far right: Ember CTA button. No background blur or border — sits on bone canvas.

### Carousel Navigation
**Role:** Horizontal scroll indicators for stories section

Circular buttons (32px) positioned at vertical center of carousel track. Background: #fcfbf8 with #001011 arrow glyph. No border, no shadow. Left/right pair flanking the card row.

### Badge / Tag
**Role:** Inline metadata, small status labels

Small pill with 8px radius. Background: #fcfbf8. Border: 1px #c1c4c2. Padding: 4px 8px. Text: AeonikPro 400 at 14px, #0f1e1f.

### Hero Section
**Role:** First-viewport statement

Full-width on bone canvas. Centered text block, max-width ~900px. Headline: AeonikPro 400-500 at 72-101px, #001011, line-height 0.8-0.9, letter-spacing -0.025em. Subtext: AeonikPro 400 at 18px, #0f1e1f, max 60ch. Arrow pill CTA centered below. No hero image — text IS the hero.

### 3D Render Feature Block
**Role:** Full-width visual interludes between text sections

Full-bleed image area on bone canvas. Contains metallic/glass 3D render (brain, abstract objects) often with Ember-colored particle accents. No caption overlay — the visual speaks alone with breathing room above and below.

## Do's and Don'ts

### Do
- Use Ember (#fd5321) for exactly one CTA per viewport — it loses all power if it appears twice on screen
- Set headline letter-spacing to -0.025em at 72px+ and relax it to +0.010em at body sizes — this asymmetry is the typographic signature
- Apply 20px radius to all cards, 24px to all buttons, 44-48px to pill-shaped elements — never mix 8px and 20px in the same component family
- Separate sections with 96px vertical breathing room on bone canvas — the whitespace IS the layout system
- Use the Arrow Pill Button (dark fill, circular icon) for inline 'more' actions, not the Ember CTA — reserve Ember for top-right header and key conversion moments
- Enable 'dlig', 'ss02', 'ss08' font features on all AeonikPro text — these stylistic alternates are part of the brand voice
- Use #c1c4c2 hairline borders (1px) for structure instead of shadows — the system is border-driven, not elevation-driven

### Don't
- Don't use shadows or drop-shadow effects — the system has no elevation language; depth comes from tonal surface shifts
- Don't place Ember on Ember or Ember on #001011 surfaces without testing contrast — the orange can vibrate uncomfortably against the dark charcoal
- Don't set body text below 16px or above 21px — the type scale skips small sizes deliberately to maintain confidence
- Don't use #007aff as a filled background — it is a ghost/outlined accent only; filled blue breaks the monochrome-ember logic
- Don't add decorative gradients, glows, or blur effects — the system is flat, bordered, and high-contrast
- Don't right-align body paragraphs — body text is always left-aligned; only display headlines may be centered
- Don't use icons with stroke weights under 1.5px or over 2px — the icon system matches the 1px border language

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#fcfbf8` | Page background, base layer |
| 1 | Ash Layer | `#ededea` | Card and elevated surface backgrounds |
| 2 | Smoke Veil | `#0f1e1f` | Dark mode moments, high-contrast containers |
| 3 | Ember | `#fd5321` | Brand-emphasis surface — used on CTA buttons and accent blocks |

## Imagery

Imagery is sparse and high-impact: large full-bleed 3D renders sit as interludes between text-heavy sections, never as backgrounds under text. The renders are metallic/chrome with glass-like translucency, often featuring a single Ember-orange accent (particles falling from a chrome brain, orange geometric objects). Case study cards use 3D illustration thumbnails with the same metallic+orange treatment. No photography, no people, no lifestyle imagery — the visual language is object-as-hero, abstract and sculptural. Iconography is minimal and monoline: simple arrow glyphs in circular containers, no icon sets or decorative symbols. The overall density is text-dominant with imagery appearing once per 2-3 viewport heights.

## Layout

Full-width sections on bone canvas with content centered to a ~1200px max-width. The page rhythm is: text-hero → full-bleed 3D visual → numbered text section with 2-column card grid → full-bleed 3D visual → numbered text section with 3-column carousel. Sections are separated by 96px vertical gaps with no dividers — whitespace defines boundaries. The top navigation is a single thin bar (logo left, links center, Ember CTA right) that sits on bone canvas without a background fill or border. Section headers use a split layout: numbered label left, parenthetical count right, with centered headlines below for major sections. The grid system is implicit — content aligns to a 24px column gap with cards arranged in 2 or 3 columns depending on context. No sidebar, no sticky elements other than nav, no mega-menus.

## Agent Prompt Guide

## Quick Color Reference
- background: #fcfbf8
- text: #001011
- secondary text: #0f1e1f
- card surface: #ededea
- border: #c1c4c2
- accent: #fd5321 (Ember)
- primary action: #001011 (filled action)

## Example Component Prompts

1. **Hero Section**: bone canvas (#fcfbf8) background, full-width. Centered headline at 72px AeonikPro weight 400, #001011, letter-spacing -1.8px, line-height 0.9. Subtext at 18px AeonikPro 400, #0f1e1f, max-width 60ch, centered. Arrow pill button (24px radius, #001011 background, #fcfbf8 text, 32px circular icon with arrow glyph) labeled 'more', centered below subtext. 120px vertical padding top and bottom.

2. **Offer Card**: #fcfbf8 background, 1px #c1c4c2 border, 20px radius, 32px padding. Title at 24px AeonikPro 500, #001011, with 24px circular arrow icon prefix (#001011 bg, #fcfbf8 arrow). Body text at 18px AeonikPro 400, #0f1e1f, line-height 1.4. No shadow.

3. **Arrow Pill Button**: 44px radius, #001011 background, padding 6px 20px 6px 6px. Leading 32px circular icon slot (#fcfbf8 bg, #001011 arrow at 16px). Label text at 16px AeonikPro 500, #fcfbf8, letter-spacing +0.16px.

4. **Case Study Card**: vertical layout, no border. Image container 4:3 aspect ratio, 20px top radius (matching card), overflow hidden, #ededea placeholder. Text block below with 16px padding. Project name at 18px AeonikPro 500, #001011. Description at 16px AeonikPro 400, #0f1e1f, 3-line clamp.

5. **Section Header**: full-width row. Left: 24px circular arrow icon (#001011 bg, #fcfbf8 arrow) + section name at 18px AeonikPro 500, #001011, gap 12px. Right: parenthetical number '(02)' at 18px AeonikPro 500, #001011. 1px #c1c4c2 hairline below spanning full width.

## Similar Brands

- **Linear** — Same commitment to generous whitespace, geometric sans-serif at extreme display sizes, and monochrome interfaces with a single accent color used surgically
- **Vercel** — Identical typographic confidence — oversized tightly-tracked headlines, minimal component vocabulary, and the same border-over-shadow elevation philosophy
- **Pitch** — Shares the warm off-white canvas treatment and the pattern of using a vivid accent (orange-adjacent) only for high-intent CTAs while keeping all structural elements achromatic
- **Loom** — Same pill-shaped button language with circular icon prefixes, and the same restraint of letting a single warm color carry all the emotional weight in an otherwise quiet system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-canvas: #fcfbf8;
  --color-charcoal-ink: #001011;
  --color-smoke-veil: #0f1e1f;
  --color-ash-layer: #ededea;
  --color-mist-border: #c1c4c2;
  --color-ember: #fd5321;
  --color-signal-blue: #007aff;

  /* Typography — Font Families */
  --font-aeonikpro: 'AeonikPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dotconnect: 'DotConnect', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: 0.16px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: 0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.29px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.38px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -0.72px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.8px;
  --text-display: 101px;
  --leading-display: 0.8;
  --tracking-display: -2.53px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 44px;
  --radius-full: 48px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-links: 44px;
  --radius-pills: 48px;
  --radius-badges: 8px;
  --radius-images: 20px;
  --radius-buttons: 24px;

  /* Surfaces */
  --surface-bone-canvas: #fcfbf8;
  --surface-ash-layer: #ededea;
  --surface-smoke-veil: #0f1e1f;
  --surface-ember: #fd5321;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-canvas: #fcfbf8;
  --color-charcoal-ink: #001011;
  --color-smoke-veil: #0f1e1f;
  --color-ash-layer: #ededea;
  --color-mist-border: #c1c4c2;
  --color-ember: #fd5321;
  --color-signal-blue: #007aff;

  /* Typography */
  --font-aeonikpro: 'AeonikPro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dotconnect: 'DotConnect', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: 0.16px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: 0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.29px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.38px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -0.72px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -1.8px;
  --text-display: 101px;
  --leading-display: 0.8;
  --tracking-display: -2.53px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 44px;
  --radius-full: 48px;
}
```
