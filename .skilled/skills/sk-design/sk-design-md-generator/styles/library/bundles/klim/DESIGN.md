# Klim — Style Reference
> typographic gallery in a black box — a curator's vitrina where each specimen hangs in its own dark band

**Theme:** mixed

Klim Type Foundry presents its library as a typographic gallery: each typeface gets its own full-bleed band, set in itself, with no ornament. The site alternates between a matte black gallery mode and a pale studio-gray mode, letting the letterforms carry all the visual weight. UI chrome is reduced to a thin black header strip and small orange label tags; everything else is type. The accent system is deliberately loud — vivid orange-red, electric blue, mint teal — used as tiny color punches against an otherwise neutral monochrome canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Studio Charcoal | `#101c19` | `--color-studio-charcoal` | Page canvas, primary background — a near-black with a green undertone that reads as neutral but feels warmer than pure black |
| Gallery Black | `#000000` | `--color-gallery-black` | Feature bands, specimen backgrounds, header bar — pure black for maximum type contrast |
| Charcoal Surface | `#1c1c1c` | `--color-charcoal-surface` | Elevated surface, input fields, secondary panel backgrounds — one step lighter than the canvas |
| Slate Mist | `#3c585f` | `--color-slate-mist` | Muted accent band, tertiary surface — desaturated blue-gray used as an alternate section background |
| Graphite | `#555555` | `--color-graphite` | Mid-tone borders, muted body text on light sections, card outlines |
| Steel | `#646464` | `--color-steel` | Secondary borders, subdued link text on dark backgrounds |
| Fog | `#7f7f7f` | `--color-fog` | Tertiary borders, inactive UI elements, secondary text |
| Ash | `#939393` | `--color-ash` | Medium-contrast borders, control outlines, and structural separators. Do not promote it to the primary CTA color |
| Marble | `#f9f9f9` | `--color-marble` | Light-mode page canvas, pale gray that photographs cleanly for specimen presentations |
| Bone | `#ffffff` | `--color-bone` | Primary text on dark backgrounds, type specimen letterforms, button labels, high-contrast surfaces |
| Flare Orange | `#d33c03` | `--color-flare-orange` | Label tags, collection names, editorial annotations — a saturated vermilion that reads as the foundry's signature mark on light backgrounds |
| Signal Red | `#e90702` | `--color-signal-red` | Hot accent on dark surfaces, inline highlights, the reddest red in the palette for maximum voltage |
| Electric Blue | `#24a7f2` | `--color-electric-blue` | Interactive highlights, active states, link emphasis — a bright cyan-blue that pops against black |
| Mint Pulse | `#93ffe6` | `--color-mint-pulse` | Decorative text accent, special-occasion highlights — a pale mint used sparingly for emphasis |
| Canary | `#ffff79` | `--color-canary` | Rare chromatic accent, used for the highest-attention text moment on dark backgrounds |
| Blush | `#ffe6d9` | `--color-blush` | Soft warm accent, subtle text tint — a cream-pink that warms dark sections without competing with type |

## Tokens — Typography

### SOEHNE — SOEHNE — detected in extracted data but not described by AI · `--font-soehne`
- **Weights:** 400, 700
- **Sizes:** 16px, 36px
- **Line height:** 0.98, 1.19, 1.2, 1.33, 1.5
- **OpenType features:** `"ordn"; "tnum"`
- **Role:** SOEHNE — detected in extracted data but not described by AI

