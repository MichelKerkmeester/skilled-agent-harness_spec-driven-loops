# fastht.ml — Style Reference
> Confetti scattered across gallery walls

**Theme:** mixed

FastHTML runs on a sticker-pack logic: monochrome type and pill-shaped controls float over alternating full-bleed color bands (light canvas, deep aubergine, periwinkle violet) while vivid green, yellow, pink, and violet shapes scatter like confetti in the margins. The signature is the button — a black pill with a two-layer shadow that stacks a bright white inner highlight on top of a dark drop shadow, making every control read as a physical sticker peeled from the page. Typography stays geometric and compact (Geist, tight tracking on large sizes, Geist Mono for code) so the saturated accents can do the emotional work. Cards are generously rounded (24–40px) but never feel soft — they sit on hard color blocks, not on layered neutrals.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sticker Green | `#3cdd8c` | `--color-sticker-green` | Decorative blob shapes, accent fills in hero and code-demo section |
| Sticker Yellow | `#ffc435` | `--color-sticker-yellow` | Decorative blob shapes, warm accent fill in hero |
| Sticker Pink | `#e699d9` | `--color-sticker-pink` | Decorative blob shapes, soft accent fill in hero |
| Periwinkle Violet | `#7575f0` | `--color-periwinkle-violet` | Full-bleed FAQ section background, section-level color band |
| Soft Periwinkle | `#939eeb` | `--color-soft-periwinkle` | Inline text accents, table text, light violet typography |
| Deep Aubergine | `#3a2234` | `--color-deep-aubergine` | Dark code-demo section background — the primary dark band |
| Mint Cream | `#d4f7e6` | `--color-mint-cream` | Tinted card surface — pale green card variant |
| Cotton Candy | `#ffccf7` | `--color-cotton-candy` | Tinted card surface — pale pink card variant |
| Butter Cream | `#ffeecc` | `--color-butter-cream` | Tinted card surface — pale yellow card variant |
| Lavender Mist | `#e8e8fc` | `--color-lavender-mist` | Tinted card surface — pale violet card variant, nav pill background |
| Dusty Mauve | `#eddee9` | `--color-dusty-mauve` | Tinted card surface — mauve card variant |
| Carbon | `#000000` | `--color-carbon` | Primary text, filled button fill, hero headline color |
| Paper White | `#ffffff` | `--color-paper-white` | Light section canvas, card surface on dark/violet bands, button text on black |
| Fog | `#f3f3f3` | `--color-fog` | Light card surfaces on light sections, subtle fills |
| Silver | `#e5e7eb` | `--color-silver` | Hairline borders, dividers, table grid lines |
| Ash | `#cccccc` | `--color-ash` | Muted secondary text, placeholder labels |
| Graphite | `#999999` | `--color-graphite` | Disabled/inactive text, table muted cells |
| Slate | `#333333` | `--color-slate` | Borders on dark sections, secondary dividers |

## Tokens — Typography

### Geist — All interface text — headlines, body, buttons, nav, cards. Geist is a geometric sans with hard-cut terminals; weight 400 carries body, weight 500 carries UI controls and subheads. Display sizes use tight negative tracking (up to -0.015em) to lock letters together at hero scale. · `--font-geist`
- **Substitute:** Inter, Manrope, or system-ui
- **Weights:** 400, 500
- **Sizes:** 16px, 20px, 24px, 32px, 60px, 72px
- **Line height:** 1.10–1.50 (tight 1.10–1.25 on display, 1.40–1.50 on body)
- **Letter spacing:** -0.015em at 72px, -0.01em at 60px, -0.005em at 32px, normal at 16px
- **OpenType features:** `"clig" 0, "liga" 0`
- **Role:** All interface text — headlines, body, buttons, nav, cards. Geist is a geometric sans with hard-cut terminals; weight 400 carries body, weight 500 carries UI controls and subheads. Display sizes use tight negative tracking (up to -0.015em) to lock letters together at hero scale.

### Geist Mono — Code blocks, inline code, file labels, tabular data. Loose 1.80 line-height is deliberate — it creates breathing room around syntax tokens so colored keywords read as decoration, not noise. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, Fira Code, or ui-monospace
- **Weights:** 500
- **Sizes:** 14px, 16px
- **Line height:** 1.80
- **OpenType features:** `"clig" 0, "liga" 0`
- **Role:** Code blocks, inline code, file labels, tabular data. Loose 1.80 line-height is deliberate — it creates breathing room around syntax tokens so colored keywords read as decoration, not noise.

