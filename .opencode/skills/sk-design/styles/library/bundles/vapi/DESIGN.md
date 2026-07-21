# Vapi — Style Reference
> Neon spectrogram across midnight concrete

**Theme:** dark

Vapi operates as a developer-facing voice AI platform rendered in deep midnight with a single warm cream text color and two oppositional accent fills — burnt orange and mint green. The visual language is sparse and dark: headlines whisper at weight 300 in a custom neo-grotesque, corners stay unusually tight at ~5.6px (closer to a hard rectangle than a card), and color discipline is strict except in one signature moment — a horizontal audio-waveform graphic that explodes into six vivid hues (blue, pink, yellow, violet, green, orange) to evoke a voice spectrogram. Interfaces feel like a developer console: monospaced nav labels with wide tracking, thin hairline borders, no shadows, and pill-shaped action buttons that sit on the canvas without elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Canvas | `#0e0e13` | `--color-void-canvas` | Page background, primary canvas — near-black with a cool ink tint that lets the cream text feel hand-set rather than digital |
| Carbon Surface | `#09090b` | `--color-carbon-surface` | Card backgrounds, inset panels, and list items — one shade deeper than the canvas to create surface depth without elevation |
| Slab Elevated | `#18181b` | `--color-slab-elevated` | Elevated surface layer, rarely visible — used only for small chips and modal-like overlays that need to sit above cards |
| Iron Border | `#27272a` | `--color-iron-border` | Primary hairline border across lists, dividers, and card edges — appears 490+ times, it is the structural skeleton of the system |
| Steel Border | `#3f3f46` | `--color-steel-border` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Zinc Mute | `#71717a` | `--color-zinc-mute` | Muted body text, icon strokes, and disabled labels — the voice of secondary information |
| Pearl Border | `#d8d7d4` | `--color-pearl-border` | Light hairline border used inside nav bars and inverted surfaces — a near-white wire for dark containers |
| Ice Border | `#d9e6ef` | `--color-ice-border` | Cool-tinted light border for icons, links, and glassy outlined elements — adds a faint blue whisper to contrast with the warm Cream text |
| Cream Text | `#fffaea` | `--color-cream-text` | Primary heading and body text — warm off-white (not pure #fff) that reads softer on dark and unifies with the orange accent's warmth |
| Bone Text | `#f4f4f5` | `--color-bone-text` | Secondary text and button labels — the cool counterpart to Cream, used when a label needs to feel more clinical than editorial |
| Mercury Text | `#a1a1aa` | `--color-mercury-text` | Tertiary text and meta-information — the lightest reading level above Zinc Mute |
| Ember Orange | `#e96b34` | `--color-ember-orange` | Primary filled CTA (Request a Demo) — warm burnt orange against cool dark creates urgency without the aggression of pure red |
| Mint Pulse | `#62f6b5` | `--color-mint-pulse` | Secondary filled CTA (Sign Up / Login) — bright mint green pairs against Ember Orange as a complementary pair, the two action colors share the same pill geometry but never co-occupy the same surface |
| Spectrogram Blue | `#4dcafa` | `--color-spectrogram-blue` | Decorative waveform accent — appears only inside the hero audio visualization, never on UI elements |
| Spectrogram Pink | `#de94e2` | `--color-spectrogram-pink` | Decorative waveform accent — part of the six-color spectrogram palette in the hero |
| Spectrogram Yellow | `#ffdd03` | `--color-spectrogram-yellow` | Decorative waveform accent — bright lemon dot in the hero waveform graphic |
| Spectrogram Violet | `#9977ff` | `--color-spectrogram-violet` | Decorative waveform accent — soft purple dot in the hero waveform graphic |

## Tokens — Typography

### seasonSans — All UI text, headings, body, and button labels — a custom neo-grotesque with an unusually wide weight range (300→650) that lets headlines whisper at 300 while labels speak at 650 · `--font-seasonsans`
- **Substitute:** Inter (closest free match for the grotesque geometry and weight range)
- **Weights:** 300, 400, 500, 510, 570, 650
- **Sizes:** 11, 12, 14, 15, 16, 18, 22, 24, 32, 40, 44, 56, 68, 96, 120, 144
- **Line height:** 1.00–1.71 (tight 1.00–1.20 for display, generous 1.43–1.71 for body)
- **Letter spacing:** Tight on large text: -0.025em at 96–144px, -0.022em at 68px, -0.020em at 56px, -0.016em at 40px, neutral at 14–18px, slight positive +0.003em at 11–12px
- **Role:** All UI text, headings, body, and button labels — a custom neo-grotesque with an unusually wide weight range (300→650) that lets headlines whisper at 300 while labels speak at 650

### Geist Mono — Developer-facing micro-copy: nav links, section labels, 'TALK TO VAPI' callouts, and any monospaced interface element — tracked wide (+0.05em to +0.08em) to read as a console label rather than code · `--font-geist-mono`
- **Substitute:** Geist Mono or JetBrains Mono
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 20
- **Line height:** 1.30–1.67
- **Letter spacing:** Wide tracking throughout: +0.050em at 12px, +0.056em at 14px, +0.067em at 16px, +0.069em at 20px, +0.080em at 12px nav — the consistent positive tracking transforms mono from 'code' into 'industrial label'
- **Role:** Developer-facing micro-copy: nav links, section labels, 'TALK TO VAPI' callouts, and any monospaced interface element — tracked wide (+0.05em to +0.08em) to read as a console label rather than code

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label | 12px | 1.5 | — | `--text-label` |
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.43 | — | `--text-body` |
| body-lg | 24px | 1.32 | — | `--text-body-lg` |
| heading-sm | 40px | 1.2 | -0.64px | `--text-heading-sm` |
| heading | 56px | 1.1 | -1.12px | `--text-heading` |
| heading-lg | 68px | 1.09 | -1.5px | `--text-heading-lg` |
| display-sm | 96px | 1 | -2.4px | `--text-display-sm` |
| display | 120px | 1 | -3px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 5.6px |
| chips | 5.6px |
| inputs | 5.6px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button (Ember)
**Role:** Highest-emphasis action — 'Request a Demo', sign-up triggers

Filled pill, Ember Orange (#e96b34) background, Cream Text (#fffaea) label at 12px seasonSans weight 500 with +0.08em tracking (mono feel), uppercase, 12px vertical × 24px horizontal padding, 9999px radius. Arrow icon (→) trails the label, same Cream color.

### Secondary CTA Button (Mint)
**Role:** Secondary action — 'Sign Up', 'Login', account creation

Filled pill, Mint Pulse (#62f6b5) background, Void Canvas (#0e0e13) label for contrast inversion, same 12px seasonSans 500 uppercase +0.08em tracking, 12px × 24px padding, 9999px radius. Sits beside Ember CTA as a complementary pair — never alone.

### Top Navigation Bar
**Role:** Persistent header across all pages

Transparent over Void Canvas (#0e0e13). Left: VAPI wordmark at 18px seasonSans weight 650, Cream Text. Center: nav links at 12px Geist Mono weight 400 with +0.08em tracking in Zinc Mute (#71717a), uppercase. Right: small Ember and Mint CTA pills (compact 8px × 16px padding). Pearl Border (#d8d7d4) 1px bottom divider.

### Hero Headline
**Role:** Primary above-the-fold statement

Two-line headline at 68–96px seasonSans weight 300, Cream Text (#fffaea), line-height 1.0–1.09, letter-spacing -2.0 to -1.5px. The weight 300 choice is anti-convention — most dark hero sites use 600–700 for authority; Vapi uses 300 to let the spectrogram graphic and CTAs carry the weight visually.

### Hero Subtext
**Role:** Supporting sentence below headline

18px seasonSans weight 400, Bone Text (#f4f4f5) or Zinc Mute (#71717a), line-height 1.43. Short, single sentence, no marketing flourish.

### Talk to Vapi Console
**Role:** Interactive product demo embedded in hero

Light inverted card (Cream Text #fffaea background, Void Canvas text), 9999px radius (full pill), 16px × 40px padding, centered. Contains 'TALK TO VAPI' at 14px Geist Mono weight 500 +0.08em uppercase in Void Canvas, plus a trailing dot-grid icon. The light-on-dark inversion is the visual punchline of the hero.

### Spectrogram Waveform Graphic
**Role:** Brand-defining decorative element below the hero CTAs

Full-bleed horizontal grid of small rounded rectangles (5.6px radius) arranged in a waveform pattern, varying heights to mimic audio amplitude. Six-color palette: Spectrogram Blue (#4dcafa), Pink (#de94e2), Yellow (#ffdd03), Violet (#9977ff), Mint (#62f6b5), and Ember (#e96b34). The graphic spans the full viewport width and sits directly on Void Canvas — no container or background.

### Logo Strip
**Role:** Social proof — client logos

Single horizontal row of 6 logos (Unity, ONE, Intuit, Delphi, Housecall Pro, Cherry) in monochrome Cream Text (#fffaea) or Bone Text (#f4f4f5), evenly distributed with ~32–40px gap. No headings or captions — just logos on the dark canvas.

### List Item Card
**Role:** Row in feature lists, pricing tables, or API endpoint listings

Carbon Surface (#09090b) background, Iron Border (#27272a) 1px top border (the list/divider appearance is structural — no card chrome), 16px vertical padding, full-width within container. Title at 16–18px seasonSans weight 500 in Cream, description at 14px weight 400 in Zinc Mute.

### Section Heading
**Role:** H2/H3 section titles in mid-page content

40–56px seasonSans weight 300, Cream Text, letter-spacing -0.64 to -1.12px, line-height 1.10–1.20. Centered or left-aligned depending on section. No eyebrow text or kicker label — the heading stands alone with generous space above.

### Nav Link Label
**Role:** Navigation item text

12px Geist Mono weight 400, +0.08em tracking, uppercase, Zinc Mute (#71717a) default, Cream Text on hover. No underline, no underline-offset animation — the color shift is the only affordance.

### Hairline Divider
**Role:** Structural separation between sections, lists, or footer

1px Iron Border (#27272a), full-width, no spacing of its own. The frequency (490+ occurrences) makes this the most-used component — it is how the design creates rhythm without any background or shadow change.

### Icon Container
**Role:** Wrapping container for inline icons and decorative glyphs

No background. Icons rendered as 20–24px outlined strokes at 1.5–2px weight in Ice Border (#d9e6ef) or Bone Text (#f4f4f5). Filled icon variants use the six spectrogram colors. Icons are never placed inside rounded backgrounds — they sit directly on the canvas.

### Code Block / API Snippet
**Role:** Developer-facing code examples

Carbon Surface (#09090b) background, Iron Border (#27272a) 1px, 5.6px radius, 24px padding. Monospaced text in Geist Mono 14px weight 400. Syntax highlighting uses cool palette (Ice Border #d9e6ef, Spectrogram Blue #4dcafa) rather than traditional red/green.

## Do's and Don'ts

### Do
- Use 5.6px radius for all cards, inputs, and code blocks — the sharp corner is a signature, not a compromise
- Use 9999px radius for every action button and the Talk-to-Vapi console
- Set headlines at weight 300 in seasonSans with letter-spacing -0.025em — do not bold them up to match dark-UI conventions
- Pair Ember Orange and Mint Pulse only as adjacent CTA siblings — never use one without the other on the same surface
- Apply Iron Border (#27272a) as a 1px hairline at 490+ frequency — this is the structural skeleton, not a decoration
- Use Geist Mono with +0.08em tracking for any label that needs to read as a developer console, not as marketing copy
- Let the spectrogram waveform graphic carry all six vivid colors at once — no other element on the page should reproduce that palette

### Don't
- Do not use drop shadows or box-shadows for elevation — depth comes from background contrast between Void, Carbon, and Slab only
- Do not round card corners beyond 5.6px — the sharp geometry is what makes this system feel like a console rather than a marketing site
- Do not place Spectrogram Blue, Pink, Yellow, or Violet on any UI element — they are reserved for the hero waveform graphic
- Do not use pure white (#ffffff) for text — Cream Text (#fffaea) is the deliberate warm alternative
- Do not stack the Ember and Mint buttons in a row of more than two — the pair is binary, adding a third neutral button breaks the signal
- Do not set body text below 15px or use decorative letter-spacing outside the Geist Mono context
- Do not add gradients, glows, or aurora backgrounds — the design is flat, the only color motion is the static spectrogram graphic

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#0e0e13` | Page background — the infinite dark stage |
| 1 | Carbon Surface | `#09090b` | Card and list-item background — subtle depth without shadow |
| 2 | Slab Elevated | `#18181b` | Chip and overlay surface — used sparingly for elements that need to float |

## Elevation

The system is intentionally shadowless. Depth is communicated entirely through three near-black background layers (Void #0e0e13 → Carbon #09090b → Slab #18181b) and 1px Iron Border hairlines. This is a console aesthetic — flat surfaces, structural lines, no skeuomorphic lift.

## Imagery

Imagery is minimal and brand-defining. The dominant visual is the full-bleed spectrogram waveform — a horizontal array of small 5.6px-radius rounded rectangles in six vivid colors, varying in height to mimic audio amplitude. No photography, no illustrations, no product screenshots. Logos in the social-proof strip are monochrome line-art in Cream Text. The only non-UI visual asset on the page is the waveform itself, which acts as both decoration and product metaphor (voice/audio → visible spectrum).

## Layout

Full-bleed dark canvas with no visible container borders on the hero. The hero is centered: VAPI wordmark left, headline center, CTAs below, spectrogram full-width at the bottom of the fold. Content sections below the fold use a max-width 1200px centered container with generous 80px section gaps and 1px Iron Border dividers between them. Navigation is a minimal transparent top bar with mono-tracked links centered and pill CTAs right-aligned. Lists and feature rows stretch full-width within the container with hairline top borders creating rhythm. The overall rhythm is: hero (no border) → wave graphic (no border) → logo strip (bordered) → sections (bordered, stacked).

## Agent Prompt Guide

primary action: #e96b34 (filled action)
Create a Primary Action Button: #e96b34 background, #09090b text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
**Quick Color Reference**
- Text: #fffaea (Cream)
- Background: #0e0e13 (Void Canvas)
- Card surface: #09090b (Carbon)
- Border: #27272a (Iron)
- Accent: #e96b34 (Ember Orange)
- Secondary action: #62f6b5 (Mint Pulse)

**3-5 Example Component Prompts**

1. Create a hero section on Void Canvas (#0e0e13). Two-line headline at 68px seasonSans weight 300, #fffaea, letter-spacing -1.5px, line-height 1.09. Below it, two pill buttons side by side: left is #e96b34 background with #fffaea label 'REQUEST A DEMO →' at 12px seasonSans 500 +0.08em tracking, 12px×24px padding, 9999px radius; right is #62f6b5 background with #0e0e13 label 'SIGN UP' at the same spec. Full-bleed spectrogram waveform graphic at the bottom of the section.

2. Create a feature list card: #09090b background, no visible border (relies on a 1px #27272a top divider above), 5.6px radius, 16px vertical × 0 horizontal padding. Title at 18px seasonSans 500 in #fffaea, description at 14px seasonSans 400 in #71717a.

3. Create a 'Talk to Vapi' console element: #fffaea background, 9999px radius, 16px×40px padding. Label 'TALK TO VAPI' at 14px Geist Mono 500 +0.08em uppercase in #0e0e13, followed by a 4-dot grid icon in #0e0e13.

4. Create a top nav bar transparent over #0e0e13: VAPI wordmark at 18px seasonSans 650 #fffaea on the left. Center: 'PRODUCT', 'DOCS', 'PRICING', 'COMPANY' in 12px Geist Mono 400 +0.08em uppercase #71717a. Right: compact Ember pill and Mint pill (8px×16px padding). 1px #d8d7d4 bottom divider.

5. Create a code block: #09090b background, 1px #27272a border, 5.6px radius, 24px padding. Monospaced text in Geist Mono 14px 400. Keywords in #4dcafa, strings in #d9e6ef, punctuation in #71717a.

## Color Pairing Logic

The Ember/Mint CTA pair is binary and complementary — the orange and green sit on opposite ends of the color wheel, which means they cannot be confused for the same action. This is a deliberate replacement for the typical single-blue-CTA pattern: Vapi signals that 'Request a Demo' and 'Sign Up' are different journeys (sales-led vs self-serve) through hue distance alone. The four other spectrogram colors (Blue, Pink, Yellow, Violet) are quarantined to the hero waveform — their appearance on any other element would dilute the brand's most distinctive moment.

## Signature Geometry

The 5.6px radius is the system's most opinionated token. It is not a standard Tailwind value (which jumps from rounded to rounded-md at 6px), and it sits just below the threshold where a corner reads as 'rounded' vs 'sharp'. The effect: cards and inputs feel like developer-tool surfaces (think Linear, Vercel, or Raycast) rather than consumer marketing cards. Only action buttons break to 9999px — the full pill — to create a single obvious affordance on the page. This radius duality (near-sharp for containers, full-pill for actions) is what makes the system instantly recognizable as a developer product rather than a SaaS marketing site.

## Similar Brands

- **Linear** — Same dark-canvas console aesthetic with tight ~6px card radii, hairline dividers, and near-white text on deep black
- **Vercel** — Identical developer-product restraint — flat surfaces, no shadows, monochromatic text, single accent color for primary action
- **Raycast** — Same near-sharp corner geometry and pill-shaped action buttons, though Vapi adds a dual orange/green CTA pair
- **ElevenLabs** — Adjacent AI-voice category with dark UI, custom neo-grotesque type, and waveform-as-hero visual metaphor
- **Replicate** — Same developer-facing dark mode with custom display weight (300) and monospaced nav labels with wide tracking

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-canvas: #0e0e13;
  --color-carbon-surface: #09090b;
  --color-slab-elevated: #18181b;
  --color-iron-border: #27272a;
  --color-steel-border: #3f3f46;
  --color-zinc-mute: #71717a;
  --color-pearl-border: #d8d7d4;
  --color-ice-border: #d9e6ef;
  --color-cream-text: #fffaea;
  --color-bone-text: #f4f4f5;
  --color-mercury-text: #a1a1aa;
  --color-ember-orange: #e96b34;
  --color-mint-pulse: #62f6b5;
  --color-spectrogram-blue: #4dcafa;
  --color-spectrogram-pink: #de94e2;
  --color-spectrogram-yellow: #ffdd03;
  --color-spectrogram-violet: #9977ff;

  /* Typography — Font Families */
  --font-seasonsans: 'seasonSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-label: 12px;
  --leading-label: 1.5;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.43;
  --text-body-lg: 24px;
  --leading-body-lg: 1.32;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.64px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.09;
  --tracking-heading-lg: -1.5px;
  --text-display-sm: 96px;
  --leading-display-sm: 1;
  --tracking-display-sm: -2.4px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -3px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w510: 510;
  --font-weight-w570: 570;
  --font-weight-w650: 650;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 5.6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 5.6px;
  --radius-chips: 5.6px;
  --radius-inputs: 5.6px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-void-canvas: #0e0e13;
  --surface-carbon-surface: #09090b;
  --surface-slab-elevated: #18181b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-canvas: #0e0e13;
  --color-carbon-surface: #09090b;
  --color-slab-elevated: #18181b;
  --color-iron-border: #27272a;
  --color-steel-border: #3f3f46;
  --color-zinc-mute: #71717a;
  --color-pearl-border: #d8d7d4;
  --color-ice-border: #d9e6ef;
  --color-cream-text: #fffaea;
  --color-bone-text: #f4f4f5;
  --color-mercury-text: #a1a1aa;
  --color-ember-orange: #e96b34;
  --color-mint-pulse: #62f6b5;
  --color-spectrogram-blue: #4dcafa;
  --color-spectrogram-pink: #de94e2;
  --color-spectrogram-yellow: #ffdd03;
  --color-spectrogram-violet: #9977ff;

  /* Typography */
  --font-seasonsans: 'seasonSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-label: 12px;
  --leading-label: 1.5;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.43;
  --text-body-lg: 24px;
  --leading-body-lg: 1.32;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.64px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.09;
  --tracking-heading-lg: -1.5px;
  --text-display-sm: 96px;
  --leading-display-sm: 1;
  --tracking-display-sm: -2.4px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 5.6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```
