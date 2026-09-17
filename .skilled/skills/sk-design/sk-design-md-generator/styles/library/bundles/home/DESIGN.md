# Home — Style Reference
> editorial broadsheet in a green room

**Theme:** light

New Form reads like a printed financial broadsheet reimagined for the web: monumental serif and grotesque headlines dominate the page, small-caps micro-labels run the navigation, and a single saturated neon green acts as a highlighter pen over an otherwise monochrome canvas. The page is overwhelmingly typographic — photographs are treated as grayscale, duotone-tinted rectangular inserts that interrupt the text flow rather than float above it. The layout is spacious and almost editorial-magazine in its rhythm: oversized display type, generous breathing room, and a footer that flips to near-black with green band accents. Buttons are pill-soft with green-tinted shadows; the rest of the UI stays stripped back to type and hairline structure.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#fafffa` | `--color-bone-white` | Page canvas, card surfaces, primary text on dark sections — a warm-tinted near-white that keeps the page reading like paper rather than screen |
| Press Black | `#121613` | `--color-press-black` | Primary headline color, footer background, dominant surface — near-true black with a faint green-cool bias that ties it to the accent |
| Typesetter Ink | `#000000` | `--color-typesetter-ink` | Primary headings, body text, and icon fills on light surfaces. Do not promote it to the primary CTA color |
| Slate Verdant | `#232924` | `--color-slate-verdant` | Secondary surface, bordered sections, muted dark accent — sits between Press Black and the white canvas |
| Newsprint Gray | `#516254` | `--color-newsprint-gray` | Muted captions, helper text, and de-emphasized UI labels. |
| Muted Sage | `#c8d2c8` | `--color-muted-sage` | Light text on dark surfaces, inverse labels, and high-contrast captions. |
| Highlighter Green | `#2bee4b` | `--color-highlighter-green` | Primary action fill, active nav underline, and full-bleed footer band — the single vivid accent, used like a marker swipe over the monochrome page |
| Shadow Moss | `#93b799` | `--color-shadow-moss` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Echo Green | `#c4e4c9` | `--color-echo-green` | Gray supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### TWK Lausanne — Primary UI and navigation face — small-caps micro-labels (11px / 550 uppercase), compact body (16px / 400), and large display headlines (96px and 155px / 550) with tight -0.04em tracking · `--font-twk-lausanne`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 200, 350, 400, 550
- **Sizes:** 11px, 14px, 16px, 18px, 72px, 96px, 155px
- **Line height:** 1.0–1.4
- **Letter spacing:** uppercase micro-labels +0.01em; display sizes -0.04em; mid sizes -0.02em
- **Role:** Primary UI and navigation face — small-caps micro-labels (11px / 550 uppercase), compact body (16px / 400), and large display headlines (96px and 155px / 550) with tight -0.04em tracking

### PP Mondwest — Display serif for the largest editorial headlines — extremely tight leading (0.9) and aggressive -0.04em tracking make the wordmark read as a single block of ink · `--font-pp-mondwest`
- **Substitute:** GT Sectra, Tiempos Headline, Recoleta
- **Weights:** 400
- **Sizes:** 60px, 165px, 295px
- **Line height:** 0.9
- **Letter spacing:** -0.04em at all sizes
- **Role:** Display serif for the largest editorial headlines — extremely tight leading (0.9) and aggressive -0.04em tracking make the wordmark read as a single block of ink

### Editorial New — Secondary display face for italic-leaning editorial passages — the lighter 300 weight creates contrast against Mondwest's heavier serifs · `--font-editorial-new`
- **Substitute:** GT Super, Domaine Display, Canela
- **Weights:** 300
- **Sizes:** 60px, 140px, 240px
- **Line height:** 0.9
- **Letter spacing:** -0.02em to -0.01em
- **Role:** Secondary display face for italic-leaning editorial passages — the lighter 300 weight creates contrast against Mondwest's heavier serifs

### Times — System serif fallback for browser-rendered body copy and icon-adjacent text — deliberately old-school, reinforcing the broadsheet metaphor · `--font-times`
- **Substitute:** Times New Roman, system serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** System serif fallback for browser-rendered body copy and icon-adjacent text — deliberately old-school, reinforcing the broadsheet metaphor

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.1 | 0.11px | `--text-caption` |
| body-sm | 14px | 1.1 | 0.14px | `--text-body-sm` |
| body | 18px | 1 | -0.36px | `--text-body` |
| subheading | 60px | 0.9 | -1.2px | `--text-subheading` |
| heading-sm | 72px | 1 | -1.44px | `--text-heading-sm` |
| heading | 96px | 1 | -1.92px | `--text-heading` |
| heading-lg | 155px | 1 | -6.2px | `--text-heading-lg` |
| display | 295px | 0.9 | -11.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 50 | 50px | `--spacing-50` |
| 55 | 55px | `--spacing-55` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |
| 190 | 190px | `--spacing-190` |

