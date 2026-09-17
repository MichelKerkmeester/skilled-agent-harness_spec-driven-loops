# Wellfound — Style Reference
> constellation of opportunity tags on editorial white

**Theme:** light

Wellfound speaks in the language of opportunity constellations: a crisp white editorial canvas where job-title pills float freely like sticky notes on a research wall. The brand is almost achromatic at its core — near-black ink text, generous white space, and whisper-thin borders — but punctuates this restraint with two signature chromatic notes: a signal-red used as accent punctuation (the colon in the wordmark, dot ornaments, border highlights) and a deep aubergine that turns the stats band into a velvet curtain of dark authority. Type is the workhorse: Graphik at every weight and size, with aggressive negative tracking on display sizes that pulls headlines into tight, confident shapes. Components stay flat and honest — pill-shaped tags, 12px-radius buttons, hairline borders, a single soft shadow reserved for elevation moments. The mood is 'startup-editorial': more The Information than SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Wellfound Ink | `#051316` | `--color-wellfound-ink` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Paper White | `#ffffff` | `--color-paper-white` | Canvas, card surface, button fill, nav surface — the dominant background across nearly every screen |
| Blush Mist | `#fff4f6` | `--color-blush-mist` | Soft warm card surface for feature blocks, gentle wash on two-column benefit sections |
| Ash Gray | `#d8d8d8` | `--color-ash-gray` | Ghost-button borders, hairline dividers, muted tag outlines — present without demanding attention |
| Charcoal | `#333333` | `--color-charcoal` | Secondary text on images, subdued link color — slightly lighter than Ink for hierarchy |
| Slate Depth | `#222222` | `--color-slate-depth` | Nav text in dark sections, alternative ink tone for darker surface contexts |
| Signal Red | `#ec2e3a` | `--color-signal-red` | Brand accent — the colon in the wordmark, dot ornaments beside display headlines, card highlight borders, feature icon strokes. Carries the entire chromatic identity of the system |
| Aubergine Depth | `#210d25` | `--color-aubergine-depth` | Dark hero/stat-band background, inverse-mode surface — turns the stats counter into a velvet authority moment against the otherwise light page |
| Plum Shadow | `#541142` | `--color-plum-shadow` | Deeper purple link background, secondary dark accent for hover or emphasis on the aubergine family |
| Ember Red | `#e32e19` | `--color-ember-red` | Warmer secondary red for text and border accents where Signal Red reads too cool |

## Tokens — Typography

### Graphik — Primary workhorse — used for everything from 14px nav links to 100px hero stats. Weight 400 for body and tags, 500 for buttons and medium emphasis, 600 for headlines and display. Negative letter-spacing (-0.013em to -0.020em) tightens display sizes into compact, confident shapes that read more like editorial typography than UI text. The very tight leading on 72px+ (0.82–1.0) is signature — display numbers feel sculpted rather than typeset. · `--font-graphik`
- **Substitute:** Inter, Manrope, or Plus Jakarta Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 17, 21, 22, 24, 30, 40, 72, 100
- **Line height:** 1.13–1.50 (body), 0.82–1.00 (display, tight leading)
- **Letter spacing:** -0.0200em at display (72–100px), -0.0160em at heading (30–40px), -0.0130em at subheading (21–24px), normal at body
- **Role:** Primary workhorse — used for everything from 14px nav links to 100px hero stats. Weight 400 for body and tags, 500 for buttons and medium emphasis, 600 for headlines and display. Negative letter-spacing (-0.013em to -0.020em) tightens display sizes into compact, confident shapes that read more like editorial typography than UI text. The very tight leading on 72px+ (0.82–1.0) is signature — display numbers feel sculpted rather than typeset.

### Aeonik Fono — Secondary typeface used sparingly for small-caps-style labels and select 40px display moments. Brings a slightly geometric counter-form to Graphik's humanist shapes, creating contrast when both fonts appear on the same surface. · `--font-aeonik-fono`
- **Substitute:** Space Grotesk or General Sans
- **Weights:** 400, 700
- **Sizes:** 14, 40
- **Line height:** 1.40
- **Role:** Secondary typeface used sparingly for small-caps-style labels and select 40px display moments. Brings a slightly geometric counter-form to Graphik's humanist shapes, creating contrast when both fonts appear on the same surface.

