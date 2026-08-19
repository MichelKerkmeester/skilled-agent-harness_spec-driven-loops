# Antimetal — Style Reference
> editorial observatory on cream paper — a quiet morning in a research journal where restraint signals confidence and the serif does the heavy lifting

**Theme:** light

Antimetal operates in a quiet editorial register: warm cream paper, a distinctive contemporary serif (Test Signifier) at weight 400 for every headline, and an almost entirely achromatic palette where color appears only as a small constellation of decorative dots and a single muted chartreuse accent. The visual grammar borrows from print design — drop caps, pull quotes, section numbering in tracked monospace, dashed hairline dividers — rather than from typical SaaS dashboards. Components are flat and pill-shaped; the navigation is a liquid-glass capsule; borders are dashed 1px at 10% black opacity. Everything whispers, even the CTA. The serif at regular weight doing the work of bold is the single most defining choice: Antimetal does not shout authority, it earns it through typographic restraint and generous breathing room.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#d7d7d0` | `--color-parchment` | Page canvas — warm gray field that recedes behind content, used as the dominant full-bleed background |
| Cream | `#f7f6f3` | `--color-cream` | Primary surface — card backgrounds, FAQ rows, section bands, pulled slightly warmer than white to avoid clinical feel |
| Bone | `#fdfcfa` | `--color-bone` | Elevated card surface — nearly white with a faint warm cast, for content blocks that need to feel slightly above the cream layer |
| Bistre | `#1a1614` | `--color-bistre` | Primary text, dark filled buttons, active strokes — warm near-black that replaces pure #000, never harsh on the cream |
| Graphite | `#66635f` | `--color-graphite` | Secondary body text, nav labels, supporting copy — the workhorse mid-tone that keeps paragraphs quiet |
| Flint | `#a8a7a1` | `--color-flint` | Muted helper text, dashed dividers, disabled chrome, low-emphasis stroke — sits between graphite and the canvas |
| Slate | `#53504c` | `--color-slate` | Tertiary text and sub-labels — slightly darker than graphite for labels that need quiet emphasis |
| Ash | `#2a2724` | `--color-ash` | Hover/pressed state on dark buttons and video timestamp chips — a mid-point between bistre and black |
| Quill | `#e3e3de` | `--color-quill` | Hairline dividers, ghost button borders, nav capsule background, tab resting surface — the lightest warm gray that still reads as a line |
| Chartreuse Whisper | `#e2e67d` | `--color-chartreuse-whisper` | Sole chromatic accent — appears as a small punctuation mark, badge fill, or highlight wash; deliberately desaturated so it never dominates |

## Tokens — Typography

### Test Signifier — All display and heading text from sub-heading through display — a custom contemporary serif with distinctive flared terminals. Used at weight 400 across every size, never bolded; negative letter-spacing tightens large sizes (ls=-0.037em at 54px, -0.021em at 48px). Substitute: "Noto Serif", Georgia, serif. · `--font-test-signifier`
- **Substitute:** Noto Serif, Georgia, serif
- **Weights:** 400
- **Sizes:** 24px, 36px, 48px, 50px, 54px
- **Line height:** 1.00, 1.10, 1.20
- **Letter spacing:** -0.037em at 54px, -0.021em at 48px, 0 at 24px
- **Role:** All display and heading text from sub-heading through display — a custom contemporary serif with distinctive flared terminals. Used at weight 400 across every size, never bolded; negative letter-spacing tightens large sizes (ls=-0.037em at 54px, -0.021em at 48px). Substitute: "Noto Serif", Georgia, serif.

