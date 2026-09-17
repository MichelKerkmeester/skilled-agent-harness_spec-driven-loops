# Quizlet — Style Reference
> color-coded classroom on white — a quiet study desk where four pastel flashcards are the only splash of color against cool gray walls and a single indigo highlighter mark.

**Theme:** light

Quizlet presents an educational workspace on a soft blue-white canvas: a calm, distraction-free study environment where four vivid feature cards (cyan, magenta, brand violet, peach) inject personality into an otherwise restrained palette. Typography is geometric and approachable—Hurme Geometric Sans at weight 400 carrying most of the load, avoiding the over-bolded weight 700 headlines common in SaaS. Components are flat and soft-edged: 4px radius on controls, 8px on cards, 200px pill on filled buttons, with subtle rgba(40,46,62,0.1) shadows providing gentle elevation rather than dramatic depth. The single brand violet #4255ff is the focal point of the interface—links, active states, and filled interactive elements all draw from it, creating a consistent accent against the neutral charcoal #282e3 text and the cool gray canvas #f6f7fb. White card surfaces (#ffffff) and tinted lilac panels (#edefff) create a clear two-level surface hierarchy without ever needing heavy borders or saturated backgrounds.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris Bolt | `#4255ff` | `--color-iris-bolt` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink Charcoal | `#282e3e` | `--color-ink-charcoal` | Primary text, headings, body copy, footer headings, icon strokes — near-black navy that reads warmer than pure #000 on light surfaces |
| Deep Indigo | `#2e3856` | `--color-deep-indigo` | Secondary body text, supporting copy where Ink Charcoal would feel too heavy |
| Slate Veil | `#586380` | `--color-slate-veil` | Muted helper text, secondary metadata, tertiary nav items, subtle icon fills |
| Fog Mist | `#939bb4` | `--color-fog-mist` | Placeholder text, disabled states, hairline icon strokes, low-emphasis borders |
| Pure Black | `#000000` | `--color-pure-black` | App store download badges, maximum-contrast text on light tinted panels, occasional icon detail |
| Chalk Canvas | `#f6f7fb` | `--color-chalk-canvas` | Page background, page-level canvas behind cards and content sections |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, modal backgrounds, input fields, raised panel fills |
| Lilac Wash | `#edefff` | `--color-lilac-wash` | Tinted section backgrounds, subtle highlight zones, promotional banner fills |
| Mist Border | `#d9dde8` | `--color-mist-border` | Hairline dividers, card edges, input borders, separator lines |

## Tokens — Typography

### hurme_no2-webfont — hurme_no2-webfont — detected in extracted data but not described by AI · `--font-hurmeno2-webfont`
- **Weights:** 400, 600, 700
- **Sizes:** 12px, 14px, 16px, 20px, 21px, 24px, 32px, 44px
- **Line height:** 1.25, 1.27, 1.33, 1.4, 1.43, 1.5, 1.63
- **Role:** hurme_no2-webfont — detected in extracted data but not described by AI

### Hurme Geometric Sans — Single-family type system for all UI text. Weight 400 dominates body, nav, and most headings; 600 reserved for emphasis and button labels; 700 used sparingly for card titles. Hurme's geometric construction and open apertures give an approachable, textbook feel rather than corporate austerity. · `--font-hurme-geometric-sans`
- **Substitute:** Inter, DM Sans, or Nunito Sans
- **Weights:** 400, 600, 700
- **Sizes:** 12, 14, 16, 20, 21, 24, 32, 44
- **Line height:** 1.25–1.63
- **Role:** Single-family type system for all UI text. Weight 400 dominates body, nav, and most headings; 600 reserved for emphasis and button labels; 700 used sparingly for card titles. Hurme's geometric construction and open apertures give an approachable, textbook feel rather than corporate austerity.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 18 | — | `--text-caption` |
| body-sm | 14px | 20 | — | `--text-body-sm` |
| body | 16px | 24 | — | `--text-body` |
| subheading | 20px | 28 | — | `--text-subheading` |
| heading-sm | 24px | 32 | — | `--text-heading-sm` |
| heading | 32px | 41 | — | `--text-heading` |
| display | 44px | 55 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 200px |
| inputs | 4px |
| buttons | 4px |
| featureCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(40, 46, 62, 0.1) 0px 4px 16px 0px` | `--shadow-md` |
| subtle | `rgba(0, 0, 0, 0.3) 0px 0px 1px 0px inset` | `--shadow-subtle` |
| sm | `rgba(40, 46, 62, 0.1) 0px 2px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Filled Pill Button
**Role:** Primary interactive element (Sign up for free, Log in, Get the app)

