# Pika — Style Reference
> Cream diptych meets cinema void

**Theme:** mixed

Pika is a warm-cold diptych: a cream paper canvas on the left holds the product (video, copy, brand mark), while a near-black void on the right houses functional UI (auth, navigation). The palette is almost monastic — black, white, cream, two grays — with cream (#ffedd2) acting as the only warmth, a deliberate foil to the cinematic dark that makes the AI-generated video read as 'premiere' rather than 'demo'. Type is a whisper-to-shout system: telka at weights 300-450 for everything functional reads like editorial body copy, while telkaExtended at weight 900 detonates on the single display heading ('REALITY IS OPTIONAL') to create punctuation, not hierarchy. Components are bare and rectangular: 6px-radius buttons, 10px-radius containers, 1px hairline borders, zero shadows. The design relies on contrast (cream/void, 300/900, still/motion) rather than ornament to carry the brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#ffedd2` | `--color-cream-paper` | Left-panel canvas, the warm half of the split — also used as a quiet heading surface and the background of the primary video preview tile |
| Void Black | `#0d0d0d` | `--color-void-black` | Right-panel canvas, primary text on cream, icon strokes and fills |
| Polished White | `#ffffff` | `--color-polished-white` | Filled auth button surfaces on the dark panel, body text on the dark panel, icon strokes on dark |
| Hairline Gray | `#e5e7eb` | `--color-hairline-gray` | Dividers, button borders, icon strokes, subtle structural lines on the cream side |
| Muted Ash | `#9e9e9e` | `--color-muted-ash` | Secondary helper text, muted link state, copyright/footer labels on dark |
| Surface Charcoal | `#1f1f1f` | `--color-surface-charcoal` | Subtle elevation lift on the dark panel — hovered or pressed button states, recessed containers |

## Tokens — Typography

### telka — All functional UI — body copy, buttons, links, icons, captions. The whisper-weight stance (300-450 range) is anti-convention: most product UI pushes 500-600 for body. Light weights here make the chrome feel like editorial print, not SaaS dashboard. · `--font-telka`
- **Substitute:** Inter, General Sans, Switzer
- **Weights:** 300, 400, 450
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.33–1.50
- **Letter spacing:** -0.02em (body tightens for that printed-page feel); +0.01em for slightly larger sizes
- **Role:** All functional UI — body copy, buttons, links, icons, captions. The whisper-weight stance (300-450 range) is anti-convention: most product UI pushes 500-600 for body. Light weights here make the chrome feel like editorial print, not SaaS dashboard.

### telkaExtended — Sole display voice — the 'REALITY IS OPTIONAL' headline. Weight 900 is theatrical, designed to detonate against the whisper-weight body below. Use sparingly: one display moment per page, never for section headings or subheadings. · `--font-telkaextended`
- **Substitute:** Suisse Int'l Bold, Inter Black, Archivo Black
- **Weights:** 900
- **Sizes:** 32px
- **Line height:** 1.13
- **Letter spacing:** +0.01em — slightly opened to let the condensed weight breathe
- **Role:** Sole display voice — the 'REALITY IS OPTIONAL' headline. Weight 900 is theatrical, designed to detonate against the whisper-weight body below. Use sparingly: one display moment per page, never for section headings or subheadings.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| display | 32px | 1.13 | 0.32px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 10px |
| inputs | 6px |
| buttons | 6px |

### Layout

- **Section gap:** 56-80px
- **Card padding:** 16-20px
- **Element gap:** 10px

## Components

### Diptych Hero Split
**Role:** Primary landing layout — 50/50 horizontal split between warm product canvas and dark functional panel

Left half: #ffedd2 background, holds brand wordmark, embedded video tile (10px radius), descriptive body copy in telka 16px/300, and a 'happy across different roles' tagline. Right half: #0d0d0d background, holds display headline (telkaExtended 32px/900 white) and auth stack. The two halves never bleed into each other — the seam is a hard vertical edge, not a gradient transition.

### Display Headline (telkaExtended 900)
**Role:** The one shouty moment on the page

32px / line-height 1.13 / weight 900 / letter-spacing +0.01em / color #ffffff. Reserved for hero-level editorial statements. All-caps by convention. Sets in tight — no second line of subhead follows it; it stands alone.

### Brand Wordmark
**Role:** Logo lockup in the cream panel

'Pika' in telka weight 400, ~24px, color #0d0d0d on cream. Centered above the video tile. Quiet, not decorated — no icon, no underline, no color shift.

### Video Preview Tile
**Role:** The product showcase in the cream panel

Container 10px radius, holds an autoplaying muted video. A small speaker/mute toggle sits in the bottom-right corner (~24px, #ffffff on translucent dark). Video content extends edge-to-edge inside the radius; no border or shadow.

### Filled Auth Button (White on Dark)
**Role:** Primary sign-in actions on the dark panel

Background #ffffff, text and leading icon #0d0d0d, weight 450, 14px. Padding approximately 12px vertical × 16px horizontal. Radius 6px. Full container width. No border, no shadow, no hover lift — flat rect. Provider icon (Google/Facebook/Discord/Email) sits left of label, baseline-aligned.

### Email Sign-In Button (Outlined on Dark)
**Role:** Secondary sign-in option — visually distinct from OAuth buttons

Transparent background, 1px border #e5e7eb at ~30% opacity (or a desaturated cream), text and icon #0d0d0d or #e5e7eb, weight 450, 14px. Same 6px radius and full width as filled buttons. Separated from the OAuth stack by a thin horizontal rule with an 'or' label centered on it.

### OAuth Divider with 'or'
**Role:** Rhythm break between OAuth group and email fallback

1px line #e5e7eb at low opacity, full container width. The word 'or' sits centered on the line in telka 12px, color #9e9e9e. No box, no background mask — the type overlaps the rule directly.

### Legal / Terms Microcopy
**Role:** Consent disclosure beneath the sign-in stack

telka 12px / line-height 1.50 / weight 300 / color #9e9e9e. Inline links to Terms of Service, Acceptable Use Policy, and Privacy Policy are underlined and #e5e7eb — they pick up the hairline color so the link color matches the border color, not the text color. Unusual but on-system.

### Footer Link Row
**Role:** Bottom-right secondary navigation

Horizontal row of telka 12px links (Twitter, Discord, Careers, Blog), color #9e9e9 default, hover lifts to #e5e7eb. No separators between items — relies on natural word spacing. A second sub-row below holds Privacy/Terms/Support in the same treatment.

### Section Divider (within cream panel)
**Role:** Quiet break before footer microcopy

A 1px #e5e7eb hairline spanning the cream panel's content width, with comfortable vertical padding (32-56px) above. No box, no shadow — the line is the only ornament.

## Do's and Don'ts

### Do
- Maintain the 50/50 diptych as the primary layout model — cream on the left for product/story, void on the right for functional UI. Never let the two halves merge into one continuous background.
- Use telkaExtended 900 only once per page, for the display headline. Everything else — body, buttons, links — stays in telka 300-450.
- Set body type at -0.02em letter-spacing. The negative tracking is what makes the light weights feel like printed editorial type rather than airy SaaS chrome.
- Use #ffedd2 cream as a true canvas, not a highlight. It should fill large left-panel regions, not appear as a 4px accent stripe.
- Build buttons at exactly 6px radius — never rounded to 8px or 12px. The slight radius reads as 'rectangular with intent', not 'friendly pill'.
- Keep filled auth buttons #ffffff on #0d0d0d. Do not introduce a chromatic CTA color — the contrast between white-on-black is the action signal.
- Separate the OAuth stack from the email fallback with a hairline divider + 'or' label, not extra vertical space. The divider carries the structural meaning.

### Don't
- Do not add a chromatic brand color (blue, purple, green) to the palette. The system is warm-cream + void + neutrals only; introducing a hue breaks the cinema/editorial metaphor.
- Do not apply shadows to cards, buttons, or modals. The design is flat — depth comes from cream/void contrast, not from elevation.
- Do not use telkaExtended for section headings, subheadings, or card titles. Weight 900 is display-only; functional hierarchy comes from size and weight shifts within telka 300-450.
- Do not round buttons to 8px, 12px, or pill (9999px). The 6px radius is the system — deviating reads as a different product.
- Do not center body copy on the cream panel. Body text and supporting microcopy align left; only the brand mark, video tile, and tagline center.
- Do not add gradients, glows, or color washes to buttons or the dark panel. Every surface is a flat fill — no gradient transitions between the cream and void halves.
- Do not use #0d0d0d for body text on the cream panel and #ffffff for body text on the dark panel as if they were the same role. The system has two text registers: dark-on-cream and light-on-void, and they must not cross.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Canvas | `#ffedd2` | Left half of the hero — the warm, editorial product surface that hosts video and copy |
| 2 | Void Panel | `#0d0d0d` | Right half of the hero — the dark functional surface that hosts auth and navigation |
| 3 | White Card | `#ffffff` | Raised button surface on the void panel; the only 'lifted' element in the system |
| 4 | Charcoal Lift | `#1f1f1f` | Pressed/hovered state of dark-panel elements — barely visible but distinct from the base void |

## Elevation

The system deliberately avoids shadow-based elevation. All depth is communicated through surface color contrast (cream vs void, white on void, charcoal lift) and 1px hairline borders. A single hairline at #e5e7eb on cream is the only structural line in the entire system; everything else is flat fill against flat fill.

## Imagery

Imagery is the product. The hero video tile shows a cinematic AI-generated clip (a Shiba Inu seated between broadcast microphones, overlaid with 'AUDIO-DRIVEN PERFORMANCES' title cards) — the visual is a 'still from a premiere', not a screenshot or illustration. Treatment: dark, cinematic, letterboxed, with on-screen typography that borrows from film title design. No supporting photography, no lifestyle imagery, no decorative illustration. The video lives inside a 10px-radius container on the cream canvas, and the contrast between the dark cinematic frame and the warm paper background is the visual hook. No icons in the chrome beyond the OAuth provider marks; the UI is almost iconless outside of those functional glyphs.

## Layout

Full-bleed split-screen diptych as the hero — the viewport is divided 50/50 horizontally, cream left / void right, with no max-width cap. The left column centers its contents (brand mark, video tile, tagline) within its half; the right column left-aligns its auth stack within a narrower content column (roughly 400-500px) inset from the void panel's right edge. Vertical rhythm: comfortable 56-80px section gaps, 10-20px between elements within a stack. No alternating bands below the hero — the diptych IS the page for this view. Navigation is a bare text row (Twitter / Discord / Careers / Blog) bottom-right of the void panel, no top bar, no sticky header. The layout's signature is the hard vertical seam between cream and void — never a gradient, never a shared background.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffedd2 (left panel) / #0d0d0d (right panel)
- text: #0d0d0d (on cream) / #ffffff (on void)
- border: #e5e7eb
- accent: #ffedd2 (cream — used as canvas, not as a button color)
- primary action: no distinct CTA color

**Example Component Prompts**
1. **Diptych hero:** 50/50 split, left half #ffedd2, right half #0d0d0d. Left: centered 'Pika' wordmark in telka 24px weight 400 #0d0d0d, then a 10px-radius video tile, then telka 16px weight 300 #0d0d0d body copy, then 12px weight 300 tagline. Right: telkaExtended 32px weight 900 #ffffff display headline, then a stack of 6px-radius filled white buttons (#ffffff bg, #0d0d0d text, telka 14px weight 450), each with a leading provider icon, then a hairline divider with centered 'or' (12px, #9e9e9e), then a 6px-radius outlined button (1px #e5e7eb border at low opacity, #e5e7eb text) for email sign-in, then 12px #9e9e9e legal microcopy with underlined #e5e7eb inline links.

2. **Filled auth button (Google):** 6px radius, #ffffff background, 1px #e5e7eb hairline border optional, Google 'G' icon left at 16px #0d0d0d, label 'Sign in with Google' in telka 14px weight 450 #0d0d0d, full container width, 12px vertical padding, 16px horizontal padding. Flat — no shadow, no gradient.

3. **Email sign-in button (outlined):** 6px radius, transparent background, 1px #e5e7eb border at 30% opacity, envelope icon left at 16px #e5e7eb, label 'Sign in with an email' in telka 14px weight 450 #e5e7eb, full container width. Visual rhythm: this button should feel quieter than the white OAuth buttons — it's the fallback, not the headline action.

4. **OAuth divider with 'or':** 1px #e5e7eb hairline at 30% opacity, full container width, with the word 'or' centered in telka 12px weight 300 #9e9e9e directly overlapping the line. No background mask behind the type — the type sits on the rule.

5. **Footer link row:** horizontal row, telka 12px weight 400, color #9e9e9e default, items separated by ~20px space (no pipes, no bullets). Items: 'Twitter', 'Discord', 'Careers', 'Blog'. On hover, color lifts to #e5e7eb. No underline, no icon, no background change.

## Diptych Layout Rule

The defining layout primitive is the 50/50 horizontal split: cream on the left for product and story, void on the right for functional UI. This split is not a one-off hero treatment — it is the system's structural unit. When building additional pages, maintain the two-surface model: any 'content' or 'showcase' area lives on cream; any 'action' or 'form' area lives on void. The seam between them is always a hard vertical edge, never a gradient, blur, or shared background. The contrast itself is the brand.

## Typography Voice Contract

Two fonts, two voices, no overlap. telka (weights 300-450) is the functional voice — body, buttons, links, captions, form labels. telkaExtended (weight 900) is the editorial voice — used exactly once per page for the display headline. A page may use 50 instances of telka in different sizes; it may use telkaExtended at most once. Mixing them inside the same line, or using telkaExtended for anything below display size, breaks the whisper-to-shout contract that defines the system.

## Similar Brands

- **Runway** — Same AI-creative-tool split between warm product canvas and dark cinematic functional surface; both treat the video preview as the hero, not a sidebar asset
- **Midjourney** — Similar whisper-light body type against a cream/off-white canvas, with a single editorial display moment — both reject SaaS-dashboard density in favor of a magazine-page stance
- **Suno** — Same dark-panel-on-light-canvas diptych with cream-paper warmth, same whisper-weight body type, same willingness to let the product (audio/video) be the only visual story
- **Character.AI** — Same flat-rectangle component language (6-10px radii, no shadows) and same near-monochrome palette with one warm off-white as the signature surface
- **ElevenLabs** — Same split-screen landing pattern with cream/void halves, same hairline-border + flat-button component stack, and the same restraint of using a single warm neutral as the only chromatic presence

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #ffedd2;
  --color-void-black: #0d0d0d;
  --color-polished-white: #ffffff;
  --color-hairline-gray: #e5e7eb;
  --color-muted-ash: #9e9e9e;
  --color-surface-charcoal: #1f1f1f;

  /* Typography — Font Families */
  --font-telka: 'telka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-telkaextended: 'telkaExtended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-display: 32px;
  --leading-display: 1.13;
  --tracking-display: 0.32px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --section-gap: 56-80px;
  --card-padding: 16-20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;

  /* Named Radii */
  --radius-cards: 10px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Surfaces */
  --surface-cream-canvas: #ffedd2;
  --surface-void-panel: #0d0d0d;
  --surface-white-card: #ffffff;
  --surface-charcoal-lift: #1f1f1f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #ffedd2;
  --color-void-black: #0d0d0d;
  --color-polished-white: #ffffff;
  --color-hairline-gray: #e5e7eb;
  --color-muted-ash: #9e9e9e;
  --color-surface-charcoal: #1f1f1f;

  /* Typography */
  --font-telka: 'telka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-telkaextended: 'telkaExtended', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-display: 32px;
  --leading-display: 1.13;
  --tracking-display: 0.32px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
}
```
