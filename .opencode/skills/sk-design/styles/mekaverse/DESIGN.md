# MekaVerse — Style Reference
> monochrome gallery for digital artifacts — a pure black void where a rendered world hangs like a museum piece, and all UI is white ink on matte black glass.

**Theme:** dark

MekaVerse is a cinematic web3 game portal where the interface dissolves and the rendered world takes the stage. The entire UI is a monochrome shell — pure black canvas, white type, single charcoal button — built to frame massive full-bleed 3D artwork without competing with it. Typography does almost all the work: a single custom geometric sans (Roobert) stacked at extreme sizes with aggressive negative line-height for hero titles, and a quiet monospaced face (GT America Mono) whispering UI chrome in 10–12px. Surfaces are flat — no shadows, no gradients, no chromatic accent — the game art provides all color and depth. Every chrome element is featherweight: hairline 1px borders, 2px corner radii on interactive controls, and text-only hover states. The system reads less like a website and more like a gallery wall where the 3D world is the only object in the room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, image overlays, nav background — pure black lets full-bleed 3D renders carry every chromatic moment while UI chrome disappears into the background |
| Bone | `#ffffff` | `--color-bone` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Charcoal | `#444345` | `--color-charcoal` | Filled action buttons (Explore, Connect Wallet) and the one elevated surface level above the void — a soft dark step that reads as pressed-in rather than raised, keeping the flat-gallery feel |
| Frost | `#e2e2e2` | `--color-frost` | Hairline borders, divider lines, subtle structural edges — visible only where it separates two dark surfaces or wraps a control |
| Ash | `#b8bab9` | `--color-ash` | Subtle surface tone for inactive UI blocks and muted containers — sits between Void and Bone, used sparingly to indicate a non-default resting state |

## Tokens — Typography

### Roobert — All display, hero, and heading type. A single geometric grotesque used at extreme sizes — 80px for hero titles with line-height 0.78 produces a tightly stacked monumental mark rather than a flowing headline. The choice to render a custom display face at weight 400 (not 700) is the signature: the type whispers authority rather than shouting it. Substitute: Inter at matching weights if Roobert is unavailable. · `--font-roobert`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 26px, 30px, 80px
- **Line height:** 0.78 (hero), 1.00 (sub), 1.15 (body)
- **Letter spacing:** normal
- **OpenType features:** `"liga" 0`
- **Role:** All display, hero, and heading type. A single geometric grotesque used at extreme sizes — 80px for hero titles with line-height 0.78 produces a tightly stacked monumental mark rather than a flowing headline. The choice to render a custom display face at weight 400 (not 700) is the signature: the type whispers authority rather than shouting it. Substitute: Inter at matching weights if Roobert is unavailable.

### GT America Mono — All chrome, nav, micro-labels, and link text. The monospaced face is deliberately anti-display — it reads as system instrumentation rather than editorial design, which keeps the UI subordinate to the 3D world. Tracking at -0.02em tightens the mono rhythm for a quieter presence at 10–12px. Substitute: JetBrains Mono at matching weight. · `--font-gt-america-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 10px, 12px
- **Line height:** 1.00 (nav), 1.30 (body micro)
- **Letter spacing:** -0.0200em
- **Role:** All chrome, nav, micro-labels, and link text. The monospaced face is deliberately anti-display — it reads as system instrumentation rather than editorial design, which keeps the UI subordinate to the 3D world. Tracking at -0.02em tightens the mono rhythm for a quieter presence at 10–12px. Substitute: JetBrains Mono at matching weight.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | -0.2px | `--text-caption` |
| heading-sm | 26px | 1.15 | — | `--text-heading-sm` |
| heading | 30px | 1 | — | `--text-heading` |
| display | 80px | 0.78 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 116 | 116px | `--spacing-116` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2px |
| cards | 10px |
| buttons | 2px |
| containers | 20px |

### Layout

- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Sticky transparent header overlaid on full-bleed artwork

