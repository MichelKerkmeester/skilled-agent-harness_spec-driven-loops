# Altason — Style Reference
> architectural monochrome broadsheet

**Theme:** light

Altason is a portfolio-as-canvas: a pure black-on-white editorial grid where massive, medium-weight Grotesk wordmarks are the hero and the work itself is the product. The system is 0% chromatic — every visual moment is built from ink, paper, and the negative space between them. Components are borderless except for hairline 1px black lines that quietly subdivide the page; there are no shadows, no gradients, no rounded corners, no accent hues. Type does all the work, and it speaks loudly by being huge and only weight 500 — the restraint of a medium weight at 288px is the signature move. Density is generous and architectural: sections breathe with 112–288px vertical padding, content sits in a three-column grid, and every surface is a flat plane with no elevation hierarchy. An AI agent should think of this as designing a printed magazine spread, not a SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hairline borders, structural rules, image borders, heading fills — the dominant ink that draws the entire page |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, reverse text on dark blocks — the surface that lets the black type speak |
| Charcoal Plate | `#212121` | `--color-charcoal-plate` | Dark surface blocks and image backgrounds where white reverse type sits — a softer alternative to pure black for large dark areas |
| Silver Hairline | `#b0b0b0` | `--color-silver-hairline` | Subtle dividers and muted secondary links — a quiet mid-gray that recedes behind the black ink without disappearing |

## Tokens — Typography

### Haas Grotesk DS Pro — Display and section wordmarks — used at 48–288px with extremely tight leading (0.77–0.80) so multi-line display type nearly touches. The DS variant's compressed proportions are what let 288px headlines fit within a single viewport without breaking rhythm. Substitute: Neue Haas Grotesk Display, or Akzidenz-Grotesk Pro Medium · `--font-haas-grotesk-ds-pro`
- **Substitute:** Neue Haas Grotesk Display 65 Medium, or Inter Tight 500
- **Weights:** 500
- **Sizes:** 48px, 106px, 230px, 288px
- **Line height:** 0.77–1.20
- **Letter spacing:** normal (0)
- **OpenType features:** `"calt" on, "kern" on, "liga" on, "rclt" on, "rlig" on, "rvrn" on`
- **Role:** Display and section wordmarks — used at 48–288px with extremely tight leading (0.77–0.80) so multi-line display type nearly touches. The DS variant's compressed proportions are what let 288px headlines fit within a single viewport without breaking rhythm. Substitute: Neue Haas Grotesk Display, or Akzidenz-Grotesk Pro Medium

### Haas Grotesk TX Pro — Body copy, captions, image labels, navigation links, UI text. Weight 400 for body, weight 500 for navigation labels and emphasis. The 36px size at line-height 0.90 creates a tight subheading that bridges body and display scales. Substitute: Neue Haas Grotesk Text, or Inter · `--font-haas-grotesk-tx-pro`
- **Substitute:** Neue Haas Grotesk Text, or Inter 400/500
- **Weights:** 400, 500
- **Sizes:** 16px, 18px, 36px
- **Line height:** 0.90–1.30
- **Letter spacing:** normal (0)
- **OpenType features:** `"calt" on, "kern" on, "liga" on, "rclt" on, "rlig" on, "rvrn" on`
- **Role:** Body copy, captions, image labels, navigation links, UI text. Weight 400 for body, weight 500 for navigation labels and emphasis. The 36px size at line-height 0.90 creates a tight subheading that bridges body and display scales. Substitute: Neue Haas Grotesk Text, or Inter

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.2 | — | `--text-caption` |
| body | 18px | 1.3 | — | `--text-body` |
| subheading | 36px | 0.9 | — | `--text-subheading` |
| heading-sm | 48px | 0.8 | — | `--text-heading-sm` |
| heading | 106px | 0.8 | — | `--text-heading` |
| heading-lg | 230px | 0.77 | — | `--text-heading-lg` |
| display | 288px | 0.77 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Card padding:** 20px
- **Element gap:** 8-10px

## Components

### Display Wordmark
**Role:** Brand name or section title rendered as oversized type

The brand name 'Atlason' rendered in Haas Grotesk DS Pro weight 500 at 230–288px, line-height 0.77, pure black on white. This is the primary visual element of the page — it occupies nearly the full height of a single column. No decoration, no underline, no color. The sheer scale and tight leading create the wordmark's presence.

### Section Heading
**Role:** Column or section labels in the three-column grid

Words like 'Works' and 'More' set in Haas Grotesk DS Pro weight 500 at 106–230px, line-height 0.80, black on white. Sized to anchor their column while leaving room for content below. The size step between the brand wordmark (288px) and these section labels (106–230px) creates a clear typographic hierarchy through size alone, not weight.

### Portfolio Tile
**Role:** Image card displaying a project thumbnail with caption

