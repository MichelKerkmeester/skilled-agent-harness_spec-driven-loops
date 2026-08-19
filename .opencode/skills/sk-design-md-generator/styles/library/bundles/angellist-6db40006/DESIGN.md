# Angellist — Style Reference
> Editorial annual on matte paper

**Theme:** light

Angellist's 2024 Year in Review reads as a printed editorial annual repurposed for the web — enormous display type set in a custom sans, a single chromatic accent, and surfaces that breathe. The system runs light: warm off-white canvases carry deep teal ink, while a soft lavender punctuates highlights, badges, and the signature gradient that floods the hero headlines. Everything rounds to a pill (9999px) — buttons, tags, nav anchors, even section labels — which makes the monumental type feel approachable rather than imposing. The result is confident, restrained, and slightly literary: an annual report, not a product page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Inkwell Teal | `#001d21` | `--color-inkwell-teal` | Primary text, heading fill, hero background, card backgrounds for high-contrast panels |
| Vellum Lavender | `#bdbbff` | `--color-vellum-lavender` | Signature accent — highlight washes behind text, section badges, decorative strokes, the right-hand terminus of display gradients |
| Sage Mist | `#ccd5d6` | `--color-sage-mist` | Dominant canvas background, hairline borders, dividers |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, image panels, inverse text on dark |
| Bone | `#f9f9f7` | `--color-bone` | Warm off-white alt surface, muted body text on dark backgrounds |
| Driftwood | `#eaebea` | `--color-driftwood` | Subtle banded sections, tertiary surface layer |
| Slate Veil | `#647577` | `--color-slate-veil` | Mid-gray supporting text, muted UI labels |
| Pewter Deep | `#43585a` | `--color-pewter-deep` | Dark banded section fills, layered surface |
| Gunmetal | `#213a3d` | `--color-gunmetal` | Even darker banded fills, image overlay scrim base |
| Patina | `#002b31` | `--color-patina` | Deepest teal — link backgrounds, footer anchors |
| Frost | `#a7b0b1` | `--color-frost` | Cool mid-gray surface accent |
| Pebble | `#859394` | `--color-pebble` | Muted surface layer for stacked color bands |
| Mist | `#b2bfc1` | `--color-mist` | Secondary border tone |
| Olive Violet Wash | `linear-gradient(98.78deg, rgb(127, 120, 51) 6.69%, rgb(137, 142, 229) 40.89%, rgb(137, 142, 229) 83.02%, rgb(134, 123, 54) 100.19%)` | `--color-olive-violet-wash` | Display type gradient — mid-stop of the olive→violet hero fill |

## Tokens — Typography

### angellistDisplay — Display headlines — the brand's signature voice. Used from 28px section openers up to 288px hero type. Single weight (400) carries the system; size alone does the shouting. Tabular lining numerals and three stylistic sets (ss01–ss03) make this a purpose-built editorial face, not a system font fallback. · `--font-angellistdisplay`
- **Substitute:** Inter Tight, Söhne Breit, or Suisse Int'l
- **Weights:** 400
- **Sizes:** 28px, 38px, 60px, 80px, 144px, 260px, 288px
- **Line height:** 0.75, 0.80, 1.00, 1.05, 1.10, 1.15, 1.25, 1.30
- **Letter spacing:** -0.025em at 80px+ to -0.01em at 28px — tracking tightens as size grows
- **OpenType features:** `"lnum" on, "tnum" on, "ss01" on, "ss02" on, "ss03" on`
- **Role:** Display headlines — the brand's signature voice. Used from 28px section openers up to 288px hero type. Single weight (400) carries the system; size alone does the shouting. Tabular lining numerals and three stylistic sets (ss01–ss03) make this a purpose-built editorial face, not a system font fallback.

