# Henry — Style Reference
> Gothic broadside poster on warm cream paper. One hundred percent monochrome, no chromatic accent, all visual intensity carried by display type and full-bleed paper-to-ink inversions.

**Theme:** mixed

Henry Codes reads like an editorial broadside printed in warm ink: near-black headlines carved into cream paper, alternating with full-bleed dark sections where cream serif type glows. The palette is one-hundred-percent warm monochrome — no chromatic accent, no product color, no blue link — every visual move comes from scale, weight, and inversion. Type is the brand: a display serif (Louize) sets poetry and editorial prose, a condensed display sans (Manuka) stamps section headers at 200–370px, and a neo-grotesque (Neue Montreal) carries all UI at 12–24px. The spacing system is austere: 4–32px increments, one radius (12px), no shadows. Sections flip between paper and ink like a broadsheet newspaper, and most screens should be dominated by two or three enormous words rather than illustrated product art.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#fafafa` | `--color-paper` | Page background, card surfaces, inverted-section type — the cream-white ground that all dark type sits on |
| Hairline | `#eeeeee` | `--color-hairline` | Card and tile borders — only visible against Paper |
| Midstone | `#9f9f9f` | `--color-midstone` | Nav borders, muted borders, light decorative borders on dark sections |
| Ash | `#666666` | `--color-ash` | Secondary borders, muted UI text, low-emphasis dividers |
| Pebble | `#b3b3b3` | `--color-pebble` | Inactive nav text and borders |
| Sepia | `#3e3b36` | `--color-sepia` | Strong borders, secondary heading text — the warm-brown near-black that flanks Headline Ink |
| Headline Ink | `#2a2722` | `--color-headline-ink` | Primary text, body ink, dominant borders, nav rules — warm near-black that carries every word on the page |

## Tokens — Typography

### Neue Montreal — All UI, body, nav, and small labels at 12–32px. Weight 400 for body, 700 for nav items and labels. -0.01em tracking is hairline-tight even at body sizes — the type is condensed, not airy · `--font-neue-montreal`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 400, 700
- **Sizes:** 12px, 16px, 20px, 24px, 32px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.01em across all sizes
- **Role:** All UI, body, nav, and small labels at 12–32px. Weight 400 for body, 700 for nav items and labels. -0.01em tracking is hairline-tight even at body sizes — the type is condensed, not airy

### Louize Display — Editorial display serif for headlines, section titles, and the centered prose blocks in dark sections. The high-contrast, narrow-serif italics mixed with the roman create the broadside feel. 77px is the standard section hero, 116–132px is the marquee headline · `--font-louize-display`
- **Substitute:** Fraunces, GT Sectra, Lyon Display
- **Weights:** 400
- **Sizes:** 32px, 35px, 77px, 116px, 126px, 132px
- **Line height:** 0.80–1.20
- **Role:** Editorial display serif for headlines, section titles, and the centered prose blocks in dark sections. The high-contrast, narrow-serif italics mixed with the roman create the broadside feel. 77px is the standard section hero, 116–132px is the marquee headline

### Louize — Secondary serif for short editorial copy and link text alongside Louize Display · `--font-louize`
- **Substitute:** Fraunces, GT Sectra
- **Weights:** 400
- **Sizes:** 16px, 20px, 24px
- **Line height:** 1.20–1.30
- **Letter spacing:** -0.0100em
- **Role:** Secondary serif for short editorial copy and link text alongside Louize Display

