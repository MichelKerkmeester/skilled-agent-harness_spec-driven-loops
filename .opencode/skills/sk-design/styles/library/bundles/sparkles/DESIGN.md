# Sparkles — Style Reference
> Ink-on-paper broadsheet guarded by crayon mascots

**Theme:** light

Sparkles runs on a near-total monochrome palette interrupted only by a single block of footer green — a deliberate, almost editorial restraint that makes the playful hand-drawn character illustrations do all the chromatic heavy lifting. Gelica (a chunky display serif) carries every headline at weight 600 with near-zero line-height, creating tight, assertive editorial moments that contrast with Articulat CF's wide-tracked sans-serif body and UI text. The interface is flat, border-driven, and uses #18181b as the universal 'ink' — for headings, nav text, icons, and the only filled button — so the eye reads the page like a printed broadsheet. Cards and inputs sit on white (#ffffff) with #e5e5e5 hairlines and 10px corners; elevation is essentially absent. The visual signature is the collision of austere typesetting with crayon-colored cartoon mascots tucked into the margins.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#0a0a0a` | `--color-ink-black` | Primary text, deepest foreground — the absolute ink for body copy and legal/footer type |
| Zinc Ink | `#18181b` | `--color-zinc-ink` | Headlines, nav text, icons, filled button background — the universal interactive ink |
| Slate 700 | `#27272a` | `--color-slate-700` | Body text emphasis, input fill backgrounds for dark/inverted inputs |
| Slate 600 | `#3f3f46` | `--color-slate-600` | Secondary body text, input borders, subtle button borders |
| Slate 500 | `#52525c` | `--color-slate-500` | Muted helper text, link text, icon details |
| Zinc 500 | `#71717b` | `--color-zinc-500` | Icon strokes (the dominant icon color), secondary UI lines |
| Zinc 300 | `#d4d4d8` | `--color-zinc-300` | Card borders when slightly more definition is needed than the default hairline |
| Zinc 200 | `#e5e5e5` | `--color-zinc-200` | Universal hairline border — by far the most-used color in the system at 360+ border applications |
| Zinc 100 | `#f4f4f5` | `--color-zinc-100` | Card surfaces, hero background tint, subtle section backgrounds |
| Paper White | `#fafafa` | `--color-paper-white` | Page-tinted background variant, near-white surfaces for cards that need separation from pure white |
| Pure White | `#ffffff` | `--color-pure-white` | Primary canvas and card surface — the page sits on white |
| Footer Green | `#54b16c` | `--color-footer-green` | Footer band background — the only chromatic UI color, a friendly grass green that punctuates the monochrome page |

## Tokens — Typography

### Gelica — Display and heading face — a custom chunky serif used exclusively for h1/h2 moments. Tight line-heights (1.0–1.11) make stacked headlines feel dense and editorial. Normal letter-spacing. · `--font-gelica`
- **Substitute:** Tiempos Headline, Source Serif Pro, Lora
- **Weights:** 600
- **Sizes:** 36px, 48px, 60px
- **Line height:** 1.00–1.11
- **Role:** Display and heading face — a custom chunky serif used exclusively for h1/h2 moments. Tight line-heights (1.0–1.11) make stacked headlines feel dense and editorial. Normal letter-spacing.

