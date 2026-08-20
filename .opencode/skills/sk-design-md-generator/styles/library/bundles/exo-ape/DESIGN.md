# Exo Ape — Style Reference
> Venetian gallery at golden hour

**Theme:** light

Exo Ape operates as a digital studio site that reads like a printed architecture monograph: one massive custom neo-grotesque (Lausanne) sets a near-monastic tone while full-bleed editorial photography does the heavy atmospheric work. The palette is almost entirely warm neutrals — a deep ink-black, warm canvas beige, and two sand-toned border colors that replace the usual cool-gray UI chrome. Headlines are not styled; they are BUILT at 144–250px with negative tracking tight enough to make the letterforms collide, while body copy drops to 14–16px in the same family at loose, breathable line-heights (1.88–2.64). There is no shadow, no gradient, no accent color, and no filled button — interactions are thin warm-beige outlined links that feel like captions, not calls to action. The whole system whispers prestige through scale, whitespace, and warmth rather than shouting it through saturation or contrast.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#0d0e13` | `--color-ink-black` | Primary text, dark UI frames, icon strokes — the deepest near-black with a barely-perceptible cool cast that keeps it from feeling warm or brown against the beige canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, nav background, image bleeds — the brightest surface level that lifts content off the warm canvas |
| Canvas Beige | `#e4e0db` | `--color-canvas-beige` | Page background, section bands — a warm light gray-beige that gives the whole site its sunlit, paper-like quality |
| Steel Gray | `#6e6e71` | `--color-steel-gray` | Secondary body text, muted borders — the only truly achromatic neutral in the system, used sparingly to signal de-emphasis |
| Footer Ink | `#070707` | `--color-footer-ink` | Footer background — a pure near-black that reads as the deepest possible dark without losing detail |
| Sand Border | `#e0ccbb` | `--color-sand-border` | Default hairline borders, icon outlines, structural dividers — the warm tan that replaces cold gray chrome throughout the interface |
| Warm Linen | `#e6d7ca` | `--color-warm-linen` | Outlined action borders, link underlines, interactive link states — the lighter, more luminous sand tone that signals interactivity without filling the shape |

## Tokens — Typography

### Lausanne-400 — Lausanne-400 — detected in extracted data but not described by AI · `--font-lausanne-400`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 2.64
- **Role:** Lausanne-400 — detected in extracted data but not described by AI

### Lausanne — Primary typeface for everything from 14px body to 250px display. The 250px hero display with -0.046em tracking is the signature element — letters nearly collide, creating a monolithic word-as-architecture presence. The single weight 400 across the full scale (from 14px to 250px) means hierarchy comes from size and tracking alone, not from bold. · `--font-lausanne`
- **Substitute:** Inter, Neue Haas Grotesk, Suisse Int'l
- **Weights:** 400
- **Sizes:** 14, 16, 24, 144, 250
- **Line height:** 0.76, 0.90, 1.33, 1.50, 1.88
- **Letter spacing:** -0.046em at 250px, -0.035em at 144–24px, +0.006em at 16px, +0.007em at 14px
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** Primary typeface for everything from 14px body to 250px display. The 250px hero display with -0.046em tracking is the signature element — letters nearly collide, creating a monolithic word-as-architecture presence. The single weight 400 across the full scale (from 14px to 250px) means hierarchy comes from size and tracking alone, not from bold.

### Times — System serif fallback used in tertiary body contexts. Acts as a quiet typographic counterpoint to the neo-grotesque — never set in display sizes, always at 16px with generous leading. · `--font-times`
- **Substitute:** Times New Roman, system serif
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.20, 2.00
- **Role:** System serif fallback used in tertiary body contexts. Acts as a quiet typographic counterpoint to the neo-grotesque — never set in display sizes, always at 16px with generous leading.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.88 | 0.098px | `--text-body-sm` |
| body | 16px | 1.5 | 0.096px | `--text-body` |
| subheading | 24px | 1.33 | -0.84px | `--text-subheading` |
| heading-lg | 144px | 0.76 | -5.04px | `--text-heading-lg` |
| display | 250px | 0.76 | -11.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 67 | 67px | `--spacing-67` |
| 120 | 120px | `--spacing-120` |
| 200 | 200px | `--spacing-200` |
| 206 | 206px | `--spacing-206` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 200px
- **Card padding:** 50-60px
- **Element gap:** 13-15px

