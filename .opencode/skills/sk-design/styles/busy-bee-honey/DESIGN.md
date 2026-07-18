# Busy Bee Honey — Style Reference
> painted barn-side honey label — dark cocoa, gold, and blue stacked like a vintage billboard. Two sentence grounding: massive condensed serif display type bleeds edge-to-edge against solid color bands, and the bear-bottle product sits centered and unframed like the hero of a roadside sign.

**Theme:** mixed

Busy Bee Honey speaks in a roadside-Americana voice: full-bleed bands of dark cocoa, honeycomb gold, and cornflower blue, each separated by a scrolling marquee strip. Display headlines are enormous — up to 238px — in a condensed display serif with aggressive 0.80 line-height and slight negative tracking, so words like 'KNOW YOUR HONEY' loom like painted barn-side lettering. The product (the bear-shaped bottle) is the visual anchor: centered, unframed, full-bleed, no card chrome around it. Color blocks are flat, unshadowed, and contiguous — the design relies on brutal color contrast and type scale to create rhythm, not on elevation or container surfaces. Pills are the only shape language; everything else is rectangular and sectioned. The feel is less 'ecommerce product page' and more 'printed honey label folded into a billboard'.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Dark Cocoa | `#3b2722` | `--color-dark-cocoa` | Primary canvas for hero/header, body text on light surfaces, structural borders, dark CTA fills — the most-used chromatic color in the system, carrying 80%+ of text and border weight |
| Cream Parchment | `#f2ebd0` | `--color-cream-parchment` | Light canvas for alternate sections, text on dark canvases, hairline borders, card surfaces — the warm off-white that makes the dark cocoa feel like printed kraft paper |
| Charcoal | `#000000` | `--color-charcoal` | Hard-edge text and fine borders where absolute contrast is required |
| Honeycomb Gold | `#ffca50` | `--color-honeycomb-gold` | Filled CTA buttons on dark sections, full-bleed section canvas, nav fill — the most chromatic and warmest surface, used as functional punctuation against the brown |
| Barn Red | `#a0342a` | `--color-barn-red` | Red outline accent for tags, dividers, and focused UI edges. |
| Cornflower Blue | `#6aacc2` | `--color-cornflower-blue` | Marquee band background, secondary nav fill — the sky/honey-sky blue used as a thin chromatic strip between full-bleed color blocks |
| Sage Green | `#6fa162` | `--color-sage-green` | Subtle accent strip alongside the blue in marquee/decorative bands — an herb-garden green that keeps the blue from feeling isolated |

## Tokens — Typography

### TayMakawao — Mega-display headlines — 'KNOW YOUR HONEY'-scale type that bleeds edge to edge, set tight (0.80 lh) with -0.01em tracking so letterforms lock together like wooden cutout letters · `--font-taymakawao`
- **Substitute:** Playfair Display Black, Bodoni Moda 900, or DM Serif Display
- **Weights:** 400
- **Sizes:** 28px, 90px, 135px, 209px, 238px
- **Line height:** 0.80–1.00
- **Letter spacing:** -0.01em
- **Role:** Mega-display headlines — 'KNOW YOUR HONEY'-scale type that bleeds edge to edge, set tight (0.80 lh) with -0.01em tracking so letterforms lock together like wooden cutout letters

### Barkman Honey — Secondary display and large numerals — the 'honey drip' serif used for sub-headlines and hero subtext (e.g. 65px section titles), its warmer curves pair against TayMakawao's mechanical weight · `--font-barkman-honey`
- **Substitute:** DM Serif Display, Recoleta, or Fraunces 900
- **Weights:** 400
- **Sizes:** 13px, 16px, 24px, 65px
- **Line height:** 1.00
- **Role:** Secondary display and large numerals — the 'honey drip' serif used for sub-headlines and hero subtext (e.g. 65px section titles), its warmer curves pair against TayMakawao's mechanical weight

### TayBirdie — UI and small-body workhorse — nav links, footer text, micro-labels, and small caps. Normal tracking keeps it legible at small sizes; the tightest 1.00 lh is reserved for nav rows · `--font-taybirdie`
- **Substitute:** Inter, Sohne, or GT America
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 20px
- **Line height:** 1.00–1.50
- **Role:** UI and small-body workhorse — nav links, footer text, micro-labels, and small caps. Normal tracking keeps it legible at small sizes; the tightest 1.00 lh is reserved for nav rows

### Times New Roman — Fallback body text inside the system, also pulls double duty for italic-as-brand-voice moments where a system serif feels more honest than a designed face · `--font-times-new-roman`
- **Substitute:** Times New Roman (system)
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Fallback body text inside the system, also pulls double duty for italic-as-brand-voice moments where a system serif feels more honest than a designed face

