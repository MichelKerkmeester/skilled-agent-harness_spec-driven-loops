# Michael Wandelmaier — Style Reference
> museum placard on black velvet — three candy pills, one whisper-weight serif, and almost nothing else.

**Theme:** dark

A designer's portfolio reads as an after-hours editorial gallery: an almost-black canvas hosts oversized hairline serif headlines (Canela Web at weight 100) that fill the viewport like poster type, while three candy-coloured pill shapes — coral, apricot, grass green — sit alongside the words like adhesive labels on a curator's wall. The sans counterpart (PolySans, also weight 100) is reserved for small all-caps tags and UI chrome, set with an unusually wide 0.2em tracking that makes even 12px labels feel like printed specimen text. The page is deliberately monochrome and quiet everywhere except for those three filled pills, which function as the only bursts of colour on the entire site — used as category labels, not as actions. The only true interactive surface is a green pill with a down-arrow. There are no shadows, no gradients, no decorative borders; hierarchy is built entirely through type scale, white space, and the contrast between vast dark areas and tight white text blocks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Inkwell | `#000000` | `--color-inkwell` | Page background, card surface, image masking — the entire site lives on this near-black canvas. True black, not charcoal; the void is the design |
| Bone | `#ffffff` | `--color-bone` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Ash | `#a9a9a9` | `--color-ash` | Medium-contrast borders, control outlines, and structural separators. |
| Ember | `#302f2d` | `--color-ember` | List separators with a barely-perceptible warm cast — gives the hairline rules a paper-like tone against the cold black background |
| Meadow | `#34a847` | `--color-meadow` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Coral Blush | `#fbcbcb` | `--color-coral-blush` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Apricot | `#f27851` | `--color-apricot` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |

## Tokens — Typography

### Canela Web — Hero and section headlines. A high-contrast didone-influenced display serif used at hairline weight 100 — the choice of a thin serif rather than a bold sans is the single most distinctive typographic decision: it makes 'everyday' and 'ideas' feel like printed editorial cover type, not a product headline. Free substitute: Playfair Display weight 400 italic does not match; use DM Serif Display at weight 100 or Fraunces at optical-size 144 weight 100 for the closest available stand-in. · `--font-canela-web`
- **Substitute:** Fraunces (weight 100, optical 144)
- **Weights:** 100
- **Sizes:** 40, 50, 80px
- **Line height:** 1.2–2.4
- **Letter spacing:** normal
- **Role:** Hero and section headlines. A high-contrast didone-influenced display serif used at hairline weight 100 — the choice of a thin serif rather than a bold sans is the single most distinctive typographic decision: it makes 'everyday' and 'ideas' feel like printed editorial cover type, not a product headline. Free substitute: Playfair Display weight 400 italic does not match; use DM Serif Display at weight 100 or Fraunces at optical-size 144 weight 100 for the closest available stand-in.

### PolySans — All UI text, tag labels, pill copy, and the ultra-large display variant. The geometric sans at weight 100 is anti-conventional for UI (most systems use 400–600 here) — it makes tags and buttons feel like printed specimen labels rather than app controls. The wide 0.2em tracking is the signature: it turns every label into a wide-set, posterised caption. Free substitute: Inter weight 100 or Space Grotesk weight 100, with letter-spacing manually opened to 0.2em to match. · `--font-polysans`
- **Substitute:** Inter (weight 100) with letter-spacing 0.2em
- **Weights:** 100
- **Sizes:** 12, 24, 32, 187px
- **Line height:** 0.9–2.67
- **Letter spacing:** 0.2em
- **Role:** All UI text, tag labels, pill copy, and the ultra-large display variant. The geometric sans at weight 100 is anti-conventional for UI (most systems use 400–600 here) — it makes tags and buttons feel like printed specimen labels rather than app controls. The wide 0.2em tracking is the signature: it turns every label into a wide-set, posterised caption. Free substitute: Inter weight 100 or Space Grotesk weight 100, with letter-spacing manually opened to 0.2em to match.

