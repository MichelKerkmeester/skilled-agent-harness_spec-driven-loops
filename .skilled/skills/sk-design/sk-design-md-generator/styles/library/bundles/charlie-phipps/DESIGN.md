# Charlie Phipps — Style Reference
> oversized editorial gallery wall — a single massive Helvetica headline and one full-bleed photograph, nothing else

**Theme:** mixed

Charlie Phipps is a London graphic designer's portfolio rendered as an oversized editorial poster system: full-bleed photography as hero canvas, one monumental Helvetica Neue headline per screen, and near-total chromatic silence. The site reads like a printed zine blown up to wall scale — weight 400 at 162px is a deliberate anti-convention (no bold shout, just confident whisper-thin letters) paired with aggressive negative tracking that lets the headline crop the viewport. The base canvas is near-black (#101011) to make photographic color explosions land harder, but content sections flip to white with the same dramatic restraint. No buttons, no rounded corners, no shadows, no color tokens — interaction is implied by thin underlines and cursor states, and navigation is reduced to three thin links in a corner. Whitespace is the primary structural device, not cards or dividers.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Black | `#101011` | `--color-canvas-black` | Base page canvas beneath full-bleed photography and dark bands; primary text on light surfaces; link underlines in dark contexts |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text color on dark/photographic backgrounds; content section background; dominant border color (hairline rules and dividers across the layout) |
| Ink Black | `#000000` | `--color-ink-black` | Heading and body text on light surfaces; second structural border color — used wherever a slightly harder edge than #101011 is needed |
| Fog Gray | `#ededed` | `--color-fog-gray` | Subtle surface tint separating content blocks from white paper; soft borders on body text and cards where a pure white hairline would disappear |
| Smoke Gray | `#bab7b2` | `--color-smoke-gray` | Muted heading accent — used for secondary headings and borders where the hierarchy needs to recede below the primary type |
| Ash Gray | `#888888` | `--color-ash-gray` | Body text metadata, link underlines in light contexts, and mid-weight borders — the workhorse neutral for anything that should be seen but not foregrounded |
| Charcoal | `#262627` | `--color-charcoal` | Deepest secondary border and muted text on light sections — just one step lighter than canvas black, used to keep dark elements feeling part of the same family |
| Void | `#080809` | `--color-void` | Near-pure black for the darkest link borders and emphasis text — visually indistinguishable from #000000 but kept distinct in the scale for deepest emphasis |

## Tokens — Typography

### Helvetica Neue — The entire typographic system. Weight 400 at 162px is the signature move — most portfolios would use 700-900 for a hero this large; Phipps uses regular, letting the sheer size and aggressive negative tracking carry authority instead of stroke weight. LineHeight of 0.90 on the display size means the two-line hero actually visually interlocks. All other text (body, labels, navigation, links) is the same family at the same weight — there is no secondary typeface voice. · `--font-helvetica-neue`
- **Substitute:** Inter, Neue Haas Grotesk, Arial, or any neutral neo-grotesque — but the substitute must stay at weight 400 for the display; a 700 weight fallback will destroy the editorial feel
- **Weights:** 400 (regular only — no bold, no medium, no light)
- **Sizes:** 13px, 16px, 17px, 19px, 21px, 52px, 64px, 162px
- **Line height:** 0.90 (display) / 1.00 (large headings) / 1.20 (body)
- **Letter spacing:** -0.024em at 162px (≈-3.9px), -0.013em at 64px (≈-0.8px), -0.012em at 52px (≈-0.6px), -0.010em at 21px (≈-0.2px), -0.004em at 16-19px (≈-0.06 to -0.08px)
- **Role:** The entire typographic system. Weight 400 at 162px is the signature move — most portfolios would use 700-900 for a hero this large; Phipps uses regular, letting the sheer size and aggressive negative tracking carry authority instead of stroke weight. LineHeight of 0.90 on the display size means the two-line hero actually visually interlocks. All other text (body, labels, navigation, links) is the same family at the same weight — there is no secondary typeface voice.

