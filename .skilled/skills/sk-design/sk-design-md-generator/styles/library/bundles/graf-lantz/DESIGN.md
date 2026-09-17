# Graf Lantz — Style Reference
> Scandinavian atelier on raw linen — one violet stroke of urgency inside an otherwise bone-white room.

**Theme:** light

Graf Lantz reads as a Scandinavian atelier on raw linen: bone-white canvas, a single brand violet used almost as punctuation, and product photography that is cropped so close the felt texture becomes the atmosphere. The page is overwhelmingly typographic and whitespace-driven, with 99% achromatic surfaces and one accent surface reserved for actions. Type stays in a tight, slightly condensed grotesque (NeueHaasUnica) for utility, while a softer, almost humanist display face (accessibly) is reserved for the wordmark and key CTAs — the contrast is between machine-crish utility text and warm display moments. Components are paper-thin: no shadows, no elevation stacks, hairline borders in the #474747–#212121 range, and pill-shaped controls with ~50px radius. Density is comfortable to airy; every product frame is meant to feel like an object on a gallery shelf.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surfaces, inverted text on dark washes. The neutral ground everything else is mounted on |
| Soft Ash | `#eeeeee` | `--color-soft-ash` | Light neutral action fill for buttons on dark surfaces. |
| Mist Sage | `#d5e4e8` | `--color-mist-sage` | Announcement bar and quiet informational washes — a desaturated teal that reads as utility, never as decoration |
| Graphite | `#474747` | `--color-graphite` | Primary body text, default borders, the dominant hairline tone. The structural neutral of the system |
| Charcoal | `#212121` | `--color-charcoal` | Headings, list item dividers, emphasis borders — the darkening step when hierarchy needs weight |
| Onyx | `#000000` | `--color-onyx` | Body text where maximum contrast is required, SVG icon fills, the occasional heavy border |
| Slate | `#2b2b2b` | `--color-slate` | Navigation border accents and nav text — sits between Graphite and Onyx, reserved for chrome |
| Fog | `#7b7b7b` | `--color-fog` | Medium-contrast borders, control outlines, and structural separators. Do not promote it to the primary CTA color |
| Indigo Pulse | `#574cd5` | `--color-indigo-pulse` | Filled CTA button background, the single chromatic moment in the system. Used sparingly so the action reads as switched-on against an otherwise monochrome page |

## Tokens — Typography

### NeueHaasUnicaW1G — The workhorse grotesque for navigation, body copy, list items, footers, buttons, and links. The 900 weight is reserved for the logo wordmark and heaviest display moments; 500 carries sub-emphasis; 400 is the default body voice. · `--font-neuehaasunicaw1g`
- **Substitute:** Inter, Neue Haas Grotesk, Söhne
- **Weights:** 400, 500, 900
- **Sizes:** 12, 14, 16
- **Line height:** 1.0, 1.2, 1.4, 1.5
- **Letter spacing:** normal across all sizes
- **Role:** The workhorse grotesque for navigation, body copy, list items, footers, buttons, and links. The 900 weight is reserved for the logo wordmark and heaviest display moments; 500 carries sub-emphasis; 400 is the default body voice.

### Instrument Sans — Secondary sans for nav, search input, and section headings. Slightly warmer and more humanist than NeueHaas — used where the page needs a softer informational register without leaving the neutral palette. · `--font-instrument-sans`
- **Substitute:** Inter, Geist, Söhne
- **Weights:** 400, 500
- **Sizes:** 14, 16, 32
- **Line height:** 1.2
- **Role:** Secondary sans for nav, search input, and section headings. Slightly warmer and more humanist than NeueHaas — used where the page needs a softer informational register without leaving the neutral palette.

### accessibly — The display/brand voice. Used for the 'graf lantz' wordmark, the 'SHOP COASTERS' pill CTA, and the hero heading. The 1.0 line-height and slightly humanist geometry make it sit above the system rather than inside it. · `--font-accessibly`
- **Substitute:** Söhne Schmal, Neue Haas Grotesk Display, ABC Diatype Mono (display cuts)
- **Weights:** 400
- **Sizes:** 16, 35
- **Line height:** 1.0
- **Role:** The display/brand voice. Used for the 'graf lantz' wordmark, the 'SHOP COASTERS' pill CTA, and the hero heading. The 1.0 line-height and slightly humanist geometry make it sit above the system rather than inside it.

### Source Sans Pro — Minor fallback — appears once, treat as legacy/utility and do not introduce into new screens. · `--font-source-sans-pro`
- **Substitute:** Source Sans 3
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.2
- **Role:** Minor fallback — appears once, treat as legacy/utility and do not introduce into new screens.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| heading | 32px | 1.2 | — | `--text-heading` |
| display | 35px | 1 | — | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 64 | 64px | `--spacing-64` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 50px (pill) |
| images | 0px |
| inputs | 0px |
| buttons | 50px (pill) |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 50-80px
- **Card padding:** 24-28px
- **Element gap:** 15-24px

## Components

### Announcement Bar
**Role:** Site-wide utility strip

