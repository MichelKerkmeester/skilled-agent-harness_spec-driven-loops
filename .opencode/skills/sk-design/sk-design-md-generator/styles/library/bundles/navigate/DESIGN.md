# Navigate — Style Reference
> Oversized sticker pack pinned to a chalkboard — chunky grotesque type, pill-everything, and five candy-colored icon tiles repeated like a logo lockup.

**Theme:** mixed

Navigate runs on a max-volume, anti-corporate visual language: ultra-bold grotesque display type at 80–165px slams against pitch-black canvases, warm cream, and full-bleed orange section walls. The interface is deliberately sparse — one floating pill nav at the top, one lime-green accent repeated as the only CTA color, and a set of five chunky colored icon tiles acting as the brand's visual anchor across every section. Body type stays compact and neutral (Aeonik 400–700) so the chunky display face can dominate without competition; spacing is generous but tightly ruled by 1000px pill radii that govern every interactive surface. Sections alternate as full-bleed color bands rather than cards on a canvas, making the page feel like printed posters stacked vertically.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pitch Black | `#141414` | `--color-pitch-black` | Page canvas for dark sections, dark text on cream sections, FAQ pill backgrounds, navigation shell |
| Warm Cream | `#fdf9f0` | `--color-warm-cream` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Charcoal 900 | `#232323` | `--color-charcoal-900` | Secondary dark surface, subtle elevation above #141414, heavier heading text |
| Bone Gray | `#eeeeee` | `--color-bone-gray` | Hairline dividers on cream, low-contrast borders, muted separators |
| Acid Lime | `#c7ff69` | `--color-acid-lime` | Sole primary action color — filled CTA backgrounds, outlined CTA borders, active nav highlights. The single chromatic button in the system against black/cream creates instant focus |
| Ember Orange | `#ff6d38` | `--color-ember-orange` | Full-bleed section background (FAQ wall), brand icon tile fill, the loudest brand color used to break visual rhythm between dark and cream bands |
| Iris Violet | `#7a78ff` | `--color-iris-violet` | Brand icon tile (music/note), card background accent — soft cool counterweight to the warm orange and lime |
| Toxic Green | `#00a652` | `--color-toxic-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Cobalt Blue | `#478bff` | `--color-cobalt-blue` | Brand icon tile (t-shirt) — the cool blue anchor in the icon quintet, prevents the warm colors from overwhelming |
| Schoolbus Yellow | `#ffc412` | `--color-schoolbus-yellow` | Brand icon tile (weight/lock) — high-saturation yellow that sits between the cream and orange for tonal continuity |
| Lilac Mist | `#ccccff` | `--color-lilac-mist` | Soft decorative card background, pale violet wash for muted content panels |

## Tokens — Typography

### OldschoolGrotesk — Display and headline face. The 800/900 weight at 80–165px is the site's signature — extra-condensed grotesque, tight tracking, near-zero leading. Negative letter-spacing tightens the letterforms as size increases: -0.04em at the largest sizes (-6.6px at 165px), scaling back to -0.02em on mid-size headings. The compressed line-height (0.8–0.9) lets multi-line headlines stack into a poster-like block. · `--font-oldschoolgrotesk`
- **Substitute:** Archivo Black, Space Grotesk Bold, or Bowlby One
- **Weights:** 800, 900
- **Sizes:** 22, 32, 36, 54, 83, 108, 117, 135, 165
- **Line height:** 0.80, 0.90, 1.10
- **Letter spacing:** -0.04em at 165px, -0.03em at 108-135px, -0.02em at 54-83px
- **Role:** Display and headline face. The 800/900 weight at 80–165px is the site's signature — extra-condensed grotesque, tight tracking, near-zero leading. Negative letter-spacing tightens the letterforms as size increases: -0.04em at the largest sizes (-6.6px at 165px), scaling back to -0.02em on mid-size headings. The compressed line-height (0.8–0.9) lets multi-line headlines stack into a poster-like block.

