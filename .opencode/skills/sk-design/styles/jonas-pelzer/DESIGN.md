# Jonas Pelzer — Style Reference
> Literary broadsheet on white paper. A single weight-400 display headline sets the tone — roman and italic interleave in one breath, all type shares one weight, and a rationed violet ink punctuates an otherwise achromatic page.

**Theme:** light

A literary editorial portfolio rendered as a typographic broadsheet on white paper. The page reads like a magazine spread: a single weight-400 display headline mixes roman and italic to create rhythm without resorting to bold, every paragraph earns its place, and the entire chromatic system is reduced to a single violet ink. The brand violet (#3502ff) is rationed — appearing only as the active nav pill, an active border accent, and a single deep text link — while a softer lavender wash (#c2b3ff) provides surface variety on accent cards. Spacing is compact and the grid is opinionated, with hard-edged 12px radii everywhere and almost no shadow depth. The visual system rewards restraint: negative space, type weight, and a single accent color do the work that color, elevation, and decoration do elsewhere.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, nav backgrounds |
| Ink Black | `#000000` | `--color-ink-black` | All text, hairline borders, dividers, list separators |
| Mist Gray | `#d4d6dd` | `--color-mist-gray` | Secondary borders, card outlines, inactive dividers |
| Violet Ink | `#3502ff` | `--color-violet-ink` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Lavender Wash | `#c2b3ff` | `--color-lavender-wash` | Accent card surfaces, large decorative blocks, soft section backgrounds |
| Lavender Whisper | `#d7ccff` | `--color-lavender-whisper` | Outlined nav pill border, ghost button border — violet at a quarter saturation so inactive actions whisper rather than shout |
| Deep Iris | `#5d35ff` | `--color-deep-iris` | Violet text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |

## Tokens — Typography

### Scope — Display, headings, nav, buttons — carries the entire structural and interactive voice. Only weight 400 exists; the font does not push louder, it stays calm even at 42px because letter-spacing opens up around it. Nav and buttons stay at 13–14px; the hero display reaches 42px. · `--font-scope`
- **Substitute:** Inter, Söhne, Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 13px, 14px, 17px, 22px, 42px
- **Line height:** 1.00–1.20
- **Letter spacing:** 0.02em at 17–22px, 0.036em at 13–14px
- **OpenType features:** `"ss01" on, "cv01" on, "tnum" on`
- **Role:** Display, headings, nav, buttons — carries the entire structural and interactive voice. Only weight 400 exists; the font does not push louder, it stays calm even at 42px because letter-spacing opens up around it. Nav and buttons stay at 13–14px; the hero display reaches 42px.

### Signifier — Body copy, links, list items, footer, long-form paragraphs — the reading voice. Slightly larger minimum (15px) than Scope at 13px, and the only font that appears in the hero italic (the headline mixes roman Scope with italic Signifier). Rationed at 400; weight 400 at 42px is an editorial choice, not a limitation. · `--font-signifier`
- **Substitute:** Source Serif Pro, Tiempos Text, Söhne Mono
- **Weights:** 400
- **Sizes:** 15px, 16px, 18px, 22px, 25px, 42px
- **Line height:** 1.00–1.20
- **Letter spacing:** 0.02em
- **OpenType features:** `"kern" on, "liga" on, "onum" on`
- **Role:** Body copy, links, list items, footer, long-form paragraphs — the reading voice. Slightly larger minimum (15px) than Scope at 13px, and the only font that appears in the hero italic (the headline mixes roman Scope with italic Signifier). Rationed at 400; weight 400 at 42px is an editorial choice, not a limitation.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | 0.47px | `--text-caption` |
| body-sm | 15px | 1.2 | 0.3px | `--text-body-sm` |
| body | 17px | 1.2 | 0.34px | `--text-body` |
| subheading | 22px | 1.1 | 0.44px | `--text-subheading` |
| heading | 25px | 1.1 | 0.5px | `--text-heading` |
| display | 42px | 1 | 0.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 12px |
| small | 3.5px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(53, 2, 255, 0.1) 0px 1px 4px 2px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Editorial Display Headline
**Role:** Hero section typographic statement

42px Scope weight 400 in roman and italic alternation within a single sentence, letter-spacing 0.02em, color Ink Black on Paper White. The signature move: words like 'is a' and 'for' and 'and' drop to italic Signifier while content words stay roman Scope. Left-aligned, never centered. Padding 20px below to first paragraph.

### Active Nav Pill
**Role:** Current page indicator in nav strip

12px radius, fill #3502ff (Violet Ink), text 13px Scope weight 400, color #ffffff, padding 6px 14px, letter-spacing 0.036em. The single bold chromatic element on the page; it earns its color by marking where the user is.

### Inactive Nav Pill
**Role:** Secondary nav item

12px radius, transparent fill, 1px border #d7ccff (Lavender Whisper), text 13px Scope weight 400 in Ink Black, padding 6px 14px, letter-spacing 0.036em. Ghost outlined — quiet, recedes behind the active pill.

### Project Card (White)
**Role:** Default project entry card

12px radius, #ffffff fill, 1px hairline border in Mist Gray (#d4d6dd), 16px padding. Project image fills top, title and meta in Signifier 15–16px Ink Black. No shadow; the border does the elevation.

### Project Card (Lavender Fill)
**Role:** Accent surface card, featured grid slot

12px radius, solid #c2b3ff (Lavender Wash) fill, no border, 16px padding. Functions as a color block in the grid — same dimensions as white cards but inverted into a decorative accent. Use sparingly: one per row maximum.

### Body Paragraph
**Role:** Hero description, long-form copy

Signifier 17–18px weight 400, line-height 1.2, letter-spacing 0.02em, Ink Black on Paper White. Centered or left-aligned in a ~640px column. No bold, no italic emphasis inline — emphasis comes from the surrounding type hierarchy, not weight.

### Feature Card (Magazine Layout)
**Role:** Large project showcase with typography and image grid

12px radius, white surface with hairline Mist Gray border, internal layout: oversized dotted/display title (Scope 25–42px), body subhead in Signifier, 2×2 image thumbnail grid below. Treats the project as a magazine spread rather than a tile.

### Year Index List
**Role:** Chronological project timeline in footer

Horizontal row of 2-digit year labels (01, 02, 03 … 09), each 14px Scope weight 400, letter-spacing 0.036em, Ink Black, separated by 16px gaps. The current year highlights in Violet Ink. Functions as both navigation and archive.

### Footer Link Group
**Role:** Social and contact links

Inline group of 11–15px Signifier links, 15px padding-right between items, Ink Black, 1px hairline divider above. Links transition to Deep Iris (#5d35ff) on hover — the only place Deep Iris appears.

### Inline Text Link
**Role:** Inline reference links within body copy

Signifier at body size, Ink Black with 1px underline, 15px padding-right when grouped. Underline is the only link treatment — no color shift in resting state; color arrives on hover via Deep Iris.

## Do's and Don'ts

### Do
- Set every text element to weight 400 — no bold, no semi-bold. Hierarchy comes from size and letter-spacing, never weight.
- Use Violet Ink (#3502ff) only for the active nav pill and one primary brand mark per page. Never as a button background fill on other surfaces.
- Pair Scope (sans) for headings/nav with Signifier (serif/italic) for body — and mix roman and italic within a single display sentence to create typographic music.
- Apply 12px radius to every interactive element: nav pills, buttons, cards. The consistency is the design.
- Set all text on Paper White (#ffffff) and use Lavender Wash (#c2b3ff) only for full-bleed accent card fills, never as a text background or row striping.
- Use 1px hairline borders (Mist Gray #d4d6dd or Ink Black #000000) instead of shadows for separation. The one permitted shadow is the violet-tinted rgba(53,2,255,0.1) on active nav.
- Keep section gaps at 64px and let the page breathe with generous left/right margins — the compact padding applies inside components, not between them.

### Don't
- Don't introduce any weight other than 400. No 500, 600, 700. The system has one voice.
- Don't use Violet Ink (#3502ff) as a filled button background for general CTAs — the active nav pill is the only place that fill appears.
- Don't add drop shadows beyond the single violet-tinted nav shadow. Cards and panels must rely on hairline borders for definition.
- Don't center the hero headline. It is always left-aligned, magazine-style. Centering kills the editorial voice.
- Don't use rounded radii above 12px. The page is crisp and architectural, not soft or playful.
- Don't introduce additional accent colors. The palette is black, white, gray, and three violets — that is the entire chromatic vocabulary.
- Don't use negative letter-spacing. All type uses positive tracking (0.02em–0.036em); tight tracking belongs to a different design system.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Default page background, primary content canvas |
| 1 | Lavender Block | `#c2b3ff` | Accent card surface, decorative color blocks, featured item wash |
| 2 | Ink Ground | `#000000` | Footer band, nav strip — dark reverse for terminal UI |

## Elevation

- **Active Nav Pill:** `rgba(53, 2, 255, 0.1) 0px 1px 4px 2px`

## Imagery

Imagery is project-driven and editorial: architectural and product photography, mostly daytime and natural-light, presented as tight crops without lifestyle context. The featured project card arranges images in a 2×2 grid like a magazine layout. A yellow accent block appears in one section (likely a project hero), and lavender blocks serve as decorative color washes rather than image containers. The page is text-dominant overall — images support the work, they don't replace it.

## Layout

Page model is max-width contained (~1400px), left-aligned editorial rather than centered marketing. The hero is a typographic block on the left, not a full-bleed image or split layout. Below the hero, a 3-column grid mixes white project cards with lavender accent blocks — at least one lavender fill per row creates visual rhythm. Sections are separated by generous 64px gaps on Paper White. The nav strip is a horizontal pill row at the page bottom (not the top), with the active pill filled violet and the rest ghost-outlined. A year index (01–09) and social footer close the page. No sidebar, no sticky header, no mega-menu — the structure is closer to a print layout than a web app.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink Black)
- background: #ffffff (Paper White)
- border: #d4d6dd (Mist Gray) for secondary, #000000 for structural
- accent surface: #c2b3ff (Lavender Wash)
- accent border (ghost): #d7ccff (Lavender Whisper)
- primary action: #d7ccff (outlined action border)
- hover/secondary accent: #5d35ff (Deep Iris)

**Example Component Prompts**

1. Build a hero display headline at 42px on white. Mix Scope weight 400 roman with Signifier italic weight 400 in the same sentence (e.g. 'JONAS PELZER is a DESIGNER for WEBSITES and DIGITAL PRODUCTS'). Letter-spacing 0.02em, Ink Black (#000000), left-aligned, max-width 900px. Body paragraph below in Signifier 18px line-height 1.2, same color, max-width 640px.

2. Build a nav strip with 5 pill buttons in a horizontal row. The first is the active state: 12px radius, fill #3502ff, white Scope 13px weight 400 text, 6px 14px padding, letter-spacing 0.036em, with the single permitted shadow rgba(53,2,255,0.1) 0px 1px 4px 2px. The remaining four are ghost: 12px radius, transparent fill, 1px border #d7ccff, Ink Black Scope 13px text, same padding.

3. Build a 3-column project card grid. Column 1: lavender accent card, 12px radius, #c2b3ff fill, no text, 16px padding — pure color block. Column 2: white feature card with 1px Mist Gray border, 12px radius, 16px padding, Scope 25px display title + Signifier 15px meta + 2×2 image grid below. Column 3: another lavender accent card matching column 1. 16px gap between columns.

4. Build a year index list as a single horizontal row: '01  02  03  04  05  06  07  08  09' in Scope 14px weight 400, letter-spacing 0.036em, Ink Black, 16px gap between items. Highlight the current year (08) in Violet Ink #3502ff. 1px Ink Black hairline above the row as divider.

5. Build a footer link group: horizontal inline list of 4–6 social links (ABOUT, AWARDS, CAREER, CONTACT) in Signifier 15px weight 400, Ink Black, 15px padding-right between items, separated from content above by a 1px Mist Gray border. No background fill, no icons — text only.

## Similar Brands

- **Are.na** — Same editorial restraint, single-weight typography, and rationed color — both feel like quiet broadsheets rather than product pages
- **Hicksdesign** — Personal portfolio with a single accent color, hairline borders instead of shadows, and display type that mixes weights and styles within a single sentence
- **Rauno Freiberg** — Compact dense layout, violet-adjacent accent palette, and a nav system that lives at the bottom rather than the top
- **Frank Chimero** — Magazine-spread layout, literary type pairing, and a near-achromatic palette with one chromatic brand mark

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-mist-gray: #d4d6dd;
  --color-violet-ink: #3502ff;
  --color-lavender-wash: #c2b3ff;
  --color-lavender-whisper: #d7ccff;
  --color-deep-iris: #5d35ff;

  /* Typography — Font Families */
  --font-scope: 'Scope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-signifier: 'Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 0.47px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.3px;
  --text-body: 17px;
  --leading-body: 1.2;
  --tracking-body: 0.34px;
  --text-subheading: 22px;
  --leading-subheading: 1.1;
  --tracking-subheading: 0.44px;
  --text-heading: 25px;
  --leading-heading: 1.1;
  --tracking-heading: 0.5px;
  --text-display: 42px;
  --leading-display: 1;
  --tracking-display: 0.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 3.5px;
  --radius-lg: 8.26px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 12px;
  --radius-small: 3.5px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-sm: rgba(53, 2, 255, 0.1) 0px 1px 4px 2px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-lavender-block: #c2b3ff;
  --surface-ink-ground: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-mist-gray: #d4d6dd;
  --color-violet-ink: #3502ff;
  --color-lavender-wash: #c2b3ff;
  --color-lavender-whisper: #d7ccff;
  --color-deep-iris: #5d35ff;

  /* Typography */
  --font-scope: 'Scope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-signifier: 'Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 0.47px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: 0.3px;
  --text-body: 17px;
  --leading-body: 1.2;
  --tracking-body: 0.34px;
  --text-subheading: 22px;
  --leading-subheading: 1.1;
  --tracking-subheading: 0.44px;
  --text-heading: 25px;
  --leading-heading: 1.1;
  --tracking-heading: 0.5px;
  --text-display: 42px;
  --leading-display: 1;
  --tracking-display: 0.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 3.5px;
  --radius-lg: 8.26px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-sm: rgba(53, 2, 255, 0.1) 0px 1px 4px 2px;
}
```
