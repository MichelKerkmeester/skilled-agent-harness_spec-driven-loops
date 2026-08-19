# Sublime — Style Reference
> white-walled curator's atelier — a quiet gallery where one bold black headline holds the room and a single green object is always the only thing worth picking up

**Theme:** light

Sublime operates as a digital atelier: vast white walls, a single monumental headline anchoring each view, and collected objects (text snippets, vintage images, 3D renders) that feel curated rather than organized. The palette is 98% achromatic — black on white carries the entire interface, with two whisper-soft washes (pale blue, pale green) and one vivid moss green that punctuates moments of intent. Typography does the structural work: a custom geometric sans at extreme sizes and tight tracking creates headline gravity, while Times New Roman supplies a literary counterpoint for body copy and quotes — the serif/sans collision is deliberate editorial tension, not a system oversight. Layout breathes aggressively — centered compositions, floating collaged elements that overlap and ignore grid lines, generous vertical rhythm. Radii split into two modes: crisp 5px for functional controls, 999px pill for tags and special actions.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Moss Green | `#38744d` | `--color-moss-green` | Green outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Signal Cyan | `#00aaff` | `--color-signal-cyan` | Blue outline accent for tags, dividers, and focused UI edges. |
| Ice Wash | `#e0f5ff` | `--color-ice-wash` | Cool surface tint — content card backgrounds, highlight washes; a barely-there blue that hints at a Polaroid shadow without actually adding one |
| Mint Whisper | `#cbffa6` | `--color-mint-whisper` | Warm surface tint — secondary highlight washes, soft card fills; a pale chartreuse that pairs with Moss Green as a lighter sibling |
| Pure Black | `#000000` | `--color-pure-black` | Primary text, structural borders, icon strokes — the dominant workhorse (870 uses); never softened to gray, always full ink |
| Graphite | `#181816` | `--color-graphite` | Heading text and icon fills — a near-black with the faintest warm shift, used where Pure Black would feel too clinical (display headings, filled icons) |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, text on dark fills — the gallery wall itself |
| Bone | `#efefef` | `--color-bone` | Elevated surface, button backgrounds, subtle dividers — the off-white that lets buttons and cards sit forward without using shadow |
| Stone | `#908f8e` | `--color-stone` | Button borders, secondary borders — medium gray for outlined controls that need definition without weight |
| Fog | `#a29e9c` | `--color-fog` | Body borders, nav borders, muted body text — the most-used border gray (275 instances); creates the hairline-grid that organizes the page without drawing attention |
| Slate | `#6a6967` | `--color-slate` | Heading borders, link text, secondary headings — darker than Fog for moments that need more presence than a border but less than a heading |

## Tokens — Typography

### Control Upright — Primary interface sans — headlines, nav, buttons, body, icons. A single-weight geometric sans that does all structural work. Signature choice: it carries the 142px display headline at weight 400 only, so the extreme size creates weight rather than the font face. The custom stylistic sets ss12 and ss09 are active — these likely adjust letterforms (apertures, terminals) to keep the geometric structure readable at small sizes and dramatic at large. · `--font-control-upright`
- **Substitute:** Inter, DM Sans, or Satoshi
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 28px, 64px, 142px
- **Line height:** 0.90–1.39 (tight 0.90–1.00 at display sizes, opens to 1.39 at body sizes)
- **Letter spacing:** -0.02em at 64px and above, -0.015em at 18–28px, +0.008em at 12–16px
- **OpenType features:** `"ss12" on, "ss09" on`
- **Role:** Primary interface sans — headlines, nav, buttons, body, icons. A single-weight geometric sans that does all structural work. Signature choice: it carries the 142px display headline at weight 400 only, so the extreme size creates weight rather than the font face. The custom stylistic sets ss12 and ss09 are active — these likely adjust letterforms (apertures, terminals) to keep the geometric structure readable at small sizes and dramatic at large.