### Anonymous Pro — Monospaced flavor for traceability codes, lot numbers, and any 'data' moment that should feel like a printed receipt — positive 0.031em tracking gives the text a stamped/inked feel · `--font-anonymous-pro`
- **Substitute:** IBM Plex Mono or JetBrains Mono
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.61
- **Letter spacing:** 0.031em
- **Role:** Monospaced flavor for traceability codes, lot numbers, and any 'data' moment that should feel like a printed receipt — positive 0.031em tracking gives the text a stamped/inked feel

### Arial — Button and micro-copy fallback — the utilitarian text inside pill buttons where neutrality beats the warmer display faces · `--font-arial`
- **Substitute:** Arial (system)
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Button and micro-copy fallback — the utilitarian text inside pill buttons where neutrality beats the warmer display faces

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.1 | — | `--text-heading-sm` |
| heading | 28px | 1 | — | `--text-heading` |
| heading-lg | 65px | 1 | — | `--text-heading-lg` |
| display | 90px | 0.82 | -0.9px | `--text-display` |
| display-lg | 135px | 0.8 | -1.35px | `--text-display-lg` |
| display-xl | 238px | 0.8 | -2.38px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 500px |
| cards | 0px |
| pills | 500px |
| buttons | 1000px |
| sections | 0px |

### Layout

- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Navigation Bar
**Role:** Top-level site navigation

