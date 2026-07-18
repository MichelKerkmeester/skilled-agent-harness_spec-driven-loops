# Parallel Web Systems — Style Reference
> Engineering journal at dawn — a technical reading room where data streams replace photography and the type does the talking.

**Theme:** light

Parallel reads like an engineering journal printed on cream paper: a light, editorial canvas in warm off-white, a single serif (gerstnerProgramm) carrying all reading content, and a monospaced secondary voice (ftSystemMono) governing every piece of UI chrome — nav items, buttons, toggles, tags. The palette is almost entirely grayscale with two saturated accent punctuation marks: a steel blue that fills a large data-visualization hero panel, and a vivid orange that lands on exactly one CTA and one inline emphasis phrase. Surfaces are flat and hairline-divided rather than shadowed; radii are brutally small (2px), giving the whole system the feel of a technical schematic. The single dark moment is a dithered, data-textured footer band that mirrors the hero, closing the page in the same visual language it opened with.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Schematic Blue | `#0d6ea5` | `--color-schematic-blue` | Hero data-visualization panels, inline emphasis phrases, link/heading accents — the cool, restrained blue of a blueprint or oscilloscope trace, used at scale to make a single colored block dominate a page |
| Signal Orange | `#fb631b` | `--color-signal-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink Black | `#181818` | `--color-ink-black` | Primary text, dark filled buttons (CONTACT), the HUMAN/MACHINE pill toggle — a near-black that is softer than pure #000, the default reading color across all body and headings |
| Graphite | `#434343` | `--color-graphite` | Secondary nav and button text, footer secondary links — the mid-tier of the neutral scale, sits between Ink Black and Slate |
| Slate | `#858483` | `--color-slate` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Ash Gray | `#666666` | `--color-ash-gray` | Body muted text, captions — sits just above Slate in the gray scale for slightly more emphasis |
| Hairline | `#e5e5e5` | `--color-hairline` | All borders, dividers, and 0.5px inset shadows — the single most-used color on the site, defines every edge |
| Cream Paper | `#f5f4f1` | `--color-cream-paper` | Page canvas and card surfaces — a warm off-white, never pure white; this tint is the signature that makes the site feel like printed paper rather than a screen |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surface, button text on dark fills, occasional contrast backgrounds — used sparingly to lift elements above the cream canvas |
| Fog | `#eeeeee` | `--color-fog` | Secondary surface, subtle background bands, disabled-state wash |
| Mortar | `#dedede` | `--color-mortar` | Inactive chips, tag backgrounds, low-emphasis surface fills |
| Concrete | `#cbcbcb` | `--color-concrete` | Inert dividers in nested layouts, scroll-track backgrounds |

## Tokens — Typography

### gerstnerProgramm — All reading content — body, subheadings, section headings, and display headlines. A transitional/old-style serif custom to the brand; carries the editorial, almost publication-grade voice of the site. The 36px/26px sizes are used for section titles; 14–16px for body; 11–13px for labels and micro-copy. · `--font-gerstnerprogramm`
- **Substitute:** Source Serif 4, Tiempos Text, or IBM Plex Serif
- **Weights:** 400, 500
- **Sizes:** 11px, 13px, 14px, 16px, 26px, 36px
- **Line height:** 0.73, 1.11, 1.23, 1.50
- **Letter spacing:** 0.01em at 11–14px, 0.012em at 26–36px — barely open tracking that tightens at display sizes
- **Role:** All reading content — body, subheadings, section headings, and display headlines. A transitional/old-style serif custom to the brand; carries the editorial, almost publication-grade voice of the site. The 36px/26px sizes are used for section titles; 14–16px for body; 11–13px for labels and micro-copy.

