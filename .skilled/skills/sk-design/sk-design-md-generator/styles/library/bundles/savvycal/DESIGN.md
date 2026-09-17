# Savvycal — Style Reference
> forest-green stage with cream paper pages, serif headlines and lime-green punctuation

**Theme:** mixed

SavvyCal runs on a two-zone editorial system: a forest-green hero stage and a warm cream-paper body. The personality is magazine-meets-product: a condensed display serif (GT Alpina) headlines with editorial weight, while a grotesk workhorse (GT America) carries body and UI. A single lime-sprout green punctuates every interactive moment, and a coral red lives only as decorative punctuation — wavy underlines, hand-drawn doodles, thin frame borders. The aesthetic borrows from print: warm neutrals, serif voice, generous whitespace, and handcrafted accents that soften the scheduling-tool utility. Screens should alternate between the dark stage (used sparingly for hero, feature spotlights) and the cream canvas (the default for features, pricing, content), never blending the two in one view. Surfaces stay matte and flat — no glassmorphism, no heavy elevation. Color appears as small functional dots, not washes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Stage | `#0d542b` | `--color-forest-stage` | Hero section background, dark feature spotlights — deep green anchors the dramatic first impression |
| Lime Sprout | `#b9ff78` | `--color-lime-sprout` | Green supporting accent for decorative details and low-frequency emphasis |
| Ember Coral | `#f54320` | `--color-ember-coral` | Decorative stroke accent — wavy underlines, hand-drawn doodles, product frame borders, section dividers |
| Coral Whisper | `#ffe3e3` | `--color-coral-whisper` | Soft warm surface wash, hero gradient highlight, gentle background tints behind editorial sections |
| Cream Paper | `#fcf7ed` | `--color-cream-paper` | Primary content surface, page background for feature/pricing/footer sections — the default canvas |
| True Black | `#000000` | `--color-true-black` | Headlines, primary body text, dark icons, logo mark on light surfaces |
| Midnight Ink | `#1c1917` | `--color-midnight-ink` | Dark surface (footer dark mode, inverse cards), button text on light fills, heading accent |
| Stone | `#44403b` | `--color-stone` | Body paragraph text on cream surfaces, secondary headings, footer description copy |
| Slate | `#292524` | `--color-slate` | Strong secondary text, nav links on cream, meta labels |
| Ash | `#d6d3d1` | `--color-ash` | Muted helper text, subtle borders on cream, disabled states, tag outlines |
| Fog | `#e5e7eb` | `--color-fog` | Hairline dividers, form field borders, table separators — the structural neutral |
| Pure White | `#ffffff` | `--color-pure-white` | Card surface lift on cream, button text on dark fills, input field backgrounds |
| Moss | `#008236` | `--color-moss` | Logo green, icon strokes, secondary brand accent — the mid-green companion to the forest stage |

## Tokens — Typography

### GT Alpina Condensed — Display headlines — the editorial voice. Used at hero scale (96-136px) for the dramatic serif moments that anchor each section. Condensed cuts and tight line-heights give it poster-like authority. Substitute: 'Playfair Display' or 'Bodoni Moda' condensed at matching weight · `--font-gt-alpina-condensed`
- **Substitute:** Playfair Display
- **Weights:** 700
- **Sizes:** 96px, 136px
- **Line height:** 1.00-1.08
- **Letter spacing:** 0 (natural)
- **OpenType features:** `"cv11"`
- **Role:** Display headlines — the editorial voice. Used at hero scale (96-136px) for the dramatic serif moments that anchor each section. Condensed cuts and tight line-heights give it poster-like authority. Substitute: 'Playfair Display' or 'Bodoni Moda' condensed at matching weight

### GT America Standard — Body text, subheadings, medium-weight headings. The workhorse grotesk for long-form paragraphs and section sub-headlines. Slight -0.007em tightening gives it a composed, not loose, feel. Substitute: 'Inter' or 'Söhne' · `--font-gt-america-standard`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 16px, 18px, 20px, 24px, 30px
- **Line height:** 1.33-1.56
- **Letter spacing:** -0.007em
- **OpenType features:** `"cv11"`
- **Role:** Body text, subheadings, medium-weight headings. The workhorse grotesk for long-form paragraphs and section sub-headlines. Slight -0.007em tightening gives it a composed, not loose, feel. Substitute: 'Inter' or 'Söhne'

