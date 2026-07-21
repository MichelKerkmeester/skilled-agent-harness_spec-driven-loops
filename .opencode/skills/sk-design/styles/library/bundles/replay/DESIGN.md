# Replay — Style Reference
> editorial red-pen on white blueprint. A debugging instrument that speaks in a whisper and marks its targets in coral.

**Theme:** light

Replay reads as a serious developer-tool brand dressed in quiet confidence: an almost entirely achromatic canvas where charcoal text and white surfaces do 95% of the work, and a single saturated coral-red acts as surgical punctuation on headlines, buttons, and the active nav state. The signature typographic move is emphatic color-splitting inside display headlines — a dark line in #111827 immediately followed by a line in the brand red — which makes the voice feel editorial and opinionated rather than corporate. Components stay lightweight: pill buttons, thin hairline borders, cards that float on soft elevation, and almost no decorative gradient beyond a thin top banner. Every surface earns its place; color is rationed like a resource, not applied as decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#111827` | `--color-midnight-ink` | Primary body text, headline base, nav text — the default foreground against every surface |
| Slate 600 | `#374151` | `--color-slate-600` | Secondary text, button borders on outlined/ghost actions, list markers |
| Graphite 800 | `#1f2937` | `--color-graphite-800` | Dark surface fills for secondary buttons, dark cards, reverse sections |
| Steel 500 | `#6b7280` | `--color-steel-500` | Muted helper text, secondary link text, inactive nav |
| Fog 400 | `#9ca3af` | `--color-fog-400` | Icon strokes, tertiary metadata, placeholder text |
| Mist 300 | `#d1d5db` | `--color-mist-300` | Disabled controls, subtle borders, secondary dividers |
| Cloud 200 | `#e5e7eb` | `--color-cloud-200` | Hairline borders, icon outlines, the dominant UI border color across the system |
| Paper 100 | `#f3f4f6` | `--color-paper-100` | Page background, list rows, subtle section tints |
| Snow 50 | `#ffffff` | `--color-snow-50` | Card surfaces, elevated panels, button text on dark fills, the top of the surface stack |
| Coral Pulse | `#f02d5e` | `--color-coral-pulse` | Brand emphasis color — highlights one line of display headlines, marks active nav links, outlines ghost CTA borders, the coral-red ink of the editorial system |
| Coral 500 | `#f43f5e` | `--color-coral-500` | Red action color for filled buttons, selected navigation states, and focused conversion moments. |
| Cobalt Link | `#3762e2` | `--color-cobalt-link` | Violet text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Lilac Whisper | `#e9d5ff` | `--color-lilac-whisper` | Decorative card border tint on case-study cards — a barely-there violet that softens the otherwise monochrome system |
| Banner Gradient | `linear-gradient(to right top, rgb(255, 128, 181), rgb(144, 137, 252))` | `--color-banner-gradient` | Top announcement banner — pink to violet sweep signals urgency and brand energy without adding permanent surface noise |

## Tokens — Typography

### Inter — Sole brand typeface — handles everything from 12px micro-labels to 80px display headlines. Weight 500/600 for headlines keeps the voice confident without shouting; weight 400 carries body text. The tight letter-spacing on large sizes (-0.025em at 80px, -0.019em at 40–48px) makes display lines feel set, not stacked. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 40px, 48px, 80px
- **Line height:** 1.17–1.78
- **Letter spacing:** -2px at 80px, -1.2px at 48–40px, -0.4px at 20px, normal at 16px and below; uppercase labels use +0.05em
- **Role:** Sole brand typeface — handles everything from 12px micro-labels to 80px display headlines. Weight 500/600 for headlines keeps the voice confident without shouting; weight 400 carries body text. The tight letter-spacing on large sizes (-0.025em at 80px, -0.019em at 40–48px) makes display lines feel set, not stacked.