### Articulat CF — Body, UI, and small-label face. The defining quirk: 0.28em letter-spacing on this family creates the system's signature airy, architectural feel — almost certainly applied to small/uppercase labels and meta text where the wide tracking reads as deliberate typesetting rather than gap. Generous line-heights (up to 1.78) keep body copy breathing. · `--font-articulat-cf`
- **Substitute:** Inter, Geist, Söhne, General Sans
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 18px, 20px
- **Line height:** 1.33–1.78
- **Letter spacing:** 0.28em on small/label contexts; normal on body text
- **OpenType features:** `"ss01" on if available`
- **Role:** Body, UI, and small-label face. The defining quirk: 0.28em letter-spacing on this family creates the system's signature airy, architectural feel — almost certainly applied to small/uppercase labels and meta text where the wide tracking reads as deliberate typesetting rather than gap. Generous line-heights (up to 1.78) keep body copy breathing.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 3.36px | `--text-caption` |
| body-sm | 14px | 1.56 | 3.92px | `--text-body-sm` |
| body | 16px | 1.6 | 4.48px | `--text-body` |
| subheading | 18px | 1.5 | 5.04px | `--text-subheading` |
| heading-sm | 20px | 1.4 | 5.6px | `--text-heading-sm` |
| heading | 36px | 1.11 | — | `--text-heading` |
| heading-lg | 48px | 1.11 | — | `--text-heading-lg` |
| display | 60px | 1 | — | `--text-display` |

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
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| pills | 10px |
| inputs | 10px |
| buttons | 10px |
| feature-cards | 14px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24-40px
- **Element gap:** 16-24px

## Components

### Filled Ink Button
**Role:** Primary action — the system's only filled button

Background #18181b, text #ffffff, font Articulat CF 16px/500, 10px border-radius, 10px vertical / 20px horizontal padding. Carries the system's only real CTA moment ('Book a call'). No drop shadow beyond an optional 0 1px 2px rgba(0,0,0,0.05) lift.

### Ghost/Outlined Button
**Role:** Secondary action

Transparent background, 1px border in #3f3f46 or #e5e5e5, text #18181b, same 10px radius and padding as the filled variant.

### Top Navigation Bar
**Role:** Primary site navigation

White background, sits on a #e5e5e5 bottom hairline. Logo (Sparkles wordmark) left, centered nav links (Problem, Solution, Pricing, FAQ, Careers) in Articulat CF 14px/500, Filled Ink Button on the right. Vertical padding ~32px.

### Backed-by Badge
**Role:** Social-proof pill

