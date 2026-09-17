# Datalands — Style Reference
> Black cathedral with a single neon heartbeat. The wordmark fills the nave; everything else is a whispered caption beneath it.

**Theme:** dark

Datalands is a monochrome-black studio portfolio built around a single act of typographic spectacle: an OZIK Black wordmark blown to 358px, reducing the entire brand to a shape you feel before you read. The interface is deliberately austere — pure black canvas, white text, Martian Mono for all UI chrome and labels, Basis Grotesque for body copy with aggressive negative tracking. Chromatic color appears only as punctuation: a vivid magenta #fc74dd for the primary action, a small ember-orange #ff4c33 dot ticking in the nav, and case study visuals that erupt with flat geometric color. Everything rounded — inputs, buttons, tags, and the 'LET'S TALK' CTA all use 96px+ radii, creating a soft, almost capsule-like quality that contrasts the brutalist display type. The grid breathes; sections sit 80px apart, cards carry 48px of internal padding, and the dark mode is treated as a content environment, not a surface to be layered.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Universal canvas, page background, default text, hairline borders, monogram fills. Pure black, no warm or cool bias — used at maximum density to let white type and color accents do all the work |
| Bone | `#ffffff` | `--color-bone` | Primary headings, body copy on dark, inverse button labels, inverted card surfaces for case studies |
| Charcoal | `#1d1a1a` | `--color-charcoal` | Elevated card and button-fill surfaces sitting one step above the black canvas. Slightly warm-tinted dark gray |
| Ink | `#111212` | `--color-ink` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. |
| Graphite | `#3d3d3d` | `--color-graphite` | Secondary button borders and button text — a mid-gray frame for outlined/ghost controls on dark |
| Mist | `#d9d9d9` | `--color-mist` | De-emphasized body text and subtle border work when pure white would overstate the hierarchy |
| Parchment | `#f3f3ef` | `--color-parchment` | Light input field background — a warm near-white that gives the rare form elements a paper-like quality against the black void |
| Neon Magenta | `#fc74dd` | `--color-neon-magenta` | Pink action color for filled buttons, selected navigation states, and focused conversion moments. |
| Ember Dot | `#ff4c33` | `--color-ember-dot` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Deep Violet | `#122d8b` | `--color-deep-violet` | Decorative illustration fill used in data-visualization case study artwork. Not an interface token — appears inside graphics |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### OZIK Black — Display wordmark only — the brand's signature act. 358px condensed ultra-black with distinctive cut-out apertures in the 'a' and 'd' forms. No substitute captures the same geometric density; treat as a logo asset, not a system font. · `--font-ozik-black`
- **Substitute:** Druk Wide Heavy, obviously
- **Weights:** 400
- **Sizes:** 358px
- **Line height:** 0.83
- **Letter spacing:** -0.01em
- **Role:** Display wordmark only — the brand's signature act. 358px condensed ultra-black with distinctive cut-out apertures in the 'a' and 'd' forms. No substitute captures the same geometric density; treat as a logo asset, not a system font.

### Basis Grotesque Pro — Primary body and heading family for all running text and subheadings. Aggressive negative tracking at large sizes (–0.04em at 80px) tightens the geometric forms; at body sizes tracking relaxes to near-normal. The wide size range (14–80px) and tight leading (1.00–1.10 for display) let it carry both paragraph text and large editorial headlines. · `--font-basis-grotesque-pro`
- **Substitute:** Inter, Söhne, or any geometric grotesque
- **Weights:** 400
- **Sizes:** 14px, 18px, 22px, 35px, 38px, 42px, 60px, 80px
- **Line height:** 1.00–1.45
- **Letter spacing:** -0.04em at 80px, scaling down to -0.002em at 14px
- **Role:** Primary body and heading family for all running text and subheadings. Aggressive negative tracking at large sizes (–0.04em at 80px) tightens the geometric forms; at body sizes tracking relaxes to near-normal. The wide size range (14–80px) and tight leading (1.00–1.10 for display) let it carry both paragraph text and large editorial headlines.

