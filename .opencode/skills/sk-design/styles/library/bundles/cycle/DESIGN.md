# Cycle — Style Reference
> Ink-stained porcelain workshop with jewel-toned labels

**Theme:** light

Cycle's visual language reads as a warm, analog workspace — slightly off-white canvas, ink-black type, and a palette of deep jewel tones that feel more like vintage inkpots than SaaS accents. Headlines use Eudoxus Sans at heavy weights with tight tracking, giving every title physical weight; body and UI default to Inter at comfortable 14–16px. Components sit on a very soft shadow system (low-opacity warm gray) rather than hard borders, and large 20px corner radii make cards feel like ceramic tiles. Color is functional and categorical — each product agent or feature cluster gets its own deep hue (teal, violet, amber, maroon) and its own tinted background wash, never decorative gradients.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#171618` | `--color-ink-black` | Primary text, icons, dark surfaces — the dominant neutral; never use pure #000 for text |
| Pure Black | `#000000` | `--color-pure-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, modal panels, text on dark buttons — the brightest surface in the stack |
| Warm Canvas | `#f7f7f7` | `--color-warm-canvas` | Page background, subtle section divider — the off-white that gives the system its warm analog feel |
| Mist Gray | `#efefef` | `--color-mist-gray` | Hairline borders, input backgrounds, divider lines — the quietest structural neutral |
| Stone Gray | `#dadada` | `--color-stone-gray` | Button borders, disabled outlines |
| Pewter | `#bababa` | `--color-pewter` | Subtle shadow tint, placeholder text in low-emphasis contexts |
| Iron | `#727578` | `--color-iron` | Secondary text, nav links, muted body copy — the workhorse mid-gray |
| Lead | `#8b8d8f` | `--color-lead` | Tertiary nav, breadcrumb separators |
| Pebble | `#7d7d7d` | `--color-pebble` | Badge text, metadata labels |
| Deep Teal | `#004d60` | `--color-deep-teal` | Product accent — Pathfinder agent, data-viz category, teal-tinted section backgrounds pair it |
| Deep Violet | `#38296c` | `--color-deep-violet` | Product accent — VoiceHunter agent, primary feature category, violet wash sections |
| Deep Amber | `#6c4800` | `--color-deep-amber` | Product accent — LoopCloser agent, gold-tinted section backgrounds and warm callouts |
| Deep Plum | `#46122d` | `--color-deep-plum` | Product accent — additional agent or feature category, paired with pinkish washes |
| Deep Navy | `#0f1c41` | `--color-deep-navy` | Product accent — analytics or infrastructure category |
| Deep Maroon | `#663220` | `--color-deep-maroon` | Product accent — heading accent on warm-toned pages |
| Deep Umber | `#772914` | `--color-deep-umber` | Product accent — rust-toned category, icon and illustration accent |
| Deep Indigo | `#241a42` | `--color-deep-indigo` | Product accent — dark variant of the violet for headings and iconography on light surfaces |
| Burnt Sienna | `#412e0a` | `--color-burnt-sienna` | Dark amber — heading text when a warm-tone treatment is needed; Yellow supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Violet Wash | `#f5f0ff` | `--color-violet-wash` | Soft tinted background — feature section panels, agent card backgrounds |
| Teal Mist | `#defafe` | `--color-teal-mist` | Soft tinted background — teal-categorized section panels |
| Amber Cream | `#fff6e1` | `--color-amber-cream` | Soft tinted background — gold-categorized section panels |
| Apricot Wash | `#fff1ec` | `--color-apricot-wash` | Soft tinted background — warm secondary section panels |
| Violet Veil | `#e7e0fe` | `--color-violet-veil` | Badge and small-card background — violet category |
| Sky Tint | `#cfeff8` | `--color-sky-tint` | Badge and small-card background — teal category |
| Honey Veil | `#feedcc` | `--color-honey-veil` | Gray supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Inter — All UI, body, nav, button, and badge text — body at 14–16px/400, nav and labels at 12–13px/500, button text at 14–16px/500, inline emphasized text at 600 · `--font-inter`
- **Substitute:** Inter (already freely available)
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 21px, 27px
- **Line height:** 0.94–1.74
- **Letter spacing:** -0.011em at 16–27px, -0.01em at 14–15px, normal at 12–13px
- **Role:** All UI, body, nav, button, and badge text — body at 14–16px/400, nav and labels at 12–13px/500, button text at 14–16px/500, inline emphasized text at 600

