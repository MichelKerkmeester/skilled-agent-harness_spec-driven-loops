# Ashleyandco — Style Reference
> Whispered apothecary editorial — a warm cream page where a single serif headline floats like a perfume ad and every other element recedes into silence.

**Theme:** light

Ashley & Co operates in the visual register of a hushed beauty editorial: a warm cream canvas, near-black ink typography, and photography that arrives in muted rose and stone washes. The interface stays almost entirely achromatic — color is permitted only inside the imagery, never on buttons, borders, or type. Two typefaces do the heavy lifting: a refined serif (Martina Plant) for display moments that feel like magazine pull-quotes, and Neue Haas Grotesk Text for everything utilitarian. Components are weightless: hairline borders, no shadows, no fills beyond the canvas itself. White space is the dominant design element — generous 80px section gaps and off-grid asymmetry create the feeling of flipping through a coffee-table book rather than scrolling a shop. Navigation is whisper-thin uppercase tracked lettering; CTAs are text links with thin underlines. The overall effect is restrained, apothecary-luxe, and confident enough to let product photography and serif headlines carry the entire brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Cream | `#f6f3f0` | `--color-warm-cream` | Page canvas, hero and section backgrounds. This off-white with a barely-there pink undertone is the only surface tone used at scale — it warms the entire brand without ever calling attention to itself |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, modal backgrounds, and inverted text on dark buttons. Used sparingly against the cream canvas to create a single step of elevation without shadows |
| Ink Charcoal | `#3c3c3c` | `--color-ink-charcoal` | Primary body text, nav links, headings, and the dominant border color. Slightly softer than pure black — the entire interface reads as if printed in warm ink rather than digital black |
| Carbon Black | `#000000` | `--color-carbon-black` | Maximum-contrast text and strong borders for emphasis moments. Used in place of Ink Charcoal when an element needs to read as a hard rule — list separators, selected states, bold emphasis |
| Stone Border | `#dedfdb` | `--color-stone-border` | Hairline dividers and subtle structural borders between sections. A warm pale gray-green that disappears into the cream canvas — visible only as a quiet structural gesture |
| Ash Gray | `#939393` | `--color-ash-gray` | Medium-contrast borders, control outlines, and structural separators. |
| Graphite | `#434343` | `--color-graphite` | Button border and dark-mode modal backgrounds. A middle graphite that defines outlined actions without the harshness of pure black |

## Tokens — Typography

### Neue Haas Grotesk Text — All functional UI typography: nav, body copy, links, buttons, product names, footer text. Weight 500 reserved for nav labels and small emphasis; weight 400 for body and descriptions. The 11px size with +0.023em tracking and uppercase is used for tracked micro-labels (nav, 'SCENT SELECTOR', category tags) — a signature editorial gesture that treats interface labels like magazine captions. · `--font-neue-haas-grotesk-text`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk Display
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 18px, 24px
- **Line height:** 1.20, 1.10
- **Letter spacing:** 0.023em at 11px, -0.005em at 18px–24px
- **Role:** All functional UI typography: nav, body copy, links, buttons, product names, footer text. Weight 500 reserved for nav labels and small emphasis; weight 400 for body and descriptions. The 11px size with +0.023em tracking and uppercase is used for tracked micro-labels (nav, 'SCENT SELECTOR', category tags) — a signature editorial gesture that treats interface labels like magazine captions.

### Martina Plant — Display serif for section headlines, feature titles, and the large editorial pull-quotes that anchor each page. The 42px display size with tight 1.10 leading and slight +0.014em positive tracking creates a distinctive 'perfume ad' voice — the line-height of 0.72 at this size pulls lines together for a condensed editorial block. Weight 500 adds quiet weight to the larger cuts without going bold. · `--font-martina-plant`
- **Substitute:** Playfair Display, GT Super, or DM Serif Display
- **Weights:** 400, 500
- **Sizes:** 20px, 24px, 42px
- **Line height:** 1.10, 0.72
- **Letter spacing:** -0.005em at 20–24px, 0.014em at 42px
- **Role:** Display serif for section headlines, feature titles, and the large editorial pull-quotes that anchor each page. The 42px display size with tight 1.10 leading and slight +0.014em positive tracking creates a distinctive 'perfume ad' voice — the line-height of 0.72 at this size pulls lines together for a condensed editorial block. Weight 500 adds quiet weight to the larger cuts without going bold.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro-label | 11px | 1.2 | 0.023px | `--text-micro-label` |
| body | 18px | 1.2 | -0.005px | `--text-body` |
| subheading | 20px | 1.1 | -0.005px | `--text-subheading` |
| heading | 24px | 1.2 | -0.005px | `--text-heading` |
| display | 42px | 1.1 | 0.014px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| images | 0px |
| modals | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 15px

