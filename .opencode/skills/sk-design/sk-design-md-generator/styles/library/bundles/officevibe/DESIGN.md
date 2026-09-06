# Officevibe — Style Reference
> Editorial journal on warm cream paper. Think a thoughtful HR essay rendered as a product — serif italics whispering through a modern blue interface.

**Theme:** light

Workleap Officevibe speaks in a calm editorial register: a warm cream canvas, generous whitespace, and serif display type that lends the product a literary, almost handwritten authority. The palette pivots between two blues — a deep ink-navy for headings, dark cards, and editorial weight, and a vivid electric blue reserved for buttons and interactive punctuation. Surfaces are paper-soft with cream borders rather than gray; corners are gently rounded (16px cards, 100px pill buttons). The italicized serif words inside otherwise sans-serif headlines ("not paying attention", "Everything") are the signature: they break the corporate SaaS voice and make the interface feel like a well-edited magazine. Density stays comfortable; the chat widget anchored at the bottom of every screen is part of the identity, not an afterthought.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Navy | `#0c1754` | `--color-ink-navy` | Display headings, dark feature cards, footer background, body text on light canvas — the editorial weight color, used wherever the page needs to feel considered rather than decorative |
| Electric Cobalt | `#2545ff` | `--color-electric-cobalt` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Charcoal | `#171417` | `--color-charcoal` | Primary body and heading text, nav text, icon strokes on light surfaces |
| Warm Canvas | `#f9f8f6` | `--color-warm-canvas` | Page background, footer surface, soft card fills, input backgrounds — the unifying warm off-white |
| Paper White | `#ffffff` | `--color-paper-white` | Elevated card surfaces, button text, nav background, input fields, icon fills on dark |
| Cream Border | `#f0e9e1` | `--color-cream-border` | Hairline dividers, card borders, subtle section separators — replaces the typical cool gray to keep the page warm |
| Graphite | `#222222` | `--color-graphite` | Secondary text, button text in outlined/ghost states, nav inactive labels |
| Stone | `#969696` | `--color-stone` | Muted helper text, placeholder content, tertiary metadata |
| Smoke | `#cccccc` | `--color-smoke` | Input borders, disabled form states, neutral dividers on white |
| Lavender Mist | `#eaebf8` | `--color-lavender-mist` | Tinted badge backgrounds, soft highlight washes on white surfaces — a whisper of the electric blue |

## Tokens — Typography

### Martinaplantijn — Display serif reserved for the largest hero and section headlines (40-64px). Its italic cuts carry the brand voice — the words that bend feel personal and editorial, breaking the SaaS monotone. Substitute: a humanist serif like GT Super or Tiempos Text. · `--font-martinaplantijn`
- **Substitute:** GT Super Display
- **Weights:** 400
- **Sizes:** 40px, 64px
- **Line height:** 1.00-1.10
- **Letter spacing:** normal
- **OpenType features:** `"ss01", "ss04"`
- **Role:** Display serif reserved for the largest hero and section headlines (40-64px). Its italic cuts carry the brand voice — the words that bend feel personal and editorial, breaking the SaaS monotone. Substitute: a humanist serif like GT Super or Tiempos Text.

### Abcfavoritvariable — Geometric sans for sub-headings, step labels, and eyebrow text (16-40px). Tight tracking at large sizes (-0.05em) is the signature — it makes the type feel modern and compressed against the serif display. The ss01/ss04 alternates likely swap in single-story 'a' and more open terminals. Substitute: ABC Diatype Mono or Inter Tight. · `--font-abcfavoritvariable`
- **Substitute:** ABC Diatype
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- **Line height:** 1.00-1.50
- **Letter spacing:** -0.05em at 48-64px, -0.02em at 24-40px
- **OpenType features:** `"ss01", "ss04"`
- **Role:** Geometric sans for sub-headings, step labels, and eyebrow text (16-40px). Tight tracking at large sizes (-0.05em) is the signature — it makes the type feel modern and compressed against the serif display. The ss01/ss04 alternates likely swap in single-story 'a' and more open terminals. Substitute: ABC Diatype Mono or Inter Tight.

