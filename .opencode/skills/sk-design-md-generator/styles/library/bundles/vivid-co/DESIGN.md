# Vivid+Co — Style Reference
> prismatic light through obsidian

**Theme:** dark

Vivid+Co operates in a cinematic dark void: near-black canvas at #101010–#495764, punctuated by a single near-white off-white (#fffdf9) used for nearly all type and UI chrome. Typography is overwhelmingly Neue Montreal weight 400 — a deliberate refusal of bold, where authority comes from sheer scale (136px and 105px display) rather than weight. The signature device is the chromatic-prism hero rendering: RGB-split blocks of saturated red/green/blue light bleeding through glass cubes, breaking an otherwise monochrome surface. Layout is centered and roomy; nav, body, and links all wear the same #fffdf9 color with no separate accent button, no fills, and zero shadows — differentiation happens through spacing, scale, and the rainbow artifact that acts as the brand's only chromatic voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#fffdf9` | `--color-bone-white` | Primary text, nav labels, link color, heading fill — the near-white that occupies every typographic surface across the dark canvas |
| Obsidian | `#101010` | `--color-obsidian` | Page canvas, background fill for hero and section bands — the deep black the prism artifact sits inside |
| Graphite Veil | `#495764` | `--color-graphite-veil` | Dominant surface behind headings and content blocks — a cool dark slate that gives the canvas depth without flat black |
| Ash Border | `#403f3f` | `--color-ash-border` | Hairline divider and card outline — barely visible, used at 1px to separate rows without competing with type |
| Fog Blue | `#6f879c` | `--color-fog-blue` | Muted secondary text and ghost-button labels (3.7:1 contrast) — service-category labels like Strategy, Creative, Communications + marketing read as de-emphasized metadata |
| Pure Black | `#000000` | `--color-pure-black` | Decorative SVG icon and illustration fill — used in the prism artwork and icon glyphs; not a background |
| Prism Red | `#ff2a2a` | `--color-prism-red` | Chromatic dispersion accent — one channel of the RGB-split prism hero artifact; appears only inside the brand illustration, not as a UI token |
| Prism Cyan | `#2a7fff` | `--color-prism-cyan` | Chromatic dispersion accent — blue channel of the RGB-split prism, paired with red and green to create the signature caustics effect |
| Prism Lime | `#2aff2a` | `--color-prism-lime` | Chromatic dispersion accent — green channel of the RGB-split prism artifact |

## Tokens — Typography

### Neue Montreal — Exclusive typeface across all UI — heading, body, nav, button, link, footer. Weight 400 is the default; weight 700 is reserved for 36px subheadings only. Display headlines at 105px and 136px carry line-height 1.00–1.01 with -0.02em tracking, producing cinematic stacked headlines that read as sculptural rather than typographic. · `--font-neue-montreal`
- **Substitute:** Söhne, Inter, General Sans
- **Weights:** 400, 700
- **Sizes:** 14, 15, 17, 18, 20, 21, 22, 32, 33, 36, 56, 105, 136
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.02em at 136px display, -0.01em at 33–56px headings, +0.01em at 15–21px body, +0.02em at 17px uppercase labels
- **OpenType features:** `"ss01" on`
- **Role:** Exclusive typeface across all UI — heading, body, nav, button, link, footer. Weight 400 is the default; weight 700 is reserved for 36px subheadings only. Display headlines at 105px and 136px carry line-height 1.00–1.01 with -0.02em tracking, producing cinematic stacked headlines that read as sculptural rather than typographic.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 15px | 1.2 | 0.15px | `--text-caption` |
| body-sm | 18px | 1.5 | — | `--text-body-sm` |
| body | 20px | 1.2 | -0.2px | `--text-body` |
| body-lg | 22px | 1.2 | -0.22px | `--text-body-lg` |
| heading-sm | 33px | 1.2 | -0.33px | `--text-heading-sm` |
| heading | 36px | 1.5 | — | `--text-heading` |
| heading-lg | 56px | 1.13 | -0.56px | `--text-heading-lg` |
| display-sm | 105px | 1.01 | -2.1px | `--text-display-sm` |
| display | 136px | 1 | -2.72px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 108 | 108px | `--spacing-108` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 5px |
| tags | 9999px |
| cards | 15px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 108px
- **Card padding:** 20px
- **Element gap:** 7px

## Components

### Ghost Nav Button
**Role:** Primary navigation item (EXPERTISE, WORK, TEAM, CAREERS)

Transparent fill, #fffdf9 text, 0px radius, no padding, uppercase Neue Montreal 14–15px. No underline, no border — letterforms alone carry identification.

### Outlined Contact Button
**Role:** Sole outlined call-to-action in the nav

Transparent fill, 1px solid #fffdf9 border, 5px radius, padding 9px 15px, uppercase 14px #fffdf9 text. The only bordered element in the header.

### Ghost Service Label
**Role:** Service-category metadata (Strategy, Creative, Communications + marketing)

Transparent fill, #6f879c text, 0px radius, 20px padding-top, 30px padding-bottom, 20px Neue Montreal. Reads as de-emphasized taxonomy — sits below case-study titles.

