# Strut — Style Reference
> editorial broadsheet on warm canvas — oversized serif-adjacent display type sitting on a cream paper field, marked only by a single amber highlighter and hairline rules.

**Theme:** light

Strut treats its interface as a sheet of warm paper rather than a software screen: a continuous cream canvas carries oversized editorial type, hairline-bordered flat cards, and a single amber accent that punctuates like a highlighter stroke. GT Pressura anchors the voice — its geometric, slightly utilitarian forms at 100–136px turn every headline into a broadsheet masthead, while Inter quietly handles body and UI at 14–16px. Components are deliberately weightless: 1px borders do the work of shadows, 28px corners soften without rounding into pill territory, and vertical rhythm opens up to 80–120px between sections so the page reads like a printed spread. Color is rationed — the amber appears as decorative micro-touches (active icon strokes, brand mark, tag dots) while text and structure stay in warm neutrals from #2e2d2b ink to #ead7b8 paper.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper Cream | `#ead7b8` | `--color-paper-cream` | Page canvas, the continuous warm background behind every section — the paper the whole product sits on |
| Sand Border | `#e5dfd5` | `--color-sand-border` | Hairline borders, soft card surfaces that float just barely above the cream canvas, subtle dividers |
| Ink Black | `#2e2d2b` | `--color-ink-black` | Primary text, masthead headlines, and the near-black ink that gives the editorial type its printed authority |
| Charcoal | `#333333` | `--color-charcoal` | Body copy, secondary text, and any UI text that needs to stay just slightly softer than pure ink |
| Stone | `#73706b` | `--color-stone` | Muted helper text, inactive icons, and the soft gray that recedes behind primary content |
| Slate Border | `#676460` | `--color-slate-border` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Deep Stone | `#5c5955` | `--color-deep-stone` | Pressed/hover states for borders and link underlines — a half-step darker than Slate Border |
| Amber Honey | `#ffb546` | `--color-amber-honey` | Decorative brand accent — brand mark, active workspace icon stroke, highlight tag dots. Rationed: never fills a button, never carries body text |

## Tokens — Typography

### GT Pressura Standard — Display and headline voice — masthead, section titles, oversized declarations. Its geometric, slightly industrial forms at 104–136px are the brand's signature, replacing the typical bold sans headline with something that reads more like editorial typography set by hand. · `--font-gt-pressura-standard`
- **Substitute:** Space Grotesk or Söhne Breit (for the geometric editorial feel); or IBM Plex Sans at high weight as a stand-in.
- **Weights:** 400, 500
- **Sizes:** 12, 14, 48, 68, 104, 136
- **Line height:** 0.92–1.67 (tighter at display, 1.43–1.67 at smaller sizes)
- **Letter spacing:** 0.0710em at display; 0.2500em at micro/uppercase labels
- **Role:** Display and headline voice — masthead, section titles, oversized declarations. Its geometric, slightly industrial forms at 104–136px are the brand's signature, replacing the typical bold sans headline with something that reads more like editorial typography set by hand.

### Inter — Body, UI, navigation, badges, and supporting headlines. Quiet, high-legibility workhorse that stays out of GT Pressura's way; the 0.214em tracking on 10–14px uppercase labels is the second signature — small editorial micro-labels that read as typeset marginalia. · `--font-inter`
- **Substitute:** Inter (native) — no substitute needed.
- **Weights:** 400, 600
- **Sizes:** 10, 14, 16, 20, 32, 48
- **Line height:** 1.17–1.60
- **Letter spacing:** 0.1000em at subheadings; 0.2140em at uppercase body labels
- **Role:** Body, UI, navigation, badges, and supporting headlines. Quiet, high-legibility workhorse that stays out of GT Pressura's way; the 0.214em tracking on 10–14px uppercase labels is the second signature — small editorial micro-labels that read as typeset marginalia.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro-label | 10px | 1.6 | 2.5px | `--text-micro-label` |
| caption | 12px | 1.43 | — | `--text-caption` |
| body-sm | 14px | 1.43 | 3px | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | 2px | `--text-subheading` |
| heading-sm | 32px | 1.25 | — | `--text-heading-sm` |
| heading | 48px | 1.17 | — | `--text-heading` |
| heading-lg | 68px | 1 | — | `--text-heading-lg` |
| display | 104px | 0.92 | 7.4px | `--text-display` |
| display-xl | 136px | 0.92 | 9.7px | `--text-display-xl` |

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
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 108 | 108px | `--spacing-108` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 28px |
| inputs | 12px |
| buttons | 8px |
| appScreenshots | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.5) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-40px
- **Element gap:** 16px