### Inter — Workhorse for body copy, button labels, nav items, form fields, captions, and footer text. Stays neutral so the serif display and Abcfavorit can carry personality. The ss01/ss04 features are inherited to keep the typographic family consistent across all three faces. · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 20px
- **Line height:** 1.20-1.60
- **Letter spacing:** normal
- **OpenType features:** `"ss01", "ss04"`
- **Role:** Workhorse for body copy, button labels, nav items, form fields, captions, and footer text. Stays neutral so the serif display and Abcfavorit can carry personality. The ss01/ss04 features are inherited to keep the typographic family consistent across all three faces.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.6 | — | `--text-body-sm` |
| body | 16px | 1.6 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.4 | -0.48px | `--text-heading-sm` |
| heading | 32px | 1.4 | -0.64px | `--text-heading` |
| heading-lg | 40px | 1.2 | -0.8px | `--text-heading-lg` |
| display | 48px | 1.1 | -2.4px | `--text-display` |
| display-lg | 64px | 1 | -3.2px | `--text-display-lg` |

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
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 16px |
| images | 24px |
| inputs | 16px |
| buttons | 100px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Filled Pill Button (Primary)
**Role:** Main call-to-action

Pill shape at 100px radius, Electric Cobalt (#2545ff) background, Paper White (#ffffff) text, Inter 16px weight 500, padding 12px 24px. Used for 'Request a demo' and the hero CTA. No shadow — the color does the work.

### Ghost Nav Button
**Role:** Secondary navigation link

Transparent background, Graphite (#222222) text, Inter 14px weight 500, no border. Sits inline with the nav bar, uses 16-24px horizontal padding.

### Eyebrow Label
**Role:** Section pre-heading

All-caps Inter 12px weight 700 or Abcfavorit 12px weight 500, Charcoal (#171417), letter-spacing 0.12em, sits 16-24px above the section heading. Example pattern: 'WORKLEAP OFFICEVIBE' above the hero headline.

### Display Headline with Italic Accent
**Role:** Hero and section titles

Martinaplantijn 48-64px, weight 400, lineHeight 1.0-1.1, Charcoal (#171417) on cream or Paper White on Ink Navy. A specific phrase inside the headline is set in italic (e.g. 'not paying attention', 'Everything') — this italic cut is the brand's typographic signature.

### Step Card — Dark
**Role:** Feature step on dark background

Ink Navy (#0c1754) background, 16px radius, 24-32px padding. Contains a numbered badge in Electric Cobalt, an Abcfavorit sub-heading in Paper White, and supporting copy in Lavender Mist (#eaebf8) or white at 70% opacity.

### Step Card — Light
**Role:** Feature step on light background

Paper White (#ffffff) background, 16px radius, cream border (#f0e9e1) at 1px, 24-32px padding. The middle step in the 3-card row — it stays neutral to let the dark and bordered variants pop.

### Step Card — Bordered Accent
**Role:** Feature step with highlight

Paper White (#ffffff) background, Electric Cobalt (#2545ff) border at 1.5px, 16px radius, 24-32px padding. Used for the 'Act with an AI coach' card to draw the eye to the most differentiated capability.

### Chat Widget
**Role:** Persistent AI assistant

Fixed to bottom-center of viewport. Paper White background, 16px radius, 1px Smoke (#cccccc) border, soft shadow. Header row contains a small Electric Cobalt circular avatar, Inter 14px question text, and three pill suggestion chips below the input. ~360px wide.

### FAQ Accordion Row
**Role:** Expandable question

Paper White (#ffffff) background, 1px cream border (#f0e9e1) on the bottom edge only, 24px vertical padding, Inter 16px weight 500 question text in Charcoal (#171417), chevron icon in Graphite on the right. Expands to reveal body copy at 16px weight 400.

### Product Dashboard Card
**Role:** In-context product screenshot

Paper White (#ffffff) background, 16px radius, subtle shadow (0 4px 24px rgba(12,23,84,0.08)). Contains a chart with a purple-to-coral gradient area fill, a circular score gauge in Electric Cobalt and Ink Navy, and metric rows with green/orange/red sentiment dots.

### Top Navigation Bar
**Role:** Global site navigation

Warm Canvas (#f9f8f6) background, Wordmark 'workleap' at left in Inter 18px weight 700, horizontal nav links in Inter 14px weight 500 Graphite, 'Log in' as ghost link and 'Request a demo' as the filled pill button at right. 64-72px tall, sits directly on the canvas without a separator line.

### Metric Pill Badge
**Role:** Status and sentiment indicators

Lavender Mist (#eaebf8) background, Ink Navy (#0c1754) text, Inter 12px weight 500, 16px radius, 4px 10px padding. Used for category labels and inline tags.

## Do's and Don'ts

### Do
- Set the largest headline in Martinaplantijn 48-64px and italicize one phrase inside it — the italic cut is the brand voice, not decoration.
- Use Electric Cobalt (#2545ff) exclusively for filled action buttons, active links, and the single most important icon per view; let it be the only chromatic punctuation on the page.
- Pair Ink Navy (#0c1754) with Paper White for dark feature cards and the footer; never use a gray to approximate it.
- Default to 100px pill radius for any clickable element that should feel approachable (buttons, tags, suggestion chips).
- Use 16px radius for cards, images, and the chat widget; 24px radius only for large hero illustrations.
- Keep the canvas at #f9f8f6 and use #f0e9e1 cream borders for dividers — do not introduce cool grays.
- Apply letter-spacing -0.05em to any Abcfavorit text at 40px and above so the geometric sans feels compressed and modern next to the serif.

### Don't
- Do not set the display headline in Inter or Abcfavorit — Martinaplantijn (or a humanist serif) is required for the editorial voice.
- Do not use Electric Cobalt (#2545ff) for body text, borders, or large background fills — it loses its punch as a button accent.
- Do not use a gray border (#e5e5e5, #d4d4d4) — the system uses warm cream (#f0e9e1) for every hairline.
- Do not add box-shadow to filled buttons; the color is the elevation.
- Do not introduce a third heading color beyond Charcoal, Paper White, and Ink Navy — the two-blue system is the palette.
- Do not center-align body copy or set line-height below 1.5 at body sizes; the editorial feel depends on generous reading rhythm.
- Do not use a square or 4px radius on cards or inputs — the 16px softness is part of the visual identity.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f9f8f6` | Page background and footer |
| 1 | Paper | `#ffffff` | Elevated cards, input fields, chat widget |
| 2 | Ink | `#0c1754` | Dark feature cards, reversed text surfaces |

## Elevation

- **Product Dashboard Card:** `0 4px 24px rgba(12, 23, 84, 0.08)`
- **Chat Widget:** `0 8px 32px rgba(12, 23, 84, 0.12)`
- **Filled Pill Button:** `none — flat, color carries the weight`

## Imagery

Product screenshots are the primary visual — dashboard mockups showing sentiment scores, survey results, and AI chat panels are rendered at large scale and offset with tilted decorative cards behind them for depth. The dashboard's signature chart uses a purple-to-coral gradient area fill over a navy line, with a circular score gauge in Electric Cobalt. No lifestyle photography; no stock imagery. The only decorative graphic device is the slightly rotated dark card peeking out from behind the main product visual, creating a layered editorial feel. Icons are minimal, mono-color, and use Charcoal or Electric Cobalt only — no multicolor iconography.

## Layout

Max-width ~1200px centered with generous side padding. The hero is a 2-column split: left column holds an eyebrow label, the display headline (with italic phrase), supporting body copy, and a filled CTA; the right column holds the product dashboard mockup, vertically centered against the text. The steps section is a centered headline over a 3-column card grid with numbered badges and connecting hand-drawn arrows. The FAQ section flips to a 2-column layout: a sticky left column with a large display headline (italic accent on the first word) and a right column of accordion rows. Vertical rhythm uses ~80px between major sections with seamless flow — no hard section dividers, only whitespace and the warm cream canvas holding everything together. The chat widget is fixed to bottom-center on every screen.

## Agent Prompt Guide

**Quick Color Reference**
- text: #171417
- background: #f9f8f6
- card surface: #ffffff
- border: #f0e9e1
- accent: #2545ff
- primary action: no distinct CTA color

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Build a 3-card feature row. Middle card: #ffffff background, 16px radius, 1px #f0e9e1 border, 32px padding. Left card: #0c1754 background, 16px radius, 32px padding, white text. Right card: #ffffff background, 1.5px #2545ff border, 16px radius, 32px padding. Numbered badge (1, 2, 3) in #2545ff at top-left of each card.
3. Create a fixed chat widget pinned to bottom-center: 360px wide, #ffffff background, 16px radius, 1px #cccccc border, shadow 0 8px 32px rgba(12,23,84,0.12). Header row has a 32px #2545ff circular avatar and Inter 14px question text. Three pill suggestion chips below: #f9f8f6 background, #171417 text, 100px radius, 8px 14px padding.
4. Build an FAQ accordion row: #ffffff background, no top/left/right border, 1px #f0e9e1 bottom border, 24px vertical padding. Question in Inter 16px weight 500, #171417. Chevron icon at right in #222222. Expand to reveal body copy in Inter 16px weight 400, #171417, line-height 1.6.
5. Create a product dashboard card: #ffffff background, 16px radius, shadow 0 4px 24px rgba(12,23,84,0.08), 32px padding. Inside, a circular gauge showing '8.2' in #2545ff with a thin #0c1754 arc, next to a chart area with a purple-to-coral gradient fill and a navy trend line.

## Similar Brands

- **Linear** — Same approach of letting a single vivid accent color carry all interactivity against a clean light surface.
- **Notion** — Shared comfortable light-canvas density, soft card radii, and pill-shaped primary buttons.
- **Substack** — Editorial sensibility with serif display type and italic emphasis set against a warm off-white background.
- **Plausible Analytics** — Restraint with a single accent blue, flat product screenshots as hero visuals, and minimal decoration.
- **Stripe** — Two-tone blue system (deep navy + electric blue) used the same way: one for editorial weight, one for action.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-navy: #0c1754;
  --color-electric-cobalt: #2545ff;
  --color-charcoal: #171417;
  --color-warm-canvas: #f9f8f6;
  --color-paper-white: #ffffff;
  --color-cream-border: #f0e9e1;
  --color-graphite: #222222;
  --color-stone: #969696;
  --color-smoke: #cccccc;
  --color-lavender-mist: #eaebf8;

  /* Typography — Font Families */
  --font-martinaplantijn: 'Martinaplantijn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcfavoritvariable: 'Abcfavoritvariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.6;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.8px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -2.4px;
  --text-display-lg: 64px;
  --leading-display-lg: 1;
  --tracking-display-lg: -3.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 9px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 16px;
  --radius-images: 24px;
  --radius-inputs: 16px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-canvas: #f9f8f6;
  --surface-paper: #ffffff;
  --surface-ink: #0c1754;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-navy: #0c1754;
  --color-electric-cobalt: #2545ff;
  --color-charcoal: #171417;
  --color-warm-canvas: #f9f8f6;
  --color-paper-white: #ffffff;
  --color-cream-border: #f0e9e1;
  --color-graphite: #222222;
  --color-stone: #969696;
  --color-smoke: #cccccc;
  --color-lavender-mist: #eaebf8;

  /* Typography */
  --font-martinaplantijn: 'Martinaplantijn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcfavoritvariable: 'Abcfavoritvariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.6;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.8px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -2.4px;
  --text-display-lg: 64px;
  --leading-display-lg: 1;
  --tracking-display-lg: -3.2px;

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
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 9px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 100px;
}
```
