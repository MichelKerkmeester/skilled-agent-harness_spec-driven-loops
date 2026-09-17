# 14islands — Style Reference
> Monochrome editorial gallery — A pristine gallery wall where oversized black typography and full-bleed photography exist without decoration, color, or UI noise.

**Theme:** light

14islands operates as a gallery space for digital work: pure white canvas, near-black text, and a single mid-gray for quiet secondary information. The visual hierarchy is built entirely through scale — display type swells to 180px while body text stays at a disciplined 16px, creating a 10× relationship that feels editorial rather than digital. Components are barely there: hairline borders, 4px corners, no shadows, no chromatic color anywhere in the interface. Photography and full-bleed dark media blocks carry the visual weight that color would in a more conventional system. The single design device that breaks the monochrome discipline is the lighter-gray ampersand or category label — a whisper of contrast that structures typographic relationships without adding hue.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#070707` | `--color-ink` | Primary text, display headlines, full-bleed dark media blocks, nav wordmark — the single near-black that anchors every interface |
| Paper | `#ffffff` | `--color-paper` | Default canvas, card surfaces, text on dark sections |
| Fog | `#f2f2f2` | `--color-fog` | Subtle surface differentiation for alternating sections or inset panels — barely visible, used to create quiet separation without borders |
| Stone | `#a2a2a9` | `--color-stone` | Secondary text, category labels, decorative ampersand, muted button text — the entire chromatic-like hierarchy comes from this one gray |
| Graphite | `#797979` | `--color-graphite` | Muted body text, helper copy, tertiary metadata — deeper than Stone for occasional emphasis on small text |

## Tokens — Typography

### BentonSans — All UI and body text — navigation links, body copy, footer, buttons, tags, small uppercase eyebrows. A custom grotesque that reads neutral and workmanlike; the substitute should preserve its clean even stroke and wide x-height. · `--font-bentonsans`
- **Substitute:** Inter or Söhne
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.20 / 1.40
- **Letter spacing:** normal
- **Role:** All UI and body text — navigation links, body copy, footer, buttons, tags, small uppercase eyebrows. A custom grotesque that reads neutral and workmanlike; the substitute should preserve its clean even stroke and wide x-height.

### AftenScreen — Display and editorial headlines only. Line-height collapses to 0.80 at the largest sizes — the letters of "Design" and "Technology" nearly touch, creating a condensed mass of ink. Weight stays at 400; scale alone provides emphasis. The tight tracking (-0.05em to -0.04em) tightens the optical spacing so oversized type doesn't feel airy. · `--font-aftenscreen`
- **Substitute:** Fraunces or Editorial Old
- **Weights:** 400
- **Sizes:** 27px, 75px, 100px, 180px
- **Line height:** 0.80 / 1.00 / 1.30
- **Letter spacing:** -0.04em to -0.05em
- **Role:** Display and editorial headlines only. Line-height collapses to 0.80 at the largest sizes — the letters of "Design" and "Technology" nearly touch, creating a condensed mass of ink. Weight stays at 400; scale alone provides emphasis. The tight tracking (-0.05em to -0.04em) tightens the optical spacing so oversized type doesn't feel airy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 27px | 1.3 | -1.08px | `--text-subheading` |
| heading | 75px | 1 | -3px | `--text-heading` |
| heading-lg | 100px | 0.8 | -4px | `--text-heading-lg` |
| display | 180px | 0.8 | -7.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 20 | 20px | `--spacing-20` |
| 100 | 100px | `--spacing-100` |
| 108 | 108px | `--spacing-108` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 100-160px
- **Card padding:** 20-25px
- **Element gap:** 5-10px

## Components

### Top Navigation Bar
**Role:** Primary site chrome

Full-bleed white bar, 16px BentonSans. Three-zone layout: wordmark "14islands" left-aligned in Ink, nav links (WORK, SERVICES, CULTURE, JOURNAL, AI) center-aligned and spaced, CONTACT right-aligned. No background fill, no border, no shadow. Links are Ink at 16px; CONTACT carries the same weight and color but sits in the right zone to read as a soft CTA through position, not styling.

### Uppercase Eyebrow Tag
**Role:** Section label / category intro

