# Fictional — Style Reference
> Sticker-bombed tabletop — vivid decals scattered across a warm cream surface, held down by chunky rounded type.

**Theme:** light

Fictional is a sticker-bombed tabletop for a display typeface: cream canvas, oversized rounded type, and saturated color blocks behaving like die-cut decals. The page refuses grid discipline — speech bubbles, starbursts, pills, and diagonal tags scatter across the hero at free angles, each carrying a short shout in a vivid solid fill. Cards and sections are full-bleed color fields; type sits directly on them with no shadows, no gradients, no neumorphism. The only depth cue is a 2px solid yellow outline wrapping certain controls, which doubles as the system's entire elevation vocabulary. Layout reads as a collage pinned to corkboard, not a dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Blush | `#ffe9ce` | `--color-cream-blush` | Page canvas, hero background — the warm off-white that everything else sticks to |
| Paper White | `#ffffff` | `--color-paper-white` | Speech bubble fills, text on saturated color blocks, card reverse |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hero wordmark, sticker outlines, all display typography |
| Slate Gray | `#666666` | `--color-slate-gray` | Secondary body text, link underline, muted helper copy |
| Near Black | `#101010` | `--color-near-black` | Input text and input border — the UI control ink |
| Mist Gray | `#dddddd` | `--color-mist-gray` | Disabled button fill, low-emphasis surface |
| Pale Gray | `#cccccc` | `--color-pale-gray` | Inactive link border, disabled underline |
| Electric Violet | `#8a53ff` | `--color-electric-violet` | Section color blocks, circular badge fills, sticker bursts — the cool anchor of the palette |
| Coral Blaze | `#fd4b38` | `--color-coral-blaze` | Starburst stickers, red section blocks, urgent decorative shouts |
| Sunburst Yellow | `#ffd80c` | `--color-sunburst-yellow` | Sticker fills, section blocks, and the only shadow color in the system (2px solid ring around active controls) |
| Lime Spark | `#3ccb09` | `--color-lime-spark` | Round sticker badges and pill tags — the fresh-pop accent in sticker compositions |
| Deep Indigo | `#0500a3` | `--color-deep-indigo` | Inverted heading text on light cards and accent text inside color blocks — the cool counterweight to Coral Blaze |

## Tokens — Typography

