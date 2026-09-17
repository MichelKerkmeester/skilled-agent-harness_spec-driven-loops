# Epidemicsound — Style Reference
> Boutique liner notes on sunlit paper. A warm off-white spread with a custom editorial serif, a single hot-pink section that breaks the monochrome like a magazine cover, and sharp black CTAs that feel like ink stamps — not a software product, a printed object that happens to stream music.

**Theme:** light

Epidemic Sound reads as a music-industry editorial: a warm bone-white canvas, confident black sans-serif UI, and a custom high-contrast serif that carries the brand voice at display sizes. A single vivid hot-pink (#ff82c2) is the signature accent — used sparingly as full-bleed section backgrounds and inline emphasis rather than scattered decoration. Colorfulness sits at 1%, so the system should feel mostly monochrome with chromatic color arriving as deliberate editorial punctuation (pink, signal blue, sun yellow). Components are flat and rectangular, almost no border-radius, very little shadow — the design trusts typography weight and generous spacing to create hierarchy. Italic inside the display serif is a signature move: emphasis is set in the same family rather than a separate color or weight shift, giving headlines a literary, liner-notes quality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hot Pink | `#ff82c2` | `--color-hot-pink` | Signature accent section backgrounds (announcement bar, Studio feature block), inline link emphasis — the brand's editorial punctuation. Used full-bleed, not as a tint |
| Sun Yellow | `#ffda40` | `--color-sun-yellow` | Accent highlight wash and decorative badge fills. Secondary chromatic accent that pairs with the pink in the brand's signature palette |
| Signal Blue | `#20afff` | `--color-signal-blue` | Secondary section background, decorative callout. A cool counterpoint to the warm pink and yellow, used when a third chromatic moment is needed in long pages |
| Ember Orange | `#ff6138` | `--color-ember-orange` | Sporadic chromatic accent for icon strokes and small decorative highlights. Does not define sections |
| Leaf Green | `#5ad363` | `--color-leaf-green` | Green supporting accent for decorative details and low-frequency emphasis |
| Ink Black | `#000000` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Charcoal | `#292c33` | `--color-charcoal` | Secondary text and dark surface variant. Slightly cooler than pure black; used where a softer dark surface is needed without losing authority |
| Slate | `#60605e` | `--color-slate` | Muted body copy, helper text, secondary icon fills. The workhorse secondary text color at high frequency |
| Bone | `#f1f0eb` | `--color-bone` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas and inverse text on dark fills. The cleanest, coolest surface — Bone sits one step above it for warmth |
| Mist | `#efefef` | `--color-mist` | Slightly cooler light surface for card variants and disabled/secondary button states where Bone would feel too warm |
| Stone | `#c1c0bc` | `--color-stone` | Mid-tone divider, disabled border, subtle icon stroke. A neutral that sits between Slate and Bone for hairline UI |
| Sand | `#e4d9cf` | `--color-sand` | Decorative warm wash and image placeholder. The warmest neutral — used as a soft tonal block, rarely as functional UI |
| Frost | `#cfd6e5` | `--color-frost` | Cool-toned gray for card backgrounds and image placeholders where a cooler counterpart to Bone is needed |

## Tokens — Typography

### Inter — Workhorse sans for body copy, navigation, buttons, icons, badges, and all functional UI. Tight tracking at 0.1em on small/uppercase text gives a controlled, label-like feel rather than the looser default sans treatment. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 12, 14, 16, 18, 24
- **Line height:** 1.0–1.71 (tight at 10px for badge caps, generous at 1.5–1.6 for body)
- **Letter spacing:** 0.1em on caption/label sizes (10–14px); 0 on body 16px and up
- **Role:** Workhorse sans for body copy, navigation, buttons, icons, badges, and all functional UI. Tight tracking at 0.1em on small/uppercase text gives a controlled, label-like feel rather than the looser default sans treatment.

### sebentaFont (custom editorial serif) — Display and large headings only. A high-contrast contemporary serif used at hero scale (64–128px) with heavy negative tracking. The italic cut is the brand's voice — emphasis words like 'the sound' are set italic in the same family rather than recolored or underlined, giving headlines a literary, editorial cadence. · `--font-sebentafont-custom-editorial-serif`
- **Substitute:** GT Sectra Display, Tiempos Headline, or Canela (closest visual cousins — high-contrast serif with elegant italic)
- **Weights:** 500 (single weight, with italic)
- **Sizes:** 20, 24, 32, 40, 48, 64, 80, 128
- **Line height:** 1.0–1.25 (extremely tight at display sizes — the serif sits tall and confident, not airy)
- **Letter spacing:** -0.04em at 64–128px display, -0.03em at 48px, -0.02em at 20–40px
- **OpenType features:** `"liga" on, "dlig" on (editorial ligatures for the italic emphasis)`
- **Role:** Display and large headings only. A high-contrast contemporary serif used at hero scale (64–128px) with heavy negative tracking. The italic cut is the brand's voice — emphasis words like 'the sound' are set italic in the same family rather than recolored or underlined, giving headlines a literary, editorial cadence.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | 1px | `--text-caption` |
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 18px | 1.6 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.8px | `--text-heading` |
| heading-lg | 48px | 1.13 | -1.44px | `--text-heading-lg` |
| display | 64px | 1.06 | -2.56px | `--text-display` |
| display-xl | 80px | 1 | -3.2px | `--text-display-xl` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 9999px |
| inputs | 0px |
| buttons | 0px |
| accordion-rows | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Announcement Bar
**Role:** Full-width top-of-page promotion for launches and features

Hot Pink (#ff82c2) background, black (#000000) text, 14–16px Inter medium, centered single-line message with an inline underlined link. Close (×) icon flush right. No padding inset — bar height is determined by text line-height. Functions as a loud tonal event, not a subtle notification.

### Primary Navigation
**Role:** Top sticky header with logo, links, and account actions

White (#ffffff) background with a warm bone (#f1f0eb) tinted variant on subpages. Logo left at ~20px, Inter medium 14px nav links center with chevron-down dropdowns, two right-side buttons: a bone-filled 'Log in' (12px Inter, #f1f0eb bg, #000 text, 0 radius, ~8px 16px padding) and a black-filled 'Create free account' (#000 bg, #fff text, same dimensions). No shadow, no border — the bar sits on the canvas directly.

### Hero Headline
**Role:** Centered editorial display block on the landing page

Two-line sebentaFont at 64–80px, weight 500, line-height ~1.06, letter-spacing -0.04em. Black (#000000) on white. Emphasis is set in the serif's italic cut, not a color change. Subhead is Inter 16px Slate (#60605e) at three propositions separated by black square bullets (▪). No background, no border, no decoration — type carries the page.

### Primary Button
**Role:** Main call-to-action ('Create free account', 'Learn more')

Filled #000000 background, #ffffff text, Inter 14px medium at 0.1em tracking, 0px radius, ~10px vertical × 24px horizontal padding. Centered arrow or text only. This is the only filled-color button in the system — it reads as an ink stamp, not a pill.

### Secondary Button
**Role:** Lower-emphasis action ('Contact sales', 'Log in')

Ghost/bone variant: #f1f0eb background, #000000 text, same 0px radius and Inter 14px medium as primary. Visually quieter than the black fill — paired side-by-side with the primary, it creates a clear hierarchy without a hover or border treatment.

### Brand Showcase Card
**Role:** Horizontal carousel of case-study thumbnails (New Balance, GoPro, Squarespace, Nissan)

Full-bleed photographic card (no border, 0 radius, no shadow) with the brand logo overlaid in white at 40–48px, positioned ~20% from the top. Below the card: Inter 18px medium brand name in black, followed by 14px regular Slate subtext ('"Track title" by Artist'). Carousel arrows (← →) in a 40px square bone-filled button with black chevron.

### Feature Highlight Block (Pink Studio)
**Role:** Full-bleed Hot Pink section promoting a product feature

#ff82c2 background, black text. Two-column layout: left holds a sebentaFont 48px heading with italic emphasis on a key phrase, 16px Inter Slate subhead, and a text link with a right-arrow ('Learn more →') in 14px Inter underline. Right holds a floating product card with a slight rotation (-3° to -5°) and a hand-cursor icon, suggesting tactile interaction. The block reads as a magazine spread — not a product card.

### Feature Highlight Block (Blue Studio)
**Role:** Secondary chromatic section, counterpoint to the pink block

Same two-column editorial structure as the pink block but on #20afff background. White (#ffffff) headline and white product card with a black hand-cursor icon. The blue functions as the 'next chapter' color in the page's chromatic rhythm.

### FAQ Accordion Row
**Role:** Expandable question/answer list

Full-width #f1f0eb row, 0 radius, ~24px vertical padding, ~24px horizontal padding. Inter 16px medium question text in black, flush left. Down-chevron icon (Inter or Lucide, 16px, black) flush right. 8px vertical gap between rows. No border, no shadow — the bone background alone separates rows from the white canvas.

### New Badge
**Role:** Inline tag marking a new feature or product

Pill shape (9999px radius), #000000 background, #ffffff text, Inter 10px bold uppercase, 2–4px vertical × 8px horizontal padding. Sits inline with announcement text in the Hot Pink bar and elsewhere. Small, high-contrast, reads as a sticker.

### Inline Text Link
**Role:** In-prose link emphasis ('Learn more', 'Read more')

Inter 14–16px medium, black (#000000) or chromatic (Hot Pink, Signal Blue depending on context), always underlined. No hover state change in the static spec — the underline is the affordance. Used at the end of a paragraph to invite a deeper read.

### Carousel Arrow Button
**Role:** Horizontal paging control

40px square, #f1f0eb background, black chevron icon, 0 radius. Disabled state (← at start) drops opacity to ~40%. No border.

### Footer
**Role:** Bottom-of-page site links and legal

White (#ffffff) background, no top border. Logo and ~4–5 link columns in Inter 14px Slate (#60605e) with black column headers at 12px medium uppercase at 0.1em. Generous 48–64px vertical padding. The footer is quiet and monochrome — the chromatic personality belongs to the page above.

## Do's and Don'ts

### Do
- Set display headlines in sebentaFont at 64–80px, weight 500, line-height 1.0–1.06, letter-spacing -0.04em. The serif does the work — do not pair it with a second display font.
- Use the serif's own italic cut for emphasis inside headlines ('the sound', 'a faster way'). Never swap to a different color or weight for emphasis.
- Use #000000 filled buttons as the only filled-button style. Pair with #f1f0eb ghost buttons for secondary actions. No rounded corners — 0px radius everywhere except the NEW badge.
- Reach for Hot Pink (#ff82c2) as a full-bleed section background, never as a small accent. It announces a chapter of the page, it does not decorate a button.
- Use Inter 16px / line-height 1.56 / letter-spacing 0 for body copy. Apply 0.1em tracking only at caption/label sizes (10–14px) and uppercase contexts.
- Maintain a 64px section gap and 24px card padding as the spatial rhythm. The design is generous and editorial — do not compress.
- Keep the page 1% colorful. Most of the canvas should be white and bone. Each chromatic section is a deliberate pause, not a decoration.

### Don't
- Do not use a second display serif or a script font. The custom sebentaFont and its italic are the only voice at display sizes.
- Do not round the corners of buttons, cards, or accordion rows. 0px radius is structural to the editorial feel — rounding breaks the magazine logic.
- Do not recolor emphasis words. The italic in the display serif IS the emphasis system. Adding a Hot Pink word inside a black headline breaks the rhythm.
- Do not use #ff82c2, #20afff, or #ffda40 as text colors on a white background. These are section-background colors — at body scale they fail contrast and feel like a toy palette.
- Do not add drop shadows or elevation to cards. The system is flat — surface levels are communicated by background color shifts (white → bone → mist), not by shadow.
- Do not introduce a green/red semantic pair for success and error. The chromatic palette (pink, blue, yellow, orange, green) is decorative and editorial — not a status system.
- Do not stack chromatic sections. Alternate one chromatic block with one monochrome block. The pink-then-blue cadence works because it is rare.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background, the cleanest base |
| 1 | Bone Surface | `#f1f0eb` | FAQ rows, secondary buttons, nav strip — the warm editorial surface |
| 2 | Mist Surface | `#efefef` | Cooler light card variant, subtle elevation without shadow |
| 3 | Hot Pink Block | `#ff82c2` | Full-bleed signature accent section |
| 4 | Signal Blue Block | `#20afff` | Secondary full-bleed accent section |

## Elevation

The design intentionally avoids shadows. Depth is communicated exclusively through background color shifts across the surface stack (white → bone → mist) and through full-bleed chromatic section blocks. Cards sit flat on their parent surface, buttons are ink-stamped onto the canvas, and the accordion rows are bone-on-white with no border. Adding drop shadows would introduce a software-SaaS visual language that conflicts with the editorial / printed-object feel. If elevation is ever required (e.g. a modal or floating menu), use a 1px #000000 border rather than a shadow — the ink-stamp metaphor extends to layering.

## Imagery

Imagery is documentary and brand-led rather than decorative. Photographs are tight, editorial crops of real-world subjects (athletes, filmmakers, musicians, travel) at 16:9 or 3:4 aspect, presented without overlay text, gradient masks, or color treatment — they arrive at full fidelity. The brand logo of each featured partner is composited directly onto the photograph in white, top-centered, at 40–48px, which transforms the photo into a case-study tile rather than a stock image. The pink Studio section includes a floating UI card with a slight rotation and a hand-cursor icon, evoking a hand placing a record. The blue section repeats the motif with a white card. There are no illustrations, no 3D renders, no abstract graphics — the visual language is photography plus bold flat color blocks. Iconography is monochrome and inline (chevrons, arrows, cursors) rather than a decorative icon set.

## Layout

The page is a centered, max-width 1200px editorial column on a white canvas, with the top announcement bar and nav running full-bleed above it. The hero is a single centered text block (no hero image, no split layout) — the type is the hero. Below the hero, content flows in alternating single-color bands: white sections for content-heavy blocks, then a full-bleed Hot Pink Studio block, then a full-bleed Signal Blue block, each occupying the full viewport width regardless of the 1200px content column. Card grids are 3-up or 4-up at equal width with no gutters beyond the 1200px wrapper, giving them a magazine-grid feel. The FAQ section returns to a single full-width column of bone rows. Vertical rhythm is 64px between major sections, 24px within cards, 8–16px between elements. Navigation is a single sticky top bar — no sidebar, no mega-menu, no breadcrumbs.

## Agent Prompt Guide

Quick Color Reference
- text: #000000 (primary), #60605e (secondary), #292c33 (inverse on light, dark on dark)
- background: #ffffff (canvas), #f1f0eb (warm surface), #efefef (cool surface)
- border: #c1c0bc (hairline), #000000 (strong)
- accent: #ff82c2 (Hot Pink — section background, never small)
- primary action: no distinct CTA color
- secondary action: #f1f0eb filled (ghost), #000000 text, 0px radius, 10px 24px padding

Example Component Prompts
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Hot Pink feature block: Full-bleed #ff82c2 background. Left column at 60% width holds sebentaFont 48px weight 500 headline with one italic word, #000000. Below it, Inter 16px #000000 subhead. At the bottom, an Inter 14px medium underlined black link ('Learn more →'). 48px section padding.

3. FAQ accordion: White background. Stack of full-width #f1f0eb rows, 0 radius, 24px vertical padding, 24px horizontal padding. Inter 16px medium #000000 question text flush left, 16px black chevron-down icon flush right. 8px vertical gap between rows.

4. Brand showcase card: Full-bleed photographic card, 0 radius, no shadow. Brand logo overlaid in white at 48px, top-centered, 20% from top edge. Below card: Inter 18px medium #000000 brand name, then Inter 14px regular #60605e subhead with track title in quotes. Cards in a 4-up horizontal row, 8px gap.

5. Announcement bar: Full-width #ff82c2 background. Inter 14px medium #000000 centered text, with a black 'NEW' pill badge (0px→9999px radius, #000 bg, #fff text, 10px bold uppercase) inline at the start and an underlined inline link at the end. 16px vertical padding. Close (×) icon flush right.

## Chromatic Cadence

The page uses chromatic color as a chapter structure, not as decoration. The default rhythm is: white → white → white → Hot Pink full-bleed → Signal Blue full-bleed → white → white. Each chromatic block must be preceded and followed by a monochrome block — never stack two chromatic sections. The pink is always the first chromatic event in the page (after the announcement bar), blue is the second, and yellow/orange/green appear only as small decorative dots or icon strokes within otherwise monochrome sections. This cadence is what makes the 1% colorfulness feel intentional rather than sparse.

## Similar Brands

- **Splice** — Same warm off-white editorial surfaces, sharp-cornered black CTAs, and a single bold accent color used as a section event
- **Aesop** — Editorial serif display, warm bone neutrals, flat sharp-cornered components, and typographic emphasis over chromatic decoration
- **Substack** — Custom serif at display scale with italic for emphasis, bone-tinted UI surfaces, and a color-restrained layout that lets typography carry the brand
- **Bandcamp** — Music-industry editorial with a warm off-white canvas, bold serif headlines, and a willingness to use a single loud color as a section break

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hot-pink: #ff82c2;
  --color-sun-yellow: #ffda40;
  --color-signal-blue: #20afff;
  --color-ember-orange: #ff6138;
  --color-leaf-green: #5ad363;
  --color-ink-black: #000000;
  --color-charcoal: #292c33;
  --color-slate: #60605e;
  --color-bone: #f1f0eb;
  --color-paper-white: #ffffff;
  --color-mist: #efefef;
  --color-stone: #c1c0bc;
  --color-sand: #e4d9cf;
  --color-frost: #cfd6e5;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sebentafont-custom-editorial-serif: 'sebentaFont (custom editorial serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1px;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.44px;
  --text-display: 64px;
  --leading-display: 1.06;
  --tracking-display: -2.56px;
  --text-display-xl: 80px;
  --leading-display-xl: 1;
  --tracking-display-xl: -3.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 9999px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;
  --radius-accordion-rows: 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-bone-surface: #f1f0eb;
  --surface-mist-surface: #efefef;
  --surface-hot-pink-block: #ff82c2;
  --surface-signal-blue-block: #20afff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hot-pink: #ff82c2;
  --color-sun-yellow: #ffda40;
  --color-signal-blue: #20afff;
  --color-ember-orange: #ff6138;
  --color-leaf-green: #5ad363;
  --color-ink-black: #000000;
  --color-charcoal: #292c33;
  --color-slate: #60605e;
  --color-bone: #f1f0eb;
  --color-paper-white: #ffffff;
  --color-mist: #efefef;
  --color-stone: #c1c0bc;
  --color-sand: #e4d9cf;
  --color-frost: #cfd6e5;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sebentafont-custom-editorial-serif: 'sebentaFont (custom editorial serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1px;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.44px;
  --text-display: 64px;
  --leading-display: 1.06;
  --tracking-display: -2.56px;
  --text-display-xl: 80px;
  --leading-display-xl: 1;
  --tracking-display-xl: -3.2px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-240: 240px;
}
```