### Aeonik — Body, UI, and navigation face. Restrained weights and tight size range (11–18px) keep it as a quiet utility layer beneath the display face. Positive letter-spacing on 11–14px (+0.01em to +0.015em) improves legibility at small sizes; the inverse applies at 18px. Weight 500 is the workhorse for buttons and nav; 700 for emphasized labels. · `--font-aeonik`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 11, 12, 13, 14, 16, 18
- **Line height:** 0.85, 0.86, 1.00, 1.20
- **Letter spacing:** 0.01em to 0.015em on small sizes, -0.02em on 18px
- **Role:** Body, UI, and navigation face. Restrained weights and tight size range (11–18px) keep it as a quiet utility layer beneath the display face. Positive letter-spacing on 11–14px (+0.01em to +0.015em) improves legibility at small sizes; the inverse applies at 18px. Weight 500 is the workhorse for buttons and nav; 700 for emphasized labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | 0.15px | `--text-caption` |
| body-lg | 18px | 1 | -0.36px | `--text-body-lg` |
| heading-sm | 36px | 0.9 | -0.72px | `--text-heading-sm` |
| heading | 54px | 0.9 | -1.08px | `--text-heading` |
| heading-lg | 83px | 0.9 | -2.49px | `--text-heading-lg` |
| display | 135px | 0.85 | -4.05px | `--text-display` |
| display-xl | 165px | 0.8 | -6.6px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 9 | 9px | `--spacing-9` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 21 | 21px | `--spacing-21` |
| 22 | 22px | `--spacing-22` |
| 23 | 23px | `--spacing-23` |
| 26 | 26px | `--spacing-26` |
| 27 | 27px | `--spacing-27` |
| 28 | 28px | `--spacing-28` |
| 29 | 29px | `--spacing-29` |
| 36 | 36px | `--spacing-36` |
| 41 | 41px | `--spacing-41` |
| 66 | 66px | `--spacing-66` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 1000px |
| tags | 1000px |
| cards | 25px |
| buttons | 1000px |
| iconTiles | 25px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 18px

## Components

### Floating Pill Navigation
**Role:** Top-of-page navigation shell