### Fictional — The only typeface. Body, display, and UI voice. The five-weight family (Light through UltraBold) maps to a single size-and-voice axis: bigger and bolder is the entire hierarchy. The whisper-light 300 is reserved for captioning the type itself; UltraBold 800 owns the hero wordmark and sticker shouts. · `--font-fictional`
- **Substitute:** Quicksand (closest free analogue — rounded geometric with warm terminals) or Fredoka for a chunkier stand-in
- **Weights:** 300, 400, 600, 700, 800
- **Sizes:** 16, 22, 29, 36, 40, 43, 48, 50, 72, 115, 202, 346
- **Line height:** 0.90, 1.00, 1.10, 1.20, 1.30, 1.40, 1.67, 1.71, 1.88
- **Letter spacing:** 0.0120em across all sizes — uniformly positive tracking, unusually open for a display face
- **OpenType features:** `"ss01" on, "dlig" on — stylistic set 01 and discretionary ligatures shape the personality`
- **Role:** The only typeface. Body, display, and UI voice. The five-weight family (Light through UltraBold) maps to a single size-and-voice axis: bigger and bolder is the entire hierarchy. The whisper-light 300 is reserved for captioning the type itself; UltraBold 800 owns the hero wordmark and sticker shouts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.71 | 0.19px | `--text-caption` |
| body-sm | 22px | 1.67 | 0.26px | `--text-body-sm` |
| body | 29px | 1.4 | 0.35px | `--text-body` |
| subheading | 36px | 1.3 | 0.43px | `--text-subheading` |
| heading-sm | 43px | 1.2 | 0.52px | `--text-heading-sm` |
| heading | 50px | 1.1 | 0.6px | `--text-heading` |
| heading-lg | 72px | 1 | 0.86px | `--text-heading-lg` |
| display | 115px | 1 | 1.38px | `--text-display` |
| display-xl | 202px | 0.9 | 2.42px | `--text-display-xl` |
| hero | 346px | 0.9 | 4.15px | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 60 | 60px | `--spacing-60` |
| 108 | 108px | `--spacing-108` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 10px |
| cards | 15px |
| pills | 144px |
| buttons | 5px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(251, 215, 12) 0px 0px 0px 2px` | `--shadow-subtle` |

### Layout

- **Section gap:** 60px
- **Card padding:** 29px
- **Element gap:** 12-29px

## Components

### Hero Wordmark
**Role:** The product name set as the page's first impression

Fictional set at 202–346px, weight 800 (UltraBold), Ink Black on Cream Blush, line-height 0.90, letter-spacing 4.15px. Sits on the cream canvas with sticker overlays scattered around it. No headline above it — the wordmark IS the headline.

### Starburst Sticker
**Role:** Decorative shout overlay floating over the hero and section blocks

12-point or 16-point jagged star shape, solid Coral Blaze or Sunburst Yellow fill, white or Ink Black text at 22–29px weight 700, rotated -8° to 12°. No border, no shadow. Carries single shout words like 'KABOOOM' or 'BANG'.

### Speech Bubble Tag
**Role:** Conversational annotation pinned to the wordmark or specimen

Paper White fill, 15px radius, Ink Black text at 29–36px weight 400, with a small triangular tail pointing toward its referent. Sits at slight rotation. 29px vertical padding, 43px horizontal padding.

### Circular Badge Sticker
**Role:** Round tag for compact shouts like 'NEW!' or 'OUT NOW'

144px border-radius (full circle), Electric Violet or Lime Spark fill, Paper White text at 16–22px weight 700, centered both axes. Reads as a physical button badge.

### Diagonal Sticker Label
**Role:** Rectangular angled tag for longer shout lines like 'FREE TRIAL AVAILABLE'

Solid Coral Blaze fill, Ink Black text at 22px weight 700, 5px radius, rotated -12° to -20°, no border. 8px vertical padding, 29px horizontal padding. Layered above other stickers.

### Weight Specimen Card
**Role:** Large color-block card listing the type family's weights

Electric Violet background, 15px radius, 60px vertical padding, 43px horizontal padding. Weight names stacked vertically (Light through UltraBold) in Paper White at 36–43px weight 400. Used to present the family at a glance.

### Specimen Description Card
**Role:** Companion card to the weight list, holding the brand pitch

Sunburst Yellow background, 15px radius, 58px vertical padding, 43px horizontal padding. Ink Black body text at 29px weight 400, line-height 1.40. A short horizontal Ink Black rule with a centered dot divider sits below the text.

### Character Set Display
**Role:** Full-width red panel showing the typeface's glyph coverage

Coral Blaze full-bleed block, 15px radius on the visible specimen rectangle. Inset outlined tile in Sunburst Yellow 2px border marks the first glyph. A 144px-radius large 'A' sits in the bottom-right as a watermark.

### Action Button (Yellow Ring)
**Role:** The only interactive control in the system

Paper White fill, 5px radius, Sunburst Yellow 2px solid ring (the entire elevation system), Ink Black text at 16–22px weight 700, 8px vertical padding, 24px horizontal padding. On hover, the fill flips to Ink Black and text flips to Paper White.

### Inline Link
**Role:** Text link with a visible underline rule

Ink Black or Slate Gray text at 29px weight 400 with a 1px Slate Gray or Pale Gray bottom border. No underline-offset trickery — the border IS the underline, sitting directly under the baseline.

### Text Input
**Role:** Form field for any capture context

Paper White fill, 1px Near Black border, 5px radius, Near Black text at 16px weight 400, 8px vertical padding, 12px horizontal padding. No focus ring color is added — the existing border thickens to 2px on focus.

### Scroll Prompt Sticker
**Role:** Directional cue floating in the lower hero

Electric Violet circle (144px radius), Paper White text at 22px weight 400 reading 'scroll down ↓', centered. Floats free, no shadow.

### Section Color Block
**Role:** Full-width panel that flips the page temperature

Full-bleed background in Electric Violet, Coral Blaze, or Sunburst Yellow, 60–80px vertical padding, 43–58px horizontal padding for inner content. Always paired with a contrasting block (the page rhythm is color-flipped sections, not white/gray alternation).

## Do's and Don'ts

### Do
- Use 5px radius for buttons, 15px for cards, 144px for circular tags — these three radii are the entire shape vocabulary
- Set line-height to 0.90–1.10 for any display size above 72px; the type is designed to lock up tight
- Set type color to Ink Black on Cream Blush and Paper White on every saturated color block — never invert within a block
- Rotate stickers between -15° and 15°; energy comes from the angle, not from varied colors within one composition
- Use the 2px solid Sunburst Yellow ring as the only elevation cue on buttons and selected stickers
- Keep section rhythm as alternating full-bleed color blocks (violet → yellow → red) rather than white/gray bands
- Activate 'ss01' and 'dlig' font features on every Fictional text node — the ligatures and alternate forms carry the personality

### Don't
- Don't use drop shadows, blur, or opacity layering — the system has exactly one shadow, and it's a solid 2px ring
- Don't set body line-height above 1.40; the face tightens as it grows and reading copy stays compact
- Don't introduce muted or desaturated tints of the brand colors — all five are used at full saturation
- Don't use Light weight (300) for any display size above 72px; the whisper weights live at 16–29px captions only
- Don't separate stickers with gray dividers or whitespace gutters — let them overlap and stack
- Don't use gray fill buttons; buttons sit inside color blocks and use the yellow ring as their accent
- Don't exceed four sticker colors in a single composition — the page is a collage, not a kaleidoscope

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Blush Canvas | `#ffe9ce` | Default page and hero background — the tabletop everything sticks to |
| 2 | Color Block Section | `#8a53ff` | Full-bleed violet sections that flip the canvas temperature and act as a secondary background |
| 3 | Sticker Fill | `#fd4b38` | Decorative overlays and reverse sections carrying urgency |
| 4 | Paper White Reverse | `#ffffff` | Speech bubbles, specimen cards, and reverse type plates that need a neutral within a colored section |

