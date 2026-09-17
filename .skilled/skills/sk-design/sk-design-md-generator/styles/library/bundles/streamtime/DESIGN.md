# Streamtime — Style Reference
> Tactile creative moodboard — designer scrapbook desk

**Theme:** light

Streamtime reads like a creative agency scrapbook rendered in software: a warm cream canvas (#f1e8de) holds the page together while a small arsenal of vivid accent colors — sun yellow, hot pink, lime, blue, green — explode across cards, buttons, and decorative shapes like paper cutouts. Typography does the heavy lifting: both Ease Standard and Ease Display run at a single 400 weight, so hierarchy is built through scale (12px body to 100px display) and tight negative tracking, not through bolding. The system alternates between light editorial sections and one dramatic near-black (#2f2c29) hero band, creating a print-magazine rhythm. Surfaces stay mostly flat with hairline black borders and soft warm shadows rather than elevations; the only round elements are large pill buttons (96-160px radius) that feel like sticker labels pressed onto a page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sun Yellow | `#ffde3b` | `--color-sun-yellow` | Primary action buttons, card highlights, decorative shapes, the signature pop — the only color with true filled-button authority |
| Hot Pink | `#ff4dd5` | `--color-hot-pink` | Decorative borders, accent shapes, image overlays — used as visual punctuation, never as fill |
| Lime Burst | `#c1f32b` | `--color-lime-burst` | Decorative strokes, border accents, secondary highlight — energetic counterweight to Sun Yellow |
| Periwinkle | `#6483ff` | `--color-periwinkle` | Card background, secondary action — the cool blue in an otherwise warm palette |
| Spring Green | `#c6dc3c` | `--color-spring-green` | Card backgrounds, nav highlights — warmer, more muted companion to Lime Burst |
| Bubblegum | `#ee84d5` | `--color-bubblegum` | Soft pink accent for secondary nav elements and tag pills |
| Warm Linen | `#f1e8de` | `--color-warm-linen` | Primary page canvas, soft shadow color, border tint — the warm cream that holds the whole system together |
| Paper White | `#fbf8f5` | `--color-paper-white` | Card surfaces, elevated content blocks — barely warmer than pure white, just enough to feel like paper |
| Pure White | `#ffffff` | `--color-pure-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Charcoal | `#2f2c29` | `--color-charcoal` | Dark hero section background, high-contrast text container — not pure black, a warmer near-black |
| Stone | `#c3b7ac` | `--color-stone` | Muted card backgrounds, secondary surfaces, neutral button fills |
| Sand | `#eadcce` | `--color-sand` | Warm neutral for soft fills, secondary card backgrounds |
| Ink | `#000000` | `--color-ink` | Primary text, hairline borders, icon strokes, logo — the structural color, used at extreme scale |
| Fog | `#999999` | `--color-fog` | Muted borders, secondary dividers, disabled states |

## Tokens — Typography

### Ease Standard — Body, nav, labels, captions, button text — the workhorse at a single 400 weight with tight negative tracking · `--font-ease-standard`
- **Substitute:** Inter, Söhne, GT America Standard
- **Weights:** 400
- **Sizes:** 12px, 16px, 18px
- **Line height:** 1.10-1.20
- **Letter spacing:** -0.0600em to -0.0800em
- **Role:** Body, nav, labels, captions, button text — the workhorse at a single 400 weight with tight negative tracking

### Ease Display — Display headlines, hero text, section titles, decorative logo — runs at 400 weight only, so display impact comes from extreme scale (up to 100px) and tight tracking, never from bolding · `--font-ease-display`
- **Substitute:** Inter Display, Söhne Breit, GT America Compressed
- **Weights:** 400
- **Sizes:** 16px, 28px, 30px, 68px, 100px
- **Line height:** 1.00-1.20
- **Letter spacing:** -0.0140em to -0.0600em
- **Role:** Display headlines, hero text, section titles, decorative logo — runs at 400 weight only, so display impact comes from extreme scale (up to 100px) and tight tracking, never from bolding

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.96px | `--text-caption` |
| body | 16px | 1.2 | -1.28px | `--text-body` |
| body-lg | 18px | 1.2 | -1.44px | `--text-body-lg` |
| subheading | 28px | 1.1 | -1.6px | `--text-subheading` |
| heading | 30px | 1.1 | -1.02px | `--text-heading` |
| heading-lg | 68px | 1 | -2.31px | `--text-heading-lg` |
| display | 100px | 1 | -1.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 5px |
| cards | 5px |
| buttons | 96px |
| primaryAction | 160px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.13) 1px 0px 5px 0px, rgba(0, 0, 0, 0.08) ...` | `--shadow-sm` |
| md | `rgba(115, 115, 115, 0.16) 0px 3px 10px 0px, rgba(115, 115...` | `--shadow-md` |
| sm-2 | `rgba(0, 0, 0, 0.08) 2px 2px 4px 1px, rgba(0, 0, 0, 0.13) ...` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20-30px
- **Element gap:** 16-24px

## Components

### Primary CTA Pill (Book a demo)
**Role:** Main conversion action

Sun Yellow (#ffde3b) fill, black text in Ease Standard 16px/400, fully rounded at 160px radius, approximately 16px 24px padding. This is the system's only high-confidence filled action — it glows against the warm linen canvas.

### Ghost Pill Button (Log in, Sign up)
**Role:** Secondary navigation actions

Pure White (#ffffff) fill, 1px black border, black Ease Standard text 16px/400, 96px radius, approximately 8px 20px padding. Sits beside the yellow CTA as a quiet alternative.

### Menu Button
**Role:** Primary navigation trigger

Black (#000000) fill, white text 'Menu' in Ease Standard, 5px radius (not pill — the only squared nav element), with a yellow circular logo badge to the left.

### Article Card
**Role:** Content card in editorial grids

Colored fill background (lime #c1f32b, yellow #ffde3b, periwinkle #6483ff, or sand #eadcce), image with 5px radius border, 20-30px internal padding, black Ease Standard body text at 16-18px below. No shadow, no border — the color IS the container.

### White Content Card
**Role:** Elevated content on warm canvas

Paper White (#fbf8f5) or Pure White fill, 5px radius, 20-30px padding, no visible border. Distinguished from the cream canvas by tonal step, not by outline.

### Dark Editorial Section
**Role:** Alternating dark content band

Charcoal (#2f2c29) background, white Ease Standard body text at 16-18px with tight tracking, decorative collage elements (circles, triangles, textured paper shapes) in the full accent palette scattered as atmosphere. This is the system's only dark surface and should appear sparingly for rhythm.

### Tag Pill
**Role:** Category labels and small accents

5px radius, 4-8px padding, Ease Standard 12px/400, typically on colored backgrounds (Stone, Bubblegum, or Spring Green). Small, quiet, functional.

### Decorative Shape Element
**Role:** Brand personality and page atmosphere

Hand-drawn-feeling shapes — zigzag, triangle, circle, starburst, textured paper swatches — in the full accent palette. These are NOT icons; they are atmosphere. Appear around the wordmark, in dark sections, and as card decorations.

### Display Wordmark
**Role:** Brand identity element

Ease Display at 100px/400, letter-spacing -0.014em, pure black. Each letter can be individually decorated with a shape or texture from the accent palette. This treatment should not be used for regular headings — reserved for the brand mark only.

### Section Heading
**Role:** Section titles in content flow

Ease Display at 28-30px/400, letter-spacing -0.034em to -0.060em, pure black, centered or left-aligned depending on section rhythm. No bolding — the size and tight tracking carry the weight.

### Hairline Divider
**Role:** Content separation without visual noise

1px black or fog (#999999) horizontal line, no spacing buffer. Used sparingly; the warm canvas and tonal surface steps do most of the separation work.

## Do's and Don'ts

### Do
- Use Sun Yellow (#ffde3b) as the only filled primary action button color — it carries the system's entire conversion hierarchy.
- Build all typography hierarchy through size and tracking, never through font weight — both Ease faces are 400 only.
- Apply 5px radius to all cards, tags, and rectangular elements; reserve 96-160px pill radius exclusively for buttons and nav controls.
- Let the warm linen canvas (#f1e8de) breathe — avoid adding background colors to sections that could sit on the cream.
- Use accent colors (pink, lime, periwinkle, green) as decorative borders, shape fills, and card backgrounds — never for text or primary actions.
- Place one Charcoal (#2f2c29) dark editorial section per page for rhythm, decorated with collage shapes in the full accent palette.
- Set display text at 68-100px with line-height 1.0 and letter-spacing -0.014em to -0.060em — the tight tracking is what makes the system feel editorial.

### Don't
- Do not introduce a bold or semibold weight — neither font family supports it; the system is deliberately 400-weight-only.
- Do not use Hot Pink, Lime Burst, or Periwinkle as primary CTA fills — they are decorative accents, not action colors.
- Do not add drop shadows to cards or content blocks — the system uses tonal surface steps and warm-tinted shadows only, on nav and floating panels.
- Do not use pure white (#ffffff) for card surfaces on the warm canvas — use Paper White (#fbf8f5) to maintain the paper-like tonal progression.
- Do not apply large border-radius to cards or images — 5px is the structural radius; pill shapes are button-exclusive.
- Do not stack multiple dark sections consecutively — one Charcoal section per page, surrounded by warm light sections.
- Do not use blue/cool tones for body text or large surfaces — the palette is warm-first, with periwinkle as a single cool accent only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Warm Linen | `#f1e8de` | Page canvas — the warm cream that defines the entire system |
| 2 | Paper White | `#fbf8f5` | Card and content block surface — a single step lighter than canvas |
| 3 | Pure White | `#ffffff` | Inverted elements, pill buttons, clean section breaks |
| 4 | Charcoal | `#2f2c29` | Dark dramatic section — editorial contrast break |

## Elevation

- **Navigation:** `rgba(0, 0, 0, 0.13) 1px 0px 5px 0px, rgba(0, 0, 0, 0.08) 2px 2px 4px 1px`
- **Floating panels:** `rgba(115, 115, 115, 0.16) 0px 3px 10px 0px, rgba(115, 115, 115, 0.16) 0px 2px 4px 0px`

## Imagery

Imagery is collage-driven and tactile: real photography (candid workspace shots, portraits, product stills) mixed with hand-cut shape elements — circles, triangles, zigzags, starbursts, textured paper swatches — in the full accent palette. Photos appear in two treatments: raw editorial crops (people, environments) and rounded-rectangle containers (5px radius) inside colored card fills. The visual language is craft/print-zine: nothing is clean SaaS stock. Shapes sit over, beside, and behind photos as overlapping layers. Icons are minimal and appear mostly as SVG strokes; the decorative shapes carry the brand personality far more than iconography. Density varies: dark sections are image-rich with collage layering, light card grids are image-in-card with generous whitespace around the grid.

## Layout

Page layout is centered and editorial, max-width ~1200px. The hero is a full-width white section with centered tagline text and the large decorated wordmark below. One dark Charcoal editorial section follows, with asymmetric collage layout (photos and shapes scattered, text in a centered column). Content sections are white with centered headings and 4-column card grids for articles/resources. The navigation is a minimal top bar: logo + Menu button on the left, pill buttons (Log in, Book a demo, Sign up) on the right. Section rhythm alternates light → dark editorial → light card grid, with 64px+ vertical gaps between sections. No sidebar, no mega-menu, no sticky behavior beyond the nav's own shadow.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Ink)
- background: #f1e8de (Warm Linen)
- card surface: #fbf8f5 (Paper White)
- border: #000000 (1px hairline)
- primary action: #ffde3b (filled action)
- dark section: #2f2c29 (Charcoal)

Example Component Prompts:

1. Create the hero section: Warm Linen (#f1e8de) canvas, centered tagline 'A way better way of working' in Ease Display 30px/400 black, letter-spacing -1.02px. Below: the wordmark 'STREAMTIME' in Ease Display 100px/400 black, letter-spacing -1.4px, line-height 1.0, with each letter decorated by a different accent shape (yellow circle, pink triangle, lime starburst, periwinkle rectangle, textured paper swatch).

2. Create a primary CTA button: Sun Yellow (#ffde3b) fill, black text 'Book a demo' in Ease Standard 16px/400 with letter-spacing -1.28px, 160px border-radius, 16px 24px padding, no shadow. Pairs with a ghost pill beside it: white fill, 1px black border, 96px radius.

3. Create the dark editorial section: Charcoal (#2f2c29) full-width background, white body text in Ease Standard 18px/400, letter-spacing -1.44px, line-height 1.2. Decorate with scattered collage elements: a 120px yellow circle, a pink triangle, a blue textured rectangle, a white zigzag line, and two circular photo crops (portraits) overlapping the shapes.

4. Create a 4-column article card grid: each card has a different colored fill — Lime (#c1f32b), Sun Yellow (#ffde3b), Periwinkle (#6483ff), Sand (#eadcce). Each card contains a rectangular image (5px radius), 20-30px internal padding, and a headline + byline in Ease Standard 16px/400 black below the image. No borders, no shadows — the color fill IS the container.

5. Create a section heading: centered text in Ease Display 30px/400 black, letter-spacing -1.02px, with no bolding, no underline, and no decorative element. Let the size and tight tracking carry the weight.

## Similar Brands

- **Notion** — Both use a warm neutral canvas with tight-tracked sans-serif at 400-weight only, building hierarchy through scale not bolding
- **Ableton** — Same creative-tools audience and collage-meets-software visual language mixing real photography with abstract decorative shapes
- **Mailchimp** — Playful illustration-and-shape decoration layered over a clean content grid, with vivid accent colors used as personality rather than utility
- **Kozmos** — Editorial print-zine sensibility — warm cream canvas, small-radius cards, and decorative shape elements that feel hand-cut rather than UI-generated

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sun-yellow: #ffde3b;
  --color-hot-pink: #ff4dd5;
  --color-lime-burst: #c1f32b;
  --color-periwinkle: #6483ff;
  --color-spring-green: #c6dc3c;
  --color-bubblegum: #ee84d5;
  --color-warm-linen: #f1e8de;
  --color-paper-white: #fbf8f5;
  --color-pure-white: #ffffff;
  --color-charcoal: #2f2c29;
  --color-stone: #c3b7ac;
  --color-sand: #eadcce;
  --color-ink: #000000;
  --color-fog: #999999;

  /* Typography — Font Families */
  --font-ease-standard: 'Ease Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ease-display: 'Ease Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.96px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -1.28px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -1.44px;
  --text-subheading: 28px;
  --leading-subheading: 1.1;
  --tracking-subheading: -1.6px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -1.02px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.31px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -1.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20-30px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-full: 96px;
  --radius-full-2: 160px;

  /* Named Radii */
  --radius-tags: 5px;
  --radius-cards: 5px;
  --radius-buttons: 96px;
  --radius-primaryaction: 160px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.13) 1px 0px 5px 0px, rgba(0, 0, 0, 0.08) 2px 2px 4px 1px;
  --shadow-md: rgba(115, 115, 115, 0.16) 0px 3px 10px 0px, rgba(115, 115, 115, 0.16) 0px 2px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.08) 2px 2px 4px 1px, rgba(0, 0, 0, 0.13) 1px 0px 5px 0px;

  /* Surfaces */
  --surface-warm-linen: #f1e8de;
  --surface-paper-white: #fbf8f5;
  --surface-pure-white: #ffffff;
  --surface-charcoal: #2f2c29;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sun-yellow: #ffde3b;
  --color-hot-pink: #ff4dd5;
  --color-lime-burst: #c1f32b;
  --color-periwinkle: #6483ff;
  --color-spring-green: #c6dc3c;
  --color-bubblegum: #ee84d5;
  --color-warm-linen: #f1e8de;
  --color-paper-white: #fbf8f5;
  --color-pure-white: #ffffff;
  --color-charcoal: #2f2c29;
  --color-stone: #c3b7ac;
  --color-sand: #eadcce;
  --color-ink: #000000;
  --color-fog: #999999;

  /* Typography */
  --font-ease-standard: 'Ease Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ease-display: 'Ease Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.96px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -1.28px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -1.44px;
  --text-subheading: 28px;
  --leading-subheading: 1.1;
  --tracking-subheading: -1.6px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -1.02px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.31px;
  --text-display: 100px;
  --leading-display: 1;
  --tracking-display: -1.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-full: 96px;
  --radius-full-2: 160px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.13) 1px 0px 5px 0px, rgba(0, 0, 0, 0.08) 2px 2px 4px 1px;
  --shadow-md: rgba(115, 115, 115, 0.16) 0px 3px 10px 0px, rgba(115, 115, 115, 0.16) 0px 2px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.08) 2px 2px 4px 1px, rgba(0, 0, 0, 0.13) 1px 0px 5px 0px;
}
```