## Components

### Top Announcement Bar
**Role:** Site-wide promotional strip above the main nav

Full-bleed, 5–8px vertical padding, Warm Cream (#f6f3f0) background, centered single-line text in Neue Haas Grotesk Text 11px weight 500, letter-spacing 0.023em, uppercase, Ink Charcoal (#3c3c3c). No close button visible on data; if shown, a thin '×' right-aligned in Ash Gray (#939393). Functions as a whisper-thin editorial masthead strip rather than a loud banner.

### Primary Navigation Bar
**Role:** Main horizontal navigation

Sits on Warm Cream (#f6f3c3c) background with no border or shadow. Logo (Ashley & Co) left-aligned in Martina Plant ~20px weight 400. Center nav links (SHOP, SCENTS, ABOUT, TWENTY YEARS ON, JOURNAL) in Neue Haas Grotesk Text 11px weight 500, letter-spacing 0.023em, uppercase, Ink Charcoal (#3c3c3c), separated by 20–30px gaps. Right side has utility links (Search, Login, Cart) in the same micro-label style. No background fill, no border-bottom.

### Hero Section
**Role:** Full-bleed editorial header with product photography

Full-viewport height, full-bleed muted-rose product photography as background, no overlay tint. Headline ('Mother's Day, Made Easy') positioned bottom-left in Martina Plant 42px weight 500, Ink Charcoal (#3c3c3c), letter-spacing 0.014em, line-height ~1.10. The hero relies on photography carrying the mood; type and image breathe against each other with no bounding container.

### Product Category Carousel
**Role:** Horizontally scrolling category tile row

Section title 'Shop' in Martina Plant 24px weight 400 left-aligned, with a 1–2 line description in Neue Haas 12px Ash Gray (#939393) beneath. Below: a row of full-bleed photography tiles (no border, no radius, no shadow) each ~280px wide, with category labels ('HAND & BODY', 'LAUNDRY', 'PET') overlaid bottom-left in Neue Haas 11px weight 500 uppercase tracked 0.023em, Carbon Black on the image. Horizontal scroll with no visible scrollbar.

### Feature Section Headline
**Role:** Editorial pull-quote that introduces a new section

Generous 80px top padding. Headline in Martina Plant 42px weight 400, Ink Charcoal, line-height 0.72–1.10, letter-spacing 0.014em. Example pattern: 'Welcome in — let scent take over, in every corner.' Spans 2 lines, left-aligned, max-width ~600px. No subheadline, no CTA — the type is the only element.

### Scent Directory List
**Role:** Two-column taxonomy list of fragrance categories and notes

Three-column layout on Warm Cream background. Left column: section label 'SCENTS' in Neue Haas 12px uppercase tracked 0.023em Ink Charcoal, plus a 'Scent Selector' CTA block. Middle column: 'Discover' subhead in Neue Haas 12px uppercase, followed by a vertical list of scent names in Martina Plant 20px weight 400 Ink Charcoal with 5–10px vertical spacing per item. Right column: 'Notes of' subhead with stacked note names in the same small Neue Haas uppercase style. No dividers, no cards — just typography breathing on the cream canvas.

### Text Link (Primary Action)
**Role:** The site's de-facto button — underlined text with optional arrow

No filled buttons in the design system. Actions are rendered as Neue Haas 12px uppercase weight 500, letter-spacing 0.023em, Ink Charcoal, with a thin 1px underline in the same color. 15px horizontal padding, 5px vertical. Hover state shifts underline to Carbon Black (#000000). Used for 'View all', 'Scent Selector', 'Shop Now' style CTAs.

### Region Detection Modal
**Role:** Centered overlay asking visitors to confirm their store region

Pure White (#ffffff) background, 0px radius, no shadow. Centered on a translucent overlay. Header row: 'Wrong Store Detected' (Neue Haas 12px weight 500 uppercase tracked, Ink Charcoal) left, 'CLOSE' right in the same style. Body copy in Neue Haas 12px weight 400 Ink Charcoal. Region selector: 1px Ink Charcoal border, 15px padding, Warm Cream interior, no radius. Primary button: Graphite (#434343) background, White text in Neue Haas 11px weight 500 uppercase tracked 0.023em, 8px vertical / 15px horizontal padding, 0px radius. Secondary action below: underlined text link in Ink Charcoal.

### Editorial Feature Card (Nose Dive)
**Role:** Long-form feature block highlighting a single scent

Asymmetric two-column layout. Left: oversized title in Martina Plant 42px weight 500, Ink Charcoal, with a thin 1px Carbon Black bottom border. Right: paragraph of body copy in Neue Haas 18px weight 400, Ink Charcoal, 1.20 line-height, max-width ~500px. Below the copy: a thin 'Shop Now' text link. No image in this variant — the serif headline IS the visual.

### Footer
**Role:** Minimal site-wide footer

Warm Cream background, 60px top/bottom padding. Single-row or compact multi-row layout in Neue Haas 11px weight 400, Ash Gray (#939393). Section headings in Neue Haas 11px weight 500 uppercase tracked 0.023em Ink Charcoal. Links separated by generous 20–30px gaps. No social icons filled with brand color — icons, if present, are thin-stroke outline style in Ink Charcoal.

## Do's and Don'ts

### Do
- Set page backgrounds to Warm Cream (#f6f3f0) — never pure white at the page level; white is reserved for elevated surfaces only.
- Use Martina Plant 42px weight 500 with letter-spacing 0.014em for all display headlines; keep line-height at ~1.10.
- Set nav, button, and category labels in Neue Haas Grotesk Text 11px weight 500, uppercase, letter-spacing 0.023em — this tracked micro-label style is the system's signature gesture.
- Maintain 80px top/bottom padding between all major sections; the generous negative space is the primary design element.
- Render all actions as underlined text links in Ink Charcoal (#3c3c3c); never use filled colored buttons as the primary action.
- Keep all images at 0px border-radius and full-bleed within their container; the design system has no rounded imagery.
- Use a single 1px border in Stone Border (#dedfdb) or Carbon Black (#000000) for structural dividers; no box-shadows anywhere in the system.

### Don't
- Do not introduce chromatic color into the interface — the entire UI must remain achromatic; color lives only inside photography.
- Do not use bold or semibold weights; the typographic palette is 400 and 500 only, with 500 reserved for emphasis moments.
- Do not apply border-radius to cards, buttons, modals, or images; the only detected radius (10px) is for miscellaneous minor elements and should not be extended to core components.
- Do not use box-shadow to indicate elevation; rely on the white-on-cream surface jump and 1px borders instead.
- Do not center body copy or long-form descriptions; left-align all editorial text with a max-width of ~500–600px per column.
- Do not use all-caps body copy or large display sizes in Neue Haas Grotesk Text; sans-serif is for 11–24px functional UI only, with the 24px mark as its ceiling.
- Do not stack decorative elements, gradients, or iconography on top of photography; the image is the full-bleed moment and should remain uncluttered.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Cream Canvas | `#f6f3f0` | Page-wide base background — the only dominant surface tone |
| 1 | Pure White Card | `#ffffff` | Modal popups and elevated content blocks; the single step above the canvas |
| 2 | Graphite Overlay | `#434343` | Dark inverted surfaces for modals and emphasis blocks |

## Elevation

The design system explicitly avoids shadow as a depth mechanism. The only elevation signal is the jump from Warm Cream canvas (#f6f3f0) to Pure White (#ffffff) — a flat, one-step surface hierarchy. Modals and popups do not cast shadows; they are simply centered rectangles on a translucent overlay. This is a deliberate editorial choice that keeps the interface feeling like printed paper rather than a digital screen.

## Imagery

Photography is the sole source of color in the system, and it arrives in a tightly controlled palette of muted rose, dusty pink, warm cream, and stone gray. Product shots are styled flat-lay compositions — bottles, packaging, and raw ingredients arranged on crumpled silk or linen in diffused natural light. Lifestyle imagery features human hands and body parts (never full portraits) interacting with products, maintaining intimacy without faces. All photography is desaturated to feel like it belongs to the same editorial spread. Images are always full-bleed, zero-radius, no frames, no rounded corners — they are cropped hard to the grid. The dominant role of imagery is atmospheric mood-setting, not product specification: it tells the reader what the brand feels like, not what the product looks like in technical detail.

## Layout

The page model is max-width 1200px centered, but sections frequently break out to full-bleed for hero photography and category carousels. The overall rhythm alternates between full-bleed photographic bands and contained editorial text blocks. Hero is a full-viewport image with a bottom-left serif headline. After the hero, the layout settles into alternating sections: a left-aligned Martina Plant section headline followed by a horizontal category carousel, then a centered editorial text section, then a two-column scent directory, then a long-form feature block. Navigation is a minimal top bar with no sticky behavior indicated. Content density is sparse — each section claims 80px of vertical breathing room above and below, and asymmetric two-column splits create a magazine-like z-pattern rather than a rigid grid. Card grids are avoided entirely; content is presented as flowing editorial columns.

## Agent Prompt Guide

**Quick Color Reference**
- text: #3c3c3c (Ink Charcoal)
- background: #f6f3f0 (Warm Cream)
- surface (elevated): #ffffff (Pure White)
- border: #dedfdb (Stone Border) for hairlines, #000000 (Carbon Black) for emphasis
- muted/secondary: #939393 (Ash Gray)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a section headline: Warm Cream (#f6f3f0) background, 80px top padding, headline in Martina Plant 42px weight 500, color #3c3c3c, letter-spacing 0.014em, line-height 1.10, left-aligned, max-width 600px. No subheadline, no button.

2. Build a text-link action: inline element, Neue Haas Grotesk Text 12px weight 500, uppercase, letter-spacing 0.023em, color #3c3c3c, 1px underline in the same color, 15px horizontal padding and 5px vertical padding. No background fill, no border, no radius.

3. Build a category tile: full-bleed photography image at 0px radius, ~280px wide, with a label overlaid bottom-left in Neue Haas Grotesk Text 11px weight 500, uppercase, letter-spacing 0.023em, color #000000, 15px padding from the image edge. No border, no shadow.

4. Build a scent directory row: Warm Cream background, left column with Neue Haas 12px uppercase subhead 'Discover' in #3c3c3c, followed by a vertical list of scent names in Martina Plant 20px weight 400 #3c3c3c with 10px row spacing. No dividers between items.

5. Build the navigation bar: Warm Cream background, 20px vertical padding, Ashley & Co wordmark left in Martina Plant 20px weight 400 #3c3c3c, center nav items (SHOP, SCENTS, ABOUT, etc.) in Neue Haas 11px weight 500 uppercase letter-spacing 0.023em #3c3c3c with 20px gaps, utility links (Search, Login, Cart) right-aligned in the same style. No border-bottom, no background fill, no shadow.

## Similar Brands

- **Diptyque** — Same warm cream canvas, same achromatic UI, same reliance on muted product photography and serif headlines for brand voice.
- **Aesop** — Identical apothecary-luxe restraint — near-black sans-serif body, generous whitespace, zero shadows, and photography that carries all the color.
- **Le Labo** — Same editorial typography pairing (serif display + grotesque body), uppercase tracked micro-labels, and refusal to use bright UI color.
- **Goop** — Same magazine-like section rhythm with asymmetric two-column layouts, large serif pull-quotes, and full-bleed lifestyle photography.
- **By Far** — Same near-monochrome interface with the entire color story delivered through muted, desaturated product and editorial imagery.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-cream: #f6f3f0;
  --color-pure-white: #ffffff;
  --color-ink-charcoal: #3c3c3c;
  --color-carbon-black: #000000;
  --color-stone-border: #dedfdb;
  --color-ash-gray: #939393;
  --color-graphite: #434343;

  /* Typography — Font Families */
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martina-plant: 'Martina Plant', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro-label: 11px;
  --leading-micro-label: 1.2;
  --tracking-micro-label: 0.023px;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: -0.005px;
  --text-subheading: 20px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.005px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.005px;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: 0.014px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-modals: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-warm-cream-canvas: #f6f3f0;
  --surface-pure-white-card: #ffffff;
  --surface-graphite-overlay: #434343;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-cream: #f6f3f0;
  --color-pure-white: #ffffff;
  --color-ink-charcoal: #3c3c3c;
  --color-carbon-black: #000000;
  --color-stone-border: #dedfdb;
  --color-ash-gray: #939393;
  --color-graphite: #434343;

  /* Typography */
  --font-neue-haas-grotesk-text: 'Neue Haas Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martina-plant: 'Martina Plant', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro-label: 11px;
  --leading-micro-label: 1.2;
  --tracking-micro-label: 0.023px;
  --text-body: 18px;
  --leading-body: 1.2;
  --tracking-body: -0.005px;
  --text-subheading: 20px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.005px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.005px;
  --text-display: 42px;
  --leading-display: 1.1;
  --tracking-display: 0.014px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
