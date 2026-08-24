# Maciej Zadykowicz — Style Reference
> midnight gallery with a kaleidoscope mural — a near-black studio wall where one brilliantly colorful typographic artwork commands attention and everything else stays quiet and deliberate.

**Theme:** dark

Maciej Zadykowicz's portfolio operates as a midnight design studio: a near-black canvas of deep slate (#25262d) that lets a single spectacular piece of typographic art — the multicolored 'I build things' mural — command the entire first impression. Below the hero, the system retreats into quiet restraint: light bone-white text (#f2f2f3) over flat dark cards, tight Replica typography, pill-shaped controls, and a single muted indigo (#384270) reserved for the live 'Open' status indicator. The page reads like a gallery wall — the work IS the decoration, so chrome stays compact, metadata is mono-typed, and the only chromatic accent carries semantic meaning (availability, live state). Information density is high but breathing — project entries stack as year/title/description/tags with generous 24px internal padding, and the 16px card radius softens the otherwise severe dark surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#f2f2f3` | `--color-bone-white` | Primary text, nav links, button labels, footer copy — the only light on the page, used for everything that must be read |
| Slate Dark | `#25262d` | `--color-slate-dark` | Page canvas, base surface for all cards and sections |
| Graphite | `#383a42` | `--color-graphite` | Elevated surface — nested cards, button hover fills, secondary panels sitting on top of Slate Dark |
| Fog | `#858893` | `--color-fog` | Secondary text, metadata labels, inactive nav items, muted descriptions |
| Ash | `#54565f` | `--color-ash` | Tertiary text, timestamps, low-priority labels |
| Charcoal | `#0c0c0c` | `--color-charcoal` | Outlined button borders, icon strokes on dark surfaces |
| Indigo Dusk | `#384270` | `--color-indigo-dusk` | Violet supporting accent for decorative details and low-frequency emphasis |

## Tokens — Typography

### Replica-Regular — Primary typeface for all body text, headings, navigation, and the hero display. The single weight (400) is the signature — no bold, no light, just one confident regular cut. The tight -0.014em tracking throughout gives geometric letters a slightly condensed, deliberate feel. Used at every size from 14px captions to the 120px+ hero mural. · `--font-replica-regular`
- **Substitute:** Inter, Söhne, or Suisse Int'l at weight 400
- **Weights:** 400
- **Sizes:** 20px, 36px
- **Line height:** 1.00-1.20
- **Letter spacing:** -0.0140em
- **Role:** Primary typeface for all body text, headings, navigation, and the hero display. The single weight (400) is the signature — no bold, no light, just one confident regular cut. The tight -0.014em tracking throughout gives geometric letters a slightly condensed, deliberate feel. Used at every size from 14px captions to the 120px+ hero mural.

### Replica-Mono — Reserved for metadata and structural labels: year markers, project tags (Art Direction, Branding, Design Systems), and small heading-like elements. Creates a clear typographic separation between content (Replica-Regular) and structural scaffolding (Replica-Mono). · `--font-replica-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Geist Mono
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.20
- **Role:** Reserved for metadata and structural labels: year markers, project tags (Art Direction, Branding, Design Systems), and small heading-like elements. Creates a clear typographic separation between content (Replica-Regular) and structural scaffolding (Replica-Mono).

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | -0.014px | `--text-caption` |
| body-sm | 16px | 1.2 | -0.014px | `--text-body-sm` |
| body | 20px | 1.2 | -0.014px | `--text-body` |
| subheading | 24px | 1.2 | -0.014px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.014px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.014px | `--text-heading` |
| display | 120px | 1 | -0.014px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 90 | 90px | `--spacing-90` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 64px |
| images | 16px |
| buttons | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Hero Typographic Mural
**Role:** First-screen centerpiece — the only decorative element in the system

Display text at 120px+ in Replica-Regular weight 400, line-height 1.00, letter-spacing -0.014em. Letterforms filled with multicolored organic shapes (red, blue, yellow, green, pink — not system tokens, but illustration art). Spans full viewport width. This is the brand signature — no other element on the site uses color this way.

### Top Navigation Bar
**Role:** Minimal text-link navigation spread across the viewport top

