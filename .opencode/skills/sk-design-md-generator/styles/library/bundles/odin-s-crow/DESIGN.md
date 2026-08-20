# Odin's Crow — Style Reference
> Swiss broadsheet on warm bone — a single typographic grid held together by hairline rules, where one massive headline bleeds past the fold while a 10px wordmark anchors the corner.

**Theme:** light

Odin's Crow operates as a typographic broadsheet — a Swiss editorial design language where type, rules, and negative space do all the work. The palette is almost entirely warm bone-and-ink: a single near-black text color sits on warm parchment surfaces, separated not by cards or shadows but by full-bleed horizontal rules in stone gray. Scale is weaponized: a 10px wordmark in the top corner exists in the same composition as 190px display headlines that deliberately bleed off the right edge. Section organization uses a numbered system (1.1, 1.2…) paired with short labels, mimicking manuscript chapters. There are no buttons, no gradients, no shadows, no imagery — the design system is purely typographic and structural, trusting the geometry of the page to carry the entire visual identity.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#dbd7d3` | `--color-bone` | Primary page canvas — warm off-white that carries the entire reading surface; everything else floats on or beside it |
| Ash | `#e5e7eb` | `--color-ash` | Structural divider lines and hairline borders — the single most-used color in the system at 2300+ occurrences, used exclusively to draw the rules that separate sections |
| Inkstone | `#2b2b2b` | `--color-inkstone` | Primary text and graphic fill — near-black with no pure-black harshness, used for all type at every size and for icon/illustration fills |
| Graphite | `#535251` | `--color-graphite` | Secondary text and muted borders — for sub-labels, metadata, and the dimmer secondary rule lines |
| Sand | `#e5d5c3` | `--color-sand` | Warm section surface — slightly more saturated beige used to differentiate bands or sidebar zones from the main bone canvas |
| Linen | `#cdc0b1` | `--color-linen` | Deepest warm surface — tan accent band, used sparingly as a third surface level for footer blocks or inverted sections |
| Frost | `#c9c8c9` | `--color-frost` | Muted UI surface for disabled controls, low-emphasis panels, and placeholder blocks. |
| Sage Stone | `#82887c` | `--color-sage-stone` | Subtle warm-gray accent — the only chromatically-tinged neutral, reserved for occasional emphasis on a word or number |

## Tokens — Typography

### Plain — The sole typeface — a geometric grotesque carrying every role from 10px wordmark to 190px bleeding display. Two weights only: 400 for body and 700 for display/emphasis. The brand's voice is this single family; never pair it with a secondary face. · `--font-plain`
- **Substitute:** Inter, Helvetica Neue, Söhne, or Neue Haas Grotesk
- **Weights:** 400, 700
- **Sizes:** 10, 16, 20, 27, 34, 36, 42, 60, 187, 190
- **Line height:** 1.00–2.00 (extreme: 1.00 for display, 1.50 for body, 2.00 for label sets)
- **Letter spacing:** Tightens aggressively with scale: -0.025em at 20–27px, -0.040em at 36–42px, -0.047em at 60px, -0.050em at 187–190px. The display sizes are pulled so tight that letters nearly collide, creating the signature condensed, dense headline mass.
- **Role:** The sole typeface — a geometric grotesque carrying every role from 10px wordmark to 190px bleeding display. Two weights only: 400 for body and 700 for display/emphasis. The brand's voice is this single family; never pair it with a secondary face.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 2 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 20px | 1.5 | -0.5px | `--text-body-lg` |
| subheading | 27px | 1.4 | -0.675px | `--text-subheading` |
| heading-sm | 34px | 1.25 | -1.36px | `--text-heading-sm` |
| heading | 36px | 1.25 | -1.44px | `--text-heading` |
| heading-lg | 42px | 1.11 | -1.68px | `--text-heading-lg` |
| display | 60px | 1.08 | -2.82px | `--text-display` |
| display-mega | 190px | 1 | -9.5px | `--text-display-mega` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 160 | 160px | `--spacing-160` |
| 176 | 176px | `--spacing-176` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Corner Wordmark
**Role:** Persistent brand label in the top-left corner of every screen

10px Plain weight 700, #2b2b2b, sitting at the top-left with 20px padding. No logo mark, no symbol — pure type. Functions as a home button and brand anchor.

### Mega Display Headline
**Role:** The hero/display headline — deliberately bleeds past the right viewport edge

Plain 700, 187–190px, line-height 1.00, letter-spacing -9.5px (-0.05em), color #2b2b2b. Set flush-left at the page margin with no container constraining it; the text is permitted to overflow horizontally. This is the signature element.

### Section Header Row
**Role:** Section label + numbered index, e.g. "What we do" + "1.1"

Two-part line: left side is Plain 700 at 34–36px in #2b2b2b (the section name), right side is the section number in matching size and weight, right-aligned to the page margin. Below it runs a single 1px #e5e7eb rule spanning the full viewport width. 80px vertical breathing room above and below the line.