### GT America Extended — UI chrome: button labels, navigation links, footer column headers, small labels. Wider proportions at small sizes improve readability in compact UI. Substitute: 'Inter' at letter-spacing 0.02em · `--font-gt-america-extended`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 10px, 14px, 16px, 18px, 24px
- **Line height:** 1.00-1.56
- **Letter spacing:** 0 (natural for UI)
- **OpenType features:** `"cv11"`
- **Role:** UI chrome: button labels, navigation links, footer column headers, small labels. Wider proportions at small sizes improve readability in compact UI. Substitute: 'Inter' at letter-spacing 0.02em

### GT America Condensed — Section eyebrows and secondary display — the 'SCHEDULING EXPERIENCE' style small-caps labels with wide tracking (+0.05em at 18px), and tighter condensed headlines at 38px (-0.025em). Substitute: 'Inter' condensed variant or 'Barlow Condensed' · `--font-gt-america-condensed`
- **Substitute:** Barlow Condensed
- **Weights:** 400
- **Sizes:** 18px, 38px
- **Line height:** 1.38-1.56
- **Letter spacing:** +0.05em at 18px (uppercase tracking), -0.025em at 38px
- **OpenType features:** `"cv11"`
- **Role:** Section eyebrows and secondary display — the 'SCHEDULING EXPERIENCE' style small-caps labels with wide tracking (+0.05em at 18px), and tighter condensed headlines at 38px (-0.025em). Substitute: 'Inter' condensed variant or 'Barlow Condensed'

### InterVariable — Fallback/utility text — appears in footer fine print and secondary system text. The site is GT-America-first; Inter fills the generic-system gaps · `--font-intervariable`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **Letter spacing:** normal
- **OpenType features:** `"cv11"`
- **Role:** Fallback/utility text — appears in footer fine print and secondary system text. The site is GT-America-first; Inter fills the generic-system gaps

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.007px | `--text-body` |
| subheading | 20px | 1.5 | -0.14px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.17px | `--text-heading-sm` |
| heading | 30px | 1.38 | -0.21px | `--text-heading` |
| heading-lg | 38px | 1.38 | -0.95px | `--text-heading-lg` |
| display | 96px | 1.08 | — | `--text-display` |

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
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 9999px |
| buttons | 8px |
| productFrames | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Lime Primary Button
**Role:** Main call-to-action across hero and feature sections

Fill: #b9ff78 (Lime Sprout). Text: #1c1917 (Midnight Ink), GT America Extended 400, 16px. Padding: 12px 24px. Border-radius: 8px. No shadow. Box-shadow optional: 0 0 0 4px rgba(185,255,120,0.25) for halo emphasis. Hover: slight scale or brightness shift, not color change.

### Outline Ghost Button
**Role:** Secondary action beside primary CTAs

Fill: transparent. Border: 1.5px solid #1c1917. Text: #1c1917, GT America Extended 400, 16px. Padding: 12px 24px. Border-radius: 8px. Hover: fill #1c1917, text #fcf7ed.

### Top Nav Pill Tab
**Role:** Product switcher in the top center nav (Meetings / Appointments)

Pill radius 9999px. Active tab: fill #b9ff78, text #1c1917, padding 4px 12px. Inactive tab: text #000000, no fill. Inactive sits on dark bar (#0d542b) so text is white/light. Font: GT America Extended 400, 14px.

### Sign Up Nav Button
**Role:** Rightmost nav action

Fill: transparent. Border: 1.5px solid white (on dark nav bar). Text: white, GT America Extended 400, 16px. Padding: 8px 20px. Border-radius: 8px. On light sections: border and text switch to #1c1917.

### Section Eyebrow Label
**Role:** Small-caps category marker above section headlines

Text: GT America Condensed 400, 18px, uppercase, letter-spacing +0.05em, color #1c1917 or #44403b. Followed by a wavy/squiggly coral underline (#f54320) — a hand-drawn 2-3px stroke beneath the text, ~60% of the text width.

### Editorial Display Headline
**Role:** Section-level dramatic headline on cream surfaces

GT Alpina Condensed 700, 96px, line-height 1.08, color #000000. Centered or left-aligned. No decorative elements around it — the typeface IS the decoration. At 136px in hero contexts.

