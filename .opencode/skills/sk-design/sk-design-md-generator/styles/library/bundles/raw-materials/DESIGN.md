# Raw Materials — Style Reference
> brutalist editorial on warm cream

**Theme:** light

Raw Materials operates as a typographic maximalist system: a warm cream canvas carrying display type that regularly exceeds 200px, with every major surface element given its own vivid color identity. The system abandons a single brand color in favor of seven section-marker hues (orange, violet, ink, cobalt, crimson, yellow, green) that label navigation and content blocks alike, creating a zine-like rhythm where the color tells you which chapter you're in. Surfaces are flat and rounded at 16px — no shadows, no gradients, no elevation. Typography does all the hierarchy work, jumping from 12px captions to 259px display headlines with a cast of four custom typefaces, all sharing the "ss02" stylistic alternate.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff3d00` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis |
| Pulse Violet | `#5900cc` | `--color-pulse-violet` | Violet supporting accent for decorative details and low-frequency emphasis. |
| Cobalt Blue | `#2835f8` | `--color-cobalt-blue` | Violet supporting accent for decorative details and low-frequency emphasis. |
| Crimson | `#ff003d` | `--color-crimson` | Red supporting accent for decorative details and low-frequency emphasis |
| Caution Yellow | `#ffff00` | `--color-caution-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis. |
| Voltage Green | `#05ff00` | `--color-voltage-green` | Green supporting accent for decorative details and low-frequency emphasis |
| Electric Blue | `#1b73e6` | `--color-electric-blue` | Headings and body text on cream, mid-saturation blue used in content |
| Sky Cyan | `#00c2ff` | `--color-sky-cyan` | Headings and accent text, cool counterpoint to warm cream |
| Forest | `#008163` | `--color-forest` | Card fills, moderate green for body-level content blocks |
| Lime Pulse | `linear-gradient(rgba(0, 0, 0, 0) calc(100% - 1px), rgb(62, 234, 90))` | `--color-lime-pulse` | Headings and body, brighter green counterpart to Voltage; Green supporting accent for decorative details and low-frequency emphasis |
| Tangerine | `#ff5c00` | `--color-tangerine` | Card fills, warm orange variant for content blocks |
| Signal Red | `#ee2526` | `--color-signal-red` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Ink | `#0e0e0e` | `--color-ink` | Dark supporting neutral for text, icons, and strong contrast. |
| Bone Cream | `#f4e9e1` | `--color-bone-cream` | Primary page canvas, nav text on color blocks, card surface |
| Paper White | `#ffffff` | `--color-paper-white` | Active nav card, elevated card surface, input fields |
| Charcoal | `#242320` | `--color-charcoal` | Dark surface fill, image overlays, secondary text on light |
| Sage | `#cee4cd` | `--color-sage` | Tinted section background, warm green wash |
| Blush | `#e4d0cd` | `--color-blush` | Tinted section background, warm pink wash |
| Sand | `#e7e4d0` | `--color-sand` | Tinted section background, warm yellow wash, card fill |
| Sky Tint | `#cddae4` | `--color-sky-tint` | Tinted section background, cool blue wash, image-related surfaces |
| Celadon | `#ddded3` | `--color-celadon` | Tinted section background, muted green wash |
| Olive Slate | `#444639` | `--color-olive-slate` | Dark olive section background, secondary text |
| Forest Slate | `#374936` | `--color-forest-slate` | Dark green section background, heading text on light |
| Cocoa Slate | `#4a3937` | `--color-cocoa-slate` | Dark warm section background, heading text on light |
| Plum Slate | `#493648` | `--color-plum-slate` | Dark purple section background, heading text on light |

## Tokens — Typography

### StabilGrotesk — Workhorse — every nav label, body text, button, badge, card label, and sub-heading up to 46px. The only font that touches interactive UI · `--font-stabilgrotesk`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 100, 400, 500
- **Sizes:** 12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 24, 28, 29, 32, 40, 46
- **Line height:** 1.20–1.38
- **Letter spacing:** -0.05em at 12px, -0.02em at 18-24px, -0.01em at 32-46px
- **OpenType features:** `"ss02"`
- **Role:** Workhorse — every nav label, body text, button, badge, card label, and sub-heading up to 46px. The only font that touches interactive UI