## Components

### Top Navigation Bar
**Role:** Minimal primary navigation

Full-bleed white bar with the Exo Ape wordmark left-aligned and 4 text links (Work, Studio, News, Contact) right-aligned. 48–60px vertical padding, no border, no shadow. Links in Lausanne 14px at #0d0e13, no underline. The nav floats over hero imagery with no backdrop blur — it simply sits on the surface.

### Full-Bleed Hero Section
**Role:** Atmospheric page opening

Edge-to-edge editorial photography (architecture, landscape, lifestyle) at viewport height or larger. Overlay text in Lausanne 250px, weight 400, #ffffff, letter-spacing -0.046em, positioned bottom-left with 120px horizontal padding. The hero text acts as architectural type — it does not describe the image, it becomes part of it.

### Outlined Action Link
**Role:** Primary interaction element

The site's de facto button. 1px solid #e6d7ca border around Lausanne 16px text, #0d0e13, with 8–16px vertical and 20–32px horizontal padding. No fill, no shadow. On hover, the border darkens to #0d0e13. Zero corner radius. Reads as a caption with a frame, not a button.

### Display Headline Block
**Role:** Section-defining type

Lausanne 144–250px, weight 400, #0d0e13 on light sections or #ffffff on dark imagery. Line-height 0.76, letter-spacing -0.035em to -0.046em. No max-width constraint — headlines are allowed to break wherever the line-break algorithm decides, creating irregular right edges that feel editorial.

### Body Text Block
**Role:** Running prose and descriptions

Lausanne 16px, weight 400, #0d0e13, line-height 1.50, max-width ~480–560px. Secondary descriptions drop to 14px with line-height 1.88. No first-line indent, no drop cap. The narrow measure and generous leading give long-form text a literary, unhurried quality.

### Image Card
**Role:** Project thumbnail or case study

Full-bleed photograph with 0px corner radius, no border, no shadow. Caption text in Lausanne 14px, #0d0e13, positioned beneath with 13–15px gap. Cards sit directly on the #e4e0db canvas — the warm background provides the only visual separation.

### List Item with Sand Divider
**Role:** Work index, navigation lists, footer links

List items separated by 1px #e0ccbb bottom borders, 30–50px vertical padding per row. Text in Lausanne 14–16px, #0d0e13. The warm tan divider replaces the conventional cool-gray hairline, making every list feel like a printed table of contents.

### Footer Block
**Role:** Terminal dark surface

#070707 background, full-bleed, 200px vertical padding. All text in #ffffff, Lausanne 14–16px. No social icons rendered in color, no accent highlights. The footer closes the page with the deepest possible black, creating maximum contrast against the warm beige canvas above.

### Section Spacer
**Role:** Vertical rhythm between sections

Not a component but a rhythm rule: 200px of vertical breathing room between major sections, implemented as paddingTop/paddingBottom on the outer section wrapper. This is the system's primary elevation tool — it replaces shadows, cards, and dividers with pure whitespace.

## Do's and Don'ts

### Do
- Set display type at 144–250px in Lausanne weight 400 with tracking between -0.035em and -0.046em — the size IS the hierarchy
- Use #e6d7ca 1px borders for all interactive elements; let the outlined link be the only action shape in the system
- Maintain 200px section gaps to create editorial whitespace; resist pulling sections closer together
- Use #e4e0db as the default page canvas, not pure white, to preserve the warm paper-like atmosphere
- Set body text line-height at 1.88 for 14px and 1.50 for 16px; the generous leading is what makes Lausanne readable at small sizes
- Use #e0ccbb for all structural dividers, list separators, and hairline borders — never default to cool gray
- Let images bleed to all four edges with 0px corner radius; the warmth comes from the canvas behind, not from rounded framing

