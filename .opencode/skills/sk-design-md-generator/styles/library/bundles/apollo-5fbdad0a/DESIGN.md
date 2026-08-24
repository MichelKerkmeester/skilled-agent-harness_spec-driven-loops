# Apollo — Style Reference
> Warm brick atelier at golden hour

**Theme:** light

Apollo reads like a printed membership brochure for a curated physical workspace: warm cream canvas, hairline ash-gray rules, and a whisper-thin display serif that gives every page an editorial weight. A single terracotta accent is rationed across actions and one or two decorative headings, while deep espresso brown replaces black as the structural dark — the palette feels sunlit rather than backlit. The 3px corner radius rejects SaaS pill-button softness in favor of print-publication crispness, and uppercase labels with wide tracking read like section dividers in a magazine. Color rarely speaks, and when it does, it speaks in one confident orange.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Espresso Bark | `#3c261c` | `--color-espresso-bark` | Primary text, navigation background, structural borders — a warm near-black that anchors every screen without the harshness of pure #000000 |
| Terracotta Ember | `#e97451` | `--color-terracotta-ember` | Primary action borders, active nav state, decorative accents — rationed to moments of intent, never used as a large surface fill |
| Iris Ink | `#4a43dd` | `--color-iris-ink` | Decorative display headings, logo monogram stroke — a vivid violet that breaks the warm palette for brand-voice headlines only |
| Honey Parchment | `#f7efc5` | `--color-honey-parchment` | Subtle highlight washes, eyebrow label backgrounds, warm text tint — a muted yellow that warms the cream canvas without competing with terracotta |
| Warm Linen | `#f9f8f0` | `--color-warm-linen` | Page canvas, content section backgrounds — the dominant surface, never pure white, always slightly cream |
| Ash Mist | `#dddedf` | `--color-ash-mist` | Hairline borders, dividers, card edges — the most-used color on the site (1,300+ occurrences), creates the cool rule-lines that structure every layout |
| Blush Cream | `#fcede8` | `--color-blush-cream` | Warm tinted surface for hover states and soft callout blocks — a peach wash that warms the cream canvas |
| Lilac Mist | `#e4e3f2` | `--color-lilac-mist` | Cool surface accent for secondary panels — a lavender-tinted gray that introduces gentle contrast against the warm cream |
| Carbon | `#000000` | `--color-carbon` | True black used sparingly for image fills and footer text — Espresso Bark handles all structural dark needs |

## Tokens — Typography

### MonaSans — Body text, navigation, buttons, section headings, UI labels — the workhorse sans-serif. Uppercase instances at 0.07-0.1em tracking are signature; the wide tracking on 12-14px labels reads like a museum placard, not a UI label. · `--font-monasans`
- **Substitute:** Inter or DM Sans
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 12, 14, 18, 20, 32, 36
- **Line height:** 1.17, 1.27, 1.49, 1.50, 1.55, 1.84
- **Letter spacing:** 0.03em at body, 0.07em at uppercase headings, 0.1em at uppercase nav and eyebrow labels
- **Role:** Body text, navigation, buttons, section headings, UI labels — the workhorse sans-serif. Uppercase instances at 0.07-0.1em tracking are signature; the wide tracking on 12-14px labels reads like a museum placard, not a UI label.

### paradigm-pro — Display headings and hero text only — a whisper-thin custom serif at weight 300. The ultra-light weight is anti-convention: most editorial sites use 400-500 serifs for headlines, but this 300 creates authority through restraint. Tight line-height (0.95) lets the letters interlock like a logotype. · `--font-paradigm-pro`
- **Substitute:** Cormorant or Libre Caslon Text at weight 300
- **Weights:** 300
- **Sizes:** 36, 47
- **Line height:** 0.95, 0.97
- **Letter spacing:** 0.08em at display, 0.03em at heading-lg
- **Role:** Display headings and hero text only — a whisper-thin custom serif at weight 300. The ultra-light weight is anti-convention: most editorial sites use 400-500 serifs for headlines, but this 300 creates authority through restraint. Tight line-height (0.95) lets the letters interlock like a logotype.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.84 | 1.2px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.42px | `--text-body-sm` |
| body | 18px | 1.55 | 0.54px | `--text-body` |
| body-lg | 20px | 1.49 | 0.6px | `--text-body-lg` |
| subheading | 32px | 1.27 | 2.24px | `--text-subheading` |
| heading | 36px | 1.17 | 2.52px | `--text-heading` |
| display | 47px | 0.95 | 3.76px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 23 | 23px | `--spacing-23` |
| 30 | 30px | `--spacing-30` |
| 34 | 34px | `--spacing-34` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 60 | 60px | `--spacing-60` |
| 68 | 68px | `--spacing-68` |
| 90 | 90px | `--spacing-90` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 3px |
| cards | 3px |
| images | 3px |
| inputs | 3px |
| buttons | 3px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 68px
- **Card padding:** 45px
- **Element gap:** 20px

