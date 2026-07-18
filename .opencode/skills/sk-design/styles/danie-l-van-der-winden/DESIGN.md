# Daniël van der Winden — Style Reference
> Printed monograph on vellum

**Theme:** light

This is an editorial personal folio rendered like a printed monograph on warm paper. A single warm-gray canvas (#e5e7eb) holds everything, with content floating on it without visible card containers or heavy dividers. The type system is the design: a humanist sans (Degular) handles UI, body, and navigation while a bookish serif (Blanco) carries all editorial weight — headlines, introductions, and section titles. Color is almost entirely absent; the only chromatic event is the near-black fill of the sole action button against the light field. Layout is a fixed left rail of nav links and a generous reading-width column of text, with photographs overlapping the text column as collaged inserts. Everything else — borders, hairlines, separators — is hairline and quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vellum | `#e5e7eb` | `--color-vellum` | Page canvas, hairline dividers, link underlines, card-edge borders — the warm-gray field that holds all content |
| Ink Black | `#111827` | `--color-ink-black` | Primary text, nav links, body copy — the default reading color |
| Graphite | `#374151` | `--color-graphite` | Secondary body text, list items, supporting copy — one step lighter than primary ink |
| Charcoal | `#2a2a28` | `--color-charcoal` | Headings and editorial emphasis — slightly warm dark for serif display |
| Stone | `#717272` | `--color-stone` | Tertiary text, icon fills, meta labels |
| Pebble | `#909191` | `--color-pebble` | Muted body text, image captions, fine print |
| Ash | `#c4c6c8` | `--color-ash` | Rarely-used border, subtle structural separator |
| Slate | `#7b7c7c` | `--color-slate` | Subdued heading variant, de-emphasized titles |
| Pressed Ink | `#222222` | `--color-pressed-ink` | Primary action button fill — the only dark surface on the canvas, creating the only moment of visual weight |
| Midnight | `#1a202c` | `--color-midnight` | Secondary dark surface, alternate button fill |

## Tokens — Typography

### Degular — UI and body sans — navigation, buttons, body copy, metadata, links, tags, resumé dates. Carries all functional text. Weights step from 400 body to 700 for emphasis in headings and dates. · `--font-degular`
- **Substitute:** Inter, DM Sans, or General Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 16, 18, 22, 24, 28, 32, 40
- **Line height:** 1.25, 1.50
- **Letter spacing:** 0.025em at body sizes; 0.10em for uppercase labels and tags
- **Role:** UI and body sans — navigation, buttons, body copy, metadata, links, tags, resumé dates. Carries all functional text. Weights step from 400 body to 700 for emphasis in headings and dates.

### Blanco — Editorial serif — hero headline, resumé role titles, section headings, and any text that should read as 'published' rather than 'navigational'. Single weight 400, letting size and the serif's own authority carry hierarchy. · `--font-blanco`
- **Substitute:** Source Serif 4, Tiempos Text, or Lyon Display
- **Weights:** 400
- **Sizes:** 14, 20, 22, 28
- **Line height:** 1.40, 1.50
- **Letter spacing:** normal
- **Role:** Editorial serif — hero headline, resumé role titles, section headings, and any text that should read as 'published' rather than 'navigational'. Single weight 400, letting size and the serif's own authority carry hierarchy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 0.1px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 22px | 1.4 | — | `--text-heading-sm` |
| heading | 28px | 1.4 | — | `--text-heading` |
| heading-lg | 32px | 1.25 | 0.025px | `--text-heading-lg` |
| display | 40px | 1.25 | 0.025px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 3px |
| tags | 3px |
| cards | 3px |
| images | 3px |
| buttons | 3px |

### Layout

- **Page max-width:** 720px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Sidebar Nav
**Role:** Persistent left rail navigation

Fixed left column containing the wordmark 'Daniël van der Winden' at top and a vertical stack of text links (Journal, Library, Links, Magazine, Newsletter, Work) at the bottom. Links are 16px Degular 500 in #111827 with no decoration. A small avatar/mark sits in the top-right corner. No background, no border — it floats on the vellum field.

### Email Me Button
**Role:** Primary and only action on the page

Dark filled button, #222222 background, white text. Degular 14px medium weight, 8px 16px padding, 3px border-radius. The only moment of visual weight on the entire page — it works because everything else stays quiet.

### Social Link Row
**Role:** Secondary contact links beside the primary action

Text links with small inline icons (LinkedIn, Bluesky). Degular 14px in #111827, 8px gap between icon and label, separated from the email button by a vertical divider line in #e5e7eb.

### Photo Collage Block
**Role:** Hero visual element overlapping the text column

Two to three black-and-white or desaturated photographs arranged in an overlapping collage, shifted left into the gutter area. No borders, no shadows — they sit directly on the vellum with 3px corner radius. Images are editorial in tone: workspace shots, portraits, and detail crops.

### Resumé Entry
**Role:** Date-anchored experience block

Two-column layout: narrow left column with date range in Degular 14px #717272 (e.g. '2023–2028'), generous right column with role title in Blanco 400 at 22px in #2a2a28, followed by 2-3 lines of body description in Degular 16px #374151. Entries are separated by hairline 1px #e5e7eb rules with generous vertical rhythm (24-32px between entries).

### Section Heading
**Role:** Editorial section title

Blanco 400 at 28px in #2a2a28, left-aligned, sitting above its content block. No underline, no decoration. The serif choice signals 'this is a chapter title, not a label.'

### External Link with Arrow
**Role:** Outbound link indicator

Degular 16px #111827 text with a small superscript arrow (↗) at 75% size, positioned at the end of the label. No underline. Used for Magazine and other external references.

### Nav Link
**Role:** Text-only navigation item

Degular 500 at 16px in #111827. No underline, no background, no hover state beyond subtle color shift. Vertically stacked in the sidebar with 12px between items.

### Body Text Block
**Role:** Prose paragraph for bio and descriptions

Degular 400 at 18px in #374151, line-height 1.5, max-width constrained to the reading column (~600-640px). Generous margin-bottom of 27px between paragraphs. The serif Blanco is never used for body — only for titles.

## Do's and Don'ts

### Do
- Use #e5e7eb as the only surface; never introduce a white card or alternate background.
- Pair Blanco 400 for all headings and titles; reserve Degular for UI, body, and metadata.
- Use the single dark fill (#222222) for exactly one action per viewport — scarcity makes it land.
- Set border-radius to 3px for images, buttons, and tags; 8px is reserved for larger interactive surfaces.
- Anchor resumé entries with date labels in the narrow left column, titles in the right — never inline.
- Let photographs overlap the text column; avoid placing images in rigid boxed containers.
- Set body text at 18px Degular 400 #374151 with 1.5 line-height; this is the reading rhythm of the entire site.

### Don't
- Do not introduce chromatic color — the 3% colorfulness is deliberate, not a limitation to fix.
- Do not add shadows, gradients, or glow effects; elevation is achieved through fill contrast only.
- Do not use Blanco for body text or nav; it is a display face, not a reading face.
- Do not create card containers with backgrounds or borders for content blocks — content sits directly on the vellum.
- Do not use 9999px pill radius; this system's 3px radius is a quiet, bookish choice.
- Do not bold body text for emphasis; use size, color, or the Blanco/Degular font swap instead.
- Do not center-align body paragraphs; left-align at a fixed reading width to preserve the editorial column.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Vellum Field | `#e5e7eb` | The entire page sits on this warm gray; no separate card surface exists |
| 1 | Pressed Ink Surface | `#222222` | The email button and any filled action — the only surface that breaks the monochrome field |

## Elevation

Elevation is deliberately absent. The design relies on overlapping content and hairline rules rather than shadows or z-axis differentiation. Buttons gain weight through fill, not depth.

## Imagery

Photography is editorial and documentary: black-and-white or desaturated workspace interiors, portrait shots, and detail crops. Images are treated as collaged inserts that overlap the text column, sitting directly on the vellum with only a subtle 3px corner radius — no borders, no shadows, no captions. The visual language is print-magazine, not SaaS product showcase: tight crops, natural lighting, human subjects. The site uses no illustrations, no abstract graphics, no 3D renders. Icons appear only in social links and are minimal monoline SVGs. The overall image-to-text ratio is low — text dominates, with images used as anchoring accents rather than decorative atmosphere.

## Layout

Fixed-width editorial layout. A narrow left sidebar (~180px) holds the wordmark at top and a vertical stack of nav links at bottom, fixed to the viewport. The main content column is centered-right, constrained to ~600-720px reading width, with generous whitespace on either side. The hero is an overlapping photo collage on the left bleeding into the intro text on the right — two zones share the same horizontal band rather than stacking. Below, sections flow as single-column prose with resumé entries using a two-column date/title split. There are no multi-column card grids, no alternating bands, no dark sections — the entire page is one continuous vellum field from top to bottom. Navigation is sidebar-only; no top bar, no sticky header beyond the sidebar itself.

## Agent Prompt Guide

**Quick Color Reference**
- text: #111827
- background: #e5e7eb
- border: #e5e7eb
- accent: none (monochrome system)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a sidebar nav: fixed left column 180px wide, wordmark 'Daniël van der Winden' in Degular 500 16px #111827 at top, nav links (Journal, Library, Links, Magazine, Newsletter, Work) in Degular 500 16px #111827 stacked vertically at bottom with 12px gap. No background, no border.

2. Create a resumé entry: two-column row, left column 80px wide with date '2023–2028' in Degular 14px #717272, right column with role title 'Co-Founder of TRANSCRIPT Magazine' in Blanco 400 22px #2a2a28 followed by description in Degular 400 18px #374151 line-height 1.5. Separate from next entry with a 1px #e5e7eb hairline and 32px vertical gap.

3. Create a hero block: two black-and-white photographs overlapping in the left third, shifted up and down by 40px to create a collage effect. Right two-thirds holds a Blanco 400 40px #2a2a28 headline followed by 3 paragraphs of Degular 400 18px #374151 body text with 27px margin-bottom. Images have 3px border-radius, no shadow.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

5. Create a section heading: Blanco 400 28px in #2a2a28, left-aligned, no underline, sitting 40px above its content block. This is an editorial chapter title, not a UI label.

## Similar Brands

- **Are.na** — Same editorial left-sidebar + reading-column layout on a warm neutral field with serif/sans type pairing
- **Craig Mod** — Personal folio rendered as quiet prose on a single warm-gray canvas with generous reading width and minimal chrome
- **Robin Rendle** — Similar literary portfolio aesthetic — monochrome, typographic, no card containers, text-first hierarchy
- **Pareto Design** — Same warm-gray canvas with Degular-class humanist sans for UI and a serif accent for editorial headings

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vellum: #e5e7eb;
  --color-ink-black: #111827;
  --color-graphite: #374151;
  --color-charcoal: #2a2a28;
  --color-stone: #717272;
  --color-pebble: #909191;
  --color-ash: #c4c6c8;
  --color-slate: #7b7c7c;
  --color-pressed-ink: #222222;
  --color-midnight: #1a202c;

  /* Typography — Font Families */
  --font-degular: 'Degular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-blanco: 'Blanco', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.4;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: 0.025px;
  --text-display: 40px;
  --leading-display: 1.25;
  --tracking-display: 0.025px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 720px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-nav: 3px;
  --radius-tags: 3px;
  --radius-cards: 3px;
  --radius-images: 3px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-vellum-field: #e5e7eb;
  --surface-pressed-ink-surface: #222222;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vellum: #e5e7eb;
  --color-ink-black: #111827;
  --color-graphite: #374151;
  --color-charcoal: #2a2a28;
  --color-stone: #717272;
  --color-pebble: #909191;
  --color-ash: #c4c6c8;
  --color-slate: #7b7c7c;
  --color-pressed-ink: #222222;
  --color-midnight: #1a202c;

  /* Typography */
  --font-degular: 'Degular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-blanco: 'Blanco', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.4;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: 0.025px;
  --text-display: 40px;
  --leading-display: 1.25;
  --tracking-display: 0.025px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
}
```
