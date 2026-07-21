# BaseHub — Style Reference
> midnight canvas, molten filament

**Theme:** dark

BaseHub speaks a near-monochrome dialect: a near-black canvas, a grayscale text scale, and one molten orange accent that does the work of a full color system. The product is the hero — large borderless screenshots of the editor float in the dark rather than floating illustrations, and a thin vertical orange rule on the far left anchors every section like a margin note. Typography stays compressed and quiet: Geist at semibold for headlines, regular for body, with tight negative tracking at every size to make words feel machined rather than typeset. Surfaces are flat and hairline-bordered rather than shadowed, and a 12px card radius plus 4px button radius keep the geometry sharp and developer-tool familiar. The only warm note is the orange — used for CTAs, section tags, the glowing product frame, and hand-drawn annotations — and a cool blue (#55c2ff) reserved strictly for informational badges.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff6c02` | `--color-ember-orange` | Primary CTAs, section tags, active nav, the glowing product frame, hand-drawn annotations, and the single decorative rule on the left margin — the one warm voice in an otherwise cold palette |
| Ember Glow | `linear-gradient(rgb(255, 108, 2), rgb(255, 155, 81))` | `--color-ember-glow` | Gradient stop paired with Ember Orange for the rare gradient surface (e.g. template card accent bars) |
| Glacier Blue | `#55c2ff` | `--color-glacier-blue` | Blue state accent for badges, validation surfaces, and short status labels. |
| Bone White | `#f3f3f3` | `--color-bone-white` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Ash Gray | `#dedede` | `--color-ash-gray` | Secondary text and lighter icon strokes on dark surfaces |
| Fog Gray | `#909090` | `--color-fog-gray` | Medium-contrast borders, control outlines, and structural separators. |
| Slate Gray | `#646464` | `--color-slate-gray` | Muted metadata text, timestamp labels, tertiary icon strokes |
| Iron Border | `#303030` | `--color-iron-border` | Hairline dividers, code block borders, subtle list separators |
| Charcoal Edge | `#252525` | `--color-charcoal-edge` | Card borders, subtle frame edges, input field borders |
| Graphite | `#1b1b1b` | `--color-graphite` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Obsidian | `#121212` | `--color-obsidian` | Card surface — one step above canvas, used for testimonial cards and elevated blocks |
| Onyx | `#0c0c0c` | `--color-onyx` | Quote/testimonial card surface, link button background, the most common elevated surface |
| Void | `#040404` | `--color-void` | Page canvas — the dominant page background |
| Black | `#000000` | `--color-black` | Deepest surface for footer and image fill where absolute black is needed |

## Tokens — Typography

### Geist — Primary UI and display typeface. Weight 600 for headlines, 500 for nav and sub-labels, 400 for body. The tight negative tracking (-0.05em at 60px tightening to -0.03em at 16px) gives the type a machined, geometric feel — Geist's tall x-height and open apertures keep small body text readable against #040404 without weight inflation. Display sizes use lineHeight 1.0–1.14 for editorial compression. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 11, 12, 13, 14, 16, 18, 24, 32, 48, 60
- **Line height:** 1.0, 1.1, 1.14, 1.2, 1.23, 1.4, 1.5
- **Letter spacing:** -0.05em at 60px, -0.04em at 48px, -0.03em at 16–32px, normal at 11–14px
- **Role:** Primary UI and display typeface. Weight 600 for headlines, 500 for nav and sub-labels, 400 for body. The tight negative tracking (-0.05em at 60px tightening to -0.03em at 16px) gives the type a machined, geometric feel — Geist's tall x-height and open apertures keep small body text readable against #040404 without weight inflation. Display sizes use lineHeight 1.0–1.14 for editorial compression.

### Geist Mono — Code-adjacent micro-copy: version tags, branch labels, file paths, inline commit IDs. Only used at 13px / 400 with the same -0.03em tracking as body Geist — this consistency is what makes the mono feel native rather than a foreign insert. · `--font-geist-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 13
- **Line height:** 1.5
- **Letter spacing:** -0.03em
- **Role:** Code-adjacent micro-copy: version tags, branch labels, file paths, inline commit IDs. Only used at 13px / 400 with the same -0.03em tracking as body Geist — this consistency is what makes the mono feel native rather than a foreign insert.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 18px | 1.4 | -0.54px | `--text-heading-sm` |
| heading | 24px | 1.23 | -0.72px | `--text-heading` |
| heading-lg | 32px | 1.2 | -0.96px | `--text-heading-lg` |
| display | 48px | 1.14 | -1.92px | `--text-display` |
| display-xl | 60px | 1.1 | -3px | `--text-display-xl` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| badges | 9999px |
| inputs | 8px |
| buttons | 4px |
| imageCards | 21px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.01) -10px 13px 10px 0px, rgba(0, 0, 0, 0....` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main conversion action (Get Started, Sign Up, Open in new tab)

Ember Orange (#ff6c02) fill, Bone White (#f3f3f3) text, Geist 500 at 14px, 4px radius, 14px 16px padding. No shadow. The only filled button in the system — it should feel like flipping a switch in a dark room.

### Secondary Outlined Button
**Role:** Companion action to a primary CTA (Schedule a Demo, Learn more)

Transparent background, Fog Gray (#909090) 1px border, Fog Gray text, Geist 500 at 14px, 4px radius, 14px 16px padding. Visually quieter than the primary so the eye lands on the orange first.

### Nav Login Button
**Role:** Low-emphasis action in the top navigation

Graphite (#1b1b1b) fill, Bone White text, Geist 500 at 14px, 4px radius, 6px 12px padding. Sits next to the primary orange Sign Up button and stays subordinate.

### Section Tag Pill
**Role:** Small label that opens a feature section (Editor, Branching, Playground)

Transparent fill, Ember Orange 1px border, Ember Orange text, Geist 500 at 12px, 9999px radius, 6px 12px padding. Reads as a category marker rather than a button.

### New Badge
**Role:** Annotation attached to a nav link indicating recent content

Transparent fill, Fog Gray 1px border, Fog Gray text, Geist 500 at 11px, 4px radius, 2px 6px padding. Lives inline with the link it modifies.

### Info Badge
**Role:** Status or environment indicator (playground warnings, branch labels)

Transparent fill, Glacier Blue (#55c2ff) 1px border, Glacier Blue text, Geist 500 at 12px, 9999px radius, 4px 10px padding. The only place blue appears — reserved for informational context.

### Testimonial Card
**Role:** Quote block from a customer, with author attribution

Onyx (#0c0c0c) fill, no border, 12px radius, 24px padding. Quote mark icon in Bone White at the top, quote text in Bone White at 14px, author name in Fog Gray with avatar to the right. Flat surface — no shadow.

### Template Card
**Role:** Selectable template preview in the template gallery

Obsidian (#121212) fill, Charcoal Edge (#252525) 1px border, 12px radius, 0px internal padding (image fills the card). A 2px accent bar at the top in a brand color (purple, orange, or yellow from the template itself). Title in Bone White 16px semibold below the image, description in Fog Gray 14px regular.

### Product Screenshot Frame
**Role:** The hero element below the headline — a live preview of the editor

Void (#040404) fill, Ember Orange 2px border, 16px outer radius. The screenshot content is a real product capture, not a mockup. The orange border glow is what makes it feel like a hot ember on the dark canvas.

### Feature Block Heading
**Role:** Large section title for each feature explainer

Bone White text, Geist 600 at 48px, lineHeight 1.14, letter-spacing -0.04em. Followed by a description in Fog Gray 14–16px regular. Always preceded by a Section Tag Pill.

### Logo Strip
**Role:** Social proof row of customer logos

Logos rendered in Fog Gray (#909090) at consistent height (~20px), evenly spaced with 32px gaps, left-aligned within the page max width. 'Trusted by' label in Fog Gray 12px sits above.

### Hand-drawn Annotation
**Role:** Playful callout pointing to a feature in the product screenshot

Ember Orange (#ff6c02), thin stroke, casual handwritten appearance, always paired with an arrow pointing to the relevant UI element. Used sparingly — one per hero section maximum — to inject personality without cluttering the editorial layout.

### Decorative Left Margin Rule
**Role:** Vertical guide line anchoring the page composition

1px Ember Orange stroke, full viewport height, positioned at ~5% from the left edge. A small Ember Orange dot (4px circle) marks section starts along the rule. This is the only persistent visual element that repeats across all sections.

### Floating Chat Widget
**Role:** Persistent support entry point in the bottom-right corner

Ember Orange (#ff6c02) fill circle, 48px diameter, Bone White chat icon centered. Fixed position, bottom 24px, right 24px. Subtle drop shadow for separation from the canvas.

## Do's and Don'ts

### Do
- Use Ember Orange (#ff6c02) for exactly one element per viewport: the primary CTA, a section tag, or the product frame border — never multiple at once
- Set headings in Geist 600 with letter-spacing -0.04em at 48px and -0.05em at 60px; the tight tracking is what makes the type feel machined
- Use 12px radius for cards and 4px radius for buttons; 9999px is reserved for tags, badges, and pills only
- Define surfaces with 1px #252525 or #303030 hairline borders rather than shadows; the page should read as flat code-editor geometry
- Anchor every section with a Section Tag Pill in Ember Orange before the headline — this is the system's repeating motif
- Let product screenshots fill their containers edge-to-edge; the orange border is the only frame they need
- Keep body text at 14–16px in Fog Gray (#909090) and reserve Bone White (#f3f3f3) for headlines and primary actions

### Don't
- Never introduce a second warm color; orange is the only warm voice and adding red, yellow, or another orange-adjacent hue dilutes the single-accent system
- Don't use drop shadows on cards, buttons, or navigation; the design rejects elevation as a visual signal
- Don't set body text in Bone White (#f3f3f3) — use Fog Gray (#909090) for paragraphs to create the dim-product-canvas atmosphere
- Avoid gradients on large surfaces; the only gradient is the orange→peach pair on template card accent bars
- Don't use a border radius larger than 12px on cards or 4px on buttons; large radii read as friendly consumer apps, which this isn't
- Never center-align body copy; BaseHub is editorial and left-aligned throughout, including descriptions and quotes
- Don't use Glacier Blue (#55c2ff) for anything outside informational badges and status chips

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#040404` | Page canvas — the dominant background every section floats on |
| 1 | Black | `#000000` | Deepest layer, used sparingly for footer and image fills |
| 2 | Onyx | `#0c0c0c` | Testimonial and quote card surface, one step above canvas |
| 3 | Obsidian | `#121212` | Elevated product blocks and secondary card surface |
| 4 | Graphite | `#1b1b1b` | Button fills and highest elevation surface |

## Elevation

- **Floating Chat Widget:** `0 4px 12px rgba(0, 0, 0, 0.4)`

## Imagery

Product screenshots are the entire visual language. The hero is a borderless editor capture framed in an orange 2px stroke, not a stock photo or illustration. Secondary sections use customer logos (grayscale, single row) and template preview cards that are themselves product screenshots. The only decorative imagery is hand-drawn orange annotations ('PLAY WITH IT' with a curved arrow) layered over product captures — these are the brand's personality injection. No lifestyle photography, no 3D renders, no abstract gradients. Visual space is dominated by text and product UI, not by imagery.

## Layout

Max-width 1200px centered container, full-viewport dark canvas behind it. Hero is left-aligned text stack (version tag pill → 60px headline → 14px subhead → button row) occupying roughly the left half, with the product screenshot occupying the right half on desktop. The decorative left margin rule at ~5% from edge is the only element that breaks out of the container. Feature sections below are single-column: section tag pill → 48px headline → 14px description → supporting visual, all left-aligned with 80px vertical gaps. The template gallery is a 3-column grid with equal-width cards. Section rhythm is consistent — no alternating bands, no dark/light switches — the entire page is one continuous dark surface.

## Agent Prompt Guide

**Quick Color Reference**
- text: #f3f3f3 (primary), #909090 (body), #646464 (muted)
- background: #040404 (canvas), #0c0c0c (card), #121212 (elevated)
- border: #252525 (cards), #303030 (dividers), #1b1b1b (button fill)
- accent: #ff6c02 (Ember Orange — single warm voice)
- primary action: #ff6c02 (filled action)

**3 Example Component Prompts**

1. Create a Primary Action Button: #ff6c02 background, #303030 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature block*: #040404 canvas. Section tag pill in #ff6c02 (same as above). Headline — Geist 600 at 48px, #f3f3f3, letter-spacing -1.92px, line-height 1.14. Description — Geist 400 at 16px, #909090, max-width 640px. Testimonial card below — #0c0c0c fill, no border, 12px radius, 24px padding, quote text in #f3f3f3 14px, author in #909090 12px.

3. *Template gallery*: 3-column grid, 24px gap. Each card — #121212 fill, #252525 1px border, 12px radius, 0px padding. Top accent bar — 2px tall, template-specific color (purple, orange, or yellow). Template screenshot fills the card body. Title below image — Geist 600 at 16px, #f3f3f3. Description — Geist 400 at 14px, #909090.

## Similar Brands

- **Linear** — Same dark-mode editor-tool atmosphere with a single vivid accent, tight Geist-style tracking, hairline borders over shadows, and product screenshots as the hero
- **Vercel** — Near-black canvas, grayscale text scale, one warm accent color doing all the action work, and the same flat border-based surface elevation system
- **Resend** — Developer-tool aesthetic with monochrome palette, compact 4px/12px radii, tight letter-spacing on Geist-class type, and ornamental left margin accents
- **Notion** — The editor-screenshot-as-hero approach, the 12px card radius, and the product-forward composition with minimal decoration

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff6c02;
  --color-ember-glow: #ff9b51;
  --gradient-ember-glow: linear-gradient(rgb(255, 108, 2), rgb(255, 155, 81));
  --color-glacier-blue: #55c2ff;
  --color-bone-white: #f3f3f3;
  --color-ash-gray: #dedede;
  --color-fog-gray: #909090;
  --color-slate-gray: #646464;
  --color-iron-border: #303030;
  --color-charcoal-edge: #252525;
  --color-graphite: #1b1b1b;
  --color-obsidian: #121212;
  --color-onyx: #0c0c0c;
  --color-void: #040404;
  --color-black: #000000;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.54px;
  --text-heading: 24px;
  --leading-heading: 1.23;
  --tracking-heading: -0.72px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.96px;
  --text-display: 48px;
  --leading-display: 1.14;
  --tracking-display: -1.92px;
  --text-display-xl: 60px;
  --leading-display-xl: 1.1;
  --tracking-display-xl: -3px;

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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 21px;
  --radius-full: 96px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-badges: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 4px;
  --radius-imagecards: 21px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.01) -10px 13px 10px 0px, rgba(0, 0, 0, 0.02) -4px 6px 7px 0px, rgba(0, 0, 0, 0.02) -1px 1px 4px 0px;

  /* Surfaces */
  --surface-void: #040404;
  --surface-black: #000000;
  --surface-onyx: #0c0c0c;
  --surface-obsidian: #121212;
  --surface-graphite: #1b1b1b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff6c02;
  --color-ember-glow: #ff9b51;
  --color-glacier-blue: #55c2ff;
  --color-bone-white: #f3f3f3;
  --color-ash-gray: #dedede;
  --color-fog-gray: #909090;
  --color-slate-gray: #646464;
  --color-iron-border: #303030;
  --color-charcoal-edge: #252525;
  --color-graphite: #1b1b1b;
  --color-obsidian: #121212;
  --color-onyx: #0c0c0c;
  --color-void: #040404;
  --color-black: #000000;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.54px;
  --text-heading: 24px;
  --leading-heading: 1.23;
  --tracking-heading: -0.72px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.96px;
  --text-display: 48px;
  --leading-display: 1.14;
  --tracking-display: -1.92px;
  --text-display-xl: 60px;
  --leading-display-xl: 1.1;
  --tracking-display-xl: -3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 21px;
  --radius-full: 96px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.01) -10px 13px 10px 0px, rgba(0, 0, 0, 0.02) -4px 6px 7px 0px, rgba(0, 0, 0, 0.02) -1px 1px 4px 0px;
}
```
