# SpatialChat — Style Reference
> violet pulse on white parchment

**Theme:** light

SpatialChat is a airy SaaS marketing surface that treats violet as a single sharp accent against an almost paper-white canvas. The visual rhythm is wide: generous vertical breathing room, centered hero stacks, then alternating two-column feature blocks. Weight lives in typography — Satoshi carries 700-weight display lines at 60px — while UI elements stay flat or float with a barely-there 6%-opacity shadow. Components read as soft rectangles: 12px buttons, 16px cards, hairline #e5e7eb borders. Color is rationed: violet (#5727e7) appears only on primary CTAs, the announcement bar, the 'New' badge, and active states; everywhere else is grayscale. The mood is confident-but-friendly — a product page that wants to feel modern without being cold, and approachable without being playful.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Brand Violet | `#5727e7` | `--color-brand-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Tinted Highlight | `#f2f2ff` | `--color-tinted-highlight` | Light supporting surface for subtle backgrounds and section separation. |
| Ink Black | `#030712` | `--color-ink-black` | Headline text, primary copy at full weight — the deepest near-black, used wherever the system needs maximum contrast on white |
| Graphite | `#222222` | `--color-graphite` | Secondary text, button labels on filled surfaces, dark UI chrome where pure black is too heavy |
| Slate | `#4b5563` | `--color-slate` | Body text, paragraph copy, subheadings — the working gray for sustained reading |
| Mid Gray | `#5c5c5c` | `--color-mid-gray` | Icon strokes, list markers, muted labels, secondary metadata — high-frequency utilitarian gray |
| Steel | `#6b7280` | `--color-steel` | Input placeholders, helper text, disabled states |
| Mist | `#d1d5db` | `--color-mist` | Input borders at rest, slightly stronger divider lines, de-emphasized outlines |
| Fog | `#e5e7eb` | `--color-fog` | Default hairline borders, card outlines, table dividers, subtle structural separation |
| Cloud | `#f9fafb` | `--color-cloud` | Page canvas, section background behind cards — the off-white that lifts content without being clinical |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, nav bar, button text on violet, input fields — the bright top layer |

## Tokens — Typography

### Satoshi — Single-family geometric sans used for everything from 14px helper text up to 60px display headlines. Satoshi's rounded geometric forms give the violet-and-white system a friendlier edge than a neutral grotesque — the open apertures and soft terminals keep even the 700-weight display lines from feeling corporate. Weight 700 owns the hero and section headlines; 600 handles subheadings and emphasized body; 500 is reserved for button labels and badge text; 400 carries paragraphs and UI labels. Free substitute: 'Inter' or 'General Sans' (Fontshare) as the closest open-license match. · `--font-satoshi`
- **Substitute:** Inter or General Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 16, 18, 20, 24, 32, 40, 44, 48, 60
- **Line height:** 1.30–1.60
- **Letter spacing:** normal
- **Role:** Single-family geometric sans used for everything from 14px helper text up to 60px display headlines. Satoshi's rounded geometric forms give the violet-and-white system a friendlier edge than a neutral grotesque — the open apertures and soft terminals keep even the 700-weight display lines from feeling corporate. Weight 700 owns the hero and section headlines; 600 handles subheadings and emphasized body; 500 is reserved for button labels and badge text; 400 carries paragraphs and UI labels. Free substitute: 'Inter' or 'General Sans' (Fontshare) as the closest open-license match.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.56 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.4 | — | `--text-heading-sm` |
| heading | 32px | 1.38 | — | `--text-heading` |
| heading-lg | 40px | 1.3 | — | `--text-heading-lg` |
| display | 60px | 1.3 | — | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 180 | 180px | `--spacing-180` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| logos | 50px |
| badges | 8px |
| inputs | 12px |
| buttons | 12px |
| announcementBar | 0px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.06) 0px 4px 28px 0px` | `--shadow-xl` |
| subtle | `rgba(0, 0, 0, 0.06) 0px 1px 2px 0px` | `--shadow-subtle` |
| md | `rgba(0, 0, 0, 0.06) 0px 4px 16px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-width #5727e7 band, white Satoshi 16px/500 text, 12px vertical padding, centered content. Right-side 50px-radius close button on white. The only full-bleed colored band on the site.

### Primary CTA Button
**Role:** High-intent action trigger

Filled violet #5727e7, white Satoshi 16px/500 text, 12px radius, 12px vertical × 20px horizontal padding, 0 1px 2px rgba(0,0,0,0.06) shadow. Used for 'Book a Demo' and 'Start for Free'. No arrow glyph inside the pill.

### Ghost CTA Button
**Role:** Secondary action trigger

Transparent fill, 1px solid #030712 border, #030712 Satoshi 16px/500 text, 12px radius, 12px × 20px padding. Sits beside the primary CTA as the lower-commitment option. Often paired with a right-arrow icon after the label.

### Navigation Link
**Role:** Top-bar menu item