### Optimistic Text — Large display headlines at 80-193px, sometimes body pull-quote at 23px · `--font-optimistic-text`
- **Substitute:** Söhne Breit, GT Walsheim, Inter Display
- **Weights:** 100, 400, 700
- **Sizes:** 18, 23, 80, 95, 193
- **Line height:** 1.00–1.38
- **Letter spacing:** -0.04em at 80-95px, -0.03em at 23px, +0.112em when uppercase
- **OpenType features:** `"ss02"`
- **Role:** Large display headlines at 80-193px, sometimes body pull-quote at 23px

### KlarheitKurrent — The largest display voice — 200-259px hero type, also mid-size editorial headings at 79-107px · `--font-klarheitkurrent`
- **Substitute:** Söhne Schmal, ABC Diatype Mono, GT America Mono
- **Weights:** 400, 500
- **Sizes:** 20, 40, 79, 107, 200, 259
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.04em at 107-200px, -0.02em at 79px
- **OpenType features:** `"ss02"`
- **Role:** The largest display voice — 200-259px hero type, also mid-size editorial headings at 79-107px

### HTQ-Waldenburg-FettSchmal — Narrow bold display for compressed-impact headlines, the only font using "case" feature · `--font-htq-waldenburg-fettschmal`
- **Substitute:** Druk Condensed, Maison Neue Extended Bold
- **Weights:** 500, 700
- **Sizes:** 95, 193
- **Line height:** 1.00–1.06
- **Letter spacing:** -0.021em at 95px, -0.002em at 193px
- **OpenType features:** `"case", "ss02"`
- **Role:** Narrow bold display for compressed-impact headlines, the only font using "case" feature

### RightGrotesk — Bold geometric display for 199px poster-scale headlines · `--font-rightgrotesk`
- **Substitute:** Inter Black, GT America Black, Söhne Breit Halbfett
- **Weights:** 700
- **Sizes:** 98, 199
- **Line height:** 1.00–1.14
- **Letter spacing:** -0.02em at 199px, -0.01em at 98px
- **OpenType features:** `"ss02"`
- **Role:** Bold geometric display for 199px poster-scale headlines

### Moderat — Wide-tracked display — the +0.084em tracking is a signature, used for all-caps subhead labels · `--font-moderat`
- **Substitute:** Söhne Breit, GT America Expanded, Neue Haas Grotesk Display
- **Weights:** 400
- **Sizes:** 24, 120
- **Line height:** 1.00–1.20
- **Letter spacing:** +0.084em at 120px all-caps, -0.01em at 24px
- **OpenType features:** `"ss02"`
- **Role:** Wide-tracked display — the +0.084em tracking is a signature, used for all-caps subhead labels

### Courier New — Monospaced system fallback for data tables, tiny index numbers · `--font-courier-new`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14
- **Line height:** 1.00
- **Letter spacing:** -0.07em at 14px
- **OpenType features:** `"ss02"`
- **Role:** Monospaced system fallback for data tables, tiny index numbers

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.38 | -0.6px | `--text-caption` |
| body-sm | 14px | 1.38 | -0.7px | `--text-body-sm` |
| body | 16px | 1.38 | -0.32px | `--text-body` |
| subheading | 20px | 1.2 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 32px | 1.17 | -0.32px | `--text-heading` |
| heading-lg | 46px | 1.14 | -0.46px | `--text-heading-lg` |
| display | 100px | 1.03 | -1px | `--text-display` |
| display-lg | 200px | 1 | -2px | `--text-display-lg` |
| display-xl | 259px | 1 | -10.36px | `--text-display-xl` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 232 | 232px | `--spacing-232` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 99px |
| badges | 24px |
| images | 16px |
| buttons | 16px |
| nav-blocks | 16px |
| display-shapes | 187px |

### Layout

