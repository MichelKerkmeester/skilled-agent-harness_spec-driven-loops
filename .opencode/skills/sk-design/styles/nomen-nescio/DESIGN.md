# Nomen Nescio — Style Reference
> ink on warm paper

**Theme:** light

Nomen Nescio is an editorial paper-and-ink system for a conceptual fashion label: a warm off-white canvas (#fdfdfa) holds oversized fashion photography while every interface element recedes into a single near-black ink (#2b2b2e). The entire typography stack uses one custom sans-serif at one weight (400) — no bold, no light, no italic — so hierarchy is built purely through size and negative letter-spacing rather than contrast. Components are flat rectangles, no shadows, no rounded corners, no color: identity comes from the restraint, the warm neutrals, and the photography bleeding edge-to-edge. The system feels like a printed zine reproduced as a website — whitespace is the layout grid, and every UI surface could be cut from the same sheet of paper.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#fdfdfa` | `--color-paper` | Page canvas and card surfaces — warm off-white reads as aged paper, not digital white |
| Bone | `#f5f3ee` | `--color-bone` | Elevated surface and subtle washes — used for card backgrounds and hover states, one step warmer than canvas |
| Ink | `#2b2b2e` | `--color-ink` | Primary text, navigation, borders, and outlined actions — near-black with a warm undertone, never pure #000 |
| Ash | `#bebcb4` | `--color-ash` | Muted text and secondary borders — warm gray for metadata, subtitles, and hairline dividers |
| Pebble | `#deddd8` | `--color-pebble` | Light dividers and structural borders — barely visible rules between sections |
| Mist | `#d9d7c9` | `--color-mist` | Form input borders — slightly warmer than pebble to read as a distinct UI surface |

## Tokens — Typography

### Nomen Nescio (custom) — Single-weight display and body sans-serif — a monoline custom face used for every text element on the site. No bold, no light, no italic variants exist; hierarchy is achieved through size and negative letter-spacing only. Substitutes with a similar monoline character: 'Neue Haas Grotesk Display Pro' or 'Söhne' at weight 400. · `--font-nomen-nescio-custom`
- **Substitute:** Söhne or Inter at 400
- **Weights:** 400
- **Sizes:** 14, 15, 16, 18, 19, 28, 36
- **Line height:** 1.05–1.43
- **Letter spacing:** -0.036em at 36px, -0.028em at 28px, -0.021em at 19px, -0.017em at 18px, -0.016em at 16px, -0.008em at 14–15px, +0.007em for small uppercase labels
- **Role:** Single-weight display and body sans-serif — a monoline custom face used for every text element on the site. No bold, no light, no italic variants exist; hierarchy is achieved through size and negative letter-spacing only. Substitutes with a similar monoline character: 'Neue Haas Grotesk Display Pro' or 'Söhne' at weight 400.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.112px | `--text-caption` |
| body | 16px | 1.43 | -0.256px | `--text-body` |
| subheading | 18px | 1.25 | -0.306px | `--text-subheading` |
| heading | 28px | 1.11 | -0.784px | `--text-heading` |
| heading-lg | 36px | 1.05 | -1.296px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 47 | 47px | `--spacing-47` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 39-47px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Full-Bleed Hero Image
**Role:** Opening viewport visual

Edge-to-edge photograph with no padding, no border, no radius. Navigation text overlays directly on the image in #fdfdfa (white) for legibility. Aspect ratio fills the full viewport width; the image bleeds to the page edges with no container.

### Text Navigation Bar
**Role:** Primary site navigation

Text-only nav links at 15px in Ink (#2b2b2e) for light backgrounds or Paper (#fdfdfa) when overlaid on dark hero. No backgrounds, no borders, no padding blocks — just spaced words separated by ~20px gaps. Left-aligned logo, right-aligned utility links (EUR, Search, Bag).

### Announcement Bar
**Role:** Site-wide top banner

Single-line centered text at 14px in Paper (#fdfdfa) on Ink (#2b2b2e) background. Full-bleed, 1px or minimal vertical padding, contains a dismiss 'Close' action right-aligned.

### Editorial Feature Card
**Role:** Large content card for collections, articles, and installations

Two-column card: full-width photograph on top, title and subtitle stacked below on Paper canvas. Title at 18–19px Ink, subtitle at 14–15px Ash. No border, no padding container around the image, 20px vertical spacing between image and text block.

### Product Grid Card
**Role:** Individual product listing

Square or portrait product photo (no radius, no border) with optional discount tag overlay in top-left corner. No text below the image in the visible grid; product details appear on interaction. Image fills its grid cell edge-to-edge.

### Discount Badge
**Role:** Sale indicator on product images

Plain text '-50%' at 14px in Ink (#2b2b2e), no background, no border, no pill shape. Positioned absolutely in the top-left of a product image. Relies on whitespace and position for emphasis.

### Ghost Link
**Role:** Default interactive text element

Ink-colored text link with 1px Ink underline or hairline border-bottom. No background fill, no padding, no hover background change. Inherits body font size and weight (always 400).

### Text Input
**Role:** Form fields for search, email, checkout

Borderless or 1px Mist (#d9d7c9) bottom border, Paper (#fdfdfa) background, Ink text. No focus ring color shift — focus state uses a thicker Ink bottom border instead. Placeholder text in Ash (#bebcb4).

### Outlined Action Button
**Role:** Primary interactive button

1px Ink (#2b2b2e) border, Paper (#fdfdfa) background, Ink text at 14–16px. 6–8px vertical padding, 20px horizontal padding. No radius. On dark/image backgrounds, inverts to Paper border with Paper text. This is the only button variant — there is no filled button.

### Section Heading
**Role:** Editorial section titles

Ink text at 28–36px, weight 400, negative letter-spacing (-0.028em to -0.036em). Left-aligned with no decorative element. Generous whitespace above and below (39–47px section gap).

### Product Grid
**Role:** Collection display layout

4-column grid of product cards on desktop, 2-column on tablet, 1-column on mobile. No gutters between cards — images touch edge-to-edge, creating a seamless editorial wall. Section sits directly on Paper canvas with no card container.

### Side Label (Explore)
**Role:** Vertical or edge-anchored category label

Small Ink text at 14–15px, vertically centered or left-edge anchored. Functions as a section divider label (e.g., 'Explore' on the left edge). No background, no border.

## Do's and Don'ts

### Do
- Use the custom 'Nomen Nescio' font at weight 400 exclusively — never introduce bold, light, or italic weights for hierarchy; build contrast through size and negative letter-spacing alone
- Set all borders to 0px radius — every corner is sharp, every image bleeds edge-to-edge without rounding
- Reach for #fdfdfa as the page canvas and #f5f3ee only when you need subtle surface elevation; never use white (#ffffff) or pure black (#000000)
- Apply letter-spacing of -0.036em at display sizes (36px) down to -0.008em at body sizes; reserve the positive +0.007em tracking exclusively for small uppercase micro-labels
- Keep all buttons ghost/outlined with a 1px Ink border on Paper background — there is no filled button variant in this system
- Let photography fill the entire viewport or grid cell; never pad, frame, or containerize images with backgrounds or borders
- Use 20px for element gaps, 39–47px for section breaks, and 4px as the base spacing unit for all micro-adjustments

### Don't
- Do not introduce any color outside the six neutrals (Paper, Bone, Ink, Ash, Pebble, Mist) — the system is 2% colorful by design and any accent will break the editorial paper language
- Do not use box-shadows, drop-shadows, or glow effects — elevation comes from surface color shifts and borders, never from shadow
- Do not use border-radius on any element — 0px everywhere, no exceptions for badges, buttons, or images
- Do not set backgrounds to pure white (#ffffff) or text to pure black (#000000) — always use the warm off-white (#fdfdfa) and warm near-black (#2b2b2e) variants
- Do not add a bold or semibold weight for emphasis — if something needs more visual weight, increase its size and tighten its letter-spacing further
- Do not containerize or pad product images with white space — images should touch the grid edges and the page edges
- Do not introduce filled (solid-color) buttons, gradient backgrounds, or colored badges — the discount tag is plain text on the image, not a pill

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#fdfdfa` | Page background — the warm white that everything sits on |
| 2 | Bone | `#f5f3ee` | Card and elevated surface — subtly warmer than canvas to create gentle separation |

## Elevation

The design system has no shadow vocabulary. Elevation is communicated exclusively through surface color shifts (canvas #fdfdfa → bone #f5f3ee) and hairline borders. Every element sits flush against the paper — the flatness is intentional, mimicking a printed publication rather than a skeuomorphic software interface.

## Imagery

Imagery is the primary brand expression: full-bleed editorial fashion photography, predominantly featuring dark monochromatic clothing on models in architectural or outdoor settings (concrete tracks, brutalist buildings, natural light). Treatment is high-key with natural daylight, muted color grading, and tight or environmental framing — no studio backdrops, no product-only flat-lays. Images are always uncropped and unrounded, bleeding to the page edges. The role of photography is atmospheric and identity-defining rather than informational; it occupies 60–80% of the visual space on key pages, with text acting as captions. No illustrations, no icons, no decorative graphics — the only visual elements are photographs and type.

## Layout

The page model is full-bleed with no max-width container on the hero and editorial sections, transitioning to a 1440px max-width on grid and product sections. Navigation is a single-line text bar overlaying the hero. The hero is a full-viewport-width photograph with overlaid text navigation. Below the hero, content alternates between two-column editorial feature cards and a 4-column product grid, with a left-edge 'Explore' label anchoring the section. Section rhythm is consistent: 39–47px vertical gaps, no alternating background bands (everything sits on Paper), no dividers between sections. Content is left-aligned with generous left margin. Grid usage: 4-column product grid with no gutters, 2-column editorial feature layout, 1-column mobile fallback. Density is spacious — large photographs dominate while text labels are small and secondary.

## Agent Prompt Guide

Quick Color Reference:
- text: #2b2b2e (Ink)
- background: #fdfdfa (Paper)
- surface/elevated: #f5f3ee (Bone)
- muted text: #bebcb4 (Ash)
- border: #deddd8 (Pebble)
- input border: #d9d7c9 (Mist)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a full-bleed hero section: 100vw width, no padding, no border, no radius. Edge-to-edge photograph fills the viewport. Navigation overlay uses 15px Nomen Nescio font at weight 400, color #fdfdfa (Paper) for legibility on dark images, letter-spacing -0.008em. Logo left-aligned, utility links (EUR, Search, Bag) right-aligned, 20px gap between items. Announcement bar above: full-bleed #2b2b2e (Ink) background, 14px #fdfdfa (Paper) text centered.

2. Create an editorial feature card: two-column layout, no card background or border. Top half is full-width photograph touching both edges. Below image: title at 19px Nomen Nescio 400 in #2b2b2e, letter-spacing -0.021em. Subtitle at 15px in #bebcb4 (Ash). 20px gap between image and text, 39–47px gap to next card.

3. Create a 4-column product grid: images fill each cell edge-to-edge with no gutters, no gaps, no border-radius. Each product photo touches its neighbors. Discount badge '-50%' as plain 14px #2b2b2e text positioned absolute top-left of the image, no background, no pill, no border.

4. Create a section heading: 28px or 36px Nomen Nescio weight 400 in #2b2b2e, letter-spacing -0.028em to -0.036em, left-aligned on #fdfdfa background. 39px margin-top, 47px margin-bottom. No decorative lines, no underlines, no accent color.

5. Create a text input field: 1px bottom border in #d9d7c9 (Mist), no other borders, no border-radius, #fdfdfa background. Text at 15px Nomen Nescio 400 in #2b2b2e, placeholder in #bebcb4. On focus, bottom border thickens to 1px #2b2b2e. No focus ring, no glow, no background change.

## Typography Philosophy

The Nomen Nescio custom face is monoline and geometric at a single weight (400). The absence of weight variation forces all typographic hierarchy through size and letter-spacing — a deliberate anti-convention choice that gives the system its editorial restraint. Tracking is aggressively negative at display sizes (-0.036em at 36px) and eases toward neutral at body sizes (-0.008em at 14px), with one positive tracking value (+0.007em) reserved for tiny uppercase micro-labels. Line heights compress at large sizes (1.05 at 36px) and open up at small sizes (1.43 at 14px), creating a visual rhythm where display type feels dense and architectural while caption text breathes.

## Similar Brands

- **COS** — Same warm off-white canvas, flat photography-led layout, and single-weight minimal sans-serif typography with no decorative elements
- **The Row** — Shared editorial restraint — near-monochrome palette, oversized fashion photography, text-only navigation, and a near-absence of UI color
- **Toteme** — Identical approach to Scandinavian minimal fashion: warm neutrals, sharp 0px corners, single-weight typography, and photography as the primary brand surface
- **Jil Sander** — Same conceptual minimalism — white-paper canvas, hairline borders, negative letter-spacing on display type, and editorial grid layouts
- **Lemaire** — Parallel philosophy of stripped-back presentation: warm cream surfaces, ghost outlines instead of filled buttons, and typography that whispers rather than shouts

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper: #fdfdfa;
  --color-bone: #f5f3ee;
  --color-ink: #2b2b2e;
  --color-ash: #bebcb4;
  --color-pebble: #deddd8;
  --color-mist: #d9d7c9;

  /* Typography — Font Families */
  --font-nomen-nescio-custom: 'Nomen Nescio (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.112px;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.256px;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.306px;
  --text-heading: 28px;
  --leading-heading: 1.11;
  --tracking-heading: -0.784px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.296px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-47: 47px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 39-47px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #fdfdfa;
  --surface-bone: #f5f3ee;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper: #fdfdfa;
  --color-bone: #f5f3ee;
  --color-ink: #2b2b2e;
  --color-ash: #bebcb4;
  --color-pebble: #deddd8;
  --color-mist: #d9d7c9;

  /* Typography */
  --font-nomen-nescio-custom: 'Nomen Nescio (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.112px;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.256px;
  --text-subheading: 18px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.306px;
  --text-heading: 28px;
  --leading-heading: 1.11;
  --tracking-heading: -0.784px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.296px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-47: 47px;
}
```