### Times New Roman — Literary counterpoint — body paragraphs, quotes, editorial text. The intentional clash: a contemporary geometric sans for headlines, a 1930s book serif for body. The serif makes long reads feel like a printed catalog page rather than a SaaS dashboard. ss12 is active, likely for old-style figures and ligatures. · `--font-times-new-roman`
- **Substitute:** Source Serif Pro, EB Garamond, or PT Serif
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1.20–1.39
- **Letter spacing:** -0.03em at 14px, -0.02em at 16–18px
- **OpenType features:** `"ss12" on`
- **Role:** Literary counterpoint — body paragraphs, quotes, editorial text. The intentional clash: a contemporary geometric sans for headlines, a 1930s book serif for body. The serif makes long reads feel like a printed catalog page rather than a SaaS dashboard. ss12 is active, likely for old-style figures and ligatures.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.39 | 0.096px | `--text-caption` |
| body-sm | 14px | 1.39 | -0.21px | `--text-body-sm` |
| body | 16px | 1.39 | -0.32px | `--text-body` |
| body-lg | 18px | 1.39 | -0.36px | `--text-body-lg` |
| subheading | 24px | 1.16 | -0.48px | `--text-subheading` |
| heading-sm | 28px | 1.13 | -0.56px | `--text-heading-sm` |
| heading | 64px | 1 | -1.28px | `--text-heading` |
| display | 142px | 0.9 | -2.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 5px |
| pills | 999px |
| footer | 40px |
| buttons | 5px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 18-25px
- **Element gap:** 15-30px

## Components

### Green Filled Action Button
**Role:** Primary conversion — the 'try now' entry point in the nav