### Geist — Body, nav, buttons, and all UI chrome — a neutral grotesque that stays out of the serif's way. Weight 500 is reserved for nav and button labels that need a half-step of emphasis. Default letter-spacing -0.01em gives crispness at small sizes. Substitute: "Inter", system-ui, sans-serif. · `--font-geist`
- **Substitute:** Inter, system-ui, sans-serif
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 18px, 20px
- **Line height:** 1.00, 1.50
- **Letter spacing:** -0.01em uniform
- **Role:** Body, nav, buttons, and all UI chrome — a neutral grotesque that stays out of the serif's way. Weight 500 is reserved for nav and button labels that need a half-step of emphasis. Default letter-spacing -0.01em gives crispness at small sizes. Substitute: "Inter", system-ui, sans-serif.

### Geist Mono — Section numbering labels, eyebrows, metadata, and the "05 · FAQ" style markers — always uppercase, tracked at 0.06–0.1em, the only text that announces itself through tracking rather than weight. Substitute: "JetBrains Mono", ui-monospace, monospace. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, ui-monospace, monospace
- **Weights:** 400
- **Sizes:** 10px, 11px
- **Line height:** 1.20, 1.50
- **Letter spacing:** 0.06em at 11px, 0.1em at 10px
- **OpenType features:** `"tnum" on`
- **Role:** Section numbering labels, eyebrows, metadata, and the "05 · FAQ" style markers — always uppercase, tracked at 0.06–0.1em, the only text that announces itself through tracking rather than weight. Substitute: "JetBrains Mono", ui-monospace, monospace.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 1px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 36px | 1.1 | — | `--text-heading` |
| heading-lg | 48px | 1.1 | -1.008px | `--text-heading-lg` |
| display | 54px | 1.1 | -1.998px | `--text-display` |

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
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| buttons | 9999px |
| nav-capsule | 82px |
| pills-large | 999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.08) 0px 0px 10px 0px inset` | `--shadow-md` |
| md-2 | `rgba(0, 0, 0, 0.08) 0px 1px 10px 0px inset` | `--shadow-md-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Dark Pill Button
**Role:** Primary action CTA — the only filled button in the system

Background #1a1614, text #f4f4e7, full-pill radius 9999px, padding 12.5px vertical / 24.5px horizontal, font Geist 14px weight 500. The warm dark fill on warm cream paper reads as confident rather than aggressive. Used for "Book a demo" and primary conversions. Never appears more than once per viewport.

### Ghost Outlined Button
**Role:** Secondary action — paired with the dark pill to create contrast without competing for attention