### Manuka — Ultra-condensed display sans stamped at near-architectural scale (226–371px) for section mastheads like SELECTED WORKS. 0.75 line-height locks the glyphs into a tight horizontal slab that spans edge-to-edge. Only ever used white-on-ink or ink-on-paper, always in one weight, always uppercase · `--font-manuka`
- **Substitute:** Druk, Condor, Antonio
- **Weights:** 400
- **Sizes:** 226px, 371px
- **Line height:** 0.75–0.80
- **Role:** Ultra-condensed display sans stamped at near-architectural scale (226–371px) for section mastheads like SELECTED WORKS. 0.75 line-height locks the glyphs into a tight horizontal slab that spans edge-to-edge. Only ever used white-on-ink or ink-on-paper, always in one weight, always uppercase

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.12px | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.3 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.24px | `--text-heading-sm` |
| heading | 32px | 1.1 | -0.32px | `--text-heading` |
| heading-lg | 77px | 0.9 | — | `--text-heading-lg` |
| display | 132px | 0.8 | — | `--text-display` |
| display-xl | 371px | 0.75 | — | `--text-display-xl` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 12px |
| cards | 12px |
| buttons | 12px |

### Layout

- **Section gap:** 64-96px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Masthead Display Headline
**Role:** Hero and section-defining typography

Louize Display at 116–132px, weight 400, line-height 0.8, color #2a2722 on Paper or #fafafa on Ink. Sometimes intersected with an italic Louize Display phrase at half size set inside the same baseline (e.g. 'of the' italic at 35px set within 'TRUE TERRORS / NEW DARK WEB' at 132px). No tracking, no all-caps, relies on the serif contrast for presence.

### Stamped Display Section Header
**Role:** Full-bleed section titles on dark inverted bands

Manuka at 226–371px, weight 400, line-height 0.75, uppercase, color #fafafa on #2a2722. Stretches edge-to-edge with a trailing em-dash or rule. Single-weight, single-color — the slab of condensed type is the entire section identity.

### Top Ticker Banner
**Role:** Full-bleed announcement strip above the masthead

Neue Montreal 12px, weight 400, letter-spacing -0.12px, color #2a2722, set in uppercase on Paper. Optional horizontal hairline dividers in #2a2722 at 1px above and below. Padding 4–6px vertical, full-bleed.

### Inverted Editorial Letter
**Role:** Centered prose block on a full-bleed dark section

Background #2a2722, padding 48–64px vertical, full-bleed. Body text in Louize Display at 32px, weight 400, line-height 1.2, color #fafafa, text-align center. Optional small-caps eyebrow at top and bottom ('A BRIEF LETTER FROM THE EDITOR', 'A LETTER FROM THE WORK DESK') in Neue Montreal 12px, weight 400, letter-spacing -0.12px, color #fafafa, opacity 0.6.

### Nav Link (Uppercase)
**Role:** Top-of-page navigation items

Neue Montreal 12–16px, weight 700, uppercase, color #2a2722, letter-spacing -0.12px. No underline, no background. Active state shares the same color but is set in a larger size (16–20px) — emphasis comes from scale, not color or weight shift.

### Section Divider Rule
**Role:** Horizontal separation between editorial sections

1px solid #2a2722, full-bleed width, no margin. Used as a typographic break, never decorative.

### Brand Ticker Strip
**Role:** Recurring brand names in a horizontally repeated marquee band