## Components

### Primary CTA Button
**Role:** Main conversion action — reserve space, book a tour

Transparent fill, 1px Terracotta Ember (#e97451) border, 3px radius, padding 23px 45px. Text: MonaSans weight 500, 12px, uppercase, letter-spacing 0.07em, color Warm Linen (#f9f8f0) when on Espresso Bark nav, or Espresso Bark (#3c261c) when on Warm Linen canvas. No drop shadow.

### Ghost Button
**Role:** Secondary actions on dark navigation

Transparent fill, 1px Warm Linen (#f9f8f0) border, 3px radius, padding 17px 34px. Text: MonaSans weight 500, 12px, uppercase, letter-spacing 0.07em, color Warm Linen. Sits on the Espresso Bark navigation bar.

### Navigation Bar
**Role:** Top-level site navigation, sticky

Full-width, Espresso Bark (#3c261c) background, height ~60px. Left: nav links in MonaSans weight 500, 12px, uppercase, letter-spacing 0.1em, color Warm Linen (#f9f8f0). Center: W monogram logo. Right: primary CTA. Active link state uses Terracotta Ember border-bottom. Padding 17px 34px on link items.

### W Logo Monogram
**Role:** Brand identity mark, center of navigation

Custom stylized W glyph, approximately 24px tall. Rendered in Terracotta Ember (#e97451) on the Espresso Bark nav. Functions as the visual anchor of the header — the single most colorful element above the fold.

### Hero Display Headline
**Role:** Full-bleed hero text overlay

Typeface: paradigm-pro weight 300. Size: 47px. Line-height: 0.95. Letter-spacing: 0.08em (3.76px). Color: Warm Linen (#f9f8f0) over a darkened full-bleed photograph. The ultra-thin serif at this size is the site's most distinctive choice — it reads as engraved rather than typeset.

### Hero Eyebrow Label
**Role:** Pre-headline context above the hero display

MonaSans weight 500, 14px, uppercase, letter-spacing 0.07em, color Warm Linen (#f9f8f0). Sits centered above the display headline with 20px gap.

### Section Eyebrow Label
**Role:** Small uppercase label introducing each content section

MonaSans weight 600, 12px, uppercase, letter-spacing 0.1em (1.2px), color Espresso Bark (#3c261c). Left-aligned, sits 30px above the section heading. Functions as a magazine-style kicker.

### Section Heading
**Role:** Primary heading for content sections

MonaSans weight 500, 32px, line-height 1.27, uppercase, letter-spacing 0.07em (2.24px), color Espresso Bark (#3c261c). Reads as a printed section title rather than a web heading.

### Display Heading (Serif)
**Role:** Hero or large editorial display text on content sections

paradigm-pro weight 300, 36px, line-height 0.97, letter-spacing 0.03em, color Iris Ink (#4a43dd) for brand-voice headings or Espresso Bark for standard section openings.

### Body Text Block
**Role:** Primary paragraph content

MonaSans weight 400, 18px, line-height 1.55, color Espresso Bark (#3c261c). Maximum measure ~600px for readability. Paragraph spacing 20px.

### Feature List
**Role:** Bulleted feature list in content sections

Items use MonaSans weight 400, 18px, line-height 1.84, color Espresso Bark. Custom bullet: small Terracotta Ember (#e97451) dot, 6px diameter, left-aligned with 14px indent. Vertical gap between items: 14px.

### Content Section
**Role:** Alternating text+image content blocks

Warm Linen (#f9f8f0) background, 68px vertical padding top and bottom, max-width 1200px centered. Two-column grid: text column (left or right) + image column. Image uses 3px radius. No card background or border — the section itself is the container.

### Image Container
**Role:** All photographic and illustrative imagery

3px border-radius on all images. No overlay, no border. Images bleed to their column edges within the 1200px max-width container. Architectural illustrations use a painterly, detailed treatment rather than flat vector.

## Do's and Don'ts

### Do
- Use 3px border-radius on every interactive element, card, and image — this is non-negotiable and defines the print-publication feel
- Use Ash Mist (#dddedf) for all hairline borders, dividers, and card edges — it is the most-used color on the site and structures every layout
- Use Espresso Bark (#3c261c) for all body text and structural dark needs; reserve #000000 for image fills only
- Use Terracotta Ember (#e97451) only for primary action borders, active nav states, and the logo monogram — never as a large surface fill
- Use paradigm-pro at weight 300 for all display and hero headlines — the whisper-thin serif is the site's most distinctive typographic signature
- Apply uppercase with 0.07-0.1em letter-spacing to all section headings, nav links, and eyebrow labels — this tracking is what makes the design read as editorial rather than web
- Maintain 68px vertical section gaps and 45px card/section padding for the spacious, breathing-room rhythm

### Don't
- Do not use border-radius larger than 3px — no pill buttons, no rounded cards, no soft corners anywhere
- Do not use #ffffff as a background — always use Warm Linen (#f9f8f0) to maintain the cream canvas warmth
- Do not use drop shadows or box-shadow elevation — separation comes from hairline borders and tonal surface shifts only
- Do not use Terracotta Ember as a large fill color — it is an accent, rationed to borders, active states, and the logo only
- Do not use Iris Ink (#4a43dd) for body text or navigation — it is reserved for decorative display headings and the logo monogram stroke
- Do not use font-weight above 300 for the paradigm-pro display serif — the whisper-thin weight is the entire point
- Do not mix multiple accent colors in a single view — terracotta speaks alone; adding iris or honey to the same component creates noise

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Warm Linen Canvas | `#f9f8f0` | Page background and content section base |
| 2 | Blush Cream | `#fcede8` | Soft tinted surface for hover states and callout blocks |
| 3 | Lilac Mist | `#e4e3f2` | Cool secondary panel surface for contrast blocks |
| 4 | Espresso Bark | `#3c261c` | Navigation bar and footer dark surface |

## Elevation

- **Navigation Bar:** `none — sits flush against canvas, defined only by its dark Espresso Bark background`
- **Content Cards:** `none — no drop shadows`

## Imagery

Photography dominates the visual language: full-bleed lifestyle imagery in the hero showing people in the workspace, and candid portrait photography in content sections. All photography uses warm, golden-hour lighting with natural tones — no cool or studio-lit images. The treatment is editorial and candid, never staged product photography. A single detailed architectural illustration (a painted/rendered building facade) appears in one content section, adding a hand-crafted, almost watercolor quality that contrasts with the photography. The illustration uses warm browns and greens that sit within the site's palette. Icons are minimal — the only icon is the custom W monogram in the nav, which functions as a logotype rather than a UI icon. Images use 3px corners consistently, no overlays or duotone treatments.

## Layout

The layout is max-width 1200px centered with a spacious vertical rhythm. The hero is full-bleed: a full-viewport photograph with the Espresso Bark navigation bar overlaid, and the display headline + CTA centered over the image. Content sections alternate between two patterns: (1) text-left/image-right and text-right/image-left in a two-column grid with 68px vertical gaps, and (2) centered text stacks with feature lists. Sections sit on a continuous Warm Linen canvas with no section background changes — the only tonal shift is the dark navigation bar at the top. The grid is simple two-column for content blocks, with images sized to roughly 45% width and text to 40% width, leaving generous gutters. Navigation is a single sticky top bar — no sidebar, no mega-menu. The overall density is spacious and editorial, with each section breathing into the next rather than competing for attention.

## Agent Prompt Guide

primary action: #e97451 (filled action)
Create a Primary Action Button: #e97451 background, #3c261c text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
**Quick Color Reference**
- Page background: #f9f8f0 (Warm Linen)
- Primary text / structural dark: #3c261c (Espresso Bark)
- Hairline borders: #dddedf (Ash Mist)
- Primary action accent: #e97451 (Terracotta Ember)
- Decorative display heading: #4a43dd (Iris Ink)
- Highlight wash: #f7efc5 (Honey Parchment)
- All interactive elements: 3px border-radius

**Example Component Prompts**


2. *Content Section with Feature List*: Warm Linen (#f9f8f0) background, 68px vertical padding, max-width 1200px centered. Two-column grid: left column is text, right column is a photograph (3px radius). Section eyebrow label in MonaSans weight 600, 12px, uppercase, letter-spacing 1.2px, color #3c261c. Section heading in MonaSans weight 500, 32px, uppercase, letter-spacing 2.24px, color #3c261c. Body text in MonaSans weight 400, 18px, line-height 1.55, color #3c261c. Feature list below: each item is MonaSans weight 400, 18px, line-height 1.84, with a 6px Terracotta Ember (#e97451) dot bullet, 14px vertical gap between items.

3. *Navigation Bar*: Full-width, background #3c261c, height ~60px, padding 17px 34px on link items. Three zones: left-aligned nav links in MonaSans weight 500, 12px, uppercase, letter-spacing 1.2px, color #f9f8f0; center-aligned W monogram in #e97451; right-aligned ghost button (1px #f9f8f0 border, 3px radius, padding 17px 34px, text MonaSans weight 500, 12px, uppercase, letter-spacing 0.84px, color #f9f8f0). Active nav link gets a 1px #e97451 border-bottom.

4. *Editorial Display Heading*: paradigm-pro weight 300, 36px, line-height 0.97, letter-spacing 1.08px, color #4a43dd. Use for brand-voice section openers or pull-quote text. Never use for body content or navigation.

5. *Image Card / Workspace Photo*: Full-column-width image, 3px border-radius, no border, no shadow. Sits directly on Warm Linen (#f9f8f0) canvas. Pair with a text column on the opposite side at 68px vertical gap from the previous section.

## Similar Brands

- **NeueHouse** — Same boutique-workspace editorial language — warm earth tones, spacious layout, photographic imagery of curated interiors, and a membership-brochure feel rather than a tech-product feel
- **Kinfolk Magazine** — Same warm cream canvas, thin serif display type, generous whitespace, and the quality of a printed editorial spread translated to web
- **Ace Hotel** — Same warm brick-and-cream palette, lifestyle photography in golden-hour light, and a design language that prioritizes tactile, hand-crafted feel over digital slickness
- **Cereal Magazine** — Same restrained warm palette, thin display serif headlines, and the editorial-print aesthetic applied to a lifestyle brand

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-espresso-bark: #3c261c;
  --color-terracotta-ember: #e97451;
  --color-iris-ink: #4a43dd;
  --color-honey-parchment: #f7efc5;
  --color-warm-linen: #f9f8f0;
  --color-ash-mist: #dddedf;
  --color-blush-cream: #fcede8;
  --color-lilac-mist: #e4e3f2;
  --color-carbon: #000000;

  /* Typography — Font Families */
  --font-monasans: 'MonaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-paradigm-pro: 'paradigm-pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.84;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.42px;
  --text-body: 18px;
  --leading-body: 1.55;
  --tracking-body: 0.54px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.49;
  --tracking-body-lg: 0.6px;
  --text-subheading: 32px;
  --leading-subheading: 1.27;
  --tracking-subheading: 2.24px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: 2.52px;
  --text-display: 47px;
  --leading-display: 0.95;
  --tracking-display: 3.76px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-90: 90px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 68px;
  --card-padding: 45px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-nav: 3px;
  --radius-cards: 3px;
  --radius-images: 3px;
  --radius-inputs: 3px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-warm-linen-canvas: #f9f8f0;
  --surface-blush-cream: #fcede8;
  --surface-lilac-mist: #e4e3f2;
  --surface-espresso-bark: #3c261c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-espresso-bark: #3c261c;
  --color-terracotta-ember: #e97451;
  --color-iris-ink: #4a43dd;
  --color-honey-parchment: #f7efc5;
  --color-warm-linen: #f9f8f0;
  --color-ash-mist: #dddedf;
  --color-blush-cream: #fcede8;
  --color-lilac-mist: #e4e3f2;
  --color-carbon: #000000;

  /* Typography */
  --font-monasans: 'MonaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-paradigm-pro: 'paradigm-pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.84;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.42px;
  --text-body: 18px;
  --leading-body: 1.55;
  --tracking-body: 0.54px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.49;
  --tracking-body-lg: 0.6px;
  --text-subheading: 32px;
  --leading-subheading: 1.27;
  --tracking-subheading: 2.24px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: 2.52px;
  --text-display: 47px;
  --leading-display: 0.95;
  --tracking-display: 3.76px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-90: 90px;

  /* Border Radius */
  --radius-sm: 3px;
}
```
