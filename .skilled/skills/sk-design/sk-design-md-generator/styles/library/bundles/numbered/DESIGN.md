# Numbered — Style Reference
> fashion editorial on black velvet. A near-black runway where a single face fills the frame and the only marks are white ink and a whispered bronze thread.

**Theme:** dark

Numbered operates as a fashion-editorial canvas: a deep ink-black void that lets full-bleed portrait photography and oversized typography do all the work. The interface is almost invisible — no buttons, no cards, no grids — just hairline white type floating over imagery and near-black panels. A single warm bronze tone (#bc9873) surfaces occasionally as a material accent against the monochrome severity, echoing the golden-hour skin tones in the photography. Whitespace is treated as a luxury material: sections are separated by 80–120px vertical gaps, content is anchored to wide left/right gutters of ~119–238px, and links are underlined plain text rather than interactive widgets. The system reads as a magazine spread, not a product UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#111111` | `--color-ink-black` | Primary canvas — full-page background, hero panels, footer. The dominant surface everything else floats over |
| Paper White | `#ffffff` | `--color-paper-white` | All text, hairline borders, nav links, section labels. The only ink on the page; used at 100% opacity on dark surfaces and as a border-only accent on imagery |
| Smoke | `#4f4f4f` | `--color-smoke` | Subtle hairline borders on navigation elements — recedes against the ink black, visible only on close inspection |
| Bronze Veil | `#bc9873` | `--color-bronze-veil` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### aktiv-web (custom) / substitute: Inter Tight or Söhne — Primary workhorse — nav labels at 12–13px (weight 400, tracked), body and section headings at 25px (weight 400, line-height 1.2), mid-page editorial statements at 54px (weight 400, line-height 1.2), and the 'CASES / STUDIES' two-line heading at ~74px. The signature choice: weight 400 for 54–74px display sizes — no bold display, no uppercase shouting. Headlines read as confident paragraphs, not banners. · `--font-aktiv-web-custom-substitute-inter-tight-or-shne`
- **Substitute:** Inter Tight or Söhne
- **Weights:** 400, 700
- **Sizes:** 12, 13, 15, 25, 54, 74
- **Line height:** 1.0, 1.2, 1.5, 2.0
- **Role:** Primary workhorse — nav labels at 12–13px (weight 400, tracked), body and section headings at 25px (weight 400, line-height 1.2), mid-page editorial statements at 54px (weight 400, line-height 1.2), and the 'CASES / STUDIES' two-line heading at ~74px. The signature choice: weight 400 for 54–74px display sizes — no bold display, no uppercase shouting. Headlines read as confident paragraphs, not banners.

### Editorial display serif (not captured in data — visible in hero wordmark) — The 'Numbered' wordmark uses a high-contrast transitional/old-style serif with sharp terminals — the only non-sans element in the system. This single serif mark is the brand's typographic signature; it appears once per page as a hero anchor and nowhere else. Suggested substitutes: PP Editorial New, GT Sectra, or Canela. · `--font-editorial-display-serif-not-captured-in-data-visible-in-hero-wordmark`
- **Substitute:** PP Editorial New or GT Sectra
- **Weights:** 400
- **Sizes:** viewport-scale, est. 200–300px
- **Line height:** 1.0
- **Role:** The 'Numbered' wordmark uses a high-contrast transitional/old-style serif with sharp terminals — the only non-sans element in the system. This single serif mark is the brand's typographic signature; it appears once per page as a hero anchor and nowhere else. Suggested substitutes: PP Editorial New, GT Sectra, or Canela.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.5 | — | `--text-body` |
| subheading | 25px | 1.2 | — | `--text-subheading` |
| heading | 54px | 1.2 | — | `--text-heading` |
| display | 74px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 59 | 59px | `--spacing-59` |
| 79 | 79px | `--spacing-79` |
| 119 | 119px | `--spacing-119` |
| 178 | 178px | `--spacing-178` |
| 238 | 238px | `--spacing-238` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px (no cards) |
| images | 0px (photography is edge-to-edge, never rounded) |
| buttons | 0px (no buttons) |

### Layout

- **Section gap:** 99px
- **Element gap:** 20-35px

## Components

### Hero Wordmark
**Role:** Brand anchor overlaid on full-bleed editorial photography

The serif 'Numbered' wordmark rendered at viewport-bleed scale (est. 200–300px), white #ffffff, 0px radius, no background — sits directly on the photograph. Anchors the page; appears once.

### Centered Nav Link
**Role:** Minimal top-center navigation

Single 'CONTACT' label at 12–13px aktiv-web weight 400, white #ffffff, tracked uppercase, positioned absolute top-center of the viewport. No logo in nav, no menu items, no hamburger. This is the entire navigation.

### Editorial Headline Block
**Role:** Primary page statement on dark panels

54–74px aktiv-web weight 400, white #ffffff, line-height 1.0–1.2, left-aligned with ~238px left gutter. No bold weight, no color accent — just large quiet type. The 'CASES / STUDIES' heading stacks on two lines as a signature device.

### Underlined Text Link
**Role:** All interactive navigation within content

12–13px aktiv-web weight 400, white #ffffff, 1px white underline, 3px padding-bottom for the underline offset. Examples: 'ABOUT US', 'VIEW ALL', 'CONTACT'. No buttons, no pills, no filled rectangles — the underline IS the affordance.

### Full-Bleed Case Study Image
**Role:** Project showcase panel

Edge-to-edge photography, 0px radius, no border, no overlay. Project metadata ('COTERIE / REDEFINING DIAPERS FOR MODERN PARENTS') sits as small white text top-left in two lines, 12–13px uppercase tracked.

### Description Caption
**Role:** Subtitle under hero wordmark

15px aktiv-web weight 400, white #ffffff, line-height 1.5, centered. Example: 'Design, Content Production & Technology — Amsterdam, Paris & New York'. Quiet functional text beneath the display mark.

### Bronze Accent Panel
**Role:** Warm secondary surface for tonal break

#bc9873 background, no border, 0px radius, used as a full-width band. No text sits on this surface — it functions as a color-only breath between black sections, echoing the photography's palette.

## Do's and Don'ts

### Do
- Use #111111 as the default canvas for every section that isn't full-bleed photography
- Set body type at 15px aktiv-web weight 400, line-height 1.5
- Set display/headline type at 54–74px aktiv-web weight 400 — never bold, never uppercase
- Anchor content with 119–238px left/right page gutters
- Render navigation links as underlined 12–13px white text — no buttons, no pills
- Use #bc9873 only as a full-bleed accent surface, never for text or interactive elements
- Let photography bleed to all four viewport edges with 0px radius

### Don't
- Don't add cards, rounded corners, or shadows — this system is flat and edge-to-edge
- Don't use color for interactive states — white-on-black underline text is the only affordance
- Don't bold the display sizes — weight 400 at 74px is the signature, weight 700 would break it
- Don't place text on #bc9873 — the bronze surface is decorative only, not a text background
- Don't center body content — everything left-aligns to a wide left gutter
- Don't add a second typeface beyond the serif wordmark and aktiv-web — the system is deliberately bilingual: one display serif used once, one sans used everywhere else
- Don't use more than one white opacity level — text and borders are #ffffff at 100%, no grays for type

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Ink Black Canvas | `#111111` | Primary page background, all text panels, hero sections over flat color |
| 1 | Bronze Accent Band | `#bc9873` | Full-bleed warm surface for tonal break between black sections |
| 2 | Photographic Surface | `#000000` | Full-bleed editorial photography replaces the black canvas on hero and case study panels |

## Elevation

The system is deliberately shadowless. All surfaces are flat and edge-to-edge. Depth is created only by the contrast between full-bleed photography and flat ink-black panels — not by box-shadows. The absence of elevation is a signature: this is a magazine spread, not a software interface.

## Imagery

The site is image-dominant in a single specific way: full-bleed editorial portrait photography occupies the entire viewport on hero and case study panels. Treatment is tight close-ups of faces — cropped at forehead and chin, no lifestyle context, no product staging. Color treatment is warm golden-hour naturalism with rich skin tones, soft shadows, and organic textures (knit fabrics, hair, jewelry). Photography is never contained or rounded — it bleeds to all four viewport edges with raw unframed edges. No illustrations, no icons, no product screenshots, no abstract graphics. Icons, if present, would be invisible against the editorial minimalism.

## Layout

Full-bleed page model with no max-width container. Each section occupies the full viewport: a photograph fills the screen with the serif wordmark overlaid, then cuts to a flat #111111 panel with a left-anchored editorial headline and small underlined link below it, then another full-bleed photograph. Navigation is a single absolute-positioned 'CONTACT' link top-center — no bar, no logo. Content is left-aligned to a ~238px gutter, never centered. Section rhythm: photograph → black panel → black panel with stacked heading → photograph → bronze band. Vertical spacing between sections is generous (80–120px). The grid is effectively a single column — no multi-column card grids, no feature matrices, no pricing tables. Density is extremely low: 3–4 elements per viewport at most.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff
- background: #111111
- border: #ffffff (hairline, 1px)
- accent: #bc9873 (surface only, never text)
- muted border: #4f4f4f
- primary action: no distinct CTA color

Example Component Prompts:

1. **Hero Panel**: Full-bleed photograph filling the viewport. Overlay a serif wordmark in #ffffff at ~240px, centered, on top of the image. Position a 'CONTACT' label at 12px aktiv-web weight 400, #ffffff, uppercase, letter-spacing tracked, absolute top-center of the viewport with 20px top padding. Below the wordmark, add a 15px #ffffff caption in aktiv-web weight 400, centered, reading as quiet subtitle text.

2. **Editorial Statement Section**: Background #111111, full-width. Left-aligned headline at 74px aktiv-web weight 400, #ffffff, line-height 1.0, with 238px left margin. Below it, a 12px 'ABOUT US' link in #ffffff with 1px white underline, same 238px left margin. Section padding-top 99px, padding-bottom 99px.

3. **Full-Bleed Case Study**: Full-viewport photograph, 0px radius, edge-to-edge. Top-left corner: 12px uppercase tracked text in #ffffff reading as project name on line one and tagline on line two. No other overlay elements.

4. **Bronze Accent Band**: Full-width #bc9873 background, 0px radius, height ~60vh. No text, no images, no interactive elements — decorative warm surface that breaks the black sequence.

5. **Two-Line Stacked Heading**: 74px aktiv-web weight 400, #ffffff, line-height 1.0, left-aligned with 238px left gutter. Two short words stacked vertically, each on its own line (e.g., 'CASES' / 'STUDIES'). A 'VIEW ALL' underlined link at 12px positioned to the right of the second line.

## Similar Brands

- **Bureau Cool** — Same editorial-agency language — full-bleed photography, single oversized display type, near-zero UI chrome, black canvas as default
- **Locomotive** — Same fashion-editorial restraint — dark backgrounds, large quiet type at regular weight, underlined text links as the only affordance, photography bleeding to viewport edges
- **Hugues Cluzet portfolio sites (e.g., Breed)** — Same typographic bravery — weight 400 at 70+px, generous negative space, warm accent tones borrowed from photography, no cards or grids
- **Resn** — Same creative-agency-as-art-object positioning — full-viewport imagery, minimal nav (often a single word), type that breathes rather than fills

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #111111;
  --color-paper-white: #ffffff;
  --color-smoke: #4f4f4f;
  --color-bronze-veil: #bc9873;

  /* Typography — Font Families */
  --font-aktiv-web-custom-substitute-inter-tight-or-shne: 'aktiv-web (custom) / substitute: Inter Tight or Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-display-serif-not-captured-in-data-visible-in-hero-wordmark: 'Editorial display serif (not captured in data — visible in hero wordmark)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.5;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --text-heading: 54px;
  --leading-heading: 1.2;
  --text-display: 74px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-6: 6px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-59: 59px;
  --spacing-79: 79px;
  --spacing-119: 119px;
  --spacing-178: 178px;
  --spacing-238: 238px;

  /* Layout */
  --section-gap: 99px;
  --element-gap: 20-35px;

  /* Named Radii */
  --radius-cards: 0px (no cards);
  --radius-images: 0px (photography is edge-to-edge, never rounded);
  --radius-buttons: 0px (no buttons);

  /* Surfaces */
  --surface-ink-black-canvas: #111111;
  --surface-bronze-accent-band: #bc9873;
  --surface-photographic-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #111111;
  --color-paper-white: #ffffff;
  --color-smoke: #4f4f4f;
  --color-bronze-veil: #bc9873;

  /* Typography */
  --font-aktiv-web-custom-substitute-inter-tight-or-shne: 'aktiv-web (custom) / substitute: Inter Tight or Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-display-serif-not-captured-in-data-visible-in-hero-wordmark: 'Editorial display serif (not captured in data — visible in hero wordmark)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.5;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --text-heading: 54px;
  --leading-heading: 1.2;
  --text-display: 74px;
  --leading-display: 1;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-59: 59px;
  --spacing-79: 79px;
  --spacing-119: 119px;
  --spacing-178: 178px;
  --spacing-238: 238px;
}
```