### Times — Used only as 13px image captions or photo metadata — the serif appears as a deliberate editorial counterpoint to the Helvetica system, breaking the all-grotesque monotony at micro scale · `--font-times`
- **Substitute:** Times New Roman, any transitional serif (Lora, Source Serif)
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Used only as 13px image captions or photo metadata — the serif appears as a deliberate editorial counterpoint to the Helvetica system, breaking the all-grotesque monotony at micro scale

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body-sm | 16px | 1.2 | -0.06px | `--text-body-sm` |
| subheading | 19px | 1.2 | -0.08px | `--text-subheading` |
| heading-sm | 21px | 1.2 | -0.21px | `--text-heading-sm` |
| heading | 52px | 1 | -0.62px | `--text-heading` |
| heading-lg | 64px | 1 | -0.83px | `--text-heading-lg` |
| display | 162px | 0.9 | -3.89px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 13 | 13px | `--spacing-13` |
| 26 | 26px | `--spacing-26` |
| 41 | 41px | `--spacing-41` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 80px
- **Card padding:** 13px
- **Element gap:** 26px

## Components

### Full-Bleed Hero Photograph
**Role:** Opening screen background

Photograph fills 100vw × 100vh with no overlay, no darkening, no gradient. All UI elements float on top: navigation, display headline, description, scroll indicator. The image is the brand — no decorative gradient or vignette is added.

### Display Headline
**Role:** One-line statement over the hero

Helvetica Neue 162px / lineHeight 0.90 / weight 400 / letter-spacing -3.89px / color #ffffff. Extends beyond viewport edges intentionally — the crop is part of the composition. Single sentence, no period, present tense. Anchored top-left with no padding alignment — type sits on the page edge.

### Thin Top Navigation
**Role:** Persistent site chrome

Three text links in Helvetica Neue 13-16px / weight 400 at the top of every screen: brand name (left), section index (center), profile (right). No background, no border, no logo mark. Links use 1px underlines only on hover. When over a photograph, text is #ffffff; over white content sections, text is #101011.

### Section Label (EXPLORE / LATEST WORKS)
**Role:** Small-caps section identifier

Two-line stack: uppercase category label (e.g. "EXPLORE") + count in parentheses + secondary line (e.g. "Case Studies"). Helvetica Neue 16px / weight 400 / #000000. No bullet, no border, no background — just tight typography anchoring the left margin.

### Editorial Section Headline
**Role:** Large body-section opener

Helvetica Neue 52-64px / lineHeight 1.00 / weight 400 / letter-spacing -0.6 to -0.8px / #000000. Used in white content sections as the counterpoint to the display hero — same weight, same family, just smaller. Period at end of sentence is a signature punctuation choice.

### Body Description Block
**Role:** Centered contextual paragraph

Three to four lines of Helvetica Neue 19-21px / lineHeight 1.2 / weight 400 / #ffffff on dark or #000000 on light. Max-width 480-520px, centered horizontally on the screen. Generous 26px vertical rhythm between lines.

### Social Link Row
**Role:** Footer-level external links

Two or three inline text links in Helvetica Neue 16px / weight 400, separated by 26px horizontal gap. Each link is preceded by the platform name in the same size; the external arrow (↗) is the only affordance — no icon, no button, no underline by default. Sits flush-left at the page bottom.

### Scroll Indicator
**Role:** Single down-arrow cue at viewport bottom

A thin downward arrow glyph (↓) in Helvetica Neue 16px / weight 400 / #ffffff. Positioned absolute at bottom-left, no animation, no label. Disappears once the user scrolls past the hero.

### Project Card (case study tile)
**Role:** Image-first work sample in the project index

Full-bleed photograph at natural aspect ratio (currently appearing 4:3 or 16:9) with no padding, no border, no radius. Caption appears below in Times 13px / #000000 if used. Image is the only element — no card surface, no metadata overlay, no hover state other than cursor.

### Email Contact Link
**Role:** Bottom-right footer contact

Single text string (email address) in Helvetica Neue 16px / weight 400 / #ffffff on dark or #000000 on light. No envelope icon, no button chrome — just the address as a link.

## Do's and Don'ts

