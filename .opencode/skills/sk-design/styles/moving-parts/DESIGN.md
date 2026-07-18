# Moving Parts — Style Reference
> Electric blueprint on matte paper — a monochrome architect's sheet that learned to glow blue. Pure black, pure white, one bolt of #0000ff.

**Theme:** mixed

Moving Parts is a high-contrast tool for builders: matte white canvas, pure black ink, and one electric blue (#0000ff) that does all the chromatic work — filled buttons, borders, active states, and the product surfaces themselves. The type system is deliberately polyglot: Unica77 carries the voice everywhere (with eight stylistic alternates engaged), Whyte Semi-Mono handles UI chrome and labels, and display moments pivot to extreme display faces like Druk XXCondensed at 195–248px and Fraunces serifs at 100-weight thin. Hierarchy comes from font selection and weight, not size alone. Cards float with very large radii (76–106px), shadows are rare and heavy (rgba(0,0,0,0.3) 15px 20px 30px), and yellow (#fffc52) appears as a flat accent surface to break sections — never as text or decorative gradient. A single conic-gradient sphere anchors the hero as the only ornamental flourish; everything else stays industrial and quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Ink | `#0000ff` | `--color-electric-ink` | Primary CTA fill, active nav, product surface backgrounds, chromatic borders — the only saturated color that carries meaning |
| Voltage Green | `#00d37c` | `--color-voltage-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Onyx | `#000000` | `--color-onyx` | Body text, headings, hairline borders, icon strokes — the dominant ink color |
| Pure | `#ffffff` | `--color-pure` | Page canvas, card surface, button text, dark-section contrast text |
| Carbon | `#121212` | `--color-carbon` | Dark-section background, deep UI surfaces, high-contrast text on light |
| Slate | `#1e1e1e` | `--color-slate` | Elevated dark surface inside dark sections, card on near-black |
| Fog | `#bcc1c7` | `--color-fog` | Quiet borders, disabled text, secondary icon strokes |
| Ash | `#999999` | `--color-ash` | Muted helper text, low-emphasis borders, placeholder color |
| Smoke | `#cfcfcf` | `--color-smoke` | Divider lines, subtle card borders, input resting state |
| Bone | `#efefef` | `--color-bone` | Section band, soft surface fill behind cards |
| Chalk | `#f4f4f4` | `--color-chalk` | Alternate section background, subtle grouping fill |
| Hi-Vis Yellow | `conic-gradient(rgb(87, 192, 241) 0%, rgb(74, 166, 232) 13%, rgb(134, 57, 162) 26%, rgb(239, 137, 159) 42%, rgb(234, 57, 42) 55%, rgb(239, 115, 53) 62%, rgb(245, 192, 68) 73%, rgb(245, 255, 84) 84%, rgb(160, 218, 83) 95%, rgb(87, 192, 241) 100%)` | `--color-hi-vis-yellow` | Accent panel surface, spotlight callout, tag fill — never text or border |

## Tokens — Typography

### Whyte Semi-Mono — UI chrome — monospace-flavored labels, nav links, small caps taglines, price text, code-adjacent captions. Its tabular geometry makes dense product UI legible without switching fonts · `--font-whyte-semi-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, GT America Mono
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 17px, 18px, 21px, 25px, 27px, 30px, 34px, 35px
- **Line height:** 1.06–1.36
- **Letter spacing:** -0.0060em, 0.0100em, 0.0400em
- **Role:** UI chrome — monospace-flavored labels, nav links, small caps taglines, price text, code-adjacent captions. Its tabular geometry makes dense product UI legible without switching fonts

### Unica77 — Primary voice — headings, body, nav, buttons, cards, hero. Engages stylistic alternates ss01–ss09 and 'salt' to differentiate product screenshots from marketing type · `--font-unica77`
- **Substitute:** Söhne, Inter Display, Neue Haas Grotesk
- **Weights:** 400, 500, 600, 700
- **Sizes:** 18px, 21px, 22px, 23px, 26px, 27px, 28px, 30px, 31px, 32px, 35px, 38px, 40px, 47px, 51px, 53px, 58px, 62px, 67px, 70px, 100px, 110px
- **Line height:** 0.92–1.81 (tight at display, 1.20 at body)
- **Letter spacing:** -0.04em at 100px, -0.03em at 58–70px, 0em at 27–35px, +0.03–0.04em on small caps labels
- **OpenType features:** `"salt" on, "ss01" on, "ss02" on, "ss03" on, "ss04" on, "ss05" on, "ss07" on, "ss08" on, "ss09" on`
- **Role:** Primary voice — headings, body, nav, buttons, cards, hero. Engages stylistic alternates ss01–ss09 and 'salt' to differentiate product screenshots from marketing type

### PP Neue Montreal — Geometric headline counterpoint — used when the page needs a rounder, friendlier display than Unica77 can provide · `--font-pp-neue-montreal`
- **Substitute:** Neue Montreal, Inter Display
- **Weights:** 400, 500
- **Sizes:** 27px, 32px, 60px, 81px, 98px
- **Line height:** 0.82–0.87
- **Letter spacing:** -0.0300em, -0.0100em, 0.0100em
- **Role:** Geometric headline counterpoint — used when the page needs a rounder, friendlier display than Unica77 can provide

### Fraunces 72pt Soft / SuperSoft — Serif accent at hairline weights — editorial pull quotes and contrast moments. Thinness creates softness that breaks the industrial rigour · `--font-fraunces-72pt-soft-supersoft`
- **Substitute:** Fraunces, Tiempos Headline
- **Weights:** 100, 200
- **Sizes:** 27px, 36px, 60px
- **Line height:** 1.06–1.35
- **OpenType features:** `"ss01" on`
- **Role:** Serif accent at hairline weights — editorial pull quotes and contrast moments. Thinness creates softness that breaks the industrial rigour

### Druk XXCondensed Super — Hero-scale display — used once, for maximum typographic spectacle. Ultra-condensed verticals fill the viewport · `--font-druk-xxcondensed-super`
- **Substitute:** Druk Wide, Compacta
- **Weights:** 400
- **Sizes:** 195px, 248px
- **Line height:** 1.20
- **Role:** Hero-scale display — used once, for maximum typographic spectacle. Ultra-condensed verticals fill the viewport

### TAN-BUSTER — Single decorative display moment — out-of-system character that signals craft over platform · `--font-tan-buster`
- **Substitute:** Tan Buster, Druk Wide
- **Weights:** 600
- **Sizes:** 91px
- **Line height:** 1.18
- **OpenType features:** `"ss01" on`
- **Role:** Single decorative display moment — out-of-system character that signals craft over platform

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400, 500, 600
- **Sizes:** 25px, 27px, 28px, 35px, 37px, 42px, 52px
- **Line height:** 0.98, 1.2, 1.38, 1.48
- **Letter spacing:** -0.004, -0.003
- **Role:** Inter — detected in extracted data but not described by AI

### ui-monospace — ui-monospace — detected in extracted data but not described by AI · `--font-ui-monospace`
- **Weights:** 400
- **Sizes:** 26px
- **Line height:** 1.2
- **Role:** ui-monospace — detected in extracted data but not described by AI

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400, 500, 600
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Fraunces 72pt SuperSoft — Fraunces 72pt SuperSoft — detected in extracted data but not described by AI · `--font-fraunces-72pt-supersoft`
- **Weights:** 200
- **Sizes:** 45px
- **Line height:** 1.06
- **Letter spacing:** -0.01
- **OpenType features:** `"ss01"`
- **Role:** Fraunces 72pt SuperSoft — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.36 | — | `--text-caption` |
| body-sm | 17px | 1.36 | 0.01px | `--text-body-sm` |
| subheading | 25px | 1.2 | -0.01px | `--text-subheading` |
| heading-sm | 30px | 1.18 | -0.005px | `--text-heading-sm` |
| heading | 47px | 1.05 | -0.04px | `--text-heading` |
| heading-lg | 70px | 0.96 | -0.04px | `--text-heading-lg` |
| display | 100px | 0.92 | -0.04px | `--text-display` |
| mega-display | 248px | 1.2 | — | `--text-mega-display` |

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
| 56 | 56px | `--spacing-56` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 84 | 84px | `--spacing-84` |
| 120 | 120px | `--spacing-120` |
| 148 | 148px | `--spacing-148` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| hero | 76px |
| pill | 9999px |
| cards | 90px |
| image | 14px |
| small | 3px |
| medium | 24px |
| buttons | 18px |
| decorative | 35px |
| large-cards | 106px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.3) 15px 20px 30px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 30px
- **Element gap:** 13px

