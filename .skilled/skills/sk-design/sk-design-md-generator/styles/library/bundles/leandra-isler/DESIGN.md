# Leandra-isler — Style Reference
> dried botanicals pressed into warm vellum — calm, tactile, editorial, almost reverent.

**Theme:** light

Praxis Leandra Isler reads like a printed herbalist's broadsheet — a single warm sand canvas stretching edge to edge, interrupted only by a dark, almost-black typeface and the living green of a botanical photograph. The entire visual system is held together by a monochromatic earth palette: no competing UI colors, no decorative surfaces, no shadows. Typography does all the structural work, scaling from a 14px caption to a 173px display headline on the same single typeface, so the eye reads scale itself as hierarchy. Surfaces are flat and paper-like; the only "depth" comes from a soft vertical gradient that deepens the tone at the top, mimicking vellum under raking light. Every chrome element — nav, links, buttons — is a thin underline or a hairline rule, never a filled chip. The result is a contemplative, gallery-wall atmosphere where the plant is the hero and the interface gets out of the way.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vellum Sand | `#f4e6cd` | `--color-vellum-sand` | Primary page canvas — the base warm-cream that fills every section, never competing with content |
| Pressed Linen | `#edddc3` | `--color-pressed-linen` | Secondary surface for subtle section breaks, link backgrounds, and content cards resting on Vellum Sand |
| Aged Ink | `#1e211e` | `--color-aged-ink` | Dominant text and hairline border color — near-black with a touch of warmth, used for 95% of all rules, headings, and body copy |
| Charcoal Black | `#000000` | `--color-charcoal-black` | Hard ink for display headings, icon fills, and the strongest contrast moments where absolute black reads better than warm |
| Twilight Bronze | `#8f774b` | `--color-twilight-bronze` | Gradient stop — the deepest tone in the vertical vellum wash, used only inside the hero gradient |
| Hayfield | `#ba9d6a` | `--color-hayfield` | Gradient midtone — the saturated middle of the vertical wash, gives the canvas its sun-warmed depth |
| Wheat Sheaf | `#d6bd97` | `--color-wheat-sheaf` | Gradient light tone — the transition stop between the warm mid and the Vellum base |

## Tokens — Typography

### PP Neue Montreal — The sole typeface across every screen. Body text sits at 16–20px weight 400; subheadings lift to 24–26px weight 500; display headlines scale dramatically from 75px through 122px to 158–173px at weight 500. The signature move is this extreme display scaling — the same family at 14px captions and 173px hero headlines proves the typeface can carry both whispered body copy and shouted editorial moments without switching personality. · `--font-pp-neue-montreal`
- **Substitute:** Söhne (Klim Type Foundry) — closest geometric-grotesk cousin with identical warmth and identical 400/500 weights. Free fallback: Inter at the same weights.
- **Weights:** 400, 500
- **Sizes:** 14, 16, 18, 20, 24, 26, 40, 43, 50, 58, 75, 122, 158, 173
- **Line height:** 0.90, 1.00, 1.20, 1.40, 1.50
- **Letter spacing:** -0.045em at 158–173px display, -0.030em at 75–122px, normal at body sizes
- **Role:** The sole typeface across every screen. Body text sits at 16–20px weight 400; subheadings lift to 24–26px weight 500; display headlines scale dramatically from 75px through 122px to 158–173px at weight 500. The signature move is this extreme display scaling — the same family at 14px captions and 173px hero headlines proves the typeface can carry both whispered body copy and shouted editorial moments without switching personality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| subheading | 24px | 1.4 | — | `--text-subheading` |
| heading-sm | 26px | 1.4 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 75px | 1 | -2.25px | `--text-heading-lg` |
| display | 173px | 0.9 | -7.79px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 4px |
| buttons | 0px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 0px
- **Element gap:** 4-8px

## Components

### Top Navigation Bar
**Role:** Slim, full-bleed header sitting on the Vellum Sand canvas

Transparent background, no border, no shadow. Left-aligned brand mark (small starburst icon + 'PRAXIS / LEANDRA ISLER' stacked in 14px weight 500, letter-spacing slightly open). Center: nav items HOME, ANGEBOT, BLOG, ÜBER MICH, KONTAKT at 14px weight 400 in #1e211e. Right: 'TERMIN VEREINBAREN ↗' as a 14px underlined link. The entire bar is roughly 70px tall and relies on alignment, not containers, to structure itself.

### Display Headline Block
**Role:** The hero typography element that defines the brand

PP Neue Montreal weight 500 at 75–173px, line-height 0.90–1.0, letter-spacing -0.045em to -0.030em. Color #000000 or #1e211e. Spans three or four lines ('Praxis für / Atlaslogie und / Naturheilkunde'), allowed to break across the full viewport edge-to-edge with no max-width constraint. Lives directly on Vellum Sand with no background container.

