# Aira — Style Reference
> Sunday broadsheet at midnight — warm photography, ink type, whisper-quiet UI.

**Theme:** light

Aira uses an editorial-monochrome language: warm photographic atmospherics over a near-achromatic UI built on a single off-white canvas and ink-black type. The signature move is the serif display face (Gestura) paired against Inter for everything functional — a serif headline at 56-72px makes a fintech-adjacent AI tool feel like a Sunday business paper, not a dashboard. The interface stays paper-quiet: pill buttons, hairline borders, one dark surface per section, and almost no chromatic accent — the single warm photographic hero carries all the emotional temperature. Color appears only as the absence of color, so contrast (white → near-black) and material (soft shadow, gentle radius) do the heavy lifting that a typical SaaS palette would.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#fafafb` | `--color-bone-white` | Primary canvas, card surfaces, button text, input fills |
| Graphite Ink | `#2c2c2b` | `--color-graphite-ink` | Primary borders, hairline dividers, link underlines, heading accents |
| Deep Coal | `#1f1f1f` | `--color-deep-coal` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Obsidian | `#111111` | `--color-obsidian` | Body and heading text at maximum weight, dark hero overlays, icon strokes |
| Press Black | `#080808` | `--color-press-black` | Hardest text and button fills where pure black is needed for contrast over warm photography |
| Stone | `#70706f` | `--color-stone` | Secondary body text, helper copy, muted icon strokes |
| Fog | `#cbcbcb` | `--color-fog` | Disabled button borders, low-emphasis outlines, decorative hairlines |
| Ash Gray | `#e3e3e3` | `--color-ash-gray` | Badge fills, input borders, tag backgrounds — the lightest non-canvas neutral |
| Cloud | `#ededed` | `--color-cloud` | Elevated card backgrounds, subtle surface lift above the canvas |
| Slate | `#444444` | `--color-slate` | Mid-weight button borders, heavy outlines on dark surfaces |

## Tokens — Typography

### Gestura (custom serif) — Display and editorial headlines. The serif is the brand's single most recognizable choice — it converts what would be a standard AI-tool landing into a financial-broadsheet feel. Used at 36-66px for hero/section headlines and at 20-30px for subheadings. · `--font-gestura-custom-serif`
- **Substitute:** Fraunces (Google Fonts) or Source Serif Pro
- **Weights:** 400, 600
- **Sizes:** 14, 20, 24, 30, 36, 48, 56, 66px
- **Line height:** 1.00–1.20 for display; 1.40 for small headings
- **Letter spacing:** -0.020em at 66px → -0.007em at 14px; always negative, tighter as size grows
- **Role:** Display and editorial headlines. The serif is the brand's single most recognizable choice — it converts what would be a standard AI-tool landing into a financial-broadsheet feel. Used at 36-66px for hero/section headlines and at 20-30px for subheadings.