## Components

### Primary CTA Button
**Role:** Single, unmistakable call to action

Filled #0000ff background, white text, ~18px radius, 14px vertical / 28px horizontal padding. Label in Unica77 600 at 18px, optional trailing arrow glyph. Use this and only this for the page's main action per screen.

### Ghost / Text Button
**Role:** Secondary action or link

Transparent fill, 1px #000000 border, #000000 text. Same 18px radius and 14/28 padding as the primary. Hover swaps fill to #000000 and text to #ffffff.

### Quantity Stepper
**Role:** Increment / decrement value

Pill control, 1px #000000 border, 9999px radius. Interior shows '−  1  +' in Whyte Semi-Mono 500, 18px. Stepper can be stacked with a unit label (e.g. '500g', 'Columbia') in Whyte Semi-Mono 400 below.

### Phone Mockup Frame
**Role:** Display product UI inside a device

~90px outer radius, ~1px black stroke, overflow hidden. Interior is #0000ff or #ffffff. Used to show live SwiftUI components and is the central image on most marketing sections.

### Product Detail Card
**Role:** E-commerce product showcase

White surface, 90px radius, heavy rgba(0,0,0,0.3) shadow at 15/20/30 offset/spread. Image at top fills with bleed, then ~30px padding, Unica77 700 price at 35–47px, Unica77 400 product name at 21–25px, small-caps Whyte Semi-Mono category tag at 12–17px.

