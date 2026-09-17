# Ramp — Style Reference
> Editorial finance desk, black-and-white pages with a single neon highlighter. A near-monochrome publication surface where one vivid chartreuse mark turns every interaction into a money signal.

**Theme:** light

Ramp operates as a black-and-white editorial system punctuated by a single highlighter-yellow accent — the visual equivalent of a finance journal with a neon Sharpie. The interface stays nearly monochrome: warm off-white canvas, white cards, hairline gray borders, and deep near-black text. That one vivid chartreuse (#e4f222) appears only where money moves — CTAs, live counters, active states — making every action feel switched-on. Typography is a single-weight, neo-grotesque custom face (lausanne) at 400, used at large display sizes with tight leading (lineHeight ~1.0 at 64px) and positive tracking on small uppercase labels. Components are flat, hairline-bordered, and shadow-free: cards rest on borders, not shadows, with 12–16px radii; buttons are 6px-radius rectangles. Density is comfortable, rhythm is 8/12/16/24px, and motion is moderate and utility-focused rather than decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Highlighter Yellow | `#e4f222` | `--color-highlighter-yellow` | Primary action fill, live counters, active-state highlights — the only chromatic accent in the system, making CTAs read as switched-on |
| Ink | `#0c0a08` | `--color-ink` | Primary text, heading fill, dark surface backgrounds — near-black with the faintest warm cast |
| Obsidian | `#1a1919` | `--color-obsidian` | Dark panels, navigation bar, inverted sections — slightly warmer and lighter than Ink for tonal variation |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, modal panels, light fills, reversed text on dark backgrounds |
| Bone | `#f4f2f0` | `--color-bone` | Page canvas, subtle card washes, link background hover states — warm off-white base layer |
| Ash | `#6d6c6b` | `--color-ash` | Secondary text, hushed captions, muted labels — the 60% opacity voice of --text-primary |
| Hairline | `#e5e7eb` | `--color-hairline` | Card borders, divider lines, structural outlines — 1px hairlines replace shadows as the elevation primitive |
| Smoke | `#d3d3d3` | `--color-smoke` | Subtle borders, muted backgrounds, skeleton states — the 200-step in the black scale |

## Tokens — Typography

### lausanne — Sole typeface across the entire system — headings, body, UI labels, nav, buttons, inputs. A single weight (400) forces hierarchy through size and tracking rather than weight contrast. · `--font-lausanne`
- **Substitute:** Inter, IBM Plex Sans, or Söhne
- **Weights:** 400
- **Sizes:** 10px, 13px, 14px, 16px, 18px, 20px, 24px, 28px, 40px, 48px, 64px
- **Line height:** 0.74–2.20 (tight at display, generous at caption)
- **Letter spacing:** 0.018em at 10px (uppercase micro-labels), 0.05em at small uppercase, 0 (normal) at body and display sizes
- **OpenType features:** `"ss01" on`
- **Role:** Sole typeface across the entire system — headings, body, UI labels, nav, buttons, inputs. A single weight (400) forces hierarchy through size and tracking rather than weight contrast.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 2.2 | 0.18px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 24px | 1.17 | — | `--text-heading-sm` |
| heading | 28px | 1.14 | — | `--text-heading` |
| heading-lg | 40px | 1.05 | — | `--text-heading-lg` |
| display | 64px | 1 | — | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |
| 156 | 156px | `--spacing-156` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 16px |
| inputs | 10px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.6) 0px 0px 2px 0px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-128px
- **Card padding:** 20-24px
- **Element gap:** 8px

## Components

### Primary Button (Highlighter)
**Role:** Main CTA — 'Get started for free', 'Create report', 'See a demo'

6px radius, #e4f222 fill, #0c0a08 text, no border, 0px vertical padding with 20px horizontal padding (text-aligned height ~44px). The only chromatic button in the system; its chartreuse fill is the highest-contrast pair against Ink text (17:1).

### Outlined Button
**Role:** Secondary CTA — 'Switch in days', 'Explore Ramp Intelligence'

