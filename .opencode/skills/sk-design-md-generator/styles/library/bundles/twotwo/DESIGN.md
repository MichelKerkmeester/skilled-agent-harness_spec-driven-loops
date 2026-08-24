# TWOTWO — Style Reference
> voltage lime on monochrome concrete — a single neon punch inside a black-and-white editorial grid

**Theme:** light

TWOTWO operates on ruthless visual discipline: a near-pure black-and-white system interrupted by a single piercing voltage-lime accent. The brand reads like a sports-tech catalog stripped to its bones — generous white space, a Swiss-grotesque typeface (Whyte) that does all the tonal work, and absolutely no decorative gradients, shadows, or secondary hues. Product photography is the only color the page permits on its own terms: the rackets themselves bring in coral, blue, sage, and orange, but every UI surface, border, and label stays monochrome. The lime accent functions as functional punctuation — a filled pill button, a hover state, a small swatch tag — never as decoration. Everything is geometric, compact, and confident: 16px image radii, 50px pill buttons, 72px display headlines, uppercase tracked navigation, and tight 1.1 line heights that let type do the heavy lifting. The mood is less 'padel store' and more 'industrial design catalog on a white marble bench.'

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Lime | `#e3fc03` | `--color-voltage-lime` | Primary CTA fill, active state, accent badges, and decorative highlights — the single chromatic moment in an otherwise monochrome system. Sits at 18.2:1 contrast against black, so it doubles as a high-visibility call-to-action and a hover indicator without needing a second hue |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, hairline borders, icon strokes, image borders, and footer background. Carries 2,045 border usages — this system uses black lines to structure space more than boxes or cards |
| Graphite | `#323232` | `--color-graphite` | Secondary text and softer borders — slightly lifted from pure black to create a visible hierarchy without introducing color |
| Carbon | `#1a1a1a` | `--color-carbon` | Icon strokes, link underlines, and low-priority UI marks — the third step of the dark scale, reserved for fine detail that should recede from primary text |
| Paper White | `#ffffff` | `--color-paper-white` | Primary page and card surface — the canvas everything else is drawn onto |
| Concrete | `#e6e6e6` | `--color-concrete` | Soft section background, alternate surface, and quiet card fill. |

## Tokens — Typography

### WhyteRegular — WhyteRegular — detected in extracted data but not described by AI · `--font-whyteregular`
- **Weights:** 400
- **Sizes:** 32px, 72px
- **Line height:** 1.1, 1.15
- **Role:** WhyteRegular — detected in extracted data but not described by AI

### Whyte — Display and section headings — used at 72px hero scale and 32px section scale. Tight 1.1 leading and a regular (not bold) weight are anti-convention: most sports brands shout with 800-weight display type, but Whyte Regular at 72px carries authority through letterform precision and negative space alone. The headlines never need a second style. Substitute: Inter Tight or Neue Haas Grotesk Display Pro at 400. · `--font-whyte`
- **Weights:** 400
- **Sizes:** 13px, 16px, 18px, 20px, 22px, 26px, 38px
- **Line height:** 1.10-1.15
- **Letter spacing:** -0.02em
- **Role:** Display and section headings — used at 72px hero scale and 32px section scale. Tight 1.1 leading and a regular (not bold) weight are anti-convention: most sports brands shout with 800-weight display type, but Whyte Regular at 72px carries authority through letterform precision and negative space alone. The headlines never need a second style. Substitute: Inter Tight or Neue Haas Grotesk Display Pro at 400.

### Whyte Book — Universal workhorse — body copy, subheadings, product captions, navigation, and buttons. One weight, one family, used at seven sizes. The 38px tier handles product card titles; 16px is the default body; 13px is the fine-print and footer size. Line-height tightens from 1.60 at body to 1.30 at 38px. Substitute: Inter or Söhne at 400. · `--font-whyte-book`
- **Weights:** 400
- **Sizes:** 13px, 16px, 18px, 20px, 22px, 26px, 38px
- **Line height:** 1.30-1.60
- **Role:** Universal workhorse — body copy, subheadings, product captions, navigation, and buttons. One weight, one family, used at seven sizes. The 38px tier handles product card titles; 16px is the default body; 13px is the fine-print and footer size. Line-height tightens from 1.60 at body to 1.30 at 38px. Substitute: Inter or Söhne at 400.