### Arial Black — Arial Black — detected in extracted data but not described by AI · `--font-arial-black`
- **Weights:** 400, 700
- **Sizes:** 16px, 20px
- **Line height:** 1.5
- **OpenType features:** `"clig" 0, "liga" 0`
- **Role:** Arial Black — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.8 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| subheading | 20px | 1.4 | -0.1px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.12px | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.16px | `--text-heading` |
| heading-lg | 60px | 1.22 | -0.6px | `--text-heading-lg` |
| display | 72px | 1.1 | -1.08px | `--text-display` |

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
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| hero | 40px |
| tags | 9999px |
| cards | 24px |
| images | 20px |
| buttons | 9999px |
| codeBlocks | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.5) 0px 2px 2px 0px, rgba(0, 0, 0, 0...` | `--shadow-subtle` |
| sm | `rgba(255, 255, 255, 0.1) 0px 2px 4px 0px inset, rgba(0, 0...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Pill Navigation Bar
**Role:** Floating top navigation

Horizontal pill (9999px radius) with Lavender Mist (#e8e8fc) fill, 8px vertical / 16px horizontal padding, containing a small FastHTML logo badge on the left and a black 'Read docs' button on the right. Floats over page content with the two-layer embossed shadow. Centered at the top of the page, sits inside a max-width container.

### Black Filled Button (primary action)
**Role:** Primary CTA — the only action color in the system

9999px pill, #000000 fill, #ffffff text at 16px/weight 500, 8px vertical / 24px horizontal padding, with the signature two-layer embossed shadow (white inner highlight + dark drop shadow). No colored alternative — every primary action is black.

### Ghost / Outlined Button (secondary action)
**Role:** Secondary CTA like 'Watch intro'

9999px pill, transparent or #ffffff fill, 1px #000000 border, #000000 text at 16px/weight 500, 8px/24px padding. Often contains a leading element (avatar thumbnail, icon) inline with the label. Same embossed shadow as the filled variant.

### Decorative Blob Shapes
**Role:** Background atmosphere in hero sections

Scattered geometric shapes — circles, rounded squares, capsule pills — in Sticker Green, Sticker Yellow, Sticker Pink, and Periwinkle Violet, each at 20–40px radius. Positioned absolutely around the hero content as oversized decorations (some spilling off-canvas), creating confetti-like rhythm. Never informational, never interactive.

### Dark Code-Demo Section
**Role:** Full-bleed band showing live components

Full-bleed band with Deep Aubergine (#3a2234) background, 64–96px vertical padding. Contains a centered white headline at heading-lg scale, then a 2-column split: code block on the left (16px radius, near-black fill, Geist Mono with syntax tokens) and a demo card on the right (Paper White surface, 20px radius, containing a rounded image at 16px radius).

### Code Block Card
**Role:** Syntax-highlighted code display

16px radius, near-black fill (#000000 or #1a1a1a), Geist Mono at 14px/weight 500, 1.8 line-height. Top bar shows a filename label (e.g. 'card3d.py') in 14px Geist with a copy icon at the right. Keywords and strings colored with site accents (periwinkle, pink, green) for visual rhythm against the dark background.

### Component Demo Card
**Role:** Right-column partner to the code block

Paper White (#ffffff) surface, 20px radius, 32px padding, containing a rounded image (16px radius) that demonstrates the component live. Sits at the same height as the code block for visual parity.

### Tab Pills Row
**Role:** Category switcher beneath code demo

Horizontal row of pill-shaped tabs inside a dark rounded container. Active tab has a slightly lighter/different fill than inactive. Labels: 'Components', 'Dynamic', 'Reusable', 'Databases' at 16px Geist. 9999px radius on every tab.

### Periwinkle FAQ Section
**Role:** Full-bleed band for Q&A content

Full-bleed Periwinkle Violet (#7575f0) background, 64–96px padding. Two-column: left column holds an eyebrow ('FAQ'), a heading-lg title, and body subtext all in #000000; right column stacks 6–8 accordion cards vertically with 16px gap.

### FAQ Accordion Card
**Role:** Expandable question card

Paper White (#ffffff) surface, 16px radius, 20px vertical / 24px horizontal padding. Question text at 16px/weight 500 in #000000, left-aligned. Plus icon ('+') in 20px sits at the far right. No visible border or shadow — the white card on violet background provides all the separation needed.

### Tinted Feature Card
**Role:** Pastel-colored card for feature highlights

Available in five pastel tints — Mint Cream, Cotton Candy, Butter Cream, Lavender Mist, Dusty Mauve. 24px radius, 32px padding, no border, no shadow. Used to break up monochrome content sections with color punctuation.

### Watch Intro Card
**Role:** Inline media preview in CTA row

9999px pill-shaped card combining a small circular avatar thumbnail, a 14px label ('Watch intro'), a duration timestamp ('7min 30sec') in muted #999999, and a red YouTube play icon at the right. White fill, sits inline with the primary CTA as its companion.

## Do's and Don'ts

### Do
- Use 9999px radius on every button, nav, tag, and pill-shaped control
- Apply the two-layer embossed shadow (white inner highlight + dark drop) to any interactive element that should feel like a physical sticker
- Alternate full-bleed color bands vertically — light canvas, then dark, then saturated — rather than padding one background with colored cards
- Use Geist at weight 400 for body and weight 500 for UI controls; never go above weight 500
- Apply tight negative letter-spacing on display sizes: -0.015em at 72px, scaling toward 0 at body size
- Scatter 3–5 oversized confetti shapes (circles, rounded rectangles, capsule pills) around hero content as absolutely positioned decorations in Sticker Green, Yellow, Pink, and Periwinkle Violet
- Use Geist Mono at 14px with 1.8 line-height for all code blocks; color keywords with site accents

### Don't
- Don't introduce a colored CTA — the primary action is always black filled; the only action color is #000000
- Don't use square or 4px-radius buttons — every interactive shape is a pill or a generously rounded rectangle (16–24px)
- Don't put cards on layered neutral grays — cards sit on hard color blocks or stay flat on the white canvas
- Don't use serif fonts, script fonts, or display fonts — Geist and Geist Mono only
- Don't set body line-height below 1.4 or code line-height below 1.6 — the loose spacing is part of the sticker-pack reading
- Don't use #7575f0 (Periwinkle Violet) as a small accent — it's a section-level full-bleed background color, not a token
- Don't add drop shadows to FAQ cards or code-demo demo cards — their separation comes from the color block beneath, not from elevation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Light Canvas | `#ffffff` | Default page background, hero and content sections |
| 1 | Card on Light | `#f3f3f3` | Light card surface that lifts off the white canvas |
| 2 | Tinted Card | `#e8e8fc` | Pastel card variant — lavender/mint/butter/cotton candy tints used as colorful card surfaces |
| 3 | Dark Band | `#3a2234` | Full-bleed code-demo section background |
| 4 | Colored Band | `#7575f0` | Full-bleed periwinkle FAQ section |

## Elevation

- **Primary/Secondary buttons, nav pill:** `rgba(255, 255, 255, 0.5) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 3px 0px`
- **Cards, elevated surfaces:** `rgba(255, 255, 255, 0.1) 0px 2px 4px 0px inset, rgba(0, 0, 0, 0.5) 0px 4px 8px 0px`

## Imagery

No photography. The visual language is built from two sources: (1) scattered geometric confetti shapes — circles, rounded squares, capsule pills in vivid green, yellow, pink, and violet — positioned as oversized background decorations that spill off-canvas, and (2) small product/illustration thumbnails inside demo cards (a dragon illustration at 16px radius in the code-demo section). Icons appear as small filled glyphs in the nav and tab rows. The decorative shapes are flat, hard-edged, and brand-colored; the few product images are tight crops with rounded corners and no lifestyle context — the object IS the demo.

## Layout

Full-bleed alternating color bands — light canvas hero, Deep Aubergine code-demo band, Periwinkle Violet FAQ band — stacked vertically with no gutters between them. Content inside each band is centered in a ~1200px max-width container with 64–96px vertical padding. Hero is a centered single-column stack: nav pill, headline, subtext, CTA row. Code-demo section splits 2-column (code left, demo right). FAQ section splits 2-column (title left, accordion stack right). Decorative confetti shapes are positioned absolutely around hero content, partially clipping off-canvas. Navigation is a single floating pill at the top — no sidebar, no mega-menu.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 (Carbon) on light, #ffffff (Paper White) on dark/violet
- background: #ffffff (light canvas), #3a2234 (Deep Aubergine dark band), #7575f0 (Periwinkle Violet band)
- border: #e5e7eb (Silver, hairline), #333333 (Slate, on dark)
- accent: #3cdd8c (green), #ffc435 (yellow), #e699d9 (pink), #7575f0 (violet)
- primary action: #000000 (filled action)
- card surface (tinted): #e8e8fc (lavender), #d4f7e6 (mint), #ffccf7 (pink), #ffeecc (butter), #eddee9 (mauve)

## Example Component Prompts
1. **Hero with confetti**: White (#ffffff) canvas, centered max-width 1200px. Scattered decorative shapes: a 200px Sticker Green (#3cdd8c) circle top-left clipping off-canvas, a 240px Sticker Yellow (#ffc435) rounded square (40px radius) top-right, a 180px Sticker Pink (#e699d9) capsule pill mid-left, a 220px Periwinkle Violet (#7575f0) rounded square (24px radius) mid-right. Display headline 'Modern web applications in pure Python' at 72px Geist weight 500, #000000, letter-spacing -1.08px, line-height 1.1, centered. Subtext at 16px Geist weight 400, #000000, centered, 600px max-width.
2. **Primary CTA button**: 9999px radius pill, #000000 fill, #ffffff text, Geist 16px weight 500, padding 8px vertical / 24px horizontal. Apply two-layer shadow: rgba(255,255,255,0.5) 0px 2px 2px 0px inset, rgba(0,0,0,0.2) 0px 3px 3px 0px.
3. **Dark code-demo section**: Full-bleed band with #3a2234 background, 96px vertical padding. Centered heading at 60px Geist weight 500, #ffffff, letter-spacing -0.6px. Two-column grid below: left is a code block (16px radius, #000000 fill, Geist Mono 14px weight 500, line-height 1.8, filename label in 14px Geist at top with copy icon right-aligned), right is a Paper White (#ffffff) demo card with 20px radius, 32px padding, containing a 16px-radius image.
4. **FAQ accordion section**: Full-bleed #7575f0 background, 64px padding. Left column: 'FAQ' eyebrow at 14px Geist, heading 'Questions? Answers.' at 60px Geist weight 500 #000000, subtext at 16px Geist #000000. Right column: 7 white accordion cards stacked with 16px gap, each #ffffff with 16px radius, 20px/24px padding, question text 16px Geist weight 500 #000000, '+' icon right-aligned.
5. **Tinted feature card**: 24px radius, #e8e8fc (Lavender Mist) fill, 32px padding, no border, no shadow. Heading at 24px Geist weight 500 #000000, body at 16px Geist weight 400 #000000.

## Similar Brands

- **Vercel** — Same alternating full-bleed light/dark/saturated band structure and pill-shaped navigation floating over content
- **Linear** — Same tight Geist-class geometric typography, generous card radii (20–24px), and a single neutral-black action color
- **Resend** — Same confetti-decorated hero approach with scattered geometric accent shapes around centered copy
- **Railway** — Same sticker-pack logic with pill controls, pastel card variants, and a two-layer embossed button shadow

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sticker-green: #3cdd8c;
  --color-sticker-yellow: #ffc435;
  --color-sticker-pink: #e699d9;
  --color-periwinkle-violet: #7575f0;
  --color-soft-periwinkle: #939eeb;
  --color-deep-aubergine: #3a2234;
  --color-mint-cream: #d4f7e6;
  --color-cotton-candy: #ffccf7;
  --color-butter-cream: #ffeecc;
  --color-lavender-mist: #e8e8fc;
  --color-dusty-mauve: #eddee9;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-fog: #f3f3f3;
  --color-silver: #e5e7eb;
  --color-ash: #cccccc;
  --color-graphite: #999999;
  --color-slate: #333333;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial-black: 'Arial Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.8;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.12px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.16px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.22;
  --tracking-heading-lg: -0.6px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.08px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-hero: 40px;
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-images: 20px;
  --radius-buttons: 9999px;
  --radius-codeblocks: 16px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.5) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 3px 0px;
  --shadow-sm: rgba(255, 255, 255, 0.1) 0px 2px 4px 0px inset, rgba(0, 0, 0, 0.5) 0px 4px 8px 0px;

  /* Surfaces */
  --surface-light-canvas: #ffffff;
  --surface-card-on-light: #f3f3f3;
  --surface-tinted-card: #e8e8fc;
  --surface-dark-band: #3a2234;
  --surface-colored-band: #7575f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sticker-green: #3cdd8c;
  --color-sticker-yellow: #ffc435;
  --color-sticker-pink: #e699d9;
  --color-periwinkle-violet: #7575f0;
  --color-soft-periwinkle: #939eeb;
  --color-deep-aubergine: #3a2234;
  --color-mint-cream: #d4f7e6;
  --color-cotton-candy: #ffccf7;
  --color-butter-cream: #ffeecc;
  --color-lavender-mist: #e8e8fc;
  --color-dusty-mauve: #eddee9;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-fog: #f3f3f3;
  --color-silver: #e5e7eb;
  --color-ash: #cccccc;
  --color-graphite: #999999;
  --color-slate: #333333;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial-black: 'Arial Black', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.8;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.12px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.16px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.22;
  --tracking-heading-lg: -0.6px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.08px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.5) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 3px 0px;
  --shadow-sm: rgba(255, 255, 255, 0.1) 0px 2px 4px 0px inset, rgba(0, 0, 0, 0.5) 0px 4px 8px 0px;
}
```
