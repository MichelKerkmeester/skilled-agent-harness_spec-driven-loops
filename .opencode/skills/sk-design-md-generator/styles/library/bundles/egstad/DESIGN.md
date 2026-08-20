# Egstad — Style Reference
> editorial broadside in warm ink — monumental type, one paper color, zero decoration

**Theme:** light

Egstad operates as a one-color editorial broadside: warm ink (#252422) stamped onto warm cream paper (#e2e0d9), with no decorative color, no gradients, and almost no UI chrome. The entire visual identity is carried by three typefaces — a custom monumental display face (EG Metaphor) that fills the page edge-to-edge, system Times for body copy, and a wide-tracked micro-display (S85) for navigation. Components are stripped to their bones: a fully pill-shaped dark navigation bar, hairline horizontal rules, and circular image masks that overlap type without containers. The result reads more like a printed poster or magazine masthead than a typical portfolio site — restraint as identity, typography as architecture.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Press Ink | `#252422` | `--color-press-ink` | Primary text, heading strokes, borders, dark surface for the navigation bar and any filled dark blocks — warm near-black with a brown undertone that sits softer than pure black on the cream canvas |
| Bone Paper | `#e2e0d9` | `--color-bone-paper` | Page canvas, card and container backgrounds, inverted text on dark surfaces — warm off-white with a slight olive/khaki cast that makes the dark ink feel printed rather than digital |
| Pure Carbon | `#000000` | `--color-pure-carbon` | Hairline borders and rare exact-black accents where maximum edge contrast is needed against the cream canvas |

## Tokens — Typography

### EG Metaphor — Signature display and wordmark face used across the full type scale from 12px captions to 399px page-filling headlines. The single weight (400) is intentional — the face carries all personality through its custom letterforms, not through weight contrast. Wide stylistic alternates (ss04–ss07) are active and likely swap letterforms for headline compositions. · `--font-eg-metaphor`
- **Substitute:** GT Sectra Display, Tiempos Headline, or Reckless Neue
- **Weights:** 400
- **Sizes:** 12px, 15px, 59px, 399px
- **Line height:** 0.97–1.34 depending on size — tight 0.97 at display scale, generous 1.33 at mid scale
- **Letter spacing:** -0.055em at display sizes (≈-22px at 399px, ≈-3.2px at 59px); +0.02em at small sizes (12–15px)
- **OpenType features:** `"kern" on, "liga" on, "pnum" on, "ss04" on, "ss05" on, "ss06" on, "ss07" on`
- **Role:** Signature display and wordmark face used across the full type scale from 12px captions to 399px page-filling headlines. The single weight (400) is intentional — the face carries all personality through its custom letterforms, not through weight contrast. Wide stylistic alternates (ss04–ss07) are active and likely swap letterforms for headline compositions.

### Times — Body copy only — system Times at a single 16px/1.2 size for all paragraph text. Chosen as a deliberate contrast to the custom display face: familiar, neutral, unbranded serif that lets the display type own the page. · `--font-times`
- **Substitute:** Times New Roman, system-ui serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Letter spacing:** normal
- **OpenType features:** `"kern" on, "liga" on, "pnum" on`
- **Role:** Body copy only — system Times at a single 16px/1.2 size for all paragraph text. Chosen as a deliberate contrast to the custom display face: familiar, neutral, unbranded serif that lets the display type own the page.

### S85 — Navigation micro-labels set at 12px with 0.1em tracking and a 3.0 line-height that creates generous vertical air around each nav item. Sits inside the dark pill nav bar as uppercase or small-caps category labels (EGSTAD, WORK, EMAIL). · `--font-s85`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Söhne Mono at 12px with 0.1em tracking
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 3.00
- **Letter spacing:** 0.1em (1.2px)
- **OpenType features:** `"ss04" on, "ss05" on, "ss06" on, "ss07" on`
- **Role:** Navigation micro-labels set at 12px with 0.1em tracking and a 3.0 line-height that creates generous vertical air around each nav item. Sits inside the dark pill nav bar as uppercase or small-caps category labels (EGSTAD, WORK, EMAIL).

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.24px | `--text-caption` |
| body-sm | 15px | 1.34 | 0.3px | `--text-body-sm` |
| heading | 59px | 1.33 | -3.245px | `--text-heading` |
| display | 399px | 0.97 | -21.945px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 7 | 7px | `--spacing-7` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| navPill | 1440px |
| navInner | 36px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80-120px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Pill Navigation Bar
**Role:** Primary site navigation

Fully pill-shaped dark bar (1440px border-radius) filled with Press Ink (#252422), containing the site name and nav links. Internal padding roughly 7px right margin between items, 16px vertical padding. Hosts S85 12px labels with 0.1em tracking in Bone Paper (#e2e0d9) text. Sits at the very top-left of the viewport, compact and horizontally oriented.

### Nav Tab Item
**Role:** Individual navigation link

S85 at 12px, 0.1em letter-spacing, line-height 3.0 for vertical air. Text color Bone Paper (#e2e0d9) on the dark pill background. No hover state indicated — flat, label-only, no underlines or icons. Separated by 7–16px gaps within the pill.

### Display Wordmark
**Role:** Hero-scale brand identifier

EG Metaphor at 399px, weight 400, line-height 0.97, letter-spacing -0.055em (≈-22px). Fills nearly the full viewport width. Color Press Ink (#252422) on Bone Paper (#e2e0d9). Often overlapped by circular image masks without z-index conflict. This is the signature element — it is not a heading, it is architecture.

### Mid-Scale Heading
**Role:** Section-level headline

EG Metaphor at 59px, weight 400, line-height 1.33, letter-spacing -0.055em (≈-3.2px). Press Ink color. Used for secondary headlines that need the same personality as the display wordmark at a human-readable size.

### Body Paragraph
**Role:** Readable paragraph copy

System Times at 16px, line-height 1.2, weight 400, normal letter-spacing. Press Ink (#252422) color. No paragraph spacing beyond the 1.2 line-height multiplier — text sits in tight, continuous blocks. Sits directly beneath display type without an intervening label or eyebrow.

### Circular Image Mask
**Role:** Portrait or visual insert

Photograph cropped to a perfect circle with no border, no shadow, no padding ring. Overlaps display type and body text directly, with the image content visible in front of the letterforms. No border-radius specified but rendered as 50% or a large fixed value. Image color and content carry the only chromatic variation in the system.

### Hairline Divider
**Role:** Section or content separator

1px horizontal rule in Press Ink (#252422) or Pure Carbon (#000000). Full-width or constrained to content width depending on context. No decorative styling — just a line. Used to separate body paragraphs from links or to close sections.

### Footer Block
**Role:** Page-bottom content area

Minimal footer with 22px vertical padding above and below content. Uses the same Times 16px body type. No background color change, no border — flows directly from the page canvas.

## Do's and Don'ts

### Do
- Use Press Ink (#252422) on Bone Paper (#e2e0d9) for all text — never introduce a second color
- Set display headlines in EG Metaphor at 399px with -0.055em letter-spacing and 0.97 line-height so letters touch and fill the viewport
- Use system Times at 16px/1.2 for all body copy — do not substitute a different serif
- Set nav labels in S85 (or a mono fallback) at 12px with 0.1em tracking and 3.0 line-height for vertical air inside the pill bar
- Use 1440px border-radius for the main navigation pill so it reads as a perfect capsule
- Separate content with 1px hairline rules in Press Ink or Pure Carbon — never with background color blocks
- Let circular image masks overlap display type without borders, shadows, or padding rings

### Don't
- Do not add accent colors, gradients, or chromatic buttons — the system is monochrome by design
- Do not apply box-shadows to any element — separation comes from ink contrast, not elevation
- Do not use bold or semibold weights of EG Metaphor or Times — the entire system runs at weight 400
- Do not break the display headline into multiple lines with manual line-breaks — let it run edge to edge as a single composition
- Do not use small radii (4px, 8px, 12px) on containers — the only radii in the system are 1440px (pill) and 36px (nav inner)
- Do not add icons, badges, tags, or pill labels inside body content — navigation and labeling are text-only
- Do not set body copy in EG Metaphor — reserve that face exclusively for display and heading scales

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#e2e0d9` | Base page background — warm cream that all other elements sit on |
| 1 | Ink Surface | `#252422` | Dark filled blocks (navigation bar pill, footer if present) — warm near-black with brown undertone |

## Elevation

No shadows. All spatial separation is achieved through the warm dark-on-cream contrast, hairline borders in Pure Carbon or Press Ink, and generous negative space. Elevation is communicated by ink density, not by blur or offset.

## Imagery

Imagery is extremely sparse and used only as a single circular portrait mask that overlaps the display wordmark. The photograph is a tight face crop, natural color, no filter or duotone treatment, no background context. No product photography, no illustration, no abstract graphics. The visual language is overwhelmingly text-driven: the typography IS the imagery, and the photograph exists only to humanize the type-driven page. No icon system is present beyond the text-based nav labels.

## Layout

Full-bleed editorial layout with no visible max-width constraint at the display scale — the 399px wordmark fills edge to edge. Below the hero, content is left-aligned with generous left margin and flows in a single narrow column (constrained to roughly 700–900px for readability). The pill nav bar sits absolutely or fixed at the top-left corner of the viewport, compact and horizontal. The page reads as a vertical scroll of monumental type blocks separated by hairline rules and small circular image interruptions — no card grids, no multi-column feature sections, no alternating dark/light bands. Navigation is a minimal top bar; no sidebar, no mega-menu, no footer navigation system beyond simple text links.

## Agent Prompt Guide

**Quick Color Reference**
- text: #252422
- background: #e2e0d9
- dark surface (nav bar): #252422
- border: #000000 or #252422
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a pill navigation bar: 1440px border-radius, background #252422, padding 16px vertical, positioned top-left. Inside, set nav labels in S85 (or JetBrains Mono) at 12px, weight 400, 0.1em letter-spacing, line-height 3.0, color #e2e0d9, with 7–16px gaps between items.

2. Create a display wordmark hero: full-bleed EG Metaphor (or GT Sectra Display) at 399px, weight 400, line-height 0.97, letter-spacing -0.055em, color #252422 on #e2e0d9 background. A circular portrait image (50% border-radius, no border, no shadow) overlaps the lower-right portion of the wordmark.

3. Create a body text block: Times at 16px, weight 400, line-height 1.2, color #252422 on #e2e0d9. Constrain width to ~800px, left-aligned with generous left margin. Close the block with a 1px hairline rule in #252422.

4. Create a mid-scale section heading: EG Metaphor at 59px, weight 400, line-height 1.33, letter-spacing -0.055em, color #252422. Sits above body copy with ~40px gap, no eyebrow label or decorative element.

5. Create a footer: 22px padding top and bottom, Times 16px body text in #252422 on #e2e0d9, no background change, no border, no icons — just text links separated by spaces.

## Similar Brands

- **Pentagram partner sites** — Same editorial broadside treatment — one custom display face at extreme scale, warm paper background, no decorative UI, typography as the entire visual system
- **It's Nice That features** — Large-format serif display type filling the viewport, minimal monochrome palette, circular portrait crops overlapping headlines
- **Manual (manualcreative.jp)** — Pill-shaped dark navigation bar, oversized custom display wordmark, warm off-white canvas, zero chromatic accents
- **Locomotive (locomotive.ca)** — Monumental serif display type, restrained monochrome palette, editorial magazine-masthead feel rather than SaaS product UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-press-ink: #252422;
  --color-bone-paper: #e2e0d9;
  --color-pure-carbon: #000000;

  /* Typography — Font Families */
  --font-eg-metaphor: 'EG Metaphor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-s85: 'S85', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.24px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.34;
  --tracking-body-sm: 0.3px;
  --text-heading: 59px;
  --leading-heading: 1.33;
  --tracking-heading: -3.245px;
  --text-display: 399px;
  --leading-display: 0.97;
  --tracking-display: -21.945px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-22: 22px;
  --spacing-30: 30px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80-120px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-3xl: 36px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-navpill: 1440px;
  --radius-navinner: 36px;

  /* Surfaces */
  --surface-paper-canvas: #e2e0d9;
  --surface-ink-surface: #252422;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-press-ink: #252422;
  --color-bone-paper: #e2e0d9;
  --color-pure-carbon: #000000;

  /* Typography */
  --font-eg-metaphor: 'EG Metaphor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-s85: 'S85', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.24px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.34;
  --tracking-body-sm: 0.3px;
  --text-heading: 59px;
  --leading-heading: 1.33;
  --tracking-heading: -3.245px;
  --text-display: 399px;
  --leading-display: 0.97;
  --tracking-display: -21.945px;

  /* Spacing */
  --spacing-7: 7px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-22: 22px;
  --spacing-30: 30px;

  /* Border Radius */
  --radius-3xl: 36px;
  --radius-full: 1440px;
}
```
