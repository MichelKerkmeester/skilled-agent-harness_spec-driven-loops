# Nornorm — Style Reference
> Scandinavian showroom, cobalt punctuation — a white-walled furniture gallery where one deep blue stroke cuts through warm bone and ink.

**Theme:** light

Nornorm's visual system is a near-monochromatic Scandinavian showroom: a white canvas warmed by a bone surface, a single deep cobalt as the only chromatic voice, and a custom geometric typeface (Lunar) tracked tight at -0.03em across every size. The discipline is rationed color — the cobalt appears only on the logo, the primary CTA, and the active state, everything else lives in grayscale. Photography carries the brand's emotional weight: full-bleed editorial interiors, warm leather textures, sculptural paper-craft vignettes, and living office scenes do the storytelling so the interface can stay quiet. Components are flat, pill-shaped, and borderless — a cobalt-filled button next to a dark ghost button, no shadows, no gradients, no decoration beyond generous whitespace and a single accent.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surfaces, button text on cobalt, nav background, image backgrounds |
| Bone | `#f1efe9` | `--color-bone` | Warm off-white surface for section bands, feature card panels, and soft contrast zones against pure white |
| Ash | `#ececec` | `--color-ash` | Subtle elevated surface and neutral button fill for low-emphasis controls |
| Stone | `#6a6a6a` | `--color-stone` | Secondary body text, helper copy, nav muted labels, and dividers — the warm mid-gray that gives body text hierarchy without competing with the brand accent |
| Graphite | `#333333` | `--color-graphite` | Hairline borders and structural dividers |
| Ink | `#1f1d1e` | `--color-ink` | Slightly warm near-black for body and heading text — a softer alternative to pure black that matches the warm bone surface |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, nav text, strong borders, and the ghost button outline — the typographic workhorse |
| Cobalt Ink | `#1e37a0` | `--color-cobalt-ink` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### Lunar — Single-family geometric sans used for everything from 14px nav labels to 112px hero display. The tight universal tracking of -0.03em is the signature — it tightens every size equally, so body text feels editorial and display text feels architectural rather than decorative. Weight 500 carries body emphasis, weight 700 is reserved for numbered list items and UI labels. · `--font-lunar`
- **Substitute:** Söhne, Inter, Neue Haas Grotesk
- **Weights:** 400, 500, 700
- **Sizes:** 14, 16, 20, 24, 32, 48, 64, 80, 112
- **Line height:** 1.00 (display) / 1.30 (body & UI)
- **Letter spacing:** -0.03em constant across all sizes
- **Role:** Single-family geometric sans used for everything from 14px nav labels to 112px hero display. The tight universal tracking of -0.03em is the signature — it tightens every size equally, so body text feels editorial and display text feels architectural rather than decorative. Weight 500 carries body emphasis, weight 700 is reserved for numbered list items and UI labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.3 | -0.42px | `--text-caption` |
| body-sm | 16px | 1.3 | -0.48px | `--text-body-sm` |
| body | 20px | 1.3 | -0.6px | `--text-body` |
| subheading | 24px | 1.3 | -0.72px | `--text-subheading` |
| heading-sm | 32px | 1.3 | -0.96px | `--text-heading-sm` |
| heading | 48px | 1 | -1.44px | `--text-heading` |
| heading-lg | 64px | 1 | -1.92px | `--text-heading-lg` |
| display | 112px | 1 | -3.36px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 112 | 112px | `--spacing-112` |
| 140 | 140px | `--spacing-140` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 8px |
| links | 8px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Filled action button for the main conversion on each page

Pill shape (9999px radius), background #1e37a0 Cobalt Ink, text #ffffff, Lunar 16px weight 500, padding 12px 24px, letter-spacing -0.48px. The only filled-color button in the system; everything else is neutral or outlined. No border, no shadow.

### Ghost Button
**Role:** Secondary action that pairs with a primary CTA

Pill shape (9999px radius), transparent background, 1px border #000000 Obsidian, text #000000, Lunar 16px weight 500, padding 12px 24px. Always used alongside the Primary CTA to offer an alternative path without competing for visual weight.

### Nav Link
**Role:** Top navigation menu items with optional dropdown caret

Lunar 16px weight 500, text #000000 Obsidian, 8px radius on clickable area, 24px horizontal padding. Dropdown items appear on hover with a 4px caret indicator. The nav sits on white with no background treatment.

### Logo Wordmark
**Role:** Brand identifier in the top-left of every page

NORNORM stacked in two lines, Lunar 20px weight 700, letter-spacing -0.60px, color #1e37a0 Cobalt Ink. The two-line stacking and cobalt color make it a brand mark, not a plain text logo.