6px radius, transparent fill, 1px Ink border, Ink text, 0px vertical / 12px horizontal padding. Used when a second action sits beside the primary without competing for attention.

### Ghost / Link Button
**Role:** Tertiary action — nav items, 'Read the report', inline links

Transparent fill, no border, Ink text, 6px radius. Hover state transitions to #f4f2f0 background.

### Square Icon Button
**Role:** Compact action — '+ New dashboard', utility toggles

16px padding all sides, #f4f2f0 fill, 12px radius, Ink icon/text. Squarer feel than standard CTA; used for inline dashboard controls.

### Content Card
**Role:** Primary card surface for testimonials, feature blocks, logo grids

16px radius, #ffffff fill, 1px #e5e7eb border, no shadow, 20px padding. Border replaces shadow as the elevation primitive — 17 of these are the dominant card type.

### Wash Card
**Role:** Subtle feature or stat card

12px radius, #f4f2f0 fill, no border, 1px padding wrapper creates a hairline gap before content. Used for muted callouts that don't need white contrast.

### Email Input
**Role:** Hero email capture, form fields

10px radius, transparent fill, 1px rgba(33,33,33,0.1) border, #0c0a08 text, 24px left padding / 16px right padding. Sits flush beside the Primary Button to form a composite CTA.

### Testimonial Card
**Role:** Customer quote with avatar and attribution

16px radius, #ffffff fill, 1px #e5e7eb border, 20px padding, contains company logo badge (square), name + title in 16px lausanne 400, quote in #0c0a08 body. Arranged in horizontal scroll rows.

### Live Counter Ticker
**Role:** Scrolling metric strip ('Agents at work today', 'Expenses reviewed')

Full-width #1a1919 dark band, uppercase 10px lausanne labels in Ash (#6d6c6b), metric values in Paper (#ffffff) at 14px. Numbers pulse subtly via opacity transitions.

### Sticky Navigation Bar
**Role:** Primary site navigation

102px total height including 40px announcement bar above. #ffffff fill, 1px bottom border, 15 interactive elements (logo, Products, Partners, Solutions, Resources, Customers, Pricing, Sign in, See a demo). Frosted-glass inset shadow rgba(255,255,255,0.6) inset 0 0 2px adds subtle top highlight.

### Announcement Bar
**Role:** Top-of-page promotional strip

40px height, #ffffff fill, 13px centered lausanne body text with inline link 'Learn more'. Dismissible with close icon. Sits above the main nav.

### Hero Product Screenshot
**Role:** Dashboard / product visual in hero and feature sections

Rounded browser-chrome frame with traffic-light dots, floating UI panels with shadow-free white fills. Contains inline Highlighter Yellow CTA buttons to bridge product-as-marketing.

### Logo Grid Cell
**Role:** Customer logo display in social-proof block

Transparent fill, 1px #e5e7eb grid borders forming cells, centered grayscale logo. 7-column layout; last cell replaced with a dark '7 mo' Pullquote card to break the grid rhythm.

## Do's and Don'ts

### Do
- Use lausanne at weight 400 exclusively — never introduce a bold or semibold variant; hierarchy comes from size and tracking.
- Use #e4f222 only for primary action fills, live counters, and active states — never as a background wash or decorative accent.
- Express card elevation with 1px #e5e7eb borders on #ffffff fills — avoid box-shadow except for the nav's inset white highlight.
- Set display headlines at 64px / 48px / 40px with line-height ≤ 1.05 to maintain the editorial typographic voice.
- Apply 0.018em positive letter-spacing on 10px uppercase micro-labels and metric captions.
- Use 6px radius for buttons and tags, 10px for inputs, 12px for wash cards, and 16px for content cards.
- Include "ss01" in font-feature-settings on every lausanne declaration to preserve the typeface's editorial character.

