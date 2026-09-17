# Secure — Style Reference
> European café conversation in soft daylight — a warm, editorial take on video calling where serif headlines read like a thoughtful magazine spread rather than a tech product page.

**Theme:** light

Whereby presents a warm, humanized SaaS aesthetic that feels more like a thoughtful European brand than a tech tool. The system is defined by a custom condensed serif (Roslindale) used for display headlines, giving every section an editorial, considered feel — paired with Inter for body and UI to keep the interface functional and calm. A single deep violet (#2b189b) carries brand intent on CTAs and active states, while a warm blush (#f8dbd5) provides section-level atmosphere without competing with content. The visual rhythm alternates between full-bleed blush hero, white content sections, and soft gray cards — creating a gentle cadence rather than a stark corporate grid. Photography is warm and lifestyle-driven (people on laptops in real homes), and the overall feeling is unhurried, private, and European.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, nav links, icons, body copy — near-absolute dominance means the system runs on contrast, not on color |
| Paper White | `#ffffff` | `--color-paper-white` | Page background and card surfaces; the default canvas everything sits on |
| Mist Gray | `#f4f4f4` | `--color-mist-gray` | Soft surface for secondary cards and section bands; lifts content off the white canvas without introducing a new hue |
| Pale Blush | `#f8dbd5` | `--color-pale-blush` | Warm section background (hero, accent bands) — the signature warmth of the brand, not a tint of any other color |
| Faded Lilac | `#cccccc` | `--color-faded-lilac` | Disabled or muted control surface — barely visible, intentionally recessive |
| Iris Violet | `#2b189b` | `--color-iris-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Indigo Depth | `#211375` | `--color-indigo-depth` | Hover and pressed state of the Iris Violet button; deeper shift of the same hue for state feedback |
| Forest Teal | `#006654` | `--color-forest-teal` | Teal supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Whereby Roslindale Display Condensed — Display headlines (hero, section titles). Custom condensed serif used at 80–120px is a signature choice — most SaaS brands default to sans-serif display; this serif elevates copy to editorial weight · `--font-whereby-roslindale-display-condensed`
- **Substitute:** Playfair Display, DM Serif Display, or any high-contrast condensed serif
- **Weights:** 400
- **Sizes:** 40px, 48px, 80px, 120px
- **Line height:** 1.15–1.25
- **Role:** Display headlines (hero, section titles). Custom condensed serif used at 80–120px is a signature choice — most SaaS brands default to sans-serif display; this serif elevates copy to editorial weight

### Whereby Roslindale Text — Card titles and mid-size headings; same family as display but in a text cut with more comfortable proportions for shorter lines · `--font-whereby-roslindale-text`
- **Substitute:** Source Serif Pro, Lora
- **Weights:** 400
- **Sizes:** 18px, 24px, 28px
- **Line height:** 1.25
- **Role:** Card titles and mid-size headings; same family as display but in a text cut with more comfortable proportions for shorter lines

### Inter — Body copy, navigation, button labels, tags. Weight 500 for nav and labels, 600 for emphasized UI text. Negative tracking tightens Inter at 18px to match the editorial density of the serif · `--font-inter`
- **Substitute:** Inter (same), or system-ui as fallback
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1.50
- **Letter spacing:** -0.016em at 18px body, -0.028em at 24px+ headings
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Body copy, navigation, button labels, tags. Weight 500 for nav and labels, 600 for emphasized UI text. Negative tracking tightens Inter at 18px to match the editorial density of the serif

### System Sans — Fallback rendering layer; not used in primary composition but extracted as the underlying stack · `--font-system-sans`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.20
- **Role:** Fallback rendering layer; not used in primary composition but extracted as the underlying stack

### Inter-Medium — Inter-Medium — detected in extracted data but not described by AI · `--font-inter-medium`
- **Weights:** 500
- **Sizes:** 12px, 16px, 18px
- **Line height:** 1, 1.5
- **Role:** Inter-Medium — detected in extracted data but not described by AI

### Inter-SemiBold — Inter-SemiBold — detected in extracted data but not described by AI · `--font-inter-semibold`
- **Weights:** 600
- **Sizes:** 14px
- **Line height:** 1.25
- **Role:** Inter-SemiBold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | -0.29px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.67px | `--text-heading-sm` |
| heading | 40px | 1.15 | — | `--text-heading` |
| heading-lg | 48px | 1.15 | — | `--text-heading-lg` |
| display | 80px | 1.15 | — | `--text-display` |
| display-xl | 120px | 1.15 | — | `--text-display-xl` |

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
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| small | 4px |
| images | 12px |
| buttons | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 24-40px
- **Element gap:** 8-16px

## Components

### Primary Action Button
**Role:** Filled CTA for the main conversion on a screen (Get started, Explore Meetings, Learn more)

Filled with #2b189b, white text at 16px Inter Medium. Pill radius of 40px (full rounding). Padding 14px 24px. Subtle hover transition to #211375. No border, no shadow — the color and shape do all the work.

### Outline Action Button
**Role:** Secondary CTA used in nav (Log in) when the primary action is filled

1px solid #2b189b border, transparent fill, #2b189b text at 16px Inter Medium. Same 40px pill radius. Becomes a soft #2b189b wash on hover.

### Text Nav Link
**Role:** Top-level navigation items: Products, Pricing, Developers, Resources

Inter 16px Medium, #000000. No underline. Small chevron caret in #000000 for dropdown triggers. 8px vertical padding inside a transparent hit area.

### Trust Badge Strip
**Role:** Horizontal row of partner/company logos below the hero

Centered group on white, preceded by a small Inter caption 'Trusted by leading companies like' in #000000 at 14px. Logos render at their native color, separated by 48-64px gaps. No background card or border.

### Use Case Pill Tag
**Role:** Small label above card titles (e.g. 'meetings', '< > embedded')

Outlined pill: 1px solid #cccccc, 12px Inter Medium #000000, padding 4px 10px, radius 4px. Sits flush-left above each card heading.

### Product Feature Card
**Role:** Two-column product showcase: browser mockup on top, title and CTA below

Transparent background on white canvas. Browser mockup sits in a 12px-radius container with a soft shadow. Title in Roslindale Text 28px #000000. Feature list uses '+' glyph in #2b189b before each Inter 16px line. Filled violet CTA at the bottom of the card.

### Use Case Carousel Card
**Role:** Centered card for vertical-specific messaging (Telehealth, Education, etc.)

Full-width #f4f4f4 card with 20px radius. Overlapping circular avatar group on the top edge. Small Inter caption ('Whereby for') above a Roslindale Display heading (48-80px). Filled violet Learn more button centered below.

### Hero Section
**Role:** First viewport: brand promise + primary CTA + supporting photograph

Full-bleed #f8dbd5 background. Two-column layout at 1200px max-width: left column holds the Roslindale Display headline (48-80px) and body copy, right column holds a lifestyle photo inside a 12px-radius container with a soft drop shadow. Photo bleeds 24px above and below the section baseline.

### Top Navigation
**Role:** Persistent header across all pages

White background, no border or shadow. 80px tall. Wordmark left (Whereby in serif), nav links centered-left, two buttons right (Log in outline, Sign up filled). Bottom hairline of #f4f4f4 separates from content.

### Lifestyle Photograph
**Role:** Hero and section imagery showing real people in real spaces

Warm-toned, natural light, candid framing. Subjects are typically mid-shot, working on a laptop in a home or studio setting. Rounded to 12px, with a subtle 0 8px 24px rgba(0,0,0,0.08) shadow.

### Feature List Item
**Role:** Compact text row inside product cards

Leading '+' glyph in #2b189b at 16px Inter. Text in Inter 16px #000000. 8-12px vertical spacing between items.

### Browser Mockup Container
**Role:** Framed screenshot of the product UI used in feature cards

12px radius, thin 1px #f4f4f4 border, 0 12px 32px rgba(0,0,0,0.06) shadow. Traffic-light dots in the top-left corner over a white chrome bar.

## Do's and Don'ts

### Do
- Use Roslindale Display Condensed for all section-level headlines at 40px or larger; reserve the wider Roslindale Text cut for 18-28px card titles.
- Keep Inter at weights 400/500/600 only; do not introduce bold or black weights — the brand trusts the serif to carry emphasis.
- Use #2b189b exclusively for filled CTAs and the active state of the Log in outline button. Never use it for body text or decorative fills.
- Apply the 40px pill radius to every button, regardless of size, to maintain the signature soft-cornered action shape.
- Lean on #f8dbd5 blush for hero and section accent bands at full-bleed width, then return to #ffffff for content-heavy sections.
- Pair every photograph with a 12px radius and the 0 8px 24px rgba(0,0,0,0.08) shadow — never crop images to sharp corners.
- Use the '+' glyph in #2b189b to lead feature list items, keeping list markers on-brand rather than defaulting to bullet dots.

### Don't
- Do not use a sans-serif font for headlines — the serif is the brand's most distinctive choice and removing it collapses the editorial feel.
- Do not introduce additional accent colors (green, blue, red) as functional UI tokens; teal #006654 is decorative-only and must not appear on buttons or status badges.
- Do not add heavy drop shadows to text cards or nav — elevation is reserved for photos and product mockups only.
- Do not flatten the button radius to 4px or 8px; the 40px pill is a signature and must be consistent across all action variants.
- Do not use #000000 for filled button backgrounds — buttons read as interactive only because they are colored, not dark.
- Do not stretch Roslindale Display below 40px or above 120px; outside that range the condensed proportions break.
- Do not stack multiple saturated brand colors in the same component; the system is built on one strong violet plus warmth, not polychrome.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Default page canvas |
| 1 | Pale Blush | `#f8dbd5` | Warm hero and accent section background |
| 2 | Mist Gray | `#f4f4f4` | Secondary card and band surface |
| 3 | Paper White on Mist | `#ffffff` | Elevated product card and modal surface |

## Elevation

- **Lifestyle Photograph:** `0 8px 24px rgba(0,0,0,0.08)`
- **Browser Mockup Container:** `0 12px 32px rgba(0,0,0,0.06)`
- **Use Case Carousel Card:** `none (relies on #f4f4f4 surface contrast, not shadow)`

## Imagery

Photography is the dominant visual asset. All imagery is lifestyle photography: real people working on laptops in warm-lit homes, kitchens, and studios. No stock-photo stiffness — framing is candid, mid-shot, often with plants or domestic objects in the background. Color treatment is natural, slightly warm, never desaturated or duotone. The only non-photographic visual is the browser-mocked product UI (screenshots of video calls in green and purple chrome). Icons in the UI are line-style at ~1.5px stroke, monochrome black, no fill. Photography occupies roughly 35-40% of the page area, concentrated in the hero and product feature cards.

## Layout

Page is centered, max-width 1200px with generous outer margins. The hero is a split layout: text-left / image-right, on a full-bleed blush background. Below the hero, a white trust-badge strip runs edge-to-edge. Subsequent sections alternate between white and #f4f4f4 surface bands, each holding centered content blocks. Product features use a 2-column card grid; use-case messaging uses a single centered carousel card with side-arrows. Vertical rhythm is comfortable: 48-80px between sections, 24-40px inside cards. Navigation is a single white top bar, sticky on scroll, with the wordmark left, links center-left, and two right-aligned action buttons. No sidebar, no mega-menu visible in the hero state — dropdowns are simple flyout panels.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- secondary surface: #f4f4f4
- hero/accent surface: #f8dbd5
- primary action: no distinct CTA color
- accent: #006654 (decorative only)

**Example Component Prompts**

1. **Hero Section**: Full-bleed #f8dbd5 background. Two-column at 1200px max-width. Left column: Roslindale Display Condensed 56px #000000 headline with -0.028em tracking, Inter 18px #000000 subtext, filled #2b189b pill button (40px radius, 14px 24px padding, white Inter 16px Medium label). Right column: lifestyle photo in a 12px-radius container with shadow 0 8px 24px rgba(0,0,0,0.08).

2. **Product Feature Card**: White canvas, no card background. Browser mockup at top inside a 12px-radius frame with 1px #f4f4f4 border and 0 12px 32px rgba(0,0,0,0.06) shadow. Outlined pill tag above title: 1px #cccccc, 12px Inter Medium, 4px radius. Title in Roslindale Text 28px #000000. Feature list with '+' in #2b189b, Inter 16px #000000 lines, 12px vertical gap. Filled #2b189b pill button below.

3. **Use Case Carousel Card**: #f4f4f4 background, 20px radius, 1200px wide, centered. Overlapping circular avatar row on the top edge. Caption 'Whereby for' in Inter 14px Medium #000000. Roslindale Display Condensed 64px #000000 for the vertical name. Body in Inter 18px #000000. Filled #2b189b pill button centered.

4. **Top Navigation**: White background, 80px height, no shadow, 1px #f4f4f4 bottom border. Left: wordmark in Roslindale. Center-left: Inter 16px Medium #000000 nav links with 32px gap. Right: outline #2b189b Log in button (1px border, 40px radius), then filled #2b189b Sign up button (40px radius, white text).

5. **Trust Badge Strip**: White background, centered. Caption 'Trusted by leading companies like' in Inter 14px #000000, 32px below. Row of 6 company logos at native colors, 48px gaps between, 24px margin top.

## Similar Brands

- **Notion** — Same warm, editorial SaaS approach with a single confident accent color and comfortable white-canvas density
- **Loom** — Lifestyle photography of people on laptops in warm-lit homes, paired with clean sans body and minimal UI chrome
- **Linear** — One saturated brand color used sparingly on CTAs and active states, with everything else monochrome and editorial
- **Arc** — Browser-product brand that uses photography and soft color washes to humanize a tech product
- **Calendly** — Friendly SaaS with a single violet/indigo accent, comfortable spacing, and a tone that reads warmer than its category

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #f4f4f4;
  --color-pale-blush: #f8dbd5;
  --color-faded-lilac: #cccccc;
  --color-iris-violet: #2b189b;
  --color-indigo-depth: #211375;
  --color-forest-teal: #006654;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whereby-roslindale-display-condensed: 'Whereby Roslindale Display Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whereby-roslindale-text: 'Whereby Roslindale Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-semibold: 'Inter-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.29px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.67px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --text-display: 80px;
  --leading-display: 1.15;
  --text-display-xl: 120px;
  --leading-display-xl: 1.15;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 24-40px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-small: 4px;
  --radius-images: 12px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-pale-blush: #f8dbd5;
  --surface-mist-gray: #f4f4f4;
  --surface-paper-white-on-mist: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #f4f4f4;
  --color-pale-blush: #f8dbd5;
  --color-faded-lilac: #cccccc;
  --color-iris-violet: #2b189b;
  --color-indigo-depth: #211375;
  --color-forest-teal: #006654;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whereby-roslindale-display-condensed: 'Whereby Roslindale Display Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whereby-roslindale-text: 'Whereby Roslindale Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-semibold: 'Inter-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.29px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.67px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --text-display: 80px;
  --leading-display: 1.15;
  --text-display-xl: 120px;
  --leading-display-xl: 1.15;

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
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
}
```
