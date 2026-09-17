# cthdrl — Style Reference
> gallery wall at midnight

**Theme:** dark

Cthdrl operates in pure negative space: a pitch-black canvas where a single warm bone-white carries every word, line, and interface element. Typography is the architecture — oversized display weights compress into tight leading (0.85) to create monolithic headline slabs, while a monospaced face handles navigation, metadata, and body copy at intentionally small sizes. There are no fills, no shadows, no rounded surfaces, and no chromatic accents in the UI layer itself; color appears only as full-bleed gradient sections (deep maroons, violets, olive) that act as atmospheric chapter breaks. The system feels less like a website and more like a printed broadsheet or gallery wall: silence as the primary material, cream-on-black text as the only voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#e7ded1` | `--color-bone` | Primary text, hairline borders, navigation labels, link color, icon strokes — the sole chromatic element in the UI layer, a warm off-white that avoids clinical sterility |
| Void | `#000000` | `--color-void` | Page canvas, section backgrounds, every surface — pure black, not a near-black |
| Maroon Gradient | `linear-gradient(rgb(76, 11, 2), rgb(91, 48, 82))` | `--color-maroon-gradient` | Full-bleed atmospheric section background — deep oxidized red creating a candlelit warmth against the surrounding void |
| Violet Gradient | `linear-gradient(rgb(76, 11, 2), rgb(91, 48, 82))` | `--color-violet-gradient` | Full-bleed atmospheric section background — deep indigo wash, a cold counterpoint to the maroon sections |
| Crimson Gradient | `linear-gradient(rgb(152, 29, 38), rgb(76, 49, 48))` | `--color-crimson-gradient` | Full-bleed atmospheric section background — burnt blood red, the most aggressive gradient stop |
| Plum Gradient | `linear-gradient(rgb(182, 1, 34), rgb(83, 48, 59))` | `--color-plum-gradient` | Full-bleed atmospheric section background — dark mulberry, a muted violet-red transition |
| Olive Gradient | `linear-gradient(rgb(168, 180, 40), rgb(69, 68, 58))` | `--color-olive-gradient` | Full-bleed atmospheric section background — sickly yellow-green, the only non-red gradient, used sparingly for contrast |

## Tokens — Typography

### NB Akademie — Display and heading typeface. Custom serif used exclusively for monumental headlines at 121px with extremely tight leading (0.85) that makes characters nearly touch. The 400 weight at display size is deliberate restraint — the scale and tight tracking do the work that bold weight would do in other systems. Letter-spacing tightens further at larger sizes. · `--font-nb-akademie`
- **Substitute:** GT Sectra, Tiempos Headline, or any transitional serif with low contrast and geometric proportions
- **Weights:** 400
- **Sizes:** 32px, 35px, 121px
- **Line height:** 0.85–1.20
- **Letter spacing:** -0.016em to -0.01em
- **Role:** Display and heading typeface. Custom serif used exclusively for monumental headlines at 121px with extremely tight leading (0.85) that makes characters nearly touch. The 400 weight at display size is deliberate restraint — the scale and tight tracking do the work that bold weight would do in other systems. Letter-spacing tightens further at larger sizes.

### NB Akademie Mono — UI and monospace workhorse — navigation, body text, metadata, links, icons, and the 32px mid-scale heading tier. At 11px the negative tracking (-0.045em) compresses characters into a dense data-stream aesthetic. The monospaced face contrasts with the display serif to create a document/blueprint duality: editorial headlines above, technical metadata below. · `--font-nb-akademie-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400
- **Sizes:** 11px, 32px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.045em
- **Role:** UI and monospace workhorse — navigation, body text, metadata, links, icons, and the 32px mid-scale heading tier. At 11px the negative tracking (-0.045em) compresses characters into a dense data-stream aesthetic. The monospaced face contrasts with the display serif to create a document/blueprint duality: editorial headlines above, technical metadata below.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | -0.495px | `--text-caption` |
| subheading | 32px | 1.2 | -1.44px | `--text-subheading` |
| heading | 35px | 1.2 | -0.56px | `--text-heading` |
| display | 121px | 0.85 | -1.936px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 50 | 50px | `--spacing-50` |
| 75 | 75px | `--spacing-75` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 0px |

### Layout

- **Section gap:** 50px
- **Card padding:** 0px
- **Element gap:** 10-11px

## Components

### Display Headline
**Role:** Hero and section headlines