### Don't
- Do not introduce filled buttons, filled backgrounds for actions, or any solid color button — the outlined link is the only action component
- Do not use box-shadow, drop-shadow, or blur effects; depth comes from surface color contrast and whitespace only
- Do not use saturated colors, gradients, or brand accent hues; the palette ends at warm sand tones
- Do not set body type below 14px or above 16px; the 14–16px range is the only legible band in the system
- Do not add corner radius to cards, buttons, or images; every edge in the system is sharp 0px
- Do not use bold or semibold weights; the system has one weight (400) and hierarchy comes from size alone
- Do not center-align body prose; keep running text left-aligned with a 480–560px measure for editorial readability

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e4e0db` | Full-page warm background establishing the paper-like base |
| 1 | Surface White | `#ffffff` | Card and panel surfaces that lift content off the canvas |
| 2 | Sand Tint | `#e0ccbb` | Subtle warm wash for highlighted sections or accent bands |
| 3 | Footer Ink | `#070707` | Terminal dark surface closing the page with contrast |

## Elevation

The system deliberately uses zero box-shadow. Depth is communicated exclusively through surface color contrast — white cards on a beige canvas, dark footer on light sections, and warm sand borders as visual dividers. This is a design-without-shadows philosophy rooted in editorial print design, where page layers are read by ink density and color temperature rather than by drop-shadow.

## Imagery

The visual language is dominated by full-bleed editorial photography — architectural exteriors (domes, basilicas, civic buildings), warm-toned landscapes, and lifestyle imagery shot at golden hour. Treatment is always full-bleed, always edge-to-edge with zero corner radius, always with the warmest possible white balance to match the #e4e0db canvas. Images are never cropped to thumbnails with padding; they are always presented at maximum scale, often as full-viewport hero backgrounds. The photography style is high-key warm, staged but not sterile, with deep shadow detail preserved in the architecture. Icons, when present, are minimal thin-stroke line icons at 1px weight in #0d0e13. The site is image-heavy but uses images as atmosphere, not as product showcase — the photography sells the studio's aesthetic sensibility, not its deliverables.

## Layout

Full-bleed, viewport-scale layout with no max-width container. The hero is a single full-viewport image with overlay display text anchored bottom-left at 120px horizontal padding. Below the hero, sections alternate between #ffffff and #e4e0db surfaces, each separated by 200px of vertical breathing room. Content blocks are left-aligned, narrow-measure prose columns (480–560px) for body text, with display headlines allowed to break at their natural line-length creating irregular right edges. The grid is loose — no rigid 12-column system, no card grids with uniform sizing. Navigation is a single top bar with no sticky behavior, no mega-menu, and no visual weight. The page reads top-to-bottom as a vertical scroll through atmospheric photography punctuated by monumental type, ending in a near-black footer that provides the only dramatic contrast in the entire layout.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #0d0e13
- background: #ffffff (cards) or #e4e0db (canvas)
- border: #e0ccbb (structural) or #e6d7ca (interactive)
- muted text: #6e6e71
- primary action: no distinct CTA color

EXAMPLE COMPONENT PROMPTS

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. OUTLINED ACTION LINK: Lausanne 16px, weight 400, #0d0e13 text. 1px solid #e6d7ca border, 12px vertical padding, 24px horizontal padding, 0px corner radius. On hover, border becomes #0d0e13. No background fill, no shadow. Use this for every interactive element on the site.

3. BODY TEXT BLOCK: Lausanne 16px, weight 400, #0d0e13, line-height 1.50, max-width 520px, left-aligned. For longer passages, drop to 14px with line-height 1.88. No first-line indent, no drop cap, no italic for emphasis — size contrast does all the work.

4. SECTION WITH WARM CANVAS: Background #e4e0db, 200px top and bottom padding. Display headline in Lausanne 144px, weight 400, #0d0e13, letter-spacing -0.035em, line-height 0.76. Narrow body text column below at 520px max-width in Lausanne 16px.