### ui-monospace — Inline code, keyboard shortcuts, technical tokens — appears sparingly, never as a headline face · `--font-ui-monospace`
- **Substitute:** JetBrains Mono, SF Mono, Menlo, Consolas
- **Weights:** 600
- **Sizes:** 12px
- **Line height:** 1.33
- **Role:** Inline code, keyboard shortcuts, technical tokens — appears sparingly, never as a headline face

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.6px | `--text-caption` |
| body-sm | 14px | 1.71 | — | `--text-body-sm` |
| body | 16px | 1.75 | — | `--text-body` |
| body-lg | 18px | 1.78 | — | `--text-body-lg` |
| subheading | 20px | 1.6 | -0.4px | `--text-subheading` |
| heading-sm | 40px | 1.17 | -1.2px | `--text-heading-sm` |
| heading | 48px | 1.1 | -1.2px | `--text-heading` |
| display | 80px | 1.1 | -2px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| icons | 4-8px |
| inputs | 8px |
| buttons | 9999px |
| smallChips | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(17, 24, 39, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 16-24px

## Components

### Announcement Banner
**Role:** Top-of-page gradient strip with CTA

Full-bleed banner with the pink-to-violet linear-gradient (#ff80b5 → #9089fc). White text at 14px Inter weight 500, centered. Contains a small white outlined pill button ('Apply now') on the right. Height ~40px, sits above the nav.

### Primary Navigation
**Role:** Sticky site nav with logo, links, and CTA

White background, 64–72px tall. Left: Replay wordmark with play-triangle icon in #111827. Center: horizontal links (Overview active state in #f02d5, inactive in #111827) at 14px Inter 500 with 32px column gap. Right: filled coral CTA pill 'Try Replay Free'.

### Filled Coral CTA
**Role:** Primary action button

Pill shape at 9999px radius. Background #f43f5, white text at 14–16px Inter 600. Padding 8px 24px. Subtle shadow rgba(0,0,0,0.05) 0px 1px 2px. Hover deepens the coral slightly. Used once or twice per viewport maximum.

### Outlined Ghost CTA
**Role:** Secondary action button on light surfaces

Pill shape at 9999px radius. Transparent background, 1px border in #f02d5 or #374151, text matches border color. Same padding as filled CTA. Sits beside filled CTAs to create a paired action set.

### Display Headline with Color Split
**Role:** Hero and section-level H1

Inter 80px weight 700, line-height 1.10, letter-spacing -2px. Multi-line headline where one line is set in #111827 and the following line is set in #f02d5 — the editorial signature. Centered on hero, left-aligned in body sections.

### Body Lead Paragraph
**Role:** Hero subhead, section introductions

Inter 18px weight 400, line-height 1.78, color #6b7280. Max-width ~640px to keep line length readable. Follows the display headline with 24–32px top gap.

### Eyebrow Label
**Role:** Uppercase category tag above section titles

Inter 12px weight 600, uppercase, letter-spacing 1.5px (0.05em), color #f02d5e. Centered, sits 16–24px above its parent heading.

### Case Study Card
**Role:** Testimonial / quote card in social proof grid

White surface, 12px radius, 24px padding. 1px border in #e9d5ff (Lilac Whisper) for soft definition. Contains a quote in #111827 at 16px, a 'Read full case study →' link in Cobalt Link, and a footer row with circular avatar (32px), name in 14px 600, handle in 12px #6b7280, and brand logo on the right.

### Link with Arrow
**Role:** Inline navigation link to detail pages

Inter 14px weight 500, color #3762e2, trailing → character. No underline by default; appears underlined on hover.

### Avatar with Brand Mark
**Role:** Person attribution in case study cards

32px circular avatar photo, name in 14px Inter 600 #111827, handle in 12px Inter 400 #6b7280. Company logo or product mark positioned on the right edge of the card footer.

### Section Container
**Role:** Vertical rhythm wrapper for content bands

Max-width 1200px, centered, 24–32px horizontal padding. 64–80px vertical padding between sections. White or #f3f4f6 background alternates to create band separation.

### Trust Logo Strip
**Role:** Horizontal row of customer/team logos

Single-row layout under a centered 'Trusted by top engineering teams' caption. Logos in monochrome #6b7280 or #9ca3af, roughly 32–40px tall, evenly spaced with 48px column gap.

## Do's and Don'ts

### Do
- Use #f43f5 for exactly one filled CTA per viewport — it loses all power if it appears more than twice on a screen
- Split display headlines across two lines so the first line is #111827 and the second is #f02d5 — the color contrast is the design
- Set all buttons and tags at 9999px radius — the pill is non-negotiable and unifies every interactive element
- Use #e5e7eb for 1px hairline borders on cards, inputs, and dividers — never use heavier borders or background fills to create separation
- Cap body text at 18px and max-width ~640px — the system trusts the reader and refuses to fill horizontal space for its own sake
- Apply letter-spacing -2px at 80px and -1.2px at 40–48px to all display and heading sizes — the tight tracking is what makes the large type feel set rather than dropped in
- Alternate white and #f3f4f6 section backgrounds to create rhythm without lines or heavy dividers

### Don't
- Don't use the coral red (#f43f5 / #f02d5e) for body text, icons, or decorative fills — it is rationed for emphasis lines, active states, and CTAs only
- Don't introduce new chromatic colors for illustrations, badges, or section accents — the system runs on charcoal, white, and one coral
- Don't use card radius smaller than 12px on case study / testimonial cards or larger than 8px on inputs — radius carries semantic weight
- Don't use weight 300 or 200 for headlines — Inter at 600–700 is the voice; thin weights break the editorial authority
- Don't stack two filled CTAs side by side — pair a filled coral with an outlined ghost or a text link instead
- Don't apply drop shadows to elements that aren't cards or floating panels — buttons get the whisper 1px shadow, nothing more
- Don't use #f3f4f6 as a card background on a white canvas — it only works as a section tint behind a white card, never as a card on white

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f3f4f6` | Page background, the softest tone the eye sees |
| 1 | Card | `#ffffff` | Default content surface, case study cards, pricing panels |
| 2 | Dark Section | `#1f2937` | Reverse hero or feature panels where white text sits on graphite |

## Elevation

- **Cards, elevated panels:** `rgba(17, 24, 39, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Buttons, interactive controls:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`

## Imagery

The visual language is text-dominant with almost no decorative photography. Imagery is restricted to small circular user avatars in case study cards and a sparse row of monochrome company logos in the trust strip. The hero relies entirely on typography — the editorial color-split headline IS the visual. No illustrations, no 3D renders, no product screenshots visible in the captured screens. The thin pink-to-violet gradient banner at the top is the only chromatic graphic element on the page, and it reads as a notification rather than decoration. Iconography is geometric and minimal: a play-triangle logomark, simple → arrows on links, and flat outlined social icons.

## Layout

Max-width 1200px centered container with generous 64–80px vertical section gaps. The hero is a centered typographic stack — display headline, lead paragraph, single CTA — sitting on a white canvas with a faint diagonal scratch pattern. Subsequent sections use a centered single-column text block on #f3f4f6 tinted backgrounds, then a 3-column card grid for case studies. Navigation is a centered top bar with logo left, links center, CTA right. The page rhythm alternates between white and #f3f4f6 bands to separate concerns without resorting to heavy dividers.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #111827
- text muted: #6b7280
- background canvas: #f3f4f6
- background card: #ffffff
- border hairline: #e5e7eb
- accent / emphasis line: #f02d5e
- primary action: #f43f5e (filled action)

**Example Component Prompts**

1. *Display headline with color split:* Centered 80px Inter weight 700, line-height 1.10, letter-spacing -2px. First line in #111827, second line in #f02d5e. Followed by an 18px Inter 400 lead paragraph in #6b7280, max-width 640px.

2. *Case study card:* White surface, 12px radius, 24px padding, 1px border in #e9d5ff. Quote text 16px Inter 400 in #111827. Footer row: 32px circular avatar left, name 14px Inter 600 in #111827, handle 12px Inter 400 in #6b7280, brand mark on the right edge. Above the quote: a 'Read full case study →' link in #3762e2 at 14px Inter 500.

3. Create a Primary Action Button: #f43f5e background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. *Section band:* Full-bleed #f3f4f6 background, 1200px max-width centered container inside, 72px top and bottom padding. Eyebrow label 12px Inter 600 uppercase #f02d5e with 1.5px letter-spacing, 16px below it a 48px Inter 700 heading in #111827, 24px below that a 16px Inter 400 body in #374151.


## Editorial Headline System

The headline split is the brand's most recognizable move. Every display headline breaks across two lines, with line one in #111827 and line two in #f02d5e. The color change functions like a verbal emphasis — the brand is making a point, and the coral is the underline. The same pattern scales down: section H2s at 40–48px use a coral phrase embedded inside an otherwise charcoal sentence. Never use coral for an entire headline, and never split across more than two lines.

## Similar Brands

- **Linear** — Same pill-button + monochrome canvas + rationed accent color approach, both treat the page as a typographic instrument
- **Vercel** — Similar near-black/white base palette with geometric simplicity, large confident display type, and a single vivid accent reserved for emphasis
- **Posthog** — Developer-tool branding with an editorial headline voice, tight letter-spacing on display type, and coral-as-accent restraint
- **Sentry** — Same devtools category with a hairline-border card system, pill CTAs, and a single warm accent punctuating an otherwise grayscale interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #111827;
  --color-slate-600: #374151;
  --color-graphite-800: #1f2937;
  --color-steel-500: #6b7280;
  --color-fog-400: #9ca3af;
  --color-mist-300: #d1d5db;
  --color-cloud-200: #e5e7eb;
  --color-paper-100: #f3f4f6;
  --color-snow-50: #ffffff;
  --color-coral-pulse: #f02d5e;
  --color-coral-500: #f43f5e;
  --color-cobalt-link: #3762e2;
  --color-lilac-whisper: #e9d5ff;
  --color-banner-gradient: #ff80b5;
  --gradient-banner-gradient: linear-gradient(to right top, rgb(255, 128, 181), rgb(144, 137, 252));

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-body-lg: 18px;
  --leading-body-lg: 1.78;
  --text-subheading: 20px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -1.2px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.2px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -2px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-icons: 4-8px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;
  --radius-smallchips: 8px;

  /* Shadows */
  --shadow-subtle: rgba(17, 24, 39, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;

  /* Surfaces */
  --surface-canvas: #f3f4f6;
  --surface-card: #ffffff;
  --surface-dark-section: #1f2937;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #111827;
  --color-slate-600: #374151;
  --color-graphite-800: #1f2937;
  --color-steel-500: #6b7280;
  --color-fog-400: #9ca3af;
  --color-mist-300: #d1d5db;
  --color-cloud-200: #e5e7eb;
  --color-paper-100: #f3f4f6;
  --color-snow-50: #ffffff;
  --color-coral-pulse: #f02d5e;
  --color-coral-500: #f43f5e;
  --color-cobalt-link: #3762e2;
  --color-lilac-whisper: #e9d5ff;
  --color-banner-gradient: #ff80b5;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-body-lg: 18px;
  --leading-body-lg: 1.78;
  --text-subheading: 20px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: -1.2px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.2px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(17, 24, 39, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
}
```
