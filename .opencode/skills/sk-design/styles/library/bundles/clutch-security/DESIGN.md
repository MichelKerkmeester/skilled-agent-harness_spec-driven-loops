# Clutch Security — Style Reference
> Typography museum on white marble. Gallery-white walls where each word is the artifact, one blue button the only painting in the room.

**Theme:** light

Clutch Security operates in a gallery-white minimalism: a bright, almost paper-like canvas where typography carries the entire visual weight and a single electric blue does all the chromatic talking. The signature typographic move is PP Radio Grotesk display headlines where key words shift between weight 400 and 600 within the same sentence, creating a call-and-response rhythm that feels like a conversation rather than a declaration. The interface is nearly flat — 6px corners, hairline 1px borders in cool gray, and no decorative shadows — so the occasional 3D orbital illustration or 3D brand mark feels like a found object on a clean table. Everything is centered, spacious, and confident; the 80px section breaks and generous internal padding give each element room to assert itself without competing.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#004dff` | `--color-electric-cobalt` | Primary action buttons, active states, the single chromatic accent that punctuates the entire monochrome system |
| Periwinkle Wash | `#d9e4ff` | `--color-periwinkle-wash` | Light blue surface for highlighted regions, subtle brand-tinted backgrounds, soft accent fills |
| Lavender Veil | `#e6c5f7` | `--color-lavender-veil` | Soft violet surface for the brand mark and tertiary accent zones, a whisper of warmth against the cool palette |
| Obsidian | `#000000` | `--color-obsidian` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Graphite | `#6e6e6e` | `--color-graphite` | Secondary text, link color, muted descriptions, supportive copy that recedes from primary content |
| Stone | `#c9c9c9` | `--color-stone` | Tertiary surface fills, disabled-state backgrounds, very subtle card differentiation |
| Ash | `#d9d9d9` | `--color-ash` | Drop shadow base at 16% opacity, secondary dividers, barely-there surface separation |
| Pewter | `#dfdfdf` | `--color-pewter` | Secondary borders, card edges, input field outlines, the structural grid color at 1px weight |
| Slate Mist | `#e5e7eb` | `--color-slate-mist` | Primary hairline borders, the most-used divider color, separating cards, sections, and table rows |
| Fog | `#f9fafb` | `--color-fog` | Subtle page-surface lift, alternating section backgrounds, the barely-warm off-white that breaks pure white monotony |
| Canvas | `#ffffff` | `--color-canvas` | Page background, card surfaces, text on dark fills, the dominant surface where everything sits |

## Tokens — Typography

### PP Radio Grotesk — Display and heading typeface. The geometric-humanist character with its distinctive open apertures carries every headline, subhead, uppercase label, and brand statement. The signature technique is mixing weight 400 and 600 within a single sentence (e.g. 'Every Identity. Every Agent. Every Secret.') to create rhythmic emphasis without color or size shifts. · `--font-pp-radio-grotesk`
- **Substitute:** Söhne Breit, PP Neue Montreal, or Space Grotesk for closest character match
- **Weights:** 400, 500, 600
- **Sizes:** 10, 12, 13, 14, 20, 24, 26, 32, 38, 56, 68
- **Line height:** 1.10, 1.20, 1.30, 1.40, 1.50
- **Letter spacing:** Display 68px: -0.01em; Headings 56-32px: -0.01em; Labels 10-13px: 0.12-0.16em
- **Role:** Display and heading typeface. The geometric-humanist character with its distinctive open apertures carries every headline, subhead, uppercase label, and brand statement. The signature technique is mixing weight 400 and 600 within a single sentence (e.g. 'Every Identity. Every Agent. Every Secret.') to create rhythmic emphasis without color or size shifts.

### Inter — UI and body typeface. Handles all interface text, navigation, button labels, form inputs, and supporting paragraph copy. The slight negative tracking at body sizes keeps dense UI text compact without feeling tight. · `--font-inter`
- **Substitute:** System UI sans (SF Pro Text, Segoe UI), or DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 12, 14, 15, 16, 17
- **Line height:** 1.30, 1.40, 1.50
- **Letter spacing:** Body: -0.02em; Labels/uppercase: 0.12em
- **Role:** UI and body typeface. Handles all interface text, navigation, button labels, form inputs, and supporting paragraph copy. The slight negative tracking at body sizes keeps dense UI text compact without feeling tight.

