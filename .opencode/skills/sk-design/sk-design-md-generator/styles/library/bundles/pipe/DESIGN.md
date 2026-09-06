# Pipe — Style Reference
> midnight darkroom with one ember

**Theme:** dark

Pipe runs on a midnight editorial language: pitch-black canvas, a single warm orange brand accent, and one large-format photograph anchoring each section. The system is deliberately sparse — only one chromatic color in the entire palette, used sparingly as a switch-on signal for action and brand identity. Typography is a single-family geometric grotesque at one weight (400) doing all the work, with display sizes set at extremely tight line-heights (0.70) to feel sculpted rather than typeset. Surfaces are flat with no shadows; elevation is communicated through the single half-step from #000000 to #1a1a1a. Components are small, light, and bordered rather than filled — orange appears only when something must be acted upon. The overall effect is a darkroom where a single ember glows against graphite.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember | `#e2572c` | `--color-ember` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, full-bleed backgrounds, image surrounds |
| Graphite | `#1a1a1a` | `--color-graphite` | Card surfaces, elevated panels, the one step up from canvas |
| Steel | `#808080` | `--color-steel` | Muted body text, secondary labels, inactive UI — sits at AA contrast against Obsidian |
| Fog | `#f5f5f5` | `--color-fog` | Hairline borders on dark cards, light surface alternates if used |
| Snow | `#ffffff` | `--color-snow` | Primary text and headings on dark, inverse text on light cards |

## Tokens — Typography

### Suisse — The only typeface. Single weight (400) used for everything from 10px micro-labels to 80px display headlines. The signature move is the display at 80px with a 0.70 line-height — headlines feel carved rather than set. Tracking is tight at display (-0.0070em) and slightly open (+0.0060em) at caption sizes for legibility. · `--font-suisse`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 10, 12, 13, 14, 16, 20, 24, 32, 80
- **Line height:** 0.70, 1.10, 1.24, 1.25, 1.33, 1.37, 1.40, 1.42, 1.43, 1.50, 1.63, 1.90
- **Letter spacing:** -0.0070em at display (80px), +0.0060em at caption (10-14px)
- **OpenType features:** `"kern"`
- **Role:** The only typeface. Single weight (400) used for everything from 10px micro-labels to 80px display headlines. The signature move is the display at 80px with a 0.70 line-height — headlines feel carved rather than set. Tracking is tight at display (-0.0070em) and slightly open (+0.0060em) at caption sizes for legibility.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.06px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| display | 80px | 0.7 | -0.56px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 9999px |
| images | 16px |
| buttons | 8px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64-80px
- **Card padding:** 24-48px
- **Element gap:** 24px

## Components

### Primary CTA Button (Ember)
**Role:** Filled orange button for the single most important action on a page (e.g. 'Book a demo')

Background #e2572c, text #ffffff, border-radius 8px, padding 16px 24px, Suisse 400 16px, no shadow. The only filled button in the system.

### Ghost Text Link
**Role:** Inline and navigation links in body or header

No background, no border. Text color #ffffff or #e2572c when active. 16px Suisse 400. The 'Demo' nav link uses #e2572c color as an active state marker.

### Navigation Header
**Role:** Top-level site navigation

Transparent or #000000 background, no border. Logo left, nav items centered or left-aligned at 13-14px Suisse 400 in #ffffff, 'Sign in' as ghost link and 'Demo' as orange text link on the right. Vertical padding ~24px.

### Hero Photograph Panel
**Role:** Full-bleed image anchoring the hero section

Large editorial photograph at 16px border-radius, occupying roughly the right half of the viewport. No overlay, no border. Photographs carry the visual weight that color and illustration don't.

### Graphite Card
**Role:** Content card on dark canvas

Background #1a1a1a, optional 1px Fog #f5f5f5 border, 16px border-radius, padding 32-48px. Text inside is #ffffff for headings, #808080 for body.

### Image Card
**Role:** Card pairing a photograph with a caption or label

16px border-radius on the image, caption below in 13-14px Suisse 400 #808080. No card background — sits directly on the Obsidian canvas.

### Pill Tag
**Role:** Category labels, status indicators

9999px border-radius, 1px hairline border in #808080 or #f5f5f5, transparent background, 12-13px Suisse 400 text in #808080, padding 4px 12px.

### Footer
**Role:** Site footer

Obsidian #000000 background, columns of ghost text links in #808080 at 13px Suisse 400, logo and brand mark in #ffffff.

### Hero Headline Block
**Role:** Left-aligned hero text block with brand-color emphasis word

Display text at 80px Suisse 400, line-height 0.70, letter-spacing -0.56px. The lead word ('Pipe') colored #e2572c; remaining text #ffffff. Subhead at 16-20px in #808080 below. Generous left padding matching the image edge.

### Ghost Outline Button
**Role:** Secondary action where the primary CTA already exists

1px border in #808080, transparent background, #ffffff text, 8px border-radius, 16px 24px padding. Rarer than the primary — used when a page needs two actions.

## Do's and Don'ts

