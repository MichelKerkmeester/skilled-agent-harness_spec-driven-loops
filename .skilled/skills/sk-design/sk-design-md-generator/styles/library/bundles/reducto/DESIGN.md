# Reducto — Style Reference
> Magazine on warm paper

**Theme:** light

Reducto presents a warm-paper editorial system: an off-white canvas paired with a custom serif that behaves like a luxury magazine masthead, grounded by a single high-chroma magenta that punches through without shouting. The aesthetic borrows from print typography — oversized serif headlines (64–136px) set in a custom face with tight tracking, paired with a workmanlike sans for utility — and treats the page as a structured document rather than a product dashboard. Color is rationed: almost everything reads in warm grays and the deep plum #310632, and the vivid magenta #9d17a0 is reserved for the moment a user needs to act. Surfaces are paper-thin, borders are warm beige instead of cold gray, and shadows are essentially absent — depth comes from inset white highlights and subtle border contrast, not from elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine | `#310632` | `--color-aubergine` | Primary text, headline color, nav active state, link accent, footer text — the deep plum that replaces black across the entire interface, giving body copy a warm violet cast instead of cold gray |
| Magenta Pulse | `#9d17a0` | `--color-magenta-pulse` | Filled primary action background, selected nav indicator, brand icon color — the single vivid hue permitted on a CTA, used sparingly so the click target glows against the paper canvas |
| Damson | `#690f6b` | `--color-damson` | Outlined action border, secondary button outline — a darker shade of the action magenta, used when a ghost/outlined button needs chromatic weight without the filled fill |
| Lilac Wash | `#dcbffb` | `--color-lilac-wash` | Violet text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Ochre | `#a2541b` | `--color-ochre` | Decorative icon accent, illustrative highlight — used inside product visualizations and tag chips to add warm contrast against the dominant magenta/plum palette |
| Moss | `#718613` | `--color-moss` | Decorative icon and illustration accent — secondary chromatic note for data visualization callouts, kept low-frequency |
| Reed | `#87a017` | `--color-reed` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Paper | `#fafaf9` | `--color-paper` | Page canvas, hero background, nav background — the warm off-white that defines the entire site's surface; never pure #ffffff at the top level |
| Vellum | `#f5f5f4` | `--color-vellum` | Secondary surface, elevated card background, subtle section differentiation |
| Snow | `#ffffff` | `--color-snow` | Pure card surface, button text on dark/magenta fills, icon fill — only used as a surface lift or as foreground text, never as the page canvas |
| Sand | `#d7ccc1` | `--color-sand` | Primary border color, hairline dividers, card outlines — the warm beige border that replaces cold gray; the single most-used border token across the system |
| Driftwood | `#e7e5e4` | `--color-driftwood` | Subtle border, decorative separator, low-contrast outline — lighter than Sand for secondary dividers |
| Stone | `#d6d3d1` | `--color-stone` | Nav border, button border, body border — mid-tone warm gray for structural outlines where more contrast is needed than Sand provides |
| Graphite | `#292524` | `--color-graphite` | Secondary body text, navigation labels, and subdued headings. Do not promote it to the primary CTA color |
| Slate | `#57534d` | `--color-slate` | Secondary heading text, icon stroke, strong body text — mid-dark warm gray for emphasis without going full black |
| Pewter | `#79716b` | `--color-pewter` | Body text, nav text, button text on light backgrounds, helper text — the default readable text color, warm and low-contrast |
| Bark | `#44403b` | `--color-bark` | Neutral button treatment for secondary actions and selected controls. |
| Ash | `#a6a09b` | `--color-ash` | Muted helper text, disabled state, low-priority captions — the lightest readable neutral |

## Tokens — Typography