Background #4255ff, text #ffffff, font-weight 600, size 14-16px, padding 10px 20px, border-radius 200px, no border. Subtle shadow rgba(40,46,62,0.1) 0px 2px 4px 0px. Full pill shape distinguishes these from the squarer 4px utility buttons elsewhere.

### Outlined/Store Badge
**Role:** App download buttons (App Store, Google Play)

Background #000000, text #ffffff, border-radius 4px, padding 8px 16px. Black-on-white inversion to stand out as a distinct, external-store credential.

### Ghost Text Link
**Role:** Inline secondary actions (I'm a teacher, Try it out)

No background, no border, text in #4255ff at 16px weight 400, underline on hover only. Sits below or beside a filled button as a low-priority alternative.

### Ghost Outlined Button
**Role:** Secondary call-to-action on promotional sections

Background transparent, border 1px #4255ff, text #4255ff, border-radius 200px, padding 10px 24px, font-weight 600.

### Feature Category Card
**Role:** Hero product showcase cards (Learn, Study Guides, Flashcards, Practice Tests)

Large 24px border-radius, solid pastel fill (cyan/magenta/violet/peach), white inner content panel with 8px radius inset. Card title in weight 700 20-24px, body content in weight 400 14-16px. Used in horizontal carousel with left/right navigation arrows.

### Study Set Card
**Role:** Content discovery cards in grid (Leccion II Problemas, Greek Gods, etc.)

Background #ffffff, border 1px #d9dde8, border-radius 8px, padding 16px. Card title in weight 600 16px #282e3, term count badge in weight 400 12px #586380, creator avatar with circular crop and username in weight 400 12px.

### Top Navigation Bar
**Role:** Persistent site header

Background #ffffff, full-width with inner max-width 1200px, height ~56px, subtle shadow rgba(40,46,62,0.1) 0px 4px 16px 0px. Logo left, dropdown menus (Study tools, Subjects) with 4px radius, search bar centered, Create button (ghost) and Log in pill right.

### Search Bar
**Role:** Central navigation input in header

Background #f6f7fb, border-radius 200px, padding 8px 16px, placeholder text #939bb4 at 14px. Search icon left, no visible border. Expands as the visual anchor of the nav row.

### Footer Link Column
**Role:** Multi-column site footer

Five columns (About us, For students, For teachers, Resources, Language) on background #f6f7fb. Column headings in weight 600 14px #282e3, links in weight 400 14px #586380, 8px vertical gap between links, 48px column padding-top.

### Promotional Section Panel
**Role:** Alternating lilac-background feature sections (Study Guides preview)

Full-width section with background #edefff, inner max-width 1200px, two-column layout (image left, text right), headline in weight 700 32px #282e3, body in weight 400 16px #586380, filled pill button below copy.

### Carousel Navigation Arrow
**Role:** Left/right controls on horizontal card carousels

Circular button 40px diameter, background #ffffff, border 1px #d9dde8, center-aligned chevron icon in #282e3e. Floats at vertical center of card row.

### Term Count Badge
**Role:** Small metadata pill on study set cards

Background transparent or #f6f7fb, text #586380, font-size 12px weight 400, no border, sits between title and creator row.

## Do's and Don'ts

### Do
- Use #4255ff exclusively for filled interactive elements and links — it is the only saturated color in the system
- Apply 200px border-radius to all primary filled buttons to create the signature pill shape
- Set body text to #282e3 at weight 400 — avoid defaulting to weight 600 or 700 for paragraph copy
- Use 8px border-radius on content cards and 24px only on hero feature category cards
- Build card surfaces on #ffffff over the #f6f7fb page canvas to establish the two-level surface hierarchy
- Space sections at 80px vertical gap with 24px internal card padding and 8px element gaps
- Apply the single shadow token rgba(40,46,62,0.1) 0px 4px 16px 0px to nav bars and elevated cards — never stack multiple shadows

### Don't
- Do not introduce additional saturated colors beyond #4255ff — the palette is deliberately near-monochrome with one accent
- Do not use 4px or 8px radius on primary filled buttons — the pill (200px) is a signature
- Do not set headings to weight 700 by default — weight 600 is the maximum for most titles, weight 700 reserved for feature card labels
- Do not use pure #000000 for body text — use #282e3 for the warmer near-black
- Do not place cards directly on #edefff without an inner white panel — the lilac is for section backgrounds, not card fills
- Do not apply heavy or multi-layer shadows — elevation stays under 16px blur and 10% opacity
- Do not use #d9dde8 as a fill — it is exclusively a hairline border and separator color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f6f7fb` | Full page background, base layer behind all content |
| 1 | Card Surface | `#ffffff` | Study set cards, nav bar, raised content panels |
| 2 | Tinted Highlight | `#edefff` | Promotional sections, subtle background washes, feature zones |
| 3 | Feature Card Pastels | `#dbdfff` | Colored feature cards (cyan/pink/violet/peach tints) — decorative category backgrounds |

## Elevation

- **Study set card / nav bar:** `rgba(40, 46, 62, 0.1) 0px 4px 16px 0px`
- **Interactive button (subtle pressed state):** `rgba(40, 46, 62, 0.1) 0px 2px 4px 0px`
- **Icon detail (inset hairline):** `rgba(0, 0, 0, 0.3) 0px 0px 1px 0px inset`

## Imagery

Product-first visual language: the hero features four large illustrated product card mockups (flashcard interface, study guide table, anatomy diagram, practice test score screen) rather than lifestyle photography. Illustrations are flat with subtle shading, each card rendered on a distinct pastel background (cyan, magenta, violet, peach) at 24px radius. Secondary product previews show UI screenshots of the mobile and web app on device frames. No editorial photography, no human faces, no decorative stock imagery — the product interface IS the visual content. Icons are thin-stroke geometric line icons at ~16-20px, single-color in #282e3 or #4255ff.

## Layout

Centered max-width 1200px content rail on a full-bleed #f6f7fb canvas. The hero is a centered text stack (headline → subhead → pill button → ghost link) with no background image, followed by a full-width horizontal card carousel of four feature category cards at 24px radius. Below the carousel, the page alternates two-column sections (50/50 split: product mockup left, headline+body+pill button right) on alternating white and #edefff backgrounds, creating a rhythmic visual break without hard dividers. The footer is a 5-column link grid on #f6f7fb with 48px top padding. Navigation is a sticky-feeling top bar with logo, two dropdown menus, a centered pill search bar, and right-aligned Create + Log in actions. The overall density is compact: 80px between major sections, 8px between inline elements.

## Agent Prompt Guide

**Quick Color Reference**
- text: #282e3e (headings/body), #586380 (muted), #939bb4 (placeholder)
- background: #f6f7fb (page canvas), #ffffff (cards/surfaces), #edefff (tinted sections)
- border: #d9dde8 (hairlines)
- accent: #4255ff (links, filled buttons, active states)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. Build a filled pill button: background #4255ff, text #ffffff, font-family Hurme Geometric Sans (substitute: Inter) weight 600 size 16px, padding 10px 24px, border-radius 200px, subtle shadow rgba(40,46,62,0.1) 0px 2px 4px 0px.
2. Build a study set card: background #ffffff, border 1px solid #d9dde8, border-radius 8px, padding 16px. Title at 16px weight 600 color #282e3e. Metadata text at 12px weight 400 color #586380. Gap 8px between title and metadata.
3. Build a feature category card: solid pastel fill background (use #dbdfff or equivalent category tint), border-radius 24px, internal white content panel at 8px radius. Card label at 20px weight 700 color #282e3e.
4. Build a ghost text link: no background, no border, text #4255ff at 16px weight 400, underline appears on hover only, no padding.
5. Build a top nav bar: background #ffffff, max-width 1200px centered, height 56px, shadow rgba(40,46,62,0.1) 0px 4px 16px 0px. Logo at left in #4255ff, nav items at 14px weight 400 #282e3e, search bar centered with background #f6f7fb and 200px radius.

## Color Discipline

The palette is intentionally near-monochrome. #4255ff is the ONLY saturated chromatic color. All other interface color is desaturated gray, near-gray, or off-white. The four pastel feature card backgrounds (cyan, magenta, violet, peach) are decorative category illustrations, NOT interface tokens — they should only appear as fill behind large illustrated product cards in hero or feature sections, never on buttons, nav, inputs, or body surfaces.

## Similar Brands

- **Duolingo** — Same educational-app visual approach: near-white canvas, single bold brand accent, playful illustrated product cards, and friendly geometric sans-serif typography
- **Khan Academy** — Similar compact, text-forward layout with blue brand accent and clean card-based content grids for learning materials
- **Notion** — Shared restraint in color (near-monochrome with one accent), flat soft-shadow cards, and the 8px/24px radius pairing on content surfaces
- **Brainscape** — Direct study-tool competitor with the same white-on-cool-gray surface hierarchy and pill-shaped primary buttons
- **Anki** — Same flashcard-centric product metaphor, geometric sans-serif typography, and minimal decoration letting content cards carry the visual weight

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris-bolt: #4255ff;
  --color-ink-charcoal: #282e3e;
  --color-deep-indigo: #2e3856;
  --color-slate-veil: #586380;
  --color-fog-mist: #939bb4;
  --color-pure-black: #000000;
  --color-chalk-canvas: #f6f7fb;
  --color-paper-white: #ffffff;
  --color-lilac-wash: #edefff;
  --color-mist-border: #d9dde8;

  /* Typography — Font Families */
  --font-hurmeno2-webfont: 'hurme_no2-webfont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hurme-geometric-sans: 'Hurme Geometric Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --text-body: 16px;
  --leading-body: 24;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --text-heading-sm: 24px;
  --leading-heading-sm: 32;
  --text-heading: 32px;
  --leading-heading: 41;
  --text-display: 44px;
  --leading-display: 55;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-full: 200px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 200px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-featurecards: 24px;

  /* Shadows */
  --shadow-md: rgba(40, 46, 62, 0.1) 0px 4px 16px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.3) 0px 0px 1px 0px inset;
  --shadow-sm: rgba(40, 46, 62, 0.1) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-page-canvas: #f6f7fb;
  --surface-card-surface: #ffffff;
  --surface-tinted-highlight: #edefff;
  --surface-feature-card-pastels: #dbdfff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris-bolt: #4255ff;
  --color-ink-charcoal: #282e3e;
  --color-deep-indigo: #2e3856;
  --color-slate-veil: #586380;
  --color-fog-mist: #939bb4;
  --color-pure-black: #000000;
  --color-chalk-canvas: #f6f7fb;
  --color-paper-white: #ffffff;
  --color-lilac-wash: #edefff;
  --color-mist-border: #d9dde8;

  /* Typography */
  --font-hurmeno2-webfont: 'hurme_no2-webfont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hurme-geometric-sans: 'Hurme Geometric Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --text-body: 16px;
  --leading-body: 24;
  --text-subheading: 20px;
  --leading-subheading: 28;
  --text-heading-sm: 24px;
  --leading-heading-sm: 32;
  --text-heading: 32px;
  --leading-heading: 41;
  --text-display: 44px;
  --leading-display: 55;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-full: 200px;

  /* Shadows */
  --shadow-md: rgba(40, 46, 62, 0.1) 0px 4px 16px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.3) 0px 0px 1px 0px inset;
  --shadow-sm: rgba(40, 46, 62, 0.1) 0px 2px 4px 0px;
}
```
