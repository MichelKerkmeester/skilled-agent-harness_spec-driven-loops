# Foundry — Style Reference
> orange-lit type cathedral — a black room where enormous illuminated letterforms hang as exhibits and the only guide rails are pale wireframe borders and one neon marker color.

**Theme:** dark

Foundry is a type foundry presented as a dark workbench where the products are also the interface. A near-black canvas (#121212) hosts sharp-cornered UI chrome built almost entirely from monospaced text and hairline borders, giving the whole site the feel of a developer's terminal crossed with a gallery wall. The only chromatic voice is a vivid orange (#ff4d00) used as a structural accent on the logo, outlined action borders, and selective highlights — never as a filled button background, which keeps the accent feeling like a warning lamp or marker stroke rather than a brand paint job. Every screen is a specimen: massive custom display faces (90–234px) dominate the viewport, the UI recedes around them, and even sidebar items are styled as labeled tags. Compact spacing, near-zero radii (2.8px), and uppercase monospace metadata reinforce a precise, industrial, no-decoration sensibility — decoration lives entirely inside the typefaces themselves.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff4d00` | `--color-ember-orange` | Orange accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Foundry Black | `#121212` | `--color-foundry-black` | Page background, section canvas, main surface — the dominant ground that lets white type and orange accents read as luminous |
| Chalk White | `#e2e8f0` | `--color-chalk-white` | Hairline borders, nav rules, link underlines, tag outlines — the wireframe color that constructs the entire UI scaffold |
| Bone White | `#efefef` | `--color-bone-white` | Primary body and UI text, icon strokes, button text, secondary surface fills — the readable text color and the inverse fill used for emphasized controls |
| Soot | `#3a3a3a` | `--color-soot` | Low-contrast structural borders, subtle dividers between stacked sections — the quietest rule line, only visible against the bone-white inverted surfaces |
| Ash | `#747474` | `--color-ash` | Muted helper text, inactive labels, secondary metadata — recedes so the monospace chrome can carry hierarchy without competing with display type |

## Tokens — Typography

### JetBrains Mono — The operating-system font: drives the sidebar navigation, font-spec labels, button text, metadata strips, and body copy. Treated as a UI element itself — uppercase, tracked-out (0.04–0.06em) for labels, tight (-0.02em) for body. Its monospaced geometry is the visual signature of every chrome component. · `--font-jetbrains-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 18px
- **Line height:** 1.14, 1.29, 1.30, 1.32, 1.40, 1.50
- **Letter spacing:** -0.02em, 0.01em, 0.04em, 0.06em
- **Role:** The operating-system font: drives the sidebar navigation, font-spec labels, button text, metadata strips, and body copy. Treated as a UI element itself — uppercase, tracked-out (0.04–0.06em) for labels, tight (-0.02em) for body. Its monospaced geometry is the visual signature of every chrome component.

### Inter — Secondary text voice for longer-form copy blocks and supporting paragraphs that need a less technical rhythm than the monospace. Appears sparingly so the monospace remains the dominant signal. · `--font-inter`
- **Substitute:** Inter, system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1.29, 1.30, 1.50
- **Letter spacing:** normal
- **Role:** Secondary text voice for longer-form copy blocks and supporting paragraphs that need a less technical rhythm than the monospace. Appears sparingly so the monospace remains the dominant signal.

### Basement Grotesque, FFFLAUTA, B-Mecha, Bunker, Caniche, Carpenter, Curia, Adhesion, Trovador, XER0, Blob — Display specimens — the products. Each fills a full-width section at monumental size, set tight (0.95–1.10 leading) with a hair of positive tracking. An AI agent should treat these as content blocks to be authored, not as system fonts to be re-created; substitute with the user's own display typefaces at proportional sizes. · `--font-basement-grotesque-ffflauta-b-mecha-bunker-caniche-carpenter-curia-adhesion-trovador-xer0-blob`
- **Weights:** 400 (each is a single-weight specimen)
- **Sizes:** 90px (FFFLAUTA) → 120px (Basement Grotesque, B-Mecha) → 156–234px (the rest)
- **Line height:** 0.95–1.20
- **Letter spacing:** 0.01em
- **Role:** Display specimens — the products. Each fills a full-width section at monumental size, set tight (0.95–1.10 leading) with a hair of positive tracking. An AI agent should treat these as content blocks to be authored, not as system fonts to be re-created; substitute with the user's own display typefaces at proportional sizes.

### FFFLAUTA 400 — FFFLAUTA 400 — detected in extracted data but not described by AI · `--font-ffflauta-400`
- **Weights:** 400
- **Sizes:** 90px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** FFFLAUTA 400 — detected in extracted data but not described by AI

### Basement Grotesque Black Expanded — Basement Grotesque Black Expanded — detected in extracted data but not described by AI · `--font-basement-grotesque-black-expanded`
- **Weights:** 400
- **Sizes:** 120px
- **Line height:** 0.95
- **Letter spacing:** 0.01
- **Role:** Basement Grotesque Black Expanded — detected in extracted data but not described by AI

### Mecha Regular — Mecha Regular — detected in extracted data but not described by AI · `--font-mecha-regular`
- **Weights:** 400
- **Sizes:** 120px
- **Line height:** 1.2
- **Letter spacing:** 0.01
- **Role:** Mecha Regular — detected in extracted data but not described by AI

### Curia Regular — Curia Regular — detected in extracted data but not described by AI · `--font-curia-regular`
- **Weights:** 400
- **Sizes:** 156px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** Curia Regular — detected in extracted data but not described by AI

### Adhesion Regular — Adhesion Regular — detected in extracted data but not described by AI · `--font-adhesion-regular`
- **Weights:** 400
- **Sizes:** 164px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** Adhesion Regular — detected in extracted data but not described by AI

### Carpenter Regular — Carpenter Regular — detected in extracted data but not described by AI · `--font-carpenter-regular`
- **Weights:** 400
- **Sizes:** 169px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** Carpenter Regular — detected in extracted data but not described by AI

### Bunker Regular — Bunker Regular — detected in extracted data but not described by AI · `--font-bunker-regular`
- **Weights:** 400
- **Sizes:** 185px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** Bunker Regular — detected in extracted data but not described by AI

### Trovador Regular — Trovador Regular — detected in extracted data but not described by AI · `--font-trovador-regular`
- **Weights:** 400
- **Sizes:** 198px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** Trovador Regular — detected in extracted data but not described by AI

### XER0 Regular — XER0 Regular — detected in extracted data but not described by AI · `--font-xer0-regular`
- **Weights:** 400
- **Sizes:** 198px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** XER0 Regular — detected in extracted data but not described by AI

### Caniche Regular — Caniche Regular — detected in extracted data but not described by AI · `--font-caniche-regular`
- **Weights:** 400
- **Sizes:** 203px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** Caniche Regular — detected in extracted data but not described by AI

### Blob Regular — Blob Regular — detected in extracted data but not described by AI · `--font-blob-regular`
- **Weights:** 400
- **Sizes:** 234px
- **Line height:** 1.1
- **Letter spacing:** 0.01
- **Role:** Blob Regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.04px | `--text-caption` |
| body-sm | 14px | 1.29 | -0.02px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.32 | — | `--text-subheading` |
| display | 120px | 0.95 | 0.01px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2.8px |
| tags | 2.8px |
| cards | 8px |
| buttons | 2.8px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 15px
- **Element gap:** 8px

## Components

### Sidebar Nav Item (Tag)
**Role:** Navigation entry styled as a labeled tag, the primary wayfinding element

Inverted surface fill (#efefef) with #121212 text; 2.8px radius; ~10px vertical padding and 6–10px horizontal padding; 12–14px JetBrains Mono 400, uppercase, letter-spacing 0.04em. When a count badge appears (e.g. "10"), the number is a separate inline pill in the same color, no border separator.

### Sidebar Section Header
**Role:** Group label above nav tag clusters

No background; 12–14px JetBrains Mono 700 (or 400 with +0.06em tracking), uppercase, #efefef; preceded by a small geometric marker (L-shaped bracket in #efefef).

### Outlined Action Button (BUY NOW)
**Role:** Primary commercial action

Transparent fill; 1px solid #ff4d00 border; 2.8px radius; 10px 15px padding; 12–14px JetBrains Mono 400, uppercase, letter-spacing 0.04em, #ff4d00 text. The orange outline is the entire signal — no fill, no shadow.

### Ghost Action Button (EXPLORE)
**Role:** Secondary action paired with the outlined CTA

Transparent fill; 1px solid #efefef border; 2.8px radius; 10px 15px padding; 12–14px JetBrains Mono 400, uppercase, #efefef text and border.

### Font Specimen Card
**Role:** Showcase block for a single typeface in the catalog grid

Full-width band on #121212 canvas, separated by a 1px #e2e8f0 hairline at the top. Interior: a top metadata strip (font name on the left, "N STYLES / N HEIGHTS" plus a glyph-size toggle and mode toggle in the center, action buttons on the right), then a generous vertical gap to the display specimen set at 90–234px. No card background, no shadow — the hairline border IS the card chrome.

### Metadata Strip
**Role:** Top utility bar of each specimen section

Single horizontal row, 12–14px JetBrains Mono 400 uppercase, #efefef text; 1px #e2e8f0 bottom border. Houses: section name (left), type stats and toggles (center), action buttons (right). 10–15px vertical padding.

### Ticker / Announcement Bar
**Role:** Scrolling top-of-page notification

1px tall hairline border in #e2e8f0, dark fill; inline monospaced text scrolling horizontally; small geometric triangle markers as separators between phrases.

### Logo Mark
**Role:** Brand identifier, top-left, persistent across screens

Two-line stacked wordmark in Basement Grotesque (or equivalent heavy display face) set in #ff4d00 — "BASEMENT" over "FOUNDRY." The period is part of the mark. Orange against black is the loudest single element on any screen.

### Body Copy Block
**Role:** Long-form descriptive paragraph

Inter 400, 14–16px, line-height 1.5, #efefef; sits below a specimen as a quiet explanatory footnote. Constrained to roughly 40–50ch column width.

### Glyph Toggle / Mode Pill
**Role:** Small control switching the displayed character set or display mode

Inline JetBrains Mono 12–14px, uppercase; current state shown with a small icon glyph (Aa, ¶, etc.) rather than a colored fill; sits inside the metadata strip.

## Do's and Don'ts

### Do
- Use JetBrains Mono 400 for all UI chrome — nav, labels, metadata, buttons, section headers. It is the operating-system font.
- Set sidebar items and button text in uppercase with 0.04em letter-spacing; reserve tight tracking (-0.02em) for running body text only.
- Use the orange #ff4d00 only as a 1px outlined border or as a text accent — never as a filled background. The outlined-buy-now button is the canonical use.
- Keep all corners sharp: 2.8px for nav, tags, and buttons; 8px only for larger card containers. Nothing round.
- Build depth through color inversion (bone-white panel on near-black canvas) and hairline #e2e8f0 borders — never through drop shadows.
- Let one display typeface fill the full width of its section at 90–234px; treat the specimen area as an exhibition, not a constrained content card.
- Pair every action button with a ghost companion (e.g. outlined orange BUY NEXT to ghost white EXPLORE) in the same row.

### Don't
- Don't fill buttons or surfaces with #ff4d00 — it is exclusively a stroke and text accent.
- Don't introduce new accent colors; the palette is monochromatic neutrals plus exactly one chromatic voice.
- Don't apply drop shadows or heavy elevation to any component; the system is flat by design.
- Don't set body copy or metadata in the display typefaces — those are specimen content, not UI fonts.
- Don't use radii larger than 8px anywhere; the 2.8px tag radius is a signature and any rounding larger breaks the blueprint feel.
- Don't use Inter for labels, buttons, or metadata — reserve it for paragraph-length supporting copy only.
- Don't center the page layout: the sidebar is fixed-left, content is left-aligned within its column, and the canvas extends right.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#121212` | Full-bleed page background — the dark room the type hangs in |
| 1 | Inverted Surface | `#efefef` | Bone-white panels used for featured inversions and emphasized controls; rare but high-contrast |

## Elevation

The design intentionally avoids drop shadows. Depth is communicated through color inversion (dark canvas vs bone-white panels) and hairline borders, not through shadow stacks — a flat, blueprint-like surface treatment that keeps focus on the type itself.

## Imagery

Imagery is entirely typographic. The hero is a large 3D graffiti-style rendering of a display face in orange-on-black that fills the viewport; subsequent sections are full-bleed type specimens at 90–234px. No photography, no illustration, no icons beyond small geometric monospace markers (L-bracket section leaders, triangle separators in the ticker, Aa glyph-toggle icons). The visual language is type-as-image, with the only texture coming from the layered 3D extrusion of the hero specimen.

## Layout

Fixed-left sidebar (≈200px) holding all primary navigation as labeled tags grouped by section, with a persistent logo at the top and a small footer block (legal, social, support links). The main content area extends right to a max-width of ~1440px, starting with a full-bleed ticker bar, then a hero section that occupies the full content width with a massive specimen and a quiet body-copy footnote, then a vertical stack of full-width specimen cards separated by 1px hairline rules. No centered hero, no alternating light/dark bands — the canvas stays near-black throughout and emphasis comes from occasional inverted bone-white surfaces and the orange accent. Spacing is compact: ~64px between major sections, ~8–10px between chrome elements.

## Agent Prompt Guide

Quick Color Reference
- text (primary): #efefef
- text (muted/helper): #747474
- background (canvas): #121212
- border (hairline): #e2e8f0
- accent: #ff4d00
- primary action: #efefef (filled action)

3–5 Example Component Prompts
1. **Sidebar tag nav item**: Inverted #efefef fill, #121212 text, 2.8px radius, 10px 10px padding. Label in JetBrains Mono 14px, weight 400, uppercase, letter-spacing 0.04em. If a count follows (e.g. "BUNKER 4"), render the number as inline text on the same line, no separator.

2. Create a Primary Action Button: #efefef background, #747474 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Ghost secondary action button**: Transparent fill, 1px solid #efefef border, 2.8px radius, 10px 15px padding. Text in JetBrains Mono 12px, weight 400, uppercase, letter-spacing 0.04em, color #efefef. Label "EXPLORE".

4. **Font specimen card**: Full-width band on #121212 canvas with a 1px #e2e8f0 top border. Top metadata strip: font name in JetBrains Mono 12px uppercase #efefef on the left, "N STYLES / N HEIGHTS" + glyph/mode toggles centered, action buttons on the right. Below, a 60–80px vertical gap, then a single display specimen set full-width at 120–200px in #efefef.

5. **Top ticker bar**: Full-bleed, 1px tall, #121212 background, 1px #e2e8f0 bottom border. Scrolling inline text in JetBrains Mono 12px uppercase, #efefef, separated by small triangle markers.

## Typeface-as-Content Rule

Every display face in the catalog (Basement Grotesque, Bunker, Curia, Adhesion, Trovador, XER0, etc.) is content, not system typography. An AI agent reproducing a page should pick one of these custom families to fill the hero/specimen area, but the rest of the UI must always fall back to JetBrains Mono (UI) and Inter (long body copy). Never use a specimen face for nav, buttons, labels, or metadata.

## Similar Brands

- **Dinamo Font Gauntlet (ABC Dinamo)** — Same product-as-interface logic — the homepage is a wall of massive type specimens, dark canvas, monospaced chrome
- **OH no Type** — Type foundry site with fixed left sidebar, dark background, and oversized display specimens filling the viewport with minimal UI decoration
- **Grilli Type** — Dark-mode catalog site that treats specimen type as hero content and keeps UI chrome tight and monospaced
- **Pangram Pangram** — Bold display-first type foundry with sharp corners, dark canvas, and minimal-color UI letting the typefaces do all the visual work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff4d00;
  --color-foundry-black: #121212;
  --color-chalk-white: #e2e8f0;
  --color-bone-white: #efefef;
  --color-soot: #3a3a3a;
  --color-ash: #747474;

  /* Typography — Font Families */
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basement-grotesque-ffflauta-b-mecha-bunker-caniche-carpenter-curia-adhesion-trovador-xer0-blob: 'Basement Grotesque, FFFLAUTA, B-Mecha, Bunker, Caniche, Carpenter, Curia, Adhesion, Trovador, XER0, Blob', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ffflauta-400: 'FFFLAUTA 400', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basement-grotesque-black-expanded: 'Basement Grotesque Black Expanded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mecha-regular: 'Mecha Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-curia-regular: 'Curia Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-adhesion-regular: 'Adhesion Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-carpenter-regular: 'Carpenter Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bunker-regular: 'Bunker Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-trovador-regular: 'Trovador Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-xer0-regular: 'XER0 Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caniche-regular: 'Caniche Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-blob-regular: 'Blob Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.04px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.02px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.32;
  --text-display: 120px;
  --leading-display: 0.95;
  --tracking-display: 0.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 15px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2.8px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-nav: 2.8px;
  --radius-tags: 2.8px;
  --radius-cards: 8px;
  --radius-buttons: 2.8px;

  /* Surfaces */
  --surface-canvas: #121212;
  --surface-inverted-surface: #efefef;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff4d00;
  --color-foundry-black: #121212;
  --color-chalk-white: #e2e8f0;
  --color-bone-white: #efefef;
  --color-soot: #3a3a3a;
  --color-ash: #747474;

  /* Typography */
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basement-grotesque-ffflauta-b-mecha-bunker-caniche-carpenter-curia-adhesion-trovador-xer0-blob: 'Basement Grotesque, FFFLAUTA, B-Mecha, Bunker, Caniche, Carpenter, Curia, Adhesion, Trovador, XER0, Blob', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ffflauta-400: 'FFFLAUTA 400', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basement-grotesque-black-expanded: 'Basement Grotesque Black Expanded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mecha-regular: 'Mecha Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-curia-regular: 'Curia Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-adhesion-regular: 'Adhesion Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-carpenter-regular: 'Carpenter Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bunker-regular: 'Bunker Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-trovador-regular: 'Trovador Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-xer0-regular: 'XER0 Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caniche-regular: 'Caniche Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-blob-regular: 'Blob Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.04px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.02px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.32;
  --text-display: 120px;
  --leading-display: 0.95;
  --tracking-display: 0.01px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 2.8px;
  --radius-lg: 8px;
}
```
