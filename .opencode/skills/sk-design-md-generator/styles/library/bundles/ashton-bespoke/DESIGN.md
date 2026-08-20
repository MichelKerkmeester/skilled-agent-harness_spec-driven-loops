# Ashton Bespoke — Style Reference
> Stone cathedral of craftsmanship — warm parchment surface, one whisper of burgundy, letterspaced serif that breathes.

**Theme:** light

Ashton Bespoke operates as an editorial gallery for craftsmanship rather than a traditional website: a warm parchment canvas, one custom serif voice, and near-zero UI chrome. The entire palette collapses to stone, ink, and white with a single restrained wine note reserved for footer gravity and atmospheric emphasis. Photography carries the brand — full-bleed workshop imagery with no decorative overlay competes with nothing because the interface refuses to compete back. Generous negative space, hairline borders, and letterspaced serif headlines give every page the cadence of a printed monograph.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Burnt Wine | `#38141b` | `--color-burnt-wine` | Footer background, sectional dark bands, atmospheric accent — the sole chromatic note in an otherwise achromatic palette, used sparingly to anchor gravity |
| Ink Stone | `#262626` | `--color-ink-stone` | Primary text, hairline borders, image frames, nav links — the structural near-black that defines every edge and label |
| Warm Parchment | `#e0ded8` | `--color-warm-parchment` | Dominant page canvas, section backgrounds, card surfaces — warm stone tone that gives the site its gallery-like, hand-made feel |
| White | `#ffffff` | `--color-white` | Elevated surfaces, inverted text on dark sections, nav text over imagery, subtle highlight washes |

## Tokens — Typography

### Arial — Body text fallback — sparse usage suggests it appears in long-form paragraphs where readability supersedes brand expression · `--font-arial`
- **Substitute:** Helvetica, system-ui sans-serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.10
- **Role:** Body text fallback — sparse usage suggests it appears in long-form paragraphs where readability supersedes brand expression

### Legquinne VF — Display and heading serif — the single voice of the brand. Variable font allows optical weight tuning per context. Custom typeface; no system equivalent. · `--font-legquinne-vf`
- **Substitute:** Cormorant Garamond, Playfair Display, or EB Garamond at weight 500
- **Weights:** 500
- **Sizes:** 32px, 46px, 60px
- **Line height:** 1.10
- **Letter spacing:** 0.017em (32px), 0.022em (46px), 0.031em (60px) — unusually wide tracking for a serif, gives headlines an engraved, hand-set quality
- **OpenType features:** `'liga' on`
- **Role:** Display and heading serif — the single voice of the brand. Variable font allows optical weight tuning per context. Custom typeface; no system equivalent.

### Basis Grotesque Pro — Navigation links, small caps-style captions, and compact body labels — the quiet supporting sans that stays out of the serif's way · `--font-basis-grotesque-pro`
- **Substitute:** Inter, Work Sans, or Söhne
- **Weights:** 400, 500
- **Sizes:** 15px, 18px
- **Line height:** 1.00–1.40
- **Letter spacing:** 0.021em at 15px
- **Role:** Navigation links, small caps-style captions, and compact body labels — the quiet supporting sans that stays out of the serif's way

### Basisgrotesquepro 500 — Basisgrotesquepro 500 — detected in extracted data but not described by AI · `--font-basisgrotesquepro-500`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.1
- **Letter spacing:** 0.021
- **Role:** Basisgrotesquepro 500 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 15px | 1.1 | 0.32px | `--text-body-sm` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| heading | 32px | 1.1 | 0.54px | `--text-heading` |
| heading-lg | 46px | 1.1 | 1.01px | `--text-heading-lg` |
| display | 60px | 1.1 | 1.86px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 0px |
| images | 0px |
| buttons | 4px |

### Layout

- **Section gap:** 120px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Full-Bleed Cinematic Hero
**Role:** Opening statement section

