# Huddle — Style Reference
> Pastel inventory cards on cream paper

**Theme:** light

Huddle uses a quiet, editorial curation language: off-white canvas, large confident headlines, and three muted pastel card colors (sage, lavender, dusty rose) that function as category tiles for project listings. The palette is intentionally desaturated — no vivid neons, no high-saturation accents — so the system reads as a considered directory rather than a marketplace. Typography is set in a single custom sans (Nng) that carries the entire information hierarchy, with all-caps micro-labels and dot-prefixed status tags adding a catalog/inventory feel. Components lean pill-shaped (100px radius on links, 1000px on primary buttons) and borders are thin 1px hairlines rather than heavy shadows, keeping the surface flat and poster-like.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card base, text on dark cards — the dominant surface |
| Ink Black | `#151515` | `--color-ink-black` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Graphite | `#23241f` | `--color-graphite` | Secondary text, subtle borders |
| Slate Gray | `#3a4444` | `--color-slate-gray` | Muted text, inactive tags, form labels |
| Stone Border | `#333333` | `--color-stone-border` | Hairline borders, dividers, card outlines |
| Mist Gray | `#808080` | `--color-mist-gray` | Tertiary text, disabled states |
| Bone | `#e5e6e1` | `--color-bone` | Soft surface tint, secondary card backgrounds |
| Pale Sage | `#d3e5e9` | `--color-pale-sage` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Lavender Mist | `#bbb2ce` | `--color-lavender-mist` | Lavender card variant — secondary project category, tag fills |
| Dusty Rose | `#cb9da2` | `--color-dusty-rose` | Red state accent for badges, validation surfaces, and short status labels. |
| Deep Violet | `#453b60` | `--color-deep-violet` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Burnt Amber | `#65451d` | `--color-burnt-amber` | Warm brown border accent on tags and badges — the signature warm neutral that anchors the cool pastels |
| Honey Gold | `#e4b976` | `--color-honey-gold` | Gold accent for tag text, highlighted labels — the single warm highlight color |
| Burgundy | `#5c2529` | `--color-burgundy` | Error/status red — badge backgrounds and warning borders |
| Blush Border | `#d79caa` | `--color-blush-border` | Soft pink border accent for rose-category cards and tags |

## Tokens — Typography

### Nng — Primary typeface across all contexts: display headlines (44–69px, weight 300–400), headings (22–29px, weight 500), body (14–18px, weight 400), captions and micro-labels (12–13px, weight 500, uppercase). Custom geometric sans with tight tracking on large sizes (-0.021em at 69px) — the slight negative tracking makes the large display headlines feel dense and poster-like rather than airy. · `--font-nng`
- **Substitute:** Inter, Söhne, or Untitled Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px, 21px, 22px, 29px, 40px, 44px, 69px
- **Line height:** 1.10 – 1.58
- **Letter spacing:** -0.021em at 69px, -0.011em at 29–40px, -0.010em at 22px, -0.008em at 16–18px
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** Primary typeface across all contexts: display headlines (44–69px, weight 300–400), headings (22–29px, weight 500), body (14–18px, weight 400), captions and micro-labels (12–13px, weight 500, uppercase). Custom geometric sans with tight tracking on large sizes (-0.021em at 69px) — the slight negative tracking makes the large display headlines feel dense and poster-like rather than airy.

### Roboto — Secondary system font used sparingly — likely for rendered user content (descriptions, quotes) where a neutral fallback is needed. Weight 400 only, tight tracking (-0.103em) gives it a condensed feel. · `--font-roboto`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.25, 1.43
- **Letter spacing:** -0.1030em
- **Role:** Secondary system font used sparingly — likely for rendered user content (descriptions, quotes) where a neutral fallback is needed. Weight 400 only, tight tracking (-0.103em) gives it a condensed feel.

### Apercu pro mono — Monospaced accent — used for code-like or identifier text (project IDs, timestamps). Normal letter-spacing distinguishes it from the proportional Nng. · `--font-apercu-pro-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.42
- **Role:** Monospaced accent — used for code-like or identifier text (project IDs, timestamps). Normal letter-spacing distinguishes it from the proportional Nng.