Rectangular image (no border-radius) with a 1px black border (borderColor from #000000), followed by a caption in Haas Grotesk TX Pro weight 400 at 16px, line-height 1.20, in black. The 1px black border frames the image like a museum print. No hover effects, no shadows, no overlay. Images sit directly on the white canvas with 20–32px gap between tiles.

### Footer Contact Block
**Role:** Multi-column footer with studio address, contacts, and press info

Divided into four narrow columns by hairline 1px vertical borders (black). Labels ('Visit', 'Contact', 'Connect', 'Follow') in Haas Grotesk TX Pro weight 500 at 16px, values below in weight 400 at 16px. Black on white, 20px padding-top/bottom, 48px padding-left for the first column. No background fill, no dividers heavier than 1px.

### Three-Column Page Grid
**Role:** Primary layout structure dividing the page into three equal-width columns

Full-bleed layout with three equal columns separated by 1px black vertical rules. The left column holds the brand wordmark and footer contact info; the center column holds the 'Works' portfolio grid; the right column holds the 'More' section. The grid has no max-width — it extends edge-to-edge. Column gaps are created by the 1px borders, not by padding.

### Hairline Rule
**Role:** Structural 1px border used to subdivide the page

A 1px solid line in #000000 used to separate columns, frame images, and divide footer sections. The rule is the only structural device in the system — there are no shadows, no background fills, no card containers. The visual hierarchy comes entirely from where these rules are placed.

### Image Frame
**Role:** Border treatment for all portfolio and content images

Every image is wrapped in a 1px solid black border (#000000). No padding between the image and the border, no radius, no shadow. This gives all images the quality of mounted photographic prints in an architecture portfolio.

### Navigation Link
**Role:** Text-based navigation item in the footer or header

Plain text in Haas Grotesk TX Pro weight 500 at 16px, black on white. No underlines by default; links may use a 1px black bottom border for emphasis. No hover color change, no background fill. Navigation is typographic, not buttonographic.

### Dark Image Panel
**Role:** Large image or section with a dark/charcoal background where reverse white type sits

A surface filled with #212121 containing a single large image or block of white text (e.g. 'Everything we imagine can be made.'). White text in Haas Grotesk TX Pro weight 500 at 18–36px. The dark panel creates the only tonal contrast in the system — it's the place where reverse type appears, and it functions as a visual pause between white sections.

## Do's and Don'ts

### Do
- Use Haas Grotesk DS Pro weight 500 at 48–288px for all display headings with line-height 0.77–0.80
- Set all border-radius to 0px — corners are always sharp
- Use 1px solid #000000 borders to frame every image and separate every column
- Use 112–288px padding-bottom for major section breaks to create architectural breathing room
- Use weight 500 (not 700) for emphasis — the medium weight at large sizes carries all the authority needed
- Set body text in Haas Grotesk TX Pro weight 400 at 18px with line-height 1.30
- Use #212121 as the only dark surface — reserve #000000 for text and borders, not large fills

### Don't
- Never introduce chromatic colors — the palette is strictly black, white, and gray
- Never add box-shadow, drop-shadow, or any elevation effect — the page is flat
- Never use border-radius greater than 0px on any element
- Never use weight 700+ for headings — medium (500) is the heaviest weight in the system
- Never set display type with line-height above 0.85 — the tight leading is what makes oversized type feel structural
- Never use colored hover or active states on links — navigation is purely typographic and static
- Never center text within columns — all text aligns left within its column

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper Canvas | `#ffffff` | Base page background — the default surface for all content |
| 2 | Charcoal Plate | `#212121` | Dark accent surface for image panels and reverse-type blocks |
| 3 | Ink Ground | `#000000` | Full-black surfaces used sparingly for maximum contrast moments |

## Elevation

The system deliberately avoids shadows as an elevation mechanism. All structural separation is achieved through 1px hairline rules and tonal contrast (white → #212121 → #000000). There is no z-axis — the page is a flat editorial plane where hierarchy comes from typographic scale, not depth.

## Imagery

Imagery is portfolio photography and product shots treated as archival plates: each image is framed by a 1px black border, sits directly on the white canvas with no surrounding card, and is captioned in 16px Grotesk below. No lifestyle photography, no people in environmental shots, no color grading — the work itself (furniture, objects, interiors) is shot cleanly and presented without artifice. Images are arranged in a 2-column grid in the 'Works' section and a single-column stack in the 'More' section, with generous white space between rows. The overall visual register is that of an architecture or design monograph: documentation, not marketing.

## Layout

Full-bleed three-column grid with no max-width and no centered container. The page divides immediately at the top into three equal columns separated by 1px black vertical rules: left column holds the brand wordmark ('Atlason' at ~230px) and the footer contact block; center column holds the 'Works' section heading and a 2-column portfolio grid of framed images with captions; right column holds the 'More' section heading and a single large dark image with reverse-type caption. There is no navigation bar — the page is a single full-viewport experience. Footer sits at the bottom of the left column, aligned to the baseline of the page. Section spacing is architectural: 112–288px of vertical padding separates major regions. No alternating bands, no background color shifts between sections — everything sits on the same white plane.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px solid)
- dark surface: #212121
- muted/divider: #b0b0b0
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Create a portfolio tile: white canvas, 1px solid #000000 border around a rectangular image, 20px gap below. Caption in Haas Grotesk TX Pro weight 400, 16px, #000000, line-height 1.20, left-aligned directly under the image.

2. Create a display wordmark: the word 'Studio' in Haas Grotesk DS Pro weight 500 at 230px, #000000, line-height 0.77, left-aligned, occupying the full height of a three-column layout's first column. No decoration, no underline, no color.

3. Create a footer contact block: four narrow columns separated by 1px solid #000000 vertical borders, 20px padding-top, 48px padding-left on the first column. Labels in Haas Grotesk TX Pro weight 500 at 16px, values in weight 400 at 16px, all #000000 on #ffffff.

4. Create a dark image panel: #212121 background filling a full column, containing a single line of white text in Haas Grotesk TX Pro weight 500 at 36px, line-height 0.90, bottom-left aligned with 20px padding.

5. Create a three-column page grid: full-bleed white layout divided into three equal-width columns by 1px solid #000000 vertical rules. No max-width, no centering, no gaps — the rules ARE the gutters. Each column holds its own vertical content stack.

## Typography Philosophy

The system uses exactly two fonts from the same family — Haas Grotesk DS Pro (Display) for oversized headings and Haas Grotesk TX Pro (Text) for everything else. The signature move is weight 500 at 230–288px: medium weight, not bold, at extreme sizes. This creates type that is architectural and confident without being aggressive. Line-heights below 0.85 on display sizes mean multi-line headings nearly touch, giving text a monolithic, sculptural quality. Body text stays at 16–18px with generous 1.20–1.30 leading for readability. There is no italic, no condensed, no display-script variation — the system has one voice and speaks it loudly through scale alone.

## Border System

Borders are the primary structural device. Every image gets a 1px #000000 frame. Every column boundary is a 1px #000000 vertical rule. Every footer section is divided by 1px vertical lines. There are no background-filled cards, no shadow-defined containers, no colored chips. If something needs to be separated from its surroundings, it gets a 1px black line. If something needs to be grouped, it shares a line with its neighbors. This border-first approach is what makes the system read as editorial print rather than digital UI.

## Similar Brands

- **Pentagram** — Same agency-portfolio-as-homepage structure with a three-column grid, oversized wordmark as the hero element, and no chromatic accent — the design IS the portfolio
- **Mass Moca / institutional art museum sites** — Same editorial broadsheet approach: full-bleed white canvas, 1px black rules, massive Grotesk headings, flat image frames with captions
- **Vitsoe** — Same monochrome black-on-white restraint with massive Helvetica-family display type and product photography framed by hairline borders
- **Order of Design (or similar architecture studios)** — Same portfolio-as-monograph presentation: work shown as archival plates with 1px black borders, captioned in clean Grotesk, laid out in a strict columnar grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-charcoal-plate: #212121;
  --color-silver-hairline: #b0b0b0;

  /* Typography — Font Families */
  --font-haas-grotesk-ds-pro: 'Haas Grotesk DS Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grotesk-tx-pro: 'Haas Grotesk TX Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.3;
  --text-subheading: 36px;
  --leading-subheading: 0.9;
  --text-heading-sm: 48px;
  --leading-heading-sm: 0.8;
  --text-heading: 106px;
  --leading-heading: 0.8;
  --text-heading-lg: 230px;
  --leading-heading-lg: 0.77;
  --text-display: 288px;
  --leading-display: 0.77;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-112: 112px;

  /* Layout */
  --card-padding: 20px;
  --element-gap: 8-10px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-charcoal-plate: #212121;
  --surface-ink-ground: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-charcoal-plate: #212121;
  --color-silver-hairline: #b0b0b0;

  /* Typography */
  --font-haas-grotesk-ds-pro: 'Haas Grotesk DS Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grotesk-tx-pro: 'Haas Grotesk TX Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.2;
  --text-body: 18px;
  --leading-body: 1.3;
  --text-subheading: 36px;
  --leading-subheading: 0.9;
  --text-heading-sm: 48px;
  --leading-heading-sm: 0.8;
  --text-heading: 106px;
  --leading-heading: 0.8;
  --text-heading-lg: 230px;
  --leading-heading-lg: 0.77;
  --text-display: 288px;
  --leading-display: 0.77;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-112: 112px;
}
```
