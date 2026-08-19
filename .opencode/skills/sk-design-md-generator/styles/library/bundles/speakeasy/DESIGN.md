# Speakeasy — Style Reference
> Editorial broadsheet on a white field with a rainbow ribbon

**Theme:** light

Speakeasy is a near-monochromatic editorial system built on a vast white canvas, with one extraordinary move: a custom serif (Tobias) rendered at weight 100, stretched to 140px headlines that whisper rather than announce. The interface feels like a high-end print magazine that accidentally became a product page — generous breathing room, hairline dividers, flat surfaces, and a single vibrant gradient hairline at the page's top edge that acts as a signature ribbon. Color is rationed like ink: black and a warm gray scale do nearly all the work, while small chromatic accents (green, orange, yellow, violet, red) appear as functional punctuation inside icons, badges, and feature illustrations. Components are deliberately flat — borders over shadows, small radii, compact spacing — letting the type and the top rainbow gradient do the brand-building.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page and card surfaces, button text on dark fills, inverse text on black |
| Ash Gray | `#dbdbdb` | `--color-ash-gray` | Default hairline borders, dividers between sections, the most-used neutral border |
| Carbon | `#242424` | `--color-carbon` | Navigation borders, deep surface tone, alt black for softer contrast |
| Graphite | `#545454` | `--color-graphite` | Body text, icon strokes, secondary text, muted UI labels |
| Smoke | `#969696` | `--color-smoke` | Tertiary text, placeholder labels, disabled icon outlines, decorative dot fields |
| Slate | `#7a7a7a` | `--color-slate` | Muted helper text, subtle borders, supporting metadata |
| Bone | `#e7e7e7` | `--color-bone` | Light borders, subtle surface separators, ghost button outlines |
| Iron | `#414141` | `--color-iron` | Icon strokes, dark borders, button shadows, dense text |
| Obsidian | `#333333` | `--color-obsidian` | Filled button background — the system’s only CTA fill, paired with white text |
| Mist | `#f1f1f1` | `--color-mist` | Subtle elevated surfaces, off-white section bands, card hover wash |
| Cinder | `#121212` | `--color-cinder` | Deepest text and badge backgrounds, near-black accent |
| Signal Green | `#009966` | `--color-signal-green` | Green outline accent for tags, dividers, and focused UI edges |
| Spring Mint | `#00bc7d` | `--color-spring-mint` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Fern | `#00d492` | `--color-fern` | Soft badge backgrounds, callout fills, gradient end-stop |
| Ember Orange | `#e17100` | `--color-ember-orange` | Icon strokes and feature-card illustrations — the warmest functional accent in iconography |
| Marigold | `linear-gradient(90deg, rgb(51, 15, 31) 0%, rgb(200, 50, 40) 12.56%, rgb(251, 136, 65) 25.06%, rgb(211, 221, 146) 37.56%, rgb(89, 130, 79) 50.06%, rgb(0, 36, 20) 62.06%, rgb(0, 20, 61) 74.06%, rgb(40, 116, 215) 86.06%, rgb(153, 194, 255) 97.06%)` | `--color-marigold` | Vivid icon fills, alert-tinged highlights, gradient mid-stop; The signature top-of-page gradient hairline — 9-stop spectrum from maroon through amber, green, indigo, to sky |
| Amber | `#ffb900` | `--color-amber` | Tag/badge backgrounds, warm highlight washes, featured callout fills |
| Coral | `#ff6467` | `--color-coral` | Red outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Iris Blue | `#155dfc` | `--color-iris-blue` | Link and icon accent — the only saturated blue, used sparingly for emphasis strokes |

## Tokens — Typography

### ui-sans-serif (system) — UI chrome — nav labels, buttons, badges, table data, form fields. Renders as a system font (San Francisco / Segoe UI / Roboto fallback). Small sizes (9–13px) handle the dense secondary UI; 16–18px for button text. Wide tracking (0.05em) on uppercase micro-labels like “THE PROBLEM”. · `--font-ui-sans-serif-system`
- **Substitute:** System UI sans (San Francisco / Segoe / Roboto)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 9px, 10px, 11px, 12px, 13px, 14px, 16px, 18px
- **Line height:** 1.43–1.75
- **Letter spacing:** 0.0030em body, 0.0500em uppercase micro-labels
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** UI chrome — nav labels, buttons, badges, table data, form fields. Renders as a system font (San Francisco / Segoe UI / Roboto fallback). Small sizes (9–13px) handle the dense secondary UI; 16–18px for button text. Wide tracking (0.05em) on uppercase micro-labels like “THE PROBLEM”.

