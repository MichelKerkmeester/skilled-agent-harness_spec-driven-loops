# Electronic Materials Office® — Style Reference
> Incandescent ember in a charcoal gallery

**Theme:** dark

Electronic Materials Office is a nocturnal atelier: matte charcoal canvas, a single incandescent orange ember, and type that whispers rather than declares. The interface treats every screen like a darkened studio — the keyboard product photographs are the only true light source, and the UI surrenders to them. Headlines at weight 200 in GT-Flexa float in vast negative space; body text is deliberately small and humanist (Times). Color is rationed: pure white for type, a desaturated violet (#9e9eff) for links, and one orange (#f45500) CTA per page that glows with its own 30px bloom. Components stay flush to the 20px radius, borders whisper at #9d9d9d, and the only shadows in the system are those two colored halos around the primary action.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Studio Charcoal | `#202020` | `--color-studio-charcoal` | Page canvas and card surfaces — the floor of the dark gallery, never pure black so the eye can rest on edge softness |
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, hairline borders on images, and the rare inverted surface. Carries all type hierarchy on its own |
| Ash Gray | `#9d9d9d` | `--color-ash-gray` | Muted text, subtle card borders, inactive labels — the only middle gray in the scale, used when white is too loud |
| Mid Felt | `#eaeaea` | `--color-mid-felt` | Light surface wash for inverted panels or modal scrims — the off-white that sits between bone and the dark canvas |
| Carbon | `#000000` | `--color-carbon` | Deepest accent for icon strokes and contrast borders where the charcoal canvas is too light to hold an edge |
| Ember Orange | `#f45500` | `--color-ember-orange` | Filled primary action button — the only chromatic surface in the UI, always paired with a 30px orange halo so it glows like a filament; 30px outer glow on the primary CTA — duplicates the Ember Orange hex but exists as a box-shadow, not a fill, so the button appears lit from within |
| Lavender Link | `#9e9eff` | `--color-lavender-link` | Inline link color and the outlined secondary action border — a desaturated cool counterpoint to the warm orange ember, keeping actions readable against charcoal |

## Tokens — Typography

### GT-Flexa — Display and heading workhorse. Weight 200 carries every headline above 24px — the 200 weight is the signature: at 68px and 86px the letterforms dissolve into atmosphere rather than shout. Weight 400 steps in for sub-headings and card captions where a whisper isn't enough. Line-heights collapse toward 1.0 at the largest sizes so display type stacks like a column of breath. · `--font-gt-flexa`
- **Substitute:** Inter (200/400) or Manrope (200/400)
- **Weights:** 200, 400
- **Sizes:** 16px, 24px, 26px, 28px, 42px, 68px, 86px
- **Line height:** 1.00–1.33
- **Role:** Display and heading workhorse. Weight 200 carries every headline above 24px — the 200 weight is the signature: at 68px and 86px the letterforms dissolve into atmosphere rather than shout. Weight 400 steps in for sub-headings and card captions where a whisper isn't enough. Line-heights collapse toward 1.0 at the largest sizes so display type stacks like a column of breath.

### Tobias-light — Secondary display voice for section headers and the footer wordmark. Used at a step below GT-Flexa 200 to create tonal contrast — Tobias feels more architectural, more labeled, while GT-Flexa feels ambient. Negative letter-spacing tightens the wide proportions of the Tobias Light cut. · `--font-tobias-light`
- **Substitute:** Söhne Buch or Inter Tight
- **Weights:** 400
- **Sizes:** 32px, 42px
- **Line height:** 1.20
- **Letter spacing:** -0.048em at 32px, -0.062em at 42px
- **Role:** Secondary display voice for section headers and the footer wordmark. Used at a step below GT-Flexa 200 to create tonal contrast — Tobias feels more architectural, more labeled, while GT-Flexa feels ambient. Negative letter-spacing tightens the wide proportions of the Tobias Light cut.

### Times — Body text and hero paragraph copy — a deliberate serif counterpoint to the geometric display fonts. The serif adds warmth and editorial gravity to product descriptions without ever growing larger than body size. · `--font-times`
- **Substitute:** Source Serif 4 or PT Serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Body text and hero paragraph copy — a deliberate serif counterpoint to the geometric display fonts. The serif adds warmth and editorial gravity to product descriptions without ever growing larger than body size.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.2 | — | `--text-body-sm` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| subheading-lg | 26px | 1.2 | — | `--text-subheading-lg` |
| subheading-xl | 28px | 1.2 | — | `--text-subheading-xl` |
| heading-sm | 32px | 1.2 | -1.536px | `--text-heading-sm` |
| heading | 42px | 1.2 | -2.604px | `--text-heading` |
| heading-lg | 68px | 1.06 | — | `--text-heading-lg` |
| display | 86px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| images | 20px |
| buttons | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(245, 86, 0, 0.6) 0px 0px 30px 0px` | `--shadow-xl` |
| xl-2 | `rgba(255, 255, 255, 0.3) 0px 0px 30px 0px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-128px
- **Card padding:** 24px
- **Element gap:** 4-8px

## Components

### Primary CTA — Ember Button
**Role:** The single filled action on any screen (Pre-order, Buy).

Background #f45500, white text at 16px GT-Flexa 400, 20px radius, horizontal padding 16px, vertical padding 1px (sits visually low and wide). Always wrapped in the 30px rgba(245,86,0,0.6) outer glow. The thin vertical padding is intentional — the button reads as a glowing bar, not a pill.

### Secondary CTA — White Ghost Button
**Role:** Companion to the Ember button when two actions sit side by side.

Transparent background, 1px #ffffff border at 20px radius, white text. Mirrors the primary CTA's dimensions but carries a softer 30px rgba(255,255,255,0.3) glow — like the orange button's monochrome echo.

### Lavender Outlined Action
**Role:** Tertiary or nav-level action (e.g. About, Updates in the header).

1px #9e9eff border, 20px radius, lavender text. Functions as a quiet link-button — never used for purchase. The violet border separates navigation actions from the orange commerce action.

### Inline Lavender Link
**Role:** Anchor text inside paragraphs or feature captions.

Color #9e9eff, no underline by default, GT-Flexa 400 16px. The only inline accent in the type system — it carries affordance without weight.

### Video / Media Card
**Role:** Hero film or product video frame.

Charcoal (#202020) background matching the canvas, 20px radius, 1px #9d9d9d or #ffffff border, contains a centered product render with a floating 20px-radius Play pill button in the lower third. No shadow — the border is the edge.

### Feature Card
**Role:** 2×2 or 3×2 grid cell in the Key Features section.

Charcoal canvas (no surface lift), 20px radius, 1px #9d9d9d border, 24px internal padding, top half is a square product detail photograph with no internal padding (bleeds to the card edge, clipped by the 20px radius), bottom half holds a two-line caption in Tobias-light 32px (-1.5px tracking) or GT-Flexa 24px 400.

### Hero Headline Block
**Role:** Opening product announcement that fills the first scroll.

GT-Flexa weight 200, 68–86px, line-height 1.0–1.06, color #ffffff. No text-align override needed — left-aligned by default, tracking normal, line-height tight enough that multi-line headlines stack into a single column of light. Sits directly below the video card with a 48px gap.

### Section Header (Tobias Voice)
**Role:** Delineates major sections (e.g. KEY FEATURES).

Tobias-light 400 at 42px, letter-spacing -0.062em (-2.6px), all caps in the visual system, color #ffffff. Provides an architectural label that contrasts with the weight-200 GT-Flexa body headlines.

### Editorial Paragraph
**Role:** Body copy under hero or in product descriptions.

Times 400 16px, line-height 1.2, color #ffffff. Serif body on dark background — a deliberate humanist counterpoint to the geometric display fonts. Never grows past 16px; rarity is the point.

### Top Navigation Bar
**Role:** Persistent header across all pages.

Transparent over the charcoal canvas, no background fill, no border. Left: brand mark '● Electronic Materials Office®' in white with a small orange dot prefix. Right: two ghost links (About, Updates) in #9e9eff + 1px border, then the Ember CTA. Vertical padding ~24px, sits flush to the viewport edges with internal page padding.

### Footer
**Role:** Closing block of the page.

128px top margin from the last content block, charcoal background, Tobias-light wordmark or GT-Flexa 200 at 68px as a closing statement. No card surfaces, no borders — the footer is defined by the gap above it.

### Play Overlay Button
**Role:** Centered trigger over video frames.

White fill, #000000 text reading 'Play film', 20px radius, ~16px horizontal padding. The only white-filled button in the system — functions as the inverse of the Ember CTA.

## Do's and Don'ts

### Do
- Use GT-Flexa weight 200 for every display headline at 42px and above — the whisper weight is the signature
- Apply the Ember Orange (#f45500) filled button with its 30px rgba(245,86,0,0.6) glow exactly once per viewport
- Keep all card radii at 20px and all button radii at 20px — never break to 4px or 8px
- Use #9e9eff for all inline links and outlined nav actions — it is the only cool chromatic in the system
- Hold the page canvas at #202020, not #000000 — the slight lift gives product photography room to breathe
- Let Tobias-light 32–42px carry section labels with its -2.6px tracking — it provides the architectural voice
- Define surface edges with 1px #9d9d9d or #ffffff borders rather than shadow or background shifts

### Don't
- Do not use Times or any serif for headings, labels, or UI chrome — it is body copy only
- Do not apply the Ember Orange glow to anything other than the primary CTA
- Do not introduce additional saturated brand colors — the system is orange + violet on charcoal
- Do not use weight 400 or above for display headlines above 42px — the 200 weight is non-negotiable
- Do not add box-shadows to cards, images, or navigation — shadows are reserved for the two button variants
- Do not center body copy or paragraph text — left alignment only, matching the hero headline
- Do not round anything below 16px — the system commits to soft, large radii

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Studio Floor | `#202020` | Page background — the base of the gallery |
| 1 | Card Matte | `#202020` | Feature cards and media frames sit on the same charcoal as the canvas, defined by 1px borders rather than surface shifts |
| 2 | Inverted Panel | `#eaeaea` | Light scrim or modal surface when the system inverts |

## Elevation

- **Primary CTA (Ember Orange filled button):** `0px 0px 30px 0px rgba(245, 86, 0, 0.6)`
- **Secondary CTA (white ghost button on dark):** `0px 0px 30px 0px rgba(255, 255, 255, 0.3)`

## Imagery

Imagery is product-only — close-up macro photography of the Altar I keyboard shot against pure black, lit from above so the chassis glows and keycap legends catch rim light. No lifestyle, no human hands, no environmental context. Treatment is consistently high-contrast and dark; the only color that escapes the monochrome palette is the orange power switch on the keyboard itself, which echoes the Ember Orange CTA. Images are square or 16:9, always contained within 20px-radius cards, and they bleed to the card edge (no internal padding around the photo, caption sits below the bleed). Icon style: the only iconography is the small filled circle (●) prefixing the wordmark — a single orange dot, weight ~6px.

## Layout

Full-bleed charcoal canvas with centered max-width content (~1200px). The hero opens with a 20px-radius media card containing the product film, sitting roughly 80% viewport width, followed immediately by a multi-line GT-Flexa 200 headline that wraps across nearly the full content width. Section rhythm: one feature section with a Tobias-light all-caps label, then a 2×2 (on desktop) card grid of feature tiles. Cards use 1px #9d9d9d borders and 24px gaps between them. Generous vertical breathing — sections are separated by 48–128px of charcoal negative space rather than dividers. Navigation is a single transparent bar pinned to the top with a ghost-link cluster and one Ember CTA. No sidebar, no mega-menu, no secondary navigation.

## Agent Prompt Guide

Quick Color Reference
- text: #ffffff
- background: #202020
- border: #9d9d9d
- accent (link/outline): #9e9eff
- primary action: #f45500 (filled action)

Example Component Prompts
1. Hero section: #202020 canvas, 20px-radius media card 1200px wide with a 1px #9d9d9d border, centered 'Play film' pill button (#ffffff fill, #000000 text, 20px radius). Below at 48px: GT-Flexa 200 headline at 68px line-height 1.06, color #ffffff, left aligned.
2. Feature card: 20px radius, 1px #9d9d9d border, charcoal background. Top half is a square product photograph bleeding to the card edge. Bottom half has 24px padding with a two-line caption in Tobias-light 32px weight 400, letter-spacing -1.5px, color #ffffff.
3. Create a Primary Action Button: #f45500 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
4. Ghost secondary action: transparent background, 1px #ffffff border, 20px radius, white text, 30px rgba(255,255,255,0.3) glow.
5. Outlined nav link: 1px #9e9eff border, 20px radius, #9e9eff text, ~8px vertical padding, 14px horizontal padding.

## Similar Brands

- **Teenage Engineering** — Same matte-black product-page gallery with a single saturated accent and ultra-light display type that treats the object as the only light source
- **Keychron** — Mechanical keyboard product pages built on dark charcoal canvases with generous negative space and minimal UI chrome around large product photography
- **Nothing (tech)** — Premium dark-mode hardware brand with a dot-matrix wordmark, restraint in color use, and product photography that bleeds to card edges
- **Grovemade** — Matte dark product pages with serif body copy beneath large display headlines, treating each product drop like a gallery exhibition
- **Aesop** — Editorial dark surfaces with serif body text, all-caps section labels, and the discipline to use only one warm accent across the entire system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-studio-charcoal: #202020;
  --color-bone-white: #ffffff;
  --color-ash-gray: #9d9d9d;
  --color-mid-felt: #eaeaea;
  --color-carbon: #000000;
  --color-ember-orange: #f45500;
  --color-lavender-link: #9e9eff;

  /* Typography — Font Families */
  --font-gt-flexa: 'GT-Flexa', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias-light: 'Tobias-light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-subheading-lg: 26px;
  --leading-subheading-lg: 1.2;
  --text-subheading-xl: 28px;
  --leading-subheading-xl: 1.2;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.536px;
  --text-heading: 42px;
  --leading-heading: 1.2;
  --tracking-heading: -2.604px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.06;
  --text-display: 86px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-128px;
  --card-padding: 24px;
  --element-gap: 4-8px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-buttons: 20px;

  /* Shadows */
  --shadow-xl: rgba(245, 86, 0, 0.6) 0px 0px 30px 0px;
  --shadow-xl-2: rgba(255, 255, 255, 0.3) 0px 0px 30px 0px;

  /* Surfaces */
  --surface-studio-floor: #202020;
  --surface-card-matte: #202020;
  --surface-inverted-panel: #eaeaea;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-studio-charcoal: #202020;
  --color-bone-white: #ffffff;
  --color-ash-gray: #9d9d9d;
  --color-mid-felt: #eaeaea;
  --color-carbon: #000000;
  --color-ember-orange: #f45500;
  --color-lavender-link: #9e9eff;

  /* Typography */
  --font-gt-flexa: 'GT-Flexa', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tobias-light: 'Tobias-light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-subheading-lg: 26px;
  --leading-subheading-lg: 1.2;
  --text-subheading-xl: 28px;
  --leading-subheading-xl: 1.2;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.536px;
  --text-heading: 42px;
  --leading-heading: 1.2;
  --tracking-heading: -2.604px;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.06;
  --text-display: 86px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;

  /* Shadows */
  --shadow-xl: rgba(245, 86, 0, 0.6) 0px 0px 30px 0px;
  --shadow-xl-2: rgba(255, 255, 255, 0.3) 0px 0px 30px 0px;
}
```