### Aeonikfono — Aeonikfono — detected in extracted data but not described by AI · `--font-aeonikfono`
- **Weights:** 400, 700
- **Sizes:** 40px
- **Line height:** 1.3
- **Letter spacing:** -0.02
- **Role:** Aeonikfono — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| subheading | 21px | 1.36 | -0.27px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.31px | `--text-heading-sm` |
| heading | 30px | 1.27 | -0.48px | `--text-heading` |
| heading-lg | 40px | 1.14 | -0.64px | `--text-heading-lg` |
| display | 72px | 1 | -1.44px | `--text-display` |
| display-xl | 100px | 0.82 | -2px | `--text-display-xl` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 1000px |
| cards | 16px |
| inputs | 12px |
| buttons | 12px |
| largeBlocks | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.06) 0px 9px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20-24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** High-emphasis action (Sign Up, Find your next hire)

Background #051316 (Wellfound Ink), text #ffffff, Graphik 500 at 14–16px, 12px border-radius, 12px 20px padding. No border. Optional subtle shadow rgba(0,0,0,0.06) 0px 9px 20px 0px. Tight, dark, confident — the button reads as 'switched on' against the white canvas.

### Ghost Outlined Button
**Role:** Secondary action (Log In, Learn more)

Background #ffffff, 1px border #d8d8d8 (Ash Gray), text #051316, 12px radius, 12px 20px padding. No fill, no shadow. Sits quietly next to the primary button without competing.

### Pill Tag / Opportunity Chip
**Role:** Skill, role, or location label in the hero constellation and filter bars

Background #ffffff, 1px border #d8d8d8 or rgba(0,0,0,0.1), text #051316 at 14px Graphik 400, 1000px (pill) border-radius, 8px 14px padding. The hero deploys dozens of these at varying opacity to create a cloud of floating opportunities. No shadow on tags.

### Hero Display Headline
**Role:** Primary page-level headline

Graphik 600 at 72–100px, color #051316, line-height 0.82–1.0, letter-spacing -0.020em. Often paired with Signal Red (#ec2e3a) dot/colon ornaments (e.g., 'W:' prefix) as a brand signature. Tight tracking and tight leading make the headline feel sculpted.

### Stats Band Block
**Role:** Dark authority section with large numeric counters

Full-width background #210d25 (Aubergine Depth), padding 80–96px vertical. Three or four columns, each with a 72–100px Graphik 600 number in #ffffff, plus a 14–16px Graphik 400 caption in #ffffff below. Numbers use the same tight tracking as display headlines. Hairline #ffffff-at-20% divider separates from the logo strip below.

### Feature Row Item
**Role:** Icon + heading + description in the two-column benefit section

36–40px icon in #ec2e3a (Signal Red) stroke or fill on the left, body text block on the right: 16–18px Graphik 500 heading in #051316, 14–16px Graphik 400 body in #333333 or #051316. Gap of 16–24px between icon and text. Vertically stacked with 24–32px gap between rows.

### Two-Column Benefit Panel
**Role:** 'Why job seekers love us' / 'Why recruiters love us' mirrored sections

Background #fff4f6 (Blush Mist) or #ffffff, 48–64px padding, two equal columns separated by 48–80px gap. Each column has a small caps-style eyebrow label, a 30–40px Graphik 600 heading, and 4 feature rows with icon + text.

### Company Logo Strip
**Role:** Social proof band below the stats