5. LIST WITH SAND DIVIDERS: Vertical list of items, each separated by 1px solid #e0ccbb bottom border. Each item has 30px vertical padding. Text in Lausanne 14px, #0d0e13, line-height 1.88. No bullet points, no icons — the divider line is the only visual structure.

## Typographic Architecture

The single most defining choice in this system is the use of one weight (400) across a type scale that spans 14px to 250px. This is anti-conventional — most design systems solve hierarchy with weight (300/400/500/600/700). Exo Ape solves it with size and tracking alone. The 250px display with -0.046em letter-spacing creates letterforms so tight that the word becomes a solid mass — 'Digital' at 250px reads as a single architectural object, not as eight characters. The 14px body at +0.007em tracking and 1.88 line-height creates the opposite effect: letters breathe, lines breathe, the page breathes. The system oscillates between these two extremes and never uses intermediate weights to smooth the transition — the jump from 24px to 144px is deliberately jarring, like turning a page in a monograph.

## Warm Neutral System

Every neutral in the system has a warm cast — even the near-black #0d0e13 has a barely-perceptible blue undertone that reads as cool only when placed directly next to a truly achromatic gray. The canvas #e4e0db is a warm light gray-beige, the dividers #e0ccbb and #e6d7ca are warm sands, and the white surfaces are used sparingly to lift content. The only truly cool element is the muted text gray #6e6e71, which is used minimally for de-emphasis. This warm-cool tension is subtle but consistent — the site feels like it was printed on cream paper, not displayed on a screen.

## Similar Brands

- **Locomotive** — Same editorial full-bleed photography approach with massive neo-grotesque display type and warm-neutral canvas — both treat the website as a printed monograph
- **Resn** — Similar oversized display headlines, generous whitespace, and warm-toned hero photography with minimal UI chrome
- **Pentagram** — Same single-weight type scale spanning body-to-display sizes, warm-neutral palette, and editorial layout that prioritizes type and photography over UI elements
- **Active Theory** — Same full-bleed atmospheric hero photography with overlay display type and minimal navigation, though Active Theory pushes more into motion and depth

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #0d0e13;
  --color-pure-white: #ffffff;
  --color-canvas-beige: #e4e0db;
  --color-steel-gray: #6e6e71;
  --color-footer-ink: #070707;
  --color-sand-border: #e0ccbb;
  --color-warm-linen: #e6d7ca;

  /* Typography — Font Families */
  --font-lausanne-400: 'Lausanne-400', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.88;
  --tracking-body-sm: 0.098px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.096px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.84px;
  --text-heading-lg: 144px;
  --leading-heading-lg: 0.76;
  --tracking-heading-lg: -5.04px;
  --text-display: 250px;
  --leading-display: 0.76;
  --tracking-display: -11.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-67: 67px;
  --spacing-120: 120px;
  --spacing-200: 200px;
  --spacing-206: 206px;

  /* Layout */
  --section-gap: 200px;
  --card-padding: 50-60px;
  --element-gap: 13-15px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #e4e0db;
  --surface-surface-white: #ffffff;
  --surface-sand-tint: #e0ccbb;
  --surface-footer-ink: #070707;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #0d0e13;
  --color-pure-white: #ffffff;
  --color-canvas-beige: #e4e0db;
  --color-steel-gray: #6e6e71;
  --color-footer-ink: #070707;
  --color-sand-border: #e0ccbb;
  --color-warm-linen: #e6d7ca;

  /* Typography */
  --font-lausanne-400: 'Lausanne-400', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lausanne: 'Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.88;
  --tracking-body-sm: 0.098px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.096px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.84px;
  --text-heading-lg: 144px;
  --leading-heading-lg: 0.76;
  --tracking-heading-lg: -5.04px;
  --text-display: 250px;
  --leading-display: 0.76;
  --tracking-display: -11.5px;

  /* Spacing */
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-67: 67px;
  --spacing-120: 120px;
  --spacing-200: 200px;
  --spacing-206: 206px;
}
```
