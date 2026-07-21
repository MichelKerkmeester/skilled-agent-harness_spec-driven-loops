# AngelList — Style Reference
> midnight greenhouse with violet dawn — a near-black teal void where mint-green serif type glows and lavender buttons bloom as the single point of warm light

**Theme:** dark

AngelList operates as a midnight greenhouse: an almost-black teal canvas (#001d21) is the floor, mint-green serif display type (#e0fee6) glows as if bioluminescent, and one lavender-violet accent (#cdcbff) punctuates the interface like a dawn light. The visual system is dark-first — the entire page sits on the deep teal, including cards, navigation, and footer — creating a nocturnal, private-banking atmosphere rather than a typical SaaS light mode. Typography is the hero: a custom serif display face renders numerical and headline copy at extreme sizes (90–216px) with tight negative tracking, while a neutral sans handles all UI chrome. Surfaces are flat with minimal elevation; depth comes from tonal shifts between near-black teals and occasional earth-toned full-bleed bands (olive grove, mint wash). Photography is warm-toned lifestyle — people in natural light, working — contained within rounded cards that sit on the dark canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyssal Teal | `#001d21` | `--color-abyssal-teal` | Page canvas, hero background, navigation surface, footer, primary text on light surfaces — the void that everything sits on |
| Deep Reef | `#002b31` | `--color-deep-reef` | Elevated card surfaces, secondary buttons, filled chip backgrounds — one tonal step above the canvas to create subtle depth without leaving the dark family |
| Bio Mint | `#e0fee6` | `--color-bio-mint` | Display headlines, hero copy, large numerical type — bioluminescent mint that carries the brand's visual identity on the dark canvas |
| Lavender Dawn | `#cdcbff` | `--color-lavender-dawn` | Violet text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Vivid Iris | `#3a25f5` | `--color-vivid-iris` | Outlined link borders, chromatic accent borders, selected/active link text — high-saturation violet for moments that need a sharper electric accent |
| Pale Periwinkle | `#bdbbff` | `--color-pale-periwinkle` | Secondary button fill, hover state for lavender actions — lighter wash of the primary violet for tonal stepping |
| Mint Whisper | `#cdeed3` | `--color-mint-whisper` | Navigation accents, stroke details, secondary mint highlights — a desaturated version of the headline mint for subtle interface details |
| Olive Grove | `#5d5337` | `--color-olive-grove` | Full-bleed earth-toned section background, warm break-band — introduces an unexpected organic warmth to the dark system |
| Dark Olive | `#544a2e` | `--color-dark-olive` | Borders and text within olive-toned sections, link borders on warm bands |
| Fog Veil | `#f1f3f2` | `--color-fog-veil` | Light surface break, navigation pill backgrounds, light-mode card surfaces — the neutral that appears when the system briefly surfaces to light |
| Paper White | `#ffffff` | `--color-paper-white` | Outlined button text, light card surfaces, inverted text on dark, image card content backgrounds |
| Graphite | `#1d2a29` | `--color-graphite` | Subtle dark borders, hairline dividers within dark sections |
| Steel | `#68706f` | `--color-steel` | Body text on light surfaces, muted helper text, secondary copy |
| Ash Border | `#ccd5d6` | `--color-ash-border` | Hairline borders across all surfaces, card outlines, divider lines, subtle structural edges |
| Pewter | `#e1e3e3` | `--color-pewter` | Secondary text on light cards, muted body copy, icon fills in neutral contexts |

## Tokens — Typography

### angellistDisplay — Display serif — reserved for hero headlines, section titles, and large numerical statements (e.g. $171B). Its single weight at 400 with extreme negative tracking (-0.04em to -0.05em) creates a compressed, sculptural quality. A serif at fintech scale is anti-convention; the choice signals editorial confidence over utility-app sterility. Substitute: 'GT Sectra', 'Tiempos Headline', or 'DM Serif Display'. · `--font-angellistdisplay`
- **Substitute:** GT Sectra
- **Weights:** 400
- **Sizes:** 28px, 38px, 60px, 90px, 112px, 216px
- **Line height:** 0.90–1.30
- **Letter spacing:** -0.04em at 60–112px, -0.05em at 216px
- **Role:** Display serif — reserved for hero headlines, section titles, and large numerical statements (e.g. $171B). Its single weight at 400 with extreme negative tracking (-0.04em to -0.05em) creates a compressed, sculptural quality. A serif at fintech scale is anti-convention; the choice signals editorial confidence over utility-app sterility. Substitute: 'GT Sectra', 'Tiempos Headline', or 'DM Serif Display'.

### angellist — Primary sans for all UI, body, navigation, buttons, cards, and micro-copy. Weights step cleanly from 400 (body) to 600 (subheadings) to 700 (emphasis). The tall line-heights (up to 2.64 for oversized text) and tabular numerals make it a working interface face. Font features 'lnum' and 'tnum' ensure consistent digit widths in financial contexts. Substitute: 'Inter', 'GT America', or 'Söhne'. · `--font-angellist`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 18px, 90px, 216px
- **Line height:** 1.10–2.64
- **Letter spacing:** -0.005em at 16px, -0.003em at 14px, -0.002em at 12px, 0.01em at small caps, 0.08em for labels
- **OpenType features:** `"lnum", "ss01", "tnum"`
- **Role:** Primary sans for all UI, body, navigation, buttons, cards, and micro-copy. Weights step cleanly from 400 (body) to 600 (subheadings) to 700 (emphasis). The tall line-heights (up to 2.64 for oversized text) and tabular numerals make it a working interface face. Font features 'lnum' and 'tnum' ensure consistent digit widths in financial contexts. Substitute: 'Inter', 'GT America', or 'Söhne'.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | 0.08px | `--text-caption` |
| heading-sm | 18px | 1.4 | -0.005px | `--text-heading-sm` |
| heading | 28px | 1.25 | -0.04px | `--text-heading` |
| heading-lg | 38px | 1.2 | -0.04px | `--text-heading-lg` |
| display | 90px | 1.1 | -0.05px | `--text-display` |
| display-xl | 216px | 0.9 | -0.05px | `--text-display-xl` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| cards | 4px |
| pills | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Lavender Filled Button
**Role:** Primary action CTA (header, high-emphasis)

Filled button with #cdcbff background, #001d21 text, 9999px (pill) radius, 10px 18px padding, 14px angellist weight 500. Text is the dark abyssal teal, creating high-contrast readability against the soft violet. Used sparingly — only the most important single action per section.

### Outlined Ghost Button
**Role:** Secondary action CTA on dark canvas

Transparent background with 1px #ffffff border, #e0fee6 (Bio Mint) text, 9999px radius, 10px 18px padding, 14px angellist weight 500. Sits on the dark teal canvas as the default body-level CTA. Mint text + white border = signature dark-mode button.

### Header Contact Sales Button
**Role:** Persistent top-right CTA

Lavender filled button (#cdcbff) with #001d21 text, slightly smaller than body CTAs. Always visible in the sticky header, contrasting against the dark navigation bar.

### Navigation Pill
**Role:** Centered top nav container

Rounded pill container (9999px radius) with subtle #f1f3f2 or translucent background holding Products, Solutions, Pricing, Resources links. Links use 14px angellist weight 400 in #e0fee6 mint. Each nav item has a small chevron indicator for dropdowns.

### Product Card
**Role:** Feature card in 4-column grid (Venture Funds, SPVs, Scout Funds, Digital Subscriptions)

Full-bleed photography card on dark canvas. Image fills the card top portion with 4px radius, followed by white headline text (16px weight 600) and description (13px weight 400 in #e1e3e3). Right-pointing arrow link in mint. No visible card border — photography edges define the card.

### Section Divider
**Role:** Horizontal rule between sections

Thin 1px line in #ccd5d6 spanning the content width, used to separate the product grid from the partner logos section.

### Partner Logo Bar
**Role:** Trust/credibility strip

Single row of 5 partner logos centered on the dark canvas, rendered in white/monochrome. No background card — logos float directly on #001d21. A pill-shaped outlined link button sits below: 'Our premier partnership program…' with arrow.

### Fund Description Banner
**Role:** Full-bleed light section with circular avatar portraits

Light mint background (#cdeed3 or pale green wash) containing a short descriptive paragraph and an underlined text link, with 3–4 circular avatar cutouts on the right edge. Creates a visual break from the dark canvas using the brand's mint family.

### By The Numbers Display Block
**Role:** Large numerical statement section

Full-bleed olive (#5d5337) background. Left column: section label, headline ('Fueling innovation') in angellistDisplay at 90px in mint/light color, and body copy in light text. Right column: monumental numerical display (e.g. '$171B') at 216px in angellistDisplay, with a caption below ('Assets on platform'). The oversized serif numeral on earth-toned ground is the system's most dramatic moment.

### Announcement Chip
**Role:** Hero eyebrow link (e.g. 'Explore the Fund Benchmarks Report 2025')

Subtle dark pill (#002b31 background) with #e0fee6 mint text at 12–13px weight 400, 9999px radius, 4px 12px padding. Includes a right arrow icon. Sits above the hero headline as a navigational teaser.

### Inverted Light CTA
**Role:** CTA appearing on light/mint sections

Outlined button with #002b31 border and #002b31 text, 9999px radius, sitting on light green (#cdeed3) background. Inverts the standard dark-mode ghost button for use on the rare light surface.

## Do's and Don'ts

### Do
- Use #001d21 as the default canvas for all full-page layouts; the dark teal is the system's identity, not a theme toggle.
- Render display headlines in angellistDisplay weight 400 at 60–216px with -0.04em to -0.05em letter-spacing; the serif compressed tight is the brand's most recognizable moment.
- Use #e0fee6 (Bio Mint) for all text and display type sitting on the dark canvas; never use pure white for primary text on #001d21.
- Apply 9999px radius to all buttons, chips, and navigation containers; 4px radius for content cards. Do not mix intermediate radii.
- Use #cdcbff (Lavender Dawn) filled buttons for single primary actions per section; pair with ghost outlined buttons in white/mint for secondary actions.
- Set font-feature-settings to 'lnum', 'ss01', 'tnum' on all text rendering; tabular numerals are critical for financial data.
- Separate sections with 80px vertical gaps and thin 1px #ccd5d6 divider lines on the dark canvas.

### Don't
- Do not introduce drop shadows anywhere in the interface; depth comes from tonal stepping between #001d21 and #002b31 only.
- Do not use pure white (#ffffff) as body text on the dark canvas; use #e0fee6 (Bio Mint) for primary text and #e1e3e3 (Pewter) for secondary.
- Do not apply intermediate border radii (8px, 12px) to buttons or chips; the system is binary: 4px for cards, 9999px for interactive elements.
- Do not use the multi-color gradient as a page or section background; it is a decorative brand swatch only, never a surface treatment.
- Do not place more than one filled lavender (#cdcbff) CTA per section; the violet should feel like a singular warm point, not scattered.
- Do not use angellistDisplay for body copy or UI labels; reserve it exclusively for display-scale headlines (60px+) and numerical statements.
- Do not introduce light-mode as a default; the system is dark-first. Light surfaces (#f1f3f2, #cdeed3) appear only as intentional break bands, not as page backgrounds.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Abyssal Teal | `#001d21` | Base page canvas — the dark teal void that fills the viewport |
| 2 | Deep Reef | `#002b31` | Card and button surface — subtle elevation within the dark family |
| 3 | Fog Veil | `#f1f3f2` | Light break surface — navigation pill, occasional light-band sections |
| 4 | Olive Grove | `#5d5337` | Earth-toned full-bleed band — warm contrast section |

## Elevation

- **Product Cards:** `none — flat photography edges on dark canvas define the card boundary without shadow`
- **All UI elements:** `none — the system avoids drop shadows entirely`

## Imagery

Photography is warm, natural-light lifestyle: people working with phones, in meetings, outdoors. Images are full-bleed within cards with 4px radius corners, never masked into circles. The tone is golden-hour warm against the cool teal canvas — a deliberate warm/cool tension. The fund description banner uses circular avatar crops for faces. No product screenshots or abstract 3D renders appear; the photography carries all the human warmth. The only non-photographic visual is a multi-color gradient swatch that appears as a decorative brand element.

## Layout

Full-bleed dark canvas with max-width 1280px centered content. Hero is a left-aligned text block (headline + subhead + CTA) on the dark void with no hero image — the typography is the hero. Below: 4-column equal-width product card grid with generous gutters. A thin divider line separates the partner logo strip (centered single row). Then a full-bleed light mint band with text-left, avatars-right composition. Finally, a full-bleed olive section with a 2-column split: descriptive text left, monumental numeral right. Navigation is a centered pill floating in the header, not a full-width bar. Section gaps are 80px. The rhythm is: dark → dark → dark → light break → dark → warm break → dark.

## Gradient System

One signature multi-stop gradient exists: linear-gradient(195.85deg, #6258ff, #e06ab2, #fb8569, #ffb1b1, #cdcbff, #7e6f4a, #32607f, #fde8b5). It sweeps from vivid violet through pink, coral, lavender, olive, steel-blue, to cream. This is not a background gradient but a decorative brand swatch — used as a thin visual element to express the full chromatic range AngelList operates in, contrasting the otherwise restrained dark UI.

## Agent Prompt Guide

Quick Color Reference:
- Canvas: #001d21 (Abyssal Teal)
- Text on dark: #e0fee6 (Bio Mint)
- Body/muted text: #68706f (Steel) on light, #e1e3e3 (Pewter) on dark
- Border/hairline: #ccd5d6 (Ash Border)
- primary action: #002b31 (filled action)
- Accent/border: #3a25f5 (Vivid Iris) — outlined links

Example Component Prompts:
1. Create a Primary Action Button: #002b31 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. Build a product card grid (4 columns): Each card has a full-bleed warm-toned lifestyle photo at 4px radius on top, then 16px weight 600 #ffffff headline, 13px weight 400 #e1e3e3 description, and a #e0fee6 arrow link. No card border, no shadow.
3. Create a 'by the numbers' section: full-bleed #5d5337 background, two-column layout. Left: 90px angellistDisplay #e0fee6 headline, 16px body text in #e1e3e3. Right: 216px angellistDisplay numerical statement in #e0fee6, letter-spacing -0.05em, line-height 0.9.
4. Build a navigation pill: 9999px radius container with #f1f3f2 or translucent dark background, containing 4 nav items at 14px angellist weight 400 in #e0fee6, each with a small chevron.
5. Create a fund description banner: #cdeed3 light mint background, left-aligned descriptive text with underlined #002b31 link, right side showing 3-4 circular avatar crops overlapping the section edge.

## Similar Brands

- **Mercury** — Same dark-teal financial aesthetic with full-bleed dark canvas and warm-toned photography; both use a single restrained accent color for actions.
- **Plaid** — Dark-mode fintech with large display type, minimal elevation, and a deep near-black canvas; both let typography carry hierarchy without surface layering.
- **Brex** — Bold dark canvas with oversized numerical/statistical display type and minimal card elevation; both treat financial data as visual centerpiece.
- **Linear** — Dark-mode product UI with pill-shaped navigation and buttons, tight letter-spacing on large type, and a near-monochrome palette with single accent color.
- **Arc** — Dark-canvas financial interface with pill navigation, warm photography contrasting cool canvas, and restrained single-accent CTA system.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyssal-teal: #001d21;
  --color-deep-reef: #002b31;
  --color-bio-mint: #e0fee6;
  --color-lavender-dawn: #cdcbff;
  --color-vivid-iris: #3a25f5;
  --color-pale-periwinkle: #bdbbff;
  --color-mint-whisper: #cdeed3;
  --color-olive-grove: #5d5337;
  --color-dark-olive: #544a2e;
  --color-fog-veil: #f1f3f2;
  --color-paper-white: #ffffff;
  --color-graphite: #1d2a29;
  --color-steel: #68706f;
  --color-ash-border: #ccd5d6;
  --color-pewter: #e1e3e3;

  /* Typography — Font Families */
  --font-angellistdisplay: 'angellistDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-angellist: 'angellist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.08px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.005px;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --tracking-heading: -0.04px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.04px;
  --text-display: 90px;
  --leading-display: 1.1;
  --tracking-display: -0.05px;
  --text-display-xl: 216px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -0.05px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-cards: 4px;
  --radius-pills: 9999px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-abyssal-teal: #001d21;
  --surface-deep-reef: #002b31;
  --surface-fog-veil: #f1f3f2;
  --surface-olive-grove: #5d5337;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyssal-teal: #001d21;
  --color-deep-reef: #002b31;
  --color-bio-mint: #e0fee6;
  --color-lavender-dawn: #cdcbff;
  --color-vivid-iris: #3a25f5;
  --color-pale-periwinkle: #bdbbff;
  --color-mint-whisper: #cdeed3;
  --color-olive-grove: #5d5337;
  --color-dark-olive: #544a2e;
  --color-fog-veil: #f1f3f2;
  --color-paper-white: #ffffff;
  --color-graphite: #1d2a29;
  --color-steel: #68706f;
  --color-ash-border: #ccd5d6;
  --color-pewter: #e1e3e3;

  /* Typography */
  --font-angellistdisplay: 'angellistDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-angellist: 'angellist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.08px;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.005px;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --tracking-heading: -0.04px;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.04px;
  --text-display: 90px;
  --leading-display: 1.1;
  --tracking-display: -0.05px;
  --text-display-xl: 216px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -0.05px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```