### Martian Mono — UI chrome — nav labels, button text, tags, case study categories, time stamps, and the 'CASE STUDIES' / 'MICROSOFT' / 'NIKE' labels. The tracked-out positive spacing (0.05–0.10em) on small sizes creates a typewriter/terminal feel that codes the meta-information as system, not content. All caps throughout. · `--font-martian-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 200, 400, 600
- **Sizes:** 13px, 16px
- **Line height:** 1.00–1.45
- **Letter spacing:** 0.02em at 15px, 0.05em at 16px, 0.10em at 16px, -0.05em at 16px
- **Role:** UI chrome — nav labels, button text, tags, case study categories, time stamps, and the 'CASE STUDIES' / 'MICROSOFT' / 'NIKE' labels. The tracked-out positive spacing (0.05–0.10em) on small sizes creates a typewriter/terminal feel that codes the meta-information as system, not content. All caps throughout.

### Martian Mono Std xLt Extra-light — Martian Mono Std xLt Extra-light — detected in extracted data but not described by AI · `--font-martian-mono-std-xlt-extra-light`
- **Weights:** 200, 600
- **Sizes:** 18px
- **Line height:** 1.4
- **Role:** Martian Mono Std xLt Extra-light — detected in extracted data but not described by AI

### Martian Mono Std xLt — Martian Mono Std xLt — detected in extracted data but not described by AI · `--font-martian-mono-std-xlt`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.45
- **Letter spacing:** -0.05
- **Role:** Martian Mono Std xLt — detected in extracted data but not described by AI

### Martian Mono Nr xLt — Martian Mono Nr xLt — detected in extracted data but not described by AI · `--font-martian-mono-nr-xlt`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** Martian Mono Nr xLt — detected in extracted data but not described by AI

### Martian Mono Extra-light — Martian Mono Extra-light — detected in extracted data but not described by AI · `--font-martian-mono-extra-light`
- **Weights:** 200
- **Sizes:** 12px
- **Line height:** 1
- **Role:** Martian Mono Extra-light — detected in extracted data but not described by AI

### Martian Mono ExtraLight — Martian Mono ExtraLight — detected in extracted data but not described by AI · `--font-martian-mono-extralight`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.25
- **Letter spacing:** 0.02
- **Role:** Martian Mono ExtraLight — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.05px | `--text-caption` |
| body-sm | 14px | 1.25 | -0.002px | `--text-body-sm` |
| body | 18px | 1.45 | -0.008px | `--text-body` |
| subheading | 22px | 1.2 | -0.01px | `--text-subheading` |
| heading-sm | 35px | 1.1 | -0.02px | `--text-heading-sm` |
| heading | 42px | 1.1 | -0.025px | `--text-heading` |
| heading-lg | 60px | 1 | -0.03px | `--text-heading-lg` |
| display | 80px | 1 | -0.04px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 30px |
| cards | 18-30px |
| inputs | 96px |
| buttons | 96px |
| special | 300px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 48px
- **Element gap:** 10-20px

## Components

### Wordmark Display
**Role:** Brand-defining hero title

OZIK Black at 358px, white on void, line-height 0.83, letter-spacing -0.01em. One per page, full viewport width. The letterforms have distinctive cut-out apertures that are the brand's geometric signature.

### Pill Nav Button (LET'S TALK)
**Role:** Primary header CTA

Ghost pill: 1px border #3d3d3d, border-radius 96px, padding 10px 22px, text in Martian Mono 12px weight 200 all-caps, tracked +0.10em, white. A 34px circular icon button sits flush right containing a directional arrow.

### Filled Magenta CTA
**Role:** Primary action button

Background #fc74dd, text #1d1a1a, border-radius 96px, padding 10px 24px, Martian Mono 12px weight 200 all-caps, letter-spacing 0.10em. The only filled chromatic element in the system.

