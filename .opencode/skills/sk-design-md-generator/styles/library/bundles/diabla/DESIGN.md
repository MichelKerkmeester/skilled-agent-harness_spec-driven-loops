# Diabla — Style Reference
> Mediterranean courtyard at noon — sun-bleached pink walls, one bold red canvas awning, and editorial serif headlines stretched across the sky.

**Theme:** light

Diabla speaks in a sun-bleached Mediterranean vernacular: a whisper-pink canvas, editorial Helvetica, and one searing vermillion that punctuates like lipstick. Typography does the heavy lifting — the display face is set absurdly large (80–110px) and pulled almost impossibly tight (line-height 0.88–0.91), turning product names into cropped fashion headlines. Interfaces are quiet and gallery-like: generous whitespace, hairline-red outlined buttons, and almost no shadow. Color is rationed: red appears as outlines, link text, and the wordmark, never as a flat fill — the brand gestures rather than shouts. The result reads like a Vogue spread for outdoor furniture rather than an e-commerce catalog.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vermillion | `#ed2e38` | `--color-vermillion` | Wordmark, link text, heading text, outlined-button borders — the single chromatic note in an otherwise neutral palette, used as outline and ink rather than flood fill to keep it editorial |
| Blush Canvas | `#fcf0f3` | `--color-blush-canvas` | Page background, input field fills — a barely-there warm pink that softens the white experience and gives the brand its sunlit, not sterile, identity |
| Charcoal Ink | `#333333` | `--color-charcoal-ink` | Body copy, paragraph text, default readable text — softer than pure black, lets the red feel like the only sharp edge on the page |
| Onyx | `#000000` | `--color-onyx` | Button text and occasional thin button borders where a neutral-bordered variant is needed |

## Tokens — Typography

### LinotypeHelveticaNeueLTStdLt — Display headlines — the face is set at 80–110px with line-height compressed to 0.88–0.91, which crops ascenders/descenders and turns product names into poster-sized editorial typography. The light weight against the tight leading is the signature move: a whisper at billboard scale. · `--font-linotypehelveticaneueltstdlt`
- **Substitute:** Helvetica Neue Light, Helvetica Light, Inter Light, system-ui weight 300
- **Weights:** 400 (Light)
- **Sizes:** 80px, 110px
- **Line height:** 0.88–0.91
- **Letter spacing:** normal
- **Role:** Display headlines — the face is set at 80–110px with line-height compressed to 0.88–0.91, which crops ascenders/descenders and turns product names into poster-sized editorial typography. The light weight against the tight leading is the signature move: a whisper at billboard scale.

### LinotypeHelveticaNeueLTStdRoman — Everything else: body, links, buttons, nav, subheadings, footer, list items. Single Roman weight, no bold variants — hierarchy is achieved by size, color (red vs charcoal), and case (uppercase for nav, sentence case for body). · `--font-linotypehelveticaneueltstdroman`
- **Substitute:** Helvetica Neue, Helvetica, Arial, Inter
- **Weights:** 400
- **Sizes:** 10px, 12px, 14px, 15px, 16px, 18px, 22px, 33px
- **Line height:** 1.13–1.50 (body), 1.80–2.80 (loose display contexts)
- **Letter spacing:** normal
- **Role:** Everything else: body, links, buttons, nav, subheadings, footer, list items. Single Roman weight, no bold variants — hierarchy is achieved by size, color (red vs charcoal), and case (uppercase for nav, sentence case for body).

### Arial — Rare system-font fallback for narrow button labels where the custom face is unavailable · `--font-arial`
- **Substitute:** system-ui, sans-serif
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Rare system-font fallback for narrow button labels where the custom face is unavailable

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| subhead-lg | 22px | 1.29 | — | `--text-subhead-lg` |
| heading | 33px | 1.13 | — | `--text-heading` |
| display | 80px | 0.91 | — | `--text-display` |
| display-xl | 110px | 0.88 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| links | 14px |
| inputs | 0px |
| buttons | 14px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 25px
- **Element gap:** 10px