Satoshi 16px/500 in #030712, no underline, 8px horizontal padding. Dropdown caret is a 4×4 chevron in #030712.

### New Badge
**Role:** Inline nav annotation

8px radius pill, #f2f2ff background, Satoshi 12px/500 in #5727e7, 4px vertical × 10px horizontal padding. Signals a recently launched destination without adding a new color.

### Login Link
**Role:** Minimal nav CTA

Ghost-style: transparent fill, Satoshi 15px/500 in #030712, 12px radius, 12px × 20px padding — visually quieter than the filled primary CTA so the 'Start for Free' button wins the eye.

### Hero Headline
**Role:** Page-anchoring display type

Satoshi 60px/700, #030712, line-height 1.30, centered. Always paired with a 18px/1.56 #4b5563 subhead and the primary+ghost CTA pair below.

### Social Proof Row
**Role:** Trust strip below hero CTA

Three inline groups: a G2/Capterra badge pair, a 5-star row with 'Loved by 6M+ Users Worldwide' label, and a Product Hunt #1 card. All sit on white, separated by 16px gutters, Satoshi 14-16px.

### Logo Strip Card
**Role:** Client-logo band

Full-bleed white row, 40px vertical padding, six 80px-tall brand logos evenly spaced (max-width 1200px). Logos rendered in their native brand color at full opacity — this is the only band where multi-color is allowed.

### Section Heading
**Role:** Block-anchoring headline

Satoshi 40px/700, #030712, centered, 1.30 line-height. Followed by an 18px #4b5563 paragraph at 1.56. Sets the rhythm for every content section after the hero.

### Feature Section (Two-Column)
**Role:** Alternating product/feature block