### Tobias — Display and headline serif — used at massive sizes (up to 140px) for hero statements, section openers, and oversized editorial moments. The weight-100 thinness is the brand’s single most distinctive choice; it makes headlines feel engraved rather than printed. No system font replicates this — substitute with a hairline serif (e.g. “Tobias”, “GT Super”, or “Fraunces 100”). · `--font-tobias`
- **Substitute:** GT Super Thin, Fraunces 100, or any high-contrast hairline serif
- **Weights:** 100
- **Sizes:** 20px, 38px, 51px, 67px, 140px
- **Line height:** 1.00–1.40
- **Letter spacing:** -0.0400em at 51–140px, -0.0200em at 38px
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** Display and headline serif — used at massive sizes (up to 140px) for hero statements, section openers, and oversized editorial moments. The weight-100 thinness is the brand’s single most distinctive choice; it makes headlines feel engraved rather than printed. No system font replicates this — substitute with a hairline serif (e.g. “Tobias”, “GT Super”, or “Fraunces 100”).

### Diatype — Primary body and subheading sans — compact, neutral, engineered for reading. Weight 300 for lighter pull-quotes, 400 for body, 500 for subhead emphasis. The slight contrast with Tobias gives the editorial pairing its rhythm. Substitute with Inter, Söhne, or Geist. · `--font-diatype`
- **Substitute:** Inter, Söhne, or Geist
- **Weights:** 300, 400, 500
- **Sizes:** 14px, 16px, 18px, 23px, 26px
- **Line height:** 1.29–1.75
- **Letter spacing:** 0.0020em at 14–26px
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** Primary body and subheading sans — compact, neutral, engineered for reading. Weight 300 for lighter pull-quotes, 400 for body, 500 for subhead emphasis. The slight contrast with Tobias gives the editorial pairing its rhythm. Substitute with Inter, Söhne, or Geist.

### speakeasyAscii — speakeasyAscii — detected in extracted data but not described by AI · `--font-speakeasyascii`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **OpenType features:** `"calt", "rlig", "ss01"`
- **Role:** speakeasyAscii — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.43 | 0.05px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.03px | `--text-body-sm` |
| body | 16px | 1.75 | 0.03px | `--text-body` |
| subheading | 18px | 1.6 | 0.02px | `--text-subheading` |
| heading-sm | 23px | 1.38 | 0.02px | `--text-heading-sm` |
| heading | 38px | 1.3 | -0.76px | `--text-heading` |
| heading-lg | 51px | 1.2 | -2.04px | `--text-heading-lg` |
| display | 67px | 1.1 | -2.68px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 23 | 23px | `--spacing-23` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| badges | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |
| subtle-2 | `rgb(65, 65, 65) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.05...` | `--shadow-subtle-2` |
| subtle-3 | `rgb(255, 255, 255) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0...` | `--shadow-subtle-3` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 6px

## Components

### Filled Dark Button
**Role:** Primary action — used for the highest-priority CTA on each page

Background #333333 (Obsidian), text #ffffff, border 1px solid #333333, border-radius 4px, padding 10px 16px, font 14px ui-sans-serif weight 500, uppercase tracking. Inset shadow (rgb(65,65,65) 0 2px 1px inset / rgba(0,0,0,0.05) 0 -2px 1px inset) gives a pressed-paper tactile feel.

### Outlined Ghost Button
**Role:** Secondary action — paired alongside the filled CTA

Background transparent, text #333333, border 1px solid #333333, border-radius 4px, padding 10px 16px, font 14px ui-sans-serif weight 500, uppercase tracking. Light inset highlight (rgb(255,255,255) 0 2px 1px inset / rgba(0,0,0,0.1) 0 -2px 1px inset).

### Top Nav Link
**Role:** Primary navigation items

Font 14px ui-sans-serif weight 500, color #242424, no underline. Chevron dropdown indicator in #545454. Active/hover state transitions to underline or weight shift — no color change.

### Top Nav Pill Button
**Role:** Header CTA — Book a Demo

Same as Filled Dark Button but in the header context, slightly smaller scale: 12–14px text, 4px radius, 8px 16px padding.

### NEW Badge
**Role:** Editorial flag on inline announcement links

Inline label, font 10–11px ui-sans-serif weight 600 uppercase, 0.05em tracking, border 1px solid #dbdbdb, border-radius 4px, padding 2px 6px, text #242424, background #ffffff. Sits inside a pill-shaped announcement row with border #dbdbdb and 4px radius.

