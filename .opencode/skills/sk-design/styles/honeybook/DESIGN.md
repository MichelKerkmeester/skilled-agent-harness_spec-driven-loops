# HoneyBook — Style Reference
> sunlit creative studio on warm cream — a bright yellow marquee opening onto white workspace panels and dark pill stamps.

**Theme:** light

HoneyBook uses a sunlit-creative-studio language: a saturated sunshine-yellow hero, warm dark-navy text, and white product surfaces. The visual system is built on the tension between a serif display voice (STK Bureau Serif) and a confident geometric sans (STK Bureau Sans), with a tiny all-caps eyebrow face (STK Gerhard) that whispers 'editorial' above section headers. Buttons are absolute pills — fully rounded, dark-navy, no shadows — making actions feel like physical stamps pressed onto the page. Surfaces stay quiet and white below the fold; the yellow appears as a deliberate color block for hero/marquee moments rather than scattered decoration, creating a recognizable entry-and-rest rhythm across long pages.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Honey Yellow | `#fffa77` | `--color-honey-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Marigold | `#fffa56` | `--color-marigold` | Accent fills on cards, headline underline strokes, icon highlights, secondary callouts — slightly punchier sibling of Honey Yellow for moments that need to sit on white |
| Inkwell | `#142127` | `--color-inkwell` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Carbon | `#131416` | `--color-carbon` | Body text and high-contrast borders on light surfaces, alt dark fill for emphasis blocks |
| Slate Gray | `#343c40` | `--color-slate-gray` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Pebble | `#63696c` | `--color-pebble` | Muted helper text, secondary metadata, low-emphasis captions |
| River Mist | `#c7d5d9` | `--color-river-mist` | Card and link borders on white surfaces, hairline dividers — cool enough to feel distinct from the warm yellow system |
| Fog | `#e0e5e7` | `--color-fog` | Subtle borders, disabled state outlines, very light separators |
| Paper White | `#ffffff` | `--color-paper-white` | Page and card surfaces, text on dark fills, primary button text |

## Tokens — Typography

### STK Bureau Serif — Display and large headline face — the editorial voice for hero statements, section titles, and feature headlines. Tight tracking (-0.027em to -0.05em) pulls the letters into a dense, magazine-like block. A serif in a SaaS hero is the signature move; it humanizes the product and signals 'crafted for creatives'. · `--font-stk-bureau-serif`
- **Substitute:** Playfair Display, Lora, or DM Serif Display
- **Weights:** 400
- **Sizes:** 16px, 28px, 40px, 48px, 56px, 64px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.0500em, -0.0420em, -0.0310em, -0.0270em
- **Role:** Display and large headline face — the editorial voice for hero statements, section titles, and feature headlines. Tight tracking (-0.027em to -0.05em) pulls the letters into a dense, magazine-like block. A serif in a SaaS hero is the signature move; it humanizes the product and signals 'crafted for creatives'.

### STK Bureau Sans — Workhorse UI and body face — navigation, buttons, paragraphs, form fields, cards. Weights 500–700 handle subheads and CTAs. The pairing with the serif display creates a clear voice hierarchy: serif for poetry, sans for instructions. · `--font-stk-bureau-sans`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px, 48px
- **Line height:** 1.20–1.80
- **Letter spacing:** -0.0500em, -0.0360em, -0.0300em
- **Role:** Workhorse UI and body face — navigation, buttons, paragraphs, form fields, cards. Weights 500–700 handle subheads and CTAs. The pairing with the serif display creates a clear voice hierarchy: serif for poetry, sans for instructions.

### STK Gerhard — Tiny all-caps eyebrow labels above section headers (e.g. 'CAPTURE LEADS') — wide tracking (+0.071em) in uppercase gives every section a labeled, editorial entry point. Used sparingly; one per section, never in body copy. · `--font-stk-gerhard`
- **Substitute:** Inter at 14px with text-transform uppercase and letter-spacing 0.08em
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.20–1.50
- **Letter spacing:** 0.994px
- **Role:** Tiny all-caps eyebrow labels above section headers (e.g. 'CAPTURE LEADS') — wide tracking (+0.071em) in uppercase gives every section a labeled, editorial entry point. Used sparingly; one per section, never in body copy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | -0.7px | `--text-body-sm` |
| body | 16px | 1.5 | -0.8px | `--text-body` |
| subheading | 20px | 1.4 | -0.6px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.72px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.96px | `--text-heading` |
| heading-lg | 48px | 1.1 | -2.4px | `--text-heading-lg` |
| display | 56px | 1.05 | -2.8px | `--text-display` |
| display-lg | 64px | 1 | -1.98px | `--text-display-lg` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 20px |
| images | 20px |
| inputs | 10px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Dark Pill CTA
**Role:** Primary call-to-action button across hero, nav, and product sections

Fully rounded pill (border-radius: 9999px), background #142127, text #ffffff in STK Bureau Sans 16px weight 600, padding 20px 32px, no border, no shadow. The shape is the signature — absolute circles on the ends make every action feel like a physical stamp.