### Display Headline Block
**Role:** Hero statement (We are Storytellers..., Putting the pieces together...)

Neue Montreal weight 400 at 105–136px, line-height 1.00, letter-spacing -0.02em, color #fffdf9. Stacks across multiple lines; occupies 50–60% of viewport height. No font-weight override — scale alone creates hierarchy.

### Hero Lead Paragraph
**Role:** Subtitle below display headline

Neue Montreal 400 at 18–22px, line-height 1.5, #fffdf9, max-width ~440px. Aligns left beneath the prism artifact, never full-width.

### Prism Artifact
**Role:** Signature brand illustration — glass-cube array with RGB-split caustics

Four to six glass cubes arranged in a staggered cluster, rendered with #000000 cores, #fffdf9 specular highlights, and red/cyan/green channel-offset edges that bleed saturated color. No shadow — the chromatic dispersion is the visual depth.

### Section Heading
**Role:** In-section statement (Building brand value is our singular mission.)

Neue Montreal 400 at 18–22px, #fffdf9, max-width ~440px, left-aligned above the larger display headline that follows.

### Footer Hairline Divider
**Role:** 1px separator above footer copy

1px solid #403f3f line, full-width, 15px margin-top. The only border-color token used in the system.

### Case Study Title Link
**Role:** Project/work listing headline

Neue Montreal 400 at 33px, #fffdf9, letter-spacing -0.01em, line-height 1.2. Hover state likely color-shifts to #6f879c — no underline, no background change.

### Eyebrow Label
**Role:** Section opener or category tag (uppercase)

Neue Montreal 400 at 32px or 17px, uppercase, line-height 1.01–1.5, letter-spacing +0.02em at 17px. All-caps treatment without weight 700 — restraint over shouting.

### Rounded Pill Tag
**Role:** Sole radius-9999px element — possibly a status indicator or metadata chip

9999px border-radius, 15px radius also appears for card corners. Used sparingly; most of the UI is square-edged.

## Do's and Don'ts

### Do
- Use #fffdf9 for all text and interactive elements on the dark canvas — never introduce a second text color unless it is #6f879c for de-emphasized metadata.
- Let scale carry hierarchy: pair 136px display with 18px body at a 7.5× ratio rather than bolding the body to compensate.
- Hold Neue Montreal weight 400 as the default; reserve weight 700 exclusively for 36px subheadings.
- Set display headlines at line-height 1.00–1.01 and -0.02em letter-spacing so multi-line stacks feel sculptural.
- Use 0px border-radius for buttons and most cards — the prism artwork supplies all the visual softness the system needs.
- Center hero compositions vertically and horizontally, leaving ~50% viewport height for the headline block.
- Apply the prism artifact at full scale as the only chromatic element; never dilute it with accent buttons or colored badges.

### Don't
- Don't introduce filled buttons, gradients, or saturated action colors — the system has no distinct primary action color and the nav's outlined Contact button is the only bordered UI element.
- Don't use weight 600–800 for headlines; authority comes from size (105–136px), not stroke weight.
- Don't apply box-shadows to cards or nav — depth comes from the Prism artifact and the slate-to-black canvas gradient.
- Don't add line-heights above 1.5 to display sizes; the tight 1.00–1.01 leading at 136px is a signature.
- Don't use letter-spacing looser than -0.01em on any size above 22px — the tracking is intentionally tight.
- Don't split the prism colors into separate UI tokens — RGB red/cyan/green only exist inside the artifact.
- Don't lighten the canvas past #495764 or the slate-to-black contrast that makes #fffdf9 type read will collapse.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#101010` | Deepest page background — hero void, full-bleed sections |
| 1 | Graphite Veil | `#495764` | Primary content surface — content bands sit on this slightly lighter slate |
| 2 | Bone Card | `#fffdf9` | Rare inverted cards (when used) — near-white surface that flips the type to dark |

## Elevation

Flat by design. The system uses zero box-shadows — depth is implied solely through the contrast between #101010, #495764, and the Prism artifact's chromatic edges. Borders are 1px solid at #403f3f and only used for the Contact button and footer divider. Elevation is non-existent because the prism artwork is the only element that needs to feel three-dimensional.

## Imagery

Single hero artifact dominates: an abstract 3D rendering of glass cubes with RGB-split chromatic aberration edges. No photography, no human imagery, no product shots. The prism IS the brand image — everything else is monochrome typography on dark canvas. Iconography is minimal: thin-line navigation labels and a small cursor/glyph accent (area 142765) at the end of one headline suggest a single 16px monoline icon. No illustrations, no decorative patterns, no textures.

## Layout

Full-bleed dark canvas with a single max-width ~1440px content column. Hero pattern: centered prism artifact with overlapping headline (text crosses the cubes) and left-aligned subtitle beneath. Navigation sits in a thin top bar with the wordmark left, four ghost links right, and an outlined Contact button terminating the row. Section rhythm alternates between full-viewport-height hero panels and narrower content bands at ~108px gaps. Content arrangement is asymmetric: the prism artifact anchors the visual center while headlines wrap around it. Single-column text blocks max out around 440px width; no multi-column grids, no card matrices, no pricing tables. Footer is a thin hairline-divided band with two columns of metadata.