### Language Switcher
**Role:** Globe icon + region label in the top-right nav

Globe icon (16px) in #000000, followed by Lunar 16px weight 500 text 'Global (EN)'. Sits inline with the CTA buttons at the right edge of the nav.

### Hero Overlay
**Role:** Full-bleed photographic hero with centered text block

Full-viewport image (leather furniture close-up) with no separate overlay color — the image's own dark tones carry the text contrast. Centered headline in Lunar 48–64px weight 400, color #ffffff, max-width ~800px. Body subtext at 20px weight 400 #ffffff. CTA pair centered below: Primary CTA on the left, Ghost Button on the right, 16px gap.

### Client Logo Strip
**Role:** Social proof band directly under the hero

White background, single line of grayscale client logos (Eidra, Netflix, Covivio, Booking.com, Electrolux, BCG, Klarna, Miro) at uniform height ~24px, evenly distributed across the full content width. No borders, no cards — logos sit directly on white at ~60% opacity to read as secondary.

### Feature Card
**Role:** 4-column grid item in the 'Why Subscribe' section

Vertical stack on a white background: square or 4:3 image at top (no border-radius — images stay sharp-edged), Lunar 20px weight 700 numbered label '01.' in #000000, heading at 20px weight 500 #000000, body copy at 16px weight 400 #6a6a6a Stone. No card chrome, no shadow, no border — the image is the visual frame.

### Section Header
**Role:** Centered title block for content sections

Centered alignment, Lunar 48px weight 400 heading #000000, optional subheading at 20px weight 400 #6a6a6a Stone directly below, 64px bottom margin to the content. No decorative element — the whitespace and centered type are the entire header.

### Image Gallery Carousel
**Role:** Full-bleed horizontal photo strip showing client office spaces

