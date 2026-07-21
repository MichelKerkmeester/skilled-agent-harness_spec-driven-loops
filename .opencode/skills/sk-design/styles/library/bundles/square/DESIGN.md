# Square — Style Reference
> blue signal on white steel.

**Theme:** mixed

Square's design system is a confident, white-canvas fintech language that lets one vivid blue do all the talking. The interface stays nearly monochrome: white surfaces, a soft gray page background, near-black text, and a single Signal Blue (#006aff) that punctuates CTAs, links, and the subscription form. Headlines lean on a geometric custom display face at near-display sizes (50–86px) with tight line-heights and negative tracking, creating a weight-of-restraint authority rather than shouting. Components are flat and minimal — a 4px-cornered filled button, a ghost variant, light-blue tinted feature cards with 24px image radii, and a single hard-edged dark footer band that flips the palette to black with white type and the same blue for the send button. Elevation is essentially absent: a 1px 16% black shadow on buttons is the only depth the system allows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#006aff` | `--color-signal-blue` | Primary CTAs, link text, active nav, submit buttons, icon accents — the sole chromatic voice in an otherwise achromatic system |
| Carbon | `#1a1a1a` | `--color-carbon` | Primary text, heading fills, dark icon strokes, nav labels — near-black that reads softer than pure black on white |
| Slate Gray | `#737373` | `--color-slate-gray` | Secondary text, helper copy, muted nav, input placeholder tone |
| Platinum | `#d9d9d9` | `--color-platinum` | Hairline borders, input outlines, subtle dividers between sections |
| Ash | `#b3b3b3` | `--color-ash` | Disabled text, tertiary metadata, very subtle structural lines |
| Cloud | `#f2f2f2` | `--color-cloud` | Page canvas beneath white cards, soft section background, muted surface |
| Paper | `#ffffff` | `--color-paper` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Obsidian | `#030303` | `--color-obsidian` | Dark footer section background, inverted surfaces — the only break from white |
| True Black | `#000000` | `--color-true-black` | Icon fills, monochrome graphic elements, SVG illustration strokes |

## Tokens — Typography

### Square Sans Display VF — Headlines and large display copy at 32–86px; the display weight (regular 400) at display sizes is a signature choice — most fintechs push 600–700 at this scale, Square uses the lighter weight with negative tracking to feel architectural rather than aggressive. System substitute: Inter Tight or Manrope at matching tracking. · `--font-square-sans-display-vf`
- **Substitute:** Inter Tight
- **Weights:** 400, 500
- **Sizes:** 16, 20, 24, 32, 50, 62, 86
- **Line height:** 0.97, 1.10, 1.12, 1.19, 1.25, 1.30, 1.33, 1.42, 1.50
- **Letter spacing:** -0.0120em
- **OpenType features:** `"ss01" on`
- **Role:** Headlines and large display copy at 32–86px; the display weight (regular 400) at display sizes is a signature choice — most fintechs push 600–700 at this scale, Square uses the lighter weight with negative tracking to feel architectural rather than aggressive. System substitute: Inter Tight or Manrope at matching tracking.

### Square Sans Text VF — Body copy, nav labels, footer text, card descriptions at 12–16px with relaxed 1.5–1.75 line-height for legibility. The same family as the display face keeps the text voice continuous — the only difference is size and tracking. System substitute: Inter or Söhne. · `--font-square-sans-text-vf`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16
- **Line height:** 1.38, 1.43, 1.50, 1.71, 1.75, 2.00, 2.63
- **Role:** Body copy, nav labels, footer text, card descriptions at 12–16px with relaxed 1.5–1.75 line-height for legibility. The same family as the display face keeps the text voice continuous — the only difference is size and tracking. System substitute: Inter or Söhne.