### Underlined Text Link
**Role:** The only interactive UI element used in body contexts

14–18px PP Neue Montreal weight 400 in #1e211, 1px underline offset 2–4px below the baseline in the same #1e211e. Hover shifts underline thickness to 2px or animates a color nudge toward #8f774b. Never boxed, never filled, never a chip.

### Botanical Hero Image
**Role:** The sole visual content element — a real plant photograph

Full-color product-grade photograph of a nettle/leaf cutting, tightly cropped, positioned over the Vellum Sand gradient. No border, 4px corner radius only on the cut edges, no shadow. The plant is large enough that leaves extend beyond the viewport top, reinforcing the 'specimen on paper' metaphor. No overlays, no duotone treatment — the green is the only non-neutral color in the entire system.

### Vellum Section Background
**Role:** The base canvas for all content sections

Pure #f4e6cd filling the full viewport edge-to-edge, no border between sections, no card containers. Sections are separated by 80–120px of vertical space alone. This is the design's signature restraint: there are no panels inside the page.

### Section Divider Rule
**Role:** The only structural break element

A 1px hairline in #1e211 spanning the full viewport width, with 60–100px of vertical padding above and below. No dots, no gradient fades, no ornamental marks. This replaces every card, panel, and background tint in the system.

### Inline Body Paragraph
**Role:** The primary content carrier

18px PP Neue Montreal weight 400 in #1e211, line-height 1.5, max measure roughly 65 characters. No drop cap, no first-line indent, no pulled quotes. Paragraphs separated by 8–14px of vertical space. Headings above are 24–26px weight 500 with 26px of space above them.

### Footer
**Role:** Closing element with contact and legal

Same Vellum Sand canvas, no border above (relies on a 1px hairline if a divider is used). Three-column grid at 14px weight 400: left column contact, center column navigation mirror, right column legal/social. The footer is the densest information zone on the page but uses the smallest type and the most whitespace — it whispers rather than announces.

## Do's and Don'ts