### Don't
- Don't introduce additional chromatic accent colors — the system's power depends on a single highlighter-yellow signal against monochrome.
- Don't use bold or semibold font weights — lausanne 400 at larger sizes carries all heading hierarchy.
- Don't apply box-shadow to content cards, modals, or panels — use 1px #e5e7eb borders instead.
- Don't use #0c0a08 as a background fill for large sections — reserve it for text; use #1a1919 for inverted panels.
- Don't center body text or headlines — Ramp's layout is consistently left-aligned within centered max-width containers.
- Don't add decorative gradients, illustrations, or stock photography — the visual language is typography, product screenshots, and grayscale logos only.
- Don't use radii outside the system: 6 / 10 / 12 / 16px — never 4px or fully rounded pill shapes on UI elements.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f4f2f0` | Page background — warm off-white sets a paper-like editorial feel |
| 2 | Card | `#ffffff` | Standard card and content surface — pure white lifts above the Bone canvas |
| 3 | Wash | `#f4f2f0` | Subtle secondary surface, link hover backgrounds, feature callouts |
| 4 | Inverted | `#1a1919` | Dark panels, sticky nav, footer, hero inversion blocks |
| 5 | Action | `#e4f222` | Accent surface for active states, live counters, high-emphasis fills |

## Elevation