## Agent Prompt Guide

Quick Color Reference:
- text: #fffdf9
- background: #101010 (canvas) / #495764 (surface)
- border: #403f3f (hairline) / #fffdf9 (button only)
- muted text: #6f879c
- accent: #ff2a2a / #2a7fff / #2aff2a (prism only — never on UI)
- primary action: no distinct CTA color

Example Component Prompts:
1. Hero section: #101010 canvas filling viewport. Prism artifact (4–6 glass cubes with #000000 cores and RGB-split #ff2a2a/#2a7fff/#2aff2a edges) centered at ~40% width. Headline 'We are Storytellers Strat egists Crea tives Market ers Tech nologists' at 136px Neue Montreal weight 400, #fffdf9, line-height 1.00, letter-spacing -2.72px, wrapping across the cubes. Subtitle at 22px weight 400 #fffdf9, max-width 440px, left-aligned below.
2. Ghost navigation button: transparent fill, #fffdf9 text, uppercase Neue Montreal 14px, 0px radius, 0px padding. Hover transitions color only via 0.5s cubic-bezier(0.52,0.01,0,1).
3. Outlined Contact button: transparent fill, 1px solid #fffdf9 border, 5px radius, 9px 15px padding, uppercase 14px #fffdf9 text. Only bordered element in the header.
4. Case-study title link: Neue Montreal 400 at 33px, #fffdf9, letter-spacing -0.33px, line-height 1.2, no underline. Below it a Fog Blue (#6f879c) service label at 20px with 20px padding-top and 30px padding-bottom.
5. Footer divider: 1px solid #403f3f line, full-width, 15px margin-top. Footer metadata at 14–18px #fffdf9 in a two-column row.

## Motion Philosophy

Expressive but restrained. Default duration 0.5s with ease for most transitions, but the signature curve cubic-bezier(0.52, 0.01, 0, 1) (150 occurrences) drives all meaningful state changes — a slow start and decisive stop, like optical focus pulling. Transform and opacity carry 90% of transitions; border-color and color handle the remaining 10%. One named animation kVfqLU runs at 6.65s — likely the prism artifact's slow chromatic shimmer. Avoid springs, bounces, or scale-pop effects; the system's confidence reads through stillness, not motion.

## Similar Brands

- **Giant Ant** — Same monochrome-dark-canvas agency treatment with oversized weight-400 display type and zero filled buttons
- **Resn** — Both rely on a single signature 3D artifact as the brand image and pair it with near-white type on near-black canvas
- **Active Theory** — Dark-mode creative-agency homepage with chromatic-aberration glass rendering and minimal nav
- **Ueno** — Single-typeface agency site at 400 weight, cinematic dark canvas, and restraint as a design philosophy
- **Locomotive** — Dark creative agency with oversized display headlines, no filled CTAs, and an outlined contact button as the only bordered element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #fffdf9;
  --color-obsidian: #101010;
  --color-graphite-veil: #495764;
  --color-ash-border: #403f3f;
  --color-fog-blue: #6f879c;
  --color-pure-black: #000000;
  --color-prism-red: #ff2a2a;
  --color-prism-cyan: #2a7fff;
  --color-prism-lime: #2aff2a;

  /* Typography — Font Families */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.2;
  --tracking-caption: 0.15px;
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 1.2;
  --tracking-body: -0.2px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.22px;
  --text-heading-sm: 33px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.33px;
  --text-heading: 36px;
  --leading-heading: 1.5;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.56px;
  --text-display-sm: 105px;
  --leading-display-sm: 1.01;
  --tracking-display-sm: -2.1px;
  --text-display: 136px;
  --leading-display: 1;
  --tracking-display: -2.72px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-108: 108px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 108px;
  --card-padding: 20px;
  --element-gap: 7px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 15px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 5px;
  --radius-tags: 9999px;
  --radius-cards: 15px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-obsidian-canvas: #101010;
  --surface-graphite-veil: #495764;
  --surface-bone-card: #fffdf9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #fffdf9;
  --color-obsidian: #101010;
  --color-graphite-veil: #495764;
  --color-ash-border: #403f3f;
  --color-fog-blue: #6f879c;
  --color-pure-black: #000000;
  --color-prism-red: #ff2a2a;
  --color-prism-cyan: #2a7fff;
  --color-prism-lime: #2aff2a;

  /* Typography */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 15px;
  --leading-caption: 1.2;
  --tracking-caption: 0.15px;
  --text-body-sm: 18px;
  --leading-body-sm: 1.5;
  --text-body: 20px;
  --leading-body: 1.2;
  --tracking-body: -0.2px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.22px;
  --text-heading-sm: 33px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.33px;
  --text-heading: 36px;
  --leading-heading: 1.5;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.56px;
  --text-display-sm: 105px;
  --leading-display-sm: 1.01;
  --tracking-display-sm: -2.1px;
  --text-display: 136px;
  --leading-display: 1;
  --tracking-display: -2.72px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-108: 108px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 15px;
  --radius-full: 9999px;
}
```