### Hero Subhead (Lime)
**Role:** Secondary headline inside the dark forest hero

GT Alpina Condensed 700 at 96px or GT America Standard 700 at 48-56px, color #b9ff78 (Lime Sprout). Sits below the main display headline when the hero stacks two headline tiers. The lime color on dark green is the brand's most recognizable combo.

### Product Screenshot Frame
**Role:** Container for app/product imagery in feature sections

Border: 2px solid #f54320 (Ember Coral). Border-radius: 24px. Background: the product UI inside. Optional drop shadow: 0 24px 48px rgba(245,67,32,0.15) — a warm coral-tinted shadow that feels on-brand rather than neutral. Padding: 0 (image fills the frame edge-to-edge inside the border).

### Feature Section Card
**Role:** Content card on cream surfaces

Background: #ffffff. Border: 1px solid #e5e7eb (Fog). Border-radius: 8px. Padding: 24px. No shadow by default; optional 0 4px 12px rgba(0,0,0,0.04) for hover lift. Typography: GT America Standard 400 for body, 700 for card titles.

### Pricing Tier Card
**Role:** Plan option in pricing comparison

Background: #ffffff. Border: 1px solid #e5e7eb. Border-radius: 8px. Padding: 32px. Highlighted/recommended tier: border 2px solid #1c1917 with a small 'Most popular' badge (#b9ff78 fill, #1c1917 text, GT America Extended 400 12px uppercase, 9999px radius, 4px 12px padding).

### Footer Column
**Role:** Multi-column link lists in the site footer

Background: continues the cream #fcf7ed. Column header: GT America Extended 700, 14px, #1c1917, uppercase, letter-spacing 0.02em, margin-bottom 16px. Links: GT America Standard 400, 16px, #44403b (Stone), line-height 1.56. Links have no underline; hover changes to #000000.

### Hero Background Spiral
**Role:** Decorative dark-hero background pattern

Radial gradient from #0d542b (center, darker) to #008236 (edges, lighter) overlaid with a subtle concentric circle/arc pattern in rgba(13,84,43,0.3) to #008236. Creates a sense of depth and focus toward center. No animation needed.

### Hand-Drawn Doodle Accent
**Role:** Decorative illustrations sprinkled in margins and footer

Single-color line art in #f54320 (Ember Coral), 2-3px stroke weight, no fill. Suggests arrows, squiggles, calendar shapes, spirals. Positioned at section boundaries and footer to soften the layout and add editorial playfulness.

## Do's and Don'ts