### ftSystemMono — All UI chrome — nav links, button labels, pill toggles (HUMAN / MACHINE), tags, and any technical/keyword text. A custom monospace that gives every interactive element the visual weight of a terminal command, deliberately contrasting with the serif body to signal 'this is an interface, not a paragraph'. · `--font-ftsystemmono`
- **Substitute:** IBM Plex Mono, JetBrains Mono, or Berkeley Mono
- **Weights:** 400, 500
- **Sizes:** 10px, 11px, 12px, 13px, 14px, 16px
- **Line height:** 0.73, 1.00, 1.23, 1.33, 1.50
- **Letter spacing:** 0.012em at small sizes, 0.015em at 10–11px — opens up at the smallest sizes for legibility
- **Role:** All UI chrome — nav links, button labels, pill toggles (HUMAN / MACHINE), tags, and any technical/keyword text. A custom monospace that gives every interactive element the visual weight of a terminal command, deliberately contrasting with the serif body to signal 'this is an interface, not a paragraph'.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.015px | `--text-caption` |
| heading-sm | 26px | 1.23 | 0.012px | `--text-heading-sm` |
| heading | 36px | 1.11 | 0.012px | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 2px |
| pills | 2px |
| images | 2px |
| inputs | 2px |
| buttons | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(229, 229, 229) 0px 0px 0px 0.5px` | `--shadow-subtle` |
| subtle-2 | `rgb(229, 229, 229) 0px 0.5px 0px 0px` | `--shadow-subtle-2` |
| sm | `rgba(0, 0, 0, 0.02) 0px 13px 8px 0px, rgba(0, 0, 0, 0.03)...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Sticky header carrying the wordmark, product links, and the two primary actions