### Do
- Use Helvetica Neue at weight 400 exclusively for the entire interface — never introduce a bold, medium, or light variant; the single-weight system is the signature
- Set the display headline to 162px with lineHeight 0.90 and letter-spacing -3.89px; let the line break where it breaks and allow the viewport to crop the text
- Use the spacing scale of 6 / 13 / 26 / 41px only — no arbitrary in-between values, and reserve 41px for the largest section breaks
- Place full-bleed photography behind text without overlay gradients or darkening scrims — the image's own contrast must carry legibility, or shift the text position to a clean area of the photo
- Keep the color palette 100% achromatic — #101011 canvas, #ffffff text-on-photo, #000000 text-on-paper, and the gray scale for borders and metadata only
- Float navigation at the viewport edge in three positions (left / center / right) using 13-16px text — never box it, border it, or background it
- End editorial section headlines with a period ("Selected works ©2022.") — the declarative full stop is part of the typographic voice

### Don't
- Do not introduce any chromatic color — no brand reds, no accent blues, no button fills; the photograph is the only color source
- Do not add border-radius to any element — keep all corners at 0px; rounded corners would break the printed-poster logic
- Do not use box-shadows, drop-shadows, or any elevation effects — the design is flat against the photographic plane by intent
- Do not swap the display weight to 700 or 800 in any context — if a heading needs more weight, increase size instead; 400 at scale is the only authority the system allows
- Do not wrap text content in cards, panels, or bordered containers — sections are separated by whitespace alone, never by chrome
- Do not use icons for social links, email, or navigation — text plus the ↗ external arrow is the entire icon vocabulary
- Do not use uppercase tracking-wide labels for body copy — only the small section identifiers (EXPLORE, LATEST WORKS) use the stacked-label pattern

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#101011` | Dark base layer — visible only at the very top and as a thin nav strip; sets the stage for full-bleed photography |
| 1 | Photographic Surface | `#101011` | Full-bleed images sit on the dark canvas, making saturated colors (the red tube train, billboard art) read as the only chromatic event on screen |
| 2 | Paper | `#ffffff` | Content section background — flips the entire mood from cinematic to editorial, gives body type and case study imagery a clean reading surface |
| 3 | Tinted Card | `#ededed` | Subtle separation layer for metadata blocks, project tiles, or grouped secondary information on the white paper |

## Elevation

The design has zero elevation — no shadows, no borders-as-frames, no raised cards. Surface hierarchy is established entirely through photography bleed (full-bleed image = level 1) versus white paper (content surface = level 2) versus the dark canvas beneath everything (level 0). When a block needs to feel distinct, it is either given a photograph, given more whitespace, or shifted to white paper — never given a shadow or border treatment.

## Imagery

Photography is the primary brand asset and the only source of color in the entire system. The hero uses a single large environmental photograph (currently a London red Tube train beside a billboard collage) shot at street level with high contrast and saturated color — the kind of frame a designer would shoot on a phone while walking. The image is always full-bleed, always uncropped to a fixed ratio, and always allowed to bleed off all four edges of the viewport. Below the hero, project case studies are presented as additional full-bleed photographs in their native aspect ratios with no padding, no rounded corners, and no overlaid text. There are no illustrations, no 3D renders, no abstract graphics, no icon systems, no decorative shapes — the photographic frame IS the visual language.

## Layout

The page model alternates between two states: (1) a full-bleed dark photographic hero where type floats in a near-black space with no content boundaries, and (2) a white editorial content section where max-width 1400px text blocks sit on a clean paper field. Navigation is a persistent three-link text row at the top, no menu bar, no sidebar. The hero is asymmetric — headline anchored top-left cropping off the right edge, description block centered, nav distributed left/center/right, scroll indicator bottom-left, social links bottom-left, email bottom-right. Content sections are single-column with the section label (EXPLORE / Case Studies) as a left-margin anchor and a large headline + paragraph in the upper-left reading area, then large project photographs appearing further down as image-only tiles. The rhythm is: one massive statement, one breath of whitespace, one photograph, one sentence of caption. There are no card grids, no multi-column feature rows, no pricing tables — the layout is a vertical scroll of editorial spreads, each dominated by a single image and a single thought.

## Agent Prompt Guide

