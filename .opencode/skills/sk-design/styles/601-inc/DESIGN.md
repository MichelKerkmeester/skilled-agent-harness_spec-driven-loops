# 601 Inc. — Style Reference
> warm film marquee in darkness

**Theme:** dark

601 is a Tokyo film studio whose visual system reduces the web to the ingredients of cinema itself: a near-black void, one warm cream tone pulled from aged celluloid, and a single custom typeface rendered at architectural scale. The entire palette is functional — cream for everything that addresses the viewer, black for the screen behind it — which forces every compositional decision to be about scale, photography, and silence rather than chrome or ornament. Borders are 1px hairlines, elevation is absent, and the only structure is the photograph itself and the oversized numerals that float beside it like a screening schedule. Every page behaves like a single reel unspooling: a wordmark, a date, a still, and room to breathe.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Celluloid Cream | `#ece4b4` | `--color-celluloid-cream` | Primary text, all icon strokes, 1px hairline borders, and the only outlined-link action border in the system — a warm off-white that reads as aged film stock against black |
| Darkroom Shadow | `#4f4d3c` | `--color-darkroom-shadow` | Atmospheric mid-surface visible around and between film stills — a desaturated warm olive-black that softens the page from pure void into projection-room dimness |
| Projection Black | `#000000` | `--color-projection-black` | Deep canvas void used for the darkest recesses of the page and behind embedded media; the floor beneath everything |

## Tokens — Typography

### changeling-neo — Sole typeface — used for both the smallest nav label and the 280px display numerals. Weight 400 across every role is a deliberate anti-convention: no bold ever appears, so hierarchy is built purely through scale and tracking. The very tight -4% letter-spacing at 230-280px is what makes the giant wordmark feel carved rather than typeset. · `--font-changeling-neo`
- **Substitute:** Space Grotesk (Google Fonts) at the same tight tracking — closest free match for the geometric humanist geometry; Manrope is a secondary fallback
- **Weights:** 400
- **Sizes:** 42px, 230px, 280px
- **Line height:** normal
- **Letter spacing:** -0.0400em at all sizes
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Sole typeface — used for both the smallest nav label and the 280px display numerals. Weight 400 across every role is a deliberate anti-convention: no bold ever appears, so hierarchy is built purely through scale and tracking. The very tight -4% letter-spacing at 230-280px is what makes the giant wordmark feel carved rather than typeset.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 42px | 1.3 | — | `--text-caption` |
| body-sm | 230px | 1.3 | — | `--text-body-sm` |
| body | 280px | 1.3 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 9 | 9px | `--spacing-9` |
| 12 | 12px | `--spacing-12` |
| 21 | 21px | `--spacing-21` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| ui | 12px |
| nav | 0px |
| images | 0px |

### Layout

- **Section gap:** 120px
- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Wordmark "601"
**Role:** Primary brand identity rendered as a single oversized lockup

changeling-neo weight 400 at 230-280px, Celluloid Cream, letter-spacing -0.04em. Sits top-left, anchored to the page edge with no padding. The only moment on the site that large numbers are used as logo; no symbol or icon accompanies it.

### Floating Date Numeral
**Role:** Editorial display element marking screenings or releases

changeling-neo weight 400 at 280px, Celluloid Cream, letter-spacing -0.04em. Positioned mid-canvas with absolute coordinates so it floats in the negative space beside a film still rather than reading as a label. Acts as typographic wallpaper.

### Top Navigation Bar
**Role:** Minimal site chrome

Right-aligned, changeling-neo weight 400 at 42px, Celluloid Cream, with 21px horizontal padding and bullet glyphs (•) as separators between items. No background, no border, no hover treatment beyond opacity shift. ABOUT • ARCHIVE is the entire structure.

### Outlined Link
**Role:** The system's only interactive element pattern

1px solid Celluloid Cream border, changeling-neo 42px Celluloid Cream text, 12px vertical / 21px horizontal padding, no background fill, 0px radius. The 1px border is the button — there is no fill state, no shadow, no filled variant. Used for EXPLORE and similar editorial actions.

### Film Still Frame
**Role:** Primary content surface carrying all chromatic information

Full-bleed photograph with no container chrome — no border, no padding, no radius, no shadow. The image touches the page edges. Caption (if present) sits below in changeling-neo 42px Celluloid Cream with 28px bottom padding. The still is the card.

### Email Footer Label
**Role:** Contact affordance, bottom-left

changeling-neo 42px Celluloid Cream, no border, no background. A bare text link — the design commits to cream-on-black legibility at 42px so no underline or weight change is needed.

### Scroll Indicator
**Role:** Subtle scroll cue, right edge

A single cream dot or short 1px line in Celluloid Cream, positioned at the right viewport margin near the bottom. Minimal to the point of being ambient — discoverable but never demanding.

### Hairline Divider
**Role:** Structural separator between sections

1px solid Celluloid Cream, full-width or constrained to content width. This is the only structural element on the site — there are no backgrounds behind cards, no shaded sections, no panels. Sections divide by 120px gap plus optional 1px rule.

## Do's and Don'ts

### Do
- Use only #ece4b4 and the two blacks; introducing a third color breaks the celluloid projection logic
- Set changeling-neo to exactly 230px or 280px for any branded moment — the giant scale is the brand
- Keep all borders at exactly 1px solid Celluloid Cream — never thicker, never with a fill behind them
- Render images full-bleed with 0px padding, 0px radius, and no frame; the photograph meets the viewport edge
- Separate nav and footer items with the bullet glyph (•) and 21px horizontal padding, not with dividers or spacing alone
- Use the 12px radius token only for incidental UI elements (a small chip, a notification), never for the primary content surface
- Anchor all text to viewport edges — left or right — never center within a constrained column

