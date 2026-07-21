# ldd — Style Reference
> Dot-matrix broadsheet on cream paper — a single sheet of warm stock, overprinted once with massive black type and nothing else.

**Theme:** light

A two-color broadsheet: warm cream canvas (#fffcf0), near-black ink (#000310) with a faint blue undertone, and zero decoration. Drama is generated entirely by scale — a custom 135px display face (LDD) with dot-matrix character treatments fights against a tiny neo-grotesque body face (NeueMontreal at 12–16px, line-height 1.0) for the screen's attention. The interface behaves less like a website and more like a printed zine: horizontal rules divide the page, oversized section numbers (01, 04) punctuate the rhythm, and a labeled scroll-progress bar (Scroll / To / Discover) replaces all conventional CTAs. 200px margins between sections create gallery-hung breathing room. No shadows, no gradients, no rounded corners, no color punctuation — every accent a designer might be tempted to add has been removed on purpose.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#fffcf0` | `--color-cream-paper` | Page canvas, card surfaces, section backgrounds — a warm off-white that reads as paper, not screen, and prevents pure-white harshness while giving the near-black type a slight warm push |
| Midnight Ink | `#000310` | `--color-midnight-ink` | Primary text, borders, section rules, dark-section backgrounds — near-black with a barely-perceptible blue undertone that distinguishes it from flat #000000 and keeps the palette from feeling like a photocopy |
| Pure Press | `#000000` | `--color-pure-press` | Secondary text, nav labels, fine details — true black used sparingly for maximum contrast accents against the midnight ink |

## Tokens — Typography

### LDD — Display headlines and section names — a custom face with dot-matrix / plus-sign character treatments (visible in the 'o' and 'a' glyphs) that reference early digital terminals and ticket printers. The 135px size at line-height 1.0 makes every heading a single tight line of ink. No substitute captures the pixel-cut character details; closest fallback is 'PP NeueBit' or 'VT323' for the terminal reference, but with reduced fidelity. · `--font-ldd`
- **Substitute:** PP NeueBit, VT323, Space Mono Bold
- **Weights:** 400
- **Sizes:** 135px
- **Line height:** 1.00
- **OpenType features:** `"ss01" on (to activate the dot-matrix plus-sign alternates on o, a, and related rounded glyphs)`
- **Role:** Display headlines and section names — a custom face with dot-matrix / plus-sign character treatments (visible in the 'o' and 'a' glyphs) that reference early digital terminals and ticket printers. The 135px size at line-height 1.0 makes every heading a single tight line of ink. No substitute captures the pixel-cut character details; closest fallback is 'PP NeueBit' or 'VT323' for the terminal reference, but with reduced fidelity.

### NeueMontreal — Body copy, navigation labels, captions, and all secondary type — a neutral neo-grotesque at unusually small sizes (12–16px) with tight 1.0 line-height. The whisper-quiet body face is deliberately undersized so the display type dominates. Line-height 1.0 on 12–16px text means almost no vertical air between lines — a printed-typesetting choice, not a web one. · `--font-neuemontreal`
- **Substitute:** Inter, Manrope, or any neo-grotesque geometric sans at 12–16px
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.00
- **Role:** Body copy, navigation labels, captions, and all secondary type — a neutral neo-grotesque at unusually small sizes (12–16px) with tight 1.0 line-height. The whisper-quiet body face is deliberately undersized so the display type dominates. Line-height 1.0 on 12–16px text means almost no vertical air between lines — a printed-typesetting choice, not a web one.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | — | `--text-caption` |
| body | 16px | 1 | — | `--text-body` |
| display | 135px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 15 | 15px | `--spacing-15` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 58 | 58px | `--spacing-58` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 200px
- **Card padding:** 30px
- **Element gap:** 35px

## Components

### Top Navigation Bar
**Role:** Minimal three-item header — Menu (left), mode-toggle (center), Contact (right)

Sits at the very top edge of the page with no background, no border, no padding above. Three labels in NeueMontreal 12px / line-height 1.0 / Midnight Ink (#000310). No logo, no hamburger icon, no dropdown. Space-between layout across the full viewport width.

### Display Heading (LDD 135px)
**Role:** Primary heading for hero and section titles — the dominant type element on any page

LDD custom face at 135px, weight 400, line-height 1.00, color Midnight Ink (#000310). Renders as a single line. Dot-matrix character alternates (plus-sign o, pixel-cut a) should be activated via font feature 'ss01' on. Full-width — the heading is allowed to break the viewport edge and scroll-clip, or sit centered with 200px vertical breathing room above and below.

### Body Paragraph (NeueMontreal 16px)
**Role:** All descriptive copy, intros, and supporting text

NeueMontreal 16px, weight 400, line-height 1.00, color Midnight Ink (#000310). The 1.0 line-height at 16px means lines nearly touch — this is a signature of the system, not a bug. Never set body text above 16px. Max content width follows the section container but text should be left-aligned and short enough to read in 8–12 word lines.

### Nav Label (NeueMontreal 12px)
**Role:** Navigation, captions, metadata, footer text

NeueMontreal 12px, weight 400, line-height 1.00, color Midnight Ink (#000310). Used for all small-print elements. The 12px / 1.0 combination is the second-most-important type element behind the display heading.

### Scroll Progress Bar
**Role:** Replaces traditional CTAs and navigation — a labeled horizontal progress indicator

Full-width horizontal bar. Container: 1px hairline border in Midnight Ink (#000310), 30px vertical padding, 58px horizontal padding. Fill: solid Midnight Ink block that grows left-to-right as the user scrolls. Three labels beneath the bar in NeueMontreal 12px: 'Scroll' (left), 'To' (center), 'Discover' (right) — evenly distributed across the bar's width with space-between. This is the only interactive progress element in the system.

### Section Number Marker
**Role:** Oversized numeric section indicators (01, 02, 03, 04…) flanking section content

NeueMontreal at very large size (rendered as 0 + 1, 0 + 4 etc. in the markup, visually around 60–80px), weight 400, line-height 1.00, color Midnight Ink (#000310). Positioned at the left and right edges of a section to bookend content. Functions as a typographic structural element, not decoration.

### Section Divider
**Role:** Horizontal rule separating page sections

1px solid line in Midnight Ink (#000310) spanning the full viewport width. No margin above or below — sections butt directly against the rule. This is the only border style in the system.

### Marquee / Scrolling Text Strip
**Role:** Full-bleed horizontal keyword ticker (e.g. 'Security · Support · Network')

NeueMontreal at large display size (~80–100px, between caption and display), weight 400, line-height 1.00, Midnight Ink (#000310) on cream (#fffcf0) background. Items separated by a bullet point (·). The strip spans the entire viewport with no side padding — text is allowed to bleed off both edges.

### Dark Inverted Section
**Role:** Rare full-bleed dark band for reversed-type content

Background: Midnight Ink (#000310). Text: Cream Paper (#fffcf0). All other rules unchanged — still no shadows, no radius, 1.0 line-height, 200px vertical padding. Used sparingly; the page should be 90%+ cream.

### Text Link
**Role:** All inline links and nav items — 'Contact', 'White Version', 'Menu'

NeueMontreal 12px, weight 400, line-height 1.00, color Midnight Ink (#000310). No underline by default. No hover color change, no underline-on-hover, no arrow icons. The link is distinguished only by its position in the nav. Restraint is the rule.

## Do's and Don'ts

### Do
- Use only three colors: #fffcf0 (canvas), #000310 (text/borders), and #000000 (sparingly for accents). No accent color exists.
- Set display headings to LDD at 135px with line-height 1.00 and activate the 'ss01' font feature for dot-matrix character alternates.
- Use NeueMontreal at 12px or 16px with line-height 1.00 for all non-display type. Never set body text above 16px.
- Separate sections with 200px vertical gaps and/or a 1px Midnight Ink rule — never use cards, panels, or backgrounds to create separation.
- Use the labeled scroll progress bar (Scroll / To / Discover) as the primary interaction model. No buttons, no CTAs, no cards.
- Allow large type and section numbers to bleed to the viewport edges. This is full-bleed editorial, not a constrained card grid.
- Keep every radius at 0px. No rounded corners on any element, ever.

### Don't
- Don't add a brand accent color, a secondary palette, or any chromatic highlight. The system is monochromatic by design.
- Don't introduce shadows, blur, glow, or any depth effect. Flatness is the aesthetic.
- Don't use buttons, cards, or pill-shaped components. The scroll progress bar replaces all interactive affordances.
- Don't set body type above 16px or use a line-height above 1.0. The tight leading is a signature, not a bug.
- Don't use a constrained max-width content container. Let the cream paper breathe to the edges.
- Don't substitute the LDD display face with a standard sans-serif. The dot-matrix character treatment is the entire identity.
- Don't add icons, illustrations, or photography. The system is type-only — visuals would compete with the display type and lose.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Paper | `#fffcf0` | Base canvas for the entire page — the single surface |
| 2 | Midnight Ink | `#000310` | Inverted surface for dark sections (rare, used only when a band of reversed type appears) |

## Elevation

Zero elevation. No shadows, no glows, no borders-with-blur. The design system intentionally rejects all depth cues. When an element needs separation, it gets a 1px hairline rule in Midnight Ink (#000310) or a 200px gap of cream paper. Flatness is the aesthetic.

## Imagery

Zero imagery. No photography, no illustration, no product shots, no icons, no avatars. The site is type-only — the LDD display face and the NeueMontreal body face carry 100% of the visual weight. The only graphic element is the 1px hairline rule. This is a radical content decision: the site works because there is nothing to look at except how the type sits on cream paper.

## Layout

Full-bleed editorial — no max-width constraint, content lives at the edges. The page is a vertical stack of full-viewport-width sections separated by 200px gaps or 1px hairline rules. The hero is a centered massive LDD display name. Below it, a labeled scroll-progress bar with section numbering (01…04) flanks left and right at the section edges. A marquee keyword strip ('Security · Support · Network') runs full-bleed at large size, allowed to clip at both sides. Navigation is a minimal top bar with three items (Menu left, mode-toggle center, Contact right) and zero chrome. All layout decisions prioritize the relationship between the 135px display type and the cream canvas — nothing else exists to compete.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000310
- background: #fffcf0
- border: #000310
- accent: none (monochromatic by design)
- primary action: no distinct CTA color

**Example Component Prompts:**

1. Create a full-bleed hero section: cream paper background (#fffcf0), 200px top padding. Center-aligned display heading 'Lorenzo Dal Dosso' in LDD custom face at 135px, weight 400, line-height 1.00, color #000310, with the 'ss01' font feature enabled. No other elements in this section.

2. Create the scroll progress component: a full-width container with 1px hairline border in #000310, 30px vertical padding and 58px horizontal padding. Inside, a solid #000310 progress fill that grows from left to right. Below the bar, three NeueMontreal 12px / line-height 1.00 / #000310 labels — 'Scroll' left, 'To' center, 'Discover' right — using space-between distribution.

3. Create a full-bleed keyword marquee strip: cream (#fffcf0) background, no horizontal padding. A single line of NeueMontreal at ~80px, weight 400, line-height 1.00, color #000310, containing 'Security · Support · Network' in a horizontal sequence. The text is allowed to extend beyond both viewport edges.

4. Create a section with numeric bookends: full-width cream background, 200px vertical padding. Large '01' set in NeueMontreal at ~60px, weight 400, line-height 1.00, #000310, flush to the left edge. A short body paragraph (max 8–12 words per line) in NeueMontreal 16px / line-height 1.00 / #000310, centered. Large '04' set in NeueMontreal at ~60px, flush to the right edge.

5. Create the top navigation bar: no background, no border, no vertical padding. Three NeueMontreal 12px / line-height 1.00 / #000310 labels distributed across the full viewport width with space-between — 'Menu' left, 'White Version' center, 'Contact' right.

## Similar Brands

- **Rauno Freiberg (raunofreiberg.com)** — Same editorial portfolio approach — single-color palette, oversized display type, zero decoration, tight body line-height, and the work itself is the design system
- **Pentagram partner sites (e.g. michaelbjornes.com)** — Same broadsheet sensibility — cream paper canvas, massive display type, hairline rules as the only structural element, and a refusal to use card-based UI
- **Studio Dumbar portfolio archives** — Same dot-matrix / terminal-typeface character treatment in display headings, and the same monochromatic near-black-on-warm-white palette with zero accent color
- **Cobe (cobe.com)** — Same full-bleed editorial layout — content allowed to break viewport edges, oversized numeric section markers, and a near-absence of traditional UI components like buttons and cards
- **Tobias van Schneider (vanschneider.com)** — Same two-tone cream-and-ink palette, massive custom display face, generous section gaps, and a scroll-progress interaction that replaces conventional CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #fffcf0;
  --color-midnight-ink: #000310;
  --color-pure-press: #000000;

  /* Typography — Font Families */
  --font-ldd: 'LDD', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuemontreal: 'NeueMontreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body: 16px;
  --leading-body: 1;
  --text-display: 135px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-15: 15px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-58: 58px;
  --spacing-200: 200px;

  /* Layout */
  --section-gap: 200px;
  --card-padding: 30px;
  --element-gap: 35px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-cream-paper: #fffcf0;
  --surface-midnight-ink: #000310;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #fffcf0;
  --color-midnight-ink: #000310;
  --color-pure-press: #000000;

  /* Typography */
  --font-ldd: 'LDD', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuemontreal: 'NeueMontreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body: 16px;
  --leading-body: 1;
  --text-display: 135px;
  --leading-display: 1;

  /* Spacing */
  --spacing-15: 15px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-58: 58px;
  --spacing-200: 200px;
}
```
