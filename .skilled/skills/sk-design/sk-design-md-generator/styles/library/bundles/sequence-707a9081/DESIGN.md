# Sequence — Style Reference
> blueprint paper with violet annotations. A near-white editorial surface where everything is grayscale and one precise violet pulse marks every action worth taking.

**Theme:** light

Sequence reads like an editorial finance publication rendered in product form: a near-white canvas, a humanist sans (TWK Lausanne) carrying almost all interface text, and a light-weight serif (Moderat Serif) used sparingly on large display headlines to inject editorial gravity. Depth comes from hairline borders and thin layered shadows, not heavy panels or colored fills. A single vivid violet (#a565ff) is the only chromatic accent in the system — it functions as a precise annotation, appearing on primary CTAs, active icons, and subtle brand glows, while the rest of the interface stays in cool grays. Soft blue-violet radial washes in hero and section backgrounds create atmospheric depth without committing to color, and the overall density is compact and precise rather than spacious or airy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Violet Pulse | `#a565ff` | `--color-violet-pulse` | Primary CTAs, active icons, brand glow accents — the single chromatic accent in the system; everything else defers to it |
| Indigo Ink | `#5e5cff` | `--color-indigo-ink` | Link text, secondary text emphasis, and accent strokes where violet would be too loud |
| Lavender Wash | `#ebebff` | `--color-lavender-wash` | Soft tinted backgrounds for highlighted callouts and subtle surface differentiation |
| Iris Glow | `#e0c9ff` | `--color-iris-glow` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ledger Green | `#2e7317` | `--color-ledger-green` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Paper White | `#ffffff` | `--color-paper-white` | Primary canvas, card surfaces, button fills, and elevated surface layer |
| Bone | `#f7f7f7` | `--color-bone` | Recessed card surfaces and subtle panel backgrounds one step off white |
| Fog | `#f1f1f1` | `--color-fog` | Disabled surface fills, table row alternates, and recessed UI regions |
| Silver | `#efefef` | `--color-silver` | Inset borders, button outlines, and shadow-stack fills for elevation |
| Marble | `#fff6df` | `--color-marble` | Warm cream accent for announcement bars and subtle highlight bands |
| Graphite | `#1d1d20` | `--color-graphite` | Primary heading and body text — near-black with a barely-warm tint |
| Slate | `#42424a` | `--color-slate` | Secondary headings, emphasized body text, and list accents |
| Iron | `#505050` | `--color-iron` | Default body text and the most-used text color across the system |
| Steel | `#757575` | `--color-steel` | Muted helper text, navigation labels, and secondary table text |
| Smoke | `#92939e` | `--color-smoke` | Placeholder text, disabled labels, and tertiary table cells |
| Ash | `#e5e7eb` | `--color-ash` | Default hairline border — the structural backbone of the entire UI; the most-used color in the system |
| Mist | `#d1d9e4` | `--color-mist` | Cooler border for inputs, dividers, and sections needing visual separation from Ash |
| Olive Gray | `#808076` | `--color-olive-gray` | SVG illustration stroke and fill — the default for vector graphics in content |
| Noir | `#000000` | `--color-noir` | Icon fills and contrast anchors where pure black is required |

## Tokens — Typography

### TWK Lausanne — Primary UI typeface — all body text, navigation, buttons, labels, and most headings from 8px to 24px. A humanist sans with open apertures that stays legible at 10–12px in dense tables and form chrome. · `--font-twk-lausanne`
- **Substitute:** Inter, IBM Plex Sans, or Söhne
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 24
- **Line height:** 1.00–2.00 (body 1.50–1.60, tight 1.00–1.20 for compact UI)
- **Letter spacing:** -0.003em at display sizes, -0.002em at subhead sizes, normal at body
- **Role:** Primary UI typeface — all body text, navigation, buttons, labels, and most headings from 8px to 24px. A humanist sans with open apertures that stays legible at 10–12px in dense tables and form chrome.

### Moderat Serif — Editorial display serif used only on the largest marketing headlines (h1). Light weight at 40–46px with aggressive -0.025em tracking — the contrast against the humanist sans signals premium editorial tone and breaks the product-UI pattern. · `--font-moderat-serif`
- **Substitute:** GT Sectra, Tiempos Headline, or Canela
- **Weights:** 300, 400
- **Sizes:** 40, 46
- **Line height:** 1.00
- **Letter spacing:** -0.0250em
- **Role:** Editorial display serif used only on the largest marketing headlines (h1). Light weight at 40–46px with aggressive -0.025em tracking — the contrast against the humanist sans signals premium editorial tone and breaks the product-UI pattern.

### SF Mono — Monospaced micro-text for API references, code snippets, and technical annotations at 10px. Rare and deliberate — appears only where machine-readable content is shown. · `--font-sf-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 10
- **Line height:** 1.50–1.80
- **Role:** Monospaced micro-text for API references, code snippets, and technical annotations at 10px. Rare and deliberate — appears only where machine-readable content is shown.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.45 | -0.022px | `--text-caption` |
| body | 14px | 1.57 | — | `--text-body` |
| body-lg | 16px | 1.63 | — | `--text-body-lg` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.048px | `--text-heading-sm` |
| heading | 40px | 1 | -1px | `--text-heading` |
| display | 46px | 1 | -1.15px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 9999px |
| inputs | 4px |
| buttons | 9999px |
| large-panels | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(58, 58, 64, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1)...` | `--shadow-subtle` |
| subtle-2 | `rgba(29, 29, 32, 0.08) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| subtle-3 | `rgb(239, 239, 239) 0px 0px 0px 2px, rgba(0, 0, 0, 0.01) 0...` | `--shadow-subtle-3` |
| sm | `rgba(99, 102, 241, 0.4) 0px 0px 8px 2px` | `--shadow-sm` |
| subtle-4 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px` | `--shadow-subtle-4` |
| subtle-5 | `rgba(117, 117, 117, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0...` | `--shadow-subtle-5` |
| subtle-6 | `rgba(255, 255, 255, 0.14) 0px 1px 0px 0px inset, rgba(13,...` | `--shadow-subtle-6` |
| subtle-7 | `rgba(80, 80, 80, 0.1) 0px 0px 0px 1px` | `--shadow-subtle-7` |
| subtle-8 | `rgba(29, 29, 32, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1...` | `--shadow-subtle-8` |
| sm-2 | `rgba(0, 0, 0, 0.04) 0px 4px 6px 0px, rgb(242, 242, 242) 0...` | `--shadow-sm-2` |
| subtle-9 | `rgba(29, 29, 32, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1...` | `--shadow-subtle-9` |
| subtle-10 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-10` |
| subtle-11 | `rgba(117, 117, 117, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0...` | `--shadow-subtle-11` |
| subtle-12 | `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px inset` | `--shadow-subtle-12` |
| subtle-13 | `rgb(165, 101, 255) 0px 0px 0px 1px` | `--shadow-subtle-13` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Action Button
**Role:** Filled CTA for the single most important action on any screen

Background #a565ff, text #ffffff, border-radius 9999px (pill), padding 10px 20px. TWK Lausanne 14px weight 500. Gains a violet halo via box-shadow using #e0c9ff at low opacity. This is the only filled chromatic button in the system.

### Secondary Action Button
**Role:** Outlined or ghost action when two actions appear on one screen

Background transparent or #ffffff, border 1px #efefef, text #1d1d20, border-radius 9999px, padding 10px 20px. Hover lifts to #f7f7f7 background. Layered shadow: rgba(58,58,64,0.1) 0 0 0 1px + rgba(0,0,0,0.1) 0 1px 3px 0.

### Navigation Link
**Role:** Top-level nav items and inline text links

Text #505050 weight 500 at 14px, no underline. Active state shifts to #1d1d20 and may carry a 1px #1d1d20 underline. Hover transitions to #1d1d20.

### Display Headline Block
**Role:** Hero h1 and section-opening headlines

Moderat Serif weight 300 at 46px, line-height 1.00, letter-spacing -0.025em (-1.15px). Color #1d1d20. Centered or left-aligned, always followed by a TWK Lausanne body paragraph at 16px weight 400 in #505050.

### Product Feature Card
**Role:** Cards in the product suite grid and feature sections

Background #ffffff, border 1px #e5e7eb, border-radius 8px, padding 24px. Icon at 24px in #1d1d20 sits top-left. Title in TWK Lausanne 18px weight 500 #1d1d20. Description in 14px weight 400 #757575. No shadow on resting state.

### Product Screenshot Card
**Role:** Faux product UI cards floating in the hero

Background #ffffff, border 1px #e5e7eb, border-radius 8px, padding 16px. Uses the layered shadow stack: rgba(58,58,64,0.1) 0 0 0 1px + rgba(0,0,0,0.1) 0 1px 3px 0 + rgba(0,0,0,0.1) 0 1px 2px -1px. Internal mock chrome uses #f7f7f7 fills and #ebebff tints for active fields.

### Input Field
**Role:** Form inputs, search fields, and inline editors

Background #ffffff, border 1px #d1d9e4, border-radius 4px, padding 8px 12px. TWK Lausanne 14px weight 400. Placeholder text in #92939e. Focus state shifts border to #a565ff with 2px outer ring of #ebebff.

### Integration Logo Tile
**Role:** Third-party brand logos in the integration grid

Background #ffffff, border 1px #e5e7eb, border-radius 8px, padding 16px. Logo mark centered, no accompanying text. Renders at roughly 48–64px square within the tile.

### Status Badge
**Role:** Inline status indicators (Sent, Scheduled, Approved)

Background #ebebff or #f7f7f7, text #5e5cff or #2e7317 weight 500 at 11px, border-radius 9999px, padding 2px 10px. Success variant uses #2e7317 text on #f7f7f7 background.

### Announcement Bar
**Role:** Top-of-page promotional strip

Background #fff6df, text #1d1d20 weight 400 at 13px, centered. Full-bleed, padding 8px vertical. Arrow link in #5e5cff.

### Logo Lockup
**Role:** Brand mark + wordmark in nav and footer

Hex-cluster glyph in #1d1d20 followed by 'Sequence' in TWK Lausanne weight 500 at 18px, letter-spacing -0.002em. No tagline.

### Section Header
**Role:** Eyebrow label + h2 combination introducing each section

Eyebrow in TWK Lausanne 12px weight 500 #757575 uppercase or sentence-case, optional 4px row-gap. h2 in TWK Lausanne 40px weight 300 #1d1d20 line-height 1.00. Centered stack pattern in hero, left-aligned in product sections.

### Customer Logo Strip
**Role:** Row of customer wordmarks for social proof

No background or border. Wordmarks in #1d1d20 at consistent visual weight, spaced with 48–80px column-gap. Centered horizontally with star rating above at 14px in #757575.

## Do's and Don'ts

### Do
- Use Violet Pulse (#a565ff) exclusively for the single primary CTA per screen; never for body text, icons in resting state, or large fills
- Set all headings 24px and above in TWK Lausanne weight 300; reserve Moderat Serif for the 40–46px display headline only
- Use Ash (#e5e7eb) 1px as the default border across cards, dividers, inputs, and tiles — this is the structural line of the system
- Apply the pill radius (9999px) to all buttons, nav items, and tags; use 8px for cards and 4px for inputs and small interactive elements
- Anchor every section to a white or near-white surface; let depth come from hairline borders and the layered shadow stack, not colored fills
- Pair Lavender Wash (#ebebff) with Iris Glow (#e0c9ff) when building tinted callouts or highlighted states — never use them as large surface fills
- Keep section gaps at 80px and card padding at 24px; drop to 16px padding only in dense grid cells or product chrome

### Don't
- Don't introduce any new chromatic color — the system is monochrome grays plus exactly one violet accent and one green semantic
- Don't use Moderat Serif below 40px or for anything other than the h1 display headline; it will lose its editorial weight
- Don't apply colored backgrounds to large content regions; atmospheric depth comes from the soft blue-violet radial gradient washes, not solid color
- Don't use heavy drop shadows; the system relies on thin 1px rings and tightly-clamped offset shadows, never blurry elevation blobs
- Don't set body text below 12px; the smallest TWK Lausanne size for any user-facing text is 12px, with 14px as the comfortable default
- Don't use Indigo Ink (#5e5cff) as a button background — it is a link and secondary-text color, not an action fill
- Don't round buttons or tags with 8px; they must be pills (9999px) to maintain the contrast against the 8px card radius

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base page background, hero and section backgrounds |
| 1 | Recessed Surface | `#f7f7f7` | Card and panel surfaces sitting one step below the canvas |
| 2 | Tinted Surface | `#ebebff` | Lavender-tinted highlight regions for special content blocks |
| 3 | Warm Accent | `#fff6df` | Cream announcement bar and warm highlight bands |

## Elevation

- **Primary CTA button:** `0px 0px 0px 1px rgba(58,58,64,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1) + violet halo via #e0c9ff at ~20% opacity 0 0 8px 2px`
- **Product screenshot cards:** `0px 0px 0px 2px rgb(239,239,239), 0px 22px 9px 0px rgba(0,0,0,0.01), 0px 12px 7px 0px rgba(0,0,0,0.04), 0px 5px 5px 0px rgba(0,0,0,0.06), 0px 1px 3px 0px rgba(0,0,0,0.07)`
- **Secondary/outlined button:** `0px 0px 0px 1px rgba(29,29,32,0.08)`
- **Subtle elevation ring:** `0px 0px 0px 1px rgba(0,0,0,0.05)`

## Imagery

Imagery is restrained and product-centric: no lifestyle photography, no stock imagery, no decorative illustrations. The visual content is almost entirely UI mockups — floating product screenshot cards showing contract interfaces, billing forms, and invoice tables rendered in the same TWK Lausanne / grayscale palette as the rest of the site. Integration logos appear as small monochrome wordmarks inside bordered tiles. A subtle concentric-circle diagram appears once in the product suite section as a structural diagram in #e5e7eb strokes. The hero uses a soft blue-violet radial gradient wash (radial-gradient with rgba(186,217,249,0.8) and rgba(234,234,255,0.8)) as background atmosphere rather than any photographic content. Icons are 1.5–2px stroke, line-style, monochrome in #1d1d20 or #505050 — the only colored icon usage is the Violet Pulse active state.

## Layout

Max-width 1200px centered container with 24px gutter. The page is built as a vertical stack of distinct sections separated by 80px gaps, with a thin #e5e7eb hairline divider between some sections. The hero opens full-bleed white with a centered headline stack (eyebrow → serif display → paragraph → CTA pair) and product screenshot cards floating below as a 3-column grid with slight stagger. The social-proof strip is a single horizontal row of customer wordmarks, centered, with a 5-star rating above. Product suite sections use a left-aligned text column beside a right-side visual column, alternating sides. A 2-column feature section uses a diagram on one side and a 2×3 icon+text grid on the other. Navigation is a single fixed top bar: logo left, product/customer/docs/pricing/resources center-left, sign-in and Book demo button right — the demo button is the only filled violet element in the chrome. No sidebar, no mega-menu, no sticky scroll behavior beyond the nav.

## Editorial Serif Accent

The system uses a light-weight editorial serif (Moderat Serif) exclusively for the 40–46px display headline, paired with a humanist sans for all surrounding text. This is the signature typographic move: it makes marketing pages read like a financial publication rather than a product UI. An AI agent should only invoke the serif for the single largest headline on a page — never for subheadings, never for product UI, never below 40px. The light weight (300) and aggressive -0.025em tracking make the serif whisper rather than shout; the contrast with the sans body text creates the premium editorial tone.

## Violet Halo System

The primary CTA carries a distinctive violet halo built from #e0c9ff in the box-shadow layer. This is not a generic drop shadow — it is a brand-specific glow that makes the filled button look like it is emitting light in the brand color. The halo sits outside the standard elevation stack and is applied only to the primary action. Secondary buttons get the thin 1px ring shadow but no glow. The same violet appears at lower opacity (rgba(99,102,241,0.4) 0 0 8px 2px) as a focus or hover intensification in some contexts.

## Atmospheric Gradient Washes

Hero and section backgrounds use two signature soft washes: a horizontal purple fade (linear-gradient to right, transparent → #9492ff) that appears on headline underlines or accent strokes, and a soft blue-violet radial wash (radial-gradient with rgba(186,217,249,0.8) fading through rgba(234,234,255,0.8) to transparent) that fills hero backgrounds. These create atmosphere without committing the page to color. Use them at 60–80% opacity maximum so the underlying white canvas still reads as the dominant surface.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1d1d20 (headings), #505050 (body), #757575 (muted)
- background: #ffffff (canvas), #f7f7f7 (recessed surface)
- border: #e5e7eb (default hairline), #d1d9e4 (input border)
- accent: #a565ff (Violet Pulse — the only chromatic accent)
- primary action: #a565ff (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #a565ff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. *Product Feature Card*: Background #ffffff, border 1px #e5e7eb, border-radius 8px, padding 24px. Icon 24px in #1d1d20 at top-left. Title TWK Lausanne 18px weight 500 #1d1d20. Body TWK Lausanne 14px weight 400 #757575. No resting shadow.
3. *Input field*: Background #ffffff, border 1px #d1d9e4, border-radius 4px, padding 8px 12px. Text TWK Lausanne 14px weight 400 #1d1d20. Placeholder #92939e. Focus state: border shifts to #a565ff, 2px outer ring of #ebebff.
4. *Status badge (success)*: Background #f7f7f7, text #2e7317, TWK Lausanne 11px weight 500, border-radius 9999px, padding 2px 10px.
5. *Announcement bar*: Full-bleed background #fff6df, text #1d1d20 TWK Lausanne 13px weight 400 centered, padding 8px vertical. Inline arrow link in #5e5cff.

## Similar Brands

- **Linear** — Same near-monochrome light canvas with a single vivid accent and editorial restraint; both use hairline borders and compact density to feel precise rather than decorative
- **Stripe** — Similar quiet light-mode product chrome with one chromatic brand color used surgically; both use layered subtle shadows and pill buttons for primary actions
- **Mercury** — Same financial-product confidence expressed through generous whitespace, editorial sans typography, and violet/purple accent appearing only on primary actions
- **Vercel** — Both use a near-white canvas with hairline #e5e7eb borders as the dominant structural element, and rely on a single brand color rather than multi-color palettes
- **Notion** — Same light-dominant interface with muted gray text hierarchy and pill-shaped interactive controls; both treat color as functional punctuation rather than decoration

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-violet-pulse: #a565ff;
  --color-indigo-ink: #5e5cff;
  --color-lavender-wash: #ebebff;
  --color-iris-glow: #e0c9ff;
  --color-ledger-green: #2e7317;
  --color-paper-white: #ffffff;
  --color-bone: #f7f7f7;
  --color-fog: #f1f1f1;
  --color-silver: #efefef;
  --color-marble: #fff6df;
  --color-graphite: #1d1d20;
  --color-slate: #42424a;
  --color-iron: #505050;
  --color-steel: #757575;
  --color-smoke: #92939e;
  --color-ash: #e5e7eb;
  --color-mist: #d1d9e4;
  --color-olive-gray: #808076;
  --color-noir: #000000;

  /* Typography — Font Families */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-moderat-serif: 'Moderat Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sf-mono: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: -0.022px;
  --text-body: 14px;
  --leading-body: 1.57;
  --text-body-lg: 16px;
  --leading-body-lg: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.048px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -1px;
  --text-display: 46px;
  --leading-display: 1;
  --tracking-display: -1.15px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 9999px;
  --radius-inputs: 4px;
  --radius-buttons: 9999px;
  --radius-large-panels: 16px;

  /* Shadows */
  --shadow-subtle: rgba(58, 58, 64, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgba(29, 29, 32, 0.08) 0px 0px 0px 1px;
  --shadow-subtle-3: rgb(239, 239, 239) 0px 0px 0px 2px, rgba(0, 0, 0, 0.01) 0px 22px 9px 0px, rgba(0, 0, 0, 0.04) 0px 12px 7px 0px, rgba(0, 0, 0, 0.06) 0px 5px 5px 0px, rgba(0, 0, 0, 0.07) 0px 1px 3px 0px;
  --shadow-sm: rgba(99, 102, 241, 0.4) 0px 0px 8px 2px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-5: rgba(117, 117, 117, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-6: rgba(255, 255, 255, 0.14) 0px 1px 0px 0px inset, rgba(13, 25, 37, 0.08) 0px 1px 1px 0px, rgba(14, 26, 38, 0.05) 0px 0px 0px 1px, rgba(13, 25, 37, 0.05) 0px 2px 3px 0px;
  --shadow-subtle-7: rgba(80, 80, 80, 0.1) 0px 0px 0px 1px;
  --shadow-subtle-8: rgba(29, 29, 32, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-sm-2: rgba(0, 0, 0, 0.04) 0px 4px 6px 0px, rgb(242, 242, 242) 0px 0px 0px 4px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;
  --shadow-subtle-9: rgba(29, 29, 32, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-10: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-11: rgba(117, 117, 117, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -4px;
  --shadow-subtle-12: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px inset;
  --shadow-subtle-13: rgb(165, 101, 255) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-recessed-surface: #f7f7f7;
  --surface-tinted-surface: #ebebff;
  --surface-warm-accent: #fff6df;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-violet-pulse: #a565ff;
  --color-indigo-ink: #5e5cff;
  --color-lavender-wash: #ebebff;
  --color-iris-glow: #e0c9ff;
  --color-ledger-green: #2e7317;
  --color-paper-white: #ffffff;
  --color-bone: #f7f7f7;
  --color-fog: #f1f1f1;
  --color-silver: #efefef;
  --color-marble: #fff6df;
  --color-graphite: #1d1d20;
  --color-slate: #42424a;
  --color-iron: #505050;
  --color-steel: #757575;
  --color-smoke: #92939e;
  --color-ash: #e5e7eb;
  --color-mist: #d1d9e4;
  --color-olive-gray: #808076;
  --color-noir: #000000;

  /* Typography */
  --font-twk-lausanne: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-moderat-serif: 'Moderat Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sf-mono: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: -0.022px;
  --text-body: 14px;
  --leading-body: 1.57;
  --text-body-lg: 16px;
  --leading-body-lg: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.048px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -1px;
  --text-display: 46px;
  --leading-display: 1;
  --tracking-display: -1.15px;

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
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(58, 58, 64, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgba(29, 29, 32, 0.08) 0px 0px 0px 1px;
  --shadow-subtle-3: rgb(239, 239, 239) 0px 0px 0px 2px, rgba(0, 0, 0, 0.01) 0px 22px 9px 0px, rgba(0, 0, 0, 0.04) 0px 12px 7px 0px, rgba(0, 0, 0, 0.06) 0px 5px 5px 0px, rgba(0, 0, 0, 0.07) 0px 1px 3px 0px;
  --shadow-sm: rgba(99, 102, 241, 0.4) 0px 0px 8px 2px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-5: rgba(117, 117, 117, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-6: rgba(255, 255, 255, 0.14) 0px 1px 0px 0px inset, rgba(13, 25, 37, 0.08) 0px 1px 1px 0px, rgba(14, 26, 38, 0.05) 0px 0px 0px 1px, rgba(13, 25, 37, 0.05) 0px 2px 3px 0px;
  --shadow-subtle-7: rgba(80, 80, 80, 0.1) 0px 0px 0px 1px;
  --shadow-subtle-8: rgba(29, 29, 32, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-sm-2: rgba(0, 0, 0, 0.04) 0px 4px 6px 0px, rgb(242, 242, 242) 0px 0px 0px 4px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;
  --shadow-subtle-9: rgba(29, 29, 32, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-10: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-11: rgba(117, 117, 117, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -4px;
  --shadow-subtle-12: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px inset;
  --shadow-subtle-13: rgb(165, 101, 255) 0px 0px 0px 1px;
}
```