### Don't
- Do not add drop shadows, glows, blurs, or any other elevation effect
- Do not introduce a second typeface; the system is one font, one weight, three sizes
- Do not use a filled button — the only action pattern is the 1px outlined link
- Do not constrain the layout to a max-width; full-bleed is required to preserve the cinematic frame
- Do not use a color of any kind on UI elements — all color must come from photography
- Do not set body or paragraph text below 42px; if it is not a label or a display moment, it does not belong on this site
- Do not apply gradient fills, noise textures, or film-grain overlays to UI surfaces; the only grain in the system is in the photography

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Projection Black | `#000000` | Deepest canvas — embedded media backgrounds and absolute void |
| 2 | Darkroom Shadow | `#4f4d3c` | Primary page background — warm-tinted near-black that prevents the page from reading as a flat #000 UI and instead as a dimly lit room |

## Elevation

No shadows. Depth is created entirely by three forces: the cream/black contrast boundary (1px border lines that act as the only edge definition), the scale difference between 42px labels and 280px display type, and the full-bleed photograph itself which breaks the dark plane. Adding any drop shadow, glow, or blur would shatter the projection-room stillness the system is built around.

## Imagery

Cinematic film stills, full-bleed, shot on location or in studio with controlled lighting. The example shows a wide group portrait in a desaturated blue environment — the photography is the only place saturated color appears in the entire design system, and it is always a single still per screen rather than a collage or grid. No illustration, no iconography beyond stroke-only marks, no decorative graphics. Captures are wide, production-quality, and the subject is always people or architecture in defined space — never abstract.

## Layout

Full-bleed, no max-width container, no centered column. The page is a vertical scroll through a single dark projection room. Top band carries the wordmark left, minimal nav right, and one small contextual line of cream text. Subsequent bands alternate between oversized type (wordmark, date numerals) and full-bleed film stills, separated by 120px gaps and the occasional 1px hairline. Text is anchored to viewport edges, not to a content column. No card grids, no feature rows, no pricing tables — this is a portfolio, not a product surface. Navigation is a fixed thin top bar, nothing else is sticky.

## Agent Prompt Guide

## Quick Color Reference

- text: #ece4b4 (Celluloid Cream)
- background: #4f4d3c (Darkroom Shadow, dominant page) / #000000 (deep void)
- border: 1px solid #ece4b4 (the only border treatment)
- accent: #ece4b4 (same as text — the system has no separate accent)
- primary action: #ece4b4 (outlined action border)

## 3-5 Example Component Prompts

1. **Outlined Link Button**: Render a 1px solid #ece4b4 border, 12px vertical padding, 21px horizontal padding, 0px radius. Text: changeling-neo weight 400, 42px, color #ece4b4, letter-spacing -1.68px. No background fill in any state. Place against a #4f4d3c canvas.

2. **Display Date Numeral**: Set a date string (e.g. "2/6") in changeling-neo weight 400, 280px, color #ece4b4, letter-spacing -11.2px, line-height normal. Position absolutely at roughly 60% across and 30% down the viewport, floating in negative space beside a film still.

3. **Top Navigation Bar**: Right-align a row of links at the top of the viewport, changeling-neo weight 400, 42px, color #ece4b4, letter-spacing -1.68px, 21px horizontal padding per item, separated by the bullet glyph (•) in #ece4b4. No background, no border, no sticky behavior unless specified.

4. **Film Still Section**: Place a single full-bleed photographic still at 100vw width, preserving native aspect ratio. No border, no padding, no radius, no shadow. Optional caption 28px below the image in changeling-neo 42px #ece4b4.

5. **Wordmark Lockup**: Render "601" top-left in changeling-neo weight 400, 230px, color #ece4b4, letter-spacing -9.2px, anchored to the top-left viewport edge with no margin beyond design intent.

## Similar Brands

- **A24 Films** — Same single-tone cream-on-black aesthetic with full-bleed stills and oversized type — both sites treat the web as a screening room rather than a product page
- **Mansour Martin** — Editorial film/photography studio site with the same dark canvas, warm accent, and the discipline of letting one photograph carry a whole screen
- **Acne Studios** — Same commitment to a single warm neutral on black with minimal chrome and oversized custom type as the primary brand element
- **Bureau Cool** — Portfolio-grade agency site where photography is full-bleed and the only structure is type at extreme scale against a dark ground
- **Playdate Studio** — Creative studio identity built on near-monochrome dark palette with a single warm accent and typography doing all the compositional work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-celluloid-cream: #ece4b4;
  --color-darkroom-shadow: #4f4d3c;
  --color-projection-black: #000000;

  /* Typography — Font Families */
  --font-changeling-neo: 'changeling-neo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 42px;
  --leading-caption: 1.3;
  --text-body-sm: 230px;
  --leading-body-sm: 1.3;
  --text-body: 280px;
  --leading-body: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-9: 9px;
  --spacing-12: 12px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 120px;
  --card-padding: 0px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-xl: 11.9952px;

  /* Named Radii */
  --radius-ui: 12px;
  --radius-nav: 0px;
  --radius-images: 0px;

  /* Surfaces */
  --surface-projection-black: #000000;
  --surface-darkroom-shadow: #4f4d3c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-celluloid-cream: #ece4b4;
  --color-darkroom-shadow: #4f4d3c;
  --color-projection-black: #000000;

  /* Typography */
  --font-changeling-neo: 'changeling-neo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 42px;
  --leading-caption: 1.3;
  --text-body-sm: 230px;
  --leading-body-sm: 1.3;
  --text-body: 280px;
  --leading-body: 1.3;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-9: 9px;
  --spacing-12: 12px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;

  /* Border Radius */
  --radius-xl: 11.9952px;
}
```
