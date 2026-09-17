# Operate — Style Reference
> Botanist's data terminal

**Theme:** light

Operate reads like a research instrument placed on a herbarium paper: a muted green-gray canvas hosts data plots, dotted timelines, and axis-labeled diagrams as if the page itself were a botanical scatter chart. Typography is small-set and tight-tracked, with one decorative all-caps face (cinetype) reserved for axis labels, tags, and metadata — the effect is scientific, not promotional. Color is almost entirely a mono-green family: dark forest text on a sage paper background, with a single soft mint (#85c093) for the only filled action and occasional deep-emerald (#007010) for links and borders. Components are flat and hairlined: 4px and 12px radii, 0.5px inset borders instead of drop shadows, and almost no elevation. Density is compact and information-first — the page behaves like a control panel where whitespace is a measured gap, not a luxury.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#09352e` | `--color-forest-ink` | Primary text, icons, and chart strokes — the load-bearing dark color. Reads near-black but carries a cool green undertone that ties the monochrome system together |
| Bone White | `#ffffff` | `--color-bone-white` | Card surfaces, data point fills, and reverse text on dark blocks |
| Sage Paper | `#e0e0e0` | `--color-sage-paper` | Page canvas and large background fields. A green-tinted light gray that gives the whole surface its herbarium character |
| Ash Gray | `#e5e5e5` | `--color-ash-gray` | Alternate surface tone for nested blocks, inset panels, and subtle differentiation beneath cards |
| Muted Sage | `#77aa83` | `--color-muted-sage` | Soft fill washes, scatter plot halos, and decorative surface tints that sit behind darker data marks |
| Lichen | `#cad3d2` | `--color-lichen` | Hairline borders, dotted gridlines, and chart axes. The structural line color when a neutral needs to be present without competing with text |
| Slate Smoke | `#6c7a79` | `--color-slate-smoke` | Secondary metadata, icon strokes, and caption text where the body tone is too heavy |
| Charcoal Bark | `#29211e` | `--color-charcoal-bark` | Deep text, heavy borders, and dark surface blocks. Slightly warm-neutral, used for the rare dark panel and strong dividers |
| Moss | `#85c093` | `--color-moss` | The single filled action color — primary buttons, active state fills, and the rare chromatic surface. A soft, slightly desaturated mint that does not shout against the sage canvas |
| Deep Fern | `#007010` | `--color-deep-fern` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Pine | `#117025` | `--color-pine` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Emerald | `#008023` | `--color-emerald` | Alternate data-mark fill and emphasis backgrounds, used on scatter plot points and callout chips |
| Indigo Accent | `#433787` | `--color-indigo-accent` | A single chromatic exception — used on one special link or annotation to break the green-only system. Employ rarely; treat as a punctuation mark, not a palette member |

## Tokens — Typography

### denim — Primary workhorse — body copy, headings, and UI text. Weight 500 is used for headings and emphasis; weight 400 carries all body. Tracking sits at a slightly open +0.012em at body sizes, making the face feel like a working tool rather than a display face. · `--font-denim`
- **Substitute:** Inter, IBM Plex Sans, or Söhne
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 32px, 48px
- **Line height:** 1.11–1.63
- **Letter spacing:** 0.012em at body sizes; tightening to near-zero on display sizes (48px).
- **OpenType features:** `"liga" 0`
- **Role:** Primary workhorse — body copy, headings, and UI text. Weight 500 is used for headings and emphasis; weight 400 carries all body. Tracking sits at a slightly open +0.012em at body sizes, making the face feel like a working tool rather than a display face.

### muoto — Compact UI sans for tags, labels, captions, axis tick text, and micro-copy. Tight negative tracking (-0.009 to -0.012em) at 11–13px makes it dense and instrument-like rather than friendly. Weight 500 is reserved for uppercase labels. · `--font-muoto`
- **Substitute:** IBM Plex Mono, Geist Mono, or JetBrains Mono at slightly reduced size
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 13px
- **Line height:** 1.17–1.62
- **Letter spacing:** -0.009em to -0.012em
- **OpenType features:** `"liga" 0`
- **Role:** Compact UI sans for tags, labels, captions, axis tick text, and micro-copy. Tight negative tracking (-0.009 to -0.012em) at 11–13px makes it dense and instrument-like rather than friendly. Weight 500 is reserved for uppercase labels.

### cinetype — Decorative tracking-heavy display face used only on ALL-CAPS labels, axis titles, and stamp-like badges. Tracking swings from a tight -0.008em to an extreme +0.30em, which is the visual signature of the system — it produces the 'specimen label' feel on tags and section markers. · `--font-cinetype`
- **Substitute:** Söhne Mono, JetBrains Mono, or Suisse Int'l Mono with manual letter-spacing
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.14–1.19
- **Letter spacing:** -0.008em to +0.30em (the wide end is exclusive to uppercase decorative labels)
- **OpenType features:** `"liga" 0`
- **Role:** Decorative tracking-heavy display face used only on ALL-CAPS labels, axis titles, and stamp-like badges. Tracking swings from a tight -0.008em to an extreme +0.30em, which is the visual signature of the system — it produces the 'specimen label' feel on tags and section markers.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.38 | -0.132px | `--text-caption` |
| body | 14px | 1.5 | 0.168px | `--text-body` |
| body-lg | 16px | 1.44 | 0.192px | `--text-body-lg` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 20px | 1.35 | — | `--text-heading-sm` |
| heading | 32px | 1.17 | — | `--text-heading` |
| display | 48px | 1.11 | — | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 12px |
| buttons | 12px |
| hero-blocks | 24px |
| large-panels | 18px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(9, 53, 45, 0.05) 0px 5px 6px -4px, rgba(174, 202, 19...` | `--shadow-sm` |
| subtle | `rgb(202, 211, 210) 0px 0px 0px 0.5px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(64, 68, 66) 0px 0px 0px 0.5px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(224, 229, 229) 0px -0.5px 0px 0px inset` | `--shadow-subtle-3` |
| md | `rgba(8, 18, 17, 0.01) 0px 0px 16px -1px, rgba(8, 18, 17, ...` | `--shadow-md` |
| sm-2 | `rgba(0, 0, 0, 0.25) 0px 5px 5px 0px` | `--shadow-sm-2` |
| sm-3 | `rgba(0, 0, 0, 0.1) 0px 5px 7.5px -5px` | `--shadow-sm-3` |
| md-2 | `rgba(8, 18, 17, 0.01) 0px 0px 16px -1px, rgba(8, 18, 17, ...` | `--shadow-md-2` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Sage Paper Card
**Role:** Standard content card sitting on the green-gray canvas.

Bone White (#ffffff) surface, 12px radius, 20px padding, 0.5px inset hairline border in #cad3d2. No drop shadow. Used for the upper-right info panel and most grouped content blocks. The card should feel like a piece of paper laid on the canvas — flat, slightly lifted only by its white fill.

### Pill Tag (cinetype label)
**Role:** Uppercase metadata tag, axis label, or status badge.

4px radius, transparent or very-light fill, 1px border in Forest Ink (#09352e) or Lichen (#cad3d2). Text is cinetype at 12px, weight 400, letter-spacing +0.30em, uppercase, color Forest Ink. This is the system's signature decorative element — use for any label that should feel 'stamped' rather than written.

### Filled Mint Button
**Role:** The only chromatic filled action in the system.

Background Moss (#85c093), text Forest Ink (#09352e), 12px radius, padding 10px 20px, denim weight 500 at 14px. This is the lone filled button — every other action takes a non-filled variant. The soft mint against dark forest text keeps the button from feeling aggressive against the sage canvas.

### Outlined Button
**Role:** Secondary action.

Transparent background, 0.5px inset border in Forest Ink (#09352e), 12px radius, padding 10px 20px, denim weight 500 at 14px, text Forest Ink. Used for non-primary actions and form submission alternatives.

### Ghost Text Link
**Role:** Inline navigation and bracketed text links.

No background, no border, denim at 14px weight 500, color Deep Fern (#007010). Often wrapped in square brackets [ like this ] to create the system-wide 'annotation' feel. Underline appears only on hover.

### Scatter Data Point
**Role:** A data point on the page-as-chart visual.

Two states: hollow circle (stroke Forest Ink 1px, fill transparent, 8px diameter) and filled circle (fill Bone White or Emerald, 6–8px). Optional inner dot for highlighted points. Always sits on the Sage Paper canvas — no card behind it.

### Timeline Node
**Role:** Connected dot in a data timeline.

Bone White (#ffffff) filled circle, 10px diameter, 0.5px Forest Ink border, connected by a 1px Forest Ink hairline path. The timeline reads like a plotted sequence rather than a process diagram.

### Floating Round Chip
**Role:** Compact floating callout used for inline questions or status pings.

Background Forest Ink (#09352e) or Charcoal Bark (#29211e), text Bone White, 9999px radius (pill), padding 6px 12px, muoto at 12px weight 500. Sits absolutely positioned over the data viz.

### Axis Bracket Label
**Role:** Edge-of-canvas label that frames a section as a chart axis.

muoto at 12px weight 500, color Forest Ink, with a leading bracket glyph ('[ Chaos ]' / '[ Clarity ]'). Used at the top and bottom of major sections to reinforce the page-as-chart metaphor. Letter-spacing tight (-0.01em).

### Hairline Section Divider
**Role:** Thin separator between content bands.

1px line in Lichen (#cad3d2) or 0.5px inset in #cad3d2. No vertical bars or heavy rules — dividers are always one hairline, often dotted.

### Dark Inverse Panel
**Role:** Rare dark section for emphasis or terminal-feel content.

Background Charcoal Bark (#29211e) or #1a191a, text Bone White, 12px radius, 20px padding. Used only when the design needs to invert — no shadows, just a flat dark fill against the sage canvas.

### Version Stamp (footer)
**Role:** Rotated side-margin label, like a document version mark.

muoto at 11px, color Forest Ink, rotated 90° (or written vertically), positioned at the extreme left or right margin. Carries build date, section ID, or page version. Pure decoration-as-information.

## Do's and Don'ts

### Do
- Use Moss (#85c093) only for the single most important action per screen — every other action should be outlined, ghost, or text-only.
- Set card radius to 12px and tag radius to 4px consistently; reserve 18–24px exclusively for hero-scale panels.
- Use cinetype with +0.30em letter-spacing for any uppercase label that should feel like a specimen tag or axis title.
- Wrap inline links in square brackets [ like this ] to keep the page's annotation feel consistent.
- Place section titles at the canvas margin with muoto at 12px weight 500 in Forest Ink, preceded by a bracket glyph.
- Keep the canvas at Sage Paper (#e0e0e0) edge-to-edge — do not introduce a white page background anywhere on the layout.
- Use inset 0.5px hairlines in Lichen (#cad3d2) for card borders instead of 1px+ drop shadows.

### Don't
- Do not add a second chromatic action color — if Moss (#85c093) is taken, use an outlined Forest Ink button, not a different fill.
- Do not use cinetype for body copy or long headings — its wide tracking makes it illegible below 14px and above two words.
- Do not introduce drop shadows stronger than 6% opacity — the system is flat, and heavy shadows break the herbarium feel.
- Do not use pure black (#000000) for body text — Forest Ink (#09352e) carries the green undertone that makes the palette cohere.
- Do not put data points on a card — they belong directly on the Sage Paper canvas so the page itself reads as a chart.
- Do not use the Indigo Accent (#433787) more than once per page — it is punctuation, not a palette member.
- Do not use a white page background; the sage canvas is a structural choice, not a fill.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Sage Paper Canvas | `#e0e0e0` | The page field — where the entire layout sits, evoking graph paper or herbarium sheet. |
| 2 | Ash Block | `#e5e5e5` | Slightly recessed surface used beneath or around cards to create a shallow stepped hierarchy. |
| 3 | Bone Card | `#ffffff` | Card and panel surface — the only place where true white enters the system, giving cards a quiet lift off the green-gray canvas. |
| 4 | Charcoal Block | `#29211` | Rare dark surface for inverse sections, callout panels, or terminal-feeling blocks. |

## Elevation

- **Card hover:** `rgba(9, 53, 45, 0.05) 0px 5px 6px -4px, rgba(174, 202, 197, 0.08) 0px 1px 1px 0.5px`
- **Card border:** `rgb(202, 211, 210) 0px 0px 0px 0.5px inset`
- **Hairline divider:** `rgb(224, 229, 229) 0px -0.5px 0px 0px inset`

## Imagery

Imagery is minimal and scientific — no lifestyle photography, no product screenshots, no human faces. The dominant visual is data-as-illustration: scatter plots of circles, timelines of connected dots, axis brackets, and small hand-drawn wave doodles used as section dividers. When icons appear, they are 1px-stroke line icons in Forest Ink, 16–20px, monoline. The aesthetic borrows from botanical illustration, lab notebook diagrams, and vintage research charts — flat, annotated, and information-first.

## Layout

The page is a full-bleed sage canvas with no strict container — content sits within an implied 1280px wide working area, but data elements (scatter points, axis labels) are allowed to drift to the canvas edges. The hero is a single oversized scatter plot / timeline that occupies most of the viewport, with a small info card floating in the upper-right quadrant and a round 'What's New?' chip pinned to the lower-left. Sections are separated by hairlines rather than background-color changes, and each section carries bracket-style axis labels at its top and bottom margins ('[ Chaos ]' left, '[ Clarity ]' right). Vertical rhythm is 64px between sections, 8px between inline elements, 20px inside cards. The layout reads as a single instrument panel rather than a stacked page of bands.

## Agent Prompt Guide

Quick Color Reference:
- text: #09352e (Forest Ink)
- background: #e0e0e0 (Sage Paper)
- card surface: #ffffff (Bone White)
- border / hairline: #cad3d2 (Lichen)
- accent: #007010 (Deep Fern) for links and emphasis strokes
- primary action: #85c093 (filled action)

Example Component Prompts:
1. Create a scatter-plot hero section: Sage Paper canvas (#e0e0e0) filling the full width. Scatter 60 hollow circles (1px Forest Ink stroke, 8px diameter) and 8 filled Bone White circles across a 1200×500 area, with no card behind them. Add a top-left bracket label using muoto 12px weight 500 in Forest Ink: '[ Chaos ]', and a top-right bracket label: '[ Clarity ]'.
2. Create a pill tag: 4px radius, 1px border in Lichen (#cad3d2), transparent background, cinetype 12px weight 400 at +0.30em letter-spacing, uppercase, Forest Ink text, padding 4px 10px.
3. Create a Primary Action Button: #85c093 background, #29211e text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
4. Create a Bone Card panel: white (#ffffff) background, 12px radius, 0.5px inset Lichen (#cad3d2) border, 20px padding, no drop shadow. Inside: denim 16px weight 500 heading in Forest Ink, 8px gap to body, denim 14px weight 400 in Charcoal Bark.
5. Create a floating round chip: Forest Ink (#09352e) background, Bone White text, 9999px radius, padding 6px 12px, muoto 12px weight 500. Position absolutely over a data plot in the lower-left quadrant.

## Type Pairing Rules

denim carries everything that is read as information or body content. muoto carries anything that is read as a label, axis tick, tag, or chrome — typically 11–13px, never above 14px. cinetype is reserved exclusively for uppercase decorative labels and is never set in lowercase or sentence case. Never pair cinetype with muoto in the same line; cinetype wants denim or silence around it.

## Chart-as-Page Convention

The page itself is a chart. Major sections should carry bracket axis labels at their top-left and top-right margins using muoto 12px. Data elements (circles, dots, paths) should sit directly on the Sage Paper canvas — never inside a card. Dotted gridlines in Lichen at 0.5px are encouraged as ambient texture even where no chart is drawn.

## Similar Brands

- **Linear** — Same mono-accent approach with one vivid color doing the work of ten, plus tight custom-feeling typography and flat surfaces.
- **Vercel** — Same hairline-bordered, nearly-shadowless component language and a near-monochrome palette that uses the canvas itself as a color.
- **Observable** — Treats the page as a data canvas with bracket labels, axis-style annotations, and mono-color chart elements that feel like a research notebook.
- **Arc** — Same small-set UI sans plus decorative tracking-heavy display face pairing, and the same flat hairlined cards on tinted canvas.
- **Are.na** — Shares the herbarium/archival aesthetic — muted paper-toned canvas, tiny annotated labels, and a refusal of glossy SaaS conventions.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #09352e;
  --color-bone-white: #ffffff;
  --color-sage-paper: #e0e0e0;
  --color-ash-gray: #e5e5e5;
  --color-muted-sage: #77aa83;
  --color-lichen: #cad3d2;
  --color-slate-smoke: #6c7a79;
  --color-charcoal-bark: #29211e;
  --color-moss: #85c093;
  --color-deep-fern: #007010;
  --color-pine: #117025;
  --color-emerald: #008023;
  --color-indigo-accent: #433787;

  /* Typography — Font Families */
  --font-denim: 'denim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-muoto: 'muoto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cinetype: 'cinetype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.38;
  --tracking-caption: -0.132px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: 0.168px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.44;
  --tracking-body-lg: 0.192px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.35;
  --text-heading: 32px;
  --leading-heading: 1.17;
  --text-display: 48px;
  --leading-display: 1.11;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 12px;
  --radius-buttons: 12px;
  --radius-hero-blocks: 24px;
  --radius-large-panels: 18px;

  /* Shadows */
  --shadow-sm: rgba(9, 53, 45, 0.05) 0px 5px 6px -4px, rgba(174, 202, 197, 0.08) 0px 1px 1px 0.5px;
  --shadow-subtle: rgb(202, 211, 210) 0px 0px 0px 0.5px inset;
  --shadow-subtle-2: rgb(64, 68, 66) 0px 0px 0px 0.5px inset;
  --shadow-subtle-3: rgb(224, 229, 229) 0px -0.5px 0px 0px inset;
  --shadow-md: rgba(8, 18, 17, 0.01) 0px 0px 16px -1px, rgba(8, 18, 17, 0.04) 0px 0px 5.5px -0.5px;
  --shadow-sm-2: rgba(0, 0, 0, 0.25) 0px 5px 5px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.1) 0px 5px 7.5px -5px;
  --shadow-md-2: rgba(8, 18, 17, 0.01) 0px 0px 16px -1px, rgba(8, 18, 17, 0.04) 0px 0px 5.5px -0.5px, rgb(224, 229, 229) 0px 0px 0px 0.5px inset;

  /* Surfaces */
  --surface-sage-paper-canvas: #e0e0e0;
  --surface-ash-block: #e5e5e5;
  --surface-bone-card: #ffffff;
  --surface-charcoal-block: #29211;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #09352e;
  --color-bone-white: #ffffff;
  --color-sage-paper: #e0e0e0;
  --color-ash-gray: #e5e5e5;
  --color-muted-sage: #77aa83;
  --color-lichen: #cad3d2;
  --color-slate-smoke: #6c7a79;
  --color-charcoal-bark: #29211e;
  --color-moss: #85c093;
  --color-deep-fern: #007010;
  --color-pine: #117025;
  --color-emerald: #008023;
  --color-indigo-accent: #433787;

  /* Typography */
  --font-denim: 'denim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-muoto: 'muoto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cinetype: 'cinetype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.38;
  --tracking-caption: -0.132px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: 0.168px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.44;
  --tracking-body-lg: 0.192px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.35;
  --text-heading: 32px;
  --leading-heading: 1.17;
  --text-display: 48px;
  --leading-display: 1.11;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-sm: rgba(9, 53, 45, 0.05) 0px 5px 6px -4px, rgba(174, 202, 197, 0.08) 0px 1px 1px 0.5px;
  --shadow-subtle: rgb(202, 211, 210) 0px 0px 0px 0.5px inset;
  --shadow-subtle-2: rgb(64, 68, 66) 0px 0px 0px 0.5px inset;
  --shadow-subtle-3: rgb(224, 229, 229) 0px -0.5px 0px 0px inset;
  --shadow-md: rgba(8, 18, 17, 0.01) 0px 0px 16px -1px, rgba(8, 18, 17, 0.04) 0px 0px 5.5px -0.5px;
  --shadow-sm-2: rgba(0, 0, 0, 0.25) 0px 5px 5px 0px;
  --shadow-sm-3: rgba(0, 0, 0, 0.1) 0px 5px 7.5px -5px;
  --shadow-md-2: rgba(8, 18, 17, 0.01) 0px 0px 16px -1px, rgba(8, 18, 17, 0.04) 0px 0px 5.5px -0.5px, rgb(224, 229, 229) 0px 0px 0px 0.5px inset;
}
```