### Inter — All functional UI: body, nav, buttons, inputs, badges, footers. Carries the system's information while the serif does the emotional work. Uppercase eyebrows at 12-14px with +0.14em tracking are the consistent section-opener pattern. · `--font-inter`
- **Substitute:** Inter (already Google-hosted)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 12, 13, 14, 15, 16, 18, 72px
- **Line height:** 1.20–1.50 for body; 0.80–1.00 for the rare oversized utility label
- **Letter spacing:** -0.060em at 72px → -0.009em at 16px; 0.140em (uppercase tracking) for eyebrow labels
- **Role:** All functional UI: body, nav, buttons, inputs, badges, footers. Carries the system's information while the serif does the emotional work. Uppercase eyebrows at 12-14px with +0.14em tracking are the consistent section-opener pattern.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.14px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.01px | `--text-body-sm` |
| body | 16px | 1.5 | -0.009px | `--text-body` |
| subheading | 20px | 1.4 | -0.015px | `--text-subheading` |
| heading-sm | 30px | 1.2 | -0.02px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.02px | `--text-heading` |
| heading-lg | 48px | 1.15 | -0.015px | `--text-heading-lg` |
| display | 66px | 1 | -0.02px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 999px |
| images | 8px |
| inputs | 8px |
| buttons | 999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.08) 0px 1px 20px 3px` | `--shadow-lg` |
| xl | `rgba(0, 0, 0, 0.18) 0px 20px 60px 0px, rgba(0, 0, 0, 0.08...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Filled Pill Button
**Role:** Primary action (e.g. 'Try Aira')

Pill radius 999px, background #111111, text #fafafb in Inter 14-16px weight 500, padding 10px 20px. No shadow. No border. Sits in maximum contrast against the bone-white canvas — the brand's only 'ink stamp'.

### Outlined Pill Button
**Role:** Secondary action (e.g. 'Request demo', 'Sign in')

Pill radius 999px, transparent background, 1px border in #cbcbcb (light) or #fafafb (on dark hero), text matches border color, Inter 14-16px weight 500, padding 10px 20px.

### Dark Inverted Pill
**Role:** Call-to-action used on light surfaces when maximum punch is needed

Pill radius 999px, background #1f1f1f, text #fafafb. Slightly warmer than Obsidian, reads as 'ink' rather than 'pure black'. Padding 12px 24px.

### Editorial Headline
**Role:** Hero and section H1

Gestura serif, weight 400, 48-66px, line-height 1.00-1.15, letter-spacing -0.015 to -0.020em, color #1f1f1f on light / #fafafb on dark. Negative tracking tightens as size grows — the serif's open counters would otherwise feel airy at scale.

### Section Eyebrow Label
**Role:** Small uppercase opener above headlines

Inter 12px, weight 500, letter-spacing 0.14em uppercase, color #70706f. Sets editorial rhythm — acts as a 'kicker' line that says 'this is a serious business page' before the serif takes over.

### Search Input Field
**Role:** Hero conversational prompt

Background #ededed, border-radius 16px, padding 20-24px, Inter 16px weight 400 placeholder in #70706f. Right-side circular 40px submit button in #2c2c2b. No focus ring visible — the field is intentionally calm.

### Dark Suggestion Pill
**Role:** Quick-prompt tags below the search input

Pill radius 999px, background #1f1f1f, text #fafafb in Inter 13-14px weight 400, padding 8px 16px. Sits as ink dots on the light canvas — visually opposite to the cream search field.

### Badge / Tag
**Role:** Status, category, metadata

Pill radius 999px, background #e3e3e3, text #1f1f1f in Inter 12px weight 500, padding 4px 10px. Quiet, grayscale — never chromatic.

### Elevated Card (Dark)
**Role:** Dark-mode feature cards on light canvas

Border-radius 16-22px, background #111111, no visible border, generous padding 24-40px. Contains a phone mockup or other showcase. The dark-on-light inversion is the system's primary compositional move.

### Phone Mockup Container
**Role:** Product showcase surface

Card holding a phone screenshot at scale, background #fafafb inside an otherwise dark card, padding 40-60px. Layered shadow: 0 20px 60px rgba(0,0,0,0.18) + 0 4px 16px rgba(0,0,0,0.08) for soft depth without color.

### Nav Bar
**Role:** Top-level navigation

Transparent background over hero photography, switches to #fafafb with hairline 1px bottom border in #ededed on scroll. Logo left, centered-or-right nav links in Inter 14px weight 500 #fafafb/#1f1f1f, with 'Try Aira' dark pill on the far right.

### Footer Link
**Role:** Inline text links and footer navigation

Inter 14-16px weight 400-500, color #1f1f1f with 1px underline in #2c2c2b on hover. No chromatic link color — the system avoids blue links entirely.

### Photo Hero Container
**Role:** First-screen atmospheric photography

Full-bleed warm-toned photograph (hands, amber light) with heavy dark overlay for text legibility. Headline and body sit left-aligned at ~40% width; phone mockup floats right at ~50% width. No gradient — the photo itself carries warmth.

## Do's and Don'ts

### Do
- Use Gestura (or Fraunces substitute) for all display headlines at 36-66px with negative letter-spacing (-0.015 to -0.020em).
- Pair every serif headline with a 12px Inter eyebrow label at +0.14em tracking and Stone #70706f color to set editorial rhythm.
- Build all buttons as pills (999px radius) — the system has no square or 4px-radius buttons anywhere.
- Use #1f1f1f or #111111 for filled actions and #fafafb for text on those fills; never introduce a chromatic brand color into the button.
- Invert surface contrast (dark card on light canvas, light card on dark section) for major feature blocks instead of using shadow or color to separate them.
- Keep Inter at 14-16px weight 400-500 for body, nav, and inputs — reserve 600-700 for short labels and button text only.
- Let photography carry warmth and color; let the UI stay paper-quiet in bone white and ink.

### Don't
- Do not introduce blue, green, red, or any chromatic accent into the UI palette — the system is intentionally monochromatic and any color would break the broadsheet mood.
- Do not use Inter for headlines larger than 24px — the serif is what makes the brand recognizable.
- Do not use shadows to separate cards on the same surface — use hairline 1px borders in #2c2c2b or full surface inversion instead.
- Do not use square or 4-8px radius on buttons or badges; the pill (999px) is the system's only shape language for interactive elements.
- Do not use bright or saturated hover states — hover changes are limited to underline appearance or a 1-shade border darken.
- Do not place light text on a light card or dark text on a dark card without explicit 15:1+ contrast — the system relies on extreme contrast as its primary visual tool.
- Do not add gradient fills, glows, or colored blurs anywhere in the UI — the only 'glow' allowed is the soft shadow on phone mockups.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone White Canvas | `#fafafb` | Base page background across all light sections |
| 1 | Cloud Surface | `#ededed` | Elevated card background sitting one step above the canvas |
| 2 | Ash Surface | `#e3e3e3` | Tag/badge fills and input field resting state |
| 3 | Obsidian Surface | `#111111` | Dark inverted sections, hero overlays, dark cards on light canvas |

## Elevation

- **Soft photo card:** `0px 1px 20px 3px rgba(0, 0, 0, 0.08)`
- **Phone mockup card:** `0px 20px 60px 0px rgba(0, 0, 0, 0.18), 0px 4px 16px 0px rgba(0, 0, 0, 0.08)`

## Imagery

Imagery is sparse but high-impact: a single full-bleed warm photograph (hands holding a phone, amber tungsten lighting) carries the entire hero. The rest of the page relies on product phone mockups centered in dark inverted cards. No illustrations, no abstract graphics, no icon-filled decorative scenes. Photography treatment is documentary/intimate — tight crop, shallow depth, warm color temperature. The contrast between the warm photographic hero and the cold monochromatic UI below is the page's central visual argument. Icons throughout are minimal and line-based in Stone #70706f.

## Layout

Max-width 1200px centered container with generous 80px+ section gaps. The hero is full-bleed photography with a 40/50 split: text block left (headline + body + buttons), phone mockup right with no card chrome. Light sections (bone white #fafafb) alternate with single dark inverted sections — never more than one dark band per fold, so the page never feels heavy. Centered stacks dominate content sections: eyebrow → serif headline → body → single input, all on a single vertical axis with 80-120px vertical breathing room. Cards inside dark sections are 3-column grids with 8px gaps and 16-22px radius. Navigation is a minimal top bar that becomes opaque bone-white on scroll.

## Agent Prompt Guide

## Quick Color Reference
- text: #1f1f1f (light surfaces), #fafafb (dark surfaces)
- background: #fafafb
- surface (elevated): #ededed
- border / hairline: #2c2c2b
- muted text: #70706f
- primary action: #1f1f1f (filled action)

## Example Component Prompts

1. **Editorial Hero Section** — Full-bleed warm photograph background with dark overlay. Left column at 40% width: Gestura serif 66px weight 400, color #fafafb, letter-spacing -0.02em, line-height 1.00. Body text 18px Inter weight 400, #fafafb, line-height 1.50. Two buttons stacked horizontally with 8px gap: filled pill (#1f1f1f bg, #fafafb text, 999px radius, 10px 20px padding) and outlined pill (transparent bg, 1px #fafafb border, #fafafb text). Right column: phone mockup at 50% page width, soft shadow 0 20px 60px rgba(0,0,0,0.18).

2. **Search Prompt Section** — Bone white #fafafb background, centered stack. Eyebrow label 12px Inter weight 500, +0.14em tracking, uppercase, #70706f. Headline 48px Gestura weight 400, #1f1f1f, letter-spacing -0.015em. Subtext 16px Inter weight 400, #70706f. Below: a 16px-radius input field 640px wide, #ededed background, Inter 16px placeholder, with a 40px circular dark submit button inside on the right. Below the input: three dark suggestion pills (#1f1f1f, #fafafb text, 999px radius, 8px 16px padding, 13px Inter).

3. **Dark Inverted Feature Card** — Background #111111, border-radius 22px, padding 48px. Inside: centered white phone mockup card with 16px radius, 60px internal padding, layered shadow 0 20px 60px rgba(0,0,0,0.18) + 0 4px 16px rgba(0,0,0,0.08). Phone screen shows a light-mode app interface with a serif greeting headline inside.

4. **Navigation Bar** — Transparent over hero, becomes #fafafb with 1px bottom border in #ededed on scroll. Logo (sparkle mark + 'Aira' wordmark) left-aligned in #1f1f1f. Nav links centered: 14px Inter weight 500, #1f1f1f, 32px gap. Right cluster: outlined pill 'Sign in' (1px #cbcbcb border, #1f1f1f text, 999px radius) + filled pill 'Try Aira' (#1f1f1f bg, #fafafb text, 999px radius), 8px apart.

## Similar Brands

- **Stripe** — Same broadsheet-monochrome approach: serif-free restraint replaced here by a custom serif, but the same bone-white canvas, hairline borders, and ink-black type.
- **Linear** — Shares the pill-button + tight letter-spacing + photographic dark hero opening, but Aira adds the editorial serif that Linear lacks.
- **Pitch** — Same premium-tool feeling: warm full-bleed photography over a near-achromatic UI, with generous breathing room and a single serif/mixed display face carrying identity.
- **Notion** — Similar minimal, almost colorless interface discipline — both rely on near-white surfaces and ink text, letting content (or in Aira's case, photography) provide all color.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #fafafb;
  --color-graphite-ink: #2c2c2b;
  --color-deep-coal: #1f1f1f;
  --color-obsidian: #111111;
  --color-press-black: #080808;
  --color-stone: #70706f;
  --color-fog: #cbcbcb;
  --color-ash-gray: #e3e3e3;
  --color-cloud: #ededed;
  --color-slate: #444444;

  /* Typography — Font Families */
  --font-gestura-custom-serif: 'Gestura (custom serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.14px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.009px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.015px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.02px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.015px;
  --text-display: 66px;
  --leading-display: 1;
  --tracking-display: -0.02px;

  /* Typography — Weights */
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 22px;
  --radius-full: 99px;
  --radius-full-2: 999px;
  --radius-full-3: 13486.5px;
  --radius-full-4: 15984px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 999px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 999px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 1px 20px 3px;
  --shadow-xl: rgba(0, 0, 0, 0.18) 0px 20px 60px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px;

  /* Surfaces */
  --surface-bone-white-canvas: #fafafb;
  --surface-cloud-surface: #ededed;
  --surface-ash-surface: #e3e3e3;
  --surface-obsidian-surface: #111111;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #fafafb;
  --color-graphite-ink: #2c2c2b;
  --color-deep-coal: #1f1f1f;
  --color-obsidian: #111111;
  --color-press-black: #080808;
  --color-stone: #70706f;
  --color-fog: #cbcbcb;
  --color-ash-gray: #e3e3e3;
  --color-cloud: #ededed;
  --color-slate: #444444;

  /* Typography */
  --font-gestura-custom-serif: 'Gestura (custom serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.14px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.009px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.015px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.02px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.015px;
  --text-display: 66px;
  --leading-display: 1;
  --tracking-display: -0.02px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 22px;
  --radius-full: 99px;
  --radius-full-2: 999px;
  --radius-full-3: 13486.5px;
  --radius-full-4: 15984px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 1px 20px 3px;
  --shadow-xl: rgba(0, 0, 0, 0.18) 0px 20px 60px 0px, rgba(0, 0, 0, 0.08) 0px 4px 16px 0px;
}
```