### Do
- Pair the two type families deliberately: GT Alpina Condensed for display, GT America family for everything else. Never let them compete at the same size tier.
- Use Lime Sprout (#b9ff78) as the only interactive fill color. Reserve #f54320 (Ember Coral) for decorative stroke-only work — underlines, doodles, frame borders — never as a button fill.
- Maintain the two-zone rhythm: dark green stage for hero/spotlight, Cream Paper (#fcf7ed) for all content sections. Never blend the two in a single screen.
- Set section eyebrows at 18px with +0.05em tracking and a wavy coral underline beneath — this micro-pattern signals the editorial voice.
- Use 8px radius for all functional components (buttons, cards, inputs) and 24px radius only for product imagery frames. Pills get 9999px.
- Hold the page to 1200px max-width with 64px section gaps and 24px card padding. The 8px base unit should govern all internal spacing (8, 16, 24, 32, 40, 48, 64).
- Apply font-feature-settings: 'cv11' globally to GT America and GT Alpina — it changes character variants that define the brand's typographic texture.

### Don't
- Don't use #f54320 (Ember Coral) as a button background or large surface fill — it is stroke/decoration only. A filled coral CTA would break the lime-equals-action contract.
- Don't apply heavy drop shadows. Surfaces should feel matte and flat. The only shadow allowed is the warm coral-tinted shadow on product frames (rgba(245,67,32,0.15)).
- Don't introduce a new color zone. The system is forest green + cream paper + lime accent + coral decoration. No grays, no blues, no purples.
- Don't set body text in GT Alpina — the condensed serif is for display only. Long paragraphs in Alpina would be unreadable.
- Don't center-align body paragraphs. Headlines can center, but body text should be left-aligned with a max measure of ~65-75 characters.
- Don't use pure black (#000000) on the cream background for body text — it creates excessive contrast fatigue. Use Stone (#44403b) for body, reserve True Black for headlines.
- Don't skip the wavy coral underline beneath section eyebrows. Without it, the eyebrow label loses its editorial signature and reads as generic uppercase text.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Forest Stage | `#0d542b` | Hero section background — the dark dramatic opening zone |
| 1 | Cream Paper | `#fcf7ed` | Primary content surface for features, pricing, footer — the default canvas |
| 2 | Pure White Card | `#ffffff` | Elevated card surface on cream — subtle lift for pricing, feature cards |
| 3 | Coral Whisper | `#ffe3e3` | Soft warm highlight wash behind editorial moments, gradient highlight in hero |

## Elevation

- **Product Screenshot Frame:** `0 24px 48px rgba(245, 67, 32, 0.15)`
- **Feature Card (hover state):** `0 4px 12px rgba(0, 0, 0, 0.04)`
- **Primary CTA (optional halo):** `0 0 0 4px rgba(185, 255, 120, 0.25)`

## Imagery

Imagery is minimal and product-focused. The only photographic content is product screenshots of the SavvyCal scheduling UI, presented inside a 2px coral-bordered frame with a warm coral-tinted shadow. No lifestyle photography, no stock imagery, no people shots. Decorative visuals are hand-drawn line doodles in coral red — squiggles, arrows, calendar marks, spirals — that appear at section boundaries and in the footer to add editorial playfulness. The hero background is a radial gradient green with subtle concentric arc patterns (no people, no product). The visual language says: this is a tool, and the tool itself is the visual content. Iconography is single-weight line art in #1c1917 on light surfaces, single-weight in white or #b9ff78 on the dark hero.

## Layout

The page follows a strict two-zone alternation. The hero opens as a full-bleed dark green band (Forest Stage) with centered headline + subhead + single CTA. Below the fold, the layout switches to Cream Paper with 1200px max-width centered content, 64px section gaps. Feature sections follow a consistent pattern: centered section eyebrow (small-caps + wavy underline) → large editorial headline (96px serif) → 2-3 sentence body paragraph → product screenshot in a coral frame. Sections do not alternate left/right image placement — everything centers for an editorial magazine feel. Footer is a 4-column link grid on the same cream surface, with hand-drawn coral doodles bleeding into the bottom margin. Navigation is a single horizontal bar at the top: logo left, product switcher (Meetings/Appointments) center as pills, Login + Sign Up right. The hero is the only full-bleed moment; everything else stays in the 1200px container.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (headlines) / #44403b (body on cream)
- background: #fcf7ed (content) / #0d542b (hero)
- border: #e5e7eb (hairline) / #f54320 (decorative accent)
- accent: #b9ff78 (lime, interactive highlights)
- primary action: no distinct CTA color

**Example Component Prompts:**

1. Create a hero section: background #0d542b with a radial gradient toward #008236 at edges. Headline at 96px GT Alpina Condensed 700, color #b9ff78, centered. Subtext at 18px GT America Standard 400, color #fcf7ed, max-width 600px centered. Lime-filled action button (#b9ff78 fill, #1c1917 text, 8px radius, 12px 24px padding, GT America Extended 400 16px).

2. Create a feature section: background #fcf7ed. Eyebrow label at 18px GT America Condensed 400, uppercase, letter-spacing +0.05em, color #1c1917, with a 2px wavy coral (#f54320) underline beneath. Headline at 96px GT Alpina Condensed 700, color #000000, centered. Body at 20px GT America Standard 400, color #44403b, max-width 640px centered. Product screenshot below in a 2px solid #f54320 frame with 24px radius.

3. Create a pricing card: background #ffffff, border 1px solid #e5e7eb, 8px radius, 32px padding. Plan name at 24px GT America Standard 700, color #1c1917. Price at 38px GT America Condensed 400, color #000000, letter-spacing -0.025em. Feature list at 16px GT America Standard 400, color #44403b, 16px line-height between items. Action button: outline style, 1.5px solid #1c1917 border, 8px radius, 12px 24px padding.

4. Create a footer column: column header at 14px GT America Extended 700, color #1c1917, uppercase, letter-spacing 0.02em, margin-bottom 16px. Links at 16px GT America Standard 400, color #44403b, line-height 1.56, no underline. Background continues from cream #fcf7ed.

5. Create a product screenshot frame: 2px solid #f54320 border, 24px border-radius, containing a product UI screenshot edge-to-edge. Box-shadow: 0 24px 48px rgba(245, 67, 32, 0.15) for warm coral lift.

## Typography Personality

The defining typographic move is the contrast between GT Alpina Condensed (a refined editorial serif) and the GT America family (a clean grotesk system). The serif headlines give the product a magazine-cover confidence that most SaaS sites lack. Display sizes push to 96-136px with near-1.0 line-height, creating poster-like vertical stacking. The grotesk handles everything functional at 14-24px with tight -0.007em tracking. The 'cv11' font feature is enabled globally — it activates alternate character forms that give GT America its slightly more crafted, less generic feel compared to Inter or Helvetica.

## Color Zone Rules

The site operates on two color zones that must not bleed: ZONE A (Forest Stage) uses #0d542b background with #b9ff78 and #fcf7ed as text. ZONE B (Cream Paper) uses #fcf7ed background with #000000, #44403b, and #1c1917 as text, plus #b9ff78 for interactive elements. #f54320 (Ember Coral) crosses both zones but always as stroke/decoration only — it is the thread that connects dark hero to light content through squiggles, underlines, and frame borders. Never use #f54320 as a fill, never use #b9ff78 on cream as a large surface (it should be a button-sized dot of color).

## Similar Brands

- **Linear** — Same dual-mode color zone approach (dark hero, light content) with tight grotesk typography, though Linear uses Inter and a purple accent where SavvyCal uses GT America and lime
- **Pitch** — Editorial-magazine layout with serif display headlines and clean sans body text on warm paper-toned surfaces; similar hand-drawn decorative accents feel
- **Notion** — Comfortable density, warm off-white canvas, minimal shadows, single accent color for interactive elements
- **ConvertKit** — Playful-but-editorial personality with decorative hand-drawn elements, warm cream surfaces, and a single vivid accent color (though ConvertKit uses purple)
- **Arc Browser** — Confident use of a single vivid color as functional punctuation against warm neutrals, with a typographic personality that mixes refined and casual

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-stage: #0d542b;
  --color-lime-sprout: #b9ff78;
  --color-ember-coral: #f54320;
  --color-coral-whisper: #ffe3e3;
  --color-cream-paper: #fcf7ed;
  --color-true-black: #000000;
  --color-midnight-ink: #1c1917;
  --color-stone: #44403b;
  --color-slate: #292524;
  --color-ash: #d6d3d1;
  --color-fog: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-moss: #008236;

  /* Typography — Font Families */
  --font-gt-alpina-condensed: 'GT Alpina Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-standard: 'GT America Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-extended: 'GT America Extended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-condensed: 'GT America Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.007px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.14px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.17px;
  --text-heading: 30px;
  --leading-heading: 1.38;
  --tracking-heading: -0.21px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.38;
  --tracking-heading-lg: -0.95px;
  --text-display: 96px;
  --leading-display: 1.08;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-buttons: 8px;
  --radius-productframes: 24px;

  /* Surfaces */
  --surface-forest-stage: #0d542b;
  --surface-cream-paper: #fcf7ed;
  --surface-pure-white-card: #ffffff;
  --surface-coral-whisper: #ffe3e3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-stage: #0d542b;
  --color-lime-sprout: #b9ff78;
  --color-ember-coral: #f54320;
  --color-coral-whisper: #ffe3e3;
  --color-cream-paper: #fcf7ed;
  --color-true-black: #000000;
  --color-midnight-ink: #1c1917;
  --color-stone: #44403b;
  --color-slate: #292524;
  --color-ash: #d6d3d1;
  --color-fog: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-moss: #008236;

  /* Typography */
  --font-gt-alpina-condensed: 'GT Alpina Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-standard: 'GT America Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-extended: 'GT America Extended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-condensed: 'GT America Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.007px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.14px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.17px;
  --text-heading: 30px;
  --leading-heading: 1.38;
  --tracking-heading: -0.21px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.38;
  --tracking-heading-lg: -0.95px;
  --text-display: 96px;
  --leading-display: 1.08;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-3xl: 24px;
}
```
