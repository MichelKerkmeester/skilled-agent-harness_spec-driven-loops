# Dia Browser — Style Reference
> blackroom gallery meets editorial broadsheet. A pitch-dark stage opens onto a sunlit paper spread where a single serif headline anchors each section.

**Theme:** mixed

Dia's visual language is editorial and cinematic: a pitch-black hero that erupts into a screaming human face gives way to a calm, magazine-like expanse of white space, serif display headlines, and whisper-thin type. The system lives almost entirely in black and white (4% colorfulness) with surgical chromatic accents — lime wash, golden yellow, and a sweeping spectrum gradient that reads like a rainbow scar through the page. Components are floating and weightless: glassmorphic nav pills, 9999px-radius buttons that hover above their content, 20px-radius cards with barely-there shadows. Typography does the heavy emotional work — the ultra-condensed Exposure Variable at 112px with 0.85 line-height creates headline impact through vertical compression rather than weight, while ABC Oracle at 300-400 carries body copy with editorial calm. The page breathes: 80px section gaps, generous line-heights (2.19 for body), and asymmetric layouts that refuse the standard SaaS card grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#020204` | `--color-void-black` | Hero background, dramatic dark sections — the opening stage of the experience |
| Pure Black | `#000000` | `--color-pure-black` | Primary text, button text, icon fills — the dominant ink across all surfaces |
| Carbon | `#636363` | `--color-carbon` | Secondary text, muted nav, helper labels — softer than pure black for hierarchy |
| Slate | `#888888` | `--color-slate` | Tertiary text, inactive nav items, disabled states |
| Silver | `#c6c6c6` | `--color-silver` | Placeholder text, very subtle UI dividers |
| Soft Graphite | `#575757` | `--color-soft-graphite` | Dark button backgrounds on light surfaces — secondary action fill |
| Paper White | `#ffffff` | `--color-paper-white` | Primary page canvas and white card surfaces. Do not promote it to the primary CTA color |
| Bone | `#f8f8f8` | `--color-bone` | Page canvas, nav backgrounds, base surface beneath cards |
| Linen | `#efefef` | `--color-linen` | Button fills, pill backgrounds, header wash — slightly warmer than Bone, the dominant secondary surface |
| Lime Wash | `#f2fcb3` | `--color-lime-wash` | Accent background wash, highlight zones, editorial color punctuation |
| Saffron | `#ffdc5c` | `--color-saffron` | Secondary accent wash, warm highlight zones |
| Spectrum Marquee | `linear-gradient(270deg, #FD02F5, #FA3D1D 15.94%, #FFB005 42.76%, #E1E1FE 72.48%, #0358F7 100.02%, #340B05 150.75%)` | `--color-spectrum-marquee` | Sweeping rainbow gradient — the brand's signature motion element, traveling across hero and section dividers |

## Tokens — Typography

### Exposure Variable — Display headlines — the 112px whisper-weight serif that anchors hero and section titles. Its 0.85 line-height vertically compresses letters, making headlines feel carved and monumental rather than airy. Signature choice: anti-convention weight (300, not 700) and negative letter-spacing (-0.03em) create authority through restraint. Substitute: Playfair Display or DM Serif Display at weight 400 with tight tracking. · `--font-exposure-variable`
- **Substitute:** Playfair Display
- **Weights:** 300
- **Sizes:** 112px
- **Line height:** 0.85
- **Letter spacing:** -0.03em
- **Role:** Display headlines — the 112px whisper-weight serif that anchors hero and section titles. Its 0.85 line-height vertically compresses letters, making headlines feel carved and monumental rather than airy. Signature choice: anti-convention weight (300, not 700) and negative letter-spacing (-0.03em) create authority through restraint. Substitute: Playfair Display or DM Serif Display at weight 400 with tight tracking.