### Whyte Inktrap — Secondary detail typeface with inktrap terminals — used for fine UI labels, tag monograms, and small monospace-feeling metadata. The inktrap cuts prevent the letterforms from filling in at small sizes, giving tags and micro-copy a distinct technical voice. Substitute: JetBrains Mono or IBM Plex Mono at 400. · `--font-whyte-inktrap`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.60
- **Role:** Secondary detail typeface with inktrap terminals — used for fine UI labels, tag monograms, and small monospace-feeling metadata. The inktrap cuts prevent the letterforms from filling in at small sizes, giving tags and micro-copy a distinct technical voice. Substitute: JetBrains Mono or IBM Plex Mono at 400.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.6 | — | `--text-caption` |
| body-sm | 16px | 1.6 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| subheading | 22px | 1.4 | — | `--text-subheading` |
| heading-sm | 26px | 1.3 | -0.26px | `--text-heading-sm` |
| heading | 32px | 1.15 | -0.64px | `--text-heading` |
| heading-lg | 38px | 1.3 | -0.38px | `--text-heading-lg` |
| display | 72px | 1.1 | -1.44px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 50px |
| cards | 16px |
| images | 16px |
| inputs | 50px |
| buttons | 50px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-width white bar, 64-80px tall, containing the 'TWO TWO' wordmark (left), five uppercase text links at 13px Whyte Book (SHOP, PADEL RACKETS, PADEL BALLS, APPAREL & ACCESSORIES, BEST SELLERS, CONTACT US), and three right-aligned icon actions (CAD currency selector, search magnifier, cart bag) at 20px Obsidian stroke. No background fill, no border-bottom — the bar floats on white. Links are black, uppercase, tracked at ~0.04em.

### Pill CTA Button
**Role:** Primary action trigger

