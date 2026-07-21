# Leonid Kostetskyi — Style Reference
> Wine-stained editorial gallery — oversized typographic statements floating on a white gallery wall, every mark a deliberate negative space.

**Theme:** light

Leonid Kostetskyi's site is a single-canvas editorial spread: a near-white gallery wall dominated by oversized Neue Haas Display headlines set in a muted dark-wine accent. The system runs on extreme contrast — one chromatic color (#472425, a desaturated oxblood) does all the brand work against pure white, with black and near-black handling secondary text and hairlines. Typography is the product: display faces reach 188px with negative tracking, sitting beside 8–15px uppercase utility labels. Spacing is expansive and editorial, with massive vertical breathing room between elements and no decorative ornamentation beyond one small radial starburst mark. The feel is Swiss-poster meets personal portfolio — confident, restrained, slightly austere, and unmistakably authored.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Oxblood | `#472425` | `--color-oxblood` | The singular chromatic identity — display headlines, nav links, body text, borders, and the active theme toggle. This muted dark-wine red carries all brand presence; the system is monochrome with this one warm, desaturated red as the only color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas and card surfaces. The background that the typography sits on; it reads as gallery white, not pure technical white |
| Carbon Black | `#000000` | `--color-carbon-black` | Secondary text, decorative borders, and structural hairlines. Used as the neutral companion to Oxblood when chromatic emphasis isn't needed |
| Graphite | `#121212` | `--color-graphite` | Tertiary text and body borders. A softer near-black for inline content where pure black feels too harsh |
| Ash | `#999999` | `--color-ash` | Muted helper text, the inactive theme toggle label, and low-emphasis annotations |
| Crimson | `#e73737` | `--color-crimson` | Red outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Neue Haas Display — The display face used for the nameplate and role titles. Sits at 135–188px with tight negative tracking (-0.025em to -0.020em) — the oversized scale is the signature; there is no intermediate heading tier, just utility text and then this monumental display. · `--font-neue-haas-display`
- **Substitute:** Inter, Helvetica Neue, or Suisse Int'l at matching weight
- **Weights:** 400
- **Sizes:** 11px, 12px, 15px, 27px, 135px, 143px, 165px, 188px
- **Line height:** 0.86–1.00
- **Letter spacing:** -0.0250em at 188px, -0.0200em at 135px
- **Role:** The display face used for the nameplate and role titles. Sits at 135–188px with tight negative tracking (-0.025em to -0.020em) — the oversized scale is the signature; there is no intermediate heading tier, just utility text and then this monumental display.

### SFUIDisplay — Body and utility type. Weight 300 whispers at body sizes for a quiet, label-like reading voice; weight 400 carries the uppercase tracked annotations (8–12px) that label sections and form microcopy. The narrow range (8–21px) confirms this is a system with two voices: monumental display or quiet label. · `--font-sfuidisplay`
- **Substitute:** Inter, SF Pro Text, or system-ui
- **Weights:** 300, 400
- **Sizes:** 8px, 9px, 11px, 12px, 15px, 18px, 19px, 20px, 21px
- **Line height:** 1.00–1.60
- **Role:** Body and utility type. Weight 300 whispers at body sizes for a quiet, label-like reading voice; weight 400 carries the uppercase tracked annotations (8–12px) that label sections and form microcopy. The narrow range (8–21px) confirms this is a system with two voices: monumental display or quiet label.

### Arial — Rare fallback for button labels where the custom faces aren't available — not a designed choice, a system safety net. · `--font-arial`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Rare fallback for button labels where the custom faces aren't available — not a designed choice, a system safety net.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.6 | — | `--text-caption` |
| body | 19px | 1.4 | — | `--text-body` |
| subheading | 21px | 1.1 | — | `--text-subheading` |
| heading | 27px | 1 | — | `--text-heading` |
| heading-lg | 135px | 0.86 | -2.7px | `--text-heading-lg` |
| display | 165px | 0.86 | — | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 56 | 56px | `--spacing-56` |
| 72 | 72px | `--spacing-72` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 200px
- **Card padding:** 12px
- **Element gap:** 16px

## Components

### Nameplate Headline
**Role:** Primary identity statement — the personal name at hero scale

