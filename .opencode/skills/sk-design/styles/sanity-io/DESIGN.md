# Sanity.io — Style Reference
> Geological monolith with orange ignition. Dark agate slabs punctured by a single ember-orange CTA, surrounded by white editorial whitespace.

**Theme:** mixed

Sanity.io speaks with the confident restraint of an editorial design system: vast dark hero sections anchored by full-bleed organic photography, then a clean white grid where large Waldenburg headlines do the heavy lifting. Orange (#ff4100) functions as the only chromatic punctuation on a near-monochrome stage — it appears on the logo dot, the Get Started button, and occasional tags, never as decoration. Numbered sections (01–05) evoke a Swiss editorial layout, and the Waldenburg typeface's tight tracking at display sizes (–4.48px at 112px) creates a compressed, architectural rhythm. The UI is a content platform that treats its own product as the hero — Studio screenshots, code editors, and structured content forms appear in the marketing surface itself, blurring the line between product and pitch.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff4100` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Signal Blue | `#0052ef` | `--color-signal-blue` | Links, secondary highlights, focus rings, decorative code accents — cool counterpoint to the warm orange, used sparingly |
| Plex Green | `#19d600` | `--color-plex-green` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Plasma Magenta | `#f500ff` | `--color-plasma-magenta` | Decorative code syntax highlight, studio editor token — appears only within code/editor contexts, not general UI |
| Acid Lime | `#45ff00` | `--color-acid-lime` | Code syntax token — restricted to developer-facing surfaces like the terminal and JSON editor |
| Electric Blue | `#027fff` | `--color-electric-blue` | Code syntax token, inline link variants in editorial copy — secondary to Signal Blue |
| Onyx | `#0b0b0b` | `--color-onyx` | Primary text, dark hero backgrounds, dark product surface panels, button text on light fills |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surfaces, text on dark sections, input fields |
| Smoke | `#b9b9b9` | `--color-smoke` | Borders, dividers, disabled text, muted icon strokes, placeholder text |
| Ash | `#d6d6d6` | `--color-ash` | Subtle borders on cards, input field outlines in light mode |
| Graphite | `#212121` | `--color-graphite` | Elevated dark surface (cards on dark backgrounds), input borders on dark sections |
| Charcoal | `#353535` | `--color-charcoal` | Deepest elevated surface, code editor background, terminal panel |
| Mid | `#797979` | `--color-mid` | Secondary text, helper text, metadata, low-emphasis icons |
| Steel | `#4a4a4a` | `--color-steel` | Tertiary text, icon outlines on light surfaces |
| Frost | `#ededed` | `--color-frost` | Hover backgrounds, subtle row separators, very light surface tint |

## Tokens — Typography

### Waldenburg — Primary display and body typeface. Used for all headings, body text, navigation, buttons, and editorial copy. The weight 425 is distinctive — a true book weight between 400 and 500 that adds warmth. Extremely tight letter-spacing at display sizes (–4.48px at 112px) creates a compressed, architectural feel. Custom stylistic alternates (cv01, cv11, cv12, cv13, ss07) give it a unique character — likely single-story 'a', distinctive 'g', and other bespoke glyphs. · `--font-waldenburg`
- **Substitute:** Inter, GT Walsheim, Söhne
- **Weights:** 400, 425, 500, 600
- **Sizes:** 11px, 12px, 13px, 15px, 16px, 18px, 20px, 24px, 32px, 38px, 48px, 60px, 72px, 112px
- **Line height:** 1.0, 1.05, 1.1, 1.13, 1.2, 1.24, 1.3, 1.5
- **Letter spacing:** -4.48px at 112px, -2.52px at 72px, -1.8px at 60px, -0.48px at 32px, -0.24px at 24px, -0.02px at 18px, normal at 16px and below
- **OpenType features:** `"calt" 0; "cv01", "cv11", "cv12", "cv13", "ss07"`
- **Role:** Primary display and body typeface. Used for all headings, body text, navigation, buttons, and editorial copy. The weight 425 is distinctive — a true book weight between 400 and 500 that adds warmth. Extremely tight letter-spacing at display sizes (–4.48px at 112px) creates a compressed, architectural feel. Custom stylistic alternates (cv01, cv11, cv12, cv13, ss07) give it a unique character — likely single-story 'a', distinctive 'g', and other bespoke glyphs.

### IBM Plex Mono — Monospace typeface for code blocks, terminal output, JSON schemas, numbered section labels (01–05), and technical metadata. Creates a developer-first identity when paired with Waldenburg's editorial warmth. · `--font-ibm-plex-mono`
- **Substitute:** IBM Plex Mono (freely available on Google Fonts)
- **Weights:** 400, 500
- **Sizes:** 10px, 12px, 13px, 15px
- **Line height:** 1.3, 1.4, 1.5, 1.7
- **OpenType features:** `"calt" 0`
- **Role:** Monospace typeface for code blocks, terminal output, JSON schemas, numbered section labels (01–05), and technical metadata. Creates a developer-first identity when paired with Waldenburg's editorial warmth.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 1.3 | — | `--text-micro` |
| caption | 13px | 1.4 | — | `--text-caption` |
| body-sm | 15px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.5 | -0.02px | `--text-body` |
| body-lg | 20px | 1.5 | -0.02px | `--text-body-lg` |
| subheading | 32px | 1.13 | -0.48px | `--text-subheading` |
| heading-sm | 48px | 1.1 | -1.44px | `--text-heading-sm` |
| heading | 60px | 1.08 | -1.8px | `--text-heading` |
| heading-lg | 72px | 1.05 | -2.52px | `--text-heading-lg` |
| display | 112px | 1 | -4.48px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 99999px |
| tags | 99999px |
| cards | 12px |
| images | 3px |
| inputs | 3px |
| buttons | 99999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Ember Pill Button (Primary)
**Role:** Main call-to-action across hero, nav, and section CTAs

Pill shape at 99999px radius, 12px 24px padding, #ff4100 background, #ffffff text, Waldenburg 15px weight 500. No border. The signature element of the system — appears as 'Get Started' in nav, 'Start building' in hero, and all primary CTAs.

### Ghost Pill Button
**Role:** Secondary action paired with primary CTA

Pill shape at 99999px radius, 12px 24px padding, transparent background, 1px solid #ffffff border on dark or 1px solid #0b0b0b on light, Waldenburg 15px weight 500, text matches border color. Used for 'Get a demo', 'Contact sales'.

### Editorial Numbered Section
**Role:** Content feature sections (01–05)

Numbered labels in IBM Plex Mono 13px, 01–05 in #0b0b0b, label text in #797979 uppercase tracked. Left column holds the number + label stack, right column holds a 2-column text+image layout. 48px vertical gap between items.

### Full-Bleed Dark Hero
**Role:** Primary above-the-fold section

Full-viewport dark background (#0b0b0b) with atmospheric organic photography (agate/geological textures). White Waldenburg display headline at 72–112px, tight –2.52px tracking. Orange CTA + ghost button below headline. No centered alignment — text is left-anchored with generous left padding.

### Product Showcase Card
**Role:** Embedded Studio/editor screenshots in marketing

Large card showing the actual product UI: code editor (dark theme, IBM Plex Mono, syntax-colored tokens), content forms, and history panels. Realistic, not stylized — the product IS the marketing visual. Contained within max-width 1280px, subtle 1px border on light sections.

### Editorial Headline Block
**Role:** Large section headlines on white background

Waldenburg 48–60px weight 400–500, #0b0b0b, letter-spacing –1.44 to –1.8px. Left-aligned, sits above body copy with 24px gap. Sometimes followed by a bulleted feature list.

### Code Block
**Role:** JSON schema and code examples in marketing pages

Dark background (#0b0b0b or #353535), IBM Plex Mono 13px line-height 1.7, syntax-highlighted tokens. Line numbers and terminal-style decorations (dots, paths) in muted gray. Rounded 3px corners, no visible border.

### Feature List
**Role:** Bulleted feature highlights within editorial sections

Waldenburg 18px weight 400, #0b0b0b text, small orange or black bullet markers, 12px vertical gap between items. Short, declarative phrases — not sentences.

### Top Navigation Bar
**Role:** Persistent site navigation

Transparent or white background, 64px height, Waldenburg 15px weight 500 for all links. Logo (Sanity wordmark with orange dot) left, product links center, 'Log in' (text), 'Contact sales' (ghost pill), 'Get Started' (ember pill) right. Sticky on scroll.

### Logo Wordmark
**Role:** Brand identity element

'Sanity' in Waldenburg 24px weight 600, #0b0b0b (dark mode) or #ffffff (on dark), followed by a circular dot in #ff4100. The orange dot is the only color in the logo — a compressed signal of the brand accent.

### Audience Pill Tag
**Role:** Compact labels for integrations, categories, or audience tags

Pill shape 99999px radius, 4px 12px padding, 1px solid #b9b9b9 border, #0b0b0b text, Waldenburg 12px weight 500. Used for partner logos, integration labels.

### Input Field
**Role:** Form inputs in Studio and marketing

3px border-radius, 1px solid #b9b9b9 (light) or #353535 (dark) border, 12px 16px padding, Waldenburg 15px weight 400, #0b0b0b (light) or #ffffff (dark) text. Focus ring uses #0052ef at 2px.

### Partner Logo Strip
**Role:** Social proof bar at section bottoms

Horizontal row of partner/client logos in single-color #0b0b0b or #b9b9b9, 48px height, evenly spaced with 24px gap. Logos are monochrome — no brand colors. Often sits on a light gray or white band.

## Do's and Don'ts

### Do
- Use Ember Orange (#ff4100) exclusively for the single primary action on any given view — never two orange CTAs competing for attention
- Set all interactive elements (buttons, tags, nav items) to pill radius (99999px) to maintain the system signature
- Apply tight letter-spacing at all display sizes: –4.48px at 112px, –2.52px at 72px, –1.8px at 60px — this compressed rhythm is the Waldenburg voice
- Use IBM Plex Mono exclusively for code, terminal output, JSON, and numbered section labels — never for marketing body copy
- Anchor all full-bleed dark sections with atmospheric organic photography (geological, organic, or product-screenshot based) — never use flat color or abstract patterns alone
- Keep editorial sections on white with generous section gaps (96px) and left-aligned text — the whitespace is the layout grid
- Show real product UI in marketing — Studio screenshots, code editors, and content forms as visual evidence, not illustrations
- Use #0b0b0b (not #000000) as the primary dark surface — the slight warmth prevents harsh digital feeling
- Pair every primary action with a ghost secondary action using the same pill shape and size — they should feel like a matched set

### Don't
- Never use Ember Orange for body text, links, or decorative elements — it is reserved for action surfaces only
- Never use #f500ff, #45ff00, or #ffff00 outside of code/editor contexts — these are syntax tokens, not brand colors
- Never use flat box-shadows or heavy elevation — this system relies on background contrast, not shadows
- Never center-align large headlines — the editorial system is left-anchored with intentional asymmetry
- Never use multiple saturated colors on a single screen — if you need a second accent, it should be Signal Blue at 20% of the visual weight of orange
- Never break the pill/3px radius binary — avoid 8px or 16px radii on functional elements; pills for interactive, 3px for inputs/code
- Never use Waldenburg at 425 weight for headlines above 32px — the book weight is for body warmth, not display compression
- Never use a decorative gradient — this system has no gradients; depth comes from background contrast (white → black → charcoal)

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background for editorial content sections |
| 1 | Onyx | `#0b0b0b` | Dark hero, dark product showcase sections |
| 2 | Graphite | `#212121` | Cards and panels elevated on dark backgrounds |
| 3 | Charcoal | `#353535` | Code editor panels, terminal surfaces, deepest dark elevation |
| 4 | Frost | `#ededed` | Light hover states and subtle row separators on white surfaces |

## Imagery

Atmospheric, full-bleed organic photography dominates dark sections: geological cross-sections, agate slices, and macroscopic organic textures shot in warm earth tones. Product screenshots are treated as hero imagery on equal footing with photography — the Studio interface (code editor, content forms, history panels) appears at large scale, dark-themed, with real syntax-highlighted code. No illustrations, no stock photography, no abstract gradients. On light sections, imagery is either product UI (pixelated grid portraits suggesting data structure) or monochrome partner logos. The visual logic: the product and the organic world are equally valid heroes — content as geology, data as matter.

## Layout

Full-bleed dark hero (100vw) with left-anchored text and full-bleed background photography, transitioning to max-width 1280px centered content sections. Editorial rhythm alternates: dark hero → dark product showcase → white editorial section → white feature grid. The white sections use a 2-column asymmetric grid: left column holds numbered labels (01–05 in mono) and headlines, right column holds body copy + visual. Navigation is a minimal top bar, transparent over dark sections and white over light sections, with right-aligned actions. Section vertical rhythm is generous — 96px between major sections on white, tighter 48px on dark. The layout reads like an editorial publication: numbered chapters, left-aligned running text, and full-bleed photographic interludes.

## Agent Prompt Guide

**Quick Color Reference**
- primary action: no distinct CTA color
- Accent/link: #0052ef (Signal Blue) — inline links, focus rings
- Text: #0b0b0b (Onyx) primary, #797979 (Mid) secondary, #b9b9b9 (Smoke) disabled
- Background: #ffffff (Canvas) light sections, #0b0b0b (Onyx) dark sections, #353535 (Charcoal) code/editor surfaces
- Border: #b9b9b9 (Smoke) default, #d6d6d6 (Ash) subtle, #0052ef (Signal Blue) focus

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. *Editorial headline block*: Waldenburg 60px weight 400, #0b0b0b, letter-spacing –1.8px, line-height 1.08, left-aligned. Sits on #ffffff with 96px section padding above and below.


4. *Numbered editorial section*: IBM Plex Mono 13px for '01' label in #0b0b0b, uppercase tracked label text in #797979. 48px gap below to headline. Right column: Waldenburg 48px headline + 18px body in #0b0b0b + bulleted feature list.

5. *Dark code block*: #0b0b0b background, 3px radius, 24px padding, IBM Plex Mono 13px line-height 1.7, syntax tokens in #19d600 (strings), #027fff (keys), #f500ff (types), #797979 (comments). No visible border.

## Elevation Philosophy

Sanity.io does not use box-shadows. Depth is achieved entirely through background-value contrast across a five-step surface stack: #ffffff (canvas) → #ededed (frost hover) for light areas, and #0b0b0b (onyx base) → #212121 (graphite card) → #353535 (charcoal deepest) for dark areas. A card 'floats' because it is a lighter shade of the same near-black hue against a darker one, never because of a drop shadow. This keeps the system feeling architectural and flat — closer to print design than Material Design. The only exception is a subtle blue-tinted glow (#0052ef) on the Signal Blue focus ring, which is a functional accessibility indicator, not decorative elevation.

## Similar Brands

- **Linear** — Same dark-mode-first editorial system with a single accent color, tight display tracking, and left-anchored asymmetric layouts that read like magazine spreads
- **Vercel** — Full-bleed dark hero with atmospheric photography, single warm accent (orange/vermillion), and generous whitespace on white editorial sections below
- **Stripe** — Contrasting dark/light section alternation, large compressed display headlines, and product UI treated as hero imagery rather than decorative illustration
- **Plaid** — Dark navy/black canvas with a single saturated brand accent, monospace labels for numbered sections, and a confident editorial typography system
- **Figma Config** — Full-bleed atmospheric photography, pill-shaped CTAs in a single brand color, and a system that blurs the line between product screenshots and marketing visuals

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff4100;
  --color-signal-blue: #0052ef;
  --color-plex-green: #19d600;
  --color-plasma-magenta: #f500ff;
  --color-acid-lime: #45ff00;
  --color-electric-blue: #027fff;
  --color-onyx: #0b0b0b;
  --color-canvas-white: #ffffff;
  --color-smoke: #b9b9b9;
  --color-ash: #d6d6d6;
  --color-graphite: #212121;
  --color-charcoal: #353535;
  --color-mid: #797979;
  --color-steel: #4a4a4a;
  --color-frost: #ededed;

  /* Typography — Font Families */
  --font-waldenburg: 'Waldenburg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.3;
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.02px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.02px;
  --text-subheading: 32px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -1.44px;
  --text-heading: 60px;
  --leading-heading: 1.08;
  --tracking-heading: -1.8px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -2.52px;
  --text-display: 112px;
  --leading-display: 1;
  --tracking-display: -4.48px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w425: 425;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 99999px;

  /* Named Radii */
  --radius-nav: 99999px;
  --radius-tags: 99999px;
  --radius-cards: 12px;
  --radius-images: 3px;
  --radius-inputs: 3px;
  --radius-buttons: 99999px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-onyx: #0b0b0b;
  --surface-graphite: #212121;
  --surface-charcoal: #353535;
  --surface-frost: #ededed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff4100;
  --color-signal-blue: #0052ef;
  --color-plex-green: #19d600;
  --color-plasma-magenta: #f500ff;
  --color-acid-lime: #45ff00;
  --color-electric-blue: #027fff;
  --color-onyx: #0b0b0b;
  --color-canvas-white: #ffffff;
  --color-smoke: #b9b9b9;
  --color-ash: #d6d6d6;
  --color-graphite: #212121;
  --color-charcoal: #353535;
  --color-mid: #797979;
  --color-steel: #4a4a4a;
  --color-frost: #ededed;

  /* Typography */
  --font-waldenburg: 'Waldenburg', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.3;
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.02px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.02px;
  --text-subheading: 32px;
  --leading-subheading: 1.13;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -1.44px;
  --text-heading: 60px;
  --leading-heading: 1.08;
  --tracking-heading: -1.8px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -2.52px;
  --text-display: 112px;
  --leading-display: 1;
  --tracking-display: -4.48px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 99999px;
}
```