### Full-Width Hairline Rule
**Role:** The primary structural divider — the design system's most-used element

1px solid #e5e7eb, stretched edge-to-edge with no margin. Used to separate every section, sub-section, and content block. Stacks of 2–4 parallel rules create the visual equivalent of card borders without any enclosed surface.

### Footer Credit Bar
**Role:** Small metadata strip at the bottom of sections

Plain 400 at 10–12px, #2b2b2b, with 20px horizontal padding. Left text (brand name) and right text (copyright/year) aligned to opposite edges. Sits directly on the bone canvas — no background fill, no border, separated from content above by a single hairline rule.

### Body Text Block
**Role:** Running paragraphs and long-form content

Plain 400, 16–20px, line-height 1.5, color #2b2b2b. No max-width constraint — text runs the full page width. Paragraph spacing is 20–40px (the 5x–10x base-unit rhythm). Letter-spacing defaults to 0.

### Text Link
**Role:** Inline links and navigation references within body copy

Plain 400, same size as surrounding text, color #2b2b2b with a 1px #2b2b2b underline offset 2px from baseline. No color change on hover — weight shifts to 700.

### Section Number Index
**Role:** Right-aligned numeric counter that labels each section (1.1, 1.2, 2.1…)

Plain 700, matches the section header size, #2b2b2b, right-aligned to the page margin. Functions as both navigation hint and editorial-style chapter numbering.

### Ghost Text Button
**Role:** Sparingly used CTA — invisible until it is the only thing on the line

Plain 400, 16px, #2b2b2b, with a 1px #2b2b2b bottom border acting as the button chrome. 5px vertical padding, no horizontal padding. Hover: weight shifts to 700. Never filled, never rounded — the system has no color tokens for a filled button.

### Form Input
**Role:** Borderless or single-line-bordered text input for contact/data entry

Plain 400, 16px, #2b2b2b text on bone canvas. 1px #e5e7eb bottom border only (no left/right/top), 1px top padding, 22px bottom padding. Placeholder text in #535251 at the same size. No focus ring — border darkens to #2b2b2b on focus.

### Label Tag
**Role:** Small inline metadata labels (category, date, index)

Plain 700, 10–12px, #2b2b2b, uppercase tracking at the natural 0 letter-spacing. Sits inline with text or as a standalone line above a content block. No background, no border — type only.

## Do's and Don'ts

