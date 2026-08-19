# 12th Berlin Biennale for Contemporary Art — Style Reference
> Iris-and-ink broadsheet — violet skies over monumental black type on white paper.

**Theme:** light

The 12th Berlin Biennale reads as an iris-and-ink broadsheet: white paper canvas, monumental black geometric forms, and a single saturated violet (#7373ff) that functions as sky, border, and accent simultaneously. The system is editorial and constructivist — overlapping rectangular shapes at display scale carry the brand, while a geometric grotesque (ABCMonumentGrotesk) pairs with a transitional serif (BradfordLL) to create a high-contrast, catalog-like rhythm. Interactions are tight and rectilinear: 3px corners, 4px base spacing, hairline black or violet borders, and almost no shadow or gradient — visual weight comes from type size and color, not elevation. The page is text- and information-dense rather than spacious, with compact nav, overlapping panels, and event cards stacked close together like a biennale program leaflet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris Violet | `#7373ff` | `--color-iris-violet` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Deep Iris | `#23234d` | `--color-deep-iris` | Decorative SVG fill for large geometric shapes and map elements — a darker register of the brand violet used for tonal depth inside illustrations, not for UI |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, hairline borders on neutral actions and nav dividers, and the fill for the monumental hero shapes that overlap the headline |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text, and input backgrounds. The base layer everything else sits on |
| Ash Gray | `#f2f2f2` | `--color-ash-gray` | Subtle surface fill for link backgrounds, list rows, and secondary button states — a quiet wash that distinguishes hover/focus from pure white without introducing chroma |
| Mist Gray | `#e7e7e7` | `--color-mist-gray` | Nav panel background and low-emphasis surface tone — sits one step below Ash Gray for the overlapping side panel |

## Tokens — Typography

### ABCMonumentGrotesk — Primary grotesque used for nav, headings, event cards, buttons, and most UI labels. The geometric construction and tight tracking give the site its editorial, catalog-like authority. Weight 400 carries body and nav; 700 is reserved for section headings and emphasis. Line-heights collapse to near-1.0 at display sizes — the type sits as flat architectural mass on the page. · `--font-abcmonumentgrotesk`
- **Substitute:** Inter, Space Grotesk, or Neue Haas Grotesk
- **Weights:** 400, 700
- **Sizes:** 12, 14, 16, 17, 19, 20, 22, 25, 29, 32px
- **Line height:** 1.02–1.20 for headings, 2.00–2.40 for nav and list rows
- **Letter spacing:** -0.01em at display sizes, -0.004em at body, 0.01em for uppercase UI labels
- **Role:** Primary grotesque used for nav, headings, event cards, buttons, and most UI labels. The geometric construction and tight tracking give the site its editorial, catalog-like authority. Weight 400 carries body and nav; 700 is reserved for section headings and emphasis. Line-heights collapse to near-1.0 at display sizes — the type sits as flat architectural mass on the page.

### BradfordLL — Transitional serif used for long-form body copy, about-section paragraphs, and venue descriptions. Pairs with the grotesque to create a printed-publication rhythm — grotesque for chrome and headlines, serif for reading. The contrast between angular sans and humanist serif is the system's typographic signature. · `--font-bradfordll`
- **Substitute:** Source Serif 4, Tiempos Text, or PT Serif
- **Weights:** 400
- **Sizes:** 20, 23, 30px
- **Line height:** 1.03–1.15
- **Letter spacing:** -0.01em
- **Role:** Transitional serif used for long-form body copy, about-section paragraphs, and venue descriptions. Pairs with the grotesque to create a printed-publication rhythm — grotesque for chrome and headlines, serif for reading. The contrast between angular sans and humanist serif is the system's typographic signature.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 14 | 0.12px | `--text-caption` |
| body-sm | 14px | 17 | — | `--text-body-sm` |
| body-lg | 17px | 20 | — | `--text-body-lg` |
| subheading | 19px | 23 | — | `--text-subheading` |
| heading-sm | 22px | 23 | — | `--text-heading-sm` |
| heading | 25px | 26 | — | `--text-heading` |
| heading-lg | 29px | 30 | — | `--text-heading-lg` |
| display | 32px | 33 | -0.32px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 3px |
| cards | 3-7px |
| inputs | 7px |
| buttons | 3px |
| navPills | 44px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 32px
- **Card padding:** 12px
- **Element gap:** 5-12px

## Components

### Overlapping Side Nav Panel
**Role:** Primary site navigation

Dark Obsidian (#000000) panel that overlaps the left edge of the page when activated. Contains nav links in ABCMonumentGrotesk 16-17px, white text, with hairline 1px white dividers between groups. Secondary links (Visit, Contact, Press) sit in a white sub-bar at the top with black 1px borders. Language switcher and search field stack at the bottom. The panel is the most visually dominant UI element — it declares the system as editorial, not corporate.

### Violet Outlined Action Button
**Role:** Primary interactive action

Transparent fill with 1-2px Iris Violet (#7373ff) border, Iris Violet text, ABCMonumentGrotesk 14-16px weight 700. 3px corner radius, 5-7px vertical padding, 11-12px horizontal padding. Used for nav items, tag pills, and program links. The violet border IS the brand signal — there is no filled violet button variant in the system.

### Neutral Outlined Button
**Role:** Secondary action

White fill with 1px Obsidian border, black text, 3px radius, 3-6px vertical and 5-11px horizontal padding. ABCMonumentGrotesk 14-16px. Used for language switcher (EN/DE), utility links, and less prominent actions.

### Pill Nav Button
**Role:** Top-bar utility actions (Guide, Menu)

White fill, 1px Obsidian border, 44px corner radius (fully rounded), ABCMonumentGrotesk 14px. The 'Guide' and 'Menu' buttons that anchor the top-left of every screen.

### Search Input
**Role:** Search field

White fill, 1px Obsidian border, 7px corner radius, ABCMonumentGrotesk 16px placeholder. Magnifying-glass icon button in 16px to the right. 8-10px padding all sides.

### Program Tag Pill
**Role:** Event category filter

White fill, 1px Obsidian border, 3px radius, ABCMonumentGrotesk 12-14px weight 700 uppercase. Compact 2-3px vertical padding, 11-12px horizontal. Tags like 'Performance', 'Guided Tour' that sit inside event cards.

### Event Card
**Role:** Program listing entry

White surface, 1px Obsidian border, 3-7px radius, 12px padding. Date row in 12px uppercase, title in ABCMonumentGrotesk 19-25px, venue line in 12px. Some event cards have a dark Obsidian variant with white text and Iris Violet accents. Cards stack vertically and are information-dense rather than spacious.

### Venue Card
**Role:** Venue directory entry

White surface, 1px Obsidian border, 7px radius, 12-16px padding. Letter label (A, B, C) at top, venue name in ABCMonumentGrotesk 19-25px, action links (Info, Program, Artists, Directions) as small outlined buttons below. Compact, directory-card feel.

### Hero Date Block
**Role:** Exhibition date display

Iris Violet (#7373ff) full-bleed background section with large ABCMonumentGrotesk 29-32px text in Obsidian or white. Dates stack vertically with tight line-height. This is the brand's most identifiable surface — the violet sky over the event.

### Overlapping Hero Type Block
**Role:** Display headline container

Massive Obsidian (#000000) filled rectangles and half-circles that overlap the Iris Violet background, with ABCMonumentGrotesk 32px+ display text in Iris Violet sitting on top. The shapes ARE the layout — the '12' numeral and 'Berlin Biennale for Contemporary Art' title sit inside and beside these forms. This is the system's signature visual.

### Language Switcher
**Role:** Locale selector

Compact group of 3 outlined buttons (EN, DE, Easy Language), 3px radius, 1px Obsidian border, ABCMonumentGrotesk 12px. Sits at the bottom of the side nav panel.

### Map Overlay
**Role:** Venue map

Iris Violet background with deep iris line work for streets. White diamond-shaped venue markers labeled A–F. No conventional map chrome — the map is treated as a brand-colored graphic, not a utility.

### Info Card
**Role:** About / descriptive text block

White surface, no border or shadow, ABCMonumentGrotesk 19px for the 'About' label and BradfordLL 20-30px for the paragraph text. The serif body is the strongest typographic contrast in the system and signals 'readable content' vs. navigational chrome.

## Do's and Don'ts

### Do
- Use Iris Violet (#7373ff) for section backgrounds, outlined action borders, and heading accents — it is the only chromatic color and should appear at scale, not as a tiny dot.
- Pair ABCMonumentGrotesk for all UI, nav, and headlines with BradfordLL for long-form body copy — the grotesque/serif contrast is the system's typographic signature.
- Use 3px border-radius for buttons, tags, and links; 7px for inputs and cards; 44-64px for pill-shaped nav buttons only.
- Build visual hierarchy with type size and color contrast, never with box-shadow — the design is flat and printed, not elevated.
- Set body and nav text in ABCMonumentGrotesk with line-height 2.0-2.4 for generous row spacing in compact lists; collapse line-height to 1.02-1.15 at display sizes.
- Let large Obsidian (#000000) shapes overlap content sections as graphic architecture — flat rectangles, half-circles, and irregular polygons placed behind or beside display text.
- Use 1px Obsidian borders as the default divider and component outline; Iris Violet borders are reserved for the most important interactive elements.

### Don't
- Do not add box-shadow, blur, or drop-shadow effects to any component — the system is deliberately flat.
- Do not use gradient fills — the palette is entirely solid color.
- Do not introduce additional chromatic colors; the only saturated hue is Iris Violet.
- Do not use Filled violet buttons as primary CTAs — the system uses outlined violet actions and neutral outlined buttons, not filled chromatic buttons.
- Do not set body text in ABCMonumentGrotesk; serif (BradfordLL) is reserved for paragraphs to create the grotesque/serif rhythm.
- Do not use large corner radii (12px+) on standard buttons, tags, or cards — only pill-shaped nav elements get 44px+ radii.
- Do not place content on a colored background without considering the overlap behavior — sections are designed to layer, not sit in isolated containers.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base canvas and content card background |
| 1 | Ash Gray | `#f2f2f2` | Subtle wash for list rows, link hovers, and soft button states |
| 2 | Mist Gray | `#e7e7e7` | Overlapping side-panel surface, one step recessed from content |
| 3 | Iris Violet | `#7373ff` | Section-background canvas for date/title blocks and event overlays |
| 4 | Obsidian | `#000000` | Hero shape fills and full-bleed dark bands |

## Elevation

The system deliberately avoids box-shadow elevation. Visual hierarchy is built through type scale, color contrast, overlapping flat shapes, and hairline 1px borders. Components feel printed rather than floating.

## Imagery

Imagery is minimal and graphic — the system itself is the visual. Large flat geometric shapes (rectangles, half-circles, polygons) in Obsidian and Iris Violet serve as the primary visual content, functioning as both layout structure and branding. Event cards and venue markers provide the only representational content. The map is stylized as a violet-tinted line drawing rather than a realistic map. No photography, no illustration, no 3D renders — the aesthetic is constructivist broadsheet, not image-heavy editorial.

## Layout

Full-bleed page with no fixed max-width containment; sections span edge to edge. The hero uses an Iris Violet background with massive overlapping Obsidian shapes carrying the '12' numeral and 'Berlin Biennale for Contemporary Art' display headline. Content sections alternate between white canvas and Iris Violet full-bleed bands. A dark side-nav panel overlaps the left edge from any position on the page. Below the hero, content flows as a compact, information-dense stack: program tags row, about paragraph, event cards in a grid (3 columns), venue cards, and a full-width venue map. Event cards alternate between white and Obsidian variants for rhythm. Spacing between sections is tight (32px) — the page reads as a single broadsheet, not as isolated screens.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (neutral) or #7373ff (interactive)
- accent: #7373ff (Iris Violet)
- surface wash: #f2f2f2
- primary action: #7373ff (outlined action border)

**3-5 Example Component Prompts**

1. Create a hero section: Iris Violet (#7373ff) full-bleed background. Display headline 'Berlin Biennale for Contemporary Art' in ABCMonumentGrotesk 32px weight 400, letter-spacing -0.32px, color #000000. Overlay two Obsidian (#000000) filled rectangles behind the text — one tall narrow rectangle left-aligned containing a '12' numeral in ABCMonumentGrotesk 32px Iris Violet, and one half-circle on the right. No box-shadow, no gradient.

2. Create an outlined violet action button: 1px Iris Violet (#7373ff) border, transparent fill, text 'Tickets' in ABCMonumentGrotesk 14px weight 700, color #7373ff, 3px corner radius, 5px vertical padding, 11px horizontal padding. Group four such buttons in a horizontal row with 12px gap between them.

3. Create an event card: white surface, 1px #000000 border, 3px radius, 12px padding all sides. Top row: date '18.9. SUNDAY 4 pm' in ABCMonumentGrotesk 12px weight 700 uppercase, letter-spacing 0.12px. Title 'Guided Tour (English)' in ABCMonumentGrotesk 22px weight 400, color #000000. Venue line 'Hamburger Bahnhof — Museum für Gegenwart — Berlin · Guided Tour' in ABCMonumentGrotesk 12px, color #000000. No shadow.

4. Create a program tag pill: 1px #000000 border, white fill, text 'Performance' in ABCMonumentGrotesk 12px weight 700 uppercase, 3px radius, 3px vertical padding, 11px horizontal padding. Place two such tags side by side with 4px gap.

5. Create a venue map section: Iris Violet (#7373ff) full-bleed background. White diamond-shaped markers (14px, rotated 45°) labeled A through F in ABCMonumentGrotesk 14px weight 700. Street network rendered as 1px #23234d lines on the violet background. No map controls, no legend, no zoom — the map is decorative, not functional.

## Similar Brands

- **ICA (Institute of Contemporary Arts)** — Same editorial broadsheet approach with high-contrast type, single accent color, and overlapping geometric hero blocks over flat color sections.
- **MCA Chicago** — Museum site using Monument-Grotesk-family type, flat color blocks, and minimal border-radius on all components.
- **Manifesta** — European biennale platform with constructivist layout — full-bleed violet/color sections, hairline borders, compact card grids, and display-scale numerals.
- **Serpentine Galleries** — Contemporary art institution site that pairs a geometric grotesque for nav with serif for long-form text, and uses a single saturated brand color against black and white.
- **KW Institute for Contemporary Art** — Berlin contemporary-art peer with flat-shape hero compositions, tight 4px-base spacing, and a design-forward rather than utility-first approach.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris-violet: #7373ff;
  --color-deep-iris: #23234d;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #f2f2f2;
  --color-mist-gray: #e7e7e7;

  /* Typography — Font Families */
  --font-abcmonumentgrotesk: 'ABCMonumentGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bradfordll: 'BradfordLL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 14;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 17;
  --text-body-lg: 17px;
  --leading-body-lg: 20;
  --text-subheading: 19px;
  --leading-subheading: 23;
  --text-heading-sm: 22px;
  --leading-heading-sm: 23;
  --text-heading: 25px;
  --leading-heading: 26;
  --text-heading-lg: 29px;
  --leading-heading-lg: 30;
  --text-display: 32px;
  --leading-display: 33;
  --tracking-display: -0.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 32px;
  --card-padding: 12px;
  --element-gap: 5-12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 7px;
  --radius-3xl: 28.6839px;
  --radius-3xl-2: 44.129px;
  --radius-full: 64px;

  /* Named Radii */
  --radius-tags: 3px;
  --radius-cards: 3-7px;
  --radius-inputs: 7px;
  --radius-buttons: 3px;
  --radius-navpills: 44px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-ash-gray: #f2f2f2;
  --surface-mist-gray: #e7e7e7;
  --surface-iris-violet: #7373ff;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris-violet: #7373ff;
  --color-deep-iris: #23234d;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #f2f2f2;
  --color-mist-gray: #e7e7e7;

  /* Typography */
  --font-abcmonumentgrotesk: 'ABCMonumentGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bradfordll: 'BradfordLL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 14;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 17;
  --text-body-lg: 17px;
  --leading-body-lg: 20;
  --text-subheading: 19px;
  --leading-subheading: 23;
  --text-heading-sm: 22px;
  --leading-heading-sm: 23;
  --text-heading: 25px;
  --leading-heading: 26;
  --text-heading-lg: 29px;
  --leading-heading-lg: 30;
  --text-display: 32px;
  --leading-display: 33;
  --tracking-display: -0.32px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 7px;
  --radius-3xl: 28.6839px;
  --radius-3xl-2: 44.129px;
  --radius-full: 64px;
}
```