### Times — Rarely used serif for one-off editorial accents, likely a fallback or legacy element — not a design-system driver · `--font-times`
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Rarely used serif for one-off editorial accents, likely a fallback or legacy element — not a design-system driver

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | 0.16px | `--text-caption` |
| body | 16px | 1.5 | -0.02px | `--text-body` |
| subheading | 20px | 1.4 | -0.01px | `--text-subheading` |
| heading-sm | 26px | 1.3 | -0.01px | `--text-heading-sm` |
| heading | 38px | 1.2 | -0.01px | `--text-heading` |
| heading-lg | 56px | 1.1 | -0.01px | `--text-heading-lg` |
| display | 68px | 1.1 | -0.01px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| badges | 6px |
| inputs | 6px |
| buttons | 6px |
| illustration | 80px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.16) 0px 2px 6px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button (Filled Black)
**Role:** The workhorse action button for demos, sign-ups, and key conversions

Obsidian (#000000) fill, Canvas (#ffffff) text at 14px Inter weight 500, 6px border-radius, 10px vertical and 20px horizontal padding. Minimal letter-spacing. This is the default 'Book a demo' style — bold but quiet against the white canvas.

### Brand Accent Button (Electric Cobalt)
**Role:** Used sparingly for one key action per page where the blue punctuation is needed

Electric Cobalt (#004dff) fill, Canvas (#ffffff) text at 14px Inter weight 500, 6px border-radius, 10px/20px padding. Appears only where the brand needs to flash — treat it as a limited resource.

### Outlined Action Button
**Role:** Secondary actions, lower-emphasis CTAs like 'See Clutch in Action →'

Transparent fill, Obsidian (#000000) 1px border, Obsidian text, 6px radius, 10px/20px padding. Carries an arrow glyph (→) for directional affordance.

### Pill Connector Button
**Role:** Lightweight link/connector between two visual elements (e.g. 'Delegate to' between Human Identities and AI Agents)

Canvas fill, Pewter (#dfdfdf) 1px border, Obsidian text, 6px radius, compact padding ~6px/14px. Small Inter 14px. Functions as a relational link, not a primary action.

### Navigation Header
**Role:** Sticky top navigation with logo, menu items, and CTA

Canvas white background, no border or shadow. Left: Clutch wordmark + mark in Obsidian. Center: Inter 14px nav links (Platform, Solutions, Use Cases, Resources, Company) in Obsidian with generous horizontal spacing (24-32px gaps). Right: Primary CTA Button (Filled Black).

### Display Headline (Mixed Weight)
**Role:** The signature typographic component for hero and section headers

PP Radio Grotesk at 56-68px, line-height 1.10, letter-spacing -0.01em. Key words in weight 600, supporting words in weight 400, all in Obsidian. The mixed-weight technique is the brand's voice — never bold a whole sentence, always create rhythm through weight contrast.

### Comparison Card
**Role:** Two-column feature comparison blocks (e.g. Human Identities vs AI Agents)

Canvas fill, Pewter (#dfdfdf) 1px border, 6px radius, 24-32px internal padding. Contains a 3D icon at top (~80-100px), a PP Radio Grotesk heading at 24-26px weight 600, a status badge ('MANAGED' / 'MULTIPLYING') at the bottom. Very flat, very structural.

### Status Badge / Pill Label
**Role:** Uppercase category labels on cards and sections

Fog (#f9fafb) background, Graphite (#6e6e6e) text, 6px radius, 4px/10px padding. Text is PP Radio Grotesk or Inter at 10-12px weight 500, uppercase, letter-spacing 0.12-0.16em. These whisper rather than shout.

### Split Section (Text + Visual)
**Role:** Two-column layout for feature sections like 'Instant Setup, Immediate Impact'

Left column: headline + sub-text + CTA button. Right column: abstract visual (3D illustration, gradient page-fan, or integration logos). Column gap 32-48px, aligned to 1200px max-width. Visual elements often have generous internal padding and feel sculptural against the flat text.

### Integration Logo Cluster
**Role:** Brand trust display — logos of partner integrations (Azure AD, CrowdStrike, 1Password, Splunk, Oracle)

Logos in Obsidian (#000000) at varying sizes (24-32px), arranged in a loose vertical or staggered grid on the right side of a split section. No borders or containers — logos float on the Canvas background with generous whitespace.

### 3D Orbital Illustration
**Role:** Hero visual centerpiece — the identity-ecosystem metaphor

A dark Obsidian sphere (the 'clutch') with a lavender/lilac 3D brand mark on top, surrounded by a circular orbit of small icon tokens on Canvas-white circular badges with Pewter borders. The orbit implies connection and coverage. This is the only moment the system allows complex 3D rendering.

### Gradient Page-Fan Visual
**Role:** Dynamic visual for the 'Instant Setup' section showing pages fanning out

Abstract linear gradient from Obsidian to Canvas (or black-to-white at ~110°) suggesting a document or page fanning open. A blue beam/light slice runs through the composition. No container — the gradient bleeds into the Canvas background.

## Do's and Don'ts

### Do
- Use PP Radio Grotesk for all display and heading text at 26px and above; never substitute a system font at these sizes
- Apply the mixed-weight headline technique: weight 600 on 1-2 key words, weight 400 on supporting words, all in Obsidian
- Keep Electric Cobalt (#004dff) as a single-use accent per page — one CTA, one highlight, then retreat to monochrome
- Use 1px Slate Mist (#e5e7eb) or Pewter (#dfdfdf) borders for all card and container edges; never use heavy 2px+ borders
- Set section gaps at 80px and let elements breathe; resist the urge to compact sections together
- Pair 6px border-radius consistently across cards, buttons, and inputs — it is the system's corner language
- Use uppercase PP Radio Grotesk at 10-12px with 0.12-0.16em letter-spacing for category labels and section eyebrows

### Don't
- Don't bold an entire headline — always create rhythm by mixing weight 400 and 600 within the sentence
- Don't use multiple accent colors; if Electric Cobalt is on a button, don't add Periwinkle fills nearby
- Don't apply drop shadows beyond the single 6px offset pattern at 16% opacity; the system is flat by design
- Don't use border-radius above 6px for UI elements (the 80px is reserved for 3D illustration elements only)
- Don't center-align body text or long-form descriptions — only display headlines and short CTAs get centered
- Don't introduce new typefaces; PP Radio Grotesk for display, Inter for UI — nothing else is needed
- Don't use full-bleed dark sections; the system stays in Canvas-white with only button fills going Obsidian

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, dominant surface |
| 1 | Fog | `#f9fafb` | Subtle alternating section background, barely-warm off-white |
| 2 | Periwinkle Wash | `#d9e4ff` | Brand-tinted highlight surface, soft accent zone |
| 3 | Obsidian | `#000000` | Inverted dark surface for button fills, dark UI elements |

## Elevation

- **Link hover state:** `rgba(0, 0, 0, 0.16) 0px 2px 6px 0px`

## Imagery

Imagery is extremely sparse and high-impact. The primary visual language is 3D rendered illustration: dark Obsidian spheres with lavender/Periwinkle brand marks, surrounded by orbiting circular icon tokens with thin borders. A secondary pattern uses abstract linear gradients (Obsidian to Canvas) suggesting fanning pages with a blue light beam slicing through. When real-world brand logos appear (Azure AD, CrowdStrike, 1Password, Splunk, Oracle), they are rendered flat in Obsidian at 24-32px without containers. There is no photography, no stock imagery, and no decorative backgrounds — the white canvas is the hero, and every image element earns its placement.

## Layout

The page follows a centered, max-width 1200px contained layout with generous 80px section breaks. The hero is a full-bleed Canvas-white band with a centered display headline above a 3D orbital illustration that occupies roughly 40% of the viewport height. Sections below follow a consistent rhythm: a centered text block, then alternating split-layout (text-left/visual-right or text-right/visual-left) bands with 32-48px column gaps. Feature comparisons use a two-column card grid. The navigation is a minimal sticky top bar with logo-left, centered links, and CTA-right. The overall density is spacious — each section claims its full vertical space without crowding. No sidebar, no mega-menu, no overlapping panels.

## Agent Prompt Guide

**Quick Color Reference**
- Primary text: #000000 (Obsidian)
- Secondary text: #6e6e6e (Graphite)
- Page background: #ffffff (Canvas)
- Border: #e5e7eb (Slate Mist)
- Brand accent: #004dff (Electric Cobalt)
- primary action: #004dff (filled action)

**3-5 Example Component Prompts**

1. Create a hero headline: 'Every Identity. Every Agent. Every Secret.' at 68px PP Radio Grotesk, line-height 1.10, letter-spacing -0.01em, Obsidian (#000000). Set 'Every Identity.' and 'Every Agent.' in weight 600, 'Every Secret.' in weight 400. Center-aligned on Canvas (#ffffff) background with 80px top padding.

2. Create a primary CTA button: Electric Cobalt (#004dff) background, Canvas (#ffffff) text 'Book a demo' at 14px Inter weight 500, 6px border-radius, 10px vertical padding, 20px horizontal padding. Use this as the single brand-color action on the page.

3. Create a comparison card: Canvas (#ffffff) fill, Pewter (#dfdfdf) 1px border, 6px border-radius, 24px padding. Content: a 3D icon at 80px size at top, a PP Radio Grotesk heading 'Human Identities' at 26px weight 600, and a status badge at bottom reading 'MANAGED' in Inter 12px weight 500 uppercase with 0.12em letter-spacing on Fog (#f9fafb) background with Graphite (#6e6e6e) text, 6px radius, 4px/10px padding.

4. Create a split section layout: max-width 1200px, two columns with 32px gap. Left column: headline 'Instant Setup, Immediate Impact' in PP Radio Grotesk 38px weight 600, Obsidian, followed by an outlined action button with Obsidian 1px border, 6px radius, Obsidian text 'See Clutch in Action →' at 14px Inter weight 500. Right column: an abstract gradient visual transitioning from Obsidian to Canvas at 110° with a blue light beam.

5. Create a Primary Action Button: #004dff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Linear** — Same flat minimalism with single chromatic accent (purple/blue), geometric display sans for headlines, and generous whitespace with 6px card corners
- **Vercel** — Same gallery-white aesthetic with large confident display type, near-zero shadows, hairline borders, and one accent color doing all the chromatic work
- **Resend** — Same centered hero pattern with 3D illustration centerpiece, monochrome palette with single brand-color CTA, and PP Radio Grotesk-adjacent display typography
- **Plaid** — Same split-section rhythm with text-and-visual bands, mixed-weight headline treatment, and the discipline of using color only for functional punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #004dff;
  --color-periwinkle-wash: #d9e4ff;
  --color-lavender-veil: #e6c5f7;
  --color-obsidian: #000000;
  --color-graphite: #6e6e6e;
  --color-stone: #c9c9c9;
  --color-ash: #d9d9d9;
  --color-pewter: #dfdfdf;
  --color-slate-mist: #e5e7eb;
  --color-fog: #f9fafb;
  --color-canvas: #ffffff;

  /* Typography — Font Families */
  --font-pp-radio-grotesk: 'PP Radio Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.16px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.02px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.01px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -0.01px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.01px;
  --text-display: 68px;
  --leading-display: 1.1;
  --tracking-display: -0.01px;

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
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 60px;
  --radius-full-2: 80px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-badges: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-illustration: 80px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.16) 0px 2px 6px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-fog: #f9fafb;
  --surface-periwinkle-wash: #d9e4ff;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #004dff;
  --color-periwinkle-wash: #d9e4ff;
  --color-lavender-veil: #e6c5f7;
  --color-obsidian: #000000;
  --color-graphite: #6e6e6e;
  --color-stone: #c9c9c9;
  --color-ash: #d9d9d9;
  --color-pewter: #dfdfdf;
  --color-slate-mist: #e5e7eb;
  --color-fog: #f9fafb;
  --color-canvas: #ffffff;

  /* Typography */
  --font-pp-radio-grotesk: 'PP Radio Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: 0.16px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.02px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.01px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -0.01px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.01px;
  --text-display: 68px;
  --leading-display: 1.1;
  --tracking-display: -0.01px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 60px;
  --radius-full-2: 80px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.16) 0px 2px 6px 0px;
}
```