### Do
- Use the full size range of Plain: let 10px wordmarks exist in the same composition as 190px headlines. The scale contrast is the design.
- Set display headlines flush-left at the page margin and let them overflow the viewport horizontally — never constrain them to a container width.
- Use 1px #e5e7eb full-bleed hairline rules as the sole structural divider. Stack 2–4 rules in parallel to imply a card boundary without enclosing a surface.
- Pair every section header with a right-aligned section number in matching size, separated below by one full-width rule and surrounded by 80px vertical space.
- Use only #2b2b2b for all text at all sizes. Reserve #535251 exclusively for sub-labels and metadata that should feel secondary.
- Tighten letter-spacing aggressively at large sizes: -0.025em at 20–27px, stepping to -0.050em at the mega display sizes. The dense, near-colliding letterforms are the signature.
- Let the bone canvas (#dbd7d3) carry the entire page. Do not introduce card backgrounds — the system has no surface elevation, only the bone and its warm/cool variants.

### Don't
- Do not introduce any chromatic color, gradient, or filled CTA. The system has no accent and no button-fill token — the only color contrast is ink on bone.
- Do not apply border-radius to anything. All corners are sharp 0px — cards, buttons, inputs, badges.
- Do not add box-shadows or drop-shadows. The system has no elevation tokens. Depth is communicated only through hairline rules and surface-tone shifts.
- Do not pair Plain with a second typeface. The single-family constraint is non-negotiable.
- Do not use a sans-serif lighter than 400 or heavier than 700. Plain has only two weights; using anything else breaks the system.
- Do not center-align body text or headlines. Everything is flush-left (or right-aligned for section numbers only).
- Do not introduce imagery, photography, illustration, or iconography with visual weight. Icons, if used, are flat #2b2b2b glyphs at the smallest text sizes — nothing decorative.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#dbd7d3` | Primary page background — the warm off-white everything reads against |
| 2 | Sand Section | `#e5d5c3` | Warm secondary band for differentiated content sections |
| 3 | Linen Accent | `#cdc0b1` | Deeper warm zone for footer or inverted blocks |
| 4 | Frost Cool Band | `#c9c8c9` | Cool gray break from the warm palette — used as a deliberate cold note |

## Elevation

The system has no shadows. Depth is constructed entirely through (a) 1px #e5e7eb hairline rules that separate sections, and (b) subtle shifts between the four warm/cool surface tones (#dbd7d3 → #e5d5c3 → #cdc0b1 → #c9c8c9). Never introduce a drop shadow, inner shadow, or glow — it would break the editorial broadsheet language.

## Imagery

The site carries no photography, no illustration, no product imagery, and no decorative graphics. Visual content is exclusively typographic: oversized type, the wordmark, section numbers, and footer labels. If a glyph or icon is needed, it is a flat #2b2b2b geometric shape sized to match the 10–16px text scale — never larger, never decorative, never colored.

## Layout

Full-bleed edge-to-edge layout with no max-width container and no centered column. The page is structured as a vertical sequence of horizontal bands, each separated by 1px #e5e7eb rules that span the entire viewport. The top-left corner holds a 10px wordmark at 20px padding; the top-right is left empty. Each section opens with a label+number header row (label left, number right) sitting on a single rule. Content within a section runs full-width with 20px horizontal padding from the viewport edge — body text is not constrained to a reading column. Hero headlines deliberately extend past the right edge of the viewport. Section rhythm is generous: 80px vertical space above and below each header line, with stacked rules marking transitions. Navigation is implicit through the numbered section index, not through a menu or sidebar. The overall feel is a single broadsheet column where the horizontal rules are the page furniture.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2b2b2b
- background: #dbd7d3
- border / hairline rule: #e5e7eb
- secondary text: #535251
- warm surface variant: #e5d5c3
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Create a section header row**: 80px top margin. Left side: "What we do" in Plain 700, 36px, #2b2b2b, letter-spacing -1.44px. Right side: "1.1" in matching size and weight, right-aligned to the viewport edge with 20px right padding. Below: a 1px solid #e5e7eb rule spanning the full viewport width. 80px bottom margin.

2. **Create a mega display headline**: Plain 700, 190px, line-height 1.0, color #2b2b2b, letter-spacing -9.5px. Set flush-left at the page edge with 20px left padding. The text must be allowed to overflow horizontally past the right viewport edge — do not wrap or constrain it to a container. 60px bottom margin.

3. **Create a full-width stacked rule divider**: 4 parallel 1px #e5e7eb rules, each separated by 8px of vertical space, spanning the full viewport width. 40px margin above and below the stack. Functions as a card boundary without a filled surface.

4. **Create a footer credit bar**: 1px solid #e5e7eb rule above. Inside: Plain 400, 10px, line-height 2.0, color #2b2b2b. Left-aligned: brand name. Right-aligned: copyright + year. 20px horizontal padding from viewport edges. No background fill.

5. **Create a body text block**: Plain 400, 16px, line-height 1.5, color #2b2b2b. Full viewport width with 20px left/right padding. Paragraph spacing 20px. Inline links: 1px #2b2b2b underline offset 2px from baseline, weight shifts to 700 on hover — no color change.

## Similar Brands

- **Hershey-Felix studio site** — Same single-family grotesque typography and aggressive display-size bleed; identical broadsheet-with-rules structural language
- **Pentagram partner pages** — Swiss editorial grid, section-numbering pattern, and the typographic-only visual identity with zero decoration
- **Lars Müller Publishers** — Warm bone canvas, oversized type, and the manuscript/broadsheet rhythm with chapter numbers
- **Off-Black (studio site)** — Near-monochrome palette where #2b2b2b ink on warm off-white is the entire visual system
- **Manuel Bürger portfolio** — Hairline rules as the sole structural device and display headlines that overflow the viewport edge

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #dbd7d3;
  --color-ash: #e5e7eb;
  --color-inkstone: #2b2b2b;
  --color-graphite: #535251;
  --color-sand: #e5d5c3;
  --color-linen: #cdc0b1;
  --color-frost: #c9c8c9;
  --color-sage-stone: #82887c;

  /* Typography — Font Families */
  --font-plain: 'Plain', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.5px;
  --text-subheading: 27px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.675px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -1.36px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -1.44px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.68px;
  --text-display: 60px;
  --leading-display: 1.08;
  --tracking-display: -2.82px;
  --text-display-mega: 190px;
  --leading-display-mega: 1;
  --tracking-display-mega: -9.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #dbd7d3;
  --surface-sand-section: #e5d5c3;
  --surface-linen-accent: #cdc0b1;
  --surface-frost-cool-band: #c9c8c9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #dbd7d3;
  --color-ash: #e5e7eb;
  --color-inkstone: #2b2b2b;
  --color-graphite: #535251;
  --color-sand: #e5d5c3;
  --color-linen: #cdc0b1;
  --color-frost: #c9c8c9;
  --color-sage-stone: #82887c;

  /* Typography */
  --font-plain: 'Plain', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.5px;
  --text-subheading: 27px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.675px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -1.36px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -1.44px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.68px;
  --text-display: 60px;
  --leading-display: 1.08;
  --tracking-display: -2.82px;
  --text-display-mega: 190px;
  --leading-display-mega: 1;
  --tracking-display-mega: -9.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-160: 160px;
  --spacing-176: 176px;
}
```