Flat, no background bar — links sit directly on the Slate Dark canvas. 14px Replica-Regular, letter-spacing -0.014em. Items distributed: brand name left, role descriptor center-left, contact links (email, twitter, read.cv, so-so.eth) spread right. Fog (#858893) for inactive, Bone White (#f2f2f3) for active. No borders, no hamburger, no container.

### Bio Card
**Role:** Personal introduction block below the hero

Graphite (#383a42) surface, 16px border-radius, 24px padding on all sides. 'Hello' prefix in Fog (#858893) 14px Replica-Regular. Body text in Bone White (#f2f2f3) at 20px Replica-Regular, line-height 1.20. No shadow, no border. A compact dark panel floating on the darker canvas.

### Availability Status Pill
**Role:** Live 'Open' indicator showing the designer is accepting work

Pill-shaped (64px border-radius) with Indigo Dusk (#384270) fill. Contains a small colored dot (8px, same Indigo Dusk) and 'Open' text in Bone White at 14px Replica-Regular. 8px 16px padding. Sits inline with CTA buttons as a horizontal action row.

### CTA Pill Button
**Role:** Primary call-to-action — 'Get in touch →', 'Start a project →'

Graphite (#383a42) fill, 24px border-radius (softly rounded, not full pill). Bone White (#f2f2f3) text at 14-16px Replica-Regular. 12px 24px padding. Arrow suffix (→) in same color. No shadow, no border. On hover, surface lightens to #4a4c55.

### Outlined Ghost Button
**Role:** Secondary action or link with visual separation

Transparent background with 1px Charcoal (#0c0c0c) border. 24px border-radius. Bone White text. Used for less prominent actions alongside filled CTAs.

### Section Header
**Role:** Major section label like 'Selected Projects'

36px Replica-Regular weight 400, Bone White (#f2f2f3), line-height 1.20. No underline, no decoration — just clean type sitting on the canvas. Generous 64px margin-top separating it from the previous section.

### Project Entry Card
**Role:** Individual project entry in the Selected Projects list

Graphite (#383a42) surface, 16px border-radius, 24px padding. Structure: year in Fog (#858893) Replica-Mono (top-left), project name in Bone White Replica-Regular 36px (left column), description in Fog 20px (center column), tag list in Replica-Mono with '○' bullet prefix (right column). Tags: Art Direction, Branding, Design Systems, Product Design. No images in the list view — visual work appears as full-bleed embeds below.

### Project Showcase Embed
**Role:** Full-width project visual — the Metadrop gradient-bordered interface

Full container width, 16px border-radius. Project artwork sits on the Slate Dark canvas with no frame. Project title bar above uses 14px Replica-Mono with category tags (COINS, NFTS) in pill badges. This is where project-specific visual identity breaks through the system.

### Category Tag Pill
**Role:** Small metadata badges for project categorization

No background fill, 1px hairline border in Fog (#858893), 64px border-radius (full pill). Text in Replica-Mono 14px, Fog color. 2px 12px padding. Extremely minimal — just a border and text.

### About/Bio Text Block
**Role:** Extended personal narrative in the lower page section

Two-column asymmetric layout on Slate Dark canvas. Name 'Maciej' in 36px Bone White Replica-Regular with phonetic pronunciation ('pronounced "much-yay"') in Fog 14px Replica-Regular right-aligned. Body paragraphs in Bone White 20px, line-height 1.20, max-width ~480px per column. No card container — text sits directly on canvas.

### Hairline Divider
**Role:** Section separator

1px solid line in #2e2f37 (a tone between canvas and card). Full container width. Minimal visual noise — just enough to signal transition without adding weight.

## Do's and Don'ts

### Do
- Keep the page at 1% colorfulness — only the hero mural and the Indigo Dusk status pill introduce chromatic color
- Use Replica-Regular weight 400 exclusively for content; never introduce bold, semibold, or light cuts
- Apply -0.014em letter-spacing to all Replica text at every size — this tracking is the typographic identity
- Communicate elevation through surface color stepping (#25262d → #383a42 → #384270), never through box-shadows
- Use 16px radius for cards and images, 24px for buttons, 64px for status pills and tags — these three values define all rounding in the system
- Let project artwork and the hero mural do the visual heavy lifting; keep all chrome flat and quiet
- Set section gaps to 64px and card padding to 24px — the 4px base unit produces compact, information-dense rhythm

### Don't
- Do not add box-shadows, glows, or blur effects to any component — the system is deliberately flat
- Do not use bold or semibold weights — Replica-Regular at 400 is the only voice; hierarchy comes from size alone
- Do not introduce additional accent colors — Indigo Dusk (#384270) is the only chromatic token and it signals live status
- Do not use white (#ffffff) as text or background — Bone White (#f2f2f3) is the off-white that prevents harshness on the dark canvas
- Do not add gradients to interface chrome — gradients belong only inside project artwork and the hero mural
- Do not use sharp 0px corners anywhere — every surface must have at least 16px radius to soften the dark canvas
- Do not use generic sans-serif fallbacks like Helvetica or Arial as visible type — always route through Inter or a geometric sans substitute at weight 400

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#25262d` | Page background, the base layer everything sits on |
| 1 | Card | `#383a42` | Elevated content containers — project cards, bio blocks, nested panels |
| 2 | Highlight | `#384270` | Status pills and active state surfaces |

## Elevation

- **Status pill (Open):** `none — flat, no shadow, relies on Indigo Dusk fill for prominence`
- **Project cards:** `none — flat Graphite surface, separation comes from color step not shadow`
- **Bio card:** `none — flat surface, hairline 1px border optional`

## Imagery

The site follows a strict visual hierarchy: the hero is the only space where color and illustration exist at scale, rendered as a massive multicolored typographic mural where organic red, blue, yellow, green, and pink shapes fill the letterforms of 'I build things'. This is signature artwork, not a repeating pattern. Project showcases below use full-bleed embeds of the actual product UI (like Metadrop's rainbow-gradient bordered interface) — never stock photography, never lifestyle imagery, never abstract decorative graphics. The rest of the page is pure typography on flat dark surfaces. The contrast between the riotous hero and the austere everything-else is the defining visual tension.

## Layout

The page is a single scroll with max-width ~1200px centered content. Navigation is a flat text-link bar with no background container, items distributed across the full viewport. The hero is a massive typographic mural (120px+ display text) spanning the full content width. Below the hero, a compact stacked layout: bio card, then a horizontal action row of pills (status + CTAs), then the 'Selected Projects' section header, then project entry cards as horizontal rows (year | title | description | tags), then full-bleed project showcase embeds. The layout alternates between contained card surfaces and full-width project visuals, creating a rhythm of compressed metadata followed by expansive artwork. Sections are separated by 64px gaps with subtle 1px hairlines. No sidebar, no sticky header, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #f2f2f3 (Bone White)
- background: #25262d (Slate Dark)
- card surface: #383a42 (Graphite)
- border: #0c0c0c (Charcoal)
- accent / live status: #384270 (Indigo Dusk)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Build a bio card: Graphite (#383a42) background, 16px border-radius, 24px padding. 'Hello' prefix in Fog (#858893) 14px Replica-Regular. Body text in Bone White (#f2f2f3) at 20px Replica-Regular, line-height 1.20, letter-spacing -0.014em. No shadow, no border.

2. Build an availability status pill: Indigo Dusk (#384270) fill, 64px border-radius, 8px 16px padding. Small 8px dot in same Indigo Dusk, then 'Open' text in Bone White 14px Replica-Regular. Inline with other action buttons in a horizontal row with 12px gap.

3. Build a project entry card: Graphite (#383a42) surface, 16px border-radius, 24px padding. Four-column horizontal layout: year (Fog, Replica-Mono, 14px) | project name (Bone White, Replica-Regular, 36px) | description (Fog, Replica-Regular, 20px) | tags (Replica-Mono, 14px, with '○' bullet, each in a 64px-radius pill with 1px Fog border). No images in this list view.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

5. Build a section header: 36px Replica-Regular weight 400, Bone White (#f2f2f3), line-height 1.20, letter-spacing -0.014em. 64px margin-top. No underline, no accent bar, no decoration.

## Color Discipline

This system is built on radical chromatic restraint. The page is 99% achromatic — dark canvas, light text, gray hierarchy. The hero mural is the ONLY place where multiple colors appear, and it's artwork, not interface. In the interface itself, the single chromatic color (Indigo Dusk #384270) carries semantic weight: it means 'live', 'available', 'active'. Never use it for decoration, hover states, or generic emphasis. If you need to draw attention to something, change its size, weight of position — not its color.

## Similar Brands

- **Linear** — Same dark canvas with single-purpose chromatic accent used for status/availability indicators, flat surfaces with no shadows, compact information-dense layout
- **Rauno Freiberg** — Personal portfolio with dark monochrome canvas, oversized display type as the hero centerpiece, and extremely restrained interface chrome below
- **Vercel** — Dark mode with near-black canvas, single accent color for interactive states, flat card surfaces, tight typographic rhythm
- **Read.cv** — Portfolio platform with dark mode, minimal chrome, compact card-based project entries, text-first navigation
- **Pawel Huć** — Designer portfolio with dramatic typographic hero, dark background, flat interface below, and custom geometric sans-serif throughout

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #f2f2f3;
  --color-slate-dark: #25262d;
  --color-graphite: #383a42;
  --color-fog: #858893;
  --color-ash: #54565f;
  --color-charcoal: #0c0c0c;
  --color-indigo-dusk: #384270;

  /* Typography — Font Families */
  --font-replica-regular: 'Replica-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-replica-mono: 'Replica-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.014px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.014px;
  --text-body: 20px;
  --leading-body: 1.2;
  --tracking-body: -0.014px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.014px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.014px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.014px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -0.014px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-90: 90px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 64px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 64px;
  --radius-images: 16px;
  --radius-buttons: 24px;

  /* Surfaces */
  --surface-canvas: #25262d;
  --surface-card: #383a42;
  --surface-highlight: #384270;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #f2f2f3;
  --color-slate-dark: #25262d;
  --color-graphite: #383a42;
  --color-fog: #858893;
  --color-ash: #54565f;
  --color-charcoal: #0c0c0c;
  --color-indigo-dusk: #384270;

  /* Typography */
  --font-replica-regular: 'Replica-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-replica-mono: 'Replica-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.014px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.014px;
  --text-body: 20px;
  --leading-body: 1.2;
  --tracking-body: -0.014px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.014px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.014px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.014px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -0.014px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-90: 90px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 64px;
}
```