### angellist — Body, UI, and supporting type. 400 for body copy, 500/550 for labels, nav, and button text. The 550 weight is a half-step — a quiet way to add emphasis without bolding. Same stylistic sets as the display face keep the two families visually stitched together. · `--font-angellist`
- **Substitute:** Inter, Söhne, or Suisse Int'l
- **Weights:** 400, 500, 550
- **Sizes:** 13px, 14px, 16px, 18px, 20px, 144px
- **Line height:** 0.80, 1.00, 1.40, 1.50, 1.60
- **Letter spacing:** -0.004em at 16–20px, -0.002em at 13–14px, tightening to -0.05em only on micro-labels
- **OpenType features:** `"lnum" on, "tnum" on, "ss01" on, "ss02" on, "ss03" on`
- **Role:** Body, UI, and supporting type. 400 for body copy, 500/550 for labels, nav, and button text. The 550 weight is a half-step — a quiet way to add emphasis without bolding. Same stylistic sets as the display face keep the two families visually stitched together.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.002px | `--text-caption` |
| body | 16px | 1.5 | -0.004px | `--text-body` |
| body-lg | 18px | 1.6 | -0.004px | `--text-body-lg` |
| subheading | 20px | 1.4 | -0.004px | `--text-subheading` |
| heading-sm | 28px | 1.25 | -0.01px | `--text-heading-sm` |
| heading-lg | 60px | 1.1 | -0.02px | `--text-heading-lg` |
| display | 80px | 1.05 | -0.025px | `--text-display` |
| display-lg | 144px | 1 | -0.025px | `--text-display-lg` |
| display-xl | 260px | 0.8 | -0.025px | `--text-display-xl` |
| display-2xl | 288px | 0.75 | -0.025px | `--text-display-2xl` |

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |
| 160 | 160px | `--spacing-160` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 9999px |
| links | 2px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-96px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Button — Filled
**Role:** Primary action control