### Söhne — Primary UI typeface — used for navigation, body text, buttons, form labels, and all functional interface text. Tight line-heights (0.98–1.20) at display sizes; generous (1.50) for body. Two weights only: regular for content, bold for emphasis. Tabular numerals via tnum for price alignment; ordinals via ordn. · `--font-shne`
- **Substitute:** Inter, Söhne (Klim's own)
- **Weights:** 400, 700
- **Sizes:** 
- **Line height:** 1.19, 1.20, 1.33, 1.50
- **OpenType features:** `"ordn" on, "tnum" on`
- **Role:** Primary UI typeface — used for navigation, body text, buttons, form labels, and all functional interface text. Tight line-heights (0.98–1.20) at display sizes; generous (1.50) for body. Two weights only: regular for content, bold for emphasis. Tabular numerals via tnum for price alignment; ordinals via ordn.

### Söhne Ikon — Iconographic variant of Söhne for interface glyphs, special characters, and numeric UI elements. Same voice as Söhne but with alternate character forms via calt and tabular figures via tnum. · `--font-shne-ikon`
- **Substitute:** Söhne (Klim's own)
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.20, 1.33, 1.50
- **OpenType features:** `"tnum" on, "calt" on`
- **Role:** Iconographic variant of Söhne for interface glyphs, special characters, and numeric UI elements. Same voice as Söhne but with alternate character forms via calt and tabular figures via tnum.

### SOEHNE_IKON — SOEHNE_IKON — detected in extracted data but not described by AI · `--font-soehneikon`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2, 1.33, 1.5
- **OpenType features:** `"tnum"; "calt"`
- **Role:** SOEHNE_IKON — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 36px | 1.19 | — | `--text-heading` |
| display | 56px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 34 | 34px | `--spacing-34` |
| 69 | 69px | `--spacing-69` |
| 137 | 137px | `--spacing-137` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 0px |
| images | 0px |
| inputs | 2px |
| buttons | 2px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 69px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Top Bar
**Role:** Primary site navigation

Full-width black bar (#000000), fixed/sticky, 8px vertical padding, 20px horizontal padding. Left-aligned: brand name 'Klim Type Foundry' in white Söhne 16px regular, then 'Fonts' as a 16px Söhne link in Flare Orange (#d33c03). Right-aligned: hamburger menu icon in white. No drop shadow, no border — the bar sits as a pure black strip.

### Label Tag
**Role:** Collection or edition annotation

Inline rectangular tag with Flare Orange (#d33c03) background, white Söhne 16px text, 2px border-radius, 8px horizontal and 4–5px vertical padding. Used to label specimen collections (e.g. 'Die Grotesk', 'American Grotesk Collection'). Positioned bottom-left of the image it annotates.

### Typeface Specimen Band
**Role:** Full-width type showcase row in the font catalogue

Full-bleed horizontal band, one per typeface family. Alternates between Gallery Black (#000000), Charcoal Surface (#1c1c1c), Slate Mist (#3c585f), and Marble (#f9f9f9). Contains three zones: (1) family name set in the typeface itself at 36px+ in Bone (#ffffff on dark bands) or Graphite (#555555 on light bands), left-aligned with ~20px left padding; (2) variant list in Söhne 16px regular, center-aligned, listing sub-styles (e.g. 'Founders Grotesk', 'Founders Grotesk Condensed'); (3) 'Buy' links in Söhne 16px, right-aligned, in Fog (#7f7f7f) on dark or Graphite on light. No card chrome, no borders between zones — the three columns float in the band.

### Specimen Variant Row
**Role:** Individual sub-style entry within a typeface band

Single line of Söhne 16px text listing one variant name (e.g. 'Founders Grotesk Condensed'). Text color matches the band's text tier: Bone on dark, Graphite on light. 7px row-gap between variant entries. No bullet, no chevron — pure text.

### Buy Link
**Role:** Purchase action for a typeface variant

Söhne 16px, right-aligned in the specimen band. Text color: Fog (#7f7f7f) on dark bands, Graphite (#555555) on light. No background fill, no border, no padding — the word 'Buy' alone, set as text. Hover state brightens to Bone or Electric Blue.

### Image Specimen
**Role:** Full-bleed type-in-context or object photography

Edge-to-edge image with no border-radius (0px), no frame, no caption. Fills the full viewport width. May be paired with a Label Tag in the bottom-left corner. Images sit on the page canvas (Marble for light sections, Gallery Black for dark sections) with no gutter.

### Hamburger Menu Trigger
**Role:** Mobile and desktop menu toggle

Three short horizontal lines in Bone (#ffffff), 2px thick, right-aligned in the Top Bar. No background, no border. Touch target approximately 24×24px.

### Input Field
**Role:** Form input for search or filter

Charcoal Surface (#1c1c1c) background, Graphite (#555555) 1px border, 2px border-radius, 8px horizontal padding, Söhne 16px text in Bone. No visible focus ring color specified — likely defaults to Electric Blue or a 1px border darken.

### Text Link
**Role:** Inline hyperlink within body or navigation content

Söhne 16px, no underline by default. Color varies by context: Flare Orange (#d33c03) for primary nav links, Electric Blue (#24a7f2), Signal Red (#e90702), Mint Pulse (#93ffe6), or Canary (#ffff79) for inline links on dark backgrounds. Ash (#939393) 1px border may appear on interactive containers.

### Section Divider
**Role:** Horizontal rule between specimen bands

Implicit — specimen bands stack directly with no visible divider. The color change of the background itself creates separation. No border, no line, no whitespace gap greater than the band padding.

### Collection Annotation
**Role:** Editorial label overlaid on specimen imagery

Identical visual treatment to the Label Tag — Flare Orange (#d33c03) background, white Söhne text, 2px radius, small padding. Anchored to bottom-left of the image it describes. Functions as a caption that can be clicked to enter a collection.

## Do's and Don'ts

### Do
- Set all primary UI text in Söhne 16px/400 with Söhne 700 for emphasis only
- Use Flare Orange (#d33c03) for label tags, collection names, and editorial annotations — this is the foundry's signature mark
- Alternate specimen band backgrounds between #000000, #1c1c1c, #3c585f, and #f9f9f9 to create rhythm without dividers
- Use 2px border-radius on all interactive elements (buttons, tags, inputs) — this near-sharp corner is the system's geometric signature
- Set type specimens in the typeface they represent at 36px+ — the font IS the content
- Enable tnum and ordn font features on all Söhne usage for consistent number and ordinal rendering
- Maintain tight spacing: 8px component padding, 10px element gaps, 20px horizontal page padding

### Don't
- Do not introduce drop shadows, gradients, or glow effects — the system is flat and shadowless
- Do not use border-radius greater than 2px — the design is intentionally near-sharp
- Do not use color on large background fills — chromatic colors are reserved for tiny label tags and text accents
- Do not set body or display type in colors other than Bone (#ffffff on dark) or Graphite (#555555 on light) — chromatic type is for special emphasis only
- Do not add visible section dividers or whitespace gaps larger than ~69px between bands — the background color shift IS the divider
- Do not use system fonts for UI text — Söhne is the voice of the interface
- Do not place more than one chromatic color in a single component — each color punch gets its own moment

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Gallery Black | `#000000` | Feature band, specimen background |
| 2 | Studio Charcoal | `#101c19` | Primary page canvas, page background |
| 3 | Charcoal Surface | `#1c1c1c` | Elevated panel, input field |
| 4 | Slate Mist | `#3c585f` | Alternate band background |
| 5 | Marble | `#f9f9f9` | Light-mode page canvas |

## Elevation

The system is deliberately flat: zero drop shadows, zero glow, zero gradient. Elevation is communicated entirely through background-color stacking (canvas → charcoal surface → elevated panel) and through the alternating band backgrounds. This is a poster-gallery approach where type and imagery carry all dimensional weight, not UI chrome.

## Imagery

Full-bleed object photography and editorial imagery serve as type-in-context specimens: industrial objects (crates), surreal material studies (bacon flag), and typographic compositions. Images fill the viewport edge-to-edge with zero border-radius and no framing. Color treatment is natural and unstylized — the objects speak for themselves against a pure black or pale-gray studio background. No illustrations, no icons beyond the hamburger glyph, no decorative graphics. The images function as both content and atmosphere.

## Layout

Full-bleed page model with no max-width container. The Top Bar spans the full viewport width. Below it, sections alternate between full-viewport image specimens and stacked specimen bands. The fonts catalogue uses a three-column structure within each band: family name left-aligned, variant list centered, Buy links right-aligned — no gutters, no card chrome. Vertical rhythm is driven by ~69px section gaps between type families. The page reads as a vertical exhibition: one artwork or typeface per band, stacked without interruption.

## Agent Prompt Guide

**Quick Color Reference**
- text (on dark): #ffffff
- text (on light): #555555
- background (dark mode): #101c19
- background (light mode): #f9f9f9
- border / outline: #939393
- accent / label tag: #d33c03
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Label Tag**: Flare Orange (#d33c03) background, white Söhne 16px/400 text, 2px border-radius, 8px horizontal padding, 4px vertical padding. Place bottom-left of an image.

2. **Specimen Band (dark)**: Full-width, Gallery Black (#000000) background, 20px horizontal padding, 20px vertical padding. Left: family name in the typeface itself, 36px, Bone (#ffffff). Center: variant list in Söhne 16px, Bone. Right: 'Buy' text in Söhne 16px, Fog (#7f7f7f).

3. **Specimen Band (light)**: Full-width, Marble (#f9f9f9) background. Left: family name in the typeface itself, 36px, Graphite (#555555). Center: variants in Söhne 16px, Graphite. Right: 'Buy' in Söhne 16px, Graphite.

4. **Top Bar**: Full-width, Gallery Black (#000000), 8px vertical padding, 20px horizontal. Left: 'Klim Type Foundry' in Söhne 16px/400 white, then 'Fonts' in Söhne 16px/400 Flare Orange. Right: hamburger in white.

5. **Inline Link on Dark**: Söhne 16px/400, Electric Blue (#24a7f2), no underline, no background. Used for interactive text within specimen descriptions.

## Specimen Band Color Rotation

The specimen list cycles through four background states in a repeating rhythm: Gallery Black (#000000) → Charcoal Surface (#1c1c1c) → Slate Mist (#3c585f) → Marble (#f9f9f9). Text color inverts with background: Bone (#ffffff) on all dark bands, Graphite (#555555) on the Marble band. This rotation is the page's primary navigation device — the viewer tracks position by band color rather than by section headers.

## Similar Brands

- **Commercial Type** — Same full-bleed specimen-band layout with type-as-content philosophy and minimal black header chrome
- **Grilli Type** — Type-foundry presentation style: large display type, black/white alternation, photographic specimens with minimal overlay
- **Dinamo (abcdinamo.com)** — Editorial type showcase with alternating dark/light bands and near-zero border-radius geometry
- **Production Type** — Type catalogue structured as stacked horizontal bands, each typeface given its own colored strip

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-studio-charcoal: #101c19;
  --color-gallery-black: #000000;
  --color-charcoal-surface: #1c1c1c;
  --color-slate-mist: #3c585f;
  --color-graphite: #555555;
  --color-steel: #646464;
  --color-fog: #7f7f7f;
  --color-ash: #939393;
  --color-marble: #f9f9f9;
  --color-bone: #ffffff;
  --color-flare-orange: #d33c03;
  --color-signal-red: #e90702;
  --color-electric-blue: #24a7f2;
  --color-mint-pulse: #93ffe6;
  --color-canary: #ffff79;
  --color-blush: #ffe6d9;

  /* Typography — Font Families */
  --font-soehne: 'SOEHNE', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne-ikon: 'Söhne Ikon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-soehneikon: 'SOEHNE_IKON', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.19;
  --text-display: 56px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-69: 69px;
  --spacing-137: 137px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 69px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-gallery-black: #000000;
  --surface-studio-charcoal: #101c19;
  --surface-charcoal-surface: #1c1c1c;
  --surface-slate-mist: #3c585f;
  --surface-marble: #f9f9f9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-studio-charcoal: #101c19;
  --color-gallery-black: #000000;
  --color-charcoal-surface: #1c1c1c;
  --color-slate-mist: #3c585f;
  --color-graphite: #555555;
  --color-steel: #646464;
  --color-fog: #7f7f7f;
  --color-ash: #939393;
  --color-marble: #f9f9f9;
  --color-bone: #ffffff;
  --color-flare-orange: #d33c03;
  --color-signal-red: #e90702;
  --color-electric-blue: #24a7f2;
  --color-mint-pulse: #93ffe6;
  --color-canary: #ffff79;
  --color-blush: #ffe6d9;

  /* Typography */
  --font-soehne: 'SOEHNE', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne-ikon: 'Söhne Ikon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-soehneikon: 'SOEHNE_IKON', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.19;
  --text-display: 56px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-69: 69px;
  --spacing-137: 137px;

  /* Border Radius */
  --radius-sm: 2px;
}
```
