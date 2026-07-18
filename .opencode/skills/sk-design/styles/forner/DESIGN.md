# Forner — Style Reference
> Warm earthen atelier — imagine a ceramics studio at golden hour, where every surface is clay, bone, or roasted coffee, and the only chrome is the potter's hand-lettered note pinned to the wall.

**Theme:** light

Forner operates as a sun-baked design atelier: an almost entirely warm-earth palette, a single custom grotesque carrying 95% of the voice, and typography so oversized it abandons hierarchy for atmosphere. The canvas is a dry cream; the ink is a deep roast brown; every accent lives in the same brown-to-bone spectrum. There is no chromatic brand color — the warmth itself is the brand. Surfaces are flat with hairline borders, corners are surgically sharp at 4px, and breathing room is generous (100px+ between sections). Custom serif italics appear sparingly as hand-set annotations against the grotesque's mechanical rhythm.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Roast Ink | `#484036` | `--color-roast-ink` | Primary text, borders, icon strokes, the structural backbone of every interface — deep warm brown acts as ink on cream, the dominant foreground color across the entire system |
| Bone Canvas | `#faf5eb` | `--color-bone-canvas` | Page background, the warm cream field that all surfaces sit on |
| Linen Surface | `#ecece4` | `--color-linen-surface` | Card surfaces, elevated panels, content blocks — one step removed from the canvas, slightly cooler and grayer to recede |
| Sandstone | `#cacab0` | `--color-sandstone` | Heading accents, icon strokes, decorative borders, link underlines — the lightest chromatic-feeling neutral, used when the Roast Ink feels too heavy |
| Pebble | `#d5d5c4` | `--color-pebble` | Link text, secondary interactive states — warmer than the cool grays, keeps the link family inside the earth palette |
| Manilla Cream | `#f2e9cf` | `--color-manilla-cream` | Warm highlight wash, soft fill for tags and subtle emphasis blocks |
| Slate Border | `#666e72` | `--color-slate-border` | Cool-toned hairline borders, dividers, structural lines — the only break from the warm palette, providing neutral structural contrast |
| Charcoal Depth | `#33302c` | `--color-charcoal-depth` | Deep heading text, near-black emphasis — warmer than pure black, reserved for the heaviest type moments |
| Obsidian | `#212529` | `--color-obsidian` | Maximum-contrast borders and text — the darkest available, used sparingly for absolute emphasis |

## Tokens — Typography

### Surt — Primary workhorse — used for body, navigation, buttons, hero, headings, and everything in between. This single font carries 606 instances across every context, making it the voice of the entire system. The tight line-heights (0.98-1.10) on large sizes are signature: display text sits so close the lines nearly touch, creating a compressed, editorial rhythm. Only weight 400 exists — there is no bold, no light. Restraint through range size, not weight. · `--font-surt`
- **Substitute:** Söhne, Inter, Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 22px, 29px, 45px, 56px, 112px
- **Line height:** 0.98-1.10 for display, 1.35-1.50 for body
- **Letter spacing:** -0.0400em at body, 0.0110em at small sizes, -0.0500em at display
- **Role:** Primary workhorse — used for body, navigation, buttons, hero, headings, and everything in between. This single font carries 606 instances across every context, making it the voice of the entire system. The tight line-heights (0.98-1.10) on large sizes are signature: display text sits so close the lines nearly touch, creating a compressed, editorial rhythm. Only weight 400 exists — there is no bold, no light. Restraint through range size, not weight.

### ClashDisplay — Secondary display face — used for structural headings and labels where a slightly more architectural feel is needed. The ultra-tight 0.97 line-height on the 56px size is aggressive even by display standards; lines stack like a modernist poster. Pairs with Surt as the 'engineered' voice against Surt's 'neutral' voice. · `--font-clashdisplay`
- **Substitute:** Clash Display (Fontshare), Söhne Schmal, Founders Grotesk Condensed
- **Weights:** 400
- **Sizes:** 17px, 30px, 52px, 56px
- **Line height:** 0.97-1.13
- **Letter spacing:** -0.0100em at body, 0.0200em at display
- **Role:** Secondary display face — used for structural headings and labels where a slightly more architectural feel is needed. The ultra-tight 0.97 line-height on the 56px size is aggressive even by display standards; lines stack like a modernist poster. Pairs with Surt as the 'engineered' voice against Surt's 'neutral' voice.