### Eudoxus Sans — All display and heading copy — hero at 58px/800, section headings at 48px/800, sub-headings at 32px/700; the tight -0.035em tracking at display sizes and heavy weight give headlines physical, sculptural presence that contrasts Inter's workhorse body · `--font-eudoxus-sans`
- **Substitute:** Cabinet Grotesk Bold, Söhne Breit, or Plus Jakarta Sans 800
- **Weights:** 700, 800
- **Sizes:** 21px, 23px, 32px, 48px, 58px
- **Line height:** 1.00–1.40
- **Letter spacing:** -0.035em at 48–58px, -0.029em at 32px, -0.026em at 21–23px
- **Role:** All display and heading copy — hero at 58px/800, section headings at 48px/800, sub-headings at 32px/700; the tight -0.035em tracking at display sizes and heavy weight give headlines physical, sculptural presence that contrasts Inter's workhorse body

### Karla — Karla — detected in extracted data but not described by AI · `--font-karla`
- **Weights:** 400
- **Sizes:** 21px
- **Line height:** 1.4
- **Role:** Karla — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body | 15px | 1.62 | -0.1px | `--text-body` |
| subheading | 21px | 1.4 | -0.23px | `--text-subheading` |
| heading-sm | 27px | 1.18 | -0.3px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.93px | `--text-heading` |
| heading-lg | 48px | 1.05 | -1.68px | `--text-heading-lg` |
| display | 58px | 1 | -2.03px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 21 | 21px | `--spacing-21` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 28 | 28px | `--spacing-28` |
| 31 | 31px | `--spacing-31` |
| 32 | 32px | `--spacing-32` |
| 42 | 42px | `--spacing-42` |
| 66 | 66px | `--spacing-66` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| badges | 100px |
| images | 12px |
| inputs | 20px |
| buttons | 8px |
| largeSurfaces | 27px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(239, 239, 239, 0.55) 0px 2px 15px 0px` | `--shadow-md` |
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.12) ...` | `--shadow-subtle` |
| subtle-2 | `rgba(23, 24, 26, 0.1) 0px 0px 0px 1px, rgba(23, 24, 26, 0...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(23, 24, 26, 0.1) 0px 0px 0px 1px, rgba(23, 24, 26, 0...` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main action — Book a demo, Sign up

Solid #000000 fill, #ffffff text at 14px Inter weight 500, 8px corner radius, 22px horizontal / 10px vertical padding. Subtle two-stop drop shadow: 0 1px 2px rgba(0,0,0,0.08) + 0 0.5px 0 rgba(0,0,0,0.12). No border.

### Ghost / Outlined Button
**Role:** Secondary action — Watch video, Explore product agents

Transparent fill, #171618 border at 1px, 8px corner radius, 22px / 10px padding, 14px Inter weight 500. Pairs beside the primary CTA in the hero.

### Navigation Bar
**Role:** Top-level site navigation

