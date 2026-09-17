# Cake Equity — Style Reference
> founder's command center on warm bone-white, electric violet switches, chartreuse receipts

**Theme:** light

Cake Equity uses a founder-financial command-center language: warm bone-white canvas (#fafaf8) with confident dark near-black type (#18161a), one electric deep-violet primary (#4823ff) that drives every conversion surface, and a single chartreuse accent (#e7ff6e) used sparingly as a highlight receipt on the top bar. The system is quiet and orderly — a single color does the loud work, while lighter tints of violet (#ede9ff, #d9d2ff) build soft structure around content. Typography is split-purpose: Plus Jakarta Sans 700 slams display headlines with negative tracking, while Inter handles all UI and body at measured weights (400/500). Cards and containers round generously at 20px, buttons become fully pill-shaped (100px), and the grid is spacious rather than dense — a financial tool that breathes instead of cramming data.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#4823ff` | `--color-electric-violet` | Primary action buttons, filled CTAs, link accents, key icon strokes — the deepest saturated violet in the system carries every conversion moment with maximum voltage against the warm canvas |
| Voltage Mid | `#7e78ff` | `--color-voltage-mid` | Hover and active states on the primary violet, selected nav background, secondary fills — carries the brand's chromatic weight when Electric Violet is too loud |
| Iris Accent | `#6d67fb` | `--color-iris-accent` | Violet outline accent for tags, dividers, and focused UI edges. |
| Lilac Wash | `#ede9ff` | `--color-lilac-wash` | Soft section backgrounds, card borders on light surfaces, tinted containers — the lightest tint of the brand violet, used to suggest brand presence without committing to full color |
| Periwinkle Border | `#d9d2ff` | `--color-periwinkle-border` | Repeated decorative border tint on light surfaces — sits between Lilac Wash and Iris Accent to provide mid-violet hairline structure on cards and feature frames |
| Chartreuse Receipt | `#e7ff6e` | `--color-chartreuse-receipt` | Promotional top banner, highlight callouts, dark-card accent fill — the lone non-violet chromatic in the system, used as a small loud receipt that draws the eye to announcements |
| Powder Blue | `#99cefe` | `--color-powder-blue` | Soft highlight washes on product UI mockups, subtle background tints — a cool counterpoint to the warm violet palette, appears only in product screenshots and small badges |
| Bone Canvas | `#fafaf8` | `--color-bone-canvas` | Page background, hero canvas, the base layer every surface sits on — a near-white with a barely-warm cast that distinguishes the system from stark pure white |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, button text on dark fills, product UI chrome — the brightest layer above the Bone Canvas |
| Obsidian Ink | `#18161a` | `--color-obsidian-ink` | Primary text, dominant borders, dark product card backgrounds, button text on light fills — a near-black with the faintest violet cast that ties dark surfaces back to the brand |
| Carbon Border | `#333333` | `--color-carbon-border` | Structural borders on cards and dividers, secondary text in dense lists, icon strokes on dark surfaces |
| Graphite | `#222222` | `--color-graphite` | Navigation borders, secondary button borders, supporting text — a dark neutral that sits between Obsidian Ink and Carbon Border |
| Slate Helper | `#898b91` | `--color-slate-helper` | Muted helper text, inactive form labels, low-priority dividers |
| Lavender Gray | `#9e99ab` | `--color-lavender-gray` | Muted secondary text, subtle card borders on lighter surfaces — carries a slight cool-violet undertone that keeps it from clashing with the brand palette |
| Midnight Surface | `#1e1b22` | `--color-midnight-surface` | Dark feature card backgrounds (e.g. cap table live view), product showcase panels — a violet-tinted near-black for dark cards in a light-themed system |

## Tokens — Typography

### Plus Jakarta Sans — Display headlines — the only place this font appears, reserved for hero and section titles where a heavy condensed-ish sans slams the page with negative tracking; tighter than Inter at the same size gives display lines extra punch · `--font-plus-jakarta-sans`
- **Substitute:** Manrope
- **Weights:** 700
- **Sizes:** 63px, 77px
- **Line height:** 1.00
- **Letter spacing:** -0.0400em at 77px, -0.0320em at 63px
- **Role:** Display headlines — the only place this font appears, reserved for hero and section titles where a heavy condensed-ish sans slams the page with negative tracking; tighter than Inter at the same size gives display lines extra punch

### Inter — Body text and subheadings — Inter at 400 with mild negative tracking is the working voice of the system; compact comfortable line-height (1.4-1.5) keeps paragraphs dense without crowding · `--font-inter`
- **Weights:** 400
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 31px
- **Line height:** 1.40-1.60
- **Letter spacing:** -0.0100em to -0.0010em for body sizes 16-22px, 0em at 14-15px
- **Role:** Body text and subheadings — Inter at 400 with mild negative tracking is the working voice of the system; compact comfortable line-height (1.4-1.5) keeps paragraphs dense without crowding

### Inter — Navigation links, card titles, emphasized UI labels, feature sub-headers — the medium weight gives nav and metadata enough presence to scan without competing with headings · `--font-inter`
- **Weights:** 500
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 31px
- **Line height:** 1.40-1.50
- **Letter spacing:** -0.0010em to 0.0040em
- **Role:** Navigation links, card titles, emphasized UI labels, feature sub-headers — the medium weight gives nav and metadata enough presence to scan without competing with headings

### Inter — Button labels, badge text, strong inline emphasis — the weight of commitment, used where the user is being asked to act or read something important at small sizes · `--font-inter`
- **Weights:** 600
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 31px
- **Line height:** 1.30-1.50
- **Letter spacing:** -0.0100em to -0.0010em
- **Role:** Button labels, badge text, strong inline emphasis — the weight of commitment, used where the user is being asked to act or read something important at small sizes

### Inter — Section eyebrows, uppercase tracking labels, small-caps-feel tags — the heaviest Inter weight carries tracked-out uppercase eyebrows (e.g. 'FEATURES', 'CAP TABLE MANAGEMENT') that frame sections · `--font-inter`
- **Weights:** 700
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 31px
- **Line height:** 1.20-1.40
- **Letter spacing:** 0.0040em to 0.0500em (uppercase labels, badges)
- **Role:** Section eyebrows, uppercase tracking labels, small-caps-feel tags — the heaviest Inter weight carries tracked-out uppercase eyebrows (e.g. 'FEATURES', 'CAP TABLE MANAGEMENT') that frame sections

### Inter — Sub-headlines and sub-copy beneath Plus Jakarta Sans displays — the light weight creates a deliberate typographic contrast where the heavy display does the shouting and the thin Inter does the whispering · `--font-inter`
- **Weights:** 300
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 31px
- **Line height:** 1.20-1.50
- **Letter spacing:** -0.0200em at 22-31px, -0.0010em at 16-20px
- **Role:** Sub-headlines and sub-copy beneath Plus Jakarta Sans displays — the light weight creates a deliberate typographic contrast where the heavy display does the shouting and the thin Inter does the whispering

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | 0.05px | `--text-caption` |
| body | 16px | 1.5 | -0.001px | `--text-body` |
| subheading | 20px | 1.4 | -0.01px | `--text-subheading` |
| heading-sm | 22px | 1.3 | -0.02px | `--text-heading-sm` |
| heading | 31px | 1.2 | -0.032px | `--text-heading` |
| display | 77px | 1 | -0.04px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 84 | 84px | `--spacing-84` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 20px |
| icons | 50px |
| small | 12px |
| buttons | 100px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary Filled Button
**Role:** Main conversion CTA (Get started free, Book a demo)

Background #4823ff (Electric Violet), text #ffffff in Inter 600 at 15-16px, padding 10px 22px, border-radius 100px (full pill). High-contrast on both #fafaf8 and #ffffff canvases. No border or shadow.

### Outlined Action Button
**Role:** Secondary conversion CTA (Book a demo in nav)

Background transparent, border 1.5px #4823ff, text #4823ff in Inter 600 at 15-16px, padding 10px 22px, border-radius 100px. Mirrors the pill geometry of the filled variant.

### Ghost Text Link
**Role:** Inline action (Learn more →)

No background or border, text in Inter 500 at 15-16px, color #4823ff with an arrow character. Underline only on hover. Used for tertiary navigation within content.

### Promotional Banner Bar
**Role:** Top-of-page announcement

Full-width #e7ff6 (Chartreuse Receipt) background, centered Inter 500 text in #18161a, small close button at right. Height ~40px. The only place chartreuse appears at scale.

### Feature Card (Light)
**Role:** Product feature showcase panel

Background #ffffff, border 1px #d9d2ff (Periwinkle Border), border-radius 20px, internal padding 20px. Contains a product screenshot on the left, headline + bullet list on the right.

### Dark Product Showcase Card
**Role:** Live data or product preview display

Background #1e1b22 (Midnight Surface), border-radius 20px, padding 20px. Contains user rows with colored avatar tiles, progress bars in #e7ff6 and other brand tints, and accent text in Iris Accent or white.

### Testimonial Card
**Role:** Social proof quote card

Background #ffffff, border 1px #ede9ff or none, border-radius 20px, padding 20px. Contains quote text in Inter 400, small circular avatar photo, name in Inter 600, title in Inter 400 #898b91.

### Navigation Bar
**Role:** Top-level site navigation

Background transparent over Bone Canvas, logo left, nav links (Product, Solutions, Resources, Customers, Pricing) in Inter 500, right side holds Login text link + Outlined Action Button + Primary Filled Button. Sticky on scroll.

### Section Eyebrow Label
**Role:** Small uppercase label above section headings

Inter 700 at 11-13px, letter-spacing 0.05em, uppercase, color #4823ff or Obsidian Ink. Often paired with a small icon glyph (e.g. rocket for FEATURES).

### G2 Badge / Award Tile
**Role:** Third-party trust badge display

Small card ~80x80px, white background, 1px #ede9ff border, border-radius 12px, contains G2 logo, award title, and quarter label. Displayed in a horizontal row.

### Rating Display
**Role:** Social proof rating indicator

Inter 500 numeric rating (e.g. 4.8/5) in Obsidian Ink, followed by 5 small gold/violet star icons, with review count caption in Inter 400 #898b91 below.

### Play Button Overlay
**Role:** Video thumbnail trigger

Circular 60px button, background #ede9ff (Lilac Wash) with #4823ff play triangle icon centered, positioned over product screenshot thumbnails to indicate video content.

### Avatar Tile
**Role:** User identifier in product UI

Circular 32-40px tile with 2-letter initials in white Inter 600, background colored from a fixed palette (violet, blue, orange, green tints). Used in shareholder lists and testimonial cards.

### Pill Tag / Badge
**Role:** Small categorical label

Background tinted (Lilac Wash, Powder Blue, or Chartreuse), text in matching darker tone, Inter 600 at 12-13px, border-radius 999px, padding 4px 12px. Used for status indicators and labels.

## Do's and Don'ts

### Do
- Use Electric Violet (#4823ff) as the only filled button background — every primary action should commit to this single deep violet
- Round all cards and feature panels to exactly 20px — this is the system's structural radius and should not be reduced
- Use 100px (full pill) border-radius for all buttons, never rectangular button geometry
- Set display headlines in Plus Jakarta Sans 700 at 63-77px with letter-spacing between -0.04em and -0.032em — never substitute Inter for display
- Place the chartreuse (#e7ff6e) accent only on the promotional banner and dark-card highlights — keep it as a receipt, not a theme
- Define cards with 1px tinted borders (#d9d2ff or #ede9ff) rather than drop shadows — the system is flat by design
- Use Inter 300 for sub-copy beneath display headlines to create the heavy-display / light-body typographic contrast

### Don't
- Don't introduce a second primary action color — Electric Violet is the sole CTA fill; all other actions should be outlined or ghost
- Don't use chartreuse (#e7ff6e) for body content, icons, or large fills — it is reserved for the banner receipt and dark-card accents only
- Don't set display headlines in Inter — Plus Jakarta Sans 700 is the only display face, and mixing fonts at display sizes breaks the system's voice
- Don't apply drop shadows to cards or panels — the system is border-defined, and shadows would add unwanted softness
- Don't use rectangular or 8px-radius buttons — all buttons must be fully pill-shaped (100px)
- Don't place white or near-white cards directly on the Bone Canvas without a border — the warm near-white and pure white are too close in luminance and need a tinted border to separate
- Don't use the dark Midnight Surface (#1e1b22) for more than one section per page — dark surfaces are sparing punctuation, not dominant layout

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#fafaf8` | Page background, hero section, default canvas |
| 2 | Paper White | `#ffffff` | Card surfaces, feature panels, elevated content blocks |
| 3 | Lilac Wash | `#ede9ff` | Tinted section backgrounds, soft feature containers |
| 4 | Chartreuse Receipt | `#e7ff6` | Promotional banner, highlight callout, accent fill on dark cards |
| 5 | Midnight Surface | `#1e1b22` | Dark product showcase cards, live data displays |

## Elevation

- **Dark Product Showcase Card:** `0 0 0 1px rgba(24, 22, 26, 0.04)`

## Imagery

The site is product-UI-driven rather than photography-driven. Visuals consist of dark-themed product screenshots (cap table live views, shareholder lists, equity compliance forms) embedded as showcase cards within the light page. The product chrome is rendered with colored avatar tiles, progress bars in chartreuse and violet, and tabular data rows. The only photographic content is small circular headshots in testimonial cards and an overlapping row of founder faces in the hero. A single purple play-button overlay signals video content. No lifestyle photography, no abstract illustration, no 3D renders — the product UI is the hero visual and everything else is typography.

## Layout

The page is a max-width 1200px centered column on a Bone Canvas (#fafaf8) background. The hero is a two-column split: left half holds the eyebrow label, oversized display headline, sub-copy, rating row, and a single primary CTA; right half holds a dark Midnight Surface product card showing live cap table data. Below the hero, a full-bleed dark testimonial ticker band runs edge-to-edge, followed by a centered G2 badge row. Feature sections alternate between light (Paper White feature cards with video thumbnails) and slightly tinted (Lilac Wash) backgrounds, each with a left-aligned product screenshot card and right-aligned text + bullet list. Navigation is a top bar with logo left, center nav links, and right-aligned action buttons. Section gaps are ~80px, card padding is consistently 20px, and the grid breathes with generous whitespace rather than packing content.

## Agent Prompt Guide

**Quick Color Reference**
- text: #18161a
- background: #fafaf8
- surface: #ffffff
- border: #d9d2ff
- accent: #e7ff6e
- primary action: #4823ff (filled action)

**3-5 Example Component Prompts**
1. Create a Primary Action Button: #4823ff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Build a dark product showcase card: background #1e1b22 (Midnight Surface), border-radius 20px, padding 20px. Header row with white label and a chartreuse (#e7ff6e) pill badge. Three user rows below: circular avatar tile (32px) with 2-letter initials in white Inter 600, name in white Inter 500, and a horizontal progress bar using chartreuse (#e7ff6e) and violet (#7e78ff) fills with a percentage label at right.

3. Build a feature card: Paper White (#ffffff) background, 1px border in Periwinkle Border (#d9d2ff), border-radius 20px, padding 20px. Left side: product screenshot placeholder with a 60px circular Lilac Wash (#ede9ff) play button centered, containing an Electric Violet (#4823ff) triangle. Right side: Inter 400 18px subhead in #18161a, four bullet items each prefixed with a small Electric Violet (#4823ff) check icon, and a 'Learn more →' ghost text link in #4823ff Inter 500.

4. Build a testimonial card: Paper White (#ffffff) background, no border or 1px #ede9ff, border-radius 20px, padding 20px. Quote text in Inter 400 16px #18161a. Bottom row: 40px circular headshot, name in Inter 600 15px #18161a, title in Inter 400 13px Slate Helper (#898b91).

5. Build the top navigation: transparent background over Bone Canvas, height ~64px, padding 0 40px. Left: wordmark logo. Center: nav links in Inter 500 15px #18161a (Product, Solutions, Resources, Customers, Pricing) with dropdown chevrons on some items. Right: 'Login' ghost text link in #18161a, an outlined 'Book a demo' button with 1.5px #4823ff border and #4823ff text at 100px radius, and a filled 'Get started free' button in #4823ff with white text at 100px radius.

## Similar Brands

- **Carta** — Same cap-table management domain and dark-product-card-in-light-page layout pattern, though Cake uses a more electric violet and tighter pill geometry than Carta's softer blue-green
- **Pulley** — Same equity-management space, similar product-UI-as-hero approach with dark dashboard cards floating on a light canvas, and comparable use of a single saturated brand color against neutral chrome
- **Mercury** — Shared typographic restraint — a single bold display face paired with Inter for UI, pill-shaped buttons, and a light-canvas + dark-elevated-card surface stack
- **Brex** — Similar financial-tool aesthetic with deep saturated brand color on warm off-white canvas, generous card radii, and product screenshots embedded as the primary visual content

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #4823ff;
  --color-voltage-mid: #7e78ff;
  --color-iris-accent: #6d67fb;
  --color-lilac-wash: #ede9ff;
  --color-periwinkle-border: #d9d2ff;
  --color-chartreuse-receipt: #e7ff6e;
  --color-powder-blue: #99cefe;
  --color-bone-canvas: #fafaf8;
  --color-paper-white: #ffffff;
  --color-obsidian-ink: #18161a;
  --color-carbon-border: #333333;
  --color-graphite: #222222;
  --color-slate-helper: #898b91;
  --color-lavender-gray: #9e99ab;
  --color-midnight-surface: #1e1b22;

  /* Typography — Font Families */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.05px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.001px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.02px;
  --text-heading: 31px;
  --leading-heading: 1.2;
  --tracking-heading: -0.032px;
  --text-display: 77px;
  --leading-display: 1;
  --tracking-display: -0.04px;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-84: 84px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 20px;
  --radius-icons: 50px;
  --radius-small: 12px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-bone-canvas: #fafaf8;
  --surface-paper-white: #ffffff;
  --surface-lilac-wash: #ede9ff;
  --surface-chartreuse-receipt: #e7ff6;
  --surface-midnight-surface: #1e1b22;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #4823ff;
  --color-voltage-mid: #7e78ff;
  --color-iris-accent: #6d67fb;
  --color-lilac-wash: #ede9ff;
  --color-periwinkle-border: #d9d2ff;
  --color-chartreuse-receipt: #e7ff6e;
  --color-powder-blue: #99cefe;
  --color-bone-canvas: #fafaf8;
  --color-paper-white: #ffffff;
  --color-obsidian-ink: #18161a;
  --color-carbon-border: #333333;
  --color-graphite: #222222;
  --color-slate-helper: #898b91;
  --color-lavender-gray: #9e99ab;
  --color-midnight-surface: #1e1b22;

  /* Typography */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.05px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.001px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.02px;
  --text-heading: 31px;
  --leading-heading: 1.2;
  --tracking-heading: -0.032px;
  --text-display: 77px;
  --leading-display: 1;
  --tracking-display: -0.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-84: 84px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 999px;
}
```