Full-viewport dark video or still image with large letterspaced serif headline centered. No navigation chrome, no CTA, no eyebrow — just imagery and one line of text. Headline at 60px Legquinne VF, white (#ffffff), tracking 0.031em. Nav floats transparently over the imagery in white.

### Monogram Brand Mark
**Role:** Brand identity anchor

Interlocking 'AB' serif ligature, 60–80px, centered, #262626 on parchment. Functions as both a visual rest and a brand signature between content sections.

### Editorial Statement Block
**Role:** Centered mission/manifesto display

Centered column on parchment. Serif headline at 46px Legquinne VF, line-height 1.10, tracking 0.022em, #262626. Caption below in Basis Grotesque Pro 15px, tracking 0.021em. No dividers, no icons, pure typography.

### Split Image-Text Section
**Role:** Two-column editorial layout

50/50 split with text left, image right (or alternating). Text column: heading 46px serif, body 16px sans-serif at line-height 1.40, multiple short paragraphs separated by 16–24px gaps. Image edge-to-edge, no border-radius, no caption.

### Transparent Top Navigation
**Role:** Site navigation

Fixed or absolute nav bar with no background, no border, no shadow. Logo 'ASHTON BESPOKE' in tracked sans (Basis Grotesque Pro 18px, tracking 0.022em) at far left. Four text links at far right in same typeface, 12–18px gap between items. Text is white when over dark imagery, ink (#262626) when over parchment.

### Hairline-Bordered Image Frame
**Role:** Image presentation

Photographs wrapped in 1px solid #262626 borders. The border is the frame — no shadow, no radius, no caption overlay. The image sits flush on the canvas.

### Wine Footer
**Role:** Closing section

Full-bleed #38141b band at page bottom. Text in #ffffff, same serif and sans pairing as rest of site. Functions as the only chromatic moment on the site — a final tonal note before the user leaves.

### Underlined Inline Link
**Role:** Text-level navigation

1px solid underline offset 1–3px from baseline. Color #262626 on parchment, #ffffff on dark. No color change on hover — the underline may shift weight or the link may reveal a second line of text below.

### Section Anchor Tag
**Role:** Section divider indicator

Small Basis Grotesque Pro 15px label, tracking 0.021em, centered, positioned above major content sections. Functions as an editorial chapter mark rather than a navigation element.

## Do's and Don'ts

### Do
- Set headlines in Legquinne VF (or Cormorant Garamond) at 32–60px with tracking between 0.017em and 0.031em — the wide letter-spacing is signature, not optional
- Use #e0ded8 as the dominant canvas for at least 60% of the page; it is the brand's defining surface
- Reserve #38141b exclusively for the footer or at most one dark section per page — its power depends on scarcity
- Keep interfaces borderless or use 1px solid #262626 hairlines only; never apply shadows, gradients, or rounded corners larger than 4px to UI elements
- Let photographs be full-bleed or edge-to-edge with no decorative frame beyond a 1px border; the image is the component
- Use generous vertical rhythm: 80–120px between sections, 24–32px between text blocks — editorial spacing, not app spacing
- Pair the serif display with Basis Grotesque Pro for all navigation, labels, and captions; never substitute a slab or geometric sans

### Don't
- Do not introduce bright or saturated colors — the palette is deliberately achromatic with one wine note
- Do not apply border-radius larger than 4px to cards, images, or buttons; the editorial feel requires sharp geometry
- Do not use shadows, glows, or blur effects on any UI element; depth comes from photography and spacing, not elevation
- Do not set the serif below 24px or above 60px — the typeface is designed for display scale, not body or billboard
- Do not center body paragraphs or use justified text; body copy is left-aligned at line-height 1.40
- Do not add icons, badges, tags, or decorative elements; the site is typographic and photographic, not symbolic
- Do not use button fills or background colors on interactive elements; links are text-only with underlines

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#e0ded8` | Primary page background — warm stone field that dominates most sections |
| 2 | White Surface | `#ffffff` | Elevated blocks, card surfaces, contrast breaks within parchment sections |
| 3 | Wine Ground | `#38141b` | Footer and dark band backgrounds — rare inversion that signals end of page |

## Elevation

The design intentionally avoids all shadows and depth effects. Flatness is the philosophy — surfaces are distinguished by color (parchment → white → wine) and whitespace, never by elevation. The only depth cue permitted is a 1px solid #262626 hairline border for image framing.

## Imagery

Photography is the primary visual language. Full-bleed workshop imagery dominates the hero and key sections — close-cropped hands-on-tools shots, material textures (raw timber, leather, metal), and process documentation. The aesthetic is high-key warm and editorial: natural light, shallow depth of field, muted earth tones, no lifestyle staging. Images are always presented edge-to-edge or with a 1px ink border, never rounded or masked. The mood is documentary-craftsman, not luxury-catalogue. There is no illustration, no 3D rendering, no abstract graphics — the work itself is the only visual that matters.

## Layout

Full-bleed editorial layout with no max-width container. The hero is a full-viewport video or still image with a single centered serif headline. Subsequent sections are split-screen (50/50 text + image), centered statement blocks on parchment, and occasional full-width image breaks. The navigation is transparent and floats over the hero, then settles into parchment sections. Vertical rhythm is dramatic: 80–120px between sections, with most sections breathing through 40–60% of their height as negative space. The grid is implicit — no visible columns, no card grids, no pricing tables. Information density is low: one headline, one image, two or three short paragraphs per section. The site reads top-to-bottom like a magazine spread.

## Agent Prompt Guide

**Quick Color Reference**
- text: #262626 (Ink Stone)
- background: #e0ded8 (Warm Parchment)
- border: #262626 (Ink Stone, 1px hairline)
- accent: #38141b (Burnt Wine) — footer/atmospheric only
- white: #ffffff — elevated surface, text on dark
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Full-bleed hero*: 100vh background video or image, no overlay chrome. Centered headline at 60px Legquinne VF weight 500, #ffffff, letter-spacing 1.86px, line-height 1.10. Single line, sentence case in small caps style. Transparent nav floats above with white 'ASHTON BESPOKE' wordmark left, four white text links right.

2. *Editorial statement block*: Full-width parchment (#e0ded8) section, 200px vertical padding. Centered interlocking 'AB' monogram at 80px, #262626. Below: two-line serif headline at 46px Legquinne VF, line-height 1.10, tracking 1.01px, #262626. Caption at 15px Basis Grotesque Pro, tracking 0.32px, #262626, centered, 32px gap above.

3. *Split image-text section*: Two-column 50/50 layout, no gap between columns. Left column: heading at 46px Legquinne VF + three short body paragraphs at 16px Arial, line-height 1.40, #262626, 24px gap between paragraphs. Right column: full-bleed photograph with 1px solid #262626 border, no radius, no caption.

4. *Inline text link*: 1px solid underline in #262626 offset 3px from baseline. No color change, no background, no padding. Link text at 18px Basis Grotesque Pro. Used for navigation and cross-references only.

5. *Wine footer*: Full-width #38141b band, 120px vertical padding. Content in #ffffff: small sans-serif label at 15px Basis Grotesque Pro tracking 0.32px, followed by a short serif sign-off at 32px Legquinne VF. No links, no social icons, no form — just text on wine.

## Typography Philosophy

The brand speaks in one voice: Legquinne VF at display scale with intentionally wide letter-spacing. This is the most distinctive typographic choice — serif fonts are almost always set tight, but here 0.017–0.031em tracking makes the letters feel engraved, hand-set, printed rather than typed. Basis Grotesque Pro appears only at small sizes (15–18px) and only for functional text — navigation, labels, captions. The hierarchy is not created by size contrast alone; it is created by typeface contrast (serif display vs. tracked sans utility) and by tracking (wide for display, normal for body). Arial appears at 16px body — a deliberate restraint, using a system default for the least expressive text on the site.

## Negative Space as Material

Whitespace is the primary design element, not an afterthought. Sections breathe through 80–120px of vertical padding. Paragraphs are short (2–3 sentences) and separated by 24px. The statement block dedicates 60% of its height to empty parchment. The hero dedicates 40% of the viewport to empty dark space around the single headline. This is not a minimal site in the SaaS sense (white cards on white backgrounds); it is a minimal site in the editorial sense — a printed page where the margins are the composition.

## Similar Brands

- **Aesop** — Same warm-stone-and-ink palette, same editorial restraint, same reliance on full-bleed photography and near-zero UI chrome
- **Boffi** — Luxury Italian joinery brand using similar parchment canvas, letterspaced serif headlines, and full-bleed workshop photography
- **House of Hackney** — British luxury craft brand with cream editorial layouts, custom serif display type, and hairline-bordered image presentation
- **Loro Piana** — Same quiet-luxury language: warm neutral canvas, single deep accent color, letterspaced serif, and photography that does the brand work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-burnt-wine: #38141b;
  --color-ink-stone: #262626;
  --color-warm-parchment: #e0ded8;
  --color-white: #ffffff;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-legquinne-vf: 'Legquinne VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basisgrotesquepro-500: 'Basisgrotesquepro 500', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.1;
  --tracking-body-sm: 0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: 0.54px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 1.01px;
  --text-display: 60px;
  --leading-display: 1.1;
  --tracking-display: 1.86px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Layout */
  --section-gap: 120px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-parchment-canvas: #e0ded8;
  --surface-white-surface: #ffffff;
  --surface-wine-ground: #38141b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-burnt-wine: #38141b;
  --color-ink-stone: #262626;
  --color-warm-parchment: #e0ded8;
  --color-white: #ffffff;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-legquinne-vf: 'Legquinne VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basisgrotesquepro-500: 'Basisgrotesquepro 500', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.1;
  --tracking-body-sm: 0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: 0.54px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 1.01px;
  --text-display: 60px;
  --leading-display: 1.1;
  --tracking-display: 1.86px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
}
```