Full-bleed band, Mist Sage (#d5e4e8) background, centered single-line message. 14px NeueHaasUnicaW1G weight 500, Charcoal (#212121) text. No border, no shadow. Used only for shipping/promo info — never decorative.

### Primary Navigation Header
**Role:** Top-of-page chrome

White background, 1px Slate (#2b2b2b) bottom border. Logo (accessibly 35px, weight 400) left-aligned; nav links (NeueHaasUnicaW1G 14px, weight 500, Charcoal #212121) center cluster; search input + account + cart icons right-aligned. 28px vertical padding on the link row.

### Nav Link
**Role:** Top-nav interactive item

NeueHaasUnicaW1G 14px weight 500, color Charcoal (#212121), letter-spacing normal. No default underline; hover introduces a 1px Charcoal (#212121) underline at the baseline. Padding 28px vertical, 10px horizontal for generous click targets.

### Search Input
**Role:** Header search field

Soft Ash (#eeeeee) fill, no visible border at rest, placeholder text in Instrument Sans 16px weight 400 in Fog (#7b7b7b). Search icon right-aligned. Rounded at 0px — this is a flat UI input, not a pill.

### Pill Display CTA
**Role:** Hero / featured action button

White fill, 1px Charcoal (#212121) border, 50px border-radius (full pill). Text: accessibly 16px weight 400, tracked normal, in Charcoal. 16px vertical / 32px horizontal padding. Sits over a product image with no shadow — the photo IS the elevation.

### Filled Brand CTA
**Role:** Primary commerce action

Indigo Pulse (#574cd5) fill, white text. NeueHaasUnicaW1G 16px weight 500, tracked normal. 50px border-radius (pill). 15px vertical / 24px horizontal padding. The only chromatic surface in the system — treat as a single accent, not a palette.

### Text Link
**Role:** Inline editorial link

Fog (#7b7b7b) text at rest, 1px Fog underline; hover deepens to Charcoal (#212121) text and Charcoal underline. 4–5px vertical padding to give the underline breathing room from the line.

### Body Paragraph
**Role:** Long-form copy block

NeueHaasUnicaW1G 16px weight 400, line-height 1.5, color Graphite (#474747). 7–8px margin between paragraphs. No first-line indent, no drop cap — the reading rhythm is purely vertical spacing.

### Empty / Error State
**Role:** 404 and zero-result screens

Centered vertical stack on white canvas. 'Oops!' eyebrow in accessibly 16px, headline in Instrument Sans 32px weight 500, helper line in NeueHaasUnicaW1G 16px Graphite. Followed by a single pill CTA on a full-bleed product image. Generous ~80px top margin to make the absence feel intentional.

### Product Image Block
**Role:** Hero visual / editorial frame

Square or near-square photograph, 0px radius, full-bleed within its column. No border, no caption overlay, no badge. Treated as a gallery object — the frame, not the chrome, defines the edge.

### Icon Button (Account / Cart)
**Role:** Compact header control

16–20px stroke icon in Onyx (#000000), no background, no border. 10px horizontal padding. Touch target is provided by the padding, not a visible hit area.

### List Divider
**Role:** Row separator in lists, menus, footers

1px Charcoal (#212121) horizontal rule at full row width. No padding tricks, no double rules — the divider is the visual event, not the rows.

### Footer Link Group
**Role:** Footer column list

Stacked NeueHaasUnicaW1G 14px weight 400 links in Graphite, separated by Charcoal 1px dividers. 15–24px row padding. No column headers in bold — the group earns hierarchy through spacing, not weight.

## Do's and Don'ts

### Do
- Use #574cd5 only as a filled button background and never as a card surface, border, or accent stroke.
- Use 50px border-radius (pill) for every button and tag; keep inputs and images at 0px radius.
- Set body text in NeueHaasUnicaW1G 16px / line-height 1.5, color #474747, and let white space do the hierarchy work.
- Let product photography fill its frame at 0px radius with no overlay, badge, or caption chrome.
- Reach for the Mist Sage #d5e4e8 wash only on the announcement bar — do not introduce a second decorative surface.
- Use Instrument Sans for nav and informational headings; reserve accessibly for the wordmark and a single display moment per screen.
- Set section gaps in the 50–80px range and card padding at 24–28px; resist the urge to tighten.

### Don't
- Do not introduce additional accent hues — the system is one violet on a monochrome page.
- Do not add drop shadows to cards, buttons, or images; the design is deliberately shadowless.
- Do not use Source Sans Pro in new screens; it is legacy and breaks the NeueHaas/Instrument/accessibly trinity.
- Do not apply radius between 1px and 49px; the system is binary — pill or square.
- Do not stack the violet on a colored surface; the only backgrounds it should sit on are #ffffff or product photography.
- Do not underline nav links at rest; the underline appears only on hover and lives on the baseline, not the full box.
- Do not use #000000 for body text where #212121 or #474747 already passes contrast — reserve Onyx for iconography and maximum-emphasis moments.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background, product page surrounds, the default floor. |
| 2 | Soft Ash Surface | `#eeeeee` | Input fills, ghost button resting state, secondary surface where white-on-white would disappear. |
| 3 | Sage Wash | `#d5e4e8` | Announcement bar and gentle informational bands — the only chromatic non-action surface. |
| 4 | Indigo Action | `#574cd5` | The brand action surface — filled CTA only, never used as background for cards or panels. |

## Elevation

Elevation is intentionally absent. The system relies on flatness, hairline borders (1px in the #474747–#212121 family), and white space to create hierarchy rather than shadows. The only depth cue is the 50px-pill button sitting on the product photography beneath it — the pill's shadow is the product image, not a drop shadow.

## Imagery

Photography is the brand. All imagery is high-key product photography on neutral surfaces — tight crops that turn felt and fiber texture into the subject. Frames are square or near-square, full-bleed within their column, with no rounded corners, no overlays, and no lifestyle context. Lighting is soft and natural; the palette is desaturated whites, warm grays, and the occasional blush of the material itself (e.g. a rose-tinted marbled coaster). There is no illustration, no 3D, and no abstract graphics. Icons are minimal 1.5–2px stroke line icons in #000000, monoline, used only for account, cart, and search.

## Layout

Full-bleed announcement bar → white header band (max-width 1200px, centered) → generous top whitespace (~80px) → centered narrow column for editorial/empty states → full-bleed product image row. The page model is max-width contained with whitespace-led sections rather than alternating bands. Navigation is a flat top bar with a bottom hairline border; no sticky behavior, no sidebar, no mega-menu. The 404/empty template is a vertical stack: eyebrow, headline, helper, then a single product image carrying a pill CTA — the image does the work a feature grid would normally do.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #212121 (headings, emphasis) / #474747 (body)
- text muted: #7b7b7b (links at rest, helper)
- background: #ffffff (canvas) / #eeeeee (input, soft surface)
- border: #474747 (default hairline) / #212121 (emphasis divider)
- brand accent: #574cd5 (filled CTA only)
- primary action: #574cd5 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #574cd5 background, #7b7b7b text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


3. **Filled Brand CTA** — Indigo Pulse #574cd5 fill, white text. NeueHaasUnicaW1G 16px weight 500, tracked normal. 50px radius, 15px vertical / 24px horizontal padding. No border, no shadow. Use as the single chromatic action on any screen.

4. **Empty / 404 State** — White canvas, ~80px top margin. Centered vertical stack: 'Oops!' eyebrow in accessibly 16px #474747, headline 'We couldn't find…' in Instrument Sans 32px weight 500 #212121, helper line in NeueHaasUnicaW1G 16px #474747 line-height 1.5. Follow with a full-bleed product image row carrying a Pill Display CTA.

5. **Text Link in Body Copy** — Inline link in a body paragraph. Rest: #7b7b7b text with 1px #7b7b7b underline. Hover: #212121 text with 1px #212121 underline. 4px vertical padding so the underline clears the descender.

## Similar Brands

- **MUJI** — Same bone-white canvas, hairline chrome, zero elevation, and the discipline of letting a single product photograph carry the screen.
- **Mansur Gavriel** — Same restrained monochrome grid, a single chromatic surface reserved for commerce, and product crops that treat objects like gallery pieces.
- **Greats** — Same flat header with hairline bottom border, tight 14–16px grotesk nav, and full-bleed product photography without decorative chrome.
- **Aesop** — Same warm-neutral typographic register, generous vertical rhythm, and the rule that color appears only when it has a job.
- **Toast (toa.st)** — Same Scandinavian-leaning product photography on raw linen-tone backgrounds and a one-color accent used almost as punctuation.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-soft-ash: #eeeeee;
  --color-mist-sage: #d5e4e8;
  --color-graphite: #474747;
  --color-charcoal: #212121;
  --color-onyx: #000000;
  --color-slate: #2b2b2b;
  --color-fog: #7b7b7b;
  --color-indigo-pulse: #574cd5;

  /* Typography — Font Families */
  --font-neuehaasunicaw1g: 'NeueHaasUnicaW1G', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-accessibly: 'accessibly', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-display: 35px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-64: 64px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 50-80px;
  --card-padding: 24-28px;
  --element-gap: 15-24px;

  /* Border Radius */
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 50px (pill);
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 50px (pill);

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-soft-ash-surface: #eeeeee;
  --surface-sage-wash: #d5e4e8;
  --surface-indigo-action: #574cd5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-white: #ffffff;
  --color-soft-ash: #eeeeee;
  --color-mist-sage: #d5e4e8;
  --color-graphite: #474747;
  --color-charcoal: #212121;
  --color-onyx: #000000;
  --color-slate: #2b2b2b;
  --color-fog: #7b7b7b;
  --color-indigo-pulse: #574cd5;

  /* Typography */
  --font-neuehaasunicaw1g: 'NeueHaasUnicaW1G', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-accessibly: 'accessibly', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-display: 35px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-64: 64px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-full: 50px;
}
```
