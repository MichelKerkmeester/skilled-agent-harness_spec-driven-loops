# 10X HUB — Style Reference
> ink and ember poster wall

**Theme:** mixed

10X Hub operates as a high-contrast editorial system built on pure black, pure white, and a single vivid red (#ff1841) that acts as both accent and full section background. The design is deliberately raw and unembellished — massive unweighted typography dominates the hero, controls reduce to pill shapes or hairline underlines, and there is no shadow language or surface elevation to soften edges. The page reads as a brutalist poster: sections alternate between ink-black voids and coral-red fields, with the white canvas peeking through for form areas and body content. Every interface element is stripped to its minimum viable form — a border, a radius of 999px, a single fill color — so the visual weight stays on the words and the red interruption.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Red | `#ff1841` | `--color-ember-red` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Bloodline | `#7b0016` | `--color-bloodline` | Decorative dark red stroke, link hover states, secondary accent where a deeper red register is needed against white |
| Obsidian | `#000000` | `--color-obsidian` | Hero section background, primary body text, icon strokes, input field text — the structural darkness |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas base, text on dark backgrounds, input field backgrounds |
| Ash | `#e8e6e6` | `--color-ash` | Card surfaces, subtle section backgrounds, hairline divider highlights on dark |
| Steel | `#949494` | `--color-steel` | Muted borders, inactive control outlines, secondary dividers |
| Charcoal | `#212121` | `--color-charcoal` | Deep surface layer — elevated panels, dark card backgrounds behind red sections |
| Fog | `#bebcbc` | `--color-fog` | Light border variant for input fields on white, subtle structural lines |
| Mist | `#c7c7c7` | `--color-mist` | Disabled control borders, tertiary structural lines |

## Tokens — Typography

### Arial — Micro UI text — toggle labels, badge text, button micro-copy, fine print; Arial's universality here is deliberate, keeping tiny text neutral and system-native · `--font-arial`
- **Substitute:** system-ui, Arial, Helvetica
- **Weights:** 400
- **Sizes:** 10px, 13px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Micro UI text — toggle labels, badge text, button micro-copy, fine print; Arial's universality here is deliberate, keeping tiny text neutral and system-native

### 10X Display (custom — madefor-text variant) — Hero display headline — the massive '10X HUB' wordmark and large section openers; weight 400 at near-300px with letter-spacing -0.064em creates a poster-scale compression that fills the viewport edge-to-edge · `--font-10x-display-custom-madefor-text-variant`
- **Substitute:** Druk Wide, Inter Black, or system sans at the same size
- **Weights:** 400
- **Sizes:** 187px, 298px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.064em
- **Role:** Hero display headline — the massive '10X HUB' wordmark and large section openers; weight 400 at near-300px with letter-spacing -0.064em creates a poster-scale compression that fills the viewport edge-to-edge

### Helvetica W01 Roman — Workhorse for all body copy, form labels, subheadings, navigation, and secondary headings up to 45px; the only weight available is 400, forcing visual hierarchy to come from size and color contrast rather than weight shifts · `--font-helvetica-w01-roman`
- **Substitute:** Helvetica Neue, Inter, Arial
- **Weights:** 400
- **Sizes:** 13px, 14px, 15px, 18px, 31px, 45px
- **Line height:** 1.00–1.60
- **Letter spacing:** normal
- **Role:** Workhorse for all body copy, form labels, subheadings, navigation, and secondary headings up to 45px; the only weight available is 400, forcing visual hierarchy to come from size and color contrast rather than weight shifts

### wfont_9aea05_daebdda91ced4d119f7837b7bae26e19 — wfont_9aea05_daebdda91ced4d119f7837b7bae26e19 — detected in extracted data but not described by AI · `--font-wfont9aea05daebdda91ced4d119f7837b7bae26e19`
- **Weights:** 400
- **Sizes:** 24px, 298px
- **Line height:** 1
- **Role:** wfont_9aea05_daebdda91ced4d119f7837b7bae26e19 — detected in extracted data but not described by AI

### madefor-text — madefor-text — detected in extracted data but not described by AI · `--font-madefor-text`
- **Weights:** 400
- **Sizes:** 187px
- **Line height:** 1.2
- **Letter spacing:** -0.064
- **Role:** madefor-text — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 15px | 1.4 | — | `--text-body` |
| body-lg | 18px | 1.4 | — | `--text-body-lg` |
| heading-sm | 31px | 1.3 | — | `--text-heading-sm` |
| heading | 45px | 1.3 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 12px |
| inputs | 0px |
| buttons | 999px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Ember Pill Button
**Role:** Primary action trigger

Filled red (#ff1841) pill button with white text, border-radius 999px, padding 10px 20px, font-size 13px Arial weight 400. Used for 'Submit resource →' and other conversion actions. The pill shape is the only rounding convention in the system.

### Ghost Outline Button
**Role:** Secondary or low-emphasis action

Transparent fill with 1px white or #949494 border, border-radius 999px, padding 8px 20px, white or dark text. Used for toggle state containers, secondary navigation, and upload actions. Interior element (like the toggle knob) is a small red circle.

### Underline Input
**Role:** Form field for text entry

No box, no background — just a 1px bottom border (#000000 on white sections, #212121 on dark). Label text floats above at 13–15px Helvetica. Focus state thickens the bottom border to 2px or shifts it to #ff1841. Placeholder text in #949494.

### Upload File Button
**Role:** File attachment trigger

Pill-shaped ghost button matching the Ghost Outline pattern — transparent fill, dark border on red background, border-radius 999px, contains a small plus icon and 'Upload file' label in Helvetica 14px.

### Toggle Switch
**Role:** Binary on/off control in the header

Pill-shaped container (border-radius 999px, ~40px wide) with a circular knob. Off state: transparent fill with #949494 border, knob on left. On state: red (#ff1841) fill with red knob — the knob is the same color as the track, creating a flat solid block.

### Dot Grid Logo Mark
**Role:** Brand identity icon in the header

3×3 grid of small filled circles arranged in a square, rendered in white on dark backgrounds. Functions as a compact brand mark that echoes the grid structure of the 10X concept (10 dots = 10×).

### Massive Display Headline
**Role:** Hero-level typographic element

Text rendered at 187–298px in the custom display face, weight 400, line-height 1.0, letter-spacing -0.064em. Fills the full viewport width. The text is white on black or black on red — never colored or gradient.

### Red Full-Width Section
**Role:** Content section with branded background

Full-bleed #ff1841 background spanning the viewport width. Contains form fields, labels, and body copy in black (#000000) or near-black. No inner container or max-width constraint visible — content flows edge-to-edge with 20px padding from viewport edges.

### Form Section Header
**Role:** Section title within a colored background

Helvetica 45px weight 400, line-height ~1.0, black text on the red section background. No decorative underline or accent — the type size alone carries the hierarchy.

### Footer Attribution Badge
**Role:** Third-party platform credit

Small pill-shaped badge in the bottom corner with a 'W' icon, text 'Built with WIX STUDIO'. White background, dark text, border-radius 999px, font-size 10px Arial. Functions as a persistent floating element across sections.

### Word-Spaced Subtitle
**Role:** Micro-headline beneath the display headline

Individual words of a sentence ('Get and share resources that let you do better work') spaced at wide intervals (~120–160px apart) across the full width, Helvetica 13px, in #949494. Creates a typographic rhythm that mirrors the display headline's breadth.

### Sticky Top Bar
**Role:** Global navigation and primary CTA

Fixed top bar with left-aligned dot grid logo, right-aligned toggle and red 'Submit resource' pill button. No background fill — elements float directly on the section color beneath. Height ~40px.

## Do's and Don'ts

### Do
- Use border-radius 999px for all interactive elements — buttons, toggles, tags, badges. Sharp corners belong only to form input bottom borders and structural layout lines.
- Render hero and display headlines at 187–298px with the custom display face, weight 400 only, line-height 1.0, letter-spacing -0.064em. Never bold or compress further.
- Alternate between #000000 and #ff1841 for full-bleed section backgrounds. White (#ffffff) appears only as a transient surface for form areas and body content.
- Use #ff1841 as the sole chromatic color. Every red element — button, toggle, section background — draws from the same Ember Red token.
- Set body and subheading type in Helvetica at 13–45px, weight 400 only. Build hierarchy through size jumps, not weight changes.
- Keep all UI controls flat — no shadows, no gradients, no glassmorphism. Depth comes from color field transitions (black → red → white), not elevation.
- Place micro-labels and word-spaced subtitles in #949494 to recede behind the primary message while maintaining readability.

### Don't
- Do not introduce a second accent color. The system is binary: achromatic structure with one red rupture.
- Do not use font-weight 600+ anywhere. The entire system operates at weight 400; bolding breaks the typographic discipline.
- Do not add shadows or elevation to cards or buttons. Flatness is the design language — #ff1841 on #000000 is the only depth mechanism.
- Do not use border-radius values between 2px and 12px for buttons or interactive elements. The system jumps from 0 (input underlines) to 12px (cards) to 999px (pills).
- Do not place the display font at sizes below 100px. The custom display face is designed for poster-scale rendering; using it at body size destroys its character.
- Do not use #000000 as a background on the red sections or #ff1841 on the black sections. The red and black must meet as direct transitions, not through a dark-red intermediate.
- Do not add photography, illustration, or decorative graphics. The system is pure typography and flat color — imagery would dilute the poster-like clarity.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base page canvas and form field background |
| 1 | Ash | `#e8e6e6` | Subtle card surfaces and light dividers |
| 2 | Charcoal | `#212121` | Elevated dark surface behind or between red sections |
| 3 | Obsidian | `#000000` | Hero background — the deepest surface, full-bleed |
| 4 | Ember Red | `#ff1841` | Branded content section background — not a UI surface in the traditional sense but a full-bleed visual field |

## Elevation

No shadows exist in this system. Depth is created exclusively through color contrast — a red section on a black page, white text on black, black text on red. Cards do not float; they sit flat against the colored field. This flatness is the design.

## Imagery

No photography, illustration, or product imagery is present. The visual system is pure typography and flat color fields. The only graphical elements are the dot-grid logo mark, simple plus icons inside upload buttons, and the circular toggle knob — all geometric, all monochrome or red. The 10X brand identity is carried entirely by type scale and color alternation, not by imagery.

## Layout

Full-bleed page with no max-width container. Sections span the entire viewport width with no gutters or margins. The hero is a pure black field with the display headline and word-spaced subtitle centered vertically. The red form section follows as another full-bleed band, with a 3-column form grid (left column for personal fields, center for resource fields, right for uploads) at 20px column gaps. Navigation is a minimal floating top bar with no background. The overall rhythm is: black void → red field → black void, creating a binary visual alternation that functions like a poster spread.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #949494
- accent: #ff1841
- hero background: #000000
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: full-bleed #000000 background, display headline at 298px in the custom display face weight 400, letter-spacing -0.064em, white (#ffffff) text. Below it, a word-spaced subtitle in Helvetica 13px #949494 with each word separated by ~140px. No images, no decorations.

2. Create an Ember Pill Button: #ff1841 fill, white text, border-radius 999px, padding 10px 20px, font 13px Arial weight 400. Add a right arrow (→) after the label. No shadow, no border.

3. Create a form input field: no background, no box. Only a 1px bottom border in #000000. Label text above at 14px Helvetica weight 400 in #000000. Placeholder text in #949494. On focus, the bottom border becomes 2px #ff1841.

4. Create a red content section: full-bleed #ff1841 background, 80px top and bottom padding. Inside, a 3-column grid with 20px column gaps. Section title at 45px Helvetica weight 400, black text. All form fields and labels in black.

5. Create a sticky header: transparent background, no border. Left: 3×3 dot grid in white. Right: a toggle switch (pill-shaped, 40px wide, border-radius 999px, with a small circular knob) followed by a red pill button ('Submit resource →'). Height 40px.

## Similar Brands

- **Wix Studio** — Same high-contrast black-and-white base with a single vivid accent, same massive unweighted display type, and the persistent 'Built with WIX STUDIO' badge confirms the direct relationship
- **Framer** — Bold minimalism with alternating full-bleed dark and light sections, pill-shaped controls, and typography that fills the viewport
- **Notion** — Extremely restrained UI with near-zero decoration, relying on type scale and color contrast for hierarchy rather than shadows or borders
- **Vercel** — Dark-dominant canvas with stark white type, no shadow language, and a single accent for interactive states

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-red: #ff1841;
  --color-bloodline: #7b0016;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #e8e6e6;
  --color-steel: #949494;
  --color-charcoal: #212121;
  --color-fog: #bebcbc;
  --color-mist: #c7c7c7;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-10x-display-custom-madefor-text-variant: '10X Display (custom — madefor-text variant)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-w01-roman: 'Helvetica W01 Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wfont9aea05daebdda91ced4d119f7837b7bae26e19: 'wfont_9aea05_daebdda91ced4d119f7837b7bae26e19', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text: 'madefor-text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.3;
  --text-heading: 45px;
  --leading-heading: 1.3;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 744.047px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 12px;
  --radius-inputs: 0px;
  --radius-buttons: 999px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-ash: #e8e6e6;
  --surface-charcoal: #212121;
  --surface-obsidian: #000000;
  --surface-ember-red: #ff1841;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-red: #ff1841;
  --color-bloodline: #7b0016;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #e8e6e6;
  --color-steel: #949494;
  --color-charcoal: #212121;
  --color-fog: #bebcbc;
  --color-mist: #c7c7c7;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-10x-display-custom-madefor-text-variant: '10X Display (custom — madefor-text variant)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-w01-roman: 'Helvetica W01 Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wfont9aea05daebdda91ced4d119f7837b7bae26e19: 'wfont_9aea05_daebdda91ced4d119f7837b7bae26e19', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text: 'madefor-text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.3;
  --text-heading: 45px;
  --leading-heading: 1.3;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 744.047px;
  --radius-full-2: 999px;
}
```
