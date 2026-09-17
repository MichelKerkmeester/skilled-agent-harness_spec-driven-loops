# Danilo Rodrigues — Style Reference
> Neon flare in a black void — a single oversized lime disc burning against a perfectly black page, with white type drifting around it like caption text on a gallery wall.

**Theme:** dark

Danilo Rodrigues runs on an almost monastic black-and-white system interrupted by two high-voltage color punches: a giant neon-lime disc in the hero and a saturated cobalt header band. Every other choice is editorial restraint — single-weight Neue Haas Grotesk at full volume, pure #000 canvas, and no shadows, no gradients, no borders, no buttons. The visual personality comes from what is removed, not added: there is no chrome, no card system, no component grid. Content sits directly on the void, left-aligned with generous indent, sized in two registers — a 71px display voice and an 18–19px working voice. Treat every screen as a printed editorial spread: monochrome page, one oversized geometric form, and copy that breathes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, hero field, all large surface areas — the dominant ground that makes every other element read as signal |
| Bone White | `#eaeaea` | `--color-bone-white` | Primary body text, paragraph copy, bio blocks, nav labels — slightly off-white so it never feels clinical against the pure black field |
| Paper White | `#ffffff` | `--color-paper-white` | Headline text, hero display type, the loudest typographic register — pure white reserved for the largest voices on the page |
| Ash | `#878787` | `--color-ash` | Secondary heading text, muted labels, supportive metadata — the middle gray that lets a subhead recede behind a headline |
| Iron Gray | `#1e1e1e` | `--color-iron-gray` | Subtle hairline dividers and section separators — barely one step off the canvas, used only when a line needs to exist without announcing itself |
| Graphite | `#373737` | `--color-graphite` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Signal Lime | `#86ff00` | `--color-signal-lime` | Signature accent: the oversized hero disc, focal point punctuation, and any single high-attention graphic — a single neon-lime shape per screen, never decorative repetition |
| Cobalt Bar | `#1a3cff` | `--color-cobalt-bar` | Active header band and focus state for the top navigation — replaces the black header on scroll/hover to mark the system is now engaged |

## Tokens — Typography

### Neue Haas Grotesk — The only voice on the site. Used for hero display (71px), section headlines (31px), subheads (23–26px), and body copy (18–19px). The signature is a single weight — 400 only — across every size; bold is never used. This monoweight discipline is the typographic equivalent of the black canvas: everything that would normally shout is forced to speak at the same volume, and the hierarchy comes purely from scale and line-height, never from weight contrast. · `--font-neue-haas-grotesk`
- **Substitute:** Inter, Helvetica Neue, Helvetica, Arial
- **Weights:** 400
- **Sizes:** 18px, 19px, 23px, 26px, 31px, 71px
- **Line height:** 1.00–1.30
- **Role:** The only voice on the site. Used for hero display (71px), section headlines (31px), subheads (23–26px), and body copy (18–19px). The signature is a single weight — 400 only — across every size; bold is never used. This monoweight discipline is the typographic equivalent of the black canvas: everything that would normally shout is forced to speak at the same volume, and the hierarchy comes purely from scale and line-height, never from weight contrast.

### Times — Secondary fine-print and small image captions. The serif appears only at 13px, creating an editorial footnote register that contrasts the grotesque's modern authority with a quiet traditionalist voice. · `--font-times`
- **Substitute:** Times New Roman, system serif
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Secondary fine-print and small image captions. The serif appears only at 13px, creating an editorial footnote register that contrasts the grotesque's modern authority with a quiet traditionalist voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body-sm | 18px | 1.3 | — | `--text-body-sm` |
| heading-sm | 23px | 1.2 | — | `--text-heading-sm` |
| heading | 26px | 1.2 | — | `--text-heading` |
| heading-lg | 31px | 1.1 | — | `--text-heading-lg` |
| display | 71px | 1 | -0.71px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 13 | 13px | `--spacing-13` |
| 26 | 26px | `--spacing-26` |
| 32 | 32px | `--spacing-32` |
| 45 | 45px | `--spacing-45` |
| 83 | 83px | `--spacing-83` |
| 130 | 130px | `--spacing-130` |

### Border Radius

| Element | Value |
|---------|-------|
| page | 0px (no rounded corners anywhere on the chrome) |
| discs | 9999px (any circular graphic fills the full radius) |

### Layout

- **Section gap:** 83-130px
- **Card padding:** 32px
- **Element gap:** 13-26px

## Components

### Top Nav Bar (default)
**Role:** Persistent site navigation

