# NCDA — Style Reference
> Architectural monograph in negative space. The NCDA wordmark at 62px is cropped by the viewport edge, turning a logo into a wall.

**Theme:** mixed

NCDA operates as a printed monograph translated to the web: paper-white canvas, a single near-black ink, zero chromatic noise, and type that does the structural work that color usually does. The signature move is the wordmark itself — rendered at architectural scale and cropped by the viewport edge, it turns the brand mark into a layout device rather than a logo. Navigation is reduced to essentials: a live dual-city clock in the corner, a single 'Menu' trigger, and a tight gray description block. The system alternates between vast white negative space and occasional full-bleed black bands, creating an exhibition-catalogue rhythm. Components are sparse and unornamented — no shadows, no rounded corners, no buttons — just hairline rules, generous margins, and type that whispers through tight negative tracking at display sizes and slightly positive tracking at caption sizes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Onyx | `#191919` | `--color-onyx` | Primary text, hairline borders, full-bleed dark surface bands — the near-black ink of the system |
| Pure Black | `#000000` | `--color-pure-black` | Secondary text fills, deepest borders, and image overlays where maximum contrast against white is required |
| Paper | `#ffffff` | `--color-paper` | Page canvas, surface backgrounds, inverse text on dark bands |
| Concrete | `#808080` | `--color-concrete` | Secondary descriptive text, muted link borders, subdued meta-information — the gray of footnotes and captions |

## Tokens — Typography

### TWK Everett — All interface and display type — a neo-grotesque with tall x-height and geometric openness. The sole weight (400) across the entire range from 11px captions to 62px display creates a monolithic typographic voice. At 62px it receives aggressive negative tracking (-0.05em) that pulls the letterforms into a continuous architectural band; at 11px it switches to slight positive tracking (+0.04em) for utilitarian legibility in timestamps and labels. · `--font-twk-everett`
- **Substitute:** Neue Haas Grotesk Display, Inter, Helvetica Neue
- **Weights:** 400
- **Sizes:** 11px, 15px, 21px, 32px, 62px
- **Line height:** 0.80–1.44
- **Letter spacing:** -0.05em at 62px, -0.01em at 21–32px, +0.04em at 11px
- **Role:** All interface and display type — a neo-grotesque with tall x-height and geometric openness. The sole weight (400) across the entire range from 11px captions to 62px display creates a monolithic typographic voice. At 62px it receives aggressive negative tracking (-0.05em) that pulls the letterforms into a continuous architectural band; at 11px it switches to slight positive tracking (+0.04em) for utilitarian legibility in timestamps and labels.

### TWK Everett Mono — Monospaced companion for data and technical annotations — used sparingly in body contexts where tabular alignment or code-like precision is needed. Single size at 21px with -0.01em tracking. · `--font-twk-everett-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 21px
- **Line height:** 0.80
- **Letter spacing:** -0.0100em
- **Role:** Monospaced companion for data and technical annotations — used sparingly in body contexts where tabular alignment or code-like precision is needed. Single size at 21px with -0.01em tracking.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.44 | 0.44px | `--text-caption` |
| body | 15px | 1.44 | -0.15px | `--text-body` |
| subheading | 21px | 1.4 | -0.21px | `--text-subheading` |
| heading | 32px | 1.35 | -0.32px | `--text-heading` |
| display | 62px | 0.8 | -3.1px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 26 | 26px | `--spacing-26` |
| 28 | 28px | `--spacing-28` |
| 53 | 53px | `--spacing-53` |
| 59 | 59px | `--spacing-59` |
| 64 | 64px | `--spacing-64` |
| 150 | 150px | `--spacing-150` |
| 188 | 188px | `--spacing-188` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 64-150px
- **Card padding:** 0px
- **Element gap:** 15px

## Components

### Architectural Wordmark Display
**Role:** Brand identity rendered as a full-width layout device