### Do
- Use #e2572c Ember exclusively for primary action backgrounds and the single brand-emphasis word in a headline — never for body text, borders, or decoration
- Set display headlines at 80px with line-height 0.70 and letter-spacing -0.56px to achieve the sculpted, carved look
- Communicate elevation through the #000000 → #1a1a1a surface step and hairline Fog borders, never with box-shadows
- Use 16px radius for cards and images, 8px for buttons, 9999px only for pill tags
- Apply the +0.0060em tracking on any text 14px or smaller for legibility on dark backgrounds
- Anchor every hero section with a full-bleed editorial photograph at 16px radius — let imagery carry visual weight that color and illustration don't
- Keep section gaps between 64-80px to maintain the comfortable, editorial rhythm

### Don't
- Don't introduce a second chromatic color — the single-accent system is the brand's signature restraint
- Don't use box-shadows on any component; elevation is surface-tone only
- Don't set display text at line-height above 1.0 — the 0.70 tight setting is what makes headlines feel carved
- Don't use more than one font weight (400) — bolding is not available; use size and color contrast instead
- Don't fill buttons with neutral colors (#ffffff or #1a1a1a) as primary actions — Ember is the only CTA fill
- Don't use #808080 for interactive text on #1a1a1a — the contrast falls below AA at smaller sizes; reserve Steel for non-interactive muted labels on #000000
- Don't center-align body text or headlines; the system is left-aligned throughout

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000000` | Full-bleed page background, image surrounds, dark bands |
| 1 | Card | `#1a1a1a` | Elevated panels, bordered cards, content blocks |
| 2 | Light Surface | `#f5f5f5` | Rare light alternates, image cards on light sections |

## Elevation

No shadows. Elevation is communicated exclusively through the half-step surface change from Obsidian #000000 to Graphite #1a1a1a, plus hairline Fog #f5f5f5 borders. The flatness is deliberate — the darkroom aesthetic rejects ambient occlusion in favor of stark layering.

## Imagery

Photography is the primary visual language. Full-bleed editorial photographs anchor hero sections and major content blocks — warm-toned, documentary-style imagery of people in real working environments (phones, laptops, workspace objects). Photographs are treated at 16px border-radius with no overlay or filter, sitting directly on the Obsidian canvas. No illustrations, no 3D renders, no abstract graphics. The image-to-text ratio is high on hero sections (~50/50 split) and drops on content sections. Icons are minimal and not a primary visual element. The overall effect is editorial/magazine rather than product-screenshot-driven.

## Layout

Full-bleed dark canvas with content max-width ~1280px centered. The hero pattern is a split composition: left half holds the headline block + CTA, right half holds a large editorial photograph. Navigation is a minimal top bar (transparent on Obsidian) with logo left, nav center, account links right — no sticky behavior apparent, no mega-menu. Below the hero, sections alternate as full-width bands on Obsidian with generous 64-80px vertical gaps. Content blocks within sections are typically 2-column (text + image) or 3-column card grids. No sidebar. No centered stacked layouts — everything is left-aligned. The rhythm is spacious and editorial, with breathing room between sections rather than compact information density.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- border: #f5f5f5
- accent: #e2572c
- muted text: #808080
- card surface: #1a1a1a
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a content card on dark canvas: #1a1a1a Graphite background, 1px hairline #f5f5f5 Fog border, 16px border-radius, 32px padding. Heading at 24px Suisse 400 in #ffffff. Body at 16px in #808080. No shadow.

3. Create a navigation header: transparent background on #000000 canvas. Logo mark in #ffffff left. Nav items at 13px Suisse 400 in #ffffff, spaced with 24px gap. 'Demo' link at far right in #e2572c Ember as the active accent. No border, no shadow.

4. Create a pill tag: 9999px border-radius, 1px #808080 border, transparent fill, #808080 text at 12px Suisse 400, 4px 12px padding.

5. Create a footer: #000000 background, 3-4 columns of ghost text links at 13px in #808080, brand logo in #ffffff. 48px vertical padding.

## Similar Brands

- **Ramp** — Same dark-mode editorial approach with a single warm accent color and full-bleed photography in heroes
- **Plaid** — Minimal dark canvas, single chromatic accent, oversized display headlines, left-aligned editorial layout
- **Mercury** — Dark-mode fintech with restrained palette, large-format photography, and geometric grotesque typography
- **Linear** — Single-weight geometric sans-serif, tight display tracking, near-monochrome dark UI with one accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember: #e2572c;
  --color-obsidian: #000000;
  --color-graphite: #1a1a1a;
  --color-steel: #808080;
  --color-fog: #f5f5f5;
  --color-snow: #ffffff;

  /* Typography — Font Families */
  --font-suisse: 'Suisse', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.06px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-display: 80px;
  --leading-display: 0.7;
  --tracking-display: -0.56px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64-80px;
  --card-padding: 24-48px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-images: 16px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-card: #1a1a1a;
  --surface-light-surface: #f5f5f5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember: #e2572c;
  --color-obsidian: #000000;
  --color-graphite: #1a1a1a;
  --color-steel: #808080;
  --color-fog: #f5f5f5;
  --color-snow: #ffffff;

  /* Typography */
  --font-suisse: 'Suisse', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.06px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-display: 80px;
  --leading-display: 0.7;
  --tracking-display: -0.56px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```