Transparent background with 1px Frost (#e2e2e2) bottom border at ~10% opacity, logo left, nav links centered, Connect Wallet right. Height driven by content (~40px), sits at top:0 over rendered scenes. Nav items use GT America Mono 12px, white, with 25px horizontal padding and 7px gap between links.

### Connect Wallet Button
**Role:** Primary persistent action in the nav

Charcoal (#444345) filled button, 2px radius, GT America Mono 10–12px uppercase, Bone (#ffffff) text, ~10px 20px padding, 1px Frost border optional. Reads as a quiet terminal button rather than a marketing CTA.

### Explore Action Button
**Role:** Hero call-to-action below stacked display title

Charcoal (#444345) fill, 2px radius, 1px Frost (#e2e2e2) border, GT America Mono 10–12px label, Bone text. Sits flush-left beneath the hero headline with 20px top margin. Deliberately understated — the artwork above it is the real hero.

### Hero Stacked Title
**Role:** Section title overlaid on full-bleed rendered art

Three lines of Roobert 80px / weight 400 / line-height 0.78, Bone (#ffffff), left-aligned with generous left margin (~60–80px). Each line underlined by a 1px Frost hairline that extends across roughly 30% of the title width — a distinguishing mark, not a generic divider. Letter-spacing 0; the tight line-height creates the stacked monumental effect.

### Underline Mark
**Role:** Signature horizontal rule beneath display titles

1px tall Frost (#e2e2e2) line positioned directly under each line of stacked hero text, extending from the left edge of the text to approximately the midpoint of the longest line. This is a recurring brand device, not a generic underline.

### Nav Link
**Role:** Header navigation item

GT America Mono 12px, -0.02em tracking, Bone text, no underline at rest. 25px horizontal padding, 3–7px gap to neighbor. Hover state: 1px Frost bottom border appears without shifting layout.

### Logo Lockup
**Role:** Brand identifier in nav

MekaVerse wordmark with a small geometric glyph to the left (diamond/cross mark). White on transparent, sits at top-left of nav with 25px left padding. ~20px height.

### Art Frame
**Role:** Full-bleed rendered artwork container

No padding, no border, no shadow — the rendered 3D scene fills the viewport edge-to-edge. Aspect ratio is free per section; the UI is simply laid on top with absolute positioning. This is the design system's central content primitive.

### Section Container
**Role:** Wraps overlaid text or interactive content over an art frame

Transparent background, no border, padded from viewport edges (20–30px). Content is positioned with absolute or flex alignment and never receives its own card treatment — it floats over the art.

### Subtitle Text
**Role:** Secondary headline or label under a hero title

Roobert 30px, weight 400, line-height 1.0, Bone (#ffffff). Used for 'Season 2' style secondary marks. No underline.

### UI Caption
**Role:** Micro-labels, counters, badges, wallet indicator

GT America Mono 10px, line-height 1.0, -0.02em tracking, Bone or Frost text. Used for cart counters, wallet status pills, and any 10px-or-smaller metadata.

## Do's and Don'ts

### Do
- Use #000000 as the page canvas beneath every full-bleed artwork and let renders carry all color and light
- Set hero titles in Roobert 80px weight 400 with line-height 0.78 — the tight stacking is the signature, not an accident
- Reserve #ffffff for type and high-contrast borders; never use it as a fill surface
- Use GT America Mono 10–12px with -0.02em tracking for all chrome, nav, and micro-labels
- Render buttons as 2px-radius Charcoal (#444345) fills with 1px Frost border — pressed-in, never raised
- Place a 1px Frost underline mark beneath each line of stacked hero text extending to roughly 30–50% of the line width
- Let rendered artwork bleed to the viewport edge; never wrap art in a card with padding or a border

### Don't
- Do not introduce any chromatic color — the palette is monochrome by design, and one accent will shatter the gallery frame
- Do not apply box-shadow to any element; elevation is communicated only through the surface stack and hairline borders
- Do not use a system font for display copy — Roobert (or Inter substitute) at weight 400 is the voice; sans-serif heavy weights break the whisper-authority effect
- Do not give cards or containers radii larger than 20px; the 2px / 10px / 20px triad is the entire system
- Do not center-align hero titles; they are always left-aligned with the underline mark extending rightward
- Do not use line-height above 1.0 for any display-size text — the stacked monumental mark depends on aggressive negative leading
- Do not add a footer chrome pattern (links, legal text, social icons in a row) unless the design calls for it; the page ends where the art ends

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Universal page canvas behind all rendered artwork and beneath all UI |
| 1 | Charcoal | `#444345` | First elevation step — filled action buttons and inline control surfaces that need to lift off the void without casting shadow |
| 2 | Ash | `#b8bab9` | Muted panel or disabled-state surface, used only when a non-interactive block needs a visible material |

## Elevation

The design uses no shadows. Elevation is communicated exclusively through the three-step neutral surface stack (Void → Charcoal → Ash) and through 1px hairline borders in Frost. Every element should feel pressed onto the black canvas, not floating above it. Never introduce box-shadow.

## Imagery

Full-bleed 3D rendered game artwork is the entire visual language. Every section is dominated by a painted-rendered diorama — fantasy castles on green islands, icy fortresses, mecha-characters on white dunes — shown edge-to-edge with no framing. Art treatment is high-detail cinematic with deep atmospheric depth, saturated mid-tones (greens, blues, warm whites) that contrast with the black UI overlay. There is no photography, no flat illustration, no iconography beyond a small logo glyph. Icons visible are minimal: a small diamond/cross mark in the logo. The visual hierarchy is: art (100% of viewport) > display type (overlay) > chrome (corners only).

## Layout

Full-bleed cinematic scroll. Every viewport-sized section is a rendered scene extending edge-to-edge with no horizontal margins. Text and controls are absolutely positioned over the art — typically bottom-left or center-left — with generous left padding (25–80px). Sections stack vertically with 0px gap between them; the page reads as a continuous film strip of rendered worlds. Navigation is a single transparent sticky bar at the top. There are no card grids, no sidebar, no max-width content columns; the only 'columns' are the implicit left-aligned text block and the right-aligned nav. The layout is essentially: [transparent nav] → [full-bleed art + overlaid hero] → [full-bleed art + overlaid title] → [full-bleed art + overlaid title] repeated to scroll length.

## Agent Prompt Guide

## Quick Color Reference
- text: #ffffff
- background: #000000
- border: #e2e2e2
- surface elevation: #444345
- muted surface: #b8bab9
- primary action: #444345 (filled action)

## Example Component Prompts

1. **Hero Stacked Title Block** — Overlay on a full-bleed image at viewport-bottom-left. Headline at 80px Roobert weight 400, #ffffff, line-height 0.78, left-aligned with 60px left padding. Three lines stacked: each followed by a 1px #e2e2e2 underline extending to ~40% of that line's width.

2. **Transparent Top Nav** — Sticky bar, 1px #e2e2e2 bottom border at 30% opacity, 40px height. Logo lockup (white wordmark + small diamond glyph) flush-left with 25px padding. Nav links (Home / Gallery / Shop) in GT America Mono 12px, #ffffff, -0.02em tracking, 25px horizontal padding, 7px gap. Connect Wallet button (#444345 fill, #ffffff text, GT America Mono 10px, 2px radius, 1px #e2e2e2 border) flush-right.

3. **Explore Button** — #444345 background, 2px radius, 1px #e2e2e2 border, GT America Mono 12px label in #ffffff, padding 10px 20px. No shadow. Sits 20px below the hero title block, flush-left.

4. **UI Caption / Cart Counter** — GT America Mono 10px, #ffffff, line-height 1.0, -0.02em tracking. Inline with a parent nav link, 3px left margin.

5. **Section Over a Rendered Artwork** — No background, no border, no shadow. Viewport-sized <section> with a 3D render as background-image filling 100% width and height. A text block absolutely positioned at left: 60px, bottom: 80px, in Roobert 80px / weight 400 / line-height 0.78 / #ffffff, with the 1px #e2e2e2 underline marks beneath each line.

## Underline Mark System

The 1px Frost (#e2e2e2) horizontal line beneath each line of stacked display text is a brand-defining mark, not a generic underline. Rules: it sits 0–4px below the text baseline, extends from the left edge of the first glyph to roughly 30–50% of the line width, never more than 60%, and never wraps or breaks. Every display title must use it. Subtitles and body copy never do.

## The 2px Rule

The 2px border-radius is applied to every interactive control — buttons, nav pills, toggle states. This is not a default; it is an opinion. The 2px keeps corners sharp and architectural against the 3D art, where any larger radius would feel toy-like and any 0 would feel unfinished. Cards may go to 10px; large containers to 20px; nothing exceeds 20px.

## Similar Brands

- **Azuki** — Same full-bleed cinematic 3D artwork with left-aligned white display type overlaid on rendered scenes, and a transparent sticky nav
- **Doodles** — Same monochrome chrome wrapping a colorful illustrated world; UI disappears so the art is the only object in the room
- **Loot (Foundation)** — Same anti-design approach: near-zero color, tiny mono labels, oversized stacked display type, and the product itself is the visual
- **RTFKT** — Same web3 product-portal feel — black canvas, white type, rendered 3D hero scenes that dominate every viewport
- **Yuga Labs (Otherside)** — Same world-building game-portal aesthetic with full-bleed rendered dioramas and whisper-quiet UI chrome in mono type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-charcoal: #444345;
  --color-frost: #e2e2e2;
  --color-ash: #b8bab9;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: -0.2px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.15;
  --text-heading: 30px;
  --leading-heading: 1;
  --text-display: 80px;
  --leading-display: 0.78;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-116: 116px;

  /* Layout */
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-nav: 2px;
  --radius-cards: 10px;
  --radius-buttons: 2px;
  --radius-containers: 20px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-charcoal: #444345;
  --surface-ash: #b8bab9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-charcoal: #444345;
  --color-frost: #e2e2e2;
  --color-ash: #b8bab9;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: -0.2px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.15;
  --text-heading: 30px;
  --leading-heading: 1;
  --text-display: 80px;
  --leading-display: 0.78;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-116: 116px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
}
```