Compact pill with light background (#fafafa or #f4f4f5), 1px #e5e5e5 border, 10px radius. Body copy in Articulat CF 12-14px with the signature 0.28em tracking on the 'Y Combinator' label. YC logo rendered inline as a small red mark.

### Hero Headline
**Role:** Page-level editorial moment

Gelica 600 at 48-60px, line-height 1.0-1.11, color #0a0a0a. Center-aligned. Sits on a white canvas. This is where the serif's weight and tight leading create the 'broadsheet' feel.

### Hero Subhead
**Role:** Qualifier line under the headline

Articulat CF 16-18px/400 in #52525c, often parenthesized, providing a soft, conversational counterpoint to the heavyweight serif above.

### Decorative Mascot Illustration
**Role:** Personality and brand warmth

Hand-drawn geometric characters (colored squares, triangles with faces) flanking the hero and sections. Bright crayon palette: coral red, sky blue, grass green, butter yellow — but these are illustration assets, NOT design-system colors. They give the austere monochrome interface its emotional counterweight.

### Section Heading
**Role:** Subsection title (e.g. 'The problem')

Gelica 600 at 36-48px, centered, color #0a0a0a. Followed by a single Articulat CF subhead in #52525c. Establishes a consistent 'serif title + sans subtitle' rhythm across sections.

### Content Card
**Role:** Grouped information block

White (#ffffff) or #fafafa background, 1px #e5e5e5 (or #d4d4d8) border, 10-14px radius, 24-40px padding. No drop shadow. Flat, outlined, almost newspaper-like.

### Text Input
**Role:** Form field

White or #27272a background, 1px border in #3f3f46 or #e5e5e5, 10px radius, Articulat CF 16px text. Focus state darkens the border toward #18181b.

### Icon
**Role:** UI iconography

Outlined 1.5-2px stroke style, stroke color #71717b (the dominant icon color) or #18181b for emphasis. Mono single-color treatment — never multicolored. Rendered sharp, not playful, so they don't compete with the mascot illustrations.

### Footer Band
**Role:** Page footer

Full-width band with the only chromatic UI color in the system: #54b16c background. Light or white text on green. A bold, warm punctuation mark at the bottom of an otherwise colorless page.

## Do's and Don'ts

### Do
- Use #18181b (Zinc Ink) as the universal 'ink' — headlines, nav text, icons, and the only filled button should all pull from this single value for visual coherence.
- Apply Articulat CF's 0.28em letter-spacing on small labels, badge copy, and uppercase meta text — this wide tracking is the system's signature rhythm.
- Reach for #e5e5e5 hairlines and 10px radii on every container; cards and inputs should feel outlined and flat, not elevated.
- Reserve Gelica 600 for true heading moments at 36px or larger with line-height ≤1.11 — the tight leading is what gives the type its editorial weight.
- Use #54b16c only in the footer band and never elsewhere; the single chromatic block amplifies the monochrome story.
- Let the mascot illustrations carry all the brand color in marketing contexts; the interface itself should remain near-achromatic.
- Build the page rhythm as serif headline + sans-serif subhead + flat outlined cards — this three-part cadence repeats across every section.

### Don't
- Don't introduce additional brand or accent colors beyond #54b16c — the 1% colorfulness ratio is a feature, not an oversight.
- Don't use drop shadows beyond the single rgba(0,0,0,0.05) 0 1px 2px instance on buttons; elevation should come from borders, not shadows.
- Don't use Gelica below 36px — the serif's personality collapses at small sizes and fights with Articulat CF.
- Don't set Articulat CF body text with the 0.28em letter-spacing — that tracking belongs to small labels and meta copy only.
- Don't use #71717b or #52525c for body headlines; reserve those for icons, helper text, and muted metadata.
- Don't round corners above 14px or below 10px on functional elements — the 10-14px range is the system's entire radius vocabulary.
- Don't use gradient fills, glow effects, or color-tinted shadows; the aesthetic is intentionally flat and print-like.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background — pure white |
| 1 | Soft Section | `#fafafa` | Subtle off-white for sections that need a whisper of separation |
| 2 | Card / Hero Tint | `#f4f4f5` | Light gray for card surfaces and the hero's tinted backdrop |
| 3 | Ink Surface | `#18181b` | Dark surface for the filled button and any inverted UI moments |
| 4 | Footer Green | `#54b16c` | Sole chromatic surface — the footer band that closes the page with warmth |

## Elevation

- **Filled Ink Button:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`

## Imagery

Illustration-driven. The page is anchored by hand-drawn, crayon-style mascot characters — geometric shapes (colored squares, triangles) given simple cartoon eyes and expressions. They flank the hero on both sides and are positioned as decorative atmosphere rather than explanatory content. The illustration palette is vivid (coral red, sky blue, grass green, butter yellow) and intentionally clashing with the monochrome UI, creating the system's signature tension: austere typography on one side, playful hand-drawn warmth on the other. Product screenshots and photography are absent from the primary screens.

## Layout

Centered, max-width ~1200px editorial layout. The hero is a centered text stack (badge → serif headline → sans subhead → filled button) flanked on both sides by large mascot illustrations that bleed to the page edges. Sections follow a consistent vertical rhythm: centered serif section heading, centered sans subhead, then either a row of outlined cards or a two-column text+visual arrangement. Section gaps are generous (64-80px) with a soft #f4f4f5 or #fafafa band tinting alternating sections. Navigation is a simple top bar with centered links, a wordmark on the left, and a single filled CTA on the right. The page is overwhelmingly text-dominant, with the colorful illustrations acting as decorative bookends rather than informational imagery.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0a0a (primary), #52525c (secondary), #71717b (muted/icon)
- background: #ffffff (canvas), #fafafa (soft), #f4f4f5 (card tint), #54b16c (footer only)
- border: #e5e5e5 (hairline), #d4d4d8 (card definition), #3f3f46 (input)
- accent: #54b16c (footer band only — not an interactive accent)
- filled button / primary action: #18181b (filled action)

**Example Component Prompts**

1. *Centered editorial hero*: white (#ffffff) canvas. Serif headline Gelica 600 at 56px, line-height 1.0, color #0a0a0a. Subhead Articulat CF 18px/400 in #52525c, centered. Filled button below: #18181b background, #ffffff text, Articulat CF 16px/500, 10px radius, 10px 20px padding. Optional hand-drawn mascot illustration in coral, sky blue, and butter yellow flanking the text stack.

2. *Outlined content card*: white (#ffffff) background, 1px border in #e5e5e5, 14px radius, 32px padding. Heading in Gelica 600 at 24px in #0a0a0a. Body in Articulat CF 16px/400 in #52525c. No drop shadow.

3. *Top navigation bar*: white background, 1px #e5e5e5 bottom border, 32px vertical padding. Wordmark on left in Gelica 600 20px #0a0a0a. Centered nav links in Articulat CF 14px/500 #18181b with 32px gap. Filled button on right: #18181b background, #ffffff text, 10px radius.

4. *Backed-by badge pill*: #fafafa background, 1px #e5e5e5 border, 10px radius, 8px 16px padding. Label in Articulat CF 12px/500 in #52525c. Partner name in Articulat CF 12px/600 in #0a0a0a with the signature 0.28em letter-spacing.

5. *Footer band*: full-width #54b16c background, white (#ffffff) text in Articulat CF 16px/400. Centered, 80px vertical padding. The sole chromatic UI moment on the page.

## Similar Brands

- **Mercury** — Same editorial broadsheet feel — serif display headlines (Gelica ↔ Tiempos) over monochrome body, single accent color, flat outlined components
- **Linear** — Dark-to-light monochrome product surface with tight custom sans-serif and near-zero decorative chrome, though Linear skews darker
- **Arc Browser** — Hand-drawn illustration characters providing warmth against a clean, minimal monochrome interface — the same austerity-meets-playful tension
- **Notion** — Generous spacing, hairline borders, serif-on-sans heading rhythm, and hand-drawn illustration as personality counterweight
- **Y Combinator** — Restrained, almost brutalist monochrome layout with bright mascot-style illustration accents and minimal UI ornamentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #0a0a0a;
  --color-zinc-ink: #18181b;
  --color-slate-700: #27272a;
  --color-slate-600: #3f3f46;
  --color-slate-500: #52525c;
  --color-zinc-500: #71717b;
  --color-zinc-300: #d4d4d8;
  --color-zinc-200: #e5e5e5;
  --color-zinc-100: #f4f4f5;
  --color-paper-white: #fafafa;
  --color-pure-white: #ffffff;
  --color-footer-green: #54b16c;

  /* Typography — Font Families */
  --font-gelica: 'Gelica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-articulat-cf: 'Articulat CF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 3.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: 3.92px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 4.48px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 5.04px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 5.6px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --text-display: 60px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-112: 112px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24-40px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 14px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-pills: 10px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;
  --radius-feature-cards: 14px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-soft-section: #fafafa;
  --surface-card-hero-tint: #f4f4f5;
  --surface-ink-surface: #18181b;
  --surface-footer-green: #54b16c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #0a0a0a;
  --color-zinc-ink: #18181b;
  --color-slate-700: #27272a;
  --color-slate-600: #3f3f46;
  --color-slate-500: #52525c;
  --color-zinc-500: #71717b;
  --color-zinc-300: #d4d4d8;
  --color-zinc-200: #e5e5e5;
  --color-zinc-100: #f4f4f5;
  --color-paper-white: #fafafa;
  --color-pure-white: #ffffff;
  --color-footer-green: #54b16c;

  /* Typography */
  --font-gelica: 'Gelica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-articulat-cf: 'Articulat CF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 3.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: 3.92px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 4.48px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: 5.04px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 5.6px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --text-display: 60px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-112: 112px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 14px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
```