### Moderat — Moderat — detected in extracted data but not described by AI · `--font-moderat`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.2, 1.5
- **Letter spacing:** -0.021
- **Role:** Moderat — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 12px | 1.58 | — | `--text-micro` |
| caption | 14px | 1.5 | -0.01px | `--text-caption` |
| body-sm | 16px | 1.45 | -0.13px | `--text-body-sm` |
| body | 18px | 1.42 | -0.14px | `--text-body` |
| subheading | 22px | 1.32 | -0.22px | `--text-subheading` |
| heading-sm | 29px | 1.3 | -0.32px | `--text-heading-sm` |
| heading | 40px | 1.22 | -0.48px | `--text-heading` |
| heading-lg | 44px | 1.2 | -0.92px | `--text-heading-lg` |
| display | 69px | 1.1 | -1.45px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 8px |
| pills | 100px |
| badges | 4px |
| buttons | 1000px |
| list-items | 24px |
| large-cards | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary Pill Button
**Role:** Main call-to-action (e.g., 'Get started')

Black fill (#151515), white text, 1000px border-radius (fully rounded), padding 16px 24px, Nng at 16px weight 500. No shadow, no border. The extra-rounded shape against the muted palette gives it weight without aggression.

### Ghost Text Link
**Role:** Secondary action (e.g., 'Apply as a designer')

No background, no border. Nng 16px weight 400, color #151515 with underline on hover. Sits beside the primary button at equal visual weight through spacing, not styling.

### Outlined Action Button
**Role:** Tertiary action, less emphasis than primary

Transparent background, 1px border in #151515 or accent color, 100px radius, padding 12px 20px, Nng 14px weight 500. Used for 'Get started' in secondary contexts.

### Project Card — Sage Variant
**Role:** Category tile for 'upcoming' or 'monitoring' projects

Background #d3e5e9 (pale sage), 1px hairline border #333333, 8px radius, padding 24px. Status label in uppercase Nng 12px weight 500 (e.g., 'COMING MONTHLY') in #3a4444. Project title in Nng 22px weight 500, color #151515. Tag pills inline at the bottom.

### Project Card — Lavender Variant
**Role:** Category tile for secondary projects

Background #bbb2ce (lavender mist), 1px hairline border #333333, 8px radius, padding 24px. Same structure as sage variant. Title in Nng 22px weight 500.

### Project Card — Dusty Rose Variant
**Role:** Category tile for 'shipped' or 'completed' projects

Background #cb9da2 (dusty rose), 1px hairline border #333333, 8px radius, padding 24px. Title in Nng 22px weight 500. Slightly warmer feel than the cool sage/lavender.

### Active Project Card
**Role:** Currently-in-progress project, higher emphasis

Lavender-tinted card with deep violet text (#453b60) instead of black. Signals 'live' status. Nng 22px weight 500, 'ACTIVE' label prefix in uppercase.

### Status Tag Pill
**Role:** Small inline label (e.g., 'Probiotics', 'Brand Designer')

100px border-radius, padding 4px 12px, Nng 13–14px weight 500, background #ffffff or light fill, 1px border in #65451d (burnt amber) or accent color. Text color matches border. The burnt-amber border is the signature warm accent that ties the tag system together.

### Step Section Header
**Role:** Section divider labeling process steps

All-caps Nng 12px weight 500, color #151515, preceded by a small bullet (•) or step number. Examples: 'STEP 1: THE BRIEF', 'STEP 2: THE TEAM'. Left-aligned, tight tracking, 16px+ bottom margin.

### Testimonial Card
**Role:** Social proof, quote from a past client

White background, 1px border #e5e6e1, 8px radius, padding 16px. Quote text in Nng 16px weight 400 italic, color #3a4444. Attribution below: avatar (40px circle) + name (Nng 16px weight 500) + role (Nng 14px weight 400, #808080).

### Team Forming Tag
**Role:** Role label inside project cards (e.g., 'Brand Designer')

Outlined pill with #453b60 (deep violet) border, 100px radius, padding 6px 12px, Nng 14px weight 500. The violet outline distinguishes 'needed roles' from 'filled roles' (which use a different fill).

### Beta Banner
**Role:** Top-of-page announcement strip

Centered text, Nng 13px weight 500, white background, 'Private Beta' in a outlined pill (1px border #151515, 100px radius, padding 2px 8px) followed by descriptive text in #3a4444. Sits flush at the very top of the page.

### Avatar Group
**Role:** Visual representation of the team inline in headlines

Three overlapping circular avatars (40px each, -12px overlap), 1px white border between them. Placed inline within display text as a visual device — the faces ARE the headline punctuation.

## Do's and Don'ts

### Do
- Use the three pastel card colors (sage #d3e5e9, lavender #bbb2ce, dusty rose #cb9da2) as a fixed category system — assign one to each project status and never mix within a single card.
- Set all tag pills and secondary buttons to 100px border-radius; reserve 1000px exclusively for the primary action button to create a clear hierarchy between fully rounded and pill-rounded.
- Use Nng at weight 300–400 for display headlines (44px+); the light weight on large sizes is the signature — bold display text would break the editorial register.
- Prefix all section labels with a bullet or step number in uppercase 12px Nng ('• STEP 1: THE BRIEF'); this micro-label system is the primary wayfinding device.
- Pair burnt amber (#65451d) borders with honey gold (#e4b976) text on tags — this warm-on-warm combination is the only place gold appears, so it reads as a highlight, not decoration.
- Maintain 1px hairline borders in #333333 or #e5e6e1 on all cards; never use box-shadow for elevation — the system is intentionally flat.
- Keep the canvas at #ffffff with generous 64px section gaps; the lightness and breathing room are what make the pastel cards legible.

### Don't
- Do not use box-shadow for card elevation — the system is flat by design, relying on hairline borders and background color contrast for separation.
- Do not introduce vivid or saturated colors (no electric blue, neon green, or pure red); all accent colors are muted and desaturated by design.
- Do not set display headlines in bold (weight 600+); Nng weight 300–400 on large sizes is the editorial signature — bold headlines would look like a different product.
- Do not use the same radius for all elements; the 100px pills vs. 8px cards vs. 1000px primary button create a deliberate visual rhythm of corner treatments.
- Do not place white text on pastel card backgrounds; the card titles should always be #151515 or #453b60 (deep violet for active) for contrast and consistency.
- Do not use more than two font families in a single view; Nng carries 95% of the system, Roboto appears only in rendered user content.
- Do not center-align body text or descriptions; left-align everything below the display headline to maintain the editorial/document feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Base page canvas and most card surfaces |
| 2 | Bone | `#e5e6e1` | Secondary card surface, subtle background tint |
| 3 | Lavender Mist | `#bbb2ce` | Lavender category card fill |
| 4 | Pale Sage | `#d3e5e9` | Sage category card fill |
| 5 | Dusty Rose | `#cb9da2` | Rose category card fill |

## Elevation

The design system intentionally avoids box-shadows. All elevation is achieved through background color contrast and 1px hairline borders (#333333, #e5e6e1). Cards on the white canvas rely on the pastel background fill (sage, lavender, rose) to create visual separation. This flat treatment reinforces the editorial/poster aesthetic and prevents the interface from feeling like a generic SaaS dashboard.

## Imagery

Imagery is minimal and functional: circular avatar photos (40–56px, 1px white border) used inline within text and in testimonial cards. No hero photography, no product screenshots, no decorative illustration. The visual weight comes from the pastel card system itself — the cards act as the imagery, each one a colored tile showcasing a real project. Icons are absent or extremely minimal (small bullet/dot glyphs only).

## Layout

Single-column page model with a centered max-width ~1200px container. The hero is a two-column split: left side holds the large display headline with inline avatar group and primary CTA, right side stacks 3–4 pastel project cards vertically as a live feed. Below the hero, the page flows as numbered process steps (STEP 1, STEP 2, …) in a two-column pattern: left column is instructional text with optional testimonial, right column is a feature card. Section rhythm is generous (64px gaps) with no alternating dark/light bands — everything stays on white. Navigation is a single wordmark logo (HUDDLE, all-caps, tight tracking) in the top-left, no nav links visible. The right-edge project feed persists in view as a sidebar-like element.

## Agent Prompt Guide

Quick Color Reference:
- text primary: #151515
- background: #ffffff
- border: #333333
- accent (card sage): #d3e5e9
- accent (card lavender): #bbb2ce
- accent (card rose): #cb9da2
- brand (active violet): #453b60
- tag border: #65451d
- primary action: #65451d (filled action)

3-5 Example Component Prompts:

1. Create a Primary Action Button: #65451d background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a project card grid: three cards stacked vertically, each 8px radius, 24px padding, 1px border #333333. Card 1: background #d3e5e9 (sage), uppercase 12px Nng 'COMING MONTHLY' label, title 'OneMedical for psychedelic and naturopathic therapists' in Nng 22px weight 500 #151515, three tag pills at bottom (100px radius, 1px border #65451d, text #e4b976). Card 2: background #bbb2ce (lavender), same structure. Card 3: background #cb9da2 (rose), same structure with 'SHIPPED' label.


4. Create a testimonial card: white background, 1px border #e5e6e1, 8px radius, 16px padding. Quote in Nng 16px weight 400 italic #3a4444. Attribution row: 40px circular avatar + 'Krystin Hargrove' in Nng 16px weight 500 + 'Founder at CoTripper' in Nng 14px weight 400 #808080.

5. Create a tag pill: 100px border-radius, 1px solid border #65451d, padding 4px 12px, text in Nng 13px weight 500, text color #65451d (or #e4b976 for highlighted tags). No background fill.

## Color Card Category System

The three pastel card colors are not arbitrary decoration — they form a fixed status taxonomy:
- Sage (#d3e5e9 background): 'COMING MONTHLY' — projects being monitored or upcoming
- Lavender (#bbb2ce background): 'BUILDING' or general/secondary — projects in formation
- Dusty Rose (#cb9da2 background): 'SHIPPED' — completed projects
- Deep Violet (#453b60 text on lavender): 'ACTIVE' — the currently live project, elevated within the lavender category by text color alone

This color-to-status mapping should be preserved across all project listings. Swapping card colors breaks the system's categorical meaning.

## Border Radius Vocabulary

The design uses a deliberate vocabulary of border radii, each with semantic meaning:
- 4px: small badges, inline labels, micro-elements
- 8px: standard cards, testimonial blocks, content containers
- 24px: list items, expanded cards with more visual weight
- 40px: hero/feature cards (e.g., the right-column 'CREATING HUDDLE' card)
- 100px: tag pills, secondary buttons, inline role labels
- 1000px: primary action button only — the fully rounded 'Get started' pill

Never use 0px (sharp corners) — even the smallest badges get 4px. The progression from 4px → 1000px is a hierarchy of prominence.

## Similar Brands

- **Read.cv** — Same flat editorial layout with a single custom sans typeface, left-aligned text, and minimal use of color — both treat the page like a document rather than a product page.
- **Are.na** — Similar muted/desaturated palette with pastel-tinted cards, generous whitespace, and a curatorial/archival sensibility over aggressive product marketing.
- **Craigslist redesigns (e.g., Minimal Craigslist)** — Same category-card aesthetic where each listing is a colored tile with a status indicator and tag pills — the design language of a structured directory.
- **Linear** — Both use a single custom sans, tight letter-spacing on large display sizes, pill-shaped buttons at 100px radius, and a restrained dark-on-light color palette with one or two accent colors.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #151515;
  --color-graphite: #23241f;
  --color-slate-gray: #3a4444;
  --color-stone-border: #333333;
  --color-mist-gray: #808080;
  --color-bone: #e5e6e1;
  --color-pale-sage: #d3e5e9;
  --color-lavender-mist: #bbb2ce;
  --color-dusty-rose: #cb9da2;
  --color-deep-violet: #453b60;
  --color-burnt-amber: #65451d;
  --color-honey-gold: #e4b976;
  --color-burgundy: #5c2529;
  --color-blush-border: #d79caa;

  /* Typography — Font Families */
  --font-nng: 'Nng', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-pro-mono: 'Apercu pro mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.58;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.01px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.13px;
  --text-body: 18px;
  --leading-body: 1.42;
  --tracking-body: -0.14px;
  --text-subheading: 22px;
  --leading-subheading: 1.32;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.32px;
  --text-heading: 40px;
  --leading-heading: 1.22;
  --tracking-heading: -0.48px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.92px;
  --text-display: 69px;
  --leading-display: 1.1;
  --tracking-display: -1.45px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 57.6px;
  --radius-full-2: 100px;
  --radius-full-3: 200px;
  --radius-full-4: 1000px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 8px;
  --radius-pills: 100px;
  --radius-badges: 4px;
  --radius-buttons: 1000px;
  --radius-list-items: 24px;
  --radius-large-cards: 40px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-bone: #e5e6e1;
  --surface-lavender-mist: #bbb2ce;
  --surface-pale-sage: #d3e5e9;
  --surface-dusty-rose: #cb9da2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-ink-black: #151515;
  --color-graphite: #23241f;
  --color-slate-gray: #3a4444;
  --color-stone-border: #333333;
  --color-mist-gray: #808080;
  --color-bone: #e5e6e1;
  --color-pale-sage: #d3e5e9;
  --color-lavender-mist: #bbb2ce;
  --color-dusty-rose: #cb9da2;
  --color-deep-violet: #453b60;
  --color-burnt-amber: #65451d;
  --color-honey-gold: #e4b976;
  --color-burgundy: #5c2529;
  --color-blush-border: #d79caa;

  /* Typography */
  --font-nng: 'Nng', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-pro-mono: 'Apercu pro mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.58;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.01px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.13px;
  --text-body: 18px;
  --leading-body: 1.42;
  --tracking-body: -0.14px;
  --text-subheading: 22px;
  --leading-subheading: 1.32;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.32px;
  --text-heading: 40px;
  --leading-heading: 1.22;
  --tracking-heading: -0.48px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.92px;
  --text-display: 69px;
  --leading-display: 1.1;
  --tracking-display: -1.45px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 57.6px;
  --radius-full-2: 100px;
  --radius-full-3: 200px;
  --radius-full-4: 1000px;
}
```
