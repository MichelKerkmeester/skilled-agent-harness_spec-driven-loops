# Ghost — Style Reference
> Monumental type on infinite white paper

**Theme:** mixed

Ghost speaks at full volume through typography alone: monumental Inter Display headlines (72–96px, weight 600, tracking -0.025em) command the white canvas, then drop to InterVariable for compact, functional body text. The page alternates between two distinct modes — bright white editorial sections with massive headlines and product/dashboard sections rendered in near-black (#15171a) with vivid purple-pink chart gradients. A single chromatic accent — electric lime (#d1ff19) — punctuates links and emphasis against the achromatic backbone, while a warm amber pill (#fec137) handles announcement chips. Components stay soft and approachable: 24px radius on primary controls, 8px on cards, layered 0.1-alpha shadows that hint at elevation without weight. The rhythm is editorial — enormous headlines, generous vertical breathing room, centered or left-aligned stacks, with dark product cards providing visual counterpoint to the white marketing canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#15171a` | `--color-ink-black` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills |
| Mist Gray | `#e5e7eb` | `--color-mist-gray` | Hairline borders, subtle dividers, ghost surfaces — the dominant neutral that softens the white-on-white hierarchy |
| Slate Veil | `#94a3b8` | `--color-slate-veil` | Muted body text, secondary metadata, nav placeholders — desaturated blue-gray reads as informational without competing with headlines |
| Graphite | `#64748b` | `--color-graphite` | Body text on light backgrounds, supporting copy, link underlines |
| Charcoal | `#334155` | `--color-charcoal` | Emphasized body text, sub-labels, card headings on light surfaces |
| Deep Forest | `#112220` | `--color-deep-forest` | Headline color on white — the darkest near-black used for display copy, warmer than #15171a |
| Carbon | `#1f2937` | `--color-carbon` | Heavy borders on cards and dashboard panels — the border workhorse for dark UI elements |
| Smoke | `#cbd5e1` | `--color-smoke` | Icon strokes, secondary borders, disabled state outlines |
| Pure Black | `#000000` | `--color-pure-black` | Maximum-contrast text on light, SVG fill for logos and icons |
| Voltage Lime | `#d1ff19` | `--color-voltage-lime` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Moss | `#1a2e05` | `--color-moss` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lime Highlight | `#bef264` | `--color-lime-highlight` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Amber Pulse | `#fec137` | `--color-amber-pulse` | Yellow supporting accent for decorative details and low-frequency emphasis. |

## Tokens — Typography

### InterDisplay — All display headlines, hero copy, section titles, link emphasis. Sizes scale aggressively from 18px subheads to 96px hero — the range itself is the brand. Weight 600 dominates at display sizes; 700 is reserved for the largest hero. · `--font-interdisplay`
- **Substitute:** Inter (variable) or system-ui at equivalent weights
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 15, 18, 20, 24, 36, 48, 72, 96
- **Line height:** 0.90, 1.00, 1.15, 1.25, 1.35, 1.50
- **Letter spacing:** -0.025em at 36px and above; 0.1em at 12px (uppercase labels)
- **OpenType features:** `"calt", "cv10", "cv11", "liga", "ss01", "ss03"`
- **Role:** All display headlines, hero copy, section titles, link emphasis. Sizes scale aggressively from 18px subheads to 96px hero — the range itself is the brand. Weight 600 dominates at display sizes; 700 is reserved for the largest hero.

### InterVariable — Body copy, nav items, button labels, list text, captions, table data. Weight 400 is the default; 500 for emphasized inline text; 600 for button labels and active nav. Never used above 15px — the hierarchy jumps from 15px body to 18px subhead, leaving a clear gap between reading text and display. · `--font-intervariable`
- **Substitute:** Inter (static) or system-ui at equivalent weights
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 15
- **Line height:** 1.25, 1.50
- **OpenType features:** `"calt", "cv10", "cv11", "liga", "ss01", "ss03"`
- **Role:** Body copy, nav items, button labels, list text, captions, table data. Weight 400 is the default; 500 for emphasized inline text; 600 for button labels and active nav. Never used above 15px — the hierarchy jumps from 15px body to 18px subhead, leaving a clear gap between reading text and display.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 1.2px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| subheading | 18px | 1.35 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.6px | `--text-heading-sm` |
| heading | 36px | 1.25 | -0.9px | `--text-heading` |
| heading-lg | 48px | 1.15 | -1.2px | `--text-heading-lg` |
| display | 72px | 1 | -1.8px | `--text-display` |
| hero | 96px | 0.9 | -2.4px | `--text-hero` |

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
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 9999px |
| images | 16px |
| inputs | 8px |
| buttons | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 0px 1px 0px, rgba(0, 0, 0, 0.03) 0...` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Action Button
**Role:** Main CTA — nav sign-up, form submission

Fill: #15171a. Text: #ffffff. InterDisplay weight 600 at 15px. Padding: 12px 24px. Radius: 24px. Shadow: rgba(0,0,0,0.1) 0px 0px 1px, rgba(0,0,0,0.03) 0px 2px 6px. The near-black fill is warmer than pure black, giving the button a charcoal presence rather than a flat void. Text is white, fully solid — no opacity tricks.

### Announcement Pill
**Role:** Launch badge, version chip, promotional label

Fill: #fec137 (amber). Text: #112220 (deep forest). InterVariable weight 500 at 12px. Padding: 6px 16px. Radius: 9999px. Sits above the hero headline as a warm signal — the amber draws the eye to the chip before the massive headline takes over.

### Accent Lime Button
**Role:** Secondary action, emphasis CTA on dark backgrounds

Fill: #d1ff19 (voltage lime). Text: #112220. InterDisplay weight 600 at 15px. Padding: 12px 24px. Radius: 24px. The high-chroma lime against white or near-black creates the strongest possible contrast in the system — use sparingly.

### Ghost Navigation Bar
**Role:** Site-wide header

Background: #ffffff. Height: 64px. Logo left (Ghost mark + wordmark, #000000). Center: Product / Explore / Resources / Pricing links in InterVariable 14px weight 400, #64748b, expanding dropdowns on hover. Right: Sign in text link (#15171a) + Primary Action Button. Border-bottom: 1px solid #e5e7eb.

### Hero Headline
**Role:** Primary page headline

InterDisplay weight 600 at 72–96px. Color: #112220. Line-height: 0.90–1.00. Letter-spacing: -0.025em. Centered or left-aligned at page max-width. The hero headline is the loudest element on the page — it defines the page before anything else is read.

### Section Body Block
**Role:** Explanatory paragraph below a headline

InterVariable weight 400 at 15px. Color: #334155. Line-height: 1.50. Max-width: 680px for readability. Generous margin-top: 24px from headline. Comfortable density — no compressed line-height tricks.

### Integration Icon Tile
**Role:** Scattered app icons in the integrations section

Background: #ffffff. Padding: 16px. Radius: 8px. Shadow: rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px. Each tile holds a single brand icon (Slack, Twitter, Instagram, etc.) at 48–64px. Tiles are scattered with rotation and varied offsets, not gridded — the playful arrangement contrasts the rigid text alignment above.

### Dark Stats Banner
**Role:** Revenue, user count, or impact metric

Background: #15171a. Full-width section, padding: 80px 0. Number: InterDisplay weight 700 at 96px, #ffffff, letter-spacing -0.025em. Label: InterVariable weight 400 at 15px, #94a3b8, max-width 480px centered. The dark section is the page's visual breather — it provides contrast to the white sections above and below.

### Dashboard Product Card
**Role:** Product screenshot, app preview

Background: #15171a (dark dashboard surface). Radius: 16px. Shadow: rgba(0,0,0,0.25) 0px 25px 50px -12px. Contains dark UI with purple-to-pink gradient area charts (#7c3aed → #ec4899). Sidebar navigation in #1f2937, data text in #ffffff and #94a3b8. The card sits on a white page, creating a window-into-the-product effect.

### Feature Card
**Role:** Feature grid item, content card

Background: #ffffff. Border: 1px solid #e5e7eb. Radius: 8px. Padding: 24px. Shadow: rgba(0,0,0,0.1) 0px 10px 15px -3px. Title: InterDisplay weight 600 at 20px, #112220. Body: InterVariable 15px, #64748b. Minimal — no decorative icons inside, just text and generous whitespace.

### Lime Highlight Link
**Role:** Inline emphasis link, highlighted word in a sentence

No background or border. Text color: #d1ff19 only when on dark surfaces (#15171a). On white backgrounds, lime is too low-contrast — use #112220 underline or #64748b. The lime link is a dark-surface only treatment — its job is to glow against black, not to be readable on white.

### Text Input
**Role:** Form input, email capture

Background: #ffffff. Border: 1px solid #cbd5e1. Radius: 8px. Padding: 12px 16px. Text: InterVariable 15px, #112220. Placeholder: #94a3b8. Focus: border-color #15171a, shadow rgba(0,0,0,0.1) 0px 0px 1px, rgba(0,0,0,0.03) 0px 2px 6px. No floating labels — labels sit above the input in InterVariable 14px weight 500, #334155.

## Do's and Don'ts

### Do
- Use InterDisplay weight 600 at 72–96px for hero headlines with letter-spacing -0.025em — the oversized type is the brand's primary visual signature
- Use Voltage Lime (#d1ff19) only on dark surfaces (#15171a) for links and emphasis — it is a dark-mode accent, not a light-mode color
- Apply 24px radius to all primary buttons and 9999px to all pills and tags — the 24px button radius is distinctive and should not be flattened to 4px or 8px
- Pair near-black #15171a (not #000000) for primary action buttons and dark section backgrounds — the slight warmth prevents the harshness of pure black on white
- Use the amber pill (#fec137 fill, #112220 text) exclusively for announcement and launch badges above hero headlines
- Set section gap to 64px and element gap to 16px — the generous vertical breathing room between sections is what makes the page feel editorial rather than dense
- Use InterVariable weight 400 at 15px with line-height 1.50 for all body copy — never compress body text below 1.5

### Don't
- Do not use Voltage Lime (#d1ff19) as text on white backgrounds — it fails contrast; reserve it for dark surfaces only
- Do not flatten button radius below 8px — the 24px radius is core to the system's visual identity; sharp buttons break the look
- Do not use more than one chromatic color per section — the system is achromatic-first; lime and amber are punctuation, not palette
- Do not use #000000 for primary buttons — use #15171a; the pure black reads as terminal/debug, not as brand
- Do not set body text above 15px or below 14px — the hierarchy must jump from body (15px) to subhead (18px) with a visible gap, not interpolate
- Do not add gradients to backgrounds or cards — gradients appear only in product dashboard charts, never in the marketing UI
- Do not use shadows heavier than rgba(0,0,0,0.25) 0px 25px 50px -12px — the system relies on soft, low-alpha layering, not dramatic drop shadows

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas for all marketing sections |
| 1 | Card | `#ffffff` | Integration icon tiles, feature cards — same white as canvas, distinguished by shadow and border |
| 2 | Dark Panel | `#15171a` | Stats banner, product dashboard, dark feature sections |
| 3 | Accent Surface | `#d1ff19` | Lime button fills and highlight blocks |

## Elevation

- **Primary Button:** `rgba(0, 0, 0, 0.1) 0px 0px 1px 0px, rgba(0, 0, 0, 0.03) 0px 2px 6px 0px`
- **Integration Icon Tile:** `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px`
- **Feature Card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Elevated Card / Modal:** `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`

## Imagery

Imagery is split between two modes: product screenshots and brand icon collages. The dashboard preview appears as a dark rounded card (#15171a fill, 16px radius) with purple-to-pink gradient charts, embedded directly in the white marketing page as a window-into-the-product. Integration icons are scattered with rotation and offset positions — not gridded — giving the section a playful, organic arrangement that contrasts the rigid text alignment. No lifestyle photography appears; the product UI and brand logos are the visuals. App icons render in their native brand colors (Twitter blue, Instagram gradient, Slack purple, YouTube red) as small rounded tiles with subtle 4px 6px shadows. The overall density is text-dominant — visuals occupy roughly 20% of the page, type fills the rest.

## Layout

The page alternates between bright white editorial sections and dark product/stats bands in roughly 2:1 ratio. Hero opens with a centered announcement pill + massive 72–96px headline on white, followed by a full-width dark dashboard card spanning near the full page width with generous 48–64px vertical padding. Body sections use a centered max-width 1200px container with 680px text blocks for readability. The integrations section breaks the centered pattern — icons are scattered with rotation across the full width, with a centered text block beneath. The stats banner is full-bleed dark with centered white number. Navigation is a simple top bar: logo left, links center, CTA right, 64px height, white background with 1px #e5e7eb bottom border. No sidebar, no sticky header beyond the nav. Section transitions are seamless — no dividers or colored bands between white sections; the dark sections provide natural visual breaks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #112220 (headlines), #334155 (body), #94a3b8 (muted)
- background: #ffffff (canvas), #15171a (dark sections)
- border: #e5e7eb (hairlines), #cbd5e1 (inputs)
- accent: #d1ff19 (dark-surface only)
- announcement: #fec137
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: white (#ffffff) background. Announcement pill above the headline: fill #fec137, text #112220, InterVariable weight 500 at 12px, padding 6px 16px, radius 9999px. Headline: InterDisplay weight 600 at 96px, #112220, letter-spacing -2.4px, line-height 0.90, centered. Subtext below at InterVariable 15px weight 400, #334155, max-width 680px, centered.

2. Create a dark stats banner: full-width background #15171a, padding 80px 0. Centered metric number: InterDisplay weight 700 at 96px, #ffffff, letter-spacing -2.4px. Label below: InterVariable 15px weight 400, #94a3b8, max-width 480px centered.

3. Create a dashboard product card: background #15171a, radius 16px, shadow rgba(0,0,0,0.25) 0px 25px 50px -12px. Inside: dark sidebar in #1f2937 with nav items in #94a3b8. Main panel: stat numbers in #ffffff, labels in #94a3b8, area chart with gradient from #7c3aed to #ec4899.

4. Create an integration icon tile: background #ffffff, padding 16px, radius 8px, shadow rgba(0,0,0,0.1) 0px 4px 6px -1px. Brand icon centered at 48px. Tiles are scattered with 4–8 degree rotation, not gridded.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Similar Brands

- **Substack** — Same monumental sans-serif headlines at 72–96px on white canvas, same editorial confidence for a publishing audience, same generous vertical rhythm
- **Beehiiv** — Same light-mode marketing pages with oversized Inter headlines, same near-black primary buttons with 24px radius, same publisher-focused visual language
- **Linear** — Same Inter typography with tight letter-spacing on large headings, same achromatic backbone with a single chromatic accent, same product-card-embedded-in-marketing-page pattern
- **Notion** — Same clean white canvas with one bold sans-serif display weight, same product screenshot treatment with rounded dark cards on white

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #15171a;
  --color-paper-white: #ffffff;
  --color-mist-gray: #e5e7eb;
  --color-slate-veil: #94a3b8;
  --color-graphite: #64748b;
  --color-charcoal: #334155;
  --color-deep-forest: #112220;
  --color-carbon: #1f2937;
  --color-smoke: #cbd5e1;
  --color-pure-black: #000000;
  --color-voltage-lime: #d1ff19;
  --color-moss: #1a2e05;
  --color-lime-highlight: #bef264;
  --color-amber-pulse: #fec137;

  /* Typography — Font Families */
  --font-interdisplay: 'InterDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;
  --text-hero: 96px;
  --leading-hero: 0.9;
  --tracking-hero: -2.4px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-images: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 0px 1px 0px, rgba(0, 0, 0, 0.03) 0px 2px 6px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-2: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-card: #ffffff;
  --surface-dark-panel: #15171a;
  --surface-accent-surface: #d1ff19;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #15171a;
  --color-paper-white: #ffffff;
  --color-mist-gray: #e5e7eb;
  --color-slate-veil: #94a3b8;
  --color-graphite: #64748b;
  --color-charcoal: #334155;
  --color-deep-forest: #112220;
  --color-carbon: #1f2937;
  --color-smoke: #cbd5e1;
  --color-pure-black: #000000;
  --color-voltage-lime: #d1ff19;
  --color-moss: #1a2e05;
  --color-lime-highlight: #bef264;
  --color-amber-pulse: #fec137;

  /* Typography */
  --font-interdisplay: 'InterDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;
  --text-hero: 96px;
  --leading-hero: 0.9;
  --tracking-hero: -2.4px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 0px 1px 0px, rgba(0, 0, 0, 0.03) 0px 2px 6px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-2: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
}
```
