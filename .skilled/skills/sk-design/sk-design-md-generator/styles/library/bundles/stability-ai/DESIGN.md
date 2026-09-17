# Stability AI — Style Reference
> Lavender pulse in a darkroom. Full-bleed editorial photography floats over near-black surfaces, with a single vivid violet accent that electrifies every interactive element without ever shouting.

**Theme:** dark

Stability AI is a dark-canvas creative platform with a single electric lavender accent cutting through near-black surfaces. Full-bleed editorial photography dominates the hero, with floating product UI composited over models and flora to fuse tool and output into one image. Typography is Archivo in confident weights, with display sizes tightened at low line-heights (≈0.98–1.07) so headlines stack as compact editorial blocks rather than airy marketing copy. Interaction is signaled almost entirely by the violet pulse — pill-shaped CTAs, underlined links, arrow affordances, and even footer social icons all read as the same lavender frequency. Surfaces layer subtly (#1e1e1 → #383838 → #000000) with zero decorative shadow, so depth comes from tonal shifts and generous negative space rather than elevation. Components are lightweight and confident: pill buttons, thin dividers, and muted-violet body text (#725d91) that recedes while keeping the page tonally unified.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris Spark | `#a381ff` | `--color-iris-spark` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Indigo Edge | `#776cff` | `--color-indigo-edge` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Mauve Veil | `#725d91` | `--color-mauve-veil` | Headings, body text on dark, and muted link text — a desaturated violet that keeps the page tonally unified with the accent while letting content recede |
| Lilac Ash | `#b6a9c6` | `--color-lilac-ash` | Secondary body copy, helper text, subtle link variants on dark — the lightest purple-tinted neutral, bridging the gap between mauve headings and white labels |
| Deep Amethyst | `#330066` | `--color-deep-amethyst` | Dark-mode link variant, decorative deep-violet wash — used at low prominence for links on lighter surfaces within the footer band |
| Obsidian Canvas | `#1e1e1e` | `--color-obsidian-canvas` | Page background, section canvas, input fields, dark surface base — the dominant near-black that everything else floats on |
| Carbon Layer | `#383838` | `--color-carbon-layer` | Elevated card surface, image borders, list-item dividers — one step lighter than the canvas for subtle layering without shadows |
| Void | `#000000` | `--color-void` | Hero overlay, deepest contrast surface, text-shadow reservoir — pure black for cinematic hero grading and maximum text contrast |
| Bone | `#e5e7e6` | `--color-bone` | Primary light text on dark surfaces — the dominant body and label color, nearly white but warmed off pure to sit comfortably on near-black |
| Paper White | `#ffffff` | `--color-paper-white` | Headlines, logo, pure-contrast text, button labels on violet fills — reserved for highest-emphasis copy where absolute white reads correctly |
| Pewter | `#bbbbbb` | `--color-pewter` | Secondary body text, muted labels, low-emphasis copy — sits between Bone headings and darker supporting text for a clear hierarchy |
| Graphite | `#888888` | `--color-graphite` | Tertiary text, disabled states, footer micro-copy — the deepest readable gray, used when content should be present but invisible |

## Tokens — Typography

### Archivo — Primary typeface for all interface text — geometric sans-serif with a slightly condensed, editorial feel. Weights 400 for body, 600 for subheads and nav, 700 for display headlines. Display sizes (40–72px) use tight line-heights (0.98–1.07) so multi-line headlines stack as compact editorial blocks rather than airy marketing copy. · `--font-archivo`
- **Substitute:** Inter, DM Sans, or Manrope
- **Weights:** 400, 600, 700
- **Sizes:** 12, 13, 14, 15, 16, 18, 20, 25, 30, 32, 40, 42, 50, 72
- **Line height:** 0.98, 1.00, 1.05, 1.06, 1.07, 1.20, 1.23, 1.25, 1.27, 1.29, 1.30, 1.34, 1.39, 1.40, 1.50, 1.56, 1.80, 1.86, 2.22
- **Role:** Primary typeface for all interface text — geometric sans-serif with a slightly condensed, editorial feel. Weights 400 for body, 600 for subheads and nav, 700 for display headlines. Display sizes (40–72px) use tight line-heights (0.98–1.07) so multi-line headlines stack as compact editorial blocks rather than airy marketing copy.

### Figtree — Button labels and small-caps CTAs — a slightly softer, rounder sans-serif that warms the button type. Use only for interactive labels at 14–16px where the geometric Archivo reads too clinical. · `--font-figtree`
- **Substitute:** DM Sans 600 or Plus Jakarta Sans 600
- **Weights:** 600
- **Sizes:** 14, 16
- **Line height:** 1.20
- **Role:** Button labels and small-caps CTAs — a slightly softer, rounder sans-serif that warms the button type. Use only for interactive labels at 14–16px where the geometric Archivo reads too clinical.

### Clarkson — Sparingly used serif/display accent for editorial pull-quotes or section eyebrows — brings a magazine-voice contrast to the otherwise all-sans interface. · `--font-clarkson`
- **Substitute:** Fraunces 400 or Recoleta 400
- **Weights:** 400
- **Sizes:** 18
- **Line height:** 1.50, 1.70
- **Role:** Sparingly used serif/display accent for editorial pull-quotes or section eyebrows — brings a magazine-voice contrast to the otherwise all-sans interface.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.56 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 25px | 1.29 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 42px | 1.07 | — | `--text-heading-lg` |
| display-lg | 50px | 1.05 | — | `--text-display-lg` |
| display | 72px | 0.98 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 58 | 58px | `--spacing-58` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 300px |
| cards | 8px |
| links | 11px |
| inputs | 99px |
| buttons | 300px |
| decorative | 700px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Slim top-of-page banner for product launches and promotions

Full-bleed dark strip (#1e1e1e) at the very top of the page, centered text in Bone (#e5e7e6) at 13px Archivo 400 with a violet underlined link and a small × dismiss icon on the right. Height ≈ 40px, no border, sits flush against the nav.

### Primary Navigation
**Role:** Site-wide top navigation with logo, links, and CTA

Transparent background over hero, switches to #1e1e1 on scroll. Left: white "stability.ai" wordmark in Archivo 600. Center: horizontal nav links (Models, Solutions, Brand Studio, Deployment, Insights, Press, Company) in Bone at 15px Archivo 400. Right: pill-shaped "Contact us" button in #a381ff with white label, 300px radius, 8px 24px padding.

### Pill Primary Button
**Role:** Filled violet CTA for highest-priority actions

Background #a381ff, label white at 16px Figtree 600, 300px border-radius, 10px vertical × 24px horizontal padding. No border, no shadow. Used for "Get started here", "Sign up", "Contact us". Letter-spacing normal, text-center.

### Outlined Violet Button
**Role:** Ghost/outlined secondary action with chromatic border

Transparent background, 1.5px border in Indigo Edge #776cff, label in #776cff at 16px Figtree 600, 300px radius, 10px 24px padding. Used when a secondary action should still carry brand color but not compete with the filled primary.

### Text Link with Arrow
**Role:** Inline link with directional affordance

Bone (#e5e7e6) or Iris Spark (#a381ff) label at 16px Archivo 400 with a trailing "→" arrow in the same color. Underline appears on hover. Used for "Work with us →" style inline CTAs inside body copy.

### Pill Input Field
**Role:** Text input for email capture and form fields

Background #1e1e1, 1px border in #383838, Bone placeholder text at 14px Archivo 400, 99px border-radius, 12px 20px padding. On focus: border shifts to #a381ff. Label sits above in Pewter (#bbbbbb) at 12px Archivo 400.

### Hero Section
**Role:** Full-bleed photographic hero with composited UI overlay

Full-viewport height, background is a cinematic editorial photograph (no gradient overlay in the image area). Left third: a dark gradient overlay (Void #000000 → transparent at 30deg) carries a left-aligned kicker ("_ brand studio" with an underscore prefix in Mauve Veil), then a 5-line display headline in Paper White at 72px Archivo 700, line-height 0.98, followed by the Pill Primary Button. The right two-thirds of the hero shows the raw photograph with floating UI mockup cards composited on top — dark semi-transparent panels with light text and images, suggesting the product in use.

### Centered Editorial Section
**Role:** Dark-background statement section between feature blocks

Full-width #1e1e1 background, max-width 800px content centered horizontally, generous vertical padding (120px top/bottom). Headline in Paper White at 50–72px Archivo 700, tight line-height 1.05. Body in Pewter (#bbbbbb) at 18px Archivo 400, max 2 lines. Ends with a Text Link with Arrow in Iris Spark.

### Footer
**Role:** Site-wide footer with sitemap, newsletter, and social

Dark #1e1e1 background with a thin Iris Spark (#a381ff) gradient band at the top edge as a brand divider. Four-column layout (Brand + Newsletter | Models | Deployment | Legal) at max-width 1200px, column headers in Bone uppercase at 12px Archivo 600 with letter-spacing 1px. Column links in Pewter at 14px Archivo 400, 10px row-gap. Newsletter block has Pill Input + Pill Primary Button stacked. Social icons (LinkedIn, X, YouTube, Discord) as 36px circular buttons with #a381ff background and white icons. Copyright in Graphite (#888888) at 12px.

### Footer Column Header
**Role:** Section label in the footer sitemap

All-caps Bone (#e5e7e6) text at 12px Archivo 700, letter-spacing 1px, with a 2px Iris Spark (#a381ff) underline accent (8px wide) directly below the text to mark the section start.

### Social Icon Button
**Role:** Circular social link in the footer

36px × 36px circle, background #a381ff, white icon centered, no border, no shadow. Arranged in a horizontal row with 8px gap.

### Dropdown Select
**Role:** Native-styled select for form choices

Pill-shaped (99px radius) with #1e1e1 background, 1px #383838 border, Bone label at 14px Archivo 400, and a small chevron icon in Pewter. Matches the Pill Input Field exactly except with a dropdown caret.

## Do's and Don'ts

### Do
- Use #a381ff as the sole chromatic accent for all filled CTAs, active states, and directional arrows
- Set all buttons and tags to 300px border-radius and all inputs to 99px border-radius — pill shapes are non-negotiable
- Use Archivo at 700 weight for display headlines with line-height between 0.98 and 1.07 to keep multi-line headlines tightly stacked
- Layer depth through tonal shifts (#1e1e1 → #383838 → #000000) and 1px hairline dividers — never introduce box-shadows
- Reserve #e5e7e6 Bone for body text and #ffffff Paper White for highest-emphasis headlines and button labels
- Use #725d91 Mauve Veil for headings and body text on dark when you want the page to feel tonally unified with the violet accent
- Set section vertical padding between 80px and 120px and constrain editorial text blocks to max-width 800px

### Don't
- Do not introduce any chromatic color outside the violet family — the single-accent system is the identity
- Do not add box-shadows to cards or panels; the dark canvas makes them invisible or artifactual
- Do not use sharp corners (0–4px radius) on buttons, inputs, or tags — the system is pill-first
- Do not use #ffffff as a body color on dark; reserve it for headlines and button labels where pure white reads correctly, use #e5e7e6 for running text
- Do not use #330066 as a primary action color — it is a deep link/decoration tone, not a CTA
- Do not mix serif and sans within the same content block; Clarkson appears only as a rare editorial accent, not alongside Archivo body copy
- Do not let photography sit in rounded containers or masks — hero images must bleed to the viewport edge

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#1e1e1` | Page-level background for all non-hero sections |
| 1 | Carbon Layer | `#383838` | Elevated card and panel surfaces on the dark canvas |
| 2 | Void | `#000000` | Hero gradient overlay and deepest contrast zone |
| 3 | Iris Spark | `#a381ff` | Chromatic accent surface for filled buttons and active states |

## Elevation

This design deliberately avoids drop shadows. On a #1e1e1 canvas, shadows are invisible — depth is communicated through tonal layering (Obsidian Canvas #1e1e1 → Carbon Layer #383838 → Void #000000), generous negative space, and 1px hairline dividers in #383838. Do not introduce box-shadows on cards or panels; they will read as artifacts, not elevation.

## Imagery

Photography is the primary visual medium and dominates the hero. Treatment is full-bleed, editorial, high-production — a model wearing branded headphones set against a field of poppies, lit in warm golden-hour tones that contrast with the cold dark UI. The image is never masked or rounded; it bleeds to the full viewport. Floating UI mockups (dark semi-transparent panels showing product screenshots, model selectors, and image galleries) are composited on top of the photograph, merging the product and its output into a single frame. No illustrations, no 3D renders, no abstract graphics. Icon style: small, monochrome, line-weight icons inside the composited UI panels and footer social links. Photography role: aspirational proof-of-capability — the image is the creative output the platform promises. Density: hero is image-dominant (≈70% of viewport), while remaining sections are text-dominant with no photography.

## Layout

Full-bleed cinematic hero with a left-aligned text block composited over a dark gradient on the left third and a full-bleed photograph on the right two-thirds. The page then transitions to centered editorial sections on the #1e1e1 canvas — single-column max-width ≈ 800px blocks with generous 80–120px vertical padding between them. The footer is a four-column contained layout at max-width 1200px with a thin Iris Spark gradient band as a brand separator. Navigation is a transparent top bar over the hero, becoming opaque on scroll. No card grids, no masonry, no pricing tables on the visible screens — the layout is editorial and linear. Spacing density is comfortable: sections breathe, body text is centered and short, and the only tight density lives inside the composited UI mockup overlays.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #e5e7e6 Bone
- text (highest emphasis): #ffffff Paper White
- text (muted/secondary): #bbbbbb Pewter
- background (page canvas): #1e1e1e Obsidian Canvas
- background (elevated surface): #383838 Carbon Layer
- accent (all interactive signaling): #a381ff Iris Spark
- primary action: no distinct CTA color
- outlined action: #776cff Indigo Edge (1.5px border, transparent fill)
- link: #a381ff Iris Spark with trailing arrow
- border (hairline): #383838 Carbon Layer

## 3–5 Example Component Prompts

1. **Hero with left-aligned headline over photographic background**: Full-viewport section, background image bleeding to all edges. Left third: linear gradient from #000000 at 0% to transparent at 60% (angle 90deg). Kicker text "_ brand studio" in #725d91 at 16px Archivo 400 with an underscore prefix, then headline in #ffffff at 72px Archivo 700, line-height 0.98, letter-spacing normal, max 5 lines. Below the headline: a filled pill button, background #a381ff, white label "Get started here" at 16px Figtree 600, 300px radius, 10px 24px padding.

2. **Centered editorial statement section**: Background #1e1e1e, vertical padding 120px top and bottom, content max-width 800px centered. Headline in #ffffff at 50px Archivo 700, line-height 1.05. Subhead in #bbbbbb at 18px Archivo 400, line-height 1.50, max 2 lines. End with an inline text link "Work with us →" in #a381ff at 16px Archivo 400.

3. **Pill email capture input with submit button**: Input field: background #1e1e1e, 1px border in #383838, border-radius 99px, padding 12px 20px, placeholder text "Email*" in #e5e7e6 at 14px Archivo 400, focus border becomes #a381ff. Below it, a filled pill button: background #a381ff, label "Sign up" in #ffffff at 16px Figtree 600, 300px radius, 10px 24px padding.

4. **Footer sitemap column**: Background #1e1e1e. Column header in #e5e7e6 at 12px Archivo 700, all-caps, letter-spacing 1px, with a 2px × 8px #a381ff underline accent directly below. Links stacked vertically in #bbbbbb at 14px Archivo 400, 10px row-gap, hover state changes color to #a381ff.

5. **Social icon row in footer**: Four 36px × 36px circular buttons in a horizontal row with 8px gap. Each button: background #a381ff, white line-icon centered (LinkedIn, X, YouTube, Discord), no border, no shadow. Row sits right-aligned in the footer at max-width 1200px.

## Similar Brands

- **Runway** — Same dark-canvas editorial layout with full-bleed cinematic photography and a single vivid accent for CTAs
- **Midjourney** — Dark-mode interface with minimal chrome, violet-leaning accent system, and image-first hero where the generated output IS the page
- **Pika** — Near-black canvas with a single chromatic button color, pill-shaped CTAs, and editorial display headlines stacked tight
- **Linear** — Dark UI with one accent color, generous spacing rhythm, and pill-shaped inputs and buttons — though Linear skews blue, the structural DNA is identical
- **Anthropic** — Dark editorial layout with centered statement sections, full-bleed hero, and a single warm accent against near-black

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris-spark: #a381ff;
  --color-indigo-edge: #776cff;
  --color-mauve-veil: #725d91;
  --color-lilac-ash: #b6a9c6;
  --color-deep-amethyst: #330066;
  --color-obsidian-canvas: #1e1e1e;
  --color-carbon-layer: #383838;
  --color-void: #000000;
  --color-bone: #e5e7e6;
  --color-paper-white: #ffffff;
  --color-pewter: #bbbbbb;
  --color-graphite: #888888;

  /* Typography — Font Families */
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clarkson: 'Clarkson', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.56;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.29;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.07;
  --text-display-lg: 50px;
  --leading-display-lg: 1.05;
  --text-display: 72px;
  --leading-display: 0.98;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-58: 58px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-xl: 15px;
  --radius-full: 99px;
  --radius-full-2: 300px;
  --radius-full-3: 700px;

  /* Named Radii */
  --radius-tags: 300px;
  --radius-cards: 8px;
  --radius-links: 11px;
  --radius-inputs: 99px;
  --radius-buttons: 300px;
  --radius-decorative: 700px;

  /* Surfaces */
  --surface-obsidian-canvas: #1e1e1;
  --surface-carbon-layer: #383838;
  --surface-void: #000000;
  --surface-iris-spark: #a381ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris-spark: #a381ff;
  --color-indigo-edge: #776cff;
  --color-mauve-veil: #725d91;
  --color-lilac-ash: #b6a9c6;
  --color-deep-amethyst: #330066;
  --color-obsidian-canvas: #1e1e1e;
  --color-carbon-layer: #383838;
  --color-void: #000000;
  --color-bone: #e5e7e6;
  --color-paper-white: #ffffff;
  --color-pewter: #bbbbbb;
  --color-graphite: #888888;

  /* Typography */
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-clarkson: 'Clarkson', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.56;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.29;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.07;
  --text-display-lg: 50px;
  --leading-display-lg: 1.05;
  --text-display: 72px;
  --leading-display: 0.98;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-58: 58px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-xl: 15px;
  --radius-full: 99px;
  --radius-full-2: 300px;
  --radius-full-3: 700px;
}
```
