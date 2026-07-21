# June — Style Reference
> Midnight ink on cream paper.

**Theme:** light

June uses a soft editorial language: warm off-white canvas, generous spacing, and SF Pro Rounded giving every line of text a gentle, book-like friendliness. The signature is a deep midnight violet (#2a2a63) that carries headlines, body text, and border accents — never shouting, always present, like ink on cream paper. A single vivid periwinkle (#6868f7) is reserved for the rare accent surface, creating punctuation against the otherwise monochrome body. Components are flat and rounded (12–20px radii), elevated by hairline borders rather than drop shadows, giving the interface a notebook-page weight. Layouts breathe: centered single-column articles, comfortable line-height, and vertical rhythm that treats reading as the primary interaction.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Violet | `#2a2a63` | `--color-midnight-violet` | Headings, body text, link text, and border accents — the signature ink color |
| Deep Ink | `#151531` | `--color-deep-ink` | Primary text, icon strokes, link color, and high-emphasis surface elements |
| Periwinkle Accent | `#6868f7` | `--color-periwinkle-accent` | Rare vivid accent surface for highlighted cards or callout blocks — a single bright note against the monochrome body |
| Cream Canvas | `#fafafa` | `--color-cream-canvas` | Page background and elevated card surface — the warm white base layer |
| Lavender Mist | `#f0f0fe` | `--color-lavender-mist` | Soft tinted card surface for content blocks and feature containers |
| Mist Border | `#e9ecef` | `--color-mist-border` | Hairline borders, dividers, card edges, and structural separators |
| Graphite | `#343a40` | `--color-graphite` | Secondary text and muted surface details |
| Smoke | `#cfd0d1` | `--color-smoke` | Subtle shadow base and low-contrast surface tone |
| Fog | `#c3c4c6` | `--color-fog` | Tertiary shadow tint for layered elevation |

## Tokens — Typography

### SF Pro Rounded — Primary typeface — headings, body, links, UI chrome. The rounded terminals give text a soft, bookish warmth that defines the brand's voice. · `--font-sf-pro-rounded`
- **Substitute:** Nunito or Quicksand for web fallback
- **Weights:** 400, 700, 900
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 40px, 60px
- **Line height:** 1.00–1.56
- **Letter spacing:** -0.015em at display sizes, +0.025em at small sizes
- **OpenType features:** `"kern"`
- **Role:** Primary typeface — headings, body, links, UI chrome. The rounded terminals give text a soft, bookish warmth that defines the brand's voice.

### Inter — Secondary typeface — used sparingly for body text blocks · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400, 700
- **Sizes:** 16px
- **Line height:** 1.00, 1.50
- **Letter spacing:** normal
- **OpenType features:** `"kern"`
- **Role:** Secondary typeface — used sparingly for body text blocks

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.35px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.43 | -0.27px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.36px | `--text-heading-sm` |
| heading | 40px | 1.17 | -0.6px | `--text-heading` |
| display | 60px | 1 | -0.9px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 12px |
| cards | 12px |
| inputs | 12px |
| buttons | 12px |
| featuredCards | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(13, 19, 27, 0.1) 0px 2px 10px 0px, rgba(13, 19, 27, ...` | `--shadow-md` |
| subtle | `rgba(13, 19, 27, 0.05) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(13, 19, 27, 0.25) 0px 0px 1px 0px, rgba(13, 19, 27, ...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 720px
- **Section gap:** 64-80px
- **Card padding:** 48px
- **Element gap:** 24px

## Components

### Content Card
**Role:** Primary content container for articles and feature blocks

48px padding, 12px radius, background #f0f0fe, hairline border #e9ecef, subtle shadow using rgba(13,19,27,0.1) at 2px 10px. Text uses #2a2a63 at 16px/1.5 line-height.

### Featured Accent Card
**Role:** Rare highlight surface drawing the eye to a single callout

20px radius, background #6868f7 (periwinkle), white or #fafafa text. Used once per page maximum — the one vivid moment in an otherwise quiet layout.

### Navigation Link
**Role:** Top-bar nav items

SF Pro Rounded 16px weight 400 or 700, color #151531, no underline. Hover transitions to color #6868f7.

### Inline Link
**Role:** Body-text hyperlinks and dotted references

Color #151531 with a dotted underline in #2a2a63. 16px SF Pro Rounded weight 400. The dotted-underline treatment is a signature editorial detail.

### Hero Headline
**Role:** Page-top display title

SF Pro Rounded 60px weight 900, line-height 1.0, color #2a2a63, letter-spacing -0.9px. Centered or left-aligned. The heavy weight + rounded terminals creates a confident but friendly tone.

### Section Heading
**Role:** Sub-section titles within content

SF Pro Rounded 24px weight 700, color #2a2a63, line-height 1.25, letter-spacing -0.36px.

### Body Paragraph
**Role:** Long-form reading text

SF Pro Rounded 16px weight 400, line-height 1.5, color #2a2a63. Generous line-height prioritizes reading comfort over density.

### CTA Button
**Role:** Primary action button

Not strongly evidenced in raw data — no filled button background detected. If present: 12px radius, SF Pro Rounded 16px weight 700, padding 12px 24px, ghost/outlined style with #2a2a63 border or solid #2a2a63 fill with #fafafa text.

### List Item
**Role:** Bulleted content lists

8px gap between items, 16px SF Pro Rounded body text in #2a2a63. Disc or dash markers in #2a2a63.

### Signature Graphic
**Role:** Brand mark or small icon

Rounded geometric form in #2a2a63 on #fafafa. 8px internal margin. Matches the rounded-terminal typography.

### Form Input
**Role:** Text input or textarea

12px radius, 1px border #e9ecef, padding 12px 16px, SF Pro Rounded 16px, placeholder in #cfd0d1, focus ring in #6868f7 at 2px.

## Do's and Don'ts

### Do
- Use SF Pro Rounded as the only typeface for brand surfaces — it is the voice
- Set all headings in #2a2a63 Midnight Violet — never use black or #151531 for display text
- Use 12px radius on cards and buttons, 20px only for the rare featured accent card
- Maintain 1.5 line-height on all body text for editorial readability
- Use #e9ecef Mist Border for all structural separators — never darker than this for dividers
- Center long-form content at 720px max-width for optimal reading measure
- Use letter-spacing -0.015em on display sizes (40px+) to tighten the rounded forms

### Don't
- Do not use sharp 0px radii on any element — rounding is a core brand signal
- Do not introduce drop shadows heavier than rgba(13,19,27,0.1) — elevation stays whisper-soft
- Do not use #000000 or pure black for any text — use #151531 Deep Ink or #2a2a63 Midnight Violet
- Do not use Periwinkle #6868f7 on text or borders — reserve it for single accent surfaces only
- Do not add more than one accent-colored element per page
- Do not use system fonts like Arial or Helvetica — the rounded geometry defines the brand
- Do not compress line-height below 1.4 on body text — reading comfort is non-negotiable

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#fafafa` | Page background — the warm off-white base |
| 1 | Lavender Mist | `#f0f0fe` | Tinted card or feature-block surface |
| 2 | Periwinkle Highlight | `#6868f7` | Rare accent surface for callout or featured content |

## Elevation

- **Standard Card:** `rgba(13, 19, 27, 0.1) 0px 2px 10px 0px, rgba(13, 19, 27, 0.2) 0px 0px 2px 0px`
- **Inset Border Card:** `rgba(13, 19, 27, 0.05) 0px 0px 0px 1px inset`
- **Elevated Card:** `rgba(13, 19, 27, 0.25) 0px 0px 1px 0px, rgba(13, 19, 27, 0.05) 0px 2px 1px 0px`

## Imagery

The site is predominantly text-driven with minimal imagery. When visuals appear, they are flat illustrations or product UI crops in a rounded-geometry style matching the typography. No photography detected. Icons are simple geometric shapes in #2a2a63 on transparent backgrounds. The signature 'J' monogram in the nav is a rounded square with a stylized letterform. The overall visual language is editorial-first: the words and their rhythm do the work, with graphics as quiet punctuation.

## Layout

Max-width 720px centered content column for reading pages. Top navigation is a minimal bar with logo left, links right at 16px. Hero is a centered display headline at 60px over generous whitespace. Content cards use 48px padding and centered alignment. Section gaps are 64–80px to create breathing rhythm between content blocks. The overall page rhythm is single-column, top-to-bottom, with no sidebars or complex grid structures. Navigation is fixed-top, lightweight, and doesn't compete with content.

## Agent Prompt Guide

Quick Color Reference:
- Text: #2a2a63 (body) / #151531 (primary)
- Background: #fafafa (canvas) / #f0f0fe (card)
- Border: #e9ecef
- Accent surface: #6868f7
- primary action: no distinct CTA color

Example Component Prompts:
1. Create a hero section on #fafafa canvas. Display headline: 60px SF Pro Rounded weight 900, color #2a2a63, letter-spacing -0.9px, line-height 1.0. Centered alignment, 80px top/bottom margin.

2. Create a content card: 48px padding, 12px border-radius, background #f0f0fe, 1px solid #e9ecef border. Body text at 16px SF Pro Rounded weight 400, line-height 1.5, color #2a2a63. Max-width 720px, centered.

3. Create a navigation bar: fixed top, #fafafa background, 16px SF Pro Rounded links in #151531 at 400 weight. 32px horizontal padding. Logo (rounded-square mark) at left, links right-aligned with 32px gap.

4. Create an inline link: 16px SF Pro Rounded weight 400, color #151531, with a dotted underline in #2a2a63. Used within body paragraphs for references.

5. Create a featured accent card: 20px border-radius, background #6868f7, padding 48px, text in #fafafa at 16px SF Pro Rounded. Use sparingly — one per page maximum.

## Similar Brands

- **Notion** — Same soft rounded typography approach, generous whitespace, and minimal accent color usage on a warm off-white canvas
- **Linear** — Clean editorial layout with single-column reading flow and restrained color palette with one accent moment
- **Substack** — Long-form reading-first layout, centered narrow column, minimal chrome, warm-white background with deep text color
- **Figma Blog** — Similar blog/article presentation with rounded sans-serif type and generous vertical rhythm between content blocks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-violet: #2a2a63;
  --color-deep-ink: #151531;
  --color-periwinkle-accent: #6868f7;
  --color-cream-canvas: #fafafa;
  --color-lavender-mist: #f0f0fe;
  --color-mist-border: #e9ecef;
  --color-graphite: #343a40;
  --color-smoke: #cfd0d1;
  --color-fog: #c3c4c6;

  /* Typography — Font Families */
  --font-sf-pro-rounded: 'SF Pro Rounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.27px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.36px;
  --text-heading: 40px;
  --leading-heading: 1.17;
  --tracking-heading: -0.6px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.9px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 720px;
  --section-gap: 64-80px;
  --card-padding: 48px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 12px;
  --radius-cards: 12px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;
  --radius-featuredcards: 20px;

  /* Shadows */
  --shadow-md: rgba(13, 19, 27, 0.1) 0px 2px 10px 0px, rgba(13, 19, 27, 0.2) 0px 0px 2px 0px;
  --shadow-subtle: rgba(13, 19, 27, 0.05) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(13, 19, 27, 0.25) 0px 0px 1px 0px, rgba(13, 19, 27, 0.05) 0px 2px 1px 0px;

  /* Surfaces */
  --surface-cream-canvas: #fafafa;
  --surface-lavender-mist: #f0f0fe;
  --surface-periwinkle-highlight: #6868f7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-violet: #2a2a63;
  --color-deep-ink: #151531;
  --color-periwinkle-accent: #6868f7;
  --color-cream-canvas: #fafafa;
  --color-lavender-mist: #f0f0fe;
  --color-mist-border: #e9ecef;
  --color-graphite: #343a40;
  --color-smoke: #cfd0d1;
  --color-fog: #c3c4c6;

  /* Typography */
  --font-sf-pro-rounded: 'SF Pro Rounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.27px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.36px;
  --text-heading: 40px;
  --leading-heading: 1.17;
  --tracking-heading: -0.6px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -0.9px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 20px;

  /* Shadows */
  --shadow-md: rgba(13, 19, 27, 0.1) 0px 2px 10px 0px, rgba(13, 19, 27, 0.2) 0px 0px 2px 0px;
  --shadow-subtle: rgba(13, 19, 27, 0.05) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(13, 19, 27, 0.25) 0px 0px 1px 0px, rgba(13, 19, 27, 0.05) 0px 2px 1px 0px;
}
```
