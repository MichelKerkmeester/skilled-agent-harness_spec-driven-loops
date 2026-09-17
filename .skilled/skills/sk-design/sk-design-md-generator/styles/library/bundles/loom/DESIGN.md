# Loom — Style Reference
> Sunlit message lounge — a bright, pill-shaped communication booth on white marble, lit by one confident blue lamp.

**Theme:** light

Loom uses a sunlit, airy communication-workspace language — a clean white canvas with generous breathing room, fully pill-shaped controls, and a single saturated blue (#1868db) that threads through navigation, links, and buttons to create one consistent interactive color. The design relies on soft pastel surface tints — pale blue #e9f2fe, buttery cream, mint, and lavender — to differentiate content zones without breaking the bright, welcoming atmosphere. Typography is restrained and editorial: Charlie Display at weight 700 anchors headlines in compact, tight-leading forms while Charlie Text handles body and UI at 15–19px, giving the product a confident voice that never feels heavy. Cards use large rounded corners (~42–69px) and layered ambient shadows to feel like physical surfaces, and the 9999px pill shape carries the entire interactive vocabulary — every clickable element is a capsule.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#1868db` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Pale Wash | `#e9f2fe` | `--color-pale-wash` | Light blue surface for testimonial cards, banner backgrounds, and soft feature zones |
| Paper White | `#ffffff` | `--color-paper-white` | Primary page and card background; the default canvas |
| Ink Black | `#101214` | `--color-ink-black` | Primary text color for headings and body copy |
| Graphite | `#292a2e` | `--color-graphite` | Secondary text and icon strokes; slightly softer than Ink Black for muted labels |
| Charcoal | `#000000` | `--color-charcoal` | Hard text, high-contrast borders, and icon fills |
| Ash Border | `#cccccc` | `--color-ash-border` | Hairline dividers and subtle card borders |
| Steel | `#7d818a` | `--color-steel` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Deep Plum | `#48245d` | `--color-deep-plum` | Dark accent for content card backgrounds and illustration strokes |
| Orchid | `#bf63f3` | `--color-orchid` | Decorative purple accent for icon strokes and illustration fills |
| Ember | `#ff613d` | `--color-ember` | Warm orange accent for notification icons, illustration highlights, and callout strokes |
| Leaf | `#82b536` | `--color-leaf` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Butter | `#fff5d4` | `--color-butter` | Pale cream surface for content card backgrounds and soft highlight washes |
| Mint | `#efffd6` | `--color-mint` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Navy Field | `#123263` | `--color-navy-field` | Dark blue surface for inverted content cards and feature panels |

## Tokens — Typography

### Charlie Display — Headlines from small section titles through hero display size; exclusively weight 700, compact leading (1.03–1.33) makes even the largest size feel dense and editorial · `--font-charlie-display`
- **Substitute:** Inter Tight Bold or Söhne Breit Bold
- **Weights:** 700
- **Sizes:** 25px, 33px, 44px, 63px
- **Line height:** 1.03–1.33
- **OpenType features:** `"ss01" on, "ss02" on, "ss08" on`
- **Role:** Headlines from small section titles through hero display size; exclusively weight 700, compact leading (1.03–1.33) makes even the largest size feel dense and editorial

### Charlie Text — Body copy, UI labels, buttons, navigation, and subheadings; weight 400 is default, 500 for emphasized UI, 700 for inline emphasis; generous leading (1.45–1.71) keeps dense text airy · `--font-charlie-text`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 13px, 15px, 16px, 18px, 19px, 27px
- **Line height:** 1.45–1.71
- **OpenType features:** `"ss01" on, "ss02" on, "ss08" on, "ss08" on`
- **Role:** Body copy, UI labels, buttons, navigation, and subheadings; weight 400 is default, 500 for emphasized UI, 700 for inline emphasis; generous leading (1.45–1.71) keeps dense text airy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.45 | — | `--text-caption` |
| body-sm | 15px | 1.5 | — | `--text-body-sm` |
| subheading | 19px | 1.5 | — | `--text-subheading` |
| heading-sm | 25px | 1.27 | — | `--text-heading-sm` |
| heading | 27px | 1.45 | — | `--text-heading` |
| heading-lg | 33px | 1.14 | — | `--text-heading-lg` |
| display | 44px | 1.14 | — | `--text-display` |
| display-lg | 63px | 1.03 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| tags | 9999px |
| cards | 68px |
| images | 42px |
| medium | 12px |
| buttons | 9999px |
| smallElements | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Main action trigger on hero, CTAs, and section endings

9999px pill radius; background #1868db; text #ffffff in Charlie Text weight 500 at 15–16px; horizontal padding 23px, vertical padding 8–16px; no border; 2px spacing between icon and label when icon present.

### Secondary Outlined Button
**Role:** Companion action beside the primary, typically install/download flows

9999px pill radius; background #ffffff; border 1px solid #000000; text #000000 in Charlie Text weight 500 at 15–16px; same padding as primary filled.

### Nav Pill Link
**Role:** Inline action in the top navigation bar

9999px pill radius; background #1868db; text #ffffff weight 500 at ~16px; padding ~8px 16px; sits beside ghost text links.

### Ghost Contact Button
**Role:** Tertiary nav action for sales/contact flows

9999px pill radius; background #ffffff; border 1px solid #cccccc; text #101214 weight 500; subtle, quiet presence next to the primary nav pill.

### Testimonial Card
**Role:** Customer quote card on pale blue wash

Large radius (~68px); background #e9f2fe; padding ~40–48px; centered text layout; Charlie Text quote at 18–19px weight 400; attribution row with circular avatar and name/title in 13–15px; flanked by circular arrow controls at 9999px radius.

### Content Feature Card
**Role:** Section cards using pastel tints for differentiation

Radius ~42–69px; pastel backgrounds (#efffd6, #fff5d4, #e9f2fe, or dark #123263/#48245d); padding 24–40px; Charlie Text heading at 25–33px; layered ambient shadow stack.

### Hero Video Container
**Role:** Full-width video preview directly under the hero headline

Extra-large radius (~42–69px); full container width; no visible border; receives the same three-layer ambient shadow as cards; contains inline playback controls (1x speed pill, duration label).

### Top Banner Bar
**Role:** Site-wide announcement strip

Full-bleed #1868db background; white text in Charlie Text weight 500 at ~15px; centered content; dismiss X in top-right corner.

### Logo Mark
**Role:** Brand identification in header

Square rounded icon (sun/burst glyph) at ~40px beside "ATLASSIAN Loom" wordmark; wordmark uses Charlie Text weight 700 in two-tone (ATLASSIAN small uppercase + Loom larger).

### Carousel Arrow Button
**Role:** Navigation between testimonial or card slides

9999px pill radius circular button; background #ffffff; border 1px solid #cccccc or subtle shadow; contains a simple chevron icon in #101214.

### Inline Link
**Role:** Text links within paragraphs and lists

Charlie Text weight 500; color #1868db; no underline by default; can shift to #7d818a for de-emphasized links.

### Ambient Card Shadow
**Role:** Elevation treatment for cards and video containers

Three-layer drop shadow: rgba(0,0,0,0.04) at 0px 2px 6px, rgba(0,0,0,0.06) at 0px 5px 18px, rgba(0,0,0,0.10) at 0px 24px 83px; creates a soft, diffused lift rather than a hard edge.

## Do's and Don'ts

### Do
- Use 9999px radius for every clickable element — buttons, nav links, tags, and icon controls are all pills, no exceptions
- Set all primary text to #101214 on #ffffff for AAA contrast; never let body copy drop below #292a2 on white
- Apply the three-layer ambient shadow stack (0px 2px 6px / 0px 5px 18px / 0px 24px 83px) to cards and video containers — this is the only elevation pattern in the system
- Use Charlie Display weight 700 for all headlines at 25px and above; reserve Charlie Text for everything at 19px and below
- Differentiate content zones with pastel surface tints (#e9f2fe, #fff5d4, #efffd6, lavender) rather than adding more borders or dividers
- Use #1868db as the single interactive accent color across nav, links, and buttons — no secondary chromatic action color
- Center-align hero text and CTAs; the product voice is direct and frontal, not asymmetric

### Don't
- Never use square or small-radius corners (under 12px) on cards or images — the entire system relies on generous rounding
- Never add a second action color; the blue is the only chromatic decision and adding green or red buttons will fragment the visual thread
- Never apply bold weight below 19px in body copy; weight 500 is the floor for UI labels to maintain the airy, restrained feel
- Never use flat single-layer shadows or hard borders to separate cards; the layered ambient shadow is what makes surfaces feel physical
- Never use line-height below 1.2 on display sizes or above 1.7 on body sizes — the system lives in a narrow vertical-rhythm window
- Never put chromatic colors on large background fills for structural sections; pastels are for content cards, not page bands
- Never set body text below 15px or above 19px; the product reads as comfortable, not dense or oversized

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Default page and card background |
| 2 | Pale Wash | `#e9f2fe` | Light blue content surface for testimonials and feature zones |
| 3 | Butter | `#fff5d4` | Cream content surface for warm feature cards |
| 4 | Mint | `#efffd6` | Mint content surface for success-adjacent cards |
| 5 | Signal Blue | `#1868db` | Inverted surface for announcement banner and nav pill |

## Elevation

- **Cards, video containers, and image previews:** `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px`

## Imagery

Photography is product-contextual: lifestyle scenes of people using video communication in bright, natural-light environments (offices, homes, casual workspaces). Images are treated as full-bleed containers with very large border-radius (~42–69px) to match the card system. Illustrations are minimal — the interface relies on a small sun/burst logo mark and occasional flat iconography rather than full illustrations. Icon style is filled, moderate stroke weight, monochrome in #101214 or #292a2e. Video previews (the product itself) are the dominant visual content, presented as rounded containers with inline playback UI. Visual density is text-dominant with one large video or image per section acting as the visual anchor.

## Layout

Max-width ~1200px centered container; full-bleed colored banners span edge to edge. Hero is a centered text stack (headline → subhead → button pair → video preview) on pure white with generous vertical padding. Sections alternate between white backgrounds and pale pastel surface cards, creating a rhythm of quiet and tinted. Content blocks are consistently centered with 2-column or 3-column card grids. Navigation is a top bar with logo left, center nav links, and action pills right; a full-bleed blue announcement banner sits above the nav. The overall flow is vertical-scroll, single-column at the section level, with card grids appearing as content within sections rather than as full-width bands.

## Agent Prompt Guide

**Quick Color Reference**
- text: #101214
- background: #ffffff
- border: #cccccc
- accent: #1868db
- primary action: no distinct CTA color
- muted text: #292a2e
- tinted surface: #e9f2fe

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Create a testimonial card*: Background #e9f2fe, border-radius 68px, padding 48px. Quote text at 19px Charlie Text weight 400, #101214, centered. Attribution row below: circular 48px avatar, name in 15px weight 700, title in 13px weight 400 #292a2e. Apply the three-layer ambient shadow: 0px 2px 6px rgba(0,0,0,0.04), 0px 5px 18px rgba(0,0,0,0.06), 0px 24px 83px rgba(0,0,0,0.10).

3. *Create a top navigation bar*: White #ffffff background, logo left (40px sun-burst icon + 'Loom' wordmark in Charlie Text weight 700). Center links in 16px Charlie Text weight 500 #101214. Right side: nav pill button at 9999px radius, #1868db background, white text 16px; ghost button beside it at 9999px radius, white background, 1px #cccccc border, #101214 text.

4. *Create a pastel feature card grid*: Three cards in a row, each with 42px border-radius. Card 1 background #efffd6, Card 2 background #fff5d4, Card 3 background #e9f2fe. Each card: padding 24px, heading in Charlie Display weight 700 at 25px, body in Charlie Text weight 400 at 16px, 1.52 line-height. Three-layer ambient shadow on each card.

5. *Create a full-bleed announcement banner*: Background #1868db, full viewport width, padding 8px vertical. Text in Charlie Text weight 500 at 15px #ffffff, centered. Dismiss X icon in top-right corner at 16px, white.

## Elevation Philosophy

The system uses exactly one shadow pattern — a three-layer ambient stack that creates diffused, atmospheric lift rather than directional depth. Shadows appear only on cards, video containers, and image previews; never on buttons, text, or flat surfaces. The large 83px blur radius in the third layer is what makes the system feel physical: cards seem to hover above the white canvas with a gentle, room-lit glow, not a hard edge.

## Similar Brands

- **Notion** — Same white-canvas + single blue accent approach with pill-shaped controls and pastel surface differentiation
- **Descript** — Video-focused product with a bright, clean interface and oversized rounded media containers
- **Figma** — Large-radius cards, soft layered shadows, and a restrained palette anchored by one brand color
- **Slack** — Pill-button interactive vocabulary and bright airy layout with a single chromatic accent
- **Calendly** — White background, generous vertical rhythm, centered hero stacks, and pastel card differentiation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #1868db;
  --color-pale-wash: #e9f2fe;
  --color-paper-white: #ffffff;
  --color-ink-black: #101214;
  --color-graphite: #292a2e;
  --color-charcoal: #000000;
  --color-ash-border: #cccccc;
  --color-steel: #7d818a;
  --color-deep-plum: #48245d;
  --color-orchid: #bf63f3;
  --color-ember: #ff613d;
  --color-leaf: #82b536;
  --color-butter: #fff5d4;
  --color-mint: #efffd6;
  --color-navy-field: #123263;

  /* Typography — Font Families */
  --font-charlie-display: 'Charlie Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-charlie-text: 'Charlie Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.45;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.5;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.27;
  --text-heading: 27px;
  --leading-heading: 1.45;
  --text-heading-lg: 33px;
  --leading-heading-lg: 1.14;
  --text-display: 44px;
  --leading-display: 1.14;
  --text-display-lg: 63px;
  --leading-display-lg: 1.03;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 41.6923px;
  --radius-full: 50px;
  --radius-full-2: 68.9231px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-tags: 9999px;
  --radius-cards: 68px;
  --radius-images: 42px;
  --radius-medium: 12px;
  --radius-buttons: 9999px;
  --radius-smallelements: 6px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-pale-wash: #e9f2fe;
  --surface-butter: #fff5d4;
  --surface-mint: #efffd6;
  --surface-signal-blue: #1868db;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #1868db;
  --color-pale-wash: #e9f2fe;
  --color-paper-white: #ffffff;
  --color-ink-black: #101214;
  --color-graphite: #292a2e;
  --color-charcoal: #000000;
  --color-ash-border: #cccccc;
  --color-steel: #7d818a;
  --color-deep-plum: #48245d;
  --color-orchid: #bf63f3;
  --color-ember: #ff613d;
  --color-leaf: #82b536;
  --color-butter: #fff5d4;
  --color-mint: #efffd6;
  --color-navy-field: #123263;

  /* Typography */
  --font-charlie-display: 'Charlie Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-charlie-text: 'Charlie Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.45;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.5;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.27;
  --text-heading: 27px;
  --leading-heading: 1.45;
  --text-heading-lg: 33px;
  --leading-heading-lg: 1.14;
  --text-display: 44px;
  --leading-display: 1.14;
  --text-display-lg: 63px;
  --leading-display-lg: 1.03;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 41.6923px;
  --radius-full: 50px;
  --radius-full-2: 68.9231px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px;
}
```