Voltage Lime (#e3fc03) fill, Obsidian (#000000) text, 50px border-radius (full pill), 16px 32px padding, Whyte Book 16px / weight 400 / line-height 1.0. No border, no shadow. Sits centered over hero imagery and stretches full-width on product cards (padding 12px 20px). This is the only interactive surface allowed to carry color.

### Hero Banner
**Role:** Full-bleed product showcase

Edge-to-edge product image filling 100vw × ~560px with a centered overlay headline at 72px Whyte Regular in Voltage Lime, followed by a pill CTA. The lime headline over the muted product photograph creates the brand's signature moment — chromatic type floating on a desaturated canvas. No gradient overlay; the product image's natural tones carry the contrast.

### Product Card
**Role:** Racket showcase tile

White surface, 16px border-radius, 1px Obsidian border, product image fills 100% width with 16px top-corner radius carrying through. Below the image: product title at 13px Whyte Book (left-aligned) and price at 13px right-aligned, separated by a hairline Obsidian rule. Full-width Pill CTA Button stacked beneath. The 1px black border on a white card is the system doing the work that shadows do elsewhere.

### Section Header
**Role:** Subsection title block

Centered text block, max-width ~640px. Primary title at 38px Whyte Book, color Obsidian. Optional supporting copy at 16px Whyte Book, color Graphite, 1.6 line-height. Generous 32-40px gap between title and body. No rule, no background — the centering and whitespace do the separation.

### Product Variant Tag
**Role:** Inline product color indicator

Tiny Voltage Lime square or short label, ~12px, positioned on the product image (top-left corner). Functions as a swatch callout — the lime chip is the same hue as the CTA, reinforcing that the accent is functional, not decorative.

### Text Input / Search Field
**Role:** Query input and form fields

White fill, 1px Obsidian border, 50px border-radius, Whyte Book 16px placeholder in Graphite. 12-16px vertical padding. Focus state thickens border to 2px Obsidian — no color change, no glow. The pill radius is reserved for inputs, buttons, and tags only.

### Footer
**Role:** Site-wide footer band

Full-width Obsidian (#000000) band, white text, uppercase Whyte Inktrap 16px for column headers, Whyte Book 13px for link lists. Padding 48-64px vertical. Inverts the page's white-on-black to black-on-white — the same border and type system, just inverted. No social icons in a different style; everything stays in the monochrome logic.

### Icon Button
**Role:** Utility action trigger

20-24px line icon, 1.5px Obsidian stroke, no fill, no border, no background. Used in nav (search, cart, account) and within cards. Touch target padded to 40px square. No hover state besides color holding — icons are utilitarian, not expressive.

### Product Image Frame
**Role:** Photographic container

Full-bleed product photograph, 16px border-radius, no border, no shadow. Images carry a 1px Obsidian hairline when used in product cards but stand borderless in hero contexts. The product itself is the content — the frame is barely there.

### Category Grid
**Role:** Product listing layout

3-column grid on desktop, 1-column mobile, 16-24px gutters. Cards stretch to equal height; images are aspect-ratio locked (3:4) so all rackets align. No alternating background tints — the grid sits on pure white with hairline grid lines.

### Racket Specification Callout
**Role:** Inline technical note

Centered body text at 16px Whyte Book, Graphite color, max-width 720px, used below section headers to describe product attributes ('Medium balance, 100% carbon and sandy finish — perfect for smooth spins and power in the attacking game without sacrificing too much control.'). Functions as a quiet technical-editorial voice between hero and grid.

## Do's and Don'ts

### Do
- Use Voltage Lime (#e3fc03) only on filled actions, active states, and the 72px hero headline — never as a background wash, never as a decorative gradient.
- Set all button and input radii to 50px (full pill) and all card/image radii to 16px — these two values are the only radii the system permits.
- Use Whyte Book at 400 weight for everything between 13px and 38px; do not introduce a bold weight to create hierarchy — use size and color step instead.
- Compose every page on Paper White (#ffffff) with Concrete (#e6e6e6) as the only permitted mid-gray for section dividers and backdrops.
- Reserve 1px Obsidian (#000000) hairlines for card borders and structural rules — the system uses lines, not shadows, to separate surfaces.
- Set product photographs full-bleed within 16px-radius frames; let the racket colors carry all visual variety inside the grid.
- Use uppercase, tracked navigation links at 13px Whyte Book with ~0.04em letter-spacing for all top-bar and footer text.

### Don't
- Do not introduce a second chromatic hue — no blues, reds, or greens outside the product photography. The page is monochrome plus lime, full stop.
- Do not use box-shadows or drop-shadows to elevate cards; elevation comes from 1px Obsidian borders on white surfaces, never from blurred shadows.
- Do not use a bold or 600+ weight for headlines — Whyte Regular at 400 with tight tracking is the signature; boldness would break the editorial register.
- Do not round images or cards to anything other than 16px, and do not use 4px or 8px micro-radii — the system lives in two radius steps only.
- Do not place buttons on colored or photographic backgrounds without the Voltage Lime fill — a white or black button would lose the brand's only signal.
- Do not stack the lime accent on lime (lime button on lime highlight) — the accent must sit against Paper White or Obsidian to register.
- Do not use centered text alignment for body copy, product titles, or prices — reserve centering for hero headlines and section headers only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary page canvas — all sections, cards, and product grids sit on this surface. |
| 1 | Concrete | `#e6e6e6` | Soft section backdrop and divider wash when a page needs a quiet tonal break without introducing a color. |
| 2 | Voltage Lime | `#e3fc03` | Accent surface — appears only on the pill CTA and occasionally as a 12px swatch tag on product images. |
| 3 | Obsidian | `#000000` | Inverted surface for the footer band — black canvas, white type, same border and radius rules. |

## Imagery

Product photography is the entire visual strategy. Rackets are shot straight-on, centered, on a pure light-gray studio backdrop with soft directional lighting and a faint ground shadow. No lifestyle, no court, no athlete — the object is the hero. Images are tightly cropped to the racket silhouette and presented at large scale inside the hero and at 3:4 aspect ratio in the product grid. The racket colors (sage, cream, coral, blue, green, orange) provide the page's only chromatic variety, and the surrounding UI stays ruthlessly monochrome so the products read as the color event. No illustrations, no icons beyond thin-line UI glyphs, no 3D renders, no abstract graphics.

## Layout

The page is a max-width 1280px contained layout, centered, with full-bleed hero exceptions. The hero is a full-viewport-width product image (~560px tall) with centered 72px lime headline and a pill CTA floating over it. Below the hero, the page settles into a single-column stack of sections separated by 64px gaps, each section either a centered text block (title + supporting copy) or a 3-column product grid. Navigation is a flat top bar with uppercase text links and right-aligned utility icons. There is no sticky header, no sidebar, no mega-menu. The footer is a full-width black band. Section rhythm is: hero image → centered category header → 3-column product grid → repeat. All content sits on white; tonal contrast comes from the product photography and the single lime accent, not from alternating background bands.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Obsidian)
- background: #ffffff (Paper White)
- border: #000000 (Obsidian, 1px hairline)
- accent: #e3fc03 (Voltage Lime)
- secondary text: #323232 (Graphite)
- primary action: #e3fc03 (filled action)

**3-5 Example Component Prompts**

1. **Hero Banner** — Full-bleed 100vw × 560px product image with centered 72px Whyte Regular headline in #e3fc03 (Voltage Lime), letter-spacing -1.44px. Below the headline, a pill CTA: 50px radius, #e3fc03 fill, #000000 text, Whyte Book 16px, padding 16px 32px.

2. **Product Card** — White surface (#ffffff), 1px #000000 border, 16px radius. Product image fills the card top with 16px top-corner radius. Below: 13px Whyte Book product title left-aligned in #000000, 13px price right-aligned, separated by a 1px #000000 hairline. Full-width pill CTA stacked beneath: 50px radius, #e3fc03 fill, #000000 text.

3. **Section Header** — Centered on white, max-width 640px. Title at 38px Whyte Book in #000000, supporting copy at 16px Whyte Book in #323232, line-height 1.6. 40px gap between title and body. No rule, no background.

4. **Top Navigation Bar** — Full-width white bar, 80px tall. Left: 'TWO TWO' wordmark in Whyte Book 16px uppercase. Center-left: five uppercase links at 13px Whyte Book, #000000, letter-spacing 0.04em. Right: three icon buttons (currency, search, cart) as 20px line icons with 1.5px #000000 stroke. No background, no border.

5. **Footer Band** — Full-width #000000 background, 64px vertical padding. Column headers in 16px Whyte Inktrap uppercase #ffffff, link lists in 13px Whyte Book #ffffff. Inverts the page's monochrome system without introducing any new color.

## Two-Radius System

The design uses exactly two border-radius values across every component: 50px for interactive elements (buttons, inputs, tags) and 16px for static surfaces (cards, images, containers). This binary is deliberate — it signals 'interactive vs. static' geometrically, so a user can tell what is clickable from radius alone. A card with a 4px corner says 'document'; a card with a 16px corner says 'product showcase'; a button with 50px says 'tap me.' Do not introduce 4px, 8px, or 24px radii — the system's restraint is the design.

## Similar Brands

- **Teenage Engineering** — Same Swiss-grotesque typography approach, monochrome product UI, and a single bold accent color used only on interactive surfaces.
- **Apple (product pages)** — Full-bleed product photography as the sole chromatic event, white canvas, hairline borders, and one restrained accent for CTA — same 'let the object be the hero' discipline.
- **Aesop** — Editorial minimalism, uppercase tracked navigation, product-centered photography on neutral backdrops, and a near-zero decorative color palette.
- **Hodinkee** — Pill-shaped CTAs, centered editorial section headers, and a two-radius system separating product surfaces from interactive elements.
- **Beosound (Bang & Olufsen product lines)** — Compact product grids, light-mode product photography, tight display typography, and a minimal monochrome-plus-accent palette.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-lime: #e3fc03;
  --color-obsidian: #000000;
  --color-graphite: #323232;
  --color-carbon: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-concrete: #e6e6e6;

  /* Typography — Font Families */
  --font-whyteregular: 'WhyteRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte: 'Whyte', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-book: 'Whyte Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-inktrap: 'Whyte Inktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.6;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.26px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: -0.64px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -0.38px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-68: 68px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-tags: 50px;
  --radius-cards: 16px;
  --radius-images: 16px;
  --radius-inputs: 50px;
  --radius-buttons: 50px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-concrete: #e6e6e6;
  --surface-voltage-lime: #e3fc03;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-lime: #e3fc03;
  --color-obsidian: #000000;
  --color-graphite: #323232;
  --color-carbon: #1a1a1a;
  --color-paper-white: #ffffff;
  --color-concrete: #e6e6e6;

  /* Typography */
  --font-whyteregular: 'WhyteRegular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte: 'Whyte', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-book: 'Whyte Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-inktrap: 'Whyte Inktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.6;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.26px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: -0.64px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -0.38px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-68: 68px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;
}
```