## Elevation

- **Active Button / Sticker Ring:** `rgb(251, 215, 12) 0px 0px 0px 2px`

## Imagery

No photography, no product screenshots, no rendered type specimens in raster form. The visual language is entirely typographic and graphic: Fictional set huge, paired with flat geometric shapes (starbursts, circles, pills, rounded rectangles) in five vivid solid fills. Icons are absent — text inside the geometric shapes functions as the only iconography. Every visual element is vector, flat-color, and rotated. The closest thing to a photograph is the cream canvas itself, which reads as a tabletop surface rather than a digital background.

## Layout

Full-bleed, no max-width container. The page is a vertical stack of color-block sections, each filling the viewport edge to edge: cream hero on top, then alternating violet / yellow / red / cream blocks down the page. Within each block, content is padded generously (43–58px horizontal) but elements are not constrained to a column grid — the hero is a free composition with the wordmark center-anchored and stickers scattered at angles around it. Cards inside color blocks sit as inset rectangles, not as floating tiles. Navigation is minimal: a small diagonal 'GET IT HERE' sticker in the upper-left corner of the hero replaces a traditional nav bar. Section transitions are hard color flips, not fades or gradients. The overall rhythm is a pinboard — pieces overlap, rotate, and crowd each other — not a magazine grid.

## Agent Prompt Guide

Quick Color Reference
• page canvas: #ffe9ce
• text on canvas: #000000
• text on color blocks: #ffffff or #0500a3
• card / section blocks: #8a53ff, #fd4b38, #ffd80c, #3ccb09
• border / input rule: #101010
• accent ring: #ffd80c (2px solid)
• primary action: no distinct CTA color

Example Component Prompts
1. Hero wordmark: cream #ffe9ce full-bleed background. The word 'Fictional' set at 346px, Fictional weight 800, line-height 0.90, letter-spacing 4.15px, color #000000, centered. Scatter three stickers around it: a Coral Blaze 16-point starburst at 72px saying 'KABOOOM' in white 22px weight 700 rotated -8°; a Paper White speech bubble (15px radius) with Ink Black 29px weight 400 reading 'A friendly & quirky typeface' rotated 4°; an Electric Violet circle (144px radius) reading 'OUT NOW' in white 22px weight 700.
2. Weight specimen card: Electric Violet #8a53ff full card, 15px radius, 60px vertical and 43px horizontal padding. Stack five lines of weight names in Paper White at 43px weight 400, line-height 1.20: Fictional Light, Fictional Regular, Fictional SemiBold, Fictional Bold, Fictional UltraBold.
3. Specimen description card: Sunburst Yellow #ffd80c background, 15px radius, 58px vertical and 43px horizontal padding. Ink Black body text at 29px weight 400, line-height 1.40, reading 'Fictional is a friendly, playful typeface, full of warmth and personality. Perfect for cheerful branding, packaging, game interfaces, and children's books.' A 1px Ink Black horizontal rule with a centered filled dot sits 24px below the text.
4. Action button: Paper White #ffffff fill, 5px radius, 2px solid Sunburst Yellow #ffd80c ring, Ink Black text at 16px weight 700, 8px vertical and 24px horizontal padding. The 2px ring is the only shadow in the entire system.
5. Section color block transition: full-bleed Coral Blaze #fd4b38 section, 72px vertical padding, containing a single Cream Blush #ffe9ce speech bubble (15px radius) with Ink Black 36px weight 400 text 'with a cartoonesque character', rotated -3°. Below it, a Lime Spark #3ccb09 circular badge (144px radius) reading 'scroll down ↓' in white 22px weight 400.