### Announcement Pill
**Role:** Inline editorial callout above the hero

Full-width inline row, 1px #dbdbdb border, 4px radius, white background, contains a NEW badge + short text link + chevron arrow. Padding 8px 12px. Font 13px ui-sans-serif.

### Section Eyebrow Label
**Role:** All-caps micro-label above section headlines (e.g. “THE PROBLEM”)

Font 11–12px ui-sans-serif weight 500, uppercase, 0.05em letter-spacing, color #545454, centered or left-aligned depending on section.

### Display Headline
**Role:** Hero and major section headlines

Tobias weight 100, 51–67px (hero can reach 140px), line-height 1.10–1.20, letter-spacing -0.04em, color #000000. This is the signature element — paper-thin serif strokes at massive scale.

### Feature Card
**Role:** Three-column grid card for product features

Background #ffffff, border 1px solid #dbdbdb, border-radius 8px, padding 24px, optional subtle shadow. Contains a small orange icon at top (Iris Blue or Ember Orange stroke 1.5–2px), 18px Diatype subhead, 14–16px body text in #545454.

### Logo Cloud Cell
**Role:** Customer/partner logo display in a row

No container — logos float on #ffffff canvas in a single horizontal row, grayscale treatment (color #545454 to #969696), equal spacing 32–48px gap, aligned to a shared baseline.

### Halftone Illustration
**Role:** Decorative dotted/halftone graphic element

Vector illustration rendered as a halftone dot field in #545454 or #969696, used as a large visual element beside hero text or between sections. No container — the dot field IS the shape (animals, abstract patterns).

### Stacked 3D Layer Diagram
**Role:** Isometric stacked-layer illustration in the solution section

Three or more isometric rectangular layers, each in a different pastel tint (lavender, butter yellow, white), with small icon + uppercase label on each layer face. No border, no shadow — the layers sit on the white canvas with very soft 5–10% tinted fills.

### Rainbow Ribbon Bar
**Role:** The signature 3px-tall gradient hairline at the very top of every page

Full viewport width, 3px height, 9-stop linear gradient (maroon → red → amber → yellow-green → green → deep green → indigo → blue → sky blue). No padding, no margin. Sits flush against the top of the viewport above the nav.

### Agent View FAB
**Role:** Floating action button — bottom-right persistent chat trigger

Background #ffffff, border 1px solid #dbdbdb, border-radius 9999px, padding 8px 14px, font 12px ui-sans-serif weight 500, fixed bottom-right 16px 16px, subtle drop shadow rgba(0,0,0,0.1) 0 4px 6px. Contains a small icon + 'Agent view' label.

## Do's and Don'ts

### Do
- Use Tobias at weight 100 for all display and hero headlines — never substitute a bold serif; the thinness is the brand.
- Set filled CTA backgrounds to #333333 (Obsidian) with white text and 4px radius — this is the system’s only action color.
- Define card and section separators with 1px solid #dbdbdb borders, not shadows — borders are the depth mechanism.
- Place the 9-stop rainbow gradient as a 3px hairline at the absolute top of every page, flush to the viewport edge.
- Pair Diatype body text (weight 400) with Tobias headlines (weight 100) — the weight contrast is the editorial system’s engine.
- Reserve chromatic colors (Signal Green, Ember Orange, Iris Blue, Marigold) for icons, badges, and small status indicators — never as large fills.
- Use uppercase ui-sans-serif at 11–12px with 0.05em tracking for all section eyebrows (THE PROBLEM, THE SOLUTION).

### Don't
- Do not bolden or weight-shift Tobias headlines above 100 — the hairline is the entire point.
- Do not use chromatic fills for primary buttons — the CTA must stay neutral #333333, letting type carry the emphasis.
- Do not stack drop shadows to create card depth — use a 1px #dbdbdb border instead, or nothing at all.
- Do not use the chromatic accents (orange, green, violet, red) as large background areas — they belong inside icons and small tags only.
- Do not set body text below 14px or above 18px in Diatype — the 14–18px range is the reading zone.
- Do not replace the rainbow ribbon with a single-color or duotone bar — the full spectrum is the signature.
- Do not introduce a second serif or competing display face — Tobias owns the editorial space exclusively.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background — pure white, no off-white tint |
| 1 | Raised | `#f1f1f1` | Subtle elevated sections, card hover wash, secondary background bands |
| 2 | Divider | `#dbdbdb` | Hairline border tone that also reads as a subtle gray band in some sections |
| 3 | Accent Wash | `#ffb900` | Highlight backgrounds, tag fills, callout panels |
| 4 | Inverse | `#333333` | CTA button surface — the only dark fill in the system |

