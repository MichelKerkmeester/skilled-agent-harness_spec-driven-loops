# Reclaim — Style Reference
> lavender productivity workshop with violet ink

**Theme:** light

Reclaim reads as a productivity tool that wants to feel friendly, not corporate. The canvas is a very pale lavender (#ebefff) that softens what could otherwise be a stark productivity app, with product surfaces staying pure white for contrast. A single vivid violet (#5562eb) drives every interactive moment — links, primary CTAs, focus states — while a matching vivid green (#7ac17b) appears as functional punctuation on the calendar visualization itself, not on controls. Typography is exclusively Poppins, used at extreme scale: 90px hero headlines with weight 300/400 whisper against the page, and tiny 11-12px body text that never feels utilitarian. Buttons are pill-shaped (100px radius) with stark black or pure violet fills — no gradients on controls. The overall feeling is "calm scheduling app, not enterprise software."

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lavender Canvas | `#ebefff` | `--color-lavender-canvas` | Page background, hero section wash, footer background — the base atmosphere that distinguishes Reclaim from generic white SaaS |
| White Surface | `#ffffff` | `--color-white-surface` | Card surfaces, product mockup containers, button text on dark fills — pure white provides the resting layer above the lavender canvas |
| Midnight Ink | `#181d25` | `--color-midnight-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Pure Black | `#000000` | `--color-pure-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Graphite | `#111111` | `--color-graphite` | Body copy and card text on light surfaces — sits just above pure black for slightly softer reading weight |
| Slate | `#474747` | `--color-slate` | Muted helper text, secondary descriptions, footer text — the workhorse for non-headline copy |
| Charcoal | `#2b2b2b` | `--color-charcoal` | Subheadings and emphasized body — bridges Midnight Ink headings and Slate body text |
| Stone | `#333333` | `--color-stone` | Tertiary text, breadcrumb-style labels |
| Mist | `#ececec` | `--color-mist` | Hairline dividers, decorative strokes, subtle separators |
| Iris Violet | `#5562eb` | `--color-iris-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Sapphire Violet | `#3451e8` | `--color-sapphire-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lavender Mist | `#c2caf9` | `--color-lavender-mist` | Soft tints for product card highlights, decorative violet washes, outlined button borders — the muted cousin of Iris Violet |
| Periwinkle | `#96a0f3` | `--color-periwinkle` | Disabled or secondary violet state, ghost button text on violet themes |
| Indigo Depth | `#151f8b` | `--color-indigo-depth` | Dark mode gradient anchor, deep accent for special promotional sections |
| Focus Green | `#7ac17b` | `--color-focus-green` | Green supporting accent for decorative details and low-frequency emphasis |
| Mint Whisper | `#daf0db` | `--color-mint-whisper` | Light supporting surface for subtle backgrounds and section separation |
| Forest Edge | `#14532d` | `--color-forest-edge` | Dark green gradient stop for special promotional banners |
| Brick | `#5a1a1a` | `--color-brick` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Poppins — Exclusive brand typeface used for every text element. The 300-weight whisper at 70–90px for hero headlines is the signature move — most productivity apps use bold display weights, but Reclaim's thin Poppins headlines float above the page rather than punch through it. Letter-spacing is consistently tightened at -0.01em across all sizes, giving the rounded Poppins letterforms a slightly more compact, intentional feel rather than the default airy spacing. · `--font-poppins`
- **Substitute:** Plus Jakarta Sans, DM Sans
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 40, 44, 46, 48, 70, 90
- **Line height:** 1.00–2.29
- **Letter spacing:** -0.01em across all sizes
- **Role:** Exclusive brand typeface used for every text element. The 300-weight whisper at 70–90px for hero headlines is the signature move — most productivity apps use bold display weights, but Reclaim's thin Poppins headlines float above the page rather than punch through it. Letter-spacing is consistently tightened at -0.01em across all sizes, giving the rounded Poppins letterforms a slightly more compact, intentional feel rather than the default airy spacing.

### Inter — Secondary fallback used only in 24 specific UI spots — effectively negligible. Treat as legacy or data-table context, not a design system font. · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400, 500
- **Sizes:** 12, 13, 18
- **Line height:** 1.00–2.46
- **Role:** Secondary fallback used only in 24 specific UI spots — effectively negligible. Treat as legacy or data-table context, not a design system font.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | -0.1px | `--text-caption` |
| body | 14px | 1.6 | -0.14px | `--text-body` |
| body-lg | 16px | 1.6 | -0.16px | `--text-body-lg` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.24px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.4px | `--text-heading` |
| heading-lg | 48px | 1.1 | -0.48px | `--text-heading-lg` |
| display | 70px | 1.05 | -0.7px | `--text-display` |
| display-xl | 90px | 1 | -0.9px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 10px |
| inputs | 10px |
| avatars | 100px |
| buttons | 100px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 20px

## Components

### Pill Primary Button (Violet)
**Role:** Main call-to-action — 'Get started free', primary conversion actions

100px border-radius (full pill), Iris Violet (#5562eb) fill, white text, Poppins 14px weight 500, 16px vertical × 24px horizontal padding. No shadow. On hover shifts to Sapphire Violet (#3451e8).

### Pill Ghost Button
**Role:** Secondary CTA — 'Book a demo' on lavender canvas

100px border-radius, transparent fill, Iris Violet (#5562eb) 1.5px border, Iris Violet text, Poppins 14px weight 500, 14px vertical × 22px horizontal padding. Becomes filled violet on hover with white text.

### Dark Pill Button (Nav)
**Role:** High-contrast nav action — 'Get Started' in the top right

100px border-radius, Midnight Ink (#181d25) fill, white text, Poppins 14px weight 500, 8px vertical × 16px horizontal padding. Compact sizing for nav density.

### Outlined Nav Button
**Role:** Secondary nav action — 'Book a Demo' in top right

100px border-radius, white fill, Midnight Ink (#181d25) 1px border, Midnight Ink text, Poppins 14px weight 500, 8px vertical × 16px horizontal padding.

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-width, Lavender Mist (#c2caf9) background, Midnight Ink text, Poppins 12px weight 500, centered, 8px vertical padding. Often contains a subtle arrow link in Iris Violet.

### Top Navigation
**Role:** Primary site navigation

White or transparent background over lavender canvas, Poppins 14px weight 500 for menu items in Midnight Ink, logo on left, action buttons right. No drop shadow — uses white-to-lavender contrast for separation.

### Product Mockup Card
**Role:** Hero product screenshot container

White (#ffffff) surface, 10px border-radius, no visible shadow, contains the calendar UI mockup. Often placed against the lavender canvas with generous padding (40px+).

### Calendar Time Block
**Role:** Functional UI element inside the product — represents scheduled focus time

Focus Green (#7ac17b) fill, 3px border-radius, white text, Poppins 11-12px. The specific color-coding makes the product visualization itself part of the brand system.

### Stat Number Block
**Role:** Large metric display in the social-proof band

Focus Green (#7ac17b) at 90px Poppins weight 300, with a Slate (#474747) label below at 14px Poppins weight 400. Vertically separated by thin Mist (#ececec) dividers between stats.

### Trust Badge Row
**Role:** Social proof microcopy under hero CTAs

Horizontal row of small checkmark + text items, Poppins 12px weight 400 in Slate, with Iris Violet checkmark icons. 20px gap between items.

### Feature Card
**Role:** Mid-page feature highlights

White surface, 10px border-radius, no shadow or extremely subtle 0 1px 2px rgba(0,0,0,0.04), 32px padding, contains a small Poppins heading-sm and Slate body text.

### Gradient Hero Text
**Role:** Signature hero headline treatment

Words in the hero headline receive a linear-gradient(120deg, #5562eb 40%, #7ac17b 61%) text fill, Poppins 70-90px weight 300. This violet-to-green gradient on select words is the most recognizable visual signature of the brand.

### Section Header
**Role:** Reusable section title block

Poppins 40-48px weight 400 in Midnight Ink, left-aligned, with 16-20px margin to optional Slate subtitle. No eyebrow text or label above.

## Do's and Don'ts

### Do
- Use Poppins exclusively for all text; never substitute Inter, Roboto, or system fonts in production UI
- Set border-radius to 100px for all buttons, tags, and avatars to maintain the pill-shaped identity
- Use Iris Violet (#5562eb) as the single primary action color — never introduce a second blue or accent for CTAs
- Keep headlines at weight 300 or 400 — never bold (600+) display text, the whisper-weight is the signature
- Apply the violet-to-green gradient (linear-gradient(120deg, #5562eb 40%, #7ac17b 61%)) only to hero headline words, not to buttons or backgrounds
- Use the lavender canvas (#ebefff) as the page base — white-only pages break the brand atmosphere
- Reserve Focus Green (#7ac17b) for calendar time blocks and positive stat numbers, not for success toasts or status badges

### Don't
- Do not use drop shadows on cards — Reclaim uses border-radius and surface contrast instead of elevation
- Do not introduce a new accent color (orange, pink, teal) — the system is two-color: Iris Violet + Focus Green
- Do not use weight 700 or 800 for any text — Poppins tops out at 600 and most display text is 300-400
- Do not use 0px border-radius on any container — minimum 3px, standard 10px for cards
- Do not apply the violet-green gradient to buttons, backgrounds, or full headlines — only individual words in hero text
- Do not use pure white (#ffffff) as the page background — the lavender canvas is the brand base
- Do not use box-shadow for hover or focus states — use color shift to Sapphire Violet (#3451e8) instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Lavender Canvas | `#ebefff` | Page-level background, hero wash, section bands — the atmospheric base |
| 1 | White Card | `#ffffff` | Product mockup containers, pricing cards, feature blocks — clean resting layer |
| 2 | Mint Wash | `#daf0db` | Green-tinted callout sections, stat highlights, success panels |
| 3 | Lavender Mist | `#c2caf9` | Subtle violet-tinted panels, decorative bands, soft section dividers |

## Elevation

- **Product Mockup Card:** `none — relies on lavender canvas contrast for separation`
- **Feature Card:** `0 1px 2px rgba(0,0,0,0.04) maximum, often zero`

## Imagery

Product mockups dominate — specifically the calendar UI itself rendered as a clean flat illustration on a white card against the lavender canvas. The calendar uses solid green blocks with no shadows or gradients on the time blocks themselves. Photography is absent from the hero. Decorative visuals are limited to: a subtle dotted/grid texture visible on the lavender background, the gradient text treatment, and small flat icons in line with the rounded Poppins aesthetic. The product visualization IS the hero imagery — no lifestyle photos, no abstract 3D renders.

## Layout

Max-width 1200px centered container, but the lavender canvas extends full-bleed. Hero is a two-column split: massive left-aligned headline (50% width) with product mockup card on the right (50% width), generous vertical breathing room. Sections alternate between lavender canvas bands and white card blocks without harsh dividers. The stats section uses a 4-column equal grid with thin vertical separators. Feature sections follow a consistent left-text / right-visual alternating pattern. Navigation is a clean top bar with logo left, menu center-left, action buttons right — no sticky behavior evident. Page density is comfortable, not compact — large vertical gaps (80px+) between sections, never tight stacking.

## Agent Prompt Guide

**Quick Color Reference**
- text: #181d25 (primary), #474747 (muted)
- background: #ebefff (canvas), #ffffff (cards)
- border: #ececec (hairline), #5562eb (interactive)
- accent (text/gradient word): #5562eb → #7ac17b gradient
- primary action: no distinct CTA color

**3 Example Component Prompts**

1. *Hero headline with gradient accent word*: Render a headline at 90px Poppins weight 300, #181d25, letter-spacing -0.9px. The second word in the headline uses a linear-gradient(120deg, #5562eb 40%, #7ac17b 61%) text fill. Below: Poppins 16px weight 400, #474747 subtitle. CTAs: Iris Violet (#5562eb) pill button (100px radius, white text, Poppins 14px weight 500, 16px/24px padding) and a ghost pill button (100px radius, transparent fill, 1.5px #5562eb border, #5562eb text). Canvas: #ebefff.

2. *Product mockup card*: White (#ffffff) surface, 10px border-radius, no shadow, 32px internal padding, placed on a #ebefff lavender canvas. Inside: a simplified calendar grid with day headers (MON/TUE/WED) in Poppins 11px weight 500, #474747, and Focus Green (#7ac17b) 3px-radius time blocks with white Poppins 12px text.

3. *Stat number band*: Four columns separated by 1px #ececec vertical dividers. Each column: Focus Green (#7ac17b) at 90px Poppins weight 300 for the number, with a Slate (#474747) Poppins 14px weight 400 label below. Background: white or lavender canvas. Section sits inside a max-width 1200px container.

## Similar Brands

- **Clockwise** — Same calendar-scheduling product category, identical lavender-canvas atmosphere, same pill-shaped buttons, and the same violet-to-green gradient text treatment in the hero
- **Notion** — Lavender-tinted canvas with white card surfaces, same avoidance of heavy shadows, and a similarly friendly single-accent-color approach
- **Linear** — Clean pill buttons, single vivid accent color against a light tinted canvas, and whisper-weight large headlines
- **Cal.com** — Open-source scheduling tool with comparable lavender page atmosphere and minimalist calendar-illustration hero treatment

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lavender-canvas: #ebefff;
  --color-white-surface: #ffffff;
  --color-midnight-ink: #181d25;
  --color-pure-black: #000000;
  --color-graphite: #111111;
  --color-slate: #474747;
  --color-charcoal: #2b2b2b;
  --color-stone: #333333;
  --color-mist: #ececec;
  --color-iris-violet: #5562eb;
  --color-sapphire-violet: #3451e8;
  --color-lavender-mist: #c2caf9;
  --color-periwinkle: #96a0f3;
  --color-indigo-depth: #151f8b;
  --color-focus-green: #7ac17b;
  --color-mint-whisper: #daf0db;
  --color-forest-edge: #14532d;
  --color-brick: #5a1a1a;

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.1px;
  --text-body: 14px;
  --leading-body: 1.6;
  --tracking-body: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.4px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.48px;
  --text-display: 70px;
  --leading-display: 1.05;
  --tracking-display: -0.7px;
  --text-display-xl: 90px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.9px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-full: 100px;
  --radius-full-2: 200px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 10px;
  --radius-inputs: 10px;
  --radius-avatars: 100px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-lavender-canvas: #ebefff;
  --surface-white-card: #ffffff;
  --surface-mint-wash: #daf0db;
  --surface-lavender-mist: #c2caf9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lavender-canvas: #ebefff;
  --color-white-surface: #ffffff;
  --color-midnight-ink: #181d25;
  --color-pure-black: #000000;
  --color-graphite: #111111;
  --color-slate: #474747;
  --color-charcoal: #2b2b2b;
  --color-stone: #333333;
  --color-mist: #ececec;
  --color-iris-violet: #5562eb;
  --color-sapphire-violet: #3451e8;
  --color-lavender-mist: #c2caf9;
  --color-periwinkle: #96a0f3;
  --color-indigo-depth: #151f8b;
  --color-focus-green: #7ac17b;
  --color-mint-whisper: #daf0db;
  --color-forest-edge: #14532d;
  --color-brick: #5a1a1a;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.1px;
  --text-body: 14px;
  --leading-body: 1.6;
  --tracking-body: -0.14px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.4px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.48px;
  --text-display: 70px;
  --leading-display: 1.05;
  --tracking-display: -0.7px;
  --text-display-xl: 90px;
  --leading-display-xl: 1;
  --tracking-display-xl: -0.9px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-full: 100px;
  --radius-full-2: 200px;
}
```