Transparent bar on white canvas, logo left (#000000 mark), nav links in Inter 14px/500 #171618, right side hosts Log in link and a compact primary CTA button.

### Logo Mark
**Role:** Brand identity anchor

The Cycle dot+wordmark in #000000 — a small circle glyph followed by 'Cycle' in Inter 14px/600; reappears in the product UI as an in-app breadcrumb mark.

### Hero Section
**Role:** Above-the-fold brand statement

Full-width white canvas, centered 58px Eudoxus Sans 800 headline ('Together we ship alone'), 21px Inter 400 subtitle in #727578, two-button group centered. Flanked by 3D mascot characters (jewel-toned blob faces with hats) — decorative, not part of the grid.

### Customer Logo Strip
**Role:** Social proof band

Two rows of monochrome #727578 / 60%-opacity customer logos on the warm canvas, no dividers, 21px row gap.

### Product Screenshot Card
**Role:** Product visualization

White card on warm canvas, 20px radius, 24px padding, 12px image radius inside, soft layered shadow (1px ink hairline + 16px/6px warm blurs). Hosts the product UI mockup showing feedback organization.

### Category Tinted Section
**Role:** Per-feature color-coded content block

Full-bleed tinted background — one of #f5f0ff, #defafe, #fff6e1, or #fff1ec — with a 20px-radius card inside, 3-column or 3-row layout, each card representing a product agent with its matching deep-jewel accent.

### Agent / Feature Card
**Role:** Individual product capability tile

White surface on tinted background, 20px radius, 24px padding, Eudoxus Sans 800 32px heading in a deep brand color, Inter 14–15px body in #171618, optional small badge with 100px pill radius in tinted accent.

### Category Badge
**Role:** Inline tag for area, source, or status

100px pill radius, tinted background (one of #e7e0fe, #cfeff8, #feedcc), 12px Inter 500 text in the matching deep ink color, 6px vertical / 9px horizontal padding.

### Primary Nav Link
**Role:** Menu items in top bar

Inter 14px weight 500, #171618, no underline; chevron-down icons next to dropdown items; active state uses weight 600.

### In-Product Sidebar Item
**Role:** Workspace navigation inside the product UI

Inter 13px weight 500, #171618, left-aligned with a small leading icon, 8px vertical padding, subtle hover wash in #f7f7f7.

### Search Input
**Role:** Workspace search field

Full-width input with 1px #efefef border, 20px radius, 12px Inter 400 placeholder in #727578, 12px vertical / 14px horizontal padding, focus state deepens border to #171618.

### Filter Pill
**Role:** Active filter chip in the product UI

Pill shape (100px radius), white fill, 1px #efefef border, 12px Inter 500 text, small trailing X icon in #727578.

## Do's and Don'ts

### Do
- Use #000000 fill + #ffffff text for the single primary action on any screen; never introduce a second filled-CTA color in the same viewport.
- Pair each deep brand accent (#38296c, #004d60, #6c4800, #46122d) with its matching tinted wash — violet text on #f5f0ff, teal on #defafe, amber on #fff6e1, maroon on apricot wash — to keep the categorical system legible.
- Set all display headlines in Eudoxus Sans 700–800 with tracking between -0.026em and -0.035em; never use Inter above 27px.
- Use 20px radius for cards, 8px for buttons, and 100px for badges/tags — these three radii define the system's silhouette.
- Anchor body text in Inter 14–15px weight 400 at line-height 1.62; apply 600 only for inline emphasis, never for full paragraphs.
- Layer the signature soft shadow (rgba(239,239,239,0.55) 0 2px 15px) beneath white cards on the warm canvas; avoid hard borders on elevated surfaces.
- Use #f7f7f7 as the page background and #ffffff for cards to preserve the warm off-white analog feel — never pure #ffffff for full-page canvas.

### Don't
- Don't use #000000 for body or heading text — #171618 is the only ink color; pure black is reserved for CTA fills and the logo mark.
- Don't introduce bright or saturated accent colors (electric blue, neon green, etc.) — every chromatic value in the system is a deep, muted jewel tone.
- Don't set body or product UI text in Eudoxus Sans — it's a display face only; Inter handles everything from 12px captions up to 27px sub-headings.
- Don't use sharp 4px or 0px corner radii on cards or inputs — the system's softness comes from 20px / 12px / 8px curves.
- Don't stack multiple colored CTA buttons in the same view; the system is strictly one filled black action plus ghost/outlined secondary actions per surface.
- Don't apply gradients to backgrounds or buttons — the color palette relies on flat deep tones and their tinted washes for depth.
- Don't use the chromatic brand colors for decorative gradients or large background floods — they belong on text, icons, and small accent elements paired with their tinted wash.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Canvas | `#f7f7f7` | Page background — the off-white that grounds everything |
| 1 | Paper White | `#ffffff` | Card, modal, and elevated component surfaces |
| 2 | Tinted Wash | `#f5f0ff` | Category-coded section backgrounds — violet, teal, amber, apricot variants |
| 3 | Ink Overlay | `#171618` | Dark inverted sections and product mockup frames |

## Elevation

- **Card (paper white on warm canvas):** `0px 2px 15px 0px rgba(239, 239, 239, 0.55)`
- **Product screenshot frame:** `0px 0px 0px 1px rgba(23, 24, 26, 0.1), 0px 16px 16px 0px rgba(23, 24, 26, 0.03), 0px 6px 12px 0px rgba(23, 24, 26, 0.05)`
- **Secondary card or input:** `0px 0px 0px 1px rgba(23, 24, 26, 0.1), 0px 8px 16px 0px rgba(23, 24, 26, 0.03)`
- **Primary CTA button:** `0px 1px 2px 0px rgba(0, 0, 0, 0.08), 0px 0.5px 0px 0px rgba(0, 0, 0, 0.12)`

## Imagery

The site's visual language mixes three modes: (1) 3D mascot characters in the hero — soft, rounded blob creatures with expressive faces and hats, rendered in the full deep-jewel palette (teal, violet, amber, pink) with subtle ambient shadows; they float as isolated characters with small geometric confetti shapes, never composited onto backgrounds. (2) Product UI screenshots — crisp, full-bleed captures of the actual Cycle workspace showing feedback lists, sidebars, and search inputs, presented in white card frames on the warm canvas. (3) Iconography — small, line-based icons throughout the product UI at 16–20px stroke weight, monochrome #171618 or matching the active category color. No photography, no abstract gradient art, no illustration beyond the mascots. Imagery is sparse and purposeful: mascots anchor brand warmth, product screenshots do the explanatory heavy lifting, icons carry functional density.

## Layout

Max-width 1200px centered column, hero breaks full-bleed with the nav pill floating above. Hero is a centered stack: small wordmark + nav, then 58px headline, subtitle, and a two-button group, flanked by mascot characters sitting outside the content column. Below the hero, a monochrome customer-logo band runs edge-to-edge in a quiet row. Product sections alternate between white product-screenshot cards on the warm canvas and full-bleed tinted sections (violet / teal / amber / apricot) that hold 3-column agent card grids. Section gaps are generous (~80px) to let the soft shadows breathe. Navigation is a minimal top bar with no sticky behavior apparent; in-product pages switch to a left sidebar with a workspace switcher at the top.

## Agent Prompt Guide

Quick Color Reference:
- text: #171618
- background: #f7f7f7 (canvas) / #ffffff (card)
- border: #efefef (hairline) / #171618 (strong)
- accent: #38296c (Deep Violet) — paired with #f5f0ff wash
- primary action: no distinct CTA color

Example Component Prompts:
1. Build the hero: #ffffff background, centered 58px Eudoxus Sans weight 800 headline in #171618 at letter-spacing -2.03px, 21px Inter weight 400 subtitle in #727578 with 1.62 line-height, and a centered button pair — primary #000000 filled button with #ffffff text at 14px Inter 500 (8px radius, 22px/10px padding) and a ghost button with 1px #171618 border, same sizing. Flank with 3D mascot characters in violet, teal, and amber.

2. Build a category-tinted section: #f5f0ff full-bleed background, 3-column grid of white cards (20px radius, 24px padding, soft shadow rgba(239,239,239,0.55) 0 2px 15px), each card with a 32px Eudoxus Sans 800 heading in #38296c, 15px Inter 400 body in #171618, and a 100px-radius pill badge using #e7e0fe fill with #38296c text.

3. Build a product screenshot card: white card (20px radius, 24px padding) on the #f7f7f7 canvas, containing a product UI mockup with 12px image radius and a layered shadow (1px #171618 at 10% opacity + 16px and 6px warm blurs at 3–5% opacity). Inside the mockup, a left sidebar with 13px Inter 500 items in #171618, a top search input with 20px radius and 1px #efefef border, and a main panel with Eudoxus Sans 21px weight 700 headings.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

5. Build a category badge: 100px pill radius, #feedcc fill, 12px Inter 500 text in #412e0a, 6px vertical / 9px horizontal padding. Use for area, source, or status tagging inside the product UI.

## Color Categorical System

Cycle's chromatic palette is not a decorative accent set — it is a categorical taxonomy. Each product agent or feature cluster is assigned one deep-jewel hue and one matching tinted wash:

- Deep Violet (#38296c) + Violet Wash (#f5f0ff) → VoiceHunter / understanding customers
- Deep Teal (#004d60) + Teal Mist (#defafe) → Pathfinder / shaping the product
- Deep Amber (#6c4800) + Amber Cream (#fff6e1) → LoopCloser / closing the loop
- Deep Plum (#46122d) + Apricot Wash (#fff1ec) → additional agent or feedback category
- Deep Navy (#0f1c41) → analytics or infrastructure category

When adding a new agent or feature cluster, select a new deep hue and generate its 95%-lightened wash. Never reuse a hue for a second category. UI chrome (buttons, nav, body) stays neutral; chromatic color enters the interface only through this agent/category system.

## Typography Pairing Logic

The Eudoxus Sans + Inter pairing is a contrast play, not a harmony. Eudoxus Sans 700–800 with tight tracking (-0.035em at display sizes) gives every heading a sculptural, almost pressed-letter quality — the kind of voice you see on a wine label or architecture monograph. Inter at 400–500 with looser tracking handles everything the user reads or clicks.

Rules for the pair:
- Headlines never use Inter; UI never uses Eudoxus Sans.
- The transition point is 27–32px: at 27px and below use Inter; at 32px and above use Eudoxus Sans.
- Eudoxus Sans is always weight 700 or 800 — never lighter.
- Inter at 21px or 27px sub-heading sizes gets -0.011em tracking, which is enough to feel intentional without becoming display-style.

## Similar Brands

- **Linear** — Same warm off-white canvas and heavy display heading against a quiet, mostly-monochrome product frame
- **Vercel** — Same approach of one dark CTA button per view with ghost secondaries, and the soft warm-gray shadow system beneath white cards
- **Notion** — Same category-coded color washes on neutral surfaces, with deep muted hues rather than bright SaaS accents
- **Pitch** — Same soft 20px card radii, Inter for body, custom display face for headlines, and a warm canvas that reads analog rather than digital
- **Loom** — Same use of 3D character mascots as brand warmth, paired with a clean, generous white-and-warm-gray layout

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #171618;
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-warm-canvas: #f7f7f7;
  --color-mist-gray: #efefef;
  --color-stone-gray: #dadada;
  --color-pewter: #bababa;
  --color-iron: #727578;
  --color-lead: #8b8d8f;
  --color-pebble: #7d7d7d;
  --color-deep-teal: #004d60;
  --color-deep-violet: #38296c;
  --color-deep-amber: #6c4800;
  --color-deep-plum: #46122d;
  --color-deep-navy: #0f1c41;
  --color-deep-maroon: #663220;
  --color-deep-umber: #772914;
  --color-deep-indigo: #241a42;
  --color-burnt-sienna: #412e0a;
  --color-violet-wash: #f5f0ff;
  --color-teal-mist: #defafe;
  --color-amber-cream: #fff6e1;
  --color-apricot-wash: #fff1ec;
  --color-violet-veil: #e7e0fe;
  --color-sky-tint: #cfeff8;
  --color-honey-veil: #feedcc;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eudoxus-sans: 'Eudoxus Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.62;
  --tracking-body: -0.1px;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.23px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.3px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.93px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.68px;
  --text-display: 58px;
  --leading-display: 1;
  --tracking-display: -2.03px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-31: 31px;
  --spacing-32: 32px;
  --spacing-42: 42px;
  --spacing-66: 66px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 27px;
  --radius-3xl-3: 30px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-badges: 100px;
  --radius-images: 12px;
  --radius-inputs: 20px;
  --radius-buttons: 8px;
  --radius-largesurfaces: 27px;

  /* Shadows */
  --shadow-md: rgba(239, 239, 239, 0.55) 0px 2px 15px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0.5px 0px 0px;
  --shadow-subtle-2: rgba(23, 24, 26, 0.1) 0px 0px 0px 1px, rgba(23, 24, 26, 0.03) 0px 8px 16px 0px;
  --shadow-subtle-3: rgba(23, 24, 26, 0.1) 0px 0px 0px 1px, rgba(23, 24, 26, 0.03) 0px 16px 16px 0px, rgba(23, 24, 26, 0.05) 0px 6px 12px 0px;

  /* Surfaces */
  --surface-warm-canvas: #f7f7f7;
  --surface-paper-white: #ffffff;
  --surface-tinted-wash: #f5f0ff;
  --surface-ink-overlay: #171618;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #171618;
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-warm-canvas: #f7f7f7;
  --color-mist-gray: #efefef;
  --color-stone-gray: #dadada;
  --color-pewter: #bababa;
  --color-iron: #727578;
  --color-lead: #8b8d8f;
  --color-pebble: #7d7d7d;
  --color-deep-teal: #004d60;
  --color-deep-violet: #38296c;
  --color-deep-amber: #6c4800;
  --color-deep-plum: #46122d;
  --color-deep-navy: #0f1c41;
  --color-deep-maroon: #663220;
  --color-deep-umber: #772914;
  --color-deep-indigo: #241a42;
  --color-burnt-sienna: #412e0a;
  --color-violet-wash: #f5f0ff;
  --color-teal-mist: #defafe;
  --color-amber-cream: #fff6e1;
  --color-apricot-wash: #fff1ec;
  --color-violet-veil: #e7e0fe;
  --color-sky-tint: #cfeff8;
  --color-honey-veil: #feedcc;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eudoxus-sans: 'Eudoxus Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.62;
  --tracking-body: -0.1px;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.23px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.3px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.93px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.68px;
  --text-display: 58px;
  --leading-display: 1;
  --tracking-display: -2.03px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-21: 21px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-31: 31px;
  --spacing-32: 32px;
  --spacing-42: 42px;
  --spacing-66: 66px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 27px;
  --radius-3xl-3: 30px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-md: rgba(239, 239, 239, 0.55) 0px 2px 15px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0.5px 0px 0px;
  --shadow-subtle-2: rgba(23, 24, 26, 0.1) 0px 0px 0px 1px, rgba(23, 24, 26, 0.03) 0px 8px 16px 0px;
  --shadow-subtle-3: rgba(23, 24, 26, 0.1) 0px 0px 0px 1px, rgba(23, 24, 26, 0.03) 0px 16px 16px 0px, rgba(23, 24, 26, 0.05) 0px 6px 12px 0px;
}
```