Moss Green (#38744d) fill, white (#ffffff) text, Control Upright 14px weight 400, letter-spacing -0.21px, 5px radius, 8px vertical / 18px horizontal padding. The green is the only saturated color in the entire interface, so this button is always the loudest object on the page. No hover state needed — the green is already committed.

### Outlined Nav Button
**Role:** Secondary nav action — 'login' in the header

Transparent fill, Stone (#908f8e) 1px border, #000000 text, 5px radius, 8px vertical / 18px horizontal padding. Sits to the left of the green action; its quiet neutrality makes the green feel intentional rather than decorative.

### Pill Tag
**Role:** Label marker for referenced content — 'related', 'reference'

Signal Cyan (#00aaff) background, white text, 999px radius, Control Upright 12px, 4px vertical / 12px horizontal padding. Functions like a Post-it stuck to a clipped image. The cyan against monochrome gives the tag the same weight as a hand-drawn annotation.

### Text Note Card
**Role:** Quoted or saved text content, displayed as a clipped excerpt

Ice Wash (#e0f5ff) or Mint Whisper (#cbffa6) background, #000000 text, Control Upright 14–16px, 18–25px padding, 5px radius. No border, no shadow — the colored fill alone separates it from the canvas. Sometimes contains a Pill Tag at the bottom.

### Image Collage Card
**Role:** Saved visual content — photography, screenshots, prints

White or Paper (#ffffff) surface, Fog (#a29e9c) 1px border, 5px radius, 18px padding around an image fill. Cards are placed at slight offsets and rotations in the collage, not aligned to a grid — the overlap is the signature.

### Navigation Bar
**Role:** Site-wide header — logo left, actions right

Transparent background, 50px padding top, 15px gap between logo and actions. Logo is a small organic bird/leaf mark + 'sublime' wordmark in Control Upright 16px. Actions sit flush right: outlined login button, then green action button, separated by 10px.

### Display Headline
**Role:** Hero and section anchor text

Control Upright 142px (hero) or 64px (section), weight 400, line-height 0.90–1.00, letter-spacing -2.84px at 142px / -1.28px at 64px. Color is Pure Black (#000000). The line-height under 1.0 is critical — it allows the text to feel like a physical object sitting on the page, not floating text in space.

### Quote Block
**Role:** Standalone editorial quote — the 'wtf is a knowledge worker' section

Centered, Stone (#908f8e) text, Control Upright 28px weight 400, line-height 1.13, 200px+ vertical padding above and below. The generous padding makes the quote feel like a wall plaque, not body copy.

### Green Inline Text Block
**Role:** Highlighted body excerpt — the Björk quote card

Moss Green (#38744d) text on Paper (#ffffff) background, Control Upright 14px, left-aligned within a 5px-radius container with no fill. Functions as a pulled quote — the color is the emphasis, no box needed.

### Footer Surface
**Role:** Site footer container

Bone (#efefef) or Paper (#ffffff) background, 40px top-radius on the top edge (container has a curved upper boundary like a stage lip), 25px padding, Control Utright 14px in Fog (#a29e9c).

### Media Card with Play Overlay
**Role:** Video or interactive content preview

Image fill inside a Fog (#a29e9c) 1px border, 5px radius container. Play button is a small circular icon in Pure Black (#000000) centered on the image. No background tint — the media IS the card.

## Do's and Don'ts

### Do
- Use Control Upright at weight 400 for all UI text — the single-weight system means size and color do the hierarchy work, not font weight
- Set display headlines (64px+) to line-height 0.90–1.00 so text feels like a physical object, not a text block
- Use Moss Green (#38744d) for exactly one element per view — the moment a second green appears, the accent stops reading as accent
- Keep page background at Paper (#ffffff) and let Ice Wash (#e0f5ff) or Mint Whisper (#cbffa6) carry the only color in content areas
- Use 999px radius for all tags and pill markers, 5px for all functional buttons — the radius split is a system, not a choice per element
- Let image cards overlap and rotate slightly in collages — strict grid alignment destroys the editorial feel
- Reserve 142px for hero display only; section headings max at 64px to maintain the size gap that makes the hero feel monumental

### Don't
- Don't introduce additional font weights for Control Upright — the system runs on weight 400 plus extreme size contrast
- Don't use Times New Roman for UI controls, nav, or buttons — it is for body and quotes only, the clash with Control Upright is the point
- Don't add drop shadows to cards — the surface palette (Paper → Bone → Ice Wash) provides elevation through color, not shadow
- Don't pair Moss Green with Signal Cyan on the same element — the green and cyan are the only two saturated colors and must never compete
- Don't use border-radius values between 5px and 999px on standard components — the system jumps from crisp (5px) to fully round (999px) with nothing in between
- Don't right-align or left-align display headlines — they are always centered to hold the page's vertical axis
- Don't fill large areas with Signal Cyan — it lives only in pill tags and inline highlights; a cyan background block would break the monochrome discipline

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the gallery wall |
| 1 | Bone | `#efefef` | Elevated card surfaces, button fills, subtle separation |
| 2 | Ice Wash | `#e0f5ff` | Cool content card wash — quotes, text notes, reference cards |
| 3 | Mint Whisper | `#cbffa6` | Warm highlight wash — accent card surfaces, emphasis zones |

## Elevation

No drop shadows. Elevation is communicated entirely through surface color steps (Paper → Bone → Ice Wash → Mint Whisper) and hairline borders in Fog (#a29e9c). The only visual depth cue is the stacking of off-white surfaces and the occasional colored wash. This keeps the interface feeling like a flat gallery wall — objects sit ON the wall, not above it.

## Imagery

Imagery is collected, not illustrated. The signature element is a hyperreal 3D render — moss-covered stone formations physically sculpting the word 'sublime', placed as a full-bleed hero object rather than a background. Supporting visuals lean editorial-archive: vintage magazine clippings, art prints, Polaroid-style portraits, and nature photography (butterflies, botanical studies, hands at work). Cards hold these images at slight rotation and overlap, creating a scrapbook or mood-board density rather than grid alignment. A monarch butterfly with a file label ('headintheclouds.txt') recurs as a signature motif — organic, slightly surreal, digitally composited. The overall treatment: objects feel physically placed on the white page, not displayed in frames. No lifestyle photography, no staged people shots — the content IS the object, isolated and centered. The logo mark is a small organic bird/leaf silhouette, hand-drawn line weight, monochrome.

## Layout

Centered, max-width 1200px page model. Hero is a centered monumental headline (142px Control Upright) stacked above a 3D-rendered sculptural object that spans the full content width — text and image share the viewport, not a split column. Section rhythm alternates between generous vertical breathing (200px+ between sections) and dense collage moments where multiple cards overlap at slight rotations. Content arrangement is asymmetric z-pattern: centered quote blocks, then scattered card clusters, then a feature section with text-left/visual-right but with the visual offset above and below the text boundary. Grids are loose — card clusters use 2-4 columns but cards break alignment intentionally. Density is predominantly spacious (60% white space by area) with two concentrated collage zones. Navigation is a single thin top bar: logo left, two action buttons right, no mega-menu, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Pure Black) or #181816 (Graphite for headings)
- background: #ffffff (Paper)
- border: #a29e9c (Fog) or #908f8e (Stone for buttons)
- accent: #38744d (Moss Green) for the single action element per view
- tag: #00aaff (Signal Cyan) for pill labels only
- surface wash: #e0f5ff (Ice Wash) or #cbffa6 (Mint Whisper) for content card backgrounds
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: white (#ffffff) background. Headline 'the knowledge tool that sparks creativity' at 142px Control Upright weight 400, color #000000, letter-spacing -2.84px, line-height 0.90, centered. Below: a full-width 3D-rendered image of mossy stone formations. Top-right nav with an outlined 'login' button (transparent fill, #908f8e 1px border, 5px radius, 8px/18px padding) and a green 'try now' button (#38744d fill, white text, 5px radius, 8px/18px padding, Control Upright 14px).

2. Create a quote section: white (#ffffff) background, 120px vertical padding. Centered text in Control Upright 28px weight 400, color #908f8e, line-height 1.13. No border, no card — the whitespace is the container.

3. Create a text note card: Ice Wash (#e0f5ff) background fill, 5px radius, 25px padding. Content in Control Upright 14px color #000000. Below the text, a Signal Cyan (#00aaff) pill tag reading 'related' — 999px radius, 4px/12px padding, white text 12px.

4. Create an image collage card cluster: 3–4 cards on a white background, each with a Fog (#a29e9c) 1px border, 5px radius, containing a photographic image. Cards overlap at 10–15px and rotate between -2° and +3°. One card has a cyan 'related' pill in the bottom-right corner.

5. Create the navigation bar: transparent background, 50px top padding, 15px gap between logo and actions. Left: small bird/leaf icon + 'sublime' wordmark in Control Upright 16px color #000000. Right: outlined 'login' button + green 'try now' button separated by 10px gap. No sticky behavior — nav scrolls with the page.

## Similar Brands

- **Are.na** — Same minimal white-canvas knowledge curation aesthetic with collage-style content blocks and the same refusal to impose grid rigidity
- **Readymag** — Same editorial display-sans-meets-serif-body tension and willingness to let a single headline dominate the viewport at extreme size
- **Cargo Collective** — Same creator-first white-wall portfolio language with overlapping content blocks and monochrome discipline
- **Pinterest** — Same visual bookmarking model with card-based content display, but Sublime's editorial typography and white space replace Pinterest's dense visual grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-moss-green: #38744d;
  --color-signal-cyan: #00aaff;
  --color-ice-wash: #e0f5ff;
  --color-mint-whisper: #cbffa6;
  --color-pure-black: #000000;
  --color-graphite: #181816;
  --color-paper: #ffffff;
  --color-bone: #efefef;
  --color-stone: #908f8e;
  --color-fog: #a29e9c;
  --color-slate: #6a6967;

  /* Typography — Font Families */
  --font-control-upright: 'Control Upright', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.39;
  --tracking-caption: 0.096px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.39;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.39;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.39;
  --tracking-body-lg: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.16;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.56px;
  --text-heading: 64px;
  --leading-heading: 1;
  --tracking-heading: -1.28px;
  --text-display: 142px;
  --leading-display: 0.9;
  --tracking-display: -2.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 18-25px;
  --element-gap: 15-30px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 5px;
  --radius-pills: 999px;
  --radius-footer: 40px;
  --radius-buttons: 5px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-bone: #efefef;
  --surface-ice-wash: #e0f5ff;
  --surface-mint-whisper: #cbffa6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-moss-green: #38744d;
  --color-signal-cyan: #00aaff;
  --color-ice-wash: #e0f5ff;
  --color-mint-whisper: #cbffa6;
  --color-pure-black: #000000;
  --color-graphite: #181816;
  --color-paper: #ffffff;
  --color-bone: #efefef;
  --color-stone: #908f8e;
  --color-fog: #a29e9c;
  --color-slate: #6a6967;

  /* Typography */
  --font-control-upright: 'Control Upright', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.39;
  --tracking-caption: 0.096px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.39;
  --tracking-body-sm: -0.21px;
  --text-body: 16px;
  --leading-body: 1.39;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.39;
  --tracking-body-lg: -0.36px;
  --text-subheading: 24px;
  --leading-subheading: 1.16;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.56px;
  --text-heading: 64px;
  --leading-heading: 1;
  --tracking-heading: -1.28px;
  --text-display: 142px;
  --leading-display: 0.9;
  --tracking-display: -2.84px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-160: 160px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 999px;
}
```