## Similar Brands

- **Pangram Pangram** — Type foundry showcase using full-bleed color blocks, oversized specimen type, and scattered decorative shapes with rotated angles
- **Grilli Type** — Friendly geometric typefaces presented on warm cream canvases with confident, sticker-like layout decisions and minimal nav
- **Ohno Type** — Quirky display families marketed through playful, collage-style hero compositions with bursts and pill labels
- **Dinamo (Font of the Month)** — Bold specimen pages that treat the typeface as a poster — full-bleed color fields, no shadows, type doing the visual work
- **Future Fonts** — Foundry marketplace aesthetic with vivid block colors, rounded type, and informal sticker-annotation overlays

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-blush: #ffe9ce;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-slate-gray: #666666;
  --color-near-black: #101010;
  --color-mist-gray: #dddddd;
  --color-pale-gray: #cccccc;
  --color-electric-violet: #8a53ff;
  --color-coral-blaze: #fd4b38;
  --color-sunburst-yellow: #ffd80c;
  --color-lime-spark: #3ccb09;
  --color-deep-indigo: #0500a3;

  /* Typography — Font Families */
  --font-fictional: 'Fictional', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.71;
  --tracking-caption: 0.19px;
  --text-body-sm: 22px;
  --leading-body-sm: 1.67;
  --tracking-body-sm: 0.26px;
  --text-body: 29px;
  --leading-body: 1.4;
  --tracking-body: 0.35px;
  --text-subheading: 36px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.43px;
  --text-heading-sm: 43px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.52px;
  --text-heading: 50px;
  --leading-heading: 1.1;
  --tracking-heading: 0.6px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 0.86px;
  --text-display: 115px;
  --leading-display: 1;
  --tracking-display: 1.38px;
  --text-display-xl: 202px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: 2.42px;
  --text-hero: 346px;
  --leading-hero: 0.9;
  --tracking-hero: 4.15px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-108: 108px;

  /* Layout */
  --section-gap: 60px;
  --card-padding: 29px;
  --element-gap: 12-29px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-full: 144px;

  /* Named Radii */
  --radius-tags: 10px;
  --radius-cards: 15px;
  --radius-pills: 144px;
  --radius-buttons: 5px;

  /* Shadows */
  --shadow-subtle: rgb(251, 215, 12) 0px 0px 0px 2px;

  /* Surfaces */
  --surface-cream-blush-canvas: #ffe9ce;
  --surface-color-block-section: #8a53ff;
  --surface-sticker-fill: #fd4b38;
  --surface-paper-white-reverse: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-blush: #ffe9ce;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-slate-gray: #666666;
  --color-near-black: #101010;
  --color-mist-gray: #dddddd;
  --color-pale-gray: #cccccc;
  --color-electric-violet: #8a53ff;
  --color-coral-blaze: #fd4b38;
  --color-sunburst-yellow: #ffd80c;
  --color-lime-spark: #3ccb09;
  --color-deep-indigo: #0500a3;

  /* Typography */
  --font-fictional: 'Fictional', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.71;
  --tracking-caption: 0.19px;
  --text-body-sm: 22px;
  --leading-body-sm: 1.67;
  --tracking-body-sm: 0.26px;
  --text-body: 29px;
  --leading-body: 1.4;
  --tracking-body: 0.35px;
  --text-subheading: 36px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.43px;
  --text-heading-sm: 43px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.52px;
  --text-heading: 50px;
  --leading-heading: 1.1;
  --tracking-heading: 0.6px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 0.86px;
  --text-display: 115px;
  --leading-display: 1;
  --tracking-display: 1.38px;
  --text-display-xl: 202px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: 2.42px;
  --text-hero: 346px;
  --leading-hero: 0.9;
  --tracking-hero: 4.15px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-60: 60px;
  --spacing-108: 108px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-full: 144px;

  /* Shadows */
  --shadow-subtle: rgb(251, 215, 12) 0px 0px 0px 2px;
}
```
