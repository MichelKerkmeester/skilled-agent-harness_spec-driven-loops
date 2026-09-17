# Flayks — Style Reference
> Oversized editorial broadsheet — dark forest green page, peach ink headlines bleeding off the page edges, tiny Nohemi caption text anchoring the corners.

**Theme:** dark

Flayks is a maximalist editorial portfolio that treats every screen like a printed broadsheet: a deep forest-green canvas, oversized compressed display type that intentionally overflows the viewport, and a single warm peach tone as the dominant text and border color. The system pairs two custom typefaces — Mango Grotesque for monumental condensed headlines and Nohemi for the tiny UI chrome — creating an extreme scale contrast that defines the visual rhythm. Accents appear sparingly: coral-orange for emphasis type, lavender-violet for section labels and selected states. Surfaces are flat with a single deep shadow drop pattern on cards; 3D illustration tiles float above the canvas, slightly rotated, giving the page a tactile collage quality rather than a flat app feel.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#00381c` | `--color-forest-ink` | Page canvas, section backgrounds — deep saturated green creates the base atmosphere; the page reads as forest-green, not black, which warms the dark theme and separates this system from generic dark-mode SaaS |
| Forest Deep | `#002d16` | `--color-forest-deep` | Shadow and recessed surface tone — used in card drop-shadows and inner depth layers, the slightly darker shade of the canvas adds dimension without breaking the monochrome green field |
| Peach Cream | `#ffe0ce` | `--color-peach-cream` | Primary text, hairline borders, outlined-action strokes — the system's only near-gray warm tone; carries the majority of legibility weight and acts as the universal border color across lists, cards, and images. Outlined ghost-button stroke color |
| Bone | `#f6e9d9` | `--color-bone` | Secondary text, decorative stroke and fill accents — a slightly cooler cream for subtle differentiation from Peach Cream without breaking the warm neutrals family |
| Charcoal | `#272221` | `--color-charcoal` | Card surface, elevated panels, secondary dark surface — sits one step off pure black, warm enough to harmonize with the green canvas, used for the back-layer of illustrated artwork tiles |
| Obsidian | `#000000` | `--color-obsidian` | Deepest surface, button border, text on light card — true black reserved for max-contrast elements and neutral button outlines |
| Slate | `#2c2f34` | `--color-slate` | Neutral card surface variant for utility panels — cool-tinted alternative to Charcoal for sections that need to feel mechanical rather than warm |
| Fog | `#c3bfbc` | `--color-fog` | Muted neutral card surface — desaturated warm gray for low-emphasis panels |
| Coral Flame | `#ff8370` | `--color-coral-flame` | Display type accent, link text, emphasis headings — vivid warm orange that dominates the hero typography and section labels; against the green canvas it reads as high-energy poster ink, not a UI CTA color |
| Lavender | `#d1adff` | `--color-lavender` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Sage | `#546f57` | `--color-sage` | Body background panels, list dividers, utility surfaces — desaturated green that sits between Forest Ink and the cream text, used for secondary content blocks and list separators |
| Ultraviolet | `#2d0458` | `--color-ultraviolet` | Dramatic card surface for featured work tiles — deep saturated violet as an alternative canvas for highlight cards; high contrast with Peach Cream text |
| Indigo Depth | `#1e1779` | `--color-indigo-depth` | Accent card surface — vivid indigo for occasional card variants that need to feel different from the green field without going warm |
| Heather | `#977eac` | `--color-heather` | Muted card surface — dusty violet for low-priority cards and section dividers |
| Navy Depths | `#002a3b` | `--color-navy-depths` | Cool card surface — deep blue-teal for cards that need to break from the warm/green field with a cool note |

## Tokens — Typography