48px column gap, left column holds a small section tag pill (8px radius, 1px #e5e7eb border, Satoshi 14px/500), 32px Satoshi 600 heading, bulleted feature list with 8px violet bullet markers, a 2×3 stat grid, and a filled CTA. Right column is a 16px-radius product screenshot card with 0 4px 28px rgba(0,0,0,0.06) shadow.

### Feature List Item
**Role:** Inline benefit bullet

8px violet (#5727e7) filled disc, 12px gap to label. Title in Satoshi 16px/600 #030712, description in Satoshi 14px/400 #4b5563. 16px vertical gap between items.

### Stat Block
**Role:** Inline metric card

Satoshi 24px/700 #030712 number on top, Satoshi 14px/400 #4b5563 label below. No border, no background — sits inside the feature section flow.

### Product Screenshot Card
**Role:** Visual proof of the product UI

16px radius, white background, 0 4px 28px rgba(0,0,0,0.06) shadow. The image fills edge-to-edge inside the radius. This is the only component where a shadow is heavy enough to read as floating.

## Do's and Don'ts

### Do
- Use #5727e7 exclusively for filled primary CTAs, the announcement bar, the 'New' badge, and accent bullets — never for body text or borders
- Set all button radii to 12px and all card radii to 16px — the 4px step between control and container is what makes the system feel intentional
- Reach for Satoshi 700 at 40-60px for any display or section heading; reserve 500 for buttons and 400 for paragraphs
- Pair a filled violet CTA with a ghost-bordered CTA on every hero — the two-button rhythm is the page's signature CTA pattern
- Keep all shadows at rgba(0,0,0,0.06); pick 0 1px 2px for buttons, 0 4px 16px for cards, 0 4px 28px for hero imagery
- Use #e5e7eb for structural dividers and #d1d5db for input borders — the two-step gray scale prevents flat-looking forms
- Set the page canvas to #f9fafb and card surfaces to #ffffff — the off-white base is what keeps the white cards from looking like cutouts

### Don't
- Don't introduce a second chromatic color — violet is the only accent, and adding teal, green, or red will flatten the brand
- Don't set button radius above 14px or below 10px — the 12px pill is calibrated against Satoshi's terminal shapes
- Don't use shadows darker than 6% black or with a colored tint — the system relies on hairline borders and near-invisible shadows
- Don't use Satoshi below 400 weight or above 700 — the system has no light or black variants, and adding them will break the scale
- Don't center-align body paragraphs longer than two lines — left-align descriptions inside the two-column feature sections
- Don't place violet on violet (e.g. violet CTA on violet tint) — the tinted surface #f2f2ff is for highlights, not button states
- Don't fill large content areas with #030712 — dark mode is not part of the system; if a section needs to feel different, use a hairline border and a white card

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f9fafb` | Page background, section bands |
| 1 | Surface | `#ffffff` | Navigation bar, cards, input fields, elevated content blocks |
| 2 | Tinted Surface | `#f2f2ff` | Soft violet wash for highlight badges and accent chips |

## Elevation

- **Primary CTA button (hover/active):** `0 1px 2px rgba(0, 0, 0, 0.06)`
- **Feature card / content block:** `0 4px 16px rgba(0, 0, 0, 0.06)`
- **Hero product screenshot / large media card:** `0 4px 28px rgba(0, 0, 0, 0.06)`

## Imagery

Product screenshots dominate the visual vocabulary — a single large 16px-radius card per feature section, with the live SpatialChat UI visible (video thumbnails, chat panels, avatar bubbles, polls). Screenshots are rendered at full fidelity with their native purple/violet UI elements intact, which lets the brand color echo from the CTAs into the product visual. Below the hero, a full-bleed logo strip carries six client brands in their native colors (Stanford red, McDonald's yellow, Google multicolor, McKinsey blue, Volvo blue, Accenture purple) — this is the one band where multi-color is permitted. There is no lifestyle photography, no stock imagery, and no abstract illustration. Icon style is minimal: small filled violet discs serve as bullet markers, and 4×4 chevrons indicate dropdown menus. The visual rule is: the product IS the photography.

## Layout

Page architecture follows a centered-narrow, two-column rhythm. The announcement bar and nav span full-bleed; everything else is constrained to a 1200px max-width container with horizontal auto margins. The hero is a centered stack: 60px headline → 18px subhead → primary + ghost CTA pair → social proof row. Below the hero sits a full-bleed logo strip, then the page alternates between centered narrow text blocks (a 40px section heading + 18px paragraph) and two-column feature sections (text-left, product-screenshot-right, 48px gutter). Sections breathe with 64px vertical gaps. The nav is a sticky-friendly top bar with logo left, four menu items center-left, and three controls (Login, Book a Demo, Start for Free) right. There is no sidebar, no mega-menu visible, and no footer in the captured viewport — the page is mid-scroll.

## Agent Prompt Guide

**Quick Color Reference**
- text: #030712
- background: #f9fafb
- surface: #ffffff
- border: #e5e7eb
- accent: #5727e7
- primary action: no distinct CTA color

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Feature section: two-column grid with 48px gap. Left column: 8px-radius section tag pill (1px #e5e7eb border, Satoshi 14px/500), 32px Satoshi 600 heading in #030712, then a feature list of 4 items each with an 8px violet (#5727e7) bullet disc, 16px/600 title in #030712, 14px/400 description in #4b5563. Below the list, a 3-column stat row (24px/700 #030712 numbers over 14px/400 #4b5563 labels). Right column: product screenshot in a 16px-radius card, #ffffff background, 0 4px 28px rgba(0,0,0,0.06) shadow.
3. Top nav: full-width white bar, 0 1px 0 #e5e7eb bottom border, 16px vertical padding. Logo left in #030712, menu items in Satoshi 16px/500 #030712 with 4×4 chevron carets. Right side: 'Login' as a ghost-style text link, 'Book a Demo' as a 1px-bordered #030712 ghost button, 'Start for Free' as a filled #5727e7 button — all 12px radius.
4. New badge: 8px-radius pill, #f2f2ff background, Satoshi 12px/500 in #5727e7, 4px vertical × 10px horizontal padding. Place inline next to a nav item label.
5. Stat card: no border, no background. Satoshi 24px/700 number in #030712, Satoshi 14px/400 label in #4b5563 below. Three of these sit side by side with 24px gaps.

## Similar Brands

- **Notion** — Same white-canvas + single-accent + Satoshi-style geometric sans approach, with the same restrained use of shadow and 12px button radius
- **Linear** — Same disciplined grayscale-plus-one-vivid-accent system, similar two-column feature blocks with product screenshots in 16px-radius cards
- **Cal.com** — Same light theme with violet as the sole chromatic accent, same hairline-border + near-invisible shadow elevation approach
- **Pitch** — Same comfortable-density marketing layout with centered hero stacks and alternating two-column feature sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-brand-violet: #5727e7;
  --color-tinted-highlight: #f2f2ff;
  --color-ink-black: #030712;
  --color-graphite: #222222;
  --color-slate: #4b5563;
  --color-mid-gray: #5c5c5c;
  --color-steel: #6b7280;
  --color-mist: #d1d5db;
  --color-fog: #e5e7eb;
  --color-cloud: #f9fafb;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.38;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.3;
  --text-display: 60px;
  --leading-display: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-logos: 50px;
  --radius-badges: 8px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;
  --radius-announcementbar: 0px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.06) 0px 4px 28px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.06) 0px 4px 16px 0px;

  /* Surfaces */
  --surface-canvas: #f9fafb;
  --surface-surface: #ffffff;
  --surface-tinted-surface: #f2f2ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-brand-violet: #5727e7;
  --color-tinted-highlight: #f2f2ff;
  --color-ink-black: #030712;
  --color-graphite: #222222;
  --color-slate: #4b5563;
  --color-mid-gray: #5c5c5c;
  --color-steel: #6b7280;
  --color-mist: #d1d5db;
  --color-fog: #e5e7eb;
  --color-cloud: #f9fafb;
  --color-paper: #ffffff;

  /* Typography */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.38;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.3;
  --text-display: 60px;
  --leading-display: 1.3;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-180: 180px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.06) 0px 4px 28px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.06) 0px 4px 16px 0px;
}
```