### Ghost Outline Button
**Role:** Secondary action

Transparent fill, 1px border #3d3d3d or #ffffff, border-radius 96px, padding 10px 22px, Martian Mono label white or #3d3d3d.

### Status Dot + Timestamp
**Role:** Live indicator in nav

8px #ff4c33 dot paired with Martian Mono 12px weight 200 white time text. Signals 'now' / recording metaphor.

### Ticker Label
**Role:** Uppercase header descriptor (e.g. 'BRANDING AND DATA, TOGETHER AT LAST >')

Martian Mono 12px weight 200 all-caps, white, letter-spacing 0.10em, with trailing arrow glyph. Functions as marquee/tagline.

### Case Study Card
**Role:** Project showcase block

Variable: white card variant uses #ffffff background, 30px radius, 48px padding, with a small dark pill category tag ('NIKE', 'MICROSOFT') in Martian Mono 12px white-on-charcoal. Dark card variant uses #1d1a1a on the void canvas. Featured artwork (data viz) uses flat chromatic shapes (orange #ff4c33, gray, neon yellow).

### Category Pill Tag
**Role:** Brand/client label on case studies

Dark pill, background #1d1a1a, text white, border-radius 30px, padding 4px 12px, Martian Mono 12px weight 400 all-caps. Sits in the top-left of case study cards.

### Input Field
**Role:** Form input (rare in this portfolio context)

Background #f3f3ef, border 1px #111212, border-radius 96px, padding 10px 22px, text in Martian Mono 18px weight 200. The only light-on-dark inverted form surface in the system.

### Video Player
**Role:** Full-bleed media block

Native HTML5 video with custom controls at 1.50 line-height for timestamps. Black background, white progress bar, mute/fullscreen icons in white.

### Section Heading Pair
**Role:** Two-column intro text under hero

Two columns at ~50/50 width: left in Basis Grotesque Pro 22px weight 400 white, right in Basis Grotesque Pro 18px weight 400 #d9d9d9 or white. Acts as manifesto/positioning statement.

### Accent Bar
**Role:** Decorative vertical element on cards

Thin vertical bar (3-6px wide) in #fc74dd or case-study-specific chromatic color, positioned flush to the left edge of a card. Functions as a color code for project category.

### Data Visualization Artwork
**Role:** Case study hero illustration