### BigDailyShort — Accent serif italic — appears only 5 times across the system, functioning as a hand-annotated note against the grotesque. Used for pull quotes, editorial labels, or signature moments where the system needs to feel signed rather than printed. Its scarcity is the point: when it appears, it carries weight through presence, not size. · `--font-bigdailyshort`
- **Substitute:** GT Sectra, Canela, Domaine Display Italic
- **Weights:** 400 (Light Italic)
- **Sizes:** 17px, 37px, 45px
- **Line height:** 0.98-1.03
- **Letter spacing:** -0.0500em, 0.0110em, 0.0200em
- **Role:** Accent serif italic — appears only 5 times across the system, functioning as a hand-annotated note against the grotesque. Used for pull quotes, editorial labels, or signature moments where the system needs to feel signed rather than printed. Its scarcity is the point: when it appears, it carries weight through presence, not size.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 17px | 1.13 | 0.34px | `--text-caption` |
| body | 22px | 1.35 | 0.24px | `--text-body` |
| subheading | 29px | 1.1 | -0.29px | `--text-subheading` |
| heading | 45px | 1.03 | -0.45px | `--text-heading` |
| heading-lg | 56px | 0.98 | -2.24px | `--text-heading-lg` |
| display | 112px | 0.98 | -5.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 14 | 14px | `--spacing-14` |
| 29 | 29px | `--spacing-29` |
| 43 | 43px | `--spacing-43` |
| 58 | 58px | `--spacing-58` |
| 68 | 68px | `--spacing-68` |
| 86 | 86px | `--spacing-86` |
| 100 | 100px | `--spacing-100` |
| 121 | 121px | `--spacing-121` |
| 144 | 144px | `--spacing-144` |
| 161 | 161px | `--spacing-161` |
| 232 | 232px | `--spacing-232` |
| 233 | 233px | `--spacing-233` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 4px |
| images | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 100px
- **Card padding:** 29px
- **Element gap:** 14px

## Components

### Display Hero Headline
**Role:** Hero and section-anchoring text

Surt at 112px, weight 400, line-height 0.98, letter-spacing -5.6px. Color #484036 on #faf5eb canvas. The tight tracking and compressed line-height make lines nearly touch — creates a poster-like presence, not a comfortable reading experience. This is atmosphere, not information.

### Section Heading
**Role:** Mid-page structural headings

Surt at 45-56px, weight 400, line-height 1.03-0.98, letter-spacing -1.8 to -2.24px. Color #484036. Same anti-convention as display: light weight at large sizes, heavy negative tracking. Headlines whisper at the scale where most sites shout.

### Body Paragraph
**Role:** All paragraph text

Surt at 22px, weight 400, line-height 1.35, letter-spacing 0.24px. Color #484036. The slight positive tracking on body is unusual — most grotesques tighten at body size, Surt opens up. Creates an airier, more editorial reading rhythm.

### Outlined Action Button
**Role:** Primary interactive trigger

Surt at 17px, weight 400, text #484036. 1px border in #484036, 4px radius, 14px vertical padding, 29px horizontal padding. No fill — outlined only. The neutral dark border means there is no chromatic CTA; urgency comes from the border weight and generous spacing, not color. Hover state could fill to #484036 with bone text.

### Ghost Link
**Role:** Inline navigation, footer links, tertiary actions

Surt at 17-22px, weight 400, color #d5d5c4 with #cacab0 underline (1px). No background, no border. Underline is always present — the link communicates through the persistent rule, not color contrast.

### Content Card
**Role:** Project tiles, case study blocks, content containers

Background #ecece4 (one step cooler than canvas). 4px radius. 29px internal padding. 1px border in #666e72 (slate) for structural definition. No shadow — the slight tonal shift from canvas to card is the only elevation signal. This is a flat, paper-on-paper system, not a floating-card system.

### Product Showcase Panel
**Role:** Full-bleed portfolio imagery

Images treated at full scale with no frame or container — they bleed into the #faf5eb canvas. 4px radius only when constrained within a card. The screenshot shows a product photograph floating on the warm cream field, the photograph's own color (terracotta) doing the work against the muted system.

### Editorial Annotation
**Role:** Pull quotes, signed notes, accent labels

BigDailyShort Light Italic at 17-45px, line-height 0.98-1.03, color #484036. Used 5 times across the system — this scarcity is the design choice. When it appears, it reads as a curator's handwritten label pinned to a gallery wall. Never use for body or navigation.

### Navigation Bar
**Role:** Top-level site navigation

Surt at 22px, weight 400, transparent on #faf5eb canvas. Horizontal links separated by 29-68px gaps. No background fill, no border, no shadow. The nav is text floating on the canvas — it does not announce itself as a UI element.

### Section Divider
**Role:** Between content sections

Not a visible line — sections are separated by 86-144px of negative space alone. When a line is needed, 1px in #666e72 at 100% width. The system prefers breathing room over rules.

### Tag or Category Label
**Role:** Project categories, metadata chips

