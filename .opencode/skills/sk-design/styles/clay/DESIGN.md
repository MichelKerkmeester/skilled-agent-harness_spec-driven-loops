# Clay — Style Reference
> Bright playroom of clay shapes on white paper. A monochrome workspace punctuated by vivid, hand-rolled chromatic objects that feel weighty and tactile.

**Theme:** light

Clay uses a bright, tactile workspace language: white canvas with weighty black type, pill-shaped controls, and a vivid violet accent (#3859f9) that powers links, key callouts, and inline emphasis. Most surfaces stay monochrome — warm cream (#f9f8f6) cards on pure white with soft beige borders (#dad4c8) — while chromatic moments arrive as full-bleed colored testimonial cards in lime, orange, cyan, and magenta, like individual clay sculptures placed on a clean table. Components feel hand-shaped rather than pixel-perfect: generous border radii (12–40px), near-zero elevation, and tight negative tracking on large display sizes. The overall feel is energetic and confident without being decorative — color is reserved for social proof and brand moments, not for functional UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills, inverted text on color |
| Warm Cream | `#f9f8f6` | `--color-warm-cream` | Soft surface variant for feature cards, footer background, and off-white panels — gives the white space a paper-like warmth |
| Sand Border | `#dad4c8` | `--color-sand-border` | Primary hairline border and divider — warm beige rather than cool gray, keeps the system from feeling sterile |
| Cool Mist | `#e6e8ec` | `--color-cool-mist` | Secondary cool-tone border for inputs, structural dividers, and subtle UI frames |
| Stone Gray | `#55534e` | `--color-stone-gray` | Body text, muted paragraphs, and secondary link color — warm dark gray for readable supporting copy |
| Ash Gray | `#9f9b93` | `--color-ash-gray` | Tertiary text, icon strokes, and low-emphasis labels |
| Slate Gray | `#222222` | `--color-slate-gray` | Near-black for nav text, button labels, and high-contrast UI text |
| Violet Pulse | `#3859f9` | `--color-violet-pulse` | Brand accent for inline links, highlighted keywords, and key emphasis text — the only saturated color that runs through body and heading copy |
| Lavender Banner | `#b8a5e8` | `--color-lavender-banner` | Top announcement bar background — soft violet band reserved for event/promo strips |
| Teal Mark | `#0ec5b0` | `--color-teal-mark` | Logo 'c' glyph and small brand insignia accents |
| Lime Slide | `#cbd810` | `--color-lime-slide` | Vivid card background for testimonial panels and social proof blocks |
| Ember Orange | `#ff7614` | `--color-ember-orange` | Vivid card background for testimonial and social proof blocks |
| Signal Blue | `#429dff` | `--color-signal-blue` | Vivid card background for testimonial blocks and feature callouts |
| Aqua Splash | `#3bd3fd` | `--color-aqua-splash` | Vivid card background for testimonial blocks and product feature surfaces |
| Cobalt | `#0667d9` | `--color-cobalt` | Deep vivid blue card background — used in social proof carousel for darker contrast moments |
| Forest | `#02693e` | `--color-forest` | Saturated card background for testimonial blocks — rare but present in the color carousel |
| Magenta | `#8b045c` | `--color-magenta` | Saturated card background for testimonial blocks and feature highlights |
| Blush | `#f8b9e3` | `--color-blush` | Soft pink card background — the only pastel in the accent set, used sparingly for tonal variety |

## Tokens — Typography

### Roobert — Primary typeface for all UI text, headlines, buttons, and body copy. The heavy 700 weight at 60–80px is the signature — display headlines are massive, dense, and confident. Stylistic sets (ss01, ss03, ss10, ss11, ss12) are enabled to activate the custom alternate glyphs that give Roobert its distinctive geometric character. · `--font-roobert`
- **Substitute:** Inter, General Sans, or Söhne
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 11px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 32px, 44px, 60px, 80px
- **Line height:** 1.00–1.60
- **Letter spacing:** -3.2px at 80px, -1.8px at 60px, -0.88px at 44px, -0.32px at 32px, -0.16px at 20px, 0 at 16px, +0.09em on uppercase labels at 13–14px
- **OpenType features:** `"ss01" on, "ss03" on, "ss10" on, "ss11" on, "ss12" on`
- **Role:** Primary typeface for all UI text, headlines, buttons, and body copy. The heavy 700 weight at 60–80px is the signature — display headlines are massive, dense, and confident. Stylistic sets (ss01, ss03, ss10, ss11, ss12) are enabled to activate the custom alternate glyphs that give Roobert its distinctive geometric character.

### Phosphor — Icon system — line-based icons used in nav, feature bullets, and UI affordances. Kept thin and consistent at body and small sizes. · `--font-phosphor`
- **Substitute:** Phosphor Icons (open-source), Feather, or Lucide
- **Weights:** 400
- **Sizes:** 13px, 16px, 20px
- **Line height:** 1.00
- **OpenType features:** `"liga" on`
- **Role:** Icon system — line-based icons used in nav, feature bullets, and UI affordances. Kept thin and consistent at body and small sizes.

### Phosphor-Bold — Phosphor-Bold — detected in extracted data but not described by AI · `--font-phosphor-bold`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1
- **OpenType features:** `"liga"`
- **Role:** Phosphor-Bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.09px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.6 | — | `--text-body` |
| subheading | 20px | 1.4 | -0.16px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.32px | `--text-heading-sm` |
| heading | 44px | 1.1 | -0.88px | `--text-heading` |
| heading-lg | 60px | 1.1 | -1.8px | `--text-heading-lg` |
| display | 80px | 1 | -3.2px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 76 | 76px | `--spacing-76` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 24px |
| inputs | 8px |
| buttons | 1584px |
| smallChips | 2.75px |
| testimonialCards | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main conversion action (e.g. 'Start building for free')

Pill shape at 1584px radius, 8px vertical / 16px horizontal padding, black (#000) fill, white text at 15–16px Roobert 500. Includes a thin 1px top shadow + inset bottom highlight for a barely-there pressed feel. Trailing arrow icon in white.

### Secondary Ghost Button
**Role:** Lower-emphasis action (e.g. 'Log in', 'More choices')

Outlined pill at 1584px radius, 1px border in Cool Mist (#e6e8ec) or Sand (#dad4c8), transparent fill, black or dark text at 14–15px Roobert 500. Used for cookie controls and secondary nav actions.

### Navigation Link
**Role:** Primary nav items (Product, Use cases, Solutions, etc.)

Plain text at 14–15px Roobert 500, color #000, no underline by default. On hover, subtle underline appears. Wrapped in the top nav bar with a max-width container.

### Sign Up Button (Nav)
**Role:** Account creation from the top nav

Compact black pill at 12px radius, 6px vertical / 13px horizontal padding, black fill, white text at 14px Roobert 500, small caret for dropdown.

### Announcement Banner
**Role:** Top-of-page event/promo strip

Full-width lavender (#b8a5e8) band, ~36px tall. Left side: bold black Roobert event name (e.g. 'SCULPT') in uppercase, followed by event details in black. Right side: date/location in black + small arrow link. Sits above the main nav.

### Testimonial Color Card
**Role:** Customer quote card in the social-proof carousel

Vivid solid-fill card (lime, orange, blue, cyan, magenta, forest, or cobalt — one color per card) at 40px radius, 32–48px padding. Company logo + name in black at top, quote text in black at 15–16px Roobert 400, avatar + name + title in a white pill at the bottom-left corner of the card. Cards sit edge-to-edge in a horizontal scroll with no visible border or shadow.

### Feature Callout Card
**Role:** Inline product stat or AI provider card

White card with 12px radius and 1px Sand (#dad4c8) border, 16–24px padding. Large metric on the left ('>2x' in black at 32–44px), provider name and description on the right in 14–15px Roobert. Subtle, information-dense.

### Hero Section
**Role:** Top-of-page headline block

Centered stack on Paper White. Headline at 60–80px Roobert 700 in #000 with -1.8 to -3.2px tracking, max-width ~900px. Subheadline at 18–20px Roobert 400 in Stone Gray (#55534e), max-width ~560px. Single black pill CTA centered below. Decorative product photography (clay-sculpture imagery) bleeds off the bottom edge.

### Logo Strip
**Role:** Trust/social proof row of customer logos

Horizontal row of monochrome or original-color company logos on Paper White, evenly spaced with 32–48px gaps. No card background or border — logos sit directly on the canvas with a centered eyebrow label above ('TRUSTED BY MORE THAN 300,000 LEADING GTM TEAMS...') in 11–12px Roobert uppercase with +0.09em tracking.

### Cookie Consent Banner
**Role:** Bottom-of-page GDPR notice

Fixed-position white card with 12–16px radius, 1px Cool Mist border, subtle bottom shadow. Left column: bold 'We use cookies' title + 12–14px body copy. Right column: two pill buttons — primary (black 'Accept all') and ghost ('More choices'). Includes a small cookie icon and privacy policy link below.

### Footer
**Role:** Site-wide footer

Warm Cream (#f9f8f6) background, 40px top-radius on the inner container. Black text for links, muted gray for secondary labels. Multi-column link grid with bold section headers at 14–15px Roobert 600.

### Tab Pill
**Role:** Secondary navigation or section switcher

Small 1584px-radius pill, 2px border in Cool Mist (#e6e8ec), 4–6px padding, 13–14px Roobert 500 text. Active state fills with black background and white text.

## Do's and Don'ts

### Do
- Use Roobert at 700 weight for all display headlines 44px and above — the heavy weight at large sizes is the signature
- Apply letter-spacing of -0.02em or tighter on any text 32px and above; use +0.09em on uppercase labels at 13px and below
- Set primary CTAs to a black pill at 1584px radius with 8px/16px padding and white text
- Reserve the vivid chromatic colors (Lime, Ember, Signal, Aqua, Cobalt, Forest, Magenta) exclusively for testimonial and social-proof card backgrounds — never use them for buttons, links, or functional UI
- Separate surfaces with 1px Sand (#dad4c8) borders rather than shadows — the system is flat by design
- Use the Violet Pulse (#3859f9) for all inline links and emphasized keywords within body copy
- Keep card radii in the 12–40px range; use 12px for compact info cards, 24px for feature panels, 40px for full-bleed testimonial cards

### Don't
- Don't apply drop shadows to cards or panels — separation comes from borders, not elevation
- Don't use saturated colors (lime, orange, cyan, etc.) for buttons, form inputs, or status indicators
- Don't set body text above 16px without tightening letter-spacing — large sizes need negative tracking to feel composed
- Don't use the cool gray border (#e6e8ec) for decorative or large-surface dividers — reserve it for inputs and small UI elements; use warm Sand (#dad4c8) elsewhere
- Don't break the pill shape on primary CTAs — 1584px radius is non-negotiable for the main action button
- Don't use Roobert below 400 weight — the typeface is designed to carry weight, and light weights are not part of the system
- Don't place more than one vivid chromatic card adjacent to another — space them with white or cream panels to let the color breathe

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas and default card background |
| 1 | Cream | `#f9f8f6` | Off-white surface for feature panels and footer |
| 2 | Vivid Card | `#cbd810` | Full-color testimonial card surfaces |

## Elevation

- **Primary CTA button:** `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px -1px 1px 0px inset, rgba(0, 0, 0, 0.05) 0px -0.5px 1px 0px`

## Imagery

Photography is product-focused and tactile: close-up shots of clay/play-doh sculptures in vivid colors (pink, orange, cyan, yellow) staged on white or neutral surfaces with hand tools (pencils, small wooden boards) visible. Images are full-bleed, with subjects bleeding off the bottom edge of the hero. The visual treatment evokes a craft or maker studio — no people, no lifestyle context, no abstract gradients. Decorative illustrations are absent; the only graphic elements are the clay-sculpture product photos and the flat monochromatic logo marks in the trust strip.

## Layout

The page uses a max-width 1200px centered container on a pure white canvas, with full-bleed colored bands for testimonial carousels and the announcement bar. The hero is a centered text stack (max-width ~900px headline) over a white field with product imagery bleeding from the bottom. Below the hero, sections alternate between two-column text+image layouts (40/60 or 50/50 splits) and full-width color carousels. A horizontally scrolling logo strip and a horizontally scrolling testimonial card row break the vertical rhythm. Vertical section gaps are generous (64–96px). Navigation is a clean top bar with left-aligned logo, centered links, and right-aligned action buttons; it sits below a 36px lavender announcement strip. The overall density is comfortable — large headline, ample whitespace, and only one or two CTAs per screen.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000 (primary), #55534e (body), #9f9b93 (tertiary)
- Background: #ffffff (canvas), #f9f8f6 (cream surface)
- Border: #dad4c8 (warm), #e6e8ec (cool)
- Accent: #3859f9 (violet pulse — links and emphasis only)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Testimonial Card** — Solid fill in Lime (#cbd810) or Ember Orange (#ff7614) or Signal Blue (#429dff). 40px border-radius, 40px padding. Company logo + name in 16px Roobert 600 black at top. Quote text in 16px Roobert 400 black, line-height 1.5. White avatar pill (12px radius) at bottom-left with name (14px Roobert 600 black) and title (13px Roobert 400 #55534e). No border, no shadow.

3. **Secondary Ghost Button** — Transparent fill, 1px border in #e6e8ec, 1584px radius, 8px/16px padding. Text in 14px Roobert 500, #000000. No shadow. Use for 'Log in' and cookie controls.

4. **Feature Callout Card** — White (#ffffff) background, 1px border in #dad4c8, 12px radius, 24px padding. Large metric ('>2x') in 44px Roobert 700 black on the left. Provider name in 16px Roobert 600 black, description in 14px Roobert 400 #55534e on the right. Small external-link icon in top-right corner.

5. **Announcement Banner** — Full-width lavender (#b8a5e8) band, 36px height, flex row with space-between. Left: event name in 13px Roobert 700 uppercase #000000 with +0.09em tracking, followed by event tagline in 13px Roobert 500 #000000. Right: date/location in 13px Roobert 500 #000000 + small arrow icon in black. Sits flush above the main nav.

## Similar Brands

- **Linear** — Same max-width centered container, heavy display type, pill-shaped CTAs, and monochrome surfaces with a single saturated accent for links and key UI
- **Notion** — Same warm, paper-like background tones and minimal elevation, with bold display headlines and flat content blocks
- **Framer** — Same playful approach to bold type on white, with vivid chromatic moments breaking up otherwise monochrome sections
- **Pitch** — Same heavy-weight display typography, tight letter-spacing on large sizes, and pill-shaped primary actions on a clean white canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-warm-cream: #f9f8f6;
  --color-sand-border: #dad4c8;
  --color-cool-mist: #e6e8ec;
  --color-stone-gray: #55534e;
  --color-ash-gray: #9f9b93;
  --color-slate-gray: #222222;
  --color-violet-pulse: #3859f9;
  --color-lavender-banner: #b8a5e8;
  --color-teal-mark: #0ec5b0;
  --color-lime-slide: #cbd810;
  --color-ember-orange: #ff7614;
  --color-signal-blue: #429dff;
  --color-aqua-splash: #3bd3fd;
  --color-cobalt: #0667d9;
  --color-forest: #02693e;
  --color-magenta: #8b045c;
  --color-blush: #f8b9e3;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor: 'Phosphor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor-bold: 'Phosphor-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.09px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.32px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -0.88px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.8px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.2px;

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
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2.75px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 1584px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 24px;
  --radius-inputs: 8px;
  --radius-buttons: 1584px;
  --radius-smallchips: 2.75px;
  --radius-testimonialcards: 40px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px -1px 1px 0px inset, rgba(0, 0, 0, 0.05) 0px -0.5px 1px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-cream: #f9f8f6;
  --surface-vivid-card: #cbd810;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-warm-cream: #f9f8f6;
  --color-sand-border: #dad4c8;
  --color-cool-mist: #e6e8ec;
  --color-stone-gray: #55534e;
  --color-ash-gray: #9f9b93;
  --color-slate-gray: #222222;
  --color-violet-pulse: #3859f9;
  --color-lavender-banner: #b8a5e8;
  --color-teal-mark: #0ec5b0;
  --color-lime-slide: #cbd810;
  --color-ember-orange: #ff7614;
  --color-signal-blue: #429dff;
  --color-aqua-splash: #3bd3fd;
  --color-cobalt: #0667d9;
  --color-forest: #02693e;
  --color-magenta: #8b045c;
  --color-blush: #f8b9e3;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor: 'Phosphor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor-bold: 'Phosphor-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.09px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.32px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -0.88px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.8px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.2px;

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
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 2.75px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 1584px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px -1px 1px 0px inset, rgba(0, 0, 0, 0.05) 0px -0.5px 1px 0px;
}
```