### Border Radius

| Element | Value |
|---------|-------|
| pills | 10px |
| round | 9999px |
| images | 14px |
| buttons | 5px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(16, 94, 29, 0.45) 1px 8px 20px 0px` | `--shadow-lg` |
| lg-2 | `rgba(18, 146, 39, 0.25) 1px 8px 20px 0px` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 80px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Highlighter Green Action Button
**Role:** Primary CTA — the only filled, saturated button on the site

Fill #2bee4b, label #000000 in TWK Lausanne 11px / 550 uppercase with +0.01em tracking. Padding 20px 30px, radius 5px. Outer shadow rgba(16,94,29,0.45) 1px 8px 20px 0 (green-tinted, not gray) so the elevation reads as the same green bleeding outward.

### Ghost Outline Button
**Role:** Secondary action on dark sections

Transparent fill, 1px border in #fafffa, label #fafffa in TWK Lausanne 11px / 550 uppercase. Radius 10px, padding 50px 20px — the tall vertical padding makes these read as full-height menu items rather than compact buttons.

### Underlined Text Link
**Role:** Default inline link and footer navigation

No fill, no border, Times 16px / 400 with a 1px black or white underline that hugs the baseline. Underline thickness is the only structural treatment — links do not change weight or color.

### Editorial Photo Insert
**Role:** Decorative image block placed inline with headline text

Grayscale photographs (filter: grayscale(1) saturate(1) invert(0.27) sepia(0.07) saturate(10.67) hue-rotate(80deg) brightness(1.02) contrast(0.83)) cropped to small rectangular tiles, radius 14px, floating between lines of display type rather than in a grid.

### Stat Callout
**Role:** Hero metric figures (e.g. '100 M+')

Set in Newsprint Gray #516254 at display scale, no decoration — the muted color is what makes it read as editorial data rather than a hero number.

### Category Tag
**Role:** Topic labels in section grids ('Blockchain', 'Finance', 'Data')

Muted Sage #c8d2c8, TWK Lausanne 14px / 350, +0.01em tracking. No background, no border — just a tinted uppercase label.

### Navigation Wordmark
**Role:** Top-left brand lockup

TWK Lausanne bold 'New Form' with a 2px Highlighter Green underline beneath 'New'. The underline is the entire logo treatment — no icon, no lockup frame.

### Full-Bleed Accent Band
**Role:** Page section divider and footer signature

Edge-to-edge #2bee4b fill, ~640px tall, used as a visual full stop between content and footer. Contains only the wordmark 'N' in white at the top-left.

### Dark Editorial Section
**Role:** Mid-page content block over near-black

Background #121613, headline type in #fafffa at 96px / TWK Lausanne 550, body in #fafffa at 18px / 200. Ghost buttons replace filled ones on this surface.

### Footer
**Role:** Site footer

Background #121613, small-caps TWK Lausanne 11px / 550 in #fafffa for nav columns, 18px / 200 body for contact lines. Followed by the full-bleed Highlighter Green band that closes the page.

## Do's and Don'ts

### Do
- Set the hero headline in PP Mondwest 400 at 165–295px with lineHeight 0.9 and letterSpacing -0.04em — the tight tracking is what makes the type read as printed ink
- Use #2bee4b fill + #93b799 green-tinted shadow for the primary action; never use a gray drop shadow on the accent button
- Apply the grayscale + hue-rotate(80deg) filter to every photographic asset so all images read as the same tonal family as the page
- Keep the canvas at #fafffa (warm bone white) — do not use pure #ffffff, the warm tint is what separates this from a standard SaaS surface
- Use TWK Lausanne 11px / 550 uppercase with +0.01em tracking for every micro-label, nav item, and button — micro-typography does the work of chrome here
- Float editorial photo tiles (radius 14px) inline between display-type lines rather than in a grid, mirroring print layout
- Anchor every page with the full-bleed #2bee4b band before the footer; it functions as the closing signature

### Don't
- Do not introduce a second saturated accent color — green is the only chromatic note on an otherwise monochrome page
- Do not use rounded pill shapes (9999px) on the primary action button; 5px keeps it sharp and rectangular, matching the editorial tone
- Do not set body copy larger than 18px — the design relies on the size gap between 18px body and 96px+ display to create rhythm
- Do not use box-shadow on cards or content blocks; elevation lives only on the green button
- Do not render photographs in full color — they must pass through the grayscale-to-green filter to belong to the system
- Do not use sans-serif for display headlines; the Mondwest / Editorial New contrast is what gives the page its editorial voice
- Do not exceed a 1400px content width — the wide canvas with oversized type is what makes the page feel like a broadsheet

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#fafffa` | Default page background, reads as warm paper |
| 2 | Dark Section | `#121613` | Mid-page editorial break and footer background |
| 3 | Accent Band | `#2bee4b` | Full-bleed brand band, primary action surface, active state underline |