**Quick Color Reference**
- text (on white): #000000
- text (on photo/dark): #ffffff
- background (content sections): #ffffff
- background (canvas/beneath photo): #101011
- border / hairline: #ededed (light) or #000000 (emphasis)
- muted text: #888888
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Full-bleed photographic hero** — Start every page with a 100vw × 100vh photograph filling the viewport edge-to-edge. Place a Helvetica Neue 162px / weight 400 / lineHeight 0.90 / letter-spacing -3.89px headline in #ffffff, anchored top-left, allowed to crop off the right viewport edge. Add the brand name in 16px Helvetica Neue 400 at the top-left corner and two more nav links at top-center and top-right. No overlay, no gradient, no scrim — the photograph must be the entire background.

2. **Editorial content opener** — A white (#ffffff) content section, max-width 1400px centered. Left margin holds a stacked label: "EXPLORE" in 16px Helvetica Neue 400 #000000 on line one, "(04)" on line two, "Case Studies" on line three. To the right, a 52px Helvetica Neue 400 #000000 headline with lineHeight 1.00 and letter-spacing -0.62px, ending with a period. Below the headline, a paragraph at 21px / lineHeight 1.2 / #000000, max-width 520px.

3. **Project photograph tile** — A single full-bleed photograph at its native aspect ratio (target 4:3 or 16:9), 0px border-radius, no padding, no border, no shadow, no caption overlay. If a caption is needed, place a 13px Times 400 #000000 string directly below the image with 13px top margin. The image is the entire component — no card surface.

4. **Footer link row** — Three inline text links at 16px Helvetica Neue 400 in #ffffff, separated by 26px horizontal gap. Each link is just the platform or page name (e.g. "Instagram", "LinkedIn", "Email") with a thin ↗ arrow appended to external links. No icons, no underlines by default, no buttons. Positioned flush-left or flush-right at the viewport bottom edge with 26px page padding.

5. **Scroll indicator** — A single ↓ glyph in 16px Helvetica Neue 400 #ffffff, positioned absolute at bottom-left of the hero viewport. No animation, no label, no border. Disappears after the user scrolls past the first screen.

## Similar Brands

- **Manual (manual.co)** — Same single-weight Helvetica Neue at 400, oversized display headlines cropped at the viewport edge, and a near-total-achromatic palette where the only color comes from full-bleed product photography
- **Rauno Freiberg (raunofreiberg.com)** — Same flat editorial portfolio approach — no card surfaces, no rounded corners, no shadows, single-weight sans-serif at extreme sizes, and text floating directly over full-bleed imagery
- **Studio Bruch (studiobruch.com)** — Same printed-poster sensibility with 100% achromatic UI, dramatic 0px radii, and massive regular-weight type that uses size and tracking instead of bold weight to command attention
- **Pentagram (pentagram.com)** — Same London design-agency editorial restraint — generous whitespace as the primary structural device, single-weight type system, and photography treated as the only chromatic element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-black: #101011;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-fog-gray: #ededed;
  --color-smoke-gray: #bab7b2;
  --color-ash-gray: #888888;
  --color-charcoal: #262627;
  --color-void: #080809;

  /* Typography — Font Families */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.06px;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.08px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.21px;
  --text-heading: 52px;
  --leading-heading: 1;
  --tracking-heading: -0.62px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.83px;
  --text-display: 162px;
  --leading-display: 0.9;
  --tracking-display: -3.89px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-13: 13px;
  --spacing-26: 26px;
  --spacing-41: 41px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 80px;
  --card-padding: 13px;
  --element-gap: 26px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #101011;
  --surface-photographic-surface: #101011;
  --surface-paper: #ffffff;
  --surface-tinted-card: #ededed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-black: #101011;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-fog-gray: #ededed;
  --color-smoke-gray: #bab7b2;
  --color-ash-gray: #888888;
  --color-charcoal: #262627;
  --color-void: #080809;

  /* Typography */
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.06px;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.08px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.21px;
  --text-heading: 52px;
  --leading-heading: 1;
  --tracking-heading: -0.62px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.83px;
  --text-display: 162px;
  --leading-display: 0.9;
  --tracking-display: -3.89px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-13: 13px;
  --spacing-26: 26px;
  --spacing-41: 41px;
}
```