### Mango Grotesque — Display and heading — Mango Grotesque is a condensed grotesque used at near-illegible sizes (88–518px) with compressed line-height (0.80–0.85), intentionally bleeding off the viewport. The tight tracking plus compressed leading is what makes the type read as 'poster' rather than 'web headline'. Substitutes: Anton, Bebas Neue, Druk Wide for the mass, Archivo Black for smaller weights. · `--font-mango-grotesque`
- **Substitute:** Anton or Archivo Black
- **Weights:** 500, 700
- **Sizes:** 32, 40, 48, 88, 94, 97, 144, 256, 518px
- **Line height:** 0.80, 0.85, 1.00, 1.20
- **Letter spacing:** 0.0150em, 0.0200em, 0.0250em
- **Role:** Display and heading — Mango Grotesque is a condensed grotesque used at near-illegible sizes (88–518px) with compressed line-height (0.80–0.85), intentionally bleeding off the viewport. The tight tracking plus compressed leading is what makes the type read as 'poster' rather than 'web headline'. Substitutes: Anton, Bebas Neue, Druk Wide for the mass, Archivo Black for smaller weights.

### Nohemi — UI body, navigation, buttons, meta text — Nohemi runs at a deliberately tiny 14–18px with generous +0.10em tracking, a signature move that makes the UI text feel like caption furniture rather than body copy. The +10% tracking is anti-convention: most body systems tighten tracking, this loosens it to keep the small text airy and readable against the dark green. Substitutes: Inter, General Sans, Satoshi. · `--font-nohemi`
- **Substitute:** Inter or General Sans
- **Weights:** 400, 600
- **Sizes:** 14, 18px
- **Line height:** 0.85, 1.10, 1.20, 1.35
- **Letter spacing:** 0.1000em
- **Role:** UI body, navigation, buttons, meta text — Nohemi runs at a deliberately tiny 14–18px with generous +0.10em tracking, a signature move that makes the UI text feel like caption furniture rather than body copy. The +10% tracking is anti-convention: most body systems tighten tracking, this loosens it to keep the small text airy and readable against the dark green. Substitutes: Inter, General Sans, Satoshi.

### Arial — System fallback for the smallest UI metadata — 13px Arial is used purely as a safe baseline when custom fonts fail; treated as invisible utility, not a design choice. · `--font-arial`
- **Substitute:** Arial
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** System fallback for the smallest UI metadata — 13px Arial is used purely as a safe baseline when custom fonts fail; treated as invisible utility, not a design choice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body | 18px | 1.2 | 1.8px | `--text-body` |
| subheading | 32px | 1 | 0.48px | `--text-subheading` |
| heading-sm | 48px | 0.85 | 0.96px | `--text-heading-sm` |
| heading | 88px | 0.85 | 1.76px | `--text-heading` |
| heading-lg | 144px | 0.8 | 2.88px | `--text-heading-lg` |
| display | 256px | 0.8 | 5.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 29 | 29px | `--spacing-29` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 58 | 58px | `--spacing-58` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 79 | 79px | `--spacing-79` |

### Border Radius