### Exposure VAR — Section headings and large nav — the bold companion to Exposure Variable. Used for 'Dia reads between the tabs' and feature titles. Tighter tracking at -0.05em at 48px gives headline density. Substitute: Inter Tight or a condensed grotesque. · `--font-exposure-var`
- **Substitute:** Inter Tight
- **Weights:** 650
- **Sizes:** 24px, 48px
- **Line height:** 1.17-1.25
- **Letter spacing:** -0.05em at 48px, -0.03em at 24px
- **Role:** Section headings and large nav — the bold companion to Exposure Variable. Used for 'Dia reads between the tabs' and feature titles. Tighter tracking at -0.05em at 48px gives headline density. Substitute: Inter Tight or a condensed grotesque.

### ABC Oracle — Body text, UI labels, subheadings, and large feature headlines (54px at weight 300). The workhorse font — its humanist sans quality keeps long-form copy legible at generous line-heights (2.19 for body). Weight 500 used sparingly for emphasis. The 54px weight 300 headline is the secondary display voice, lighter than Exposure VAR but in the same serif-adjacent register. Substitute: Söhne or Inter at matching weights. · `--font-abc-oracle`
- **Substitute:** Inter
- **Weights:** 300, 400, 500
- **Sizes:** 10px, 14px, 16px, 18px, 20px, 22px, 24px, 54px
- **Line height:** 1.11-2.19
- **Letter spacing:** -0.04em at 54px, -0.02em at 18px, normal elsewhere
- **Role:** Body text, UI labels, subheadings, and large feature headlines (54px at weight 300). The workhorse font — its humanist sans quality keeps long-form copy legible at generous line-heights (2.19 for body). Weight 500 used sparingly for emphasis. The 54px weight 300 headline is the secondary display voice, lighter than Exposure VAR but in the same serif-adjacent register. Substitute: Söhne or Inter at matching weights.

### ABC Oracle Triple — Button text, inline labels, UI microcopy — a narrower variant of Oracle designed for button and tag contexts. The wide line-height (2.19) suggests single-line button use with internal padding breathing. Substitute: Inter at 16px weight 400. · `--font-abc-oracle-triple`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 2.19
- **Role:** Button text, inline labels, UI microcopy — a narrower variant of Oracle designed for button and tag contexts. The wide line-height (2.19) suggests single-line button use with internal padding breathing. Substitute: Inter at 16px weight 400.

### ABC Favorit Mono — Eyebrow labels, step numbers (01, 02, 03), navigation metadata — all-caps at 13px with 0.1em tracking creates the editorial chapter-marker effect. The mono face contrasts with Oracle's humanist sans, creating typographic tension. · `--font-abc-favorit-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.23-1.27
- **Letter spacing:** 0.1em uppercase at 13px
- **Role:** Eyebrow labels, step numbers (01, 02, 03), navigation metadata — all-caps at 13px with 0.1em tracking creates the editorial chapter-marker effect. The mono face contrasts with Oracle's humanist sans, creating typographic tension.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| eyebrow | 13px | 1.23 | 1.3px | `--text-eyebrow` |
| body-sm | 16px | 2.19 | — | `--text-body-sm` |
| body | 18px | 1.5 | -0.36px | `--text-body` |
| body-lg | 20px | 1.5 | — | `--text-body-lg` |
| subheading | 22px | 1.36 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.72px | `--text-heading-sm` |
| heading | 48px | 1.17 | -2.4px | `--text-heading` |
| heading-lg | 54px | 1.11 | -2.16px | `--text-heading-lg` |
| display | 112px | 0.85 | -3.36px | `--text-display` |

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
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 70 | 70px | `--spacing-70` |
| 80 | 80px | `--spacing-80` |
| 90 | 90px | `--spacing-90` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| cards | 12px |
| pills | 20px |
| panels | 24px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.06) 0px 2px 8px 0px, rgba(0, 0, 0, 0.04) ...` | `--shadow-sm` |
| xl | `rgba(0, 0, 0, 0.6) 0px 8px 30px -8px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Hero Download Button
**Role:** Primary conversion — the most prominent CTA on the hero