Elevation is expressed entirely through hairline 1px borders (#e5e7eb) and surface tonal shifts (Bone → White → Inverted) rather than shadows. The one detected box-shadow is an inset white highlight on the sticky nav — a frosted-glass cue rather than a drop shadow. This deliberate flatness keeps the editorial feel intact and prevents visual noise on dense marketing surfaces.

## Imagery

Photography and lifestyle imagery are absent. The visual language is dominated by product screenshots (floating browser-chrome UI frames showing Ramp dashboards), grayscale customer logos in grid cells, and one full-bleed dark product image (a pink neon 'Stay Posted' installation) as a brand-moment card. Iconography is filled, mono-colored, and minimal — small flat UI glyphs rather than illustrated characters. Everything reads as a screenshot or a typographic statement; no decorative illustration, no stock photography, no human faces outside of testimonial avatar squares. The density is text-dominant with product UI visuals carrying the visual weight.

## Layout

Full-bleed light canvas with max-width ~1200px centered content columns. Hero is a left-aligned typographic statement (64px headline + 24px sub + composite input+button) over a large product screenshot that bleeds to the right edge. Section rhythm alternates between light editorial bands (Bone canvas, 64–128px vertical padding) and one full-bleed dark band (#1a1919 Live Counter strip). Content arrangement is consistently left-aligned within centered max-width containers; feature blocks use 2-column text-left/visual-right pairs. Grid usage: a 7-column logo grid (customer names), a 4-column testimonial scroll grid, and stacked metric strips. Navigation is a sticky top bar (white, hairline-bordered, with a 40px announcement strip above it). The overall feel is editorial-publication: generous whitespace, tight typographic columns, and rhythmic full-bleed interruptions rather than modular card grids.

## Agent Prompt Guide

Quick Color Reference:
- text: #0c0a08
- background: #f4f2f0
- card surface: #ffffff
- border: #e5e7eb
- muted text: #6d6c6b
- primary action: #e4f222 (filled action)

3-5 Example Component Prompts:
1. Hero headline: 64px lausanne weight 400, #0c0a08, line-height 1.0, on #f4f2f0 canvas. Subhead at 24px lausanne weight 400, #6d6c6b. Composite CTA: email input (#ffffff, 10px radius, 1px rgba(33,33,33,0.1) border, 24px left padding) flush beside a Primary Button (#e4f222 fill, #0c0a08 text, 6px radius, 20px horizontal padding).
2. Content card: #ffffff fill, 1px #e5e7eb border, 16px radius, 20px padding. 16px lausanne 400 #0c0a08 body text. No shadow — border does the elevation work.
3. Sticky nav: #ffffff fill, 1px #e5e7eb bottom border, 102px total height (40px announcement strip + 62px nav row). Logo left, centered nav links, Sign in + Highlighter Yellow 'See a demo' button right.
4. Live Counter strip: full-bleed #1a1919 band, uppercase 10px lausanne #6d6c6b labels, #ffffff metric values at 14px. Horizontally scrolling ticker.
5. Outlined Button: transparent fill, 1px #0c0a08 border, #0c0a08 text, 6px radius, 0px vertical / 12px horizontal padding.

## Signature Design Choices

1. Single-weight typography: lausanne at 400 only — hierarchy comes from size and tracking, not bold. Headlines at 64px with line-height 1.0 feel like editorial pull-quotes, not SaaS headers.
2. One chromatic accent rule: #e4f222 appears only on action surfaces. The page is otherwise a study in warm neutrals (Bone, Ink, Ash). This makes every chartreuse element register as 'money moving'.
3. Hairline borders over shadows: cards use 1px #e5e7eb outlines instead of box-shadow. The single detected shadow is an inset white highlight on the nav — a frosted edge, not a drop shadow.
4. Negative tracking on display, positive on caption: 64px headlines sit tight (lh 1.0), while 10px uppercase labels open up (ls 0.018em). The contrast between tight display and airy micro-labels defines the system's voice.
5. Font feature 'ss01': lausanne ships with stylistic set 01 enabled — likely alternate g/t shapes that give the typeface its editorial character. Always include in CSS.

## Motion Philosophy

Motion is utility-focused and moderate: 0.3–0.4s durations with ease-out timing. Transitions target color, background-color, border-color, fill, and stroke — not transform or opacity theatrics. The system avoids animation as ornament; motion signals state change (hover fills, link underlines, counter increments). Backdrop blurs (25px, 12px, 8px) appear on overlays and the sticky nav for a frosted-glass cue.

## Similar Brands

- **Linear** — Same monochrome-first UI philosophy with a single vivid accent color (Linear's violet) reserved exclusively for action surfaces, and near-identical hairline-border card approach over shadows.
- **Stripe** — Editorial-grade typography, tight display leading, generous whitespace, and a restrained palette where one accent color carries the brand's visual energy.
- **Notion** — Warm off-white canvas with ink-black text, single-weight sans-serif feel, and a flat component vocabulary that avoids heavy shadows or gradients.
- **Substack** — Publication-leaning layout with oversized tight-leading headlines, warm neutrals, and a deliberate flatness that reads as editorial rather than product UI.
- **Brex** — Direct fintech competitor sharing the same high-contrast monochrome base with one neon accent for CTAs and the same hairline-border card grammar.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-highlighter-yellow: #e4f222;
  --color-ink: #0c0a08;
  --color-obsidian: #1a1919;
  --color-paper: #ffffff;
  --color-bone: #f4f2f0;
  --color-ash: #6d6c6b;
  --color-hairline: #e5e7eb;
  --color-smoke: #d3d3d3;

  /* Typography — Font Families */
  --font-lausanne: 'lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2.2;
  --tracking-caption: 0.18px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --text-heading: 28px;
  --leading-heading: 1.14;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.05;
  --text-display: 64px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

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
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-156: 156px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-128px;
  --card-padding: 20-24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 6px;
  --radius-cards: 16px;
  --radius-inputs: 10px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.6) 0px 0px 2px 0px inset;

  /* Surfaces */
  --surface-canvas: #f4f2f0;
  --surface-card: #ffffff;
  --surface-wash: #f4f2f0;
  --surface-inverted: #1a1919;
  --surface-action: #e4f222;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-highlighter-yellow: #e4f222;
  --color-ink: #0c0a08;
  --color-obsidian: #1a1919;
  --color-paper: #ffffff;
  --color-bone: #f4f2f0;
  --color-ash: #6d6c6b;
  --color-hairline: #e5e7eb;
  --color-smoke: #d3d3d3;

  /* Typography */
  --font-lausanne: 'lausanne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2.2;
  --tracking-caption: 0.18px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --text-heading: 28px;
  --leading-heading: 1.14;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.05;
  --text-display: 64px;
  --leading-display: 1;

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
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-156: 156px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.6) 0px 0px 2px 0px inset;
}
```