## Components

### Wordmark Logo
**Role:** Brand mark in header navigation

The literal word 'diabla' set in lowercase Helvetica Roman at ~16–18px, colored Vermillion (#ed2e38). No icon, no lockup — just the red wordmark centered in the nav row. Its visual weight is carried entirely by the red ink.

### Top Navigation Bar
**Role:** Primary site navigation

Transparent/full-bleed across the hero image. Four nav groups (CONTACT SEARCH DISTRIBUTION | PRODUCTS ABOUT | wordmark | DESIGNERS ATTITUDE | SHOP FIND YOURSELF) set in uppercase Helvetica Roman 12–14px, Vermillion (#ed2e38), tracking normal. Distributed left-center-right rather than left-aligned. No background, no border, no shadow — the nav sits on top of hero photography.

### Outlined Red Button
**Role:** Primary interactive element across the site (e.g. 'LACE', 'MORE INFO', collection CTAs)

1px solid Vermillion (#ed2e38) border, transparent/blush-canvas fill, Vermillion uppercase label in Helvetica Roman 12–14px, 14px border-radius, ~6px vertical × 25px horizontal padding. Centered text, no fill state on hover visible in data — emphasis stays on the outline. This is the site's defining button: chromatic stroke, not chromatic fill.

### Outlined Black Button
**Role:** Secondary or neutral action variant

Same geometry as the red outlined button but with a 1px Onyx (#000000) border and Onyx text. Used where a neutral/non-branded action is needed, keeping the same pill-soft rectangular shape and 14px radius.

### Hero Display Headline
**Role:** Full-bleed event/campaign headline overlaid on lifestyle photography

Set in Helvetica Neue Light at 80–110px, line-height 0.88–0.91, white (#ffffff) on photographic backdrop. Center-aligned, no max-width cap — type is allowed to break the grid. Small uppercase eyebrow (date '21–26 ABRIL') in Helvetica Roman ~14px white above; metadata ('HALL_22 STAND B08 | MILAN 2026') below. A small red downward arrow (#ed2e38) signals scroll.

### Editorial Content Card
**Role:** Three-up editorial grid block (product / catalogue / designer profile)

Three equal columns on blush-canvas background. Each card stacks: full-bleed product/lifestyle image, small uppercase eyebrow label (e.g. 'LACE', 'CATALOGUE FOUNDATION', 'HÉCTOR SERRANO') in Vermillion ~12px, headline in uppercase Helvetica Roman ~14–16px either Vermillion or Charcoal, body copy in Charcoal (#333333) 14px line-height 1.50. No card border, no shadow, no background fill — whitespace alone separates columns. An outlined red CTA button ('LACE', 'MORE INFO') sits beneath each card.

### Designer Profile Block
**Role:** Right-column editorial piece in the three-up grid

Black-and-white portrait photograph (monochrome treatment) above a two-column name + body copy layout. Name 'HÉCTOR SERRANO' in Vermillion uppercase 14px; bio text in Charcoal 14px. Pull-quote in Charcoal with leading 1.50. No card chrome — image and text sit directly on the blush canvas.

### Input Field
**Role:** Form inputs (search, newsletter, contact)

Blush Canvas (#fcf0f3) background — note this is the same as the page, so the field reads as a slight tonal lift rather than a distinct container. ~5px vertical padding, Charcoal text. No visible border in the data; the tonal shift is the only affordance.

### Inline Link
**Role:** In-body and nav links

Vermillion (#ed2e38) text, 14px Helvetica Roman, no underline by default. 14px border-radius available on link containers (pill-shaped inline links) with 25px horizontal padding for clickable tag-style links.

### Full-bleed Hero Image
**Role:** Atmospheric lifestyle photography that anchors the page

Edge-to-edge pool/courtyard scene with no inset or margin. White headline text and red UI elements sit on top. The image IS the section; no container, no border-radius, no card framing.

## Do's and Don'ts

### Do
- Use the outlined Vermillion button (#ed2e38 1px border, transparent fill, 14px radius, 6px 25px padding) as the default interactive element — it is the brand's signature control
- Set display headlines in Helvetica Neue Light at 80–110px with line-height 0.88–0.91; the compressed leading is what makes type feel editorial
- Use Blush Canvas (#fcf0f3) as the page background everywhere; never switch to pure white — the warm pink is the brand atmosphere
- Use Charcoal Ink (#333333) for body text, not pure black; the softer black lets Vermillion read as the only sharp edge
- Ration Vermillion (#ed2e38) to: the wordmark, nav links, outline-button borders, and editorial headlines — never flood-fill a surface with it
- Stack uppercase eyebrows (12–14px Vermillion) above uppercase headlines (14–22px Charcoal or Vermillion) for the site's recurring editorial pattern
- Let hero and editorial photography run edge-to-edge at full viewport width; never inset, round, or frame product images

### Don't
- Do not use a filled red CTA — the brand communicates through outlines and ink, not filled buttons
- Do not use bold or semibold weights of Helvetica; the system is intentionally monoweight (400 only) with hierarchy driven by size and color
- Do not apply drop-shadows, elevation, or card lift effects — surfaces stay flat, like printed editorial pages
- Do not introduce saturated accent colors beyond Vermillion; the palette is overwhelmingly neutral and the red is rationed
- Do not left-align navigation — the nav is distributed left-center-right with the wordmark at center
- Do not use pure white (#ffffff) for page surfaces; the canvas is always Blush Canvas (#fcf0f3)
- Do not break the three-up editorial grid into asymmetric or masonry layouts; columns are equal and whitespace separates them

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Blush Canvas | `#fcf0f3` | Page-wide base background — warm pink, never pure white, sets the Mediterranean mood |
| 2 | Verdant Overlay | `#0c1a0` | Dark treatment used as a full-bleed image/photography backdrop (pool, foliage, lifestyle scenes), not a UI surface token — text overlaid in white |

## Elevation

Diabla deliberately avoids drop-shadows and elevation effects. The visual hierarchy is built from type scale, generous whitespace, and the single red chromatic accent — never from lifted surfaces. Components feel printed on paper rather than floating in space, reinforcing the editorial/catalog tone.

## Imagery

Hero and editorial imagery is full-bleed, high-key, sun-drenched outdoor lifestyle photography — Mediterranean poolscapes, rocky coastlines, palm gardens, lounge chairs in pastel pink and white, striped awnings. The palette is warm and desaturated except for the product colors. Secondary imagery includes moody monochrome designer portraits and green-foliage catalogue covers. Photographs are unmasked, edge-to-edge, with no rounded corners and no overlapping text containers. Iconography is minimal and only appears inline as a small red search-magnifier and a red downward arrow scroll affordance — no icon system, no glyphs library. The visual density is image-heavy in the hero and product sections, then shifts to text-dominant in the editorial/designer blocks.

## Layout

The page is a full-bleed editorial scroll with no persistent sidebar. The hero is a 100vw lifestyle photograph with centered white display type and a small red scroll arrow. Below the hero, content settles to a max-width ~1200px centered column on the blush canvas, arranged in a three-up editorial grid (product / catalogue / designer) for collection features. Section rhythm is calm: large white-space gaps (80px) between bands, no alternating dark/light section contrast — the blush canvas is continuous. Navigation sits as a transparent overlay on the hero, distributed across four corners and the center wordmark rather than left-aligned. Content is always centered, never asymmetric or z-pattern. There is no sticky header visible in the data — the nav is tied to the hero image.

## Agent Prompt Guide

**Quick Color Reference**
- text: #333333 (Charcoal Ink)
- background: #fcf0f3 (Blush Canvas)
- border (brand accent): #ed2e38 (Vermillion)
- border (neutral): #000000 (Onyx)
- accent / link / wordmark: #ed2e38 (Vermillion)
- primary action: #ed2e38 (outlined action border)

**Example Component Prompts**
1. *Hero section*: full-bleed lifestyle photograph. Centered display headline in Helvetica Neue Light, 110px, line-height 0.88, color #ffffff, letter-spacing normal. Small uppercase eyebrow above in Helvetica Roman 14px white. Red downward arrow (1px stroke, #ed2e38) below the headline as a scroll cue. The wordmark 'diabla' in lowercase Helvetica Roman 18px, #ed2e38, centered in the nav row above.
2. *Outlined red button*: 1px solid border #ed2e38, background transparent, label in uppercase Helvetica Roman 12px #ed2e38, border-radius 14px, padding 6px 25px. Text centered, no fill change on interaction.
3. *Three-up editorial grid*: blush canvas (#fcf0f3) background, three equal columns at max-width 1200px. Each column: full-bleed image on top, uppercase Vermillion 12px eyebrow, uppercase Charcoal 14–16px headline, Charcoal 14px body copy line-height 1.50, then an outlined red button beneath. 80px vertical gap between the grid and the next section.
4. *Designer profile block*: black-and-white portrait photograph (full-bleed, no rounded corners) on the right column. Name in uppercase Vermillion 14px above a two-column Charcoal 14px bio with line-height 1.50. No card chrome, no border, no shadow.
5. *Inline nav link*: uppercase Helvetica Roman 12px, color #ed2e38, no underline, normal letter-spacing. Optional 14px border-radius pill treatment with 25px horizontal padding for clickable nav tags.

## Similar Brands

- **Gandia Blasco** — Mediterranean outdoor furniture brand with a similar editorial full-bleed photography approach, all-uppercase Helvetica nav, and a single warm accent color against a neutral canvas
- **Fermob** — Outdoor lifestyle furniture brand that uses generous whitespace, minimal chrome, and a single vivid brand color for accents on otherwise neutral product pages
- **Vitra** — Design-forward furniture catalog with a single dominant accent color, monoweight sans-serif type, and editorial full-bleed lifestyle imagery
- **Swarovski (editorial mode)** — Luxury brand treatment of fashion-editorial type at extreme display sizes (80–110px) with tight leading and a single red chromatic accent against light backgrounds

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vermillion: #ed2e38;
  --color-blush-canvas: #fcf0f3;
  --color-charcoal-ink: #333333;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-linotypehelveticaneueltstdlt: 'LinotypeHelveticaNeueLTStdLt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linotypehelveticaneueltstdroman: 'LinotypeHelveticaNeueLTStdRoman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-subhead-lg: 22px;
  --leading-subhead-lg: 1.29;
  --text-heading: 33px;
  --leading-heading: 1.13;
  --text-display: 80px;
  --leading-display: 0.91;
  --text-display-xl: 110px;
  --leading-display-xl: 0.88;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 25px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-xl: 14px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-links: 14px;
  --radius-inputs: 0px;
  --radius-buttons: 14px;

  /* Surfaces */
  --surface-blush-canvas: #fcf0f3;
  --surface-verdant-overlay: #0c1a0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vermillion: #ed2e38;
  --color-blush-canvas: #fcf0f3;
  --color-charcoal-ink: #333333;
  --color-onyx: #000000;

  /* Typography */
  --font-linotypehelveticaneueltstdlt: 'LinotypeHelveticaNeueLTStdLt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-linotypehelveticaneueltstdroman: 'LinotypeHelveticaNeueLTStdRoman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-subhead-lg: 22px;
  --leading-subhead-lg: 1.29;
  --text-heading: 33px;
  --leading-heading: 1.13;
  --text-display: 80px;
  --leading-display: 0.91;
  --text-display-xl: 110px;
  --leading-display-xl: 0.88;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-xl: 14px;
}
```