The 'NCDA' letterform set in TWK Everett Regular at 62px, line-height 0.80, letter-spacing -0.05em (#3.1px). The string is sized to overflow the viewport horizontally and is allowed to bleed off both edges — the crop is intentional. No margin, no padding, sits flush against the page boundaries. Color: #000000 on white, or #ffffff when placed on a #191919 band.

### Dual-City Live Clock
**Role:** Persistent header utility — time stamps in two zones

Two monospaced time displays in the top-left corner, formatted as 'HH:MM:SS CITY'. TWK Everett 11px, weight 400, letter-spacing +0.04em, color #000000. Separated by a horizontal gap of ~53px. The mono treatment and tabular spacing make the seconds tick without jitter.

### Menu Trigger
**Role:** Sole navigation element — top-right anchor

Plain text 'Menu' in TWK Everett 15px, weight 400, color #000000, no border, no background. Aligned flush to the right edge of the viewport. No icon, no chevron, no affordance decoration.

### Studio Description Block
**Role:** Identity statement on the landing canvas

Three-line paragraph set in TWK Everett 15px, line-height ~1.44, max-width approximately 400px. The studio name 'NC Design and Architecture Ltd.' is bolded or given a slight emphasis. Remainder in #808080 Concrete gray, with the brand name in #000000. Positioned in the upper-right quadrant, approximately 59px from the left edge of its column, creating a deliberate asymmetric counterweight to the cropped wordmark below.

### Full-Bleed Dark Band
**Role:** Section break / project image container

A 100vw × full-height band filled with #191919, no border, no radius, no shadow. Image or video content fills the band edge-to-edge. The transition from white to this band is abrupt — no gradient, no fade. Acts as a visual exhale between white pages.

### Hairline Rule Link
**Role:** Inline link or navigation divider

Text link in TWK Everett 15px, color #000000, with a 1px #808080 bottom border acting as underline. No hover state color change specified — the border is the link, not the text color.

### Time-Indexed Label
**Role:** Metadata / project reference tag

Small caption text at 11px in #808080, letter-spacing +0.04em, used for project numbers, dates, or category labels. No background, no border, no badge shape — just spaced gray type.

## Do's and Don'ts

### Do
- Use TWK Everett Regular (400) at every size from 11px to 62px — never introduce bold or medium weights, the single-weight system is the signature
- Set the wordmark or any display text at 62px with -0.05em letter-spacing and line-height 0.80 to create the continuous architectural band effect
- Apply +0.04em letter-spacing to all text at 11px and below — the positive tracking is what makes captions read as technical annotations rather than body type
- Crop type and imagery at the viewport edge — the bleed is structural, never add padding to prevent it
- Use #191919 Onyx for all borders and dark surface bands; reserve #000000 Pure Black for text fills where maximum contrast is critical
- Separate content sections with full-bleed #191919 bands — no gradients, no soft transitions between white and dark
- Keep interactive elements text-only — no buttons, no icons, no filled rectangles; use 1px #808080 hairline rules to indicate links

### Don't
- Do not introduce any chromatic color — the system is 0% colorfulness by design, any hue breaks the monograph language
- Do not add border-radius to any element — all corners are sharp 0px, rounded shapes would undermine the architectural print language
- Do not use drop shadows or elevation effects — depth comes from scale and negative space, not from shadow stacks
- Do not set body or paragraph type at 62px — that size is reserved for the wordmark and display headlines that function as layout architecture
- Do not use more than two type sizes on a single screen — the system relies on extreme size contrast (15px body vs 62px display), intermediate sizes dilute the rhythm
- Do not add icons, arrows, or decorative glyphs to the Menu trigger or any navigation — the plain text label is the entire affordance
- Do not center-align body text — left-align everything; centering is reserved for the wordmark, everything else hangs from a left edge

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary canvas — the page itself |
| 1 | Onyx Black | `#191919` | Full-bleed dark bands for project showcases and section breaks — image or video containers, not decorative |

## Elevation

The system intentionally avoids all shadow and elevation effects. Depth and hierarchy are achieved exclusively through scale contrast (62px display against 15px body), color inversion (white pages alternating with #191919 bands), and negative space. No box-shadows, no blurs, no z-axis layering. The only 'elevation' is the literal dark band that interrupts the white page sequence.

## Imagery

The visual language is type-first and textural rather than photographic. The hero is pure typography — no image, no illustration, no decorative element. The dark band functions as a container for project photography or video, but the photography itself is not visible in the provided frames. The expected treatment, based on the architectural-studio genre and the monochrome system, is high-contrast interior photography: sharp geometric compositions of spaces, materials, and light, presented uncropped and full-bleed within the #191919 bands. No illustrations, no abstract graphics, no icons visible in the interface. The wordmark itself is the primary visual asset.

## Layout

Full-bleed page with no max-width container. The hero section is an asymmetric composition: the studio description block sits in the upper-right quadrant (approximately 59px from its left edge, aligned to roughly the 45% mark horizontally), while the cropped 'NCDA' wordmark dominates the lower 60% of the viewport, bleeding off the left and right edges. The top edge holds a thin utility row: dual-city clock at top-left, Menu trigger at top-right, with vast white space between. Section rhythm alternates between white canvas pages and full-bleed #191919 dark bands — each band likely a project showcase or image set. Content within white pages is left-aligned and column-based rather than centered. Navigation is minimal: a single Menu trigger, no visible nav bar, no breadcrumbs, no footer structure visible in the frames.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (primary), #808080 (secondary), #ffffff (inverse on dark)
- background: #ffffff (canvas), #191919 (dark band)
- border: #191919 (structural), #808080 (hairline/link)
- accent: none — system is 0% chromatic
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build the landing hero: white #ffffff canvas. Top-left: two monospaced timestamps '09:58:21 HK' and '21:58:21 NYC' in TWK Everett 11px, weight 400, letter-spacing +0.04em (0.44px), color #000000, separated by 53px gap. Top-right: 'Menu' in TWK Everett 15px, weight 400, #000000, flush right. Upper-right quadrant: description block ~400px wide, 'NC Design and Architecture Ltd.' in #000000, remainder in #808080, TWK Everett 15px, line-height 1.44, 59px left padding. Lower 60%: 'NCDA' in TWK Everett 62px, line-height 0.80, letter-spacing -3.1px (-0.05em), #000000, sized to overflow viewport horizontally and crop on both edges.

2. Build a project section band: full-viewport-width rectangle, background #191919, height 100vh, no border, no radius, no shadow. Image inside fills the band edge-to-edge with no padding or margin.

3. Build a time-indexed label: plain text in TWK Everett 11px, weight 400, color #808080, letter-spacing +0.04em, no background, no border, no badge shape — just spaced gray type inline with content.

## Typographic Signature

The single-weight (400 only) typographic system across a 5x size range is unusual and intentional. Most design systems use multiple weights to create hierarchy; NCDA uses scale alone. The result is a voice that never shouts — even the 62px display reads as calm authority rather than visual impact. The negative tracking at display sizes (-0.05em) tightens the wordmark into a near-continuous stroke, and the positive tracking at caption sizes (+0.04em) makes metadata feel technical and annotated. This dual-tracking polarity is a signature that should never be flattened to 'normal' letter-spacing.

## Similar Brands

- **Vitra** — Same architectural-monograph language: vast white space, monochrome type-driven layouts, full-bleed dark image bands, zero decorative color
- **M/M Paris** — Extreme typographic scale, cropped wordmarks, and gallery-catalogue negative space applied to a creative studio site
- **Pentagram** — Editorial minimalism with a single weight type system, hairline rules, and a full-bleed image grid that breaks white pages
- **Dieter Rams archive sites** — Swiss-design influence: sharp corners, no shadows, single-weight neo-grotesque type, and information density through spacing rather than decoration
- **Schiattarella Associati** — Architecture studio sites that lead with a massive cropped wordmark at display scale and let project photography carry the dark bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-onyx: #191919;
  --color-pure-black: #000000;
  --color-paper: #ffffff;
  --color-concrete: #808080;

  /* Typography — Font Families */
  --font-twk-everett: 'TWK Everett', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twk-everett-mono: 'TWK Everett Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.44;
  --tracking-caption: 0.44px;
  --text-body: 15px;
  --leading-body: 1.44;
  --tracking-body: -0.15px;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.21px;
  --text-heading: 32px;
  --leading-heading: 1.35;
  --tracking-heading: -0.32px;
  --text-display: 62px;
  --leading-display: 0.8;
  --tracking-display: -3.1px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-53: 53px;
  --spacing-59: 59px;
  --spacing-64: 64px;
  --spacing-150: 150px;
  --spacing-188: 188px;

  /* Layout */
  --section-gap: 64-150px;
  --card-padding: 0px;
  --element-gap: 15px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-onyx-black: #191919;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-onyx: #191919;
  --color-pure-black: #000000;
  --color-paper: #ffffff;
  --color-concrete: #808080;

  /* Typography */
  --font-twk-everett: 'TWK Everett', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twk-everett-mono: 'TWK Everett Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.44;
  --tracking-caption: 0.44px;
  --text-body: 15px;
  --leading-body: 1.44;
  --tracking-body: -0.15px;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.21px;
  --text-heading: 32px;
  --leading-heading: 1.35;
  --tracking-heading: -0.32px;
  --text-display: 62px;
  --leading-display: 0.8;
  --tracking-display: -3.1px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-53: 53px;
  --spacing-59: 59px;
  --spacing-64: 64px;
  --spacing-150: 150px;
  --spacing-188: 188px;
}
```