### Yellow Accent Panel
**Role:** Featured content callout inside dark sections

#fffc52 fill, no border, 90–106px radius. Holds large Unica77 or PP Neue Montreal display text in #000000. Sits flat against a Carbon (#121212) background — no shadow, contrast does the lifting.

### Dark Section Panel
**Role:** Inverted content block

#121212 background, 90px outer radius on the cards inside. White (#ffffff) text, Whyte Semi-Mono labels in #bcc1c7, headings in Unica77 600. Internal dark cards lift to #1e1e1e.

### Floating Icon Tile
**Role:** Inline visual accent or social proof marker

14–24px radius square or pill, white or carbon fill, 1px black border. Holds a single monochrome icon or tiny product image. Appears scattered around hero and section compositions.

### Top Navigation Bar
**Role:** Primary site navigation

White or transparent, no border. Logo mark (geometric '□△' wordmark) in #000000 left, nav links in Unica77 500 at 18px, right. Sticky optional. No background blur — the page is quiet enough not to need it.

### Price Block
**Role:** Prominent pricing display

Unica77 700 at 45–60px, #000000 on white, or white on Carbon. Original price struck through in Whyte Semi-Mono 400 at 27px in #999999. Currency superscript at 0.5em.

### Section Headline Stack
**Role:** Above-the-fold title + subtitle + CTA

Two-line Unica77 700 headline at 70–100px with letter-spacing -0.04em, line-height 0.92–0.96. Subtitle in Unica77 400 at 25–30px, #000000. Primary CTA sits centered below the subtitle with 24–30px gap.

### Hero Conic Sphere
**Role:** Decorative hero accent

Round graphic with full conic gradient (blue → purple → red → orange → yellow → green → blue), no border, placed bottom-left of the hero composition. The only ornamental gradient in the system.

## Do's and Don'ts

