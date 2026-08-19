# Wispr Flow — Style Reference
> cream broadsheet, dark velvet chambers

**Theme:** mixed

Wispr Flow reads like an editorial broadsheet rebuilt for software: a warm cream canvas (#ffffeb) hosts weight-400 Eb Garamond at display sizes (48–120px) that commands through sheer scale rather than weight, while Figtree handles every interactive surface. Pages alternate between bright cream chambers and deep near-black rooms, separated by 2px ink borders and oversized corner radii (40–80px) that make each section feel rounded like a polished pebble. The palette stays disciplined to four working colors — cream, black, lavender (#f0d7ff) for primary actions, and forest teal (#034f46) for inner accents — with an occasional ember orange (#ffa946) punctuating active states.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lavender Whisper | `#f0d7ff` | `--color-lavender-whisper` | Primary CTA fill, accent card surfaces — soft pink-lavender that signals the one clickable thing on any page without ever shouting |
| Forest Ink | `#034f46` | `--color-forest-ink` | Secondary brand surface — teal pill badges, inner dark-panel cards, secondary buttons against dark backgrounds |
| Ember Glow | `#ffa946` | `--color-ember-glow` | Live/active state accent — notification dots, active mic indicators, occasional badge highlights |
| Vast Ink | `#1a1a1a` | `--color-vast-ink` | Primary text, button borders, dark section/card backgrounds — the dominant near-black that defines every dark chamber |
| Lumen Cream | `#ffffeb` | `--color-lumen-cream` | Dominant page canvas, card surfaces, button fills, light text on dark — warm off-white that reads as paper, not screen |
| Lumen Stone | `#e4e4d0` | `--color-lumen-stone` | Subtle borders, nav pill background, muted dividers — one shade darker than the cream canvas for low-contrast separation |
| Fog | `#8a8a80` | `--color-fog` | Muted captions, helper text, and de-emphasized UI labels. |
| Charcoal | `#222222` | `--color-charcoal` | Secondary button text and nav text — slightly lighter than Vast Ink for less critical text |
| Pure White | `#ffffff` | `--color-pure-white` | Badge borders on dark surfaces, light text on color, SVG icon strokes |

## Tokens — Typography

### Eb Garamond — Display and editorial headings — classical serif at regular weight, used at massive sizes (up to 120px) where weight 400 commands through scale alone. The 0.85–0.95 line-height at display sizes tightens lines into a single horizontal gesture. Subtitle: 'EB Garamond' (Google Fonts) or 'Cormorant Garamond' as alternative · `--font-eb-garamond`
- **Substitute:** EB Garamond, Cormorant Garamond, Playfair Display
- **Weights:** 400
- **Sizes:** 32px, 48px, 64px, 120px
- **Line height:** 0.85–1.3
- **Letter spacing:** -3.6px at 120px, -1.92px at 64px, -0.96px at 32px
- **Role:** Display and editorial headings — classical serif at regular weight, used at massive sizes (up to 120px) where weight 400 commands through scale alone. The 0.85–0.95 line-height at display sizes tightens lines into a single horizontal gesture. Subtitle: 'EB Garamond' (Google Fonts) or 'Cormorant Garamond' as alternative

### Figtree — Body text, UI labels, navigation, buttons, badges — geometric sans at weight 400 as default body, 500–700 for emphasis. The 1.3 line-height across all sizes gives comfortable rhythm without excess leading. 16px is the workhorse size (freq=716). · `--font-figtree`
- **Substitute:** Inter, Plus Jakarta Sans, Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14px, 16px, 20px, 22px, 24px, 32px
- **Line height:** 1.3
- **Role:** Body text, UI labels, navigation, buttons, badges — geometric sans at weight 400 as default body, 500–700 for emphasis. The 1.3 line-height across all sizes gives comfortable rhythm without excess leading. 16px is the workhorse size (freq=716).

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.3 | — | `--text-caption` |
| body-sm | 16px | 1.3 | — | `--text-body-sm` |
| body | 20px | 1.3 | — | `--text-body` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 32px | 1.3 | -0.96px | `--text-heading-sm` |
| heading | 48px | 0.95 | — | `--text-heading` |
| heading-lg | 64px | 0.95 | -1.92px | `--text-heading-lg` |
| display | 120px | 0.85 | -3.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 128 | 128px | `--spacing-128` |
| 168 | 168px | `--spacing-168` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 32px |
| badges | 9999px |
| inputs | 12px |
| buttons | 12px |
| sections | 40-80px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** The main download/purchase action on every page

Fill: #f0d7ff Lavender Whisper. Text: #1a1a1a Vast Ink. Border: 2px solid #1a1a1a. Border-radius: 12px. Padding: 14px 14px (compact) or 16px 24px (standard). Font: Figtree 500, 16px. Includes Apple/platform icon prefix. The 2px border is non-negotiable — it gives the soft lavender a defined edge.

### Outlined Secondary Button
**Role:** Secondary actions: 'Try Flow', 'Watch in action'

Fill: #ffffeb Lumen Cream. Text: #1a1a1a Vast Ink. Border: 2px solid #1a1a1a. Border-radius: 12px. Padding: 16px 24px. Font: Figtree 500, 16px. Matches the CTA's border weight and radius for visual kinship.

### Ghost/Text Button
**Role:** Tertiary actions, inline links in copy

No background. Text: #1a1a1a Vast Ink. No border. Padding: variable. Font: Figtree 400, 16px. Underline on hover. Used for navigation and low-priority links.

### Floating Navigation Pill
**Role:** Top-of-page navigation bar

Container: cream pill (#ffffeb) with 9999px border-radius, 2px solid #1a1a1a border, slight padding. Contains Flow logo (bar-chart mark + wordmark in Figtree 600), nav items (Product, Individuals, Business, Resources, Company) with dropdown chevrons, and a lavender CTA pinned to the right. Floats over the canvas with subtle margin from page edges.

### Cream Content Card
**Role:** Light-surface content blocks, feature panels

Fill: #ffffeb Lumen Cream. Border-radius: 32px. Padding: 32px all sides. No shadow. Optional 2px solid #1a1a1a border. The 32px radius is consistent across all card sizes — no smaller cards, no exceptions.

### Dark Feature Card
**Role:** Dark-chamber content blocks, feature showcases

Fill: #1a1a1a Vast Ink. Border-radius: 40–80px (larger than cream cards for dramatic contrast). Padding: 55–70px. No shadow. Text: #ffffeb Lumen Cream. These are the 'velvet rooms' — sections that feel like stepping into a dark alcove.

### Teal Status Badge
**Role:** Success states, feature labels, 'Grammar corrected'

Fill: #034f46 Forest Ink. Text: #ffffeb Lumen Cream. Border-radius: 1000px (full pill). Padding: 8px 16px. Font: Figtree 500, 14px. May include checkmark or icon prefix. The forest teal against cream text is the most readable badge combination.

### Platform Pill Badge
**Role:** Platform selector on dark sections (Mac, Windows, iPhone, Android)

Fill: transparent. Text: #ffffeb Lumen Cream. Border: 1–2px solid #ffffff. Border-radius: 1000px (full pill). Padding: 8px 16px. Font: Figtree 500, 14px. Includes platform icon prefix. Sits on dark chamber backgrounds.

### Dark Square Badge
**Role:** Inline tags, category labels

Fill: #1a1a1a Vast Ink. Text: #ffffeb Lumen Cream. Border-radius: 8px (sharp contrast to the site's pill-shaped elements). Padding: 8px 16px. Font: Figtree 500, 14px. The 8px radius is deliberately tight — a small geometric counterpoint to the dominant pill shapes.

### Waveform Visualizer
**Role:** Audio/speech indicator, mic active state

Container: cream pill (#ffffeb) with 9999px border-radius, 2px solid #1a1a1a border. Interior: 5–7 vertical bars of varying height in #1a1a1a, evenly spaced. Height range: 8–24px. Animated bars pulse to indicate active recording. Sits inline with text as a functional punctuation mark.

### Phone Mockup
**Role:** Product preview, feature demonstration

Dark device frame (#1a1a1a) with 40px corner radius. Screen shows chat interface with cream message bubbles, user avatar circle, and waveform visualizer at the bottom. No realistic bezel — the mockup is a flat illustration, not a render.

### Section Container
**Role:** Page-level content bands

Alternating fill: #ffffeb (cream) and #1a1a1a (dark). Border-radius: 40–80px on the outer container, creating the rounded-chamber effect. Section gaps: 64–96px vertical. No dividers or separators between sections — the fill alternation and rounded corners do the work.

### Hand-drawn Underline Accent
**Role:** Editorial emphasis on key words in headlines

SVG squiggle or wavy line in #f0d7ff Lavender Whisper, positioned beneath 1–2 words in a display headline. Stroke-width: 3–4px. Slight irregularity in path. The lavender matches the CTA color, creating a visual link between emphasis and action.

## Do's and Don'ts

### Do
- Use Lavender Whisper #f0d7ff as the sole primary action color — never substitute blue, green, or any other hue for CTAs
- Set display headlines in Eb Garamond weight 400 (not bold) — authority comes from 64–120px scale, not font weight
- Apply 2px solid #1a1a1a borders to all interactive elements — the thick border is a signature, not optional
- Alternate cream #ffffeb and dark #1a1a1a sections page-wide — every dark chamber should be bookended by cream
- Use 32px border-radius on standard cards and 40–80px on dark section cards — never use 4px or 8px on content blocks
- Use Figtree 400 as the default body weight; reserve 600–700 for nav items, badges, and button labels
- Pair #f0d7ff (active/accent) with #034f46 (secondary) — these two brand colors are complementary, not alternatives

### Don't
- Do not use bold or weight 700 for display headlines — the serif whispers at weight 400 and commands through size alone
- Do not use box-shadow for card elevation — this design is border-driven; shadows break the editorial flatness
- Do not introduce blue, green, or any non-palette accent color for actions, links, or highlights
- Do not use border-radius below 12px on buttons or below 32px on cards — small radii clash with the oversized chamber geometry
- Do not use gradient fills — the palette is flat; gradients dilute the editorial discipline
- Do not center body text — body copy and subtitles should be left-aligned or follow a strict measure, not centered blocks
- Do not place cream content on cream canvas without a border or background change — the palette needs contrast separation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#ffffeb` | Default page background — warm paper-like off-white |
| 1 | Dark Chamber | `#1a1a1a` | Alternating section/card background — near-black velvet rooms |
| 2 | Lavender Accent | `#f0d7ff` | Accent card surfaces, highlighted feature panels |
| 3 | Forest Panel | `#034f46` | Secondary accent — badge fills, inner card on dark sections |

## Elevation

This design is deliberately shadowless. All cards rely on flat fill + 2px ink borders for separation — no box-shadows, no depth gradients, no floating effects. The only shadow in the system is a single subtle drop-shadow on display text, which is an artifact of typography rendering, not elevation. The 'elevation' is achieved through fill alternation (cream → dark → cream) and oversized border-radii (40–80px) that make dark sections feel like inset rooms rather than elevated overlays. Do not introduce box-shadow to make cards 'pop' — the editorial flatness is the signature.

## Imagery

Imagery is sparse and editorial: real product app icons (Slack, Notion, Gmail, Messages, etc.) appear in a horizontal parade across dark sections, creating a 'works everywhere' visual proof without lifestyle photography. Phone mockups are flat dark illustrations with cream chat bubbles, not photorealistic renders. Photo backgrounds appear only inside dark feature cards as blurred, desaturated atmospheric layers behind text overlays. Signature graphical elements include curved text arcs following circular paths (the hero's 'going on, no really' loop), hand-drawn lavender SVG underlines beneath key words, and waveform visualizer pills that serve as both audio indicators and decorative rhythm markers. No stock photography, no abstract gradients, no 3D renders — the visual language is editorial print meets functional UI.

## Layout

Page model: centered max-width 1200px content with full-bleed section backgrounds. Hero: centered serif headline (120px) over cream canvas with a floating nav pill at the top and a single CTA below the subtitle. The hero text uses two-tone coloring (Fog gray → Vast Ink) to create a visual cadence across the headline. Sections alternate cream → dark → cream in a deliberate rhythm, with dark chambers taking 40–80px corner radii that make them feel like rounded inset rooms. Content arrangement: text-left/visual-right on feature sections (phone mockup on right), centered stacks for headlines, and side-by-side comparison cards for data sections. The nav is always a floating cream pill (not full-bleed), positioned with breathing room from the page edges. Footer is a full-width dark band. Vertical rhythm: 64–96px between major sections, 32px between cards, 8–16px between elements within a block.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1a1a1a (Vast Ink)
- background: #ffffeb (Lumen Cream)
- border: #1a1a1a (Vast Ink, 2px solid)
- accent: #f0d7ff (Lavender Whisper)
- primary action: #f0d7ff (filled action)
- secondary brand: #034f46 (Forest Ink)

**Example Component Prompts**

1. Create a Primary Action Button: #f0d7ff background, #1a1a1a text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Create a dark feature chamber*: Full-width section with #1a1a1a fill, 80px border-radius on outer container. Left column: 64px Eb Garamond weight 400 heading in #ffffeb with -1.92px letter-spacing, 20px Figtree 400 subtitle in #ffffeb, and an outlined cream button (12px radius, 2px #1a1a1a... no — 2px #ffffeb border on this dark bg, cream fill, #1a1a1a text, Figtree 500 16px). Right column: flat phone mockup (40px radius, #1a1a1a frame, cream chat bubbles inside).

3. *Create a comparison card pair*: Two cards side by side on #ffffeb canvas. Left: cream card (#ffffeb fill, 32px radius, 32px padding, 2px #1a1a1a border). Heading 'Keyboard' in 20px Figtree 500 #1a1a1a, stat '45 wpm' in 48px Eb Garamond weight 400. Right: dark card (#1a1a1a fill, 40px radius, 32px padding) with blurred photo overlay. Heading 'Flow' in 20px Figtree 500 #ffffeb, stat '220 wpm' in 48px Eb Garamond weight 400 #ffffeb.

4. *Create a platform selector row*: Four full-pill badges in a horizontal row on #1a1a1a dark background. Each: transparent fill, 1px solid #ffffeb border, 1000px border-radius, 8px 16px padding, Figtree 500 14px #ffffeb text, platform icon prefix (Mac, Windows, iPhone, Android).

5. *Create a status badge*: Forest Ink #034f46 fill, 1000px border-radius, 8px 16px padding, Figtree 500 14px #ffffeb text, optional checkmark icon in #ffffeb prefix.

## Elevation Philosophy

This design is deliberately shadowless. All cards rely on flat fill + 2px ink borders for separation — no box-shadows, no depth gradients, no floating effects. The only shadow in the system is a single subtle drop-shadow on display text, which is an artifact of typography rendering, not elevation. The 'elevation' is achieved through fill alternation (cream → dark → cream) and oversized border-radii (40–80px) that make dark sections feel like inset rooms rather than elevated overlays. Do not introduce box-shadow to make cards 'pop' — the editorial flatness is the signature.

## Similar Brands

- **Mercury** — Editorial serif headings at display scale, cream/near-black palette alternation, restrained color discipline, and thick 2px borders define both systems
- **Linear** — Clean dark-chamber sections breaking up light surfaces, disciplined two-color brand palette, oversized corner radii on feature cards
- **Vercel** — Full-bleed alternating dark/light section rhythm, generous vertical breathing room, and large display typography that anchors each band
- **Arc** — Warm cream canvas with deep near-black chambers, oversized pill-shaped containers, and a sense of rounded geometric softness throughout the layout

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lavender-whisper: #f0d7ff;
  --color-forest-ink: #034f46;
  --color-ember-glow: #ffa946;
  --color-vast-ink: #1a1a1a;
  --color-lumen-cream: #ffffeb;
  --color-lumen-stone: #e4e4d0;
  --color-fog: #8a8a80;
  --color-charcoal: #222222;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-eb-garamond: 'Eb Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --text-body: 20px;
  --leading-body: 1.3;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 0.95;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -1.92px;
  --text-display: 120px;
  --leading-display: 0.85;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-128: 128px;
  --spacing-168: 168px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 80px;
  --radius-full-3: 992px;
  --radius-full-4: 1000px;
  --radius-full-5: 1600px;
  --radius-full-6: 9999px;

  /* Named Radii */
  --radius-cards: 32px;
  --radius-badges: 9999px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;
  --radius-sections: 40-80px;

  /* Surfaces */
  --surface-cream-canvas: #ffffeb;
  --surface-dark-chamber: #1a1a1a;
  --surface-lavender-accent: #f0d7ff;
  --surface-forest-panel: #034f46;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lavender-whisper: #f0d7ff;
  --color-forest-ink: #034f46;
  --color-ember-glow: #ffa946;
  --color-vast-ink: #1a1a1a;
  --color-lumen-cream: #ffffeb;
  --color-lumen-stone: #e4e4d0;
  --color-fog: #8a8a80;
  --color-charcoal: #222222;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-eb-garamond: 'Eb Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --text-body: 20px;
  --leading-body: 1.3;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 0.95;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -1.92px;
  --text-display: 120px;
  --leading-display: 0.85;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-128: 128px;
  --spacing-168: 168px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 80px;
  --radius-full-3: 992px;
  --radius-full-4: 1000px;
  --radius-full-5: 1600px;
  --radius-full-6: 9999px;
}
```
