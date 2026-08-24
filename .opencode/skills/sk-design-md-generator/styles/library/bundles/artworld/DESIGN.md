# ARTWORLD — Style Reference
> fashion masthead on white linen

**Theme:** light

ARTWORLD is a typographic art piece masquerading as a website — an agency masthead where the entire visual system is built from two weights of contrast: pure white paper and pure black ink. The aesthetic borrows from high-fashion editorial credits pages, where the talent roster becomes the design itself, and a single oversized wordmark anchors the composition like a magazine cover. Two type families do all the work: Cardinal Fruit (a refined display serif) provides the elegant italic voices for names, while Graphik Light at weight 300 supplies the quiet, whisper-thin supporting text — a deliberate anti-convention choice that makes the 75px display serifs feel monumental by contrast. Everything is left-aligned in a ragged editorial grid, with no color, no shadows, no rounded corners, no decoration. The system is monochrome to its bones and treats typography as the only meaningful design surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | All text, the ARTWORLD wordmark, hairline structural borders, link strokes — the only mark-making color in the entire system |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, negative space between type, reverse text on the wordmark bar |

## Tokens — Typography

### Graphik Light — The invisible support system — body text, captions, metadata, role tags, the legend, the info link. Weight 300 is deliberately thin: it recedes so the Cardinal Fruit can dominate. This is the typographic equivalent of using whisper voice in a conversation where someone else is speaking. The consistent -0.065em letter-spacing tightens the already-light forms, giving the sans-serif an editorial density that prevents it from feeling like default UI text. · `--font-graphik-light`
- **Substitute:** Inter Light, IBM Plex Sans Light, or Söhne Buch
- **Weights:** 300
- **Sizes:** 12px, 16px, 20px
- **Line height:** 1.20–1.58
- **Letter spacing:** -0.0650em
- **Role:** The invisible support system — body text, captions, metadata, role tags, the legend, the info link. Weight 300 is deliberately thin: it recedes so the Cardinal Fruit can dominate. This is the typographic equivalent of using whisper voice in a conversation where someone else is speaking. The consistent -0.065em letter-spacing tightens the already-light forms, giving the sans-serif an editorial density that prevents it from feeling like default UI text.

### Cardinal Fruit (and Italic / Classic Italic variants) — The editorial display voice — used for talent names, artist credits, and any moment of typographic expression. The italic variant carries the romantic, fashion-magazine feeling while the upright version provides structural headlines. Custom serif with high contrast strokes, used at extreme sizes (65–75px) to dominate the page. The whisper weight (300) on such a large serif is anti-convention: most editorial serifs use 400–700 here, but the light cuts create airier letterforms that feel more printed than digital. · `--font-cardinal-fruit-and-italic-classic-italic-variants`
- **Substitute:** Playfair Display, Cormorant Garamond, or Libre Caslon Text
- **Weights:** 300
- **Sizes:** 18px, 65px, 75px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.0100em at 75px, -0.0310em at 65px, -0.0110em at 18px
- **Role:** The editorial display voice — used for talent names, artist credits, and any moment of typographic expression. The italic variant carries the romantic, fashion-magazine feeling while the upright version provides structural headlines. Custom serif with high contrast strokes, used at extreme sizes (65–75px) to dominate the page. The whisper weight (300) on such a large serif is anti-convention: most editorial serifs use 400–700 here, but the light cuts create airier letterforms that feel more printed than digital.

### Cardinal Fruit Italic — Cardinal Fruit Italic — detected in extracted data but not described by AI · `--font-cardinal-fruit-italic`
- **Weights:** 300
- **Sizes:** 16px, 65px, 75px
- **Line height:** 1, 1.09, 1.5
- **Letter spacing:** -0.031, -0.01
- **Role:** Cardinal Fruit Italic — detected in extracted data but not described by AI

### Cardinal Classic Italic — Cardinal Classic Italic — detected in extracted data but not described by AI · `--font-cardinal-classic-italic`
- **Weights:** 300
- **Sizes:** 18px
- **Line height:** 1.2
- **Letter spacing:** -0.011
- **Role:** Cardinal Classic Italic — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.78px | `--text-caption` |
| body | 16px | 1.5 | -1.04px | `--text-body` |
| body-lg | 20px | 1.58 | -1.3px | `--text-body-lg` |
| display | 65px | 1.09 | -2.015px | `--text-display` |
| display-lg | 75px | 1 | -0.75px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 49 | 49px | `--spacing-49` |
| 76 | 76px | `--spacing-76` |
| 90 | 90px | `--spacing-90` |
| 95 | 95px | `--spacing-95` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 0px |

