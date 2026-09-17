# Cup of Couple — Style Reference
> printed fashion magazine on cream paper

**Theme:** light

Cup of Couple operates as an editorial visual diary: a near-monochrome canvas with warm photography doing all the chromatic work. Every interface element is weight 400 — no bold weights exist in the system, so hierarchy is built through typeface choice (a humanist sans, a classical serif, a titling serif) rather than through thickness. The result reads like a printed magazine spread that happens to scroll: large serif titles, hairline gray rules, generous whitespace, and a gridded portfolio of lifestyle imagery. Brand identity lives almost entirely in one custom display face for the wordmark and the discipline of never adding color to chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Charcoal | `#303030` | `--color-ink-charcoal` | Primary text, all UI borders, nav rules, image borders — the only non-white structural color in the system. The brand's deliberate refusal to go pure black gives headlines a softer, printed feel |
| Dust Gray | `#808080` | `--color-dust-gray` | Secondary borders, card dividers, footer rules, tertiary UI separators — a mid-gray that recedes behind content and never competes with photography |
| Bone | `#f0f0f0` | `--color-bone` | Card surfaces, subtle elevation against the white page, light shadow tints — warms the page away from clinical white and echoes paper stock |
| Faded Pencil | `#767676` | `--color-faded-pencil` | Rare nav underline / accent rule — used sparingly where a separator needs slightly more presence than Dust Gray |

## Tokens — Typography

### ITCFranklinGothicStdBook — UI sans — nav items, category labels (CAFÉS | MADRID), dates, footer micro-copy, tag metadata. The single weight 400 acts as a quiet utilitarian voice that stays out of the way of imagery and serif titles. · `--font-itcfranklingothicstdbook`
- **Substitute:** Source Sans Pro, IBM Plex Sans, Inter (300/400)
- **Weights:** 400
- **Sizes:** 10px, 16px
- **Line height:** 1.05 / 1.20
- **Role:** UI sans — nav items, category labels (CAFÉS | MADRID), dates, footer micro-copy, tag metadata. The single weight 400 acts as a quiet utilitarian voice that stays out of the way of imagery and serif titles.

### Garamond — Project card titles, section labels, and secondary prose. The 28px Garamond with line-height 1.00 sits tight and dense like editorial captions, while 17px handles body-level text in lists and inputs. Its classical proportions give the grid a literary tone. · `--font-garamond`
- **Substitute:** EB Garamond, Cormorant Garamond, Lora
- **Weights:** 400
- **Sizes:** 17px, 28px
- **Line height:** 1.00 / 1.20
- **Role:** Project card titles, section labels, and secondary prose. The 28px Garamond with line-height 1.00 sits tight and dense like editorial captions, while 17px handles body-level text in lists and inputs. Its classical proportions give the grid a literary tone.

### PerpetuaTitlingMT — Major section and page titles — the 48px tier anchors featured-project headers while 25–40px handles sub-section and card-stack headlines. Perpetua's titling proportions (narrow caps, tall x-height) give the layout a stately, museum-label quality. · `--font-perpetuatitlingmt`
- **Substitute:** Cardo, Cormorant SC, Playfair Display SC
- **Weights:** 400
- **Sizes:** 25px, 32px, 40px, 48px
- **Line height:** 1.20
- **Role:** Major section and page titles — the 48px tier anchors featured-project headers while 25–40px handles sub-section and card-stack headlines. Perpetua's titling proportions (narrow caps, tall x-height) give the layout a stately, museum-label quality.

### DisplaceKC — The wordmark only — the 'CUP OF COUPLE' logo at 72px. This is the system's single moment of typographic spectacle: the custom face's distorted, slightly retro character sets the entire editorial mood and is never reused elsewhere. · `--font-displacekc`
- **Substitute:** No substitute — treat as protected brand mark
- **Weights:** 400
- **Sizes:** 72px
- **Line height:** 1.20
- **Role:** The wordmark only — the 'CUP OF COUPLE' logo at 72px. This is the system's single moment of typographic spectacle: the custom face's distorted, slightly retro character sets the entire editorial mood and is never reused elsewhere.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.05 | — | `--text-caption` |
| body-sm | 16px | 1.2 | — | `--text-body-sm` |
| subheading | 25px | 1.2 | — | `--text-subheading` |
| heading-sm | 28px | 1 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.2 | — | `--text-heading-lg` |
| display | 48px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 36px
- **Card padding:** 12px
- **Element gap:** 12-18px

## Components

### Wordmark Logo
**Role:** Brand identity header

DisplaceKC 72px weight 400, #303030, centered, letter-spacing normal, line-height 1.20. Sits alone on its own row with generous top/bottom padding (21–33px) acting as the only horizontal divider between featured-project carousel and primary nav.

### Primary Nav Row
**Role:** Top-level navigation

Single horizontal bar: VISUAL DIARY | CREATIVE STUDIO | ABOUT | WORKSHOPS | STORE, plus italic 'Search…' affordance. ITCFranklinGothicStdBook 16px weight 400, #303030, uppercase tracking. Each item separated by a 1px vertical #303030 rule (18px paddingRight/Left). No background fill, no hover background — only a 1px #303030 bottom underline on active.