9999px radius. 4px vertical / 10–12px horizontal padding. Body weight 500 at 14–16px, letter-spacing -0.004em. Filled with Inkwell Teal (#001d21), text Paper White. No border. The pill shape is the signature — never square it.

### Pill Button — Ghost / Outlined
**Role:** Secondary action on dark backgrounds

9999px radius. 1px Paper White border, transparent fill, Paper White text. Same internal padding as filled variant. Used for the nav 'JOIN US' CTA on the dark bar.

### Section Badge
**Role:** Eyebrow label above section headings

9999px radius. Vellum Lavender (#bdbbff) fill, Inkwell Teal text. Body weight 500 at 13–14px. Padding 4px top/bottom, 10px sides. Functions as a soft category tag, e.g. '2024 BUILD'.

### Navigation Bar
**Role:** Top-level site navigation

Full-width, Inkwell Teal (#001d21) background. Logo wordmark left in Paper White, nav links centered in Paper White at 14px/500, ghost pill CTA right. No drop shadow — flat against the dark.

### Display Headline — Hero
**Role:** Page-level monumental type

angellistDisplay 400 at 144–288px. Line-height 0.75–0.80 (negative leading — letters almost touch). Letter-spacing -0.025em. Fill is the Olive→Violet linear-gradient. Mixed weight variants of characters sit in the same line, creating a duotone letterform effect within a single word.

### Display Headline — Section
**Role:** Sub-hero section opener

angellistDisplay 400 at 60–80px on white, Inkwell Teal fill. Line-height 1.05–1.10. Letter-spacing -0.02em. Often paired with a lavender text-highlight on a key phrase.

### Text Highlight
**Role:** Inline emphasis on a phrase within a heading

Vellum Lavender (#bdbbff) rectangle behind one or two words of a heading. Crisp 2px corners, no padding adjustment — it sits flush behind the text baseline. Inkwell Teal text remains on top, contrast is still AAA.

### Feature Image Card
**Role:** Three-up content card with overlay text

Three equal cards in a row, 9999px radius. Each is a full-bleed image (or solid color block in Vellum Lavender, Inkwell Teal) with Paper White body text bottom-left, 16px, weight 400. No card shadow — the image IS the card.

### Horizontal Band Stack
**Role:** Full-bleed section divider / color catalogue

Stacked full-width horizontal bands in the surface palette (Sage Mist → Driftwood → Frost → Pewter Deep → Gunmetal → Inkwell Teal). Each band 40–60px tall. No gaps, no text — pure color rhythm. Functions as a typological signature between major content sections.

### Two-Column Split Section
**Role:** Heading-left, body-right editorial layout

60/40 split. Large display heading (heading-lg / display) left-aligned on left, body copy at 18px/1.6 right-aligned on right. Vertically centered. Sage Mist background, no card containers — text floats on canvas.

### Body Paragraph
**Role:** Running text

angellist 400 at 18px, line-height 1.6, letter-spacing -0.004em. Inkwell Teal on Sage Mist. Max width ~50ch. Never center-aligned.

### Footer Anchor
**Role:** Bottom link/CTA

Pill-shaped link with Patina (#002b31) background, Paper White text. 9999px radius. Same internal padding as nav ghost button.

## Do's and Don'ts

### Do
- Set display type at 60px minimum when it carries meaning — anything smaller undermines the editorial voice.
- Use 9999px radius on every button, tag, badge, and image card. The pill is the shape language.
- Reach for the Olive→Violet linear-gradient only on display headlines. Never on body type, buttons, or backgrounds.
- Pair the Vellum Lavender highlight with Inkwell Teal text — the contrast is 8:1+, never lose it to a lighter background.
- Use the 550 weight of angellist for labels and button text; reserve 500 for inline emphasis. Never use 700+ — the system speaks in one voice.
- Keep body text at 18px on the canonical reading sections. 16px is the floor for UI chrome only.
- Separate major sections with the horizontal band stack — let the palette breathe as its own composition.

### Don't
- Don't set display type in pure Paper White on dark — the gradient IS the display color, not a fallback.
- Don't introduce a second accent color. The system is monochrome + lavender; any other hue breaks the annual-report register.
- Don't use 2px or 4px radii on interactive elements — those values are reserved for the lavender text highlight only.
- Don't center-align body copy. The system is asymmetric and editorial, left rail first.
- Don't add drop shadows to cards or buttons. Elevation is handled by surface tone shifts (Sage → Paper White → Bone), never by blur.
- Don't break the 9999px pill on the nav CTA, even at desktop scale. The roundedness scales with the layout.
- Don't use the Olive→Violet gradient at body sizes — it reads muddy below 60px.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Sage Mist | `#ccd5d6` | Dominant page canvas and section dividers |
| 2 | Paper White | `#ffffff` | Card and image panel surfaces |
| 3 | Bone | `#f9f9f7` | Warm alt-surface for nested content blocks |
| 4 | Driftwood | `#eaebea` | Tertiary section banding |
| 5 | Inkwell Teal | `#001d21` | Dark hero and feature-card backgrounds |

## Elevation

- **Feature Image Card:** `none — flat, no shadow`
- **Section Badge:** `none — the lavender fill against the canvas is sufficient separation`
- **Pill Button:** `none — relies on fill, no elevation`

## Imagery

Imagery is sparse and editorial rather than decorative. The few photographs (e.g. the laptop-on-cushion card) are treated as full-bleed card fills, tightly cropped, and overlaid with Paper White body text. There are no lifestyle contexts, no human subjects, no atmosphere shots — the object or surface is the subject. Color is used in lieu of imagery more often than not: solid Vellum Lavender and Inkwell Teal card panels stand in for photographs, making the layout feel more like a design annual than a product page. Icons are absent from the visible chrome; the wordmark and display type do the brand work alone.

## Layout

The page model is full-bleed for the dark hero and the band-stack dividers, then constrained to a ~1280px max-width content rail for the editorial sections. Hero: full-viewport-width dark teal field with monumental display type that bleeds past the edges — no centered headline, no subtitle lockup, just type and a single body subline. Sections alternate: dark hero → white editorial block → three-up image cards → full-bleed color band stack → next section. The editorial blocks use a 60/40 two-column split (heading left, body right) and generous 80–96px vertical padding. Navigation is a minimal top bar (logo left, links center, pill CTA right) on the dark hero. The rhythm is: dramatic opening, quiet reading sections, visual card break, more quiet reading — like turning pages in a print annual.

## Agent Prompt Guide

## Quick Color Reference
- text: #001d21 (Inkwell Teal)
- background: #ccd5d6 (Sage Mist) for page, #ffffff (Paper White) for cards
- border: #ccd5d6 (Sage Mist) hairlines
- accent: #bdbbff (Vellum Lavender)
- display gradient: linear-gradient(98.78deg, #7f7833, #898ee5, #898ee5, #867b36)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Headline**: Full-bleed #001d21 background, no max-width. Display type at 260px using angellistDisplay weight 400, line-height 0.80, letter-spacing -0.025em, fill with the Olive→Violet linear-gradient. Subline in angellist 400 at 18px, color #f9f9f7, 1.6 line-height, max-width 50ch.

2. **Section Opener**: #ccd5d6 canvas. Eyebrow badge: #bdbbff fill, #001d21 text, 9999px radius, 4px 10px padding, 14px weight 500. Heading: angellistDisplay 400 at 80px, #001d21, line-height 1.05, letter-spacing -0.02em. Wrap one key phrase in a #bdbbff 2px-radius highlight.

3. **Feature Image Card Grid**: Three equal cards, 9999px radius, no shadow. First card: #001d21 fill, Paper White body text at 16px bottom-left. Second card: #bdbbff fill, #001d21 text. Third card: full-bleed photograph. 32px gap between cards.

4. **Pill Button**: 9999px radius, 4px 12px padding, #001d21 fill, #ffffff text, angellist weight 500 at 14px, letter-spacing -0.004em. Never add a border or shadow.

5. **Horizontal Band Stack**: Full-bleed stack of 5–6 bands, 50px each, in sequence #ccd5d6 → #eaebea → #a7b0b1 → #859394 → #43585a → #213a3d → #001d21. No text, no dividers between bands.

## Display Type Philosophy

angellistDisplay exists at one weight (400) but at seven sizes — from 28px section openers to 288px hero type. The system deliberately withholds bold weights; size and tight tracking do the work instead. Line-height collapses to 0.75 at the largest sizes (260–288px), so letterforms nearly touch — this is the page's defining move. The 260–288px sizes appear ONLY in the hero, and they should be reserved for moments that earn them. Sub-hero display ranges from 60–80px with 1.05–1.10 line-height, giving breathing room without losing the editorial register.

## Gradient Discipline

Two gradients are defined. The Olive→Violet (rgb 127,120,51 → 137,142,229 → 137,142,229 → 134,123,54) is the primary display gradient and should fill display headlines only. The wider spectrum gradient (violet → pink → coral → peach → lavender → olive → blue → cream) is a single-use atmospheric effect. Never apply gradients to body text, UI controls, or backgrounds — the system stays muted in chrome and dramatic only in editorial type.

## Similar Brands

- **Stripe Press** — Same annual-report editorial register, monumental display type on dark, single accent color, pill-shaped controls, and a near-achromatic chrome
- **Linear** — Light, clean SaaS surface treatment with pill-shaped buttons, restrained palette, and oversized display type — though Angellist's hero is more typographic and less product-photography-driven
- **Figma Config** — Editorial microsite language: massive custom display type, flat color band section dividers, restrained palette letting type carry the brand
- **Notion Year in Review** — Annual-report format with large display headlines, soft pastel accents on a near-white canvas, and a deliberately un-corporate editorial feel
- **Arc browser** — Pill-shaped nav and CTAs, warm off-white canvas, oversized display headings, and the same kind of confident type-led hierarchy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-inkwell-teal: #001d21;
  --color-vellum-lavender: #bdbbff;
  --color-sage-mist: #ccd5d6;
  --color-paper-white: #ffffff;
  --color-bone: #f9f9f7;
  --color-driftwood: #eaebea;
  --color-slate-veil: #647577;
  --color-pewter-deep: #43585a;
  --color-gunmetal: #213a3d;
  --color-patina: #002b31;
  --color-frost: #a7b0b1;
  --color-pebble: #859394;
  --color-mist: #b2bfc1;
  --color-olive-violet-wash: #898ee5;
  --gradient-olive-violet-wash: linear-gradient(98.78deg, rgb(127, 120, 51) 6.69%, rgb(137, 142, 229) 40.89%, rgb(137, 142, 229) 83.02%, rgb(134, 123, 54) 100.19%);

  /* Typography — Font Families */
  --font-angellistdisplay: 'angellistDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-angellist: 'angellist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.002px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.004px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.004px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.004px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.01px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.02px;
  --text-display: 80px;
  --leading-display: 1.05;
  --tracking-display: -0.025px;
  --text-display-lg: 144px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.025px;
  --text-display-xl: 260px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -0.025px;
  --text-display-2xl: 288px;
  --leading-display-2xl: 0.75;
  --tracking-display-2xl: -0.025px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w550: 550;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-96px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 9999px;
  --radius-links: 2px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-sage-mist: #ccd5d6;
  --surface-paper-white: #ffffff;
  --surface-bone: #f9f9f7;
  --surface-driftwood: #eaebea;
  --surface-inkwell-teal: #001d21;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-inkwell-teal: #001d21;
  --color-vellum-lavender: #bdbbff;
  --color-sage-mist: #ccd5d6;
  --color-paper-white: #ffffff;
  --color-bone: #f9f9f7;
  --color-driftwood: #eaebea;
  --color-slate-veil: #647577;
  --color-pewter-deep: #43585a;
  --color-gunmetal: #213a3d;
  --color-patina: #002b31;
  --color-frost: #a7b0b1;
  --color-pebble: #859394;
  --color-mist: #b2bfc1;
  --color-olive-violet-wash: #898ee5;

  /* Typography */
  --font-angellistdisplay: 'angellistDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-angellist: 'angellist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: -0.002px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.004px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.004px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.004px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.01px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.02px;
  --text-display: 80px;
  --leading-display: 1.05;
  --tracking-display: -0.025px;
  --text-display-lg: 144px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.025px;
  --text-display-xl: 260px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -0.025px;
  --text-display-2xl: 288px;
  --leading-display-2xl: 0.75;
  --tracking-display-2xl: -0.025px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-full: 9999px;
}
```