### Layout

- **Section gap:** 76-95px
- **Card padding:** 30px
- **Element gap:** 20px

## Components

### Talent Name Cell
**Role:** Primary unit of the talent grid — individual artist/creator name in the credits section

Name set in Cardinal Fruit Italic at 18px, line-height 1.20, letter-spacing -0.011em, color #000000. Followed immediately by a superscript role tag (e.g., P, D, V, C, S) also at 12–18px in Cardinal Fruit Italic. The tag sits as a raised annotation, like a footnote in a magazine masthead. No border, no background, no decoration — just type on white.

### Role Legend
**Role:** Key explaining the superscript role tags in the talent grid

A single horizontal line of Graphik Light at 12px, color #000000, centered or left-aligned at the bottom of the credits section. Format: (P) Photographer (D) Director (V) Virtual (C) CGI (S) Stylist — parenthetical letters followed by lowercase labels. Generous 29–30px horizontal padding between items to create breathing room.

### ARTWORLD Wordmark
**Role:** Brand identifier and visual anchor — the page's only large-scale graphic element

Set in a heavy bold sans-serif (distinct from Cardinal Fruit and Graphik — appears to be a Neue Haas or similar grotesque at 900 weight) at approximately 120–150px, letter-spacing tight (-0.02em range), color #000000, line-height 1.00. Occupies the full viewport width, left-aligned. This is the loudest element on the page by an order of magnitude — its only structural function is to assert brand presence against the whisper-quiet grid above it.

### Info Link
**Role:** Persistent utility link, likely to contact or about details

Set in Cardinal Fruit Italic at 12px, color #000000, positioned in the bottom-right corner of the page. No underline by default — the italic serif itself signals interactivity. Minimal padding, sits alone with significant white space around it.

### Credits Grid
**Role:** The main content surface — a multi-row, multi-column layout of talent name cells

Flexible ragged grid of 3–4 columns on desktop. Column gap 40–95px, row gap 20–35px. Each row is vertically centered, not baseline-aligned, creating a slightly uneven but visually rhythmic flow. The mix of italic and upright Cardinal Fruit across cells creates natural variation — some names lean right, some stand straight. The grid is the page; there is no other content structure.

## Do's and Don'ts

### Do
- Use only #000000 and #ffffff. Any introduction of grey, tint, or color breaks the monochrome contract.
- Set all display type in Cardinal Fruit (upright or italic) at 65–75px with weight 300. The whisper weight is non-negotiable — it creates the airiness that makes the type feel printed, not digital.
- Set all body and supporting type in Graphik Light at weight 300. Do not promote to Regular or Medium; the thinness is the point.
- Use the two type families as a system of contrast: Cardinal Fruit speaks, Graphik Light stays quiet. Never let Graphik Light appear at sizes that compete with Cardinal Fruit.
- Maintain tight letter-spacing: -0.065em for Graphik Light, -0.010 to -0.031em for Cardinal Fruit. This tracking is what gives the type its editorial density.
- Keep all spacing generous — 76–95px between major sections, 20–30px between elements. This is a spacious design that breathes.
- Left-align everything. Center-alignment would break the ragged editorial grid that gives the page its fashion-magazine rhythm.

### Don't
- Do not add any color beyond black and white. No accent colors, no state colors, no hover tints. Monochrome is the brand.
- Do not use rounded corners. Every edge is sharp, every surface is flat. The system has no curves.
- Do not add shadows, gradients, or elevation effects. The design is completely flat — depth comes from type size contrast, not from visual effects.
- Do not use bold or semibold weights for body or display type. The system lives at 300. Heavier weights break the whisper voice.
- Do not use system sans-serifs (Arial, Helvetica, Roboto) as substitutes for Graphik Light. The lightness and tight tracking of Graphik are what make it disappear correctly.
- Do not center-align body text or grid items. The ragged left edge is a design feature, not a limitation.
- Do not add icons, illustrations, photography, or decorative graphics. This is a typography-only system. The wordmark is the only visual element that isn't running text.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Full-page canvas — the entire site lives on this surface |

## Elevation

No shadows, no elevation, no depth effects whatsoever. The design achieves hierarchy entirely through type scale and weight contrast — a 75px Cardinal Fruit display naturally dominates a 16px Graphik Light body without needing any visual lift. Surfaces are absolute: pure black ink on pure white paper, nothing between.

## Imagery

No photography, no illustration, no product imagery, no icons. The entire visual system is typography. The only graphic element is the ARTWORLD wordmark itself, which functions as both brand identifier and the page's only visual mass. Any imagery would be foreign to this system.