Transparent background, border 1px solid in current text color at 92% opacity (#1a1614 at 0.92), text #1a1614, radius 0px (rectangular not pill), padding 24px on all sides, Geist 14px weight 500. The sharp corners deliberately contrast the pill's softness, making the two-button pair read as a typographic rhythm rather than a hierarchy of importance.

### Liquid-Glass Navigation Capsule
**Role:** Sticky top navigation with backdrop-filter blur

Floating pill shape with radius 82px, backdrop-filter blur(8–24px) saturate(1.75–1.8) brightness(1.1), semi-transparent fill #cfcfc8bd, inset shadow rgba(0,0,0,0.08) 0 0 10px 0 for depth, 1px hairline border. Internal layout: left-aligned secondary links, centered wordmark with antimetallic icon glyph, right-aligned sign-in + dark pill CTA. Sits over content with visible refraction.

### FAQ Accordion Row
**Role:** Expandable question/answer list

Background #f7f6f3, no radius, padding 20–24px vertical, 1px dashed border on all sides at #1a1614 10% opacity (the dashed hairline is the signature separator style). Question text in Test Signifier 24px weight 400, plus icon right-aligned in Bistre. Expanded state reveals body copy in Geist 16px below the dashed divider.

### Section Header with Monospace Marker
**Role:** Editorial section opener — every major section is numbered and labeled

Two-line composition: top line is "05 · FAQ" or "06 · STAY UP TO DATE" in Geist Mono 10–11px uppercase, letter-spacing 0.1em, color #66635f. Below, the section heading in Test Signifier 36–48px weight 400 in Bistre. A short descriptor paragraph in Geist 20px color #66635f sits beside the heading in a two-column layout for the FAQ section.

### Drop Cap Body Paragraph
**Role:** Long-form editorial content block

First letter of the first paragraph rendered as a large outlined initial cap in Test Signifier at roughly 2.2x the body size, positioned with negative margin to overlap the line above. Body text in Geist 16px line-height 1.5 color Bistre. Used for the "Production engineering, as practiced today…" essay block. Creates a magazine-article cadence uncommon in tech product sites.

### Pull Quote Block
**Role:** Featured testimonial or key statement

Large quote in Test Signifier 36–48px weight 400 with curly opening quote " above, attribution below in Geist 14px — name in Bistre, role/company in Graphite. Quote marks are typographic, not glyphs. Paired with a video thumbnail on the left in a two-column layout. No background, no border — floats in the cream space.

### Video Thumbnail Card
**Role:** Embedded video player surface

Rectangular video still with a centered circular play button (cream fill, dark triangle icon) overlaid. Duration timestamp "2:07" in a small dark pill (#2a2724 background, cream text) bottom-left, brand mark bottom-right. No border or radius beyond a small 4px clip on the timestamp chip. Photographic content is high-contrast with desaturated tones to match the achromatic system.

### Research Log Entry
**Role:** Blog or research post row in a list

Single-line entry with post title in Test Signifier 24px color Bistre, metadata in Geist Mono 10px uppercase tracked: date, author, read time. Title is the link; hover shifts color to Graphite. Separated from neighbors by 1px dashed #1a1614 10% border. Compressed, text-forward, no thumbnails — the list reads like a table of contents.

### Network Visualization Graphic
**Role:** Decorative hero illustration — a dandelion/constellation of connected nodes

Radiating lines from a single center point terminating in small filled circles in four colors: Bistre black, Chartreuse yellow, warm orange (#f59e3a), and olive (#9a9d3e). Lines drawn in Flint at 0.3–0.5px. No animation by default. Occupies the right half of the hero on desktop, sits below headline on mobile. Functions as the only multi-color element on the page.

### View All Outlined Button
**Role:** Tertiary navigation action at section end

Rectangular with 1px solid border in Bistre, Geist 14px weight 500, padding 12px 24px, radius 0. Sits right-aligned in section footers. Subordinate to the dark pill and ghost outlined button — it is the quietest of the three button treatments and never appears in the hero.

## Do's and Don'ts

### Do
- Set all headings in Test Signifier weight 400 — never bold the serif, the entire brand identity depends on the quiet authority of regular weight doing display work.
- Use 1px dashed borders in #1a1614 at 10% opacity for all dividers and accordion separators; solid lines are reserved for button outlines and the nav capsule.
- Pair every primary CTA (dark pill) with a secondary ghost outlined button; never let the dark pill stand alone in a button group.
- Number every major section with a Geist Mono 10–11px uppercase marker at letter-spacing 0.1em in #66635f, format as "05 · SECTION NAME".
- Keep the canvas at #d7d7d0 (warm gray) and surfaces at #f7f6f3 (cream); never use pure white or pure black — the warm cast is the signature.
- Reserve chartreuse #e2e67d for single-element accents (one badge, one highlight, one dot); it must never appear as a fill on large surfaces.
- Use the 82px pill radius for the navigation capsule and 9999px for buttons; cards and dividers stay rectangular at 0–4px.

### Don't
- Do not bold any heading — Test Signifier at weight 400 is non-negotiable; introducing 600/700 destroys the editorial register.
- Do not use solid borders for content separators; dashed 1px is the only hairline treatment allowed inside the page.
- Do not place more than one filled dark button per viewport; the dark pill loses authority when repeated.
- Do not introduce saturated blue, red, or green for buttons or alerts; the only chromatic color is the desaturated chartreuse accent.
- Do not use drop shadows on cards or content blocks; depth is achieved through the liquid-glass nav and warm-gray layering only.
- Do not set body text in the serif — Geist handles all body, nav, and UI; the serif is display-only.
- Do not use the network/dandelion graphic in contexts other than the hero; it is a singular signature, not a reusable pattern.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#d7d7d0` | Base page background, the warm gray field that everything sits on |
| 1 | Cream Surface | `#f7f6f3` | Content cards, FAQ rows, pull-quote backgrounds — the standard elevated surface |
| 2 | Bone Card | `#fdfcfa` | Lightest surface for content that needs to feel slightly above the cream layer |
| 3 | Quill Line | `#e3e3de` | Hairline borders, ghost button backgrounds, nav capsule resting fill |

## Elevation

Depth is created through warm-gray surface layering and the liquid-glass navigation, never through drop shadows. The only shadows in the system are the inset rgba(0,0,0,0.08) glows on the nav capsule that simulate refraction. Content blocks are flat; separation is communicated by background color shifts and dashed hairlines, not by elevation.

## Imagery

Minimal photographic content. The hero pairs text with a single decorative graphic — a radial network/dandelion of colored dots (black, chartreuse, warm orange, olive) connected by fine lines to a single center point, representing autonomous agents radiating from a system. Video content appears as dark, high-contrast thumbnails with a centered cream play button. The Google logo in the testimonial is rendered as a grayscale image. No lifestyle photography, no product screenshots, no 3D renders. The page is 90% typography and white space; when imagery appears it is either the signature network graphic or a single video frame.

## Layout

Max-width ~1200px centered content with full-bleed warm-gray sections. The hero is a two-column split: headline + subtext + button pair on the left (60% width), network visualization on the right (40%). Below the hero, sections alternate between cream and parchment backgrounds with generous 120px vertical gaps. Section openers use a two-column header: serif heading left, short descriptor right. Content blocks are either two-column (text + media) or single-column centered. The FAQ uses a full-width accordion constrained to the content max-width. The research log is a single-column text list. Navigation is a floating liquid-glass capsule centered at the top, not a full-width bar. Buttons are always paired (filled + ghost) and never stacked alone.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #1a1614
- text secondary: #66635f
- background canvas: #d7d7d0
- background surface: #f7f6f3
- border hairline: #1a1614 at 10% opacity (dashed)
- accent: #e2e67d
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a hero section: canvas #d7d7d0, left column has headline "Your headline here" in Test Signifier 54px weight 400 color #1a1614 letter-spacing -1.998px, subtext in Geist 20px line-height 1.5 color #66635f, and a button pair (dark pill #1a1614 fill #f4f4e7 text radius 9999px padding 12.5px 24.5px, plus ghost outlined button 1px solid #1a1614 at 92% radius 0 padding 24px). Right column has the network dandelion graphic — thin lines from one center point to 40+ small filled circles in #1a1614, #e2e67d, warm orange, and olive.

2. Build an FAQ accordion: cream surface #f7f6f3, 1px dashed border #1a1614 at 10% opacity on all sides, no radius, padding 24px vertical. Question text in Test Signifier 24px weight 400 #1a1614, plus icon right-aligned. Section opens with a Geist Mono 10px uppercase marker "05 · FAQ" in #66635f letter-spacing 1px, then a Test Signifier 48px weight 400 heading in #1a1614, with a Geist 20px descriptor in #66635f in a two-column header.

3. Build a pull quote block: no background, large curly quote mark above, quote text in Test Signifier 36px weight 400 #1a1614, attribution in Geist 14px — name in #1a1614, role in #66635f. Pair it with a dark video thumbnail on the left with a centered circular cream play button and a "2:07" timestamp chip in #2a2724 at bottom-left.

4. Build a research log entry row: 1px dashed bottom border #1a1614 at 10% opacity, padding 20px vertical, title in Test Signifier 24px weight 400 #1a1614, metadata prefix in Geist Mono 10px uppercase tracked 1px #66635f reading "04/16/2026" and author + read time, separator dot in Geist 16px #66635f.

5. Build the navigation capsule: floating pill with 82px radius, backdrop-filter blur(12px) saturate(1.75), semi-transparent fill #cfcfc8bd, inset shadow rgba(0,0,0,0.08) 0 0 10px 0, 1px hairline border. Left: nav links in Geist 14px weight 500 #1a1614. Center: wordmark with small icon. Right: "Sign In" text link in Geist 14px + dark pill button #1a1614 fill #f4f4e7 text radius 9999px.

## Motion & Glass Philosophy

Antimetal's motion is restrained but expressive: 0.15–0.3s durations with cubic-bezier(0.4, 0, 0.2, 1) easing on color, background, border, and stroke transitions. The signature glass effect uses layered backdrop-filter: blur(8–24px) saturate(1.75–1.8) brightness(1.1) combined with an SVG liquid-glass filter for refraction. A single 'pulse' animation runs on the network graphic's center point. Longer 0.6–0.7s eases with cubic-bezier(0.22, 1, 0.36, 1) handle entrance animations on scroll. Never use linear easing; never animate layout properties.

## Editorial Conventions

Antimetal treats every page like a printed research document. Specific conventions: section numbering as monospace eyebrows ("05 · FAQ"), drop caps on first paragraphs of long-form blocks, curly typographic quote marks (not straight), en-dashes in metadata, and dashed 1px hairlines as the sole separator style. The Test Signifier serif is set with negative letter-spacing at all sizes above 24px (-0.021em at 48px, -0.037em at 54px) — this tightens the serif's natural rhythm and keeps large headlines from feeling loose or decorative.

## Similar Brands

- **Linear** — Same cream/gray paper feel, same generous whitespace, same restraint in UI chrome — though Linear is more geometric and Antimetal is more editorial
- **Anthropic** — Same custom serif for headlines at weight 400, same warm neutral palette, same quiet authority through typographic restraint rather than visual volume
- **Stripe** — Same editorial use of serif type for technical product marketing, same dashed-border detail treatment, same warm off-white surfaces
- **Felt** — Same warm gray canvas with cream surfaces, same pill-shaped navigation, same approach of letting typography carry the brand rather than color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #d7d7d0;
  --color-cream: #f7f6f3;
  --color-bone: #fdfcfa;
  --color-bistre: #1a1614;
  --color-graphite: #66635f;
  --color-flint: #a8a7a1;
  --color-slate: #53504c;
  --color-ash: #2a2724;
  --color-quill: #e3e3de;
  --color-chartreuse-whisper: #e2e67d;

  /* Typography — Font Families */
  --font-test-signifier: 'Test Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.008px;
  --text-display: 54px;
  --leading-display: 1.1;
  --tracking-display: -1.998px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 82px;
  --radius-full-2: 999px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-buttons: 9999px;
  --radius-nav-capsule: 82px;
  --radius-pills-large: 999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 0px 10px 0px inset;
  --shadow-md-2: rgba(0, 0, 0, 0.08) 0px 1px 10px 0px inset;

  /* Surfaces */
  --surface-parchment-canvas: #d7d7d0;
  --surface-cream-surface: #f7f6f3;
  --surface-bone-card: #fdfcfa;
  --surface-quill-line: #e3e3de;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #d7d7d0;
  --color-cream: #f7f6f3;
  --color-bone: #fdfcfa;
  --color-bistre: #1a1614;
  --color-graphite: #66635f;
  --color-flint: #a8a7a1;
  --color-slate: #53504c;
  --color-ash: #2a2724;
  --color-quill: #e3e3de;
  --color-chartreuse-whisper: #e2e67d;

  /* Typography */
  --font-test-signifier: 'Test Signifier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.008px;
  --text-display: 54px;
  --leading-display: 1.1;
  --tracking-display: -1.998px;

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
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 82px;
  --radius-full-2: 999px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 0px 10px 0px inset;
  --shadow-md-2: rgba(0, 0, 0, 0.08) 0px 1px 10px 0px inset;
}
```