| Element | Value |
|---------|-------|
| md | 10px |
| sm | 6px |
| pill | 900px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.01) 0px 62px 25px 0px, rgba(0, 0, 0, 0.05...` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.2) 0px 0px 112px 0px` | `--shadow-xl-2` |
| md | `rgba(0, 0, 0, 0.1) 4px -4px 12px 0px` | `--shadow-md` |
| lg | `rgba(0, 0, 0, 0.01) 21px 44px 20px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-lg` |
| xl-3 | `rgba(0, 0, 0, 0.01) 0px 262px 105px 0px, rgba(0, 0, 0, 0....` | `--shadow-xl-3` |

### Layout

- **Section gap:** 64px
- **Card padding:** 12-16px
- **Element gap:** 4-10px

## Components

### Status Bar Footer
**Role:** Persistent meta-information strip across the entire page

Fixed to the bottom edge of the viewport, full-width, transparent over the green canvas. Three zones — left: location marker (Lavender dot) + 'CURRENTLY IN TOULOUSE, FR (CET)'; center: 'AVAILABLE FOR NEW PROJECTS'; right: snowflake icon + 'CONTACT'. Nohemi 14px, weight 400, letter-spacing 0.10em, uppercase, color Peach Cream. Dot indicators use 6px circles in Lavender. No background fill, no border — the type floats directly on the Forest Ink canvas with 12–16px vertical padding.

### Wordmark Logo
**Role:** Brand identity lockup anchored top-left

Bubbly 3D-extruded 'FLAYKS' wordmark in turquoise/mint (#7df0d8 range) with cream highlights and a soft drop shadow — treated as an illustration object, not a text logotype. Pairs a glossy plastic material against the matte dark green canvas. Sits at top-left with 14px padding from the viewport edge and functions as a home link.

### Floating Illustration Tile
**Role:** Featured project artwork displayed as a physical card

Square or near-square card containing 3D-illustrated artwork (crystalline structures, sci-fi vehicles, clouds) on a bright blue sky background. Card sits on Charcoal (#272221) backing with slight rotation (-3° to +5°) for collage feel. 10px border-radius, 6px Peach Cream border, layered shadow stack: rgba(0,0,0,0.2) 0 0 112px 0 (ambient glow) + rgba(0,0,0,0.1) 4px -4px 12px 0 (directional). Width varies 240–400px. Tiles overlap or cluster asymmetrically rather than aligning to a grid.

### Ghost Action Button
**Role:** Outlined interactive trigger — the only button variant in the system

Transparent fill, 1.5–2px Peach Cream border, Nohemi 14px uppercase weight 600, letter-spacing 0.10em. 6px border-radius. Padding 10px 16px. No filled state — hover increases border weight or shifts to Coral Flame. There is no filled-button variant in this system; all CTAs are ghost-strokes against the dark canvas.

### Vertical Side Navigation
**Role:** Section-anchor list rendered as a vertical pill stack

Left-edge vertical list of section markers — 6–8px Lavender circles or rounded pills, 10px vertical gap. Active item renders as a larger filled Lavender dot or pill with Nohemi 14px label beside it. Inactive items are outline-only circles. The nav reads as a precise gauge rather than a horizontal bar — the page's primary navigation surface is a thin vertical column.

### Meta Label Tag
**Role:** Small uppercase caption for section context

Nohemi 14px, weight 400, letter-spacing 0.10em, uppercase, Peach Cream. No background, no border. Used for captions like 'I'M FÉLIX', 'UP NEXT', 'SHOWCASE OF DIVERSE WORKS'. Sits 8–16px above the element it labels. The tag is the typographic system doing the work of a section header at the smallest scale.

### Project Preview Card
**Role:** Selected-project showcase tile with shadow and border

Rectangular card on Ultraviolet (#2d0458) or Charcoal (#272221) background, 10px border-radius, 1px Peach Cream border. Multi-layer drop shadow: rgba(0,0,0,0.01) 0 62px 25px / 0.05 0 35px 21px / 0.09 0 16px 16px / 0.1 0 4px 9px. 16px internal padding. Contains Mango Grotesque title and Nohemi meta. Acts as a hard-edged container against the soft green canvas.

### Hairline Divider
**Role:** Separator line for list items and section breaks

1px Peach Cream line at full or partial width, often used inside Sage (#546f57) or dark panels. No margin on the line itself — adjacent elements supply 8–16px vertical breathing room. Functions as the structural rhythm of lists and metadata stacks.

### Oversized Headline Block
**Role:** Hero display type that bleeds off the viewport

Mango Grotesque weight 700 at 144–518px, line-height 0.80, letter-spacing 0.015–0.025em, color Coral Flame. Headline is positioned to overflow the right and/or bottom edge of the viewport — this is intentional, not a bug. The bleed creates the editorial-poster effect that defines the system's hero rhythm. Sits on Forest Ink with no container.

### Section Accent Label
**Role:** Colored eyebrow text marking section transitions

Mango Grotesque weight 500 at 32–48px, Lavender (#d1adff) or Coral Flame (#ff8370), letter-spacing 0.025em, line-height 0.85. Examples: 'SELECTED', 'PROJECTS', 'DIGI-TAL'. Acts as a visual chapter mark — bold enough to be a typographic moment, small enough not to compete with the hero headline.

### Status Dot Indicator
**Role:** Colored circular marker for live meta states

6px filled circle in Lavender (#d1adff) with a subtle 1px Peach Cream outer ring. Sits inline with Nohemi 14px caption text. Used to indicate 'live' status (current location, availability, active nav). The dot is the smallest semantic mark in the system.

## Do's and Don'ts

### Do
- Use Mango Grotesque at 88px or larger for any headline meant to carry the page; below 48px, switch to Nohemi weight 600.
- Set all Nohemi text to letter-spacing 0.10em and uppercase — the airy tracking on small text is the signature of this system.
- Use Peach Cream (#ffe0ce) as the default text and hairline border color; reserve Coral Flame and Lavender for typographic accent only, not body content.
- Keep display headlines compressed at line-height 0.80–0.85 and allow them to bleed off the viewport edge — the overflow is the point.
- Render cards on Charcoal or Ultraviolet surfaces with 10px radius and the four-layer black drop shadow stack, never flat against the green canvas.
- Anchor the status bar (location / availability / contact) to the bottom of every page; it is a persistent furniture element, not a footer block.
- Pair 3D illustration tiles with slight rotation (-5° to +5°) so they read as a collage, not a grid.

### Don't
- Do not introduce a filled button variant — all actions in this system are ghost-stroked with Peach Cream borders.
- Do not set Mango Grotesque below 32px; the compressed grotesque loses its identity at body sizes.
- Do not use white (#ffffff) text or borders; the system runs on warm Peach Cream and Bone, never neutral white.
- Do not tighten letter-spacing on Nohemi — the +0.10em tracking is what makes the tiny UI text legible against the dark green canvas.
- Do not center-align the hero headline — Flayks uses asymmetric, left-bleeding editorial composition throughout.
- Do not add gradients; the design is strictly flat color with single-direction drop shadows only.
- Do not use the violet card surfaces (#2d0458, #1e1779) for more than one tile per section — they are accent canvases, not default cards.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Forest Ink Canvas | `#00381c` | The page field — all sections and heroes sit directly on this deep green; no lighter background exists at the page level. |
| 1 | Sage Panel | `#546f57` | Body and list background panels that need a subtle lift from the canvas without breaking the green field. |
| 2 | Charcoal Card | `#272221` | Elevated cards and illustration tile backings — warm dark surface that complements the green canvas. |
| 3 | Ultraviolet Feature Card | `#2d0458` | Accent surface for featured work tiles — the only high-chroma card surface in the system. |

## Elevation

- **Floating Illustration Tile:** `rgba(0, 0, 0, 0.2) 0px 0px 112px 0px, rgba(0, 0, 0, 0.1) 4px -4px 12px 0px`
- **Project Preview Card:** `rgba(0, 0, 0, 0.01) 0px 62px 25px 0px, rgba(0, 0, 0, 0.05) 0px 35px 21px 0px, rgba(0, 0, 0, 0.09) 0px 16px 16px 0px, rgba(0, 0, 0, 0.1) 0px 4px 9px 0px`
- **Hero Feature Card:** `rgba(0, 0, 0, 0.01) 0px 262px 105px 0px, rgba(0, 0, 0, 0.05) 0px 148px 89px 0px, rgba(0, 0, 0, 0.09) 0px 66px 66px 0px, rgba(0, 0, 0, 0.1) 0px 16px 36px 0px`

## Imagery

3D illustration is the dominant visual language: glossy plastic-rendered vehicles, crystalline architectural forms, sci-fi vehicles on blue-sky backgrounds with cartoon clouds, and bubbly extruded logo marks. Tiles are square or near-square, slightly rotated, with a collage arrangement rather than a grid. Photography is absent — all visual content is either 3D render or hand-drawn/illustrated logo objects. The mint-turquoise 3D 'FLAYKS' wordmark with cream highlights establishes the material palette: high-gloss plastic, warm light, soft pastel environments. Imagery occupies roughly 30–40% of the hero viewport and clusters asymmetrically alongside the oversized typography rather than behind it.

## Layout

Full-bleed editorial composition with no max-width container — every section runs edge-to-edge against the Forest Ink canvas. The page is built in horizontal bands: hero (massive Mango Grotesque headline bleeding off the right edge + 3D illustration tile clustered bottom-left), about (asymmetric title + small Nohemi body), and a 'selected projects' section that shifts to a near-black canvas with centered Mango Grotesque section labels. Navigation is a vertical pill stack anchored to the left edge rather than a top bar; the status meta bar is pinned to the bottom of the viewport and persists across all sections. Vertical rhythm comes from oversized display type and clustered 3D tiles rather than from a column grid — the layout reads as a printed broadsheet, not a SaaS app. Section gaps are 60–100px but the giant typography makes the actual visual gaps feel larger.

## Agent Prompt Guide

## Quick Color Reference
- Text (primary): #ffe0ce (Peach Cream)
- Text (secondary): #f6e9d9 (Bone)
- Canvas: #00381c (Forest Ink)
- Card surface: #272221 (Charcoal) or #2d0458 (Ultraviolet)
- Accent / emphasis type: #ff8370 (Coral Flame)
- Accent / nav active / tags: #d1adff (Lavender)
- primary action: #ffe0ce (outlined action border)

## Example Component Prompts

1. **Outlined Ghost Action Button**: Transparent background, 1.5px border in #ffe0ce (Peach Cream), border-radius 6px, padding 10px 16px. Label in Nohemi weight 600, 14px, uppercase, letter-spacing 0.10em, color #ffe0ce. Hover state shifts border to #ff8370 (Coral Flame).

2. **Oversized Bleeding Headline**: Mango Grotesque weight 700 at 256px, line-height 0.80, letter-spacing 0.020em, color #ff8370 (Coral Flame). Position the text block so it overflows the right viewport edge by 10–15% — this bleed is the signature. Background is #00381c (Forest Ink) with no container.

3. **Floating 3D Illustration Tile**: 320px square card, background #272221 (Charcoal), border-radius 10px, 1px border in #ffe0ce (Peach Cream). Contains a 3D render (crystalline vehicle on blue sky) filling the card. Apply a slight rotation of -3°. Add the ambient shadow stack: rgba(0,0,0,0.2) 0 0 112px 0 plus rgba(0,0,0,0.1) 4px -4px 12px 0.

4. **Status Bar Footer Strip**: Full-width, pinned to viewport bottom, transparent over #00381c (Forest Ink). Three columns: left is a 6px #d1adff (Lavender) dot followed by Nohemi 14px uppercase weight 400, letter-spacing 0.10em, #ffe0ce, reading 'CURRENTLY IN TOULOUSE, FR (CET)'. Center column: same type, 'AVAILABLE FOR NEW PROJECTS'. Right column: a snowflake glyph + 'CONTACT'. Vertical padding 14px.

5. **Project Preview Card**: 400px wide, internal padding 16px, background #2d0458 (Ultraviolet), border-radius 10px, 1px border #ffe0ce (Peach Cream). Apply the four-layer card shadow. Title in Mango Grotesque weight 700 at 48px, line-height 0.85, color #ffe0ce. Meta line in Nohemi 14px uppercase, letter-spacing 0.10em, color #d1adff (Lavender).

## Similar Brands

- **Locomotive (locomotive.ca)** — Same editorial-portfolio treatment: oversized compressed display type that bleeds off the canvas, dark moody page tone, 3D illustration as primary visual content, asymmetric collage layout rather than grid.
- **Pentagram (pentagram.com)** — Full-bleed editorial dark canvases, paired custom typefaces with extreme scale contrast between display and body, work tiles rendered as illustrated cards floating off the page edge.
- **Active Theory (activetheory.net)** — Same maximalist agency-portfolio language: oversize condensed display headlines, 3D-rendered project tiles, single saturated accent color against a dark field, ghost-stroked navigation rather than filled buttons.
- **Gunner (gunner.io)** — Custom condensed display grotesque used at near-illegible sizes, warm peach/cream against a deep dark canvas, tiny tracked-out Nohemi-style UI text anchoring the corners of the page.
- **B-Reel (b-reel.com)** — Agency portfolio with 3D-illustrated project tiles, asymmetric collage composition, and oversized display typography that treats the viewport as a printed spread rather than a screen.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #00381c;
  --color-forest-deep: #002d16;
  --color-peach-cream: #ffe0ce;
  --color-bone: #f6e9d9;
  --color-charcoal: #272221;
  --color-obsidian: #000000;
  --color-slate: #2c2f34;
  --color-fog: #c3bfbc;
  --color-coral-flame: #ff8370;
  --color-lavender: #d1adff;
  --color-sage: #546f57;
  --color-ultraviolet: #2d0458;
  --color-indigo-depth: #1e1779;
  --color-heather: #977eac;
  --color-navy-depths: #002a3b;

  /* Typography — Font Families */
  --font-mango-grotesque: 'Mango Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nohemi: 'Nohemi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: 1.8px;
  --text-subheading: 32px;
  --leading-subheading: 1;
  --tracking-subheading: 0.48px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 0.85;
  --tracking-heading-sm: 0.96px;
  --text-heading: 88px;
  --leading-heading: 0.85;
  --tracking-heading: 1.76px;
  --text-heading-lg: 144px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: 2.88px;
  --text-display: 256px;
  --leading-display: 0.8;
  --tracking-display: 5.12px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-29: 29px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-58: 58px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-79: 79px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 12-16px;
  --element-gap: 4-10px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 900px;

  /* Named Radii */
  --radius-md: 10px;
  --radius-sm: 6px;
  --radius-pill: 900px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 62px 25px 0px, rgba(0, 0, 0, 0.05) 0px 35px 21px 0px, rgba(0, 0, 0, 0.09) 0px 16px 16px 0px, rgba(0, 0, 0, 0.1) 0px 4px 9px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.2) 0px 0px 112px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 4px -4px 12px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.01) 21px 44px 20px 0px, rgba(0, 0, 0, 0.05) 12px 25px 17px 0px, rgba(0, 0, 0, 0.09) 5px 11px 12px 0px, rgba(0, 0, 0, 0.1) 1px 3px 7px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.01) 0px 262px 105px 0px, rgba(0, 0, 0, 0.05) 0px 148px 89px 0px, rgba(0, 0, 0, 0.09) 0px 66px 66px 0px, rgba(0, 0, 0, 0.1) 0px 16px 36px 0px;

  /* Surfaces */
  --surface-forest-ink-canvas: #00381c;
  --surface-sage-panel: #546f57;
  --surface-charcoal-card: #272221;
  --surface-ultraviolet-feature-card: #2d0458;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #00381c;
  --color-forest-deep: #002d16;
  --color-peach-cream: #ffe0ce;
  --color-bone: #f6e9d9;
  --color-charcoal: #272221;
  --color-obsidian: #000000;
  --color-slate: #2c2f34;
  --color-fog: #c3bfbc;
  --color-coral-flame: #ff8370;
  --color-lavender: #d1adff;
  --color-sage: #546f57;
  --color-ultraviolet: #2d0458;
  --color-indigo-depth: #1e1779;
  --color-heather: #977eac;
  --color-navy-depths: #002a3b;

  /* Typography */
  --font-mango-grotesque: 'Mango Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nohemi: 'Nohemi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: 1.8px;
  --text-subheading: 32px;
  --leading-subheading: 1;
  --tracking-subheading: 0.48px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 0.85;
  --tracking-heading-sm: 0.96px;
  --text-heading: 88px;
  --leading-heading: 0.85;
  --tracking-heading: 1.76px;
  --text-heading-lg: 144px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: 2.88px;
  --text-display: 256px;
  --leading-display: 0.8;
  --tracking-display: 5.12px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-29: 29px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-58: 58px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-79: 79px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 900px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 62px 25px 0px, rgba(0, 0, 0, 0.05) 0px 35px 21px 0px, rgba(0, 0, 0, 0.09) 0px 16px 16px 0px, rgba(0, 0, 0, 0.1) 0px 4px 9px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.2) 0px 0px 112px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 4px -4px 12px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.01) 21px 44px 20px 0px, rgba(0, 0, 0, 0.05) 12px 25px 17px 0px, rgba(0, 0, 0, 0.09) 5px 11px 12px 0px, rgba(0, 0, 0, 0.1) 1px 3px 7px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.01) 0px 262px 105px 0px, rgba(0, 0, 0, 0.05) 0px 148px 89px 0px, rgba(0, 0, 0, 0.09) 0px 66px 66px 0px, rgba(0, 0, 0, 0.1) 0px 16px 36px 0px;
}
```