Flat geometric compositions: large overlapping circles in gray (#d9d9d9) and solid fills (#ff4c33 orange, neon yellow #d4f542, #94bcee blue), with numeric labels in Martian Mono centered inside. No gradients, no shadows — pure flat color blocking.

## Do's and Don'ts

### Do
- Set primary display text in OZIK Black at 358px, line-height 0.83, letter-spacing -0.01em, one wordmark per page maximum
- Use Martian Mono 12px weight 200 with letter-spacing 0.10em for all uppercase UI labels, nav items, and tags
- Apply border-radius 96px to every button and input; 300px for special capsule elements
- Reserve #fc74dd exclusively for filled primary action buttons and thin accent bars; never use it for body text or large surfaces
- Maintain a pure #000000 canvas across all sections; let white type and single-color accents carry the visual weight
- Set Basis Grotesque Pro headings with aggressive negative tracking: -0.04em at 80px scaling linearly toward 0 at 14px
- Use #ff4c33 only for the status dot in the nav and inside data viz artwork — never as a button or text color

### Don't
- Don't apply gradients, shadows, or glassmorphism — the system is flat and high-contrast
- Don't use #fc74dd for anything other than the primary filled action; one vivid color must stay singular
- Don't use OZIK Black for body copy or UI labels — it's a wordmark asset, not a system face
- Don't introduce mid-gray surfaces between #000000 and #1d1a1a; the elevation stack is intentionally two steps
- Don't use rounded corners below 18px on cards or 96px on interactive elements; the capsule geometry is the system
- Don't set body copy larger than 22px; the type system separates editorial display (60–80px) from prose (14–22px) with a deliberate gap
- Don't use color for de-emphasized text — use #d9d9d9 or reduced opacity on white instead of gray-blue or gray-violet

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Base canvas, page background, hero stage |
| 1 | Charcoal | `#1d1a1a` | Elevated cards, dark filled button states |
| 2 | Bone | `#ffffff` | Inverted case study cards, light mode contrast blocks |

## Elevation

The design deliberately avoids drop shadows and material elevation. Depth is communicated through value contrast (black canvas → #1d1a1a card → #ffffff inverted card) and through the dramatic typographic scale jump from 22px body to 358px display. There is no shadow stack, no blur, no glow — only flat planes and type weight doing the work.

## Imagery

Photography and traditional imagery are absent. The visual language is built from flat geometric data-visualization compositions — overlapping circles, pie segments, and bar charts rendered in solid chromatic fills (orange #ff4c33, neon yellow, gray, soft blue) with numeric labels in Martian Mono centered inside. Case study artwork sits on solid color backgrounds (orange, white, dark) and acts as the only 'color' on the page. Icons are minimal and line-based in white. No lifestyle photography, no product shots, no stock — the studio positions data itself as the aesthetic subject. Video content appears as a single full-bleed black player near the top of the page.

## Layout

Full-bleed dark page with the OZIK wordmark occupying the entire hero viewport. Below the hero, content is centered within a max-width of ~1440px with generous left/right gutters. The page rhythm is: massive wordmark → video block with two-column manifesto text below → vertical case study list. Case study cards stack vertically with consistent vertical rhythm (~80px between sections), each opening with a small monospace category tag, then a large image/video artwork block, then a short caption in Basis Grotesque. Navigation is a single thin top bar: left-side ticker text, centered live status with timestamp, right-side pill CTA — all in 12px Martian Mono. The grid is implicitly single-column at the section level with internal two-column splits for intro text and media. No sidebar, no footer chrome visible above the fold — the wordmark IS the page.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- card surface: #1d1a1a
- inverted card: #ffffff
- accent: #fc74dd (Neon Magenta)
- primary action: #fc74dd (filled action)

**Example Component Prompts**

1. *Hero Wordmark Section*: Full-viewport black canvas (#000000). Display 'Datalands' in OZIK Black at 358px, white (#ffffff), line-height 0.83, letter-spacing -0.01em, centered. No subtitle — the wordmark is the entire hero.

2. *Nav Bar*: Top bar, 10px vertical padding, 22px horizontal padding. Left: Martian Mono 12px weight 200 all-caps, white, letter-spacing 0.10em, text 'BRANDING AND DATA, TOGETHER AT LAST >'. Center: 8px #ff4c33 dot followed by Martian Mono 12px white time string. Right: ghost pill button, 1px #3d3d3d border, 96px radius, padding 10px 22px, Martian Mono 12px white 'LET'S TALK'.

3. *Case Study Card (Dark Variant)*: Background #1d1a1a, border-radius 30px, padding 48px. Top-left: dark category pill tag (background #1d1a1a, 30px radius, 4px 12px padding, Martian Mono 12px white 'MICROSOFT'). Left edge: 4px wide vertical bar in #fc74dd running full card height. Below: case study caption in Basis Grotesque Pro 22px weight 400, white.

4. *Two-Column Manifesto*: 48px section gap above. Two equal columns at max-width 1440px. Left: Basis Grotesque Pro 22px weight 400 white, 'Datalands is a visual communication and information design studio.' Right: Basis Grotesque Pro 18px weight 400 #d9d9d9, 'We produce groundbreaking, thrilling projects—shaping the aesthetics and essence of forward-thinking brands.'

5. *Section Label Tag*: A small 8px #ff4c33 dot followed by Martian Mono 12px weight 200 all-caps white, letter-spacing 0.10em, text 'CASE STUDIES'. Used to introduce any new content block on the page.

## Typographic Identity

The type system operates on a radical three-tier hierarchy: OZIK Black at 358px for the wordmark (one instance per page, treated as logo asset), Basis Grotesque Pro for all reading and editorial content with sizes ranging from 14px body to 80px display and aggressive negative tracking that scales with size, and Martian Mono for all UI chrome — nav, labels, tags, buttons, timestamps. The Martian Mono family is the connective tissue: its monospaced geometry codes everything as system/metadata, freeing Basis Grotesque to carry the actual content. Weight choices within Martian Mono are sparse: 200 (extra-light) for most UI text, 400 for body, 600 for emphasis. The negative letter-spacing on Basis Grotesque at large sizes (-0.04em at 80px) tightens the geometric forms so tightly that the type reads almost as a logo at display sizes — a visual rhyme with the OZIK wordmark above it.

## Similar Brands

- **Resn** — Same studio-portfolio-as-artwork philosophy with a single oversized typographic hero and a nearly all-black canvas that lets individual project tiles erupt with color
- **Locomotive** — Dark-mode agency site using condensed geometric sans for display and monospaced type for UI labels, with generous vertical rhythm between case study blocks
- **Active Theory** — Full-bleed dark creative agency site where the wordmark or hero visual fills the viewport and the rest of the page is a quiet monochrome support system
- **Manual (manualcreative.co)** — Brutalist display type at extreme sizes on a black canvas, with minimal UI chrome and a single accent color punctuating an otherwise monochrome system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-charcoal: #1d1a1a;
  --color-ink: #111212;
  --color-graphite: #3d3d3d;
  --color-mist: #d9d9d9;
  --color-parchment: #f3f3ef;
  --color-neon-magenta: #fc74dd;
  --color-ember-dot: #ff4c33;
  --color-deep-violet: #122d8b;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ozik-black: 'OZIK Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martian-mono: 'Martian Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-std-xlt-extra-light: 'Martian Mono Std xLt Extra-light', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-std-xlt: 'Martian Mono Std xLt', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-nr-xlt: 'Martian Mono Nr xLt', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-extra-light: 'Martian Mono Extra-light', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-extralight: 'Martian Mono ExtraLight', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.002px;
  --text-body: 18px;
  --leading-body: 1.45;
  --tracking-body: -0.008px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.02px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -0.025px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.03px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -0.04px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 48px;
  --element-gap: 10-20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 30px;
  --radius-3xl-2: 34px;
  --radius-full: 49px;
  --radius-full-2: 60px;
  --radius-full-3: 96px;
  --radius-full-4: 300px;

  /* Named Radii */
  --radius-tags: 30px;
  --radius-cards: 18-30px;
  --radius-inputs: 96px;
  --radius-buttons: 96px;
  --radius-special: 300px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-charcoal: #1d1a1a;
  --surface-bone: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-charcoal: #1d1a1a;
  --color-ink: #111212;
  --color-graphite: #3d3d3d;
  --color-mist: #d9d9d9;
  --color-parchment: #f3f3ef;
  --color-neon-magenta: #fc74dd;
  --color-ember-dot: #ff4c33;
  --color-deep-violet: #122d8b;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ozik-black: 'OZIK Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martian-mono: 'Martian Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-std-xlt-extra-light: 'Martian Mono Std xLt Extra-light', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-std-xlt: 'Martian Mono Std xLt', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-nr-xlt: 'Martian Mono Nr xLt', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-extra-light: 'Martian Mono Extra-light', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-martian-mono-extralight: 'Martian Mono ExtraLight', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.002px;
  --text-body: 18px;
  --leading-body: 1.45;
  --tracking-body: -0.008px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.02px;
  --text-heading: 42px;
  --leading-heading: 1.1;
  --tracking-heading: -0.025px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.03px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -0.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 30px;
  --radius-3xl-2: 34px;
  --radius-full: 49px;
  --radius-full-2: 60px;
  --radius-full-3: 96px;
  --radius-full-4: 300px;
}
```