## Elevation

Elevation is used sparingly and only on the primary action. The green button carries a green-tinted shadow (rgba(16,94,29,0.45) 1px 8px 20px 0) so the depth belongs to the accent system rather than reading as generic gray UI elevation. All other surfaces — cards, sections, images — are flat with hairline 1px borders or no border at all; structure comes from typography, spacing, and color contrast rather than shadow.

## Imagery

All photography is grayscale processed through a filter chain (grayscale → invert 0.27 → sepia 0.07 → saturate 10.67 → hue-rotate 80deg) that tints shadows toward the brand green. Images are cropped as small rectangular tiles (roughly 200×140px), radius 14px, placed inline between lines of display type rather than in grid cells. No full-bleed hero image, no overlapping media, no lifestyle photography — every image is a documentary-style editorial insert (architecture, people in financial contexts) that interrupts the typographic flow. Icons are minimal stroke marks in #000000 or #fafffa, no multicolor iconography.

## Layout

Full-bleed editorial canvas capped at ~1400px content width. The hero is a typographic wall: oversized Mondwest/Editorial New headline (165–295px) with small grayscale photo tiles floated between the lines. Navigation is a minimal top bar — wordmark left, 'Menu' with a green three-bar icon right. Below the hero, content alternates between wide Bone White sections with 80px vertical breathing room and a near-black (#121613) editorial block containing ghost-outline buttons. A category grid uses 3–4 columns with muted sage tags and stat callouts in Newsprint Gray. The page closes with a dark footer followed by a full-bleed #2bee4b accent band. Section gaps are generous (80px), element gaps sit at 20px, and the page reads vertically like a printed broadsheet rather than a SaaS dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- text: #121613 on light surfaces, #fafffa on dark surfaces
- background (canvas): #fafffa
- surface (dark section / footer): #121613
- border: #232924 or hairline #000000
- accent (footer band, active nav): #2bee4b
- primary action: #2bee4b (filled action)

**Example Component Prompts**
1. *Hero editorial headline block*: 1400px max-width centered on #fafffa canvas. Headline in PP Mondwest at 165px, weight 400, lineHeight 0.9, letterSpacing -6.6px, color #121613. Three grayscale photo tiles (radius 14px) floated inline between the lines, each passing through filter: grayscale(1) saturate(1) invert(0.27) sepia(0.07) saturate(10.67) hue-rotate(80deg) brightness(1.02) contrast(0.83).
2. *Highlighter Green action button*: Fill #2bee4b, label in TWK Lausanne 11px / 550 uppercase, letterSpacing +0.11px, color #000000. Padding 20px 30px, border-radius 5px, box-shadow rgba(16,94,29,0.45) 1px 8px 20px 0. Arrow icon in #000000 sits to the right of the label.
3. *Dark editorial section*: Full-width #121613 background, max-width content container 1400px. Headline at 96px TWK Lausanne 550, lineHeight 1.0, letterSpacing -1.92px, color #fafffa. Body copy 18px TWK Lausanne 200, lineHeight 1.0, letterSpacing -0.36px, color #fafffa. Ghost button: transparent fill, 1px solid #fafffa border, radius 10px, padding 50px 20px, label 11px uppercase #fafffa.
4. *Category tag row*: Muted Sage #c8d2c8 label, TWK Lausanne 14px / 350, letterSpacing +0.14px. No fill, no border, 20px gap between tags. Used above section headlines and in stat grids.
5. *Full-bleed accent band*: Edge-to-edge #2bee4b fill, 640px tall. Wordmark 'N' in TWK Lausanne bold #fafffa, positioned top-left with 50px padding. No additional content — the band is the closing signature.

## Typography Stacking

The system relies on three display faces playing off each other: PP Mondwest (serif, weight 400, tightest -0.04em) for the wordmark and biggest statements; Editorial New (lighter serif, weight 300) for italic-leaning editorial pull-quotes; TWK Lausanne (grotesque) for everything UI and for the 96–155px sub-display headlines that alternate with the serif. The contrast between Mondwest's heavy block and Lausanne's sharp sans at the same physical size is what makes the page feel like a printed spread rather than a single-voice website. Body and micro-labels stay in TWK Lausanne at 11–18px; the system Times fallback handles any rendered browser text.

## Image Treatment

Every photographic asset passes through the same filter chain: grayscale(1) saturate(1) invert(0.27) sepia(0.07) saturate(10.67) hue-rotate(80deg) brightness(1.02) contrast(0.83). The 80-degree hue rotation after a partial invert pushes the monochrome into the green family — blacks become deep green-blacks, whites become bone, midtones pick up a sage cast. This filter is applied at the asset level so it works on any uploaded image without per-asset color grading. Result: the entire site reads as a two-tone green duotone regardless of the original photograph's content.

## Similar Brands

- **Stripe** — Same generous white-canvas editorial typography at massive scale, with the brand voice carried by type weight rather than color
- **Koto Studio** — Same brutalist-meets-editorial approach: oversized mixed serif/grotesque display type, monochrome pages, a single vivid accent
- **Index Ventures** — Same investment-firm broadsheet language — typographic hero, small grayscale documentary inserts, near-black section breaks, no decorative chrome
- **A24** — Same single-accent-on-monochrome treatment with the accent functioning as a highlighter over otherwise black-and-white layouts

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #fafffa;
  --color-press-black: #121613;
  --color-typesetter-ink: #000000;
  --color-slate-verdant: #232924;
  --color-newsprint-gray: #516254;
  --color-muted-sage: #c8d2c8;
  --color-highlighter-green: #2bee4b;
  --color-shadow-moss: #93b799;
  --color-echo-green: #c4e4c9;

  /* Typography — Font Families */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-mondwest: 'PP Mondwest', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --tracking-caption: 0.11px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.1;
  --tracking-body-sm: 0.14px;
  --text-body: 18px;
  --leading-body: 1;
  --tracking-body: -0.36px;
  --text-subheading: 60px;
  --leading-subheading: 0.9;
  --tracking-subheading: -1.2px;
  --text-heading-sm: 72px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -1.44px;
  --text-heading: 96px;
  --leading-heading: 1;
  --tracking-heading: -1.92px;
  --text-heading-lg: 155px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -6.2px;
  --text-display: 295px;
  --leading-display: 0.9;
  --tracking-display: -11.8px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-w350: 350;
  --font-weight-regular: 400;
  --font-weight-w550: 550;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-55: 55px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-190: 190px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 80px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4.9968px;
  --radius-lg: 9.9936px;
  --radius-xl: 14px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-pills: 10px;
  --radius-round: 9999px;
  --radius-images: 14px;
  --radius-buttons: 5px;

  /* Shadows */
  --shadow-lg: rgba(16, 94, 29, 0.45) 1px 8px 20px 0px;
  --shadow-lg-2: rgba(18, 146, 39, 0.25) 1px 8px 20px 0px;

  /* Surfaces */
  --surface-canvas: #fafffa;
  --surface-dark-section: #121613;
  --surface-accent-band: #2bee4b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #fafffa;
  --color-press-black: #121613;
  --color-typesetter-ink: #000000;
  --color-slate-verdant: #232924;
  --color-newsprint-gray: #516254;
  --color-muted-sage: #c8d2c8;
  --color-highlighter-green: #2bee4b;
  --color-shadow-moss: #93b799;
  --color-echo-green: #c4e4c9;

  /* Typography */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-mondwest: 'PP Mondwest', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --tracking-caption: 0.11px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.1;
  --tracking-body-sm: 0.14px;
  --text-body: 18px;
  --leading-body: 1;
  --tracking-body: -0.36px;
  --text-subheading: 60px;
  --leading-subheading: 0.9;
  --tracking-subheading: -1.2px;
  --text-heading-sm: 72px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -1.44px;
  --text-heading: 96px;
  --leading-heading: 1;
  --tracking-heading: -1.92px;
  --text-heading-lg: 155px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -6.2px;
  --text-display: 295px;
  --leading-display: 0.9;
  --tracking-display: -11.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-55: 55px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-190: 190px;

  /* Border Radius */
  --radius-md: 4.9968px;
  --radius-lg: 9.9936px;
  --radius-xl: 14px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-lg: rgba(16, 94, 29, 0.45) 1px 8px 20px 0px;
  --shadow-lg-2: rgba(18, 146, 39, 0.25) 1px 8px 20px 0px;
}
```