### reductoSerif — Display and headline serif — the brand's signature voice. Set at 64–136px for hero/display, drops to 24–32px for section headings. Weight 470 is the workhorse (editorial body weight for a display face), weight 650 is reserved for stat numbers. The tight -0.01em tracking at every size is critical: it tightens the serif's natural rhythm into a modern, condensed look. Substituted with Playfair Display, Lora, or Source Serif Pro when unavailable. · `--font-reductoserif`
- **Substitute:** Playfair Display, Lora, or Source Serif 4
- **Weights:** 400, 470, 650
- **Sizes:** 16px, 24px, 32px, 64px, 80px, 136px
- **Line height:** 0.74, 1.13, 1.25, 1.33, 1.50
- **Letter spacing:** -0.01em at all sizes
- **Role:** Display and headline serif — the brand's signature voice. Set at 64–136px for hero/display, drops to 24–32px for section headings. Weight 470 is the workhorse (editorial body weight for a display face), weight 650 is reserved for stat numbers. The tight -0.01em tracking at every size is critical: it tightens the serif's natural rhythm into a modern, condensed look. Substituted with Playfair Display, Lora, or Source Serif Pro when unavailable.

### Inter — Body and UI sans — the workhorse for nav links, buttons, descriptions, paragraphs, and form fields. Weight 400 for body, 500 for button labels and emphasized nav. Activates stylistic alternates 'salt' (single-storey 'a') and 'ss02' (open 'g') — these are essential to matching the brand; without them, Inter reads as generic. · `--font-inter`
- **Substitute:** DM Sans or General Sans
- **Weights:** 400, 500
- **Sizes:** 14px, 15px, 16px, 17px, 18px, 20px, 24px
- **Line height:** 1.33, 1.43, 1.50, 1.56, 1.60
- **OpenType features:** `"salt" on, "ss02" on`
- **Role:** Body and UI sans — the workhorse for nav links, buttons, descriptions, paragraphs, and form fields. Weight 400 for body, 500 for button labels and emphasized nav. Activates stylistic alternates 'salt' (single-storey 'a') and 'ss02' (open 'g') — these are essential to matching the brand; without them, Inter reads as generic.

### reductosans — Compact UI sans for small labels, tag chips, micro-copy, and dense interface text where Inter feels too tall. Functionally overlaps with Inter but provides a tighter, more 'captured' rhythm for chrome. · `--font-reductosans`
- **Substitute:** Inter at the same weight and size
- **Weights:** 400, 500
- **Sizes:** 14px, 15px, 16px
- **Line height:** 1.43, 1.50, 1.60
- **Role:** Compact UI sans for small labels, tag chips, micro-copy, and dense interface text where Inter feels too tall. Functionally overlaps with Inter but provides a tighter, more 'captured' rhythm for chrome.