### sans-serif (system) — Body copy fallback — a plain system sans at 16px, used for the long-form paragraph text describing work history. Its neutrality lets the serif headings carry the visual identity. · `--font-sans-serif-system`
- **Substitute:** Inter (weight 400)
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Letter spacing:** normal
- **Role:** Body copy fallback — a plain system sans at 16px, used for the long-form paragraph text describing work history. Its neutrality lets the serif headings carry the visual identity.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 2.4px | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 24px | 1 | — | `--text-subheading` |
| heading-sm | 32px | 1 | 6.4px | `--text-heading-sm` |
| heading | 40px | 1.3 | — | `--text-heading` |
| heading-lg | 50px | 1.2 | — | `--text-heading-lg` |
| display | 80px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10000px |
| badges | 48px |
| buttons | 72px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 22px

## Components

### Category Label Pill
**Role:** Filled, non-interactive tag that sits next to a headline to label the section.

Fully rounded stadium shape, 48px radius, 29px vertical padding, 61px horizontal padding. Three colour variants: Coral Blush (#fbcbcb), Apricot (#f27851), Meadow (#34a847). Label text is PolySans weight 100, 12px, letter-spacing 0.2em, dark text on the light fills, white text on the green. No border, no shadow, no hover state — these are visual labels, not controls.

### Green CTA Pill
**Role:** The single interactive download/contact button on the page.

Filled Meadow (#34a847) stadium shape, 72px radius, 29px vertical padding, 48px horizontal padding. Contains a white down-arrow glyph (PolySans or system icon at 12px). The 72px radius — larger than the 48px label pills — visually elevates this from label to action. No hover state observed; the stillness is part of the editorial mood.

### Outlined Flow Step
**Role:** White-outline pill used in the 'People & Purpose → Brand → Service' diagram.

Transparent fill, 1px white border, 10000px radius (full pill). Text is PolySans weight 100, white, letter-spacing 0.2em. Steps are connected by short vertical white lines and small down-arrows. Functions as a process diagram, not a navigation element.

### Oval Photo Card
**Role:** Portrait/workspace photo cropped into a full pill shape as editorial imagery.

10000px border-radius on a 4:5 or 3:4 photo container. 1px white border (#ffffff). No padding, no shadow. Sits in a horizontal row of three or four across a section, each with a slightly different aspect ratio to feel hand-arranged rather than gridded.

### Client List Row
**Role:** Single row in the 'Helping leaders transform & innovate' client list.

Full-width row, no background, bottom border 1px in Ember (#302f2d) — the warm-tinted hairline is the only divider in the system. Left: company name in Bone white, PolySans weight 100, 24px. Right: small all-caps metadata tag (e.g. 'METALAB · 2021') in Ash (#a9a9a9), PolySans weight 100, 12px, letter-spacing 0.2em. 58px horizontal padding, 32px vertical padding.

### Hero Display Headline
**Role:** Oversized editorial headline that fills the viewport width.

Canela Web weight 100, 80–187px. Line-height 1.2. Pure white (#ffffff) on Inkwell (#000000). The headline is broken across multiple lines that wrap asymmetrically, with the category label pills set inline as visual punctuation. Letter-spacing is normal; the weight-100 serif is thin enough that no extra tracking is needed.

### Section Heading
**Role:** Mid-size serif heading for non-hero sections.

Canela Web weight 100, 40–50px, line-height 1.2–1.3, white on black. Two or three lines, left-aligned, set at the start of a content block with 64px top margin.

### Body Paragraph
**Role:** Long-form descriptive text — work history, philosophy statements.

System sans-serif weight 400, 16px, line-height 1.2, white on black. Max-width around 560px (roughly half the content column) so lines stay short and readable. No first-line indent, generous space between paragraphs (32–48px).

### Top Navigation Bar
**Role:** Minimal identity header.

Three text items left/center/right across the top of the page: name (left), role (center), location (right). PolySans weight 100, 12px, letter-spacing 0.2em, white. No background, no border, no hamburger — the header is just floating type.

## Do's and Don'ts

### Do
- Set the page background to #000000 and let every section sit directly on it — no nested canvas colours, no card fills.
- Use Canela Web (or Fraunces 100) at weight 100 for all headlines, including hero type up to 187px; never substitute a bold weight.
- Use the three pill colours exclusively as a triad: green for the one CTA, coral and apricot for category labels.
- Set all UI text — tag labels, nav items, pill copy — in PolySans weight 100 with letter-spacing 0.2em; the wide tracking is the signature.
- Use 10000px radius for any pill or oval container (flow steps, photo crops, diagram nodes) and 72px for action buttons; 48px is for small text labels only.
- Separate client list rows with a 1px Ember (#302f2d) hairline, never with extra vertical space or background bands.
- Hold a 96px section gap and let dark space do the visual work — resist adding dividers, shadows, or background tints between sections.

### Don't
- Do not introduce shadows, gradients, or glows — the design system is flat and depends on the void for contrast.
- Do not use a bold or semibold weight for headlines; the entire typographic identity collapses if weight 100 is replaced by 400+.
- Do not add more than three accent colours; the triad of green/coral/apricot is the palette.
- Do not turn category label pills (coral, apricot) into interactive buttons; only the green pill is a CTA.
- Do not set body copy in Canela Web or PolySans — the 16px system sans at weight 400 is the only body face, and it lets the serifs carry identity.
- Do not use square or slightly-rounded corners on any container; every shape is either a stadium (10000px / 72px / 48px) or a sharp rectangle.
- Do not place content on a coloured card; all surfaces are #000000 and hierarchy is built with type scale, not surface colour.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Base page background — every section sits directly on black, no nested canvas colour. |
| 1 | Inset | `#000000` | Card and image containers are the same black as the page, delineated only by white hairline borders or by the colourful pill labels themselves. |

## Elevation

The system deliberately avoids shadow-based elevation. Depth and hierarchy are communicated exclusively through type scale, white space, and the contrast between filled pill shapes and the flat black canvas. No component uses box-shadow; containers that need definition (photo ovals, list rows) use 1px white or warm-grey hairline borders instead.

## Imagery

Photography only — no illustration, no product renders, no abstract graphics. The imagery is documentary-style: mid-action shots of people working (a man writing on a window, a team reviewing sketches at a table, a woman presenting to a whiteboard covered in sticky notes, a circular black-and-white group shot). Treatment is naturalistic colour with a slight cool cast, cropped aggressively into oval/full-pill shapes that bleed to the section edges. The crops feel editorial — they reference Magnum-style documentary frames rather than corporate stock. The photos are the only textured content on the page; the rest is type and void. Density: four to five photo ovals per section row, each occupying roughly 15–20% of the page width, with the remaining space left empty.

## Layout

Full-bleed dark canvas with content contained to a max width of roughly 1280px and centred. The hero is a single viewport-filling block: a top bar of three floating text items, then a two-line editorial headline ('everyday' / 'ideas') with three filled pill labels set inline beside the words, and a row of three oval photo crops starting at the fold. The second section continues full-width: a row of oval photos above a two-column body — left column is a long paragraph of body copy, right column is a vertical flow diagram of outlined pills connected by arrows. The third section drops into a two-column structure: a 40–50px serif heading on the left occupying one-third, and a stacked list of client names with right-aligned metadata tags on the right occupying two-thirds. There are no background bands, no alternating light/dark sections, and no sidebar. Section rhythm is built entirely on 96px vertical gaps and the contrast between dense photo rows and quiet text blocks. Navigation is a single line of three small text items at the very top — no sticky bar, no menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- border: #302f2d (hairline) / #a9a9a9 (subtle metadata)
- accent: #fbcbcb (coral), #f27851 (apricot)
- primary action: #34a847 (filled action)

**Example Component Prompts**

1. *Hero headline*: 1280px max-width centred on #000000. Headline 'everyday ideas' in Canela Web weight 100, 160px, line-height 1.2, color #ffffff, wrapping across two lines. A coral pill (#fbcbcb, 48px radius, 29px/61px padding, 12px PolySans weight 100 letter-spacing 0.2em, color #000000, text 'work — 2023') sits inline to the right of line one. An apricot pill (#f27851, same shape, text 'product design') sits to the left of line two. A green CTA pill (#34a847, 72px radius, 29px/48px padding, 12px PolySans weight 100, letter-spacing 0.2em, color #ffffff, down-arrow glyph) sits to the right of line two.

2. *Client list row*: full-width row on #000000, 1px bottom border #302f2d, 58px left/right padding, 32px top/bottom padding. Left: company name in PolySans weight 100, 24px, color #ffffff. Right: metadata tag in PolySans weight 100, 12px, letter-spacing 0.2em, color #a9a9a9 (e.g. 'METALAB · 2021').

3. *Oval photo card*: 280px wide, 360px tall, border-radius 10000px, 1px border #ffffff, object-fit cover, no padding, no shadow. Arrange three across a section with 22px gap.

4. *Flow diagram step*: transparent pill, border-radius 10000px, 1px border #ffffff, 22px/32px padding, 12px PolySans weight 100 letter-spacing 0.2em, color #ffffff. Steps connected by a 1px white vertical line and a small down-arrow at 8px PolySans weight 100.

5. *Top nav bar*: three text items spread across the full 1280px width on #000000, no border, no background. Each item: 12px PolySans weight 100, letter-spacing 0.2em, color #ffffff. Left = name, centre = role, right = location.

## Typographic Philosophy

The system relies on a two-family pairing where both faces share weight 100, which is the design's single most distinctive choice. Headlines (Canela Web, a high-contrast didone serif) carry editorial gravitas; UI labels (PolySans, a geometric sans) carry precision. Because both are set at hairline weight, they read as a single voice — both feel like printed specimen text rather than digital UI. The 0.2em letter-spacing on every PolySans label is non-negotiable: without it, the system loses its posterised, gallery-label quality. Do not introduce a third typeface for body copy; the 16px system sans is intentionally anonymous so the two display faces can do all the visual work.

## Similar Brands

- **Active Theory** — Same flat black canvas with one candy-coloured accent pill as the only interactive element, and a typographic system that treats the viewport as editorial space rather than app chrome.
- **Resn (portfolio site)** — Shares the dark-void canvas, oversized hairline serif headlines, and the practice of using coloured pill shapes as section labels rather than traditional CTAs.
- **Locomotive (agency site)** — Same quiet-black layout with serif display type at extreme sizes, but where Locomotive uses a single accent hue, this system uses a three-colour pill triad.
- **Manual (design studio site)** — Same editorial-portfolio density — white type on black, hairline dividers, and the conviction that colour should appear only as small functional punctuation.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-inkwell: #000000;
  --color-bone: #ffffff;
  --color-ash: #a9a9a9;
  --color-ember: #302f2d;
  --color-meadow: #34a847;
  --color-coral-blush: #fbcbcb;
  --color-apricot: #f27851;

  /* Typography — Font Families */
  --font-canela-web: 'Canela Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif-system: 'sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 2.4px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: 6.4px;
  --text-heading: 40px;
  --leading-heading: 1.3;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 22px;

  /* Border Radius */
  --radius-full: 48px;
  --radius-full-2: 72px;
  --radius-full-3: 10000px;

  /* Named Radii */
  --radius-cards: 10000px;
  --radius-badges: 48px;
  --radius-buttons: 72px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-inset: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-inkwell: #000000;
  --color-bone: #ffffff;
  --color-ash: #a9a9a9;
  --color-ember: #302f2d;
  --color-meadow: #34a847;
  --color-coral-blush: #fbcbcb;
  --color-apricot: #f27851;

  /* Typography */
  --font-canela-web: 'Canela Web', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif-system: 'sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 2.4px;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: 6.4px;
  --text-heading: 40px;
  --leading-heading: 1.3;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-full: 48px;
  --radius-full-2: 72px;
  --radius-full-3: 10000px;
}
```