Five large vertical photographs (portrait orientation, ~3:4) at equal widths, edge-to-edge with no gaps, contained in a horizontal scroll container with circular prev/next arrow buttons (40px, #000000 on white) floating at the bottom-right. No captions, no borders.

### Gallery CTA Link
**Role:** Text link to enter a full gallery view

Outlined pill button style (Ghost Button pattern but smaller) or a simple underlined text link 'Explore client gallery' at 16px weight 500 #000000, positioned bottom-left of the gallery section.

### Carousel Nav Button
**Role:** Circular prev/next controls for image carousels

40px circle, background #ffffff, 1px border #e5e5e5, center-aligned chevron icon in #000000, 8px internal padding. Two buttons stacked horizontally with 8px gap.

## Do's and Don'ts

### Do
- Use Lunar at every size with -0.03em letter-spacing — the universal tracking is the brand's typographic signature, not optional
- Use Cobalt Ink (#1e37a0) only for the logo wordmark, primary filled CTA buttons, and active states — never as a background fill, icon color, or decorative accent
- Pair every Primary CTA with a Ghost Button beside it: the two-button pattern is the system's standard conversion unit
- Use 9999px radius on all buttons, tags, and pill controls — there is no rounded-corner alternative in the system
- Use 8px radius for image-less cards and content containers; leave photographic content with sharp 0px edges so the images read as full-bleed editorial
- Build section backgrounds from Canvas White (#ffffff) and Bone (#f1efe9) only — never introduce a new tint
- Use 16px or 24px as the gap between text and its adjacent control; 48px between stacked text blocks; 80px between sections

### Don't
- Do not introduce a second chromatic color — the system's authority comes from a single accent against monochrome
- Do not use shadows, glows, or any box-shadow on cards, buttons, or modals — the system is deliberately flat
- Do not use a filled neutral button (gray, black, or bone) as a primary action — the only filled button is Cobalt Ink on white
- Do not break the -0.03em letter-spacing at any size, including body copy and captions — looser tracking reads as a different typeface
- Do not add borders to feature cards, image containers, or section bands — the warm white-to-bone contrast carries separation
- Do not use gradients on backgrounds, buttons, or text — the palette has no gradient tokens and adding one would break the Scandinavian restraint
- Do not round the corners of large photographs, hero images, or gallery images — editorial content stays sharp-edged to contrast with the pill-shaped UI controls

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background and most card surfaces |
| 1 | Bone Band | `#f1efe9` | Warm section background and feature card panel for visual warmth without leaving the neutral palette |
| 2 | Ash Plate | `#ececec` | Subtle elevation layer and low-emphasis button surface |
| 3 | Cobalt Accent | `#1e37a0` | Brand action surface — pill button fill and logo |

## Elevation

No shadows. The system is deliberately flat — surfaces are distinguished by the warm bone (#f1efe9) tint against pure white, never by cast shadow. Photography and the cobalt accent do all the visual work that elevation would otherwise do. Even buttons sit flat: the pill shape and color contrast carry the affordance, not a drop shadow.

## Imagery

Photography is the brand's primary expressive medium. The hero is a full-bleed extreme close-up of warm brown leather furniture — texture, not product showcase. The 'Why Subscribe' section uses a different visual mode: sculptural white paper-craft vignettes (a chair coin, a folded sofa, an origami forest) shot on a pale surface with soft shadows, rendered in monochrome white. The client gallery is full-color editorial interior photography: real offices with natural light, plants, textiles, and people at work, shot in a lifestyle-documentary register rather than staged commercial. All imagery avoids the chrome of catalog photography — no white seamless backdrops, no floating products, no studio lights. The visual rule: if a photograph could appear in a Kinfolk magazine spread, it belongs here.

## Layout

Page-level layout follows a full-bleed hero → max-width content → full-bleed gallery pattern. The hero is a full-viewport image with centered text overlay (no max-width on the image, but the text block is constrained to ~800px). Below the hero, the client logo strip runs edge-to-edge. The 'Why Subscribe' section uses a max-width of ~1280px centered, with a 4-column equal grid of feature cards. Section headers are always centered, never left-aligned. The client gallery breaks back to full-bleed for its image carousel. Vertical rhythm is generous: 80px between sections, 48px between content blocks within a section, 24px between heading and body. The overall density reads as spacious and editorial — this is a brand that wants to breathe, not pack information.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (primary) / #6a6a6a (secondary) / #ffffff (on dark or cobalt)
- background: #ffffff (canvas) / #f1efe9 (bone section)
- border: #000000 (structural) / #e5e5e5 (hairline on white controls)
- accent: #1e37a0 Cobalt Ink (logo, active state, link emphasis only)
- primary action: no distinct CTA color

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Build a 4-column feature grid on a white #ffffff canvas. Each card: square image at top with 0px border-radius, then Lunar 20px weight 700 '01.' through '04.' in #000000, then heading at Lunar 20px weight 500 #000000, then body copy Lunar 16px weight 400 #6a6a6a. 24px gap between image and text, 32px column gap.
3. Build a centered section header: Lunar 48px weight 400 #000000 heading with -1.44px letter-spacing, optional Lunar 20px weight 400 #6a6a6a subhead directly below with 8px gap. 64px bottom margin to the content. No decorative element.
5. Build a client logo strip: white background, single row of 8 grayscale logos at uniform 24px height, evenly distributed across the full 1280px content width, 60% opacity to read as secondary social proof.

## Similar Brands

- **Hem** — Same Scandinavian furniture-showroom restraint — monochrome canvas, single accent, pill-shaped CTAs, full-bleed editorial interior photography
- **Vitra** — Shared typographic discipline (custom geometric sans, tight tracking), warm off-white surfaces, and reliance on full-bleed lifestyle photography instead of UI decoration
- **Audo Copenhagen** — Near-identical component language: pill buttons, monochrome with one accent, bone-tinted section bands, and sharp-edged editorial images
- **Kinfolk Magazine** — Same editorial sensibility — generous whitespace, centered type, warm neutral palette, and large quiet photography as the primary content
- **Vipp** — Same cobalt-as-only-accent against warm monochrome, pill controls, and the discipline of letting one color do all the brand work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-bone: #f1efe9;
  --color-ash: #ececec;
  --color-stone: #6a6a6a;
  --color-graphite: #333333;
  --color-ink: #1f1d1e;
  --color-obsidian: #000000;
  --color-cobalt-ink: #1e37a0;

  /* Typography — Font Families */
  --font-lunar: 'Lunar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --tracking-caption: -0.42px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.48px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: -0.6px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.92px;
  --text-display: 112px;
  --leading-display: 1;
  --tracking-display: -3.36px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-112: 112px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 8px;
  --radius-links: 8px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-bone-band: #f1efe9;
  --surface-ash-plate: #ececec;
  --surface-cobalt-accent: #1e37a0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-bone: #f1efe9;
  --color-ash: #ececec;
  --color-stone: #6a6a6a;
  --color-graphite: #333333;
  --color-ink: #1f1d1e;
  --color-obsidian: #000000;
  --color-cobalt-ink: #1e37a0;

  /* Typography */
  --font-lunar: 'Lunar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --tracking-caption: -0.42px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.48px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: -0.6px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.92px;
  --text-display: 112px;
  --leading-display: 1;
  --tracking-display: -3.36px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-112: 112px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 1440px;
}
```