Full-bleed dark band (#2a2722). Brand names in Louize Display at 24–32px, weight 400, color #fafafa, repeated horizontally with tight gap. Interleaved with a small 'COMING SOON' tag (Neue Montreal 12px, weight 400, uppercase, #fafafa, 12px radius, 4px 8px padding, 1px border #fafafa).

### Coming Soon Tag
**Role:** Status pill overlaid on a brand ticker entry

Neue Montreal 12px, weight 400, uppercase, color #fafafa, 1px solid #fafafa border, 12px radius, padding 4px 8px. No background fill — outlined ghost variant only.

### Coordinate Footer
**Role:** Small monospaced-feel footer line

Neue Montreal 12px, weight 400, letter-spacing -0.12px, color #2a2722, single-line format '° 43°31'56" N 104° 58' 0.94" (DENVER, COLORADO) — 11:27 PM — ● 48°9 @ N 39°43'31'56" W 104°58' 0.94" (DENVER, COLOR...'. Uppercase with em-dash separators.

### Hero Halftone Plate
**Role:** Right-side illustration block in the hero

Full-height image area (~60% of hero width), no border-radius (square corners), monochrome halftone illustration in Headline Ink on Paper. Functions as typographic counterweight to the display headline — no caption, no label.

### Footnotes / Meta Line
**Role:** Small all-caps caption beneath a major work

Neue Montreal 12px, weight 400, uppercase, letter-spacing -0.12px, color #2a2722. Used for 'READ THE CASE STUDY ON GODCOMMON.COM'-style attribution lines.

## Do's and Don'ts

### Do
- Use Louize Display at 77px+ for any section-defining headline; below that, the editorial feel collapses into generic web type
- Set body and UI type in Neue Montreal at 12/16/20/24/32px with -0.01em letter-spacing — never let body text breathe wider than 1.5 line-height
- Alternate Paper (#fafafa) and Ink (#2a2722) sections as full-bleed bands; never gradient-blend between them, never place a card that crosses the boundary
- Use 12px as the only border-radius across cards, buttons, and tags — no square corners, no pill shapes (no 9999px)
- Carry all display typography in #2a2722 on Paper or #fafafa on Ink — no third surface color, no shadowed cards, no tinted panels
- Use Manuka only for the largest section mastheads (226–371px) and always in one weight, one case, one color — the type does the work alone
- Let 90% of any page be empty Paper or Ink; dense regions are limited to the brand ticker and the bottom-byline

### Don't
- Never introduce a chromatic accent color — the system is one-hundred-percent warm monochrome, and any blue/red/green breaks the broadside identity
- Never use a filled colored CTA button — the role evidence shows zero action backgrounds; emphasis comes from scale and inversion, not fill
- Never apply box-shadow, drop-shadow, or glow — there are no detected shadows and adding them turns the editorial print feel into generic SaaS card UI
- Never set body copy in Louize Display at 116–132px; the display serif is for headlines only and becomes illegible below 32px on long passages
- Never use a border-radius other than 12px; no sharp 0px, no pills, no asymmetric rounding
- Never break the Paper/Ink binary with a gray panel, a muted surface, or a tinted hero gradient — those don't exist in the token set
- Never center-align body copy in Neue Montreal; only Louize Display/Louize editorial blocks use center alignment, and only inside Ink sections

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#fafafa` | Page canvas — cream-white ground |
| 2 | Ink | `#2a2722` | Full-bleed dark sections where cream serif type is set inverted |

## Elevation

The system is shadowless by design. There are zero detected box-shadows, drop-shadows, or elevation tokens. Hierarchy is communicated entirely through type scale, color inversion, and 1px hairline borders — never through depth. This is an editorial print metaphor, not a Material/iOS elevation model: the page lies flat on the paper surface, and dark sections are achieved by flipping the canvas to ink, not by floating panels above it.

## Imagery

Imagery is treated as monochrome halftone illustration only — no photography, no product screenshots, no gradients, no color images. The hero uses a square right-side plate showing a black butterfly/moth creature in halftone dots against the cream paper. All imagery is high-contrast black-on-white or white-on-black, sharp square corners, no rounded masks, no overlap with type. Illustrations function as typographic counterweights inside a paper/ink composition rather than as standalone visuals. Iconography is absent from the interface — no system icons, no nav icons, no UI pictograms. Social proof and client logos are rendered as Louize Display wordmarks inside a dark ticker band rather than as image files.

## Layout

Layout is full-bleed editorial — no max-width container, no sidebar, no card grid in the traditional sense. The page stacks as a sequence of horizontally-bleed sections that alternate Paper and Ink bands. The hero is a split composition: oversized Louize Display headline occupies the left two-thirds with no padding constraint, and a square halftone illustration block anchors the right third. Subsequent sections are centered single-column editorial blocks (the inverted letter) or horizontally-tickered marquee bands. Navigation is a minimal top-left list of uppercase items with no background bar. The page model is zine/broadsheet, not SaaS dashboard: vertical rhythm is loose (64–96px between sections) but each section is internally dense with type. No grids of feature cards, no pricing tables, no comparison blocks — content is delivered as long-form editorial prose and a single works ticker.

## Agent Prompt Guide

Quick Color Reference:
- text: #2a2722 (Headline Ink) on #fafafa (Paper)
- background: #fafafa (Paper) for default, #2a2722 (Ink) for inverted sections
- border: #2a2722 for strong rules, #9f9f9f for muted, #eeeeee for hairline on cards
- accent: none (system is fully monochrome)
- primary action: no distinct CTA color

3-5 Example Component Prompts:
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Create an inverted editorial section: full-bleed #2a2722 background, padding 64px vertical. Eyebrow 'A BRIEF LETTER FROM THE EDITOR' in Neue Montreal 12px weight 400 uppercase letter-spacing -0.12px color #fafafa centered at top. Body in Louize Display 32px weight 400 line-height 1.2 color #fafafa text-align center, 3–5 short lines. Mirror eyebrow at bottom.
3. Create a stamped section header: full-bleed #2a2722 background, padding 48px vertical. Single line 'SELECTED WORKS' in Manuka 226px weight 400 line-height 0.75 color #fafafa uppercase, with a trailing horizontal white rule extending to the right edge.
4. Create a brand ticker band: full-bleed #2a2722 background, no padding. Louize Display 24px weight 400 color #fafafa brand names ('Stripe', 'YouTube', 'The New York Times', 'Matter', 'Uber Eats x Taco Bell') repeated horizontally at 32px gap, one row. Overlay a 'COMING SOON' ghost tag (Neue Montreal 12px weight 400 uppercase, 1px solid #fafafa border, 12px radius, 4px 8px padding) on selected entries.
5. Create a top nav: Paper (#fafafa) background, no bar. Left-aligned vertical list of Neue Montreal 12px weight 700 uppercase items in #2a2722, 12px row gap. Active item rendered larger (16px) but same color/weight. No underline, no background highlight.

## Similar Brands

- **Pentagram** — Same editorial-broadsheet approach: display serif headlines, paper-white canvas, zero chromatic accent, type as the only visual asset
- **Manual (manualcreative.com)** — Same condensed display sans (Druk/Manuka-family) stamped at near-architectural scale for section mastheads, same warm-paper monochrome palette
- **Locomotive (locomotive.ca)** — Same oversized display-serif hero with italic inline subhead treatment, same full-bleed alternating light/dark editorial bands
- **Cereal magazine** — Same print-magazine metaphor: cream paper, warm near-black ink, serif display for headlines, no shadows, one radius (12px), zero color accent
- **Rauno Freiberg** — Same brutalist personal-portfolio instinct: type-only hero, monochrome palette, no CTAs, no product art, the design IS the work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper: #fafafa;
  --color-hairline: #eeeeee;
  --color-midstone: #9f9f9f;
  --color-ash: #666666;
  --color-pebble: #b3b3b3;
  --color-sepia: #3e3b36;
  --color-headline-ink: #2a2722;

  /* Typography — Font Families */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-louize-display: 'Louize Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-louize: 'Louize', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manuka: 'Manuka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-heading-lg: 77px;
  --leading-heading-lg: 0.9;
  --text-display: 132px;
  --leading-display: 0.8;
  --text-display-xl: 371px;
  --leading-display-xl: 0.75;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-224: 224px;

  /* Layout */
  --section-gap: 64-96px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;

  /* Named Radii */
  --radius-tags: 12px;
  --radius-cards: 12px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-paper: #fafafa;
  --surface-ink: #2a2722;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper: #fafafa;
  --color-hairline: #eeeeee;
  --color-midstone: #9f9f9f;
  --color-ash: #666666;
  --color-pebble: #b3b3b3;
  --color-sepia: #3e3b36;
  --color-headline-ink: #2a2722;

  /* Typography */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-louize-display: 'Louize Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-louize: 'Louize', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manuka: 'Manuka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-heading-lg: 77px;
  --leading-heading-lg: 0.9;
  --text-display: 132px;
  --leading-display: 0.8;
  --text-display-xl: 371px;
  --leading-display-xl: 0.75;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-xl: 12px;
}
```