Neue Haas Display weight 400 at 165–188px, color Oxblood (#472425), letter-spacing -0.025em, line-height 0.86. Sits flush-left at the canvas edge. No other element competes at this scale.

### Role Display Title
**Role:** Professional title, secondary hero element

Neue Haas Display weight 400 at 135–143px, color Oxblood, letter-spacing -0.020em, line-height 0.86. Mirrors the nameplate in scale and treatment, creating a typographic diptych.

### Editorial Caption Block
**Role:** Small uppercase body annotation — manifesto or description copy

SFUIDisplay weight 300 at 11–12px, uppercase, color Oxblood, line-height 1.6. Tracks tightly, sits in narrow left-aligned columns beneath or beside the display type. The quiet voice that contrasts the monumental headlines.

### Top-Right Navigation
**Role:** Primary site navigation

Vertical stack of text links: Home, About, Projects, Awards, Contacts. SFUIDisplay weight 400 at 11–12px, color Oxblood, no bullets, no borders. Right-aligned, floats in the upper-right corner with the theme toggle below.

### Theme Toggle
**Role:** Light/dark mode switcher

Two stacked labels — DARK THEME (active option in Oxblood or Carbon) and LIGHT THEME (inactive in Ash #999999). SFUIDisplay weight 400 at 8–9px, uppercase. No checkbox, no switch UI — pure typographic toggle.

### Starburst Mark
**Role:** Decorative personal signature

Small radial line illustration (sun/starburst pattern) in Oxblood, approximately 40px diameter, placed in the lower-left near the editorial caption. The only illustration in the system — a visual autograph.

### Project Card
**Role:** Portfolio work tile

White surface with 1px border in Oxblood or Carbon Black, 12px internal padding, 0px radius. Image or content fills the frame; the border is the only container treatment. No shadow, no rounded corners.

### Hairline Divider
**Role:** Structural separation between content blocks

1px line in Oxblood (#472425) or Carbon (#000000), full-width or section-width. The primary mechanism for breaking up the white canvas.

### Inline Link
**Role:** Navigable text link within body copy

SFUIDisplay weight 400 at body size, color Oxblood, underline offset 2px or none. No button chrome — links live as chromatic words in a monochrome stream.

## Do's and Don'ts

### Do
- Use Oxblood (#472425) for all display headlines, nav links, and body text — it is the sole chromatic voice
- Set display type at 135–188px in Neue Haas Display weight 400 with -0.025em letter-spacing and 0.86 line-height
- Use SFUIDisplay weight 300 at 11–15px for body and caption copy; reserve weight 400 for navigation and active labels
- Maintain 200px minimum vertical gap between major sections to preserve the editorial gallery rhythm
- Separate content blocks with 1px Oxblood or Carbon hairlines — never with shadows, fills, or rounded containers
- Keep all corners square (0px radius) across cards, buttons, and inputs — the system has no soft edges
- Place the starburst mark once per page in the lower-left zone as a signature element

### Don't
- Never introduce a second chromatic color — Oxblood is the only hue, with Crimson reserved exclusively for hover/error states
- Don't use intermediate heading sizes between 27px and 135px — the system jumps from body text to monumental display with nothing in between
- Don't apply box-shadows, glows, or drop effects to any element — hierarchy comes from scale and space, not depth
- Don't round corners on cards, buttons, or images — 0px radius everywhere maintains the editorial sharpness
- Don't use color blocks or filled backgrounds behind text — content sits directly on white with hairline borders at most
- Don't center body copy or long-form text — the layout is flush-left and asymmetric, magazine-spread style
- Don't add decorative gradients, blurs, or atmospheric effects — the visual language is flat, printed, and graphic

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Full-bleed page background — the gallery wall |
| 2 | Card | `#ffffff` | Project cards and content blocks sit flush on the same white, separated only by 1px borders in Oxblood or Carbon |

## Elevation

No shadows. Elevation is expressed through generous negative space and 1px hairline borders in Oxblood or Carbon Black. Cards and content blocks sit flush on the white canvas — the system trusts typography and whitespace to create hierarchy rather than depth.

## Imagery

The system is overwhelmingly text-dominant. Imagery is not present in the hero or structural regions — the nameplate and role title ARE the hero. Where project work appears, it will be contained within square-cornered frames bordered by 1px Oxblood hairlines, sitting flush on white. The only decorative graphic is a small radial starburst line illustration in Oxblood, used once as a signature mark. Photography or project visuals, if introduced, should be treated as gallery prints: full-bleed within the card frame, no rounded corners, no overlays, no captions integrated into the image itself.

## Layout

Full-bleed editorial spread with no max-width container. The hero is a single screen composed of four zones: nameplate flush-left at 188px occupying the upper-left quadrant; vertical nav stack in the upper-right; a small uppercase manifesto caption in the lower-left; and a 135px role title ('CREATIVE DIRECTOR') flush-left in the lower-right. The composition is deliberately asymmetric — weight is distributed diagonally from upper-left (name) to lower-right (role). Section rhythm is built on 200px vertical gaps with 1px Oxblood hairlines marking transitions. Content blocks stack as full-width bands rather than columns; project work would be a single-column vertical flow. Navigation is minimal text links in the top-right corner, with a typographic theme toggle below. No sticky header, no sidebar, no card grids visible in the hero — the first screen is a typographic poster.

## Agent Prompt Guide

**Quick Color Reference**
- text: #472425 (Oxblood — all headings, body, links)
- background: #ffffff (Paper White — full canvas)
- border: #472425 or #000000 (1px hairlines only)
- accent: #472425 (Oxblood — the singular brand color)
- muted: #999999 (Ash — inactive toggles, helper text)
- primary action: #472425 (outlined action border)

**Example Component Prompts**
1. *Create a nameplate headline:* Neue Haas Display weight 400, 188px, color #472425, letter-spacing -4.7px, line-height 0.86. Flush-left, no margin. The text fills the upper-left zone of a full-bleed white canvas.

2. *Create a role display title:* Neue Haas Display weight 400, 135px, color #472425, letter-spacing -2.7px, line-height 0.86. Sits in the lower-right quadrant, flush-left, balancing the nameplate diagonally.

3. *Create an editorial caption block:* SFUIDisplay weight 300, 11px, uppercase, color #472425, line-height 1.6, max-width 180px. Narrow column, flush-left, positioned in the lower-left zone.

4. *Create a vertical navigation stack:* SFUIDisplay weight 400, 11px, color #472425, text-decoration underline, line-height 1.6. Items: Home, About, Projects, Awards, Contacts. Right-aligned, top-right corner of the canvas.

5. *Create a project card frame:* White surface (#ffffff), 1px border in #472425, 12px padding, 0px border-radius. No shadow. Image or content sits flush within the frame against the same white canvas.

## Similar Brands

- **Tobias van Schneider** — Same oversized editorial typography as the sole hero element, single-color brand identity, and aggressive negative space
- **Pentagram partner sites** — Swiss-poster typographic approach with monumental name-as-headline and minimal color palette
- **Locomotive (agency portfolio)** — Editorial full-bleed spreads with display-scale typography and no card grids or conventional UI chrome
- **Arnold St. (creative director portfolio)** — Asymmetric single-screen compositions where the name and role title function as the entire page design

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-oxblood: #472425;
  --color-paper-white: #ffffff;
  --color-carbon-black: #000000;
  --color-graphite: #121212;
  --color-ash: #999999;
  --color-crimson: #e73737;

  /* Typography — Font Families */
  --font-neue-haas-display: 'Neue Haas Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sfuidisplay: 'SFUIDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.6;
  --text-body: 19px;
  --leading-body: 1.4;
  --text-subheading: 21px;
  --leading-subheading: 1.1;
  --text-heading: 27px;
  --leading-heading: 1;
  --text-heading-lg: 135px;
  --leading-heading-lg: 0.86;
  --tracking-heading-lg: -2.7px;
  --text-display: 165px;
  --leading-display: 0.86;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-200: 200px;

  /* Layout */
  --section-gap: 200px;
  --card-padding: 12px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-oxblood: #472425;
  --color-paper-white: #ffffff;
  --color-carbon-black: #000000;
  --color-graphite: #121212;
  --color-ash: #999999;
  --color-crimson: #e73737;

  /* Typography */
  --font-neue-haas-display: 'Neue Haas Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sfuidisplay: 'SFUIDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.6;
  --text-body: 19px;
  --leading-body: 1.4;
  --text-subheading: 21px;
  --leading-subheading: 1.1;
  --text-heading: 27px;
  --leading-heading: 1;
  --text-heading-lg: 135px;
  --leading-heading-lg: 0.86;
  --tracking-heading-lg: -2.7px;
  --text-display: 165px;
  --leading-display: 0.86;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-200: 200px;
}
```