Grayscale company logos on Aubergine Depth (#210d25) background, evenly distributed in a single row, ~48px height, 10–15% opacity white. No captions — the logos speak.

### Navigation Bar
**Role:** Top-level site navigation

Background #ffffff, 64–72px height, wordmark left ('wellfound:' with red colon in #ec2e3a), nav links center at 14px Graphik 500 in #051316, auth actions right (ghost Log In + filled Sign Up). 1px bottom border #d8d8d8 or invisible.

### Dark CTA Card
**Role:** Bottom-of-page conversion panel

Background #210d25 (Aubergine Depth), 16–40px border-radius, generous padding (48–64px), 30–40px Graphik 600 white headline. Optional Signal Red accent on key word. Button inside uses white-fill variant on the dark surface.

### Icon Set
**Role:** Feature and nav icons

1.5–2px stroke weight, line-style icons, monochrome in Signal Red (#ec2e3a) for feature contexts, Wellfound Ink (#051316) for nav and utility. 24–36px sizing. Rounded line caps, geometric construction.

## Do's and Don'ts

### Do
- Use Graphik (or Inter/Manrope) at every text level with the negative letter-spacing scale: -0.020em at 72px+, -0.016em at 30–40px, -0.013em at 21–24px, normal at 16px and below
- Reserve Signal Red (#ec2e3a) for accent punctuation only — the colon in the wordmark, dot ornaments beside display headlines, card highlight borders, and icon strokes. Never use it for large filled areas or body text
- Apply the Aubergine Depth (#210d25) surface as a full-bleed band, not as a card — it works as a horizontal authority stripe, not a contained element
- Use 12px border-radius for all buttons and inputs, 16px for cards, and 1000px (pill) for all tags and chips — do not mix these radii across component types
- Set display headline (72–100px) line-height to 0.82–1.0 and body (14–17px) line-height to 1.4–1.5 — the extreme contrast between tight display and airy body is a signature
- Float pill-tags in white space at varying opacity (40–100%) to create constellation effects — never align them to a strict grid in hero contexts
- Pair the primary filled button (Ink #051316) with the ghost outlined button (#ffffff fill, #d8d8d8 border) in any action cluster — never show two filled buttons side by side

### Don't
- Do not use Signal Red for body text, large backgrounds, or button fills — it is a punctuation color, not a surface color
- Do not introduce gradients, glassmorphism, or heavy drop shadows — the system is flat and editorial by design
- Do not use border-radius values outside the established system: 0, 12px, 16px, 40px, or 1000px (pill). No 8px, no 24px, no random rounding
- Do not center body text — left-align all paragraph and feature-row text, reserving center-align for headlines and stat numbers only
- Do not place more than one Aubergine Depth band per page section — the dark surface is powerful and loses impact if repeated
- Do not use the Blush Mist (#fff4f6) as a full-page background — it is a soft card/panel surface, not a canvas replacement
- Do not add decorative dividers, ornamental graphics, or background patterns — white space and typography carry the visual weight

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base canvas — nav, page body, most card surfaces |
| 1 | Blush Mist | `#fff4f6` | Warm secondary surface for two-column benefit sections, soft card washes |
| 2 | Aubergine Depth | `#210d25` | Dark inverse surface for stats band, CTA banners, authority moments |

## Elevation

- **Primary Button:** `rgba(0, 0, 0, 0.06) 0px 9px 20px 0px`

## Imagery

The site is overwhelmingly text-and-tag-driven with no hero photography. The visual language is built from typographic constellation: dozens of white pill-tags (job titles, locations, skills) floating in white space at varying opacity, creating a 'cloud of opportunities' metaphor. The only photographic content is grayscale company logos in the social-proof band, rendered at low opacity on the dark aubergine surface. Icons are line-style, monochromatic red or ink, geometric. No illustration, no 3D, no product screenshots on the homepage. The aesthetic is closer to a print magazine spread than a SaaS dashboard.

## Layout

Page is max-width ~1200px centered with generous outer gutters. The hero is a full-width white canvas with a massive centered headline ('W: Find what's next') surrounded by a scattered constellation of 20+ pill-tags at varying vertical positions, creating an organic, non-grid layout. Below the hero, a full-bleed dark aubergine stats band (3-column counter layout) spans edge-to-edge. Then a logo strip on the same dark band. Next, a two-column benefit section (job seekers | recruiters) on a blush-mist or white surface, with 4 feature rows per column. The page ends with a dark CTA card. Navigation is a clean top bar — wordmark left, links center, auth right. No sidebar, no sticky behavior beyond the header. The rhythm alternates: white → dark → white → dark, with each band using generous 64–96px vertical padding for breathing room.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas/surface: #ffffff
- Primary text/borders: #051316
- Brand accent: #ec2e3a (Signal Red)
- Dark surface: #210d25 (Aubergine Depth)
- Soft panel surface: #fff4f6 (Blush Mist)
- primary action: #051316 (filled action)
- Hairline border: #d8d8d8

**Example Component Prompts**
1. **Hero Constellation Section**: White (#ffffff) canvas, max-width 1200px. Headline 'W: Find what's next' at 100px Graphik 600, #051316, letter-spacing -2.0px, line-height 0.82. The 'W:' prefix has two #ec2e3a (Signal Red) dots beside it as ornament. Surround the headline with 20+ floating pill-tags (background #ffffff, 1px border rgba(0,0,0,0.08), 14px Graphik 400 in #051316, 1000px radius, 8px 14px padding) at varying opacity and scattered positions.

2. **Stats Band**: Full-bleed background #210d25 (Aubergine Depth), 96px vertical padding. Three columns evenly spaced. Each column: 100px Graphik 600 number in #ffffff (line-height 0.82, letter-spacing -2.0px) with a 16px Graphik 400 white caption below. Optional 1px white-at-20% divider line above the logo strip.

3. **Two-Column Benefit Panel**: Background #fff4f6 (Blush Mist), 64px padding. Two equal columns with 48px gap. Each column: 14px Aeonik Fono 400 eyebrow label in #051316, 40px Graphik 600 heading, then 4 feature rows (36px Signal Red icon left, 16px heading + 14px body right, 24px row gap).

4. **Primary Filled Button**: Background #051316, text #ffffff, Graphik 500 at 16px, 12px border-radius, 12px 20px padding, optional shadow rgba(0,0,0,0.06) 0px 9px 20px 0px.

5. **Pill Tag Chip**: Background #ffffff, 1px border #d8d8d8, text #051316 at 14px Graphik 400, border-radius 1000px, padding 8px 14px. No shadow.

## Typographic Signature

Wellfound's display typography is defined by three simultaneous choices: (1) extreme size jumps (17px body → 72px+ display), (2) aggressive negative letter-spacing that scales linearly with size (-0.020em at 100px, -0.013em at 21px, normal at 16px), and (3) unusually tight line-height on display (0.82 at 100px, 1.0 at 72px) contrasted with airy body leading (1.43–1.50 at 16–17px). This three-axis contrast — size, tracking, leading — is what makes the system read as 'editorial' rather than 'SaaS'. The tight display tracking pulls characters into compact shapes; the tight leading makes multi-line headlines feel like a single sculpted block; the body leading gives paragraphs room to breathe. Together they create a voice that whispers authority — confident without shouting.

## Similar Brands

- **AngelList (legacy Wellfound brand)** — Same editorial white-canvas layout, same pill-tag constellation hero, same near-black + red accent palette
- **Notion** — Shared monochrome-first aesthetic with single warm accent, generous white space, and restrained component elevation
- **Linear** — Same preference for near-black (#051316 vs Linear's #08090A) as primary text, tight display tracking, and flat surface philosophy
- **Substack** — Similar editorial typography treatment — large tight-tracked headlines on white, minimal color, text-first hierarchy
- **Pitch** — Same typographic confidence — large display sizes with aggressive negative letter-spacing, minimal chromatic palette, float-and-constellation hero composition

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-wellfound-ink: #051316;
  --color-paper-white: #ffffff;
  --color-blush-mist: #fff4f6;
  --color-ash-gray: #d8d8d8;
  --color-charcoal: #333333;
  --color-slate-depth: #222222;
  --color-signal-red: #ec2e3a;
  --color-aubergine-depth: #210d25;
  --color-plum-shadow: #541142;
  --color-ember-red: #e32e19;

  /* Typography — Font Families */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik-fono: 'Aeonik Fono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonikfono: 'Aeonikfono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.36;
  --tracking-subheading: -0.27px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.31px;
  --text-heading: 30px;
  --leading-heading: 1.27;
  --tracking-heading: -0.48px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.64px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;
  --text-display-xl: 100px;
  --leading-display-xl: 0.82;
  --tracking-display-xl: -2px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-tags: 1000px;
  --radius-cards: 16px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;
  --radius-largeblocks: 40px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.06) 0px 9px 20px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-blush-mist: #fff4f6;
  --surface-aubergine-depth: #210d25;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-wellfound-ink: #051316;
  --color-paper-white: #ffffff;
  --color-blush-mist: #fff4f6;
  --color-ash-gray: #d8d8d8;
  --color-charcoal: #333333;
  --color-slate-depth: #222222;
  --color-signal-red: #ec2e3a;
  --color-aubergine-depth: #210d25;
  --color-plum-shadow: #541142;
  --color-ember-red: #e32e19;

  /* Typography */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik-fono: 'Aeonik Fono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonikfono: 'Aeonikfono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 21px;
  --leading-subheading: 1.36;
  --tracking-subheading: -0.27px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.31px;
  --text-heading: 30px;
  --leading-heading: 1.27;
  --tracking-heading: -0.48px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.64px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;
  --text-display-xl: 100px;
  --leading-display-xl: 0.82;
  --tracking-display-xl: -2px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 1000px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.06) 0px 9px 20px 0px;
}
```