Surt at 17px, weight 400, text #484036. Optional 1px border in #cacab0, 4px radius, 14px vertical / 29px horizontal padding. Manilla Cream (#f2e9cf) fill available for emphasis variants. Tags are small, quiet, outlined — never filled with brand color.

### Image Caption
**Role:** Below project imagery

Surt at 17px, weight 400, line-height 1.13, letter-spacing 0.34px, color #666e72. Sits 14px below the image. The cooler gray and positive tracking separate it from the body voice — captions are metadata, not content.

## Do's and Don'ts

### Do
- Use Surt at weight 400 for all text — there is no bold, no light, no medium. Size and tracking create hierarchy, not weight.
- Set line-height at 0.98-1.10 for all display sizes 45px and above — the compressed stacking is the signature.
- Use #faf5eb for page canvas and #ecece4 for card surfaces — the two-step warm-to-cooler shift is the only elevation signal needed.
- Maintain 100px+ vertical rhythm between sections; let negative space separate content rather than drawing rules.
- Set all border-radius to 4px — the system is surgically sharp, not soft.
- Reach for the BigDailyShort italic only 1-3 times per page — its scarcity is what gives it authority as a signed annotation.
- Keep all interactive elements outlined or ghosted with #484036 borders; never introduce a chromatic action color.