## Elevation

- **Button (filled):** `rgb(65, 65, 65) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.05) 0px -2px 1px 0px inset`
- **Button (light):** `rgb(255, 255, 255) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.1) 0px -2px 1px 0px inset`
- **Floating Card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Subtle Surface:** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`

## Imagery

Imagery is sparse and editorial. The dominant visual motif is the halftone dot illustration — vector shapes (often animals, abstract organic forms, or geographic silhouettes) rendered as a field of small dots in #545454 to #969696, sitting on the white canvas with no container, no background, no frame. These illustrations function as atmospheric scale-anchors next to hero text, not as explanatory diagrams. Product moments use minimal isometric layered illustrations in pastel tints (lavender, butter, cream) with tiny label chips. Photography is absent — there are no human or product photos. Logos in the social-proof cloud are rendered in flat grayscale (#545454) at equal visual weight. Icon style is thin-stroke (1.5–2px) line icons, often in Ember Orange or Iris Blue, used at 20–24px inside feature cards. The overall image-to-text ratio is low — text and typography dominate, with illustration providing occasional relief.

## Layout

Max-width 1200px centered content column on a full-bleed white canvas. The hero uses a two-column split: left half holds the eyebrow + display headline + body text + dual CTAs (filled + ghost), right half holds a large halftone illustration. Section rhythm is a repeating pattern of (1) a thin #dbdbdb horizontal divider, (2) a centered single-column statement section with oversized Tobias headline, (3) a 3-column card grid for features, (4) a two-column split (text + isometric illustration) for solution sections. Section gaps are 80px with comfortable internal padding. Navigation is a single thin top bar — logo left, links center, utility actions + CTA right — sitting directly below the 3px rainbow ribbon. A persistent floating 'Agent view' button sits bottom-right at 16px inset. The page alternates between full-width sections and contained 1200px content, with no sidebar or off-canvas pattern.

## Agent Prompt Guide

**Quick Color Reference**
- Primary text: #000000
- Background: #ffffff
- Border: #dbdbdb
- Muted text: #545454
- Filled button: #333333 (white text)
- primary action: #333333 (filled action)

**3-5 Example Component Prompts**

1. **Hero section**: White background (#ffffff). Centered or left-aligned 67px Tobias weight 100 headline in #000000, letter-spacing -2.68px. Body subtext in 16px Diatype weight 400, color #545454. Filled dark button (#333333, white text, 4px radius, 10px 16px padding, 14px ui-sans-serif weight 500 uppercase) paired with an outlined ghost button (#333333 border, transparent fill, same dimensions). A 1px #dbdbdb border announcement pill sits above the headline containing a NEW badge.

2. **Feature card grid**: Three equal columns, 24px gap, 24px card padding. Each card: white #ffffff background, 1px #dbdbdb border, 8px radius. Top contains a 24px line icon in Ember Orange (#e17100) stroke 1.5px. Subhead in 18px Diatype weight 500 #000000, body in 16px Diatype weight 400 #545454. No shadow.

3. **Section eyebrow + display headline**: Centered stack. Eyebrow: 12px ui-sans-serif weight 500 uppercase, 0.05em tracking, #545454. Headline: 51px Tobias weight 100, -2.04px letter-spacing, #000000, line-height 1.20. Body below: 16px Diatype weight 400 #545454, max-width 640px.

4. **Logo cloud row**: Full-width band, 1px #dbdbdb top and bottom borders, white #ffffff background. 8 logos in a single horizontal row, grayscale (#545454), 48px gap, vertically centered, no captions.

5. **Stacked layer diagram**: Right column of a two-column section. 4 isometric rectangular layers, each rotated -15deg on Y-axis, stacked vertically with 8px gap. Layer fills: #ede9fe, #fef3c7, #ffffff, #f1f1f1. Each layer face has a 10px uppercase label in #545454 and a 14px icon. No border, no shadow on the diagram.

## Type Pairing Logic

The Tobias + Diatype pairing is engineered around weight inversion: headlines go ultra-thin (100) while body stays mid-weight (400), producing maximum contrast at minimum visual cost. Subheadings in Diatype (weight 500) act as a bridge. The third tier — ui-sans-serif for all chrome (nav, buttons, badges, eyebrows) — stays in the 400–500 range, so it never competes with the editorial type. Letter-spacing follows size: -0.04em at 51px+ for Tobias, 0.02–0.03em at body sizes, 0.05em on uppercase micro-labels. The font-feature-settings (“calt”, “rlig”, “ss01”) are shared across all three families, suggesting a unified stylistic set that governs ligatures and alternate glyphs — these should be carried into any substitute font.

## Similar Brands

- **Linear** — Same restrained monochromatic canvas, hairline border depth model, and a single dark filled CTA — the shared DNA is borders-not-shadows and editorial type restraint.
- **Stripe** — Same gradient-ribbon signature (Stripe’s mesh gradients, Speakeasy’s top rainbow hairline) and the same combination of massive thin-serif headlines with monochrome supporting UI.
- **Vercel** — Same near-zero color palette, oversized hairline type for hero statements, and halftone/dot-field illustrations as decorative scale-anchors beside text.
- **Resend** — Same editorial-broadsheet atmosphere — white canvas, weight-100 serif at huge sizes, chromatic accents rationed to icons and small tags only.
- **Cursor** — Same dark filled button as the only CTA color, thin 1px borders on all surfaces, and 4–8px small radii for a flat product feel.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #dbdbdb;
  --color-carbon: #242424;
  --color-graphite: #545454;
  --color-smoke: #969696;
  --color-slate: #7a7a7a;
  --color-bone: #e7e7e7;
  --color-iron: #414141;
  --color-obsidian: #333333;
  --color-mist: #f1f1f1;
  --color-cinder: #121212;
  --color-signal-green: #009966;
  --color-spring-mint: #00bc7d;
  --color-fern: #00d492;
  --color-ember-orange: #e17100;
  --color-marigold: #fe9a00;
  --gradient-marigold: linear-gradient(90deg, rgb(51, 15, 31) 0%, rgb(200, 50, 40) 12.56%, rgb(251, 136, 65) 25.06%, rgb(211, 221, 146) 37.56%, rgb(89, 130, 79) 50.06%, rgb(0, 36, 20) 62.06%, rgb(0, 20, 61) 74.06%, rgb(40, 116, 215) 86.06%, rgb(153, 194, 255) 97.06%);
  --color-amber: #ffb900;
  --color-coral: #ff6467;
  --color-iris-blue: #155dfc;

  /* Typography — Font Families */
  --font-ui-sans-serif-system: 'ui-sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias: 'Tobias', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-speakeasyascii: 'speakeasyAscii', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.03px;
  --text-body: 16px;
  --leading-body: 1.75;
  --tracking-body: 0.03px;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: 0.02px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.02px;
  --text-heading: 38px;
  --leading-heading: 1.3;
  --tracking-heading: -0.76px;
  --text-heading-lg: 51px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -2.04px;
  --text-display: 67px;
  --leading-display: 1.1;
  --tracking-display: -2.68px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 6px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-badges: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgb(65, 65, 65) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.05) 0px -2px 1px 0px inset;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.1) 0px -2px 1px 0px inset;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-raised: #f1f1f1;
  --surface-divider: #dbdbdb;
  --surface-accent-wash: #ffb900;
  --surface-inverse: #333333;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #dbdbdb;
  --color-carbon: #242424;
  --color-graphite: #545454;
  --color-smoke: #969696;
  --color-slate: #7a7a7a;
  --color-bone: #e7e7e7;
  --color-iron: #414141;
  --color-obsidian: #333333;
  --color-mist: #f1f1f1;
  --color-cinder: #121212;
  --color-signal-green: #009966;
  --color-spring-mint: #00bc7d;
  --color-fern: #00d492;
  --color-ember-orange: #e17100;
  --color-marigold: #fe9a00;
  --color-amber: #ffb900;
  --color-coral: #ff6467;
  --color-iris-blue: #155dfc;

  /* Typography */
  --font-ui-sans-serif-system: 'ui-sans-serif (system)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias: 'Tobias', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-diatype: 'Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-speakeasyascii: 'speakeasyAscii', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.03px;
  --text-body: 16px;
  --leading-body: 1.75;
  --tracking-body: 0.03px;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: 0.02px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.02px;
  --text-heading: 38px;
  --leading-heading: 1.3;
  --tracking-heading: -0.76px;
  --text-heading-lg: 51px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -2.04px;
  --text-display: 67px;
  --leading-display: 1.1;
  --tracking-display: -2.68px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgb(65, 65, 65) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.05) 0px -2px 1px 0px inset;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.1) 0px -2px 1px 0px inset;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