White background (#ffffff), 20px radius, 0px vertical padding with 16px horizontal padding, text in pure black (#000000) at 16px ABC Oracle Triple. Sits centered below the tagline. The 20px radius (not full pill) gives it a soft, rounded-rectangle presence rather than a full pill — distinct from nav pills.

### Pill Navigation Button
**Role:** Top-level nav items in the glassmorphic nav bar

Transparent background with rgba(0,0,0,0.85) text, 20px radius, 0px vertical padding with 16px horizontal padding. Sits inside a frosted-glass nav container with backdrop blur 12-24px. Text is 14px ABC Oracle weight 400.

### Glass Navigation Bar
**Role:** Fixed top navigation — the floating command center

Bone background (#f8f8f8) with 16px radius, 1px border, backdrop blur 12-24px. Shadow: rgba(0,0,0,0.06) 0px 2px 8px. Contains logo mark (left) and nav pills (center) and Download CTA (right). Floats with margin from viewport edge.

### Text Link with Arrow
**Role:** Inline navigation within content sections

Transparent background, rgba(0,0,0,0.85) text, 16px radius, 20px vertical and 24px horizontal padding. ABC Oracle Triple at 16px. Used for 'Learn more' style links with trailing arrow.

### Pill Watch Button (Hero Video)
**Role:** Secondary hero CTA — watch the scream

Semi-transparent black background rgba(0,0,0,0.65), white text, 9999px full pill radius, 10px vertical and 20px right / 12px left padding. Contains a play icon (white triangle) at left, 16px ABC Oracle Triple label at right. Sits overlaid on the dark hero image.

### Feature Card (Decks / Live Work / Better Meetings)
**Role:** Product feature showcase cards in the grid sections

Bone or white background with subtle 1px border, large border-radius (12-24px), generous internal padding. Contains a tag pill at top (see below), heading, description text, and a product screenshot. Cards are large — nearly half the viewport width each in 2-column layout.

### Category Tag Pill
**Role:** Feature category labels (Decks, Live Work, Better Meetings, Profiles)

Linen background (#efefef) or similar light fill, 9999px full pill radius, small padding (~8px 16px). Text in dark gray or black at 14px ABC Oracle. Sits top-left of feature cards.

### Editorial Section Header
**Role:** Large section titles and subheadings

Exposure VAR at 48px weight 650, -0.05em letter-spacing, line-height 1.17, in pure black. Sometimes paired with a step number eyebrow (01, 02, 03) in 13px ABC Favorit Mono uppercase. Creates magazine-chapter feel.

### Numbered Step List
**Role:** Feature explanation sections (01, 02, 03)

Vertical list with 14px row-gap. Each step: 13px mono uppercase number in Carbon (#636363) above 18-20px heading in pure black above 16px body text in Carbon. Active step has bolder weight or darker text. Left-aligned with a thin vertical accent line.

### Product Screenshot Frame
**Role:** Browser/window chrome containers around product mockups

White background card with traffic-light dots (red, yellow, green) at top-left, tab bar with favicons, and 12px corner radius. Large drop-shadow filter (3-layer blur stack) makes the window float above the page surface.

### Dark Hero Section
**Role:** Opening full-viewport dramatic section

Void Black (#020204) background, full-bleed, with a large human photograph (screaming face) centered. Logo (Dia wordmark in white) at top, tagline in white at 18-22px below, Download button centered, and a pill watch button overlaid on the photo lower-center.

### Spectrum Gradient Bar
**Role:** Brand-defining rainbow motion element

Animated marquee gradient traveling left-to-right: pink (#FD02F5) → red (#FA3D1D) → yellow (#FFB005) → lavender (#E1E1FE) → blue (#0358F7) → brown (#340B05). Appears as a thin horizontal line/bar between sections or as a animated underline. The --student-marquee token value: linear-gradient(270deg, #FD02F5, #FA3D1D 15.94%, #FFB005 42.76%, #E1E1FE 72.48%, #0358F7 100.02%, #340B05 150.75%).

### Settings Toggle Row
**Role:** Privacy/personalization toggle items

Horizontal row with label text left, toggle switch right. 16px ABC Oracle weight 400. Toggle: pill shape with sliding indicator. Minimal chrome, no background fill on the row itself — sits on the page canvas.

## Do's and Don'ts

### Do
- Use 9999px radius for all interactive pills, tags, and the video play button — full rounding is the default for anything that triggers an action
- Set display headlines at 112px in Exposure Variable weight 300 with line-height 0.85 — the vertical compression is the signature, never loosen it
- Use 0.1em letter-spacing on all uppercase eyebrows and step numbers in ABC Favorit Mono at 13px — the tracking creates the editorial chapter-marker rhythm
- Apply 1px solid borders (28 uses) rather than shadows to define card edges — borders are the primary depth cue, shadows are reserved for floating elements only
- Place buttons as floating elements with 20px radius (not full pill) for primary CTAs, reserving 9999px for secondary pill controls
- Use the --student-marquee spectrum gradient sparingly — once per page maximum, as a section divider or hero accent, never as a fill
- Maintain 80px section gaps and 2.19 line-height on body text — generous spacing is non-negotiable for the editorial feel

### Don't
- Do not use bright saturated colors as background fills — the system is 96% achromatic; the only permitted color washes are lime (#f2fcb3) and saffron (#ffdc5c) in small editorial zones
- Do not set headlines at weight 600-700 — Dia speaks at weight 300 for display and 650 for subheadings; bold weights break the whisper-tone voice
- Do not use border-radius values outside the defined set (12, 16, 20, 24, 9999px) — improvised radii destroy the visual coherence
- Do not use multi-layer drop-shadow stacks on cards — the 3-layer filter is reserved for product screenshot windows only; regular cards use 1px borders
- Do not place colored buttons on colored backgrounds — the system uses black text on white/linen or white text on black, never chromatic fills
- Do not use line-height below 1.25 for any text — even the compressed 112px display keeps 0.85 only because the font is custom-designed for tight vertical fit; do not replicate this with system fonts
- Do not add hover transforms (scale, translate) to buttons — the system transitions only color, border, and opacity at 0.2s ease

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#020204` | Hero stage, dramatic dark openings |
| 1 | Paper | `#f8f8f8` | Default page canvas — the broadsheet paper feel |
| 2 | Card | `#ffffff` | Elevated content cards, product screenshot windows, button surfaces |
| 3 | Linen | `#efefef` | Button fills, pill backgrounds, subtle surface differentiation |
| 4 | Wash | `#f2fcb3` | Lime accent surface — editorial highlight zones |

## Elevation

- **Glass Navigation Bar:** `rgba(0, 0, 0, 0.06) 0px 2px 8px 0px, rgba(0, 0, 0, 0.04) 0px 0px 2px 0px`
- **Hero Download Button:** `rgba(0, 0, 0, 0.6) 0px 8px 30px -8px`
- **Product Screenshot Window:** `drop-shadow(rgba(0, 0, 0, 0.1) 0px 2px 4px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 18px 24px) drop-shadow(rgba(0, 0, 0, 0.18) 0px 40px 64px)`

## Imagery

Photography is used for emotional impact only — the hero features a dramatic close-up of a screaming man against pure black, no lifestyle context, no product integration. The image IS the message: browsers are frustrating, Dia is the catharsis. Product screenshots appear as floating browser-window mockups with traffic-light dots, tab bars, and full URL bars, treated as objects displayed on the page rather than embedded UI. The screenshots use real content (mountain landscape for 'Friday Brief', slide decks for 'Decks') to demonstrate Dia's output quality. No illustrations, no abstract graphics, no 3D renders. Icon style: minimal outlined icons, thin stroke weight, monochrome black or white. Imagery density is sparse — the page is text-dominant with one hero photograph and 3-4 product mockup windows, everything else is typography and white space.

## Layout

Full-bleed dark hero (1282500px area) transitions to centered max-width (~1200px) content sections. The hero is a full-viewport theatrical moment with a centered headline stacked over a human photograph. Content sections use a 2-column asymmetric layout: numbered step explanations (01, 02, 03) on the left at 40% width, large product screenshot cards on the right at 55% width, with a thin vertical accent line separating active steps. Feature grids use 2-column card layouts (not 3 or 4) with generous gutters — each card is massive, nearly half the viewport. Section rhythm alternates between light (#f8f8f8 canvas) and accent (lime #f2fcb3 or saffron #ffdc5c wash) bands, separated by 80px vertical gaps. Navigation is a floating glassmorphic pill bar centered at the top with backdrop blur, not a full-width header. The footer is minimal and dark, sitting on void black. The page reads top-to-bottom as: dark theater → broadsheet editorial → feature galleries → settings toggles → dark footer.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000 (primary), #636363 (secondary), #888888 (tertiary)
- Background: #f8f8f8 (page canvas), #ffffff (cards), #020204 (dark sections)
- Border: #000000 at 1px solid
- Accent: #f2fcb3 (lime wash), #ffdc5c (saffron wash)
- Brand gradient: linear-gradient(270deg, #FD02F5, #FA3D1D 15.94%, #FFB005 42.76%, #E1E1FE 72.48%, #0358F7 100.02%, #340B05 150.75%)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Editorial Section Header**: 48px Exposure VAR weight 650, color #000000, letter-spacing -2.4px, line-height 1.17. Pair with 13px ABC Favorit Mono step number above in #636363, uppercase, letter-spacing 1.3px. 80px margin-top from previous section.

2. **Glass Navigation Bar**: Floating pill bar, #f8f8f8 background, 16px border-radius, 1px border #000000, backdrop-filter blur(12px), shadow rgba(0,0,0,0.06) 0px 2px 8px. Logo on left, 3 nav items in center as 20px-radius transparent pills with 14px ABC Oracle text in rgba(0,0,0,0.85), Download button on right.

3. **Product Screenshot Window Card**: White #ffffff background, 12px border-radius, 3-layer drop-shadow filter (0px 2px 4px rgba(0,0,0,0.1), 0px 18px 24px rgba(0,0,0,0.12), 0px 40px 64px rgba(0,0,0,0.18)). Traffic-light dots (red, yellow, green) at top-left, tab bar with favicons. Contains product UI mockup.

4. **Feature Card with Category Pill**: Card on #f8f8f8 canvas, white #ffffff background, 12px radius, 20px padding. Category pill at top: #efefef background, 9999px radius, 14px ABC Oracle text in #000000. Heading below in 24px Exposure VAR weight 650. Body text in 16px ABC Oracle weight 400, color #636363, line-height 2.19. Product screenshot at bottom.

5. **Spectrum Gradient Divider**: Thin 2-4px tall horizontal bar spanning full width, filled with the student-marquee gradient (linear-gradient 270deg from #FD02F5 through #FA3D1D, #FFB005, #E1E1FE, #0358F7, to #340B05). Animated marquee motion at 0.3s ease. Place between major sections.

## Gradient System

Dia has 8 named gradients (--creamsicle, --grapefruit, --cotton-candy, --sunshine, --twilight, --midnight, --student, --student-marquee) but only the spectrum marquee is brand-defining. The student marquee is a 6-stop rainbow: pink #FD02F5 → red #FA3D1D → yellow #FFB005 → lavender #E1E1FE → blue #0358F7 → brown #340B05. It appears as an animated thin line/bar, not as a surface fill. The remaining 7 gradients are decorative 180deg blends (warm-to-cool, light-to-dark) used internally for illustrations and background washes. The gradient system's logic: all named gradients move from a warm stop at 60% to a cool stop at 100%, creating consistent temperature progression regardless of specific hues.

## Motion Philosophy

Motion is minimal and purpose-driven. Standard transition: 0.2s ease on background-color, border-color, color, fill, and stroke simultaneously — meaning every state change is a unified color shift, not a positional animation. The spectrum marquee gradient is the only continuous motion element, moving at moderate speed. Cubic-bezier(0.4, 0, 0.2, 1) (141 uses) serves as the secondary easing for slightly more dramatic transitions. No spring physics, no bounce, no elastic curves. The personality is 'quiet intelligence' — things change color, not position.

## Similar Brands

- **The Browser Company (Arc)** — Same parent studio's design DNA: floating glass nav, pill buttons, dramatic full-bleed hero photography, editorial section layouts with generous spacing
- **Linear** — Similar commitment to near-monochrome palette, custom display typography, and whisper-weight headlines that create hierarchy through restraint rather than weight
- **Stripe** — Shared editorial broadsheet aesthetic with serif display fonts, generous line-heights on body copy, and gradient spectrum accents used as brand-defining motion
- **Vercel** — Same floating glassmorphic nav pill pattern, generous section gaps, and dramatic full-bleed dark-to-light page transitions
- **Nothing.tech** — Similar dramatic dark-stage hero photography transitioning to clean white product content, with dot-matrix inspired typographic details

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #020204;
  --color-pure-black: #000000;
  --color-carbon: #636363;
  --color-slate: #888888;
  --color-silver: #c6c6c6;
  --color-soft-graphite: #575757;
  --color-paper-white: #ffffff;
  --color-bone: #f8f8f8;
  --color-linen: #efefef;
  --color-lime-wash: #f2fcb3;
  --color-saffron: #ffdc5c;
  --color-spectrum-marquee: #FA3D1D;
  --gradient-spectrum-marquee: linear-gradient(270deg, #FD02F5, #FA3D1D 15.94%, #FFB005 42.76%, #E1E1FE 72.48%, #0358F7 100.02%, #340B05 150.75%);

  /* Typography — Font Families */
  --font-exposure-variable: 'Exposure Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposure-var: 'Exposure VAR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-oracle-triple: 'ABC Oracle Triple', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-mono: 'ABC Favorit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-eyebrow: 13px;
  --leading-eyebrow: 1.23;
  --tracking-eyebrow: 1.3px;
  --text-body-sm: 16px;
  --leading-body-sm: 2.19;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.36;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.72px;
  --text-heading: 48px;
  --leading-heading: 1.17;
  --tracking-heading: -2.4px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -2.16px;
  --text-display: 112px;
  --leading-display: 0.85;
  --tracking-display: -3.36px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w650: 650;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-90: 90px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-cards: 12px;
  --radius-pills: 20px;
  --radius-panels: 24px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 8px 0px, rgba(0, 0, 0, 0.04) 0px 0px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.6) 0px 8px 30px -8px;

  /* Surfaces */
  --surface-void: #020204;
  --surface-paper: #f8f8f8;
  --surface-card: #ffffff;
  --surface-linen: #efefef;
  --surface-wash: #f2fcb3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #020204;
  --color-pure-black: #000000;
  --color-carbon: #636363;
  --color-slate: #888888;
  --color-silver: #c6c6c6;
  --color-soft-graphite: #575757;
  --color-paper-white: #ffffff;
  --color-bone: #f8f8f8;
  --color-linen: #efefef;
  --color-lime-wash: #f2fcb3;
  --color-saffron: #ffdc5c;
  --color-spectrum-marquee: #FA3D1D;

  /* Typography */
  --font-exposure-variable: 'Exposure Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposure-var: 'Exposure VAR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-oracle-triple: 'ABC Oracle Triple', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-mono: 'ABC Favorit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-eyebrow: 13px;
  --leading-eyebrow: 1.23;
  --tracking-eyebrow: 1.3px;
  --text-body-sm: 16px;
  --leading-body-sm: 2.19;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.36px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.36;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.72px;
  --text-heading: 48px;
  --leading-heading: 1.17;
  --tracking-heading: -2.4px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -2.16px;
  --text-display: 112px;
  --leading-display: 0.85;
  --tracking-display: -3.36px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-90: 90px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 8px 0px, rgba(0, 0, 0, 0.04) 0px 0px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.6) 0px 8px 30px -8px;
}
```