### Cash Sans — Button labels and in-line CTA microcopy at 18px medium — a distinct text face for actions so they read as tappable artifacts separate from body copy. Substitute: same family as text at 500 weight, or DM Sans Medium. · `--font-cash-sans`
- **Substitute:** DM Sans Medium
- **Weights:** 500
- **Sizes:** 18
- **Line height:** 1.00, 1.50
- **Role:** Button labels and in-line CTA microcopy at 18px medium — a distinct text face for actions so they read as tappable artifacts separate from body copy. Substitute: same family as text at 500 weight, or DM Sans Medium.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.29px | `--text-heading-sm` |
| heading | 32px | 1.19 | -0.38px | `--text-heading` |
| heading-lg | 50px | 1.1 | -0.6px | `--text-heading-lg` |
| display | 62px | 1 | -0.74px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 33 | 33px | `--spacing-33` |
| 47 | 47px | `--spacing-47` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 113 | 113px | `--spacing-113` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| icons | 32px |
| images | 24px |
| inputs | 4px |
| buttons | 4px |
| pillButtons | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.16) 0px 1px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 10-15px

## Components

### Primary Filled Button
**Role:** Main CTA across hero, feature cards, footer form

Solid Signal Blue (#006aff) background, white text in Cash Sans 18px medium, 4px corner radius, 10px vertical × 15px horizontal padding. Carries a single subtle shadow rgba(0,0,0,0.16) 0 1px 4px — the only elevation the system grants any component. No hover state color shift, no border.

### Ghost Outlined Button
**Role:** Secondary action alongside the primary

Transparent fill, 1px Signal Blue (#006aff) border, Signal Blue text in Cash Sans 18px, 4px radius, 10px × 15px padding. Always pairs horizontally with a filled primary button on the same baseline.

### Header Nav
**Role:** Top-level site navigation

White background, logo left (Carbon mark + Square wordmark), nav links in Square Sans Text 14px Carbon, right-aligned secondary actions. No visible bottom border; sits on white and reads through whitespace rather than a divider line.

### Hero Headline Block
**Role:** Primary above-the-fold message

Square Sans Display 62px / 1.0 line-height, Carbon (#1a1a1a), tracking -0.012em. Sub-copy at Square Sans Text 16px Slate Gray (#737373) sits ~18px below. Two-button row at 10px gap. Left-aligned, paired with a 24px-radius editorial photograph on the right.

### Feature Card
**Role:** Three-column solution overview

White card with a very light blue (Signal Blue at ~8% opacity) background fill, 24px image radius for the leading visual, 24px internal padding, 20px gap between image and headline. Title in Square Sans Display 24px Carbon, body in Square Sans Text 16px Carbon/Slate, bottom link in Signal Blue 16px with → arrow.

### Inverted Footer Section
**Role:** Email capture and contact band at page bottom

Full-bleed Obsidian (#030303) background, white headline in Square Sans Display 50px, Signal Blue link row directly beneath. Email input is 4px radius white field with Carbon text and a Signal Blue filled 'Enviar' button attached. White icon trio (mail, paper plane, smiley) at 32px render size on the right.

### Email Input with Attached Submit
**Role:** Newsletter capture inside the dark footer

White Paper (#ffffff) input field, 4px radius, Carbon text at Square Sans Text 16px, Slate Gray placeholder, no visible border. Signal Blue submit button flush against the right edge of the field, same 4px radius, white 'Enviar' label in Cash Sans 18px.

### Section Heading with Link
**Role:** Subsection introductions (e.g. 'Empieza a vender al instante')

Square Sans Display 50px / 1.10 Carbon, with a Signal Blue 16px link directly below prefixed by a small arrow or '→'. Heading and link share the same left-alignment axis; no decorative rules.

### Lifestyle Photography Block
**Role:** Hero image and card imagery

Full-bleed editorial photography with 24px corner radius on card contexts, sharp edges on hero. Warm, naturalistic, real-customer scenes — hands, devices, food, retail counters. No duotone, no overlay tint, no graphic treatment.

## Do's and Don'ts

### Do
- Use Signal Blue (#006aff) as the only chromatic element in the system — never introduce a second brand color, secondary accent, or decorative gradient.
- Set headlines in Square Sans Display at 400 weight with -0.012em tracking; use 50–86px sizes with line-heights between 1.0 and 1.19 so type feels architectural, not bulky.
- Give all editorial and card imagery a 24px corner radius; let hero photographs bleed edge-to-edge only on full-bleed sections.
- Pair every filled primary button with a ghost outlined variant of the same label, separated by a 10px gap, on a shared baseline.
- Use 4px radius for all buttons, inputs, and nav elements; reserve 20px exclusively for pill-shaped button variants and 32px for icon containers.
- Let cards lift off the page through the #ffffff on #f2f2f2 surface contrast — never add a drop shadow to a card or panel.
- Use Cash Sans 18px medium for every button label so actions read as a distinct typographic register from body copy.

### Don't
- Don't use Carbon (#1a1a1a) for button backgrounds — buttons are always Signal Blue filled, ghost blue outlined, or white-on-dark in the footer.
- Don't add drop shadows to cards, feature panels, or images — the only shadow allowed is the 1px 16% black on filled buttons.
- Don't use 600 or 700 weight on display headlines; the system relies on 400 weight at large sizes with negative tracking for its visual voice.
- Don't introduce semantic colors (green for success, red for error) into the neutral-by-default interface — accent is blue only.
- Don't break the white canvas with decorative gradients, colored section bands, or pattern fills — let the dark Obsidian footer be the single chromatic inversion.
- Don't use border-radius values outside the four-token set (4, 20, 24, 32) — inconsistent radii fragment the geometric discipline.
- Don't use letter-spacing on body copy; tracking adjustments are reserved for display sizes 24px and above.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f2f2f2` | Subtle off-white base that lets pure white cards lift off the page |
| 1 | Card Surface | `#ffffff` | Primary content surface for hero, feature cards, inputs, nav |
| 2 | Inverted Footer | `#030303` | Full-bleed dark band at page bottom for email capture and social |

## Elevation

- **Primary Filled Button:** `rgba(0, 0, 0, 0.16) 0px 1px 4px 0px`

## Imagery

Photography-led visual language: warm, naturalistic editorial scenes of merchants and customers interacting with phones and card readers. High-key lighting, candid hands-and-objects framing (fries on green paper, wooden tables, counter tops), no staged studio polish. Images are tightly cropped to human moments and devices, never wide environmental shots. No illustration, no 3D renders, no abstract graphics. Images sit in 24px-radius frames inside feature cards and bleed sharp-edged into the hero. The photography is the only source of warmth and color in the system — the UI itself is intentionally cold and minimal so the imagery feels like sunlight in a steel room.

## Layout

Max-width ~1200px centered container with generous horizontal padding. Hero is a two-column split: left-aligned headline + dual-button stack on roughly 45% width, right-aligned 24px-radius editorial photograph on 55%. Below the hero, a three-column equal-width feature card grid with ~24px gutters, each card stacking image → headline → body → blue link vertically. The page ends with a full-bleed dark footer band that spans edge to edge, breaking the centered grid. Vertical rhythm is comfortable and unhurried — roughly 96px between major sections, 10–15px between elements within a block. Navigation is a single white top bar, not sticky, not shadowed. No sidebar, no mega-menu — links are flat horizontal text.

## Agent Prompt Guide

Quick Color Reference:
- text: #1a1a1a (Carbon)
- background: #ffffff (Paper) over #f2f2f2 (Cloud) canvas
- border: #d9d9d9 (Platinum) hairlines
- accent: #006aff (Signal Blue) for links and icons
- primary action: no distinct CTA color
- dark surface: #030303 (Obsidian) for inverted footer band

Example Component Prompts:
1. Create a hero section: white #ffffff background, 1200px max-width centered. Left column holds a headline in Square Sans Display 62px weight 400, color #1a1a1a, line-height 1.0, letter-spacing -0.74px. Below at 18px gap, sub-copy in Square Sans Text 16px #737373. Then a button row: filled #006aff button (4px radius, 10px 15px padding, white Cash Sans 18px label 'Get started') next to a ghost button (1px #006aff border, transparent fill, #006aff text) with 10px gap. Right column holds a 24px-radius editorial photograph of a person using a phone at a table.

2. Create a three-column feature card grid: each card is #ffffff with a very light blue (~8% opacity of #006aff) background fill, 24px internal padding, a 24px-radius product image at the top, then a 20px gap, then a Square Sans Display 24px #1a1a1a title, then Square Sans Text 16px #1a1a1a body, then a #006aff 16px link with a → arrow. 24px gutter between cards, no shadows.

3. Create the dark footer band: full-bleed #030303 background, white headline in Square Sans Display 50px weight 400. Below, a Signal Blue (#006aff) link row at 16px. Email input: 4px radius white field, #1a1a1a text, #737373 placeholder, attached to a #006aff filled submit button (4px radius, white Cash Sans 18px label). To the right, three white icons (mail, paper plane, smiley) at 32px render size with no fill, stroke-only style.

## Blue Accent Discipline

Signal Blue is rationed, not splashed. It appears as: filled CTA buttons, ghost button borders, inline text links, the submit button, icon accents inside cards, and the subhead link arrow. It never appears as a card background tint at full saturation, never as a section background, never as a decorative shape, never as a gradient stop. The system treats blue as a vocabulary of ~3 functions (act, navigate, emphasize) and nothing else — this scarcity is what gives the single color its power.

## Similar Brands

- **Stripe** — Same single-accent-on-white approach with one bold blue and a custom geometric display face at large sizes for headlines
- **Linear** — Shares the restrained typographic voice — weight 400 at display sizes, tight tracking, one accent color doing all the work on a clean light canvas
- **Plaid** — Same fintech editorial photography (hands, devices, real merchants) paired with minimal white UI and a single chromatic link/accent color
- **Notion** — Similar near-black text (#1a1a1a) on white, minimal shadow discipline, and feature cards with soft surface tints instead of elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #006aff;
  --color-carbon: #1a1a1a;
  --color-slate-gray: #737373;
  --color-platinum: #d9d9d9;
  --color-ash: #b3b3b3;
  --color-cloud: #f2f2f2;
  --color-paper: #ffffff;
  --color-obsidian: #030303;
  --color-true-black: #000000;

  /* Typography — Font Families */
  --font-square-sans-display-vf: 'Square Sans Display VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-square-sans-text-vf: 'Square Sans Text VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cash-sans: 'Cash Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.29px;
  --text-heading: 32px;
  --leading-heading: 1.19;
  --tracking-heading: -0.38px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.6px;
  --text-display: 62px;
  --leading-display: 1;
  --tracking-display: -0.74px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-47: 47px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-113: 113px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 10-15px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Named Radii */
  --radius-icons: 32px;
  --radius-images: 24px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-pillbuttons: 20px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.16) 0px 1px 4px 0px;

  /* Surfaces */
  --surface-page-canvas: #f2f2f2;
  --surface-card-surface: #ffffff;
  --surface-inverted-footer: #030303;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #006aff;
  --color-carbon: #1a1a1a;
  --color-slate-gray: #737373;
  --color-platinum: #d9d9d9;
  --color-ash: #b3b3b3;
  --color-cloud: #f2f2f2;
  --color-paper: #ffffff;
  --color-obsidian: #030303;
  --color-true-black: #000000;

  /* Typography */
  --font-square-sans-display-vf: 'Square Sans Display VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-square-sans-text-vf: 'Square Sans Text VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cash-sans: 'Cash Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.29px;
  --text-heading: 32px;
  --leading-heading: 1.19;
  --tracking-heading: -0.38px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.6px;
  --text-display: 62px;
  --leading-display: 1;
  --tracking-display: -0.74px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-47: 47px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-113: 113px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.16) 0px 1px 4px 0px;
}
```