### Reddit Mono — Single-purpose display monospace for oversized stat numbers — the '2,000,000,000' counter. The -0.03em tracking pulls the mono's natural width inward so the number doesn't look like code, but a label. Substituted with JetBrains Mono or IBM Plex Mono. · `--font-reddit-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 80px
- **Line height:** 1.13
- **Letter spacing:** -0.03em at 80px
- **Role:** Single-purpose display monospace for oversized stat numbers — the '2,000,000,000' counter. The -0.03em tracking pulls the mono's natural width inward so the number doesn't look like code, but a label. Substituted with JetBrains Mono or IBM Plex Mono.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.01px | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.01px | `--text-heading` |
| heading-lg | 64px | 1.13 | -0.01px | `--text-heading-lg` |
| display-sm | 80px | 1.13 | -0.01px | `--text-display-sm` |
| display | 136px | 1.13 | -0.01px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.25) 0px -2px 0px 0px inset, rgba(25...` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.3) 0px -2px 0px 0px inset, rgba(255...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24-32px
- **Element gap:** 16-24px

## Components

### Announcement Bar
**Role:** Top-of-page product announcement strip

Full-width bar with #9d17a0 (Magenta Pulse) background, white text at 14px Inter weight 400, centered. 2px bottom inset highlight of rgba(255,255,255,0.3) gives it a subtle embossed feel. Padding 2–4px vertical.

### Top Navigation
**Role:** Sticky site navigation

#fafaf9 background with 1px Stone (#d6d3d1) bottom border. Logo left, nav links center in 14px Inter weight 500 Pewter, 'Log in' text link and 'Contact sales' filled dark button right. 2px white inset highlights top and bottom for a paper-sheet feel. Height ~60px, horizontal padding 24px.

### Contact Sales Button (Dark Filled)
**Role:** Primary dark CTA in nav

Bark (#44403b) background, white text, 14px Inter weight 500, 4px radius, 8px 16px padding. Inset 2px white highlights on top and bottom edges create a 3D embossed look. The dark fill on warm-paper canvas makes this the highest-contrast interactive element above the fold.

### Magenta Primary Button
**Role:** Hero CTA, primary conversion action

#9d17a0 (Magenta Pulse) background, white text, 14px Inter weight 500, 4px radius, 12px 24px padding. Arrow icon (→) follows the label. Inset rgba(255,255,255,0.25) top and bottom highlights give a glossy raised feel. This is the only filled chromatic button in the system.

### Ghost/Outlined Button
**Role:** Secondary action, demo request

Transparent background, 1px Damson (#690f6b) border, Aubergine (#310632) text, 14px Inter weight 500, 4px radius, 12px 24px padding. Pairs directly beside the magenta CTA as the lower-commitment option.

### Hero Headline
**Role:** Above-the-fold page title

Set in reductoSerif weight 470 at 64–80px, line-height 1.13, letter-spacing -0.01em, color Graphite (#292524). Two-line stack with a maximum width of ~900px. One word (e.g. 'data') is set in Magenta Pulse (#9d17a0) for emphasis — this word-color treatment is a signature pattern.

### Hero Subtext
**Role:** Supporting paragraph under headline

Inter weight 400, 17–18px, line-height 1.5, color Pewter (#79716b), max-width ~600px centered. Inline emphasis word (e.g. 'most accurate') recolored in Aubergine (#310632) for subtle weight.

### Customer Logo Strip
**Role:** Social proof row

Single row of 5+ customer wordmarks on Paper background, evenly spaced, separated by thin dividers. Logos are rendered in their own brand colors (Harvey = dark, Scale = pink, Newfront = Aubergine, Medallion = dark + blue icon). Optional '+ many more' text link in Pewter right-aligned.

### Stat Display Number
**Role:** Oversized metric counter

80px Reddit Mono weight 400, line-height 1.13, letter-spacing -0.03em, color Graphite. The mono choice with tight tracking makes the number feel like a typeset label rather than code. Small caption above in Inter 14px ('Over') centered.

### Feature Card
**Role:** 3-column feature grid card

White (#ffffff) surface on Paper background, 1px Sand (#d7ccc1) border, 8px radius, 24–32px padding. Top half contains an illustrative visual (document mockup, chart, or icon grid). Title in reductoSerif 24px Graphite, body in Inter 16px Pewter. Three cards per row, 24px gap between cards.

### Section Header
**Role:** Centered section title block

Small eyebrow label in Inter 14px weight 500 with a 4-dot icon prefix (##) in Aubergine, followed by reductoSerif heading at 48–64px Graphite, then Inter body subtext 17px Pewter. All centered, max-width ~700px, 16–24px between elements.

### Product Visualization
**Role:** Decorative document/data illustration

Flat, outlined document mockups with bounding-box overlays in Sand (#d7ccc1) and accent color tags (Lilac #dcbffb, Ochre #a2541b) on selected cells. Pixelated mosaic backgrounds scatter color squares at low opacity. No drop shadows — depth is implied by the grid.

## Do's and Don'ts

### Do
- Set all hero/display headlines in reductoSerif weight 470 at 64–136px with -0.01em letter-spacing; never use a sans face for a display heading.
- Use #9d17a0 (Magenta Pulse) as the only filled chromatic action background; pair it with white text and 12px 24px padding.
- Color exactly one word in a hero headline in #9d17a0 to create emphasis; this accent-word pattern is the system's signature rhythm.
- Use #d7ccc1 (Sand) as the default border color for all cards, dividers, and outlines; avoid cool gray borders.
- Set body copy in Inter 17px weight 400 at line-height 1.5 with 'salt' and 'ss02' features enabled — these alternates are non-negotiable for brand fidelity.
- Maintain a paper-canvas base: page background must be #fafaf9, never #ffffff; lift cards with #ffffff over the warm canvas instead of using shadows.
- Use Reddit Mono with -0.03em tracking at 80px for oversized stat numbers; the mono face signals 'this is a measurement, not a word'.

### Don't
- Don't use black (#000000) for body or heading text; use Graphite (#292524) or Aubergine (#310632) to keep the warm palette consistent.
- Don't apply drop shadows to cards or sections; depth must come from border color contrast or white-on-warm layering, not from blur shadows.
- Don't use cool gray (#6b7280, #94a3b8, etc.) for borders or text — every neutral in this system is warm (brown- or beige-tinted).
- Don't activate the magenta action color on more than one element per viewport section; if the CTA is magenta, the nav must stay neutral.
- Don't use the reductoSerif face for body copy or UI labels under 24px; it loses legibility below that and breaks the display/utility split.
- Don't introduce additional chromatic accent colors beyond Ochre, Moss, and Lilac; the palette intentionally restricts to plum-family + warm neutrals + 2–3 illustration accents.
- Don't use #0000ee or default browser link blue; all links must use Aubergine or Lilac Wash.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#fafaf9` | Base page canvas — warm off-white, the dominant surface of every section |
| 1 | Snow | `#ffffff` | Card surface, elevated panel — pure white sits on top of Paper to create gentle lift without shadows |
| 2 | Vellum | `#f5f5f4` | Subtle section differentiation, nav background variant, secondary surface |
| 3 | Magenta Pulse | `#9d17a0` | Accent surface — announcement bar, filled CTA, selected state |
| 4 | Graphite | `#292524` | Dark surface — dark button, inverted panel, footer dark zone |

## Elevation

- **Filled action button (magenta):** `inset 0 -2px 0 0 rgba(255,255,255,0.25), inset 0 2px 0 0 rgba(255,255,255,0.25), 0 1px 2px 0 rgba(0,0,0,0.05)`
- **Nav bar:** `inset 0 -2px 0 0 rgba(255,255,255,0.3), inset 0 2px 0 0 rgba(255,255,255,0.3)`

## Imagery

Product visualizations dominate over photography. Document mockups are rendered as flat outlined rectangles with visible bounding-box overlays, grid guides, and small color-coded cell tags — they read as 'annotated data' rather than realistic screenshots. A pixelated mosaic of scattered color squares (in Ochre, Moss, Lilac, and Plum) appears as a decorative background element behind the stat counter, giving a digital-data texture. No lifestyle photography, no people, no environments. Icons are thin-stroke line icons in Slate or Graphite. The visual language is 'schematic document intelligence' — the product is shown as structured data being extracted, always flat, always annotated, never photographic.

## Layout

Max-width 1200px centered container with generous horizontal padding. Hero is a centered text block (headline → subtext → two-button row) occupying the upper third of the viewport, followed by a full-width row of document-to-data illustrations spanning the page width with no container constraint. Customer logos sit in a single horizontal row inside the container. Below the fold, sections alternate between centered-text headers and 3-column card grids, each card containing an illustration above a title and short body. Vertical rhythm is generous: 80px between major sections, 24px between cards, 16–24px between text elements within a block. The nav is a sticky horizontal bar with logo left, links center, and a dark filled CTA right. No sidebar, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #292524 (Graphite) for headings, #79716b (Pewter) for body
- background: #fafaf9 (Paper) canvas, #ffffff (Snow) for cards
- border: #d7ccc1 (Sand) default, #d6d3d1 (Stone) for nav
- accent: #9d17a0 (Magenta Pulse) for emphasis words and the announcement bar
- primary action: #9d17a0 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #9d17a0 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Build a feature card grid (3-column)*: White #ffffff card surface on #fafaf9 canvas, 1px #d7ccc1 border, 8px radius, 32px padding. Card title in reductoSerif weight 470 at 24px, color #292524. Card body in Inter 16px weight 400, line-height 1.5, color #79716b. Illustration area at top of card: flat outlined document mockup with #d7ccc1 bounding-box overlay and one #dcbffb accent tag. 24px gap between cards.

3. *Build the stat counter section*: #fafaf9 background. Small centered label 'Over' in Inter 14px weight 500, color #79716b. Oversized number in Reddit Mono weight 400 at 80px, line-height 1.13, letter-spacing -0.03em, color #292524. Decorative pixelated mosaic of small color squares (in #a2541b, #718613, #dcbffb, #310632) scattered above the number at low opacity as a background pattern.

4. *Build the top navigation*: #fafaf9 background, 1px #d6d3d1 bottom border, 60px height, 24px horizontal padding. Logo (icon + 'reducto' wordmark) left, nav links center in 14px Inter weight 500, color #79716b, 24px gap between links. Right side: 'Log in' as plain text link in #79716b, then dark filled button 'Contact sales' with #44403b background, white text, 4px radius, 8px 16px padding.

5. *Build the announcement bar*: Full-width strip, #9d17a0 background, 2px vertical padding. Centered text in Inter 14px weight 400, color #ffffff. No border-radius.

## Similar Brands

- **Linear** — Same editorial-serif-meets-utility-sans typography pairing, same single-accent-color rationing, same paper-white canvas with warm neutrals
- **Vercel** — Same disciplined use of one chromatic action color against an otherwise monochrome interface, same generous vertical section rhythm
- **Stripe** — Same warm off-white canvas replacing pure white, same serif headlines at 60–80px for hero, same border-as-depth philosophy instead of drop shadows
- **Notion** — Same warm-gray text palette and hairline warm-beige borders, same absence of heavy shadows, same document-first visual language

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine: #310632;
  --color-magenta-pulse: #9d17a0;
  --color-damson: #690f6b;
  --color-lilac-wash: #dcbffb;
  --color-ochre: #a2541b;
  --color-moss: #718613;
  --color-reed: #87a017;
  --color-paper: #fafaf9;
  --color-vellum: #f5f5f4;
  --color-snow: #ffffff;
  --color-sand: #d7ccc1;
  --color-driftwood: #e7e5e4;
  --color-stone: #d6d3d1;
  --color-graphite: #292524;
  --color-slate: #57534d;
  --color-pewter: #79716b;
  --color-bark: #44403b;
  --color-ash: #a6a09b;

  /* Typography — Font Families */
  --font-reductoserif: 'reductoSerif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reductosans: 'reductosans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reddit-mono: 'Reddit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.01px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.01px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.01px;
  --text-display-sm: 80px;
  --leading-display-sm: 1.13;
  --tracking-display-sm: -0.01px;
  --text-display: 136px;
  --leading-display: 1.13;
  --tracking-display: -0.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w470: 470;
  --font-weight-medium: 500;
  --font-weight-w650: 650;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24-32px;
  --element-gap: 16-24px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.25) 0px -2px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 2px 0px 0px inset;
  --shadow-subtle-2: rgba(255, 255, 255, 0.3) 0px -2px 0px 0px inset, rgba(255, 255, 255, 0.3) 0px 2px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-paper: #fafaf9;
  --surface-snow: #ffffff;
  --surface-vellum: #f5f5f4;
  --surface-magenta-pulse: #9d17a0;
  --surface-graphite: #292524;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine: #310632;
  --color-magenta-pulse: #9d17a0;
  --color-damson: #690f6b;
  --color-lilac-wash: #dcbffb;
  --color-ochre: #a2541b;
  --color-moss: #718613;
  --color-reed: #87a017;
  --color-paper: #fafaf9;
  --color-vellum: #f5f5f4;
  --color-snow: #ffffff;
  --color-sand: #d7ccc1;
  --color-driftwood: #e7e5e4;
  --color-stone: #d6d3d1;
  --color-graphite: #292524;
  --color-slate: #57534d;
  --color-pewter: #79716b;
  --color-bark: #44403b;
  --color-ash: #a6a09b;

  /* Typography */
  --font-reductoserif: 'reductoSerif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reductosans: 'reductosans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reddit-mono: 'Reddit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.01px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.01px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.01px;
  --text-display-sm: 80px;
  --leading-display-sm: 1.13;
  --tracking-display-sm: -0.01px;
  --text-display: 136px;
  --leading-display: 1.13;
  --tracking-display: -0.01px;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-120: 120px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.25) 0px -2px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 2px 0px 0px inset;
  --shadow-subtle-2: rgba(255, 255, 255, 0.3) 0px -2px 0px 0px inset, rgba(255, 255, 255, 0.3) 0px 2px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
```