### Featured Project Carousel Card
**Role:** Hero editorial unit

Wide horizontal strip with image on one side and text block on the other. Image: full-bleed, 0px radius, no border. Title in PerpetuaTitlingMT 25–32px weight 400, #303030, uppercase. Category tag (e.g. 'BARCELONA | HOTELS') in ITCFranklinGothicStdBook 10–12px, #808080, separated from title by a thin #303030 rule.

### Project Grid Card
**Role:** Diary entry thumbnail

Three-column grid item. Image on top, 0px radius, flush edges, no border. Below: Garamond 28px weight 400 title at line-height 1.00, #303030, often truncated with ellipsis. Bottom row: 10px ITCFranklinGothicStdBook category label left-aligned in #303030, date right-aligned in #303030, separated from title by 12px gap. No card background, no shadow — the image IS the card.

### Editorial Title (Large)
**Role:** Section/page heading

PerpetuaTitlingMT 40–48px weight 400, #303030, line-height 1.20, centered or left-aligned. Used for main page titles like 'CUP OF COUPLE' identity and section openers. No underline, no decorative element.

### Category Tag (Metadata)
**Role:** Content classification label

ITCFranklinGothicStdBook 10px weight 400, #303030 or #808080, uppercase, no background, no border, no padding. Pipe-separated: 'CAFÉS | MADRID', 'FASHION | PARTY | STUDIO'. Sits below card titles with 12px top padding.

### Date Stamp
**Role:** Publication date

ITCFranklinGothicStdBook 10–12px weight 400, #303030, format DD.MM.YYYY (e.g. '07.11.2022'). Right-aligned in card footers, left-aligned in list rows.

### Search Affordance
**Role:** Inline search trigger

Italic 'Search…' placeholder set in Garamond 16–17px weight 400, #303030, right-aligned in nav row. No input field visible by default — the text itself is the control.

### Footer Rule
**Role:** Page footer

Single hairline 1px #808080 horizontal rule above footer content. Footer text in ITCFranklinGothicStdBook 10–12px, #303030, with 18px horizontal padding. ACCESS | BAG: 0 utility links right-aligned in the same row.

### Featured Carousel Header Label
**Role:** Section eyebrow

Small uppercase 'FEATURED PROJECTS' label in ITCFranklinGothicStdBook 10–12px, #303030, sitting flush-left above the carousel strip. Functions as the only section divider besides the wordmark.

### Border Separator
**Role:** Structural divider

1px solid #303030 horizontal line, used to separate nav from content and to underline section breaks. No vertical dividers except the 1px rules between nav items.

## Do's and Don'ts