Cream paper background (#f5f4f1), wordmark 'parallel' in 14px gerstnerProgramm 500 Ink Black at the far left. Centered nav links in 11px ftSystemMono 500 Slate (#858483) with 0.015em tracking, 24–32px horizontal spacing. Two trailing buttons: a dark filled CONTACT (Ink Black bg, Cream Paper text, 2px radius, 8px 16px padding) and an orange filled LOG IN (Signal Orange bg, white text, 2px radius, 8px 16px padding). No border on the bar itself; content sits directly on the canvas.

### Ghost / Outlined CTA
**Role:** Secondary action that should feel available but not assertive

Transparent fill, 1px Hairline (#e5e5e5) border, 2px radius. Label in 11px ftSystemMono 500 Ink Black, 0.015em tracking, uppercase, 8px 16px padding. Example: the 'START BUILDING' button. 2px radius keeps it visually aligned with the dark and orange primary buttons — radius never varies by button variant, only fill and border do.

### Dark Filled Button
**Role:** Primary contact / non-purchase action

Ink Black (#181818) fill, Cream Paper (#f5f4f1) text, 2px radius, 8px 16px padding. Label in 11px ftSystemMono 500 with 0.015em tracking and uppercase. Sits at the same height as the orange button beside it; the two are deliberately paired to create a warm/cool tension at the top right of every page.

### Orange Filled Button
**Role:** The single emphatic conversion action (log in, sign up)

Signal Orange (#fb631b) fill, white text, 2px radius, 8px 16px padding. Label in 11px ftSystemMono 500 uppercase. There is only ever one orange button per page cluster; if a second action needs to coexist, it goes to the dark or ghost variant.

### Hero Data Panel
**Role:** Full-bleed visual block that communicates 'this product processes streams of web data'

Schematic Blue (#0d6ea5) solid fill, full viewport width, 400–500px tall. Interior is populated with columns of monospaced data text (ftSystemMono at 10–11px, white at reduced opacity) arranged as vertical streams — a visual representation of parallel query processing. A single white pill (Cream Paper bg, 2px radius, Ink Black text) sits centered as a product descriptor, and a dark HUMAN/MACHINE toggle sits below it. No border, no shadow, no rounding on the panel itself.

### Human/Machine Pill Toggle
**Role:** Recurring meta-control that appears in both the hero and footer dark zones

Ink Black (#181818) fill, 2px radius (not a capsule — the 2px radius is the brand's signature, even for toggle-like controls). Two segments: 'HUMAN' and 'MACHINE' in 11px ftSystemMono 500 uppercase Cream Paper text, separated by 12–16px internal padding, with the active segment optionally given a subtle border. 28–32px tall.

### Feature Card (Flat)
**Role:** Compact information block in a 4-column feature row

No background fill (sits directly on cream canvas), no shadow, 1px Hairline (#e5e5e5) top border only — the bottom and sides are open. Title in 14px ftSystemMono 500 Ink Black uppercase with 0.012em tracking; body in 13–14px gerstnerProgramm 400 Slate (#858483) at 1.5 line-height. Cards align to a 4-column grid with 48px column gap and no padding between content stacks.

### Section Headline + Subhead Stack
**Role:** Standard opener for every content section

Primary headline in 36px gerstnerProgramm 500 Ink Black at 1.11 line-height and 0.012em tracking. Subhead in 26px gerstnerProgramm 400 Ink Black at 1.23 line-height, sometimes containing one orange-emphasis phrase. No eyebrow tag, no decorative element above the stack — the type size contrast (36 → 26) is the only hierarchy signal.

### Customer Logo Row
**Role:** Social proof band

Single horizontal row on the cream canvas, no background fill, no border. Each logo is presented at roughly equal optical weight with 80–120px horizontal spacing. Above the row, a tiny label in 13px gerstnerProgramm 500 Slate: 'Powering best-in-class AI businesses' + a 'Case Study →' link in the same color. Logos retain their own brand color (a purple starbridge, a red zoominfo, a green Modal) — this is the one place the design system surrenders color control to partner identities.

### Pricing Tier Card
**Role:** Repeatable unit in a pricing grid

Cream Paper background, 1px Hairline (#e5e5e5) border, 2px radius, 24px padding on all sides. Tier name in 11px ftSystemMono 500 uppercase Slate; price in 36px gerstnerProgramm 500 Ink Black; feature list in 14px gerstnerProgramm 400 Ink Black with 8px row gap. CTA inside the card is a dark filled or orange filled button depending on the recommended tier — the radius matches the card.

### Inset Annotation Tag
**Role:** Small inline label that qualifies a phrase (e.g. 'Read more' link, or a 'Beta' marker)

Transparent or Fog (#eeeeee) background, 1px Hairline border, 2px radius, 2px 8px padding. Text in 10–11px ftSystemMono 500 uppercase Ink Black. Sits inline with body text or floats to the right of a heading.

### Footer Link Column
**Role:** Standard footer navigation block

Column header in 11px ftSystemMono 500 uppercase Ink Black with 0.012em tracking. Links in 13px gerstnerProgramm 400 Ink Black at 1.5 line-height, 4–8px row gap. 48px gap between columns. No dividers between columns; the whole footer sits on Cream Paper with no border above it.

### Dithered Dark Footer Band
**Role:** Closing visual that mirrors the hero's data-stream language in dark mode

Full-bleed Ink Black (#181818) band, ~200–300px tall, filled with a dense dithered/noise texture in Slate and Graphite pixels — a static interpretation of the same 'parallel data streams' visual from the hero. A centered HUMAN/MACHINE pill toggle sits on top in Cream Paper text. The band has no radius, no shadow, no border — it bleeds to both page edges.

### System Status Pill
**Role:** Footer status indicator (e.g. 'All Systems Operational')

No background, inline with surrounding footer text. Small green dot (3–4px circle) in a muted semantic green followed by 11px ftSystemMono 500 uppercase Ink Black. Sits to the left of social icons at the bottom-left of the footer.

## Do's and Don'ts

### Do
- Use gerstnerProgramm for every reading-text element: body, subheadings, section headlines, footer link text. Weight 400 for body, 500 for headlines and the first 2–3 words of any emphasized phrase.
- Use ftSystemMono for every UI chrome element: nav links, button labels, pill toggles, tags, status indicators. Always uppercase, always 0.012–0.015em tracking.
- Apply 2px radius to every rectangular element — cards, buttons, inputs, tags, images. The only larger radius in the system is 8px, reserved for inline callout pills floating on the blue hero.
- Build the page on Cream Paper (#f5f4f1) as the default canvas; use Pure White (#ffffff) only to lift an elevated card or button text above it. Never use #ffffff as the page background.
- Reserve Signal Orange (#fb631b) for exactly one thing per cluster: one filled button OR one inline emphasis phrase. Never both in the same view; never on a border or a text link.
- Separate sections with generous 80px vertical gaps and 48px content padding inside cards. Use 1px Hairline (#e5e5e5) borders or 48–80px whitespace as the only dividers — never background-color bands stacked on the canvas.
- Mirror the hero's data-stream visual language in the dark footer by using the same dithered/textured treatment in Ink Black, closing the page in the same rhythm it opened.

### Don't
- Don't introduce a third accent color, a gradient, or any saturated mid-tone. The system runs on grayscale plus exactly two chromatic punctuations: Schematic Blue and Signal Orange.
- Don't add box-shadows beyond the two recorded patterns (the 0.5px Hairline inset and the 0.02–0.04 layered card lift). The design language is hairline-defined, not shadow-defined.
- Don't round corners beyond 2px on structural elements. Capsule/pill shapes (9999px) are foreign to this system; the 2px is the signature.
- Don't set body text in ftSystemMono or UI labels in gerstnerProgramm. The serif/mono split is deliberate: serif reads, mono acts.
- Don't use #ffffff as the page canvas or as a card surface that sits on Cream Paper — the warm tint is the point; switching to white kills the printed-paper atmosphere.
- Don't place the orange accent on disabled states, helper text, or metadata. Orange means 'active, clickable, or emphatically highlighted' — applying it to a non-interactive element breaks its meaning.
- Don't use Photographic or illustrated imagery. The visual language is data-as-graphic: streams of monospaced text, dithered textures, and flat blue panels. The type and the data ARE the imagery.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f5f4f1` | Base page canvas, footer background, button text on dark fills |
| 1 | Pure White | `#ffffff` | Elevated card surfaces, button labels, small lift above the canvas |
| 2 | Fog | `#eeeeee` | Secondary surface band, subtle inline background for tags and chips |
| 3 | Schematic Blue | `#0d6ea5` | Full-bleed hero data panel, the only chromatic surface in the system |
| 4 | Ink Black | `#181818` | Dark filled buttons, dithered footer band, HUMAN/MACHINE toggle |

## Elevation

- **Cards and elevated surfaces:** `rgba(0, 0, 0, 0.02) 0px 13px 8px 0px, rgba(0, 0, 0, 0.03) 0px 6px 6px 0px, rgba(0, 0, 0, 0.04) 0px 1px 3px 0px`
- **All bordered elements (inputs, cards, tag outlines):** `rgb(229, 229, 229) 0px 0px 0px 0.5px`

## Imagery

Imagery is replaced by typographic and data-as-graphic visuals. The hero is a full-bleed Schematic Blue panel filled with columns of monospaced pseudo-data, functioning as a literal visualization of parallel web queries. The footer mirrors this in dark mode with a dithered/noise texture. The only photographic or illustrated content is the customer logo row, where partner brands retain their own color identity. There is no lifestyle photography, no product mockups, no people — the system treats the page itself as a schematic of the product.

## Layout

Max-width 1200px centered for all text content; full-bleed only for the Schematic Blue hero panel and the dithered dark footer band. The page rhythm is: cream nav → cream hero text stack → full-bleed blue data panel → cream section with 4-column feature row → cream customer logo row → cream next section opener → full-bleed dark dithered footer → cream footer links. Sections are separated by 80px vertical gaps; cards within sections use 48px column gaps and no background fill, relying on hairline top borders to define their top edge. Content is always left-aligned and reads top-to-bottom in a single column until the 4-column feature row, which is the only multi-column grid in the system.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #181818 (Ink Black)
- background: #f5f4f1 (Cream Paper)
- border: #e5e5e5 (Hairline)
- muted text: #858483 (Slate)
- brand surface: #0d6ea5 (Schematic Blue)
- accent: #fb631b (Signal Orange)
- primary action: no distinct CTA color

EXAMPLE COMPONENT PROMPTS
1. Create a section header block on Cream Paper (#f5f4f1). 36px gerstnerProgramm weight 500 #181818 line-height 1.11 tracking 0.012em for the title. 26px gerstnerProgramm weight 400 #181818 line-height 1.23 below it, with the last three words set in #fb631b to create a single inline emphasis phrase. 80px margin-top, left-aligned, max-width 720px.

2. Create a feature card row of 4 columns on Cream Paper. Each card has no background, a 1px top border in #e5e5e5, and 24px top padding only. Card title in 14px ftSystemMono weight 500 uppercase #181818 tracking 0.012em. Card body in 14px gerstnerProgramm weight 400 #858483 line-height 1.5. 48px column gap, no row gap.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. Create a full-bleed Schematic Blue (#0d6ea5) hero data panel, 480px tall, no border, no radius. Fill the interior with 8–12 vertical columns of monospaced pseudo-text using ftSystemMono 10px at 30% white opacity, each column offset by a different y-position to create a staggered stream effect. Center a single white pill: #f5f4f1 fill, 8px radius, 2px 12px padding, 13px gerstnerProgramm 500 #181818 text. Below the pill, render a dark Ink Black (#181818) HUMAN/MACHINE pill toggle: 2px radius, 8px 16px padding per segment, 11px ftSystemMono 500 uppercase #f5f4f1 text.

5. Create a footer link column on Cream Paper. Column header: 11px ftSystemMono weight 500 uppercase #181818 tracking 0.012em, 0px top padding. Four links beneath in 13px gerstnerProgramm weight 400 #181818 line-height 1.5, 4px row gap. No dividers between columns; 48px horizontal gap to the next column.

## Visual Signature

Three things make a Parallel page recognizable at a glance: (1) the cream-not-white canvas in #f5f4f1, which gives the entire site the warm tint of printed paper; (2) the typographic split where a serif carries all reading and a monospace carries all UI, deliberately reversing the SaaS convention of sans-serif-everything; (3) the data-stream panels in Schematic Blue and dithered Ink Black, which function as the site's only imagery and make the visual identity inseparable from the product's core metaphor — many parallel web queries running simultaneously.

## Similar Brands

- **Anthropic** — Same editorial, almost-publication typographic posture; serif-ish voice for reading content with monospaced accents in UI chrome; cream-leaning backgrounds rather than pure white
- **Vercel** — Same hairline 1px borders and brutal 2px radius discipline; near-flat surfaces with shadows reserved for only the most floating elements; two-color accent system over grayscale
- **Stripe** — Same gradient-free, shadow-light, type-driven hierarchy; product visual language carried by data/diagram graphics rather than photography
- **Linear** — Same compact density, sharp 2px radii, and dark-pill toggle pattern; restraint with accent color — one chromatic moment per cluster
- **Cloudflare** — Same technical/blueprint visual metaphor with full-bleed colored data panels as page heroes; monospaced type for UI labels and data; hairline dividers throughout

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-schematic-blue: #0d6ea5;
  --color-signal-orange: #fb631b;
  --color-ink-black: #181818;
  --color-graphite: #434343;
  --color-slate: #858483;
  --color-ash-gray: #666666;
  --color-hairline: #e5e5e5;
  --color-cream-paper: #f5f4f1;
  --color-pure-white: #ffffff;
  --color-fog: #eeeeee;
  --color-mortar: #dedede;
  --color-concrete: #cbcbcb;

  /* Typography — Font Families */
  --font-gerstnerprogramm: 'gerstnerProgramm', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ftsystemmono: 'ftSystemMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.015px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.23;
  --tracking-heading-sm: 0.012px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: 0.012px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-full: 14385.6px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 2px;
  --radius-pills: 2px;
  --radius-images: 2px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Shadows */
  --shadow-subtle: rgb(229, 229, 229) 0px 0px 0px 0.5px;
  --shadow-subtle-2: rgb(229, 229, 229) 0px 0.5px 0px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.02) 0px 13px 8px 0px, rgba(0, 0, 0, 0.03) 0px 6px 6px 0px, rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;

  /* Surfaces */
  --surface-cream-paper: #f5f4f1;
  --surface-pure-white: #ffffff;
  --surface-fog: #eeeeee;
  --surface-schematic-blue: #0d6ea5;
  --surface-ink-black: #181818;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-schematic-blue: #0d6ea5;
  --color-signal-orange: #fb631b;
  --color-ink-black: #181818;
  --color-graphite: #434343;
  --color-slate: #858483;
  --color-ash-gray: #666666;
  --color-hairline: #e5e5e5;
  --color-cream-paper: #f5f4f1;
  --color-pure-white: #ffffff;
  --color-fog: #eeeeee;
  --color-mortar: #dedede;
  --color-concrete: #cbcbcb;

  /* Typography */
  --font-gerstnerprogramm: 'gerstnerProgramm', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ftsystemmono: 'ftSystemMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.015px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.23;
  --tracking-heading-sm: 0.012px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: 0.012px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-full: 14385.6px;

  /* Shadows */
  --shadow-subtle: rgb(229, 229, 229) 0px 0px 0px 0.5px;
  --shadow-subtle-2: rgb(229, 229, 229) 0px 0.5px 0px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.02) 0px 13px 8px 0px, rgba(0, 0, 0, 0.03) 0px 6px 6px 0px, rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
}
```