Horizontal bar with Dark Cocoa (#3b2722) background and Cream Parchment (#f2ebd0) TayBirdie 12-14px nav links, all-caps. Links separated by 28-36px horizontal padding. No drop shadow; the dark band is the divider from the hero canvas below.

### Scrolling Marquee Band
**Role:** Section divider and emphasis strip

Full-bleed horizontal band in Cornflower Blue (#6aacc2), 40-64px tall, containing repeating TayMakawao 28px caps text in Dark Cocoa with small bee/ornament glyphs between phrases. Used to separate full-bleed color blocks. The animation is a left-to-right infinite scroll.

### Mega Display Headline
**Role:** Hero and feature section titles

TayMakawao Regular at 90-238px, line-height 0.80, letter-spacing -0.01em. Cream Parchment (#f2ebd0) when set on Dark Cocoa, Dark Cocoa when set on Honeycomb Gold. The text is allowed to bleed past container edges — it should never be constrained to a column.

### Section Subhead
**Role:** Supporting headline below mega display

Barkman Honey at 65px, line-height 1.00, set in Barn Red (#a0342a) on dark canvases or Dark Cocoa on light canvases. Used as the 'Trace Your Money'-style secondary statement.

### Pill CTA Button (Dark on Light)
**Role:** Primary action on gold/light sections

1000px border-radius pill, Dark Cocoa (#3b2722) fill, Cream Parchment (#f2ebd0) Arial 13px all-caps text with 0.24px tracking, 16px vertical × 24px horizontal padding. Optional right-arrow icon in 14px. The dark-on-light inversion is reserved for the gold band.

### Pill CTA Button (Yellow on Dark)
**Role:** Primary action on dark sections

1000px border-radius pill, Honeycomb Gold (#ffca50) fill, Dark Cocoa text, identical sizing to the dark variant. Use this on Dark Cocoa or Cornflower Blue sections; the yellow fill reads as the warmest, most action-oriented moment in the system.

### Product Hero Bottle
**Role:** Centered product showcase within a hero section

The bear-shaped bottle is rendered at full product photo scale, centered horizontally, no container, no card. It sits in front of whatever full-bleed color the section is using. No drop shadow — the bottle IS the focal point, not a framed object.

### Circular Badge / Trace Seal
**Role:** Decorative stamp element

Small (~80-100px) circular Cornflower Blue badge with TayBirdie 12-14px caps text wrapping the circumference, mounted to the upper-left of a subhead like a wax seal. Functions as a heritage/authenticity mark.

### Bee Glyph
**Role:** Decorative motif

Small line-art bee icon (stroke ~1.5px) in Dark Cocoa, used as a visual period between marquee phrases and as a tiny inline accent next to short labels. Never colored — always Dark Cocoa or Cream Parchment on the parent surface.

### Full-Bleed Color Section
**Role:** Page-level section container

Each section extends edge-to-edge in a single solid color — Dark Cocoa, Honeycomb Gold, or Cornflower Blue. Sections abut with no gap, no divider, no border. Internal vertical padding 40-64px on the content block, which itself is centered and may be 8-12 columns wide.

### Footer
**Role:** Site-level footer

Dark Cocoa (#3b2722) background, TayBirdie 12-14px Cream Parchment links in horizontal rows. Mirrors the nav's tone but at smaller type and lower contrast. Occasionally a Honeycomb Gold accent strip caps it.

## Do's and Don'ts

### Do
- Set mega display at 90px or larger with line-height 0.80-0.82 and letter-spacing -0.01em — anything taller than body, anything less tight, and the headline stops sounding like billboard lettering
- Let every primary action be a 1000px-radius pill; never round the corners partially
- Use full-bleed color sections (Dark Cocoa, Honeycomb Gold, Cornflower Blue) with no inter-section gap — the seam between colors is the layout
- Place the product photo centered and unframed; never wrap it in a card, never add a shadow, never constrain it to a column
- Invert CTA fill against the section it's on: dark pill on gold, gold pill on dark — never a dark pill on dark
- Use the blue (#6aacc2) only as a marquee band or thin strip — it is a divider color, not a surface
- Reserve the barkmanhoney 65px subhead for the second-most-important line on a section; don't promote it above the TayMakawao display

### Don't
- Don't introduce drop shadows, glows, or any z-axis elevation — the system is deliberately flat
- Don't set display type with line-height ≥ 1.0; tight leading is the signature, not an accident
- Don't put a card, border, or container around the hero product — the bottle sits on the canvas
- Don't use white (#ffffff) for canvas; the cream (#f2ebd0) is warmer and intentional
- Don't use a sans-serif display face — the system only works with the condensed serif 'painted sign' attitude
- Don't use Sage Green (#6fa162) for text or buttons — it is a marquee-strip accent only
- Don't break the full-bleed section into a max-width container with side gutters — bleed to the edge or it loses the billboard quality

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Dark Cocoa Canvas | `#3b2722` | Primary hero and dark section background — the page's most prominent canvas |
| 1 | Honeycomb Gold Section | `#ffca50` | Full-bleed alternate section background for feature/CTA areas |
| 2 | Cornflower Marquee | `#6aacc2` | Thin horizontal band used as a sectional divider with scrolling text |
| 3 | Cream Parchment | `#f2ebd0` | Light text and hairline borders, occasionally inverted as a small content surface |

## Elevation

The system is deliberately flat. No drop shadows, no glow, no z-axis depth. Hierarchy is built from full-bleed color contrast and the 10x jump from body to display type. Where other systems would lift a card with a soft shadow, this design shifts the background from Dark Cocoa to Honeycomb Gold — the elevation is the color, not the shadow.

## Imagery

Product-only photography: the bear-shaped honey bottle, centered, on flat color, with no lifestyle context, no hands, no kitchen backdrop, no people. The bottle's own label (blue sky, red 'AMERICA'S TRULY TRACEABLE' wordmark, bee mascot) carries all secondary visual interest. Treatments are sharp and high-contrast — the amber honey against the dark cocoa reads as a single saturated object. Decorative motifs are line-art bee glyphs (~1.5px stroke) in Dark Cocoa or Cream Parchment, used sparingly as period marks. No illustration, no abstract graphics, no 3D renders beyond the product photo itself. Imagery density is low-to-moderate: the bottle occupies roughly the central third of the hero, with massive type and solid color providing the rest.

## Layout

Full-bleed edge-to-edge: there is no page max-width and no centered gutter. Sections are solid color blocks that butt directly against each other, separated either by a 40-64px Cornflower Blue marquee band or by an immediate color change. Hero pattern: mega display headline at the very top of the viewport (90-238px) with a centered product photo filling the lower two-thirds. No split-screen, no sidebar, no asymmetric grid at the page level — content is center-aligned. Section rhythm alternates Dark Cocoa → Honeycomb Gold → Dark Cocoa → Blue marquee → Dark Cocoa, with a marquee strip inserted between roughly every two colored bands. Navigation is a thin horizontal bar across the top. Grids are minimal because there are no card grids — the few multi-column moments are 2- and 3-column text stacks within a section, separated by 28-36px gaps. Density is generous: a section rarely contains more than one headline + one paragraph + one CTA, with 40-64px of internal vertical padding.

## Agent Prompt Guide

**Quick Color Reference**
- text: #3b2722 (on light) / #f2ebd0 (on dark)
- background: #3b2722 (dark canvas) / #ffca50 (gold section) / #6aacc2 (marquee strip)
- border: #3b2722
- accent: #a0342a (barn red — subhead emphasis)
- primary action: #ffca50 (filled action)

**Example Component Prompts**
1. *Hero section*: Full-bleed Dark Cocoa (#3b2722) canvas. Centered TayMakawao 209px / line-height 0.80 / letter-spacing -2.09px headline in Cream Parchment (#f2ebd0) that bleeds past the viewport. Centered product photo of the bear bottle at 50% viewport height, no border, no shadow, sitting on the cocoa canvas.
2. *Gold feature section*: Full-bleed Honeycomb Gold (#ffca50) canvas, 40px internal top/bottom padding. Left-aligned Barkman Honey 65px / line-height 1.0 subhead in Barn Red (#a0342a), a small Cornflower Blue circular trace badge above it. Dark Cocoa pill CTA (1000px radius, 16px × 24px padding, Arial 13px caps in #f2ebd0) with a right-arrow icon.
3. *Marquee band*: Full-bleed Cornflower Blue (#6aacc2) strip, 56px tall. Inline TayMakawao 28px / line-height 1.0 caps text in Dark Cocoa repeating 'MADE IN THE USA' separated by a 14px Dark Cocoa bee glyph, animated left-to-right infinite scroll.
4. *Mega display headline*: TayMakawao 135px / line-height 0.82 / letter-spacing -1.35px, color Cream Parchment (#f2ebd0), set on a Dark Cocoa (#3b2722) full-bleed section. Text overflows its container horizontally — do not constrain.
5. *Navigation bar*: Dark Cocoa (#3b2722) background, full-width, 20px vertical padding. TayBirdie 12px all-caps links in Cream Parchment (#f2ebd0), separated by 36px horizontal padding, distributed across a single row.

## Similar Brands

- **Beekman's 1802** — Same vintage-heritage Americana language — warm earthy palette, condensed serif display type, full-bleed color blocks, and pill-shaped CTA buttons
- **Recess** — Product-foreground hero on flat color, oversized condensed display headline, and a 1970s health-food-store palette of brown, gold, and pastel blue
- **Burlap & Barrel** — Single-color backgrounds, serif display type at extreme sizes, and a hand-stamped product-label mood without card chrome
- **Wildway** — Direct-to-consumer food brand using flat earth-toned color blocks, pill buttons, and condensed serif headlines as the primary visual device

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-dark-cocoa: #3b2722;
  --color-cream-parchment: #f2ebd0;
  --color-charcoal: #000000;
  --color-honeycomb-gold: #ffca50;
  --color-barn-red: #a0342a;
  --color-cornflower-blue: #6aacc2;
  --color-sage-green: #6fa162;

  /* Typography — Font Families */
  --font-taymakawao: 'TayMakawao', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-barkman-honey: 'Barkman Honey', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-taybirdie: 'TayBirdie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-anonymous-pro: 'Anonymous Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --text-heading: 28px;
  --leading-heading: 1;
  --text-heading-lg: 65px;
  --leading-heading-lg: 1;
  --text-display: 90px;
  --leading-display: 0.82;
  --tracking-display: -0.9px;
  --text-display-lg: 135px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -1.35px;
  --text-display-xl: 238px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -2.38px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Layout */
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-3xl: 42.75px;
  --radius-full: 500px;
  --radius-full-2: 1000px;

  /* Named Radii */
  --radius-tags: 500px;
  --radius-cards: 0px;
  --radius-pills: 500px;
  --radius-buttons: 1000px;
  --radius-sections: 0px;

  /* Surfaces */
  --surface-dark-cocoa-canvas: #3b2722;
  --surface-honeycomb-gold-section: #ffca50;
  --surface-cornflower-marquee: #6aacc2;
  --surface-cream-parchment: #f2ebd0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-dark-cocoa: #3b2722;
  --color-cream-parchment: #f2ebd0;
  --color-charcoal: #000000;
  --color-honeycomb-gold: #ffca50;
  --color-barn-red: #a0342a;
  --color-cornflower-blue: #6aacc2;
  --color-sage-green: #6fa162;

  /* Typography */
  --font-taymakawao: 'TayMakawao', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-barkman-honey: 'Barkman Honey', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-taybirdie: 'TayBirdie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-anonymous-pro: 'Anonymous Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.1;
  --text-heading: 28px;
  --leading-heading: 1;
  --text-heading-lg: 65px;
  --leading-heading-lg: 1;
  --text-display: 90px;
  --leading-display: 0.82;
  --tracking-display: -0.9px;
  --text-display-lg: 135px;
  --leading-display-lg: 0.8;
  --tracking-display-lg: -1.35px;
  --text-display-xl: 238px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -2.38px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-3xl: 42.75px;
  --radius-full: 500px;
  --radius-full-2: 1000px;
}
```