Full-width black bar, ~50px tall, four text labels in Neue Haas Grotesk 400 at 18–19px in Bone White (#eaeaea). Left: monogram 'DR'. Center-left: role descriptor. Center-right: work selector with year range on a second line. Far right: 'Scroll ↓' cue. No background fill, no border, no logo mark — just four text blocks anchored at the viewport edges with generous internal padding of 13px vertical.

### Top Nav Bar (engaged state)
**Role:** Active navigation band, indicates the page is in focus

Same four-label structure, but the entire bar fills with Cobalt Bar (#1a3cff) and the text flips to white. Triggered on scroll past the hero or on hover. This is the only place blue appears in the system — the bar acts as a system-status indicator rather than a brand element.

### Hero Disc
**Role:** Signature visual punctuation for the landing screen

A single perfect circle filled with Signal Lime (#86ff00), roughly 60–70% of the viewport height, vertically and horizontally centered in the upper half of the hero. A small concentric outline ring (Bone White #eaeaea, ~1px stroke) marks its center point. No drop shadow, no gradient — pure flat fill. Only one disc per page; never repeated, never used as a button.

### Hero Headline
**Role:** Primary display statement

Neue Haas Grotesk 400 at 71px, Paper White (#ffffff), line-height 1.00, left-aligned at the 8–10% indent. Text wraps and intentionally overlaps the lower edge of the Hero Disc — the disc bleeds behind the type, creating a figure-ground tension. No bold, no italic, no underline.

### Hero Sub-cue
**Role:** Scroll invitation under the headline

Neue Haas Grotesk 400 at 19px, Bone White (#eaeaea), single line, left-aligned at the same indent as the headline. Includes a downward arrow glyph. Appears 45–83px below the last headline line.

### Bio Paragraph Block
**Role:** Long-form about text on the secondary section

Stack of three to five paragraphs, each separated by 26–32px of vertical air. Neue Haas Grotesk 400 at 18–19px, Bone White (#eaeaea), line-height ~1.3, left-aligned at the standard indent. Paragraphs are short — two to four lines — and the first sentence of the lead paragraph is always in Paper White (#ffffff) to act as a soft lead-in.

### Email Link
**Role:** Inline contact link in the bio

Bone White (#eaeaea) text, 19px, underlined with Graphite (#373737) — a deliberately low-contrast underline that reads as a quiet marker, not a call to action. Arrow glyph '→' sits before the address.

### Inline Image Caption
**Role:** Small descriptive text under embedded images

Times serif 400 at 13px, line-height 1.20, Bone White (#eaeaea). The only place a serif appears on the site. Used sparingly to annotate case-study visuals and contrast the grotesque primary voice with a footnote register.

## Do's and Don'ts

### Do
- Set the page background to Void Black (#000000) edge to edge with no max-width wrapper.
- Use Neue Haas Grotesk 400 at exactly one weight for every typographic element — scale and color carry hierarchy, not weight contrast.
- Use Paper White (#ffffff) only for the loudest display type (31px and above); use Bone White (#eaeaea) for all body and supporting copy.
- Place exactly one Signal Lime (#86ff00) circle per hero — oversized, perfectly round, and let the headline type overlap its lower half.
- Left-align all content at a consistent 8–10% viewport indent, and use 83–130px of vertical space between major sections.
- Trigger the Cobalt Bar (#1a3cff) state on the top nav when the page is in active scroll or focus, and keep it as the only place blue appears.
- Default to 13px vertical padding on inline elements and 32px around grouped content; 13 is the base rhythm unit.

### Don't
- Do not introduce drop shadows, gradients, glows, or any simulated depth — depth is implied by contrast and scale only.
- Do not use bold (600/700/800) or italic weights of Neue Haas Grotesk; the system is monoweight by design.
- Do not place more than one Signal Lime disc on a screen, and never use it as a button fill or interactive element.
- Do not build cards, panels, or boxed containers — content sits directly on the black void with no surface wrapping.
- Do not center-align body copy or stack content symmetrically; the layout is consistently left-anchored.
- Do not use color-coded states (no green for success, no red for error) — the accent palette of lime and cobalt is for signature moments only, not status communication.
- Do not add a max-width container or visible grid lines; the page is full-bleed and ungridded.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Full-bleed page canvas — the entire site lives on this single surface |
| 1 | Cobalt Band | `#1a3cff` | Active header strip that replaces the black bar when navigation is engaged |

## Elevation

Shadows are absent by design. Depth on this site is not simulated — it is implied by the contrast between pure black void and pure white type, and occasionally by a saturated neon shape. There are no cards, no raised surfaces, no z-axis hierarchy. If something needs to feel important, it gets a larger size or a brighter color, never a drop shadow.

## Imagery

Imagery is almost entirely typographic. The one dominant visual element is a single oversized geometric disc — a perfect circle rendered in Signal Lime (#86ff00) large enough to dominate the hero, with a small concentric ring mark at its center. No photography, no product shots, no lifestyle imagery. Any case-study content is expected to be text- and graphic-led. The visual language is closer to a printed monograph than a web product: a page, a mark, a paragraph, silence.

## Layout

Full-bleed dark canvas, no max-width container — the page extends edge to edge. The persistent top nav is a thin black bar (replaced by a Cobalt Bar band on active state) with four labels: monogram left, role descriptor, work selector, scroll cue right. Content is consistently left-aligned with a deliberate left indent of roughly 8–10% of the viewport, creating a strong vertical column the eye can lock onto. The hero centers a single oversized circular motif with the headline text wrapping its lower half. Subsequent sections use the same left column for paragraphs of body copy, with generous vertical air between them (83–130px). There are no multi-column grids, no card rows, no feature grids — each section is a single column of text on void. Navigation is minimal and persistent; no sidebar, no mega-menu, no sticky CTA bar.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000000
- text-primary: #ffffff (headlines 31px+)
- text-body: #eaeaea (everything else)
- text-muted: #878787 (subheads, metadata)
- accent-disc: #86ff00 (hero graphic only)
- accent-nav: #1a3cff (active header bar only)
- border-hairline: #1e1e1e
- link-underline: #373737
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Hero section*: full-bleed #000000 canvas. Place a single #86ff00 circle, ~65vh diameter, centered horizontally and biased toward the upper half; add a 1px #eaeaea concentric ring at its center. Below and slightly overlapping the disc's lower arc, place a left-aligned headline: 'Danilo Rodrigues. Senior Visual Designer focused on Design Systems and Branding.' in Neue Haas Grotesk 400, 71px, #ffffff, line-height 1.0, left margin 8% of viewport. Underneath at 45px gap, add a sub-cue: 'Scroll down to see the portfolio ↓' at 19px #eaeaea.
2. *Top nav bar (default)*: full-width #000000 strip, ~50px tall, padding 13px vertical. Four text labels in Neue Haas Grotesk 400 19px #eaeaea — left: 'DR', center-left: 'Senior Visual Designer', center-right: 'Select Work' on line one and '18 – 25' on line two, far right: 'Scroll ↓'. No border, no logo mark, no background fill beyond the page black.
3. *Top nav bar (engaged state)*: same four labels and positioning, but the entire bar fills with #1a3cff and the text color flips to #ffffff. Used to mark active scroll/focus.
4. *Bio section*: left margin 8%, three to five short paragraphs in Neue Haas Grotesk 400 19px #eaeaea, line-height 1.3, 26–32px between paragraphs. Lead paragraph's first sentence set in #ffffff for soft emphasis. Final paragraph includes an inline email link: arrow glyph '→' followed by the address, text color #eaeaea, underline color #373737.
5. *Inline image caption*: Times serif 400, 13px, #eaeaea, line-height 1.20, placed 13px below the image with no other decoration.

## Similar Brands

- **Tobias van Schneider** — Same editorial dark-canvas treatment with oversized display type and a single hero focal point — no chrome, no cards, no component grid
- **Pentagram partner portfolio sites** — Shared monoweight grotesque typography, left-aligned column layout, and the confidence to leave most of the page empty
- **David Carson experimental layouts** — Type-bleeds-over-image figure-ground tension and a willingness to treat the page as a printed editorial spread rather than a web template
- **Studio Dumbar** — Single saturated accent color punctuating a fully monochrome system, and the discipline of using one typeface at one weight

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-bone-white: #eaeaea;
  --color-paper-white: #ffffff;
  --color-ash: #878787;
  --color-iron-gray: #1e1e1e;
  --color-graphite: #373737;
  --color-signal-lime: #86ff00;
  --color-cobalt-bar: #1a3cff;

  /* Typography — Font Families */
  --font-neue-haas-grotesk: 'Neue Haas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 18px;
  --leading-body-sm: 1.3;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.2;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --text-heading-lg: 31px;
  --leading-heading-lg: 1.1;
  --text-display: 71px;
  --leading-display: 1;
  --tracking-display: -0.71px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-13: 13px;
  --spacing-26: 26px;
  --spacing-32: 32px;
  --spacing-45: 45px;
  --spacing-83: 83px;
  --spacing-130: 130px;

  /* Layout */
  --section-gap: 83-130px;
  --card-padding: 32px;
  --element-gap: 13-26px;

  /* Named Radii */
  --radius-page: 0px (no rounded corners anywhere on the chrome);
  --radius-discs: 9999px (any circular graphic fills the full radius);

  /* Surfaces */
  --surface-void: #000000;
  --surface-cobalt-band: #1a3cff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-bone-white: #eaeaea;
  --color-paper-white: #ffffff;
  --color-ash: #878787;
  --color-iron-gray: #1e1e1e;
  --color-graphite: #373737;
  --color-signal-lime: #86ff00;
  --color-cobalt-bar: #1a3cff;

  /* Typography */
  --font-neue-haas-grotesk: 'Neue Haas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 18px;
  --leading-body-sm: 1.3;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.2;
  --text-heading: 26px;
  --leading-heading: 1.2;
  --text-heading-lg: 31px;
  --leading-heading-lg: 1.1;
  --text-display: 71px;
  --leading-display: 1;
  --tracking-display: -0.71px;

  /* Spacing */
  --spacing-13: 13px;
  --spacing-26: 26px;
  --spacing-32: 32px;
  --spacing-45: 45px;
  --spacing-83: 83px;
  --spacing-130: 130px;
}
```