### Don't
- Do not use bold or semibold weights — the system has one voice (regular 400) at every size.
- Do not add drop shadows or box-shadows — elevation comes from tonal surface shifts, not blurred offsets.
- Do not use pure white (#ffffff) or pure black (#000000) — the entire palette lives in the warm brown-to-bone spectrum.
- Do not introduce accent colors (no blue, red, green, or any chromatic brand color) — 5% colorfulness is the system.
- Do not use border-radius above 4px — no pills, no large rounding, no 'friendly' curves.
- Do not set display line-height above 1.10 — generous spacing kills the compressed editorial rhythm.
- Do not use the BigDailyShort italic for navigation, body, or buttons — it is annotation-only and loses all meaning if overused.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#faf5eb` | Page background — the warm cream field that all content sits on |
| 1 | Linen Surface | `#ecece4` | Card and content panel background — one tonal step cooler and grayer than the canvas to recede without shadow |
| 2 | Manilla Highlight | `#f2e9cf` | Soft emphasis fill for tags, highlights, and accent blocks |

## Elevation

The system intentionally avoids shadows entirely. Elevation is communicated exclusively through tonal surface shifts — the canvas (#faf5eb) is the base, cards step cooler to Linen (#ecece4), and emphasis blocks add warmth to Manilla (#f2e9cf). Combined with 1px hairline borders in #666e72 or #484036, this creates a paper-on-paper layering system rather than a floating-card system. Shadows would introduce visual noise the earth palette cannot absorb.

## Imagery

Imagery is portfolio-driven and high-fidelity: full-bleed product photography, brand mockups, and editorial compositions sit directly on the warm cream canvas without frames or containers. The screenshot shows a terracotta product package (Doma microdose blend) as a hero element — the photograph's own vibrant color does the work, unframed. There are no decorative illustrations, no stock photography, no abstract graphics. When product or brand work appears, it is treated as a real artifact: tight crops, sharp 4px corners only when constrained, otherwise bleeding to the canvas edge. Icon style (visible in UI): thin 1px line icons in #484036 or #cacab0, stroke-led, monoline, no filled states. Imagery is image-heavy at the portfolio level and icon-minimal at the UI level.

## Layout

Layout is max-width contained (1440px) with generous outer padding (29-68px horizontal). The page reads as a vertical sequence of full-width sections separated by 100px+ of breathing room — there is no sidebar, no grid-of-grids complexity. Hero is a centered display headline at 112px over the cream canvas, often paired with a single full-bleed product or brand image below. Section rhythm is consistent: display heading → supporting body at 22px → visual artifact → next section. Content is arranged in single-column stacks for hero moments, expanding to 2-column text+image pairs for case studies. There is no masonry, no card grid of 3+, no pricing table. Navigation is a minimal top bar with horizontal links. The overall density is spacious and editorial — the system treats the page like a printed portfolio spread, not a dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- text: #484036
- background: #faf5eb
- card surface: #ecece4
- border: #666e72
- accent: #cacab0
- primary action: no distinct CTA color

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a content card: background #ecece4, 4px radius, 29px padding all sides, 1px border in #666e72. Heading at 45px Surt weight 400, #484036, letter-spacing -1.8px. Body at 22px Surt weight 400, #484036, line-height 1.35. No shadow.

3. Create a navigation bar: transparent on #faf5eb canvas. Logo wordmark at 22px Surt weight 400, #484036. Links at 22px Surt weight 400, #d5d5c4 with #cacab0 1px underline, 29px gap between items. No background, no border, no shadow.

## Typographic Philosophy

The system deliberately eliminates weight variation. With only weight 400 available, hierarchy is built entirely through size, tracking, and line-height. Display sizes (56-112px) use aggressive negative tracking (-0.0400em to -0.0500em) and compressed line-heights (0.97-0.98) — text stacks like a modernist poster. Body sizes (22-29px) open up with positive tracking (0.0110em) and generous line-height (1.35-1.50) — reading becomes airy and editorial. The single weight forces every typographic decision to be about proportion, not emphasis. This is an anti-bold system: the absence of heaviness is the point.

## Earth Palette Logic

Every color in the system belongs to the brown-to-bone spectrum. There is no blue, no green, no chromatic accent, no semantic color coding in the traditional sense (no red for error, no green for success). The warmth is uniform — even the 'cool' slate (#666e72) is used structurally for borders, never for emphasis. This means success/error/warning states, if needed, must be communicated through tone (lighter/warmer Roast Ink) or through the BigDailyShort italic annotation rather than through chromatic signals. The palette's discipline is its brand: 5% colorfulness means the 95% of warm neutral is doing all the visual work.

## Similar Brands

- **Aether** — Same warm-earth neutral palette with a single custom grotesque carrying the entire voice, plus the same editorial large-display-headline approach
- **Resn** — Similar minimal aesthetic with hairline borders, flat surfaces, and the same paper-on-paper layering without shadows
- **Locomotive (MTL)** — Same spacious editorial layout rhythm, oversized display type, and refusal to use chromatic brand color — the warmth of the neutrals does the work
- **Studio Dumbar** — Same single-weight typography discipline and earth-toned palette, with a signature reliance on a small set of custom typefaces doing all the typographic work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-roast-ink: #484036;
  --color-bone-canvas: #faf5eb;
  --color-linen-surface: #ecece4;
  --color-sandstone: #cacab0;
  --color-pebble: #d5d5c4;
  --color-manilla-cream: #f2e9cf;
  --color-slate-border: #666e72;
  --color-charcoal-depth: #33302c;
  --color-obsidian: #212529;

  /* Typography — Font Families */
  --font-surt: 'Surt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clashdisplay: 'ClashDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bigdailyshort: 'BigDailyShort', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 17px;
  --leading-caption: 1.13;
  --tracking-caption: 0.34px;
  --text-body: 22px;
  --leading-body: 1.35;
  --tracking-body: 0.24px;
  --text-subheading: 29px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.29px;
  --text-heading: 45px;
  --leading-heading: 1.03;
  --tracking-heading: -0.45px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 0.98;
  --tracking-heading-lg: -2.24px;
  --text-display: 112px;
  --leading-display: 0.98;
  --tracking-display: -5.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-14: 14px;
  --spacing-29: 29px;
  --spacing-43: 43px;
  --spacing-58: 58px;
  --spacing-68: 68px;
  --spacing-86: 86px;
  --spacing-100: 100px;
  --spacing-121: 121px;
  --spacing-144: 144px;
  --spacing-161: 161px;
  --spacing-232: 232px;
  --spacing-233: 233px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 100px;
  --card-padding: 29px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 4px;
  --radius-images: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-bone-canvas: #faf5eb;
  --surface-linen-surface: #ecece4;
  --surface-manilla-highlight: #f2e9cf;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-roast-ink: #484036;
  --color-bone-canvas: #faf5eb;
  --color-linen-surface: #ecece4;
  --color-sandstone: #cacab0;
  --color-pebble: #d5d5c4;
  --color-manilla-cream: #f2e9cf;
  --color-slate-border: #666e72;
  --color-charcoal-depth: #33302c;
  --color-obsidian: #212529;

  /* Typography */
  --font-surt: 'Surt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clashdisplay: 'ClashDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bigdailyshort: 'BigDailyShort', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 17px;
  --leading-caption: 1.13;
  --tracking-caption: 0.34px;
  --text-body: 22px;
  --leading-body: 1.35;
  --tracking-body: 0.24px;
  --text-subheading: 29px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.29px;
  --text-heading: 45px;
  --leading-heading: 1.03;
  --tracking-heading: -0.45px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 0.98;
  --tracking-heading-lg: -2.24px;
  --text-display: 112px;
  --leading-display: 0.98;
  --tracking-display: -5.6px;

  /* Spacing */
  --spacing-14: 14px;
  --spacing-29: 29px;
  --spacing-43: 43px;
  --spacing-58: 58px;
  --spacing-68: 68px;
  --spacing-86: 86px;
  --spacing-100: 100px;
  --spacing-121: 121px;
  --spacing-144: 144px;
  --spacing-161: 161px;
  --spacing-232: 232px;
  --spacing-233: 233px;

  /* Border Radius */
  --radius-md: 4px;
}
```
