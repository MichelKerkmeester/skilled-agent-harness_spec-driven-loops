# Medium — Style Reference
> cream-colored broadsheet at golden hour

**Theme:** light

Medium operates as a literary reading room translated to the web: a warm cream canvas (#f7f4ed) replaces the sterile white common to SaaS, making long-form prose feel like a printed page. The visual system is aggressively monochromatic — nearly every UI surface, text, and border sits in a narrow band of warm grays from #242424 to #6b6b6b — so the reader's attention goes entirely to content. The single brand gesture is the serif hero headline (GT Super at 120px, weight 400, tracking -0.055em), a deliberate anti-trend choice: a transitional book serif at display scale with whisper weight, not a bold geometric sans, signals 'we publish books, not software.' Buttons are full pills in near-black, the only solid ink on the page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Newsprint Cream | `#f7f4ed` | `--color-newsprint-cream` | Page canvas, hero background, section backgrounds — the warm off-white that makes the entire interface feel printed rather than digital |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, form inputs, and any surface that needs to lift off the cream canvas |
| Ink | `#242424` | `--color-ink` | Primary text, body copy, links, heading text — slightly warmer than pure black, sits comfortably on cream |
| Body Gray | `#333333` | `--color-body-gray` | Secondary text and default body color where slightly lighter than Ink is needed without losing contrast |
| Button Black | `#191919` | `--color-button-black` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Marginalia Gray | `#6b6b6b` | `--color-marginalia-gray` | Supporting neutral for secondary UI, dividers, and muted labels. |

## Tokens — Typography

### medium-content-sans-serif-font — medium-content-sans-serif-font — detected in extracted data but not described by AI · `--font-medium-content-sans-serif-font`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** medium-content-sans-serif-font — detected in extracted data but not described by AI

### GT Super — Display headlines and hero — a transitional book serif at extreme scale with tight tracking and 0.83 line-height. The choice to use weight 400 (not bold) at 120px is the signature: the letterforms do the work, not the weight. The negative tracking pulls the optical gaps closed, making 'Human stories & ideas' read as a single typographic block. · `--font-gt-super`
- **Substitute:** Playfair Display, EB Garamond, or Libre Caslon Text
- **Weights:** 400
- **Sizes:** 120px
- **Line height:** 0.83
- **Letter spacing:** -0.055em
- **OpenType features:** `"lnum" on, "pnum" on`
- **Role:** Display headlines and hero — a transitional book serif at extreme scale with tight tracking and 0.83 line-height. The choice to use weight 400 (not bold) at 120px is the signature: the letterforms do the work, not the weight. The negative tracking pulls the optical gaps closed, making 'Human stories & ideas' read as a single typographic block.

### Söhne — UI sans-serif for navigation, buttons, subheadings, and small headings. The 13–14px range handles nav and button labels; 20–22px covers subheadings and secondary hero text. Clean grotesque with humanist proportions — readable at small sizes, unobtrusive at large. · `--font-shne`
- **Substitute:** Inter, Söhne (paid), or IBM Plex Sans
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.27–1.54
- **Role:** UI sans-serif for navigation, buttons, subheadings, and small headings. The 13–14px range handles nav and button labels; 20–22px covers subheadings and secondary hero text. Clean grotesque with humanist proportions — readable at small sizes, unobtrusive at large.

### Charter / Georgia stack — Body content serif for reading view — the long-form article font. Set at 16px with tight 1.2 line-height, optimized for the column width of Medium's reader. · `--font-charter-georgia-stack`
- **Substitute:** Charter, Georgia, or Source Serif Pro
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.20
- **Role:** Body content serif for reading view — the long-form article font. Set at 16px with tight 1.2 line-height, optimized for the column width of Medium's reader.

### Söhne (extended) — Body sans-serif for non-reading contexts — descriptions, cards, inline content. Matches the content serif's metrics so the two can coexist at the same size. · `--font-shne-extended`
- **Substitute:** Inter or system-ui
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.20
- **Role:** Body sans-serif for non-reading contexts — descriptions, cards, inline content. Matches the content serif's metrics so the two can coexist at the same size.

### sohne — sohne — detected in extracted data but not described by AI · `--font-sohne`
- **Weights:** 400
- **Sizes:** 13px, 14px, 20px, 22px
- **Line height:** 1.27, 1.4, 1.43, 1.54
- **Role:** sohne — detected in extracted data but not described by AI

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.27 | — | `--text-caption` |
| body | 16px | 1.2 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 22px | 1.54 | — | `--text-heading-sm` |
| display | 120px | 0.83 | -6.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 0px |
| inputs | 0px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 16-24px

## Components

### Pill Button (Filled)
**Role:** Primary action — 'Start reading', 'Get started'

Background #191919, text #ffffff, Söhne 14px weight 400, padding 8px vertical × 16–20px horizontal, border-radius 9999px (extracted as 1386–1980px). No border, no shadow. The extreme radius is the signature — not rounded, fully pill-shaped. Centered text, tight hit area.

### Wordmark Logo
**Role:** Brand identity in the top-left

Text 'Medium' in Söhne weight 400 at ~22px, color #191919. No icon, no custom mark — the wordmark IS the logo, set in the same UI font as navigation, which is itself a brand decision (the product voice and the brand voice are the same).

### Top Navigation Bar
**Role:** Primary navigation

Full-width bar on #f7f4ed canvas, ~64px tall, no border or shadow. Left: wordmark. Right: Söhne 14px links (#242424) — 'Our story', 'Membership', 'Write', 'Sign in' — followed by a filled pill button 'Get started'. Items separated by ~24px gap. No sticky behavior specified for homepage.

### Hero Headline
**Role:** Page-level value proposition

GT Super 120px, weight 400, line-height 0.83, letter-spacing -0.055em, color #242424. Renders as a tight 2-line block: 'Human' / 'stories & ideas'. The low line-height causes slight optical overlap between descenders and ascenders, reinforcing the book-print feel.

### Hero Subtext
**Role:** Supporting description beneath hero headline

Söhne 20px weight 400, color #6b6b6b, single line. Sized to read as a quiet footnote to the display headline — roughly 1/6 the headline size, creating a dramatic type contrast.

### Hero CTA Button
**Role:** Primary call-to-action in the hero

Identical to the Pill Button (Filled) component — #191919 background, #ffffff text, Söhne 14px, 8px × 16px padding, 9999px radius. Label 'Start reading'.

### Hero Illustration Panel
**Role:** Decorative visual companion to hero text

Right-side illustration occupying roughly 40% of the hero width. Contains a green flower and geometric hand/line elements. Note: the green is NOT a brand color — it exists only in editorial illustration and should not be used in UI.

### Footer Link Bar
**Role:** Secondary navigation, legal, support

Single horizontal row of Söhne 13px links in #6b6b6b, centered on the #f7f4ed canvas. Items: 'Help', 'Status', 'About', 'Careers', 'Press', 'Blog', 'Privacy', 'Rules', 'Terms', 'Text to speech'. Separated by ~16px gap. No dividers, no border above — the cream canvas flows seamlessly from content to footer.

### Link (Inline)
**Role:** Text links within body content

Söhne 16px or body-serif 16px, color #242424 (same as body text), underline on hover only. The lack of a distinct link color is intentional — links are typographic, not chromatic.

## Do's and Don'ts

### Do
- Use #f7f4ed as the page canvas on all full-width backgrounds and section bands
- Use GT Super at 120px with letter-spacing -0.055em and line-height 0.83 for display headlines
- Use Söhne weight 400 for all UI text (navigation, buttons, subheadings)
- Use border-radius 9999px for all buttons and tags
- Use #191919 as the only filled-button background color in the system
- Use #ffffff for card and panel surfaces that need to lift off the cream canvas
- Use 0px radius for all non-button containers (cards, inputs, images, modals)

### Don't
- Do not introduce any chromatic color in UI elements — no blue links, no green buttons, no red errors in the visual system
- Do not use shadows or blur effects to separate surfaces — rely on color value shifts only
- Do not use bold or semibold weights for the GT Super display headline — weight 400 is the signature
- Do not set line-height above 1.0 for the display headline — the 0.83 overlap is intentional
- Do not apply border-radius to cards, inputs, or containers — only buttons and tags get radius
- Do not use the green from the hero illustration as a brand color — it is editorial art only
- Do not use centered alignment for body text or long-form content — left-align to the reading axis

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f7f4ed` | Page-level background, hero, section bands — the warm paper base |
| 2 | Paper | `#ffffff` | Cards, modals, inputs — surfaces that need to read as distinct objects on the cream canvas |
| 3 | Ink Surface | `#191919` | Filled buttons and the wordmark — the only dark surface, used sparingly as visual anchor |

## Elevation

Medium uses no shadows or blur effects. Surfaces are separated by color value shifts alone (cream #f7f4ed → paper #ffffff → ink #191919), not by elevation. This flat-on-flat approach is deliberate: the interface should feel like printed paper lying on a desk, not a glass-and-shadow app.

## Imagery

Illustration is editorial and occasional, not systematic. The hero uses a single hand-drawn illustration (green flower, geometric hand, constellation lines) in a loose, slightly naive style. Illustrations appear to be commissioned artwork that changes seasonally rather than a fixed library. No photography is used on the homepage. Icons are not present on the hero page — the wordmark and text do all the work. The visual language is fundamentally text-first, with illustration as punctuation.

## Layout

Two-column hero: left ~55% holds the headline, subtext, and CTA stacked vertically with generous internal spacing; right ~45% holds the illustration panel. The left column is left-aligned (not centered), anchoring the page to a reading axis. Below the hero, the page flows as a single full-width cream band with centered footer links. No card grids, no feature sections, no alternating bands on the homepage — the hero IS the page. Content density is intentionally low: one headline, one sentence, one button, one image. The page is a cover, not a dashboard.

## Agent Prompt Guide

**Quick Color Reference**
- text: #242424
- background: #f7f4ed
- surface: #ffffff
- border: #6b6b6b
- accent: #191919 (button background, the only 'accent')
- primary action: no distinct CTA color

**Example Component Prompts**
1. **Hero headline**: GT Super 120px weight 400, line-height 0.83, letter-spacing -0.055em, color #242424. Left-aligned, no max-width constraint. Sits on #f7f4ed canvas.
2. **Filled pill button**: Background #191919, text #ffffff, Söhne 14px weight 400, padding 8px 20px, border-radius 9999px, no border, no shadow.
3. **Navigation link**: Söhne 14px weight 400, color #242424, no underline by default, underline on hover. Spacing 24px between items.
4. **Footer link bar**: Söhne 13px weight 400, color #6b6b6b, items separated by 16px gap, centered horizontally on #f7f4ed canvas, no top border.
5. **Card surface**: Background #ffffff (NOT cream), no border, no shadow, no radius, padding 16px. The color shift from cream to white is the only visual separator.

## Color Philosophy

The entire UI is warm-grayscale. There is no blue, no green, no red in the interface — the green in the hero illustration is editorial art, not a design token. The palette moves from #f7f4ed (warm cream) through #6b6b6b (cool gray text) to #191919 (near-black ink). The warmth comes from the canvas, not the text. Never introduce a chromatic accent in UI; the single dark surface (#191919) is the only 'color' moment.

## Typography Philosophy

Medium uses two voices: GT Super (a transitional book serif) for display, and Söhne (a humanist grotesque) for everything else. The display serif is weight 400, not bold — authority through letterform quality, not weight. The line-height of 0.83 is unusually tight for display type, creating overlap that reads as a printed headline block. Body text uses Charter/Georgia, a transitional serif optimized for screen reading. The system deliberately avoids geometric sans-serifs (no Helvetica, no Inter-as-display) to distance itself from generic SaaS aesthetics.

## Radius Philosophy

Buttons are fully pill-shaped (9999px), but everything else has zero radius. Cards, inputs, images, and containers are sharp-cornered. This high contrast — soft buttons on hard containers — makes the pill buttons feel like physical pills pressed onto the page, not rounded rectangles.

## Similar Brands

- **Substack** — Same warm cream canvas and book-serif display treatment for a reading-first publishing platform
- **The New Yorker** — Same editorial restraint — warm off-white backgrounds, serif display type, no chromatic UI accents, illustration as the only color
- **Are.na** — Same near-monochrome palette and anti-SaaS visual language with warm grays replacing pure black-and-white
- **Read.cv** — Same reading-room aesthetic with serif display type and a muted, warm-neutral palette
- **Pocket** — Same content-first minimalism with sharp-cornered cards on a warm off-white background and full-pill buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-newsprint-cream: #f7f4ed;
  --color-paper-white: #ffffff;
  --color-ink: #242424;
  --color-body-gray: #333333;
  --color-button-black: #191919;
  --color-marginalia-gray: #6b6b6b;

  /* Typography — Font Families */
  --font-medium-content-sans-serif-font: 'medium-content-sans-serif-font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-super: 'GT Super', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-charter-georgia-stack: 'Charter / Georgia stack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne-extended: 'Söhne (extended)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne: 'sohne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.27;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.54;
  --text-display: 120px;
  --leading-display: 0.83;
  --tracking-display: -6.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-full: 1386px;
  --radius-full-2: 1980px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #f7f4ed;
  --surface-paper: #ffffff;
  --surface-ink-surface: #191919;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-newsprint-cream: #f7f4ed;
  --color-paper-white: #ffffff;
  --color-ink: #242424;
  --color-body-gray: #333333;
  --color-button-black: #191919;
  --color-marginalia-gray: #6b6b6b;

  /* Typography */
  --font-medium-content-sans-serif-font: 'medium-content-sans-serif-font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-super: 'GT Super', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne: 'Söhne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-charter-georgia-stack: 'Charter / Georgia stack', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shne-extended: 'Söhne (extended)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne: 'sohne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.27;
  --text-body: 16px;
  --leading-body: 1.2;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.54;
  --text-display: 120px;
  --leading-display: 0.83;
  --tracking-display: -6.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-full: 1386px;
  --radius-full-2: 1980px;
}
```