## Layout

Single-page editorial layout with full-bleed content (no max-width container). The page reads top-to-bottom as: (1) talent credits grid occupying the upper 60% of the page in a ragged 3–4 column layout of mixed italic/upright serif names with superscript role annotations, (2) a small horizontal legend line explaining the role codes, (3) the massive ARTWORLD wordmark spanning full viewport width at the bottom in heavy bold sans-serif. Everything is left-aligned. There is no traditional navigation, no hero section, no sidebar — the talent roster IS the page. The layout treats the browser as a printed editorial spread.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px hairline)
- accent: no distinct accent color
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Create a talent name cell: white background. Name in Cardinal Fruit Italic, 18px, weight 300, color #000000, letter-spacing -0.198px. Immediately after the name, a superscript role tag in the same font at 12px, raised 4px. No border, no background, no padding — just type sitting on the page.

2. Create a section legend: horizontal row at the bottom of a credits grid, set in Graphik Light 12px weight 300, color #000000, letter-spacing -0.78px. Items separated by 29px horizontal padding. Format each item as a parenthetical letter followed by a lowercase label, e.g. '(P) Photographer'.

3. Create the ARTWORLD wordmark: set 'ARTWORLD' in a heavy bold sans-serif (Neue Haas Grotesk Display or Inter at weight 900) at 120–150px, line-height 1.00, letter-spacing -0.02em, color #000000, left-aligned, spanning the full viewport width. No margin above — it should sit directly against the preceding content with the page's standard 76–95px section gap.

4. Create a credits grid container: white background, no border, no padding. 3-column grid with 95px column gap and 20px row gap. Each grid cell is a talent name cell (see component 1). Grid is left-aligned within the page — no centering, no max-width constraint.

5. Create an info link: Cardinal Fruit Italic 12px, weight 300, color #000000, no underline, positioned bottom-right of the page with 30px padding from the viewport edge. The italic serif itself signals clickability — no hover treatment needed beyond the existing #000000 color.

## Typography Pairing Logic

The two type families are not interchangeable — they serve opposite functions. Cardinal Fruit (both upright and italic variants) is the VOICE: it carries names, headlines, brand moments, and any text that should be read as expression. Graphik Light is the INFRASTRUCTURE: it carries metadata, legends, UI chrome, and any text that should be read as information. The 300 weight on both creates a system-wide whisper that makes the contrast between serif (expressive) and sans (informational) feel natural rather than hierarchical. Never use Graphik Light for names or headlines. Never use Cardinal Fruit for body paragraphs or metadata.

## Similar Brands

- **Saint Laurent (ysl.com)** — Same editorial-masthead aesthetic with massive bold sans-serif wordmark on pure white, zero color, type-only composition, whisper-thin supporting text
- **Acne Studios (acnestudios.com)** — High-fashion agency feel with serif italic names, generous white space, monochrome palette, and type as the sole design element
- **The Gentlewoman magazine** — Editorial roster/credits approach with mixed serif italic display type, generous spacing, and a roster-as-design philosophy
- **Mubi (mubi.com)** — Cultural curation site with extreme type contrast, monochrome palette, whisper-light body text supporting bold display moments

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-graphik-light: 'Graphik Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-fruit-and-italic-classic-italic-variants: 'Cardinal Fruit (and Italic / Classic Italic variants)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-fruit-italic: 'Cardinal Fruit Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-classic-italic: 'Cardinal Classic Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.78px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -1.04px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.58;
  --tracking-body-lg: -1.3px;
  --text-display: 65px;
  --leading-display: 1.09;
  --tracking-display: -2.015px;
  --text-display-lg: 75px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.75px;

  /* Typography — Weights */
  --font-weight-light: 300;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-49: 49px;
  --spacing-76: 76px;
  --spacing-90: 90px;
  --spacing-95: 95px;

  /* Layout */
  --section-gap: 76-95px;
  --card-padding: 30px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-all: 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-graphik-light: 'Graphik Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-fruit-and-italic-classic-italic-variants: 'Cardinal Fruit (and Italic / Classic Italic variants)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-fruit-italic: 'Cardinal Fruit Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cardinal-classic-italic: 'Cardinal Classic Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.78px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -1.04px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.58;
  --tracking-body-lg: -1.3px;
  --text-display: 65px;
  --leading-display: 1.09;
  --tracking-display: -2.015px;
  --text-display-lg: 75px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.75px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-49: 49px;
  --spacing-76: 76px;
  --spacing-90: 90px;
  --spacing-95: 95px;
}
```