- **Section gap:** 48-80px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Numbered Section Nav Card
**Role:** Primary navigation — each card labels a page section with its index number and title

Vivid solid-fill card, 16px radius, full width of sidebar (~150px). Two-line layout: tiny '00'–'07' index number in Bone Cream (#f4e9e1) at 12-13px StabilGrotesk 400, then the section label in Bone Cream at 16-18px StabilGrotesk 400. Padding 12-16px vertical, 16px horizontal. One card per section color: Ember Orange, Pulse Violet, Ink, Cobalt Blue, Crimson, Caution Yellow, Voltage Green.

### Active Section Nav Card
**Role:** Indicates the section currently in viewport

Same 16px-radius dimensions as a Numbered Section Nav Card, but filled Paper White (#ffffff) with Ink (#0e0e0e) text. The color inversion reads as 'you are here' without needing an underline or dot indicator.

### Display Headline
**Role:** Section hero type — the dominant visual on every page section

100-259px using KlarheitKurrent 400-500 or RightGrotesk 700. Ink (#0e0e0e) on cream, or Bone Cream on a color block. Line-height locked to 1.00-1.03 — the type touches itself. Letter-spacing -0.02em to -0.04em at display sizes. No max-width constraint; type bleeds to the container edge or wraps to 2-3 lines.

### Page Header
**Role:** Persistent top bar — brand identity and tagline

Full-width, sits on the cream canvas with ~24px padding. Left: 'Raw Materials' at 17-18px StabilGrotesk 400 in Ink. Right: 'An Unusual Design Company' in the same size and weight, Ink. No logo mark — the wordmark IS the logo. No border, no background fill — type sits directly on cream.

### Scroll Progress Bar
**Role:** Bottom-of-viewport reading progress indicator

Full-width Ember Orange (#ff3d00) bar, 4-6px tall, fixed to viewport bottom. Fills left-to-right as the user scrolls. Also includes a tiny '01/01' section counter in Ink at 12px StabilGrotesk on the right edge.

### Color Block Content Card
**Role:** Content containers in Work, Talent, and case-study sections

Full-saturation fill in one of the accent colors or dark slates, 16px radius, 24px padding. Content inside is Bone Cream or Paper White type at 16-18px StabilGrotesk 400. No shadow, no border. Often used as a 2-column or 3-column grid element.

### Tinted Section Background
**Role:** Alternating full-bleed section backgrounds between content blocks

Full viewport-width band in one of the five warm washes: Sage (#cee4cd), Blush (#e4d0cd), Sand (#e7e4d0), Sky (#cddae4), or Celadon (#ddded3). No border between sections — the color shift itself is the divider. 48-80px vertical padding. Type inside is Ink.

### Pill Tag
**Role:** Category labels, skill tags, metadata

99.36px radius (full pill), 6-8px vertical padding, 12-16px horizontal. Filled with a section color or Ink, text in Bone Cream or Paper White at 12-13px StabilGrotesk 400.

### Rounded Badge
**Role:** Index numbers, status indicators, small annotations

24px radius (slightly more than fully rounded at small sizes), 4-8px padding. Filled with a section accent color. Text at 12px StabilGrotesk 400 in Bone Cream or Paper White.

### Image Frame
**Role:** Container for photography in Work and Talent sections

16px radius, no border, no shadow. Image fills the frame edge-to-edge. Sits on cream canvas or inside a Color Block Content Card.

### Ghost Button
**Role:** Secondary action — 'Read more', 'View project', section transitions

Transparent fill, 1.5-2px Ink border (#0e0e0e), 16px radius, 12px 20px padding. Text at 16px StabilGrotesk 400 in Ink. No fill on hover — instead the border thickens to 3px. This is the system default; filled colored buttons only appear in nav.

### Body Text Block
**Role:** Paragraph content, descriptions, bios

StabilGrotesk 400, 16-18px, line-height 1.38, Ink (#0e0e0e) on cream, or Bone Cream on dark/colored surfaces. Max reading width ~640px even though the container is wider — text doesn't stretch full-bleed.

### Section Index Header
**Role:** Small marker above each section — '01', '02', etc.

12-14px StabilGrotesk 400 in Ink or Bone Cream, letter-spacing -0.05em. Sits above a display headline, left-aligned, with 8px gap to the headline.

### Link Inline
**Role:** Inline text links within body copy

StabilGrotesk 400 at body size, Ink with a 1px Ink underline. On hover: text color shifts to the accent color of the current section. No color-only differentiation — always underlined.

## Do's and Don'ts

### Do
- Use StabilGrotesk for every interactive element and any type below 80px — it's the only font that touches UI controls
- Set all type to feature-settings: 'ss02' — this stylistic alternate is applied to every font on the site and is part of the visual identity
- Lock display headlines to line-height 1.00-1.03 so the type touches itself vertically
- Use 16px radius for all cards, buttons, images, and nav blocks — never mix in 8px or 4px corners
- Assign each page section one of the seven nav colors and carry that color into its content blocks, badges, and accent type
- Let display headlines bleed past their container — do not constrain them to a max-width
- Alternate between cream canvas and one of the five warm tinted backgrounds (Sage, Blush, Sand, Sky, Celadon) to create section rhythm

### Don't
- Don't add drop-shadows, inner-shadows, or any blur effects — the system is entirely flat
- Don't use a single 'primary' brand color for CTAs — buttons inherit their section's accent color
- Don't set body text below 16px or above 20px — the body range is tight by design
- Don't apply letter-spacing wider than +0.01em to body or subheading text — only the +0.084em Moderat all-caps labels and +0.112em Optimistic uppercase use wide tracking
- Don't introduce a new color outside the seven nav hues and the five tinted washes — the palette is deliberately finite
- Don't use rounded corners smaller than 16px on any container — 4px or 8px corners will read as a different system
- Don't place display headlines centered on the canvas — they are always left-aligned and bleed right

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Cream Canvas | `#f4e9e1` | Primary page background, the warm paper that everything sits on |
| 1 | Paper White | `#ffffff` | Elevated card surfaces, active nav state, input fields |
| 2 | Tinted Washes | `#cee4cd` | Alternating colored section backgrounds — Sage, Blush, Sand, Sky Tint, Celadon — one tint per content block |
| 3 | Saturated Color Blocks | `#ff3d00` | Full-saturation nav cards and content blocks using the seven section colors |
| 4 | Dark Slates | `#444639` | Dark sections with hue-tinted darks — Olive, Forest, Cocoa, Plum |

## Elevation

No shadows. The system is entirely flat — depth comes from color contrast, not blur or offset. Color blocks sit directly on the cream canvas with zero shadow. Rounded corners (16px) and color saturation do all the work that drop-shadows would do in a conventional system.

## Imagery

Primarily typographic and color-block-based — the system treats massive display type itself as the dominant visual. When photography appears (in Work, Talent, Careers sections), it is contained in 16px-radius frames on the cream canvas, never full-bleed, and never given a shadow. No illustrations, no 3D, no decorative graphics — the seven section colors and the display type ARE the visual identity. Iconography is minimal to absent; when present, it is a single-color flat glyph at 16-24px. Image-to-text ratio is low: text dominates, images serve as proof points within color blocks.

## Layout

Full-bleed layout with no max-width constraint. A fixed left sidebar (~160px) holds the seven numbered section nav cards stacked vertically, each card a different vivid color. The main content area fills the remaining viewport with the warm cream canvas. The hero is a single oversized display headline (200-259px) that bleeds past its container — the type IS the hero, not a background image. A bottom progress bar (Ember Orange) spans the full viewport width. Sections alternate between cream canvas and one of five warm tinted backgrounds (Sage, Blush, Sand, Sky, Celadon) or one of four dark slates, creating a zine-like chapter rhythm. The page model is asymmetric: the sidebar is a permanent anchor while content flows full-width to the right edge.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0e0e0e (Ink)
- background: #f4e9e1 (Bone Cream)
- border: #0e0e0e at 1-1.5px
- accent: section-dependent (Ember Orange #ff3d00, Pulse Violet #5900cc, Cobalt Blue #2835f8, Crimson #ff003d, Caution Yellow #ffff00, Voltage Green #05ff00)
- card surface: #ffffff (Paper White)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Numbered Section Nav Card**: 150px wide, 16px border-radius, fill #ff3d00. Two lines: '01' at 12px StabilGrotesk 400 in #f4e9e1, then 'Hello' at 18px StabilGrotesk 400 in #f4e9e1. 16px horizontal padding, 12px vertical. No shadow.

2. **Display Headline**: 'We are Raw Materials' at 200px KlarheitKurrent 400, #0e0e0e, line-height 1.00, letter-spacing -4px, feature-settings 'ss02'. No max-width — type bleeds right.

3. **Scroll Progress Bar**: Full viewport width, 4px tall, fixed to bottom. Fill #ff3d00. Grows left-to-right with scroll position.

4. **Tinted Section Background**: Full-width band, 80px vertical padding, background #cee4cd (Sage). Contains a 24px StabilGrotesk 400 subheading in #0e0e0e, then 18px body in #0e0e0e at line-height 1.38, max-width 640px.

5. **Ghost Button**: 16px border-radius, 1.5px border #0e0e0e, transparent fill, 12px 20px padding. Text 'View project' at 16px StabilGrotesk 400 in #0e0e0e. On hover: border thickens to 3px, no fill change.

## Color System Logic

The palette is not decorative — it is functional. The seven section colors (Ember Orange, Pulse Violet, Ink, Cobalt Blue, Crimson, Caution Yellow, Voltage Green) map 1:1 to the numbered navigation, so color tells the user which chapter of the site they are in at all times. The five warm tinted washes (Sage, Blush, Sand, Sky, Celadon) are the same idea at lower saturation: they create alternating section backgrounds without introducing new hues. Dark sections use a parallel set of hue-tinted darks (Olive, Forest, Cocoa, Plum) — never pure black, always carrying a subtle color. Every other color on the site is either a variant of one of these, or a one-off illustration color that should not be added to the system.

## Type System Logic

Four display fonts (Optimistic Text, KlarheitKurrent, HTQ-Waldenburg, RightGrotesk) compete at 95-259px — they are NEVER used below 80px, and StabilGrotesk is NEVER used above 46px. This hard split is the system: StabilGrotesk does UI, the display fonts do poster-scale. All five custom fonts share the 'ss02' stylistic alternate, which means the alternate glyph forms are part of the brand voice, not a hidden detail. The Moderat font is reserved for wide-tracked all-caps labels (+0.084em) and is the only font that uses positive letter-spacing meaningfully — it acts as a label/caption voice at display scale.

## Similar Brands

- **Pentagram** — Same maximalist agency approach where each project gets its own typographic identity, with massive display type and bold color blocks on neutral canvases
- **DIA Studio** — Same warm cream/neutral canvas with oversized editorial type and section-by-section color shifts; similar Swiss-poster-meets-zine DNA
- **Locomotive (Montreal)** — Same flat-design agency aesthetic with vivid accent colors on muted warm backgrounds and strong typographic hierarchy
- **Studio Dumbar** — Same Dutch-design confidence in treating type as the primary visual element, with flat surfaces, saturated color blocks, and no decorative shadows
- **Order Design** — Same numbered-section navigation pattern and warm-paper canvas with bold display type, though with a slightly more restrained color palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff3d00;
  --color-pulse-violet: #5900cc;
  --color-cobalt-blue: #2835f8;
  --color-crimson: #ff003d;
  --color-caution-yellow: #ffff00;
  --color-voltage-green: #05ff00;
  --color-electric-blue: #1b73e6;
  --color-sky-cyan: #00c2ff;
  --color-forest: #008163;
  --color-lime-pulse: #3eea5a;
  --gradient-lime-pulse: linear-gradient(rgba(0, 0, 0, 0) calc(100% - 1px), rgb(62, 234, 90));
  --color-tangerine: #ff5c00;
  --color-signal-red: #ee2526;
  --color-ink: #0e0e0e;
  --color-bone-cream: #f4e9e1;
  --color-paper-white: #ffffff;
  --color-charcoal: #242320;
  --color-sage: #cee4cd;
  --color-blush: #e4d0cd;
  --color-sand: #e7e4d0;
  --color-sky-tint: #cddae4;
  --color-celadon: #ddded3;
  --color-olive-slate: #444639;
  --color-forest-slate: #374936;
  --color-cocoa-slate: #4a3937;
  --color-plum-slate: #493648;

  /* Typography — Font Families */
  --font-stabilgrotesk: 'StabilGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-optimistic-text: 'Optimistic Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-klarheitkurrent: 'KlarheitKurrent', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-htq-waldenburg-fettschmal: 'HTQ-Waldenburg-FettSchmal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rightgrotesk: 'RightGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-courier-new: 'Courier New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --tracking-caption: -0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --tracking-body-sm: -0.7px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.17;
  --tracking-heading: -0.32px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.46px;
  --text-display: 100px;
  --leading-display: 1.03;
  --tracking-display: -1px;
  --text-display-lg: 200px;
  --leading-display-lg: 1;
  --tracking-display-lg: -2px;
  --text-display-xl: 259px;
  --leading-display-xl: 1;
  --tracking-display-xl: -10.36px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-232: 232px;

  /* Layout */
  --section-gap: 48-80px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20.88px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40.32px;
  --radius-3xl-4: 44px;
  --radius-full: 64px;
  --radius-full-2: 99.36px;
  --radius-full-3: 187.2px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 99px;
  --radius-badges: 24px;
  --radius-images: 16px;
  --radius-buttons: 16px;
  --radius-nav-blocks: 16px;
  --radius-display-shapes: 187px;

  /* Surfaces */
  --surface-bone-cream-canvas: #f4e9e1;
  --surface-paper-white: #ffffff;
  --surface-tinted-washes: #cee4cd;
  --surface-saturated-color-blocks: #ff3d00;
  --surface-dark-slates: #444639;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff3d00;
  --color-pulse-violet: #5900cc;
  --color-cobalt-blue: #2835f8;
  --color-crimson: #ff003d;
  --color-caution-yellow: #ffff00;
  --color-voltage-green: #05ff00;
  --color-electric-blue: #1b73e6;
  --color-sky-cyan: #00c2ff;
  --color-forest: #008163;
  --color-lime-pulse: #3eea5a;
  --color-tangerine: #ff5c00;
  --color-signal-red: #ee2526;
  --color-ink: #0e0e0e;
  --color-bone-cream: #f4e9e1;
  --color-paper-white: #ffffff;
  --color-charcoal: #242320;
  --color-sage: #cee4cd;
  --color-blush: #e4d0cd;
  --color-sand: #e7e4d0;
  --color-sky-tint: #cddae4;
  --color-celadon: #ddded3;
  --color-olive-slate: #444639;
  --color-forest-slate: #374936;
  --color-cocoa-slate: #4a3937;
  --color-plum-slate: #493648;

  /* Typography */
  --font-stabilgrotesk: 'StabilGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-optimistic-text: 'Optimistic Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-klarheitkurrent: 'KlarheitKurrent', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-htq-waldenburg-fettschmal: 'HTQ-Waldenburg-FettSchmal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rightgrotesk: 'RightGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-courier-new: 'Courier New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --tracking-caption: -0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --tracking-body-sm: -0.7px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.17;
  --tracking-heading: -0.32px;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.46px;
  --text-display: 100px;
  --leading-display: 1.03;
  --tracking-display: -1px;
  --text-display-lg: 200px;
  --leading-display-lg: 1;
  --tracking-display-lg: -2px;
  --text-display-xl: 259px;
  --leading-display-xl: 1;
  --tracking-display-xl: -10.36px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-232: 232px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20.88px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40.32px;
  --radius-3xl-4: 44px;
  --radius-full: 64px;
  --radius-full-2: 99.36px;
  --radius-full-3: 187.2px;
}
```