### Do
- Use PP Neue Montreal as the single typeface across every element — no serif, no mono, no display face
- Scale the hero headline to 122–173px weight 500 with letter-spacing -0.045em; that extreme size is the brand's loudest signature
- Let the Vellum Sand (#f4e6cd) fill the full viewport edge-to-edge with no max-width wrapper and no card panels
- Separate sections with 80–120px of vertical space plus optional 1px hairline in #1e211 — never with cards, tinted panels, or shadows
- Mark interactive elements with a 1px underline in #1e211 offset 2–4px below the baseline; never use filled buttons or pill chips
- Use real botanical photography as the only non-neutral color in the system; let leaves and stems break the viewport edges to suggest specimens pressed onto paper
- Apply the vertical 4-stop linear gradient (184deg, #8f774b → #ba9d6a → #d6bd97 → #f4e6cd) as a subtle wash on the hero only, so the page reads as sun-warmed vellum rather than flat beige

### Don't
- Don't introduce any new color — the system is warm sand plus near-black plus photographic green; any blue, red, or saturated accent breaks the herbalist aesthetic
- Don't use a filled, pill, or rounded button — the interface has no containers, so a button would feel alien against the flat vellum
- Don't wrap content in cards, panels, or boxed surfaces with shadows; sections are separated by space and hairlines only
- Don't use a max-width centered column for the hero headline — the display text bleeds to the viewport edge to read as editorial print
- Don't apply a dark mode or invert the palette; the Vellum Sand is the brand, not just a light-theme choice
- Don't use stock illustration, icons-as-decoration, or geometric shapes; the only visual vocabulary is typography and a real plant
- Don't set the body text below 16px or above 20px — the page intentionally uses tiny captions and massive display sizes, but the readable body stays in this narrow band

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Vellum Canvas | `#f4e6cd` | The base page background — every section lives directly on this surface with no containers above it |
| 2 | Pressed Linen | `#edddc3` | Slightly deeper surface for subtle section bands and link-background hits, used when a section needs a whisper of differentiation from the base canvas |

## Elevation

The design intentionally uses zero elevation. There are no drop shadows, no border-based depth, no glassmorphism, no overlay tiers. Dimensionality is communicated entirely through the warm vertical gradient on the hero — the only place light and shadow exist in the system. This flat-on-flat approach is deliberate: the practice is a quiet healing space, and a shadow would feel too industrial, too interface-y. Sections sit beside each other as paper sheets on a table, not as floating cards in a UI kit.

## Imagery

Imagery is essentially one element type: real botanical photography, shot as a tight specimen crop on a plain warm background. The plant (nettle, in the hero) is full-color with natural deep greens and yellow-green highlights, not duotone or filtered. It is positioned without a frame, without rounded corners larger than 4px, and with leaves extending past the viewport edge so the plant feels physically present in the room rather than placed inside a UI container. There are no illustrations, no icons-as-decoration (the small starburst next to the wordmark is a brand mark, not iconography), no abstract shapes, no product screenshots. The density is image-light: a single plant photograph per major section, surrounded by vast vellum whitespace. This is the design's visual restraint — the interface trusts one good photograph to do the work that most sites spread across six stock images.

## Layout

The layout is full-bleed and edge-to-edge at all times — there is no max-width container, no centered column, no sidebar. The hero is a single viewport-height block where the Vellum Sand gradient washes the top and a botanical photograph rises from the bottom-right corner, with the massive multi-line display headline ('Praxis für / Atlaslogie und / Naturheilkunde') spanning the full width and breaking naturally at three lines. Below the hero, content sections alternate as full-bleed vellum bands separated by 80–120px of vertical space and occasional 1px hairlines, with no card surfaces, no colored panels, and no visual dividers other than whitespace. Body text sits in a comfortable measure (~65 characters) floated left within the full-width canvas — it is not centered, not constrained to a 1200px column. Navigation is a slim top bar (roughly 70px) with the brand mark left, nav items center, and a single underlined CTA right. The page rhythm reads more like an editorial magazine spread than a SaaS product: one image, one headline, vast white(ish) space, repeat. There are no card grids, no feature grids, no pricing tables — the practice is a single practitioner and the layout reflects that singular, unhurried tone.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1e211e
- background: #f4e6cd
- border: #1e211e (1px hairlines only)
- accent: #ba9d6a (hero gradient only)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Hero section: full-bleed Vellum Sand (#f4e6cd) with the 184deg linear gradient overlay deepening to #8f774b at the top edge. Display headline 'Praxis für Atlaslogie und Naturheilkunde' at 158px PP Neue Montreal weight 500, letter-spacing -0.045em, line-height 0.90, color #000000, left-aligned, bleeding edge-to-edge across the viewport. A tightly cropped botanical photograph of a nettle plant positioned bottom-right with leaves extending past the viewport, no border, 4px corner radius on visible edges, no shadow.

2. Underlined text link: 16px PP Neue Montreal weight 400, color #1e211e, 1px underline in #1e211e offset 3px below the baseline. No background, no padding, no border-radius.

3. Section divider: full-viewport-width 1px hairline in #1e211e with 80px of vertical padding above and below. No other marks, dots, or gradients.

4. Body paragraph: 18px PP Neue Montreal weight 400, color #1e211e, line-height 1.5, max measure 65 characters, floating left on the Vellum Sand canvas with no container. Paragraph spacing 8px.

5. Top navigation bar: 70px tall, Vellum Sand background, no border or shadow. Left: starburst mark + 'PRAXIS / LEANDRA ISLER' stacked at 14px weight 500. Center: HOME, ANGEBOT, BLOG, ÜBER MICH, KONTAKT at 14px weight 400. Right: 'TERMIN VEREINBAREN ↗' as a 1px-underlined link in #1e211e.

## Similar Brands

- **Aesop (aesop.com)** — Same warm-sand-canvas-plus-near-black-typeface editorial restraint, with real product photography as the only color accent and hairline rules instead of buttons
- **Mara Hoffman** — Same edge-to-edge headline scaling, no card containers, botanical/earthy photography, and a single warm neutral background that reads as printed paper
- **The Arca (thearca.com)** — Same flat vellum-tone canvas, massive display type bleeding to viewport edges, and a deliberate absence of UI chrome — interface as gallery wall
- **Studio Daïdai** — Same single-typeface system stretched from caption to display on a warm neutral background, with real plant photography as the only non-neutral element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vellum-sand: #f4e6cd;
  --color-pressed-linen: #edddc3;
  --color-aged-ink: #1e211e;
  --color-charcoal-black: #000000;
  --color-twilight-bronze: #8f774b;
  --color-hayfield: #ba9d6a;
  --color-wheat-sheaf: #d6bd97;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.4;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 75px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.25px;
  --text-display: 173px;
  --leading-display: 0.9;
  --tracking-display: -7.79px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 0px;
  --element-gap: 4-8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 4px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-vellum-canvas: #f4e6cd;
  --surface-pressed-linen: #edddc3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vellum-sand: #f4e6cd;
  --color-pressed-linen: #edddc3;
  --color-aged-ink: #1e211e;
  --color-charcoal-black: #000000;
  --color-twilight-bronze: #8f774b;
  --color-hayfield: #ba9d6a;
  --color-wheat-sheaf: #d6bd97;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.4;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 75px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.25px;
  --text-display: 173px;
  --leading-display: 0.9;
  --tracking-display: -7.79px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 50px;
}
```