### Ghost Pill Button
**Role:** Secondary outlined button used in nav and inline actions

Border-radius: 9999px, background #ffffff, border 1px solid #c7d5d9, text #142127 in STK Bureau Sans 16px weight 500, padding 20px 32px. Used for 'Log in' and less emphatic CTAs.

### Promo Banner Bar
**Role:** Top-of-page seasonal or offer announcement

Full-bleed horizontal band, background light gray (#edf1f3 implied), centered text in STK Bureau Sans 14px weight 500, flanked by floral illustration decorations, with an inline ghost pill CTA ('CLAIM OFFER'). Height ~56px.

### Navigation Bar
**Role:** Primary site navigation

White background, sticky, max-width 1200px centered, logo left, nav links center (STK Bureau Sans 16px weight 500, #142127), Log in (ghost) + Start for free (dark pill) right. No drop shadow — separation via 1px bottom border #e0e5e7.

### Yellow Hero Section
**Role:** First-screen value proposition

Full-bleed #fffa77 background, centered content stack. Social proof row (★★★★★ 15K+ REVIEWS) in STK Gerhard 14px caps. Headline in STK Bureau Serif 56–64px weight 400, color #142127, tight tracking. Subtext in STK Bureau Sans 18–20px weight 400, #142127. Dark pill CTA below. Tabbed product preview (Project pipeline, Lead capture, etc.) at the bottom edge with underline active state.

### Feature Split Section
**Role:** Two-column feature highlight with screenshot on the right

White background, 1200px max-width, 2-column grid (40% text / 60% visual). Eyebrow label in STK Gerhard 14px caps (#142127). Headline in STK Bureau Serif 48px weight 400. Body in STK Bureau Sans 16px. Right side: app screenshot or composite card mockup with 20px radius.

### Product App Screenshot
**Role:** Embedded product UI screenshot or composite illustration

20px border-radius, white card background, subtle 1px border #c7d5d9, no drop shadow. Shows the actual product interface (Projects view, Lead form, etc.) — used as the 'proof' on the right side of feature splits.

### Tab Navigation Strip
**Role:** Feature category switcher below hero

Horizontal row of 5 tab labels in STK Bureau Sans 16px weight 500, #142127 text. Active tab has a 2px solid #142127 bottom border; inactive tabs are unstyled. No background fill change — just the underline.

### Lead Capture Form Card
**Role:** Product feature showcase — form builder preview

White card, 10px radius, 1px border #c7d5d9, padding 24px. Contains form fields: text inputs with 6px radius, 1px #c7d5d9 border, placeholder #63696c. Above the form: floating stats badge (white, 10px radius, subtle shadow) showing 'New leads: 7' and 'Unread messages: 8'.

### Stats Badge
**Role:** Floating metric callout layered over product imagery

White surface, 10px border-radius, 1px border #c7d5d9, soft drop shadow (0 4px 12px rgba(20,33,39,0.08)). Two-column layout: label in STK Bureau Sans 12px weight 500 #63696c, number in STK Bureau Serif 28px weight 400 #142127.

### Eyebrow Section Label
**Role:** Small caps category tag above section headlines

STK Gerhard 14px weight 500, uppercase, letter-spacing 0.994px, color #142127. Always sits 8–12px above the section headline. One per section, never repeated.

## Do's and Don'ts

### Do
- Use border-radius: 9999px for all interactive buttons and tag pills — the fully rounded shape is the most recognizable element of the system.
- Set display headlines in STK Bureau Serif 48–64px with tracking between -0.027em and -0.05em; the tight serif block is the editorial signature.
- Apply the all-caps STK Gerhard 14px eyebrow label (+0.071em tracking) above every major section headline, exactly once per section.
- Use #fffa77 as a full-bleed hero/marquee background block; never as a small inline accent — its power is in the large flat field.
- Use Inkwell (#142127) for all primary CTA fills and body text; it provides 16:1+ contrast on both white and yellow surfaces.
- Keep product UI surfaces on Paper White (#ffffff) with 1px River Mist (#c7d5d9) borders; avoid drop shadows on cards.
- Maintain 80px vertical gaps between major sections and 24px internal padding on cards.

### Don't
- Don't use drop shadows on cards, buttons, or nav — the system relies on 1px borders and color contrast for separation.
- Don't apply the yellow to small UI elements (badges, dots, icon backgrounds); it only works at hero/marquee scale.
- Don't use STK Bureau Sans at display sizes; reserve sans for 32px and below and let the serif own the big moments.
- Don't mix radius values within a single component group — buttons are always 9999px, cards always 20px or 10px, never 16px.
- Don't add gradients; the system is strictly flat color blocks — even the yellow hero is a solid fill.
- Don't use the ghost pill for primary actions; dark fill is reserved for the single most important action on a given screen.
- Don't break the serif/sans pairing by using serif for body copy or sans for display headlines — the voice contrast is the system.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Default page canvas and card surfaces for product UI and most content sections |
| 1 | Honey Yellow | `#fffa77` | Full-bleed hero band, marquee promotional blocks, attention-anchoring sections |
| 2 | Marigold | `#fffa56` | Accent feature panels, highlight cards, decorative inline fills |

## Elevation

- **Stats Badge (floating metric card):** `0 4px 12px rgba(20, 33, 39, 0.08)`
- **Product App Screenshot (elevated variant):** `0 8px 24px rgba(20, 33, 39, 0.06)`

## Imagery

Imagery is minimal and decorative: hand-drawn floral illustrations in soft pastels (pink, yellow, purple, green) appear only in the promo banner and scattered marketing moments. Product screenshots are the dominant visual asset — real UI captures shown at large scale on white card surfaces. No stock photography, no lifestyle imagery, no abstract gradients. The visual weight sits on the product itself and the typographic system.

## Layout

Max-width 1200px centered container with generous side padding. The page opens with a full-bleed yellow hero (extending edge-to-edge), then alternates between white content sections and occasional yellow accent bands. Feature sections use a consistent 2-column split: text left (40%), product visual right (60%). Cards stack vertically in single-column within feature blocks, occasionally forming 3-column grids for feature lists. Vertical rhythm is set by 80px section gaps with 24px internal padding. Navigation is a sticky white top bar with logo left, links center, CTAs right. No sidebar, no mega-menu complexity.

## Agent Prompt Guide

Quick Color Reference:
- text: #142127 (Inkwell)
- background: #ffffff (Paper White)
- border: #c7d5d9 (River Mist)
- accent: #fffa56 (Marigold)
- hero/marquee: #fffa77 (Honey Yellow)
- primary action: #fffa56 (filled action)

3-5 Example Component Prompts:

1. Create a Primary Action Button: #fffa56 background, #131416 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Feature Split Section: White background, 1200px max-width, 2-column grid (40% / 60% gap 64px). Left column: STK Gerhard 14px caps eyebrow #142127, STK Bureau Serif 48px weight 400 headline #142127 letter-spacing -2.4px, STK Bureau Sans 16px body #142127. Right column: product app screenshot card with 20px radius, 1px #c7d5d9 border, white background.

3. Stats Badge Overlay: White card, 10px radius, 1px #c7d5d9 border, 24px padding, shadow 0 4px 12px rgba(20,33,39,0.08). Two columns: left label 'New leads' STK Bureau Sans 12px weight 500 #63696c, left number '7' STK Bureau Serif 28px weight 400 #142127; right label 'Unread messages' same style, right number '8'.


5. Tab Navigation Strip: Horizontal row, 5 items, STK Bureau Sans 16px weight 500 #142127, 32px gap between items. Active tab: 2px solid #142127 bottom border, 4px padding-bottom. Inactive: no decoration. No background fill change.

## Color Block Strategy

The yellow is deployed as a 'color block' rather than an accent — it appears as full-width background bands that bookend or punctuate sections, never as inline decoration. This creates a page rhythm: enter (yellow) → work (white) → highlight (yellow) → work (white). The transition between blocks is always a hard edge with zero gradient or blend, reinforcing the printed-editorial feel.

## Similar Brands

- **Squarespace** — Same editorial serif/sans pairing, full-bleed colored hero blocks, and large confident display headlines on saturated backgrounds
- **Notion** — Similar minimal white product surface treatment with a single bold accent color and pill-shaped navigation controls
- **ConvertKit** — Creative-entrepreneur SaaS targeting similar audience; shares the warm confident tone, pill buttons, and lifestyle-illustration banner approach
- **Mailchimp** — Playful brand personality expressed through bold color blocks, illustration, and a custom-feeling type system rather than generic SaaS gray

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-honey-yellow: #fffa77;
  --color-marigold: #fffa56;
  --color-inkwell: #142127;
  --color-carbon: #131416;
  --color-slate-gray: #343c40;
  --color-pebble: #63696c;
  --color-river-mist: #c7d5d9;
  --color-fog: #e0e5e7;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-stk-bureau-serif: 'STK Bureau Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-stk-bureau-sans: 'STK Bureau Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-stk-gerhard: 'STK Gerhard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.7px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.8px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.72px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.96px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.4px;
  --text-display: 56px;
  --leading-display: 1.05;
  --tracking-display: -2.8px;
  --text-display-lg: 64px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.98px;

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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 100px;
  --radius-full-2: 999px;
  --radius-full-3: 159984px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-inputs: 10px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-honey-yellow: #fffa77;
  --surface-marigold: #fffa56;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-honey-yellow: #fffa77;
  --color-marigold: #fffa56;
  --color-inkwell: #142127;
  --color-carbon: #131416;
  --color-slate-gray: #343c40;
  --color-pebble: #63696c;
  --color-river-mist: #c7d5d9;
  --color-fog: #e0e5e7;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-stk-bureau-serif: 'STK Bureau Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-stk-bureau-sans: 'STK Bureau Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-stk-gerhard: 'STK Gerhard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.7px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.8px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.72px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.96px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.4px;
  --text-display: 56px;
  --leading-display: 1.05;
  --tracking-display: -2.8px;
  --text-display-lg: 64px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.98px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 100px;
  --radius-full-2: 999px;
  --radius-full-3: 159984px;
}
```