## Components

### Editorial Micro-Label
**Role:** Section label and small caps marginalia

10–12px Inter 400, uppercase, letter-spacing 0.25em, color Stone (#73706b). Sits above section headings as a typographic breath — never bold, never colored. Always preceded by a full hairline rule above it.

### Masthead Display Heading
**Role:** Hero and section-level declarations

GT Pressura 500 at 68–136px, line-height 0.92, letter-spacing ~0.071em, color Ink Black (#2e2d2b). Wraps onto 2–3 lines, never breaks after the first word. No gradient, no decoration.

### Workspace Card
**Role:** Container for grouped document tiles, used in app and in product preview

Background Paper Cream (#ead7b8), 1px Slate Border (#676460), 28px radius, 24–40px internal padding. No shadow. Title is GT Pressura 500 at 14–16px, body is Inter 400 at 12–14px in Stone.

### Document Tile
**Role:** Individual document card inside a workspace

Background Paper Cream, 1px Sand Border (#e5dfd5), 24px radius, 24px padding. Active state adds Amber Honey (#ffb546) left border at 4px width and a small amber dot. Title in GT Pressura 500, 14px.

### App Window Frame
**Role:** Container for product screenshots in marketing pages

24px radius, 1px Slate Border, no shadow, sits on the cream canvas. Inner chrome bar is ~32px tall, light, with three small traffic-light dots left-aligned. App UI inside uses the same Paper Cream and Ink palette.

### Detail Accordion Row
**Role:** Expandable feature description in a vertical list

Full-width row, flush-left content, +/- toggle flush-right. Title in Inter 600 at 16–20px in Ink Black. Hairline Sand Border above each row. Expanded state reveals body copy in Inter 400, 14–16px, Charcoal, with 16px row-gap between paragraphs. No background change between collapsed and expanded.

### Sidebar Nav Item
**Role:** Workspace/folder navigation in the app

No background fill by default. Active state uses a 1px Amber Honey (#ffb546) left border at 3px and a 2px rounded indicator. Text in Inter 400, 14px. Hover state adds Paper Cream background.

### Ghost Text Link
**Role:** Inline link and supporting action link

Underlined 1px Deep Stone (#5c5955) rule beneath Charcoal text. No color change on hover — the underline thickens to 2px. No arrow, no background, no fill.

### App Icon Mark
**Role:** Brand mark in the top-left of the site

A small geometric glyph in Amber Honey (#ffb546) — the only place amber sits at this size. Followed by the wordmark 'strut' in GT Pressura 500 at 18–20px, Ink Black, lowercase, no tracking.

### Section Divider
**Role:** Horizontal separator between content blocks

1px solid Sand Border (#e5dfd5), full content width, no padding above or below — sections breathe into the gap.

### Feature List Bullet
**Role:** Small list item within a prose block

No bullet glyphs. Items are preceded by a small uppercase micro-label (10–12px Inter, 0.25em tracking, Stone) instead of a dot. Body copy below in Inter 400, 14–16px.

### Footer Link
**Role:** Supporting links in the bottom strip

Inter 400, 12–14px, Stone (#73706b). Hover darkens to Charcoal. No underline unless the link is inline within a sentence.

## Do's and Don'ts

### Do
- Use Paper Cream (#ead7b8) as the canvas on every marketing page section; never fall back to white.
- Set display headings in GT Pressura 500 at 68–136px with 0.92 line-height and ~0.071em letter-spacing.
- Mark section starts with an uppercase 10–12px Inter micro-label at 0.25em letter-spacing in Stone (#73706b).
- Use 1px Slate Border (#676460) or Sand Border (#e5dfd5) for all card and container edges — never use drop shadows for elevation.
- Apply 28px radius to all workspace and feature cards; 24px to app screenshot frames; 8px to small interactive surfaces.
- Open vertical breathing room to 80–120px between sections to maintain the printed-spread rhythm.
- Reserve Amber Honey (#ffb546) for the brand mark, active icon strokes, and the sidebar active indicator — never fill a button or large surface with it.

### Don't
- Do not use a filled colored CTA button — actions live as ghost text links or outlined controls with Deep Stone (#5c5955) borders.
- Do not set body copy in a display weight or size; Inter 400 at 14–16px in Charcoal (#333333) is the only body treatment.
- Do not introduce drop shadows, glows, or blur effects to lift cards — the system is intentionally flat.
- Do not use pure white (#ffffff) as a page background; Paper Cream is the system canvas.
- Do not use Amber Honey (#ffb546) for text, button fills, or large background areas — it is a 1–4px accent only.
- Do not tighten letter-spacing on uppercase micro-labels below 0.2em — the wide tracking is what makes them read as editorial marginalia.
- Do not center-align long body paragraphs; body copy sits flush-left in a max-width column of 640–720px.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper Canvas | `#ead7b8` | The base page background — every section inherits this warm cream field. |
| 2 | Card Sand | `#e5dfd5` | Inside cards and the lighter band that frames product screenshots, separating surface from canvas. |
| 3 | Ink Field | `#2e2d2b` | The dark inverted surface used inside the app screenshot for the sidebar — used sparingly as a counterpoint. |

## Elevation

Strut deliberately avoids traditional drop shadows. The single shadow token in the system — a 1px rgba(0,0,0,0.5) inset line — is functionally a hairline border, not a shadow. Surfaces separate through color contrast and 1px Slate Border rules, not depth. This keeps the page feeling flat, printed, and paper-like rather than skeuomorphic or iOS-glass. When a product screenshot or app preview appears, it sits directly on the cream canvas with no lift.

## Imagery

No photography or illustration. The only imagery is product screenshots of the Strut app itself, shown as full app window mockups (traffic-light chrome, sidebar, document cards) embedded in the page like printed spreads. The screenshots use the same cream-and-ink palette internally, so they read as part of the same paper system rather than foreign UI dropped in. Iconography inside the screenshots is a mix of filled and outlined glyphs at ~16–20px, mostly in Stone and Slate tones. No lifestyle photography, no abstract graphics, no stock imagery — the writing workspace IS the visual content.

## Layout

Pages are max-width contained at ~1200px, centered on the warm cream canvas. The hero is a 2-column split: oversized GT Pressura headline (filling the left half at 68–104px) beside a full app window screenshot (right half, with ~24px corners). Below the hero, long-form prose sections appear as centered text blocks ~640–720px wide, capped and floored with hairline Sand Border rules. Feature sections alternate into asymmetric 2-column compositions: text on the left (a small uppercase micro-label like 'FOCUSED WRITING' in 10px Inter with 0.25em tracking, followed by a 48–68px GT Pressura heading, followed by body copy), and 1–2 product screenshots stacked on the right with generous gutter space. Detail lists use a flush-left accordion pattern: small uppercase label, bolded item title, 1px hairline rule, +/- toggle on the right. Vertical rhythm opens dramatically between sections — 80–120px of pure cream — giving the page a printed-spread cadence rather than a dashboard cadence. Navigation is minimal: a small logomark + wordmark in the top-left, nothing else competing.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2e2d2b (headings) / #333333 (body) / #73706b (muted)
- background: #ead7b8 (canvas) / #e5dfd5 (card surface)
- border: #676460 (mid) / #e5dfd5 (hairline)
- accent: #ffb546 (amber — decorative only)
- primary action: no distinct CTA color

**3–5 Example Component Prompts**
1. *Build a hero section:* Cream canvas (#ead7b8). Left column: 104px GT Pressura 500 headline, Ink Black (#2e2d2b), letter-spacing 7.4px, line-height 0.92. Right column: app window screenshot frame, 24px radius, 1px #676460 border, 32px inner chrome bar with three small dots. 120px vertical padding above and below.
2. *Build a feature split section:* Two columns. Left: uppercase micro-label 'FOCUSED WRITING' in 10px Inter 400, Stone (#73706b), 0.25em letter-spacing, bottom 16px margin. Then 48px GT Pressura 500 heading, Ink Black, line-height 1.17. Then 16px Inter 400 body, Charcoal (#333333), max-width 480px. Right: stacked product screenshots, 24px radius each, 24px gap.
3. *Build a workspace card grid:* 3-column grid, 24px gap. Each card: 28px radius, 1px #676460 border, Paper Cream background, 32px padding. Title in GT Pressura 500 18px Ink Black, body in Inter 400 14px Stone.
4. *Build a detail accordion:* Single column, full content width. Each row: 1px #e5dfd5 top border, 24px vertical padding, Inter 600 18px title in Ink Black flush left, '+' icon in Stone flush right. Expanded state: body copy in Inter 400 16px Charcoal, 16px top margin.
5. *Build a sidebar nav item:* 14px Inter 400, Charcoal, 12px vertical padding, 16px horizontal padding. Active state: 3px Amber Honey (#ffb546) left border, text in Ink Black. No background fill.

## Editorial Typography Discipline

GT Pressura at display sizes is non-negotiable — it carries the brand voice. Do not substitute a standard bold sans (no Inter Bold at 104px, no Helvetica Black). The slight geometric tension in Pressura's forms is what makes the page read as editorial rather than corporate. Inter handles everything that is not a headline, with one exception: the 0.214–0.25em letter-spaced uppercase micro-labels are a secondary signature and should be used consistently as section markers, list introductions, and supporting metadata — never write uppercase body copy in tight tracking.

## The Cream-First Rule

White should never appear as a primary background on a marketing surface. Paper Cream (#ead7b8) is the canvas everywhere. The only whites allowed are inside app screenshots and the lighter Sand Border (#e5dfd5) inside cards. This is what makes the page feel like printed paper instead of a software product — violating it instantly breaks the system.

## Similar Brands

- **iA Writer** — Same writing-tool identity with oversized editorial display type and a deliberately paper-like surface treatment.
- **Read.cv** — Same warm cream canvas, oversized masthead-style display type, and hairline-bordered flat cards over generous whitespace.
- **Substack** — Same editorial broadsheet rhythm — large display headlines, centered prose blocks, and a warm neutral palette that feels like reading a magazine spread.
- **Notion** — Same workspace/productivity positioning with flat card-based content organization, but Strut applies an editorial type system where Notion uses a neutral sans.
- **Linear** — Same hairline-border, no-shadow component philosophy and single restrained accent color, but Strut wraps it in a warm paper aesthetic instead of a cool dark UI.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-cream: #ead7b8;
  --color-sand-border: #e5dfd5;
  --color-ink-black: #2e2d2b;
  --color-charcoal: #333333;
  --color-stone: #73706b;
  --color-slate-border: #676460;
  --color-deep-stone: #5c5955;
  --color-amber-honey: #ffb546;

  /* Typography — Font Families */
  --font-gt-pressura-standard: 'GT Pressura Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro-label: 10px;
  --leading-micro-label: 1.6;
  --tracking-micro-label: 2.5px;
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 3px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --text-heading: 48px;
  --leading-heading: 1.17;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1;
  --text-display: 104px;
  --leading-display: 0.92;
  --tracking-display: 7.4px;
  --text-display-xl: 136px;
  --leading-display-xl: 0.92;
  --tracking-display-xl: 9.7px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-108: 108px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 28px;
  --radius-inputs: 12px;
  --radius-buttons: 8px;
  --radius-appscreenshots: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.5) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.5) 0px 1px 0px 0px;

  /* Surfaces */
  --surface-paper-canvas: #ead7b8;
  --surface-card-sand: #e5dfd5;
  --surface-ink-field: #2e2d2b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-cream: #ead7b8;
  --color-sand-border: #e5dfd5;
  --color-ink-black: #2e2d2b;
  --color-charcoal: #333333;
  --color-stone: #73706b;
  --color-slate-border: #676460;
  --color-deep-stone: #5c5955;
  --color-amber-honey: #ffb546;

  /* Typography */
  --font-gt-pressura-standard: 'GT Pressura Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro-label: 10px;
  --leading-micro-label: 1.6;
  --tracking-micro-label: 2.5px;
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 3px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --text-heading: 48px;
  --leading-heading: 1.17;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1;
  --text-display: 104px;
  --leading-display: 0.92;
  --tracking-display: 7.4px;
  --text-display-xl: 136px;
  --leading-display-xl: 0.92;
  --tracking-display-xl: 9.7px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-108: 108px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.5) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.5) 0px 1px 0px 0px;
}
```