### Do
- Use weight 400 for every typographic element — the system has no bold weights; hierarchy comes from font family and size only.
- Set body and metadata at 10–17px in ITCFranklinGothicStdBook; reserve Garamond (17–28px) for card titles and PerpetuaTitlingMT (25–48px) for major headings.
- Separate UI elements with 1px #303030 or #808080 hairline rules; never use shadows, fills, or borders thicker than 1px.
- Keep all corners at 0px radius — images, cards, and containers are always flush and rectangular to preserve the print/collage feel.
- Let photography carry all color and warmth; the UI chrome must remain achromatic (whites, #f0f0f0, grays, #303030).
- Use uppercase pipe-separated category tags (e.g. 'FASHION | STUDIO') at 10px in ITCFranklinGothicStdBook below every card title.
- Apply consistent 12px vertical rhythm between title, tag row, and date row inside cards; 36px between major sections.

### Don't
- Do not introduce bold, semibold, or any weight above 400 — the system's restraint depends on this.
- Do not add any chromatic color (blue, red, green) to UI chrome; if a state needs emphasis, use a thicker or darker gray rule.
- Do not round corners, add box-shadows, or apply background fills to cards — let images and whitespace separate content.
- Do not use DisplaceKC outside the wordmark; it is the brand's single typographic spectacle.
- Do not stack more than two font families on a single line of content; the rhythm is title serif + meta sans, nothing else.
- Do not use decorative gradients, colored overlays on images, or tinted UI surfaces — only the warm tones in photography provide chroma.
- Do not use line-height above 1.20 for headings or 1.05 for captions; tight vertical metrics are part of the editorial signature.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Implicit page background — pure white beneath all content |
| 1 | Card Surface | `#f0f0f0` | Subtle card lift, image matte borders, soft fill blocks |

## Elevation

No shadows, no rounding — the layout relies on hairline borders (#303030 at 1px) and whitespace to separate surfaces. Elevation is implied by image overlap and section padding, never by box-shadow. Corners are universally square; even card images sit flush against the page. This produces a print-collage effect where photos and text feel laid out on a flat sheet rather than stacked in a UI.

## Imagery

Photography does all the chromatic and emotional work. Imagery is warm, lifestyle-driven, and editorial: hotel interiors, café scenes, fashion retail, travel vignettes, and people in candid-but-styled moments. Treatments favor natural warm light, earthy palettes (terracotta, amber, cream, deep brown), and tight object-focused crops rather than wide scenic shots. Images sit at full-bleed with sharp corners, no overlays, no duotones, and no rounded masking — they read as printed plates laid on the page. Icons are essentially absent from the UI; when present, they are line-only monochrome glyphs in #303030. The only non-photographic visual element is the DisplaceKC wordmark.

## Layout

Max-width ~1200px centered on a white canvas. The page opens with a full-width horizontal 'FEATURED PROJECTS' strip of 3 wide image+text cards, separated from the masthead by a 1px #303030 rule. Below sits the centered 72px DisplaceKC wordmark, then a single horizontal nav row of uppercase sans-serif items divided by vertical rules. The main content area is a 3-column responsive grid of project cards — image on top, serif title below, sans metadata row at the bottom. Sections are separated by 36px of vertical whitespace and 1px hairline rules. No sidebar, no floating elements, no overlapping components. The rhythm is strictly horizontal bands stacked vertically, like a magazine spread.

## Agent Prompt Guide

QUICK COLOR REFERENCE
• text: #303030
• background: #ffffff (page) / #f0f0f0 (card surface)
• border: #303030 (primary) / #808080 (secondary)
• accent: #767676 (rare nav rule)
• primary action: no distinct CTA color

EXAMPLE COMPONENT PROMPTS

1. Editorial project card: Three-column grid item. Image flush to edges, 0px radius, no border. Below image, Garamond 28px weight 400 title in #303030 at line-height 1.00, truncated with ellipsis if long. Then a 12px gap, then a row with 'FASHION | STUDIO' in ITCFranklinGothicStdBook 10px uppercase #303030 on the left and '20.09.2022' in the same font on the right, separated from the title by a 1px #303030 rule. No card background, no shadow, 12px padding around text block.

2. Section heading: PerpetuaTitlingMT 40px weight 400 #303030, line-height 1.20, left-aligned with 36px top margin. Above it, a 1px #808080 hairline rule spans the full content width. No subtitle, no decoration.

3. Navigation bar: Single horizontal row, ITCFranklinGothicStdBook 16px weight 400 #303030 uppercase, items: VISUAL DIARY | CREATIVE STUDIO | ABOUT | WORKSHOPS | STORE. Each item separated by a 1px solid #303030 vertical rule with 18px paddingLeft and paddingRight. Italic 'Search…' in Garamond 17px sits flush-right. No background fill, no hover state beyond a 1px #303030 bottom underline on the active item.

4. Featured project carousel card: Wide horizontal card, image taking ~60% width on the left (0px radius, flush), title block on the right in PerpetuaTitlingMT 32px weight 400 #303030 uppercase, line-height 1.20. Below title, 12px gap, then a category label 'BARCELONA | HOTELS' in ITCFranklinGothicStdBook 10px uppercase #808080, separated from the title by a 1px #303030 rule. No card border, no shadow.

5. Footer bar: 1px solid #808080 horizontal rule above. Footer text in ITCFranklinGothicStdBook 10–12px weight 400 #303030, 18px paddingLeft. Left side: 'CUP OF COUPLE Creative Studio & Visual Diary' with the brand name in Garamond. Right side: 'ACCESS | BAG: 0' separated by a 1px #303030 vertical rule between items. 12px paddingTop and paddingBottom.

## Similar Brands

- **Garmentory** — Editorial fashion/journalism layout with serif headlines, sans-serif metadata, and a monochrome UI letting warm product photography dominate
- **Cereal Magazine** — Magazine-grid content with weight-400 serif titles, hairline gray rules, zero UI color, and lifestyle photography as the sole source of warmth
- **Kinfolk** — Generous whitespace, restrained typography limited to two or three serif/sans families at weight 400, and editorial card grids with image-first hierarchy
- **Mr. & Mrs. Smith (hotel journal)** — Travel/lifestyle editorial grid with uppercase sans metadata tags below serif project titles, sharp image edges, and no decorative chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-charcoal: #303030;
  --color-dust-gray: #808080;
  --color-bone: #f0f0f0;
  --color-faded-pencil: #767676;

  /* Typography — Font Families */
  --font-itcfranklingothicstdbook: 'ITCFranklinGothicStdBook', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-garamond: 'Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-perpetuatitlingmt: 'PerpetuaTitlingMT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-displacekc: 'DisplaceKC', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.05;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 36px;
  --card-padding: 12px;
  --element-gap: 12-18px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #f0f0f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-charcoal: #303030;
  --color-dust-gray: #808080;
  --color-bone: #f0f0f0;
  --color-faded-pencil: #767676;

  /* Typography */
  --font-itcfranklingothicstdbook: 'ITCFranklinGothicStdBook', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-garamond: 'Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-perpetuatitlingmt: 'PerpetuaTitlingMT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-displacekc: 'DisplaceKC', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.05;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-60: 60px;
}
```
