# Dezeen — Style Reference
> White-cube gallery for architecture photography — pure white canvas, image-first cards, blue-violet ink.



**Theme:** light

Dezeen operates as a white-cube editorial gallery for architecture and design — the page reads like a curated biennale catalogue rather than a content portal. Photography occupies near-total visual weight: full-bleed image cards sit on a pure white canvas with almost no chrome between them, letting the work speak before the typography. A single muted blue-violet (#556e9b) carries every interactive signal — links, nav, heading accents — against a strict black-on-white text system, with a vivid orange (#ff7617) reserved as a rare chromatic punctuation for hover and emphasis. Headlines use StandardCT at weight 700 with tight line-heights that compress display copy into architectural bands, while Chronicle Text G1 A keeps body copy quiet and readable at 14–16px. Components are deliberately flat: no drop-shadows on cards, no decorative gradients, and a distinctive blue-violet colored shadow (rgba(101,122,183,0.6)) that bleeds horizontally from select headings as the only elevation gesture.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Gallery Indigo | `#556e9b` | `--color-gallery-indigo` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Signal Orange | `#ff7617` | `--color-signal-orange` | Hover states on links, rare emphasis marks, accent strokes — appears sparingly to create a small spark against the cool blue-violet baseline |
| Press Black | `#000000` | `--color-press-black` | Primary text, body copy, headlines, icons — the dominant ink used everywhere readable content appears |
| Gallery White | `#ffffff` | `--color-gallery-white` | Page canvas, card surfaces, modal backgrounds, input fields — the base layer of the entire interface |
| Plaster | `#f0f0f0` | `--color-plaster` | Subtle surface wash for nested blocks, list items, secondary panels — barely visible depth beneath the white canvas |
| Stone | `#eaeaea` | `--color-stone` | Nav backgrounds, hairline surface separators — used where a neutral needs to sit visibly above the canvas |
| Concrete | `#d8d8d8` | `--color-concrete` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Steel Mist | `#b1bacb` | `--color-steel-mist` | Cool-tinted borders and rules — carries a faint blue cast that harmonises with the Gallery Indigo brand color rather than fighting it |
| Pewter | `#757575` | `--color-pewter` | Muted secondary text, metadata, timestamps, comment counts — subordinated body information that should not compete with primary copy |

## Tokens — Typography

### Chronicle Text G1 A — Body and UI text — the workhorse face used for paragraphs, metadata, buttons, inputs, navigation, and card content. Weight 400 for body copy, 700 reserved for inline emphasis. The narrow size range (14–16px) keeps all running text within a compact editorial band, and the generous line-heights (up to 1.50) give dense article descriptions room to breathe on white. · `--font-chronicle-text-g1-a`
- **Substitute:** Source Serif 4, PT Serif, Charter, Lora
- **Weights:** 400, 700
- **Sizes:** 14px, 16px
- **Line height:** 1.23–1.50
- **Role:** Body and UI text — the workhorse face used for paragraphs, metadata, buttons, inputs, navigation, and card content. Weight 400 for body copy, 700 reserved for inline emphasis. The narrow size range (14–16px) keeps all running text within a compact editorial band, and the generous line-heights (up to 1.50) give dense article descriptions room to breathe on white.

### StandardCT — Display and heading face — the only weight used (700) at all sizes, with tight line-heights (0.95–1.20) on large sizes that compress headlines into dense editorial bands. Custom font with geometric, slightly condensed proportions and controlled OpenType features: stylistic alternates and ligatures disabled, kerning retained. The signature choice is using a single bold weight across the entire display scale rather than building a weight ladder — every headline shouts at the same volume. · `--font-standardct`
- **Substitute:** Druk Wide, Söhne Breit, GT America Compressed Bold
- **Weights:** 700
- **Sizes:** 19px, 27px, 40px
- **Line height:** 0.95–1.38
- **Letter spacing:** normal
- **OpenType features:** `"calt" 0, "kern", "liga" 0`
- **Role:** Display and heading face — the only weight used (700) at all sizes, with tight line-heights (0.95–1.20) on large sizes that compress headlines into dense editorial bands. Custom font with geometric, slightly condensed proportions and controlled OpenType features: stylistic alternates and ligatures disabled, kerning retained. The signature choice is using a single bold weight across the entire display scale rather than building a weight ladder — every headline shouts at the same volume.

### Arial — System fallback for form controls and minor UI text where the custom body face is unavailable — appears at very low frequency as a graceful degradation layer. · `--font-arial`
- **Substitute:** system-ui sans-serif
- **Weights:** 400, 700
- **Sizes:** 13px, 14px, 16px
- **Line height:** 1.00–1.29
- **Role:** System fallback for form controls and minor UI text where the custom body face is unavailable — appears at very low frequency as a graceful degradation layer.

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.29 | — | `--text-caption` |
| body | 16px | 1.29 | — | `--text-body` |
| subheading | 19px | 1.37 | — | `--text-subheading` |
| heading | 27px | 1.2 | — | `--text-heading` |
| display | 40px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 50 | 50px | `--spacing-50` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| modals | 0px |
| buttons | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(101, 122, 183, 0.6) 10px 0px 0px 0px, rgba(101, 122,...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 9px
- **Element gap:** 9px

## Components

### Newsletter Modal
**Role:** Overlay capture for email subscription

Centered white modal (~520px wide) over a dimmed page. Contains a full-width landscape hero image with overlaid headline at 27px StandardCT 700 white. Below the image: email input field spanning full width with a 1px Stone (#eaeaea) bottom border, no other chrome. Submit action is a plain text link 'Next' in Press Black 16px Chronicle 700 — no button shape, no background. Close button is a small × in the top-right corner. The modal floats with no shadow, separated only by the dim overlay.

### Article Card
**Role:** Primary content unit in the 3-column grid

Image-first card with no border, no shadow, no background change on hover. Full-bleed photograph at the top (aspect ratio ~4:3) with zero border-radius. Below: headline at 19px StandardCT 700 Press Black, then a short description at 16px Chronicle 400, then metadata line (author, date, comment count) at 14px Chronicle 400 Pewter. Card padding is 9px on top, 0 horizontal and bottom. Stacked vertically inside a 3-column grid with generous gutters.

### Section Header Label
**Role:** Category markers like 'Highlights', 'Magazine', 'Most commented'

Bold uppercase or title-case label at 16px Chronicle 700 Press Black, prefixed by a small numeric/icon indicator. Often paired with a horizontal rule beneath in Concrete (#d8d8d8) at 1px. Appears as the opening line of each content band, sitting flush-left within the grid.

### Navigation Header
**Role:** Primary site navigation

Full-width white bar. Left: Dezeen wordmark in large StandardCT 700. Center: multi-column nav links (Magazine, Architecture, Interiors, Design, Technology | Series, Interviews, Opinion, Talks, Videos | Awards, Jobs, Events Guide, Showroom, School Shows) in Chronicle 400 at ~14px Press Black, arranged in 3 visual columns. Right: search field and social media follow icons (Pinterest, Instagram, Facebook, Twitter, YouTube) as small filled circles in their brand colors. No background fill, no border-bottom — the header relies on the white canvas alone.

### Email Input
**Role:** Single-field email capture in the newsletter modal

Full-width text field with no box, no background fill, no border-radius. A single 1px bottom border in Stone (#eaeaea) that intensifies on focus. Placeholder text 'Email' in 16px Chronicle 400 at low opacity. No padding above the border — the field is a hairline underline only, keeping the modal visually quiet.

### Text-Link Submit
**Role:** Submit action paired with the email input

The 'Next' action is rendered as plain text, not a button: 16px Chronicle 700 Press Black, no background, no border, no padding. Sits to the right of the input field. On hover, the text shifts to Signal Orange (#ff7617) — the only chromatic feedback in the capture flow.

### Most Commented Sidebar
**Role:** Ranked list of trending articles in the right rail

Numbered list (1, 2, 3…) with article titles at 16px Chronicle 400 Press Black, each title wrapping to multiple lines. Numbers in Pewter (#757575) at 16px. Compact spacing between items (~9px). No images in this list — text-only with tight typographic rhythm.

### Tag Badge
**Role:** Category tags overlaying article cards

Small pill or rectangle in the top-left corner of an article card image. Semi-transparent dark background with white text at 13px Chronicle 700. No border-radius or very slight (~2px). Used to tag content type (e.g. 'interiors', 'design').

### Footer
**Role:** Site-wide footer with links and legal

Full-width white block with a top border in Concrete (#d8d8d8) at 1px. Multi-column link lists in 14px Chronicle 400 Press Black. Bottom row: copyright and legal links in 13px Chronicle 400 Pewter. Generous vertical padding (~60–80px) to separate from the content above. No background fill change.

### Search Field
**Role:** Inline search in the navigation bar

Narrow text input in the top-right of the header, approximately 180px wide. 1px Concrete border, 2–3px radius, 14px Chronicle 400 placeholder. Minimal visual weight — should not compete with the nav links or social icons.

### Social Icon Circle
**Role:** Follow links for Pinterest, Instagram, Facebook, Twitter, YouTube

Small filled circles (~24px diameter) in each platform's brand color. Arranged horizontally in the top-right of the header. The only place on the site where multiple chromatic colors coexist in the interface chrome.

### Hamburger Menu Icon
**Role:** Mobile/overlay menu trigger

Three short horizontal bars in Press Black, ~20px wide, flush-right or in a dedicated position. No background, no border. Triggers a full-screen overlay menu on tap.

## Do's and Don'ts

### Do
- Use Gallery Indigo (#556e9b) for every link, nav item, and interactive text signal — it is the only chromatic voice in the body content and must remain consistent
- Set all card, modal, input, and button border-radius to 0px — sharp edges are non-negotiable for the gallery-wall feel
- Build all content at max-width 1200px centered on Gallery White (#ffffff) — never use full-bleed dark backgrounds in content sections
- Use StandardCT 700 as the sole heading weight at 19/27/40px — do not introduce lighter weights or a second display face
- Reserve Signal Orange (#ff7617) exclusively for hover and emphasis states — it should appear on fewer than 5% of interactive elements at any time
- Maintain 80px section gaps and 9px element gaps as the spacing rhythm — generous vertical breathing is the signature density
- Render all submit/CTA actions as text links in Chronicle 700 Press Black, never as filled buttons — the interface should feel like a newspaper, not an app

### Don't
- Do not add drop-shadows to cards, modals, or any content surface — the only shadow in the system is the blue-violet horizontal heading bleed
- Do not use rounded corners on images, cards, inputs, or buttons — the design is deliberately sharp-edged
- Do not introduce additional brand colors or accent hues — the palette is Gallery White, Press Black, Gallery Indigo, and Signal Orange only
- Do not use filled or outlined button shapes for primary actions — use text links in Press Black or Gallery Indigo
- Do not reduce heading line-heights below 0.95 or above 1.37 — tight editorial bands are a signature
- Do not add background colors or tints to article cards — they must float on the white canvas with no surface distinction
- Do not use system sans-serifs like Arial or Helvetica for headings — StandardCT (or a geometric bold substitute) is required for editorial voice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Gallery White | `#ffffff` | Page canvas — the dominant background for all content |
| 1 | Plaster | `#f0f0f0` | Nested list and panel backgrounds — subtle depth beneath the white canvas |
| 2 | Stone | `#eaeaea` | Nav and secondary block backgrounds — visible separation from the canvas |
| 3 | Concrete | `#d8d8d8` | Bordered surfaces, input frames, structural chrome that needs to read as a surface |

## Elevation

- **Section Headings:** `rgba(101, 122, 183, 0.6) 10px 0px 0px 0px, rgba(101, 122, 183, 0.6) -10px 0px 0px 0px`
- **Article Cards:** `none — no shadow, no border, no background change`
- **Newsletter Modal:** `none — separated from page by dim overlay only`
- **All Other Elements:** `none — flat surfaces, hairline borders only`

## Imagery

Photography is the primary design element. Architecture and design photography is presented full-bleed within article cards with zero border-radius and no overlay tinting. Images are large (dominant proportion of each card), well-lit, and high-resolution — treated as gallery prints rather than thumbnails. No illustrations, no abstract graphics, no 3D renders in the interface chrome. Icons are minimal and flat: navigation chevrons, social media brand circles, and category badges. The only non-photographic visual element is the Dezeen wordmark and the blue-violet heading accent. Image density is very high — photography occupies roughly 60–70% of all visible pixel area in content sections.

## Layout

Max-width ~1200px container centered on a white canvas. The page is a continuous vertical scroll of content bands, each introduced by a flush-left section header label (e.g. 'Highlights', 'Magazine', 'Most commented') followed by a 1px Concrete rule. Article content is arranged in a consistent 3-column grid with generous gutters; the rightmost column often holds a 'Most Commented' text sidebar. No full-viewport hero — the page opens directly into the content grid after a minimal navigation bar. No alternating dark/light bands; the entire page stays on Gallery White. Section spacing is generous (~80px) to let each content band breathe like a gallery wall. Navigation is a single horizontal bar with multi-column link groups, search, and social icons — no sticky behavior, no sidebar nav.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000 (Press Black) for primary, #757575 (Pewter) for muted
- Background: #ffffff (Gallery White) canvas, #f0f0f0 (Plaster) for nested surfaces
- Border: #d8d8d8 (Concrete) for structural, #b1bacb (Steel Mist) for cool-tinted rules
- Accent: #556e9b (Gallery Indigo) for links and interactive elements
- Hover accent: #ff7617 (Signal Orange) for hover-state sparks
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Build a 3-column article grid section:* White #ffffff background, max-width 1200px centered. Section header label at 16px Chronicle 400 700 in Press Black, followed by a 1px #d8d8d8 horizontal rule spanning the full width. Below, three article cards in equal columns with ~24px gutters. Each card: full-bleed 4:3 image with 0px radius, then 9px top padding, then headline at 19px StandardCT 700 in Press Black, then description at 16px Chronicle 400 in Press Black, then metadata at 14px Chronicle 400 in #757575. No card borders, no shadows, no background.

2. *Build the navigation header:* Full-width white bar on #ffffff. Left: 'Dezeen' wordmark in StandardCT 700 at 40px in Press Black. Center: 3-column link block at 14px Chronicle 400 in Press Black, with links like Magazine, Architecture, Interiors. Right: search input (180px, 1px #d8d8d8 border, 2px radius, 14px Chronicle placeholder) and 5 social icon circles in their respective brand colors. No border-bottom, no background.

3. *Build a newsletter capture modal:* White #ffffff modal ~520px wide, centered over a dimmed page (rgba(0,0,0,0.5) overlay). Inside: full-width landscape image at the top, then 27px StandardCT 700 white text overlaid on the image reading the capture headline. Below the image: email input with 1px bottom border in #eaeaea, placeholder 'Email' in 16px Chronicle 400, no background. Submit is a text link 'Next' in 16px Chronicle 700 Press Black, sitting to the right. Close × in top-right corner. No modal shadow.

4. *Build a 'Most Commented' sidebar:* Single column, ~300px wide. Numbered list (1–10) with 16px Chronicle 400 Press Black article titles wrapping to multiple lines. Numbers in #757575. 9px vertical gap between items. No images, no borders, no background — text only on the white canvas.

5. *Build a section divider:* A section header label at 16px Chronicle 700 Press Black, flush-left, followed immediately by a 1px horizontal rule in #d8d8d8 spanning the full 1200px max-width. 80px vertical padding above and below the rule to create gallery-wall spacing.

## Similar Brands

- **Wallpaper*** — Same editorial-magazine DNA — photography-dominant 3-column grids, white canvas, minimal chrome, single chromatic accent for links and interactivity
- **ArchDaily** — Similar architecture-publication rhythm with large image cards, tight typographic metadata, and a clean achromatic layout that lets photography lead
- **It's Nice That** — Shared white-cube editorial language with full-bleed creative imagery, compact grid structure, and restrained use of color reserved for links and emphasis
- **Dwell** — Same architecture/design publication aesthetic — large headline typography against quiet body text, image-first cards, no decorative shadows or gradients
- **Apartamento** — Independent editorial magazine with the same minimal-chrome approach — full-bleed photography, sharp 0px radii, text-only interactivity, and generous white space between content bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-gallery-indigo: #556e9b;
  --color-signal-orange: #ff7617;
  --color-press-black: #000000;
  --color-gallery-white: #ffffff;
  --color-plaster: #f0f0f0;
  --color-stone: #eaeaea;
  --color-concrete: #d8d8d8;
  --color-steel-mist: #b1bacb;
  --color-pewter: #757575;

  /* Typography — Font Families */
  --font-chronicle-text-g1-a: 'Chronicle Text G1 A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-standardct: 'StandardCT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.29;
  --text-body: 16px;
  --leading-body: 1.29;
  --text-subheading: 19px;
  --leading-subheading: 1.37;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --text-display: 40px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-50: 50px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 9px;
  --element-gap: 9px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-modals: 0px;
  --radius-buttons: 0px;

  /* Shadows */
  --shadow-subtle: rgba(101, 122, 183, 0.6) 10px 0px 0px 0px, rgba(101, 122, 183, 0.6) -10px 0px 0px 0px;

  /* Surfaces */
  --surface-gallery-white: #ffffff;
  --surface-plaster: #f0f0f0;
  --surface-stone: #eaeaea;
  --surface-concrete: #d8d8d8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-gallery-indigo: #556e9b;
  --color-signal-orange: #ff7617;
  --color-press-black: #000000;
  --color-gallery-white: #ffffff;
  --color-plaster: #f0f0f0;
  --color-stone: #eaeaea;
  --color-concrete: #d8d8d8;
  --color-steel-mist: #b1bacb;
  --color-pewter: #757575;

  /* Typography */
  --font-chronicle-text-g1-a: 'Chronicle Text G1 A', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-standardct: 'StandardCT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.29;
  --text-body: 16px;
  --leading-body: 1.29;
  --text-subheading: 19px;
  --leading-subheading: 1.37;
  --text-heading: 27px;
  --leading-heading: 1.2;
  --text-display: 40px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-50: 50px;

  /* Shadows */
  --shadow-subtle: rgba(101, 122, 183, 0.6) 10px 0px 0px 0px, rgba(101, 122, 183, 0.6) -10px 0px 0px 0px;
}
```