### Do
- Use #0000ff as the sole chromatic action color — CTAs, active states, product surfaces, and chromatic borders all read from one swatch.
- Push display sizes to 70px and above; tighten letter-spacing to -0.04em at those sizes so headlines read as blocks, not lines.
- Engage Unica77 stylistic alternates (ss01–ss09) so headings, UI, and product mockups each pick a distinct voice from the same family.
- Use 90–106px radii for hero cards and 14–24px for product and image containers — the spread is intentional, not lazy.
- Drop to dark sections (#121212) with white text and 0px shadow when a band needs to feel like a showcase, not a page.
- Pair the blue CTA with a small black-on-white secondary action — never two chromatic buttons side by side.
- Anchor hero compositions with a single large-radius floating card or device frame so the layout feels three-dimensional.

### Don't
- Don't introduce a second saturated action color. If you need warmth, reach for the #fffc52 panel surface, not a red or orange button.
- Don't use a soft shadow. The system commits to one heavy card shadow or none at all — no blur under 15px, no spread under 20px.
- Don't set body text on tight tracking. Keep letter-spacing at 0 to +0.01em below 30px; only compress at display sizes.
- Don't mix Druk XXCondensed and TAN-BUSTER on the same surface — each is a one-time spectacle and they cancel each other out.
- Don't place chromatic text on chromatic backgrounds. Blue text on blue panels disappears; reserve #0000ff for fills and borders, not body copy.
- Don't fill buttons with a gradient, glow, or glass effect. Filled flat #0000ff is the rule.
- Don't use standard SaaS radii (6px, 8px, 12px) on hero cards. Commit to the oversized 76–106px family or stay sharp.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Default page background |
| 2 | Bone Band | `#efefef` | Quiet section separator |
| 3 | Chalk | `#f4f4f4` | Soft grouped surface |
| 4 | Hi-Vis Accent | `#fffc52` | Spotlight / featured panel |
| 5 | Carbon | `#121212` | Dark inverted section |
| 6 | Slate | `#1e1e1` | Elevated dark card inside Carbon sections |

## Elevation

- **Product detail card:** `0 15px 20px 30px rgba(0, 0, 0, 0.3)`

## Imagery

Imagery is overwhelmingly product UI, not photography. Phone mockups filled with blue, white, and black product screens do the heavy lifting across sections. The hero and scattered section accents use small floating icon tiles, abstract sphere renders (the conic-gradient orb is the only illustration in the system), and tight product crops against solid color backgrounds. No lifestyle photography, no candid scenes, no people. Iconography is monochrome line/fill at 1–1.5px stroke, contained in small rounded squares or pills. Imagery is text-dominant overall — visuals punctuate, they don't lead.

## Layout

The site is max-width contained (~1200px) on a pure white canvas, with frequent full-bleed dark bands breaking the rhythm. The hero is a centered headline stack with primary CTA and a composition of floating phone mockups, an abstract sphere, and small icon tiles bleeding to the edges. Mid-page sections are split text-left / product-right (alternating), with phone mockups filling the visual half. Feature sections collapse into 2- and 3-column card grids of oversized product cards. Dark inverted sections act as transitional showcases, followed by yellow accent panels. Vertical rhythm is comfortable — 80px section gaps with 30px card padding — and layout never feels dense. Navigation is a single thin top bar with a geometric wordmark and two text links.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- border: #000000 (1px hairlines) or #cfcfcf (quiet dividers)
- accent: #fffc52 (panel surface only)
- dark surface: #121212
- primary action: #0000ff (filled action)

## Example Component Prompts
1. **Section headline + CTA block**: Centered stack on #ffffff. Unica77 700 at 70px in #000000, letter-spacing -0.04em, line-height 0.96. Subtitle in Unica77 400 at 25px, #000000, 30px below. Primary CTA below subtitle: filled #0000ff, 18px radius, 14px/28px padding, label in Unica77 600 18px #ffffff with a trailing → glyph.

2. **Phone mockup with product UI**: 90px outer radius, 1px #000000 border, overflow hidden. Interior is #0000ff. Inside, a hanging product image centered, a 4-thumb horizontal row at 35px below, then 30px padding with small-caps Whyte Semi-Mono 500 12px category tag in #ffffff, Unica77 700 35px product name in #ffffff, Unica77 700 47px price in #ffffff.

3. **Dark section with yellow accent panel**: Full-bleed #121212 background. Left half holds a 90px-radius #fffc52 panel containing Unica77 700 81px #000000 headline. Right half holds a phone mockup (#ffffff interior) with light product UI. 80px vertical gap above and below the section.

4. **Quantity stepper with unit label**: Pill, 1px #000000 border, 9999px radius, 10px/16px padding. Inside: '−  1  +' in Whyte Semi-Mono 500 18px #000000. Stacked below: '500g' and 'Columbia' in Whyte Semi-Mono 400 17px #000000, left-aligned, 7px gap between rows.

5. **Product detail card on white**: 90px radius, shadow 0 15px 20px 30px rgba(0,0,0,0.3). Top half is a product image with bleed. 30px padding below: small-caps Whyte Semi-Mono 500 12px #999999 tag, then Unica77 700 27px #000000 product name, then Unica77 700 47px #000000 price.

## Similar Brands

- **Linear** — Same monochrome canvas with one electric chromatic accent, oversized card radii, and a type system that mixes geometric sans for UI with display faces for hero moments.
- **Vercel** — High-contrast white-and-black page model with a single saturated action color, large radii, and an industrial-not-warm tone throughout.
- **Raycast** — Full-bleed dark sections breaking a white page, oversized product UI as the central visual, and tight display tracking on geometric type.
- **Figma Config** — Editorial-grade type mixing (serif accents, condensed display, monospace UI) inside a hard-contrast framework with a single hero color.
- **Arc Browser** — Playful use of large radii, accent panels, and a single conic-gradient sphere or orb as the system's only ornamental flourish.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-ink: #0000ff;
  --color-voltage-green: #00d37c;
  --color-onyx: #000000;
  --color-pure: #ffffff;
  --color-carbon: #121212;
  --color-slate: #1e1e1e;
  --color-fog: #bcc1c7;
  --color-ash: #999999;
  --color-smoke: #cfcfcf;
  --color-bone: #efefef;
  --color-chalk: #f4f4f4;
  --color-hi-vis-yellow: #fffc52;
  --gradient-hi-vis-yellow: conic-gradient(rgb(87, 192, 241) 0%, rgb(74, 166, 232) 13%, rgb(134, 57, 162) 26%, rgb(239, 137, 159) 42%, rgb(234, 57, 42) 55%, rgb(239, 115, 53) 62%, rgb(245, 192, 68) 73%, rgb(245, 255, 84) 84%, rgb(160, 218, 83) 95%, rgb(87, 192, 241) 100%);

  /* Typography — Font Families */
  --font-whyte-semi-mono: 'Whyte Semi-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-unica77: 'Unica77', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraunces-72pt-soft-supersoft: 'Fraunces 72pt Soft / SuperSoft', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-druk-xxcondensed-super: 'Druk XXCondensed Super', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tan-buster: 'TAN-BUSTER', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraunces-72pt-supersoft: 'Fraunces 72pt SuperSoft', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.36;
  --text-body-sm: 17px;
  --leading-body-sm: 1.36;
  --tracking-body-sm: 0.01px;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.005px;
  --text-heading: 47px;
  --leading-heading: 1.05;
  --tracking-heading: -0.04px;
  --text-heading-lg: 70px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -0.04px;
  --text-display: 100px;
  --leading-display: 0.92;
  --tracking-display: -0.04px;
  --text-mega-display: 248px;
  --leading-mega-display: 1.2;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-56: 56px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-120: 120px;
  --spacing-148: 148px;
  --spacing-172: 172px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 30px;
  --element-gap: 13px;

  /* Border Radius */
  --radius-sm: 2.5px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-3xl: 24.1667px;
  --radius-3xl-2: 30.4583px;
  --radius-3xl-3: 35px;
  --radius-full: 50px;
  --radius-full-2: 72.5px;
  --radius-full-3: 76.6667px;
  --radius-full-4: 83.3333px;
  --radius-full-5: 90.3833px;
  --radius-full-6: 106.333px;

  /* Named Radii */
  --radius-hero: 76px;
  --radius-pill: 9999px;
  --radius-cards: 90px;
  --radius-image: 14px;
  --radius-small: 3px;
  --radius-medium: 24px;
  --radius-buttons: 18px;
  --radius-decorative: 35px;
  --radius-large-cards: 106px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.3) 15px 20px 30px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-bone-band: #efefef;
  --surface-chalk: #f4f4f4;
  --surface-hi-vis-accent: #fffc52;
  --surface-carbon: #121212;
  --surface-slate: #1e1e1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-ink: #0000ff;
  --color-voltage-green: #00d37c;
  --color-onyx: #000000;
  --color-pure: #ffffff;
  --color-carbon: #121212;
  --color-slate: #1e1e1e;
  --color-fog: #bcc1c7;
  --color-ash: #999999;
  --color-smoke: #cfcfcf;
  --color-bone: #efefef;
  --color-chalk: #f4f4f4;
  --color-hi-vis-yellow: #fffc52;

  /* Typography */
  --font-whyte-semi-mono: 'Whyte Semi-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-unica77: 'Unica77', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraunces-72pt-soft-supersoft: 'Fraunces 72pt Soft / SuperSoft', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-druk-xxcondensed-super: 'Druk XXCondensed Super', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tan-buster: 'TAN-BUSTER', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraunces-72pt-supersoft: 'Fraunces 72pt SuperSoft', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.36;
  --text-body-sm: 17px;
  --leading-body-sm: 1.36;
  --tracking-body-sm: 0.01px;
  --text-subheading: 25px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.005px;
  --text-heading: 47px;
  --leading-heading: 1.05;
  --tracking-heading: -0.04px;
  --text-heading-lg: 70px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -0.04px;
  --text-display: 100px;
  --leading-display: 0.92;
  --tracking-display: -0.04px;
  --text-mega-display: 248px;
  --leading-mega-display: 1.2;

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
  --spacing-56: 56px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-120: 120px;
  --spacing-148: 148px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-sm: 2.5px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-3xl: 24.1667px;
  --radius-3xl-2: 30.4583px;
  --radius-3xl-3: 35px;
  --radius-full: 50px;
  --radius-full-2: 72.5px;
  --radius-full-3: 76.6667px;
  --radius-full-4: 83.3333px;
  --radius-full-5: 90.3833px;
  --radius-full-6: 106.333px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.3) 15px 20px 30px 0px;
}
```