Pill-shaped bar (1000px radius) floating at the top center, ~600px wide. Dark fill (#141414) with cream text, sits above the page canvas with no visible border. Contains a square brand mark (orange #ff6d38, 25px radius), nav links (Aeonik 500, 13px, cream), and a lime-outlined CTA pill at the right. The floating pill is the only persistent UI element across all sections.

### Lime Filled CTA
**Role:** Primary action button

Acid lime (#c7ff69) filled pill, 1000px radius, 9px vertical padding, 18–22px horizontal padding. Text is #141414 in Aeonik 500 at 14px. Used for the main download/install action. The sole filled chromatic button in the system — every other button is either dark, cream, or lime-outlined.

### Lime Outlined CTA
**Role:** Secondary action button

Transparent fill with 2px #c7ff69 border, 1000px radius. Cream or dark text depending on canvas. Used in the floating nav ('Launch Game') and as ghost actions on cream sections. Border-color at 4 evidence points is the strongest signal that lime functions as both filled and outlined action.

### Display Headline Block
**Role:** Section hero headline

OldschoolGrotesk 800/900 at 108–165px, line-height 0.8–0.9, letter-spacing -0.03em to -0.04em. Color is #fdf9f0 on dark, #141414 on cream/orange. Always centered. The line-height below 1.0 causes the text to stack into a single visual block, which is the signature poster effect.

### Section Eyebrow
**Role:** Small label above a display headline

Aeonik 400 or 500, 14–16px, cream/dark depending on canvas. Often paired with a dotted divider or sits alone as a quiet preamble. Positive letter-spacing (~0.15em equivalent) gives it a label-like quality.

### Colored Icon Tile
**Role:** Brand icon in the icon quintet (music, potion, ghost, lock, shirt)

Rounded square (~25px radius, ~100–120px square) filled with one of five brand colors: #7a78ff, #00a652, #ff6d38, #ffc412, #478bff. Contains a chunky dark (#141414) glyph centered inside. The five tiles are always shown as a horizontal row and serve as the brand's visual lockup — repeated in hero, transition section, and footer.

### Dark FAQ Question Pill
**Role:** Expandable question in the FAQ section

Pill shape (1000px radius), #141414 fill, #fdf9f0 text in Aeonik 500 at 14–16px, 18px vertical padding, 22–23px horizontal padding. Sits on the orange section background. The pill form on a full-bleed colored section is the dominant FAQ pattern.

### Cream Answer Card
**Role:** FAQ expanded answer

#fdf9f0 rounded card (~28px radius), dark text, sits below its question pill. ~18–22px padding. Optional small brand mark in the corner. The cream card on orange is the only multi-color stack in the FAQ.

### Theme Toggle Switch
**Role:** Bottom-right theme switcher

Small pill (1000px radius) anchored at the bottom-right of every section. Dark fill, cream 'Off/On' label, small orange icon at the end. Persistent across all page sections — a signature persistent widget.

### Full-Bleed Color Band
**Role:** Page section background

Sections are full-viewport-height color bands (dark → cream → orange) rather than cards on a canvas. No margins, no visible section dividers — the color change IS the divider. Vertical padding inside each band: 80–120px top and bottom.

### Outlined Link/Tag
**Role:** Inline link or navigation tag

Transparent fill with 2px #c7ff69 or #fdf9f0 border, 1000px radius, small padding (2–9px). Used for inline tags and ghost nav items. The 2px border + 1000px radius is the system for everything that isn't a full button.

## Do's and Don'ts

### Do
- Use OldschoolGrotesk 800/900 at 80–165px for display headlines with line-height 0.8–0.9 and letter-spacing -0.03em to -0.04em
- Alternate sections as full-bleed color bands (#141414 → #fdf9f0 → #ff6d38) rather than cards on a canvas
- Use 1000px radius for all buttons, nav, tags, and FAQ pills
- Use #c7ff69 as the only chromatic action color — either as a filled button or as a 2px outlined pill
- Show the five colored icon tiles as a horizontal row whenever introducing or closing a section
- Set body text in Aeonik 400–500 at 13–16px with positive letter-spacing (0.01–0.015em)
- Use 25px radius for the icon tiles and any medium-sized surfaces

### Don't
- Do not add drop shadows — the system is deliberately flat and poster-like
- Do not use any color other than #c7ff69 for action buttons; all other chromatic colors are for icons and section bands
- Do not set body or UI type above 18px — the display face owns everything from 36px upward
- Do not mix the five icon colors outside the icon tile context — they are a fixed quintet, not a free palette
- Do not use line-height above 1.0 on display headlines — the compressed stacking is the signature
- Do not add photography, gradients, or realistic illustration — the system is type + flat color + icons only
- Do not use card-based layouts with white backgrounds on the cream section — cards on cream lose against the canvas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pitch Black | `#141414` | Dark section canvas (hero, alternating bands) |
| 1 | Warm Cream | `#fdf9f0` | Light section canvas (content/feature bands) |
| 2 | Ember Orange | `#ff6d38` | Full-bleed accent section (FAQ, call-to-action walls) |
| 3 | Charcoal 900 | `#232323` | Elevated dark surface (nav pill, FAQ question pills, dark cards on black) |

## Elevation

- **Floating Pill Navigation:** `none — sits flat against the canvas, no shadow`
- **Cream Answer Card:** `none — flat against the orange band, no shadow`

## Imagery

No photography, no product screenshots, no realistic illustration. The visual identity is built entirely from: (1) five flat colored icon tiles with chunky dark glyphs, (2) extra-bold grotesque typography, and (3) full-bleed solid color bands. The icon set functions as both illustration and product showcase — it IS the imagery. Any new page should resist adding photography and instead lean on the icon quintet, type, and color bands to create visual interest.

## Layout

Pages are stacks of full-bleed color bands rather than a single canvas with cards. The dark hero band (~80vh) centers a display headline with the icon quintet at the bottom; a cream band follows with minimal content (icons only, whitespace-heavy); an orange band hosts the FAQ. Navigation is a single floating pill centered at the top, persistent across all bands. Content within bands is centered, not asymmetric. The brand mark in the nav is the only persistent visual anchor — the rest of the page breathes through color changes and oversized type. No multi-column grids in the hero; card grids (if used) would be 3-up or 5-up to match the icon count.

## Agent Prompt Guide

Quick Color Reference:
- text on dark: #fdf9f0
- text on cream/orange: #141414
- background dark: #141414
- background cream: #fdf9f0
- background accent (full section): #ff6d38
- border accent: #c7ff69
- primary action: #c7ff69 (outlined action border)

Example Component Prompts:
1. Create an Outlined Primary Action: Transparent background, #c7ff69 border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.
2. Cream transition band: #fdf9f0 full-bleed, centered, single row of 5 icon tiles (same as above) with massive vertical padding (160px top/bottom). No text — the icons and color do the work.
3. Orange FAQ section: #ff6d38 full-bleed canvas. Eyebrow 'You ask, we answer' in Aeonik 500 at 14px, #141414, centered. Display headline 'Most Common Questions' in OldschoolGrotesk 900 at 135px, #141414, centered, line-height 0.85, letter-spacing -4.05px. Below: a stack of dark pill questions (#141414 fill, 1000px radius, #fdf9f0 text in Aeonik 500 14px, 18px 22px padding), each followed by a cream answer card (#fdf9f0 fill, 28px radius, #141414 text, 22px padding).
5. Theme toggle: small pill (1000px radius) at bottom-right, #141414 fill, 'Off' label in Aeonik 500 at 12px #fdf9f0, small orange #ff6d38 icon at the end. Persistent across all sections.

## Similar Brands

- **Berachain** — Same full-bleed colored section bands, oversized grotesque display type, and web3/playful personality
- **Farcaster** — Same flat-color band layout, pill navigation, and web3-native anti-corporate aesthetic with chunky type
- **Layer3** — Same dark-canvas + lime-accent + pill-everything approach with bold display headlines
- **Paragraph** — Same full-bleed color section stacking, grotesque display type, and icon-driven visual identity
- **Sound.xyz** — Same dark-first canvas with a single chromatic accent color and oversized condensed display headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pitch-black: #141414;
  --color-warm-cream: #fdf9f0;
  --color-charcoal-900: #232323;
  --color-bone-gray: #eeeeee;
  --color-acid-lime: #c7ff69;
  --color-ember-orange: #ff6d38;
  --color-iris-violet: #7a78ff;
  --color-toxic-green: #00a652;
  --color-cobalt-blue: #478bff;
  --color-schoolbus-yellow: #ffc412;
  --color-lilac-mist: #ccccff;

  /* Typography — Font Families */
  --font-oldschoolgrotesk: 'OldschoolGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 0.15px;
  --text-body-lg: 18px;
  --leading-body-lg: 1;
  --tracking-body-lg: -0.36px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -0.72px;
  --text-heading: 54px;
  --leading-heading: 0.9;
  --tracking-heading: -1.08px;
  --text-heading-lg: 83px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -2.49px;
  --text-display: 135px;
  --leading-display: 0.85;
  --tracking-display: -4.05px;
  --text-display-xl: 165px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -6.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-26: 26px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-29: 29px;
  --spacing-36: 36px;
  --spacing-41: 41px;
  --spacing-66: 66px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-32px;
  --element-gap: 18px;

  /* Border Radius */
  --radius-sm: 2.7px;
  --radius-2xl: 20.7px;
  --radius-3xl: 25.146px;
  --radius-3xl-2: 28.8px;
  --radius-3xl-3: 43.2px;
  --radius-full: 60px;
  --radius-full-2: 62.208px;
  --radius-full-3: 64.8px;
  --radius-full-4: 82.2857px;
  --radius-full-5: 1000px;

  /* Named Radii */
  --radius-nav: 1000px;
  --radius-tags: 1000px;
  --radius-cards: 25px;
  --radius-buttons: 1000px;
  --radius-icontiles: 25px;

  /* Surfaces */
  --surface-pitch-black: #141414;
  --surface-warm-cream: #fdf9f0;
  --surface-ember-orange: #ff6d38;
  --surface-charcoal-900: #232323;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pitch-black: #141414;
  --color-warm-cream: #fdf9f0;
  --color-charcoal-900: #232323;
  --color-bone-gray: #eeeeee;
  --color-acid-lime: #c7ff69;
  --color-ember-orange: #ff6d38;
  --color-iris-violet: #7a78ff;
  --color-toxic-green: #00a652;
  --color-cobalt-blue: #478bff;
  --color-schoolbus-yellow: #ffc412;
  --color-lilac-mist: #ccccff;

  /* Typography */
  --font-oldschoolgrotesk: 'OldschoolGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 0.15px;
  --text-body-lg: 18px;
  --leading-body-lg: 1;
  --tracking-body-lg: -0.36px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -0.72px;
  --text-heading: 54px;
  --leading-heading: 0.9;
  --tracking-heading: -1.08px;
  --text-heading-lg: 83px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -2.49px;
  --text-display: 135px;
  --leading-display: 0.85;
  --tracking-display: -4.05px;
  --text-display-xl: 165px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -6.6px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-23: 23px;
  --spacing-26: 26px;
  --spacing-27: 27px;
  --spacing-28: 28px;
  --spacing-29: 29px;
  --spacing-36: 36px;
  --spacing-41: 41px;
  --spacing-66: 66px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-sm: 2.7px;
  --radius-2xl: 20.7px;
  --radius-3xl: 25.146px;
  --radius-3xl-2: 28.8px;
  --radius-3xl-3: 43.2px;
  --radius-full: 60px;
  --radius-full-2: 62.208px;
  --radius-full-3: 64.8px;
  --radius-full-4: 82.2857px;
  --radius-full-5: 1000px;
}
```