BentonSans 12px, Stone (#a2a2a9), uppercase, letter-spacing slight. Two-line block with a label (e.g. "CREATIVE AGENCY") over a short sentence. Functions as the quiet lead-in to any major section. No background, no border.

### Display Headline Block
**Role:** Hero-level typographic moment

AftenScreen 180px, weight 400, line-height 0.80, letter-spacing -0.04em, color Ink. Can span one or two lines; ampersand or connecting words rendered in Stone (#a2a2a9) as a typographic device. No max-width constraint on the type itself — it bleeds to the viewport edges, reading as a poster rather than a paragraph.

### Case Study Card
**Role:** Project portfolio entry

Two-column grid (gap 25px row / 10px column). Image fills card edge-to-edge with no radius. Below image: project name in AftenScreen ~27px Ink, followed by em-dash and category label in Stone BentonSans 16px. No card background, no border, no shadow — the image IS the card surface.

### Full-Bleed Media Block
**Role:** Hero video / feature showcase

Rectangular block, 100% viewport width, 0px radius, Ink (#070707) background. Typically hosts video or oversized photography. Sits between text sections as a visual breather. No overlay, no caption within the block — context lives above and below in surrounding text.

### Section Heading (Lighter)
**Role:** Mid-page editorial heading

AftenScreen 100px, weight 400, line-height 0.80, color Stone (#a2a2a9). Appears as a quiet alternative to the full-strength Ink display — used for transition sections ("Lovable Products / from vision to launch") where the content is still introducing itself.

### Nav Link (Ghost)
**Role:** Primary navigation and footer links

BentonSans 16px, weight 400, color Ink (top nav) or Stone (footer). No underline by default, no background. On hover: opacity shift or color transition to Stone. The link IS the button — there is no filled alternative.

### Footer
**Role:** Site footer with contact and metadata

Ink (#070707) background, Paper (#ffffff) text. BentonSans 16px body, 12px caption for fine print. Spacious padding (54-100px vertical). No social icons styled prominently — links live as text only.

## Do's and Don'ts

### Do
- Use only the five neutral tokens — Ink, Paper, Fog, Stone, Graphite. Never introduce chromatic color.
- Set display type at 75-180px with line-height 0.80-1.00 and letter-spacing -0.04em; weight stays at 400.
- Keep all border-radius at 4px — for cards, buttons, tags, inputs, and image frames.
- Maintain a 10× scale ratio between body (16px) and display (180px) to preserve editorial hierarchy.
- Use Stone (#a2a2a9) for the ampersand, category labels, and any secondary text — never for body paragraphs.
- Space major sections with 100-160px vertical padding; element gaps stay in the 5-25px compact range.
- Render case study images edge-to-edge with no border, no radius, no shadow — the image is the card.

### Don't
- Do not introduce any color — no blue, red, green, or accent hue of any kind.
- Do not use shadows, glows, or any CSS box-shadow. Depth comes from scale and contrast only.
- Do not use border-radius above 4px — the 4px value is the ceiling, not the floor.
- Do not use display type at body sizes. AftenScreen under 50px should be paired with lower line-height to feel intentional, not just oversized body text.
- Do not use bold or semibold weights for emphasis — weight 400 + size does all the work.
- Do not fill buttons with Ink as a primary action. The system has no filled button; navigation and CTAs are text-only.
- Do not use 3+ column grids for case studies. The layout is always pairs.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Default page canvas — the overwhelming majority of the interface |
| 1 | Fog | `#f2f2f2` | Quiet surface for alternating sections or subtle card differentiation |
| 2 | Ink | `#070707` | Full-bleed media blocks, dark inversions, footer or featured content panels |

## Elevation

This system is strictly flat. No shadows, no glows, no elevation tokens. Depth is communicated exclusively through scale (type size), contrast (black blocks against white), and the 4px corner radius — the only concession to softness in an otherwise sharp-edged interface. Any drop shadow would immediately break the editorial gallery feel.

## Imagery

Photography is the only visual medium beyond type. Case study images are high-production editorial photography — fashion, lifestyle, product, and luxury — often full-bleed with no treatment overlay. Portrait-oriented crops for people, product crops for objects. Full-bleed video blocks in Ink act as movement punctuation. The aesthetic is gallery-curated, not stock — every image looks commissioned. No illustrations, no abstract graphics, no decorative shapes. The interface itself is the negative space; imagery is the content.

## Layout

Full-bleed page canvas with no persistent side margins on the outermost sections. Top navigation spans edge-to-edge. The display headline bleeds across the full viewport width. Section rhythm is: short typographic intro → full-bleed media block → grid of case studies → typographic transition. The case study grid is a strict 2-column layout (10-25px gaps) that always reads as pairs, never as a 3+ column matrix. Vertical breathing room is extreme (100-160px between major sections) — the layout is generous and editorial, never information-dense.

## Agent Prompt Guide

## Quick Color Reference
- Background: #ffffff
- Surface (subtle): #f2f2f2
- Primary text / dark block: #070707
- Secondary text / decorative: #a2a2a9
- Muted helper text: #797979
- Border / hairline: #070707 at 0.1 opacity, or #a2a2a9
- primary action: no distinct CTA color

## Example Component Prompts

1. **Build the top navigation bar**: Full-bleed white bar with three zones. Left: wordmark "14islands" in AftenScreen weight 400 at 16px, color Ink (#070707). Center: nav links (WORK, SERVICES, CULTURE, JOURNAL, AI) in BentonSans 16px Ink with 42px gap between items. Right: CONTACT in BentonSans 16px Ink. No background, no border, no shadow. Padding 20px top and bottom.

2. **Build a case study card (2-column grid)**: Edge-to-edge image at 4px radius, no border. Below the image, 20px gap, then project name in AftenScreen 27px weight 400 Ink. On the same line after the name: em-dash then category label in BentonSans 16px Stone (#a2a2a9). The card has no background fill and no shadow.

3. **Build a display headline section**: Full viewport width. AftenScreen 180px weight 400, line-height 0.80, letter-spacing -0.04em, color Ink. Place the ampersand "&" in Stone (#a2a2a9) at the same size. Section padding: 108px top, 160px bottom.

4. **Build a full-bleed media block**: 100% viewport width, 0px radius, Ink (#070707) background, 4:3 or 16:9 aspect ratio. Place it directly after a typographic section, with 100px gap above and below. No overlay, no caption inside the block.

5. **Build a transition heading section**: Stone-colored secondary headline. AftenScreen 100px weight 400, line-height 0.80, color #a2a2a9. Two lines, second line can be a sub-line at 27px BentonSans 16px Graphite. Background Paper, padding 100px vertical.

## Similar Brands

- **Locomotive** — Same monochrome editorial aesthetic, oversized display type, and case-study-as-poster card grid with no border-radius beyond 4px
- **Active Theory** — Full-bleed video blocks, white canvas, single-font type system where scale alone drives hierarchy
- **Resn** — Creative agency portfolio with extreme typographic scale, no chromatic palette, and full-bleed media as section dividers
- **DIA Studio** — Near-identical monochrome discipline, display-serif-on-white-canvas presentation, and gallery-style project grid
- **Pentagram** — Editorial-agency restraint with large display type, minimal UI chrome, and photography carrying all the color and visual weight

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #070707;
  --color-paper: #ffffff;
  --color-fog: #f2f2f2;
  --color-stone: #a2a2a9;
  --color-graphite: #797979;

  /* Typography — Font Families */
  --font-bentonsans: 'BentonSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aftenscreen: 'AftenScreen', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 27px;
  --leading-subheading: 1.3;
  --tracking-subheading: -1.08px;
  --text-heading: 75px;
  --leading-heading: 1;
  --tracking-heading: -3px;
  --text-heading-lg: 100px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -4px;
  --text-display: 180px;
  --leading-display: 0.8;
  --tracking-display: -7.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-20: 20px;
  --spacing-100: 100px;
  --spacing-108: 108px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 100-160px;
  --card-padding: 20-25px;
  --element-gap: 5-10px;

  /* Border Radius */
  --radius-md: 4.16667px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #f2f2f2;
  --surface-ink: #070707;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #070707;
  --color-paper: #ffffff;
  --color-fog: #f2f2f2;
  --color-stone: #a2a2a9;
  --color-graphite: #797979;

  /* Typography */
  --font-bentonsans: 'BentonSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aftenscreen: 'AftenScreen', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 27px;
  --leading-subheading: 1.3;
  --tracking-subheading: -1.08px;
  --text-heading: 75px;
  --leading-heading: 1;
  --tracking-heading: -3px;
  --text-heading-lg: 100px;
  --leading-heading-lg: 0.8;
  --tracking-heading-lg: -4px;
  --text-display: 180px;
  --leading-display: 0.8;
  --tracking-display: -7.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-20: 20px;
  --spacing-100: 100px;
  --spacing-108: 108px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4.16667px;
}
```