NB Akademie at 121px, weight 400, line-height 0.85, letter-spacing -0.016em. Bone (#e7ded1) on Void (#000000). Occupies full viewport width, often broken across 3-4 lines. A thin horizontal rule or short em-dash prefix marks the opening line. No max-width constraint — text breathes to the edges.

### Navigation Bar
**Role:** Top-level site navigation

NB Akademie Mono at 11px, uppercase, weight 400, letter-spacing -0.045em. Bone text on Void. Fixed thin top bar with logo left, primary nav center, counter/indicator right. Navigation items separated by 30px horizontal padding. No background fill, no border — floats directly on the black canvas.

### Section Counter
**Role:** Page position indicator (e.g. 0/14)

NB Akademie Mono 11px, Bone. Positioned top-right. Italic-style format with slash separator. Serves as a pagination metaphor, treating the site as a 14-page document.

### Outlined Link
**Role:** Inline and standalone links

Bone text with a 1px Bone border on one or two sides, or underlined in Bone. No background fill, no pill shape. Links are identified by their border treatment alone — the outlined-action border (ACTION_BORDER=12) is the only visual signal. Padding 0px vertical, 0px horizontal within text flow.

### Metadata Block
**Role:** Supporting information under headlines

NB Akademie Mono 11px, uppercase, Bone. Arranged in 3-column or 4-column grid at the bottom of hero sections. Location, contact prompt, and studio description in tight monospace columns. 10px element gap, 30px column padding.

### Arc Divider
**Role:** Section separator and decorative geometry

Thin 1px Bone circle or arc line drawn at large scale (800px+ diameter) behind content. Creates a sense of orbital geometry against the black void. Partially visible, never fully rendered — the incompleteness is the point.

### Gradient Section Background
**Role:** Full-bleed chromatic page break

One of the six detected linear gradients (maroon→plum, crimson→earth, olive→charcoal, etc.) applied edge-to-edge as a section background. No borders, no radius. Text within these sections uses Bone or Void depending on the gradient's luminance. Functions as a 'chapter change' in a printed catalog.

### Project Index Item
**Role:** List entry in a project gallery or case study index

NB Akademie Mono 11px or NB Akademie 32px, Bone text. Minimal — project title and a 1px Bone top/bottom border creating a row. No thumbnail, no description. The index reads as a typeset table of contents.

## Do's and Don'ts

### Do
- Use only #e7ded1 for all text, borders, icons, and interactive elements on a #000000 canvas
- Set display headlines at 121px with line-height 0.85 and letter-spacing -0.016em in NB Akademie
- Use NB Akademie Mono at 11px with -0.045em letter-spacing for all body, nav, and metadata text
- Apply 0px border-radius to every element — no exceptions, no rounded corners anywhere
- Use full-bleed gradient sections (maroon, violet, crimson) as the only chromatic moments, applied edge-to-edge with no padding or containment
- Maintain 0px padding and no fill on all links and buttons — identify interactive elements by Bone borders or underlines only
- Keep 50px between major sections and 10-11px between inline elements to preserve the editorial rhythm

### Don't
- Never introduce a second text color — the system is monochrome in the UI layer; chromatic color exists only in full-bleed gradient sections
- Never use rounded corners, box-shadows, or background fills on any component
- Never set body or UI text above 11px in NB Akademie Mono — the face is reserved for technical/metadata scale
- Never use a bright or saturated color for buttons, links, or interactive states — interactivity is signaled by borders, not fills
- Never apply gradients to text, icons, or component surfaces — gradients are full-bleed backgrounds only
- Never constrain the page to a max-width container — the layout bleeds to viewport edges, mimicking a printed sheet
- Never use weight 600+ — every typeface runs at 400; scale and tracking create hierarchy, not weight

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Primary canvas — every page, every section defaults to this |
| 2 | Gradient Fields | `#4c0b02` | Full-bleed chromatic section backgrounds acting as chapter dividers — never cards, never elevated surfaces |

## Elevation

The design uses zero elevation. There are no shadows, no z-axis surfaces, no floating panels. Spatial separation is achieved through generous negative space and the black void itself — elements exist on a single plane, distinguished only by their position and the thin Bone lines between them. This is a design that trusts emptiness as a structural material.

## Imagery

The site uses almost no photography or illustration. Visual interest comes entirely from typographic scale, the black void, thin geometric arc lines drawn at large scale behind content, and the occasional full-bleed gradient field. Where images appear (project showcases), they are likely product crops or editorial photography with no rounded corners, bleeding to viewport edges. The imagery strategy is anti-imagery: text and geometry are the visuals.

## Layout

Full-bleed layout with no max-width constraint — the canvas extends to viewport edges on all sides. The hero is a massive editorial headline occupying the full viewport height, with a thin arc or circle line drawn at 800px+ diameter behind it as the only graphical element. Below the headline, a 3-4 column metadata row in 11px monospace provides supporting information. Navigation is a fixed thin top bar with no background fill. Section transitions happen through full-bleed gradient fields rather than borders or spacing. The grid is asymmetric: headline-left, counter-right, metadata columns unevenly weighted. The overall rhythm is that of a printed broadsheet or exhibition catalog — spacious vertical sections, generous breathing room, text-first composition.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #000000
- Text: #e7ded1
- Border/divider: #e7ded1
- Accent: no distinct UI accent — chromatic color appears only in full-bleed gradient sections
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Display Headline**: Render at 121px in NB Akademie (substitute: GT Sectra), weight 400, line-height 0.85, letter-spacing -0.016em. Color #e7ded1 on #000000 background. Full-bleed, no max-width. A short em-dash or horizontal line may prefix the first line. Text should occupy 60-80% of viewport height.

2. **Navigation Bar**: Fixed top bar, 0px background, 0px border-radius. Logo on left, 2-3 nav items center, counter (e.g. '0/14') right. All text in NB Akademie Mono 11px, weight 400, letter-spacing -0.045em, color #e7ded1. 30px horizontal padding between items.

3. **Metadata Row**: 3-column grid below a hero headline. Each column contains 2-3 lines of NB Akademie Mono 11px, uppercase, #e7ded1. Column gap 30px. First column: location. Second column: contact prompt. Third column: studio description in 3-4 lines. No borders, no backgrounds.

4. **Full-Bleed Gradient Section**: Background: linear-gradient(rgb(76, 11, 2), rgb(91, 48, 82)). Edge-to-edge, 0px radius, no border. Min-height 100vh. Text overlay in #e7ded1 using the same type system. Functions as a chapter break.

5. **Outlined Link**: Text in #e7ded1, NB Akademie Mono 11px, with a 1px #e7ded1 border-bottom (or border-left for vertical links). No background fill, no padding, 0px radius. Hover: border color remains #e7ded1, text may shift to uppercase or add underline — no color change.

## Duality Principle

The system operates on a two-register duality: the **editorial register** (NB Akademie serif at 121px, tight leading, monumental headlines) and the **technical register** (NB Akademie Mono at 11px, monospaced, metadata-dense). Every screen alternates between these two scales. Never let the monospaced face appear above 32px in body contexts, and never let the serif face appear below 32px. The gap between 11px and 121px — an 11× scale jump — is intentional: it creates a document/blueprint rhythm where the reader's eye leaps between headline and footnote, with nothing in between.

## Negative Space as Material

The #000000 canvas is not a background — it is the primary design surface. When planning layout, calculate the ratio of black space to text: it should always exceed 70%. Thin Bone lines (1px) and arc geometry are used sparingly to activate the void, not to fill it. Resist any impulse to add borders, backgrounds, or containers to group elements — grouping happens through proximity and alignment, not enclosure.

## Similar Brands

- **Pentagram** — Editorial typography-first layout with no decorative chrome, relying on typographic scale and generous negative space
- **Resn** — Dark canvas with large display headlines and sparse UI — content and typography as the entire visual system
- **Manual (manual.co)** — Full-bleed gradient sections as chapter breaks with monochrome text overlay, broadsheet editorial rhythm
- **Locomotive** — Custom serif display type with monospaced metadata, gallery-like restraint and zero decorative elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #e7ded1;
  --color-void: #000000;
  --color-maroon-gradient: #4c0b02;
  --gradient-maroon-gradient: linear-gradient(rgb(76, 11, 2), rgb(91, 48, 82));
  --color-violet-gradient: #1e1594;
  --gradient-violet-gradient: linear-gradient(rgb(76, 11, 2), rgb(91, 48, 82));
  --color-crimson-gradient: #6e1815;
  --gradient-crimson-gradient: linear-gradient(rgb(152, 29, 38), rgb(76, 49, 48));
  --color-plum-gradient: #6d0251;
  --gradient-plum-gradient: linear-gradient(rgb(182, 1, 34), rgb(83, 48, 59));
  --color-olive-gradient: #a8b428;
  --gradient-olive-gradient: linear-gradient(rgb(168, 180, 40), rgb(69, 68, 58));

  /* Typography — Font Families */
  --font-nb-akademie: 'NB Akademie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nb-akademie-mono: 'NB Akademie Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: -0.495px;
  --text-subheading: 32px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1.44px;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --tracking-heading: -0.56px;
  --text-display: 121px;
  --leading-display: 0.85;
  --tracking-display: -1.936px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-50: 50px;
  --spacing-75: 75px;

  /* Layout */
  --section-gap: 50px;
  --card-padding: 0px;
  --element-gap: 10-11px;

  /* Named Radii */
  --radius-all: 0px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-gradient-fields: #4c0b02;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #e7ded1;
  --color-void: #000000;
  --color-maroon-gradient: #4c0b02;
  --color-violet-gradient: #1e1594;
  --color-crimson-gradient: #6e1815;
  --color-plum-gradient: #6d0251;
  --color-olive-gradient: #a8b428;

  /* Typography */
  --font-nb-akademie: 'NB Akademie', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nb-akademie-mono: 'NB Akademie Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: -0.495px;
  --text-subheading: 32px;
  --leading-subheading: 1.2;
  --tracking-subheading: -1.44px;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --tracking-heading: -0.56px;
  --text-display: 121px;
  --leading-display: 0.85;
  --tracking-display: -1.936px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-50: 50px;
  --spacing-75: 75px;
}
```
